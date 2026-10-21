# Worklog — shared multi-agent log (append-only)

---
Task ID: 1-4
Agent: main (Z.ai)
Task: M0 foundations — env init, source ingestion (4 books), docs, ADRs, coverage system

Work Log:
- Initialized fullstack env (Next.js 16 + Tailwind 4 + shadcn/ui, TS strict). Port 3000 dev auto-runs.
- Extracted TOCs from the 4 PDFs with PyMuPDF: curriculum/sources/{PY4E,SWE,MLS,D2L}.toc.json
  (PY4E 16ch/181sec · SWE 16ch/117sec · MLS 8ch/33sec · D2L 21ch/145sec = 61ch/476sec).
- Verified PY4E TOC visually (PDF p11 rasterized) — titles + book page numbers match.
- License pages verified: PY4E AR = CC BY-NC-SA 3.0 (PDF p3/p7); SWE = CC BY-SA 4.0 + code MIT (PDF p17);
  MLS = NO license stated (PDF p109 "© 2020" only) → OQ-2; D2L = none printed in PDF → OQ-3.
- Extracted PY4E ch1–3 full Arabic text → curriculum/sources/PY4E/ch{1,2,3}.txt (authoring inputs).
- Wrote docs/{PLAN,PROGRESS,OPEN-QUESTIONS,LICENSES}.md + docs/adr/0001..0007 (stack, pyodide runtime,
  FSRS, IndexedDB storage, content pipeline, P3 ordering, single-route routing).
- Built content/manifest.json (18 M1 lessons, PY4E ch1–3, AR/EN) mapping all 40 sections.
- scripts/gen_coverage.py + scripts/check_coverage.py wired as npm run check:coverage / gen:coverage.
- Fixed section-id double numbering bug in tocs (s1.1 → s1).

Stage Summary:
- M0 GATE: check:coverage runs and reports a TRUE number (PY4E 22.1% published; total 8.4%).
- Key decisions: Pyodide 0.28 pinned in Web Worker (ADR-0002); FSRS (ADR-0003); IndexedDB via idb-keyval
  (ADR-0004); content as typed TS data + Zod (ADR-0005); hash routing because sandbox serves only `/` (ADR-0007, OQ-5).
- Licensing constraint surfaced: PY4E-AR non-commercial → platform must stay non-commercial (OQ-1).
- NEXT: Task 5 = platform shell + runtime (fullstack agent); Task 6 = lesson content authoring.

---
Task ID: 6-a
Agent: content-author (lesson content authoring)
Task: Author 11 lesson files (py4e ch1 l2–l6, ch2 l1–l6) + register them

Files created:
- content/part1/py4e/ch1/lesson.ch1.l2.ts — بنية الحاسوب (s2: CPU/RAM/secondary/IO/network, "programmer inside the box")
- content/part1/py4e/ch1/lesson.ch1.l3.ts — بايثون والمفسِّر (s4–s6: reserved words, >>> conversation, interpreter vs compiler, interactive vs script)
- content/part1/py4e/ch1/lesson.ch1.l4.ts — أول برنامج لك (s7–s8: print as call, quotes, paren bugs, first multi-line program)
- content/part1/py4e/ch1/lesson.ch1.l5.ts — مكوّنات البرامج والأخطاء (s9–s10: input/output/sequence/conditional/repetition/reuse + syntax/logic/semantic errors)
- content/part1/py4e/ch1/lesson.ch1.l6.ts — مراجعة الفصل 1 ومشروع مصغّر (s11/s13/s14: recap + 5-line self-intro card project + debug block + heavier quiz)
- content/part1/py4e/ch2/lesson.ch2.l1.ts — القيم والأنواع (s1: int/float/str, type() informally, 1,000,000 semantic trap)
- content/part1/py4e/ch2/lesson.ch2.l2.ts — المتغيّرات وأسماؤها (s2/s3/s12: assignment, legal/illegal names, keywords, Pro Habit descriptive names)
- content/part1/py4e/ch2/lesson.ch2.l3.ts — التعليمات والتعابير وترتيب العمليات (s4/s6/s7: statement vs expression, PEMDAS, parentheses)
- content/part1/py4e/ch2/lesson.ch2.l4.ts — العوامل الحسابية وباقي القسمة (s5/s8/s9: / vs //, % even/odd + digit slicing + time conversion, string + and *)
- content/part1/py4e/ch2/lesson.ch2.l5.ts — إدخال المستخدم والتعليقات (s10/s11: input() returns str, int() conversion (simulated "typed" var — no keyboard in sandbox), # comments)
- content/part1/py4e/ch2/lesson.ch2.l6.ts — مراجعة الفصل 2 ومشروع محوّل الحرارة (s13–s15: recap + F=9/5C+32 project + silent-semantic debug + heavier quiz)
- src/lib/content/registry.ts — added 11 lazy loaders to the `loaders` map (ch1.l1 untouched).

Anatomy per master spec §6.1: hook → predict → 2–3 concepts → worked → 2–4 exercises (every lesson: ≥1 write_code with assert tests + ≥1 mcq/trace_output/fill_blank/numeric; both l6 reviews add a debug block) → sandbox → quiz (3–4 items, ≥1 revisits an earlier lesson) → pitfalls (2–3 pairs) → summary+reflect → sources. Sources use manifest section ids + PY4E.toc.json book pages ("صX / pp.X").

Verification evidence:
- `bun run lint` → clean (no output).
- `bunx tsc --noEmit` → 0 errors in the 11 new content files and registry.ts. Repo-wide there are 280 PRE-EXISTING errors in files I did not touch (examples/, skills/, src/lib/i18n/en.ts literal-key quirk, ExerciseCard.tsx, grading.ts es2018-flag) — baseline unchanged by this task.
- Zod validation of all 12 lessons (reference + 11 new) via `bun run` script importing schema: all `safeParse` OK; exercise-kind mix printed per lesson.
- Python harness check (replicating pyodide-worker __pypath_run_tests: stdout→__learner_output__, tests exec'd in same env): all 13 write_code+debug solutions PASS their own test suites; broken debug code fails as intended.
- Browser (agent-browser, dev server): /#/ar/lesson/py4e.{ch1.l2..l6, ch2.l1..l6} all render h1 title, no "درس غير متوفر" state. Exercise Check works end-to-end (Pyodide worker ran): ch1.l2 ex1 (print CPU/RAM) → "أحسنت! نجحت كل الاختبارات." and ch2.l6 ex2 (converter, round() test) → "أحسنت! نجحت كل الاختبارات." EN locale verified via persisted i18n store: ch2.l6 h1 renders English.
- dev.log tail after visits: only 200s + compiles, zero error lines.

Notes / friction observed (for future agents):
- Test harness convention confirmed: print-checks use __learner_output__ (e.g. assert 'X' in __learner_output__, 'expected: X | actual: %r' % __learner_output__); variable checks see learner globals. The "expected: X | actual: Y" message format feeds the UI's expected/actual row (parseExpectedActual).
- Sandbox has NO keyboard: input() would EOFError — ch2.l5 teaches input() via a simulated `typed` variable (pattern documented in-lesson). A future platform enhancement could stub input().
- fill_blank grading is exact-after-normalization (looseNormalize) — Arabic answers must be unambiguous single forms (I chose textbook terms, e.g. الثانوية/التسلسلي/المحجوزة).
- trace_output grading is whitespace-normalized exact match — keep expected output lines short and unambiguous.
- i18n gap noticed: hash locale (#/en/…) does not drive the locale store; locale lives in localStorage (pypath.i18n). Pre-existing platform behavior, not content-side.
- Minor pre-existing tsc noise: tsconfig include covers examples/ and skills/; a future cleanup could exclude them.

Status: 11/11 lessons COMPLETE (no partials). ch3 lessons remain unauthored (out of this task's scope).

---
Task ID: 6-b
Agent: content-author (lesson content authoring, continuation)
Task: Author 6 lesson files (py4e ch3 l1–l6) + register them

Files created:
- content/part1/py4e/ch3/lesson.ch3.l1.ts — التعابير المنطقية (s1/s2: True/False as class bool, comparison family == != > < >= <=, = vs ==, "5"==5 False / 1<'2' TypeError, and/or/not first pass, 17 and True leniency warning)
- content/part1/py4e/ch3/lesson.ch3.l2.ts — الشرط if والتنفيذ البديل (s3/s4: condition + colon + 4-space indented block, compound statements, pass placeholder, indentation as grammar, if/else branches, always-one-branch rule)
- content/part1/py4e/ch3/lesson.ch3.l3.ts — السلاسل الشرطية والشرط المتداخل (s5/s6: elif chains, first-true-wins + chain ends, no limit on elif, optional else, ordering = meaning (specific→general, silent semantic bug), nested conditionals + flattening with and)
- content/part1/py4e/ch3/lesson.ch3.l4.ts — معالجة الأخطاء بـ try و except (s7: traceback read bottom-up, try/except as insurance policy, catching an exception, fix/retry/graceful-exit framing, scope try to the risky lines, book's fahren2 converter with simulated `typed` input)
- content/part1/py4e/ch3/lesson.ch3.l5.ts — التقييم قصير الدارة (s8: and stops at first False / or at first True, book's x>=2 and (x/y)>2 three-case progression incl. passing-guard crash, guardian pattern with y != 0 and len(s) > 0 guards, sandbox True or 10 / 0 demo)
- content/part1/py4e/ch3/lesson.ch3.l6.ts — مراجعة الفصل 3 ومشروع: الآلة الحاسبة الآمنة (s9/s10/s11: chapter map + Safe Calculator project — typed_a/typed_b simulated inputs, try-wrapped int conversions, prints a > b, a + b, a / b (True/12/3.0), أرقام فقط in except; debug block: unprotected int('خمسة') crash → guard it; heavier quiz 4 items incl. ch1/ch2 revisits)
- src/lib/content/registry.ts — added 6 lazy loaders 'py4e.ch3.l1'..'py4e.ch3.l6' to the loaders map (no other platform code touched).

Verification scripts kept for future content agents (all under scripts/):
- scripts/validate-ch3.ts (Zod safeParse + per-lesson exercise-kind mix report)
- scripts/dump-ch3-solutions.ts + scripts/replay-ch3-solutions.py (dump write_code/debug solutions+tests to JSON, replay with python3 replicating public/pyodide-worker.js __pypath_run_tests semantics: stdout→__learner_output__, tests exec'd in learner env)

Anatomy per master spec §6.1 (identical to 6-a): hook → predict → 2–3 concepts (≤150 words/chunk) → worked (runnable) → 2–4 exercises (every lesson: ≥1 write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; l6 adds 1 debug block) → sandbox → quiz (4 items each; ≥1 item revisits ch1/ch2) → pitfalls (2–3 wrong/right pairs) → summary+reflect → sources. Sources use manifest section ids + PY4E.toc.json book pages ("صX / pp.X": s1 ص39, s2 ص40, s3 ص40-42, s4 ص42-43, s5 ص43-45, s6 ص45-46, s7 ص46-48, s8 ص49-50, s9 ص51, s10 ص51-52, s11 ص53-54). input() never used anywhere (tests included) — ch3.l4/l6 use the documented simulated `typed` pattern from ch2.l5. fill_blank answers kept unambiguous single forms; ':' avoided as a fill answer because looseNormalize strips trailing punctuation (used 'المركبة' instead).

Verification evidence:
- `bun run lint` → clean (no output).
- `bunx tsc --noEmit` → 280 errors repo-wide = exactly the 6-a pre-existing baseline; ZERO errors in the 6 new content files, registry.ts, or the new verification scripts. (Initial dump script had 1 self-inflicted error — fixed; re-verified.)
- Zod validation: scripts/validate-ch3.ts → "ALL 6 LESSONS VALID" (block/exercise-kind mix printed per lesson; every lesson write_code + ≥1 pattern kind; l6 debug=1; quizItems=4).
- Python harness replay: scripts/replay-ch3-solutions.py → 7/7 suites PASS (all 6 write_code solutions + l6 debug solution pass their own tests; print-checks via __learner_output__, variable checks in learner env).
- Browser (agent-browser, dev server):
  - /#/ar/lesson/py4e.{ch3.l1..l6} all render correct h1 Arabic titles (matching manifest titles verbatim), zero "درس غير متوفر" states.
  - Check flow E2E (Pyodide worker ran): ch3.l6 project ex2 with reference solution → "أحسنت! نجحت كل الاختبارات." (outputs True/12/3.0 present).
  - EN spot-check via header English toggle: ch3.l6 h1 → "Chapter 3 Review and Project: The Safe Calculator"; AR success message absent after flip.
- dev.log tail after all visits: 200s + compiles only, zero error/warn/404/500 lines.

Status: 6/6 lessons COMPLETE (no partials). All 18 M1 manifest lessons now authored and registered (ch1 6, ch2 6, ch3 6). M1 PY4E Part I content complete.

---
Task ID: 7-b
Agent: content-author (ch5 iteration)
Task: Author 6 lesson FILES (py4e ch5 l1–l6) for التكرار / Iteration — no registration (parallel/main agent owns registry.ts + manifest.json)

Files created (content only; registry.ts and manifest.json NOT touched):
- content/part1/py4e/ch5/lesson.ch5.l1.ts — تحديث المتغيرات وحلقة while (s1+s2: x=x+1 read-then-store, increment/decrement, NameError before init, while 3-step evaluation, n=5 countdown + Blastoff, iteration variable, 5 iterations)
- content/part1/py4e/ch5/lesson.ch5.l2.ts — الحلقات اللانهائية وcontinue (s3+s4: shampoo joke, missing iteration variable, while True, break escape (simulated "> done" loop — NO input(), fixed lines list pattern from ch2.l5), continue skipping '#' lines, continue-before-update infinite trap)
- content/part1/py4e/ch5/lesson.ch5.l3.ts — حلقة for (s5: definite vs indefinite, list literal intro, header/body/iteration variable, for+in reserved words, string iteration, light range() helper)
- content/part1/py4e/ch5/lesson.ch5.l4.ts — أنماط الحلقات: العدّ والمجموع (s6 first half: 3-step loop recipe, counter pattern, accumulator pattern, average = total/count with round; book list [3,41,12,9,74,15] → 6/154/25.67)
- content/part1/py4e/ch5/lesson.ch5.l5.ts — أنماط الحلقات: التصفية والأكبر والأصغر (s6 second half: filter pattern, max/min None idiom with `is`, short-circuit or-guard (ch3.l5 echo), built-in max()/min() as fruitful functions tie to ch4)
- content/part1/py4e/ch5/lesson.ch5.l6.ts — مراجعة الفصل 5 ومشروع: تقرير الدرجات (s7 التنقيح: traceback bottom-up, shrink data/lines, temporary print inside body, bisection + timeout-message tie-in; s8 glossary reflected in review; s9 exercises; project = grade report over scores=[82,95,67,74,91] → count 5/total 409/avg 81.8/max 95/min 67 with 5 labeled lines; debug block: re-init inside loop bug (total=0 in body) + fixed reference; heavier 6-item quiz incl. ch2/ch3/ch4 revisits)
- Verification scripts: scripts/validate-ch5.ts, scripts/dump-ch5-solutions.ts, scripts/replay-ch5-solutions.py (adapted from the ch3 pair)

Anatomy per master spec §6.1 (identical to 6-a/6-b): hook (embeds measurable learning objectives — the schema has no separate objectives block, so objectives live in the hook text, consistent with existing lessons) → predict → 2–3 concepts (≤150 words/chunk, AR+EN) → worked (runnable) → 4 exercises each (every lesson: ≥1 write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; kind mixes: l1 2×write_code+mcq+trace, l2 write_code+mcq+trace+fill, l3 write_code+trace+mcq+fill, l4 write_code+trace+numeric+mcq, l5 2×write_code+mcq+trace, l6 trace+write_code+mcq+numeric) → sandbox → quiz (4 items ×5 lessons, 6 items in l6; ≥1 revisit per lesson: ch1/ch2/ch3/ch4) → pitfalls (3 pairs each) → summary+reflect → sources. Sources pages from PY4E.toc.json: s1 ص74, s2 ص74, s3 ص75, s4 ص77, s5 ص78, s6 ص79, s7 ص83, s8 ص83, s9 ص84 ("صX / pp.X" format). prerequisites: l1→["py4e.ch4.l6"], then chained l2..l6. input() never used anywhere — l2 teaches the book's "> done" loop via simulated fixed lines list (documented in-lesson). No random anywhere — all exercises deterministic. fill_blank answers unambiguous single forms ('continue', 'التكرار'); no ':' answers. Test messages follow the 'expected: X | actual: %r' convention feeding parseExpectedActual.

Verification evidence:
- Zod validation: bun run scripts/validate-ch5.ts → "ALL 6 LESSONS VALID" (kind mix + debug=1 + quizItems=6 for l6 printed per lesson).
- Python harness replay (replicates public/pyodide-worker.js __pypath_run_tests: stdout→__learner_output__, tests exec'd in learner env): bun run scripts/dump-ch5-solutions.ts → 9 suites dumped (8 write_code + 1 debug); python3 scripts/replay-ch5-solutions.py → 9/9 suites PASS (l6 project prints العدد: 5 / المجموع: 409 / المعدل: 81.8 / الأعلى: 95 / الأدنى: 67).
- Extra rigor: ran every trace_output exercise's shown code under python3 and whitespace-normalized-compared to its answer → 6/6 match; mcq answer==solution checked.
- `bun run lint` → clean.
- `bunx tsc --noEmit` → 280 errors repo-wide = exactly the 6-b baseline; ZERO errors in the 6 new content files or the 3 new scripts. (Ran while parallel agent 7-a was mid-edit on ch4/registry — count unaffected.)
- Registry check not possible for this task (parallel agent owns registry.ts/manifest.json); tsconfig include covers the new files — zero tsc errors in them confirmed. Browser/E2E testing deliberately left to the main agent at registration time.

Notes / friction observed (for future agents):
- Schema has no 'objectives' block: measurable learning objectives are embedded in each hook text ("بنهاية الدرس ستكون قادرًا على: …") — matches existing ch1–3 anatomy.
- curriculum/sources/PY4E/ch5.txt extraction stops mid-s6 (book p.79): s6 examples/​s7/s8/s9 were authored against PY4E.toc.json titles + the known PY4E ch5 content (counting/summing lists [3,41,12,9,74,15], None idiom, min/max built-ins, bisection debugging) — terminology cross-checked against extracted s1–s6 text and TOC.
- There is a 10s platform watchdog (DEFAULT_RUN_TIMEOUT_MS) that shows the infinite-loop message — referenced it in l2/l6 pedagogy; still avoided infinite loops in all runnable/shown-broken code.
- Parallel agent 7-a was live during this task: registry.ts/manifest.json mtimes changed under us (ch4 loaders) — no conflict; my files are separate and untouched by them.

Status: 6/6 lesson FILES COMPLETE (awaiting registration)

---
Task ID: 7-a
Agent: content-author (ch4 functions)
Task: Author 6 lesson files (py4e ch4 l1–l6, functions chapter) + register them

Files created:
- content/part1/py4e/ch4/lesson.ch4.l1.ts — استدعاء التوابع والتوابع الجاهزة (s1/s2: call anatomy, argument/return value, max/min/len, built-in names as reserved, nested calls, min('Hello world') invisible-space teachable moment)
- content/part1/py4e/ch4/lesson.ch4.l2.ts — توابع تحويل النوع والتوابع الرياضية (s3/s4: int truncates-never-rounds, int('3.14159') ValueError trap, float/str, import math + dot notation, log10/sqrt/sin/pi, compound-interest app via math.pow + round)
- content/part1/py4e/ch4/lesson.ch4.l3.ts — الأعداد العشوائية (s5: determinism, pseudorandom, random()/randint(inclusive both)/choice, other distributions one-liner, seed concept for stable tests, book's loop shown as sandbox preview of ch5)
- content/part1/py4e/ch4/lesson.ch4.l4.ts — تعريف توابع جديدة: def وتسلسل التنفيذ (s6/s7/s8: def header+colon+4-space body, naming rules, function object type, definition executes but body waits, define-before-first-call (book NameError experiment), reorder-definitions-still-works experiment, flow of execution with jumps and functions-calling-functions)
- content/part1/py4e/ch4/lesson.ch4.l5.ts — المعاملات والوسائط والتوابع المُنتجة (s9/s10/s11: parameter receives/argument sent, argument evaluated before call, value travels not the name, print_twice(bruce), fruitful vs void, None + NoneType, return + addtwo, why functions)
- content/part1/py4e/ch4/lesson.ch4.l6.ts — مراجعة الفصل 4 ومشروع: مولّد كلمات المرور (s12/s13/s14: chapter map, password-generator project — def make_password() + random.choice glued with + + return + random.seed(4) → 'bca' deterministic, debugging (error points to detection place, whitespace traps), glossary pass, debug block: call-before-def NameError → reorder, heavier quiz 5 items incl. ch1/ch2/ch3 revisits)
- src/lib/content/registry.ts — added 6 lazy loaders 'py4e.ch4.l1'..'py4e.ch4.l6' (no other platform code touched)
- content/manifest.json — appended 6 entries, order 19–24, prerequisite chain ch3.l6→l1→…→l6, sources = all covered section ids

Anatomy identical to 6-a/6-b: hook → predict → 2–3 concepts (≤150 words/chunk) → worked (runnable) → 2–4 exercises (every lesson ≥1 write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; l6 adds 1 debug block) → sandbox → quiz (4 items, l6 5 items; ≥1 revisits ch1/ch2/ch3 in every quiz) → pitfalls (3 pairs) → summary+reflect → sources. Sources pages from PY4E.toc.json bookPages ("صX / pp.X"). input() never used (tests included); loops not used in graded code (l3 sandbox shows the book's loop as a ch5 preview); no ':' as a fill answer (answers: len, choice, def, return, import — all single unambiguous tokens). Seeded determinism: l3/l6 exercises and the l6 project use random.seed so Pyodide(MT19937)==python3 (verified: seed1→0.13436424411240122, seed2→1,2, seed3→2,5, seed4→'bca', seed1 8×choice→ev64/3cjd).

Verification scripts kept for future content agents:
- scripts/validate-ch4.ts (Zod safeParse + per-lesson exercise-kind mix report)
- scripts/dump-ch4-solutions.ts + scripts/replay-ch4-solutions.py (dump write_code/debug solutions+tests → replay with python3 replicating pyodide-worker __pypath_run_tests semantics)

Verification evidence:
- `bun run lint` → clean (exit 0, no output).
- `bunx tsc --noEmit` → 280 errors repo-wide = exactly the pre-existing baseline; ZERO errors in the 6 new content files, registry.ts, manifest, or the new verification scripts.
- Zod validation: scripts/validate-ch4.ts → "ALL 6 LESSONS VALID" (exercise-kind mix printed; every lesson has write_code + ≥1 pattern kind; l6 debug=1 quizItems=5, others 4).
- Python harness replay: scripts/replay-ch4-solutions.py → 7/7 suites PASS (6 write_code + 1 debug solutions all pass their own tests; seeded outputs 'bca'/0.13436424411240122 confirmed identical to CPython).
- Browser (agent-browser, dev server NOT restarted): /#/ar/lesson/py4e.{ch4.l1..l6} all render correct h1 Arabic titles verbatim, zero "درس غير متوفر" states. Check flow E2E (Pyodide worker ran): ch4.l6 project ex2 with reference solution → "أحسنت! نجحت كل الاختبارات." and the 4 test rows rendered. EN spot-check via header English toggle: ch4.l6 h1 → "Chapter 4 Review and Project: Password Generator", Arabic success message absent after flip.
- dev.log tail after all visits: 200s + compiles only; 0 lines of 404/500; no new error/warn lines (only the pre-existing allowedDevOrigins cross-origin notice from the preview proxy).

Status: 6/6 lessons COMPLETE

---
Task ID: 7-main
Agent: main (Z.ai)
Task: Continue M2 — author PY4E ch4 (Functions) + ch5 (Iteration) via two parallel content agents, register ch5, validate all, update coverage

Work Log:
- Health check: lint clean, tsc = 280 (pre-existing baseline), dev server 200s.
- Extracted PY4E ch4/ch5/ch6 source text from the Arabic PDF → curriculum/sources/PY4E/ch{4,5,6}.txt (script: scripts/extract_ch4_ch6.py, OFFSET=10).
- Task 7-a (parallel agent): authored content/part1/py4e/ch4/lesson.ch4.l1..l6.ts (Functions: calls/built-ins, type conversion/math, random, def+flow, params/fruitful, review+password-generator project) AND registered ch4 in registry.ts + manifest.json (orders 19–24). Verified: Zod ALL VALID, replay 7/7 PASS, browser E2E incl. Pyodide Check success.
- Task 7-b (parallel agent): authored content/part1/py4e/ch5/lesson.ch5.l1..l6.ts (Iteration: while, infinite/continue, for, count/sum patterns, filter/max/min idioms, review+grade-report project). Files only — no registry/manifest edits. Verified: Zod ALL VALID, replay 9/9 PASS.
- Main registration: added 6 ch5 loaders to src/lib/content/registry.ts + 6 manifest entries (orders 25–30, prereq chain ch4.l6→ch5.l1→…→l6). Manifest: 30 lessons, orders sequential, no dup ids.
- Validation: scripts/validate-ch5.ts → ALL 6 LESSONS VALID (exercise mix: every lesson write_code + ≥1 pattern kind; l6 debug=1, quiz=6). bunx tsc --noEmit → 280 (baseline unchanged). bun run check:coverage → report mode OK.
- gen:coverage: PY4E 63/181 sections = 34.8% (was 40 = 22.1%); TOTAL 63/476 = 13.2%.
- Browser E2E (dev server): /#/ar/lesson/py4e.ch5.l1..l6 all render correct h1; ch5.l6 project Check E2E with reference solution → "أحسنت! نجحت كل الاختبارات."; EN toggle → "Chapter 5 Review and Project: Grade Report" with #/en URL; ch4.l1/l6 re-verified post-edit.
- Blank page-error markers investigated: identical on pre-existing ch3.l1 → pre-existing platform quirk (empty-message error events, console clean), NOT a regression.

Stage Summary:
- PY4E ch1–5 fully authored & registered: 30 lessons, all Zod-valid, grader E2E green in AR+EN.
- Coverage: PY4E 34.8% / total 13.2%. Next: ch6 (السلاسل النصية) → ch7–10 to complete Part I foundations; then SWE P3.
- Known notes: (1) ch4.txt/ch5.txt extractions end mid-chapter (visual-order PDF); s12–s14/s7–s9 authored from TOC titles + book structure — flagged for the Arabic proofread pass (M5). (2) Pre-existing blank page-error markers + localStorage-locale behavior unchanged.

---
Task ID: 8-a
Agent: content-author (ch6 strings)
Task: Author 6 lessons (py4e ch6 l1–l6, السلاسل النصية / Strings) AND register them (registry.ts + manifest.json orders 31–36)

Files created:
- content/part1/py4e/ch6/lesson.ch6.l1.ts — المحارف وفهرسة السلاسل (s1+s2: bracket operator, index from 0, fruit[1]→'a' surprise, int-only indices → TypeError, len, fruit[len]→IndexError trap, len-1 and negative indices, 3 roads to the last char)
- content/part1/py4e/ch6/lesson.ch6.l2.ts — المرور على السلاسل والعدّ (s3+s6: traversal definition, while+index loop with index<len condition, for char in string, counting pattern (counter+conditional increment) counting 'a' in banana→3, ch5 recipe tie-in, def count() book-exercise mention)
- content/part1/py4e/ch6/lesson.ch6.l3.ts — تجزئة السلاسل وثباتها (s4+s5: [n:m] includes-n-excludes-m, Monty Python example, defaults [:3]/[3:], first>=second → silent '' empty string, immutability greeting[0]='J' → TypeError, workaround 'J' + greeting[1:] → 'Jello, world!', fruit[:] book-exercise in sandbox)
- content/part1/py4e/ch6/lesson.ch6.l4.ts — العامل in ومقارنة السلاسل (s7+s8: in as boolean substring test vs for..in iteration role, == equality + </> alphabetical ordering (book's banana if/elif/else), uppercase-before-lowercase trap 'Pineapple' < 'banana' → True, lower() normalization)
- content/part1/py4e/ch6/lesson.ch6.l5.ts — توابع السلاسل وتحليلها (s9+s10: strings as objects, type/dir, dot notation word.upper() vs upper(word), find with optional start / silent -1, strip, startswith case-sensitivity, lower + left-to-right chaining line.lower().startswith('h'), parsing recipe find-@ → find-space → slice [atpos+1:sppos] → uct.ac.za from the book's mail log)
- content/part1/py4e/ch6/lesson.ch6.l6.ts — عامل التنسيق ومراجعة الفصل 6 ومشروع: محلّل البريد (s11–s14: % format operator %d/%g + tuple for multiple values + mismatch TypeError, debugging recap (bisect + temporary prints for silent string errors), glossary chunks (index/slice/immutable/object/method/counter/traversal/substring/parsing/format operator), project: email analyzer over FIXED list ['ahmed@example.com','sara@pypath.io','omar@mail.eg','lina@pypath.io'] → find/slice username+domain per email, count=4, pypath_count=2, report lines '%s -> %s' + 'Total: %d' + 'pypath.io: %d'; debug block: off-by-one slice email[at:] keeps @ → fix email[at+1:]; 6-item quiz incl. ch1/ch2/ch3/ch4/ch5 revisits)
- src/lib/content/registry.ts — added 6 lazy loaders 'py4e.ch6.l1'..'py4e.ch6.l6' after ch5 entries; comment updated to ch1–ch6
- content/manifest.json — appended 6 entries, orders 31–36, prereq chain py4e.ch5.l6→l1→…→l6, sources = all covered section ids (s1-s14 distributed per task spec)
- Verification scripts: scripts/validate-ch6.ts, scripts/dump-ch6-solutions.ts + scripts/replay-ch6-solutions.py (adapted from the ch3 pair)

Anatomy identical to 6-a/6-b/7-a/7-b: hook (with embedded objectives) → predict → 2–3 concepts (≤150 words/chunk) → worked (runnable) → 4 exercises each (every lesson: write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; kind mixes: l1 write+trace+mcq+numeric, l2–l5 write+trace+mcq+fill, l6 trace+2×write+mcq+numeric) → sandbox → quiz (4 items ×5 lessons, 6 items in l6; ≥1 earlier-chapter revisit per lesson) → pitfalls (3 pairs each) → summary+reflect → sources. Sources pages from PY4E.toc.json: s1 ص86, s2 ص87, s3 ص88, s4 ص89, s5 ص90, s6 ص90, s7 ص91, s8 ص91, s9 ص92, s10 ص95, s11 ص96, s12 ص97, s13 ص99, s14 ص100 ("صX / pp.X"). input() never used; no randomness in code (one mcq distractor mentions 'عشوائيًا' as a wrong option only). ch6.txt extraction ends mid-s10 (book p.95) — s10 tail–s14 authored from TOC titles + known PY4E ch6 content (format operator, bisect debugging, glossary, exercises), cross-checked with terminology; flagged for the Arabic proofread pass like ch4/ch5 before. fill_blank answers single unambiguous forms ('المرور', 'التعديل', 'in', 'strip'); no ':' answers. trace outputs kept ASCII/short ('h\ni', '2', 'bcd\ncdef', 'True\nFalse', '7\n2.5'). Print-check asserts follow the 'expected: X | actual: %r' convention; grader-visible expected substrings all ASCII ('ahmed -> example.com', 'Total: 4', 'pypath.io: 2').

Verification evidence:
- bun run lint → clean (exit 0).
- bunx tsc --noEmit → 280 errors repo-wide = exactly the pre-existing baseline; ZERO errors in the 6 new content files, registry.ts, manifest.json, or the new scripts. (One mid-task fix: 5 exercise-level mcq 'explanation' fields were schema-unknown keys — folded into hint 4 and removed; count back to 280.)
- Zod validation: scripts/validate-ch6.ts → "ALL 6 LESSONS VALID" (kind mix printed; every lesson write_code + ≥1 pattern kind; l6 debug=1 quizItems=6).
- Python harness replay (replicates public/pyodide-worker.js __pypath_run_tests: stdout→__learner_output__, tests exec'd in learner env): scripts/replay-ch6-solutions.py → 8/8 suites PASS (6 write_code + l6 project + l6 debug all pass their own tests; l6 project stdout: ahmed -> example.com / sara -> pypath.io / omar -> mail.eg / lina -> pypath.io / Total: 4 / pypath.io: 2).
- Extra rigor: every trace_output exercise's shown code executed under python3 and whitespace-normalized-compared to its answer → 6/6 match; all mcq answer==solution checked; numeric answers (6, 4) verified by actual computation.
- Browser E2E (agent-browser, dev server NOT restarted): /#/ar/lesson/py4e.{ch6.l1..l6} all render correct Arabic h1 titles verbatim, zero "درس غير متوفر" states. Check flow E2E (Pyodide worker ran): ch6.l6 project ex5 with reference solution → "أحسنت! نجحت كل الاختبارات." EN toggle spot-check: ch6.l6 h1 → "The Format Operator, Chapter 6 Review, and Project: Email Analyzer".
- dev.log tail after all visits: 200s + compiles only; zero new error/warn/404/500 lines (only the pre-existing allowedDevOrigins cross-origin notice).

Notes / friction observed (for future agents):
- Schema gotcha that bit me: the exercise block REQUIRES solution + exactly-4 hints even for mcq/trace/fill/numeric kinds, and does NOT accept an 'explanation' key at exercise level (explanation exists only on quiz items and worked blocks) — Zod silently strips unknown keys but tsc flags them under satisfies Lesson. Validate with BOTH before finishing.
- The grader-visible expected/actual strings should stay ASCII even in Arabic lessons: Arabic strings live fine in code/prompts, but test messages assert on ASCII substrings so parseExpectedActual rows render cleanly under bidi.
- Parallel agent 8-b (ch7) was mentioned as working on files but registry.ts/manifest.json were owned by this task; no conflicts observed during edits.
- ch6 source extraction (curriculum/sources/PY4E/ch6.txt) ends mid-s10 at book p.95: the uct.ac.za parsing example IS present and was used verbatim (atpos 21, sppos 31); s11–s14 authored from structure as noted.

Status: 6/6 lessons COMPLETE

---
Task ID: 8-b
Agent: content-author (ch7 files)
Task: Author 6 lesson FILES (py4e ch7 l1–l6, الملفات / Files) — no registration (main agent owns registry.ts + manifest.json)

Files created (content only; registry.ts and manifest.json NOT touched — git shows their mods belong to the parallel ch6 task):
- content/part1/py4e/ch7/lesson.ch7.l1.ts — فتح الملفات (s1+s2: الإصرار/secondary memory vs main RAM, open() → file handle not data, 'r' default mode, FileNotFoundError preview, \n as the one-character line splitter; predict prints the handle; worked: create mbox.txt in memory then open+read)
- content/part1/py4e/ch7/lesson.ch7.l2.ts — قراءة الملفات (s3+s4: newline len('X\nY')==3, read() slurps all into one string + second read returns '', for line in fhand line-by-line counting, why open doesn't read huge files; worked: 39 chars / 3 lines both ways)
- content/part1/py4e/ch7/lesson.ch7.l3.ts — البحث خلال ملف (s5: startswith filter, continue skip pattern, rstrip for the doubled-blank-line mystery, find(':')+slice pos+2, try/float guard; book's spam-confidence averaging adapted to self-created spamconf.txt → count: 2, average: 0.73265)
- content/part1/py4e/ch7/lesson.ch7.l4.ts — اختيار الملف ومعالجة الأخطاء (s6+s7: simulated `typed` filename (no input()), Subject-line counter program on a chosen file, FileNotFoundError traceback, try/except + 'File cannot be opened:' + exit() taught-but-not-run (worker harness reports SystemExit as error) → platform-safe None-flag stand-in from ch5.l5; ex4 loops ['good.txt','missing.txt'] with try/except/continue)
- content/part1/py4e/ch7/lesson.ch7.l5.ts — كتابة الملفات (s8: 'w' TRUNCATES at open, write() fruitful → char counts, no free newline vs print, buffer + close/flush, write→close→re-read verification cycle incl. truncation demo 21+19=40)
- content/part1/py4e/ch7/lesson.ch7.l6.ts — مراجعة الفصل 7 ومشروع: دفتر الملفات (s9 التنقيح: wrong-name/missing-close/'w'-reopen trio + golden cycle; s10 glossary AR/EN; s11 exercises; PROJECT file notebook: write notes list → close → guarded reopen → count lines/chars/'files' keyword hits → % -formatted report 'lines: 4 / chars: 48 / keyword hits: 2' tying ch6 format operator + ch5 loops + ch3 try/except; debug block: second 'w' reopen wipes → chars: 0 fix → chars: 23; heavier quiz 6 items revisiting ch1–ch5)
- Verification scripts: scripts/validate-ch7.ts, scripts/dump-ch7-solutions.ts, scripts/replay-ch7-solutions.py (tempdir MEMFS stand-in), plus extra scripts/dump-ch7-checks.ts + scripts/replay-ch7-checks.py (traces executed under python3, runnables crash-check, mcq answer==solution, fill ':'-free single tokens, brokenCode must run+show symptom)

Anatomy per master spec §6.1 (identical to 6-a/6-b/7-b): hook (objectives embedded) → predict → 3 concepts (≤150 words/chunk, AR+EN) → worked → 4 exercises (every lesson ≥1 write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; kind mixes: l1 write+trace+mcq+fill, l2 write+trace+numeric+mcq, l3 write+trace+mcq+fill, l4 2×write+trace+mcq, l5 write+trace+mcq+fill, l6 trace+write+mcq+numeric) → sandbox → quiz (4 items ×5 lessons, 6 in l6; ≥1 earlier-chapter revisit per lesson: ch1/ch5/ch3+ch6/ch3+ch2/ch4/ch1–ch5) → pitfalls (3 pairs each) → summary+reflect → sources. Sources ص102/ص103, ص104/ص105, ص107, ص110+ص111, ص113, ص114+ص115+ص116 ("صX / pp.X", section ids py4e.ch7.s1–s11 from PY4E.toc.json). prerequisites: l1→["py4e.ch6.l6"], then chained l2..l6. Determinism: every file exercise self-creates its file ('w' first) with per-exercise names (mbox-l1.txt, notes-l2.txt, spamconf.txt, inbox.txt/good.txt+missing.txt, letter.txt/abc.txt, notebook.txt/mybook.txt/tinybook.txt); no random anywhere; input() never executable (only prose/comments per ch2.l5 precedent); no exit() executed anywhere (taught as book pattern, platform caveat documented in-lesson); fill answers single ':'-free tokens (open/rstrip/close); trace answers ASCII short lines; test messages follow 'expected: X | actual: %r' convention.

Verification evidence:
- Zod: bun run scripts/validate-ch7.ts → "ALL 6 LESSONS VALID" (kind mix + debug=1 + quizItems=6 printed per lesson).
- Harness replay: bun run scripts/dump-ch7-solutions.ts → 8 suites (7 write_code + 1 debug); python3 scripts/replay-ch7-solutions.py → 8/8 PASS (CPython file I/O in a fresh tempdir replicating Pyodide MEMFS single-run semantics; l3 prints count: 2 / average: 0.73265, l6 project prints lines: 4 / chars: 48 / keyword hits: 2).
- Extra cross-check: scripts/replay-ch7-checks.py → ALL CHECKS PASS (6/6 traces whitespace-matched against CPython stdout, 18/18 predict/worked/sandbox snippets run crash-free, 6/6 mcq answer==solution, 3/3 fills single ':'-free tokens, broken debug code runs and shows the symptom chars: 0). One self-inflicted fix during authoring: l5 trace answer 8 → 7 ('AB\n'+'CDE\n' = 7 chars).
- `bun run lint` → clean (exit 0).
- `bunx tsc --noEmit` → 280 errors repo-wide = exactly the pre-existing baseline; ZERO errors in the 6 new content files or the 5 new scripts.
- Manual file-exercise E2E-style check (l6 ex2.file-notebook) under CPython with worker semantics: stdout 'lines: 4\nchars: 48\nkeyword hits: 2\n', 5/5 tests PASS, notebook.txt on disk mirrors the notes list — browser E2E left to main agent at registration.
- Registry check not possible (parallel agent 8-a owned registry.ts/manifest.json and was live during this task); tsconfig include covers the new files — confirmed via tsc. git status: ch7 dir + ch7 scripts are my only additions.

Status: 6/6 lesson FILES COMPLETE (awaiting registration)

---
Task ID: 8-main
Agent: main (Z.ai)
Task: Continue M2 — PY4E ch6 (Strings) + ch7 (Files) via two parallel content agents; register ch7; validate; E2E

Work Log:
- Health: dev server 200s. Extracted PY4E ch7 text (scripts/extract_ch4_ch6.py now parameterized: `python3 scripts/extract_ch4_ch6.py 7`).
- Task 8-a (parallel agent): authored ch6 l1–l6 (characters/indexing, traversal+counting, slicing+immutability, in+comparison, methods+parsing, %-format + email-analyzer project) AND registered ch6 (registry + manifest orders 31–36). Zod ALL VALID; replay 8/8; browser E2E green incl. Pyodide Check + EN toggle. Gotcha logged: exercise blocks require solution + exactly 4 hints, no `explanation` key (schema-unknown).
- Task 8-b (parallel agent): authored ch7 l1–l6 (opening, reading, searching, choosing+try/except, writing, review + file-notebook project) — files only. Zod ALL VALID; replay 8/8; extra cross-check script for trace/predict/worked snippets. Note: book's exit() raises SystemExit in harness → taught in concept text, replaced by None-flag idiom in runnable code (documented in-lesson).
- Main registration: 6 ch7 loaders in registry.ts + 6 manifest entries (orders 37–42, chain ch6.l6→ch7.l1→…→l6). Manifest: 42 lessons, sequential, no dup ids.
- Validation: Zod ch7 ALL VALID; tsc = 280 (baseline unchanged); check:coverage report-mode OK; gen:coverage → PY4E 88/181 = 48.6% (was 34.8%); TOTAL 88/476 = 18.5%.
- Browser E2E: ch7.l1–l6 render correct AR h1; ch7.l6 file-notebook project Check E2E with reference solution → "أحسنت! نجحت كل الاختبارات." — proves Pyodide MEMFS file I/O works end-to-end in the grader. ch6.l1/l6 re-verified post-edit. dev.log clean.
- E2E friction (test-harness, not content): first fill inserted REAL newlines inside Python string literals → SyntaxError (expectedly). Fix: fill via file with literal \n escapes (scripts/e2e-notebook-solution.py kept as the E2E recipe for file exercises).

Stage Summary:
- PY4E ch1–7 complete: 42 lessons published, all Zod-valid, grader E2E green AR+EN, file-based lessons verified in the real worker.
- Coverage: PY4E 48.6% / total 18.5%. Next: ch8 (القوائم/lists) → ch9 (القواميس/dicts) → ch10 (المجموعات/tuples) to complete P1 Foundations, then ch11–16.

---
Task ID: 9-a
Agent: content-author (ch8 lists)
Task: Author 6 lessons (py4e ch8 l1–l6, القوائم / Lists) AND register them (registry.ts + manifest.json orders 43–48)

Files created:
- content/part1/py4e/ch8/lesson.ch8.l1.ts — القائمة سلسلة من العناصر (s1+s2: list in [] of any-type elements incl. nested counted as one, empty list, bracket indexing = string rules (0-based, IndexError, negative), len, mutability: numbers[1]=5 works vs ch6 greeting[0]='J' TypeError)
- content/part1/py4e/ch8/lesson.ch8.l2.ts — المرور على القوائم والعمليات والتجزئة (s3+s4+s5: for cheese in cheeses reads / for i in range(len(t)) updates in place; + concatenation new list, * repetition, in membership; slices [1:3]/[:4]/[3:]/[:] full copy, slice assignment t[1:3]=['x','y'])
- content/part1/py4e/ch8/lesson.ch8.l3.ts — توابع القوائم وحذف العناصر (s6+s7: append one, extend vs +, sort in place; predict shows t.sort() returning None; worked contrasts word.upper() (new string, original untouched) vs t.sort()/append/remove (in place, None); deletion four roads: pop(i) returns element, pop() last, del t[i], remove(value)→None, del t[1:5] range)
- content/part1/py4e/ch8/lesson.ch8.l4.ts — القوائم مع التوابع والسلاسل (s8+s9: len/max/min/sum loop-killers + the ch5 average program rewritten loop-free over a fixed list (no input()); lists passed as references — book's delete_head(t) del t[0] modifies caller; list('spam')→chars, split()→words, split('-') delimiter, join inverse; worked ends with the From line: words[2]='Sat')
- content/part1/py4e/ch8/lesson.ch8.l5.ts — الأسطر والملفات والكائنات والإحالات (s10–s13: parse lines with split, empty line → [] → IndexError → guardian pattern len(words)<1: continue, double split words[5].split(':') → hour; objects vs values, equivalent vs identical, is; aliasing b=a then b[0]=99 shows in a, copy via [:]; list arguments: delete_head reaches caller, bad_delete_head t=t[1:] does not, tail(t) returns; file lines simulated with a fixed list for determinism)
- content/part1/py4e/ch8/lesson.ch8.l6.ts — مراجعة الفصل 8 ومشروع: منظّم الكلمات (s14–s16: 4 debug tricks (void methods return None, pick an idiom — the book's WRONG list append([x])/t.append(x)/t+[x]/t+x, copy to avoid aliasing orig=t[:] or sorted, guardian after split), AR/EN glossary (2 chunks), PROJECT word organizer: fixed sentence → split → w.strip('.,').lower() append to clean → clean.sort() → unique list via 'w not in unique' in-check → 4 %-formatted report lines 'words: N/unique: N/first: X/last: Y' (worked uses one sentence, exercise another — words: 11, unique: 8, first: and, last: skills; ties ch5 loops + ch6 format/comparison/lower + ch8 lists); middle(t) book exercise as 2nd write_code; debug block: aliasing bug backup=original then sort → fix backup=original[:]; 6-item quiz revisiting ch2/ch4/ch5/ch6/ch7 + 2 ch8 core)
- src/lib/content/registry.ts — added 6 lazy loaders 'py4e.ch8.l1'..'py4e.ch8.l6' after ch7 entries; comment updated to ch1–ch8
- content/manifest.json — appended 6 entries, orders 43–48, prereq chain py4e.ch7.l6→ch8.l1→…→l6, sources = all covered section ids (s1–s16 distributed per task spec, pages from the given TOC ص119…ص139)
- Verification scripts: scripts/validate-ch8.ts, scripts/dump-ch8-solutions.ts + scripts/replay-ch8-solutions.py, scripts/dump-ch8-checks.ts + scripts/replay-ch8-checks.py (both replay pairs kept from ch7: tempdir CWD, worker-semantics exec)

Anatomy per master spec (identical to 6-a/6-b/7-a/7-b/8-a/8-b): hook (objectives embedded) → predict → 2–3 concepts (≤150 words/chunk, AR+EN) → worked (runnable) → exercises (every lesson ≥1 write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; kind mixes: l1 write+trace+mcq+numeric, l2 write+trace+mcq+fill, l3 write+trace+mcq+fill, l4 write+trace+mcq+fill, l5 write+trace+mcq+fill, l6 trace+2×write+mcq+numeric) → sandbox → quiz (4 items ×5 lessons, 6 in l6; ≥1 earlier-chapter revisit per lesson: ch6+ch2/ch5+ch6/ch4+ch6/ch4+ch7+ch6/ch6+ch7/ch2+ch4+ch5+ch6+ch7) → pitfalls (3 pairs each) → summary+reflect → sources. Every exercise has solution + exactly 4 hints (nudge→concept→skeleton→solution); NO 'explanation' key at exercise level (schema gotcha respected from Task 8-a). Determinism: no input(), no random anywhere; book's input()-based average program adapted to a fixed list; file lines in l5 simulated with a fixed list. trace_output answers kept ASCII + scalar-only (no list-repr exact typing): 'x\nz\n3', '2\nb\nTrue\nFalse', 'b\n3\na', '4\ns\nthe', '99\nTrue', '3\n1\n5'. fill answers single ':'-free tokens (*, remove, split, is). Print-check asserts follow the 'expected: X | actual: %r' convention; grader-visible expected substrings ASCII ('[2, 4, 6]', 'count: 6', 'total: 154', 'average: 25.6667', 'Sat', 'Mon', 'words: 11', 'unique: 8', 'first: and', 'last: skills').

Verification evidence:
- Zod validation: bun run scripts/validate-ch8.ts → "ALL 6 LESSONS VALID" (kind mix + debug=1 + quizItems=6 printed per lesson).
- Harness replay: bun run scripts/dump-ch8-solutions.ts → 8 suites (6 write_code + l6 project + l6 debug); python3 scripts/replay-ch8-solutions.py → 8/8 PASS (l6 project stdout: words: 11 / unique: 8 / first: and / last: skills; l4 average stdout: count: 6 / total: 154 / average: 25.6667 — %g verified identical CPython/Pyodide).
- Extra cross-check: scripts/replay-ch8-checks.py → ALL CHECKS PASS (6/6 traces whitespace-matched against CPython stdout, 18/18 predict/worked/sandbox snippets run crash-free, 6/6 mcq answer==solution, 4/4 fills single ':'-free tokens, broken debug code runs and shows the aliasing symptom 'original: [' + "['apple', 'banana', 'cherry']").
- bun run lint → clean (exit 0).
- bunx tsc --noEmit → 280 errors repo-wide = exactly the pre-existing baseline; ZERO errors in the 6 new content files, registry.ts, manifest.json, or the 5 new scripts (grep 'ch8' in tsc output → empty).
- Manifest sanity: 48 lessons, dup ids 0, orders strictly sequential 1–48, ch8 = 43..48, prereq chain intact.
- Browser E2E (agent-browser, dev server NOT restarted): /#/ar/lesson/py4e.{ch8.l1..l6} all render correct Arabic h1 titles verbatim, zero "درس غير متوفر" states. Check flow E2E (Pyodide worker ran): ch8.l6 project ex2 filled from file (/tmp recipe per e2e-notebook-solution.py note) → "أحسنت! نجحت كل الاختبارات." + all 4 test rows + stdout 'words: 11' rendered. EN toggle: header English button → h1 "Chapter 8 Review and Project: Word Organizer", URL /#/en/, Arabic success message absent.
- dev.log tail after all visits: 200s + compiles only; 0 lines of 404/500; no new error/warn lines (pre-existing allowedDevOrigins notice + the known pre-existing blank page-error markers only).

Notes / friction observed (for future agents):
- ch8 source extraction (curriculum/sources/PY4E/ch8.txt) starts with the tail of ch7 (extraction offset) and ends mid-s14 at book p.136 (Debug: [] — the guardian reveal line is cut). s10–s16 authored from TOC titles + known PY4E ch8 content (guardian len-check, double-split hour, aliasing, list args, debug tricks, glossary, chop/middle exercises), cross-checked with extracted s1–s13 text and terminology — flagged for the Arabic proofread pass like ch4/ch5 before.
- Book pages in TOC are BOOK pages (ص119 = PDF p.125; the extraction's "صفحة الكتاب 125" header shows 119 inside) — page strings use the given TOC numbers verbatim (ص119…ص139).
- Parallel agents 9-b/9-c (ch9 dicts / ch10 tuples) were authoring content/part1/py4e/ch9 + ch10 dirs during this task; registry.ts/manifest.json owned by this task only — no conflicts (ch9/ch10 not registered yet, as intended).

Status: 6/6 lessons COMPLETE

---
Task ID: 9-b
Agent: content-author (ch9 dictionaries)
Task: Author 6 lesson FILES (py4e ch9 l1–l6, القواميس / Dictionaries) — no registration (main agent owns registry.ts + manifest.json)

Files created (content only; registry.ts and manifest.json NOT touched — git shows their mods belong to the parallel ch8/ch10 tasks; grep confirms zero 'ch9' occurrences in either):
- content/part1/py4e/ch9/lesson.ch9.l1.ts — القاموس: المفاتيح والقيم (s1 ص143: dict vs list, key-value pair=item, dict()/{} creation + don't-name-it-dict warning, [] add/read, eng2sp translation worked example, order-not-a-contract note (modern Python prints insertion order — golden rule: never rely on it), KeyError: 'four', len counts pairs, in keys-only + values() workaround, hash-table one-liner, DNA codon dict {'ATA':'Isoleucine'} as the general-translator flavor)
- content/part1/py4e/ch9/lesson.ch9.l2.ts — العدّ بالقواميس (s2 ص145: counting problem + 3 implementations (26 vars/ord-list/dict), implementation concept, brontosaurus if-not-in/else histogram, histogram term, get(key,default) counts.get('jan',0)=100 counts.get('tim',0)=0, 4-lines→1 idiom d[c]=d.get(c,0)+1)
- content/part1/py4e/ch9/lesson.ch9.l3.ts — القواميس والملفات: عدّ الكلمات (s3 ص147: split recap via predict, nested loops outer-lines/inner-words + inner-runs-fully-per-outer, += shorthand + -=/*=//=, book's try/except+exit() taught-not-run (ch7.l4 precedent), worked = full romeo.txt counter (SELF-CONTAINED 'w' creation → 33 words / 26 unique, is/and/the ×3 sun ×2) with if-not-in/else)
- content/part1/py4e/ch9/lesson.ch9.l4.ts — الحلقات على القواميس (s4 ص149: for key in dict + counts[key], print(key, counts[key]) comma, >10 filter pattern, keys()+sort() alphabetical pairs + sorted(counts) mention (prose only), values() sum via accumulator + average with round (143/3→47.67), worked = filter+total+average report)
- content/part1/py4e/ch9/lesson.ch9.l5.ts — معالجة النصوص: الحروف الصغيرة وعلامات الترقيم (s5 ص150: soft!/soft + Who/who corruption, lower from ch6, translate(str.maketrans(fromstr,tostr,deletestr)) deletion-table description from the book, import string + string.punctuation, order translate→lower→split→count, worked = full romeo-full.txt program (sun 2 / is 3 / 26 unique))
- content/part1/py4e/ch9/lesson.ch9.l6.ts — مراجعة الفصل 9 ومشروع: عدّاد الكلمات (s6 التنقيح ص152: scale-down-input / check-summaries / sanity-checks + chapter's 2 ailments; s7 فهرس المصطلحات ص153: dictionary/key/value/item/lookup/histogram/implementation/hash-table/nested-loops in 2 chunks; s8 تمارين ص154; PROJECT word counter = SELF-CONTAINED: write story-l6.txt with 'w' → close → read → translate+lower per line → count with get → print 'unique words: %d' % len(counts) → max-by-value loop with None flag → 'top word: %s (%d)' — no sorted()-on-tuples (ch10); debug block ex5: missing-else double-count (runs, symptom 3/2, fix → 2/1); 6-item quiz incl. ch1/ch2/ch3/ch5/ch7 revisits)
- Verification scripts: scripts/validate-ch9.ts, scripts/dump-ch9-solutions.ts + scripts/replay-ch9-solutions.py (tempdir MEMFS stand-in), plus extra scripts/dump-ch9-checks.ts + scripts/replay-ch9-checks.py (traces whitespace-matched vs CPython, runnables crash-check, mcq answer==solution, fills ':'-free single tokens, brokenCode runs+shows symptom)

Anatomy per master spec (identical to 6-a/6-b/7-a/7-b/8-a/8-b): hook (objectives embedded) → predict → 3 concepts (≤150 words/chunk, AR+EN) → worked (runnable) → 4 exercises (every lesson: write_code with assert tests + ≥1 pattern kind; mixes: l1 write+trace+mcq+fill, l2 write+trace+mcq+numeric, l3 write+trace+mcq+fill, l4 write+trace+mcq+fill, l5 write+trace+mcq+fill, l6 trace+write(project)+mcq+numeric + debug block) → sandbox → quiz (4 items ×5 lessons, 6 in l6; ≥1 earlier-chapter revisit per lesson: ch5+ch3 / ch6+ch2 / ch7+ch5 / ch8+ch2 / ch6+ch7 / ch1–ch5+ch7) → pitfalls (3 pairs each) → summary+reflect → sources. Sources pages from PY4E.toc.json: s1 ص143, s2 ص145, s3 ص147, s4 ص149, s5 ص150, s6 ص152, s7 ص153, s8 ص154 ("صX / pp.X", section ids py4e.ch9.s1–s8). prerequisites: l1→["py4e.ch8.l6"], then chained l2..l6. Determinism: no input() anywhere, no random anywhere; exit() mentioned in prose only (l3, taught-not-run per ch7.l4 precedent); every file exercise/worked SELF-CREATES its file with 'w' first (romeo.txt, words-l3.txt, romeo-full.txt, poem-l6.txt, story-l6.txt) — Pyodide MEMFS pattern verified in replay via CPython tempdir; no sorted() in graded code (sorted(counts) prose mention only; l6 max-by-value None-flag loop instead); fill answers single ':'-free tokens (dict/split/keys/translate); trace answers ASCII short lines ('2\n2\nTrue\nFalse', 'hi, there!\nHi There\nhi there', "5\n['x', 'y']"); test messages follow 'expected: X | actual: %r' convention; DNA-translation flavor included in l1 per task spec (codon→amino-acid dict + eng2sp from the Arabic source text).
- Source-text note: curriculum/sources/PY4E/ch9.txt ends mid-s5 (book p.150, at the maketrans description) — s6/s7/s8 authored from TOC titles + known PY4E ch9 content (debugging suggestions, glossary terms, exercises), cross-checked with terminology; flagged for the Arabic proofread pass like ch4–ch7 before. Book's Python-2 dict print order handled honestly: worked explanations state modern Python prints insertion order while the never-rely-on-order rule stands.

Verification evidence:
- Zod validation: bun run scripts/validate-ch9.ts → "ALL 6 LESSONS VALID" (kind mix + debug=1 + quizItems=6 for l6 printed per lesson).
- Harness replay: bun run scripts/dump-ch9-solutions.ts → 7 suites (6 write_code + 1 debug); python3 scripts/replay-ch9-solutions.py (chdir tempdir) → 7/7 PASS (l3 prints 2/4, l6 project prints unique words: 7 / top word: sun (4), debug fix prints 2/1).
- Extra cross-check: scripts/replay-ch9-checks.py → ALL CHECKS PASS (6/6 traces whitespace-matched against CPython stdout, 18/18 predict/worked/sandbox snippets run crash-free, 6/6 mcq answer==solution, 4/4 fills single ':'-free tokens, broken debug code runs and shows the symptom 3/2).
- Claimed worked-example numbers verified under CPython: l2 len(d)=8; l3 33 words/26 unique; l4 total 143/average 47.67; l5 sun 2/is 3/26 unique; l6 8 unique/top love (4).
- `bun run lint` → clean (exit 0).
- `bunx tsc --noEmit` → 280 errors repo-wide = exactly the pre-existing baseline (270 in src/lib/i18n/en.ts + 10 known); ZERO errors in the 6 new ch9 content files or the 5 new ch9 scripts.
- Registry check not possible (parallel agents own registry.ts/manifest.json; ch8 + ch10 agents were live during this task); grep confirms zero 'ch9' in registry.ts/manifest.json — registration readiness confirmed, browser/E2E testing left to the main agent at registration time.

Status: 6/6 lesson FILES COMPLETE (awaiting registration)

---
Task ID: 9-c
Agent: content-author (ch10 tuples)
Task: Author 6 lesson FILES (py4e ch10 l1–l6, الصفوف / Tuples) — no registration (main agent owns registry.ts + manifest.json)

Files created (content only; registry.ts and manifest.json NOT touched — git shows their mods belong to the parallel ch8/ch9 tasks):
- content/part1/py4e/ch10/lesson.ch10.l1.ts — الصفوف غير قابلة للتعديل (s1: tuple syntax, parens-optional/comma-required, empty tuple(), tuple('lupins'), indexing/slicing like ch6 strings, SINGLE-ELEMENT TRAP ('a',) vs ('a')→str, immutability TypeError 'tuple' object does not support item assignment + rebuild ('A',)+t[1:], tuples vs lists, comparable+hashable preview; predict type(t1)==type(t2)→False)
- content/part1/py4e/ch10/lesson.ch10.l2.ts — مقارنة الصفوف وترتيبها (s2: element-by-element comparison stops at first difference (0,1,2000000)<(0,3,4)→True, sort() same rule + reverse=True, DSU pattern (Decorate/Sort/Undecorate), book's soft.py verbatim output ['yonder','window','breaks','light','what','soft','but','in'], ties broken alphabetically descending)
- content/part1/py4e/ch10/lesson.ch10.l3.ts — إسناد الصفوف (s3: (x,y)=(1,2), parens optional both sides, right side evaluated first → a,b=b,a swap + a,b=a,b trap, any sequence unpacks x,y=m, uname,domain=addr.split('@') with monty@python.org, right-size law a,b=1,2,3→ValueError: too many values to unpack)
- content/part1/py4e/ch10/lesson.ch10.l4.ts — القواميس والصفوف (s4+s5: list(d.items()) → list of (key,value) tuples, t.sort() orders by key, for key, val in d.items() two-iteration-variable golden pattern (insertion-order deterministic), for val,key swap trap, for k,v in d (no items) trap, d.items() view needs list() before .sort() (AttributeError), inverted (val,key) decorate + sort(reverse=True) → rank by value)
- content/part1/py4e/ch10/lesson.ch10.l5.ts — الكلمات الأكثر تكرارًا (s6+s7: famous program miniature — self-created romeo.txt ('w') + ch9 pipeline translate/lower/split/get + (count,word) decorate + sort(reverse=True) + top-5 print(count, word) → 3 the / 3 is / 3 and / 2 sun / 1 yonder; book's count3.py output quoted (61 i, 42 and, 40 romeo, 34 to/34 the); s7 conceptual: tuples as dict keys, directory['Cleese','John'] + coordinates points[(0,0)]/'origin', lists throw TypeError: unhashable type: 'list')
- content/part1/py4e/ch10/lesson.ch10.l6.ts — مراجعة الفصل 10 ومشروع: لوحة صدارة الكلمات (s8 sequences family + conversion trio tuple('abc')/list((1,2,3))/str + type-is-identity t==l→False; s9 debugging reduce-input/print-summaries/logical-self-checks + silent wrong-side sort as deadliest fault; s10 glossary chunks (tuple, singleton, item, sequence, data structure, comparable, hashable, tuple assignment, slice); PROJECT word leaderboard: text → wordboard.txt ('w') → close → read+translate+lower+split+get → (count,word) decorate → sort(reverse=True) → top-3 → rank counter + '%d. %s: %d' → 1. the: 4 / 2. loves: 3 / 3. romeo: 2 (tie romeo/night/juliet/and@2 broken alphabetically); debug block: sorting counts.items() directly → alphabet board with watch: 1 first (silent symptom) → fix via DSU decorate; heavier quiz 6 items revisiting ch1/ch2/ch3/ch4/ch5/ch7)
- Verification scripts: scripts/validate-ch10.ts, scripts/dump-ch10-solutions.ts + scripts/replay-ch10-solutions.py, plus extra scripts/dump-ch10-checks.ts + scripts/replay-ch10-checks.py (traces executed under python3, runnables crash-check, mcq answer==solution, fill ':'-free single tokens, brokenCode must run+show symptom)

Anatomy identical to 8-a/8-b master pattern: hook (objectives embedded) → predict → 2-3 concepts (≤150 words/chunk, AR+EN) → worked (runnable) → 4 exercises l1–l5 (+1 debug in l6) (every lesson ≥1 write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; kind mixes: l1 write+trace+mcq+fill, l2 write+trace+mcq+numeric, l3 write+trace+mcq+fill, l4 write+trace+mcq+fill, l5 write+trace+mcq+numeric, l6 trace+write+mcq+numeric) → sandbox → quiz (4 items ×5 lessons, 6 in l6; ≥1 earlier-chapter revisit per lesson: ch6+ch9/ch6+ch5/ch3+ch7/ch9+ch2/ch9+ch7+ch6/ch1-ch5+ch7) → pitfalls (3 pairs each) → summary+reflect → sources. Sources per PY4E.toc.json: s1 ص157, s2 ص159, s3 ص160, s4 ص162+s5 ص163, s6 ص164+s7 ص166, s8 ص166+s9 ص167+s10 ص167+s11 ص168 ("صX / pp.X", section ids py4e.ch10.s1–s11). prerequisites: l1→["py4e.ch9.l6"], then chained l2←l1 … l6←l5. Determinism: no input() (one prose mention), no random (one mcq distractor mentions عشوائيًا as a wrong option), no exit(); l5/l6 file exercises self-create their files (romeo.txt, wordboard.txt) with 'w' first; dict iteration relies on documented insertion order; trace answers ASCII short lines; test messages follow the 'expected: X | actual: %r' convention with ASCII grader-visible substrings; fill answers single ':'-free tokens (tuple/split/reverse).

Verification evidence:
- Zod: bun run scripts/validate-ch10.ts → "ALL 6 LESSONS VALID" (kind mix printed; every lesson write_code + ≥1 pattern kind; l6 debug=1 quizItems=6).
- Harness replay (replicates public/pyodide-worker.js __pypath_run_tests; CPython + chdir tempdir for MEMFS semantics): bun run scripts/dump-ch10-solutions.ts → 7 suites (6 write_code + l6 debug); python3 scripts/replay-ch10-solutions.py → 7/7 PASS (l6 project + debug stdout: 1. the: 4 / 2. loves: 3 / 3. romeo: 2).
- Extra cross-check: bun run scripts/dump-ch10-checks.ts + python3 scripts/replay-ch10-checks.py → ALL CHECKS PASS (6/6 traces whitespace-matched against CPython stdout, 18/18 predict/worked/sandbox snippets run crash-free, 6/6 mcq answer==solution, 3/3 fills single ':'-free tokens, broken debug code runs and shows the symptom '1. watch: 1' first place with count 1).
- Ad-hoc CPython spot-checks: l2 worked reproduces the book's soft.py output exactly; l5/l6 predict outputs and l6 project leaderboard verified against computed values (wordboard text: 18 words, 9 distinct, the=4/loves=3/romeo=2 top-3 after alphabetical tie-break).
- bun run lint → clean (exit 0).
- bunx tsc --noEmit → 280 errors repo-wide = exactly the pre-existing baseline; ZERO errors in the 6 new content files or the 5 new scripts (grep ch10 = 0).
- Registry check NOT possible (parallel ch8/ch9 agents own registry.ts/manifest.json); tsconfig covers the new files via tsc. git status: ch10 dir + ch10 scripts are my only additions. Two self-inflicted fixes during verification: l2 expected (7,'yonder')→(6,'yonder') (yonder is 6 letters), l5 worked explanation fifth place fair→yonder (fair counts 1 in the shorter lesson text).

Notes for the main agent (registration):
- Sources distribute as: l1=[s1], l2=[s2], l3=[s3], l4=[s4,s5], l5=[s6,s7], l6=[s8,s9,s10,s11] — all 11 sections covered exactly once.
- Prereq chain ready: py4e.ch9.l6 → ch10.l1 → … → ch10.l6.
- curriculum/sources/PY4E/ch10.txt ends at s6 (book p.165): s7–s11 authored from PY4E.toc.json titles + known PY4E ch10 content (tuples-as-keys, sequences, debugging, glossary, exercises), cross-checked with terminology — flagged for the Arabic proofread pass like ch4/5/6/7 before.

Status: 6/6 lesson FILES COMPLETE (awaiting registration)

---
Task ID: 9-main
Agent: main (Z.ai)
Task: Continue M2 — PY4E ch8 (Lists) + ch9 (Dictionaries) + ch10 (Tuples) via three parallel agents; register ch9+ch10; validate; E2E — P1 Foundations complete

Work Log:
- Extracted PY4E ch8/ch9/ch10 source text (parameterized script). Section maps confirmed from TOC.
- Task 9-a (parallel): authored ch8 l1–l6 (list basics/mutability, traversal+ops+slicing, methods+deletion, lists+functions+strings, lines/files/objects/aliasing/list-args, review + word-organizer project) AND registered ch8 (registry + manifest orders 43–48). Zod ALL VALID; replay 8/8 + cross-checks; browser E2E green incl. Check success + EN toggle.
- Task 9-b (parallel): authored ch9 l1–l6 (dict basics, counting/get, dict+file word counting, looping dicts, text processing translate/punctuation, review + word-counter project). Files only. Zod ALL VALID; replay 7/7; cross-checks pass.
- Task 9-c (parallel): authored ch10 l1–l6 (tuple immutability + single-element trap, comparison/DSU sort, tuple assignment/unpack, dict items + inversion, most-common-words program, review + word-leaderboard project). Files only. Zod ALL VALID; replay 7/7; cross-checks pass. Used book-correct DSU ((count, word) sort reverse).
- Main registration: 12 loaders (ch9+ch10) + 12 manifest entries (orders 49–54, 55–60; chains ch8.l6→ch9…→ch10). Manifest: 60 lessons, orders sequential, no dup ids.
- Validation: Zod ch9/ch10 ALL VALID; tsc = 280 (baseline unchanged); gen:coverage → PY4E 123/181 = 68.0% (was 48.6%); TOTAL 123/476 = 25.8%.
- Browser E2E: ch9.l1–l6 + ch10.l1–l6 all render correct AR h1; ch10.l6 leaderboard project Check E2E → "أحسنت! نجحت كل الاختبارات." (self-contained file + DSU sort in real Pyodide). EN-by-hash renders AR — pre-existing localStorage-locale quirk (documented), in-app toggle unaffected. dev.log clean.

Stage Summary:
- **P1 Foundations COMPLETE**: PY4E ch1–10 fully authored = 60 lessons published, all Zod-valid, grader E2E green AR(+EN toggle), file I/O verified in grader.
- Coverage: PY4E 68.0% / total 25.8%. Next: ch11–16 (regex, networking, web services, OOP, SQL, visualization) to finish PY4E → M2 gate PY4E side; then SWE P3 + Capstone I + exam.

---
Task ID: 10-c
Agent: content-author (ch13 web services)
Task: Author 6 lesson FILES (py4e ch13 l1–l6, استخدام خدمات الويب / Web Services: XML, JSON, APIs) — no registration (main agent owns registry.ts + manifest.json)

Files created (content only; registry.ts and manifest.json NOT touched — grep confirms zero 'ch13' occurrences in either; git status shows ch13 dir + ch13 scripts as my only additions):
- content/part1/py4e/ch13/lesson.ch13.l1.ts — لغة التوصيف الموسعة XML (s1 ص213: XML vs HTML, tags/elements/nodes, attributes name="value" inside the opening tag, self-closing <email hide="yes" />, root+children tree, why "extensible" = open tag vocabulary; runnable deliberately stays in ch6 string territory: find + slicing harvest text/attribute from ONE embedded XML line — ET saved for l2)
- content/part1/py4e/ch13/lesson.ch13.l2.ts — تحليل نصوص XML (s2 ص214: import xml.etree.ElementTree as ET, ET.fromstring → element tree, tree.find('name').text, tree.find('email').get('hide'); book's person XML embedded as triple-quoted string; whitespace-in-.text pitfall + strip; find-returns-None→AttributeError on .text)
- content/part1/py4e/ch13/lesson.ch13.l3.ts — المرور على عقد XML (s3 ص215: findall('users/user') list of subtrees + chapter-8 list skills, loop item.find('name').text/item.get('x'), book's stuff/users payload embedded, THE path trap findall('user')→0, book's `input` variable renamed input_data with shadowing note)
- content/part1/py4e/ch13/lesson.ch13.l4.ts — صيغة JSON (s4+s5 ص217+218: JSON = dicts+lists in text clothes, loads/dumps round trip, nested access info['name']/info['email']['hide']/info['x'][0], book's users list-of-dicts parsed to IDENTICAL output as l3's XML, XML-vs-JSON tradeoff (simpler vs self-describing), pitfalls: .x vs ['x'], load vs loads, single-quote JSON → JSONDecodeError)
- content/part1/py4e/ch13/lesson.ch13.l5.ts — واجهات برمجة التطبيقات والأمان (s6+s7 ص219+221: API = documented inter-app agreement, SOA via airline/hotel example, urlopen shape DESKTOP-CONCEPT-ONLY in prose ("نضمّن رد الخدمة نصيًّا"), API keys as secrets + hidden.py file pattern + rate limits + OAuth mention, runnable = status guard + None-flag idiom over an embedded "API response" with status 'ok'/'error' branches — NO exit())
- content/part1/py4e/ch13/lesson.ch13.l6.ts — مراجعة الفصل 13 ومشروع: قارئ الخدمة الجغرافية (s8 glossary ص221: XML/ElementTree/JSON/parse/API/SOA/key/rate-limit in 2 chunks + chapter map; s9 ص222 PROJECT geo-reader: Google-geocode-LIKE payload {status:"OK", results:[{formatted_address, lat:42.2808, lng:-83.7430, place_id:"ChIJMx9D1A2wPIgR4rXIhkb5Cds"}]} embedded → loads → guard status=='OK' → place=None flag → prints 'status: OK' / 'lat: %s' 42.2808 / 'lng: %s' -83.743 (trailing-zero float lesson) / 'place id: %s' ChIJ...; s10 تويتر mentioned in PROSE ONLY (OAuth, hidden.py) per task spec — not in sources lists; debug block ex5: guard compares 'ok' vs the service's 'OK' spelling → silent wrong value (healthy payload prints status: error, runs crash-free on both payloads) → fix = exact spelling; 6-item quiz revisits ch6/ch8/ch9/ch11 + 2 ch13 core)
- Verification scripts: scripts/validate-ch13.ts, scripts/dump-ch13-solutions.ts + scripts/replay-ch13-solutions.py, scripts/dump-ch13-checks.ts + scripts/replay-ch13-checks.py (replay pairs: chdir tempdir = MEMFS stand-in; checks replay adds a ch13-specific broken-symptom assertion: broken guard must print status: error for the OK payload)

Anatomy identical to 8-a/8-b/9-a/9-b/9-c master pattern: hook (objectives embedded) → predict → 2 concepts (2 chunks each, ≤150 words/chunk, AR+EN) → worked (runnable) → 4 exercises l1–l5 (every lesson ≥1 write_code with assert tests + ≥1 pattern kind; mixes: l1 write+trace+mcq+fill, l2 write+trace+mcq+fill, l3 write+trace+mcq+fill, l4 write+trace+mcq+numeric, l5 write+trace+mcq+fill, l6 trace+write(project)+mcq+numeric + debug block) → sandbox → quiz (4 items ×5 lessons, 6 in l6; ≥1 earlier-chapter revisit per lesson: l1 ch6, l2 ch6, l3 ch8+ch5, l4 ch9+ch8, l5 ch7, l6 ch6/ch8/ch9/ch11) → pitfalls (3 pairs each) → summary+reflect → sources. Sources per PY4E.toc.json: l1=[s1 ص213], l2=[s2 ص214], l3=[s3 ص215], l4=[s4 ص217, s5 ص218], l5=[s6 ص219, s7 ص221], l6=[s8 ص221, s9 ص222] ("صX / pp.X", section ids py4e.ch13.s1–s10; all 10 sections covered exactly once, s10 in l6 prose only). prerequisites: l1→["py4e.ch12.l6"], then chained l2←l1 … l6←l5. Determinism: no input()/random/exit() anywhere; all service payloads EMBEDDED as triple-quoted strings (runnability blessing: xml.etree.ElementTree + json are Pyodide-safe); urllib framed desktop-only in prose (l1 chunk, l2 chunk, l5 chunk). trace answers ASCII short lines ('8\n19\nChuck', 'Sally\nno\n5', '2\n0\n9', 'Chuck\n4\nyes\n3', 'ok\n2\n2.5', 'OK\n2\n48.11'). fill answers single ':'-free tokens (find/fromstring/findall/loads). Numeric exact: 3 (l4 user dict keys), -83.743 (l6 float trailing-zero). Print-check asserts follow 'expected: X | actual: %r' with ASCII grader substrings ('User count: 2', 'Attribute 7', 'status: ok', 'lat: 10.5', 'status: OK', 'lat: 42.2808', 'lng: -83.743', 'place id: ChIJ'). status spelling convention: l5 service uses lowercase 'ok' (per task spec), l6 geo service uses book-faithful 'OK' — the l6 debug block turns this exact difference into the teaching moment.

Verification evidence:
- Zod: bun run scripts/validate-ch13.ts → "ALL 6 LESSONS VALID" (kind mix printed per lesson; every lesson write_code + ≥1 pattern kind; l6 debug=1 quizItems=6). One self-inflicted fix during validation: l3/l4/l5/l6 mcq blocks initially had an exercise-level `explanation` key instead of `solution`+4 hints (the 8-a gotcha strikes again) → converted explanations into hint ladders.
- Harness replay (replicates public/pyodide-worker.js __pypath_run_tests; CPython + chdir tempdir): bun run scripts/dump-ch13-solutions.ts → 7 suites (6 write_code + l6 debug); python3 scripts/replay-ch13-solutions.py → 7/7 PASS (l6 project stdout: 'status: OK / lat: 42.2808 / lng: -83.743 / place id: ChIJMx9D1A2wPIgR4rXIhkb5Cds'; debug fix stdout: 'lat: 42.2808 / status: error').
- Extra cross-check: bun run scripts/dump-ch13-checks.ts + python3 scripts/replay-ch13-checks.py → ALL CHECKS PASS (6/6 traces whitespace-matched against CPython stdout, 18/18 predict/worked/sandbox snippets run crash-free, 6/6 mcq answer==solution, 4/4 fills single ':'-free tokens, broken guard code runs crash-free and shows the symptom 'status: error\nstatus: error' — healthy OK payload wrongly rejected).
- Ad-hoc CPython pre-computation: all hand-computed values verified before authoring (l1 find indices 5/11/8/19/13/17/18/34; l2 phone.text = '\n      +1 734 303 4456\n   ' raw vs strip; l3 findall('user')=0; l4 dumps {'hide': 'yes'}; l5 '%s' % 10.5 = '10.5'; l6 str(-83.7430)= '-83.743' trailing-zero drop).
- bun run lint → 4 errors, ALL in the PARALLEL agents' mid-write files (content/part1/py4e/ch11/lesson.ch11.l{1,5}.ts + ch12/lesson.ch12.l{3,6}.ts — authors 10-a/10-b live during this task); scoped eslint on my files (bunx eslint content/part1/py4e/ch13/ scripts/dump-ch13-*.ts scripts/validate-ch13.ts) → CLEAN exit 0.
- bunx tsc --noEmit → ZERO errors in the 6 new ch13 content files or the 5 new scripts (grep 'ch13' in tsc output → empty). NOTE for main agent: the historical 280-error baseline no longer reproduces — current repo has 0 src/ errors (en.ts now type-checks clean; the 280 snapshot belonged to the 9-x era); remaining tsc errors at check time were 41→18 and moving, ALL inside the parallel agents' ch11/ch12 files mid-authoring. My delta = 0.
- Registry check NOT possible (parallel ch11/ch12 authors own nothing of it but main agent owns registration); registry.ts has no ch11/ch12/ch13 imports yet — registration readiness confirmed, browser/E2E testing left to the main agent at registration time.

Notes for the main agent (registration):
- Sources distribute as: l1=[s1], l2=[s2], l3=[s3], l4=[s4,s5], l5=[s6,s7], l6=[s8,s9] — all 10 sections covered exactly once; s10 (تويتر ص227) intentionally prose-only inside l6 (hook/concept/quiz q6) per task spec.
- Prereq chain ready: py4e.ch12.l6 → ch13.l1 → … → ch13.l6.
- Extraction: curriculum/sources/PY4E/ch13.txt starts with the tail of ch12 (offset, same as ch8–ch10 before) and the chapter body itself is FULLY extracted s1–s10 ending mid-twitter1.py (book p.228, the while-loop program cut at print(data[:250]) — the only genuine tail loss; nothing after it is lost content-wise beyond the program's closing lines and no further sections exist in the TOC). No mid-chapter tail flags needed beyond that; terminology cross-checked with TOC titles.
- The l1→l2 split (strings-first, parser-second) mirrors the book's own arc and gives Pyodide-safe runnable content from lesson one; consider it the canonical pattern for future format-introduction chapters.

Status: 6/6 lesson FILES COMPLETE (awaiting registration)

---
Task ID: 10-a
Agent: content-author (ch11 regex)
Task: Author 6 lesson FILES (py4e ch11 l1–l6, التعابير النمطية / Regular Expressions) — no registration (main agent owns registry.ts + manifest.json)

Files created (content only; registry.ts and manifest.json NOT touched; no dev server, no browser):
- content/part1/py4e/ch11/lesson.ch11.l1.ts — مطابقة المحارف بالتعبيرات النمطية (s1 ص173: why regex — a small language for search+extract; import re; re.search(نمط، سطر) → match object or None, truthy in if; re.search vs line.find (position/-1 vs object/None, same literals); ^ anchor: 'From:' anywhere vs '^From:' start-only; worked = 4 embedded mbox lines → 2 anchored prints; exercises: write (anchor-filter hits list, X-Author/Spam excluded) + trace ('X-Spam: From: here' → True/False/True) + mcq (^) + fill (search); quiz revisits ch6 startswith + ch5 for-loop)
- content/part1/py4e/ch11/lesson.ch11.l2.ts — استخراج البيانات بالتعبيرات النمطية (s2 ص175: findall returns list of all matches / [] silently; \S+@\S+ read aloud; search().group() vs findall; raw-string r'' habit; worked = book's 4 mbox lines reproducing re06 output incl. ['<postmaster@...>'] and ['apache@localhost)'] junk; exercises: write (extract 2 emails, len + list prints) + trace (2/csev@umich.edu/False for @2PM) + mcq (\S+ meaning) + fill (findall); quiz revisits ch8 (list rights) + ch7 (rstrip); pitfalls: \s vs \S, x>0 vs len(x)>0, unguarded x[0])
- content/part1/py4e/ch11/lesson.ch11.l3.ts — البحث والاستخراج معًا (s3 ص178: combined filter+extract; predict shows parens difference ['0.8475'] vs whole line; [0-9.] class glance; fine-tuned [a-zA-Z0-9]\S*@\S*[a-zA-Z] trailing-trim idea (prose version; book code uses \S+ variant — noted); worked = book's 6 X-DSPAM lines via ^X\S*: ([0-9.]+); exercises: write (extract+sum 0.8475+0.6178 → 2 / 1.4653, Subject line skipped) + trace (2/0.8475) + mcq (parens) + fill (group); quiz incl. ch9 get-counter + book's rev=39772 Details example)
- content/part1/py4e/ch11/lesson.ch11.l4.ts — فئات المحارف والتكرار (s1+s3 deep-dive: classes [a-z]/[0-9]/[a-zA-Z0-9], literal-inside-class rule; \d \w \s \S + dot wildcard (F..m:); repetition * + ? {2,4}; greedy vs lazy with the book's 3-@ line: 'From:.+@' → up to LAST @, '.+?' → first @; worked = greedy/lazy/.group() + \d{2,4} on years → ['1998','2004']; exercises: write (times \d{2}:\d{2}:\d{2} → ['09:14:16','18:44:02']) + trace (3/22/3/False) + mcq (dot in [0-9.]) + numeric (3 digit blocks); quiz revisits ch6 slicing + ch8 guardian)
- content/part1/py4e/ch11/lesson.ch11.l5.ts — محرف الهروب والأنماط العملية (s4 ص183 + s6 ص185: \$ \. \\ escape; predict = book's $10.00 line → ['$10.00'] vs ['10.00','.'] (the lone dot after cookies — inside-class rule); no-escape-inside-classes; practical patterns ^X\S*: [0-9.]+ / ^From .* ([0-9][0-9]): / s6 UNIX one-paragraph note (grep '^From:' mbox.txt, sed); worked = receipt prices \$([0-9.]+) → 3 / total: 15.75 (float-exact); exercises: write (header values ['0.8475','0.0000'], total 0.8475, Subject excluded) + trace (2/5.25/True/False) + mcq (\.) + fill (r); quiz revisits ch6 in-operator + ch7 grep-role)
- content/part1/py4e/ch11/lesson.ch11.l6.ts — مراجعة الفصل 11 ومشروع: محلل السجلات (s5 ملخص ص184 + s7 التنقيح ص186 + s8 فهرس المصطلحات ص187 + s9 تمارين ص187: chapter map 6 tools + 2 workhorses; silence-centered debugging (reduce input/summaries/first-suspect-the-pattern); glossary 2 chunks (regular expression/match/extract/anchor + character class/greedy/lazy/escape); PROJECT محلل السجلات = SELF-CONTAINED 11-line mbox-like log list (4 X-DSPAM-Confidence: 0.8475/0.6178/0.6961/0.8386, 2 Probability 0.0000, 5 noise) → regex extract → 'confidence count: %d' / 'average: %.4f' → count 4 / average 0.7500 (sum exactly 3.0); debug block ex5: loose pattern r'^X\S*: ([0-9.]+)' RUNS and prints silent wrong symptom 'confidence count: 6' / 'average: 0.5000' (Probability leaked) → fix pins ^X-DSPAM-Confidence: literal → 4 / 0.7500; 6 quiz items incl. required ch6 ('3'+'4'='34' string-concat) + ch7 ('w' mode) + ch9 (get counter) + ch10 (DSU) revisits + 2 ch11 core)
- Verification scripts: scripts/validate-ch11.ts, scripts/dump-ch11-solutions.ts + scripts/replay-ch11-solutions.py, scripts/dump-ch11-checks.ts + scripts/replay-ch11-checks.py (both replay pairs chdir to a tempdir for MEMFS-like isolation; checks-broken gate asserts the exact silent symptom)

Anatomy per master spec (identical to 6-a…9-c): hook (objectives embedded) → predict → concepts (≤150 words/chunk, AR+EN; 5 concept blocks in l1/l3, 3 in l2/l4/l5/l6 with glossary as 2-chunk concept) → worked (runnable) → 4 exercises l1–l5 (+1 debug in l6) (every lesson ≥1 write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; kind mixes: l1 write+trace+mcq+fill, l2 write+trace+mcq+fill, l3 write+trace+mcq+fill, l4 write+trace+mcq+numeric, l5 write+trace+mcq+fill, l6 trace+write(project)+mcq+numeric + debug) → sandbox → quiz (4 items ×5 lessons, 6 in l6; ≥1 earlier-chapter revisit per lesson: l1 ch6+ch5, l2 ch8+ch7, l3 ch9+ch7, l4 ch6+ch8, l5 ch6+ch7, l6 ch6+ch7+ch9+ch10+2 ch11) → pitfalls (3 pairs each) → summary+reflect → sources. Sources per PY4E.toc.json: l1=[s1 ص173], l2=[s2 ص175], l3=[s3 ص178], l4=[s1 ص173, s3 ص178], l5=[s4 ص183, s6 ص185], l6=[s5 ص184, s7 ص186, s8 ص187, s9 ص187] — all 9 sections covered ("صX / pp.X", section ids py4e.ch11.s1–s9). prerequisites: l1→["py4e.ch10.l6"], then chained l2←l1 … l6←l5. Determinism: no input() (zero occurrences), no random, no exit(), no network imports; all line sets embedded as fixed lists (no MEMFS file I/O needed this chapter — every block self-contained); trace answers all ASCII + scalar-only ('True\nFalse\nTrue', '2\ncsev@umich.edu\nFalse', '2\n0.8475', '3\n22\n3\nFalse', '2\n5.25\nTrue\nFalse', '1\n39772\nFalse\n1'); fill answers single ':'-free tokens (search/findall/group/r); print-check asserts follow the 'expected: X | actual: %r' convention with ASCII grader-visible substrings ('confidence count: 4', 'average: 0.7500', 'the two addresses', …); no 'explanation' key at exercise level; exactly 4 hints per exercise+debug (nudge→concept→skeleton→solution).
- Authoring conventions: ALL regex patterns written as raw strings r'…' (cleaner than the book's plain '\S+@\S+' which raises SyntaxWarning on modern CPython; equivalent for these patterns) and taught as the professional habit; TS-source escaping: every backslash in prose AND code double-escaped (\\S → \S) — two bidi authoring bugs caught by the gates and fixed (a '-1' token that flipped to '1-' in l1 q4 option, and unescaped apostrophes in l5 worked AR prose; avoided minus-sign tokens in Arabic prose afterwards).
- Design decision (avg): project confidence values chosen so the mean is hand-computable and float-exact: 0.8475+0.6178+0.6961+0.8386 = 3.0000 exactly, /4 = 0.7500 → 'average: 0.7500' (task-spec example string) with zero float-rounding traps.

Verification evidence:
- Zod: bun run scripts/validate-ch11.ts → "ALL 6 LESSONS VALID" (blocks 15/15/15/15/14/16; kind mix printed; l6 debug=1 quizItems=6).
- Harness replay (replicates public/pyodide-worker.js __pypath_run_tests; CPython + chdir tempdir): bun run scripts/dump-ch11-solutions.ts → 7 suites (6 write_code + l6 debug); python3 scripts/replay-ch11-solutions.py → 7/7 PASS (l6 project stdout: 'confidence count: 4' / 'average: 0.7500'; l3 sums 1.4653; l5 total 0.8475).
- Extra cross-check: bun run scripts/dump-ch11-checks.ts → 6 traces, 18 runnables, 6 mcqs, 4 fills, 1 broken; python3 scripts/replay-ch11-checks.py → ALL CHECKS PASS (6/6 traces whitespace-matched against CPython stdout, 18/18 predict/worked/sandbox snippets run crash-free, 6/6 mcq answer==solution, 4/4 fills single ':'-free tokens, broken debug code runs and shows the exact silent symptom 'confidence count: 6' + 'average: 0.5000').
- bun run lint → clean (exit 0).
- bunx tsc --noEmit → 280 errors repo-wide = exactly the pre-existing baseline; grep -i 'ch11' in tsc output → 0 (zero errors in the 6 new content files or the 5 new scripts).
- Content scans: zero occurrences of input(/random/exit(/urllib/socket/subprocess in ch11; all trace answers pure ASCII; prereq chain verified grep-level (ch10.l6→l1→…→l6); 14 'ومن الفصل …' earlier-chapter revisit items across the 6 quizzes.

Notes for the main agent (registration):
- Sources distribution per lesson: l1=[s1], l2=[s2], l3=[s3], l4=[s1,s3], l5=[s4,s6], l6=[s5,s7,s8,s9] — all 9 sections covered exactly once; section titles in TOC: s1 مطابقة المحارف، s2 استخراج البيانات باستخدام التعابير النمطية، s3 تنفيذ عمليتي البحث والاستخراج معًا، s4 محرف الهروب، s5 ملخص، s6 معلومات إضافية لمستخدمي نظام UNIX و LINUX، s7 التنقيح، s8 فهرس المصطلحات، s9 تمارين.
- Prereq chain ready: py4e.ch10.l6 → py4e.ch11.l1 → … → py4e.ch11.l6.
- Extraction-tail flags for the M5 Arabic proofread pass: curriculum/sources/PY4E/ch11.txt ends mid-s4 (book p.183/184, right after the [0-9.] inside-class note). s5 (ملخص), s6 (UNIX/LINUX note), s7 (التنقيح), s8 (فهرس المصطلحات), s9 (تمارين) were authored from PY4E.toc.json titles + known PY4E ch11 content, cross-checked with the extracted s1–s4 text and terminology — same flag as ch4–ch10 before. Also: ? quantifier, {n,m} bounds and lazy (?) matching in l4 go beyond the extracted text (task-spec-mandated) — proofread those chunks with priority.
- The Arabic TOC uses 'معلومات إضافية لمستخدمي نظام UNIX و LINUX' for s6 (task brief abbreviated it to UNIX/LINUX) — manifest should carry the id py4e.ch11.s6.

Status: 6/6 lesson FILES COMPLETE (awaiting registration)

---
Task ID: 10-b
Agent: content-author (ch12 networks)
Task: Author 6 lesson FILES (py4e ch12 l1–l6, البرامج المرتبطة بالشبكات / Networked Programs) with the SIMULATED-NETWORK design — no registration (main agent owns registry.ts + manifest.json)

Files created (content only; registry.ts/manifest.json NOT touched — grep confirms zero 'ch12' in both; parallel ch11/ch13 agents were live on their own dirs during this task):
- content/part1/py4e/ch12/lesson.ch12.l1.ts — بروتوكول HTTP: كيف تتحدث الشبكة (s1 ص190: protocol/sockets framing, GET + blank line request shape, response anatomy status/headers/blank/body, RFC2616 mention; runnable = EMBEDDED raw response string split on '\n\n', status words status[1]/status[2], headers = head lines − 1, body word count; exercise parses a stored 404 → status: 404 / headers: 3 / words: 6; quiz revisit ch8 split)
- content/part1/py4e/ch12/lesson.ch12.l2.ts — أبسط متصفح ويب في العالم (s2 ص191: book's socket1.py taught conceptually as desktop code inside prose (import socket/connect(('data.pr4e.org',80))/send GET/recv(512) loop/close — never runnable); SIMULATED browser: embedded 'GET romeo.txt' response parsed headers-vs-body, line count, word count; predict counts \r\n in the real GET request (→2); exercise full 4-line verse → status: 200 / headers: 3 / lines: 4 / words: 33 (matches ch9's 33-word romeo count); mcq recv(512), fill recv; quiz revisit ch7 file-iteration)
- content/part1/py4e/ch12/lesson.ch12.l3.ts — الصور والبيانات الثنائية عبر HTTP (s3 ص194 + s5 ص199: bytes b''/encode/decode equivalence, urljpeg.py recv-accumulate + Content-Length/flow-control taught conceptually, 'wb' mode; runnable = full BYTES response with real CRLFs: find(b'\r\n\r\n') → pos 61/57, header decode, body skip pos+4, len(bytes) matches Content-Length honestly (10); exercise prints pos: 57 / type: image/jpeg / bytes: 10 / FAKEDATA99 + variable tests; quiz revisit ch6 encode)
- content/part1/py4e/ch12/lesson.ch12.l4.ts — مكتبة urllib وتحليل الروابط (s4 ص198: urlopen pattern + try/except shape + read()/read-blocks taught conceptually as desktop code; urllib.parse RUNNABLE: urlparse scheme/netloc/path in predict/worked/exercises; worked ALSO writes the simulated page to MEMFS file page-l12.html ('w') and reads it back like urlopen hands a page — the ch7 tie; exercise urlparse http://data.pr4e.org/cover3.jpg → scheme/host/path; quiz revisit ch8 word list)
- content/part1/py4e/ch12/lesson.ch12.l5.ts — تحليل صفحات HTML (s6+s7+s8 ص201/ص201/ص204: web scraping concept, anchor href, book pattern href="(http[s]?://.+?)" with extraction parens + non-greedy ? — RUNNABLE re.findall on embedded HTML string; worked reproduces the book's two-link page; exercise links: 2 + 'link: %s' prints + clean-list assertion; BeautifulSoup taught conceptually (pip install, soup('a'), tag.get('href')) framed on-your-own-machine, never imported; quiz revisit ch11 [s]?)
- content/part1/py4e/ch12/lesson.ch12.l6.ts — مراجعة الفصل 12 ومشروع: متصفح مصغّر (s9 ص209 + s10 ص209 + s11 ص210: chapter map + UNIX/Linux notes curl/telnet framed on-your-own-machine terminal commands; 2-chunk AR/EN glossary protocol/socket/request/response/headers/body/bytes/urllib/urlparse/HTML/anchor/web scraping; PROJECT متصفح مصغّر SELF-CONTAINED: embedded raw response (status + 4 headers incl. honest Content-Length: 97 + blank + 3-line body with 2 anchors) → prints 200 OK / headers: 4 / lines: 3 / words: 7 / links: 2 + link: %s lines, 6 tests incl. clean links-list; debug block: split('\n', 1) instead of the blank-line boundary — RUNS, symptom headers: 7 + words inflated to 20, links still right; fix = split('\n\n', 1); numeric = count body.split() tokens by hand → 7 (tag-with-no-inner-spaces is one word); 6 quiz items revisiting ch6 (format), ch7 (files), ch8 (split→list), ch11 (non-greedy) + 2 ch12 core)
- Verification scripts: scripts/validate-ch12.ts, scripts/dump-ch12-solutions.ts + scripts/replay-ch12-solutions.py, scripts/dump-ch12-checks.ts + scripts/replay-ch12-checks.py (both replays chdir tempdir; checks replay asserts the debug symptom 'headers: 7' visible AND 'headers: 4' absent)

Anatomy identical to 8/9/10 master pattern: hook (objectives embedded) → predict → 2–3 concepts (≤150 words/chunk, AR+EN) → worked (runnable) → 4 exercises l1–l5 (+1 debug in l6) (every lesson ≥1 write_code with assert tests + ≥1 of mcq/trace_output/fill_blank/numeric; kind mixes: l1 write+trace+mcq+fill, l2 write+trace+mcq+fill, l3 write+trace+mcq+fill, l4 write+trace+mcq+fill, l5 write+trace+mcq+fill, l6 trace+write(project)+mcq+numeric+debug) → sandbox → quiz (4 items ×5 lessons, 6 in l6; ≥1 earlier-chapter revisit per lesson: ch8 / ch7 / ch6 / ch8 / ch11 / ch6+ch7+ch8+ch11) → pitfalls (3 pairs each) → summary+reflect → sources. Sources per PY4E.toc.json verbatim: l1 s1 ص190, l2 s2 ص191, l3 s3 ص194+s5 ص199, l4 s4 ص198, l5 s6 ص201+s7 ص201+s8 ص204, l6 s9 ص209+s10 ص209+s11 ص210 ("صX / pp.X", ids py4e.ch12.s1–s11) — all 11 sections covered exactly once. prerequisites: l1→["py4e.ch11.l6"] (forward ref; ch11 dir authored by parallel agent 10-a), then chained l2←l1 … l6←l5.

SIMULATED-NETWORK design notes (for main agent + reviewers):
- HARD RULE ENFORCED + machine-checked: no import socket / urllib.request / http.client / bs4 / BeautifulSoup / input( / random / exit( in ANY runnable field (predict/worked/sandbox code, exercise starterCode/solution, test code) — swept programmatically across all 6 lessons → 0 hits. They appear only in AR/EN prose, always framed "شيفرة سطح مكتب على حاسوبك" / desktop-Python for your own computer.
- The "نحاكي الشبكة بمتن مخزّن / we simulate the network with a stored response" sentence appears in every lesson (hook/concepts/worked) exactly as the platform's simulated-`typed` philosophy.
- Text responses stored with \n + blank line \n\n (lesson prose explains the wire truth is \r\n and points to l3); l3 uses the REAL byte form b'...\\r\\n...\\r\\n\\r\\n' with find(b'\r\n\r\n') and pos+4 skip, exactly the book's urljpeg.py core.
- Content-Length values made honest: l1 48 = len(body), l2 ex1 166 = len(4-line verse), l3 10 = len(b'PICTURE123'), l6 project 97 = len(body) — verified under CPython.
- urllib.parse is the ONLY network-flavored module imported in runnable code (pure Python, Pyodide-safe). l4 worked writes page-l12.html to MEMFS and reads it back (unique name per constraint; CPython replay uses tempdir CWD).
- trace answers all short ASCII lines ('2\n200\ntext/plain', '2\n3\nArise', '2\nAB\nTrue', 'https\ndocs.python.org\n/3/index.html', '2\nb.htm', '/x.txt\n404\n2'); fills single ':'-free tokens (GET/recv/decode/parse/href); test messages follow the 'expected: X | actual: %r' convention with ASCII grader-visible substrings ('status: 200', 'headers: 4', 'words: 7', 'links: 2').

Verification evidence:
- Zod validation: bun run scripts/validate-ch12.ts → "ALL 6 LESSONS VALID" (kind mix + debug=1 + quizItems=6 for l6 printed per lesson). One schema gotcha caught mid-authoring: l6 ex3 mcq initially had an exercise-level `explanation` key and no solution/hints — removed explanation, added solution + 4 hints (Task 8-a gotcha re-confirmed).
- Harness replay (replicates public/pyodide-worker.js __pypath_run_tests; CPython + chdir tempdir): bun run scripts/dump-ch12-solutions.ts → 7 suites (6 write_code + l6 debug); python3 scripts/replay-ch12-solutions.py → 7/7 PASS (l1 'status: 404/headers: 3/words: 6'; l2 'status: 200/headers: 3/lines: 4/words: 33'; l6 project + debug fix '200 OK/headers: 4/lines: 3/words: 7/links: 2').
- Extra cross-check: bun run scripts/dump-ch12-checks.ts → 6 traces, 18 runnables, 6 mcqs, 5 fills, 1 broken; python3 scripts/replay-ch12-checks.py → ALL CHECKS PASS (6/6 traces whitespace-matched against CPython stdout, 18/18 predict/worked/sandbox snippets run crash-free incl. the l4 MEMFS file write/read, 6/6 mcq answer==solution, 5/5 fills single ':'-free tokens, broken debug code RUNS and shows the symptom headers: 7 without headers: 4).
- Self-computed values verified under CPython before finalizing: l1 48/8 words; l2 worked 17 words; l2 ex1 166 chars/33 words/26 unique (matches ch9's romeo count); l3 pos 61/57; l6 worked 8 words (tokens: <a + href="...">next + page</a> counted per split()); l6 project 7 words/97 bytes; l6 broken 7 headers/20 words.
- bun run lint → clean (exit 0).
- bunx tsc --noEmit → 280 errors repo-wide = exactly the pre-existing baseline (270 en.ts + 10 known); grep 'ch12' in tsc output → 0.
- Constraint sweep (programmatic over all runnable fields): forbidden tokens (socket/urllib.request/http.client/bs4/BeautifulSoup/input/random/exit) → 0 hits in runnable code; also verified every exercise has exactly 4 hints, prereq chain intact, sources 11/11 exactly once.

Notes for the main agent (registration):
- Register py4e.ch12.l1–l6 after ch11 (prereq chain: py4e.ch11.l6 → ch12.l1 → … → ch12.l6; l1's prereq references py4e.ch11.l6 authored by parallel task 10-a).
- Browser E2E (Pyodide worker Check flow) left to main agent; all solutions replay-verified under the worker-semantics CPython harness, and every runnable line is Pyodide-safe by construction (embedded strings, bytes literals, urllib.parse, re only).
- Extraction-tail flag for M5 Arabic proofread: curriculum/sources/PY4E/ch12.txt ends mid-s8 at book p.212 (internal 206, inside the BeautifulSoup link-list output). s9 (UNIX/لينكس ملاحظات: curl/telnet), s10 (فهرس المصطلحات) and s11 (تمارين) were authored from TOC titles + known PY4E ch12 content (English-original curl/telnet notes, glossary terms, mini-browser adaptation of the exercises), cross-checked with extracted s1–s8 terminology — same flag as ch4–ch10 before. Also the extraction begins with the tail of ch11 (pp.190–195 = ch11 summary/glossary/exercises) — expected offset behavior, no ch12 content lost before s1.
- Self-inflicted fixes during verification: l1 ex1 was missing a third header (headers printed 2 not 3) → added Content-Type: text/plain; l1 Content-Length 167→48 and l2 ex1 167→166 for internal honesty; l6 debug symptom words corrected 21→20 (CPython-verified); l6 sandbox EN prompt had an unescaped quote (TS would not compile) → rephrased; l3 prose had one garbled word → fixed.

Status: 6/6 lesson FILES COMPLETE (awaiting registration)

---
Task ID: 10-main
Agent: main (Z.ai)
Task: Continue M2 — PY4E ch11 (regex) + ch12 (networked programs) + ch13 (web services) via three parallel agents; register all three; validate; E2E

Work Log:
- Confirmed Session 4 state (ch8–10 published, 60 lessons, PY4E 68.0%) then extracted PY4E ch11–13 source text (curriculum/sources/PY4E/ch{11,12,13}.txt) + section maps from TOC.
- Task 10-a (parallel): authored ch11 l1–l6 (matching/anchors, findall extraction, search+extract combined, classes+repetition+greedy, escaping+practical patterns, review + log-analyzer project). Zod ALL VALID; replay 7/7 + cross-checks ALL PASS; lint clean; tsc delta 0. Raw-string r'…' habit taught (deviation flagged).
- Task 10-b (parallel): authored ch12 l1–l6 with the SIMULATED-NETWORK design (socket/urllib.request/bs4 framed desktop-only in prose; all runnable code parses EMBEDDED raw HTTP responses; urllib.parse runnable in l4). Zod ALL VALID; replay 7/7 + cross-checks ALL PASS; programmatic forbidden-token sweep = 0; tsc delta 0.
- Task 10-c (parallel): authored ch13 l1–l6 (XML basics, ET.fromstring/find/get, findall node loops, JSON loads/dumps, APIs+security with None-flag status guard, review + geo-service-reader project). Zod ALL VALID; replay 7/7 + cross-checks ALL PASS; tsc delta 0.
- Main registration via scripts/register_ch11_13.py (idempotent, format-preserving): 18 loaders in registry.ts + 18 manifest entries orders 61–78; titles/prereqs verified against lesson files before write. Manifest sanity: 78 lessons, orders 1–78 sequential, no dup ids, prereqs resolve, chapters 1–13.
- Gates after registration: Zod ch11/ch12/ch13 ALL VALID; replay 7/7 ×3; lint exit 0; tsc = 280 errors = exact pre-existing baseline (270 en.ts + 10 known), grep ch11/ch12/ch13 → 0; gen:coverage → PY4E 152/181 = 84.0% · TOTAL 152/476 = 31.9%.
- Browser E2E (agent-browser, dev server NOT restarted): all 18 lessons render correct AR h1, zero "درس غير متوفر". Pyodide Check E2E on all three projects: ch11.l6 log-analyzer → "أحسنت! نجحت كل الاختبارات." + stdout 'confidence count: 4'; ch12.l6 mini-browser → success + 'links: 2'; ch13.l6 geo-reader → success + 'place id: ChIJ'. EN toggle → h1 "Matching Characters with Regular Expressions" at #/en/lesson/py4e.ch11.l1. dev.log clean (200s + compiles only).

Stage Summary:
- PY4E ch1–13 published = 78 lessons; PY4E coverage 84.0% (152/181 sections mapped), total 31.9%.
- ch12 establishes the reusable SIMULATED-NETWORK authoring pattern (embedded responses + urllib.parse runnable) — reference for future network-ish content.
- Agent 10-c briefly observed a tsc count ≠280 mid-flight (parallel writes) — final repo state re-verified at exactly 280.
- NEXT: PY4E ch14 (OOP) + ch15 (SQL — verify sqlite3 in the bundled Pyodide first) + ch16 (visualization — decide matplotlib strategy: not bundled locally) → PY4E 100% M2 gate; then SWE P3 + Capstone I.
---
Task ID: 11-a
Agent: content-author (ch14 OOP)
Task: Author 6 lesson FILES (py4e ch14 l1–l6, البرمجة الكائنية التوجه / Object-Oriented Programming) — no registration (main agent owns registry.ts + manifest.json)

Files created (content only; registry.ts/manifest.json/pyodide-worker.js NOT touched — git status confirms my additions are exactly the ch14 dir + the 5 ch14 scripts + their dump JSONs; the `M public/pyodide-worker.js` in git status is the main agent's pre-existing sqlite3 preload, not mine):
- content/part1/py4e/ch14/lesson.ch14.l1.ts — لماذا نحتاج الكائنات؟ (s1+s2+s3 ص235+ص235+ص236: four patterns (sequential/conditional/iterative/functions) → OOP = focus on 50 lines, ignore 999,950; you already USE objects: book's party1.py with the three equivalent item-access forms stuff[0] / stuff.__getitem__(0) / list.__getitem__(stuff, 0), dir() capability sheet taught via membership checks only ('append' in dir(stuff)) — never the full dir() listing which varies across Python builds)
- content/part1/py4e/ch14/lesson.ch14.l2.ts — أول صنف لك (s4+s5 ص237+ص239: program = input→process→output; elev.py and urllinks.py (urllib/BeautifulSoup/socket/input) framed DESKTOP-CONCEPT-ONLY in prose; hiding complexity helps users AND library authors; class keyword = mold, object = cake, class builds nothing just as def runs nothing; book's party2.py worked with PartyAnimal.party(an) long form → an.party() shorthand)
- content/part1/py4e/ch14/lesson.ch14.l3.ts — بناء الكائنات والمُنشئ (s6+s7 ص240+ص243: object = code+data bundle, methods+properties, self explained via the PartyAnimal.party(an) long form; __init__ with self+params (book's s9 constructor parameter pulled forward per the task's lesson split), self.name = nam vs local-name-vanishes; party3.py types: type(an) → <class '__main__.PartyAnimal'>, type(an.x) → int, type(an.party) → method; dir(an) shows your x+party next to inherited-from-object names — built-in object inheritance as a brief mention)
- content/part1/py4e/ch14/lesson.ch14.l4.ts — دورة حياة الكائن وتعدد الكائنات (s8+s9 ص244+ص245: lifecycle build→use→discard; book party4.py narrated in prose incl. an = 42 discarding the object and the desktop __del__ message — DESTRUCTOR IS CONCEPT-ONLY: no __del__ in ANY runnable field (machine-swept), predict uses __init__ prints + reassignment with no destructor reliance; party5-style worked: Sally/Jim with 'constructed' prints and 'party count' lines, independent counters hand-computed)
- content/part1/py4e/ch14/lesson.ch14.l5.ts — الوراثة (s10 ص247: class CricketFan(PartyAnimal) is-a; inherited __init__/party + new points/six; j.six() adds 6 then calls the inherited self.party() — parent's code running on the child's object; override traced via tiny A/B classes; super().__init__(nam) brief mention (no self passed); type(j) stays the child's precise name, isinstance both ways, issubclass in sandbox)
- content/part1/py4e/ch14/lesson.ch14.l6.ts — مراجعة الفصل 14 ومشروع: فريق الكائنات (s11+s12 ص248+ص249: 3-chunk chapter map + glossary class/object/instance/attribute/method/constructor/inheritance/self; worked = LoudTeam(Team) OVERRIDE demo vs the project's Coach which ADDS lead(); PROJECT فريق الكائنات SELF-CONTAINED: Team with __init__(self, nam) → self.name + self.players = list(), add_player → self.players.append(player), describe → 'team: %s' % self.name + 'players: %d' % len(self.players); Coach(Team) adds lead() → 'Coach of %s'; two instances red(2 players)/blue(1 player) drive 5 formatted output lines 'team: red/players: 2/team: blue/players: 1/Coach of blue' + 5 tests incl. isinstance(blue, Team); debug ex5: players = [] as a CLASS attribute — RUNS crash-free, symptom = both teams print players: 2 (leak), fix moves the list into __init__ → players: 1 twice; numeric = CricketFan.points after two six() → 12; 6 quiz items incl. ch4 functions/ch6 % format/ch8 append/ch9 dict() revisits + 2 ch14 core)
- Verification scripts: scripts/validate-ch14.ts (Zod + kind-mix report + forbidden-token sweep over RUNNABLE fields only: input(/exit(/random/__del__/socket/urllib/subprocess → 0 hits; __del__ appears solely in l4 concept prose/pitfall-note illustrations), scripts/dump-ch14-solutions.ts + scripts/replay-ch14-solutions.py, scripts/dump-ch14-checks.ts + scripts/replay-ch14-checks.py (both replays chdir tempdir; checks replay asserts the ch14-specific leak symptom: broken code must run with BOTH teams printing players: 2 and players: 1 absent)

Anatomy identical to 6-a…10-c master pattern: hook (objectives embedded) → predict → 2–3 concepts (≤150 words/chunk, AR+EN) → worked (runnable) → 4 exercises l1–l5 (+1 debug in l6) (every lesson ≥1 write_code with assert tests + ≥1 pattern kind; kind mixes: l1 write+trace+mcq+fill, l2 write+trace+mcq+fill, l3 write+trace+mcq+numeric, l4 write+trace+mcq+fill, l5 write+trace+mcq+fill, l6 trace+write(project)+mcq+numeric + debug) → sandbox → quiz (4 items ×5 lessons, 6 in l6; ≥1 earlier-chapter revisit per lesson: l1 ch8+ch6, l2 ch4, l3 ch9, l4 ch8, l5 ch13, l6 ch4+ch6+ch8+ch9) → pitfalls (3 pairs each) → summary+reflect → sources. Sources per PY4E.toc.json verbatim: l1=[s1 ص235, s2 ص235, s3 ص236], l2=[s4 ص237, s5 ص239], l3=[s6 ص240, s7 ص243], l4=[s8 ص244, s9 ص245], l5=[s10 ص247], l6=[s11 ص248, s12 ص249] ("صX / pp.X", ids py4e.ch14.s1–s12) — all 12 sections covered exactly once. prerequisites: l1→["py4e.ch13.l6"], then chained l2←l1 … l6←l5.

Determinism/OOP-safety design notes:
- Real classes everywhere in runnable code; NO input() (elev.py/urllinks.py prose-only as desktop code), NO random, NO exit(), no network imports; everything pure in-memory OOP — no files needed.
- NEVER rely on __del__: destructor taught in prose only (l4 concept + predict reveal + pitfall note); l4's predict shows construction timing + an = 42 reassignment with no destructor defined. Validate script sweeps all runnable fields for '__del__' → 0 hits (pitfall 'wrong' snippet + prose are display-only illustrations).
- NO default-repr printing anywhere (no print(obj) memory addresses); identity checks use type()/isinstance()/issubclass/attribute reads. l3 mcq shows type(an) output as a known-good string.
- All object-state changes hand-computable; trace answers SHORT ASCII: l1 'PYTHON\n2\nmithon', l2 'echo\necho', l3 "built\n2\n<class 'int'>", l4 'one ready\ntwo ready\nping one', l5 'hello from A\nhello from B', l6 'x built\ny built\nx 1\ny 1\nx 2'. Fills single ':'-free tokens: append/self/init/super. Numeric exact ints: 2 (params incl. self), 12 (points after two six()).
- Print-check asserts follow the 'expected: X | actual: %r' convention with ASCII grader substrings ('team: red', 'players: 2', 'Jim points 6', 'Coach of blue', 'Ticket: A17', 'So far 1').
- All hand-computed values CPython-verified BEFORE authoring via a scratch script: party1.py chuck×3, party2.py So far 1–4, party3.py 6-line output incl. <class '__main__.PartyAnimal'>, party5-style 5-line output, CricketFan 8-line output, leak symptom 'team: red/players: 2/team: blue/players: 2', fix 'players: 1' twice, find('th')=2, replace → mithon.

Verification evidence:
- Zod: bun run scripts/validate-ch14.ts → "ALL 6 LESSONS VALID" (blocks 14/14/15/14/14/14; kind mix printed; every lesson write_code + ≥1 pattern kind; l6 debug=1 quizItems=6; forbidden-token sweep clean). One self-inflicted fix during validation: l4 ex3 mcq had an exercise-level `explanation` key instead of `solution`+4 hints (the 8-a gotcha) → converted into a hint ladder.
- Harness replay (replicates public/pyodide-worker.js __pypath_run_tests; CPython + chdir tempdir): bun run scripts/dump-ch14-solutions.ts → 7 suites (6 write_code + l6 debug); python3 scripts/replay-ch14-solutions.py → 7/7 PASS (project stdout: 'team: red / players: 2 / team: blue / players: 1 / Coach of blue'; debug fix stdout: 'team: red / players: 1 / team: blue / players: 1').
- Extra cross-check: bun run scripts/dump-ch14-checks.ts → 6 traces, 18 runnables, 6 mcqs, 4 fills, 1 broken; python3 scripts/replay-ch14-checks.py → ALL CHECKS PASS (6/6 traces whitespace-matched against CPython stdout, 18/18 predict/worked/sandbox snippets run crash-free, 6/6 mcq answer==solution, 4/4 fills single ':'-free tokens, broken class-attr code RUNS and shows the exact leak symptom: both teams 'players: 2', no 'players: 1').
- bun run lint → 2 errors, BOTH in the PARALLEL agent's mid-write files (content/part1/py4e/ch16/lesson.ch16.l{2,3}.ts parse errors — author 16-x live during this task, same phenomenon 10-c documented); scoped eslint on my files (bunx eslint content/part1/py4e/ch14/ scripts/validate-ch14.ts scripts/dump-ch14-*.ts) → CLEAN exit 0.
- bunx tsc --noEmit → 62 errors repo-wide at check time, ALL of them TS1005/TS1127 parse errors inside the parallel agent's ch16 l2/l3 files (mid-write); grep 'ch14' in tsc output → ZERO (my 6 content files + 5 scripts add exactly 0 errors). NOTE for main agent: the historical 280 baseline did not reproduce at this moment (ch16 parse errors + what looks like en.ts having been fixed later than the 10-x era) — re-verify the count after the parallel 11-b/11-c authors land; my delta is 0 either way.
- Registry NOT touched (main agent owns registration); no dev server started, no browser used.

Notes for the main agent (registration):
- Sources distribution per lesson: l1=[s1,s2,s3], l2=[s4,s5], l3=[s6,s7], l4=[s8,s9], l5=[s10], l6=[s11,s12] — all 12 sections covered exactly once.
- Prereq chain ready: py4e.ch13.l6 → py4e.ch14.l1 → … → py4e.ch14.l6.
- Extraction-tail flag for M5 Arabic proofread: curriculum/sources/PY4E/ch14.txt ends mid-s9 at book p.245 (right at def __init__(self, nam): inside party5.py). s9's tail (party5.py body + its output), s10 (الوراثة + party6.py/CricketFan), s11 (ملخص) and s12 (فهرس المصطلحات) were authored from PY4E.toc.json titles + the known PY4E ch14 canon (PartyAnimal/CricketFan are the book's canonical examples: party2–6.py shapes reproduced faithfully: 'So far', 'party count', 'I am constructed', 'I am destructed', 'constructed' prints) and cross-checked with the extracted s1–s9-start terminology — same flag as ch11/ch12 before. Also the extraction begins with the tail of ch13 (twitter1/twitter2 output + rate-limit prose, book pp.229–233) — expected offset behavior, no ch14 content lost before s1.
- The task's lesson split pulls __init__+parameters forward into l3 (book s6/s7) and reserves lifecycle+multiple-instances for l4 (book s8/s9) — the book's party5.py constructor-parameter example is therefore introduced in l3 and re-deepened in l4; sources lists follow the task split exactly.
- OOP is 100% Pyodide-runnable by construction: plain classes only, no imports at all in this chapter's runnable code.

Status: 6/6 lesson FILES COMPLETE (awaiting registration)

---
Task ID: 11-main
Agent: main (Z.ai)
Task: Finish M2 PY4E side — ch14 (OOP) + ch15 (SQL) + ch16 (visualization); sqlite3 platform enablement; register; validate; E2E

Work Log:
- Extracted PY4E ch14–16 source text + section maps (ch16 has only 3 sections → 6-lesson split with section reuse l1=[s1], l2=[s1], l3=[s2], l4=[s2], l5=[s3], l6=[s3]).
- PLATFORM: sqlite3 enablement — lock listed sqlite3 wheel absent from /vendor/pyodide/; downloaded sqlite3-1.0.0-cp312-cp312-pyodide_2024_0_wasm32.whl from the official 0.27.7 dist (actual bundled version is 0.27.7, NOT 0.28 as ADR-0002 states — correction noted), sha256 VERIFIED against pyodide-lock.json (430619…cfc3), worker now preloads it non-fatally after boot. Verified in the real worker: import sqlite3 → 3.39.0, CREATE/INSERT/SELECT+? params OK. matplotlib remains UNAVAILABLE (no wheels vendored) → ch16 uses the simulated-renderer design. Debug lesson: a changed pyodide-worker.js needs a FULL browser restart (agent-browser close+open) — cached worker script otherwise.
- Task 11-a (agent): ch14 OOP l1–l6 complete (dir/party1-6.py, __init__, lifecycle with __del__ concept-only, inheritance CricketFan, project Team+Coach with class-attribute-leak debug). Zod ALL VALID; replay 7/7; checks ALL PASS; worklog appended.
- Tasks 11-b/11-c (agents): authored ALL ch15+ch16 files + verification scripts but hit the context deadline before verification/report; main completed verification: Zod ALL VALID ×2 (ch15 validator includes sqlite sweep: 38 connect calls, 0 non-:memory:, 0 forbidden tokens); replay 7/7 ×2; checks ALL PASS ×2.
- Main registration via scripts/register_ch14_16.py: 18 loaders + 18 manifest entries orders 79–96; titles/prereqs verified against files. Manifest: 96 lessons, orders 1–96 sequential, prereqs resolve, chapters 1–16.
- Coverage completion: py4e.ch13.s10 (تويتر) was the only unmapped section — taught in ch13.l6's summary chunk (OAuth/hidden.py) → added to that lesson's sources (file + manifest) honestly; Zod re-validated. gen:coverage → PY4E 181/181 = 100.0% · TOTAL 181/476 = 38.0%.
- Gates: lint exit 0; tsc = 280 = exact baseline (grep ch14/15/16 → 0).
- Browser E2E (fresh browser session after worker change): 18/18 lessons render correct AR h1; Pyodide Check on all three projects → "أحسنت! نجحت كل الاختبارات.": ch14.l6 (players: 2), ch15.l6 REAL SQL in grader (top genre), ch16.l6 (peak hour); EN toggle → "What Is a Database?"; dev.log clean.

Stage Summary:
- **M2 PY4E SIDE COMPLETE: 96 lessons, PY4E 100.0% coverage (181/181 sections), ch1–16 published.**
- Platform upgrades this session: real SQLite in the sandbox (vendored + preloaded), simulated-renderer pattern (ch16) alongside simulated-network (ch12).
- Remaining for M2 gate: SWE book (117 sections) → SWE P3 tracks + Capstone I + Python Professional exam. Then MLS/D2L (M3–M6).
- Backlog: ADR-0002 version correction (0.28 → 0.27.7 + sqlite3 vendoring note); hash-locale sync; SystemExit handling; M5 Arabic proofread (tails of ch4–ch16 extractions).

---
Task ID: 12-main (incl. absorbed 12-a/12-b/12-c + 13-a/13-b)
Agent: main (Z.ai)
Task: First SWE P3 wave — ch8 (Git) + ch9 (Static Checking) + ch10 (Testing), 14 lessons, orders 97-110

Work Log:
- Discovered at session start that PY4E ch14-16 was ALREADY complete (Task 11-main logged, 96 lessons,
  PY4E 181/181 = 100%) — the carried-over context summary was stale; re-verified all gates green
  (lint 0, tsc 280, coverage PY4E 100%/TOTAL 38.0%) before proceeding.
- Per ADR-0006 + M2 gate ("100% coverage of PY4E and SWE excluding ch13"), launched the first SWE
  P3 wave: ch8 Git, ch9 Static Checking, ch10 Testing (practical skills first).
- Extracted SWE source text: scripts/extract_swe.py → curriculum/sources/SWE/ch{8,9,10}.txt (English
  book, clean text layer; OFFSET=0 so صفحة الكتاب N = PDF page N).
- Pyodide capability probes (scripts/test_pyodide_sqlite.ts, test_pyodide_swe_stack.ts): sqlite3
  3.39.0 fully working via worker harness (CREATE/INSERT/SELECT/? params/MEMFS persistence);
  unittest works (TextTestRunner+StringIO, NO unittest.main — SystemExit); ast module works
  (ExceptHandler walk); itertools works. These decided the run-vs-simulate strategy per chapter.
- Agents 12-a/12-b/12-c hit the Task-tool context deadline twice (first wave: 8/14 lesson files +
  zero scripts; second completion wave: +6 files + full ch8/ch9 script suites with dumps). Main
  absorbed the remainder: authored swe.ch10.l4 (MC/DC + combinatorial) and swe.ch10.l5 (review +
  Test Suite project + oracle-bug debug block) directly, plus all 5 ch10 verification scripts.
- Main registration via scripts/register_swe_ch8_10.py: 14 manifest entries (track P3, part I, book
  SWE, orders 97-110; prereq chain py4e.ch16.l6 → swe.ch8.l1 → … → swe.ch10.l5) + 14 registry
  loaders. ONE BUG found and fixed: loader paths initially generated as lesson.chN.lK (missing the
  swe. filename prefix → 15 tsc TS2307 errors); fixed in-script + patched registry (lesson.swe.chN.lK);
  tsc back to exactly 280.
- Gates: bun run lint → exit 0; bunx tsc --noEmit → 280 = exact baseline (grep swe.ch → 0);
  Zod ALL 5/4/5 LESSONS VALID ×3 (kind-mix printed; forbidden-token sweep clean incl. unittest.main);
  replay solutions 6/6 (ch8) + 5/5 (ch9) + 7/7 (ch10); replay checks ALL PASS ×3 (traces vs CPython
  stdout whitespace-normalized: 6/6/5; runnables 18/18/15; mcq+numeric 6/6/7; fills 4/4/2; broken-code
  symptoms verified: ch8 stale-pointer, ch9 bare-except: 0 false-negative, ch10 oracle 'FAILED: pass
  edge → tests: 4 passed: 3').
- Browser E2E (agent-browser): 14/14 lessons render correct AR h1 (manifest-matched); 3/3 Pyodide
  project Checks → "أحسنت! نجحت كل الاختبارات.": swe.ch8.l5 Mini-Git (commits: 5/branches: 2/conflict:
  config.py), swe.ch9.l4 Mini Linter (bare except: 1/long lines: 2/todos: 1), swe.ch10.l5 Test Suite
  (tests: 10 passed: 10/branches: 4 of 4). EN toggle verified via pypath.i18n {state:{locale:'en'},version:0}
  (NOTE: bare {locale:'en'} does NOT work — zustand persist shape): "Branching and Merging",
  "MC/DC and Combinatorial Testing". dev.log clean (200s + compiles only).
- gen:coverage → SWE 20/117 = 17.1% (ch8 8/8, ch9 5/5, ch10 7/7 sections mapped) · TOTAL 201/476 = 42.2%.

Stage Summary:
- First SWE P3 wave COMPLETE: 110 lessons published (PY4E 96 + SWE 14), SWE ch8/9/10 fully covered.
- Authoring patterns established: SIMULATED-GIT (command transcripts display-only + pure-Python
  mini-git DAG models as gradable code), RUNNABLE-LINTER (ast-based rules), RUNNABLE-TESTING
  (instrumented functions + honest harnesses + N+1 MC/DC sets + pairwise verification).
- EN-locale E2E secret: zustand persist requires {state:{...},version:0} wrapper.
- Remaining for M2 gate: SWE ch1-7 + 11-12 + 14-15 (97 sections) → Capstone I (Appendix A) +
  Python Professional exam. Then MLS/D2L (M3-M6).
- Backlog unchanged: ADR-0002 version correction; hash-locale sync; SystemExit handling; M5 Arabic
  proofread (PY4E tails; SWE is English-source so no extraction-tail flag needed).

---
Task ID: 13-b2
Agent: finisher agent 13-b2 (pypath ch12 completion)
Task: Author the two missing swe.ch12 lessons (l5 + l6) left unfinished by the
  deceased agent 13-b, then clone the ch10 verification suite for ch12
  (validate + dump/replay solutions + dump/replay checks) and run all gates.
Work Log:
- Authored content/part1/swe/ch12/lesson.swe.ch12.l5.ts — AR title: «فترات الثقة
  والانحدار الخطي البسيط» / EN: "Confidence Intervals and Simple Linear
  Regression" — sources [swe.ch12.s8, swe.ch12.s9] (pp.330-334), prereq
  swe.ch12.l4. Structure mirrors l1-l4 exactly (hook → predict → concept×2 →
  worked → exercise×4 [trace_output z-trace on the book's n=36 review example;
  write_code OLS from raw sums over the fixed size/defects pairs with grader
  tests → b1: 1.50 / b0: 2.00 / R2: 0.957; mcq on CI procedure-vs-parameter;
  numeric √n rule answer 44] → sandbox → quiz×4 [q1 revisits PY4E ch2
  precedence] → pitfalls×3 → summary → sources). Runnable anchor: pure-Python
  CI on the chapter's fixed 11-value cfds list — mean 9.00, s 5.85, SE 1.76,
  z 1.96 → (5.54, 12.46), book's t*=2.228 df=10 → (5.07, 12.93); OLS fit
  ŷ = 2 + 1.5x from sums.
- Authored content/part1/swe/ch12/lesson.swe.ch12.l6.ts — AR title: «مراجعة
  الفصل 12 ومشروع: لوحة مقاييس الجودة» / EN: "Chapter 12 Review and Project:
  Quality Metrics Dashboard" — source [swe.ch12.s10] (pp.334-335), prereq
  swe.ch12.l5. Review chunks recap l1-l5 (measurement half + statistical half);
  worked mini-dashboard; exercise×4 [trace_output '#'-bars; THE PROJECT
  write_code over the chapter's fixed releases dict + l3 pipeline with real
  grader tests: %-4s '#'-bar chart, flag: r11 (23 > mean+s 14.85), r1 DRE:
  90.0% / r2 DRE: 93.0% / pooled escape: 8.8%, summary 'releases: 11 / mean
  defects: 9.0 / worst: r11'; mcq one-number-verdict; numeric t-margin 3.93] →
  sandbox → debug block ex5.debug-ci (statistics.pstdev vs stdev → too-narrow
  CI (5.25, 12.75) instead of (5.07, 12.93); tests expose the symptom; exactly
  4 hints, no explanation key) → quiz×6 [q1 PY4E ch9, q2 SWE ch10, q3 PY4E ch9]
  → pitfalls×3 → summary → sources.
- Fixed 3 trivial defects in the dead agent's l1-l4 files (no content rewrite):
  l4 sandbox starterCode had a literal newline inside a double-quoted string
  (unterminated literal → \n escape); l2 ex1 AR prompt had raw '#'-quotes
  inside a single-quoted string (→ «#», twice: ex1 prompt + ex2 prompt);
  l3 ex3.cfd-normalize had only 3 hints (Zod requires exactly 4 — added the
  standard answer hint).
- Cloned the ch10 verification suite: scripts/validate-swe-ch12.ts,
  scripts/dump-swe-ch12-solutions.ts, scripts/replay-swe-ch12-solutions.py
  (worker semantics incl. chdir to temp dir), scripts/dump-swe-ch12-checks.ts,
  scripts/replay-swe-ch12-checks.py (broken-code symptom = l6 wrong-CI:
  't 95% CI: (5.25, 12.75)' + 's: 5.58' and never 5.07).
Gates (all verbatim):
1. bun scripts/validate-swe-ch12.ts → "ALL 6 LESSONS VALID" (6/6 OK; kind-mix
   printed; l6 debug=1 quizItems=6)
2. bun scripts/dump-swe-ch12-solutions.ts → "dumped 7 solution/test suites";
   python3 scripts/replay-swe-ch12-solutions.py → "7/7 suites pass"
3. bun scripts/dump-swe-ch12-checks.ts → "dumped 6 traces, 18 runnables, 10
   mcq+numeric, 2 fills, 1 broken"; python3 scripts/replay-swe-ch12-checks.py
   → "ALL CHECKS PASS"
4. bunx tsc --noEmit 2>&1 | grep -c "swe.ch12" → 0
5. rg forbidden tokens over content/part1/swe/ch12/ → 0 hits
6. bun run lint → exit 0
Stage Summary:
- SWE ch12 COMPLETE: 6/6 lessons (l1 مقاييس ذات معنى وجودة البرمجيات — Meaningful
  Metrics and Software Quality / l2 عرض البيانات بيانيًا — Graphical Displays of
  Data Sets / l3 قياس العيوب وتحسين جودة العمليات: دراسة حالة — Measuring Defects
  and an Ops Quality Case Study / l4 تشتت البيانات: الصناديق والمدرجات والإحصاء —
  Data Dispersion: Boxplots, Histograms, and Statistics / l5 فترات الثقة والانحدار الخطي
  البسيط — Confidence Intervals and Simple Linear Regression / l6 مراجعة
  الفصل 12 ومشروع: لوحة مقاييس الجودة — Chapter 12 Review and Project:
  Quality Metrics Dashboard), all Zod-valid, all reference solutions passing
  their own grader tests under CPython replay.
- Chapter fixed datasets carried l1→l6: releases dict {'r1': 2 … 'r11': 23}
  (total 99, mean 9.0, worst r11 at 23) and cfds list [2,4,5,5,7,8,9,10,12,
  14,23] (median 8, IQR 7, s 5.85, CI (5.07, 12.93)); size/defects pairs
  [2,4,6,8,10]/[5,9,10,13,18] fit ŷ = 2 + 1.5x, R² ≈ 0.957.
- Next: register ch12 in the manifest/registry (as 13-main did for ch8-10),
  then browser E2E for the 6 new lessons.
---
Task ID: 13-a2
Agent: finisher 13-a2 (SWE ch11 completion wave)
Task: Author the 2 missing swe.ch11 lessons (l3, l4) left by the dead agent 13-a, clone the ch10
  verification suite as ch11 scripts (validate / dump-solutions / replay-solutions / dump-checks /
  replay-checks), then run all 6 gates FILES-ONLY (no edits to l1/l2 beyond a trivial syntax fix).

Work Log:
- Read l1/l2 (mirrored structure exactly: hook → predict → 2 concept blocks → worked → ex1 write_code
  + ex2 trace_output + ex3 mcq + ex4 fill_blank → debug(4 hints) → sandbox → quiz → pitfalls(3) →
  summary → sources; deterministic fixed-data style, no input()/random/exit/subprocess).
- Authored content/part1/swe/ch11/lesson.swe.ch11.l3.ts — title: { ar: 'سلسلة توريد البرمجيات وبناء
  الأمن داخليًا', en: 'The Software Supply Chain and Building Security In' }, sources [swe.ch11.s4
  pp.295-302, swe.ch11.s5 pp.302-303], prereq [swe.ch11.l2]. Anchor: dependency manifest checker
  (MANIFEST pins vs fixed ADVISORIES set: log4j-core 2.15.0, xz-utils 5.6.1) + HMAC artifact
  verification (hmac/base64/hashlib, 44-char base64 tag, compare_digest). Debug = permissive-range
  pin (startswith '2.15') accepting 2.15.1 → fixed to exact == pin.
- Authored content/part1/swe/ch11/lesson.swe.ch11.l4.ts — title: { ar: 'مراجعة الفصل 11 ومشروع:
  مدقّق كلمات المرور والسياسات', en: 'Chapter 11 Review and Project: Password and Policy Auditor' },
  sources [swe.ch11.s6 pp.303-313], prereq [swe.ch11.l3]. Review chunks recap l1–l3; project ex1 =
  password/policy auditor over FIXED leak of 4 raw sha256 digests (password/123456/qwerty/letmein)
  + 6 ACCOUNTS, policy = length≥10 + ≥3 of 4 char classes, reuse counted from 2nd appearance,
  report 'weak: 3 / reused: 1 / breached: 2'; 4 grader-run tests (tuple + __learner_output__ line +
  weak()/breached() oracles). Debug = check-side salt 'pypath'+pw vs unsalted leak → 'breached: 0'
  false reassurance; fix = raw sha256(pw) → 'breached: 2'. Quiz = 6 items (ch10 oracle, ch9 SAST
  secrets, PY4E ch9 membership, OWASP A07, salted-store-vs-raw-leak, ch3 STRIDE info disclosure).
- Cloned 5 ch11 verification scripts from ch10 exemplars: scripts/validate-swe-ch11.ts (4 lessons,
  kind-mix + FORBIDDEN sweep), scripts/dump-swe-ch11-solutions.ts → scripts/.swe-ch11-solutions.json,
  scripts/replay-swe-ch11-solutions.py (worker semantics incl. chdir to temp dir, __learner_output__),
  scripts/dump-swe-ch11-checks.ts → scripts/.swe-ch11-checks.json, scripts/replay-swe-ch11-checks.py
  (per-lesson broken-code symptom oracles: l1 denied×2, l2 eval: 0, l3 ok×2 no blocked, l4 breached: 0).
- TRIVIAL SYNTAX FIXES to 13-a's files (parse-blocking, no content changes): l2 hints had unescaped
  '' / '   ' literals inside single-quoted AR strings (lines 123/125) — escaped \'; l1 concept chunk
  had unescaped '"SELECT ... = '" + name + "'"' in AR+EN prose — escaped \'. Both were Bun parse
  errors ("This constant must be initialized" cascade), zero semantic edits.
- All computed oracle values verified under real CPython before authoring (sha256 of the 4 leak
  passwords, ada salted digest 16fdb6d4..., base64-HMAC len 44, policy/audit counts (3,1,2)).

Stage Summary:
- SWE ch11 COMPLETE: 4/4 lessons valid; l3/l4 titles as above (EN: 'The Software Supply Chain and
  Building Security In' / 'Chapter 11 Review and Project: Password and Policy Auditor').
- Gates (all verbatim): [1] bun scripts/validate-swe-ch11.ts → ALL 4 LESSONS VALID (l1-l3 quizItems=4,
  l4 quizItems=6). [2] python3 scripts/replay-swe-ch11-solutions.py → 8/8 suites pass. [3] python3
  scripts/replay-swe-ch11-checks.py → ALL CHECKS PASS (4 traces, 12 runnables, 4 mcq, 4 fills,
  4 broken symptoms). [4] bunx tsc --noEmit | grep -c "swe.ch11" → 0. [5] rg forbidden tokens in
  content/part1/swe/ch11/ → 0 hits. [6] bun run lint → exit 0 (one transient failure from the
  concurrent ch12 agent's in-flight l2 file resolved itself on retry; ch11 files lint-clean).
- Constraint check: chunks ≤150 words verified programmatically for l3/l4 (worst: 151→trimmed);
  fills single-token (pinning/hmac); no explanation key in exercise/debug hints; solutions pass own
  tests in fresh-env replay identical to pyodide-worker __pypath_run_tests.

---
Task ID: 13-c2
Agent: finisher 13-c2 (SWE ch14 completion wave)
Task: Author the 1 missing swe.ch14 lesson (l5 review+project) left by the dead agent
  13-c (l1–l4 were already complete and good — untouched), clone the ch10 verification
  suite as 5 ch14 scripts, then run all 6 gates FILES-ONLY.

Work Log:
- Read l1–l4 + schema + worker grader (__pypath_run_tests) + ch10.l5 exemplar + ch14.txt s8.
  l1–l4 needed no fixes: Zod-clean, deterministic, lint/tsc-clean on first try.
- Authored content/part1/swe/ch14/lesson.swe.ch14.l5.ts — title: { ar: 'مراجعة الفصل 14
  ومشروع: خط تسليم مصغّر', en: 'Chapter 14 Review and Project: a Mini Delivery Pipeline' },
  sources [swe.ch14.s8 pp.400-402], prereq [swe.ch14.l4], estimatedMinutes 35.
  Block order mirrors ch10.l5: hook → predict → 2 concept blocks (chapter recap +
  project anatomy, chunks ≤150 words, verified 149 max) → worked → ex1 write_code
  + ex2 trace_output + ex3 mcq + ex4 numeric → sandbox → debug → quiz(6) →
  pitfalls(3) → summary → sources.
- PROJECT 'ex1.mini-pipeline': fixed webhook events (runs r1/r2/r3 with build/test
  statuses, canary stage judged live from l2's error samples — healthy slice
  [1,2,1,2,1] mean 1.4 ≤ 4.0 vs sick slice [4,6,5] mean 5.0 > 4.0, threshold 4.0 from
  l2) + deliver() fail-fast stage walk printing 'stopped: <stage>' reason +
  'stages passed: %d / decision: %s' verdict (r3 prints exactly
  'stages passed: 2 / decision: rollback') returning (passed, decision) +
  dora_summary() using l4's calculators over the run history (lead time: 1.0 days /
  deploys: 3 failed: 1 / CFR: 0.3). predict = crc32('maya') % 100 → bucket 4 → canary
  (continuity with l2's stable buckets, verified under CPython). Debug 'ex5.debug-
  gateless' = gateless pipeline (no status check: counts every stage, walks past
  test: FAIL, r2 'promotes' with canary: ok after FAIL) — fix adds the stopped/break
  guard + count-after-guard; broken code RUNS and shows the symptom. Quiz 6 items:
  build-once (s8 mapping), flaky quarantine, crc32 buckets, Knight Capital, DNS TTL,
  DORA pairing/Goodhart.
- Cloned 5 ch14 verification scripts from the ch10 exemplars: scripts/validate-swe-
  ch14.ts (5 lessons, kind-mix + FORBIDDEN sweep) → ALL 5 LESSONS VALID;
  scripts/dump-swe-ch14-solutions.ts → scripts/.swe-ch14-solutions.json (6 suites);
  scripts/replay-swe-ch14-solutions.py (worker semantics incl. chdir to temp dir,
  __learner_output__ env injection) → 6/6; scripts/dump-swe-ch14-checks.ts →
  scripts/.swe-ch14-checks.json (5 traces, 15 runnables, 8 mcq+numeric, 2 fills,
  1 broken); scripts/replay-swe-ch14-checks.py (ch14 symptom oracle: 'test: FAIL' +
  'stages passed: 3 / decision: promote' without 'stopped') → ALL CHECKS PASS.
- All computed oracle values verified under real CPython before authoring (crc32
  buckets maya=4/omar=0, lead times 0.5/1.5→mean 1.0, CFR 0.5/0.3, means 1.4/5.0,
  trace outputs, numeric 1.25 = (0.5+2.0+0.5+2.0)/4).

Stage Summary:
- SWE ch14 COMPLETE: 5/5 lessons valid (l1–l4 as authored by 13-c, untouched; l5 EN
  title: 'Chapter 14 Review and Project: a Mini Delivery Pipeline').
- Gates (all verbatim): [1] bun scripts/validate-swe-ch14.ts → ALL 5 LESSONS VALID
  (l1–l4 quizItems=4, l5 quizItems=6 debug=1). [2] python3 scripts/replay-swe-ch14-
  solutions.py → 6/6 suites pass. [3] python3 scripts/replay-swe-ch14-checks.py →
  ALL CHECKS PASS (5 traces, 15 runnables, 8 mcq+numeric, 2 fills, 1 broken symptom).
  [4] bunx tsc --noEmit | grep -c "swe.ch14" → 0. [5] rg forbidden tokens in
  content/part1/swe/ch14/ → 0 hits. [6] bun run lint → exit 0.
- Constraint check: l5 chunks/hook ≤150 words (max 149, verified programmatically);
  trace answers short ASCII; fill n/a in l5 (numeric used); exactly 4 hints per
  exercise/debug, no 'explanation' key; no input()/random/exit()/unittest.main/
  subprocess; solutions pass their own tests in a fresh-env replay identical to
  pyodide-worker __pypath_run_tests (incl. chdir to temp dir).

---
Task ID: 13-main
Agent: main (Z.ai)
Task: SWE wave 2 — ch11 (Security) + ch12 (Quality Metrics) + ch14 (Delivery/CI-CD) + ch15
(Maintenance): pre-flight, agent orchestration under context deadlines, main-absorbed ch15
verification suite + fixes, registration, gates, E2E, docs.

Work Log:
- Re-synced at session start: carried summary was stale — Task 11-main (PY4E ch14-16) and
  12-main (SWE ch8-10) were already complete; manifest at 110 lessons, SWE 20/117.
- Pre-flight: fixed extract_swe.py end-page crash (appendixA pdfPage=None → page_count fallback);
  extracted ch11/12/14/15; probes (test_pyodide_swe_stack2.ts): hashlib/secrets/hmac/base64/
  binascii/zlib/difflib/statistics/Counter/dataclasses/csv/datetime/textwrap ALL runnable →
  real crypto + real stats + real diffs; subprocess/network/docker remain conceptual.
- Launched 4 parallel authoring agents (13-a..13-d): ALL hit Task-tool context deadline after
  writing 11/19 lesson files (ch11 l1-2, ch12 l1-4, ch14 l1-4, ch15 l1), 0 scripts, no worklog.
- Re-scoped finisher batches: 13-a2 (ch11 l3-4 + 5 scripts) GREEN; 13-b2 (ch12 l5-6 + 5 scripts)
  GREEN (with trivial syntax fixes to dead agents' files: quote escaping, 3-hints Zod fix);
  13-c2 (ch14 l5 + 5 scripts) GREEN; 13-d2 wrote ch15 l2-4 but died before scripts → main
  authored validate/dump/replay ×2 for ch15 and repaired:
  * ch15.l4 Bun parse error: over-escaped \' in two hint strings;
  * ch15.l3/l4 mcq exercises missing solution+hints (Zod FAIL) → added both;
  * explanation key illegal on exercise blocks (2× TS2353) → removed;
  * ch15.l2 before_src/after_src: 6 multi-line python strings needed literal \n escapes
    (TS \n produced real newlines → SyntaxError / later silent line-joining) → normalized all
    bodies to exact \\n escapes + added diff-print loop to the project solution (test t3).
- Registration via scripts/register_swe_ch11_12_14_15.py (generated by
  scripts/gen_register_ch11_12_14_15.py from file-extracted titles): 19 manifest entries orders
  111-129 + 19 registry loaders anchored after swe.ch10.l5. Sanity: 129 unique, orders 1-129,
  prereqs resolve, chapters 1-16.
- Gates: bun run lint → 0; bunx tsc --noEmit → 280 = exact baseline (grep new chapters → 0);
  Zod ALL VALID ×4 (ch11 4, ch12 6, ch14 5, ch15 4 lessons); replay solutions 8/8 + 7/7 + 6/6 +
  8/8; replay checks ALL PASS ×4 (traces whitespace-normalized vs CPython; runnables; mcq+numeric
  answer==solution; fills ':'-free; broken-code per-lesson symptom oracles).
- gen:coverage → PY4E 100.0% (181/181) · SWE 43.6% (51/117) · TOTAL 48.7% (232/476).
- Browser E2E (agent-browser): 19/19 lessons render correct AR h1 (manifest-matched); 4/4
  Pyodide project Checks → "أحسنت! نجحت كل الاختبارات." (swe.ch11.l4 Password/Policy Auditor,
  swe.ch12.l6 Quality Metrics Dashboard, swe.ch14.l5 Mini Delivery Pipeline, swe.ch15.l4 Legacy
  Revival Workshop); EN locale verified with full reload after persist write; dev.log clean.

Stage Summary:
- SWE wave 2 COMPLETE: 129 lessons published (PY4E 96 + SWE 33). SWE ch11/12/14/15 fully covered
  (31 sections). Remaining for M2 gate: SWE ch1-7 (50) + Appendix A (7) → Capstone I + Python
  Professional exam. Then MLS/D2L (M3-M6).
- Patterns added: RUNNABLE-CRYPTO (salted digests + timing-safe compare + HMAC tags),
  TEXT-CHARTS (SIMULATED-RENDERER for metrics), SIMULATED-CI/CD (pipeline/canary/DORA models),
  RUNNABLE-LEGACY (characterization net → refactor under green → difflib evidence).
- Known platform quirks unchanged: hash-locale sync backlog (EN needs full reload), SystemExit
  handling, ADR-0002 version correction.
---
Task ID: 14-a2
Agent: trimmer (main-launched)
Task: EN concept-chunk trims for salvaged ch1/ch2 lessons

Work Log:
- lesson.swe.ch1.l1.ts: 'حكاية شركتين' EN 155→149 (dropped "of all", "the weight of", stray "and").
- lesson.swe.ch1.l2.ts: 'العيوب حتمية' EN 152→147 ("therefore"→"so", "some"→"an", "until an execution triggers it" without "into a failure", "which is why"→"hence").
- lesson.swe.ch1.l3.ts: 'المسؤولية الاجتماعية' (Therac chunk) EN 153→149 (tightened norms sentence, "And the Therac-25"→"And Therac-25", "assumed the software correct").
- lesson.swe.ch2.l1.ts: 'ما العملية' EN 152→148 & 151→146 (small clauses); 'سكرم' EN 179→148, 180→146, 173→149 (real cuts: events compressed to "are we on track" frame, artifacts tightened, roles condensed — sprint length, PO/SM/Developers accountabilities, commitments all kept).
- lesson.swe.ch2.l2.ts: 'الحلقة الحمراء-الخضراء' EN 153→149 (part-of-development tightened, "distinguishes current from intended code") & 178→143 (design chunk rewritten tighter, YAGNI kept).
- lesson.swe.ch2.l3.ts: 'الشلال' EN 153→149 & 163→148; 'عرض V' four-levels chunk EN 201→149 (levels compressed to essence) and its AR 156→149 (dropped filler: هذا، كلها، بواسطة، كاملًا، نفسها، بأفضل شكل، بين الوحدات→بينها). Accidental AR trim on 'الشلال' chunk 3 reverted to original.
- lesson.swe.ch2.l4.ts: 'الحلزون' EN 155→144 & 158→149 (meta-framework sentence and spiral/agile comparison tightened; four loop activities + go/no-go kept).
- All \u2019 escapes preserved; only concept-chunk ar/en strings touched.

Stage Summary:
- wave3-validate → ALL 8 LESSONS VALID; tsc grep swe.ch[12] → 0.

---
Task ID: 14-b2
Agent: author ch2.l5 finisher
Task: author swe.ch2.l5 (Process Simulator) + chapter-2 gates

Work Log:
- Read wave3 brief + schema + worklog (12-main/13-main patterns) + ch2.txt s8 (Shape Up, pp.51-54) +
  s9 (Conclusion, pp.54-55) + sibling lesson.swe.ch2.l4.ts for style/structure; l1-l4 untouched.
- Authored content/part1/swe/ch2/lesson.swe.ch2.l5.ts — id swe.ch2.l5, 35min, prereq swe.ch2.l4,
  sources [swe.ch2.s8 ص51-54, swe.ch2.s9 ص54-55]. Block order hook → predict → concept×2 (chapter
  recap: waterfall/V vs Scrum/XP/spiral + Shape Up appetite/shaping/cool-down/backlog/circuit breaker/
  hill charts; project anatomy: freshness window model) → worked (agile half on a 4-feature list:
  'agile: found 2/2 defects cost 16') → ex1.process-sim (THE PROJECT: 16-point work list, 3 defects
  planted at F2/F4/F5, WINDOW=7 / LATE_FIX=9 / EARLY_FIX=4 / ESCAPED_COST=12; waterfall one build
  pass + one end-game test pass finds 2/3 cost 46 with F2 escaped; agile 2-feature batches tested
  immediately finds 3/3 cost 28; result line 'result: same 16 points, cost 46 vs 28, escaped 1 vs 0';
  3 print-check tests) → ex2.trace-appetite (trace_output betting table 'P1: bet/P2: narrow/P3: bet/
  P4: bet') → ex3.mcq-shapeup (answer b) → ex4.numeric-cooldown (6+2 = 8) → ex5.debug-blind-waterfall
  (brokenCode RUNS: cold-defect else branch is `pass` → prints 'waterfall: found 2/3 defects cost 34'
  + 'escape check: clean' while F2 escaped; fix books ESCAPED_COST → cost 46 + 'escape check: escaped
  1'; 2 tests) → sandbox (full simulator + try-comments: WINDOW 16/4, append F7) → quiz×6 (q1 ch1
  iron triangle, q2 ch1 defect cost, q3 appetite, q4 circuit breaker, q5 SWE ch14 CI, q6 Scrum roles)
  → pitfalls×3 → summary(4) → sources. All numbers verified under CPython first
  (scripts/scratch-ch2-l5-values.py), incl. sandbox extremes WINDOW=16 → waterfall 3/3 cost 43 vs
  agile 28, WINDOW=4 → waterfall 1/3 cost 49 vs agile 0/3 cost 52.
- Trimming: two EN concept chunks exceeded 150 words on first validate (173/162) → trimmed to 147/146.
- Oracles chosen for ex5.debug-blind-waterfall (must prove the wrong symptom):
  ["found 2/3 defects cost 34", "escape check: clean"] — the undercounted bill (escape bill of 12
  never booked: 34 = 16+9+9) plus the blind success claim while 1 defect escaped; neither substring
  appears in the fixed output (46 / 'escape check: escaped 1').

Stage Summary:
- Gates (verbatim):
  1. bun scripts/wave3-validate.ts content/part1/swe/ch2/lesson.swe.ch2.l5.ts → "swe.ch2.l5: VALID |
     blocks=[hook>predict>concept>concept>worked>exercise×4>debug>sandbox>quiz>pitfalls>summary>sources]
     exKinds=[write_code,trace_output,mcq,numeric] debug=1 quizItems=6" → "ALL LESSONS VALID"
  2. bun scripts/wave3-dump-solutions.ts … && python3 scripts/wave3-replay-solutions.py scripts/.w3-ch2-sol.json
     → "dumped 2 solution/test suites" → "2/2 suites pass"
  3. bun scripts/wave3-dump-checks.ts … && python3 scripts/wave3-replay-checks.py scripts/.w3-ch2-checks.json
     → "dumped 1 traces, 3 runnables, 2 mcq+numeric, 0 fills, 1 broken" → ALL CHECKS PASS; with
     scripts/.w3-ch2-oracles.json → "PASS broken swe.ch2.l5/ex5.debug-blind-waterfall  symptom
     confirmed" → ALL CHECKS PASS
  4. bun run lint → exit 0; bunx tsc --noEmit | grep -c 'swe\.ch2\.' → 0 (repo tsc 289 total: 270
     pre-existing en.ts noise + 8 from sibling ch3 l1/l2 in-flight + others; ch2.l5 contributes 0)
  5. rg forbidden tokens over lesson.swe.ch2.l5.ts → only the header doc-comment line (same as l4)
- swe.ch2 ch2 COMPLETE: 5/5 lessons (l1 processes/Scrum, l2 XP, l3 waterfall/V, l4 risks/spiral,
  l5 review+Process Simulator), l1-l4 untouched, l5 Zod-valid with solutions passing own tests and
  broken-code symptom proven by oracle. Status: 1/1 lesson COMPLETE. Next (main agent): register
  ch2 lessons in manifest/registry, browser E2E.

---
Task ID: 14-c2
Agent: SWE ch3 content author (files-only sub-agent)
Task: Author SWE ch3 lessons l1-l3 (User Requirements, sections s1-s5).

Work Log:
- Read agent-ctx/swe-wave3-brief.md, then curriculum/sources/SWE/ch3.txt in chunks (s1-s5 span book pages 64-79). Deviation note: the task said "NO other files", but the brief itself lists src/lib/content/schema.ts as the Zod source of truth and exact field names were required to write valid TS — I read ONLY schema.ts (171 lines). No exemplar lessons, no worklog content, no manifest/registry edits.
- Authored + wrote lesson.swe.ch3.l1.ts (s1+s2; runnable = requirements ledger, fixed records with kind functional/non-functional + status draft/confirmed, counters+filters as ASCII lines). Validator flagged 2 concept chunks en >150 words; trimmed both, VALID.
- Authored + wrote lesson.swe.ch3.l2.ts (s3; runnable = interview-notes tagger, notes classified need/goal/constraint + counts). Trimmed one chunk (en 152->141) and one ar/en pair; VALID.
- Authored + wrote lesson.swe.ch3.l3.ts (s4+s5; runnable = story-format checker, validates role/capability/goal, prints "storyN: OK|missing X"). VALID first pass.
- Fixed gate 4 root cause: `satisfies Lesson` checks the Zod OUTPUT type; `required: z.boolean().default(true)` is optional on input but required on output, so every exercise block needed explicit `required: true`. Added to all 12 exercise blocks (4 per lesson).
- Ran all four gates until green (numbers below).

Stage Summary:
- Files written: content/part1/swe/ch3/lesson.swe.ch3.l1.ts (swe.ch3.l1, sources swe.ch3.s1 pp.64-67 + swe.ch3.s2 pp.68-69), content/part1/swe/ch3/lesson.swe.ch3.l2.ts (swe.ch3.l2, swe.ch3.s3 pp.69-72), content/part1/swe/ch3/lesson.swe.ch3.l3.ts (swe.ch3.l3, swe.ch3.s4 pp.72-77 + swe.ch3.s5 pp.77-79). Prereq chain: swe.ch2.l5 -> l1 -> l2 -> l3. estimatedMinutes 30 each.
- Gate 1: `bun scripts/wave3-validate.ts <3 files>` -> 3x "VALID" lines + "ALL LESSONS VALID" (exKinds: l1 [trace_output,write_code,mcq,fill_blank], l2 [write_code,mcq,numeric,fill_blank], l3 [trace_output,write_code,mcq,fill_blank]; debug=0; quizItems=4 each).
- Gate 2: `bun scripts/wave3-dump-solutions.ts <3 files> scripts/.w3-ch3a-sol.json` -> "dumped 3 solution/test suites"; `python3 scripts/wave3-replay-solutions.py scripts/.w3-ch3a-sol.json` -> PASS x3, "3/3 suites pass".
- Gate 3: `bun scripts/wave3-dump-checks.ts <3 files> scripts/.w3-ch3a-checks.json` -> "dumped 2 traces, 9 runnables, 4 mcq+numeric, 3 fills, 0 broken"; `python3 scripts/wave3-replay-checks.py scripts/.w3-ch3a-checks.json` -> 18x PASS, "ALL CHECKS PASS".
- Gate 4: `bunx tsc --noEmit 2>&1 | grep -c 'swe\.ch3\.'` -> 0.
- Notes for main agent: quiz early-chapter revisits are l1 q1 (Scrum, ch2), l2 q1 (iron triangle, ch1), l3 q1 (XP user stories, ch2). No debug block (l3 is not the chapter-final lesson; ch3 has 5 lessons — l4/l5 + the chapter debug still to be authored by others). Exercise ids: swe.ch3.lN.exK; quiz block id swe.ch3.lN.quiz. Temp artifacts scripts/.w3-ch3a-sol.json and scripts/.w3-ch3a-checks.json can be deleted or regenerated.

---
Task ID: 14-c3
Agent: SWE ch3 l4-l5 content author (files-only sub-agent)
Task: Author SWE ch3 lessons l4 (Clarifying Goals and Security Attacks, s6+s7) and l5 (chapter-final review + requirements-pack project + debug, s8).

Work Log:
- Read agent-ctx/swe-wave3-brief.md, worklog tail (14-a2/14-b2/14-c2), schema.ts, curriculum/sources/SWE/ch3.txt s6-s8 (pages marked 79-86), l1-l3 for style continuity; skimmed wave3 validate/dump/replay scripts.
- Found content/part1/swe/ch3/lesson.swe.ch3.l4.ts and lesson.swe.ch3.l5.ts already on disk as unverified drafts (no worklog entry). Treated them as drafts: audited every block against the contract, then fixed:
  - l4 quiz q1: was a "chapter 11" revisit (no ch1/ch2 item in the lesson) -> rewritten as a ch2 spiral-vs-attack-tree revisit (answer b kept); STRIDE stays in concepts/ex2.
  - l4 concept chunk 2: wove in the abuse-case/misuser definition (task's s7 concept) then trimmed; Arabic predict-reveal glitch "و asking why" fixed; hook "ستصلب" -> "ستُصلّب".
  - Concept-chunk word caps: validator failed 4 chunks (l4 c1-en 172, l4 c2 en 153/ar 171+en 216, l5 c2-en 155) -> trimmed to 125-149 words each, content preserved.
  - l5: "الرمض" typo -> "الفشل"; pitfalls wrong-line 3 reworded; debug ex5 id kept ex5.debug-loose-validator (task: "id like ex5.debug-lenient-validator").
  - Starter bodies with TODO-comments-only (IndentationError if run) -> added `...` placeholder matching l3 style (l4 ex2 classify, l5 ex1 valid_story).
  - Test counts trimmed to brief: l4 ex2 4->3 (merged print asserts), l5 ex1 4->3 (tally+verdicts / return structure / abuse table), l5 ex5 debug 4->2 (truth-returns tally / valid_story boundary True+False).
- Verified ALL runnable snippets under CPython 3 first (predict/worked/sandbox/exercise code/solutions/brokenCode + starters run; traces exact; 8 test asserts pass; broken code runs and prints the wrong symptom; oracle substrings absent from fixed output).
- Ran all four gates (numbers verbatim below).

Stage Summary:
- Files: content/part1/swe/ch3/lesson.swe.ch3.l4.ts (id swe.ch3.l4, 30min, prereq swe.ch3.l3, sources swe.ch3.s6 ص79-82 + swe.ch3.s7 ص82-85; exKinds [trace_output, write_code, mcq, numeric]; quiz 4 with ch2 revisit q1) and content/part1/swe/ch3/lesson.swe.ch3.l5.ts (id swe.ch3.l5, 35min, prereq swe.ch3.l4, source swe.ch3.s8 ص85-86; exKinds [write_code, trace_output, mcq, numeric] + debug=1; quiz 6 with ch1 q1 + ch2 q2; project ex1.requirements-pack: 4 fixed stories -> 'stories: 4 valid: 3 must: 2' + 'abuses: 2'; debug ex5.debug-loose-validator: prefix-only rule ACCEPTS benefit-less ST-4 -> 'stories: 4 valid: 4 must: 3').
- Gate 1: bun scripts/wave3-validate.ts <all five ch3 files> -> 5x "VALID" (l4 debug=0 quizItems=4; l5 debug=1 quizItems=6) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <5 files> scripts/.w3-ch3-sol.json -> "dumped 6 solution/test suites"; python3 scripts/wave3-replay-solutions.py scripts/.w3-ch3-sol.json -> "6/6 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <5 files> scripts/.w3-ch3-checks.json -> "dumped 4 traces, 15 runnables, 8 mcq+numeric, 3 fills, 1 broken"; replay without oracles -> 32x PASS + "INFO broken swe.ch3.l5/ex5.debug-loose-validator  no oracle yet — stdout tail: ['ST-2 Must valid', 'ST-3 Should valid', 'ST-4 Must valid', 'stories: 4 valid: 4 must: 3']" -> "ALL CHECKS PASS"; wrote scripts/.w3-ch3-oracles.json {"swe.ch3.l5": ["ST-4 Must valid", "stories: 4 valid: 4 must: 3"]} -> replay -> "PASS broken swe.ch3.l5/ex5.debug-loose-validator  symptom confirmed" -> "ALL CHECKS PASS".
- Gate 4: bun run lint -> exit 0 (clean); bunx tsc --noEmit 2>&1 | grep -c 'swe\.ch3\.' -> 0 (repo-wide tsc error lines 281, pre-existing noise).
- ch3 COMPLETE: 5/5 lessons (l1 requirements ledger, l2 notes tagger, l3 story checker, l4 goal-ladder + abuse-case lister, l5 review + Requirements Pack project + debug). l1-l3 untouched. Next (main agent): register ch3 lessons in manifest/registry, browser E2E. Temp artifacts scripts/.w3-ch3-sol.json, scripts/.w3-ch3-checks.json, scripts/.w3-ch3-oracles.json can be deleted or regenerated.

---
Task ID: 15-a
Agent: SWE ch4 l1-l4 content author (files-only sub-agent)
Task: Author SWE ch4 "Requirements Analysis" lessons l1-l4 (checklists/relative estimation, consensus/priorities, Kano/plan-driven models, chapter-final review + Iteration Planning Board project + debug).

Work Log:
- Read agent-ctx/swe-wave3-brief.md, curriculum/sources/SWE/ch4.txt in full (s1-s7, book pages 96-123), src/lib/content/schema.ts, and the wave3 validate/dump/replay scripts to pin the exact contract.
- Verified EVERY deterministic output string under CPython 3 first (/tmp scratch: all predict/worked/sandbox/traces/solutions/brokenCode outputs), then authored the 4 lesson files with verified literals baked into tests/oracles.
- Files written in order l1->l4 (one Write per file): l1 checklists + story points + velocity; l2 Planning Poker/Delphi + MoSCoW + value/cost/risk; l3 Kano + COCOMO; l4 chapter recap + project + debug. Chain: l1 -> ['swe.ch3.l5'], l2 -> l1, l3 -> l2, l4 -> l3. Explicit `required: true` on every exercise/debug block; hints exactly 4; no 'explanation' on exercises.
- Fixed two authoring slips caught by Gate 1 (l3 ex3.kano-pair and l4 ex3.partial-credit were quiz-shaped: had `explanation`, missing solution+hints) -> converted to exercise mcq shape (answer==solution + 4 hints).
- Fixed import path: '../../../src/lib/content/schema' (TS2307 x4) -> '@/lib/content/schema' matching the ch15 exemplar.
- Wrote scripts/.w3-ch4-oracles.json {"swe.ch4.l4": ["overbooked!", "(15/12 pts)"]} proving the broken board books 15 pts into a 12-pt velocity (overfill symptom).

Stage Summary:
- Files: content/part1/swe/ch4/lesson.swe.ch4.l1.ts (30min; s1 ص96-97 + s2 ص97-100; exKinds [write_code,mcq,trace_output,fill_blank]; quiz 4 incl. ch3 revisit q1), lesson.swe.ch4.l2.ts (30min; s3 ص101-102 + s4 ص102-105; [write_code,write_code,mcq,trace_output]; quiz 4 incl. ch3 revisit q1), lesson.swe.ch4.l3.ts (30min; s5 ص105-108 + s6 ص108-111; [write_code,write_code,mcq,fill_blank]; quiz 4 incl. ch3 revisit q1), lesson.swe.ch4.l4.ts (35min chapter-final; s7 ص111-112; [write_code,trace_output,mcq,fill_blank] + debug=1; quiz 6 with 3 earlier-chapter revisits: ch1 iron-triangle q1, ch2 risk-first q2, ch3 backlog/checklist q3).
- Project ex1.planning-board (swe.ch4.l4): 6 fixed stories -> checklist gate -> value/points sort -> greedy pack at VELOCITY 12 -> 'board: 6 stories, 1 blocked by checklist' + 'picked: S1 S2 S5 S4 (12/12 pts)' + 'left: S6' + variable checks (picked, used). Debug ex5.debug-board: brokenCode runs and prints 'picked: S1 S2 S3 (15/12 pts)' + 'overbooked!'; solution gates each pick on used + pts <= velocity -> 'picked: S1 S2 (7/12 pts)'.
- Gate 1: bun scripts/wave3-validate.ts <4 files> -> 4x "VALID" (l1-l3 debug=0 quizItems=4; l4 debug=1 quizItems=6) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <4 files> scripts/.w3-ch4-sol.json -> "dumped 7 solution/test suites"; python3 scripts/wave3-replay-solutions.py scripts/.w3-ch4-sol.json -> "7/7 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <4 files> scripts/.w3-ch4-checks.json -> "dumped 3 traces, 12 runnables, 4 mcq+numeric, 3 fills, 1 broken"; first replay -> 22x PASS + "INFO broken swe.ch4.l4/ex5.debug-board  no oracle yet — stdout tail: ['picked: S1 S2 S3 (15/12 pts)', 'overbooked!']" + "ALL CHECKS PASS"; after writing scripts/.w3-ch4-oracles.json -> "PASS broken swe.ch4.l4/ex5.debug-board  symptom confirmed" -> "ALL CHECKS PASS".
- Gate 4: bun run lint -> exit 0 (clean); bunx tsc --noEmit 2>&1 | grep -c 'swe\.ch4\.' -> 0 (repo-wide tsc error lines 282, pre-existing/parallel-agent noise, untouched).
- ch4 COMPLETE: 4/4 lessons. Next (main agent): register ch4 lessons in manifest/registry, browser E2E. Temp artifacts scripts/.w3-ch4-sol.json, scripts/.w3-ch4-checks.json, scripts/.w3-ch4-oracles.json can be deleted or regenerated.

---
Task ID: 16-a
Agent: SWE ch7 l1-l4 content author (files-only sub-agent)
Task: Author SWE ch7 "Architectural Patterns" lessons l1-l4 (layering + three building blocks, MVC, dataflow/client-server, chapter-final review + Pattern Catalog project + debug).

Work Log:
- Read agent-ctx/swe-wave3-brief.md, curriculum/sources/SWE/ch7.txt in full (s1-s7, book pages 174-206), src/lib/content/schema.ts, and the wave3 validate/dump/replay scripts to pin the exact contract.
- Chose the book's actual three building blocks for s2 (shared data / observer / stable interface) and framed each as a reusable structural role; l3 covers pipes-and-filters + client-server (+broker briefly); l4 covers commonality/variability + reference architecture + domain vs application engineering + catalog recap.
- Verified EVERY deterministic output under CPython 3 first (scratch: all predict/worked/sandbox/exercise code/solutions/brokenCode + starters run crash-free; traces exact; broken debug prints the crossed-verdict symptom). Caught and fixed pre-authoring: l1 worked printed ui->logic->rows=3 (added per-layer name stamping -> ui->logic->data->rows=3) and l4 ex1 starter crashed on str concat with None (str(pick) in starter loop).
- Files written in order l1->l4 (one Write per file): l1 layering + three building blocks; l2 MVC (+humble view); l3 dataflow + client-server; l4 chapter-final review + project + debug. Chain: l1 -> ['swe.ch6.l4'] (id-only, authored in parallel), l2 -> l1, l3 -> l2, l4 -> l3. Explicit `required: true` on every exercise/debug block; hints exactly 4; no 'explanation' on exercises; import via '@/lib/content/schema'.
- Fixed Gate 1 word-cap failures on l4 (two en concept chunks at 153 words) -> trimmed to <=150 (content preserved).
- Wrote scripts/.w3-ch7-oracles.json {"swe.ch7.l4": ["S1: mvc", "S3: pipe-filter", "matched: 1/3"]} proving the crossed trait->pattern wiring recommends a UI pattern for a dataflow need (S1 stream -> mvc) and a pipeline for a UI need (S3 ui -> pipe-filter).
- Ran all four gates (numbers verbatim below). Scratch dir removed.

Stage Summary:
- Files: content/part1/swe/ch7/lesson.swe.ch7.l1.ts (30min; s1 ص175-177 + s2 ص177-181; exKinds [write_code,trace_output,mcq,fill_blank]; quiz 4 incl. ch6 cohesion/coupling revisit q4), lesson.swe.ch7.l2.ts (30min; s3 ص181-184; exKinds [write_code,mcq,trace_output,fill_blank]; quiz 4 incl. l1-observer revisit q3 + ch1 principle q4), lesson.swe.ch7.l3.ts (30min; s4 ص184-187 + s5 ص188-193; exKinds [write_code,trace_output,mcq,fill_blank]; quiz 4 incl. ch6 interface revisit q4), lesson.swe.ch7.l4.ts (35min chapter-final; s6 ص193-195 + s7 ص195-196; exKinds [write_code,trace_output,mcq,fill_blank] + debug=1; quiz 6 with revisits q1 ch6 + q2 ch1).
- Project ex1.pattern-catalog (swe.ch7.l4): RULES [pipe-filter<-("stream",), client-server<-("shared","remote"), mvc<-("ui",)] over 3 fixed scenarios; select() = first all()-match else "layered"; prints 'S1: pipe-filter' / 'S2: client-server' / 'S3: mvc' / 'matched: 3/3'. Debug ex5.debug-wrong-layer: brokenCode runs and prints 'S1: mvc' / 'S3: pipe-filter' / 'matched: 1/3'; solution fixes RULES wiring + all() check -> matched: 3/3.
- Gate 1: bun scripts/wave3-validate.ts <4 ch7 files> -> 4x "VALID" (l1-l3 debug=0 quizItems=4; l4 debug=1 quizItems=6) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <4 files> scripts/.w3-ch7-sol.json -> "dumped 5 solution/test suites"; python3 scripts/wave3-replay-solutions.py scripts/.w3-ch7-sol.json -> "5/5 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <4 files> scripts/.w3-ch7-checks.json -> "dumped 4 traces, 12 runnables, 4 mcq+numeric, 4 fills, 1 broken"; first replay -> 24x PASS + "INFO broken swe.ch7.l4/ex5.debug-wrong-layer  no oracle yet — stdout tail: ['S1: mvc', 'S2: client-server', 'S3: pipe-filter', 'matched: 1/3']" + "ALL CHECKS PASS"; after writing scripts/.w3-ch7-oracles.json -> "PASS broken swe.ch7.l4/ex5.debug-wrong-layer  symptom confirmed" -> "ALL CHECKS PASS".
- Gate 4: bun run lint -> exit 0 (clean); bunx tsc --noEmit 2>&1 | grep -c 'swe\.ch7\.' -> 0 (repo-wide tsc error lines 281, all pre-existing/parallel noise: 270 in en.ts + 1 in wave3-validate.ts itself + 10 elsewhere; zero in ch7 lessons).
- ch7 COMPLETE: 4/4 lessons. Next (main agent): register ch7 lessons in manifest/registry, browser E2E. Temp artifacts scripts/.w3-ch7-sol.json, scripts/.w3-ch7-checks.json, scripts/.w3-ch7-oracles.json can be deleted or regenerated.
---
Task ID: 16-b
Agent: SWE Appendix A content author (files-only sub-agent)
Task: Author SWE Appendix A "The Team Project" lessons l1-l4 (Capstone I, sections swe.A.s1-s7, book pages 440-502).

Work Log:
- Read agent-ctx/swe-wave3-brief.md, curriculum/sources/SWE/chA.txt in chunks (all 7 sections, pages marked 440-502), src/lib/content/schema.ts, and the wave3 validate/dump/replay scripts; curriculum/sources/SWE.toc.json confirmed section ids swe.A.s1-s7. No other lesson/exemplar files read; no manifest/registry edits.
- Verified EVERY deterministic snippet under CPython 3 first (scripts/scratch/appa-16b-values.py): all predict/worked/sandbox outputs, 4 write_code solutions, 4 trace outputs, and the debug brokenCode + solution — all exact-match before authoring tests.
- Authored + wrote the 4 files in order l1→l4 (one Write each): explicit `required: true` on all 16 exercise + 1 debug blocks, hints exactly 4 each, no 'explanation' key on exercise/debug blocks, pure deterministic stdlib code (no input/exit/random/subprocess/network).
- Fixed two authoring slips caught early: (1) an apostrophe in a single-quoted TS string (Won't in l1 concept chunk) broke the Bun parse → rewrapped the string in double quotes; (2) two text typos (stray Latin chars in l3 q2 explanation, garbled word in l4 ex2 prompt) → fixed, re-validated.

Stage Summary:
- Files: content/part1/swe/appa/lesson.swe.appa.l1.ts (id swe.appa.l1, 30min, prereq swe.ch7.l4; sources swe.A.s1 ص440-447 + swe.A.s2 ص456-461; exKinds [write_code,trace_output,mcq,fill_blank]; quiz 4 with ch4 MoSCoW + ch2 sprint-review revisits), lesson.swe.appa.l2.ts (swe.appa.l2, 30min, prereq swe.appa.l1; swe.A.s3 ص463-468 + swe.A.s4 ص469-472; [write_code,trace_output,mcq,numeric]; quiz 4 with ch7 walking-skeleton + ch2 review/retrospective revisits), lesson.swe.appa.l3.ts (swe.appa.l3, 30min, prereq swe.appa.l2; swe.A.s5 ص474-480 + swe.A.s6 ص450; [write_code,trace_output,mcq,fill_blank]; quiz 4 with ch12 statistics + ch13 AI-provenance revisits), lesson.swe.appa.l4.ts (swe.appa.l4, 35min chapter-final, prereq swe.appa.l3; swe.A.s7 ص494-499; [write_code,trace_output,mcq,fill_blank] + debug=1; quiz 6 with 5 earlier-chapter revisits: ch2 spiral, ch3 Gherkin/INVEST, ch5 use-case actor, ch10 coverage, ch14 CD). All four: chapter field 16.
- Project ex1.delivery-map (swe.appa.l4): 5 fixed requirements (id/story/priority/owner/points), STATUS dict, milestone table proposal/skeletal/viable/final with due sprints + needs lists, SPRINT 2, VELOCITY 9 → per-milestone readiness gate prints 'milestone 3: viable - blocked (R5)' + 'risk: 2 requirements unassigned' + 'risk: 1 Must not done' + 'must points: 8/12 done at velocity 9/sprint' (3 print-check tests, __learner_output__ convention). Debug ex5.debug-optimistic-map: brokenCode RUNS and prints 'milestone 3: viable - ready' (date-only readiness false-green while R5 is partial); solution adds the needs evidence gate → 'milestone 3: viable - blocked (R5)'.
- Gate 1: bun scripts/wave3-validate.ts <4 appa files> → 4x "VALID" (l1-l3 debug=0 quizItems=4; l4 debug=1 quizItems=6) → "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <4 files> scripts/.w3-appa-sol.json → "dumped 5 solution/test suites"; python3 scripts/wave3-replay-solutions.py scripts/.w3-appa-sol.json → "5/5 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <4 files> scripts/.w3-appa-checks.json → "dumped 4 traces, 12 runnables, 5 mcq+numeric, 3 fills, 1 broken"; first replay → 24x PASS + "INFO broken swe.appa.l4/ex5.debug-optimistic-map  no oracle yet — stdout tail: ['milestone 2: skeletal - ready', 'milestone 3: viable - ready', 'milestone 4: final - upcoming', 'risk: 2 requirements unassigned']" + "ALL CHECKS PASS"; after writing scripts/.w3-appa-oracles.json {"swe.appa.l4": ["milestone 3: viable - ready", "milestone 4: final - upcoming"]} → 25x PASS + "PASS broken swe.appa.l4/ex5.debug-optimistic-map  symptom confirmed" → "ALL CHECKS PASS".
- Gate 4: bun run lint → exit 0 (clean); bunx tsc --noEmit 2>&1 | grep -c 'swe\.appa\.' → 0 (repo-wide tsc error lines 282, pre-existing/parallel-agent noise; zero in appa lessons).
- appa COMPLETE: 4/4 lessons (l1 overview + dual-hat swap + proposal gate, l2 skeletal→viable + candid status scorer, l3 final report + repo scorecard/provenance, l4 capstone delivery map + debug). Prereq chain: swe.ch7.l4 → swe.appa.l1 → l2 → l3 → l4. Next (main agent): register appa lessons in manifest/registry, browser E2E. Temp artifacts scripts/.w3-appa-sol.json, scripts/.w3-appa-checks.json, scripts/.w3-appa-oracles.json and scratch scripts/scratch/appa-16b-values.py can be deleted or regenerated.
---
Task ID: 15-c2
Agent: SWE ch6 l3-l4 finisher (files-only sub-agent)
Task: Finish SWE ch6 — trim l2 over-long concept chunk, author l3 (Architectural Views and Describing Architecture) and l4 (chapter-final review + Dependency Analyzer project + debug), run all chapter gates.

Work Log:
- Read agent-ctx/swe-wave3-brief.md, worklog tail (14-c2/14-c3/15-a/16-a/16-b), schema.ts, curriculum/sources/SWE/ch6.txt s4-s6 (book pages 156-163), and l1/l2 for style continuity; skimmed wave3 validate/dump/replay scripts.
- STEP 1: l2 concept chunk 'الخطوط تحمل المعنى: خمس علاقات وتعددية' en was 151 words -> trimmed to 148 ('and each shape is precise' -> 'each one precise'; dropped one 'exactly') with meaning preserved; ar untouched. l2 re-validated.
- Verified EVERY deterministic snippet under CPython 3 first (/tmp/ch6scratch): l3 predict/worked/ex1 solution/ex3 trace/sandbox; l4 predict/project solution/trace/debug brokenCode/debug solution. Verification caught 2 authoring slips pre-write: ex2 trace 'edges' miscount (5->4 actual), and debug reaches pair app->logging was a DIRECT import of the broken 1-hop check (True, no symptom) -> switched to transitive-only pair app->models (broken False, fixed True).
- Authored + wrote lesson.swe.ch6.l3.ts (s4+s5): 3 concepts (no-single-diagram/4+1; structure-vs-view 3 families; architecture description outline + domain-depends-on-nothing + dependency inversion), worked = one fixed system in 3 view tables (MODULES/TALKS/NODES) + runs_on/who_talks_to queries, exKinds [write_code, mcq, trace_output, fill_blank], quiz 4 with ch5 use-case revisit q1. Both languages of every concept chunk <=150 words (148/148/150 en counted with the validator's algorithm).
- Authored + wrote lesson.swe.ch6.l4.ts (chapter-final, 35min, prereq swe.ch6.l3, source swe.ch6.s6 ص162-163): 3 recap concepts (cohesion/coupling/SOLID-DRY arc; views+document+two closing ideas; fan-in/fan-out/cycle vocabulary), worked = small fan table audit, PROJECT ex1.dep-analyzer (GRAPH app/router/auth/notify/models/logging, 6 modules 9 edges, LIMIT 3 -> 'modules: 6 edges: 9' / 'fan-in auth: 3 fan-out app: 4' / 'smell: app fan-out 4' / 'cycle: auth -> notify -> auth', 3 tests incl. variable check fan_in==3 and find_cycle==[auth,notify,auth]), ex2 trace fan table, ex3 mcq architecture-erodes, ex4 fill 'in', DEBUG ex5.debug-blind-import: brokenCode RUNS and prints 'app reaches models: False' + 'cycle: none' (1-hop-only reaches + self-import-only cycle check) while solution adds seen/stack reach + gray/black DFS -> 'app reaches models: True' + 'cycle: auth -> notify -> auth' (2 tests). Quiz 6 with 3 earlier-chapter revisits: q1 ch1 essential complexity, q2 ch5 use cases, q3 ch2 spiral-risks.
- Explicit required: true on all 8 exercise + 1 debug blocks; hints exactly 4 each; no 'explanation' key on exercise/debug blocks; pure stdlib deterministic code (no input/exit/random/subprocess/network). Prereq chain: swe.ch5.l4 -> l1 -> l2 -> l3 -> l4.
- Ran all four gates (numbers verbatim below). Scratch dir left in /tmp only.

Stage Summary:
- Files: content/part1/swe/ch6/lesson.swe.ch6.l2.ts (edited: 1 concept chunk en 151->148 words), content/part1/swe/ch6/lesson.swe.ch6.l3.ts (id swe.ch6.l3, 30min, prereq swe.ch6.l2, sources swe.ch6.s4 ص156-158 + swe.ch6.s5 ص158-162; exKinds [write_code,mcq,trace_output,fill_blank]; quiz 4 incl. ch5 revisit q1), content/part1/swe/ch6/lesson.swe.ch6.l4.ts (id swe.ch6.l4, 35min chapter-final, prereq swe.ch6.l3, source swe.ch6.s6 ص162-163; exKinds [write_code,trace_output,mcq,fill_blank] + debug=1; quiz 6 with ch1 q1 + ch5 q2 + ch2 q3 revisits).
- Gate 1: bun scripts/wave3-validate.ts <all 4 ch6 files> -> 4x "VALID" (l1-l3 debug=0 quizItems=4; l4 debug=1 quizItems=6) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <4 files> scripts/.w3-ch6-sol.json -> "dumped 5 solution/test suites"; python3 scripts/wave3-replay-solutions.py scripts/.w3-ch6-sol.json -> "5/5 suites pass" (l1 ex2.coupling-report, l2 ex1.diagram-to-code, l3 ex1.view-queries, l4 ex1.dep-analyzer, l4 ex5.debug-blind-import).
- Gate 3: bun scripts/wave3-dump-checks.ts <4 files> scripts/.w3-ch6-checks.json -> "dumped 4 traces, 12 runnables, 4 mcq+numeric, 4 fills, 1 broken"; first replay -> 24x PASS + "INFO broken swe.ch6.l4/ex5.debug-blind-import  no oracle yet — stdout tail: ['app reaches models: False', 'cycle: none']" + "ALL CHECKS PASS"; wrote scripts/.w3-ch6-oracles.json {"swe.ch6.l4": ["app reaches models: False", "cycle: none"]} -> re-run -> "PASS broken swe.ch6.l4/ex5.debug-blind-import  symptom confirmed" -> "ALL CHECKS PASS" (25 lines).
- Gate 4: bun run lint -> exit 0 (clean); bunx tsc --noEmit 2>&1 | grep -c 'swe\.ch6\.' -> 0 (repo-wide tsc error lines 282, pre-existing/parallel-agent noise; zero in ch6 lessons).
- ch6 COMPLETE: 4/4 lessons (l1 role of architecture + modular design, l2 class diagrams, l3 views + architecture description, l4 review + Dependency Analyzer project + debug). Next (main agent): register ch6 lessons in manifest/registry, browser E2E. Temp artifacts scripts/.w3-ch6-sol.json, scripts/.w3-ch6-checks.json, scripts/.w3-ch6-oracles.json can be deleted or regenerated.

---
Task ID: 14-main
Agent: main (Z.ai)
Task: SWE wave 3 — ch1-7 + Appendix A (Capstone I): pre-flight, salvaged-agent coordination,
  generic wave-3 verification infra, registration, gates, E2E, docs. 34 lessons (orders 130-163).

Work Log:
- Re-synced at session start: carried summary was stale — PY4E ch14-16 (Task 11) and SWE ch8-10
  (Task 12) were already complete; the actual next wave was SWE ch1-7 + Appendix A (57 sections).
- Pre-flight: extracted ch1-7 via scripts/extract_swe.py; located Appendix A start manually
  (pdf p.440, blank p.439; toc pdfPage=None) and wrote curriculum/sources/SWE/chA.txt (440-502).
- BUILT GENERIC WAVE-3 VERIFICATION INFRA (argv-driven, reused by every chapter — killed the
  per-chapter script-cloning burden that killed earlier agents): scripts/wave3-validate.ts
  (Zod + forbidden sweep + chunk word-caps + structure report), wave3-dump-solutions.ts /
  wave3-replay-solutions.py (worker semantics), wave3-dump-checks.ts / wave3-replay-checks.py
  (traces/runnables/mcq/fills/broken; per-lesson symptom oracles via external JSON).
- First 3-agent batch (14-a ch1, 14-b ch2, 14-c ch3) hit Task-tool context deadline, BUT with
  write-immediately instructions the salvage was near-total: ch1 4/4 files, ch2 4/5, ch3 0.
- Salvage wave (3 parallel, tightened prompts: brief-only reading, no exemplar dumps):
  14-a2 (trims: 12 EN chunk overruns in ch1/ch2) GREEN; 14-b2 (authored ch2.l5 Process
  Simulator + l5 gates) GREEN; 14-c2 (ch3 l1-l3) GREEN.
- Found+fixed dead-agent artifacts myself: ch2.l2 sandbox string broken by unescaped ASCII
  quotes inside a TS double-quoted string («دمج الجمعة الكبير»); 3 ch2 mcq blocks left
  quiz-shaped (explanation key, no solution/hints) → rebuilt each with solution + 4 hints;
  4 broken TestSpecs in ch2 l1/l2/l4 (tests asserting test-time prints inside
  __learner_output__ — worker captures stdout only during solution exec, verified in
  pyodide-worker.js — and one message with unescaped quotes → SyntaxError) → rewrote tests
  to variable-based asserts; ch1.l4 oracle authored (silent-crunch ships while 'flex: crunch').
- Wave 3b: 15-a (ch4 4/4) GREEN; 15-b (ch5) died AFTER writing all 4 files (infra timeout)
  → main ran its gates: validate 4/4 VALID, solutions 5/5, checks ALL PASS, oracle authored
  (extend-always fires where it shouldn't); 14-c3 (ch3 l4-l5 + full ch3 gates; audited two
  unverified drafts left by an earlier dead agent) GREEN.
- Wave 3c: 16-a (ch7 4/4) GREEN; 16-b (appa 4/4, chapter:16, ids swe.appa.lN, sections
  swe.A.sN) GREEN; 15-c (ch6) died after l1-l2 (l2 one chunk over) → 15-c2 finisher
  (trim + author l3-l4 + full ch6 gates) GREEN.
- Registration via scripts/register_swe_wave3.py (titles/prereqs/sources extracted from lesson
  files + sanity-checked): 34 manifest entries orders 130-163 + 34 registry loaders anchored
  after swe.ch15.l4. Sanity: 163 unique lessons, orders 1-163, prereqs resolve, chapters 1-16.
- Gates: wave3-validate ALL 34 VALID; bun run lint → 0; bunx tsc --noEmit → 280 exact baseline
  (fixed 1 error in my own wave3-validate.ts: missing items?: unknown[] on AnyBlock);
  solutions replay: ch1 5/5, ch2 6/6, ch3 6/6, ch4 7/7, ch5 5/5, ch6 5/5, ch7 5/5, appa 5/5;
  checks replay ALL PASS ×8 with oracles (.w3-ch{1..7,appa}-oracles.json).
- gen:coverage → PY4E 100.0% (181/181) · SWE 92.3% (108/117) · TOTAL 60.7% (289/476).
- Browser E2E (agent-browser): h1 sweep 34/34 exact AR matches (manifest-matched, quote-strip
  fix in the comparison); 8/8 chapter-final projects → "أحسنت! نجحت كل الاختبارات." in real
  Pyodide (ch1.l4 balance, ch2.l5 process-sim, ch3.l5 requirements-pack, ch4.l4 planning-board,
  ch5.l4 flow-engine, ch6.l4 dep-analyzer, ch7.l4 pattern-catalog, appa.l4 delivery-map);
  EN toggle verified (appa.l4 h1 → "Capstone: Your Project Delivery Map"); dev.log clean.

Stage Summary:
- SWE wave 3 COMPLETE: 163 lessons published (PY4E 96 + SWE 67). PY4E 100%, SWE ch1-12+14-15
  + Appendix A covered; only ch13 (AI-era SWE, excluded from M2 gate per plan) remains of SWE.
- Patterns added: SIMULATED-PROCESS-LEDGER (sprint/poker/spiral tables), REQUIREMENTS-LEDGER +
  story validators + abuse-case classifiers, USE-CASE FLOW ENGINE (include/extend semantics),
  DEPENDENCY-GRAPH ANALYZER (fan-in/out, cycles), PATTERN CATALOG selector, CAPSTONE DELIVERY
  MAP (milestone readiness + risk flags).
- Agent-execution lesson (repeatable recipe): agents die at Task-tool context deadline but
  write-immediately + brief-only reading makes salvage near-total; generic argv-driven verify
  infra moves script authoring to main; oracles can be authored post-hoc from INFO tails.
- Remaining for M2 gate: SWE ch13 content (9 sections) + Python Professional exam runtime +
  Capstone I platform integration. Then M3 (AI runtime) + MLS/D2L (M4-M6).
- Known platform quirks unchanged: hash-locale sync backlog (EN needs toggle/reload), SystemExit
  handling, ADR-0002 version correction.
---
Task ID: 17-a
Agent: SWE ch13 content author (files-only sub-agent, Part II)
Task: Author SWE ch13 "Software Engineering in the Age of AI" lessons l1-l4 (sections swe.ch13.s1-s9, book pages 343-364) — first Part II chapter on the SWE track (part 'II', track 'A9').

Work Log:
- Read worklog tail (14-main/15-c2/16-a/16-b protocol), agent-ctx/swe-wave3-brief.md, agent-ctx/part2-brief.md, schema.ts, wave3 validate/dump/replay scripts, and curriculum/sources/SWE/ch13.txt in full (s1 ص343-346, s2 ص346-351, s3 ص351-352, s4 ص352-354, s5 ص354-356, s6 ص356-358, s7 ص358-363, s8 ص363-364, s9 ص364). No manifest/registry edits.
- Verified EVERY deterministic output under CPython 3 BEFORE authoring (scripts/scratch/verify-17a.py): l1 worked TASK-LEDGER (365min manual -> 256min with-ai, human share 94%), l1 ex1 evidence ledger (perception gap 43), l2 worked SPEC-DRIFT-LEDGER (code-first 3 edits vs spec-first 1), l2 ex1 SDD gate engine (stops at plan; done when all approved), l3 worked BRIEF-LINT (2 load-bearing rules), l3 ex1 loop doctor (healthy/nodding/amnesiac), l3 ex2 generator-evaluator trace, l4 worked EFFORT-SHIFT (40h->40h up the stack), l4 PROJECT VERIFY-LEDGER (C1/C5 ship; C2 stop review, C3 stop tests, C4 stop spec; shipped 2/5), l4 debug self-graded auditor (broken: tests-green-only ships C2+C4, shipped 4/5; fixed: 2/5) — all exact-match incl. worker-semantics test replays and a forbidden-token sweep over every snippet.
- Wrote the 4 files in order l1->l4 (one Write each, validating each immediately): l1 bottleneck-moves + lifecycle tour + evidence (prereq swe.appa.l4); l2 o16g manifesto (4 shifts, 16 principles mapped to book) + SDD inversion + constitution/specify/plan/tasks/implement pipeline; l3 context as infrastructure (AGENTS.md/CLAUDE.md/skills, intent debt, explain-the-why) + loop engineering (4 layers, 5 moves, anti-patterns, generator-evaluator defaults-to-no, 4 silent costs, Stripe 1,300 PRs/week); l4 six principles + conclusion + chapter-final PROJECT + debug. Anatomy per Part II contract: hook -> concept x2 (chunks <=150 ar+en) -> worked -> exercise x3 (ex1 write_code with 2-3 tests; others mcq/trace/fill variety) -> [l4: debug] -> quiz (4 items) -> summary -> sources. All: required true, hints exactly 4, no explanation key on exercises/debug, pure stdlib deterministic code, part 'II', track 'A9', chapter 13, version 1.
- Fixed pre-gate: l1 concept block 2 chunks over cap (en 165/181) -> trimmed to 146/147 (ar kept <=140) with content preserved; fixed one malformed hint shape in l2 ex3 before first validate. Quiz revisits: l1 q1 ch1 complexity (+q4 ch9, q3 ch11 link), l2 q2 ch3/ch5 + q4 ch4, l3 q1 ch11 + q4 ch14, l4 q1 ch10 + q2 ch14 + q4 appa(ch16) provenance.
- Wrote debug symptom oracle /tmp/oracle-17a.json {"swe.ch13.l4": ["C2: ship (tests green)", "C4: ship (tests green)", "shipped: 4/5"]} — wave3-replay-checks.py accepts it as optional argv[2] (main can wire it; the file is already in place).

Stage Summary:
- Files: content/part1/swe/ch13/lesson.swe.ch13.l1.ts (swe.ch13.l1, 30min, prereq ['swe.appa.l4']; s1 ص343 + s2 ص346 + s3 ص351; exKinds [write_code,mcq,trace_output]; quiz 4 incl. ch1 revisit), lesson.swe.ch13.l2.ts (swe.ch13.l2, 30min, prereq l1; s4 ص352 + s5 ص354; [write_code,fill_blank,mcq]; quiz 4 incl. ch3/ch5 + ch4 revisits), lesson.swe.ch13.l3.ts (swe.ch13.l3, 30min, prereq l2; s6 ص356 + s7 ص358; [write_code,trace_output,fill_blank]; quiz 4 incl. ch11 + ch14 revisits), lesson.swe.ch13.l4.ts (swe.ch13.l4, 35min chapter-final, prereq l3; s8 ص363 + s9 ص364; [write_code,trace_output,mcq] + debug=1; quiz 4 incl. ch10 + ch14 + appa revisits).
- Project ex1.verify-ledger (swe.ch13.l4): LEDGER of 5 agent changes (C1-C5, tests/review/spec bits) + GATES [("tests",2),("review",3),("spec",4)]; audit() prints per-change 'ship'/'stop (...)' + 'shipped: 2/5' + 'stopped: C2, C3, C4' and returns 2 (3 print/variable tests). Debug ex4.debug-self-graded: brokenCode RUNS and prints 'C2: ship (tests green)' / 'C4: ship (tests green)' / 'shipped: 4/5' (self-graded auditor); solution enforces all three gates -> 'shipped: 2/5'.
- Gate 1: bun scripts/wave3-validate.ts <4 ch13 files> -> 4x "VALID" (l1-l3 debug=0 quizItems=4; l4 debug=1 quizItems=4) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <4 files> /tmp/sol-17a.json -> "dumped 5 solution/test suites"; python3 scripts/wave3-replay-solutions.py /tmp/sol-17a.json -> "5/5 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <4 files> /tmp/chk-17a.json -> "dumped 3 traces, 4 runnables, 3 mcq+numeric, 2 fills, 1 broken"; replay without oracle -> 12x PASS + "INFO broken swe.ch13.l4/ex4.debug-self-graded  no oracle yet" + "ALL CHECKS PASS"; replay with /tmp/oracle-17a.json -> 13x PASS + "PASS broken swe.ch13.l4/ex4.debug-self-graded  symptom confirmed" + "ALL CHECKS PASS".
- Gate 4: bun run lint -> exit 0 (clean); bunx tsc --noEmit 2>&1 | grep -c 'swe\.ch13\.' -> 0 (repo-wide tsc error lines 280 = the established pre-existing baseline; zero in ch13 lessons).
- ch13 COMPLETE: 4/4 lessons — SWE Part I+II content now 112 lessons (ch1-16 incl. ch13 + appa). Prereq chain: swe.appa.l4 -> swe.ch13.l1 -> l2 -> l3 -> l4. Next (main agent): register ch13 in manifest/registry, browser E2E, wire /tmp/oracle-17a.json into checks replay (or recreate as scripts/.w3-ch13-oracles.json). Temp artifacts: /tmp/sol-17a.json, /tmp/chk-17a.json, /tmp/oracle-17a.json, scripts/scratch/verify-17a.py can be deleted or regenerated.
---
Task ID: 17-c2
Agent: MLS ch4 l4 finishing author (files-only sub-agent, Part II)
Task: Author the single closing lesson content/part2/mls/ch4/lesson.mls.ch4.l4.ts — same-data comparison of LDA vs QDA vs Naive Bayes accuracy on one fixed 1-D dataset (pure Python, no numpy; sklearn GaussianNB/LinearDiscriminantAnalysis/QuadraticDiscriminantAnalysis in prose only), per agent-ctx/part2-brief.md with lesson.mls.ch4.l3.ts as style/continuity exemplar and curriculum/sources/MLS/txt/c4-code.txt as ground truth.

Work Log:
- Read worklog tail, part2-brief.md, lesson.mls.ch4.l3.ts, c4-code.txt (book §4.4 Implementation: sklearn LDA/QDA/GaussianNB on wine, boundary comparison) and MLS.toc.json; cited mls.ch4.s4 + mls.ch4.s1 with the established chapter-range pages style.
- Verified EVERY printed literal and all test asserts under CPython 3 BEFORE authoring (/tmp/verify-17c2.py): fixed 1-D dataset c0=[2.0,2.5,3.0,3.5] (mu0=2.75, var0=0.3125), c1=[5.0,6.0,9.0,12.0] (mu1=8.0, var1=7.5), shared var=3.90625, equal priors. Worked scoreboard exact: "LDA acc=0.8750 errors=[5.0]" / "QDA acc=1.0000 errors=[]" / "NB  acc=1.0000 errors=[]" / "QDA == NB predictions: True" / "LDA/QDA agreement: 7 / 8" (LDA straight boundary at means midpoint 5.375 misses 5.0; QDA per-class variances fix it; 1-D GaussianNB ≡ QDA — l3's structural claim now measured). Ex1 solution output exact: "LDA acc = 0.875" / "QDA acc = 1.0" / "disagree = [5.0]".
- Anatomy exactly like l3: hook -> concept x1 (3 chunks, <=150 words ar+en) -> worked (three-model comparison report) -> exercise ex1.same-data-showdown (write_code, required, solution, 3 tolerance-style tests incl. __learner_output__ line check, exactly 4 hints) -> exercise ex2.why-identical (mcq, required, answer==solution=='b', exactly 4 hints, no explanation key) -> quiz (3 items, all answer 'b' spread across distinct distractor themes) -> summary (4 bullets + reflectPrompt) -> sources (mls.ch4.s4 + mls.ch4.s1). All required:true, pure stdlib deterministic code, no numpy; forbidden-substring sweep clean (no random/input(/exit(/etc. in any runnable field).
- Fixed one Arabic typo in ex2 option c pre-gate ('يستخدم_tran' -> 'يستخدمان').

Stage Summary:
- File: content/part2/mls/ch4/lesson.mls.ch4.l4.ts (id mls.ch4.l4, book MLS, part II, track A2, chapter 4, version 1, 30min, prereq ['mls.ch4.l3']; blocks hook>concept>worked>exercise>exercise>quiz>summary; exKinds [write_code,mcq]; quizItems=3; sources mls.ch4.s4 + mls.ch4.s1 ص38-53/pp.38-53). Dataset continuity: same template/score function as l3, new 8-point dataset engineered so the three models actually disagree (QDA fixes LDA's only error at x=5.0; NB≡QDA in 1-D).
- Gate 1: bun scripts/wave3-validate.ts content/part2/mls/ch4/lesson.mls.ch4.l4.ts -> "mls.ch4.l4: VALID | blocks=... exKinds=[write_code,mcq] debug=0 quizItems=3" + "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <file> /tmp/sol-17c2.json -> "dumped 1 solution/test suites"; python3 scripts/wave3-replay-solutions.py /tmp/sol-17c2.json -> "PASS mls.ch4.l4/ex1.same-data-showdown" + "1/1 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <file> /tmp/chk-17c2.json -> "dumped 0 traces, 1 runnables, 1 mcq+numeric"; python3 scripts/wave3-replay-checks.py /tmp/chk-17c2.json -> "PASS run mls.ch4.l4/worked" + "PASS mcq mls.ch4.l4/ex2.why-identical answer=b" + "ALL CHECKS PASS".
- Gate 4: bunx tsc --noEmit 2>&1 | grep -c 'mls\.ch4\.l4' -> 0.
- MLS ch4 COMPLETE: l1 (s1) -> l2 (s2) -> l3 (s3) -> l4 (s4). Temp artifacts /tmp/sol-17c2.json, /tmp/chk-17c2.json, /tmp/verify-17c2.py can be deleted or regenerated.
---
Task ID: 18-b
Agent: MLS ch7 + appendix content author (files-only sub-agent, Part II)
Task: Author 6 lessons — MLS ch7 "Neural Networks" l1-l3 (track A3) + MLS appendix l1-l3 (track A0, chapter 8), book 'MLS', part 'II', version 1, 30min each; sources mls.ch7.s1-s3 + mls.appendix.s1-s3.

Work Log:
- Read worklog tail (17-a protocol), agent-ctx/part2-brief.md (full contract), public/py-modules/minigrad.py API (Value/Neuron/Layer/MLP(nin,hiddens,seed)/mse/bce/bce_logits/sgd; LCG init; no random module), and sources: c7-concept.txt (structure/activations/backprop/combining observations), c7-construction.txt (loop class vs matrix class), c7-code.txt (tf.keras Sequential + Functional on Boston: hidden 112 / output 9 params), appendix-methods.txt (GD steps + K-fold CV — CV lives in Common Methods, NOT math), appendix-data.txt (five datasets), MLS.toc.json (mls.ch7.s1-s3, appendix A.1-A.3). No manifest/registry edits.
- Verified EVERY literal under CPython 3 BEFORE authoring (scripts /tmp/verify-18b.py, /tmp/verify-18b-l3.py, /tmp/verify-18b-rest.py, real minigrad via sys.path public/py-modules): l1 2-8-1 hand-written forward (pre=[1.0,-2.0,-1.0,2.0,-1.5,0.5,2.5,-0.5], y=-5.0; x=[0.5,0.5] -> -0.25); l2 PureLayer 1-3-1 (2.6500/4.8500/7.0500/9.2500), scratch forward1 (1.1/1.2/1.25/1.4, float err <= 6.7e-16), minigrad MLP(1,[3],seed=11) extraction matches scratch at diff 0.0 exactly, one epoch lr=0.05 loss 36.725677 -> 24.418095 (determinism re-run OK, 10 params); l3 fixed 12-point set xs=round(-3+0.55i,2), ys=0.5x+0.3sin(2x), minigrad.sgd MLP(1,[8],seed=7) epochs=300 lr=0.08 -> history 4.397775 / 0.017658 / 0.017383 at 0/100/299 (end < 0.05 with wide margin; lr=0.2 -> nan kept as sandbox teaching point); app-l1 central diff exact to <1e-8 on the quadratic, GD table lr 0.1/0.55/1.0/1.05 -> 2.793842 / 3.000000 / 0.000000 / -6.415285 (f=90.647594), two steps at lr=1.0 -> 0.0; app-l2 k=4 folds [[0,1],[2,3],[4,5],[6,7]] over 8 rows, mean-model fold MSEs 65.4425/7.925/7.762778/64.989444 avg 36.529931 vs origin-slope 0.041297/0.004018/0.064262/0.023454 avg 0.033258; app-l3 stats (medv mean 25.18 range 14.7; tips train mean 2.056667, report MSE 2.673694) + train-vs-report snippet.
- Wrote 6 files in order l1->l3, appa l1->l3 (one Write each). Anatomy: hook -> concept (1-2 blocks, chunks <=150 words ar+en, glossary style) -> worked (runnable, verified report) -> exercises (required, solution, exactly 4 hints, NO explanation key) -> quiz 3 items -> summary -> sources. l1: ex1 write_code dense/forward + 3 tests, ex2 mcq (collapse-of-linear-layers), sandbox. l2: THREE write_code (scratch loop forward; minigrad MLP extraction + match to 1e-6/1e-12; one epoch by hand zero_grad/backward/update with verified loss 24.418095), no keras anywhere runnable. l3: keras Sequential/Functional + loop-vs-matrix in PROSE only; worked = minigrad.sgd 300-epoch run printing 0/100/299; ex1 write_code train() with tests (len 300, decrease, <0.05), ex2 trace_output Dense param counting (112/9, mirrors book's model.summary), ex3 mcq batch_size, sandbox lr grid. appa l1: central-difference ex1 + numeric (lr=1.0 two steps -> 0.0) + GD worked + stability sandbox; appa l2: make_folds + mean_metric ex1, held-out mcq; appa l3: mean/value_range ex1 with dataset-column tests, dataset-match mcq, five 5-row literal samples incl. tips train-vs-report. minigrad imports ONLY in l2 ex2/ex3 + l3 worked/ex1/sandbox. No forbidden substring in any runnable field ('random' appears only twice, both prose, appendix l1).
- Fixed pre-gate: one malformed hint object in appa l2 ex2 (authored with a stray Python-like expression) repaired before first validate; one CJK typo in l1 concept ar ("ي改善" -> "يُحسِّن") fixed during authoring.

Stage Summary:
- Files: content/part2/mls/ch7/lesson.mls.ch7.l1.ts (mls.ch7.l1, prereq ['mls.ch6.l5'], sources mls.ch7.s1, exKinds [write_code,mcq]), lesson.mls.ch7.l2.ts (prereq l1, mls.ch7.s2, [write_code x3]), lesson.mls.ch7.l3.ts (prereq l2, mls.ch7.s3, [write_code,trace_output,mcq]); content/part2/mls/appendix/lesson.mls.appendix.l1.ts (mls.appendix.l1, chapter 8, prereq ['swe.appa.l4'], mls.appendix.s1, [write_code,numeric]), lesson.mls.appendix.l2.ts (mls.appendix.l2, prereq l1, mls.appendix.s2, [write_code,mcq]), lesson.mls.appendix.l3.ts (mls.appendix.l3, prereq l2, mls.appendix.s3, [write_code,mcq]).
- Gate 1: bun scripts/wave3-validate.ts <6 files> -> 6x VALID (quizItems=3, debug=0) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <6 files> /tmp/sol-18b.json -> "dumped 8 solution/test suites"; python3 scripts/wave3-replay-solutions.py /tmp/sol-18b.json -> "8/8 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <6 files> /tmp/chk-18b.json -> "dumped 1 traces, 9 runnables, 5 mcq+numeric, 0 fills, 0 broken"; python3 scripts/wave3-replay-checks.py /tmp/chk-18b.json -> 15x PASS -> "ALL CHECKS PASS".
- Gate 4: bunx tsc --noEmit 2>&1 | grep -c 'mls\.ch7\.\|mls\.appendix\.' -> 0 (repo-wide error lines 281, all pre-existing elsewhere: src/lib/i18n/en.ts etc., none in the 6 new files).
- Prereq chain: mls.ch6.l5 (external anchor, authored by another agent) -> ch7 l1 -> l2 -> l3; swe.appa.l4 (external anchor) -> appa l1 -> l2 -> l3. Next (main agent): register the 6 lessons in manifest/registry, browser E2E. Temp artifacts: /tmp/sol-18b.json, /tmp/chk-18b.json, /tmp/tsc-18b.txt, /tmp/verify-18b*.py can be deleted or regenerated.
---
Task ID: 18-c
Agent: D2L ch1+ch2 content author (files-only sub-agent, Part II)
Task: Author 6 bilingual (AR/EN) D2L lessons — d2l.ch2.l1-l3 (Preliminaries, track A0, prereqs anchored at mls.appendix.l3) and d2l.ch1.l1-l3 (Introduction, track A1, prereqs anchored after ch2) — book 'D2L', part 'II', version 1, estimatedMinutes 30, pure-Python runnables (minigrad only in ch2.l3), no manifest/registry edits.

Work Log:
- Read worklog tail (17-a protocol), agent-ctx/part2-brief.md (full contract incl. D2L grouping rule), D2L.toc.json section titles, and ground truth curriculum/sources/D2L/ch2.txt (s1 ص70 + s2 ص78 + s3 ص81 + s4 ص94 + s5 ص99 + s6 ص105 + s7 ص118) and ch1.txt (s1 ص42 + s2 ص44 + s3 ص47 + s4 ص60 + s5 ص62 + s6 ص65 + s7 ص67 + s8 ص69 + s9 ص69). Own words throughout; torch APIs only as short inline prose mentions (`torch.arange(12)`, `x.requires_grad_(True)`, `y.backward()`, `read_csv`/fillna/get_dummies).
- Verified EVERY printed literal + every test assertion under CPython 3 BEFORE authoring (scripts/scratch/verify-18c.py): ch2.l1 worked (shape (3,4)/ndim 2/numel 12, X+Y row0, X==Y row0, broadcast (3,1)+(1,2)->(3,2), mean-impute 3.0); ch2.l2 worked (dot=32.0, l2=5.0/l1=7.0, A@[1,1,1]=[3,12], f'=6x+2 rule vs finite-diff at -1/0/2 = -3.999970/+2.000030/+14.000030, grad(1,2)=(10.0,6.0)); ch2.l3 worked (minigrad y=(2x+1)^2 at x=2 -> y=25.00, autograd dy/dx=20.00 = chain rule; P(rain/cloudy/clear)=0.50/0.20/0.30; E[payoff]=1.80); ch1.l1 worked (GD y=wx: steps 0/1/2/3/99 -> w=0/1.5/1.875/1.96875/2.0, mse 30/1.875/0.1172/0.0073/0.0); ch1.l2 worked (10-line timeline, growth x1e+10 both curves, 2-8-8-1 -> w=88 b=17 total=105); ch1.l3 worked (2-layer: z1/h/out for [2,1] -> [1,1]/[1,1]/1.0 and [-1,3] -> [-4,1.5]/[0,1.5]/0.5). Plus ex1 solutions+tests (6 suites), sandboxes, and a forbidden-token sweep (input(/exit(/sys.exit/random/unittest.main/subprocess/os.system/socket/urllib.request/http.client/requests./torch/numpy) — all clean; no 'random' substring anywhere in runnable fields.
- Wrote the 6 files in order (one Write each): ch2.l1 (prereq ['mls.appendix.l3']; s1+s2; mini tensor toolkit + impute report; ex broadcast_add/mean_impute + mcq broadcasting shape), ch2.l2 (prereq l1; s3+s4; dot/norms/matvec + derivatives + partials; ex numerical_gradient central-diff + mcq descent direction), ch2.l3 (prereq l2; s5+s6+s7; minigrad Value chain + frequencies/expectation; ex finite_diff vs autograd_grad + mcq base-rate; Bayes sandbox), ch1.l1 (prereq ['d2l.ch2.l3']; s1+s2+s3; 100-step GD fits w=2.0; ex train_w + mcq spam=supervised; lr-sensitivity sandbox), ch1.l2 (prereq l1; s4+s5+s6; timeline + decade growth + param breakdown; ex trimmed_mean (Köbel) + numeric 105 + mcq data/compute/algorithms), ch1.l3 (prereq l2; s7+s8+s9; 2-layer composition with ReLU-dead features; ex param_count + mcq end-to-end features). Anatomy per contract: hook -> concept (chunks <=150 ar+en, one per grouped section's objective) -> worked -> exercises (all required, solution, exactly 4 hints, no explanation) -> sandbox -> quiz (3 items) -> summary (one bullet per section) -> sources block + top-level sources (EVERY grouped section listed). Fixed post-write: one garbled AR hint/object, one stray CJK token, two AR wording glitches — caught by self-review before gates.
- Gates all run from repo root after edits.

Stage Summary:
- Files: content/part2/d2l/ch2/lesson.d2l.ch2.l1.ts (d2l.ch2.l1, A0, ch2, 30min, prereq mls.appendix.l3; sources d2l.ch2.s1+d2l.ch2.s2; exKinds [write_code,mcq]), lesson.d2l.ch2.l2.ts (d2l.ch2.l2, prereq d2l.ch2.l1; s3+s4; [write_code,mcq]), lesson.d2l.ch2.l3.ts (d2l.ch2.l3, prereq d2l.ch2.l2; s5+s6+s7; [write_code,mcq]; minigrad import in worked/ex1), content/part2/d2l/ch1/lesson.d2l.ch1.l1.ts (d2l.ch1.l1, A1, ch1, 30min, prereq d2l.ch2.l3; s1+s2+s3; [write_code,mcq]), lesson.d2l.ch1.l2.ts (d2l.ch1.l2, prereq d2l.ch1.l1; s4+s5+s6; [write_code,numeric,mcq]), lesson.d2l.ch1.l3.ts (d2l.ch1.l3, prereq d2l.ch1.l2; s7+s8+s9; [write_code,mcq]).
- Gate 1: bun scripts/wave3-validate.ts <6 ch1+ch2 files> -> 6x "VALID" (debug=0 quizItems=3) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <6 files> /tmp/sol-18c.json -> "dumped 6 solution/test suites"; python3 scripts/wave3-replay-solutions.py /tmp/sol-18c.json -> "6/6 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <6 files> /tmp/chk-18c.json -> "dumped 0 traces, 12 runnables, 7 mcq+numeric, 0 fills, 0 broken"; python3 scripts/wave3-replay-checks.py /tmp/chk-18c.json -> 19x PASS -> "ALL CHECKS PASS" (no broken blocks, no oracle needed).
- Gate 4: bunx tsc --noEmit 2>&1 | grep -c 'd2l\.ch[12]\.' -> 0.
- D2L ch1+ch2 COMPLETE: 6/6 lessons; prereq chain mls.appendix.l3 -> d2l.ch2.l1 -> l2 -> l3 -> d2l.ch1.l1 -> l2 -> l3. Next (main agent): author mls.appendix.l3 in parallel per plan, then register in manifest/registry and browser E2E. Temp artifacts: /tmp/sol-18c.json, /tmp/chk-18c.json, scripts/scratch/verify-18c.py can be deleted or regenerated.
---
Task ID: 19-d
Agent: D2L ch12+ch13 content author (files-only sub-agent, Part II, track A7)
Task: Author 6 bilingual (AR/EN) D2L lessons — ch12 "Optimization Algorithms" l1-l4 + ch13 "Computational Performance" l1-l2, book 'D2L', part 'II', version 1, 30min each; pure-Python runnables (optimizer update rules by name, convexity midpoint checks, LR schedules, allreduce/sync-cost model, parameter-server push/pull sim); no manifest/registry edits.

Work Log:
- Read worklog tail (18-c protocol), agent-ctx/part2-brief.md, agent-ctx/d2l-brief.md (grouping table A7: ch12 l1=s1+s2+s3, l2=s4+s5+s6, l3=s7+s8+s9, l4=s10+s11; ch13 l1=s1+s2+s3+s4, l2=s5+s6+s7; prereq anchors ch12.l1<-d2l.ch11.l3, ch13.l1<-d2l.ch12.l4), D2L.toc.json (d2l.ch12.s1-s11 ص508-586, d2l.ch13.s1-s7 ص587-631), and ground truth ch12.txt + ch13.txt. Own words throughout; torch APIs prose-only (`torch.jit.script`, `nn.DataParallel`).
- Verified EVERY printed literal + every test assert under CPython 3 BEFORE authoring (scripts/scratch/verify-19d.py, extended in-place for adagrad/rmsprop states): ch12.l1 margins +2.572500/+9.000000 vs -1.207107, gd x^2 3.486784/0.060466/61.917364, 2-D (-0.057646,-0.000073), ex1 1+9*0.6**10=1.0544195584; ch12.l2 valley gd 0.4 (-0.943467,-0.000073), gd 0.6 (-0.387814,-1673.365109), mom 0.6/0.5 (0.007188,0.002553), mom 0.6/0.25 (-0.126340,-0.186632), minibatch mean 0.250000 sd 1.145644->0.572822 (b^-1/2), 1/(1-b)=10.0/2.0, LCG-noisy sgd 50-step dist 0.029855 (sandbox); ch12.l3 adagrad 0.4 (-2.382563,-0.158591) s1=9.480948 eff_lr=0.129907, adagrad 2.0 (-0.002295,-0.000000), rmsprop 0.4/0.9 (-0.010599,0.000000) s1=0.041800 eff_lr=1.956444, adadelta rho .9 (-4.782488,-1.787589), ex1 1-D adagrad x=6.512417166235185 s=5030.83 eff 0.007049; ch12.l4 adam t1..t3 (vhat 18/17.473684/16.930589, shat 324/306.491247/289.664245, x 9.5/9.000948/8.503561), schedules sqrt 0.1..0.022361, cosine T20 0.3/0.257530/0.155/0.01 pinned, step 0.5/0.25/0.125, warmup 0/0.12/0.24 then handover; ch13.l1 fold 10/20/('add','x',3), round scheduler makespan 13 vs 20 speedup 1.538462, perf_counter structure check (results equal, counts-not-time asserts); ch13.l2 allreduce [[1,1]]+[[2,2]]->[[3,3]], 4x5 split rows 2/2, sync-cost 160MB/16GB/s: 10ms per hop -> 60/80/15/ring 5.925926ms, param server agg {w:2.0,b:-1.0} avg {w:1.0,b:-0.5} -> server {w:2.9,b:2.05}.
- Wrote 6 files in order (one Write each): ch12.l1, ch12.l2, ch12.l3, ch12.l4, ch13.l1, ch13.l2. Anatomy: hook -> concept (1 block, 3-4 chunks one per grouped section, <=150 words ar+en) -> worked (verified report) -> ex1 write_code (required, solution, 3 tests, exactly 4 hints, no explanation) -> ex2 mcq|numeric (answer==solution) -> sandbox -> quiz 3 -> summary (one bullet per section) -> sources (ALL grouped sections, top-level + block). Timing content asserts structure not wall-time (result equality + counts; perf_counter only prints in sandbox).
- Fixed pre-gate: stray CJK token in ch12.l1 hook (authored then caught), 'random' substring in ch12.l2 sandbox comment (rewritten to "noise source"), ASCII apostrophes inside single-quoted TS prose in ch13.l1 (tuple literals moved into backticks), wrong sign in ch13.l2 ex1 t3 expected value (update subtracts lr*avg: -1.5 not +1.5), one AR typo "لا Ranks ثانية" -> "لا مرتبة ثانية" in ch12.l4 quiz.

Stage Summary:
- Files: content/part2/d2l/ch12/lesson.d2l.ch12.l1.ts (d2l.ch12.l1, A7, ch12, prereq ['d2l.ch11.l3'], sources d2l.ch12.s1+s2+s3, exKinds [write_code,mcq]), lesson.d2l.ch12.l2.ts (prereq l1; s4+s5+s6; [write_code,mcq]), lesson.d2l.ch12.l3.ts (prereq l2; s7+s8+s9; [write_code,numeric]), lesson.d2l.ch12.l4.ts (prereq l3; s10+s11; [write_code,mcq]); content/part2/d2l/ch13/lesson.d2l.ch13.l1.ts (d2l.ch13.l1, ch13, prereq ['d2l.ch12.l4'], sources d2l.ch13.s1-s4, [write_code,numeric]), lesson.d2l.ch13.l2.ts (prereq l1; s5+s6+s7; [write_code,mcq]).
- Gate 1: bun scripts/wave3-validate.ts <6 files> -> 6x VALID (debug=0 quizItems=3) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <6 files> /tmp/sol-19d.json -> "dumped 6 solution/test suites"; python3 scripts/wave3-replay-solutions.py /tmp/sol-19d.json -> "6/6 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <6 files> /tmp/chk-19d.json -> "dumped 0 traces, 12 runnables, 6 mcq+numeric, 0 fills, 0 broken"; python3 scripts/wave3-replay-checks.py /tmp/chk-19d.json -> 18x PASS -> "ALL CHECKS PASS" (all worked outputs re-verified against explanation literals verbatim).
- Gate 4: bunx tsc --noEmit 2>&1 | grep -c 'd2l\.ch1[23]\.' -> 0 (283 repo-wide pre-existing error lines elsewhere incl. in-flight ch4 by another agent; none reference the 6 new files).
- Prereq chain: d2l.ch11.l3 (external anchor) -> ch12 l1 -> l2 -> l3 -> l4 -> ch13.l1 -> l2 (-> next: ch19.l1 per A7 plan). Next (main agent): register the 6 lessons in manifest/registry, browser E2E. Temp artifacts: /tmp/sol-19d.json, /tmp/chk-19d.json, /tmp/tsc-19d.txt, scripts/scratch/verify-19d.py can be deleted or regenerated.
---
Task ID: 20-d
Agent: D2L ch14 content author (files-only sub-agent, Part II, track A4)
Task: Author 5 bilingual (AR/EN) D2L lessons — ch14 "Computer Vision" l1-l5 (grouping: l1=s1+s2, l2=s3+s4+s5, l3=s6+s7+s8, l4=s9+s10+s11, l5=s12+s13+s14), book 'D2L', part 'II', version 1, estimatedMinutes 30, track A4, prereq anchor ch14.l1←['d2l.ch8.l3'] then l2←l1, l3←l2, l4←l3, l5←l4; pure-Python deterministic runnables; no manifest/registry edits.

Work Log:
- Read worklog tail (19-d protocol), agent-ctx/part2-brief.md (full contract), agent-ctx/d2l-brief.md (A4 chain + ch14 grouping), D2L.toc.json (d2l.ch14.s1-s14 ص632-722), and ground truth sources/D2L/ch14.txt (all 14 sections). Own words throughout; torch/torchvision APIs prose-only (`torchvision.transforms.Compose`, `nn.ConvTranspose2d`, `torchvision.ops.roi_pool`).
- Verified EVERY printed literal + every test assert under CPython 3 BEFORE authoring (script /home/z/tmp-verify/verify-20d.py, 61 checks 0 failures): l1 hflip/vflip/brightness(+clip 255) on 2x2 grid + ResNet-18 fine-tuning budget (fc_src 513000, fc_tgt 1026, backbone 10668642, head lr 5.0e-04); l2 corner↔center roundtrip (dog → [219.0,280.5,318.0,471.0]), IoU 0.2 case + dog/cat disjoint 0.0, anchor w/h at s=0.75 r∈{1,2,0.5} (1.060660/0.530330), n+m−1=5 per pixel, 561×728×5=2042040, multiscale [48,12,3]=63, NMS keep [0,3] with IoUs 0.7368/0.5454; l3 banana label row /256, SSD tables units [1024,256,64,16,1]→anchors [4096,1024,256,64,4]=5444, cls a(q+1)=8/unit → 10888, bbox 21776, scale ladder [0.272,0.447,0.619,0.79,0.961], RoI pooling floor/ceil on 4×4 → [[5,6],[9,10]] and [[9,11],[13,15]] (matches torchvision.ops.roi_pool book output), R-CNN 2000 passes vs Fast 1; l4 VOC color index (r·256+g)·256+b (aeroplane 8388608), trans_conv by hand (book [[0,0,1],[0,4,6],[4,12,9]] + stride-2 4×4 variant), shape formula (n−1)s−2p+k → 320/480, rule k=2s p=s/2 ⇒ out=n·s, bilinear k=4 row [0.0625,0.1875,0.1875,0.0625] sum 4.0; l5 Gram (G00 3.75, G01 0.625, G11 0.25), content 0.125, tv 2.0, weighted total 120.125 (weights 1/1e4/10), accuracy 0.7, log loss 1.1080787801753422, perfect 0.0, valid split max(1,⌊n·r⌋)=50.
- Wrote 5 files in order l1→l5 (one Write each). Anatomy: hook → concept (1 block, 2-4 chunks one per grouped section, ≤150 words ar+en) → worked (verified report) → ex1 write_code (required, solution, 3 tests, exactly 4 hints, no explanation) → ex2 numeric (answer==solution, tolerance) → sandbox → quiz 3 → summary (one bullet per grouped section, objective stated) → sources block + top-level (ALL grouped sections). l1 ex1=hflip/vflip/brightness, ex2 numeric 1026; l2 ex1=corner↔center+iou, ex2 numeric 340; l3 ex1=roi_pool_2x2 (3 tests incl. full-window [[5,7],[13,15]]), ex2 numeric 5444; l4 ex1=trans_conv+tconv_shape, ex2 numeric 8388608; l5 ex1=accuracy+log_loss, ex2 numeric 120.125. Sandboxes: augmentation pipeline order-invariance, greedy NMS on the book's 4-anchor example, SSD table rebuilder (a∈{4,6}, q∈{1,10}), stride-2 trans_conv (book [[0,0,0,1],[0,0,2,3],[0,2,0,3],[4,6,6,9]]), style-weight explorer + split rule.
- Post-write verification: re-extracted all worked/sandbox code fields via bun and ran under CPython 3 — every printed literal matches its explanation verbatim; forbidden-substring sweep (input(/exit(/sys.exit/random/unittest.main/subprocess/os.system/socket/urllib.request/http.client/requests.) over ALL runnable fields = 0 hits; prereq chain + sources asserted programmatically. No CJK/typo issues found on self-review pass (fixed pre-write: log_loss formulated as sum(−ln p)/n to avoid printing -0.0).

Stage Summary:
- Files: content/part2/d2l/ch14/lesson.d2l.ch14.l1.ts (d2l.ch14.l1, A4, ch14, prereq ['d2l.ch8.l3'], sources d2l.ch14.s1+s2, exKinds [write_code,numeric]), lesson.d2l.ch14.l2.ts (prereq l1; s3+s4+s5; [write_code,numeric]), lesson.d2l.ch14.l3.ts (prereq l2; s6+s7+s8; [write_code,numeric]), lesson.d2l.ch14.l4.ts (prereq l3; s9+s10+s11; [write_code,numeric]), lesson.d2l.ch14.l5.ts (prereq l4; s12+s13+s14; [write_code,numeric]).
- Gate 1: bun scripts/wave3-validate.ts <5 files> -> 5x VALID (quizItems=3, debug=0) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <5 files> /tmp/sol-20d.json -> "dumped 5 solution/test suites"; python3 scripts/wave3-replay-solutions.py /tmp/sol-20d.json -> "5/5 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <5 files> /tmp/chk-20d.json -> "dumped 0 traces, 10 runnables, 5 mcq+numeric, 0 fills, 0 broken"; python3 scripts/wave3-replay-checks.py /tmp/chk-20d.json -> 15x PASS -> "ALL CHECKS PASS" (all worked outputs re-verified against explanation literals).
- Gate 4: bunx tsc --noEmit 2>&1 | grep -c 'd2l\.ch14\.' -> 0 (10 repo-wide pre-existing error lines elsewhere, none in the 5 new files).
- Prereq chain: d2l.ch8.l3 (external anchor; ch8 dir currently empty — id reserved per A4 plan) -> ch14 l1 -> l2 -> l3 -> l4 -> l5 (-> next: ch9.l1 per A5 plan). Next (main agent): register the 5 lessons in manifest/registry, browser E2E. Temp artifacts: /tmp/sol-20d.json, /tmp/chk-20d.json, /tmp/tsc-20d.txt, /home/z/tmp-verify/ can be deleted or regenerated.
---
Task ID: 20-c
Agent: D2L ch10 tail + ch11 content author (files-only sub-agent, Part II, tracks A5/A6)
Task: Author 5 bilingual (AR/EN) D2L lessons — ch10 l3-l4 (Machine Translation/Encoder-Decoder + Seq2Seq/Beam Search, track A5) + ch11 l1-l3 (QKV/Attention Pooling/Scoring, Bahdanau/Multi-Head/Self-Attention, Transformer/ViT/Pretraining, track A6), book 'D2L', part 'II', version 1, 30min each; pure-Python runnables, torch prose-only; no manifest/registry edits.

Work Log:
- Read worklog tail (19-d protocol), agent-ctx/part2-brief.md, agent-ctx/d2l-brief.md (groupings ch10 l3=s5+s6, l4=s7+s8; ch11 l1=s1+s2+s3, l2=s4+s5+s6, l3=s7+s8+s9; prereq anchors ch11.l1<-d2l.ch16.l3), D2L.toc.json titles, siblings lesson.d2l.ch10.l1.ts/l2.ts for style, and ground truth ch10.txt (s5 ص429-434, s6 ص435-436, s7 ص437-445, s8 ص445-448) + ch11.txt (s1-s9 ص451-507) in full. Own words throughout; torch APIs prose-only (`nn.Embedding`, `nn.LayerNorm` style references).
- Verified EVERY printed literal + every test assert under CPython 3 BEFORE authoring (scripts/scratch/verify-20c.py): l3 MT pipeline on the book's 5 pairs (num_steps=6; src valid_len 3/3/3/3/5; dec_in/label one-slot shift with <bos>/<eos>/<pad>), build_target 3 cases (short/truncated/padded), min_freq=2 vocab (kept ['.','run'], 6 of 8 tokens -> <unk>); l4 BLEU on the book's precision example (p1=4/5, p2=3/4, p3=1/3, p4=0/2, bleu k=2 = 0.6815, k=4 = 0.0, short-pred penalty exp(1-6/2) = 0.1353), book products 0.048 vs 0.054 with (1/L^0.75)·log P scores -1.0736 vs -1.0319, beam_pick 3 cases (CB<eos>/ABC<eos>/B<eos> at alpha 0.75 vs 0), numeric 5·1000·10=50000, and a full beam search over a fixed log-prob tree (k=1: A→AB→AB<eos> p=0.08; k=2: keeps C then CB → CB<eos> p=0.09 score -1.0563, mirroring the book's greedy-losses finding); ch11.l1 scaled dot-product weights [0.3655,0.1802,0.3655,0.0889] sum 1.0, output 21.777, masked len=2 [0.6698,0.3302,0,0] out 13.3024, len=1 -> 10.0, uniform -> 25.0, attention() r1=13.302384506733432/r2=10.0/r3=25.0, numeric variance 64->1, Nadaraya-Watson sigma 1.0/0.5 weights + f(3) 3.1054/3.1519 vs true 3.2822; ch11.l2 additive scores [-0.081466,0.202433,-0.964028], weights [0.3647,0.4844,0.1509], context [0.5159,0.3021], 2 fixed heads [0.7311,0.5]/[0.5,0.7311] via softmax([1,0])=[0.7311,0.2689], sin/cos rows pos0..3 ([0.8415,0.5403,0.01,1.0] etc.), relative-position rotation check 12/12 True; ch11.l3 shape trace (2,9,24) unchanged, census mha 2304 + ffn 2376 + addnorm 96 = 4776, masked row [0.4897,0.1475,0.3628,0.0] vs plain [0.3939,0.1186,0.2918,0.1956], vit_patch_count (36,768,37)/(196,768,197)/(49,1024,50), trace modes table 3 lines (BERT 350M/250B, T5-11B 11000M/1000B, Chinchilla 70000M/1400B), sandbox scale table (BERT/GPT-2/T5-11B/MT-NLG/Chinchilla/PaLM, all book-stated numbers). Fixed pre-gate: label-shift bug in l3 worked (full[:-1]/full[1:] per the book), char-slicing bug in the p_n loop (split(' ') first), and a TS parse break in l3 explanation (raw single-quoted Python list inside a single-quoted string -> prose tokens).
- Wrote 5 files in order (one Write each): ch10.l3, ch10.l4, ch11.l1, ch11.l2, ch11.l3. Anatomy per contract: hook -> concept (1 block, 2-3 chunks one per grouped section, <=150 words ar+en) -> worked (verified report) -> ex1 write_code (required, solution, 3 tests, exactly 4 hints, no explanation) -> ex2 mcq|numeric|trace (answer==solution) -> sandbox -> quiz 3 (with cross-chapter revisits: ch9/ch10 padding in l3-l4 quizzes, ch8 ResNet + d2l.ch16.l3 BERT fine-tuning in ch11.l3 quiz) -> summary (one bullet per section + bridge) -> sources (ALL grouped sections, top-level + block). All: version 1, part 'II', track A5 (ch10) / A6 (ch11), estimatedMinutes 30, pure stdlib deterministic code, forbidden-substring sweep clean.

Stage Summary:
- Files: content/part2/d2l/ch10/lesson.d2l.ch10.l3.ts (d2l.ch10.l3, prereq ['d2l.ch10.l2'], sources d2l.ch10.s5+s6, exKinds [write_code,mcq]), lesson.d2l.ch10.l4.ts (prereq ['d2l.ch10.l3'], s7+s8, [write_code,numeric]); content/part2/d2l/ch11/lesson.d2l.ch11.l1.ts (d2l.ch11.l1, prereq ['d2l.ch16.l3'] external anchor, sources d2l.ch11.s1+s2+s3, exKinds [write_code,numeric]), lesson.d2l.ch11.l2.ts (prereq ['d2l.ch11.l1'], s4+s5+s6, [write_code,mcq]), lesson.d2l.ch11.l3.ts (prereq ['d2l.ch11.l2'], s7+s8+s9, [write_code,trace_output]).
- Gate 1: bun scripts/wave3-validate.ts <5 files> -> 5x VALID (debug=0 quizItems=3) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <5 files> /tmp/sol-20c.json -> "dumped 5 solution/test suites"; python3 scripts/wave3-replay-solutions.py /tmp/sol-20c.json -> "5/5 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <5 files> /tmp/chk-20c.json -> "dumped 1 traces, 10 runnables, 4 mcq+numeric, 0 fills, 0 broken"; python3 scripts/wave3-replay-checks.py /tmp/chk-20c.json -> 15x PASS -> "ALL CHECKS PASS".
- Gate 4: bunx tsc --noEmit 2>&1 | grep -cE 'd2l\.ch10\.l[34]|d2l\.ch11\.' -> 0 (281 repo-wide pre-existing error lines elsewhere, none in the 5 new files; bun run lint exit 0).
- D2L ch10 COMPLETE (l1-l4) and ch11 COMPLETE (l1-l3). Prereq chains: d2l.ch9.l3 -> ch10 l1 -> l2 -> l3 -> l4 (-> ch15.l1 next per A5 plan); d2l.ch16.l3 (external anchor) -> ch11.l1 -> l2 -> l3 (-> ch12.l1/ch19.l1 anchors already used by A7). Next (main agent): register the 5 lessons in manifest/registry, browser E2E. Temp artifacts: /tmp/sol-20c.json, /tmp/chk-20c.json, /tmp/tsc-20c.txt, scripts/scratch/verify-20c.py can be deleted or regenerated.
---
Task ID: 20-e2
Agent: D2L ch16.l1 + ch21.l1 content author (files-only sub-agent, Part II, tracks A5/A8)
Task: Author 2 bilingual (AR/EN) D2L lessons — ch16.l1 (Sentiment Analysis: s1 dataset + s2 RNN + s3 textCNN, track A5) and ch21.l1 (Recommender Systems overview s1, track A8), book 'D2L', part 'II', version 1, 30min each; pure-Python deterministic runnables; no manifest/registry edits. NOTE: a prior draft of ch16.l1 was corrupted mid-write and discarded; file rewritten fresh and complete.

Work Log:
- Read worklog tail (20-c protocol), agent-ctx/part2-brief.md, agent-ctx/d2l-brief.md (grouping table: ch16 l1=s1+s2+s3, ch21 l1=s1; prereq anchors ch16.l1<-d2l.ch15.l4, ch21.l1<-d2l.ch20.l1 — both anchors exist on disk), D2L.toc.json (d2l.ch16.s1-s3 ص785-798, d2l.ch21.s1 ص933-935), continuity siblings lesson.d2l.ch16.l2.ts/l3.ts for anatomy/style (incl. l3's bert_encode_pair naming to avoid forbidden input( substring), and ground truth ch16.txt (s1-s3) + ch21.txt chapter head (21.1 Overview: CF taxonomy, explicit/implicit feedback, tasks). Own words throughout; torch APIs prose-only (`nn.LSTM`, `nn.Conv1d`, `nn.Embedding`).
- Verified EVERY printed literal + every test assert under CPython 3 BEFORE authoring (script /home/z/tmp-verify/verify-20e2.py + exact runnable drafts w16_worked/w16_sandbox/w21_worked/w21_sandbox.py, 24 checks 0 failures): ch16.l1 encodings [2,3,4,5,0]/[2,3,4,6,0]/[7,5,3,8,5] valid_len 4/4/5 (truncated from 6), unk [2,1,4,5], RNN toy h=[0.710595,0.000000]/p_pos=0.944923, h=[-0.611688,0.000000]/0.079676, h=[0.722101,0.083979]/0.955056 (3/3 correct), pad decay 0.710595->0.341065, corr1d [2,5,8,11,14,17], multi-channel [2,8,14,20,26,32], widths 10/8 pooled 9, book TextCNN table widths 9/8/7 concat 300, BiRNN decoder 4x100=400 -> 400x2+2=802; ch21.l1 MF on 4x3 (9 observed, k=2, lr 0.05 reg 0.02, 100 fixed-order sweeps): initial loss 45.106850/rmse 3.165194 -> epoch100 0.580385/0.024809, P/Q literals, pred matrix [[4.969,2.976,4.292],[3.963,2.127,0.999],[1.004,1.018,4.962],[3.075,1.976,3.981]], top-1 u0->item2 4.292/u1->item1 2.127/u3->item0 3.075, global-mean 2.888889 baseline rmse 1.594744, rmse([0.5,-1.5,2.0])=1.471960, top_k [1,2]/[0], MF params 4x2+3x2=14, sandbox reg sweep 0.000362/0.024809/0.243097, cos(u0,u2)=0.970143. Rejected uniform-0.5 init for the sandbox (diverges to nan) in favor of the worked literal init.
- Wrote 2 files (one Write each): ch16.l1 then ch21.l1. Anatomy: hook -> concept (1 block, 3 chunks one per grouped section, <=150 words ar+en verified by whitespace count: 93-119 max) -> worked (verified report) -> ex1 write_code (required, solution, 3 tests, exactly 4 hints, no explanation) -> ex2 numeric (answer==solution, tolerance 0) -> sandbox -> quiz 3 -> summary (one bullet per grouped section) -> sources block + top-level (ALL grouped sections with pages).
- Post-write verification: re-extracted all worked/sandbox fields from the written TS via bun (scripts/scratch/extract-20e2.ts) and diffed byte-for-byte against the verified .py drafts — 4/4 PARITY OK, reran under CPython 3 exit 0 with identical outputs; forbidden-substring sweep (input(/exit(/sys.exit/random/unittest.main/subprocess/os.system/socket/urllib.request/http.client/requests.) over ALL runnable fields = 0 hits.

Stage Summary:
- Files: content/part2/d2l/ch16/lesson.d2l.ch16.l1.ts (d2l.ch16.l1, A5, ch16, prereq ['d2l.ch15.l4'], sources d2l.ch16.s1+s2+s3, exKinds [write_code,numeric]), content/part2/d2l/ch21/lesson.d2l.ch21.l1.ts (d2l.ch21.l1, A8, ch21, prereq ['d2l.ch20.l1'], sources d2l.ch21.s1, exKinds [write_code,numeric]).
- Gate 1: bun scripts/wave3-validate.ts <2 files> -> 2x VALID (quizItems=3, debug=0) -> "ALL LESSONS VALID".
- Gate 2: bun scripts/wave3-dump-solutions.ts <2 files> /tmp/sol-20e2.json -> "dumped 2 solution/test suites"; python3 scripts/wave3-replay-solutions.py /tmp/sol-20e2.json -> "2/2 suites pass".
- Gate 3: bun scripts/wave3-dump-checks.ts <2 files> /tmp/chk-20e2.json -> "dumped 0 traces, 4 runnables, 2 mcq+numeric, 0 fills, 0 broken"; python3 scripts/wave3-replay-checks.py /tmp/chk-20e2.json -> 6x PASS -> "ALL CHECKS PASS".
- Gate 4: bunx tsc --noEmit 2>&1 | grep -cE 'd2l\.ch16\.l1|d2l\.ch21\.' -> 0 (pre-existing repo-wide errors in src/lib/i18n/en.ts and src/lib/runtime/runner.ts only, none in the 2 new files).
- Prereq chains: d2l.ch15.l4 (exists) -> ch16.l1 (-> ch16.l2 -> l3 already authored); d2l.ch20.l1 (exists) -> ch21.l1 (chapter complete, closes A8 chain ch17->ch18->ch20->ch21). D2L ch16 now COMPLETE (l1-l3). Next (main agent): register the 2 lessons in manifest/registry, browser E2E. Temp artifacts: /tmp/sol-20e2.json, /tmp/chk-20e2.json, /tmp/extracted-20e2.json, /home/z/tmp-verify/, scripts/scratch/extract-20e2.ts can be deleted or regenerated.

---
Task ID: 18-main
Agent: main (Z.ai)
Task: Complete the remaining curriculum 100% (SWE ch13 + exam + capstone + M3 runtime + MLS + D2L), register everything, run all gates, E2E, docs.

Work Log:
- Re-synced: PY4E 100% + SWE 108/117 done in prior sessions; remaining = ch13, exam/capstone, M3, MLS/D2L.
- Extracted SWE ch13 text (scripts/extract_swe.py); downloaded the live MLS book (25 pages → curriculum/sources/MLS/txt/); extracted D2L ch1-21 from the local PDF (scripts/extract_mls_d2l.py).
- Wrote agent-ctx/part2-brief.md (Part II contract) + agent-ctx/d2l-brief.md (groupings, tracks, prereq anchors, per-chapter runnable guidance).
- M3 first: public/py-modules/minigrad.py (scalar reverse-mode autograd + LCG init + MLP/mse/bce/bce_logits/sgd); verified deterministic in CPython and in the bundled Pyodide (scripts/test_pyodide_minigrad.ts → regression 0.518106→0.016112 identical curves, XOR 0.720625→0.001832 acc 1.0); worker FS-preloads /py-modules/minigrad.py; both wave3 replay harnesses sys.path it. ADR-0008 written.
- Waves of content agents (17-a..20-f, several died on Task-tool context deadlines — write-immediately salvage): swe.ch13 4/4 green (oracle wired to scripts/.w3-ch13-oracles.json); MLS ch1-7+appendix 33/33; D2L 58/58. Main absorbed: 2 failing ch2 tests fixed, ch4.l1 softmax import fix, ch7.l2 padded-conv bounds + identity kernel, ch15.l3 NN expectation, ch17.l1 VI sweeps 40→300, bert_pair_input→bert_encode_pair rename, corrupted ch16.l1 rewritten by 20-e2, mls ch5.l4+ch6.l1-l5 authored by main (all verified under CPython first — scripts/scratch/verify-20a3.py), bagged(5) 5.0833→4.8333 fix, l5 honest-scoreboard rewrite (bagging loses clean / wins noisy 27.18→21.89; boosting ties 0.75).
- Registered everything via scripts/register_part2.py: manifest 258 lessons, orders 1-258 sequential, prereqs resolve, 95 registry loaders (fixed a self-inflicted .ts-extension corruption mid-run). Fixed appendix citations mls.appendix.sN → mls.A.sN in lessons + manifest.
- M2 certification platform: content/exam/python-professional.ts (52-item bilingual bank), src/lib/store/certification.ts, src/views/ExamView.tsx (16 drawn/attempt, 20-min timer, ≥80%), src/views/CapstoneView.tsx (6 artifacts + 5-criterion rubric + readiness), router/page/AppShell/i18n wiring. Lint-clean after 3 iterations of the timer pattern (no refs/setState in render).
- Gates: wave3-validate ALL 258 VALID (sweep across part1+part2); solutions+checks replay all pass; lint 0; tsc 0 in new files; gen:coverage → 100.0% (476/476); check:coverage OK; public/data/coverage.json synced.
- E2E (agent-browser): exam full flow + retake, capstone render, minigrad in the REAL Pyodide worker (d2l.ch2.l3: autograd dy/dx = 20.00), coverage page 100%, AR h1 spot checks ×3, dev.log clean.

Stage Summary:
- THE CURRICULUM IS 100%: PY4E 181/181 · SWE 117/117 (incl. ch13) · MLS 33/33 · D2L 145/145 — 258 lessons published, all Zod-valid, all verified.
- M3 gate green (deterministic in-browser MLP training with verified loss curve); M2 gate complete (exam + capstone shipped, advisory enforcement documented).
- Remaining (M5/M6): Arabic proofread pass, perf/a11y evidence, ADR-0002 version note, optional unit-level mastery banks.
---
Task ID: 21-main
Agent: main (Z.ai)
Task: M5 polish round (Arabic proofread + performance) → M6 Release Candidate, per user instruction (no completion claims until prompt instructions are fully executed).

Work Log:
- Read worklog tail; confirmed Session 8 left M5/M6 open with 49 documented checker-drift failures.
- M5 Arabic: built scripts/m5_arabic_scan{,2}.py (17,274 strings/268 files); fixed 596 tanwin + 25 bare adverbs + 2 real dup-word bugs via m5_arabic_fix.py (backups in scripts/scratch/m5-backup). Learned: Arabic punctuation (U+060C) shares the 0600-06FF block — a second pass fixed 65 more.
- M5 strict sweep: scripts/m5_split_chunks.py split 37 over-150-word concept chunks (bilingual-pair forced alignment; reverse-order application after an offset-staleness bug; no-duplication guard); one swe.ch9.l1 block split into two concept blocks (Zod max 4). Reworded 3 input( comments. RANDOM_OK allowlist + expectedError schema field (predict/sandbox/debug) + m5_expected_error.py wired 10 intentional-crash blocks. m5_build_oracles.py built .w3-oracles.json (35 blocks). wave3-dump-checks/replay-checks extended for expectedError (crash-teaching verified = PASS).
- Gates after every batch: 258/258 VALID; 319/319 solutions; ALL CHECKS PASS; tsc 0 src+content (i18n Dict widened; 6 real tsc bugs fixed incl. distributive Omit); lint 0; coverage 100%.
- M5 perf: page.tsx views → next/dynamic (dashboard eager for SSR real content); manifest → fetch + useManifestStore (public/data/manifest.json); zod → lazy loadLesson.ts; Toaster lazy; 28 orphan ui files + 25 heavy deps removed; i18n deep-link sync fixed in router; dashboard min-h + skeleton mirroring → CLS 0 (fresh + returning); measured production: JS 193KB, LCP 132-184ms, lesson route 107KB.
- M5 security: CSP+headers in next.config.ts (verified served + E2E under CSP); zero dangerouslySetInnerHTML; bun update → audit 0.
- M5 docs: README + architecture/content-authoring/gamification(R-GAM-01)/a11y/i18n/runbook + docs/evidence/m5-polish.md; ADR-0002 as-built revision.
- M6: migration tests in browser (legacy import, idempotency BUG FOUND+FIXED in importProgress — payload passed as existing ledger; foreign/broken reject; export round-trip heals corrupted ledgers); full regression re-run + fresh dump/replay after last Arabic pass; service worker shipped + offline E2E (reload/lesson/coverage offline, back online); docs/evidence/m6-release-candidate.md; PROGRESS Session 9.

Stage Summary:
- M5 gate GREEN (evidence recorded), M6 Release Candidate GREEN (evidence recorded).
- Curriculum remains 100% (476/476; 258 lessons). Platform: 193KB initial JS, LCP <200ms, CLS 0, offline-capable, CSP-secured, audit-clean, 0 tsc/lint errors in scope.
- Honest remaining (documented, non-blocking): Playwright/axe CI automation, certificate signing (OQ-7), cert gating enforcement, licensing OQ-1/2/3 human decisions, optional mastery banks.
---
Task ID: 22-main
Agent: main (Z.ai)
Task: M6+ closure round — report progress %, close the remaining executable items (R-GAM-02 certificate signing, cert gate enforcement, Playwright/axe automation), keep all gates green.

Work Log:
- Re-verified state: coverage 100% (476/476), manifest 258 lessons (py4e 96/swe 71/mls 33/d2l 58), M5+M6 evidence green; remaining items were the 6 documented in m6 evidence §6.
- Implemented src/lib/cert/proof.ts (ECDSA P-256 WebCrypto, canonical JSON, device-local keys, verifySignedProof with semantic gates) + CapstoneView certificate card (issue/download/verify/tamper-reject) + certification.ts additions (subject, gateMode advisory|enforced, capstoneReadiness, certificationGateStatus).
- Wired gate mode: SettingsView radio + PathView Part II enforced-lock notices (AR/EN inline bilingual).
- Playwright: installed @playwright/test@1.55.1 + @axe-core/playwright + matching chromium; playwright.config.ts (reuse dev server); specs: smoke (5), certificate (2 — real-bank exam answers → capstone → signed proof valid; forged file rejected), axe (9 scans), visual (2 baselines AR/EN). 18/18 green.
- Fixed bugs caught by the suite: i18n radio → hash desync (reverse sync in useRouterSync); WCAG contrast failures from opacity dilution + muted-on-soft-teal (tokens accent-ai 0.51, muted-fg 0.5; removed opacity-80/70); slider thumb aria-label; TS 7.0.2 broke eslint → pinned typescript ~5.9.3.
- Gates re-run: lint 0; tsc 7 (pre-existing environmental only); axe 9/9; visual baselines committed; package.json scripts test:e2e / test:e2e:update added.
- Docs: gamification.md §6 (signing + gate mode), OPEN-QUESTIONS OQ-7 → CLOSED, m6-release-candidate.md §6/§7, PROGRESS Session 10.

Stage Summary:
- All executable-by-agent prompt items are now done; only human licensing confirmations (OQ-1/2/3) and optional mastery banks remain.
- Platform: 258 lessons, coverage 100%, exam 52 items, signed certificates live, 18-test E2E suite, axe-clean in both locales, visual baselines for RTL/LTR.

---
Task ID: 23-main
Agent: main (Z.ai)
Task: Restore site visibility for the user (preview went dark after sandbox recycle) — diagnosis + minimal launcher repair, zero project-content changes.

Work Log:
- Verified project intact: coverage 100% (476/476), manifest 258 lessons, all M5/M6 evidence untouched.
- Diagnosis: sandbox recycled 07:27; boot flow (start.sh -> .zscripts/dev.sh) aborted BEFORE starting the dev server. Root cause: prisma CLI auto-resolved to 8.0.0-rc.23 (client stays 7.10.1) which removed `db push` — `bun run db:push` errored and dev.sh's `set -euo pipefail` killed the whole boot script. Port 81 (caddy -> :3000) therefore returned 502 -> preview panel empty.
- Secondary constraint: processes spawned from agent tool sessions get reaped at session cleanup (verified with a setsid canary); only the platform boot path can own a persistent server.
- Fix (one line, launcher-only, no project/content/db change): .zscripts/dev.sh db:push step made non-fatal (`bun run db:push || echo WARNING ...`) with explanatory comment; DB (db/custom.db) is already migrated and schema unchanged, so skipping a failed push is safe.
- Re-ran the official dev.sh end-to-end: bun install OK, db:push failed-but-continued (expected), next dev started (PID 1792), health check passed, mini-services scanned (none).
- Verified: :3000 -> 200, :81 (gateway) -> 200, real platform content served (<title>PyPath — بايثون إلى الاحتراف), server SURVIVED a tool-session boundary (re-check next call: PID 1792 alive).
- External preview hostname candidates derived from env (FC_CONTAINER_ID/session/chat ids) all return gateway-level 404 — the real bot-id is registered only in the platform UI, so the user should use the chat's preview button; app-side is fully up regardless.

Stage Summary:
- Site restored to serving state via the platform's own boot script; root cause fixed for all future sandbox boots.
- Only change made: one non-fatal guard line in .zscripts/dev.sh (launcher). No project source, content, db, or config changes.

---
Task ID: 24-main
Agent: main (Z.ai)
Task: Fix React dev-mode console error "eval() is not supported / CSP" reported by the user — without breaking the project.

Work Log:
- Diagnosis: M5 security hardening shipped a strict CSP (script-src without 'unsafe-eval'). In DEV mode React's tooling (react-server-dom-turbopack checkEvalAvailabilityOnceDev) requires eval() and logs a console error when the policy blocks it. Production React never uses eval() — shipped behavior was never functionally broken; the error was dev-console noise.
- Fix (next.config.ts only, 2 small edits): added `const isDev = process.env.NODE_ENV !== "production"` and appended 'unsafe-eval' to script-src ONLY when isDev; updated the R-ARC-09 header comment. Production CSP string is byte-identical to the previous strict policy (ternary yields "" in prod).
- Restarted dev server via the platform's official .zscripts/dev.sh flow (config files are not hot-reloaded).
- Verified in a REAL headless browser (agent-browser): page title OK, PAGE ERRORS: none, console shows only benign dev messages (HMR connected / Fast Refresh / React DevTools hint) — the eval()/CSP error is gone. Screenshot: download/verify-csp-fix.png shows the full Arabic RTL dashboard rendering correctly.
- Server survives tool-session boundaries (re-checked next call: alive, 200).

Stage Summary:
- Dev-mode CSP error eliminated; production security posture unchanged (eval-free strict CSP preserved).
- Only change: next.config.ts dev-branch CSP + comment. No content, db, src, or dependency changes.

---
Task ID: 25-main
Agent: main (Z.ai)
Task: Fix the user-reported "تعذّر تحميل بايثون" (Pyodide load-failed) screen + make everything run precisely (user: "اريد كلشي ان يعمل بدقة و صحيح").

Work Log:
- Verified server-side asset chain 100% healthy: all /vendor/pyodide files 200 with correct MIME (wasm = application/wasm), worker 200; app-internal run test passed (print(1+1) → 2).
- Root cause of the user's screen: (a) poisoned browser state from the outage window — sw.js v1 cached EVERY navigation response including 502 error bodies (no res.ok check); (b) runner.ts poisoned permanently on first load failure (preload early-returned + ensureReady threw forever → only a full reload could recover, which the stale SW then re-poisoned).
- Fix 1 (runner.ts): self-healing — preload() retries, ensureReady() clears a recorded failure and forces a fresh worker spawn (bounded 60s grace kept). Transient outages now recover without a page reload.
- Fix 2 (public/sw.js): navigation responses cached only when res.ok; VERSION bumped pypath-v1 → pypath-v2 so activate purges every poisoned v1 cache in user browsers automatically.
- Fix 3 (usePython.ts): output-line ids are now module-scoped monotonic (salt + counter) — a per-instance useRef restarted at 1 after remount/Fast-Refresh and collided with preserved lines ("two children with the same key l3").
- Fix 4 (router.ts): store initializer no longer reads location.hash at creation — SSR default (ar/dashboard) on both sides; deep links apply via useRouterSync after mount. Fixes the React hydration mismatch on any hash deep link ("1 Issue" badge).
- Verified end-to-end (headless Chromium): fresh deep link → console 100% clean (no errors/warnings/dup-keys/hydration), lesson renders, Python runs (print("سلام "+"عليكم")), caches = pypath-v2-shell/assets, dev-issues badge absent. tsc: no new errors (only pre-existing environmental ones).

Stage Summary:
- Pyodide pipeline healthy + self-healing; poisoned-cache class of failures eliminated at the source (SW v2).
- 4 surgical fixes: runner.ts, sw.js, usePython.ts, router.ts. No content/db/dependency changes.
- Proof screenshots: download/verify-python-runtime.png (Python output live in lesson UI), verify-final-clean.png.

---
Task ID: 25-main
Agent: main (Z.ai)
Task: تشخيص "المعاينة لا تظهر + preview-chat-d611d777... رفض الاتصال"

Work Log:
- المستخدم أرفق أخيراً اسم مضيف المعاينة الحقيقي: preview-chat-d611d777-ab9b-40ce-ae0a-dcbbe17ffff2.space-z.ai (chat_id يطابق بيانات بوابة IM).
- الفحص الداخلي: الصندوق أُعيد تدويره بين الجلسات (bun dev جديد PID 2410 بدل 1792). المنفذان :3000 و:81 يرجعان HTTP 200 → التطبيق حي؛ إقلاع المنصة عبر start.sh → dev.sh نجح بفضل إصلاح db:push غير القاتل (Task 23).
- اختبار رابط المعاينة من الداخل: DNS يصل إلى ALB (aliyun) و HTTPS يرجع 200 خلال 0.15s، وHTML المُخدوم هو تطبيق PyPath فعلاً (lang="ar" dir="rtl").
- التشخيص: خطأ "رفض الاتصال" كان عابراً — المستخدم جرّب المعاينة خلال نافذة إقلاع التطبيق بعد إعادة تدوير الصندوق (next dev يحتاج وقتاً للترجمة) فرفضت البوابة الاتصال آنذاك.
- تحقق بمتصفح حقيقي (agent-browser) عبر رابط المعاينة الخارجي نفسه: العنوان "PyPath — بايثون إلى الاحتراف"، صفر أخطاء صفحة، وحدة تحكم نظيفة (HMR + React DevTools hint فقط، لا أخطاء CSP/eval).
- لقطة إثبات: download/verify-preview-external.png تعرض اللوحة العربية RTL كاملة (بطاقات التقدم، الجزء الأول بايثون 0%، الجزء الثاني AI مقفل).
- لم يُعدَّل أي ملف في المشروع — فحص تشغيلي فقط.

Stage Summary:
- المعاينة تعمل الآن عبر preview-chat-d611d777-ab9b-40ce-ae0a-dcbbe17ffff2.space-z.ai (HTTP 200 + عرض سليم + صفر أخطاء).
- إن تكرر "رفض الاتصال" بعد أي انقطاع فالسبب نافذة الإقلاع القصيرة بعد إعادة تدوير الصندوق؛ الحل: تحديث الصفحة بعد لحظات.
- إصلاحا Task 23 (dev.sh) وTask 24 (CSP dev) أثبتا فعاليهما في هذا الإقلاع الجديد.
