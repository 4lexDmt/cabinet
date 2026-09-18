# Lane B deep-dive: 5–50 person CNC job-shop quoting (PDF → checklist → priced quote)

- **Problem:** manufacturing-industrial-P1. Owner-estimators quote from PDF drawings in Excel + head; RFQs sit days; bids lost on speed.
- **Wedge as scoped:** $99–149/mo self-serve quote assistant for 2.5-axis milling/turning. LLM vision extracts dims/tolerances/material into an estimator-confirmed checklist; shop rates produce setup/cycle; output = priced quote PDF + traveler.
- **Researched:** 2026-09-18. ~45 distinct searches/fetches. Builds on `02`, `06`, `08`, `09` — does not repeat their Paperless/Tempus umbrella story.
- **Stress-test inheritance:** PAY 71.4, near-fly; **weak purchase trigger is the primary hunt below.**

---

## 1. Workflow anatomy

RFQs arrive as **email attachments**, not portals, at the 5–50 person shops in scope. Mix (no census; triangulated from PM/Reddit + vendor intake pages): **PDF drawing is the quoting document**; **STEP is the CAM document**; paper/fax scans still appear on legacy/repeat work. r/CNC (2026) is explicit: “A step file won’t contain the info needed to quote… namely tolerances, markings, thread call outs, material.” Makerstage’s 2026 RFQ guide (buyer-side) still tells engineers to send **both** STEP + ASME Y14.5 drawing; shops that get PDF-only pad 15–25% or no-bid (vendor/content site). Paper RFQs are a shrinking tail, not zero — Paperless Parts’ own accuracy note (May 2026): Wingman “performs best on cleanly exported PDFs and may not work well on hand-written or heavily degraded documents.”

**Pipeline (hours burn in bold):**

1. **Intake.** Forwarded email + 1–N PDFs, sometimes STEP, sometimes a notes thread. 10–60 min (Mavlon “True Cost of a Quote,” vendor briefing). Incomplete packages (P7) burn ~30 min before estimating even starts (r/CNC 2026).
2. **Triage / no-bid.** Capability, capacity, certs, “is this a customer we want.” 20–30 min (Phosai Labs case, vendor). Mavlon: **10–25% of RFQs never quoted** because the desk ran out of bandwidth — not because they were bad fits. (snippet, consultant-measured, n unpublished)
3. **Drawing extraction.** Read title block, notes, GD&T, finishes, inspection. **20–150 min** — the largest variable. This is the wedge’s extraction surface.
4. **Material.** McMaster/Online Metals as same-day proxy; mill/distributor call for production lots and 232-affected alloys. ~10 min on commodity bar/plate; **hours if heat-treat spec + certs**.
5. **Routing + setup/cycle.** Feature-count + tribal memory, not CAM. PM thread “how do you calculate time” (structural): break ops (face, drill, tap, profile), add 5–15% tooling, ×1.15 “forgotten things.” CNC Optimization Solutions: experienced estimators ±20% on cycle; AI feature-recognition vendors claim ±10–15% on **prismatic** work only (vendor).
6. **Outside processes.** Heat treat, anodize, grind, plating, NDT — estimator emails finishers; **elapsed days, not minutes.** Complex parts wait here. Penta Precision (UK shop, n=346 quotes, Jan–Jul 2026): new parts median **3 working days**, repeats **1.5**.
7. **Margin / price.** Market-will-bear overlay on cost-plus. PM: “I bent the numbers around.” Excel exists so the owner can still fudge.
8. **Quote letter.** Re-type into branded PDF. Setell (vendor) splits a 60-min quote as ~10 min judgment + 50 min retrieval/formatting.
9. **Follow-up.** *The Fabricator* (job-shop study, 1,794 RFQs / 1 year): **>50% of winning bids came back as POs within 3 days of quote send.** Shops that treat “send” as done leave money on the table.

**Elapsed vs touch.** Typical shops: 2–4 business days elapsed, 1–4 hours touch on mid-complexity (MFG Calcs; Forgepoint Apr 2026). Owner-estimator shops stretch elapsed because quoting competes with running a machine. World-class desks: <24h. Penta’s 2-day median is the fast end of *reviewed* quoting.

**Win-rate vs speed (treat as directional; most sources are vendors):**
- Forgepoint (Apr 2026, vendor): “78% of customers buy from the first responder” — **this is cross-industry lead-response research, not a CNC census.** Same article: manual quoting 3–4 days; systematic 2–4 hours; 55% of manufacturers take >5 days; 30% never respond (unverified original study citation).
- MFG Calcs (calculator vendor): open-market win **20–35%**; incumbents **40–60%**; cutting 4 days → 1 day “can lift win rate 5–10 points.”
- GoAutonomous (Jun 2026, vendor): step-function drop at **4h and 24h**; illustrative 35% win at <4h vs 20% at 48h — **modeled, not a shop survey.**
- *The Fabricator* 3-day PO window is the strongest **non-quoting-software** datapoint: speed after *send* also matters.

---

## 2. Persona map

| Band | Who quotes | How it actually works |
|---|---|---|
| **~5 people** | Owner-estimator (often also programmer/operator). “Me and my father.” | Excel + head. Quotes wait until the spindle is free. Highest elapsed-time pain, lowest software budget, highest distrust of black boxes. |
| **~20 people** | Still one senior person; maybe a junior “helping.” Owner still signs price. | Spreadsheet + quote log. First shops that *demo* Paperless/AMFG and bounce on price/setup. Succession risk appears (the senior is 50s–60s). |
| **~50 people** | Dedicated estimator or engineer-who-quotes; sometimes 2. | ERP quoting (JobBOSS²/E2) or Paperless. Pain shifts from “I can’t quote” to “inconsistent quotes / junior can’t be trusted / ERP double-entry.” |

Three personas, one buyer:
- **Owner-estimator (ICP).** Card + authority. Buys only when quoting is stealing floor time *or* a named event hits (see §6).
- **Dedicated estimator.** User, not buyer, unless the owner is in the demo. Optimizes for “don’t make me look stupid on a missed callout.”
- **Engineer-who-quotes.** Cares about GD&T fidelity and DFM flags more than pretty PDFs.

**P4 adjacency (retiring estimator):** HarborWind (Apr 2026) — 44% of critical machinists 56+; quoting instincts leave with them. Paperless case studies *are* this story: Hillside Custom’s estimators retired, quote time was **two weeks**, they couldn’t hire replacements into a pen-and-paper process; Fabcor — father retired, quoting was “all-day, all-night,” son bought Paperless. **This is the documented purchase trigger, not “we’d like to be faster someday.”**

---

## 3. Root causes (why Excel persists)

1. **Costing logic is the shop’s secret sauce.** Every rate table, setup assumption, and “this customer always pays X” is different. Paperless itself: “AI does not generate or suggest shop-specific pricing.” Tools that hide the math lose. PM: “All my inputs come from experience… Every highlighted box needs to be filled.”
2. **Fear of a wrong quote > fear of a slow quote.** Under-price a titanium 5-axis and you eat the job; over-price and you only lose the bid. Community default: better late and right. Forgepoint notes complex work *should* take 3–5 days or buyers “wonder what you missed.”
3. **Incumbents are packaged for bigger shops.** Paperless: 10–12 week onboard, custom quote, no public price, “3x ROI” framing. AMFG quoting from **$7,950/yr** + one-off onboarding. DigiFabster $2k–50k/yr (vendor) + 4.99% processing on Essential/Growth. The $500 Kipware perpetual license is the historic “in-between,” and PM reviews said it crashed / wasn’t tweakable / they went back to Excel.
4. **Black-box AI is culturally radioactive.** r/Machinists “Is anyone using AI for quoting?” (2025): “terrible idea,” “GPT alone can’t quote.” r/CNC (2026) on auto-quoters: “your tool is going to be a bit of a black box… I have to trust it”; useful role is **intake/checklist, not unattended price**.
5. **Switching cost is tribal, not technical.** Excel is the only system that already contains 15 years of “what we charged last time.”

---

## 4. Quantification

**Time / volume (prefer non-vendor; still thin):**

| Source | Hours/quote | Quotes/week | Notes |
|---|---|---|---|
| Mavlon (vendor briefing) | median **2.5–3.5h**; range 1.1–7.3 | — | Fab-leaning; drawing extraction 20–150 min |
| Phosai Labs (vendor case) | mid 2.5–4h; complex 4–6h; simple 90 min | estimator capacity **8–10**, RFQ inflow **15–25** | One manufacturer |
| MFG Calcs | target <2h routine | **15–40** per estimator | Cost/quote **$75–$400** |
| Setell (vendor) | 60 min typical, 10 of it judgment | ~30 quotes/mo on a $500k shop (worked example) | Illustrative |
| Penta Precision (shop primary, UK, n=346, 2026) | — | — | Median **2 working days** elapsed |
| Ergini (consultant scenario) | morning for multi-part | 40 RFQs/wk, 2 estimators | Not a survey |

**Win rates:** 20–35% open market (MFG Calcs; Mavlon cites FMA fab benchmarking ~25–30% — **FMA primary not re-fetched**). >70% = underpricing. <15% = misfit.

**Cost of a lost bid:** no non-vendor average. Setell’s $500k-shop model: 25% → 32% close on 30 × $3k quotes ≈ **+$75k/yr** (vendor arithmetic). A single mid-size CNC job is commonly a few thousand to low tens of thousands; losing on speed is one job, not a rounding error — but shops don’t *see* it (GoAutonomous: buyers say “we went with another supplier,” not “you were slow”).

**Estimator labor (2026 postings + BLS):**
- BLS OEWS May 2025, SOC 13-1051 Cost Estimators: national median **$78,740–$78,749/yr** ($37.86/hr); P25–P75 ~$61k–$102k. **This is all industries (construction-heavy), not machine-shop-specific.** Manufacturing-industry breakout not pulled from the XLSX.
- Shop postings 2026: Wagner Machine $65–85k; Collins Mfg $75k; Hilton Tool $80–100k; Ascentec $47–78k; Michael Page machining cost engineer $90–120k.
- Fully loaded Mavlon: $45–70/hr. At 3h × $55 = **$165 direct cost per quote**; at 25% win, **~$660 estimating labor per won job**.

**Outsourced estimating:** Freelancer RFQ (2026) budget **$30–$250/quote**, 24–48h, itemized PDF/Excel — a human substitute at the same price as a month of Tempus. CloudNC Quote Agent: **$2.40–$3.75 per analysed part** on paid tiers. Zenith: **$49/print** or **$999/mo** for 100 prints.

---

## 5. Solution landscape, deep

For each: price · extracts vs estimator input · 1–3★ themes. (G2/Capterra often snippet-only.)

**Paperless Parts.** Capabilities: CAD interrogation, configurable costing (Excel-formula analog), RFQ inbox, digital quotes, ERP push (JobBOSS², E2, Fulcrum, Epicor, Global Shop, ProShop, QBO…), **Wingman 2.0** print intelligence (GD&T, finish, BOM). 800+ shops (vendor). Price: **unpublished**; Tempus still cites **$10k setup + $18k/yr** (competitor, 2026 page); Paperless says third-party prices “are not accurate,” scopes on size/modules/integrations/contract, “≥3x ROI,” 10–12 week onboard, **not seat-priced**. Extracts: geometry + Wingman drawing parse; estimator reviews, applies **shop** pricing (AI does not suggest prices). Reviews: Capterra **4.9/25**; G2 **4.6/105**. Themes: setup/tweak time; “~10 clicks per part”; “very expensive, requires experts”; limited sales-data export; file-size/cloud crashes (SoftwareFinder snippets). 5★: speed, missed-feature catch, professional quotes.

**Tempus Tools.** Scope: **laser / plasma / waterjet / tube / sheet + fold/weld/coat.** A “machine shops” marketing page exists; FAQ and vs-Paperless page still say **laser & fab**, not mill/turn feeds-and-speeds. **No CNC milling/turning roadmap found.** Price (fetched): Starter **$75/mo annual / $100 monthly**, Regular $225/$300, Advanced $375/$500; extra quoting users 50% off; **no setup fee**; 20 quotes/mo on Starter. Extracts: geometry from 70+ file types + PDF-to-CAD (Regular+); estimator sets rates/rules. Reviews: customer quotes on-site (MSG: two people → one in a quarter of the time). Independent 1–3★ corpus **thin**.

**AMFG.** CNC mill/turn + additive. Sentinel AI: 2D title block/GD&T in “<3 seconds,” fused to 3D. Price (fetched): Quoting **from $7,950/yr**; Quoting & Production **from $14,950/yr**; also lists **$59/user/mo**; **one-off onboarding**. Extracts: CAD cycle/setup + PDF GD&T; estimator adjusts. Capterra 4.9/10; G2 4.3/45. Themes: steep setup/learning curve; heavy UI; onboarding fee.

**DigiFabster.** Instant CAD quote + e-commerce. Price: Essential/Growth **contact sales** (vendor elsewhere: $2k–50k/yr); Growth+Marketing **$990/mo**; **4.99% + banking** Essential/Growth, 0.99–1.99% Enterprise; ITAR AWS hosting = **paid add-on**. Capterra **2.0/2** — “outrageous prices for simplest parts” (2021), weak implementation (2023). G2 4.3/118. Theme: black-box pricing that doesn’t match the shop.

**Costimator / MTI.** 300+ cost models; with or without 3D. Price unpublished; Madgeek 2026 puts **$10k–$30k/yr** (third-party). Perpetual or subscription. 3DFX mixed. Not self-serve SMB.

**SecturaFAB (Stella Source).** Metals/fab CPQ + true-shape nesting. Timbercloud 2026: **$500–$1,800/mo** unlimited users + unquantified transaction fees (third-party). Not a mill/turn PDF assistant.

**Kipware (Kentech).** QTE + CYC **$495 each**, lifetime, 2 seats, **no internet**. Estimator inputs ops/times; CYC is a cycle calculator, not vision. PM thread: reasonable price, crashes, lost quotes, production-oriented, people revert to Excel. “KipAssist AI” is a 2026 bolt-on — **unverified quality**.

**CADDi (US).** Drawer = drawing similarity search + ERP-linked history (Chicago/Tokyo). Quote = **buyer-side procurement** (supplier select, bid compare) — **not a job-shop quoter.** US case: search 30 min → 1–2 min (vendor). Price unpublished; enterprise motion. ITAR listed as an access-control capability on platform page (unverified depth).

**MRPeasy.** ERP with quoting, not a drawing parser. **$49 / $69 / $99 / $149 per user/mo.** Auto cost & delivery from BOM/routing the shop already maintains. Wrong layer.

**Fulcrum.** Unlimited-user ERP; quoting from BOM/routing + DXF nest. Price unpublished (“based on revenue” in prior research). Not PDF-vision.

**2025–26 AI-quoting entrants (the slot is no longer empty):**

| Entrant | Price | What it is | CNC PDF-first? |
|---|---|---|---|
| **CloudNC Quote Agent** | Free 10 parts; Starter **$50 / $100**; Pro from **$200**; ~$2.40–3.75/part | CNC mill/turn/mill-turn; CAD+PDF+email inbox; DFM; **draft quote estimator edits**; **explicitly: do not upload export-controlled data** | Closest funded occupant of the wedge |
| **Setell** | Free 3 quotes/mo; Business **$49**; Pro **$99** | RFQ email + CAD/PDF → draft lines; learns from QuickBooks; traveler **not** the pitch | Horizontal quote-to-cash; machine-shop playbook exists |
| **Zenith Quoting** | **$49/print** or **$999/mo** (100 prints); 5 free | Email a 2D PDF, itemized quote back in an hour. Founder states age 17, NE Ohio pilots | **Literal PDF→quote**; credibility/ITAR unproven |
| **QuoteForge (Gridex)** | **€99 / 349 / 899**/mo + credits | STEP geometry + PDF notes; deterministic rates; mill/turn/EDM/5-axis | STEP-first, not PDF-only |
| **PartPilot** | **$450/mo per core module** (3D and 2D each) | Feature recognition + “quote from PDF” | In-band on 2D, **above** $149 |
| **Machine Research** | Unpublished; “no long contracts,” request pricing | CNC ML on 3D + shop actuals; **ITAR + AWS GovCloud**; FedRAMP Moderate “Fall 2026” (claimed) | CNC-native, compliance-forward, not self-serve cheap |
| **CNCQuote** | Private deploy, not sticker | EU shop-built; AI estimates + email RFQ | Not US SMB self-serve |
| **Arzana (YC S26)** | Unpublished | Factory-office agents (order entry/quoting) | Horizontal office AI |
| **Mercura (YC W25)** | Unpublished | Distributor catalog quoting | Wrong industry |
| **Fabricate (YC)** | Unpublished | **Buyer** CAD→supplier quotes | Other side of the table |
| **Forge Automation (YC W25)** | Instant quote to *their* factory | Competes with Xometry, not with shop software | — |

**Gap matrix vs proposed wedge (PDF→checklist→priced quote, self-serve, no setup fee):**

| Need | Paperless | Tempus | CloudNC QA | Setell | Zenith | Kipware |
|---|---|---|---|---|---|---|
| PDF dims/tols/material checklist | Wingman ($$$ ) | PDF→CAD for **sheet** | Partial (DFM-led) | Partial | Yes (email) | No |
| Estimator-confirm, show source | Yes (Wingman cites location) | Rules visible | Edit draft | “Trust mode” on paid | “Honest flags” | N/A |
| Shop-configured mill/turn rates | Yes | **No (fab)** | Yes | Learns QB | Calibrate by reply | Manual |
| Priced quote PDF + traveler | Quote yes; traveler via ERP | Production docs (fab) | Quote yes; traveler unverified | Quote→invoice | Quote email | Quote; no traveler |
| $99–149, no setup, self-serve | **No** | **Yes, wrong process** | **Yes, per-part** | **Yes** | Per-print / $999 | $495 once |
| ITAR/CUI path | GovCloud / FedRAMP-eq | Not a claim | **Refuses** | Unverified | Unverified | Air-gapped plus |

Whitespace that remains: **confirm-first mill/turn checklist + traveler**, priced from *the shop’s* rate table, monthly not per-part, PDF-first (STEP optional), commercial-only. It is a **positioning slice**, not an empty category.

---

## 6. Buyer psychology, objections, and the trigger hunt

**Community attitude (quote real threads, not paraphrased vibes):**
- r/CNC automated-quoting thesis: “i trust autodesk, i don't trust FalconWR17”; tool is a “second opinion.”
- r/CNC RFQ-intake pitch: “I'd be careful promising AI quotes, but AI intake/checklist stuff would solve a real headache.”
- r/CNC dump-the-RFQ-in: “Trusting the read enough to quote off it is the hard part. A misread thread class or missed finish… rides straight into a contracted price.”
- r/Machinists AI-quoting: “You could use it to create a quoting template but actually having 'AI' make up prices is a dumb idea.”
- PM cost-estimation: Excel with highlighted must-fill cells; MicroEstimating/CustomPartNet named; Imnoo dismissed unless fed lots of 3D+prices.

**What “trust” requires:** (1) checklist with **source highlighting on the PDF** (Paperless Wingman already does this — the bar is set); (2) **no AI-generated price** — rates are the shop’s; (3) estimator must tick-confirm critical callouts (threads, finish, material spec, tightest tol); (4) comparable-job retrieval beats a neural cycle-time. Liability: the quote *is* a commercial offer. Shops will not accept a ToS that dumps that on software. Human-in-the-loop is a legal feature, not a UX nicety.

**Who has bought recently, and what triggered it** (every scrap, ranked by how forcing it is):

| Trigger | Evidence | Forcing? |
|---|---|---|
| **Estimator retires / dies / quits and knowledge isn’t in a system** | Hillside Custom (Paperless): retirements → 2-week quotes → couldn’t hire. Fabcor: father retired → all-night quoting → bought on growth. Paperless junior-estimator blog: the “one estimator for decades” pattern is their default sales motion. | **Yes — dated, existential** |
| **Can’t hire an estimator into Excel** | Hillside: new hires “frustrated… prohibitively difficult.” 2026 job posts ($65–100k) + 66% technician hiring crisis (Reshoring survey, prior file). | **Yes if they’re trying to hire** |
| **RFQ volume step-change** | Fabcor: 300% growth / expanded capacity. Leech: aero/defense pace + NetSuite hole. Reshoring: 32% of CMs quoting reshores (2×). NTMA H1 2026: 20% saw previously-offshore work; 15% expect more. | Medium — volume without a named owner-pain still waits |
| **ERP quoting breaks or finally integrates** | CAMM Metals: left Paperless because JobBOSS didn’t integrate; **re-signed within a week** when the connector shipped. | Yes, but it’s an integration event, not a quoting-tool event |
| **New big customer / professional-quote demand** | Paperless reviews: buyers compliment the quote template; credit-card / portal need. | Soft |
| **Xometry / marketplace squeeze** | XMTR Q2 2026: marketplace GM targeted **35–40%**; new cost model + adaptive supplier pricing; Workcenter (Sep 8, 2026) cuts job-review time (vendor: >60%) to lift accept rates. Shops on the platform need **faster accept/reject**, not a general quoter — Xometry is building that itself. | Weak for a third-party CNC quoter |
| **Owner succession / shop sale** | HarborWind: buyers discount shops where “earnings walk out.” Quoting system as diligence artifact. | Episodic |
| **Bid-season / IMTS / fiscal quoting push** | IMTS 2026 is **Sep 14–19, 2026 (now)**. Not a recurring “tax season.” | Calendar, not forcing |
| **Wrong-quote scare / missed callout** | Anecdotal in reviews (“features we might overlook”). No cluster of “we bought because we ate a job.” | Unverified as a buy trigger |

**Implication for Lane B kit:** the auditors were right that *speed* is not a this-quarter purchase. **Retirement, failed hire, and “the only person who quotes is going on vacation / sold the shop” are.** Discovery calls must hunt those, not “would faster quoting help.”

---

## 7. Constraints and compliance

**Can a shop legally upload ITAR/CUI drawings to a third-party cloud LLM? Short answer: not to consumer ChatGPT/Claude/Gemini, and not to a SaaS that decrypts drawings into a general model.**

Load-bearing:
- ITAR technical data = USML-related drawings/specs. “Release” to a foreign person is an export (22 CFR 120.50). **DDTC has not issued AI-specific guidance** (Greypike 2026; treat as current-as-of-search). Existing rules apply.
- 22 CFR **120.54(a)(5)** encryption exception: unclassified data, **end-to-end encryption**, FIPS-class crypto, not stored in §126.1 countries, and — critically — **the provider’s ability to access encrypted data is not a release only if they cannot decrypt it.** A vision LLM that reads the PDF in plaintext **does not qualify**. (eCFR + 2019 Federal Register; MemX explainer.)
- CMMC ≠ ITAR. CMMC is DoD CUI cybersecurity; ITAR is State/DDTC. Passing one does not authorize the other.
- **Unverified:** whether a US-person, US-hosted, GovCloud, no-foreign-access SaaS that *does* decrypt for inference is a “release.” Industry practice (Paperless, Machine Research) is to treat GovCloud + US persons + ITAR registration + CUI flagging as the sellable answer. That is **vendor legal theory, not a DDTC advisory opinion.**

**What incumbents claim:**
- Paperless: ITAR registered; AWS GovCloud; FedRAMP Moderate **Equivalent** (not FedRAMP authorized — they say so); CMMC CSP for L2; US-person admins; Wingman inside the FedRAMP boundary; **do train detection models on a random sample of uploaded drawings** (aggregated); **do not train generative models on customer data**; third-party AI subprocessors “do not train on” requests; **opt-out of aggregated improvement exists.**
- CloudNC Quote Agent: AWS commercial encryption; **“we do not recommend uploading export-controlled data.”**
- DigiFabster: “ITAR compliant storage” on higher tiers; **ITAR AWS Hosting is an add-on.**
- Machine Research: ITAR registered, GovCloud, US citizens only; CMMC L2 language is **inconsistent across their own pages** (one says “compliant,” another says CMMC is achieved by the CM, not the CSP). Treat as **unverified / conflicting.**
- CADDi US: “ITAR” listed next to ISO 27001/SOC2 — **depth unverified.**

**Fraction of RFQs that are defense-touched:** **no NTMA or BLS figure found.** Zipdo aggregator (Jul 2026) claims defense = **12% of US machine-shop revenue** (40% of that government contracts) — **unverified, sources not inspectable.** NTMA H1 2026 survey (150+ members) did not publish defense mix. Reality for 5–50 person shops: a **mixed bag** — many never touch ITAR; a subset get occasional prime-sub drawings; those shops already treat email as non-compliant and are the ones Paperless sells CMMC to. **Do not assume “most RFQs are commercial.” Do not assume “most shops are ITAR.” Both are unverified.**

**Drawing quality (P7):** scanned faxes, missing tols, STEP-only, handwritten redlines. Academic 2025–26 VLMs: generic OCR loses dimension↔tolerance association; performance falls on dense/rotated/low-DPI/handwritten; Mavlon (vendor) ~88% modifier detection on clean prints, **~80% on scans**; frames <3mm at low DPI fall under resolution. Paperless admits dirty-print failure. **V1 that requires clean vector PDFs will bounce a real share of inbox RFQs.**

---

## 8. Segment prioritization

1. **First: 2.5-axis milling, prototype/short-run, commercial-only, owner-estimator, 8–25 people.** Why: PDF-first (tolerances live on the drawing); setup-dominated cost (checklist + rate table is enough; no Swiss cams); Tempus does not cover it; CloudNC is the threat but is DFM/CAD-shaped and ITAR-refusing — overlap, not identity. Prototype quoting is time-sensitive and less GD&T-dense than aero production.
2. **Second: 2-axis CNC turning, same shop size.** Similar economics; round parts + threads are vision-tractable if you confirm thread class.
3. **Not first: Swiss.** Cam/guide-bushing/collet/bar-grind estimating (PMPA method) is a different cost model; production-volume; often medical/aero (ITAR/CUI).
4. **Not first: fab/laser.** Tempus owns the cheap seat.
5. **Xometry/marketplace suppliers as a distinct segment.** They already have a job board + AI price. Selling them a second quoter fights Xometry’s Workcenter. Use them as **distribution later** (faster accept) or ignore in v1.
6. **Production quoting (repeat parts, certs, outside process lead times)** needs history + vendor RFQs — v2, after the checklist works.

---

## 9. Channel map, sharpened

**Practical Machinist.** ~950k monthly visits, 200k members (their advertise page). Rules (search snippets; **full guidelines page Cloudflare-blocked this run**): unsolicited ads/self-promo removed; repeated near-identical posts = spam → ban; 2 posts required before PMs; location in profile. Thread “How does one advertise correctly?” (2026): members have watched “dozens if not hundreds” of vendors post “HEY I’M HERE” and get banned; the accepted path is **paid ads + being a long-time member who answers technical questions.** Vendor-area talk is old (2007) folklore. **Lane B kit’s public pitch post would be a ban.** Compliant: answer quoting threads from lived experience; disclose; **buy ads**.

**r/Machinists (~278k).** Rules: **no commercial advertising; “NO APP ADS”; classifieds only in megathread; job posts need pay and direct affiliation; No AI-generated content** (images, videos, **software**). A founder posting an AI quoting tool is a rules collision. r/CNC is slightly more tolerant of “feedback wanted” research posts (several 2026 threads exist) but hostile to auto-price claims.

**NTMA.** Chapters + national events. IMTS Technology Luncheon **Sep 16, 2026** (W474A, McCormick) — associate showcase. IMTS itself **Sep 14–19, 2026**, 90k visitors / 2,000 exhibitors (AMT). Too late to exhibit this cycle; use for **discovery conversations in the halls this week**, then plan 2028 or smaller shows (PMTS, Eastec, regional NTMA).

**YouTube / podcasts (2026 listings; subscriber counts from SponsorRadar / ChannelsLike — treat ±):**
- **Titans of CNC** ~1.15M subs; CloudNC is a listed sponsor — **they already have a quoting-adjacent sponsor**.
- **NYC CNC / John Saunders** ~458–460k; **Business of Machining** podcast with John Grimsmo (verified).
- **Practical Machinist YouTube** ~135–145k; **The Impractical Machinists** podcast (hosts Bradley, Cameron, Patrick; 57 episodes as of Sep 1, 2026; ep 48 = “Finding Work, Quoting Jobs & Staying Profitable” — **the guest-slot to hunt**).
- MTDCNC ~211k (UK-leaning).

**Precedent:** Tempus grew on transparent price + fab niche, not PM spam. Paperless grew on sales-led CM accounts. CloudNC is buying machining-creator reach (Titans). **There is no recent $99 CNC-quoting tool that launched *through* PM without getting burned**; Kipware advertised in-thread for years as a member-vendor and still lost to Excel.

---

## 10. What to do (synthesis)

**ICP one-liner:** Owner-estimator at an 8–25 person **commercial** 2.5-axis mill (some turning), quoting from **email PDFs**, still on Excel, who just **lost or is about to lose the person who quotes** — or cannot hire one.

**V1 features (7):** (1) PDF upload → **source-highlighted checklist** (material, qty, dims, tols, threads, finish, inspection notes); (2) mandatory confirm on critical fields; (3) shop rate table (setup $/hr, run $/hr, material markup, min lot); (4) estimator-entered setup/cycle with optional feature-count assist — **not a black-box price**; (5) branded quote PDF; (6) **traveler/router PDF** from the same lines; (7) quote log + comparable-job search on *this shop’s* history.

**Explicit out of scope:** CAM / toolpaths; STEP solids as a v1 requirement (accept if present, don’t depend); 5-axis / Swiss; outside-process marketplace; ERP write-back; **defense / ITAR / CUI drawings** (hard refuse + clickwrap; point them at Paperless); Xometry job-board; instant customer-facing web store.

**Defense-drawing decision:** **Refuse in v1.** A solo $99/mo product cannot honestly offer GovCloud + US-person ops + FedRAMP-eq. Using OpenAI/Anthropic commercial vision on a drawing that *might* be ITAR is the kill-the-company risk. CloudNC — a funded CNC specialist — already prints the refusal. Match them.

**Positioning:** Not “Paperless for cheap.” **“The confirmable PDF checklist + traveler for mill shops that will never sit through a 10-week onboard.”** Vs Tempus: they own laser geometry; you own mill/turn prints. Vs CloudNC Quote Agent: they are DFM/cycle from CAD at per-part prices and refuse ITAR; you are **PDF-first, monthly, show-the-checklist, traveler-out.** Vs Setell: they are horizontal quote-to-cash; you are a machinist’s work-up. Vs Zenith: they email a price; you never emit a number the estimator didn’t confirm.

**Price:** **$99/mo** annual-equivalent, **$129** monthly, **no setup**, 14-day real-RFQ trial (their last 5 already-quoted jobs). Do not go $149 until the traveler and comparable-job search exist — CloudNC Starter and Setell Pro already sit at $99–100. Price against **one lost job / month of estimator hours**, not against Paperless’s $18k (buyers who can pay $18k already have a sales rep in their inbox).

**GTM sequence (manufacture urgency):**
1. **This week (IMTS):** 15 owner conversations, trigger-first script from `09`. Do not pitch on the show floor as a vendor.
2. **Find shops in-event:** estimator just left, owner quoting nights, “dad’s retiring,” failed Paperless demo on price. Those are pilots.
3. **Channels:** Impractical Machinists ep-style guest (quoting episode already exists); Saunders/Grimsmo only after 3 paying shops; **paid PM ads**, never cold threads. r/CNC research comments only; **never r/Machinists app posts.**
4. **Urgency copy:** “When Dave’s gone, the quote log is a pile of XLSX.” Bid-season is weak; **succession and vacation coverage** are strong. Offer a **72-hour ‘estimator-out’ emergency setup** as the manufactured trigger.
5. **Kill Paperless comparisons in ads.** Compare to Excel + Kipware + “the $8k AMFG floor.”

**Updated risks + kill criteria:**
- **Category crowding (new).** CloudNC QA + Setell + Zenith + PartPilot 2D opened in 2025–26. Kill if 15 calls show shops already trialing one of these **or** if CloudNC ships a $99 unlimited PDF checklist.
- **Trigger still weak.** Kill per `09`: no identifiable trigger in 15 talks.
- **ITAR leakage.** Kill the company if a customer uploads CUI to a commercial LLM backend. Product-level refuse is mandatory.
- **Dirty-print accuracy.** Kill v1 scope if confirm-step doesn’t catch misses on real inbox PDFs (measure: <5% uncaught critical-field errors on a 50-drawing holdout of *customer* prints).
- **Traveler is table stakes vs Tempus;** shipping quote-only is a me-too Setell.

**5 discovery questions desk research cannot answer:**
1. **Last time you actually paid for quoting help (software, freelancer, or a new hire) — what event that month forced it?** (Trigger. Demand a date.)
2. Of last week’s RFQs, **what file mix hit the inbox** (PDF-only / PDF+STEP / scan / STEP-only), and which did you no-bid solely for bandwidth?
3. Show me a quote you **lost and a quote you ate**. Was the miss speed, price, or a missed callout — and would a highlighted checklist have changed either?
4. Have you **opened a Paperless, AMFG, CloudNC, Tempus, or Setell tab in the last year**? What exact screen or price made you close it?
5. If the person who quotes is unreachable for 10 working days next month, **what happens to RFQs, and what would you pay to not find out the hard way?**

---

## Sources that failed / open questions

- Practical Machinist full guidelines page: **Cloudflare block**; rules from search snippets + adjacent threads only.
- ITAR upload-to-LLM: eCFR 120.54 fetched; **no DDTC AI advisory found**. GovCloud-as-sufficient is industry practice, not a ruling.
- **% of job-shop RFQs that are defense/ITAR: unverified.** Zipdo 12% of revenue is an aggregator.
- Paperless list price: still unpublished; $10k+$18k remains **Tempus-sourced**.
- FMA “25–30% win rate”: cited by Mavlon, **primary report not fetched**.
- Forgepoint “78% first responder”: **not a machining study**.
- BLS machine-shop-specific estimator wages: national 13-1051 only; NAICS 332710 tab not opened.
- Tempus CNC roadmap: **not found** (absence ≠ never).
- Machine Research CMMC claims: **self-contradictory**.
- Zenith: live site, **no third-party reviews, founder-age claim unverified**.
- PartPilot reviews: vendor testimonials only; third-party roundups are thin.
- G2 full review bodies: snippet-capped.
- CNCZone: still hobby noise (prior file).
- NTMA Operating Costs / Wage surveys: paywalled to members — would answer estimator wages and quoting productivity better than anything public.
