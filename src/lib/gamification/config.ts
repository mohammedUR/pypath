/**
 * Gamification — every number lives here (single source of truth).
 * Calm by design: XP is a gentle whisper, never a slot machine.
 */
export const XP_PER_EXERCISE = {
  firstTry: 20,
  retry: 10,
  debug: 15,
  quizItem: 5,
  lessonComplete: 30,
} as const;

export const HINT_XP_PENALTY = 5; // per hint revealed (min floor applies)
export const HINT_XP_FLOOR = 5; // an exercise can never award less than this
export const SOLUTION_UNLOCK_ATTEMPTS = 2; // solution button unlocks after N attempts

/** Level curve: level = floor(sqrt(xp / 50)) → L1 at 50xp, L2 at 200, L3 at 450… */
export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 50));
}

/** XP needed to *reach* a given level (for ring/progress display). */
export function xpForLevel(level: number): number {
  return 50 * level * level;
}

export function levelProgress(xp: number): { level: number; into: number; span: number; frac: number } {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - base;
  const span = next - base;
  return { level, into, span, frac: span > 0 ? Math.min(1, into / span) : 1 };
}

export const DAILY_GOAL_LESSONS = 2; // daily plan suggestion
export const REVIEW_QUEUE_CAP = 20; // FSRS queue cap (M2/M3 consumers)

export type XpReason =
  | 'exerciseFirstTry'
  | 'exerciseRetry'
  | 'debug'
  | 'quizItem'
  | 'lessonComplete';
