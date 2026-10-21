'use client';

import { useI18n } from '@/lib/i18n';
import type { PyErrorInfo } from '@/lib/runtime/protocol';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const KNOWN_ERRORS = new Set([
  'SyntaxError',
  'NameError',
  'TypeError',
  'ValueError',
  'IndentationError',
  'ZeroDivisionError',
]);

/**
 * Translates common Python errors into plain-language
 * "what happened / why / how to fix" in the current locale.
 * The raw traceback stays available in a collapsible <details>.
 */
export function FriendlyError({ error, className }: { error: PyErrorInfo; className?: string }) {
  const { t } = useI18n();
  const key = KNOWN_ERRORS.has(error.type) ? error.type : 'unknown';

  return (
    <div className={cn('rounded-xl border p-4 text-sm', className)} style={{ background: 'var(--color-danger-soft)' }}>
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <span className="inline-flex size-6 items-center justify-center rounded-full text-xs text-white" style={{ background: 'var(--color-danger)' }}>
          {error.type.slice(0, 1)}
        </span>
        <span>
          {error.type}
          {error.lineno ? ` — ${t('lesson.lab.line')} ${error.lineno}` : ''}
        </span>
      </div>
      <dl className="space-y-2">
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">{t('exercise.errorTitle')}</dt>
          <dd>{t(`errors.${key}.what`)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">{t('exercise.errorWhy')}</dt>
          <dd>{t(`errors.${key}.why`)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">{t('exercise.errorFix')}</dt>
          <dd>{t(`errors.${key}.fix`)}</dd>
        </div>
      </dl>
      {(error.traceback || error.message) && (
        <details className="mt-3 rounded-lg border border-black/10">
          <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium">
            <ChevronDown className="me-1 inline size-3.5" aria-hidden="true" />
            {t('exercise.rawTraceback')}
          </summary>
          <pre dir="ltr" className="code-island max-h-40 overflow-auto p-3 text-xs text-[var(--color-stderr)]">
            {error.traceback || `${error.type}: ${error.message}`}
          </pre>
        </details>
      )}
    </div>
  );
}

export default FriendlyError;
