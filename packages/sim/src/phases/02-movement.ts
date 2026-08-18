import type { TickContext } from "../types.ts";
import { putFormation, sortedIds, visibilityNations } from "../context.ts";

/** Formations with a destination arrive this tick. Combat is not resolved here. */
export function phaseMovement(ctx: TickContext): void {
  for (const id of sortedIds(ctx.state.formations, ctx)) {
    const formation = ctx.state.formations[id];
    if (!formation?.destination || formation.destination === formation.location) continue;
    const dest = ctx.state.territories[formation.destination];
    if (!dest) continue;
    putFormation(
      ctx,
      {
        ...formation,
        location: formation.destination,
        destination: null,
        inTransit: false,
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
