import { randomUUID } from "node:crypto";
import { eventVisibleTo, tick, type GameEvent, type Order, type WorldState } from "@cabinet/sim";
import { loadEffectRules, loadAdvisorTemplates } from "@cabinet/rules";
import { loadWorld, scenarioById } from "@cabinet/scenarios";
import type { CableMessage, MatchRecord, MatchStore } from "@cabinet/db";

export function privateChannelId(matchId: string, a: string, b: string): string {
  const [x, y] = [a, b].sort();
  return `${matchId}:dm:${x}:${y}`;
}

export function openChannels(matchId: string, nationIds: string[]): MatchRecord["channels"] {
  return [
    {
      id: `${matchId}:public`,
      matchId,
      kind: "public" as const,
      memberNationIds: nationIds,
      title: "Open cable",
    },
  ];
}

/** Open DMs for one seated chair. Pairwise-all at match start is unplayable on large tables. */
export function ensurePrivateChannels(match: MatchRecord, nationId: string): boolean {
  if (!match.world.nations[nationId]) return false;
  const existing = new Set(match.channels.map((channel) => channel.id));
  let added = false;
  for (const other of Object.keys(match.world.nations)) {
    if (other === nationId) continue;
    const id = privateChannelId(match.id, nationId, other);
    if (existing.has(id)) continue;
    match.channels.push({
      id,
      matchId: match.id,
      kind: "dm",
      memberNationIds: [nationId, other].sort(),
      title: `Private — ${nationId} / ${other}`,
    });
    existing.add(id);
    added = true;
  }
  return added;
}

export async function createMatch(
  store: MatchStore,
  scenarioId: string,
  seed: number,
): Promise<MatchRecord> {
  const config = scenarioById(scenarioId);
  const id = randomUUID();
  const world = loadWorld(config, id, seed);
  const nationIds = Object.keys(world.nations).sort();
  const record: MatchRecord = {
    id,
    scenarioId: config.id,
    seed,
    status: "active",
    world,
    events: [
      {
        id: "EVT-0000-0001",
        tick: 0,
        type: "match.opened",
        actor_id: null,
        subject_ids: nationIds,
        payload: { scenario: config.display_name },
        visibility_rule: { kind: "public" },
        cause_event_id: null,
      },
    ],
    orders: [],
    channels: openChannels(id, nationIds),
    messages: [],
    lastSeenTick: Object.fromEntries(nationIds.map((n) => [n, 0])),
  };
  world.lastEventSeq = 1;
  return store.createMatch(record);
}

export async function enqueueOrder(store: MatchStore, matchId: string, order: Order): Promise<void> {
  await store.enqueueOrder(matchId, order);
}

/**
 * Claim pending orders, run one pure tick, persist in a single logical unit.
 * Simulation stays in @cabinet/sim; this is the I/O edge.
 */
export async function advanceMatch(
  store: MatchStore,
  matchId: string,
  workerId: string,
): Promise<{ durationMs: number; events: GameEvent[]; tick: number }> {
  const started = performance.now();
  const match = await store.getMatch(matchId);
  if (!match) throw new Error(`unknown match ${matchId}`);
  const claimed = await store.claimOrders(matchId, workerId);
  const rules = loadEffectRules();
  const advisors = loadAdvisorTemplates();
  const result = tick(match.world, claimed, match.seed, {
    assertEvents: true,
    effectRules: rules,
    advisorTemplates: advisors,
  });
  match.world = result.state;
  match.events.push(...result.events);
  const claimedIds = new Set(claimed.map((o) => o.id));
  for (const order of match.orders) {
    if (claimedIds.has(order.id)) order.consumed = true;
  }
  await store.appendEvents(matchId, result.events);
  await store.markConsumed(
    matchId,
    claimed.map((o) => o.id),
  );
  const fresh = (await store.getMatch(matchId)) ?? match;
  fresh.world = result.state;
  const seen = new Set(fresh.events.map((e) => e.id));
  for (const event of result.events) {
    if (!seen.has(event.id)) fresh.events.push(event);
  }
  for (const order of fresh.orders) {
    if (claimedIds.has(order.id)) order.consumed = true;
  }
  await store.saveMatch(fresh);
  return {
    durationMs: Math.round(performance.now() - started),
    events: result.events,
    tick: result.state.tick,
  };
}

export function visibleEvents(events: GameEvent[], nationId: string): GameEvent[] {
  return events.filter((e) => eventVisibleTo(e, nationId));
}

export function standingLedger(events: GameEvent[], nationId: string) {
  const rows = events.filter(
    (e) =>
      (e.type === "standing.changed" || e.type === "stat.changed") &&
      e.payload.nation_id === nationId &&
      (e.payload.field === "standing_external" || e.payload.field === "standing_internal"),
  );
  return [...rows].reverse();
}

export function causalChain(events: GameEvent[], eventId: string): GameEvent[] {
  const byId = new Map(events.map((e) => [e.id, e]));
  const chain: GameEvent[] = [];
  let current = byId.get(eventId);
  while (current) {
    chain.push(current);
    if (!current.cause_event_id) break;
    current = byId.get(current.cause_event_id);
  }
  return chain;
}

export function nationNames(world: WorldState): Record<string, string> {
  return Object.fromEntries(Object.values(world.nations).map((n) => [n.id, n.name]));
}

export async function postCable(
  store: MatchStore,
  matchId: string,
  authorNationId: string,
  channelId: string,
  body: string,
  quoteOf: string | null,
): Promise<CableMessage> {
  const match = await store.getMatch(matchId);
  if (!match) throw new Error("unknown match");
  const channel = match.channels.find((c) => c.id === channelId);
  if (!channel || !channel.memberNationIds.includes(authorNationId)) {
    throw new Error("channel not open to this nation");
  }
  const message: CableMessage = {
    id: randomUUID(),
    channelId,
    matchId,
    authorNationId,
    body,
    quoteOf,
    createdTick: match.world.tick,
  };
  await store.addMessage(message);
  return message;
}

export function briefingSince(events: GameEvent[], nationId: string, lastSeenTick: number) {
  const visible = visibleEvents(events, nationId).filter(
    (e) => e.tick > lastSeenTick && e.type === "briefing.compiled" && e.actor_id === nationId,
  );
  return visible.at(-1) ?? null;
}
