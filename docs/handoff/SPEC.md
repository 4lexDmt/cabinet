# CABINET — DESIGN SPECIFICATION

**A design system for a persistent multiplayer geopolitical strategy game.**
Revision 1.0 · 15 August 2026

---

## 0. The premise engineering must hold

This game is **read, not operated.** The player's primary interaction is reading a
briefing and writing a message. Combat resolves in the background and is reported
as written after-action documents.

Three consequences that are not negotiable:

1. **There is no unit UI.** No unit cards, no formation editors, no battle screens,
   no counters on a map. If a ticket produces one, the ticket has misread the game.
2. **There is no agent-scale espionage.** Advisors and intelligence speak at cabinet
   level. Never "your operative in the ministry."
3. **Casualties are documentary, never score.** No leaderboards of the dead, no
   kill/loss ratios, no celebratory framing. Report figures because they are the
   record.

Typography and document design are the core craft. Treat the interface as a desk
with papers on it, not a dashboard with widgets.

---

## 1. What is in this handoff

```
handoff/
  tokens.css        Canonical design tokens. The single source of truth.
  SPEC.md           This document.
Core System.dc.html     Component sheet + example briefing screen
Briefing Digest.dc.html Cross-screen: the returning-player red box
Standing Ledger.dc.html Cross-screen: auditable reputation register
Pact Composer.dc.html   Cross-screen: drafting a structured instrument
Chronicle.dc.html       Cross-screen: post-game narrative export
```

Every `.dc.html` file opens directly in a browser. The design markup is the
template inside `<x-dc>…</x-dc>`; the surrounding runtime is a preview harness
you can delete when porting. **All styles are inline literals** — this was a
constraint of the authoring environment, not a recommendation. When porting,
replace those literals with the custom properties in `tokens.css`; the values
correspond exactly.

---

## 2. Type

| Role | Family | License | Used for |
|---|---|---|---|
| Serif | Source Serif 4 | OFL | Briefings, despatches, all reading text |
| Condensed sans | Archivo Narrow | OFL | Classifications, labels, table heads |
| Mono | IBM Plex Mono | OFL | Cables, telemetry, references, timestamps |

All three are open-source and safe to self-host. Do not substitute Inter, Roboto,
or any grotesque for the sans — the condensed width is doing semantic work.

### The one rule that matters

**Mono means a machine produced it. Serif means a person wrote it.**

A timestamp, a document reference, a coordinate, a telex body, a computed
number: mono. A briefing paragraph, a treaty clause, a player's message: serif.
Getting this wrong destroys the fiction faster than any colour mistake.

### Scale

See `--t-*` in `tokens.css`. Ratio 1.2 off a 17px body.

- Body is **17px / 1.62**. It is not 16 and not 15. These documents run long.
- Measure is capped at **68 characters** (`--measure-body`). Wider and it stops
  reading like a document.
- Nothing informational sits below **11px**.
- The condensed sans is never longer than five words. If a label needs a
  sentence, it is body text.

---

## 3. Colour

Neutrals do the work: three paper stocks, four desk greys, four inks, three
rules. Then **four semantic accents and no more.**

| Token | Hex | Means |
|---|---|---|
| `--alliance` | `#2C5A66` | Pacts in force, guarantees honoured, aligned |
| `--hostility` | `#8C332A` | Declared hostility, threat, classification stamps |
| `--uncertainty` | `#8A6D24` | Contested, unconfirmed, expiring |
| `--breach` | `#6E3A5E` | Obligation broken, secret leaked, belief planted |

Rules:

- Accents appear as **ink, hairlines, and marginal rules**. They never fill a
  card, never sit behind body text.
- Never more than **two accents on one sheet**.
- `--hostility` and `--breach` are deliberately unlike each other. Betrayal is
  not war and must not read as war.
- No gradients as decoration. No glow. No shadow that is not a paper edge.
- Paper does not have rounded corners. `--radius-control: 2px` exists only for
  controls the player touches.

---

## 4. The confidence model

This is the system's central mechanic and the part most likely to be
implemented wrong. **Confidence is a property of a claim, never of a player.**
Two players looking at the same territory may see two different renderings and
neither is wrong.

```ts
type Confidence = 'confirmed' | 'probable' | 'unverified' | 'planted';

type Provenance =
  | { kind: 'own';        asset: string }       // you observed it
  | { kind: 'ally';       party: PartyId }      // an ally gave it to you
  | { kind: 'purchased';  broker: PartyId }     // you bought it
  | { kind: 'open' }                            // public / broadcast
  | { kind: 'uncorroborated' };                 // single source, no support

interface Claim {
  id: string;                 // e.g. "INT-0912"
  text: string;
  confidence: Confidence;
  provenance: Provenance;
  observedAt: ISODateTime;    // drives staleness rendering
  actedUpon: boolean;         // was a decision taken on this claim?
}
```

### Rendering contract

| State | Ink | Glyph | Rule under claim | Map fill |
|---|---|---|---|---|
| `confirmed` | `--ink` | `■` **before** | none | solid wash, 2px solid border |
| `probable` | `--ink-2` | `◧` **after** | 1px solid `--ink-3` | 45° hatch, 1px solid border |
| `unverified` | `--ink-2` | `□` **after**, ochre | 1px dotted `--uncertainty` | flat ochre, 1px **dashed** border |
| `planted` | `--ink-2` | `⧅` **before**, plum | 3px double `--breach` | 135° counter-hatch, 1px solid plum |

Notes for implementers:

- The glyph **precedes** a confirmed claim and **follows** a qualified one. The
  eye should meet certainty before the sentence and doubt after it. This is
  intentional; do not normalise it.
- **Never a progress bar, percentage, ring, or colour ramp.** Uncertainty reads
  as an analyst's annotation or it does not ship.
- **`planted` is an assessment, not a flag.** See §4.1 — this is the single most
  dangerous thing to implement wrong.
- A planted claim is **never hidden or struck out.** The player must be able to
  re-read exactly what they believed. The revelation is social ("someone did
  this to you"), never systemic ("the software was wrong").
- Confidence must survive monochrome. Border *weight* changes before fill
  *colour* does, so an uncertain border looks uncertain in print.
- **Staleness** desaturates fills at a fixed rate against `observedAt`. A region
  seen a week ago is visibly paler than the same region at the same confidence
  seen this morning. Four bands: 0–24h, 2–4d, 5–9d, 10d+.
- **Absence of a holding is not emptiness.** Render "nothing in file" distinctly
  from "confirmed empty."

### 4.1 The planted state — read this before implementing anything

The two design briefs appear to contradict each other here. They do not, and the
reconciliation is the mechanic:

> **The system never marks intelligence as planted. A player's own analysts do,
> after the fact.**

When a claim arrives, `confidence` is `confirmed | probable | unverified` and it
renders exactly like any genuine claim at that level. **Planted intelligence is
indistinguishable from genuine intelligence of the same confidence.** There is no
tell, no subtle cue, no hover state, no difference in the DOM. If a player can
detect deception by inspecting the interface, the entire disinformation system is
worthless.

`planted` is a **fourth state a claim transitions into** — only after a
counter-intelligence result, a contradiction, or a consequence proves it false.
It is a record of a discovery the player made, not a property the claim shipped
with.

```ts
type Confidence = 'confirmed' | 'probable' | 'unverified';

interface Claim {
  confidence: Confidence;
  provenance: Provenance;
  // set ONLY by a counter-intel result or a proven contradiction.
  // never present at ingest, never inferable client-side.
  assessment?: {
    kind: 'planted';
    discoveredAt: ISODateTime;
    discoveredBy: 'counter-intelligence' | 'contradiction' | 'consequence';
    suspectedSource?: PartyId;   // who fed it to you, if known
  };
}
```

**Engineering rule:** the client must never receive a field that would let it
distinguish planted from genuine before discovery. Not in a payload it doesn't
render, not in a debug flag, not in ordering. Assume players read network
traffic — in this genre they do.

**The revelation state** must read *you were deceived by someone*, never *the
software was wrong*. Requirements:

- The claim is **never hidden, struck out, or removed.** The player must re-read
  exactly what they believed, in the words they believed it in.
- Show what they **did** because of it (`actedUpon`), and the cost.
- Name the **route it came in by**, and leave that channel open if it still is.
- Attribute to a party where known, and say plainly when it isn't known.

The `⧅` glyph, plum ink, and double rule in §4's table apply **only** to a claim
carrying an `assessment`. They are the visual record of a discovery.

---

## 5. Components

### 5.1 Briefing card
Classification bar (3px, `--hostility`) is the card's only colour. Title in
serif h3, source line in mono, body at 17px, actions below a `--rule` hairline.
Actions never float.

### 5.2 Cable / message
Mono throughout on `--paper-cold`. Header is a form: FROM / TO / CHANNEL / TIME
in a 62px label column. Back-channel messages mark CHANNEL in `--breach`.
Redaction is a solid `--redaction` bar with **no label and no tooltip**.
Footer carries read-receipt state and leak exposure.

### 5.3 Pact document
Numbered clauses in roman numerals, serif body, `--paper`. A right-hand
`--paper-carbon` column carries signatories, "who knows this exists," and an
**exposure grading** — a classification category (`CATEGORY II — CLOSE HOLD`),
never a meter or a percentage.

Private terms are set **in the same type as public terms**. The only difference
is a 3px `--breach` left rule, a `--breach-wash` ground, and the marginal count
of who can read them.

```ts
interface Clause {
  numeral: string;
  body: string;              // rendered formal language
  vocabulary: string[];      // the shorthand terms it was assembled from
  visibility: 'public' | 'sealed';
  sealedTo?: PartyId[];      // exact readership when sealed
  voidOnDisclosure?: boolean;
}
```

### 5.4 Standing ledger row
Date (mono) · source ref (mono, `--alliance`) · particulars (serif 16px) ·
visible-to · movement · running balance. **Every row carries a source
reference.** A number without a cause is a bug, not a design.

Rows expand to show their arithmetic — base value, each multiplier, and the two
documents the finding was derived from. No hidden modifiers, no rounding, no
summary figure that cannot be reconstructed from the rows above it.

**There is no single reputation.** Keep one folio per counterparty plus a
general account. An entry visible only to Turkey moves only Turkey's folio.

### 5.5 After-action report
Written by the reporting side and labelled as such. Contested facts carry
`probable` treatment with both readings left open. Losses are named where the
fiction names them. Footer states plainly that the opposing party has filed its
own account — the asymmetry is the point.

---

## 6. Layout grid

**The grid never changes across scenarios.**

```
rail (264px, fixed) | sheet (fluid, measure-capped) | margin (220–232px, fixed)
```

- `--rail-width: 264px` — navigation is a **rail of nouns**, not a toolbar of verbs.
- Sheet is fluid but body text is capped at `--measure-body`.
- `--margin-notes` carries marginalia, correspondence, and reading aids in
  italic serif on the desk ground — never controls.
- Page padding 44–48px. Document padding 40–56px.

---

## 7. Scenario skin contract

A scenario is a **skin over the core system.** It may override only:

- the three font families
- the three paper stocks + `--paper-edge`
- the four semantic accents
- the desk greys
- document furniture (stamps, seals, telex tape, letterheads)
- map treatment

It may **not** change the grid, the rail width, the measure, the type scale,
the confidence rendering contract, or the order of sections in a screen. If a
scenario needs to, the core system is wrong and should be amended for everyone.

Implement as a `[data-scenario="…"]` block that re-declares only those tokens.
`tokens.css` ships a worked example (`sevres-1956`).

---

## 8. Copy and tone

- Screens are written, not labelled. "While you were away," not "Session Summary."
- Deadlines in mono because a clock is machine-produced.
- No exclamation, no second-person cheerleading, no gamified verbs. "Put it to
  Moscow," not "Send offer!"
- Prose in the briefing digest is the product. Budget real editorial time for it;
  it is the retention loop.

---

## 9. Accessibility

- All body text meets WCAG AA on its paper stock (`--ink` on `--paper` ≈ 12.6:1).
- Confidence is encoded **three ways** — glyph, ink weight, rule style — so it
  never depends on hue alone. Verify any new state the same way.
- Glyphs (`■ ◧ □ ⧅`) need an `aria-label` carrying the state name; do not leave
  them as bare decorative text.
- Respect `prefers-reduced-motion`. There is very little motion in this system by
  design — page transitions should be cuts, not slides.

---

## 10. Not yet designed

Scoped but not built in this pass. Each inherits everything above:

- Nine scenario skins (S-01 Sèvres, S-02 Thirteen Days, S-03 The Guarantee,
  S-05 The Concert, S-06 The Blank Cheque, S-07 Attrition, S-08 The Bleeding
  Wound, S-10 The Concept, S-13 The Long Telegram, S-14 Effective Occupation)
- The belief inspector and its post-revelation state (S-10) — the most important
  unbuilt screen in the product
- The dual after-action report (S-07)
- The nuclear threshold ambient treatment (S-13)
