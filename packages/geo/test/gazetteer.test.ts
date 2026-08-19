import { describe, expect, it } from "vitest";
import {
  BUILD_CAPACITY,
  ISLAND_PROVINCES,
  PROVINCE_COUNT_BANDS,
  SHARED_LAKE_IDS,
  SHARED_RIVER_IDS,
  TIER1_ISOS,
  allProvinces,
  bordersOf,
  buildCapacityOf,
  citiesOf,
  gazetteer,
  lakesOf,
  provinceById,
  provincesOf,
  riversOf,
  sharedWaters,
  uniqueLakes,
  uniqueRivers,
  waterNoteOf,
  type Tier1Iso,
} from "../src/index.ts";

describe("tier-1 gazetteer", () => {
  it("loads and validates the shipped file", () => {
    expect(gazetteer.version).toBe("3.0");
    expect(gazetteer.countries.map((c) => c.iso)).toEqual([...TIER1_ISOS]);
  });

  it("province count bands", () => {
    for (const iso of TIER1_ISOS) {
      const [lo, hi] = PROVINCE_COUNT_BANDS[iso];
      const count = provincesOf(iso).length;
      expect(count, iso).toBeGreaterThanOrEqual(lo);
      expect(count, iso).toBeLessThanOrEqual(hi);
    }
  });

  it("city cap — ten per nation, every province id resolves", () => {
    for (const iso of TIER1_ISOS) {
      const cities = citiesOf(iso);
      const ids = new Set(provincesOf(iso).map((p) => p.id));
      expect(cities, iso).toHaveLength(10);
      for (const city of cities) {
        expect(ids.has(city.province), `${iso} ${city.name} -> ${city.province}`).toBe(true);
      }
    }
  });

  it("border symmetry", () => {
    for (const province of allProvinces()) {
      for (const neighbour of province.borders) {
        const other = provinceById(neighbour);
        expect(other, `${province.id} lists missing ${neighbour}`).toBeDefined();
        expect(other!.borders, `${neighbour} must list ${province.id}`).toContain(province.id);
      }
    }
  });

  it("border non-emptiness — only Hawaii and Réunion are islands", () => {
    const orphans = allProvinces().filter((p) => p.borders.length === 0).map((p) => p.id).sort();
    expect(orphans).toEqual([...ISLAND_PROVINCES].sort());
    expect(bordersOf("us-hawaii")).toEqual([]);
    expect(bordersOf("fr-reu")).toEqual([]);
  });

  it("build slot totals", () => {
    let grand = 0;
    for (const iso of TIER1_ISOS) {
      const cap = buildCapacityOf(iso);
      expect(cap, iso).toBe(BUILD_CAPACITY[iso]);
      grand += cap;
    }
    expect(grand).toBe(1227);
  });

  it("water referential integrity", () => {
    const provinceIds = new Set(allProvinces().map((p) => p.id));
    for (const iso of TIER1_ISOS) {
      for (const lake of lakesOf(iso)) {
        expect(provinceIds.has(lake.nearest_province), `${lake.id} nearest ${lake.nearest_province}`).toBe(
          true,
        );
        for (const riparian of lake.riparian) {
          expect(riparian).toMatch(/^[A-Z]{3}$/);
        }
      }
      for (const river of riversOf(iso)) {
        expect(river.course.length, river.id).toBeGreaterThanOrEqual(2);
        for (const riparian of river.riparian) {
          expect(riparian).toMatch(/^[A-Z]{3}$/);
        }
      }
    }
  });

  it("shared-water count — nine lakes and the shipped rivers", () => {
    const lakes = uniqueLakes().filter((l) => l.shared).map((l) => l.id);
    const rivers = uniqueRivers().filter((r) => r.shared).map((r) => r.id);
    expect(lakes).toEqual([...SHARED_LAKE_IDS].sort());
    expect(rivers).toEqual([...SHARED_RIVER_IDS].sort());
    const shared = sharedWaters();
    expect(shared.filter((w) => w.id.startsWith("lk-"))).toHaveLength(9);
    expect(shared.filter((w) => w.id.startsWith("rv-")).map((w) => w.id)).toEqual(
      [...SHARED_RIVER_IDS].sort(),
    );
  });

  it("Saudi Arabia carries a water_note rather than empty scenery", () => {
    expect(lakesOf("SAU")).toEqual([]);
    expect(riversOf("SAU")).toEqual([]);
    const note = waterNoteOf("SAU");
    expect(note).toBeDefined();
    expect(note!.natural_lakes).toBe(0);
    expect(note!.perennial_rivers).toBe(0);
    expect(note!.assets.map((a) => a.type).sort()).toEqual(
      ["desalination", "desalination", "desalination", "fossil_aquifer", "wadi", "wadi"].sort(),
    );
    expect(waterNoteOf("USA")).toBeUndefined();
  });

  it("listing totals match the human gazetteer", () => {
    const listings = gazetteer.countries.reduce(
      (acc, c) => {
        acc.provinces += c.provinces.length;
        acc.cities += c.cities.length;
        acc.lakes += c.lakes.length;
        acc.rivers += c.rivers.length;
        return acc;
      },
      { provinces: 0, cities: 0, lakes: 0, rivers: 0 },
    );
    expect(listings).toEqual({ provinces: 283, cities: 140, lakes: 53, rivers: 48 });
    expect(uniqueLakes()).toHaveLength(52);
  });
});

describe("ice month parsing", () => {
  it("maps gazetteer strings onto closed calendar months", async () => {
    const { iceMonthsToClosed } = await import("../src/index.ts");
    expect(iceMonthsToClosed(null)).toEqual([]);
    expect(iceMonthsToClosed("none")).toEqual([]);
    expect(iceMonthsToClosed("Jan-Mar")).toEqual([1, 2, 3]);
    expect(iceMonthsToClosed("Nov-Mar (north)")).toEqual([11, 12, 1, 2, 3]);
    expect(iceMonthsToClosed("Sep-Jun")).toEqual([9, 10, 11, 12, 1, 2, 3, 4, 5, 6]);
    expect(iceMonthsToClosed("Dec-Apr")).toEqual([12, 1, 2, 3, 4]);
  });
});

const _isoCheck: Tier1Iso = "USA";
void _isoCheck;
