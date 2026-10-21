'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CodeEditor } from '@/components/lab/CodeEditor';
import { RunPanel } from '@/components/lab/RunPanel';
import { FriendlyError } from '@/components/lab/FriendlyError';
import { useI18n } from '@/lib/i18n';
import { useProgress } from '@/lib/store/progress';
import {
  SOLUTION_UNLOCK_ATTEMPTS,
  XP_PER_EXERCISE,
} from '@/lib/gamification/config';
import { gradePattern, parseExpectedActual } from '@/lib/content/grading';
import { usePython } from '@/lib/runtime/usePython';
import { pythonRunner } from '@/lib/runtime/runner';
import type { PyErrorInfo, TestSpecWire } from '@/lib/runtime/protocol';
import type { Block } from '@/lib/content/schema';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, ChevronDown, GripVertical, Lightbulb, Lock, XCircle } from 'lucide-react';

export type ExerciseBlock = Extract<Block, { kind: 'exercise' }>;
export type DebugBlock = Extract<Block, { kind: 'debug' }>;

const EDITOR_KINDS = new Set(['write_code', 'debug']);

interface ExerciseCardProps {
  lessonId: string;
  block: ExerciseBlock | DebugBlock;
  onPassed?: (exerciseId: string) => void;
}

interface TestRow {
  id: string;
  name: string;
  passed: boolean;
  message: string;
}

function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  // Deterministic shuffle (SSR-safe): pure function of the seed string.
  let seed = 0;
  for (const ch of seedStr) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const a = [...arr];
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SortableLine({ id, text }: { id: string; text: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-2 rounded-lg border bg-card px-3 py-2',
        isDragging && 'opacity-70 shadow-md',
      )}
    >
      <button
        type="button"
        className="touch-none rounded p-1 text-muted-foreground hover:bg-muted"
        aria-label="drag handle"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>
      <code dir="ltr" className="code-island flex-1 overflow-x-auto text-xs">
        {text}
      </code>
    </div>
  );
}

/**
 * One exercise — prompt, editor/answer input, Run + Check, per-test results
 * (expected vs actual), 4-level hint ladder, friendly error translation.
 * Hints reduce XP but never block; the full solution unlocks after ≥2 attempts.
 */
export function ExerciseCard({ lessonId, block, onPassed }: ExerciseCardProps) {
  const { t, pick, locale } = useI18n();
  const { status: runtimeStatus } = usePython();
  const isDebug = block.kind === 'debug';
  const isEditorKind = isDebug || block.exKind === 'write_code';

  const result = useProgress((s) => s.exerciseResults[`${lessonId}:${block.id}`]);
  const calm = useProgress((s) => s.settings.calm);
  const recordExerciseAttempt = useProgress((s) => s.recordExerciseAttempt);
  const recordHintUsed = useProgress((s) => s.recordHintUsed);

  const [code, setCode] = useState(isDebug ? block.brokenCode : (block.starterCode ?? ''));
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState('');
  const [parsonsOrder, setParsonsOrder] = useState<string[]>(() => {
    if (block.kind === 'exercise' && block.exKind === 'parsons' && block.items) {
      let s = seededShuffle(block.items, block.id);
      if (s.join('\n') === block.solution.trim() && s.length > 1) {
        s = seededShuffle(block.items, block.id + '::alt');
      }
      return s;
    }
    return [];
  });

  const [checkState, setCheckState] = useState<'idle' | 'busy' | 'passed' | 'failed' | 'noRuntime'>('idle');
  const [testRows, setTestRows] = useState<TestRow[] | null>(null);
  const [runError, setRunError] = useState<PyErrorInfo | null>(null);

  // Hint ladder level is derived from the persisted ledger (hintsUsed) —
  // no duplicate local state, survives reloads, idempotent.
  const revealedHints = result?.hintsUsed ?? 0;

  const attempts = result?.attempts ?? 0;
  const alreadyPassed = result?.passed ?? false;
  const solutionUnlocked = attempts >= SOLUTION_UNLOCK_ATTEMPTS;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const testsAsWire = useMemo<TestSpecWire[]>(
    () =>
      (block.tests ?? []).map((tt) => ({
        id: tt.id,
        name: pick(tt.name),
        code: tt.code,
      })),
    [block.tests, pick],
  );

  const showToastFor = (amount: number, reasonKey: string) => {
    if (calm || amount <= 0) return;
    toast.success(t('toast.xpTitle', { amount }), { description: t(reasonKey) });
  };

  /** Record an attempt; award XP on first pass. Returns XP amount awarded. */
  const recordAttempt = (passed: boolean): number => {
    const ev = recordExerciseAttempt(lessonId, block.id, passed, isDebug);
    if (ev) {
      showToastFor(
        ev.amount,
        isDebug ? 'toast.xpReason.debug' : ev.reason === 'exerciseFirstTry' ? 'toast.xpReason.exerciseFirstTry' : 'toast.xpReason.exerciseRetry',
      );
      return ev.amount;
    }
    return 0;
  };

  const handleCheckEditor = async () => {
    setCheckState('busy');
    setRunError(null);
    setTestRows(null);
    // runTests surfaces loadError gracefully — pattern fallback cannot grade code
    const { outcome, tests } = await pythonRunner.runTests(code, testsAsWire);
    if (outcome.kind === 'loadError' || outcome.kind === 'timeout' || outcome.kind === 'stopped') {
      setCheckState('noRuntime');
      setRunError(null);
      return;
    }
    if (outcome.kind === 'error' && (!tests || tests.tests.length === 0)) {
      setRunError(outcome.error);
      recordAttempt(false);
      setCheckState('failed');
      return;
    }
    const rows: TestRow[] = tests?.tests ?? [];
    const passed = rows.length > 0 && rows.every((r) => r.passed);
    setTestRows(rows);
    setRunError(outcome.kind === 'error' ? outcome.error : null);
    recordAttempt(passed);
    setCheckState(passed ? 'passed' : 'failed');
    if (passed) onPassed?.(block.id);
  };

  const handleCheckPattern = () => {
    if (block.kind !== 'exercise' || block.exKind === 'write_code') return; // write_code needs the runtime, not pattern grading
    const learner =
      block.exKind === 'mcq'
        ? selected
        : block.exKind === 'parsons'
          ? parsonsOrder.join('\n')
          : answer;
    const expected = block.answer ?? block.solution;
    const res = gradePattern(block.exKind, learner, expected, block.tolerance ?? 0);
    recordAttempt(res.passed);
    setCheckState(res.passed ? 'passed' : 'failed');
    if (res.passed) onPassed?.(block.id);
  };

  const handleCheck = () => {
    setRunError(null);
    if (isEditorKind) void handleCheckEditor();
    else if (block.kind === 'exercise') handleCheckPattern();
  };

  const revealHint = (level: number) => {
    if (level > revealedHints) {
      // record one hint usage per newly revealed level (store-derived state)
      const diff = level - revealedHints;
      for (let i = 0; i < diff; i++) recordHintUsed(lessonId, block.id);
    }
  };

  const hintLabel = (i: number) => {
    const names = [t('exercise.hintLevel.nudge'), t('exercise.hintLevel.concept'), t('exercise.hintLevel.skeleton'), t('exercise.hintLevel.solution')];
    return names[i];
  };

  const busy = checkState === 'busy';
  const passedNow = checkState === 'passed' || alreadyPassed;

  const codeForTrace = block.kind === 'exercise' && block.exKind === 'trace_output' ? (block.code ?? block.solution) : null;

  return (
    <section className="py-card gentle-rise p-6" aria-label={t('exercise.kindLabel.' + (isDebug ? 'debug' : block.exKind))}>
      <header className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="gap-1 border-[var(--accent-python)] text-[var(--accent-python-strong)]">
          {t('exercise.kindLabel.' + (isDebug ? 'debug' : block.exKind))}
        </Badge>
        {block.kind === 'exercise' && !block.required && <Badge variant="secondary">{t('common.optional')}</Badge>}
        {passedNow && (
          <Badge className="gap-1 text-white" style={{ background: 'var(--color-success)' }}>
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {t('common.completed')}
          </Badge>
        )}
        {attempts > 0 && (
          <span className="text-xs text-muted-foreground">
            {attempts} {t('common.attempts')}
          </span>
        )}
      </header>

      {isDebug && (
        <p className="mb-3 text-sm text-muted-foreground">{t('lesson.blocks.debugIntro')}</p>
      )}

      <p className="mb-4 text-sm leading-7">{pick(block.prompt)}</p>

      {/* trace_output: show the code to read */}
      {codeForTrace && (
        <pre dir="ltr" className="code-island mb-4 overflow-x-auto rounded-xl border bg-muted/40 p-4 text-xs leading-6">
          {codeForTrace}
        </pre>
      )}

      {/* Editor kinds */}
      {isEditorKind && (
        <div className="mb-4">
          <CodeEditor value={code} onChange={setCode} minHeight={isDebug ? 120 : 110} ariaLabel={t('exercise.kindLabel.' + (isDebug ? 'debug' : 'write_code'))} />
        </div>
      )}

      {/* mcq */}
      {block.kind === 'exercise' && block.exKind === 'mcq' && (
        <RadioGroup value={selected} onValueChange={setSelected} className="mb-4 gap-3">
          {block.options?.map((opt) => (
            <Label
              key={opt.id}
              className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 font-normal transition-colors hover:bg-muted/60 has-[button[data-state=checked]]:border-[var(--accent-python)]"
            >
              <RadioGroupItem value={opt.id} />
              <span className="text-sm">{pick(opt.text)}</span>
            </Label>
          ))}
        </RadioGroup>
      )}

      {/* fill_blank / trace_output / numeric answer inputs */}
      {block.kind === 'exercise' && (block.exKind === 'fill_blank' || block.exKind === 'trace_output' || block.exKind === 'numeric') && (
        <div className="mb-4">
          <Label htmlFor={`ex-${block.id}`} className="mb-2 block text-xs text-muted-foreground">
            {t('exercise.yourAnswer')}
          </Label>
          {block.exKind === 'trace_output' ? (
            <Textarea
              id={`ex-${block.id}`}
              dir="ltr"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t('exercise.answerPlaceholderTrace')}
              className="code-island min-h-20"
            />
          ) : (
            <Input
              id={`ex-${block.id}`}
              dir="ltr"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={block.exKind === 'numeric' ? t('exercise.answerPlaceholderNumeric') : t('exercise.answerPlaceholderFill')}
              className="h-11"
            />
          )}
        </div>
      )}

      {/* parsons */}
      {block.kind === 'exercise' && block.exKind === 'parsons' && block.items && (
        <div className="mb-4">
          <p className="mb-2 text-xs text-muted-foreground">{t('exercise.parsonsTitle')}</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e: DragEndEvent) => {
            const { active, over } = e;
            if (over && active.id !== over.id) {
              setParsonsOrder((order) => {
                const oldIdx = order.indexOf(String(active.id));
                const newIdx = order.indexOf(String(over.id));
                return arrayMove(order, oldIdx, newIdx);
              });
            }
          }}>
            <SortableContext items={parsonsOrder} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {parsonsOrder.map((line, i) => (
                  <SortableLine key={`${i}-${line}`} id={line} text={line} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Button type="button" variant="ghost" size="sm" className="mt-2 h-9" onClick={() => setParsonsOrder(shuffle(block.items!))}>
            {t('exercise.parsonsReset')}
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {isEditorKind && (
          <div className="min-w-56 flex-1">
            <RunPanel code={code} compact className="gap-2" />
          </div>
        )}
        <Button
          type="button"
          onClick={handleCheck}
          disabled={busy || (block.kind === 'exercise' && block.exKind === 'mcq' && !selected)}
          className="h-11 min-h-11 rounded-xl px-6 font-semibold"
        >
          {t('common.check')}
        </Button>
      </div>

      {/* Results */}
      <div className="mt-4 space-y-3" aria-live="polite">
        {checkState === 'noRuntime' && (
          <p className="rounded-xl border border-dashed p-3 text-sm" style={{ background: 'var(--color-warn-soft)' }}>
            {t('exercise.runtimeUnavailable')}
          </p>
        )}
        {checkState === 'passed' && (
          <p className="rounded-xl p-3 text-sm font-medium text-white" style={{ background: 'var(--color-success)' }}>
            {isEditorKind ? t('exercise.passedAll') : t('grading.patternPassed')}
          </p>
        )}
        {checkState === 'failed' && !runError && (
          <p className="rounded-xl p-3 text-sm" style={{ background: 'var(--color-warn-soft)' }}>
            {isEditorKind && testRows
              ? t('exercise.failedSome', {
                  failed: testRows.filter((r) => !r.passed).length,
                  total: testRows.length,
                })
              : t('grading.patternFailed')}
          </p>
        )}
        {runError && <FriendlyError error={runError} />}

        {testRows && testRows.length > 0 && (
          <div className="rounded-xl border">
            <p className="border-b px-4 py-2 text-xs font-semibold text-muted-foreground">{t('exercise.testsTitle')}</p>
            <ul className="divide-y">
              {testRows.map((r) => {
                const ea = parseExpectedActual(r.message);
                return (
                  <li key={r.id} className="flex flex-col gap-1 px-4 py-3 text-sm">
                    <div className="flex items-start gap-2">
                      {r.passed ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--color-success)' }} aria-label="passed" />
                      ) : (
                        <XCircle className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--color-danger)' }} aria-label="failed" />
                      )}
                      <span className="flex-1">{r.name}</span>
                    </div>
                    {!r.passed && r.message && (
                      <div dir="ltr" className="code-island ms-6 rounded-lg bg-muted/60 p-2 text-xs text-muted-foreground">
                        {r.message}
                      </div>
                    )}
                    {!r.passed && ea && (
                      <div className="ms-6 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg border p-2">
                          <span className="text-muted-foreground">{t('exercise.testExpected')}: </span>
                          <code dir="ltr">{ea.expected}</code>
                        </div>
                        <div className="rounded-lg border p-2">
                          <span className="text-muted-foreground">{t('exercise.testActual')}: </span>
                          <code dir="ltr">{ea.actual}</code>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Hint ladder */}
      <div className="mt-5 rounded-xl border border-dashed p-4">
        <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="size-4 text-[var(--color-warn)]" aria-hidden="true" />
          {t('exercise.hintsTitle')}
        </p>
        <p className="mb-3 text-xs text-muted-foreground">{t('exercise.hintCost')}</p>
        <ol className="space-y-2">
          {[0, 1, 2, 3].map((i) => {
            const revealed = i < revealedHints;
            const canReveal = i === revealedHints && (i < 3 || solutionUnlocked || alreadyPassed);
            const hint = block.hints[i];
            return (
              <li key={i}>
                {revealed ? (
                  <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
                    <span className="me-2 text-xs font-semibold text-muted-foreground">{hintLabel(i)}</span>
                    {i === 3 ? (
                      <pre dir="ltr" className="code-island mt-1 whitespace-pre-wrap text-xs">
                        {pick(hint)}
                      </pre>
                    ) : (
                      pick(hint)
                    )}
                  </div>
                ) : canReveal ? (
                  <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => revealHint(i + 1)}>
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                    {hintLabel(i)} — {t('exercise.hintUnlock')}
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="size-3" aria-hidden="true" />
                    {i === 3 && !solutionUnlocked
                      ? t('exercise.hintSolutionAfterAttempts', { n: SOLUTION_UNLOCK_ATTEMPTS })
                      : t('exercise.hintLocked')}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        {revealedHints >= 4 && <p className="mt-2 text-xs text-muted-foreground">{t('exercise.solutionShown')}</p>}
        {locale === 'ar' && attempts === 0 && revealedHints === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {XP_PER_EXERCISE.firstTry} {t('common.xp')} — {t('exercise.checkNeedsRun')}
          </p>
        )}
      </div>
    </section>
  );
}

export default ExerciseCard;
