# ADR-0001 — Stack
**Context:** Master spec R-ARC-02 requires a mature TS framework with static generation, typed content, strict TS. Sandbox provides Next.js 16 App Router + Tailwind 4 + shadcn/ui + TypeScript.
**Decision:** Next.js 16 + TypeScript strict + Tailwind CSS 4 + shadcn/ui. State: Zustand (client) with IndexedDB persistence (`idb-keyval`). No Prisma/DB — platform is static-first, local-first (R-ARC-01); progress lives client-side only.
**Consequences:** No backend required; export/import is a JSON file; cert signing (OQ-7) later needs an optional edge service — deferred.
