'use client';

import { useEffect, useMemo, useRef } from 'react';

export interface CodeEditorProps {
  value: string;
  onChange: (v: string) => void;
  minHeight?: number;
  readOnly?: boolean;
  ariaLabel?: string;
  editorRef?: { current: HTMLDivElement | null };
  /** Fire on Ctrl/Cmd+Enter (used by the lab panel for Run). */
  onRun?: () => void;
}

/**
 * Professional dependency-free code editor (ADR-0005 amendment):
 * - monospace, ligatures off, ALWAYS dir="ltr"
 * - line-number gutter synced to scroll
 * - Tab inserts 4 spaces; Ctrl/Cmd+Enter triggers onRun
 * Chosen over CodeMirror 6 to guarantee a single @codemirror/state
 * instance across the bundle (duplicate-copy conflict broke extensions).
 */
export function CodeEditor({
  value,
  onChange,
  minHeight = 140,
  readOnly = false,
  ariaLabel = 'Python code editor',
  editorRef,
  onRun,
}: CodeEditorProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  const lineCount = useMemo(() => Math.max(value.split('\n').length, 1), [value]);

  // keep gutter in sync with textarea scroll
  useEffect(() => {
    const ta = taRef.current;
    const g = gutterRef.current;
    if (!ta || !g) return;
    const onScroll = () => {
      g.scrollTop = ta.scrollTop;
    };
    ta.addEventListener('scroll', onScroll);
    return () => ta.removeEventListener('scroll', onScroll);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = value.slice(0, start) + '    ' + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  };

  return (
    <div
      ref={editorRef ?? undefined}
      dir="ltr"
      className="code-island flex overflow-hidden rounded-xl border bg-card text-start focus-within:ring-2 focus-within:ring-[var(--accent-python)]"
      style={{ minHeight }}
      tabIndex={-1}
    >
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none overflow-hidden border-e bg-muted/50 px-2 py-3 text-end font-mono text-xs leading-6 text-muted-foreground"
        style={{ minWidth: '2.75rem' }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        wrap="off"
        aria-label={ariaLabel}
        className="w-full resize-none bg-transparent p-3 font-mono text-sm leading-6 outline-none"
        style={{ fontVariantLigatures: 'none', minHeight, tabSize: 4 }}
      />
    </div>
  );
}

export default CodeEditor;
