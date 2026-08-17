import { MemoryStore, PostgresStore, type MatchStore } from "@cabinet/db";
import os from "node:os";
import path from "node:path";

const globalForStore = globalThis as { __cabinetStore?: MatchStore };

/**
 * Serverless platforms (Vercel) ship a read-only filesystem outside `/tmp`.
 * Without DATABASE_URL, the memory store must live in a writable, per-instance
 * scratch directory rather than the deployed bundle — otherwise the first
 * write throws and the request 500s instead of rendering. This does not
 * persist across cold starts or separate instances; it exists so a missing
 * DATABASE_URL degrades to "state resets unexpectedly" rather than
 * "the site is down."
 */
function defaultDataFile(): string {
  if (process.env.CABINET_DATA) return process.env.CABINET_DATA;
  if (process.env.VERCEL) return path.join(os.tmpdir(), "cabinet.json");
  return path.join(process.cwd(), "../../.data/cabinet.json");
}

export function getStore(): MatchStore {
  if (!globalForStore.__cabinetStore) {
    if (process.env.DATABASE_URL) {
      globalForStore.__cabinetStore = new PostgresStore(process.env.DATABASE_URL);
    } else {
      if (process.env.VERCEL) {
        console.warn(
          "[cabinet] DATABASE_URL is not set. Falling back to an ephemeral /tmp store — " +
            "match state will not persist across deployments or cold starts. Set DATABASE_URL " +
            "(Supabase) in the Vercel project for real persistence.",
        );
      }
      globalForStore.__cabinetStore = new MemoryStore(defaultDataFile());
    }
  }
  return globalForStore.__cabinetStore;
}
