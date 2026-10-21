import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch12.l3 — "Per-Coordinate Learning Rates: Adagrad, RMSProp, Adadelta"
 * معدلات تعلم لكل إحداثية: Adagrad وRMSProp وAdadelta
 * Aligned with D2L ch12 s7 (Adagrad) + s8 (RMSProp) + s9 (Adadelta). All
 * expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: the three scalers on the same valley
 * 0.1x1^2+2x2^2 with book-matching floats and effective-rate diagnostics.
 * Every literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch12.l3',
  version: 1,
  part: 'II',
  track: 'A7',
  book: 'D2L',
  chapter: 12,
  title: {
    ar: 'معدلات تعلم لكل إحداثية: Adagrad وRMSProp وAdadelta',
    en: 'Per-Coordinate Learning Rates: Adagrad, RMSProp, Adadelta',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch12.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'معامل نموذجك مرتبط بكلمة تظهر مرة كل مليون، وآخر مرتبط بصورة تظهر في كل دفعة: لماذا يأخذان الخطوة نفسها؟ التدرجات الكبيرة تجعل بعض الإحداثيات تطير بينما الكسدة تتجمد. هذا الدرس يبني سلسلة الحلول الكلاسيكية: adagrad يعطي كل إحداثية معدلها الخاص من تراكم مربعات التدرج، وrmsprop يخفف هذا التراكم حتى لا يموت معدل التعلم، وadadelta يتخلى عن معدل التعلم كليًا ويستخدم حجم التغيير نفسه كمسطرة.',
        en: 'One weight of your model is tied to a word seen once in a million; another is tied to pixels seen in every batch: why should they take the same-sized step? Large gradients let some coordinates fly while the stagnant ones freeze. This lesson builds the classic ladder of fixes: adagrad gives each coordinate its own rate from accumulated squared gradients, rmsprop leaks that accumulation so the rate never dies, and adadelta drops the learning rate entirely and uses the size of past changes as its own ruler.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الميزات النادرة، التسريب، والمعايرة الذاتية', en: 'Sparse features, leaking, and self-calibration' },
      chunks: [
        {
          ar: 'مشكلة adagrad تنبع من الميزات النادرة: معدل تعلم متنازل مثل η₀/√t يناسب الإحداثيات الشائعة لكنه يقتل النادرة قبل أن ترى بيانات كافية. عدّاد الظهور للإحداثية i خشن — فالحل الأذكى تراكم مربعات التدرج نفسها: s ← s + g² ثم التحديث x ← x − η/√(s+ε)·g لكل إحداثية. الإحداثيات ذات التدرجات الكبيرة يكبر s فيصغر معدلها، والكسدة تبقى معدلاتها لطيفة. هذا شراب مسبق شرط (preconditioning) رخيص يحاكي قطر Hessian دون حسابه، لكن s تنمو خطيًا فالتعلم الفعلي η/√s يتنازل كـ O(t^(−1/2)) — عنيف أكثر من اللازم للشبكات العميقة.',
          en: 'Adagrad\u2019s problem comes from sparse features: a shrinking rate like η₀/√t suits frequently-seen coordinates but starves rare ones before they collect enough data. A per-feature visit counter is crude — the smarter fix accumulates the squared gradients themselves: s ← s + g², then update x ← x − η/√(s+ε)·g per coordinate. Coordinates with large gradients grow s and get smaller rates; stagnant ones keep gentle rates. It is cheap diagonal preconditioning that imitates the Hessian\u2019s diagonal without computing it — but s grows linearly, so the effective rate η/√s decays like O(t^(−1/2)), too aggressive for deep networks.',
        },
        {
          ar: 'rmsprop يبقي التكيّف لكل إحداثية ويعالج النمو: بدل الجمع الأبدي، متوسط متسرب s ← γ·s + (1−γ)·g². أوزان الماضي مجموعها 1 ونصف عمر الملاحظة 1/(1−γ): مع γ=0.9 يتذكر 10 خطوات تقريبًا. الآن s يستقر حول مستوى التذبذب الحالي فلا ينهار معدل التعلم مع الزمن — وميزة إضافية أن η صارت حرة: نضبطها بحرية دون أن نكسر المعايرة لكل إحداثية. في مثالنا المُشغَّل سترى معدل adagrad الفعال يهبط إلى 0.13 بينما معدل rmsprop الفعال يبقى قرب 1.96 بعد 20 خطوة على الوادي نفسه.',
          en: 'RMSProp keeps per-coordinate adaptivity but cures the growth: instead of an ever-growing sum, a leaky average s ← γ·s + (1−γ)·g². The past weights sum to 1 and an observation\u2019s half-life is 1/(1−γ): with γ=0.9 it remembers roughly 10 steps. Now s settles around the current noise level so the rate never collapses with time — and as a bonus η becomes free: we tune it freely without breaking the per-coordinate calibration. In our runnable example you will see adagrad\u2019s effective rate fall to 0.13 while rmsprop\u2019s stays near 1.96 after 20 steps on the same valley.',
        },
        {
          ar: 'adadelta يذهب أبعد: يستخدم حالتين لكل معامل — s لمتوسط متسرب لمربعات التدرج بمعامل ρ، وΔx لمتوسط متسرب لمربعات التحديثات نفسها. التدرج المُعاد معايرته هو g′ = √(Δx+ε)/√(s+ε) ⊙ g، والتحديث x ← x − g′ بلا η إطلاقًا: وحدات البسط من عالم التحديثات ومقامها من عالم التدرجات، فالخطوة تحمل مقياسها بنفسها. اخترنا ρ=0.9 أي نصف عمر 10 خطوات، وε صغيرًا مثل 10⁻⁵ للثبات العددي فقط. السلسلة إذن: تراكم أبدي (adagrad) → تراكم متسرب (rmsprop) → معايرة بالتحديثات نفسها بلا معدل تعلم (adadelta).',
          en: 'Adadelta goes further: two states per parameter — s, a leaky average of squared gradients with coefficient ρ, and Δx, a leaky average of squared updates themselves. The rescaled gradient is g′ = √(Δx+ε)/√(s+ε) ⊙ g, and the update x ← x − g′ carries no η at all: the numerator\u2019s units come from the update world and the denominator\u2019s from the gradient world, so the step carries its own scale. We pick ρ=0.9, a half-life of about 10 steps, and a tiny ε like 10⁻⁵ purely for numerical stability. The ladder, then: an eternal sum (adagrad) → a leaky sum (rmsprop) → calibration by the updates themselves with no learning rate (adadelta).',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'المقاييس الثلاثة على الوادي نفسه',
        en: 'The three scalers on the same valley',
      },
      code: "import math\n\nEPS = 1e-6\n\ndef adagrad_2d(eta, steps=20):\n    x1, x2, s1, s2 = -5.0, -2.0, 0.0, 0.0\n    for _ in range(steps):\n        g1, g2 = 0.2 * x1, 4 * x2\n        s1 += g1 * g1\n        s2 += g2 * g2\n        x1 -= eta / math.sqrt(s1 + EPS) * g1\n        x2 -= eta / math.sqrt(s2 + EPS) * g2\n    return x1, x2, s1, s2\n\ndef rmsprop_2d(eta, gamma, steps=20):\n    x1, x2, s1, s2 = -5.0, -2.0, 0.0, 0.0\n    for _ in range(steps):\n        g1, g2 = 0.2 * x1, 4 * x2\n        s1 = gamma * s1 + (1 - gamma) * g1 * g1\n        s2 = gamma * s2 + (1 - gamma) * g2 * g2\n        x1 -= eta / math.sqrt(s1 + EPS) * g1\n        x2 -= eta / math.sqrt(s2 + EPS) * g2\n    return x1, x2, s1, s2\n\ndef adadelta_2d(rho=0.9, steps=20, eps=1e-5):\n    x1, x2, s1, s2, d1, d2 = -5.0, -2.0, 0.0, 0.0, 0.0, 0.0\n    for _ in range(steps):\n        g1, g2 = 0.2 * x1, 4 * x2\n        s1 = rho * s1 + (1 - rho) * g1 * g1\n        s2 = rho * s2 + (1 - rho) * g2 * g2\n        u1 = math.sqrt(d1 + eps) / math.sqrt(s1 + eps) * g1\n        u2 = math.sqrt(d2 + eps) / math.sqrt(s2 + eps) * g2\n        x1 -= u1\n        x2 -= u2\n        d1 = rho * d1 + (1 - rho) * u1 * u1\n        d2 = rho * d2 + (1 - rho) * u2 * u2\n    return x1, x2\n\na1, b1, s1, s2 = adagrad_2d(0.4)\nprint('adagrad  eta=0.4 -> x1=%.6f x2=%.6f | s1=%.6f eff_lr=%.6f' % (a1, b1, s1, 0.4 / math.sqrt(s1 + EPS)))\na2, b2, _, _ = adagrad_2d(2.0)\nprint('adagrad  eta=2.0 -> x1=%.6f x2=%.6f' % (a2, b2))\na3, b3, s3, _ = rmsprop_2d(0.4, 0.9)\nprint('rmsprop  eta=0.4 g=0.9 -> x1=%.6f x2=%.6f | s1=%.6f eff_lr=%.6f' % (a3, b3, s3, 0.4 / math.sqrt(s3 + EPS)))\na4, b4 = adadelta_2d()\nprint('adadelta rho=0.9  -> x1=%.6f x2=%.6f (no learning rate at all)' % (a4, b4))",
      explanation: {
        ar: 'على الوادي نفسه من (−5, −2) و20 خطوة: adagrad بمعدل 0.4 يزحف إلى (−2.382563, −0.158591) لأن تراكم s₁=9.480948 أسقط المعدل الفعال إلى 0.129907؛ ورفع η إلى 2.0 يعيد الحيوية فيصل إلى (−0.002295, −0.000000). rmsprop بالمعدل 0.4 نفسه يصل إلى (−0.010599, 0.000000) لأن s₁ المتسرب استقر عند 0.041800 فبقي المعدل الفعال 1.956444 — التكيّف بلا موت. أما adadelta فبلا أي معدل تعلم تحرك إلى (−4.782488, −1.787589): خطواته قصيرة لكنها ذاتية المعايرة.',
        en: 'On the same valley from (−5, −2) over 20 steps: adagrad at rate 0.4 crawls to (−2.382563, −0.158591) because the accumulation s₁=9.480948 has cut the effective rate to 0.129907; raising η to 2.0 restores life and reaches (−0.002295, −0.000000). rmsprop at the very same 0.4 reaches (−0.010599, 0.000000) because its leaked s₁ settled at 0.041800, keeping the effective rate at 1.956444 — adaptivity without decay. And adadelta, with no learning rate whatsoever, still moves to (−4.782488, −1.787589): short steps, but self-calibrating ones.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.adagrad-1d',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ adagrad_1d(eta, steps) على f(x) = x² مشتقّتها 2x، من x=10.0 بحالة s=0.0 وε=1e-6: في كل خطوة g=2·x ثم s += g*g ثم x -= eta/math.sqrt(s + 1e-6) * g. أعِد الزوج (x, s) النهائي بعد 20 خطوة بمعدل eta=0.5، مع مشاهدة كيف يتقشر المعدل الفعال eta/√s خطوة بعد خطوة.',
        en: 'Implement adagrad_1d(eta, steps) on f(x) = x² with derivative 2x, from x=10.0 with state s=0.0 and ε=1e-6: each step g=2·x, then s += g*g, then x -= eta/math.sqrt(s + 1e-6) * g. Return the final pair (x, s) after 20 steps at eta=0.5, and observe how the effective rate eta/√s peels off step by step.',
      },
      starterCode: "import math\n\ndef adagrad_1d(eta, steps):\n    x, s = 10.0, 0.0\n    # TODO: 20 times: g = 2*x; s += g*g; x -= eta / math.sqrt(s + 1e-6) * g\n    return x, s\n",
      solution: "import math\n\ndef adagrad_1d(eta, steps):\n    x, s = 10.0, 0.0\n    for _ in range(steps):\n        g = 2 * x\n        s += g * g\n        x -= eta / math.sqrt(s + 1e-6) * g\n    return x, s",
      tests: [
        {
          id: 't1',
          name: { ar: 'النقطة النهائية مطابقة حرفيًا', en: 'Final point matches the verified literal' },
          code: "import math\nx, s = adagrad_1d(0.5, 20)\nassert abs(x - 6.512417166235185) < 1e-9, 'expected x=6.512417166235185 | got %r' % x",
          expected: 'x = 6.512417166235185',
        },
        {
          id: 't2',
          name: { ar: 'الحالة s تراكمت كما يجب', en: 'The state s accumulated correctly' },
          code: "import math\nx, s = adagrad_1d(0.5, 20)\nassert abs(s - 5030.83) < 0.01, 'expected s ~ 5030.83 | got %r' % s\nassert s > 0, 's must accumulate squared gradients'",
          expected: 's = 5030.83 (2 d.p.)',
        },
        {
          id: 't3',
          name: { ar: 'المعدل الفعال انهار تحت 0.008', en: 'The effective rate collapsed below 0.008' },
          code: "import math\nx, s = adagrad_1d(0.5, 20)\neff = 0.5 / math.sqrt(s + 1e-6)\nassert abs(eff - 0.007049) < 1e-6 and eff < 0.008, 'effective rate must collapse to ~0.007049 | got %r' % eff",
          expected: 'eff_lr = 0.007049',
        },
      ],
      hints: [
        { ar: 'الترتيب حاسم: احسب g من x الحالي، أضف مربعه إلى s، ثم حدّث x بالمعدل الفعال eta/√(s+ε).', en: 'Order is decisive: compute g from the current x, add its square to s, then update x using the effective rate eta/√(s+ε).' },
        { ar: 'استخدم math.sqrt وليس **0.5 على القيمة السالبة المحتملة — هنا s+1e-6 موجب دائمًا فلا خطر، لكن أبقِ ε داخل الجذر.', en: 'Use math.sqrt rather than **0.5 — here s+1e-6 is always positive so there is no risk, but keep ε inside the root.' },
        { ar: 'قيم تحقق: بعد 20 خطوة بـ eta=0.5: x=6.512417166235185 وs≈5030.83 والمعدل الفعال 0.007049 — لاحظ كيف بدأ 0.025 في الخطوة الأولى.', en: 'Sanity values: after 20 steps at eta=0.5: x=6.512417166235185, s≈5030.83, effective rate 0.007049 — note it started at 0.025 in step one.' },
        { ar: 'لا تُصفّر s بين الخطوات أبدًا: التراكم هو الذي يخنق المعدل تدريجيًا — هذه هي رسالة adagrad نفسها.', en: 'Never reset s between steps: the accumulation is what gradually throttles the rate — that is the very message of adagrad.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-adadelta-states',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'كم متغير حالة يحتاج adadelta لكل معامل من معاملات النموذج (اكتب رقمًا)؟',
        en: 'How many state variables does adadelta maintain per model parameter (enter a number)?',
      },
      answer: '2',
      solution: '2',
      tolerance: 0,
      hints: [
        { ar: 'قارن بالسلسلة: SGD لا يحتاج شيئًا، momentum يحتفظ بسرعة واحدة، adagrad بمجمّع s واحد.', en: 'Compare across the ladder: SGD keeps nothing, momentum keeps one velocity, adagrad one accumulator s.' },
        { ar: 'adadelta يوسّط اثنين معًا: مربعات التدرجات ومربعات التحديثات المُعاد معايرتها.', en: 'Adadelta averages two things at once: squared gradients and squared rescaled updates.' },
        { ar: 'في تعريف adadelta_2d في المثال المُشغَّل عدّ متغيرات الحالة لكل إحداثية عدا الموضع نفسه.', en: 'In the worked example\u2019s adadelta_2d, count the state variables per coordinate besides the position itself.' },
        { ar: 'الجواب: 2 — s وΔx (المجمّعان المتسربان).', en: 'Answer: 2 — s and Δx (the two leaky accumulators).' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\nEPS = 1e-6\n\ndef rmsprop_trace(gamma, eta=0.4, steps=20):\n    x1, x2, s1, s2 = -5.0, -2.0, 0.0, 0.0\n    for _ in range(steps):\n        g1, g2 = 0.2 * x1, 4 * x2\n        s1 = gamma * s1 + (1 - gamma) * g1 * g1\n        s2 = gamma * s2 + (1 - gamma) * g2 * g2\n        x1 -= eta / math.sqrt(s1 + EPS) * g1\n        x2 -= eta / math.sqrt(s2 + EPS) * g2\n    return x1, x2, 0.4 / math.sqrt(s1 + EPS)\n\nfor gamma in (0.0, 0.5, 0.9, 0.99):\n    x1, x2, eff = rmsprop_trace(gamma)\n    print('gamma=%.2f -> x1=%.6f x2=%.6f eff_lr=%.6f' % (gamma, x1, x2, eff))\n\n# جرّب: عيّن gamma=1.0 وأضف حماية من القسمة على صفر — ماذا يحدث للحالة وللمسار؟\n# try: set gamma=1.0 and guard against division by zero — what happens to the state and the path?\n# جرّب: طبق adagrad وrmsprop على الدالة المدورة 0.1*(x1+x2)**2 + 2*(x1-x2)**2 وقارن التقارب.\n# try: run adagrad and rmsprop on the rotated function 0.1*(x1+x2)**2 + 2*(x1-x2)**2 and compare convergence.\n",
      prompt: {
        ar: 'الملعب يمسح γ في rmsprop من 0 (نسيان فوري: يصبح مسلك adagrad مقسومًا) إلى 0.99 (ذاكرة طويلة بطيئة الإقلاع)، ويطبع المعدل الفعال النهائي لكل اختيار. جرّب كذلك الدالة المدورة 45 درجة التي يذكرها الكتاب في تمارينه.',
        en: 'The sandbox sweeps γ in rmsprop from 0 (instant forgetting: an adagrad-like path) to 0.99 (a long memory, slow to start), printing the final effective rate for each choice. Also try the 45-degree rotated function the book mentions in its exercises.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يكون adagrad جذابًا للميزات النادرة تحديدًا؟',
            en: 'Why is adagrad particularly attractive for sparse features?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يرفع معدل التعلم مع الزمن لكل الإحداثيات', en: 'Because it raises the learning rate over time for all coordinates' } },
            { id: 'b', text: { ar: 'لأن معدل الإحداثية يتبنى تدرجاتها هي: النادرة تبقى معدلها كبيرًا لأن s صغير', en: 'Because each coordinate\u2019s rate follows its own gradients: rare ones keep a large rate since s stays small' } },
            { id: 'c', text: { ar: 'لأنه يحذف الإحداثيات التي لا تظهر كثيرًا', en: 'Because it drops coordinates that rarely appear' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المعدل η/√(s+ε) خاص بكل إحداثية: إحداثية نادرة تجمع مربعات قليلة فيبقى مقامها صغيرًا ومعدلها نشطًا، بينما تُخنق الإحداثيات الصاخبة تدريجيًا. لا حاجة لقرار يدوي عن «متى يُعد التدرج ظهورًا».',
            en: 'The rate η/√(s+ε) is per-coordinate: a rare coordinate collects few squared gradients, so its denominator stays small and its rate stays lively, while noisy coordinates are progressively throttled. No manual rule about what counts as an occurrence is needed.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرق الجوهري بين تحديث الحالة في adagrad وفي rmsprop؟',
            en: 'What is the essential difference between the state update in adagrad and in rmsprop?',
          },
          options: [
            { id: 'a', text: { ar: 'adagrad يجمع بلا نسيان فينمو s خطيًا، وrmsprop يستخدم متوسطًا متسربًا يستقر', en: 'Adagrad sums with no forgetting so s grows linearly; rmsprop uses a leaky average that settles' } },
            { id: 'b', text: { ar: 'adagrad يستخدم مربعات التدرج وrmsprop يستخدم التدرج الخام', en: 'Adagrad uses squared gradients while rmsprop uses raw gradients' } },
            { id: 'c', text: { ar: 'لا فرق — الاثنان صيغتان لنفس الخوارزمية', en: 'No difference — the two are two spellings of the same algorithm' } },
          ],
          answer: 'a',
          explanation: {
            ar: 's ← s + g² يذكّر كل التاريخ فينمو بلا حدود والمعدل الفعال يتنازل كـ t^(−1/2)؛ بينما s ← γs + (1−γ)g² ينسى بنصف عمر 1/(1−γ) فيستقر حول مستوى الضجيج الحالي ويبقي η حرة الضبط.',
            en: 's ← s + g² remembers the whole history, grows without bound, and the effective rate decays like t^(−1/2); s ← γs + (1−γ)g² forgets with half-life 1/(1−γ), settles around the current noise level, and leaves η free to tune.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'كيف يزعم adadelta أنه «بلا معدل تعلم»؟',
            en: 'How does adadelta claim to be learning-rate free?',
          },
          options: [
            { id: 'a', text: { ar: 'بضرب التدرج في √(Δx+ε)/√(s+ε): بسط من عالم التحديثات ومقام من عالم التدرجات', en: 'It multiplies the gradient by √(Δx+ε)/√(s+ε): a numerator from update units over a denominator from gradient units' } },
            { id: 'b', text: { ar: 'بحذف ε نهائيًا من الصيغة', en: 'By removing ε from the formula entirely' } },
            { id: 'c', text: { ar: 'باستخدام معدل تعلم سالب يصحح نفسه', en: 'By using a negative learning rate that self-corrects' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المقام √(s+ε) يقيس حجم التدرج، والبسط √(Δx+ε) يتذكر حجم التحديثات السابقة، فناتج الضرب يأخذ مقياس تحديث معقول مهما تغير مقياس التدرج — لذلك لا حاجة لـ η اليدوية. يبقى ρ للتحكم في الذاكرة.',
            en: 'The denominator √(s+ε) measures gradient scale and the numerator √(Δx+ε) remembers the scale of past updates, so their product carries a sensible update scale no matter how the gradient scale shifts — no manual η needed. ρ remains to control memory.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'adagrad يراكم مربعات التدرج s ← s+g² ويقسم عليها: معدل خاص بكل إحداثية يحمي الميزات النادرة لكنه يتنازل كـ O(t^(−1/2)) بعنف (الهدف من s7 adagrad).', en: 'Adagrad accumulates squared gradients s ← s+g² and divides by them: a per-coordinate rate that shields sparse features but decays like O(t^(−1/2)), sometimes too harshly (goal of s7 Adagrad).' },
        { ar: 'rmsprop يحوّل التراكم إلى متوسط متسرب s ← γs+(1−γ)g² بنصف عمر 1/(1−γ): يفصل التكيّف لكل إحداثية عن جدولة η الحرة (الهدف من s8 RMSProp).', en: 'RMSProp turns the accumulation into a leaky average s ← γs+(1−γ)g² with half-life 1/(1−γ): it decouples per-coordinate adaptivity from a freely tunable η (goal of s8 RMSProp).' },
        { ar: 'adadelta يضيف متوسطًا متسربًا ثانيًا لمربعات التحديثات ويقسّم به: g′ = √(Δx+ε)/√(s+ε)·g بلا معدل تعلم إطلاقًا (الهدف من s9 adadelta).', en: 'Adadelta adds a second leaky average over squared updates and divides by it: g′ = √(Δx+ε)/√(s+ε)·g, with no learning rate at all (goal of s9 Adadelta).' },
      ],
      reflectPrompt: {
        ar: 'لو ظهر في تدرجاتك إحداثية قيمتها النموذجية 100 وأخرى قيمتها 0.01، فأي خوارزمية من هذا الدرس تختار ولماذا لا يكفي رفع η العام وحده؟',
        en: 'If your gradients contain one coordinate typically around 100 and another around 0.01, which algorithm from this lesson do you pick — and why is raising the global η alone not enough?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch12.s7' },
        { book: 'D2L', section: 'd2l.ch12.s8' },
        { book: 'D2L', section: 'd2l.ch12.s9' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch12.s7' },
    { book: 'D2L', section: 'd2l.ch12.s8' },
    { book: 'D2L', section: 'd2l.ch12.s9' },
  ],
} satisfies Lesson;

export default lesson;
