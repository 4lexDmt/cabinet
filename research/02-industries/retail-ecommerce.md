# Retail & E-commerce — Problem Findings

- **Researched:** 2026-09-17
- **Vertical scope:** Shopify/Amazon/Etsy/TikTok Shop sellers, DTC brands, small importers. Excludes enterprise retail chains and pure brick-and-mortar POS (only touched where marketplace sellers overlap).
- **Searches/fetches performed:** 14 web searches, 2 direct fetches (Shopify App Store review pages fetch directly; HN Algolia API)

## Industry snapshot

- Buyers: solo/2-10-person marketplace sellers and DTC brands. Amazon's active US seller count fell from 584,000 (Jan 2025) to 500,000 (Mar 2026) while fewer than 8,000 sellers now generate half of ~$300B US third-party GMV — the surviving mid-tail is professionalized and spends on tools ([Marketplace Pulse, 2026 Seller Index](https://www.marketplacepulse.com/articles/the-paradoxical-dependence-of-amazon-its-sellers)).
- 2026 operating climate is defined by cost shocks: tariffs/de-minimis repeal, Amazon fee stacking, and ad inflation. Netstock's 2026 Tariff Impact Report: 72% of SMBs cite cost-related challenges; 82% pass tariff costs to customers ([netstock.com](https://www.netstock.com/research/2026-tariff-impact-report/)).
- Jungle Scout surveyed ~1,500 sellers (Jan 10–27, 2025): SMBs' single biggest challenge = rising costs; ~40% cite shipping costs, 34% rising COGS, 32% ad costs ([junglescout.com](https://www.junglescout.com/resources/reports/amazon-seller-report-2025/)).
- Software posture: Shopify pushes features into paid apps ($20–40 each, stacks of 10+); Amazon tooling is fragmented (sellerboard $19–79/mo up to Triple Whale $219–749+/mo GMV-priced). Klaviyo-style contact-count pricing is a repeated anger source.
- Effective marketplace take rates: Amazon ~50%+ all-in per Marketplace Pulse seller P&Ls; SE-Asia platforms 20–25% post-discount (Cube Asia via r/ecommerce, Q2 2026).

## Top problems

### retail-P1. Sellers can't see true per-SKU profit after marketplace fees, ads, refunds, and COGS — "Seller Central shows you revenue. You need to see where that revenue disappears."

- **Who hurts:** FBA sellers $100K–$5M revenue; Shopify merchants doing manual monthly P&L
- **What happens now (workaround):** CSV exports into custom Google Sheets with COGS per line item; sellerboard at $19–79/mo (accuracy complaints); or discovering annual profit only at tax time
- **Frequency:** daily anxiety, monthly bookkeeping ritual
- **Evidence:**
  - community https://www.reddit.com/r/FulfillmentByAmazon/comments/1mpw8cz/just_did_the_math_on_my_q3_amazon_numbers_kinda/ — "Total Amazon-related costs: $32,130 which works out to 37.8% of revenue... My referral fees alone are over $10K which is actually *more than* my net profit margin." (undated, 2025 era; snippet)
  - community https://www.reddit.com/r/FulfillmentByAmazon/comments/1p1cc9k/ — "sellers think they're profitable because they see revenue growing in Seller Central, but they're actually keeping 8-12% after all costs." (undated; snippet)
  - community https://www.reddit.com/r/shopify/comments/1u1b4ng/basic_sales_report/ — "A better approach is to create one monthly report that combines sales, refunds, transactions, fees, shipping label costs, and payout data together." (undated; snippet)
  - review-gap https://www.amzfinder.com/blog/sellerboard-alternatives/ — sellerboard Trustpilot reviews: "They messed up margin calculations for a few of my products, couldn't tell me why, and support was being dismissive" (1★, 2023-07-26); "customer support [that is] non-existent, with AI-responses and no fixes" (2★, 2025-11-24) (snippet)
- **Incumbent gap:** Seller Central buries fee data across 6+ reports; sellerboard is cheap but reviewers report inaccuracy and slow dashboards; Triple Whale prices on GMV ($219–749+/mo) so high-AOV small teams overpay; Lifetimely order-tier jumps hit exactly at BFCM ([sarasanalytics.com](https://www.sarasanalytics.com/blog/lifetimely-alternatives)).
- **Spend signal:** documented tool ladder $19→$999/mo; Marketplace Pulse P&L samples show 50–60% all-in take rate making per-SKU truth existential ([eightx.co](https://eightx.co/blog/amazon-all-in-take-rate))
- **Catalyst / trend:** Amazon low-inventory-fee tier (Oct 2025) and expanded inbound placement fee (Feb 2026) added new fee lines to reconcile ([ecommerce-times.com, May 28, 2026](https://ecommerce-times.com/amazon-merchant-fees-hit-record-high-as-fba-costs-surge-18-in-2026/) — secondary source, treat % with caution)
- **Preliminary scores (0-5):** severity×frequency 5 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 2 · why-now 3
- **Solo-builder angle:** An accuracy-obsessed, flat-priced per-SKU profit ledger that reconciles Amazon settlement + Shopify payout + ad spend into one monthly statement (the "unified summary statement" merchants describe building by hand).

### retail-P2. Amazon account suspension is an existential event with a documented $495–$8,000 grey market for appeals and 30–180-day fund freezes

- **Who hurts:** any Amazon seller; worst for single-channel FBA businesses with 5-6-figure frozen balances
- **What happens now (workaround):** pay reinstatement consultants ($495 basic to $5,000+ full engagement, $10-30k arbitration); or DIY appeals that worsen the case
- **Frequency:** episodic but catastrophic; account-health monitoring is daily
- **Evidence:**
  - willingness-to-pay https://reinstato.com/amazon-seller-suspension-appeal-options/ — "The full ready-to-submit package is $495 USD, one payment." (fetched snippet, 2026 live pricing)
  - willingness-to-pay https://www.ecommercechris.com/amazon-seller-services/amazon-account-reinstatement/ — "Starts the process today: $5000... Start immediately $6,000... Mission-critical revenue at risk right now." (2026 live pricing; snippet)
  - guide https://shopappy.com/ecommerce/amazon/amazon-suspension — "Full reinstatement engagement $2,000 to $8,000... Arbitration filing $10,000 to $30,000 all-in... Disbursement holds usually run 30 to 90 days after reinstatement, and 180 days for accounts under account-level review" (2026 guide)
  - willingness-to-pay https://proserviceappeal.com/amazon-reinstatement-service-in-usa/ — "Account Health Maintenance $200/month ongoing monitoring to prevent future suspensions" (snippet)
- **Incumbent gap:** Amazon's own Account Health dashboard is reactive and vague ("Amazon's original suspension notification is often vague" — ecommercechris); consultants sell labor, not software; no affordable pre-suspension early-warning + evidence-vault product for small sellers.
- **Spend signal:** $200/mo monitoring retainers and $495–8,000 one-off fees are openly price-listed — rare direct proof of willingness to pay
- **Catalyst / trend:** none — structural (Amazon enforcement volume persists; seller count shrinking makes each account more valuable)
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 5 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** "Account-health firewall": monitors ASIN/policy signals, keeps invoices/supply-chain docs pre-organized as an appeal-ready evidence pack, sold at $50–100/mo against $200/mo human monitoring.

### retail-P3. De-minimis repeal turned every small cross-border parcel into a customs entry with $25–75 brokerage on a $50 order

- **Who hurts:** small importers, dropshippers, Etsy/eBay sellers sourcing abroad, foreign micro-brands selling into the US
- **What happens now (workaround):** eat 10%+ duties plus per-entry brokerage; switch to bulk import + US 3PL; some just stopped shipping to the US
- **Frequency:** every inbound parcel since Aug 29, 2025
- **Evidence:**
  - catalyst (primary) https://www.federalregister.gov/documents/2025/09/02/2025-16802/ — "Executive Order 14324 suspends the duty-free de minimis exemption... for all covered products, regardless of country of origin, valued at $800 or less" effective 12:01 a.m. Aug 29, 2025 (Federal Register, Sept 2, 2025)
  - catalyst (primary) https://www.cbp.gov/sites/default/files/2025-08/factsheet%5Fsuspension%5Fof%5Fduty-free%5Fde%5Fminimis%5Ftreatment.pdf — postal shipments: "A flat duty ranging from $80 per item to $200 per item... The specific duty option will be available for six months; all shipments must use the ad valorem method beginning Feb 28, 2026." (CBP, Aug 2025)
  - trade press https://dedola.com/blog/life-after-de-minimis-navigating-ecommerce-freight-forwarding-in-2026/ — "the brokerage fee for an individual entry typically ranges from $25 to $75. For a $50 order, the total cost to clear customs can reach $80" ... "each parcel requires a 10-digit HTS classification and a specific entry filing" (2026)
  - trade press https://www.forbes.com/sites/joanverdon/2025/08/29/de-minimis-tariff-change-will-have-maximum-impact-on-small-businesses/ — "the biggest impact is expected to hit U.S. small businesses" (Aug 29, 2025; snippet)
- **Incumbent gap:** customs brokers price per entry and ignore micro-shippers; enterprise landed-cost suites (Zonos, Avalara) are overkill; sellers need cheap HTS classification + duty math + entry-consolidation decisions.
- **Spend signal:** $25–75 forced brokerage spend per parcel is a per-transaction pain meter; Netstock: 72% of SMBs cite tariff cost challenges (2026)
- **Catalyst / trend:** EO 14324 (July 30, 2025, effective Aug 29, 2025); postal flat-duty option expired Feb 28, 2026; Section 122 10% surcharge runs through July 24, 2026 (dedola)
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 4 · why-now 5
- **Solo-builder angle:** AI HTS-classification + landed-cost calculator for sub-$800 parcels that tells a small seller "consolidate these 40 orders into one entry and save $X."

### retail-P4. The Shopify app-stack is a second rent: $400+/mo of overlapping subscriptions merchants can't audit

- **Who hurts:** established Shopify merchants ($20K+/mo GMV) running 8–15 apps
- **What happens now (workaround):** monthly "audit and nuke" rituals; hiring devs to hard-code features into the theme; AI code tools to replace $30/mo single-feature apps
- **Frequency:** monthly bill shock; continuous
- **Evidence:**
  - community https://www.reddit.com/r/shopify/comments/1r857c6/app_fatigue_im_tired/ — "I have been on Shopify for 6 years... Every month when I look at my bill over 1/3 of it is app charges." (undated; snippet)
  - community https://www.reddit.com/r/shopify/comments/1o93nse/ — "Between subscriptions for reviews, upsells, shipping, analytics, and email, I'm easily over $400/month... it's starting to feel like I'm paying rent on my own store." (undated; snippet)
  - community (workaround) same thread — "instead of paying $30/month for a countdown timer app, I just said 'add countdown timer to product page' and it built it directly into my theme. Saved me probably 4-5 app subscriptions" (snippet)
  - dev community https://hn.algolia.com/api/v1/search — Ask HN (Mar 10, 2026): "Heavy reliance on third-party apps for even basic functionality... Increasing long-term costs for store owners" (direct API fetch)
- **Incumbent gap:** Shopify's billing page shows subscriptions but no ROI attribution; every micro-feature is a separate vendor; consolidation apps exist but merchants distrust yet another subscription.
- **Spend signal:** $400+/mo documented stacks; community norm "keep fixed costs under 10% of worst-month net sales"
- **Catalyst / trend:** AI code tools (2025-2026) make replace-an-app-with-theme-code viable for non-devs — deflationary pressure incumbents ignore
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 5 · solo-buildability 4 · whitespace 3 · why-now 3
- **Solo-builder angle:** Productized "app-stack replacement" service/tool: scans installed apps, shows per-app revenue attribution, and generates theme-embedded replacements for the simple ones.

### retail-P5. Returns and refund fraud (INR claims, returnless-refund abuse) drains 4-figure monthly sums and nobody checks the evidence that exists

- **Who hurts:** DTC brands and marketplace sellers, especially low-AOV categories with auto-approved keep-it refunds
- **What happens now (workaround):** absorb losses; manual customer-history checks; packing-video rigs; enterprise tools (Signifyd, Narvar) priced above small merchants
- **Frequency:** weekly claims; structural loss line
- **Evidence:**
  - data study https://refundsentry.com/research/return-fraud-statistics — 12 months of real Shopify refund data: "44 of the 69 bank disputes (64%) were item-not-received claims, worth 20,375 EUR. 37 of those 44 (84%) had a carrier tracking number that could have been checked against delivery confirmation. Nobody checked." (2026)
  - trade/industry https://trackvid.in/blogs/refund-as-a-service-raas-fraud-2026.html — "abusive returns surged 64 percent between January 2024 and May 2025" (citing Signifyd); "Mid-market D2C brands typically absorb $8,000 to $35,000 per month in unrecovered chargeback and [refund losses]" (2026)
  - trade https://www.clickpost.ai/blog/how-to-handle-returnless-refunds — "approximately 14% of all returns being fraudulent"; "Reverse logistics costs can consume up to 50% of profit margin on a single return, according to Gartner research" (snippet)
  - consumer flip-side context https://www.claimlane.com/resources/blog/returnless-refunds-ecommerce — "5 to 10 percent of buyers responsible for 30 to 40 percent of returns" (via trackvid citing Claimlane 2026; snippet)
- **Incumbent gap:** Shopify's fraud analysis scores checkout risk only — "it rated all 69 orders that later became payment disputes as low risk" (RefundSentry); Signifyd/Riskified are enterprise; nothing cheap automates dispute-evidence assembly for small merchants.
- **Spend signal:** $8–35k/mo absorbed losses at mid-market; Loop Returns et al. price high enough that an HN builder pitched a "70% less cost than Loop" clone (HN, Nov 6, 2025)
- **Catalyst / trend:** organized Refund-as-a-Service rings scaled 2024–2026 (Signifyd via trackvid, 2026)
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 4
- **Solo-builder angle:** Post-purchase abuse scorer + one-click dispute evidence pack (tracking confirmation, customer refund history, delivery photo) that wins the INR disputes merchants currently don't even contest.

### retail-P6. TikTok Shop ops are chaos: forced logistics migration (Feb 2026), fee stacking, and penalty loops sellers can't escape

- **Who hurts:** SMB sellers using TikTok Shop as a growth channel, especially multi-channel sellers fulfilling via Amazon MCF
- **What happens now (workaround):** manual order re-routing through approved ERPs; many quit the channel entirely
- **Frequency:** daily ops; migration deadline shock
- **Evidence:**
  - catalyst https://www.reddit.com/r/shopify/comments/1qqc3pz/ — TikTok email quoted: "Effective February 25th, 2026 (PST), your shop will be required to fulfill orders through one of the services within TikTok Shop Logistics Services... Seller Shipping will be discontinued" (posted Jan 29, 2026)
  - community https://www.reddit.com/r/ecommerce/comments/1of9pr0/ — FBT nightmare: "Customer orders are being auto-canceled... TikTok imposed a 7-day order restriction on my shop for... not fulfilling orders (that I literally cannot fulfill due to their broken system)" (undated; snippet)
  - community https://www.reddit.com/r/ecommerce/comments/1mrl9xk/ — "Many reports of shops being shut down and money withheld without explanation"; "Policy changes often and never for sellers benefit." (undated; snippet)
  - fees https://www.reddit.com/r/ecommerce/comments/1t84db6/ — "Effective take rates for established sellers in 2025-2026 are running 20-25% of post-discount sales (Cube Asia data)" (Q2 2026)
- **Incumbent gap:** approved-partner ERPs (AfterShip, ECCANG, LINGXING) are China-market oriented; US/UK small sellers lack a simple TikTok→3PL/MCF bridge with penalty-avoidance logic.
- **Spend signal:** sellers already pay ERP subscriptions + absorb penalty losses; channel does real volume so they tolerate pain
- **Catalyst / trend:** Seller Shipping discontinued Feb 25, 2026 — dated forcing function
- **Preliminary scores (0-5):** severity×frequency 4 · willingness-to-pay 3 · reachability 4 · solo-buildability 2 · whitespace 3 · why-now 5
- **Solo-builder angle:** Narrow "TikTok Shop ops copilot" (order-routing + violation-appeal templates) — but flag: single-hostile-platform dependence is a methodology kill-criterion; treat as service/info-product first.

### retail-P7. Klaviyo-style contact-count pricing punishes list hygiene — merchants literally cannot delete profiles that inflate their bill

- **Who hurts:** Shopify DTC brands with 10K+ contacts; growth-stage merchants
- **What happens now (workaround):** manual segment-then-suppress rituals; switching to Omnisend/SendLayer; eating 2-3x price increases
- **Frequency:** monthly billing cycle
- **Evidence:**
  - review (1★, direct fetch) https://apps.shopify.com/klaviyo-email-marketing/reviews?ratings%5B%5D=1 — "They make it impossible to clear all inactive profiles to susspended. This way they can keep increasing your monthy charge due to profiles." (July 27, 2026)
  - review (1★, direct fetch) same page — "Last year, my monthly price went from 80usd to 150usd. And if I pause and resubscribe, it would be 200usd. That is a 250% price increase... They are in a phase now of just capitalizing the living hell out of their customers." (May 15, 2026)
  - review (1★, direct fetch) same page — "Many fake profiles are created that inflate the plan count. Deleting profiles is very cumbersome—you have to create a segment to do it... we haven't been able to delete any profiles." (July 7, 2026)
- **Incumbent gap:** Klaviyo (4.7★ overall but 258 one-star reviews) monetizes profile-count friction; editor UX called "embarrassingly bad" (May 20, 2026 review); support paywalled after 60 days.
- **Spend signal:** $80→$150→$200/mo documented single-merchant trajectory; email is a "keeper" app category merchants won't drop
- **Catalyst / trend:** none — structural pricing-model resentment
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 4 · reachability 4 · solo-buildability 3 · whitespace 3 · why-now 3
- **Solo-builder angle:** Either a list-hygiene autopilot that auto-suppresses dead profiles before Klaviyo's billing date, or a flat-priced email tool for the 5-50K-contact merchant who resents per-profile pricing.

### retail-P8. Etsy payment reserves freeze 5-figure sums for 90+ days exactly when a shop goes viral

- **Who hurts:** new and suddenly-successful Etsy sellers with physical-product cash cycles
- **What happens now (workaround):** personal savings, day jobs, pausing listings (killing momentum), extending processing times
- **Frequency:** episodic but months-long
- **Evidence:**
  - community https://www.reddit.com/r/EtsySellers/comments/1itla5j/victim_of_success/ — "They currently have over £5,000 of our cash just sitting there... Its like were being punished for being successful." + reply: "Etsy held $13,000 from me!!!" (early 2025; snippet)
  - community https://www.reddit.com/r/EtsySellers/comments/1p6onym/ — "I got a payment reserve today after 8 years, 5,000 sales, and no problems... they just slapped me with a 90 day reserve." (undated; snippet)
  - community https://www.reddit.com/r/EtsySellers/comments/1nvn786/ — new-seller hold mechanics: "'Available' has to be higher than 'not yet available' to get a payout... The hold typically lasts 90 days, though if Etsy finds any risk factors, the hold might be as long as 180 days." (undated; snippet)
- **Incumbent gap:** Etsy refuses manual exceptions; no tool forecasts reserve impact or bridges the cash gap for marketplace sellers (revenue-based financing exists but not reserve-aware).
- **Spend signal:** £5K-$13K locked balances; sellers running out of materials money mid-viral-moment
- **Catalyst / trend:** none — structural platform risk policy
- **Preliminary scores (0-5):** severity×frequency 3 · willingness-to-pay 2 · reachability 4 · solo-buildability 2 · whitespace 3 · why-now 2
- **Solo-builder angle:** Marketplace cash-flow forecaster that models reserve/hold rules across Etsy/Amazon/TikTok and tells sellers their real available cash 8 weeks out (software wedge; lending is out of solo scope).

## Vertical catalysts (dated)

- **De-minimis suspension** — EO 14324 signed July 30, 2025; effective Aug 29, 2025; ACE Type-86 filings rejected ([Federal Register, Sept 2, 2025](https://www.federalregister.gov/documents/2025/09/02/2025-16802/)); postal flat-duty option ($80–200/item) expired Feb 28, 2026 ([CBP factsheet](https://www.cbp.gov/sites/default/files/2025-08/factsheet%5Fsuspension%5Fof%5Fduty-free%5Fde%5Fminimis%5Ftreatment.pdf)).
- **Section 122 10% tariff surcharge** replacing IEEPA spikes, "effective through July 24, 2026" ([dedola.com, 2026](https://dedola.com/blog/life-after-de-minimis-navigating-ecommerce-freight-forwarding-in-2026/)).
- **TikTok Shop Seller Shipping discontinued Feb 25, 2026** — forced migration to FBT/TikTok Shipping ([r/shopify, Jan 29, 2026](https://www.reddit.com/r/shopify/comments/1qqc3pz/)).
- **Amazon fee additions:** low-inventory tiered fee (Oct 2025) and inbound placement fee expansion (Feb 2026) per [ecommerce-times.com, May 28, 2026](https://ecommerce-times.com/amazon-merchant-fees-hit-record-high-as-fba-costs-surge-18-in-2026/) (secondary source).
- **Amazon seller concentration:** active sellers 584K→500K Jan 2025→Mar 2026; <8,000 sellers = 50% of GMV ([Marketplace Pulse 2026 Seller Index](https://www.marketplacepulse.com/articles/the-paradoxical-dependence-of-amazon-its-sellers)).
- **Refund-fraud industrialization:** abusive returns +64% Jan 2024–May 2025 (Signifyd, via [trackvid.in 2026](https://trackvid.in/blogs/refund-as-a-service-raas-fraud-2026.html)).

## Consumer flip-side

- Undelivered orders and unpaid refunds from small online stores dominate BBB complaints; chargeback is the consumer's weapon of last resort: "A Virginia woman paid $400 for three leggings; received only one... had to secure a refund via chargeback" ([BBB warning re Agogie](https://www.bbb.org/article/warnings/32112-bbb-warning-consumers-report-missing-orders-refund-issues-with-agogie-inc)).
- Sellers then refuse refunds during chargebacks, deadlocking consumers ([Wellnee BBB complaints](https://www.bbb.org/us/id/post-falls/profile/online-retailer/wellnee-1296-1000143347/complaints?page=13), July 2025).
- Gift-card-only refund policies and denied INR claims ("no picture, no signature" proof) burn trust at brands like Kith ([BBB complaints](https://www.bbb.org/us/ny/new-york/profile/clothing/kith-0121-131026/complaints)).
- B2B2C wedge: the same delivery-confirmation/evidence gap that hurts consumers is the gap sellers need closed in P5 — evidence tooling serves both sides.

## Sources that failed or came up thin

- **Direct Reddit fetch blocked** as expected; all Reddit evidence is search-snippet-based, and most thread dates are not exposed in snippets — marked "undated" where so; thread-ID vintage suggests 2024–2026 but is not proof.
- **HN Algolia** worked technically but "shopify app costs" returned mostly Show-HN launches, not merchant complaints — one usable Ask HN quote; HN is a weak venue for merchant pain (they're on Reddit/Shopify Community instead).
- **Shopify Community forum** not directly mined this run (Reddit coverage was dense); a follow-up should run `site:community.shopify.com` queries.
- **ecommerce-times.com "47.3% take rate / FBA +18%" figures** could not be verified against Marketplace Pulse directly (its site shows the 2023 "50% cut" piece and 2026 Seller Index but I did not find the claimed May 27, 2026 report page) — treat that specific number as low-confidence; the 2023 50% figure and 2026 Seller Index stats are solid.
- **Returns-fraud loss figures** ($100B global, $8–35k/mo mid-market) come from vendor-adjacent blogs citing Signifyd/Appriss/Deloitte — directionally consistent across 3 sources but not checked against the primary PDFs.
- **Faire/wholesale and brick-and-mortar POS pain** not covered — scope traded for depth on marketplace/DTC where evidence was richest.
