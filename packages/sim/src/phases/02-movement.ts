import type { TickContext } from "../types.ts";
import { putFormation, sortedIds, visibilityNations } from "../context.ts";
import { graphHasCorridors, monthOf, shortestPath, travelTicksBetween } from "../corridor.ts";

/** Formations with a destination arrive this tick, or hop one corridor. Combat is not resolved here. */
export function phaseMovement(ctx: TickContext): void {
  const corridors = ctx.state.corridors;
  const routed = graphHasCorridors(corridors);
  const month = monthOf(ctx.state.tick, ctx.state.tuning);

  for (const id of sortedIds(ctx.state.formations, ctx)) {
    const formation = ctx.state.formations[id];
    if (!formation?.destination || formation.destination === formation.location) continue;

    if (!routed || !corridors) {
      arrive(ctx, formation.id, formation.destination, formation.location);
      continue;
    }

    let path = formation.path;
    if (!path || path.length === 0) {
      path = shortestPath(corridors, formation.location, formation.destination, month)?.slice(1) ?? [];
    }
    const next = path[0];
    if (!next) {
      ctx.warnings.push(`no corridor from ${formation.location} to ${formation.destination}`);
      continue;
    }

    const remaining = formation.ticks_remaining ?? travelTicksBetween(corridors, formation.location, next, month) ?? 1;
    if (remaining > 1) {
      putFormation(
        ctx,
        { ...formation, path, ticks_remaining: remaining - 1, inTransit: true },
        {
          type: "formation.en_route",
          actor_id: formation.nationId,
          subject_ids: [formation.id, formation.destination],
          payload: {
            formation_id: formation.id,
            from: formation.location,
            to: formation.destination,
            ticks_remaining: remaining - 1,
          },
          visibility_rule: visibilityNations([formation.nationId]),
          cause_event_id: null,
        },
      );
      continue;
    }

    const rest = path.slice(1);
    if (rest.length === 0 || next === formation.destination) {
      arrive(ctx, formation.id, formation.destination, formation.location);
      continue;
    }

    const hopTicks = travelTicksBetween(corridors, next, rest[0]!, month) ?? 1;
    putFormation(
      ctx,
      {
        ...formation,
        location: next,
        path: rest,
        ticks_remaining: hopTicks,
        inTransit: true,
      },
      {
        type: "formation.waypoint",
        actor_id: formation.nationId,
        subject_ids: [formation.id, next],
        payload: { formation_id: formation.id, waypoint: next },
        visibility_rule: visibilityNations([formation.nationId]),
        cause_event_id: null,
      },
    );
  }
}

function arrive(ctx: TickContext, formationId: string, dest: string, previous: string): void {
  const formation = ctx.state.formations[formationId];
  if (!formation) return;
  const territory = ctx.state.territories[dest];
  if (!territory) return;
  putFormation(
    ctx,
    {
      ...formation,
      location: dest,
      destination: null,
      inTransit: false,
      ticks_remaining: undefined,
      path: undefined,
    },
    {
      type: "formation.arrived",
      actor_id: formation.nationId,
      subject_ids: [formation.id, dest],
      payload: {
        formation_id: formation.id,
        territory_id: dest,
        previous,
      },
      visibility_rule: visibilityNations([formation.nationId, territory.controller]),
      cause_event_id: null,
    },
  );
}
