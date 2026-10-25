'use client';

/**
 * CapstoneView — Capstone I (SWE Appendix A) platform integration.
 * Six auto-declared artifacts + a five-criterion self-review rubric (0-3),
 * with a readiness score that combines artifacts, rubric, and the exam gate.
 * On certification, issues a locally-signed JSON proof (R-GAM-02 / OQ-7).
 */
import { useMemo, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useProgress } from '@/lib/store/progress';
import { useManifestStore } from '@/lib/content/registry';
import {
  useCertification,
  examPassed,
  bestExamScore,
  capstoneReadiness,
  capstoneArtifactsDone,
  capstoneRubricTotal,
  certificationGateStatus,
  CAPSTONE_ARTIFACTS_TOTAL,
  CAPSTONE_RUBRIC_MAX,
} from '@/lib/store/certification';
import {
  issueCertificateProof,
  verifySignedProof,
  parseProofJson,
  downloadJson,
  normalizeSubject,
  CERT_PART1_LESSONS,
  type SignedProof,
  type VerifyResult,
} from '@/lib/cert/proof';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const ARTIFACTS: { id: string; ar: string; en: string; hintAr: string; hintEn: string }[] = [
  {
    id: 'proposal', ar: 'مقترح المشروع (Proposal)', en: 'Project proposal',
    hintAr: 'بيان المشكلة + الجمهور + النطاق + معايير النجاح.', hintEn: 'Problem, audience, scope, success criteria.',
  },
  {
    id: 'skeletal', ar: 'النظام الهيكلي (Skeletal)', en: 'Skeletal system',
    hintAr: 'هيكل قابل للتشغيل: واجهات ووظائف جوفاء واختبارات موسومة تخطيطًا (skipped).', hintEn: 'Runnable skeleton: interfaces, stubs, skipped tests.',
  },
  {
    id: 'viable', ar: 'النظام القابل للحياة (Viable)', en: 'Viable system',
    hintAr: 'مسار المستخدم الأساسي يعمل من البداية للنهاية مع اختبارات خضراء.', hintEn: 'The core user path works end-to-end with green tests.',
  },
  {
    id: 'tests', ar: 'حزمة اختبارات ناجحة', en: 'Passing test suite',
    hintAr: 'أوامر اختبار تعمل من أمر واحد وتخضر كلها.', hintEn: 'One command runs the suite; all green.',
  },
  {
    id: 'readme', ar: 'README + توثيق التشغيل', en: 'README + run docs',
    hintAr: 'كيف أثبّت وأشغّل وأختبر في ثلاث خطوات.', hintEn: 'Install, run, test — three steps.',
  },
  {
    id: 'final', ar: 'التقرير النهائي', en: 'Final report',
    hintAr: 'ما بُني، القرارات، القيود، وسلامة المنشأ لأي مساعدات AI.', hintEn: 'What was built, decisions, limits, AI provenance.',
  },
];

const RUBRIC: { id: string; ar: string; en: string }[] = [
  { id: 'requirements', ar: 'تغطية المتطلبات المتفق عليها', en: 'Requirements coverage' },
  { id: 'quality', ar: 'جودة الكود والتنظيم', en: 'Code quality & structure' },
  { id: 'testing', ar: 'قوة شبكة الاختبارات', en: 'Test net strength' },
  { id: 'delivery', ar: 'جاهزية التسليم والتوثيق', en: 'Delivery & documentation' },
  { id: 'reflection', ar: 'صدق التأمل وسلامة المنشأ', en: 'Honest reflection & provenance' },
];

export function CapstoneView() {
  const { locale } = useI18n();
  const ar = locale === 'ar';
  const artifacts = useCertification((s) => s.capstoneArtifacts);
  const rubric = useCertification((s) => s.capstoneRubric);
  const toggleArtifact = useCertification((s) => s.toggleArtifact);
  const setRubricScore = useCertification((s) => s.setRubricScore);
  const attempts = useCertification((s) => s.attempts);
  const subject = useCertification((s) => s.subject);
  const setSubject = useCertification((s) => s.setSubject);
  const completedLessons = useProgress((s) => s.completedLessons);
  const manifest = useManifestStore((s) => s.manifest);

  const [proof, setProof] = useState<SignedProof | null>(null);
  const [proofState, setProofState] = useState<'idle' | 'issuing' | 'issued'>('idle');
  const [verifyRes, setVerifyRes] = useState<VerifyResult | null>(null);
  const verifyFileRef = useRef<HTMLInputElement | null>(null);

  const artifactDone = useMemo(() => capstoneArtifactsDone(artifacts), [artifacts]);
  const rubricTotal = useMemo(() => capstoneRubricTotal(rubric), [rubric]);
  const rubricMax = RUBRIC.length * 3;

  // Part I canonical coverage (CERT-001): the certificate binds to ALL 163
  // canonical Part I lesson ids from the manifest, never to a bare count.
  const part1CanonicalIds = useMemo(
    () => manifest.filter((m) => m.part === 'I').map((m) => m.id),
    [manifest],
  );
  const part1CompletedCount = useMemo(() => {
    const done = new Set(completedLessons);
    return part1CanonicalIds.filter((id) => done.has(id)).length;
  }, [completedLessons, part1CanonicalIds]);
  const part1Complete = part1CanonicalIds.length > 0 && part1CompletedCount === part1CanonicalIds.length;

  const readiness = useMemo(
    () => capstoneReadiness(artifactDone, rubricTotal),
    [artifactDone, rubricTotal],
  );

  const { certified } = useMemo(
    () => certificationGateStatus(attempts, readiness, artifactDone, part1Complete),
    [attempts, readiness, artifactDone, part1Complete],
  );

  const subjectValid = normalizeSubject(subject) !== null;

  const handleIssue = async () => {
    setProofState('issuing');
    try {
      const signed = await issueCertificateProof({
        subject,
        attempts,
        readiness,
        artifactsDone: artifactDone,
        rubricTotal,
        rubricMax: CAPSTONE_RUBRIC_MAX,
        part1CompletedIds: completedLessons,
        part1CanonicalIds,
      });
      setProof(signed);
      setProofState('issued');
      setVerifyRes(await verifySignedProof(signed));
      downloadJson(`pypath-certificate-${new Date().toISOString().slice(0, 10)}.json`, signed);
    } catch (e) {
      // validateProofInput rejected the snapshot (CERT-003): surface it, never sign.
      setProof(null);
      setProofState('idle');
      setVerifyRes({
        valid: false,
        reason: e instanceof Error ? e.message : 'issuance rejected',
      });
    }
  };

  const handleVerifyFile = async (f: File | undefined) => {
    if (!f) return;
    const parsed = parseProofJson(await f.text());
    setVerifyRes(
      parsed
        ? await verifySignedProof(parsed)
        : { valid: false, reason: 'malformed' },
    );
    if (verifyFileRef.current) verifyFileRef.current.value = '';
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8" dir={ar ? 'rtl' : 'ltr'}>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">
          {ar ? 'الكابستون: مشروع الفريق الفردي' : 'Capstone I: Your Team Project'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {ar
            ? 'مقتبس من ملحق المشروع في كتاب هندسة البرمجيات (الدروس swe.appa.l1-l4). علّم الأدوات المكتملة فعليًا — القائمة صادقة أم جميلة؟'
            : 'Adapted from the SWE book Team-Project appendix (lessons swe.appa.l1-l4). Tick artifacts that truly exist — is this checklist honest or pretty?'}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>
            {ar ? `الأدوات: ${artifactDone}/${ARTIFACTS.length}` : `Artifacts: ${artifactDone}/${ARTIFACTS.length}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ARTIFACTS.map((a) => (
            <label
              key={a.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40"
            >
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={!!artifacts[a.id]}
                onChange={() => toggleArtifact(a.id)}
              />
              <span>
                <span className="block text-sm font-medium">{ar ? a.ar : a.en}</span>
                <span className="block text-xs text-muted-foreground">{ar ? a.hintAr : a.hintEn}</span>
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {ar
              ? `الروبريكا الذاتية: ${rubricTotal}/${rubricMax}`
              : `Self-review rubric: ${rubricTotal}/${rubricMax}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {RUBRIC.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm">{ar ? r.ar : r.en}</span>
              <div className="flex gap-1" role="group" aria-label={ar ? r.ar : r.en}>
                {[0, 1, 2, 3].map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={(rubric[r.id] ?? -1) >= v && (rubric[r.id] ?? 0) === v ? 'default' : 'outline'}
                    onClick={() => setRubricScore(r.id, v)}
                    aria-pressed={(rubric[r.id] ?? -1) === v}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            {ar
              ? '0 = غائب · 1 = بداية · 2 = مقبول · 3 = متقن'
              : '0 = missing · 1 = started · 2 = acceptable · 3 = solid'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{ar ? 'الجاهزية والاعتماد' : 'Readiness & certification'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={readiness} aria-label={ar ? 'نسبة الجاهزية' : 'Readiness'} />
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              {ar ? 'دروس الجزء الأول: ' : 'Part I lessons: '}
              {part1CompletedCount} / {part1CanonicalIds.length || CERT_PART1_LESSONS}
              {part1Complete ? ' ✓' : ''}
            </li>
            <li>
              {ar ? 'امتحان بايثون الاحترافي: ' : 'Python Professional exam: '}
              {examPassed(attempts)
                ? ar
                  ? `ناجح ✓ (أفضل نتيجة ${Math.round(bestExamScore(attempts) * 100)}٪)`
                  : `passed ✓ (best ${Math.round(bestExamScore(attempts) * 100)}%)`
                : ar
                  ? 'لم يُجتز بعد — اذهب إلى صفحة الامتحان'
                  : 'not passed yet — head to the exam'}
            </li>
            <li>
              {ar ? 'جاهزية الكابستون: ' : 'Capstone readiness: '}
              {readiness}% ({artifactDone}/{CAPSTONE_ARTIFACTS_TOTAL} {ar ? 'أدوات' : 'artifacts'})
            </li>
          </ul>
          {certified ? (
            <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm font-medium">
              {ar
                ? '🎉 اكتملت بوابة Part I: منهج كامل (163) + امتحان + كابستون. بوابة Part II مفتوحة أمامك.'
                : '🎉 Part I gate complete: full curriculum (163) + exam + capstone. Part II is open.'}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {ar
                ? 'الاعتماد = إكمال دروس الجزء الأول (163/163) + نجاح الامتحان (≥80٪) + جاهزية كابستون ≥ 80٪ مع الأدوات الست كاملة.'
                : 'Certification = all 163 Part I lessons + exam pass (≥80%) + capstone readiness ≥ 80% with all 6 artifacts.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Signed certificate proof (R-GAM-02 / OQ-7 local-key default) */}
      <Card>
        <CardHeader>
          <CardTitle>
            {ar ? 'الشهادة: إثبات موقّع قابل للتحقق' : 'Certificate: signed verifiable proof'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {certified ? (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={ar ? 'الاسم كما سيظهر في الشهادة' : 'Name as it should appear'}
                  aria-label={ar ? 'الاسم' : 'Name'}
                  className="h-11 flex-1 rounded-xl"
                  maxLength={80}
                />
                <Button
                  className="h-11 rounded-xl"
                  onClick={() => void handleIssue()}
                  disabled={proofState !== 'idle' || !subjectValid}
                  title={!subjectValid ? (ar ? 'أدخل اسمًا صالحًا أولًا' : 'Enter a valid name first') : undefined}
                >
                  {proofState === 'issuing'
                    ? ar
                      ? 'جارٍ التوقيع…'
                      : 'Signing…'
                    : ar
                      ? 'إصدار وتحميل الإثبات الموقّع'
                      : 'Issue & download signed proof'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {ar
                  ? 'توقيع ECDSA P-256 بمفتاح محلي على جهازك؛ المفتاح العام مضمّن في الملف ويمكن التحقق منه دون اتصال. الاسم معلن ذاتيًا — الإثبات يضمن سلامة المحتوى لا هوية شخص.'
                  : 'ECDSA P-256 signature with a device-local key; the public key is embedded so the file verifies offline. The name is self-declared — the proof guarantees integrity, not identity.'}
              </p>
              {proof && verifyRes?.valid && (
                <p className="text-xs text-muted-foreground">
                  {ar
                    ? `آخر إصدار: ${new Date(proof.payload.issuedAt).toLocaleString(locale)} · المفتاح: ${String(proof.publicKey.crv)} · `
                    : `Last issued: ${new Date(proof.payload.issuedAt).toLocaleString()} · key: ${String(proof.publicKey.crv)} · `}
                  <button
                    type="button"
                    className="underline underline-offset-2"
                    onClick={() =>
                      downloadJson(
                        `pypath-certificate-${new Date(proof.payload.issuedAt)
                          .toISOString()
                          .slice(0, 10)}.json`,
                        proof,
                      )
                    }
                  >
                    {ar ? 'إعادة التحميل' : 're-download'}
                  </button>
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {ar
                ? 'يُفتح إصدار الشهادة الموقّعة بعد استيفاء بوابة الاعتماد.'
                : 'Signed proof issuance unlocks once the certification gate is met.'}
            </p>
          )}
          <div className="border-t pt-3">
            <p className="text-sm font-medium">
              {ar ? 'التحقق من إثبات مُصدَّر' : 'Verify an exported proof'}
            </p>
            <p className="mb-2 mt-1 text-xs text-muted-foreground">
              {ar
                ? 'اختر ملف شهادة JSON للتحقق منه محليًا دون اتصال.'
                : 'Pick a certificate JSON file to verify locally, offline.'}
            </p>
            {verifyRes && (
              <p
                className={`mb-2 rounded-xl border p-3 text-sm font-medium ${
                  verifyRes.valid
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-red-500/40 bg-red-500/10'
                }`}
                role="status"
              >
                {verifyRes.valid
                  ? ar
                    ? '✓ التوقيع صالح والبوابات مستوفاة.'
                    : '✓ Signature valid and gates satisfied.'
                  : ar
                    ? `✗ التحقق فشل (${verifyRes.reason ?? 'unknown'}).`
                    : `✗ Verification failed (${verifyRes.reason ?? 'unknown'}).`}
              </p>
            )}
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => verifyFileRef.current?.click()}
            >
              {ar ? 'اختيار ملف والتحقق' : 'Choose file & verify'}
            </Button>
            <input
              ref={verifyFileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => void handleVerifyFile(e.target.files?.[0])}
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CapstoneView;
