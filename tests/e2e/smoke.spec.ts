import { expect, test } from '@playwright/test';

/**
 * Smoke — core shell flows in both locales (hash routes per ADR-0007).
 */

test('dashboard renders in AR by default with RTL direction', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page).toHaveURL(/#\/ar\/dashboard/);
});

test('EN deep link renders EN and LTR', async ({ page }) => {
  await page.goto('/#/en/dashboard');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test('path view lists Part I chapters and locked Part II world', async ({ page }) => {
  await page.goto('/#/ar/path');
  await expect(page.getByRole('heading', { name: /الجزء الثاني|مسار|خريطة/ }).first()).toBeVisible();
  await expect(page.getByText(/الجزء الثاني — الذكاء الاصطناعي/).first()).toBeVisible();
});

test('coverage page reports 100%', async ({ page }) => {
  await page.goto('/#/ar/coverage');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.getByText(/100(\.0)?\s*٪|100(\.0)?\s*%/).first()).toBeVisible();
});

test('locale toggle switches direction without reload', async ({ page }) => {
  await page.goto('/#/ar/settings');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  // click the EN radio in the language card
  await page.getByRole('radio').nth(1).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page).toHaveURL(/#\/en\/settings/);
});
