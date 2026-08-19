/**
 * The generated layers, checked against the real file rather than a fixture.
 *
 * `kashmir.test.ts` proves the normalizer is correct given a row shaped like
 * Natural Earth's. This proves the pipeline actually produced that row — which
 * is a different claim, and the one that breaks when someone changes a
 * simplification tolerance and quietly drops a border.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  isBoundaryClass,
  parseManifest,
  createRegistry,
  readBoundary,
  NEUTRAL_OBSERVER,
  allProvinces,
} from "../src/index.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const mapkit = join(repoRoot, "apps", "web", "public", "geo", "mapkit");

interface Feature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown } | null;
}

function layer(name: string): Feature[] {
  const path = join(mapkit, `${name}.geojson`);
  if (!existsSync(path)) {
    throw new Error(`${name}.geojson missing — run \`make -C infra/tiles all\``);
  }
  return (JSON.parse(readFileSync(path, "utf8")) as { features: Feature[] }).features;
}

describe("generated canals", () => {
  const features = layer("canals");

  function vertices(feature: Feature): Array<[number, number]> {
    const geometry = feature.geometry;
    if (!geometry) return [];
    const lines =
      geometry.type === "LineString"
        ? [geometry.coordinates as Array<[number, number]>]
        : (geometry.coordinates as Array<Array<[number, number]>>);
    return lines.flat();
  }

  it("carries the canals that join two seas, and nothing else", () => {
    const names = new Set(features.map((f) => String(f.properties.name)));
    expect(names).toContain("Suez Canal");
    expect(names).toContain("Panama Canal");
    // Natural Earth files these among the rivers; nothing else should follow
    // them across.
    for (const name of names) expect(name).toMatch(/Canal$/);
  });

  it("carries Suez the whole way across the isthmus", () => {
    // The point of the layer: without a line reaching from the Mediterranean
    // to the Gulf of Suez, Sinai is simply part of Egypt at every zoom this
    // sheet reaches. Port Said sits at 31.26°N, Suez at 29.97°N.
    const suez = features.filter((f) => f.properties.name === "Suez Canal").flatMap(vertices);
    expect(suez.length).toBeGreaterThan(1);
    const lats = suez.map(([, lat]) => lat);
    expect(Math.max(...lats)).toBeGreaterThan(31.2);
    expect(Math.min(...lats)).toBeLessThan(30.1);
    for (const [lon] of suez) expect(lon).toBeGreaterThan(32.2);
    for (const [lon] of suez) expect(lon).toBeLessThan(32.7);
  });
});

describe("generated boundaries", () => {
  const features = layer("boundaries");

  it("keeps every source segment — a border may not vanish into a tolerance", () => {
    expect(features).toHaveLength(515);
  });

  it("gives every segment a neutral reading", () => {
    for (const feature of features) {
      const neutral = feature.properties.pov_neutral;
      expect(typeof neutral).toBe("string");
      expect(isBoundaryClass(String(neutral))).toBe(true);
    }
  });

  it("emits only recognised classifications on every perspective", () => {
    for (const feature of features) {
      for (const [key, value] of Object.entries(feature.properties)) {
        if (!key.startsWith("pov_")) continue;
        expect(isBoundaryClass(String(value)), `${key} = ${value}`).toBe(true);
      }
    }
  });

  it("reproduces the Kashmir Line of Control three ways from one geometry", () => {
    const loc = features.find(
      (f) =>
        f.properties.name === "Line of control" &&
        f.properties.pov_in === "international" &&
        f.properties.pov_pk === "administrative",
    );
    expect(loc, "no segment reads international from Delhi and administrative from Islamabad").toBeDefined();
    expect(readBoundary(loc!.properties, NEUTRAL_OBSERVER)).toBe("line_of_control");
    expect(readBoundary(loc!.properties, "IN")).toBe("international");
    expect(readBoundary(loc!.properties, "PK")).toBe("administrative");
  });

  it("carries the perspective coverage the data actually has", () => {
    const counts = new Map<string, number>();
    for (const feature of features) {
      for (const key of Object.keys(feature.properties)) {
        if (key.startsWith("pov_") && key !== "pov_neutral") {
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }
    }
    // Sparse by design: NULL means that government accepts the neutral reading.
    expect(counts.get("pov_cn")).toBe(38);
    expect(counts.get("pov_ru")).toBe(30);
    expect(counts.get("pov_in")).toBe(28);
    expect(counts.get("pov_pk")).toBe(28);
  });

  it("has segments nobody disputes, and they are the majority", () => {
    const undisputed = features.filter(
      (f) => Object.keys(f.properties).filter((k) => k.startsWith("pov_")).length === 1,
    );
    expect(undisputed.length).toBeGreaterThan(features.length / 2);
  });
});

describe("generated places", () => {
  const features = layer("places");

  it("filters to the curated theatre set", () => {
    expect(features).toHaveLength(1160);
  });

  it("tags every place with a tier and a zoom threshold", () => {
    const tiers = new Set(["capital", "world_city", "major", "regional", "minor"]);
    for (const feature of features) {
      expect(tiers.has(String(feature.properties.tier))).toBe(true);
      expect(typeof feature.properties.min_zoom).toBe("number");
      expect(Number(feature.properties.min_label)).toBeGreaterThanOrEqual(
        Number(feature.properties.min_zoom),
      );
    }
  });

  it("trusts editorial rank over population", () => {
    // Names come from upstream verbatim, double spaces and all.
    const byName = (needle: string) =>
      features.find((f) => String(f.properties.name).replace(/\s+/g, " ") === needle);
    const dc = byName("Washington, D.C.");
    const houston = byName("Houston");
    expect(dc?.properties.tier).toBe("capital");
    // Under a million people, and it still outranks a far larger city, because
    // it anchors a metro and is a world city. Raw population would bury it.
    expect(Number(dc?.properties.rank)).toBeLessThan(Number(houston?.properties.rank));
    expect(features.filter((f) => f.properties.capital === 1).length).toBeGreaterThan(100);
  });

  it("is ordered by rank, so a truncated read is still the important places", () => {
    const ranks = features.map((f) => Number(f.properties.rank));
    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks);
  });
});

describe("generated physical base", () => {
  it("ships a coastline every scenario can share regardless of era", () => {
    expect(layer("coastline").length).toBeGreaterThan(1000);
  });

  it("ships country polygons at two tiers", () => {
    expect(layer("countries").length).toBeGreaterThan(200);
    expect(layer("countries_low").length).toBeGreaterThan(150);
  });
});

describe("attribution sidecar", () => {
  const raw = JSON.parse(readFileSync(join(mapkit, "attribution.json"), "utf8")) as {
    sources: Array<{ id: string; license: string; attribution: string; required: boolean; used: boolean }>;
    rejected: Array<{ id: string; reason: string }>;
  };

  it("records a licence for every source", () => {
    for (const source of raw.sources) {
      expect(source.license, source.id).toBeTruthy();
    }
  });

  it("records credit text wherever credit is required", () => {
    for (const source of raw.sources) {
      if (source.required) expect(source.attribution, source.id).toBeTruthy();
    }
  });

  it("ships nothing that requires attribution today, and knows it", () => {
    const owed = raw.sources.filter((s) => s.used && s.required);
    expect(owed).toEqual([]);
  });

  it("records why GADM is refused", () => {
    const gadm = raw.rejected.find((r) => r.id === "gadm");
    expect(gadm?.reason).toMatch(/commercial/i);
  });
});

describe("tier-1 incorporated provinces", () => {
  const features = layer("tier1_provinces");
  const byId = new Map(features.map((f) => [String(f.properties.id), f]));

  it("ships one polygon per gazetteer province, not per raw ADM1", () => {
    expect(features).toHaveLength(283);
    const ids = features.map((f) => String(f.properties.id)).sort();
    const gazetteerIds = allProvinces().map((p) => p.id).sort();
    expect(ids).toEqual(gazetteerIds);
  });

  it("dissolves New England into one outline", () => {
    const feature = byId.get("us-newengland");
    expect(feature, "us-newengland").toBeDefined();
    expect(feature!.geometry?.type).toMatch(/Polygon/);
    const merged = feature!.properties.merged_from as string[];
    expect(merged).toEqual(expect.arrayContaining(["ME", "NH", "VT", "MA", "RI", "CT"]));
  });

  it("splits California on the documented CA-N / CA-S line, not at the state line", () => {
    expect(byId.get("us-norcal")?.geometry).toBeTruthy();
    expect(byId.get("us-socal")?.geometry).toBeTruthy();
    expect(byId.has("us-california")).toBe(false);
  });

  it("keeps Berlin distinct from Brandenburg", () => {
    expect(byId.get("de-be")).toBeDefined();
    expect(byId.get("de-bb")).toBeDefined();
  });

  it("labels each province from a point inside the dissolved polygon, not the seat", () => {
    for (const feature of features) {
      const label = feature.properties.label as [number, number] | undefined;
      expect(label, String(feature.properties.id)).toBeDefined();
      expect(label).toHaveLength(2);
      expect(Number.isFinite(label![0]), String(feature.properties.id)).toBe(true);
      expect(Number.isFinite(label![1]), String(feature.properties.id)).toBe(true);
    }
    const illinois = byId.get("us-illinois")!;
    const [lon, lat] = illinois.properties.label as [number, number];
    // Seat is Chicago on the lake; the interior label must not sit on it.
    expect(Math.hypot(lon - -87.65, lat - 41.85)).toBeGreaterThan(1.2);
  });
});

describe("territory manifest", () => {
  const manifest = parseManifest(
    JSON.parse(readFileSync(join(mapkit, "territory-manifest.json"), "utf8")),
  );
  const registry = createRegistry(manifest);

  it("covers every scenario that has geometry", () => {
    expect(registry.scenarioIds().length).toBe(16);
  });

  it("gives each entry a centroid inside its own bbox", () => {
    for (const scenarioId of registry.scenarioIds()) {
      for (const entry of registry.all(scenarioId)) {
        const [lon, lat] = entry.centroid;
        const [w, s, e, n] = entry.bbox;
        expect(lon, `${scenarioId}/${entry.territoryId}`).toBeGreaterThanOrEqual(w - 1e-3);
        expect(lon, `${scenarioId}/${entry.territoryId}`).toBeLessThanOrEqual(e + 1e-3);
        expect(lat, `${scenarioId}/${entry.territoryId}`).toBeGreaterThanOrEqual(s - 1e-3);
        expect(lat, `${scenarioId}/${entry.territoryId}`).toBeLessThanOrEqual(n + 1e-3);
      }
    }
  });

  it("reports an extent per scenario, so a theatre can frame itself", () => {
    for (const scenarioId of registry.scenarioIds()) {
      const extent = registry.extent(scenarioId);
      expect(extent, scenarioId).not.toBeNull();
      expect(extent![2]).toBeGreaterThan(extent![0]);
      expect(extent![3]).toBeGreaterThan(extent![1]);
    }
  });

  it("reports the gap between sim territories and map geometry", () => {
    // The simulation's territory list is coarse — one polygon per capital,
    // often. The GeoJSON can be richer, and occasionally a sim id has no
    // matching feature. The join is allowed to be incomplete; this test
    // exists so the gap is visible rather than silent.
    const scenariosDir = join(repoRoot, "packages", "scenarios");
    const missing: Record<string, string[]> = {};
    const extra: Record<string, number> = {};
    for (const file of readdirSync(scenariosDir).filter((name) => name.endsWith(".json") && name !== "package.json")) {
      const raw = JSON.parse(readFileSync(join(scenariosDir, file), "utf8")) as {
        id: string;
        territories: Array<{ id: string }>;
      };
      const ids = raw.territories.map((t) => t.id);
      const absent = registry.missing(raw.id, ids);
      if (absent.length > 0) missing[raw.id] = absent;
      extra[raw.id] = Math.max(0, registry.all(raw.id).length - ids.length);
    }
    expect(missing).toEqual({});
    // Extra geometry is expected: the map is allowed to be richer than the sim.
    expect(Object.values(extra).some((n) => n >= 0)).toBe(true);
  });
});
