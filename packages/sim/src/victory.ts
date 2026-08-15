import type { WorldState } from "./types.ts";

export type VictoryNode =
  | { all_of: VictoryNode[] }
  | { any_of: VictoryNode[] }
  | { gte: [string, number] }
  | { lte: [string, number] }
  | { control: string }
  | { status_not: string }
  | { retain: string }
  | { flag_eq: [string, number | string | boolean] };

export function evaluateVictory(state: WorldState, nationId: string, node: VictoryNode): boolean {
  if ("all_of" in node) return node.all_of.every((child) => evaluateVictory(state, nationId, child));
  if ("any_of" in node) return node.any_of.some((child) => evaluateVictory(state, nationId, child));
  if ("gte" in node) return numericPath(state, nationId, node.gte[0]) >= node.gte[1];
  if ("lte" in node) return numericPath(state, nationId, node.lte[0]) <= node.lte[1];
  if ("control" in node) {
    const id = node.control.replace(/^territory:/, "");
    return state.territories[id]?.controller === nationId;
  }
  if ("status_not" in node) {
    return state.nations[nationId]?.status !== node.status_not;
  }
  if ("retain" in node) {
    const value = state.flags[node.retain];
    return value === true || value === 1 || value === nationId;
  }
  if ("flag_eq" in node) {
    return state.flags[node.flag_eq[0]] === node.flag_eq[1];
  }
  return false;
}

function numericPath(state: WorldState, nationId: string, path: string): number {
  if (path.includes(".")) {
    const [id, field] = path.split(".");
    const nation = id ? state.nations[id] : undefined;
    if (!nation || !field) return 0;
    return numericPath(state, nation.id, field);
  }
  const nation = state.nations[nationId];
  if (!nation) return 0;
  if (path === "standing_external") return nation.standing_external;
  if (path === "standing_internal") return nation.standing_internal;
  if (path === "economy") return nation.economy;
  const flag = state.flags[path];
  return typeof flag === "number" ? flag : 0;
}
