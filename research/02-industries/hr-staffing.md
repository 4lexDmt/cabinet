# HR & Staffing — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Recruiting/staffing agencies (temp, contract, direct-hire, 1-50 recruiters), in-house HR at SMBs (HR departments of one), talent acquisition teams. Excludes enterprise HCM buying committees.
- **Searches/fetches performed:** 13 web searches (1 additional search errored and was retried with varied phrasing)

## Industry snapshot

- US staffing market projected at $183.1B in 2026 (+2.4%), still below pre-pandemic levels; margins tight, clients hiring slowly and pushing back on bill rates (SIA US Staffing Industry Forecast, Sept 2026 update; ASA "Top 5 Staffing Trends," Jan 6, 2026: "Revenue for our industry is down, penetration rates have decreased").
- Buyers: agency owners/principals (very reachable via r/recruiting, ASA forums) and solo HR generalists at 50-500-employee SMBs (r/humanresources, SHRM).
- Software incumbents: Bullhorn dominates agency ATS/CRM with premium pricing and widely-criticized stagnation; back-office suites (Avionté ~$750/user/mo cited, Zenople ~$250/user/mo) are the expensive tier; SMB HR runs on BambooHR/Gusto/Rippling plus Excel.
- The operating climate is defined by two 2025-2026 shocks: an AI-generated applicant/fraud flood on the hiring side, and a federal immigration-enforcement surge (I-9 audits ~10x 2024 rate) on the compliance side.

## Top problems

### hr-staffing-P1. AI-generated applications and outright fake candidates have made screening slow, expensive, and untrustworthy

- **Who hurts:** Agency and in-house recruiters, especially remote IT/engineering roles; hiring managers at SMB tech companies
- **What happens now (workaround):** 30+ min manual identity checks per candidate (LinkedIn cross-referencing, IP checks, hunting mismatched phone numbers); async-video gauntlets; some abandon job boards entirely and hire only via referral; VAs hired to pre-screen at $30-85/hr (Upwork recruiting-assistant rates, per marketplace synthesis)
- **Frequency:** Daily — every posted req
- **Evidence:**
  - community https://www.reddit.com/r/recruiting/comments/1p1o2or/how_are_you_handling_the_rise_in_fake_candidates/ — "the fake candidate problem has gotten noticeably worse in the last 6-12 months... Manual checks 30+ minutes and eats up time." (snippet, ~late 2025)
  - community https://www.reddit.com/r/recruiting/comments/1gkl0u6/fake_applicants_are_out_of_control/ — "Of the last 20 engineers I've set up time with, I would say 2 were who they said they were." and "This year, at least 90% of applicants -- yes, 90% -- are fake." (snippets, ~late 2024 thread)
  - community https://www.reddit.com/r/recruiting/comments/1pighi2/candidate_impersonation_at_an_alltime_high_tips/ — "I want to say that 90%+ of the applicants aren't who they say they are - applying using LinkedIn profiles and credentials and names that aren't theirs. It's horrible." (snippet)
  - survey https://www.gartner.com/en/newsroom/press-releases/2025-07-31-gartner-survey-shows-just-26-percent-of-job-applicants-trust-ai-will-fairly-evaluate-them — "6% admitted to participating in interview fraud... Gartner predicts that by 2028, one in four candidate profiles worldwide will be fake." (July 31, 2025)
  - survey https://resumegenius.com/blog/ai-impact-on-hiring-2026 — "58% of hiring managers have encountered AI-generated resumes or cover letters; 17% have caught candidates using deepfake technology during video interviews" (2026 report)
  - trade https://www.theglobalrecruiter.com/robert-half-ai-generated-applications-are-slowing-hiring/ — "more than two-thirds of hiring managers (67 per cent) say the need to screen for AI-generated materials has increased the time it takes to hire." (snippet)
- **Incumbent gap:** Legacy ATSes have no fraud layer ("Our ATS Ashby has fraud detection; but there are also 3rd party tools" — 1p1o2or snippet — is the exception); LinkedIn verification is partial; detection startups (Brainner et al.) are new and enterprise-oriented
- **Spend signal:** Teams "did it manually for over a year" before buying tools (1p1o2or); recruiting VAs at $30-85/hr absorb the triage; Gartner-cited orgs adding in-person interview rounds (documented cost in time)
- **Catalyst / trend:** Gartner 1-in-4-fake-by-2028 prediction (July 2025); remote-work fraud rings in IT hiring documented by practitioners (1rmeyvi snippet: "offshore fraud rings submit ai-generated resumes tailored to the JD, then have a proxy handle the first call")
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 5
- **Solo-builder angle:** SMB-priced candidate-authenticity pre-screen (identity consistency checks: resume/LinkedIn/phone/IP/duplicate patterns) that plugs into mid-market ATSes before a recruiter spends 30 minutes per applicant.

### hr-staffing-P2. I-9/E-Verify enforcement surged ~10x and newly reclassified paperwork errors are immediately fineable

- **Who hurts:** Staffing agencies (high-volume W-2 hiring = high I-9 exposure); HR departments of one; construction/hospitality employers
- **What happens now (workaround):** Paid I-9 vendors (which themselves miss deadlines), frantic self-audits, spreadsheets tracking reverification dates; 3 business days to produce forms when a Notice of Inspection lands
- **Frequency:** Every hire; audits episodic but catastrophic
- **Evidence:**
  - trade/tracker https://www.i-9intelligence.com/articles/ice-worksite-enforcement-tracker — "ICE's rate of Notices of Inspection in the first half of 2025 was at least ten times the rate of 2024, when roughly 230 audits were issued all year." (fetched 2026-09-17)
  - regulatory/legal https://www.mcguirewoods.com/client-resources/alerts/2026/4/ice-expands-scope-of-substantive-form-i-9-violations-what-employers-need-to-know/ — "On March 16, 2026, ICE published a revised Fact Sheet on Form I-9 inspections that expands the list of errors classified as 'substantive' paperwork violations... increasing liability for employers." (April 2026)
  - enforcement example https://www.outsolve.com/blog/the-operational-impact-of-intensified-i-9-enforcement-report-part-1 — "CCS Denver, Inc: Fined $6,186,171 after a 100% substantive violation rate" (2025 ICE press release cited)
  - community https://www.reddit.com/r/humanresources/comments/1oit6y8/missed_everify_deadline_of_1014_usa/ — "I am an HR department of one... I am two weeks late as I just saw it today... I have to enter 15 late and I feel so awful." + reply: "the third party vendor we use (and pay 😭) for I-9s and E verify ALSO missed the 10/14 deadline" (Oct 2025 thread re: post-shutdown E-Verify backlog)
- **Incumbent gap:** Big I-9 platforms (Equifax etc.) priced for enterprise; payroll suites treat I-9 as a stored PDF, not a monitored compliance object with deadlines, remote-verification rules, and E-Verify case states
- **Spend signal:** Fines $288-$2,861 per form for paperwork violations (DHS 2025 penalty schedule via lexology.com); documented seven-figure fines; employers already pay third-party I-9 vendors
- **Catalyst / trend:** Enforcement funding + personnel up 120% (i-9intelligence); ICE fact-sheet revision Mar 16, 2026; Ohio E-Verify Workforce Integrity Act effective Mar 19, 2026 (construction contractors, fines to $25k); more state mandates advancing
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 5
- **Solo-builder angle:** An I-9 self-audit and deadline-watchdog tool for staffing firms/SMBs: scans existing I-9s for newly-substantive errors, tracks reverification/E-Verify case deadlines, and produces an NOI-ready binder in 3 days.

### hr-staffing-P3. Staffing back office (timesheets → payroll → invoice → collection) runs on spreadsheets while payroll is due decades before clients pay

- **Who hurts:** Small staffing/temp agencies (1-30 recruiters), new agency founders
- **What happens now (workaround):** Email/spreadsheet timesheet collection, manual invoice assembly, factoring or payroll-funding partners taking a cut; expensive all-in-one suites for those who can afford them
- **Frequency:** Weekly (payroll cadence)
- **Evidence:**
  - community https://www.reddit.com/r/recruiting/comments/zdsntu/how_would_a_new_staffing_company_typically_go/ — "you better have one hell of a credit line because you need to pay all your employees weekly or bi weekly BEFORE your clients pay you (sometimes that's not until 90 days after you have already paid your employees)." (snippet)
  - community https://www.reddit.com/r/recruiting/comments/1exntzx/atscrm/ — "If it's really $750 per user per month, that's pretty steep, especially for smaller agencies trying to keep costs down." [re: Avionté] and "We decided on Zenople by Aqore, it starts about $250/User/Month for Front and Back Office." (snippets)
  - community https://www.reddit.com/r/recruiting/comments/1axc2vt/ats_backoffice/ — "Can anyone suggest an ATS with staffing backoffice (billing + invoicing) that is built on current technology... TrackerRMS - closest to the money, but it seems to [have] a lot of add-on fees" (snippet)
  - vendor/industry https://velorona.com/blogs/staffing-agency-back-office-software — "For a firm with $500K in subvendor spend, these errors typically cost $12,000 to $25,000 a year in invisible margin loss... Without a dedicated system, agencies rely on spreadsheets, email chains, and disconnected tools." (2026 buyer guide)
- **Incumbent gap:** Modern front-office ATSes (Loxo, Recruiterflow) lack back office; integrated suites (Avionté, Bullhorn One, Zenople) are $250-750/user/mo; the timesheet-approval → invoice link is the failure point ("Automation can't reconcile structural inconsistency" — recruitbpm.com)
- **Spend signal:** $250-750/user/mo incumbent pricing; factoring/payroll-funding fees on every dollar of payroll; $12-25k/yr documented margin leakage at $500k subvendor spend
- **Catalyst / trend:** None — structural (net-30/60/90 client terms vs weekly payroll)
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 3 · solo-buildability 3 · whitespace 3 · why-now 2
- **Solo-builder angle:** A timesheet-approval-to-invoice engine for micro agencies (client-approval portal + QBO/Gusto sync) at $99-250/mo flat — skip payroll custody, own the reconciliation layer.

### hr-staffing-P4. FMLA/ADA/leave-of-absence tracking at SMBs lives in hand-built Excel while dedicated tools are "outrageously expensive"

- **Who hurts:** Solo HR/benefits managers at 50-500-employee companies, especially multi-state and CA employers
- **What happens now (workaround):** Excel trackers built years ago + Outlook reminders; Monday.com boards repurposed as leave CRMs; carrier-bundled leave admin with 100-employee minimums
- **Frequency:** Weekly (every active leave case; intermittent FMLA is continuous)
- **Evidence:**
  - community https://www.reddit.com/r/humanresources/comments/1krhq8e/pa_what_is_everyone_using_for_leave_tracking/ — "I currently use an excel spreadsheet I created years ago... I'd love for it to be free... something that gives reminders when a leave return date is here, tracks follow ups and has a space to input FMLA/ADA notes." + comment: "I've used Tilt and Sparrow. Larkin is outrageously expensive. Cocoon is also an option." (snippets, ~2025)
  - community https://www.reddit.com/r/humanresources/comments/1ksdaoh/leave_of_absence_tracking_software_ca/ — "I currently use Monday.com and build a board to track each employees case sort of like a modified CRM platform... I haven't found a good way to organize and capture information like dr notes and case information." (snippet)
  - community https://www.reddit.com/r/humanresources/comments/1o25j7n/best_hris_software_youve_ever_used_na/ — [on BambooHR] "Leave tracking is challenging [when] employees exhaust leave, and approval processes [break] when a manager is out." (snippet)
  - community https://www.reddit.com/r/humanresources/comments/1opyi9y/small_business_hris_employee_tracking_ny/ — "Oof, Excel + 90 ppl is pain." (snippet, ~late 2025)
- **Incumbent gap:** HRIS leave modules handle PTO accruals, not statutory leave case management (notices, medical docs, intermittent tracking); dedicated platforms (Larkin, Sparrow, Tilt, AbsenceSoft) priced for mid-market+
- **Spend signal:** Named competitors charge enough that practitioners call them "outrageously expensive"; JJ Keller subscriptions; carrier-bundled options require 100+ employees — a pricing umbrella below
- **Catalyst / trend:** Multiplying state paid-leave programs and CA CFRA/PFL complexity (structural, ongoing)
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 2
- **Solo-builder angle:** A leave-case tracker for HR-of-one (case timeline, statutory notice deadlines, doc vault, return-to-work reminders) at $50-150/mo — Sparrow's job for 10% of Sparrow's price.

### hr-staffing-P5. HR departments of one drown in compliance chasing — licenses, trainings, attestations — with no escalation system

- **Who hurts:** Solo HR generalists at regulated SMBs (healthcare, transport, finance), often covering 100-400 employees across states
- **What happens now (workaround):** Manual reminder emails, spreadsheet expiry lists, making managers responsible by fiat, account-suspension threats rigged through IT
- **Frequency:** Daily/weekly
- **Evidence:**
  - community https://www.reddit.com/r/humanresources/comments/1tbcims/how_do_you_keep_up_with_employees_who_wont/ — "I'm in a highly regulated industry and I'm honestly drowning in compliance follow-ups right now... The hardest part isn't the tracking itself, it's the constant chasing." (snippet, 2026-era thread)
  - community https://www.reddit.com/r/humanresources/comments/1g88p8w/hr_dept_of_1_am_i_being_stretched_too_thin_na/ — "I handle everything from recruiting, most interviews... onboarding, benefits/enrollments, ER... random DOT testing each quarter, payroll (bi-weekly), WC and leave admin..." + reply: "HR of one for 400 people across 30 states... sometimes I am drowning" (snippets, ~Oct 2024)
  - community (workflow detail) same 1tbcims thread — "Reminder cadence as a system, not as me. Fixed schedule that fires automatic reminders at intervals before each deadline (we used 14 / 7 / 3 / 1 days)... After the third reminder fails, the workflow escalates to the employee's direct manager." (snippet)
  - survey/trade context https://americanstaffing.net/posts/2026/01/06/top-5-staffing-trends-to-watch-for-2026/ — compliance burden rising while "Revenue for our industry is down" (Jan 6, 2026; industry-level pressure making admin headcount unavailable)
- **Incumbent gap:** LMS/HRIS reminders exist but stop at email; the escalate-to-manager + consequence workflow (suspension, write-up) is hand-built every time
- **Spend signal:** Employers already pay for compliance platforms (Mineral/ThinkHR referenced in r/humanresources advice) and still chase manually; an HR-of-one's fully-loaded hour is the recurring cost
- **Catalyst / trend:** None — structural (lean HR headcount post-2024)
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 2
- **Solo-builder angle:** "Compliance chase autopilot": recurring requirement registry + escalating reminder/manager-accountability workflows + audit trail, sold to HR-of-one at self-serve pricing.

### hr-staffing-P6. Bullhorn's post-acquisition decay taxes every agency: click-heavy UI, broken search, junk data, 48-hour support, nickel-and-dime add-ons

- **Who hurts:** Staffing agencies on Bullhorn (the market leader), particularly small firms paying list price
- **What happens now (workaround):** Living with it (migration fear); buying Marketplace add-ons for basics; switching to Loxo/Crelate/Recruiterflow and eating migration cost
- **Frequency:** Daily
- **Evidence:**
  - community https://www.reddit.com/r/recruiting/comments/1mmi61u/has_anyone_else_had_a_terrible_experience_with/ — "I hate bullhorn. I work for a large agency and there's so much junk data in this db... The search capability is rudimentary at best. I've been with this company over 10 years and it's exactly the same POS db now as it was back then. If I dare try to work at night it crashes constantly." (snippet, ~2025)
  - community https://www.reddit.com/r/recruiting/comments/1i2yu7h/ats_selection_support/ — "poor integration with Indeed & LinkedIn, lacks screening questionnaires (add-on's are not even viable options), hit or miss customer service, very click-heavy to complete simple tasks... overall just seems to be a bit antiquated." (snippet, ~Jan 2025)
  - review https://www.capterra.com/compare/140531-206957/Bullhorn-Recruiting-Software-vs-100Hires — "It's still one of the most expensive platforms on the market, but it's not worth the price." and "there is no communication from Bullhorn regarding these bugs, or updates in general - let alone a roadmap." (snippets, 2026 compare page)
  - review https://www.g2.com/compare/bullhorn-vs-vincere — verified-user review: "Since the acquisition, the helpdesk is clunky, and it's hard to get service. We ended up not renewing our subscription and extracting our data out of the platform has been woeful. The search function doesn't work. The UI is clunky" (snippet)
  - community https://www.reddit.com/r/recruiting/comments/14gjrfm/looking_into_bullhorn_would_lime_to_know_what/ — "instead of adding functionality to the service you are paying a lot of money for, they are nickel-and-diming you on anything you want above and beyond their default." (snippet, ~2023)
- **Incumbent gap:** Bullhorn's Marketplace strategy outsources basic features to paid add-ons; challengers win on UX but lack staffing back office (see P3), so agencies stay stuck
- **Spend signal:** "Most expensive platform on the market" per reviewers; agencies pay for add-ons + the core; migration consultants and duplicate-data cleanup projects
- **Catalyst / trend:** None — structural (PE-owned market leader); switching wave visible across 2024-2026 threads
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 2
- **Solo-builder angle:** Don't build an ATS — build the "Bullhorn janitor": dedupe/junk-data cleanup + enriched search layer via Bullhorn's API, sold per-database-cleanup then per-month.

### hr-staffing-P7. Contractor (1099) classification rules are in flux again, leaving SMBs and staffing firms guessing which test applies

- **Who hurts:** Staffing/recruiting firms placing contractors, gig-reliant SMBs, EOR/AOR buyers
- **What happens now (workaround):** Paying EOR/AOR vendors to absorb risk; lawyer letters; hoping state tests (ABC) don't bite
- **Frequency:** Episodic (each engagement structure; each audit or claim)
- **Evidence:**
  - regulatory https://www.dol.gov/newsroom/releases/whd/whd20250501 — "agency investigators are directed not to apply the 2024 rule's analysis in current enforcement matters. Instead, the division will rely on... Fact Sheet #13 and... Opinion Letter FLSA2019-6" (May 1, 2025)
  - regulatory https://www.dol.gov/agencies/whd/flsa/misclassification/2026rulemaking — "On February 26, 2026, the U.S. Department of Labor announced a Notice of Proposed Rulemaking (NPRM)... to rescind a 2024 rule... The NPRM's 60-day comment period closed... April 28, 2026." (2026)
  - legal/trade https://www.jacksonlewis.com/insights/businesses-get-break-dol-wont-enforce-2024-independent-contractor-rule — "The 2024 final rule remains in effect 'for purposes of private litigation'... Businesses also need to comply with the more restrictive state laws defining independent contractor status." (2025)
- **Incumbent gap:** Classification-audit tools are enterprise legal-tech; nothing cheap walks an SMB through federal-vs-state tests per engagement and documents the analysis
- **Spend signal:** EOR/AOR fees (per-worker per-month) exist largely to absorb this risk; private-litigation exposure persists under the 2024 rule
- **Catalyst / trend:** DOL NPRM Feb 26, 2026 (final rule pending) — a dated, ongoing rule change with a decision moment ahead
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 3 · reachability 3 · solo-buildability 2 · whitespace 3 · why-now 4
- **Solo-builder angle:** A per-engagement classification questionnaire + documented-analysis generator (federal economic-reality + state ABC overlays) sold to staffing firms as audit-defense paper; lower confidence — community pain evidence not captured this run.

## Vertical catalysts (dated)

- **I-9/E-Verify enforcement surge:** H1 2025 NOI rate ≥10x full-year 2024 (~230 audits); enforcement personnel +120% (i-9intelligence.com tracker, fetched Sept 2026). ICE revised I-9 fact sheet Mar 16, 2026 expanding "substantive" (immediately fineable) violations (McGuireWoods alert, Apr 2026). Ohio E-Verify mandate for nonresidential construction effective Mar 19, 2026.
- **DOL independent-contractor whiplash:** 2024 rule unenforced per FAB 2025-1 (May 1, 2025); NPRM to rescind/replace announced Feb 26, 2026, comments closed Apr 28, 2026 (dol.gov) — final rule pending as of this research.
- **Candidate-fraud trajectory:** Gartner (Jul 31, 2025): 6% of candidates admit interview fraud; prediction of 1-in-4 fake profiles by 2028. Resume Genius 2026 hiring-manager survey (fielded Jun 4-6, 2026): 58% see AI resumes, 17% deepfakes.
- **Staffing market grind:** SIA Sept 2026 forecast +2.4% to $183.1B — modest recovery, margin pressure persists; ASA (Jan 6, 2026): demand down, buyers paralyzed by AI uncertainty.

## Consumer flip-side

- **Ghost jobs:** 47% of 1,000 US job seekers applied to roles that "never existed"; 37% incurred out-of-pocket "ghost tax" expenses (Enhancv survey, fielded March 2026, enhancv.com/blog/ghost-jobs-survey-2026-bls-data-comparison). 90% of hiring managers "did not reject the premise that companies intentionally post roles they do not plan to fill" (Resume Genius 2026 Hiring Trends, June 2026).
- **Being ghosted:** 55% of job seekers say their top frustration is "getting ghosted after applying"; 49% say job searching hurts their mental health (Resume Genius 2026 Job Seeker Insights, survey launched Mar 16, 2026). 86% of hiring managers admit ghosting candidates due to indecision or applicant overload — up from 81%/79% in 2024 (Resume Genius Hiring Trends 2026).
- Candidate-side trust collapse is a B2B2C wedge: employers who can *prove* real roles and real responses have a differentiator (12.1% of candidates have abandoned major job boards entirely — Enhancv).

## Sources that failed or came up thin

- First r/recruiting search errored (provider error); rerun with varied phrasing succeeded — no data lost.
- ERE.net and SIA member content are login-walled; SIA numbers came from its public abstract and a syndicating blog (qxglobalgroup.com — reported a March 2026 SIA update at 1%/$180.2B vs Sept 2026 update at 2.4%/$183.1B; I cite the Sept figure from SIA's own page).
- Robert Half AI-applications survey reached via The Global Recruiter trade article (snippet) — original press release not fetched; UK-sample caveat.
- 1099/classification problem (P7) lacks community-complaint evidence this run — supported by regulatory + legal-trade sources only; flagged lower-confidence.
- Upwork rate figures ($30-85/hr for recruiting assistants) come from the search synthesis over marketplace pages rather than a single quotable page — treat as approximate.
- r/AskHR yielded nothing distinctive beyond r/humanresources; not separately cited.
