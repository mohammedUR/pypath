/**
 * Task 10-b verification: Zod safeParse for all 6 ch12 lessons (+ anatomy/kind mix report).
 * Run: bun run scripts/validate-ch12.ts   (temporary task artifact, safe to delete)
 */
import { Lesson as LessonSchema } from '../src/lib/content/schema';

import l1 from '../content/part1/py4e/ch12/lesson.ch12.l1';
import l2 from '../content/part1/py4e/ch12/lesson.ch12.l2';
import l3 from '../content/part1/py4e/ch12/lesson.ch12.l3';
import l4 from '../content/part1/py4e/ch12/lesson.ch12.l4';
import l5 from '../content/part1/py4e/ch12/lesson.ch12.l5';
import l6 from '../content/part1/py4e/ch12/lesson.ch12.l6';

const lessons: unknown[] = [l1, l2, l3, l4, l5, l6];
let failures = 0;

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
}
console.log(failures === 0 ? 'ALL 6 LESSONS VALID' : `${failures} FAILURES`);
