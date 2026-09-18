# Lane A — competitor OFFER teardown (tax-season document chase)

Researched **2026-09-18**. Deepens `10-deep-dives/lane-a-tax-doc-chase.md` §5; does not restate workflow/7216. Direct pricing-page fetches where the page rendered; TaxDome public site Cloudflare-blocked this run (help-center + search snippets used). Vendor-claimed numbers labeled. Anything not on a live page or dated third-party writeup = **unverified**.

**200-return solo scenario (used in the table):** 1 US user, 200 1040s, annual billing, cheapest published tier that actually includes client document *requests* (not just storage). Seat minimums paid. Implementation fees shown separately, not in “effective $” unless the vendor requires them. SMS cost included only if that is the chase channel at that tier. Grove overage unpublished → 25 free + quote. SafeSend $15/return is **practitioner-reported**, not a card.

Proposed wedge: **$299/season** (~$1.50/return at 200), SMS-first, one PDF/account, prep-queue gate, no minimums.

---

## TaxDome

**Price (US, help.taxdome.com/article/1800, snippets 2026):** per **seat/year**, billed upfront. Essentials **$800 / $750 / $700** (1/2/3 yr); Pro **$1,000 / $950 / $900**; Business **$1,200 / $1,150 / $1,100**. Owner must hold a full-term seat. Pro monthly seats **$100**/mo; Business seasonal **$500**/4 mo. Firms created before 2025-01-01 were auto-migrated Essentials→Pro on **2025-06-07** and billed $1,000 at next renewal (help FAQ). SMS: Twilio pass-through **$30.15** setup + **$11.15**/mo/firm + **$0.04**/msg in/out ([taxdome.com/sms](https://taxdome.com/sms)). **Automated SMS reminders not available** (help SMS FAQ Q12, snippets). Client-request reminders = **email**, default every **3 days**, default **1** reminder ([help article 1531](https://help.taxdome.com/article/1531-requests)).

**Offer:** 14-day trial (third-party 2026 writeups; live trial length **unverified** this fetch). Paid onboarding **from $999** Guided / **$1,999** Enhanced / **$3,499** Premium ([taxdome.com/onboarding](https://taxdome.com/onboarding); company page: Guided aimed at 5–9 seats). Switch credit: “cover the remaining cost of your contract—with a credit of **up to 6 months** free.” White-glove historically ~$500 (r/taxpros `1ktmnf4`, snippet). No published refund guarantee.

**Docs:** Organizers + client requests + pipelines. Optional no-signin on a request. Prior-year AI checklists **claimed** (r/taxpros Dec 2025); 1099 grouping **unverified**. Completeness-gating = configurable pipeline stages, not a productized hard block. Branded client app = Business.

**Positioning (homepage, search; live fetch Cloudflare-blank):** “Accounting practice management software that connects your firm, your team, and your clients.” Enemy: disconnected tools. For: tax/bookkeeping/accounting firms, solo→multi-office.

**Offer friction:** 2024 $400→$800 then push to lock 3 years (`1efhvqd`, `1h0lopo`); CPACharge sunset mid-busy-season + 3-year lock-in (`1qaipyw`, `1q6u9w3`); 95-hr setup regret (`1tj6rp6`). G2 ~4.7 — 1★ bodies thin in snippets.

---

## Canopy

**Price ([getcanopy.com/pricing](https://www.getcanopy.com/pricing/), fetched 2026-09-18):** **$74 / $109 / $149** per user/mo **billed annually** (Standard/Plus/Premium; “annual billing saves 20%”). Enterprise quote. **Tax Workflow Automation (Smart Intake)** “Starting at **$34** credit/client” annual; **5 trial credits** included; extra credits min **25**, prorated, **reset at renewal** ([support article 13016025](https://support.getcanopy.com/en/articles/13016025-how-do-client-credits-work-for-smart-intake-and-engagements)). Non-AI checklists do **not** burn credits. KBA **$1.25**. Close Automation **$10**/connected client/mo (first 5 free). Tax Resolution **$50**/user/mo. Cards 3.30%+$0.20; ACH 1% cap $10.

**Offer:** Trial via **demo/sales** (pricing FAQ: “Schedule a demo”). No published refund. Free Client Management tier **gone** as of 2026 (ClientBrief/Portico writeups). SMS **not on the public pricing page**.

**Docs:** AI questionnaires/checklists from past returns/CRM; one-click portal **or** “secure link”; automated **email** reminders for missing docs ([getcanopy.com/smart-intake](https://www.getcanopy.com/smart-intake/)). 1099 grouping **unverified**. Status tracking, not a hard prep block. eSign + EL bundled in base.

**Positioning:** “Canopy helps accountants build an **autonomous firm**.” Enemy: “Franken-stack” / app-hopping. For: solo through large US firms.

**Offer friction:** G2 2026 (snippet): “tassa extra per tutto… ci stiano spennando”; TCO higher than expected. r/taxpros: modular pricing “all over the place” vs TaxDome all-in (`1efhvqd`). Capterra 4.53 (286) per prior dossier — not re-counted this run.

---

## Financial Cents

**Price ([financial-cents.com/pricing](https://financial-cents.com/pricing/), fetched):** Solo **$19**/mo **annual-only**, 1 user. Team **$49** annual / **$69** monthly per user. Scale **$69** / **$89**. Enterprise **$89** annual / **$109** monthly (help FAQ). Monthly Team/Scale: **5-user minimum**. Vendor: “save **56 hours** a month & **$19,200**/year.”

**Offer:** **14-day trial, no card**, all features. No published implementation fee. SMS **cost unpublished** (Scale includes auto email+SMS until complete — [help 8781064](https://help.financial-cents.com/en/articles/8781064-automated-client-reminders)). Cadence every 1–3 days (product-tour page).

**Docs:** Client tasks + portal on **all** plans. Manual lists, **not** prior-year tax import. No 1099 intelligence. No prep-queue gate. eSign on Solo.

**Positioning:** “One Platform. Total Control.” / “Proudly built for **small firms**.” Enemy: bloated suites.

**Offer friction:** Auto-chase locked behind Scale (**$828**/yr for a solo). G2 ~4.8: easy, “too many clicks” (prior dossier). Solo marketing implies auto-reminders; help center contradicts.

---

## Karbon

**Price ([karbonhq.com/pricing](https://karbonhq.com/pricing/), fetched; RealCostLabs Aug 2026):** Team **$59** annual / **$79** monthly per user; Business **$89** / **$99**. Monthly **only for 4+ users** — solos **must** annual. Auto client reminders = **Business**. eSign credits: 100 for **$100**. Payments 2.6%+$0.30. Implementation: Guided Plus = **8-week** package (fee **unpublished** on pricing; FC 2026 article cites extra costs). StanfordTax: 5 free organizers + “exclusive discount” ([karbonhq.com/integrations/stanford-tax](https://karbonhq.com/integrations/stanford-tax/); GA Dec 2025).

**Offer:** Trial **demo-gated** (FC/AccountingStack 2026: no self-serve). Multi-year option. Vendor: **$39,191** saved per employee/year; **3.5 hrs/wk** chasing (2026 Firm Usage Survey — vendor).

**Docs:** Automated client requests; reminders **email** + Karbon-for-Clients **push**; **SMS not claimed**. Magic link then device-bound. Tax organizers via **StanfordTax**, not native PY parse. No 1099-grouping claim. Progress reports, not a hard block.

**Positioning:** “Practice Management **Built for Growth**.” “#1-ranked.” Enemy: email chaos / blind spots.

**Offer friction:** Annual lock for <4 users; automation upsell; onboarding 4–8 weeks (UK 2026 review). G2 4.8.

---

## SafeSend (Gather + One)

**Price:** Quote-only. Packages: Essential Gather / Essential Deliver / Premium ([safesend.com](https://safesend.com/), fetched). “No seat / maintenance / KBA fees.” Prepaid per-return or per-delivery. Practitioner: “**$15ish per return**” → $30k on 2,000 (`1itux27`). Older return-delivery **$17**/return (`y8n3xn`, 2022). TR-era “2× TaxCaddy” (`1u6sp0l`). Volume slogan “Save **$12,000** per 1,000 returns” ([info.safesend.com/pricing](https://info.safesend.com/pricing)). Impl. vendor: **3–4 hours**.

**Offer:** No public trial/refund. Premium includes Gather; Gather also sold as Essential. SMS channel **unverified**. Passwordless “no login required” for file transfer.

**Docs:** PDF→fillable organizers, AI DRL from tax software (UltraTax, CCH, Lacerte, GoSystem). **Exploded 1099s documented:** “Morgan Stanley #1234 1099-INT… DIV… and the 1099-B… we scrapped the entire thing” (`1qhdxp8`, 2026). Brokerage recognition “<5% success” (`1itux27`). Completeness % “open to interpretation.” eSign + EL included. **No hard prep gate.**

**Positioning:** “Automated Tax Workflow, From Intake Through Delivery.” “Trusted by **70% of Top 100 Firms**.” Enemy: manual click-through.

**Offer friction:** Price vs secretary (`1itux27`); Gather quality; “jumped in December” setup. Built for Top 100, not 200-return shops.

---

## Soraban

**Price:** No public card (CurateSuite 2026-06-29). Own site: 1 credit = 1 return, packages **start at 250**, onboarding **$1,000–$4,500**, 2–4 weeks / 30-day white-glove ([soraban.com/how-tax-returns-move…](https://www.soraban.com/how-tax-returns-move-from-client-upload-to-signed-return)). Taxhance 2026 review (not vendor): Collect **$25**/return, Deliver **$20**, both **$40**, **50-return min**. Reddit: 200-return customer **and** “now they require at least **300**” (`1u6sp0l`) — **contested**. Vendor: “**83 min** saved per return”; “**0 hours** spent chasing”; **89%** client adoption yr 1.

**Offer:** No free trial listed. “No commitment until you’re live” (Collect page — **unverified** commercially). SMS+email auto-reminders (vendor); voicemail in third-party reviews. Passwordless / “Unportal.”

**Docs:** Prior-year personalized checklist. Collect marketing lists **1099-INT as its own line** — explode risk **unverified** vs Gather. Status tracking, not a hard block. Connect pushes into UltraTax/Lacerte/Drake/Axcess (ProConnect “coming soon”).

**Positioning:** “The work behind the return. **Handled.**” Enemy: siloed intake/prep/delivery + seasonal hiring.

**Offer friction:** Minimums/onboarding wall; sales-quoted pricing; 1040-heavy (business-return depth **unverified**).

---

## StanfordTax

**Price ([app.stanfordtax.com/pricing](https://app.stanfordtax.com/pricing), fetched 2026-09-18):** Free **5 returns**. Premium **$18/return**, credits **never expire**, **no minimums, no implementation fees**, unlimited users. Enterprise **$25+**/return, **5,000-client min**, impl. **from $10,000**. CEO 2025: pay when a doc is uploaded; 2025 promo $13.50 (**historical**). Karbon: 5 free organizers + discount (Dec 2025).

**Offer:** “Try for free / no credit card.” Live demo Thursdays. **90%+** completion, **75%+** less organizing time, **800+** firms, **97%** retention — **all vendor**. SMS: **not claimed**. Reddit: “Stanford Tax **lacks messaging; you need to use emails**” (`1u6sp0l`).

**Docs:** Personalized organizers **from tax-software backups** (Lacerte, UltraTax, Drake, ProConnect, ProSeries, Axcess, ProSystem fx). Magic link, no usernames. Auto-split/rename/bookmark. 1040/1120/1120S/1065. **Consolidated-1099 grouping still unverified** (no Gather-style smoking gun). No prep-queue gate. Delivery/e-sign now on homepage (2026); some 2025 redditors still picked Truss/SafeSend for delivery (`1pqvqx9`).

**Positioning:** “Automate your tax workflow from intake to delivery.” Enemy: generic PDF organizers / back-and-forth.

---

## Grove Collect

**Price ([grove.tax/pricing.html](https://grove.tax/pricing.html), fetched):** **Free through Oct 15, 2026**, unlimited, no card. Then **first 25 returns free every season**; past 25 = **custom per-return**, **no platform/seat/storage/e-sign fees, no minimums, no annual contract**. Refund: “make it right or **refund the return**.” SOTA2 lists “**$10/return** (Summer promo)” — **unverified** as current list. SMS **not claimed**.

**Docs:** Smart checklists from **prior-year returns**; magic-link, no app/signup; AI questionnaire “**3×** completion vs PDFs” (**vendor**). Homepage/MCP examples name **1099-INT Chase** and **1099-DIV Vanguard/Schwab** as **separate form-type lines** — suggests form-level, **not proven** one-PDF-per-account (and not Gather-exploded INT+DIV+B on the *same* brokerage). Auto cross-off; workpapers. **No hard prep gate claimed.** Testimonials on pricing page **unverified**.

**Positioning:** “Free this extension season.” “The AI tax workflow automation for modern firms.” “**Automate 70%** of your tax prep.” Enemy: 40-page PDF questionnaires.

---

## Liscio

**Price ([liscio.me/pricing](https://www.liscio.me/pricing/), fetched):** Intelligent Files **$19**/user/mo annual (storage/AI rename — **no** client tasks). Platform **$49**. Tax Team **$99** incl. **100** gatherings + **100** deliveries + **100** eSigns **per user/year**. À la carte organizer **$5**; delivery **$5**. Monthly = contact us. Onboarding **included** on Platform. Website add-on **$29**/mo. SMS **price unpublished**; two-way texting exists (help collection). Tasks: reminders **5d / 1d / daily after**; SMS **if texting enabled** ([liscio.me/features/tasks](https://www.liscio.me/features/tasks/)).

**Offer:** Demo-gated. Smart Requests: **no app or password** ([smart-client-requests](https://www.liscio.me/features/smart-client-requests/)). Organizers from UltraTax/Lacerte/ProSeries/Drake/CCH. 1099 grouping **unverified**. No hard gate. Vendor: **8×** faster responses; **72%** organizer return rate.

**Positioning:** “Start with the file. Run the firm.” Enemy: Dropbox/ShareFile/SmartVault as “storage”; TaxDome/Karbon/Canopy as PM (Liscio = File Intelligence). For: books + tax.

**Offer friction:** “Pricey”; gather/deliver extra (`1u6sp0l`: portal **$45**/user + extras — possibly grandfathered vs $49 Platform). Export “unusable” (`1fvnd2a`). Clients/app fatigue (`1f4vb8l`). G2 ease high; account-switching friction (prior dossier).

---

## SmartVault

**Price ([smartvault.com/pricing](https://www.smartvault.com/pricing/), fetched):** Business Pro **$55**/user/mo annual, **3-user min** ($75 monthly). Accounting Pro **$65**/user/mo annual, **2-user min**. Accounting Unlimited **$85**, 2-user min. ProConnect Docs **$68**/mo **1 user** (Intuit page). SmartRequestAI **$12.50**/return, bundles of **50** (**$625**), never expire, **no long-term contract**; “Save **20%** on 200+” offer **ended Jul 31** (stale banner on page). Seasonal licenses Dec 15–Apr 30 (2025 extended to Oct 15). Onboarding/migration/training = **add-on** (fees unpublished).

**Offer:** Demo. AI: **prior-year → personalized DRL**, auto follow-ups (channel **unverified**; not advertised as SMS). Docs stay in SOC 2 Type 2 vault. 1099 grouping **unverified**. No hard gate.

**Positioning:** “Document Management Software **Built for Accountants**.” “#1-integrated DMS.” Enemy: email chaos / FTC-Safeguards risk.

**Offer friction:** G2 snippet: price “**nearly tripled** this year with zero…” (Accounting, undated). Solo forced **2 seats** = **$1,560**/yr before AI.

---

## Content Snare

**Price ([contentsnare.com/pricing](https://contentsnare.com/pricing/), fetched):** Annual **$35 / $71 / $119 / $215+**; monthly **$42 / $85 / $143 / $258+**. Caps: **20 / 50 / 100 / 200+ active requests**; **40 / 100 / 200 / 400+ SMS/mo**; 2/5/10/20+ users. **No contracts.** Extra SMS **rate unpublished**. Plus: **1 free form migration**; Pro: 2. **Switching:** “locked into a contract somewhere else, we’ll give you **free access until it runs out**. Conditions apply.” **14-day trial, no card. No refunds** after. ISO 27001.

**Offer / docs:** Link, no client password. Unlimited **email** reminders. Manual templates — **not tax-proforma-aware**. 20 concurrent **breaks a 200-return January**. No gating. Vendor: **71%** less chase time.

**Positioning:** “The easy, secure way to get info from clients, **without the back and forth**.” Enemy: Moby-Dick email threads. Horizontal (accounting is one vertical).

**Offer friction:** r/webdesign 2026: “starts at $35/mo, no free tier”; clients still delay. Active-request math is the trap, not the sticker.

---

## Keeper → Double (bookkeeping off-season)

**Price:** Keeper.app **redirects to Double** (rebrand Oct 2025, ClientBrief). Core **$10** / Plus **$25** / Scale **$50** **per connected QBO/Xero client / month**, unlimited users ([doublehq.com/blog/introducing-keeper-scale](https://doublehq.com/blog/introducing-keeper-scale/)). Tax Suite included with **$200/mo annual commitment**. Extra inbox **$10**/email/mo. Scale promo: 20% off for 10 clients annual (launch). **Must connect ≥1 client.** SMS via Twilio **usage-based** (Uku 2026; rate **unverified**). Portal: **Google magic links**. Demo then “contract to pilot.” CPA Forge still lists Keeper “from **$8**/client/mo annual” — **stale vs Double’s $10**.

**Docs:** Client questions + uploads on the close page — **monthly statements/receipts**, not 1040 DRLs. No prior-year 1040 parse. No 1099-CONS logic. Close-status, not tax-prep gate.

**Positioning:** “Close the books in **half the time**.” Enemy: fragmented month-end.

**Offer friction:** Per-client math explodes (20 books × $10 × 12 = **$2,400**; 200 1040s would be nonsense). Demo/contract on-ramp.

---

## 2025–26 entrants (also sell collection)

**ClientBrief** ([clientbrief.net](https://www.clientbrief.net/), fetched): **$7.99/mo flat**, unlimited clients/checklists, no seats, no annual. Magic-link uploads, auto **email** reminders, 7-day delete after complete. **No** prior-year import, **no SMS claimed**, **no** 1099 intelligence, **no** prep gate. Headline: “Send a checklist. Clients upload without creating an account.” Direct **price** competitor; thin tax-fit.

**Qount** ([qount.io/pricing](https://qount.io/pricing/), fetched): Essentials **$74** / Pro **$114** / Intelligence **$139** per user/mo annual (monthly $84/$124/$149). Organizers + SMS at **Pro**: 1 line, **500 msgs/mo**, extra lines **$30**. Onboarding **one-time fee** (unpublished). **No free trial** — demo only. Prior-year DRL from printed organizers/returns (integrations page). Reddit 2026: rolling gather/deliver (`1u6sp0l`).

**Truss** ([gettruss.io](https://gettruss.io/)): custom. Zero-login AI checklists from prior year; optional human/AI prep. “Zero §7216 headaches” **vendor slogan**. SOC 2 Type II claimed. Capterra/G2 **4.9** (vendor). Price **unpublished**.

---

## Master comparison — 200-return solo, 1 user, annual

Assumptions at top. “Effective $” = subscription + required mins + collection add-on for 200 returns. Impl. fees excluded unless unavoidable.

| Vendor | Unit | Effective $ (200 1040s) | Contract | SMS? | 1099 | Gate? | Trial |
|---|---|---|---|---|---|---|---|
| TaxDome Essentials | $800/seat/yr | **$800** (+SMS ~$164 Twilio/yr + $0.04/msg; auto-SMS **N/A**) | 1–3 yr prepaid | Manual only | Unverified | Configurable | 14d (3rd-party) |
| Canopy Standard | $74/user/mo ann. | **$888** base; **+$6,630** if AI intake @ $34×195 | Annual (20% vs mo) | Not on price page | Unverified | Status | Demo trial |
| FC Solo / Scale | $19 / $69 /mo ann. | **$228** / **$828** | Solo annual-only | Scale auto email+SMS | No | No | 14d no card |
| Karbon Team / Biz | $59 / $89 /mo ann. | **$708** / **$1,068**; +Stanford $18×195 = **+$3,510** | Annual if <4 users | No (email/push) | via Stanford | Progress | Demo |
| SafeSend Gather | quote / ~$15/ret | **~$3,000** (practitioner) | Prepaid packages | Unverified | **Explodes** | No | Quote |
| Soraban Collect | sales; 250 min on-site | **$1k–$4.5k onboard +** 250×$? ; Taxhance $25×200=**$5,000** if allowed | Annual credits | Yes (vendor) | Unverified (INT as line) | Status | None listed |
| StanfordTax Prem | $18/return | **$3,600** | Credits n/a expire | Email only (Reddit) | Unverified | No | 5 free |
| Grove Collect | 25 free + quote | **$0** thru 2026-10-15; then 25 free + quote (SOTA2 $10×175=**$1,750 unverified**) | None | Not claimed | Form-type lines in marketing | No | Free now |
| Liscio Platform | $49/user/mo | **$588 + $1,000** organizers = **$1,588**; or Tax Team **$1,188 + $500** overage | Annual shown | Optional, $ unpublished | Unverified | No | Demo |
| SmartVault + AI | $65×2 seats | **$1,560 + $2,500** (4×$625) = **$4,060** | Ann. seats; AI no LTC | Unverified | Unverified | No | Demo |
| Content Snare | active-request | **Custom $2,580+**/yr (200 concurrent); Pro $1,428 only covers 100 | Cancel anytime | Capped 400+ on Custom | No | No | 14d no card |
| Double Core | $10/client/mo | **Wrong product** (~$24k if 200 ledgers); Tax Suite floor **$2,400**/yr | Pilot contract | Twilio unverified | n/a (books) | Close, not 1040 | Demo |
| ClientBrief | $7.99/mo flat | **~$96**/yr | Month-to-month | Not claimed | Manual | No | Unverified |
| Qount Pro | $114/user/mo ann. | **$1,368** + onboard fee | Ann. or monthly | 500 msgs incl. | Unverified | Unverified | No — demo |
| Truss | custom | **Unverified** | Unverified | Unverified | Unverified | Unverified | Demo |
| **Wedge** | $299/season | **$299** | Season | SMS-first | One PDF/acct (intent) | Hard block (intent) | Founding refund (Kit A) |

---

## Where the offers fail the small firm (5 gaps the $299 wedge can exploit)

1. **Seat + suite tax vs a season ticket.** TaxDome $800, Canopy $888, Karbon $708, SmartVault $1,560 (2-seat min), Liscio Platform $588 — all **year-round OS** the solo already may own or refuse. None sell “chase only, Nov–Oct, $299.” FC Solo is cheaper (**$228**) but **strips auto-SMS**. Evidence: 3-year TaxDome prepaid revolt; Canopy credit surprise; SmartVault min seats.

2. **SMS is an upsell, a cap, or missing.** TaxDome: Twilio fees **and** no auto-SMS. FC: Scale-only. Content Snare: **40 SMS/mo** on Basic (~one text per 5 clients). Canopy/StanfordTax/Grove/Karbon: **email/push**. Liscio/Qount: optional/metered. Only Soraban treats SMS as default — behind **minimums + $1k–$4.5k onboard**.

3. **Per-return AI intake prices the 200-return book out.** StanfordTax **$3,600**; Canopy Smart Intake **~$6.6k**; SmartRequestAI **$2,500** on top of vault; SafeSend **~$3k** practitioner. Grove’s **25 free + unpublished overage** is the only cheap PY-parse offer — and it **hides the 200-return number**.

4. **Consolidated-1099 still only proven-broken at Gather.** Smoking gun is SafeSend+Lacerte (`1qhdxp8`). StanfordTax/Grove/Soraban **unverified** as anti-explode; Grove/Soraban **marketing even lists 1099-INT as a line**. No vendor **sells** “one PDF per account” as the offer.

5. **Gating is an engagement-letter sentence, not a SKU.** Pipelines exist (TaxDome/Canopy/Karbon); none **productize** Incomplete → blocked from prep. SafeSend users even complain completion % is “interpretation” (`1itux27`). Firms that already wrote “we don’t start until complete” have nowhere to **buy** that rule.

---

## What materially threatens the $299 wedge

- **Grove Collect free through 2026-10-15**, then 25 free/season, no seats — live during extension chase; if they add SMS + account-level 1099 + a gate, the wedge is a feature flag.  
- **StanfordTax $18/return, 5 free, no minimums, self-serve** — occupies the “sub-150 empty slot”; Karbon distribution (Dec 2025). Email-only is the hole, not the price.  
- **ClientBrief $7.99/mo (~$96/yr)** — same “link + checklist + reminders, not a portal” story. Weak on PY parse/SMS/gate, **strong on price optics** (“$299 vs $96”).  
- **FC Solo $228** — if a prospect already bought it, $299 is a **second** chase tool.  
- **Soraban actually quoting Collect under 250** (Reddit 200-return customer) — minimums thesis leaks; they already do SMS+PY checklist.  
- **TaxDome/Canopy incumbency:** bolt-on only; a fourth login dies (`1u6sp0l` stitch pattern).

---

## Sources that failed / unverified

- TaxDome.com and help.taxdome.com **Cloudflare-blocked** on fetch; prices from search snippets of the same URLs + [taxdome.com/sms](https://taxdome.com/sms). Homepage quote from search, not a clean DOM.  
- **SafeSend dollar card** still unpublished; $15/return = r/taxpros snippet. SMS channel unverified.  
- **Soraban list price and minimum** cannot be reconciled (50 vs 150 vs 250 vs 300).  
- **StanfordTax/Grove 1099 grouping:** still no practitioner thread equivalent to Gather; Grove screenshots are form-type.  
- Grove testimonials + “3× completion” + SOTA2 **$10/return**: vendor/secondary.  
- Canopy/Liscio/FC/Double **SMS per-message rates**: unpublished.  
- Karbon Guided Plus **dollar fee**: unpublished. Qount onboarding fee: unpublished. Truss: all commercial terms unpublished.  
- ClientBrief trial/guarantee/SOC2: not on homepage fetch.  
- G2 1★ full bodies mostly snippet-truncated; Capterra TaxDome 3,594 rating not re-fetched.  
- TaxDome 14-day trial: third-party 2026 (checkthat.ai), not confirmed on blocked pricing page.  
- Double Core/Plus/Scale dollars from **blog** (Scale launch), not the JS pricing grid (fetch omitted the $10/$25/$50 tiles).  
- Content Snare overage SMS price: unpublished.  
- Whether any vendor’s DPA covers 7216 contractor notice: not fetched.
