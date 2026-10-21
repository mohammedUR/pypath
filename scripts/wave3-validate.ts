/**
 * Wave-3 generic validator: Zod safeParse + forbidden-token sweep + structural
 * rules for any list of lesson files passed as argv.
 * Run: bun scripts/wave3-validate.ts content/part1/swe/ch1/lesson.swe.ch1.l1.ts ...
 */
import { Lesson as LessonSchema } from '../src/lib/content/schema';

type AnyBlock = {
  kind: string;
  id?: string;
  exKind?: string;
  heading?: unknown;
  chunks?: unknown[];
  solution?: string;
  hints?: unknown[];
  tests?: unknown[];
  items?: unknown[];
};

const FORBIDDEN = [
  'input(',
  'exit(',
  'sys.exit',
  'random',
  'unittest.main',
  'subprocess',
  'os.system',
  'socket',
  'urllib.request',
  'http.client',
  'requests.',
];

/**
 * M5 documented exception (worklog Session 8, "checker drift"): PY4E ch4 IS the
 * book's own teaching of `import random` + `random.seed()` (dice rolls, the
 * password generator). Every graded/worked usage there is seeded => outputs are
 * deterministic and are re-verified verbatim by the wave3-dump-solutions →
 * wave3-replay-solutions gate (CPython) and in-browser by the Pyodide grader.
 * The sandbox free-play in ch4.l6 is intentionally unseeded (book pedagogy, no
 * asserted outputs). Any OTHER lesson still failing on 'random' is a real bug.
 */
const RANDOM_OK = new Set(['py4e.ch4.l3', 'py4e.ch4.l6']);

function runnableSnippets(lesson: Record<string, unknown>): { field: string; code: string }[] {
  const out: { field: string; code: string }[] = [];
  for (const b of lesson.blocks as Record<string, unknown>[]) {
    const kind = b.kind as string;
    if (kind === 'predict' || kind === 'worked') {
      out.push({ field: kind, code: b.code as string });
    } else if (kind === 'sandbox') {
      out.push({ field: 'sandbox', code: b.starterCode as string });
    } else if (kind === 'exercise' || kind === 'debug') {
      if (b.starterCode) out.push({ field: `${b.id}:starter`, code: b.starterCode as string });
      if (b.code) out.push({ field: `${b.id}:code`, code: b.code as string });
      if (b.solution) out.push({ field: `${b.id}:solution`, code: b.solution as string });
      if (b.brokenCode) out.push({ field: `${b.id}:broken`, code: b.brokenCode as string });
      for (const t of ((b.tests as { code: string }[]) ?? [])) {
        out.push({ field: `${b.id}:test`, code: t.code });
      }
    }
  }
  return out;
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

let totalFail = 0;
for (const p of process.argv.slice(2)) {
  const mod = await import(new URL(`file://${p.startsWith('/') ? p : process.cwd() + '/' + p}`).href);
  const lesson = (mod.default ?? mod) as Record<string, unknown>;
  const lid = lesson.id as string;
  let fails = 0;
  const parsed = LessonSchema.safeParse(lesson);
  if (!parsed.success) {
    fails++;
    console.log(`FAIL ${lid}: Zod — ${parsed.error.issues.slice(0, 4).map((i) => `${i.path.join('.')}: ${i.message}`).join(' | ')}`);
  }
  // forbidden tokens in runnable code
  for (const snip of runnableSnippets(lesson)) {
    for (const tok of FORBIDDEN) {
      if (tok === 'random' && RANDOM_OK.has(String(lid))) continue;
      if (snip.code.includes(tok)) {
        fails++;
        console.log(`FAIL ${lid}: forbidden '${tok}' in ${snip.field}`);
      }
    }
  }
  // structure: exercise/debug must not carry explanation key; hints exactly 4 (Zod covers hints)
  const kinds: string[] = [];
  const exKinds: string[] = [];
  let debugCount = 0;
  let quizItems = 0;
  for (const b of lesson.blocks as AnyBlock[]) {
    kinds.push(b.kind);
    if (b.kind === 'exercise') {
      exKinds.push(b.exKind ?? '?');
      if ('explanation' in b) {
        fails++;
        console.log(`FAIL ${lid}: exercise ${b.id} has illegal 'explanation' key`);
      }
    }
    if (b.kind === 'debug') {
      debugCount++;
      if ('explanation' in b) {
        fails++;
        console.log(`FAIL ${lid}: debug ${b.id} has illegal 'explanation' key`);
      }
    }
    if (b.kind === 'quiz') quizItems = (b.items as unknown[]).length;
  }
  // chunk word caps
  for (const b of lesson.blocks as Record<string, unknown>[]) {
    if (b.kind !== 'concept') continue;
    for (const c of (b.chunks as { ar: string; en: string }[]) ?? []) {
      const wa = wordCount(c.ar);
      const we = wordCount(c.en);
      if (wa > 150 || we > 150) {
        fails++;
        console.log(`FAIL ${lid}: concept chunk too long (ar=${wa}, en=${we}) in '${(b.heading as { ar: string }).ar}'`);
      }
    }
  }
  const order = kinds.join('>');
  console.log(
    `${lid}: ${parsed.success && fails === 0 ? 'VALID' : 'INVALID'} | blocks=[${order}] exKinds=[${exKinds.join(',')}] debug=${debugCount} quizItems=${quizItems}`,
  );
  totalFail += fails;
}
console.log(totalFail === 0 ? 'ALL LESSONS VALID' : `${totalFail} FAILURES`);
process.exit(totalFail === 0 ? 0 : 1);
