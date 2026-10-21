# OPEN QUESTIONS — surfaced to the human (R-OPS-07)

| ID | Question | Status | Safe default chosen meanwhile |
|----|----------|--------|------------------------------|
| OQ-1 | PY4E Arabic edition is **CC BY-NC-SA** → derived material must be non-commercial. Is the platform ever commercial (paid tier/sponsors)? | OPEN | Treat platform as non-commercial; no paid tiers; attribution + ShareAlike kept. |
| OQ-2 | **MLS (Machine Learning from Scratch)** PDF states no license ("© Copyright 2020" only). Contact author Danny Friedman for written permission, or replace with openly licensed equivalent (e.g., write original derivations, cite conceptually)? | OPEN — needs human/legal decision | Treat as All Rights Reserved: zero verbatim reuse; lessons teach the same topics with original expression and cite the book as an external reference link only. No book text/code reproduced. |
| OQ-3 | D2L PDF does not print a license inside the file; d2l.ai states CC BY-NC-SA 4.0. Confirm before any D2L-derived publishing (M4). | OPEN | Same policy as OQ-2 until verified. |
| OQ-4 | MLS section-level page boundaries are approximations (chapter starts only). Refine when authoring M4. | OPEN | Chapter-level pages stored. |
| OQ-5 | Sandbox constraint: only `/` route is served externally → URL scheme `/ar/...` `/en/...` from R-I18N-01 can't be met with real paths. Use hash routes `/#/ar/...`? | OPEN | Hash-based routing preserving locale in-app; real path routing on self-hosted deploy (documented in ADR-0007). |
| OQ-6 | "Beyond the Books" optional module (§4.5) — human approval required before enabling. | OPEN | Ships **disabled** (default OFF). |
| OQ-7 | Certification "offline verifiable signed JSON proof" (R-GAM-02) needs a signing key decision (local key vs. none in v1). | **CLOSED (M6+ session 10)** — local-key signing shipped: ECDSA P-256 via WebCrypto, device-local private key, public key embedded in the proof, offline verify in-app (`src/lib/cert/proof.ts`, E2E-tested incl. tamper rejection). Honest scope: integrity + origin, not identity (documented in docs/gamification.md §6). |
| OQ-8 | Terms flagged `review: needed` for the AR/EN AI glossary (no Arabic AI source book). List maintained at `i18n/review-status.json`. | OPEN | Use glossary defaults; flag uncertain terms. |
