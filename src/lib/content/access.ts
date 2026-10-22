'use client';

import { useMemo } from 'react';
import { useProgress } from '@/lib/store/progress';
import {
  useCertification,
  capstoneReadiness,
  certificationGateStatus,
  type GateMode,
} from '@/lib/store/certification';
import { useManifestStore, type ManifestEntry } from './registry';

export type LessonAccess = 'unlocked' | 'prereq-locked' | 'part-locked' | 'missing';

export function isPartIComplete(completedLessons: string[], entries: ManifestEntry[]): boolean {
  const partI = entries.filter((entry) => entry.part === 'I');
  return partI.length > 0 && partI.every((entry) => completedLessons.includes(entry.id));
}

export function isPartIIOpen(
  completedLessons: string[],
  gateMode: GateMode,
  certified: boolean,
  entries: ManifestEntry[],
): boolean {
  return isPartIComplete(completedLessons, entries) && (gateMode === 'advisory' || certified);
}

export function lessonAccess(
  entry: ManifestEntry | undefined,
  completedLessons: string[],
  gateMode: GateMode,
  certified: boolean,
  entries: ManifestEntry[],
): LessonAccess {
  if (!entry) return 'missing';
  if (entry.part === 'II' && !isPartIIOpen(completedLessons, gateMode, certified, entries)) {
    return 'part-locked';
  }
  if (!entry.prerequisites.every((id) => completedLessons.includes(id))) return 'prereq-locked';
  return 'unlocked';
}

export interface CurriculumAccess {
  ready: boolean;
  entries: ManifestEntry[];
  completedLessons: string[];
  gateMode: GateMode;
  certified: boolean;
  partIComplete: boolean;
  partIIOpen: boolean;
  accessFor: (id: string) => LessonAccess;
}

export function useCurriculumAccess(): CurriculumAccess {
  const entries = useManifestStore((s) => s.manifest);
  const ready = useManifestStore((s) => s.ready);
  const completedLessons = useProgress((s) => s.completedLessons);
  const attempts = useCertification((s) => s.attempts);
  const capstoneArtifacts = useCertification((s) => s.capstoneArtifacts);
  const capstoneRubric = useCertification((s) => s.capstoneRubric);
  const gateMode = useCertification((s) => s.gateMode);

  return useMemo(() => {
    const capReady = capstoneReadiness(
      Object.values(capstoneArtifacts).filter(Boolean).length,
      Object.values(capstoneRubric).reduce((a, b) => a + b, 0),
    );
    const { certified } = certificationGateStatus(attempts, capReady);
    const partIComplete = isPartIComplete(completedLessons, entries);
    const partIIOpen = isPartIIOpen(completedLessons, gateMode, certified, entries);
    return {
      ready,
      entries,
      completedLessons,
      gateMode,
      certified,
      partIComplete,
      partIIOpen,
      accessFor: (id) =>
        lessonAccess(
          entries.find((entry) => entry.id === id),
          completedLessons,
          gateMode,
          certified,
          entries,
        ),
    };
  }, [entries, ready, completedLessons, attempts, capstoneArtifacts, capstoneRubric, gateMode]);
}
