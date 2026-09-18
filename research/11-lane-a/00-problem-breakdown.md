# Lane A — Complete Problem Breakdown, Offer Landscape, and Monetization Verdict

- **Date:** 2026-09-18. Inputs: [competitor-offers.md](competitor-offers.md) (14-vendor offer teardown, priced for a concrete 200-return solo firm), [market-sizing.md](market-sizing.md) (bottom-up population and revenue math), plus the Lane A dossier ([10-deep-dives/lane-a-tax-doc-chase.md](../10-deep-dives/lane-a-tax-doc-chase.md)) and the original evidence pack.
- **Scope:** Lane A only — the active bet. B stays parked, C stays dead.
- **The question this file answers:** where exactly the customer stands, what their issue precisely is, what every alternative offer looks like, and whether the problem is big enough to monetize.

## 1. Where the customer stands — three archetypes, one season

**Archetype 1 — Solo EA/CPA, 1040-heavy (150–300 returns).** One professional, maybe one seasonal admin. Stack today: tax engine (Drake/Lacerte/ProConnect) + email + maybe a portal they half-adopted (SmartVault/TaxDome) + an Excel missing-items sheet. January: organizers go out (email), ~30% come back complete. February–March: every workday starts with triaging half-complete files; the owner personally sends "still waiting on your brokerage 1099" emails at 9pm. April: the files still incomplete become extensions — deferred work, deferred revenue, second season in October. The owner's words from the corpus: clients "don't read their email," complex clients get "a separate Excel tracking sheet."

**Archetype 2 — 2–3-person CPA firm (250–400 returns, mixed 1040/business).** An admin owns the chase; it is effectively a seasonal half-FTE ($15–25/hr documented VA/admin rates). They likely own a suite (TaxDome $800/yr-per-user tier or Financial Cents) and *still* chase manually because clients ignore portal emails and the suite's SMS is manual or a paid add-on. Their pain is not absence of tooling — it's that the tooling's reminders don't change client behavior.

**Archetype 3 — Bookkeeper (the off-season variant).** Same chase, monthly instead of seasonal: bank statements, receipts, unanswered categorization questions. This archetype matters because it converts a 4-month product into a 12-month one — and per the sizing work, it is the difference between a viable business and a dead seasonal app.

**The other party — the taxpayer client.** The problem's root cause is client behavior, and the evidence is consistent on why: portal logins and passwords are where compliance goes to die (magic links are the emerging fix across StanfordTax/Soraban); email asks get buried; fragmented requests ("upload your 1099-INT, 1099-DIV, 1099-B" exploded into line items — the documented SafeSend failure) confuse people who have one PDF from one brokerage; and there is no deadline consequence until the firm manufactures one. Any solution's real job is behavioral: reach the client where they actually respond (their texts), ask for exactly one thing per account, and make the deadline real (your return doesn't enter the queue).

## 2. The issue, exactly — five failure points

The job to be done: **"get a complete client file into the prep queue with minimal firm labor."** Emotionally: stop being the nag; stop dreading the inbox. Today's flow fails at five specific points:

| # | Failure point | Evidence anchor | Who solves it today | Residual gap |
|---|---|---|---|---|
| F1 | **Silence** — clients don't respond to email/portal asks | "no amount of email reminders will work" (r/taxpros) | Nobody by default: TaxDome SMS is manual+Twilio; FC auto-SMS gated to its $828 tier; Soraban defaults SMS but behind minimums | SMS-first at a solo-firm price |
| F2 | **Fragmented asks** — consolidated-1099s exploded into per-line requests | SafeSend Gather trial scrapped over it (r/taxpros) | Proven-broken at Gather; StanfordTax/Grove handling **unverified** | One-PDF-per-account as the visible design promise |
| F3 | **No tracking at scale** — what's missing across 300 clients lives in Excel | "separate Excel tracking sheet" (r/taxpros) | Suites do track (TaxDome/FC/Canopy) — at suite prices and suite setup burden | Tracking without adopting a fourth login |
| F4 | **No enforcement** — nothing happens when a client stalls | Firms invent it in engagement letters ("what constitutes a completed file") | Nobody sells it; it's a sentence in an EL, not a SKU | The prep-queue blocking state — the wedge's only truly unoccupied feature |
| F5 | **Channel/compliance mismatch** — texting clients touches TCPA, PII-in-SMS, 7216 | Dossier section 7 (primary-source) | Incumbents mostly avoid it by staying in email | Link-only SMS with consent capture at the EL — compliance as a feature |

Precision matters here: F1 and F3 are *underserved at the low end* (served at suite prices), F2 is *documented-broken at one vendor and unverified elsewhere*, F4 is *unserved everywhere*, F5 is *avoided by everyone*. The wedge is F1+F2+F4 together, with F5 handled correctly as a trust asset.

## 3. The full offer landscape — what a 200-return solo firm actually pays

From [competitor-offers.md](competitor-offers.md) (all figures as-fetched 2026-09-18; details, tiers, contracts, and review-sourced offer friction per vendor there):

| Vendor | Effective annual cost (200-return solo) | What the offer really is | Why it doesn't close the gap |
|---|---|---|---|
| ClientBrief | ~$96 | Checklist point-tool | No prior-year parse, no SMS, no gate |
| Financial Cents Solo | $228 | Practice suite w/ doc collection | Auto-SMS gated to Scale ($828); it's a suite adoption, not a bolt-on |
| Karbon Team | $708–1,068 | Collaboration suite | Reminders need Business tier; built for teams, not solos |
| TaxDome Essentials | ~$800 + Twilio | The category suite | No auto-SMS; setup burden documented; 3-yr pricing games |
| Canopy | $888 base; AI intake ≈ +$6,630 | Modular suite | Per-return AI pricing explodes at 200 returns |
| Qount Pro | $1,368 | Suite + capped SMS (500 msgs) | Caps + onboarding fee |
| Liscio | ~$1,588 | Client-comms platform + per-organizer fees | Per-organizer economics |
| Grove Collect | $0 until 2026-10-15, then 25 free + unpublished overage | Free-entry AI intake | The free window is a land-grab; post-window pricing unverified |
| SafeSend Gather | ~$3,000 | Per-return intake | The documented F2 failure |
| StanfordTax | $3,600 ($18 × 200, no minimums) | AI organizer from prior-year backup | Per-return math punishes volume; SMS/1099 handling unverified |
| SmartVault + AI | ~$4,060 | DMS + AI bundles, 2-seat min | Storage-first, seat math |
| Soraban | $1k–4.5k onboarding + contested minimums | AI intake for bigger firms | Built above this segment |
| **The wedge** | **$299/season** | SMS-first chaser + 1-PDF-per-account + prep gate, beside the existing stack | — |

**Positioning map:** three clusters — *suites* ($228–1,400/yr, sell "run your whole practice," win on breadth, lose on setup burden and email-bound reminders), *per-return AI intake* ($15–34/return ⇒ $3k–6.6k at volume, sell "AI does intake," win on wow, lose on volume economics for 1040 shops), and *point tools* (ClientBrief $96, sell "a link, not a portal" — the same story as the wedge, at a third of the price, without the trio). The wedge's defensible sentence: **"the only season ticket that texts your clients, asks for one PDF per account, and blocks incomplete returns from your prep queue — beside whatever you already use."**

**Live threats (from the teardown):** Grove's free window ends 2026-10-15 — its conversion offer will land mid-validation; StanfordTax has Karbon distribution; ClientBrief anchors the low end at $96 (the wedge must be visibly 3× better via SMS+gate+1099 handling); Financial Cents already sits at $228 inside many target firms — the sharpest discovery question is "you own FC Solo — why is the chase still manual?"

## 4. Is the problem big enough to monetize?

From [market-sizing.md](market-sizing.md) (all population figures sourced there; estimates labeled):

- **Serviceable market:** ~**16,000** independent US firms in the 50–400-return, 1040-heavy, tech-reachable band (range 12,000–20,000) — derived bottom-up from PTIN/EA/CPA-firm and NAICS 541213 data. The bookkeeping variant adds a separate adjacent pool.
- **Willingness-to-pay context:** $299/season = **$1.50/return** at 200 returns — 1–2% of what this population demonstrably spends on adjacent tooling. The price is easy to say yes to and too small to fund paid acquisition — organic channel (r/taxpros, #TaxTwitter, tax-pro podcasts/newsletters) is not optional, it's the model.
- **Revenue scenarios (base case):** Season 1 ≈ 70 firms → **~$39k ARR**; Season 3 ≈ 220 tax logos (1.4% penetration) + 120 bookkeeping seats → **~$153k ARR** at ~$450 blended ARPU, assuming ~68% seasonal renewal. Optimistic tax-only stalls under ~$250k even at 5% penetration.
- **The verdict (verbatim from the sizing work):** big enough **only with the bookkeeping variant** (or a post-pilot price lift toward $499). The three driving numbers: a 16k-firm SAM, a $299 ticket that can't fund paid CAC, and ~$153k base-case ARR at 1.4% penetration. "Those three numbers say a solo can eat; they do not say a $1M company lives inside 50–400-return independents at this price. **$1M ARR is a different product**" (up-market, per-return pricing, or a broader bolt-on).

**Interpretation for the decision:** this is a real, monetizable wedge for a solo builder — a profitable, ownable niche with a concentrated channel — provided you (a) attach the bookkeeping monthly variant from day one of the roadmap (not day one of the build), and (b) price-test **$299 vs $499** in validation rather than assuming the low anchor; the offer teardown shows $499 still undercuts everything with SMS except ClientBrief/FC-Solo, and the sizing math says the delta decides whether year-3 is ~$150k or ~$250k+.

## 5. What this changes in the validation script

Add to the Lane A discovery calls (beyond the kit's existing questions): (1) the FC-Solo probe — "you already pay $228 for Financial Cents — why is the chase still manual?"; (2) the price-ladder test — offer $299, then test reaction to $499 with the SMS+gate framing; (3) the 1099 question — "when your client has one Schwab PDF, what does your current tool ask them for?"; (4) the books-attach probe — "would you run the same chaser for monthly bookkeeping clients at $49/mo?"; (5) the phishing check from the dossier (unknown-number SMS deliverability/trust).

## 6. Bottom line

The customer is a solo-to-three-person firm whose season is structured around an unpaid, dreaded, client-behavior problem their existing tools bill them for but don't change. The issue, precisely, is five failure points of which one (prep-queue enforcement) is sold by nobody, one (one-PDF-per-account) is proven-broken at the incumbent that tried, and one (SMS-first) is everywhere an upsell instead of a default. The offers around them cluster at $228–$1,400 suites, $3k–6.6k per-return AI, and a $96 checklist — leaving a real, narrow slot for a $299–499 season ticket. The market is big enough to pay a solo builder well (~$150–250k ARR at modest penetration with the books variant) and not big enough to be a venture story at this price and segment — which, for the stated goal of a solo builder with high conviction, is a fit, not a flaw. The two facts that would still kill it are behavioral, not analytical: clients treating chase-SMS as phishing, and firm owners' revealed refusal to add any tool beside their suite. Both are exactly what the 15 validation conversations are built to surface — and nothing found at this depth argues for delaying them.
