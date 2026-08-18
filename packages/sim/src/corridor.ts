/**
 * Integer corridor graph. Pathfinding lives here so movement never sees
 * geometry: nodes are territory (or transfer) IDs, costs are ticks.
 */

import type { Corridor } from "./types.ts";

export interface CorridorPath {
  cost: number;
  steps: string[];
}

interface Edge {
  to: string;
  cost: number;
  id: string;
}

function adjacency(corridors: readonly Corridor[]): Map<string, Edge[]> {
  const graph = new Map<string, Edge[]>();
  const add = (from: string, to: string, cost: number, id: string) => {
    const list = graph.get(from) ?? [];
    list.push({ to, cost, id });
    graph.set(from, list);
  };
  for (const corridor of corridors) {
    add(corridor.a, corridor.b, corridor.travel_ticks, corridor.id);
    add(corridor.b, corridor.a, corridor.travel_ticks, corridor.id);
  }
  for (const list of graph.values()) {
    list.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : a.to < b.to ? -1 : a.to > b.to ? 1 : 0));
  }
  return graph;
}

/**
 * Deterministic Dijkstra. Equal costs tie-break on corridor id, then node id.
 * Returns null when no path exists.
 */
export function shortestCorridorPath(
  corridors: readonly Corridor[],
  from: string,
  to: string,
): CorridorPath | null {
  if (from === to) return { cost: 0, steps: [] };
  const graph = adjacency(corridors);
  if (!graph.has(from) || !graph.has(to)) return null;

  const dist = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, { via: string; corridorId: string }>();
  const visited = new Set<string>();

  while (true) {
    let best: string | null = null;
    let bestCost = Infinity;
    let bestTie = "";
    for (const [node, cost] of dist) {
      if (visited.has(node)) continue;
      if (cost < bestCost || (cost === bestCost && node < bestTie)) {
        best = node;
        bestCost = cost;
        bestTie = node;
      }
    }
    if (best === null) break;
    if (best === to) break;
    visited.add(best);
    for (const edge of graph.get(best) ?? []) {
      const next = bestCost + edge.cost;
      const existing = dist.get(edge.to);
      const existingId = prev.get(edge.to)?.corridorId ?? "\uFFFF";
      const better =
        existing === undefined ||
        next < existing ||
        (next === existing && (edge.id < existingId || (edge.id === existingId && edge.to < (prev.get(edge.to)?.via ?? "\uFFFF"))));
      if (better) {
        dist.set(edge.to, next);
        prev.set(edge.to, { via: best, corridorId: edge.id });
      }
    }
  }

  const cost = dist.get(to);
  if (cost === undefined) return null;
  const steps: string[] = [];
  let cursor: string | undefined = to;
  while (cursor && cursor !== from) {
    const hop = prev.get(cursor);
    if (!hop) return null;
    steps.push(hop.corridorId);
    cursor = hop.via;
  }
  steps.reverse();
  return { cost, steps };
}
