import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch12.l2 — "Noise, Batches, and Velocity: SGD, Minibatches, Momentum"
 * الضجيج والدفعات والسرعة: SGD وminibatch وmomentum
 * Aligned with D2L ch12 s4 (Stochastic Gradient Descent) + s5 (Minibatch SGD)
 * + s6 (Momentum). All expression is original — a paraphrase of the source's
 * ideas, never a verbatim translation. Runnable design: GD vs momentum on the
 * ill-conditioned valley 0.1x1^2+2x2^2 with book-matching floats, plus a
 * minibatch variance-reduction computation. Every literal verified under
 * CPython 3. The only "noise" is a fixed-seed LCG — fully deterministic.
 */
const lesson = {
  id: 'd2l.ch12.l2',
  version: 1,
  part: 'II',
  track: 'A7',
  book: 'D2L',
  chapter: 12,
  title: {
    ar: 'الضجيج والدفعات والسرعة: SGD وminibatch وmomentum',
    en: 'Noise, Batches, and Velocity: SGD, Minibatches, Momentum',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch12.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حساب التدرج على كل مثال بكل خطوة مكلف عبثًا: أغلب الأمثلة متشابهة والمعلومة التي تضيفها قليلة. لهذا نأخذ عينة واحدة أو دفعة صغيرة — فيدخل الضجيج إلى التحديث، ويصبح اختيار معدل التعلم لعبة على حبل مشدود. سترى في هذا الدرس كيف يعلّق الضجيج SGD فوق الصغْر، وكيف تدفعك الدفعة الصغيرة إلى الاختيار بين السرعة والدقة، ثم كيف ينقذنا momentum من وادٍ لا يرضى أي معدل تعلم واحد.',
        en: 'Computing the gradient over every example at every step is wasteful: most examples look alike and add little information. So we sample one example or a small batch — noise enters the update, and choosing the learning rate becomes a tightrope walk. In this lesson you will see how noise keeps SGD hovering above the minimum, how the minibatch forces a trade between speed and stability, and how momentum rescues us from a valley that no single learning rate satisfies.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'SGD المتشائل، الدفعة الصغيرة، ومتوسط التسرب', en: 'Noisy SGD, minibatches, and the leaky average' },
      chunks: [
        {
          ar: 'الهدف الكلي هو متوسط خسائر الأمثلة، وتدرجه متوسط تدرجاتها — وحسابه كل خطوة يكلف O(n). لذلك يختار SGD مثالًا واحدًا i عشوائيًا ويحدّث بـ x ← x − η·∇fᵢ(x): كلفة ثابتة O(1)، والتدرج الفردي تقدير غير متحيّز للتدرج الكامل لأن توقعه يساويه بالضبط. الثمن ضجيج: حتى قرب الصغْر تبقى الخطوات تهتز، ولا ينفع تقليل η بسرعة (يتوقف مبكرًا) ولا ببطء (يعضد حول الهدف) — لذلك نبرمج η(𝑡) كدالة زمن: ثابتة بالقطع، أو أُسية e^(−λt)، أو كثيرة الحدود (βt+1)^(−α) وهي الخيار المحبب مع α=0.5.',
          en: 'The full objective is the average of per-example losses, and its gradient is the average of their gradients — costing O(n) per step. SGD instead samples one index i uniformly and updates x ← x − η·∇fᵢ(x): constant O(1) cost, and the single-example gradient is an unbiased estimate of the full gradient because its expectation equals it exactly. The price is noise: even near the minimum, steps keep jittering, and shrinking η too fast stalls early while shrinking it too slowly rattles around the target — so η(t) becomes a function of time: piecewise constant, exponential e^(−λt), or polynomial (βt+1)^(−α), the popular choice with α=0.5.',
        },
        {
          ar: 'الدفعة الصغيرة بين الحدين: نستبدل تدرج مثال واحد بمتوسط تدرجات |B𝑡| مثالًا. التوقع لا يتغير، لكن التباين ينخفض: بما أننا نُوسط b تدرجًا مستقلًا، ينخفض الانحراف المعياري بالعامل b^(−1/2) — في دفعة من 4 ينقسم الارتجاف إلى النصف كما في المثال المُشغَّل. بعد حدٍّ ما تصبح المكسب الإحصائي أقل من كلفة الحساب الخطية، فنختار أكبر دفعة تتسع للذاكرة وتشبع وحدات الحوسبة: المعالجات تقرأ البيانات كتلًا متجاورة (burst reads) وليس بايت بايت، وضرب المصفوفات الكتليّة يستفيد من ذاكرة التخزين المؤقت بدل العنصر الواحد.',
          en: 'The minibatch sits between the extremes: replace one example\u2019s gradient by the average over |B𝑡| examples. The expectation is unchanged, but the variance drops: averaging b independent gradients shrinks the standard deviation by the factor b^(−1/2) — in a batch of 4 the jitter halves, as the worked example measures. Past some point the statistical gain is smaller than the linear compute cost, so we pick the largest batch that fits memory and saturates the hardware: processors read data in contiguous bursts rather than byte by byte, and blocked matrix multiplication exploits caches instead of single elements.',
        },
        {
          ar: 'momentum يستبدل التدرج اللحظي بمتوسط متسرب v𝑡 = β·v𝑡−1 + g𝑡 ثم يحدّث x ← x − η·v𝑡. المتسلسلة تلملم βʹ⁰g + βg⁻¹ + ... فأوزان الماضي تجمع إلى 1/(1−β): مع β=0.9 تعادل الدفعة الفعالة 10 تدرجات، ومع β=0 نعود إلى النزول التدريجي الصافي. في الوادي الوعر 0.1x₁²+2x₂²، تدرجات الاتجاه x₂ تتراقص فيلغي بعضها بعضًا، بينما تدرجات x₁ المسطحة تتراكم فيسرع — لذلك ينجح momentum بمعدل تُخفق به GD.',
          en: 'Momentum replaces the instantaneous gradient by a leaky average v𝑡 = β·v𝑡−1 + g𝑡 and updates x ← x − η·v𝑡. Unrolling gives β⁰g + βg⁻¹ + ... whose weights sum to 1/(1−β): with β=0.9 the effective batch is 10 gradients, and with β=0 we recover plain gradient descent. On the rough valley 0.1x₁²+2x₂², the x₂ gradients oscillate and cancel one another while the flat x₁ gradients accumulate and accelerate — which is why momentum succeeds at a rate where GD fails.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'ثلاثة محرّكات في الوادي الوعر + قياس هدوء الدفعة',
        en: 'Three engines in the rough valley + measuring batch calm',
      },
      code: "def run(eta, beta, steps=20):\n    \"\"\"GD when beta=0 (v just holds the gradient), momentum otherwise.\n    Valley: f = 0.1*x1^2 + 2*x2^2, gradient = (0.2*x1, 4*x2).\"\"\"\n    x1, x2, v1, v2 = -5.0, -2.0, 0.0, 0.0\n    for _ in range(steps):\n        g1, g2 = 0.2 * x1, 4 * x2\n        v1 = beta * v1 + g1\n        v2 = beta * v2 + g2\n        x1 -= eta * v1\n        x2 -= eta * v2\n    return x1, x2\n\nprint('gd       eta=0.4        -> x1 = %.6f, x2 = %.6f' % run(0.4, 0.0))\nprint('gd       eta=0.6        -> x1 = %.6f, x2 = %.6f' % run(0.6, 0.0))\nprint('momentum eta=0.6 b=0.5  -> x1 = %.6f, x2 = %.6f' % run(0.6, 0.5))\nprint('momentum eta=0.6 b=0.25 -> x1 = %.6f, x2 = %.6f' % run(0.6, 0.25))\n\n# Minibatch effect on gradient noise: fixed batch of 4 gradients.\ngs = [2.0, -1.0, 0.5, -0.5]\nmean = sum(gs) / len(gs)\nsingle_sd = (sum((g - mean) ** 2 for g in gs) / len(gs)) ** 0.5\nprint('grad mean %.6f | single-example sd %.6f | batch-of-4 sd %.6f'\n      % (mean, single_sd, single_sd / len(gs) ** 0.5))\nprint('effective sample weight 1/(1-0.9) = %.1f | 1/(1-0.5) = %.1f'\n      % (1 / (1 - 0.9), 1 / (1 - 0.5)))",
      explanation: {
        ar: 'مع β=0 يستعيد run النزول التدريجي الصافي: بمعدل 0.4 يصل إلى (−0.943467, −0.000073) — الاتجاه x₂ هدأ تمامًا لكن x₁ ما زال بعيدًا، وبمعدل 0.6 ينفجر x₂ إلى −1673.365109 بينما تحسّن x₁. أما momentum بمعدل 0.6 وβ=0.5 فيصل إلى (0.007188, 0.002553): الترس velocity جمع التدرجات المتوافقة في x₁ ووسّط التذبذب في x₂. خفض β إلى 0.25 يضعف التراكم فنصل إلى (−0.126340, −0.186632) فقط. وفي أسفل التقرير قياس الدفعة: المتوسط بقي 0.250000 بينما قصّ الانحراف المعياري من 1.145644 إلى 0.572822 بعامل 4^(−1/2)=0.5، وأوزان momentum الفعالة 10.0 و2.0.',
        en: 'With β=0, run recovers plain gradient descent: at rate 0.4 it reaches (−0.943467, −0.000073) — axis x₂ has gone quiet but x₁ is still far; at rate 0.6, x₂ explodes to −1673.365109 while x₁ improves. Momentum at rate 0.6 with β=0.5 reaches (0.007188, 0.002553): the velocity accumulated aligned gradients along x₁ and averaged out the oscillation along x₂. Lowering β to 0.25 weakens the accumulation, reaching only (−0.126340, −0.186632). The bottom report measures the batch: the mean stays 0.250000 while the standard deviation is cut from 1.145644 to 0.572822 by the factor 4^(−1/2)=0.5, and the effective momentum weights are 10.0 and 2.0.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.momentum-valley',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ momentum_valley(eta, beta, steps) على f = 0.1·x₁² + 2·x₂² من نقطة البداية (−5.0, −2.0) بحالة أولية v1=v2=0.0: في كل خطوة احسب g1=0.2·x1 وg2=4·x2 ثم v1 = beta·v1 + g1 وv2 = beta·v2 + g2 ثم x ← x − eta·v. لاحظ أن beta=0 يعطي النزول التدريجي الصافي. أعِد الزوج (x1, x2) النهائي.',
        en: 'Implement momentum_valley(eta, beta, steps) on f = 0.1·x₁² + 2·x₂² from the start point (−5.0, −2.0) with initial state v1=v2=0.0: each step compute g1=0.2·x1 and g2=4·x2, then v1 = beta·v1 + g1 and v2 = beta·v2 + g2, then x ← x − eta·v. Note that beta=0 gives plain gradient descent. Return the final pair (x1, x2).',
      },
      starterCode: "def momentum_valley(eta, beta, steps=20):\n    x1, x2, v1, v2 = -5.0, -2.0, 0.0, 0.0\n    # TODO: for each step: gradients, then velocity update, then position update\n    return x1, x2\n",
      solution: "def momentum_valley(eta, beta, steps=20):\n    x1, x2, v1, v2 = -5.0, -2.0, 0.0, 0.0\n    for _ in range(steps):\n        g1, g2 = 0.2 * x1, 4 * x2\n        v1 = beta * v1 + g1\n        v2 = beta * v2 + g2\n        x1 -= eta * v1\n        x2 -= eta * v2\n    return x1, x2",
      tests: [
        {
          id: 't1',
          name: { ar: 'momentum 0.6/0.5 يتقارب إلى الزوج المعروف', en: 'momentum 0.6/0.5 converges to the known pair' },
          code: "x1, x2 = momentum_valley(0.6, 0.5, 20)\nassert abs(x1 - 0.007188) < 1e-6 and abs(x2 - 0.002553) < 1e-6, 'expected ~(0.007188, 0.002553) | got (%r, %r)' % (x1, x2)",
          expected: '(0.007188, 0.002553)',
        },
        {
          id: 't2',
          name: { ar: 'خفض beta إلى 0.25 يبطل التسارع', en: 'Lowering beta to 0.25 weakens the acceleration' },
          code: "x1, x2 = momentum_valley(0.6, 0.25, 20)\nassert abs(x1 - (-0.126340)) < 1e-6 and abs(x2 - (-0.186632)) < 1e-6, 'expected ~(-0.126340, -0.186632) | got (%r, %r)' % (x1, x2)",
          expected: '(-0.126340, -0.186632)',
        },
        {
          id: 't3',
          name: { ar: 'beta=0 يستعيد GD وينفجر بمعدل 0.6', en: 'beta=0 recovers GD and diverges at rate 0.6' },
          code: "x1, x2 = momentum_valley(0.4, 0.0, 20)\nassert abs(x1 - (-0.943467)) < 1e-6 and abs(x2 - (-0.000073)) < 1e-6, 'gd 0.4 expected ~(-0.943467, -0.000073)'\nx1, x2 = momentum_valley(0.6, 0.0, 20)\nassert abs(x2) > 1000, 'gd at eta=0.6 must diverge along x2 | got %r' % x2",
          expected: 'gd 0.4 quiet, gd 0.6 explodes',
        },
      ],
      hints: [
        { ar: 'رتب الأسطر بدقة: التدرج أولًا، ثم تحديث السرعة بالتدرج، ثم تحديث الموضع بالسرعة — عكس الترتيب يفسد القيم.', en: 'Order the lines exactly: gradient first, then velocity update from the gradient, then position update from the velocity — reordering corrupts the values.' },
        { ar: 'السرعة تتحدث دائمًا بالصيغة v = beta*v + g حتى لو كان beta=0: عندها v=g مجردة فيصبح التحديث هو GD.', en: 'The velocity always updates as v = beta*v + g even when beta=0: then v=g directly and the update is plain GD.' },
        { ar: 'قيم تحقق: بعد 20 خطوة بـ eta=0.6 وbeta=0.5 تحصل (0.007188, 0.002553)، وبـ beta=0.25 تحصل (−0.126340, −0.186632).', en: 'Sanity values: after 20 steps at eta=0.6, beta=0.5 gives (0.007188, 0.002553), and beta=0.25 gives (−0.126340, −0.186632).' },
        { ar: 'لا تقسّم التدرج على حجم أي دفعة هنا: دوال الوادي تحسب تدرج الموضع كاملًا في كل خطوة.', en: 'Do not divide the gradient by any batch size here: the valley functions compute the full position gradient each step.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-effective-weight',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في momentum بمعامل تسرب β = 0.9، ما حجم الدفعة الفعالة التي يعادلها تراكم الماضي (مجموع الأوزان)؟',
        en: 'In momentum with leak coefficient β = 0.9, what is the effective sample size that the accumulated past stands for (the sum of weights)?',
      },
      options: [
        { id: 'a', text: { ar: '9 — لأن آخر 9 تدرجات فقط تُحتسب', en: '9 — because only the last 9 gradients count' } },
        { id: 'b', text: { ar: '10 — لأن مجموع الأوزان يقارب 1/(1−β) = 10', en: '10 — because the weights sum to 1/(1−β) = 10' } },
        { id: 'c', text: { ar: '1 — momentum لا يغيّر حجم الخطوة الفعال', en: '1 — momentum does not change the effective step size' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'افتح v = βv + g على الورق: v = g + βg₋₁ + β²g₋₂ + ... حتى ما لا نهاية.', en: 'Unroll v = βv + g on paper: v = g + βg₋₁ + β²g₋₂ + ... forever.' },
        { ar: 'مجموع المتوالية الهندسية 1 + β + β² + ... يساوي 1/(1−β) عندما 0 < β < 1.', en: 'The geometric series 1 + β + β² + ... sums to 1/(1−β) when 0 < β < 1.' },
        { ar: 'عندها حجم الخطوة الفعال يتضخم من η إلى η/(1−β) — فنخفض η عندما نرفع β.', en: 'The effective step size therefore inflates from η to η/(1−β) — which is why we lower η when raising β.' },
        { ar: 'الجواب: b — 1/(1−0.9) = 10 كما في سطر المثال المُشغَّل.', en: 'Answer: b — 1/(1−0.9) = 10, as in the worked example\u2019s line.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\n# Deterministic LCG noise (seeded, fixed): the only noise source we ever use.\nstate = 7\ndef lcg():\n    global state\n    state = (state * 1103515245 + 12345) % (2 ** 31)\n    return state / (2 ** 31)\n\nx1, x2 = -5.0, -2.0\nfor t in range(1, 51):\n    g1, g2 = 2 * x1, 4 * x2\n    x1 -= 0.1 * (g1 + (lcg() - 0.5))\n    x2 -= 0.1 * (g2 + (lcg() - 0.5))\n    if t in (10, 30, 50):\n        print('step %2d: x1 = %.6f, x2 = %.6f, dist = %.6f'\n              % (t, x1, x2, math.hypot(x1, x2)))\n\n# جرّب: غيّر البذرة إلى 11 وأعد التشغيل — المسار يتغير لكن الارتجاج حول الصغر يبقى.\n# try: change the seed to 11 and rerun — the path changes but the jitter near the minimum persists.\n# جرّب: طبّق جدولة كثيرة الحدود eta_t = 0.5*(1+0.1*t)**-0.5 بدل المعدل الثابت وقارن المسافة النهائية.\n# try: apply a polynomial schedule eta_t = 0.5*(1+0.1*t)**-0.5 instead of the constant rate and compare the final distance.\n",
      prompt: {
        ar: 'الملعب يشغّل SGD بضجيج LCG ثابت البذرة على الوادي f = x₁² + 2x₂²، فيراك يهتز حول الصغْر ولا يستقر. جرّب البذور المختلفة وجدولة η الزمنية وشاهد أثرهما على المسافة النهائية.',
        en: 'The sandbox runs SGD with fixed-seed LCG noise on the valley f = x₁² + 2x₂², showing you hovering and rattling near the minimum without settling. Try different seeds and a time-dependent η schedule, and watch how each changes the final distance.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يُعد تدرج المثال الواحد ∇fᵢ(x) تقديرًا غير متحيّز للتدرج الكامل ∇f(x)؟',
            en: 'Why is the single-example gradient ∇fᵢ(x) an unbiased estimate of the full gradient ∇f(x)?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن أمثلة التدريب متطابقة دائمًا', en: 'Because training examples are always identical' } },
            { id: 'b', text: { ar: 'لأن توقع التدرج المُعين بUniform يساوي متوسط التدرجات = التدرج الكامل', en: 'Because the expectation over a uniform draw equals the average of gradients = the full gradient' } },
            { id: 'c', text: { ar: 'لأن الضجيج يختفي بعد خطوات كافية', en: 'Because the noise vanishes after enough steps' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'Eᵢ[∇fᵢ(x)] = (1/n)·Σ∇fᵢ(x) = ∇f(x): المتوسط الاحتمالي للتدرج المختار عشوائيًا هو التدرج الكامل نفسه، لذا «في المتوسط» نتجه صحيحًا رغم ارتجاج كل خطوة فردية.',
            en: 'Eᵢ[∇fᵢ(x)] = (1/n)·Σ∇fᵢ(x) = ∇f(x): the expectation of the uniformly drawn gradient is exactly the full gradient, so on average we head the right way despite each individual step jittering.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'توسيع الدفعة من مثال واحد إلى b مثالًا مستقلًا — ماذا يحدث للانحراف المعياري لتقدير التدرج؟',
            en: 'Growing the batch from 1 example to b independent examples — what happens to the standard deviation of the gradient estimate?',
          },
          options: [
            { id: 'a', text: { ar: 'ينخفض بالعامل b^(−1/2) — دفعة من 4 تنصف الارتجاج', en: 'It shrinks by the factor b^(−1/2) — a batch of 4 halves the jitter' } },
            { id: 'b', text: { ar: 'ينخفض بالعامل b — دفعة من 4 تقطعه للربع', en: 'It shrinks by the factor b — a batch of 4 quarters it' } },
            { id: 'c', text: { ar: 'لا يتغير لأن التوقع بقي نفسه', en: 'It is unchanged because the expectation stays the same' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'توسط b متغيرًا مستقلًا يقسم الانحراف المعياري على √b وليس b: الدفعة من 4 خفضت sd من 1.145644 إلى 0.572822 في المثال. لهذا يفقد مضاعفة الدفعة أثرها تدريجيًا بينما تكلفة الحساب تنمو خطيًا.',
            en: 'Averaging b independent variables divides the standard deviation by √b, not b: the batch of 4 cut the sd from 1.145644 to 0.572822 in the example. That is why doubling the batch yields diminishing returns while compute cost grows linearly.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في الوادي 0.1x₁²+2x₂²، لماذا ينجح momentum بمعدل تعلم 0.6 حيث ينفجر النزول التدريجي؟',
            en: 'On the valley 0.1x₁²+2x₂², why does momentum succeed at learning rate 0.6 where gradient descent explodes?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن momentum يضاعف التدرج في كل الاتجاهات بلا استثناء', en: 'Because momentum amplifies gradients in every direction alike' } },
            { id: 'b', text: { ar: 'لأن تدرجات x₂ المتتراقصة تلغي بعضها في المتوسط المتسرب بينما تتراكم تدرجات x₁ المتوافقة', en: 'The oscillating x₂ gradients cancel in the leaky average while the aligned x₁ gradients accumulate' } },
            { id: 'c', text: { ar: 'لأن momentum يخفض معدل التعلم تلقائيًا في الاتجاهات الحادة', en: 'Because momentum automatically lowers the learning rate in steep directions' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المتوسط المتسرب مرشح زمني: الإشارات المتذبذبة يتعادل أثرها بينما الإشارات الثابتة تتراكم بمجموع 1/(1−β). في مثالنا انهارت x₂ إلى 0.002553 بدل الانفجار إلى −1673.365109، وتسارعت x₁ من −0.943467 إلى 0.007188.',
            en: 'The leaky average is a temporal filter: oscillating signals cancel out while steady signals accumulate with sum 1/(1−β). In our run x₂ collapsed to 0.002553 instead of exploding to −1673.365109, and x₁ sped up from −0.943467 to 0.007188.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'SGD يختار مثالًا واحدًا بتكلفة O(1) وتقدير غير متحيّز، لكن ضجيجها يفرض جدولة η(𝑡) الزمنية: قطعية أو أُسية أو كثيرة الحدود (الهدف من s4 SGD).', en: 'SGD samples one example at O(1) cost with an unbiased gradient, but its noise forces a time-dependent η(t): piecewise, exponential, or polynomial (goal of s4 Stochastic Gradient Descent).' },
        { ar: 'الدفعة الصغيرة تُوسط b تدرجًا فيبقى التوقع وينخفض sd بعامل b^(−1/2)، وتستثمر المتجهات وذاكرة التخزين المؤقت بدل العنصر الواحد (الهدف من s5 minibatch SGD).', en: 'The minibatch averages b gradients: expectation unchanged, sd down by b^(−1/2), while exploiting vectorization and caches instead of single elements (goal of s5 Minibatch SGD).' },
        { ar: 'momentum يستبدل التدرج بسرعة v=βv+g مجموع أوزانها 1/(1−β): يراكم الاتجاهات المتوافقة ويلغي المتراقصة، وينقذ الوادي الوعر بمعدلات تفشل فيها GD (الهدف من s6 momentum).', en: 'Momentum swaps the gradient for a velocity v=βv+g whose weights sum to 1/(1−β): it accumulates aligned directions, cancels oscillating ones, and rescues the rough valley at rates where GD fails (goal of s6 Momentum).' },
      ],
      reflectPrompt: {
        ar: 'لديك دفعة من 4 تدرجات انحرافها المعياري 1.145644. كم دفعةً تحتاج لخفض الارتجاج تحت 0.3، وعند أي حجم تصبح كلفة الحساب أثقل من المكسب الإحصائي في رأيك؟',
        en: 'You have a batch of 4 gradients with standard deviation 1.145644. How large a batch do you need to push the jitter below 0.3 — and at what size does compute cost start outweighing the statistical gain in your judgment?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch12.s4' },
        { book: 'D2L', section: 'd2l.ch12.s5' },
        { book: 'D2L', section: 'd2l.ch12.s6' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch12.s4' },
    { book: 'D2L', section: 'd2l.ch12.s5' },
    { book: 'D2L', section: 'd2l.ch12.s6' },
  ],
} satisfies Lesson;

export default lesson;
