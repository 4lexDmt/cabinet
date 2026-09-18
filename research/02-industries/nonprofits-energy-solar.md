# Nonprofits & Energy/Solar — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Small-to-mid nonprofits (grant discovery/reporting, donor CRM, board packets) AND residential/small-commercial solar installers (incentive paperwork, ITC/25D 2026 status, NEM 3.0, cash-flow). Not large hospital systems, not utility-scale EPC.
- **Searches/fetches performed:** 15 web searches + 5 direct fetches (IRS 25D page, IRS OBBB FAQ FS-2025-05, IRS Notice 2025-42 PDF, SEIA tax policy, Form 5695 2025 instructions). r/nonprofit, Capterra, Chronicle mined via `site:` / fetch.

## Industry snapshot

- **Nonprofits:** Federal grants to "everyday charities" fell **38%** Feb–Sep 2025 vs 2024 ($35.4B → $21.4B) (Chronicle of Philanthropy). CEP: majority of 585 leaders face "unprecedented" politicization; 81% of 408 orgs saw/anticipate demand spikes while most lost at least one funding source (Chronicle citing CEP). Buyers are ED/development/finance staff of 1–3 people living in r/nonprofit.
- **Incumbents (NPO):** Blackbaud Raiser's Edge NXT (multi-year lock-in, $35k/yr cited, ~40% renewal step-ups); Bloomerang/Little Green Light/Neon/DonorPerfect as escapes; Instrumentl as the hated-but-best grant database (~$500/mo in practitioner posts); QBO + a "ridiculously detailed Google Sheet" as the actual grants OS.
- **Solar 2026:** Section **25D residential credit is dead for expenditures after Dec 31, 2025** (IRS FS-2025-05, Aug 21 2025; Pub. L. 119-21 / OBBB signed Jul 4 2025). Cash-sale homeowners get $0 federal. Remaining path is third-party ownership claiming **§48E** (30% for <1 MW residential TPO; begin construction by Jul 4 2026 or PIS by Dec 31 2027). California NEM 3.0 (Apr 2023) already crushed rooftop volume; 2026 layers federal sunset on top (LegalClarity citing SEIA 2025 YIR: further ~19% CA contraction projected for 2026).
- **Incumbents (solar):** Aurora Solar Premium **$220/user/mo** annual ($13,200/yr for 5 seats) before plan-sets; OpenSolar free core; HelioScope now Aurora-owned.

## Top problems

### npo-solar-P1. Grant reporting is a spreadsheet OS: deadlines, restrictions, and spend-downs live outside the GL

- **Who hurts:** Grants + finance staff at orgs with 8–15+ awards; $300k–$5M budgets
- **What happens now (workaround):** One master Google Sheet (applications / awards / reporting / RESTRICTIONS column); Excel tab-per-grant updated monthly; QBO Projects for spend-down that program staff can't log into; Asana due dates duplicated; Instrumentl for prospecting only
- **Frequency:** Monthly close + every funder deadline
- **Evidence:**
  - community https://www.reddit.com/r/nonprofit/comments/1ohqu1v/grants_process_and_record_keeping/ — "We run our entire grants cycle off a ridiculously detailed Google Sheet. One master tracker. … a big fat column for 'RESTRICTIONS.'" Also: "three different tools: spreadsheets, QB and Asana." (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/1qwvckl/template_for_grant_monitoring/ — "I have one master excel sheet where every grant has a different tab with their budgets … updated at least once a month"; tried other systems "too time-consuming to set up … The ROI just wasn't there" (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/1iq6o0u/tools_to_track_grant_spenddowns/ — "Every place I've worked grants for has just used an excel workbook for each grant." CRM "can't track the spent funds like QBO … So, we also use Excel." "I WISH there was a program that did it all." (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/1r1zt5h/what_is_your_process_of_generating_your_financial/ — "Right now my process is pretty manual. I export the general ledger file, spend a few hours in Excel mapping accounts to the right line items" (snippet)
- **Incumbent gap:** Donor CRMs don't do restricted-fund accounting; QBO classes are unusable by program staff; Instrumentl tracks applications not spend-down
- **Spend signal:** Hours per month of finance+development; 15-grant shops already paying for QBO + CRM + 365 and still spreadsheet; "tried to use different systems … ROI just wasn't there"
- **Catalyst / trend:** 2026 federal disruption (P3) makes missed reports existential (termination risk)
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 5
- **Solo-builder angle:** A grant-award ledger that sits on QBO classes + a deadline calendar + funder-template exporter. Not a donor CRM. r/nonprofit is the channel.

### npo-solar-P2. Blackbaud Raiser's Edge is a $35k/yr hostage with 3-year contracts, 40% step-ups, and an unfinished NXT overlay

- **Who hurts:** Orgs that bought RE years ago; especially after losing the one RE-expert staffer
- **What happens now (workaround):** Stay (Stockholm); migrate to Bloomerang and fight the 45-day cancel window; pay Omatic connectors; HubSpot (which can't even soft-credit a gift)
- **Frequency:** Daily UX pain; annual/3-year renewal ambush
- **Evidence:**
  - community https://www.reddit.com/r/nonprofit/comments/1c1xix3/why_do_we_use_raisers_edge/ — "If my 20+ years long career in nonprofits has a villain, it's Blackbaud." "$35k per year. We have to pay our the rest of our contract to leave its insane!" "RE NXT which is literal unfinished trash" (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/1mtsxk9/what_is_blackbaud_re_nxt_like_in_2025/ — "a tiered increase over the course of a 3 year contract that ended with us paying something like 40% more for the same record band." "Blackbaud charges an arm and a leg" (2025 thread)
  - review https://www.capterra.com/compare/29170-247647/eTapestry-vs-Blackbaud-Raiser-s-Edge-NXT — "The biggest downside of Raiser's Edge NXT is the cost." "They insisted we missed the timeline to unsubscribe and demanded a very expensive fee for the following period." "expensive program that our office does not even know how to fully use." (2026 Capterra compare)
  - community https://www.reddit.com/r/nonprofit/comments/iggopr/success_cancelling_blackbaudraisers_edge_contract/ — missed 45-day window; BB demanded full-year pay; "We almost had to involve legal to get our data out" (snippet; older but the contract mechanic is current)
- **Incumbent gap:** Insular ecosystem (3rd-party via Omatic); Crystal/letter-merge sunsets; support "AI prompts which literally NEVER have a useful answer" (1mtsxk9)
- **Spend signal:** $35k/yr × remaining contract years; 40% step-up; migration legal time
- **Catalyst / trend:** 2025 NXT pricing-tier revamp + feature sunsets; federal-funding crunch makes the bill politically unpayable to boards
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 5 · solo-buildability 3 · whitespace 2 · why-now 4
- **Solo-builder angle:** Not another CRM (crowded). A **RE-exit kit**: data-map + gift/soft-credit validator + contract-window calendar. Bloomerang/Neon already win the destination; the unpaid job is getting out.

### npo-solar-P3. 2025–26 federal grant collapse + proposed 2 CFR 200 rewrite is killing small orgs' cash and forcing a scramble to private funders

- **Who hurts:** Community-based 501(c)(3)s with any federal or pass-through dollars
- **What happens now (workaround):** Draw reserves; cut hours/benefits; emergency community-foundation grants; pivot to Instrumentl/foundation prospecting they can't afford
- **Frequency:** Continuous 2025–26
- **Evidence:**
  - trade https://www.philanthropy.com/news/federal-grants-to-everyday-charities-fell-38-in-trumps-first-months/ — grants **$35.4B → $21.4B** (38% drop) Feb–Sep 2025 vs 2024 (snippet)
  - trade https://www.philanthropy.com/news/nonprofit-leaders-face-tough-choices-on-staffing-fundraising-as-federal-cutbacks-continue/ — CEP, 585 leaders; "more than half of respondents to consider reducing staff-related costs or drawing from reserves"; DOJ slashed "more than $800 million" (snippet)
  - trade https://www.philanthropy.com/news/news-beasleyjan26emergencygrants-0129/ — CEP 408 orgs: **81%** increased/anticipated demand; 30% cut services after funding loss; Medicaid ~$1T and SNAP ~$186B cuts over a decade in last year's tax law (snippet)
  - trade https://beancount.io/blog/2026/08/13/federal-grant-cuts-small-nonprofits-2026-guide — "One in three nonprofits has experienced at least one type of government funding disruption in 2026" (citing NPQ mid-year); OMB proposal would eliminate fixed-amount awards — "the most accessible pathway for small organizations that lack sophisticated cost-accounting systems" (Aug 13, 2026)
- **Incumbent gap:** None of the CRMs help you re-forecast a 38% federal haircut or produce a reimbursement-ready cost allocation
- **Spend signal:** Staff cuts, reserve draws, $3k–$20k emergency grants as the substitute product
- **Catalyst / trend:** OBBB / 2025 admin grant cancellations; OMB 2 CFR 200 overhaul comment period (Chronicle: political appointee gatekeepers; comment until Jul 13 on the sandbox piece)
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 3 · reachability 5 · solo-buildability 3 · whitespace 3 · why-now 5
- **Solo-builder angle:** A "funding-mix stress test" + foundation-prospect list generated from 990s (Grantmakers.io pattern) priced for sub-$1M orgs. Instrumentl is the expensive incumbent this replaces.

### npo-solar-P4. Looking for grants costs $500/mo, so small shops pirate a one-month Instrumentl binge into a spreadsheet

- **Who hurts:** Volunteer-led and sub-$500k orgs; freelance grant writers
- **What happens now (workaround):** 2-week trial dump; library FDO one day/month; GrantStation via Chronicle $109; ProPublica 990s; ChatGPT; share a login
- **Frequency:** Continuous prospecting
- **Evidence:**
  - community https://www.reddit.com/r/nonprofit/comments/11331jm/im_absolutely_sick_at_how_expensive_it_is_to_look/ — "I cannot afford the literal $500 a month for Instrumentl." "crazy expensive" (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/1gl6n20/is_grantwatch_worth_it/ — "Step 1. Pay instrumentl for one month of service. … Step 3. Cancel your subscription." "When I was FT at a small organization I was able to calendar out a year with the 2 week trial" (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/1p511oo/our_small_nonprofit_needs_access_to_instrumentl/ — "Instrumentl is very expensive." "the cost barrier for grant research tools is real" (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/165ncad/grant_search_engines/ — "I've heard it's a great tool. But it's incredibly expensive. … I personally wouldn't pay the premium" (snippet)
- **Incumbent gap:** Instrumentl is loved *and* gated; Candid FDO is library-day-pass; nothing good sits at $20–$50/mo (the price the 11331jm OP asked for)
- **Spend signal:** $500/mo list; consultants absorb it and bill clients; orgs "save thousands" by canceling after a binge
- **Catalyst / trend:** P3 makes prospecting urgent exactly when budgets shrink
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** 990-graph prospector (who funded orgs like you, in your county, last 3 years) at $29–$49/mo. Data is public. Don't scrape Instrumentl.

### npo-solar-P5. Board packets still mean hours of GL→Excel remapping and 20–100 page PDFs nobody reads

- **Who hurts:** Ops managers / finance-of-one; boards that ask for "a quick presentation"
- **What happens now (workaround):** Export GL, remap, Power Query; Adobe Pro via TechSoup to stitch PDFs; 100-page quarterly packs
- **Frequency:** Monthly/quarterly
- **Evidence:**
  - community https://www.reddit.com/r/nonprofit/comments/1r1zt5h/what_is_your_process_of_generating_your_financial/ — "spend a few hours in Excel mapping accounts"; "If you're spending hours remapping accounts every month, that's a sign your tracking logic lives in Excel" (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/jxdx70/is_it_normal_to_spend_an_enormous_amount_of_time/ — "compile a myriad of financial reports… finance committee materials are about 20-30 pages, and our board report is well over 100 pages." Replies: "Yes. Fairly normal." (snippet)
  - community https://www.reddit.com/r/nonprofit/comments/1ne72g1/ive_had_it_how_do_you_put_together_board_packets/ — title is the pain; best case "The whole thing just takes a couple of hours" assembling PDFs (snippet, 2025-era)
- **Incumbent gap:** QBO doesn't emit a nonprofit board dashboard (days cash, restriction columns, BvA) without Excel; Blackbaud reporting is a Capterra con
- **Spend signal:** Hours × 4–12 cycles/year of a $60–$90k finance staffer; Adobe Pro + TechSoup
- **Catalyst / trend:** Boards now asking harder cash-runway questions because of P3
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 5 · solo-buildability 5 · whitespace 3 · why-now 3
- **Solo-builder angle:** QBO-connected one-pager: days cash, restricted vs unrestricted, BvA, 90-day forecast. Ship as a Notion/PDF. Classic solo SaaS.

### npo-solar-P6. The 30% homeowner solar credit is gone; installers who still sell "the ITC" are one IRS letter from a lawsuit, and cash-flow is inverted

- **Who hurts:** Residential EPCs; homeowners who signed in late 2025 for 2026 installs; TPO finance desks
- **What happens now (workaround):** Pivot to leases/PPAs so the *owner* claims §48E; scramble for PTO letters dated ≤2025-12-31; 2–5% recapture reserves on "ITC guarantee" contracts
- **Frequency:** Every 2026 residential sale
- **Evidence:**
  - regulatory https://www.irs.gov/newsroom/faqs-for-modification-of-sections-25c-25d-25e-30c-30d-45l-45w-and-179d-under-public-law-119-21-139-stat-72-july-4-2025-commonly-known-as-the-one-big-beautiful-bill-obbb — FS-2025-05 (Aug 21, 2025): "25D … The credit will not be allowed for any expenditures made after December 31, 2025." Paying in 2025 is **not** enough: "If installation is completed after December 31, 2025, the expenditure will be treated as made after December 31, 2025" (fetched)
  - regulatory https://www.irs.gov/credits-deductions/residential-clean-energy-credit — "The credit is not available for any property placed in service after December 31, 2025." (fetched 2026-09-17; page still also says phase-out "in 2033" — stale sentence vs FAQ)
  - regulatory https://www.irs.gov/instructions/i5695 — 2025 Form 5695: "You can't claim residential clean energy credits for expenditures made after December 31, 2025." Unused credit carries to 2026 (fetched)
  - industry https://seia.org/initiatives/tax-policy/ — "The OBBBA ended tax credits under Section 25D for solar and storage homeowners on December 31, 2025"; §48E 30% for <1 MW TPO on residences; begin construction after Jul 4 2026 ⇒ PIS by Dec 31 2027 (fetched)
  - trade https://beancount.io/blog/2026/06/02/solar-installer-contractor-bookkeeping-asc-606-performance-obligations-section-48e-itc-2026-adders-section-25d-sunset-residential-epc-companies-domestic-content-energy-community-guide — "A residential solar EPC closed 412 systems in March 2026 — its biggest month ever — and still ended Q1 cash-flow negative." TPO "is now the only way most homeowners can capture any federal tax benefit" (Jun 2, 2026)
- **Incumbent gap:** Aurora/OpenSolar proposal engines still need a 2026-correct incentive engine (25D off, 48E TPO on, state rebates, NEM/NBT). Most sales decks were built for 30% cash ITC
- **Spend signal:** Entire 30% of system price vanished from the homeowner ROI slide; EPC working-capital inversion (commissions + modules out before milestone cash in); 2–5% indemnity reserves
- **Catalyst / trend:** OBBB Jul 4 2025; §48E begin-construction **Jul 4/5 2026** (IRS Notice 2025-42: Physical Work Test is the sole method except §6; continuity required)
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 4 · solo-buildability 4 · whitespace 4 · why-now 5
- **Solo-builder angle:** A **2026-correct incentive + TPO vs cash quote engine** (state NEM/NBT + remaining rebates + 48E vs $0 25D) that plugs into OpenSolar. The rush to begin-construction by Jul 2026 is a dated sales window.

### npo-solar-P7. NEM 3.0 already wrecked CA installer cash-flow; 2026 adds another contraction on the federal sunset

- **Who hurts:** CA residential installers (the "vast majority" do <10 systems/yr — LBNL); similar NEM-reform states next
- **What happens now (workaround):** Attach batteries (10% → ~60%); go TPO; exit; consolidate under Sunrun
- **Frequency:** Structural since Apr 2023; 2026 is the second shock
- **Evidence:**
  - trade https://pv-magazine-usa.com/2023/12/01/california-rooftop-solar-installations-drop-80-following-nem-3-0/ — CALSSA: sales −66% to −83% YoY; **17,000 jobs** (−22%); **63% expect cash-flow issues** over next three quarters; 43% (~300 businesses) "difficult to remain in business" (Dec 1, 2023; still the baseline)
  - survey/research https://www.utilitydive.com/news/residential-solar-storage-california-after-nem-30-lbnl/716589/ — LBNL: storage attach 10%→60%; paired-system cost +17%; top-5 share 40%→51%; only half of ~2,500 firms completed an NBT (not grandfathered NEM) system (snippet)
  - trade https://legalclarity.org/nem-3-0-lawsuit-update-court-rulings-and-market-impact/ — CA Supreme Court path ended; "analysts projected a further 19 percent contraction for 2026, partly driven by the expiration of a federal tax credit" citing SEIA Solar Market Insight 2025 YIR; commercial NEM 2.0 backlog "largely exhausted by mid-2026" (snippet)
- **Incumbent gap:** Design software doesn't do working-capital; no lightweight "battery + NBT bill-savings" closer for 1–5 person shops priced out of Aurora
- **Spend signal:** 17k jobs; 63% cash-flow warning; 300 firms at risk (CALSSA 2023) — 2026 federal sunset is the second wave
- **Catalyst / trend:** NEM 3.0 in force Apr 15 2023; legally settled; 25D gone 2026-01-01
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 3 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** CA-first **NBT + storage savings calculator** that is honest about export credits (the thing door-knockers lie about). State-by-state NEM patchwork is the expansion path.

### npo-solar-P8. Homeowners love solar and hate solar companies — production estimates are gamed in Aurora, 2025 rush jobs are failing in 2026, and door-knock quotes run $10k–$40k over

- **Who hurts:** Homeowners; honest local EPCs competing with national sales orgs
- **What happens now (workaround):** Three bids; EnergySage; "buy the installer not the panels"
- **Frequency:** Every residential sale
- **Evidence:**
  - consumer https://www.reddit.com/r/solar/comments/1sihmp6/people_love_solar_but_hate_solar_companies/ — "They overbooked in 2025 because many people rushed to buy when the federal incentives were discontinued … hired inexperienced installers (contract). Wiring was all screwed up … What should have taken 2 weeks, took 6 months." (snippet)
  - community https://www.reddit.com/r/solar/comments/10x4921/how_accurate_are_the_shading_reports_from_these/ — "It is possible for a bad actor to deliberately tweak the model to artificially improve production. Typically this will be done by manually adjusting things like trees" in Aurora. High-volume shops "skewed to represent higher production" (snippet)
  - consumer https://www.reddit.com/r/solar/comments/1h6wmoi/do_people_hate_solar_company_door_knockers_or/ — "The worst one came in at 70k on a system I ultimately paid 30k for but all of them were at least 10k over" (snippet)
  - pricing https://www.heavengreenenergy.com/blog/aurora-solar-review — Aurora Premium **$220/user/mo** annual; bankable shade report gated off Basic $135; 5-seat Premium **$13,200/yr** (2026 review, fetched)
- **Incumbent gap:** Aurora is the gold-standard *and* the fraud surface (manual tree-nudging); OpenSolar is the free alternative but weaker "bankable" reports. No consumer-readable independent production check.
- **Spend signal:** $10k–$40k quote spread; $13.2k/yr Aurora; 6-month delayed 2025-rush installs
- **Catalyst / trend:** 2025 25D rush → 2026 quality blowback (1sihmp6)
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** A homeowner-facing **second-look production audit** (LiDAR shade vs the installer's PDF) sold B2C2B — local EPCs buy it as a trust badge. Don't depend on Aurora's API.

## Vertical catalysts (dated)

- **OBBB / Pub. L. 119-21 signed Jul 4, 2025.** 25D expenditures after 2025-12-31 ineligible (IRS FS-2025-05, Aug 21 2025). Installation-complete test, not payment date.
- **§48E / §45Y solar/wind:** begin construction after Jul 4 2026 ⇒ must be placed in service by Dec 31 2027 (SEIA; IRS Notice 2025-42, Physical Work Test).
- **PFE / prohibited foreign entity screens** begin 2026 for ITC/PTC/45X (SEIA).
- **NEM 3.0 / NBT** CA since Apr 15 2023; lawsuits exhausted (LegalClarity).
- **Federal nonprofit grants −38%** Feb–Sep 2025 (Chronicle). OMB 2 CFR 200 overhaul proposed 2026 (fixed-amount awards at risk).
- **Note:** IRS 25D landing page still contains a leftover "phase out in 2033" sentence next to the Dec 31 2025 cutoff — a live source of homeowner/installer confusion. Trust FS-2025-05 + Form 5695 instructions.

## Consumer flip-side

- **Solar:** door-knock premium, gamed Aurora production, 2025-rush quality failures, "married to the installer for 20 years." Trust-layer product (P8).
- **Nonprofit beneficiaries:** 30% of CEP-surveyed orgs cut services after funding loss (Chronicle) — the human cost of P3, not a SaaS buyer.
- **Homeowners claiming 2025 25D in 2026 filings:** need PTO/commissioning dated ≤2025-12-31 (Beancount May 2026). A doc-checklist product is B2C.

## Sources that failed or came up thin

- First Raiser's Edge and Chronicle searches **errored**; recovered on retry.
- Direct reddit.com / G2 fetch blocked; quotes are snippets except fetched IRS/SEIA/FAQ.
- **OpenSolar** practitioner complaints were thin this run (named as free Aurora alternative in 2026 roundups, not hated).
- Chronicle articles are snippet-mined (possible paywall on full text).
- LBNL NEM brief DOI 10.2172/2386940 listed but not fetched as PDF; used Utility Dive + CALSSA secondary.
- Instrumentl's current public price card not fetched — **$500/mo is a practitioner claim**, not a pricing-page confirm. Treat as directional.
- CEP report primary PDFs not fetched; numbers via Chronicle.
- Salesforce NPSP complexity mentioned in the source map but not independently mined here.
- IRS 25D HTML page is internally inconsistent (2033 leftover vs 2025 cutoff) — flagged above, not hidden.
