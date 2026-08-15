import type { TickContext } from "../types.ts";
import { emit, visibilityPublic } from "../context.ts";
import { forceOf } from "../force.ts";

/**
 * Combat does not resolve in a single tick. This phase only opens or continues
 * engagements and records the derived force snapshot. Outcome vectors ship in M3.
 */
export function phaseCombat(ctx: TickContext): void {
  for (const warId of ctx.state.wars.map((w) => w.id).sort()) {
    if (ctx.options.shuffleIteration) {
      // Consume RNG so shuffled iteration diverges even before M3 combat.
      ctx.rng.nextU32();
    }
    const war = ctx.state.wars.find((w) => w.id === warId);
    if (!war) continue;
    const attacker = ctx.state.nations[war.attacker];
    const defender = ctx.state.nations[war.defender];
    if (!attacker || !defender) continue;
    emit(ctx, {
      type: "engagement.continued",
      actor_id: war.attacker,
      subject_ids: [war.attacker, war.defender],
      payload: {
        war_id: war.id,
        attacker_force: forceOf(attacker),
        defender_force: forceOf(defender),
        duration_ticks: ctx.state.tick - war.declared_tick,
      },
      visibility_rule: visibilityPublic(),
      cause_event_id: null,
    });
  }
}
