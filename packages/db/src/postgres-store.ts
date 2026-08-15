import pg from "pg";
import type { GameEvent, Order, WorldState } from "@cabinet/sim";
import type { CableMessage, MatchRecord, MatchStore } from "./types.ts";

/**
 * Postgres-backed store. Used by the tick worker in staging/prod.
 * Local development uses MemoryStore unless DATABASE_URL is set.
 */
export class PostgresStore implements MatchStore {
  private pool: pg.Pool;

  constructor(url: string) {
    this.pool = new pg.Pool({ connectionString: url, max: 4 });
  }

  async createMatch(record: MatchRecord): Promise<MatchRecord> {
    await this.pool.query(
      `insert into match (id, scenario_id, seed, status, tick, world_state)
       values ($1,$2,$3,$4,$5,$6)`,
      [record.id, record.scenarioId, record.seed, record.status, record.world.tick, record.world],
    );
    return record;
  }

  async getMatch(id: string): Promise<MatchRecord | null> {
    const { rows } = await this.pool.query(`select * from match where id = $1`, [id]);
    const row = rows[0] as { world_state: WorldState; scenario_id: string; seed: number; status: MatchRecord["status"] } | undefined;
    if (!row) return null;
    const events = await this.pool.query(`select * from event where match_id = $1 order by tick, id`, [id]);
    return {
      id,
      scenarioId: row.scenario_id,
      seed: row.seed,
      status: row.status,
      world: row.world_state,
      events: events.rows as GameEvent[],
      orders: [],
      channels: [],
      messages: [],
      lastSeenTick: {},
    };
  }

  async listMatches(): Promise<MatchRecord[]> {
    const { rows } = await this.pool.query(`select id from match`);
    const out: MatchRecord[] = [];
    for (const row of rows as Array<{ id: string }>) {
      const match = await this.getMatch(row.id);
      if (match) out.push(match);
    }
    return out;
  }

  async saveMatch(record: MatchRecord): Promise<void> {
    await this.pool.query(
      `update match set tick = $2, status = $3, world_state = $4 where id = $1`,
      [record.id, record.world.tick, record.status, record.world],
    );
  }

  async enqueueOrder(matchId: string, order: Order): Promise<void> {
    await this.pool.query(
      `insert into order_queue (id, match_id, nation_id, payload, submitted_tick, seq)
       values ($1,$2,$3,$4,$5,$6)`,
      [order.id, matchId, order.nationId, order, order.payload.submitted_tick ?? 0, order.seq],
    );
  }

  async claimOrders(matchId: string, workerId: string): Promise<Order[]> {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      await client.query("select pg_advisory_xact_lock(hashtext($1))", [matchId]);
      const { rows } = await client.query(
        `update order_queue
         set claimed_at = now(), claimed_by = $2
         where id in (
           select id from order_queue
           where match_id = $1 and consumed_at is null
           order by seq
           for update skip locked
         )
         returning payload`,
        [matchId, workerId],
      );
      await client.query("commit");
      return rows.map((r: { payload: Order }) => r.payload);
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  }

  async markConsumed(matchId: string, orderIds: string[]): Promise<void> {
    if (orderIds.length === 0) return;
    await this.pool.query(
      `update order_queue set consumed_at = now() where match_id = $1 and id = any($2)`,
      [matchId, orderIds],
    );
  }

  async appendEvents(matchId: string, events: GameEvent[]): Promise<void> {
    for (const event of events) {
      await this.pool.query(
        `insert into event (id, match_id, tick, type, actor_id, subject_ids, payload, visibility_rule, cause_event_id)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          event.id,
          matchId,
          event.tick,
          event.type,
          event.actor_id,
          event.subject_ids,
          event.payload,
          event.visibility_rule,
          event.cause_event_id,
        ],
      );
    }
  }

  async addMessage(message: CableMessage): Promise<void> {
    await this.pool.query(
      `insert into message (id, channel_id, match_id, author_nation_id, body, quote_of, created_tick)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [
        message.id,
        message.channelId,
        message.matchId,
        message.authorNationId,
        message.body,
        message.quoteOf,
        message.createdTick,
      ],
    );
  }
}
