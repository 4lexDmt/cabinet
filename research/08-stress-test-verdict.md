# Independent Pay-Conversion Stress Test — Results and Verdicts

- **Run:** 2026-09-17. System design in [08-stress-test/protocol.md](08-stress-test/protocol.md); machine artifacts (blinded cards, three auditors' raw scores, full 145-row ranking, agreement stats, build/aggregation scripts) in [08-stress-test/](08-stress-test/).
- **What was tested:** all 145 evidenced problems, re-scored blind on one question only — *how likely is the affected customer to actually pay?* — by three independent auditor agents who were forbidden from reading the original scores, clusters, validation, or picks. New rubric (revealed spend ×3, budget authority, forcing function, do-nothing cost, software-solvability, free-alternative pressure, payment culture), six hard-fail flags, mandatory free-alternative web checks for anything ranked high, deterministic aggregation.
- **Reliability:** 25 cards were scored by all three auditors. Mean pairwise disagreement 4.7 PAY points, median 3.6 (0–100 scale) — the instrument is consistent. The most contested card in the whole overlap set differed by only 19.6 points. Caveat: the 120 non-overlap cards have one rater each (uncertainty ≈ ±5 points, and no consensus-flag check possible); all five picks and all fifteen validated candidates were in the triple-scored overlap set, so **every verdict below rests on three independent raters**.

## Headline: the five picks — two fly, one wounded, two die

| Pick | PAY (consensus) | Pay rank /145 | Flags (consensus) | Top-quartile votes | Verdict |
|---|---|---|---|---|---|
| Tax-season document chaser (`accounting-P1`) | 76.8 | 27 | none | 2/3 | **FLY** |
| Job-shop quoting (`manufacturing-industrial-P1`) | 71.4 | 45 | none | 0/3 | **WOUNDED — leans fly** |
| Visa-clean deposits (`personal-services-P2`) | 64.9 | 83 | none (1 auditor F1) | 0/3 | **WOUNDED** |
| ESA-proof invoicing (`education-P1`) | 57.1 | 104 | **F1×3 + F2×2** | 0/3 | **DIE** (as scoped) |
| Grant-award ledger (`npo-solar-P1`) | 54.8 | 112 | **F1×2** (+1 auditor F4) | 0/3 | **DIE** |

### FLY — `accounting-P1` (tax document chaser), PAY 76.8, zero flags
The only pick meeting every FLY condition (PAY ≥ 70, no consensus flag, top-quartile with 2 of 3 auditors). The auditors' logic: firms demonstrably already pay for this exact job (portals, VAs, admin staff), the buyer is an owner with a card, and tax season is a forcing function. Their shared caveat caps the ceiling, not the floor: "clients still ignore email, capping software ROI" — software improves the chase, it can't make clients read. Build verdict unchanged from `07`, with the caveat folded into positioning (sell the blocking-state workflow, not "no more chasing").

### WOUNDED, leans fly — `manufacturing-industrial-P1` (job-shop quoting), PAY 71.4
A boundary case the protocol requires me to report transparently: it clears the PAY-tier bar (≥70, zero flags from any auditor, and a spread of **0.0** — all three raters landed on the same score, the tightest agreement in the study) but no auditor placed it in their personal top 16, so it misses FLY on the quartile clause alone. The auditors' unanimous diagnosis: spend is proven ("shops pay Paperless Parts $18k or Tempus $75/mo or live in Excel"), but **the trigger is weak** — nothing forces the purchase this quarter. Actionable consequence: the product thesis survives; the go-to-market must manufacture urgency (sell at bid-season and reshoring-RFQ surges, price against a lost bid, not against saved hours).

### WOUNDED — `personal-services-P2` (Visa-clean deposits), PAY 64.9
No consensus flag, but all three auditors scored it mid-pack and their notes converge on the same two doubts: incumbents already sell deposit features as add-ons (so the third-party wedge must win on compliance depth alone), and one auditor questioned whether a compliant UX reliably converts to won disputes ("Visa still wins chargebacks"). One auditor flagged F1 (the $31k/yr chair-loss figure is a vendor model — a weakness the original file had itself flagged). Verdict: do not build on desk evidence; run 10 salon/med-spa owner conversations testing one question — will you pay $29–49/mo for compliant deposits *without switching booking platforms?* The April 2026 Visa catalyst is real either way.

### DIE (as scoped) — `education-P1` (ESA invoicing), PAY 57.1, consensus F1 + F2
The stress test's biggest casualty — this was my #1 pick, and the auditors killed it on grounds I under-weighted. All three flagged **F1 evidence-hollow**: every dollar in the card is snippet- or vendor-sourced; there is no non-vendor proof that any provider currently *pays money* for this job (they eat the delay instead — suffering is documented, spending is not). Two of three flagged **F2 platform-hostage**: "providers want ClassWallet to work, not another SaaS bill" — the buyer's mental model is that the state rail should fix itself. The demand thesis isn't disproven, but it is *unproven where it counts*. Salvage path: pre-sell only — pitch 10 microschools from the state directories; revive the pick only if at least 3 pay a real deposit. Do not build first.

### DIE — `npo-solar-P1` (grant-award ledger), PAY 54.8, consensus F1
The most instructive kill: the fatal evidence was **already in my own evidence pack, and I misread it.** The r/nonprofit quote "tried other systems… the ROI just wasn't there" — which I filed as proof of an incumbent gap — the auditors independently read as *revealed refusal to pay*: practitioners evaluated paid tools and chose Excel. Combined with all-snippet dollar evidence and a frugal, committee-shaped buyer (S7 low), the pay case collapses. The GrantHub-sunset migration audience from `06` remains real, but it is an audience of people who paid for a *cheap tracker*, not for the fund-accounting product I scoped. Retired.

## Cross-check: the ten candidates cut in 06

The pay test independently validates the cut logic — and sharpens it. Nine of the ten cut candidates score PAY ≥ 60, five score ≥ 75 (`agriculture-P1` 83.3 is the **highest consensus score in the entire study**, `logistics-trucking-P1` 82.1, `healthcare-private-practice-P1` 79.2, `real-estate-property-management-P2` 78.6, `insurance-P2` 76.8). Customers in those niches emphatically pay — which is exactly *why* competitors already arrived (Seso, DOTScreener, SamaCare, RentPermit, Commission Tracker). Meanwhile `restaurants-hospitality-P1` (F2×3 — DoorDash owns the dispute rail), `creative-creator-economy-P3` (F1×2), and `npo-solar-P6` (F5 consensus — the credit is simply gone) fail on demand grounds too, confirming those cuts twice over. Demand-side score plus supply-side scan point the same direction: **high-pay niches attract competition fast; the edge is timing, not discovery.**

## The full re-ranking

Complete 145-row table with per-auditor notes: [08-stress-test/ranking.tsv](08-stress-test/ranking.tsv). Tier census: **44 TIER-PAY · 62 TIER-MAYBE · 39 TIER-UNLIKELY.**

### Most likely to pay (top 15 by consensus PAY; * = single-rater score, ±~5)

| # | PAY | ID | One-line reason (auditor's words) |
|---|---|---|---|
| 1 | 89.3* | `legal-P1` intake calls | Firms already pay Smith.ai/Ruby hundreds/mo; a missed PI call is five figures |
| 2 | 89.3* | `hr-staffing-P2` I-9/E-Verify defense | ICE fines are live spend; a Notice of Inspection is a dated, existential trigger |
| 3 | 87.5* | `personal-services-P1` marketplace take-rates | Stylists bleed 20% + subscription; owner can switch same-day |
| 4 | 83.9* | `healthcare-P8` outsourced billing % | Solos already hand 6–8% of collections to billers every cycle |
| 5 | 83.9* | `legal-P4` records retrieval | $45–75/request spend against discovery deadlines (F2: Datavant gates) |
| 6 | 83.9* | `retail-P2` Amazon suspensions | Documented $495–8,000 grey market (F1/F2 noted) |
| 7 | 83.9* | `it-msp-P2` CMMC-as-a-service | MSPs already quote $100/user add-ons; award-condition = dated buy |
| 8 | 83.3 | `agriculture-P1` H-2A paperwork | Farmers already pay $1.5–3.5k/filing on a 60–75-day clock (3-rater consensus, no flags) |
| 9 | 82.1 | `retail-P3` de-minimis customs | $25–75 forced brokerage per parcel, dated repeal (3-rater) |
| 10 | 82.1* | `legal-P3` Clio exits | Firms already write $1.6k/user checks |
| 11 | 82.1 | `logistics-trucking-P1` carrier fraud | $200k+ hits plus July 2026 bond (3-rater) |
| 12 | 82.1 | `hr-staffing-P3` staffing back office | Agencies already pay $250–750/user or factor payroll (3-rater) |
| 13 | 80.4* | `creative-P1` HoneyBook ratchet | Documented switching spend |
| 14 | 80.4* | `logistics-trucking-P6` dispatcher tolls | 5–10% of revenue already outsourced |
| 15 | 80.4* | `construction-P3` field-service pricing | Extractive per-tech fees already paid |

### Least likely to pay (bottom 10)

`D6` moving (26.8), `creative-P8` gallery delays (30.4), `D2` medical bills (32.1), `insurance-P8` consumer mortgage complaints (33.9), `npo-solar-P8` solar quote-shopping (33.9), `D12` wedding planning (35.7), `education-P6` grade double-entry (35.7 — teachers don't hold budgets), `creative-P6` YouTube slop-flags (35.7 — platform decides), `D8` non-renewal help (37.5), `npo-solar-P3` federal-grant collapse (41.1 — software can't reverse a funding shock). Pattern: **consumer-episodic events and platform-gated outcomes are where customers do not pay**, no matter how loud the complaining — 11 of 12 consumer domains landed in TIER-UNLIKELY.

### Biggest movers vs the original ranking

- **Risers** (the original rubric under-priced raw willingness-to-pay): `logistics-trucking-P6` +96 ranks, `hr-staffing-P3` +86, `legal-P6` malpractice calendaring +85, `healthcare-P6` no-shows +83. Common thread: money already flowing to a human substitute (dispatcher, factor, biller, answering service).
- **Fallers** (the original rubric over-credited catalysts and under-punished weak spend evidence): `npo-solar-P1` −105, `creative-P2` scope creep −94, `npo-solar-P3` −93, `agriculture-P2` EQIP −91, `npo-solar-P6` −83 (was the original raw #1), `personal-services-P2` −80, `education-P1` −79. Common thread: snippet-sourced dollars, frugal buyers, or outcomes gated by institutions software can't move.

## New candidates surfaced by the stress test (not previously validated for competition)

These scored high on pay-conversion but never got the `06` competition scan — they need one before anyone builds:

1. **`hr-staffing-P3` — staffing-agency back office** (82.1, 3-rater consensus, no flags): timesheet→payroll→invoice→collection while payroll is due long before clients pay. Agencies provably pay $250–750/user for incumbents. Check Bullhorn ecosystem and factoring-bundled software before acting.
2. **`retail-P3` — de-minimis customs cost** (82.1, 3-rater, no flags): forced, dated, per-parcel spend — but verify whether the buyable product is software or a brokerage service before treating it as a solo wedge.
3. **`hr-staffing-P2` — I-9/E-Verify audit defense** (89.3, single-rater): the strongest single-rater score in the study; needs a second rating and a competition scan (I-9 compliance vendors exist: Equifax/Tracker/WorkBright tier — likely crowded up-market, possibly open at SMB self-serve).

## Limitations (read before acting)

1. **Same evidence corpus.** Auditors judged independently but on cards built from the original evidence — collection bias is inherited. A problem whose spend evidence was never *collected* can score F1 despite real spend existing (this is the strongest counter-argument available to `education-P1`).
2. **Single-rater uncertainty** on the 120 non-overlap cards (±~5 points, no flag consensus); all headline verdicts used triple-scored cards.
3. **LLM auditors, not customers.** This is adversarial desk review; ten buyer conversations outrank it.
4. **PAY ≠ opportunity.** The test deliberately excludes competition; combine with `06` (the verdicts above already do).
5. One protocol boundary case (`manufacturing-industrial-P1` missing FLY only on the quartile clause) was resolved by reporting, not by bending a rule.

## Revised action list (supersedes the closing list in 07)

1. **Build-ready:** `accounting-P1` (FLY) and `manufacturing-industrial-P1` (near-fly; fix the weak-trigger problem in go-to-market, not in product).
2. **Validate-then-build:** `personal-services-P2` — 10 owner conversations on add-on willingness-to-pay.
3. **Pre-sell-only:** `education-P1` — revive only if ≥3 of 10 microschools pay a deposit.
4. **Retired:** `npo-solar-P1` — its own evidence contains a revealed refusal to pay.
5. **New validation queue:** `hr-staffing-P3`, `retail-P3`, `hr-staffing-P2` (competition scans + a second rating for P2).
