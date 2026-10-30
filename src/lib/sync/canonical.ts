/**
 * Canonical progress derivation & sanitization (SYNC-001 / SYNC-002).
 *
 * One shared module used by BOTH sides of the wire:
 *  - client: merge.ts (remote snapshots), progress.ts importProgress (file import)
 *  - server: /api/progress (everything stored is canonicalized first)
 *
 * Rules:
 *  - Lesson ids must belong to the canonical 258-lesson manifest set; anything
 *    else ("fake.lesson.1", duplicated ids, oversized ids) is dropped.
 *  - XP event ids are DETERMINISTIC (`xp:<lesson>:<ex>:pass`,
 *    `xp:<lesson>:quiz:<item>:pass`, `xp:<lesson>:complete`) and must parse to
 *    a canonical lesson; the reason must match the id shape, and the amount is
 *    forced into the platform's canonical envelope for that reason
 *    (lessonComplete/quizItem are exact; exercise passes clamp to
 *    [HINT_XP_FLOOR, base] because hint discounts only ever lower them).
 *  - `xp` is ALWAYS recomputed from the sanitized ledger — a client-supplied
 *    `xp: 9999999` is never trusted anywhere.
 *  - Records are rebuilt key-by-key, so `__proto__` / `constructor` /
 *    `prototype` keys (and any other unknown key) never survive.
 */

import {
  XP_PER_EXERCISE,
  HINT_XP_FLOOR,
  type XpReason,
} from '@/lib/gamification/config';
// Server-safe home for the canonical Capstone IDs — importing them from the
// 'use client' certification store throws on the server (client references
// are not iterable), which 500s the /api/progress write path.
import {
  CAPSTONE_ARTIFACT_IDS,
  CAPSTONE_RUBRIC_IDS,
} from '@/lib/cert/capstone';

const LESSON_ID_MAX = 140;
const LESSON_ID_RE = /^[A-Za-z0-9._:-]{1,140}$/;
const EXERCISE_KEY_MAX = 200;
const EXERCISE_KEY_RE = /^[A-Za-z0-9._:/-]{1,200}$/;
const NOTE_MAX = 10_000;
const SUBJECT_MAX = 120;
const ATTEMPTS_CAP = 500;
/** Keys that must never be copied into a rebuilt record. */
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

type Json = unknown;

function asObj(v: Json): Record<string, Json> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, Json>) : {};
}

function safeKey(k: string): boolean {
  return k.length > 0 && !DANGEROUS_KEYS.has(k);
}

function clampInt(v: Json, min: number, max: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : min;
}

/** Safely parse and normalize timestamps: accepts non-negative numbers or valid ISO date strings, rejects malformed dates. */
export function parseSafeTimestamp(v: Json): number | null {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
    return Math.min(Number.MAX_SAFE_INTEGER, Math.round(v));
  }
  if (typeof v === 'string' && v.length > 0 && v.length <= 40) {
    const t = Date.parse(v);
    if (Number.isFinite(t) && t >= 0) {
      return Math.min(Number.MAX_SAFE_INTEGER, Math.round(t));
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* XP envelope                                                         */
/* ------------------------------------------------------------------ */

/** Canonical amount envelope per reason: fixed for lesson/quiz, clamped for
 * exercise passes (the hint discount only ever lowers a legit award). */
export function canonicalXpBounds(reason: XpReason): { min: number; max: number } {
  switch (reason) {
    case 'lessonComplete':
      return { min: XP_PER_EXERCISE.lessonComplete, max: XP_PER_EXERCISE.lessonComplete };
    case 'quizItem':
      return { min: XP_PER_EXERCISE.quizItem, max: XP_PER_EXERCISE.quizItem };
    case 'exerciseFirstTry':
      return { min: HINT_XP_FLOOR, max: XP_PER_EXERCISE.firstTry };
    case 'exerciseRetry':
      return { min: HINT_XP_FLOOR, max: XP_PER_EXERCISE.retry };
    case 'debug':
      return { min: HINT_XP_FLOOR, max: XP_PER_EXERCISE.debug };
  }
}

export type XpEventKind = 'exercise' | 'quiz' | 'lesson';

/** Parse a deterministic XP event id into its canonical reference. */
export function parseXpEventId(id: string): { lessonId: string; kind: XpEventKind } | null {
  if (typeof id !== 'string' || id.length > EXERCISE_KEY_MAX + 16 || !id.startsWith('xp:')) return null;
  if (id.endsWith(':complete')) {
    const lessonId = id.slice(3, -':complete'.length);
    return lessonId.length > 0 && lessonId.length <= LESSON_ID_MAX && LESSON_ID_RE.test(lessonId)
      ? { lessonId, kind: 'lesson' }
      : null;
  }
  if (!id.endsWith(':pass')) return null;
  const body = id.slice(3, -':pass'.length);
  const sep = body.indexOf(':');
  if (sep <= 0) return null;
  const lessonId = body.slice(0, sep);
  const rest = body.slice(sep + 1);
  if (lessonId.length === 0 || lessonId.length > LESSON_ID_MAX || !LESSON_ID_RE.test(lessonId)) return null;
  if (rest.length === 0 || rest.length > LESSON_ID_MAX) return null;
  return { lessonId, kind: rest.startsWith('quiz:') ? 'quiz' : 'exercise' };
}

const REASONS: readonly XpReason[] = [
  'exerciseFirstTry',
  'exerciseRetry',
  'debug',
  'quizItem',
  'lessonComplete',
];

function reasonForKind(kind: XpEventKind): readonly XpReason[] {
  switch (kind) {
    case 'lesson':
      return ['lessonComplete'];
    case 'quiz':
      return ['quizItem'];
    case 'exercise':
      return ['exerciseFirstTry', 'exerciseRetry', 'debug'];
  }
}

export interface SanitizedXpEvent {
  id: string;
  amount: number;
  reason: XpReason;
  ts: number;
}

/**
 * Validate one raw XP event against the canonical rules. Returns the sanitized
 * event (amount forced into the canonical envelope) or null to drop it.
 * `canonicalLessons` may be empty (manifest not yet hydrated) — then only the
 * structural checks apply; id/amount shapes still bound the damage.
 */
export function sanitizeXpEvent(
  raw: Json,
  canonicalLessons: ReadonlySet<string>,
): SanitizedXpEvent | null {
  const e = asObj(raw);
  const ts = parseSafeTimestamp(e.ts);
  if (typeof e.id !== 'string' || typeof e.amount !== 'number' || !Number.isFinite(e.amount) || ts === null) return null;
  const ref = parseXpEventId(e.id);
  if (!ref) return null;
  if (canonicalLessons.size > 0 && !canonicalLessons.has(ref.lessonId)) return null;
  const reason = e.reason as Json;
  if (typeof reason !== 'string' || !REASONS.includes(reason as XpReason)) return null;
  if (!reasonForKind(ref.kind).includes(reason as XpReason)) return null;
  const { min, max } = canonicalXpBounds(reason as XpReason);
  const amount = clampInt(e.amount, min, max);
  return { id: e.id, amount, reason: reason as XpReason, ts };
}

/** Deterministic XP: always the sum of the SANITIZED ledger. */
export function computeCanonicalXp(events: readonly SanitizedXpEvent[]): number {
  return events.reduce((sum, e) => sum + e.amount, 0);
}

/* ------------------------------------------------------------------ */
/* Progress snapshot                                                   */
/* ------------------------------------------------------------------ */

export interface SanitizedProgress {
  version: number;
  completedLessons: string[];
  exerciseResults: Record<string, { passed: boolean; attempts: number; hintsUsed: number; ts: number }>;
  xp: number;
  xpEvents: SanitizedXpEvent[];
  notes: Record<string, string>;
  lessonStarted: Record<string, number>;
  settings: {
    theme: 'light' | 'dark' | 'sepia' | 'system';
    calm: boolean;
    fontScale: number;
    soundOff: boolean;
    reduceMotion: boolean;
  };
}

function lessonKeyOk(k: string, canonicalLessons: ReadonlySet<string>): boolean {
  if (!safeKey(k) || k.length === 0 || k.length > LESSON_ID_MAX || !LESSON_ID_RE.test(k)) return false;
  return canonicalLessons.size === 0 || canonicalLessons.has(k);
}

function exerciseKeyOk(k: string, canonicalLessons: ReadonlySet<string>): boolean {
  if (!safeKey(k) || k.length === 0 || k.length > EXERCISE_KEY_MAX) return false;
  if (!EXERCISE_KEY_RE.test(k)) return false;
  const sep = k.indexOf(':');
  if (sep <= 0) return false;
  const lessonId = k.slice(0, sep);
  if (!LESSON_ID_RE.test(lessonId)) return false;
  return canonicalLessons.size === 0 || canonicalLessons.has(lessonId);
}

/**
 * Sanitize an untrusted progress snapshot (sync remote, import file, API
 * body). Returns null when the input is not a plain object. `xp` is
 * recomputed canonically; unknown/oversized/dangerous keys are dropped.
 */
export function sanitizeProgressSnapshot(
  raw: Json,
  canonicalLessons: ReadonlySet<string>,
): SanitizedProgress | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const src = asObj(raw);

  const completedLessons: string[] = [];
  const seenLessons = new Set<string>();
  if (Array.isArray(src.completedLessons)) {
    for (const item of src.completedLessons) {
      if (typeof item !== 'string') continue;
      if (lessonKeyOk(item, canonicalLessons) && !seenLessons.has(item)) {
        seenLessons.add(item);
        completedLessons.push(item);
      }
    }
  }

  const exerciseResults: SanitizedProgress['exerciseResults'] = {};
  for (const [k, v] of Object.entries(asObj(src.exerciseResults))) {
    if (!exerciseKeyOk(k, canonicalLessons)) continue;
    const r = asObj(v);
    const ts = parseSafeTimestamp(r.ts);
    if (
      typeof r.passed !== 'boolean' ||
      typeof r.attempts !== 'number' ||
      !Number.isFinite(r.attempts) ||
      r.attempts < 0 ||
      typeof r.hintsUsed !== 'number' ||
      !Number.isFinite(r.hintsUsed) ||
      r.hintsUsed < 0 ||
      ts === null
    ) {
      continue;
    }
    exerciseResults[k] = {
      passed: r.passed,
      attempts: clampInt(r.attempts, 0, 100_000),
      hintsUsed: clampInt(r.hintsUsed, 0, 10_000),
      ts,
    };
  }

  const seenEvents = new Set<string>();
  const xpEvents: SanitizedXpEvent[] = [];
  if (Array.isArray(src.xpEvents)) {
    for (const item of src.xpEvents) {
      const e = sanitizeXpEvent(item, canonicalLessons);
      if (e && !seenEvents.has(e.id)) {
        seenEvents.add(e.id);
        xpEvents.push(e);
      }
    }
  }
  xpEvents.sort((a, b) => a.ts - b.ts);

  const notes: Record<string, string> = {};
  for (const [k, v] of Object.entries(asObj(src.notes))) {
    if (lessonKeyOk(k, canonicalLessons) && typeof v === 'string' && v.length <= NOTE_MAX) {
      notes[k] = v;
    }
  }

  const lessonStarted: Record<string, number> = {};
  for (const [k, v] of Object.entries(asObj(src.lessonStarted))) {
    const ts = parseSafeTimestamp(v);
    if (lessonKeyOk(k, canonicalLessons) && ts !== null) {
      lessonStarted[k] = ts;
    }
  }

  const s = asObj(src.settings);
  const theme = ['light', 'dark', 'sepia', 'system'].includes(String(s.theme))
    ? (s.theme as SanitizedProgress['settings']['theme'])
    : 'system';

  return {
    version: clampInt(src.version, 1, 999),
    completedLessons,
    exerciseResults,
    xp: computeCanonicalXp(xpEvents),
    xpEvents,
    notes,
    lessonStarted,
    settings: {
      theme,
      calm: s.calm === true,
      fontScale:
        typeof s.fontScale === 'number' && Number.isFinite(s.fontScale)
          ? clampInt(s.fontScale, 50, 300)
          : 100,
      soundOff: s.soundOff !== false, // store default is true
      reduceMotion: s.reduceMotion === true,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Certification snapshot                                              */
/* ------------------------------------------------------------------ */

/** Type alias (not interface) with inline attempt objects, so Prisma's JSON
 * input accepts it via TS's implicit index signature for literal shapes. */
export type SanitizedCertification = {
  version: number;
  attempts: { ts: number; score: number; passed: boolean }[];
  capstoneArtifacts: Record<string, boolean>;
  capstoneRubric: Record<string, number>;
  subject: string;
  gateMode: 'advisory' | 'enforced';
};

/** Canonical-ID certification sanitization (Phase-3 canonical sets). */
export function sanitizeCertificationSnapshot(raw: Json): SanitizedCertification | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const src = asObj(raw);

  const attempts: SanitizedCertification["attempts"] = [];
  if (Array.isArray(src.attempts)) {
    for (const item of src.attempts) {
      const a = asObj(item);
      const ts = parseSafeTimestamp(a.ts);
      if (
        ts !== null &&
        typeof a.score === 'number' &&
        Number.isFinite(a.score) &&
        a.score >= 0 &&
        a.score <= 1 &&
        typeof a.passed === 'boolean'
      ) {
        attempts.push({ ts, score: a.score, passed: a.passed });
      }
    }
  }
  attempts.sort((a, b) => a.ts - b.ts);
  attempts.splice(ATTEMPTS_CAP);

  const capstoneArtifacts: Record<string, boolean> = {};
  const remoteArtifacts = asObj(src.capstoneArtifacts);
  for (const id of CAPSTONE_ARTIFACT_IDS) {
    if (remoteArtifacts[id] === true) capstoneArtifacts[id] = true;
  }

  const capstoneRubric: Record<string, number> = {};
  const remoteRubric = asObj(src.capstoneRubric);
  for (const id of CAPSTONE_RUBRIC_IDS) {
    const v = remoteRubric[id];
    if (typeof v === 'number' && Number.isFinite(v)) capstoneRubric[id] = clampInt(v, 0, 3);
  }

  const subject = typeof src.subject === 'string' ? src.subject.slice(0, SUBJECT_MAX) : '';
  const gateMode = src.gateMode === 'enforced' ? 'enforced' : 'advisory';

  return {
    version: clampInt(src.version, 1, 999),
    attempts,
    capstoneArtifacts,
    capstoneRubric,
    subject,
    gateMode,
  };
}
