'use client';

/**
 * Certification store — Python Professional exam + Capstone I state.
 * Kept separate from the main progress store so its persistence shape can
 * evolve independently (ADR-0004 pattern; tiny surface, versioned).
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  certified: boolean;
}

export function certificationGateStatus(
  attempts: ExamAttempt[],
  readiness: number,
): CertificationGateStatus {
  const examOk = examPassed(attempts);
  const capstoneOk = readiness >= 80;
  return { examOk, capstoneOk, certified: examOk && capstoneOk };
}

export { PASS as EXAM_PASS_MARK };
