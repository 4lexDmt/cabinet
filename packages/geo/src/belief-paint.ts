/**
 * Belief paint.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ THE HARD CONSTRAINT                                                      │
 * │                                                                          │
 * │ Planted intelligence must render identically to genuine intelligence at  │
 * │ equal confidence. Not "similarly" — identically, byte for byte.          │
 * │                                                                          │
 * │ That is enforced here structurally rather than by discipline. Every       │
 * │ function below takes a `MapReading`, and `MapReading` has no field        │
 * │ through which the truth of a belief could reach it. `readingFrom` is the  │
 * │ single funnel from a stored belief to a reading, and it builds a fresh    │
 * │ object with exactly the permitted keys, so a caller cannot smuggle a      │
 * │ source through by passing a wider object.                                 │
 * │                                                                          │
 * │ If a player could tell planted from genuine by looking at the map, the    │
 * │ deception system would be decorative and every betrayal in the game would │
 * │ be telegraphed.                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

import { TOKEN, WEIGHT, type StrokeSpec } from "./cartography.ts";

export type MapConfidence = "confirmed" | "probable" | "unverified";
export type MapProvenance = "own" | "ally" | "purchased" | "inferred";
export type MapStaleness = "fresh" | "recent" | "stale" | "old";

/**
 * Everything the map is permitted to know about a belief.
 *
 * Note what is absent, and keep it absent.
 */
export interface MapReading {
  confidence: MapConfidence;
  provenance: MapProvenance;
  staleness: MapStaleness | null;
  contested: boolean;
  nothingInFile: boolean;
  /** Tick the belief was last refreshed. Shown as "last confirmed", never as a fill. */
  lastUpdatedTick: number | null;
}

/**
 * The collapse. `planted` and `inference` both become `inferred`, and after
 * this point nothing downstream can tell them apart because nothing downstream
 * is given anything else to go on.
 */
export function collapseIntelSource(source: string): MapProvenance {
  switch (source) {
    case "direct_observation":
      return "own";
    case "ally_share":
      return "ally";
    case "purchased_intel":
      return "purchased";
    default:
      return "inferred";
  }
}

export function confidenceOf(score: number): MapConfidence {
  if (score >= 80) return "confirmed";
  if (score >= 50) return "probable";
  return "unverified";
}

export function stalenessOf(tick: number, lastUpdatedTick: number): MapStaleness {
  const age = tick - lastUpdatedTick;
  if (age <= 1) return "fresh";
  if (age <= 6) return "recent";
  if (age <= 18) return "stale";
  return "old";
}

/**
 * The only funnel from a stored belief to a paintable reading.
 *
 * The parameter is structurally typed rather than importing the simulation's
 * `Belief`, because this package must never depend on the simulation. The
 * return value is built key by key: extra properties on the input are dropped
 * here and cannot reach any paint function.
 */
export function readingFrom(
  belief: { confidence: number; source: string; last_updated_tick: number },
  tick: number,
  options: { contested?: boolean } = {},
): MapReading {
  return {
    confidence: confidenceOf(belief.confidence),
    provenance: collapseIntelSource(belief.source),
    staleness: stalenessOf(tick, belief.last_updated_tick),
    contested: options.contested ?? false,
    nothingInFile: false,
    lastUpdatedTick: belief.last_updated_tick,
  };
}

/** A territory with nothing in the file at all. An absence, not an empty tile. */
export function blindReading(): MapReading {
  return {
    confidence: "unverified",
    provenance: "inferred",
    staleness: null,
    contested: false,
    nothingInFile: true,
    lastUpdatedTick: null,
  };
}

/** Own territory. Confirmed continuously, because a government knows where it is. */
export function ownReading(tick: number): MapReading {
  return {
    confidence: "confirmed",
    provenance: "own",
    staleness: "fresh",
    contested: false,
    nothingInFile: false,
    lastUpdatedTick: tick,
  };
}

export type ReadingState = "confirmed" | "stale" | "inferred" | "contested" | "blind";

/**
 * The five display states, in precedence order. Contested outranks stale
 * because disagreement between sources is the more urgent fact.
 */
export function readingState(reading: MapReading): ReadingState {
  if (reading.nothingInFile) return "blind";
  if (reading.contested) return "contested";
  if (reading.staleness === "stale" || reading.staleness === "old") return "stale";
  if (reading.provenance === "inferred" || reading.confidence === "unverified") return "inferred";
  return "confirmed";
}

export interface AreaPaint {
  fill: string;
  fillOpacity: number;
  /** Pattern id, or null for a flat fill. */
  hatch: string | null;
  /** Second pass drawn over the fill, for contested overprint. */
  overprint: string | null;
}

export interface LinePaint {
  opacity: number;
  dash: string | null;
  /** Offset ghost stroke for a contested line — two sources, two positions. */
  ghost: { offset: [number, number]; stroke: string; opacity: number } | null;
}

export interface MarkPaint {
  fill: string;
  stroke: string;
  strokeDash: string | null;
  opacity: number;
  /** Whether the mark carries a "last confirmed" annotation. */
  annotate: boolean;
}

/**
 * Territory fill.
 *
 * `blind` is hatched paper rather than a hole, because a hole reads as an
 * error and an absence of intelligence is not an error — it is a fact about
 * this government's reach.
 */
export function territoryPaint(reading: MapReading, base: string = TOKEN.land): AreaPaint {
  switch (readingState(reading)) {
    case "blind":
      return { fill: TOKEN.landBlind, fillOpacity: 1, hatch: "p-blind", overprint: null };
    case "contested":
      return { fill: base, fillOpacity: 1, hatch: null, overprint: "p-contest" };
    case "stale":
      return { fill: base, fillOpacity: 0.72, hatch: null, overprint: null };
    case "inferred":
      return { fill: base, fillOpacity: 0.6, hatch: "p-thin", overprint: null };
    case "confirmed":
      return { fill: base, fillOpacity: 1, hatch: null, overprint: null };
  }
}

/** Confidence applied to a boundary stack. Never changes the class, only its certainty. */
export function boundaryConfidencePaint(reading: MapReading): LinePaint {
  switch (readingState(reading)) {
    case "blind":
      return { opacity: 0.28, dash: "2 4", ghost: null };
    case "contested":
      return {
        opacity: 1,
        dash: null,
        ghost: { offset: [2.2, 1.6], stroke: TOKEN.breach, opacity: 0.5 },
      };
    case "stale":
      return { opacity: 0.62, dash: null, ghost: null };
    case "inferred":
      return { opacity: 0.55, dash: "3 3", ghost: null };
    case "confirmed":
      return { opacity: 1, dash: null, ghost: null };
  }
}

/** Force marks. Concentration and axis only — never a clickable piece. */
export function forceMarkPaint(reading: MapReading, side: "friendly" | "hostile"): MarkPaint {
  const stroke = side === "hostile" ? TOKEN.hostility : TOKEN.alliance;
  const fill = side === "hostile" ? "url(#p-force-hostile)" : "url(#p-force-friendly)";
  switch (readingState(reading)) {
    case "blind":
      return { fill: "none", stroke: TOKEN.ink5, strokeDash: "2 4", opacity: 0.3, annotate: false };
    case "contested":
      return { fill, stroke: TOKEN.breach, strokeDash: null, opacity: 0.85, annotate: true };
    case "stale":
      return { fill, stroke, strokeDash: null, opacity: 0.5, annotate: true };
    case "inferred":
      return { fill, stroke, strokeDash: "3 3", opacity: 0.58, annotate: false };
    case "confirmed":
      return { fill, stroke, strokeDash: null, opacity: 0.85, annotate: false };
  }
}

/** Legend copy for each state. `stale` names the tick, so lateness is a number. */
export function stateLegend(reading: MapReading): string {
  switch (readingState(reading)) {
    case "blind":
      return "Nothing in the file.";
    case "contested":
      return "Sources disagree.";
    case "stale":
      return reading.lastUpdatedTick === null
        ? "Not confirmed recently."
        : `Last confirmed sitting ${reading.lastUpdatedTick}.`;
    case "inferred":
      return "Inferred.";
    case "confirmed":
      return "Confirmed.";
  }
}

/** The confidence badge. Never a fifth colour for a fifth kind of truth. */
export const STATE_INK: Record<ReadingState, StrokeSpec> = {
  confirmed: { stroke: TOKEN.ink2, width: WEIGHT.line, dash: null },
  stale: { stroke: TOKEN.uncertainty, width: WEIGHT.line, dash: null },
  inferred: { stroke: TOKEN.ink4, width: WEIGHT.thin, dash: "3 3" },
  contested: { stroke: TOKEN.breach, width: WEIGHT.line, dash: null },
  blind: { stroke: TOKEN.ink5, width: WEIGHT.hair, dash: "2 4" },
};
