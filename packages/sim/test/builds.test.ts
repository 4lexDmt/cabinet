import { describe, expect, it } from "vitest";
import { tick } from "../src/tick.ts";
import { forceOf } from "../src/force.ts";
import { makeNation } from "./sequence.ts";
import { loadBuildingFile } from "../../rules/src/index.ts";
import type { BuildingDef, WorldState } from "../src/types.ts";

const file = loadBuildingFile();
const catalog = file.buildings as BuildingDef[];
const caps = {
  1: file.city_economy_cap["1"],
  2: file.city_economy_cap["2"],
  3: file.city_economy_cap["3"],
};

function world(extras: Partial<WorldState> = {}): WorldState {
  return {
    matchId: "build",
    scenarioId: "t",
    tick: 0,
    seed: 1,
    nations: {
      sau: makeNation("sau", { economy: 10, supply: 10 }),
      rus: makeNation("rus", { economy: 10, supply: 10 }),
    },
    territories: {
      "sa-riy": {
        id: "sa-riy",
        name: "Riyadh",
        owner: "sau",
        controller: "sau",
        region: "arabia",
        supplyValue: 2,
      },
      "ru-vol": {
        id: "ru-vol",
        name: "Volgograd",
        owner: "rus",
        controller: "rus",
        region: "volga",
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
      "city:SAU:Riyadh": {
        id: "city:SAU:Riyadh",
        kind: "city",
        nationId: "sau",
        slots: 8,
        occupied: 0,
        tier: 3,
        water_ids: [],
        coastal: false,
        economy: 0,
      },
      "city:SAU:Jeddah": {
        id: "city:SAU:Jeddah",
        kind: "city",
        nationId: "sau",
        slots: 5,
        occupied: 0,
        tier: 2,
        water_ids: [],
        coastal: true,
        economy: 0,
      },
      "ru-vol": {
        id: "ru-vol",
        kind: "province",
        nationId: "rus",
        slots: 2,
        occupied: 0,
        water_ids: ["rv-volga"],
        coastal: false,
      },
    },
    corridors: {
      "road-vol": {
        id: "road-vol",
        from: "ru-vol",
        to: "sa-riy",
        travel_ticks: 4,
        mode: "road",
      },
    },
    ...extras,
  };
}

describe("build sites", () => {
  it("city economic output is capped by tier after bonuses", () => {
    const start = world();
    let state = start;
    for (let i = 0; i < 8; i++) {
      const result = tick(
        state,
        [
          {
            id: `b${i}`,
            nationId: "sau",
            seq: 0,
            kind: "construct",
            payload: { site_id: "city:SAU:Riyadh", building: "industry" },
          },
        ],
        1,
        { buildingCatalog: catalog, cityEconomyCap: caps },
      );
      state = result.state;
    }
    expect(state.sites?.["city:SAU:Riyadh"]?.economy).toBe(caps[3]);
    expect(state.nations.sau?.economy).toBe(10 + caps[3]);
    expect(state.sites?.["city:SAU:Riyadh"]?.occupied).toBe(8);
    const extra = tick(
      state,
      [
        {
          id: "overflow",
          nationId: "sau",
          seq: 0,
          kind: "construct",
          payload: { site_id: "city:SAU:Riyadh", building: "industry" },
        },
      ],
      1,
      { buildingCatalog: catalog, cityEconomyCap: caps },
    );
    expect(extra.events.some((e) => e.type === "order.rejected")).toBe(true);
  });

  it("hydro requires adjacent water; desalination requires coast", () => {
    const dry = tick(
      world(),
      [
        {
          id: "h",
          nationId: "sau",
          seq: 0,
          kind: "construct",
          payload: { site_id: "city:SAU:Riyadh", building: "hydro" },
        },
      ],
      1,
      { buildingCatalog: catalog, cityEconomyCap: caps },
    );
    expect(dry.events.some((e) => e.payload.reason === "hydro_requires_water")).toBe(true);

    const inlandDesal = tick(
      world(),
      [
        {
          id: "d",
          nationId: "sau",
          seq: 0,
          kind: "construct",
          payload: { site_id: "city:SAU:Riyadh", building: "desalination" },
        },
      ],
      1,
      { buildingCatalog: catalog, cityEconomyCap: caps },
    );
    expect(inlandDesal.events.some((e) => e.payload.reason === "desalination_requires_coast")).toBe(true);

    const coast = tick(
      world(),
      [
        {
          id: "ok",
          nationId: "sau",
          seq: 0,
          kind: "construct",
          payload: { site_id: "city:SAU:Jeddah", building: "desalination" },
        },
      ],
      1,
      { buildingCatalog: catalog, cityEconomyCap: caps },
    );
    expect(coast.events.some((e) => e.type === "site.constructed")).toBe(true);

    const hydro = tick(
      world(),
      [
        {
          id: "volga",
          nationId: "rus",
          seq: 0,
          kind: "construct",
          payload: { site_id: "ru-vol", building: "hydro" },
        },
      ],
      1,
      { buildingCatalog: catalog, cityEconomyCap: caps },
    );
    expect(hydro.events.some((e) => e.type === "site.constructed")).toBe(true);
    expect(hydro.state.nations.rus?.economy).toBe(18);
  });

  it("Force is never built, only derived", () => {
    expect(catalog.some((b) => b.id === "force")).toBe(false);
    const start = world();
    const before = forceOf(start.nations.rus!);
    const result = tick(
      start,
      [
        {
          id: "f",
          nationId: "rus",
          seq: 0,
          kind: "construct",
          payload: { site_id: "ru-vol", building: "force" },
        },
      ],
      1,
      { buildingCatalog: catalog, cityEconomyCap: caps },
    );
    expect(result.events.some((e) => e.payload.reason === "force_is_derived")).toBe(true);
    expect(forceOf(result.state.nations.rus!)).toBe(before);
  });

  it("logistics buildings cheapen integer corridors", () => {
    const result = tick(
      world(),
      [
        {
          id: "hub",
          nationId: "rus",
          seq: 0,
          kind: "construct",
          payload: { site_id: "ru-vol", building: "supply_hub" },
        },
      ],
      1,
      { buildingCatalog: catalog, cityEconomyCap: caps },
    );
    expect(result.state.corridors?.["road-vol"]?.travel_ticks).toBe(3);
    expect(result.events.some((e) => e.type === "corridor.improved")).toBe(true);
  });
});
