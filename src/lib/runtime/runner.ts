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
  /** Where the current worker booted its dist from (sticky for the session). */
  private assetSource: 'local' | 'cdn' = 'local';
  /** Serializes the boot ladder so concurrent runs share one attempt chain. */
  private booting: Promise<void> | null = null;
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
    w.addEventListener('message', (ev: MessageEvent<WorkerEvent>) => {
      const e = ev.data;
      if (e.type === 'loading' || e.type === 'ready' || e.type === 'loadError') {
        if (e.type === 'loading') this.setStatus('loading', e.phase);
        if (e.type === 'ready') {
          this.everReady = true;
          this.setStatus('idle');
        }
        if (e.type === 'loadError') {
          this.setStatus('idle');
        }
        // Only terminal load signals settle an attempt: a 'loading' event
        // (download/boot phases) must NOT resolve the waiter, otherwise the
        // ladder terminates a perfectly healthy worker mid-boot.
        if (e.type === 'ready' || e.type === 'loadError') {
          this.loadWaiters.forEach((cb) => cb(e));
          this.loadWaiters.clear();
        }
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
   * A previous load failure no longer poisons the session: the boot ladder
   * retries (cache purge, then the pinned CDN) on the next preload/run.
   */
  preload(): void {
    if (this.everReady) return;
    void this.ensureReady().catch(() => undefined);
  }

  private waitForLoadSignal(timeoutMs: number): Promise<WorkerEvent> {
    return new Promise((resolve) => {
      let timer: ReturnType<typeof setTimeout>;
      const cb = (e: WorkerEvent) => {
        if (e.type !== 'ready' && e.type !== 'loadError') return;
        clearTimeout(timer);
        this.loadWaiters.delete(cb);
        resolve(e);
      };
      timer = setTimeout(() => {
        this.loadWaiters.delete(cb);
        resolve({ type: 'loadError', message: 'runtime load timeout' });
      }, timeoutMs);
      this.loadWaiters.add(cb);
    });
  }

  /** Best-effort: drop poisoned Cache Storage entries (stale/mismatched vendor
   * assets). The offline shell re-populates on the next navigations.
   */
  private async purgeBootCaches(): Promise<void> {
    try {
      if (typeof caches === 'undefined') return;
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {
      /* best effort — the next attempt still runs */
    }
  }

  private async bootAttempt(source: 'local' | 'cdn', timeoutMs: number): Promise<WorkerEvent> {
    this.terminateWorker();
    this.setStatus('loading', 'download');
    // Register the waiter BEFORE kicking the worker so a very fast
    // ready/loadError cannot be missed.
    const wait = this.waitForLoadSignal(timeoutMs);
    const w = this.ensureWorker();
    w.postMessage({ type: 'load', id: 'load-kick', source });
    return wait;
  }

  /** Boot ladder: self-hosted → (purge caches) self-hosted → pinned CDN.
   * The versioned asset path plus this ladder makes a stale or mismatched
   * Pyodide dist self-heal instead of surfacing "exit(1)" forever.
   */
  private async bootLadder(timeoutMs: number): Promise<void> {
    const plan: Array<'local' | 'cdn'> =
      this.assetSource === 'cdn' ? ['cdn'] : ['local', 'local', 'cdn'];
    let lastMessage = 'runtime load failed';
    for (let i = 0; i < plan.length; i += 1) {
      if (i === 1) await this.purgeBootCaches();
      const ev = await this.bootAttempt(plan[i], timeoutMs);
      if (ev.type === 'ready') {
        this.assetSource = plan[i];
        this.everReady = true;
        return;
      }
      if (ev.type === 'loadError') lastMessage = ev.message;
    }
    throw new Error(lastMessage);
  }

  /** Resolves once Pyodide is usable; rejects with the last load error message.
   * Boot attempts are serialized: concurrent runs/preloads join one ladder.
   */
  async ensureReady(timeoutMs = 60000): Promise<void> {
    if (this.everReady) return;
    if (!this.booting) {
      this.booting = this.bootLadder(timeoutMs).finally(() => {
        this.booting = null;
      });
    }
    return this.booting;
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
