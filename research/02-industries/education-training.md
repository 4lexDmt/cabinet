# Education and Training — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** K-12 teachers (incl. special ed), professors, private tutors/studios, microschools and ESA-funded providers, course creators. Corporate trainers covered only where evidence surfaced (thin — see failures section).
- **Searches/fetches performed:** 15 web searches + 1 Hacker News Algolia API fetch

## Industry snapshot

- Buyers split into four very different wallets: districts (slow procurement, annual budget cycles), individual teachers (small but real out-of-pocket spend — avg **$895/yr** on classroom needs, AdoptAClassroom 2025), solo tutors/studio owners (pay $5-$60/mo for ops tools), and microschool founders newly funded by state ESA dollars.
- 2026 operating climate: RAND's 2026 State of the American Teacher survey — 32% of teachers rank "administrative work outside teaching" a top-3 stressor; avg 50 hrs/week on school work ([rand.org](https://www.rand.org/content/dam/rand/pubs/research_reports/RRA4400/RRA4404-2/RAND_RRA4404-2.pdf)).
- Incumbents: PowerSchool (post-breach litigation, private-equity owned), Canvas/Schoology (usability anger), FACTS/RenWeb in private schools ("I hate it"), TutorBird/MyMusicStaff for solo tutors, Teachable/Kajabi for course sellers (2025-26 price-hike fury), ClassWallet/Odyssey as state ESA payment rails (visibly failing).
- Teacher-facing AI is the most crowded corner: MagicSchool claims ~8M educator sign-ups; Brisk claims "1 in 3 teachers in the USA" — generic lesson-plan/feedback AI is NOT whitespace.
- Higher ed is in revenue crisis (enrollment cliff starts with HS class of 2026), but the buyer is an institution — poor solo-builder fit; treated as catalyst, not product wedge.

## Top problems

### education-P1. ESA/voucher money is gushing but the payment rails are broken — providers wait 45-60+ days to get paid and parents drown in reimbursement paperwork

- **Who hurts:** Microschool founders, tutoring/enrichment vendors, and homeschool parents in ESA states (AZ, FL, AR, TN, ~15+ others)
- **What happens now (workaround):** Providers front 2-3 months of payroll while invoices sit in ClassWallet/Odyssey queues; parents combine receipts+invoices+credentials into single PDFs by hand and resubmit after rejections; some vendors simply quit taking ESA families.
- **Frequency:** Every purchase/invoice; peaks each semester start
- **Evidence:**
  - trade press [arkansasonline.com](https://www.arkansasonline.com/news/2026/jun/28/arkansas-department-of-education-memo-criticizes/) — parent Amanda Ray said vendors "would no longer send her invoices 'because they can't wait two months to get their money'" (June 28, 2026, snippet)
  - trade press [katv.com](https://katv.com/news/local/efa-platform-vendor-flaws-backlog-arkansas-school-choice-payments-brian-evans-breanne-davis-learns-act-school-choice-voucher-classwallet-class-wallet-student-first-technologies-education-freedom-accounts) — "a current backlog of 41,000 EFA requests… families have experienced delays stretching to 45 days" (2026, snippet)
  - community [reddit.com/r/homeschool](https://www.reddit.com/r/homeschool/comments/1f6zdb7/so_frustrated_with_esa/) — "Buy things out of pocket and do reimbursement and sit around 8 weeks to get reimbursement" (undated snippet)
  - practitioner guide [homeschoolstartguide.com](https://homeschoolstartguide.com/blog/how-to-accept-pep-scholarship-florida-microschool) — "typically 60 days from invoice submission for new providers… Most new providers need 2–3 months of operating reserve" (undated, snippet)
  - primary source [azed.gov ESA 2025-26 Handbook](https://www.azed.gov/sites/default/files/2025/06/ESA%202025-2026%20Handbook.pdf) — tutors' receipts require "a copy of the tutor's credentials or the tutoring company's completed tutoring/teaching attestation form… screenshots of websites will not be accepted" (June 2025)
  - survey (secondhand) [mp.moonpreneur.com](https://mp.moonpreneur.com/blog/pending-esa-reimbursement/) — "86% of Arizona ESA families complained about long reimbursement wait times" (undated, snippet)
- **Incumbent gap:** ClassWallet is the state-contracted rail and is publicly failing (Arkansas DOE memo: promised "AI review tools, reporting dashboards" that "have not been implemented" — KATV); it serves the STATE, not the provider or parent. Nobody sells the provider-side layer: compliant invoice generation per state format, rejection-proof documentation packets, receivables tracking across ESA platforms.
- **Spend signal:** AZ program alone: 80,000+ students, hundreds of millions in annual awards (moonpreneur snippet); TN requires schools to post surety bonds; microschool ops tools (Omella, KaiPod Newton) already monetize this segment.
- **Catalyst / trend:** Universal-ESA laws in AR ('26 full rollout), TN 2025-26 program launch; multiple state programs scaling faster than their vendors.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 4 · why-now 5
- **Solo-builder angle:** "ESA-proof invoicing" — a tool for microschools/tutors that generates state-compliant invoices + documentation packets (per ClassWallet/Odyssey/Step Up format rules) and tracks the receivables aging, sold $30-80/mo via microschool founder networks.

### education-P2. Solo tutors and private studios run their business on spreadsheets + Venmo and lose hours weekly to invoicing, scheduling, and payment chasing

- **Who hurts:** Independent tutors, tutoring micro-agencies (2-15 tutors), music/private studio teachers
- **What happens now (workaround):** Google Calendar + homemade Excel + Venmo/Zelle reminder texts; or pay TutorBird/MyMusicStaff and tolerate dated UI.
- **Frequency:** Weekly (invoicing cycles, cancellations, makeups)
- **Evidence:**
  - community [reddit.com/r/MusicTeachers](https://www.reddit.com/r/MusicTeachers/comments/1tbx0fx/the_admin_side_of_running_a_private_studio_is/) — thread title: "The admin side of running a private studio is taking over my life, how do y'all manage this?" (May 13, 2026)
  - community [reddit.com/r/TutorsHelpingTutors](https://www.reddit.com/r/TutorsHelpingTutors/comments/1iifzby/tutorbird_tutorcruncher_teachworks_tutorbranch/) — "I use google calendar for scheduling and tracking billing… Some clients pay without reminders. Others are sent reminder texts or payment requests through Venmo, Zelle, or PayPal. I keep company and student records organized in a variety of homemade Excel spreadsheets" (undated snippet)
  - community/WTP [reddit.com/r/TutorsHelpingTutors](https://www.reddit.com/r/TutorsHelpingTutors/comments/1oq3l35/reviews_on_tutorbird_or_similar_apps/) — "I really didn't like how old their system looked… I started using Trakist… $4.99 per month… [TutorBird] was 3 times more expensive" (undated snippet)
  - community/WTP [reddit.com/r/TutorsHelpingTutors](https://www.reddit.com/r/TutorsHelpingTutors/comments/17woi8w/anyone_using_tutor_management_software_which_one/) — "I use tutorbird… auto invoicing with my PayPal linked to calendar and student/parent portal" (undated snippet)
- **Incumbent gap:** TutorBird/MyMusicStaff are liked but repeatedly called dated ("not the most modern looking… complicated UI"); micro-competitors (Trakist, CantoBase) are already emerging at $5-15/mo — evidence demand exists below TutorBird's price/complexity point.
- **Spend signal:** Users happily pay TutorBird (~$15-25/mo) and call it "well worth it for the price"; Wyzant takes a 25% cut of marketplace tutors (mentioned in [r/TutorsHelpingTutors](https://www.reddit.com/r/TutorsHelpingTutors/comments/1joklhw/good_software_to_track_receivables_and_payments/)) — huge margin umbrella for going independent.
- **Catalyst / trend:** ESA funds now flow to tutoring providers (see P1) — tutors need invoices that satisfy state documentation rules, a feature no studio tool has.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 5 · whitespace 2 · why-now 3
- **Solo-builder angle:** Niche studio-ops app (modern UI, cancellation-policy enforcement, auto-invoicing) for one underserved teaching niche — or the ESA-compliance invoice layer bolted onto existing tutor workflows (bridges to P1).

### education-P3. Special-ed teachers spend hours per student per cycle on IEP writing and goal progress-monitoring data, mostly on paper and duct-taped Google Forms

- **Who hurts:** Special education teachers/case managers (caseloads 15-40+), K-12
- **What happens now (workaround):** Post-its on clipboards → binders → hand-transferred to Google Sheets; voice dictation (Dragon/Willow) to speed narrative writing; a few pay for AbleSpace.
- **Frequency:** Daily data collection; IEP writing per student annually + quarterly progress reports
- **Evidence:**
  - community [reddit.com/r/specialed](https://www.reddit.com/r/specialed/comments/16r4kl6/how_long_does_it_take_to_write_your_ieps/) — "It takes me easily 5 hours spread over time" per IEP (Sept 24, 2023)
  - community [reddit.com/r/specialed](https://www.reddit.com/r/specialed/comments/1ikn8sj/how_are_you_taking_data_to_track_iep_goals/) — "printing post-its with the goal and check boxes… I did alot of writing on my hand and transferring it" (Feb 8, 2025)
  - community [reddit.com/r/Teachers](https://www.reddit.com/r/Teachers/comments/reoht0/ela_910_i_figured_out_how_many_hours_we_should_be/) — "I am a sped teacher and I feel like at least half of my job is paperwork" (undated snippet)
  - workaround census [reddit.com/r/specialed](https://www.reddit.com/r/specialed/comments/1l35zbp/finally_found_a_sustainable_way_to_manage_iep/) — "Voice dictation for narrative sections… Microsoft Dictate for quick notes, Dragon for longer sections, Willow Voice for formal documentation" (undated snippet)
  - survey [tntp.org 2025 lit review](https://tntp.org/wp-content/uploads/2025/06/Teacher-Time-Use-A-Review-of-the-Literature-TNTP-2025.pdf) — paperwork/IEP documentation named among key workload drivers; "84 percent of teachers" lack time in regular hours (June 2025)
- **Incumbent gap:** District IEP systems (e.g., SEIS, Embrace) handle the legal document, not daily data capture; AbleSpace exists but adoption is spotty; most data collection is still paper-first because teachers are mid-instruction when data happens.
- **Spend signal:** Teachers self-fund tools (avg $895/yr out-of-pocket, [AdoptAClassroom 2025](https://www.adoptaclassroom.org/2025/06/09/2025-teacher-survey-spending-stats-classroom-needs/)); districts pay for IEP compliance software already — compliance risk (due-process lawsuits) is a budgeted line.
- **Catalyst / trend:** None dated — structural (IDEA compliance burden + sped teacher shortage).
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 3 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** Mobile-first IEP goal data capture (tap counts mid-lesson) that auto-graphs and AI-drafts progress-report narratives, sold to individual sped teachers at ~$10/mo with a district upsell path.

### education-P4. The AI-cheating arms race: detectors are unreliable, grading suspected-AI work takes multiples longer, and false accusations now carry legal risk

- **Who hurts:** Professors and adjuncts (esp. writing-heavy courses); secondarily HS teachers
- **What happens now (workaround):** Manually cross-checking every citation, in-class blue books, oral defenses, "grade the AI slop strictly on the rubric" — all labor-multiplying.
- **Frequency:** Every assignment cycle
- **Evidence:**
  - community [reddit.com/r/Professors](https://www.reddit.com/r/Professors/comments/1mde62g/this_current_batch_of_students_is_killing_my_soul/) — "I have to check every single source my students use now. It takes four times as long to grade." (July 30, 2025)
  - community [reddit.com/r/Professors](https://www.reddit.com/r/Professors/comments/1lxyjcm/i_caught_a_graduate_student_using_ai/) — "Time consuming and annoying — and I resent being turned into a plagiarism cop for every assignment." (July 12, 2025)
  - legal catalyst [mentafy.com](https://mentafy.com/2026/05/falsely-accused-of-using-ai-a-students-evidence-playbook-for-clearing-your-name/) — "On January 28, 2026, New York State Supreme Court Justice Randy Sue Marber ruled in Newby's favor and ordered Adelphi to vacate the finding" after a Turnitin 100%-AI flag (May 2026)
  - academic [sciencedirect.com](https://www.sciencedirect.com/science/article/abs/pii/S305047592600093X) — detectors show "a high false negative rate of 74%" while ~9% FPR "implies that about 1 out of 10 writers would be found guilty… when in fact they are innocent" (2026)
  - expert [oerc.ox.ac.uk](https://oerc.ox.ac.uk/ai-centre/ai-centre-news/the-question-of-ai-detection) — "approximately 6,000 students were accused of using AI to cheat based on detection tools, with many cases later found to be incorrect" (Australia; cites 2025 ABC News)
  - news via HN API [axios.com](https://www.axios.com/2025/05/26/ai-chatgpt-cheating-college-teachers) — "AI cheating surge pushes schools into chaos" (May 26, 2025, headline only)
- **Incumbent gap:** Turnitin sells detection scores that courts and researchers now reject; nothing mainstream captures *process evidence* (drafts, version history, oral checks) in a workflow faculty can actually run at scale.
- **Spend signal:** Institutions already pay Turnitin per-student; faculty burn hours per paper on citation-checking (documented above) — time spend is the wedge.
- **Catalyst / trend:** Newby v. Adelphi ruling (Jan 28, 2026) makes detector-only accusations legally indefensible; institutions must change process now.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 5
- **Solo-builder angle:** A writing-process-provenance tool (version-history capture + auto citation verification + viva question generator) sold to individual professors/departments as accusation-proof assessment insurance.

### education-P5. Course creators got rug-pulled: Teachable's forced 2025 migration tripled bills and Kajabi raised entry to $143/mo — migration itself is the pain

- **Who hurts:** Course sellers/solo edupreneurs on hosted platforms (also relevant to creator economy)
- **What happens now (workaround):** Grudgingly pay, or DIY-migrate years of content, students, and payment plans to Thinkific/Podia/WordPress — widely described as painful enough that most stay locked in.
- **Frequency:** Episodic (each pricing change) but existential when it hits
- **Evidence:**
  - community [reddit.com/r/elearning](https://www.reddit.com/r/elearning/comments/1kxy068/teachable_just_announced_new_plans_that_increase/) — "I was automatically put into the highest tier — the price increase was over 300%… when I send my feedback and anger about these ridiculous price hikes I get an AI bot 'empathizing' with me" (undated snippet; announcement May 2025)
  - review-gap [samcart.com](https://www.samcart.com/blog/best-teachable-alternatives) — "Creators who had been paying $119/mo on the old Pro plan woke up to bills of $309/mo… Teachable didn't grandfather existing users. Between June and July 2025, every school was automatically migrated" (2026)
  - review-gap [checkthat.ai](https://checkthat.ai/brands/teachable/alternatives) — Kajabi Trustpilot review: "My plan when I started I believe was around $149, now they want $249+VAT per month and if anything, the customer support and features are worse." (Alex Welsh, January 2026, snippet)
  - trade/blog [freshlearn.com](https://freshlearn.com/blog/teachable-community-upset-over-pricing-changes-2025/) — "new Starter Plan at $29/mo now comes with a 7.5% transaction fee… limits you to just one published product and 100 students" (2025/2026)
- **Incumbent gap:** Every platform monetizes lock-in; no neutral migration tooling (content + student accounts + drip schedules + payment plans) exists at prosumer price.
- **Spend signal:** Documented spend: $1,428→$3,708/yr forced jumps; a $100 sale on Teachable Starter loses "$10.70 in combined fees" (samcart) — creators are numerate about this.
- **Catalyst / trend:** Teachable forced migration June-July 2025; Kajabi killed its $89 Kickstarter tier January 2026 (samcart/checkthat).
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 4
- **Solo-builder angle:** Productized course-platform migration service/tool ("move off Teachable in a weekend, keep your students and payment plans") sold at fixed price into visibly angry communities.

### education-P6. Grading double-entry: scores get written on paper, then re-typed into the SIS gradebook — pure duplicated labor at 150-student scale

- **Who hurts:** K-12 teachers, esp. secondary with 100-180 students
- **What happens now (workaround):** Alphabetized paper gradebooks, numeric keypads, split-screen re-typing into PowerSchool; some quit grading categories entirely.
- **Frequency:** Weekly
- **Evidence:**
  - community [reddit.com/r/Teachers](https://www.reddit.com/r/Teachers/comments/1seuc77/how_do_you_guys_deal_with_entering_grades_after/) — "I'll finish correcting a stack of papers… and then I still have to sit down and type every single grade into the system… it just turns into this repetitive loop every week" (undated snippet)
  - community [reddit.com/r/Teachers](https://www.reddit.com/r/Teachers/comments/4yfle9/how_do_you_guys_input_grades_into_a_gradebook_fast/) — "I then transfer the already alphabetized grades into the computer without having to look at the screen" (undated snippet)
  - survey [rand.org 2026 SoT](https://www.rand.org/content/dam/rand/pubs/research_reports/RRA4400/RRA4404-2/RAND_RRA4404-2.pdf) — 32% rank "performing administrative work outside teaching" a top-3 stressor (2026)
  - community [reddit.com/r/Teachers](https://www.reddit.com/r/Teachers/comments/1q40kir/whats_one_afterhours_task_you_finally_stopped/) — teachers describe abandoning grading depth to survive: "Giving completion grades for more assignments… Saves me hours of time grading" (Jan 4, 2026)
- **Incumbent gap:** SIS gradebooks (PowerSchool/Schoology) have clunky import paths; G2 reviewers: Schoology "is cumbersome to use. It seems like a product from the '90s" ([g2.com compare](https://www.g2.com/compare/blackboard-vs-schoology), undated snippet). Scan-to-gradebook (paper→SIS) remains unsolved for ordinary paper assignments; ZipGrade covers bubbles only.
- **Spend signal:** Teachers' own money: 2/3 buy classroom ed-tech personally ([EdWeek Market Brief, Sept 2025](https://marketbrief.edweek.org/meeting-district-needs/teachers-are-still-paying-for-ed-tech-out-of-their-own-pockets-despite-booming-district-inventories/2025/09)); $895/yr avg out-of-pocket (AdoptAClassroom 2025).
- **Catalyst / trend:** None — structural.
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 2 · reachability 5 · solo-buildability 4 · whitespace 2 · why-now 3
- **Solo-builder angle:** Phone-camera "snap the graded stack → OCR scores → CSV/one-click SIS import" utility at impulse price ($5-8/mo); whitespace risk: MagicSchool/Brisk could bundle it.

### education-P7. PowerSchool's breach poisoned trust in the K-12 SIS, but switching is so painful that districts renew anyway — small/private schools are stuck with hated FACTS/RenWeb

- **Who hurts:** K-12 IT admins; private/micro schools on legacy SIS
- **What happens now (workaround):** Stay and sue: Memphis-Shelby renewed for $2.4M *while* suing; small privates tolerate FACTS/RenWeb.
- **Frequency:** Episodic (renewal cycles) with daily low-grade friction
- **Evidence:**
  - trade press [k12dive.com](https://www.k12dive.com/news/tennessees-largest-school-district-sues-powerschool-over-data-breach/748135/) — district "has paid PowerSchool $21 million over the last 12 years"; 100+ districts suing (May 15, 2025)
  - trade press [the74million.org](https://www.the74million.org/article/wisconsin-district-sues-ed-tech-giant-powerschool-after-massive-data-breach/) — "a global breach of some 62.4 million students' and 9.5 million educators' personal information" (2025)
  - legal [labaton.com](https://www.labaton.com/cases/in-re-powerschool-holdings-customer-security-breach-litigation) — "On March 18, 2026, Track One Plaintiffs overcame Defendants PowerSchool and Bain's motions to dismiss" (2026)
  - community [reddit.com/r/k12sysadmin](https://www.reddit.com/r/k12sysadmin/comments/1hxcn66/nonpowerschool_users_what_do_you_use_for_your_sis/) — "Blackbaud currently, switching to Veracross because F blackbaud and their price increases"; "We use facts/renweb and I hate it. But no one cares to change" (undated snippets)
- **Incumbent gap:** District SIS is enterprise-sales/gatekeeper territory (kill criteria for solo); the exploitable edge is micro/private schools (<150 students) where FACTS/RenWeb is overkill and hated, and microschools have no SIS at all (see P1 — Omella/KaiPod Newton emerging).
- **Spend signal:** $21M/12yr single-district contracts show the money layer; private schools pay FACTS per-family fees.
- **Catalyst / trend:** Dec 2024 breach → MDL surviving dismissal March 18, 2026; security questionnaires now part of every SIS renewal.
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 3 · solo-buildability 2 · whitespace 3 · why-now 4
- **Solo-builder angle:** Skip districts; a lightweight SIS/gradebook/enrollment tool purpose-built for sub-150-student private schools and microschools (overlaps P1 wedge).

## Vertical catalysts (dated)

- **Enrollment cliff arrives:** US 18-year-olds decline starting with HS class of 2026, projected -13% by 2041 ([educationnext.org](https://www.educationnext.org/colleges-are-closing-who-might-be-next-how-machine-learning-fill-data-gaps-forecast-future/)); 442 of ~1,700 private nonprofit colleges at risk of exigency within a decade ([huronconsultinggroup.com](https://www.huronconsultinggroup.com/en/insights/time-to-act-higher-ed-ma), 2024 IPEDS analysis; [hechingerreport.org](https://hechingerreport.org/more-than-a-quarter-of-private-colleges-are-at-risk-of-closing-new-projection-shows/)); avg private-college discount rate 57.1% and net tuition per student falling ([insidehighered.com, June 1, 2026](https://www.insidehighered.com/news/business/revenue-strategies/2026/06/01/tuition-discounting-continues-climb)); Moody's expects 16% of private institutions to run negative margins in 2026 ([businessmodelanalyst.com](https://businessmodelanalyst.com/private-college-tuition-discount-enrollment-cliff/), snippet).
- **PowerSchool breach litigation:** breach Dec 2024 (ShinyHunters via PowerSource portal, no MFA); MDL claims vs PowerSchool AND Bain Capital survived dismissal March 18, 2026 ([labaton.com](https://www.labaton.com/cases/in-re-powerschool-holdings-customer-security-breach-litigation)).
- **ESA expansion + vendor failure:** Arkansas EFA backlog of 41,000 requests, DOE memo says ClassWallet "failed to deliver on promises made during the procurement process" ([katv.com](https://katv.com/news/local/efa-platform-vendor-flaws-backlog-arkansas-school-choice-payments-brian-evans-breanne-davis-learns-act-school-choice-voucher-classwallet-class-wallet-student-first-technologies-education-freedom-accounts), June 2026 hearings per [arkansasonline.com](https://www.arkansasonline.com/news/2026/jun/21/families-tardy-reimbursements-arkansas-school-choice/)).
- **AI-accusation legal precedent:** Newby v. Adelphi, NY Supreme Court, Jan 28, 2026 — detector score + flawed appeal ≠ due process ([mentafy.com](https://mentafy.com/2026/05/falsely-accused-of-using-ai-a-students-evidence-playbook-for-clearing-your-name/)).
- **Course-platform repricing:** Teachable forced migration June-July 2025 (no grandfathering); Kajabi removed $89 Kickstarter tier Jan 2026 ([samcart.com](https://www.samcart.com/blog/best-teachable-alternatives)).
- **Teacher-AI saturation:** MagicSchool ~8M educator sign-ups, ~$63M raised ([news.crunchbase.com](https://news.crunchbase.com/venture/educator-built-edtech-startup-ai-magicschool-kahn/)); Brisk claims "1 in 3 teachers in the USA" ([briskteaching.com](https://www.briskteaching.com/)) — crowding signal for generic teacher-AI.

## Consumer flip-side

- Students falsely accused by AI detectors bear "academic misconduct proceedings, damaged reputations" ([oerc.ox.ac.uk](https://oerc.ox.ac.uk/ai-centre/ai-centre-news/the-question-of-ai-detection)) — student-side evidence/appeal tooling is a real wedge (Mentafy is already positioning there).
- ESA parents: months-long reimbursement waits force single-income families to front costs ([arkansasonline.com, June 21, 2026](https://www.arkansasonline.com/news/2026/jun/21/families-tardy-reimbursements-arkansas-school-choice/)); 86% of AZ ESA families complained about wait times (moonpreneur, snippet).
- Parents of K-12 students find Schoology/PowerSchool portals opaque: "Seeing student's grades/report cards you have to click on lots of links just to get information" ([g2.com](https://www.g2.com/compare/blackboard-vs-schoology), undated snippet).
- College families: sticker-price chaos — 57% average discounting means posted tuition is fiction; net-price confusion is a consumer information problem ([insidehighered.com](https://www.insidehighered.com/news/business/revenue-strategies/2026/06/01/tuition-discounting-continues-climb)).

## Sources that failed or came up thin

- **Corporate trainers / L&D:** no dedicated searches ran in budget; no community evidence gathered — coverage gap, flagged rather than padded.
- **site:g2.com powerschool "dislike"** returned mostly G2 *compare* pages and a G2 marketing blog rather than raw 1-star review text; PowerSchool review-gap evidence is therefore thinner than standard (usability quotes obtained, pricing-anger quotes not).
- **HN Algolia API** worked but "AI cheating teachers" returned mostly irrelevant Show HN posts; only one usable story (Axios, May 2025). Headline-only evidence.
- **r/Professors / r/Teachers thread dates:** several quotes come from search snippets where Reddit post dates weren't shown; marked "undated snippet" — spot-check before load-bearing use.
- **Microschool operator complaints:** the r/TeachersInTransition thread (Apr 1, 2026) shows curiosity, not documented pain; the strongest microschool-ops pain evidence is indirect (ESA payment rails, vendor guides). Treat P1's microschool half as medium-confidence, ESA-parent half as high-confidence.
- **Teachers Pay Teachers seller-side complaints:** not searched (budget); TPT appears only via its own 2025 buyer survey — potential missed problem area.
