/**
 * Task 11-a verification: Zod safeParse for all 6 ch14 lessons (+ anatomy/kind
 * mix report + a forbidden-token sweep over runnable fields).
 * Run: bun run scripts/validate-ch14.ts   (temporary task artifact, safe to delete)
 */
import { Lesson as LessonSchema } from '../src/lib/content/schema';

import l1 from '../content/part1/py4e/ch14/lesson.ch14.l1';
import l2 from '../content/part1/py4e/ch14/lesson.ch14.l2';
import l3 from '../content/part1/py4e/ch14/lesson.ch14.l3';
import l4 from '../content/part1/py4e/ch14/lesson.ch14.l4';
import l5 from '../content/part1/py4e/ch14/lesson.ch14.l5';
import l6 from '../content/part1/py4e/ch14/lesson.ch14.l6';

const lessons: unknown[] = [l1, l2, l3, l4, l5, l6];
let failures = 0;

/** Runnable code fields only (never prose/pitfalls — __del__ is concept-only prose there). */
function runnableSnippets(lesson: unknown): { field: string; code: string }[] {
  const out: { field: string; code: string }[] = [];
  const blocks = (lesson as { blocks: Record<string, unknown>[] }).blocks;
  for (const b of blocks) {
    const kind = b.kind as string;
    if (kind === 'predict' || kind === 'worked') {
      out.push({ field: kind, code: b.code as string });
    } else if (kind === 'sandbox') {
      out.push({ field: 'sandbox', code: b.starterCode as string });
    } else if (kind === 'exercise') {
      const ex = b as Record<string, unknown>;
      if (ex.starterCode) out.push({ field: `${ex.id}:starter`, code: ex.starterCode as string });
      if (ex.code) out.push({ field: `${ex.id}:code`, code: ex.code as string });
      if (ex.solution) out.push({ field: `${ex.id}:solution`, code: ex.solution as string });
    } else if (kind === 'debug') {
      const dbg = b as Record<string, unknown>;
      if (dbg.brokenCode) out.push({ field: `${dbg.id}:broken`, code: dbg.brokenCode as string });
      if (dbg.solution) out.push({ field: `${dbg.id}:solution`, code: dbg.solution as string });
      for (const t of (dbg.tests as { code: string }[]) ?? []) {
        out.push({ field: `${dbg.id}:test`, code: t.code });
      }
    }
    if (kind === 'exercise') {
      for (const t of ((b as Record<string, unknown>).tests as { code: string }[]) ?? []) {
        out.push({ field: 'test', code: t.code });
      }
    }
  }
  return out;
}

const FORBIDDEN = ['input(', 'exit(', 'random', '__del__', 'socket', 'urllib', 'subprocess'];

for (const raw of lessons) {
  const parsed = LessonSchema.safeParse(raw);
  const anyL = raw as { id: string; blocks: { kind: string; exKind?: string; id?: string }[] };
  if (!parsed.success) {
    failures++;
    console.log(`FAIL ${anyL.id}: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
    continue;
  }
  const exs = anyL.blocks.filter((b) => b.kind === 'exercise');
  const dbg = anyL.blocks.filter((b) => b.kind === 'debug');
  const quiz = anyL.blocks.find((b) => b.kind === 'quiz') as { items: unknown[] } | undefined;
  const kindMix = exs.map((e) => `${e.exKind}:${e.id}`).join('  ');
  console.log(
    `OK  ${anyL.id}  blocks=${anyL.blocks.length} exercises=[${kindMix}] debug=${dbg.length} quizItems=${quiz?.items.length ?? 0}`,
  );
  for (const sn of runnableSnippets(raw)) {
    for (const tok of FORBIDDEN) {
      if (sn.code.includes(tok)) {
        failures++;
        console.log(`FORBIDDEN ${anyL.id} ${sn.field}: '${tok}' found in runnable code`);
      }
    }
  }
}
console.log(failures === 0 ? 'ALL 6 LESSONS VALID' : `${failures} FAILURES`);
