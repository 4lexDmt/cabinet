# Lane A — Product Feature Map: What Eliminates the Pain

- **Date:** 2026-09-18. Built from the five failure points in [00-problem-breakdown.md](00-problem-breakdown.md), the compliance constraints in the [Lane A dossier](../10-deep-dives/lane-a-tax-doc-chase.md) §7, and the offer gaps in [competitor-offers.md](competitor-offers.md). No new research — this is the design layer on top of the evidence.
- **Working name used below:** "the chaser." Positioning sentence the spec must keep true: *the only season ticket that texts your clients, asks for one PDF per account, and blocks incomplete returns from your prep queue — beside whatever you already use.*

## 0. What "solves the problem completely" honestly means

No product can make 100% of clients comply — anyone claiming that is lying, and firms know it. The complete solution is defined against the *firm's* pain, not the client's behavior:

1. **The firm's labor collapses to one touch.** Setup per client at season start; after that, zero firm-initiated nagging. Every chase, escalation, reminder, and deadline warning is automated.
2. **Nothing falls through.** Every client's missing-items state is visible and current; no Excel sheet, no memory.
3. **The stragglers cost nothing.** Clients who never comply are automatically converted into a clean, documented extension path — deferred revenue instead of April panic.
4. **The firm is safer, not just faster.** Every ask and response is time-stamped (E&O/documentation value), and the texting is done inside TCPA/7216/Pub-4557 constraints the firm couldn't easily engineer alone.

If those four hold, the pain point — the dreaded, unpaid, chaotic chase — is eliminated even though some clients will still be slow. Slowness stops being the firm's problem.

## 1. Pain-to-feature map (the spine of the product)

| Failure point | Eliminating feature set | "Eliminated when" (acceptance criteria) | Who else has it (from teardown) |
|---|---|---|---|
| **F1 Silence** — clients ignore email/portal asks | SMS-first chase sequences; escalation ladder (SMS → email → firm alert); passwordless magic-link upload; one-tap client replies | ≥60% of requests get a client action within 72h without firm touch (pilot metric to calibrate) | Nobody at solo prices: TaxDome SMS manual+Twilio; FC gates auto-SMS to $828 tier; Soraban behind minimums |
| **F2 Fragmented asks** — exploded 1099 line items | One-PDF-per-account request model; prior-year-derived checklist grouped by *source document*, not by form line | A client with one Schwab statement sees exactly one ask; zero pilot complaints about "it asked me for 6 things I don't have" | Proven-broken at SafeSend; unverified everywhere else — this is a named differentiator |
| **F3 No tracking at scale** | Season board (complete / partial / silent per client); daily digest email to the firm (no login required); per-client timeline | Owner can answer "who are my 20 silent clients?" in <10 seconds; Excel tracker retired by week 2 of pilot | Suites track at suite prices + suite adoption; ClientBrief tracks without parse/SMS/gate |
| **F4 No enforcement** — no consequence for stalling | Prep-queue blocking state ("incomplete — not in prep"); firm-configured cutoff dates; automated deadline countdowns to the client; auto-generated extension-warning and extension-conversion letters | Zero returns enter prep incomplete; stragglers receive the extension warning without the firm writing it | **Nobody sells this.** The moat feature |
| **F5 Channel/compliance mismatch** | Consent capture at engagement letter (TCPA express consent + 7216/6713 notice text supplied); link-only SMS bodies (zero PII); A2P 10DLC registration done *for* the firm; STOP/HELP autohandling; quiet hours; WISP vendor one-pager | Counsel-approved consent path; zero PII in any message body; carrier registration complete before first send | Incumbents avoid the channel instead of solving it — compliance becomes a sales asset |

## 2. Feature breakdown by module

### M1 — Intake and checklist generation (v1)
- **Prior-year import, three grades:** (a) CSV/client-list export from tax software or spreadsheet — zero-PII path, always works; (b) organizer export parse; (c) prior-year return PDF parse — *SSNs redacted at ingestion and never stored* (Pub 4557 posture; also the sales line "we never hold SSNs").
- **Source-document checklist model:** items are "your Schwab 1099 package," "your W-2 from [employer]," "your mortgage 1098" — one item per *document that arrives in the client's life*, never per form line. Grouping rules are the F2 killer and get first-class treatment (brokerage consolidated packages, K-1 late-arrival handling with a "K-1 pending" state).
- **Client-type templates:** W-2-only, brokerage-heavy, rental/Schedule-E, self-employed, K-1 — so a 200-client setup is bulk-assign + exceptions, not 200 manual lists. Setup target: an owner loads their book in one evening.

### M2 — Consent and channel rails (v1, the compliance moat)
- **Engagement-letter consent kit:** paste-ready EL language capturing TCPA express consent + the 7216/6713 notices (drafted for counsel review — the pre-build gating task), plus a hosted consent-capture page for existing clients.
- **"Save our contact" step:** at consent, the client gets the firm-branded vCard so season texts arrive from a *named, saved* sender — the direct mitigation for the phishing open-question, plus sender-ID branding where carriers support it.
- **A2P 10DLC done-for-you:** brand/campaign registration handled inside onboarding (a real, painful task firms won't do themselves — TaxDome literally charges for SMS and still leaves this to the firm).
- **Guardrails baked in:** STOP/HELP autohandled with 10-day opt-out compliance, quiet hours by client timezone, per-firm send caps, zero PII in bodies (message = "3 items still needed for your 2026 return — tap: [link]" with the firm's name, nothing else).

### M3 — The chase engine (v1)
- **Sequences with teeth, not spam:** default cadence (day 0 SMS, day 3 SMS, day 7 email+SMS, day 12 firm alert), firm-tunable; every message deep-links to the client's page.
- **Client page (magic link, no password, mobile-first):** their remaining items only, phone-camera upload, and two one-tap replies per item — "I don't have this yet" (sets a snooze + expected date) and "this doesn't apply this year" (routes to firm approval). The one-tap replies kill the false-chase loop that burns goodwill.
- **Auto-match and completeness check:** uploaded file classified against the checklist item (lightweight document classification); unreadable/wrong-doc triggers a polite re-request without firm involvement; multi-document PDFs accepted and split.
- **Escalation to human, by exception:** the firm only ever touches clients the machine has already failed with — the inbox becomes an exception queue.

### M4 — Enforcement and season flow (v1, the moat)
- **Blocking state:** a return cannot be marked prep-ready while required items are open; the dashboard's prep queue only shows complete files. (Firm can override per client — the firm is always sovereign; the default is the discipline.)
- **Cutoff engine:** firm sets its real dates ("complete file by Mar 15 or you're extended"); the countdown appears in client messages automatically; on breach, the extension-warning letter sends itself and the client flips to the extension track.
- **Extension track:** auto-generated extension notice + the October re-chase schedule created on the spot — the straggler's cost to the firm rounds to zero.

### M5 — Firm visibility (v1 thin, v2 rich)
- v1: season board, daily digest email, CSV export, per-client audit timeline (every ask/response time-stamped — the E&O artifact).
- v2: realization analytics (hours saved, response-rate by client), multi-preparer assignment, white-label client page.

### M6 — Security and retention posture (v1, non-negotiable)
- US-only hosting and processing; encryption in transit/at rest; SSN redaction at intake; **auto-purge of client documents after season close** (firms keep originals in their own systems — the chaser is a conveyor, not an archive; this converts a compliance burden into a positioning line: "we hold your clients' documents for the season, then destroy them"); no AI training on client data (contractual); the WISP one-pager so the firm can paste the vendor entry into their required security plan.

### M7 — Books variant (v2, revenue-critical per sizing)
- Monthly recurrence templates (bank statements, receipts, open questions), same chase engine, $49/mo — converts the seasonal product into year-round ARPU. Deliberately v2: sold at season-end to the same pilot firms ("keep the chaser running for your bookkeeping clients").

### Explicitly out of scope (any version until forced)
Client portal/document archive, e-signature, invoicing/billing, tax-software write-back (import only), organizer questionnaires (StanfordTax's turf), practice management of any kind. Every one of these is a "fourth login" trap that re-creates the suite the wedge exists to avoid.

## 3. The client-side experience (the product's real test)

Six steps, zero passwords, under three minutes: (1) text arrives from a saved/named sender: "Hi Dana — 3 items left for your 2026 return. Tap here." → (2) magic-link page shows exactly three cards ("Schwab 1099 package," "W-2 — Acme," "Mortgage 1098") → (3) phone-camera snap or file upload per card → (4) or one-tap "don't have it yet" / "doesn't apply" → (5) progress bar hits complete, confirmation text ("You're done — [Firm] has everything") → (6) silence. The bar for every design decision on this surface: would a 68-year-old rental-property client complete it from a recliner. If yes, F1 dies.

## 4. Differentiation check against the teardown

- Built-in default SMS with compliance rails → nobody at ≤$300; TaxDome (manual+Twilio), FC ($828 gate), Qount (capped) all charge more for less.
- One-PDF-per-account grouping → SafeSend's documented failure inverted into the demo moment; StanfordTax/Grove behavior unverified, so the demo must show it explicitly.
- Prep-queue blocking + extension track → sold by no vendor in the teardown; hardest to copy credibly because suites' data models treat requests as tasks, not gates.
- Season-ticket price + auto-purge retention → structurally opposite to suites (whose lock-in is the archive) — the offer *is* the differentiation.
- Honest overlap to watch: ClientBrief ($96, checklists+links) could add SMS; Grove's post-free-window offer lands mid-validation. Speed matters more than secrecy.

## 5. Instrumentation (what the pilot must measure)

Activation (first chase sent within 7 days of signup); client response rate within 72h by channel (the F1 number); docs collected per firm-touch (the labor number, target: >10:1); completeness velocity (days from first ask to prep-ready); false-chase rate (asks marked "doesn't apply" — the F2 quality number, target <10%); deliverability/carrier-filter rate and "is this phishing?" client replies (the open-question tripwire); extension-track conversions (F4 working as designed); weekly firm logins NOT required (digest-open instead — bolt-on promise kept).

## 6. Risk register (feature-level)

| Risk | Feature answer | Residual |
|---|---|---|
| Chase-SMS read as phishing | vCard save at consent, named sender, firm-branded page, no links-from-nowhere (first touch always follows the EL conversation) | Real; measured by tripwire metric; pilot question #1 |
| Carrier filtering kills deliverability | Proper 10DLC registration, link domains warmed, per-firm volume caps | Moderate; monitor from day 1 |
| Classification mislabels a document | Never auto-reject — mismatches queue for firm review; client never sees an error caused by the model | Low impact by design |
| A STOP request missed | Autohandled at the rail level, audited; kill-switch per firm | Near-zero tolerated — legal exposure |
| Counsel requires per-client 7216 consent | Consent flow already at EL stage; if per-client consent is mandated, the EL kit absorbs it — friction rises but survives; if consent must be *standalone and signed*, kill per the existing criterion | The pre-build gate |
| Suites copy the gate | Season-ticket economics + bolt-on positioning are the defense; expect copying if it works; win the niche's trust first (channel moat) | Accepted |

## 7. Build order (dependency-shaped, not calendar-shaped)

1. M2 consent kit + counsel sign-off (gates everything). 2. M1 CSV-grade import + templates (zero-PII path first; PDF parse later). 3. M3 chase engine + client page (the demo). 4. M4 blocking state + cutoffs (the moat; simple state machine once M3 exists). 5. M5 thin dashboard + digest. 6. M6 posture items throughout, purge job before pilot end. PDF return parsing, books variant, analytics: after first paying season proves F1/F2 numbers.

## 8. Open design questions → owned by validation calls

Does the client page need Spanish at v1 (client-base mix — ask pilots)? What share of pilots' books are K-1-dependent (changes the "pending" state's prominence)? Do firms want the extension letter in their own template (likely yes — make it editable)? Will owners accept digest-only, or demand a live dashboard on day 1? Price ladder $299 vs $499 against this exact feature list — read their face at the blocking-state demo, per the breakdown's §5 script.
