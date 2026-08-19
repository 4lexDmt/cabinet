import { describe, expect, it } from "vitest";
import { tick } from "../src/tick.ts";
import { PREDICATES } from "../src/phases/04-pacts.ts";
import { makeNation } from "./sequence.ts";
import { loadEffectRules } from "../../rules/src/index.ts";
import type { Obligation, Pact, WorldState } from "../src/types.ts";

const RULES = loadEffectRules();

function world(extras: Partial<WorldState> = {}): WorldState {
  return {
    matchId: "water",
    scenarioId: "indus",
    tick: 0,
    seed: 1,
    nations: {
      ind: makeNation("ind", { economy: 40, standing_external: 50, standing_internal: 50 }),
      pak: makeNation("pak", { economy: 40, standing_external: 50, standing_internal: 50 }),
    },
    territories: {
      "in-jk": {
        id: "in-jk",
        name: "Kashmir",
        owner: "ind",
        controller: "ind",
        region: "indus",
        supplyValue: 4,
      },
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
    sites: {
      "in-jk": {
        id: "in-jk",
        kind: "province",
        nationId: "ind",
        slots: 2,
        occupied: 0,
        water_ids: ["rv-indus"],
        coastal: false,
      },
    },
    ...extras,
  };
}

function treaty(): Pact {
  const terms = {
    title: "Indus Waters",
    type: "water_treaty" as const,
    secret: false,
    obligations: [
      {
        id: "ind-flow",
        party: "ind",
        must: "maintain_minimum_flow" as const,
        target: "rv-indus",
        params: { flow: 1 },
      },
      {
        id: "ind-dam",
        party: "ind",
        must: "not_construct_upstream_of" as const,
        target: "rv-indus",
      },
    ],
  };
  return {
    id: "indus-treaty",
    parties: ["ind", "pak"],
    secret: false,
    visible_to: ["ind", "pak"],
    public_terms: terms,
    private_terms: terms,
    status: "active",
    broken_by: null,
    broken_tick: null,
    signed_by: ["ind", "pak"],
    created_tick: 0,
    activated_tick: 0,
  };
}

describe("water diplomacy", () => {
  it("upstream impoundment drains downstream economy and costs standing", () => {
    const start = world();
    const result = tick(
      start,
      [
        {
          id: "dam",
          nationId: "ind",
          seq: 0,
          kind: "construct_upstream",
          payload: { site_id: "in-jk", water_id: "rv-indus", downstream_nation: "pak" },
        },
      ],
      1,
      { effectRules: RULES },
    );
    expect(result.events.some((e) => e.type === "water.impounded")).toBe(true);
    expect(result.state.nations.pak?.economy).toBe(32);
    expect(result.state.nations.ind?.standing_external).toBe(44);
    expect(result.state.flags["upstream_impound:rv-indus"]).toBe("ind");
    expect(result.state.flags["flow:rv-indus"]).toBe(0);
  });

  it("constructing upstream of a water treaty is pact.breached", () => {
    const start = world({ pacts: { "indus-treaty": treaty() } });
    const result = tick(
      start,
      [
        {
          id: "dam",
          nationId: "ind",
          seq: 0,
          kind: "construct_upstream",
          payload: { site_id: "in-jk", water_id: "rv-indus", downstream_nation: "pak" },
        },
      ],
      1,
      { effectRules: RULES },
    );
    expect(result.events.some((e) => e.type === "pact.breached")).toBe(true);
    expect(result.state.pacts["indus-treaty"]?.status).toBe("broken");
    expect(result.state.nations.ind?.standing_external).toBe(19);
  });

  it("desiccation is a multi-tick drain on riparian economy and internal standing", () => {
    const start = world({
      flags: {
        "desiccation:lk-chad": 0,
        "desiccation_riparian:lk-chad:pak": true,
      },
    });
    const first = tick(start, [], 1, { effectRules: RULES });
    expect(first.state.flags["desiccation:lk-chad"]).toBe(1);
    expect(first.state.nations.pak?.economy).toBe(39);
    expect(first.state.nations.pak?.standing_internal).toBe(49);
    const second = tick(first.state, [], 1, { effectRules: RULES });
    expect(second.state.flags["desiccation:lk-chad"]).toBe(2);
    expect(second.state.nations.pak?.economy).toBe(38);
  });

  it("hydrological sharing and navigation predicates read world truth flags", () => {
    const share: Obligation = {
      id: "s",
      party: "ind",
      must: "share_hydrological_data",
      target: "rv-indus",
    };
    const nav: Obligation = { id: "n", party: "ind", must: "permit_navigation", target: "pak" };
    const state = world({
      tick: 4,
      flags: { "hydro_data:ind:rv-indus": 4 },
    });
    const dummy = treaty();
    expect(PREDICATES.share_hydrological_data(state, share, dummy)).toBe(true);
    expect(PREDICATES.permit_navigation(state, nav, dummy)).toBe(true);
    state.flags["navigation_denied:ind:pak"] = true;
    expect(PREDICATES.permit_navigation(state, nav, dummy)).toBe(false);
  });
});
