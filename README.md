# Cabinet

Persistent multiplayer geopolitical strategy. The interface is **read, not operated**. Combat, when it exists, resolves in the background and is reported as documents. There is no unit UI.

## Raw index (allowlisted fetch)

GitHub’s directory tree is JavaScript. Fetchers that only follow `github.com`, `raw.githubusercontent.com`, `api.github.com`, and `codeload.github.com` should use these URLs — they list every nested file.

- https://raw.githubusercontent.com/4lexDmt/cabinet/main/FETCH.md
- https://raw.githubusercontent.com/4lexDmt/cabinet/main/files.json
- https://raw.githubusercontent.com/4lexDmt/cabinet/main/README.md
- https://github.com/4lexDmt/cabinet/archive/refs/heads/main.zip
- https://codeload.github.com/4lexDmt/cabinet/zip/refs/heads/main
- https://api.github.com/repos/4lexDmt/cabinet/git/trees/main?recursive=1

`FETCH.md` is a plain-text list of `raw.githubusercontent.com` URLs, one per source file, including Next.js `(game)` paths as `%28game%29`.

This repository implements **M0 (foundation)** and **M1 (the pact loop)** from the handoff: a deterministic tick, structured pacts, standing with a full ledger, data-driven effects, and the sixteen catalog tables as config. It also ships the **map domain**: a pure geometry package, an offline tile pipeline, and the atlas at `/atlas` (published on aevanormap.com).

## Run it

```bash
npm install
npm test          # blocking: determinism, pact predicates, belief isolation, scenarios, map guards
npm run dev       # Next.js on :3000
```

Open `/`, pick a table from the catalog, sit as a nation (the rail switches chairs for local playtest). Draft an instrument, transmit a cable, resolve a sitting.

The atlas — a sheet you can read from any government's desk — is at `/atlas`. Kashmir is the default sheet: one geometry, three readings of the Line of Control.

The tick worker is a **standalone Node process**, not serverless:

```bash
npm run dev:worker
```

Default interval is 10 minutes (`TICK_INTERVAL_MS`). The web rail also has **Resolve this sitting** so a table can move without waiting.

## Layout

```
apps/web            Next.js — orders in, projections out; atlas at /atlas
apps/tick-worker    long-lived loop, Dockerfile for Railway/Fly
packages/sim        PURE tick(state, orders, seed) — no I/O, no Date, no Math.random
packages/geo        PURE geometry, projection, POV — no I/O, never imported by sim
packages/rules      effect JSON + advisor templates, Zod-validated
packages/scenarios  Sixteen catalog tables — config, not code (optional geo block)
packages/db         SQL migration + memory/postgres stores
packages/runtime    I/O edge that calls sim.tick
infra/tiles         offline geodata pipeline; output in apps/web/public/geo/mapkit
```

`packages/sim` does not depend on `packages/db`. `packages/sim` does not depend on `packages/geo`.

## Map

See `docs/atlas.md` and `infra/tiles/README.md`.

- `/atlas` is the cartographic instrument. `aevanormap.com` is the same page at `/`, via a host rewrite — one build, two front doors.
- Perspective is a restyle, not a refetch. An EEZ is not territory. Planted intel paints identically to genuine intel.
- Tile generation is an offline build step. It never runs at request time.

## Postgres

Apply `packages/db/migrations/001_initial.sql` on Supabase. Set `DATABASE_URL` to switch the worker and web store off the local `.data/cabinet.json` file. The `event` table is append-only (trigger rejects UPDATE/DELETE). `nation.force` is not stored — it is derived from economy, internal standing, and supply.

## What is deliberately not here yet

M2 irreversible mobilisation, M3 combat outcome vectors, M4 planted intel that is indistinguishable until discovery, M5 exile/delegation, M6 monetization. The architecture for those is in `.cursorrules` and `docs/`.

Do not add unit micromanagement. Do not let advisors read world truth. Do not resolve a war in a single tick.
