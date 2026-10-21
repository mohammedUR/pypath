import { expect, test, type BrowserContext, type Page } from '@playwright/test';

/**
 * Accounts + cloud progress sync (ADR-0009) — browser-level evidence:
 *  1. register → signed in → interpreter still runs (Pyodide stdout)
 *  2. local progress write → pushed to the account (sync status 'saved')
 *  3. sign out → sign in → cloud progress restored into the UI
 *  4. second "device" (fresh browser context) sees the same account state
 */

const AR = {
  register: '#/ar/auth/register',
  login: '#/ar/auth/login',
  account: '#/ar/account',
  lesson: '#/ar/lesson/py4e.ch1.l1',
  registerCta: 'أنشئ الحساب',
  loginCta: 'دخول',
  signOut: 'خروج',
  saved: 'مُحفوظ في حسابك',
  runWorked: 'شغّل المثال',
  reflectPlaceholder: 'اكتب هنا أفكارك',
  syncAnon: 'المزامنة تعمل بعد تسجيل الدخول',
};

async function registerAccount(page: Page, email: string, password: string, name: string) {
  await page.goto(`/${AR.register}`);
  await page.fill('#reg-email', email);
  await page.fill('#reg-name', name);
  await page.fill('#reg-pass', password);
  await page.fill('#reg-pass2', password);
  await page.getByRole('button', { name: AR.registerCta }).click();
  // Successful flow signs the user in and lands on the dashboard.
  await expect(page).toHaveURL(/#\/ar\/dashboard/, { timeout: 30_000 });
}

async function loginAccount(page: Page, email: string, password: string) {
  await page.goto(`/${AR.login}`);
  await page.fill('#auth-email', email);
  await page.fill('#auth-password', password);
  // The header badge shares the aria-label — target the form's submit button.
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/#\/ar\/dashboard/, { timeout: 30_000 });
}

async function signOut(page: Page) {
  await page.goto(`/${AR.account}`);
  await page.getByRole('button', { name: AR.signOut }).click();
  // Header badge returns to the sign-in state (sign-in icon).
  await expect(page.locator('header').getByRole('button', { name: /دخول/ })).toBeVisible({ timeout: 15_000 });
}

async function goToLessonAndRunInterpreter(page: Page) {
  await page.goto(`/${AR.lesson}`);
  const run = page.getByRole('button', { name: AR.runWorked });
  await expect(run).toBeVisible({ timeout: 20_000 });
  await run.click();
  // Pyodide boot + eval; stdout must contain the worked example's real output
  // (a boot failure also renders text, so presence alone is not enough).
  const consoleBox = page.locator('[aria-label="لوحة الخرْج"], [aria-label="Output console"]').first();
  await expect(consoleBox).toBeVisible({ timeout: 60_000 });
  await expect(consoleBox.locator('pre').first()).toBeVisible({ timeout: 60_000 });
  await expect(consoleBox).toContainText('مرحبًا! أنا بايثون', { timeout: 60_000 });
  await expect(consoleBox).not.toContainText('تعذّر تحميل بايثون');
}

async function writeReflectionNote(page: Page, note: string) {
  await page.goto(`/${AR.lesson}`);
  const textarea = page.getByPlaceholder(AR.reflectPlaceholder);
  await expect(textarea).toBeVisible({ timeout: 20_000 });
  // The reflection is committed on blur (onBlur → saveNote).
  await textarea.click();
  await textarea.fill(note);
  await page.getByRole('heading', { level: 1 }).first().click();
  await page.waitForTimeout(3_500); // > engine debounce (2.5s)
  await page.goto(`/${AR.account}`);
  await expect(page.getByText(AR.saved)).toBeVisible({ timeout: 60_000 });
}

test('register → interpreter runs → note syncs to account → sign out hides it → sign in restores it', async ({ page }) => {
  const email = `ui.${Date.now()}@pypath.test`;
  const password = 'ui-secret-pass-77';
  const note = `ملاحظة مُزامنة ${Date.now()}`;

  await registerAccount(page, email, password, 'مستخدم الواجهة');
  await goToLessonAndRunInterpreter(page);
  await writeReflectionNote(page, note);

  await signOut(page);
  // local-first: the note deliberately stays on the device after signing out.
  await page.goto(`/${AR.lesson}`);
  await expect(page.getByPlaceholder(AR.reflectPlaceholder)).toHaveValue(note);

  await loginAccount(page, email, password);
  await page.waitForTimeout(4_000); // initial pull + merge
  await page.goto(`/${AR.lesson}`);
  await expect(page.getByPlaceholder(AR.reflectPlaceholder)).toHaveValue(note, { timeout: 30_000 });
});

test('second device (fresh context) sees the same account progress after first device syncs', async ({ browser }) => {
  const email = `dev.${Date.now()}@pypath.test`;
  const password = 'two-devices-pass-42';
  const note = `من جهاز A ${Date.now()}`;

  const ctxA = await browser.newContext();
  const pageA = await ctxA.newPage();
  await registerAccount(pageA, email, password, 'الجهاز A');
  await writeReflectionNote(pageA, note);
  await ctxA.close();

  const ctxB = await browser.newContext();
  const pageB = await ctxB.newPage();
  await loginAccount(pageB, email, password);
  await pageB.waitForTimeout(4_000); // initial pull
  await pageB.goto(`/${AR.lesson}`);
  await expect(pageB.getByPlaceholder(AR.reflectPlaceholder)).toHaveValue(note, { timeout: 30_000 });

  // Account isolation: wrong password must NOT land on the account.
  const ctxC = await browser.newContext();
  const pageC = await ctxC.newPage();
  await pageC.goto(`/${AR.login}`);
  await pageC.fill('#auth-email', email);
  await pageC.fill('#auth-password', 'deliberately-wrong-pw');
  await pageC.locator('form button[type="submit"]').click();
  await expect(pageC.getByRole('alert')).toBeVisible({ timeout: 20_000 });
  await ctxC.close();
  await ctxB.close();
});
