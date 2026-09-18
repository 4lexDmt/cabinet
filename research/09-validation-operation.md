# Validation Operation — Running Paid-Demand Tests on the Surviving Lanes

- **Created:** 2026-09-18. Purpose: convert desk conviction into paid-demand evidence for the three surviving lanes (plus one optional pre-sell probe), with the AI agent running everything delegable and the founder doing only what structurally requires a human identity.
- **Scope lock (board is final):** the three stress-test risers were competition-scanned on 2026-09-18 and all three closed — staffing back-office (BOSS/Signature/myBasePay bundle software + payroll *funding* + EOR; a solo can't match capital-backed bundles; TempWorks/Avionté own the software tier at $15–70k/yr), de-minimis customs (spend flows to brokers/carriers/3PLs; the durable seller response is bulk consolidation, which deletes the per-parcel problem; Zonos/Passport cover DDP), and I-9 audit defense (i9 Intelligence $50/mo flat with E-Verify, WorkBright ~$79/mo, FreshVerdict already selling flat-price self-audits + $29/mo reverification monitoring). No further desk candidates remain.

## The lanes under test

| Lane | Problem | Test question | Go threshold (15 conversations) | Kill threshold |
|---|---|---|---|---|
| A | Tax-season document chaser (`accounting-P1`) | Confirm workflow details and price; demand already FLY-rated | ≥5 yes at $299/season AND ≥2 prepaid | <2 yes, or zero prepay after 15 |
| B | Job-shop quoting (`manufacturing-industrial-P1`) | What event makes a shop buy THIS month? | ≥5 yes at $99–149/mo AND ≥2 named a concrete trigger AND ≥1 prepaid | no identifiable trigger in 15 talks |
| C | Visa-clean deposits (`personal-services-P2`) | Will owners pay a third party without switching booking stacks? | ≥5 yes at $29–49/mo AND ≥2 prepaid | owners default to incumbent features in ≥10 of 15 |
| D (optional probe) | ESA invoicing (`education-P1`, DIE-as-scoped) | Pre-sell only | ≥3 of 10 microschools pay a deposit | anything less — stays dead |

Run A, B, C in parallel only because the agent absorbs the overhead; if founder time is the constraint, run them sequentially in the order A → C → B (A has a hard Nov–Jan buying season; C's question is cheapest to answer; B has no calendar pressure).

## Division of labor

**Agent-owned (delegable, already in motion):** target-list building from public directories and forum threads; all outreach copy, per-prospect personalization, and reply ghost-writing; interview scripts and per-call prep sheets; transcript/notes analysis after each conversation; the scoreboard ([09-validation/tracker.csv](09-validation/tracker.csv)) and weekly go/kill scoring; offer one-pagers and landing-page copy (and deployment, once accounts exist); iteration of all of the above based on incoming data.

**Founder-owned (not delegable, ~30–45 min/day):**
1. **Sending.** Posts, comments, and DMs go from your accounts. Fresh accounts pushing a product get banned in r/taxpros, Practical Machinist, and stylist groups — and the communities' trust in *you* is part of what's being tested. You copy-paste and adapt what I draft.
2. **Talking.** The 15 conversations per lane are yours. Record or take notes; I turn every transcript into scoring, objections, and next actions. An AI cannot take these calls for you — the signal lives in hesitations, and undisclosed AI representation would poison the well anyway.
3. **Taking money.** Deposits/prepays need your Stripe (or PayPal) and your name on the offer.
4. **Judgment at the weekly gate.** I compute the thresholds; you decide edge cases.

## How "the agent in charge" works mechanically

- **This agent thread is the operations console.** Each day, paste in whatever came back (replies, call notes, transcripts, screenshots). I return: updated tracker, drafted responses for each open thread, tomorrow's send list, and any threshold changes. Ten minutes of your time per cycle.
- **The repo is the system of record.** Tracker, kits, and weekly gate reviews live under `research/09-validation/`; every update is committed so nothing is lost between sessions.
- **Weekly gate:** every 7 days I produce a one-page scorecard per lane (conversations, yes-rate, prepays, top 3 objections, verdict vs threshold) and a recommendation: continue / pivot the offer / kill.
- **Optional unlocks** (add via Cursor Dashboard → Cloud Agents → Secrets, only if/when wanted): `STRIPE_API_KEY` → I create and manage payment links and check who actually paid; a Vercel token → I build and deploy the offer/landing pages myself and wire analytics; an email-service key (e.g. Resend) + a domain → waitlist autoresponders and follow-up sequences sent programmatically. None are required to start — copy-paste mode works from day one.

## Founder setup checklist (do once, ~1 hour)

1. Confirm which lanes run (A+B+C parallel, or sequential — say which).
2. Reddit account with some age/karma for r/taxpros and r/machinists participation (if yours is fresh, spend the first days commenting helpfully — I'll suggest threads).
3. Practical Machinist account (Lane B) and whichever stylist community you can access (Lane C — r/Hairstylist works; Facebook groups are a bonus only you can reach).
4. A Stripe account with two payment links: $299 "Season Pilot — Founding Firm" (Lane A) and a $49 first-month link (Lane C). Or add the API key as a secret and I generate links as needed.
5. A calendar-booking link (Cal.com free tier) for conversation scheduling.
6. Tell me your background in one paragraph (what you've built/done, any domain credibility) — I tailor every outreach draft to what you can honestly claim.

## Kit — Lane A: tax document chaser

**Where prospects are:** r/taxpros threads complaining about document chasing (I maintain a live list — the four in the evidence pack are the seed), TaxProTalk, #TaxTwitter, NATP/NAEA chapter directories, bookkeeper communities for off-season.

**Community rules note:** r/taxpros prohibits solicitation. The compliant play: comment substantively on workflow threads from your own experience; DM only people who engaged with you or who publicly described the exact pain; disclose you're building.

**Outreach draft (DM, after genuine thread interaction):**
> Saw your comment about chasing clients for 1099s — I'm building a tool for exactly that (SMS-first chaser that blocks the return from the prep queue until the file's complete; reads last year's return so it asks for one PDF per account, not exploded line items). Before I build more, I'm trying to learn from 15 small firms how this actually plays out in-season. 20 minutes, and if it's useless to you, you've lost nothing and I'll share what other firms told me. Worth a chat?

**Interview script (past-behavior only, never hypotheticals):**
1. Walk me through the last client whose file sat incomplete — what was missing, who noticed, who chased, how many touches?
2. What does the chase run on today — portal, email, spreadsheet, an admin? What does that cost you (hours or dollars)?
3. What have you already bought or tried for this (TaxDome? SafeSend? Financial Cents?) — and what made you stop or stay?
4. How do you decide a file is "complete enough to prep"? Who enforces that?
5. When in the year do you decide on season tooling, and what did you spend last year?
6. If your clients had to reply to a text instead of an email, what breaks? (7216 consent — listen for it)
7. What would make you rip this out mid-season?
8. Close: "I'm taking five founding firms at $299 for the season, setup done for you, cancel by Jan 31 for a full refund. Want one of the five?" — then silence. Log the exact response.

**Offer:** Founding-firm pilot — $299/season, white-glove setup from last year's client list, SMS chase live before Jan 15, full refund through Jan 31. Cap at 5; scarcity is real (support capacity), say so honestly.

**Calendar reality:** firms decide tooling Nov–Jan. Conversations start now; a go decision by late October leaves time to onboard pilots in December.

## Kit — Lane B: job-shop quoting

**Where prospects are:** Practical Machinist quoting/estimating threads (the three in the evidence are seeds), r/machinists, r/manufacturing, LinkedIn owner-operators of 5–50-person CNC shops (public posts), local NTMA chapters.

**Outreach draft (forum reply first, then DM):**
> We keep seeing the same thing in this thread — quoting lives in Excel because the software options are either $18k/yr or built for laser shops. I'm building the in-between for milling/turning shops: PDF drawing in, checklist out (dims/tolerances/material extracted for the estimator to confirm), priced quote + traveler in ~20 minutes, ~$100/mo, no setup fee. Talking to 15 owner-estimators before I go further — 20 minutes, blunt feedback wanted. Anyone game? (DMs open.)

**Interview script — the trigger hunt is the whole point:**
1. Last RFQ that sat more than two days — why, and what did it cost you (won/lost)?
2. Who quotes today, and what else is that person responsible for?
3. What's your quote volume per week, and hit rate? Which quotes do you *not* bid because of time?
4. Have you priced Paperless Parts / tried Tempus / demoed anything? What stopped you?
5. **When would you actually buy something like this — what has to happen first?** (new customer RFQ wave? estimator retiring? reshoring inquiry?) — push for the specific event.
6. What would make you distrust an AI-extracted checklist, and what would earn trust?
7. Close: "$99/mo, I set up your rate table with you, cancel anytime. If I open ten pilot slots for [their process], do you want one?" Log exact words.

**Go nuance:** Lane B's threshold requires ≥2 interviewees to name a concrete purchase trigger. If pain is confirmed but every buyer says "someday," that confirms the auditors' verdict — park it and take the learning.

## Kit — Lane C: Visa-clean deposits

**Where prospects are:** r/Hairstylist and r/barbers chargeback/no-show threads (the Fresha-pricing thread in the evidence is a seed), med-spa owner groups, tattoo-artist communities, stylist educators (affiliates later).

**Content hook (post, not pitch — this is the viral asset):**
> PSA: if you charge a no-show fee to a card on file, Visa's own rules say you'll lose the chargeback — salons aren't on the list of businesses allowed to process no-show fees (that's only hotels and rentals). What survives disputes is a properly structured *advance deposit* with its own accept step and "Deposit" on the receipt. Wrote up the rule with sources: [link]. Building a small tool that does compliant deposits on top of whatever booking system you already use — DM if the chargeback thing has bitten you.

**Interview script:**
1. Tell me about the last no-show you tried to charge — what happened, dispute or not, who won?
2. What's your current deposit setup, and what do you hate about it? (Listen for: gated features, platform switching refusal)
3. Have you considered switching to GlossGenius/Square for their deposit features? What stopped you? ← this is the WOUNDED question; log verbatim
4. How many no-shows a week, at what average ticket?
5. Close: "$29/mo bolt-on: compliant deposit flow on your existing booking link, plus an evidence pack if a dispute happens. First month free for the first ten shops. In?"

**Kill nuance:** if ≥10 of 15 say "I'd just use my booking app's feature," the auditors were right — kill, and publish the Visa explainer anyway (it becomes an asset for whatever you do in this space).

## Kit — Lane D (optional): ESA pre-sell probe

Ten DMs to microschools from the TX/AZ state provider directories, offer: "$99 founding deposit, refundable any time before launch — I build the [state] invoice-packet generator and you're first on." Revive the lane only on ≥3 paid deposits. No conversations required; this is purely a payment test of the stress test's F1 verdict.

## Scoreboard

Live at [09-validation/tracker.csv](09-validation/tracker.csv). Columns: date, lane, prospect, channel, status (contacted → replied → call_booked → call_done → offer_made → committed → **paid** → dead), price_quoted, pain_confirmed, current_spend, objection, next_action, notes. I update it from whatever you paste; the weekly gate reads from it. Statuses only move forward on evidence — "sounded excited" is not a status.
