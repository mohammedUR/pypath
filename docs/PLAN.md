# PLAN — Bilingual (AR/EN) Interactive Learning Platform
## "Professional Python → Professional AI"

Master spec: `/home/z/my-project/upload/Pasted Content_1792159054717.txt` (MASTER BUILD PROMPT).
All requirement IDs (R-*) refer to that document.

## Definition of success (§1.2, condensed)
A learner completing every required unit, passing every mastery gate and capstones must
demonstrably practice every topic of the four books' TOCs. Outcomes stated as verified,
itemized competencies. 100% section coverage of the four books is auditable on `/coverage`.

## Source of truth
`curriculum/sources/*.toc.json` — extracted from the PDFs themselves (R-SRC-01).
Totals: PY4E 16ch/181sec · SWE 16ch/117sec · MLS 8ch/33sec · D2L 21ch/145sec = **61 chapters / 476 sections**.

## Milestones (§14) — status board
- **M0 — Foundations** ← *current*
  - [x] Repo + docs skeleton (this file, PROGRESS, OPEN-QUESTIONS, LICENSES)
  - [x] TOC ingestion ×4 with rasterized-page verification (evidence: curriculum/sources/*)
  - [x] coverage.json + graph.json + `npm run check:coverage`
  - [x] ADRs 0001–0007
  - [x] Licensing report (docs/LICENSES.md + OPEN-QUESTIONS OQ-1..3)
- **M1 — Vertical slice** ← *this session target*
  - Platform shell (nav, themes light/dark/sepia, i18n AR/EN + full RTL, settings, progress store)
  - In-browser Python runtime (Pyodide in Web Worker) + editor + grader + hint ladder
  - PY4E ch1–3 lessons in AR+EN (subset authored at full quality; the rest of ch1–3 is
    hidden behind the `NEXT_PUBLIC_CONTENT_FLAGS` build flag per R-OPS-05 and listed in PROGRESS)
  - Step-through visualizer v1 (Python execution tracer)
  - Gate (full M1): all E2E flows AR+EN, perf/a11y budgets — *partially reachable this session; recorded honestly*
- **M2 — Part I content** (PY4E 4–16, SWE P3, Capstone I, exam)
- **M3 — AI runtime** (mini autograd/tensors + verified loss curve)
- **M4 — Part II content** (A0–A9, MLS triads, D2L coverage)
- **M5 — Polish/hardening** (motion, a11y, perf, Arabic proofread, security, offline)
- **M6 — Release candidate**

## Content plan per milestone
Floors per R-CNT-02 (PY4E ch ≥6 lessons/≥20 exercises/1 mini-project; SWE ch ≥4/≥12/1;
MLS ch ≥3+3+3 triads; D2L section ≥1 lesson-or-lab). Authoring pipeline:
`tools/notes -> lesson scaffolder -> bilingual authoring -> CI checks (§12 R-ARC-06)`.

## Risk register (top)
1. PY4E Arabic license CC BY-NC-SA → **non-commercial constraint** (OQ-1, blocking for commercial use only).
2. MLS book has **no license in PDF** → treated All-Rights-Reserved; no verbatim reuse (OQ-2).
3. D2L license not printed in PDF; site states CC BY-NC-SA 4.0 → verify before publishing (OQ-3).
4. Sandbox routes: only `/` is user-visible → hash-based client routing (ADR-0007).
5. Pyodide load size (~10MB) → lazy-loaded, cached, honest tier labels (R-LAB-03).
