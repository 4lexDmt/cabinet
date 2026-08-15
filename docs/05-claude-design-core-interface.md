# CLAUDE DESIGN — CORE INTERFACE PACK
### The game shell, map, resources, and every screen outside the document layer

Companion to `03-claude-design-prompts.md`. That pack covered the core design system and **scenario skins**. This one covers the **game itself** — everything that gets reskinned per scenario but exists in all of them.

Run the Core System brief from doc 03 first. Everything here inherits from it.

---

# Framing to include in every prompt

## The player's verbs

The "no unit micromanagement" rule is a constraint, not an absence. Players still act constantly. The full verb set:

| Verb | Examples | Reversible? |
|---|---|---|
| **Read** | briefing, after-action report, ledger, belief inspector | — |
| **Write** | messages, pact drafts, intelligence orders | yes |
| **Set** | posture, doctrine, delegation scope, objectives | yes |
| **Spend** | intelligence capacity, economic output | yes |
| **Commit** | sign a pact, launch an operation, mobilize, breach | **no** |

Design consequence: **commits need weight and everything else needs to be fast.** A message should take two taps. Signing a treaty should feel like signing a treaty.

## The resource shape — three inputs, one output

This is the most commonly misread part of the design, so state it explicitly in any resource prompt:

- **Standing** (external + internal) — a *condition*, not a currency. You can't spend it, you can only spend *against* it.
- **Intelligence** — a *budget*. Spent per cycle on operations.
- **Economy** — a *budget*. Spent on construction, subsidy, coercion.
- **Force** — **derived output.** Never set directly. It is what economy, standing and supply produce.

The resource display must therefore **not** be four equal gauges. Three things you act on, one thing that results. If a player looks at the interface and tries to "buy army," the design has failed.

## Platform

The check-in loop is ambient and mobile — breakfast, lunch, evening. **Design mobile first for reading and messaging**, desktop for map work, pact drafting, and intelligence planning. The briefing digest must be fully usable on a phone.

---

# A · SHELL AND NAVIGATION

> Design the application shell for a persistent multiplayer geopolitical strategy game. Players check in several times a day for 5–15 minutes, plus longer sessions for planning.
>
> Six top-level destinations: **Briefing** (home), **Map**, **Channels**, **Pacts**, **Nation**, **Ledger**.
>
> Requirements:
> - Mobile-first. On a phone the shell must make "what changed, and what needs me" answerable in under ten seconds.
> - A persistent **time presence** — this is a real-time persistent world with a tick cadence. Show the current tick and time-to-next without turning it into a countdown that creates anxiety. It should read like a clock on an office wall, not a bomb timer.
> - A **status line** showing the player's nation and its current status (sovereign / rump / occupied / client / exile). Status changes must be impossible to miss.
> - Attention markers on destinations that have something new, differentiated by *kind*: a message waiting is not the same as a pact breached.
>
> Avoid: bottom tab bars with generic icons, hamburger menus, dashboard-widget layouts. This should feel like a desk you return to, not an app you launch.
>
> Deliver: mobile shell, desktop shell, time presence component, status line, attention marker system.

> **Alerts and notifications.** Design the alert system. Four severities, each with a distinct treatment: *informational* (a trade completed), *notable* (a pact was signed nearby), *urgent* (your obligation is about to lapse), *critical* (you have been attacked / a pact you signed was breached).
>
> Critical alerts must be able to interrupt. Everything else accumulates into the briefing.
>
> Write the copy for eight example alerts. Institutional register — the interface reports, it does not exclaim. "Border violation reported in Sinai," not "⚠️ You're under attack!"

---

# B · THE MAP SYSTEM

The map is a **reference instrument**, not a control panel. Players issue strategic orders through it — move a formation, target an operation — but never tactical ones.

## B1 — Base map

> Design the base map for a geopolitical strategy game covering a global or regional theatre.
>
> Requirements:
> - Territory as **vector regions with political ownership**, not a hex or tile grid. Borders carry meaning: recognized, disputed, occupied, and ceasefire lines must all render differently.
> - Legible at three zooms: theatre (whole scenario), regional (a front or bloc), local (a single territory and its neighbours).
> - Readable on a phone. This is the hardest constraint — solve it first, then expand to desktop.
> - No decorative terrain rendering. No photorealistic topography. Terrain appears as **annotation** where it affects outcomes — mountain, marsh, strait, desert — in the manner of a staff map, not a landscape.
>
> The map's job is to answer: who holds what, what is contested, and where am I exposed.
>
> Deliver: theatre / regional / local zoom states, border taxonomy, territory selection state.

## B2 — The belief overlay ★ signature problem

> This is the most important and most difficult screen in the product. Design the map's **belief rendering**.
>
> In this game the player does not see truth. They see **what their nation believes**, which may be wrong. Every piece of information has a confidence level and a provenance — directly observed, shared by an ally, purchased, inferred, or *planted by an enemy*.
>
> Design a map treatment that communicates:
> - **Confirmed** — directly observed recently, high confidence
> - **Stale** — was confirmed, but not recently. Show *when* it was last confirmed.
> - **Inferred** — derived, not observed
> - **Contested** — two sources disagree, and the player should feel that friction
>
> **Critical constraint, do not violate it:** *planted* intelligence must render **identically** to genuine intelligence of the same confidence level. The interface may never hint that a belief was fabricated. If the UI tips deception, the entire disinformation system is worthless. The player finds out by being wrong, not by looking carefully.
>
> Design the reveal state too: what the map looks like immediately after a belief is disproven. It must read as *you were deceived*, never as *the software was wrong*.
>
> Deliver: four confidence treatments on the map, a stale-information timestamp system, the contested-source state, the post-revelation state.

## B3 — Overlays

> Design a layer system for the map. The base political layer plus four toggleable overlays, each answering a different question:
>
> 1. **Alignment** — who is aligned with whom, how firmly, and who is contested or non-aligned. This is not territory; it's dependency and influence. Essential for Cold War scale.
> 2. **Economy** — trade routes as connections, chokepoints, supply lines, and *dependency* — which nations can strangle which others.
> 3. **Force disposition** — where military weight sits. Abstracted: concentrations and axes, not unit counters. A player must never be able to click an individual unit.
> 4. **Intelligence** — where you have coverage and where you are blind. The blindness is the point.
>
> Layers must be switchable in one gesture on mobile and combinable on desktop.
>
> Deliver: all four overlays, the layer switcher, a combined desktop view.

## B4 — Territory detail

> Design the territory detail panel — what opens when a player selects a region.
>
> Contents: owner and how they got it, resource yield, terrain modifiers, supply state, forces present *as far as the player believes*, unrest, and its role in any active pact obligations.
>
> The pact linkage matters: a player must be able to see "this territory is covered by the non-aggression clause I signed with France" directly from the map. Obligations should be discoverable from geography, not just from the pact registry.
>
> Deliver: detail panel, mobile sheet variant, obligation linkage treatment.

---

# C · RESOURCES AND THE FOUR PILLARS

## C1 — The pillar display

> Design the primary resource display. Read the "three inputs, one output" framing above and encode it visually.
>
> - **Standing** — dual value, external and internal. A *condition*, not a currency. Design it as a pair of related readings that can diverge; the gap between how much others trust you and how well your own nation holds together is meaningful information.
> - **Intelligence** — a spendable per-cycle budget, with committed and uncommitted portions visible.
> - **Economy** — a spendable budget with the same treatment.
> - **Force** — **derived.** It must be visually distinct from the other three so it reads as a *result*, not a lever. Consider showing it with its inputs attached, so a player can see *why* it is what it is.
>
> Include trend direction for each. A player checking in should immediately see which way things are moving.
>
> Deliver: full desktop pillar panel, compact mobile strip, the Force-as-derived treatment, trend indicators.

## C2 — Economy detail

> Design the economic view. Not a city-builder screen — this is about **dependency and exposure**.
>
> Show: territory yields, active trade routes and their counterparties, what each route carries, which routes are chokepointed, and — most importantly — **which other nations you depend on and which depend on you.**
>
> The signature element: a dependency reading that makes strangulation legible. A player should be able to see at a glance that cutting one route would cripple a rival, or that a rival could cripple them.
>
> Deliver: economy overview, trade route detail, dependency view.

## C3 — Intelligence allocation

> Design the intelligence budget allocation screen. Each cycle a player distributes finite intelligence capacity across: **collection** (learn what's true), **counter-intelligence** (protect your own beliefs from being planted), **verification** (raise confidence on something you already believe), and **operations** (act — including disinformation).
>
> The tension to surface: spending everything on collection leaves you open to deception; spending everything on counter-intelligence leaves you blind. Make that trade-off felt in the layout, not just stated.
>
> Deliver: allocation interface, committed-vs-available states, mobile variant.

---

# D · NATION AND IDENTITY

> **Nation dossier.** Design the screen where a player sees their own nation: name, status, standing, capabilities unlocked, advisors retained, and current objectives.
>
> This is the player's identity in the game — it should feel like a national file, not a character sheet. No RPG stat blocks.

> **Social capability tree.** Design the progression interface. Critical framing: this tree grants **social capabilities**, not economic modifiers. Nodes are things like *deniable operations*, *the right to broker multilateral pacts*, *access to third-party intelligence markets*, *treaty enforcement mechanisms*.
>
> Nations differ not by how strong they are but by **what kind of liar, broker, or enforcer they can be.** The tree's shape should communicate that — this is a diagram of institutional character, not a shopping list of bonuses.
>
> Avoid game-tree conventions: no glowing nodes, no tier rows, no "+15%" labels. Consider an organizational or doctrinal diagram instead.
>
> Deliver: tree view, node detail, locked vs. available vs. taken states.

> **Objectives tracker.** Design the victory-condition display. Conditions are **asymmetric** — your opponents are not playing for the same thing you are, and in some scenarios you can see their conditions and in others you cannot.
>
> Show your own conditions with progress, and what you *believe* about others' conditions with appropriate uncertainty. A condition you've inferred about a rival should look different from one you know.

---

# E · THE DIPLOMACY SURFACE

This is where the game actually happens. It deserves more design attention than the map.

> **Channels.** Design the messaging interface: private direct channels, group channels, and public broadcast.
>
> Requirements:
> - **Messages are permanent and quotable.** Players need to hold each other to what was said. Design a native quote-and-reference system so a player can pull a prior statement into a new conversation as evidence, with unambiguous attribution and timestamp. Screenshots-as-evidence is a beloved behaviour in social games — support it properly instead of forcing it into screenshots.
> - Group channel membership must be **visible and precise**. Who can read this is a strategic fact.
> - A public broadcast should feel materially different from a private message — a declaration, not a chat.
>
> Design for mobile first. Most negotiation will happen on a phone.
>
> Deliver: channel list, conversation view, quote-as-evidence component, public broadcast composer, mobile variants.

> **Relationship board.** Design a view of the diplomatic landscape: every nation, your relationship with them, their pact obligations to you and to others *as far as you know*, and their reputation history.
>
> The signature element: **a reputation record built from actual events** — pacts signed, pacts honoured, pacts broken, with dates. Not an opinion score. A player's trustworthiness should be an auditable record that others can read, because that's what makes betrayal cost something.
>
> Deliver: relationship board, per-nation reputation record, "who is aligned with whom" summary.

> **Pact registry.** Design the archive of agreements: active, expired, fulfilled, and broken. Broken pacts must be prominent and permanent — the record of betrayal is the game's memory.
>
> Include a filter for "pacts I know exist but am not party to," since discovering secret agreements is a core intelligence outcome.

---

# F · INTELLIGENCE

> **Belief inspector.** Promote this from the Arab-Israeli scenario to a core screen — every scenario needs it.
>
> Design a view where a player examines their own intelligence picture item by item: what they believe, how confident they are, where it came from, and when it was last updated. Provenance categories: directly observed, shared by an ally, purchased, inferred, unverifiable.
>
> Again: **planted information must be indistinguishable from genuine information at the same confidence.** The player's defence is not visual inspection — it's counter-intelligence spending, source triangulation, and judgement about who told them.
>
> Design the contradiction state: two sources disagree. This is the most interesting moment in the system and deserves its own treatment.
>
> Deliver: belief inspector, provenance taxonomy, contradiction state, item detail with source history.

> **Operations composer.** Design the interface for ordering intelligence work: collect on a target, verify an existing belief, protect a belief of your own, or **plant** a false belief in a rival's picture.
>
> The planting flow is the sharpest thing in the game and needs the most care. The player is composing a *lie for someone else to believe* — they specify the target, the false value, and the delivery route, and they see the estimated chance it takes hold and the chance it's traced back to them.
>
> Attribution risk is the key tension. Design it as the dominant variable.
>
> Deliver: operations composer, planting flow, attribution risk display, operation status tracking.

---

# G · MILITARY, WITHOUT MICRO

> Design the military interface for a game with **no unit micromanagement**. Players set doctrine and objectives; the simulation resolves everything else.
>
> **Formation overview:** the player's forces as a small number of named formations with disposition, supply state, and morale. Formations are moved between territories and assigned postures. There is no army composition editor, no division designer, no battle screen.
>
> **Doctrine and posture:** the actual controls. A player sets doctrine (how their forces fight), engagement rules (what they do when contacted), and objectives (what they're trying to achieve). These are the strategic verbs.
>
> **After-action archive:** all past engagement reports, readable and searchable. These are documents, designed per the core system. This is where military depth lives — in the reading, not the operating.
>
> Deliver: formation overview, doctrine/posture setter, AAR archive, mobile variants.

---

# H · DELEGATION

> Design the standing-orders interface — what a player configures before going offline, since this is a persistent world that runs while they sleep.
>
> Components: doctrine, engagement rules (if attacked / if an ally is attacked / if a border is violated), delegation scope (what advisors may decide without you), and wake conditions (what is important enough to alert you).
>
> **Hard constraint to make visible in the design:** delegation can *never* break a pact or declare war. Those are human acts only. The interface should show this boundary explicitly, as a stated limit on what you're handing over — it's reassuring, and it teaches the rule.
>
> The design challenge: this is a configuration screen that must not feel like one. Frame it as **instructions to your cabinet** — written orders, in the institutional voice of the scenario.
>
> Deliver: posture composer, delegation scope with visible limits, wake conditions, a plain-language summary of "what will happen while I'm away."

---

# I · DEFEAT STATES

> Design the interfaces for the four non-sovereign statuses. **Critical framing: these are different interfaces, not degraded ones.** A defeated player who opens a broken version of the normal UI will quit, and player retention after defeat is the single most important metric in the product.
>
> - **Rump state** — reduced territory and force, full diplomatic capability. Emphasis shifts toward alliance-seeking.
> - **Occupied** — no economy, no force, full communications. The interface's centre of gravity moves to the occupier's *internal standing*, which is now your target.
> - **Client** — resources flow through a patron. Design the dependency relationship as the dominant element, including what you owe and what leverage you retain.
> - **Exile** — no territory, no economy, no army. Full communications and full intelligence. **This interface should feel sharper than the sovereign one, not emptier.** Fewer instruments, each more precise: correspondence, favours owed, knowledge of others' disagreements, and the ability to make your conqueror ungovernable.
>
> Design the transition moment too — the screen a player sees when their status changes. It must read as *your role has changed*, not *you have lost*. This screen is doing more retention work than any other in the product.
>
> Deliver: four status interfaces, the status-transition screen, exile's operations view.

---

# J · ENTRY AND ONBOARDING

> **Lobby and scenario selection.** Design scenario browsing: historical setting, player count, expected duration, and which systems it exercises. Each scenario needs a brief that conveys the *situation*, not just the date.
>
> **Nation selection.** The hard part: roles are **asymmetric and unequal**. Someone plays Czechoslovakia in 1938. Someone plays the exiled French delegation in 1815. The selection screen must make the weak roles *appealing* by showing what makes them interesting — their instruments, their asymmetric victory condition — rather than presenting them as the leftovers.
>
> Deliver: scenario browser, scenario brief, nation selection with asymmetric role framing, waiting room.

> **Onboarding.** This genre's largest barrier is comprehension — the reference points in this space famously drown new players in systems. This design has fewer controls but more *conceptual* load: the difference between truth and belief, structured agreements versus casual talk, victory as perception.
>
> **Use the advisors as the tutorial.** They're already the interface; make them the teacher. A new player's first briefing is their advisors explaining the situation, and the first session teaches by having them do three things: read a briefing, send a message, and sign one pact.
>
> Do not build a separate tutorial mode. Do not build tooltips over a full interface. The first session is a real, small scenario.
>
> Design the first-session flow and the three teaching moments. Write the advisor copy for each — institutional voice, no hand-holding tone, no exclamation marks.

---

# K · POST-GAME

> **Chronicle.** Design the narrative record produced at the end of a match: what happened, told as history, drawn from the event log and written from the reading player's perspective — including the things they got wrong.
>
> Players should want to share this unprompted. It is the primary organic growth mechanism, and research on this genre shows players take real pleasure in *reading other players' accounts*, not only producing their own.
>
> Design it to read well **outside the game entirely** — as a shareable document that makes sense to someone who wasn't there.
>
> Include: the arc of the match, key pacts and their fates, the player's own decisive moments, and a "what you believed vs. what was true" section, which is where the deception system pays off emotionally.
>
> Deliver: chronicle document, shareable card, the belief-vs-truth section.

---

# COPY AND VOICE — brief this everywhere

Words are design material here more than in most products, because the game is largely read.

- **The interface reports; it does not exclaim.** "Border violation reported in Sinai." Never "You're under attack!"
- **Institutional register, scenario-appropriate.** A 1956 despatch does not sound like a 1962 situation report does not sound like an 1815 memorandum.
- **Errors don't apologize and are never vague.** State what happened and what to do.
- **Empty states are invitations.** An exile with no territory should see an interface that suggests what they *can* do, not a series of zeroes.
- **An action keeps its name through the whole flow.** If the button says *Sign*, the confirmation says *Signed*, and the ledger entry says *Signed*.
- **Name things as players experience them.** Not `standing_external` but *how much others trust you*. Not `belief_state` but *your intelligence picture*.

---

# Screen inventory — build order

| Priority | Screens | Needed by |
|---|---|---|
| **1** | Shell, channels, pact composer, standing ledger, relationship board | M1 |
| **2** | Base map, territory detail, pillar display, objectives | M1–M2 |
| **3** | Formation overview, doctrine/posture, AAR archive | M3 |
| **4** | Belief overlay, belief inspector, operations composer, intel allocation | M4 |
| **5** | Delegation, briefing digest, defeat state interfaces | M5 |
| **6** | Social tree, lobby, onboarding, chronicle | M6 |

**Priority 1 is the entire M1 kill gate.** Six people negotiating with no map and no armies is a valid test — if you had to cut the map from M1 to ship faster, the test would still be sound.
