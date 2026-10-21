'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStore, get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import {
  XP_PER_EXERCISE,
  HINT_XP_PENALTY,
  HINT_XP_FLOOR,
  levelFromXp,
  type XpReason,
} from '@/lib/gamification/config';

/* ------------------------------------------------------------------ */
/* Types (ADR-0004: namespaced, versioned, local-first)                */
/* ------------------------------------------------------------------ */

export const PROGRESS_SCHEMA_VERSION = 1;
export const IDB_STORE_NAME = 'pypath-progress';
const IDB_KEY = 'progress:local';

export interface ExerciseResult {
  passed: boolean;
  attempts: number;
  hintsUsed: number;
  ts: number;
}

export interface XpEvent {
  id: string;
  amount: number;
  reason: XpReason;
  ts: number;
}

export type ThemeName = 'light' | 'dark' | 'sepia';

export interface Settings {
  theme: ThemeName | 'system';
  calm: boolean;
  fontScale: number; // 100–200 (%)
  soundOff: true;
  reduceMotion: boolean;
}

export interface ProgressState {
  version: number;
  completedLessons: string[];
  /** key = `${lessonId}:${exerciseId}` */
  exerciseResults: Record<string, ExerciseResult>;
  xp: number; // derived — always the sum of xpEvents
  xpEvents: XpEvent[]; // append-only, idempotent by id
  notes: Record<string, string>; // lessonId → reflection text
  lessonStarted: Record<string, number>; // lessonId → first-open ts
  settings: Settings;
}

export interface ProgressActions {
  markLessonStarted: (lessonId: string) => void;
  recordExerciseAttempt: (lessonId: string, exerciseId: string, passed: boolean, kindIsDebug: boolean) => XpEvent | null;
  recordHintUsed: (lessonId: string, exerciseId: string) => void;
  recordQuizItem: (lessonId: string, itemId: string, passed: boolean) => XpEvent | null;
  completeLesson: (lessonId: string) => XpEvent | null;
  uncompleteLesson: (lessonId: string) => void;
  saveNote: (lessonId: string, text: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  isLessonComplete: (lessonId: string) => boolean;
  getExerciseResult: (lessonId: string, exerciseId: string) => ExerciseResult | undefined;
  exportProgress: () => string;
  importProgress: (json: string) => boolean;
  deleteAll: () => Promise<void>;
}

export type ProgressStore = ProgressState & ProgressActions;

/* ------------------------------------------------------------------ */
/* IndexedDB storage adapter (idb-keyval, ADR-0004)                    */
/* ------------------------------------------------------------------ */

const idbStore = typeof window !== 'undefined' ? createStore('pypath', IDB_STORE_NAME) : undefined;

const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (!idbStore) return null;
    const v = await idbGet<string>(name, idbStore);
    return v ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (!idbStore) return;
    await idbSet(name, value, idbStore);
  },
  removeItem: async (name: string): Promise<void> => {
    if (!idbStore) return;
    await idbDel(name, idbStore);
  },
};

/* ------------------------------------------------------------------ */
/* Default state                                                       */
/* ------------------------------------------------------------------ */

export const defaultProgress: ProgressState = {
  version: PROGRESS_SCHEMA_VERSION,
  completedLessons: [],
  exerciseResults: {},
  xp: 0,
  xpEvents: [],
  notes: {},
  lessonStarted: {},
  settings: {
    theme: 'system',
    calm: false,
    fontScale: 100,
    soundOff: true,
    reduceMotion: false,
  },
};

/** Append XP events idempotently; derive xp from the ledger sum. */
function appendXpEvents(events: XpEvent[], incoming: XpEvent[]): { events: XpEvent[]; xp: number } {
  const seen = new Set(events.map((e) => e.id));
  const merged = [...events];
  for (const e of incoming) {
    if (!seen.has(e.id)) {
      merged.push(e);
      seen.add(e.id);
    }
  }
  const xp = merged.reduce((sum, e) => sum + e.amount, 0);
  return { events: merged, xp };
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...defaultProgress,

      markLessonStarted: (lessonId) =>
        set((s) =>
          s.lessonStarted[lessonId]
            ? s
            : { lessonStarted: { ...s.lessonStarted, [lessonId]: Date.now() } },
        ),

      recordExerciseAttempt: (lessonId, exerciseId, passed, kindIsDebug) => {
        const key = `${lessonId}:${exerciseId}`;
        const prev = get().exerciseResults[key] ?? { passed: false, attempts: 0, hintsUsed: 0, ts: 0 };
        const next: ExerciseResult = {
          passed: prev.passed || passed,
          attempts: prev.attempts + 1,
          hintsUsed: prev.hintsUsed,
          ts: Date.now(),
        };
        let event: XpEvent | null = null;
        if (passed && !prev.passed) {
          // First pass: award once (idempotent id). Hints reduce the amount, floor applies.
          const base = kindIsDebug
            ? XP_PER_EXERCISE.debug
            : prev.attempts === 0
              ? XP_PER_EXERCISE.firstTry
              : XP_PER_EXERCISE.retry;
          const amount = Math.max(HINT_XP_FLOOR, base - prev.hintsUsed * HINT_XP_PENALTY);
          event = { id: `xp:${key}:pass`, amount, reason: kindIsDebug ? 'debug' : prev.attempts === 0 ? 'exerciseFirstTry' : 'exerciseRetry', ts: Date.now() };
        }
        set((s) => {
          const base = { ...s.exerciseResults, [key]: next };
          if (event) {
            const { events, xp } = appendXpEvents(s.xpEvents, [event]);
            return { exerciseResults: base, xpEvents: events, xp };
          }
          return { exerciseResults: base };
        });
        return event;
      },

      recordHintUsed: (lessonId, exerciseId) => {
        const key = `${lessonId}:${exerciseId}`;
        set((s) => {
          const prev = s.exerciseResults[key] ?? { passed: false, attempts: 0, hintsUsed: 0, ts: 0 };
          return {
            exerciseResults: { ...s.exerciseResults, [key]: { ...prev, hintsUsed: prev.hintsUsed + 1 } },
          };
        });
      },

      recordQuizItem: (lessonId, itemId, passed) => {
        const key = `${lessonId}:quiz:${itemId}`;
        if (!passed) return null;
        const already = get().xpEvents.some((e) => e.id === `xp:${key}:pass`);
        if (already) return null;
        const event: XpEvent = { id: `xp:${key}:pass`, amount: XP_PER_EXERCISE.quizItem, reason: 'quizItem', ts: Date.now() };
        set((s) => {
          const { events, xp } = appendXpEvents(s.xpEvents, [event]);
          return { xpEvents: events, xp };
        });
        return event;
      },

      completeLesson: (lessonId) => {
        const already = get().xpEvents.some((e) => e.id === `xp:${lessonId}:complete`);
        const event: XpEvent | null = already
          ? null
          : { id: `xp:${lessonId}:complete`, amount: XP_PER_EXERCISE.lessonComplete, reason: 'lessonComplete', ts: Date.now() };
        set((s) => {
          const completedLessons = s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId];
          if (event) {
            const { events, xp } = appendXpEvents(s.xpEvents, [event]);
            return { completedLessons, xpEvents: events, xp };
          }
          return { completedLessons };
        });
        return event;
      },

      uncompleteLesson: (lessonId) =>
        set((s) => ({ completedLessons: s.completedLessons.filter((l) => l !== lessonId) })),

      saveNote: (lessonId, text) => set((s) => ({ notes: { ...s.notes, [lessonId]: text } })),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      isLessonComplete: (lessonId) => get().completedLessons.includes(lessonId),

      getExerciseResult: (lessonId, exerciseId) => get().exerciseResults[`${lessonId}:${exerciseId}`],

      exportProgress: () => {
        const s = get();
        const payload = {
          app: 'pypath',
          schemaVersion: PROGRESS_SCHEMA_VERSION,
          exportedAt: new Date().toISOString(),
          data: {
            version: s.version,
            completedLessons: s.completedLessons,
            exerciseResults: s.exerciseResults,
            xpEvents: s.xpEvents,
            xp: s.xp,
            notes: s.notes,
            lessonStarted: s.lessonStarted,
            settings: s.settings,
          },
        };
        return JSON.stringify(payload, null, 2);
      },

      importProgress: (json) => {
        try {
          const parsed = JSON.parse(json) as { app?: string; data?: Partial<ProgressState> };
          if (parsed.app !== 'pypath' || !parsed.data) return false;
          const d = parsed.data;
          // dedupe WITHIN the imported file too (R-GAM-04 idempotency):
          // passing the payload as `incoming` with an empty ledger drops
          // internal duplicates, not just collisions with current state.
          const { events, xp } = appendXpEvents([], d.xpEvents ?? []);
          set({
            version: d.version ?? PROGRESS_SCHEMA_VERSION,
            completedLessons: Array.isArray(d.completedLessons) ? d.completedLessons : [],
            exerciseResults: d.exerciseResults ?? {},
            xpEvents: events,
            xp,
            notes: d.notes ?? {},
            lessonStarted: d.lessonStarted ?? {},
            settings: { ...defaultProgress.settings, ...(d.settings ?? {}) },
          });
          return true;
        } catch {
          return false;
        }
      },

      deleteAll: async () => {
        await idbDel(IDB_KEY, idbStore).catch(() => undefined);
        set({ ...defaultProgress, settings: { ...defaultProgress.settings } });
      },
    }),
    {
      name: IDB_KEY,
      storage: createJSONStorage(() => idbStorage),
      version: PROGRESS_SCHEMA_VERSION,
      // merge strategy: shallow is fine; future migrations keyed on `version`
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        return {
          ...current,
          ...p,
          settings: { ...defaultProgress.settings, ...(p.settings ?? {}) },
        } as ProgressStore;
      },
    },
  ),
);

/** Current level (convenience selector). */
export const useLevel = () => useProgress((s) => levelFromXp(s.xp));
