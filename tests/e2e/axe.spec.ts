import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * axe accessibility scans — a11y CI closure (R-ARC-05/a11y).
 * CSP already allows 'unsafe-inline' script-src, so axe injection works
 * without bypassing the policy. Both locales (RTL + LTR) are scanned;
 * serious/critical violations fail the suite, moderate ones are listed.
 */

async function scan(page: import('@playwright/test').Page, url: string) {
  await page.goto(url);
  await expect(page.locator('h1').first()).toBeVisible();
  const builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']);
  return builder.analyze();
}

function seriousCritical(violations: { id: string; impact?: string | null }[]) {
  return violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

const PAGES: [string, string][] = [
  ['dashboard', '/#/ar/dashboard'],
  ['path', '/#/ar/path'],
  ['exam', '/#/ar/exam'],
  ['capstone', '/#/ar/capstone'],
  ['settings', '/#/ar/settings'],
  ['coverage', '/#/ar/coverage'],
  ['dashboard-en', '/#/en/dashboard'],
  ['path-en', '/#/en/path'],
  ['settings-en', '/#/en/settings'],
];

for (const [name, url] of PAGES) {
  test(`axe: ${name} has no serious/critical violations`, async ({ page }) => {
    const results = await scan(page, url);
    const bad = seriousCritical(results.violations);
    const summary = results.violations
      .map((v) => `${v.id}[${v.impact}]`)
      .join(', ');
    if (results.violations.length > 0) console.log(`[${name}] violations: ${summary}`);
    expect(bad, `serious/critical on ${name}: ${bad.map((v) => v.id).join(', ')}`).toEqual([]);
  });
}
