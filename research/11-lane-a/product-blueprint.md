# Lane A — Finished-Product Blueprint

- **Date:** 2026-09-18. The complete system description (finished vision, v1+v2 unified). Feature-level rationale lives in [product-feature-map.md](product-feature-map.md); this file describes the machine as it runs.

## Definition

A bolt-on service beside a small tax firm's existing stack that runs the entire client-document chase for a season: builds each client's document checklist, texts clients until the file is complete, verifies uploads, blocks incomplete returns from the prep queue, converts stragglers into documented extensions — then deletes everything it held.

Two users: the **firm** (buys, configures, reads a daily email) and the **client** (receives texts, taps a magic link, uploads photos; no account, no password).

## Five surfaces

1. **Firm onboarding wizard** (once per season): import book → assign templates → set cutoffs → texting registration → test send.
2. **Season board** + **daily digest email**: four lanes (Silent / In progress / Complete–prep-ready / Extension track), per-client timeline; digest carries everything so login is optional.
3. **Client page** (magic link, mobile-first): remaining items as cards, camera upload, one-tap "Don't have it yet" (snooze+date) and "Doesn't apply" (firm approval), progress bar.
4. **Messaging rail**: SMS-first, email fallback, registered business sender under the firm's name, PII-free bodies, quiet hours, STOP/HELP autohandled.
5. **Compliance layer**: consent registry, append-only audit log, retention/purge scheduler, exportable evidence pack (WISP page, consent records, message history).

## The season, end to end

- **Nov–Dec setup:** signup ($299 founding / $499 standard per season) → client-list import (CSV minimum; finished product also parses organizer exports and prior-year return PDFs with SSN redaction at ingestion) → checklists auto-built one-item-per-source-document ("Schwab 1099 package", "W-2 — Acme", "K-1 — pending") → firm cutoffs set → A2P 10DLC registration done for the firm → consent kit into engagement letters + hosted consent page ending with save-our-contact vCard.
- **Jan kickoff:** one button; staggered carrier-safe sends: "Hi Dana — it's Meyer Tax. 4 items needed for your 2026 return. Tap: [link]".
- **Jan–Apr loop:** per-item state machine `requested → reminded(d3 SMS) → reminded(d7 SMS+email) → firm-alerted(d12)`; uploads hit the verification engine (classify, split multi-doc PDFs, re-ask politely on unreadable; never auto-reject — low confidence queues for firm); one-tap replies route to snooze or firm review; the enforcement engine holds each return in *Gathering* until all items close (owner override exists; discipline is the default). Firm's whole job: read the 7am digest, clear exceptions, prep complete files.
- **Cutoff breach:** client auto-flips to the extension track — warning letter (firm-editable) sends itself, return flagged for Form 4868 in the firm's own software, October re-chase schedule created.
- **Season close:** audit-trail export (E&O artifact), season ROI report (response rate, docs per firm-touch, hours saved, extension conversions), then **auto-purge of all client documents** — the chaser is a conveyor, not an archive.
- **Off-season:** books variant ($49/mo) runs the same engines monthly (statements, receipts, open questions); October runs the extension cohort.

## Engines

- **Checklist builder:** CSV/type-templates → organizer parse → redacted return parse; outputs source-document-grouped checklists with pending states (K-1s).
- **Chase engine:** per-item state machine, firm-tunable cadence, channel ladder, timezone quiet hours, per-firm caps.
- **Verification engine:** LLM-vision classification/splitting, US-hosted, contractual no-training; confidence-gated auto-complete.
- **Enforcement engine:** return-level gate, cutoff scheduler, extension-track generator.
- **Compliance rail:** consent registry keyed to the EL, 10DLC records, STOP/HELP with audit, PII-linting on outbound templates, purge scheduler, WISP pack.
- **Ops:** digest generator, exception queue, overrides, CSV import/export (the only tax-software touchpoint — by design).

## Data model (one line each)

Firm → Preparers → Clients → Engagement(tax year) → ChecklistItems → Documents (purged at season close) → Messages → ConsentRecords → Events (append-only) → CutoffPolicy. Stack: Twilio (10DLC) + transactional email + Stripe + magic-link auth + US-only hosting/encryption.

## Never-scope

No client portal/archive, no e-sign, no invoicing, no organizer questionnaires, no tax prep, no write-back into tax software, no year-round storage. The product is the chase — complete and disposable — beside whatever the firm already runs.

## Definition of done (system-level)

One firm touch per client per season; nothing untracked; stragglers cost ~zero minutes; the firm is safer than before (audit trail + compliant channel). Position in the stack, replacement analysis, and US/Canada legal obligations: [architecture-and-legal.md](architecture-and-legal.md).
