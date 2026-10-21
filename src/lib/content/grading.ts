/**
 * Pattern-based grading — works WITHOUT the interpreter for
 * mcq / fill_blank / trace_output / numeric / parsons kinds, and serves as
 * the offline fallback when the CDN is blocked.
 */

export function normalizeWhitespace(s: string): string {
  return s
    .replace(/[\u2018\u2019\u02bc]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .split('\n')
    .map((l) => l.trim())
    .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
    .join('\n')
    .trim();
}

export function looseNormalize(s: string): string {
  return normalizeWhitespace(s)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/["']/g, '')
    .replace(/[.:؛،!]$/u, '')
    .trim();
}

export interface PatternResult {
  passed: boolean;
}

export function gradePattern(
  kind: 'mcq' | 'fill_blank' | 'trace_output' | 'numeric' | 'parsons',
  learnerAnswer: string,
  expected: string,
  tolerance = 0,
): PatternResult {
  switch (kind) {
    case 'mcq':
      return { passed: learnerAnswer.trim() === expected.trim() };
    case 'fill_blank':
      return { passed: looseNormalize(learnerAnswer) === looseNormalize(expected) };
    case 'trace_output':
      return { passed: normalizeWhitespace(learnerAnswer) === normalizeWhitespace(expected) };
    case 'numeric': {
      const a = parseFloat(learnerAnswer.replace(/[^\d.eE+-]/g, ''));
      const b = parseFloat(expected.replace(/[^\d.eE+-]/g, ''));
      if (Number.isNaN(a) || Number.isNaN(b)) return { passed: false };
      return { passed: Math.abs(a - b) <= Math.max(tolerance, Math.abs(b) * 1e-9) };
    }
    case 'parsons':
      return { passed: normalizeWhitespace(learnerAnswer) === normalizeWhitespace(expected) };
  }
}

/** Parse "expected: X | actual: Y" assertion messages into a structured row. */
export function parseExpectedActual(message: string): { expected: string; actual: string } | null {
  // [\s\S] instead of the /s flag: keeps the regex valid on lower JS targets.
  const m = message.match(/expected:\s*([\s\S]*?)\s*\|\s*actual:\s*([\s\S]*)$/);
  if (m) return { expected: m[1], actual: m[2] };
  return null;
}
