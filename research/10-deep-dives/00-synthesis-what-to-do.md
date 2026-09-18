# Deep-Dive Synthesis — What To Do Now

- **Date:** 2026-09-18. Inputs: the three full dossiers in this directory ([Lane A](lane-a-tax-doc-chase.md), [Lane B](lane-b-jobshop-quoting.md), [Lane C](lane-c-salon-deposits.md)), each built on the prior corpus plus ~28 fresh searches with primary-source verification of the load-bearing claims.
- **Headline:** complete research re-decided the portfolio. **Lane A is the bet** (narrower wedge, named compliance design, hard calendar). **Lane B parks** (category filled within months; the true trigger is estimator succession; forum GTM would get banned). **Lane C dies as scoped** (the bolt-on is technically impossible on the named stacks; the "gated deposits" premise was wrong). The stress test's doubts were right in both wounded cases — and now we know the precise reasons.

## Verdict changes at a glance

| Lane | After stress test (08) | After deep dive (10) | The deciding discovery |
|---|---|---|---|
| A — tax doc chase | FLY | **GO — primary, wedge narrowed** | StanfordTax ($18/return, no minimums) + Grove (free tier) occupy "cheap AI intake"; the surviving wedge is SMS-first + one-PDF-per-account + hard prep-queue block, sold as a bolt-on, in a speed race |
| B — job-shop quoting | WOUNDED, leans fly | **PARK (conditional)** | Five self-serve competitors appeared at the exact price point (CloudNC $50–100, Setell $49/99, Zenith $49, QuoteForge €99, PartPilot); real purchase trigger is estimator succession; ITAR forces refusing defense drawings; both key forums ban vendor pitches and AI content |
| C — salon deposits | WOUNDED | **KILL as scoped** | Square/Fresha/Vagaro processing is closed — a third-party deposit layer cannot attach (Square's API literally can't apply external deposits); Square ships deposits on the FREE plan; Kevonia already sells the standalone $49.99/mo fallback |

## Lane A — GO. The narrowed wedge and its design constraints

**What deep research confirmed:** the pain and spend are real and current; TaxDome still cannot auto-SMS (manual, Twilio-billed); SafeSend Gather's consolidated-1099 explosion remains the documented failure to design against; the Nov–Jan buying window holds.

**What it corrected:** the "empty niche below Soraban" from `06` is no longer empty — StanfordTax reads prior-year returns into personalized organizers at $18/return with no minimums, and Grove Collect runs a free tier. **The wedge that survives is the trio none of them ship together:** (1) SMS-first chase, (2) one-PDF-per-account requests (anti-explosion), (3) a hard prep-queue blocking state — positioned as a $299/season bolt-on beside whatever portal the firm already runs, not as another intake suite.

**v1 spec (from the dossier, compliance-shaped):**
1. Import prior-year client/document list (read-only; from organizer export or return PDF)
2. One-PDF-per-account checklist per client
3. Link-only SMS chase — **no PII in message bodies** (Pub. 4557 posture), A2P 10DLC registered, STOP/HELP handling (TCPA exposure is $500–1,500 per message — one missed opt-out is existential)
4. Consent capture at engagement-letter stage (TCPA express consent + 7216/6713 contractor notices)
5. Blocking state: return flagged "incomplete — not in prep queue" until the checklist closes
6. Passwordless upload page; US-only data residency; **SSNs never leave the US and ideally never touch the system** (redact at intake)

Out of scope at v1: portal suite, e-sign, billing, tax-software write-back, anything storing full returns longer than the season.

**Gating task before onboarding anyone:** counsel confirmation that the §301.7216-2(d) auxiliary-services path covers this design without per-client consent. The dossier's reading says yes for a US vendor performing non-substantive services, but **if counsel says per-client 7216 consent is required, that's a kill** — onboarding friction would erase the product's reason to exist. I can draft the consent-language pack and the counsel questions; a lawyer reviews.

**Updated kill criteria:** counsel requires per-client 7216 consent; or StanfordTax/Grove ship SMS + 1099-grouping + a prep gate before five firms have paid; or pilots report clients treating unknown-number SMS as phishing at a rate that breaks the chase (open question flagged in the dossier — test in the first pilot).

**Action:** all founder validation time goes here, now. The 09 kit's script stands, with the dossier's sharper discovery questions added — most importantly: "would a text from an unknown number with a link get your clients to act, or get you flagged as phishing?", "who in your firm decides a file is complete, and would they accept software enforcing it?", and "what did you pay StanfordTax/Grove/TaxDome last season and why did you keep or drop it?"

## Lane B — PARK, with a defined re-entry condition

The category moved under us between the June/July-era evidence and now: five self-serve quoting tools live at $49–150. The dossier's genuinely new finding is the **trigger**: shops buy when the estimator leaves — Hillside bought after retirements pushed quote time to two weeks; Fabcor bought when the father retired. "Quote faster" is a someday-pitch; "Dave retired" is a this-quarter pitch. Add two structural drags: v1 must hard-refuse ITAR/CUI drawings (CloudNC already prints that warning; GovCloud-grade compliance is not solo-affordable), and the two natural channels ban vendor pitches and AI content, so GTM must run through owner-to-owner DMs, NTMA chapters, and machining YouTube instead.

**Re-entry condition:** pursue only if (a) the founder has genuine machining credibility, and (b) the slice is repositioned as an **estimator-succession kit** — capture the retiring estimator's costing logic into rate tables + a confirmable checklist, sold at the succession moment — rather than a horizontal "AI quoting" tool competing with five funded/cheaper entrants. Revisit after Lane A's season gate (spring 2027), or immediately if validation conversations surface a succession-moment prospect organically.

## Lane C — KILL as scoped; keep only the content asset

Three independent facts close it: (1) the bolt-on cannot attach — Square Appointments accepts no third-party processor and its API cannot apply an external deposit (open feature request since June 2026), Fresha and Vagaro gate deposits to their own payments; a split-processor workaround (deposit on Stripe, balance on the incumbent) means two descriptors, two MIDs, manual refunds — a services business, not $39 SaaS. (2) The premise from `06` was wrong in the incumbents' favor: Square ships compliant-pattern deposits on its **free** plan; Vagaro's gate is $10/mo, not $49. (3) The standalone fallback (deposit-native booking link for booth renters/tattoo chairs) is already sold by Kevonia at $49.99/mo, inside the broader hyper-crowded booking-page market. The Visa/Mastercard rule research remains true and interesting — worth publishing as a credibility artifact if you ever operate in this space, not worth a product. The auditors' WOUNDED doubt is resolved: they were right, and the reason (processing lock-in) was findable only at this depth.

## Revised operation (supersedes the lane table in 09-validation-operation.md)

1. **Lane A only** for founder time: 15 conversations, October gate. Setup checklist shrinks to: Reddit account for r/taxpros participation, one $299 Stripe link, a Cal.com link, your background paragraph.
2. **Lane D probe (ESA)** stays optional and unchanged — 10 DMs, revive on 3 paid deposits.
3. **Lane B kit retracted** in its forum-outreach form (ban risk verified); lane parked per above.
4. **Lane C kit retired.**
5. Calendar: conversations through October → go/kill gate end of October → if GO, build November against the v1 spec above → pilot onboarding December → season January–April.

**Agent tasks ready to run on your word:** draft the 7216/TCPA consent-language pack for counsel; build the Lane A target list from named r/taxpros threads; draft the founding-firms landing page copy; prep per-prospect DM personalizations once your Reddit account and background paragraph exist.
