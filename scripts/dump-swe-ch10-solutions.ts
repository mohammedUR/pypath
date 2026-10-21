/**
 * Task 13-main verification: dump write_code + debug solutions and their tests
 * to JSON for the python harness replay (same semantics as pyodide-worker
 * __pypath_run_tests). Run: bun run scripts/dump-swe-ch10-solutions.ts
 * (writes scripts/.swe-ch10-solutions.json)
 */
import { writeFileSync } from 'node:fs';

import l1 from '../content/part1/swe/ch10/lesson.swe.ch10.l1';
import l2 from '../content/part1/swe/ch10/lesson.swe.ch10.l2';
import l3 from '../content/part1/swe/ch10/lesson.swe.ch10.l3';
import l4 from '../content/part1/swe/ch10/lesson.swe.ch10.l4';
import l5 from '../content/part1/swe/ch10/lesson.swe.ch10.l5';

const lessons = [l1, l2, l3, l4, l5] as unknown as {
  id: string;
  blocks: { kind: string; id?: string; solution?: string; tests?: { id: string; code: string }[] }[];
}[];

const out: { lesson: string; id: string; solution: string; tests: { id: string; code: string }[] }[] = [];
for (const l of lessons) {
  for (const b of l.blocks) {
    if (b.kind === 'debug' && b.solution && b.tests) {
      out.push({ lesson: l.id, id: b.id as string, solution: b.solution, tests: b.tests });
    }
    if (b.kind === 'exercise') {
      const ex = b as { exKind?: string };
      if (ex.exKind === 'write_code' && b.solution && b.tests) {
        out.push({ lesson: l.id, id: b.id as string, solution: b.solution, tests: b.tests });
      }
    }
  }
}
writeFileSync('scripts/.swe-ch10-solutions.json', JSON.stringify(out, null, 1));
console.log(`dumped ${out.length} solution/test suites`);
