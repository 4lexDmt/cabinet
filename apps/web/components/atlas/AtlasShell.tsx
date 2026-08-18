"use client";

/**
 * The instrument, reduced to its base plate.
 *
 * No sheet switcher, no perspective switcher, no overlay toggles, no
 * buttons anywhere. One frame — the world, from nobody's desk — showing
 * only political boundaries and the two maritime zones that are actually
 * sovereignty-adjacent: the territorial sea and the exclusive economic
 * zone. Reading is still interactive (scroll or pinch to zoom, drag to
 * pan); the frame itself is not a control.
 *
 * The Stage 1 theatre is the same instrument with more layers, opened at
 * `/atlas?sheet=ee_black_sea_2026`. The world plate is unchanged.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { NEUTRAL_OBSERVER, UNCLOS_ERA, type MaritimeEra } from "@cabinet/geo";
import { Sheet } from "./Sheet";
import { loadLayers, type LayerName, type LoadedLayer } from "@/lib/atlas/layers";
import type { OverlayId } from "@/lib/atlas/overlays";
import { projectionOf, sheetById } from "@/lib/atlas/sheets";

const WORLD_LAYERS: LayerName[] = ["countries", "boundaries", "coastline", "canals"];
const SLICE_LAYERS: LayerName[] = [
  "countries",
  "boundaries",
  "coastline",
  "canals",
  "provinces",
  "cities",
  "roads",
  "rail",
  "ports",
  "airports",
  "chokepoints",
];

// Political holds the sheet's area ink; maritime is always demoted to line
// only, which is exactly what "maritime borders" (rather than a maritime
// wash) asks for.
const ACTIVE: OverlayId[] = ["political", "maritime"];
const DEMOTED = new Set<OverlayId>(["maritime"]);
const ERA: MaritimeEra = UNCLOS_ERA;

export function AtlasShell({ sheetId }: { sheetId?: string }) {
  const sheet = useMemo(() => sheetById(sheetId && sheetId.length > 0 ? sheetId : "world"), [sheetId]);
  const projection = useMemo(() => projectionOf(sheet), [sheet]);
  const isSlice = sheet.id === "ee_black_sea_2026";
  const layerNames = isSlice ? SLICE_LAYERS : WORLD_LAYERS;

  const [layers, setLayers] = useState<Record<string, LoadedLayer | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLayers({});
    setError(null);
    loadLayers(layerNames)
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
  }, [layerNames]);

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

  const ready = Boolean(layers.countries && layers.boundaries) && size.width > 0;

  return (
    <div className="atlas">
      <div className="atlas-stage" ref={stageRef}>
        {ready ? (
          <Sheet
            sheet={sheet}
            projection={projection}
            width={size.width}
            height={size.height}
            observer={NEUTRAL_OBSERVER}
            active={ACTIVE}
            areaHolder="political"
            demoted={DEMOTED}
            era={ERA}
            layers={layers}
            selected={null}
            onSelect={() => {}}
            onMeasured={() => {}}
          />
        ) : (
          <div className="atlas-boot">
            {error ? (
              <span>
                <b>GEOMETRY UNAVAILABLE</b>
                <small>{error}</small>
              </span>
            ) : (
              <span>
                <b>LOADING GEOMETRY…</b>
                <small>
                  {isSlice
                    ? "geoBoundaries · GeoNames · OSM transport · Natural Earth"
                    : "Natural Earth 1:50m and 1:10m · public domain"}
                </small>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
