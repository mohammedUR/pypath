import { expect, test } from '@playwright/test';

/**
 * Phase 2 runtime reliability (LAB-001/002/003 + stop()/lifecycle):
 *  - purgeBootCaches must NEVER drop the app's pypath-v*-shell/assets caches.
 *  - concurrent run/trace requests during a cold boot must all be served
 *    (no silent drops from the worker boot race).
 *  - stop() during boot settles pending callers promptly with 'stopped',
 *    returns the runner to idle, and a later run still works (fresh worker;
 *    stale events from the terminated worker are generation-guarded).
 *  - useTracer sets its failed state when the traced code raises (UI path).
 */

interface RunnerProbe {
  run(code: string): Promise<{ kind: string; stdout?: string[]; stderr?: string[] }>;
  trace(code: string): Promise<{ kind: string; stdout?: string[] }>;
  stop(): void;
  getStatus(): string;
  purgeBootCaches(): Promise<void>;
}

async function runnerOf(page: import('@playwright/test').Page) {
  // The runner module (and its window.__pypathRunner probe) loads lazily with
  // the lesson lab — wait for it instead of racing the initial render.
  await page.waitForFunction(
    () => Boolean((window as unknown as { __pypathRunner?: unknown }).__pypathRunner),
    undefined,
    { timeout: 30_000 },
  );
}

test('purgeBootCaches preserves pypath-v* app caches and drops only stray ones (LAB-001)', async ({ page }) => {
  await page.goto('/#/ar/lesson/py4e.ch1.l1');
  await runnerOf(page);
  const kept = await page.evaluate(async () => {
    const w = window as unknown as { __pypathRunner: RunnerProbe };
    await caches.delete('pyodide-v0.28-stray');
    await caches.open('pypath-v5-shell');
    await caches.open('pypath-v5-assets');
    await caches.open('pyodide-v0.28-stray');
    await w.__pypathRunner.purgeBootCaches();
    const keys = await caches.keys();
    await caches.delete('pyodide-v0.28-stray'); // cleanup probe entry
    return keys;
  });
  expect(kept, 'app shell cache survived the purge').toContain('pypath-v5-shell');
  expect(kept, 'app assets cache survived the purge').toContain('pypath-v5-assets');
  expect(kept, 'stray (non-app) cache was purged').not.toContain('pyodide-v0.28-stray');
});

test('concurrent requests during cold boot are served, not dropped (LAB-002)', async ({ page }) => {
  await page.goto('/#/ar/lesson/py4e.ch1.l1');
  await runnerOf(page);
  const kinds = await page.evaluate(async () => {
    const r = (window as unknown as { __pypathRunner: RunnerProbe }).__pypathRunner;
    r.stop(); // force a cold boot for this probe
    const [a, b, c] = await Promise.all([
      r.run('print(1)'),
      r.run('print(2)'),
      r.trace('x = 1\nprint(x)'),
    ]);
    return { a: a.kind, b: b.kind, c: c.kind };
  });
  expect(kinds.a).toBe('ok');
  expect(kinds.b).toBe('ok');
  expect(kinds.c).toBe('ok');
});

test('stop() during boot settles callers promptly, resets to idle, and recovers', async ({ page }) => {
  await page.goto('/#/ar/lesson/py4e.ch1.l1');
  await runnerOf(page);
  const probe = await page.evaluate(async () => {
    const r = (window as unknown as { __pypathRunner: RunnerProbe }).__pypathRunner;
    r.stop();
    const pending = r.run('print(42)');
    const t0 = Date.now();
    r.stop(); // cancel while the boot ladder is still loading
    const outcome = await pending;
    const settleMs = Date.now() - t0;
    const statusAfter = r.getStatus();
    const again = await r.run('print(43)');
    return {
      kind: outcome.kind,
      settleMs,
      statusAfter,
      againKind: again.kind,
      againOut: (again.stdout ?? []).join(''),
    };
  });
  expect(probe.kind, 'cancelled boot surfaces as stopped').toBe('stopped');
  expect(probe.settleMs, 'settled immediately, not after a 60s load timeout').toBeLessThan(5000);
  expect(probe.statusAfter).toBe('idle');
  expect(probe.againKind, 'runner recovered with a fresh worker').toBe('ok');
  expect(probe.againOut).toContain('43');
});

test('tracer shows the failed state when traced code raises (LAB-003)', async ({ page }) => {
  await page.goto('/#/ar/lesson/py4e.ch1.l1');

  // Lab column (desktop layout) hosts the StepVisualizer; its editor is a
  // plain textarea (aria-label from CodeEditor).
  const editor = page.locator('textarea[aria-label="المختبر"]');
  await expect(editor).toBeVisible({ timeout: 20_000 });
  await editor.fill("raise ValueError('boom')");

  await page.getByRole('button', { name: 'تتبّع التنفيذ' }).click();
  // Before the fix, `failed` was always false and this message never rendered.
  await expect(page.getByText('تعذّر التتبّع (خطأ في الكود)', { exact: false })).toBeVisible({ timeout: 60_000 });
});
