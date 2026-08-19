import { describe, expect, it } from "vitest";
import { tick } from "../src/tick.ts";
import { monthOf, shortestPath } from "../src/corridor.ts";
import { makeNation } from "./sequence.ts";
import type { Corridor, Formation, WorldState } from "../src/types.ts";

function world(extras: Partial<WorldState> = {}): WorldState {
  return {
    matchId: "move",
    scenarioId: "t",
    tick: 0,
    seed: 1,
    nations: { uk: makeNation("uk"), fr: makeNation("fr") },
    territories: {
      a: { id: "a", name: "A", owner: "uk", controller: "uk", region: "w", supplyValue: 1 },
      b: { id: "b", name: "B", owner: "fr", controller: "fr", region: "w", supplyValue: 1 },
    },
    formations: {
      "uk-1": {
        id: "uk-1",
        nationId: "uk",
        location: "a",
        destination: null,
        strength: 4,
        inTransit: false,
      },
    },
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
      start_month: 1,
      ticks_per_month: 1,
    },
    lastEventSeq: 0,
    ...extras,
  };
}

const seaway: Corridor = {
  id: "canal-stlawrence",
  from: "a",
  to: "b",
  travel_ticks: 2,
  mode: "canal",
  capacity: 1,
  closed_months: [1, 2, 3],
};

describe("corridor movement", () => {
  it("empty graph still teleports in one tick", () => {
    const start = world();
    const result = tick(start, [
      {
        id: "o1",
        nationId: "uk",
        seq: 0,
        kind: "move_formation",
        payload: { formation_id: "uk-1", destination: "b" },
      },
    ], 1);
    expect(result.state.formations["uk-1"]?.location).toBe("b");
    expect(result.state.formations["uk-1"]?.inTransit).toBe(false);
  });

  it("integer path takes travel_ticks and stays deterministic", () => {
    const land: Corridor = {
      id: "road-ab",
      from: "a",
      to: "b",
      travel_ticks: 2,
      mode: "road",
    };
    const start = world({ corridors: { [land.id]: land } });
    const first = tick(start, [
      {
        id: "o1",
        nationId: "uk",
        seq: 0,
        kind: "move_formation",
        payload: { formation_id: "uk-1", destination: "b" },
      },
    ], 7);
    expect(first.state.formations["uk-1"]?.location).toBe("a");
    expect(first.state.formations["uk-1"]?.inTransit).toBe(true);
    expect(first.state.formations["uk-1"]?.ticks_remaining).toBe(1);
    const second = tick(first.state, [], 7);
    expect(second.state.formations["uk-1"]?.location).toBe("b");
    expect(second.events.some((e) => e.type === "formation.arrived")).toBe(true);
  });

  it("Seaway is closed January through March", () => {
    const start = world({ corridors: { [seaway.id]: seaway } });
    expect(monthOf(0, start.tuning)).toBe(1);
    expect(shortestPath(start.corridors!, "a", "b", 1)).toBeNull();
    const winter = tick(start, [
      {
        id: "o1",
        nationId: "uk",
        seq: 0,
        kind: "move_formation",
        payload: { formation_id: "uk-1", destination: "b" },
      },
    ], 1);
    expect(winter.state.formations["uk-1"]?.location).toBe("a");
    expect(winter.events.some((e) => e.type === "order.rejected")).toBe(true);

    const aprilState: WorldState = { ...start, tick: 3 };
    expect(monthOf(3, aprilState.tuning)).toBe(4);
    expect(shortestPath(aprilState.corridors!, "a", "b", 4)).toEqual(["a", "b"]);
    const spring = tick(aprilState, [
      {
        id: "o2",
        nationId: "uk",
        seq: 0,
        kind: "move_formation",
        payload: { formation_id: "uk-1", destination: "b" },
      },
    ], 1);
    expect(spring.state.formations["uk-1"]?.inTransit).toBe(true);
    const arrived = tick(spring.state, [], 1);
    expect(arrived.state.formations["uk-1"]?.location).toBe("b");
  });
});

const _formation: Formation = {
  id: "x",
  nationId: "uk",
  location: "a",
  destination: null,
  strength: 1,
  inTransit: false,
};
void _formation;
