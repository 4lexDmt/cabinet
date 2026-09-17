# Problem Database — All Findings, Deduped, Clustered, Scored

- **Compiled:** 2026-09-17, from the 18 industry files in [02-industries/](02-industries/), the consumer scan ([04-consumer-cross-cutting.md](04-consumer-cross-cutting.md)), and the catalyst scan ([03-emerging-trends.md](03-emerging-trends.md)).
- **Contents:** 145 problems (133 industry + 12 consumer domains), each carrying its own evidence pack in its source file. This file is the index and analysis layer; open the source file for quotes and URLs.
- **Scoring:** weighted total out of 45 = 2×(severity×frequency) + 2×(willingness-to-pay) + 1.5×(reachability) + 1.5×(solo-buildability) + 1×(whitespace) + 1×(why-now). Dimension scores were assigned in the source files at research time; the table's `S/W/R/B/Wh/N` column shows them in that order. Tiers: A ≥ 37.5, B ≥ 33.5, C below.
- **Trust note:** scores are judgment on top of evidence, not measurements. Tier A means "strong evidence on multiple dimensions", not "guaranteed business". Kill-criteria flags below override scores.

## The twelve cross-industry clusters

The same problem shapes recur across unrelated industries. These clusters are the real finding of this research — a solo builder should pick a *shape* they want to own, then pick the vertical with the best channel.

### K1. Evidence-packet generation for gatekeepers — the 2026 super-pattern
Institutions (insurers, platforms, agencies, funders, payers) increasingly demand structured proof before releasing money, and SMBs assemble that proof by hand from tools that don't talk to each other.
Members: `it-msp-P1` (cyber-insurance evidence), `it-msp-P2` (CMMC), `manufacturing-industrial-P5` (FAI/CofC/MTR defense packets), `restaurants-hospitality-P1` (delivery-dispute evidence), `auto-P2`/`auto-P6` (calibration docs, insurer supplements), `logistics-trucking-P1` (carrier due-diligence records), `insurance-P6` (E&O activity logs), `npo-solar-P1` (grant reports), `education-P1` (ESA documentation packets), `agriculture-P2` (EQIP-ready packets), `healthcare-private-practice-P1` (prior-auth packets), `real-estate-property-management-P3` (screening evidence), consumer `D1`/`D11` (appeal and dispute letters).
Solo takeaway: the gatekeeper's format is the product spec; LLMs are unusually good at packet assembly; buyers already pay in hours and in denied claims. Most solo-friendly cluster in the database.

### K2. Hostage pricing — the SMB vertical-SaaS ratchet
Incumbents raise prices 15–90% per year, gate data exports, and rely on switching pain. Users are angry, organized, and searching for exits — in public.
Members: `accounting-P2` (Intuit), `legal-P3` (Clio), `creative-creator-economy-P1`/`personal-services-P8` (HoneyBook/Dubsado), `npo-solar-P2` (Blackbaud), `insurance-P5` (Applied Epic/AMS360), `personal-services-P4` (Mindbody), `auto-P3` (ALLDATA), `auto-P7` (Shopmonkey), `retail-P7` (Klaviyo), `construction-skilled-trades-P3` (ServiceTitan et al.), `logistics-trucking-P7` (DAT), `it-msp-P3`/`it-msp-P5`/`it-msp-P6` (Kaseya/ConnectWise/IT Glue), `education-P5` (Teachable/Kajabi), `restaurants-hospitality-P4` (Toast), `healthcare-private-practice-P4` (therapist EHRs), `real-estate-property-management-P5` (AppFolio), `hr-staffing-P6` (Bullhorn), `manufacturing-industrial-P2` (JobBOSS/NetSuite), `creative-creator-economy-P7` (Kajabi/Kit/Patreon).
Solo takeaway: two repeatable wedges. (a) A flat-priced companion that does the one workflow the incumbent gates behind an upgrade. (b) A productized migration/exit kit — the IT Glue→Hudu, Teachable-exodus, and HoneyBook-switcher migrations are already paid services people can't find enough of. Do not clone the incumbent.

### K3. Re-keying and swivel-chair integration
The same data typed twice (or twenty times) because formats differ and APIs are closed or unused.
Members: `insurance-P1` (carrier portals), `insurance-P2` (commission statements), `manufacturing-industrial-P3` (CRM→ERP), `accounting-P6` (bank feeds), `education-P6` (paper→SIS grades), `it-msp-P4` (QBR data), `logistics-trucking-P6` (IFTA), `npo-solar-P5` (GL→board packets), `agriculture-P3` (Deere↔FieldView).
Solo takeaway: "ingest ugly PDFs/CSVs → normalized output" is now cheap to build and buyers already pay humans $187+/mo for it (insurance commission processing). Pick a document type, not a platform.

### K4. Chasing humans for documents and money
Client-side friction: the professional's bottleneck is getting counterparties to hand over papers or pay invoices.
Members: `accounting-P1` (tax documents), `creative-creator-economy-P3` (late invoices), `legal-P5` (93-day lockup), `construction-skilled-trades-P2` (pay apps, lien waivers, 56-day terms), `insurance-P8` (mortgage document chase), `hr-staffing-P3` (timesheets→invoice), `education-P2` (tutor invoicing), `agriculture-P5` (DTC order collection), `creative-creator-economy-P2` (scope creep = uninvoiced work).
Solo takeaway: reminders are commoditized; *teeth* are not. Blocking states ("return can't enter prep queue"), statutory leverage (NY/CA freelance acts), and deposit enforcement are the differentiated versions.

### K5. Fraud and authenticity arms race, AI-accelerated
Cheap AI made identity and claim fraud industrial, and verification tooling at SMB price points hasn't caught up.
Members: `logistics-trucking-P1` (carrier identity fraud), `hr-staffing-P1` (fake candidates), `restaurants-hospitality-P1` (refund fraud), `retail-P5` (returns/INR fraud), `real-estate-property-management-P3` (application fraud), `retail-P2` (suspension false-positives), `education-P4` (AI-cheating accusations), `creative-creator-economy-P6` (slop false-flags).
Solo takeaway: sell the *dispute/verification workflow*, not the detection model — detection is an arms race a solo can't win, but assembling checkable evidence (K1 overlap) is durable.

### K6. Regulation as starting gun — dated deadlines create urgent buyers
Every dated rule below was verified in its source file with a primary or reputable 2026 source.
Members: `npo-solar-P6` (§25D dead 2025-12-31; §48E begin-construction cliff 2026-07-04), `personal-services-P2` (Visa Core Rules ed. 2026-04-18 makes stored-card no-show fees unwinnable), `logistics-trucking-P1` (FMCSA $150k bond July 2026), `healthcare-private-practice-P1` (CMS-0057-F decisions Jan 2026, FHIR PA APIs Jan 2027), `it-msp-P2`/`manufacturing-industrial-P5` (CMMC Phase 1 live Nov 2025; Phase 2 paused July 2026), `hr-staffing-P2` (I-9 enforcement ~10×), `agriculture-P1`/`agriculture-P6` (H-2A/AEWR swings; SAWA pending), `education-P1` (universal-ESA rollouts AR/TN), `retail-P3` (de-minimis repeal), `real-estate-property-management-P2` (Austin platform-delisting 2026-07-01, Chicago registration), `accounting-P7` (OBBBA first filing season), `creative-creator-economy-P3` (NY FIF Aug 2024 + CA FWPA Jan 2025 — first full joint year).
Solo takeaway: a compliance deadline is a marketing calendar. Solo builders can out-ship incumbents to niche deadlines; the risk is single-rule dependence — prefer problems that survive the deadline (H-2A paperwork, ESA formats) over one-shot events.

### K7. Institutional queue-waiting — sell the cockpit, not the queue
Businesses and consumers wait months on opaque bureaucracies with no status visibility and hard deadlines hidden inside.
Members: `healthcare-private-practice-P1`/`P2`/`P3` (prior auth, credentialing, denials), `agriculture-P2` (NRCS/FSA backlog), `legal-P4` (records retrieval), `insurance-P7` (claims status), consumer `D9` (USCIS), `D1` (claim appeals).
Solo takeaway: you can't fix the queue; you can sell status tracking + deadline clocks + next-action prompts + client-safe communications. Buyers pay because silence costs them customers (or coverage).

### K8. Platform-tax revolts — take-rates and fee opacity
Members: `personal-services-P1` (Fresha/Booksy 20–30% take), `restaurants-hospitality-P3`/`P5` (delivery true-cost, $1+/cover reservations), `retail-P1` (per-SKU profit opacity), `retail-P4` (app-stack rent), `creative-creator-economy-P7`, `logistics-trucking-P5` (factoring), consumer `D7`.
Solo takeaway: two viable shapes — fee-audit/visibility tools (safe: read-only, sells with a screenshot of found money) and "own your regulars" direct-rebooking. Avoid picking a fight the platform can end with an API key.

### K9. Coordination chaos in physical operations
Members: `real-estate-property-management-P1` (maintenance triage), `personal-services-P3` (childcare waitlists), `restaurants-hospitality-P6`/`healthcare-private-practice-P6`/`personal-services-P2` (no-shows), `agriculture-P4` (equipment downtime), `auto-P1` (parts hunting), `logistics-trucking-P4` (detention).
Solo takeaway: incumbent field-management suites are enterprise-priced; single-vertical, flat-priced tools win on fit. Beware ops-heavy niches that quietly demand 24/7 support.

### K10. Expertise walking out the door
Members: `manufacturing-industrial-P4` (machinist tribal knowledge), `manufacturing-industrial-P6`, `construction-skilled-trades-P5`, `auto-P4`, `accounting-P3` (CPA pipeline), plus the silver-tsunami macro in [03-emerging-trends.md](03-emerging-trends.md).
Solo takeaway: knowledge-capture per se is change-management-heavy (hard solo). The buildable version is capture-at-the-workflow-moment (quoting assistants that encode the retiring estimator's rules). Treat as tailwind, not product.

### K11. Consumer life-admin — severity high, willingness-to-pay the constraint
Members: `D1`–`D12`. Strongest spend evidence: `D2` (medical-bill negotiation — advocates already charge % of savings), `D11` (credit disputes — spend flows to scam credit-repair), `D9` (USCIS — people pay lawyers for form-filling), `D3` (caregiving — the sandwich generation pays for anything that works, but fragmentation and liability are brutal).
Solo takeaway: B2B2C beats B2C here — sell to the advisor, agency, practice, or employer benefit; direct consumer CAC on episodic problems is a known graveyard. No consumer domain advanced to the shortlist on its own, but several shortlisted B2B problems (ESA invoicing, PA copilot) monetize the same underlying consumer pain from the business side.

### K12. Climate/insurance second-order effects
Members: `insurance-P4` (non-renewal re-shopping), consumer `D8`, `logistics-trucking-P3` (fleet premiums), `auto-P6` (insurer fights), plus the FL/CA data in [03-emerging-trends.md](03-emerging-trends.md) §4.
Solo takeaway: the insurance crisis pays agents and contractors before it pays consumer apps; packet/data tools for the professionals in the flow (K1 overlap) are the solo-viable entry.

## Kill-criteria flags (override scores)

- `auto-P5` (CDK offline continuity) — closed DMS APIs, guaranteed legal/ToS conflict. **Killed.**
- `auto-P4` (ADAS/EV tech training) — life-safety/high-voltage liability. **Killed.**
- `retail-P6` (TikTok Shop ops) — single hostile platform, policy whiplash. **Killed.**
- `creative-creator-economy-P6` (YouTube YPP checks) — single-platform dependence. **Killed.**
- `retail-P2` (Amazon suspension appeals) — platform dependence + grey-market adjacency; viable only as a human service, not solo SaaS. **Flagged.**
- `D10` (consumer childcare search) — marketplace data cold-start. **Killed as consumer product**; provider-side waitlist tool (`personal-services-P3`) remains live.
- `D6` (moving), `D12` (wedding planning apps), `D7` (subscription cancellation) — episodic consumer use, brutal CAC, and (D7) a crowded field with the FTC rule vacated. **Killed.**
- `healthcare-private-practice-P8` (billing-in-a-box) — full clearinghouse/PHI custodianship exceeds solo compliance surface unless scoped to coaching/tooling around an existing biller. **Flagged.**
- `auto-P2` core (owning calibration rigs) — $55k+ capex; only the documentation wedge survives (folded into K1). **Flagged.**

## Dedupe and merge notes

- `creative-creator-economy-P1` = `personal-services-P8` (HoneyBook/Dubsado price ratchet) — same problem, photographer vs wedding-vendor lens.
- `personal-services-P3` ↔ `D10` — childcare waitlists, provider side vs parent side. Provider side is the sellable one.
- `insurance-P4` ↔ `D8` — home-insurance non-renewals, agent side vs homeowner side.
- `healthcare-private-practice-P6` ≈ `restaurants-hospitality-P6` ≈ `personal-services-P2` — no-show economics; `personal-services-P2` carries the differentiated (Visa-compliance) wedge.
- `it-msp-P2` ↔ `manufacturing-industrial-P5` — CMMC from the seller (MSP) vs the subject (job shop). Same evidence workspace could serve both.
- `education-P5` ≈ `creative-creator-economy-P7` — course-platform rug-pulls; migration is the wedge in both.
- `agriculture-P1` + `agriculture-P6` — H-2A paperwork + wage volatility; one buyer, one product surface.
- `accounting-P1` ≈ `insurance-P8` (mortgage) ≈ `legal` intake docs — the K4 chase shape; accounting has the best channel (r/taxpros) and season urgency.

## Shortlist advanced to validation (06)

Fifteen candidates, chosen for weighted score, cluster diversity, kill-check pass, and channel quality. Validation (competition, pricing landscape, channel size, solo feasibility) happens in [06-shortlist-validation.md](06-shortlist-validation.md).

1. `manufacturing-industrial-P1` (40.5) — job-shop quoting wedge under Paperless Parts' $18k/yr umbrella.
2. `personal-services-P2` (40.5) — Visa-compliant deposit/no-show enforcement for beauty/health booking.
3. `accounting-P1` (39.5) — tax-season document chaser with teeth (blocking states, SMS-first).
4. `agriculture-P1` (39.5) — H-2A filing cockpit for 5–40 worker farms vs $1.5k–3.5k/filing agents.
5. `npo-solar-P1` (39.5) — grant-award ledger + reporting deadlines on top of QBO.
6. `npo-solar-P6` (41.0) — 2026-correct solar incentive/TPO quote engine (top score; shrinking-market risk to test).
7. `healthcare-private-practice-P1` (38.5) — prior-auth packet copilot for small specialty practices (CMS-0057-F tailwind; PHI-light design required).
8. `creative-creator-economy-P3` (38.5) — freelance invoice enforcement riding NY FIF / CA FWPA statutes.
9. `insurance-P2` (38.0) — commission-statement reconciliation for HawkSoft/EZLynx/AMS360 shops Applied won't serve.
10. `hr-staffing-P1` (38.0) — candidate-authenticity pre-screen at SMB prices.
11. `logistics-trucking-P1` (38.0) — $30–50/mo carrier-vetting copilot + auditable due-diligence PDF for solo brokers.
12. `restaurants-hospitality-P1` (37.5) — delivery error-charge dispute packets (camera clip + POS match).
13. `education-P1` (37.0) — ESA-proof invoicing + receivables for microschools/tutors.
14. `real-estate-property-management-P2` (37.0) — STR per-city license/renewal/tax compliance tracker.
15. `it-msp-P1`+`P2` (36.5 ×2, same buyer/channel) — multi-tenant compliance-evidence vault for MSPs (cyber-insurance + CMMC).

**Cut at the gate despite Tier-A scores** (rationale, so the cut is transparent):

- `legal-P1` (39.5) — AI-receptionist/intake is a VC gold rush (Smith.ai plus a wave of AI voice startups already selling into r/LawFirm threads); a solo enters as the tenth vendor in the thread. The underlying pain is real; the *category* is crowded (whitespace 2 in its own file).
- `construction-skilled-trades-P1` (39.0) — AI takeoff has multiple funded players (Togal, Kreo, Beam cited in-thread); single-trade wedge remains plausible but conviction requires beating funded incumbents on their core feature.
- `insurance-P1` (38.0) — strongest survey evidence in the study (Ivans n>700), but the fix collides with closed carrier portals and a funded "AI submission" wave; the adjacent, unserved wedge is `insurance-P2` (advanced instead).
- `accounting-P2`/`accounting-P7` (38.0) — real and timely, but shaped like consulting/content products with a TAM ceiling; folded into the `accounting-P1` product surface where relevant.
- `creative-creator-economy-P4` (38.0) — speed-to-lead tooling is saturated horizontally; the differentiated wedge was already captured by `creative-creator-economy-P3`.
- `npo-solar-P3` (36.0) — macro funding collapse, no product surface a solo can sell into the panic responsibly.

## Full ranked table (145 problems)

Dimension key: S = severity×frequency, W = willingness-to-pay, R = reachability, B = solo-buildability, Wh = whitespace, N = why-now. Each ID's full evidence pack lives in its source file under `02-industries/` (consumer `D*` IDs in `04-consumer-cross-cutting.md`).

| # | Tier | Score /45 | ID | Problem | S/W/R/B/Wh/N | Source file |
|---|---|---|---|---|---|---|
| 1 | A | 41.0 | `npo-solar-P6` | The 30% homeowner solar credit is gone; installers who still sell "the ITC" are one IRS letter from a lawsuit, and cas… | 5/5/4/4/4/5 | `nonprofits-energy-solar` |
| 2 | A | 40.5 | `manufacturing-industrial-P1` | Job-shop quoting still lives in Excel + one person’s head — RFQs sit days while the estimator is on a machine | 5/5/5/4/3/4 | `manufacturing-industrial` |
| 3 | A | 40.5 | `personal-services-P2` | No-show fees charged to a card-on-file lose chargebacks; the deposit UX incumbents ship is not Visa-compliant | 5/4/5/4/4/5 | `personal-services` |
| 4 | A | 39.5 | `accounting-P1` | Tax season is a document-chase: clients drop incomplete files, then firms spend weeks nagging for the missing 1099 | 5/5/5/4/2/4 | `accounting-bookkeeping-tax` |
| 5 | A | 39.5 | `agriculture-P1` | H-2A is the only legal seasonal labor path and it is a three-agency paperwork tax — farmers pay $1.5k–$3.5k per filing… | 5/5/4/3/4/5 | `agriculture` |
| 6 | A | 39.5 | `legal-P1` | Inbound leads die on the phone: firms answer as little as 7% of intake calls and lose the rest to voicemail and phone … | 5/5/5/4/2/4 | `legal-services` |
| 7 | A | 39.5 | `npo-solar-P1` | Grant reporting is a spreadsheet OS: deadlines, restrictions, and spend-downs live outside the GL | 5/4/5/4/3/5 | `nonprofits-energy-solar` |
| 8 | A | 39.5 | `personal-services-P1` | Marketplace booking apps tax independents 20–30% of new-client revenue and then charge a subscription on top | 5/5/5/4/2/4 | `personal-services` |
| 9 | A | 39.0 | `construction-skilled-trades-P1` | Quantity takeoff eats 8-10 hours per bid and is the bottleneck on how much work a contractor can win | 5/5/4/4/3/4 | `construction-skilled-trades` |
| 10 | A | 38.5 | `creative-creator-economy-P3` | Late invoices are the norm — 85% of freelancers hit them; 42% miss personal bills because a client sat on AP | 5/4/5/4/3/4 | `creative-creator-economy` |
| 11 | A | 38.5 | `healthcare-private-practice-P1` | Prior authorization is manual, per-payer combat that forces practices to hire dedicated staff | 5/5/4/3/3/5 | `healthcare-private-practice` |
| 12 | A | 38.0 | `accounting-P2` | Intuit’s QBO/Desktop price machine is eating firm margins — firms absorb it silently, then become the bad guy to clien… | 4/5/5/3/3/5 | `accounting-bookkeeping-tax` |
| 13 | A | 38.0 | `accounting-P7` | OBBBA + tax-law complexity is now the #1 current issue for the smallest firms — new deductions, new docs, new E&O | 5/4/5/3/3/5 | `accounting-bookkeeping-tax` |
| 14 | A | 38.0 | `creative-creator-economy-P4` | Inquiry inbox is a second job — Google Ads leads ghost, branded follow-ups die in spam, photographers lose bookings to… | 5/4/5/5/2/3 | `creative-creator-economy` |
| 15 | A | 38.0 | `hr-staffing-P1` | AI-generated applications and outright fake candidates have made screening slow, expensive, and untrustworthy | 5/4/4/4/3/5 | `hr-staffing` |
| 16 | A | 38.0 | `insurance-P1` | Cross-carrier quoting is still copy-paste: 74% of agents name re-keying as their top workflow pain, and 90% have pulle… | 5/5/5/3/2/4 | `insurance-financial-services` |
| 17 | A | 38.0 | `insurance-P2` | Commission statements arrive as 20 mutually unintelligible PDFs/CSVs; back office spends days in VLOOKUP and still lea… | 5/5/4/4/3/3 | `insurance-financial-services` |
| 18 | A | 38.0 | `logistics-trucking-P1` | Carrier-identity fraud and double brokering industrialized, and small brokers vet carriers by manually calling FMCSA | 5/4/4/4/3/5 | `logistics-trucking` |
| 19 | A | 37.5 | `legal-P2` | Lawyers work 8 hours but get paid for 2.4: time capture, narrative rewriting, and admin eat the day | 5/4/5/4/2/4 | `legal-services` |
| 20 | A | 37.5 | `manufacturing-industrial-P5` | Defense/aero RFQs now demand FAI + C of C + MTRs + ITAR file handling + CMMC — small shops drown in the packet, not th… | 4/5/4/3/4/5 | `manufacturing-industrial` |
| 21 | A | 37.5 | `restaurants-hospitality-P1` | Delivery-app refund fraud is systemic and the platforms robo-deny merchant disputes — owners run camera rigs and sprea… | 4/4/5/4/4/4 | `restaurants-hospitality` |
| 22 | B | 37.0 | `agriculture-P2` | Conservation and FSA money is on the table but NRCS/FSA staffing collapsed — farmers wait 2.5 years and pay 8% interes… | 4/4/4/4/4/5 | `agriculture` |
| 23 | B | 37.0 | `auto-P2` | ADAS calibration is mandatory, high-margin work independents are priced out of owning | 5/5/4/2/3/5 | `automotive-services` |
| 24 | B | 37.0 | `creative-creator-economy-P2` | Scope creep is how creatives donate $2k+ per project — contracts exist, change orders do not | 5/3/5/5/3/3 | `creative-creator-economy` |
| 25 | B | 37.0 | `education-P1` | ESA/voucher money is gushing but the payment rails are broken — providers wait 45-60+ days to get paid and parents dro… | 4/4/4/4/4/5 | `education-training` |
| 26 | B | 37.0 | `real-estate-property-management-P2` | STR licensing has gone from fine-risk to delisting-risk, and hosts have no tooling to track per-city compliance | 4/4/4/4/4/5 | `real-estate-property-management` |
| 27 | B | 36.5 | `accounting-P4` | Practice-management suites that were supposed to kill the chase are now themselves the headache (setup hours, payments… | 4/4/5/4/3/4 | `accounting-bookkeeping-tax` |
| 28 | B | 36.5 | `it-msp-P1` | Cyber-insurance questionnaires and carrier evidence requests force a recurring multi-tool evidence scramble | 4/4/5/4/3/4 | `it-services-msp` |
| 29 | B | 36.5 | `it-msp-P2` | CMMC compliance-as-a-service demand is exploding but MSPs run it on Excel and hourly labor | 4/5/4/3/3/5 | `it-services-msp` |
| 30 | B | 36.5 | `real-estate-property-management-P6` | Post-settlement agents drown in per-deal paperwork and pay $300-600/file for transaction coordinators | 4/4/5/4/3/4 | `real-estate-property-management` |
| 31 | B | 36.5 | `restaurants-hospitality-P2` | Invoice line-item price tracking is a weekly manual chore — incumbents cost $300+/mo and owners are canceling to build… | 4/4/5/4/3/4 | `restaurants-hospitality` |
| 32 | B | 36.5 | `retail-P1` | Sellers can't see true per-SKU profit after marketplace fees, ads, refunds, and COGS — "Seller Central shows you reven… | 5/4/5/4/2/3 | `retail-ecommerce` |
| 33 | B | 36.0 | `construction-skilled-trades-P2` | Subs wait ~56 days to get paid while supplier terms run 30-45 — and change orders/lien-waiver traps silently forfeit m… | 5/4/4/4/3/3 | `construction-skilled-trades` |
| 34 | B | 36.0 | `construction-skilled-trades-P3` | Field-service and construction software pricing has become extractive — per-tech fees, tier jumps, and paid add-ons fo… | 4/5/5/3/3/3 | `construction-skilled-trades` |
| 35 | B | 36.0 | `creative-creator-economy-P1` | HoneyBook (and Dubsado Premiere) keep raising prices on the same CRM — photographers and wedding videographers are rag… | 4/5/5/3/2/4 | `creative-creator-economy` |
| 36 | B | 36.0 | `education-P2` | Solo tutors and private studios run their business on spreadsheets + Venmo and lose hours weekly to invoicing, schedul… | 4/4/5/5/2/3 | `education-training` |
| 37 | B | 36.0 | `healthcare-private-practice-P2` | Payer credentialing/enrollment takes 3-8 months per provider and burns $8k-35k of billings per idle month | 4/5/4/4/3/3 | `healthcare-private-practice` |
| 38 | B | 36.0 | `healthcare-private-practice-P8` | Solo practices hand 5-9% of collections to billers because insurance billing is too fiddly to do in-house | 4/5/5/3/3/3 | `healthcare-private-practice` |
| 39 | B | 36.0 | `it-msp-P3` | Vendor contract auto-renewal traps (Kaseya, ConnectWise) ambush MSPs into multi-year lock-ins and phantom billing | 4/3/5/5/4/3 | `it-services-msp` |
| 40 | B | 36.0 | `legal-P3` | Clio's price ladder ($1,609/user/yr + add-on modules) has loyalists actively shopping for exits | 4/5/5/3/3/3 | `legal-services` |
| 41 | B | 36.0 | `manufacturing-industrial-P7` | Customers send incomplete RFQs (STEP with no tolerances) and shops burn 30 minutes of estimator time before they can e… | 4/3/5/5/3/4 | `manufacturing-industrial` |
| 42 | B | 36.0 | `npo-solar-P2` | Blackbaud Raiser's Edge is a $35k/yr hostage with 3-year contracts, 40% step-ups, and an unfinished NXT overlay | 4/5/5/3/2/4 | `nonprofits-energy-solar` |
| 43 | B | 36.0 | `npo-solar-P3` | 2025–26 federal grant collapse + proposed 2 CFR 200 rewrite is killing small orgs' cash and forcing a scramble to priv… | 5/3/5/3/3/5 | `nonprofits-energy-solar` |
| 44 | B | 36.0 | `real-estate-property-management-P1` | Maintenance coordination at small PM firms is untriaged chaos — 60 owners with 60 different approval rules and no syst… | 5/4/4/4/3/3 | `real-estate-property-management` |
| 45 | B | 35.8 | `D3` | Caregiving / eldercare admin (sandwich generation) | 4.5/4.5/4/2.5/4/4 | `04-consumer-cross-cutting` |
| 46 | B | 35.5 | `agriculture-P4` | A $400k–$800k machine still goes limp on a sensor until a dealer tech is free — harvest does not wait | 4/4/4/3/4/5 | `agriculture` |
| 47 | B | 35.5 | `auto-P1` | Parts prices and fitment hunting eat an extra hour a day and are now the #1 shop problem | 5/4/4/3/3/4 | `automotive-services` |
| 48 | B | 35.5 | `construction-skilled-trades-P4` | Trades miss 20-60% of inbound calls and routinely ghost quote requests — leads leak at both ends | 4/4/4/5/2/4 | `construction-skilled-trades` |
| 49 | B | 35.5 | `insurance-P7` | Producers spend 60%+ of the day on admin (claims status, billing, compliance) instead of selling | 5/4/4/3/3/4 | `insurance-financial-services` |
| 50 | B | 35.5 | `restaurants-hospitality-P3` | Third-party delivery's true cost is opaque — advertised 15-30% lands at 28-35%+ and owners can't see per-channel profi… | 4/4/5/4/3/3 | `restaurants-hospitality` |
| 51 | B | 35.5 | `retail-P3` | De-minimis repeal turned every small cross-border parcel into a customs entry with $25–75 brokerage on a $50 order | 4/4/4/3/4/5 | `retail-ecommerce` |
| 52 | B | 35.5 | `retail-P4` | The Shopify app-stack is a second rent: $400+/mo of overlapping subscriptions merchants can't audit | 4/4/5/4/3/3 | `retail-ecommerce` |
| 53 | B | 35.2 | `D9` | Immigration / USCIS paperwork and case tracking | 4.5/4/4.5/3/3/4 | `04-consumer-cross-cutting` |
| 54 | B | 35.0 | `accounting-P3` | There are not enough experienced staff, so small firms buy $950–$3,500/mo offshore capacity and still drown in review | 5/5/4/2/3/3 | `accounting-bookkeeping-tax` |
| 55 | B | 35.0 | `insurance-P6` | E&O sits on inconsistent courtesy calls and missed renewals — one skipped cancellation notice can be a six-figure clai… | 4/4/4/4/3/4 | `insurance-financial-services` |
| 56 | B | 35.0 | `npo-solar-P4` | Looking for grants costs $500/mo, so small shops pirate a one-month Instrumentl binge into a spreadsheet | 4/4/5/3/3/4 | `nonprofits-energy-solar` |
| 57 | B | 35.0 | `npo-solar-P5` | Board packets still mean hours of GL→Excel remapping and 20–100 page PDFs nobody reads | 4/3/5/5/3/3 | `nonprofits-energy-solar` |
| 58 | B | 34.5 | `accounting-P8` | CAS is the growth engine, but small firms cannot scale it on QBO + email + hourly habits | 4/5/4/3/2/4 | `accounting-bookkeeping-tax` |
| 59 | B | 34.5 | `healthcare-private-practice-P3` | Claim denials keep rising and 90% of rework is still human labor | 5/4/4/3/2/4 | `healthcare-private-practice` |
| 60 | B | 34.5 | `healthcare-private-practice-P4` | Solo-therapist EHRs are jacking prices and adding per-claim fees after PE buyouts, and switching is painful | 3/4/5/4/3/4 | `healthcare-private-practice` |
| 61 | B | 34.5 | `hr-staffing-P2` | I-9/E-Verify enforcement surged ~10x and newly reclassified paperwork errors are immediately fineable | 4/4/4/3/3/5 | `hr-staffing` |
| 62 | B | 34.5 | `insurance-P3` | Carrier appetite changes live in reps’ heads and a spreadsheet nobody updates — agencies find out when the renewal is … | 4/3/5/4/3/4 | `insurance-financial-services` |
| 63 | B | 34.5 | `it-msp-P4` | QBR and client-report prep is hours of manual multi-tool data consolidation per client | 4/4/5/4/2/3 | `it-services-msp` |
| 64 | B | 34.5 | `it-msp-P5` | Leaving ConnectWise means losing a decade of PSA data or paying thousands to keep it readable | 3/4/5/4/4/3 | `it-services-msp` |
| 65 | B | 34.5 | `legal-P4` | Medical-records retrieval is a months-long fight with Datavant/Ciox that blows discovery deadlines | 5/4/4/3/4/2 | `legal-services` |
| 66 | B | 34.5 | `legal-P5` | Getting paid: 93 days of lockup and "thousands in unpaid invoices" chased with manual warnings | 4/4/5/4/3/2 | `legal-services` |
| 67 | B | 34.5 | `manufacturing-industrial-P3` | Accepted quotes die in the CRM-to-ERP dead zone — re-keying leaks margin and delays cash | 4/4/3/4/4/4 | `manufacturing-industrial` |
| 68 | B | 34.5 | `personal-services-P3` | Childcare directors run waitlists and room-transitions on paper and Excel while infant seats sit empty and parents wai… | 5/4/4/3/3/3 | `personal-services` |
| 69 | B | 34.5 | `retail-P2` | Amazon account suspension is an existential event with a documented $495–$8,000 grey market for appeals and 30–180-day… | 4/5/4/3/3/3 | `retail-ecommerce` |
| 70 | B | 34.0 | `creative-creator-economy-P5` | Brand deals live in Gmail + Notes + WhatsApp — creators forget to invoice, miss usage-rights traps, and lose $3k–$5k/y… | 4/4/4/4/2/4 | `creative-creator-economy` |
| 71 | B | 34.0 | `logistics-trucking-P2` | Small fleets and brokerages run on notebooks and 2009-era TMS because modern TMS pricing starts at enterprise scale | 4/4/4/4/3/3 | `logistics-trucking` |
| 72 | B | 34.0 | `manufacturing-industrial-P4` | When the best machinist retires, setups, quoting instincts, and scrap-calls walk out — nothing in the router captures … | 4/3/4/4/3/5 | `manufacturing-industrial` |
| 73 | B | 34.0 | `npo-solar-P7` | NEM 3.0 already wrecked CA installer cash-flow; 2026 adds another contraction on the federal sunset | 5/4/3/3/3/4 | `nonprofits-energy-solar` |
| 74 | B | 34.0 | `personal-services-P5` | Pool-route software prices per stop so a busy May costs 3–6× a slow month, and payment processing is the hidden tax | 4/4/4/4/3/3 | `personal-services` |
| 75 | B | 34.0 | `real-estate-property-management-P4` | STR channel managers are expensive and unreliable — sync failures cause double-bookings and support is a black hole | 4/4/5/3/3/3 | `real-estate-property-management` |
| 76 | B | 33.8 | `D2` | Medical billing errors and negotiation | 4/4/3.5/4/3/3.5 | `04-consumer-cross-cutting` |
| 77 | B | 33.5 | `auto-P6` | Collision shops lose hours fighting insurers on supplements, calibrations, and CCC valuations | 4/4/4/3/3/4 | `automotive-services` |
| 78 | B | 33.5 | `creative-creator-economy-P8` | Couples pay $3,500 and wait 17–22 weeks for galleries — creator burnout is a consumer-trust problem | 4/3/5/4/3/3 | `creative-creator-economy` |
| 79 | B | 33.5 | `insurance-P4` | Homeowners non-renewals dumped onto independent agents who must re-shop FAIR Plan + DIC + admitted markets inside a 75… | 4/4/4/3/3/4 | `insurance-financial-services` |
| 80 | B | 33.5 | `logistics-trucking-P3` | Insurance renewals are up 15-25%/yr and CSA scores now swing premiums 50-100%, but small carriers don't manage either … | 5/3/4/3/3/4 | `logistics-trucking` |
| 81 | B | 33.5 | `personal-services-P8` | Wedding-vendor CRMs (HoneyBook) hiked ~90% in 2025 while photographers still rebuild reports in spreadsheets | 3/4/5/4/2/4 | `personal-services` |
| 82 | B | 33.5 | `real-estate-property-management-P3` | Rental application fraud is industrializing — template farms and AI-edited paystubs beat standard screening | 4/4/4/3/2/5 | `real-estate-property-management` |
| 83 | B | 33.5 | `retail-P5` | Returns and refund fraud (INR claims, returnless-refund abuse) drains 4-figure monthly sums and nobody checks the evid… | 4/4/4/3/3/4 | `retail-ecommerce` |
| 84 | B | 33.5 | `D11` | Debt collection and credit-report disputes | 4.5/3.5/4/3/3/4 | `04-consumer-cross-cutting` |
| 85 | C | 33.0 | `agriculture-P5` | DTC meat/produce still runs on email + phone — variable-weight cuts, custom butcher orders, and CSA boxes oversell and… | 4/4/4/4/2/3 | `agriculture` |
| 86 | C | 33.0 | `manufacturing-industrial-P2` | Job-shop ERP is either a $37k+ clunker (JobBOSS/E2) or a $90k NetSuite overkill — shops stay on QuickBooks + duct tape | 4/5/4/2/3/3 | `manufacturing-industrial` |
| 87 | C | 33.0 | `npo-solar-P8` | Homeowners love solar and hate solar companies — production estimates are gamed in Aurora, 2025 rush jobs are failing … | 4/3/4/4/3/4 | `nonprofits-energy-solar` |
| 88 | C | 33.0 | `restaurants-hospitality-P4` | POS fee creep: Toast raised software 18% then processing again five months later, and owners can't audit line items th… | 3/4/5/3/3/4 | `restaurants-hospitality` |
| 89 | C | 33.0 | `D1` | Health-insurance claim denials and appeals | 5/2.5/4/3/2.5/5 | `04-consumer-cross-cutting` |
| 90 | C | 32.5 | `accounting-P5` | The tax engines firms already pay for go dark at deadlines (CCH, Thomson Reuters, Intuit e-file) | 5/4/5/2/2/2 | `accounting-bookkeeping-tax` |
| 91 | C | 32.5 | `accounting-P6` | Bank feeds lie: bookkeepers spend 6 hours a month re-keying because QBO/Xero miss transactions or duplicate them | 4/4/4/3/3/3 | `accounting-bookkeeping-tax` |
| 92 | C | 32.5 | `creative-creator-economy-P7` | Platform take-rates and price hikes (Kajabi, Kit, Patreon) tax the ones who actually made it | 4/4/4/3/2/4 | `creative-creator-economy` |
| 93 | C | 32.5 | `education-P3` | Special-ed teachers spend hours per student per cycle on IEP writing and goal progress-monitoring data, mostly on pape… | 5/3/4/3/3/3 | `education-training` |
| 94 | C | 32.5 | `education-P4` | The AI-cheating arms race: detectors are unreliable, grading suspected-AI work takes multiples longer, and false accus… | 4/3/4/3/3/5 | `education-training` |
| 95 | C | 32.5 | `education-P5` | Course creators got rug-pulled: Teachable's forced 2025 migration tripled bills and Kajabi raised entry to $143/mo — m… | 4/4/4/3/2/4 | `education-training` |
| 96 | C | 32.5 | `education-P6` | Grading double-entry: scores get written on paper, then re-typed into the SIS gradebook — pure duplicated labor at 150… | 5/2/5/4/2/3 | `education-training` |
| 97 | C | 32.5 | `logistics-trucking-P5` | Factoring is a 36%-APR habit wrapped in per-page fees, reserve holdbacks, and $1k-25k exit penalties | 4/4/4/3/3/3 | `logistics-trucking` |
| 98 | C | 32.0 | `hr-staffing-P3` | Staffing back office (timesheets → payroll → invoice → collection) runs on spreadsheets while payroll is due decades b… | 4/5/3/3/3/2 | `hr-staffing` |
| 99 | C | 32.0 | `legal-P7` | AI-hallucination sanctions are now a tracked, accelerating risk — and verification is manual | 3/3/4/4/3/5 | `legal-services` |
| 100 | C | 32.0 | `logistics-trucking-P4` | Detention devours 135M hours a year and fleets collect on fewer than half the detention invoices they send | 4/3/4/4/3/3 | `logistics-trucking` |
| 101 | C | 32.0 | `D4` | Death / estate administration ("death admin") | 4/4/3/4/3/2.5 | `04-consumer-cross-cutting` |
| 102 | C | 31.5 | `legal-P6` | Calendaring and deadline errors remain the top preventable malpractice source for small firms | 4/4/4/3/3/2 | `legal-services` |
| 103 | C | 31.5 | `real-estate-property-management-P7` | Self-managed HOA officers are volunteers drowning in Excel — dues invoicing, books, and records with no budget for rea… | 3/3/4/5/4/2 | `real-estate-property-management` |
| 104 | C | 31.2 | `D8` | Home-insurance non-renewals and premium spikes (consumer side) | 4/2.5/3.5/3/4/4.5 | `04-consumer-cross-cutting` |
| 105 | C | 31.0 | `creative-creator-economy-P6` | YouTube’s July 2025 “inauthentic content” rule + AI slop flood: human creators compete with templated channels and als… | 4/2/5/3/3/4 | `creative-creator-economy` |
| 106 | C | 31.0 | `healthcare-private-practice-P6` | Cancellations and no-shows silently eat 15-23% of the schedule and existing reminder tools haven't fixed it | 4/3/4/4/2/3 | `healthcare-private-practice` |
| 107 | C | 31.0 | `hr-staffing-P4` | FMLA/ADA/leave-of-absence tracking at SMBs lives in hand-built Excel while dedicated tools are "outrageously expensive… | 3/4/4/4/3/2 | `hr-staffing` |
| 108 | C | 31.0 | `hr-staffing-P5` | HR departments of one drown in compliance chasing — licenses, trainings, attestations — with no escalation system | 4/3/4/4/3/2 | `hr-staffing` |
| 109 | C | 31.0 | `it-msp-P6` | Client documentation is stuck between a stagnant hostage (IT Glue) and an imperfect escape (Hudu), and migration burns… | 3/4/5/3/2/3 | `it-services-msp` |
| 110 | C | 31.0 | `logistics-trucking-P6` | The back office runs on outsourcing tolls: 5-10% to a dispatcher, paperwork nitpicks delay payment, and quarterly IFTA… | 3/4/4/4/2/3 | `logistics-trucking` |
| 111 | C | 31.0 | `retail-P6` | TikTok Shop ops are chaos: forced logistics migration (Feb 2026), fee stacking, and penalty loops sellers can't escape | 4/3/4/2/3/5 | `retail-ecommerce` |
| 112 | C | 31.0 | `D5` | Renting: deposits, repairs, landlord disputes | 3.5/2/4.5/4.5/3.5/3 | `04-consumer-cross-cutting` |
| 113 | C | 30.5 | `auto-P3` | Service-info subscriptions run ~$200–$300/mo and small shops share logins or go without | 4/4/5/2/2/2 | `automotive-services` |
| 114 | C | 30.5 | `hr-staffing-P6` | Bullhorn's post-acquisition decay taxes every agency: click-heavy UI, broken search, junk data, 48-hour support, nicke… | 4/4/4/3/2/2 | `hr-staffing` |
| 115 | C | 30.5 | `insurance-P5` | The AMS tax is real: Epic at $3.5k+/mo, AMS360 +14% YoY, $18–22k to leave — small shops feel trapped in 2014 UX | 3/5/5/2/2/2 | `insurance-financial-services` |
| 116 | C | 30.5 | `personal-services-P4` | Mindbody price hikes, outages, and a ~$500 data-export ransom trap boutique studios in a clunky stack | 4/4/4/3/2/2 | `personal-services` |
| 117 | C | 30.5 | `real-estate-property-management-P5` | Property management software fee-stacking: per-unit minimums, resident junk fees, and ~8% annual increases with no exi… | 3/4/4/3/3/3 | `real-estate-property-management` |
| 118 | C | 30.5 | `retail-P7` | Klaviyo-style contact-count pricing punishes list hygiene — merchants literally cannot delete profiles that inflate th… | 3/4/4/3/3/3 | `retail-ecommerce` |
| 119 | C | 30.0 | `agriculture-P3` | Farm data is split across Deere Operations Center and FieldView — growers still USB-stick scripts and cannot merge the… | 4/3/3/3/3/4 | `agriculture` |
| 120 | C | 30.0 | `construction-skilled-trades-P6` | Permitting and regulatory compliance now add $131,734 to a new home and 7 months of delay — and tracking it all is man… | 4/3/3/3/3/4 | `construction-skilled-trades` |
| 121 | C | 29.5 | `agriculture-P6` | AEWR and H-2A wage methodology swung again for 2026–27 — specialty-crop labor cost is now a planning risk, not a line … | 3/3/3/4/3/4 | `agriculture` |
| 122 | C | 29.5 | `construction-skilled-trades-P5` | The skilled-labor shortage is now the #1 cause of project delays, and firms can't assess or onboard the people they do… | 5/3/3/2/2/4 | `construction-skilled-trades` |
| 123 | C | 29.5 | `healthcare-private-practice-P5` | Veterinary practice software is obsolete, hated, and wrapped in diagnostics vendor lock-in | 4/3/4/3/3/2 | `healthcare-private-practice` |
| 124 | C | 29.5 | `healthcare-private-practice-P7` | PT clinics are hostage to WebPT outages and click-heavy documentation that doesn't talk to billing | 4/3/4/3/2/3 | `healthcare-private-practice` |
| 125 | C | 29.5 | `it-msp-P7` | MSPs can't prove their value to buyers — acquisition stalls and deals shrink | 4/3/5/2/2/3 | `it-services-msp` |
| 126 | C | 29.5 | `personal-services-P6` | Funeral directors still chauffeur paper death certificates across town while families wait on insurance and estates | 4/3/3/2/4/4 | `personal-services` |
| 127 | C | 29.5 | `restaurants-hospitality-P5` | Reservation platforms charge $1+/cover for the restaurant's own Google traffic, and quitting costs real bookings | 3/4/4/3/2/3 | `restaurants-hospitality` |
| 128 | C | 29.2 | `D7` | Subscription cancellation and dark patterns | 3.5/3/4/3.5/1.5/3.5 | `04-consumer-cross-cutting` |
| 129 | C | 29.0 | `auto-P5` | CDK's 2024 outage cost dealers $1.02B and left a trust hole no independent DMS can legally fill — but offline ops stil… | 3/5/2/2/4/3 | `automotive-services` |
| 130 | C | 29.0 | `insurance-P8` | On the consumer/mortgage side: servicing, escrow, and credit-reporting disputes dwarf origination complaints — LOs sti… | 4/3/3/3/3/3 | `insurance-financial-services` |
| 131 | C | 29.0 | `restaurants-hospitality-P6` | No-shows cost ~$49k/location/yr, and deposit tooling either adds booking friction or hands platforms another fee | 3/3/4/4/2/3 | `restaurants-hospitality` |
| 132 | C | 28.5 | `auto-P7` | Cloud shop-management (Shopmonkey 2.0 especially) is $239–$499/mo, buggy after upgrades, and weak on QuickBooks | 3/4/4/3/2/2 | `automotive-services` |
| 133 | C | 28.5 | `education-P7` | PowerSchool's breach poisoned trust in the K-12 SIS, but switching is so painful that districts renew anyway — small/p… | 3/4/3/2/3/4 | `education-training` |
| 134 | C | 28.5 | `manufacturing-industrial-P6` | Reshoring is sending RFQs to shops that cannot staff the work — 66% cannot hire technicians | 5/2/3/2/2/5 | `manufacturing-industrial` |
| 135 | C | 28.5 | `personal-services-P7` | Residential cleaning outgrows spreadsheets into $200+/mo field-service tools that still don't nail recurring + Google … | 3/4/4/3/2/2 | `personal-services` |
| 136 | C | 28.2 | `D12` | Wedding planning: vendor coordination and deposits | 2.5/2/4.5/4/4/2.5 | `04-consumer-cross-cutting` |
| 137 | C | 28.0 | `logistics-trucking-P7` | The DAT duopoly raises prices ~8%/yr while uptime, data freshness, and fraud controls decay — and users feel they can'… | 3/4/4/2/2/3 | `logistics-trucking` |
| 138 | C | 28.0 | `restaurants-hospitality-P7` | Small-hotel PMS is a support desert — Cloudbeds users report broken sites, AI-bot support, and integration taxes on ev… | 4/3/3/3/3/2 | `restaurants-hospitality` |
| 139 | C | 27.5 | `it-msp-P8` | Vulnerability management & third-party patching tooling is fragmented and priced above SMB-client economics | 3/3/5/2/2/3 | `it-services-msp` |
| 140 | C | 27.5 | `D10` | Childcare search and waitlists | 4/2.5/4/2/3/2.5 | `04-consumer-cross-cutting` |
| 141 | C | 26.5 | `auto-P4` | Shops cannot hire or train ADAS/EV-capable techs, so work walks or gets sublet | 4/3/3/2/2/3 | `automotive-services` |
| 142 | C | 26.5 | `hr-staffing-P7` | Contractor (1099) classification rules are in flux again, leaving SMBs and staffing firms guessing which test applies | 3/3/3/2/3/4 | `hr-staffing` |
| 143 | C | 25.5 | `auto-P8` | EV service looks obligatory but the real check is $5k–$100k plus insurance, so shops stall | 3/3/3/2/3/3 | `automotive-services` |
| 144 | C | 25.0 | `D6` | Moving | 2.5/1.5/3/4/4/2.5 | `04-consumer-cross-cutting` |
| 145 | C | 24.0 | `retail-P8` | Etsy payment reserves freeze 5-figure sums for 90+ days exactly when a shop goes viral | 3/2/4/2/3/2 | `retail-ecommerce` |
