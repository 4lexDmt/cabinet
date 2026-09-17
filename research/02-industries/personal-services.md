# Personal Services — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Salons/barbers, fitness/PT studios, pet care, residential cleaning, childcare centers, wedding/event vendors, plus underserved micro-verticals (funeral homes, pool routes, marinas, campgrounds). Excludes medical spa clinical/PHI workflows except where they share booking/deposit mechanics with beauty.
- **Searches/fetches performed:** 24 web searches + 5 direct fetches (Fresha pricing, Salon Business Fresha review, Etisia no-show stats, GrowBien deposit/chargeback, Procare RoomRunner). Reddit/G2/Capterra mined via `site:` snippets.

## Industry snapshot

- US hair salons ~$63.4B revenue in 2026 (IBISWorld, pub. July 2026); hair/nail/skin care combined ~$95.3B (IBISWorld, May 2026). Growth is near-flat; labor scarcity and suite-rental (Sola/Phenix) are pulling talent out of commission salons (Beauty Playbook; IBISWorld snippets).
- Buyers are owner-operators and booth renters, not IT departments. They congregate in r/hairstylist, r/Barber, r/fitbiz, r/FitnessStudioOwner, r/ECEProfessionals, r/petsitting, r/cleaningbusiness, r/PoolPros, r/WeddingPhotography.
- Dominant booking incumbents monetize via marketplace take-rate (Fresha 20% first-visit marketplace commission, min $6; Booksy Boost 30% of first appointment) or SaaS lock-in (Mindbody from ~$99–$129/mo with $500 data-export fees; HoneyBook Starter jumped 89.5% to $36/mo in Feb 2025).
- Childcare is a different buyer: center directors managing ratio-constrained rooms on paper/Excel while parents pay ~$1,700–$2,000/mo and wait 1–2 years for infant seats.
- Underserved micro-verticals (funeral, pools, marinas, private campgrounds) still run first-call paperwork, chem logs, and slip maps on paper or per-unit-priced niche SaaS.

## Top problems

### personal-services-P1. Marketplace booking apps tax independents 20–30% of new-client revenue and then charge a subscription on top

- **Who hurts:** Solo stylists, barbers, booth renters, small salons using Fresha or Booksy Boost for discovery
- **What happens now (workaround):** Stay and eat the take-rate; switch to Square/GlossGenius/JENA/Vagaro and rebuild reviews; import existing clients before listing so marketplace doesn't re-tax them
- **Frequency:** Every new marketplace booking; the 2025 Fresha "free forever" → paid conversion was a mass switching event
- **Evidence:**
  - community https://www.reddit.com/r/Entrepreneurship/comments/1o69ji0/free_software_is_costing_me_2400month_am_i_doing/ — "We do about $12k in bookings per month. 20% of that is $2400. That's what we're paying monthly for 'free' software." (snippet)
  - community https://www.reddit.com/r/smallbusiness/comments/1nvkl2f/alternatives_to_fresha_booking_system/ — "Now taking monthly fees and still charging 20% marketplace that no one ever uses. They just run better SEO when people google your business and rob 20% of your cut" (snippet)
  - community https://www.reddit.com/r/hairstylist/comments/1o0kvz2/booksy_is_literally_the_worst_app_for_service/ — "Booksy has profited over $6,000 in commissions from me" via Boost at "$30 per month and a whooping 30% commission from each clients first appointment"; Boost also claimed Instagram/referral clients. (snippet)
  - incumbent pricing https://www.fresha.com/pricing — "Fresha marketplace - New clients … 20% one-time commission Minimum fee of $6 per client applies" plus Independent plan **$19.95/month** (fetched 2026-09-17)
  - trade https://thesalonbusiness.com/fresha-review/ — "Once known for being 100% subscription-free, Fresha changed its pricing model in 2025" (updated Feb 26, 2026)
- **Incumbent gap:** Fresha Data Connector is **$295/location/mo** (pricing page) so exporting your own data is a paid hostage; Booksy Boost misattributes organic clients and takes 100% of $10 consults (Boost min = $10)
- **Spend signal:** $2,400/mo at $12k GMV; $28,800/yr "that's the cost of hiring a part-time employee" (1o69ji0 comment snippet); Booksy $6k+ commissions on one provider; GlossGenius ~$28/mo flat (Salon Business)
- **Catalyst / trend:** Fresha 2025 free→paid conversion + continued 20% marketplace fee; Booksy marketplace loyalty erosion ("people on the app bounce around between barbers" — r/Tech4LocalBusiness 1soh4o5 snippet)
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 5 · reachability 5 · solo-buildability 4 · whitespace 2 · why-now 4
- **Solo-builder angle:** Flat-fee booking + branded site + deposit collection that imports Fresha/Booksy clients in one click and never takes a marketplace cut — sell the switch during the still-fresh 2025 pricing revolt.

### personal-services-P2. No-show fees charged to a card-on-file lose chargebacks; the deposit UX incumbents ship is not Visa-compliant

- **Who hurts:** Salons, med spas, tattoo/barber studios, PTs, fitness studios (fitness no-show ~20%)
- **What happens now (workaround):** Verbal policies, buried T&Cs, after-the-fact no-show charges; owners waive fees for loud clients (which itself is a listed dispute reason); fight chargebacks with incomplete evidence
- **Frequency:** Weekly empty chairs; chargebacks episodic but cash-killing
- **Evidence:**
  - survey https://www.etisia.com/no-show-statistics — Hair salon/barber **15%**, beauty/nail **14%**, fitness trainer **20%**; "A salon with 25 weekly appointments at $65 each and a 15% no-show rate loses $31,187 per year." (updated Sep 14, 2026)
  - trade https://growbien.com/blog/med-spa-no-show-fee-deposit-policy-chargeback — "Visa defines a Guaranteed Reservation… Nine merchant types: lodging… trailer parks and campgrounds, vehicle rental. Hotels and rentals, nothing else. A med spa is not on that list" so a stored-card no-show fee is Dispute Condition 13.1 (Aug 27, 2026; cites Visa Core Rules 18 Apr 2026)
  - trade https://www.kevonia.com/blog/salon-payment-dispute-chargeback-what-to-do-in-2026 — "A salon chargeback deposit often starts with a policy misunderstanding: the client believes the deposit was a temporary hold, while the salon intended it as a cancellation-risk payment." (2026)
  - community https://www.reddit.com/r/hairstylist/comments/1n5voc7/fresha_2025/ — switcher: "I now charge a deposit for bookings, which is something that Fresha doesn’t really allow." (snippet, 2025 Fresha-pricing thread)
  - review https://www.capterra.com/compare/146651-153752/My-PT-Hub-vs-Vagaro — "The least thing I like about Vagaro is the fact that I cannot do deposits without having the shopping cart purchased so I pay an extra fee just to..." (snippet, 2026 compare page)
- **Incumbent gap:** Fresha lists "No-shows and cancellation fees" as a payments feature but users say deposits are restricted; Vagaro gates deposits behind a paid shopping-cart add-on; none of the beauty schedulers implement Visa §5.8.11.1 separate click-to-accept + "Deposit" on the receipt
- **Spend signal:** ~$31k/yr lost chair time at a modest salon (Etisia); 3–4 no-shows/week ≈ 150–200 wasted prep hours/yr; Vagaro extra shopping-cart fee just to take deposits
- **Catalyst / trend:** Visa Core Rules edition **18 April 2026** makes after-the-fact no-show charges structurally unwinnable for beauty/health MCC codes
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 4 · why-now 5
- **Solo-builder angle:** A booking-widget add-on whose *only* job is Visa-clean advance deposits (separate accept step, labeled receipt, consistent enforcement log) that plugs into Square/Fresha/Calendly.

### personal-services-P3. Childcare directors run waitlists and room-transitions on paper and Excel while infant seats sit empty and parents wait years

- **Who hurts:** Center directors (1–3 sites); parents hunting infant care
- **What happens now (workaround):** Pencil-and-paper rotation; "whole excel spreadsheet that goes all the way to 2028"; Google Sheet inquiry tracker; Kinside bolted onto Brightwheel for tours/waitlist; one 17-location org hand-enters Procare forms into Google Drive
- **Frequency:** Daily (inquiries, tours, ratio math); seasonal (school-year transitions)
- **Evidence:**
  - community https://www.reddit.com/r/ECEProfessionals/comments/1oefntw/waitlist_software/ — "Our current director works on the waitlist and class rotation by hand with pencil and paper." (Oct 23, 2025)
  - community https://www.reddit.com/r/ECEProfessionals/comments/1htl8b4/how_are_yall_handling_waitlists_and_classroom/ — "We have a whole excel spreadsheet that goes all the way to 2028 for student transitions." plus "we have a Google sheet for inquiry tracking and waitlists." (snippet)
  - community https://www.reddit.com/r/ECEProfessionals/comments/1ab8dtx/your_centers_registration_paper_or_online/ — "We use ProCare an enrollment form and than someone sends an email confirmation and enters it in by hand into a Google Drive/Google Sheet Grid. (We have a dedicated Admissions Office. 1 person handles Admissions/Schedule Changes this for 17 locations)" (Jan 2024; still the workaround pattern)
  - incumbent https://www.procaresoftware.com/capabilities/enrollment-planning/ — "Then dig through paperwork, sticky notes, and spreadsheets to come up with a guesstimate." Customer: "I used to spend — I would say weeks — … that would take me at least 10 days of work — about 20 hours total." (fetched 2026-09-17)
  - consumer https://www.reddit.com/r/baltimore/comments/1legso2/childcare_options_in_the_city/ — "we got on several daycare waitlists … when I was around 12 weeks pregnant. … We never heard back from anyone until my son was around 18 months … We pay around $2,000 per month." (snippet)
- **Incumbent gap:** Brightwheel "doesn’t have tour sign ups" so centers add Kinside (1mwdzze snippet); Procare RoomRunner exists but is locked to a product directors are fleeing ("Procare is SHIT. We are locked in and we hate it." — 1p0ioz7 snippet); Playground is the only one with tour automation called out
- **Spend signal:** 20 hours of director time per annual space plan (Procare customer); empty infant seats = ~$2,000/mo tuition each; Procare claims "20% Revenue Recovery" from filling seats that would have gone unfilled
- **Catalyst / trend:** Persistent infant-ratio shortage (1:4 cited in 1htl8b4) + mass Procare → Brightwheel exodus over billing/ledger failures (procaresupport.com ledger apology, year-end reconciliation)
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** Standalone waitlist + aging-transition planner (birthdate → room, sibling priority, ratio caps) with parent-facing status, sold to Brightwheel/Playground users as the missing module — not another all-in-one.

### personal-services-P4. Mindbody price hikes, outages, and a ~$500 data-export ransom trap boutique studios in a clunky stack

- **Who hurts:** Boutique fitness/yoga/pilates studio owners (under ~200 bookings/mo through multi-site)
- **What happens now (workaround):** Pay Glofox/OfferingTree/Momence/Vibefam to migrate; manually re-collect cards; run dual systems a week to avoid double-billing
- **Frequency:** Continuous fee drip; episodic (outage, annual hike, migration)
- **Evidence:**
  - community https://www.reddit.com/r/fitbiz/comments/1ua0bsj/tired_of_mindbodys_price_hikes_and_frequent/ — title: "Tired of Mindbody's price hikes and frequent outages"; comment: "We switched from Mindbody to Glofox like 2 years ago and the billing alone was worth it...no more random fee increases every quarter" (snippet)
  - community https://www.reddit.com/r/FitnessStudioOwner/comments/1p11s1o/thinking_of_switching_from_mindbody_but_how_to/ — "Mindbody might charge you $500 to get your data, which is BS but that's how they are." Recurring memberships "don’t auto-transfer anywhere because Mindbody keeps all the billing info in their own vault." (snippet)
  - review https://www.g2.com/compare/mindbody-vs-zen-planner — Jordan W., Health/Wellness: "Price was constantly increasing and new features being added and charged for that we didn't need." G2 lists Mindbody starter **$99/mo**; another G2 answer "starts around $125 and upwards" (snippet)
  - community https://www.reddit.com/r/mindbody/comments/1qr10sx/has_anyone_migrated_away_from_mindbody/ — "I left MindBody 10 months ago after having been with them for 13 years. … We are saving thousands per year because we used MBO as well as other software (Brandbot, Vimeo, WordPress, etc.)" (snippet)
- **Incumbent gap:** Card vault + membership objects are not portable without a paid PAN transfer; G2 cons cluster on "Expensive (20 mentions)" (g2.com/it/products/mindbody/reviews 2026 page)
- **Spend signal:** $99–$129+/mo list; $500 export; "thousands per year" saved by collapsing the stack; Vagaro entry ~$30/mo cited as the cheap alternative (1ua0bsj)
- **Catalyst / trend:** None new in 2026 — structural lock-in; studios still posting "thinking of moving off Mindbody" through 2025–2026 threads
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 2
- **Solo-builder angle:** A one-time "Mindbody unvault" service: ingest the paid export + PAN transfer, recreate memberships/next-bill dates, and land the studio on Stripe + a thin class scheduler.

### personal-services-P5. Pool-route software prices per stop so a busy May costs 3–6× a slow month, and payment processing is the hidden tax

- **Who hurts:** Solo and small (1–10 tech) pool-service operators
- **What happens now (workaround):** Switch to PayThePoolMan flat $50 + $10/tech; absorb Skimmer; add a "$2 convenience fee" to cover processing
- **Frequency:** Monthly invoice shock; annual price-increase emails
- **Evidence:**
  - community https://www.reddit.com/r/PoolPros/comments/1r857ba/jobber_vs_skimmer_vs_pool360/ — "In the northeast, how can I do let’s say 300 openings, cleanings, and service calls for that month and now I need to pay $300 for the month of May but then it can drop to $100, and then could be $600 another month." (snippet)
  - community https://www.reddit.com/r/PoolPros/comments/1f4e28a/pool_service_software/ — "Just received an email from skimmer informing me that my price is going to double unless I use their payment service." (snippet)
  - community https://www.reddit.com/r/PoolPros/comments/1kbhut6/thoughts_on_skimmer_pro_app/ — "Lots of guys switched because of the price increase." / "Nope, too expensive." (snippet)
  - community https://www.reddit.com/r/swimmingpools/comments/1rnsn7r/im_a_solo_developer_who_built_a_pool_service_app/ — "Skimmer starts at $49/mo, Pool Brain runs $65/mo, Pool Office Manager is $70-125/mo. If you're a one-person operation servicing 20-40 pools, you're paying the same rates as companies with full crews." (snippet)
- **Incumbent gap:** Skimmer is "so good and corners the market" but per-location + forced payments; Jobber ~$199/mo without LSI/chem logging
- **Spend signal:** $1–$2 per serviced location × 300 May stops = $300–$600/mo software; 3.4% + $0.25 processing on every recurring payment; PTPM ~$73/mo all-in cited as the escape
- **Catalyst / trend:** Structural — seasonal volume makes per-stop SaaS punitive exactly when cash is needed for chemicals/openings
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 4 · whitespace 3 · why-now 3
- **Solo-builder angle:** Flat-fee pool-route ops (chem log + LSI + photo report + Stripe) with **grandfathered** pricing, sold in r/PoolPros against Skimmer's next increase email.

### personal-services-P6. Funeral directors still chauffeur paper death certificates across town while families wait on insurance and estates

- **Who hurts:** Independent/family funeral homes (~3 in 4 of 15,401 US firms are privately owned — FuneralHQ citing NFDA)
- **What happens now (workaround):** Drive forms to doctor's offices, wait, drive back; call 3–5 times for a signature (~1 week); Passare AI Scanner for handwritten vitals; UK firms chase GPs under the medical-examiner regime
- **Frequency:** Every case that isn't fully electronic
- **Evidence:**
  - regulatory/practitioner https://olis.oregonlegislature.gov/liz/2025R1/Downloads/PublicTestimonyDocument/117608 — "time and fuel are wasted driving across town (and back) to drop paperwork off- and then across town (and back) again to pick it up"; "doctor offices are being called three, four, five, or more times … On average, requiring about a week before a signature is secured" (Oregon licensed funeral director testimony, 2025 session; snippet — PDF fetch timed out)
  - regulatory https://www.michigan.gov/whitmer/news/press-releases/2026/03/17/whitmer-signs-bills-to-cut-red-tape-streamline-state-government-services-for-grieving-families — HB 4077/4078 (signed Mar 17, 2026) "require a death certificate to be filed within 48 hours using a secure web-based system" (snippet)
  - trade https://www.funeralservicetimes.co.uk/news/funeral-plans/2025/04/02/new-dead-certification-reforms-cause-funeral-delays-saif-finds/ — SAIF survey of 250 members: delays in "~70% of areas"; death-to-registration commonly **14 days**; funerals that took two weeks now take three (Apr 2, 2025)
  - trade https://suppliers.nfda.org/Exhibit/Innovation-Award/2025-Finalists — Passare AI Scanner "eliminating the need for manual data entry" from "handwritten vitals forms" (2025 NFDA Innovation, 3rd place)
- **Incumbent gap:** Passare is collaboration-first with quote-based pricing (FuneralHQ 2026 compare); state EDRS integrations are one-off (Passare's first state EDRS integration was an NFDA 2026 entry, not a finalist). Paper "drop to paper" still exists where physicians refuse e-file
- **Spend signal:** Staff hours + fuel per case; families blocked from "release of funds, the settlement of estates" (Oregon testimony 117563 snippet); FuneralHQ positions $99/mo per-company vs per-case/per-signature fees
- **Catalyst / trend:** State-by-state e-death mandates (MI Mar 2026; OR HB 3127 2025); UK medical-examiner reform live since Sep 2024 with 2025 delay data
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 3 · solo-buildability 2 · whitespace 4 · why-now 4
- **Solo-builder angle:** A director-facing "cert chase" tracker (who has the MCCD, last call, SLA clock, family SMS) plus vitals OCR — not a full funeral OS. Harder than booking software because of state EDRS variance.

### personal-services-P7. Residential cleaning outgrows spreadsheets into $200+/mo field-service tools that still don't nail recurring + Google Calendar

- **Who hurts:** Cleaning owners from ~5 to 20+ jobs/day; STR hosts coordinating turnovers
- **What happens now (workaround):** HubSpot + Wave + Google Calendar; screenshot calendars to cleaners; Jobber Grow at **$2,736/yr**
- **Frequency:** Daily scheduling; weekly invoicing
- **Evidence:**
  - community https://www.reddit.com/r/cleaningbusiness/comments/1sdykaw/looking_for_advice_on_which_programs_to_use_to/ — "Jobber and house call pro are both very expensive. I'm talking 200+ a month if you have at least 1 employee. I am using Zenmaid now … not having that google integration is making me nutty." (snippet)
  - community https://www.reddit.com/r/smallbusiness/comments/1jxmzkp/struggling_to_schedule_more_than_20_cleaning_jobs/ — "I pay $2736 annually for the [Jobber] 'grow plan'" at 15–20 jobs/day, staff of 16 (snippet)
  - community https://www.reddit.com/r/vrbohosts/comments/1syvkh7/how_do_you_share_booking_schedules_with_your/ — "having to do a lot of spreadsheet merging and manual reservation adding … spending 40 minutes checking and rechecking"; others "screenshot each month of the calendar from Vrbo and text it to my cleaner" (snippet)
- **Incumbent gap:** Jobber/HCP priced for multi-trade FSM; ZenMaid is cleaning-native but weak Google Calendar; generic CRMs don't do recurring-job + cleaner availability
- **Spend signal:** $200+/mo or $2,736/yr Jobber; 40 minutes/day host-side schedule merge
- **Catalyst / trend:** None — structural. STR cleaning is a second buyer with the same calendar-sync hole
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 2
- **Solo-builder angle:** Recurring-clean scheduler with first-class Google Calendar + cleaner SMS, priced under $49/mo — a wedge, not another Jobber.

### personal-services-P8. Wedding-vendor CRMs (HoneyBook) hiked ~90% in 2025 while photographers still rebuild reports in spreadsheets

- **Who hurts:** Wedding photographers, planners, and other event vendors on HoneyBook/17hats
- **What happens now (workaround):** Switch to Dubsado/Studio Ninja/Bloom/Pixieset; "end up making all my own reports manually"
- **Frequency:** Annual renewal shock; weekly admin
- **Evidence:**
  - willingness-to-pay https://www.plutio.com/compare/freshbooks-vs-honeybook — "HoneyBook's Starter plan rose from $19/month to $36/month in February 2025, an 89.5% increase. The Essentials plan moved from $39 to $59/month. Premium moved from $79 to $129/month." Existing members got 20% off for one year only (2026 compare; snippet/fetched)
  - community https://www.reddit.com/r/WeddingPhotography/comments/1hbbpfe/okay_whats_better_than_honeybook/ — "I hate Honeybook. Their business practices are terrible - they keep taking away features." Another: "I am for sure not getting a 50% increase in services so I don’t think such a severe price increase is warranted." (snippet)
  - community https://www.reddit.com/r/WeddingPhotography/comments/18f5734/which_crm/ — "I end up making all my own reports manually which is such a pain considering that they have all the information." (snippet)
  - community https://www.reddit.com/r/WeddingPhotography/comments/1h4eib8/anyone_using_and_loving_a_crm/ — "Honeybook raised their rates by $200 per year" (snippet)
- **Incumbent gap:** HoneyBook reporting "often incorrect"; QuickBooks sync only on Premium $109/mo annual (swellsystem.com May 2026 photographer CRM guide snippet)
- **Spend signal:** Starter 89.5% hike; Premium now $1,308/yr; Dubsado Premier ~$525/yr new-subscriber (Dec 2025) as the revolt destination
- **Catalyst / trend:** Feb 4, 2025 HoneyBook plan reset; 2026 is when the one-year legacy discount expires
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 2 · why-now 4
- **Solo-builder angle:** Photographer-specific cash-flow dashboard on top of whatever CRM they flee to — the reporting hole is what they still spreadsheet after they switch.

## Vertical catalysts (dated)

- **Fresha 2025 pricing conversion** — "100% subscription-free" ended; Independent $19.95/mo + 20% marketplace fee remains (fresha.com/pricing fetched 2026-09-17; thesalonbusiness.com Feb 26, 2026).
- **Visa Core Rules 18 April 2026** — Guaranteed Reservation / No-Show Transaction limited to lodging/rental MCCs; beauty/health after-the-fact no-show fees are Dispute 13.1 (GrowBien citing Visa, Aug 27, 2026).
- **HoneyBook Feb 2025 plan reset** — Starter +89.5%; one-year member discount expires into 2026 (Plutio 2026 compare).
- **Michigan death-certificate e-file** — HB 4077/4078 signed Mar 17, 2026; 48-hour web filing (michigan.gov). Oregon OVERS mandate effort HB 3127 (2025 session).
- **UK death-certification reform** — medical examiner system from Sep 2024; SAIF survey Apr 2, 2025 documents 70% of areas delayed, 14-day registration.
- **Procare ledger incident** — vendor apology for ledger discrepancies, year-end reconciliation push (procaresupport.com, undated page in 2025–26 window).
- **Recreation.gov / Campnab bot war** — 11M reservations in 2024 vs 3.5M in 2019 (WIRED reprint via nehtus.com); consumer-side, not a private-campground SaaS gap.

## Consumer flip-side

- **Childcare search is a second job:** 1–2 year infant waitlists, $1,700–$2,000/mo, "never heard back" until 18 months (r/baltimore 1legso2, 1dbrox0). A parent-facing waitlist status product that centers actually update would be B2B2C.
- **Booking-app clients hate downloading Booksy** just to book a haircut (r/Barber 1g8cqnv snippet) — direct-book links win loyalty.
- **Deposit/chargeback fights** are the client-side of P2; unclear "hold vs deposit" language is what triggers disputes (Kevonia 2026).
- **Campground reservations feel like Ticketmaster:** Recreation.gov bots, empty reserved sites, Campnab paid alerts (WIRED; The Walrus). Private campgrounds using the same fee-heavy platforms inherit the hatred.
- **Bereaved families' #1 question** to funeral directors: "when will I get the death certificates?" (Oregon testimony) — the paperwork delay is the consumer product.

## Sources that failed or came up thin

- Direct fetch of reddit.com, G2, Trustpilot blocked (per methodology); all Reddit/G2 quotes are search snippets unless noted.
- Oregon funeral-director PDF (olis.oregonlegislature.gov …/117608) **timed out** on WebFetch; quotes taken from search snippet only.
- Two searches for a 2025–2026 **Child Care Aware / ranked waitlist-length survey** returned errors or no national statistic — parent anecdotes and Procare marketing ("spreadsheets") stand in. Treat waitlist *length* as high-confidence anecdotally, not survey-grade.
- IBISWorld salon reports are paywalled; only public abstracts used ($63.4B / $95.3B).
- GlossGenius Capterra query mixed unrelated products; usable cons exist on Square vs GlossGenius compare ("continuously raising the prices") but thinner than Fresha/Booksy/Mindbody.
- Marina software evidence is mostly vendor blogs (Digital Heroes Jun 26 2026; Marine OS) — real problem (double-booked slips, boat-state vs hotel-room model) but not triangulated with practitioner forums in this run.
- NFDA industry statistics cited via FuneralHQ, not the NFDA report itself.
- Time To Pet is liked more than hated; "overpriced" appears but spend is $25–$50/mo — weaker WTP-anger than beauty marketplaces.
- Etisia no-show table is a vendor planning model (they say so); the $31,187 salon example is illustrative, not a census.
- Discord/Facebook stylist groups (where a lot of Fresha revolt lived) are inaccessible here.
