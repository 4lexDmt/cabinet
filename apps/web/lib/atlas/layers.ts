/**
 * Layer loading.
 *
 * Layers are fetched once and memoised for the life of the page. They are
 * static files produced by `infra/tiles`, so there is nothing to invalidate:
 * the pipeline runs offline and the app only ever reads.
 */

import type { BBox } from "@cabinet/geo";
import { geometryBbox } from "@cabinet/geo";

export interface LoadedFeature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates?: unknown; geometries?: unknown } | null;
  bbox: BBox | null;
}

export interface LoadedLayer {
  name: string;
  note: string;
  features: LoadedFeature[];
}

export type LayerName =
  | "boundaries"
  | "countries"
  | "countries_low"
  | "places"
  | "coastline"
  | "ocean"
  | "lakes"
  | "rivers"
  | "bathymetry";

const BASE = "/geo/mapkit";
const cache = new Map<string, Promise<LoadedLayer>>();

async function fetchLayer(name: LayerName): Promise<LoadedLayer> {
  const response = await fetch(`${BASE}/${name}.geojson`);
  if (!response.ok) throw new Error(`${name}: ${response.status} ${response.statusText}`);
  const raw = (await response.json()) as {
    note?: string;
    features: Array<{ properties?: Record<string, unknown>; geometry: LoadedFeature["geometry"] }>;
  };
  return {
    name,
    note: raw.note ?? "",
    features: raw.features.map((feature) => ({
      properties: feature.properties ?? {},
      geometry: feature.geometry,
      // Precomputed once so culling a frame is a numeric comparison, not a walk.
      bbox: geometryBbox(feature.geometry as never),
    })),
  };
}

export function loadLayer(name: LayerName): Promise<LoadedLayer> {
  const existing = cache.get(name);
  if (existing) return existing;
  const promise = fetchLayer(name).catch((error) => {
    cache.delete(name);
    throw error;
  });
  cache.set(name, promise);
  return promise;
}

export function loadLayers(names: LayerName[]): Promise<LoadedLayer[]> {
  return Promise.all(names.map(loadLayer));
}

export interface Attribution {
  generatedAt: string;
  note: string;
  sources: Array<{
    id: string;
    layer: string;
    version: string;
    license: string;
    attribution: string;
    required: boolean;
    shareAlike: boolean;
    used: boolean;
  }>;
  rejected: Array<{ id: string; reason: string }>;
}

let attributionPromise: Promise<Attribution> | null = null;

export function loadAttribution(): Promise<Attribution> {
  attributionPromise ??= fetch(`${BASE}/attribution.json`).then((r) => r.json() as Promise<Attribution>);
  return attributionPromise;
}
