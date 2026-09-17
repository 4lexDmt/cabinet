# Accounting, Bookkeeping, and Tax — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** US solo and small CPA/tax/bookkeeping firms (≤30 professionals) and their SMB/individual clients. Big 4 / national PE-backed platforms excluded except as capacity competitors. UK QBO pricing used only as corroborating incumbent-anger signal.
- **Searches/fetches performed:** 28 web searches, 12 direct fetches (AICPA/PCPS + MAP PDFs, CPA.com CAS press, Accounting Today CAS, Canopy press, Financial Cents pricing, Capterra QBO review pages, Intuit Desktop policy timeout, AccountingWEB Cloudflare-blocked, Firm of the Future timeout, HN Algolia empty)

## Industry snapshot

- Buyers: ~81% of AICPA MAP respondents are firms with net client fees under $5 million; 1,073 firms completed the 2025 MAP Survey (data year FY2024) ([2025 National MAP Survey Executive Summary PDF](https://www.incpas.org/wp-content/uploads/2025/12/2025-national-map-survey-executive-summary.pdf)).
- 2026 climate: 2026 PCPS CPA Firm Top Issues Survey (n=629, Apr 20–May 22, 2026) ranks **tax-law complexity #1 for solos and 2–10 professional firms**; **hiring experienced staff #1 for 11–30**; tech/AI change-management #1 as a five-year issue across all sizes ([AICPA news, Jun 23, 2026](https://www.aicpa-cima.com/news/article/aicpa-survey-cites-change-management-for-technology-and-ai-as-top-long-term-issue-facing-accounting-firms); [Journal of Accountancy, Jun 23, 2026](https://www.journalofaccountancy.com/news/2026/jun/aicpa-top-issues-survey-firms-focus-on-technology-rises/)).
- Capacity is bought, not hired: 29% of MAP firms offshore; 74% of firms with NCF ≥$10M; dedicated offshore juniors advertised at $950/mo and tax preparers from $3,500/mo (MAP PDF; [OPS-Automate](https://ops-automate.com/); [Vance & Cole](https://vancecole.com/)).
- Incumbents: Intuit QBO (US 15–25% hike May 1, 2026: Plus $90→$110, Advanced $200→$250) plus Desktop 2023 support ended May 31, 2026; tax suites Drake/Lacerte/ProConnect/CCH Axcess/UltraTax; practice OS TaxDome (~$700–$1,200/seat/yr), Canopy ($74–$149/user/mo + per-client modules), Karbon ($59–$89/user/mo), Financial Cents Solo $19/mo.

## Top problems

### accounting-P1. Tax season is a document-chase: clients drop incomplete files, then firms spend weeks nagging for the missing 1099

- **Who hurts:** solo/small tax firms and their admins; bookkeepers collecting monthly statements
- **What happens now (workaround):** organizers via email/SmartVault; Excel missing-item sheets; Lacerte “Waiting on Docs”; admin whose job is follow-up; TaxDome/Canopy/SafeSend/Financial Cents portals; IRS wage-and-income transcripts to skip the chase
- **Frequency:** daily Jan–Apr; monthly for bookkeeping
- **Evidence:**
  - community https://www.reddit.com/r/taxpros/comments/1inaet8/whats_the_most_timeconsuming_and_tedious_part_of/ — “Convincing people that they actually need to look at all the documents they had last year… The number of people that come in that are missing a 1099 from SOMEWHERE” (2025 tax-season thread; snippet)
  - community https://www.reddit.com/r/taxpros/comments/1sueoto/getting_info_from_clients/ — “I think most of us experience this from our clients. I am going to add a disclaimer in my EL of what constitutes a completed file… I hope this will help alleviate the document chasing during tax season.” (undated; snippet)
  - community https://www.reddit.com/r/taxpros/comments/1ezn9mn/software_to_automatically_send_list_of_data/ — “Your problem is most likely that your clients don't read their email though, so no amount of email reminders will work!” (undated; snippet)
  - community https://www.reddit.com/r/taxpros/comments/1pk6lus/tracking_missing_tax_informationlooking_for_ideas/ — “Complex clients have a separate Excel tracking sheet kept in Document” (undated; snippet)
  - catalyst / vendor (hours) https://www.getcanopy.com/resources/press-room/canopy-unveils-native-ai-powered-smart-intake-capability-to-eliminate-client-friction/ — “In tax prep scenarios, firms can save as much as 20 minutes per client, which adds up quickly when managing hundreds or thousands of returns.” (Jul 22, 2025)
  - willingness-to-pay https://financial-cents.com/pricing/ — Solo plan “$19/month Billed annually”; marketing claim “On average, firms save 56 hours a month & $19,200 every year with Financial Cents” (live 2026; vendor-claimed hours)
- **Incumbent gap:** TaxDome/Canopy/SafeSend already sell checklists+reminders, but practitioners still say clients ignore email, 1099s explode into confusing item lists (SafeSend Gather + Lacerte trial scrapped over consolidated-1099 splitting — https://www.reddit.com/r/taxpros/comments/1qhdxp8/using_safesend_gather_with_lacerte_looking_for/), and setup is “a major pain.”
- **Spend signal:** 20 min/client × 300 returns = 100 hours (Canopy case); Financial Cents $19–$69/user/mo; firms hire admins or offshore VAs whose listed duties include “Document collection & organization” ([Finrista](https://finrista.com/)).
- **Catalyst / trend:** OBBBA 2025 adds new tip/overtime documentation and 1099-NEC threshold changes that make incomplete intake more dangerous, not less.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 5 · solo-buildability 4 · whitespace 2 · why-now 4
- **Solo-builder angle:** SMS-first missing-item chaser that reads last year’s return, requests *one PDF per account* (not exploded 1099-INT/DIV/B lines), and blocks the return from the prep queue until a complete file lands.

### accounting-P2. Intuit’s QBO/Desktop price machine is eating firm margins — firms absorb it silently, then become the bad guy to clients

- **Who hurts:** bookkeepers/CPAs who wholesale-bill QBO; 3-person shops carrying ~30 client subscriptions
- **What happens now (workaround):** pass-through to retainers; drop QBO from the package; downgrade tiers; threaten cancel for a retention discount; consider Xero (also hated)
- **Frequency:** every renewal; 2025 then 2026 stacked hikes
- **Evidence:**
  - community https://www.reddit.com/r/QuickBooks/comments/1skforb/quickbooks_has_raised_their_prices_twice_in_less/ — “I run a small CPA firm, three employees, about 30 clients and I am carrying multiple QBO subscriptions… every time Intuit raises prices it does not just hit me once”; commenter: “I run my own bookkeeping firm and have moved away from including the QBO subscription as part of my offerings. I lost a ton of money to the price increases that I had to absorb.” (snippet)
  - willingness-to-pay / pricing https://www.business2community.com/small-business/quickbooks-price-increase-2026-cost-breakdown/ — “Intuit has raised prices across every U.S. QuickBooks Online subscription tier, increasing monthly costs by 15% to 25%… May 1, 2026, with Simple Start moving from $30 to $35… Plus from $90 to $110, and Advanced from $200 to $250.” Plus+payroll “about $170… now costs roughly $215 per month, adding about $540 per year.” Desktop Pro Plus “$999 to $1,149” Feb 1, 2026. (Jul 6, 2026)
  - community (UK corroboration, snippet) https://www.accountingweb.co.uk/any-answers/quickbooks-price-increase-2026 — “I have 141 clients that I pay this for absorbed into my fixed monthly fee. So that's £2k + straight off my profit.” (Nov 10, 2025; page Cloudflare-gated on direct fetch; quote from search snippet)
  - catalyst https://www.method.me/blog/quickbooks-desktop-alternatives/ — “Support ends May 31, 2026 for Desktop 2023 and September 30, 2027 for Desktop 2024.” Desktop 2024 is “the final non-Enterprise release.” (2026)
  - review-gap https://www.capterra.com/compare/190778-233828/QuickBooks-Online-vs-iplicit — “QuickBooks Online can be quite pricey, has limited customization, and it has occasional sync glitches.” / “The program has not allowed me to connect to my bank account for two months… until January 2026.” (Capterra 2026 page; snippet)
- **Incumbent gap:** Intuit is the system of record for most CAS books; switching cost (chart of accounts, payroll, accountant fluency) is the lock. Xero is “even worse” on price in the AccountingWEB thread.
- **Spend signal:** $240/yr extra per Plus file; a 30-client CAS book = ~$7,200/yr silent COGS; UK 141-file shop quoted £2k+ profit hit in one jump.
- **Catalyst / trend:** Desktop 2023 services died May 31, 2026 (payroll, bank feeds, support); forced Online/Enterprise migration at higher ARPU.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 5 · solo-buildability 3 · whitespace 3 · why-now 5
- **Solo-builder angle:** Not a QBO clone — a **ProAdvisor cost-pass-through + plan-audit tool** that maps each client to the cheapest viable tier, auto-amends engagement letters when Intuit hikes, and shows the firm its silent COGS. Kill criterion if the wedge requires Intuit APIs Intuit can shut off.

### accounting-P3. There are not enough experienced staff, so small firms buy $950–$3,500/mo offshore capacity and still drown in review

- **Who hurts:** 11–30 professional firms (PCPS #1 current issue = hiring experienced staff); solos who cannot hire at $60k–$68k starting pay
- **What happens now (workaround):** raise starting salaries; cull clients (56% of MAP firms culled in FY2024); India/Philippines vendor pods; junior offshore at $950/mo; tax preparers from $3,500/mo
- **Frequency:** structural; acute every busy season
- **Evidence:**
  - ranked survey (mandatory) https://www.aicpa-cima.com/news/article/aicpa-survey-cites-change-management-for-technology-and-ai-as-top-long-term-issue-facing-accounting-firms — “Hiring experienced staff was the No.1 issue. Firms in this group [11–30] represent almost a third of survey respondents”; “All firms except solo practitioners listed staff retention as a top issue… over the next five years.” (Jun 23, 2026)
  - ranked survey https://www.incpas.org/wp-content/uploads/2025/12/2025-national-map-survey-executive-summary.pdf — “For new hires with master’s degrees, the median average initial salary jumped nearly 17% over a two-year period to $67,750… bachelor’s… $60,834.” “Of responding firms, 29% utilized offshoring… 74% of firms at $10 million or higher… 65% offshored to India, followed by the Philippines (33%).” Retirement as a turnover reason “24%… up from 15% in 2020.” (2025 MAP; FY2024 data)
  - trade press https://www.cpapracticeadvisor.com/2026/08/03/beyond-the-accountant-shortage-the-skills-shortage-facing-cpa-firms/187848/ — “61% of finance and accounting leaders… more difficulty finding skilled professionals now than they did a year ago… 75%… project delays… 62% report that projects have been canceled.” (Aug 3, 2026; snippet)
  - willingness-to-pay https://ops-automate.com/ — “A full-time junior accountant for your firm. $950/month. Flat.” Duties include “Workpaper preparation, document collection and client file cleanup.” (live)
  - willingness-to-pay https://vancecole.com/ — “Dedicated tax preparers… Starting at $3,500/month per dedicated tax preparer.” (live)
- **Incumbent gap:** Offshoring vendors sell bodies; they do not sell review-ready workpaper QA, IRS §7216 consent workflows, or a small-firm operating system for a 2-person US shop supervising a Manila pod.
- **Spend signal:** $11k–$42k/yr per offshore seat vs US $60k+ starting + benefits; 29% of firms already paying.
- **Catalyst / trend:** Pipeline still thin (AICPA Trends 2025: 55,152 accounting grads 2023–24, down 6.6% — cited via [Inside Public Accounting, Aug 3, 2026](https://insidepublicaccounting.com/2026/08/03/perspectives-from-the-profession-beyond-labor-arbitrage-building-sustainable-capacity-in-audit-practices/)); PE/global staffing expanding at IPA 100 (70% plan to increase offshoring, [Sep 3, 2026](https://insidepublicaccounting.com/2026/09/03/ipa-podcast-recap-global-staffing-pe-and-advisory-are-reshaping-the-ipa-100/)).
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 4 · solo-buildability 2 · whitespace 3 · why-now 3
- **Solo-builder angle:** **Review-layer SaaS for a 1–5 person US firm + one offshore preparer** (workpaper checklist, 7216 consent, maker-checker, time-of-day handoff) — not another staffing marketplace (kill: two-sided cold-start).

### accounting-P4. Practice-management suites that were supposed to kill the chase are now themselves the headache (setup hours, payments revolt, modular pricing)

- **Who hurts:** tax-heavy solos who bought TaxDome/Canopy/Karbon to replace email+Drive
- **What happens now (workaround):** 95-hour TaxDome setups; 3-year prepaid lock-ins; switching to Karbon/Anchor mid-season; staying on Google Drive + Financial Cents Solo
- **Frequency:** implementation once, then every vendor-forced change (payments, UI)
- **Evidence:**
  - community https://www.reddit.com/r/taxpros/comments/1tj6rp6/taxdome_vs_canopy_pros_and_cons/ — “I just spent 95 hours setting up TaxDome and transitioning my clients... And I regret it.” “Their payment processing is powered by hot garbage - sorry, I mean Stripe - and has disrupted many firms' workflows” (snippet)
  - community https://www.reddit.com/r/taxpros/comments/1qaipyw/skrew_you_taxdome_are_we_going_to_let_them_get/ — “I fortunately only gave Tax Dome one years' worth of my money… they were pushing hard for me to sign-up for 3 years… After tax season this year I will be moving platforms.” (snippet)
  - community https://www.reddit.com/r/taxpros/comments/1qjdrjv/proscons_tax_dome_vs_canopy/ — “Support has been ghosting me for 3 weeks… If you try to call up there… ‘due to the large call volume, we aren't taking calls right now.’” (snippet)
  - willingness-to-pay https://tidyflow.com/blog/best-accounting-practice-management-software-guide/ — TaxDome “$800/year (solo); $1,000/year Pro”; Canopy “$74/user/mo (annual) + add-ons”; Financial Cents “$19/mo solo; $49/user/mo Team”; “a five-seat firm starts at… $370 for Canopy Standard, or $5,000 per year for TaxDome Pro.” (2026)
- **Incumbent gap:** All-in-ones are either unpolished+customizable (TaxDome) or polished+modular-expensive (Canopy). Solos who only need portal+reminders overpay or under-implement.
- **Spend signal:** $800–$1,800+/user/yr; 95 hours of owner time at even $150/hr = $14k implementation tax.
- **Catalyst / trend:** TaxDome CPACharge sunset during/around 2026 busy season (community); Canopy Smart Intake Jul 2025 is the feature race, not a price cut.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** Opinionated **tax-season OS for 1–3 seats**: engagement → organizer → e-file auth → invoice, no 3-year contract, SMS reminders, Stripe optional — sold as “Financial Cents depth without TaxDome onboarding.”

### accounting-P5. The tax engines firms already pay for go dark at deadlines (CCH, Thomson Reuters, Intuit e-file)

- **Who hurts:** any firm on Axcess, UltraTax/Onvio, ProConnect/Lacerte during Jan–Apr and Oct 15
- **What happens now (workaround):** Down Detector instead of vendor status pages; paper-file when Intuit closes e-file early; “never have enough downtime to switch”
- **Frequency:** episodic, clustered on deadlines (highest-cost hours)
- **Evidence:**
  - community https://www.reddit.com/r/taxpros/comments/1jaeeq3/cch_axcess_outage_again/ — “I can't quite get over how much our firm spends on this software that keeps having outages right near a deadline… So frustrating.” “My whole office is down… literally wasted the day”; “I lost about half a day.” (snippet)
  - community https://www.reddit.com/r/taxpros/comments/1ihqbkb/ultratax_customer_service_is_zero_why_even_have/ — “As the portal ‘guru’ of our firm, I’ve lost 200-300 hours per year the last two years in Thomson Reuters portal phone calls from clients.” Workaround: “switch to safe send. Like $20 per return” (snippet)
  - community https://www.reddit.com/r/taxpros/comments/1ivokfn/onvio_billing_down_now_for_two_days/ — “Absolutely unacceptable that we can’t bill our clients.” “Can't even bill our clients to help pay our software costs. I've been trying to leave Onvio for 2 years now, but never have enough downtime” (snippet)
  - community https://www.reddit.com/r/taxpros/comments/1pu8yih/intuit_shutting_down_efile_before_irs/ — “ProConnect decided to shut down before the IRS, with absolutely NO communication. I am so sick and tired of dealing with Intuit!” (snippet)
- **Incumbent gap:** Status communication is worse than the outage; switching cost (years of data) is the moat. SafeSend at ~$20/return is the revealed-WTP patch for portals, not the tax engine.
- **Spend signal:** 200–300 hours/yr of partner time on one portal; half-days of whole-office downtime at peak realization; prepaid annual licenses.
- **Catalyst / trend:** none new — structural vendor quality decline; switching inertia is the opportunity *and* the kill (hostile-platform dependence if you build on their APIs).
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 5 · solo-buildability 2 · whitespace 2 · why-now 2
- **Solo-builder angle:** Do not rebuild Lacerte. Sell a **deadline-status + client-comms overlay** (outage SMS to clients, e-file cutoff calendar, paper-file packet generator) that sits beside whatever engine they already prepaid.

### accounting-P6. Bank feeds lie: bookkeepers spend 6 hours a month re-keying because QBO/Xero miss transactions or duplicate them

- **Who hurts:** monthly bookkeepers on QBO/Xero, especially clients at regional/online banks
- **What happens now (workaround):** CSV/.qbo upload; Hubdoc/Dext; “I started to use bankfeeds, but abandoned it completely”
- **Frequency:** monthly close, every affected client
- **Evidence:**
  - community https://www.reddit.com/r/Bookkeeping/comments/1ht2g6y/quickbooks_online_not_grabbing_all_the/ — “when it comes time to reconcile for December each day is missing about 3 or 4 transactions. It takes me 6 hours every month to manually add all the transactions in.” (snippet)
  - community https://www.reddit.com/r/Bookkeeping/comments/1qa624p/quickbooks_hasnt_connected_to_bank_for_over_a/ — “QB hasn’t connected to my bank account for over a month (Ally) and I’m so done trying to get help from them.” (snippet)
  - community https://www.reddit.com/r/Bookkeeping/comments/180of9n/qbo_bank_feeds_and_duplicates/ — “I started to use bankfeeds, but abandoned it completely, due to this reason. It's just not reliable.” (snippet)
  - review-gap https://www.capterra.com/compare/181595-190778/Hourly-vs-QuickBooks-Online — “Very frustrating to use… too many double entries, making bank and credit card reconciliation…”; “The bank connection always disconect after 6 months” (Capterra 2026; snippet)
- **Incumbent gap:** QBO bank feeds are table-stakes and still fail on non-mega banks; Hubdoc/Dext still need a human to chase PDFs when the feed dies.
- **Spend signal:** 6 hours/client/month on a broken feed; at $75–$150/hr bookkeeper rates that is $450–$900/client/mo of unbilled or poorly billed time.
- **Catalyst / trend:** Desktop bank feeds dying with version sunsets pushes more files onto QBO feeds.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** Statement-PDF → categorized QBO bank-feed importer with duplicate detection, sold per-client-month to bookkeepers (not to Intuit). Plaid/Intuit-feed dependence is a kill if that is the only path.

### accounting-P7. OBBBA + tax-law complexity is now the #1 current issue for the smallest firms — new deductions, new docs, new E&O

- **Who hurts:** solos and 2–10 professional firms (PCPS 2026 current-issue #1)
- **What happens now (workaround):** CPE scramble; updated organizers; hope the tax software defaults are right; engagement-letter hedges
- **Frequency:** every 2025–2026 return; planning conversations year-round
- **Evidence:**
  - ranked survey https://www.journalofaccountancy.com/news/2026/jun/aicpa-top-issues-survey-firms-focus-on-technology-rises/ — “tax law complexity was first among solo practitioners and firms with up to 10 employees”; those same groups also ranked “IRS challenges and data security in their top four.” (Jun 23, 2026)
  - catalyst https://www.wolterskluwer.com/en/expert-insights/navigating-compliance-planning-and-advisory-opportunities-under-the-one-big-beautiful-bill-act — “The One Big Beautiful Bill Act (OBBBA), enacted on July 4, 2025, represents one of the most consequential tax reforms since the Tax Cuts and Jobs Act.” (2026 insight)
  - catalyst https://mcgowanprofessional.com/obbba-for-cpas-critical-practice-risks-every-firm-must-address-now/ — “For firms advising individuals, businesses, estates and trusts… OBBBA for CPAs has become a core practice risk issue, not just a tax update.” (snippet)
  - community (IRS access, related #4 issue) https://www.reddit.com/r/taxpros/comments/1uad4zh/caf_check_failed_on_tax_pro_account/ — CAF check failed Jun 19, 2026; comments on expired authorizations / EFIN deactivation blocking TDS (snippet)
- **Incumbent gap:** Tax software will eventually code the forms; what small firms lack is **client-facing documentation checklists** for new tip/OT deductions, SALT $40k cap phaseouts, and state nonconformity — plus a way to pull transcripts when TDS is broken.
- **Spend signal:** CPE + extra prep time on every 1040; E&O premium risk (McGowan frames it as liability, not software). Advisory hours are billable if the firm can productize the conversation.
- **Catalyst / trend:** OBBBA signed Jul 4, 2025; first full filing season complete by mid-2026; SALT cap $10k→$40k TY2025–2029 then reverts ([Surgent CPE](https://blog.surgentcpe.com/obbba-one-year-tax-changes)).
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 5 · solo-buildability 3 · whitespace 3 · why-now 5
- **Solo-builder angle:** Niche **OBBBA organizer + multi-year SALT/QBI/phaseout modeler** for 1040 shops (not a full tax engine), with export into Drake/Lacerte/ProConnect.

### accounting-P8. CAS is the growth engine, but small firms cannot scale it on QBO + email + hourly habits

- **Who hurts:** small firms that want recurring CAS revenue; clients who “want more than just tax returns”
- **What happens now (workaround):** keep write-up in QBO; cobble Hubdoc + Financial Cents + Google Drive; stay hourly (MAP: 63% still hourly)
- **Frequency:** monthly close for every CAS client
- **Evidence:**
  - ranked survey https://www.cpa.com/news/aicpa-and-cpacom-benchmark-survey-client-advisory-services-cas-practices-report-17-growth — median CAS growth 17%; NCFPP $156,250 (+29%); “only 10% of respondents still employing hourly billing as the primary pricing method”; firms continually investing in tech “serving 50% more clients (100 versus 67).” (Dec 9, 2024; 206 practices, CY2023)
  - trade press https://www.accountingtoday.com/news/looking-to-grow-like-a-top-100-firm-try-cas — “85% of the 88 responding Top 100 Firms experiencing a boost in this service line”; Sax: “a shrinking pool of accounting professionals and rising salary demands have made outsourcing the accounting function less of a luxury and more of a necessity.” Crete: “scaling talent, systems and infrastructure fast enough to meet demand while maintaining consistency and margins.” (Mar 5, 2026)
  - trade press https://www.journalofaccountancy.com/issues/2025/jul/tips-for-providing-the-cas-services-clients-want/ — “It’s not really optional… Clients want more than just tax returns.” “90% of CAS practices sell fixed-fee recurring services.” Berdar: billable hours “1,700 per year to only 500 or 600” while “CAS practice has shown 47% revenue growth.” (Jul 1, 2025)
  - ranked survey (billing lag at small firms) MAP PDF — “hourly billing (used by 63% of firms) and a per-tax-form fee (40%) remained the most popular approaches; the use of value billing (30%) was up five percentage points”
- **Incumbent gap:** QBO is the ledger, not a CAS operating system. Practice-management tools do tasks; they do not enforce a verticalized monthly close playbook.
- **Spend signal:** CAS NCFPP $156k; 17% growth; tech-investing practices serve 50% more clients — the money is in clients-per-accountant leverage.
- **Catalyst / trend:** Client-side accountant shortage (same as P3) is demand; OBBBA planning is the advisory upsell.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 4
- **Solo-builder angle:** **One-vertical monthly-close kit** (e.g. construction or dental only): checklist + QBO rules + client questionnaire, sold to 2–10 person firms trying to productize CAS without a $5k/yr TaxDome rollout.

## Vertical catalysts (dated)

- **2026 PCPS Top Issues Survey** released Jun 23, 2026 (fielded Apr 20–May 22, 2026, n=629): tax-law complexity #1 for smallest firms; hiring experienced staff #1 at 11–30; AI change-management #1 five-year issue. Sources: [AICPA](https://www.aicpa-cima.com/news/article/aicpa-survey-cites-change-management-for-technology-and-ai-as-top-long-term-issue-facing-accounting-firms), [JOA](https://www.journalofaccountancy.com/news/2026/jun/aicpa-top-issues-survey-firms-focus-on-technology-rises/).
- **OBBBA (P.L. 119-21)** enacted Jul 4, 2025; first full filing season in 2026. Permanent TCJA extenders plus new tip/OT deductions, SALT cap $40k through 2029. [Wolters Kluwer](https://www.wolterskluwer.com/en/expert-insights/navigating-compliance-planning-and-advisory-opportunities-under-the-one-big-beautiful-bill-act); [Surgent](https://blog.surgentcpe.com/obbba-one-year-tax-changes).
- **QuickBooks Desktop 2023** services discontinued May 31, 2026 (payroll, bank feeds, payments, live support). Desktop 2024 support through Sep 30, 2027; no further non-Enterprise Desktop versions. [Method](https://www.method.me/blog/quickbooks-desktop-alternatives/); [Certum](https://www.certumsolutions.com/library/quickbooks-desktop-2023-service-ending-may-2026).
- **QBO US price increase** May 1, 2026 (15–25% by tier) after 2025 accountant-billed changes. [Business2Community, Jul 6, 2026](https://www.business2community.com/small-business/quickbooks-price-increase-2026-cost-breakdown/).
- **CAS demand** still compounding: 85% of Accounting Today 2026 Top 100 reporting firms grew CAS (Mar 5, 2026).

## Consumer flip-side

- **Unresponsive / capacity-crushed CPAs.** Clients describe weeks of silence, then late filings. https://www.reddit.com/r/tax/comments/1sfmrs1/i_need_accountants_opinion_on_my_situation/ — “He would go silent for weeks at a time… informed me that he had not filed my 2024 taxes… My 2024 filings were ultimately completed on February 24, 2026.” (snippet). https://www.reddit.com/r/tax/comments/1cd2pl1/our_cpa_has_not_responded_for_weeks_and_wont/ — office dark, phones unplugged, “billing us $500 for 4 hours of work preparing the taxes (which were not filed).” (snippet)
- **Preparers who never e-file.** https://www.reddit.com/r/tax/comments/1m9bgc7/tax_preparer_forgot_to_submit_our_taxes_for_2023/ — paid, signed 8879, return never filed; penalties landed on the taxpayer; “they only refunded the fee.” (snippet)
- B2B2C wedge: a **client-status portal + filing confirmation** that shows “accepted by IRS” would address the honesty-rule failure mode — clients currently cannot tell work-in-progress from abandonment.

## Sources that failed or came up thin

- **G2 QuickBooks review search** returned no results this run; used Capterra comparison pages instead.
- **Intuit Firm of the Future pricing FAQ** (`firmofthefuture.com`) timed out on fetch; 2025 accountant-billed hike dates came from search snippets only, so US 2026 dollar amounts are cited from Business2Community (secondary), not Intuit’s own table.
- **Intuit Desktop discontinuation policy page** timed out on fetch; dates cited from Method/Certum/search, which agree on May 31, 2026 for Desktop 2023.
- **AccountingWEB** thread fetched as Cloudflare challenge; quote retained as **(snippet)** from search.
- **HN Algolia** `QuickBooks price increase` returned 0 hits.
- **TaxProTalk** organizer/ghosting threads exist but skew older (pre-2025); used for structural corroboration, not as load-bearing 2026 evidence.
- **Hours-chasing survey** query errored once; Canopy’s “20 minutes per client” is vendor-claimed, not a third-party time-and-motion study.
- **AICPA 2026 PCPS full commentary PDF** not yet posted (“later this summer” per Jun 23 release); used the news release + JOA writeup, plus the 2024 commentary PDF and 2025 MAP for staffing numbers.
