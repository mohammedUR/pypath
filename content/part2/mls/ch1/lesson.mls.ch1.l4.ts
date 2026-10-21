import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch1.l4 — "Implementation: Three Ways to Fit One Line"
 * التنفيذ: ثلاث طرق لملاءمة خط واحد
 * Aligned with MLS ch1 s4 (Implementation). sklearn/statsmodels are referenced
 * in prose only, never as runnable code (platform rule).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved).
 * Runnable design: same fixed data X=[1..5], y=[2.1,3.9,6.1,7.8,10.2] fitted by
 * closed-form OLS (pure-python sums), 2000-step gradient descent, and the mean
 * baseline. Every literal verified under CPython 3 (tool-results/verify-17b.py).
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch1.l4',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 1,
  title: { ar: 'التنفيذ: ثلاث طرق لملاءمة خط واحد', en: 'Implementation: Three Ways to Fit One Line' },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch1.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'عندك الآن ثلاث إجابات محتملة عن سؤال الملاءمة: الحل المغلق الذي يحسب الجواب مباشرة، والنزول التدريجي الذي يزحف إليه، والخط الأساسي الذي لا يتعلم شيئًا. أيها تختار ومتى؟ هذا الدرس يقارن الثلاثة على البيانات نفسها التي دربتَ عليها في الدرس الماضي، ويظهر أن المغلق والنزول يلتقيان عند الخط نفسه بينما الخط الأساسي يتخلف عنهم بمسافة تبلغ مئات الأضعاف في الخسارة. وفي النهاية نسمي الأدوات التي يستعملها الممارسون فعليًا — sklearn وstatsmodels — بالاسم فقط.',
        en: 'You now hold three possible answers to the fitting question: the closed form that computes the answer directly, gradient descent that crawls toward it, and the mean baseline that learns nothing. Which do you pick, and when? This lesson races all three on the same data you trained on last lesson, showing that closed form and descent meet at the exact same line while the baseline lags orders of magnitude behind in loss. At the end we name the tools practitioners actually use — sklearn and statsmodels — by name only.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الحل المغلق: الميل من التباين المشترك', en: 'The closed form: slope from covariance over variance' },
      chunks: [
        {
          ar: 'للانحدار بخاصية واحدة يوجد حل مباشر بلا أي حلقة تكرار: الميل w1 = cov(x, y)/var(x) حيث cov متوسط (x - x̄)(y - ȳ) وvar متوسط (x - x̄)²، ثم الحد الثابت w0 = ȳ - w1*x̄. على بياناتنا: x̄ = 3 وȳ = 6.02، فالتغاير = 20.1/5 والتباين = 10/5، والميل = 20.1/10 = 2.01، والحد الثابت = 6.02 - 2.01*3 = -0.01. لاحظ أن كل ما نحتاجه مجموعات بسيطة: sum وطرح ومضاد — يُكتب في بايثون صافٍ في أسطر قليلة.',
          en: 'For single-feature regression a direct answer exists with no iteration at all: slope w1 = cov(x, y)/var(x), where cov is the average of (x - x̄)(y - ȳ) and var the average of (x - x̄)², then intercept w0 = ȳ - w1*x̄. On our data x̄ = 3 and ȳ = 6.02, so the covariance is 20.1/5, the variance 10/5, the slope 20.1/10 = 2.01, and the intercept 6.02 - 2.01*3 = -0.01. Notice everything reduces to simple sums: add, subtract, divide — a handful of pure-python lines.',
        },
        {
          ar: 'الخط الأساسي يتنبأ بمتوسط y دائمًا: w0 = ȳ وw1 = 0. خسارته على بياناتنا 8.1016 — وهي ببساطة تباين y. المقارنة الصادقة لأي نموذج تبدأ من هذا الرقم: نموذجنا خطي بحل دقيق يخفضها إلى 0.0214، أي أقل بنحو 379 مرة. عمليًا يكتب الممارسون سطرين في sklearn: LinearRegression() ثم fit()، أو صيغة R-style في statsmodels — كلاهما يعطي نفس معاملات حلنا المغلق. لكن معرفة ما يجري تحت الغطاء هي التي تخبرك متى يفشل الملاءمة ومتى تحتاج امتدادات الفصل الثاني.',
          en: 'The mean baseline always predicts ȳ: w0 = ȳ and w1 = 0. Its loss on our data is 8.1016 — simply the variance of y. Any honest model comparison starts from this number: our exact linear solution crushes it to 0.0214, roughly 379 times lower. In practice practitioners write two sklearn lines — LinearRegression() then fit() — or an R-style formula in statsmodels; both return the same coefficients as our closed form. But knowing what happens under the hood is what tells you when fitting fails and when you need the extensions of chapter two.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'ثلاث ملاءمات على بيانات واحدة', en: 'Three fits on one dataset' },
      code: "def ols_closed(X, y):\n    n = len(X)\n    mx = sum(X) / n\n    my = sum(y) / n\n    sxy = sum((X[i] - mx) * (y[i] - my) for i in range(n))\n    sxx = sum((X[i] - mx) ** 2 for i in range(n))\n    w1 = sxy / sxx\n    return my - w1 * mx, w1\n\ndef gd_fit(X, y, lr, steps):\n    w0, w1 = 0.0, 0.0\n    n = len(X)\n    for _ in range(steps):\n        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n        w0 -= lr * g0\n        w1 -= lr * g1\n    return w0, w1\n\ndef mse(w0, w1, X, y):\n    n = len(X)\n    return sum((y[i] - (w0 + w1 * X[i])) ** 2 for i in range(n)) / n\n\nX = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\ncf0, cf1 = ols_closed(X, y)\ngd0, gd1 = gd_fit(X, y, 0.02, 2000)\nmy = sum(y) / len(y)\nprint('closed-form: w0=%.4f w1=%.4f mse=%.4f' % (cf0, cf1, mse(cf0, cf1, X, y)))\nprint('gradient descent: w0=%.4f w1=%.4f mse=%.4f' % (gd0, gd1, mse(gd0, gd1, X, y)))\nprint('mean baseline: w0=%.4f w1=0.0000 mse=%.4f' % (my, mse(my, 0.0, X, y)))\nprint('max weight gap |cf - gd| = %.6f' % max(abs(cf0 - gd0), abs(cf1 - gd1)))",
      explanation: {
        ar: 'الطريقتان التعليميتان تلتقيان: الحل المغلق يعطي (-0.0100, 2.0100) بخسارة 0.0214، والنزول التدريجي بعد 2000 خطوة يعطي نفس القيم لأربع منازل عشرية وفجوة أوزان 0.000001 فقط. الخط الأساسي يقف عند (6.0200, 0) بخسارة 8.1016 — وهو رقم مرجعي مفيد: أي نموذج لا يهزمه لم يتعلم شيئًا من x. اقرأ الفجوة 0.000001 كحديث عن الدقة: قرب القاع يصغر التدرج فتتباطأ الخطوات، وللوصول إلى تطابق أطول تحتاج خطوات أكثر أو معدل تعلم أكبر ضمن حدود الأمان.',
        en: 'The two learning methods meet: the closed form gives (-0.0100, 2.0100) with loss 0.0214, and gradient descent after 2000 steps matches it to four decimals with a weight gap of just 0.000001. The mean baseline stands at (6.0200, 0) with loss 8.1016 — a useful reference: any model that cannot beat it learned nothing from x. Read the 0.000001 gap as a note on precision: near the bottom the gradient shrinks so steps slow, and closing the gap further needs more steps or a larger learning rate within the safety bound.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.closed-form-fit',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة ols_closed(X, y) التي تحسب الحل المغلق بمجموعات صافية: الميل = cov/var عبر متوسطي x وy، والحد الثابت = ȳ - w1*x̄، وتعيد (w0, w1). ثم اطبع التقرير الثلاثي: closed-form وgradient descent (استخدم حلقة النزول من الدرس الماضي بـ lr=0.02 وsteps=2000) وmean baseline مع خسارة كل منها بالصيغة %.4f.',
        en: 'Implement ols_closed(X, y) computing the closed form with plain sums: slope = cov/var via the means of x and y, intercept = ȳ - w1*x̄, returning (w0, w1). Then print the three-way report: closed-form, gradient descent (reuse last lesson\u2019s loop with lr=0.02 and steps=2000), and the mean baseline, each with its loss using %.4f.',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ols_closed(X, y):\n    ...  # TODO: slope from cov/var, intercept from the means, return (w0, w1)\n\ndef gd_fit(X, y, lr, steps):\n    w0, w1 = 0.0, 0.0\n    ...  # TODO: last lesson\u2019s loop\n\ndef mse(w0, w1, X, y):\n    ...  # TODO: mean squared error\n\n# TODO: print the three-line report with weights and losses\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ols_closed(X, y):\n    n = len(X)\n    mx = sum(X) / n\n    my = sum(y) / n\n    sxy = sum((X[i] - mx) * (y[i] - my) for i in range(n))\n    sxx = sum((X[i] - mx) ** 2 for i in range(n))\n    w1 = sxy / sxx\n    return my - w1 * mx, w1\n\ndef gd_fit(X, y, lr, steps):\n    w0, w1 = 0.0, 0.0\n    n = len(X)\n    for _ in range(steps):\n        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n        w0 -= lr * g0\n        w1 -= lr * g1\n    return w0, w1\n\ndef mse(w0, w1, X, y):\n    n = len(X)\n    return sum((y[i] - (w0 + w1 * X[i])) ** 2 for i in range(n)) / n\n\ncf0, cf1 = ols_closed(X, y)\ngd0, gd1 = gd_fit(X, y, 0.02, 2000)\nmy = sum(y) / len(y)\nprint('closed-form: w0=%.4f w1=%.4f mse=%.4f' % (cf0, cf1, mse(cf0, cf1, X, y)))\nprint('gradient descent: w0=%.4f w1=%.4f mse=%.4f' % (gd0, gd1, mse(gd0, gd1, X, y)))\nprint('mean baseline: w0=%.4f w1=0.0000 mse=%.4f' % (my, mse(my, 0.0, X, y)))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الحل المغلق هو (-0.01, 2.01)', en: 'The closed form is (-0.01, 2.01)' },
          code: "cf0, cf1 = ols_closed(X, y)\nassert abs(cf0 - (-0.01)) < 1e-9 and abs(cf1 - 2.01) < 1e-9, 'expected (-0.01, 2.01) | actual: %r' % ((cf0, cf1),)",
          expected: '(-0.01, 2.01)',
        },
        {
          id: 't2',
          name: { ar: 'النزول التدريجي يطابق المغلق ضمن 0.05', en: 'Gradient descent matches the closed form within 0.05' },
          code: "cf0, cf1 = ols_closed(X, y)\ngd0, gd1 = gd_fit(X, y, 0.02, 2000)\nassert abs(cf0 - gd0) < 0.05 and abs(cf1 - gd1) < 0.05, 'expected agreement within 0.05 | gap: %r' % (max(abs(cf0 - gd0), abs(cf1 - gd1)),)",
          expected: 'gap = 0.000001',
        },
        {
          id: 't3',
          name: { ar: 'النموذج يهزم الخط الأساسي ويطبع التقرير', en: 'The model beats the baseline and prints the report' },
          code: "assert 'mean baseline: w0=6.0200 w1=0.0000 mse=8.1016' in __learner_output__, 'expected the baseline line | actual: %r' % __learner_output__\ncf0, cf1 = ols_closed(X, y)\nv = sum((y[i] - (cf0 + cf1 * X[i])) ** 2 for i in range(len(X))) / len(X)\nassert v < 8.1016, 'expected the fitted mse to beat the baseline'",
          expected: 'baseline 8.1016, fitted 0.0214',
        },
      ],
      hints: [
        { ar: 'الميل: sxy = مجموع (X[i]-mx)*(y[i]-my) وsxx = مجموع (X[i]-mx)**2، ثم w1 = sxy / sxx.', en: 'Slope: sxy = sum of (X[i]-mx)*(y[i]-my) and sxx = sum of (X[i]-mx)**2, then w1 = sxy / sxx.' },
        { ar: 'الحد الثابت: w0 = my - w1 * mx — احسب mx وmy قبل الاستخدام.', en: 'Intercept: w0 = my - w1 * mx — compute mx and my before using them.' },
        { ar: 'قيم تحقق: mx = 3.0 وmy = 6.02 وsxy = 20.1 وsxx = 10.0 فيكون w1 = 2.01 وw0 = -0.01.', en: 'Sanity values: mx = 3.0, my = 6.02, sxy = 20.1, sxx = 10.0, hence w1 = 2.01 and w0 = -0.01.' },
        { ar: 'أسطر التقرير بالصيغة الثابتة: closed-form: وgradient descent: وmean baseline: — الاختبار الثالث يبحث عن سطر الأساس حرفيًا.', en: 'Report lines with the fixed prefixes: closed-form: and gradient descent: and mean baseline: — the third test looks for the baseline line verbatim.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-baseline-vs-ols',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقع خرجه حرفيًا دون تشغيله: يقارن خسارة الخط الأساسي بخسارة خط OLS المعطى جاهزًا.',
        en: 'Read the code and predict its output verbatim without running it: it compares the baseline loss against a ready-made OLS line.',
      },
      code: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\nn = len(y)\nmean_y = sum(y) / n\nbase_mse = sum((y[i] - mean_y) ** 2 for i in range(n)) / n\nols = (-0.01, 2.01)\nols_mse = sum((y[i] - (ols[0] + ols[1] * X[i])) ** 2 for i in range(n)) / n\nprint('baseline mse: %.4f' % base_mse)\nprint('ols mse: %.4f' % ols_mse)\nprint('gain: %.4f' % (base_mse - ols_mse))",
      solution: "baseline mse: 8.1016\nols mse: 0.0214\ngain: 8.0802",
      answer: "baseline mse: 8.1016\nols mse: 0.0214\ngain: 8.0802",
      hints: [
        { ar: 'mean_y = 30.1/5 = 6.02 وخسارة الأساس هي تباين y: 8.1016.', en: 'mean_y = 30.1/5 = 6.02 and the baseline loss is the variance of y: 8.1016.' },
        { ar: 'نبؤات خط OLS: 2.00, 4.01, 6.02, 8.03, 10.04 والبواقي مربعة تُجمع إلى 0.107 فيصبح المتوسط 0.0214.', en: 'OLS predictions: 2.00, 4.01, 6.02, 8.03, 10.04; squared residuals sum to 0.107, so the mean is 0.0214.' },
        { ar: 'السطر الأخير يطرح: 8.1016 - 0.0214 = 8.0802.', en: 'The last line subtracts: 8.1016 - 0.0214 = 8.0802.' },
        { ar: 'الخرج:\nbaseline mse: 8.1016\nols mse: 0.0214\ngain: 8.0802', en: 'The output:\nbaseline mse: 8.1016\nols mse: 0.0214\ngain: 8.0802' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef ols_closed(X, y):\n    n = len(X)\n    mx = sum(X) / n\n    my = sum(y) / n\n    sxy = sum((X[i] - mx) * (y[i] - my) for i in range(n))\n    sxx = sum((X[i] - mx) ** 2 for i in range(n))\n    w1 = sxy / sxx\n    return my - w1 * mx, w1\n\ndef mse(w0, w1, X, y):\n    n = len(X)\n    return sum((y[i] - (w0 + w1 * X[i])) ** 2 for i in range(n)) / n\n\nw0, w1 = ols_closed(X, y)\nprint('ols: w0=%.4f w1=%.4f' % (w0, w1))\nfor name, a, b in [('mean', sum(y) / len(y), 0.0), ('ols', w0, w1), ('bad line', 5.0, 1.0)]:\n    print('%-9s mse=%.4f' % (name, mse(a, b, X, y)))\n\n# جرّب: أضف خطًا سيئًا بنفسك — كم يجب أن يكون سيئًا حتى يخسر أمام متوسط y؟\n# try: add your own bad line — how bad must it be to lose to the y-mean?\n# جرّب: احذف نقطة واحدة وأعد الحل المغلق — أي معامل يتحرك أكثر؟\n# try: drop one point and redo the closed form — which coefficient moves more?\n",
      prompt: {
        ar: 'الملعب يجعل المقارنة لعبة: خط أساس، وخط OLS، وخط سيئ من صنعتك — من يكسب في الخسارة؟ لا اختبارات، فقط بوصلة رقمية.',
        en: 'The sandbox turns comparison into a game: a baseline, an OLS line, and a bad line of your own making — who wins on loss? No tests, just a numeric compass.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما صيغة الميل في الحل المغلق للانحدار بخاصية واحدة؟',
            en: 'What is the slope formula in the closed form for single-feature regression?',
          },
          options: [
            { id: 'a', text: { ar: 'cov(x, y) / var(x)', en: 'cov(x, y) / var(x)' } },
            { id: 'b', text: { ar: 'var(x) / cov(x, y)', en: 'var(x) / cov(x, y)' } },
            { id: 'c', text: { ar: 'mean(x) * mean(y)', en: 'mean(x) * mean(y)' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الميل نسبة التغاير إلى التباين: على بياناتنا 20.1/10 = 2.01. الحد الثابت يكمل الخط ليمر بمتوسط النقاط: w0 = ȳ - w1*x̄ = -0.01.',
            en: 'The slope is covariance over variance: on our data 20.1/10 = 2.01. The intercept completes the line through the point of means: w0 = ȳ - w1*x̄ = -0.01.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'خسارة الخط الأساسي (تنبؤ ȳ دائمًا) تساوي 8.1016 على بياناتنا. ماذا يمثل هذا الرقم إحصائيًا؟',
            en: 'The mean baseline (always predicting ȳ) scores 8.1016 on our data. What does this number mean statistically?',
          },
          options: [
            { id: 'a', text: { ar: 'تباين y — أي الخسارة عند نموذج يتجاهل x كليًا', en: 'The variance of y — the loss of a model that ignores x entirely' } },
            { id: 'b', text: { ar: 'مجموع y', en: 'The sum of y' } },
            { id: 'c', text: { ar: 'أدنى خسارة ممكنة لأي خط', en: 'The lowest loss any line can achieve' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التنبؤ بالمتوسط يترك البواقي = y - ȳ، ومتوسط مربعاتها هو تعريف التباين. لذلك يسمى مرجعًا: النموذج الجيد يجب أن يخفض الخسارة دون تباين الهدف، وإلا فلا معلومة استخلصها من x.',
            en: 'Predicting the mean leaves residuals y - ȳ whose mean square is, by definition, the variance. Hence the reference: a good model must push the loss below the target variance, otherwise it extracted no information from x.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'متى تختار النزول التدريجي على الحل المغلق رغم أن كليهما يصل لنفس الخط هنا؟',
            en: 'When would you pick gradient descent over the closed form even though both reach the same line here?',
          },
          options: [
            { id: 'a', text: { ar: 'حين تكون الميزات كثيرة أو البيانات ضخمة فتصبح معكوس المصفوفة مكلفة أو غير مستقرة', en: 'When features are many or data is huge, making matrix inversion costly or unstable' } },
            { id: 'b', text: { ar: 'حين نريد نتيجة أدق دائمًا', en: 'When we always want a more exact result' } },
            { id: 'c', text: { ar: 'حين تكون البيانات صغيرة جدًا', en: 'When the data is very small' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الحل المغلق يحسب (X^T X)⁻¹ X^T y — تكلفته تنفجر مع عدد الميزات، ويعاني حين يكون X^T X قريبًا من المفرد. النزول التدريجي يتدرج بسعر كل خطوة رخيص ويُوسَّع بسهولة، وهو أساس النماذج الأكبر لاحقًا.',
            en: 'The closed form computes (X^T X)⁻¹ X^T y — its cost explodes with feature count and it struggles when X^T X is near-singular. Gradient descent pays a cheap price per step and scales easily; it is the backbone of the larger models ahead.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الحل المغلق بلا تكرار: w1 = cov(x, y)/var(x) وw0 = ȳ - w1*x̄. على بياناتنا يعطي (-0.01, 2.01) بخسارة 0.0214.', en: 'The closed form needs no iteration: w1 = cov(x, y)/var(x) and w0 = ȳ - w1*x̄. On our data it yields (-0.01, 2.01) with loss 0.0214.' },
        { ar: 'النزول التدريجي (lr=0.02, 2000 خطوة) يطابق المغلق بفجوة أوزان 0.000001 فقط — طريقتان مختلفتان لجواب واحد.', en: 'Gradient descent (lr=0.02, 2000 steps) matches the closed form with a weight gap of only 0.000001 — two different roads to one answer.' },
        { ar: 'الخط الأساسي يتنبأ بـ ȳ فتكون خسارته تباين y = 8.1016: مرجع يهزمه أي نموذج يتعلم شيئًا من x. عمليًا تُستعمل sklearn وstatsmodels بنفس المعاملات، لكن فهم الداخل هو ما يوجه قراراتك.', en: 'The mean baseline predicts ȳ so its loss is the variance of y = 8.1016: a reference any model that learned something from x must beat. In practice sklearn and statsmodels give the same coefficients, but understanding the internals is what guides your decisions.' },
      ],
      reflectPrompt: {
        ar: 'الثلاث طرق أعطت ثلاثة تكاليف حسابية وقصة دقة مختلفة. لو كبرت بياناتك إلى مليون صف ومئة ميزة: أي طريقة تنجو وأيها ينهار أولًا، ولماذا؟',
        en: 'The three methods carry different computational costs and precision stories. If your data grew to a million rows and a hundred features: which method survives, which collapses first, and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch1.s4' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch1.s4' },
  ],
} satisfies Lesson;

export default lesson;
