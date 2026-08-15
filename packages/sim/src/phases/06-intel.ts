import type { Belief, TickContext } from "../types.ts";
import { mutatePact, putBelief, sortedIds, visibilityNations } from "../context.ts";
import { stableStringify } from "../serialize.ts";

/**
 * Writes beliefs from world truth. Advisor rendering must not import this file.
 */
export function phaseIntel(ctx: TickContext): void {
  observeOwnHoldings(ctx);
  leakSecretPacts(ctx);
  applyShareOrders(ctx);
}

function observeOwnHoldings(ctx: TickContext): void {
  for (const nationId of sortedIds(ctx.state.nations, ctx)) {
    for (const territoryId of sortedIds(ctx.state.territories, ctx)) {
      const territory = ctx.state.territories[territoryId];
      if (!territory || territory.controller !== nationId) continue;
      writeBelief(ctx, {
        observer_nation_id: nationId,
        subject_type: "territory",
        subject_id: territoryId,
        field: "controller",
        believed_value: nationId,
        confidence: 100,
        source: "direct_observation",
        last_updated_tick: ctx.state.tick,
      });
    }
  }
}

function leakSecretPacts(ctx: TickContext): void {
  const mille = ctx.state.tuning.secret_pact_leak_base_chance_mille;
  for (const pactId of sortedIds(ctx.state.pacts, ctx)) {
    const pact = ctx.state.pacts[pactId];
    if (!pact || !pact.secret || pact.status !== "active") continue;
    if (!ctx.rng.chanceMille(mille)) continue;
    const outsiders = Object.keys(ctx.state.nations)
      .filter((id) => !pact.visible_to.includes(id))
      .sort();
    if (outsiders.length === 0) continue;
    const discoverer = outsiders[ctx.rng.int(outsiders.length)]!;
    writeBelief(ctx, {
      observer_nation_id: discoverer,
      subject_type: "pact",
      subject_id: pact.id,
      field: "exists",
      believed_value: {
        parties: pact.parties,
        title: pact.public_terms.title,
      },
      confidence: 55,
      source: "inference",
      last_updated_tick: ctx.state.tick,
    });
    mutatePact(
      ctx,
      pact.id,
      { visible_to: [...new Set([...pact.visible_to, discoverer])].sort() },
      {
        type: "pact.leaked",
        actor_id: null,
        subject_ids: [...pact.parties, discoverer],
        payload: { pact_id: pact.id, discovered_by: discoverer },
        visibility_rule: visibilityNations([...pact.parties, discoverer]),
        cause_event_id: null,
      },
    );
  }
}

function applyShareOrders(ctx: TickContext): void {
  for (const order of ctx.orders) {
    if (order.kind !== "share_intelligence") continue;
    const target = String(order.payload.target ?? "");
    const subjectId = String(order.payload.subject_id ?? "");
    const field = String(order.payload.field ?? "exists");
    if (!ctx.state.nations[target]) continue;
    const sourceBelief = ctx.state.beliefs.find(
      (b) =>
        b.observer_nation_id === order.nationId &&
        b.subject_id === subjectId &&
        b.field === field,
    );
    writeBelief(ctx, {
      observer_nation_id: target,
      subject_type: (sourceBelief?.subject_type ?? "pact") as Belief["subject_type"],
      subject_id: subjectId,
      field,
      believed_value: sourceBelief?.believed_value ?? order.payload.value ?? true,
      confidence: Math.min(sourceBelief?.confidence ?? 40, 70),
      source: "ally_share",
      last_updated_tick: ctx.state.tick,
    });
  }
}

function writeBelief(ctx: TickContext, belief: Belief): void {
  const existing = ctx.state.beliefs.find(
    (b) =>
      b.observer_nation_id === belief.observer_nation_id &&
      b.subject_type === belief.subject_type &&
      b.subject_id === belief.subject_id &&
      b.field === belief.field,
  );
  if (existing) {
    const prior = { ...existing, last_updated_tick: 0 };
    const next = { ...belief, last_updated_tick: 0 };
    if (stableStringify(prior) === stableStringify(next)) return;
  }
  putBelief(ctx, belief, {
    type: "belief.updated",
    actor_id: belief.observer_nation_id,
    subject_ids: [belief.subject_id],
    payload: {
      observer: belief.observer_nation_id,
      subject_type: belief.subject_type,
      subject_id: belief.subject_id,
      field: belief.field,
      source: belief.source,
      confidence: belief.confidence,
    },
    visibility_rule: visibilityNations([belief.observer_nation_id]),
    cause_event_id: null,
  });
}

export function beliefsOf(beliefs: Belief[], observerNationId: string): Belief[] {
  return beliefs.filter((b) => b.observer_nation_id === observerNationId);
}
