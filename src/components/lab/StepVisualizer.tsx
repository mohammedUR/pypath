'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useTracer, type TraceState, type TraceStep } from '@/lib/runtime/useTracer';
import type { PyErrorInfo } from '@/lib/runtime/protocol';
import { FriendlyError } from '@/components/lab/FriendlyError';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Eraser, Pause, Play, Terminal } from 'lucide-react';

export interface StepVisualizerProps {
  code: string;
  className?: string;
}

const SPEEDS = [1, 2, 4] as const; // ×base interval

/**
 * Playback visualizer for sys.settrace steps: play/pause/step/speed,
 * current-line highlight, variable table. Respects reduced motion.
 */
export function StepVisualizer({ code, className }: StepVisualizerProps) {
  const { t, dir } = useI18n();
  const { trace, clear, state, busy, failed } = useTracer();
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps: TraceStep[] = useMemo(() => state?.steps ?? [], [state]);
  const total = steps.length;

  // Reset playback when a new trace arrives — adjusted during render
  // (React-endorsed pattern instead of a cascading effect).
  const [prevState, setPrevState] = useState<TraceState | null>(state);
  if (prevState !== state) {
    setPrevState(state);
    setIdx(0);
    setPlaying(false);
  }

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    if (playing && total > 0) {
      const base = 900;
      timer.current = setInterval(() => {
        setIdx((i) => {
          if (i + 1 >= total) {
            setPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, base / speed);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speed, total]);

  const current: TraceStep | undefined = steps[Math.min(idx, Math.max(0, total - 1))];
  const codeLines = useMemo(() => code.split('\n'), [code]);
  const error: PyErrorInfo | null = state?.error ?? null;

  const Step = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const StepBack = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => void trace(code)}
          disabled={busy}
          className="h-11 min-h-11 gap-2 rounded-xl px-4"
        >
          <Terminal className="size-4" aria-hidden="true" />
          {busy ? t('common.loading') : t('lesson.lab.stepsTrace')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-xl"
          disabled={total === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          aria-label={t('common.step')}
        >
          <Step className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 min-h-11 rounded-xl px-3"
          disabled={total === 0}
          onClick={() => {
            if (idx >= total - 1) setIdx(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? t('common.pause') : t('common.play')}
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-xl"
          disabled={total === 0}
          onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
          aria-label={t('common.step')}
        >
          <StepBack className="size-4" aria-hidden="true" />
        </Button>
        <div className="flex items-center gap-1 rounded-xl border p-1" role="group" aria-label={t('common.speed')}>
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn(
                'h-9 min-w-9 rounded-lg px-2 text-xs font-semibold transition-colors',
                speed === s ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
              )}
              aria-pressed={speed === s}
            >
              {s}×
            </button>
          ))}
        </div>
        {state && (
          <Button type="button" variant="ghost" size="sm" className="h-9 gap-1.5" onClick={() => { clear(); setPlaying(false); }}>
            <Eraser className="size-3.5" aria-hidden="true" />
            {t('common.reset')}
          </Button>
        )}
        {total > 0 && (
          <span className="ms-auto text-xs tabular-nums text-muted-foreground">
            {Math.min(idx + 1, total)} / {total}
          </span>
        )}
      </div>

      {failed && <p className="text-sm text-muted-foreground">{t('lesson.lab.stepsError')}</p>}

      {state?.truncated && (
        <p className="rounded-lg p-2 text-xs" style={{ background: 'var(--color-warn-soft)' }}>
          {t('lesson.lab.stepsTruncated', { n: total })}
        </p>
      )}

      {error && <FriendlyError error={error} />}

      <div className="grid gap-4 md:grid-cols-2">
        <div dir="ltr" className="code-island overflow-x-auto rounded-xl border bg-muted/30 p-3">
          {codeLines.map((line, i) => {
            const n = i + 1;
            const active = current?.line === n;
            return (
              <div
                key={i}
                className={cn(
                  'flex gap-3 whitespace-pre px-1 text-xs leading-6',
                  active && 'rounded-md bg-[var(--accent-python-soft)] font-semibold',
                )}
                aria-current={active ? 'step' : undefined}
              >
                <span className="w-6 select-none text-end text-muted-foreground/60 tabular-nums">{n}</span>
                <span>{line || ' '}</span>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-xl border">
          <p className="border-b px-3 py-2 text-xs font-semibold text-muted-foreground">{t('lesson.lab.variables')}</p>
          <div className="max-h-48 overflow-y-auto">
            {current && Object.keys(current.locals).length > 0 ? (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 text-start text-muted-foreground">
                    <th className="px-3 py-2 text-start font-medium">{t('lesson.lab.variableName')}</th>
                    <th className="px-3 py-2 text-start font-medium">{t('lesson.lab.variableType')}</th>
                    <th className="px-3 py-2 text-start font-medium">{t('lesson.lab.variableValue')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(current.locals).map(([name, [type, repr]]) => (
                    <tr key={name} className="border-t">
                      <td dir="ltr" className="code-island px-3 py-1.5 font-semibold">{name}</td>
                      <td dir="ltr" className="code-island px-3 py-1.5 text-muted-foreground">{type}</td>
                      <td dir="ltr" className="code-island max-w-40 truncate px-3 py-1.5">{repr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-3 py-4 text-xs text-muted-foreground">{t('lesson.lab.stepsEmpty')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepVisualizer;
