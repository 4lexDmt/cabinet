# Independent Pay-Conversion Stress Test — Protocol

- **Purpose:** re-rank all 145 evidenced problems by a single question — *how likely is the affected customer to actually PAY for a solution?* — independently of the original research's scores, clusters, and picks.
- **Independence mechanics:** (1) auditors receive blinded problem cards with the original preliminary scores, solo-builder angles, and cluster labels stripped; (2) auditors are forbidden from opening any other file in `research/`; (3) a different rubric is used, aimed only at payment conversion, not opportunity quality; (4) three auditors score in parallel; 25 cards overlap across all three so inter-rater agreement is measurable; (5) aggregation is a deterministic script, not judgment.
- **What this test is NOT:** it does not measure competition/whitespace (that was validated separately in `06`). A problem can score PAY-high and still be a bad business because the market is crowded. The final verdict layer combines both.

## The PAY rubric (score every card on all seven, 0–4 integers)

**S1 — Revealed spend (weight 3).** Is money already flowing to solve this exact problem?
- 4: multiple independent evidence items of real money paid for this job (service fees, agency retainers, VA hires, tool subscriptions, per-filing fees) — at least one non-vendor source
- 3: one solid non-vendor spend proof, or several consistent vendor-reported price points
- 2: documented hours lost but little direct money; spend evidence is thin
- 1: complaints only; no spend evidence
- 0: the only dollar figures are vendor/content-marketing claims

**S2 — Budget authority and purchase friction (weight 2).** Who signs off?
- 4: owner-operator with a company card, can buy same-day (solo firm owner, shop owner, host)
- 3: small-firm owner but seasonal/cash-tight timing matters
- 2: manager who needs an owner's nod
- 1: multi-stakeholder (finance + ops + owner)
- 0: committee, board, procurement, or a consumer's discretionary wallet

**S3 — Forcing function (weight 2).** What makes them buy NOW?
- 4: dated deadline, penalty, license/listing loss, or revenue-blocking event with a date
- 3: recurring event that periodically blocks money (every filing season, every renewal)
- 2: recurring operational pain without penalty
- 1: chronic annoyance; "someday" problem
- 0: no trigger at all

**S4 — Cost of doing nothing (weight 2).**
- 4: doing nothing provably loses money monthly (leaked commissions, lost chairs, denied claims, fines)
- 3: doing nothing loses meaningful time monthly that the buyer already prices (billable hours, estimator time)
- 2: painful but absorbed; business survives fine
- 1: mostly emotional cost
- 0: doing nothing is basically fine; a spreadsheet is genuinely good enough

**S5 — Software-solvability (weight 2).** Can a product actually move the outcome?
- 4: the core pain is information/workflow a tool can own end-to-end
- 3: a tool removes most of the labor, humans still touch edges
- 2: a tool helps, but an institution/platform/other human still gates the outcome
- 1: software is a bandage on a structural problem
- 0: structural (labor shortage, macro prices, market collapse) — software cannot move the KPI

**S6 — Free-alternative pressure (weight 2).** VERIFY for high scores (see web-check rule).
- 4: no free or bundled good-enough alternative exists (verified by search)
- 3: free alternatives exist but are clearly inadequate (documented complaints about them)
- 2: a determined buyer can get 70% there with spreadsheets/templates/free tiers
- 1: platform or government provides a serviceable free path
- 0: free good-enough alternative verified

**S7 — Buyer payment culture (weight 1).** Track record of the segment buying SMB software.
- 4: segment demonstrably buys $50–300/mo tools (MSPs, insurance agencies, law/tax/accounting firms, e-commerce sellers, staffing agencies, property managers)
- 3: buys when ROI is legible (contractors, restaurants, salons, fleets, manufacturers, med practices)
- 2: frugal or budget-line constrained (farmers, nonprofits, schools, solo creatives)
- 1: rarely pays for tools (teachers out-of-pocket, hobbyists, gig workers)
- 0: notorious non-payers for this problem class (consumers with episodic life-admin problems)

**PAY score** = (3·S1 + 2·(S2+S3+S4+S5+S6) + 1·S7) / 56 × 100.

## Hard-fail flags (assign any that apply; they cap the tier regardless of score)

- **F1 evidence-hollow:** every dollar figure in the card traces to vendor/content-marketing sources or "(snippet)" quotes with no primary anchor
- **F2 platform-hostage:** the paying customer's problem can only be fixed with cooperation from a platform that benefits from the problem
- **F3 committee-sale:** the median buyer needs 3+ stakeholders to say yes
- **F4 free-good-enough:** a free/bundled alternative verified to genuinely solve it
- **F5 structural:** software cannot move the underlying KPI
- **F6 consumer-episodic:** one-time life event, no repeat purchase, consumer CAC

## Tiers

- **TIER-PAY** (most likely to convert): consensus PAY ≥ 70 and zero hard-fail flags from ≥2 auditors
- **TIER-MAYBE:** PAY 55–69, or PAY ≥ 70 with exactly one flagged auditor
- **TIER-UNLIKELY** (least likely to pay): PAY < 55, or ≥2 auditors agreeing on any hard-fail flag

## Web-check rule (bounded effort, aimed at the top)

Budget 15–25 searches per auditor. Mandatory: before finalizing any card in your provisional top 16, run at least one search to test S6 (does a free/cheap good-enough alternative exist?) and record what you found. Also search when a hard-fail flag hinges on a fact you haven't verified. Do not fabricate URLs; only cite what your searches actually returned.

## Auditor output contract

Write valid JSON (validate with `python3 -m json.tool` before finishing) to your assigned output path: an array with one object per card, ids copied exactly:

```json
[{"id": "accounting-P1", "s1": 4, "s2": 4, "s3": 3, "s4": 3, "s5": 3, "s6": 2, "s7": 4,
  "flags": [], "note": "why they will or won't pay, max 25 words",
  "checks": [{"q": "search used", "url": "what was found", "found": "1-line finding"}]}]
```

## Verdict layer (applied after aggregation, by the coordinator)

For the five previously picked problems: **FLY** = consensus PAY ≥ 70, no consensus hard-fail, and top-quartile placement by at least 2 of 3 auditors; **WOUNDED** = PAY 55–69 or material auditor disagreement (pairwise PAY spread > 20); **DIE** = PAY < 55 or consensus hard-fail. Competition facts from `06` are then reapplied — a FLY on demand can still be downgraded as an opportunity if its market was found crowded, and vice versa a TIER-PAY non-pick with open whitespace gets called out as a resurrection candidate.
