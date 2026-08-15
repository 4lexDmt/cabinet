import type {
  Belief,
  Formation,
  GameEvent,
  Nation,
  NationNumericField,
  Order,
  Pact,
  TickContext,
  TickOptions,
  VisibilityRule,
  War,
  WorldState,
} from "./types.ts";
import { cloneState } from "./serialize.ts";
import { createRng, mixSeed } from "./rng.ts";

export function createContext(
  state: WorldState,
  orders: Order[],
  seed: number,
  options: TickOptions,
): TickContext {
  const copy = cloneState(state);
  const rng = createRng(mixSeed(seed, copy.tick));
  return {
    state: copy,
    orders: sortOrders(orders),
    rng,
    events: [],
    warnings: [],
    options,
    mutationCount: 0,
    baseline: cloneState(state),
  };
}

function sortOrders(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    if (a.nationId !== b.nationId) return a.nationId < b.nationId ? -1 : 1;
    if (a.seq !== b.seq) return a.seq - b.seq;
    return a.id < b.id ? -1 : 1;
  });
}

export function nextEventId(ctx: TickContext): string {
  ctx.state.lastEventSeq += 1;
  const seq = String(ctx.state.lastEventSeq).padStart(4, "0");
  const tick = String(ctx.state.tick).padStart(4, "0");
  return `EVT-${tick}-${seq}`;
}

export function emit(
  ctx: TickContext,
  partial: Omit<GameEvent, "id" | "tick"> & { id?: string },
): GameEvent {
  const event: GameEvent = {
    id: partial.id ?? nextEventId(ctx),
    tick: ctx.state.tick,
    type: partial.type,
    actor_id: partial.actor_id,
    subject_ids: [...partial.subject_ids].sort(),
    payload: partial.payload,
    visibility_rule: partial.visibility_rule,
    cause_event_id: partial.cause_event_id,
  };
  ctx.events.push(event);
  return event;
}

export function visibilityPublic(): VisibilityRule {
  return { kind: "public" };
}

export function visibilityNations(ids: string[]): VisibilityRule {
  return { kind: "nations", nation_ids: [...new Set(ids)].sort() };
}

export function eventVisibleTo(event: GameEvent, nationId: string): boolean {
  if (event.visibility_rule.kind === "public") return true;
  return event.visibility_rule.nation_ids.includes(nationId);
}

export function sortedIds(record: Record<string, unknown>, ctx: TickContext): string[] {
  const ids = Object.keys(record).sort();
  if (ctx.options.shuffleIteration) {
    return ctx.rng.shuffleInPlace([...ids]);
  }
  return ids;
}

export function sortedList<T>(items: T[], key: (item: T) => string, ctx: TickContext): T[] {
  const copy = [...items].sort((a, b) => {
    const ka = key(a);
    const kb = key(b);
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
  if (ctx.options.shuffleIteration) {
    return ctx.rng.shuffleInPlace(copy);
  }
  return copy;
}

export function requireNation(ctx: TickContext, id: string): Nation {
  const nation = ctx.state.nations[id];
  if (!nation) throw new Error(`unknown nation ${id}`);
  return nation;
}

export function requirePact(ctx: TickContext, id: string): Pact {
  const pact = ctx.state.pacts[id];
  if (!pact) throw new Error(`unknown pact ${id}`);
  return pact;
}

export function adjustNation(
  ctx: TickContext,
  nationId: string,
  field: NationNumericField,
  delta: number,
  event: Omit<GameEvent, "id" | "tick">,
): GameEvent {
  const nation = requireNation(ctx, nationId);
  const before = nation[field];
  nation[field] = before + delta;
  ctx.mutationCount += 1;
  const emitted = emit(ctx, {
    ...event,
    payload: {
      ...event.payload,
      nation_id: nationId,
      field,
      delta,
      before,
      after: nation[field],
    },
  });
  return emitted;
}

export function mutatePact(
  ctx: TickContext,
  pactId: string,
  patch: Partial<Pact>,
  event: Omit<GameEvent, "id" | "tick">,
): GameEvent {
  const pact = requirePact(ctx, pactId);
  Object.assign(pact, patch);
  ctx.mutationCount += 1;
  return emit(ctx, event);
}

export function putPact(ctx: TickContext, pact: Pact, event: Omit<GameEvent, "id" | "tick">): GameEvent {
  ctx.state.pacts[pact.id] = pact;
  ctx.mutationCount += 1;
  return emit(ctx, event);
}

export function putFormation(
  ctx: TickContext,
  formation: Formation,
  event: Omit<GameEvent, "id" | "tick">,
): GameEvent {
  ctx.state.formations[formation.id] = formation;
  ctx.mutationCount += 1;
  return emit(ctx, event);
}

export function putWar(ctx: TickContext, war: War, event: Omit<GameEvent, "id" | "tick">): GameEvent {
  ctx.state.wars.push(war);
  ctx.state.wars.sort((a, b) => (a.id < b.id ? -1 : 1));
  ctx.mutationCount += 1;
  return emit(ctx, event);
}

export function putBelief(ctx: TickContext, belief: Belief, event: Omit<GameEvent, "id" | "tick">): GameEvent {
  const existing = ctx.state.beliefs.findIndex(
    (b) =>
      b.observer_nation_id === belief.observer_nation_id &&
      b.subject_type === belief.subject_type &&
      b.subject_id === belief.subject_id &&
      b.field === belief.field,
  );
  if (existing >= 0) {
    ctx.state.beliefs[existing] = belief;
  } else {
    ctx.state.beliefs.push(belief);
  }
  ctx.state.beliefs.sort((a, b) => {
    const ka = `${a.observer_nation_id}:${a.subject_type}:${a.subject_id}:${a.field}`;
    const kb = `${b.observer_nation_id}:${b.subject_type}:${b.subject_id}:${b.field}`;
    return ka < kb ? -1 : 1;
  });
  ctx.mutationCount += 1;
  return emit(ctx, event);
}

export function setFlag(
  ctx: TickContext,
  key: string,
  value: number | string | boolean,
  event: Omit<GameEvent, "id" | "tick">,
): GameEvent {
  ctx.state.flags[key] = value;
  ctx.mutationCount += 1;
  return emit(ctx, event);
}

export function setTerritoryController(
  ctx: TickContext,
  territoryId: string,
  controller: string,
  event: Omit<GameEvent, "id" | "tick">,
): GameEvent {
  const territory = ctx.state.territories[territoryId];
  if (!territory) throw new Error(`unknown territory ${territoryId}`);
  territory.controller = controller;
  ctx.mutationCount += 1;
  return emit(ctx, event);
}
