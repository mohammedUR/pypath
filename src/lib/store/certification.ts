'use client';

/**
 * Certification store — Python Professional exam + Capstone I state.
 * Kept separate from the main progress store so its persistence shape can
 * evolve independently (ADR-0004 pattern; tiny surface, versioned).
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CAPSTONE_ARTIFACT_IDS, CAPSTONE_RUBRIC_IDS } from '@/lib/cert/capstone';

// The canonical IDs live in the server-safe lib/cert/capstone (server code
// cannot read values out of a 'use client' module); re-exported here so
// client consumers keep their existing import path.
export { CAPSTONE_ARTIFACT_IDS, CAPSTONE_RUBRIC_IDS } from '@/lib/cert/capstone';

export interface ExamAttempt {
  ts: number;
  score: number; // 0..1
  passed: boolean;
}

export interface CertificationState {
  version: number;
  attempts: ExamAttempt[];
  capstoneArtifacts: Record<string, boolean>; // artifact id → checked
  capstoneRubric: Record<string, number>; // criterion id → 0..3
  /** Self-declared display name for the certificate (not an identity claim). */
  subject: string;
  /** Part II gate mode — advisory (default) or enforced. See OQ note in docs/gamification.md. */
  gateMode: GateMode;
}

export type GateMode = 'advisory' | 'enforced';

export interface CertificationActions {
  recordAttempt: (score: number, passed: boolean) => void;
  toggleArtifact: (id: string) => void;
  setRubricScore: (id: string, score: number) => void;
  resetCapstone: () => void;
  setSubject: (name: string) => void;
  setGateMode: (mode: GateMode) => void;
}

export type CertificationStore = CertificationState & CertificationActions;

const PASS = 0.8;

export const CAPSTONE_ARTIFACTS_TOTAL = 6;
export const CAPSTONE_RUBRIC_MAX = 15; // 5 criteria × 0..3

/**
 * Canonical Capstone requirement IDs (CAP-001) are defined in the server-safe
 * lib/cert/capstone and re-exported above; readiness and the certification
 * gate count ONLY these — unknown/duplicate/forged keys in persisted state
 * never contribute (a `.length >= 6` over raw store values used to accept
 * fake ids like a1..a6).
 */

/** Count ONLY canonical artifacts that are explicitly checked. */
export function capstoneArtifactsDone(artifacts: Record<string, boolean>): number {
  return CAPSTONE_ARTIFACT_IDS.reduce((n, id) => n + (artifacts[id] === true ? 1 : 0), 0);
}

/** Sum ONLY canonical rubric criteria, each clamped to the 0..3 scale. */
export function capstoneRubricTotal(rubric: Record<string, number>): number {
  return CAPSTONE_RUBRIC_IDS.reduce((sum, id) => {
    const v = rubric[id];
    return sum + (typeof v === 'number' && Number.isFinite(v) ? Math.min(3, Math.max(0, v)) : 0);
  }, 0);
}

export const useCertification = create<CertificationStore>()(
  persist(
    (set) => ({
      version: 1,
      attempts: [],
      capstoneArtifacts: {},
      capstoneRubric: {},
      subject: '',
      gateMode: 'advisory',
      recordAttempt: (score, passed) =>
        set((s) => ({
          attempts: [...s.attempts, { ts: Date.now(), score, passed }],
        })),
      toggleArtifact: (id) =>
        set((s) => ({
          capstoneArtifacts: { ...s.capstoneArtifacts, [id]: !s.capstoneArtifacts[id] },
        })),
      setRubricScore: (id, score) =>
        set((s) => ({ capstoneRubric: { ...s.capstoneRubric, [id]: score } })),
      resetCapstone: () => set(() => ({ capstoneArtifacts: {}, capstoneRubric: {} })),
      setSubject: (name) => set(() => ({ subject: name })),
      setGateMode: (mode) => set(() => ({ gateMode: mode })),
    }),
    {
      name: 'pypath.certification',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

export function bestExamScore(attempts: ExamAttempt[]): number {
  return attempts.reduce((b, a) => Math.max(b, a.score), 0);
}

export function examPassed(attempts: ExamAttempt[]): boolean {
  return attempts.some((a) => a.passed && a.score >= PASS);
}

/**
 * Capstone readiness 0..100 — single source shared by CapstoneView,
 * PathView (enforced gate) and the signed proof payload.
 */
export function capstoneReadiness(artifactsDone: number, rubricTotal: number): number {
  const artifactPart = (artifactsDone / CAPSTONE_ARTIFACTS_TOTAL) * 60;
  const rubricPart = (rubricTotal / CAPSTONE_RUBRIC_MAX) * 40;
  return Math.round(artifactPart + rubricPart);
}

export interface CertificationGateStatus {
  examOk: boolean;
  capstoneOk: boolean;
  partIOk: boolean;
  certified: boolean;
}

/**
 * Option 1 certification gate (CERT-001): certified ⇔ ALL THREE hold —
 *  1. Part I curriculum complete (all 163 canonical lessons, evaluated by the
 *     caller via isPartIComplete against the manifest),
 *  2. exam passed (score ≥ 0.8 ≙ ≥ 13/16 on the 16-question draw),
 *  3. capstone ready (readiness ≥ 80 AND all 6 canonical artifacts checked —
 *     canonical counting happens before this call via capstoneArtifactsDone).
 */
export function certificationGateStatus(
  attempts: ExamAttempt[],
  readiness: number,
  artifactsDone: number,
  partIComplete: boolean,
): CertificationGateStatus {
  const examOk = examPassed(attempts);
  const capstoneOk = readiness >= 80 && artifactsDone >= CAPSTONE_ARTIFACTS_TOTAL;
  const partIOk = partIComplete;
  return { examOk, capstoneOk, partIOk, certified: examOk && capstoneOk && partIOk };
}

export { PASS as EXAM_PASS_MARK };
