import type { ProgressState } from '@/lib/store/progress';
import type { CertificationState } from '@/lib/store/certification';

/**
 * Deterministic, monotonic merge of a remote (cloud) snapshot into the local
 * store. Used by the sync engine so concurrent devices converge with no
 * silent data loss:
 *
 *  - completedLessons: union (never un-completes)
 *  - exerciseResults:  per key → newest `ts` wins; attempts/hints = max;
 *                      passed = OR (progress is monotonic)
 *  - lessonStarted:    earliest ts per lesson
 *  - xpEvents:         union by id (ledger semantics; client store already
 *                      dedupes by id, so re-syncs can't double XP)
 *  - notes:            longer text wins on conflict (deterministic; keeps the
 *                      existing store shape untouched)
 *  - settings/theme:   per-device by design — local wins
 *  - certification:    attempts dedupe by exact tuple; artifacts union;
 *                      rubric = max per criterion; subject/gateMode local
 */

export type CertWire = Partial<CertificationState>;

type Json = unknown;

function asObj(v: Json): Record<string, Json> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, Json>) : {};
}

function asArray(v: Json): Json[] {
  return Array.isArray(v) ? v : [];
}

export function mergeProgressSnapshot(local: ProgressState, remoteRaw: Json): ProgressState {
  const remote = asObj(remoteRaw);

  const completedLessonsList = new Set(local.completedLessons);
  for (const item of asArray(remote.completedLessons)) {
    if (typeof item === 'string') completedLessonsList.add(item);
  }

  const remoteResults = asObj(remote.exerciseResults);
  const exerciseResults: ProgressState['exerciseResults'] = {};
  const keys = new Set([...Object.keys(local.exerciseResults), ...Object.keys(remoteResults)]);
  for (const key of keys) {
    const l = local.exerciseResults[key];
    const r = remoteResults[key];
    if (!l) {
      if (isResult(r)) exerciseResults[key] = r;
    } else if (!r) {
      exerciseResults[key] = l;
    } else if (isResult(r)) {
      const winner = l.ts >= r.ts ? l : r;
      exerciseResults[key] = {
        ...winner,
        passed: l.passed || r.passed,
        attempts: Math.max(l.attempts, r.attempts),
        hintsUsed: Math.max(l.hintsUsed, r.hintsUsed),
        ts: Math.max(l.ts, r.ts),
      };
    }
  }

  const remoteStarted = asObj(remote.lessonStarted);
  const lessonStarted: ProgressState['lessonStarted'] = { ...local.lessonStarted };
  for (const [k, v] of Object.entries(remoteStarted)) {
    if (typeof v !== 'number') continue;
    lessonStarted[k] = lessonStarted[k] !== undefined ? Math.min(lessonStarted[k], v) : v;
  }

  const remoteNotes = asObj(remote.notes);
  const notes: ProgressState['notes'] = { ...local.notes };
  for (const [k, v] of Object.entries(remoteNotes)) {
    if (typeof v !== 'string') continue;
    notes[k] = notes[k] === undefined ? v : v.length > notes[k].length ? v : notes[k];
  }

  const seen = new Set(local.xpEvents.map((e) => e.id));
  const xpEvents: ProgressState['xpEvents'] = [...local.xpEvents];
  for (const item of asArray(remote.xpEvents)) {
    const e = item as ProgressState['xpEvents'][number] | null;
    if (e && typeof e === 'object' && typeof e.id === 'string' && !seen.has(e.id)) {
      seen.add(e.id);
      xpEvents.push(e);
    }
  }
  xpEvents.sort((a, b) => a.ts - b.ts);
  const xp = xpEvents.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  return {
    version: local.version,
    completedLessons: [...completedLessonsList],
    exerciseResults,
    xp,
    xpEvents,
    notes,
    lessonStarted,
    settings: { ...local.settings },
  };
}

function isResult(v: Json): v is ProgressState['exerciseResults'][string] {
  if (!v || typeof v !== 'object') return false;
  const r = v as Record<string, Json>;
  return (
    typeof r.passed === 'boolean' &&
    typeof r.attempts === 'number' &&
    typeof r.hintsUsed === 'number' &&
    typeof r.ts === 'number'
  );
}

/** Certification store merge (attempts are id-less; dedupe by exact tuple). */
export function mergeCertification(local: CertificationState, remoteRaw: Json): CertificationState {
  const remote = asObj(remoteRaw);
  const attemptsKey = (a: { ts: number; score: number; passed: boolean }) =>
    `${a.ts}:${a.score}:${a.passed}`;
  const attempts = new Map(local.attempts.map((a) => [attemptsKey(a), a]));
  for (const item of asArray(remote.attempts)) {
    const a = item as CertificationState['attempts'][number] | null;
    if (a && typeof a === 'object' && typeof a.ts === 'number' && typeof a.score === 'number') {
      const key = attemptsKey(a);
      if (!attempts.has(key)) attempts.set(key, a);
    }
  }
  const sorted = [...attempts.values()].sort((a, b) => a.ts - b.ts).slice(-200);

  const remoteArtifacts = asObj(remote.capstoneArtifacts);
  const capstoneArtifacts: CertificationState['capstoneArtifacts'] = {};
  for (const [k, v] of Object.entries(local.capstoneArtifacts)) {
    if (v) capstoneArtifacts[k] = true;
  }
  for (const [k, v] of Object.entries(remoteArtifacts)) {
    if (v === true) capstoneArtifacts[k] = true;
  }

  const remoteRubric = asObj(remote.capstoneRubric);
  const capstoneRubric: CertificationState['capstoneRubric'] = { ...local.capstoneRubric };
  for (const [k, v] of Object.entries(remoteRubric)) {
    if (typeof v !== 'number') continue;
    capstoneRubric[k] = capstoneRubric[k] === undefined ? v : Math.max(capstoneRubric[k], v);
  }

  return {
    version: local.version,
    attempts: sorted,
    capstoneArtifacts,
    capstoneRubric,
    // Subject (certificate display name): prefer a non-empty value so a fresh
    // device adopts the cloud value instead of clobbering it with ''.
    subject:
      local.subject ||
      (typeof remote.subject === 'string' ? remote.subject : '') ||
      '',
    gateMode: local.gateMode,
  };
}
