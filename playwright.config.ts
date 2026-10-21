import { defineConfig } from '@playwright/test';

/**
 * Playwright E2E — R-ARC-05 closure (M6+).
 * Runs against the dev server (reuseExistingServer) with the cached
 * chromium. Specs: smoke flows, exam→certificate signing, axe scans
 * (LTR/RTL × light/dark) for both locales.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
