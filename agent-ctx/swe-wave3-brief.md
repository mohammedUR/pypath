# SWE Wave 3 Shared Brief — ch1–7 + Appendix A (57 sections, 34 lessons)

Read this file COMPLETELY before writing anything. You are a FILES-ONLY content author:
you do NOT run the dev server, do NOT use the browser, do NOT edit manifest.json or
registry.ts (the main agent registers everything at the end). You author lesson files +
per-chapter verification scripts, and you run the verification gates.

## 0. Mandatory reading (in order)
1. `/home/z/my-project/worklog.md` — search for "Task ID: 13-main" and "Task ID: 12-main"
   (SWE conventions, pitfalls, fixes).
2. `/home/z/my-project/src/lib/content/schema.ts` — the Zod contract (source of truth).
3. ONE exemplar lesson, fully: `content/part1/swe/ch15/lesson.swe.ch15.l1.ts` (structure,
   tone, comment header, bilingual depth) and skim `content/part1/swe/ch14/lesson.swe.ch14.l2.ts`
   for mcq/fill shapes.
4. Your chapter's source text under `curriculum/sources/SWE/chN.txt` (English book text with
   Arabic page markers `===== صفحة الكتاب N =====`) — your CONTENT basis.
5. Exemplar verification scripts you will clone (rename per chapter):
   - `scripts/validate-swe-ch15.ts`
   - `scripts/dump-swe-ch15-solutions.ts` → `scripts/replay-swe-ch15-solutions.py`
   - `scripts/dump-swe-ch15-checks.ts` → `scripts/replay-swe-ch15-checks.py`

## 1. Global wave plan (context — you own only your chapter)
Chain: swe.ch15.l4 (last published) → ch1(4) → ch2(5) → ch3(5) → ch4(4) → ch5(4) → ch6(4)
→ ch7(4) → appa(4) = 34 lessons, orders 130–163 assigned by main. Every lesson's
`prerequisites` = the previous lesson in this chain (ch1.l1 → ['swe.ch15.l4']).
Appendix A lesson ids use `swe.appa.lN` (lowercase — id regex forbids uppercase) but its
schema `chapter` field is 16 and its source sections are `swe.A.s1..s7`.

## 2. Lesson file shape (EXACT conventions)
- Path: `content/part1/swe/chN/lesson.swe.chN.lK.ts` (appa: `content/part1/swe/chA/lesson.swe.appa.lK.ts`).
- Header comment: id + titles + aligned sections with page ranges + a short "Runnable design"
  note + "Deterministic only: no input(), no exit(), no random, no unittest.main."
- `const lesson = { ... } satisfies Lesson; export default lesson;`
- Fields: id, version: 1, part: 'I', track: 'P3', book: 'SWE', chapter: N (appa: 16),
  title {ar, en}, estimatedMinutes (25–40; project lesson 35), prerequisites, blocks, sources.
- Block order (mandatory): hook → predict → concept×2–3 → worked → exercise×4 →
  [final lesson of chapter only: debug ×1] → sandbox → quiz → pitfalls → summary → sources.
- Every text field is `{ ar, en }` with FULL parity (Arabic is primary and idiomatic, English
  is a faithful mirror — never a literal word-by-word translation of the book; all expression
  is original paraphrase of CC BY-SA 4.0 source, never verbatim translation).
- Concept chunks: ≤150 words each (count Arabic words separately from English; both ≤150).
- Arabic prose keeps Python/technical terms in English (backticks not needed; plain words).
- sources (block + top-level): `{ book: 'SWE', section: 'swe.chN.sX', pages: 'صP / pp.P' }`
  where P = book page(s) from the page markers around that section in the source txt
  (OFFSET=0: pdf page == book page; use ranges like 'ص19-20 / pp.19-20').

## 3. Exercise rules (strict)
- Exactly 4 exercise blocks per lesson (5 blocks total in the final lesson: 4 exercises + 1 debug).
- Every lesson: ≥1 `write_code` (deterministic runnable, `solution` + 1–3 `tests`) AND ≥1 of
  `mcq` / `trace_output` / `fill_blank` / `numeric`. Mix across the 4: at most 2 write_code.
- `hints`: EXACTLY 4 per exercise and per debug (nudge → concept → skeleton → near-solution).
  NO `explanation` key on exercise/debug blocks (Zod forbids; explanation is allowed ONLY on
  quiz items).
- write_code tests: print-checks use `__learner_output__` with the established message format,
  e.g. `assert 'X' in __learner_output__, 'expected: X | actual: %r' % __learner_output__`;
  variable checks read learner globals directly (`assert total == 12, ...`). Solutions MUST
  pass their own tests (verified by replay).
- mcq: 3–4 options `{id:'a'...}`, `answer: 'b'`, `solution: 'b'` (same option id for both).
- fill_blank: `answer == solution`, ONE token, NO ':' anywhere in the answer (normalization
  strips trailing punctuation). Prefer unambiguous English/Arabic single terms.
- trace_output: show deterministic `code`; `answer` = EXACT stdout after whitespace
  normalization — keep lines SHORT ASCII (avoid Arabic in expected output; Arabic ok in prompts).
- numeric: `answer` as string of the number, `tolerance` when fractional.
- debug (final lesson only): `brokenCode` MUST RUN without crashing and visibly show the
  symptom (the checks replay asserts a per-lesson oracle on its stdout); `solution` fixes it
  and passes `tests`.

## 4. Determinism / platform constraints (hard)
FORBIDDEN anywhere in runnable code: `input(`, `exit(`, `sys.exit`, `random`, `unittest.main`,
`subprocess`, `os.system`, network libs (`socket`, `urllib.request`, `http.client`, `requests`),
`open(` on paths other than MEMFS-relative names you create yourself in the same snippet
(self-contained: create with 'w' first, unique filenames per lesson like `ch3_l2_stories.txt`).
Everything runs in Pyodide (CPython 3.13 WASM): pure stdlib only — dict/list/dataclasses/
statistics/difflib/textwrap/csv are all fine. All output deterministic. No time/datetime.now().
- Conceptual/heavy stuff (real users, real servers, real teams) is always a small deterministic
  MODEL in code — same spirit as ch14's SIMULATED-CI and ch15's characterization suite.

## 5. Quiz rules
4 quiz items per lesson (6 for the chapter's final project lesson). ≥1 item per lesson must
revisit an earlier chapter (for ch1: revisit PY4E-era or SWE ch8–15 material like git/tests/
CI/legacy; for later chapters: revisit earlier SWE ch1–7 lessons). Each item: question {ar,en},
options 3–4, answer (option id), explanation {ar,en}.

## 6. Per-chapter verification gates (run ALL, report verbatim numbers)
1. `bun run lint` → clean.
2. `bunx tsc --noEmit 2>&1 | grep -c "swe.chN"` → 0 (repo-wide must stay 280 — do not fix
   pre-existing noise).
3. `bun scripts/validate-swe-chN.ts` → "ALL N LESSONS VALID" (clone validate-swe-ch15.ts,
   import your lessons, keep the forbidden-token sweep + kind-mix report).
4. `bun scripts/dump-swe-chN-solutions.ts` then `python3 scripts/replay-swe-chN-solutions.py`
   → all suites PASS (worker semantics: stdout→__learner_output__, chdir to temp dir).
5. `bun scripts/dump-swe-chN-checks.ts` then `python3 scripts/replay-swe-chN-checks.py`
   → ALL CHECKS PASS (traces / runnables / mcq+numeric answer==solution / fills ':'-free /
   per-lesson broken-code symptom oracles).
Fix everything until green. If a gate is impossible to pass, say so HONESTLY in the worklog —
never fake it, never weaken an oracle to make it pass (oracles must test the real intent).

## 7. Worklog protocol (mandatory)
Before starting: read `/home/z/my-project/worklog.md` (tail is enough). After finishing (or if
you must stop early), APPEND a section (never overwrite):
```
---
Task ID: <yours>
Agent: <name>
Task: <one line>

Work Log:
- <concrete steps>

Stage Summary:
- <results, gate numbers, artifacts>
```

## 8. Style north star
Tone mirrors ch14/ch15: vivid, direct, second person, concrete numbers, no fluff; hooks open
with a real engineering moment; pitfalls are believable mistakes with crisp right answers.
Terminology (established): متطلب (requirement), حالة استخدام (use case), سبرنت (sprint),
قائمة الأعمال المتراكمة (backlog), أصحاب المصلحة (stakeholders), المعمارية (architecture),
الطبقات (layers), الاختبارات (tests), النشر (deployment), الشيفرة العتيقة (legacy code).
 chapter = "الفصل", lesson = "الدرس". Prefer البسيطة over معقدة phrasing; short sentences.
