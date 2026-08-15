import type { MatchRecord } from "@cabinet/db";
import type { Nation } from "@cabinet/sim";
import {
  alignmentPairs,
  obligationsOnTerritory,
  tradeExposure,
} from "@/lib/desk-model";
import {
  coverageOf,
  formationReadings,
  provenanceCopy,
  shortNation,
  territoryReading,
  type VisualConfidence,
} from "@/lib/belief-view";
import { regionOf, stationOf, THEATRE_REGIONS, viewBoxFor, type MapZoom } from "@/lib/map-geometry";
import Link from "next/link";

function mapHref(id: string, zoom: MapZoom) {
  return `/map?t=${id}&z=${zoom}`;
}

export type MapOverlay = "political" | "alignment" | "economy" | "force" | "intel";

function pointOf(id: string): [number, number] | null {
  const region = regionOf(id);
  if (region) return region.label;
  const station = stationOf(id);
  if (station) return [station.x + station.w / 2, station.y + station.h / 2];
  return null;
}

function nationPoint(match: MatchRecord, nationId: string): [number, number] | null {
  const home = Object.values(match.world.territories).find((t) => t.controller === nationId || t.owner === nationId);
  return home ? pointOf(home.id) : null;
}

function fillFor(visual: VisualConfidence | "blind") {
  if (visual === "blind") return "transparent";
  if (visual === "confirmed") return "url(#wash-confirmed)";
  if (visual === "probable") return "url(#hatch-probable)";
  return "url(#wash-unverified)";
}

function opacityFor(stale: string | null): number {
  if (stale === "old") return 0.42;
  if (stale === "stale") return 0.62;
  if (stale === "recent") return 0.85;
  return 1;
}

export function TheatreMap({
  match,
  nation,
  selectedId,
  zoom,
  overlays,
}: {
  match: MatchRecord;
  nation: Nation;
  selectedId: string | null;
  zoom: MapZoom;
  overlays: MapOverlay[];
}) {
  const names = match.world.nations;
  const coverage = coverageOf(match.world, nation.id);
  const formations = formationReadings(match.world, nation.id);
  const alignments = alignmentPairs(match, nation.id);
  const trade = tradeExposure(match, nation.id);
  const territories = Object.values(match.world.territories);
  const usedStations = territories.filter((t) => !regionOf(t.id));

  return (
    <div className="staff-map">
      <svg viewBox={viewBoxFor(zoom, selectedId)} role="img" aria-label="Staff map of holdings as they stand in file">
        <defs>
          <pattern id="hatch-probable" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#DDE4E5" />
            <path d="M0 0 L0 8" stroke="#4C5158" strokeWidth="1" />
          </pattern>
          <pattern id="hatch-planted" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
            <rect width="7" height="7" fill="#E7DDE4" />
            <path d="M0 0 L0 7" stroke="#6E3A5E" strokeWidth="1" />
          </pattern>
          <pattern id="wash-confirmed" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#DDE4E5" />
          </pattern>
          <pattern id="wash-unverified" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#EAE3CE" />
          </pattern>
          <pattern id="hatch-contested" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" fill="#EAE3CE" />
            <path d="M0 0 L10 10 M-2 8 L2 12 M8 -2 L12 2" stroke="#8A6D24" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="900" height="560" fill="#E1E3E2" />
        <text x="16" y="28" fill="#7B8087" fontFamily="IBM Plex Mono, monospace" fontSize="11">
          STAFF MAP · BELIEF, NOT TRUTH · TURN {match.world.tick}
        </text>

        {THEATRE_REGIONS.map((region) => {
          const territory = match.world.territories[region.id];
          if (!territory) return null;
          const reading = territoryReading(match.world, nation.id, territory);
          const selected = selectedId === region.id;
          const strokeWidth = reading.visual === "confirmed" ? 2 : 1;
          const strokeDash = reading.visual === "unverified" || reading.nothingInFile ? "4 3" : undefined;
          const stroke =
            reading.occupied
              ? "#8C332A"
              : reading.visual === "unverified"
                ? "#8A6D24"
                : reading.visual === "confirmed"
                  ? "#2C5A66"
                  : "#4C5158";
          const fill = reading.contested
            ? "url(#hatch-contested)"
            : reading.assessedPlanted
              ? "url(#hatch-planted)"
              : fillFor(reading.visual);
          const intelDim = overlays.includes("intel") && !coverage.has(region.id);
          return (
            <g key={region.id} opacity={intelDim ? 0.28 : opacityFor(reading.stale)}>
              <a href={mapHref(region.id, zoom)}>
                <path
                  d={region.d}
                  fill={fill}
                  stroke={selected ? "#1C1F23" : stroke}
                  strokeWidth={selected ? 3 : strokeWidth}
                  strokeDasharray={selected ? undefined : strokeDash}
                />
              </a>
              <text
                x={region.label[0]}
                y={region.label[1]}
                textAnchor="middle"
                fill="#1C1F23"
                fontFamily="Archivo Narrow, sans-serif"
                fontSize="11"
                letterSpacing="0.06em"
                pointerEvents="none"
              >
                {territory.name.toUpperCase()}
              </text>
              {region.terrain ? (
                <text
                  x={region.label[0]}
                  y={region.label[1] + 14}
                  textAnchor="middle"
                  fill="#7B8087"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="9"
                  pointerEvents="none"
                >
                  {region.terrain}
                </text>
              ) : null}
            </g>
          );
        })}

        {usedStations.map((territory) => {
          const station = stationOf(territory.id);
          if (!station) return null;
          const reading = territoryReading(match.world, nation.id, territory);
          const selected = selectedId === territory.id;
          const stroke =
            reading.visual === "unverified" || reading.nothingInFile
              ? "#8A6D24"
              : reading.visual === "confirmed"
                ? "#2C5A66"
                : "#4C5158";
          const fill = reading.nothingInFile
            ? "transparent"
            : reading.contested
              ? "url(#hatch-contested)"
              : fillFor(reading.visual);
          const intelDim = overlays.includes("intel") && !coverage.has(territory.id);
          return (
            <g key={territory.id} opacity={intelDim ? 0.28 : opacityFor(reading.stale)}>
              <a href={mapHref(territory.id, zoom)}>
                <rect
                  x={station.x}
                  y={station.y}
                  width={station.w}
                  height={station.h}
                  fill={fill}
                  stroke={selected ? "#1C1F23" : stroke}
                  strokeWidth={selected ? 3 : reading.visual === "confirmed" ? 2 : 1}
                  strokeDasharray={reading.nothingInFile || reading.visual === "unverified" ? "4 3" : undefined}
                />
              </a>
              <text
                x={station.x + station.w / 2}
                y={station.y + 24}
                textAnchor="middle"
                fill="#1C1F23"
                fontFamily="Archivo Narrow, sans-serif"
                fontSize="11"
                pointerEvents="none"
              >
                {territory.name.toUpperCase()}
              </text>
              {reading.nothingInFile ? (
                <text
                  x={station.x + station.w / 2}
                  y={station.y + 40}
                  textAnchor="middle"
                  fill="#8A6D24"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="9"
                  pointerEvents="none"
                >
                  nothing in file
                </text>
              ) : null}
            </g>
          );
        })}

        {overlays.includes("alignment")
          ? alignments.map((pair, i) => {
              const a = nationPoint(match, pair.a);
              const b = nationPoint(match, pair.b);
              if (!a || !b) return null;
              return (
                <line
                  key={`${pair.a}-${pair.b}-${i}`}
                  x1={a[0]}
                  y1={a[1]}
                  x2={b[0]}
                  y2={b[1]}
                  stroke={pair.secret ? "#6E3A5E" : "#2C5A66"}
                  strokeWidth={pair.secret ? 1 : 1.5}
                  strokeDasharray={pair.secret ? "2 3" : undefined}
                  opacity={0.7}
                  pointerEvents="none"
                />
              );
            })
          : null}

        {overlays.includes("economy")
          ? trade.routes.map((route) => {
              const from = nationPoint(match, nation.id);
              const other = Object.values(names).find((n) => n.name === route.counterparty);
              const to = other ? nationPoint(match, other.id) : null;
              if (!from || !to) return null;
              return (
                <line
                  key={route.id}
                  x1={from[0]}
                  y1={from[1]}
                  x2={to[0]}
                  y2={to[1]}
                  stroke={route.open ? "#2C5A66" : "#8C332A"}
                  strokeWidth={2}
                  pointerEvents="none"
                />
              );
            })
          : null}

        {overlays.includes("force")
          ? formations.map((f, i) => {
              const pt = pointOf(f.location);
              if (!pt) return null;
              const r = 6 + Math.min(22, f.weight / 2);
              return (
                <circle
                  key={`${f.location}-${i}`}
                  cx={pt[0]}
                  cy={pt[1] - 18}
                  r={r}
                  fill="none"
                  stroke="#1C1F23"
                  strokeWidth={f.visual === "confirmed" ? 2 : 1}
                  strokeDasharray={f.visual === "unverified" ? "3 2" : undefined}
                  opacity={0.8}
                  pointerEvents="none"
                />
              );
            })
          : null}
      </svg>
    </div>
  );
}

export function TerritoryDetail({
  match,
  nation,
  territoryId,
}: {
  match: MatchRecord;
  nation: Nation;
  territoryId: string;
}) {
  const territory = match.world.territories[territoryId];
  if (!territory) {
    return (
      <aside className="detail-sheet">
        <p style={{ fontStyle: "italic", color: "var(--ink-3)", margin: 0 }}>Select a region.</p>
      </aside>
    );
  }
  const reading = territoryReading(match.world, nation.id, territory);
  const pacts = obligationsOnTerritory(match, nation.id, territory.id);
  const holder = shortNation(match.world.nations, reading.controllerId);
  const formationsHere = Object.values(match.world.formations).filter((f) => f.location === territory.id);
  const believedForce = formationsHere.filter((f) => f.nationId === nation.id || reading.visual !== "blind");

  return (
    <aside className="detail-sheet">
      <div className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
        {territory.region}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 600, margin: "6px 0 12px" }}>{territory.name}</h2>
      {reading.nothingInFile ? (
        <p style={{ fontStyle: "italic", color: "var(--ink-3)", lineHeight: 1.5 }}>
          Nothing in file. Absence of a holding is not emptiness.
        </p>
      ) : (
        <>
          <p style={{ fontSize: 17, lineHeight: 1.55, margin: "0 0 12px" }}>
            Held, as far as this cabinet believes, by {holder}.
            {reading.occupied ? " The owner of record and the controller are not the same." : ""}
            {reading.contested ? " Two sources in file do not agree." : ""}
          </p>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.7 }}>
            {reading.visual.toUpperCase()}
            {reading.provenance ? ` · ${provenanceCopy(reading.provenance).toUpperCase()}` : ""}
            {reading.stale && reading.stale !== "fresh" ? ` · LAST CONFIRMED T${reading.lastUpdatedTick}` : ""}
            <br />
            YIELD {territory.supplyValue} · SUPPLY ON THE ESTIMATE
          </div>
        </>
      )}
      <div className="label" style={{ color: "var(--ink-3)", margin: "18px 0 8px" }}>
        Forces present · as believed
      </div>
      {believedForce.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "var(--ink-3)", margin: 0 }}>No concentration in file.</p>
      ) : (
        believedForce.map((f) => (
          <div key={f.id} className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>
            {f.nationId === nation.id ? "OUR WEIGHT" : "A CONCENTRATION"} · {f.location.replaceAll("_", " ").toUpperCase()}
          </div>
        ))
      )}
      <div className="label" style={{ color: "var(--ink-3)", margin: "18px 0 8px" }}>
        Instruments covering this ground
      </div>
      {pacts.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "var(--ink-3)", margin: 0 }}>No obligation in file names this ground.</p>
      ) : (
        pacts.map((p) => (
          <Link key={p.id} href="/pacts" style={{ display: "block", marginBottom: 8, borderLeft: "2px solid var(--alliance)", paddingLeft: 10 }}>
            <div style={{ fontSize: 16 }}>{p.public_terms.title}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
              {p.status.toUpperCase()}
              {p.parties.includes(nation.id) ? " · YOU ARE PARTY" : " · KNOWN, NOT PARTY"}
            </div>
          </Link>
        ))
      )}
    </aside>
  );
}

export function LayerSwitcher({
  overlays,
  zoom,
  selectedId,
}: {
  overlays: MapOverlay[];
  zoom: MapZoom;
  selectedId: string | null;
}) {
  const all: MapOverlay[] = ["alignment", "economy", "force", "intel"];
  const base = `/map?z=${zoom}${selectedId ? `&t=${selectedId}` : ""}`;
  return (
    <div className="map-toolbar">
      {(["theatre", "regional", "local"] as MapZoom[]).map((z) => (
        <Link key={z} href={`/map?z=${z}${selectedId ? `&t=${selectedId}` : ""}&o=${overlays.join(",")}`} className={zoom === z ? "on" : ""}>
          {z}
        </Link>
      ))}
      <span className="mono" style={{ color: "var(--desk-ink-dim)", fontSize: 11 }}>
        /
      </span>
      {all.map((layer) => {
        const on = overlays.includes(layer);
        const next = on ? overlays.filter((o) => o !== layer) : [...overlays, layer];
        const o = next.length ? next.join(",") : "political";
        return (
          <Link key={layer} href={`${base}&o=${o}`} className={on ? "on" : ""}>
            {layer}
          </Link>
        );
      })}
    </div>
  );
}
