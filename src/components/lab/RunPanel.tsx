'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Play, Square, TriangleAlert } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { usePython, type OutputLine } from '@/lib/runtime/usePython';
import { DEFAULT_RUN_TIMEOUT_MS, type RunOutcome } from '@/lib/runtime/protocol';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export interface RunPanelProps {
  code: string;
  onOutcome?: (o: RunOutcome) => void;
  compact?: boolean;
  runLabel?: string;
  className?: string;
}

function OutputLines({ lines }: { lines: OutputLine[] }) {
  return (
    <div dir="ltr" className="code-island max-h-64 overflow-y-auto rounded-lg bg-muted/60 p-3 text-xs leading-relaxed">
      {lines.length === 0 ? null : (
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

/**
 * Run/Stop console for a code snippet: ≥44px buttons, bilingual Pyodide
 * loading progress, graceful load-error state, LTR output console.
 */
export function RunPanel({ code, onOutcome, compact = false, runLabel, className }: RunPanelProps) {
  const { t } = useI18n();
  const { status, loadPhase, output, lastOutcome, run, stop, warm } = usePython();

  useEffect(() => {
    warm();
  }, [warm]);

  const handleRun = async () => {
    const o = await run(code, DEFAULT_RUN_TIMEOUT_MS);
    onOutcome?.(o);
  };

  const loading = status === 'loading';
  const running = status === 'running';
  const loadError = lastOutcome?.kind === 'loadError';

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={handleRun}
          disabled={loading || running}
          className="h-11 min-h-11 gap-2 rounded-xl px-5"
          aria-label={runLabel ?? t('common.run')}
        >
          {running ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {running ? t('common.loading') : (runLabel ?? t('common.run'))}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={stop}
          disabled={!running}
          className="h-11 min-h-11 gap-2 rounded-xl px-4"
          aria-label={t('common.stop')}
        >
          <Square className="size-4" aria-hidden="true" />
          {t('common.stop')}
        </Button>
        <span className="ms-auto text-xs text-muted-foreground">{t('lesson.lab.runHint')}</span>
      </div>

      {loading && (
        <div className="rounded-xl border border-dashed p-4" role="status" aria-live="polite">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
            {t('runtime.loadingTitle')}
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            {loadPhase === 'download' ? t('runtime.downloadPhase') : t('runtime.bootPhase')} — {t('runtime.loadingBody')}
          </p>
          <div className="space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}

      {loadError && (
        <div className="rounded-xl border p-4 text-sm" role="alert" style={{ background: 'var(--color-warn-soft)' }}>
          <div className="mb-1 flex items-center gap-2 font-medium">
            <TriangleAlert className="size-4" aria-hidden="true" />
            {t('runtime.loadFailed')}
          </div>
          <p className="text-xs">{t('runtime.loadFailedBody')}</p>
        </div>
      )}

      {!loading && (
        <div aria-label={t('runtime.console')} aria-live="polite">
          {output.length === 0 ? (
            <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground" dir="ltr">
              {t('runtime.noOutput')}
            </div>
          ) : (
            <OutputLines lines={output} />
          )}
        </div>
      )}
    </div>
  );
}

export default RunPanel;
