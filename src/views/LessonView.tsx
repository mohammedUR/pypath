'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useProgress } from '@/lib/store/progress';
import type { LessonResult } from '@/lib/content/registry';
import { useCurriculumAccess } from '@/lib/content/access';
import { loadLesson } from '@/lib/content/loadLesson';
import { requiredExerciseIds, type Block, type Lesson } from '@/lib/content/schema';
import { ExerciseCard } from '@/components/lab/ExerciseCard';
import { CodeEditor } from '@/components/lab/CodeEditor';
import { StepVisualizer } from '@/components/lab/StepVisualizer';
import { RunPanel } from '@/components/lab/RunPanel';
import { usePython, type OutputLine } from '@/lib/runtime/usePython';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  BookMarked,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FlaskConical,
  ListChecks,
  Lock,
  Play,
  TriangleAlert,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Small block renderers                                               */
/* ------------------------------------------------------------------ */

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
      {icon}
      {children}
    </p>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre dir="ltr" className="code-island overflow-x-auto rounded-xl border bg-muted/40 p-4 text-xs leading-6">
      {code}
    </pre>
  );
}

function HookBlock({ block }: { block: Extract<Block, { kind: 'hook' }> }) {
  const { pick, t } = useI18n();
  return (
    <Card className="py-card gentle-rise" style={{ background: 'var(--accent-python-soft)', borderInlineStart: '4px solid var(--accent-python)' }}>
      <CardContent className="p-6">
        <SectionLabel icon={<span aria-hidden="true">💡</span>}>{t('lesson.blocks.hookLabel')}</SectionLabel>
        <p className="text-base leading-8">{pick(block.text)}</p>
      </CardContent>
    </Card>
  );
}

function PredictBlock({ block }: { block: Extract<Block, { kind: 'predict' }> }) {
  const { pick, t } = useI18n();
  const [revealed, setRevealed] = useState(false);
  return (
    <Card className="py-card">
      <CardContent className="p-6">
        <SectionLabel icon={<Eye className="size-3.5" aria-hidden="true" />}>{t('lesson.blocks.predictTitle')}</SectionLabel>
        <p className="mb-3 text-sm">{pick(block.question)}</p>
        <div className="mb-4">
          <CodeBlock code={block.code} />
        </div>
        {revealed ? (
          <p className="rounded-xl p-4 text-sm leading-7" style={{ background: 'var(--color-success-soft)' }}>
            {pick(block.reveal)}
          </p>
        ) : (
          <Button variant="outline" className="h-11 rounded-xl" onClick={() => setRevealed(true)}>
            <Eye className="me-1.5 size-4" aria-hidden="true" />
            {t('lesson.blocks.predictReveal')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ConceptBlock({ block }: { block: Extract<Block, { kind: 'concept' }> }) {
  const { pick, t } = useI18n();
  return (
    <Card className="py-card">
      <CardContent className="p-6">
        <SectionLabel icon={<BookMarked className="size-3.5" aria-hidden="true" />}>{t('lesson.blocks.conceptLabel')}</SectionLabel>
        <h3 className="mb-3 text-lg font-bold">{pick(block.heading)}</h3>
        <div className="flex flex-col gap-3">
          {block.chunks.map((c, i) => (
            <p key={i} className="text-sm leading-8">
              {pick(c)}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkedBlock({ block }: { block: Extract<Block, { kind: 'worked' }> }) {
  const { pick, t } = useI18n();
  return (
    <Card className="py-card">
      <CardContent className="p-6">
        <SectionLabel icon={<Play className="size-3.5" aria-hidden="true" />}>{t('lesson.blocks.workedTitle')}</SectionLabel>
        <h3 className="mb-3 text-base font-bold">{pick(block.title)}</h3>
        <div className="mb-3">
          <CodeBlock code={block.code} />
        </div>
        <RunPanel code={block.code} runLabel={t('lesson.blocks.runWorked')} />
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{pick(block.explanation)}</p>
      </CardContent>
    </Card>
  );
}

function SandboxBlock({ block, onOpenInLab }: { block: Extract<Block, { kind: 'sandbox' }>; onOpenInLab: (code: string) => void }) {
  const { pick, t } = useI18n();
  const [code, setCode] = useState(block.starterCode);
  return (
    <Card className="py-card" style={{ borderStyle: 'dashed' }}>
      <CardContent className="p-6">
        <SectionLabel icon={<FlaskConical className="size-3.5" aria-hidden="true" />}>{t('lesson.blocks.sandboxTitle')}</SectionLabel>
        <p className="mb-3 text-sm">{pick(block.prompt)}</p>
        <CodeEditor value={code} onChange={setCode} minHeight={150} />
        <div className="mt-3">
          <RunPanel code={code} />
        </div>
        <Button variant="ghost" size="sm" className="mt-2 h-9" onClick={() => onOpenInLab(code)}>
          <FlaskConical className="me-1.5 size-3.5" aria-hidden="true" />
          {t('lesson.lab.title')} ↗
        </Button>
      </CardContent>
    </Card>
  );
}

function QuizBlock({ lessonId, block }: { lessonId: string; block: Extract<Block, { kind: 'quiz' }> }) {
  const { pick, t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const recordQuizItem = useProgress((s) => s.recordQuizItem);
  const calm = useProgress((s) => s.settings.calm);

  const handleCheck = () => {
    let score = 0;
    block.items.forEach((item) => {
      const ok = answers[item.id] === item.answer;
      if (ok) {
        score += 1;
        const ev = recordQuizItem(lessonId, item.id, true);
        if (ev && !calm) {
          toast.success(t('toast.xpTitle', { amount: ev.amount }), { description: t('toast.xpReason.quizItem') });
        }
      }
    });
    setChecked(true);
  };

  return (
    <Card className="py-card">
      <CardContent className="p-6">
        <SectionLabel icon={<ListChecks className="size-3.5" aria-hidden="true" />}>{t('lesson.blocks.quizTitle')}</SectionLabel>
        <p className="mb-4 text-sm text-muted-foreground">{t('lesson.blocks.quizIntro')}</p>
        <ol className="flex flex-col gap-5">
          {block.items.map((item, qi) => {
            const chosen = answers[item.id];
            const ok = checked && chosen === item.answer;
            return (
              <li key={item.id} className="rounded-xl border p-4">
                <p className="mb-3 text-sm font-semibold">
                  {qi + 1}. {pick(item.question)}
                </p>
                <div className="flex flex-col gap-2">
                  {item.options.map((opt) => {
                    const isChosen = chosen === opt.id;
                    const isAnswer = opt.id === item.answer;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => !checked && setAnswers((a) => ({ ...a, [item.id]: opt.id }))}
                        aria-pressed={isChosen}
                        className={cn(
                          'flex h-11 items-center gap-3 rounded-xl border px-4 text-start text-sm transition-colors',
                          isChosen && 'border-[var(--accent-python)] font-semibold',
                          checked && isAnswer && 'border-[var(--color-success)] bg-[var(--color-success-soft)]',
                          checked && isChosen && !isAnswer && 'border-[var(--color-danger)] bg-[var(--color-danger-soft)]',
                          !checked && 'hover:bg-muted/60',
                        )}
                      >
                        <span className="flex size-5 items-center justify-center rounded-full border text-[10px]">{opt.id}</span>
                        {pick(opt.text)}
                      </button>
                    );
                  })}
                </div>
                {checked && (
                  <p className={cn('mt-3 rounded-lg p-3 text-xs leading-6', ok ? 'bg-[var(--color-success-soft)]' : 'bg-[var(--color-warn-soft)]')}>
                    {ok ? '✓ ' : '• '}
                    {pick(item.explanation)}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex items-center gap-3">
          <Button className="h-11 rounded-xl px-6" onClick={handleCheck} disabled={checked || Object.keys(answers).length < block.items.length}>
            {t('lesson.blocks.quizCheck')}
          </Button>
          {checked && (
            <span className="text-sm font-semibold">
              {t('lesson.blocks.quizScore', {
                score: block.items.filter((i) => answers[i.id] === i.answer).length,
                total: block.items.length,
              })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PitfallsBlock({ block }: { block: Extract<Block, { kind: 'pitfalls' }> }) {
  const { pick, t } = useI18n();
  return (
    <Card className="py-card">
      <CardContent className="p-6">
        <SectionLabel icon={<TriangleAlert className="size-3.5" aria-hidden="true" />}>{t('lesson.blocks.pitfallsTitle')}</SectionLabel>
        <ul className="flex flex-col gap-4">
          {block.items.map((item, i) => (
            <li key={i} className="rounded-xl border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--color-danger)' }}>
                    ✗ {t('lesson.blocks.pitfallWrong')}
                  </p>
                  <pre dir="ltr" className="code-island overflow-x-auto rounded-lg bg-[var(--color-danger-soft)] p-2 text-xs">{item.wrong}</pre>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
                    ✓ {t('lesson.blocks.pitfallRight')}
                  </p>
                  <pre dir="ltr" className="code-island overflow-x-auto rounded-lg bg-[var(--color-success-soft)] p-2 text-xs">{item.right}</pre>
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                <strong>{t('lesson.blocks.pitfallWhy')}</strong> {pick(item.note)}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SummaryBlock({ lessonId, block }: { lessonId: string; block: Extract<Block, { kind: 'summary' }> }) {
  const { pick, t } = useI18n();
  const note = useProgress((s) => s.notes[lessonId] ?? '');
  const saveNote = useProgress((s) => s.saveNote);
  const [text, setText] = useState(note);
  const [saved, setSaved] = useState(false);
  // A sync pull (fresh device / rehydrate race) may land AFTER mount; React's
  // documented "adjust state during render" pattern adopts it without
  // clobbering local typing: only when the incoming note is longer or the
  // draft is empty (mirrors the sync engine's longer-wins note merge rule).
  const [lastAppliedNote, setLastAppliedNote] = useState(note);
  if (note !== lastAppliedNote) {
    setLastAppliedNote(note);
    if (note.length > text.length || text.length === 0) {
      setText(note);
    }
    setSaved(false);
  }

  return (
    <Card className="py-card">
      <CardContent className="p-6">
        <SectionLabel icon={<CheckCircle2 className="size-3.5" aria-hidden="true" />}>{t('lesson.blocks.summaryTitle')}</SectionLabel>
        <ul className="mb-5 flex flex-col gap-2">
          {block.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-7">
              <CheckCircle2 className="mt-1.5 size-4 shrink-0" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
              {pick(b)}
            </li>
          ))}
        </ul>
        <SectionLabel icon={<span aria-hidden="true">✍️</span>}>{t('lesson.blocks.reflectTitle')}</SectionLabel>
        <p className="mb-2 text-sm">{pick(block.reflectPrompt)}</p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            saveNote(lessonId, text);
            setSaved(true);
          }}
          placeholder={t('lesson.reflectPlaceholder')}
          className="min-h-24"
          aria-label={t('lesson.blocks.reflectTitle')}
        />
        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
          {saved ? t('lesson.reflectSaved') : t('lesson.blocks.reflectNote')}
        </p>
      </CardContent>
    </Card>
  );
}

function SourcesBlock({ lesson }: { lesson: Lesson }) {
  const { t } = useI18n();
  const items = lesson.blocks.find((b): b is Extract<Block, { kind: 'sources' }> => b.kind === 'sources')?.items ?? lesson.sources;
  return (
    <Card className="py-card">
      <CardContent className="p-6">
        <SectionLabel icon={<BookMarked className="size-3.5" aria-hidden="true" />}>{t('lesson.blocks.sourcesTitle')}</SectionLabel>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((s, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2">
              <Badge variant="secondary">{s.book}</Badge>
              <code dir="ltr" className="code-island text-xs">{s.section}</code>
              {s.pages && (
                <span className="text-xs text-muted-foreground">
                  {t('lesson.blocks.sourcesPages')}: {s.pages}
                </span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Lab panel                                                           */
/* ------------------------------------------------------------------ */

interface LabPanelProps {
  code: string;
  onCodeChange: (c: string) => void;
  py: ReturnType<typeof usePython>;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

function OutputLines({ lines }: { lines: OutputLine[] }) {
  return (
    <div dir="ltr" className="code-island max-h-56 min-h-16 overflow-y-auto rounded-xl border bg-muted/50 p-3 text-xs leading-relaxed">
      {lines.length === 0 ? (
        <p className="text-muted-foreground">…</p>
      ) : (
        lines.map((l) => (
          <pre
            key={l.id}
            className={cn(
              'whitespace-pre-wrap break-words font-mono',
              l.stream === 'stdout' && 'text-[var(--color-stdout)]',
              l.stream === 'stderr' && 'text-[var(--color-stderr)]',
              l.stream === 'system' && 'text-muted-foreground italic',
            )}
          >
            {l.text}
          </pre>
        ))
      )}
    </div>
  );
}

function LabPanel({ code, onCodeChange, py, editorRef }: LabPanelProps) {
  const { t } = useI18n();
  const loading = py.status === 'loading';
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          className="h-11 min-h-11 gap-2 rounded-xl px-5"
          onClick={() => void py.run(code)}
          disabled={py.status !== 'idle'}
        >
          <Play className="size-4" aria-hidden="true" />
          {t('common.run')}
        </Button>
        <Button type="button" variant="outline" className="h-11 min-h-11 rounded-xl px-4" onClick={py.stop} disabled={py.status === 'idle'}>
          {t('common.stop')}
        </Button>
        <span className="ms-auto text-xs text-muted-foreground">{t('lesson.lab.runHint')}</span>
      </div>

      {loading && (
        <div className="rounded-xl border border-dashed p-4" role="status" aria-live="polite">
          <p className="mb-2 text-sm font-medium">{t('runtime.loadingTitle')}</p>
          <p className="mb-3 text-xs text-muted-foreground">{t('runtime.loadingBody')}</p>
          <div className="space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}

      {py.lastOutcome?.kind === 'loadError' && (
        <p className="rounded-xl p-3 text-sm" style={{ background: 'var(--color-warn-soft)' }} role="alert">
          {t('runtime.loadFailed')} — {t('runtime.loadFailedBody')}
        </p>
      )}

      {!loading && <OutputLines lines={py.output} />}

      <div ref={editorRef} tabIndex={-1} className="rounded-xl">
        <CodeEditor value={code} onChange={onCodeChange} minHeight={180} ariaLabel={t('lesson.lab.title')} />
      </div>

      <div className="rounded-xl border p-4">
        <p className="mb-1 text-sm font-semibold">{t('lesson.lab.stepsTitle')}</p>
        <p className="mb-3 text-xs text-muted-foreground">{t('lesson.lab.stepsBody')}</p>
        <StepVisualizer code={code} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lesson view                                                         */
/* ------------------------------------------------------------------ */

export function LessonView({ lessonId }: { lessonId: string }) {
  const { t, pick, locale } = useI18n();
  const { navigate } = useRouter();

  const [result, setResult] = useState<LessonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState<'read' | 'lab'>('read');
  const [labCode, setLabCode] = useState("print('مرحبًا / Hello')\nprint(2 + 3)\n");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const labCodeRef = useRef(labCode);

  const py = usePython();
  const runRef = useRef(py.run);

  // Keep refs current outside of render (shortcut handlers read them).
  useEffect(() => {
    labCodeRef.current = labCode;
  }, [labCode]);
  useEffect(() => {
    runRef.current = py.run;
  }, [py.run]);

  // Reset per-lesson load state during render (React-endorsed pattern).
  const [loadedId, setLoadedId] = useState(lessonId);
  if (loadedId !== lessonId) {
    setLoadedId(lessonId);
    setResult(null);
    setLoading(true);
  }

  const {
    ready: manifestReady,
    entries,
    completedLessons: completed,
    accessFor,
  } = useCurriculumAccess();
  const entry = entries.find((item) => item.id === lessonId);
  const access = accessFor(lessonId);
  const canRead = manifestReady && access === 'unlocked';

  useEffect(() => {
    if (!canRead) return;
    let alive = true;
    void loadLesson(loadedId).then((r) => {
      if (!alive) return;
      setResult(r);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [loadedId, canRead]);

  const lesson = result?.status === 'found' ? result.lesson : null;

  const exerciseResults = useProgress((s) => s.exerciseResults);
  const completeLesson = useProgress((s) => s.completeLesson);
  const markLessonStarted = useProgress((s) => s.markLessonStarted);
  const calm = useProgress((s) => s.settings.calm);

  useEffect(() => {
    if (lesson && canRead) markLessonStarted(lessonId);
  }, [lesson, lessonId, markLessonStarted, canRead]);

  const requiredIds = useMemo(() => (lesson ? requiredExerciseIds(lesson) : []), [lesson]);
  const allPassed = requiredIds.length > 0 && requiredIds.every((id) => exerciseResults[`${lessonId}:${id}`]?.passed);
  const isCompleted = completed.includes(lessonId);

  const nextId = useMemo(() => {
    const index = entries.findIndex((item) => item.id === lessonId);
    if (index < 0) return undefined;
    for (let i = index + 1; i < entries.length; i++) {
      if (accessFor(entries[i].id) === 'unlocked') return entries[i].id;
    }
    return undefined;
  }, [entries, lessonId, accessFor]);

  const showCeremony = canRead && allPassed && isCompleted;
  // Completion is committed to the external store (allowed effect work):
  useEffect(() => {
    if (canRead && allPassed && !isCompleted) {
      const ev = completeLesson(lessonId);
      if (ev && !calm) {
        toast.success(t('toast.lessonDoneTitle'), { description: t('toast.lessonDoneBody', { xp: ev.amount }) });
      }
    }
  }, [canRead, allPassed, isCompleted, lessonId, completeLesson, calm, t]);

  // Reduce motion default per OS preference is handled in AppShell.

  const openInLab = useCallback((code: string) => {
    setLabCode(code);
    setMobileTab('lab');
    editorRef.current?.focus();
  }, []);

  const goNext = useCallback(() => {
    if (nextId) navigate('lesson', nextId);
    else navigate('path');
  }, [nextId, navigate]);

  /* Keyboard shortcuts: B (lab focus), R (run), N (next when complete) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (target?.closest('.cm-editor')) return;
      const k = e.key.toLowerCase();
      if (k === 'b') {
        e.preventDefault();
        setMobileTab('lab');
        editorRef.current?.focus();
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (k === 'r') {
        e.preventDefault();
        void runRef.current(labCodeRef.current);
        setMobileTab('lab');
      } else if (k === 'n') {
        if (isCompleted) {
          e.preventDefault();
          goNext();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCompleted, goNext]);

  /* -------------------- loading / locked / missing / invalid -------------------- */
  if (!manifestReady) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-busy="true">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (access === 'part-locked' || access === 'prereq-locked') {
    const prereqEntries = entry
      ? entry.prerequisites
          .map((id) => entries.find((item) => item.id === id))
          .filter((item): item is (typeof entries)[number] => Boolean(item))
      : [];
    return (
      <Card className="py-card mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <Lock className="size-8 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-semibold">
              {access === 'part-locked' ? t('lesson.partLockedTitle') : t('lesson.lockedTitle')}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {access === 'part-locked' ? t('lesson.partLockedBody') : t('lesson.lockedBody')}
            </p>
          </div>
          {access === 'prereq-locked' && prereqEntries.length > 0 && (
            <ul className="flex w-full flex-col gap-2 text-start">
              {prereqEntries.map((item) => (
                <li key={item.id} className="flex items-center gap-2 rounded-xl border p-3 text-sm">
                  <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="flex-1 font-medium">{pick(item.title)}</span>
                </li>
              ))}
            </ul>
          )}
          <Button variant="outline" className="h-11 rounded-xl" onClick={() => navigate('path')}>
            {t('lesson.backToPath')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (access === 'missing') {
    return (
      <Card className="py-card mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <Lock className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {locale === 'ar'
              ? 'هذا الدرس غير منشور في النسخة الحالية.'
              : 'This lesson is not published in the current build.'}
          </p>
          <Button variant="outline" className="h-11 rounded-xl" onClick={() => navigate('path')}>
            {t('lesson.backToPath')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-busy="true">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (!lesson || result?.status !== 'found') {
    return (
      <Card className="py-card mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <Lock className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {locale === 'ar'
              ? 'هذا الدرس غير منشور في النسخة الحالية.'
              : 'This lesson is not published in the current build.'}
          </p>
          <Button variant="outline" className="h-11 rounded-xl" onClick={() => navigate('path')}>
            {t('lesson.backToPath')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const NextIcon = locale === 'ar' ? ChevronLeft : ChevronRight;
  const BackIcon = locale === 'ar' ? ChevronRight : ChevronLeft;

  const readingColumn = (
    <article key={lessonId} className="flex flex-col gap-5">
      {isCompleted && (
        <div className="flex items-center gap-2 rounded-xl p-3 text-sm font-semibold text-white" style={{ background: 'var(--color-success)' }}>
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {t('lesson.completedBadge')}
        </div>
      )}

      {showCeremony && (
        <div className="py-card gentle-rise flex items-center gap-4 p-5" style={{ background: 'var(--accent-python-soft)' }} role="status">
          <svg viewBox="0 0 72 72" className="size-14 -rotate-90">
            <circle cx="36" cy="36" r="30" fill="none" stroke="var(--muted)" strokeWidth="6" />
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="6"
              strokeLinecap="round"
              className="ring-fill-anim"
              style={{ ['--ring-dash-start' as string]: '189', ['--ring-dash-end' as string]: '0', strokeDasharray: 189, strokeDashoffset: 0 }}
            />
          </svg>
          <div>
            <p className="font-bold">{t('lesson.completeCta')} ✓</p>
            <p className="text-sm text-muted-foreground">{t('lesson.completeBody')}</p>
          </div>
        </div>
      )}

      {lesson.blocks.map((block, i) => {
        switch (block.kind) {
          case 'hook':
            return <HookBlock key={i} block={block} />;
          case 'predict':
            return <PredictBlock key={i} block={block} />;
          case 'concept':
            return <ConceptBlock key={i} block={block} />;
          case 'worked':
            return <WorkedBlock key={i} block={block} />;
          case 'exercise':
          case 'debug':
            return (
              <ExerciseCard
                key={i}
                lessonId={lessonId}
                block={block}
                onPassed={() => undefined}
              />
            );
          case 'sandbox':
            return <SandboxBlock key={i} block={block} onOpenInLab={openInLab} />;
          case 'quiz':
            return <QuizBlock key={i} lessonId={lessonId} block={block} />;
          case 'pitfalls':
            return <PitfallsBlock key={i} block={block} />;
          case 'summary':
            return <SummaryBlock key={i} lessonId={lessonId} block={block} />;
          case 'sources':
            return <SourcesBlock key={i} lesson={lesson} />;
          default:
            return null;
        }
      })}

      <div className="flex items-center justify-between gap-3 pb-8">
        <Button variant="ghost" className="h-11 rounded-xl" onClick={() => navigate('path')}>
          <BackIcon className="size-4" aria-hidden="true" />
          {t('lesson.backToPath')}
        </Button>
        {nextId && (
          <Button className="h-11 gap-2 rounded-xl px-5" onClick={goNext}>
            {t('lesson.nextLesson')}
            <NextIcon className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </article>
  );

  const labColumn = (
    <div className="py-card p-4 md:p-6">
      <SectionLabel icon={<FlaskConical className="size-3.5" aria-hidden="true" />}>{t('lesson.lab.title')}</SectionLabel>
      <LabPanel code={labCode} onCodeChange={setLabCode} py={py} editorRef={editorRef} />
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" className="size-10 rounded-xl" onClick={() => navigate('path')} aria-label={t('lesson.backToPath')}>
          <BackIcon className="size-4" aria-hidden="true" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold md:text-2xl">{pick(lesson.title)}</h1>
          <p className="text-xs text-muted-foreground">
            {t('lesson.estimated')}: {lesson.estimatedMinutes} {t('lesson.minutesUnit')} · {t('path.chapterLabel')} {lesson.chapter}
          </p>
        </div>
        {requiredIds.length > 0 && (
          <Badge variant="secondary" className="rounded-full">
            {requiredIds.filter((id) => exerciseResults[`${lessonId}:${id}`]?.passed).length}/{requiredIds.length} ✓
          </Badge>
        )}
      </header>

      {/* Mobile tab switch */}
      <div className="flex gap-1 rounded-xl border p-1 lg:hidden" role="tablist" aria-label={t('lesson.lab.title')}>
        {(['read', 'lab'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mobileTab === tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              'h-10 flex-1 rounded-lg text-sm font-semibold transition-colors',
              mobileTab === tab ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground',
            )}
          >
            {tab === 'read' ? `📖 ${t('lesson.blocks.conceptLabel')}` : `🧪 ${t('lesson.lab.title')}`}
          </button>
        ))}
      </div>

      {/* Side-by-side on wide screens; reading column first = inline-start in both dirs */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className={cn(mobileTab === 'read' ? 'block' : 'hidden', 'lg:block')}>{readingColumn}</div>
        <div className={cn(mobileTab === 'lab' ? 'block' : 'hidden', 'lg:sticky lg:top-24 lg:block', 'max-h-none lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto')}>
          {labColumn}
        </div>
      </div>
    </div>
  );
}

export default LessonView;
