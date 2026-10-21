# Runbook — operating PyPath

## 1. Everyday commands

```bash
bun install                     # deps (bun >= 1.3)
bun run dev                     # dev server :3000, output mirrored to dev.log
bun run build                   # production build → .next/standalone (+ static + public copied in)
PORT=3100 bun .next/standalone/server.js   # serve production standalone (any port)
bun run lint                    # eslint (0 errors expected)
bunx tsc --noEmit               # types (0 errors in src/ + content/)
```

Static preview of standalone: only `/` is meaningful (hash routing). For self-hosted deploys with real paths, see ADR-0007.

## 2. Content gates (release checklist)

```bash
find content -name "lesson.*.ts" | sort > /tmp/lessons.txt
xargs -a /tmp/lessons.txt bun scripts/wave3-validate.ts          # Gate 1 — ALL LESSONS VALID
xargs -a /tmp/lessons.txt sh -c 'bun scripts/wave3-dump-solutions.ts "$@" /tmp/sol.json' _
python3 scripts/wave3-replay-solutions.py /tmp/sol.json          # Gate 2 — N/N suites pass
xargs -a /tmp/lessons.txt sh -c 'bun scripts/wave3-dump-checks.ts "$@" /tmp/chk.json' _
python3 scripts/wave3-replay-checks.py /tmp/chk.json scripts/.w3-oracles.json   # Gate 3 — ALL CHECKS PASS
npm run gen:coverage && npm run check:coverage                   # 100.0% (476/476)
cp content/manifest.json public/data/manifest.json               # sync fetched manifest
```

Full guide: `docs/content-authoring.md`.

## 3. Performance evidence commands (R-ARC-07)

Serve the production build, then in the browser console (fresh profile):

```js
const js = performance.getEntriesByType('resource').filter(r => r.name.endsWith('.js'));
js.reduce((a, r) => a + (r.encodedBodySize || 0), 0) / 1024;      // initial JS KB gzip (budget ≤ 200)
// CLS/LCP via PerformanceObserver('layout-shift' / 'largest-contentful-paint')
```

Reference numbers (2026-10-19): JS 193 KB · LCP 132–184 ms · CLS 0 (fresh & returning) · lesson route +107 KB.

## 4. Pyodide runtime notes

- Vendored at `public/vendor/pyodide/` (0.27.7 + sqlite3 wheel, sha256-verified). **Do not** point the worker at a CDN (CSP `default-src 'self'` forbids it by design).
- To bump Pyodide: replace the vendor dir with the pinned dist (pyodide.js, pyodide.asm.{js,wasm}, python_stdlib.zip, pyodide-lock.json, sqlite3 wheel), update `PYODIDE_VERSION` in `src/lib/runtime/protocol.ts`, then run `bun scripts/test_pyodide_minigrad.ts` (minigrad regression: identical loss curves) and one E2E lesson run.
- The worker is self-contained on purpose (classic worker + importScripts). Do not add ES imports to `public/pyodide-worker.js`.
- Watchdog: a run exceeding deadline+grace terminates the worker; the next run respawns lazily. If the sandboxed environment blocks workers entirely, the UI degrades to `noRuntime` states with honest messaging (mcq/fill/trace/numeric grading still works pattern-based).

## 5. Data & privacy

- Progress: IndexedDB (`pypath` DB) via zustand persist; locale/theme: localStorage. Nothing leaves the device; CSP `connect-src 'self'`.
- "Delete all my data" (Settings) wipes both storages — point users there for resets; no server-side data exists.
- Export/import round-trips versioned JSON; import validation rejects foreign files with a friendly error.

## 6. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Lesson stuck on skeleton | manifest fetch failed | check `public/data/manifest.json` served; reload (hydrate retries on next navigation) |
| "المفسّر غير متاح" | Pyodide blocked/old cache | hard-reload; verify `/vendor/pyodide/pyodide.js` 200 |
| A lesson reports invalid | schema drift after edits | `bun scripts/wave3-validate.ts <file>` prints the Zod path |
| Gate 3 fails on a debug block | symptom oracle mismatch | re-verify the symptom by hand, then update `scripts/.w3-oracles.json` |
| tsc errors in `examples/`/`skills/` | out-of-scope dirs | not part of the app build; ignore (documented baseline) |

## 7. Deployment

1. `bun run build` → deploy `.next/standalone/` (includes `.next/static` + `public`).
2. Serve with any Node/bun process (`NODE_ENV=production bun .next/standalone/server.js`). Set `PORT`.
3. Security headers ship from `next.config.ts` (CSP, nosniff, Referrer-Policy, frame-ancestors none) — keep them enabled; they are part of the security bar (R-ARC-09).
4. License notes before any commercial use: OQ-1 (PY4E BY-NC-SA) makes the platform non-commercial — see docs/LICENSES.md and OPEN-QUESTIONS.
