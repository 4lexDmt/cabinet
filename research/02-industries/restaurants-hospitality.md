# Restaurants & Hospitality — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Independent full-service and limited-service restaurants, bars/cafes, and small independent hotels/inns/B&Bs (5-65 rooms). Not chains/franchise enterprise ops.
- **Searches/fetches performed:** 12 web searches + 1 direct API fetch + 1 fetched-file inspection

## Industry snapshot

- NRA 2026 State of the Restaurant Industry (Feb 2026): $1.55T projected sales, 15.8M jobs — but **42% of operators say their restaurant was not profitable in 2025**; food costs +38% and labor +35-41% vs 2019; 82% reported higher food costs in 2025; 68% blame tariffs for higher food/bev costs. Operators rank the economy as the #1 challenge for 2026, then labor and food costs.
- Pre-pandemic margin baseline was ~5% pre-tax; NRA estimates total expenses for an average restaurant rose 36% between 2019 and 2026 — every fee line now gets scrutinized.
- Software incumbents monetize aggressively: Toast raised software fees ~18% (Oct 2025) then processing +0.1% and subscriptions again (March 2026); OpenTable charges ~$1/cover even on Google searches for the restaurant's own name; MarginEdge/R365 cost $300+/mo; Cloudbeds bills 61-unit hotels ~$811/mo plus add-ons.
- Third-party delivery is a parallel P&L: headline 15-30% commission lands at an effective 28-35%+ after processing, forced promos, packaging, and refund abuse.
- Buyers congregate in r/restaurantowners, r/ToastPOS, r/askhotels, r/bedandbreakfast — unusually specific, numerate complaints with dollar figures attached.

## Top problems

### restaurants-hospitality-P1. Delivery-app refund fraud is systemic and the platforms robo-deny merchant disputes — owners run camera rigs and spreadsheets to fight back

- **Who hurts:** Independent restaurants doing meaningful 3PD volume; QSR/pizza hit hardest; owner or GM burns hours weekly on disputes.
- **What happens now (workaround):** Three-camera packaging/pickup recording setups; weekly Monday error-charge report rituals; spreadsheet fraud logs; dispute → auto-denial → appeal with MP4 evidence upload; chasing "merchant experience partners" for a week per ticket.
- **Frequency:** 3-5 disputes/week for a busy store; error charges land daily.
- **Evidence:**
  - Community https://www.reddit.com/r/restaurantowners/comments/1rmb96g/doordash_disputes_are_now_requiring_evidence_get/ — "Doordash has again moved to robo-deny all merchant disputes… I dispute consumer fraud and driver theft at least 3-5 times a week… we get refund text and photos of items we don't even sell, items that are almost fully eaten, photos of entirely different receipts, and just blank photos." (2026-era) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1b3upce/anyone_noticing_dd_has_removed_the_dispute_option/ — "I track it on a spreadsheet and its always 70-75+% of refund claims from third-party apps are fraud… we use three cameras to record our packaging and pickup… so we can always irrefutably prove it." (n.d.) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1ebla7a/how_do_your_restaurants_handle_delivery_error/ — "Each Monday, I run reports on error charges on both Uber Eats and DoorDash… about 60-70% of the time it is [suspicious], I dispute and almost always win. DoorDash recently limited my ability to dispute one charge because their algorithm determined an 'unusually' high dispute rate." (2024-25) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1ksx6zv/ysk_doordash_is_moving_to_robodeny_refund_disputes/ — "there are indeed some pieces of shit that asked for a refund in excess of $70 for missing items for a single order. Lots of itty bitty ones for like $3-6. Wow... I need to be on top of it more." (2025) (snippet)
- **Incumbent gap:** DoorDash/Uber merchant portals are adversarial by design (auto-denial, removed dispute options for pickup orders); POS vendors don't reconcile error charges; no tool matches camera clips + order timestamps into an evidence packet.
- **Spend signal:** Owners already bought multi-camera rigs specifically for disputes; error charges run $3-70+ per incident on daily volume; one owner reports winning "100% of what we dispute" when evidence exists — the labor is the bottleneck.
- **Catalyst / trend:** DoorDash's 2025-2026 dispute-workflow change (evidence uploads accepted on appeal, .mp4 supported) makes automated evidence assembly newly decisive.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 4 · why-now 4
- **Solo-builder angle:** An error-charge fighter that pulls 3PD error charges daily, matches each to POS order + camera clip timestamp, and one-clicks a dispute/appeal packet (clip, receipt, photos) — priced per location against provable recovered dollars.

### restaurants-hospitality-P2. Invoice line-item price tracking is a weekly manual chore — incumbents cost $300+/mo and owners are canceling to build spreadsheets

- **Who hurts:** Independent operators (1-5 locations) trying to catch vendor price creep; chefs re-costing menus; bookkeepers reconciling short deliveries.
- **What happens now (workaround):** vlookup recipe-cost spreadsheets; "Price Book" updated from paper invoices weekly; 5 minutes of typing per invoice; xtraCHEF at $200/mo or MarginEdge at $300-480/mo for those who tolerate the price; some cancel and roll their own.
- **Frequency:** Weekly (10-15+ invoices); price checks every order cycle.
- **Evidence:**
  - Community https://www.reddit.com/r/restaurantowners/comments/1odhj2w/looking_for_software_to_track_prices_from_invoices/ — "IMO, margin edge is too expensive w the current AI technology available, especially w the OCR capabilities now. I canceled margin edge that I was paying I think $300/month and am creating my own software and integrating it w my master google sheets." (2025-26) (snippet); same thread: "Takes 5 minutes per invoice but gives you the exact data you want."
  - Community https://www.reddit.com/r/restaurantowners/comments/1jbk4zo/how_do_you_guys_manage_random_pricing_at_sysco/ — "Sysco uses an algorithm pricing… what will happen [is] the algorithm will charge you a small amount on other items to make up the difference." and "They went back on all our agreed pricing. Had to double check every order, argue, negotiate, etc." (2025) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1op4fi6/how_are_you_keeping_track_of_vendor_price_changes/ — "The manual method is a 'Price Book' spreadsheet… Every week, you have to sit down with new invoices and manually update it, flagging any increases. It's effective but tedious, and it's easy to miss new fees." (2025-26) (snippet)
  - Review gap https://www.g2.com/compare/marginedge-vs-toast — MarginEdge reviewer: "I also dislike there are so many issues with invoice transcriptions." (2026) (snippet); corroborated on Reddit: ME's processors logged feta at "$35.94/lb" when the invoice read "$11.23/lbs" (https://www.reddit.com/r/restaurantowners/comments/1ismf0h/restaurant_365_vs_margin_edge_for_cost_tracking/)
  - Ranked survey https://www.restaurant.org/research-and-media/media/press-releases/persistent-cost-increases-and-enduring-demand-will-shape-the-restaurant-industry-in-2026/ — "More than 9 in 10 operators cite food, labor, insurance, energy, and swipe fees as significant challenges. Last year, 42 percent of operators reported their restaurant was not profitable" (Feb 2026)
- **Incumbent gap:** MarginEdge/R365 bundle full back-office (accounting sync, inventory, recipes) when many owners want one job done — line-item price extraction and creep alerts; their human-review pipelines still introduce transcription errors; price point 3-6x too high for single locations.
- **Spend signal:** $200-480/mo current tools; a canceled $300/mo subscription funding a DIY build; NRA-documented 38% food-cost inflation makes every missed $10/case increase material.
- **Catalyst / trend:** Commodity OCR/LLM document parsing collapsed the cost of the core feature in 2024-2026 ("too expensive w the current AI technology available" is the customer saying the wedge out loud); tariff-driven price volatility (68% of operators affected, NRA Feb 2026) makes weekly tracking non-optional.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 4
- **Solo-builder angle:** A $49-99/mo invoice-photo-to-price-book tool: snap/forward invoices, get line-item extraction, per-SKU price history across vendors, and creep alerts — no accounting integration, no inventory module, no onboarding call.

### restaurants-hospitality-P3. Third-party delivery's true cost is opaque — advertised 15-30% lands at 28-35%+ and owners can't see per-channel profitability

- **Who hurts:** Independents where delivery is 20-40% of revenue; owners pricing menus blind across channels.
- **What happens now (workaround):** Marking up app menus 15-40%; capping delivery share deliberately; quarterly ticket-vs-deposit reconciliations that surprise owners; dropping the highest-fee platform and hoping volume shifts.
- **Frequency:** Every order; reconciliation monthly/quarterly.
- **Evidence:**
  - Community https://www.reddit.com/r/restaurantowners/comments/1tsgvad/dreaming_of_opening_a_restaurant_concept_one_day/ — "Real effective rate is usually 28-35% not the 15-30% they advertise, once you add processing (3%), required promos you can't opt out of (5-15%), and packaging costs that come from your margin. If delivery becomes 30-40% of your weekly revenue, you're not running a restaurant anymore, you're running a marketing channel for the platform." (2026-era) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1inru1a/charging_way_more_for_appweb_ordering_vs_in_store/ — "what the industry has not picked up on is that 30% is not the end of the fees 3pd charge or where the losses end. Typically, these apps take around 57% of the tickets charged… the ticket vs what is deposited quarter by quarter is significantly smaller." (2025) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1tsgvad/dreaming_of_opening_a_restaurant_concept_one_day/ — "3rd party charge independent restaurants like 30%. It's garbage. We had to increase our prices on their platform by 20% just to make it remotely viable." (2026-era) (snippet)
  - Community/WTP https://www.reddit.com/r/restaurantowners/comments/1c5j90h/lowest_3rd_party_rate_negociations/ — "I went exclusive with Uber eats for 2 years at 12% no CC fees and got 10k Cash and 30k in marketing money." (2024) (snippet) — negotiation upside exists but only with data.
- **Incumbent gap:** Platform statements are designed to obscure (promos, error charges, processing all netted); POS reports stop at gross sales by channel; Olo-class middleware serves enterprise. Nobody gives a 3-location owner a per-channel contribution-margin view.
- **Spend signal:** 28-35% effective take on a third of revenue; a 20% app-menu markup is the crude self-built fix; $10k cash + $30k marketing extracted by one owner who negotiated with data.
- **Catalyst / trend:** None — structural; delivery share normalized post-COVID and platform fee structures keep mutating (DashPass tiers, promo mandates).
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 3
- **Solo-builder angle:** A 3PD P&L auditor: ingest DoorDash/Uber/Grubhub payout files + POS sales, output true effective rate per platform, per-item channel margins, and a recommended per-item app markup — sold as a monthly report first, SaaS second.

### restaurants-hospitality-P4. POS fee creep: Toast raised software 18% then processing again five months later, and owners can't audit line items they never ordered

- **Who hurts:** Toast's independent-restaurant base (and Clover/Square equivalents); anyone 3+ years into a POS contract where discounts silently expire.
- **What happens now (workaround):** 3-hour support chats; threatening to leave to trigger retention discounts ("squeaky wheel gets the grease"); eating it; a minority churn to SpotOn/Square.
- **Frequency:** Increases land 1-2x/year; every statement carries the creep.
- **Evidence:**
  - Community https://www.reddit.com/r/ToastPOS/comments/1o26voa/toast_fee_increase_october_2025/ — "Did anyone else get hit with a massive increase from toast??? Ours was 18% in software/services fees. Insane… We now pay over $760/month. Contacted Toast and they just keep saying that it was time to raise prices." (Oct 2025)
  - Community https://www.reddit.com/r/ToastPOS/comments/1qptzjq/toast_software_subscription_rate_adjustment/ — Toast notice: "+0.1%" on all card rates from March 1, 2026 with "Estimated monthly fee increase $88.00", plus subscription increases totaling "$78.50"/mo; commenter: "You must not have seen the price increase effective September 1, 2024 which introduced an additional 0.23% processing fee per transaction… Paid directly to Toast by the way..." (Feb 2026) (snippet)
  - Community https://www.reddit.com/r/ToastPOS/comments/1r8bqzl/debating_choosing_toast/ — "our monthly bill is now well over $800/mo. The line items on the invoice aren't things we explicitly signed up for. They are services that just creep in." (2026) (snippet)
  - Review gap https://www.g2.com/compare/run-powered-by-adp-vs-toast — "Horrible customer service. For a small business it is extremely [hard to get] any support from toast… This company is killing small restaurants." (n.d.) (snippet)
- **Incumbent gap:** Statements blend processing, SaaS, hardware subscriptions, and unordered add-ons; effective processing rate vs quoted rate is invisible without manual math; independent merchant-services auditors serve larger accounts.
- **Spend signal:** $760-800+/mo per location POS bills; a single unnoticed 0.23% processing adder on $1M card volume is $2,300/yr; retention discounts prove prices are negotiable when the owner shows up armed.
- **Catalyst / trend:** Toast fee events dated Sept 1 2024 (+0.23%), Oct 2025 (18% software), March 1/20 2026 (+0.1% + subscriptions) — a drumbeat that has r/ToastPOS asking "why isn't there more outrage."
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 5 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** A POS/processing statement auditor for restaurants: upload monthly statements, get effective-rate math, diffs vs last month, flags on new line items, and a negotiation one-pager — flat fee or % of documented savings.

### restaurants-hospitality-P5. Reservation platforms charge $1+/cover for the restaurant's own Google traffic, and quitting costs real bookings

- **Who hurts:** Full-service independents on OpenTable; small high-demand rooms paying network rates for guests they already own.
- **What happens now (workaround):** Negotiating promo waivers each renewal; switching to flat-fee Resy ($99-399/mo) or Tock ($140/mo reported) and accepting smaller networks; two-month cancellation experiments; in-house widgets.
- **Frequency:** Every reservation; invoices monthly.
- **Evidence:**
  - Community https://www.reddit.com/r/restaurantowners/comments/1rvlbc2/opentable_takes_1_for_every_google_referral/ — "they take $1 for every cover that comes from google (including maps). So when somebody searches for my restaurant based on my SEO and ads, Opentable takes $1 per cover… I feel completely scammed." (2026-era) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1in7j3s/opentable_reservations_from_google/ — "This is why I got out of OT. We were praying them $600-800 a month, with little to no customer discovery features… After two months, our numbers were very much the same without OT." (2025) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1949gk6/opentable_or_resy/ — "I'm now using Tock and I swear by it. Love it. $140 a month. Open table was $1100-$1200 a month. Terrible." (2024) (snippet)
  - Community https://www.reddit.com/r/restaurantowners/comments/1t02glb/open_table_vs_tock_reservation_software_opinions/ — "Open Table is $350/month (6 months free) plus they do like a $1.5/cover charge for anyone that books a reservation via their Open Table system." (2025-26) (snippet)
- **Incumbent gap:** OpenTable's per-cover model taxes owned demand; flat-fee rivals lack discovery volume; owners have no attribution tool showing which covers were truly incremental vs. own-brand searches — the data asymmetry is the lock-in.
- **Spend signal:** $600-1,200/mo OpenTable bills; $1-1.50/cover network fees; $5-12/reservation on promoted links; documented switchers saving ~$1,000/mo with flat bookings.
- **Catalyst / trend:** OpenTable's 2025 platform overhaul added a 2% service charge on no-show penalties/deposits/prepaid events (per Washington Times, Sept 10, 2026) — monetizing even the restaurant's protection mechanisms.
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 2 · why-now 3
- **Solo-builder angle:** A reservation-attribution analyzer: classify a restaurant's covers into owned-demand vs. platform-incremental (booking source, search-brand signals), quantify the per-cover tax, and produce the stay-or-switch business case each quarter.

### restaurants-hospitality-P6. No-shows cost ~$49k/location/yr, and deposit tooling either adds booking friction or hands platforms another fee

- **Who hurts:** Full-service restaurants with reservations, especially prime-time/large-party segments; fine dining at $150-300 lost per ghosted cover.
- **What happens now (workaround):** Card holds ($20-50/cover) on peak slots; full prepay for tasting menus; manual confirmation calls/texts; blacklists; eating a 2%+ measured no-show rate (10%+ by broader estimates).
- **Frequency:** Every service; concentrated Fri/Sat and holidays.
- **Evidence:**
  - Trade press https://www.washingtontimes.com/news/2026/sep/10/restaurant-owners-fed-no-show-epidemic-costing-big/ — "The Resos No-Show Index, built from 3,768,761 reservations across 2,417 restaurants between August 2025 and July 2026, puts the recorded no-show rate at 2.33%… Industry benchmarks put the cost of a single no-show at roughly $35 to $60 for a casual restaurant, $75 to $120 for upscale casual, and $150 to $300 in fine dining." (Sept 10, 2026)
  - Vendor data https://bloomintelligence.com/blog/restaurant-no-shows/ — "the 23,792 no-shows in our data represent about $3.9 million in vanished bookings, approaching $49,000 per location per year… parties of 7+ no-show at only 1.8%… small parties… account for over half of all no-shows." (2026) (snippet)
  - Trade press https://www.washingtontimes.com/news/2026/sep/10/restaurant-owners-fed-no-show-epidemic-costing-big/ — "OpenTable rolled out an overhaul across most U.S. restaurants that included a 2% service charge on no-show penalties, deposits and prepaid events… Operators who have made the switch report the rate falling by roughly half." (Sept 10, 2026)
  - Guide https://restaurantcalcs.com/blog/how-much-to-charge-no-show-fee/ — "Reservation no-show rates run 10 to 20% for most full-service restaurants, higher on holidays and weekends. One in five big parties ghosting you, at $600 a pop, is real money walking out the door every month you do not have a policy." (2025-26) (snippet)
- **Incumbent gap:** Card holds live inside the big reservation platforms (with new fee skims); Bloom-style guest-profile automation targets multi-location groups; the walk-in/phone/Google-booking independent has nothing that converts silent no-shows into rebookable cancellations.
- **Spend signal:** ~$49k/location/yr vanished bookings (Bloom network); $16B/yr industry estimates (unsourced, repeated); OpenTable taking 2% of the remedy.
- **Catalyst / trend:** 2025 infrastructure shift — OpenTable/Resy/Tock/SevenRooms all normalized card holds; guest tolerance for deposits crossed over ("the guest who refuses a $20 hold… is the guest most likely not to turn up").
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 3 · reachability 4 · solo-buildability 4 · whitespace 2 · why-now 3
- **Solo-builder angle:** A no-show shield for platform-less independents: SMS confirm/re-confirm flows, one-tap cancel that instantly offers the slot to a waitlist, and optional card holds via Stripe — priced per location, no per-cover tax.

### restaurants-hospitality-P7. Small-hotel PMS is a support desert — Cloudbeds users report broken sites, AI-bot support, and integration taxes on every missing feature

- **Who hurts:** Independent inns/B&Bs/boutique hotels (9-65 rooms) where the owner is also front desk, accountant, and IT.
- **What happens now (workaround):** Hour-long support-chat waits; Etsy Excel books for 14-room properties; stacking paid third-party integrations for basics; painful migrations to Mews/Lighthouse that cost setup fees and revenue.
- **Frequency:** Daily ops; acute at tax-filing and OTA-sync failures.
- **Evidence:**
  - Community https://www.reddit.com/r/askhotels/comments/1tdyi4v/cloudbeds/ — "My property is extremely small, only 14 units… This month I went to generate reports to pay sales tax and everything has changed. Every time I email for support I receive a non helpful AI generated response… Their merchant service fees are way higher than any other company." (2026-era) (snippet)
  - Community https://www.reddit.com/r/askhotels/comments/1tdyi4v/cloudbeds/ — "We're an 18-room boutique property… They broke our website by inserting code in the wrong place, and two weeks later have still not fixed it… wait times to chat with a live agent are over an hour at best." (2026-era) (snippet)
  - Community https://www.reddit.com/r/askhotels/comments/1stemby/pms_needed/ — "We are 9 rooms, have been on Cloudbeds for 3 years… every additional feature you want is a 3rd party integration. This technology demand and extra expense is a killer for small businesses… We're in the process of switching to Mews and the setup process is AWFUL." (2025-26) (snippet)
  - Community https://www.reddit.com/r/hotels/comments/1qgwgfa/cloudbeds_pricing_structure_what_does_it_actually/ — "My quote last month was $811 for a 61 unit hotel. $300 for set up. I would put $ on it that there is some type of additional charge that isn't clear, I'd say the real cost is between $900 to $1k per month." (2025-26) (snippet)
- **Incumbent gap:** Cloudbeds/Mews chase upmarket while support hollows out below ~30 rooms; per-feature integration fees stack; sales-tax/accounting reporting is an afterthought; migrations are so painful they function as lock-in.
- **Spend signal:** $811-1,000/mo quotes at 61 rooms; forced higher-rate payment processing; five-year customers actively shopping exits; one owner replaced Cloudbeds at "25% of the cost" (book-it-now).
- **Catalyst / trend:** None — structural; support degradation (AI-bot replacement of live chat, reported 2025-2026) is actively pushing churn.
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 3 · solo-buildability 3 · whitespace 3 · why-now 2
- **Solo-builder angle:** Don't rebuild the PMS — sell the missing edges to sub-30-room properties: a lodging-tax report generator + guest-profile deduper + OTA-sync sanity monitor that reads from Cloudbeds/Mews APIs, flat $50-100/mo with human email support as the feature.

## Vertical catalysts (dated)

- **Visa/Mastercard $38B swipe-fee settlement — preliminary approval June 9, 2026.** 10bp average credit-interchange cut for 5 years, 1.25% cap on standard consumer cards for 8 years, product-level surcharging, honor-all-cards modification. Restaurants are named among sectors likely to form buying groups. Final approval possibly late 2026-2027; appeals could run to 2029. https://www.reuters.com/world/us-judge-oks-visa-mastercard-38-billion-swipe-fee-settlement-2026-06-09/ ; https://www.paymentsdive.com/news/court-approves-visa-mastercard-settlement/822440/
- **Toast pricing drumbeat:** +0.23% processing (Sept 1, 2024), ~18% software/services increase (Oct 2025), +0.1% processing + subscription increases (March 1/20, 2026). https://www.reddit.com/r/ToastPOS/comments/1o26voa/toast_fee_increase_october_2025/ ; https://www.reddit.com/r/ToastPOS/comments/1qptzjq/toast_software_subscription_rate_adjustment/
- **NRA 2026 State of the Restaurant Industry — Feb 2026.** 42% of operators unprofitable in 2025; food +38%/labor +35-41% vs 2019; 68% cite tariff-driven cost increases; some reciprocal tariffs lifted Nov 2025 after costs were absorbed. https://www.restaurant.org/research-and-media/media/press-releases/persistent-cost-increases-and-enduring-demand-will-shape-the-restaurant-industry-in-2026/
- **OpenTable platform overhaul (2025, completing early 2026):** card-hold/no-show infrastructure now standard, with a 2% OpenTable service charge on no-show penalties, deposits, and prepaid events. https://www.washingtontimes.com/news/2026/sep/10/restaurant-owners-fed-no-show-epidemic-costing-big/
- **DoorDash dispute-workflow change (2025-2026):** merchant disputes auto-denied, then appealable with photo/MP4 evidence uploads — evidence tooling now determines who eats fraud. https://www.reddit.com/r/restaurantowners/comments/1rmb96g/doordash_disputes_are_now_requiring_evidence_get/

## Consumer flip-side

- Diners bear the delivery markup: owners systematically price app menus 15-40% above in-store ("We had to increase our prices on their platform by 20% just to make it remotely viable") — consumers increasingly notice the spread and blame the restaurant.
- Legitimate refund claimants get caught in the fraud crossfire: "We are disabled, so use delivery more. Door dash is also refusing customer requests for refund when there are missing items… it's pretty hard to take a photo of a missing item." (r/restaurantowners comment, 2026-era) (snippet)
- Reservation deposits migrate friction to guests: card holds of $20-50/cover are now standard on peak nights; guests who "refuse a $20 hold" are treated as no-show risks by design (Washington Times, Sept 10, 2026).

## Sources that failed or came up thin

- **Hacker News (Algolia API):** "restaurant software" since Jan 2025 returned mostly Show HN self-promotion (StagePOS, directories) — no organic complaint threads worth citing.
- **G2 mining was fragmentary:** compare-page snippets only (~304 Toast reviews visible); pull-quotes captured but per-review dates unavailable — Toast review evidence is undated.
- **No-show statistics conflict:** measured platform data says 2.33% (Resos Index, 3.77M reservations) while vendor content repeats "10-20%" and a "$16B annually" industry cost with no traceable primary source — treat the big round numbers as lower-confidence.
- **checkless.io, beancount.io, restaurantcalcs.com, shopappy.com** are content-marketing/SEO properties; used only for corroboration and benchmark framing, not as primary evidence.
- **Several Reddit threads lacked visible dates in snippets** (marked "n.d." or era-inferred from thread IDs).
- **Small-hotel evidence skews to one vendor (Cloudbeds):** complaints are vivid but concentrated; a fuller review-site pass (HotelTechReport) wasn't performed this run.
