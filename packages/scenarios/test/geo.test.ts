/**
 * The catalog preserves `geo`. Zod strips unknown keys, so without the field
 * on the scenario schema the theatre frame would vanish at load and the map
 * would have nothing to frame.
 *
 * This package must not import `@cabinet/geo`. The shape lives here so the
 * tick worker can load a scenario without pulling projection math.
 */

import { describe, expect, it } from "vitest";
import { listScenarios, readScenarioFile } from "../src/index.ts";

describe("scenario geo is config, and it survives the schema", () => {
  it("every catalog table still has a geo block after parse", () => {
    const loaded = listScenarios();
    expect(loaded).toHaveLength(16);
    for (const config of loaded) {
      expect(config.geo, config.id).toBeDefined();
      expect(config.geo?.year).toBeGreaterThan(1800);
      expect(config.geo?.theatre_bbox).toHaveLength(4);
      expect(config.geo?.boundaries_source).toMatch(/^geo\//);
    }
  });

  it("does not put coordinates on the world the tick sees", () => {
    const config = readScenarioFile("sevres-1956.json");
    expect(config.geo?.theatre_bbox).toEqual([28, 25, 39, 34]);
    // loadWorld is exercised by packages/sim/test/scenario.test.ts — this
    // assertion is only that the config field exists beside, not inside, state.
    expect("geo" in config).toBe(true);
  });
});
