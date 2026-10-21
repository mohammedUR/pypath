import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch2.l1 — "Regularized Regression: Ridge and Lasso"
 * الانحدار المنتظم: Ridge وLasso
 * Aligned with MLS ch2 s1 (Regularized Regression (Ridge and Lasso)).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved).
 * Runnable design: centered fixed data xc=[-2..2], yc=[-3.92,-2.12,0.08,1.78,4.18];
 * a ridge-objective grid scan showing the penalized argmin shifting from 2.00 to
 * 1.35 to 0.65 as lam grows. Every literal verified under CPython 3.
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch2.l1',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 2,
  title: { ar: 'الانحدار المنتظم: Ridge وLasso', en: 'Regularized Regression: Ridge and Lasso' },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch1.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'المربعات الصغرى تطارد البيانات حتى آخر نقطة — ولهذا تنفجر معاملاتها حين تتزاحم الميزات أو تنحرف بعض النقاط. الامتداد الأول في هذا الفصل يعالج ذلك بعقوبة: أضف إلى الخسارة غرامة تربيعية على حجم المعاملات فيحصل Ridge، أو غرامة قيم مطلقة فيحصل Lasso. ستشاهد بعينك — على بيانات ثابتة — كيف ينزلق قاع الدالة من 2.00 إلى 1.35 إلى 0.65 كلما شديدت العقوبة: هذا هو الانكماش shrinkage الذي يشتريه التسجيل بثمن تحيز صغير.',
        en: 'Least squares chases the data to the very last point — which is why its coefficients explode when features crowd together or a few points stray. The first extension of this chapter fixes that with a penalty: add a squared charge on coefficient size and you get Ridge, an absolute-value charge and you get Lasso. You will watch, on fixed data, the objective\u2019s bottom slide from 2.00 to 1.35 to 0.65 as the penalty hardens: that is shrinkage, bought with a small dose of bias.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'عقوبتان: L2 و L1', en: 'Two penalties: L2 and L1' },
      chunks: [
        {
          ar: 'انحدار Ridge يضيف إلى الخسارة λ مضروبة في مجموع مربعات المعاملات: J(w) = MSE + λ*w1² (على بيانات ممركزة يكفي معامل واحد). λ معامل التسجيل: صفر يعيد المربعات الصغرى، وكبره يسحق المعاملات نحو الصفر. للمعامل الوحيد على بيانات ممركزة الحل المغلق أنيق: w1* = Σxy / (Σxx + Nλ). على بياناتنا Σxy = 20.1 وΣxx = 10: عند λ=0 يكون w1* = 2.01، وعند λ=1 يكون 20.1/15 = 1.34، وعند λ=4 يكون 20.1/30 = 0.67 — مقام أكبر يعني معاملًا أصغر، وهذا هو الانكماش في صيغته الصريحة.',
          en: 'Ridge adds λ times the sum of squared coefficients to the loss: J(w) = MSE + λ*w1² (on centered data one coefficient suffices). λ is the regularization strength: zero recovers least squares, larger values press the coefficients toward zero. For a single coefficient on centered data the closed form is elegant: w1* = Σxy / (Σxx + Nλ). With our numbers Σxy = 20.1 and Σxx = 10: at λ=0 we get w1* = 2.01, at λ=1 it is 20.1/15 = 1.34, at λ=4 it is 20.1/30 = 0.67 — a bigger denominator buys a smaller coefficient. That is shrinkage in explicit form.',
        },
        {
          ar: 'انحدار Lasso يستبدل المربع بقيمة مطلقة: J(w) = MSE + λ*|w1|. الفرق عملي لا جمالي: العقوبة التربيعية ناعمة قرب الصفر فتنكمش المعاملات دون أن تبلغه غالبًا، بينما عقوبة القيمة المطلقة زاويّة فتدفع بعض المعاملات إلى الصفر تمامًا فتختار الميزات تلقائيًا. الثمن رياضي: الدالة لم تعد قابلة للاشتقاق عند الصفر، فنحتاج تحت-التدرج subgradient (إشارة الرقم) بدل التدرج العادي — وهذا موضوع بناء الفصل. في الممارسة يضبط λ بالتحقق المتقاطع عبر RidgeCV وLassoCV في sklearn.',
          en: 'Lasso swaps the square for an absolute value: J(w) = MSE + λ*|w1|. The difference is practical, not cosmetic: the squared penalty is gentle near zero, so coefficients shrink but rarely reach it, while the absolute penalty is kinked and pushes some coefficients to exactly zero — automatic feature selection. The price is mathematical: the objective is no longer differentiable at zero, so a subgradient (the sign function) replaces the ordinary gradient — the topic of this chapter\u2019s construction. In practice λ is tuned by cross validation through RidgeCV and LassoCV in sklearn.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'القاع ينزلق: مسح الهدف المُعاقَب', en: 'The bottom slides: scanning the penalized objective' },
      code: "xc = [-2, -1, 0, 1, 2]\nyc = [-3.92, -2.12, 0.08, 1.78, 4.18]\n\ndef ridge_obj(w1, lam):\n    n = len(xc)\n    loss = sum((yc[i] - w1 * xc[i]) ** 2 for i in range(n)) / n\n    return loss + lam * w1 * w1\n\nfor lam in [0.0, 1.0, 4.0]:\n    best = None\n    w = -2.5\n    while w <= 2.5001:\n        v = ridge_obj(w, lam)\n        if best is None or v < best[0]:\n            best = (v, w)\n        w += 0.05\n    print('lam=%.1f -> argmin w1=%.2f obj=%.4f' % (lam, best[1], best[0]))",
      explanation: {
        ar: 'البيانات ممركزة (المتوسطان صفر) فيصبح النموذج ŷ = w1*x دون حد ثابت. عند λ=0 يقف argmin عند 2.00 بخسارة 0.0216 — حل المربعات الصغرى. عند λ=1 ينزلق إلى 1.35 وعند λ=4 إلى 0.65: العقوبة المربعة تضيف λ*w1² فترفع كلفة البقاء بعيدًا عن الصفر. لاحظ أن الخسارة المُعاقَبة نفسها تتعاظم (0.0216 ثم 2.7151 ثم 5.4106) — لا نطارد خسارة أدنى، بل توازنًا مختلفًا بين مطابقة البيانات وبساطة النموذج.',
        en: 'The data is centered (both means zero) so the model is ŷ = w1*x with no intercept. At λ=0 the argmin sits at 2.00 with objective 0.0216 — the least-squares answer. At λ=1 it slides to 1.35 and at λ=4 to 0.65: the squared penalty adds λ*w1², raising the price of staying far from zero. Note the penalized objective itself grows (0.0216, then 2.7151, then 5.4106) — we are no longer chasing a lower loss but a different balance between fitting the data and keeping the model simple.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.ridge-argmin-scan',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة ridge_obj(w1, lam) على البيانات الممركزة المعطاة: متوسط مربعات (yc - w1*xc) زائد lam*w1². ثم امسح الشبكة من -2.5 إلى 2.5 بخطوة 0.05 لإيجاد argmin عند lam=0.0 وعند lam=1.0، واطبع السطرين بالصيغة lam=%.1f -> argmin w1=%.2f obj=%.4f.',
        en: 'Implement ridge_obj(w1, lam) on the given centered data: the mean of squared (yc - w1*xc) plus lam*w1². Then scan a grid from -2.5 to 2.5 in steps of 0.05 to find the argmin at lam=0.0 and at lam=1.0, printing two lines in the form lam=%.1f -> argmin w1=%.2f obj=%.4f.',
      },
      starterCode: "xc = [-2, -1, 0, 1, 2]\nyc = [-3.92, -2.12, 0.08, 1.78, 4.18]\n\ndef ridge_obj(w1, lam):\n    ...  # TODO: mean squared loss + lam * w1 * w1\n\n# TODO: scan w from -2.5 to 2.5 in steps of 0.05 for lam=0.0 and lam=1.0\n# TODO: print the two argmin lines\n",
      solution: "xc = [-2, -1, 0, 1, 2]\nyc = [-3.92, -2.12, 0.08, 1.78, 4.18]\n\ndef ridge_obj(w1, lam):\n    n = len(xc)\n    loss = sum((yc[i] - w1 * xc[i]) ** 2 for i in range(n)) / n\n    return loss + lam * w1 * w1\n\nfor lam in [0.0, 1.0]:\n    best = None\n    w = -2.5\n    while w <= 2.5001:\n        v = ridge_obj(w, lam)\n        if best is None or v < best[0]:\n            best = (v, w)\n        w += 0.05\n    print('lam=%.1f -> argmin w1=%.2f obj=%.4f' % (lam, best[1], best[0]))",
      tests: [
        {
          id: 't1',
          name: { ar: 'قيمة الهدف عند (2.0, 0.0) صحيحة', en: 'Objective value at (2.0, 0.0) is correct' },
          code: "assert abs(ridge_obj(2.0, 0.0) - 0.0216) < 1e-6, 'expected 0.0216 | actual: %r' % ridge_obj(2.0, 0.0)",
          expected: '0.0216',
        },
        {
          id: 't2',
          name: { ar: 'argmin عند lam=0 قرب حل المربعات الصغرى', en: 'argmin at lam=0 is near the least-squares slope' },
          code: "assert ridge_obj(2.01, 0.0) < ridge_obj(2.0, 0.0) and ridge_obj(2.01, 0.0) < ridge_obj(2.05, 0.0), 'expected the bowl to bottom out near 2.01'",
          expected: 'bottom near 2.01',
        },
        {
          id: 't3',
          name: { ar: 'العقوبة تنزلق القاع نحو الصفر', en: 'The penalty slides the bottom toward zero' },
          code: "assert ridge_obj(1.34, 1.0) < ridge_obj(2.01, 1.0) and ridge_obj(1.34, 1.0) < ridge_obj(0.9, 1.0), 'expected the lam=1 bottom between 0.9 and 2.01'",
          expected: 'bottom near 1.34',
        },
      ],
      hints: [
        { ar: 'الخسارة: مجموع (yc[i] - w1 * xc[i]) ** 2 على النقاط مقسومًا على n، ثم أضف lam * w1 * w1.', en: 'The loss: sum of (yc[i] - w1 * xc[i]) ** 2 over points divided by n, then add lam * w1 * w1.' },
        { ar: 'المسح: w = -2.5 ثم while w <= 2.5001 مع w += 0.05 — حدّث best حين تكون القيمة أدنى.', en: 'The scan: w = -2.5 then while w <= 2.5001 with w += 0.05 — update best whenever the value is lower.' },
        { ar: 'قيم تحقق: ridge_obj(2.0, 0.0) = 0.0216 وridge_obj(1.34, 1.0) ≈ 2.7013 — قاع λ=1 عند 1.34 نظريًا.', en: 'Sanity values: ridge_obj(2.0, 0.0) = 0.0216 and ridge_obj(1.34, 1.0) ≈ 2.7013 — the λ=1 bottom is 1.34 in theory.' },
        { ar: 'اطبع بسطر واحد لكل lam: lam=%.1f -> argmin w1=%.2f obj=%.4f — الاختبارات تقرأ القيم من الدالة لا من الطباعة.', en: 'Print one line per lam: lam=%.1f -> argmin w1=%.2f obj=%.4f — the tests read values from the function, not the prints.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-l1-l2',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي عبارتين تميزان أثر زيادة λ في انحدار Ridge عن أثرها في Lasso؟',
        en: 'Which statement best distinguishes the effect of increasing λ in Ridge from its effect in Lasso?',
      },
      options: [
        { id: 'a', text: { ar: 'في Ridge تنكمش المعاملات نحو الصفر تدريجيًا، وفي Lasso يمكن أن تصل بعضها إلى الصفر تمامًا', en: 'In Ridge coefficients shrink gradually toward zero, while in Lasso some can land at exactly zero' } },
        { id: 'b', text: { ar: 'في Ridge تصل المعاملات إلى الصفر تمامًا، وفي Lasso تنكمش فقط', en: 'In Ridge coefficients hit exactly zero, while in Lasso they only shrink' } },
        { id: 'c', text: { ar: 'زيادة λ لا تؤثر على المعاملات في الحالتين', en: 'Increasing λ leaves coefficients unchanged in both' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'شكل العقوبة قرب الصفر يحدد السلوك: w² ملساء و|w| عليها رأس حاد عند الصفر.', en: 'The penalty shape near zero decides behavior: w² is smooth while |w| has a sharp corner at zero.' },
        { ar: 'الرأس الحاد يجعل مساواة الخسارة في الاستمرار أو التوقف عند الصفر — فيختار Lasso الصفر تمامًا لبعض المعاملات.', en: 'The sharp corner makes stopping at zero exactly as good as continuing — so Lasso picks exactly zero for some coefficients.' },
        { ar: 'الملساء التربيعية تُصغّر المعامل باستمرار لكن معدل التصغير يتناقص قرب الصفر — فنادرًا ما يبلغه.', en: 'The smooth square shrinks a coefficient continuously but ever more slowly near zero — it rarely arrives.' },
        { ar: 'الجواب: a — Ridge للانكماش وLasso للانكماش مع اختيار ميزات.', en: 'Answer: a — Ridge for shrinkage, Lasso for shrinkage plus feature selection.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "xc = [-2, -1, 0, 1, 2]\nyc = [-3.92, -2.12, 0.08, 1.78, 4.18]\n\ndef ridge_obj(w1, lam):\n    n = len(xc)\n    loss = sum((yc[i] - w1 * xc[i]) ** 2 for i in range(n)) / n\n    return loss + lam * w1 * w1\n\ndef lasso_obj(w1, lam):\n    n = len(xc)\n    loss = sum((yc[i] - w1 * xc[i]) ** 2 for i in range(n)) / n\n    return loss + lam * abs(w1)\n\nfor lam in [0.0, 0.5, 1.0, 2.0]:\n    print('lam=%.1f ridge(2.0)=%.4f ridge(1.0)=%.4f | lasso(2.0)=%.4f lasso(1.0)=%.4f' % (\n        lam, ridge_obj(2.0, lam), ridge_obj(1.0, lam), lasso_obj(2.0, lam), lasso_obj(1.0, lam)))\n\n# جرّب: عند أي λ يصبح lasso_obj(0.0) أدنى من lasso_obj(1.0)؟ تلك عتبة القطع إلى الصفر.\n# try: at which lam does lasso_obj(0.0) beat lasso_obj(1.0)? That is the zeroing threshold.\n# جرّب: قارن ridge_obj وlasso_obj عند w1=-1.0 — هل العقوبتان متماثلتان للإشارة السالبة؟\n# try: compare ridge_obj and lasso_obj at w1=-1.0 — are both penalties symmetric in sign?\n",
      prompt: {
        ar: 'الملعب يقف بين العقوبتين: نفس الخسارة مع w1² أو |w1|. ابحث عن العتبة التي يقتطع عندها Lasso المعامل كليًا.',
        en: 'The sandbox parks you between the two penalties: same loss with w1² or |w1|. Hunt for the threshold where Lasso cuts the coefficient off entirely.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الذي يضيفه Ridge إلى خسارة المربعات؟',
            en: 'What does Ridge add to the squared loss?',
          },
          options: [
            { id: 'a', text: { ar: 'λ مضروبة في مجموع مربعات المعاملات (عقوبة L2)', en: 'λ times the sum of squared coefficients (an L2 penalty)' } },
            { id: 'b', text: { ar: 'λ مضروبة في مجموع القيم المطلقة للمعاملات (عقوبة L1)', en: 'λ times the sum of absolute coefficients (an L1 penalty)' } },
            { id: 'c', text: { ar: 'صفوفًا جديدة إلى البيانات', en: 'New rows to the data' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'Ridge = خسارة مربعات + λ*Σw². على بياناتنا الممركزة الحد الوحيد λ*w1². أما Σ|w| فعقوبة Lasso.',
            en: 'Ridge = squared loss + λ*Σw². On our centered data that single term is λ*w1². The sum of absolute values is Lasso\u2019s penalty.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'على بياناتنا كان الحل المغلق w1* = Σxy/(Σxx + Nλ) = 20.1/(10 + 5λ). ما قيمة الميل عند λ=4؟',
            en: 'On our data the closed form is w1* = Σxy/(Σxx + Nλ) = 20.1/(10 + 5λ). What is the slope at λ=4?',
          },
          options: [
            { id: 'a', text: { ar: '2.01', en: '2.01' } },
            { id: 'b', text: { ar: '1.34', en: '1.34' } },
            { id: 'c', text: { ar: '0.67', en: '0.67' } },
          ],
          answer: 'c',
          explanation: {
            ar: '20.1/(10+20) = 20.1/30 = 0.67: الميل نصف قيمته الأصلية تقريبًا. المسح الشبكي أكّده بـ 0.65 لأن شبكة 0.05 خشنة — الصيغة المغلق تعطي القيمة الدقيقة.',
            en: '20.1/(10+20) = 20.1/30 = 0.67: roughly half the original slope. The grid scan showed 0.65 only because the 0.05 grid is coarse — the closed form gives the exact value.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يوصف انكماش المعاملات بأنه مقايضة بين التحيز والتباين؟',
            en: 'Why is coefficient shrinkage described as a bias-variance trade?',
          },
          options: [
            { id: 'a', text: { ar: 'نقبل تحيزًا صغيرًا (نبتعد قليلًا عن مطابقة العينة) مقابل خفض تباين النموذج مع العينات الجديدة', en: 'We accept a little bias (slightly worse fit on the sample) in exchange for lower variance on new samples' } },
            { id: 'b', text: { ar: 'نقبل تحيزًا وتباينًا معًا أعلى', en: 'We accept both higher bias and higher variance' } },
            { id: 'c', text: { ar: 'لأن λ يقلل عدد النقاط', en: 'Because λ reduces the number of points' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المربعات الصغرى تلتصق بالضجيج فتتقلب معاملاتها من عينة لأخرى (تباين عالٍ). العقوبة تقيّد المعاملات فينحرف الحل قليلًا عن مطابقة العينة (تحيز صغير) لكنه يستقر أكثر على بيانات جديدة.',
            en: 'Least squares clings to noise, so its coefficients wobble from sample to sample (high variance). The penalty constrains them: the solution bends slightly away from the sample (small bias) but is steadier on new data.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'Ridge يضيف λ*Σw² (عقوبة L2) وLasso يضيف λ*Σ|w| (عقوبة L1) — كلاهما يعاقب حجم المعاملات ليكبح التلائم الزائد.', en: 'Ridge adds λ*Σw² (L2) and Lasso adds λ*Σ|w| (L1) — both charge for coefficient size to rein in overfitting.' },
        { ar: 'الانكماش قابل للقياس: على بياناتنا الممركزة انزلق argmin من 2.00 (λ=0) إلى 1.35 (λ=1) إلى 0.65 (λ=4)، وبالصيغة المغلق w1* = Σxy/(Σxx + Nλ).', en: 'Shrinkage is measurable: on our centered data the argmin slid from 2.00 (λ=0) to 1.35 (λ=1) to 0.65 (λ=4), with the closed form w1* = Σxy/(Σxx + Nλ).' },
        { ar: 'الفرق الجوهري: L2 ناعمة فتنكمش دون صفر، وL1 زاويّة فتقطع معاملات إلى الصفر تمامًا — اختيار ميزات ضمن الملاءمة، بتكلفة فقدان قابلية الاشتقاق عند الصفر.', en: 'The essential difference: L2 is smooth so weights shrink but rarely reach zero; L1 is kinked and cuts some weights to exactly zero — feature selection inside the fit, at the cost of differentiability at zero.' },
      ],
      reflectPrompt: {
        ar: 'شاهدت القاع ينزلق مع λ. متى تستفيد من انزلاق مقصود كهذا في مشروع حقيقي: ميزات مترابطة كثيرة؟ ضجيج قياس؟ أم حماية من نقاط شاذة؟ وما الذي تخسره مقابل كل فائدة؟',
        en: 'You watched the bottom slide with λ. When would such a deliberate slide help in a real project: many correlated features? measurement noise? protection from outliers? And what do you pay for each benefit?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch2.s1' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch2.s1' },
  ],
} satisfies Lesson;

export default lesson;
