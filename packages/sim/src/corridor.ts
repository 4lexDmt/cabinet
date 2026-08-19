/**
 * Integer corridor graph. No coordinates. Empty graph means formations
 * still teleport in one tick — the sixteen catalog scenarios stay valid.
 */

import type { Corridor, Tuning } from "./types.ts";

export function monthOf(tick: number, tuning: Tuning): number {
  const start = tuning.start_month ?? 1;
  const per = Math.max(1, tuning.ticks_per_month ?? 4);
  return ((((start - 1) + Math.trunc(tick / per)) % 12) + 12) % 12 + 1;
}

export function corridorOpen(corridor: Corridor, month: number): boolean {
  if (corridor.capacity === 0) return false;
  const closed = corridor.closed_months ?? [];
  return !closed.includes(month);
}

export function travelTicksBetween(
  corridors: Record<string, Corridor>,
  from: string,
  to: string,
  month: number,
): number | null {
  if (from === to) return 0;
  let best: number | null = null;
  for (const corridor of Object.values(corridors)) {
    if (!corridorOpen(corridor, month)) continue;
    if ((corridor.from === from && corridor.to === to) || (corridor.from === to && corridor.to === from)) {
      if (best === null || corridor.travel_ticks < best) best = corridor.travel_ticks;
    }
  }
  return best;
}

/**
 * Deterministic Dijkstra on integer travel_ticks. Returns location ids
 * including origin and destination, or null if unreachable this month.
 */
export function shortestPath(
  corridors: Record<string, Corridor>,
  origin: string,
  destination: string,
  month: number,
): string[] | null {
  if (origin === destination) return [origin];
  const adj = new Map<string, Array<{ node: string; ticks: number; id: string }>>();
  const ids = Object.keys(corridors).sort();
  for (const id of ids) {
    const corridor = corridors[id];
    if (!corridor || !corridorOpen(corridor, month)) continue;
    const a = adj.get(corridor.from) ?? [];
    a.push({ node: corridor.to, ticks: corridor.travel_ticks, id });
    adj.set(corridor.from, a);
    const b = adj.get(corridor.to) ?? [];
    b.push({ node: corridor.from, ticks: corridor.travel_ticks, id });
    adj.set(corridor.to, b);
  }
  for (const [, list] of adj) {
    list.sort((x, y) => (x.node < y.node ? -1 : x.node > y.node ? 1 : x.id < y.id ? -1 : 1));
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string>();
  const seen = new Set<string>();
  dist.set(origin, 0);

  while (true) {
    let current: string | null = null;
    let best = Infinity;
    for (const [node, cost] of dist) {
      if (seen.has(node)) continue;
      if (cost < best || (cost === best && (current === null || node < current))) {
        best = cost;
        current = node;
      }
    }
    if (current === null) break;
    if (current === destination) break;
    seen.add(current);
    const edges = adj.get(current) ?? [];
    const here = dist.get(current) ?? Infinity;
    for (const edge of edges) {
      const next = here + edge.ticks;
      const existing = dist.get(edge.node);
      if (existing === undefined || next < existing || (next === existing && current < (prev.get(edge.node) ?? ""))) {
        dist.set(edge.node, next);
        prev.set(edge.node, current);
      }
    }
  }

  if (!dist.has(destination)) return null;
  const path = [destination];
  let cursor = destination;
  const guard = new Set<string>();
  while (cursor !== origin) {
    if (guard.has(cursor)) return null;
    guard.add(cursor);
    const step = prev.get(cursor);
    if (!step) return null;
    path.push(step);
    cursor = step;
  }
  path.reverse();
  return path;
}

export function graphHasCorridors(corridors: Record<string, Corridor> | undefined): boolean {
  return Boolean(corridors && Object.keys(corridors).length > 0);
}
