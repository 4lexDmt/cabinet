import { describe, expect, it } from "vitest";
import { loadWorld, listScenarios, readScenarioFile, CATALOG_FILES } from "../../scenarios/src/index.ts";
import { tick } from "../src/tick.ts";
import { forceOf } from "../src/force.ts";

describe("scenario isolation", () => {
  it("loads every catalog scenario with zero engine changes", () => {
    const loaded = listScenarios();
    expect(loaded).toHaveLength(16);
    expect(loaded.map((s) => s.id)).toEqual(CATALOG_FILES.map((file) => readScenarioFile(file).id));
    for (const config of loaded) {
      const state = loadWorld(config, `m-${config.id}`, 1);
      expect(Object.keys(state.nations).length).toBe(config.player_slots);
      expect(Object.keys(state.territories).length).toBeGreaterThan(0);
      const result = tick(state, [], 1, { assertEvents: true });
      expect(result.state.tick).toBe(1);
      expect(result.events.some((e) => e.type === "tick.resolved")).toBe(true);
    }
  });

  it("Sèvres produces valid state including derived force", () => {
    const config = readScenarioFile("sevres-1956.json");
    const state = loadWorld(config, "m-sevres", 42);
    expect(state.nations.uk).toBeTruthy();
    expect(state.territories.canal_zone?.controller).toBe("eg");
    expect(state.flags.canal_nationalized).toBe(true);
    expect(forceOf(state.nations.uk!)).toBeGreaterThan(0);
    expect(state.tuning.secret_pact_leak_base_chance_mille).toBe(800);
  });
});
