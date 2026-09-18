# Agriculture — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** US family farms, specialty-crop growers, DTC meat/produce producers, and (lightly) ag retailers. Not Cargill-scale processors or commodity trading desks.
- **Searches/fetches performed:** 18 web searches + 6 direct fetches. AgTalk Precision Talk is high-signal for data; Machinery Talk for H-2A. CNC-style `site:cnczone` equivalent for ag is `site:talk.newagtalk.com`.

## Industry snapshot

- Buyers are owner-operators: they run Deere/CNH iron, Precision Ag in Operations Center + often FieldView, and still file USDA paper at an FSA/NRCS office that may have no local staff.
- 2026 climate: farm income pressure + AEWR wage jumps; H-2A volume already **+17% YoY in FY2026** with <0.07% of those jobs drawing a domestic applicant ([Farm Bureau](https://www.fb.org/intel/policy/securing-agricultures-workforce)). NRCS lost **23% of staff Jan 2025–Jan 2026**; 141 counties have **zero** local NRCS staff ([NSAC](https://sustainableagriculture.net/blog/usda-staffing-crisis-widespread-loss-of-conservation-staff/)).
- Incumbents: John Deere Operations Center (free, equipment-tethered; Sept 1 2026 “JD” AI assistant), Climate FieldView ($1,500–$5,000+/yr typical — third-party comparison), Granular split/discontinued as a unified product (Corteva 2022), Local Line ($99–$399/mo, no commission), GrazeCart ($89/mo Starter; Growth quote-only).
- Money already spent: H-2A all-in commonly **~$21k–$24k per worker per season**; US agents **$1,500–$3,500 per application**; AgTalk farmer: **“~$2,500-ish per man”** for clearance plus **~$25/hr loaded** against ~$18 AEWR. DTC farms pay Local Line $950–$3,830/yr to escape email/phone orders.

## Top problems

### agriculture-P1. H-2A is the only legal seasonal labor path and it is a three-agency paperwork tax — farmers pay $1.5k–$3.5k per filing plus ~$2.5k/worker just to start

- **Who hurts:** Specialty-crop, dairy-adjacent, harvest, and packing operations that cannot find domestic crews; 2% of farms use H-2A but they are the ones feeding grocery produce.
- **What happens now (workaround):** Farm labor contractors / placement agencies (MAS Labor, PSG, USA Farm Labor); associations as “paperpushers”; some farms quit the crop.
- **Frequency:** Seasonal filing cycle (start 60–75 days before need); year-round for dairy if SAWA passes.
- **Evidence:**
  - community [talk.newagtalk.com H2a workers](https://talk.newagtalk.com/forums/thread-view.asp?mid=10945711&tid=1178625) — MaineFarmer: “I would cease to exist with out the H2a program… It cost me huge$$ in legal fees… You have to figure the cost of clearance etc(2500$ ish) per man. Housing /comp etc. Our cost is about 25$ per hour per man with an AEWR of 18 $ ish… I suggest a very good recruiter/association or you will be bawling at times.” (Oct 30, 2024)
  - community [talk.newagtalk.com](https://talk.newagtalk.com/forums/thread-view.asp?mid=11029790&tid=1185154) — MN farmer: “I pay for their flights and all program expenses, about $3000/guy… I completely gave up on local help.” (snippet)
  - community [reddit.com/r/farming/comments/177z9vg](https://www.reddit.com/r/farming/comments/177z9vg/h2a_discussion_how_do_you_use_them/) — “Use a contractor to do it. Saves a lot on paperwork, and there’s a lot of paperwork.” / “h2a is necessary but ridiculously expensive… now h2a looks like it will bankrupt us.” (Oct 2023; echoed in 2024–26 threads)
  - community [reddit.com/r/farming/comments/1cs31zy](https://www.reddit.com/r/farming/comments/1cs31zy/what_are_your_experiences_with_h2a_visas/) — “A lot of paperwork and it isn’t a very cheap process, but so far has been very worth it to us.” (May 2024)
  - ranked/policy [fb.org](https://www.fb.org/intel/policy/securing-agricultures-workforce) — “The involvement of three Cabinet-level departments (Labor, Homeland Security, State) and various state agencies that poorly communicate… delays, backlogs and other inefficiencies have become too common.” FY2026 H-2A use “already up 17% in volume” (fetched 2026)
  - academic/WTP [wilsoncenter.org H-2A Reform Scenarios, Philip Martin](https://www.wilsoncenter.org/sites/default/files/media/uploads/documents/H-2A%20Reform%20Scenarios.pdf) — recruiters $100–$250/worker; “$1,500 to $3,500 per contract in agent or attorney costs”; extra cost vs unhoused US worker “about $5,000”; total ~$21,250 per six-month worker (Feb 6, 2025, fetched)
  - primary [farmers.gov](https://www.farmers.gov/working-with-us/h2a-visa-program) — standard process “60 and 75 calendar days”; SWA job order + DOL FLAG ETA-9142A + USCIS I-129H2A + consulate
- **Incumbent gap:** Agencies sell the full labor product. No cheap software owns the *document packet + deadline clock* across DOL/USCIS/State/housing inspection for a 5–20 worker family farm that does not want an FLC.
- **Spend signal:** $1,500–$3,500/application agents; $2,500–$3,000/worker clearance+travel; loaded cost ~$25/hr; USA Farm Labor: “total costs per worker on average run $5,000 per season” (non-wage).
- **Catalyst / trend:** SAWA (introduced June 30, 2026) would year-round H-2A + AEWR caps + “online platform as a single point of access” — if it stalls, the paperwork tax stays; if it passes, dairy enters the market.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 4 · solo-buildability 3 · whitespace 4 · why-now 5
- **Solo-builder angle:** H-2A “filing cockpit” for 5–40 worker farms: checklist against FLAG/USCIS dates, housing/WC/recruitment docs, NOD response drafts. Do not custody immigration filings as attorney-of-record (compliance kill). Charge $99–299/season vs $1.5k–$3.5k agents for the paper-only slice.

### agriculture-P2. Conservation and FSA money is on the table but NRCS/FSA staffing collapsed — farmers wait 2.5 years and pay 8% interest while EQIP payments sit

- **Who hurts:** Family farms applying for EQIP/CSP; beginning-farmer FSA loan borrowers.
- **What happens now (workaround):** Drive 45 minutes to a remaining office; slide paper under the door; phone-tag; skip programs.
- **Frequency:** Annual batching deadlines; multi-year contract certs.
- **Evidence:**
  - trade [dtnpf.com](https://www.dtnpf.com/agriculture/web/Ag/columns/washington-insider/article/2026/08/13/usda-staffing-shortages-strain-fsa) — MN farmer LaPlante “nearing 2.5 years in [the EQIP] planning process”; “Payments that once arrived almost immediately have taken months… expects to soon pay 8% interest on loans while waiting for NRCS payments.” WI: “farmers slide paperwork under the door” (Aug 13, 2026, snippet)
  - ranked analysis [agri-pulse.com](https://www.agri-pulse.com/articles/24870-oversubscription-in-eqip-csp-increased-in-fiscal-2025-analysis-finds) — FY2025 awards: **24% of EQIP** and **37% of CSP** apps (down from 43%/54%); NRCS staff 11,861 → 9,078 (Jan 2025–Jan 2026). Farmer: “it could be a week before you hear something back, and that’s not time-efficient, especially when you’re working with deadlines.” (2026)
  - ranked [sustainableagriculture.net](https://sustainableagriculture.net/blog/usda-staffing-crisis-widespread-loss-of-conservation-staff/) — “NRCS lost 23% of its staff… 141 counties now entirely without local NRCS staff”
  - community [talk.newagtalk.com Equip and fsa new farmer loan](https://talk.newagtalk.com/forums/thread-view.asp?mid=7378101&tid=840999) — “tons of paperwork all the time… over half of the paper work I did the month before and I had to do it all over again because they said it was out dated already. It took 4 mouths to get the shed loan… you had to pay for things up front and then you turn in the invoices… a month later they refund” (snippet; older but matches 2026 DTN pattern)
- **Incumbent gap:** USDA eForms exist; they do not package a complete, rejection-proof EQIP/FSA packet or track Treasury payment aging. TSPs (technical service providers) are the human workaround and are scarce.
- **Spend signal:** 8% interest on operating loans while waiting; EQIP cost-share is five-figure per practice — farmers already budget for it and then finance the float.
- **Catalyst / trend:** 23% NRCS cut 2025–26 plus FY2026 batching still running (e.g. SD Oct 3, 2025 deadline).
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 4 · why-now 5
- **Solo-builder angle:** “EQIP-ready packet”: farm records checklist + CPA-1200 companion + practice photo/evidence log that matches NRCS cert requirements, with a payment-aging tracker. $29–79/mo via Farm Bureau county pages and AgTalk.

### agriculture-P3. Farm data is split across Deere Operations Center and FieldView — growers still USB-stick scripts and cannot merge the same acres

- **Who hurts:** Mixed-fleet and Deere-heavy row-crop farms; agronomists serving them.
- **What happens now (workaround):** USB/thumb drives; JD Data Manager `.jddm` exports; pay both stacks; Leaf/FieldMCP-style bridges if they have a consultant.
- **Frequency:** Every planting/spray/harvest season.
- **Evidence:**
  - trade [morningstar.com / Business Wire](https://www.morningstar.com/news/business-wire/20260223111948/bayer-john-deere-further-integrate-fieldview-and-operations-center-to-improve-customer-experience-for-2026-season) — “For many customers, moving scripts from the office to the cab has required downloading files to thumb drives, physically transporting them to multiple fields… The enhanced integration… eliminates the need for thumb drives” (Feb 23, 2026). Capability first limited to Preceon Ground Breakers, then “broad U.S. launch.”
  - trade [fieldmcp.com](https://www.fieldmcp.com/blog/fieldview-deere-side-by-side-building-cross-provider-agronom) — “The combine is green. The agronomist logs scouting notes in FieldView. The data never crosses the gap unless someone manually exports and re-imports CSV files, which nobody does consistently.” (snippet)
  - community [talk.newagtalk.com importing from one ops center to another](https://talk.newagtalk.com/FORUMS/thread-view.asp?mid=11538415&tid=1228097) — “Go to Files Work Data… Download all files as .jddm file type. Then download the John Deere data manager tool…” (Feb 3, 2026)
  - community [talk.newagtalk.com QGIS and Operation Center](https://talk.newagtalk.com/forums/thread-view.asp?mid=10417085&tid=1130615) — “Op Center won’t import yield data as shape file. It only likes to import ‘raw’ monitor data from the supported brands” (Sept 26, 2023; still cited as constraint)
  - trade [investigatemidwest.org](https://investigatemidwest.org/2026/09/16/john-deere-dominates-farm-machinery-now-its-moving-deeper-into-farm-data-and-ai/) — Deere ~35% of US ag machinery sales; Sept 1, 2026 JD AI assistant inside Operations Center; Farm Action July 2026: OEMs becoming “technology platforms… expanding dominant firms’ control across the digital stack” (Sept 16, 2026, fetched)
- **Incumbent gap:** 2026 Bayer–Deere wireless script transfer is real but late and program-gated; it does not give the farmer a vendor-neutral archive. Granular Agronomy is dead (2022), so the “independent FMS” option shrank.
- **Spend signal:** FieldView $1,500–$5,000+/yr (third-party 2026 comparison) *plus* Deere ecosystem lock-in; USB labor and mis-applied scripts are the silent cost.
- **Catalyst / trend:** JD AI (Sept 1, 2026) deepens the data gravity well the same month Farm Action warns about platform consolidation.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 3 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** Farmer-owned “field packet”: scheduled export of Op Center + FieldView work data into shapefile/GeoJSON the grower actually controls, with a simple as-applied vs prescription diff. Avoid depending on one OEM API as sole wedge (hostile-platform kill).

### agriculture-P4. A $400k–$800k machine still goes limp on a sensor until a dealer tech is free — harvest does not wait

- **Who hurts:** Farmers in harvest/planting windows; independent repair shops that cannot reset codes.
- **What happens now (workaround):** Unplug/disable sensors when possible; keep backup iron; wait days/weeks for Deere tech on DEF sensors; pay dealer.
- **Frequency:** Episodic, catastrophic when it hits during harvest.
- **Evidence:**
  - primary [ftc.gov](https://www.ftc.gov/news-events/news/press-releases/2026/07/ftc-states-secure-settlement-deere-company-advancing-farmers-right-repair) — settlement July 8, 2026: Deere must provide farmers and independent shops the same repair resources as dealers for 10 years, including “Reading, clearing and resetting electronic fault codes,” reprogramming/pairing, “Restarting a machine following an emissions-related shutdown (commonly referred to as ‘limp mode’).” Lawsuit alleged “service delays and higher costs.” (fetched)
  - community [reddit.com/r/farming/comments/1hdawvw](https://www.reddit.com/r/farming/comments/1hdawvw/canadas_new_righttorepair_laws_good_news_for/) — “Imagine you’re in the middle of grain harvest, and a minor issue like a faulty fuel sensor brings your combine to a halt. Often times, we cannot afford to wait for dealership technicians who may be booked for days or weeks out.” Reply: “the last combine it went twice and that requires a JD tech and can’t be ignored.” (snippet, ~Dec 2024)
  - community [reddit.com/r/farming/comments/eyogqx](https://www.reddit.com/r/farming/comments/eyogqx/right_of_repair_from_the_point_of_view_of_a/) — “I have changed parts out and still had to have dealership out to calibrate. Things should not be this way. For the price that I pay for equipment…” (snippet; structural)
  - community [reddit.com/r/farming/comments/1f52k8u](https://www.reddit.com/r/farming/comments/1f52k8u/farmers_how_do_you_decide_repair_or_replace/) — “Dealer calls can add up really really quick.” / “Our older Patriot sprayer has been waiting for months on a charge pump” (snippet, 2024)
- **Incumbent gap:** FTC order requires access “on fair and reasonable terms” (license/subscription/purchase) — Deere still sells the tool (Operations Center PRO Service). The UX/training layer for independents and owners is unbuilt. Order sunsets in 10 years.
- **Spend signal:** Dealer service during harvest is a multiple of the sensor; downtime is lost crop. Exact 2026 dealer-hour rates not captured in this run.
- **Catalyst / trend:** FTC+5-state stipulated order July 8, 2026; staged tool access through Dec 31, 2026.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 4 · why-now 5
- **Solo-builder angle:** Independent-shop “PRO Service companion”: fault-code playbooks, parts pairing checklist, and a harvest-priority dispatch board — sell to IRPs now that the legal lock is off. Do not reverse-engineer Deere binaries.

### agriculture-P5. DTC meat/produce still runs on email + phone — variable-weight cuts, custom butcher orders, and CSA boxes oversell and eat 5–10 hours/week

- **Who hurts:** Livestock farms selling halves/quarters and cuts; CSA growers; on-farm stores.
- **What happens now (workaround):** Email/phone orders; spreadsheets; Square at market unsynced to online; Local Line / GrazeCart if they can pay $89–$199/mo.
- **Frequency:** Weekly order cycles.
- **Evidence:**
  - vendor case [localline.co/blog/lonely-lane-farms](https://www.localline.co/blog/lonely-lane-farms) — Patty Kloft: “Orders were getting lost and errors were common.” “The ability to easily bill our customers, so I’m not tracking down payments.” Sales +25%; “saves us so much time from no longer having to download PDFs and emails.” Team saves **5 to 10 hours a week**. (July 30, 2026, fetched)
  - vendor [grazecart.com/blog/custom-butcher-orders](https://www.grazecart.com/blog/custom-butcher-orders) — “Relying on a combination of handwritten notes, emails, and your memory is a recipe for mistakes… Generic point of sale (POS) systems built for retail stores simply aren’t designed to handle this level of complexity, leaving you stuck with spreadsheets” (snippet)
  - WTP [localline.co/suppliers/pricing](https://www.localline.co/suppliers/pricing) — Core $99/mo or $950/yr; Premium $199/mo; Ultimate $399/mo; **no commission**; subscriptions add-on $29/mo on Core (2026)
  - WTP [grazecart.com/pricing](https://www.grazecart.com/pricing) — Starter **$89/Month**; Growth/Premium quote-only (fetched via search)
- **Incumbent gap:** Shopify/Square cannot do hanging-weight → final-cut true-up. Local Line and GrazeCart exist and are liked — whitespace is thinner here than H-2A/EQIP, but **custom butcher cut-sheets + processor coordination** is still spreadsheet-land for many.
- **Spend signal:** $89–$399/mo already paid; 5–10 hours/week recovered is the revealed WTP.
- **Catalyst / trend:** None dated — structural DTC growth; processor bottlenecks make preorders and deposits mandatory.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 2 · why-now 3
- **Solo-builder angle:** Not another farm storefront. A **processor-linked cut-sheet + deposit + hanging-weight true-up** tool that emails the locker plant a standardized sheet and bills the customer the delta. $39–79/mo.

### agriculture-P6. AEWR and H-2A wage methodology swung again for 2026–27 — specialty-crop labor cost is now a planning risk, not a line item

- **Who hurts:** H-2A-dependent fruit/veg/livestock farms in states with double-digit AEWR jumps.
- **What happens now (workaround):** Build uncertainty into bids; cut acreage; lobby SAWA’s 3.25% cap.
- **Frequency:** Annual DOL release; mid-contract changes historically.
- **Evidence:**
  - trade [fb.org AEWR 2026-2027](https://www.fb.org/intel/markets/aewr-changes-for-2026-2027) — “this set of AEWRs is the first full-year” under the new IFR; “A double-digit AEWR increase in a state like Kansas, Nebraska or Louisiana flows directly into per-acre production costs”; SAWA would cap YoY increases at 3.25% (snippet)
  - policy [fb.org workforce](https://www.fb.org/intel/policy/securing-agricultures-workforce) — AEWR up 60% in a decade vs 49% private-sector wages; “farmers cannot pay for increased labor costs by raising their prices”
  - community [reddit.com/r/farming/comments/177z9vg](https://www.reddit.com/r/farming/comments/177z9vg/h2a_discussion_how_do_you_use_them/) — “Now they jack the price like crazy… now h2a looks like it will bankrupt us.”
- **Incumbent gap:** Payroll systems know the current AEWR; they do not model contract-level loaded cost (housing + transport + 3/4 guarantee + skill-level II) for next season’s planting decision.
- **Spend signal:** Loaded ~$25/hr vs $18 AEWR on AgTalk; USDA-derived extra ~$5,000/worker/season (Martin 2025).
- **Catalyst / trend:** Oct 2025 DOL IFR; 2026–27 first full year; SAWA June 2026.
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 3 · reachability 3 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** Per-contract H-2A cost calculator (AEWR by state/skill + housing + transport + agent + 3/4 rule) that outputs a per-acre labor budget. Cheap, reachable via AgTalk; pairs with P1.

## Vertical catalysts (dated)

- **FTC–Deere right-to-repair settlement — July 8, 2026.** 10-year order; limp-mode restart and fault-code tools to owners/IRPs. [ftc.gov](https://www.ftc.gov/news-events/news/press-releases/2026/07/ftc-states-secure-settlement-deere-company-advancing-farmers-right-repair)
- **Deere “JD” AI assistant in Operations Center — Sept 1, 2026.** Deepens data platform lock-in. [investigatemidwest.org](https://investigatemidwest.org/2026/09/16/john-deere-dominates-farm-machinery-now-its-moving-deeper-into-farm-data-and-ai/)
- **Bayer–Deere FieldView script→Work Plan wireless — Feb 23, 2026** (phased). [Business Wire via Morningstar](https://www.morningstar.com/news/business-wire/20260223111948/bayer-john-deere-further-integrate-fieldview-and-operations-center-to-improve-customer-experience-for-2026-season)
- **NRCS −23% staff Jan 2025–Jan 2026; EQIP award rate 24% in FY2025.** [NSAC](https://sustainableagriculture.net/blog/usda-staffing-crisis-widespread-loss-of-conservation-staff/) / [Agri-Pulse](https://www.agri-pulse.com/articles/24870-oversubscription-in-eqip-csp-increased-in-fiscal-2025-analysis-finds)
- **SAWA introduced June 30, 2026** (year-round H-2A, AEWR caps, one-stop portal). [Civil Eats](https://civileats.com/2026/06/30/house-agriculture-chair-introduces-controversial-farm-labor-bill/) / [Farm Bureau](https://www.fb.org/intel/policy/securing-agricultures-workforce)
- **AEWR 2026–27:** first full year under Oct 2025 IFR. [Farm Bureau](https://www.fb.org/intel/markets/aewr-changes-for-2026-2027)

## Consumer flip-side

- CSA members accept shared production risk but complain when boxes fail; LocalHarvest notes a handful of “unacceptable” CSA seasons per year ([localharvest.org/csa](https://www.localharvest.org/csa/)). Thin 2025–26 complaint set in this run — do not overclaim.
- Meat-box brands (e.g. Good Chop threads) show consumers hate wrong cuts, quality fade, and hard-to-cancel subscriptions — a warning for DTC farms that oversell or lock billing. Direct farm DTC complaints were thinner than photographer-ghosting in the creator vertical.
- Harvest downtime from unrepaired equipment raises food prices downstream (FTC’s own framing of the Deere case).

## Sources that failed or came up thin

- **r/farming Deere Operations Center data-ownership** queries mostly returned older right-to-repair threads, not 2026 Op Center export gripes. Interop evidence is stronger on **AgTalk Precision Talk** and trade (FieldMCP, Bayer–Deere PR) than Reddit.
- **Ag retailer software (Agvance/Agrian/Bushel)** community complaints were thin this run; ERP Research 2026 pricing ($18k–$120k/yr small ag ERP) is vendor-adjacent, not practitioner pain. Flag as **lower-confidence**.
- **Granular shutdown fallout:** confirmed as 2022 product split (WiseYield 2026 roundup), not a fresh 2026 crisis.
- **CSA/farmers-market consumer complaints 2025–26** did not yield a dense primary set; LocalHarvest is undated-pattern.
- **DOL FLAG processing times** page fetched: complete H-2A cases ~18 calendar days as of Aug 29, 2026 — delays are more about *incomplete packets and three-agency sequencing* than DOL queue length right now.
- G2/Trustpilot blocked; no Agvance review-gap pack.
