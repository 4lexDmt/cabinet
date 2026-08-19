import type { TickContext } from "../types.ts";
import { emit, setFlag, visibilityPublic } from "../context.ts";

const DESICCATION_PREFIX = "desiccation:";
const RIPARIAN_PREFIX = "desiccation_riparian:";

/**
 * Slow-burn water loss. Progress is a tick flag; economy and internal
 * standing move through attributed events, never silently.
 */
export function phaseWater(ctx: TickContext): void {
  const keys = Object.keys(ctx.state.flags)
    .filter((key) => key.startsWith(DESICCATION_PREFIX) && !key.startsWith(RIPARIAN_PREFIX))
    .sort();

  for (const key of keys) {
    const waterId = key.slice(DESICCATION_PREFIX.length);
    const current = Number(ctx.state.flags[key] ?? 0);
    if (!Number.isFinite(current)) continue;
    const next = current + 1;
    setFlag(ctx, key, next, {
      type: "water.desiccation_progress",
      actor_id: null,
      subject_ids: [waterId],
      payload: { water_id: waterId, progress: next },
      visibility_rule: visibilityPublic(),
      cause_event_id: null,
    });

    const riparianPrefix = `${RIPARIAN_PREFIX}${waterId}:`;
    const nations = Object.keys(ctx.state.flags)
      .filter((flag) => flag.startsWith(riparianPrefix) && ctx.state.flags[flag])
      .map((flag) => flag.slice(riparianPrefix.length))
      .sort();

    for (const nationId of nations) {
      if (!ctx.state.nations[nationId]) continue;
      emit(ctx, {
        type: "water.desiccated",
        actor_id: null,
        subject_ids: [nationId],
        payload: { water_id: waterId, progress: next, nation_id: nationId },
        visibility_rule: visibilityPublic(),
        cause_event_id: null,
      });
    }
  }
}
