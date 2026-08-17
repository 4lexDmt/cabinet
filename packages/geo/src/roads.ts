/**
 * Roads.
 *
 * This is a strategic game read at theatre scale. Residential streets are
 * noise, and carrying them multiplies the dataset by more than an order of
 * magnitude for nothing. Two tiers only: what an army moves on, and what feeds
 * it. Everything below `primary` is dropped at the source.
 *
 * Natural Earth roads are deliberately not a source here: 45% of its 56,600
 * global features have `type = "Unknown"` and coverage is heavily skewed to
 * North America and Europe. It is adequate as a decorative low-zoom hint and
 * nothing more.
 */

import type { RoadClass } from "./types.js";

/** Overture `transportation` classes we keep. Everything else is dropped. */
export const KEPT_OVERTURE_CLASSES = ["motorway", "trunk", "primary"] as const;

export function roadClassOf(overtureClass: string): RoadClass | null {
  switch (overtureClass) {
    case "motorway":
    case "trunk":
      return "strategic";
    case "primary":
      return "primary";
    default:
      return null;
  }
}

/** Slippy zoom at which each tier may appear. */
export const ROAD_MIN_ZOOM: Record<RoadClass, number> = {
  strategic: 4,
  primary: 6,
};

export function roadVisibleAt(roadClass: RoadClass, zoom: number): boolean {
  return zoom >= ROAD_MIN_ZOOM[roadClass];
}

/**
 * When roads existed at all.
 *
 * Motorways barely existed before the 1950s outside Germany; the US Interstate
 * Act is 1956. The Congress of Vienna has post roads, not trunk routes, and
 * drawing a motorway network across 1815 would be the map asserting something
 * that had not been invented.
 */
export type RoadEra = "none" | "post_roads" | "rail_and_road" | "motorway";

export const ROAD_ERA_FROM_YEAR: ReadonlyArray<{ from: number; era: RoadEra }> = [
  { from: 1956, era: "motorway" },
  { from: 1930, era: "rail_and_road" },
  { from: 1840, era: "post_roads" },
  { from: -Infinity, era: "none" },
] as const;

export function roadEraForYear(year: number): RoadEra {
  for (const entry of ROAD_ERA_FROM_YEAR) {
    if (year >= entry.from) return entry.era;
  }
  return "none";
}

export function eraSupportsRoadLayer(era: RoadEra): boolean {
  return era !== "none";
}

export const ROAD_ERA_LABEL: Record<RoadEra, string> = {
  none: "No road network at this scale in this period.",
  post_roads: "Post roads and turnpikes — routes, not engineered highways.",
  rail_and_road: "Rail spine with a surfaced trunk network.",
  motorway: "Motorway and trunk network.",
};
