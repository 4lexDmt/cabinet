import type { EffectRule, EffectTarget, GameEvent, NationNumericField, TickContext } from "../types.ts";
import { adjustNation, emit, visibilityNations, visibilityPublic } from "../context.ts";

const NATION_FIELDS = new Set<NationNumericField>([
  "standing_external",
  "standing_internal",
  "economy",
  "intelligence_capacity",
  "supply",
]);

export function phaseEffects(ctx: TickContext): void {
  const rules = ctx.options.effectRules ?? [];
  const cap = ctx.state.tuning.cascade_depth_cap;
  let frontier = [...ctx.events];
  let depth = 0;

  while (frontier.length > 0) {
    if (depth >= cap) {
      ctx.warnings.push(`effect cascade hit depth cap ${cap}`);
      emit(ctx, {
        type: "cascade.capped",
        actor_id: null,
        subject_ids: [],
        payload: { cap, pending: frontier.length },
        visibility_rule: visibilityPublic(),
        cause_event_id: null,
      });
      break;
    }
    const derived: GameEvent[] = [];
    const queue = ctx.options.shuffleIteration ? ctx.rng.shuffleInPlace([...frontier]) : frontier;
    for (const event of queue) {
      for (const rule of matchingRules(rules, event)) {
        if (!conditionHolds(rule, ctx, event)) continue;
        for (const effect of rule.effects) {
          const nationId = resolveNation(effect.target, event);
          const field = resolveField(effect.target);
          if (!nationId || !field || !ctx.state.nations[nationId]) continue;
          const standingEvent = adjustNation(ctx, nationId, field, effect.delta, {
            type: field.startsWith("standing") ? "standing.changed" : "stat.changed",
            actor_id: event.actor_id,
            subject_ids: [nationId, ...event.subject_ids],
            payload: { rule_id: rule.id, trigger: event.type },
            visibility_rule:
              field === "standing_internal" ? visibilityNations([nationId]) : visibilityPublic(),
            cause_event_id: event.id,
          });
          derived.push(standingEvent);
        }
        for (const emitType of rule.emits) {
          if (emitType === "standing.changed") continue;
          derived.push(
            emit(ctx, {
              type: emitType,
              actor_id: event.actor_id,
              subject_ids: event.subject_ids,
              payload: { rule_id: rule.id, from: event.type },
              visibility_rule: event.visibility_rule,
              cause_event_id: event.id,
            }),
          );
        }
      }
    }
    frontier = derived;
    depth += 1;
  }
}

function matchingRules(rules: EffectRule[], event: GameEvent): EffectRule[] {
  return rules.filter((r) => r.trigger === event.type).sort((a, b) => (a.id < b.id ? -1 : 1));
}

function conditionHolds(rule: EffectRule, ctx: TickContext, event: GameEvent): boolean {
  if (!rule.condition) return true;
  if (rule.condition === "event.secret") {
    return event.payload.secret === true;
  }
  if (rule.condition === "event.public") {
    return event.payload.secret !== true;
  }
  void ctx;
  return true;
}

function resolveNation(target: EffectTarget, event: GameEvent): string | null {
  if ("nationId" in target) return target.nationId;
  if (target.nation === "event.actor_id") return event.actor_id;
  if (target.nation === "event.subject") return event.subject_ids[0] ?? null;
  return null;
}

function resolveField(target: EffectTarget): NationNumericField | null {
  if (!NATION_FIELDS.has(target.field)) return null;
  return target.field;
}
