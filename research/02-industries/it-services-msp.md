# IT Services & MSPs — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Managed service providers (1-50 seats), small IT shops, and adjacent dev/IT consultancies. Covers PSA/RMM/documentation tooling, vendor relations, compliance services. Excludes enterprise MSPs and telecom carriers.
- **Searches/fetches performed:** 14 web searches + 1 direct fetch (HN Algolia)

## Industry snapshot

- Global managed-services market ~$330.4B (2025) → projected $370.5B (2026), but growth is "harder earned": 71% of MSPs call new-customer acquisition their biggest challenge, and the share of MSPs with typical customer spend >$25k/yr collapsed from 75% to 41% YoY (Kaseya 2026 State of the MSP Report, 1,000+ MSPs; NetSuite MSP challenges 2026).
- Unprofitable-MSP share **doubled** year over year; hiring difficulty for skilled technicians rose 9%→16% (Kaseya 2026 report PDF).
- Tooling is consolidated into a few hated-but-entrenched vendors: Kaseya (Datto, IT Glue, RapidFire, Spanning...) and ConnectWise (PSA/Automate/ScreenConnect), with challengers NinjaOne, HaloPSA, Syncro, Hudu. Kaseya's standard terms auto-renew for the greater of the prior term or 3 years inside a 30-60 day cancellation window.
- Buyers are owner-operators (often 1-10 person shops) who congregate in r/msp (extremely candid), MSPGeek Slack, and vendor-neutral podcasts — one of the most reachable B2B audiences on the internet.
- 48% of MSPs rank AI/automation as top client demand for 2026, yet only 13% earn meaningful AI revenue (Kaseya press release, Apr 14, 2026).

## Top problems

### it-msp-P1. Cyber-insurance questionnaires and carrier evidence requests force a recurring multi-tool evidence scramble

- **Who hurts:** MSP owners/vCIOs answering carrier forms for every client; internal IT at SMBs
- **What happens now (workaround):** Manually pulling MFA/EDR/backup/training evidence from 4-5 portals per renewal; master-questionnaire templates in Word; some bill hourly, most absorb it as vCIO overhead
- **Frequency:** Per client per year at minimum, plus mid-term carrier reviews and vendor questionnaires — effectively monthly for an MSP with 20+ clients
- **Evidence:**
  - community https://www.reddit.com/r/msp/comments/1nqbrkz/charging_to_fill_out_cyber_insurance_forms/ — "We have been getting bombarded by forms this year, and each takes several hours of time to complete to find all the information they're asking for." (snippet, undated 2025-era thread)
  - community https://www.reddit.com/r/msp/comments/1s1e3ay/mild_rant_client_cyber_insurance_renewals/ — "Last renewal we had a carrier come back three days before the deadline asking for backup retention proof and we were the ones digging through two platforms at 9pm to piece it together." (snippet, 2026-era thread)
  - community https://www.reddit.com/r/msp/comments/1ryom92/insurance_client_compliance_requirements_are/ — "our insurance renewal this year had a 4 page security questionnaire that didn't exist last year. they wanted proof of mfa on everything, endpoint detection, backup testing logs, the works." (snippet)
  - trade/survey https://www.netsuite.com/portal/resource/articles/business-strategy/msp-challenges.shtml — "A 2025 Verizon analysis of more than 22,000 security incidents found that ransomware was involved in 44% of all confirmed breaches and 88% of breaches affecting small and midsize businesses." (fetched 2026-09-17)
- **Incumbent gap:** GRC/compliance platforms (Vanta et al.) are priced for the end company, not multi-tenant MSP economics; RMM/PSA tools hold the data but produce no carrier-ready evidence artifact ("Every tool produces data for its own interface" — 1s1e3ay snippet)
- **Spend signal:** MSPs bill this at consulting rates ("$175/hr." cited for compliance block hours); others eat hours across dozens of clients/yr; carriers threaten "comply or your premium doubles" (1ryom92 snippet)
- **Catalyst / trend:** Carriers tightened underwriting after being "burned hard on ransomware claims in 2024-2025" (1ryom92 snippet); Kaseya 2026 report: ~half of MSPs cite cybersecurity product complexity as top barrier, up from 38%
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** Multi-tenant "insurance evidence vault" that pulls MFA/EDR/backup/training status via M365/vendor APIs on a schedule and renders carrier-questionnaire-ready evidence packs per client.

### it-msp-P2. CMMC compliance-as-a-service demand is exploding but MSPs run it on Excel and hourly labor

- **Who hurts:** MSPs serving DoD-supply-chain SMBs; the defense subcontractors themselves
- **What happens now (workaround):** Hired compliance staff working in Excel; vCISO block hours; per-user add-on fees bolted onto managed-services agreements
- **Frequency:** Continuous (evidence maintenance, annual affirmations, 3-year assessments)
- **Evidence:**
  - community https://www.reddit.com/r/msp/comments/1glrzbx/as_an_msp_do_you_offer_compliance_as_a_service/ — "We hired a compliance person, specifically for CMMC and HIPAA... compliance is generally like 30% technical, and much more about business process. No tools -- they just like using excel." (snippet)
  - community https://www.reddit.com/r/msp/comments/1g84nbn/how_are_you_pricing_compliance/ — "We are at $400 a seat for Managed IT and Cybersecurity... We thinking $100 a user as add-on or they sign that they were offered and declined on agreement renewals." (snippet)
  - community https://www.reddit.com/r/msp/comments/1hs9zbe/how_are_you_selling_compliance/ — "We're probably doing it the old fashioned way with block hours, dedicated time (full or half days) at $175/hr. with a term commitment." and "Using Vanta, expensive but predictable" (snippet)
  - regulatory https://www.arnoldporter.com/en/perspectives/advisories/2025/09/cmmc-final-rule-key-takeaways-for-defense-contractors — "the DFARS Rule takes effect on November 10, 2025 (60 days after publication). Phase 1 of the four-phase process for implementing CMMC begins that same day." (Sept 2025)
- **Incumbent gap:** Enterprise GRC tools are "expensive"; Kaseya Compliance Manager distrusted like the rest of Kaseya; nothing packages evidence collection + POA&M + SPRS affirmation tracking at small-DoD-sub price points
- **Spend signal:** $100/user/mo add-ons on top of $400/seat MSP agreements; $250/mo platform fees; $175/hr consulting — all quoted by practitioners in the threads above
- **Catalyst / trend:** DFARS 252.204-7021/-7025 (NOV 2025 clauses, acquisition.gov) effective Nov 10, 2025 — CMMC status now a condition of award; Phase 2 (Nov 10, 2026) was "suspended July 13, 2026 with no replacement date announced" (thedefensecompliancereport.com, citing DoD CMMC FAQ Rev 2.3, May 2026) — prolonged uncertainty keeps consultants busy
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 5
- **Solo-builder angle:** A CMMC Level 1/2 evidence-and-affirmation workspace sold to MSPs (multi-tenant, per-client pricing) that turns the Excel mess into tracked controls, artifacts, and SPRS affirmation deadlines.

### it-msp-P3. Vendor contract auto-renewal traps (Kaseya, ConnectWise) ambush MSPs into multi-year lock-ins and phantom billing

- **Who hurts:** Every MSP owner signing PSA/RMM/documentation contracts; worst for 1-10 person shops without legal review
- **What happens now (workaround):** "Always calendar your cancellation window the day you sign"; sending non-renewal via every channel; disputing invoices for months; lawyers' demand letters; cancelling credit cards
- **Frequency:** Episodic per contract, but a typical MSP holds 5-15 vendor contracts with different windows
- **Evidence:**
  - community https://www.reddit.com/r/msp/comments/tszzjj/kaseya_contract_terms_are_unethical_read_before/ — verbatim clause: "subscriptions will automatically renew for additional Terms equal to the greater of the expiring Term length or three (3) years, unless either party gives the other party notice of non-renewal at least 30 days and no more than 60 days before the end of the relevant Term." (snippet)
  - community https://www.reddit.com/r/msp/comments/1qwasa8/kasaya_scam/ — "Turns out I gave 26 days notice not 30 and now they are enforcing them the contract renews for another 24 months, even after threats they won't back down." (snippet, recent thread)
  - community https://www.reddit.com/r/msp/comments/1ldnivz/kaseya_billing_nightmare_account_held_hostage_for/ — "the Kaseya billing machine continues to operate in a way that can only be described as predatory" (post references April-June 2025 events)
  - review https://www.capterra.com/compare/107931-141792/ConnectWise-Manage-vs-Pulseway — ConnectWise PSA 3.7/5; "Their billing structure, long contracts, and lack of a real partnership approach." (snippet, 2026 compare page)
  - community https://www.reddit.com/r/msp/comments/1bjhfmv/beware_of_connectwise_contracts_and_business/ — "Contracts are written in a way the obligates you to a term but doesn't guarantee any prices." (snippet)
- **Incumbent gap:** No dedicated tool tracks MSP vendor contracts, renewal windows, and notice requirements; PSAs track *client* agreements, not the MSP's own vendor exposure
- **Spend signal:** Multi-year lock-ins cost "major $$$" to escape (r/msp pytt6l snippet); one MSP fought phantom charges since July with weekly meetings (1qwasa8 comment snippet); litigation reached the 8th Circuit (Reinhardt Enterprises v. Kaseya, opinion PDF Jan 29, 2026, storage.courtlistener.com)
- **Catalyst / trend:** FTC "Click-to-Cancel"/Negative Option Rule — which covered B2B — was vacated by the 8th Circuit July 8, 2025 (cooley.com, lw.com alerts), so no federal rescue; only a state-law patchwork remains
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 5 · solo-buildability 5 · whitespace 4 · why-now 3
- **Solo-builder angle:** "Vendor contract watchdog" for MSPs: parse order forms, calendar statutory/contractual non-renewal windows, and auto-generate + send certified non-renewal notices before the trap springs.

### it-msp-P4. QBR and client-report prep is hours of manual multi-tool data consolidation per client

- **Who hurts:** vCIOs/account managers at MSPs of every size
- **What happens now (workaround):** Export/copy-paste from PSA + RMM + backup + M365 into PDFs; internal Power BI/Claude scripts; point tools that still require manual entry
- **Frequency:** Quarterly per client (monthly for some) — 2-3 hours each, scaling linearly with client count
- **Evidence:**
  - community https://www.reddit.com/r/msp/comments/1tc4jkh/whats_everyone_accomplishing_or_working_to_do/ — "QBR prep. Pulling SLA performance, ticket volume by category, device age, and open risk items from the PSA and turning it into something presentable. Usually 2 to 3 hours per client per quarter." (snippet, 2026-era thread)
  - community same thread — "Built this for a client where the account manager was spending a full day every month on client reports before any review calls happened... Down to about 20 minutes per client." (snippet)
  - community https://www.reddit.com/r/msp/comments/1742uew/qbr_annual_lifecycle_reporting/ — "Right now it's alot of exporting, copy & paste, etc. into a document to make a rather large PDF... Right now it involves too many man hours per year to generate." (snippet)
  - community https://www.reddit.com/r/msp/comments/1r842vh/how_are_you_guys_handling_qbr_prep/ — "a lot of those still have me doing manual entry of info and then it gives me a 'shiny PDF' with fancy charts or graphs, but I am still using my time." (snippet)
- **Incumbent gap:** vCIO suites (Lifecycle Insights, Strategy Overview, HumanizeIT) are "expensive over the top stuff that most people weren't connecting with anyways" (1r842vh snippet); per-client narrative customization is the unsolved part
- **Spend signal:** A full AM-day/month ≈ $300-500 labor per client per month; existing vCIO tools carry per-seat SaaS pricing that MSPs already pay
- **Catalyst / trend:** LLMs make per-client narrative generation from PSA/RMM APIs practical — MSPs are already hand-rolling this with Claude (1tc4jkh)
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 2 · why-now 3
- **Solo-builder angle:** API-first QBR narrative generator (Halo/Autotask/CW + M365 in, branded client-ready deck out) priced per-client-report instead of enterprise per-seat.

### it-msp-P5. Leaving ConnectWise means losing a decade of PSA data or paying thousands to keep it readable

- **Who hurts:** MSPs migrating off ConnectWise Manage/Automate (a large, ongoing cohort)
- **What happens now (workaround):** Buy a perpetual "sandbox license outright for a couple g's" just to read old data; consultant-built SQL/SharePoint exports; secret internal CW export tools
- **Frequency:** Episodic (each migration), but constant across the community
- **Evidence:**
  - community https://www.reddit.com/r/msp/comments/1436lfu/moving_off_connectwise_manage_connectunwise/ — "We are moving off of Connectwise due to horrible account management, billing, support, lack of innovation... You can buy a sandbox license outright for a couple g's and then have basically an offline manage instance." (snippet)
  - community https://www.reddit.com/r/msp/comments/1j2tgrb/finally_getting_away_from_cw/ — "Nothing, and I mean nothing, has come close to the scale of shittiness that is ConnectWise... The only thing you might miss is ScreenConnect." (snippet, 2025-era thread)
  - community https://www.reddit.com/r/msp/comments/1jgpoxf/connectwise_how_it_ended/ — "we had to hire and external consultant for support as CW support [is] so useless." (snippet)
  - review https://ai.g2.com/product/connectwise-rmm — G2 AI analysis (December 2025): "Users reported issues with the interface being clunky and outdated... slow redesign process, limited scripting and reporting options, poor automation abilities" (fetched snippet)
- **Incumbent gap:** Neither CW nor the destination PSAs solve historical-data portability; migration consultants are ad hoc; "that data reads best... in the platform you entered it in" (1436lfu snippet)
- **Spend signal:** ~$2,000+ sandbox licenses, consultant fees, "thousands of pounds" sacrificed in one switch (1n35rm8 snippet)
- **Catalyst / trend:** Continuing CW partner exodus amid product stagnation ("functionality in there for products that don't exist anymore" — 1jgpoxf snippet)
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 4 · why-now 3
- **Solo-builder angle:** A read-only "PSA archive viewer" — one-time export of Manage/Automate into a searchable hosted archive, sold per-migration at a fraction of the sandbox-license price.

### it-msp-P6. Client documentation is stuck between a stagnant hostage (IT Glue) and an imperfect escape (Hudu), and migration burns days

- **Who hurts:** All MSPs; internal IT teams documenting in OneNote sprawl
- **What happens now (workaround):** Community-built mspp.io PowerShell migration scripts; manual cleanup of images/Word files that don't export; staying put out of fear
- **Frequency:** Daily use; migration pain episodic
- **Evidence:**
  - community https://www.reddit.com/r/msp/comments/1ihbxel/yes_another_itgluehudu_msp_client_documentation/ — "The hudu one is active with developers and tons of customers, ITGlue's is completely dead. Ask for Hudu's roadmap, then ask for ITGlues." (snippet; post explicitly surveying "in 2025")
  - community https://www.reddit.com/r/msp/comments/1so9v97/how_are_you_backing_up_itglue_or_is_hudu_just/ — "Kaseya's track record of buying tools and gradually making them worse is pretty well documented at this point. No recycle bin in a documentation platform is honestly embarrassing." (snippet)
  - community https://www.reddit.com/r/msp/comments/1jd838a/itglue_alternatives/ — "kaseya will ignore your termination notice and enroll you again in a 3 Yr contract unless you make a big fuss" + "when extracting from ITGlue, word/excel documents do not export with it." (snippet)
  - workaround https://www.reddit.com/r/msp/comments/15a4qpx/glue_to_hudu_guides_sync_tips_and_tricks/ — "Migrations could take up to 12 hours labor (although not straight) between all my scattered scripts + the original script." (snippet, community migration-script author)
- **Incumbent gap:** IT Glue development perceived dead under Kaseya + 3-year lock-in; Hudu "feels buggy," charges full price to give a reseller portal access, lacked bi-directional PSA sync (1ihbxel snippets)
- **Spend signal:** Per-seat doc-platform subscriptions industry-wide; 12 hours skilled labor per migration; on-prem/self-host demand for compliance (ISO 27001 shops)
- **Catalyst / trend:** None — structural (Kaseya acquisition-and-stagnate pattern)
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 5 · solo-buildability 3 · whitespace 2 · why-now 3
- **Solo-builder angle:** Productize the IT Glue → Hudu (and OneNote → Hudu) migration as a fixed-price service/tool with image/attachment fidelity guarantees — riding an existing, chronically painful flow.

### it-msp-P7. MSPs can't prove their value to buyers — acquisition stalls and deals shrink

- **Who hurts:** Owner-operators doing their own sales; 71% of surveyed MSPs
- **What happens now (workaround):** Discounting; over-stuffed QBR decks; competing on price against MSPs poaching the same switchers
- **Frequency:** Continuous
- **Evidence:**
  - survey https://pages.thechannelco.com/rs/329-KEI-124/images/Asset-1-Kaseya-2026-State-of-the-MSP-Report-2026.pdf — "A full 71% of MSPs said acquiring new customers is their biggest challenge... The share of MSPs reporting customer spending of more than $25,000 per year fell to 41% from 75%." (2026 report, fetched)
  - survey/press https://www.kaseya.com/press-release/ai-emerges-as-the-key-to-scaling-msp-operations-as-growth-gets-harder/ — "nearly one in five MSPs (19%) report difficulty quickly demonstrating value to prospective customers, almost double the rate from the previous year." (April 14, 2026)
  - trade https://www.kaseya.com/blog/msp-growth-challenges-2026/ — "most new clients are not new to IT services. They're switching from another MSP, which means providers are competing for the same accounts." (2026)
- **Incumbent gap:** Sales/marketing tooling for MSPs is thin; PSAs don't produce prospect-facing proof-of-value artifacts
- **Spend signal:** Kaseya's own report frames this as the #1 spend priority; MSP marketing agencies charge $2-5k/mo retainers (not directly evidenced this run — flagged lower-confidence)
- **Catalyst / trend:** Deal-size compression + switcher-dominated demand documented in the 2026 survey wave
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 5 · solo-buildability 2 · whitespace 2 · why-now 3
- **Solo-builder angle:** Prospect-facing "IT risk snapshot" generator an MSP can run against a prospect's M365 tenant in the sales call — turning value-proof into a repeatable artifact.

### it-msp-P8. Vulnerability management & third-party patching tooling is fragmented and priced above SMB-client economics

- **Who hurts:** MSPs serving SMBs who must pass on tool costs per client
- **What happens now (workaround):** Stacking 2-3 free/cheap tools (Action1 free ≤200 endpoints + RoboShadow + winget/Chocolatey); direct-charging clients per tool; distrusting bundled RMM patching
- **Frequency:** Weekly/continuous
- **Evidence:**
  - community https://www.reddit.com/r/msp/comments/1nijvq9/vulnerability_management/ — "we mostly support SMBs so cost is a huge factor. I would like something effective and easy, but still cheap." (snippet)
  - community https://www.reddit.com/r/msp/comments/1imvfmd/what_are_the_best_vulnerability_management_tools/ — thread title itself: "What are the best Vulnerability Management tools available? (I know it's not ConnectSecure)" (snippet)
  - community https://www.reddit.com/r/msp/comments/1lv3glg/good_solutions_for_third_party_patching/ — "I started using Action1. Free up to 200 endpoints. It's unbelievably good!... free is the best kind of monies" (snippet)
  - review/pricing https://www.g2.com/compare/connectwise-rmm-vs-naverisk-rmm-psa — Naverisk entry pricing "$110 per month… includes RMM, PSA, and Service Desk" vs CW "No pricing available" (snippet) — price opacity at incumbents vs. challenger transparency
- **Incumbent gap:** RMM-bundled patching distrusted ("the patching side of it… I'm not sure I actually trust it" — 1nijvq9 snippet); dedicated VM platforms priced for enterprises; ConnectSecure actively disliked
- **Spend signal:** MSPs assembling 2-3 paid tools per client and direct-billing clients for them (1nijvq9)
- **Catalyst / trend:** Cyber-insurance and compliance requirements (P1/P2) force even tiny clients into vulnerability scanning
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 3 · reachability 5 · solo-buildability 2 · whitespace 2 · why-now 3
- **Solo-builder angle:** Not a scanner (crowded, hard solo) — instead a cross-tool "patch/vuln evidence normalizer" that merges Action1/RoboShadow/RMM outputs into per-client compliance-and-insurance-ready reports.

## Vertical catalysts (dated)

- **CMMC contract clauses live:** DFARS rule effective Nov 10, 2025; Phase 1 self-assessments condition of award (Arnold & Porter advisory, Sept 2025; acquisition.gov DFARS 252.204-7021/-7025, NOV 2025). Phase 2 (Nov 10, 2026) suspended July 13, 2026, no new date (thedefensecompliancereport.com citing DoD CMMC FAQ Rev. 2.3, May 2026).
- **FTC Negative Option ("Click-to-Cancel") Rule vacated** by 8th Circuit July 8, 2025 (Custom Communications v. FTC) days before its July 14 compliance date — B2B auto-renewal abuse continues ungoverned federally (cooley.com, lw.com, wilmerhale.com alerts, July-Aug 2025).
- **Kaseya contract litigation reaching appellate courts:** Reinhardt Enterprises v. Kaseya U.S., 8th Cir. opinion posted Jan 29, 2026 (storage.courtlistener.com PDF) — "termination" ambiguity revived.
- **2026 Kaseya State of the MSP Report** (published ~April 14, 2026): acquisition crisis (71%), deal-size collapse (>$25k accounts 75%→41%), tech-hiring difficulty 9%→16%, unprofitable share doubled — margin pressure makes labor-saving tools easier to sell.
- **AI service demand vs. delivery gap:** 48% of MSPs say AI/automation is top client need; 13% monetize it (Kaseya press release, Apr 14, 2026).

## Consumer flip-side

- MSP *clients* are mostly switchers, not first-time buyers: "most new clients are not new to IT services. They're switching from another MSP" (kaseya.com/blog/msp-growth-challenges-2026) — churn implies widespread SMB dissatisfaction with current providers.
- SMB tolerance for downtime/security failure "has dropped to near zero" (NetSuite 2026 MSP challenges article).
- Internal IT buyers voice the same vendor-contract complaints as MSPs (r/sysadmin thread "Is Kaseya really that bad?": "most people dislike them because or the three year contracts they stick you in" — snippet).

## Sources that failed or came up thin

- `site:g2.com connectwise psa "dislike"` returned nothing; had to pivot to Capterra compare pages and G2's AI-summary subdomain (ai.g2.com). Direct G2 review-page quotes with reviewer dates were not obtainable this run.
- HN Algolia search for MSP topics returned mostly irrelevant startup launches (e.g., a desktop AI app post) — HN is not where MSP pain lives; excluded.
- A reddit comment claimed Kaseya is "being investigated by the govt for fraud" — **could not verify** via news search; only private litigation (Reinhardt, 8th Cir.) and the vacated FTC rule surfaced. Treated as unverified rumor.
- Reddit search snippets frequently omit post dates; where the date wasn't visible I marked evidence "(snippet, undated)" and leaned on threads whose content anchors a year (e.g., "in 2025").
- MSP marketing-agency retainer pricing ($2-5k/mo in P7 spend signal) is industry common knowledge but was not directly evidenced this run — flagged lower-confidence.
- MSPGeek Slack (named as the biggest MSP community) is login-walled — its vendor channels (v-itglue vs v-hudu activity comparison, referenced in a reddit snippet) could not be observed directly.
