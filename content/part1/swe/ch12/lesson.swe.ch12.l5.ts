import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch12.l5 — "Confidence Intervals and Simple Linear Regression
 * فترات الثقة والانحدار الخطي البسيط"
 * Aligned with SWE ch12 s8 (12.8 Confidence Intervals, pp.330-331:
 * definition, z vs t critical values) + s9 (12.9 Simple Linear Regression,
 * pp.332-334: through-origin, OLS fit, R-squared, causation/extrapolation
 * pitfalls).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * RUNNABLE-STATS design: a pure-Python CI (mean ± 1.96·s/√n and the book's
 * t* = 2.228 with df = 10) and an OLS fit from raw sums over the chapter's
 * fixed datasets (the 11-value cfds list and the size/defects pairs).
 * Deterministic only: no interactive reads, no exit, no seeding of any kind.
 */
const lesson = {
  id: 'swe.ch12.l5',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 12,
  title: { ar: 'فترات الثقة والانحدار الخطي البسيط', en: 'Confidence Intervals and Simple Linear Regression' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch12.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الدرس الماضي قرأ التشتت: صندوق ومدرج وs = 5.85. لكن اللوحة ما زالت تعرض رقمًا واحدًا — «متوسط العيوب 9» — وسيسألك مدير الإصدار القادم: تسعةً بالضبط؟ أم ما بين 5 و13؟ المتوسط تخمين من عينة، وفاصل الثقة هو التخمين نفسه بأشرطة خطأ: نطاق يحوط بالمتوسط الحقيقي في 95% من العينات المتكررة. ثم نقفز من متغير واحد إلى متغيرين: العيوب لا تنشأ في فراغ — كل ألف سطر إضافية تكلّف عيوبًا إضافية بنمط يقدَّر بخطّ مستقيم. اليوم نبني الاثنين بأيدينا على بيانات الفصل الثابتة نفسها: فاصل 95% حول المتوسط 9، وخطّ على بيانات الحجم/العيوب. بنهاية الدرس ستكون قادرًا على: تفسير فاصل الثقة تفسيرًا صحيحًا (ثقة في الإجراء لا احتمال للفاصل)، وحساب الخطأ المعياري والهامش من المجاميع، وملاءمة خطّ المربعات الصغرى، ومعرفة متى يُمنع النموذج من التنبؤ.',
        en: 'Last lesson read dispersion: boxplot, histogram, s = 5.85. Yet the board still shows one number — \u201cmean defects 9\u201d — and next release\u2019s manager will ask: exactly nine? Or somewhere between 5 and 13? A mean is a guess from a sample, and a confidence interval is the same guess with error bars: a range that brackets the true mean in 95% of repeated samples. Then we jump from one variable to two: defects do not arise in a vacuum — every extra thousand lines costs extra defects in a pattern a straight line can estimate. Today we build both by hand on the chapter\u2019s fixed data: a 95% interval around the mean of 9, and a line over the size/defects pairs. By the end you will be able to: interpret a confidence interval correctly (confidence in the procedure, not probability for one interval), compute the standard error and margin from sums, fit a least-squares line, and know when a model must refuse to predict.',
      },
    },
    {
      kind: 'predict',
      code: "import statistics\na = [7, 8, 9, 10, 11]\nb = [1, 2, 9, 16, 17]\nprint('a mean: %.1f s: %.2f' % (statistics.mean(a), statistics.stdev(a)))\nprint('b mean: %.1f s: %.2f' % (statistics.mean(b), statistics.stdev(b)))",
      question: {
        ar: 'عينتان ومتوسط واحد: 9.0 في كلتيهما. أيهما تخبرك بثقة أكبر عن متوسط العملية الحقيقي؟ وحاول تسمية الرقم الذي يعبر عن الثقة — هل هو s وحده؟',
        en: 'Two samples, one mean: 9.0 in both. Which one tells you more confidently about the process\u2019s true mean? And try naming the number that expresses the confidence — is s alone enough?',
      },
      reveal: {
        ar: 'الطباعة: a mean: 9.0 s: 1.58 ثم b mean: 9.0 s: 7.52 — الانتشار مختلف بخمس مرات والمتوسط واحد. لكن s وحده لا يجيب: عينة من ألف قراءة بانتشار 7.5 قد تكون أدق من عينة من خمس بانتشار 1.58. الجواب يوحّد الانتشار وحجم العينة في رقم واحد: الخطأ المعياري SE = s/√n — حوالي 0.71 للعينة a و3.36 للعينة b — وهو قلب فاصل الثقة الذي نبنيه بعد قليل.',
        en: 'It prints a mean: 9.0 s: 1.58 then b mean: 9.0 s: 7.52 — spread differs fivefold, mean identical. But s alone cannot answer: a thousand readings with spread 7.5 may pin the mean better than five readings with 1.58. The answer folds spread and sample size into one number: the standard error SE = s/\u221an — about 0.71 for sample a and 3.36 for sample b — the heart of the confidence interval we build next.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خطأ المعاينة وفاصل الثقة: رقم بأشرطة خطأ', en: 'Sampling error and the confidence interval: a number with error bars' },
      chunks: [
        {
          ar: 'متوسط العينة تخمين: خذ عينات مختلفة من العملية نفسها فتحصل على متوسطات مختلفة قليلًا — هذا خطأ المعاينة لا خطؤك. فاصل الثقة يطوّق المتوسط بهامش محسوب: ‏x̄ ± (القيمة الحرجة) × (الخطأ المعياري)، حيث الخطأ المعياري SE = s/√n. لاحظ الجذر: لتصغير أشرطة الخطأ إلى النصف تحتاج أربعة أضعاف البيانات — الضغط سريع أولًا ثم بطيء. وفاصل 95% إجراءٌ، إذا كررته على عينات كثيرة، أحاط بالمتوسط الحقيقي في 95% من المرات.',
          en: 'A sample mean is a guess: draw different samples from the same process and you get slightly different means — that is sampling error, not your mistake. A confidence interval wraps the mean in a computed margin: x\u0304 \u00b1 (critical value) \u00d7 (standard error), where the standard error is SE = s/\u221an. Notice the square root: to halve your error bars you need four times the data — fast gains first, then slow. A 95% interval is a procedure which, over many repeated samples, brackets the true mean 95% of the time.',
        },
        {
          ar: 'والتفسير مغري بالخطأ: ليس صحيحًا أن «الاحتمال 95% أن المتوسط الحقيقي داخل هذا الفاصل تحديدًا». المتوسط الحقيقي رقم ثابت لا نعرفه — إما داخل فاصلك أو خارجه، ولا حظّ فيه. الـ95% تصف معدل نجاح الإجراء على المدى الطويل، لا حظّ فاصل واحد. لذا تتكلم عن الثقة في الطريقة لا عن احتمال المعامل. من يكسر هذه القاعدة يبيع للإدارة يقينًا لا يملكه أي إجراء إحصائي.',
          en: 'The tempting misreading: it is not true that \u201cthere is a 95% probability the true mean is in this particular interval.\u201d The true mean is a fixed number we do not know — it is either inside your interval or outside, no odds about it. The 95% describes the long-run success rate of the method, not the odds for one interval. So you speak of confidence in the procedure, never probability of the parameter. Whoever breaks this rule sells management a certainty no statistical procedure owns.',
        },
        {
          ar: 'وأي قيمة حرجة؟ إن كان σ للمجتمع معروفًا من سجلات تاريخية طويلة لعملية مستقرة فاستعمل z* = 1.96. أما المعتاد فσ مجهولة وتُقدَّر بـs من العينة نفسها — فيرتفع الثمن إلى t بدرجات حرية df = n−1: على بياناتنا (n = 11) القيمة t* = 2.228، أكبر من 1.96 لأنك دفعت ثمن انتشار مقدَّر وعينة صغيرة. وقاعدة الكتاب الجامعة: لا تُبلّغ عن تحسّن قبل/بعد بلا فاصل ثقة — وتقاطع فاصلين منفصلين ليس اختبارًا للفرق؛ ابنِ فاصلًا واحدًا للفرق نفسه.',
          en: 'Which critical value? If the population \u03c3 is known from long historical records of a stable process, use z* = 1.96. Usually \u03c3 is unknown and estimated by s from the same sample — so the price rises to t with df = n\u22121 degrees of freedom: on our data (n = 11) the value is t* = 2.228, larger than 1.96 because you pay for an estimated spread and a small sample. And the book\u2019s blanket rule: never report a before/after change without a confidence interval — and the overlap of two separate intervals is not a test of the difference; build one interval for the difference itself.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'فاصل 95% حول 9 — من المجاميع لا من المكتبة', en: 'A 95% interval around 9 — from sums, not from a library' },
      code: "cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]\nn = len(cfds)\nsx = 0\nfor v in cfds:\n    sx = sx + v\nmean = sx / n\nss = 0\nfor v in cfds:\n    ss = ss + (v - mean) ** 2\ns = (ss / (n - 1)) ** 0.5\nse = s / n ** 0.5\nprint('n: %d mean: %.2f s: %.2f' % (n, mean, s))\nprint('SE: %.2f' % se)\nprint('z 95%% CI: (%.2f, %.2f)' % (mean - 1.96 * se, mean + 1.96 * se))\nprint('t 95%% CI: (%.2f, %.2f)' % (mean - 2.228 * se, mean + 2.228 * se))",
      explanation: {
        ar: 'كل خطوة من الدروس السابقة إلا خطوة واحدة جديدة: المجاميع sx وss تعيدان 99 و342 — مجموع مربعات الانحرافات الذي حسبناه باليد في الدرس الرابع — فيخرج s = 5.85 كما تحققنا سابقًا. الجديد سطران: SE = s/√11 ≈ 1.76 يوحّد الانتشار بحجم العينة، ثم الهامش = القيمة الحرجة × SE. بقيمة z = 1.96: الفاصل (5.54, 12.46) — تقريب النظام الكبير. بقيمة t = 2.228 لدرجات حرية 10: الفاصل (5.07, 12.93) — هذا فاصل الكتاب على بياناتنا حرفيًّا، وأعرض من فاصل z لأن العينة صغيرة وσ مقدَّرة. والقراءة: معدل العيوب الحقيقي للعملية يقع محتملًا في أي مكان بين 5 و13 عيبًا للإصدار — أي «تحسّن» مستقبلي يجب أن يخرج من هذا النطاق حتى نظنّه حقيقيًّا لا ربعًا محظوظًا.',
        en: 'Every step comes from earlier lessons except one new move: the sums sx and ss come back 99 and 342 — the sum of squared deviations computed by hand in lesson four — so s = 5.85 exactly as we verified before. The new lines are two: SE = s/\u221a11 \u2248 1.76 folds spread and sample size together, then margin = critical value \u00d7 SE. With z = 1.96 the interval is (5.54, 12.46) — the large-sample approximation. With t = 2.228 at 10 degrees of freedom it is (5.07, 12.93) — the book\u2019s interval on our data verbatim, wider than the z one because the sample is small and \u03c3 was estimated. The reading: the process\u2019s true defect rate plausibly lies anywhere between 5 and 13 defects per release — any future \u201cimprovement\u201d must leave that band before we believe it is real and not a lucky quarter.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الانحدار الخطي البسيط: من متغير إلى متغيرين', en: 'Simple linear regression: from one variable to two' },
      chunks: [
        {
          ar: 'فاصل الثقة يلخّص متغيرًا واحدًا. الانحدار يصمّم اعتمادًا: كيف تعتمد العيوب y على حجم الوحدة x؟ بيانات الفصل الثانية الثابتة: أحجام x = [2, 4, 6, 8, 10] ألف سطر وعيوب عملاء y = [5, 9, 10, 13, 18]. طريقة المربعات الصغرى تختار الخط ŷ = b0 + b1x الذي يصغّر مجموع مربعات البواقي العمودية e = y − ŷ — التربيع يجعل المسألة قابلة للحل بسلاسة ويعاقب الأخطاء الكبيرة بشدة. والحل من المجاميع: b1 = Sxy/Sxx وb0 = ȳ − b1·x̄ — والصيغة تضمن مرور الخط بنقطة المتوسطات (x̄, ȳ)، فحصَ صحّة جاهز لأي حساب يدوي.',
          en: 'A confidence interval summarizes one variable. Regression models dependence: how do defects y depend on module size x? The chapter\u2019s second fixed dataset: sizes x = [2, 4, 6, 8, 10] KLOC and customer-found defects y = [5, 9, 10, 13, 18]. Ordinary least squares picks the line \u0177 = b0 + b1x that minimizes the sum of squared vertical residuals e = y \u2212 \u0177 — squaring makes the problem smoothly solvable and punishes large misses heavily. The solution from sums: b1 = Sxy/Sxx and b0 = \u0233 \u2212 b1\u00b7x\u0304 — and the intercept formula guarantees the line passes through the point of averages (x\u0304, \u0233), a built-in sanity check for any hand computation.',
        },
        {
          ar: 'اقرأ المعاملين بمعنى لا برقم: الميل b1 = 1.5 يقول إن كل ألف سطر إضافية تجلب نحو 1.5 عيب إضافي — معدل، وهو الرقم القابل للتنفيذ في تخطيط الاختبار. والتقاطع b0 = 2 هو تنبؤ النموذج عند حجم صفري — وهنا أثر رياضي بلا معنى فيزيائي: وحدة بحجم صفر لا تحمل عيبين. البواقي تجمع صفرًا حتمًا مع التقاطع (0 + 1 − 1 − 1 + 1 = 0)، وR² = 1 − SSE/SST يقيس كم من تباين y فسّره x: هنا 1 − 4/94 ≈ 0.957 — الحجم يفسّر نحو 96% من تباين العيوب، علاقة قوية بمعايير أي بيانات.',
          en: 'Read both coefficients as meaning, not as numbers: the slope b1 = 1.5 says every extra KLOC brings about 1.5 more defects — a rate, the actionable number for test planning. The intercept b0 = 2 is the model\u2019s prediction at zero size — here a mathematical artifact with no physical meaning: a zero-size module does not carry two defects. Residuals always sum to zero with an intercept (0 + 1 \u2212 1 \u2212 1 + 1 = 0), and R\u00b2 = 1 \u2212 SSE/SST measures how much of y\u2019s variation x explains: here 1 \u2212 4/94 \u2248 0.957 — size explains about 96% of the variation in defects, a strong relationship by any standard.',
        },
        {
          ar: 'وحكمان يحرسان النموذج: أولهما الارتباط لا السببية — R² عالٍ بين الحجم والعيوب لا يثبت أن تصغير الوحدات يخفض العيوب؛ فقد يدفعهما عامل ثالث واحد (ميزات متسرعة معقدة: كبيرة ومعيبة معًا). وثانيهما لا استقراء: النموذج ملائم على مدى 2–10 ألف سطر ولا يقول شيئًا موثوقًا عن وحدة من 40 ألفًا ولا عن الصفر. الانحدار يصف البيانات التي لديك في مداها الذي لديك — توقّع داخل المدى، وبتواضع.',
          en: 'Two guards protect the model: first, association is not causation — a high R\u00b2 between size and defects does not prove that shrinking modules lowers defects; a single third factor may drive both (rushed, complex features: large and buggy together). Second, never extrapolate: the model is fit on 2\u201310 KLOC and says nothing reliable about a 40-KLOC module or about zero. Regression describes the data you have, in the range you have it — predict inside the range, with humility.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.z-trace',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. مراجعة سريعة: n ** 0.5 هو الجذر التربيعي، و%.2f يعرض منزلتين عشريتين.',
        en: 'Read the code and predict its exact output — one line per print — without running it. A quick refresher: n ** 0.5 is the square root, and %.2f shows two decimals.',
      },
      code: "n = 36\nmean = 45.0\nse = 12.0 / n ** 0.5\nprint('SE: %.2f' % se)\nprint('CI: (%.2f, %.2f)' % (mean - 1.96 * se, mean + 1.96 * se))",
      solution: 'SE: 2.00\nCI: (41.08, 48.92)',
      answer: 'SE: 2.00\nCI: (41.08, 48.92)',
      hints: [
        { ar: '√36 = 6 لأن 6 × 6 = 36 — فn ** 0.5 يعيد 6.0 بالضبط.', en: '\u221a36 = 6 because 6 \u00d7 6 = 36 — so n ** 0.5 returns exactly 6.0.' },
        { ar: 'الخطأ المعياري: 12.0 ÷ 6.0 = 2.0 — فيطبع SE: 2.00.', en: 'The standard error: 12.0 / 6.0 = 2.0 — printed as SE: 2.00.' },
        { ar: 'الهامش: 1.96 × 2.0 = 3.92 — والفاصل 45 − 3.92 = 41.08 و45 + 3.92 = 48.92 (مثال z من الشارح: مراجعات كود بمتوسط 45 دقيقة وσ = 12 معروفة).', en: 'The margin: 1.96 \u00d7 2.0 = 3.92 — the interval is 45 \u2212 3.92 = 41.08 and 45 + 3.92 = 48.92 (the worked z example: code reviews averaging 45 minutes with known \u03c3 = 12).' },
        { ar: 'الخرج:\nSE: 2.00\nCI: (41.08, 48.92)', en: 'The output:\nSE: 2.00\nCI: (41.08, 48.92)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.ols-fit',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'خطّ المربعات الصغرى من المجاميع الخام (x وy جاهزان — بيانات الحجم/العيوب الثابتة): احسب sx وsy وsxy = مجموع x×y وsxx = مجموع x²، ثم b1 = (m·sxy − sx·sy) / (m·sxx − sx²) وb0 = (sy − b1·sx) / m حيث m = len(x). ثم البواقي e = y − (b0 + b1·x) لكل عنصر مع مجموعها، وsse = مجموع مربعات البواقي، وsst = مجموع مربعات (y − متوسط y)، وr2 = 1 − sse/sst. اطبع خمسة أسطر بهذه الصيغ حرفيًّا: b1: %.2f ثم b0: %.2f ثم fit: yhat = %.2f + %.2f x ثم residuals sum: %.1f ثم R2: %.3f. المتوقع: b1: 1.50 / b0: 2.00 / fit: yhat = 2.00 + 1.50 x / residuals sum: 0.0 / R2: 0.957.',
        en: 'The least-squares line from raw sums (x and y are given — the fixed size/defects dataset): compute sx, sy, sxy = sum of x*y and sxx = sum of x squared, then b1 = (m*sxy - sx*sy) / (m*sxx - sx**2) and b0 = (sy - b1*sx) / m where m = len(x). Then the residuals e = y - (b0 + b1*x) with their sum, sse = sum of squared residuals, sst = sum of squared (y - mean of y), and r2 = 1 - sse/sst. Print exactly five lines: b1: %.2f, then b0: %.2f, then fit: yhat = %.2f + %.2f x, then residuals sum: %.1f, then R2: %.3f. Expected: b1: 1.50 / b0: 2.00 / fit: yhat = 2.00 + 1.50 x / residuals sum: 0.0 / R2: 0.957.',
      },
      starterCode: "x = [2, 4, 6, 8, 10]\ny = [5, 9, 10, 13, 18]\nm = len(x)\n\n# المجاميع الأربعة بحلقة واحدة: sx وsy وsxy وsxx\n# the four sums in one loop: sx, sy, sxy, sxx\n\n# b1 وb0 من صيغتي المجاميع\n# b1 and b0 from the raw-sum formulas\n\n# البواقي ومجموعها ثم sse وsst وr2\n# residuals and their sum, then sse, sst, r2\n\n# الأسطر الخمسة المطلوبة\n# the five required lines\n",
      solution: "x = [2, 4, 6, 8, 10]\ny = [5, 9, 10, 13, 18]\nm = len(x)\nsx = 0\nsy = 0\nsxy = 0\nsxx = 0\nfor i in range(m):\n    sx += x[i]\n    sy += y[i]\n    sxy += x[i] * y[i]\n    sxx += x[i] ** 2\nb1 = (m * sxy - sx * sy) / (m * sxx - sx ** 2)\nb0 = (sy - b1 * sx) / m\nres_sum = 0.0\nsse = 0.0\ny_mean = sy / m\nsst = 0.0\nfor i in range(m):\n    e = y[i] - (b0 + b1 * x[i])\n    res_sum += e\n    sse += e ** 2\n    sst += (y[i] - y_mean) ** 2\nr2 = 1 - sse / sst\nprint('b1: %.2f' % b1)\nprint('b0: %.2f' % b0)\nprint('fit: yhat = %.2f + %.2f x' % (b0, b1))\nprint('residuals sum: %.1f' % res_sum)\nprint('R2: %.3f' % r2)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الميل والتقاطع صحيحان', en: 'Slope and intercept are correct' },
          code: "assert 'b1: 1.50' in __learner_output__ and 'b0: 2.00' in __learner_output__, 'expected: b1: 1.50 then b0: 2.00 | actual: %r' % __learner_output__",
          expected: 'b1: 1.50 then b0: 2.00',
        },
        {
          id: 't2',
          name: { ar: 'سطر الملاءمة مطبوع بصيغته', en: 'The fit line is printed in its format' },
          code: "assert 'fit: yhat = 2.00 + 1.50 x' in __learner_output__, 'expected: fit: yhat = 2.00 + 1.50 x | actual: %r' % __learner_output__",
          expected: 'fit: yhat = 2.00 + 1.50 x',
        },
        {
          id: 't3',
          name: { ar: 'البواقي تجمع صفرًا وR2 صحيح', en: 'Residuals sum to zero and R2 is right' },
          code: "assert 'residuals sum: 0.0' in __learner_output__ and 'R2: 0.957' in __learner_output__, 'expected: residuals sum: 0.0 then R2: 0.957 | actual: %r' % __learner_output__",
          expected: 'residuals sum: 0.0 then R2: 0.957',
        },
        {
          id: 't4',
          name: { ar: 'القيم محسوبة بالصيغ لا مكتوبة يدويًّا', en: 'Values computed from formulas, not hardcoded' },
          code: "assert abs(b1 - 1.5) < 1e-9 and abs(b0 - 2.0) < 1e-9 and abs(sse - 4.0) < 1e-9 and abs(r2 - (1 - 4 / 94)) < 1e-9, 'expected: b1=1.5 b0=2.0 sse=4 r2=90/94 | actual: %r' % ((b1, b0, sse, r2),)",
          expected: 'b1=1.5 b0=2.0 sse=4 r2=90/94',
        },
      ],
      hints: [
        { ar: 'حلقة واحدة تجمع الأربع: sx = 30 وsy = 55 وsxy = 390 وsxx = 220 على هذه البيانات — تحقق منها يدويًّا على العنصر الأول (2×5 = 10 و2² = 4).', en: 'One loop accumulates all four: sx = 30, sy = 55, sxy = 390, sxx = 220 on this data — verify by hand on the first pair (2\u00d75 = 10 and 2\u00b2 = 4).' },
        { ar: 'الصيغتان: البسط m·sxy − sx·sy = 5×390 − 30×55 = 300 والمقام m·sxx − sx² = 1100 − 900 = 200 فيكون b1 = 1.5، ثم b0 = (55 − 1.5×30)/5 = 2.0.', en: 'The two formulas: numerator m*sxy - sx*sy = 5\u00d7390 \u2212 30\u00d755 = 300 and denominator m*sxx - sx**2 = 1100 \u2212 900 = 200, so b1 = 1.5, then b0 = (55 \u2212 1.5\u00d730)/5 = 2.0.' },
        { ar: 'البواقي لهذه البيانات: 0 و+1 و−1 و−1 و+1 — تجمع 0.0 دائمًا مع تقاطع، وsse = 4 وsst = 94 فيكون r2 = 1 − 4/94 ≈ 0.957.', en: 'The residuals on this data: 0, +1, \u22121, \u22121, +1 — always summing 0.0 with an intercept; sse = 4 and sst = 94 give r2 = 1 \u2212 4/94 \u2248 0.957.' },
        { ar: 'الهيكل:\nfor i in range(m):\n    sx += x[i]\n    sy += y[i]\n    sxy += x[i] * y[i]\n    sxx += x[i] ** 2\nb1 = (m * sxy - sx * sy) / (m * sxx - sx ** 2)\nb0 = (sy - b1 * sx) / m\n# ثم حلقة ثانية للبواقي وsse وsst\n# then a second loop for residuals, sse, sst\nr2 = 1 - sse / sst\nprint(\'fit: yhat = %.2f + %.2f x\' % (b0, b1))', en: "The skeleton:\nfor i in range(m):\n    sx += x[i]\n    sy += y[i]\n    sxy += x[i] * y[i]\n    sxx += x[i] ** 2\nb1 = (m * sxy - sx * sy) / (m * sxx - sx ** 2)\nb0 = (sy - b1 * sx) / m\n# then a second loop for residuals, sse, sst\nr2 = 1 - sse / sst\nprint('fit: yhat = %.2f + %.2f x' % (b0, b1))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.ci-meaning',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أعلن تقرير الشهر: «فاصل ثقة 95% لمعدل عيوب العملاء: (5.07, 12.93)». فهم المدير أن «الاحتمال 95% أن المتوسط الحقيقي داخل هذا الفاصل». ما التصحيح الصحيح؟',
        en: 'The monthly report states: \u201c95% confidence interval for the customer defect rate: (5.07, 12.93).\u201d The manager reads it as \u201cthere is a 95% probability the true mean is inside this interval.\u201d What is the correct correction?',
      },
      options: [
        { id: 'a', text: { ar: 'المدير محق — التفسير الاحتمالي هو المعنى الحرفي للثقة 95%', en: 'The manager is right — the probabilistic reading is the literal meaning of 95% confidence' } },
        { id: 'b', text: { ar: 'المتوسط الحقيقي رقم ثابت إما داخل الفاصل أو خارجه — الـ95% تصف الإجراء: كرر العينات كثيرًا فيحيط الفاصل بالمتوسط الحقيقي في 95% من المرات', en: 'The true mean is a fixed number either inside or outside — the 95% describes the procedure: over many repeated samples the interval brackets the true mean 95% of the time' } },
        { id: 'c', text: { ar: 'الصحيح أن 95% من إصدارات المستقبل ستقع بين 5.07 و12.93', en: 'It means 95% of future releases will land between 5.07 and 12.93' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'المتوسط الحقيقي للعملية ليس عشوائيًّا — هو قيمة ثابتة موجودة فعلًا، والفاصل المحسوب من عينتك قيمة محدودة أيضًا.', en: 'The process\u2019s true mean is not a spinning wheel — it is a fixed value that exists, and the interval computed from your sample is a fixed value too.' },
        { ar: 'إذن لا حظّ ولا احتمال بين قيمتين ثابتتين: الفاصل إما أمسك المتوسط وإما أخطأ — ولا تعرف أي الحالتين وقعت.', en: 'So no odds exist between two fixed values: your interval either caught the mean or missed it — and you never know which happened.' },
        { ar: 'الـ95% تعود للطريقة: لو أعدت التجربة على عينات كثيرة لأحاط الفاصل بالمتوسط الحقيقي في 95% من المرات — ثقة في الإجراء.', en: 'The 95% belongs to the method: rerun the experiment over many samples and the intervals bracket the true mean 95% of the time — confidence in the procedure.' },
        { ar: 'الجواب: b — الثقة في الإجراء لا احتمال للمعامل.', en: 'Answer: b — confidence in the procedure, not probability of the parameter.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.sqrt-n',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'الخطأ المعياري على بياناتنا SE = s/√n ≈ 1.76 عند n = 11. لتصغير أشرطة الخطأ إلى النصف، كم إصدارًا تحتاج في عينتك؟ (استعمل قاعدة √n — رقم فقط)',
        en: 'The standard error on our data is SE = s/\u221an \u2248 1.76 at n = 11. To halve your error bars, how many releases does your sample need? (use the \u221an rule — number only)',
      },
      answer: '44',
      solution: '44',
      tolerance: 0,
      hints: [
        { ar: 'SE = s/√n: البسط s لا يتغير — فلتصغير SE إلى النصف يجب أن يتضاعف √n.', en: 'SE = s/\u221an: the numerator s does not change — to halve SE, \u221an must double.' },
        { ar: '√n يتضاعف ⟸ n يتضاعف أربع مرات: √(4n) = 2√n.', en: '\u221an doubling means n quadrupling: \u221a(4n) = 2\u221an.' },
        { ar: 'n الجديدة = 11 × 4 = 44 — وتحقق: SE عند 44 يساوي 5.85/√44 ≈ 0.88 نصف 1.76 فعلًا.', en: 'The new n = 11 \u00d7 4 = 44 — check: SE at 44 is 5.85/\u221a44 \u2248 0.88, truly half of 1.76.' },
        { ar: 'الجواب: 44', en: 'Answer: 44' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import statistics\ncfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]\nn = len(cfds)\nmean = statistics.mean(cfds)\ns = statistics.stdev(cfds)\nse = s / n ** 0.5\nprint('z 95%% CI: (%.2f, %.2f)' % (mean - 1.96 * se, mean + 1.96 * se))\nprint('t 95%% CI: (%.2f, %.2f)' % (mean - 2.228 * se, mean + 2.228 * se))\n\nx = [2, 4, 6, 8, 10]\ny = [5, 9, 10, 13, 18]\nm = len(x)\nsx = sy = sxy = sxx = 0\nfor i in range(m):\n    sx += x[i]\n    sy += y[i]\n    sxy += x[i] * y[i]\n    sxx += x[i] ** 2\nb1 = (m * sxy - sx * sy) / (m * sxx - sx ** 2)\nb0 = (sy - b1 * sx) / m\nprint('fit: yhat = %.2f + %.2f x' % (b0, b1))\nprint('predict x=12 (inside range): %.2f' % (b0 + b1 * 12))\nprint('predict x=40 (outside range): %.2f' % (b0 + b1 * 40))\n\n# جرّب: احذف 23 من cfds وأعد الفاصلين — أيهما انقبض أكثر ولماذا؟\n# try: delete 23 from cfds and rebuild both intervals — which shrank more, and why?\n# جرّب: احسب البواقي e = y - (b0 + b1*x) ومجموعها — كم يساوي دائمًا مع تقاطع؟\n# try: compute the residuals e = y - (b0 + b1*x) and their sum — what is it always with an intercept?\n# جرّب: عامل ثالث يسرّع التسليم ويكبّر الوحدات — لماذا لا يثبت R2 العالي السببية؟\n# try: a third factor speeds delivery and inflates size — why does a high R2 not prove causation?",
      prompt: {
        ar: 'الملعب يجمع الدرس كله: فاصلا z وt على بيانات الفصل، ثم خطّ المربعات الصغرى على بيانات الحجم/العيوب مع تنبؤين — واحد داخل المدى وآخر خارجه لترى مغري الاستقراء بعينك. احذف الشاذ وراقب الفاصل ينقبض، واحسب البواقي لتلمس حكمتها. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox holds the whole lesson: the z and t intervals on the chapter data, then the least-squares line over the size/defects pairs with two predictions — one inside the range, one outside, so you can see the extrapolation temptation with your own eyes. Delete the outlier and watch the interval shrink; compute the residuals and feel why they matter. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن PY4E الفصل الثاني: العوامل الحسابية وسبقها — ** أعلى من /. في سطر اليوم se = s / n ** 0.5 لماذا حُسب s/√n صحيحًا دون أقواس؟',
            en: 'From PY4E chapter 2: arithmetic operators and precedence — ** outranks /. In today\u2019s line se = s / n ** 0.5, why does it compute s/\u221an correctly without parentheses?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن القسمة تنفَّذ قبل الأس دائمًا', en: 'Because division always executes before exponentiation' } },
            { id: 'b', text: { ar: 'لأن ** ينفَّذ قبل / — n ** 0.5 يُحسب أولًا ثم تُقسم s على ناتجه', en: 'Because ** binds before / — n ** 0.5 is computed first, then s is divided by its result' } },
            { id: 'c', text: { ar: 'لأن بايثون يقيم التعبيرات من اليمين إلى اليسار', en: 'Because Python evaluates expressions right-to-left' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'سبق ** أعلى من / و* — فn ** 0.5 يتجمّع أولًا كمعامل واحد. لو أردت (s/n) ** 0.5 لاحتجت أقواسًا صريحة. كل كود اليوم — se وs وsst — قام على هذا السطر الصغير: الجذر التربيعي رفعٌ إلى قوة نصف.',
            en: 'Exponentiation outranks division and multiplication — so n ** 0.5 groups first as one operand. If you wanted (s/n) ** 0.5 you would need explicit parentheses. Every line of code today — se, s, sst — stood on this small fact: a square root is just raising to the power of one half.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'على بياناتنا نفسها كان فاصل t أعرض من فاصل z: (5.07, 12.93) مقابل (5.54, 12.46). لماذا ندفع الأضيق وأقبل الأعرض؟',
            en: 'On the very same data the t interval was wider than the z one: (5.07, 12.93) versus (5.54, 12.46). Why pay for the wider one?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن t يجعل النتائج تبدو أفضل للإدارة', en: 'Because t makes the results look better to management' } },
            { id: 'b', text: { ar: 'لأن σ مجهولة وقدِّرت بـs من العينة نفسها، والعينة صغيرة — فيعوض t* = 2.228 (عند df = 10) عن عدم اليقين الإضافي بفاصل أصدق', en: 'Because \u03c3 is unknown and was estimated by s from the same sample, and the sample is small — so t* = 2.228 (at df = 10) compensates the extra uncertainty with a more honest interval' } },
            { id: 'c', text: { ar: 'لأن توزيعة t تنطبق على القوائم المرتبة فقط', en: 'Because the t-distribution only applies to sorted lists' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'z* = 1.96 يفترض انتشارًا معروفًا تمامًا — ترفٌ نادر. حين تقدّر σ بـs من 11 قراءة فأنت غير متأكد من المقياس نفسه، وتوزيعة t بذيولها الأثقل تعترف بذلك: القيمة الحرجة ترتفع فيتسع الفاصل. وكلما كبرت العينة اقتربت t من z — بعد df ≈ 30 يتطابقان تقريبًا.',
            en: 'z* = 1.96 assumes a perfectly known spread — a rare luxury. When you estimate \u03c3 by s from 11 readings you are unsure of the ruler itself, and the heavier-tailed t-distribution admits it: the critical value rises and the interval widens. As the sample grows t approaches z — past df \u2248 30 they are nearly identical.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في ملاءمتنا ŷ = 2 + 1.5x، ماذا يعني الميل b1 = 1.5 عمليًّا؟',
            en: 'In our fit \u0177 = 2 + 1.5x, what does the slope b1 = 1.5 mean practically?',
          },
          options: [
            { id: 'a', text: { ar: 'التنبؤ عند حجم صفري — أثر رياضي', en: 'The prediction at zero size — a mathematical artifact' } },
            { id: 'b', text: { ar: 'كل ألف سطر إضافية تجلب نحو 1.5 عيب إضافي — معدل قابل للتنفيذ في تخطيط الاختبار', en: 'Every extra KLOC brings about 1.5 more defects — an actionable rate for test planning' } },
            { id: 'c', text: { ar: 'أن الحجم يفسّر 96% من التباين', en: 'That size explains 96% of the variation' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الميل معدل لا نقطة: 1.5 عيبًا لكل ألف سطر — الرقم الذي يسألك عن كلفة النمو. التقاطع 2 هو تنبؤ عند الصفر (أثر رياضي هنا)، و96% قصة R² لا الميل. ثلاثة أرقام ثلاثة معانٍ — والخلط بينها أشهر خطأ في قراءة الانحدار.',
            en: 'The slope is a rate, not a point: 1.5 defects per KLOC — the number that answers what growth costs. The intercept 2 is the prediction at zero (an artifact here), and the 96% is R\u00b2\u2019s story, not the slope\u2019s. Three numbers, three meanings — conflating them is the classic regression-reading error.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'مدير يطلب من نموذجنا (ملائم على 2–10 KLOC وR² = 0.957) توقع عيوب وحدة من 40 KLOC. الرد الأصح من درس اليوم؟',
            en: 'A manager asks our model (fit on 2\u201310 KLOC, R\u00b2 = 0.957) to predict defects for a 40-KLOC module. The right response, per today\u2019s lesson?',
          },
          options: [
            { id: 'a', text: { ar: 'نطبّق المعادلة ببساطة: 2 + 1.5 × 40 = 62 عيبًا', en: 'Just apply the equation: 2 + 1.5 \u00d7 40 = 62 defects' } },
            { id: 'b', text: { ar: 'نرفض الاستقراء: النموذج يصف مدى بياناته فقط — وR² عالٍ لا يثبت سببية ولا يخوّل التنبؤ خارج المدى', en: 'We refuse to extrapolate: the model describes its data\u2019s range only — and a high R\u00b2 proves neither causation nor license to predict outside the range' } },
            { id: 'c', text: { ar: 'نطبّق المعادلة ونضرب الناتج بعامل أمان', en: 'We apply the equation and multiply the result by a safety factor' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حكمان يُخالان معًا: لا استقراء — وحدة من 40 ألف سطر خارج مدى الملاءمة (2–10) فالتوقع 62 تخمين صريح بلا سند؛ ولا سببية — R² عالٍ يثبت تلازمًا لا أن تصغير الوحدات يخفض العيوب. الصدق الإحصائي قول: «نموذجي يعرف هذا المدى فقط».',
            en: 'Two guards trip together: no extrapolation — a 40-KLOC module sits outside the fit range (2\u201310), so 62 is an unsupported guess; and no causation — a high R\u00b2 shows co-movement, not that shrinking modules lowers defects. Statistical honesty says: \u201cmy model only knows this range.\u201d',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: '«فاصل 95% يعني احتمال 95% أن المتوسط الحقيقي داخل هذا الفاصل تحديدًا»',
          right: 'الثقة في الإجراء: كرر العينات فتحوط الفواصل بالمتوسط الحقيقي في 95% من المرات — والفاصل الواحد إما أصاب أو أخطأ',
          note: {
            ar: 'المتوسط الحقيقي ثابت والفاصل المحسوب ثابت — لا احتمال بين قيمتين محددتين. الـ95% ملك للطريقة عبر التكرار، لا للفصل الواحد. من قلب هذا يبيع يقينًا وهميًّا؛ ومن التزم به قدم فاصله بلا مبالغة: «الإجراء الذي أتبعه يخطئ مرة من خمس».',
            en: 'The true mean is fixed and your computed interval is fixed — no probability lives between two settled values. The 95% belongs to the method across repetitions, not to one interval. Flip it and you sell phantom certainty; keep it and you state your interval without inflation: \u201cthe procedure I used misses one time in five.\u201d',
          },
        },
        {
          wrong: 'فاصلا قبل/بعد لا يتقاطعان إذن التحسّن حقيقي',
          right: 'تقاطع فاصلين منفصلين ليس اختبارًا موثوقًا للفرق — ابنِ فاصلًا واحدًا للفرق نفسه فإن لم يشمل الصفر فالتحسّن موثوق',
          note: {
            ar: 'الفروق المقترنة (الإصدار نفسه تحت العمليتين) تعطي فاصل فرق أنظف، وللعينتين المستقلتين صيغة بمجموع تباينين. القاعدة من الكتاب: لا تُبلّغ عن تحسّن بلا فاصل أو اختبار مكافئ — ومتاعب العيوب تتقلب ربعًا بعد ربع حتى بلا تغيير، والفاصل هو ما يفصل تحسّنًا حقيقيًّا من ربع محظوظ.',
            en: 'Paired differences (the same release under both processes) give the cleanest difference interval; two independent samples use the pooled-variance form. The book\u2019s rule: never report a change without an interval or an equivalent test — defect counts bounce quarter after quarter even when nothing changed, and the interval is what separates a real improvement from a lucky quarter.',
          },
        },
        {
          wrong: 'معادلة الانحدار تتنبأ بأي حجم لأن R² عالٍ',
          right: 'النموذج يصف مدى بياناته فقط — التوقع خارج المدى استقراء أعمى، والارتباط ليس سببية',
          note: {
            ar: 'ملاءمتنا على 2–10 ألف سطر: عند 12 توقعًا داخل المدى ممدوحًا، وعند 40 كلامًا في الهواء. وR² = 0.957 يقول إن الحجم والعيوب يتحركان معًا — لا أن أحدهما يقود الآخر: عامل ثالث (تعقيد الميزات المتسرعة) قد يدفع الاثنين. توقّع داخل المدى، وتحقق تجريبيًّا قبل أن تؤمن بالخط خارج المعمل.',
            en: 'Our fit lives on 2\u201310 KLOC: at 12 the prediction is inside-range and respectable; at 40 it is words in the wind. And R\u00b2 = 0.957 says size and defects move together — not that one drives the other: a third factor (rushed feature complexity) may push both. Predict inside the range, and verify empirically before believing the line outside the lab.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'فاصل الثقة = تخمين بأشرطة خطأ: x̄ ± (قيمة حرجة) × (s/√n) — وفاصل 95% إجراء يحوط بالمتوسط الحقيقي في 95% من العينات المتكررة، لا احتمال على فاصل واحد. على بياناتنا: SE = 1.76، ففاصل z = 1.96 يعطي (5.54, 12.46) وفاصل t = 2.228 (df = 10) يعطي (5.07, 12.93) — فاصل الكتاب حرفيًّا.', en: 'A confidence interval = a guess with error bars: x\u0304 \u00b1 (critical value) \u00d7 (s/\u221an) — and a 95% interval is a procedure bracketing the true mean in 95% of repeated samples, not a probability for one interval. On our data: SE = 1.76, so the z = 1.96 interval is (5.54, 12.46) and the t = 2.228 (df = 10) interval is (5.07, 12.93) — the book\u2019s interval verbatim.' },
        { ar: 'الانحدار الخطي البسيط يصمّم الاعتماد: من المجاميع — b1 = (m·sxy − sx·sy)/(m·sxx − sx²) وb0 = (sy − b1·sx)/m — فيخرج على بيانات الحجم/العيوب ŷ = 2 + 1.5x: الميل معدل (1.5 عيب لكل ألف سطر) والتقاطع أثر عند الصفر، والبواقي تجمع صفرًا، وR² = 1 − 4/94 ≈ 0.957.', en: 'Simple linear regression models dependence: from raw sums — b1 = (m\u00b7sxy \u2212 sx\u00b7sy)/(m\u00b7sxx \u2212 sx\u00b2) and b0 = (sy \u2212 b1\u00b7sx)/m — the size/defects data yield \u0177 = 2 + 1.5x: the slope is a rate (1.5 defects per KLOC), the intercept an at-zero artifact, residuals sum to zero, and R\u00b2 = 1 \u2212 4/94 \u2248 0.957.' },
        { ar: 'حكمان يحرسان: الثقة للإجراء لا للفاصل (ولا تقرر فرقًا من تقاطع فاصلين — ابنِ فاصل الفرق)، والانحدار ارتباط داخل مدى بياناته لا سببية خارجها — ولتصغير أشرطة الخطأ إلى النصف أربعة أضعاف البيانات (√n).', en: 'Two guards: confidence belongs to the procedure, not one interval (and never decide a difference from two intervals\u2019 overlap — build the difference interval); regression is association inside its data\u2019s range, not causation beyond it — and halving your error bars costs four times the data (\u221an).' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب واحذف 23 ثم أعد الفاصلين. اسأل نفسك: آخر تقرير قبله بلا سؤال — هل حمل رقمه فاصلًا؟ وفي مشروعك القادم: أي علاقة ستملأ خطّها من المجاميع، وأين سترفض أن يتنبأ خارج مداه؟',
        en: 'Open the sandbox, delete 23, and rebuild both intervals. Ask yourself: the last report you accepted without question — did its number carry an interval? And in your next project: which relationship will you fit from sums, and where will you refuse to let it predict beyond its range?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch12.s8', pages: 'ص330-331 / pp.330-331' },
        { book: 'SWE', section: 'swe.ch12.s9', pages: 'ص332-334 / pp.332-334' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch12.s8', pages: 'ص330-331 / pp.330-331' },
    { book: 'SWE', section: 'swe.ch12.s9', pages: 'ص332-334 / pp.332-334' },
  ],
} satisfies Lesson;

export default lesson;
