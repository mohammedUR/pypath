# M5 — Polish & Hardening evidence (2026-10-19)

Milestone gate: all §16 acceptance checks re-verified on the production build. Every number below was measured, not estimated.

## 1. Arabic proofreading pass (M5 core)

- Corpus: 268 files / **17,236 Arabic strings** scanned (`scripts/m5_arabic_scan2.py`).
- **596 tanwin normalizations** across 64 files (corpus convention = tanwin before seat alef, was 93% → now 100%: `دائماً→دائمًا`, `أبداً→أبدًا`, `مثلاً→مثلًا`, `تلقائياً→تلقائيًا`, `أيضاً→أيضًا`, `جزءاً→جزءًا`…).
- **25 bare-adverb fixes** (missing tanwin/hamza: دائما→دائمًا, ايضا→أيضًا, اكثر→أكثر…).
- **2 real duplicated-word bugs fixed**: `swe.ch6.l3` "تضيف إلى إلى القائمة" → "تضيف إلى القائمة"; `swe.ch2.l3` "كم كان كان أن يُكتشف" → "وكم تأخر عن مرحلته".
- False-positive classes ruled out with evidence: 378 «بـ» kashida prefixes (intentional), rhetorical doublings (سطرًا سطرًا وحقولًا حقولًا…), regex literals (`.+?`), file extensions (`.py`), intentional string literals (`'  Here we go  '`).

## 2. Strict checker back-applied (checker drift → zero)

Session 8 documented 49 "failures" in the strict sweep, all in pre-wave-3 lessons. M5 back-applied the standard:

- **37 concept chunks split** at sentence boundaries (bilingual pair alignment; content verbatim, both locales ≤ 150 words) across 18 files — incl. converting one swe.ch9.l1 concept block into two (Zod ≤4 chunks/block).
- **3 `input(` comment mentions** reworded in runnable code (ch2.l5, ch5.l2, ch7.l4) — pedagogy kept, forbidden token gone.
- **`random` exception documented + enforced**: `RANDOM_OK` allowlist in `wave3-validate.ts` for `py4e.ch4.l3/l6` (the book's own seeded-dice/password pedagogy; determinism re-proven by the solutions replay gate). All other lessons remain strictly forbidden.
- **`expectedError` schema field added** (predict/sandbox/debug): 10 intentional crash-teaching blocks now CI-verified to raise exactly their documented error class (SyntaxError×3, NameError×4, ValueError×3) — stronger than the old "must not crash" rule for these cases.
- **Full oracle registry built**: `scripts/.w3-oracles.json` — 35 logic-bug debug blocks with deterministic symptom substrings (34 newly built from verified output + the ch13 seed).
- **Gate 1: 258/258 ALL LESSONS VALID (0 failures)** — was 49.

## 3. Full regression after all edits

- Gate 2: **319/319 solution suites pass** (CPython replay).
- Gate 3: **ALL CHECKS PASS** — 166 traces, 654 runnables, 296 mcq+numeric, 102 fills, 39 broken (35 oracle-verified + 4 expectedError-verified).
- Gate 4: tsc **0 errors in src/+content/** (was 278, incl. the i18n `Dict` literal-type bug — fixed via widened mapped type); eslint 0 errors.
- Coverage: `check:coverage` → **100.0% (476/476)**.
- Browser E2E: dashboard/path/coverage(100%)/exam/lesson render in AR+EN; split chunks render (swe.ch9.l1 new block verified); expectedError lesson renders; no console errors.

## 4. Performance pass (R-ARC-07) — production build numbers

| Metric | Budget | Before M5 | After M5 |
|--------|--------|-----------|----------|
| Initial JS (gzip) | ≤ 200 KB | ~333 KB | **193 KB** |
| LCP | ≤ 2500 ms | — | **132–184 ms** |
| CLS (fresh) | ≤ 0.1 | 0.888 | **0** |
| CLS (returning learner) | ≤ 0.1 | — | **0** |
| Lesson-route own assets | ≤ 150 KB | — | **107 KB** |
| Pyodide eager-loaded | must be lazy | lazy | **lazy** (verified: no pyodide request at boot) |

Changes that got there (all verified by rebuild + re-measure):

1. All 7 non-landing views → `next/dynamic` (dashboard eager so SSR paints real content — no skeleton swap).
2. Manifest (258 entries) out of the bundle → fetched from `public/data/manifest.json`, cached in `useManifestStore`; views render true structure and fill in place (zero CLS).
3. **Zod out of the eager path** → `loadLesson.ts` lazy module (validation happens inside the lazy LessonView chunk).
4. Dashboard continue-card reserves `min-h` so persisted-progress hydration cannot shift layout (returning-learner CLS 0.83 → 0).
5. Toaster lazy-loaded; 28 orphaned shadcn/ui components deleted; **25 heavy deps removed** (@mdxeditor, framer-motion, recharts, react-day-picker, embla, vaul, cmdk, react-hook-form, 16 radix packages…).
6. i18n `Dict` type widened (key-parity without literal-value tyranny) — fixed 272 baseline tsc errors.
7. 6 real tsc errors fixed: distributive `Omit` for `WorkerRequest` bodies, worker-spawn narrowing, dead `'error'` comparison, `write_code` pattern-grading guard, `/s` regex flag (target-safe `[\s\S]`).
8. Deep-link locale bug (Session 8 known issue) **fixed**: router syncs the i18n store — `#/en/...` now lands in English + LTR (E2E verified).

## 5. Security review (R-ARC-09)

- **CSP + security headers shipped** (`next.config.ts`): `default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; object-src 'none'` + nosniff + Referrer-Policy + X-Frame-Options DENY + Permissions-Policy. App E2E-verified under CSP.
- Zero third-party origins: Pyodide vendored (`/vendor/pyodide/`, 0.27.7, sha256-verified wheel); CDN constant documented as unused fallback.
- **No `dangerouslySetInnerHTML`** in the codebase (grep = 0) — no content XSS surface.
- **`bun audit`: 0 findings** after `bun update --latest` (was: 4 high / 1 moderate in transitive deps).
- Worker-only execution of user code re-affirmed (main thread never evaluates learner input).

## 6. Documentation (§16)

Created: `README.md`, `docs/architecture.md`, `docs/content-authoring.md`, `docs/i18n.md`, `docs/gamification.md` (R-GAM-01), `docs/a11y.md`, `docs/runbook.md`, plus `docs/evidence/` (this file).

Corrected: **ADR-0002 as-built revision** (Pyodide 0.27.7 not 0.28.x; watchdog terminate+respawn, no SharedArrayBuffer; no vendored matplotlib — honest correction note included).

## 7. Tooling left behind

- `scripts/m5_arabic_scan.py` / `m5_arabic_scan2.py` (Arabic lint), `scripts/m5_arabic_fix.py` (normalizer), `scripts/m5_split_chunks.py`, `scripts/m5_expected_error.py`, `scripts/m5_build_oracles.py`, `scripts/scratch/m5-*-backup/` (pre-M5 backups, renamed `.ts.bak` so tsc ignores them).
