import { expect, test } from '@playwright/test';
import { EXAM_ITEMS } from '../../content/exam/python-professional';
import { seedPartICompletion } from './helpers';

/**
 * Exam → certification → signed certificate proof (R-GAM-02, OQ-7).
 * Answers are looked up from the real item bank, so the attempt passes
 * deterministically (16/16), unlocking the capstone certificate card and
 * the WebCrypto ECDSA P-256 signing flow end-to-end. Since Phase 3
 * (CERT-001, Option 1) the certificate additionally requires ALL 163 Part I
 * lessons completed — seeded up front here.
 */

const DRAW = 16;

test('passing the exam and capstone issues a verifiable signed proof', async ({ page }) => {
  test.setTimeout(180_000);

  // 0) CERT-001: seed full Part I completion (163/163) first.
  await page.goto('/#/ar/path');
  await seedPartICompletion(page);
  await expect(page.getByText(/أكملت الجزء الأول/)).toBeVisible({ timeout: 20_000 });

  // 1) Exam: draw 16, answer all correctly from the bank.
  await page.goto('/#/ar/exam');
  await page.getByRole('button', { name: 'ابدأ المحاولة' }).click();
  const bank = new Map(EXAM_ITEMS.map((it) => [it.q.ar, it]));
  for (let i = 0; i < DRAW; i++) {
    const qText = (await page.locator('p.text-base.font-medium').innerText()).trim();
    const item = bank.get(qText);
    if (!item) throw new Error(`Drawn question not found in bank: ${qText}`);
    const answerText = item.options.find((o) => o.id === item.answer)!.text.ar;
    await page.getByRole('button', { name: answerText, exact: true }).click();
    if (i < DRAW - 1) {
      await page.getByRole('button', { name: 'التالي', exact: true }).click();
    } else {
      await page.getByRole('button', { name: 'إنهاء وتسليم', exact: true }).click();
    }
  }
  await expect(page.getByText(/النتيجة: 100٪/)).toBeVisible();

  // 2) Capstone: full artifacts + top rubric → readiness 100 → certified.
  await page.goto('/#/ar/capstone');
  await expect(page.getByText('الجاهزية والاعتماد')).toBeVisible();
  const boxes = page.locator('input[type="checkbox"]');
  await expect(boxes).toHaveCount(6);
  for (let i = 0; i < 6; i++) await boxes.nth(i).check();
  // rubric: five groups × buttons 0..3 → set every criterion to 3
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: '3', exact: true }).nth(i).click();
  }
  await expect(page.getByText(/اكتملت بوابة Part I/)).toBeVisible();

  // 3) Issue the signed proof and verify it inline.
  await page.getByLabel('الاسم').fill('متحدث الاختبار');
  await page.getByRole('button', { name: 'إصدار وتحميل الإثبات الموقّع' }).click();
  await expect(page.getByText(/التوقيع صالح والبوابات مستوفاة/)).toBeVisible();
  await expect(page.getByText(/آخر إصدار:/)).toBeVisible();
});

test('certificate verify flow rejects a tampered payload', async ({ page }) => {
  // Build a proof-shaped file with a broken signature and feed it to the
  // offline verifier through the file input.
  const badProof = {
    payload: {
      v: 2,
      kind: 'pypath.certificate',
      subject: 'forger',
      issuedAt: 1,
      exam: { best: 1, attempts: 1, passed: true, passMark: 0.8 },
      capstone: { readiness: 100, artifactsDone: 6, artifactsTotal: 6, rubricTotal: 15, rubricMax: 15 },
      curriculum: { completed: 1, total: 258 },
      platform: { name: 'pypath', gate: 'part1' },
    },
    signature: 'QUFBQQ==', // not a real signature over this payload
    publicKey: { crv: 'P-256', kty: 'EC', x: 'AA', y: 'AA' },
    alg: 'ECDSA_P256_SHA256',
  };
  await page.goto('/#/ar/capstone');
  await page.getByRole('button', { name: 'اختيار ملف والتحقق' }).click();
  await page.setInputFiles('input[type="file"]', {
    name: 'forged.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(badProof)),
  });
  await expect(page.getByText(/✗ التحقق فشل/)).toBeVisible();
});
