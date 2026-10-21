import { z } from 'zod';

/**
 * Content schema (ADR-0005): lessons are typed TS data validated by Zod.
 * Bilingual fields are always { ar, en } — authored per locale (R-I18N-04).
 */

export const L10n = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
});
export type L10nText = z.infer<typeof L10n>;

export const ExerciseKind = z.enum([
  'write_code',
  'mcq',
  'fill_blank',
  'trace_output',
  'numeric',
  'parsons',
]);
export type ExerciseKind = z.infer<typeof ExerciseKind>;

export const TestSpec = z.object({
  id: z.string().min(1),
  name: L10n,
  /** Python assert statement run against the learner's code. */
  code: z.string().min(1),
  /** Expected repr shown in the results list (plain data, bilingual-safe). */
  expected: z.string().optional(),
});

export const Block = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('hook'),
    text: L10n,
  }),
  z.object({
    kind: z.literal('predict'),
    code: z.string().min(1),
    question: L10n,
    reveal: L10n,
    /** CI metadata: this demo intentionally raises this error class to teach
     *  error-reading (verified by wave3-replay-checks, not a content bug). */
    expectedError: z.string().min(1).optional(),
  }),
  z.object({
    kind: z.literal('concept'),
    heading: L10n,
    /** Each chunk ≤ 150 words (authoring constraint). */
    chunks: z.array(L10n).min(1).max(4),
  }),
  z.object({
    kind: z.literal('worked'),
    title: L10n,
    code: z.string().min(1),
    explanation: L10n,
  }),
  z.object({
    kind: z.literal('exercise'),
    id: z.string().min(1),
    exKind: ExerciseKind,
    required: z.boolean().default(true),
    prompt: L10n,
    /** write_code / parsons starter; trace_output shows `code` to read. */
    starterCode: z.string().optional(),
    code: z.string().optional(),
    /** Reference solution (pattern fallback + hint ladder level 4). */
    solution: z.string().min(1),
    tests: z.array(TestSpec).optional(),
    /** mcq options */
    options: z.array(z.object({ id: z.string(), text: L10n })).optional(),
    /** fill_blank / trace_output / numeric / mcq target answer */
    answer: z.string().optional(),
    /** numeric tolerance */
    tolerance: z.number().optional(),
    /** parsons shuffled lines (render order is shuffled at display time) */
    items: z.array(z.string()).optional(),
    /** Exactly 4: nudge → concept → skeleton → solution */
    hints: z.array(L10n).length(4),
  }),
  z.object({
    kind: z.literal('debug'),
    id: z.string().min(1),
    required: z.boolean().default(true),
    brokenCode: z.string().min(1),
    /** CI metadata: some debug blocks intentionally crash with a documented
     *  error class (that crash IS the pedagogy — e.g. py2 print statement,
     *  int('خمسة')). Blocks WITHOUT this field must run and fail logically,
     *  matched against symptom oracles by wave3-replay-checks. */
    expectedError: z.string().min(1).optional(),
    prompt: L10n,
    solution: z.string().min(1),
    tests: z.array(TestSpec).min(1),
    hints: z.array(L10n).length(4),
  }),
  z.object({
    kind: z.literal('sandbox'),
    starterCode: z.string().min(1),
    /** CI metadata: see predict.expectedError. */
    expectedError: z.string().min(1).optional(),
    prompt: L10n,
  }),
  z.object({
    kind: z.literal('quiz'),
    id: z.string().min(1),
    items: z
      .array(
        z.object({
          id: z.string().min(1),
          question: L10n,
          options: z.array(z.object({ id: z.string(), text: L10n })).min(2).max(5),
          answer: z.string().min(1),
          explanation: L10n,
        }),
      )
      .min(3)
      .max(6),
  }),
  z.object({
    kind: z.literal('pitfalls'),
    items: z
      .array(
        z.object({
          wrong: z.string().min(1),
          right: z.string().min(1),
          note: L10n,
        }),
      )
      .min(1),
  }),
  z.object({
    kind: z.literal('summary'),
    bullets: z.array(L10n).min(2).max(5),
    reflectPrompt: L10n,
  }),
  z.object({
    kind: z.literal('sources'),
    items: z.array(
      z.object({
        book: z.string().min(1),
        section: z.string().min(1),
        pages: z.string().optional(),
      }),
    ),
  }),
]);

export type Block = z.infer<typeof Block>;

export const Lesson = z.object({
  id: z.string().regex(/^[a-z0-9]+(\.[a-z0-9]+)*$/),
  version: z.number().int().min(1),
  part: z.enum(['I', 'II']),
  track: z.string().min(1),
  book: z.string().min(1),
  chapter: z.number().int().min(1),
  title: L10n,
  estimatedMinutes: z.number().int().min(5).max(90),
  prerequisites: z.array(z.string()),
  blocks: z.array(Block).min(5),
  sources: z.array(
    z.object({
      book: z.string().min(1),
      section: z.string().min(1),
      pages: z.string().optional(),
    }),
  ),
});

export type Lesson = z.infer<typeof Lesson>;

/** All exercise-bearing blocks of a lesson (for completion rules). */
export function requiredExerciseIds(lesson: Lesson): string[] {
  return lesson.blocks
    .filter(
      (b): b is Extract<Block, { kind: 'exercise' | 'debug' }> =>
        (b.kind === 'exercise' || b.kind === 'debug') && b.required,
    )
    .map((b) => b.id);
}
