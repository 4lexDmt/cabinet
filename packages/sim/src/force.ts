import type { Nation } from "./types.ts";

/**
 * Force is derived. Never written onto nation.
 * economy × (50 + internal standing) × supply / 10_000, floored.
 */
export function forceOf(nation: Nation): number {
  if (nation.status === "exile") return 0;
  const raw = nation.economy * (50 + nation.standing_internal) * nation.supply;
  return Math.max(0, Math.trunc(raw / 10_000));
}
