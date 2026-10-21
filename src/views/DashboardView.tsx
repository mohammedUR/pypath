'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

/** Stable no-op subscription for useSyncExternalStore (wall-clock snapshot). */
const subscribeNoop = () => () => {};
import { useI18n } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useProgress } from '@/lib/store/progress';
import { nextLessonId, partProgress, isLessonUnlocked, useManifestStore } from '@/lib/content/registry';
import { levelProgress, DAILY_GOAL_LESSONS } from '@/lib/gamification/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lock, Play, Sparkles } from 'lucide-react';

function LevelRing({ level, frac }: { level: number; frac: number }) {
  const R = 30;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative size-20" role="img" aria-label={`level ${level}`}>
      <svg viewBox="0 0 72 72" className="size-20 -rotate-90">
        <circle cx="36" cy="36" r={R} fill="none" stroke="var(--muted)" strokeWidth="7" />
        <circle
          cx="36"
          cy="36"
          r={R}
          fill="none"
          stroke="var(--accent-python)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - frac)}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums">{level}</span>
    </div>
  );
}

export function DashboardView() {
  const { t, locale, pick } = useI18n();
  const { navigate } = useRouter();
  const completed = useProgress((s) => s.completedLessons);
  const xp = useProgress((s) => s.xp);
  const calm = useProgress((s) => s.settings.calm);
  const started = useProgress((s) => s.lessonStarted);

  // Greeting depends on wall-clock time → hydration-safe via useSyncExternalStore
  // (server snapshot = neutral greeting; client snapshot = time-based, cached per hour).
  const hourCache = useRef(-1);
  const greeting = useSyncExternalStore(
    subscribeNoop,
    () => {
      const h = new Date().getHours();
      if (hourCache.current !== h) hourCache.current = h;
      return h < 12
        ? t('dashboard.greetingMorning')
        : h < 18
          ? t('dashboard.greetingAfternoon')
          : t('dashboard.greetingEvening');
    },
    () => t('dashboard.greetingDay'),
  );

  const manifest = useManifestStore((s) => s.manifest);
  const nextId = useMemo(() => nextLessonId(completed), [completed, manifest]);
  const nextEntry = nextId ? manifest.find((m) => m.id === nextId) : undefined;
  const lvl = levelProgress(xp);

  const partI = partProgress('I', completed);
  const partII = partProgress('II', completed);

  const todaysPlan = useMemo(() => {
    // Daily plan: next N incomplete lessons in manifest order.
    const remaining = manifest.filter((m) => !completed.includes(m.id));
    return remaining.slice(0, DAILY_GOAL_LESSONS);
  }, [completed, manifest]);

  const unlockedPlan = todaysPlan.filter((m) => isLessonUnlocked(m.id, completed));

  return (
    <div className="flex flex-col gap-6">
      <header className="gentle-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{greeting} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('dashboard.progressLabel')}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Continue card */}
        <Card className="py-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-[var(--accent-python)]" aria-hidden="true" />
              {nextId ? t('dashboard.continueTitle') : t('dashboard.startHere')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="min-h-[86px] flex-1">
              {nextEntry ? (
                <>
                  <p className="text-lg font-semibold">{pick(nextEntry.title)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('dashboard.continueBody')}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">
                      {t('path.chapterLabel')} {nextEntry.chapter}
                    </Badge>
                    {!isLessonUnlocked(nextEntry.id, completed) && (
                      <span className="inline-flex items-center gap-1">
                        <Lock className="size-3" aria-hidden="true" />
                        {t('common.locked')}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{t('dashboard.continueBody')}</p>
              )}
            </div>
            <Button
              size="lg"
              className="h-12 min-h-12 gap-2 rounded-2xl px-6 font-semibold"
              onClick={() => navigate(nextId ? 'lesson' : 'path', nextId)}
            >
              <Play className="size-4" aria-hidden="true" />
              {nextId ? t('dashboard.continueCta') : t('dashboard.startHere')}
            </Button>
          </CardContent>
        </Card>

        {/* XP + level ring */}
        <Card className="py-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <LevelRing level={lvl.level} frac={lvl.frac} />
            <div>
              {!calm && (
                <>
                  <p className="text-2xl font-bold tabular-nums">{xp.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en')}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.xpTitle')}</p>
                </>
              )}
              {calm && (
                <p className="text-xs text-muted-foreground">
                  {t('settings.calm')} — {t('settings.calmDesc')}
                </p>
              )}
              <p className="mt-2 text-sm font-semibold">
                {t('dashboard.levelTitle')} {lvl.level}
                {!calm && (
                  <span className="ms-2 text-xs font-normal text-muted-foreground">
                    {lvl.into}/{lvl.span}
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parts progress */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="py-card" style={{ borderTop: '3px solid var(--accent-python)' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('dashboard.partI')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>
                {partI.done} {t('dashboard.lessonsDone')} {t('common.of')} {partI.total}
              </span>
              <span className="tabular-nums text-muted-foreground">{Math.round(partI.frac * 100)}%</span>
            </div>
            <Progress value={partI.frac * 100} aria-label={t('dashboard.partI')} />
          </CardContent>
        </Card>

        <Card className="py-card" style={{ borderTop: '3px solid var(--accent-ai)' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              {t('dashboard.partII')}
              <Badge variant="outline" className="gap-1 border-[var(--accent-ai)] text-[var(--accent-ai)]">
                <Lock className="size-3" aria-hidden="true" />
                {t('dashboard.partIILocked')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('dashboard.partIIDesc')}</p>
            <div className="mt-3">
              <Progress value={partII.frac * 100} aria-label={t('dashboard.partII')} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily plan */}
      {todaysPlan.length > 0 && (
        <Card className="py-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">🌱 {t('dashboard.dailyPlanTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{t('dashboard.dailyPlanBody')}</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {todaysPlan.map((m, i) => {
                const unlocked = unlockedPlan.some((u) => u.id === m.id);
                const wasStarted = Boolean(started[m.id]);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => unlocked && navigate('lesson', m.id)}
                      disabled={!unlocked}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start transition-colors ${
                        unlocked ? 'hover:bg-muted/60' : 'cursor-pointer opacity-70'
                      }`}
                      aria-label={pick(m.title)}
                    >
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: 'var(--accent-python-soft)', color: 'var(--accent-python-strong)' }}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm font-medium">{pick(m.title)}</span>
                      {!unlocked && <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" />}
                      {unlocked && wasStarted && !completed.includes(m.id) && (
                        <span className="text-xs text-muted-foreground">{t('common.inProgress')}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DashboardView;
