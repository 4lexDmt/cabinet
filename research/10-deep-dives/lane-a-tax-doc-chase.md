# Lane A deep dive — tax-season document chaser (accounting-P1)

- **Researched:** 2026-09-18. Builds on `02` (accounting-P1), `06` (Soraban-minimums thesis), `08` (FLY, PAY 76.8, caveat “clients still ignore email”), `09` (Kit A, $299/season). Does not restate those files.
- **Searches/fetches this run:** 40+ distinct web searches and page fetches (IRS 7216 center + FAQs, Treas. Reg. §301.7216-2, Pub. 4557, IRS IR-2026-52, competitor pricing pages, G2/Capterra snippets, r/taxpros, TaxProTalk, NATP/NAEA). Hours-quantification searches failed twice; those numbers stay vendor-labeled or unverified.
- **Headline change vs `06`:** the empty niche is no longer “AI intake under Soraban’s minimum.” StanfordTax ($18/return, **no minimums**) and Grove (first 25 free, no seat fees, free through Oct 15, 2026) already parse last year’s return into a checklist. The surviving wedge is narrower: **SMS-first + one-PDF-per-account (anti-exploded 1099) + a hard block on the prep queue**, sold as a $299/season bolt-on, not a portal.

---

## 1. Workflow anatomy

**Season calendar (TY2025 returns, filing year 2026).** IRS: calendar-year 1040 due **April 15, 2026**; Form 4868 extends *filing* (not payment) to **October 15, 2026** ([IR-2026-52](https://www.irs.gov/newsroom/if-you-need-more-time-to-file-request-an-extension); [Pub. 509](https://www.irs.gov/pub/irs-pdf/p509.pdf)). Estimated-tax installments: Apr 15 / Jun 15 / Sep 15, 2026 and Jan 15, 2027. Firm practice (not IRS): organizers + engagement letters go out **late December–first week of January** ([AICPA](https://www.aicpa-cima.com/professional-insights/article/tax-season-prep-more-organized-more-efficient); [US Tech Automations 2026 pre-flight](https://ustechautomations.com/resources/blog/automate-tax-season-pre-flight-checklist-for-cpa-firms-2026)). Internal completeness cutoffs in live letters: **February 24** (Grieb CPA, TY2024 letter) and **March 15, 2026** with an **August 31** extension-file cutoff ([McCPA 2025 1040 EL](https://mccpa.com/wp-content/uploads/2026/01/2025-1040-Engagement-Letter.pdf)). NJCPA 2026: do not start prep until retainer (if any) + signed EL + completed organizer are in ([NJCPA, Jan 20, 2026](https://www.njcpa.org/stayinformed/news/blog/post/njcpa-focus/2026/01/20/6-engagement-letter-tips-for-busy-season)).

**How the chase actually runs at a 1–3 person shop** (community + those ELs, not a time-and-motion study):

1. **Engagement letter (Dec–Jan).** Owner personalizes last year’s template; e-sign via TaxDome/DocuSign/SafeSend. Hours: low per client, high in batch. Pain is getting the *spouse* to sign (r/taxpros SafeSend thread).
2. **Organizer / document-request list.** PDF from Drake/Lacerte/UltraTax, or a portal questionnaire. Seeded from last year when the firm bothers. Clients skip it, drop a shoebox, or upload the wrong thing.
3. **Client silence (Jan–mid-Feb).** Email ignored. r/taxpros: “Your problem is most likely that your clients don't read their email though, so no amount of email reminders will work!” (snippet, `1ezn9mn`). This is the FLY caveat made operational.
4. **Chase (Feb–Apr, then Jul–Oct for extensions).** Admin or owner: portal nudge, email, phone. Cadence in one office: “We ask every 2–3 weeks… charges will be incurred if we need to ask again. They will go to the back of the line” (snippet, `1t4n0ht`). Complex files get a separate Excel sheet (`1pk6lus`). Hours **burn here and at step 5**, not at EL.
5. **Completeness check.** Preparer opens the pile: front page of a brokerage summary instead of the full 1099-CONS; 48 phone photos; W-2 stubs not 1099-R; SSA benefit letter not SSA-1099 (`1rwtjvq`). “So rare to not have to ask for missing items that it's like a gift” (snippet). Interrupts prep: “the last thing you need to finish but now you have to come back.”
6. **Prep queue.** Lacerte “Waiting on Docs” / TaxDome pipeline stage. Many firms *say* they won’t start; owners still start incomplete files because April 15 is a wall.
7. **Extension fallback.** Auto-extend if docs miss the internal cutoff; payment still due Apr 15. Second market: May–October is the same chase on a thinner staff, with corrected 1099s still arriving. McCPA’s letter: if info is not in by August 31, they cannot promise October 15. That is a *second* completeness cliff, not leftover April work.

**Where hours go (directional, not a survey):** batch EL/organizer send is a December weekend; the recurring burn is (a) noticing what’s missing against last year, (b) writing the nth reminder, (c) re-opening a half-prepped return when the 1099-B finally lands. Transcripts (IRS wage-and-income) are the skip-the-chase workaround once TDS is up — too late for April for many. Broker-direct standing orders (“advisor emails us the PDF”) are the other skip, and they only cover the clients with an advisor who will cooperate (`1kbajjx`).

**Calendar the wedge must honor:** Dec 15–Jan 7 send; Feb 1 first SMS wave; Feb 24–Mar 15 firm cutoff; Apr 1–15 extension factory; May–Aug extension chase; Sep 1 last-chance completeness; Oct 15 hard stop. A product that only works Jan–Apr leaves half the season (and Grove’s current free window) on the table.

---

## 2. Persona map

| Role | Feels the pain | Buys | Can veto |
|---|---|---|---|
| **Owner / solo EA or CPA** | Nights chasing; realization destroyed; they *are* the admin | Yes — card, Nov–Jan tooling decision | Themselves (software fatigue) |
| **Admin / receptionist** | Job *is* the chase; TaxDome tags; Excel | No | Can sabotage a tool they hate |
| **Preparer (W-2 or seasonal)** | Interrupted workflow, missing-page 1099s | No | Informal: “this organizer is garbage” |
| **Spouse / office manager** in a 2-person shop | Same as admin | Shared | Yes if they own the portal |

**Firmographics**

- **Solo EA, 80–250 1040s.** Highest pain-per-head. Buys Drake-class stacks. Will pay $299 if setup is done *for* them. Veto: “clients won’t text / won’t use another link.”
- **2–3 person CPA, 200–400 mixed 1040 + 1120S/1065.** Admin exists; owner still reviews. Already owns TaxDome/Canopy/Liscio or regrets the 95-hour setup (`1tj6rp6`). Buys a bolt-on only if it does not become a second portal.
- **Bookkeeping / CAS, monthly statements.** Same chase, year-round, different artifact (bank PDF, not 1099). Adjacent, not v1 (see §8).

**Return mix:** 1040-heavy is where last-year → one-PDF-per-brokerage-account is obvious. Business returns need P&Ls, K-1s, books — a different completeness definition. Monthly bookkeeping is a second product. Mixed shops (1040 + a dozen 1120S) should still be sold the 1040 chase only in v1; do not let a K-1 delay the 1040 gate. New clients (no prior-year file) need a generic first-year checklist — a v1.1 edge, not a reason to skip roll-forward, which is 80%+ of a continuing book.

---

## 3. Root causes

1. **Client behavior is stable.** Same offenders, year after year, “even after explaining and demanding” (`1rwtjvq`). Incentive mismatch: the firm eats the hours; the client feels no cost until someone bills for the chase or pushes them to the back of the line.
2. **Portal fatigue / password walls.** Clients will not create another login. Vendors now compete on **magic links / passwordless** (SafeSend “97% authentication success,” StanfordTax “no usernames,” Grove “no app, no signup,” Liscio Smart Requests “no app or password”). Email reminders still lose to texts people actually see.
3. **Consolidated-1099 explosion.** Brokers emit 26–300 page packets; banks password-lock PDFs so they will not merge (`1bl9oir`). SafeSend Gather’s load-bearing failure: it “reads every component of a consolidated 1099 as a separate document request… Morgan Stanley #1234 1099-INT, the 1099-DIV, and then also the 1099-B… we scrapped the entire thing” (`1qhdxp8`, snippet). **One-PDF-per-account is not a nice-to-have; it is why Gather lost a trial.**
4. **Organizer design.** Generic PDFs ask for everything; clients send summaries they wrote themselves. AICPA still pushes organizers as communication tools; practitioners report they are unread.
5. **Software that “solves chase” adds setup.** TaxDome pipelines *can* gate on client tasks; firms do not finish configuration (G2: steep learning curve, 10–15 hours to start; Reddit: 95 hours then regret).
6. **1099 calendar vs April 15.** Corrected brokerage 1099s land in March. Completeness is a moving target; a hard block must allow “complete enough to extend” vs “complete enough to file.”

---

## 4. Quantification

**Non-vendor hours: thin.** Two dedicated hours-survey searches this run **errored**. Treat every minute-saved figure as vendor unless noted.

| Claim | Number | Source class |
|---|---|---|
| Canopy Smart Intake | “as much as **20 minutes per client**” | Vendor press, Jul 22, 2025 (`02`) |
| Soraban Collect | “**83 min** saved per return on average” | Vendor page, fetched 2026-09-18 |
| Financial Cents | “**56 hours a month** & **$19,200**/year” | Vendor pricing page, live 2026 |
| SmartRequestAI | “**2–4 hours** per client per tax season” | Vendor estimate, cited in Uncle Kam 2026 review — **vendor-sourced** |
| SafeSend skeptic | “saving maybe **5 minutes**… $15ish per return… $30K a year. That’s half a full time secretary” | r/taxpros `1itux27` (snippet) |
| Source-doc sort timer | “**.1 and .15 of an hour** per return” for sorting/routing ~900 returns | Same thread; one practitioner with a timer — not chase, just filing |

**Worked examples (arithmetic on the above, labeled):** 20 min × 200 returns = **67 hours**/season (Canopy). At BLS May 2025 median **$22.86/hr** for secretaries/admin excl. legal/medical/executive ([CompSignal citing OEWS](https://comp.falconincentives.com/salary/43-6014)) that is ~**$1,530** of admin time — *if* the Canopy 20 minutes is real. At owner realization, 67 hours is the expensive number. Soraban’s 83 min × 200 = 277 hours is not credible as *chase-only* without a third-party study.

**Workaround cost (stronger, because it is posted pay):**

- US remote VA whose duties are TaxDome docs + “tracking missing information”: **$30/hr** W-2, $60–70k posted, 30–40 hrs/wk ([Agorist Tax Advice listing, Sep 16, 2026](https://jobfound.org/job/agorist-tax-advice-pllc-is-hiring-for-virtual-assistant-remote-usa-16-september-2026)).
- Offshore admin document assistant: **$1,000–$1,400/mo** contractor ([Somewhere/Jobera, first seen May 6, 2026](https://jobera.com/job/somewhere-admin-document-assistant-tax-accounting-57861146131-17745291/)).
- Accounting VA bands: US ~**$18–40+/hr**; outsourced **$15–45/hr** or **$2,500–$6,500/mo** FTE (Wow Remote Teams / VirtualAssistantVA — **staffing-vendor**).
- Seasonal tax admin: **$20–$25/hr** (RKL LLP 2026 posting).
- BLS tax preparer median May 2025: **$54,912** / $26.40/hr (OEWS 13-2082). Every hour a preparer spends nagging is at least that.

**$299/season vs those substitutes:** cheaper than one month of offshore admin, ~10 hours of US VA, or ~2% of a $15k SafeSend-at-$15/return book (practitioner-reported, not vendor card). Realization leak is the owner’s night: **unverified** at firm level; MAP still shows small firms hourly (63% in `02`).

**Implied willingness-to-pay already in market (not our number):** FC Solo $228/yr; Content Snare Basic $420/yr (but 20-request cap fails tax season); Liscio Platform $588/yr; TaxDome Essentials $800/yr; SmartVault solo-forced-2-seats $1,560/yr before AI; StanfordTax $18 × 100 = $1,800. The $299 season ticket is a **discount to every tax-aware option except Grove’s free 25 and FC Solo (which has no SMS until Scale)**. It is *not* cheaper than “do nothing and nag from Gmail,” which is still the modal workaround — that is why discovery must hear current spend, not hypothetical savings.

---

## 5. Solution landscape, deep

Capabilities of the proposed wedge: **(A)** SMS-first reminders, **(B)** read last year’s return, **(C)** one PDF per account (not exploded 1099 lines), **(D)** block prep queue until complete, **(E)** ~$299/season, **no minimums**, **(F)** setup a solo can finish in days not 95 hours.

| Vendor | Price (as of this run) | Collection actually does | Setup | 1–3★ / complaint themes | A | B | C | D | E |
|---|---|---|---|---|---|---|---|---|---|
| **TaxDome** | US **$800 / $1,000 / $1,200** per seat/yr (1-yr Essentials/Pro/Business); 3-yr **$700–$1,100**; Pro monthly seat $100; Business seasonal $500/4 mo. SMS: **$30.15** setup + **$11.15/mo** + **$0.04**/msg. **Automated SMS reminders not available** ([help SMS FAQ](https://help.taxdome.com/article/1308-sms-communication-faq); [pricing help](https://help.taxdome.com/article/1800-taxdome-pricing-plans-us-ca) — snippets). Client *request* reminders = **email**, default every 3 days. | Organizers, client requests, pipelines. Branded app / push is a Business upsell. | G2 4.7/701: steep learning curve, “10–15 hours to start”; Reddit 95 hrs + regret; payment/Stripe revolt. Capterra 4.72 (3,594). | Miss | Partial (AI checklists claimed) | Unverified | Configurable, not opinionated | Miss (price + seats) |
| **Canopy** | **$74 / $109 / $149**/user/mo annual ([pricing](https://www.getcanopy.com/pricing/)). Smart Intake **$34/client-credit/yr** after 5 trial credits; min purchase 25. KBA $1.25. | AI questionnaires, doc checklists, automated **email** reminders, client mobile app. SMS as a first-class chase: **not on the public pricing page**. | Modular “credits” surprise. Capterra 4.53 (286). | Unverified | Yes (AI) | Unverified | Unverified | Miss |
| **Financial Cents** | Solo **$19**/mo annual; Team **$49** annual / $69 monthly; Scale **$69** annual / $89 monthly ([live pricing](https://financial-cents.com/pricing/)). Monthly Team/Scale **5-user minimum**. | Client tasks + portal on all plans. **Auto email+SMS follow-ups until complete = Scale only** ([help](https://help.financial-cents.com/en/articles/8781064-automated-client-reminders)). | Light vs TaxDome. G2 ~4.8 (120): easy; “too many clicks.” | Scale only | No | No | No | Solo is cheaper; Scale is $828/yr |
| **SafeSend (Gather)** | **Quote-only** per return/delivery; no seat fees. Practitioner: “**$15ish per return**” (`1itux27`). TR acquired; one pro said “2× the price” of TaxCaddy (`1u6sp0l`). | PDF→fillable organizers, AI DRL, passwordless portal, auto reminders (channel **unverified** as SMS). Lacerte: exploded 1099 requests. | “Jumped in December.” | Miss? | Yes (from organizer) | **Fail** (documented) | No | Miss |
| **Soraban** | **No public card** (CurateSuite, Jun 29, 2026). Own site: credit = 1 return, packages **start at 250**, onboarding **$1,000–$4,500**, 2–4 week setup ([how-returns-move](https://www.soraban.com/how-tax-returns-move-from-client-upload-to-signed-return)). Third parties conflict: $20–25 Collect, mins **50 / 150 / 250**. Reddit: user with **200** returns is a customer; another (2026) “now they require at least **300** or they won’t talk to you” (`1u6sp0l`). | Collect: guided request, **email + SMS** (and voicemail per ToolMage/Taxhance writeups), AI sort. Passwordless. Vendor: “0 hours spent chasing.” | White-glove, weeks. | Yes | Yes | Unverified (risk of line-item DRLs) | Status tracking, not a hard block | **Miss on minimums/onboarding** — but floor is **contested**, do not treat 150 as gospel |
| **Liscio** | Intelligent Files **$19**/user/mo; Platform **$49**; Tax Team **$99** (annual). Organizer **$5**; delivery **$5**. Tax Team includes 100 gatherings/user/yr ([liscio.me/pricing](https://www.liscio.me/pricing/)). | Smart Requests: magic link, conditional uploads. Tasks: reminders 5d / 1d / daily after; **SMS if texting enabled**. SOC 2 claimed. | Demo-gated. Reddit: polished, pricey; extra gather/deliver fees; comms better than TaxDome. G2: ease 9.4; account-switching friction. | Optional | Unverified | Unverified | No | Platform $588/yr sits near $299 but is a portal OS |
| **SmartVault** | Accounting Pro **$65**/user/mo annual, **2-user min** ($1,560/yr for a solo). Unlimited $85. SmartRequestAI **$12.50/return**, $625/50, never expire. SOC 2 Type 2, IRS 4557/FTC claims. | Portal + requests. AI add-on: **prior-year → personalized DRL**, auto follow-ups, docs stay in vault. | Intuit-centric. G2: price “nearly tripled” (snippet). | Unverified | **Yes** (AI add-on) | Unverified | No | Miss (min seats + per-return AI) |
| **Content Snare** | Basic **$35**/mo annual: **20 active requests**, 2 users, **40 SMS/mo**, unlimited email reminders. Plus $71 / 50 active / 100 SMS. Pro $119 / 100 / 200 SMS. ISO 27001. | Horizontal snare: link, approve/reject, SMS+email. **Not tax-proforma-aware.** 20 concurrent requests **breaks a 50–400 return season**. | Same-day first request (vendor). | Yes (capped) | No | No | No | Price yes; tax-fit no |
| **StanfordTax** | Free: 5 returns. Premium **$18/return**, credits never expire, **no minimums, no implementation fees** ([app pricing](https://app.stanfordtax.com/pricing) via CurateSuite check **Sep 1, 2026**; CEO on Tax Academy 2025 video: pay only when a doc is uploaded; 2025 promo $13.50). Enterprise $25+/return, 5,000-client min, impl. from $10k. | **Personalized organizers from tax-software backups**; DRL from proforma; magic link; **automated reminders** (email — Reddit: “Stanford Tax lacks messaging; you need to use emails,” `1u6sp0l`); auto-split/rename/bookmark workpapers; 1040/1120/1120S/1065; Karbon integration Dec 4, 2025. | Self-serve. | Miss (email) | **Yes** | Unverified (better than Gather; not proven anti-explode) | No | **$18×50=$900; $18×200=$3,600** — no min, so it **occupies the “sub-150” slot `06` thought empty** |
| **Grove** (2025–26 entrant) | **Free through Oct 15, 2026**; then **first 25 returns free every season**; past 25 = custom per-return, **no platform/seat/storage/e-sign fees, no minimums** ([grove.tax/pricing](https://grove.tax/pricing.html)). | Magic-link Collect, **smart checklists from prior-year returns**, auto categorize/rename, AI questionnaire (vendor: “3× completion vs PDFs”). SMS: **not claimed on pricing page**. | Self-serve. Testimonials on-page are **unverified** (could be marketing). | Unverified | **Yes** | Unverified | Unverified | Direct price competitor |
| **Truss** | Custom. Optional human/AI prep routing. SOC 2 / AES-256 claims; “zero §7216 headaches” **vendor slogan**. | AI checklists from tax software, login-free uploads, auto-rename, reminders. | Demo. | Unverified | Yes | Unverified | Unverified | Unknown |
| **Qount** | Essentials **$74**/user/mo annual; Pro **$114** (SMS + organizers); Intelligence $139. | Practice OS rolling out gather/deliver (Reddit 2026). | Mid. | Pro | Unverified | Unverified | Unverified | Miss |
| **Taxhance** | Founded 2025. Live product fetched: **AutoKey** data-entry **$25 → $12.50/return** (Drake/ProConnect), 5 free. Collection portal exists in older copy; **current homepage is extraction, not chase**. | Adjacent, not the wedge. | Self-serve. | n/a | n/a | n/a | n/a | n/a |
| **Juno** | $12M seed Apr 9, 2026; ~500 firm customers (Crunchbase). Extraction/validation, 90+ doc types. | Prep automation, not SMS chase. | — | — | — | — | — | — |
| **Magnetic / ATOM** | On **NATP 2026** expo floors (agentic 1040 prep / K-1 workpapers). | Downstream of collection. | — | — | — | — | — | — |

**Gap matrix (honest):** A is scarce as *default* (TaxDome auto-SMS = no; FC Scale and Liscio optional; Soraban yes; Content Snare capped). B is **crowded in 2026** (StanfordTax, Grove, SmartRequestAI, Soraban, Canopy Smart Intake, SafeSend). C is the **documented Gather hole** — still the cleanest product insight. D is **unoccupied as a productized default** (firms *write* it in ELs; software does not enforce). E still beats StanfordTax at ≥50 returns and every suite; Grove’s 25-free + unpublished overage is the price to beat on discovery calls.

---

## 6. Buyer psychology and objections

From r/taxpros + TaxProTalk (older TPT threads are structural, not 2026-load-bearing — as `02` warned):

- **“Clients won’t use anything.”** Counter-evidence in the same corpus: “2 days later he uploaded 2 PDFs. Some can be taught” (`1rwtjvq`); passwordless portals; SMS/task reminders “notifications by text” (G2 Liscio). The FLY caveat is email-shaped. Texts + a single link are the test, not another portal password.
- **Software fatigue / switching cost.** “I just spent 95 hours setting up TaxDome… I regret it.” “TaxDome feels like a lot to learn if my payback period is only a few years.” Pattern in `1u6sp0l`: **sub-300-return firms stitch 2–3 tools** (ShareFile + StanfordTax + Encyro; SmartVault solo). A *fourth* login dies; a bolt-on that emails/texts a link and dumps PDFs into the folder they already have can live.
- **What triggered past purchases:** portal replacement (ShareFile/SmartVault), e-sign, “clients can see status,” TR breaking TaxCaddy/SurePrep, wanting Gather after a demo then recoiling at exploded 1099s or price.
- **Price anchors:** SafeSend ~$15/return felt like “half a secretary” to one firm. StanfordTax $18/return with no min is now the **visible alternative**. Content Snare $35/mo. FC Solo $19/mo. **$299/season ($1.50–$6 per return at 50–200)** is below every tax-specific AI intake except Grove’s free tier. Risk: looks *too* cheap = “won’t be around in April.”
- **Fatalism vs teeth.** Offices that “ask once then back of the line” already believe in blocking. Offices that start incomplete files will not buy D. Discovery must split these tribes.
- **“I’ll just pull transcripts.”** Real workaround, and it *does* skip some 1099 chasing — once IRS TDS is up, often too late for April, and CAF/TDS outages are a 2026 complaint in `02`. A chaser that races transcripts still has a job in January–March. If a prospect’s whole strategy is “extend everyone and transcript in June,” they are an extension-season customer, not a January SMS customer.

---

## 7. Constraints and compliance (load-bearing)

**IRC §7216 / Treas. Reg. §301.7216.** Criminal disclosure/use of tax return information; civil §6713 $250/violation (IRS 7216 FAQs, marked **historical**, reviewed 2026-06-28 — still the IRS’s public explainer). “Tax return information” = everything obtained to prepare a return, including last year’s return and worksheets ([FAQ Q5](https://www.irs.gov/tax-professionals/section-7216-frequently-asked-questions)).

- **Firm using last year’s return to build this year’s DRL (in-house):** this is use *in connection with preparing the current return* — the core permitted purpose, not a newsletter/cross-sell. **No extra 7216 consent** for that use inside the same US firm (§301.7216-2(c)(2)).
- **Disclosing that return to a US SaaS vendor that only generates checklists/reminders (no tax-liability advice):** §301.7216-2(d)(1) allows disclosure to another US tax return preparer for **auxiliary services** that are **not substantive determinations**. The vendor *is* a 7216 “preparer” (FAQ Q3–Q4). Firm must give contractors the **written 6713/7216 notice** (§301.7216-2(d)(2) — software contractors; apply the same hygiene to a hosted chaser). **SSNs may not go outside the US** without a narrow, safeguarded consent (FAQ Q14–Q15). **US-only hosting is a design constraint, not a preference.**
- **SMS to the client** listing “we still need your Fidelity PDF”: disclosing *to the taxpayer* their own info is not the typical 7216 third-party problem; it is still a **use**. Conservative read: keep it auxiliary to *this year’s* prep, no cross-sell in the text. **Putting dollar amounts or TINs in SMS is a Safeguards problem even if 7216 is quiet.**
- **Consent if you want a belt:** Rev. Proc. 2013-14 electronic signature = taxpayer types name or 5+ char PIN, **not** a pre-checked box. Default consent life **one year** if unspecified (§301.7216-3). Competitors: Truss markets “zero §7216 headaches” (unverified legally). **What TaxDome/Soraban/StanfordTax put in their DPAs is unverified this run.**
- **Not legal advice.** If counsel says prior-year parse *to a vendor* still needs per-client 7216 consent, onboarding conversion drops — **kill/pivot criterion**.

**TCPA / carrier A2P.** Informational autodialed texts to mobiles need **prior express consent** (number given by the client for that relationship) — not the full “prior express written” marketing form ([Wipfli, Apr 28, 2026](https://www.wipfli.com/insights/articles/tcpa-informational-text-messages-rules-and-requirements)). Identify the firm; **STOP/HELP**; honor opt-outs **within 10 business days** (Wipfli on Apr 2025 FCC change). Do **not** mix “your 1099 is missing” with a fee upsell in the same SMS — that can flip the message to marketing (written consent). **A2P 10DLC brand + campaign registration is required in addition to TCPA** (industry rules, not a statute). “Revoke-all” FCC rule: delayed to **January 31, 2027** ([CFSLM, Jan 2026](https://www.consumerfinancialserviceslawmonitor.com/2026/01/fcc-further-extends-effective-date-for-tcpa-revoke-all-rule/)). Statutory damages **$500–$1,500 per text** — one sloppy blast is a firm-killer. **Capture SMS opt-in on the engagement letter** (Kit A Q6 is the right question).

**FTC Safeguards / Pub. 4557 / Pub. 5708.** Tax preparers are GLBA “financial institutions.” Written WISP required regardless of size ([IRS newsroom](https://www.irs.gov/newsroom/irs-security-summit-remind-tax-pros-they-need-a-written-information-security-plan-to-protect-client-data); Pub. 5708 Aug 2024). Pub. 4557 (Rev. 5-2024): MFA; encrypt sensitive email; **prefer SFTP/portal over email**; “Caution customers against transmitting sensitive data… via email.” **SMS body must be a link, never a W-2 image or SSN.** Service-provider oversight: contract must require safeguards. **SOC 2 is not in the Rule** but is what SmartVault/Liscio/Truss advertise because firms’ WISPs ask. Content Snare: ISO 27001. Breach: FTC notice generally **30 days** if 500+ consumers.

**Retention.** Grove: **7 years** included. IRS does not, in the pages fetched, prescribe a single preparer-document retention period; state boards / E&O often **7 years**. **Unverified** as a federal bright line. Design: firm-controlled retention + export, because 7216 vendors should not become the system of record. WISP vendor-oversight language from Pub. 5708: the firm remains responsible for the service provider. A chaser that holds prior-year returns is a **high-sensitivity** vendor in that plan — expect owners to ask for a SOC 2 report and a BAA-like DPA even though HIPAA may not apply.

**Showstopper watch (not confirmed, but design-critical):** if the SMS names the brokerage (“send the Schwab 1099”), some conservative CPAs will call that tax-return information in an unencrypted channel and refuse. The safe v1 copy is: “We still need 1 file. Upload here: https://…” with the account name **only behind the magic link**. That also reduces TCPA “content” risk and phishing-lookalike risk (Pub. 4557 spear-phishing section: clients are trained *not* to click). Use a firm-branded sending number and put the firm name in every SMS so it does not look like a broker scam.

**Design changes this section forces:** US data residency; 7216 contractor notice in the MSA; EL checkbox for SMS; STOP handling; **no account names, SSNs, or dollar amounts in the SMS body**; SOC 2 Type 1 at least before charging strangers in January; do not train models on client returns (Taxhance/Truss already claim this — table stakes); magic-link domain that matches the firm’s website as closely as registrars allow.

---

## 8. Segment prioritization

**First: 1040-heavy solo EAs and 1-person CPAs, ~80–200 returns, Drake or Lacerte/ProConnect, currently email + Drive or a barely-used portal.** Why: (1) owner = buyer = chaser; (2) no admin FTE, so $299 replaces nights not a $30/hr hire they already made; (3) 1040s have a stable prior-year account list; (4) StanfordTax at $18 × 150 = $2,700 makes $299 an easy “I’ll try it” if setup is done for them; (5) r/taxpros + NAEA/NATP are reachable. US Tech Automations’ own 2026 guide calls **1–2 person / <100 returns a weak fit for heavy automation** — that is positioning, not a reason to skip; it means sell *opinionated and hosted*, not a Zapier science project. Solos under ~50 returns can still buy, but dollar savings vs nagging from the owner’s phone are small; they are not the conversion core.

**Do not lead with “2–10 person CPA firms” just because PCPS ranks tax-law complexity #1 there (`02`).** Those shops have an admin and a suite; they are the TaxDome-fatigue bolt-on *second* motion, after the solo proof.

**Geography:** no evidence this pain is state-specific. High-brokerage coastal retiree books (FL/AZ/CA snowbirds) will have worse 1099-CONS packets; that is a *message* nuance, not a geo lock. OBBBA new tip/OT docs (`02`) make 2026 organizers longer — a why-now for completeness, not a separate product.

**Second: 2–3 person shops already angry at TaxDome/Canopy** who will only take a **bolt-on** (files still land in TD/SmartVault). Do not ask them to rip the suite.

**Defer:** bookkeepers’ monthly-statement variant (different calendar, different ICP); 1120S/K-1 factories; anyone over ~400 returns (Soraban/StanfordTax/Grove sales motion already hunting them).

**Geo/season:** national. Extension season (now → Oct 15, 2026) is a **live second market** and a Grove giveaway window. Snowbird/retiree 1040 books (brokerage-heavy) feel consolidated-1099 pain hardest.

---

## 9. Channel map, sharpened

**r/taxpros.** Restricted; approved submitters; flair; on-topic; taxpayers → r/tax ([welcome post](https://www.reddit.com/r/taxpros/comments/1anssy7/welcome_to_tax_season_some_reminders/)). Wiki fetch this run returned a Reddit JS wall — **full rule text unverified**. Adjacent r/taxpro explicitly bans ad posts, allows relevant replies. Kit A’s “no solicitation / comment then DM” remains the safe play. Cold landing-page posts will get the account banned.

**TaxProTalk.** Older, practitioner-longform; TaxDome vs Drake, organizers, SmartVault. Culture: skeptical of vendors, detailed workflow. Good for lurking; bad for a new-account pitch.

**Influencers (verified 2026, not 2022 lore).** Jason Staats / Realize: CPA Practice Advisor **40 Under 40 Apr 10, 2026** — “most influential online accounting… podcast **>1,500** firm owners/day; YouTube **44,000**; LinkedIn **>65k**.” He also did a **Canopy-sponsored** AMA Jul 14, 2026 — treat him as **vendor-adjacent**, not a neutral reviewer. Verito’s 2026 list also: Blake Oliver, Jody Padar, Ryan Lazanis, Logan Graf. #TaxTwitter as a named scene: **reach in 2026 is LinkedIn + YouTube + podcasts more than Twitter** (same Verito piece).

**Associations.** NATP Taxposium **Jul 13–15, 2026** Cleveland expo (Drake, Thomson Reuters/SafeSend, Magnetic, ATOM, TaxOffice AI). NATP Tax Forums expo same cluster. NAEA Strategic Partnership **$7,500–$12,500** per conference; **8,000+** members ([NAEA](https://www.naea.org/strategic-partnership-program/)). CA NATP chapter vendor tables (San Diego Aug 17–18, 2026). **July expos are for TY2026/filing 2027**, not for a Nov–Jan 2026–27 pilot. Use chapters and email lists, not the national expo, for *this* window.

**What converts at $299:** practitioner Reddit comments, Drake/Lacerte Facebook groups (unverified rules), NAEA state CPE breakfasts, “founding 5” scarcity. Tools that launched here: Financial Cents (content + cheap Solo), StanfordTax (CPA Academy webinars + Karbon), Grove (extension-season free). TaxDome used NAEA sponsorship — **wrong price point to copy**. Jason-on-Firms / Realize is high reach and **Canopy-entangled**; a guest slot is worth asking after three paying firms exist, not as a launch bet. NATP chapter tables (CA example: economy/standard/premier, reserve by July 30 for an August meeting) are cheap compared with NAEA $7.5k+ national, and they sit in front of EAs — the ICP.

---

## 10. What to do (synthesis)

**ICP one-liner:** 1040-heavy US solo EA/CPA, 80–200 returns, still chasing by email/Excel, who already *wrote* “we don’t start until the file is complete” in the EL and does not do it.

**V1 (5–8):** (1) ingest last-year backup from Drake or Lacerte/ProConnect; (2) DRL grouped **one upload per financial account**, W-2, 1099-NEC, 1098, 1099-R — never exploded 1099-INT/DIV/B lines; (3) magic-link upload, no client password; (4) **SMS-first** cadence with email CC, STOP, state-aware (don’t nag for items already in); (5) **hard status: Incomplete / Ready to prep / Extended** — Ready is mechanically blocked; (6) owner dashboard of who is late; (7) EL-ready 7216 contractor + SMS consent language; (8) white-glove import for founding firms, files exportable to Drive/SmartVault.

**Explicitly out of scope:** practice management, billing, 8879 delivery, AI data-entry into the tax engine (Juno/Taxhance/Magnetic), 1120S/K-1 completeness, monthly bookkeeping, replacing TaxDome.

**Positioning:** “Not another TaxDome. Not Soraban’s onboarding call. **$299/season, no minimums.** We text clients for one PDF per account from last year’s return, and the return **cannot enter prep** until the file is green. Passwordless link. You keep Drake.” Against StanfordTax: they organize beautifully at $18/return and still **email**; they do not block. Against Grove: free/cheap Collect is a **real** alternative — win on SMS + blocking + 1099 grouping, or lose.

**Pricing:** Keep **$299 founding / refund through Jan 31** for the five pilots (`09`). List after pilots: **$499/season** or **$3/return with a $249 floor** — still under StanfordTax at 80 returns ($1,440) and under one month of the $30/hr VA. Do not stay at $299 list: support + Twilio + 7216 liability are not a $1.50/return business at 200 returns.

**GTM (this calendar):** Sep 18–Oct 15, 2026 = **extension-season conversations** (firms still chasing) and Grove’s free window (ask “did you try Grove?”). Nov–Dec = tooling budget; white-glove onboard 5. SMS live before **Jan 15**. Do not attempt NATP July for *this* season. Founder comments on `1rwtjvq` / `1t4n0ht` / `1u6sp0l` / `1qhdxp8` from a real account; DM only engagers.

**Risks + kill criteria (updated):** (1) StanfordTax or Grove ships SMS + anti-exploded-1099 + a prep gate before you have 5 paying firms → **kill or become a workflow opinion on top of their API**. (2) Counsel: vendor parse of prior-year returns needs per-client 7216 consent and firms refuse to collect it → **kill**. (3) Discovery: ≥10/15 already start incomplete files and will not honor a block → **D is theater; do not build**. (4) Soraban actually selling Collect at 50–80 returns with no $4.5k fee (Reddit 200-return customer) → minimums thesis in `06` is leaky; still differentiate on price/SMS/block. (5) TCPA class-action from a STOP miss → existential; build STOP before the second text.

**Kit A sharpening (for `09`):** keep the $299 founding offer and the EL-SMS question. Add to the script: “Have you seen StanfordTax at $18/return with no minimum, or Grove’s free Collect this extension season?” Log verbatim. Add: “Would you let software stop you from opening an incomplete file in March?” If they use TaxDome already, sell bolt-on + SMS (TaxDome cannot auto-SMS today), not rip-and-replace. Do not lead with “Soraban won’t talk to you under 150” — that fact is contested. Lead with exploded 1099s and the prep-queue block.

**Five discovery questions desk research cannot answer:**
1. Last incomplete file: **who** chased (you vs admin vs nobody), **how many** touches, and did you **start prep anyway**?
2. If the software refused to let you open the return until the Fidelity PDF landed, would you **honor that in March** or override it?
3. Show last year’s DRL: do you want **one Morgan Stanley PDF** or every 1099 box called out? (Watch the Gather-trauma reaction.)
4. Will you put **SMS opt-in in the 2026 EL**, and what % of clients have a cell on file today?
5. You can have StanfordTax at $18/return with no minimum **this week**, or this chaser at $299 with blocking. **Why would you pick us?** (If they cannot answer, do not build.)

---

## Sources that failed / open questions

- **Hours-chasing survey searches failed twice** this run; no AICPA/PCPS time-and-motion on “minutes per missing 1099.” Canopy 20 min / Soraban 83 min / FC 56 hrs remain **vendor**.
- **r/taxpros wiki/rules page** returned a Reddit challenge wall. Exact “no advertising” clause **unverified**; welcome post does not state it.
- **StanfordTax live pricing page** (`app.stanfordtax.com/pricing`) rendered nearly empty; $18/no-minimums from CurateSuite **2026-09-01** + 2025 webinar transcript. Re-check before a price war.
- **Soraban public price and minimum** cannot be reconciled (50 vs 150 vs 250 vs “300”). Treat as **sales-quoted**.
- **SafeSend dollar card** unpublished; $15/return is **practitioner snippet**, ~$20/return in older `02` lore **not re-verified** on a vendor page.
- **7216 treatment of SMS content** and **what incumbents put in 7216 consents**: no primary competitor consent form fetched. IRS 7216 FAQ page is labeled **historical**.
- **Federal preparer data-retention period**: not a single number in Pub. 4557 fetch.
- **Grove testimonials** and “3× completion” : vendor page only.
- **TaxDome help center** (pricing article) Cloudflare-blocked on one fetch; prices from search snippets of the same URLs + taxdome.com/pricing.
- **G2 1-star TaxDome bodies** mostly not in snippets (overall 4.7); Reddit remains the honest 1–3★ corpus.
- **Whether StanfordTax/Grove request exploded 1099s:** unverified; only Gather has a smoking-gun thread.
- **#TaxTwitter named-account reach in 2026:** not independently counted; influencer list is a vendor blog (Verito).
- **Open question for pilots:** does a magic-link SMS from an unknown A2P number get filtered, or do clients treat it as a phishing text (Pub. 4557 trains them to)? Unverified until a firm actually sends.
