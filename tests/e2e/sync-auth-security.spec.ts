import { expect, test } from '@playwright/test';
import manifestData from '../../content/manifest.json';
import {
  sanitizeProgressSnapshot,
  sanitizeXpEvent,
  computeCanonicalXp,
  parseSafeTimestamp,
} from '../../src/lib/sync/canonical';
import { mergeProgressSnapshot } from '../../src/lib/sync/merge';
import { defaultProgress, useProgress } from '../../src/lib/store/progress';
import { useManifestStore } from '../../src/lib/content/registry';
import { rateLimit, clientIp } from '../../src/lib/auth/rate-limit';
import { sameOrigin } from '../../src/lib/api/guards';

/**
 * Phase 4 security & sync integrity gates:
 *  - SYNC-001: client-reported XP/lesson ids are never trusted — everything
 *    is canonicalized against the 258-lesson manifest and XP is recomputed.
 *  - SYNC-002: malformed / proto-polluted / tampered import files are
 *    rejected or sanitized; valid exports import with full fidelity.
 *  - AUTH-001: rate limiter enforces limits with strictly bounded memory
 *    (periodic sweep + FIFO eviction at MAX_BUCKETS).
 *  - AUTH-002: oversized/malformed signup payloads → 400, never 500.
 *  - AUTH-003: cross-origin or malformed-Referer mutations → 403, never 500.
 */

const CANONICAL = new Set<string>((manifestData.lessons as Array<{ id: string }>).map((l) => l.id));
const REAL = 'py4e.ch1.l1';

/* ------------------------- SYNC-001 (unit) ------------------------- */

test('SYNC-001: inflated xp + fake lesson ids are stripped; xp recomputed canonically', () => {
  const tampered = {
    version: 1,
    completedLessons: [REAL, 'fake.lesson.1', REAL],
    exerciseResults: {
      [`${REAL}:ex1`]: { passed: true, attempts: 1, hintsUsed: 0, ts: 1 },
      'fake.lesson.1:ex1': { passed: true, attempts: 1, hintsUsed: 0, ts: 1 },
    },
    xp: 999_999,
    xpEvents: [
      { id: `xp:${REAL}:ex1:pass`, amount: 99_999, reason: 'exerciseFirstTry', ts: 10 }, // clamp → 20
      { id: `xp:${REAL}:complete`, amount: 30, reason: 'lessonComplete', ts: 11 }, // exact 30
      { id: 'xp:fake.lesson.1:ex1:pass', amount: 5_000, reason: 'debug', ts: 12 }, // dropped (fake lesson)
      { id: `xp:${REAL}:ex2:pass`, amount: 99, reason: 'quizItem', ts: 13 }, // wrong reason shape → dropped
    ],
    notes: { 'fake.lesson.1': 'x' },
    lessonStarted: { 'fake.lesson.1': 5 },
    settings: { theme: 'system', calm: false, fontScale: 100, soundOff: true, reduceMotion: false },
  };
  const clean = sanitizeProgressSnapshot(tampered, CANONICAL);
  expect(clean).not.toBeNull();
  expect(clean!.completedLessons).toEqual([REAL]); // fake stripped, deduped
  expect(Object.keys(clean!.exerciseResults)).toEqual([`${REAL}:ex1`]);
  expect(Object.keys(clean!.notes)).toEqual([]);
  expect(Object.keys(clean!.lessonStarted)).toEqual([]);
  expect(clean!.xpEvents).toHaveLength(2);
  expect(clean!.xp).toBe(20 + 30); // canonical — never 999999
  expect(computeCanonicalXp(clean!.xpEvents)).toBe(clean!.xp);
});

test('SYNC-001: hint-discounted legit amounts survive with full fidelity', () => {
  const clean = sanitizeProgressSnapshot(
    {
      version: 1,
      completedLessons: [REAL],
      xpEvents: [
        { id: `xp:${REAL}:ex1:pass`, amount: 15, reason: 'exerciseFirstTry', ts: 1 }, // 20 - 1 hint
        { id: `xp:${REAL}:quiz:q1:pass`, amount: 5, reason: 'quizItem', ts: 2 },
        { id: `xp:${REAL}:complete`, amount: 30, reason: 'lessonComplete', ts: 3 },
      ],
      settings: {},
    },
    CANONICAL,
  );
  expect(clean!.xpEvents.map((e) => e.amount)).toEqual([15, 5, 30]);
  expect(clean!.xp).toBe(50);
});

test('SYNC-002: __proto__/constructor keys never survive sanitization', () => {
  const clean = sanitizeProgressSnapshot(
    {
      completedLessons: [],
      exerciseResults: { __proto__: { x: 1 }, constructor: { passed: true, attempts: 1, hintsUsed: 0, ts: 1 } },
      notes: { prototype: 'x', [REAL]: 'ok' },
      settings: {},
    },
    CANONICAL,
  );
  expect(Object.keys(clean!.exerciseResults)).toEqual([]);
  expect(Object.keys(clean!.notes)).toEqual([REAL]);
  const protoProbe = clean as unknown as Record<string, unknown>;
  expect((Object.prototype as unknown as Record<string, unknown>).polluted).toBeUndefined();
  expect(protoProbe.polluted).toBeUndefined();
});

test('SYNC-002: non-object snapshots are rejected, not crashed on', () => {
  expect(sanitizeProgressSnapshot(null, CANONICAL)).toBeNull();
  expect(sanitizeProgressSnapshot([], CANONICAL)).toBeNull();
  expect(sanitizeProgressSnapshot('nope', CANONICAL)).toBeNull();
  expect(sanitizeProgressSnapshot(42, CANONICAL)).toBeNull();
});

test('SYNC-002: importProgress rejects malformed JSON, arrays, and primitives safely', () => {
  expect(useProgress.getState().importProgress('{ invalid json')).toBe(false);
  expect(useProgress.getState().importProgress('')).toBe(false);
  expect(useProgress.getState().importProgress('null')).toBe(false);
  expect(useProgress.getState().importProgress('true')).toBe(false);
  expect(useProgress.getState().importProgress('42')).toBe(false);
  expect(useProgress.getState().importProgress('"just a string"')).toBe(false);
  expect(useProgress.getState().importProgress('[1, 2, 3]')).toBe(false);
});

test('SYNC-002: importProgress rejects invalid envelope types and non-object data safely', () => {
  expect(useProgress.getState().importProgress(JSON.stringify({ app: 'wrong-app', schemaVersion: 1, data: {} }))).toBe(false);
  expect(useProgress.getState().importProgress(JSON.stringify({ app: 'pypath', schemaVersion: 999, data: {} }))).toBe(false);
  expect(useProgress.getState().importProgress(JSON.stringify({ app: 'pypath', schemaVersion: 1, data: null }))).toBe(false);
  expect(useProgress.getState().importProgress(JSON.stringify({ app: 'pypath', schemaVersion: 1, data: 'string' }))).toBe(false);
  expect(useProgress.getState().importProgress(JSON.stringify({ app: 'pypath', schemaVersion: 1, data: [1, 2] }))).toBe(false);
});

test('SYNC-002: importProgress strips fake IDs and non-canonical records even before manifest hydration', () => {
  // Explicitly simulate unhydrated manifest store
  useManifestStore.setState({ manifest: [], ready: false });

  const tamperedPayload = JSON.stringify({
    app: 'pypath',
    schemaVersion: 1,
    data: {
      version: 1,
      completedLessons: [REAL, 'fake.lesson.404', 'totally.bogus.id'],
      exerciseResults: {
        [`${REAL}:ex1`]: { passed: true, attempts: 2, hintsUsed: 0, ts: 100 },
        'fake.lesson.404:ex1': { passed: true, attempts: 1, hintsUsed: 0, ts: 100 },
      },
      xpEvents: [
        { id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry', ts: 100 },
        { id: 'xp:fake.lesson.404:ex1:pass', amount: 5000, reason: 'debug', ts: 100 },
      ],
      xp: 999_999,
      notes: { [REAL]: 'real note', 'fake.lesson.404': 'fake note' },
      lessonStarted: { [REAL]: 100, 'fake.lesson.404': 100 },
      settings: { theme: 'system', calm: false, fontScale: 100, soundOff: true, reduceMotion: false },
    },
  });

  const ok = useProgress.getState().importProgress(tamperedPayload);
  expect(ok).toBe(true);

  const state = useProgress.getState();
  expect(state.completedLessons).toEqual([REAL]);
  expect(Object.keys(state.exerciseResults)).toEqual([`${REAL}:ex1`]);
  expect(Object.keys(state.notes)).toEqual([REAL]);
  expect(Object.keys(state.lessonStarted)).toEqual([REAL]);
  expect(state.xpEvents.map((e) => e.id)).toEqual([`xp:${REAL}:ex1:pass`]);
  expect(state.xp).toBe(20);
});

test('SYNC-002: importProgress strips inflated XP and recomputes XP canonically', () => {
  const payload = JSON.stringify({
    app: 'pypath',
    schemaVersion: 1,
    data: {
      version: 1,
      completedLessons: [REAL],
      exerciseResults: {
        [`${REAL}:ex1`]: { passed: true, attempts: 1, hintsUsed: 0, ts: 100 },
      },
      xpEvents: [
        { id: `xp:${REAL}:ex1:pass`, amount: 99_999, reason: 'exerciseFirstTry', ts: 100 }, // clamp to 20
        { id: `xp:${REAL}:complete`, amount: 30, reason: 'lessonComplete', ts: 101 }, // exact 30
      ],
      xp: 999_999,
      settings: { theme: 'dark', calm: true, fontScale: 110, soundOff: true, reduceMotion: false },
    },
  });

  expect(useProgress.getState().importProgress(payload)).toBe(true);
  const state = useProgress.getState();
  expect(state.xpEvents).toHaveLength(2);
  expect(state.xpEvents[0].amount).toBe(20);
  expect(state.xpEvents[1].amount).toBe(30);
  expect(state.xp).toBe(50);
});

test('SYNC-002: importProgress drops invalid dates, negative timestamps, and non-finite exercise/XP values', () => {
  const payload = JSON.stringify({
    app: 'pypath',
    schemaVersion: 1,
    data: {
      version: 1,
      completedLessons: [REAL],
      exerciseResults: {
        [`${REAL}:ex1`]: { passed: true, attempts: -1, hintsUsed: 0, ts: 100 }, // negative attempts -> dropped
        [`${REAL}:ex2`]: { passed: true, attempts: 1, hintsUsed: 0, ts: -50 }, // negative ts -> dropped
        [`${REAL}:ex3`]: { passed: true, attempts: 2, hintsUsed: 1, ts: '2026-10-28T16:00:00.000Z' }, // ISO date -> normalized
      },
      xpEvents: [
        { id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry', ts: -10 }, // negative ts -> dropped
        { id: `xp:${REAL}:ex3:pass`, amount: 15, reason: 'exerciseFirstTry', ts: 100 },
      ],
      lessonStarted: {
        [REAL]: -500, // negative ts -> dropped
      },
      settings: { fontScale: 150 },
    },
  });

  expect(useProgress.getState().importProgress(payload)).toBe(true);
  const state = useProgress.getState();
  expect(Object.keys(state.exerciseResults)).toEqual([`${REAL}:ex3`]);
  expect(typeof state.exerciseResults[`${REAL}:ex3`].ts).toBe('number');
  expect(state.exerciseResults[`${REAL}:ex3`].ts).toBeGreaterThan(0);
  expect(state.xpEvents).toHaveLength(1);
  expect(state.xpEvents[0].id).toBe(`xp:${REAL}:ex3:pass`);
  expect(state.lessonStarted[REAL]).toBeUndefined();
  expect(state.settings.fontScale).toBe(150);
});

test('SYNC-002: importProgress safely handles __proto__, constructor, and prototype keys', () => {
  const payload = JSON.stringify({
    __proto__: { polluted: true },
    constructor: { polluted: true },
    app: 'pypath',
    schemaVersion: 1,
    data: {
      __proto__: { polluted: true },
      constructor: { polluted: true },
      prototype: { polluted: true },
      version: 1,
      completedLessons: [REAL],
      exerciseResults: {
        __proto__: { passed: true, attempts: 1, hintsUsed: 0, ts: 100 },
        constructor: { passed: true, attempts: 1, hintsUsed: 0, ts: 100 },
        [`${REAL}:ex1`]: { passed: true, attempts: 1, hintsUsed: 0, ts: 100 },
      },
      notes: {
        prototype: 'malicious',
        [REAL]: 'valid note',
      },
      settings: { theme: 'system', calm: false, fontScale: 100, soundOff: true, reduceMotion: false },
    },
  });

  expect(useProgress.getState().importProgress(payload)).toBe(true);
  const state = useProgress.getState();
  expect((Object.prototype as unknown as Record<string, unknown>).polluted).toBeUndefined();
  expect(Object.keys(state.exerciseResults)).toEqual([`${REAL}:ex1`]);
  expect(Object.keys(state.notes)).toEqual([REAL]);
});

test('SYNC-002: failed import never modifies or partially overwrites existing valid progress', () => {
  // Set up known valid state
  useProgress.setState({
    ...defaultProgress,
    completedLessons: [REAL],
    xp: 20,
    xpEvents: [{ id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry', ts: 100 }],
    notes: { [REAL]: 'original note' },
    settings: { ...defaultProgress.settings, theme: 'dark', fontScale: 125 },
  });

  const snapshotBefore = { ...useProgress.getState() };

  // Attempt invalid imports
  expect(useProgress.getState().importProgress('{ broken json')).toBe(false);
  expect(useProgress.getState().importProgress('{"app":"unknown"}')).toBe(false);
  expect(useProgress.getState().importProgress('{"app":"pypath","schemaVersion":1,"data":null}')).toBe(false);
  expect(useProgress.getState().importProgress('{"app":"pypath","schemaVersion":1,"data":[]}')).toBe(false);

  const stateAfter = useProgress.getState();
  expect(stateAfter.completedLessons).toEqual(snapshotBefore.completedLessons);
  expect(stateAfter.xp).toBe(snapshotBefore.xp);
  expect(stateAfter.xpEvents).toEqual(snapshotBefore.xpEvents);
  expect(stateAfter.notes).toEqual(snapshotBefore.notes);
  expect(stateAfter.settings).toEqual(snapshotBefore.settings);
});

test('SYNC-002: valid export and import round-trips with full fidelity', () => {
  const initial = {
    ...defaultProgress,
    completedLessons: [REAL, REAL2],
    exerciseResults: {
      [`${REAL}:ex1`]: { passed: true, attempts: 3, hintsUsed: 1, ts: 1000 },
      [`${REAL2}:ex1`]: { passed: true, attempts: 1, hintsUsed: 0, ts: 2000 },
    },
    xpEvents: [
      { id: `xp:${REAL}:ex1:pass`, amount: 15, reason: 'exerciseFirstTry' as const, ts: 1000 },
      { id: `xp:${REAL}:complete`, amount: 30, reason: 'lessonComplete' as const, ts: 1500 },
      { id: `xp:${REAL2}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry' as const, ts: 2000 },
    ],
    xp: 65,
    notes: { [REAL]: 'my reflection note', [REAL2]: 'second reflection' },
    lessonStarted: { [REAL]: 500, [REAL2]: 1800 },
    settings: {
      theme: 'sepia' as const,
      calm: true,
      fontScale: 135,
      soundOff: true as const,
      reduceMotion: true,
    },
  };

  useProgress.setState(initial);
  const exportedJson = useProgress.getState().exportProgress();
  expect(typeof exportedJson).toBe('string');

  // Reset store to default
  useProgress.setState({ ...defaultProgress });
  expect(useProgress.getState().completedLessons).toEqual([]);
  expect(useProgress.getState().xp).toBe(0);

  // Import the exported progress
  const ok = useProgress.getState().importProgress(exportedJson);
  expect(ok).toBe(true);

  const restored = useProgress.getState();
  expect(restored.version).toBe(initial.version);
  expect(restored.completedLessons.sort()).toEqual(initial.completedLessons.sort());
  expect(restored.exerciseResults).toEqual(initial.exerciseResults);
  expect(restored.xpEvents).toEqual(initial.xpEvents);
  expect(restored.xp).toBe(65);
  expect(restored.notes).toEqual(initial.notes);
  expect(restored.lessonStarted).toEqual(initial.lessonStarted);
  expect(restored.settings).toEqual(initial.settings);
});

test('SYNC-001: xp events with bad ids / bad reasons are dropped (unit)', () => {
  expect(sanitizeXpEvent({ id: 'xp:not-in-manifest:ex:pass', amount: 20, reason: 'exerciseFirstTry', ts: 1 }, CANONICAL)).toBeNull();
  expect(sanitizeXpEvent({ id: 'garbage', amount: 20, reason: 'exerciseFirstTry', ts: 1 }, CANONICAL)).toBeNull();
  expect(sanitizeXpEvent({ id: `xp:${REAL}:complete`, amount: 30, reason: 'quizItem', ts: 1 }, CANONICAL)).toBeNull();
  expect(sanitizeXpEvent({ id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'lessonComplete', ts: 1 }, CANONICAL)).toBeNull();
  // structural-only mode (manifest not yet hydrated) still bounds the damage
  const bounded = sanitizeXpEvent({ id: 'xp:any.lesson:ex:pass', amount: 99_999, reason: 'exerciseFirstTry', ts: 1 }, new Set());
  expect(bounded?.amount).toBe(20);
});

const REAL2 = 'py4e.ch1.l2';

test('SYNC-001: mergeProgressSnapshot preserves valid client/server unions, drops fake IDs and invalid keys, and recomputes XP deterministically', () => {
  const local = {
    ...defaultProgress,
    completedLessons: [REAL],
    exerciseResults: {
      [`${REAL}:ex1`]: { passed: true, attempts: 1, hintsUsed: 0, ts: 1000 },
    },
    xpEvents: [
      { id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry' as const, ts: 1000 },
    ],
    xp: 20,
    notes: { [REAL]: 'local note' },
    lessonStarted: { [REAL]: 1000 },
  };

  const remoteRaw = {
    version: 1,
    completedLessons: [REAL2, 'fake.lesson.404', REAL],
    exerciseResults: {
      [`${REAL}:ex1`]: { passed: true, attempts: 3, hintsUsed: 1, ts: 2000 },
      [`${REAL2}:ex1`]: { passed: true, attempts: 1, hintsUsed: 0, ts: 1500 },
      'fake.lesson.404:ex1': { passed: true, attempts: 1, hintsUsed: 0, ts: 1500 },
      'invalid:::key': { passed: true, attempts: 1, hintsUsed: 0, ts: 1500 },
    },
    xp: 999_999, // tampered client-controlled XP
    xpEvents: [
      { id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry', ts: 1000 }, // duplicate
      { id: `xp:${REAL2}:ex1:pass`, amount: 99_999, reason: 'exerciseFirstTry', ts: 1500 }, // clamp to 20
      { id: `xp:${REAL2}:complete`, amount: 30, reason: 'lessonComplete', ts: 2500 }, // 30
      { id: 'xp:fake.lesson.404:ex1:pass', amount: 5000, reason: 'debug', ts: 3000 }, // fake lesson -> dropped
    ],
    notes: { [REAL]: 'longer note from remote', 'fake.lesson.404': 'fake note' },
    lessonStarted: { [REAL]: 500, [REAL2]: 1200, 'fake.lesson.404': 100 },
    settings: { theme: 'dark', calm: true, fontScale: 120, soundOff: true, reduceMotion: false },
  };

  const merged = mergeProgressSnapshot(local, remoteRaw, CANONICAL);

  // Completed lessons: union of real lessons, fake stripped
  expect(merged.completedLessons.sort()).toEqual([REAL, REAL2].sort());

  // Exercise results: fake and invalid keys stripped, valid merged with max attempts/hints
  expect(Object.keys(merged.exerciseResults).sort()).toEqual([`${REAL}:ex1`, `${REAL2}:ex1`].sort());
  expect(merged.exerciseResults[`${REAL}:ex1`]).toEqual({
    passed: true,
    attempts: 3,
    hintsUsed: 1,
    ts: 2000,
  });

  // Notes: longer string wins, fake dropped
  expect(merged.notes).toEqual({ [REAL]: 'longer note from remote' });

  // Lesson started: earliest ts wins, fake dropped
  expect(merged.lessonStarted).toEqual({ [REAL]: 500, [REAL2]: 1200 });

  // Settings: local settings win per-device design
  expect(merged.settings).toEqual(local.settings);

  // XP: never 999999, exactly 20 + 20 + 30 = 70 from deduplicated ledger
  expect(merged.xpEvents).toHaveLength(3);
  expect(merged.xp).toBe(70);
  expect(computeCanonicalXp(merged.xpEvents)).toBe(70);
});

test('SYNC-001: repeated sync is idempotent and never multiplies XP or duplicates completions', () => {
  const local = {
    ...defaultProgress,
    completedLessons: [REAL],
    exerciseResults: {
      [`${REAL}:ex1`]: { passed: true, attempts: 1, hintsUsed: 0, ts: 1000 },
    },
    xpEvents: [
      { id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry' as const, ts: 1000 },
    ],
    xp: 20,
  };

  const remote = {
    version: 1,
    completedLessons: [REAL2],
    exerciseResults: {
      [`${REAL2}:ex1`]: { passed: true, attempts: 1, hintsUsed: 0, ts: 1500 },
    },
    xp: 50,
    xpEvents: [
      { id: `xp:${REAL2}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry', ts: 1500 },
      { id: `xp:${REAL2}:complete`, amount: 30, reason: 'lessonComplete', ts: 1600 },
    ],
  };

  const sync1 = mergeProgressSnapshot(local, remote, CANONICAL);
  expect(sync1.xp).toBe(70);
  expect(sync1.completedLessons.sort()).toEqual([REAL, REAL2].sort());
  expect(sync1.xpEvents).toHaveLength(3);

  // Second sync with identical remote
  const sync2 = mergeProgressSnapshot(sync1, remote, CANONICAL);
  expect(sync2.xp).toBe(70);
  expect(sync2.completedLessons.sort()).toEqual([REAL, REAL2].sort());
  expect(sync2.xpEvents).toHaveLength(3);

  // Third sync with local and remote identical
  const sync3 = mergeProgressSnapshot(sync2, sync2, CANONICAL);
  expect(sync3.xp).toBe(70);
  expect(sync3.completedLessons.sort()).toEqual([REAL, REAL2].sort());
  expect(sync3.xpEvents).toHaveLength(3);
});

test('SYNC-001: malformed dates and negative/non-finite timestamps are safely normalized or rejected', () => {
  // Test parseSafeTimestamp directly
  expect(parseSafeTimestamp(1000)).toBe(1000);
  expect(parseSafeTimestamp('2026-10-28T16:00:00.000Z')).toBe(Date.parse('2026-10-28T16:00:00.000Z'));
  expect(parseSafeTimestamp(-500)).toBeNull();
  expect(parseSafeTimestamp(NaN)).toBeNull();
  expect(parseSafeTimestamp(Infinity)).toBeNull();
  expect(parseSafeTimestamp('not-a-date')).toBeNull();
  expect(parseSafeTimestamp(null)).toBeNull();
  expect(parseSafeTimestamp({})).toBeNull();

  // Test in progress snapshot
  const dirty = {
    version: 1,
    completedLessons: [REAL],
    exerciseResults: {
      [`${REAL}:ex1`]: { passed: true, attempts: -5, hintsUsed: 9999999, ts: -100 }, // negative ts -> dropped
      [`${REAL}:ex2`]: { passed: true, attempts: 2, hintsUsed: 0, ts: '2026-10-28T16:00:00.000Z' }, // ISO string -> normalized
    },
    xpEvents: [
      { id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry', ts: -50 }, // negative ts -> dropped
      { id: `xp:${REAL}:ex2:pass`, amount: 20, reason: 'exerciseFirstTry', ts: '2026-10-28T16:00:00.000Z' }, // normalized
    ],
    lessonStarted: {
      [REAL]: -500, // negative -> dropped
    },
    settings: { fontScale: -100 },
  };

  const clean = sanitizeProgressSnapshot(dirty, CANONICAL);
  expect(clean).not.toBeNull();
  expect(clean!.exerciseResults[`${REAL}:ex1`]).toBeUndefined(); // dropped due to negative ts
  expect(clean!.exerciseResults[`${REAL}:ex2`]).toBeDefined();
  expect(typeof clean!.exerciseResults[`${REAL}:ex2`].ts).toBe('number');
  expect(clean!.exerciseResults[`${REAL}:ex2`].ts).toBeGreaterThan(0);
  expect(clean!.xpEvents).toHaveLength(1); // negative ts event dropped
  expect(clean!.lessonStarted[REAL]).toBeUndefined(); // negative ts dropped
  expect(clean!.settings.fontScale).toBe(50); // clamped to min 50
});

test('SYNC-001: mergeProgressSnapshot without canonicalLessons argument still applies structural sanitization', () => {
  const local = { ...defaultProgress };
  const untrustedRemote = {
    xp: 999_999,
    xpEvents: [
      { id: 'xp:some.lesson:ex1:pass', amount: 99_999, reason: 'exerciseFirstTry', ts: 100 },
    ],
    exerciseResults: {
      'some.lesson:ex1': { passed: true, attempts: 1, hintsUsed: 0, ts: 100 },
    },
  };

  // Called without canonicalLessons argument (undefined)
  const merged = mergeProgressSnapshot(local, untrustedRemote);
  // Remote xp is ignored; amount clamped to canonical 20
  expect(merged.xp).toBe(20);
  expect(merged.xpEvents[0].amount).toBe(20);
});

/* ------------------------- AUTH-001 (unit) ------------------------- */

test('AUTH-001: limiter blocks past the threshold and bounds memory with FIFO eviction', () => {
  const key = `unit-a:${Date.now()}`;
  for (let i = 0; i < 5; i++) {
    expect(rateLimit(key, 5, 60_000).allowed, `hit ${i + 1} allowed`).toBe(true);
  }
  const blocked = rateLimit(key, 5, 60_000);
  expect(blocked.allowed).toBe(false);
  expect(blocked.retryAfterSec).toBeGreaterThan(0);
  expect(rateLimit(`${key}-other`, 5, 60_000).allowed, 'other keys unaffected').toBe(true);

  // Hard capacity: fill past MAX_BUCKETS (10_000) with fresh one-hit keys;
  // the OLDEST keys are evicted first, so the first key becomes allowed again.
  const firstKey = `unit-evict:first:${Date.now()}`;
  expect(rateLimit(firstKey, 1, 60_000).allowed).toBe(true);
  expect(rateLimit(firstKey, 1, 60_000).allowed).toBe(false); // at its limit
  for (let i = 0; i < 10_050; i++) rateLimit(`unit-evict:fill:${Date.now()}:${i}`, 1, 60_000);
  expect(rateLimit(firstKey, 1, 60_000).allowed, 'oldest bucket evicted under pressure').toBe(true);
});

test('AUTH-001: hits expire with the window and the block lifts', async () => {
  const key = `unit-expire:${Date.now()}`;
  expect(rateLimit(key, 1, 60_000).allowed).toBe(true);
  const blocked = rateLimit(key, 1, 60_000);
  expect(blocked.allowed).toBe(false);
  // Retry hint is at least 1s and bounded by the 60s window.
  expect(blocked.retryAfterSec).toBeGreaterThanOrEqual(1);
  expect(blocked.retryAfterSec).toBeLessThanOrEqual(60);

  // Once the window slides past, expired hits are dropped and the same
  // key is allowed again — stale hits never accumulate against a client.
  const shortKey = `unit-expire:short:${Date.now()}`;
  expect(rateLimit(shortKey, 1, 40).allowed).toBe(true);
  expect(rateLimit(shortKey, 1, 40).allowed).toBe(false);
  await new Promise((resolve) => setTimeout(resolve, 80));
  expect(rateLimit(shortKey, 1, 40).allowed, 'window slid past → allowed again').toBe(true);
});

test('AUTH-001: clientIp validates and bounds forwarded tokens, failing back safely', () => {
  const req = (headers: Record<string, string>) =>
    new Request('http://localhost:3000/api/x', { method: 'POST', headers });

  // First x-forwarded-for token wins; the rest of the chain is ignored.
  expect(clientIp(req({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1, 10.0.0.2' }))).toBe('203.0.113.7');
  // Surrounding whitespace is trimmed; IPv6 (colon/hex charset) passes.
  expect(clientIp(req({ 'x-forwarded-for': '  2001:db8::1 ' }))).toBe('2001:db8::1');
  // Malformed first tokens (unexpected charset) are rejected, never parsed.
  expect(clientIp(req({ 'x-forwarded-for': '1.2.3.4; rm -rf /' }))).toBe('unknown');
  expect(clientIp(req({ 'x-forwarded-for': '<script>1.2.3.4' }))).toBe('unknown');
  // A valid-charset but oversized token (> 64 chars) cannot become a key.
  expect(clientIp(req({ 'x-forwarded-for': 'a'.repeat(65) }))).toBe('unknown');
  // Fallback chain: malformed forwarded → x-real-ip → 'unknown'.
  expect(clientIp(req({ 'x-forwarded-for': 'not an ip', 'x-real-ip': '198.51.100.9' }))).toBe('198.51.100.9');
  expect(clientIp(req({}))).toBe('unknown');
});

/* ------------------------- AUTH-003 (unit) ------------------------- */

test('AUTH-003: sameOrigin accepts forwarded hosts, rejects evil origins and malformed Referers', () => {
  const mk = (headers: Record<string, string>) =>
    new Request('http://localhost:3000/api/x', { method: 'POST', headers });

  expect(sameOrigin(mk({ origin: 'https://evil.example.com' }))).toBe(false);
  expect(sameOrigin(mk({ origin: 'http://localhost:3000' }))).toBe(true);
  // Reverse proxy: public host arrives via x-forwarded-host.
  expect(sameOrigin(mk({ host: 'internal:3000', 'x-forwarded-host': 'app.vercel.app', origin: 'https://app.vercel.app' }))).toBe(true);
  // No Origin: malformed Referer fails closed, valid same-host Referer passes.
  expect(sameOrigin(mk({ referer: 'http://[::1' }))).toBe(false);
  expect(sameOrigin(mk({ referer: 'http://localhost:3000/some/page' }))).toBe(true);
  expect(sameOrigin(mk({}))).toBe(true);
});

/* ------------------- AUTH-002/003 (API, dev server) ------------------- */

const ORIGIN = { origin: 'http://localhost:3000' };

/**
 * Dedicated limiter IPs (TEST-NET-3) for the register tests that consume the
 * AUTH-001 budget: the limiter keys on clientIp, so without isolation these
 * requests would share the 'unknown' bucket with accounts-sync.spec.ts's
 * browser-driven registrations in a single full-suite run.
 */
const RATE_TEST_IP = { auth002: '203.0.113.78', hammer: '203.0.113.77' };

test('AUTH-003: cross-origin mutations are rejected with 403 (never 500)', async ({ request }) => {
  for (const path of ['/api/auth/register', '/api/progress']) {
    const res = await request.post(path, {
      headers: { origin: 'https://evil.example.com' },
      data: {},
    });
    expect(res.status(), `${path} forged origin`).toBe(403);
  }
  const badReferer = await request.post('/api/auth/register', {
    headers: { referer: 'http://[::1' },
    data: {},
  });
  expect(badReferer.status(), 'malformed referer fails closed').toBe(403);
});

test('AUTH-002: oversized password and malformed bodies are 400 (never 500)', async ({ request }) => {
  const headers = { ...ORIGIN, 'x-forwarded-for': RATE_TEST_IP.auth002 };
  const oversize = await request.post('/api/auth/register', {
    headers,
    data: { email: 'oversize-pw@test.local', password: 'a'.repeat(200), name: 'x' },
  });
  expect(oversize.status()).toBe(400);

  const shortPw = await request.post('/api/auth/register', {
    headers,
    data: { email: 'short-pw@test.local', password: 'a'.repeat(4) },
  });
  expect(shortPw.status()).toBe(400);

  const malformed = await request.post('/api/auth/register', {
    headers: { ...headers, 'content-type': 'application/json' },
    data: '{not-json',
  });
  expect(malformed.status()).toBe(400);
});

test('AUTH-001: hammering register trips the 429 limiter (no 500s)', async ({ request }) => {
  const statuses: number[] = [];
  for (let i = 0; i < 14; i++) {
    // Empty bodies: the limiter runs BEFORE parsing, so these consume the
    // budget (400) without creating any real account. The dedicated test IP
    // starts from a fresh bucket: 10 × 400 then 4 × 429, deterministically.
    const res = await request.post('/api/auth/register', {
      headers: { ...ORIGIN, 'x-forwarded-for': RATE_TEST_IP.hammer },
      data: {},
    });
    statuses.push(res.status());
  }
  expect(Math.max(...statuses), 'at least one throttled response').toBe(429);
  expect(statuses.includes(500), 'never a 500').toBe(false);
});

/* ------------------- SYNC-002 (import flow, browser) ------------------- */

function tamperedImportFile(): string {
  return JSON.stringify({
    app: 'pypath',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data: {
      version: 1,
      completedLessons: [REAL, 'fake.lesson.1'],
      exerciseResults: {},
      xpEvents: [
        { id: `xp:${REAL}:ex1:pass`, amount: 20, reason: 'exerciseFirstTry', ts: 10 },
        { id: `xp:${REAL}:complete`, amount: 30, reason: 'lessonComplete', ts: 11 },
        { id: 'xp:fake.lesson.1:ex1:pass', amount: 999_999, reason: 'debug', ts: 12 },
      ],
      xp: 999_999,
      notes: {},
      lessonStarted: {},
      settings: { theme: 'system', calm: false, fontScale: 100, soundOff: true, reduceMotion: false },
    },
  });
}

test('SYNC-002: tampered import file sanitizes to canonical progress (UI end-to-end)', async ({ page }) => {
  await page.goto('/#/ar/settings');
  await expect(page.getByRole('heading', { name: /الإعدادات|Settings/ })).toBeVisible({ timeout: 20_000 });
  // manifest must be hydrated for canonical filtering
  await page.waitForFunction(
    () => fetch('/data/manifest.json').then((r) => r.ok),
    undefined,
    { timeout: 15_000 },
  );

  await page.setInputFiles('input[type="file"]', {
    name: 'tampered-progress.json',
    mimeType: 'application/json',
    buffer: Buffer.from(tamperedImportFile()),
  });
  await expect(page.getByText('استوردنا تقدّمك بنجاح.')).toBeVisible({ timeout: 15_000 });

  const stored = await page.evaluate(
    () =>
      new Promise<{ completedLessons?: string[]; xp?: number }>((resolve, reject) => {
        const req = indexedDB.open('pypath', 1);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction('pypath-progress', 'readonly');
          const get = tx.objectStore('pypath-progress').get('progress:local');
          get.onsuccess = () => {
            db.close();
            const parsed = get.result ? (JSON.parse(String(get.result)) as { state: { completedLessons: string[]; xp: number } }) : { state: { completedLessons: [], xp: 0 } };
            resolve({ completedLessons: parsed.state.completedLessons, xp: parsed.state.xp });
          };
          get.onerror = () => reject(get.error);
        };
        req.onerror = () => reject(req.error);
      }),
  );
  expect(stored.completedLessons).toEqual([REAL]); // fake id stripped
  expect(stored.xp).toBe(50); // canonical — never 999999
});

test('SYNC-002: corrupted import file fails cleanly and keeps existing progress', async ({ page }) => {
  await page.goto('/#/ar/settings');
  await expect(page.getByRole('heading', { name: /الإعدادات|Settings/ })).toBeVisible({ timeout: 20_000 });
  await page.setInputFiles('input[type="file"]', {
    name: 'corrupt.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"app":"pypath","data":{"completedLessons":["fake.lesson.1"]'),
  });
  await expect(page.getByText('الملف غير صالح')).toBeVisible({ timeout: 15_000 });
});
