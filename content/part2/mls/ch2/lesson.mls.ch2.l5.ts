import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch2.l5 — "Implementing the Extensions: OLS vs Ridge in Practice"
 * تنفيذ الامتدادات: OLS مقابل Ridge عمليًا
 * Aligned with MLS ch2 s5 (Implementation: Regularized, Bayesian, Poisson).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved). sklearn/statsmodels
 * appear in prose only, never as runnable code (platform rule).
 * Runnable design: same fixed data; closed-form OLS vs closed-form ridge on one
 * report with the shrinkage ratio printed. Every literal verified under CPython 3.
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch2.l5',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 2,
  title: { ar: 'تنفيذ الامتدادات: OLS مقابل Ridge عمليًا', en: 'Implementing the Extensions: OLS vs Ridge in Practice' },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch2.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'نهاية المطاف في أي نمذجة: تقرير مقارنة يظهر الفرق بعينيك. في هذا الدرس نضع OLS وRidge على البيانات نفسها في تقرير واحد، فتنكشف نسبة الانكماش 66.7% كما لو كانت فاتورة. ثم نستعرض كيف تُنفَّذ الامتدادات الثلاثة في المكتبات: Ridge وLasso عبر alpha، وBayesianRidge، وانحدار بواسون عبر GLM في statsmodels — بالاسم والفكرة، لأن كودك الصافي هنا يفعل نفس الرياضيات بالفعل.',
        en: 'Every modeling effort ends the same way: a comparison report that shows the difference with your own eyes. Here we put OLS and Ridge on the same data in one report, exposing a 66.7% shrinkage ratio as if it were an invoice. Then we survey how the three extensions are actually fit in libraries: Ridge and Lasso via alpha, BayesianRidge, and Poisson via GLM in statsmodels — by name and idea only, because your pure-python code from these lessons already does the same mathematics.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تقرير واحد يكشف الانكماش', en: 'One report exposes the shrinkage' },
      chunks: [
        {
          ar: 'المقارنة العادلة تُجرى على البيانات نفسها وبنفس الصيغة المغلق التي بنيناها: OLS يحل المعادلات الطبيعية العادية وRidge يحلها بمقام مضخم بـ Nλ. على بياناتنا: OLS يعطي (-0.01, 2.01) وRidge(lam=1) يعطي (2.0, 1.34) — فالانكماش ليس فكرة بل رقم: 1.34/2.01 = 66.7% من الميل الأصلي. والثابت عوض النقص لأن الخط يدور حول مركز البيانات. تقرير من ثلاثة أسطر يحكي كل شيء: من، وبأي قيم، وبأي نسبة.',
          en: 'A fair comparison runs on the same data with the same closed form we built: OLS solves the plain normal equations while Ridge solves them with a denominator inflated by Nλ. On our data OLS gives (-0.01, 2.01) and Ridge(lam=1) gives (2.0, 1.34) — so shrinkage is not an idea but a number: 1.34/2.01 = 66.7% of the original slope. The intercept compensates for the shortfall because the line pivots around the data\u2019s center. A three-line report tells the whole story: who, with which values, at which ratio.',
        },
        {
          ar: 'في الممارسة لا تكتب المعادلات يدويًا: sklearn يوفر Ridge(alpha=...) وLasso(alpha=...) حيث alpha هو λ عندنا، وRidgeCV وLassoCV يجربان شبكة قيم ويختاران بالتحقق المتقاطع — الكتاب جرب [0.01, 1, 100] فاختار 0.01 و1.0. وللانحدار البايزي BayesianRidge (يستنتج σ² وτ تلقائيًا بخلاف بنائنا ذي القيم المعروفة). وانحدار بواسون يُركب في statsmodels عبر GLM مع عائلة Poisson وربطها اللوغاريتمي الافتراضي. الفرق الجوهري: المكتبات تحسم λ بالبيانات، وتقريرك الصافي يجعلك تفهم ماذا اختارت ولماذا.',
          en: 'In practice you never hand-solve those equations: sklearn provides Ridge(alpha=...) and Lasso(alpha=...) where alpha is our λ, and RidgeCV and LassoCV sweep a grid and pick by cross validation — the book tried [0.01, 1, 100] and landed on 0.01 and 1.0. For Bayesian regression there is BayesianRidge (it infers σ² and τ itself, unlike our known-value construction). And Poisson regression is fitted in statsmodels through GLM with the Poisson family and its default log link. The essential difference: libraries decide λ from the data, and your pure-python report makes you understand what they chose and why.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تقرير OLS مقابل Ridge', en: 'The OLS versus Ridge report' },
      code: "def ridge_closed_form(X, y, lam):\n    n = len(X)\n    sx = sum(X)\n    sy = sum(y)\n    sxx = sum(v * v for v in X)\n    sxy = sum(X[i] * y[i] for i in range(n))\n    det = n * (sxx + n * lam) - sx * sx\n    w0 = (sy * (sxx + n * lam) - sx * sxy) / det\n    w1 = (n * sxy - sy * sx) / det\n    return w0, w1\n\nX = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\no0, o1 = ridge_closed_form(X, y, 0.0)\nr0, r1 = ridge_closed_form(X, y, 1.0)\nprint('OLS       w0=%.4f w1=%.4f' % (o0, o1))\nprint('Ridge(1)  w0=%.4f w1=%.4f' % (r0, r1))\nprint('shrinkage: w1 %.4f -> %.4f (%.1f%% kept)' % (o1, r1, 100.0 * r1 / o1))",
      explanation: {
        ar: 'سطر lam=0 داخل الدالة نفسها يعيد OLS — امتداد واحد يغطي الحالتين. التقرير: OLS (-0.0100, 2.0100) وRidge(1) (2.0000, 1.3400) ونسبة 66.7% محفوظة من الميل. لاحظ أن الإزاحة ليست في اتجاه واحد: المعامل المعاقَب فقط هو الذي يُسحق نحو الصفر، والمعامل الحر يعوض — لذا اقرأ تقارير الانكماش على المعامل المعاقَب تحديدًا. وبتغيير lam إلى 4 يهبط النسبة إلى 33.3% — جربها في الملعب وسترى العلاقة 10/(10+N*lam) تعمل كمنظم.',
        en: 'Passing lam=0 into the very same function returns OLS — one extension covers both cases. The report: OLS (-0.0100, 2.0100), Ridge(1) (2.0000, 1.3400), and a kept ratio of 66.7%. Notice the motion is not one-directional: only the penalized coefficient is crushed toward zero while the free one compensates — so read shrinkage reports on the penalized coefficient specifically. Setting lam=4 drops the ratio to 33.3% — try it in the sandbox and watch the factor 10/(10+N*lam) act like a regulator.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.ols-vs-ridge-report',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة ridge_closed_form(X, y, lam) بالمعادلات الطبيعية المعدلة (كما في الدرس الماضي)، ثم اطبع تقرير المقارنة الثلاثي على البيانات المعطاة: سطر OLS بسطر Ridge(1) بسطر shrinkage بالصيغ المعطاة في المثال، مع حساب النسبة 100.0*r1/o1.',
        en: 'Implement ridge_closed_form(X, y, lam) with the modified normal equations (as last lesson), then print the three-line comparison report on the given data: an OLS line, a Ridge(1) line, and a shrinkage line in the exact formats of the worked example, computing the ratio as 100.0*r1/o1.',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ridge_closed_form(X, y, lam):\n    ...  # TODO: modified normal equations, return (w0, w1)\n\n# TODO: o0, o1 = ridge_closed_form(X, y, 0.0) and r0, r1 = ridge_closed_form(X, y, 1.0)\n# TODO: print the three report lines\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ridge_closed_form(X, y, lam):\n    n = len(X)\n    sx = sum(X)\n    sy = sum(y)\n    sxx = sum(v * v for v in X)\n    sxy = sum(X[i] * y[i] for i in range(n))\n    det = n * (sxx + n * lam) - sx * sx\n    w0 = (sy * (sxx + n * lam) - sx * sxy) / det\n    w1 = (n * sxy - sy * sx) / det\n    return w0, w1\n\no0, o1 = ridge_closed_form(X, y, 0.0)\nr0, r1 = ridge_closed_form(X, y, 1.0)\nprint('OLS       w0=%.4f w1=%.4f' % (o0, o1))\nprint('Ridge(1)  w0=%.4f w1=%.4f' % (r0, r1))\nprint('shrinkage: w1 %.4f -> %.4f (%.1f%% kept)' % (o1, r1, 100.0 * r1 / o1))",
      tests: [
        {
          id: 't1',
          name: { ar: 'معاملات OLS دقيقة', en: 'The OLS coefficients are exact' },
          code: "o0, o1 = ridge_closed_form(X, y, 0.0)\nassert abs(o0 - (-0.01)) < 1e-9 and abs(o1 - 2.01) < 1e-9, 'expected (-0.01, 2.01) | actual: %r' % ((o0, o1),)",
          expected: '(-0.01, 2.01)',
        },
        {
          id: 't2',
          name: { ar: 'معاملات Ridge(lam=1) دقيقة', en: 'The Ridge(lam=1) coefficients are exact' },
          code: "r0, r1 = ridge_closed_form(X, y, 1.0)\nassert abs(r0 - 2.0) < 1e-9 and abs(r1 - 1.34) < 1e-9, 'expected (2.0, 1.34) | actual: %r' % ((r0, r1),)",
          expected: '(2.0, 1.34)',
        },
        {
          id: 't3',
          name: { ar: 'الانكماش ظاهر في التقرير والقيم', en: 'Shrinkage is visible in the report and the values' },
          code: "r0, r1 = ridge_closed_form(X, y, 1.0)\no0, o1 = ridge_closed_form(X, y, 0.0)\nassert abs(r1) < abs(o1) and abs(r1 / o1 - 0.6667) < 1e-3, 'expected the ridge slope about 66.7% of the ols slope | actual: %r' % (r1 / o1,)\nassert 'shrinkage: w1 2.0100 -> 1.3400 (66.7% kept)' in __learner_output__, 'expected the exact shrinkage line | actual: %r' % __learner_output__",
          expected: '66.7% kept',
        },
      ],
      hints: [
        { ar: 'المحدد det = n*(sxx + n*lam) - sx*sx — الفرق الوحيد عن معادلات OLS هو حد n*lam داخل sxx.', en: 'The determinant det = n*(sxx + n*lam) - sx*sx — the only change from OLS is the n*lam term inside sxx.' },
        { ar: 'w0 = (sy*(sxx + n*lam) - sx*sxy)/det وw1 = (n*sxy - sy*sx)/det — استبدل lam=0 فتحصل على OLS من الدالة نفسها.', en: 'w0 = (sy*(sxx + n*lam) - sx*sxy)/det and w1 = (n*sxy - sy*sx)/det — set lam=0 and the same function returns OLS.' },
        { ar: 'قيم تحقق: n=5 وsx=15 وsy=30.1 وsxx=55 وsxy=110.4؛ عند lam=1: det=75 وw1=1.34 وw0=2.0.', en: 'Sanity values: n=5, sx=15, sy=30.1, sxx=55, sxy=110.4; at lam=1: det=75, w1=1.34, w0=2.0.' },
        { ar: 'أسطر التقرير حرفيًا: OLS       w0=%.4f w1=%.4f ثم Ridge(1)  w0=%.4f w1=%.4f ثم shrinkage: w1 %.4f -> %.4f (%.1f%% kept) — انتبه للمسافات.', en: 'Report lines verbatim: OLS       w0=%.4f w1=%.4f then Ridge(1)  w0=%.4f w1=%.4f then shrinkage: w1 %.4f -> %.4f (%.1f%% kept) — mind the spacing.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-lam4-slope',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: بالمعادلات الطبيعية المعدلة على بياناتنا (n=5، sx=15، sy=30.1، sxx=55، sxy=110.4)، ما قيمة w1 في انحدار Ridge عندما lam=4؟ ذيّل الجواب لمنزلتين عشريتين.',
        en: 'Without running: with the modified normal equations on our data (n=5, sx=15, sy=30.1, sxx=55, sxy=110.4), what is w1 in Ridge when lam=4? Round to two decimals.',
      },
      answer: '0.67',
      solution: '0.67',
      tolerance: 0.01,
      hints: [
        { ar: 'المقام: det = 5*(55 + 5*4) - 15*15 = 375 - 225 = 150.', en: 'The denominator: det = 5*(55 + 5*4) - 15*15 = 375 - 225 = 150.' },
        { ar: 'البسط الخاص بالميل: n*sxy - sy*sx = 5*110.4 - 30.1*15 = 552 - 451.5 = 100.5.', en: 'The slope numerator: n*sxy - sy*sx = 5*110.4 - 30.1*15 = 552 - 451.5 = 100.5.' },
        { ar: 'قسّم: 100.5/150 = 0.67 — أي ثلث الميل الأصلي 2.01 تقريبًا (المقياس 10/(10+5*4)).', en: 'Divide: 100.5/150 = 0.67 — about a third of the original slope 2.01 (the factor 10/(10+5*4)).' },
        { ar: 'الجواب: 0.67', en: 'Answer: 0.67' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ridge_closed_form(X, y, lam):\n    n = len(X)\n    sx = sum(X)\n    sy = sum(y)\n    sxx = sum(v * v for v in X)\n    sxy = sum(X[i] * y[i] for i in range(n))\n    det = n * (sxx + n * lam) - sx * sx\n    w0 = (sy * (sxx + n * lam) - sx * sxy) / det\n    w1 = (n * sxy - sy * sx) / det\n    return w0, w1\n\nfor lam in [0.0, 0.5, 1.0, 2.0, 4.0, 10.0]:\n    w0, w1 = ridge_closed_form(X, y, lam)\n    print('lam=%4.1f -> w0=%7.4f w1=%7.4f kept=%5.1f%%' % (lam, w0, w1, 100.0 * w1 / 2.01))\n\n# جرّب: عند أي lam يهبط الميل دون 1.0؟ وهل يقترب w0 من ȳ = 6.02؟\n# try: at which lam does the slope drop below 1.0? And does w0 approach the mean 6.02?\n# جرّب: تخيل ميزة ثانية مترابطة — لماذا يصبح الانكماش أهم حينها؟ (فكر، ثم اكتب ملاحظتك في تعليق)\n# try: imagine a second correlated feature — why would shrinkage matter more then? (think, then note it in a comment)\n",
      prompt: {
        ar: 'الملعب يمحور λ من 0 إلى 10 ويعرض نسبة المحفوظ من الميل في كل صف. راقب إلى أين يتجه w0 والانكماش يعمق.',
        en: 'The sandbox sweeps λ from 0 to 10 and prints the kept-slope ratio per row. Watch where w0 drifts as shrinkage deepens.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في sklearn، ماذا يمثل وسيط alpha في Ridge(alpha=...)؟',
            en: 'In sklearn, what does the alpha argument in Ridge(alpha=...) represent?',
          },
          options: [
            { id: 'a', text: { ar: 'قوة التسجيل λ — نفس دور lam في بنائنا الصافي', en: 'The regularization strength λ — the same role as our lam in the pure-python build' } },
            { id: 'b', text: { ar: 'معدل التعلم في النزول التدريجي الداخلي', en: 'The learning rate of an internal gradient descent' } },
            { id: 'c', text: { ar: 'عدد التكرارات', en: 'The number of iterations' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'alpha في sklearn هو λ في كتابتنا: كلما زاد شِدّ العقوبة التربيعية وانكمشت المعاملات. وRidgeCV يجرب شبكة قيمها ويختار بالتحقق المتقاطع بدل التخمين.',
            en: 'alpha in sklearn is our λ: larger values harden the squared penalty and shrink coefficients further. RidgeCV sweeps a grid of alphas and picks by cross validation instead of guessing.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا ارتفع الحد الثابت من -0.01 (OLS) إلى 2.0 (Ridge lam=1) بينما انكمش الميل؟',
            en: 'Why did the intercept rise from -0.01 (OLS) to 2.0 (Ridge lam=1) while the slope shrank?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن العقوبة تُطبق على الميل فقط فيعوّض الثابت ليلاحق النقاط', en: 'Because the penalty applies to the slope only, so the intercept compensates to still reach the points' } },
            { id: 'b', text: { ar: 'لأن Ridge يضيف خطأً إلى w0', en: 'Because Ridge adds an error to w0' } },
            { id: 'c', text: { ar: 'لأن البيانات تغيرت بين الحسابين', en: 'Because the data changed between the two computations' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عقابنا على w1 حصرًا؛ حين يصغر الميل تحتاج الخط رفعًا للثابت ليغطي نقاط x الصغيرة. قراءة تقارير الانكماش تتركز على المعامل المعاقَب.',
            en: 'Our penalty targets w1 alone; as the slope shrinks the intercept must rise for the line to keep reaching the small-x points. Read shrinkage reports on the penalized coefficient.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما الذي يميز BayesianRidge في sklearn عن بنائنا البايزي في هذا الفصل؟',
            en: 'What distinguishes BayesianRidge in sklearn from our Bayesian construction in this chapter?',
          },
          options: [
            { id: 'a', text: { ar: 'أنه يستنتج σ² وτ من البيانات نفسها بخلاف بنائنا الذي يأخذهما معروفتين', en: 'It infers σ² and τ from the data itself, unlike our construction which takes them as known inputs' } },
            { id: 'b', text: { ar: 'أنه لا يستخدم توزيعات احتمالية إطلاقًا', en: 'It uses no probability distributions at all' } },
            { id: 'c', text: { ar: 'أنه لا يدعم الحد الثابت', en: 'It does not support an intercept' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'بناؤنا (المرافق بمعرفة σ² وτ) ينتج متوسطًا مرجحًا بالدقة في خطوة واحدة. أما BayesianRidge فيضع توزيعات مسبقة على مقلوب التباينين ويستنتجهما أثناء الملاءمة — أعم لكن أثقل حسابيًا.',
            en: 'Our conjugate build with known σ² and τ produces the precision-weighted mean in one step. BayesianRidge instead places priors on the inverse variances and infers them during fitting — more general, computationally heavier.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'تقرير المقارنة يجعل الانكماش رقمًا: OLS (-0.0100, 2.0100) مقابل Ridge(1) (2.0000, 1.3400) — 66.7% من الميل محفوظ، والعلاقة 10/(10+N*lam) تنظّمها.', en: 'A comparison report turns shrinkage into a number: OLS (-0.0100, 2.0100) versus Ridge(1) (2.0000, 1.3400) — 66.7% of the slope kept, regulated by the factor 10/(10+N*lam).' },
        { ar: 'الدالة المغلق نفسها تغطي الحالتين: lam=0 يعيد OLS، وأي قيمة أكبر تعيد Ridge — المعادلات الطبيعية المعدلة بسطر واحد معدل.', en: 'One closed-form function covers both cases: lam=0 returns OLS, any larger value returns Ridge — the modified normal equations differ by a single term.' },
        { ar: 'في المكتبات: Ridge(alpha) وLasso(alpha) مع RidgeCV/LassoCV لاختيار alpha بالتحقق المتقاطع، وBayesianRidge يستنتج σ² وτ، وPoisson يُركب في statsmodels عبر GLM بعائلة Poisson — كلها نفس الرياضيات التي بناها بصافي بايثون.', en: 'In libraries: Ridge(alpha) and Lasso(alpha) with RidgeCV/LassoCV picking alpha by cross validation, BayesianRidge infers σ² and τ, and Poisson rides statsmodels GLM with the Poisson family — all the same mathematics you built in pure python.' },
      ],
      reflectPrompt: {
        ar: 'قرأت الانكماش كنسبة 66.7%. لو كان لديك مئة ميزة مترابطة بدل ميزة واحدة — أي تقرير ستبني، وأي عدد من أسطر lam ستمسح، ولماذا يتحول الانكماش حينها من ترف إلى ضرورة؟',
        en: 'You read shrinkage as a 66.7% ratio. With a hundred correlated features instead of one — which report would you build, which lam values would you sweep, and why does shrinkage turn from a luxury into a necessity then?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch2.s5' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch2.s5' },
  ],
} satisfies Lesson;

export default lesson;
