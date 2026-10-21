import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch18.l1 — "Gaussian Processes: Distributions over Functions"
 * العمليات الغاوسية: توزيعات على الدوال
 * Aligned with D2L ch18 s1 (Introduction to Gaussian Processes) + s2 (GP
 * Priors) + s3 (GP Inference). All expression is original — a paraphrase of
 * the source's ideas, never a verbatim translation. Runnable design: RBF
 * kernel values on fixed 1-D points, the linear-model GP covariance
 * k(x, x') = 1 + x x', and posterior mean/variance by the closed-form
 * equations with a hand 2x2 inverse. Every literal verified under CPython 3.
 */
const lesson = {
  id: 'd2l.ch18.l1',
  version: 1,
  part: 'II',
  track: 'A8',
  book: 'D2L',
  chapter: 18,
  title: {
    ar: 'العمليات الغاوسية: توزيعات على الدوال',
    en: 'Gaussian Processes: Distributions over Functions',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch17.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'تعلمنا حتى الآن أن نُقدّر معاملات شبكة ثم نثق بخرجها؛ لكن كثيرًا ما نريد عكس ذلك: نبدأ من خصائص الدوال التي نؤمن بها — سلاسة، دورية، تناظر زمني — ثم نستنتج التوزيع الكامل للدوال المطابقة ودرجة ثقتنا عند كل نقطة. العمليات الغاوسية تفعل هذا بالضبط، وهي المحرك الخفي لمواضع كثيرة: انحدار بايزي خطي، ومشي عشوائي، وحتى شبكات عميقة بلا نهاية من العصبونات. سنحسب نواة RBF وتوزيعًا خلفيًا كاملًا بأيدينا على نقطتين.',
        en: 'So far you learned to fit parameters and trust the output; often we want the reverse: start from high-level properties we believe functions have — smoothness, periodicity, translation invariance — and derive the full distribution over fitting functions plus our confidence at every point. Gaussian processes do exactly that, and they hide inside many models you know: Bayesian linear regression, walks with random-looking steps, even infinitely wide neural networks. We will compute an RBF kernel and a complete posterior by hand, on two points.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من فضاء الأوزان إلى فضاء الدوال', en: 'From weight space to function space' },
      chunks: [
        {
          ar: 'النماذج الخطية في معاملاتها بتوزيع غاوسي على الأوزان هي عمليات غاوسية: هذا يشمل الانحدار البايزي وكثيرات الحدود ومتسلسلات فورييه وحتى الشبكات ذات العدد اللانهائي من العصبونات المخفية. التعريف: العملية الغاوسية f ∼ GP(m, k) تعني أن أي مجموعة قيم دالة f(x₁), …, f(xₙ) عند أي مدخلات تتبع توزيعًا غاوسيًا متعدد المتغيرات بمتوسط m(xᵢ) وتغاير k(xᵢ, xⱼ). لاحظ أننا لا نُقدّر أوزانًا تُفسر بصعوبة؛ بل نحجز خصائص عليا للدالة مباشرة عبر دالة المتوسط ودالة التغاير (النواة).',
          en: 'Any model linear in its parameters with a Gaussian distribution over those weights is a Gaussian process: Bayesian linear regression, polynomials, Fourier series, even networks with infinitely many hidden units. Definition: f ∼ GP(m, k) means any finite collection of function values f(x\u2081), …, f(x\u2099) at any inputs follows a multivariate Gaussian with mean m(x\u1D62) and covariance k(x\u1D62, x\u2C7C). We stop estimating barely interpretable weights and instead specify high-level properties of the function directly through a mean function and a covariance function (the kernel).',
        },
        {
          ar: 'مثال حُقائب صغير: f(x) = w₀ + w₁x مع w₀, w₁ ∼ N(0, 1). لأي x فإن f(x) مجموع غاوسيين فهو غاوسي بمتوسط 0 وتباين 1 + x²، وبالمثل k(x, x′) = 1 + x·x′. إذن توزيع على الأوزان تُرجم إلى توزيع على الدوال دون أي عينات. عمومًا لأي f(x) = wᵀφ(x) مع w ∼ N(u, S): المتوسط uᵀφ(x) والتغاير φ(x)ᵀSφ(x′). النواة تحكم خصائص التعميم: نواة RBF الأشهر k(x, x′) = a²·exp(−‖x − x′‖² / (2ℓ²)) لها مقياس طول ℓ يضبط سرعة التذبذب وسعة a تضبط المدى العمودي.',
          en: 'A pocket example: f(x) = w\u2080 + w\u2081x with w\u2080, w\u2081 ∼ N(0, 1). For any x, f(x) is a sum of Gaussians, hence Gaussian with mean 0 and variance 1 + x², and likewise k(x, x\u2032) = 1 + x·x\u2032. A distribution over weights translated into a distribution over functions with zero sampling. Generally, for f(x) = w\u1D40φ(x) with w ∼ N(u, S): mean u\u1D40φ(x), covariance φ(x)\u1D40Sφ(x\u2032). The kernel steers generalization: the popular RBF kernel k(x, x\u2032) = a²·exp(−‖x − x\u2032‖² / (2ℓ²)) has a length-scale ℓ controlling wiggliness and an amplitude a controlling the vertical range. At distance exactly ℓ the covariance drops to a²·exp(−0.5).',
        },
        {
          ar: 'الاستدلال مغلق الشكل: بعد رؤية القيم f(x₁:n) تصبح f(x) عند أي نقطة غاوسية بمتوسط m = k(x, x₁:n)·K⁻¹·f(x₁:n) وتباين s² = k(x, x) − k(x, x₁:n)·K⁻¹·k(x₁:n, x). المتوسط مزيج خطي من القيم المرصودة بأوزانها النووية؛ أما التباين فلا يعتمد على قيم الملاحظات إطلاقًا — يكبر بعيدًا عن البيانات لأن نقاطًا أقل تقيّد الدالة، وهذه هي عدم اليقين المعرفية القابلة للانخفاض بمزيد من البيانات. ضجيج الملاحظة يُضاف للقطر: K → K + σ²I، ويفصل عدم اليقين العشوائي غير القابل للاختزال.',
          en: 'Inference is closed-form: after observing f(x\u2081:n), the value at any x is Gaussian with mean m = k(x, x\u2081:n)·K\u207B\u00B9·f(x\u2081:n) and variance s² = k(x, x) − k(x, x\u2081:n)·K\u207B\u00B9·k(x\u2081:n, x). The mean is a linear blend of observed values weighted by the kernel; the variance does not depend on the observed values at all — it grows away from the data, where fewer points constrain the function. That is epistemic uncertainty, reducible with more data. Observation noise simply thickens the diagonal, K → K + σ²I, and accounts for the irreducible aleatoric part.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'نواة RBF على نقاط ثابتة + توزيع خلفي بحساب يدوي',
        en: 'RBF kernel on fixed points + a posterior computed by hand',
      },
      code: "import math\n\ndef rbf(x, xp, ls=1.0, amp=1.0):\n    return amp * amp * math.exp(-((x - xp) ** 2) / (2.0 * ls * ls))\n\nprint('k(0, 0), ls=1 = %.6f' % rbf(0, 0))\nprint('k(0, 1), ls=1 = %.6f   (distance = ls)' % rbf(0, 1))\nprint('k(0, 2), ls=1 = %.6f' % rbf(0, 2))\nprint('k(0, 2), ls=2 = %.6f   (longer scale, slower decay)' % rbf(0, 2, ls=2.0))\nprint('k(0, 5), ls=1 = %.8f   (essentially uncorrelated)' % rbf(0, 5))\n\n# a linear model IS a GP: f(x) = w0 + w1 x, w ~ N(0, 1)\n# mean m(x) = 0, covariance k(x, x') = 1 + x*x'\nprint('linear GP: k(2, 3) = %d,  Var[f(2)] = %d,  k(1, -1) = %d'\n      % (1 + 2 * 3, 1 + 2 * 2, 1 + 1 * (-1)))\n\n# posterior after ONE noise-free observation f(x1) = 1.2, K = [[1, c], [c, 1]]\ndef posterior_one(c, y):\n    m = c * y                       # k(x, x1) * K^{-1} * f(x1)\n    s = math.sqrt(1.0 - c * c)      # k(x, x) - k(x, x1) K^{-1} k(x1, x)\n    return m, s\n\nfor c in (0.9, 0.95):\n    m, s = posterior_one(c, 1.2)\n    print('c=%.2f -> m=%.6f, s=%.6f, 1-sd interval [%.4f, %.4f]'\n          % (c, m, s, m - s, m + s))\n\n# posterior after TWO observations, k12 = 0.5, y = [1.2, 1.4], k(x, X) = [0.9, 0.8]\nc12 = 0.5\ndet = 1.0 - c12 * c12\nkvec, y = [0.9, 0.8], [1.2, 1.4]\nKinv_y = [(y[0] - c12 * y[1]) / det, (-c12 * y[0] + y[1]) / det]\nKinv_k = [(kvec[0] - c12 * kvec[1]) / det, (-c12 * kvec[0] + kvec[1]) / det]\nm2 = kvec[0] * Kinv_y[0] + kvec[1] * Kinv_y[1]\ns2 = 1.0 - (kvec[0] * Kinv_k[0] + kvec[1] * Kinv_k[1])\nprint('two points: m=%.6f, s=%.6f, 95%% set [%.4f, %.4f]'\n      % (m2, math.sqrt(s2), m2 - 2 * math.sqrt(s2), m2 + 2 * math.sqrt(s2)))",
      explanation: {
        ar: 'النواة: k(0,0) = 1.000000 (تباين كل نقطة)، وعلى مسافة ℓ بالضبط تنخفض إلى exp(−0.5) = 0.606531؛ وعلى مسافة 2ℓ تنخفض إلى 0.135335 مع ℓ=1 لكنها تبقى 0.606531 مع ℓ=2 — مقياس أطول يعني ارتباطًا أبعد. عند مسافة 5 يصبح الارتباط 0.00000373 تقريبًا صفريًا. النموذج الخطي عملية غاوسية: k(2,3) = 7 وتباين f(2) يساوي 5. التوزيع الخلفي: بعد رصد f(x₁)=1.2 بارتباط 0.9 يكون المتوسط 1.08 والانحراف 0.435890 (فاصل ±1 انحراف [0.6441, 1.5159])؛ ومع ارتباط أقوى 0.95 ينزاح المتوسط إلى 1.14 ويضيق الانحراف إلى 0.312250. بعد إضافة رصد ثانٍ (k₁₂=0.5) يقفز المتوسط إلى 1.453333 وينهار الانحراف إلى 0.163299 (فاصل 95% ‎[1.1267, 1.7799]) — رصد واحد قلّصه من 0.435890 إلى 0.163299: كلما اقتربنا بالبيانات ضاق عدم اليقين المعرفي.',
        en: 'Kernel: k(0,0) = 1.000000 (the variance of every point); at distance exactly ℓ it decays to exp(−0.5) = 0.606531; at distance 2 it is 0.135335 for ℓ=1 but still 0.606531 for ℓ=2 — a longer scale correlates across larger gaps. At distance 5 the coupling is 0.00000373, essentially gone. The linear model is a GP: k(2,3) = 7 and Var[f(2)] = 5. Posterior: after observing f(x\u2081)=1.2 with correlation 0.9 the mean is 1.08 and the deviation 0.435890 (1-sd interval [0.6441, 1.5159]); with the stronger 0.95 the mean slides to 1.14 and the deviation narrows to 0.312250. Adding a second observation (k\u2081\u2082=0.5) pushes the mean to 1.453333 and collapses the deviation to 0.163299 (95% set [1.1267, 1.7799]) — one extra point shrank it from 0.435890 to 0.163299: more data, tighter epistemic uncertainty.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.rbf-kernel',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ rbf_kernel(x, xp, ls) التي تعيد k(x, x′) = exp(−(x − x′)² / (2·ls²)) بسعة a = 1، مستخدمًا math.exp فقط. الشروط: القطر يساوي 1، التماثل، والتناقص مع المسافة.',
        en: 'Implement rbf_kernel(x, xp, ls) returning k(x, x\u2032) = exp(\u2212(x \u2212 x\u2032)\u00B2 / (2·ls\u00B2)) with amplitude a = 1, using only math.exp. Requirements: unit diagonal, symmetry, and decay with distance.',
      },
      starterCode: "import math\n\ndef rbf_kernel(x, xp, ls):\n    # TODO: return exp( - (x - xp)**2 / (2 * ls * ls) )\n    pass\n",
      solution: "import math\n\ndef rbf_kernel(x, xp, ls):\n    return math.exp(-((x - xp) ** 2) / (2.0 * ls * ls))",
      tests: [
        {
          id: 't1',
          name: { ar: 'القطر وحدة والتماثل قائم', en: 'Unit diagonal and symmetry hold' },
          code: "assert abs(rbf_kernel(0, 0, 1) - 1.0) < 1e-12, 'diagonal must be 1'\nassert abs(rbf_kernel(0, 1, 1) - rbf_kernel(1, 0, 1)) < 1e-15, 'kernel must be symmetric'",
          expected: 'k(0,0)=1, k(0,1)=k(1,0)',
        },
        {
          id: 't2',
          name: { ar: 'قيمة مرجعية على مسافة ℓ', en: 'Reference value at distance ls' },
          code: "want = math.exp(-0.5)\nassert abs(rbf_kernel(0, 1, 1) - want) < 1e-9, 'expected exp(-0.5) ~ 0.606531 | got %r' % rbf_kernel(0, 1, 1)\nassert abs(rbf_kernel(0, 2, 1) - math.exp(-2.0)) < 1e-9, 'expected exp(-2) ~ 0.135335'",
          expected: 'exp(-0.5) and exp(-2.0)',
        },
        {
          id: 't3',
          name: { ar: 'التناقص مع المسافة ومقياس أطول يبطئه', en: 'Decay with distance; longer scale slows it' },
          code: "assert rbf_kernel(0, 2, 1) < rbf_kernel(0, 1, 1), 'kernel must decay with distance'\nassert rbf_kernel(0, 2, 2) > rbf_kernel(0, 2, 1), 'a longer length-scale must decay more slowly'\nassert rbf_kernel(0, 5, 1) < 1e-5, 'far points should be nearly uncorrelated'",
          expected: 'monotone decay, slower for larger ls',
        },
      ],
      hints: [
        { ar: 'الصيغة سطر واحد: math.exp(-((x - xp) ** 2) / (2.0 * ls * ls)). احذر القسمة الصحيحة — استخدم 2.0.', en: 'One line: math.exp(-((x - xp) ** 2) / (2.0 * ls * ls)). Beware integer division — write 2.0.' },
        { ar: 'قيم تحقق: عند x = xp النتيجة exp(0) = 1؛ وعند مسافة تساوي ls تكون exp(-0.5) ≈ 0.606531.', en: 'Sanity values: at x = xp the result is exp(0) = 1; at distance exactly ls it is exp(-0.5) \u2248 0.606531.' },
        { ar: 'التماثل تلقائي لأن (x − xp)² = (xp − x)²؛ لا تضف أي شرط يدويًا.', en: 'Symmetry is automatic because (x \u2212 xp)\u00B2 = (xp \u2212 x)\u00B2; add no manual condition.' },
        { ar: 'للاختبار الثالث قارن k(0,2) عند ls=1 و ls=2: الأول exp(−2) ≈ 0.135 والثاني exp(−0.5) ≈ 0.607 — مقياس أطول يعني أهدأ.', en: 'For the third test compare k(0,2) at ls=1 and ls=2: the first is exp(\u22122) \u2248 0.135, the second exp(\u22120.5) \u2248 0.607 — longer scale, calmer functions.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-posterior-mean',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'عملية غاوسية بمتوسط صفري ونواة قطرها 1. رصدنا قيمة واحدة بلا ضجيج: f(x₁) = 1.2، وكان الارتباط k(x, x₁) = 0.95. ما المتوسط التنبؤي m لنقطة x؟ (أدخل الرقم فقط، التقريب إلى منزلتين.)',
        en: 'A zero-mean GP with unit-diagonal kernel. We observe one noise-free value f(x\u2081) = 1.2 with correlation k(x, x\u2081) = 0.95. What is the predictive mean m at x? (Enter the number only, rounded to two decimals.)',
      },
      answer: '1.14',
      solution: '1.14',
      hints: [
        { ar: 'الصيغة لملاحظة واحدة: m = k(x, x₁) · K⁻¹ · f(x₁)، وK عددي 1 لأن k(x₁, x₁) = 1.', en: 'For a single observation: m = k(x, x\u2081) · K\u207B\u00B9 · f(x\u2081), and K is just the number 1 since k(x\u2081, x\u2081) = 1.' },
        { ar: 'إذن m = 0.95 × 1.2 — ضرب بسيط.', en: 'So m = 0.95 \u00D7 1.2 — a single multiplication.' },
        { ar: 'قيمة تحقق من المثال المُشغَّل: نفس الحساب بارتباط 0.9 أعطى 1.08؛ الارتباط الأقوى هنا يسحب التنبؤ أقرب إلى 1.2.', en: 'Cross-check from the worked example: the same computation at correlation 0.9 gave 1.08; the stronger correlation here pulls the prediction closer to 1.2.' },
        { ar: 'الجواب: 1.14. ولاحظ أن الانحراف s² = 1 − 0.95² = 0.0975 ضاق أيضًا.', en: 'Answer: 1.14. Note the deviation also tightened: s\u00B2 = 1 \u2212 0.95\u00B2 = 0.0975.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef rbf(x, xp, ls=1.0):\n    return math.exp(-((x - xp) ** 2) / (2.0 * ls * ls))\n\nprint('RBF decay vs length-scale for the pair (0, 1):')\nfor ls in (0.5, 1.0, 2.0, 4.0):\n    print('  ls=%.1f -> k(0,1) = %.6f' % (ls, rbf(0, 1, ls)))\n\nprint('linear-model GP, k(x, x\\') = 1 + x*x\\':')\nfor a in (-1, 0, 1, 2):\n    print('  k(1, %d) = %d,  Var f(%d) = %d' % (a, 1 + 1 * a, a, 1 + a * a))\n\ndef posterior_one(c, y=1.2):\n    return c * y, math.sqrt(1.0 - c * c)\n\nprint('posterior deviation vs correlation:')\nfor c in (0.5, 0.8, 0.9, 0.95, 0.99):\n    m, s = posterior_one(c)\n    print('  c=%.2f -> m=%.4f, s=%.6f' % (c, m, s))\n\n# جرّب: نقطة بعيدة ك(0, 8) بمقياس ℓ=1 — كم اقترب الارتباط من الصفر؟ وماذا يعني ذلك للتنبؤ عندها؟\n# try: a far pair like (0, 8) at ls=1 - how close to zero is the correlation, and what does that mean for predicting there?\n# جرّب: احسب التوزيع الخلفي بمراقبتين بمسافة k12 = 0.9 بدل 0.5 وقارن الانحراف مع 0.163299.\n# try: redo the two-observation posterior with k12 = 0.9 instead of 0.5 and compare the deviation against 0.163299.\n",
      prompt: {
        ar: 'الملعب يفصل الأدوار: النواة تحدد من يؤثر على من (قيم k على أزواج ثابتة)، ومعادلات الخلفية تحدد كيف تتجمع الأدلة. لاحظ أن التباين يعتمد على مواضع النقاط فقط — قيم y لا تدخل فيه.',
        en: 'The sandbox separates the roles: the kernel decides who influences whom (k values on fixed pairs), and the posterior equations decide how evidence aggregates. Notice the variance depends only on point locations — the y values never enter it.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الذي يعرّف عملية غاوسية f ∼ GP(m, k)؟',
            en: 'What defines a Gaussian process f \u223C GP(m, k)?',
          },
          options: [
            { id: 'a', text: { ar: 'أي مجموعة منتهية من قيم الدالة تتبع توزيعًا غاوسيًا متعدد المتغيرات بمتوسط m(xᵢ) وتغاير k(xᵢ, xⱼ)', en: 'Any finite collection of function values follows a multivariate Gaussian with mean m(x\u1D62) and covariance k(x\u1D62, x\u2C7C)' } },
            { id: 'b', text: { ar: 'أن تكون الدالة خطية بالضرورة في مدخلاتها', en: 'That the function must be linear in its inputs' } },
            { id: 'c', text: { ar: 'أن تُقدَّر معاملات النموذج بالانحدار الأدنى مربعات أولًا', en: 'That the model parameters must first be estimated by least squares' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التعريف فضائي الدوال: التوزيع يحكم قيم f نفسها عند أي مجموعة مدخلات، بمتوسط دالة m وتغاير دالة k. النموذج الخطي بأوزان غاوسية حالة خاصة منها (k(x,x′) = 1 + x·x′)، وكذلك نواة RBF التي تمثل نموذجًا بعدد أسس لانهائي.',
            en: 'The definition lives in function space: the distribution governs the values of f itself at any finite input set, via a mean function m and covariance function k. A linear model with Gaussian weights is a special case (k(x,x\u2032) = 1 + x·x\u2032), and so is the RBF kernel, which represents a model with infinitely many basis functions.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في نواة RBF، ما أثر رفع مقياس الطول ℓ؟',
            en: 'In the RBF kernel, what does increasing the length-scale ℓ do?',
          },
          options: [
            { id: 'a', text: { ar: 'يرفع سعة الدالة العمودية دون تغيير سرعة تذبذبها', en: 'It raises the vertical amplitude without changing the rate of variation' } },
            { id: 'b', text: { ar: 'يجعل الدوال أهدأ وأبطأ تذبذبًا، ويمدّ الارتباط على مسافات أبعد', en: 'It makes functions calmer and slower-varying, extending correlation across larger distances' } },
            { id: 'c', text: { ar: 'لا أثر له — مقياس الطول مجرد معامل تطبيع داخلي', en: 'No effect — the length-scale is just an internal normalization constant' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'ℓ يقف في المقام: k = a²exp(−d²/(2ℓ²))، فزيادته تبطئ الاضمحلال. في المثال المُشغَّل كانت k(0,2) تساوي 0.135335 عند ℓ=1 لكنها 0.606531 عند ℓ=2: نقاط أبعد تبقى مترابطة، فالدوال المرسومة أقل تذبذبًا وعدم اليقين ينمو ببطء أكبر بعيدًا عن البيانات. أما السعة a فتتحكم في المدى العمودي لا في السرعة.',
            en: 'ℓ sits in the denominator, k = a²exp(−d²/(2ℓ²)), so raising it slows the decay. In the worked example k(0,2) was 0.135335 at ℓ=1 but 0.606531 at ℓ=2: distant points stay correlated, drawn functions wiggle less, and uncertainty grows more slowly away from data. The amplitude a controls vertical scale, not speed.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يكبر عدم اليقين التنبؤي للعملية الغاوسية كلما ابتعدنا عن نقاط البيانات؟',
            en: 'Why does GP predictive uncertainty grow as we move away from the data?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن التباين التنبؤي s² = k(x,x) − k(x,X)K⁻¹k(X,x) يفقد مصطلحات الخصم مع ضعف الارتباط عن بعد، وهذه عدم يقين معرفية تنقص مع بيانات أكثر', en: 'Because s² = k(x,x) \u2212 k(x,X)K\u207B\u00B9k(X,x) loses its discount terms as correlations weaken with distance — epistemic uncertainty that shrinks with more data' } },
            { id: 'b', text: { ar: 'لأن قيم y المرصودة تتراكم خطأً كلما بعدت المسافة', en: 'Because the observed y values accumulate error with distance' } },
            { id: 'c', text: { ar: 'لأن النواة تُعاد معايرتها تلقائيًا عند كل استعلام جديد', en: 'Because the kernel is recalibrated automatically at each new query' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التباين لا يعتمد على قيم y إطلاقًا؛ يعتمد على المواضع فقط. عندما تكون k(x, xᵢ) صغيرة (بعيدًا عن كل نقاط التدريب) يختفي الفرق k(x,x) − … فيعود التباين إلى التباين القبلي الكامل. هذه عدم يقين معرفية قابلة للاختزال: أضف رصدًا في المنطقة فتنخفض، وقد رأينا الانحراف يهبط من 0.435890 إلى 0.163299 بإضافة نقطة واحدة.',
            en: 'The variance never reads the y values; it depends on locations alone. When k(x, x\u1D62) is small (far from every training point) the discount k(x,x) \u2212 … vanishes and the variance falls back to the full prior. This is reducible epistemic uncertainty: add one observation nearby and it drops — in our run the deviation fell from 0.435890 to 0.163299 with a single extra point.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'العملية الغاوسية تحوّل النمذجة من تقدير أوزان إلى حجز خصائص دوال مباشرة: أي مجموعة قيمها توزيع غاوسي متعدد متغيرات بمتوسط m ونواة k (الهدف من s1 مقدمة إلى العمليات الغاوسية).', en: 'A Gaussian process shifts modelling from estimating weights to specifying function properties directly: any finite set of its values is jointly Gaussian with mean m and kernel k (goal of s1 Introduction to Gaussian Processes).' },
        { ar: 'التوزيع على الأوزان يُترجم إلى فضاء الدوال (k = 1 + x·x′ للنموذج الخطي)، ونواة RBF بمقياس طول ℓ وسعة a تضبط التذبذب والمدى (الهدف من s2 تباديس العمليات الغاوسية).', en: 'A weight-space prior translates into function space (k = 1 + x·x\u2032 for the linear model), and the RBF kernel with length-scale ℓ and amplitude a governs wiggliness and vertical range (goal of s2 Gaussian Process Priors).' },
        { ar: 'الاستدلال مغلق الشكل: m = k(x,X)K⁻¹y وs² = k(x,x) − k(x,X)K⁻¹k(X,x)؛ المتوسط مزيج موزون بالارتباطات والتباين معرفي يكبر بعيدًا عن البيانات ويضيق مع كل رصد جديد (الهدف من s3 استدلال العمليات الغاوسية).', en: 'Inference is closed-form: m = k(x,X)K\u207B\u00B9y and s\u00B2 = k(x,x) \u2212 k(x,X)K\u207B\u00B9k(X,x); the mean blends observations by correlation, the variance is epistemic, growing away from data and shrinking with every new observation (goal of s3 Gaussian Process Inference).' },
      ],
      reflectPrompt: {
        ar: 'لو طلبت منك تصميم نواة لدرجات حرارة يومية في مدينة واحدة، أي خصائص الدوال تحجزها في m و k؟ وحدد متى تتوقع أن يقول لك فاصل الثقة «أعرف» وأتى يقول «لا أعرف».',
        en: 'Designing a kernel for daily temperature readings in one city, which function properties would you encode in m and k? And where do you expect the credible band to say \u201CI know\u201D versus \u201CI do not know\u201D?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch18.s1' },
        { book: 'D2L', section: 'd2l.ch18.s2' },
        { book: 'D2L', section: 'd2l.ch18.s3' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch18.s1' },
    { book: 'D2L', section: 'd2l.ch18.s2' },
    { book: 'D2L', section: 'd2l.ch18.s3' },
  ],
} satisfies Lesson;

export default lesson;
