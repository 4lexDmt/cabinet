/**
 * The territory registry — the only point of contact between the simulation
 * and the map.
 *
 * The simulation knows `territoryId`, adjacency and supply value. It has never
 * heard of a coordinate and must not: geometry is float-heavy and
 * platform-dependent, and a single coordinate on the tick path would break
 * byte-identical determinism in a way that fails intermittently and is
 * miserable to debug.
 *
 * So the join lives here, in one direction only. The map looks territories up.
 * The simulation never looks anything up.
 */

import { z } from "zod";
import type { BBox, TerritoryGeometry } from "./types.js";

export const territoryGeometrySchema = z.object({
  territoryId: z.string(),
  featureId: z.string(),
  centroid: z.tuple([z.number(), z.number()]),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
});

export const territoryManifestSchema = z.object({
  /** Which pipeline run produced this, so a stale manifest is visible. */
  generatedFrom: z.string(),
  generatedAt: z.string(),
  scenarios: z.record(z.string(), z.array(territoryGeometrySchema)),
});

export type TerritoryManifest = z.infer<typeof territoryManifestSchema>;

export interface TerritoryRegistry {
  readonly generatedFrom: string;
  scenarioIds(): string[];
  get(scenarioId: string, territoryId: string): TerritoryGeometry | null;
  all(scenarioId: string): TerritoryGeometry[];
  /** Territory ids present in the scenario but absent from the manifest. */
  missing(scenarioId: string, territoryIds: readonly string[]): string[];
  /** Union bbox of a scenario's geometry. Drives the default theatre frame. */
  extent(scenarioId: string): BBox | null;
}

export function createRegistry(manifest: TerritoryManifest): TerritoryRegistry {
  const index = new Map<string, Map<string, TerritoryGeometry>>();
  for (const [scenarioId, entries] of Object.entries(manifest.scenarios)) {
    const inner = new Map<string, TerritoryGeometry>();
    for (const entry of entries) inner.set(entry.territoryId, entry as TerritoryGeometry);
    index.set(scenarioId, inner);
  }

  return {
    generatedFrom: manifest.generatedFrom,
    scenarioIds: () => [...index.keys()].sort(),
    get: (scenarioId, territoryId) => index.get(scenarioId)?.get(territoryId) ?? null,
    all: (scenarioId) => [...(index.get(scenarioId)?.values() ?? [])],
    missing: (scenarioId, territoryIds) => {
      const inner = index.get(scenarioId);
      return territoryIds.filter((id) => !inner?.has(id));
    },
    extent: (scenarioId) => {
      const entries = [...(index.get(scenarioId)?.values() ?? [])];
      if (entries.length === 0) return null;
      let w = Infinity;
      let s = Infinity;
      let e = -Infinity;
      let n = -Infinity;
      for (const entry of entries) {
        if (entry.bbox[0] < w) w = entry.bbox[0];
        if (entry.bbox[1] < s) s = entry.bbox[1];
        if (entry.bbox[2] > e) e = entry.bbox[2];
        if (entry.bbox[3] > n) n = entry.bbox[3];
      }
      return [w, s, e, n];
    },
  };
}

export function parseManifest(raw: unknown): TerritoryManifest {
  return territoryManifestSchema.parse(raw);
}

/** Centroid of a GeoJSON-ish ring set. Area-weighted, so slivers do not pull it. */
export function polygonCentroid(rings: Array<Array<[number, number]>>): [number, number] {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[j]!;
      const b = ring[i]!;
      const cross = a[0] * b[1] - b[0] * a[1];
      area += cross;
      cx += (a[0] + b[0]) * cross;
      cy += (a[1] + b[1]) * cross;
    }
  }
  if (area === 0) {
    const first = rings[0]?.[0];
    return first ? [first[0], first[1]] : [0, 0];
  }
  return [cx / (3 * area), cy / (3 * area)];
}

export function bboxOf(rings: Array<Array<[number, number]>>): BBox {
  let w = Infinity;
  let s = Infinity;
  let e = -Infinity;
  let n = -Infinity;
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      if (lon < w) w = lon;
      if (lon > e) e = lon;
      if (lat < s) s = lat;
      if (lat > n) n = lat;
    }
  }
  return [w, s, e, n];
}
