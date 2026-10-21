import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch2.l2 — "Bayesian Regression"
 * الانحدار البايزي
 * Aligned with MLS ch2 s2 (Bayesian Regression).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved).
 * Runnable design: centered fixed data xc=[-2..2], yc=[-3.92,-2.12,0.08,1.78,4.18];
 * a known-sigma conjugate Gaussian update where the posterior mean is the
 * precision-weighted average of prior mean and data slope. Every literal
 * verified under CPython 3.
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch2.l2',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 2,
  title: { ar: 'الانحدار البايزي', en: 'Bayesian Regression' },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch2.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'Ridge عاقب المعاملات دون أن يشرح من أين جاءت العقوبة. الانحدار البايزي يكشف الحقيقة: العقوبة التربيعية هي اعتقاد قبلي أن المعاملات صغيرة. نضع توزيعًا قبليًا على w1، ونترك البيانات تتكلم بلغة الأرجحية، ثم ندمجهما بقاعدة بايز في توزيع بعدي يجمع الاعتقاد القديم مع الشاهد الجديد. وستحسب التحديث بمعادلة واحدة أنيقة: المتوسط البعدي متوسط مرجّح بالدقة بين القبلي والبيانات.',
        en: 'Ridge penalized coefficients without explaining where the penalty came from. Bayesian regression reveals the truth: a squared penalty is a prior belief that coefficients are small. Put a prior distribution on w1, let the data speak through the likelihood, then combine both with Bayes\u2019 rule into a posterior that merges old belief with fresh evidence. And you will compute the update with one elegant equation: the posterior mean is the precision-weighted average of prior and data.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'قبلي + أرجحية = بعدي', en: 'Prior + likelihood = posterior' },
      chunks: [
        {
          ar: 'النموذج كما في المنظور الثاني للفصل الأول: y_n | x_n ~ N(w1*x_n, σ²) بضجيج معروف، ونضيف قناعة عن المعامل: w1 ~ N(mu0, τ²). قاعدة بايز تقول: البعدي ∝ الأرجحية × القبلي. ولأن التوزيعين طبيعيان فالبعدي طبيعي أيضًا — هذه مرافق conjugate. حسابه يظهر على شكل دقة (مقلوب التباين): الدقة البعدية = Σx²/σ² + 1/τ²، والمتوسط البعدي = (Σxy/σ² + mu0/τ²) / الدقة البعدية. لاحظ البنية: كل طرف وزنه دقته — بيانات كثيرة أو ضجيج صغير يرفع وزن البيانات، وقبلية ضيقة (τ صغيرة) ترفع وزن mu0.',
          en: 'The model is the chapter-one likelihood again: y_n | x_n ~ N(w1*x_n, σ²) with known noise, plus a belief about the coefficient: w1 ~ N(mu0, τ²). Bayes\u2019 rule says posterior ∝ likelihood × prior. Because both are Gaussian the posterior is Gaussian too — conjugacy. The algebra organizes around precision (inverse variance): posterior precision = Σx²/σ² + 1/τ², and posterior mean = (Σxy/σ² + mu0/τ²) / posterior precision. Notice the structure: each side is weighted by its precision — more data or less noise boosts the data\u2019s weight; a tight prior (small τ) boosts mu0\u2019s.',
        },
        {
          ar: 'على بياناتنا الممركزة: Σx² = 10 وΣxy = 20.1، فدقة البيانات = 10 عند σ=1. بقبلي N(0, 4) (دقته 0.25) يكون المتوسط البعدي = 20.1/10.25 = 1.9610 — البيانات انتصرت لأن دقتها أكبر بكثير. وبقبلي حاد N(2, 1) (دقة 1) يصبح = 22.1/11 = 2.0091 — القبلي سحب التقدير نحوه من 2.01. وهذا الجسر إلى الدرس السابق: تعظيم البعدي هو نفسه تقليل MSE + λ*w1² مع λ = σ²/τ² — أي أن Ridge هو حالة بايزية بقبلية مركزية عند الصفر.',
          en: 'On our centered data Σx² = 10 and Σxy = 20.1, so the data precision is 10 at σ=1. With prior N(0, 4) (precision 0.25) the posterior mean is 20.1/10.25 = 1.9610 — the data wins because its precision is far larger. With a tight N(2, 1) prior (precision 1) it becomes 22.1/11 = 2.0091 — the prior dragged the estimate toward itself from 2.01. And here is the bridge to last lesson: maximizing this posterior equals minimizing MSE + λ*w1² with λ = σ²/τ² — Ridge is Bayesian regression with a zero-centered prior.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تحديثان بايزيان على البيانات نفسها', en: 'Two Bayesian updates on the same data' },
      code: "def posterior(x, y, sigma, tau, mu0):\n    sxx = sum(v * v for v in x)\n    sxy = sum(x[i] * y[i] for i in range(len(x)))\n    like_prec = sxx / sigma ** 2\n    prior_prec = 1.0 / tau ** 2\n    mean = (sxy / sigma ** 2 + mu0 * prior_prec) / (like_prec + prior_prec)\n    sd = (like_prec + prior_prec) ** -0.5\n    return mean, sd\n\nx = [-2, -1, 0, 1, 2]\ny = [-3.92, -2.12, 0.08, 1.78, 4.18]\nm1, s1 = posterior(x, y, 1.0, 2.0, 0.0)\nm2, s2 = posterior(x, y, 1.0, 1.0, 2.0)\nprint('prior N(0, 4):      mean=%.4f sd=%.4f' % (m1, s1))\nprint('prior N(2, 1):      mean=%.4f sd=%.4f' % (m2, s2))\nprint('ols slope (no prior): %.4f' % (sum(x[i] * y[i] for i in range(5)) / 10.0))",
      explanation: {
        ar: 'التحديث الأول: قبلي واسع N(0, 4) لا يقف كثيرًا في وجه البيانات، فيهبط المتوسط البعدي من 2.0100 (المربعات الصغرى) إلى 1.9610 بجذر تباين 0.3123. الثاني: قبلي حاد حول 2 يرفع المتوسط إلى 2.0091 ويضيّق الانتشار إلى 0.3015 — اعتقاد قوي تبنّاه البعد كله. لاحظ أن البعد دائمًا أضيق من القبلي: الشاهد لا يزيد الجهالة. والدقة البعدية 10.25 (أو 11) أكبر من دقة البيانات وحدها 10 — كل مصدر معرفة يضيف يقينًا حتى لو خالف الآخر.',
        en: 'First update: a wide N(0, 4) prior barely resists the data, so the posterior mean slips from 2.0100 (least squares) to 1.9610 with sd 0.3123. Second: a tight prior around 2 lifts the mean to 2.0091 and narrows the spread to 0.3015 — a strong belief the posterior fully adopted. Notice the posterior is always narrower than the prior: evidence never increases ignorance. And posterior precision 10.25 (or 11) exceeds the data-only precision of 10 — every source of knowledge adds certainty even when they disagree.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.posterior-update',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة posterior(x, y, sigma, tau, mu0) التي تعيد (mean, sd) للتوزيع البعدي عن w1 بمعادلة الدقة: like_prec = Σx²/σ² وprior_prec = 1/τ² وmean = (Σxy/σ² + mu0*prior_prec)/(مجموع الدقتين) وsd = (مجموع الدقتين) ** -0.5. اختبرها بالسيناريوهين: (sigma=1, tau=2, mu0=0) و(sigma=1, tau=1, mu0=2).',
        en: 'Implement posterior(x, y, sigma, tau, mu0) returning (mean, sd) for the posterior over w1 via the precision equations: like_prec = Σx²/σ², prior_prec = 1/τ², mean = (Σxy/σ² + mu0*prior_prec) / (sum of precisions), sd = (sum of precisions) ** -0.5. Test it on the two scenarios (sigma=1, tau=2, mu0=0) and (sigma=1, tau=1, mu0=2).',
      },
      starterCode: "x = [-2, -1, 0, 1, 2]\ny = [-3.92, -2.12, 0.08, 1.78, 4.18]\n\ndef posterior(x, y, sigma, tau, mu0):\n    ...  # TODO: precision-weighted average and posterior sd, return (mean, sd)\n",
      solution: "x = [-2, -1, 0, 1, 2]\ny = [-3.92, -2.12, 0.08, 1.78, 4.18]\n\ndef posterior(x, y, sigma, tau, mu0):\n    sxx = sum(v * v for v in x)\n    sxy = sum(x[i] * y[i] for i in range(len(x)))\n    like_prec = sxx / sigma ** 2\n    prior_prec = 1.0 / tau ** 2\n    mean = (sxy / sigma ** 2 + mu0 * prior_prec) / (like_prec + prior_prec)\n    sd = (like_prec + prior_prec) ** -0.5\n    return mean, sd",
      tests: [
        {
          id: 't1',
          name: { ar: 'التحديث بالقبلي الواسع يعطي 1.9610', en: 'The wide-prior update yields 1.9610' },
          code: "m1, s1 = posterior(x, y, 1.0, 2.0, 0.0)\nassert abs(m1 - 1.961) < 1e-3, 'expected mean about 1.961 | actual: %r' % m1",
          expected: 'mean = 1.9610',
        },
        {
          id: 't2',
          name: { ar: 'جذر التباين البعدي يضيق إلى 0.3123', en: 'The posterior sd narrows to 0.3123' },
          code: "m1, s1 = posterior(x, y, 1.0, 2.0, 0.0)\nassert abs(s1 - 0.3123) < 1e-3, 'expected sd about 0.3123 | actual: %r' % s1",
          expected: 'sd = 0.3123',
        },
        {
          id: 't3',
          name: { ar: 'القبلي الحاد حول 2 يسحب المتوسط إلى 2.0091', en: 'A tight prior around 2 pulls the mean to 2.0091' },
          code: "m1, s1 = posterior(x, y, 1.0, 2.0, 0.0)\nm2, s2 = posterior(x, y, 1.0, 1.0, 2.0)\nassert abs(m2 - 2.0091) < 1e-3 and m2 > m1, 'expected mean about 2.0091 above the wide-prior mean | actual: %r' % m2",
          expected: 'mean = 2.0091 > 1.9610',
        },
      ],
      hints: [
        { ar: 'ابدأ بالمجموعين: sxx = مجموع x² = 10.0 وsxy = مجموع x*y = 20.1 على البيانات المعطاة.', en: 'Start from the two sums: sxx = sum of x² = 10.0 and sxy = sum of x*y = 20.1 on the given data.' },
        { ar: 'دقة البيانات sxx / sigma ** 2 = 10.0 عند sigma=1، ودقة القبلي 1.0 / tau ** 2 — اجمعهما للمقام.', en: 'Data precision sxx / sigma ** 2 = 10.0 at sigma=1; prior precision 1.0 / tau ** 2 — sum them for the denominator.' },
        { ar: 'البسط يجمع مساهمتي المصدرين: sxy / sigma ** 2 وmu0 * prior_prec — لاحظ أن mu0 يدخل بوزن دقته لا قيمته مباشرة.', en: 'The numerator mixes both sources: sxy / sigma ** 2 and mu0 * prior_prec — note mu0 enters weighted by its precision.' },
        { ar: 'الجذر البعدي: (like_prec + prior_prec) ** -0.5 — لاحظ أنه أصغر دائمًا من 1/sqrt(like_prec) لأن الدقة زادت.', en: 'Posterior sd: (like_prec + prior_prec) ** -0.5 — always smaller than 1/sqrt(like_prec) because precision grew.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-prior-weight',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا مكتبات: على البيانات نفسها (Σx² = 10 وΣxy = 20.1) وبـ sigma=1 وmu0=0، ما المتوسط البعدي عندما tau=1 (أي قبلي N(0, 1))؟ ذيل الجواب لأربع منازل عشرية.',
        en: 'No libraries: on the same data (Σx² = 10 and Σxy = 20.1) with sigma=1 and mu0=0, what is the posterior mean when tau=1 (a N(0, 1) prior)? Round to four decimals.',
      },
      answer: '1.8273',
      solution: '1.8273',
      tolerance: 0.001,
      hints: [
        { ar: 'دقة القبلي N(0, 1) هي 1/1 = 1، ودقة البيانات 10/1 = 10، فالمقام 11.', en: 'The N(0, 1) prior has precision 1/1 = 1; data precision is 10/1 = 10, so the denominator is 11.' },
        { ar: 'البسط: 20.1/1 + 0*1 = 20.1.', en: 'The numerator: 20.1/1 + 0*1 = 20.1.' },
        { ar: 'قسّم: 20.1/11 = 1.827272... — القبلي الحاد سحب التقدير بعيدًا عن 2.01 نحو صفر.', en: 'Divide: 20.1/11 = 1.827272... — the tight prior dragged the estimate well below 2.01 toward zero.' },
        { ar: 'الجواب: 1.8273', en: 'Answer: 1.8273' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "x = [-2, -1, 0, 1, 2]\ny = [-3.92, -2.12, 0.08, 1.78, 4.18]\n\ndef posterior(x, y, sigma, tau, mu0):\n    sxx = sum(v * v for v in x)\n    sxy = sum(x[i] * y[i] for i in range(len(x)))\n    like_prec = sxx / sigma ** 2\n    prior_prec = 1.0 / tau ** 2\n    mean = (sxy / sigma ** 2 + mu0 * prior_prec) / (like_prec + prior_prec)\n    sd = (like_prec + prior_prec) ** -0.5\n    return mean, sd\n\nfor tau in [0.5, 1.0, 2.0, 10.0]:\n    m, s = posterior(x, y, 1.0, tau, 0.0)\n    print('tau=%.1f -> mean=%.4f sd=%.4f' % (tau, m, s))\n\n# جرّب: متى يكاد المتوسط البعدي يساوي ميل المربعات الصغرى 2.01؟\n# try: when does the posterior mean almost equal the least-squares slope 2.01?\n# جرّب: اضرب sigma في 10 — من ينتصر حين يصبح الضجيج عاليًا؟\n# try: multiply sigma by 10 — who wins when noise gets loud?\n",
      prompt: {
        ar: 'الملعب يدوّ مقبض القبلي: أربع قيم لـ τ من حاد إلى واسع. راقب اللحظة التي يذوب فيها الاعتقاد القبلي في البيانات.',
        en: 'The sandbox turns the prior dial: four τ values from tight to wide. Watch the moment the prior belief dissolves into the data.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في تحديث غاوسي مرافق بضجيج معروف، ما الصيغة الأنيقة للمتوسط البعدي؟',
            en: 'In a conjugate Gaussian update with known noise, what is the elegant form of the posterior mean?',
          },
          options: [
            { id: 'a', text: { ar: 'مجموع بسطاء الأرجحية والقبلي', en: 'A sum of likelihood and prior numerators' } },
            { id: 'b', text: { ar: 'متوسط مرجّح بالدقة بين متوسط القبلي وميل البيانات', en: 'A precision-weighted average of the prior mean and the data slope' } },
            { id: 'c', text: { ar: 'أكبر القيمتين: القبلي أو تقدير البيانات', en: 'The larger of the prior and the data estimate' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المتوسط البعدي = (Σxy/σ² + mu0/τ²)/(Σx²/σ² + 1/τ²): كل مصدر يُوزن بدقته. الدقة العالية تعني صوتًا أعلى في الخلط.',
            en: 'Posterior mean = (Σxy/σ² + mu0/τ²)/(Σx²/σ² + 1/τ²): each source enters weighted by its precision. Higher precision, louder voice in the mix.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا يحدث للتوزيع البعدي كلما زادت كمية البيانات (مع ثبات σ وτ)؟',
            en: 'What happens to the posterior as the amount of data grows (σ and τ fixed)?',
          },
          options: [
            { id: 'a', text: { ar: 'يتوسع لأن المعلومات أكثر', en: 'It widens because there is more information' } },
            { id: 'b', text: { ar: 'تزيد دقته فيضيق، ويقترب متوسطه من ميل البيانات', en: 'Its precision grows so it narrows, and its mean approaches the data slope' } },
            { id: 'c', text: { ar: 'يبقى مطابقًا للقبلي', en: 'It stays equal to the prior' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'دقة البيانات Σx²/σ² تنمو مع عدد النقاط فيطغى وزنها على القبلي: المتوسط يميل إلى المربعات الصغرى والانتشار يضيق. القبلية القوية تؤخر هذا لكنها لا توقفه.',
            en: 'Data precision Σx²/σ² grows with sample size and its weight drowns the prior: the mean drifts to least squares and the spread narrows. A strong prior delays this but cannot stop it.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي علاقة تربط الانحدار البايزي بقبلي غاوسي مركزي بانحدار Ridge؟',
            en: 'Which relation connects Bayesian regression with a zero-centered Gaussian prior to Ridge?',
          },
          options: [
            { id: 'a', text: { ar: 'تعظيم البعدي يكافئ تقليل MSE + λ*w1² حيث λ = σ²/τ²', en: 'Maximizing the posterior equals minimizing MSE + λ*w1² with λ = σ²/τ²' } },
            { id: 'b', text: { ar: 'لا علاقة بينهما إطلاقًا', en: 'They are entirely unrelated' } },
            { id: 'c', text: { ar: 'Ridge يعادل قبليًا لا نهائي الاتساع', en: 'Ridge equals an infinitely wide prior' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'لوغاريتم البعدي = لوغاريتم الأرجحية + لوغاريتم القبلي، والثاني هو -w1²/(2τ²) باستمرار. فتعظيمه يساوي تقليل الخسارة المعاقَبة بـ λ = σ²/τ². القبلي الأوسع (τ أكبر) يعني λ أصغر — عقوبة ألطف.',
            en: 'Log posterior = log likelihood + log prior, and the prior term is -w1²/(2τ²) up to a constant. Maximizing it equals minimizing the penalized loss with λ = σ²/τ². A wider prior (larger τ) means smaller λ — a gentler penalty.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الانحدار البايزي يضع قبليًا على المعاملات (مثل N(mu0, τ²)) ويستنتج بعديًا يجمع الاعتقاد القديم مع الأرجحية — والتوزيعان الغاوسيان يجعلان البعدي غاوسيًا أيضًا (مرافق).', en: 'Bayesian regression places a prior on coefficients (say N(mu0, τ²)) and infers a posterior merging old belief with the likelihood — two Gaussians make the posterior Gaussian too (conjugacy).' },
        { ar: 'التحديث بصيغة الدقة: دقة بعدية = Σx²/σ² + 1/τ²، ومتوسط بعدي = متوسط مرجّح بالدقة. على بياناتنا: قبلي N(0,4) أعطى 1.9610، وقبلي N(2,1) أعطى 2.0091 مقابل 2.0100 بلا قبلي.', en: 'The update in precision form: posterior precision = Σx²/σ² + 1/τ², and the posterior mean is a precision-weighted average. On our data: an N(0,4) prior gave 1.9610 and an N(2,1) prior gave 2.0091, versus 2.0100 with no prior.' },
        { ar: 'الجسر إلى Ridge: البعدي الغاوسي المركزي يكافئ Ridge بعقوبة λ = σ²/τ² — والعقوبة في الدرس السابق كانت اعتقادًا قبليًا متنكرًا.', en: 'The bridge to Ridge: a zero-centered Gaussian posterior mode equals Ridge with λ = σ²/τ² — last lesson\u2019s penalty was a prior belief in disguise.' },
      ],
      reflectPrompt: {
        ar: 'جرّبت أربعة τ في الملعب. لو اختلف خبيران معك على w1 — كيف تترجم اقتناع كل منهما إلى (mu0, τ)؟ ومن الذي يجب أن يفوز حين تتضاعف البيانات عشر مرات؟',
        en: 'You turned the τ dial four times. If two experts disagree with you about w1, how would you translate each conviction into (mu0, τ)? And who should win once the data grows tenfold?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch2.s2' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch2.s2' },
  ],
} satisfies Lesson;

export default lesson;
