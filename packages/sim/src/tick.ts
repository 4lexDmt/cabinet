import type { Order, TickOptions, TickResult, WorldState } from "./types.ts";
import { createContext, emit, visibilityPublic } from "./context.ts";
import { assertNoSilentMutations } from "./assert-events.ts";
import { evaluateVictory, type VictoryNode } from "./victory.ts";
import { phaseOrders } from "./phases/01-orders.ts";
import { phaseMovement } from "./phases/02-movement.ts";
import { phaseCombat } from "./phases/03-combat.ts";
import { phasePacts } from "./phases/04-pacts.ts";
import { phaseEffects } from "./phases/05-effects.ts";
import { phaseIntel } from "./phases/06-intel.ts";
import { phaseBriefings } from "./phases/07-briefings.ts";

export const PHASES = [
  phaseOrders,
  phaseMovement,
  phaseCombat,
  phasePacts,
  phaseEffects,
  phaseIntel,
  phaseBriefings,
] as const;

/**
 * Pure simulation step.
 * Same seed + same orders + same state => byte-identical result.
 */
export function tick(
  state: WorldState,
  orders: Order[],
  seed: number,
  options: TickOptions = {},
): TickResult {
  const ctx = createContext(state, orders, seed, options);

  for (const phase of PHASES) {
    phase(ctx);
  }

  evaluateVictories(ctx);

  emit(ctx, {
    type: "tick.resolved",
    actor_id: null,
    subject_ids: [],
    payload: { tick: ctx.state.tick, order_count: ctx.orders.length },
    visibility_rule: visibilityPublic(),
    cause_event_id: null,
  });
  ctx.state.tick += 1;
  ctx.mutationCount += 1;

  if (options.assertEvents ?? true) {
    assertNoSilentMutations(ctx);
  }

  return {
    state: ctx.state,
    events: ctx.events,
    warnings: ctx.warnings,
  };
}

function evaluateVictories(ctx: ReturnType<typeof createContext>): void {
  for (const nationId of Object.keys(ctx.state.victory).sort()) {
    const node = ctx.state.victory[nationId] as VictoryNode | undefined;
    if (!node) continue;
    const won = evaluateVictory(ctx.state, nationId, node);
    const flag = `victory:${nationId}`;
    if (won && ctx.state.flags[flag] !== true) {
      ctx.state.flags[flag] = true;
      ctx.mutationCount += 1;
      emit(ctx, {
        type: "victory.achieved",
        actor_id: nationId,
        subject_ids: [nationId],
        payload: { nation_id: nationId },
        visibility_rule: visibilityPublic(),
        cause_event_id: null,
      });
    }
  }
}
