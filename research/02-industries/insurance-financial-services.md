# Insurance and Financial Services — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** US independent P&C insurance agencies/brokers (especially ≤10-person shops), plus loan originators / small mortgage brokerages. Captive carriers, national brokers (Marsh/Aon), and bank-owned agencies excluded. Medicare-advantage FMO pain appears in insurance-forums.com but is treated as adjacent, not core.
- **Searches/fetches performed:** 24 web searches, 11 direct fetches (CFPB complaint API + 2025 Consumer Response Annual Report PDF, Ivans/Risk & Insurance, Vertafore/ITL, First Connect/Carrier Management, Corporate Insight, Applied Recon blog, Commission Wizard, Ohio Insurance Agents E&O, Big I / IA Magazine, Capterra HawkSoft vs EZLynx)

## Industry snapshot

- Structure: ~39,000 independent P&C agencies (Big I 2024 Agency Universe; 2026 study still in field as of Mar 11, 2026). Average 17 carrier appointments. 1 in 3 agencies expect an ownership change in five years. ([IA Magazine, Sep 26, 2024](https://www.iamagazine.com/news/7-findings-from-the-2024-agency-universe-study/); [Big I AUS page](https://www.independentagent.com/agency-universe-study/))
- 2026 climate: hard-market hangover easing in spots (First Connect 2026: “significant” availability challenges 44%→35%), but E&S mix is still rising (Vertafore: 40% of agencies expect to place *more* E&S than 2025). Re-keying remains the #1 workflow pain (Ivans 2026, n>700).
- Buyers: agency principals and CSRs; commercial producers who market mid-market accounts to 4–5+ carriers per risk (Ivans). Mortgage LOs at broker shops fighting TRID clocks and LO-comp rules.
- Incumbents: Applied Epic ($210–$240/user/mo reported; one quote $1,300 first user; one shop shopping Epic at “$3.5K+ a month and a $5K setup fee”), Vertafore AMS360 (~14% YoY for 3 years per a 5-person shop), EZLynx (~$409/mo <5 users + $500 setup), HawkSoft (~$250/mo list on Capterra). Commission add-ons (Applied Recon, Commission Wizard, Commission Tracker from $187/mo processing).

## Top problems

### insurance-P1. Cross-carrier quoting is still copy-paste: 74% of agents name re-keying as their top workflow pain, and 90% have pulled business from a carrier because of it

- **Who hurts:** independent P&C agencies, especially commercial-heavy books; 5-person shops with AMS + a rater
- **What happens now (workaround):** re-enter the same ACORD data into 4–5 carrier portals; email submissions; “aggregation software” that “sometimes works”; EZLynx for personal lines
- **Frequency:** daily on new business and remarkets
- **Evidence:**
  - ranked survey https://riskandinsurance.com/re-keying-and-workflow-friction-are-costing-carriers-placement-ivans-survey-finds/ — Ivans 2026 Agency-Carrier Connection Report, n>700: “Re-keying data ranks as the top workflow pain point for 74% of agents, and 90% of respondents said they have reduced business with a carrier due to friction.” Simple quoting 60% vs commission 32%. Commercial specialists “re-keying data more than 70% of the time… 49% use email and just 7% use dedicated submission capture software.” “54% of agents lose commercial deals every month because they cannot reach the right markets fast enough.” 79% say commercial submission automation would change placement immediately. (Aug 28, 2026)
  - ranked survey https://www.iamagazine.com/news/7-findings-from-the-2024-agency-universe-study/ — “Dealing with multiple carrier interfaces was the No. 1 technology issue for agents” (Sep 26, 2024; 1,269 respondents)
  - community https://www.reddit.com/r/InsuranceAgent/comments/1sfy86z/is_anyone_elses_agency_still_running_on_copy_and/ — “I have a 5 person… AMS and a rater. Still manually re entering the same client data into 4 different carrier portals every time I quote commercial.” (snippet)
  - community https://www.reddit.com/r/InsuranceAgent/comments/1rw50gq/how_long_does_it_actually_take_you_to_market_a/ — “writing up the submission, tailoring it for each carrier's appetite, figuring out which portal or email each underwriter prefers… I just had an account that I went to 66 markets on before I found” (snippet)
  - ranked survey https://corporateinsight.com/what-independent-agents-really-want-from-commercial-lines-carriers/ — n=214, Q4 2025: “55% report that their typical quote cycle takes four to seven days. Only 7% can complete the process in one to three days.” (Mar 9, 2026)
- **Incumbent gap:** EZLynx rates personal lines; commercial still lives in portals + email. Applied/Vertafore do not kill carrier-by-carrier rekey. Carriers have little incentive to standardize (Ivans: agents already punish them by steering, and still rekey).
- **Spend signal:** 4–7 day quote cycles; lost deals every month (54%); agencies already pay Epic at $210–$240/user/mo *plus* a rater and still rekey. 79% would change placement for submission automation — revealed preference, not a survey wish.
- **Catalyst / trend:** Vertafore 2026: 40% expect more E&S than 2025, which means more supplemental apps late in the process ([Insurance Thought Leadership, Mar 11, 2026](https://www.insurancethoughtleadership.com/agent-broker/independent-agencies-top-priorities-2026)).
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 5 · solo-buildability 3 · whitespace 2 · why-now 4
- **Solo-builder angle:** Commercial **one-and-done ACORD 125/126 packager** that prefills from AMS/CSV and generates carrier-specific supplemental packets — not a full rater (closed carrier APIs are a kill). Start with 3 lines (GL, property, BOP) and 10 common MGAs.

### insurance-P2. Commission statements arrive as 20 mutually unintelligible PDFs/CSVs; back office spends days in VLOOKUP and still leaks cash

- **Who hurts:** agency bookkeepers/owners at shops with 8–20+ carriers
- **What happens now (workaround):** Excel + VLOOKUP; AMS built-in recon limited to IVANS feeds; bolt-on tools; outsourced processing from $187/mo
- **Frequency:** monthly close
- **Evidence:**
  - incumbent https://www1.appliedsystems.com/en-us/blog/posts/how-to-fix-reconciliation-applied-recon/ — “Every carrier delivers commission statements in different formats, requiring manual interpretation and normalization. Teams spend hours reconciling transactions across statements, policies, and invoices, often in spreadsheets… What once took days of effort now takes hours.” (Apr 13, 2026)
  - willingness-to-pay https://commissionswizard.com/blog/insurance-commission-reconciliation-guide — “The typical independent agency spends 40 to 80 hours per month on this — that's one to two full-time employees doing nothing but side-by-side spreadsheet comparison.” (Mar 15, 2026; **vendor-claimed hours**)
  - willingness-to-pay https://commission-tracker.com/insurance-commission-reconciliation/ — “Commission Processing Service team reconciles them for you, starting at $187/month.” Splits “a spreadsheet nightmare across 800 policies.” (snippet/live)
  - ranked survey (download still incomplete) https://www.iamagazine.com/news/7-findings-from-the-2024-agency-universe-study/ — direct-bill commission statement downloading only “52% in 2024 versus 45%” — nearly half of agencies still lack electronic statements. (Sep 26, 2024)
- **Incumbent gap:** Applied Recon is Epic-only. AMS360/EZLynx/HawkSoft users are stuck with spreadsheets or $187+/mo human processing. IVANS ACORD 820 does not cover every carrier.
- **Spend signal:** $187–thousands/mo for processing; 40–80 hrs vendor claim (treat as upper bound) vs Applied’s “days”; if even 20 hrs/mo at $30/hr bookkeeper = $7k/yr plus leaked unpaid commission. BrokerageAudit (vendor) claims $15k–$35k/yr recovered — **not independently verified this run**.
- **Catalyst / trend:** none — structural format chaos; Applied productizing it in 2026 is the crowding signal.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 3
- **Solo-builder angle:** PDF/CSV statement ingester for **HawkSoft/EZLynx/AMS360** shops that Applied Recon will not serve, with fuzzy policy-number match and a dispute-letter generator. Avoid Epic-first (Applied will squash you).

### insurance-P3. Carrier appetite changes live in reps’ heads and a spreadsheet nobody updates — agencies find out when the renewal is declined

- **Who hurts:** commercial and homeowners producers; new independent owners
- **What happens now (workaround):** bi-monthly lunches with Hartford/Travelers reps; forwarded PDF bulletins; “in theory we have an excel spreadsheet but it does not get updated”
- **Frequency:** weekly chatter; episodic at renewal
- **Evidence:**
  - community https://www.reddit.com/r/InsuranceAgent/comments/1rgzkl6/how_are_you_tracking_carrier_appetite_changes/ — “Do you get notified when a carrier changes appetite or do you find out when a client's renewal gets declined?” Reply: “in theory we have an excel spreadsheet but it does not get updated very often for reasons. Basically we are on our own to keep up with market appetite”; “yeah the spreadsheet struggle is real” (snippet)
  - ranked survey https://www.iamagazine.com/news/7-findings-from-the-2024-agency-universe-study/ — “When asked what their No. 1 challenge is, 56% of agencies said it was finding carriers that will maintain their commitment to their market, up from 31% in 2022.” Second: carriers addressing new personal-lines risks, 49%. (Sep 26, 2024)
  - ranked survey https://corporateinsight.com/what-independent-agents-really-want-from-commercial-lines-carriers/ — commercial agents: “underwriting flexibility and appetite came out on top at 39%, nearly 50% more important than competitive pricing… 26%.” (Q4 2025 / Mar 9, 2026)
  - trade press https://www.insurancethoughtleadership.com/agent-broker/independent-agencies-top-priorities-2026 — “Carrier appetite changes are expensive when agencies aren't structured to adapt. Every shift means rebuilding submissions, re-entering information, and spending more time redoing work that was already completed.” (Mar 11, 2026)
  - community https://www.reddit.com/r/InsuranceAgent/comments/1ozibye/new_independent_agency_owner_struggling_with/ — new owner asking for “carrier appetite cheat sheets”; advice: “gather as much of their underwriting guidelines in pdf format, start a project in chat gpt” (snippet)
- **Incumbent gap:** First Connect 2026 says only 8% still have “significant” appetite-clarity problems (down from 17%) — **market is softening, tools still lag**. Carriers claim real-time appetite indicators (29% of First Connect’s 44 carrier partners) but agents still run Excel. ([Carrier Management, Jul 2, 2026](https://www.carriermanagement.com/news/2026/07/02/289616.htm))
- **Spend signal:** rebuilding a submission is the cost (P1 hours); lost renewals are the revenue. Big I: 56% name carrier commitment as #1 challenge.
- **Catalyst / trend:** admitted↔E&S oscillation in 2026; First Connect wish-list unchanged YoY: “real-time appetite indicators, integrated quoting… automated prefill.”
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** Agency-shared **appetite wiki** seeded from public guidelines + producer notes (ZIP × class code × roof age), with a “declined last month” feed — Wikipedia-for-a-5-person-shop, not a carrier-official API.

### insurance-P4. Homeowners non-renewals dumped onto independent agents who must re-shop FAIR Plan + DIC + admitted markets inside a 75–120 day clock

- **Who hurts:** personal-lines independents in CA/FL and their homeowners; CSRs doing remarkets instead of new business
- **What happens now (workaround):** full-market re-quote; Citizens/FMAP (FL); FAIR Plan + DIC (CA); property-packet chase (roof age, photos, mitigation)
- **Frequency:** episodic per notice, high volume in catastrophe states
- **Evidence:**
  - consumer/agency https://www.miamipremierinsurance.com/blog/florida-home-insurance-non-renewal-guide/ — “By early 2026 the count of carriers writing personal residential property in the state has climbed back to around 30, including 17 new admitted carriers… Use an independent agent who can run the full admitted-carrier market in one pass.” Citizens 20% eligibility rule. (2026)
  - consumer/agency https://oldharbor.com/2026/05/20/homeowners-insurance-non-renewal-california/ — “Old Harbor Insurance helps California homeowners navigate non-renewals by searching across 81 A-rated carriers… The 75-day window is enough time to find replacement coverage, but only if you treat the notice as a hard deadline.” (May 20, 2026)
  - regulator https://www.insurance.ca.gov/01-consumers/140-catastrophes/MandatoryOneYearMoratoriumNonRenewals.cfm — SB 824 one-year moratorium after declared wildfire emergencies; bulletins include Dec 23, 2025 and other 2025 declarations. (CDI, live)
  - ranked survey (hard-market talking points) https://www.iamagazine.com/news/7-findings-from-the-2024-agency-universe-study/ — “56% of agents say that developing talking points for customers about the hard market and coverages is the most important factor to succeed, surpassed only by identifying operating efficiencies (63%).” (Sep 26, 2024)
- **Incumbent gap:** Personal-lines raters help when admitted markets exist; they do not assemble a FAIR Plan + DIC + lender-mortgagee package or a 75-day deadline workflow.
- **Spend signal:** each non-renewal is a full re-shop (P1 labor) under a statutory clock; agencies that fail it eat E&O (P6) and lost households.
- **Catalyst / trend:** CA wildfire moratoriums still firing in 2025–26; FL market thawing (new admitted carriers) but Citizens/FMAP remain the backstop. CDI Home Insurance Finder exists but “doesn't guarantee that those insurers are selling policies to new customers” ([Kin](https://www.kin.com/home-insurance/california/)).
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** **Non-renewal operating kit for CA/FL independents**: notice parser → document checklist → admitted/E&S/FAIR/Citizens decision tree → lender-ready binder packet. Geographic wedge, not a national AMS.

### insurance-P5. The AMS tax is real: Epic at $3.5k+/mo, AMS360 +14% YoY, $18–22k to leave — small shops feel trapped in 2014 UX

- **Who hurts:** 5–20 person independents on Applied/Vertafore
- **What happens now (workaround):** shop EZLynx/HawkSoft/QQ Catalyst; live with modules they don’t use; Zapier for AI receptionist
- **Frequency:** renewal-time rage; migration as a multi-month project
- **Evidence:**
  - community https://www.reddit.com/r/InsuranceAgent/comments/1s4ox2n/ezlynx_vs_hawksoft_for_personal_commercial_agency/ — “looking at the Epic upgrade but don’t think it’s worth paying $3.5K+ a month and a $5K setup fee.” (snippet)
  - community https://www.reddit.com/r/InsuranceAgent/comments/1tbbsct/thinking_about_migrating_off_ams360_for_our/ — “pricing keeps climbing (~14% YoY for 3 years)”; “the UX feels like 2014”; “migration cost quote from a consultant: $18-22k, plus 6-8 weeks of dual-running” (snippet)
  - community https://www.reddit.com/r/InsuranceAgent/comments/1id5n4e/applied_epic_and_ezlynx_cost/ — “They charge us $210 per user loging and a $420 flat monthly fee”; “We pay $240/mo per user for Epic… Onboarding a new user is like a $800 admin fee”; sales quote “1,300 for the first user and 270 for additional users.” (Jan 29, 2025)
  - review-gap https://www.capterra.com/compare/79412-102928/HawkSoft-CMS-vs-EZLynx — HawkSoft: “Pricing is well below Applied Systems.” EZLynx: “Can be expensive for small agencies, especially with add-ons”; “Lots of features are missing and are added based on fees.” (Capterra 2026; snippet)
  - community https://www.reddit.com/r/InsuranceAgent/comments/1rep7vx/agency_management_systems/ — “We use Applied EPIC… its also very expensive. Don't know that I'd recommend it to a smaller/newer agency” (snippet)
- **Incumbent gap:** Robust commercial AMS is priced for aggregators; personal-lines-cheap AMS is weak on COIs/schedules (EZLynx commercial complaints in the same threads).
- **Spend signal:** $2.5k–$3.5k+/mo Epic; $18–22k exit fee; EZLynx ~$409/mo as the price umbrella for a solo-built wedge.
- **Catalyst / trend:** none new — classic incumbent price-umbrella. Applied adding Recon/Pay in 2026 to deepen lock-in.
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 5 · reachability 5 · solo-buildability 2 · whitespace 2 · why-now 2
- **Solo-builder angle:** Do not clone Epic. Sell **one workflow Epic does expensively** (COI issuance, or commercial renewal comparison) as a $99–$199/mo companion for HawkSoft/EZLynx shops.

### insurance-P6. E&O sits on inconsistent courtesy calls and missed renewals — one skipped cancellation notice can be a six-figure claim

- **Who hurts:** every independent agency; especially shops that “sometimes” call late-pay clients
- **What happens now (workaround):** discontinue courtesy calls (E&O carriers now recommend this); over-document; hope AMS renewal reports are watched (one Reddit shop missed a renewal because it “was in one person's head and they were out sick”)
- **Frequency:** daily cancellation/renewal queue; claim is rare, severity is extreme
- **Evidence:**
  - association https://ohioinsuranceagents.com/blog/2026/managing-eo-risks-in-client-cancellation-notices/ — “When an agency establishes a pattern of contacting clients about pending cancellations, it may unintentionally create a legal duty to continue doing so.” “Industry authorities and E&O carriers now advise eliminating this practice entirely.” (Feb 5, 2026)
  - E&O carrier https://risk.uticanational.com/eo/loss-control-articles/failure-to-notify-of-cancellation-of-coverage-replacing-cancelled-coverage-and-reporting-of-claims — agent who sometimes fronted premiums: “This claim paid over $500,000.” (Utica; undated page, still published)
  - legal https://www.insurancejournal.com/news/east/2025/09/09/838430.htm — CT Supreme Court, Sep 2025: broker had no duty to relay nonrenewal *in that case*, but the litigation itself is the cost; dissent wanted to expand the duty. (Sep 9, 2025)
  - community https://www.reddit.com/r/InsuranceAgent/comments/1sfy86z/is_anyone_elses_agency_still_running_on_copy_and/ — “Then renewal came up last week that nobody caught because it was in one person's head and they were out sick.” (snippet)
- **Incumbent gap:** AMS renewal lists exist; they do not encode “we will / will not call on cancellations” as a documented, consistent, E&O-defensible workflow. Courtesy-call advice now *conflicts* with client-service culture (P7).
- **Spend signal:** Utica example >$500k paid; E&O premium is a line item every agency already buys. Consistency tooling is cheaper than one claim.
- **Catalyst / trend:** CT 2025 ruling + 2026 association guidance crystallize the “stop calling” shift while consumers still expect an agent to catch nonrenewals (P4).
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** **E&O-safe renewal/cancellation playbook software**: written client notice, AMS activity log, no ad-hoc calls, exception queue when a human *does* take on a duty — sold through state Big I chapters.

### insurance-P7. Producers spend 60%+ of the day on admin (claims status, billing, compliance) instead of selling

- **Who hurts:** commercial producers and CSRs
- **What happens now (workaround):** live in email; AMS activity notes; hope the carrier portal has claim status; marketing automation for renewal blasts
- **Frequency:** daily
- **Evidence:**
  - ranked survey https://corporateinsight.com/what-independent-agents-really-want-from-commercial-lines-carriers/ — “The majority of agents (61%) report spending 60% or more of their day on administrative tasks rather than selling. Only 16% describe their days as skewed toward selling.” “The single most time-consuming task is communications about their clients’ claims, cited by 58% of commercial agents. Regulatory compliance documentation and billing and payment processing tied for second at 42% each.” (Q4 2025 / Mar 9, 2026)
  - ranked survey https://www.insurancethoughtleadership.com/agent-broker/independent-agencies-top-priorities-2026 — “nearly 30% said they expect AI-driven process improvements to deliver the strongest return on investment in 2026”; “More than half of respondents agreed that providing proactive, timely communication will set high-performing agencies apart in 2026” but “Juggling renewals, remarketing risk, and doing the daily work… keeps teams from picking up the phone.” (Mar 11, 2026)
  - community https://www.reddit.com/r/InsuranceAgent/comments/1rr0jkb/horribly_inefficient_agency_workflows/ — asks for tools that “Help us compare an insured’s situation against carrier appetites, forms, exclusions, endorsements”; Applied Epic launching renewal-review tech that “compares all of the lines of coverage from the old policy to the new” (snippet)
- **Incumbent gap:** Claim status is trapped in carrier portals; agencies become the human API. First Connect 2026: only 35% of agents use AI daily, and “no activity that more than 17% of agents said they would use AI to complete” because of E&O-ish hallucination risk ([Carrier Management](https://www.carriermanagement.com/news/2026/07/02/289616.htm)).
- **Spend signal:** 60% of a producer’s loaded cost is admin; claims-status is the #1 time sink. AI ROI is the 2026 budget line agencies already told Vertafore they will fund.
- **Catalyst / trend:** AI appetite is high, trust is low — a narrow, citation-backed claim-status bot is more sellable than a generic agent chatbot.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** **Read-only claim-status aggregator** for the 5–10 personal-lines carriers a small agency actually writes, with client-safe SMS (“your claim is with the adjuster, next action X”) — no coverage advice (E&O).

### insurance-P8. On the consumer/mortgage side: servicing, escrow, and credit-reporting disputes dwarf origination complaints — LOs still drown in TRID clocks and document chases

- **Who hurts:** borrowers vs servicers; loan originators at broker shops; small advisory firms adjacent to mortgage
- **What happens now (workaround):** TRID calendars in LOS; repeated borrower document requests; CFPB complaints after servicer transfers
- **Frequency:** per-file (origination); monthly (escrow)
- **Evidence:**
  - ranked survey / government https://files.consumerfinance.gov/f/documents/cfpb_2025-cr-annual-report_2026-03.pdf — “In 2025, the Bureau received more than 6.6 million complaints” (vs 3,187,900 in 2024). Credit/consumer reporting “more than 5.8 million… 88%.” “The CFPB received approximately 30,400 mortgage complaints in 2025.” “The most common issue was Trouble during payment process.” Escrow: “late fees or penalties associated with servicers failing to timely disburse property tax or insurance payments… especially frequent after servicing transfers.” Origination: “lengthy loan application processing times and challenges dealing with unresponsive loan officers… extensive and repeated document requests.” (report dated Mar 31, 2026)
  - live API https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/?size=0&agg=product — database total `hits.total.value` = **17,814,755** complaints; largest bucket “Credit reporting or other personal consumer reports” **12,251,639** (fetched 2026-09-17)
  - community https://www.reddit.com/r/loanoriginators/comments/1l1qrfn/trid_timing_laws_can_suck_my_ass/ — title/post Jun 2, 2025; top comment “TRID. The Reason I Drink.” (snippet)
  - community https://www.reddit.com/r/loanoriginators/comments/1rwqb3u/lo_comp_question_for_brokers/ — “the ability to change comp via BPC really makes it difficult to maintain a company margin and pay the LO's” (snippet)
- **Incumbent gap:** Encompass/Byte handle LOS compliance; they do not fix post-close servicing communication or escrow-insurance lapses that create the CFPB volume. Credit-reporting complaint flood is 88% of CFPB volume — a consumer wedge, not an agency AMS wedge.
- **Spend signal:** 30,400 mortgage complaints/yr is small vs credit reporting but high-severity (foreclosure, insurance lapse). TRID timing mistakes = delayed closings = lost LO comp.
- **Catalyst / trend:** CFPB volume doubled in 2025, largely credit-repair/AI-spam per the Bureau — noisy, but servicing/escrow narratives in the same report are still human and structural.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 3 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** **Borrower-facing mortgage-file status + document vault** for small brokers (what’s outstanding, TRID dates, who has the ball) — same shape as accounting-P1, sold to originators who are the ones clients call “unresponsive.”

## Vertical catalysts (dated)

- **Ivans 2026 Agency-Carrier Connection Report** (n>700): re-keying 74%, 90% steered away from high-friction carriers; commercial submission automation #1 requested capability second year running. [Risk & Insurance, Aug 28, 2026](https://riskandinsurance.com/re-keying-and-workflow-friction-are-costing-carriers-placement-ivans-survey-finds/).
- **Vertafore independent-agency survey** for 2026 ops: 40% expect more E&S than 2025; ~30% say AI process improvement is the top 2026 ROI. [ITL, Mar 11, 2026](https://www.insurancethoughtleadership.com/agent-broker/independent-agencies-top-priorities-2026).
- **First Connect 2026 State of the Industry** (238 First Connect agents): significant availability challenges 44%→35%; D2C named the #1 channel threat by 43% (up from 37%). [Carrier Management, Jul 2, 2026](https://www.carriermanagement.com/news/2026/07/02/289616.htm). Sample is First Connect’s own book — not a census.
- **Big I 2026 Agency Universe Study** opened Mar 11, 2026 (due Apr 20); 2024 study still the latest completed ranked dataset (39,000 agencies; 56% “finding carriers that will maintain commitment”). [IndependentAgent.com](https://www.independentagent.com/news/2026-agency-universe-study-survey-now-open/).
- **CT Supreme Court** *Deer v. National General* (Sep 9, 2025): no general broker duty to relay nonrenewal — but E&O associations in 2026 still telling agencies to kill inconsistent courtesy calls.
- **CA CDI wildfire nonrenewal moratoriums** still issuing through late 2025 (e.g. Dec 23, 2025 declaration). [CDI](https://www.insurance.ca.gov/01-consumers/140-catastrophes/MandatoryOneYearMoratoriumNonRenewals.cfm).
- **CMS CY2025** compensation cap consolidating admin fees for MA/PDP (insurance-forums adjacent). Not load-bearing for P&C.

## Consumer flip-side

- **Mortgage servicing/escrow, not shopping:** CFPB 2025 — 30,400 mortgage complaints; top issue “Trouble during payment process”; escrow tax/insurance disbursement failures after servicing transfers; unresponsive LOs and repeated document requests on the origination side. [CFPB 2025 Consumer Response Annual Report PDF](https://files.consumerfinance.gov/f/documents/cfpb_2025-cr-annual-report_2026-03.pdf).
- **Credit reporting dominates the database** (88% of 2025 complaints; 12.3M of 17.8M historical records in the live API). Bureau itself flags credit-repair orgs and LLM/AI agents flooding “duplicative and spurious” submissions ([Orrick summary of the same report](https://infobytes.orrick.com/2026-04-10/cfpb-reports-complaint-volume-doubled-in-2025-citing-surge-in-credit-reporting-disputes/)) — treat volume as inflated.
- **Homeowners non-renewal** is the P&C consumer crisis: 75-day (CA) / 120-day (FL) clocks, FAIR Plan/Citizens as last resort, independent agent as the actual shopping engine (P4).
- B2B2C wedge: the same status/comms layer that reduces agency E&O (P6–P7) is what consumers say they do not get from servicers and LOs.

## Sources that failed or came up thin

- **insurance-forums.com** is active but 2025–26 threads in search were overwhelmingly **Medicare Advantage / Med Supp commission cuts**, not P&C independent-agency quoting. Used as adjacent signal only.
- **G2 AMS reviews** not retrieved (Capterra HawkSoft/EZLynx used instead). Applied Epic Capterra deep-dive was not a dedicated page this run.
- **Big I 2026 AUS results** not published yet (survey closed Apr 20, 2026; page still “2026 Reports Coming Soon”). 2024 figures are 18 months old on the hard-market questions.
- **Commission hour counts (40–80/mo, $15–35k recovered)** come from vendors (Commission Wizard, BrokerageAudit). Applied independently confirms “hours” and “days” but not those dollar recoveries — flag as **upper-bound / vendor**.
- **First Connect survey** is of First Connect’s own 238 agencies, not the 39,000-agency census; availability-improving stats may overstate the thaw.
- **Trustpilot/BBB** not mined (likely blocked; not attempted beyond CFPB). Homeowners anger is cited from agency/consumer-guide pages, not complaint-board verbatims.
- **r/CFP / small RIA pain** not reached at usable density this run — advisory-firm problems are thinner than P&C agency problems in the evidence pack.
- **CFPB API `agg=product`** worked; it returns cumulative all-time buckets, not 2025-only. Annual-report counts used for yearly volume.
