'use client';

import {
  DEFAULT_RUN_TIMEOUT_MS,
  type PyErrorInfo,
  type RunOutcome,
  type TestSpecWire,
  type TestsPayload,
  type WorkerEvent,
  type WorkerRequest,
  type WorkerRequestBody,
} from './protocol';

/**
 * Main-thread manager for the Pyodide worker.
 * - lazy spawn, respawn-on-stop
 * - per-run watchdog: if a run overruns its deadline + grace, terminate the
 *   worker (the only reliable interrupt without SharedArrayBuffer) and
 *   respawn lazily on the next run.
 */

interface PendingRun {
  onOutput: (e: WorkerEvent) => void;
  onSettle: (e: WorkerEvent) => void;
  watchdog: ReturnType<typeof setTimeout>;
}

export type RunnerStatus = 'idle' | 'loading' | 'running';

type StatusListener = (s: RunnerStatus, phase?: 'download' | 'boot') => void;

const WATCHDOG_GRACE_MS = 2500;

const TERMINAL_EVENTS = new Set(['result', 'testsResult', 'traceResult', 'timeout']);

class PyodideRunner {
  private worker: Worker | null = null;
  private pending = new Map<string, PendingRun>();
  private statusListeners = new Set<StatusListener>();
  private loadWaiters = new Set<(e: WorkerEvent) => void>();
  private status: RunnerStatus = 'idle';
  private loadPhase: 'download' | 'boot' = 'download';
  private everReady = false;
  /** Last terminal load failure message (null while loading/ready). */
  private loadFailed: string | null = null;
  private seq = 0;

  getStatus(): RunnerStatus {
    return this.status;
  }

  getLoadPhase(): 'download' | 'boot' {
    return this.loadPhase;
  }

  onStatus(cb: StatusListener): () => void {
    this.statusListeners.add(cb);
    cb(this.status, this.loadPhase);
    return () => {
      this.statusListeners.delete(cb);
    };
  }

  private setStatus(s: RunnerStatus, phase?: 'download' | 'boot') {
    this.status = s;
    if (phase) this.loadPhase = phase;
    this.statusListeners.forEach((cb) => cb(s, phase));
  }

  private spawn(): Worker {
    // Static asset worker (ADR-0002 amendment): self-contained classic worker,
    // served from /public — immune to bundler worker-chunk issues.
    const w = new Worker('/pyodide-worker.js');
    this.loadFailed = null;
    w.addEventListener('message', (ev: MessageEvent<WorkerEvent>) => {
      const e = ev.data;
      if (e.type === 'loading' || e.type === 'ready' || e.type === 'loadError') {
        if (e.type === 'loading') this.setStatus('loading', e.phase);
        if (e.type === 'ready') {
          this.everReady = true;
          this.loadFailed = null;
          this.setStatus('idle');
        }
        if (e.type === 'loadError') {
          this.loadFailed = e.message;
          this.setStatus('idle');
        }
        this.loadWaiters.forEach((cb) => cb(e));
        if (e.type === 'ready' || e.type === 'loadError') this.loadWaiters.clear();
      } else if ('id' in e && typeof e.id === 'string') {
        const p = this.pending.get(e.id);
        if (!p) return;
        if (e.type === 'stdout' || e.type === 'stderr') {
          p.onOutput(e);
        } else if (TERMINAL_EVENTS.has(e.type)) {
          clearTimeout(p.watchdog);
          this.pending.delete(e.id);
          this.setStatus('idle');
          p.onSettle(e);
        }
        // 'done' after settle is ignored (pending already removed)
      }
    });
    w.addEventListener('error', (ev) => {
      const message = ev.message || 'worker crashed';
      const err: WorkerEvent = { type: 'loadError', message };
      this.loadFailed = message;
      this.loadWaiters.forEach((cb) => cb(err));
      this.loadWaiters.clear();
      this.worker = null;
      this.everReady = false;
      this.pending.forEach((p) => {
        clearTimeout(p.watchdog);
        p.onSettle({ type: 'stopped', id: '*' });
      });
      this.pending.clear();
      this.setStatus('idle');
    });
    this.worker = w;
    return w;
  }

  private ensureWorker(): Worker {
    if (!this.worker) return this.spawn();
    return this.worker;
  }

  /** Warm up (e.g. when the user opens a lesson) without running code.
   * A previous load failure no longer poisons the session: re-kicking
   * retries the boot (the worker resets its own loading flag on failure,
   * and a crashed worker is respawned fresh).
   */
  preload(): void {
    if (this.everReady) return;
    const w = this.ensureWorker();
    w.postMessage({ type: 'load', id: 'load-kick' });
  }

  private waitForLoadSignal(): Promise<WorkerEvent> {
    return new Promise((resolve) => {
      const cb = (e: WorkerEvent) => {
        if (e.type === 'ready' || e.type === 'loadError') {
          this.loadWaiters.delete(cb);
          resolve(e);
        }
      };
      this.loadWaiters.add(cb);
    });
  }

  /** Resolves once Pyodide is usable; rejects with the load error message.
   * Never hangs: a bounded grace period covers the ~10MB boot, and a past
   * failure triggers ONE fresh retry instead of throwing forever — a
   * transient outage (server restart, flaky proxy) self-heals on the next
   * run/preload without requiring a full page reload.
   */
  async ensureReady(timeoutMs = 60000): Promise<void> {
    if (this.everReady) return;
    if (this.loadFailed) {
      // Fresh attempt: drop the recorded failure and force a clean worker.
      this.loadFailed = null;
      this.worker = null;
    }
    if (!this.worker) this.spawn();
    if (!this.worker) throw new Error('worker spawn failed');
    // The worker boots lazily on its first message — kick it so boot starts now.
    this.worker.postMessage({ type: 'load', id: 'load-kick' });
    const ev = await Promise.race([
      this.waitForLoadSignal(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('runtime load timeout')), timeoutMs),
      ),
    ]);
    if (ev.type === 'loadError') throw new Error(ev.message);
    this.everReady = true;
  }

  private newId(): string {
    this.seq += 1;
    return `run-${Date.now().toString(36)}-${this.seq}`;
  }

  /** Fire a request; resolve with its terminal event. Watchdog enforces the deadline. */
  private execute(
    req: WorkerRequestBody,
    onOutput: (e: WorkerEvent) => void,
    timeoutMs: number,
  ): Promise<WorkerEvent> {
    const w = this.ensureWorker();
    const id = this.newId();
    this.setStatus('running');
    return new Promise<WorkerEvent>((resolve) => {
      const watchdog = setTimeout(() => {
        // Hard overrun: kill + respawn. Without SharedArrayBuffer this is the
        // only reliable interrupt for compute-bound loops.
        this.terminateWorker();
        this.pending.delete(id);
        this.setStatus('idle');
        resolve({ type: 'timeout', id });
      }, timeoutMs + WATCHDOG_GRACE_MS);

      this.pending.set(id, {
        onOutput,
        onSettle: (e) => {
          clearTimeout(watchdog);
          resolve(e);
        },
        watchdog,
      });
      w.postMessage({ ...req, id });
    });
  }

  async run(code: string, timeoutMs = DEFAULT_RUN_TIMEOUT_MS): Promise<RunOutcome> {
    const stdout: string[] = [];
    const stderr: string[] = [];
    try {
      await this.ensureReady();
    } catch (e) {
      return { kind: 'loadError', message: e instanceof Error ? e.message : String(e) };
    }
    const last = await this.execute(
      { type: 'run', code, timeoutMs },
      (e) => {
        if (e.type === 'stdout') stdout.push(e.text);
        else if (e.type === 'stderr') stderr.push(e.text);
      },
      timeoutMs,
    );
    if (last.type === 'result') {
      if (last.ok) return { kind: 'ok', stdout, stderr, repr: last.repr };
      return {
        kind: 'error',
        error: (last.error as PyErrorInfo | null) ?? { type: 'UnknownError', message: '?', lineno: 0 },
        stdout,
        stderr,
      };
    }
    if (last.type === 'timeout') return { kind: 'timeout' };
    return { kind: 'stopped' };
  }

  async runTests(
    code: string,
    tests: TestSpecWire[],
    timeoutMs = DEFAULT_RUN_TIMEOUT_MS,
  ): Promise<{ outcome: RunOutcome; tests: TestsPayload | null }> {
    try {
      await this.ensureReady();
    } catch (e) {
      return { outcome: { kind: 'loadError', message: e instanceof Error ? e.message : String(e) }, tests: null };
    }
    const last = await this.execute({ type: 'runTests', code, tests, timeoutMs }, () => undefined, timeoutMs);
    if (last.type === 'testsResult' && last.payload) {
      try {
        const payload = JSON.parse(last.payload) as TestsPayload;
        return {
          outcome: payload.ok
            ? { kind: 'ok', stdout: payload.stdout ? [payload.stdout] : [], stderr: [], repr: null }
            : {
                kind: 'error',
                error: payload.error ?? { type: 'UnknownError', message: '?', lineno: 0 },
                stdout: payload.stdout ? [payload.stdout] : [],
                stderr: [],
              },
          tests: payload,
        };
      } catch {
        return {
          outcome: { kind: 'error', error: { type: 'WorkerError', message: 'bad payload', lineno: 0 }, stdout: [], stderr: [] },
          tests: null,
        };
      }
    }
    if (last.type === 'timeout') return { outcome: { kind: 'timeout' }, tests: null };
    return { outcome: { kind: 'stopped' }, tests: null };
  }

  async trace(code: string, timeoutMs = DEFAULT_RUN_TIMEOUT_MS): Promise<RunOutcome> {
    try {
      await this.ensureReady();
    } catch (e) {
      return { kind: 'loadError', message: e instanceof Error ? e.message : String(e) };
    }
    const last = await this.execute({ type: 'trace', code, timeoutMs }, () => undefined, timeoutMs);
    if (last.type === 'traceResult' && last.payload) {
      return { kind: 'ok', stdout: [last.payload], stderr: [], repr: 'trace' };
    }
    if (last.type === 'timeout') return { kind: 'timeout' };
    return { kind: 'stopped' };
  }

  /** User-facing Stop: terminate the worker, settle all pending as stopped. */
  stop(): void {
    this.terminateWorker();
    this.pending.forEach((p) => {
      clearTimeout(p.watchdog);
      p.onSettle({ type: 'stopped', id: '*' });
    });
    this.pending.clear();
    this.loadWaiters.clear();
    this.setStatus('idle');
  }

  private terminateWorker(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.everReady = false;
    }
  }
}

export const pythonRunner = new PyodideRunner();

// Dev diagnostics (harmless in prod): expose live runner state for E2E debugging.
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__pypathRunner = pythonRunner;
}
