# Lane A — Stack Position, Data Flows, and Legal Obligations (US + Canada)

- **Date:** 2026-09-18. Answers four architecture-deciding questions: does it sit on top of existing software; does it replace anything; what laws govern it in the US and Canada; and how exactly data moves from the firm's existing software to client communication.
- **Honesty note:** US obligations below are grounded in the primary-source work from the [Lane A dossier](../10-deep-dives/lane-a-tax-doc-chase.md) §7. The Canada section is a first-pass legal map from general knowledge — directionally reliable, but **every Canada item is a counsel-verify item**; no Canadian claim here has been through the same primary-source verification pass as the US ones.

## 1. Position in the stack: beside, not instead

The product is a **workflow-gap bolt-on**. A small firm's stack is: tax engine (Drake/Lacerte/ProConnect/UltraTax) where returns are prepared → document storage (SmartVault, a file server, or a suite's portal) where records live → maybe a practice suite (TaxDome/Financial Cents) → email. The chase — getting documents *into* that stack — is the gap none of them owns behaviorally. We occupy exactly that gap, upstream of prep:

- **Complements the tax engine:** untouched; it stays the system of record for returns. We import its client-list exports and hand back completeness states; we never write into it.
- **Complements the DMS/portal:** it stays the archive. We are a conveyor with season-end auto-purge — we *depend* on their archive existing, which makes us additive rather than threatening.
- **Coexists with suites:** if the firm owns TaxDome/FC, we don't integrate or compete at v1 — we do the one job their email-bound reminders demonstrably don't (change client behavior). The discovery script's FC-Solo probe tests exactly this coexistence pitch.
- **Client side:** nothing to install, no account — we complement the client's phone.

## 2. What gets replaced

**Replaced:** the Excel missing-items tracker; the admin's manual nagging labor (the seasonal half-FTE); unused reminder features inside tools they already own; low-end point tools (a ClientBrief-type checklist) if present. **Not replaced:** tax software, the document archive, e-sign, billing, the suite, or any client-facing portal. **Possibly displaced later (v2, books variant):** ad-hoc monthly statement-chasing via a portal, for bookkeeping clients. The sales sentence: "keep everything you have; fire the spreadsheet and the 9pm nagging."

## 3. Legal obligations — United States (verified in dossier §7)

1. **IRC §7216 / §6713** (use and disclosure of tax return information by preparers; criminal + civil exposure). Design target: the Treas. Reg. §301.7216-2 **auxiliary-services** path — US-based vendor performing non-substantive services, contractor notices delivered, SSNs never leaving the US (our design: never stored at all). **Pre-build gate: counsel sign-off.** If counsel requires standalone per-client signed consent, that's the kill criterion.
2. **TCPA** (texting): prior express consent captured at the engagement letter; STOP honored (opt-outs processed within 10 business days); quiet hours (8am–9pm recipient-local); statutory damages $500–1,500 *per message* make this a zero-tolerance rail. **State mini-TCPAs** (Florida FTSA, Oklahoma, Washington and others) are stricter overlays — consent language and send windows must satisfy the strictest state in the firm's client base.
3. **A2P 10DLC** (carrier requirement, not statute, but functionally mandatory): brand/campaign registration, sender identity, volume tiers — we do this for the firm as a product feature.
4. **FTC Safeguards Rule (GLBA)** — tax preparers are "financial institutions" required to maintain a WISP (per IRS Pub 4557); as their service provider we must contractually meet the safeguards they're obligated to impose: encryption in transit/at rest, access controls, incident notification. Product answer: the WISP vendor one-pager plus real posture (US hosting, SSN redaction, season-end purge, no AI training on client data).
5. **State breach-notification laws** (all 50 states): incident-response plan and notification flow required from day one.
6. **ESIGN/UETA:** consent and acknowledgment records (EL consent capture, policy acceptances) kept as valid electronic records — our append-only event log serves this.
7. Not legally required but commercially inevitable: SOC 2 posture questions from larger firms — deferred; the WISP pack and architecture answers carry the pilot.

## 4. Legal obligations — Canada (first-pass map; ALL items counsel-verify)

Canada is a real expansion market (same chase pain in T1 season) but a different compliance geometry. Recommendation below is US-first; here is what Canada adds:

1. **CASL** (anti-spam): stricter than TCPA. Commercial electronic messages require express consent with prescribed sender identification and a functioning unsubscribe in *every* message; penalties up to CA$10M for organizations. Nuance to verify with counsel: document-chase texts for an engaged client are arguably transactional (facilitating an agreed transaction) rather than marketing CEMs, and an "existing business relationship" creates implied-consent windows — but the safe design (which we already have) is capturing CASL-grade express consent in the engagement letter and carrying identification + unsubscribe regardless.
2. **PIPEDA** (federal private-sector privacy): consent, safeguards, openness, and **mandatory breach reporting** to the OPC and affected individuals where there's "real risk of significant harm," with record-keeping of all breaches. Provincial substitutes: Alberta PIPA, BC PIPA.
3. **Quebec Law 25** (the strictest): designated privacy officer, privacy impact assessments **including for cross-border transfers** — hosting Quebec clients' data in the US requires a documented PIA; plus French-language requirements for Quebec consumer-facing communications (the client page and texts would need French for QC clients — verify scope under Bill 96).
4. **Data residency:** not federally mandated for the private sector, but Canadian accounting firms strongly prefer Canadian hosting; practical requirement for a Canadian launch is a Canadian hosting region.
5. **Tax-specific:** no direct §7216 analog for preparers; confidentiality flows from PIPEDA plus provincial CPA codes of conduct; CRA EFILE program rules govern e-filers. Canadian tax software to import from: TaxCycle, Intuit ProFile, DT Max, CanTax. Different season: T1 filing opens late February, deadline **April 30** (self-employed June 15) — the product's cutoff engine and calendar must be parameterized per country.
6. **SMS rails differ:** 10DLC is a US framework; Canadian carriers/CRTC have their own registration and surcharge regime — the messaging rail needs a Canadian configuration.

**Strategic call:** launch US-only for season one (all compliance work already scoped and half-done); treat Canada as a deliberate season-two market — CASL-grade consent is a superset we can adopt early cheaply, but Quebec PIA + French surface + Canadian hosting + CRTC rails are real work that shouldn't dilute the first season.

## 5. How data actually moves (the integration model)

**Principle: files, not APIs.** Small-firm tax software has no reliable public write APIs, and API dependence on Intuit/Drake would be a platform risk with review cycles. Every data flow is therefore file-based or direct:

- **In, grade 1 (v1 backbone):** client-list CSV/Excel export — every engine (Drake, Lacerte, ProConnect, ProSeries, UltraTax; TaxCycle/ProFile in Canada) exports client reports. We ship per-software import mappers (saved column presets: name, email, mobile, client type). Zero PII beyond contact data if the firm chooses. This works for 100% of firms with zero vendor cooperation.
- **In, grade 2:** organizer/proforma export parse — engines generate prior-year organizer PDFs listing expected documents; parsing them auto-builds checklists without touching SSNs (or with redaction).
- **In, grade 3 (finished product):** prior-year return PDFs dropped in bulk; SSNs redacted at ingestion and never stored; document expectations derived per client. The PDF is the interface — still no live integration.
- **Out, to the firm:** the season board, the daily digest email, and a completeness-status CSV they can import or eyeball anywhere; the audit-trail export at season close. If demand appears, v2 adds webhooks/Zapier for status push into suites — pull-based and optional.
- **To the client:** contact data from the import; consent from the EL/hosted consent page (before any first send); messages via the registered SMS rail + email fallback; uploads via the magic-link page straight into the season's conveyor; verified documents handed to the firm (download/export) for filing in *their* archive; then purged at season close.
- **Never:** write-back into tax software; storing returns beyond ingestion parsing; holding documents past the season.

## 6. The one-paragraph answer

We sit **beside** everything the firm owns and **inside** the one gap none of it covers — the behavioral chase between "engagement signed" and "file complete." We replace spreadsheets and nagging labor, never their software. In the US we operate under §7216's auxiliary-services path (counsel-gated), TCPA + state mini-TCPAs with EL-captured consent, carrier 10DLC rules, and the Safeguards-Rule posture their WISP demands; Canada adds CASL, PIPEDA/Law 25, French-language and residency questions, and different rails and deadlines — real but deferrable to season two. And data moves by files, not APIs: CSV and PDF exports in, statuses and audit trails out, texts and magic links to clients — which is exactly what makes the product installable in an evening beside software we never had to ask permission to integrate with.
