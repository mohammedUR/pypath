import { expect, test, type Page } from '@playwright/test';

async function seedPartICompletion(page: Page) {
  const partIIds = await page.evaluate(async () => {
    const response = await fetch('/data/manifest.json');
    const data = (await response.json()) as { lessons: { id: string; part: string }[] };
    return data.lessons.filter((lesson) => lesson.part === 'I').map((lesson) => lesson.id);
  });

  await page.evaluate(async (completedLessons) => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('pypath', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('pypath-progress')) {
          request.result.createObjectStore('pypath-progress');
        }
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('pypath-progress', 'readwrite');
        tx.objectStore('pypath-progress').put(
          JSON.stringify({ state: { completedLessons }, version: 1 }),
          'progress:local',
        );
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
    });
  }, partIIds);

  await page.reload();
}

test('Part II lesson cannot be opened by deep link before Part I is complete', async ({ page }) => {
  await page.goto('/#/ar/lesson/swe.ch13.l1');
  await expect(page.getByText('الجزء الثاني مُغلق حاليًا')).toBeVisible();
  await expect(page.getByText('عندما يكتب الذكاء الاصطناعي الشيفرة: ما يتغيّر وما لا يتغيّر')).toHaveCount(0);
});

test('path groups Part I by book and chapter', async ({ page }) => {
  await page.goto('/#/ar/path');
  await expect(page.getByRole('heading', { name: 'PY4E', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'SWE', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /الجزء الثاني/ })).toBeVisible();
});

test('Part II becomes browsable and readable after all Part I lessons are complete', async ({ page }) => {
  await page.goto('/#/ar/path');
  await seedPartICompletion(page);

  await expect(page.getByText(/أكملت الجزء الأول/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MLS', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'D2L', exact: true })).toBeVisible();

  await page.goto('/#/ar/lesson/swe.ch13.l1');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('عندما يكتب الذكاء الاصطناعي الشيفرة');
});

test('dashboard continue follows the unlocked curriculum into Part II', async ({ page }) => {
  await page.goto('/#/ar/dashboard');
  await seedPartICompletion(page);
  await expect(page.getByText('المشتقات والنزول التدريجي').first()).toBeVisible();

  await page.getByRole('button', { name: 'أكمل الدرس' }).first().click();
  await expect(page).toHaveURL(/#\/ar\/lesson\/mls\.appendix\.l1/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('المشتقات والنزول التدريجي');
});

test('enforced certification gate still holds Part II closed until certified', async ({ page }) => {
  await page.goto('/#/ar/path');
  await seedPartICompletion(page);

  await page.evaluate(() => {
    localStorage.setItem(
      'pypath.certification',
      JSON.stringify({ state: { gateMode: 'enforced', attempts: [] }, version: 1 }),
    );
  });
  await page.reload();
  await expect(page.getByText(/يتبقى استيفاء بوابة الاعتماد فقط/)).toBeVisible();
  await expect(page.getByText(/وضع الفرض مُفعّل/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MLS', exact: true })).toHaveCount(0);

  await page.evaluate(() => {
    const attempts = [{ ts: Date.now(), score: 1, passed: true }];
    const capstoneArtifacts = Object.fromEntries(
      ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'].map((id) => [id, true]),
    );
    const capstoneRubric = Object.fromEntries(
      ['r1', 'r2', 'r3', 'r4', 'r5'].map((id) => [id, 3]),
    );
    localStorage.setItem(
      'pypath.certification',
      JSON.stringify({
        state: { gateMode: 'enforced', attempts, capstoneArtifacts, capstoneRubric },
        version: 1,
      }),
    );
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'MLS', exact: true })).toBeVisible();
});
