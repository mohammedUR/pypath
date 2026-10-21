import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch2.l4 — "Constructing the Extensions from Scratch"
 * بناء امتدادات الانحدار من الصفر
 * Aligned with MLS ch2 s4 (Construction: Ridge/Lasso, Bayesian, Poisson classes).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved). The book builds classes
 * with numpy; here the penalized fits are pure Python on a fixed dataset.
 * Runnable design: X=[1..5], y=[2.1,3.9,6.1,7.8,10.2]; L2 term in the gradient,
 * a 2000-step ridge fit converging to the closed form (2.0, 1.34), and a lasso
 * subgradient step. Every literal verified under CPython 3.
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch2.l4',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 2,
  title: { ar: 'بناء امتدادات الانحدار من الصفر', en: 'Constructing the Extensions from Scratch' },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch2.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'تعرف الآن العقوبة نظريًا وتعرف التدريب عمليًا — والجمع أبسط مما تتخيل: أضف حدًا واحدًا إلى صيغة التدرج فتحصل على Ridge، واستبدله بإشارة فتحصل على Lasso. في هذا الدرس تكتب الخطوات الثلاث بيدك وتقارن حل النزول التدريجي المعاقَب بالحل المغلق المعادلات الطبيعية: (2.0, 1.34) بالطريقتين. كل الأرقام محسوبة مسبقًا، والاختبارات تعرف ما يجب أن تخرجه دوالك.',
        en: 'You know the penalty in theory and training in practice — and combining them is simpler than you think: add one term to the gradient formula and you have Ridge, swap it for a sign and you have Lasso. In this lesson you write the three steps by hand and compare penalized gradient descent against the closed-form normal equations: (2.0, 1.34) from both routes. Every number was computed in advance, and the tests already know what your functions must produce.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'العقوبة تدخل عبر التدرج', en: 'The penalty enters through the gradient' },
      chunks: [
        {
          ar: 'الهدف المعاقَب J(w) = MSE + λ*w1² مشتقته مجموع مشتقتيه: تدرج MSE كما هو، زائد 2λ*w1 من حد العقوبة (الحد الثابت w0 لا نعاقبه عادة). خطوة Ridge إذن: g1 = -(2/N) مجموع البواقي*x + 2λ*w1 ثم w1 -= lr*g1. عند w1 موجبة تدفع 2λ*w1 التدرج صعودًا فتقلل الخطوة الهابطة — هذا هو الانكماش في صميم الخوارزمية. والتحقق المغلق جاهز: المعادلات الطبيعية تُصبح n*w0 + Σx*w1 = Σy وΣx*w0 + (Σx² + Nλ)*w1 = Σxy — المعامل التربيعي يزداد Nλ فتُستقعرض المعاملات.',
          en: 'The penalized objective J(w) = MSE + λ*w1² differentiates as the sum of its parts: the MSE gradient unchanged, plus 2λ*w1 from the penalty term (the intercept w0 is customarily left unpenalized). A Ridge step is therefore: g1 = -(2/N) sum of residuals*x + 2λ*w1, then w1 -= lr*g1. For a positive w1 the term 2λ*w1 pushes the gradient up and shortens the downward step — shrinkage at the heart of the algorithm. The closed-form check is ready too: the normal equations become n*w0 + Σx*w1 = Σy and Σx*w0 + (Σx² + Nλ)*w1 = Σxy — the quadratic coefficient grows by Nλ, so the fitted slope shrinks.',
        },
        {
          ar: 'أما Lasso فعقوبته λ*|w1| غير قابلة للاشتقاق عند الصفر، فنستبدل المشتقة بخطوة تحت-التدرج: λ*sign(w1) حيث sign يعيد +1 للموجب و-1 للسالب و0 عند الصفر. الخطوة تبقى صالحة: كل قيمة تعيد بين 0 وsign(w1) من λ تصلح تحت-تدرجًا، واختيار sign نفسه هو الشائع. النتيجة العملية: حين يمر المعامل عبر الصفر تتوقف عقوبته عن دفعه فتتمكن Lasso من تثبيته عند الصفر تمامًا — أما المربع فيهبط ببطء متزايد ولا يصل أبدًا. وهذا سبب رياضي لصفر Lasso الشهير.',
          en: 'Lasso\u2019s penalty λ*|w1| is not differentiable at zero, so the derivative is replaced by a subgradient step: λ*sign(w1), where sign returns +1 for positive, -1 for negative, and 0 at zero. The step remains valid: any value between 0 and λ*sign(w1) works as a subgradient, and sign itself is the common choice. Practically: whenever a coefficient crosses zero, its penalty stops pushing, so Lasso can pin it at exactly zero — while the square descends ever more slowly and never arrives. That is the mathematical reason behind Lasso\u2019s famous zeros.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'Ridge بالتدرج مقابل الحل المغلق', en: 'Ridge by gradient versus the closed form' },
      code: "def ridge_closed_form(X, y, lam):\n    n = len(X)\n    sx = sum(X)\n    sy = sum(y)\n    sxx = sum(v * v for v in X)\n    sxy = sum(X[i] * y[i] for i in range(n))\n    det = n * (sxx + n * lam) - sx * sx\n    w0 = (sy * (sxx + n * lam) - sx * sxy) / det\n    w1 = (n * sxy - sy * sx) / det\n    return w0, w1\n\ndef fit_ridge(X, y, lam, lr, steps):\n    w0, w1 = 0.0, 0.0\n    n = len(X)\n    for _ in range(steps):\n        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + 2.0 * lam * w1\n        w0 -= lr * g0\n        w1 -= lr * g1\n    return w0, w1\n\nX = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\nc0, c1 = ridge_closed_form(X, y, 1.0)\ng0, g1 = fit_ridge(X, y, 1.0, 0.02, 2000)\nprint('closed-form ridge lam=1: w0=%.4f w1=%.4f' % (c0, c1))\nprint('gradient ridge   lam=1: w0=%.4f w1=%.4f' % (g0, g1))\nprint('gap: %.6f' % max(abs(c0 - g0), abs(c1 - g1)))",
      explanation: {
        ar: 'الطريقان يتفقان على (2.0000, 1.3400): الحل المغلق عاد مبيعًا من المعادلات الطبيعية المعدلة (المقام أكبر بـ Nλ = 5)، وحلقة التدريب وصلت إليه بعد 2000 خطوة بفجوة 0.000000. لاحظ الفرق عن الفصل الأول: الحد الثابت ارتفع من -0.01 إلى 2.0 بينما الميل انكمش من 2.01 إلى 1.34 — العقوبة تحرّك المعاملين معًا لأن البواقي تتغير فتوزع الغياب بين الميل والثابت. جرّب λ=4 في الملعب: الميل ينكمش إلى 0.67 والثابت يقفز إلى 4.01.',
        en: 'Both roads agree on (2.0000, 1.3400): the closed form comes straight from the modified normal equations (denominator grown by Nλ = 5), and the training loop reaches it after 2000 steps with a gap of 0.000000. Compare chapter one: the intercept rose from -0.01 to 2.0 while the slope shrank from 2.01 to 1.34 — the penalty moves both coefficients together because the residuals change and the shortfall is redistributed between slope and intercept. Try λ=4 in the sandbox: the slope contracts to 0.67 and the intercept jumps to 4.01.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.ridge-grad-step',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة ridge_grad_step(w0, w1, X, y, lr, lam) التي تحسب تدرجي MSE (كما في الفصل الأول) وتضيف 2.0*lam*w1 إلى g1 فقط، ثم تعيد الزوج المحدّث. عند الاستدعاء ridge_grad_step(0.0, 0.5, X, y, 0.02, 1.0) يجب أن ينتج (0.1808, 1.1432).',
        en: 'Implement ridge_grad_step(w0, w1, X, y, lr, lam) computing the two MSE gradients (as in chapter one) and adding 2.0*lam*w1 to g1 only, then returning the updated pair. Calling ridge_grad_step(0.0, 0.5, X, y, 0.02, 1.0) must produce (0.1808, 1.1432).',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ridge_grad_step(w0, w1, X, y, lr, lam):\n    ...  # TODO: MSE gradients + 2.0 * lam * w1 on g1, return updated pair\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ridge_grad_step(w0, w1, X, y, lr, lam):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + 2.0 * lam * w1\n    return w0 - lr * g0, w1 - lr * g1",
      tests: [
        {
          id: 't1',
          name: { ar: 'خطوة Ridge من (0, 0.5) صحيحة', en: 'The Ridge step from (0, 0.5) is correct' },
          code: "res = ridge_grad_step(0.0, 0.5, X, y, 0.02, 1.0)\nassert abs(res[0] - 0.1808) < 1e-9 and abs(res[1] - 1.1432) < 1e-9, 'expected (0.1808, 1.1432) | actual: %r' % (res,)",
          expected: '(0.1808, 1.1432)',
        },
        {
          id: 't2',
          name: { ar: 'العقوبة تقصّر خطوة الميل عن الخطوة العادية', en: 'The penalty shortens the slope step versus the plain step' },
          code: "def plain_step(w0, w1, X, y, lr):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n    return w0 - lr * g0, w1 - lr * g1\npr = plain_step(0.0, 0.5, X, y, 0.02)\nrr = ridge_grad_step(0.0, 0.5, X, y, 0.02, 1.0)\nassert rr[1] < pr[1] and abs(rr[0] - pr[0]) < 1e-9, 'expected a shortened w1 step with the same w0 step | ridge: %r plain: %r' % (rr, pr)",
          expected: '1.1432 < 1.1632',
        },
        {
          id: 't3',
          name: { ar: 'العقوبة تسحب الميل الموجب نحو الصفر', en: 'The penalty pulls a positive slope toward zero' },
          code: "res = ridge_grad_step(0.0, 0.5, X, y, 0.02, 1.0)\nplain = ridge_grad_step(0.0, 0.5, X, y, 0.02, 0.0)\nassert abs((plain[1] - res[1]) - (0.02 * 2.0 * 1.0 * 0.5)) < 1e-9, 'expected the lam term to shift w1 by exactly lr*2*lam*w1'",
          expected: 'shift = 0.02',
        },
      ],
      hints: [
        { ar: 'ابدأ من تدرج الفصل الأول حرفيًا ثم أضف + 2.0 * lam * w1 في نهاية سطر g1 فقط.', en: 'Start from the chapter-one gradient verbatim, then append + 2.0 * lam * w1 at the end of the g1 line only.' },
        { ar: 'عند (0, 0.5): البواقي 1.6, 2.9, 4.6, 5.8, 7.7 تعطي g0 = -9.04 وg1 = -33.16 قبل العقوبة، فتصبح -32.16 بعدها.', en: 'At (0, 0.5): residuals 1.6, 2.9, 4.6, 5.8, 7.7 give g0 = -9.04 and g1 = -33.16 before the penalty, -32.16 after.' },
        { ar: 'لا تضف العقوبة إلى g0 — الحد الثابت غير معاقَب في بنائنا، واختلاف عن ذلك يفسد t1 فورًا.', en: 'Do not add the penalty to g0 — our construction leaves the intercept unpenalized, and differing breaks t1 immediately.' },
        { ar: 'الأثر الحسابي للعقوبة على الخطوة: lr * 2 * lam * w1 = 0.02*2*1*0.5 = 0.02 بالضبط — لهذا 1.1632 - 0.02 = 1.1432.', en: 'The penalty shifts the step by lr * 2 * lam * w1 = 0.02*2*1*0.5 = 0.02 exactly — hence 1.1632 - 0.02 = 1.1432.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.full-ridge-fit',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اجمع الخطوات في حلقة: نفّذ دالة fit_ridge(X, y, lam, lr=0.02, steps=2000) تبدأ من (0.0, 0.0) وتكرر خطوة ridge_grad_step steps مرة وتعيد (w0, w1). عند lam=1 يجب أن تقترب من (2.0, 1.34) — قارنها في الاختبار بالحل المغلق ضمن 0.01.',
        en: 'Assemble the steps into a loop: implement fit_ridge(X, y, lam, lr=0.02, steps=2000) starting from (0.0, 0.0), repeating the ridge_grad_step steps times, and returning (w0, w1). At lam=1 it must approach (2.0, 1.34) — compare it in a test with the closed form within 0.01.',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ridge_grad_step(w0, w1, X, y, lr, lam):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + 2.0 * lam * w1\n    return w0 - lr * g0, w1 - lr * g1\n\ndef fit_ridge(X, y, lam, lr=0.02, steps=2000):\n    w0, w1 = 0.0, 0.0\n    ...  # TODO: repeat the ridge step, return (w0, w1)\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ridge_grad_step(w0, w1, X, y, lr, lam):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + 2.0 * lam * w1\n    return w0 - lr * g0, w1 - lr * g1\n\ndef fit_ridge(X, y, lam, lr=0.02, steps=2000):\n    w0, w1 = 0.0, 0.0\n    for _ in range(steps):\n        w0, w1 = ridge_grad_step(w0, w1, X, y, lr, lam)\n    return w0, w1",
      tests: [
        {
          id: 't1',
          name: { ar: 'حل النزول يقترب من (2.0, 1.34)', en: 'The descent solution approaches (2.0, 1.34)' },
          code: "w0, w1 = fit_ridge(X, y, 1.0)\nassert abs(w0 - 2.0) < 0.01 and abs(w1 - 1.34) < 0.01, 'expected about (2.0, 1.34) | actual: %r' % ((w0, w1),)",
          expected: '(2.0, 1.34)',
        },
        {
          id: 't2',
          name: { ar: 'الحل المغلق والنزول يتفقان ضمن 0.01', en: 'Closed form and descent agree within 0.01' },
          code: "def closed(X, y, lam):\n    n = len(X)\n    sx = sum(X)\n    sy = sum(y)\n    sxx = sum(v * v for v in X)\n    sxy = sum(X[i] * y[i] for i in range(n))\n    det = n * (sxx + n * lam) - sx * sx\n    return (sy * (sxx + n * lam) - sx * sxy) / det, (n * sxy - sy * sx) / det\nc0, c1 = closed(X, y, 1.0)\ng0, g1 = fit_ridge(X, y, 1.0)\nassert abs(c0 - g0) < 0.01 and abs(c1 - g1) < 0.01, 'expected agreement within 0.01 | gap: %r' % (max(abs(c0 - g0), abs(c1 - g1)),)",
          expected: 'gap = 0.000000',
        },
        {
          id: 't3',
          name: { ar: 'الميل المنكمش أصغر من ميل OLS', en: 'The shrunken slope is smaller than the OLS slope' },
          code: "w0, w1 = fit_ridge(X, y, 1.0)\nassert w1 < 2.01 and abs(w0 - 2.0) < 0.01, 'expected shrinkage below the OLS slope 2.01 with a moved intercept | actual: %r' % ((w0, w1),)",
          expected: 'w1 = 1.34 < 2.01',
        },
      ],
      hints: [
        { ar: 'الحلقة تبدأ من (0.0, 0.0) وتستدعي الخطوة في المكان: w0, w1 = ridge_grad_step(w0, w1, X, y, lr, lam).', en: 'The loop starts at (0.0, 0.0) and calls the step in place: w0, w1 = ridge_grad_step(w0, w1, X, y, lr, lam).' },
        { ar: 'لا تمرر steps إلى الخطوة — كل استدعاء خطوة واحدة؛ التكرار مسؤولية الحلقة.', en: 'Do not pass steps into the step — each call is one step; repetition is the loop\u2019s job.' },
        { ar: 'قيم تحقق: بعد 2000 خطوة عند lam=1 تكون عند (1.99999999, 1.34000000) — دقة تكفي لحد 0.01.', en: 'Sanity values: after 2000 steps at lam=1 you sit at (1.99999999, 1.34000000) — precise enough for a 0.01 bound.' },
        { ar: 'جرّب lam=0.0 داخل الملعب: يجب أن تعيد حل المربعات الصغرى (-0.01, 2.01) — اختبار سريع لصحة البناء.', en: 'Try lam=0.0 in the sandbox: it must return the least-squares answer (-0.01, 2.01) — a quick correctness check of the build.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.lasso-subgradient',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة lasso_step(w0, w1, X, y, lr, lam) بتحت-التدرج: g1 = تدرج MSE + lam*sign(w1) حيث sign(v) = (v > 0) - (v < 0)، وg0 بلا عقوبة. عند الاستدعاء lasso_step(0.0, 0.5, X, y, 0.02, 0.3) يجب أن ينتج (0.1808, 1.1572)، وعند w1=0 يجب أن تطابق الخطوة العادية تمامًا.',
        en: 'Implement lasso_step(w0, w1, X, y, lr, lam) with a subgradient: g1 = the MSE gradient + lam*sign(w1) where sign(v) = (v > 0) - (v < 0), and g0 unpenalized. Calling lasso_step(0.0, 0.5, X, y, 0.02, 0.3) must produce (0.1808, 1.1572), and at w1=0 it must match the plain step exactly.',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef sign(v):\n    return (v > 0) - (v < 0)\n\ndef lasso_step(w0, w1, X, y, lr, lam):\n    ...  # TODO: MSE gradients + lam * sign(w1) on g1, return updated pair\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef sign(v):\n    return (v > 0) - (v < 0)\n\ndef lasso_step(w0, w1, X, y, lr, lam):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + lam * sign(w1)\n    return w0 - lr * g0, w1 - lr * g1",
      tests: [
        {
          id: 't1',
          name: { ar: 'خطوة Lasso من (0, 0.5) صحيحة', en: 'The Lasso step from (0, 0.5) is correct' },
          code: "res = lasso_step(0.0, 0.5, X, y, 0.02, 0.3)\nassert abs(res[0] - 0.1808) < 1e-9 and abs(res[1] - 1.1572) < 1e-9, 'expected (0.1808, 1.1572) | actual: %r' % (res,)",
          expected: '(0.1808, 1.1572)',
        },
        {
          id: 't2',
          name: { ar: 'عند w1=0 تختفي العقوبة وتطابق الخطوة العادية', en: 'At w1=0 the penalty vanishes and the plain step matches' },
          code: "def plain_step(w0, w1, X, y, lr):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n    return w0 - lr * g0, w1 - lr * g1\nls = lasso_step(0.0, 0.0, X, y, 0.02, 0.3)\nps = plain_step(0.0, 0.0, X, y, 0.02)\nassert abs(ls[0] - ps[0]) < 1e-9 and abs(ls[1] - ps[1]) < 1e-9, 'expected (0.2408, 0.8832) for both | lasso: %r plain: %r' % (ls, ps)",
          expected: 'both (0.2408, 0.8832)',
        },
        {
          id: 't3',
          name: { ar: 'الإزاحة المسؤولة عنها الإشارة بمقدار lr*lam', en: 'The sign term shifts the step by exactly lr*lam' },
          code: "def plain_step(w0, w1, X, y, lr):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n    return w0 - lr * g0, w1 - lr * g1\nls = lasso_step(0.0, 0.5, X, y, 0.02, 0.3)\nps = plain_step(0.0, 0.5, X, y, 0.02)\nassert abs((ps[1] - ls[1]) - 0.02 * 0.3) < 1e-9, 'expected the subgradient shift lr*lam = 0.006 | actual: %r' % (ps[1] - ls[1],)",
          expected: 'shift = 0.006',
        },
      ],
      hints: [
        { ar: 'sign بالتعبير المنطقي يكفي: return (v > 0) - (v < 0) — يعيد 1 أو -1 أو 0 دون if.', en: 'A boolean expression suffices for sign: return (v > 0) - (v < 0) — yields 1, -1 or 0 without an if.' },
        { ar: 'الفرق عن Ridge: العبوة lam * sign(w1) لا lam * w1 — ثابتة المقدار لا تتلاشى قرب الصفر.', en: 'The difference from Ridge: lam * sign(w1) rather than lam * w1 — constant magnitude that never fades near zero.' },
        { ar: 'قيم تحقق: عند (0, 0.5) تدرج MSE هو -33.16، والرغوة +0.3 تجعله -32.86، فالخطوة 0.5 + 0.02*32.86 = 1.1572.', en: 'Sanity values: at (0, 0.5) the MSE gradient is -33.16; adding +0.3 makes it -32.86, so the step is 0.5 + 0.02*32.86 = 1.1572.' },
        { ar: 'عند w1=0 تكون sign(w1) = 0 فتصبح الخطوة مطابقة للعادية (0.2408, 0.8832) — هذه نقطة تماسك Lasso مع الصفر.', en: 'At w1=0 sign(w1) = 0, so the step equals the plain one (0.2408, 0.8832) — this is Lasso\u2019s zero-pinning point.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef sign(v):\n    return (v > 0) - (v < 0)\n\ndef step(w0, w1, lr, lam, kind):\n    n = len(X)\n    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n    if kind == 'ridge':\n        g1 += 2.0 * lam * w1\n    elif kind == 'lasso':\n        g1 += lam * sign(w1)\n    return w0 - lr * g0, w1 - lr * g1\n\nfor kind in ['ols', 'ridge', 'lasso']:\n    w0, w1 = 0.0, 0.0\n    for _ in range(2000):\n        w0, w1 = step(w0, w1, 0.02, 1.0, kind)\n    print('%-5s lam=1 -> w0=%.4f w1=%.4f' % (kind, w0, w1))\n\n# جرّب: lam=2.0 للعقوبتين — أيهما ينكمش أقوى عند هذه القيمة؟\n# try: lam=2.0 for both penalties — which shrinks harder at this value?\n# جرّب: ابدأ من w1=3.0 واتبع lasso بخمس خطوات — هل يقفز فوق الصفر أم يقترب منه؟\n# try: start from w1=3.0 and follow lasso for five steps — does it cross zero or approach it?\n",
      prompt: {
        ar: 'الملعب يركض مسابقة ثلاثية: OLS وRidge وLasso على البيانات نفسها وبنفس عدد الخطوات. من يصغّر الميل أكثر؟',
        en: 'The sandbox races three runners: OLS, Ridge and Lasso on the same data with the same step count. Who shrinks the slope most?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الحد الذي تضيفه عقوبة L2 إلى تدرج MSE بالنسبة إلى w1؟',
            en: 'What term does the L2 penalty add to the MSE gradient with respect to w1?',
          },
          options: [
            { id: 'a', text: { ar: '2*lam*w1', en: '2*lam*w1' } },
            { id: 'b', text: { ar: 'lam*sign(w1)', en: 'lam*sign(w1)' } },
            { id: 'c', text: { ar: 'lam*w1**2', en: 'lam*w1**2' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مشتقة lam*w1² هي 2*lam*w1. أما lam*sign(w1) فتحت-تدرج عقوبة L1، وlam*w1**2 هو الحد في الهدف نفسه لا في تدرجه.',
            en: 'The derivative of lam*w1² is 2*lam*w1. The term lam*sign(w1) is the L1 subgradient, and lam*w1**2 is the penalty inside the objective, not its gradient.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'على بياناتنا انكمش الميل من 2.01 (OLS) إلى 1.34 عند lam=1 وارتفع الحد الثابت من -0.01 إلى 2.0. لماذا تحرك المعاملان معًا؟',
            en: 'On our data the slope shrank from 2.01 (OLS) to 1.34 at lam=1 while the intercept rose from -0.01 to 2.0. Why did both move together?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن تقليل الميل يغيّر البواقي فيعيد موازنة الخط عبر متوسط النقاط', en: 'Because shrinking the slope changes the residuals, which re-balance the line through the mean point' } },
            { id: 'b', text: { ar: 'لأن العقوبة تطبق على الحد الثابت أيضًا', en: 'Because the penalty applies to the intercept too' } },
            { id: 'c', text: { ar: 'لأن الحلقة تكتب فوق w0 بالخطأ', en: 'Because the loop accidentally overwrites w0' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الخط يجب أن يمر عمليًا بمتوسط البيانات: حين يصغر الميل يرفع الحد الثابت نفسه ليلاحق نقاط x الصغيرة. لا عقوبة على w0 في بنائنا — حركته نتيجة لتغير البواقي.',
            en: 'The line effectively pivots through the data\u2019s mean: as the slope shrinks, the intercept rises to keep reaching the small-x points. No penalty sits on w0 in our build — its motion is a consequence of the changed residuals.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما الفرق الجوهري بين خطوة Ridge وخطوة Lasso عند w1 قريب من الصفر؟',
            en: 'What is the essential difference between a Ridge step and a Lasso step when w1 is near zero?',
          },
          options: [
            { id: 'a', text: { ar: 'دفع Ridge يذوب مع w1 (2*lam*w1 صغير)، ودفع Lasso ثابت المقدار lam*sign(w1) حتى يقطعه عند الصفر', en: 'Ridge\u2019s push fades with w1 (2*lam*w1 is small), while Lasso\u2019s push keeps magnitude lam*sign(w1) and can pin it at zero' } },
            { id: 'b', text: { ar: 'لا فرق — الاثنان متماثلان عند الصفر', en: 'No difference — both are identical at zero' } },
            { id: 'c', text: { ar: 'Ridge يقطع عند الصفر وLasso ينكمش فقط', en: 'Ridge cuts at zero while Lasso only shrinks' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قرب الصفر يقترب دفع Ridge من الصفر فيتباطأ الانكماش، بينما يبقى دفع Lasso بمقدار lam كاملًا فيكفّي لموازنة تدرج الخسارة — عندها يتوقف المعامل عند الصفر تمامًا. sign(0) = 0 تجعل لحظة التوقف سليمة حسابيًا.',
            en: 'Near zero Ridge\u2019s push approaches zero so shrinking stalls, while Lasso\u2019s push stays at full lam and can exactly balance the loss gradient — at that moment the coefficient stops at precisely zero. sign(0) = 0 makes the stopping moment mathematically clean.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'العقوبة تدخل التدريب عبر التدرج: Ridge يضيف 2*lam*w1 إلى g1، وLasso يضيف lam*sign(w1). الحد الثابت يبقى بلا عقوبة في بنائنا.', en: 'The penalty enters training through the gradient: Ridge adds 2*lam*w1 to g1, Lasso adds lam*sign(w1). The intercept stays unpenalized in our build.' },
        { ar: 'حلقة 2000 خطوة بـ lam=1 وlr=0.02 تصل إلى (2.0, 1.34) ويؤكدها الحل المغلق بالمعادلات الطبيعية المعدلة بفجوة 0.000000.', en: 'A 2000-step loop at lam=1 and lr=0.02 reaches (2.0, 1.34), confirmed by the closed form from the modified normal equations with a 0.000000 gap.' },
        { ar: 'نقطة تميز Lasso: دفعها ثابت المقدار فتستطيع تثبيت المعامل عند الصفر تمامًا (sign(0)=0 يجعل الخطوة سليمة)، بينما يذوب دفع Ridge قرب الصفر فلا يبلغها أبدًا.', en: 'Lasso\u2019s signature: its constant-magnitude push can pin a coefficient at exactly zero (sign(0)=0 keeps the step valid), while Ridge\u2019s push melts near zero and never gets there.' },
      ],
      reflectPrompt: {
        ar: 'بنيتَ العقوبتين كسطرين إضافيين على كود تعرفه. لو طُلب منك غرامة Huber (مربعة صغيرة وقاطعة كبيرة) — أي سطر ستحتاج لتعديله، وأين تظهر الحافة في التدرج؟',
        en: 'You built both penalties as two extra lines on code you know. If asked for a Huber charge (squared when small, linear when large) — which line would you modify, and where does the kink appear in the gradient?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch2.s4' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch2.s4' },
  ],
} satisfies Lesson;

export default lesson;
