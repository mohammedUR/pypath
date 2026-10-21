/**
 * Task 11-b verification: Zod safeParse for all 6 ch15 lessons + anatomy/kind
 * mix report + ch15-specific runnable sweeps (:memory:-only connects, no
 * input/random/exit, 4 hints per exercise/debug, ASCII trace answers,
 * earlier-chapter quiz revisits).
 * Run: bun run scripts/validate-ch15.ts   (temporary task artifact, safe to delete)
 */
import { Lesson as LessonSchema } from '../src/lib/content/schema';

import l1 from '../content/part1/py4e/ch15/lesson.ch15.l1';
import l2 from '../content/part1/py4e/ch15/lesson.ch15.l2';
import l3 from '../content/part1/py4e/ch15/lesson.ch15.l3';
import l4 from '../content/part1/py4e/ch15/lesson.ch15.l4';
import l5 from '../content/part1/py4e/ch15/lesson.ch15.l5';
import l6 from '../content/part1/py4e/ch15/lesson.ch15.l6';

const lessons: unknown[] = [l1, l2, l3, l4, l5, l6];

type AnyBlockShape = {
  kind: string;
  exKind?: string;
  id?: string;
  hints?: unknown[];
  answer?: string;
};

type CodeCarrier = {
  id: string;
  blocks: AnyBlockShape[];
};

const FORBIDDEN = ['input(', 'random', 'exit(', 'urllib', 'socket', 'subprocess'];

let failures = 0;
let runnableFields = 0;
let connectFields = 0;
let nonMemoryConnects = 0;
let forbiddenHits = 0;
let revisitItems = 0;

function collectCode(block: Record<string, unknown>): string[] {
  const out: string[] = [];
  const kinds = ['code', 'solution', 'starterCode', 'brokenCode'];
  for (const k of kinds) {
    if (typeof block[k] === 'string') out.push(block[k] as string);
  }
  const tests = block['tests'] as { code?: string }[] | undefined;
  if (Array.isArray(tests)) {
    for (const t of tests) {
      if (typeof t['code'] === 'string') out.push(t['code'] as string);
    }
  }
  return out;
}

for (const raw of lessons) {
  const parsed = LessonSchema.safeParse(raw);
  const anyL = raw as unknown as CodeCarrier;
  if (!parsed.success) {
    failures++;
    console.log(
      `FAIL ${anyL.id}: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
    );
    continue;
  }
  const exs = anyL.blocks.filter((b) => b.kind === 'exercise');
  const dbg = anyL.blocks.filter((b) => b.kind === 'debug');
  const quiz = anyL.blocks.find((b) => b.kind === 'quiz') as
    | { items: { question: { ar: string } }[] }
    | undefined;
  const kindMix = exs.map((e) => `${e.exKind}:${e.id}`).join('  ');

  // sweep 1: every code-bearing field must be free of forbidden tokens
  for (const b of anyL.blocks) {
    for (const code of collectCode(b as unknown as Record<string, unknown>)) {
      runnableFields++;
      for (const bad of FORBIDDEN) {
        if (code.includes(bad)) {
          forbiddenHits++;
          console.log(`  !! ${anyL.id}: forbidden token '${bad}' in a runnable field`);
        }
      }
      const conns = code.match(/sqlite3\.connect\(([^)]*)\)/g) ?? [];
      for (const c of conns) {
        connectFields++;
        if (!c.includes(':memory:')) {
          nonMemoryConnects++;
          console.log(`  !! ${anyL.id}: non-:memory: connect: ${c}`);
        }
      }
    }
  }

  // sweep 2: exercise/debug hints exactly 4
  for (const b of [...exs, ...dbg]) {
    const hints = b.hints as unknown[] | undefined;
    if (!Array.isArray(hints) || hints.length !== 4) {
      failures++;
      console.log(`  !! ${anyL.id}: ${b.id} has ${hints?.length ?? 0} hints (need 4)`);
    }
  }

  // sweep 3: trace answers must be short ASCII
  for (const b of exs) {
    if (b.exKind === 'trace_output' && b.answer && !/^[\x20-\x7E\n\r]+$/.test(b.answer)) {
      failures++;
      console.log(`  !! ${anyL.id}: non-ASCII trace answer in ${b.id}`);
    }
  }

  // sweep 4: quiz earlier-chapter revisits
  for (const item of quiz?.items ?? []) {
    if (item.question.ar.includes('ومن الفصل')) revisitItems++;
  }

  console.log(
    `OK  ${anyL.id}  blocks=${anyL.blocks.length} exercises=[${kindMix}] debug=${dbg.length} quizItems=${quiz?.items.length ?? 0}`,
  );
}

console.log(
  `sweep: ${runnableFields} runnable fields checked, ${connectFields} sqlite3.connect calls (non-:memory: = ${nonMemoryConnects}), forbidden-token hits = ${forbiddenHits}, quiz revisits ('ومن الفصل') = ${revisitItems}`,
);
console.log(failures === 0 ? 'ALL 6 LESSONS VALID' : `${failures} FAILURES`);
