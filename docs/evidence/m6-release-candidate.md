# M6 — Release Candidate evidence (2026-10-19)

Scope per PLAN §14: full regression, data-migration tests, final coverage/traceability reports, handover docs. Every claim below is a measured run on the final tree.

## 1. Full regression (final tree)

| Gate | Result |
|------|--------|
| Gate 1 — Zod + strict structural sweep (258 lessons) | **ALL LESSONS VALID** (0 failures; the Session-8 drift of 49 remains closed) |
| Gate 2 — reference solutions + hidden tests under CPython | **319/319 suites pass** |
| Gate 3 — traces/runnables/mcq/numeric/fills/broken-oracles | **ALL CHECKS PASS** (166 + 654 + 296 + 102 + 39) |
| Gate 4 — types + lint | **tsc 0 errors in src/+content/**, eslint 0 errors |
| Coverage | **100.0% (476/476)** — PY4E 181/181 · SWE 117/117 · MLS 33/33 · D2L 145/145 |
| Production build | `next build` ✓ standalone |

A last Arabic-punctuation pass (65 tanwin fixes where `اً` was followed by Arabic punctuation — the U+060C block shares the Arabic Unicode range and had escaped the first boundary check) was re-certified with a **fresh dump + replay** after the edits.

## 2. Data-migration tests (R-GAM-05, ADR-0004) — browser E2E on the production build

| Case | Expected | Result |
|------|----------|--------|
| Import legacy payload (v0 shape, missing fields) | graceful import | ✓ toast "استوردنا تقدّمك بنجاح" |
| Import with duplicate event ids inside the file | idempotent (R-GAM-04) | ✓ duplicates dropped |
| Import with stale `xp` field | XP recomputed from ledger | ✓ xp = Σ(events), stale 9999 ignored |
| **BUG FOUND + FIXED**: in-file duplicates survived | — | `importProgress` passed the payload as the *existing* ledger, so internal duplicates were not deduped (xp 80 instead of 50). Fixed by passing the payload as `incoming`; verified xp=50, 2 unique events |
| Foreign JSON file | rejected | ✓ "الملف غير صالح" |
| Malformed (non-JSON) file | rejected | ✓ |
| Export → wipe → import round-trip | identical state | ✓ (and importing a previously-corrupted ledger **heals** it: 3 events w/ dup → 2 unique → xp 50) |
| Exported file shape | `app: pypath`, `schemaVersion: 1`, xp == Σ ledger | ✓ |

## 3. Offline hardening (§16) — service worker shipped

- `public/sw.js`: network-first for the shell (deploys land instantly), cache-first for `/_next/`, `/vendor/`, `/py-modules/`, `/data/`; versioned cache, stale-cache purge on activate, same-origin only (privacy R-ARC-10).
- Registered in AppShell mount (failures silent — dev servers unaffected).
- **E2E under network-off**: full reload boots the dashboard (RTL correct, 10 chunks from cache), a lesson renders (chunk + manifest from cache), coverage shows 100% from cached data, and going back online recovers cleanly.

## 4. Final coverage & traceability reports

- `/coverage` page (live): 100.0% overall, per-book rows, honest "published = schema-verified lessons" note; data from `public/data/coverage.json` (regenerated: `npm run gen:coverage`).
- Traceability chain per lesson: lesson `sources[]` (book + section + pages) → manifest → coverage matrix → TOC rasterized pages in `curriculum/sources/`. Sampled audits in Sessions 1–8; section-level totals machine-checked every run.
- Self-audit (§15) numbers: 17,274 Arabic strings scanned → 0 real findings; 258 lessons; 52 exam items; bundle 193 KB gzip; LCP 132–184 ms; CLS 0; lesson route 107 KB; audit findings 0.

## 5. Handover docs

- `README.md` — overview, quick start, stack, evidence summary.
- `docs/architecture.md` — as-built module map, bundle strategy, runtime, state, pipeline, security.
- `docs/content-authoring.md` — anatomy, determinism rules, the 4 gates, registration, floors, Arabic checklist.
- `docs/i18n.md` — parity model, RTL, hash-locale sync, style rules.
- `docs/gamification.md` — all formulas (single source `src/lib/gamification/config.ts`), calm mode, integrity.
- `docs/a11y.md` — WCAG 2.2 AA evidence + manual checklist.
- `docs/runbook.md` — operate/build/deploy/gates/Pyodide-bump/troubleshooting.
- `docs/adr/0001..0008` — 0002 revised to as-built truth (M5 note).
- `docs/OPEN-QUESTIONS.md` — OQ-1..8 (licensing decisions OQ-1..3 remain open for the human).
- `docs/evidence/` — per-milestone gate evidence (M5 + this file).

## 6. Release-candidate status — honest remaining items

> **Session-10 update (M6+):** items 1–4 below are now CLOSED — see §7.

Functionally complete and green; the following were recorded, non-blocking, and enumerated for the human (no placeholders in shipped code):

1. ~~**Automated test stack** (R-ARC-05)~~ — **CLOSED**: Playwright suite wired (`playwright.config.ts`, `bun run test:e2e`); 18 tests green: smoke flows both locales, full exam→capstone→signed-proof E2E, tampered-proof rejection, axe scans, visual baselines AR(RTL)+EN(LTR) with `test:e2e:update`.
2. ~~**axe CI**~~ — **CLOSED**: 9 axe scans (dashboard/path/exam/capstone/settings/coverage × AR/EN) gate on serious/critical = 0; 3 real violations found and fixed (opacity-diluted contrast on Part II cards, muted-foreground on soft-teal bg, unnamed slider thumb).
3. ~~**Certificate signing** (OQ-7)~~ — **CLOSED**: local-key ECDSA P-256 signing shipped (`src/lib/cert/proof.ts`), OQ-7 marked closed in OPEN-QUESTIONS.
4. ~~**Certification gating enforcement**~~ — **CLOSED as a shipped setting**: `advisory` (default) / `enforced` toggle in Settings; PathView honors it; documented in docs/gamification.md §6.
5. **Licensing** OQ-1/2/3: platform non-commercial by default; human confirmation required before any commercial use. *(Only remaining human decision.)*
6. **Unit-level mastery banks** (15–25 items/bank ≥ 3× quiz) — content growth beyond the floors, listed as optional in PLAN.

## 7. Session-10 evidence (M6+ closure round)

- **Playwright E2E**: `bun run test:e2e` → 18/18 green against dev server (chromium). Includes the full certification journey: exam (16/16 answered from the real bank) → capstone artifacts+rubric → signed proof issued → `verifySignedProof` valid inline; plus a forged-proof file rejected with `✗ التحقق فشل`.
- **Bugs found & fixed by the new suite**: settings language radio desynced the URL hash from the i18n locale (reverse sync added in `useRouterSync`); `opacity-80/70` dilution made muted/accent text fail WCAG contrast on white and soft-teal backgrounds (tokens darkened: accent-ai 0.6→0.51, muted-foreground 0.556→0.5; opacities removed); Radix slider thumb had no accessible name (root aria-label now forwarded to the thumb); rubric-state duplication removed via shared `capstoneReadiness`.
- **Environment fix**: eslint broke under TS 7.0.2 resolution (typescript-eslint caps <6.1) — typescript pinned `~5.9.3`; lint 0, tsc 7 lines (all pre-existing environmental: examples/, skills/, db.ts Prisma).
- **Gates after the round**: 258/258 VALID (content untouched), lint 0, tsc clean in scope, axe 9/9, visual baselines committed.
