# PART II CONTENT CONTRACT (MLS / D2L / SWE-ch13) — read fully, follow exactly

You author bilingual (AR+EN) lesson files for Part II (AI tracks). Same schema and
verification pipeline as PY4E/S waves. Files are TS data validated by Zod and replayed
under CPython 3.

## Files & ids
- MLS: `content/part2/mls/ch{N}/lesson.mls.ch{N}.l{K}.ts` — id `mls.ch{N}.l{K}` (chapter = N).
  Appendix: `content/part2/mls/appendix/lesson.mls.appendix.l{K}.ts` — id `mls.appendix.l{K}`, chapter 8.
- D2L: `content/part2/d2l/ch{N}/lesson.d2l.ch{N}.l{K}.ts` — id `d2l.ch{N}.l{K}` (chapter = N).
- SWE ch13: `content/part1/swe/ch13/lesson.swe.ch13.l{K}.ts` — id `swe.ch13.l{K}`, chapter 13.
- Import line 1: `import type { Lesson } from '@/lib/content/schema';` and final
  `export default { ... } satisfies Lesson;` (copy the shape from an existing wave-3 file).
- Every lesson: `version: 1`, `part: 'II'`, `estimatedMinutes: 30` (35 for a chapter-final),
  `track` per your assignment, `book: 'MLS'|'D2L'|'SWE'`.

## Anatomy (compact but full quality) — blocks in this order
1. `hook` — 2-3 sentences, why this matters, concrete.
2. `concept` ×1-2 — each chunk ≤150 words in BOTH ar and en (validator enforces; count with
   the whitespace-split rule). Max 4 chunks per concept block. Technical terms: keep Python/ML
   English identifiers as-is inside Arabic prose.
3. `worked` — one complete runnable example, deterministic, prints a short report.
4. `exercise` ×2-3 — first one write_code with 2-3 TestSpecs; second mcq OR numeric OR
   trace_output OR fill_blank. ALL exercises: `required: true`, `solution` present,
   exactly 4 hints, NO `explanation` key. mcq: `answer` == one option id, and `solution`
   equals a short canonical code/string answer.
5. `quiz` — 3-4 items (id, question {ar,en}, 3-4 options, answer, explanation {ar,en}).
6. `summary` — 2-5 bullets + reflectPrompt.
7. `sources` — EVERY source section this lesson teaches (book + section id). For D2L grouped
   lessons list EVERY grouped section. Optional `pages`.

## Determinism & sandbox rules (hard)
- Runnable fields (worked.code, predict.code, exercise.starterCode/code/solution, debug.*,
  tests[].code, sandbox.starterCode) = PURE Python stdlib only. NO numpy, sklearn, torch,
  pandas, matplotlib, keras imports — unless your assignment explicitly says `import minigrad`
  is allowed (minigrad = platform module, seeded, pure Python).
- FORBIDDEN substrings in any runnable field (validator fails): `input(`, `exit(`,
  `sys.exit`, `random`, `unittest.main`, `subprocess`, `os.system`, `socket`,
  `urllib.request`, `http.client`, `requests.` — note `random` is banned as a SUBSTRING:
  never write the word "random" in code or comments (use seeded/LCG/shuffle-free wording).
  Fixed datasets or an explicit integer seed + own LCG are the only "randomness" allowed.
- Every printed literal and every test assertion MUST be verified under CPython 3 BEFORE you
  author the file (scratch script: `python3 /tmp/verify-<your-task>.py`). Traces must match
  line-by-line. Float tests use abs(x - expected) < 1e-9 style asserts, never ==
- Debug blocks (only if your assignment includes one): brokenCode RUNS (no crash) and prints
  a WRONG but plausible result; solution fixes it; tests assert the corrected behavior.

## Verification gates you MUST run (from repo root)
1. `bun scripts/wave3-validate.ts <your files...>` → every file `VALID` + `ALL LESSONS VALID`.
2. `bun scripts/wave3-dump-solutions.ts <files> /tmp/sol-<task>.json` then
   `python3 scripts/wave3-replay-solutions.py /tmp/sol-<task>.json` → all suites pass.
3. `bun scripts/wave3-dump-checks.ts <files> /tmp/chk-<task>.json` then
   `python3 scripts/wave3-replay-checks.py /tmp/chk-<task>.json` → ALL CHECKS PASS
   (a `broken` block may log INFO no-oracle; that's fine unless your assignment adds one).
4. Fix and re-run until green. Do NOT mark done with a red gate.

## Sources & fidelity (R-SRC)
- MLS: teach from `curriculum/sources/MLS/txt/*.txt` (downloaded book pages: c1..c7 concept/
  construction/code + appendix-*). Cite section ids from `curriculum/sources/MLS.toc.json`.
  NEVER copy book sentences verbatim (license: all-rights-reserved, OQ-2) — explain in your
  own words, equations/notation may match the source.
- D2L: teach from `curriculum/sources/D2L/ch{N}.txt` (extracted PDF text). Cite
  `d2l.chN.sM` ids from `curriculum/sources/D2L.toc.json`. Your own words; no verbatim runs.
- D2L grouping rule: a lesson may cover several consecutive sections ONLY if it lists every
  grouped section in `sources` AND states each grouped section's objective (one summary
  bullet per section works well).
- torch/sklearn/keras APIs (book code) appear ONLY inside prose chunks as short inline
  references ("في الكتاب: `nn.Sequential`"), never as runnable code.

## Writing style (R-CNT-04)
Friendly, precise, short sentences, concrete before abstract, one idea per paragraph.
Arabic: no machine-translation flavor; use the established glossary style of existing
lessons (نموذج، تدريب، دالة الخسارة، الانحدار الخطي، عتبة، ...). Identifiers stay English.

## Worklog
Before starting: read the tail of `/home/z/my-project/worklog.md`. After finishing: append
a section starting with `---`, `Task ID: <given>`, Agent, Task, Work Log, Stage Summary
(files + gate numbers verbatim). Keep your final chat reply under 15 lines: files written,
gate results one line each, any deviation.
