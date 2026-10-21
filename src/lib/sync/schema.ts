import { z } from 'zod';

/**
 * Wire-layer validation for the progress sync payload. Shared by the API
 * (validation) and the client (construction). Caps keep any single user's
 * snapshot bounded; values are pre-normalized client-side by merge.ts.
 */

const lessonId = z.string().min(1).max(140).regex(/^[A-Za-z0-9._:-]+$/);
const progressKey = z.string().min(1).max(200).regex(/^[A-Za-z0-9._:\/-]+$/);

export const exerciseResultSchema = z.object({
  passed: z.boolean(),
  attempts: z.number().int().min(0).max(100_000),
  hintsUsed: z.number().int().min(0).max(10_000),
  ts: z.number().int().min(0),
});

export const xpEventSchema = z.object({
  id: z.string().min(1).max(200).regex(/^[A-Za-z0-9._:\/-]+$/),
  amount: z.number().int().min(-1000).max(100_000),
  reason: z.enum(['exerciseFirstTry', 'exerciseRetry', 'debug', 'quizItem', 'lessonComplete']),
  ts: z.number().int().min(0),
});

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'sepia', 'system']),
  calm: z.boolean(),
  fontScale: z.number().min(50).max(300).int(),
  soundOff: z.boolean(),
  reduceMotion: z.boolean(),
});

export const progressPayloadSchema = z.object({
  version: z.number().int().min(1).max(999),
  completedLessons: z.array(lessonId).max(3000),
  exerciseResults: z.record(progressKey, exerciseResultSchema),
  notes: z.record(lessonId, z.string().max(10_000)),
  lessonStarted: z.record(lessonId, z.number().int().min(0)),
  settings: settingsSchema,
});

export const certificationSchema = z
  .object({
    version: z.number().int().min(1).max(999).optional(),
    attempts: z
      .array(z.object({ ts: z.number().int().min(0), score: z.number().min(0).max(1), passed: z.boolean() }))
      .max(500)
      .optional(),
    capstoneArtifacts: z.record(z.string().max(80), z.boolean()).optional(),
    capstoneRubric: z.record(z.string().max(80), z.number().int().min(0).max(3)).optional(),
    subject: z.string().max(120).optional(),
    gateMode: z.enum(['advisory', 'enforced']).optional(),
  })
  .refine((d) => Object.keys(d.capstoneArtifacts ?? {}).length <= 100, {
    message: 'too many artifacts',
  })
  .refine((d) => Object.keys(d.capstoneRubric ?? {}).length <= 100, {
    message: 'too many rubric criteria',
  });

export const accountSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .refine((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), { message: 'email' }),
  password: z.string().min(8).max(72),
  name: z
    .string()
    .trim()
    .max(60)
    .optional()
    .transform((s) => (s && s.length ? s : null)),
});

export const progressBodySchema = z.object({
  base: z.number().int().min(0).optional(),
  progress: progressPayloadSchema,
  certification: certificationSchema.optional(),
  newXpEvents: z.array(xpEventSchema).max(1000).optional(),
});
