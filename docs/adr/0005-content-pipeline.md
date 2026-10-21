# ADR-0005 — Content pipeline & AI mini-library
**Context:** R-ARC-03 content-as-data with schema validation; R-I18N-04 per-locale authoring; R-CUR-02 MLS triads.
**Decision:** Lessons/exercises as typed TS data modules under `content/` validated by Zod schemas (`src/lib/content/schema.ts`) at build/CI time (`npm run validate:content`). Structure: `content/{part}/{track}/{lessonId}/lesson.{ar,en}.ts`. Coverage pipeline consumes `curriculum/sources/*.toc.json` → `curriculum/coverage.json`. Deep-learning visualizers compute with an in-repo NumPy-style mini tensor/autograd lib (`src/lib/ailab/`) in M3.
**Consequences:** Full type safety for content; CI parity checks (missing keys/locales) enforced by schema + script.
