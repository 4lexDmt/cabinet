/**
 * Era rules, checked against the catalog rather than a fixture.
 *
 * A scenario that renders a 200nm EEZ in 1815 is not a minor inaccuracy —
 * it is the map asserting something that had not been invented. These tests
 * are the lock on that: every catalog table carries a `geo` block, and the
 * resolver refuses layers the year did not have.
 *
 * Scenario JSON is read as data. This package does not import
 * `@cabinet/scenarios`, because that package imports the simulation.
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  eezExistsInYear,
  firsExistInYear,
  layerAbsenceReason,
  layerPermitted,
  resolveScenarioGeo,
  scenarioGeoSchema,
  territorialSeaNmForYear,
  type ScenarioGeoConfig,
} from "../src/index.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const scenariosDir = join(repoRoot, "packages", "scenarios");

function catalogGeo(): Array<{ id: string; file: string; geo: ScenarioGeoConfig }> {
  const out: Array<{ id: string; file: string; geo: ScenarioGeoConfig }> = [];
  for (const file of readdirSync(scenariosDir).filter((name) => name.endsWith(".json") && name !== "package.json").sort()) {
    const raw = JSON.parse(readFileSync(join(scenariosDir, file), "utf8")) as {
      id: string;
      geo?: unknown;
    };
    expect(raw.geo, `${file} is missing a geo block`).toBeDefined();
    out.push({ id: raw.id, file, geo: scenarioGeoSchema.parse(raw.geo) });
  }
  return out;
}

function stub(year: number, overrides: Partial<ScenarioGeoConfig> = {}): ScenarioGeoConfig {
  return scenarioGeoSchema.parse({
    year,
    theatre_bbox: [0, 0, 10, 10],
    boundaries_source: "geo/test.geojson",
    ...overrides,
  });
}

describe("era defaults", () => {
  it("keeps the territorial sea at three nautical miles until UNCLOS is signed", () => {
    expect(territorialSeaNmForYear(1815)).toBe(3);
    expect(territorialSeaNmForYear(1956)).toBe(3);
    expect(territorialSeaNmForYear(1981)).toBe(3);
    expect(territorialSeaNmForYear(1982)).toBe(12);
  });

  it("does not treat an EEZ as live until UNCLOS enters force in 1994", () => {
    expect(eezExistsInYear(1982)).toBe(false);
    expect(eezExistsInYear(1991)).toBe(false);
    expect(eezExistsInYear(1993)).toBe(false);
    expect(eezExistsInYear(1994)).toBe(true);
  });

  it("has no flight information regions before 1947", () => {
    expect(firsExistInYear(1939)).toBe(false);
    expect(firsExistInYear(1947)).toBe(true);
  });
});

describe("resolveScenarioGeo", () => {
  it("Vienna 1815: cannon-shot sea, no EEZ, no FIR, no roads", () => {
    const resolved = resolveScenarioGeo(stub(1815));
    expect(resolved.maritime.territorialSeaNm).toBe(3);
    expect(resolved.hasEez).toBe(false);
    expect(resolved.hasFir).toBe(false);
    expect(resolved.roadEra).toBe("none");
    expect(layerPermitted(resolved, "maritime_eez")).toBe(false);
    expect(layerPermitted(resolved, "maritime_contiguous")).toBe(false);
    expect(layerPermitted(resolved, "airspace_fir")).toBe(false);
    expect(layerPermitted(resolved, "roads")).toBe(false);
    expect(layerPermitted(resolved, "coastline")).toBe(true);
    expect(layerPermitted(resolved, "maritime_territorial")).toBe(true);
    expect(layerAbsenceReason(resolved, "maritime_eez")).toMatch(/1994/);
    expect(layerAbsenceReason(resolved, "airspace_fir")).toMatch(/1947/);
  });

  it("Sèvres 1956: three-mile sea in a canal crisis, still no EEZ", () => {
    const resolved = resolveScenarioGeo(stub(1956));
    expect(resolved.maritime.territorialSeaNm).toBe(3);
    expect(resolved.hasEez).toBe(false);
    expect(resolved.roadEra).toBe("motorway");
    expect(layerPermitted(resolved, "roads")).toBe(true);
    expect(layerPermitted(resolved, "maritime_eez")).toBe(false);
  });

  it("Long Telegram 1947: FIRs exist, EEZ does not", () => {
    const resolved = resolveScenarioGeo(stub(1947, { has_fir: true }));
    expect(resolved.hasFir).toBe(true);
    expect(resolved.hasEez).toBe(false);
    expect(layerPermitted(resolved, "airspace_fir")).toBe(true);
    expect(layerPermitted(resolved, "maritime_eez")).toBe(false);
  });

  it("Malvinas 1982: twelve-mile sea, EEZ still refused — signed is not in force", () => {
    const resolved = resolveScenarioGeo(stub(1982, { has_eez: false }));
    expect(resolved.maritime.territorialSeaNm).toBe(12);
    expect(resolved.hasEez).toBe(false);
    expect(layerPermitted(resolved, "maritime_contiguous")).toBe(true);
    expect(layerPermitted(resolved, "maritime_eez")).toBe(false);
  });

  it("Fragmentation 1991: still three years from an enforceable EEZ", () => {
    const resolved = resolveScenarioGeo(stub(1991, { has_eez: false }));
    expect(resolved.hasEez).toBe(false);
    expect(layerPermitted(resolved, "maritime_eez")).toBe(false);
  });

  it("an explicit override wins over the year", () => {
    const withEez = resolveScenarioGeo(stub(1956, { has_eez: true }));
    expect(withEez.hasEez).toBe(true);
    expect(layerPermitted(withEez, "maritime_eez")).toBe(true);
  });
});

describe("catalog geo blocks", () => {
  const catalog = catalogGeo();

  it("ships a geo block on every catalog scenario", () => {
    expect(catalog).toHaveLength(16);
  });

  it("states a theatre, not the union of every great-power homeland", () => {
    for (const { id, geo } of catalog) {
      const [w, s, e, n] = geo.theatre_bbox;
      expect(e, id).toBeGreaterThan(w);
      expect(n, id).toBeGreaterThan(s);
      const worldwide = e - w > 300 && n - s > 120;
      if (id !== "long_telegram_1947") {
        expect(worldwide, `${id} theatre_bbox is the whole world`).toBe(false);
      }
    }
  });

  it("Sèvres is a three-mile canal crisis with no EEZ", () => {
    const sevres = catalog.find((entry) => entry.id === "sevres_1956");
    expect(sevres).toBeDefined();
    const resolved = resolveScenarioGeo(sevres!.geo);
    expect(resolved.year).toBe(1956);
    expect(resolved.maritime.territorialSeaNm).toBe(3);
    expect(resolved.hasEez).toBe(false);
    expect(layerPermitted(resolved, "maritime_eez")).toBe(false);
    expect(layerPermitted(resolved, "airspace_fir")).toBe(true);
  });

  it("Vienna has neither FIR nor EEZ nor roads", () => {
    const vienna = catalog.find((entry) => entry.id === "vienna_1815");
    const resolved = resolveScenarioGeo(vienna!.geo);
    expect(resolved.hasFir).toBe(false);
    expect(resolved.hasEez).toBe(false);
    expect(resolved.roadEra).toBe("none");
    expect(layerPermitted(resolved, "roads")).toBe(false);
    expect(layerPermitted(resolved, "airspace_fir")).toBe(false);
  });

  it("1947 is the first catalog year that carries FIRs", () => {
    const telegram = catalog.find((entry) => entry.id === "long_telegram_1947");
    expect(telegram?.geo.has_fir).toBe(true);
    expect(resolveScenarioGeo(telegram!.geo).hasFir).toBe(true);
    for (const entry of catalog) {
      const resolved = resolveScenarioGeo(entry.geo);
      if (entry.geo.year < 1947) expect(resolved.hasFir, entry.id).toBe(false);
    }
  });

  it("1991 and 1982 refuse the EEZ even though UNCLOS has been signed", () => {
    const malvinas = catalog.find((entry) => entry.id === "malvinas_1982");
    const fragmentation = catalog.find((entry) => entry.id === "fragmentation_1991");
    expect(malvinas?.geo.has_eez).toBe(false);
    expect(fragmentation?.geo.has_eez).toBe(false);
    expect(resolveScenarioGeo(malvinas!.geo).hasEez).toBe(false);
    expect(resolveScenarioGeo(fragmentation!.geo).hasEez).toBe(false);
  });

  it("Afghanistan, landlocked, still names a road era because the Salang is the theatre", () => {
    const afghanistan = catalog.find((entry) => entry.id === "afghanistan_1979");
    expect(afghanistan?.geo.road_era).toBe("rail_and_road");
    const resolved = resolveScenarioGeo(afghanistan!.geo);
    expect(layerPermitted(resolved, "roads")).toBe(true);
    expect(layerPermitted(resolved, "maritime_eez")).toBe(false);
  });
});
