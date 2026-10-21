import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
const b = await chromium.launch();
const page = await b.newPage();
await page.goto('http://localhost:3000/#/en/settings');
await page.waitForTimeout(3000);
const res = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag22aa']).analyze();
for (const v of res.violations) {
  console.log('==', v.id, v.impact);
  for (const n of v.nodes) console.log(n.html.slice(0, 300));
}
await b.close();
