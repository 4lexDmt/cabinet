import type { BuildingDef, Order, Pact, Site, TickContext } from "../types.ts";
import {
  adjustNation,
  emit,
  mutatePact,
  putFormation,
  putPact,
  putWar,
  setFlag,
  visibilityNations,
  visibilityPublic,
} from "../context.ts";
import { graphHasCorridors, monthOf, shortestPath, travelTicksBetween } from "../corridor.ts";

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
        shareIntelligence(ctx, order);
        break;
      case "pay_tribute":
        payTributeOrder(ctx, order);
        break;
      case "set_posture":
        setPosture(ctx, order);
        break;
      case "construct":
        constructBuilding(ctx, order);
        break;
      case "construct_upstream":
        constructUpstream(ctx, order);
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
  let path: string[] | undefined;
  let ticks: number | undefined;
  if (graphHasCorridors(corridors) && corridors) {
    const month = monthOf(ctx.state.tick, ctx.state.tuning);
    const hops = shortestPath(corridors, formation.location, destination, month);
    if (!hops || hops.length < 2) {
      ctx.warnings.push(`no corridor from ${formation.location} to ${destination}`);
      emit(ctx, {
        type: "order.rejected",
        actor_id: order.nationId,
        subject_ids: [formationId, destination],
        payload: { reason: "no_corridor", formation_id: formationId, destination },
        visibility_rule: visibilityNations([order.nationId]),
        cause_event_id: null,
      });
      return;
    }
    path = hops.slice(1);
    ticks = travelTicksBetween(corridors, formation.location, path[0]!, month) ?? 1;
  }

  putFormation(
    ctx,
    { ...formation, destination, inTransit: true, path, ticks_remaining: ticks },
    {
      type: "formation.ordered_to_move",
      actor_id: order.nationId,
      subject_ids: [formationId, destination],
      payload: { formation_id: formationId, from: formation.location, to: destination },
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

function shareIntelligence(ctx: TickContext, order: Order): void {
  const target = String(order.payload.target ?? "");
  if (order.payload.kind === "hydrology" && target) {
    setFlag(ctx, `hydro_data:${order.nationId}:${target}`, ctx.state.tick, {
      type: "water.data_shared",
      actor_id: order.nationId,
      subject_ids: [target],
      payload: { water_id: target },
      visibility_rule: visibilityNations([order.nationId]),
      cause_event_id: null,
    });
    return;
  }
  emit(ctx, {
    type: "intel.share_ordered",
    actor_id: order.nationId,
    subject_ids: [target],
    payload: { order_id: order.id, ...order.payload },
    visibility_rule: visibilityNations([order.nationId, target || order.nationId]),
    cause_event_id: null,
  });
}

function constructUpstream(ctx: TickContext, order: Order): void {
  const siteId = String(order.payload.site_id ?? "");
  const waterId = String(order.payload.water_id ?? "");
  const downstream = String(order.payload.downstream_nation ?? "");
  const site = ctx.state.sites?.[siteId];
  if (!site || site.nationId !== order.nationId) return;
  if (!waterId || !site.water_ids.includes(waterId)) return;
  if (!ctx.state.nations[downstream] || downstream === order.nationId) return;

  setFlag(ctx, `upstream_impound:${waterId}`, order.nationId, {
    type: "flag.set",
    actor_id: order.nationId,
    subject_ids: [waterId, siteId],
    payload: { key: `upstream_impound:${waterId}`, value: order.nationId },
    visibility_rule: visibilityPublic(),
    cause_event_id: null,
  });
  setFlag(ctx, `flow:${waterId}`, 0, {
    type: "flag.set",
    actor_id: order.nationId,
    subject_ids: [waterId],
    payload: { key: `flow:${waterId}`, value: 0 },
    visibility_rule: visibilityPublic(),
    cause_event_id: null,
  });
  emit(ctx, {
    type: "water.impounded",
    actor_id: order.nationId,
    subject_ids: [downstream],
    payload: { water_id: waterId, site_id: siteId, downstream },
    visibility_rule: visibilityPublic(),
    cause_event_id: null,
  });
}

function constructBuilding(ctx: TickContext, order: Order): void {
  const siteId = String(order.payload.site_id ?? "");
  const kind = String(order.payload.building ?? "");
  if (kind === "force") {
    emit(ctx, {
      type: "order.rejected",
      actor_id: order.nationId,
      subject_ids: [siteId],
      payload: { reason: "force_is_derived", building: kind },
      visibility_rule: visibilityNations([order.nationId]),
      cause_event_id: null,
    });
    return;
  }
  const catalog = ctx.options.buildingCatalog ?? [];
  const def = catalog.find((item) => item.id === kind);
  const site = ctx.state.sites?.[siteId];
  if (!def || !site || site.nationId !== order.nationId) return;
  if (site.occupied + def.slots > site.slots) {
    emit(ctx, {
      type: "order.rejected",
      actor_id: order.nationId,
      subject_ids: [siteId],
      payload: { reason: "no_slots", building: kind, slots: site.slots, occupied: site.occupied },
      visibility_rule: visibilityNations([order.nationId]),
      cause_event_id: null,
    });
    return;
  }
  if (def.requires === "hydro" && site.water_ids.length === 0) {
    emit(ctx, {
      type: "order.rejected",
      actor_id: order.nationId,
      subject_ids: [siteId],
      payload: { reason: "hydro_requires_water", building: kind },
      visibility_rule: visibilityNations([order.nationId]),
      cause_event_id: null,
    });
    return;
  }
  if (def.requires === "coast" && !site.coastal) {
    emit(ctx, {
      type: "order.rejected",
      actor_id: order.nationId,
      subject_ids: [siteId],
      payload: { reason: "desalination_requires_coast", building: kind },
      visibility_rule: visibilityNations([order.nationId]),
      cause_event_id: null,
    });
    return;
  }

  const buildingId = `bldg:${siteId}:${kind}:${ctx.state.tick}:${order.id}`;
  ctx.state.buildings ??= {};
  ctx.state.buildings[buildingId] = {
    id: buildingId,
    siteId,
    kind,
    nationId: order.nationId,
    completed_tick: ctx.state.tick,
  };
  ctx.mutationCount += 1;
  const built = emit(ctx, {
    type: "site.constructed",
    actor_id: order.nationId,
    subject_ids: [siteId, buildingId],
    payload: { building: kind, site_id: siteId, pillar: def.pillar },
    visibility_rule: visibilityNations([order.nationId]),
    cause_event_id: null,
  });

  const nextSite: Site = { ...site, occupied: site.occupied + def.slots };
  applyBuildingYield(ctx, nextSite, def, built.id);
  ctx.state.sites ??= {};
  ctx.state.sites[siteId] = nextSite;
  ctx.mutationCount += 1;
  emit(ctx, {
    type: "site.occupied",
    actor_id: order.nationId,
    subject_ids: [siteId],
    payload: { occupied: nextSite.occupied, slots: nextSite.slots },
    visibility_rule: visibilityNations([order.nationId]),
    cause_event_id: built.id,
  });

  if (def.corridor_bonus && ctx.state.corridors) {
    const ids = Object.keys(ctx.state.corridors).sort();
    for (const id of ids) {
      const corridor = ctx.state.corridors[id];
      if (!corridor) continue;
      if (corridor.from !== siteId && corridor.to !== siteId) continue;
      const nextTicks = Math.max(1, corridor.travel_ticks - def.corridor_bonus);
      if (nextTicks === corridor.travel_ticks) continue;
      corridor.travel_ticks = nextTicks;
      ctx.mutationCount += 1;
      emit(ctx, {
        type: "corridor.improved",
        actor_id: order.nationId,
        subject_ids: [corridor.id, siteId],
        payload: { corridor_id: corridor.id, travel_ticks: nextTicks },
        visibility_rule: visibilityNations([order.nationId]),
        cause_event_id: built.id,
      });
    }
  }
}

function applyBuildingYield(ctx: TickContext, site: Site, def: BuildingDef, cause: string): void {
  const nationId = site.nationId;
  const vis = visibilityNations([nationId]);
  if (def.economy) {
    let applied = def.economy;
    if (site.kind === "city") {
      const caps = ctx.options.cityEconomyCap ?? { 1: 12, 2: 24, 3: 40 };
      const cap = caps[site.tier ?? 1];
      const current = site.economy ?? 0;
      const next = Math.min(current + def.economy, cap);
      applied = next - current;
      site.economy = next;
    }
    if (applied !== 0) {
      adjustNation(ctx, nationId, "economy", applied, {
        type: "economy.built",
        actor_id: nationId,
        subject_ids: [site.id],
        payload: { building: def.id, capped: site.kind === "city" },
        visibility_rule: vis,
        cause_event_id: cause,
      });
    }
  }
  if (def.standing_internal) {
    adjustNation(ctx, nationId, "standing_internal", def.standing_internal, {
      type: "standing.changed",
      actor_id: nationId,
      subject_ids: [site.id],
      payload: { building: def.id },
      visibility_rule: vis,
      cause_event_id: cause,
    });
  }
  if (def.standing_external) {
    adjustNation(ctx, nationId, "standing_external", def.standing_external, {
      type: "standing.changed",
      actor_id: nationId,
      subject_ids: [site.id],
      payload: { building: def.id },
      visibility_rule: visibilityPublic(),
      cause_event_id: cause,
    });
  }
  if (def.intelligence_capacity) {
    adjustNation(ctx, nationId, "intelligence_capacity", def.intelligence_capacity, {
      type: "stat.changed",
      actor_id: nationId,
      subject_ids: [site.id],
      payload: { building: def.id },
      visibility_rule: vis,
      cause_event_id: cause,
    });
  }
  if (def.supply) {
    adjustNation(ctx, nationId, "supply", def.supply, {
      type: "stat.changed",
      actor_id: nationId,
      subject_ids: [site.id],
      payload: { building: def.id },
      visibility_rule: vis,
      cause_event_id: cause,
    });
  }
}
