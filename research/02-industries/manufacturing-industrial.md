# SMB Manufacturing and Industrial — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** US SMB job shops, CNC machine shops, fabricators, and light/make-to-order manufacturers (~5–150 employees). Not mega-OEM plants, process chemicals, or semiconductor fabs.
- **Searches/fetches performed:** 22 web searches + 8 direct fetches (incl. HN Algolia). CNCZone quoting queries returned hobby-CNC noise — see failures.

## Industry snapshot

- Buyers are owner-operators and estimators at job shops: they live in email + Excel + a hated ERP (JobBOSS²/E2, Fishbowl bolted to QuickBooks, occasionally NetSuite after a $50–100k first-year quote). Quoting is still mostly one senior person’s head.
- 2026 climate: OEMs are reshoring (36% actively engaged vs 29% in 2025) and 32% of contract manufacturers are quoting reshoring work — double 2025 — while 66% rate hiring machinists/welders/technicians as “very difficult or crisis” ([Quality Magazine / Reshoring Initiative](https://www.qualitymag.com/articles/99902-new-survey-us-reshoring-momentum-builds-despite-policy-and-workforce-challenges), Sept 9, 2026).
- Deloitte’s 2026 Manufacturing Outlook: >1/3 of 600 executives name “equipping workers with the skills… of smart manufacturing” as top concern; immigrant workers filled nearly 1 in 4 US manufacturing production jobs in 2024 ([deloitte.com](https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook.html)).
- Incumbents: Paperless Parts (custom quote; competitor-reported ~$10k setup + $18k/yr), NetSuite (~$90k proposals for 5-user shops), Fishbowl entry ~$349/mo on G2, JobBOSS² Capterra reviewers citing $37k wasted. Lightweight challengers: Fulcrum, ProShop, Tempus Tools ($75/mo), Cetec.
- Force is derived from capacity + estimator hours: shops that cannot quote in 24–48 hours lose the RFQ. That is the binding constraint.

## Top problems

### manufacturing-industrial-P1. Job-shop quoting still lives in Excel + one person’s head — RFQs sit days while the estimator is on a machine

- **Who hurts:** Owner-estimators at 5–50 person CNC/fab shops; anyone bidding Xometry/OEM RFQs with outside processing (HT, anodize).
- **What happens now (workaround):** Excel templates with highlighted “must fill” cells; McMaster/Online Metals as a same-day material proxy; two-person quote huddles; Paperless Parts if they can stomach custom pricing.
- **Frequency:** Daily (every RFQ).
- **Evidence:**
  - community [practicalmachinist.com/forum/threads/methods-to-expedite-quoting.375813](https://www.practicalmachinist.com/forum/threads/methods-to-expedite-quoting.375813/) — “Looking to expedite my quoting process to 5 days down to 1 or 2 days… Its usually me and my father running the shop.” Reply: “I used to use spreadsheets before MRP and still reverted to them even after.” (Apr 2–5, 2020; structural, still the default in 2025–26 threads)
  - community [practicalmachinist.com/forum/threads/cost-estimation.410407](https://www.practicalmachinist.com/forum/threads/cost-estimation.410407/) — “I’d recommend making yourself a simple spreadsheet in excel… Every highlighted box needs to be filled!” (snippet)
  - community [practicalmachinist.com/forum/threads/quoting-estimating-software-kipware.294321](https://www.practicalmachinist.com/forum/threads/quoting-estimating-software-kipware.294321/) — “I'm just finding it a bit odd that there is no software in between spreadsheets and the big players like E2 and Joboss… I have used E2 extensively… but can't quite stomach the price yet.” (snippet)
  - vendor/WTP [paperlessparts.com/job-shop-software](https://www.paperlessparts.com/job-shop-software/) — “Paperless Parts has not only cut our quoting time in half” (Kelly Ward, fab owner); claimed “15 minute quote turnaround” / “2,000 hours per year saved” (fetched 2026-09-17)
  - competitor/WTP [tempustools.com/compare/tempus-tools-vs-paperless-parts](https://tempustools.com/compare/tempus-tools-vs-paperless-parts) — “Paperless Parts does not publish pricing publicly, although some users note $10k setup + $18k/year”; Tempus starts $75/mo; customer: “Instead of two people quoting full time, we can now have one person do a better job in a quarter of the time.” (fetched)
- **Incumbent gap:** JobBOSS/E2 quoting is clunky (volume breaks, discounts); Paperless Parts is the category winner but sales-gated and priced like enterprise. Spreadsheet-to-$18k/yr is a cliff.
- **Spend signal:** $10k + $18k/yr (Paperless Parts, competitor-reported); Tempus $900/yr proves a cheaper wedge exists for laser/fab; estimator labor is the real bill (one FTE quoting).
- **Catalyst / trend:** 32% of CMs quoting reshoring projects in 2026 (2× 2025) — more RFQs into the same bottleneck.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** Geometry-from-PDF quote helper for one process (2.5-axis mill or laser/sheet) that outputs a priced Excel/PDF and a traveler, sold $75–150/mo against Paperless Parts’ $18k umbrella.

### manufacturing-industrial-P2. Job-shop ERP is either a $37k+ clunker (JobBOSS/E2) or a $90k NetSuite overkill — shops stay on QuickBooks + duct tape

- **Who hurts:** 10–80 employee shops outgrowing QuickBooks inventory but not ready for Epicor/SAP.
- **What happens now (workaround):** JobBOSS “ok enough but clunky”; Fishbowl bolted to QuickBooks (sync breaks); double-entry into Simply Accounting; Smartsheet; Katana/Fulcrum/ProShop trials.
- **Frequency:** Daily (job tracking, inventory, quotes).
- **Evidence:**
  - community [reddit.com/r/manufacturing/comments/1ig2jcx](https://www.reddit.com/r/manufacturing/comments/1ig2jcx/what_erp_system_do_you_guys_use/) — “We use JobBoss right now and it’s ok enough, but it’s clunky and it won’t show on quotes if you are doing a volume break of pricing… it’s a cumbersome system.” (snippet, 2025)
  - community [reddit.com/r/manufacturing/comments/1so6l82](https://www.reddit.com/r/manufacturing/comments/1so6l82/erp_system_feedback_for_manufacturers_in_ct/) — “I used jobboss but would not recommend it these days.” / “Jobboss2 is great for job shops but doesn’t have strong scheduling… I never liked the way I couldn’t back flush inventory” (snippet, 2026)
  - community [practicalmachinist.com/forum/threads/anyone-using-e2.325788](https://www.practicalmachinist.com/forum/threads/anyone-using-e2.325788/) — “Burn it to the ground and salt the earth… cascading consequences will make you punch your monitor on a weekly basis.” / “to say it’s user unfriendly it a huge understatement.” (snippet)
  - review-gap [capterra.com/compare/148011-219273/MasterControl-vs-JobBOSS](https://www.capterra.com/compare/148011-219273/MasterControl-vs-JobBOSS) — “In short, $37,000.00 later, not only we would NEVER recommend this product…”; “TERRIBLY NON-INTUITIVE SYSTEM”; “With the new E2 a lot of features didn’t carry over.” (2026 page, snippets)
  - community/WTP [reddit.com/r/Netsuite/comments/1rq2spt](https://www.reddit.com/r/Netsuite/comments/1rq2spt/should_i_implement_netsuite_potential_new_user/) — “90k is overkill for your business size.” / “first-year costs can easily land in the $50k–$100k+ range.” / “Do not do it… You are manufacturing consider an ERP that is more cost accounting, and manufacturing centric.” (snippet, 2026)
  - review-gap [g2.com/compare/fishbowl-inventory-vs-katana-cloud-inventory](https://www.g2.com/compare/fishbowl-inventory-vs-katana-cloud-inventory) — “The user experience is exceptionally clunky. Implementation was (still is) a nightmare… the system crashes regularly”; entry price $349 vs Katana $179 (snippets)
  - review-gap [capterra.com/compare/123794-172888/Fishbowl-vs-Katana-MRP](https://www.capterra.com/compare/123794-172888/Fishbowl-vs-Katana-MRP) — “The pricing is expensive and the cancellation policy is terrible.”; “they just start to bill your payment card with 899$ every month.” (snippets)
- **Incumbent gap:** JobBOSS/E2 are job-shop native but UI/upgrade-broken; NetSuite is a financial platform with a neglected manufacturing module (“Advanced manufacturing was an acquisition they’ve essentially left out to die” — [r/Netsuite](https://www.reddit.com/r/Netsuite/comments/1ipz843/why_netsuite_is_not_investing_to_improve/)); Fishbowl’s QB sync is the product and it fails.
- **Spend signal:** $37k JobBOSS regret; $90k NetSuite proposals; Fishbowl $349–$899/mo; Fulcrum “unlimited users based on revenue” named as the 2026 alternative in r/manufacturing.
- **Catalyst / trend:** None new — structural; E2 feature-loss on upgrade is the 2025–26 spark.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 4 · solo-buildability 2 · whitespace 3 · why-now 3
- **Solo-builder angle:** Do not build another ERP. Build the missing layer shops actually want: quote → traveler → job-cost vs actual, sitting on QuickBooks, at $100–250/mo (the Kipware-to-E2 gap Practical Machinist named a decade ago and still exists).

### manufacturing-industrial-P3. Accepted quotes die in the CRM-to-ERP dead zone — re-keying leaks margin and delays cash

- **Who hurts:** Ops managers at 50–200 person custom manufacturers; sales ops who copy quotes into Epicor/NetSuite/Global Shop.
- **What happens now (workaround):** Monday morning ERP audits; copy-paste from CRM/email/spreadsheet; 2-minute checklists nobody owns.
- **Frequency:** Per won job; weekly cleanup.
- **Evidence:**
  - trade/practitioner [forgepoint.ai/insights/2026-04-quote-to-cash-gap](https://forgepoint.ai/insights/2026-04-quote-to-cash-gap) — “Every Monday morning, Rachel spends two to three hours… Last quarter, a wrong discount tier on a $40K order cost them $6K in margin.” “Most manufacturers lose three to five days of dead time between quote acceptance and production start.” “Disputed invoices take an average of 16 days longer to collect than clean ones.” (Apr 1, 2026, fetched)
  - trade [buildlabconsulting.com](https://www.buildlabconsulting.com/blog-single/cnc-platform-erp-integration-not-replacement/) — shops won’t rip Global Shop / Epicor / NetSuite / SAP B1 / JobBOSS²; the gap is “the manual quoting process that leaves the ERP hearing about a sale late” (snippet)
  - community [practicalmachinist.com/forum/threads/methods-to-expedite-quoting.375813](https://www.practicalmachinist.com/forum/threads/methods-to-expedite-quoting.375813/) — “the process of quote>receive order>process into work order>invoice/packing slip is essentially a manufacturing process… If there's any one 'key' issue it's to be able to store/recall/process/maintain information” (The Dude, Apr 2020)
  - community [practicalmachinist.com/forum/threads/software-helps-shop-thrive-on-diversity.255424](https://www.practicalmachinist.com/forum/threads/software-helps-shop-thrive-on-diversity.255424/) — before E2 unification, “moving a job from quote to order required recreating the whole data set from scratch… duplicate data entry often resulted in confusion and inaccuracies” (snippet)
- **Incumbent gap:** CPQ exists only at the high end; mid-market CRMs and ERPs “don’t talk to each other in real time” (Forgepoint). Paperless Parts advertises ERP handoff as the premium feature.
- **Spend signal:** $6k margin hole on one $40k order; 3–5 days of dead WIP; 16 extra DSO on disputed invoices.
- **Catalyst / trend:** Reshoring quote volume (P6) makes the handoff fail more often.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 3 · solo-buildability 4 · whitespace 4 · why-now 4
- **Solo-builder angle:** “Quote locker”: ingest the signed PDF/email, diff vs ERP sales-order fields, flag mismatches before the job is released — sold as a $50–150/mo add-on, not an ERP replacement.

### manufacturing-industrial-P4. When the best machinist retires, setups, quoting instincts, and scrap-calls walk out — nothing in the router captures it

- **Who hurts:** Founder-led shops; buyers of those shops; junior programmers covering a 56+ workforce.
- **What happens now (workaround):** Time cards → secretary → spreadsheet; “shadow Dave”; new AI copilots (Swarf AI) still early.
- **Frequency:** Continuous; crisis at each retirement.
- **Evidence:**
  - trade [harborwind.com/insights/when-your-best-machinist-retires-what-leaves-with-him](https://harborwind.com/insights/when-your-best-machinist-retires-what-leaves-with-him) — “The New Manufacturing Alliance found that 44% of respondents said machinists in this critical position were 56 or older.” “None of that sits cleanly in a router… When that person retires… slower setups, longer first-article runs, more rework, shakier quotes.” (Apr 4, 2026, fetched)
  - ranked survey [themanufacturinginstitute.org](https://themanufacturinginstitute.org/manufacturers-need-as-many-as-3-8-million-new-employees-by-2033/) — “as many as 3.8 million additional employees could be needed… 1.9 million jobs could remain unfilled”; NAM 2024 Q1: 65% rank attracting/retaining talent as primary challenge (Deloitte/MI)
  - trade [mentorgain.com/blog/knowledge-transfer-manufacturing-retiring-workforce](https://www.mentorgain.com/blog/knowledge-transfer-manufacturing-retiring-workforce) — “Deloitte’s 2026 Manufacturing Industry Outlook names capturing institutional knowledge from retiring employees as a priority use case… more than 81% of task hours in manufacturing are still expected to remain human-driven.” (Sept 8, 2026, fetched)
  - community [practicalmachinist.com/forum/threads/how-i-track-time-on-all-of-my-jobs-and-improve-quoting.444415](https://www.practicalmachinist.com/forum/threads/how-i-track-time-on-all-of-my-jobs-and-improve-quoting.444415/) — “Always tracked time by having the guys fill out their time card… Had the secretary add those numbers to a note card… There was a spreadsheet with all the job numbers searchable” (snippet)
  - trade [todaysmachiningworld.com](https://todaysmachiningworld.com/can-ai-replace-your-shops-smartest-machinist-with-riley-hutchinson-ep-242/) — Swarf AI “built specifically to fill the tribal knowledge gap that retiring skilled workers are leaving” (snippet)
- **Incumbent gap:** ERP routers store ops, not judgment. Mentoring software assumes desk workers with calendars. Shop-floor capture (setup video + quote history) is the hole.
- **Spend signal:** Replacement cost commonly cited 100–200% of salary (Mentorgain); buyers already discount shops where “earnings walk out with one retirement” (HarborWind).
- **Catalyst / trend:** Deloitte 2026 outlook explicitly names institutional-knowledge capture; 2.8 million of the 3.8 million openings are retirements.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 5
- **Solo-builder angle:** Phone-first “setup library”: record the fixture/setup that saved the part, tag it to a job/part number, searchable by the next operator — $30–80/mo, sold in Practical Machinist and r/machinists.

### manufacturing-industrial-P5. Defense/aero RFQs now demand FAI + C of C + MTRs + ITAR file handling + CMMC — small shops drown in the packet, not the part

- **Who hurts:** Shops chasing DoD/aero work; quality clerks assembling cert packages; shops deciding whether CMMC is worth $75k–$150k.
- **What happens now (workaround):** Travelers on paper; certs in email folders; CMMC consultants $10–40k; some refuse the work.
- **Frequency:** Per defense/aero job; audits episodic; CMMC is a 2025–26 cliff.
- **Evidence:**
  - trade [millsmachineworks.com/blog/2026/3/18/…](https://www.millsmachineworks.com/blog/2026/3/18/compliance-is-tightening-across-aerospace-amp-defense-heres-what-that-means-for-your-machine-shop) — “RFQs are requesting more documentation… First Article Inspection Reports, Certificates of Conformance, Material Test Reports, Controlled file handling for ITAR work” (Mar 18, 2026)
  - trade [modusadvanced.com](https://www.modusadvanced.com/resources/blog/manufacturing-traceability-for-defense-complete-guide-to-as9100-itar-and-cmmc-documentation-requirements) — “Every defense shipment requires C of C documentation linking delivered parts to approved specifications, material certifications, and quality inspection records” (fetched)
  - community [reddit.com/r/manufacturing/comments/1s5efa3](https://www.reddit.com/r/manufacturing/comments/1s5efa3/erp_vetting_processrecommendations/) — “E2 JobBOSS is decent for scheduling and job costing but the quality side is pretty thin… NCRs, CAPA tracking, certificate of conformance generation” (snippet, 2026)
  - catalyst/WTP [mind-core.com/blogs/cmmc-level-2-compliance-cost-a-2026-smb-budget-guide](https://mind-core.com/blogs/cmmc-level-2-compliance-cost-a-2026-smb-budget-guide/) — complete L2 path “$75,000 and $250,000”; lean 25-person enclave “$75,000 to $110,000” (2026)
  - catalyst [machinistx.com/articles/cmmc-compliance-costs](https://machinistx.com/articles/cmmc-compliance-costs) — small shop (10–25) “$30,000 – $75,000 total”; C3PAO “$25,000–$50,000”; “A $5 million shop cannot casually spend $100K” (snippet)
  - primary [dla.mil Small-Business Cybersecurity](https://www.dla.mil/Small-Business/Resource-Center/Cybersecurity-Resources/) — Phase I self-assessment in force from Nov 10, 2025; Phase II (C3PAO) originally Nov 10, 2026, “immediate suspension” announced July 13, 2026 — Phase I remains (fetched)
- **Incumbent gap:** JobBOSS quality is “pretty thin”; Paperless Parts markets CMMC/GovCloud as a quoting moat, not a cert-packet builder. Nobody cheap assembles MTR+FAI+C of C against the PO/drawing.
- **Spend signal:** $30–150k CMMC all-in; consultants $10–40k; a single DoD subcontract “$100K–$500K annually” (MachinistX) is the payoff.
- **Catalyst / trend:** CMMC Phase I live Nov 2025; Phase II paused July 2026 — shops still need NIST 800-171 evidence and cleaner quality packets for primes.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 4 · solo-buildability 3 · whitespace 4 · why-now 5
- **Solo-builder angle:** “Ship packet”: given PO + drawing rev + MTR PDFs + inspection CSV, generate a revision-controlled C of C / FAI binder. Avoid full CMMC custody (kill criterion); sell the documentation layer at $99–299/mo.

### manufacturing-industrial-P6. Reshoring is sending RFQs to shops that cannot staff the work — 66% cannot hire technicians

- **Who hurts:** Contract manufacturers quoting OEM reshores; job shops turning down work for lack of bodies.
- **What happens now (workaround):** Overtime; vocational-school partnerships; saying no; Xometry overflow.
- **Frequency:** Continuous in 2026.
- **Evidence:**
  - ranked survey [qualitymag.com](https://www.qualitymag.com/articles/99902-new-survey-us-reshoring-momentum-builds-despite-policy-and-workforce-challenges) — 32% of CMs quoting reshoring (2× YoY); 66% hiring technicians “very difficult or crisis”; 94% of CMs lose orders to imports on price; 57% of OEMs name policy uncertainty #1 (Sept 9, 2026, fetched)
  - ranked survey [reshorenow.org PDF](https://reshorenow.org/content/pdf/2026_Reshoring_Survey_Report.pdf) — “Steel and aluminum tariffs created a net drag on CM competitiveness — roughly 57% of CMs report a negative impact”; import prices “often 30%+ below domestic bids” (2026)
  - ranked survey [themanufacturinginstitute.org](https://themanufacturinginstitute.org/manufacturers-need-as-many-as-3-8-million-new-employees-by-2033/) — 3.8 million needed 2024–2033; 1.9 million may go unfilled
- **Incumbent gap:** This is a labor market, not a software hole — but quoting speed (P1) and knowledge capture (P4) are the software-shaped edges of it.
- **Spend signal:** Lost orders to imports (94% of CMs); overtime and recruiter spend; 63% of OEMs plan 2026–27 US capex — demand is funded, supply is not.
- **Catalyst / trend:** 2026 tariff/policy uncertainty + China/Taiwan de-risking (53% of CMs cite geopolitical risk, up from 24%).
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 2 · reachability 3 · solo-buildability 2 · whitespace 2 · why-now 5
- **Solo-builder angle:** Do not build a staffing marketplace (cold-start kill). Build the capacity-aware quoter: “can we take this by Friday given current load + skill tags” — a scheduling/quoting sidecar, not a hiring app.

### manufacturing-industrial-P7. Customers send incomplete RFQs (STEP with no tolerances) and shops burn 30 minutes of estimator time before they can even start

- **Who hurts:** Estimators; also the OEM/startup buyers who wait days for a no-quote.
- **What happens now (workaround):** Email ping-pong for PDF+STEP+material+qty+finish; OCR quote setups; Xometry instant-quote as a customer-side bypass.
- **Frequency:** Most first-time RFQs.
- **Evidence:**
  - community [reddit.com/r/CNC/comments/1tijhtn](https://www.reddit.com/r/CNC/comments/1tijhtn/feedback_wanted_ai_rfq_intake_tool_for_cnc/) — “customers often send incomplete or unclear RFQs, and shops have to spend time going back and forth”; reply: “The useful part is forcing customers to give you dimensions, material, quantity, finish, deadline, and actual usable files before a human burns 30 minutes on it.” (snippet, 2026)
  - community [reddit.com/r/CNC/comments/1o20pyl](https://www.reddit.com/r/CNC/comments/1o20pyl/help_with_sending_file_to_a_cnc_business/) — shop asked for PDF not STEP; “A step file won’t contain the info needed to quote… namely tolerances, markings, thread call outs, material” (snippet)
  - consumer/community [reddit.com/r/AskEngineers/comments/w5zdxn](https://www.reddit.com/r/AskEngineers/comments/w5zdxn/how_do_you_calculate_the_cost_for_cnc_machining/) — engineers guessing $100/hr or using Xometry/Hubs because shops are slow/expensive (older thread; pattern persists)
- **Incumbent gap:** Paperless Parts RFQ portal helps larger CMs; 5-person shops still take email attachments. Xometry solves the buyer side and skims the shop.
- **Spend signal:** 30 minutes of estimator time per incomplete RFQ, at shop rates commonly $100–125/hr on r/Machinists.
- **Catalyst / trend:** AI intake tools being pitched in r/CNC in 2026 — demand is visible, category uncrowded at SMB price.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 5 · solo-buildability 5 · whitespace 3 · why-now 4
- **Solo-builder angle:** Embeddable RFQ checklist widget for the shop’s website (files + material + qty + GD&T + finish) that scores “quote-ready” before a human opens it. $29–79/mo.

## Vertical catalysts (dated)

- **Reshoring 2026:** 36% of OEMs reshored/actively reshoring (up from 29%); 32% of CMs quoting reshoring (up from 16%). Source: [2026 USA Reshoring Survey](https://www.qualitymag.com/articles/99902-new-survey-us-reshoring-momentum-builds-despite-policy-and-workforce-challenges) (Sept 9, 2026).
- **CMMC:** Phase I self-assessment in DLA solicitations from Nov 10, 2025; Phase II C3PAO originally Nov 10, 2026, **suspended July 13, 2026** while Phase I stays. Source: [DLA](https://www.dla.mil/Small-Business/Resource-Center/Cybersecurity-Resources/).
- **Retirement wave:** 3.8 million manufacturing jobs 2024–2033; ~2.8 million replacement; 1.9 million may go unfilled. MI/Deloitte; echoed in Deloitte 2026 outlook (institutional-knowledge capture as a 2026 use case).
- **Tariff refunds 2026:** SCOTUS IEEPA-tariff refunds flowing; many manufacturers not importer-of-record and may never recover. Secondary to job shops (they feel steel/aluminum 232 costs instead).

## Consumer flip-side

- Engineers and product teams cannot get a quote without a dimensioned PDF + individual STEPs; they bounce to Xometry/Hubs and pay a premium ([r/CNC](https://www.reddit.com/r/CNC/comments/1o20pyl/help_with_sending_file_to_a_cnc_business/), [r/AskEngineers](https://www.reddit.com/r/AskEngineers/comments/w5zdxn/how_do_you_calculate_the_cost_for_cnc_machining/)).
- Incomplete RFQs are the buyer’s complaint *and* the shop’s time sink (P7) — a B2B2C wedge is a shared intake form, not another marketplace.

## Sources that failed or came up thin

- **CNCZone** `site:cnczone.com quoting spreadsheet job shop` returned hobby router-build threads, not commercial quoting pain. Treat Practical Machinist as the high-signal forum instead.
- **IndustryWeek 2026 outlook** search errored once; substituted Deloitte 2026 outlook + Reshoring Initiative survey.
- **Excel quoting 2025 query** errored; older Practical Machinist quoting threads (2020) used as structural evidence and cross-checked against 2025–26 Reddit ERP/quoting threads.
- **G2/Trustpilot** block direct fetch; Fishbowl/JobBOSS mined via `site:g2.com` / Capterra snippets.
- **Paperless Parts list price** is unpublished; $10k+$18k/yr is a competitor (Tempus) claim — mark as secondhand.
- **CMMC Phase II pause (July 2026)** means “must certify by Nov 2026” pitches are stale; Phase I/NIST 800-171 evidence is still live. Vendor cost guides are sales-biased.
- HN Algolia `job shop quoting ERP` returned generic ERP stories, not shop-floor threads — low signal.
