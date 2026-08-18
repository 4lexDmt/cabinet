import type { Formation, Nation, Pact, Territory, WorldState } from "@cabinet/sim";
import { scenarioSchema, type ScenarioConfig } from "./schema.ts";
import sevres from "../sevres-1956.json";
import thirteenDays from "../thirteen-days-1962.json";
import munich from "../munich-1938.json";
import molotov from "../molotov-ribbentrop-1939.json";
import vienna from "../vienna-1815.json";
import july from "../july-crisis-1914.json";
import vietnam from "../vietnam-1964.json";
import afghanistan from "../afghanistan-1979.json";
import korea from "../korea-1950.json";
import theConcept from "../the-concept-1967.json";
import malvinas from "../malvinas-1982.json";
import tankerWar from "../tanker-war-1980.json";
import longTelegram from "../long-telegram-1947.json";
import berlinConference from "../berlin-conference-1884.json";
import fragmentation from "../fragmentation-1991.json";
import grandAlliance from "../grand-alliance-1939.json";

/** Catalog order S-01 … S-16. */
export const CATALOG_FILES = [
  "sevres-1956.json",
  "thirteen-days-1962.json",
  "munich-1938.json",
  "molotov-ribbentrop-1939.json",
  "vienna-1815.json",
  "july-crisis-1914.json",
  "vietnam-1964.json",
  "afghanistan-1979.json",
  "korea-1950.json",
  "the-concept-1967.json",
  "malvinas-1982.json",
  "tanker-war-1980.json",
  "long-telegram-1947.json",
  "berlin-conference-1884.json",
  "fragmentation-1991.json",
  "grand-alliance-1939.json",
] as const;

const FILES: Record<string, unknown> = {
  "sevres-1956.json": sevres,
  "thirteen-days-1962.json": thirteenDays,
  "munich-1938.json": munich,
  "molotov-ribbentrop-1939.json": molotov,
  "vienna-1815.json": vienna,
  "july-crisis-1914.json": july,
  "vietnam-1964.json": vietnam,
  "afghanistan-1979.json": afghanistan,
  "korea-1950.json": korea,
  "the-concept-1967.json": theConcept,
  "malvinas-1982.json": malvinas,
  "tanker-war-1980.json": tankerWar,
  "long-telegram-1947.json": longTelegram,
  "berlin-conference-1884.json": berlinConference,
  "fragmentation-1991.json": fragmentation,
  "grand-alliance-1939.json": grandAlliance,
};

export function readScenarioFile(filename: string): ScenarioConfig {
  const raw = FILES[filename];
  if (!raw) throw new Error(`unknown scenario file ${filename}`);
  return scenarioSchema.parse(raw);
}

export function listScenarios(): ScenarioConfig[] {
  return CATALOG_FILES.map((name) => readScenarioFile(name));
}

export function scenarioById(id: string): ScenarioConfig {
  const normalized = id.replaceAll("-", "_");
  const found = listScenarios().find((s) => s.id === id || s.id === normalized);
  if (!found) throw new Error(`unknown scenario ${id}`);
  return found;
}

export function loadWorld(config: ScenarioConfig, matchId: string, seed: number): WorldState {
  const nations: Record<string, Nation> = {};
  for (const n of config.nations) {
    nations[n.id] = {
      id: n.id,
      name: n.name,
      shortName: n.shortName,
      adjective: n.adjective,
      standing_external: n.standing_external,
      standing_internal: n.standing_internal,
      economy: n.economy,
      intelligence_capacity: n.intelligence_capacity,
      supply: n.supply,
      status: n.status,
      playerId: null,
    };
  }

  const territories: Record<string, Territory> = {};
  for (const t of config.territories) {
    territories[t.id] = { ...t };
  }

  const formations: Record<string, Formation> = {};
  for (const f of config.formations) {
    formations[f.id] = {
      ...f,
      destination: null,
      inTransit: false,
    };
  }

  const pacts: Record<string, Pact> = {};
  for (const p of config.starting_pacts) {
    const privateTerms = p.private_terms ?? p.terms;
    pacts[p.id] = {
      id: p.id,
      parties: [...p.parties].sort(),
      secret: p.secret,
      visible_to: p.secret ? [...p.parties].sort() : [...p.parties].sort(),
      public_terms: p.terms,
      private_terms: privateTerms,
      status: "active",
      broken_by: null,
      broken_tick: null,
      signed_by: [...p.parties].sort(),
      created_tick: 0,
      activated_tick: 0,
    };
  }

  const postures: WorldState["postures"] = {};
  for (const id of Object.keys(nations)) {
    postures[id] = { nationId: id, engagement: "hold", delegation: [] };
  }

  return {
    matchId,
    scenarioId: config.id,
    tick: 0,
    seed,
    nations,
    territories,
    formations,
    pacts,
    beliefs: [],
    wars: [],
    tradeRoutes: config.trade_routes,
    postures,
    flags: { ...config.flags },
    victory: config.victory_conditions,
    tuning: {
      secret_pact_leak_base_chance_mille: Math.round(config.tuning.secret_pact_leak_base_chance * 10_000),
      standing_penalty_on_breach: config.tuning.standing_penalty_on_breach,
      cascade_depth_cap: config.tuning.cascade_depth_cap,
    },
    lastEventSeq: 0,
  };
}

export { scenarioSchema, scenarioGeoSchema, type ScenarioConfig, type ScenarioGeoConfig } from "./schema.ts";
