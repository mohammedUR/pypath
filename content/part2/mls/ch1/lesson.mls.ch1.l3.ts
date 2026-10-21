import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch1.l3 — "Constructing Linear Regression from Scratch"
 * بناء الانحدار الخطي من الصفر
 * Aligned with MLS ch1 s3 (Construction).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved). The book's class uses
 * numpy; here everything is pure Python on a fixed dataset.
 * Runnable design: X=[1..5], y=[2.1,3.9,6.1,7.8,10.2]; gradient step, a 2000-step
 * fit converging to (-0.01, 2.01), and a prediction report. Every literal below
 * was verified under CPython 3 (tool-results/verify-17b.py).
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch1.l3',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 1,
  title: { ar: 'بناء الانحدار الخطي من الصفر', en: 'Constructing Linear Regression from Scratch' },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch1.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حان وقت البناء. الدرسان السابقان قدّما المنظورين؛ هنا ننفذ المنظور الأول بلا أي مكتبة: لا numpy ولا شيء — بايثون صافٍ وخمس نقاط ثابتة. ستكتب خطوة تدرج واحدة وتختبرها بأرقام معلومة سلفًا، ثم توسعها إلى حلقة تدريب كاملة تجمع w0 وw1 النهائيين، وتُخرج تقرير تنبؤات نقطة بنقطة. كل قيمة في الاختبارات محسوبة ومتحقق منها مسبقًا، فيمكنك قياس بنائك على الحقيقة لا على الإحساس.',
        en: 'Time to build. The previous two lessons presented the perspectives; here we implement the first one with no library at all — no numpy, just pure Python and five fixed points. You will write a single gradient step and test it against known numbers, then grow it into a full training loop that produces final w0 and w1, plus a point-by-point prediction report. Every value in the tests was computed and verified in advance, so you can measure your construction against ground truth, not vibes.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من التدرج إلى حلقة التدريب', en: 'From the gradient to the training loop' },
      chunks: [
        {
          ar: 'على بياناتنا الثابتة (X = [1..5], y = [2.1, 3.9, 6.1, 7.8, 10.2]) تكون مشتقات MSE عند نقطة الأصل: د/دw0 = -(2/N) مجموع y = -12.04، ودف/دw1 = -(2/N) مجموع y*x = -44.16. خطوة النزول تطرح lr مضروبًا في التدرج: w_new = w - lr*grad. بمعدل تعلم lr = 0.02 تنتقل النقطة من (0, 0) إلى (0.2408, 0.8832) وتنخفض الخسارة من 44.3420 إلى 12.3552. المعدل ليس حرا: كبير جدًا يقفز فوق القاع ويتذبذب، صغير جدًا يزحف. لبياناتنا القيمة الآمنة حتى 0.08 تقريبًا، و0.02 خيار مريح ومحدد.',
          en: 'On our fixed data (X = [1..5], y = [2.1, 3.9, 6.1, 7.8, 10.2]) the MSE derivatives at the origin are: d/dw0 = -(2/N) sum of y = -12.04, and d/dw1 = -(2/N) sum of y*x = -44.16. A descent step subtracts lr times the gradient: w_new = w - lr*grad. With learning rate lr = 0.02 the weights move from (0, 0) to (0.2408, 0.8832) and the loss falls from 44.3420 to 12.3552. The rate is not free: too large overshoots the bowl and oscillates, too small crawls. For our data anything up to about 0.08 is safe, and 0.02 is a comfortable, deterministic choice.',
        },
        {
          ar: 'حلقة التدريب هي تكرار الخطوة نفسها: لكل تكرار احسب التدرجين من البيانات كاملة، ثم حدّث w0 وw1 معًا. على بياناتنا تنزل الخسارة من 44.3420 عند البداية إلى 0.0215 بعد 500 خطوة، وتبلغ 0.0214 عند 1000 خطوة، ثم تستقر — قدمنا قليلًا ووصلنا. القاع عند (w0, w1) ≈ (-0.01, 2.01) أي الخط y ≈ -0.01 + 2.01*x. لاحظ أننا لم نستخدم أي مكتبة: المجموع بحلقة، والتنبؤ بضرب وجمع. الكتاب يبني فئة LinearRegression بأدوات numpy؛ نحن نبني نفس الرياضيات بدوال صافية لترى كل عملية بعينك.',
          en: 'The training loop simply repeats that step: on every iteration compute both gradients from the full data, then update w0 and w1 together. On our data the loss falls from 44.3420 at the start to 0.0215 after 500 steps, hits 0.0214 by step 1000, and settles — almost there early, then converged. The bottom sits at (w0, w1) ≈ (-0.01, 2.01), i.e. the line y ≈ -0.01 + 2.01*x. Notice no library was used: sums via loops, predictions via multiplication and addition. The book builds a LinearRegression class with numpy tools; we rebuild the same mathematics with plain functions so you see every operation with your own eyes.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'حلقة تدريب كاملة على خمس نقاط', en: 'A full training loop on five points' },
      code: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\nn = len(X)\n\ndef mse(w0, w1):\n    return sum((y[i] - (w0 + w1 * X[i])) ** 2 for i in range(n)) / n\n\nw0, w1, lr = 0.0, 0.0, 0.02\nprint('step 0: mse=%.4f' % mse(w0, w1))\nfor step in range(2000):\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n    w0 -= lr * g0\n    w1 -= lr * g1\n    if step in (499, 999, 1499):\n        print('step %d: mse=%.4f' % (step + 1, mse(w0, w1)))\nprint('step 2000: mse=%.4f' % mse(w0, w1))\nprint('final: w0=%.4f w1=%.4f' % (w0, w1))",
      explanation: {
        ar: 'الحلقة تعيد حساب التدرجين من الصفر في كل تكرار — لا حالات مخزنة ولا مفاجآت، فالنتيجة متطابقة في كل تشغيل. المسار: 44.3420 عند البداية، 0.0215 عند الخطوة 500، 0.0214 من الخطوة 1000 فصاعدًا، والنهاية (w0=-0.0100, w1=2.0100). الهبوط الكبير يحدث مبكرًا لأن التدرج قوي بعيدًا عن القاع، ثم تتباطأ الخطوات تلقائيًا لأن التدرج يصغر قرب القاع — هذه خاصية بنيوية في النزول التدريجي لا تحتاج جدولًا لمعدل التعلم هنا.',
        en: 'The loop recomputes both gradients from scratch on every iteration — no stored state, no surprises, identical output on every run. The path: 44.3420 at the start, 0.0215 at step 500, 0.0214 from step 1000 onward, ending at (w0=-0.0100, w1=2.0100). The dramatic drop happens early because the gradient is strong far from the bowl\u2019s bottom, then the steps slow down automatically as the gradient shrinks near it — a structural property of gradient descent that needs no learning-rate schedule here.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.gradient-step',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة gd_step(w0, w1, X, y, lr) تحسب تدرجي MSE (بالصيغتين -(2/N) مجموع البواقي و-(2/N) مجموع البواقي×x) وتعيد الزوج الجديد (w0, w1) بعد خطوة واحدة. عند الاستدعاء gd_step(0.0, 0.0, X, y, 0.02) يجب أن ينتج (0.2408, 0.8832).',
        en: 'Implement gd_step(w0, w1, X, y, lr) computing the two MSE gradients (-(2/N) times the sum of residuals, and -(2/N) times the residuals times x) and returning the updated pair (w0, w1) after one step. Calling gd_step(0.0, 0.0, X, y, 0.02) must produce (0.2408, 0.8832).',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef gd_step(w0, w1, X, y, lr):\n    ...  # TODO: compute g0, g1 then return (w0 - lr*g0, w1 - lr*g1)\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef gd_step(w0, w1, X, y, lr):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n    return w0 - lr * g0, w1 - lr * g1",
      tests: [
        {
          id: 't1',
          name: { ar: 'الخطوة الأولى من نقطة الأصل صحيحة', en: 'The first step from the origin is correct' },
          code: "res = gd_step(0.0, 0.0, X, y, 0.02)\nassert abs(res[0] - 0.2408) < 1e-9 and abs(res[1] - 0.8832) < 1e-9, 'expected (0.2408, 0.8832) | actual: %r' % (res,)",
          expected: '(0.2408, 0.8832)',
        },
        {
          id: 't2',
          name: { ar: 'الخطوة تخفض الخسارة فعلًا', en: 'The step genuinely lowers the loss' },
          code: "def mse(w0, w1):\n    return sum((y[i] - (w0 + w1 * X[i])) ** 2 for i in range(len(X))) / len(X)\nres = gd_step(0.0, 0.0, X, y, 0.02)\nassert mse(res[0], res[1]) < mse(0.0, 0.0), 'expected the step to lower the MSE'",
          expected: '12.3552 < 44.3420',
        },
        {
          id: 't3',
          name: { ar: 'التدرج عند الأصل سالب فيكبر المعاملان', en: 'Gradient at the origin is negative, so both weights grow' },
          code: "res = gd_step(0.0, 0.0, X, y, 0.02)\nassert res[0] > 0.0 and res[1] > 0.0, 'expected both weights to increase from zero | actual: %r' % (res,)",
          expected: 'both > 0',
        },
      ],
      hints: [
        { ar: 'البواقي عند (w0, w1): err_i = y[i] - (w0 + w1 * X[i]) — احسبها من البيانات كاملة في كل استدعاء.', en: 'Residuals at (w0, w1): err_i = y[i] - (w0 + w1 * X[i]) — compute from the full data on every call.' },
        { ar: 'الصيغتان: g0 = -2.0 * sum(err) / n وg1 = -2.0 * sum(err * X[i]) / n، حيث n = len(X).', en: 'The two formulas: g0 = -2.0 * sum(err) / n and g1 = -2.0 * sum(err * X[i]) / n, with n = len(X).' },
        { ar: 'التحديث: w0 - lr * g0 وw1 - lr * g1. عند (0,0): g0 = -12.04 وg1 = -44.16، وبضرب -lr نحصل على زيادة.', en: 'The update: w0 - lr * g0 and w1 - lr * g1. At (0,0): g0 = -12.04 and g1 = -44.16, so multiplying by -lr yields an increase.' },
        { ar: 'أعد زوجًا: return w0 - lr * g0, w1 - lr * g1 — القوسان اختياريان لكن الاختبار يقارن العنصرين بالترتيب.', en: 'Return a pair: return w0 - lr * g0, w1 - lr * g1 — parentheses optional, but the test compares both elements in order.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.full-fit',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'وسّع الخطوة إلى حلقة: نفّذ دالة fit_gd(X, y, lr=0.02, steps=2000) تبدأ من (0.0, 0.0) وتكرر خطوة التدرج steps مرة، ثم تعيد الزوج النهائي (w0, w1). القاع على بياناتنا عند (-0.01, 2.01) تقريبًا.',
        en: 'Grow the step into a loop: implement fit_gd(X, y, lr=0.02, steps=2000) starting from (0.0, 0.0), repeating the gradient step steps times, then returning the final pair (w0, w1). The bottom of our bowl is near (-0.01, 2.01).',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef fit_gd(X, y, lr=0.02, steps=2000):\n    w0, w1 = 0.0, 0.0\n    ...  # TODO: repeat the gradient step, then return (w0, w1)\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef fit_gd(X, y, lr=0.02, steps=2000):\n    w0, w1 = 0.0, 0.0\n    n = len(X)\n    for _ in range(steps):\n        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n        w0 -= lr * g0\n        w1 -= lr * g1\n    return w0, w1",
      tests: [
        {
          id: 't1',
          name: { ar: 'الحد الثابت النهائي يقترب من -0.01', en: 'The final intercept approaches -0.01' },
          code: "w0, w1 = fit_gd(X, y)\nassert abs(w0 - (-0.01)) < 0.001, 'expected w0 about -0.01 | actual: %r' % w0",
          expected: 'w0 about -0.01',
        },
        {
          id: 't2',
          name: { ar: 'الميل النهائي يقترب من 2.01', en: 'The final slope approaches 2.01' },
          code: "w0, w1 = fit_gd(X, y)\nassert abs(w1 - 2.01) < 0.001, 'expected w1 about 2.01 | actual: %r' % w1",
          expected: 'w1 about 2.01',
        },
        {
          id: 't3',
          name: { ar: 'خسارة الحل النهائي تحت 0.03', en: 'Loss of the final solution is below 0.03' },
          code: "w0, w1 = fit_gd(X, y)\nv = sum((y[i] - (w0 + w1 * X[i])) ** 2 for i in range(len(X))) / len(X)\nassert v < 0.03, 'expected mse below 0.03 | actual: %r' % v",
          expected: 'mse = 0.0214',
        },
      ],
      hints: [
        { ar: 'أعد استخدام منطق الخطوة داخل حلقة for _: احسب g0 وg1 ثم اطرح lr*g من كل معامل في المكان.', en: 'Reuse the step logic inside a for _ loop: compute g0 and g1, then subtract lr*g from each weight in place.' },
        { ar: 'لا تحسب التدرج مرة واحدة خارج الحلقة — التدرج يتغير كل تكرار لأن المعاملات تغيّرت.', en: 'Do not compute the gradient once outside the loop — it changes every iteration because the weights moved.' },
        { ar: 'قيم تحقق: بعد 500 خطوة تكون الخسارة 0.0215، وبعد 2000 خطوة تكون عند (-0.0100, 2.0100) بدقة أربع منازل.', en: 'Sanity values: after 500 steps the loss is 0.0215; after 2000 steps you sit at (-0.0100, 2.0100) to four decimals.' },
        { ar: 'أعد return w0, w1 فقط — أي طباعة داخل الدالة ستظهر في مخرجات المتعلم وتشوش التقرير.', en: 'Return w0, w1 only — any print inside the function would leak into the learner output and muddy the report.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.prediction-report',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل دورة التدريب بتقرير تنبؤ: نفّذ دالة predict_all(w0, w1, X) تعيد قائمة القيم المجهرة لكل عنصر في X، ودالة report(w0, w1, X, y) تطبع سطرًا لكل نقطة بالصيغة x=1 -> yhat=2.0000 (y=2.1) وتعيد قائمة الفروق المطلقة. استخدم النتيجة النهائية fit_gd مع %.4f في الطباعة.',
        en: 'Close the training loop with a prediction report: implement predict_all(w0, w1, X) returning the list of fitted values for every element of X, and report(w0, w1, X, y) printing one line per point in the form x=1 -> yhat=2.0000 (y=2.1) and returning the list of absolute errors. Feed it the final fit_gd result and use %.4f in the prints.',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef fit_gd(X, y, lr=0.02, steps=2000):\n    w0, w1 = 0.0, 0.0\n    n = len(X)\n    for _ in range(steps):\n        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n        w0 -= lr * g0\n        w1 -= lr * g1\n    return w0, w1\n\ndef predict_all(w0, w1, X):\n    ...  # TODO: list of w0 + w1 * x\n\ndef report(w0, w1, X, y):\n    ...  # TODO: print one line per point, return list of abs errors\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef fit_gd(X, y, lr=0.02, steps=2000):\n    w0, w1 = 0.0, 0.0\n    n = len(X)\n    for _ in range(steps):\n        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n        w0 -= lr * g0\n        w1 -= lr * g1\n    return w0, w1\n\ndef predict_all(w0, w1, X):\n    return [w0 + w1 * x for x in X]\n\ndef report(w0, w1, X, y):\n    preds = predict_all(w0, w1, X)\n    errors = []\n    for i in range(len(X)):\n        print('x=%d -> yhat=%.4f (y=%.1f)' % (X[i], preds[i], y[i]))\n        errors.append(abs(y[i] - preds[i]))\n    return errors\n\nw0, w1 = fit_gd(X, y)\nerrors = report(w0, w1, X, y)\nprint('max abs error: %.4f' % max(errors))",
      tests: [
        {
          id: 't1',
          name: { ar: 'التنبؤ عند x=1 يقترب من 2.0', en: 'Prediction at x=1 approaches 2.0' },
          code: "w0, w1 = fit_gd(X, y)\npreds = predict_all(w0, w1, X)\nassert abs(preds[0] - 2.0) < 0.05, 'expected about 2.0 | actual: %r' % preds[0]",
          expected: '2.0',
        },
        {
          id: 't2',
          name: { ar: 'التنبؤ عند x=5 يقترب من 10.04', en: 'Prediction at x=5 approaches 10.04' },
          code: "w0, w1 = fit_gd(X, y)\npreds = predict_all(w0, w1, X)\nassert abs(preds[4] - 10.04) < 0.05, 'expected about 10.04 | actual: %r' % preds[4]",
          expected: '10.04',
        },
        {
          id: 't3',
          name: { ar: 'التقرير يطبع خمسة أسطر وخطأ أقصى معقول', en: 'The report prints five lines with a sane max error' },
          code: "w0, w1 = fit_gd(X, y)\nerrors = report(w0, w1, X, y)\nassert len([ln for ln in __learner_output__.splitlines() if ln.startswith('x=')]) == 5, 'expected five x= lines'\nassert len(errors) == 5 and max(errors) < 0.5, 'expected five abs errors with max below 0.5 | actual: %r' % (errors,)",
          expected: '5 lines, max error < 0.5',
        },
      ],
      hints: [
        { ar: 'predict_all قائمة مركبة تكفي: [w0 + w1 * x for x in X] — بلا حلقات صريحة.', en: 'predict_all is a one-liner list comprehension: [w0 + w1 * x for x in X] — no explicit loop needed.' },
        { ar: 'في report احسب preds أولًا ثم حلقة طباعة: x=%d -> yhat=%.4f (y=%.1f) — انتبه لترتيب المعاملات في %.', en: 'In report compute preds first, then a print loop: x=%d -> yhat=%.4f (y=%.1f) — mind the argument order after %.' },
        { ar: 'الفروق المطلقة: abs(y[i] - preds[i]) أضفها إلى قائمة وأعدها — لا تطبعها.', en: 'Absolute errors: append abs(y[i] - preds[i]) to a list and return it — do not print them.' },
        { ar: 'قيم تحقق: النبؤات ≈ 2.0000, 4.0100, 6.0200, 8.0300, 10.0400 والخطأ الأقصى ≈ 0.23 عند x=4.', en: 'Sanity values: predictions ≈ 2.0000, 4.0100, 6.0200, 8.0300, 10.0400 and the max error ≈ 0.23 at x=4.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\nn = len(X)\n\nfor lr in [0.01, 0.05, 0.08, 0.09, 0.1]:\n    w0, w1 = 0.0, 0.0\n    diverged = False\n    for step in range(200):\n        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n        w0 -= lr * g0\n        w1 -= lr * g1\n        if abs(w1) > 1000.0:\n            diverged = True\n            break\n    print('lr=%.2f diverged=%s w1=%.4f' % (lr, diverged, w1))\n\n# جرّب: ما أكبر lr آمن؟ وفي أي قيمة ينفجر التدريب؟\n# try: what is the largest safe lr? At which value does training explode?\n# جرّب: قلل steps إلى 10 — ما مدى بعدك عن القاع حينها؟\n# try: cut steps to 10 — how far from the bowl\u2019s bottom are you then?\n",
      prompt: {
        ar: 'الملعب يجرب حدود معدل التعلم أمامك: خمس قيم lr لكل منها 200 خطوة. راقب الحد الفاصل بين الهدوء والانفجار.',
        en: 'The sandbox probes the learning-rate boundary for you: five lr values, 200 steps each. Watch where calm turns into explosion.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في خطوة النزول التدريجي w_new = w - lr*grad، ما دور الإشارة السالبة؟',
            en: 'In the descent step w_new = w - lr*grad, what is the role of the minus sign?',
          },
          options: [
            { id: 'a', text: { ar: 'تحريك المعاملات عكس اتجاه التدرج نحو خسارة أقل', en: 'Moving the weights against the gradient, toward lower loss' } },
            { id: 'b', text: { ar: 'جعل التحديث سالبًا دائمًا', en: 'Making the update always negative' } },
            { id: 'c', text: { ar: 'تسريع الحسابات', en: 'Speeding up the computation' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التدرج يشير إلى اتجاه زيادة الخسارة الأسرع؛ الطرح يعكس الاتجاه فينزلنا نحو القاع. وعند نقطة الأصل كان التدرج سالبًا (-12.04, -44.16) فصار التحديث موجبًا — المعاملان كبرا وهبطت الخسارة.',
            en: 'The gradient points along steepest ascent; subtracting flips the direction and descends toward the bottom. At the origin the gradient was negative (-12.04, -44.16), so the update became positive — both weights grew and the loss fell.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لو ضخّمنا lr إلى قيمة فوق الحد الآمن على بياناتنا (حوالي 0.08)، ما المتوقع؟',
            en: 'If we inflated lr beyond the safe bound for our data (about 0.08), what would happen?',
          },
          options: [
            { id: 'a', text: { ar: 'الحلقة تتقارب أسرع إلى القاع نفسه', en: 'The loop converges faster to the same bottom' } },
            { id: 'b', text: { ar: 'الخطوات تقفز فوق القاع وتتذبذب وقد تنفجر القيم', en: 'Steps overshoot the bowl, oscillate, and the values may explode' } },
            { id: 'c', text: { ar: 'لا شيء — الخسارة لا تعتمد على lr', en: 'Nothing — the loss does not depend on lr' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'شرط الاستقرار في النزول التدريجي مرتبط بأكبر انحناء في الوعاء؛ تجاوزه يجعل كل خطوة تقفز إلى الجهة الأخرى أعلى من قبل، فتتذبذب الخسارة وتكبر حتى الانفجار. جرّبته في الملعب عند lr=0.09 وما فوق.',
            en: 'Stability of gradient descent is tied to the largest curvature of the bowl; exceeding it makes every step land higher on the other side, so the loss oscillates and blows up. You saw it in the sandbox at lr=0.09 and beyond.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يعاد حساب التدرج داخل الحلقة في كل تكرار بدل حسابه مرة واحدة؟',
            en: 'Why is the gradient recomputed inside the loop at every iteration instead of once?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن التدرج يعتمد على المعاملات الحالية التي تتغير بعد كل خطوة', en: 'Because the gradient depends on the current weights, which change after every step' } },
            { id: 'b', text: { ar: 'لأن البيانات تتغير كل تكرار', en: 'Because the data changes every iteration' } },
            { id: 'c', text: { ar: 'لأن بايثون لا يسمح بحسابه مرة واحدة', en: 'Because Python forbids computing it once' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التدرج دالة في (w0, w1): عند الأصل كان (-12.04, -44.16) وقرب القاع يقترب من الصفر. تثبيته عند قيمته الأولى يجعل الخطوات تمشي بوصلة قديمة — وهذا سبب حاجتنا لتحديث المعاملين معًا في المكان نفسه.',
            en: 'The gradient is a function of (w0, w1): it was (-12.04, -44.16) at the origin and approaches zero near the bottom. Freezing it at its first value would keep walking by an old compass — hence updating both weights in place each iteration.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'خطوة النزول التدريجي صيغتها w_new = w - lr*grad مع تدرجين: -(2/N) مجموع البواقي لـ w0 والبواقي×x لـ w1. على بياناتنا الخطوة الأولى من الأصل بـ lr=0.02 تعطي (0.2408, 0.8832).', en: 'The descent step is w_new = w - lr*grad with two gradients: -(2/N) times the residuals for w0, residuals times x for w1. On our data the first step from the origin with lr=0.02 lands at (0.2408, 0.8832).' },
        { ar: 'حلقة كاملة بـ 2000 خطوة وlr=0.02 تهبط من 44.3420 إلى 0.0214 وتستقر عند (-0.0100, 2.0100) — نفس الحل المغلق تقريبًا، بلا أي مكتبة.', en: 'A full 2000-step loop with lr=0.02 falls from 44.3420 to 0.0214 and settles at (-0.0100, 2.0100) — essentially the closed-form answer, with no library at all.' },
        { ar: 'معدل التعلم قيد استقرار: حتى نحو 0.08 آمن على بياناتنا، وفوقه تذبذب وانفجار. والتقارب سريع أولًا ثم بطيء لأن التدرج يصغر قرب القاع.', en: 'The learning rate is a stability bound: up to about 0.08 it is safe on our data, beyond it oscillation and explosion. Convergence is fast early and slow later because the gradient shrinks near the bottom.' },
      ],
      reflectPrompt: {
        ar: 'بنيتَ التدريب كله من مجموع وجمع وضرب. لو ضاعفت عدد النقاط مئة مرة، أي جزء من الكود يتغير وأي جزء يبقى؟ وفكر: متى يصبح numpy ضرورة لا رفاهية؟',
        en: 'You built the whole training out of sums, addition and multiplication. If you multiplied the number of points by a hundred, which part of the code changes and which stays? Ponder: when does numpy become a necessity rather than a luxury?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch1.s3' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch1.s3' },
  ],
} satisfies Lesson;

export default lesson;
