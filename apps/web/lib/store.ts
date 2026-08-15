import { MemoryStore, PostgresStore, type MatchStore } from "@cabinet/db";
import path from "node:path";

const globalForStore = globalThis as { __cabinetStore?: MatchStore };

export function getStore(): MatchStore {
  if (!globalForStore.__cabinetStore) {
    if (process.env.DATABASE_URL) {
      globalForStore.__cabinetStore = new PostgresStore(process.env.DATABASE_URL);
    } else {
      const file = process.env.CABINET_DATA ?? path.join(process.cwd(), "../../.data/cabinet.json");
      globalForStore.__cabinetStore = new MemoryStore(file);
    }
  }
  return globalForStore.__cabinetStore;
}
