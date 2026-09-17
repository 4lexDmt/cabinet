# Methodology — Cross-Industry Problem Research

- **Generated:** 2026-09-17
- **Researcher:** AI agent (Cursor cloud agent) using live web search and fetches. No URL in this research comes from model memory — every citation was returned by a search or fetch during the run.
- **Purpose:** Identify problems that businesses and consumers face across ~18 industries — current and emerging — and converge on startup opportunities that a **solo builder** can build and sell with high conviction.

## Pipeline

1. **Scaffold** — this methodology, the source map ([01-source-map.md](01-source-map.md)), and a fixed per-industry template ([02-industries/_template.md](02-industries/_template.md)) so every vertical is mined the same way.
2. **Parallel mining** — 18 industry findings files produced by research agents following the identical 7-step protocol below, plus a cross-cutting emerging-trends scan (03) and a consumer life-admin scan (04).
3. **Problem database** — all findings deduped, clustered, and scored with the rubric below (05).
4. **Shortlist validation** — top 12-15 candidates re-checked for competition, pricing landscape, channel size, and solo feasibility (06).
5. **Top picks** — 3-5 high-conviction briefs with full evidence packs (07).

## Evidence standards (what qualifies as a "finding")

1. Each problem entry requires **at least 3 independent sources spanning at least 2 channel types** (e.g. forum complaint + 1-star reviews + pricing/spend proof), each with URL, verbatim quote, and date.
2. **Recency rule:** prefer sources from mid-2025 onward; older only for structural, still-unresolved problems.
3. **Revealed pain beats stated pain:** money or hours already spent on workarounds (virtual assistants, agencies, spreadsheets, hated incumbents) outranks one-off complaints.
4. **Recurrence rule:** the same complaint must appear in at least 2 distinct venues to enter the database — this filters loud-minority noise.
5. Every regulatory/trend catalyst claim is verified against a **2026-current primary source** before it enters the database.
6. Quotes taken from search-result snippets (rather than a fully fetched page) are marked **"(snippet)"**.

## The 7-step per-industry protocol

Every industry file in `02-industries/` follows the same steps:

1. **Baseline** — 2-3 "2026 challenges/outlook" pieces from trade publications and consultancies for the vertical.
2. **Community mining** — at least 6 query-phrase-library searches across the vertical's subreddits/forums; extract recurring complaints with quotes and links.
3. **Review-gap mining** — 1-3 star review themes for the vertical's 3-5 incumbent tools; recurring missing features and pricing anger.
4. **Workaround census** — spreadsheet-template demand, VA-hiring patterns, recurring Upwork/Fiverr gigs in the vertical.
5. **Catalysts** — regulation/technology/demographic changes specific to the vertical, verified against 2026 sources.
6. **Consumer flip-side** — what this industry's own customers complain about (BBB/Trustpilot/CFPB and consumer subreddits).
7. **Output** — top 5-10 problems, each with a full evidence pack and preliminary scores per the rubric.

## Scoring rubric — solo-builder fit (0-5 each, weighted; max weighted score 45)

| Dimension | Weight | 5 looks like |
|---|---|---|
| Pain severity × frequency | 2.0 | Daily/weekly workflow, hacked workarounds, emotional language |
| Willingness to pay | 2.0 | Documented existing spend on labor, agencies, or legacy tools |
| Buyer reachability by one person | 1.5 | Named watering holes (subreddit, association, trade pub); no sales team needed |
| Solo buildability | 1.5 | Shippable and supportable by one person; open APIs; manageable compliance surface |
| Competitive whitespace | 1.0 | Incumbents old, hated, or enterprise-only; not saturated with recent launches |
| Why-now tailwind | 1.0 | A named, dated catalyst |

**Automatic disqualifiers (kill criteria):**

- Two-sided marketplace cold-start
- Enterprise sales cycle or closed gatekeeper APIs (e.g. Epic, dealership DMS) required for the wedge
- 24/7 or life-safety support burden
- Single hostile-platform dependence (one API owner who has burned developers before)
- Regulated data custody a solo founder cannot carry (e.g. full PHI custodianship) unless the wedge avoids it

**"High conviction" is earned, not asserted:** at least 3 independent evidence types, recency within 18 months, a named reachable channel, and a plausible first-10-customers path.

## Access constraints and honesty notes

Probed on 2026-09-17 from this environment:

- **Works for direct fetch:** Hacker News Algolia API (`hn.algolia.com/api/v1/search`), most trade publications, consultancy reports, government data.
- **Blocks or times out on direct fetch:** G2, Trustpilot, reddit.com/old.reddit.com. Mitigation: search-snippet mining with `site:` operators is the backbone (e.g. `site:reddit.com/r/msp "is there a tool"`, `site:g2.com servicetitan "dislike"`); direct fetch retried at most once.
- **Login-walled (best-effort only):** LinkedIn (public posts via `site:linkedin.com/posts` queries), X/Twitter (snippets only). **Not accessible at all:** Discord, Slack, private Facebook Groups — compensated via Reddit and niche forums, but pain that lives only in those channels is invisible to this research.
- **Bias notes:** English-language and US-centric skew; Reddit over-represents tech-comfortable practitioners; complaint mining over-represents the angry and under-represents the satisfied-but-underserved.
- **Verification depth:** a sample of citations per file was spot-checked by the coordinating agent; the rest are as-returned by live search. Before committing money to any idea here, re-verify its load-bearing evidence by hand — links rot, snippets truncate, and individual forum posts can be unrepresentative.

## How to read the findings

Reading order for a decision-maker:

1. [07-top-picks.md](07-top-picks.md) — the 3-5 briefs worth acting on, with full evidence packs.
2. [06-shortlist-validation.md](06-shortlist-validation.md) — the 12-15 finalists and why some were cut.
3. [05-problem-database.md](05-problem-database.md) — the full scored field (~80-150 problems), for second opinions and future mining.
4. `02-industries/*.md`, [03-emerging-trends.md](03-emerging-trends.md), [04-consumer-cross-cutting.md](04-consumer-cross-cutting.md) — raw depth per vertical.
5. [01-source-map.md](01-source-map.md) — reusable venue inventory for repeating or extending this research later.
