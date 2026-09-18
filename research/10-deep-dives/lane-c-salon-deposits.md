# Lane C deep-dive — Visa-clean deposits for salons / med-spas / tattoo / fitness

- **Researched:** 2026-09-18. Builds on `02` P2, `06` personal-services-P2, `08` WOUNDED, `09` Lane C kit. Does not repeat those files.
- **Question this file answers:** will owners pay a third party $29–49/mo *without switching booking stacks*, and can a bolt-on even attach?
- **Searches/fetches:** 40+ live queries; Visa Core Rules (Apr 2026 ed.) and Mastercard Transaction Processing Rules (Jun 2026 TOC / Appendix F) fetched as PDFs; Visa Advance Payment fact sheet (12 Mar 2020); Visa VAMP fact sheet 2025 v2.

**Headline.** The Visa rule is still load-bearing. The *wedge* is more wounded than `08` scored: Square already ships **deposits on the Free plan**; Vagaro’s deposit gate is **$10/mo**, not $49; incumbents **forbid third-party processors** on deposits; Kevonia already sells a $49.99/mo Stripe-deposit booking page. Desk research cannot kill Lane C, but it relocates the product from “bolt-on on Fresha/Square/Vagaro” to a **standalone booking-link replacement** (or a Venmo-replacement for tattoo), with the Visa explainer as GTM, not as the SKU.

---

## 1. Problem anatomy

1. **Book** — client picks a slot. Leak: no commitment; empty chair if they vanish.
2. **Policy disclosure** — T&Cs, a checkbox, or nothing. Leak: buried policy → Dispute 13.7 (failed disclosure) and Fair Credit Billing Act “not delivered” framing (LegalClarity citing 15 USC 1666).
3. **Reminder** — SMS/email. Leak: forgetting, not malice; reminders cut no-shows but don’t recover dollars.
4. **No-show / late cancel.** Leak: contribution margin of the slot, not the sticker (GrowBien).
5. **Fee attempt or deposit forfeiture.** Two different transactions: a stored-card **penalty after the fact** vs a **partial advance payment taken at booking**.
6. **Dispute.** Issuer files; merchant answers on the processor’s clock (Stripe “usually 7–21 days”; Visa acquirer has 30 calendar days on Category 13 — Redo citing Visa Core Rules 18 Apr 2026).
7. **Evidence.** Need: separate consent, receipt labeled Deposit/Advance Payment, cancel-by date/time, consistent enforcement, comms.
8. **Outcome.** Merchant win rates overall ~20–30% (Chargebacks911 via Rebutto, 2025 — not beauty-specific); formatted evidence claimed 60–80% (Rebutto citing “Stripe merchant data, 2024” — **vendor**). Even a won dispute often keeps the processor fee (Vagaro: ~$25–$30 filing fee “unlikely refunded”).

**Where the money actually leaks.** Chair-time is the weekly leak; chargebacks are episodic but cash-killing because the issuer reverses first.

Square community (2025–26): no-show “protection” **declines** when clients lock cards / expire cards / use gift cards — “4/10 of their cards decline” (snippet). That is a *collection* leak, not a Visa-rule leak. Vagaro’s own help article admits deposits “are more protected and less likely to be disputed” than after-the-fact cancellation fees.

A third leak is **inconsistent staff behavior**: the loud client is refunded, the quiet one is charged — Visa 13.7 (guidelines + GrowBien quoting Core Rules) treats “disclosed but did not apply” as a listed cause. A fourth leak is **descriptor mismatch**: client thought “hold,” salon meant “forfeit” (Kevonia 2026).

**Timelines (Visa, authoritative + processor).** 13.1: typically 120 days from processing date *or* last expected delivery, outer cap 540 days; 15-day wait after expected delivery (Disputed.ai / LegalClarity summarizing Core Rules — confirm against Table 11-92 if fighting a case). 13.7: 15-day wait after cancel, then ~120 days, 540-day cap. Category 13 acquirer response: **30 calendar days** from Dispute Processing Date; Stripe shortens that to “usually 7–21 days” for the merchant. Mastercard 4853 lodging no-show: issuer 120 days; acquirer second presentment 45 days (Mastercard Chargeback Guide, merchant ed.). Beauty MCCs are **not** in that lodging program (see §5). If the client files **10.4 fraud** instead of 13.1, Compelling Evidence 3.0 wants prior undisputed bookings with matching device/IP/email — GrowBien’s third vendor question; most beauty schedulers will not export that.

---

## 2. Persona map

Tickets are **vendor-platform or trade**, labeled as such.

| Persona | Typical ticket | Volume / no-show | Who controls the stack | Who eats the chargeback |
|---|---|---|---|---|
| **Solo booth renter** (Sola/Phenix) | Hair median **$77**; full-service salon **$114** (Zenoti 2026 salon benchmark — *platform data*) | Sets own policy; r/hairstylist 1shp89g: 3–4 last-minute/month before deposits, ~1 after 20% deposit *(snippet)* | Owns Square/GlossGenius/Booksy; salon’s Fresha is someone else’s | **The renter**, if they process. Deposit goes to them; they still pay daily booth rent (~$110/day cited 1r0po9m) |
| **Small salon owner** | Same tickets × chairs | Fresha Dec 2025 UK survey (200 businesses): 30% see 1–2 cancels/week; 56% “significant income loss”; **~7% of monthly revenue** to cancellations (*Fresha-commissioned*, Professional Beauty 9 Feb 2026) | Owner picks Vagaro/Fresha/Square; stylists may not | Owner’s MID. Commission shops sometimes split the fee (1r0po9m) |
| **Med-spa manager** | Median ticket **$216**, 90th **$484** (Zenoti 2026 medspa edition — *platform*). Botox session **$250–$600**, filler **$500–$1,200**/syringe (clinic/directory 2025–26) | Zenoti: medspa no-show **5%** (*their base*). Other vendor pages 5–22% with no method (GrowBien: do not borrow) | Boulevard/Mangomint/Zenoti; medical director in the loop | Practice MID. Packages + results disputes sit next to no-show disputes (medspa-merchantservices playbook) |
| **Tattoo studio / chair** | Small **$100–$300**, medium **$300–$800**, hourly often **$100–$300+** (Neebol 2026). Deposits commonly **$50–$200** (TattooGenda / Sortra 2026 — *vendor/trade*) | Deposit-native culture already. No-shows still happen; chargebacks on Venmo/Cash App deposits are messy | Artist often owns the booking link; shops may use TattooGenda / Booksy | Artist if they took the deposit off-platform |
| **Fitness / PT studio** | In-person PT ~**$40–$100**/session; NASM avg **$61/hr** (Trainerize 2026). Etisia planning table: fitness **20%** no-show (*vendor model*) | Class no-shows 20–30% cited by TRTC as “ClassPass/Mindbody data” — **unverified here** | Mindbody from **$79/location** (Mindbody US blog); or Acuity/Calendly | Studio, unless independent trainer on own Stripe |

HIPAA-adjacent: Boulevard Medspa add-on list **$65** includes a BAA (Boulevard support). Mangomint: HIPAA/BAA **included** after 1 Aug 2026 pricing reset. Square publishes a HIPAA BAA that *can* cover Appointments “explicitly identified as HIPAA-enabled” (squareup.com/us/en/legal/general/hipaa); AccountableHQ still warns Appointments can expose PHI without a BAA. A deposit bolt-on that stores treatment names is a BAA problem for med-spas.

**Booth renter vs owner (control and cash).** r/hairstylist 1r0po9m: independent booth renter keeps the forfeited deposit “to pay for the booth rental”; 50% commission shops split the cancellation fee. The renter has policy control and eats both the empty chair *and* the dispute fee. The owner of a commission floor has HR/brand fear (“don’t upset the regular”) and often forbids strict deposits. Suite-rental (Sola/Phenix) is the persona most able to swap a booking URL without a staff vote. Fitness studios are the opposite: the owner bought Mindbody; the trainer does not control checkout.

---

## 3. Root causes

1. **Incumbent UX defaults to the illegal-for-beauty pattern.** Square’s paid “Hold card in case of no-show” and Fresha’s “Capture card details only” are Guaranteed-Reservation-shaped: credential now, penalty later. Stripe Checkout docs even pitch `setup_future_usage` “for future fees, such as cancellation or no-show fees.” That is the 13.1-shaped charge.
2. **Owners do not read Visa.** GrowBien (27 Aug 2026): six r/Esthetics / r/medspa threads in one month, none cited the Core Rules. r/hairstylist still debates 50% vs $50 deposits as taste, not as transaction type.
3. **Fear of losing clients.** 1f7jcn5: “every time I make any policy changes I get scared”; another shop *stopped* deposits/fees after chargebacks because “we get a fee everytime.” 1shp89g: collecting a £25 fee is “a fight. Half ignore me, half threaten to leave a bad review.” Discretionary waivers (being “nice” for emergencies) are exactly 13.7’s “disclosed but did not apply.”
4. **Feature gating — real but smaller than the original brief.** Vagaro Online Shopping Cart is **$10/mo USD** (Vagaro support, current). Square **no-show fee charging** is Plus/Premium (**$49 / $149** per location); **deposits are on Free**. Fresha upfront payments require **Fresha Payments** (help center); booking can run without it. GlossGenius deposits are on every plan; 100% chargeback protection is Gold/Platinum and **card-present only**.

---

## 4. Quantification

**Non-vendor / survey-grade (still commissioned).** Fresha × Professional Beauty, Dec 2025, 200 UK beauty/wellness businesses + 500 clients (pub. 9 Feb 2026): only 8% never see cancels/no-shows; 62% of clients give <24h notice; 56% of businesses report significant income loss; 15% lose 11–20% of revenue; 1% >20%; **average ~7% of monthly revenue** (hair/beauty) vs 6% (health/wellness). This is the strongest non-model dollar signal found. It is still vendor-funded.

**Platform telemetry (selection-biased).** Zenoti 2026 salon FAQ: **8% cancellation, 3% no-show**; medspa no-show **5%**. Opposite end from Etisia’s 14–15% planning table. GrowBien: published med-spa figures 5–22%, “two vendor pages citing the same report gave numbers three times apart.” **Do not use $31,187** (Etisia salon example) in a sales deck; `08` already flagged it F1.

**Chargeback volume / win rates in beauty MCCs.** Not found. MCC 7230 underwriting notes (Gratify) list package and no-show deposit disputes as the main risk; no rates. Vagaro (undated learn article): chargeback fee usually **$25**; Square AU compare page (data dated Feb 2023) claims Square “no chargeback fees,” Vagaro **$30** — stale/AU. SwipeSimple beauty blog: “average $191 per dispute,” $15–25 fee, $450 balayage → ~$641 total — **vendor arithmetic**, friendly-fraud 75% claim unverified. Rebutto 2026: overall merchant win 20–30%; **not MCC 7230**.

**Single lost dispute, honest stack.** Disputed amount (deposit or full service) + processor chargeback fee (~$15–$30 if charged) + processing fee often kept + 30–90 min of owner time (Rebutto DIY $30–$120) + possible acquirer scrutiny. **VAMP:** a salon MID almost cannot hit Visa’s merchant Excessive line (see §5); the scare is acquirer internal ratios, not a 1,500-event Visa program.

---

## 5. Card-network and processor layer (load-bearing)

### Visa (primary)

Fetched: `Visa Core Rules and Visa Product and Service Rules`, **Edition Apr 2026**.

- **§5.8.8.2** (ID# 0029266): a Merchant that accepts a Guaranteed Reservation **must be one of**: Lodging; Aircraft / Bicycle / Boat / Equipment / Motor home / Motorcycle rental; Trailer park or campground; Vehicle Rental. **Beauty, health, tattoo, fitness: not listed.** Must disclose at reservation; ≥24h after confirmation to cancel without penalty; No-Show Transaction only if not properly cancelled and not claimed. Receipt for a No-Show Transaction must include the words **“No Show”** plus daily room/rental rate (Table 5-34).
- Visa public FAQ (visa.com/en-us/support/visa-rules) restates the same merchant-type list.
- **§5.8.11.1 / Tables 5-20, 5-21:** before storing a credential or completing an Advance Payment, **express informed consent**; cancellation/refund policies including the date cancellation privileges expire without Advance Payment forfeiture; those terms **“must be displayed separately from the general purchase terms and conditions.”** Full Advance Payment (entire amount before delivery) is limited to T&E, custom goods/services, certain face-to-face delayed delivery, recreational/tourism. **Partial** Advance Payment is the salon-shaped tool. Stored-credential processing: POS entry mode **10**; account verification or auth **before** storing; decline → notify in writing, ≥7 days to pay another way (Table 5-22).
- **§5.9.2.3 / Table 5-34:** partial Advance Payment receipt must include full cancel/refund policy with date **and time**, amount, and the words **“Advance Payment,” “Deposit,” or “Partial Payment.”**
- **Visa Advance Payment Transactions** fact sheet (12 Mar 2020, usa.visa.com): if the cardholder does not pay the balance and does not cancel in-policy, merchant **may retain the partial prepayment only if the receipt disclosed it is nonrefundable.** Full Advance Payment eligible purchases are T&E / recreational tourism / custom / face-to-face delayed delivery — a 100% prepay of a haircut is *arguably* “custom services,” but the safer, unrestricted path Visa writes for “Any” merchant is the **partial** column.
- **Stored credentials (CIT/MIT).** Table 5-22: written agreement first; then Authorization or Account Verification **before** storing; if that declines, **do not store**. Subsequent stored-credential txs use POS entry mode **10** plus the Recurring / Installment / Unscheduled Credential-on-File indicator. Stripe’s mapping is Checkout `setup_future_usage=off_session` (CIT) then off_session PaymentIntent (MIT). A salon that tokenizes a card with a $0 “hold” and later fires a penalty without the UCOF flag is failing both Visa and the processor’s fraud filters — and Square’s own help says no-show cards “are only held for a single appointment and not saved.”
- **Dispute 13.1 / 13.7** (Visa *Dispute Management Guidelines for Visa Merchants*, June 2024): 13.1 = merchandise/services not received; merchant response includes “partial payment with balance due,” “future services… merchant did not cancel and services were available,” “cardholder cancelled prior… you were able to provide.” 13.7 = cancelled merchandise/services; causes include undisclosed limited return policy and “a guaranteed reservation was cancelled and the customer was charged a No-Show Fee.” Internet: **click-to-accept** (or checkbox) of refund policy in the checkout sequence. GrowBien quotes Core Rules Table 11-91 invalid-13.1 language: *“A partial Advance Payment Transaction when the remaining balance was not paid and the Merchant is willing and able to provide the merchandise or services.”* The public PDF’s **table body did not extract**; treat that sentence as GrowBien quoting the Apr 2026 rules, not as independently OCR’d here. **§5.4.2.5** (GrowBien): merchant must not require the cardholder to waive dispute rights.

### Mastercard (primary — new)

Fetched: Mastercard *Transaction Processing Rules*, Appendix F (file dated with 9 Jun 2026 TOC in the mastercard.com shared PDF).

- **Guaranteed Reservations:** “**All lodging Merchants** who accept Mastercard are automatically enrolled.” Room held until checkout the following day; confirmation number; cancel limits up to 72 hours; default 18:00 local; cancellation number; bill **one night room + tax** only; authorize with MIT value **M207 (No Show Charge)**. This is **lodging**, not MCC 7230.
- **Advance Resort Deposit:** lodging procedure; put **“advance deposit”** on the TID.
- Chargeback Guide: **“No-Show” Hotel Charge** under reason **4853**; issuer windows 120 days; second presentment 45 days. Conditions are hotel-shaped (cancelled, used the room, alternate accommodations, rate mismatch, not advised of fee). **No beauty equivalent found.**

Net: on **both** networks, a salon’s after-the-fact no-show fee is a garden-variety card-absent consumer dispute, not a protected No-Show Transaction.

### VAMP 2025–26 (Visa fact sheet)

Visa *Acquirer Monitoring Program* fact sheet 2025 v2 (corporate.visa.com): VAMP ratio = count(TC40 fraud + TC15 disputes) / count settled CNP TC05. Acquirer Above Standard **≥50 bps**, Excessive **≥70 bps**. Merchant Excessive: AP/Canada/EU/US **≥220 bps** dropping to **≥150 bps (1.5%) on 1 Apr 2026** (footnote 5), **and ≥1,500** fraud+dispute events/month. Enumeration 20% with 300k floor.

**Salon implication:** 1,500 events/month is enterprise volume. A shop with 10 disputes/year is invisible to Visa VAMP. They are **not** invisible to Square/Fresha/Vagaro risk teams, who set internal lines below the acquirer 0.5% portfolio cap. Sell VAMP to a two-chair salon and you will sound like a scammer.

### How a bolt-on would actually work — this is the showstopper

| Incumbent | Can a separate Stripe deposit attach? | What happens at checkout |
|---|---|---|
| **Square Appointments** | Square Developer Forums: “Square does not currently support integrating third-party payment processors.” Payments Terms: authorize **through the Square Service**. Bookings API feature request (8 Jun 2026, **Open**): a custom-site Square Payments deposit **cannot** be applied to the Bookings API appointment; staff must “manually apply the deposit discount.” External Payments API records a bookkeeping `EXTERNAL` payment; it does **not** fund Square balance (and Orders API + non-Square provider may incur a 1% fee). |
| **Fresha** | Upfront payments / no-show fees require **Fresha Payments**. FAQ: you *can* use Fresha without their payments — and then you **lose** deposits/no-show. No public “bring your Stripe” path found. |
| **Vagaro** | Help: “Vagaro **only** accepts and processes deposits and fees from **Vagaro Merchant Services**.” Shopping Cart **$10/mo** + their processing. |
| **GlossGenius / Booksy / Boulevard / Mangomint** | Deposits ride **their** processor. No documented third-party deposit API. |
| **Acuity / Calendly** | Native Stripe (or Square) already. A bolt-on is redundant unless you are replacing their disclosure UX. |

**Reconciliation if you ignore that and split anyway:** deposit descriptor = `STRIPE`/`YOURTOOL`; balance descriptor = `SQUARE *SALON`. Client sees two merchants. Staff must remember a credit. Dispute evidence is split across two MIDs (the 13.1 packet lives on Stripe; the “we were willing to serve” calendar lives in Fresha). Refunds take two consoles. PCI + two BAAs for med-spa. This is not a $29/mo product; it is an integration services business.

**Workarounds people will invent (and why they fail).** (1) Stripe Payment Link in the Instagram bio, then the client also books on Fresha — double-book risk, no calendar lock, no packet. (2) $1 auth to “verify” the card, void, charge later — Visa stored-credential rules want a real agreement + POS 10; $1 auths are also network-restricted (Stripe hold docs). (3) Square Invoice for the deposit, Appointments for the slot — two objects, no auto-forfeit. (4) Zapier “when Fresha booking created → Stripe charge” — you become the MIT without the click-to-accept on *your* screen.

**Precedent.** Calendly+Stripe and Acuity+Stripe are **native**, not bolt-ons. DepositFix is Stripe billing for coaches/HubSpot, not a Fresha overlay. Square External Payments is bookkeeping. **Kevonia** (fetched 2026): $49.99/mo branded booking page + Stripe deposits applied to the appointment — a **standalone replacement**, not a bolt-on. Booksy’s own consumer help: “Please be cautious if a provider asks you to pay upfront… outside of Booksy payments, for example via Cash App.”

---

## 6. Incumbent deposit capabilities (exact) + gap matrix

Compliant pattern = (A) money taken at booking as partial advance, (B) separate click-to-accept of cancel terms, (C) receipt says Deposit/Advance Payment + cancel-by datetime, (D) consistent enforcement log, (E) dispute packet.

| Vendor | What it actually does | Compliant? | Price (fetched/quoted 2026) | 1–3★ / community themes |
|---|---|---|---|---|
| **Square Appointments** | **Deposits on Free+Plus+Premium** (Square help 8096). Policy text at checkout; refundable toggle. **No-show fee / hold-card** = Plus **$49**/loc or Premium **$149**/loc. Charge within 14 days; card not saved unless client opts in; declined card = you’re stuck. Deposits **not** collected when staff books for the client. | Partial: (A) yes on all plans. (B) policy displayed; **not verified** as a separate Visa-style accept distinct from T&Cs. (C) receipt wording **unverified**. (D) enforcement is optional per incident. (E) no packet product. | Free $0; Plus $49; Premium $149 / location. In-person Free 2.6%+$0.15 (Square pricing page / Square salon page). | Square Community: cannot charge no-show when card locked/expired; “no-show protection… useless”; sellers “considered switching to deposits but it’s a hassle.” |
| **Fresha** | Payment policies: deposit **or** capture card; no-show/late-cancel % ; in-store deposits **cannot** attach no-show fees because “client must agree… at booking” (help 100638) — they already know the rule. Requires Fresha Payments. | (A) yes if Payments on. (B) accept-at-booking implied for online deposits. (C)(D)(E) unverified. Still ships **card-capture + later fee**. | Independent **$19.95**/mo; Team **$14.95**/bookable member; online 2.79%+$0.20; marketplace 20% min $6 (fresha.com/pricing, fetched). 2025 free→paid is real (Salon Business; `02`). | Prior: r/hairstylist switcher “Fresha doesn’t really allow” deposits *(snippet, 2025)*. Discord/FB revolt inaccessible. |
| **Vagaro** | Shopping Cart **required**. Deposits **or** capture-card auto-fee. “Keep their deposit” on no-show. **Vagaro Merchant Services only.** | (A) if you pay the add-on and use *deposits*, not capture-card. (B) listing-page policy. (C)(E) unverified. They tell you deposits beat fees. | Cart **$10/mo USD** / $15 CAD / free UK (support 22781768988187). Processing 2.6%+$0.10 or 2.29%+$0.19 + $10/mo above $4k *(snippet)*. Chargeback fee ~$25–$30 (Vagaro / Square AU compare). | Capterra compare *(prior snippet)*: extra fee “just to” do deposits. Direct Capterra fetch blocked this run. |
| **GlossGenius** | Service-level deposits at booking, “non-refundable” (GG blog). Card-on-file rules by client type; **discretionary** no-show charges. Vendor: deposits → **32%** more successful appointments *(vendor)*. | (A) yes. Discretionary fees fail (D). Chargeback protection **Gold/Platinum, Tap to Pay + GG card reader only** — **not** CNP deposits (GG payment-processing page). | Standard **$24**, Gold **$48**, Platinum **$148**/mo starts; flat **2.6%**. | G2/Capterra thin this run; prior file: price-hike cons. |
| **Booksy** | Deposits **or** cancellation fees (not both in the UK help framing). Mobile Payments required. Auto-charge cancellation fees end-of-day if marked no-show. Min deposit $5. Processing **2.69%+$0.30** on mobile/card-on-file. | (A) if deposits. (B) policy at booking. Still offers the card-on-file fee path. | **$29.99**/mo + **$20**/extra member; Boost 30% first visit, $10 min / $100 max (biz.booksy.com). | Boost-tax revolt is `02` P1, not deposits. |
| **Acuity / Squarespace** | Deposit $ or %, or save card (Stripe or Square sole processor; not PayPal). Later charge up to **150%** of appointment price (help, updated 10 Jul 2026). Manual, not auto-no-show. | (A) yes. Closest cheap Stripe-native. (B)(C)(E) unverified. The 150% later charge is a dispute magnet. | Starter **$20** / Standard **$34** / Premium **$61** monthly (UseCarly / Costbench 2026). Stripe on all plans. | Not beauty-specific review mining this run. |
| **Mangomint** | Require payment at booking: full or partial, per service. **Require acceptance of cancellation policy**; “keep records… to help resolve… chargebacks.” Cards-on-file still offered. No-show fee is a **manual** checkout of a Cancellation Fee service. | **Closest to (A)(B)(D).** (C) receipt label unverified. (E) records, not a one-click pack. Deposits need **Mangomint’s processor** (their payments page). | **$120**/location + **$10**/user from 1 Aug 2026; Phone $70/line; Marketing from $30 (Mangomint). HIPAA included. | Trade review (Salon Business 2026) is positive on Connect add-on; not deposit-angry. |
| **Boulevard** | % deposit at self-book → **account credit**; gift cards ineligible. Cancelled deposit **not** auto-refunded. Policy text on cancellation policy. Medspa add-on HIPAA. | (A) yes. Manual refunds = (D) risk. (B)(C)(E) unverified. | Third-party: salon ~**$158–$369**/loc, aesthetics from **$369**, 12-mo contract (Pabau 2026 — **not** Boulevard’s price page). Add-on **$65**. | Enterprise UX complaints in compare blogs; deposit-specific 1★ not retrieved. |

**Gap vs the $29–49 bolt-on.** Native **deposits exist** on Square Free, GlossGenius Standard, Booksy, Acuity, Fresha+Payments, Vagaro+$10, Mangomint, Boulevard. What they still don’t ship as a package: Visa-labeled receipts + separate accept + **immutable enforcement log** + one-click 13.1/13.7 evidence. That is a **feature**, and Square/Mangomint can add it without a new company. Whitespace is the **standalone booking URL** for people who will not enable the incumbent’s processor (Fresha-without-Payments, Cash App tattoo, booth renter whose salon owns Vagaro).

---

## 7. Buyer psychology and objections

**Deposits vs relationships.** Owners know deposits work (1shp89g: 3–4 incidents/month → ~1). They still under-price them ($25–$50) relative to color tickets, waive for “emergencies,” and treat chargebacks as weather. After a lost dispute they either (a) require signed contracts (1fkt6kh), (b) **stop charging** because the fee + lost dispute is worse (1f7jcn5), or (c) switch platforms. The WOUNDED question — “would you pay a third party without switching?” — is the one desk research cannot answer; the revealed substitute is **turn on the native deposit toggle** or **stop enforcing**.

**Proof this segment buys bolt-ons at all — yes, but adjacent.** Mangomint Phone **$70/mo**, Marketing from **$30**, Payroll $50+$8/worker (they already pay add-ons). Fresha AI Concierge **$99.95**/location, Loyalty **$59.95**, Data Connector **$295**. Boulevard Medspa **$65**. PatientFi / CareCredit on med-spa tickets. StyleSeat Premium **$35**/mo. That is proof they buy **revenue and comms** add-ons, not proof they will buy a *second processor* for a job Square Free already does. Booth renters buy their own Square/GlossGenius because the salon’s stack doesn’t pay them; they are the only persona whose “I refuse to switch” is sometimes “I refuse to use the *front desk’s* Vagaro.”

**What they do after losing.** r/hairstylist 1fkt6kh (color chargeback lost despite texts): comments default to “CC companies almost ALWAYS side with the customer” and “get a signed contract.” That fatalism is the opposite of a software budget. Kevonia’s 2026 chargeback post is the rare vendor that says the quiet part: **the issuer decides; your booking app does not.** A packet product has to overcome learned helplessness, not a missing button.

---

## 8. Segment prioritization

Rank by ticket × dispute pain × **actual stack control** (can they change the booking URL?).

1. **Tattoo (independent chairs) — first.** Deposit-native, so the *education* half of the wedge is weaker, but **collection is sloppy** (Venmo/Cash App/off-Booksy), tickets are $300–$800+, and the artist owns the link. Compliant Stripe deposit + signed policy + evidence pack is a **behavior upgrade**, not a new idea. Chargeback on a $200 deposit is worth fighting. Shop-owned studios that already run TattooGenda are worse buyers.
2. **Med-spas — second, only if they are not on Boulevard/Mangomint.** Tickets justify $49/mo. HIPAA/BAA is a build tax. Results/package disputes will dominate the evidence pack, not no-shows. Skip anyone on Boulevard’s aesthetics SKU.
3. **Booth-renter colorists on Square Free who still use ‘ask for a card’ instead of deposits.** High-ticket hair, they control the link, Square deposits are already free — so the product is **compliance UX + packet**, or they just need the explainer. Weakest paid conversion if they notice Square’s toggle.
4. **Salon owners on Vagaro without Shopping Cart.** Real gate ($10). They will buy Vagaro’s $10, not your $39, unless you are replacing Vagaro entirely.
5. **PT/fitness — last.** Mindbody already automates no-show/late-cancel fees (flat or %). Same Visa problem, worse incumbent lock, lower ticket than med-spa/tattoo.

Tattoo does **not** kill the wedge; it changes the pitch from “start taking deposits” to “stop taking deposits in a way Visa will unwind.”

---

## 9. Channel map, sharpened

- **r/hairstylist, r/barbers, r/Esthetics, r/medspa, r/tattoo:** deposit/chargeback threads are native (1shp89g, 1f7jcn5, 1fkt6kh; GrowBien’s six-thread June 2026 pass). Subscriber counts **not retrieved** this run. `09` rule stands: no fresh-account pitching.
- **Behind the Chair:** LinkedIn company page — **2.6M** IG, 1.7M FB, 1M monthly site visits *(self-reported)*. Zaver Jul 2026: @behindthechair_com **2,638,334**. Cosmoprof bio: “10 million members / 90 countries” *(self-reported)*. Content is education/color, not ops; a Visa explainer is off-format unless a BTC Team educator carries it.
- **Modern Salon:** circulation **not found**.
- **AmSpa:** owner Boot Camps (Anaheim 2026, from $895 member); LinkedIn: 20–30 staff, $1–10M revenue band *(third-party)*. Best **med-spa** channel; legal/compliance frame fits. No AmSpa Visa-no-show post found.
- **Educators:** Chris Bossio / Tomb45 — barber entrepreneur, Headlines (10 FL shops); IG ~**118.6k** (Socialveins, date unclear). Mary Rector (BTC founder) is reach, not a business-systems seller. Business-content stylist educators beyond that: **names+reach not verified** this run (search quality was weak).
- **Viral hook.** No precedent found of a “your no-show fee is illegal under Visa” post going viral in this niche. GrowBien’s Aug 2026 essay is the closest artifact and is a **med-spa marketing blog**, not a viral thread. Adjacent virality is Fresha-pricing rage (2025), which *did* move stacks. The Visa hook is legally correct and emotionally spicy; whether it converts to $39/mo is the Lane C call script, not a desk fact.

---

## 10. What to do (synthesis)

**ICP one-liner.** Independent tattooers and booth-renter colorists who **own their booking URL**, already believe in deposits, and currently collect via Venmo, Cash App, or a stored-card no-show fee.

**Technical model — recommend standalone booking-link replacement (Stripe on the shop’s account), not a Fresha/Square/Vagaro overlay.** Rationale: those three lock deposits to their acquiring; Square’s own API cannot apply an external deposit to a booking (open request, Jun 2026); split-processor UX is a support pit. Incumbent-API integrations are a partnership motion a solo cannot force. A Calendly/Acuity “compliance skin” is possible but those buyers already have Stripe deposits. Kevonia occupies the $50 standalone slot — differentiate on **Visa-labeled receipts + enforcement log + one-click dispute packet**, not on “booking.”

**v1 (5–8).** (1) Hosted book+pay link with **separate** cancel-policy accept (timestamp, IP). (2) Stripe PaymentIntent labeled **Deposit** on receipt + cancel-by datetime. (3) Auto-apply to balance / generate a “amount already paid” card staff can read. (4) Refund vs forfeit by clock, **no silent staff waiver** without a logged exception reason (13.7). (5) Reminder that restates the deadline. (6) Enforcement log (who accepted what, who was charged/refunded, exceptions). (7) Dispute packet PDF: consent, receipt, calendar willingness, comms. (8) Optional: 3DS on the deposit (CNP).

**Out of scope.** Square/Fresha/Vagaro injectors; card-on-file no-show fees (do not productize the illegal pattern); HIPAA charting; marketplace; waitlist; POS hardware; VAMP dashboards.

**Positioning.** “The deposit that survives a chargeback.” Not “no-show software.” Never claim Visa *guarantees* a win.

**Price.** **$39/mo** or **2.9%+$0.30** on deposits via the shop’s Stripe (you don’t take a second processing cut). Founding: first month $0 as in `09`. Do not price against Vagaro’s $10 cart — you lose. Price against one recovered $150 tattoo deposit.

**GTM.** Publish the rule explainer (already in `09`) with screenshots of §5.8.8.2 and the Deposit receipt requirement; CTA is a **compliance checker** (“does your Square receipt say Deposit?”), then a booking-link swap for people who fail. Tattoo Instagram + r/tattoo first; AmSpa second for med-spa. Do not lead with VAMP. Sequence: (1) free checker + PDF of the two Visa tables; (2) 15 owner calls using the `09` script, logging the Square-toggle objection verbatim; (3) if ≥5 will pay, onboard tattoo chairs whose current flow is Cash App; (4) collect the first won-dispute PDF as the only ad creative that matters.

**Updated risks + kill.**
- **Incumbents fix UX — likelihood High (Square/Mangomint), Medium (Fresha/Vagaro).** Square Free already has deposits; adding labeled receipts + accept-log is a settings page. If Square ships (B)+(C)+(E) on Free, kill the Square-renter SKU.
- **Bolt-on is a fantasy on the three big beauty processors — likelihood already realized.** Kill any roadmap that assumes “we charge Stripe, they keep Fresha.”
- **Kevonia / Acuity / GlossGenius as alternatives — Medium.** If 10/15 Lane C calls say “I’d just turn on Square deposits,” that *is* the `09` kill (≥10 of 15).
- **Compliant UX ≠ won dispute (auditor F1).** Still true; packet quality is testable only in live representments.

**Five discovery questions desk research cannot answer.**
1. After I show you Square’s free deposit toggle next to a Visa-labeled receipt, do you still pay $39 — and if yes, *what* is missing that you’d pay for?
2. Last no-show you tried to collect: deposit, card-on-file fee, Venmo, or you ate it? Who won, on which network?
3. Who owns the booking URL — you, the salon, or the marketplace — and would you send clients to a new link this week?
4. Have you ever paid for a non-booking add-on (SMS, payroll, PatientFi, Shopping Cart)? What dollar amount felt “obvious”?
5. If Fresha/Square shipped “Deposit” on the receipt plus a PDF of the checkbox tomorrow, would you switch away from a third party you had already installed?

---

## Sources that failed / open questions

- Core Rules **Table 11-91** (13.1 invalid disputes) body did not extract from the public PDF; GrowBien’s quotation is secondary.
- Capterra/G2/Trustpilot **direct fetch blocked**; review themes from Square Community + prior-file Capterra snippet + vendor compare pages.
- Reddit subscriber counts and most comment bodies are **snippets**.
- Beauty-MCC chargeback rates / win rates: **not found**.
- Modern Salon circulation, AmSpa member count, named stylist-business educators beyond Bossio/Rector: **thin**.
- Viral Visa-explainer precedent: **none found**.
- Whether Square’s deposit receipt prints the word “Deposit”: **unverified** (help text describes policy display, not descriptor).
- Fresha/Vagaro/GlossGenius receipt descriptors: **unverified**.
- IHRSA / ClassPass 20–30% class no-show: cited by aggregators, **not pulled from IHRSA**.
- Boulevard official price page: not fetched; used Pabau/GoodCall third parties.
- Square HIPAA BAA vs Appointments reality: **conflicting secondary**; read the live BAA before selling med-spa.
- Kevonia win-rate / customer count: **unverified** (exists as a priced SKU).
- Dual-MID VAMP/acquirer treatment of a deposit-only Stripe account: **unverified**.
- Whether Fresha Independent $19.95 still hides deposits behind Payments-only (help says yes; Reddit 2025 said “doesn’t really allow” — **may be stale** post-pricing-change).
- Square Appointments “automatic contracts” on paid plans: whether those contracts satisfy §5.8.11.1 separate-display: **unverified**.
- Mastercard 4853 outside lodging (services cancelled / not as described) as the *actual* code beauty merchants see: **not sampled from live cases**.
