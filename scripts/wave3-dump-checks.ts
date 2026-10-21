/**
 * Wave-3 generic checks dumper: traces / runnables / mcq+numeric / fills /
 * broken debug code to JSON. Run:
 * bun scripts/wave3-dump-checks.ts <lesson.ts ...> <out.json>
 */
import { writeFileSync } from 'node:fs';

type AnyBlock = {
  kind: string;
  id?: string;
  exKind?: string;
  code?: string;
  solution?: string;
  answer?: string;
  brokenCode?: string;
  starterCode?: string;
  expectedError?: string;
};

const out: {
  traces: { lesson: string; id: string; code: string; answer: string }[];
  runnables: { lesson: string; kind: string; id: string; code: string; expectedError?: string }[];
  mcqs: { lesson: string; id: string; answer: string; solution: string }[];
  fills: { lesson: string; id: string; answer: string }[];
  broken: { lesson: string; id: string; brokenCode: string; expectedError?: string }[];
} = { traces: [], runnables: [], mcqs: [], fills: [], broken: [] };

for (const p of process.argv.slice(2, -1)) {
  const mod = await import(new URL(`file://${p.startsWith('/') ? p : process.cwd() + '/' + p}`).href);
  const l = (mod.default ?? mod) as unknown as { id: string; blocks: AnyBlock[] };
  for (const b of l.blocks) {
    if (b.kind === 'exercise' && b.exKind === 'trace_output' && b.code && b.answer) {
      out.traces.push({ lesson: l.id, id: b.id as string, code: b.code, answer: b.answer });
    }
    if (b.kind === 'exercise' && (b.exKind === 'mcq' || b.exKind === 'numeric') && b.answer && b.solution) {
      out.mcqs.push({ lesson: l.id, id: b.id as string, answer: b.answer, solution: b.solution });
    }
    if (b.kind === 'exercise' && b.exKind === 'fill_blank' && b.answer) {
      out.fills.push({ lesson: l.id, id: b.id as string, answer: b.answer });
    }
    if (b.kind === 'debug' && b.brokenCode) {
      out.broken.push({ lesson: l.id, id: b.id as string, brokenCode: b.brokenCode, expectedError: b.expectedError });
    }
    if (b.kind === 'predict' || b.kind === 'worked') {
      out.runnables.push({ lesson: l.id, kind: b.kind, id: b.kind, code: b.code as string, expectedError: b.expectedError });
    }
    if (b.kind === 'sandbox' && b.starterCode) {
      out.runnables.push({ lesson: l.id, kind: 'sandbox', id: 'sandbox', code: b.starterCode, expectedError: b.expectedError });
    }
  }
}
const outPath = process.argv[process.argv.length - 1];
writeFileSync(outPath, JSON.stringify(out, null, 1));
console.log(
  `dumped ${out.traces.length} traces, ${out.runnables.length} runnables, ${out.mcqs.length} mcq+numeric, ${out.fills.length} fills, ${out.broken.length} broken -> ${outPath}`,
);
