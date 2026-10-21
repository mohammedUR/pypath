import { expect, test } from '@playwright/test';

/**
 * Visual regression LTR/RTL — R-ARC-05 closure.
 * Baselines are generated on first run (`--update-snapshots`); later runs
 * diff against them. Full-page shots of the dashboard in AR (RTL) and EN
 * (LTR), light theme, 1280×720.
 */

test.use({ viewport: { width: 1280, height: 720 } });

test('dashboard AR (RTL) visual baseline', async ({ page }) => {
  await page.goto('/#/ar/dashboard');
  await expect(page.locator('h1').first()).toBeVisible();
  // settle animations / dynamic manifest fetch before snapshotting
  await page.waitForTimeout(1200);
  await expect(page).toHaveScreenshot('dashboard-ar.png', { fullPage: true });
});

test('dashboard EN (LTR) visual baseline', async ({ page }) => {
  await page.goto('/#/en/dashboard');
  await expect(page.locator('h1').first()).toBeVisible();
  await page.waitForTimeout(1200);
  await expect(page).toHaveScreenshot('dashboard-en.png', { fullPage: true });
});
