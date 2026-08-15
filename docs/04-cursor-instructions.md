# CURSOR BUILD INSTRUCTIONS
### Repo structure, conventions, and implementation sequence

Paste the **Project Context** block into `.cursorrules` (or `AGENTS.md`) at repo root. Work the milestones in order. Do not skip ahead — M1 is a kill gate, and building M3 before validating M1 risks five months of work on an unvalidated premise.

---

# `.cursorrules` — paste this

```
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

## Never do

- Never put simulation logic in an API route or React component
- Never read world_state from advisor or briefing code
- Never let delegation/standing-orders break a pact or declare war —
  those must be human acts or betrayal loses its moral weight
- Never add unit micromanagement UI
- Never resolve combat in a single tick — engagements span multiple ticks
```

---

# Repo structure

```
/
├── apps/
│   ├── web/                     # Next.js — client + API routes
│   │   ├── app/
│   │   │   ├── (game)/
│   │   │   │   ├── briefing/    # the retention loop screen
│   │   │   │   ├── pacts/
│   │   │   │   ├── channels/
│   │   │   │   ├── ledger/
│   │   │   │   └── map/
│   │   │   └── api/
│   │   │       ├── orders/      # order submission (validate + enqueue)
│   │   │       └── projections/ # read models
│   │   └── components/
│   │
│   └── tick-worker/             # standalone, single instance
│       ├── src/
│       │   ├── loop.ts          # the tick loop
│       │   └── main.ts
│       └── Dockerfile
│
├── packages/
│   ├── sim/                     # PURE simulation — the heart
│   │   ├── src/
│   │   │   ├── tick.ts          # orchestrates resolution phases
│   │   │   ├── phases/
│   │   │   │   ├── 01-orders.ts
│   │   │   │   ├── 02-movement.ts
│   │   │   │   ├── 03-combat.ts
│   │   │   │   ├── 04-pacts.ts       # evaluator
│   │   │   │   ├── 05-effects.ts     # cascade engine
│   │   │   │   ├── 06-intel.ts       # belief propagation
│   │   │   │   └── 07-briefings.ts
│   │   │   ├── rng.ts           # seeded, injected
│   │   │   └── types.ts
│   │   └── test/
│   │       └── determinism.test.ts   # MANDATORY
│   │
│   ├── rules/                   # DATA — no logic
│   │   ├── effects/*.json
│   │   ├── advisors/*.json
│   │   └── schema/              # Zod validators
│   │
│   ├── scenarios/
│   │   ├── sevres-1956.json
│   │   ├── vienna-1815.json
│   │   └── july-crisis-1914.json
│   │
│   └── db/
│       ├── migrations/
│       └── client.ts
│
└── .cursorrules
```

**The key structural point:** `packages/sim` is pure and has no dependency on `packages/db`. It takes state in and returns state and events out. This is what makes determinism testable and what keeps the tick worker replaceable.

---

# M0 — Foundation

### Prompt 1 — schema

> Create the initial Postgres migration for a persistent multiplayer strategy game. Tables: `scenario`, `match`, `nation`, `territory`, `formation`, `pact`, `event`, `belief`, `channel`, `message`, `order_queue`, `posture`, `advisor_state`.
>
> Requirements:
> - `event` is append-only — add a trigger that raises on UPDATE or DELETE
> - `pact` has separate `public_terms` and `private_terms` jsonb columns, plus `secret bool`, `visible_to uuid[]`, `status`, `broken_by`, `broken_tick`
> - `belief` has `observer_nation_id`, `subject_type`, `subject_id`, `field`, `believed_value jsonb`, `confidence numeric`, `source enum('direct_observation','ally_share','purchased_intel','inference','planted')`, `last_updated_tick`
> - `nation.force` is a generated/derived column or is documented as write-only-by-simulation
> - `order_queue` supports SKIP LOCKED consumption with `claimed_at`, `claimed_by`
> - Index for the hot paths: pacts by match+status, beliefs by observer, events by match+tick
>
> Add RLS policies: a player can only read events whose `visibility_rule` includes their nation, and can only read beliefs where they are the observer.

### Prompt 2 — pure simulation core

> In `packages/sim`, create the pure simulation core.
>
> `tick(state: WorldState, orders: Order[], seed: number): { state: WorldState, events: GameEvent[] }`
>
> It must be a pure function — no I/O, no Date, no Math.random. Create a seeded PRNG in `rng.ts` (xorshift or PCG) that is injected into the tick context.
>
> Structure the tick as ordered phases in `phases/`, each with the signature `(ctx: TickContext) => void`, run in this fixed order: orders → movement → combat → pacts → effects → intel → briefings.
>
> Every state mutation must push a `GameEvent` onto `ctx.events` with `type`, `actor_id`, `subject_ids`, `payload`, and `visibility_rule`. Add a dev-mode assertion that fails if state changes without a corresponding event.

### Prompt 3 — determinism test

> Write `packages/sim/test/determinism.test.ts`.
>
> Generate 1000 random orders across 30 nations with a fixed seed. Run `tick` 1000 times sequentially. Serialize the final state deterministically (sorted keys) and hash it. Run the identical sequence again in a fresh process and assert the hashes match.
>
> Add a second test that runs the same sequence with the phases' internal iteration order deliberately shuffled, and asserts the result CHANGES — proving order actually matters and the test isn't vacuous.
>
> Wire both into CI as a blocking check.

### Prompt 4 — tick worker

> Create `apps/tick-worker` as a standalone Node process.
>
> Loop: claim pending orders from `order_queue` using `SELECT ... FOR UPDATE SKIP LOCKED`, load match state, call `sim.tick()`, persist new state and append events in a single transaction, mark orders consumed, push events over Supabase Realtime.
>
> Requirements:
> - Advisory lock so only ONE worker processes a given match — concurrency here corrupts determinism
> - Crash-safe: if the process dies mid-tick, the transaction rolls back and orders remain claimable
> - Emit tick duration metrics
> - Configurable tick interval, default 10 minutes
>
> Add a Dockerfile. This deploys to Railway or Fly, never to serverless.

---

# M1 — The pact loop ★ critical gate

### Prompt 5 — pact evaluator

> Implement the pact evaluator in `packages/sim/src/phases/04-pacts.ts`.
>
> A pact's `terms` contain an `obligations` array. Each obligation has `party`, `must` (a predicate name), `target`, and optional parameters. Implement a registry of predicates: `not_move_forces_into`, `maintain_trade_route`, `not_declare_war_on`, `share_intelligence_on`, `provide_passage`, `pay_tribute`.
>
> Each tick, evaluate every active pact's obligations against world state. On violation, emit `pact.breached` with the breaching party and the specific obligation violated, and set `status='broken'`, `broken_by`, `broken_tick`.
>
> Critically: obligations must be evaluated against WORLD TRUTH, not belief. Whether other players *learn* about the breach is decided separately by the event's `visibility_rule`. A secret breach is still a breach.
>
> Write tests covering each predicate, plus a test that a secret pact's breach is not visible to non-signatories.

### Prompt 6 — effect cascade

> Implement the data-driven effect cascade in `phases/05-effects.ts`.
>
> Load effect rules from `packages/rules/effects/*.json`. Each rule: `trigger` (event type), optional `condition` (expression over state), `effects` (array of `{target, delta}`), and `emits` (derived event types).
>
> Process: for each event this tick, find matching rules, apply deltas, emit derived events. Derived events re-enter the cascade. **Hard cap the cascade at depth 3** and log a warning if the cap is hit.
>
> Every applied delta emits its own attributed event so the ledger can reconstruct causation. Write a `standing.changed` event with `cause_event_id` pointing at what triggered it.
>
> Validate all rule files against a Zod schema at startup — fail fast on malformed rules.

### Prompt 7 — pact composer UI

> Build the pact composer in `apps/web`.
>
> Players select a pact type, add obligations from a constrained vocabulary, set duration, mark secret or public, and choose signatories. As clauses are added, render them as **formal treaty prose** in a document view that assembles itself — the player should feel like they're drafting an instrument, not filling in a form.
>
> Support divergent `public_terms` and `private_terms` — a UI toggle between "what the world sees" and "what we actually agreed."
>
> Signing requires all parties to accept. Until then it's a draft visible only to invited parties.
>
> No form-like styling. Serif body type, document furniture, generous margins.

### Prompt 8 — standing ledger

> Build the standing ledger view. Every change to a nation's `standing_external` and `standing_internal`, in reverse chronological order, each row showing: the delta, the cause event, the actor responsible, and the tick.
>
> This must be COMPLETE — every point of standing movement traceable. Style it as an accounting register, not a stats panel.
>
> Add a drill-down: clicking a row shows the full causal chain back to the root event, using `cause_event_id`.

### Prompt 9 — scenario loader

> Implement the scenario loader. It reads a scenario JSON, validates with Zod, and produces initial match state: nations with starting values, territories with ownership, starting pacts, victory conditions, and tuning parameters.
>
> Implement victory condition evaluation as a data-driven predicate tree supporting `all_of`, `any_of`, `gte`, `lte`, `control`, `status_not`, `retain`.
>
> Then create `packages/scenarios/sevres-1956.json` per the scenario catalog: 6 nations, the tuning block including `secret_pact_leak_base_chance`, and asymmetric victory conditions per nation.
>
> Add a test asserting the scenario loads and produces valid state with zero engine changes.

---

# M2 → M7 — prompt seeds

Work these in order; each assumes the prior milestone shipped.

**M2 — irreversible actions**
> Implement an irreversible action framework. Some orders, once submitted, cannot be cancelled and trigger obligation cascades automatically. Model mobilization in the July Crisis scenario: submitting it locks the order, starts a countdown, and fires `mobilization.began`, which cascades through defensive pacts forcing allied mobilization. Add the confirmation flow — this must feel weighty, with an explicit typed confirmation.

**M3 — combat and asymmetric reports**
> Implement combat resolution producing a multi-dimensional `outcome_vector` — never a win/lose scalar. Then implement AAR generation: for each participant, rank the vector's dimensions by that side's gain, and render a report leading with their strongest dimensions. Both reports must be factually identical and differ only in emphasis and ordering. Write a test asserting no AAR contains a statement contradicted by world state.

**M4 — belief and disinformation**
> Implement belief propagation. Direct observation writes high-confidence beliefs. Intel operations write beliefs with `source='purchased_intel'`. Disinformation writes DELIBERATELY FALSE values with `source='planted'` into a target's belief state. Then implement advisor rendering that reads ONLY belief state. Add a lint rule or architecture test that fails the build if advisor code imports world state.

**M5 — delegation and defeat**
> Implement postures and offline delegation. A posture defines engagement rules and delegation scope. Enforce at the type level that delegation can NEVER break a pact or declare war. Then implement the defeat state machine: sovereign → rump/occupied → exile → client. Exile nations retain full comms and intel capability but have zero economy and zero force, and can target the occupier's `standing_internal`.

**M6 — briefing digest**
> Implement the briefing digest — a narrative projection over events since the player's last session, filtered by belief state and framed by advisors. This is the highest-leverage screen in the product. It must be substantial and worth reading, and it must never surface information the player's belief state doesn't contain.

---

# Testing priorities

Ordered by what actually breaks the game:

1. **Determinism** — blocking CI check, non-negotiable
2. **Belief isolation** — architecture test that no advisor/briefing path reads world truth
3. **Pact evaluator** — every predicate, plus secret-breach visibility
4. **Event completeness** — no state mutation without an attributed event
5. **Delegation limits** — cannot break pacts or declare war, enforced by test
6. **AAR truthfulness** — no report contradicts world state
7. **Scenario isolation** — every scenario loads with zero engine changes
8. **Cascade depth** — never exceeds 3

Tests 1, 2 and 5 protect invariants that are unrecoverable if violated in production. Treat failures in those as build-stopping.

---

# First week checklist

- [ ] Repo scaffolded, `.cursorrules` in place
- [ ] Migration 001 applied, event-log immutability trigger verified
- [ ] `packages/sim` with pure `tick()` and seeded RNG
- [ ] Determinism test green in CI
- [ ] Tick worker deployed and running against staging
- [ ] One nation, one territory, one tick, one event in the log

That last line is the real milestone. Once a tick produces an attributed event deterministically, everything else is content.
