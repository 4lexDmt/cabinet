import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadWorld, scenarioSchema } from "../../scenarios/src/index.ts";
import { hashState } from "./sequence.ts";
import { shortestCorridorPath } from "../src/corridor.ts";
import { tick } from "../src/tick.ts";
import type { Corridor, Order } from "../src/types.ts";

const fixture = scenarioSchema.parse(
  JSON.parse(
    readFileSync(join(dirname(fileURLToPath(import.meta.url)), "fixtures", "ee-black-sea-2026.json"), "utf8"),
  ),
);

function moveOrder(): Order {
  return {
    id: "m1",
    nationId: "pol",
    seq: 0,
    kind: "move_formation",
    payload: { formation_id: "pol-1", destination: "ukr-lvivoblast" },
  };
}

function runTicks(seed: number, orders: Order[], n: number) {
  let state = loadWorld(fixture, "slice", seed);
  const events = [];
  for (let i = 0; i < n; i++) {
    const result = tick(state, i === 0 ? orders : [], seed, { assertEvents: true });
    state = result.state;
    events.push(...result.events);
  }
  return { state, events };
}

describe("integer corridor graph", () => {
  it("tie-breaks equal costs by corridor id", () => {
    const corridors: Corridor[] = [
      { id: "rail:a:c", a: "a", b: "c", travel_ticks: 5, kind: "rail" },
      { id: "land:a:c", a: "a", b: "c", travel_ticks: 5, kind: "land" },
    ];
    const path = shortestCorridorPath(corridors, "a", "c");
    expect(path?.cost).toBe(5);
    expect(path?.steps).toEqual(["land:a:c"]);
  });

  it("routes through a chokepoint that is not a territory", () => {
    const path = shortestCorridorPath(fixture.corridors, "ukr-odessaoblast", "tur-istanbul");
    expect(path?.cost).toBe(4);
    expect(path?.steps.some((id) => id.includes("bosphorus"))).toBe(true);
  });

  it("returns null when no path exists", () => {
    expect(shortestCorridorPath(fixture.corridors, "pol-subcarpathianvoivodeship", "pol-masovianvoivodeship")).toBeNull();
  });
});

describe("multi-tick movement", () => {
  it("does not arrive until remaining ticks reach zero", () => {
    const afterOne = runTicks(7, [moveOrder()], 1);
    const moving = afterOne.state.formations["pol-1"]!;
    expect(moving.location).toBe("pol-subcarpathianvoivodeship");
    expect(moving.destination).toBe("ukr-lvivoblast");
    expect(moving.inTransit).toBe(true);
    expect(moving.ticks_remaining).toBe(3);
    expect(afterOne.events.some((e) => e.type === "formation.in_transit")).toBe(true);

    const afterThree = runTicks(7, [moveOrder()], 3);
    expect(afterThree.state.formations["pol-1"]!.location).toBe("pol-subcarpathianvoivodeship");
    expect(afterThree.state.formations["pol-1"]!.ticks_remaining).toBe(1);

    const arrived = runTicks(7, [moveOrder()], 4);
    expect(arrived.state.formations["pol-1"]!.location).toBe("ukr-lvivoblast");
    expect(arrived.state.formations["pol-1"]!.destination).toBeNull();
    expect(arrived.state.formations["pol-1"]!.ticks_remaining).toBe(0);
    expect(arrived.events.some((e) => e.type === "formation.arrived")).toBe(true);
  });

  it("rejects a teleport off the graph", () => {
    const { state, events } = runTicks(7, [
      {
        id: "bad",
        nationId: "pol",
        seq: 0,
        kind: "move_formation",
        payload: { formation_id: "pol-1", destination: "pol-masovianvoivodeship" },
      },
    ], 1);
    expect(state.formations["pol-1"]!.location).toBe("pol-subcarpathianvoivodeship");
    expect(state.formations["pol-1"]!.destination).toBeNull();
    expect(events.some((e) => e.type === "formation.arrived")).toBe(false);
  });

  it("same seed and orders hash identically with multi-tick transit", () => {
    const a = runTicks(99, [moveOrder()], 6);
    const b = runTicks(99, [moveOrder()], 6);
    expect(hashState(a.state)).toBe(hashState(b.state));
  });

  it("still teleports in one tick when a scenario has no corridors", () => {
    const empty = scenarioSchema.parse({ ...fixture, corridors: [] });
    const state = loadWorld(empty, "teleport", 1);
    const result = tick(
      state,
      [moveOrder()],
      1,
      { assertEvents: true },
    );
    expect(result.state.formations["pol-1"]!.location).toBe("ukr-lvivoblast");
    expect(result.state.formations["pol-1"]!.ticks_remaining).toBe(0);
  });
});
