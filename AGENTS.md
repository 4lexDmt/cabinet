# PROJECT CONTEXT

Persistent multiplayer geopolitical strategy game. The core loop is social:
players negotiate, form binding agreements, deceive each other, and betray
each other. Combat resolves in the background from stats and is reported as
written documents. There is NO unit micromanagement anywhere.

## Non-negotiable architectural rules

1. DETERMINISM. The tick worker is a single long-lived process with seeded
   RNG and strictly ordered resolution. Same seed + same orders MUST produce
   byte-identical state. Never introduce concurrency into tick resolution.
   Never use Math.random() in simulation code — use the injected seeded RNG.
   Never use Date.now() in simulation code — use the tick number.

2. SERVER AUTHORITY. Clients submit ORDERS. Clients never mutate state.
   Any client-supplied value is untrusted input.

3. WORLD TRUTH vs BELIEF ARE SEPARATE. `world_state` is authoritative truth.
   `belief_state[nation_id]` is what each nation THINKS is true and may be
   FALSE. Advisors and briefings read ONLY from belief_state. There must be
   zero code paths from advisor rendering to world truth. This is enforced by
   test and is the single most important invariant in the codebase.

4. PACTS ARE STRUCTURED DATA, NOT TEXT. Agreements are objects with
   machine-evaluable terms. If the pact evaluator can't check it, it isn't a
   pact — it's just chat. Betrayal detection depends entirely on this.

5. EVERY STATE MUTATION EMITS AN ATTRIBUTED EVENT. No silent changes. A player
   must always be able to open a ledger and see exactly why a value moved.
   Unexplained numbers destroy trust in the simulation, and this is a game
   about trust.

6. EVENT LOG IS APPEND-ONLY. Never update or delete rows in `event`. All
   narrative output (after-action reports, briefings, chronicles) is a
   PROJECTION over the event log filtered by the reader's belief state.

7. FORCE IS DERIVED. Never set a nation's `force` directly. It is computed
   from economy, standing, and supply. This is the design made literal.

8. SCENARIOS ARE CONFIG, NOT CODE. Adding a scenario must require zero engine
   changes. If a scenario needs bespoke logic, the abstraction is wrong — fix
   the abstraction, don't special-case the scenario.

9. HONESTY RULE. A player's own after-action reports and internal stats are
   TRUTHFUL BUT FRAMED — emphasis and ordering differ per side, facts never
   do. Only intelligence ABOUT OTHERS may be false. If the UI lies to a
   player, they stop trusting the interface instead of the other players and
   the social game dies.

10. ADVISORS SPEAK AT CABINET SCALE. "Three formations massing at the
    frontier." Never "your operative Ivan infiltrated the ministry."
    Personal-scale espionage in a strategic-vantage game is a known failure
    mode. No advisor template may reference individual agents.

## Stack

- TypeScript everywhere, strict mode
- Postgres via Supabase (jsonb for terms/effects/payloads)
- Next.js App Router on Vercel — API routes + client
- Tick worker: standalone Node process on Railway or Fly. NOT serverless.
- Realtime: Supabase Realtime for event and briefing push
- Queue: Postgres table with SELECT ... FOR UPDATE SKIP LOCKED
- Tests: Vitest. Determinism tests are mandatory and run in CI.

## Conventions

- Simulation code is PURE: (state, orders, seed) => (newState, events).
  No I/O, no clock, no randomness outside the injected RNG.
- Persistence lives at the edges. The simulation never touches the DB.
- Effect rules, advisor templates, and scenarios are DATA (JSON), loaded and
  validated at runtime with Zod. Never hardcode game rules in TypeScript.
- All money/standing/economy values are integers. No floats in game state.
- Name things after the domain: `pact`, `breach`, `briefing`, `standing`,
  `belief`, `formation`. Not `contract`, `violation`, `notification`.

## Map domain boundary

packages/sim MUST NOT import packages/geo, and MUST NOT contain coordinates,
projections, or geometry of any kind. The simulation knows territory IDs and
adjacency only. Geometry lives in packages/geo and is consumed by the web app.

Tile generation is an OFFLINE build step in infra/tiles. It never runs at
request time and is never imported by the app.

An EEZ is NOT territory. Never render EEZ polygons with the land fill, and
never treat EEZ control as territorial control in game logic. Sovereign
waters are internal + territorial sea (12nm) only.

Planted beliefs must render identically to genuine beliefs at equal
confidence, on the map as everywhere else. No map layer, style expression,
or API response may expose source === "planted" to the observing nation.

Historical scenarios inherit physical layers and override political ones. A
scenario may not render a layer its era did not have: no EEZ before UNCLOS
enters force in 1994 (signed 1982), a 3nm territorial sea before 1982, no
flight information regions before 1947, and no motorway network before the
1950s.

## Never do

- Never put simulation logic in an API route or React component
- Never read world_state from advisor or briefing code
- Never let delegation/standing-orders break a pact or declare war —
  those must be human acts or betrayal loses its moral weight
- Never add unit micromanagement UI
- Never resolve combat in a single tick — engagements span multiple ticks

## Cursor Cloud specific instructions

Monorepo of npm workspaces (`apps/*`, `packages/*`), Node 22 / npm 10. The
startup update script runs `npm install`, so dependencies are already present.

Services (run each in its own long-lived terminal):

- Web app (`@cabinet/web`): `npm run dev` — Next.js (Turbopack) on port 3000.
  Routes of note: `/` (lobby), `/join`, `/briefing`, `/channels`, `/pacts`,
  `/atlas`.
- Tick worker (`@cabinet/tick-worker`): `npm run dev:worker` — a standalone
  long-lived Node loop (NOT serverless), run via `tsx`. It only logs
  `tick.complete` when a match with `status: "active"` exists.

Non-obvious gotchas:

- Storage defaults to a shared on-disk file store at `.data/cabinet.json`
  (git-ignored) when `DATABASE_URL` is unset. Both the web app and the tick
  worker read/write the SAME file, so a match created in the web UI is picked
  up and advanced by a running worker. Delete `.data/cabinet.json` to reset all
  game state. Postgres (Supabase, `packages/db/migrations/001_initial.sql`) is
  optional and not needed for local dev.
- The worker's default `TICK_INTERVAL_MS` is 600000 (10 min). Export a small
  value (e.g. `TICK_INTERVAL_MS=5000`) when you want to watch it tick locally.
  The web rail's "Resolve this sitting" button (POST `/api/tick`) advances a
  match on demand without waiting for the worker.
- Tests: `npm test` (Vitest, ~35s). The determinism suite
  (`packages/sim/test/determinism.test.ts`) alone runs ~34s (1000-tick hashes)
  — this is expected, not a hang.
- There is no ESLint/lint script. The nearest static check is a typecheck:
  `npx tsc --noEmit -p apps/web/tsconfig.json` (strict mode is on repo-wide).
- Offline map tiles under `apps/web/public/geo/mapkit` are built by
  `infra/tiles` (Python, offline) and are committed; do not rebuild them at
  request time.
