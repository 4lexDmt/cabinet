import { createHash } from "node:crypto";
import { createRng } from "../src/rng.ts";
import { tick } from "../src/tick.ts";
import { stableStringify } from "../src/serialize.ts";
import type { EffectRule, Formation, Nation, Order, OrderKind, Pact, Territory, WorldState } from "../src/types.ts";

export const STANDING_RULES: EffectRule[] = [
  {
    id: "pact_breach_external_standing",
    trigger: "pact.breached",
    effects: [{ target: { nation: "event.actor_id", field: "standing_external" }, delta: -25 }],
    emits: ["standing.changed"],
  },
];

export function hashState(state: WorldState): string {
  return createHash("sha256").update(stableStringify(state)).digest("hex");
}

export function makeNation(id: string, extras: Partial<Nation> = {}): Nation {
  return {
    id,
    name: id.toUpperCase(),
    shortName: id,
    adjective: id,
    standing_external: 50,
    standing_internal: 50,
    economy: 50,
    intelligence_capacity: 50,
    supply: 50,
    status: "sovereign",
    playerId: null,
    ...extras,
  };
}

export function emptyWorld(nationCount: number, seed: number): WorldState {
  const nations: Record<string, Nation> = {};
  const territories: Record<string, Territory> = {};
  const formations: Record<string, Formation> = {};
  const postures: WorldState["postures"] = {};
  for (let i = 0; i < nationCount; i++) {
    const id = `n${String(i).padStart(2, "0")}`;
    nations[id] = makeNation(id);
    const tid = `t-${id}`;
    territories[tid] = {
      id: tid,
      name: tid,
      owner: id,
      controller: id,
      region: "test",
      supplyValue: 5,
    };
    formations[`f-${id}`] = {
      id: `f-${id}`,
      nationId: id,
      location: tid,
      destination: null,
      strength: 5,
      inTransit: false,
      ticks_remaining: 0,
    };
    postures[id] = { nationId: id, engagement: "hold", delegation: [] };
  }

  const pacts: Record<string, Pact> = {};
  const ids = Object.keys(nations).sort();
  for (let i = 0; i < ids.length - 1; i += 2) {
    const a = ids[i]!;
    const b = ids[i + 1]!;
    const id = `pact-${a}-${b}`;
    pacts[id] = {
      id,
      parties: [a, b],
      secret: true,
      visible_to: [a, b],
      public_terms: {
        title: `Understanding ${a}-${b}`,
        type: "non_aggression",
        secret: true,
        obligations: [
          { id: `${id}-a`, party: a, must: "not_declare_war_on", target: b },
          { id: `${id}-b`, party: b, must: "not_declare_war_on", target: a },
        ],
      },
      private_terms: {
        title: `Understanding ${a}-${b}`,
        type: "non_aggression",
        secret: true,
        obligations: [
          { id: `${id}-a`, party: a, must: "not_declare_war_on", target: b },
          { id: `${id}-b`, party: b, must: "not_declare_war_on", target: a },
        ],
      },
      status: "active",
      broken_by: null,
      broken_tick: null,
      signed_by: [a, b],
      created_tick: 0,
      activated_tick: 0,
    };
  }

  return {
    matchId: "det-test",
    scenarioId: "synthetic",
    tick: 0,
    seed,
    nations,
    territories,
    formations,
    pacts,
    beliefs: [],
    wars: [],
    tradeRoutes: [],
    corridors: [],
    postures,
    flags: {},
    victory: {},
    tuning: {
      secret_pact_leak_base_chance_mille: 4000,
      standing_penalty_on_breach: 25,
      cascade_depth_cap: 3,
    },
    lastEventSeq: 0,
  };
}

const KINDS: OrderKind[] = [
  "set_posture",
  "economic_pressure",
  "move_formation",
  "declare_war",
  "pay_tribute",
];

export function generateOrders(count: number, nationCount: number, seed: number): Order[] {
  const rng = createRng(seed ^ 0x51ed);
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const nationId = `n${String(rng.int(nationCount)).padStart(2, "0")}`;
    const other = `n${String(rng.int(nationCount)).padStart(2, "0")}`;
    const kind = KINDS[rng.int(KINDS.length)]!;
    const payload: Record<string, unknown> = {};
    if (kind === "set_posture") payload.engagement = rng.chanceMille(5000) ? "hold" : "defend";
    if (kind === "economic_pressure") {
      payload.target = other;
      payload.intensity = 1 + rng.int(3);
    }
    if (kind === "move_formation") {
      payload.formation_id = `f-${nationId}`;
      payload.destination = `t-${other}`;
    }
    if (kind === "declare_war") payload.target = other === nationId ? `n${String((rng.int(nationCount - 1) + 1) % nationCount).padStart(2, "0")}` : other;
    if (kind === "pay_tribute") {
      payload.target = other;
      payload.amount = 1 + rng.int(3);
    }
    orders.push({
      id: `ord-${String(i).padStart(4, "0")}`,
      nationId,
      seq: i,
      kind,
      payload,
    });
  }
  return orders;
}

export function runSequence(
  seed: number,
  ticks: number,
  nationCount: number,
  shuffleIteration = false,
): { hash: string; state: WorldState } {
  let state = emptyWorld(nationCount, seed);
  const orders = generateOrders(ticks, nationCount, seed);
  for (let i = 0; i < ticks; i++) {
    const slice = orders.slice(i, i + 1);
    const result = tick(state, slice, seed, {
      assertEvents: true,
      shuffleIteration,
      effectRules: STANDING_RULES,
    });
    state = result.state;
  }
  return { hash: hashState(state), state };
}
