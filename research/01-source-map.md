# Source Map — Where the Evidence Lives

Reusable venue inventory for cross-industry problem mining. Compiled 2026-09-17. Access notes reflect probes from this environment on that date.

## Access tactics (read first)

- **WebSearch with `site:` operators is the workhorse.** G2, Trustpilot, and Reddit block or time out on direct fetch; their content is mined via search snippets: `site:reddit.com/r/<sub> "<phrase>"`, `site:g2.com <product> "dislike"`, `site:trustpilot.com <company>`.
- **Direct fetch verified working:** Hacker News Algolia API — `https://hn.algolia.com/api/v1/search?query=<urlencoded>&tags=<story|comment|ask_hn>` (also `search_by_date`, `numericFilters=created_at_i><epoch>`).
- **CFPB Consumer Complaint Database** — public API at `https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/` (structured finance complaints by product/issue); fall back to CFPB published reports if blocked.
- **Login-walled:** LinkedIn (`site:linkedin.com/posts "<industry>" "biggest challenge"` for public posts; LinkedIn Workforce/Economic Graph reports are public), X/Twitter (snippets only). Discord/Slack/private Facebook Groups: inaccessible.
- Use **2026** in queries for current material (e.g. "restaurant industry challenges 2026").

## Query phrase library (run verbatim against every venue)

- **Solution requests:** "is there a tool", "is there an app for", "looking for software that", "what do you use for", "how do you all manage", "how do you all track"
- **Pain:** "so frustrating", "wasting hours", "nightmare", "tedious", "the worst part of my job", "drives me crazy"
- **Workarounds:** "we use a spreadsheet for", "built a google sheet", "manually enter", "hired a VA to", "held together with duct tape"
- **Money / willingness to pay:** "I'd happily pay", "shut up and take my money", "worth every penny", "too expensive", "price increase", "alternative to [incumbent]", "switching from [incumbent] because"

## Cross-cutting sources (all industries)

### Pre-ranked problem surveys (highest signal per effort)
- NFIB Small Business Problems & Priorities 2024 — 75 ranked SMB problems, quadrennial; cost of health insurance #1 since 1986 (verified live)
- ATRI Critical Issues in the Trucking Industry — annual ranked top-10
- MGMA Annual Regulatory Burden Report — medical practices
- AICPA PCPS Top Firm Issues Survey — accounting firms by size
- Clio Legal Trends Report — lawyer utilization/collection data
- National Restaurant Association State of the Industry
- AGC/Autodesk Workforce Survey; NAHB surveys — construction
- NAR Member Profile — real estate
- Stack Overflow Developer Survey — dev pain
- KLAS Research ratings — health IT satisfaction

### Trend and catalyst sources
- Gartner 2026 strategic trends; McKinsey/Deloitte/PwC/EY 2026 industry outlooks; Forrester Predictions 2026; CB Insights; Bessemer State of the Cloud
- YC Requests for Startups — Fall 2026 edition verified: The Primer (AI tutoring), American defense, cloud for small software, multiplayer AI, compute at sea, AI consumer products, aging-care tech, physical-world OS, crypto, real-world data, human verification, AI-native compliance, self-maintaining APIs (`ycombinator.com/rfs`). Use as trend signal AND crowding map alongside the last 2 YC batch company lists
- a16z Big Ideas; Exploding Topics; Google Trends (rising "[X] software", "[X] template" queries)
- Regulatory calendar to verify per-item with 2026 primary sources: EU AI Act obligation phases; e-invoicing mandates (France, Germany, Poland, etc.); CSRD/omnibus status; US state privacy law patchwork; HIPAA Security Rule update; DORA/NIS2; CMS prior-authorization rules (2026-2027); OSHA heat rule; FinCEN BOI status
- Structural shifts to mine for second-order problems: AI Overviews collapsing SMB SEO lead-gen; silver tsunami of retiring SMB owners; caregiving/aging-in-place; home-insurance crisis (FL/CA); GLP-1 second-order effects; college enrollment cliff; ESA/microschool expansion; e-commerce returns fraud; maintenance/security cleanup of AI-generated ("vibe-coded") apps

### Willingness-to-pay and sellability evidence
- Acquire.com / Flippa / Empire Flippers — which micro-SaaS niches actually sell, revenue, multiples
- Upwork/Fiverr recurring gig categories — repetitive human work = automation candidates
- Etsy/Gumroad/Notion template marketplaces — paid template bestsellers = validated micro-problems
- Incumbent pricing pages + community pricing anger = price-umbrella wedges

### Consumer complaint databases
- CFPB Consumer Complaint Database (API above); BBB complaint patterns; ConsumerAffairs; Trustpilot (snippets); NHTSA (auto); DOT Air Travel Consumer Reports

## Per-industry venue inventory

### 1. Healthcare private practice (medical, dental, PT, mental health, vet) → `02-industries/healthcare-private-practice.md`
- Subreddits: r/therapists, r/dentistry, r/veterinaryprofession, r/optometry, r/physicaltherapy, r/medicine, r/nursing, r/audiology
- Forums: DentalTown, Student Doctor Network
- Trade press: Healthcare Dive, Medical Economics, MGMA insights, Becker's
- Incumbents to gap-mine: SimplePractice, TherapyNotes, Jane App, Tebra (Kareo), Dentrix, Eaglesoft, Open Dental, Covetrus/Cornerstone, IDEXX Neo, WebPT, Prompt PT
- Surveys: MGMA Regulatory Burden, KLAS, Medscape burnout reports
- Angles: prior-auth pain, insurance credentialing, claim denials, no-shows, vet software hatred, cash-pay/DPC shift

### 2. Construction and skilled trades → `02-industries/construction-skilled-trades.md`
- Subreddits: r/Construction, r/HVAC, r/electricians, r/Plumbing, r/Roofing, r/Landscaping, r/sweatystartup
- Forums: ContractorTalk, ElectricianTalk, HVAC-Talk
- Trade press: Construction Dive, ENR, JLC
- Incumbents: Procore, Buildertrend, ServiceTitan, Jobber, Housecall Pro, AccuLynx, JobNimbus, LMN, Aspire
- Surveys: AGC/Autodesk workforce, NAHB
- Angles: estimating/takeoff pain, change orders, labor shortage, permitting, ServiceTitan pricing anger

### 3. Real estate and property management (incl. STR, HOA) → `02-industries/real-estate-property-management.md`
- Subreddits: r/realtors, r/Landlord, r/propertymanagement, r/airbnb_hosts, r/ShortTermRentals, r/HOA, r/FirstTimeHomeBuyer (consumer side)
- Forums: BiggerPockets
- Trade press: Inman, HousingWire
- Incumbents: AppFolio, Buildium, Yardi Breeze, TurboTenant, DoorLoop, Guesty, Hostaway, Hospitable
- Surveys: NAR Member Profile, NARPM
- Angles: maintenance coordination, STR regulation patchwork, HOA dysfunction, NAR settlement aftermath, tenant screening

### 4. Logistics and trucking → `02-industries/logistics-trucking.md`
- Subreddits: r/Truckers, r/FreightBrokers, r/logistics, r/supplychain
- Forums: TruckersReport
- Trade press: FreightWaves, Supply Chain Dive, Transport Topics
- Incumbents: DAT, Truckstop, Motive, Samsara, McLeod, Alvys, Tai TMS, project44
- Surveys: ATRI Critical Issues (annual ranked top-10)
- Angles: detention time, double brokering fraud, factoring pain, back-office paperwork for small fleets, freight recession aftermath

### 5. Restaurants and hospitality → `02-industries/restaurants-hospitality.md`
- Subreddits: r/restaurantowners, r/KitchenConfidential, r/BarOwners, r/Chefit
- Trade press: Restaurant Dive, Nation's Restaurant News, Restaurant Business
- Incumbents: Toast, Square for Restaurants, 7shifts, MarginEdge, Restaurant365, OpenTable/Resy (fee anger), SevenRooms
- Surveys: National Restaurant Association State of the Industry
- Angles: third-party delivery fees, food cost/invoice OCR, scheduling, no-show diners, tip law changes

### 6. Retail and e-commerce → `02-industries/retail-ecommerce.md`
- Subreddits: r/ecommerce, r/FulfillmentByAmazon, r/AmazonSeller, r/shopify, r/Etsy, r/dropship
- Forums: Shopify Community
- Trade press: Marketplace Pulse, Modern Retail, Retail Dive, Digital Commerce 360
- Incumbents: Shopify App Store apps (Klaviyo, Recharge, Gorgias), ShipStation, Amazon Seller Central itself, Faire
- Angles: Amazon account suspensions/fees, returns fraud, Shopify app subscription stack cost, tariff/de-minimis changes, TikTok Shop ops

### 7. Legal services → `02-industries/legal-services.md`
- Subreddits: r/Lawyertalk, r/LawFirm, r/paralegal
- Trade press: Above the Law, Legal Dive, ABA Journal, Lawyerist
- Incumbents: Clio, MyCase, PracticePanther, Smokeball, Filevine, LEAP, NetDocuments
- Surveys: Clio Legal Trends Report, ABA TechReport
- Angles: intake/lead response, billable-hour leakage, court deadline management, records retrieval, AI-hallucination sanctions fear

### 8. Accounting, bookkeeping, tax → `02-industries/accounting-bookkeeping-tax.md`
- Subreddits: r/taxpros, r/Bookkeeping, r/Accounting
- Forums: TaxProTalk
- Trade press: Accounting Today, CPA Practice Advisor, Journal of Accountancy
- Incumbents: QuickBooks Online/Desktop (sunset + price anger), Xero, Karbon, Canopy, TaxDome, Drake, Lacerte, ProSeries
- Surveys: AICPA PCPS Top Firm Issues
- Angles: staffing shortage/offshoring, client document chasing, Intuit price hikes, workflow tools for small firms, CAS growth

### 9. Insurance and financial services → `02-industries/insurance-financial-services.md`
- Subreddits: r/Insurance, r/InsuranceAgent, r/loanoriginators, r/CFP
- Forums: insurance-forums.com
- Trade press: Insurance Journal, ThinkAdvisor
- Incumbents: Applied Epic, EZLynx, HawkSoft, AgencyZoom, NowCerts, Vertafore AMS360, Salesforce FSC
- Data: CFPB complaint database, Big I surveys
- Angles: carrier appetite chaos, E&O exposure, quoting across carriers, home-insurance market crisis, commission reconciliation

### 10. Education and training → `02-industries/education-training.md`
- Subreddits: r/Teachers, r/Professors, r/ECEProfessionals, r/homeschool
- Trade press: EdSurge, EdWeek, Inside Higher Ed, Higher Ed Dive, K-12 Dive
- Incumbents: PowerSchool, Canvas, Google Classroom, ClassDojo, Teachers Pay Teachers, tutoring platforms
- Angles: enrollment cliff (hitting now), ESA/voucher expansion paperwork, AI-cheating arms race, teacher admin burden, microschool ops

### 11. SMB manufacturing and industrial → `02-industries/manufacturing-industrial.md`
- Subreddits: r/manufacturing, r/machinists, r/PLC
- Forums: Practical Machinist, cnczone
- Trade press: IndustryWeek, Manufacturing Dive, The Fabricator
- Incumbents: NetSuite, Fishbowl, ECI JobBOSS/E2, Global Shop, Epicor, Fulcrum, Paperless Parts
- Angles: quoting/RFQ pain in job shops, ERP hatred at small scale, reshoring, tribal knowledge loss as boomers retire, supplier certs/compliance docs

### 12. Agriculture → `02-industries/agriculture.md`
- Subreddits: r/farming, r/agriculture
- Forums: NewAgTalk / AgTalk
- Trade press: AgWeb, Successful Farming, AgFunderNews
- Incumbents: John Deere Operations Center, Climate FieldView, Granular (shutdown fallout), Bushel, AgriWebb
- Angles: farm data ownership/interop, H-2A labor paperwork, grant/subsidy paperwork, direct-to-consumer meat/produce ops, equipment right-to-repair

### 13. Creative, media, creator economy → `02-industries/creative-creator-economy.md`
- Subreddits: r/freelance, r/WeddingPhotography, r/videography, r/podcasting, r/NewTubers, r/graphic_design
- Trade press: creator-economy reports (SignalFire, Linktree, Kajabi), The Publish Press
- Incumbents: HoneyBook (price anger), Dubsado, 17hats, Pixieset, Patreon, Kit (ConvertKit), Kajabi
- Angles: client-chasing/scope creep, brand-deal admin, platform demonetization risk, AI content flood devaluing work, invoice chasing

### 14. IT services and MSPs → `02-industries/it-services-msp.md`
- Subreddits: r/msp (extremely candid), r/sysadmin
- Communities: MSPGeek; trade press: ChannelE2E, CRN
- Incumbents: ConnectWise, Kaseya/Datto (post-acquisition fury, contract anger), Autotask, NinjaOne, Syncro, HaloPSA, Pax8
- Angles: PSA/RMM consolidation anger, vendor lock-in, client documentation (IT Glue alternatives), compliance-as-a-service demand (CMMC, cyber insurance questionnaires)

### 15. HR and staffing → `02-industries/hr-staffing.md`
- Subreddits: r/recruiting, r/humanresources, r/AskHR
- Trade press: HR Dive, SIA, ERE
- Incumbents: Bullhorn, JobAdder, Workable, Greenhouse, BambooHR, Gusto, Rippling, Deel
- Angles: ghost candidates/AI-generated applications flood, 1099 compliance, PEO switching pain, staffing agency back-office, I-9/E-Verify changes

### 16. Personal services (salon, fitness, pets, cleaning, childcare, weddings, funeral, other micro-verticals) → `02-industries/personal-services.md`
- Subreddits: r/sweatystartup, r/Petsitting, r/dogtraining (pro side), r/Hairstylist, r/barbers, r/personaltraining, r/weddingplanning (vendor threads), r/ECEProfessionals
- Incumbents: Fresha (commission anger), Booksy, GlossGenius, Vagaro, Mindbody, Skimmer (pools), Time To Pet, Jackrabbit, Brightwheel, Procare, HoneyBook, Aisle Planner; funeral: Passare; NFDA reports
- Angles: no-show/deposit enforcement, booking-platform fee revolts, underserved micro-verticals (funeral homes, pools, marinas, campgrounds), childcare waitlist chaos

### 17. Automotive services → `02-industries/automotive-services.md`
- Subreddits: r/MechanicAdvice (pro threads), r/Justrolledintotheshop, r/AskAMechanic
- Forums: AutoShopOwner.com; trade press: Ratchet+Wrench
- Incumbents: Tekmetric, Shopmonkey, Shop-Ware, Mitchell1, ALLDATA, CCC (collision), CDK (dealership; 2024 ransomware fallout), Reynolds & Reynolds
- Angles: parts procurement chaos, DVI adoption, ADAS calibration, technician shortage, EV service transition, CDK-outage trust damage

### 18. Nonprofits and energy/solar → `02-industries/nonprofits-energy-solar.md`
- Subreddits: r/nonprofit (grant pain is legendary), r/solar (consumer + installer threads)
- Trade press: Chronicle of Philanthropy, NonprofitAF; Solar Power World, pv magazine
- Incumbents: Blackbaud Raiser's Edge (famously hated), Bloomerang, Little Green Light, Neon One, DonorPerfect, Salesforce NPSP (complexity); Instrumentl; Aurora Solar, OpenSolar, Solargraf
- Angles: grant discovery/reporting burden, donor CRM misery at small orgs, board reporting, solar incentive paperwork (IRA/ITC changes, NEM 3.0 aftermath), installer cash-flow

## Consumer cross-cutting domains → `04-consumer-cross-cutting.md`

Health-insurance navigation and claim denials; medical billing; caregiving/eldercare admin; death/estate administration; renting; moving; subscription cancellation and dark patterns; home-insurance non-renewals; wedding planning; immigration/USCIS paperwork; childcare search; personal finance/debt collection.

Venues: CFPB API, BBB, ConsumerAffairs, Trustpilot (snippets), r/HealthInsurance, r/AgingParents, r/CaregiverSupport, r/EstatePlanning, r/Renters, r/moving, r/USCIS, r/personalfinance, r/povertyfinance, r/weddingplanning, DOT complaint stats, Medicare.gov navigation complaints.
