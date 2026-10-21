'use client';

import { useCallback, useEffect, useState } from 'react';
import { pythonRunner } from './runner';
import type { TracePayload } from './protocol';

export interface TraceStep {
  line: number;
  event: string;
  locals: Record<string, [string, string]>;
}

export interface TraceState {
  steps: TraceStep[];
  truncated: boolean;
  error: { type: string; message: string; lineno: number } | null;
  stdout: string;
}

/**
 * useTracer — runs learner code under sys.settrace (capped at 200 steps)
 * and exposes playback state for the StepVisualizer.
 */
export function useTracer() {
  const [state, setState] = useState<TraceState | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const trace = useCallback(async (code: string) => {
    setBusy(true);
    setFailed(false);
    const outcome = await pythonRunner.trace(code);
    if (outcome.kind === 'ok' && outcome.stdout[0]) {
      try {
        const payload = JSON.parse(outcome.stdout[0]) as TracePayload;
        setState({
          steps: payload.steps ?? [],
          truncated: payload.truncated,
          error: payload.error,
          stdout: payload.stdout ?? '',
        });
        setFailed(!payload.error ? false : false);
      } catch {
        setFailed(true);
        setState(null);
      }
    } else {
      setFailed(true);
      setState(null);
    }
    setBusy(false);
  }, []);

  const clear = useCallback(() => {
    setState(null);
    setFailed(false);
  }, []);

  useEffect(() => () => undefined, []);

  return { trace, clear, state, busy, failed };
}
