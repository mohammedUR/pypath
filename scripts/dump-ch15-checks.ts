/**
 * Task 11-b verification: dump trace_output exercises, runnable snippets
 * (predict/worked/sandbox), mcq/fill answer consistency and debug brokenCode
 * to JSON for the python3 cross-check. Run: bun run scripts/dump-ch15-checks.ts
 * (writes scripts/.ch15-checks.json)
 */
import { writeFileSync } from 'node:fs';

import l1 from '../content/part1/py4e/ch15/lesson.ch15.l1';
import l2 from '../content/part1/py4e/ch15/lesson.ch15.l2';
import l3 from '../content/part1/py4e/ch15/lesson.ch15.l3';
import l4 from '../content/part1/py4e/ch15/lesson.ch15.l4';
import l5 from '../content/part1/py4e/ch15/lesson.ch15.l5';
import l6 from '../content/part1/py4e/ch15/lesson.ch15.l6';

type AnyBlock = {
  kind: string;
  id?: string;
  exKind?: string;
  code?: string;
  solution?: string;
  answer?: string;
  brokenCode?: string;
  starterCode?: string;
};

const lessons = [l1, l2, l3, l4, l5, l6] as unknown as {
  id: string;
  blocks: AnyBlock[];
}[];

const out: {
  traces: { lesson: string; id: string; code: string; answer: string }[];
  runnables: { lesson: string; kind: string; id: string; code: string }[];
  mcqs: { lesson: string; id: string; answer: string; solution: string }[];
  fills: { lesson: string; id: string; answer: string }[];
  broken: { lesson: string; id: string; brokenCode: string }[];
} = { traces: [], runnables: [], mcqs: [], fills: [], broken: [] };

for (const l of lessons) {
  for (const b of l.blocks) {
    if (b.kind === 'exercise' && b.exKind === 'trace_output' && b.code && b.answer) {
      out.traces.push({ lesson: l.id, id: b.id as string, code: b.code, answer: b.answer });
    }
    if (b.kind === 'exercise' && b.exKind === 'mcq' && b.answer && b.solution) {
      out.mcqs.push({ lesson: l.id, id: b.id as string, answer: b.answer, solution: b.solution });
    }
    if (b.kind === 'exercise' && b.exKind === 'fill_blank' && b.answer) {
      out.fills.push({ lesson: l.id, id: b.id as string, answer: b.answer });
    }
    if (b.kind === 'debug' && b.brokenCode) {
      out.broken.push({ lesson: l.id, id: b.id as string, brokenCode: b.brokenCode });
    }
    if (b.kind === 'predict' || b.kind === 'worked') {
      out.runnables.push({ lesson: l.id, kind: b.kind, id: b.kind, code: b.code as string });
    }
    if (b.kind === 'sandbox' && b.starterCode) {
      out.runnables.push({ lesson: l.id, kind: 'sandbox', id: 'sandbox', code: b.starterCode });
    }
  }
}

writeFileSync('scripts/.ch15-checks.json', JSON.stringify(out, null, 1));
console.log(
  `dumped ${out.traces.length} traces, ${out.runnables.length} runnables, ${out.mcqs.length} mcqs, ${out.fills.length} fills, ${out.broken.length} broken`,
);
