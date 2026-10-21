/**
 * Pyodide worker protocol (main thread side). The worker file
 * (pyodideWorker.ts) is self-contained and must stay import-free so the
 * bundler emits it as a classic script (importScripts compatibility).
 */

export interface PyErrorInfo {
  type: string;
  message: string;
  lineno: number;
  traceback?: string;
}

export interface TestSpecWire {
  id: string;
  name: string;
  code: string;
}

export type WorkerRequest =
  | { type: 'run'; id: string; code: string; timeoutMs: number }
  | { type: 'runTests'; id: string; code: string; tests: TestSpecWire[]; timeoutMs: number }
  | { type: 'trace'; id: string; code: string; timeoutMs: number };

/** Distributive Omit: keeps the union intact (plain Omit collapses the union
 *  to the intersection of keys and breaks discriminated request bodies). */
type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;
export type WorkerRequestBody = DistributiveOmit<WorkerRequest, 'id'>;

export type WorkerEvent =
  | { type: 'loading'; phase: 'download' | 'boot' }
  | { type: 'ready' }
  | { type: 'loadError'; message: string }
  | { type: 'stdout'; id: string; text: string }
  | { type: 'stderr'; id: string; text: string }
  | { type: 'result'; id: string; ok: boolean; repr: string | null; error: PyErrorInfo | null }
  | {
      type: 'testsResult';
      id: string;
      payload: string | null;
      error: PyErrorInfo | null;
    }
  | { type: 'traceResult'; id: string; payload: string | null; error: PyErrorInfo | null }
  | { type: 'timeout'; id: string }
  | { type: 'stopped'; id: string }
  | { type: 'done'; id: string };

export interface TestOutcome {
  id: string;
  name: string;
  passed: boolean;
  message: string;
}

export interface TestsPayload {
  ok: boolean;
  error: PyErrorInfo | null;
  tests: TestOutcome[];
  stdout: string;
}

export interface TracePayload {
  steps: { line: number; event: string; locals: Record<string, [string, string]> }[];
  truncated: boolean;
  error: PyErrorInfo | null;
  stdout: string;
}

export type RunOutcome =
  | { kind: 'ok'; stdout: string[]; stderr: string[]; repr: string | null }
  | { kind: 'error'; error: PyErrorInfo; stdout: string[]; stderr: string[] }
  | { kind: 'timeout' }
  | { kind: 'stopped' }
  | { kind: 'loadError'; message: string };

export const PYODIDE_VERSION = '0.29.5';
export const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
export const DEFAULT_RUN_TIMEOUT_MS = 10_000;
