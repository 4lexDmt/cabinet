import pg from "pg";

export function createPgClient(url: string): pg.Pool {
  return new pg.Pool({ connectionString: url, max: 4 });
}
