import { describe, expect, it } from "vitest";
import { tick } from "../src/tick.ts";
import { PREDICATES } from "../src/phases/04-pacts.ts";
import { eventVisibleTo } from "../src/context.ts";
import { makeNation, STANDING_RULES } from "./sequence.ts";
import type { Obligation, Pact, WorldState } from "../src/types.ts";

function baseState(pact: Pact, extras: Partial<WorldState> = {}): WorldState {
  return {
    matchId: "pact-test",
    scenarioId: "t",
    tick: 3,
    seed: 1,
    nations: {
      uk: makeNation("uk"),
      fr: makeNation("fr"),
      us: makeNation("us"),
      eg: makeNation("eg"),
    },
    territories: {
      canal_zone: {
        id: "canal_zone",
        name: "Canal Zone",
        owner: "eg",
        controller: "eg",
        region: "nile",
        supplyValue: 10,
      },
      uk_home: {
        id: "uk_home",
        name: "Home",
        owner: "uk",
        controller: "uk",
        region: "europe",
        supplyValue: 10,
      },
    },
    formations: {
      "uk-1": {
        id: "uk-1",
        nationId: "uk",
        location: "uk_home",
        destination: null,
        strength: 5,
        inTransit: false,
      },
    },
    pacts: { [pact.id]: pact },
    beliefs: [],
    wars: [],
    tradeRoutes: [{ id: "uk-us-sterling", from: "uk", to: "us", open: true }],
    postures: {},
    flags: {},
    victory: {},
    tuning: {
      secret_pact_leak_base_chance_mille: 0,
      standing_penalty_on_breach: 25,
      cascade_depth_cap: 3,
    },
    lastEventSeq: 0,
    ...extras,
  };
}

function pactWith(obligation: Obligation, secret = false): Pact {
  const terms = {
    title: "Test instrument",
    type: "custom" as const,
    secret,
    obligations: [obligation],
  };
  return {
    id: "p1",
    parties: ["uk", "fr"],
    secret,
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
}

describe("pact predicates", () => {
  it("not_move_forces_into holds until a formation is present", () => {
    const obligation: Obligation = {
      id: "o1",
      party: "uk",
      must: "not_move_forces_into",
      target: "canal_zone",
    };
    const pact = pactWith(obligation);
    const state = baseState(pact);
    expect(PREDICATES.not_move_forces_into(state, obligation, pact)).toBe(true);
    state.formations["uk-1"]!.location = "canal_zone";
    expect(PREDICATES.not_move_forces_into(state, obligation, pact)).toBe(false);
  });

  it("maintain_trade_route fails when the route closes", () => {
    const obligation: Obligation = {
      id: "o1",
      party: "uk",
      must: "maintain_trade_route",
      target: "us",
    };
    const pact = pactWith(obligation);
    const state = baseState(pact);
    expect(PREDICATES.maintain_trade_route(state, obligation, pact)).toBe(true);
    state.tradeRoutes[0]!.open = false;
    expect(PREDICATES.maintain_trade_route(state, obligation, pact)).toBe(false);
  });

  it("not_declare_war_on fails after a declaration", () => {
    const obligation: Obligation = {
      id: "o1",
      party: "uk",
      must: "not_declare_war_on",
      target: "fr",
    };
    const pact = pactWith(obligation);
    const state = baseState(pact);
    expect(PREDICATES.not_declare_war_on(state, obligation, pact)).toBe(true);
    state.wars.push({ id: "w", attacker: "uk", defender: "fr", declared_tick: 1 });
    expect(PREDICATES.not_declare_war_on(state, obligation, pact)).toBe(false);
  });

  it("share_intelligence_on requires an ally_share belief this sitting", () => {
    const obligation: Obligation = {
      id: "o1",
      party: "uk",
      must: "share_intelligence_on",
      target: "eg",
    };
    const pact = pactWith(obligation);
    const state = baseState(pact);
    expect(PREDICATES.share_intelligence_on(state, obligation, pact)).toBe(false);
    state.beliefs.push({
      observer_nation_id: "fr",
      subject_type: "nation",
      subject_id: "eg",
      field: "exists",
      believed_value: true,
      confidence: 40,
      source: "ally_share",
      last_updated_tick: 3,
    });
    expect(PREDICATES.share_intelligence_on(state, obligation, pact)).toBe(true);
  });

  it("provide_passage fails when denied", () => {
    const obligation: Obligation = {
      id: "o1",
      party: "eg",
      must: "provide_passage",
      target: "uk",
    };
    const pact = pactWith(obligation);
    const state = baseState(pact);
    expect(PREDICATES.provide_passage(state, obligation, pact)).toBe(true);
    state.flags["passage_denied:eg:uk"] = true;
    expect(PREDICATES.provide_passage(state, obligation, pact)).toBe(false);
  });

  it("pay_tribute fails unless the flag for this tick is set", () => {
    const obligation: Obligation = {
      id: "o1",
      party: "uk",
      must: "pay_tribute",
      target: "fr",
      params: { amount: 3 },
    };
    const pact = pactWith(obligation);
    const state = baseState(pact);
    expect(PREDICATES.pay_tribute(state, obligation, pact)).toBe(false);
    state.flags["tribute_paid:uk:fr:3"] = 3;
    expect(PREDICATES.pay_tribute(state, obligation, pact)).toBe(true);
  });

  it("a secret pact breach is not visible to non-signatories", () => {
    const obligation: Obligation = {
      id: "o1",
      party: "uk",
      must: "not_declare_war_on",
      target: "fr",
    };
    const pact = pactWith(obligation, true);
    const state = baseState(pact);
    const result = tick(
      state,
      [{ id: "ord", nationId: "uk", seq: 0, kind: "declare_war", payload: { target: "fr" } }],
      1,
      { effectRules: STANDING_RULES, assertEvents: true },
    );
    const breach = result.events.find((e) => e.type === "pact.breached");
    expect(breach).toBeTruthy();
    expect(eventVisibleTo(breach!, "uk")).toBe(true);
    expect(eventVisibleTo(breach!, "fr")).toBe(true);
    expect(eventVisibleTo(breach!, "us")).toBe(false);
    expect(eventVisibleTo(breach!, "eg")).toBe(false);
  });
});
