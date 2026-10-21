'use client';

import { useCallback, useEffect, useState } from 'react';
import { pythonRunner, type RunnerStatus } from './runner';
import type { RunOutcome } from './protocol';

export interface OutputLine {
  id: string;
  stream: 'stdout' | 'stderr' | 'system';
  text: string;
}

export type PythonStatus = RunnerStatus;

// Page-scoped monotonic ids for output lines. A module counter + random salt
// stays unique across component remounts and dev Fast Refresh (a per-instance
// useRef restarted at 1 and collided with preserved lines → React dup-key).
const LINE_SALT = Math.random().toString(36).slice(2, 8);
let lineSeq = 0;

/**
 * usePython — friendly facade over the Pyodide runner.
 * The runner is a singleton; every mount subscribes to status changes.
 */
export function usePython() {
  const [status, setStatus] = useState<PythonStatus>(pythonRunner.getStatus());
  const [loadPhase, setLoadPhase] = useState<'download' | 'boot'>(pythonRunner.getLoadPhase());
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [lastOutcome, setLastOutcome] = useState<RunOutcome | null>(null);

  useEffect(() => {
    return pythonRunner.onStatus((s, phase) => {
      setStatus(s);
      if (phase) setLoadPhase(phase);
    });
  }, []);

  const pushLine = useCallback((stream: OutputLine['stream'], text: string) => {
    lineSeq += 1;
    const id = `l${LINE_SALT}-${lineSeq}`;
    setOutput((prev) => [...prev.slice(-500), { id, stream, text }]);
  }, []);

  /** Run learner code; streams stdout/stderr into `output`. */
  const run = useCallback(
    async (code: string, timeoutMs?: number): Promise<RunOutcome> => {
      setOutput([]);
      pushLine('system', '…');
      const outcome = await pythonRunner.run(code, timeoutMs);
      setOutput([]);
      if (outcome.kind === 'ok') {
        outcome.stdout.forEach((t) => pushLine('stdout', t));
        outcome.stderr.forEach((t) => pushLine('stderr', t));
        if (outcome.stdout.length === 0 && outcome.stderr.length === 0) {
          pushLine('system', '(no output)');
        }
      } else if (outcome.kind === 'error') {
        outcome.stderr.forEach((t) => pushLine('stderr', t));
        pushLine('stderr', `${outcome.error.type}: ${outcome.error.message}`);
      } else if (outcome.kind === 'timeout') {
        pushLine('system', 'timeout');
      } else if (outcome.kind === 'stopped') {
        pushLine('system', 'stopped');
      } else {
        pushLine('system', `load error: ${outcome.message}`);
      }
      setLastOutcome(outcome);
      return outcome;
    },
    [pushLine],
  );

  const stop = useCallback(() => {
    pythonRunner.stop();
    pushLine('system', 'stopped');
  }, [pushLine]);

  /** Warm the runtime (call on lesson open, no UI noise). */
  const warm = useCallback(() => {
    pythonRunner.preload();
  }, []);

  return {
    status,
    loadPhase,
    output,
    lastOutcome,
    run,
    stop,
    warm,
    busy: status !== 'idle',
  };
}
