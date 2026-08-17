"use client";

/**
 * Territory detail.
 *
 * The panel's subject is not the country. It is the country's *frontiers*, and
 * how each one reads from the desk currently in use versus from nobody in
 * particular. Where the two differ, both readings are shown side by side and
 * neither is called correct, because on this subject there is no view from
 * nowhere — only the reference plate, which is itself a position.
 */

import { useMemo } from "react";
import {
  BOUNDARY_LEGEND,
  NEUTRAL_OBSERVER,
  disagreements,
  readBoundary,
  type BoundaryClass,
} from "@cabinet/geo";
import type { LoadedLayer } from "@/lib/atlas/layers";
import { labelOf, perspectiveOf } from "@/lib/atlas/perspectives";

export interface DossierProps {
  iso3: string | null;
  observer: string;
  layers: Record<string, LoadedLayer | undefined>;
  onClose: () => void;
  onObserver: (code: string) => void;
}

interface Frontier {
  id: string;
  neighbour: string;
  name: string | null;
  note: string | null;
  here: BoundaryClass;
  neutral: BoundaryClass;
  others: Array<{ observer: string; classification: BoundaryClass }>;
}

export function Dossier({ iso3, observer, layers, onClose, onObserver }: DossierProps) {
  const country = useMemo(() => {
    if (!iso3 || !layers.countries) return null;
    const feature = layers.countries.features.find((f) => f.properties.iso_a3 === iso3);
    return feature
      ? {
          name: String(feature.properties.name_long ?? feature.properties.name ?? iso3),
          shortName: String(feature.properties.name ?? iso3),
          region: (feature.properties.region as string) ?? null,
          continent: (feature.properties.continent as string) ?? null,
        }
      : null;
  }, [iso3, layers.countries]);

  const names = useMemo(() => {
    const map = new Map<string, string>();
    for (const feature of layers.countries?.features ?? []) {
      const code = feature.properties.iso_a3;
      if (typeof code === "string") map.set(code, String(feature.properties.name ?? code));
    }
    return map;
  }, [layers.countries]);

  const frontiers = useMemo<Frontier[]>(() => {
    if (!iso3 || !layers.boundaries) return [];
    const out: Frontier[] = [];
    for (const feature of layers.boundaries.features) {
      const a = feature.properties.adm0_a as string | null;
      const b = feature.properties.adm0_b as string | null;
      if (a !== iso3 && b !== iso3) continue;
      const other = a === iso3 ? b : a;
      out.push({
        id: String(feature.properties.id),
        neighbour: other ? (names.get(other) ?? other) : "the open sea",
        name: (feature.properties.name as string) ?? null,
        note: (feature.properties.note as string) ?? null,
        here: readBoundary(feature.properties, observer),
        neutral: readBoundary(feature.properties, NEUTRAL_OBSERVER),
        others: disagreements(feature.properties),
      });
    }
    // Contested frontiers first: they are why anyone opened this panel.
    return out.sort((x, y) => {
      const rank = (f: Frontier) => (f.here !== f.neutral ? 0 : f.neutral === "international" ? 2 : 1);
      return rank(x) - rank(y) || x.neighbour.localeCompare(y.neighbour);
    });
  }, [iso3, layers.boundaries, names, observer]);

  const open = Boolean(iso3 && country);
  const contested = frontiers.filter((f) => f.neutral !== "international").length;
  const dissenting = frontiers.filter((f) => f.here !== f.neutral).length;

  return (
    <aside className="atlas-dossier" data-open={open ? "1" : "0"} aria-hidden={!open}>
      {country ? (
        <>
          <div className="head">
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              ×
            </button>
            <div className="k">TERRITORY · {labelOf(observer).toUpperCase()} PICTURE</div>
            <h3>{country.name}</h3>
            <div className="sub">
              {frontiers.length} FRONTIER{frontiers.length === 1 ? "" : "S"} · {contested} NOT AN ORDINARY
              BORDER · {dissenting} READ DIFFERENTLY HERE
            </div>
          </div>

          <dl className="field">
            <dt>Region</dt>
            <dd>
              {country.region ?? "—"}
              {country.continent ? <span style={{ color: "var(--ink-4)" }}> · {country.continent}</span> : null}
            </dd>
          </dl>
          <dl className="field">
            <dt>Reading</dt>
            <dd>
              {perspectiveOf(observer).stance}
            </dd>
          </dl>

          <div className="sect">Frontiers — as this desk reads them</div>
          {frontiers.length === 0 ? (
            <p className="empty">No land frontier on this sheet.</p>
          ) : (
            frontiers.map((frontier) => (
              <div className="reading" key={frontier.id} data-self={frontier.here !== frontier.neutral ? "1" : "0"}>
                <span className="obs">
                  {frontier.name ?? `with ${frontier.neighbour}`}
                </span>
                <b>
                  {BOUNDARY_LEGEND[frontier.here].label}
                  <span className={`conf ${frontier.here === frontier.neutral ? "confirmed" : "contested"}`}>
                    {frontier.here === frontier.neutral ? "agreed" : "dissent"}
                  </span>
                </b>
                <em>{BOUNDARY_LEGEND[frontier.here].gloss}</em>
                {frontier.here !== frontier.neutral ? (
                  <em style={{ color: "var(--ink-4)" }}>
                    To nobody in particular: {BOUNDARY_LEGEND[frontier.neutral].label.toLowerCase()}.
                  </em>
                ) : null}
                {frontier.others.length > 0 ? (
                  <span className="obs" style={{ marginTop: 2 }}>
                    Also read by{" "}
                    {frontier.others.slice(0, 6).map((other, i) => (
                      <button
                        key={other.observer}
                        type="button"
                        onClick={() => onObserver(other.observer)}
                        style={{
                          border: 0,
                          background: "transparent",
                          padding: 0,
                          font: "inherit",
                          color: "var(--alliance)",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {other.observer}
                        {i < Math.min(6, frontier.others.length) - 1 ? ", " : ""}
                      </button>
                    ))}
                  </span>
                ) : null}
                {frontier.note ? <em style={{ color: "var(--ink-4)" }}>{frontier.note}</em> : null}
              </div>
            ))
          )}

          <div className="sect">What this panel does not say</div>
          <p className="empty">
            Nothing here is a judgement about which reading is right. The disinterested plate is a
            position too — it is simply nobody&rsquo;s.
          </p>
        </>
      ) : null}
    </aside>
  );
}
