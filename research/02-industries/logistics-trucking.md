# Logistics & Trucking — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Small fleets (1-20 trucks), owner-operators, small freight brokerages, dispatch services. Not ocean/air freight forwarding, not enterprise 3PL ops.
- **Searches/fetches performed:** 15 web searches + 1 direct API fetch (2 searches errored and were re-run with varied phrasing)

## Industry snapshot

- Two distinct small-business buyers: carriers (owner-ops/small fleets — r/Truckers, r/OwnerOperators, OOIDA) and brokers (r/FreightBrokers, TIA members). Both are complaint-rich, tool-skeptical, and reachable in public forums.
- The 2022-2024 "Great Freight Recession" killed ~88,000 carriers in 2023 alone; the market flipped in 2025-2026 to supply-led tightening — spot rates +43% YoY (ACT Research, June 2026) and 4Q2026 rates projected 15-20% above prior year (AlixPartners). Survivors have cash again but carry recession scar tissue.
- Software is barbell-shaped: enterprise TMS (McLeod ~$200k/yr, Mastermind "baby package" $1M/yr) vs. spreadsheets, QuickBooks, and literal paper notebooks. DAT/Truckstop duopoly on load boards; DAT raising prices ~8%/yr amid complaints.
- Fraud is the industry's 2025-2026 obsession: FMCSA broker-fraud complaints quadrupled since 2021 to 8,000+/yr; cargo theft hit $725M (2025); TIA pegs double-brokering at $700M-$1B/yr.
- Back-office outsourcing is normalized spend: dispatch services take 5-10% of gross, factoring 1-5% of every invoice — a one-truck operation routinely gives away $1,500+/month in fees.

## Top problems

### logistics-trucking-P1. Carrier-identity fraud and double brokering industrialized, and small brokers vet carriers by manually calling FMCSA

- **Who hurts:** Small brokerages (1-10 seats) booking unknown carriers daily; small carriers whose MC identities get hijacked; shippers whose loads vanish.
- **What happens now (workaround):** Manual SAFER lookups, calling the insurance agent directly, cross-checking phone/email against FMCSA records, Carrier411/Highway/MyCarrierPackets subscriptions priced beyond solo brokers, fillable PDF checklists, "book and pray."
- **Frequency:** Every new-carrier booking; fraud attempts weekly.
- **Evidence:**
  - Community https://www.reddit.com/r/FreightBrokers/comments/1t5l362/independent_brokers_how_do_you_actually_verify/ — "Carrier411 is basically a false sense of security at this point. Scammers are literally buying clean MCs with zero reports… I spend 15 minutes manually calling the FMCSA number and verifying the insurance agent directly." and "I have looked into tools such as MyCarrierPackets and Highway, but their monthly costs are exorbitant compared to the level of service provided… I have no choice but to manage everything manually" and "Any sub $50 alternatives out there?" (n.d., 2026-era) (snippet)
  - Community https://www.reddit.com/r/FreightBrokers/comments/1f85gkg/scam_warning_hacked_fmcsa_accounts/ — "the scammer hacked this carriers FMCSA account and changed all the contact info to be themselves… They stole from 3 other shippers in the same day doing the same thing." (n.d.) (snippet)
  - Ranked survey https://www.tianet.org/TIAnetOrg/Member%20Resources/White-Papers/State-of-Fraud-in-the-Industry-April-2025.aspx — "34% of respondents identified unlawful brokering as the most frequent type of fraud… 22% reported more than $200,000 lost." (TIA, April 2025)
  - Trade/catalyst https://truckdispatchexperts.com/resources/broker-fraud-crackdown-2026/ — "The FMCSA received over 8,000 complaints in 2025 — a 4x increase since 2021. The Transportation Intermediaries Association estimates the total cost to carriers at $700 million to $1 billion annually… Effective July 2026, all property brokers must maintain a minimum $150,000 surety bond" (2026) (snippet)
  - Trade https://www.cargonet.com/news-and-events/cargonet-in-the-media/2025-theft-trends/ — "estimated losses surged to nearly $725 million, a 60 percent increase from 2024… average value per theft rose to $273,990" (Jan 21, 2026)
- **Incumbent gap:** Highway/MyCarrierPackets/RMIS are priced and packaged for mid-size brokerages ("exorbitant" for solo brokers); Carrier411 reputation degraded ("scammers buying clean MCs"); none produce an auditable due-diligence record a small broker can show when a claim hits.
- **Spend signal:** Explicit ask for "sub $50" vetting tooling; $200k+ single-incident losses; 22% of TIA respondents lost >$200k; new $150k bond raises the cost of being defrauded.
- **Catalyst / trend:** FMCSA broker-fraud crackdown effective July 2026 (bond doubling $75k→$150k, penalties $16k→$50k/violation); CargoNet 2026 outlook predicts more identity-based "theft by deception."
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 5
- **Solo-builder angle:** A $30-50/mo carrier-vetting copilot for solo brokers that runs the full checklist (SAFER match, insurance-agent verification prompts, contact-change history, inspection sanity checks) and emits a timestamped, auditable due-diligence PDF per booking.

### logistics-trucking-P2. Small fleets and brokerages run on notebooks and 2009-era TMS because modern TMS pricing starts at enterprise scale

- **Who hurts:** 1-20 truck carriers and 1-10 person brokerages; the owner is simultaneously dispatcher, accountant, and safety department.
- **What happens now (workaround):** Paper notebooks for receivables, Excel + QuickBooks stitched together, free-tier AscendTMS despite hating it, $80-180/user/mo mid-tier tools with missing features.
- **Frequency:** Daily — every load touches the stack.
- **Evidence:**
  - Community https://www.reddit.com/r/FreightBrokers/comments/1u53sl3/small_carrier_owner_asking_for_advice/ — "4 trucks, and i'm basically the dispatcher, accountant, and safety guy all at once lol. our current setup is a mess, separate load board logins, a TMS that feels like it was built in 2009, and a notebook (an actual paper notebook) for tracking who owes what… mcleod or turvo which quoted us insane per-user costs" (n.d., 2026-era) (snippet)
  - Community https://www.reddit.com/r/FreightBrokers/comments/1cyehul/best_tms_out_there/ — "with McLeod you can get accounting built in. Also, depending on how many users it's like 200k a year… The best would be something like mastery-master mind. The baby package starts at 1 million a year." (n.d.) (snippet)
  - Community https://www.reddit.com/r/FreightBrokers/comments/192wcee/small_brokerage_tms_recommendations/ — "Everyone is saying Ascend but I personally hated it and found it very unintuitive with a bunch of dumbass features… One misclick and you're fucked. It is free though… it's gotta be better than excel or whatever you're using now." (n.d.) (snippet)
  - Community/WTP https://www.reddit.com/r/FreightBrokers/comments/1phthae/tms_recommendations/ — "we like that it's clean and simple but little things like only being able to duplicate 1 load at a time when we're doing 100-300 load projects is very annoying… Just feel like spending 1k per month is steep considering no progress." (n.d., 2025-26) (snippet)
  - Workaround census https://www.reddit.com/r/OwnerOperators/comments/1sozlo9/owneroperators_how_do_you_actually_track_your/ — "I use a 3 ring binder with sheet protectors… I link all our accounts to QuickBooks to track income and expenses… I also made a spreadsheet on Excel that is like a calculator for figuring out if a load is actually worth it." (n.d., 2025-26) (snippet)
- **Incumbent gap:** Enterprise TMS assumes separate dispatch/accounting/compliance staff; cheap tools miss the one workflow that matters ("load entry, POD capture, and invoicing that doesn't require a finance degree"); nobody owns the 1-5 truck segment because ACV looks too small — but the segment is hundreds of thousands of firms.
- **Spend signal:** Willing to pay $80-150/user/mo today for imperfect tools; $1k/mo cited as current spend at a small brokerage; McLeod/Turvo quotes chase them away.
- **Catalyst / trend:** Post-recession survivors rebuilding ops in 2026 with rates up 43% YoY — cash to spend and hiring caution favors software over admin headcount.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 3
- **Solo-builder angle:** A load-to-cash micro-TMS for 1-5 truck carriers — load entry, rate-con capture, POD photo, invoice, and who-owes-what ledger — flat $99/mo, learnable in one day without a demo call.

### logistics-trucking-P3. Insurance renewals are up 15-25%/yr and CSA scores now swing premiums 50-100%, but small carriers don't manage either until renewal week

- **Who hurts:** Owner-operators ($8k-18k/truck/yr on a $1M policy) and small fleets (5-20 trucks at $5k-10k/truck); new authorities pay $15k-25k in year one.
- **What happens now (workaround):** Shopping brokers at renewal, eating the increase, dropping to minimum coverage, bolting on dash cams for 10-25% discounts, or leasing onto a carrier to escape the premium entirely.
- **Frequency:** Annual renewal shock; CSA events accumulate weekly.
- **Evidence:**
  - Ranked survey https://truckingresearch.org/wp-content/uploads/2025/10/ATRI-Top-Industry-Issues-2025.pdf — Insurance Cost/Availability ranked #3 industry issue of 2025, "up one spot from last year" with "Industry Concern Index 69.0" (Oct 2025, fetched)
  - Trade https://www.freightwaves.com/news/your-insurance-renewal-is-going-to-be-worse-than-last-year-here-is-why-and-what-you-can-actually-do-about-it — "insurance cost at a record $0.102 per mile in 2024… For a truck running 120,000 miles per year, that is $12,240 in annual insurance cost per truck. Five trucks. Sixty thousand dollars per year in insurance before a single claim is filed." and "nuclear verdicts against trucking companies totaled $31.3 billion in 2024 alone" (2026) (snippet)
  - Vendor research https://dispatched.finance/research/state-of-trucking-insurance-claims-2026 — "owner-operators on a $1M policy now band $8K–$18K per truck… year-over-year increases for the typical renewing risk continue to land in the 15–25% range… the same operator at the same DOT class can see 50–100% differences in renewal premium based on CSA alone." (2026, fetched)
  - Vendor research https://truckwriters.com/blog/owner-operator-insurance-rates/ — "New authority (0-12 months) $15,000-$25,000" per year; telematics/dash-cams deliver "15% to 20% reductions" (Jan-May 2026 analysis) (snippet)
- **Incumbent gap:** Insurance brokers engage once a year; ELD/dash-cam vendors hold the safety data but don't package it for underwriting; no cheap tool continuously tracks CSA BASICs percentiles, DataQ-able violations, and renewal-readiness for a 5-truck fleet.
- **Spend signal:** $60k/yr insurance line for a 5-truck fleet; a single CSA quartile improvement is worth thousands per truck per year; dash-cam discount economics already proven.
- **Catalyst / trend:** ATRI #3 ranking (Oct 2025); lawsuit abuse reform #2 at its highest rank in 21 years — litigation environment keeps hardening premiums into 2026-2027.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 3 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** A CSA-and-renewal copilot for 1-20 truck fleets: monitors BASIC percentiles, flags DataQ challenge candidates, tracks dash-cam/telematics discount eligibility, and assembles the underwriting packet before renewal — sold at $50-100/mo against a five-figure premium line.

### logistics-trucking-P4. Detention devours 135M hours a year and fleets collect on fewer than half the detention invoices they send

- **Who hurts:** Drivers (unpaid waiting), owner-operators (lost loads), small fleets (uncollectable invoices); refrigerated carriers worst (56.2% of stops detained).
- **What happens now (workaround):** Writing arrival/departure times on the BOL, photographing timestamps, begging dispatch to bill, layover flat fees ($100) that swallow 20+ hour waits, or dropping the customer.
- **Frequency:** 39.3% of all stops (2023 data); daily for reefer.
- **Evidence:**
  - Ranked survey/study https://truckingresearch.org/2024/09/new-research-documents-substantial-financial-and-safety-impacts-from-truck-driver-detention/ — "drivers reported being detained in 39.3 percent of all stops… While 94.5 percent of fleets charge detention fees, they are paid for fewer than 50 percent of those invoices. As a result, the trucking industry lost $3.6 billion in direct expenses and $11.5 billion in lost productivity from driver detention in 2023." (Sept 2024)
  - Trade https://landline.media/magazine/detention-time-new-study-outlines-true-costs-consequences/ — "detention time resulted in $11,000 to $19,000 in lost annual revenue per driver… although about 75% of incidents of detention time are billed, only a little over half of these fees are actually paid." (2024) (snippet)
  - Community https://www.reddit.com/r/Truckers/comments/1px7ony/no_detention_pay/ — "our load was supposed to be ready by 23:59 last night and it's 14:25 and we're still waiting… We lost at least 1300 miles today and we don't make money if we aren't rolling." (n.d., 2025-26) (snippet)
  - Community https://www.reddit.com/r/Truckers/comments/1m45wjz/suggestion_for_not_getting_paid_detention/ — "there are a number of farms we go to where waiting from 8 am to 6 pm (or even having to stay the night) happens a LOT… I will get a layover, a whopping $100… even if I sat there from 8 am on up, without getting any detention pay." (n.d., 2025) (snippet)
- **Incumbent gap:** ELDs record the truck's position but vendors don't turn geofenced dwell into a claim-ready detention packet; TMS detention modules exist upstream at enterprise brokers, not for the small carrier trying to collect $50-80/hr from a shipper who disputes the clock.
- **Spend signal:** $50-80/hr median detention fees at stake; $11k-19k lost revenue per driver per year; ATRI shows median fees rose only 3% in five years while hourly operating cost rose 21.4% — carriers under-bill and under-collect.
- **Catalyst / trend:** None — structural (ATRI's Sept 2024 study is the definitive quantification; FMCSA detention data collection remains voluntary).
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 3
- **Solo-builder angle:** A detention-evidence app that geofences facility arrival/departure from the driver's phone, auto-builds the timestamped claim packet (photos, BOL, dwell log), and generates the invoice + dispute-ready PDF — priced per truck/month for small fleets.

### logistics-trucking-P5. Factoring is a 36%-APR habit wrapped in per-page fees, reserve holdbacks, and $1k-25k exit penalties

- **Who hurts:** New authorities and small carriers who must factor to survive 35-45 day broker payment cycles; anyone trying to leave a factoring contract.
- **What happens now (workaround):** Factoring 100% of invoices at an advertised 1-3% that lands at 2.5-7% all-in; QuickPay at 5% for 72-hour money; spreadsheet-tracking which brokers pay fast to skip factoring selectively.
- **Frequency:** Every invoice; exit pain episodic but severe.
- **Evidence:**
  - Trade https://www.freightwaves.com/news/they-called-it-a-trap-a-factoring-company-agreed-then-explained-why-youre-using-it-wrong — "if you pay 3% to get your money 30 days earlier than normal terms, you're effectively borrowing at 36% per year… 'They'll give you the 1%, and then for every invoice page, they'll charge you a fee… a fee to receive your payment whether you choose ACH or wire'" (2025-26) (snippet)
  - Guide https://smallfleethq.com/factoring/risks — "'2% for invoices paid within 15 days, 3% for 16-30 days, 4% for 31-45 days'… you have zero control over when a broker pays… the average payment cycle for freight brokers runs 35-45 days… A carrier factoring $80,000 a month with a '3% termination fee' is looking at $2,400 just to walk away." (2025-26, fetched)
  - Guide https://otrucking.com/resources/guides/factoring-hidden-fees/ — "Early termination fees range from $1,000 to $25,000… A reserve holdback of 5-10% per invoice ties up your cash until the broker pays… hidden fees like ACH fees ($5-30), invoice processing ($2-10), monthly fees ($50-200), and minimum volume penalties ($100-500)." (2026) (snippet)
  - Community https://www.reddit.com/r/OwnerOperators/comments/1td53yg/oo_questions_paty/ — "For factoring we use G Squared Funding… The fee is a little high but they have been easy to work with and we get paid same day." (n.d., 2025-26) (snippet)
- **Incumbent gap:** Factoring companies profit from opacity; comparison sites are lead-gen for the factors themselves; no neutral tool parses a factoring contract's all-in cost, flags evergreen clauses/UCC traps, or audits monthly statements against the contract.
- **Spend signal:** 1-5% of 100% of revenue — a $250k/yr owner-op pays $5k-12k/yr in factoring; termination fees up to $25k; statement fee-creep is invisible until audited.
- **Catalyst / trend:** Spot rates +43% YoY (2026) mean bigger invoices and bigger absolute factoring fees; carrier cash cushions from the recovery make un-factoring feasible — the moment carriers re-evaluate.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** A factoring-contract analyzer + monthly statement auditor: upload the contract and statements, get the true all-in rate, every hidden fee itemized, evergreen/UCC deadlines calendared, and a break-even analysis for switching or self-funding.

### logistics-trucking-P6. The back office runs on outsourcing tolls: 5-10% to a dispatcher, paperwork nitpicks delay payment, and quarterly IFTA is a reconciliation chore

- **Who hurts:** Owner-operators with their own authority; the spouse/partner doing "everything else"; small fleets without office staff.
- **What happens now (workaround):** Dispatch services at 5-10% of gross ($1,540/mo on a $22k month); QuickBooks + Excel + Google Forms at state lines; exporting ELD miles and fuel-card CSVs and reconciling by hand each quarter.
- **Frequency:** Weekly invoicing/POD chasing; quarterly IFTA; constant broker paperwork demands.
- **Evidence:**
  - Community https://www.reddit.com/r/FreightBrokers/comments/1bvez5j/new_owner_operator_help/ — "brokers/shipper will find any excuse to delay payment for little stuff like missing stamps, signatures, missing pages etc if you're gonna run a trucking business you need to make sure you're organized & keep all the paperwork until the money is in your account." (n.d.) (snippet)
  - Community https://www.reddit.com/r/OwnerOperators/comments/1t0dhbx/ifta_filing/ — "I export my mileage report, download my fuel transactions, try to reconcile everything, then go file on the state portal. Took me almost an hour this quarter because Motive was showing different miles than I expected on a couple states and I didn't know if I should trust it or not." (May 1, 2026)
  - WTP/workaround https://factoringexpress.com/truck-dispatching-rates/ — "Most U.S. truck dispatchers charge 5% to 10% of gross linehaul revenue, with 5% to 7% typical for a single truck. Flat-fee options generally run around $250 to $500 per truck per week" (2026) (snippet)
  - WTP https://truckleap.com/glossary/dispatch-fee — "For an owner-operator grossing $22,000/month, a 7% dispatch fee is $1,540/month." (n.d.) (snippet)
  - Community https://www.reddit.com/r/logistics/comments/1j4gh2p/how_much_should_a_dispatcher_really_take/ — "A dispatcher that just sends you a load link and collects a fee is a totally different value than one who handles rate negotiations, packets, check calls, invoicing, detention, etc." (2025) (snippet)
- **Incumbent gap:** ELD vendors stop at compliance data; load boards stop at booking; the invoice-POD-collections-IFTA loop is unowned at the one-truck scale, so operators buy human labor (dispatchers, spouses, ATBS bookkeeping) instead of software.
- **Spend signal:** $18k+/yr dispatch fees for a single truck at 7%; $250-500/wk flat-fee alternatives; ATBS-style bookkeeping services are an established subscription spend.
- **Catalyst / trend:** None — structural; AI document handling (rate cons, PODs, fuel receipts) newly makes the paperwork loop automatable by a solo dev.
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 2 · why-now 3
- **Solo-builder angle:** An "everything-after-the-load" assistant for owner-operators: ingest the rate con, chase the POD, generate the invoice, log the paperwork trail brokers demand, and auto-draft the quarterly IFTA reconciliation from ELD + fuel-card exports.

### logistics-trucking-P7. The DAT duopoly raises prices ~8%/yr while uptime, data freshness, and fraud controls decay — and users feel they can't leave

- **Who hurts:** Owner-operators and small brokers paying $200-500+/mo across load board + RateView subscriptions; carriers burned by scammer logins sold on the platform.
- **What happens now (workaround):** Paying up; dropping to Truckstop and reporting equal bookings; free brokerage-owned boards (CHR, JB Hunt); niche boards for vans/box trucks; complaining.
- **Frequency:** Monthly subscription pain; daily usage.
- **Evidence:**
  - Community https://www.reddit.com/r/FreightBrokers/comments/1id1pvt/dat_being_dat/ — "DAT raising prices while servers constantly going down and selling logins to scammers like hotcakes… Im a carrier - we pay 200$ a month now - we cant even block/favorite brokers ! This is fucking insane !" and "8% increase is ridiculous when there is no change in service." (2025) (snippet)
  - Community/WTP https://www.reddit.com/r/FreightBrokers/comments/1lfelct/is_dat_rate_view_the_best_value_in_the_market_for/ — "It's like $250-500 +/- per month and has okay features. In my opinion it is definitely overpriced… Is there something cheaper that is at least as good as DAT Rate View?" (June 19, 2025)
  - Community https://www.reddit.com/r/FreightBrokers/comments/1kl2thy/considering_dat_whats_your_honest_opinion/ — "DAT can be annoying but like others have said there really isn't much else for viable competition." (n.d., 2025) (snippet)
  - Community (churn signal) https://www.reddit.com/r/FreightBrokers/comments/1id1pvt/dat_being_dat/ — "Saw that only one load was booked off of DAT in 6 months compared to 57 in the same 6 month period 2 years ago… Just hit month 3 yesterday of not paying DAT and they sent an email offering 2 months of free service if we sign a year contract." (2025) (snippet)
- **Incumbent gap:** Network liquidity is DAT's moat, so head-on competition is a poor solo play — but adjacent gaps are real: broker-quality memory ("can't even block/favorite brokers"), fraud-screening of load-board counterparties, and cheaper lane-rate intelligence (RateView data described as "10 to 15 days behind").
- **Spend signal:** $200/mo carrier-side, $250-500/mo RateView broker-side, 8% annual increases absorbed; a churned carrier reported identical bookings after cutting the line item entirely.
- **Catalyst / trend:** DAT's Trucker Tools acquisition + price increases (2025) concentrated resentment; fraud-vetting (P1) and rate-data freshness are the exposed flanks.
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 4 · solo-buildability 2 · whitespace 2 · why-now 3
- **Solo-builder angle:** Not a rival load board — a carrier-side counterparty memory layer (block/favorite brokers, payment-speed notes, fraud flags shared across a small trust network) that rides on top of whatever boards the carrier already uses.

## Vertical catalysts (dated)

- **FMCSA broker-fraud crackdown — July 2026.** Property-broker surety bond doubles $75k→$150k; civil penalties for double brokering rise $16k→$50k per violation. https://truckdispatchexperts.com/resources/broker-fraud-crackdown-2026/ (2026; secondary source — rule specifics not verified against Federal Register in this run)
- **Non-domiciled CDL restriction — effective March 16, 2026.** Federal Register final rule (published Feb 13, 2026) tightens non-domiciled CDL issuance; FMCSA estimates ~194,000 drivers (~5% of CDL holders) could be affected, tightening capacity. https://www.federalregister.gov/documents/2026/02/13/2026-02965/restoring-integrity-to-the-issuance-of-non-domiciled-commercial-drivers-licenses-cdl
- **Freight recession officially over — 2026.** ACT Research: aggregate TL spot rates ex-fuel +43% YoY in June 2026, contract +13%; AlixPartners: ~88,000 carriers shut in 2023, 8,000+ exits since Jan 2024, 4Q2026 rates projected 15-20% above year-ago. https://www.actresearch.net/resources/blog/trucking-industry-forecast-for-2027 ; https://www.alixpartners.com/insights/102nznu/the-freight-recession-is-over-is-your-supply-chain-ready/
- **CargoNet 2025 theft analysis — Jan 21, 2026.** $725M estimated losses (+60% YoY), average theft $273,990 (+36%); 2026 outlook: more deception-based misdirection of legitimate carriers. https://www.cargonet.com/news-and-events/cargonet-in-the-media/2025-theft-trends/
- **ATRI Top Industry Issues — Oct 26, 2025.** 21st annual ranked survey (4,200+ respondents): Economy #1 (3rd straight year), Lawsuit Abuse Reform #2 (highest ever), Insurance #3, Truck Parking #4, Driver Compensation #5; AI in Trucking debuts #10; driver shortage falls out of the top 10 (to #12) for the first time in survey history. https://truckingresearch.org/2025/10/for-the-third-year-in-a-row-the-economy-is-the-trucking-industrys-top-concern/

## Consumer flip-side

- **Drivers are the deceived party inside the industry:** wage-theft complaints are systemic — "Truckers account for less than 20 per cent of federally regulated workers, but… the industry was responsible for 85 per cent of all wage-related Canada Labour Code violations between 2017-18 and 2021-22… USA trucking is the same with rampant wage theft." https://www.reddit.com/r/Truckers/comments/1fnfk22/ontario_truckers_say_wage_theft_plaguing_industry/ (2024) (snippet)
- **Detention pay rarely makes drivers whole:** ATRI found detention pay "often does not fully compensate drivers for the per-mile pay they could have otherwise received" (2024); r/Truckers threads document $100 layover for 20+ hour waits — a driver-side pay-transparency or wait-time-documentation wedge exists.
- **Shippers now feel the flip:** with capacity gone, "shippers can expect 4Q2026 rates to remain 15-20% over those one year ago" (AlixPartners, 2026) — small shippers with no TMS face the same vetting/fraud risks as brokers (P1 applies to them too).

## Sources that failed or came up thin

- **Capterra review mining failed for trucking TMS:** `site:capterra.com` search returned unrelated products (recruiting, backup software); review-gap channel for TMS was covered via Reddit TMS threads instead of review sites.
- **Hacker News (Algolia API): 0 hits** for "freight broker trucking software" stories since Jan 2025 — no HN channel for this vertical this run.
- **truckdispatchexperts.com** is a dispatch-service content site; its FMCSA rule summary (bond doubling, $50k penalties, "150 investigators") is directionally corroborated by TIA/FMCSA complaint data but the rule text was not independently verified in the Federal Register during this run — treat specifics as lower-confidence.
- **dispatched.finance and truckwriters.com** are insurance-adjacent vendor research; premium bands ($8k-18k/truck, 15-25% increases) are plausible and internally consistent but not neutral sources.
- **Several Reddit threads lacked visible dates in snippets** (marked "n.d."); thread IDs suggest 2025-2026 era but year attribution is inferred where noted.
- **ATRI detention study is Sept 2024 using 2023 data** — the definitive quantification but predates the 2026 rate recovery; detention economics may look different at +43% spot rates.
