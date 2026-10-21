/**
 * PyPath Pyodide worker — served as a STATIC asset (public/pyodide-worker.js).
 * Self-contained classic worker by design: `importScripts` must stay available,
 * so the bundler never touches this file (Turbopack worker-chunk 404 workaround,
 * see worklog Task 5 + ADR-0002 amendment).
 *
 * Protocol (src/lib/runtime/protocol.ts):
 *   in : {type:'run'|'runTests'|'trace', id, code, tests?, timeoutMs?}
 *   out: {type:'loading'|'ready'|'loadError'|'stdout'|'stderr'|'result'|'testsResult'|'traceResult'|'timeout'|'done', ...}
 */

const ctx = self;

// Self-hosted (ADR-0002): no CDN dependency — works offline once cached.
const PYODIDE_URL = '/vendor/pyodide/pyodide.js';
const PYODIDE_INDEX = '/vendor/pyodide/';

/* ------------------------------------------------------------------ */
/* Python harness (installed once at boot) — every entry returns JSON   */
/* ------------------------------------------------------------------ */

const SETUP_PY = `
import sys, json, io, contextlib, traceback

def __pypath_error(e):
    return {
        'type': type(e).__name__,
        'message': str(e),
        'lineno': getattr(e, 'lineno', 0) or 0,
        'traceback': traceback.format_exc(limit=8),
    }

def __pypath_run(code):
    try:
        code_obj = compile(code, '<lesson>', 'exec')
    except SyntaxError as e:
        err = __pypath_error(e)
        err['message'] = str(e.msg)
        return json.dumps({'ok': False, 'repr': None, 'error': err})
    g = {'__name__': '__main__'}
    try:
        exec(code_obj, g)
        return json.dumps({'ok': True, 'repr': None, 'error': None})
    except BaseException as e:
        return json.dumps({'ok': False, 'repr': None, 'error': __pypath_error(e)})

def __pypath_run_tests(code, tests_json):
    env = {'__name__': '__main__'}
    buf = io.StringIO()
    try:
        code_obj = compile(code, '<lesson>', 'exec')
    except SyntaxError as e:
        err = __pypath_error(e)
        err['message'] = str(e.msg)
        return json.dumps({'ok': False, 'error': err, 'tests': [], 'stdout': ''})
    try:
        with contextlib.redirect_stdout(buf):
            exec(code_obj, env)
    except BaseException as e:
        return json.dumps({'ok': False, 'error': __pypath_error(e), 'tests': [], 'stdout': buf.getvalue()})
    env['__learner_output__'] = buf.getvalue()
    results = []
    for t in json.loads(tests_json):
        try:
            exec(compile(t['code'], '<test>', 'exec'), env)
            results.append({'id': t['id'], 'name': t['name'], 'passed': True, 'message': ''})
        except AssertionError as e:
            results.append({'id': t['id'], 'name': t['name'], 'passed': False, 'message': str(e) or 'assertion failed'})
        except BaseException as e:
            results.append({'id': t['id'], 'name': t['name'], 'passed': False, 'message': type(e).__name__ + ': ' + str(e)})
    return json.dumps({'ok': True, 'error': None, 'tests': results, 'stdout': buf.getvalue()})

def __pypath_trace(code, max_steps=200):
    steps = []
    state = {'truncated': False, 'error': None}
    filename = '<pypath_lesson>'
    try:
        code_obj = compile(code, filename, 'exec')
    except SyntaxError as e:
        err = __pypath_error(e)
        err['message'] = str(e.msg)
        return json.dumps({'steps': [], 'truncated': False, 'error': err, 'stdout': ''})
    buf = io.StringIO()
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != filename:
            return None
        if len(steps) >= max_steps:
            state['truncated'] = True
            return None
        if event == 'line' or event == 'return':
            locs = {}
            for k, v in list(frame.f_locals.items())[:10]:
                try:
                    r = repr(v)
                    if len(r) > 60:
                        r = r[:57] + '...'
                    locs[k] = [type(v).__name__, r]
                except Exception:
                    locs[k] = ['?', '?']
            steps.append({'line': frame.f_lineno, 'event': event, 'locals': locs})
        return tracer
    try:
        sys.settrace(tracer)
        with contextlib.redirect_stdout(buf):
            exec(code_obj, {'__name__': '__main__'})
    except BaseException as e:
        state['error'] = __pypath_error(e)
    finally:
        sys.settrace(None)
    return json.dumps({'steps': steps, 'truncated': state['truncated'], 'error': state['error'], 'stdout': buf.getvalue()})
`;

/* ------------------------- worker state ------------------------- */

let pyodide = null;
let loading = false;
let currentId = null;
let deadline = 0;

function emit(msg) {
  ctx.postMessage(msg);
}

async function ensurePyodide() {
  if (pyodide || loading) return;
  loading = true;
  console.log('[pypath-worker] boot start');
  emit({ type: 'loading', phase: 'download' });
  try {
    ctx.importScripts(PYODIDE_URL);
    console.log('[pypath-worker] importScripts OK, loadPyodide =', typeof loadPyodide);
  } catch (e) {
    console.log('[pypath-worker] importScripts FAILED', e);
    loading = false;
    emit({ type: 'loadError', message: 'importScripts failed: ' + (e && e.message ? e.message : String(e)) });
    return;
  }
  emit({ type: 'loading', phase: 'boot' });
  console.log('[pypath-worker] loadPyodide starting');
  try {
    pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX });
    console.log('[pypath-worker] loadPyodide DONE');
  } catch (e) {
    console.log('[pypath-worker] loadPyodide FAILED', e);
    loading = false;
    emit({ type: 'loadError', message: 'loadPyodide failed: ' + (e && e.message ? e.message : String(e)) });
    return;
  }
  // Preload sqlite3 (vendored wheel from the pinned 0.27.7 dist, sha256-verified
  // against pyodide-lock.json) so lesson code can `import sqlite3` offline.
  // Non-fatal: if the wheel is missing, SQL lessons fall back to their simulated-DB framing.
  try {
    await pyodide.loadPackage('sqlite3');
    console.log('[pypath-worker] sqlite3 package LOADED');
  } catch (e) {
    console.log('[pypath-worker] sqlite3 preload skipped:', e && e.message ? e.message : String(e));
  }
  // Preload the platform minigrad module (M3, ADR-0002 amendment) into the
  // Pyodide FS so lesson code can `import minigrad` offline. Non-fatal: AI
  // lessons fall back to their scratch/simulated framing if the fetch fails.
  try {
    const mgRes = await ctx.fetch('/py-modules/minigrad.py');
    const mgSrc = await mgRes.text();
    if (!mgRes.ok) throw new Error('fetch /py-modules/minigrad.py -> ' + mgRes.status);
    pyodide.FS.writeFile('/home/pyodide/minigrad.py', mgSrc);
    console.log('[pypath-worker] minigrad module INSTALLED');
  } catch (e) {
    console.log('[pypath-worker] minigrad preload skipped:', e && e.message ? e.message : String(e));
  }
  pyodide.setStdout({
    batched: (text) => {
      // Deadline check between output events: throwing here propagates into
      // Python and interrupts printing programs.
      if (deadline > 0 && Date.now() > deadline) {
        deadline = 0;
        throw new Error('PyPathDeadline: run exceeded its time limit');
      }
      emit({ type: 'stdout', id: currentId, text: text });
    },
  });
  pyodide.setStderr({
    batched: (text) => {
      emit({ type: 'stderr', id: currentId, text: text });
    },
  });
  pyodide.runPython(SETUP_PY);
  loading = false;
  emit({ type: 'ready' });
}

function callHarness(fnName, args) {
  if (!pyodide) throw new Error('pyodide not ready');
  const fn = pyodide.globals.get(fnName);
  if (typeof fn !== 'function') throw new Error('missing harness ' + fnName);
  try {
    return fn.apply(null, args);
  } finally {
    if (fn && typeof fn.destroy === 'function') fn.destroy();
  }
}

ctx.addEventListener('message', (ev) => {
  const msg = ev.data;

  // Kick message: start (or join) Pyodide boot without running user code.
  if (msg && msg.type === 'load') {
    ensurePyodide().catch((e) => {
      emit({ type: 'loadError', message: (e && e.message) ? e.message : String(e) });
    });
    return;
  }

  (async () => {
    try {
      await ensurePyodide();
    } catch (e) {
      emit({ type: 'loadError', message: (e && e.message) ? e.message : String(e) });
      return;
    }
    if (!pyodide) return; // loadError already emitted
    if (!msg || typeof msg.id !== 'string') return;
    if (msg.type !== 'run' && msg.type !== 'runTests' && msg.type !== 'trace') return;

    currentId = msg.id;
    deadline = Date.now() + (msg.timeoutMs || 10000);
    try {
      if (msg.type === 'run') {
        const res = JSON.parse(callHarness('__pypath_run', [msg.code]));
        emit({ type: 'result', id: msg.id, ok: res.ok, repr: res.repr === undefined ? null : res.repr, error: res.error === undefined ? null : res.error });
      } else if (msg.type === 'runTests') {
        const payload = callHarness('__pypath_run_tests', [msg.code, JSON.stringify(msg.tests || [])]);
        emit({ type: 'testsResult', id: msg.id, payload: payload, error: null });
      } else if (msg.type === 'trace') {
        const payload = callHarness('__pypath_trace', [msg.code]);
        emit({ type: 'traceResult', id: msg.id, payload: payload, error: null });
      }
    } catch (e) {
      const msgText = (e && e.message) ? e.message : String(e);
      if (msgText.includes('PyPathDeadline')) {
        emit({ type: 'timeout', id: msg.id });
      } else {
        emit({
          type: 'result',
          id: msg.id,
          ok: false,
          repr: null,
          error: { type: 'WorkerError', message: msgText, lineno: 0 },
        });
      }
    } finally {
      deadline = 0;
      currentId = null;
      emit({ type: 'done', id: msg.id });
    }
  })();
});
