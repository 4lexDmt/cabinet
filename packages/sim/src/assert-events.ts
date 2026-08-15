import type { TickContext } from "./types.ts";
import { stableStringify } from "./serialize.ts";

const IGNORED = new Set(["tick", "lastEventSeq"]);

export function assertNoSilentMutations(ctx: TickContext): void {
  if (ctx.mutationCount > ctx.events.length) {
    throw new Error(
      `silent mutation: ${ctx.mutationCount} writes but only ${ctx.events.length} events`,
    );
  }
  const before = strip(ctx.baseline);
  const after = strip(ctx.state);
  if (stableStringify(before) === stableStringify(after)) return;
  if (ctx.mutationCount === 0 || ctx.events.length === 0) {
    throw new Error("state changed without an attributed event");
  }
}

function strip(state: TickContext["state"]): unknown {
  const copy = { ...state } as Record<string, unknown>;
  for (const key of IGNORED) delete copy[key];
  return copy;
}
