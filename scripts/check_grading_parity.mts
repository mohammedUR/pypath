// GRADE-001/002 parity gate: every canonical pattern answer must pass the
// (stricter) pattern grader, and the required negative cases must fail.
// Run: npm run check:grading (or: node --import ./scripts/register_ts_hook.mjs scripts/check_grading_parity.mts)
import { gradePattern } from '../src/lib/content/grading.ts';
import { loaders } from '../src/lib/content/registry.ts';

let failures = 0;
const fail = (msg: string) => {
  failures += 1;
  console.error('FAIL:', msg);
};

const byKind: Record<string, number> = {};
let debugBlocks = 0;
let lessons = 0;
let canonicalPassed = 0;

for (const [lessonId, load] of Object.entries(loaders)) {
  const mod = (await load()) as { default: { blocks: any[] } };
  lessons += 1;
  for (const b of mod.default.blocks) {
    if (b.kind === 'debug') {
      debugBlocks += 1;
      continue;
    }
    if (b.kind !== 'exercise') continue;
    byKind[b.exKind] = (byKind[b.exKind] ?? 0) + 1;
    if (b.exKind === 'write_code') continue; // runtime-graded, not pattern-graded
    const expected: string = b.answer ?? b.solution;
    const learner: string =
      b.exKind === 'mcq' ? b.answer : b.exKind === 'parsons' ? b.solution : expected;
    const res = gradePattern(b.exKind, learner, expected, b.tolerance ?? 0);
    if (!res.passed) fail(`canonical solution rejected: ${lessonId}:${b.id} (${b.exKind}) answer=${JSON.stringify(expected)}`);
    else canonicalPassed += 1;
  }
}

// ---- invariants -----------------------------------------------------------
const assertEq = (actual: unknown, want: unknown, what: string) => {
  if (actual !== want) fail(`${what}: expected ${String(want)}, got ${String(actual)}`);
};
assertEq(lessons, 258, 'lesson count');
assertEq(byKind.write_code, 280, 'write_code');
assertEq(byKind.trace_output, 166, 'trace_output');
assertEq(byKind.mcq, 211, 'mcq');
assertEq(byKind.fill_blank, 102, 'fill_blank');
assertEq(byKind.numeric, 85, 'numeric');
assertEq((byKind.parsons ?? 0), 0, 'parsons (0 active instances)');
assertEq(debugBlocks, 39, 'debug blocks');
assertEq(canonicalPassed, 564, 'canonical pattern solutions passed (211+102+85+166)');

// ---- negative / equivalence cases (GRADE-001 acceptance) ------------------
const cases: Array<[string, boolean]> = [
  // trace_output: indentation must be preserved (GRADE-001a)
  ['trace_output: indented learner line must FAIL', gradePattern('trace_output', '5\n  5\n4', '5\n5\n4').passed === false],
  ['trace_output: exact multi-line passes', gradePattern('trace_output', 'True\nFalse', 'True\nFalse').passed],
  ['trace_output: CRLF learner passes', gradePattern('trace_output', 'True\r\nFalse', 'True\nFalse').passed],
  ['trace_output: trailing spaces learner passes', gradePattern('trace_output', 'True  \nFalse\t', 'True\nFalse').passed],
  ['trace_output: outer blank lines learner passes', gradePattern('trace_output', '\nTrue\nFalse\n\n', 'True\nFalse').passed],
  ['trace_output: wrong content fails', gradePattern('trace_output', '5\n6', '5\n5').passed === false],
  // numeric: strict token (GRADE-001b)
  ['numeric: "12 apples" must FAIL', gradePattern('numeric', '12 apples', '12').passed === false],
  ['numeric: "answer is 12" must FAIL', gradePattern('numeric', 'answer is 12', '12').passed === false],
  ['numeric: "12%" (no units) must FAIL', gradePattern('numeric', '12%', '12').passed === false],
  ['numeric: empty must FAIL', gradePattern('numeric', '  ', '12').passed === false],
  ['numeric: negative decimal passes', gradePattern('numeric', '-3.5', '-3.5').passed],
  ['numeric: "2.0" == "2" passes', gradePattern('numeric', '2.0', '2').passed],
  ['numeric: scientific "1e2" == "100" passes', gradePattern('numeric', '1e2', '100').passed],
  ['numeric: wrong value with tolerance 0.1 fails', gradePattern('numeric', '5', '12', 0.1).passed === false],
  ['numeric: within tolerance passes', gradePattern('numeric', '3.145', '3.14', 0.01).passed],
  // mcq: exact option id
  ['mcq: wrong option id fails', gradePattern('mcq', 'opt-b', 'opt-a').passed === false],
  ['mcq: correct option id passes', gradePattern('mcq', ' opt-a ', 'opt-a').passed],
  // fill_blank: single-line equivalence (GRADE-001c)
  ['fill_blank: wrong word fails', gradePattern('fill_blank', 'التسلسلية', 'المحجوزة').passed === false],
  ['fill_blank: case-insensitive passes', gradePattern('fill_blank', 'Float', 'float').passed],
  ['fill_blank: smart quotes pass', gradePattern('fill_blank', 'it\u2019s', "it's").passed],
  ['fill_blank: outer whitespace passes', gradePattern('fill_blank', '  float  ', 'float').passed],
  ['fill_blank: semantically different text fails', gradePattern('fill_blank', '12 apples', 'float').passed === false],
  // parsons (GRADE-002): order-sensitive join
  ['parsons: canonical order passes', gradePattern('parsons', 'a = 1\nb = 2', 'a = 1\nb = 2').passed],
  ['parsons: shuffled order fails', gradePattern('parsons', 'b = 2\na = 1', 'a = 1\nb = 2').passed === false],
];
for (const [name, ok] of cases) if (!ok) fail(`negative/equivalence case failed: ${name}`);

// ---- summary --------------------------------------------------------------
console.log(`lessons=${lessons} exercises=${Object.values(byKind).reduce((a, b) => a + b, 0)} debug=${debugBlocks}`);
console.log(`canonical pattern solutions passed: ${canonicalPassed}/564`);
if (failures === 0) {
  console.log('GRADING PARITY: PASS (564/564 canonical + all negative/equivalence cases)');
} else {
  console.error(`GRADING PARITY: FAIL (${failures} failures)`);
  process.exit(1);
}
