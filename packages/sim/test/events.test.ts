import { describe, expect, it } from "vitest";
import { tick } from "../src/tick.ts";
import { makeNation } from "./sequence.ts";
import type { WorldState } from "../src/types.ts";

describe("event completeness", () => {
  it("every standing movement has an attributed event", () => {
    const state: WorldState = {
      matchId: "e",
      scenarioId: "e",
      tick: 0,
      seed: 1,
      nations: { uk: makeNation("uk"), us: makeNation("us") },
      territories: {
        ukh: { id: "ukh", name: "UK", owner: "uk", controller: "uk", region: "e", supplyValue: 1 },
      },
      formations: {},
      pacts: {},
      beliefs: [],
      wars: [],
      tradeRoutes: [],
      postures: {},
      flags: {},
      victory: {},
      tuning: {
        secret_pact_leak_base_chance_mille: 0,
        standing_penalty_on_breach: 25,
        cascade_depth_cap: 3,
      },
      lastEventSeq: 0,
    };
    const result = tick(
      state,
      [{ id: "p", nationId: "us", seq: 0, kind: "economic_pressure", payload: { target: "uk", intensity: 2 } }],
      1,
      { assertEvents: true },
    );
    const economy = result.events.find((e) => e.type === "economy.pressured");
    expect(economy).toBeTruthy();
    expect(economy?.payload.delta).toBe(-8);
    expect(result.state.nations.uk?.economy).toBe(42);
  });
});
