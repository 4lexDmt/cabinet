# Construction & Skilled Trades — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** GCs, subcontractors, and service trades (HVAC, plumbing, electrical, roofing, landscaping, remodel) from solo operators to ~50-truck shops. Not mega-EPC or heavy civil.
- **Searches/fetches performed:** 13 web searches (several returning fetched full-page texts)

## Industry snapshot

- Two distinct buyer personas: project-based contractors (GCs/subs bidding work, paid via pay apps) and service trades (dispatch/ticket businesses running FSM software like ServiceTitan/Jobber/Housecall Pro).
- 2026 climate: activity has cooled but labor is still the binding constraint — 92% of hiring firms report difficulty filling positions; immigration enforcement has affected nearly 1/3 of firms (AGC/NCCER, Sept 2025).
- Cash flow is the structural wound: subs wait 56 days on average to get paid while their supplier terms run 30-45 days (Billd 2025); Rabbet prices the industry's slow-pay "tax" at $299B for 2025.
- Software incumbents price upward aggressively: ServiceTitan ~$235-500/tech/month, Jobber tier-jumps + paid add-ons, Buildertrend per-project pricing hikes — pricing anger is loud and specific in communities.
- Estimating/takeoff remains mostly manual (8-10 hours per bid), spawning both an outsourced-estimating services market ($200-750/bid) and a fast-crowding AI-takeoff tool wave.

## Top problems

### construction-skilled-trades-P1. Quantity takeoff eats 8-10 hours per bid and is the bottleneck on how much work a contractor can win

- **Who hurts:** Estimators and owner-operators at GCs and subs (concrete, drywall, electrical, roofing) bidding from PDF plans.
- **What happens now (workaround):** Manual measuring in Bluebeam/PlanSwift; outsourced estimating firms at $200-750 per residential bid; new AI tools (Togal, Kreo, Beam) trialed with skepticism.
- **Frequency:** Weekly (every bid).
- **Evidence:**
  - Community https://www.reddit.com/r/Construction/comments/1r38fhc/how_difficult_is_it_to_provide_quotes/ — "Most contractors I talk to spend: 8-10 hours doing takeoffs (measuring walls, doors, materials, etc.)… The REAL bottleneck for most contractors isn't 'creating quotes quickly' in general - it's specifically the quantity takeoff portion… That's where 80% of the time goes." (n.d., recent thread) (snippet)
  - Community https://www.reddit.com/r/Construction/comments/1oehs9r/blueprint_automation_takeoff/ — "Most takeoff tools are either stupid expensive or dumb as rocks, but the newer AI stuff is finally getting less painful." (comment Dec 2, 2025; thread Oct 23, 2025)
  - Willingness-to-pay https://shoreagents.com/resources/estimating-outsourcing — "Outsourcing 10 estimates monthly at an average $750 each costs $7,500… You break even at exactly 10 estimates per month." (2025, fetched)
  - Willingness-to-pay https://bidwisestimation.com/pricing/ — per-project estimating plans "$150… $250… $450… $700", monthly packages to $5,500 (2025) (snippet)
- **Incumbent gap:** Bluebeam/PlanSwift are measurement canvases, not automation; AI-takeoff startups skew commercial GC; trade-specific takeoff (roofing squares, wire runs, flatwork yards) from messy PDFs is still unsolved at $15-100/mo price points.
- **Spend signal:** $8,000-12,000/year on outsourced estimates for active bidders; in-house estimator ~$8,541/month all-in (shoreagents); Mint Takeoff at $15/mo cited as budget option — huge price spectrum with unmet middle.
- **Catalyst / trend:** AI plan-reading is newly feasible (2024-2026 tool wave); r/Construction now openly asks which AI tools work — attitude shifted from "impossible" to "which one."
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** Single-trade AI takeoff (e.g., roofing or concrete flatwork only) that turns a PDF plan set into a quantity sheet + priced quote template, sold per-seat at $50-150/mo against $250-750/bid outsourcing.

### construction-skilled-trades-P2. Subs wait ~56 days to get paid while supplier terms run 30-45 — and change orders/lien-waiver traps silently forfeit money

- **Who hurts:** Subcontractors of all trades; small GCs on government jobs; anyone signing monthly lien waivers.
- **What happens now (workaround):** Texting the GC "every second day"; expensive factoring/materials financing (Billd et al.); notice-of-intent-to-lien letters; spreadsheet claims tracking attached to waivers.
- **Frequency:** Monthly pay-app cycle on every project.
- **Evidence:**
  - Ranked survey https://billd.com/pdf/Billd_2025_National_Subcontractor_Report.pdf — "Subcontractors wait an average of 56 days to get paid after they submit a pay application. However, GCs believe subcontractors only wait 30 days… 81% of subs have supplier terms of 45 days or less" (2025, fetched)
  - Ranked survey https://www.globenewswire.com/news-release/2025/11/13/3187310/0/en/Slow-Payments-Cost-299-Billion-in-2025-a-Hidden-14-Tax-on-U-S-Construction.html — "Respondents attribute 14% of total project costs to slow payment—equating to $299B on a $2.139T market… General contractors spend 65 hours/month managing payments to subs and vendors." (Nov 13, 2025) (snippet)
  - Community https://www.reddit.com/r/Contractor/comments/1lkhia3/subcontracted_for_a_company_and_they_arent_paying/ — "I currently have unpayed jobs coming up on 60 days. I text and call them every second day and keep getting 'we'll look into it'" (2025 thread) (snippet)
  - Trade/legal https://www.sunraynotice.com/blog/how-change-orders-impact-your-right-to-get-paid — "If you have performed $15,000 worth of extra work under a pending, unsigned change order, and you sign an unconditional progress waiver… you may have just legally wiped out your right to collect that $15,000." (2025) (snippet)
- **Incumbent gap:** Lien-rights SaaS (Levelset) got acquired and skews enterprise; nothing cheap watches a small sub's pending COs against the waivers they're about to sign or auto-runs the deadline clock per state.
- **Spend signal:** Billd exists because subs pay real financing costs to bridge 24+ day gaps; 53% don't price financing costs into bids (Billd 2025) — margin silently lost.
- **Catalyst / trend:** None — structural; worsened by 2025-2026 tighter margins and survival-confidence decline (Rabbet 2025).
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 3
- **Solo-builder angle:** A change-order + lien-deadline guardian for subs: logs every extra-work directive from text/email, flags unsigned COs before each waiver signature, and generates state-correct preliminary notices/NOI letters.

### construction-skilled-trades-P3. Field-service and construction software pricing has become extractive — per-tech fees, tier jumps, and paid add-ons for basics

- **Who hurts:** Service-trade owners (2-20 techs) on ServiceTitan/Jobber; small builders/remodelers on Buildertrend; legacy Viewpoint/ProContractor users being forced to cloud.
- **What happens now (workaround):** Sharing managed-tech logins (skews reports), downgrade gymnastics between tiers, rage-switching to Kickserv/FieldPulse/Workiz/BluePro, or staying and eating annual increases.
- **Frequency:** Monthly bill; annual increase events.
- **Evidence:**
  - Community https://www.reddit.com/r/HVAC/comments/t0k05e/what_are_you_paying_for_service_titan/ — "I wish I was paying $259/tech. We pay on average about $325/tech. It's ridiculous." (n.d.) (snippet); https://www.reddit.com/r/HVAC/comments/zt4kjw/thoughts_on_servicetitan/ — "take the already expensive pricing and now they are increasing price across the board with year over year increases now guaranteed… much is locked behind back side settings." (n.d.) (snippet)
  - Community https://www.reddit.com/r/Contractor/comments/1qk5y04/im_really_disappointed_with_jobber/ — "I'm paying $267 a month… reviews cost an extra $39 a month and referrals are another $29… I had to upgrade to Grow purely for expense tracking." (2025-26 thread) (snippet)
  - Community https://www.reddit.com/r/selfemployed/comments/1rsfr43/usa_best_jobber_alternatives_for_a_one_person/ — "Solo plumber… I'm paying for a mountain of features I don't touch… they keep raising prices." (2026 thread) (snippet)
  - Review gap https://www.capterra.com/compare/70092-166113/Buildertrend-vs-Contractor-Foreman — "The problem with them is that they raised their rates exponentially and priced us out of the market to use them." ; "You cannot cancel. When you think you cancelled they just keep charging you." (2026 page, fetched)
  - Review gap https://www.capterra.com/compare/153591-251833/RAKEN-vs-ProContractor — "Costs have skyrocketed, and on-premise customers are now being forced into the Cloud by end of 2026" (2026 page, fetched)
- **Incumbent gap:** ServiceTitan is post-IPO with per-tech pricing and guaranteed annual increases; Jobber gates basics (expense tracking, reviews) behind add-ons; the underserved segment is 1-5 person shops who need quote→invoice→payment and nothing else.
- **Spend signal:** $235-500/tech/month (ServiceTitan), $267/mo mid-tier Jobber + add-ons; switching costs so high owners tolerate hated pricing for years ("devil you know").
- **Catalyst / trend:** ServiceTitan IPO (Dec 2024) locks in growth-pricing pressure; Jobber's 2025-2026 team-size band repricing documented by third parties.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 5 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** Flat-price, single-trade "quote-invoice-get-paid" app for solo operators (the r/selfemployed plumber persona) at $30-50/mo with no per-user math — or a Jobber/ST bill-auditor that tells shops which tier/add-ons they actually use.

### construction-skilled-trades-P4. Trades miss 20-60% of inbound calls and routinely ghost quote requests — leads leak at both ends

- **Who hurts:** Owner-operators who are under a sink when the phone rings; homeowners who can't get quotes (consumer side of the same failure).
- **What happens now (workaround):** Voicemail (80% of callers won't leave one, per Forbes figure cited by LeadBlaze); spouse/office answering; new wave of AI receptionists ($29-149/mo add-ons).
- **Frequency:** Daily.
- **Evidence:**
  - Consumer community https://www.reddit.com/r/HomeImprovement/comments/1ey2nl2/lots_of_contractors_being_difficult_or_ghosting/ — "contractors will come by for quote and then ghost us and never get us anything, we'll call to setup time for a quote and no one ever gets back to us" (2024) (snippet)
  - Consumer community https://www.reddit.com/r/HomeImprovement/comments/j56bkd/is_it_common_to_not_hear_back_from_contractors/ — "We called 5 contractors, had 4 physically come by the home, only got 3 bids. Wound up going with the expensive one because they actually answered their phone." (2020; persistent pattern echoed in 2024-26 threads) (snippet)
  - Vendor data (flagged bias) https://leadblaze.ai/calculators/missed-lead-cost-hvac-companies — "average repair ticket of about $1,205 (Housecall Pro, 2025), times the 38% of answered calls HVAC companies book (ServiceTitan)… each missed call carries an expected cost of roughly $365" (2025-26) (snippet)
  - Vendor data (flagged bias) https://ainora.lt/blog/hvac-service-call-statistics-2026 — "CallRail and Invoca industry reports consistently put average missed-call rates for home-service contractors at 20-30% of total inbound volume, with seasonal peaks pushing that to 40-50%." (2026, fetched)
- **Incumbent gap:** Answering services are generic; FSM-native AI receptionists are new, bolt-on-priced (Jobber AI Receptionist $29/mo), and don't handle the quote-follow-up ghosting side at all.
- **Spend signal:** Human receptionist ~$35k+/yr; AI receptionist tools $29-149/mo selling briskly — but follow-up-on-sent-quotes automation is unpriced whitespace.
- **Catalyst / trend:** Voice AI became genuinely usable 2024-2026; every FSM vendor is shipping one — window for independents is narrowing.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 5 · whitespace 2 · why-now 4
- **Solo-builder angle:** Quote-chaser (not call-answerer): auto-follow-up sequences on every estimate sent, with homeowner-side scheduling — attacks the documented "gave a quote then ghosted" gap the AI-receptionist crowd ignores.

### construction-skilled-trades-P5. The skilled-labor shortage is now the #1 cause of project delays, and firms can't assess or onboard the people they do find

- **Who hurts:** GCs and subs of all sizes; 45% report project delays from workforce shortages.
- **What happens now (workaround):** Poaching, overtime, unvetted hires — 57% of firms say available candidates simply "lack essential skills or do not have an appropriate certificate or license."
- **Frequency:** Continuous.
- **Evidence:**
  - Ranked survey https://www.agc.org/sites/default/files/users/user21902/2025%20Workforce%20Survey%20Analysis%20%283%29.pdf — "88 percent of firms that directly employ craft workers report having openings… 83 percent of firms with craft worker openings report those positions are as hard or harder to fill than a year ago." (July-Aug 2025 survey of 1,342 firms, fetched)
  - Trade press https://www.agc.org/sites/default/files/users/user21902/2025%20Workforce%20Survey%20Release_V2.pdf — "92 Percent of Construction Firms Report Having a Hard Time Finding Workers to Hire, As 45 Percent of Firms Say Labor Shortages are Causing Project Delays… immigration enforcement efforts have impacted near one-third of construction firms" (2025) (snippet)
  - Trade press https://www.nccer.org/research/2025-workforce-survey-agc-nccer/ — "92 percent of companies reporting difficulty in hiring for open positions" (Sept 5, 2025) (snippet)
- **Incumbent gap:** Job boards and staffing agencies churn; skills verification, credential tracking, and fast onboarding tooling for field crews is fragmented; not an easy solo wedge (marketplace risk) but adjacent admin tools are.
- **Spend signal:** Staffing agency markups and overtime premiums; training investments (survey shows increased in-house training spend).
- **Catalyst / trend:** Immigration enforcement intensity 2025-2026 (affecting ~1/3 of firms per AGC) tightened supply further.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 3 · reachability 3 · solo-buildability 2 · whitespace 2 · why-now 4
- **Solo-builder angle:** Skip the marketplace; sell crew-credential and cert-expiry tracking (OSHA cards, licenses, per-jobsite badging docs) to subs who now get delayed for missing paperwork.

### construction-skilled-trades-P6. Permitting and regulatory compliance now add $131,734 to a new home and 7 months of delay — and tracking it all is manual

- **Who hurts:** Homebuilders, developers, and remodelers pulling permits across fragmented local jurisdictions.
- **What happens now (workaround):** Expediters, spreadsheets of jurisdiction quirks, padding schedules ~7 months (development) / 6+ weeks (construction).
- **Frequency:** Every project.
- **Evidence:**
  - Ranked survey https://www.nahb.org/-/media/NAHB/news-and-economics/docs/housing-economics-plus/special-studies/2026/special-study-government-regulation-in-the-price-of-a-home-june-2026-updated.pdf — "The vast majority of developers (94.2%) said complying with regulations typically caused a delay. In these cases, the delay averaged roughly seven months… 93.4% of builders reported that regulation caused some delay… averaged a little over six weeks." (June 2026, fetched)
  - Trade press https://www.nahb.org/news-and-economics/press-releases/2026/06/regulatory-costs-jump-40-in-five-years-add-131734-to-new-home-prices/ — "regulations at the federal, state and local levels add $131,734 to the cost of a new single-family home—26.4% of the average sales price of $499,500 as of January 2026." (June 2026) (snippet)
  - Trade press https://www.housingwire.com/articles/code-changes-regulatory-costs/ — "changes to building codes over the past 10 years account for $40,288 per average new home… Delays slow capital velocity. They extend interest carry." (2026) (snippet)
- **Incumbent gap:** Permit-tracking SaaS targets big developers or municipalities (govtech sales cycle); small builders juggling 3-10 jurisdictions have nothing purpose-built for requirement checklists per jurisdiction + status chasing.
- **Spend signal:** Permit expediters bill hourly/per-permit; carrying costs of 7-month delays are enormous relative to any software price.
- **Catalyst / trend:** NAHB regulatory-cost figure up 40% in five years (June 2026 study) — worsening measurably.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 3 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** Jurisdiction-requirements wiki + permit-status tracker for small builders in one metro (start hyper-local where you can hand-verify the requirements, charge per active project).

## Vertical catalysts (dated)

- **OSHA heat injury/illness rule NOT final:** NPRM published Aug 30, 2024; hearings June-July 2025; supplemental NPRM expected Dec 2026; final action projected Oct 2027 (OSHA 2026 Unified Agenda via J.J. Keller, July 3, 2026). Meanwhile the National Emphasis Program keeps heat inspections active. https://jjkellercompliancenetwork.com/news/osha-publishes-long-awaited-regulatory-agenda
- **Immigration enforcement affecting workforce:** ~1/3 of construction firms impacted (AGC/NCCER 2025 Workforce Survey, released ~Sept 2025). https://www.agc.org/sites/default/files/users/user21902/2025%20Workforce%20Survey%20Release_V2.pdf
- **NAHB regulatory-cost study (June 2026):** $131,734/home, +40% in 5 years; code changes largest line item ($40,288). https://www.nahb.org/news-and-economics/press-releases/2026/06/regulatory-costs-jump-40-in-five-years-add-131734-to-new-home-prices/
- **ServiceTitan IPO (Dec 2024) + Jobber band repricing (2025-26):** public-market growth pressure institutionalizes annual price increases in trade software (see P3 evidence).
- **AI takeoff/voice tooling maturation (2024-2026):** contractors now actively evaluate AI tools (r/Construction threads Oct 2025-Mar 2026) — adoption window open but crowding fast.

## Consumer flip-side

- Homeowners can't get contractors to respond: "contractors will come by for quote and then ghost us" — https://www.reddit.com/r/HomeImprovement/comments/1ey2nl2/ (2024) (snippet); "Nobody has time for tire kickers when other people are handing them deposit checks." (same thread)
- Responsiveness wins deals over price: "Wound up going with the expensive one because they actually answered their phone/our questions." — https://www.reddit.com/r/HomeImprovement/comments/j56bkd/ (2020) (snippet)
- Small jobs are orphaned: "One company finally told me that most companies at this time of year only do jobs that are $5,000 or more." — https://www.reddit.com/r/HomeImprovement/comments/co2gkq/ (2019; pattern persists in 2024-26 threads) (snippet)
- B2B2C wedge: a "your quote status" page + automated follow-up benefits both sides of the documented ghosting gap.

## Sources that failed or came up thin

- **r/electricians / r/Plumbing solution-request mining failed on phrasing:** `"what do you use for" estimates invoicing` collided with wiring-polarity threads ("what do you use for + and -"). Trade-specific software pain for electricians/plumbers is under-evidenced here; ContractorTalk/ElectricianTalk forums were not directly mined this run.
- **Missed-call statistics are vendor-published:** LeadBlaze, Ascero, CallJolt, ainora are AI-receptionist sellers quoting Housecall Pro/ServiceTitan/Invoca data secondhand — directionally consistent but marketing-calculator math; treat per-call dollar figures as promotional estimates.
- **Several high-quality Reddit threads lack visible dates in snippets** (ServiceTitan pricing threads span 2022-2025); per-tech price points corroborated across multiple threads and third-party pricing pages, but exact current 2026 list pricing is quote-only.
- **Rabbet 2025 survey n is small** (125 contractors, only 28 subs) — the $299B/14% figure is an extrapolation; Billd's sub-survey (hundreds of execs) is the stronger payment-delay source.
- **No Hacker News mining for this vertical** — HN has little construction-practitioner presence; skipped in favor of Reddit/Capterra density.
