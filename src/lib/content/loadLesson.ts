import { Lesson as LessonSchema } from './schema';
import { loaders, type LessonResult } from './registry';

/**
 * Lazy validation path (M5, R-ARC-07): pulling this module in also pulls Zod,
 * so it lives OUTSIDE the eager registry — only the lesson view (itself a
 * dynamic chunk) pays for it. Missing ids → { status: 'missing' } (never throws).
 */
export async function loadLesson(id: string): Promise<LessonResult> {
  const loader = loaders[id];
  if (!loader) return { status: 'missing' };
  try {
    const mod = await loader();
    const parsed = LessonSchema.safeParse(mod.default);
    if (!parsed.success) {
      return { status: 'invalid', reason: parsed.error.issues.map((i) => i.message).join('; ') };
    }
    return { status: 'found', lesson: parsed.data };
  } catch (e) {
    return { status: 'invalid', reason: e instanceof Error ? e.message : String(e) };
  }
}
