# Lane A market sizing — $299/season SMS tax-doc chaser

- **Question:** is the 50–400-return independent US tax/bookkeeping firm problem big enough to monetize for a solo builder, and what is the realistic revenue ceiling?
- **Date:** 2026-09-18. Extends `10-deep-dives/lane-a-tax-doc-chase.md` §§4, 8, 10 and `06` accounting-P1. Does not restate the wedge, compliance, or competitor matrix.
- **Method:** bottom-up from public counts → serviceable funnel with labeled assumptions → WTP anchors → S1/S3 revenue, CAC, LTV. Every figure is sourced or marked **estimate/assumption**.

---

## 1. Population, bottom-up

### 1.1 People (not firms)

| Population | Count | As-of | Source |
|---|---:|---|---|
| Current PTIN holders (anyone paid to prepare a federal return) | **886,338** | 2026-09-01 | [IRS Tax Professional Management Office statistics](https://www.irs.gov/tax-professionals/tax-professional-management-office-federal-tax-return-preparer-statistics) (fetched 2026-09-18; page also showed 879,698 as of 2026-08-01) |
| CPAs among PTIN holders | **209,076** | 2026-09-01 | Same IRS table |
| Enrolled agents among PTIN holders | **71,966** | 2026-09-01 | Same. June 1 snapshot was 67,915 ([Ledgerism 2026 tax-prep report](https://ledgerism.net/tax-preparation-industry-report-2026/) citing IRS RPO) |
| Attorneys among PTIN holders | **26,256** | 2026-09-01 | IRS TPMO |
| 2026 AFSP records of completion | **72,049** | 2026-09-01 | IRS TPMO (credentials overlap; rows must not be summed) |
| NAEA members | **9,779** | 2026-06-30 | [NAEA FY26 recap](https://www.naea.org/future-belongs-to-enrolled-agents-2026/). Partnership page claims **10,000+** members and 43% solo ([NAEA Strategic Partnership](https://www.naea.org/strategic-partnership-program/)) |
| NATP members | **>23,000** | 2026 | [NATP Taxposium 2026 release](https://sacramento.newsnetmedia.com/story/330081/taxposium-2026-opens-as-natp-honors-member-and-chapter-award-recipients/) |
| AICPA members | **397,000** | 2025 | [AICPA MAP release](https://www.aicpa-cima.com/news/article/cpa-firms-report-steady-growth-in-revenue-and-profit-aicpa-research-finds) (members ≠ firms; includes industry/gov/education) |
| IRS e-file EFINs | **>340,000 active** | 2020 | IRS Pub. 3415 (Rev. 6-2025), citing IRS e-services. **No 2026 nationwide EFIN total found.** ~30k issued / ~23k deactivated around FS2021 |

PTIN holders are **people**. Seasonal chain staff, moonlighters, and multi-credential overlap make 886k unusable as a firm TAM.

### 1.2 Employer firms (Census)

| NAICS | What it is | Firms | Establishments | Year | Source |
|---|---|---:|---:|---|---|
| 541211 Offices of CPAs | CPA practices (tax + audit + CAS) | **51,839** | **55,346** (SUSB 2021) / **55,052** (CBP 2023) | 2021 / 2023 | SUSB 2021 via [Ledgerism 2026 bookkeeping report](https://ledgerism.net/bookkeeping-services-market-report-2026/); CBP 2023 via [entitycodes.org/541211](https://entitycodes.org/naics/541211/) (verified 2026-06-28, cites Census CBP) |
| 541213 Tax preparation services | Non-CPA tax-only shops (includes chains) | **19,491** | **33,293** (SUSB 2021) / **28,762** (CBP 2023) | 2021 / 2023 | SUSB via Ledgerism; CBP 2023 [data.census.gov 541213 profile](https://data.census.gov/profile/541213_-_Tax_Preparation_Services?codeset=naics%7E541213&g=010XX00US) |
| 541219 Other accounting services | Bookkeepers, non-CPA accountants, billing | **44,726** | **45,775** | 2021 | SUSB 2021 via Ledgerism (CBP 2023 541219 total **not retrieved** this run) |
| 5412 (all four 6-digits incl. payroll) | Accounting + tax + books + payroll | **120,379** | **139,959** | 2021 | SUSB 2021 via Ledgerism |

**Size distribution (NAICS 5412, SUSB 2021, Ledgerism table):** fewer than 5 employees **88,724 firms (73.7%)**; 5–9 **18,359 (15.2%)**; 10–19 **7,650**; combined **<20 employees = 95.3% of firms** but only 30.3% of employment. The 487 firms with 500+ employees hold 56.1% of payroll. This is a barbell: micro-firms by count, giants by volume.

AICPA does **not** publish a census of sole-practitioner firms. Closest survey mixes: 2025 MAP, 1,073 completers, **81%** with net client fees **<$5M**; **21%** of the pie chart is labeled `<$200k` NCF ([MAP executive summary](https://www.incpas.org/wp-content/uploads/2025/12/2025-national-map-survey-executive-summary.pdf) — survey-biased, not a population share). 2024 PCPS Top Issues (n=667): **25% sole practitioners**, **27% 2–5 professionals** ([PCPS 2024 commentary PDF](https://downloads.ctfassets.net/rb9cdnjh59cm/6sSdrIF0b94XUqkHKKiu5e/dcd834037adc740aa3f1111004d2aa05/2409-578553_FE_1.0_BsMT_PCPS_Top_Issues_Survey_R6-2.pdf)). 2026 PCPS (n=629) splits solos vs 2–10 as named groups but **does not publish those shares**.

Nonemployer (zero-employee Schedule C) tax and bookkeeping shops are **material and uncounted here**: Census NES 2022/2023 US files and API both required a key / 404’d this run.

### 1.3 Chains to subtract

| Chain | Locations | Returns (if published) | Source |
|---|---:|---|---|
| H&R Block US | **6,701 company-owned + 2,013 franchise = 8,714** (as of 2025-03-31) | **11.3 million** US assisted FY2025 | [HRB Form 10-K year ended 2025-06-30](https://www.sec.gov/Archives/edgar/data/12659/000160529725000016/hrb-20250630.htm) |
| Jackson Hewitt | **5,197** outlets (2,744 franchised / 2,423 co.); site says **>5,100** and **>2,600 Walmart** | Not in sources fetched | 2025 FDD via [FranchiseDepth JH vs Liberty](https://franchisedepth.com/compare/jackson-hewitt-tax-service-vs-liberty-tax-service/); [jacksonhewitt.com/own-a-franchise](https://www.jacksonhewitt.com/own-a-franchise/) |
| Liberty Tax | **1,663** (1,537 franchised / 126 co.), 2025 reporting year | Not fetched | 2026 FDD via [FranchiseDepth Liberty](https://franchisedepth.com/franchise/liberty-tax-service/) |
| **Chain footprint (sum)** | **~15,574** | HRB alone = 11.3M | Arithmetic on the three rows |

HRB implied intensity: 11.3M / 8,714 ≈ **1,300 returns/office** — **outside** the 50–400 ICP. Franchise/company retail is the wrong buyer.

### 1.4 Paid-preparer volume

IRS Filing Season Statistics, week ending **2026-05-08** ([IRS newsroom](https://www.irs.gov/newsroom/filing-season-statistics-for-week-ending-may-8-2026)): **75,316,000** individual e-files from tax professionals; **65,730,000** self-prepared; **141,046,000** total e-file; **144,992,000** returns received. Professionals = **53.4%** of e-file (derived). Mid-April print was 72.8M professional e-files ([Ledgerism](https://ledgerism.net/tax-preparation-industry-report-2026/) on IRS week ending 2026-04-17). These are **not** full-year (extensions remain). Crude PTIN load: 75.3M / 886,338 ≈ **85 e-files per PTIN** (derived; includes chain seasonal staff).

### 1.5 Serviceable population (SAM) — independent, 50–400 returns, tech-reachable

Funnel (**estimates/assumptions in italics**):

1. **Small CPA firms (<10 people):** *assume 65–80% of 51,839 CPA firms* (5412 overall is 89% <10 employees, but CPA avg is 10.3 employees/firm — so CPA shops run larger). Band **33,700–41,500**; midpoint **36,300**.
2. **Independent non-franchise 541213:** CBP 2023 28,762 tax-prep establishments − ~15,574 chain locations ≈ **13,200** independent tax-prep establishments (*estimate*; some chains sit in 541219/other; some independents are multi-office).
3. **Gross tax-capable small independents:** 36,300 + 13,200 = **49,500**, then *−10% EA/CPA double-count* → **~44,500**.
4. **In the 50–400-return band:** *assume 40–55%*. Under-50 is first-year/side-gig (r/taxpros “30 returns” threads); over-400 is already hunted by Soraban/StanfordTax/Grove. → **17,800–24,500**.
5. **1040-heavy enough for last-year→one-PDF chase:** *assume 60–75%* (write-up/CAS-only CPAs drop out). → **10,700–18,400**.
6. **Tech-reachable** (email + association or Reddit; not cash-only storefront): *assume 75–85%*. → **8,000–15,600**.

**SAM point estimate: 16,000 independent US firms in the 50–400-return band, 1040-heavy, tech-reachable. Band: 12,000–20,000** (rounded; the 8k floor is too tight against NATP 23k + NAEA 10k overlapping memberships, so the working low is 12k).

**Sanity on returns:** 16,000 × 150 avg returns = **2.4 million** 1040s ≈ 3.2% of 75.3M professional e-files. Plausible: HRB (11.3M) + JH/Liberty (*unverified*, likely several million) + large CPA/national firms absorb the rest.

### 1.6 Bookkeeping variant population

| Signal | Number | Source / note |
|---|---:|---|
| 541219 employer firms | **44,726** | SUSB 2021 (Ledgerism). Avg **5.3 employees/firm** — mostly small. |
| NAICS 5412 firms <10 emp | **107,083** | SUSB 2021 (88,724+18,359) |
| Intuit ProAdvisor network | **>500,000** professionals | [Intuit blog, updated 2026-09-08](https://www.intuit.com/blog/news-social/partnering-to-power-prosperity-intuit-and-the-accounting-community/) “over half a million… last year.” **Worldwide people, not US firms**; includes CPAs, inactive certs. |
| Bookkeeping *listings* | **36,783** (Apr 1, 2026); **27,564** (Jul 2026) | [Rentech Digital](https://rentechdigital.com/smartscraper/business-report-details/list-of-bookkeeping-services-in-united-states) (89% single-owner); [POIData](https://poidata.io/report/bookkeeping-service/united-states). Directories ≠ Census. |
| IBISWorld “payroll & bookkeeping businesses” | **331,316** (2026) | [IBISWorld](https://www.ibisworld.com/united-states/number-of-businesses/payroll-bookkeeping-services/1397/) — **modeled, paywalled; treat as nonemployer-inclusive, not SAM**. |
| AIPB members | **>35,000** | [Salary.com AIPB overview](https://www.salary.com/research/company/american-institute-of-professional-bookkeepers-overview) — secondary. |
| NAEA members doing accounting/bookkeeping | **48%** | [NAEA partnership page](https://www.naea.org/strategic-partnership-program/) |

**Bookkeeping SAM (estimate):** ~**18,000–28,000** US solo-to-3-person practices that chase monthly statements and are QBO-fluent. Point **22,000**. Overlap with tax SAM is large (same owner, two seasons): *assume 30–50% of tax SAM already keeps books*. Incremental new logos from a $49/mo variant: **~12,000–18,000** bookkeeping-first shops plus off-season expansion inside the tax book.

---

## 2. Willingness-to-pay anchors

**Per-return math (arithmetic):** $299 / 200 returns = **$1.50/return**; at 80 returns = **$3.74**; at 50 = **$5.98**. StanfordTax Premium **$18/return**, no minimums (`10` §5; CurateSuite 2026-09-01) → **$3,600 at 200 returns**. SafeSend Gather ~**$15/return** (practitioner, r/taxpros `1itux27`, not a vendor card). SmartRequestAI **$12.50/return**. Grove: first 25 free then custom.

**Adjacent annual checks (live 2026 unless noted):** Financial Cents Solo **$19/mo billed annually = $228/yr** ([financial-cents.com/pricing](https://financial-cents.com/pricing/), fetched); Team **$49/user/mo** annual; Scale (the SMS tier) **$69/user/mo** annual = **$828**. TaxDome Essentials **$800/user/yr**, Pro **$1,000**, Business **$1,200** (`10` §5; [clientbrief 2026](https://www.clientbrief.net/pricing/taxdome)). Liscio Platform **$49/user/mo** annual = **$588**. Content Snare Basic **$35/mo** with a 20-request cap that fails a tax season. Encyro ~**$150/yr** (r/taxpros `1gr5mdk` snippet).

**Elasticity, qualitative (forums, not a survey):** r/taxpros `1pa6cou` — “I like TaxDome but it’s too expensive”; reply: “Isn’t TaxDome like 800 per year? If that is too high, idk how to help you.” `1q5vs97` — TaxDome told a 30-return solo Essentials at $800; other comments call $800 “nothing” if you intend to grow, or “expensive especially for the first couple of years.” Pattern: **$150–$300/yr is the “keep expenses low” portal band; $800 is the legitimacy/OS band people argue about; $18/return is accepted only when it replaces a secretary.** $299/season sits in the cheap-portal band, **below** FC Scale SMS and **~12× cheaper** than StanfordTax at 200 returns. Risk from `10` §6 still holds: looks too cheap = “won’t be around in April.”

**Substitute cost (`10` §4, not re-derived):** $30/hr US VA; $1,000–$1,400/mo offshore admin; BLS tax-preparer median May 2025 **$26.40/hr**. $299 is <1 month of the cheap offshore substitute.

---

## 3. Revenue scenarios

**Churn justification.** Embedded tax vaults are sticky: SmartVault (GetBusy H1 2026) **0.8% monthly logo churn**, NRR 100.1%/mo, renewals **Q4-weighted** ([Investegate / GetBusy H1 2026](https://www.investegate.co.uk/announcement/rns/getbusy--getb/2026-half-year-results/9757486)). Consumer tax is not: TurboTax Online **77% retention** / 23% annual churn; QBO **83%** (Librarian Capital citing Intuit 2025 investor day). Accounting-software median **~12.5% annual** ([retentioncheck 2026](https://retentioncheck.com/churn-benchmarks/accounting-software)). A **seasonal bolt-on that is not the system of record** should churn *worse* than SmartVault and closer to TurboTax: firms forget it in May, Grove is free, Gmail nagging is $0. **Assumption: tax-only seasonal renewal 60–70% (30–40% annual churn). With the $49/mo bookkeeping attach, 75–85%** because the product stays in the monthly close.

**ARPU.** Tax-only **$299**. Books-only **$49 × 12 = $588**. Dual: *assume* tax season + 8 off-season months = **$299 + $392 = $691** (not $299+$588; that double-charges the chase months). **Blended ARPU assumption:** conservative 90/10 tax/dual; base 70/30; optimistic 55/45 tax/dual among *tax* logos, plus separate books-only logos.

| | Conservative | Base | Optimistic |
|---|---:|---:|---:|
| S1 tax firms (end of first selling season) | 25 | 70 | 180 |
| S1 books-only | 10 | 25 | 60 |
| S1 blended ARPU (mix-weighted, **est.**) | $340 | $410 | $480 |
| **S1 ARR** | **~$12k** | **~$39k** | **~$115k** |
| S1 share of 16k tax SAM | 0.16% | 0.44% | 1.1% |
| Seasonal tax churn into S2–S3 | 40% | 32% | 25% |
| S3 tax firms (cumulative net) | 80 | 220 | 650 |
| S3 books-only + dual books seats | 40 | 120 | 280 |
| S3 effective ARPU | $380 | $450 | $530 |
| **S3 ARR** | **~$46k** | **~$153k** | **~$492k** |
| S3 tax logos / 16k SAM | **0.5%** | **1.4%** | **4.1%** |

S1/S3 firm counts are **estimates**, sanity-checked against the prompt’s <0.5% / ~1–2% / ~5% bands and against TaxDome’s **15,000+ firms worldwide after ~9 years** ([PR Newswire 2026-03-31](https://www.prnewswire.com/news-releases/taxdome-publishes-first-of-its-kind-accounting-industry-index-revealing-client-bases-grew-22-in-2025-302729848.html)) and Financial Cents’ **10,000+ users** (vendor, not firms). A solo reaching 650 tax logos in three seasons is the *top* of plausible, not a plan.

**Base case (the planning number):** 70 firms in season 1 → **~$39k ARR**. Season 3: **220 tax logos (1.4% of SAM) + 120 books seats, ~$450 blended ARPU → ~$153k ARR.**

---

## 4. CAC and channel math

| Channel | Cost / reach | Notes |
|---|---|---|
| r/taxpros | **$0 media**; **91k members** | [GummySearch](https://www.gummysearch.com/r/taxpros/), updated **2026-09-18**; +9k YoY. Restricted; ads get banned (`10` §9). **Estimate:** 5–15 paying firms/season from comment-then-DM, CAC ≈ founder time only (**$50–$150** imputed). |
| NATP | **>23,000 members** | Chapter tables cheap vs national (`10` §9). National Taxposium booth **price unpublished** (Alliance packet lists a *complimentary* 10×10 package for already-accepted exhibitors — **not** the sponsorship invoice). |
| NAEA | Member email **10k**; nonmember **40k–48k** | Annual strategic partner **$29,000**. Tax Summit platinum **$13,250** (incl. 10×10); gold **$10,750**; down to exhibitor **$3,250**. Dedicated email **$3,200 / 1 blast** to 48k+. Web banner 12 mo **$9,996**. ([NAEA partnership page](https://www.naea.org/strategic-partnership-program/)) |
| IRS Nationwide Tax Forum | Booth **$3,350** std / **$3,850** late **per city**; **5 cities** 2026; **10,000+ attendees/year** | [irstaxforum.com/exhibitor_information](https://www.irstaxforum.com/exhibitor_information). Five-city sweep **$16,750** booth + travel **est. $8–12k**. *Assume* 80–150 qualified conversations, 3–8% close → **$400–$1,200 CAC** if the product exists by July (too late for *this* season’s Jan SMS). |
| CPA Trendlines | Custom content from **~$7,500**; exclusive survey **$29,000**; newsletter rates **not itemized** | [cpatrendlines.com/media-kit-faqs](https://cpatrendlines.com/media-kit-faqs/). 300k email subs; Fineberg Review **141k** (2025 est.). Audience is **47% mid-market** — partly *above* ICP. |
| Jason on Firms / Realize | **>1,500 firm owners/day**; YT **44k**; LI **>65k** | [CPA Practice Advisor 2026-04-10](https://www.cpapracticeadvisor.com/2026/04/10/jason-staats-cpa-40-under-40-honoree/181076/). **No public rate card.** B2B/finance podcast CPM **$50–$100** ([InfluenceFlow 2026 guide](https://influenceflow.io/resources/podcast-sponsorship-rate-cards-the-complete-2026-guide-for-creators-brands/)) → *illustrative* mid-roll **$750–$3,000/episode** if daily unique ≈ 1,500. Canopy-sponsored AMA 2026: vendor-adjacent. |
| Google Ads | **“tax practice management” CPC $11.14** | [Keywords Everywhere tracker](https://aibrandtracker.keywordseverywhere.com/prompt-category/tax-practice-management-software). Tax-*client* keywords **$8.84** avg CPC ([Web Tonic citing Benchmarketing 2026](https://www.webtonic.io/blog/tax-accounting-google-ads-statistics)); accountant keywords **$4–$20** ([Scale Growth](https://scalegrowth.digital/resources/ppc/google-ads-for-accountants/)). **No Keyword Planner dump this run.** Worked **estimate:** $11 CPC × 2% visitor→trial × 25% trial→paid = **~1,800 clicks / customer ≈ $2,000 CAC** — **does not pay back $299**. |

**Blended CAC bands (estimate):** organic-only **$80–$250**; organic + 1 cheap NAEA/NATP table **$250–$600**; paid search or national expo **$800–$2,200**. **Payback vs $299:** only the first two bands pay back inside one season. Ads are a trap at this price; they start to work only if list is **$499+** or LTV includes books (**§5**).

---

## 5. LTV structure and risks

| Path | Math | Band |
|---|---|---|
| Tax-only, 35% annual churn | $299 / 0.35 ≈ **$854** | **$600–$1,000** if 25–40% churn |
| Tax + books dual, 20% churn, $691/yr | $691 / 0.20 ≈ **$3,455** | **$2,000–$4,000** |
| Books-only, 18% churn (closer to FC/QBO) | $588 / 0.18 ≈ **$3,267** | **$2,500–$4,000** |

**Expansion (not in v1 ARR):** (a) per-return overage above N clients — `10` §10 already flags **$3/return with $249 floor** or **$499 list** after pilots; (b) extension-season (May–Oct) as a second ticket or included; (c) e-sign add-on (Encyro analog ~$150/yr); (d) 2–3 person TaxDome-fatigue bolt-on at a higher seat. **Realistic blended LTV for a solo’s book: $800–$1,800** (mix of tax-only churners and a minority dual). **$3k+ LTV is the books-attach case, not the default.**

**Structural risks:** seasonal forgetfulness; Grove/StanfordTax shipping SMS; TCPA/7216 killing onboarding; $299 anchoring too low to fund support+Twilio+SOC 2.

---

## 6. Ceiling and verdict

**Firms needed (arithmetic on price, not SAM):**

| ARR target | At $299 tax-only | At $499 list | At $450 blended (base mix) | At $691 dual |
|---:|---:|---:|---:|---:|
| **$100k** | **335 firms** | 201 | 223 | 145 |
| **$300k** | **1,003** | 602 | 667 | 434 |
| **$1M** | **3,344** | 2,004 | 2,223 | 1,447 |

Vs **16,000 SAM:** $100k at $299 = **2.1%** (optimistic-but-known for a 3-year niche SaaS with an elite channel). $300k at $299 = **6.3%** — above the 5% sanity cap unless price rises or books attach. $1M at $299 = **21%** — **not plausible** as a bolt-on; TaxDome’s 15k firms is a *full OS, worldwide, nine years*. Even at $691 dual, $1M is **9.0% of tax SAM** (or ~6% if books SAM is added). **The ceiling that a solo can actually occupy without becoming a 10-person company is ~$150–$300k ARR**, and it **requires** either (i) the $49/mo bookkeeping variant plus dual attach or (ii) list price **$499** as `10` already recommended.

**Where the ceiling forces expansion:** past ~$300k, sell **up-market** (400–1,000 return shops that already have an admin — TaxDome bolt-on), **adjacent workflows** (8879 delivery is explicitly out of scope in `10` but is the next paid surface), or **per-return** pricing that captures 250–400 return books at $3–$5 instead of a flat $299.

### Verdict

**Big enough only with the bookkeeping variant** (or a post-pilot lift to $499): a **~16,000-firm (12k–20k) SAM**, a **$299 ticket that is 1–2% of adjacent tool spend but too small to fund paid CAC**, and a **base-case ~$153k S3 ARR at 1.4% penetration**. Those three numbers say a solo can eat; they do not say a $1M company lives inside 50–400-return independents at this price. Tax-only at $299 clears **$100k** at ~2% SAM (optimistic) and stalls under **$250k** even at 5%. Adding **$49/mo** statement-chasing raises blended ARPU toward **$450–$690**, pays CAC back, and is the difference between a lifestyle wedge and a dead seasonal app. **$1M ARR is a different product** (up-market, per-return, or a broader practice bolt-on).

---

## Sources that failed / unverified

- **Census NES 2022/2023 nonemployer counts** for 541211/541213/541219: API required a key; FTP `nonemp22us.txt` 404. Zero-employee tax/bookkeeping shops are therefore **missing from SAM** (directionally increases the high band).
- **Census CBP 2023 541219 establishment total** and **employment-size class tables** for 541211/541213: data.census.gov JS-gated; API key required. Size mix used **SUSB 2021 NAICS 5412**, not CPA-only 2023.
- **2026 nationwide EFIN count:** not published on IRS TPMO; last hard number is **>340,000 (2020)** in Pub. 3415.
- **Jackson Hewitt / Liberty return volumes:** outlet counts from FDDs; **returns not found**.
- **NATP Taxposium 2026 booth invoice price:** unpublished; Alliance “complimentary 10×10” is for accepted exhibitors, not the sponsorship rate.
- **Jason on Firms / Realize rate card:** unpublished; CPM-implied dollars are **illustrative**.
- **Google Keyword Planner CPCs** for exact “tax practice management software” queries: not dumped; $11.14 is a third-party tracker.
- **AICPA population share of sole practitioners:** MAP/PCPS are **respondent mixes**, not a firm census.
- **IBISWorld 331,316** and Fair Market Value **37,612** 541213 establishments: **modeled, not Census**.
- **AIPB 35,000+:** secondary profile, not an AIPB primary page this run.
- **TaxDome 15,000+ firms:** vendor PR; Cloudflare-blocked company page on direct fetch.
- **Intuit ProAdvisor “half a million”:** people, worldwide, not US bookkeeping firms.
- **Full-year 2026 paid-preparer return total:** May 8 IRS stats omit most extensions.
