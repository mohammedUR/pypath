import type { Page } from '@playwright/test';

/**
 * Shared E2E seeding helpers (Phase 3): pre-populate the persisted stores
 * exactly the way the running app reads them — progress in IndexedDB
 * (`pypath` / `pypath-progress` / `progress:local`) and certification in
 * localStorage (`pypath.certification`, zustand persist shape).
 */

export const CANONICAL_ARTIFACT_IDS = [
  'proposal',
  'skeletal',
  'viable',
  'tests',
  'readme',
  'final',
] as const;

export const CANONICAL_RUBRIC_IDS = [
  'requirements',
  'quality',
  'testing',
  'delivery',
  'reflection',
] as const;

/** Write (a subset of) Part I lesson completion into the progress store —
 * WITHOUT reloading; pair with an explicit reload/navigation afterwards. */
export async function seedPartIProgress(page: Page, skip: string[] = []): Promise<void> {
  const partIIds = await page.evaluate(async () => {
    const response = await fetch('/data/manifest.json');
    const data = (await response.json()) as { lessons: { id: string; part: string }[] };
    return data.lessons.filter((lesson) => lesson.part === 'I').map((lesson) => lesson.id);
  });
  const completed = partIIds.filter((id) => !skip.includes(id));

  await page.evaluate(async (completedLessons) => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('pypath', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('pypath-progress')) {
          request.result.createObjectStore('pypath-progress');
        }
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('pypath-progress', 'readwrite');
        tx.objectStore('pypath-progress').put(
          JSON.stringify({ state: { completedLessons }, version: 1 }),
          'progress:local',
        );
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
    });
  }, completed);
}

/** Complete (a subset of) Part I lessons in the progress store, then reload. */
export async function seedPartICompletion(page: Page, skip: string[] = []): Promise<void> {
  await seedPartIProgress(page, skip);
  await page.reload();
}

export interface SeedCertificationOptions {
  attempts?: { ts: number; score: number; passed: boolean }[];
  artifactIds?: readonly string[];
  rubricScore?: number;
  subject?: string;
  gateMode?: 'advisory' | 'enforced';
}

/** Overwrite the certification store in localStorage (call before reload/goto). */
export async function seedCertification(page: Page, opts: SeedCertificationOptions = {}): Promise<void> {
  const state = {
    state: {
      attempts: opts.attempts ?? [],
      capstoneArtifacts: Object.fromEntries((opts.artifactIds ?? []).map((id) => [id, true])),
      capstoneRubric: Object.fromEntries(
        CANONICAL_RUBRIC_IDS.map((id) => [id, opts.rubricScore ?? 3]),
      ),
      subject: opts.subject ?? '',
      gateMode: opts.gateMode ?? 'advisory',
    },
    version: 1,
  };
  await page.evaluate((serialized) => {
    localStorage.setItem('pypath.certification', serialized);
  }, JSON.stringify(state));
}

/** Read the persisted certification store. */
export async function readCertification(page: Page): Promise<{
  attempts: { ts: number; score: number; passed: boolean }[];
}> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('pypath.certification');
    return raw
      ? (JSON.parse(raw) as { state: { attempts: [] } }).state
      : { attempts: [] };
  });
}

/**
 * Hash-router navigation that works right after a reload: assigning
 * location.hash fires the hashchange event the SPA router listens to (a
 * same-document page.goto with only a hash change is a no-op there).
 */
export async function navHash(page: Page, hash: string): Promise<void> {
  await page.evaluate((h) => {
    window.location.hash = h;
  }, hash);
  await page.waitForFunction((h) => window.location.hash === h, hash, { timeout: 15_000 });
}

/**
 * Deterministic route navigation: land on the app if needed, set the hash
 * in-page, then HARD-reload so the app boots directly at the target route.
 * (page.goto with only a hash change may be skipped by Playwright, and a
 * reload after such a no-op would reload the OLD route.)
 */
export async function gotoHashRoute(page: Page, hash: string): Promise<void> {
  if (!/^https?:/i.test(page.url())) {
    await page.goto('/');
  }
  await page.evaluate((h) => {
    window.location.hash = h;
  }, hash);
  await page.reload();
}
