/**
 * Pattern-based grading — works WITHOUT the interpreter for
 * mcq / fill_blank / trace_output / numeric / parsons kinds, and serves as
 * the offline fallback when the CDN is blocked.
 *
 * Normalization contracts (GRADE-001):
 *  - trace_output / parsons: multi-line and indentation-PRESERVING. Python
 *    output structure (nesting, alignment) is significant, so a learner's
 *    misaligned block must NOT pass. Only line endings (\r\n -> \n), smart
 *    quotes, per-line trailing spaces, and blank-line runs are normalized;
 *    leading indentation on each line must match the expected answer exactly.
 *  - fill_blank: single-line, whitespace-insensitive equivalence — outer
 *    whitespace, letter case, quote style ("smart" vs ASCII), and one
 *    trailing punctuation character are insignificant (all 102 canonical
 *    fill_blank answers are single-line tokens; surveyed 2026-10 Phase 2).
 *  - numeric: the learner's input must be a strict numeric token (optional
 *    sign, integer/decimal, optional scientific notation). Mixed text such
 *    as "12 apples" is REJECTED outright instead of being silently stripped
 *    to 12 (GRADE-001b). Values are compared numerically with the exercise's
 *    tolerance plus a tiny float-representation epsilon. No unit suffixes
 *    (%, $, …) are accepted — verified against all 85 canonical numeric
 *    answers, none of which carries a unit.
 */

/**
 * Multi-line, indentation-preserving normalization for traced output.
 * - unifies line endings (\r\n and lone \r -> \n)
 * - canonicalizes smart quotes to ASCII
 * - trims trailing spaces/tabs per line
 * - collapses runs of blank lines to one and drops blank lines at the
 *   outer boundaries
 * - PRESERVES leading indentation of every line (GRADE-001a)
 */
export function normalizeWhitespace(s: string): string {
  return s
    .replace(/[\u2018\u2019\u02bc]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''))
    .filter((l, i, arr) => !(l === '' && (i === 0 || i === arr.length - 1 || arr[i - 1] === '')))
    .join('\n')
    .replace(/(?:^\n+|\n+$)/g, '');
}

/**
 * Single-line, whitespace-insensitive normalization for fill_blank answers:
 * case-insensitive, quote-style-insensitive, ignores outer whitespace and
 * one trailing punctuation character (Arabic and Latin).
 */
export function looseNormalize(s: string): string {
  return s
    .replace(/[\u2018\u2019\u02bc]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/[.:؛،!]$/u, '')
    .trim();
}

/**
 * Strict numeric token: optional sign, then digits with optional decimal
 * point (or a leading-point decimal), with optional scientific notation.
 * Rejects anything containing letters/words ("12 apples", "answer is 12"),
 * empty strings, and lone signs.
 */
const NUMERIC_TOKEN = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

function parseStrictNumeric(s: string): number | null {
  const t = s.trim();
  if (!NUMERIC_TOKEN.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
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
      // Option ids are compared exactly (after trimming) — ids, not prose.
      return { passed: learnerAnswer.trim() === expected.trim() };
    case 'fill_blank':
      return { passed: looseNormalize(learnerAnswer) === looseNormalize(expected) };
    case 'trace_output':
      return { passed: normalizeWhitespace(learnerAnswer) === normalizeWhitespace(expected) };
    case 'numeric': {
      const a = parseStrictNumeric(learnerAnswer);
      const b = parseStrictNumeric(expected);
      if (a === null || b === null) return { passed: false };
      const eps = Math.max(tolerance, 1e-9, Math.abs(b) * 1e-9);
      return { passed: Math.abs(a - b) <= eps };
    }
    case 'parsons':
      // Contract (GRADE-002): the learner's answer is the dragged lines
      // joined with '\n' in their chosen order (ExerciseCard:
      // parsonsOrder.join('\n')); `expected` is the canonical order
      // (answer ?? solution). Compared as indentation-preserving multi-line
      // text, so line order AND each line's content must match. Pure and
      // deterministic. 0 active instances in the current 844-exercise
      // baseline (verified by scripts/check_grading_parity.mts) — a
      // supported schema/UI extension point, kept exercised by that check.
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
