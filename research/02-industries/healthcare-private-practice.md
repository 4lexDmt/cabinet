# Healthcare Private Practice — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Independent medical, dental, PT, mental-health, and veterinary private practices (solo to ~20 providers). NOT hospitals or health systems; hospital-owned groups appear only as contrast.
- **Searches/fetches performed:** 16 web searches, 1 direct fetch (HN Algolia)

## Industry snapshot

- Buyers are practice owners/office managers of small groups: 52% of MGMA 2026 survey respondents are practices with ≤20 physicians; 60-61% independent (MGMA 2026 Regulatory Burden Report, fetched).
- Operating climate 2026: reimbursement flat-to-down while admin burden climbs — 95% of MGMA members saw regulatory burden increase over 3 years; "over 25% of healthcare spending going towards administrative overhead" (MGMA 2026 report).
- Medicare Advantage is the top new pain source: 3 of the top 5 ranked burdens are MA-specific (prior auth, denials, automatic downcoding); 90% of practices saw patient shift to MA and 79% of those say the impact is negative (MGMA 2026).
- Software incumbents are consolidating and raising prices: SimplePractice (Vista Equity PE), WebPT (PE-owned per user complaints), IDEXX Cornerstone/Covetrus (vet), Dentrix/Eaglesoft (dental) — all quote-priced or hiking with per-claim fees.
- Practices already pay for workarounds: outsourced billers at 5-9% of collections, offshore prior-auth VAs at $6-25/hr, credentialing services — real money already flowing at solo-practice scale.

## Top problems

### healthcare-private-practice-P1. Prior authorization is manual, per-payer combat that forces practices to hire dedicated staff

- **Who hurts:** Practice managers and physicians at independent practices of every size; worst where most visits require auth (imaging, specialty, PT).
- **What happens now (workaround):** Phone/fax/payer-portal grinding by dedicated staff; 92% of practices hired or reassigned staff for PA volume; offshore "prior authorization specialist" VAs at $6-12/hr.
- **Frequency:** Daily.
- **Evidence:**
  - Ranked survey https://www.mgma.com/getkaiasset/8c7263b8-882d-4f6a-8d6c-48180fba72c9/MGMA%202026%20Reg%20Burden%20Report%20.pdf — "In the last year, I have had to add two new staff dedicated to handle the growing volume of prior authorizations, bringing the team to a total of four working on them full-time." Also: "90% of practices report an increase prior authorization burden in the past 12 months"; "40% of practices have three or more full-time administrative staff per physician" (2026, fetched full text)
  - Trade press https://www.mgma.com/articles/the-prior-authorization-landscape-in-2025 — "Six in 10 (60%) practices indicated that at least three employees are typically involved in completing a single PA request, while 35% reported spending upwards of 35 minutes on average per request." (2025) (snippet)
  - Ranked survey https://www.mgma.com/getkaiasset/94ea127c-8184-4faa-b2ea-e2e32a06f14c/MGMA%202025%20Prior%20Authorization%20Issue%20Brief.pdf — "92% [hired or redistributed staff]… 89% Very or extremely burdensome" (2025) (snippet)
  - Willingness-to-pay https://zedtreeo.com/services/hire-prior-authorization-specialist — "Remote Prior Authorization Specialists through Zedtreeo start at $6/hr — about $1,056/month for a dedicated full-time hire" (2026) (snippet); https://cureintent.com/prior-authorization-cost-pricing-guide/ — "a prior authorization specialist working about 30 hours weekly may cost around $1,500/month" (2025) (snippet)
- **Incumbent gap:** Payer portals are proprietary and non-interoperable; EHR ePA modules cover drugs, not procedures; enterprise PA-automation vendors sell to health systems, not 5-doc groups.
- **Spend signal:** $1,000-2,500/month per outsourced PA specialist; in-house FTE $4,000-6,000/month; MGMA members report 4 FTEs on PA alone.
- **Catalyst / trend:** CMS-0057-F operational provisions start Jan 1, 2026 (72-hr expedited / 7-day standard decisions, specific denial reasons); payer FHIR Prior Authorization APIs mandatory Jan 1, 2027 — machine-readable rails are arriving for MA/Medicaid/QHP plans.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 5
- **Solo-builder angle:** A per-specialty PA-request copilot that assembles payer-specific documentation packets and tracks status/deadlines across portals for small specialty practices (sold per-provider/month), riding the 2026-2027 CMS API timeline.

### healthcare-private-practice-P2. Payer credentialing/enrollment takes 3-8 months per provider and burns $8k-35k of billings per idle month

- **Who hurts:** New associates and practice buyers (dental, medical, PT, mental health); office managers who chase 10+ payer applications by phone.
- **What happens now (workaround):** Spreadsheet + CAQH + calling payers "roughly twice a month"; daily-minimum pay deals for uncredentialed associates; credentialing services bundled by billers.
- **Frequency:** Episodic per hire but chronic across the industry; every new provider, every new practice, re-credentialing cycles.
- **Evidence:**
  - Community https://www.reddit.com/r/Dentistry/comments/1uk0t1l/insurance_credentialing/ — "My office delayed getting me credentialed… It ended up taking 8 months for me to be fully credentialed…" (June 30, 2026)
  - Community https://www.reddit.com/r/Dentistry/comments/1l2rlda/signed_a_contract_6_months_ago_still_havent/ — "I signed a contract with a corporate company in mid December and the credentialing process has been a nightmare." Comment: "Fast forward to 2024 and the credentialing process took 6 months with Medicaid and another 3 months with the HMOs." (2025) (snippet)
  - Trade press https://www.techtarget.com/revcyclemanagement/news/366620979/Physicians-lose-the-most-from-provider-credentialing-delays — "an average delay of 90 to 120 days for provider credentialing… [physicians] lost up to $122,144 during the 120-day period" (2025) (snippet)
  - Survey (2026) https://www.sutherlandglobal.com/insights/blog/cost-of-provider-credentialing-delays-and-revenue-loss — "A January 2026 survey (by Intelliworx) of 214 US healthcare organizations found that more than four in ten respondents lose up to $50,000 in billings each month due to credentialing delays." (snippet)
- **Incumbent gap:** CAQH solves data entry, not payer follow-up; enterprise credentialing platforms (Medallion, Assured) price for health systems; small practices are left with fax-and-pray or billers' side services.
- **Spend signal:** $8,000-15,000/month lost per uncredentialed primary-care provider, $20,000-35,000 for specialists (payerready.com, 2025); billers bundle credentialing "free" to win 4-6% of collections.
- **Catalyst / trend:** None — structural; worsening per r/Dentistry ("What's with all the slow walking to credentialing with insurance companies these days?").
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 3
- **Solo-builder angle:** A payer-enrollment tracker for small practices that auto-generates applications, schedules follow-up calls with scripts, and shows per-payer status/aging — priced per provider onboarded (vs. $2-4k credentialing-service fees).

### healthcare-private-practice-P3. Claim denials keep rising and 90% of rework is still human labor

- **Who hurts:** Billing staff and owners of independent practices; MA-heavy practices worst (downcoding + denials ranked #3-4 burdens).
- **What happens now (workaround):** Staff rework denials by hand; many are simply written off — physicians report employers don't resubmit up to 20% of denied claims.
- **Frequency:** Daily.
- **Evidence:**
  - Ranked survey https://www.businesswire.com/news/home/20250922969006/en/Experian-Healths-3rd-Annual-State-of-Claims-Survey-Finds-Denials-Still-on-the-Rise-Amid-Escalating-Challenges — "41 percent of providers now face denial rates of 10 percent or higher… 90 percent of claim denials are reworked with at least some human review before resubmission" (Sept 22, 2025) (snippet)
  - Ranked survey https://www.mgma.com/mgma-stat/days-in-a/r-holds-steady-for-most-practices-but-payer-pressure-persists-in-2026 — "48% of leaders named denials and appeals their practice's largest source of revenue leakage… One respondent described insurers 'denying claims without reason'" (Jan 2026 poll) (snippet)
  - Survey/trade https://www.medscape.com/slideshow/claims-denials-report-6018593 — "About half of doctors in our survey reported an increase in the claims-denials rate at their practice." (2025) (snippet)
  - Ranked survey https://www.mgma.com/getkaiasset/8c7263b8-882d-4f6a-8d6c-48180fba72c9/MGMA%202026%20Reg%20Burden%20Report%20.pdf — top burdens ranked: "1 Audits & Appeals, 2 Prior Authorization in Medicare Advantage, 3 Medicare Advantage Denials, 4 Automatic Downcoding in Medicare Advantage" (2026, fetched)
- **Incumbent gap:** Clearinghouses flag rejections but don't work appeals; enterprise denial-management AI targets hospitals; small-practice PMs (SimplePractice, Tebra) stop at claim submission.
- **Spend signal:** Billers take 5-9% of collections largely for follow-up/denial chasing; Experian: 82% say reducing denials is a priority.
- **Catalyst / trend:** MA enrollment now >50% of Medicare; CMS-0057-F requires specific denial reasons from 2026 — structured denial data becomes available to build on.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 4
- **Solo-builder angle:** Appeal-letter and resubmission automation for one niche (e.g., PT or behavioral health) that ingests ERA denial codes and drafts payer-specific appeals with tracked deadlines.

### healthcare-private-practice-P4. Solo-therapist EHRs are jacking prices and adding per-claim fees after PE buyouts, and switching is painful

- **Who hurts:** Solo and small-group therapists (~solo LCSW/LMFT/psychologist practices) on SimplePractice; speech/OT solos on the same stack.
- **What happens now (workaround):** Rage-switching to Sessions Health, Orchid ($28.99), Owl, TherapyNotes; some go manual (free Availity claims + Doxy telehealth); many just eat the increase.
- **Frequency:** Monthly (subscription) with annual hike events.
- **Evidence:**
  - Community https://www.reddit.com/r/therapists/comments/1igvjkw/preferred_emr_system_simplepractice_just_doubled/ — "I just received notice that I'll now pay $49 instead of $29 for SimplePractice's starter plan. I'm pissed." Comment: "SimplePractice was bought out by private equity (Vista Equity Partners)… has to payoff a $4 billion dollar investment" (2025 price-hike thread) (snippet)
  - Community https://www.reddit.com/r/therapists/comments/1igw1p4/simple_practice_beef/ — "Simple practice is raising their rates by $10/month, and they are now charging us $.35 per electronic billing submission?… they hit us with the $20 CPT annual fee just in December" (2025) (snippet)
  - Review gap https://learn.g2.com/mental-health-software — "Insurance billing stops short of automating complex scenarios, claim rejections, and secondary billing require manual intervention… Pricing climbs as practice size grows" (2026, fetched)
  - Review gap https://www.g2.com/compare/centralreach-vs-simplepractice — "SP has a UI that kids easy and locks you in to using, however once they were bought out sand went public their vision changed from helping solo small practices" (verbatim incl. typos) (n.d.) (snippet)
- **Incumbent gap:** Incumbent adds features solos don't want ("I only want a good SOAP note feature, and ability to bill insurance") while raising floor price 61-69%; migration/export friction is the moat.
- **Spend signal:** $49-99+/mo per clinician across ~100k+ US solo therapists; plus 3.15%+$0.30 card processing and $0.25-0.50/claim; billers on top at 5-9%.
- **Catalyst / trend:** Feb 2025 SimplePractice repricing event (Starter $29→$49) created a documented switching wave; PE roll-up pattern continues.
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** Not another full EHR — a migration/exit kit plus lightweight note+claims companion for cash-pay-leaning solos, or a niche EHR for one modality (e.g., speech therapy) at a flat honest price.

### healthcare-private-practice-P5. Veterinary practice software is obsolete, hated, and wrapped in diagnostics vendor lock-in

- **Who hurts:** Vet practice owners/managers and front-desk staff at independent clinics (1-5 DVMs).
- **What happens now (workaround):** Staff hand-retype data between online booking (Vetstoria) and PIMS (Cornerstone); clinics hire SQL consultants to extract their own data; many stay put because migration is worse.
- **Frequency:** Daily.
- **Evidence:**
  - Community https://www.reddit.com/r/veterinaryprofession/comments/1p6ytuj/i_hate_vetstoria/ — "Plus the appt info doesnt transfer over to cornerstone so I still have to hand type in info for new clients/patients. Oh, and cornerstone is also a shitty system." Comment: "fuck cornerstone. I hate it so much. Cornerstone and Avimark need to be completely phased out. They're both such obsolete programs." (n.d., 2025-era thread) (snippet)
  - Community https://www.reddit.com/r/Veterinary/comments/1krzlm0/considering_switching_from_cornerstone_need_pms/ — "The challenge with a full Idexx ecosystem is they slowly perform vendor lock on you and your competitive options get locked out, and they increase the price." Also: "Our practice manager hired an SQL Anywhere expert to transfer all the data out of Cornerstone." (2025) (snippet)
  - Review gap https://www.getapp.com/industries-software/a/cornerstone-practice-management/ — "Some report a steep learning curve… interface can be unintuitive or 'click-heavy.' They experience occasional bugs, server crashes, and glitches" ; listed price "$549/per month" (2026) (snippet)
  - Pricing/WTP https://www.nectarvet.com/post/cornerstone-vet-software-pricing-reviews — "Capterra lists it at $420 a month… expect to pay fees for server maintenance and data backup" (2025, fetched)
- **Incumbent gap:** Server-based dinosaurs (Cornerstone, Avimark) owned by diagnostics giants (IDEXX, Covetrus) with no incentive to open up; cloud challengers (Shepherd, Digitail, Vetspire) exist but booking→PIMS→client-communication glue is still broken.
- **Spend signal:** $420-549/mo PIMS + server costs; IDEXX diagnostics price hikes of "7%… 15%!" (r/Veterinary, Dec 2022) squeeze the same wallet; migration consultants hired out-of-pocket.
- **Catalyst / trend:** None — structural (corporatization of vet med accelerates dissatisfaction but big PE-owned groups aren't the solo target).
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 2
- **Solo-builder angle:** Don't build a PIMS; build the glue — an online-booking layer that actually writes clean appointments/new-client records into Cornerstone/Avimark and enforces appointment-type rules the front desk sets.

### healthcare-private-practice-P6. Cancellations and no-shows silently eat 15-23% of the schedule and existing reminder tools haven't fixed it

- **Who hurts:** Dental practices (14.4-15.5% cancellations + 6.2-7.4% no-shows), behavioral health (~35% no-show benchmark), any appointment-based practice.
- **What happens now (workaround):** SMS reminder tools (already deployed, insufficient), manual waitlist calls, no-show fees that Medicaid forbids and patients resent.
- **Frequency:** Daily.
- **Evidence:**
  - Ranked survey https://www.planetdds.com/wp-content/uploads/2026/05/PDDS-2026-DSO-Outlook-DeepDive-051526.pdf — "Cancellation Rate 12.9% [2025] 15.5% [2024]… No-Show Rate 6.9% 7.4%… Cancellations are the only clear growth killer (worst performers grow ~3–4 pts slower)." (May 2026, fetched)
  - Survey https://www.mgma.com/mgma-stat/patient-no-shows-in-2025 — "27% say no-shows have increased [2025]… Transportation challenges were frequently mentioned, alongside economic hardship, copay costs, and insurance limitations, particularly for Medicaid patient visits where no-show fees are prohibited." (Aug 12, 2025) (snippet)
  - Trade/aggregator https://noshowcost.com/benchmarks/2026-no-show-rate-by-industry — "behavioral health 35 percent (Kruse et al 2018), dental 18 percent (JADA 2023)" (2026) (snippet)
  - Trade https://www.certifyhealth.com/market-study/dental-market-study-2025/ — "No-shows still hit 14.4–20% despite appointment reminder software" (2025) (snippet)
- **Incumbent gap:** Reminders are solved; refilling the slot is not — waitlist autofill, deposit/credit-card-hold flows, and risk-scored overbooking are missing or enterprise-priced.
- **Spend signal:** ~$200-400 lost production per missed dental visit; "$105,000 to $300,000+ per year per provider" (isedate.com 2026 roundup of Planet DDS data).
- **Catalyst / trend:** Medicaid unwinding coverage churn (2024-2025) increased eligibility surprises driving day-of cancellations.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 4 · whitespace 2 · why-now 3
- **Solo-builder angle:** Waitlist-autofill + deposit enforcement bolt-on for one vertical's dominant PMS (e.g., Open Dental, which is open-API), charging per recovered appointment.

### healthcare-private-practice-P7. PT clinics are hostage to WebPT outages and click-heavy documentation that doesn't talk to billing

- **Who hurts:** Outpatient PT/OT clinic owners and treating therapists (documentation debt lands on evenings).
- **What happens now (workaround):** Wait out outages then document all night; switch EMRs at high cost ("pick your poison"); some choose jobs by which EMR the clinic runs.
- **Frequency:** Daily documentation; outage events multiple times per year.
- **Evidence:**
  - Community https://www.reddit.com/r/physicaltherapy/comments/1cqy4ix/if_webpt_has_1_million_haters_i_am_one_of_them_if/ — "This is literally like the sixth time since March that they've had several hour outages… Now I have a whole day's worth of notes that I have to do to catch up before tomorrow." (n.d.) (snippet)
  - Community https://www.reddit.com/r/physicaltherapy/comments/1oabhg7/what_are_the_biggest_problems_your_pt_office/ — "I hate webpt sooo much. Like genuinely, I don't understand why my pt office still uses it" ; top comment: "Changing systems is an expensive endeavour so the 'devil you know is better than the devil you don't'." (Oct 19, 2025)
  - Review gap https://www.capterra.com/compare/92920-197381/WebPT-vs-Prompt — "I cannot stand the frequent glitches, system outages, and the 'smart text' input that erases all typed data" ; "The components of WebPT do not communicate- EMR and billing." ; "Cost is not worth the overall product value and the cost is increasing per information presented by WebPT" (2026 page, fetched)
  - Community https://www.reddit.com/r/physicaltherapy/comments/1irpj11/is_webpt_down_for_anyone_else/ — "12 hours later and YES, WebPT is still down. They sold out to a PE firm and have been horrible since!" (n.d.) (snippet)
- **Incumbent gap:** Market leader is PE-owned, reliability-challenged, priced upward; modern challenger (Prompt) is praised but "over rated imo" per some and priced for groups — solo/2-PT cash practices underserved.
- **Spend signal:** EMR switching described as "an expensive endeavour"; clinics pay WebPT + billing add-ons; lost billable time during outages ("cost us a lot of money in lost [revenue]" — Capterra).
- **Catalyst / trend:** Medicare telehealth for PTs extended to Dec 31, 2027 (MGMA 2026 report) keeps hybrid workflows alive; AI-scribe wave is entering PT documentation now.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 3
- **Solo-builder angle:** Offline-first PT documentation companion (AI-drafted SOAP from dictation, syncs to EMR when it's back up) sold to clinics burned by outages.

### healthcare-private-practice-P8. Solo practices hand 5-9% of collections to billers because insurance billing is too fiddly to do in-house

- **Who hurts:** Solo/small-group therapists, dentists, and PTs who take insurance; owners who discover biller overcharges years later.
- **What happens now (workaround):** Local billers at 4-9% of collections or $350+/mo flat; EHR-bundled billing services (Theranest 6%) widely called "a disaster"; platforms like Headway/Alma take the panel + margin instead.
- **Frequency:** Weekly claim cycles; monthly biller invoices.
- **Evidence:**
  - Community/WTP https://www.reddit.com/r/therapists/comments/1mlzkhb/how_much_do_you_pay_for_billing_each_month_in/ — "Industry standard is 6-7% of the claim" ; "I pay 8% of what the biller collects for me." ; "$350 flat each month. Worth every penny." (2025) (snippet)
  - Community/WTP https://www.reddit.com/r/therapists/comments/1iv3w62/my_practice_is_billing_roughly_30k_per_month_and/ — "Theranest said they can take over billing for 6% of what I bill… These large chains do not care if money slips through the cracks" (2025) (snippet)
  - Community https://www.reddit.com/r/therapists/comments/1juu8yh/guidance_needed/ — "I have now gone back and calculated that i have been overcharged by $8000 [by my biller over 7 years]" (2025) (snippet)
  - Community https://www.reddit.com/r/therapists/comments/1g5uhhs/billing_company_red_flags_and_dealbreakers/ — "7-9% for a solo practitioner is roughly the range to be profitable for a biller" (Nov 10, 2024)
- **Incumbent gap:** EHR billing automations stop at clean-claim submission; eligibility checks, denial follow-up, and patient balances are exactly what solos pay percentages for.
- **Spend signal:** 6% of a $30k/month practice = $1,800/month; even tiny solos pay $350+/month — clear existing spend a product could undercut.
- **Catalyst / trend:** None — structural; payer complexity rising (see P1/P3) pushes more solos to outsource.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 5 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** "Biller-in-a-box" for one modality: eligibility check + claim scrub + denial follow-up playbooks at a flat $99-199/mo, positioned explicitly against the 6%-of-collections biller.

## Vertical catalysts (dated)

- **CMS-0057-F (Interoperability & Prior Authorization final rule):** operational provisions begin Jan 1, 2026 (72-hr expedited / 7-day standard PA decisions, specific denial reasons, public PA metrics); FHIR Prior Authorization / Provider Access / Payer-to-Payer APIs required Jan 1, 2027 for MA, Medicaid/CHIP, and FFE QHPs. https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-prior-authorization-final-rule-cms-0057-f (verified 2026)
- **HIPAA Security Rule overhaul still pending:** NPRM published Jan 6, 2025 (mandatory MFA, encryption, asset inventories, pen testing); HHS moved final action to ~July 2027 in the Fall 2026 Unified Agenda → compliance ~2028 if on schedule. https://www.clarkhill.com/news-events/news/hipaa-security-rule-update-delayed-until-2027/ (2026)
- **Medicare Advantage expansion + WISeR model:** MA now >50% of Medicare-eligibles; MGMA 2026 report flags "the expansion of prior authorization in Traditional Medicare through the Wasteful and Inappropriate Service Reduction (WISeR) Model" as a new 2026 threat. https://www.mgma.com/getkaiasset/8c7263b8-882d-4f6a-8d6c-48180fba72c9/MGMA%202026%20Reg%20Burden%20Report%20.pdf
- **Medicare telehealth flexibilities expire Dec 31, 2027** (originating site, PT/OT/SLP eligibility), per MGMA 2026 report — practices must re-plan virtual care lines.
- **PE consolidation of practice software:** SimplePractice (Vista Equity, $4.0B EngageSmart take-private, 2023) executed a Feb 2025 repricing (Starter $29→$49 + per-claim fees) — documented switching wave in r/therapists.

## Consumer flip-side

- Patients fight the same denial machine: "I keep getting 'They're out of network, claim denied!'… this situation is still so frustrating" — https://www.reddit.com/r/HealthInsurance/comments/1o0x0h6/help_battling_denied_claim/ (2025) (snippet)
- Escalation is a part-time job: "I am not exaggerating when I say I call every damn day for 3 months and it still won't get fixed" — https://www.reddit.com/r/HealthInsurance/comments/1hyuh4f/aetna_denied_my_claim_as_out_of_network_when/ (2025) (snippet)
- Appeal literacy is the moat: "expect the internal appeals to all be denied… I've yet to lose an external appeal, though" — https://www.reddit.com/r/HealthInsurance/comments/1ioojb6/ (2025) (snippet). A B2B2C wedge (practice-branded patient appeal helper) hides here.
- Vet clients face payment shock: front desks push CareCredit/ScratchPay applications mid-crisis — https://www.reddit.com/r/veterinaryprofession/comments/1j77yl8/prepaid_visits/ (2025) (snippet)

## Sources that failed or came up thin

- **Hacker News Algolia** for "prior authorization automation" returned mostly startup launch posts (e.g., browser-automation infra pitching payer portals), not practitioner pain — thin for this vertical.
- **G2 direct mining of SimplePractice reviews:** `site:g2.com` returned compare pages with limited verbatim critical quotes; the richest review-gap quotes came from learn.g2.com and Capterra instead.
- **DentalTown forum** not directly searched this run (Reddit r/Dentistry was rich enough); dedicated dental-forum mining would strengthen P2/P6.
- **KLAS ratings** (paywalled) not accessed; ambulatory EHR satisfaction claims rest on review sites instead.
- **Date precision:** several Reddit threads surfaced without explicit dates in snippets (marked n.d.); thread content indicates 2025-2026 but exact dates unverified.
- **Vet pricing anger** evidence for IDEXX is from Dec 2022 (older than the 18-month recency bar) — kept because lock-in complaints recur in 2025 threads, but flagged lower-confidence.
