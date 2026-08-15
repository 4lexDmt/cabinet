# Cabinet

Persistent multiplayer geopolitical strategy. The interface is **read, not operated**. Combat, when it exists, resolves in the background and is reported as documents. There is no unit UI.

This repository implements **M0 (foundation)** and **M1 (the pact loop)** from the handoff: a deterministic tick, structured pacts, standing with a full ledger, data-driven effects, and the sixteen catalog tables as config.

## Run it

```bash
npm install
npm test          # blocking: determinism, pact predicates, belief isolation, scenarios
npm run dev       # Next.js on :3000
```

Open `/`, pick a table from the catalog, sit as a nation (the rail switches chairs for local playtest). Draft an instrument, transmit a cable, resolve a sitting.

The tick worker is a **standalone Node process**, not serverless:

```bash
npm run dev:worker
```

Default interval is 10 minutes (`TICK_INTERVAL_MS`). The web rail also has **Resolve this sitting** so a table can move without waiting.

## Layout

```
apps/web            Next.js — orders in, projections out
apps/tick-worker    long-lived loop, Dockerfile for Railway/Fly
packages/sim        PURE tick(state, orders, seed) — no I/O, no Date, no Math.random
packages/rules      effect JSON + advisor templates, Zod-validated
packages/scenarios  Sixteen catalog tables — config, not code
packages/db         SQL migration + memory/postgres stores
packages/runtime    I/O edge that calls sim.tick
```

`packages/sim` does not depend on `packages/db`.

## Postgres

Apply `packages/db/migrations/001_initial.sql` on Supabase. Set `DATABASE_URL` to switch the worker and web store off the local `.data/cabinet.json` file. The `event` table is append-only (trigger rejects UPDATE/DELETE). `nation.force` is not stored — it is derived from economy, internal standing, and supply.

## What is deliberately not here yet

M2 irreversible mobilisation, M3 combat outcome vectors, M4 planted intel that is indistinguishable until discovery, M5 exile/delegation, M6 monetization. The architecture for those is in `.cursorrules` and `docs/`.

Do not add unit micromanagement. Do not let advisors read world truth. Do not resolve a war in a single tick.
