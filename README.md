# PyPath — منصّة "بايثون إلى الاحتراف"

Interactive, bilingual (Arabic-first / English), local-first learning platform that covers **100% of the section-level TOCs** of four books:

| Book | Sections | Coverage |
|------|----------|----------|
| PY4E — Python for Everybody (Arabic edition, CC BY-NC-SA) | 181 | 100% |
| SWE — The Real World of Software Engineering (Python track) | 117 | 100% |
| MLS — Machine Learning from Scratch | 33 | 100% |
| D2L — Dive into Deep Learning | 145 | 100% |
| **Total** | **476** | **100.0%** — auditable live on `/coverage` |

258 published lessons, a 52-item professional exam bank, a capstone studio, an in-browser Python runtime, and a step-through visualizer — all running client-side with zero required backend.

## Quick start

```bash
npm install          # sets up deps (postinstall generates the Prisma client)
npm run dev          # dev server on :3000 (bun is not required)
npm run build        # production build → .next/standalone (+ static/public)
npm run start        # serve the standalone build
```

Local Postgres for accounts/sync (Docker):

```bash
docker compose up -d              # starts pypath-db on localhost:5433
cp .env.example .env              # then fill DATABASE_URL / NEXTAUTH_SECRET
npm run db:migrate                # apply schema (prisma migrate dev)
```

> `.env` values: `DATABASE_URL` (Postgres), `NEXTAUTH_URL` (e.g. http://localhost:3000), `NEXTAUTH_SECRET` (`npx auth secret`), and optionally `RESEND_API_KEY` + `MAIL_FROM` so verification/reset emails actually send. `.env.example` documents all of them.

Accounts & cloud progress sync (ADR-0009): email/password registration, scrypt-hashed credentials behind next-auth JWT sessions, and per-account progress snapshots + XP ledger (`XpEvent`) in Postgres. The App behavior stays local-first: progress keeps working signed-out and syncs (merge-on-login, debounced push, Phoenix-style conflict retry) once signed in. Real-verify evidence: `tests/__api-security.mjs` and `tests/e2e/accounts-sync.spec.ts`.

Content gates:

```bash
npm run check:coverage            # 100% coverage assertion (python)
npm run validate:content          # python checks + tsc --noEmit
```

The old bun-based content pipeline commands remain in `scripts/` and data are unchanged (dump/replay helpers), but the platform commands above are cross-platform now.

## Stack

- **Next.js 16 (Turbopack, standalone output) + React 19 + TypeScript strict** — single hash-routed page (`ADR-0007`).
- **Tailwind CSS 4 + shadcn/ui (19 components kept — orphans and their deps removed in M5).**
- **Zustand + persist (localStorage) + IndexedDB** for progress, XP ledger, SRS state (`ADR-0004`).
- **Pyodide 0.27.7 vendored** (sha256-verified) in a classic Web Worker; watchdog terminate+respawn for runaway code (`ADR-0002`).
- **Zod content schema**; every lesson file validated at authoring time (CI) and at load time (lazy `loadLesson`).
- Content is data: `content/part1|part2/**/*.ts` with bilingual (ar/en) prose, verified runnables, oracles.

## Documentation

- [docs/architecture.md](docs/architecture.md) — module map, data flow, routing, runtime.
- [docs/content-authoring.md](docs/content-authoring.md) — lesson anatomy, gates, oracles, coverage rules.
- [docs/i18n.md](docs/i18n.md) — AR/EN parity, RTL, hash-locale sync.
- [docs/gamification.md](docs/gamification.md) — XP/level/SRS formulas (single source: `src/lib/gamification/config.ts`).
- [docs/a11y.md](docs/a11y.md) — WCAG 2.2 AA evidence and keyboard map.
- [docs/runbook.md](docs/runbook.md) — operate, deploy, extend content, troubleshoot.
- [docs/adr/](docs/adr/) — 8 architecture decision records.
- [docs/OPEN-QUESTIONS.md](docs/OPEN-QUESTIONS.md) — human decisions still open (licensing OQ-1..3 etc).
- [docs/LICENSES.md](docs/LICENSES.md) — attribution and license compliance.

## Performance & privacy

Measured on the production build (M5 evidence, `docs/PROGRESS.md`): initial JS **193 KB gzip** (budget 200), LCP **132–184 ms** (budget 2500), CLS **0** (budget 0.1), lesson route assets **107 KB** (budget 150). Pyodide is lazy and cached. Progress never leaves the device; no cookies beyond functional storage; CSP `default-src 'self'` with zero third-party origins.

## License

Platform code MIT; lesson content CC BY-SA 4.0; PY4E-derived material additionally carries CC BY-NC-SA (non-commercial) — see docs/LICENSES.md.
