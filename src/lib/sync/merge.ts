import type { ProgressState } from '@/lib/store/progress';
import type { CertificationState } from '@/lib/store/certification';
import {
  sanitizeProgressSnapshot,
  sanitizeCertificationSnapshot,
  parseXpEventId,
  parseSafeTimestamp,
} from './canonical';

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
 *
 * SYNC-001: when `canonicalLessons` (the 258 manifest ids) is provided, the
 * REMOTE snapshot is sanitized first — fake lesson/exercise ids are dropped,
 * XP event amounts are forced into the platform's canonical envelope, and
 * `xp` is recomputed from the sanitized ledger. Client-reported `xp` is
 * never trusted.
 */

export type CertWire = Partial<CertificationState>;

type Json = unknown;

function asObj(v: Json): Record<string, Json> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, Json>) : {};
}

function asArray(v: Json): Json[] {
  return Array.isArray(v) ? v : [];
}

export function mergeProgressSnapshot(
  local: ProgressState,
  remoteRaw: Json,
  canonicalLessons?: ReadonlySet<string>,
): ProgressState {
  const canonical = canonicalLessons ?? new Set<string>();
  // SYNC-001: canonicalize the untrusted remote before any union happens.
  // Never trust client/remote raw payload without sanitization.
  const remote = asObj(sanitizeProgressSnapshot(remoteRaw, canonical) ?? {});

  const completedLessonsList = new Set<string>();
  for (const item of local.completedLessons) {
    if (typeof item === 'string' && (canonical.size === 0 || canonical.has(item))) {
      completedLessonsList.add(item);
    }
  }
  for (const item of asArray(remote.completedLessons)) {
    if (typeof item === 'string' && (canonical.size === 0 || canonical.has(item))) {
      completedLessonsList.add(item);
    }
  }

  const remoteResults = asObj(remote.exerciseResults);
  const exerciseResults: ProgressState['exerciseResults'] = {};
  const keys = new Set([...Object.keys(local.exerciseResults), ...Object.keys(remoteResults)]);
  for (const key of keys) {
    if (canonical.size > 0) {
      const sep = key.indexOf(':');
      if (sep <= 0 || !canonical.has(key.slice(0, sep))) continue;
    }
    const l = local.exerciseResults[key];
    const r = remoteResults[key];
    if (!l) {
      if (isResult(r)) exerciseResults[key] = r;
    } else if (!r) {
      if (isResult(l)) exerciseResults[key] = l;
    } else if (isResult(r) && isResult(l)) {
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
  const lessonStarted: ProgressState['lessonStarted'] = {};
  for (const [k, v] of Object.entries(local.lessonStarted)) {
    const ts = parseSafeTimestamp(v);
    if (ts !== null && (canonical.size === 0 || canonical.has(k))) {
      lessonStarted[k] = ts;
    }
  }
  for (const [k, v] of Object.entries(remoteStarted)) {
    const ts = parseSafeTimestamp(v);
    if (ts === null) continue;
    if (canonical.size > 0 && !canonical.has(k)) continue;
    lessonStarted[k] = lessonStarted[k] !== undefined ? Math.min(lessonStarted[k], ts) : ts;
  }

  const remoteNotes = asObj(remote.notes);
  const notes: ProgressState['notes'] = {};
  for (const [k, v] of Object.entries(local.notes)) {
    if (typeof v === 'string' && (canonical.size === 0 || canonical.has(k))) {
      notes[k] = v;
    }
  }
  for (const [k, v] of Object.entries(remoteNotes)) {
    if (typeof v !== 'string') continue;
    if (canonical.size > 0 && !canonical.has(k)) continue;
    notes[k] = notes[k] === undefined ? v : v.length > notes[k].length ? v : notes[k];
  }

  const seen = new Set<string>();
  const xpEvents: ProgressState['xpEvents'] = [];
  const candidates: ProgressState['xpEvents'] = [];
  for (const e of local.xpEvents) {
    if (e && typeof e === 'object' && typeof e.id === 'string') {
      candidates.push(e);
    }
  }
  for (const item of asArray(remote.xpEvents)) {
    const e = item as ProgressState['xpEvents'][number] | null;
    if (e && typeof e === 'object' && typeof e.id === 'string') {
      candidates.push(e);
    }
  }

  for (const e of candidates) {
    if (!seen.has(e.id)) {
      if (canonical.size > 0) {
        const ref = parseXpEventId(e.id);
        if (!ref || !canonical.has(ref.lessonId)) continue;
      }
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
    Number.isFinite(r.attempts) &&
    typeof r.hintsUsed === 'number' &&
    Number.isFinite(r.hintsUsed) &&
    typeof r.ts === 'number' &&
    Number.isFinite(r.ts) &&
    r.ts >= 0
  );
}

/** Certification store merge (attempts are id-less; dedupe by exact tuple).
 * SYNC-001: the remote is canonicalized first — only the 6 canonical artifact
 * ids and 5 canonical rubric criteria survive, and attempts must be
 * well-formed (score 0..1, ts ≥ 0). */
export function mergeCertification(local: CertificationState, remoteRaw: Json): CertificationState {
  const remote = asObj(sanitizeCertificationSnapshot(remoteRaw) ?? {});
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
