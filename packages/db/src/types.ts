import type { GameEvent, Order, WorldState } from "@cabinet/sim";

export interface QueuedOrder extends Order {
  consumed: boolean;
}

export interface CableMessage {
  id: string;
  channelId: string;
  matchId: string;
  authorNationId: string;
  body: string;
  quoteOf: string | null;
  createdTick: number;
}

export interface Channel {
  id: string;
  matchId: string;
  kind: "public" | "group" | "dm" | "backchannel";
  memberNationIds: string[];
  title: string;
}

export interface MatchRecord {
  id: string;
  scenarioId: string;
  seed: number;
  status: "lobby" | "active" | "closed";
  world: WorldState;
  events: GameEvent[];
  orders: QueuedOrder[];
  channels: Channel[];
  messages: CableMessage[];
  lastSeenTick: Record<string, number>;
}

export interface MatchStore {
  createMatch(record: MatchRecord): Promise<MatchRecord>;
  getMatch(id: string): Promise<MatchRecord | null>;
  listMatches(): Promise<MatchRecord[]>;
  saveMatch(record: MatchRecord): Promise<void>;
  enqueueOrder(matchId: string, order: Order): Promise<void>;
  claimOrders(matchId: string, workerId: string): Promise<Order[]>;
  markConsumed(matchId: string, orderIds: string[]): Promise<void>;
  appendEvents(matchId: string, events: GameEvent[]): Promise<void>;
  addMessage(message: CableMessage): Promise<void>;
}
