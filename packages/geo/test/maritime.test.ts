/**
 * GUARD 2 of 4 — protects EEZ correctness.
 *
 * Marine Regions publishes EEZ polygons that *include* archipelagic, internal
 * and territorial waters — a deliberate deviation from the UNCLOS definition.
 * Stacking the published layers double-renders the inner zones: wrong colours,
 * wrong areas, and a territorial sea that silently reads as four bands deep.
 *
 * After differencing, every point of sea belongs to exactly one zone. That is
 * what this asserts, and it asserts it over the era ladders too, because a 1956
 * scenario has a three-mile territorial sea and no EEZ at all.
 */

import { describe, expect, it } from "vitest";
import {
  CANNON_SHOT_ERA,
  DIFFERENCE_ORDER,
  UNCLOS_ERA,
  ZONE_LADDER,
  bandGaps,
  bandOverlaps,
  isTerritorialWater,
  kmToNm,
  nmToKm,
  waterClassOf,
  zoneAtDistanceNm,
  zoneBands,
  type MaritimeEra,
} from "../src/index.js";

const ERAS: Array<[string, MaritimeEra]> = [
  ["UNCLOS", UNCLOS_ERA],
  ["cannon shot", CANNON_SHOT_ERA],
  ["territorial sea only", { territorialSeaNm: 6, hasContiguousZone: false, hasEez: false }],
  ["no contiguous zone", { territorialSeaNm: 12, hasContiguousZone: false, hasEez: true }],
];

describe("maritime zones do not overlap", () => {
  for (const [label, era] of ERAS) {
    it(`${label}: bands are mutually exclusive`, () => {
      expect(bandOverlaps(zoneBands(era))).toEqual([]);
    });

    it(`${label}: bands leave no gap`, () => {
      expect(bandGaps(zoneBands(era))).toEqual([]);
    });

    it(`${label}: every distance resolves to exactly one zone`, () => {
      const bands = zoneBands(era);
      for (let nm = 0; nm <= 400; nm += 0.25) {
        const claimants = bands.filter(
          (b) => nm >= b.innerNm && (b.outerNm === null || nm < b.outerNm),
        );
        expect(claimants, `distance ${nm}nm claimed by ${claimants.length} zones`).toHaveLength(1);
        expect(zoneAtDistanceNm(nm, era)).toBe(claimants[0]!.zone);
      }
    });
  }
});

describe("zone semantics", () => {
  it("an EEZ is not territory", () => {
    expect(isTerritorialWater("eez")).toBe(false);
    expect(isTerritorialWater("contiguous")).toBe(false);
    expect(isTerritorialWater("high_seas")).toBe(false);
    expect(isTerritorialWater("territorial")).toBe(true);
    expect(isTerritorialWater("internal")).toBe(true);
  });

  it("an EEZ confers resource rights only, and the legend says so", () => {
    const eez = ZONE_LADDER.find((z) => z.zone === "eez")!;
    expect(eez.sovereignty).toBe("resource_rights_only");
    expect(eez.outerLimitNm).toBe(200);
    expect(eez.legend).toContain("Not territory");
  });

  it("international waters is not one thing", () => {
    expect(waterClassOf("internal")).toBe("sovereign");
    expect(waterClassOf("territorial")).toBe("sovereign");
    expect(waterClassOf("contiguous")).toBe("resource_jurisdiction");
    expect(waterClassOf("eez")).toBe("resource_jurisdiction");
    expect(waterClassOf("high_seas")).toBe("high_seas");
  });

  it("the difference order runs landward to seaward", () => {
    expect([...DIFFERENCE_ORDER]).toEqual(["internal", "territorial", "contiguous", "eez"]);
  });

  it("pre-UNCLOS, the sea beyond three miles is already high seas", () => {
    expect(zoneAtDistanceNm(2, CANNON_SHOT_ERA)).toBe("territorial");
    expect(zoneAtDistanceNm(4, CANNON_SHOT_ERA)).toBe("high_seas");
    expect(zoneAtDistanceNm(150, CANNON_SHOT_ERA)).toBe("high_seas");
  });

  it("under UNCLOS, the ladder runs 12 / 24 / 200", () => {
    expect(zoneAtDistanceNm(6, UNCLOS_ERA)).toBe("territorial");
    expect(zoneAtDistanceNm(18, UNCLOS_ERA)).toBe("contiguous");
    expect(zoneAtDistanceNm(120, UNCLOS_ERA)).toBe("eez");
    expect(zoneAtDistanceNm(260, UNCLOS_ERA)).toBe("high_seas");
  });

  it("nautical mile conversion round-trips", () => {
    expect(kmToNm(nmToKm(200))).toBeCloseTo(200, 9);
    expect(nmToKm(12)).toBeCloseTo(22.224, 6);
  });
});
