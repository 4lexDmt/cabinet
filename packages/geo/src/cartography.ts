/**
 * The ink.
 *
 * Register: mid-century foreign-ministry situation map. Printed, not
 * screen-native. Every value here is load-bearing; nothing is decorative.
 *
 * Two rules make the treatments work:
 *
 * - Stroke patterns are specified in PIXELS, not map units, so a boundary class
 *   reads identically at theatre, regional and local zoom. That is the whole
 *   point of having classes at all.
 *
 * - Four semantic accents, used for meaning only and never for decoration. If a
 *   colour appears, it is making a claim.
 */

import type { BoundaryClass, MaritimeZone, PlaceTier } from "./types.ts";

/** CSS custom properties. The renderer resolves these; the domain only names them. */
export const TOKEN = {
  paper: "var(--paper)",
  paperDeep: "var(--paper-deep)",
  paperFold: "var(--paper-fold)",
  land: "var(--land)",
  landOut: "var(--land-out)",
  landBlind: "var(--land-blind)",
  sea: "var(--sea)",
  seaDeep: "var(--sea-deep)",
  seaAbyss: "var(--sea-abyss)",
  ink: "var(--ink)",
  ink2: "var(--ink-2)",
  ink3: "var(--ink-3)",
  ink4: "var(--ink-4)",
  ink5: "var(--ink-5)",
  alliance: "var(--alliance)",
  hostility: "var(--hostility)",
  uncertainty: "var(--uncertainty)",
  breach: "var(--breach)",
  allianceWash: "var(--alliance-wash)",
  hostilityWash: "var(--hostility-wash)",
  uncertaintyWash: "var(--uncertainty-wash)",
  breachWash: "var(--breach-wash)",
} as const;

/** Five weights plus two extremes. */
export const WEIGHT = {
  hair: "var(--w-hair)",
  thin: "var(--w-thin)",
  line: "var(--w-line)",
  med: "var(--w-med)",
  heavy: "var(--w-heavy)",
  mass: "var(--w-mass)",
} as const;

export interface StrokeSpec {
  stroke: string;
  width: string | number;
  dash: string | null;
  opacity?: number;
  /** Perpendicular offset in px, for the twin hairlines of a disputed line. */
  offset?: number;
}

/**
 * Six boundary treatments, one per class.
 *
 * Each is a stack of strokes drawn in order. The stacking is the argument: a
 * disputed line is two hairlines with a gap because there is no single
 * authoritative line to draw; an unrecognized line is drawn and then struck
 * through; an indefinite line has no continuous stroke at all, because its
 * position is genuinely unknown.
 */
export const BOUNDARY_INK: Record<BoundaryClass, StrokeSpec[]> = {
  international: [{ stroke: TOKEN.ink, width: WEIGHT.med, dash: null }],
  disputed: [
    { stroke: "rgba(122,106,46,.30)", width: 4.6, dash: null },
    { stroke: TOKEN.uncertainty, width: WEIGHT.thin, dash: null, offset: -1.6 },
    { stroke: TOKEN.uncertainty, width: WEIGHT.thin, dash: null, offset: 1.6 },
  ],
  line_of_control: [
    { stroke: TOKEN.ink, width: WEIGHT.med, dash: "9 3 2.5 3" },
    { stroke: TOKEN.hostility, width: 5.2, dash: "0.9 7.2", opacity: 0.85 },
  ],
  unrecognized: [
    { stroke: TOKEN.ink4, width: WEIGHT.thin, dash: "2.2 2.6" },
    { stroke: TOKEN.ink3, width: 4.4, dash: "0.8 9", opacity: 0.55 },
  ],
  administrative: [{ stroke: TOKEN.ink4, width: WEIGHT.thin, dash: "2.6 2.2" }],
  indefinite: [
    { stroke: "rgba(122,106,46,.22)", width: 6.5, dash: null },
    { stroke: TOKEN.ink3, width: WEIGHT.thin, dash: "0.7 5.4" },
  ],
};

/** Emphasised international boundary — a bloc frontier, not a heavier border. */
export function emphasise(specs: StrokeSpec[]): StrokeSpec[] {
  return specs.map((s) => (s.width === WEIGHT.med ? { ...s, width: WEIGHT.heavy } : s));
}

export interface ZoneInk {
  fill: string | null;
  stroke: string | null;
  strokeWidth: string | number | null;
  dash: string | null;
  opacity: number;
}

/**
 * The maritime ladder in ink: a diminishing claim.
 *
 * The wash lightens as you move seaward because that is what the law does —
 * sovereignty, then enforcement, then resource rights, then nothing. The EEZ
 * outer limit is dotted because it is a claim edge, never a territorial one.
 */
export const ZONE_INK: Record<MaritimeZone, ZoneInk> = {
  internal: {
    fill: "rgba(46,92,110,.20)",
    stroke: TOKEN.alliance,
    strokeWidth: WEIGHT.line,
    dash: null,
    opacity: 1,
  },
  territorial: {
    fill: "rgba(46,92,110,.14)",
    stroke: TOKEN.alliance,
    strokeWidth: WEIGHT.line,
    dash: null,
    opacity: 0.75,
  },
  contiguous: {
    fill: "rgba(46,92,110,.06)",
    stroke: TOKEN.alliance,
    strokeWidth: WEIGHT.thin,
    dash: "4 3",
    opacity: 0.6,
  },
  eez: {
    fill: "rgba(46,92,110,.045)",
    stroke: TOKEN.alliance,
    strokeWidth: WEIGHT.thin,
    dash: "1 3",
    opacity: 0.6,
  },
  high_seas: { fill: TOKEN.seaDeep, stroke: null, strokeWidth: null, dash: null, opacity: 1 },
};

/**
 * The same ladder read as water rather than as annotation.
 *
 * A dashed limit line is the right treatment on a plate carrying boundaries,
 * settlements and terrain, where the maritime ladder is context and has to stay
 * out of the way. It is the wrong treatment when the zones are the subject:
 * dashes at world scale read as broken lines littering the ocean rather than as
 * jurisdiction, and the thing a reader actually wants to see is how far out
 * each state's water reaches.
 *
 * So the zones become sea instead — the same seaward-diminishing sequence, but
 * carried by depth of water. Sovereignty is the darkest, resource rights the
 * faintest, the high seas the paper's own sea tone. No dash: an area of water
 * does not need an outline to say where it ends, because the next tone does it.
 */
export function zoneAsWater(zone: MaritimeZone): ZoneInk {
  const depth: Record<MaritimeZone, string | null> = {
    internal: "rgba(31,63,77,.42)",
    territorial: "rgba(31,63,77,.30)",
    contiguous: "rgba(31,63,77,.19)",
    eez: "rgba(31,63,77,.10)",
    high_seas: null,
  };
  return { fill: depth[zone], stroke: null, strokeWidth: null, dash: null, opacity: 1 };
}

/** Median line where two zones meet — a genuine equidistance line, so it is drawn as one. */
export const MEDIAN_LINE_INK: StrokeSpec = {
  stroke: TOKEN.alliance,
  width: WEIGHT.line,
  dash: "8 3 1.5 3",
};

export interface PlaceMark {
  /** Radius in px. */
  radius: number;
  mark: "capital" | "square" | "disc" | "ring" | "dot";
  /** Label tier class from the type scale. */
  labelClass: "t2" | "t3" | "t4" | "t5";
  fontSize: number;
}

export const PLACE_MARK: Record<PlaceTier, PlaceMark> = {
  capital: { radius: 4.2, mark: "capital", labelClass: "t2", fontSize: 11.5 },
  world_city: { radius: 3.4, mark: "square", labelClass: "t2", fontSize: 11.5 },
  major: { radius: 2.6, mark: "disc", labelClass: "t3", fontSize: 10.5 },
  regional: { radius: 1.9, mark: "ring", labelClass: "t4", fontSize: 9.5 },
  minor: { radius: 1.3, mark: "dot", labelClass: "t5", fontSize: 8.5 },
};

/**
 * Candidate label positions around a mark, in priority order.
 * `[dx, dy, anchor, dyEm]` — the em offset keeps a label optically centred on
 * the mark rather than mathematically centred on its box.
 */
export const LABEL_ANCHORS: ReadonlyArray<[number, number, "start" | "end" | "middle", number]> = [
  [1, 0, "start", 0.34],
  [-1, 0, "end", 0.34],
  [1, -1, "start", -0.5],
  [1, 1, "start", 1.05],
  [-1, -1, "end", -0.5],
  [-1, 1, "end", 1.05],
  [0, -1, "middle", -0.75],
  [0, 1, "middle", 1.35],
];

/**
 * Area-ink budget.
 *
 * Only one overlay may spend area ink. A second yields its fills and renders as
 * line only, so any two stay legible when stacked. This is a hard budget rather
 * than a style guideline because two full-area overlays are simply unreadable
 * and no amount of care with opacity fixes it.
 */
export const AREA_INK_BUDGET = 1;
export const DEMOTED_INK_FACTOR = 0.18;

export interface OverlayCost {
  id: string;
  area: number;
}

export interface InkLedger {
  active: string[];
  areaHolder: string | null;
  demoted: string[];
  spent: number;
  overBudget: boolean;
}

export function inkLedger(order: string[], enabled: Set<string>, costs: OverlayCost[]): InkLedger {
  const byId = new Map(costs.map((c) => [c.id, c.area]));
  const active = order.filter((id) => enabled.has(id));
  const spent = active.reduce((sum, id, i) => {
    const area = byId.get(id) ?? 0;
    return sum + (i === 0 ? area : area * DEMOTED_INK_FACTOR);
  }, 0);
  return {
    active,
    areaHolder: active[0] ?? null,
    demoted: active.slice(1),
    spent: Math.round(spent * 1000) / 1000,
    overBudget: spent > AREA_INK_BUDGET,
  };
}
