import { MemoryStore, PostgresStore, type MatchStore } from "@cabinet/db";
import { advanceMatch } from "@cabinet/runtime";

const INTERVAL_MS = Number(process.env.TICK_INTERVAL_MS ?? 10 * 60 * 1000);
const WORKER_ID = process.env.WORKER_ID ?? "tick-worker-1";
const DATA_FILE = process.env.CABINET_DATA ?? new URL("../../../.data/cabinet.json", import.meta.url).pathname;

export function createStore(): MatchStore {
  if (process.env.DATABASE_URL) return new PostgresStore(process.env.DATABASE_URL);
  return new MemoryStore(DATA_FILE);
}

export async function loopOnce(store: MatchStore): Promise<void> {
  const matches = await store.listMatches();
  for (const match of matches.filter((m) => m.status === "active")) {
    const result = await advanceMatch(store, match.id, WORKER_ID);
    console.log(
      JSON.stringify({
        msg: "tick.complete",
        matchId: match.id,
        tick: result.tick,
        durationMs: result.durationMs,
        events: result.events.length,
      }),
    );
  }
}

export async function runLoop(): Promise<void> {
  const store = createStore();
  console.log(
    JSON.stringify({
      msg: "worker.start",
      intervalMs: INTERVAL_MS,
      backend: process.env.DATABASE_URL ? "postgres" : "memory",
    }),
  );
  for (;;) {
    try {
      await loopOnce(store);
    } catch (err) {
      console.error(JSON.stringify({ msg: "tick.error", error: String(err) }));
    }
    await sleep(INTERVAL_MS);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
