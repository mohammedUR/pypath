'use client';

/**
 * ExamView — Python Professional certification exam (§4.2 P4 gate).
 * 16 items drawn per attempt from a 48-item bank (≥3× floor, R-CNT-02),
 * 20-minute timer, ≥80% to pass (R-GRD-04). Results persist locally.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { EXAM_ITEMS, drawExamItems, type ExamItem } from '../../content/exam/python-professional';
import {
  useCertification,
  examPassed,
  bestExamScore,
  EXAM_PASS_MARK,
} from '@/lib/store/certification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const DRAW = 16;
const MINUTES = 20;

export function ExamView() {
  const { locale } = useI18n();
  const ar = locale === 'ar';
  const t = (o: { ar: string; en: string }) => (ar ? o.ar : o.en);

  const attempts = useCertification((s) => s.attempts);
  const recordAttempt = useCertification((s) => s.recordAttempt);

  const [phase, setPhase] = useState<'intro' | 'running' | 'done'>('intro');
  const [items, setItems] = useState<ExamItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(MINUTES * 60);
  const [score, setScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passed = examPassed(attempts);
  const best = bestExamScore(attempts);

  const start = () => {
    const drawn = drawExamItems(DRAW);
    setItems(drawn);
    setIdx(0);
    setAnswers({});
    setSecondsLeft(MINUTES * 60);
    setPhase('running');
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Expiry handled as an event on the next tick callback (never in render).
          queueMicrotask(() => finishRef.current());
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const finish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const correct = items.filter((it) => answers[it.id] === it.answer).length;
    const sc = correct / DRAW;
    setScore(sc);
    recordAttempt(sc, sc >= EXAM_PASS_MARK);
    setPhase('done');
  };

  // Keep the latest finish callable without re-creating the interval.
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  });

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const item = items[idx];
  const answeredCount = Object.keys(answers).length;

  const results = useMemo(() => {
    if (phase !== 'done') return null;
    return items.map((it) => ({
      it,
      chosen: answers[it.id],
      ok: answers[it.id] === it.answer,
    }));
  }, [phase, items, answers]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8" dir={ar ? 'rtl' : 'ltr'}>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">
          {ar ? 'امتحان بايثون الاحترافي' : 'Python Professional Exam'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {ar
            ? `${EXAM_ITEMS.length} سؤالًا في البنك · تُسحب ${DRAW} عشوائيًا كل محاولة · النجاح من ${Math.ceil(EXAM_PASS_MARK * 100)}٪`
            : `${EXAM_ITEMS.length}-item bank · ${DRAW} drawn per attempt · pass mark ${Math.ceil(EXAM_PASS_MARK * 100)}%`}
        </p>
      </header>

      {phase === 'intro' && (
        <Card>
          <CardHeader>
            <CardTitle>{ar ? 'قواعد الامتحان' : 'Exam rules'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>{ar ? `الوقت: ${MINUTES} دقائق.` : `Time limit: ${MINUTES} minutes.`}</li>
              <li>{ar ? 'أسئلة من اختيار واحد؛ لا علامة سلبية.' : 'Single-answer questions; no negative marking.'}</li>
              <li>{ar ? 'النجاح ≥ 80٪ يفتح الاعتماد مع كابستون Part I.' : 'Scoring ≥ 80% certifies (with the Part I capstone).'}</li>
              {attempts.length > 0 && (
                <li>
                  {ar
                    ? `أفضل نتيجة سابقة: ${Math.round(best * 100)}٪ · ${passed ? 'ناجح ✓' : 'لم تنجح بعد'}`
                    : `Best so far: ${Math.round(best * 100)}% · ${passed ? 'passed ✓' : 'not passed yet'}`}
                </li>
              )}
            </ul>
            <Button onClick={start}>{ar ? 'ابدأ المحاولة' : 'Start attempt'}</Button>
          </CardContent>
        </Card>
      )}

      {phase === 'running' && item && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">
              {ar ? `السؤال ${idx + 1} من ${DRAW}` : `Question ${idx + 1} of ${DRAW}`}
            </CardTitle>
            <span className="font-mono text-lg tabular-nums" aria-live="off">
              {mm}:{ss}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={(answeredCount / DRAW) * 100} aria-hidden="true" />
            <p className="text-base font-medium">{t(item.q)}</p>
            <div className="grid gap-2">
              {item.options.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [item.id]: op.id }))}
                  className={`rounded-xl border px-4 py-3 text-start text-sm transition-colors ${
                    answers[item.id] === op.id
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  {t(op.text)}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
                {ar ? 'السابق' : 'Previous'}
              </Button>
              {idx < DRAW - 1 ? (
                <Button onClick={() => setIdx((i) => i + 1)}>{ar ? 'التالي' : 'Next'}</Button>
              ) : (
                <Button onClick={finish}>{ar ? 'إنهاء وتسليم' : 'Finish & submit'}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'done' && results && (
        <Card>
          <CardHeader>
            <CardTitle>
              {ar
                ? `النتيجة: ${Math.round(score * 100)}٪ — ${score >= EXAM_PASS_MARK ? 'ناجح ✓' : 'غير مجتاز'}`
                : `Score: ${Math.round(score * 100)}% — ${score >= EXAM_PASS_MARK ? 'passed ✓' : 'not passed'}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-2 text-sm">
              {results.map(({ it, chosen, ok }, i) => (
                <li key={it.id} className="rounded-lg border p-3">
                  <p className="font-medium">
                    {i + 1}. {t(it.q)} {ok ? '✓' : '✗'}
                  </p>
                  {!ok && (
                    <p className="mt-1 text-muted-foreground">
                      {ar ? 'إجابتك: ' : 'Your answer: '}
                      {chosen ? t(it.options.find((o) => o.id === chosen)!.text) : '—'}
                      {' · '}
                      {ar ? 'الصحيح: ' : 'Correct: '}
                      {t(it.options.find((o) => o.id === it.answer)!.text)}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{t(it.why)}</p>
                </li>
              ))}
            </ol>
            <Button onClick={start}>{ar ? 'محاولة جديدة (سحب جديد)' : 'New attempt (fresh draw)'}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ExamView;
