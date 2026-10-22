'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useCurriculumAccess, type LessonAccess } from '@/lib/content/access';
import { getManifestEntry, type ManifestEntry } from '@/lib/content/registry';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CheckCircle2, CircleDashed, Lock, Sparkle } from 'lucide-react';

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

function LessonNode({
  entry,
  completed,
  access,
  onOpen,
}: {
  entry: ManifestEntry;
  completed: string[];
  access: LessonAccess;
  onOpen: (id: string) => void;
}) {
  const { t, pick } = useI18n();
  const done = completed.includes(entry.id);
  const unlocked = access === 'unlocked';
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
            {access === 'part-locked' ? t('lesson.partLockedTitle') : t('path.lockedTitle')}
          </DialogTitle>
          <DialogDescription>
            {access === 'part-locked' ? t('lesson.partLockedBody') : t('path.lockedBody')}
          </DialogDescription>
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

interface BookGroup {
  book: string;
  chapters: { chapter: number; lessons: ManifestEntry[] }[];
}

function groupByBook(entries: ManifestEntry[]): BookGroup[] {
  const books = new Map<string, Map<number, ManifestEntry[]>>();
  for (const entry of entries) {
    const chapters = books.get(entry.book) ?? new Map<number, ManifestEntry[]>();
    const lessons = chapters.get(entry.chapter) ?? [];
    lessons.push(entry);
    chapters.set(entry.chapter, lessons);
    books.set(entry.book, chapters);
  }

  const firstOrder = (lessons: ManifestEntry[]) => Math.min(...lessons.map((entry) => entry.order));

  return [...books.entries()]
    .map(([book, chapters]) => ({
      book,
      chapters: [...chapters.entries()]
        .map(([chapter, lessons]) => ({
          chapter,
          lessons: [...lessons].sort((a, b) => a.order - b.order),
        }))
        .sort((a, b) => firstOrder(a.lessons) - firstOrder(b.lessons)),
    }))
    .sort(
      (a, b) =>
        firstOrder(a.chapters.flatMap((chapter) => chapter.lessons)) -
        firstOrder(b.chapters.flatMap((chapter) => chapter.lessons)),
    );
}

function BookSections({
  groups,
  completed,
  accessFor,
  onOpen,
}: {
  groups: BookGroup[];
  completed: string[];
  accessFor: (id: string) => LessonAccess;
  onOpen: (id: string) => void;
}) {
  const { t } = useI18n();
  return groups.map((group) => (
    <div key={group.book} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 px-1">
        <h3 className="text-sm font-bold tracking-wide">{group.book}</h3>
        <Badge variant="outline" className="rounded-full text-[11px]">
          {group.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)} {t('path.lessonUnit')}
        </Badge>
      </div>
      {group.chapters.map(({ chapter, lessons }) => (
        <Card key={`${group.book}:${chapter}`} className="py-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              {t('path.chapterLabel')} {chapter} — {lessons.length} {t('path.lessonUnit')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((entry) => (
              <LessonNode
                key={entry.id}
                entry={entry}
                completed={completed}
                access={accessFor(entry.id)}
                onOpen={onOpen}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  ));
}

export function PathView() {
  const { t, pick, locale } = useI18n();
  const ar = locale === 'ar';
  const { navigate } = useRouter();
  const {
    ready: manifestReady,
    entries: manifest,
    completedLessons: completed,
    gateMode,
    certified,
    partIIOpen: partIIUnlocked,
    accessFor,
  } = useCurriculumAccess();

  const partIGroups = useMemo(() => groupByBook(manifest.filter((m) => m.part === 'I')), [manifest]);
  const partIIGroups = useMemo(() => groupByBook(manifest.filter((m) => m.part === 'II')), [manifest]);

  const partITotal = manifest.filter((m) => m.part === 'I').length;
  const partIDone = manifest.filter((m) => m.part === 'I' && completed.includes(m.id)).length;
  const partIITotal = manifest.filter((m) => m.part === 'II').length;
  const partIIDone = manifest.filter((m) => m.part === 'II' && completed.includes(m.id)).length;
  const partIAllDone = partITotal > 0 && partIDone === partITotal;

  const open = (id: string) => {
    if (accessFor(id) === 'unlocked') navigate('lesson', id);
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

        <BookSections
          groups={partIGroups}
          completed={completed}
          accessFor={accessFor}
          onOpen={open}
        />
      </section>

      {/* Part II — opens after Part I (and certification when enforced) */}
      <section id="part-ii" className="flex flex-col gap-4" aria-label={t('path.partIITitle')}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="flex items-center gap-2 text-lg font-bold" style={{ color: 'var(--accent-ai)' }}>
            <Sparkle className="size-4" aria-hidden="true" />
            {t('path.partIITitle')}
          </h2>
          <Badge variant="secondary" className="rounded-full">
            {partIIDone}/{partIITotal} {t('path.lessonUnit')}
          </Badge>
          {!partIIUnlocked && (
            <Badge variant="outline" className="gap-1 border-[var(--accent-ai)]">
              <Lock className="size-3" aria-hidden="true" />
              {t('common.locked')}
            </Badge>
          )}
        </div>

        {!partIIUnlocked ? (
          <Card className="py-card" style={{ background: 'var(--accent-ai-soft)' }}>
            <CardContent className="pt-6">
              <p className="text-sm">{t('path.partIILockedBody')}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {partIAllDone
                  ? t('path.requirementPartIComplete')
                  : t('path.requirementDone', { count: partITotal - partIDone })}
              </p>
              {gateMode === 'enforced' && !certified && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {ar
                    ? 'وضع الفرض مُفعّل: يُشترط أيضًا اجتياز الاعتماد (الامتحان ≥ 80٪ + جاهزية كابستون ≥ 80٪) — انظر صفحتي الامتحان والكابستون.'
                    : 'Enforced gate is on: certification (exam ≥ 80% + capstone readiness ≥ 80%) is also required — see the Exam and Capstone views.'}
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{t('path.partIIOpenBody')}</p>
            {gateMode === 'enforced' && certified && partIAllDone && (
              <p className="text-xs font-medium">
                {ar
                  ? 'بوابة الاعتماد مستوفاة في وضع الفرض ✓'
                  : 'Certification gate satisfied in enforced mode ✓'}
              </p>
            )}
            <BookSections
              groups={partIIGroups}
              completed={completed}
              accessFor={accessFor}
              onOpen={open}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default PathView;
