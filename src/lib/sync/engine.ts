'use client';

import { create } from 'zustand';
import {
  useProgress,
  PROGRESS_SCHEMA_VERSION,
  type ProgressState,
  type Settings,
} from '@/lib/store/progress';
import { useCertification, type CertificationState } from '@/lib/store/certification';
import { useAccount } from '@/lib/store/account';
import { mergeProgressSnapshot, mergeCertification } from './merge';
import { progressBodySchema } from './schema';
import type { SyncStatus } from './types';

/**
 * Progress sync engine — client-side orchestrator over the local-first store.
 *
 * Design (keeps every existing promise intact):
 *  - The IndexedDB store REMAINS the live store; sync is an overlay.
 *  - Everything happens only when the session is confirmed server-side.
 *  - push = client merges server state locally first (monotonic merge) and
 *    sends the merged snapshot; the server stores it and dedupes XP by id.
 *  - Optimistic CAS on `updatedAt` protects against concurrent devices
 *    (409 → re-pull → re-merge → re-push, bounded).
 *  - Failures never delete or rewrite local data; retry with backoff, and the
 *    interpreter/lessons keep working fully offline (CSP stays self-origin).
 */

interface SyncStoreState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  set: (patch: { status?: SyncStatus; lastSyncedAt?: number }) => void;
  reset: () => void;
}

export const useSyncStore = create<SyncStoreState>((set) => ({
  status: 'idle',
  lastSyncedAt: null,
  set: (patch) => set(patch),
  reset: () => set({ status: 'idle', lastSyncedAt: null }),
}));

const PUSH_DEBOUNCE_MS = 2_500;
const RETRY_DELAYS_MS = [8_000, 20_000, 45_000];

let running = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let retryAttempt = 0;
let serverUpdatedTs = 0;
/** XP event ids confirmed present server-side (re-verification-free). */
const syncedEventIds = new Set<string>();
/** Guards push loops triggered by our own remote-application writes. */
let lastSyncedPayload = '';
let busyCycle = false;

function setSync(patch: { status?: SyncStatus; lastSyncedAt?: number }) {
  useSyncStore.getState().set(patch);
}

/* ------------------------------------------------------------------ */
/* Wire helpers                                                        */
/* ------------------------------------------------------------------ */

function localProgress(): ProgressState {
  const s = useProgress.getState();
  return {
    version: s.version,
    completedLessons: s.completedLessons,
    exerciseResults: s.exerciseResults,
    xp: s.xp,
    xpEvents: s.xpEvents,
    notes: s.notes,
    lessonStarted: s.lessonStarted,
    settings: s.settings,
  };
}

function applyProgressSnapshot(state: ProgressState) {
  useProgress.setState({
    version: state.version,
    completedLessons: state.completedLessons,
    exerciseResults: state.exerciseResults,
    xp: state.xp,
    xpEvents: state.xpEvents,
    notes: state.notes,
    lessonStarted: state.lessonStarted,
    settings: state.settings,
  });
}

function payloadOf(state: ProgressState, cert: CertificationState) {
  return {
    base: serverUpdatedTs,
    progress: {
      version: PROGRESS_SCHEMA_VERSION,
      completedLessons: state.completedLessons,
      exerciseResults: state.exerciseResults,
      notes: state.notes,
      lessonStarted: state.lessonStarted,
      settings: state.settings as Settings,
    },
    certification: {
      version: cert.version,
      attempts: cert.attempts,
      capstoneArtifacts: cert.capstoneArtifacts,
      capstoneRubric: cert.capstoneRubric,
      subject: cert.subject,
      gateMode: cert.gateMode,
    },
    newXpEvents: state.xpEvents
      .filter((e) => !syncedEventIds.has(e.id))
      .map((e) => ({ id: e.id, amount: e.amount, reason: e.reason, ts: e.ts })),
  };
}

function payloadChanged(state: ProgressState, cert: CertificationState): boolean {
  const wire = JSON.stringify([
    state.completedLessons,
    state.exerciseResults,
    state.notes,
    state.lessonStarted,
    state.settings,
    cert.attempts,
    cert.capstoneArtifacts,
    cert.capstoneRubric,
    cert.subject,
    cert.gateMode,
    state.xpEvents.length,
  ]);
  return wire !== lastSyncedPayload;
}

/* ------------------------------------------------------------------ */
/* Sync cycles                                                         */
/* ------------------------------------------------------------------ */

async function fetchAccount(): Promise<boolean> {
  try {
    const res = await fetch('/api/account', { cache: 'no-store' });
    if (res.status === 401) {
      useAccount.getState().setAnon();
      useSyncStore.getState().reset();
      return false;
    }
    if (!res.ok) return false;
    useAccount.getState().setUser(await res.json());
    return true;
  } catch {
    return false;
  }
}

interface ServerSyncState {
  progress: Partial<ProgressState>;
  certification?: Partial<CertificationState>;
  updatedAt: number;
  xpEvents?: ProgressState['xpEvents'];
  xp?: number;
}

function normalizeRemote(raw: unknown): ServerSyncState | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (!r.updatedAt || typeof r.updatedAt !== 'number') return null;
  return {
    progress: (r.progress ?? {}) as Partial<ProgressState>,
    certification: (r.certification ?? undefined) as Partial<CertificationState> | undefined,
    updatedAt: r.updatedAt,
    xpEvents: (r.xpEvents ?? undefined) as ProgressState['xpEvents'] | undefined,
    xp: typeof r.xp === 'number' ? r.xp : undefined,
  };
}

/** Pull server state, merge into the local stores, and converge by pushing. */
async function fullCycle(initial: boolean): Promise<void> {
  if (busyCycle) return;
  busyCycle = true;
  try {
    const res = await fetch('/api/progress', { cache: 'no-store' });
    if (res.status === 401) {
      useAccount.getState().setAnon();
      useSyncStore.getState().reset();
      retryAttempt = 0;
      return;
    }
    if (!res.ok) throw new Error(String(res.status));
    const remote = normalizeRemote(await res.json());
    if (!remote) throw new Error('bad payload');

    const merged = mergeProgressSnapshot(localProgress(), remote.progress);
    applyProgressSnapshot(merged);

    const certBefore = useCertification.getState();
    const certMerged = remote.certification
      ? mergeCertification(certBefore, remote.certification)
      : certBefore;
    useCertification.setState({
      version: Math.max(certBefore.version, certMerged.version),
      attempts: certMerged.attempts,
      capstoneArtifacts: certMerged.capstoneArtifacts,
      capstoneRubric: certMerged.capstoneRubric,
      subject: certMerged.subject,
      gateMode: certMerged.gateMode,
    });

    serverUpdatedTs = remote.updatedAt;
    await pushCycle();
  } catch (err) {
    scheduleRetry();
    void err;
  } finally {
    busyCycle = false;
  }
}

async function pushCycle(): Promise<void> {
  const state = localProgress();
  const cert = useCertification.getState();
  const certWire = {
    version: cert.version,
    attempts: cert.attempts,
    capstoneArtifacts: cert.capstoneArtifacts,
    capstoneRubric: cert.capstoneRubric,
    subject: cert.subject,
    gateMode: cert.gateMode,
  };

  if (!payloadChanged(state, certWire)) {
    setSync({ status: 'saved', lastSyncedAt: Date.now() });
    return;
  }

  setSync({ status: 'saving' });
  try {
    const body = payloadOf(state, certWire);
    const check = progressBodySchema.safeParse(body);
    if (!check.success) {
      setSync({ status: 'error' });
      return;
    }
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(check.data),
      cache: 'no-store',
    });
    if (res.status === 409) {
      // Another device won the race: re-merge from server and retry once below.
      retryAttempt = 0;
      setSync({ status: 'saved', lastSyncedAt: Date.now() });
      await fullCycle(false);
      return;
    }
    if (res.status === 401) {
      useAccount.getState().setAnon();
      useSyncStore.getState().reset();
      return;
    }
    if (!res.ok) throw new Error(String(res.status));
    const remote = normalizeRemote(await res.json());
    if (!remote) throw new Error('bad payload');

    // Mark events confirmed by the server payload.
    for (const e of remote.xpEvents ?? []) if (e && e.id) syncedEventIds.add(e.id);
    serverUpdatedTs = remote.updatedAt;
    lastSyncedPayload = JSON.stringify([
      state.completedLessons,
      state.exerciseResults,
      state.notes,
      state.lessonStarted,
      state.settings,
      certWire.attempts,
      certWire.capstoneArtifacts,
      certWire.capstoneRubric,
      certWire.subject,
      certWire.gateMode,
      state.xpEvents.length,
    ]);
    retryAttempt = 0;
    setSync({ status: 'saved', lastSyncedAt: Date.now() });
  } catch {
    scheduleRetry();
  }
}

function scheduleRetry() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    setSync({ status: 'offline' });
    return;
  }
  setSync({ status: 'error' });
  if (retryTimer) clearTimeout(retryTimer);
  const delay = RETRY_DELAYS_MS[Math.min(retryAttempt, RETRY_DELAYS_MS.length - 1)];
  retryAttempt += 1;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void fullCycle(false);
  }, delay);
}

/* ------------------------------------------------------------------ */
/* Public surface (called from the shell / account UI)                 */
/* ------------------------------------------------------------------ */

/** Sign-in handshake: probe the session, then pull+merge+push. */
export async function syncOnLogin(): Promise<void> {
  const ok = await fetchAccount();
  if (!ok) return;
  await fullCycle(true);
}

/** Called right after signOut() so no further writes are pushed. */
export function syncOnLogout(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (retryTimer) clearTimeout(retryTimer);
  debounceTimer = null;
  retryTimer = null;
  retryAttempt = 0;
  serverUpdatedTs = 0;
  syncedEventIds.clear();
  lastSyncedPayload = '';
  useSyncStore.getState().reset();
}

/** Settings "delete my data": also wipes the cloud copy for this account. */
export async function syncWipeCloud(): Promise<void> {
  try {
    await fetch('/api/progress', { method: 'DELETE', cache: 'no-store' });
  } catch {
    // Local deletion proceeded regardless; cloud wipe retries on next push.
  }
  syncedEventIds.clear();
  serverUpdatedTs = 0;
  lastSyncedPayload = '';
}

/** Single wiring point (AppShell). Idempotent. */
export function startSync(): void {
  if (running) return;
  running = true;

  void syncOnLogin();

  // Local writes → debounced push only when authenticated.
  useProgress.subscribe(() => {
    if (useAccount.getState().status !== 'user') return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void pushCycle();
    }, PUSH_DEBOUNCE_MS);
  });
  useCertification.subscribe(() => {
    if (useAccount.getState().status !== 'user') return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void pushCycle();
    }, PUSH_DEBOUNCE_MS);
  });

  const onOnline = () => {
    if (useAccount.getState().status === 'user') void fullCycle(false);
  };
  const onOffline = () => setSync({ status: 'offline' });
  if (typeof window !== 'undefined') {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
  }
}
