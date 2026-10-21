# Architecture overview (as built)

Companion to the ADRs (`docs/adr/0001..0008`). This document describes the system as shipped at M5, including the performance refactor.

## 1. Shape

Single-route static-first app. The HTTP server serves exactly one document (`/`); all navigation is client-side hash routing: `#/{locale}/{view}/{param}` (`ADR-0007`). Views: `dashboard · path · lesson · coverage · sources · settings · exam · capstone`.

```
src/
  app/layout.tsx        SSR shell; lazy Toaster; html lang/dir defaults (client manages them)
  app/page.tsx          view switch. DashboardView is EAGER (landing view SSRs real content);
                        all other views are next/dynamic with a dashboard-shaped skeleton
  components/shell/     AppShell (nav, theme, dir, skip link, shortcuts)
  components/lab/       ExerciseCard, RunPanel, CodeEditor (@codemirror), StepVisualizer
  views/                8 views (dynamic chunks)
  lib/
    router.ts           hash router + i18n store sync (deep links carry the locale)
    i18n/               ar.ts (reference dict), en.ts, index.ts (store + translate)
    content/
      registry.ts       manifest (fetched from /data/manifest.json, zustand-cached)
                        + loaders map: id → dynamic import() per lesson
      loadLesson.ts     LAZY: Zod validation lives here so zod is out of the initial bundle
      schema.ts         Lesson Zod schema (predict/debug/sandbox carry optional expectedError)
      grading.ts        pattern grader + expected/actual parser
    runtime/            protocol.ts, runner.ts, pyodide worker (public/pyodide-worker.js)
    gamification/       config.ts — every number (XP table, level curve, caps)
    store/              progress.ts (IndexedDB + zustand), certification.ts
public/
  pyodide-worker.js     self-contained classic worker (importScripts vendored Pyodide)
  vendor/pyodide/0.29.5/  Pyodide 0.29.5 + sqlite3 wheel (versioned path, sha256-verified)
  py-modules/           minigrad.py (scalar reverse-mode autograd, M3)
  data/                 manifest.json, coverage.json (fetched, not bundled)
content/                258 lesson files (part1 = PY4E+SWE, part2 = MLS+D2L) + exam bank
curriculum/sources/     TOCs + extracted book text (authoring ground truth)
scripts/                content CI: validators, dumpers, replay harnesses, oracles
```

## 2. Bundle strategy (R-ARC-07)

- **Eager**: shell + router + i18n + progress + registry (manifest-free since M5) + DashboardView → **193 KB gzip** total.
- **Lazy**: 7 views (skeleton fallback, zero-CLS swap), each lesson (dynamic import via registry), **Zod** (inside `loadLesson.ts`, pulled by LessonView), **Pyodide** (worker boots on first run; vendored and HTTP-cached), Toaster.
- Manifest/coverage ship as JSON in `public/data/` and are fetched once (cached in zustand), not embedded in JS.
- Measured (production, M5): LCP 132–184 ms, CLS 0 (fresh and returning), lesson-route own assets 107 KB. In-app navigation shifts are input-triggered and therefore excluded from CLS by spec.

## 3. Runtime model (ADR-0002)

1. First run request → main thread spawns `/pyodide-worker.js` (classic worker, importScripts-compatible).
2. Worker imports `/vendor/pyodide/0.29.5/pyodide.js`, boots Pyodide 0.29.5, preloads the vendored `sqlite3` wheel and `/py-modules/minigrad.py` into the FS. If the self-hosted boot fails, the runner retries once after purging Cache Storage, then falls back to the same pinned version on the official jsDelivr dist.
3. `execute()` assigns an id, starts a watchdog (deadline + grace). Overrun ⇒ `worker.terminate()` + lazy respawn (no `SharedArrayBuffer` anywhere).
4. Results stream back as `stdout`/`stderr`/`result`/`testsResult` events; the UI renders live-region announcements for run outcomes.
5. `loadLesson(id)` runs `LessonSchema.safeParse` before the view touches the lesson; invalid/missing ids degrade to explicit states, never crashes.

## 4. State (ADR-0004)

- `useProgress` (zustand + IndexedDB): per-lesson state, exercise results, XP ledger (append-only, idempotent events), SRS queue, settings, notes.
- `useI18nStore` (localStorage): locale; kept in lockstep with the hash by the router (deep-link fix, M5).
- `useManifestStore`: fetched manifest + ready flag; views render their true structure and fill in place (no swap ⇒ no CLS).
- Export/import: versioned JSON, one click in Settings; delete-all is a first-class button (R-ARC-10).

## 5. Content pipeline (ADR-0005, R-ARC-06)

Authoring → validation → registration:

1. Lessons are TypeScript modules exporting a `Lesson` object (schema-validated, bilingual fields).
2. `scripts/wave3-validate.ts` — Zod + strict sweep: forbidden tokens in runnable code (`input(`, `random`, …) with a documented `RANDOM_OK` exception for PY4E ch4's seeded-random pedagogy, concept chunks ≤ 150 words per locale, exercise anatomy (4 hints, no explanations), quiz sizes.
3. `wave3-dump-solutions.ts` → `wave3-replay-solutions.py` — every reference solution re-executed under CPython, its hidden tests asserted green (319/319).
4. `wave3-dump-checks.ts` → `wave3-replay-checks.py` (+ `scripts/.w3-oracles.json`) — worked/predict/sandbox runnables re-executed; **intentional crash-teaching blocks carry `expectedError`** and are asserted to raise exactly that error class; logic-bug debug blocks must run and produce oracle-verified symptom output.
5. `gen_coverage.py` / `check_coverage.py` — section-level coverage vs the four TOCs; 100.0% (476/476) asserted.

## 6. Security & privacy (R-ARC-09/10)

- CSP: `default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net; connect-src 'self' https://cdn.jsdelivr.net; worker-src 'self'; frame-ancestors 'none'; object-src 'none'` — same-origin except the official pinned Pyodide CDN, used only as a last-resort boot fallback (Pyodide otherwise vendored).
- No `dangerouslySetInnerHTML` in the codebase; prose renders as text nodes.
- User code executes only in the worker; the main thread never evaluates learner input.
- `bun audit`: 0 findings after the M5 dependency pass (25 unused/heavy deps removed).

## 7. Known limitations (honest)

- Hash routing is a sandbox constraint (OQ-5/ADR-0007); real-path routing on self-hosted deploy.
- EN-by-deep-link previously fell back to AR — fixed in M5 (router↔i18n sync); the in-app toggle was always correct.
- Certification enforcement of Part II gating is advisory (recorded in OPEN-QUESTIONS).
- Pre-wave-3 checker drift was back-applied in M5; the strict sweep is now the single standard.
