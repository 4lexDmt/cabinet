/**
 * GUARD 4 of 4 — protects the deception system.
 *
 * Planted intelligence must render identically to genuine intelligence at equal
 * confidence. If a player could tell the two apart by looking at the map, every
 * planted belief in the game would be self-cancelling and betrayal would be
 * telegraphed rather than discovered.
 *
 * Byte-identical is the standard, so the assertions compare serialized paint
 * rather than field by field: a new field added to a paint object would be
 * caught by this test rather than sailing past a hand-written comparison.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  boundaryConfidencePaint,
  collapseIntelSource,
  forceMarkPaint,
  readingFrom,
  readingState,
  stateLegend,
  territoryPaint,
} from "../src/index.ts";

const geoSrc = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

/** Sources that are genuine but arrive at the same provenance as a plant. */
const GENUINE_INFERENCE = "inference";
const PLANTED = "planted";

function paintBundle(source: string, confidence: number, tick: number, lastUpdatedTick: number) {
  const reading = readingFrom({ confidence, source, last_updated_tick: lastUpdatedTick }, tick);
  return JSON.stringify({
    reading,
    state: readingState(reading),
    territory: territoryPaint(reading),
    boundary: boundaryConfidencePaint(reading),
    forceFriendly: forceMarkPaint(reading, "friendly"),
    forceHostile: forceMarkPaint(reading, "hostile"),
    legend: stateLegend(reading),
  });
}

describe("planted and genuine intelligence are indistinguishable", () => {
  it("produce byte-identical paint at equal confidence", () => {
    for (const confidence of [0, 12, 49, 50, 63, 79, 80, 95, 100]) {
      for (const age of [0, 1, 4, 6, 12, 18, 40]) {
        const tick = 120;
        const last = tick - age;
        expect(
          paintBundle(PLANTED, confidence, tick, last),
          `confidence ${confidence}, age ${age}`,
        ).toBe(paintBundle(GENUINE_INFERENCE, confidence, tick, last));
      }
    }
  });

  it("collapse to the same provenance", () => {
    expect(collapseIntelSource(PLANTED)).toBe("inferred");
    expect(collapseIntelSource(GENUINE_INFERENCE)).toBe("inferred");
    expect(collapseIntelSource(PLANTED)).toBe(collapseIntelSource(GENUINE_INFERENCE));
  });

  it("collapse to the same display state", () => {
    for (const confidence of [10, 55, 90]) {
      const planted = readingFrom(
        { confidence, source: PLANTED, last_updated_tick: 100 },
        104,
      );
      const genuine = readingFrom(
        { confidence, source: GENUINE_INFERENCE, last_updated_tick: 100 },
        104,
      );
      expect(readingState(planted)).toBe(readingState(genuine));
    }
  });
});

describe("the leak is structurally impossible, not merely absent", () => {
  it("a reading has no field that could carry a source", () => {
    const reading = readingFrom(
      { confidence: 70, source: PLANTED, last_updated_tick: 8 },
      10,
    );
    expect(Object.keys(reading).sort()).toEqual([
      "confidence",
      "contested",
      "lastUpdatedTick",
      "nothingInFile",
      "provenance",
      "staleness",
    ]);
    expect(JSON.stringify(reading)).not.toContain(PLANTED);
  });

  it("extra properties on the input are dropped at the funnel", () => {
    const smuggled = {
      confidence: 70,
      source: GENUINE_INFERENCE,
      last_updated_tick: 8,
      planted: true,
      truth: "actually false",
    };
    const reading = readingFrom(smuggled, 10);
    expect(reading).not.toHaveProperty("planted");
    expect(reading).not.toHaveProperty("truth");
    expect(JSON.stringify(territoryPaint(reading))).not.toContain("planted");
  });

  it("no paint function mentions planted intelligence at all", () => {
    const files = readdirSync(geoSrc)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => join(geoSrc, f))
      .filter((f) => statSync(f).isFile());
    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      // Strip comments: the constraint is documented in prose on purpose.
      const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      if (/\bplanted\b/i.test(code)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });
});

describe("confidence still reads honestly for everything else", () => {
  it("separates own, ally and purchased provenance", () => {
    expect(collapseIntelSource("direct_observation")).toBe("own");
    expect(collapseIntelSource("ally_share")).toBe("ally");
    expect(collapseIntelSource("purchased_intel")).toBe("purchased");
  });

  it("a stale reading names when it was last confirmed", () => {
    const reading = readingFrom(
      { confidence: 90, source: "direct_observation", last_updated_tick: 40 },
      100,
    );
    expect(readingState(reading)).toBe("stale");
    expect(stateLegend(reading)).toBe("Last confirmed sitting 40.");
  });

  it("blind is an absence in the file, not an empty tile", () => {
    const paint = territoryPaint({
      confidence: "unverified",
      provenance: "inferred",
      staleness: null,
      contested: false,
      nothingInFile: true,
      lastUpdatedTick: null,
    });
    expect(paint.hatch).toBe("p-blind");
    expect(paint.fillOpacity).toBe(1);
  });
});
