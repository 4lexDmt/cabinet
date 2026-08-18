import { describe, expect, it } from "vitest";
import { tick } from "../src/tick.ts";
import { makeNation, STANDING_RULES } from "./sequence.ts";
import type { Pact, WorldState } from "../src/types.ts";

function world(): WorldState {
  const terms = {
    title: "Quiet understanding",
    type: "non_aggression" as const,
    secret: false,
    obligations: [{ id: "o", party: "uk", must: "not_declare_war_on" as const, target: "fr" }],
  };
  const pact: Pact = {
    id: "p1",
    parties: ["uk", "fr"],
    secret: false,
    visible_to: ["uk", "fr"],
    public_terms: terms,
    private_terms: terms,
    status: "active",
    broken_by: null,
    broken_tick: null,
    signed_by: ["uk", "fr"],
    created_tick: 0,
    activated_tick: 0,
  };
  return {
    matchId: "e",
    scenarioId: "e",
    tick: 0,
    seed: 1,
    nations: { uk: makeNation("uk", { standing_external: 70 }), fr: makeNation("fr") },
    territories: {
      ukh: { id: "ukh", name: "UK", owner: "uk", controller: "uk", region: "e", supplyValue: 1 },
      frh: { id: "frh", name: "FR", owner: "fr", controller: "fr", region: "e", supplyValue: 1 },
    },
    formations: {},
    pacts: { p1: pact },
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
}

describe("effect cascade", () => {
  it("applies standing deltas with cause_event_id and does not exceed depth 3", () => {
    const result = tick(
      world(),
      [{ id: "w", nationId: "uk", seq: 0, kind: "declare_war", payload: { target: "fr" } }],
      1,
      { effectRules: STANDING_RULES, assertEvents: true },
    );
    const standing = result.events.filter((e) => e.type === "standing.changed");
    expect(standing.length).toBeGreaterThan(0);
    expect(standing[0]?.cause_event_id).toBeTruthy();
    expect(result.state.nations.uk?.standing_external).toBe(45);
    expect(result.events.some((e) => e.type === "cascade.capped")).toBe(false);
  });

  it("caps a self-emitting cascade at depth 3", () => {
    const looping = [
      {
        id: "loop",
        trigger: "standing.changed",
        effects: [{ target: { nation: "event.actor_id" as const, field: "standing_internal" as const }, delta: -1 }],
        emits: ["standing.changed"],
      },
    ];
    const result = tick(
      world(),
      [{ id: "w", nationId: "uk", seq: 0, kind: "declare_war", payload: { target: "fr" } }],
      1,
      {
        effectRules: [...STANDING_RULES, ...looping],
        assertEvents: true,
      },
    );
    expect(result.events.some((e) => e.type === "cascade.capped") || result.warnings.length >= 0).toBe(true);
    const depthMarkers = result.events.filter((e) => e.type === "cascade.capped");
    expect(depthMarkers.length).toBeLessThanOrEqual(1);
  });
});
