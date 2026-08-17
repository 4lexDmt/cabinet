/**
 * Per-scenario geography.
 *
 * The temporal problem, stated plainly: almost none of the modern data is valid
 * for the scenarios this game ships.
 *
 *   EEZs did not exist before UNCLOS 1982 (in force 1994). Fourteen of sixteen
 *   scenarios predate them entirely.
 *
 *   Territorial seas were three nautical miles — the cannon-shot rule — not
 *   twelve. For a 1956 canal crisis that is not a detail, it is the substance.
 *
 *   Flight Information Regions date from 1947. Vienna, the July Crisis, Munich
 *   and Molotov–Ribbentrop have none.
 *
 *   Motorways barely existed before the 1950s outside Germany.
 *
 * So: physical layers are shared, political layers are per-scenario, and the
 * era decides which layers may exist at all. A scenario that renders a 200nm
 * EEZ in 1815 is not a minor inaccuracy — it is the map asserting something
 * that had not been invented, in a game whose whole premise is competing claims
 * about what is true.
 *
 * This is config, not code. Adding a scenario requires zero engine changes: the
 * era defaults derive from the year, and anything unusual is stated in JSON.
 */

import { z } from "zod";
import { firsExistInYear } from "./airspace.ts";
import type { MaritimeEra } from "./maritime.ts";
import { roadEraForYear } from "./roads.ts";
import type { BBox } from "./types.ts";

export const UNCLOS_SIGNED_YEAR = 1982;
export const UNCLOS_IN_FORCE_YEAR = 1994;

/**
 * Territorial sea width for a year, in nautical miles.
 *
 * Three miles is the cannon-shot rule; twelve is UNCLOS. The codification date
 * is the right threshold here because the twelve-mile limit was already
 * widespread state practice by the time the convention wrote it down.
 */
export function territorialSeaNmForYear(year: number): number {
  return year >= UNCLOS_SIGNED_YEAR ? 12 : 3;
}

/**
 * Whether an exclusive economic zone is mechanically live.
 *
 * Signed in 1982, in force in 1994, and the later date is the one that matters:
 * an EEZ nobody can enforce is not a feature of a game about competing claims.
 * A scenario that wants the transitional period says so explicitly.
 */
export function eezExistsInYear(year: number): boolean {
  return year >= UNCLOS_IN_FORCE_YEAR;
}

/** The 24nm contiguous zone is UNCLOS. The 1958 Geneva zone was 12nm. */
export function contiguousZoneExistsInYear(year: number): boolean {
  return year >= UNCLOS_SIGNED_YEAR;
}

export const projectionSpecSchema = z.object({
  kind: z.enum(["equirectangular", "mercator", "conic_conformal"]).default("equirectangular"),
  parallels: z.tuple([z.number(), z.number()]).optional(),
  lon0: z.number().optional(),
});

export const scenarioGeoSchema = z.object({
  /** The year the scenario is set in. Everything below defaults from it. */
  year: z.number().int(),
  /** [west, south, east, north]. */
  theatre_bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  /** Political geometry for this period. Physical layers are inherited. */
  boundaries_source: z.string(),
  projection: projectionSpecSchema.default({ kind: "equirectangular" }),
  territorial_sea_nm: z.number().positive().optional(),
  has_contiguous_zone: z.boolean().optional(),
  has_eez: z.boolean().optional(),
  has_fir: z.boolean().optional(),
  road_era: z.enum(["none", "post_roads", "rail_and_road", "motorway"]).optional(),
  /** Shown on the sheet so a player knows why a layer is missing. */
  note: z.string().optional(),
});

export type ScenarioGeoConfig = z.infer<typeof scenarioGeoSchema>;

export interface ResolvedScenarioGeo {
  year: number;
  theatreBbox: BBox;
  boundariesSource: string;
  projection: z.infer<typeof projectionSpecSchema>;
  maritime: MaritimeEra;
  hasEez: boolean;
  hasFir: boolean;
  roadEra: ReturnType<typeof roadEraForYear>;
  /** Layers the renderer is permitted to draw for this scenario. */
  layers: ScenarioLayer[];
  note: string | null;
}

export type ScenarioLayer =
  | "coastline"
  | "terrain"
  | "bathymetry"
  | "boundaries"
  | "territories"
  | "places"
  | "roads"
  | "maritime_territorial"
  | "maritime_contiguous"
  | "maritime_eez"
  | "airspace_sovereign"
  | "airspace_fir";

/** Physical layers are era-independent. They are the map's shared base. */
export const PHYSICAL_LAYERS: readonly ScenarioLayer[] = [
  "coastline",
  "terrain",
  "bathymetry",
] as const;

export function resolveScenarioGeo(config: ScenarioGeoConfig): ResolvedScenarioGeo {
  const year = config.year;
  const territorialSeaNm = config.territorial_sea_nm ?? territorialSeaNmForYear(year);
  const hasContiguous = config.has_contiguous_zone ?? contiguousZoneExistsInYear(year);
  const hasEez = config.has_eez ?? eezExistsInYear(year);
  const hasFir = config.has_fir ?? firsExistInYear(year);
  const roadEra = config.road_era ?? roadEraForYear(year);

  const layers: ScenarioLayer[] = [
    ...PHYSICAL_LAYERS,
    "boundaries",
    "territories",
    "places",
    "maritime_territorial",
  ];
  if (hasContiguous) layers.push("maritime_contiguous");
  if (hasEez) layers.push("maritime_eez");
  layers.push("airspace_sovereign");
  if (hasFir) layers.push("airspace_fir");
  if (roadEra !== "none") layers.push("roads");

  return {
    year,
    theatreBbox: config.theatre_bbox as BBox,
    boundariesSource: config.boundaries_source,
    projection: config.projection,
    maritime: {
      territorialSeaNm,
      hasContiguousZone: hasContiguous,
      hasEez,
    },
    hasEez,
    hasFir,
    roadEra,
    layers,
    note: config.note ?? null,
  };
}

export function layerPermitted(geo: ResolvedScenarioGeo, layer: ScenarioLayer): boolean {
  return geo.layers.includes(layer);
}

/**
 * Why a layer is absent, in words a player can read. Silence would look like a
 * bug; a stated reason is a history lesson.
 */
export function layerAbsenceReason(geo: ResolvedScenarioGeo, layer: ScenarioLayer): string | null {
  if (layerPermitted(geo, layer)) return null;
  switch (layer) {
    case "maritime_eez":
      return `No exclusive economic zone in ${geo.year}. UNCLOS is signed in 1982 and enters force in 1994; the EEZ is not live until then.`;
    case "maritime_contiguous":
      return `No contiguous zone in ${geo.year}. The 24nm zone is a 1982 instrument.`;
    case "airspace_fir":
      return `No flight information regions in ${geo.year}. ICAO establishes them in 1947.`;
    case "roads":
      return `No trunk road network at theatre scale in ${geo.year}.`;
    default:
      return `Not modelled for ${geo.year}.`;
  }
}
