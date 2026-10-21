# Content authoring guide

How lessons are written, validated, registered, and gated. The CI contract (R-ARC-06) is enforced by scripts; this guide is the human-facing version.

## 1. Lesson anatomy

One lesson = one TypeScript module in `content/part1|part2/<book>/<chapter>/lesson.<id>.ts` exporting a `Lesson` object. Block kinds, in order:

| Block | Purpose | Notes |
|-------|---------|-------|
| `hook` | why this matters (≤ 1 paragraph ar+en) | always first |
| `predict` | read code, guess output, reveal | may carry `expectedError` |
| `concept` | heading + 1–4 chunks | **each chunk ≤ 150 words per locale** (Zod: max 4 chunks/block) |
| `worked` | verified example + explanation | output literals must match the explanation verbatim |
| `exercise` | write_code / mcq / fill_blank / trace_output / numeric / parsons | `required` ones gate completion; exactly 4 hints (nudge → concept → skeleton → solution); **no `explanation` key allowed** |
| `debug` | broken code to fix | broken code must RUN (oracle-verified symptom) OR carry `expectedError` for intentional crash-teaching |
| `sandbox` | free play, no tests | may carry `expectedError` |
| `quiz` | 3–4 items, some cross-chapter | ids stable |
| `pitfalls` | wrong → right → why | |
| `summary` | one bullet per source section | objective stated |
| `sources` | book/section/page citations | top-level + per block |

Bilingual parity: every prose field is `{ ar, en }`. Arabic follows the platform style: tanwin fath written **before** the seat alef (دائمًا not دائماً), «بـ» kashida before Latin identifiers, MSA with a warm second person (R-CNT-04).

## 2. Determinism rules for runnable code

Forbidden in runnable fields: `input(`, `exit(`, `sys.exit`, `random`, `unittest.main`, `subprocess`, `os.system`, `socket`, `urllib.request`, `http.client`, `requests.`.

- **Exception (documented, CI-enforced):** `py4e.ch4.l3` and `py4e.ch4.l6` use the book's own `import random` + `random.seed()` pedagogy; all graded usages are seeded ⇒ deterministic and re-verified by the solutions replay. The `RANDOM_OK` set in `scripts/wave3-validate.ts` is the only place this may be extended.
- Mentions of `input(` inside comments are allowed in prose fields but not in runnable code strings — comment them without the parenthesis (`التابع input يقرأ…`).
- `expectedError` (optional, on `predict`/`sandbox`/`debug`): the CI replays the block and asserts it raises **exactly** that error class. Use it only where the crash IS the pedagogy (e.g. `print 'Hello'` py2 SyntaxError, `int('خمسة')` ValueError). Ten blocks currently use it (py4e ch1/ch3/ch4).

## 3. The four gates (run after every authoring batch)

```bash
# list of lesson files
find content -name "lesson.*.ts" | sort > /tmp/lessons.txt

# Gate 1 — schema + strict structural sweep: expect "ALL LESSONS VALID"
xargs -a /tmp/lessons.txt bun scripts/wave3-validate.ts

# Gate 2 — reference solutions + hidden tests under CPython: expect "319/319 suites pass"
xargs -a /tmp/lessons.txt sh -c 'bun scripts/wave3-dump-solutions.ts "$@" /tmp/sol.json' _
python3 scripts/wave3-replay-solutions.py /tmp/sol.json

# Gate 3 — worked/predict/sandbox outputs, mcq/numeric answers, fills, broken-symptom oracles
xargs -a /tmp/lessons.txt sh -c 'bun scripts/wave3-dump-checks.ts "$@" /tmp/chk.json' _
python3 scripts/wave3-replay-checks.py /tmp/chk.json scripts/.w3-oracles.json
#    → "ALL CHECKS PASS". A new debug block with no oracle prints INFO and must be
#      added to scripts/.w3-oracles.json (run scripts/m5_build_oracles.py after
#      verifying the symptom by hand, or append the substrings manually).

# Gate 4 — types + lint
bunx tsc --noEmit && bun run lint
```

Plus coverage before any release: `npm run gen:coverage && npm run check:coverage` (must stay 100.0% — 476/476).

## 4. Registration

New lessons must be added to:

1. `content/manifest.json` (id, track, part, book, chapter, order, title ar/en, prerequisites, sources) — regenerate with `scripts/register_part2.py` for Part II batches or edit + validate for single lessons. Keep orders strictly sequential (1..N).
2. `src/lib/content/registry.ts` loaders map: `'book.ch.l': () => import('...')` (alphabetical, lazy).
3. Copy the updated manifest to `public/data/manifest.json` (`cp content/manifest.json public/data/manifest.json`) — the app fetches it from there.

Prerequisite chains must resolve within the manifest; external anchors (e.g. `d2l.ch8.l3`) must exist.

## 5. Content floors (R-CNT-02) and coverage

- PY4E chapter ≥ 6 lessons / ≥ 20 exercises / 1 mini-project.
- SWE chapter ≥ 4 lessons / ≥ 12 exercises / 1 lab.
- MLS chapter ≥ 3 concept + 3 construction + 3 implementation-comparison lessons.
- D2L section ≥ 1 lesson or lab (grouping allowed only if all grouped sections are cited in `sources` and the summary).

`scripts/check_coverage.py --strict` fails the build when any TOC section loses its lesson(s).

## 6. Oracles registry

`scripts/.w3-oracles.json` maps `lessonId → [substrings]` that MUST appear in the broken code's stdout (first debug block). They are symptom anchors: when someone edits a broken block and the symptom changes, Gate 3 fails. Keep substrings distinctive (prefer the last meaningful output line plus one earlier line).

## 7. Arabic style checklist (M5 pass)

- [ ] Tanwin before seat alef (أيضًا، دائمًا، مثلًا) — scanner: `scripts/m5_arabic_scan2.py`.
- [ ] No bare adverbs missing tanwin (دائما → دائمًا).
- [ ] No duplicated words beyond intentional rhetorical doubling (سطرًا سطرًا is fine; «إلى إلى» is not).
- [ ] Terminology consistent: بايثون (not بيثون), باي تورش, Kaggle/scikit-learn in Latin.
- [ ] Regex/code literals inside prose keep a space before punctuation naturally — no auto-fixing there.
