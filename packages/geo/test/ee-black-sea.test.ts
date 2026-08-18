/**
 * Stage 1 Eastern Europe / Black Sea slice, checked against the generated files.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { worldRosterSchema } from "../src/index.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const mapkit = join(repoRoot, "apps", "web", "public", "geo", "mapkit");
const roster = worldRosterSchema.parse(
  JSON.parse(readFileSync(join(repoRoot, "infra", "tiles", "config", "nations.json"), "utf8")),
);

interface Feature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown } | null;
}

function loadFc(name: string): { note?: string; features: Feature[] } {
  const path = join(mapkit, name);
  if (!existsSync(path)) {
    throw new Error(`${name} missing — run \`make -C infra/tiles world\``);
  }
  return JSON.parse(readFileSync(path, "utf8")) as { note?: string; features: Feature[] };
}

describe("EE / Black Sea slice caps", () => {
  const provinces = loadFc("provinces.geojson").features;

  it("keeps Turkey at NUTS-1, Romania at development regions, Russia off the subject dump", () => {
    const turkey = provinces.filter((f) => f.properties.iso3 === "TUR");
    const romania = provinces.filter((f) => f.properties.iso3 === "ROU");
    const russia = provinces.filter((f) => f.properties.iso3 === "RUS");
    expect(turkey.length).toBeGreaterThan(0);
    expect(turkey.length).toBeLessThanOrEqual(12);
    expect(romania.length).toBeGreaterThan(0);
    expect(romania.length).toBeLessThanOrEqual(8);
    expect(russia.length).toBeGreaterThan(0);
    expect(russia.length).toBeLessThanOrEqual(8);
  });

  it("flags Crimea as contested Ukrainian geography, one polygon", () => {
    const crimea = provinces.filter((f) => f.properties.contested_id === "crimea");
    expect(crimea).toHaveLength(1);
    expect(crimea[0]?.properties.iso3).toBe("UKR");
    expect(crimea[0]?.properties.neutral_controller).toBe("UKR");
  });

  it("names the Stage 1 provinces the sim fixture uses", () => {
    const ids = new Set(provinces.map((f) => String(f.properties.id)));
    for (const id of [
      "pol-subcarpathianvoivodeship",
      "pol-masovianvoivodeship",
      "ukr-lvivoblast",
      "ukr-odessaoblast",
      "tur-istanbul",
      "rou-sudest",
    ]) {
      expect(ids.has(id), id).toBe(true);
    }
  });
});

describe("cities as game nodes", () => {
  const provinces = loadFc("provinces.geojson").features;
  const cities = loadFc("cities.geojson").features;

  it("gives every province between one and three cities", () => {
    const per = new Map<string, number>();
    for (const city of cities) {
      const id = String(city.properties.province_id);
      per.set(id, (per.get(id) ?? 0) + 1);
    }
    for (const province of provinces) {
      const id = String(province.properties.id);
      const count = per.get(id) ?? 0;
      expect(count, id).toBeGreaterThanOrEqual(1);
      expect(count, id).toBeLessThanOrEqual(3);
    }
  });
});

describe("gauged rail and the integer graph", () => {
  const rail = loadFc("rail.geojson").features;
  const corridors = JSON.parse(readFileSync(join(mapkit, "corridors.json"), "utf8")) as {
    corridors: Array<Record<string, unknown>>;
  };

  it("ships both 1520 and 1435 gauge families", () => {
    const gauges = new Set(rail.map((f) => Number(f.properties.gauge)).filter((n) => n > 0));
    const has1520 = [...gauges].some((g) => g === 1520 || g === 1524);
    const has1435 = [...gauges].some((g) => g === 1435);
    expect(has1520).toBe(true);
    expect(has1435).toBe(true);
  });

  it("marks a gauge break on the Poland/Ukraine frontier", () => {
    const breaks = corridors.corridors.filter((c) => {
      const a = String(c.a);
      const b = String(c.b);
      const plUa =
        (a.startsWith("pol-") && b.startsWith("ukr-")) ||
        (a.startsWith("ukr-") && b.startsWith("pol-"));
      return (
        c.kind === "rail" &&
        c.gauge_from &&
        c.gauge_to &&
        c.gauge_from !== c.gauge_to &&
        plUa
      );
    });
    expect(breaks.length).toBeGreaterThan(0);
    const edge = breaks[0]!;
    const pair = [Number(edge.gauge_from), Number(edge.gauge_to)];
    expect(pair.some((g) => g === 1520 || g === 1524)).toBe(true);
    expect(pair.some((g) => g === 1435)).toBe(true);
  });

  it("keeps coordinates off corridors.json", () => {
    expect(roster.theatre.chokepoints.some((c) => c.id === "bosphorus")).toBe(true);
    for (const corridor of corridors.corridors) {
      expect(corridor).not.toHaveProperty("lon");
      expect(corridor).not.toHaveProperty("lat");
      expect(corridor).not.toHaveProperty("coordinates");
      expect(Number(corridor.travel_ticks)).toBeGreaterThan(0);
      expect(Number.isInteger(Number(corridor.travel_ticks))).toBe(true);
    }
    const bosphorus = corridors.corridors.filter(
      (c) => c.a === "chokepoint-bosphorus" || c.b === "chokepoint-bosphorus",
    );
    expect(bosphorus.length).toBeGreaterThan(0);
  });
});
