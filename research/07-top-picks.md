# Top Picks — Five High-Conviction Briefs for a Solo Builder

> **Addendum (2026-09-17, after publication):** an independent blind pay-conversion stress test re-scored all 145 problems and revised these verdicts — 2 fly, 1 wounded, 2 die. Read [08-stress-test-verdict.md](08-stress-test-verdict.md) before acting on this file; its "Revised action list" supersedes the closing guidance here.

- **Compiled:** 2026-09-17. Pipeline: 145 evidenced problems across 18 industries ([05](05-problem-database.md)) → 15 validated ([06](06-shortlist-validation.md)) → these 5. Every claim traces to a URL in the source files; validation-added sources are dated 2026-09-17.
- **How to choose among the five:** all cleared the same bar (real pain, money attached, reachable buyer, solo-buildable, live catalyst, surviving whitespace). The tie-breaker is founder-channel fit — pick the one whose community you can credibly show up in every day, because in every one of these niches the channel IS the moat a solo can actually hold.

## Executive summary

1. **What we found overall:** the loudest, best-evidenced SMB pain in 2026 clusters into twelve repeating shapes (see [05](05-problem-database.md)) — the strongest being *evidence-packet generation for gatekeepers* (insurers, platforms, agencies, funders demand structured proof; SMBs assemble it by hand) and *hostage pricing* (vertical-SaaS incumbents ratcheting prices 15–90%/yr behind data lock-in).
2. **The sobering meta-finding:** complaint mining is no longer proprietary insight. In 10 of 15 validated candidates, indie or funded products launched into the gap within the last ~18 months. What still works: catalysts younger than 12 months, segments below incumbents' pricing floors, and niches needing deep domain specificity.
3. **The five survivors,** ranked by conviction:

| # | Pick | Buyer | Wedge price | Catalyst | Conviction |
|---|---|---|---|---|---|
| 1 | ESA-proof invoicing and receivables | Microschool founders, tutors in ESA states | $29–79/mo | TX TEFA 2026-27 (largest-ever program); AR/TN rollouts; failing state rails | HIGH |
| 2 | Single-process job-shop quoting | Owner-estimators at 5–50-person CNC shops | $99–149/mo | Reshoring doubled RFQ volume; LLM vision matured | HIGH-MED |
| 3 | Visa-clean deposit and no-show enforcement bolt-on | Salon/med-spa/studio owners | $29–49/mo | Visa Core Rules ed. 2026-04-18 | HIGH-MED |
| 4 | SMS-first tax-document chaser | Solo/1-3-person tax firms (50–400 returns) | $299/season | OBBBA's first filing season; Soraban's 150-return floor | MED-HIGH |
| 5 | Grant-award ledger on QuickBooks | Development/finance staff at $300k–5M nonprofits | $49–99/mo | GrantHub sunset 2026-01-31; federal grant chaos | MED-HIGH |

4. **Cross-cutting product patterns worth stealing** even if you reject all five: (a) *chase-with-teeth* — reminders are commodity, blocking states and statutory leverage are not; (b) *the gatekeeper's format is the spec* — build packet generators, not platforms; (c) *flat-price single-workflow companions* to hostage incumbents; (d) *productized migration/exit kits* as go-to-market into angry install bases (IT Glue→Hudu, Teachable exodus, GrantHub sunset all proved paid demand).
5. **Honesty:** this is desk research, done in one day by an AI. It earns you a shortlist and evidence, not certainty. Before building: re-verify the load-bearing links (they are all dated), then run 10–15 buyer conversations in the pick's channel. If those conversations contradict this file, trust the conversations.

---

## Pick 1 — "Get paid by the state": ESA-proof invoicing and receivables for microschools and tutors

**Source problem:** `education-P1` in [02-industries/education-training.md](02-industries/education-training.md) · score 37.0 · cluster K1/K6

**The problem.** Universal school-choice (ESA/voucher) money is scaling faster than its payment infrastructure. Providers wait 45–60+ days on invoices stuck in state-contracted rails (Arkansas: a 41,000-request backlog and a state memo criticizing the vendor; vendors refusing ESA families "because they can't wait two months to get their money"). Parents hand-assemble reimbursement PDFs against per-state documentation rules (Arizona's handbook demands credential attestations and rejects screenshots). Every rejection restarts the clock.

**Who pays.** Microschool founders (10–30 students; functionally forced to master ESA billing or turn away funded families) and tutoring/enrichment vendors in AZ, FL, AR, TN, TX and ~15 more states. New microschools open monthly; Texas TEFA is funding 2026-27 as the largest per-student program in the country.

**What they do today.** Manual invoice + receipt + credential PDFs per state format; front 2–3 months of payroll while receivables sit; some quit ESA entirely. Rails (ClassWallet, Odyssey, Step Up) serve the state, not the provider.

**Wedge MVP (solo scope).** Per-state compliant invoice and documentation-packet generator (launch with TX + AZ + FL); receivables aging by platform (submitted → approved → paid, with shortfall flags); rejection-reason library with resubmission checklists; credential/attestation vault with expiry reminders. Explicitly NOT money movement (stays out of regulated funds flow) and NOT a full school-management system.

**Pricing hypothesis.** $29/mo tutors, $79/mo microschools; positioned as "stop floating the state's money."

**Go-to-market.** State-specific SEO ("how to accept TX TEFA as a tutor" — providers search this the week they enroll); microschool founder networks (National Microschooling Center, KaiPod communities); state provider directories are a public prospect list; homeschool conventions.

**Competition.** CohortLedger (microschool-specific, young, TX-live) and GetESAPaid (broader compliance layer) — both seed-stage; the rails themselves (risk: they fix provider UX); generic invoicing tools can't encode per-state formats cheaply.

**Risks / kill conditions.** State program volatility (litigation, vendor swaps — mitigated by multi-state coverage); a rail vendor shipping good provider tools; keep student PII minimal (FERPA-adjacent hygiene). Kill it if two consecutive states ship provider-side fixes that close the documentation gap.

**Why now.** TX/AR/TN program waves are 2025-26 events; backlogs are in the news this summer; competitors haven't consolidated the category.

**First 10 customers.** Publish the TX TEFA invoice checklist as a free tool; DM every microschool in the TX/AZ provider directories offering white-glove first-quarter setup; convert the founders who reply within a day — the pain is that current.

---

## Pick 2 — Quote-from-PDF for one machining process, priced under the Paperless Parts umbrella

**Source problem:** `manufacturing-industrial-P1` in [02-industries/manufacturing-industrial.md](02-industries/manufacturing-industrial.md) · score 40.5 · cluster K2/K10

**The problem.** Job-shop quoting lives in Excel and one person's head; RFQs sit for days while the owner-estimator runs a machine. Practical Machinist threads document the spreadsheet default and the gap: "no software in between spreadsheets and the big players like E2 and JobBOSS." The category winner, Paperless Parts, is sales-gated at a competitor-reported ~$10k setup + $18k/yr.

**Who pays.** Owner-estimators at 5–50-person CNC machine shops bidding OEM/Xometry RFQs. Reshoring doubled quoting activity into this bottleneck (32% of contract manufacturers quoting reshoring projects in 2026, 2× 2025).

**What they do today.** Excel templates with "must fill" cells; McMaster as a same-day material-price proxy; two-person quote huddles; losing bids on response time (first responder is ~78% more likely to win, per vendor data).

**Wedge MVP (solo scope).** For 2.5-axis milling/turning only: drawing-PDF ingestion (LLM vision extracts dims, tolerances, material, finish callouts into a checklist the estimator confirms); shop-configured rate/routing templates producing setup+cycle estimates; material cost lookup; output = priced quote PDF + traveler + Excel. The estimator approves everything — sell it as the estimator's assistant, never as an oracle.

**Pricing hypothesis.** $99–149/mo self-serve, 14-day trial, no setup fee — the anti-Paperless-Parts offer. Tempus Tools proved this exact motion at $75/mo for laser/fab; the CNC slot is open.

**Go-to-market.** Practical Machinist and r/machinists presence (show real quote turnarounds); machining YouTube audiences; "quote in 20 minutes" demo content; no integrations required to start.

**Competition.** Paperless Parts (up-market), AMFG and DigiFabster (mid-market, $2k–50k/yr), Costimator (legacy), MRPeasy (ERP module), Tempus (laser/fab — watch for expansion into CNC).

**Risks / kill conditions.** Machinist skepticism of AI extraction (mitigate: checklist-confirm UX, never auto-send); quote errors cost real money (position as draft; estimator signs); Tempus or Paperless shipping a self-serve CNC tier — if either does before you have 50 customers, fold or niche harder (e.g., Swiss turning only).

**Why now.** LLM document vision crossed the usefulness threshold in 2024-25; reshoring RFQ volume is a 2026 phenomenon; retiring estimators (the industry's own tribal-knowledge crisis) make encoded quoting logic newly valuable.

**First 10 customers.** Answer every "how do you quote faster" thread on Practical Machinist with a working demo video; offer free setup of their rate table; charge from month one.

---

## Pick 3 — Visa-clean deposits: the no-show fee that actually survives a chargeback

**Source problem:** `personal-services-P2` in [02-industries/personal-services.md](02-industries/personal-services.md) · score 40.5 · cluster K1/K6 — load-bearing claim verified against Visa primary documents on 2026-09-17

**The problem.** Beauty/health merchants charge no-show fees to cards on file — and lose the disputes, because Visa's guaranteed-reservation/no-show protection covers only nine lodging/rental merchant categories. A salon's after-the-fact fee is just a card-absent charge for a service never received: Dispute Condition 13.1. The compliant structure — an advance deposit with separate click-to-accept, "Deposit" on the receipt, consistently enforced policy — is exactly what incumbents don't ship: Vagaro gates deposits behind a paid shopping-cart add-on, Fresha restricts them, GlossGenius's chargeback protection covers card-present only.

**Who pays.** Salons, barbers, med-spas, tattoo studios, PTs, fitness studios — 14–20% no-show rates; a modest salon's chair-time loss models around $31k/yr (vendor estimate, flagged as such). The buyer refuses to switch booking platforms; that refusal is the market.

**What they do today.** Buried policy text, after-the-fact charges that lose disputes, waiving fees for loud clients (itself a listed dispute-losing behavior), eating the loss.

**Wedge MVP (solo scope).** A hosted deposit layer that bolts onto any existing booking flow (Square Appointments, Fresha, Calendly, Acuity link-in-bio): policy disclosure with a separate accept step per Visa's disclosure rules; Stripe-collected deposit labeled correctly on the receipt; auto-apply/refund windows; an enforcement log (who accepted which policy when, applied consistently); and a one-click chargeback evidence pack (acceptance timestamp + policy + receipt + comms) for the disputes that still happen.

**Pricing hypothesis.** $29–49/mo + optional per-deposit fee; ROI is one saved no-show or one won dispute per month.

**Go-to-market.** The hook writes itself and is genuinely viral in stylist communities: "your no-show fee doesn't survive a chargeback — here's the Visa rule." Chargeback horror-story threads in r/Hairstylist and r/barbers; independent-stylist educators as affiliates.

**Competition.** GlossGenius (requires full platform switch), native-but-gated features in Vagaro/Square, bare Stripe payment links (no compliance framing, no log). No one sells the compliant flow as an add-on.

**Risks / kill conditions.** Incumbents fixing their deposit UX (feature risk — but their pricing incentives point the other way); processor/MCC nuances (get a payments-savvy advisor early); non-technical-buyer support load (design for zero-config). Kill if Square ships separate-accept deposits with enforcement logging on the free tier.

**Why now.** Visa Core Rules edition 2026-04-18 plus network-wide friendly-fraud tightening made this legible this year; the Fresha pricing revolt (2025) has these owners actively rethinking their stack.

**First 10 customers.** Post the rule-explainer with a free "is your policy compliant?" checker; onboard respondents hands-on; collect the first won-dispute screenshots as social proof.

---

## Pick 4 — The tax-season document chaser for firms too small for Soraban

**Source problem:** `accounting-P1` in [02-industries/accounting-bookkeeping-tax.md](02-industries/accounting-bookkeeping-tax.md) · score 39.5 · cluster K4

**The problem.** January–April is a document chase: clients drop incomplete files and ignore email ("no amount of email reminders will work"); firms keep Excel missing-item sheets and hire admins whose job is follow-up. The tools that solve it are either whole-practice operating systems (TaxDome at $700/user/yr on 3-year terms, with documented setup pain) or volume-gated AI intake (Soraban: $15–30/return with 150–250-return minimums plus $1,000–4,500 onboarding). The solo firm with 50–400 returns has no purpose-built option.

**Who pays.** Solo CPAs/EAs and 1-3-person firms; bookkeepers chasing monthly statements are the off-season market.

**What they do today.** Email organizers, portal nagging, IRS wage-and-income transcripts to skip the chase entirely, Excel trackers, offshore VAs whose listed duties include document collection.

**Wedge MVP (solo scope).** Import last year's return or organizer list → generate a one-PDF-per-account checklist (explicitly avoiding the exploded consolidated-1099 line-item mess that killed a SafeSend rollout in the evidence); SMS-first chase sequences with the client's personal missing-item list; passwordless upload links; a blocking state — the return physically cannot enter the prep queue until the file is complete, which is the "teeth" competitors lack; 7216-consent handling built into onboarding.

**Pricing hypothesis.** $299/season flat or $39–79/mo — no onboarding fee, no minimums, cancel in May.

**Go-to-market.** r/taxpros and TaxProTalk from October (firms buy season tooling Nov–Jan); a "document-chase hours calculator"; bookkeeping communities for the off-season monthly-statement variant.

**Competition.** TaxDome/Canopy/Financial Cents (suites; generic reminders), Soraban (volume-gated AI intake), SafeSend Gather (mid-market, 1099-splitting complaints). Feature risk is real: any suite could ship SMS chase.

**Risks / kill conditions.** Feature-not-product risk (mitigate by owning the blocking-state workflow + SMS deliverability craft, and staying the cheapest); extreme seasonality (bookkeeper monthly mode is the smoothing product); handle documents with encryption and minimal retention. Kill if TaxDome ships SMS-first chase with per-account checklists before season one converts.

**Why now.** OBBBA's first filing season (2026→2027) adds new documentation confusion; Intuit price fatigue has small firms unbundling; Soraban's success proved the pain at the tier above.

**First 10 customers.** Ten r/taxpros firms recruited in November with free season-one setup in exchange for weekly feedback calls; charge full price at renewal.

---

## Pick 5 — The grant-award ledger QuickBooks refuses to be

**Source problem:** `npo-solar-P1` in [02-industries/nonprofits-energy-solar.md](02-industries/nonprofits-energy-solar.md) · score 39.5 · cluster K1/K3/K7

**The problem.** Nonprofits with 8–15+ awards run grants on a master spreadsheet with a "big fat column for RESTRICTIONS," Excel tab-per-grant updated monthly, QBO Projects program staff can't use, and Asana deadlines duplicated by hand. In the evidence: "I WISH there was a program that did it all." Donor CRMs don't do restricted funds; Instrumentl tracks applications, not spend-down; and Foundant sunset GrantHub on 2026-01-31, orphaning a large installed base of grant trackers.

**Who pays.** Development directors and finance managers at $300k–5M organizations — modest budgets, but grant admin is chargeable to grants, and the 2025-26 federal funding chaos made a missed report existential (termination risk).

**What they do today.** The spreadsheet OS above; some pay Instrumentl $299–999/mo mostly for discovery; GrantHub refugees are mid-migration right now.

**Wedge MVP (solo scope).** Read-only QBO sync mapping classes/projects to awards; per-award budget-vs-actual with restriction flags program staff can actually see; a funder deadline calendar (reports, renewals, spend-down dates) with escalating reminders; funder-format export packets (budget-to-actual in the shape each funder demands); a one-click board snapshot (which also attacks the adjacent board-packet problem, `npo-solar-P5`).

**Pricing hypothesis.** $49–99/mo per organization; "GrantHub import" as the onboarding hook.

**Go-to-market.** r/nonprofit (the exact workflow is described there in recurring detail), "GrantHub alternative" SEO (a dated, searching audience), state nonprofit association webinars, and nonprofit-specialist bookkeepers as a reseller channel.

**Competition.** GrantLink ($25–150/mo), 4granted ($79/mo), GrantPipe ($269/mo) — young and partial; Instrumentl up-market; Aplos (requires replacing QBO). Foundant re-entering is possible.

**Risks / kill conditions.** Nonprofit sales are committee-shaped and WTP is modest (self-serve + bookkeeper channel mitigates); QBO API dependence (moderate platform risk); the young competitors could consolidate the niche first. Kill if two of the three small tools converge on restricted-fund spend-down with funder-format exports before you reach 30 orgs.

**Why now.** GrantHub's sunset is a dated migration event happening this year; federal disruption raised the stakes of reporting discipline; Instrumentl's price climb keeps widening the umbrella.

**First 10 customers.** Answer spreadsheet-OS threads on r/nonprofit with a template that mirrors your product's data model; offer free GrantHub imports; convert the orgs whose funders demand quarterly reports.

---

## If you only remember three things

1. **Sell packets, cockpits, and teeth** — the recurring solo-winnable shapes: generate the gatekeeper's required packet, give status visibility over a queue you can't fix, and add enforcement (blocking states, deposits, statutes) where incumbents only remind.
2. **The window test beats the pain test.** All 145 problems are real; only the ones protected by a young catalyst, an incumbent pricing floor, or domain specificity were still open. Re-run that test before committing — including on these five, because windows move.
3. **Channel is the moat.** Every surviving pick has one concentrated venue (r/taxpros, Practical Machinist, r/nonprofit, microschool networks, stylist communities). The builder who is natively credible in one of those should weight that pick two tiers up.
