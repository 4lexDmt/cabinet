# Automotive Services — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Independent mechanical repair shops, collision/body shops, detailing, small franchised dealerships (DMS/outage fallout only). Excludes OEM captive service, tire-only chains except as competitors, and new-car sales CRM.
- **Searches/fetches performed:** 16 web searches + 5 direct fetches (IMR 2026 challenges, AirPro/UNF ADAS study, MOTOR Mar 2026 sublet, MOTOR Jul 2026 cost barrier, Anderson Economic Group CDK losses). AutoShopOwner and G2 mined via `site:` snippets.

## Industry snapshot

- Independent shops' 2026 climate is parts-price first: IMR surveyed **500 shops in Dec 2025** — **46%** cite finding affordable parts as *the* challenge (up from 20.6% a year earlier); 22.8% still can't find the parts they need; 35.8% cite overhead (labor, rent, **software subscriptions**, equipment).
- Labor: 23.8% can't find qualified techs; 9.6% can't retain them; 30% struggle to stay current with diagnostic tools/software (IMR). Ratchet+Wrench 2026 Industry Survey (430+ owners, Q1 2026) frames the same mix: ADAS/EV investment vs shortage and profitability pressure.
- Collision ADAS is the structural fork: UNF survey of **304 collision businesses** (AirPro write-up, pub. Aug 15 2025 / updated Aug 27 2026) — **76% have no dedicated ADAS specialist**; 70% say one tech cannot cover ~30 brands; 65% outsource calibrations.
- Shop-management incumbents: Tekmetric ~$179–$199/mo start, Shopmonkey Basic **$239/mo** (DVI gated to Clever ~$399), Shop-Ware ~$249/mo, plus ALLDATA/Mitchell1 SI at **~$194–$209/mo**. Collision estimating still orbits CCC One + insurer DRPs.
- Dealership DMS is a closed gate (CDK / Reynolds) — **do not pitch a DMS**. The 2024 CDK outage is still the trust scar; lawsuits were dropped/arbitrated by Jun 2025 (Automotive News).

## Top problems

### auto-P1. Parts prices and fitment hunting eat an extra hour a day and are now the #1 shop problem

- **Who hurts:** Independent mechanical shops (1–10 techs); owner-mechanics wearing the parts-counter hat
- **What happens now (workaround):** Check 7 suppliers then the dealer; Nexpart + phone; Worldpac next-day written off if it arrives late afternoon; track comebacks by brand in a notebook
- **Frequency:** Daily
- **Evidence:**
  - survey https://www.automotiveresearch.com/insights/2026-repair-shop-challenges — "The most cited challenge is again, finding affordable parts and dealing with rising prices. 46% of shops selected this as a challenge, more than any other issue." 22.8% "finding the parts they need"; 5.6% decreasing parts quality (IMR, Dec 2025 sample of 500; fetched 2026-09-17)
  - community https://www.autoshopowner.com/forums/topic/11007-parts-ordering/ — "Does anyone else get frustrated sourcing parts from multiple vendors because of lack of comprehensive inventory from one supplier? I estimate we spend an extra hour sometimes per day trying to hunt down parts." Shop checks "7 suppliers (auto plus, advance, autozone, napa, worldpac, parts authority, carquest) then move on to dealerships." (snippet)
  - community https://www.autoshopowner.com/forums/topic/13702-aftermarket-parts-issues-driving-me-up-a-wall/ — "I am the owner and mechanic and I waste so much time in the office dealing with parts, Calling manufacturers tech support lines, taking measurements, sending pictures of parts problems." Three leaking Accord calipers from O'Reilly. (snippet)
  - community https://www.autoshopowner.com/forums/topic/21310-when-parts-prices-wont-sit-still-quoting-and-protecting-margin-in-a-tariff-driven-market/ — Jul 22 thread title documents tariff-driven quote-risk as a live 2025–26 ops problem (paywalled body; title+date only)
- **Incumbent gap:** Mitchell1 / shop SMS integrate *a* catalog, not a reliable multi-vendor available-to-promise with quality scores; RO Writer "smart ecat" is the only multi-inventory search named, and shops still call dealers
- **Spend signal:** ~1 extra hour/day of owner labor; warranty claims require rewrite + fax + follow-up at ½ labor rate (13702); IMR: parts cost is *the* 2026 issue
- **Catalyst / trend:** Tariff-driven price volatility (ASO topic 21310, Jul 2025); IMR year-over-year jump 20.6% → 46% citing affordable-parts pain
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** A parts-hunter that queries local store inventories + dealer + WD, ranks by in-stock/ETA/prior-failure rate, and drops a quote-lock timestamp onto the RO — not another SMS.

### auto-P2. ADAS calibration is mandatory, high-margin work independents are priced out of owning

- **Who hurts:** Independent mechanical and especially collision shops with <10 techs
- **What happens now (workaround):** Pre/post-scan in-house (77%), sublet calibration (65%) at a median **12%** backend discount (i.e. near-retail cost); turn work away (43% at least occasionally)
- **Frequency:** Rising with every windshield/front-end; shops expect ADAS work **+30% over two years** (MOTOR Mar 2026)
- **Evidence:**
  - survey https://airprodiagnostics.com/new-study-reveals-critical-adas-technician-shortage-threatens-vehicle-safety/ — UNF (Zhang/Wang), 304 collision businesses: only 72 have dedicated ADAS techs (**76% without**); 70% say one tech cannot cover ~30 brands; IIHS cited ~50% of owners report post-calibration issues (fetched; dated Aug 15 2025)
  - trade https://www.motor.com/2026/03/adas-calibration-sublet-vs-in-house/ — Revv survey of 300 shops: average **$21,509/mo** ADAS revenue; initial equipment **$55,494**; ongoing tooling **$18,775/yr**; software **$2,375/month**; 41 training hours/yr; 77% of shops say insurers push back on calibration charges (Mar 11, 2026)
  - trade https://www.motor.com/2026/07/adas-calibration-cost-barrier/ — "A complete top-tier package from a market leader runs in the neighborhood of $70,000"; portable $1,500–$10,000 is "the trap"; calibration bills **$300–$600**/vehicle; federal AEB requirements "near arrival in 2029"; "as many as 88 percent of required ADAS calibrations are simply not being done" (illustrative, author flags softness) (Jul 15, 2026)
  - pdf https://www.aftermarketmatters.com/wp-content/uploads/2025/09/UNF-ADAS-report.pdf — 232/304 shops (76%) no dedicated ADAS specialist; only 11% of shops with <10 techs have formal ADAS training (Sep 2025 PDF)
- **Incumbent gap:** Equipment oligopoly + software annuity; CCC/estimating tools don't solve the *capability* gap; remote scan vendors (AirPro) exist but don't give the shop the certificate or the margin
- **Spend signal:** $55k capex + ~$28.5k/yr software ($2,375×12) + $18.8k tooling; sublet keeps ~12% of a $300–$600 ticket; $21.5k/mo revenue for shops that cracked it
- **Catalyst / trend:** >90% of new vehicles ship with some ADAS; ~65% of repairs touch a system needing recalibration; AEB mandate approaching 2029 (MOTOR Jul 2026)
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 4 · solo-buildability 2 · whitespace 3 · why-now 5
- **Solo-builder angle:** Not a $70k rig. A **calibration-identification + insurer-proof documentation pack** (which OEM procedure, which targets, scan PDF, certificate) sold to subletting shops so they stop leaving 70% of cars uncalibrated and win the 77% of claims that currently get pushed back. Hardware is a kill-criterion for a solo.

### auto-P3. Service-info subscriptions run ~$200–$300/mo and small shops share logins or go without

- **Who hurts:** One-man and 2–3 bay independents
- **What happens now (workaround):** Split Mitchell1/ALLDATA with another tech; Identifix; Charm.li; factory manuals on eBay; DIY $60/vehicle
- **Frequency:** Daily lookups; monthly bill
- **Evidence:**
  - community https://www.reddit.com/r/CarHacking/comments/1qia7q6/anyone_willing_to_share_the_cost_of/ — "Anyone willing to share the cost of ALLDATA/mitchell 1"; comment: "**$194 per month**"; "160 for shopkeypro" (Jan 20, 2026)
  - community https://www.reddit.com/r/CarHacking/comments/1gjj44v/alldataidentifixprodemand_free_or_cheap/ — "I’m still thinking about buying all data 209/ mo 2508 a year"; "Just not willing myself to pay $300 a month"; "I just opened a very small shop and i definitely cant afford it" (snippet)
  - community https://www.reddit.com/r/Justrolledintotheshop/comments/1av4va4/labor_guide_software_for_one_man_shop_suggestions/ — "I will always agree that Mitchel and AllData are excellent programs, but they are WAY too expensive for a solo operation"; Identifix stack "~300 an month" (snippet)
  - community https://www.reddit.com/r/AutoMechanics/comments/1epy8hv/alldata_diy_dropped_the_ball_on_this/ — "The alternative is to pay $2400+ per year like the repair shops do for access to the same information." (snippet)
- **Incumbent gap:** ALLDATA/Mitchell1 are priced for multi-bay shops; labor-guide + wiring + TSBs are bundled so a solo pays for the whole catalog to look up one Honda
- **Spend signal:** $194–$209/mo ($2,328–$2,508/yr) professional; $300/mo Identifix+ops; DIY $59.99/vehicle/yr as the leak
- **Catalyst / trend:** Structural. Vehicle complexity (IMR: 30% cite diagnostic tools/software) makes the subscription non-optional while the price stays shop-scale
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 2 · whitespace 2 · why-now 2
- **Solo-builder angle:** Per-VIN OEM-procedure checkout (pay-per-job, not per-month) with a print-to-bay PDF. Hostile-platform risk is real (ALLDATA ToS); do not scrape. Licensed OEM portals (Honda techinfo etc.) as the source of truth.

### auto-P4. Shops cannot hire or train ADAS/EV-capable techs, so work walks or gets sublet

- **Who hurts:** Every independent under ~10 techs; collision worse than mechanical
- **What happens now (workaround):** Sublet; skip EV; ASE xEV $39–$50 tests; send one senior tech to HV class
- **Frequency:** Continuous hiring; every EV/ADAS RO
- **Evidence:**
  - survey https://www.automotiveresearch.com/insights/2026-repair-shop-challenges — 23.8% difficulty finding qualified techs; 9.6% retention; 7.0% hands-on training; **11.0%** transitioning to EV/hybrid/ADAS (IMR Dec 2025)
  - survey UNF via AirPro (link above) — among small independents (64% of the independent subset have ≤5 techs), only **14** had OEM-trained ADAS specialists; 118/304 rely on subletting for lack of in-house expertise
  - trade https://www.motor.com/2026/03/adas-calibration-sublet-vs-in-house/ — 49% cite "training costs and time away from production as their single biggest training-related challenge"; 41 hours/yr ADAS training
  - trade https://blog.autodots.io/ev-garage-service-2026-prepare-workshop/ — "A realistic starting investment for basic EV service capability … typically falls between $5,000 and $15,000" (2026)
- **Incumbent gap:** ASE tests knowledge, not brand procedures; OEM training is brand-siloed (the 30-brand problem)
- **Spend signal:** $1,500–$2,500/tech HV cert + $1,000–$2,000/yr recert (Best Buy Auto Equipment 2026 guide snippet); lost ADAS tickets at $300–$600
- **Catalyst / trend:** Same ADAS/AEB 2029 + EV parc growth; IMR shows EV/ADAS still "only" 11% as a named challenge because parts/labor drown it out — a lagging indicator
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 3 · solo-buildability 2 · whitespace 2 · why-now 3
- **Solo-builder angle:** Bite-sized, procedure-specific ADAS/EV micro-training tied to the RO in front of the tech (this car, this calibration), not another LMS. Life-safety/HV work is a **kill-criterion** for anything that claims to certify a tech — stay in "checklist + video of the OEM procedure," not "you're qualified now."

### auto-P5. CDK's 2024 outage cost dealers $1.02B and left a trust hole no independent DMS can legally fill — but offline ops still don't exist

- **Who hurts:** Franchised dealers (esp. smaller groups); service/parts desks that went pen-and-paper for ~3 weeks
- **What happens now (workaround):** Arbitration instead of lawsuits; hope CDK holds; some dual-running of spreadsheets
- **Frequency:** Episodic catastrophe; residual distrust
- **Evidence:**
  - survey/econ https://www.andersoneconomicgroup.com/dealer-losses-due-to-cdk-cyberattack-reach-1-02-billion/ — **$1,020 million** direct dealer losses Jun 19–Jul 5 2024; ~**56,200** lost new-unit sales; "especially the smaller ones" on mitigation cost (Jul 15, 2024; fetched)
  - trade https://www.cnn.com/2024/07/11/business/cdk-hack-ransom-tweny-five-million-dollars — CDK "appears to have paid a $25 million ransom"; ~15,000 rooftops (Jul 11, 2024 snippet)
  - trade https://www.autonews.com/retail/an-cdk-cyberattacks-lawsuits-dealers-0619/ — "One year later, dealerships dropped lawsuits over CDK outage, entered arbitration" (Jun 19, 2025)
  - IMR 2026 (link above) — software subscriptions already sit inside the 35.8% overhead complaint; single-vendor concentration is the unlearned lesson
- **Incumbent gap:** CDK/Reynolds are closed gatekeepers (methodology **kill criterion** for a DMS replacement). The unserved product is *continuity*: a nightly encrypted export of service ROs/appointments/parts tickets that a dealer can run from if the DMS dies
- **Spend signal:** $1.02B / 3 weeks industry-wide; extra staffing + IT + floorplan interest in the AEG estimate; smaller dealers hit hardest
- **Catalyst / trend:** 2024 outage still litigating in arbitration through 2025; SEC 4-day materiality rules make the next outage a disclosure event
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 5 · reachability 2 · solo-buildability 2 · whitespace 4 · why-now 3
- **Solo-builder angle:** DMS-agnostic **offline service/parts snapshot** (read-only export + local RO pad) sold as insurance, not as a CDK competitor. Expect legal/ToS fights; do not require CDK APIs.

### auto-P6. Collision shops lose hours fighting insurers on supplements, calibrations, and CCC valuations

- **Who hurts:** Independent body shops; consumers on total-loss
- **What happens now (workaround):** Resubmit canceled supplements; photo/invoice packets; refuse State Farm; customers hire independent appraisers
- **Frequency:** Per claim; "70% of supplements" anecdotal for one carrier
- **Evidence:**
  - community https://www.reddit.com/r/Autobody/comments/1sxdu4d/statefarm_nightmare_company/ — "Their calibrations are awful, they never want to pay even when we have photos and invoices"; "On probably 70% of supplements I send to them … someone canceled your supplement request." (snippet, 2026-era thread)
  - community https://www.reddit.com/r/Autobody/comments/1p2h1ez/why_do_so_many_body_shops_have_problems_with/ — "Documentation and persistence… They’re going to fight it, you need to be ready for the fight." OEM-required inspections unpaid unless documented. (snippet)
  - MOTOR Mar 2026 (link above) — **77% of shops** report insurers push back on ADAS calibration charges at least some of the time
  - consumer https://www.reddit.com/r/personalfinance/comments/vctiiw/car_was_totaled_and_insurance_is_cutting_1800_of/ — Allstate/CCC One valued a car at $11,200 vs $16,500 paid 8 months prior; "CCC One had settled *MULTIPLE* class action lawsuits for purposely devaluing totaled vehicles" (snippet; older thread, still the mechanism)
- **Incumbent gap:** CCC One is the insurer's tool, not the shop's advocate; shops still assemble photo/OEM-procedure packets by hand
- **Spend signal:** Unpaid calibrations ($300–$600) and unpaid OEM procedures; cycle-time delay is the real cash cost (rental cars, supplements restart)
- **Catalyst / trend:** ADAS line-item on every estimate now; MOTOR 2026 documents the insurer-pushback rate
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** "Supplement binder" generator: OEM procedure citations + photos + scan docs into a carrier-ready packet. Adjacent to auto-P2.

### auto-P7. Cloud shop-management (Shopmonkey 2.0 especially) is $239–$499/mo, buggy after upgrades, and weak on QuickBooks

- **Who hurts:** 3–10 bay independents that already bought the "modern SMS"
- **What happens now (workaround):** Dual-enter inventory in QBO; stay on Tekmetric; eat the bill
- **Frequency:** Daily workflow; upgrade events
- **Evidence:**
  - review https://www.g2.com/it/products/shopmonkey/pricing — Basic **$239**/3 users/mo; Clever $399; Genius $499 (G2 2026 pricing page snippet)
  - review https://www.g2.com/it/products/shopmonkey/reviews — "Shopmonkey 2.0 … nelle prime 2 ore … non meno di 10 problemi di glitch/bug" (none fixed ~2 months); "Il mio principale disappunto attualmente con Shopmonkey è la sincronizzazione con Quickbooks. Dopo l'aggiornamento alla versione 2.0 il mio inventario non è stato trasferito correttamente" (snippet, 2026 reviews page)
  - review https://www.g2.com/compare/mitchell-1-automotive-repair-vs-shopmonkey — "Shopmonkey is falling very quickly from where it once stood. The customer service is not as personal as it once was" (snippet)
  - review https://www.g2.com/it/products/tekmetric/reviews — Tekmetric: "closed ecosystem and the high level of difficulty for custom integrations" + weak inventory → "manual workarounds" (snippet)
  - pricing https://shoptechscore.com/tekmetric-alternatives/ — Tekmetric marketing add-on **$345/mo** on top of $179 start (2026)
- **Incumbent gap:** DVI, texting, and accounting are upsells; QBO sync is the recurring 1-star theme; Tekmetric is better-liked (4.9) but closed
- **Spend signal:** $239–$499/mo SMS + $194 SI + ALLDATA; marketing add-on $345/mo; shops already putting software inside IMR's overhead complaint
- **Catalyst / trend:** Shopmonkey 2.0 regression (G2 2026); category is crowded (AutoLeap, Shop Boss) so whitespace is *narrow* — pick QBO/inventory as the wedge
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 2
- **Solo-builder angle:** A QBO-faithful inventory/parts layer that sits *next to* Tekmetric/Shopmonkey rather than replacing them.

### auto-P8. EV service looks obligatory but the real check is $5k–$100k plus insurance, so shops stall

- **Who hurts:** Independents in high-EV metros; shops watching Tesla/Hyundai HV jobs walk to dealers
- **What happens now (workaround):** Oil/brakes/tires only; turn HV away; ASE xEV Level 1/2
- **Frequency:** Every EV that rolls in
- **Evidence:**
  - IMR 2026 — 11.0% already name EV/hybrid/ADAS transition as a challenge (will rise)
  - trade https://blog.autodots.io/ev-garage-service-2026-prepare-workshop/ — $5,000–$15,000 starter kit (PPE, insulated tools, LOTO, L2 charger)
  - trade https://www.bestbuyautoequipment.com/ev-service-bay-setup-guide-2026/ — HV cert $1,500–$2,500/tech; insurance premiums **+15–25%** when adding EV; full bay $100,000+
  - trade https://wearechargeninja.com/blogs/ev-phev-repair-shop-startup-costs-tools-equipment-staffing-roi-2026-guide/ — general EV workshop $20k–$50k; battery module center $98k example
  - https://ase.com/tests/x-ev/ — xEV L1 $38.99, L2 $49.99, valid 5 years (fetched via search)
- **Incumbent gap:** SMS vendors don't help with HV readiness; dealers keep OEM software
- **Spend signal:** $5k–$15k to even say yes; 15–25% insurance bump; $150–$250/hr EV labor available to those who invest (ZenBusiness citing WickedFile 2026)
- **Catalyst / trend:** 2026 EV parc + IRA/policy noise (homeowner 25D ended 2025 — see nonprofits-energy-solar file); shops that wait lose the customer for *all* services
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 3 · reachability 3 · solo-buildability 2 · whitespace 3 · why-now 3
- **Solo-builder angle:** An "EV intake & safety gate" (which jobs this shop may legally/insurably do vs. refer) plus a referral network — not a battery lab.

## Vertical catalysts (dated)

- **IMR Dec 2025 / pub 2026:** parts-affordability 46% (was 20.6% into 2025).
- **UNF ADAS workforce study** (survey 304 collision shops; AirPro Aug 15 2025, PDF Sep 2025): 76% no ADAS specialist.
- **MOTOR/Revv ADAS benchmark** Mar 11 2026 (n=300) and **MOTOR "Calibration Oligopoly"** Jul 15 2026 ($70k rigs, AEB ~2029).
- **CDK ransomware** Jun 19–Jul 5 2024; $1.02B dealer losses (AEG Jul 15 2024); lawsuits → arbitration by Jun 19 2025.
- **Tariff-driven parts quotes** — live ASO thread Jul 2025 (body paywalled).
- **ASE xEV** standards v2.1 dated Jan 14 2025; tests $38.99/$49.99.

## Consumer flip-side

- **Estimate bait-and-switch / upsell:** oil change → $2,200 (r/chicago 1thpv6t); online brake special → $2,000 bill (r/Ford 1t4ot3u). Honest DVI with photos is the trust product independents already pay Shopmonkey/Tekmetric for — consumers still don't trust chains.
- **Total-loss CCC valuations** under-comp the car (r/personalfinance vctiiw; class-action history). Consumer-side "comp finder" is a wedge adjacent to collision shops.
- **Post-calibration failures:** IIHS (~50% of owners report issues) means the consumer is the one driving an uncalibrated AEB system when shops skip P2.
- **NHTSA** not mined this run (thin).

## Sources that failed or came up thin

- AutoShopOwner.com bodies often **login-walled**; several high-signal threads (parts-price tariffs 21310; DVI 18468) returned titles only.
- First ADAS-cost search and first Tekmetric-reddit search **errored**; recovered via MOTOR + G2.
- Ratchet+Wrench 2026 survey page is a teaser (Jun 29 2026) — full KPI tables not fetched.
- Direct reddit.com fetch blocked; all Reddit quotes are snippets.
- CCC One shop-side hatred is thinner than expected in 2025–26 search; stronger signal is **insurer (State Farm) supplement cancellation** + MOTOR's 77% calibration-pushback stat. Treat CCC-as-villain as older/consumer.
- Detailing-specific software pain not found in this pass (would have been a 9th problem).
- Shop-Ware primary reviews not isolated (only comparison-table pricing ~$249/mo).
- Charm.li / shared ALLDATA logins are piracy-adjacent — noted as workaround evidence, not a product to build.
