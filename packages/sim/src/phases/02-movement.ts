import type { TickContext } from "../types.ts";
import { putFormation, sortedIds, visibilityNations } from "../context.ts";

/** Formations with a destination advance one tick, or arrive if none remain. */
export function phaseMovement(ctx: TickContext): void {
  for (const id of sortedIds(ctx.state.formations, ctx)) {
    const formation = ctx.state.formations[id];
    if (!formation?.destination || formation.destination === formation.location) continue;
    const dest = ctx.state.territories[formation.destination];
    if (!dest) continue;
    const graph = ctx.state.corridors;
    if (graph.length === 0) {
      putFormation(
        ctx,
        {
          ...formation,
          location: formation.destination,
          destination: null,
          inTransit: false,
          ticks_remaining: 0,
        },
        {
          type: "formation.arrived",
          actor_id: formation.nationId,
          subject_ids: [formation.id, dest.id],
          payload: {
            formation_id: formation.id,
            territory_id: dest.id,
            previous: formation.location,
          },
          visibility_rule: visibilityNations([formation.nationId, dest.controller]),
          cause_event_id: null,
        },
      );
      continue;
    }

    const remaining = formation.ticks_remaining;
    if (remaining > 1) {
      const next = remaining - 1;
      putFormation(
        ctx,
        { ...formation, ticks_remaining: next, inTransit: true },
        {
          type: "formation.in_transit",
          actor_id: formation.nationId,
          subject_ids: [formation.id, dest.id],
          payload: {
            formation_id: formation.id,
            from: formation.location,
            to: dest.id,
            ticks_remaining: next,
          },
          visibility_rule: visibilityNations([formation.nationId, dest.controller]),
          cause_event_id: null,
        },
      );
      continue;
    }

    putFormation(
      ctx,
      {
        ...formation,
        location: formation.destination,
        destination: null,
        inTransit: false,
        ticks_remaining: 0,
      },
      {
        type: "formation.arrived",
        actor_id: formation.nationId,
        subject_ids: [formation.id, dest.id],
        payload: {
          formation_id: formation.id,
          territory_id: dest.id,
          previous: formation.location,
        },
        visibility_rule: visibilityNations([formation.nationId, dest.controller]),
        cause_event_id: null,
      },
    );
  }
}
