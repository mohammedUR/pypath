/**
 * Wave-3 generic solution dumper: write_code + debug solutions/tests to JSON.
 * Run: bun scripts/wave3-dump-solutions.ts <lesson.ts ...> <out.json>
 */
import { writeFileSync } from 'node:fs';

type Suite = { lesson: string; id: string; solution: string; tests: { id: string; code: string }[] };
const out: Suite[] = [];

for (const p of process.argv.slice(2, -1)) {
  const mod = await import(new URL(`file://${p.startsWith('/') ? p : process.cwd() + '/' + p}`).href);
  const l = (mod.default ?? mod) as unknown as {
    id: string;
    blocks: { kind: string; id?: string; exKind?: string; solution?: string; tests?: { id: string; code: string }[] }[];
  };
  for (const b of l.blocks) {
    if (b.kind === 'debug' && b.solution && b.tests) {
      out.push({ lesson: l.id, id: b.id as string, solution: b.solution, tests: b.tests });
    }
    if (b.kind === 'exercise' && b.exKind === 'write_code' && b.solution && b.tests) {
      out.push({ lesson: l.id, id: b.id as string, solution: b.solution, tests: b.tests });
    }
  }
}
const outPath = process.argv[process.argv.length - 1];
writeFileSync(outPath, JSON.stringify(out, null, 1));
console.log(`dumped ${out.length} solution/test suites -> ${outPath}`);
