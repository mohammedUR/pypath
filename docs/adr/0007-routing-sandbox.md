# ADR-0007 — Routing inside single-route sandbox
**Context:** Deployment sandbox serves only `/` (src/app/page.tsx) externally; master spec wants `/ar/...`,`/en/...` paths.
**Decision:** Single-route Next.js app; client-side router with state-driven views + hash sync (`#/ar/lesson/py4e.ch1.l1`). Locale, theme, and view live in a Zustand store synced to localStorage; hash enables deep links + back/forward.
**Consequences:** OQ-5 recorded; on self-hosted static deploy, a thin path-based variant can be generated (same components).
