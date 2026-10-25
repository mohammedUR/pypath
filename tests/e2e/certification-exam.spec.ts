import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { EXAM_ITEMS, type ExamItem } from '../../content/exam/python-professional';
import {
  seedPartIProgress,
  seedCertification,
  readCertification,
  gotoHashRoute,
  CANONICAL_ARTIFACT_IDS,
} from './helpers';

/**
 * Phase 3 gates (CERT-001/002/003, EXAM-001/002, CAP-001):
 *  - the certificate stays locked until all 163 Part I lessons are complete,
 *  - a genuine proof verifies while any tampered/forged payload fails,
 *  - an exam session submits exactly once (button, double-click, timer),
 *    draws 16 unique balanced questions, and 13/16 passes vs 12/16 failing,
 *  - capstone readiness counts only the 6 canonical artifact ids.
 */

const DRAW = 16;

async function seededCapstone(
  page: Page,
  opts: { skipLessons?: string[]; artifactIds?: readonly string[]; attemptsScore?: number | null },
): Promise<void> {
  // One deterministic boot at the target route: land on the app, seed BOTH
  // stores in place, then a single hash-route reload picks everything up.
  if (!/^https?:/i.test(page.url())) await page.goto('/');
  await seedCertification(page, {
    attempts:
      opts.attemptsScore === null || opts.attemptsScore === undefined
        ? []
        : [{ ts: Date.now(), score: opts.attemptsScore, passed: opts.attemptsScore >= 0.8 }],
    artifactIds: opts.artifactIds ?? CANONICAL_ARTIFACT_IDS,
    rubricScore: 3,
    subject: 'متلقي الاختبار',
  });
  await seedPartIProgress(page, opts.skipLessons ?? []);
  await gotoHashRoute(page, '#/ar/capstone');
  await expect(page.getByRole('heading', { name: /الكابستون: مشروع الفريق الفردي/ })).toBeVisible({
    timeout: 30_000,
  });
}

/** Walk one full exam attempt answering `correctCount` of 16 correctly. */
async function runExamAttempt(page: Page, correctCount: number): Promise<void> {
  await page.goto('/#/ar/exam');
  // Hash-only gotos are no-ops (e.g. re-running after a finished attempt on
  // the same URL) — force a fresh mount so the intro screen is back.
  await page.reload();
  await page.getByRole('button', { name: 'ابدأ المحاولة' }).click();
  // Wait until the attempt is really running (post-reload clicks can race
  // React hydration otherwise).
  await expect(page.getByText('السؤال 1 من 16')).toBeVisible({ timeout: 30_000 });
  const bank = new Map(EXAM_ITEMS.map((it) => [it.q.ar, it]));
  const questions: string[] = [];
  for (let i = 0; i < DRAW; i++) {
    const qText = (await page.locator('p.text-base.font-medium').innerText()).trim();
    questions.push(qText);
    const item = bank.get(qText);
    if (!item) throw new Error(`Drawn question not found in bank: ${qText}`);
    const pickCorrect = i < correctCount;
    const optionId = pickCorrect ? item.answer : item.answer === 'a' ? 'b' : 'a';
    const answerText = item.options.find((o) => o.id === optionId)!.text.ar;
    await page.getByRole('button', { name: answerText, exact: true }).click();
    if (i < DRAW - 1) {
      await page.getByRole('button', { name: 'التالي', exact: true }).click();
    }
  }
  // stash drawn questions on the page object for distribution assertions
  (page as unknown as { __drawn?: string[] }).__drawn = questions;
}

/* ------------------------------ CERT-001 ------------------------------ */

test('CERT-001: certificate LOCKED at 162/163 Part I lessons despite exam pass + full capstone', async ({ page }) => {
  await page.goto('/#/ar/path');
  const partIIds = await page.evaluate(async () => {
    const r = await fetch('/data/manifest.json');
    const d = (await r.json()) as { lessons: { id: string; part: string }[] };
    return d.lessons.filter((l) => l.part === 'I').map((l) => l.id);
  });
  await seededCapstone(page, { skipLessons: [partIIds[partIIds.length - 1]], attemptsScore: 0.875 });

  await expect(page.getByText(`دروس الجزء الأول: 162 / 163`)).toBeVisible();
  await expect(page.getByText(/يُفتح إصدار الشهادة الموقّعة/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إصدار وتحميل الإثبات الموقّع' })).toHaveCount(0);
  await expect(page.getByText(/اكتملت بوابة Part I/)).toHaveCount(0);
});

test('CERT-001: certificate unlocks at 163/163 with exam pass + full capstone', async ({ page }) => {
  await seededCapstone(page, { attemptsScore: 0.875 });
  await expect(page.getByText('دروس الجزء الأول: 163 / 163 ✓')).toBeVisible();
  await expect(page.getByText(/اكتملت بوابة Part I/)).toBeVisible();
  const issue = page.getByRole('button', { name: 'إصدار وتحميل الإثبات الموقّع' });
  await expect(issue).toBeVisible();
  await expect(issue).toBeEnabled();
});

test('CERT-001/003: issuance impossible with a failing exam (< 13/16) even at 163/163 + full capstone', async ({ page }) => {
  await seededCapstone(page, { attemptsScore: 0.75 }); // 12/16 — not passing
  await expect(page.getByText(/لم يُجتز بعد/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إصدار وتحميل الإثبات الموقّع' })).toHaveCount(0);
});

/* ------------------------------ CAP-001 ------------------------------ */

test('CAP-001: forged capstone keys never count; 5/6 canonical artifacts stay locked', async ({ page }) => {
  // a) fake ids (a1..a6) that used to satisfy the raw .length >= 6 count
  await seededCapstone(page, {
    artifactIds: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'],
    attemptsScore: 0.875,
  });
  await expect(page.getByText(/\(0\/6 أدوات\)/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إصدار وتحميل الإثبات الموقّع' })).toHaveCount(0);

  // b) 5 of 6 canonical artifacts: readiness ≥ 80 is NOT enough any more
  await page.evaluate(() => localStorage.removeItem('pypath.certification'));
  await seededCapstone(page, {
    artifactIds: CANONICAL_ARTIFACT_IDS.slice(0, 5),
    attemptsScore: 0.875,
  });
  await expect(page.getByText(/\(5\/6 أدوات\)/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إصدار وتحميل الإثبات الموقّع' })).toHaveCount(0);
});

/* --------------------------- EXAM-001/002 --------------------------- */

test('EXAM-002: each attempt draws 16 unique questions with the balanced 6/7/3 topic distribution', async ({ page }) => {
  await runExamAttempt(page, 16);
  const drawn = (page as unknown as { __drawn: string[] }).__drawn;
  expect(new Set(drawn).size, 'no duplicate questions').toBe(DRAW);
  const topics = drawn.map((q) => EXAM_ITEMS.find((it) => it.q.ar === q)!.topic);
  const count = (t: ExamItem['topic']) => topics.filter((x) => x === t).length;
  expect(count('py4e')).toBe(6);
  expect(count('swe')).toBe(7);
  expect(count('ai-era')).toBe(3);
});

test('EXAM-001: rapid double-submit records exactly ONE attempt', async ({ page }) => {
  await runExamAttempt(page, 16);
  const submit = page.getByRole('button', { name: 'إنهاء وتسليم', exact: true });
  await submit.dblclick();
  await expect(page.getByText(/النتيجة: 100٪/)).toBeVisible();
  const store = await readCertification(page);
  expect(store.attempts, 'double-click must not record two attempts').toHaveLength(1);
});

test('EXAM-002: 13/16 passes (≥ 80%), 12/16 fails', async ({ page }) => {
  test.setTimeout(240_000);
  await runExamAttempt(page, 13);
  await page.getByRole('button', { name: 'إنهاء وتسليم', exact: true }).click();
  await expect(page.getByText(/النتيجة: 81٪ — ناجح ✓/)).toBeVisible();

  // Fresh navigation resets the view to intro; a new attempt runs from there.
  await runExamAttempt(page, 12);
  await page.getByRole('button', { name: 'إنهاء وتسليم', exact: true }).click();
  await expect(page.getByText(/النتيجة: 75٪ — غير مجتاز/)).toBeVisible();
});

/* --------------------------- CERT-002/003 --------------------------- */

test('CERT-002: real proof verifies; tampered name/score/date/signature and semantically forged gates all FAIL', async ({ page }) => {
  test.setTimeout(120_000);
  await seededCapstone(page, { attemptsScore: 0.875 });

  // Issue a genuine proof and capture the downloaded JSON.
  await page.getByLabel('الاسم').fill('متلقي الاختبار');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'إصدار وتحميل الإثبات الموقّع' }).click(),
  ]);
  const downloadPath = await download.path();
  if (!downloadPath) throw new Error('proof download produced no file');
  const real = JSON.parse(readFileSync(downloadPath, 'utf-8'));
  await expect(page.getByText(/التوقيع صالح والبوابات مستوفاة/)).toBeVisible();

  const verify = async (proof: unknown, expectReason?: RegExp) => {
    await page.getByRole('button', { name: 'اختيار ملف والتحقق' }).click();
    await page.setInputFiles('input[type="file"]', {
      name: 'proof.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(proof)),
    });
    await expect(page.getByText(/✗ التحقق فشل/)).toBeVisible();
    if (expectReason) await expect(page.getByText(expectReason)).toBeVisible();
  };

  // Tampered subject (signature no longer covers the payload).
  const tamperedName = structuredClone(real);
  tamperedName.payload.subject = 'مزوّر';
  await verify(tamperedName);

  // Tampered exam score.
  const tamperedScore = structuredClone(real);
  tamperedScore.payload.exam.best = 1;
  await verify(tamperedScore);

  // Tampered issue date.
  const tamperedDate = structuredClone(real);
  tamperedDate.payload.issuedAt = real.payload.issuedAt + 1;
  await verify(tamperedDate);

  // Broken signature bytes.
  const tamperedSig = structuredClone(real);
  tamperedSig.signature = 'QUFBQQ==';
  await verify(tamperedSig, /bad-signature/);

  // Semantic forgery: re-sign a failing payload with the device's OWN key
  // (read from localStorage) — the signature verifies, but the semantic
  // gates must still reject it (passMark lowered + exam below threshold).
  const forged = await page.evaluate(async (payload) => {
    const keys = JSON.parse(
      localStorage.getItem('pypath.cert.keys.v1') ?? '{}',
    ) as { privateJwk: JsonWebKey; publicJwk: JsonWebKey };
    const key = await crypto.subtle.importKey(
      'jwk',
      keys.privateJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign'],
    );
    const canon = (v: unknown): string => {
      if (v === null || typeof v !== 'object') return JSON.stringify(v);
      if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`;
      const ks = Object.keys(v as Record<string, unknown>).sort();
      return `{${ks.map((k) => `${JSON.stringify(k)}:${canon((v as Record<string, unknown>)[k])}`).join(',')}}`;
    };
    const sig = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      new TextEncoder().encode(canon(payload)),
    );
    let bin = '';
    for (const b of new Uint8Array(sig)) bin += String.fromCharCode(b);
    return {
      payload,
      signature: btoa(bin),
      publicKey: keys.publicJwk,
      alg: 'ECDSA_P256_SHA256',
    };
  }, {
    ...real.payload,
    exam: { ...real.payload.exam, best: 0.5, passed: true, passMark: 0.5 },
  });
  await verify(forged, /exam-gate-failed|pass-mark-lowered/);
});
