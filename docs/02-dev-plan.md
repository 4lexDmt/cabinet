# DEVELOPMENT PLAN
### Milestones, acceptance criteria, and kill gates

**Assumed team:** one developer with AI tooling (Cursor, Claude Code), part-time. Durations reflect that. Halve them for a full-time team of two.

**Governing rule:** every milestone ends in something **playable by real humans**, and every milestone has a **kill criterion**. The design rests on several unproven assumptions. The plan's job is to test the riskiest ones as early and as cheaply as possible — which is why combat, the most expensive system, is deliberately fourth.

---

## Risk register — what the plan is actually testing

| # | Assumption | If false | Tested at |
|---|---|---|---|
| R1 | Signing and breaking formal pacts is fun **without combat** | Whole thesis dies | **M1** |
| R2 | Structured pacts don't feel bureaucratic vs. free chat | Core UX rework | M1 |
| R3 | Asymmetric AARs make both sides feel it was worth it | Combat needs redesign | M3 |
| R4 | Being deceived reads as *getting played*, not *broken game* | Belief system fails | M4 |
| R5 | Defeated players stay | Quit-cascade, same as CoN | M5 |
| R6 | Advisors-as-interface works at all (**unvalidated — nobody has shipped it**) | Monetization + UX both hit | M4 |
| R7 | Async persistent pacing sustains engagement | Format change | M5 |

R1 and R6 are the two that would force a fundamental rethink. R1 is tested in week 7. R6 is tested with a deliberate A/B in M4.

---

# M0 · FOUNDATION
**≈3 weeks · not playable**

**Goal:** deterministic tick loop running against real state, with nothing interesting happening yet.

**Deliverables**
- Repo, CI, environments (dev / staging / prod)
- Postgres schema v1: `nation`, `territory`, `pact`, `event`, `channel`, `message`, `scenario`
- Tick worker as a **single long-lived Node process** — seeded RNG, ordered resolution
- Order queue via Postgres `SKIP LOCKED`
- Append-only `event_log` with `visibility_rule`
- Scenario loader reading the config schema (even with one scenario)
- Auth + lobby join
- Structured logging, tick timing metrics

**Acceptance criteria**
- [ ] Same seed + same orders → byte-identical state after 1000 ticks, verified in CI
- [ ] Tick completes in <2s at 30 nations
- [ ] Killing the worker mid-tick loses no state; restart resumes cleanly
- [ ] Every state mutation has a corresponding attributed event row
- [ ] Scenario JSON change alters starting state with no code change

**Kill gate:** if determinism can't be guaranteed, stop and fix before anything else. A trust game with unexplainable outcomes is unrecoverable — every anomaly reads as cheating.

---

# M1 · THE PACT LOOP ★ CRITICAL GATE
**≈4 weeks · first playable — S-01 Sèvres**

The most important milestone in the project. Six people, one map, no armies.

**Deliverables**
- **Pact builder UI** — compose structured terms from a constrained vocabulary
- **Pact evaluator** — runs each tick, checks obligations against world state, emits `pact.breached`
- `public_terms` / `private_terms` divergence *(forced by S-02, cheap now)*
- Standing system: external + internal, with full attribution ledger
- Effect cascade engine, data-driven rules, depth cap 3
- Channels: private DM, group, public
- Immutable quotable messages with linkable references
- **Ledger view** — every standing change, its cause, and its source event
- S-01 Sèvres scenario config complete

**Acceptance criteria**
- [ ] A pact can be signed, secretly, visible only to signatories
- [ ] Breach is detected automatically within one tick
- [ ] Every standing delta traces to a named event in the ledger
- [ ] A third party can *discover* a secret pact through play
- [ ] Six humans complete a full Sèvres run in under 5 days

**Playtest protocol** — run S-01 at least **four times** with different groups. Rotate who plays Egypt and the US. Vary `secret_pact_leak_base_chance` across runs (0.04 / 0.08 / 0.15) and log which produces the most engagement.

**Instrumentation from day one:** messages per player per session · time-to-first-pact · betrayal rate · standing recovery curves · post-session sentiment by role

### 🚦 KILL GATE — R1
> If four sessions of Sèvres are not compelling **without any combat**, the core thesis is wrong. Do not proceed to M2. Either redesign the social layer or accept that this is a conventional strategy game with better diplomacy and re-plan accordingly.

This gate exists to save you six months. Take it seriously; the temptation to explain away a flat playtest and build combat anyway is the single most likely way this project fails.

---

# M2 · SCENARIO SYSTEM + TWO MORE TIER 0
**≈3 weeks · playable — S-05, S-06**

**Goal:** prove scenarios are genuinely config, and test two structurally different social situations.

**Deliverables**
- **S-05 The Concert** — validates defeated-player agency (Talleyrand). Direct precursor to exile play in M5.
- **S-06 July Crisis** — validates irreversible actions and cascade caps
- Irreversible action framework (mobilization as a one-way door)
- Conditional obligation chains (pacts that trigger other pacts)
- Scenario selection in lobby
- Post-game **chronicle** — narrative projection over the event log

**Acceptance criteria**
- [ ] Both scenarios ship with **zero engine code changes** — config only
- [ ] Cascade never exceeds depth 3; no unexplained state changes in logs
- [ ] France in S-05 wins at least one session out of four
- [ ] Chronicle is readable and players voluntarily share it

**Kill gate:** if either scenario needed engine changes, the scenario abstraction has failed. Fix it now — the entire content strategy depends on it.

---

# M3 · COMBAT + ASYMMETRIC REPORTING
**≈5 weeks · playable — S-07 Vietnam (reduced)**

**Deliverables**
- Formations, movement, supply state, terrain
- Combat resolution → multi-dimensional `outcome_vector`
- Asymmetric AAR generation: ranked by each side's gains, **truthful but framed**
- Domestic opinion as a modeled resource with its own event stream
- Asymmetric victory conditions
- Force as a **derived** value — never directly set
- S-07 Vietnam scenario config

**Acceptance criteria**
- [ ] No combat micro exists in the UI — orders are postures and objectives only
- [ ] Both sides of an engagement rate the outcome within 1.5 points on a 5-point "was that worth it" scale
- [ ] AAR contains no false statement — verified against world state in tests
- [ ] DRV can win without winning a single engagement
- [ ] Casualty *visibility* affects domestic standing more than casualty count

**Kill gate — R3:** if losers consistently rate engagements as unsatisfying, the asymmetric report has failed and you're back to conventional win/lose. Diagnose before proceeding.

---

# M4 · BELIEF, INTEL, ADVISORS
**≈5 weeks · playable — S-10 Arab-Israeli**

The epistemics milestone. Also where the riskiest unvalidated assumption gets tested.

**Deliverables**
- `belief_state` per nation, separate from world truth
- Intel operations: collection, verification, **planting**
- Disinformation writing false values into rival belief states
- Advisor system: condition-driven templates, tiered rendering, cabinet-scale voice only
- Confidence surfaced in the UI
- Advisors read **only** belief state, never world truth
- S-10 scenario config (1967 and 1973 variants)

**Acceptance criteria**
- [ ] A player can act on a false belief and later discover it
- [ ] Post-session survey: deceived players attribute failure to the *deceiver*, not the game
- [ ] No advisor line references individual agents or personal-scale operations
- [ ] Zero code paths let an advisor read world truth — enforced by test

### 🚦 R6 A/B TEST — do not skip
> Ship **two interfaces** to different cohorts: (A) advisor briefings only, (B) advisor briefings plus a raw data view of the same belief state.
>
> If cohort B ignores the advisors, **advisors are decoration** — and the monetization thesis, which prices advisor tiers, needs rebuilding before you commit further. Better to learn this in week 20 than at launch.

---

# M5 · DELEGATION + DEFEAT ★ RETENTION GATE
**≈4 weeks · playable — S-08 Afghanistan**

**Deliverables**
- Posture / standing-orders system
- Offline delegation with hard limits — **delegation can never break a pact or declare war**
- Login **briefing digest** — narrative projection since last session
- Defeat state machine: sovereign → rump / occupied → exile → client
- Exile play: no economy, no force, full comms, full intel, targets occupier's internal standing
- Multi-faction insurgency support
- **Broker role** (Pakistan/ISI pattern)
- S-08 scenario config

**Acceptance criteria**
- [ ] A player offline 12 hours is not eliminated and returns to a coherent digest
- [ ] Delegation cannot produce a betrayal — verified by test
- [ ] An exiled player can measurably degrade an occupier's internal standing
- [ ] **≥40% of defeated players remain active for 3+ days after defeat**
- [ ] Broker can skim and misreport in both directions

**Kill gate — R5:** the defeated-player retention number is the single most important metric in the project. Below 20% and you have CoN's quit-cascade with extra steps, and the persistent-world premise doesn't hold.

---

# M6 · IDENTITY + MONETIZATION
**≈4 weeks**

**Deliverables**
- Social trees — capabilities, not economic modifiers
- Advisor tiering and purchase flow
- Chronicle export and sharing
- Reputation persistence across matches
- Vacancy handling: AI takeover with visible flagging, or backfill inheriting nation **and reputation**

**Monetization guardrail.** Every review corpus in this genre puts pay-to-win as complaint number one, and the peak reported emotional moment is *beating someone who paid*. Sell **interpretation and convenience** — better analysis, faster briefings, richer archives. Keep **raw intel earnable through play**, so a strong social operator can always out-scheme a spender. Protect that, deliberately, in the tuning.

**Acceptance criteria**
- [ ] A free player has beaten a paying player in playtest, repeatedly
- [ ] No purchase grants information unobtainable through play

---

# M7 · SCALE
**≈6 weeks · S-13 Cold War**

- 30-player lobbies, tick performance at scale
- Nuclear threshold (direct principal engagement = scenario-wide loss)
- Season / era structure
- Full Cold War config

**Acceptance criteria**
- [ ] Tick <5s at 30 nations with 200 active pacts
- [ ] Players can hold a working mental model of the table — measure via a "name who you trust" survey

---

# Timeline

| Milestone | Weeks | Cumulative |
|---|---|---|
| M0 Foundation | 3 | 3 |
| **M1 Pact Loop** ★ | 4 | **7** |
| M2 Scenarios | 3 | 10 |
| M3 Combat | 5 | 15 |
| M4 Belief | 5 | 20 |
| **M5 Delegation + Defeat** ★ | 4 | **24** |
| M6 Monetization | 4 | 28 |
| M7 Scale | 6 | 34 |

**Week 7 is the real milestone.** Everything before it is scaffolding; everything after it is only worth building if week 7 says yes.

---

## Recruiting playtesters

You need ~8 reliable people from M1 onward. The strongest source is the existing demand this design was derived from: **HOI4 roleplay multiplayer communities** — the ones already throttling their game to speed 1 to make room for negotiation. They are your exact audience, they are organized on Discord, and they will tell you bluntly whether the pact loop works.

Approach them at M1 with a playable Sèvres, not with a design document.

---

## Standing decisions to revisit

1. **Lobby size** — 12–30. Test the bottom first; density is easier to add than remove.
2. **Persistent vs. seasonal** — likely persistent world with periodic eras that partially reset standing. Decide by M6.
3. **Vacancy handling** — backfill-with-inherited-reputation is more interesting than AI takeover, and more brutal. Test both in M6.
4. **Secret pact leak chance** — tuned empirically in M1. This one number sets the paranoia level of the entire game.
