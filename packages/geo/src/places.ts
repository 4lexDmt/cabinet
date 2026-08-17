/**
 * Settlements and decluttering.
 *
 * The decluttering problem is already solved in Natural Earth's own data. The
 * ranking is editorial rather than population-driven, which is exactly what a
 * map wants: Washington DC is under a million people but anchors a four-million
 * metro and is a world city, so it outranks larger places nobody labels. Trust
 * the rank over `POP_MAX`.
 *
 * `min_zoom` / `min_label` / `max_label` (Natural Earth v4+) are tuned for web
 * Mercator and are strictly better than `SCALERANK`, which was curated for
 * print. `SCALERANK` and `LABELRANK` remain as fallbacks.
 */

import type { PlaceTier } from "./types.js";

export interface RawPlaceProperties {
  NAME?: unknown;
  NAMEASCII?: unknown;
  ADM0NAME?: unknown;
  ADM1NAME?: unknown;
  ISO_A2?: unknown;
  ADM0CAP?: unknown;
  WORLDCITY?: unknown;
  MEGACITY?: unknown;
  SCALERANK?: unknown;
  LABELRANK?: unknown;
  NATSCALE?: unknown;
  RANK_MAX?: unknown;
  RANK_MIN?: unknown;
  POP_MAX?: unknown;
  min_zoom?: unknown;
  min_label?: unknown;
  max_label?: unknown;
  [key: string]: unknown;
}

export interface Place {
  name: string;
  lonLat: [number, number];
  tier: PlaceTier;
  /** Lower is more important. Drives label priority and collision order. */
  rank: number;
  /** Slippy zoom at which the mark may appear. */
  minZoom: number;
  /** Slippy zoom at which the label may appear; may exceed `minZoom`. */
  minLabel: number;
  country: string | null;
  adm0: string | null;
}

function num(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function str(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

export const PLACE_TIERS: readonly PlaceTier[] = [
  "capital",
  "world_city",
  "major",
  "regional",
  "minor",
] as const;

/**
 * Map Natural Earth's flags onto the tier vocabulary. Capital status wins over
 * size, because on a political map a capital is a decision point regardless of
 * how many people live there.
 */
export function placeTierOf(props: RawPlaceProperties): PlaceTier {
  if (num(props.ADM0CAP, 0) === 1) return "capital";
  if (num(props.WORLDCITY, 0) === 1 || num(props.MEGACITY, 0) === 1) return "world_city";
  const rank = num(props.RANK_MAX, num(props.SCALERANK, 10));
  if (rank >= 12) return "major";
  if (rank >= 8) return "regional";
  return "minor";
}

export function placeFrom(props: RawPlaceProperties, lonLat: [number, number]): Place {
  const scalerank = num(props.SCALERANK, 10);
  const labelrank = num(props.LABELRANK, scalerank);
  const minZoom = num(props.min_zoom, scalerank);
  const minLabel = Math.max(minZoom, num(props.min_label, labelrank));
  return {
    name: str(props.NAME) ?? str(props.NAMEASCII) ?? "—",
    lonLat,
    tier: placeTierOf(props),
    rank: scalerank * 10 + labelrank,
    minZoom,
    minLabel,
    country: str(props.ISO_A2),
    adm0: str(props.ADM0NAME),
  };
}

/**
 * Zoom registers. The map changes what it *says*, not merely its scale — a
 * theatre sheet answers a different question from a local one, so it carries a
 * different set of places rather than the same set drawn smaller.
 */
export interface ZoomRegister {
  id: "theatre" | "regional" | "local";
  label: string;
  tiers: readonly PlaceTier[];
  /** Slippy zoom used to test `min_zoom` / `min_label`. */
  zoom: number;
  /** Hard ceiling on labels, so a dense theatre cannot flood the sheet. */
  labelBudget: number;
  says: string;
}

export const REGISTERS: Record<ZoomRegister["id"], ZoomRegister> = {
  theatre: {
    id: "theatre",
    label: "THEATRE",
    tiers: ["capital", "world_city", "major"],
    zoom: 4,
    labelBudget: 130,
    says: "Who holds what, and where the pressure bears.",
  },
  regional: {
    id: "regional",
    label: "REGIONAL",
    tiers: ["capital", "world_city", "major", "regional"],
    zoom: 6,
    labelBudget: 220,
    says: "How a front is supplied, and where it can be cut.",
  },
  local: {
    id: "local",
    label: "LOCAL",
    tiers: PLACE_TIERS,
    zoom: 8,
    labelBudget: 400,
    says: "What a single decision here would actually touch.",
  },
};

/** A phone at theatre zoom gets coastline, boundaries, fills and ~20 labels. */
export const MOBILE_LABEL_BUDGET = 22;

export function visiblePlaces(
  places: Place[],
  register: ZoomRegister,
  budget = register.labelBudget,
): Place[] {
  return places
    .filter((p) => register.tiers.includes(p.tier) && p.minZoom <= register.zoom)
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
    .slice(0, budget);
}

export function labelledPlaces(places: Place[], register: ZoomRegister): Place[] {
  return visiblePlaces(places, register).filter((p) => p.minLabel <= register.zoom);
}
