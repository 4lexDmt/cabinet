/**
 * Core types for the map domain.
 *
 * This package is pure geometry and cartographic rule. It knows nothing about
 * the simulation, the database, or React, and it must never learn. The only
 * bridge between the game and the map is `TerritoryGeometry`.
 */

export type BoundaryClass =
  | "international"
  | "disputed"
  | "line_of_control"
  | "unrecognized"
  | "administrative"
  | "indefinite";

/**
 * The five maritime zones, deliberately not collapsed.
 *
 * There is no "sovereign" catch-all here because sovereignty differs across
 * these five, and flattening them would encode a factual error: an EEZ is not
 * territory, and a contiguous zone is enforcement jurisdiction only.
 */
export type MaritimeZone = "internal" | "territorial" | "contiguous" | "eez" | "high_seas";

export type RoadClass = "strategic" | "primary";

export type PlaceTier = "capital" | "world_city" | "major" | "regional" | "minor";

/** A nation's political reading of a boundary. */
export interface BoundaryPerspective {
  /** ISO code or "NEUTRAL". */
  observer: string;
  classification: BoundaryClass;
}

/** Links game territory to geometry. The ONLY bridge between sim and geo. */
export interface TerritoryGeometry {
  /** Matches sim `Territory.id`. */
  territoryId: string;
  /** Matches the tile / GeoJSON feature id. */
  featureId: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}

/** [west, south, east, north] in degrees. */
export type BBox = [number, number, number, number];

/** [longitude, latitude] in degrees. */
export type LonLat = [number, number];

/** [x, y] in screen pixels. */
export type Point = [number, number];

/**
 * Legal character of a maritime zone. Rendering must not flatten these:
 * the difference between "full sovereignty" and "resource rights only" is the
 * substance of most maritime disputes.
 */
export interface ZoneCharacter {
  zone: MaritimeZone;
  /** Outer limit in nautical miles from the baseline. `null` = unbounded. */
  outerLimitNm: number | null;
  sovereignty: "full" | "enforcement_only" | "resource_rights_only" | "none";
  /** One-line legend text. Shown verbatim so the interface never overstates a claim. */
  legend: string;
}
