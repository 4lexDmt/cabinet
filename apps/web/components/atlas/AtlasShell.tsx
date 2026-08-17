"use client";

/**
 * The instrument.
 *
 * State lives here; everything below is a function of it. Switching perspective
 * is a restyle, not a refetch: every boundary carries one property per
 * perspective, so moving from a disinterested reading to Delhi's is a change of
 * which property the ink is chosen by.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  NEUTRAL_OBSERVER,
  UNCLOS_ERA,
  inkLedger,
  type MaritimeEra,
} from "@cabinet/geo";
import { Sheet } from "./Sheet";
import { Rail } from "./Rail";
import { Legend } from "./Legend";
import { ScaleBar } from "./ScaleBar";
import { Dossier } from "./Dossier";
import { Colophon } from "./Colophon";
import { loadLayers, type LayerName, type LoadedLayer } from "@/lib/atlas/layers";
import { OVERLAYS, type OverlayId } from "@/lib/atlas/overlays";
import { SHEETS, projectionOf, registerOf, sheetById } from "@/lib/atlas/sheets";
import { perspectiveOf } from "@/lib/atlas/perspectives";

const BASE_LAYERS: LayerName[] = ["countries", "boundaries", "coastline", "places"];
const PHYSICAL_LAYERS: LayerName[] = ["bathymetry", "lakes", "rivers"];

interface Measured {
  placed: number;
  dropped: number;
  kmPerPx: number;
  declaration: string;
}

export function AtlasShell() {
  const [sheetId, setSheetId] = useState("kashmir");
  const [observer, setObserver] = useState(NEUTRAL_OBSERVER);
  const [order, setOrder] = useState<OverlayId[]>(
    OVERLAYS.filter((o) => o.defaultOn).map((o) => o.id),
  );
  const [enabled, setEnabled] = useState<Set<OverlayId>>(
    () => new Set(OVERLAYS.filter((o) => o.defaultOn).map((o) => o.id)),
  );
  const [era] = useState<MaritimeEra>(UNCLOS_ERA);
  const [selected, setSelected] = useState<string | null>(null);
  const [railOpen, setRailOpen] = useState(false);
  const [colophonOpen, setColophonOpen] = useState(true);

  const [layers, setLayers] = useState<Record<string, LoadedLayer | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [measured, setMeasured] = useState<Measured>({
    placed: 0,
    dropped: 0,
    kmPerPx: 0,
    declaration: "",
  });

  const stageRef = useRef<HTMLDivElement | null>(null);

  const sheet = sheetById(sheetId);
  const register = registerOf(sheet);
  const projection = useMemo(() => projectionOf(sheet), [sheet]);
  const perspective = perspectiveOf(observer);

  const ledger = useMemo(
    () => inkLedger(order, enabled as Set<string>, OVERLAYS),
    [order, enabled],
  );
  const active = ledger.active as OverlayId[];
  const demoted = useMemo(() => new Set(ledger.demoted as OverlayId[]), [ledger.demoted]);

  useEffect(() => {
    let cancelled = false;
    const wanted = enabled.has("physical") ? [...BASE_LAYERS, ...PHYSICAL_LAYERS] : BASE_LAYERS;
    loadLayers(wanted)
      .then((loaded) => {
        if (cancelled) return;
        setLayers((current) => {
          const next = { ...current };
          for (const layer of loaded) next[layer.name] = layer;
          return next;
        });
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: Math.max(320, Math.floor(rect.width)), height: Math.max(320, Math.floor(rect.height)) });
    };
    measure();
    const observerRef = new ResizeObserver(measure);
    observerRef.observe(node);
    return () => observerRef.disconnect();
  }, []);

  const toggleOverlay = useCallback((id: OverlayId) => {
    setEnabled((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setOrder((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }, []);

  const onMeasured = useCallback((info: Measured) => {
    setMeasured((current) =>
      current.placed === info.placed &&
      current.dropped === info.dropped &&
      current.kmPerPx === info.kmPerPx &&
      current.declaration === info.declaration
        ? current
        : info,
    );
  }, []);

  const ready = Boolean(layers.countries && layers.boundaries && layers.places) && size.width > 0;

  return (
    <div className="atlas" data-rail={railOpen ? "open" : "closed"}>
      <header className="atlas-title">
        <div className="mark">
          <span className="sheet">{sheet.label.toUpperCase()}</span>
          <span className="proj">{measured.declaration || "—"}</span>
        </div>
        <div className="spacer" />
        <div className="cell">
          <b>{register.label[0] + register.label.slice(1).toLowerCase()}</b>
          <span>ZOOM REGISTER</span>
        </div>
        <div className="cell">
          <b>{perspective.label}</b>
          <span>PERSPECTIVE — WHAT THIS GOVERNMENT BELIEVES</span>
        </div>
        <div className="cell">
          <b>{sheet.scale}</b>
          <span>
            {measured.placed} PLACES · {measured.dropped} DROPPED
          </span>
        </div>
        <div className="cell stamp">
          <b>A MAP IS A CLAIM</b>
          <span>NOT AN INSTRUMENT OF RECORD</span>
        </div>
      </header>

      <Rail
        sheets={SHEETS}
        sheetId={sheetId}
        onSheet={(id) => {
          setSheetId(id);
          setSelected(null);
          setRailOpen(false);
        }}
        observer={observer}
        onObserver={setObserver}
        parties={sheet.parties}
        overlays={OVERLAYS}
        enabled={enabled as Set<string>}
        demoted={demoted as Set<string>}
        onToggle={toggleOverlay}
        ledger={ledger}
        register={register}
        brief={sheet.brief}
      />

      <div className="atlas-stage" ref={stageRef}>
        {ready ? (
          <Sheet
            sheet={sheet}
            projection={projection}
            width={size.width}
            height={size.height}
            observer={observer}
            active={active}
            areaHolder={(ledger.areaHolder as OverlayId | null) ?? null}
            demoted={demoted}
            era={era}
            layers={layers}
            selected={selected}
            onSelect={setSelected}
            onMeasured={onMeasured}
          />
        ) : null}

        {ready ? <Legend active={active} observer={observer} era={era} /> : null}
        {ready ? <ScaleBar kmPerPx={measured.kmPerPx} /> : null}
        {ready && colophonOpen ? <Colophon onDismiss={() => setColophonOpen(false)} /> : null}

        <Dossier
          iso3={selected}
          observer={observer}
          layers={layers}
          onClose={() => setSelected(null)}
          onObserver={setObserver}
        />

        {!ready ? (
          <div className="atlas-boot">
            {error ? (
              <span>
                <b>GEOMETRY UNAVAILABLE</b>
                <small>{error}</small>
              </span>
            ) : (
              <span>
                <b>LOADING GEOMETRY…</b>
                <small>Natural Earth 1:50m and 1:10m · public domain</small>
              </span>
            )}
          </div>
        ) : null}
      </div>

      <nav className="atlas-mobile-bar" aria-label="Sheet controls">
        <button type="button" aria-pressed={railOpen} onClick={() => setRailOpen((v) => !v)}>
          Sheets &amp; layers
        </button>
        <button
          type="button"
          aria-pressed={observer !== NEUTRAL_OBSERVER}
          onClick={() => {
            const parties = sheet.parties;
            const index = parties.indexOf(observer);
            setObserver(index === -1 ? (parties[0] ?? NEUTRAL_OBSERVER) : index + 1 >= parties.length ? NEUTRAL_OBSERVER : parties[index + 1]!);
          }}
        >
          {perspective.label}
        </button>
      </nav>
    </div>
  );
}
