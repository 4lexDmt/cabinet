import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { GameEvent, Order } from "@cabinet/sim";
import type { CableMessage, MatchRecord, MatchStore } from "./types.ts";

interface FileShape {
  matches: Record<string, MatchRecord>;
}

export class MemoryStore implements MatchStore {
  constructor(private readonly filePath: string) {}

  private read(): FileShape {
    try {
      return JSON.parse(readFileSync(this.filePath, "utf8")) as FileShape;
    } catch {
      return { matches: {} };
    }
  }

  private write(data: FileShape): void {
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async createMatch(record: MatchRecord): Promise<MatchRecord> {
    const data = this.read();
    data.matches[record.id] = record;
    this.write(data);
    return record;
  }

  async getMatch(id: string): Promise<MatchRecord | null> {
    return this.read().matches[id] ?? null;
  }

  async listMatches(): Promise<MatchRecord[]> {
    return Object.values(this.read().matches);
  }

  async saveMatch(record: MatchRecord): Promise<void> {
    const data = this.read();
    data.matches[record.id] = record;
    this.write(data);
  }

  async enqueueOrder(matchId: string, order: Order): Promise<void> {
    const data = this.read();
    const match = data.matches[matchId];
    if (!match) throw new Error(`unknown match ${matchId}`);
    match.orders.push({ ...order, consumed: false });
    this.write(data);
  }

  async claimOrders(matchId: string, _workerId: string): Promise<Order[]> {
    const data = this.read();
    const match = data.matches[matchId];
    if (!match) return [];
    return match.orders.filter((o) => !o.consumed).map(({ consumed: _c, ...order }) => order);
  }

  async markConsumed(matchId: string, orderIds: string[]): Promise<void> {
    const data = this.read();
    const match = data.matches[matchId];
    if (!match) return;
    const set = new Set(orderIds);
    for (const order of match.orders) {
      if (set.has(order.id)) order.consumed = true;
    }
    this.write(data);
  }

  async appendEvents(_matchId: string, _events: GameEvent[]): Promise<void> {
    // Events live on the match record and are written by saveMatch.
  }

  async addMessage(message: CableMessage): Promise<void> {
    const data = this.read();
    const match = data.matches[message.matchId];
    if (!match) throw new Error(`unknown match ${message.matchId}`);
    match.messages.push(message);
    this.write(data);
  }
}
