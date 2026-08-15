import type { TickContext } from "../types.ts";
import { emit, eventVisibleTo, visibilityNations } from "../context.ts";
import { renderBriefing } from "../briefing/render.ts";
import { beliefsOf } from "./06-intel.ts";

/**
 * Compiles a briefing projection per nation from BELIEF + VISIBLE EVENTS only.
 * Does not read nation stats, formations, pacts, or other world truth.
 */
export function phaseBriefings(ctx: TickContext): void {
  const nationIds = observerIds(ctx);
  for (const nationId of nationIds) {
    if (ctx.options.shuffleIteration) {
      ctx.rng.nextU32();
    }
    const beliefs = beliefsOf(ctx.state.beliefs, nationId);
    const events = ctx.events.filter((event) => eventVisibleTo(event, nationId));
    const briefing = renderBriefing({
      nationId,
      tick: ctx.state.tick,
      beliefs,
      events,
      templates: ctx.options.advisorTemplates ?? [],
    });
    emit(ctx, {
      type: "briefing.compiled",
      actor_id: nationId,
      subject_ids: [nationId],
      payload: { ...briefing },
      visibility_rule: visibilityNations([nationId]),
      cause_event_id: null,
    });
  }
}

function observerIds(ctx: TickContext): string[] {
  const ids = new Set<string>();
  for (const belief of ctx.state.beliefs) ids.add(belief.observer_nation_id);
  for (const event of ctx.events) {
    if (event.actor_id) ids.add(event.actor_id);
    if (event.visibility_rule.kind === "nations") {
      for (const id of event.visibility_rule.nation_ids) ids.add(id);
    }
  }
  const list = [...ids].sort();
  if (ctx.options.shuffleIteration) return ctx.rng.shuffleInPlace(list);
  return list;
}
