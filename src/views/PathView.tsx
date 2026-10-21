'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useProgress } from '@/lib/store/progress';
import {
  useCertification,
  capstoneReadiness,
  certificationGateStatus,
} from '@/lib/store/certification';
import { allLessonIds, getManifestEntry, isLessonUnlocked, useManifestStore, type ManifestEntry } from '@/lib/content/registry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CheckCircle2, CircleDashed, Lock, Play, Sparkle } from 'lucide-react';

function MasteryRing({ state }: { state: 'done' | 'started' | 'locked' }) {
  const R = 15;
  const C = 2 * Math.PI * R;
  const frac = state === 'done' ? 1 : state === 'started' ? 0.35 : 0;
  const color = state === 'done' ? 'var(--color-success)' : state === 'started' ? 'var(--accent-python)' : 'var(--border)';
  return (
    <svg viewBox="0 0 36 36" className="size-9 -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r={R} fill="none" stroke="var(--muted)" strokeWidth="3" />
      <circle
        cx="18"
        cy="18"
        r={R}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - frac)}
      />
      {state === 'done' && <circle cx="18" cy="18" r="8" fill={color} opacity="0.25" />}
    </svg>
  );
}

function LessonNode({ entry, completed, onOpen }: { entry: ManifestEntry; completed: string[]; onOpen: (id: string) => void }) {
  const { t, pick } = useI18n();
  const done = completed.includes(entry.id);
  const unlocked = isLessonUnlocked(entry.id, completed);
  const state = done ? 'done' : unlocked ? 'started' : 'locked';

  const body = (
    <button
      type="button"
      onClick={() => onOpen(entry.id)}
      aria-label={pick(entry.title)}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border p-3 text-start transition-colors',
        unlocked ? 'hover:bg-muted/60' : 'hover:bg-muted/40',
      )}
    >
      <MasteryRing state={state} />
      <span className="flex-1">
        <span className="block text-sm font-semibold">{pick(entry.title)}</span>
        <span className="block text-xs text-muted-foreground">
          {t('path.chapterLabel')} {entry.chapter} · #{entry.order}
        </span>
      </span>
      {!unlocked && <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
      {done && <CheckCircle2 className="size-4 shrink-0" style={{ color: 'var(--color-success)' }} aria-hidden="true" />}
    </button>
  );

  if (unlocked) return body;

  // Locked lessons stay clickable but explain prerequisites.
  const prereqEntries = entry.prerequisites.map((p) => getManifestEntry(p)).filter((x): x is ManifestEntry => Boolean(x));
  return (
    <Dialog>
      <DialogTrigger asChild>{body}</DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Lock className="size-4" aria-hidden="true" />
            {t('path.lockedTitle')}
          </DialogTitle>
          <DialogDescription>{t('path.lockedBody')}</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2">
          {prereqEntries.map((p) => (
            <li key={p.id} className="flex items-center gap-2 rounded-xl border p-3 text-sm">
              {completed.includes(p.id) ? (
                <CheckCircle2 className="size-4" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
              ) : (
                <CircleDashed className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
              <span className="flex-1 font-medium">{pick(p.title)}</span>
              {completed.includes(p.id) && <span className="text-xs text-muted-foreground">{t('common.completed')}</span>}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function PathView() {
  const { t, pick, locale } = useI18n();
  const ar = locale === 'ar';
  const { navigate } = useRouter();
  const completed = useProgress((s) => s.completedLessons);
  const manifest = useManifestStore((s) => s.manifest);
  const manifestReady = useManifestStore((s) => s.ready);
  const capArtifacts = useCertification((s) => s.capstoneArtifacts);
  const capRubric = useCertification((s) => s.capstoneRubric);
  const attempts = useCertification((s) => s.attempts);
  const gateMode = useCertification((s) => s.gateMode);

  const chapters = useMemo(() => {
    const byCh = new Map<number, ManifestEntry[]>();
    manifest.filter((m) => m.part === 'I').forEach((m) => {
      const arr = byCh.get(m.chapter) ?? [];
      arr.push(m);
      byCh.set(m.chapter, arr);
    });
    return [...byCh.entries()].sort((a, b) => a[0] - b[0]);
  }, [manifest]);

  const partITotal = manifest.filter((m) => m.part === 'I').length;
  const partIDone = manifest.filter((m) => m.part === 'I' && completed.includes(m.id)).length;
  const partIAllDone = allLessonIds().every((id) => completed.includes(id));
  const capReady = capstoneReadiness(
    Object.values(capArtifacts).filter(Boolean).length,
    Object.values(capRubric).reduce((a, b) => a + b, 0),
  );
  const { certified } = certificationGateStatus(attempts, capReady);
  // Gate mode (OQ note): advisory = Part II opens on Part I completion, the
  // certification is a visible recommendation; enforced = certification is
  // additionally required. Default is advisory (documented safe default).
  const partIIUnlocked = partIAllDone && (gateMode === 'advisory' || certified);

  const open = (id: string) => {
    if (isLessonUnlocked(id, completed)) navigate('lesson', id);
  };

  if (!manifestReady) {
    return (
      <div className="flex animate-pulse flex-col gap-6" aria-hidden="true">
        <header>
          <div className="h-9 w-64 rounded bg-muted" />
          <div className="mt-2 h-4 w-44 rounded bg-muted" />
        </header>
        <div className="h-40 rounded-xl border bg-card p-6" />
        <div className="h-40 rounded-xl border bg-card p-6" />
        <div className="h-40 rounded-xl border bg-card p-6" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="gentle-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{t('path.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('path.subtitle')}</p>
      </header>

      {/* Part I */}
      <section className="flex flex-col gap-4" aria-label={t('path.partITitle')}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold" style={{ color: 'var(--accent-python-strong)' }}>
            {t('path.partITitle')}
          </h2>
          <Badge variant="secondary" className="rounded-full">
            {partIDone}/{partITotal} {t('path.lessonUnit')}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{t('path.partISubtitle')}</p>

        {chapters.map(([ch, lessons]) => (
          <Card key={ch} className="py-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {t('path.chapterLabel')} {ch} — {lessons.length} {t('path.lessonUnit')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((m) => (
                <LessonNode key={m.id} entry={m} completed={completed} onOpen={open} />
              ))}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Part II — locked world */}
      <section aria-label={t('path.partIITitle')}>
        <Card className="py-card" style={{ background: 'var(--accent-ai-soft)' }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base" style={{ color: 'var(--accent-ai)' }}>
              <Sparkle className="size-4" aria-hidden="true" />
              {t('path.partIITitle')}
              <Badge variant="outline" className="gap-1 border-[var(--accent-ai)]">
                <Lock className="size-3" aria-hidden="true" />
                {t('common.locked')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{t('path.partIILockedBody')}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('path.requirementDone', { count: partITotal - partIDone })}
            </p>
            {gateMode === 'enforced' && !certified && (
              <p className="mt-2 text-xs text-muted-foreground">
                {ar
                  ? 'وضع الفرض مُفعّل: يُشترط أيضًا اجتياز الاعتماد (الامتحان ≥ 80٪ + جاهزية كابستون ≥ 80٪) — انظر صفحتي الامتحان والكابستون.'
                  : 'Enforced gate is on: certification (exam ≥ 80% + capstone readiness ≥ 80%) is also required — see the Exam and Capstone views.'}
              </p>
            )}
            {gateMode === 'enforced' && certified && partIAllDone && (
              <p className="mt-2 text-xs font-medium">
                {ar
                  ? 'بوابة الاعتماد مستوفاة في وضع الفرض ✓'
                  : 'Certification gate satisfied in enforced mode ✓'}
              </p>
            )}
            <Button
              variant="outline"
              className="mt-4 h-11 rounded-xl"
              disabled={!partIIUnlocked}
              onClick={() => undefined}
            >
              <Lock className="me-1 size-3.5" aria-hidden="true" />
              {t('common.locked')}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default PathView;
