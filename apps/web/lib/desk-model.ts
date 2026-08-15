import type { MatchRecord } from "@cabinet/db";
import {
  eventVisibleTo,
  forceOf,
  pactVisibleTo,
  type GameEvent,
  type Nation,
  type NationStatus,
  type Pact,
} from "@cabinet/sim";

export type AttentionKind = "message" | "instrument" | "breach" | "ledger" | "none";

export type AlertSeverity = "informational" | "notable" | "urgent" | "critical";

export type Destination = "briefing" | "map" | "channels" | "pacts" | "nation" | "ledger";

export interface DeskAlert {
  id: string;
  severity: AlertSeverity;
  copy: string;
  href: string;
}

export interface NavAttention {
  briefing: AttentionKind;
  map: AttentionKind;
  channels: AttentionKind;
  pacts: AttentionKind;
  nation: AttentionKind;
  ledger: AttentionKind;
}

export function statusLabel(status: NationStatus): string {
  switch (status) {
    case "sovereign":
      return "Sovereign";
    case "rump":
      return "Rump state";
    case "occupied":
      return "Occupied";
    case "client":
      return "Client";
    case "exile":
      return "In exile";
  }
}

export function pendingPacts(match: MatchRecord, nationId: string): number {
  return Object.values(match.world.pacts).filter(
    (p) => p.status === "pending" && p.parties.includes(nationId) && !p.signed_by.includes(nationId),
  ).length;
}

export function knownPacts(match: MatchRecord, nationId: string): Pact[] {
  return Object.values(match.world.pacts).filter(
    (p) => pactVisibleTo(p, nationId) || p.parties.includes(nationId),
  );
}

export function ownOrdersWaiting(match: MatchRecord, nationId: string): boolean {
  return match.orders.some((o) => !o.consumed && o.nationId === nationId);
}

export function navAttention(match: MatchRecord, nationId: string): NavAttention {
  const tick = match.world.tick;
  const visible = match.events.filter((e) => eventVisibleTo(e, nationId));
  const thisSitting = visible.filter((e) => e.tick === tick);
  const breach = thisSitting.some((e) => e.type === "pact.breached" || e.type === "pact.broken");
  const instrument = thisSitting.some(
    (e) => e.type === "pact.proposed" || e.type === "pact.signed" || e.type === "pact.leaked",
  );
  const ledger = thisSitting.some((e) => e.type === "standing.changed" && e.payload.nation_id === nationId);
  const movement = thisSitting.some((e) => e.type === "formation.arrived");
  const cables = match.messages.some((m) => m.authorNationId !== nationId && m.createdTick === tick);
  const pending = pendingPacts(match, nationId) > 0;

  return {
    briefing: breach ? "breach" : instrument ? "instrument" : ledger ? "ledger" : cables ? "message" : "none",
    map: movement ? "instrument" : "none",
    channels: cables ? "message" : "none",
    pacts: breach ? "breach" : pending ? "instrument" : "none",
    nation: ledger ? "ledger" : "none",
    ledger: ledger ? "ledger" : "none",
  };
}

export function deskAlerts(match: MatchRecord, nationId: string): DeskAlert[] {
  const visible = match.events.filter((e) => eventVisibleTo(e, nationId));
  const alerts: DeskAlert[] = [];

  for (const event of [...visible].reverse()) {
    if (event.type === "pact.breached" && event.subject_ids.includes(nationId)) {
      alerts.push({
        id: event.id,
        severity: "critical",
        copy: `An instrument you are party to was broken. ${
          event.payload.must ? String(event.payload.must).replaceAll("_", " ") : "An obligation"
        } was not honoured.`,
        href: "/pacts?scope=broken",
      });
    }
    if (event.type === "war.declared" && event.subject_ids.includes(nationId)) {
      alerts.push({
        id: event.id,
        severity: "critical",
        copy: "A state of war has been declared involving this government.",
        href: "/map",
      });
    }
    if (event.type === "formation.arrived") {
      const territoryId = String(event.payload.territory_id ?? "");
      const territory = match.world.territories[territoryId];
      if (
        territory &&
        event.actor_id !== nationId &&
        (territory.owner === nationId || territory.controller === nationId)
      ) {
        alerts.push({
          id: event.id,
          severity: "urgent",
          copy: `Border violation reported in ${territory.name}.`,
          href: `/map?t=${territory.id}&z=local`,
        });
      }
    }
    if (event.type === "pact.leaked" && event.payload.discovered_by === nationId) {
      alerts.push({
        id: event.id,
        severity: "urgent",
        copy: "A secret understanding has come into file that was not transmitted to you by its signatories.",
        href: "/pacts?scope=known",
      });
    }
    if (event.type === "pact.expired" && event.subject_ids.includes(nationId)) {
      alerts.push({
        id: event.id,
        severity: "urgent",
        copy: "An obligation is no longer in force. The term has lapsed.",
        href: "/pacts",
      });
    }
    if (event.type === "pact.signed") {
      alerts.push({
        id: event.id,
        severity: "notable",
        copy: "An instrument has been executed. The obligations are now in force.",
        href: "/pacts",
      });
    }
    if (event.type === "economy.pressured" && event.subject_ids.includes(nationId)) {
      alerts.push({
        id: event.id,
        severity: "informational",
        copy: "Economic pressure has been applied. The effect is on the ledger.",
        href: "/ledger",
      });
    }
    if (event.type === "tribute.received" && event.subject_ids.includes(nationId)) {
      alerts.push({
        id: event.id,
        severity: "informational",
        copy: "Tribute has been received. The movement is on the ledger.",
        href: "/ledger",
      });
    }
  }

  const pending = pendingPacts(match, nationId);
  if (pending > 0) {
    alerts.push({
      id: "pending-hand",
      severity: "urgent",
      copy: pending === 1 ? "An instrument awaits your hand." : `${pending} instruments await your hand.`,
      href: "/pacts",
    });
  }

  const ranked: DeskAlert[] = [];
  const seen = new Set<string>();
  for (const alert of alerts) {
    const key = `${alert.severity}:${alert.copy}`;
    if (seen.has(key)) continue;
    seen.add(key);
    ranked.push(alert);
    if (ranked.length >= 6) break;
  }
  return ranked;
}

export interface PillarReading {
  standingExternal: number;
  standingInternal: number;
  standingGap: number;
  standingTrend: number;
  intelAvailable: number;
  intelCommitted: number;
  economyAvailable: number;
  economyCommitted: number;
  economyTrend: number;
  force: number;
  supply: number;
}

export function pillarReading(match: MatchRecord, nation: Nation): PillarReading {
  const visible = match.events.filter((e) => eventVisibleTo(e, nation.id));
  const standingEvents = visible.filter(
    (e) => e.type === "standing.changed" && e.payload.nation_id === nation.id,
  );
  const lastStanding = standingEvents.at(-1);
  const economyEvents = visible.filter(
    (e) => (e.type === "economy.pressured" || e.type === "stat.changed") && e.payload.nation_id === nation.id,
  );
  return {
    standingExternal: nation.standing_external,
    standingInternal: nation.standing_internal,
    standingGap: nation.standing_external - nation.standing_internal,
    standingTrend: Number(lastStanding?.payload.delta ?? 0),
    intelAvailable: nation.intelligence_capacity,
    intelCommitted: 0,
    economyAvailable: nation.economy,
    economyCommitted: 0,
    economyTrend: Number(economyEvents.at(-1)?.payload.delta ?? 0),
    force: forceOf(nation),
    supply: nation.supply,
  };
}

export interface ReputationEntry {
  tick: number;
  eventId: string;
  copy: string;
  kind: "signed" | "honoured" | "broken" | "leaked";
}

export interface RelationRow {
  nationId: string;
  name: string;
  status: NationStatus;
  pactsWithYou: string[];
  pactsAmongOthers: string[];
  record: ReputationEntry[];
}

export function relationshipBoard(match: MatchRecord, you: string): RelationRow[] {
  return Object.values(match.world.nations)
    .filter((n) => n.id !== you)
    .map((n) => {
      const visible = knownPacts(match, you);
      const pactsWithYou = visible
        .filter((p) => p.parties.includes(n.id) && p.parties.includes(you))
        .map((p) => `${p.public_terms.title} (${p.status})`);
      const pactsAmongOthers = visible
        .filter((p) => p.parties.includes(n.id) && !p.parties.includes(you))
        .map((p) => `${p.public_terms.title} (${p.status})`);
      const record: ReputationEntry[] = match.events
        .filter((e) => eventVisibleTo(e, you))
        .filter((e) => e.subject_ids.includes(n.id) || e.actor_id === n.id)
        .flatMap((e) => reputationFrom(e, n.id))
        .slice(-8)
        .reverse();
      return {
        nationId: n.id,
        name: n.name,
        status: n.status,
        pactsWithYou,
        pactsAmongOthers,
        record,
      };
    });
}

function reputationFrom(event: GameEvent, nationId: string): ReputationEntry[] {
  if (event.type === "pact.signed" && event.subject_ids.includes(nationId)) {
    return [{ tick: event.tick, eventId: event.id, copy: "Signed an instrument", kind: "signed" }];
  }
  if (event.type === "pact.breached" && event.actor_id === nationId) {
    return [{ tick: event.tick, eventId: event.id, copy: "Broke an obligation", kind: "broken" }];
  }
  if (event.type === "pact.broken" && event.actor_id === nationId) {
    return [{ tick: event.tick, eventId: event.id, copy: "Renounced an instrument", kind: "broken" }];
  }
  if (event.type === "pact.leaked" && event.subject_ids.includes(nationId)) {
    return [
      {
        tick: event.tick,
        eventId: event.id,
        copy: "A secret understanding came into other hands",
        kind: "leaked",
      },
    ];
  }
  return [];
}

export function obligationsOnTerritory(match: MatchRecord, nationId: string, territoryId: string): Pact[] {
  const territory = match.world.territories[territoryId];
  if (!territory) return [];
  return knownPacts(match, nationId).filter((pact) => {
    const clauses = [
      ...pact.public_terms.obligations,
      ...(pact.parties.includes(nationId) || pact.visible_to.includes(nationId)
        ? pact.private_terms.obligations
        : []),
    ];
    return clauses.some(
      (o) =>
        o.target === territoryId ||
        o.target === territory.owner ||
        o.target === territory.controller ||
        o.target === `territory:${territoryId}`,
    );
  });
}

export function tradeExposure(match: MatchRecord, nationId: string) {
  const routes = match.world.tradeRoutes.filter((r) => r.from === nationId || r.to === nationId);
  const counterparties = routes.map((r) => (r.from === nationId ? r.to : r.from));
  const names = match.world.nations;
  return {
    routes: routes.map((r) => ({
      id: r.id,
      open: r.open,
      counterparty: names[r.from === nationId ? r.to : r.from]?.name ?? (r.from === nationId ? r.to : r.from),
      youSupply: r.from === nationId,
    })),
    dependOn: counterparties.map((id) => names[id]?.name ?? id),
  };
}

export function alignmentPairs(match: MatchRecord, nationId: string): Array<{ a: string; b: string; title: string; secret: boolean }> {
  return knownPacts(match, nationId)
    .filter((p) => p.status === "active")
    .flatMap((p) => {
      const pairs: Array<{ a: string; b: string; title: string; secret: boolean }> = [];
      for (let i = 0; i < p.parties.length; i++) {
        for (let j = i + 1; j < p.parties.length; j++) {
          pairs.push({
            a: p.parties[i]!,
            b: p.parties[j]!,
            title: p.public_terms.title,
            secret: p.secret,
          });
        }
      }
      return pairs;
    });
}
