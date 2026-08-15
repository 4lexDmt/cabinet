import type { Obligation, Pact, PredicateName, TickContext, WorldState } from "../types.ts";
import { emit, mutatePact, sortedIds, visibilityNations, visibilityPublic } from "../context.ts";

export type Predicate = (state: WorldState, obligation: Obligation, pact: Pact) => boolean;

/**
 * Obligations are evaluated against WORLD TRUTH.
 * Visibility of the resulting breach is a separate question.
 */
export const PREDICATES: Record<PredicateName, Predicate> = {
  not_move_forces_into(state, obligation) {
    const target = obligation.target;
    if (!target) return true;
    return !Object.values(state.formations).some(
      (f) => f.nationId === obligation.party && (f.location === target || f.destination === target),
    );
  },
  maintain_trade_route(state, obligation) {
    const target = obligation.target;
    if (!target) return true;
    const route = state.tradeRoutes.find(
      (r) =>
        r.id === target ||
        (r.from === obligation.party && r.to === target) ||
        (r.to === obligation.party && r.from === target),
    );
    return Boolean(route?.open);
  },
  not_declare_war_on(state, obligation) {
    const target = obligation.target;
    if (!target) return true;
    return !state.wars.some(
      (w) => w.attacker === obligation.party && w.defender === target,
    );
  },
  share_intelligence_on(state, obligation, pact) {
    const subject = obligation.target;
    if (!subject) return true;
    const others = pact.parties.filter((p) => p !== obligation.party);
    return others.every((observer) =>
      state.beliefs.some(
        (b) =>
          b.observer_nation_id === observer &&
          b.subject_id === subject &&
          b.source === "ally_share" &&
          b.last_updated_tick >= state.tick - 1,
      ),
    );
  },
  provide_passage(state, obligation) {
    const traveler = obligation.target;
    if (!traveler) return true;
    const denied = state.flags[`passage_denied:${obligation.party}:${traveler}`];
    return denied !== true && denied !== 1;
  },
  pay_tribute(state, obligation) {
    const amount = Number(obligation.params?.amount ?? 0);
    const to = String(obligation.target ?? "");
    if (!to || amount <= 0) return true;
    const paid = state.flags[`tribute_paid:${obligation.party}:${to}:${state.tick}`];
    return paid === true || paid === amount;
  },
};

export function phasePacts(ctx: TickContext): void {
  for (const pactId of sortedIds(ctx.state.pacts, ctx)) {
    const pact = ctx.state.pacts[pactId];
    if (!pact || pact.status !== "active") continue;

    if (pact.private_terms.duration_ticks && pact.activated_tick !== null) {
      if (ctx.state.tick - pact.activated_tick >= pact.private_terms.duration_ticks) {
        mutatePact(
          ctx,
          pact.id,
          { status: "expired" },
          {
            type: "pact.expired",
            actor_id: null,
            subject_ids: pact.parties,
            payload: { pact_id: pact.id },
            visibility_rule: pact.secret ? visibilityNations(pact.visible_to) : visibilityPublic(),
            cause_event_id: null,
          },
        );
        continue;
      }
    }

    const obligations = [...pact.private_terms.obligations].sort((a, b) => (a.id < b.id ? -1 : 1));
    if (ctx.options.shuffleIteration) ctx.rng.shuffleInPlace(obligations);

    for (const obligation of obligations) {
      const predicate = PREDICATES[obligation.must];
      if (!predicate) {
        ctx.warnings.push(`unknown predicate ${obligation.must} on ${pact.id}`);
        continue;
      }
      const honoured = predicate(ctx.state, obligation, pact);
      if (honoured) continue;

      mutatePact(
        ctx,
        pact.id,
        {
          status: "broken",
          broken_by: obligation.party,
          broken_tick: ctx.state.tick,
        },
        {
          type: "pact.breached",
          actor_id: obligation.party,
          subject_ids: pact.parties,
          payload: {
            pact_id: pact.id,
            obligation_id: obligation.id,
            must: obligation.must,
            target: obligation.target ?? null,
            secret: pact.secret,
          },
          visibility_rule: pact.secret
            ? visibilityNations(pact.visible_to)
            : visibilityPublic(),
          cause_event_id: null,
        },
      );
      break;
    }
  }
}

export function pactVisibleTo(pact: Pact, nationId: string): boolean {
  if (!pact.secret) return true;
  return pact.visible_to.includes(nationId);
}
