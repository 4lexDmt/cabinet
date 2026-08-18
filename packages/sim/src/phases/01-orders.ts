import type { Order, Pact, TickContext } from "../types.ts";
import { shortestCorridorPath } from "../corridor.ts";
import {
  adjustNation,
  emit,
  mutatePact,
  putFormation,
  putPact,
  putWar,
  visibilityNations,
  visibilityPublic,
} from "../context.ts";

export function phaseOrders(ctx: TickContext): void {
  for (const order of ctx.orders) {
    switch (order.kind) {
      case "propose_pact":
        proposePact(ctx, order);
        break;
      case "accept_pact":
        acceptPact(ctx, order);
        break;
      case "reject_pact":
        rejectPact(ctx, order);
        break;
      case "break_pact":
        breakPact(ctx, order);
        break;
      case "declare_war":
        declareWar(ctx, order);
        break;
      case "move_formation":
        orderMove(ctx, order);
        break;
      case "economic_pressure":
        economicPressure(ctx, order);
        break;
      case "share_intelligence":
        emit(ctx, {
          type: "intel.share_ordered",
          actor_id: order.nationId,
          subject_ids: [String(order.payload.target ?? "")],
          payload: { order_id: order.id, ...order.payload },
          visibility_rule: visibilityNations([
            order.nationId,
            String(order.payload.target ?? order.nationId),
          ]),
          cause_event_id: null,
        });
        break;
      case "pay_tribute":
        payTributeOrder(ctx, order);
        break;
      case "set_posture":
        setPosture(ctx, order);
        break;
      default: {
        const _never: never = order.kind;
        void _never;
      }
    }
  }
}

function proposePact(ctx: TickContext, order: Order): void {
  const pact = order.payload.pact as Pact | undefined;
  if (!pact) return;
  if (!pact.parties.includes(order.nationId)) return;
  const record: Pact = {
    ...pact,
    status: "pending",
    signed_by: [order.nationId],
    created_tick: ctx.state.tick,
    activated_tick: null,
    broken_by: null,
    broken_tick: null,
    visible_to: [...pact.parties].sort(),
  };
  putPact(ctx, record, {
    type: "pact.proposed",
    actor_id: order.nationId,
    subject_ids: record.parties,
    payload: { pact_id: record.id, secret: record.secret, title: record.public_terms.title },
    visibility_rule: visibilityNations(record.visible_to),
    cause_event_id: null,
  });
}

function acceptPact(ctx: TickContext, order: Order): void {
  const pactId = String(order.payload.pact_id ?? "");
  const pact = ctx.state.pacts[pactId];
  if (!pact) return;
  if (!pact.parties.includes(order.nationId)) return;
  if (pact.status !== "pending" && pact.status !== "draft") return;
  if (pact.signed_by.includes(order.nationId)) return;

  const signed = [...pact.signed_by, order.nationId].sort();
  const allSigned = pact.parties.every((p) => signed.includes(p));
  mutatePact(
    ctx,
    pactId,
    {
      signed_by: signed,
      status: allSigned ? "active" : "pending",
      activated_tick: allSigned ? ctx.state.tick : pact.activated_tick,
    },
    {
      type: allSigned ? "pact.signed" : "pact.accepted",
      actor_id: order.nationId,
      subject_ids: pact.parties,
      payload: { pact_id: pactId, complete: allSigned },
      visibility_rule: pact.secret ? visibilityNations(pact.visible_to) : visibilityPublic(),
      cause_event_id: null,
    },
  );
}

function rejectPact(ctx: TickContext, order: Order): void {
  const pactId = String(order.payload.pact_id ?? "");
  const pact = ctx.state.pacts[pactId];
  if (!pact) return;
  mutatePact(
    ctx,
    pactId,
    { status: "expired" },
    {
      type: "pact.rejected",
      actor_id: order.nationId,
      subject_ids: pact.parties,
      payload: { pact_id: pactId },
      visibility_rule: visibilityNations(pact.visible_to),
      cause_event_id: null,
    },
  );
}

function breakPact(ctx: TickContext, order: Order): void {
  const pactId = String(order.payload.pact_id ?? "");
  const pact = ctx.state.pacts[pactId];
  if (!pact || pact.status !== "active") return;
  if (!pact.parties.includes(order.nationId)) return;
  mutatePact(
    ctx,
    pactId,
    { status: "broken", broken_by: order.nationId, broken_tick: ctx.state.tick },
    {
      type: "pact.broken",
      actor_id: order.nationId,
      subject_ids: pact.parties,
      payload: { pact_id: pactId, reason: "renounced" },
      visibility_rule: pact.secret ? visibilityNations(pact.visible_to) : visibilityPublic(),
      cause_event_id: null,
    },
  );
}

function declareWar(ctx: TickContext, order: Order): void {
  const target = String(order.payload.target ?? "");
  if (!ctx.state.nations[target]) return;
  if (order.nationId === target) return;
  const existing = ctx.state.wars.find(
    (w) =>
      (w.attacker === order.nationId && w.defender === target) ||
      (w.attacker === target && w.defender === order.nationId),
  );
  if (existing) return;
  const id = `war:${[order.nationId, target].sort().join("-")}`;
  putWar(ctx, { id, attacker: order.nationId, defender: target, declared_tick: ctx.state.tick }, {
    type: "war.declared",
    actor_id: order.nationId,
    subject_ids: [order.nationId, target],
    payload: { war_id: id, attacker: order.nationId, defender: target },
    visibility_rule: visibilityPublic(),
    cause_event_id: null,
  });
}

function orderMove(ctx: TickContext, order: Order): void {
  const formationId = String(order.payload.formation_id ?? "");
  const destination = String(order.payload.destination ?? "");
  const formation = ctx.state.formations[formationId];
  if (!formation || formation.nationId !== order.nationId) return;
  if (!ctx.state.territories[destination]) return;
  const corridors = ctx.state.corridors;
  let ticksRemaining = 0;
  if (corridors.length > 0) {
    const path = shortestCorridorPath(corridors, formation.location, destination);
    if (!path) {
      ctx.warnings.push(`move_formation rejected: no corridor path ${formation.location} -> ${destination}`);
      return;
    }
    ticksRemaining = path.cost;
  }
  putFormation(
    ctx,
    { ...formation, destination, inTransit: true, ticks_remaining: ticksRemaining },
    {
      type: "formation.ordered_to_move",
      actor_id: order.nationId,
      subject_ids: [formationId, destination],
      payload: { formation_id: formationId, from: formation.location, to: destination, travel_ticks: ticksRemaining },
      visibility_rule: visibilityNations([order.nationId]),
      cause_event_id: null,
    },
  );
}

function economicPressure(ctx: TickContext, order: Order): void {
  const target = String(order.payload.target ?? "");
  if (!ctx.state.nations[target]) return;
  const intensity = Math.max(1, Math.trunc(Number(order.payload.intensity ?? 1)));
  const delta = -intensity * 4;
  adjustNation(ctx, target, "economy", delta, {
    type: "economy.pressured",
    actor_id: order.nationId,
    subject_ids: [target],
    payload: { intensity },
    visibility_rule: visibilityNations([order.nationId, target]),
    cause_event_id: null,
  });
}

function payTributeOrder(ctx: TickContext, order: Order): void {
  const target = String(order.payload.target ?? "");
  const amount = Math.max(0, Math.trunc(Number(order.payload.amount ?? 0)));
  if (!ctx.state.nations[target] || amount <= 0) return;
  const paid = adjustNation(ctx, order.nationId, "economy", -amount, {
    type: "tribute.paid",
    actor_id: order.nationId,
    subject_ids: [target],
    payload: { amount, to: target },
    visibility_rule: visibilityNations([order.nationId, target]),
    cause_event_id: null,
  });
  ctx.state.flags[`tribute_paid:${order.nationId}:${target}:${ctx.state.tick}`] = amount;
  ctx.mutationCount += 1;
  emit(ctx, {
    type: "flag.set",
    actor_id: order.nationId,
    subject_ids: [target],
    payload: {
      key: `tribute_paid:${order.nationId}:${target}:${ctx.state.tick}`,
      value: amount,
    },
    visibility_rule: visibilityNations([order.nationId, target]),
    cause_event_id: paid.id,
  });
  adjustNation(ctx, target, "economy", amount, {
    type: "tribute.received",
    actor_id: order.nationId,
    subject_ids: [target],
    payload: { amount, from: order.nationId },
    visibility_rule: visibilityNations([order.nationId, target]),
    cause_event_id: paid.id,
  });
}

function setPosture(ctx: TickContext, order: Order): void {
  const engagement = String(order.payload.engagement ?? "hold");
  const allowed = new Set(["hold", "defend", "pressure", "withdraw"]);
  const value = allowed.has(engagement) ? engagement : "hold";
  ctx.state.postures[order.nationId] = {
    nationId: order.nationId,
    engagement: value as "hold" | "defend" | "pressure" | "withdraw",
    delegation: ctx.state.postures[order.nationId]?.delegation ?? [],
  };
  ctx.mutationCount += 1;
  emit(ctx, {
    type: "posture.set",
    actor_id: order.nationId,
    subject_ids: [order.nationId],
    payload: { engagement: value },
    visibility_rule: visibilityNations([order.nationId]),
    cause_event_id: null,
  });
}
