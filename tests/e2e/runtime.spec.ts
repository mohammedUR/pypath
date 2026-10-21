import { expect, test } from '@playwright/test';
import { PYODIDE_VERSION } from '../../src/lib/runtime/protocol';

/**
 * Runtime guard (ADR-0002): the versioned Pyodide dist must be served intact
 * and the interpreter must boot and run code. A missing/mismatched
 * `python_stdlib.zip` or wasm turns the boot into the production
 * "Program terminated with exit(1)" failure.
 */

const BASE = `/vendor/pyodide/${PYODIDE_VERSION}/`;

test('versioned Pyodide assets are served as real binaries (not HTML)', async ({ request }) => {
  for (const file of ['pyodide.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
    const res = await request.head(`${BASE}${file}`);
    expect(res.status(), `${file} status`).toBe(200);
    const type = res.headers()['content-type'] ?? '';
    expect(type, `${file} content-type`).not.toContain('text/html');
  }

  const stdlib = await request.get(`${BASE}python_stdlib.zip`);
  expect(stdlib.status()).toBe(200);
  const magic = (await stdlib.body()).subarray(0, 2).toString('latin1');
  expect(magic, 'stdlib is a real zip').toBe('PK');
});

test('interpreter boots and runs the worked example', async ({ page }) => {
  const csp = await page.request.get('/');
  expect(csp.headers()['content-security-policy'] ?? '').toContain('cdn.jsdelivr.net');

  await page.goto('/#/ar/lesson/py4e.ch1.l1');
  const run = page.getByRole('button', { name: 'شغّل المثال' });
  await expect(run).toBeVisible({ timeout: 20_000 });
  await run.click();
  const consoleBox = page.locator('[aria-label="لوحة الخرْج"], [aria-label="Output console"]').first();
  await expect(consoleBox.locator('pre').first()).toBeVisible({ timeout: 60_000 });
  // Assert real Python output, not merely that some <pre> exists: a failed
  // boot also renders a message, which previously masked the 0.27.x
  // Chromium incompatibility (init_fs_encoding → exit(1)).
  await expect(consoleBox).toContainText('مرحبًا! أنا بايثون', { timeout: 60_000 });
  await expect(consoleBox).toContainText('5', { timeout: 60_000 });
  await expect(consoleBox).not.toContainText('تعذّر تحميل بايثون');
  await expect(consoleBox).not.toContainText('load error');
});
