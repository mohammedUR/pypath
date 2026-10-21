import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch9.l3 — "RNN From Scratch, the Concise Way, and Backprop Through Time"
 * RNN من الصفر، وباختصار، والانتشار الخلفي عبر الزمن
 * Aligned with D2L ch9 s5 (Recurrent Neural Network Implementation from
 * Scratch) + s6 (Concise Implementation) + s7 (Backpropagation Through
 * Time). All expression is original — a paraphrase of the source's ideas,
 * never a verbatim translation. Runnable design: a literal-weight RNN
 * forward pass with the concatenation identity and gradient clipping,
 * plus a vanishing/exploding powers sandbox; every literal verified under
 * CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch9.l3',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 9,
  title: {
    ar: 'RNN من الصفر، وباختصار، والانتشار الخلفي عبر الزمن',
    en: 'RNN From Scratch, the Concise Way, and Backprop Through Time',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch9.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'المعادلتان التي كتبناهما في الدرس الماضي ليستا نظريتين — يمكن تشغيلهما اليوم بأوزان حرفية ورؤية الحالة تتحرك. لكن تدريبها يكشف مشكلة جديدة: التدرج يمر عبر سلسلة من ضربات المصفوفات بطول المتتالية كلها، فينبح أو ينفجر. سنشغّل RNN يدويًا، نتحقق من متطابقة الدمج، نطبق قصّ التدرجات، ثم نفهم رياضيًا لماذا n^k هو شرّ كل نماذج المتتاليات.',
        en: 'The two equations from the last lesson are not just theory \u2014 you can run them today with literal weights and watch the state move. But training reveals a new problem: the gradient travels through a chain of matrix products as long as the whole sequence, so it vanishes or explodes. We will run an RNN by hand, verify the concatenation identity, apply gradient clipping, then understand mathematically why W^k is the villain of every sequence model.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من الحلقة اليدوية إلى الانتشار الخلفي عبر الزمن', en: 'From a hand-rolled loop to backprop through time' },
      chunks: [
        {
          ar: 'من الصفر تحتاج ثلاث قطع: ترميز one-hot (متجه بطول المفردات فيه 1 واحدة — مكافئ لأخذ صف من مصفوفة تضمينات)، ثم الحلقة h = tanh(x·W_xh + h·W_hh + b_h) خطوة بخطوة، ثم طبقة إخراج logits = h·W_hq + b_q وحساب الخسارة لكل خطوة. وهناك متطابقة مفيدة: x·W_xh + h·W_hh يساوي [x|h]·[W_xh; W_hh] — أي أن الخطوة المتكررة هي مجرد طبقة كثيفة تقرأ المدخلات والحالة مدمجين. القصّ الشهير: التدرجات تنفجر لأن سلسلة الضربات تمر عبر W_hh مرات عدة، والعلاج الرخيص g ← min(1, θ/‖g‖)·g يقيسها على كرة نصف قطرها θ مع الحفاظ على الاتجاه. أما الجانب العملي فنستعمل nn.RNN الجاهزة: نفس الرياضيات لكن بمشغلات مترجمة أسرع بكثير — والتنبؤ بنص يبدأ بفترة تسخين تلتهم البادئة المزروعة ثم يطلق الرموز المتنبأ بها واحدة تلو الأخرى.',
          en: 'From scratch you need three pieces: one-hot encoding (a vocabulary-length vector with a single 1 \u2014 equivalent to picking a row of an embedding matrix), the loop h = tanh(x\u00b7W_xh + h\u00b7W_hh + b_h) step by step, then an output layer logits = h\u00b7W_hq + b_q with a loss at every step. A useful identity: x\u00b7W_xh + h\u00b7W_hh equals [x|h]\u00b7[W_xh; W_hh] \u2014 the recurrent step is just a dense layer reading inputs and state concatenated. The famous hack: gradients explode because the product chain passes through W_hh repeatedly, and the cheap remedy g \u2190 min(1, \u03b8/\u2016g\u2016)\u00b7g rescales the gradient onto a ball of radius \u03b8 while preserving direction. In practice you use the built-in nn.RNN: same math, compiled operators, far faster \u2014 and text prediction begins with a warm-up period that swallows the given prefix before emitting predicted tokens one by one.',
        },
        {
          ar: 'الانتشار الخلفي عبر الزمن BPTT هو انتشار خلفي عادي على الرسم الحسابي بعد فرد الحلقة عبر الخطوات، مع جمع مساهمة كل ظهور للمعاملات المشتركة. جوهر التحليل: الحالة H_t تعتمد على H_{t-1} مضروبة بـ W_hh، فيتضاعف الأثر: ∂L/∂h_t يجمع حدودًا فيها قوى (W_hh\u1d40)^(T−i) — قيم eigenvalue الأصغر من 1 تتلاشى (تدرجات تختفي فلا يتعلم النموذج التبعيات البعيدة) والأكبر من 1 تتباعد (تدريب ينفجر). استراتيجيات العمل: القص المقطوع truncated BPTT يوقف السلسلة بعد τ خطوة (تقريب عملي شائع)، أو القص المُعشوَن الذي يصحح في المتوسط. لذلك clip يعالج الانفجار فقط، بينما معماريات الباب (الفصل القادم) تعالج التلاشي.',
          en: 'Backpropagation through time (BPTT) is ordinary backprop on the computational graph after unrolling the loop across steps, summing each shared parameter\u2019s contribution over every occurrence. The analytical heart: the state H_t depends on H_{t-1} multiplied by W_hh, so effects compound \u2014 \u2202L/\u2202h_t collects terms containing powers (W_hh\u1d40)^(T\u2212i); eigenvalues below 1 vanish (gradients disappear and long dependencies go unlearned) while those above 1 diverge (training explodes). Working strategies: truncated BPTT stops the chain after \u03c4 steps (the common practical approximation), or randomized truncation which is unbiased in expectation. Hence clipping treats only explosion, while the gated architectures of the next chapter treat vanishing.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'RNN بأوزان حرفية: حالة، logits، متطابقة الدمج، وقصّ تدرج',
        en: 'A literal-weight RNN: state, logits, the concatenation identity, and clipping',
      },
      code: "import math\n\n# literal weights: 3 one-hot inputs -> 2 hidden units -> 3 logits\nW_xh = [[0.6, -0.2], [0.1, 0.5], [-0.4, 0.3]]\nW_hh = [[0.5, 0.1], [-0.1, 0.4]]\nb_h = [0.0, 0.0]\nW_hq = [[1.0, 0.0, -1.0], [0.0, 1.0, 0.5]]\none_hot = {0: [1.0, 0.0, 0.0], 1: [0.0, 1.0, 0.0], 2: [0.0, 0.0, 1.0]}\n\nh = [0.0, 0.0]\nfor t, token in enumerate([0, 1], start=1):\n    x = one_hot[token]\n    xW = [sum(x[k] * W_xh[k][j] for k in range(3)) for j in range(2)]\n    hW = [sum(h[k] * W_hh[k][j] for k in range(2)) for j in range(2)]\n    pre = [xW[j] + hW[j] + b_h[j] for j in range(2)]\n    h = [math.tanh(v) for v in pre]\n    print('h%d = %s' % (t, [round(v, 4) for v in h]))\n\nlogits = [sum(h[k] * W_hq[k][j] for k in range(2)) for j in range(3)]\nprint('logits at t=2:', [round(v, 4) for v in logits])\n\n# the two products are one product on concatenated matrices\nx2 = one_hot[1]\nxW2 = [sum(x2[k] * W_xh[k][j] for k in range(3)) for j in range(2)]\nhW2 = [sum(h[k] * W_hh[k][j] for k in range(2)) for j in range(2)]\nconcat_W = [row[:] for row in W_xh] + [row[:] for row in W_hh]\nconcat_out = [sum((x2 + h)[k] * concat_W[k][j] for k in range(5)) for j in range(2)]\ndirect = [xW2[j] + hW2[j] for j in range(2)]\ndiff = max(abs(concat_out[j] - direct[j]) for j in range(2))\nprint('concat equivalence (max diff %.1e):' % diff, diff < 1e-12)\n\n# gradient clipping: g <- min(1, theta/||g||) * g\ng = [3.0, 4.0]\nnorm = math.sqrt(sum(v * v for v in g))\ntheta = 1.0\nscale = min(1.0, theta / norm)\nprint('norm =', norm, '| clipped g =', [round(v * scale, 4) for v in g])",
      explanation: {
        ar: 'خطوتان فقط تكفيان لرؤية كل شيء: من الرمز 0 كانت الحالة h1 = tanh([0.6, −0.2]) = [0.537, −0.1974]، ثم من الرمز 1 أُضيف أثر h1 عبر W_hh فصارت h2 = [0.3699, 0.442]، وطبقة الإخراج أعطت logits = [0.3699, 0.442, −0.1488] — أربعة أرقام، أحدها (الرمز 2) سالب لأن العمود الثالث من W_hq ثقيل بالسالب. متطابقة الدمج تحققت بفرق أقصى 1.1e-16 فقط (خطأ الفاصلة العائمة): [x|h]·[W_xh; W_hh] ≡ x·W_xh + h·W_hh. وأخيرًا القصّ: ‖g‖ = 5.0 أكبر من θ=1 فصار العامل 0.2 والتدرج [0.6, 0.8] — نفس الاتجاه، طول مقيد.',
        en: 'Two steps suffice to see everything: from token 0 the state is h1 = tanh([0.6, \u22120.2]) = [0.537, \u22120.1974]; from token 1 the influence of h1 arrives through W_hh, giving h2 = [0.3699, 0.442]; the output layer yields logits = [0.3699, 0.442, \u22120.1488] \u2014 the third entry is negative because W_hq\u2019s third column is dominated by \u22121. The concatenation identity holds to a max difference of 1.1e-16 (floating-point noise): [x|h]\u00b7[W_xh; W_hh] \u2261 x\u00b7W_xh + h\u00b7W_hh. Finally clipping: \u2016g\u2016 = 5.0 exceeds \u03b8=1, so the factor is 0.2 and the gradient becomes [0.6, 0.8] \u2014 same direction, bounded length.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.clip-grad',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ clip_grad(grad, theta) التي تطبق قاعدة القصّ: احسب ‖g‖ كجذر مجموع المربعات، ثم عامل القياس min(1, θ/‖g‖)، وأعد التدرج مقيسًا — بلا تغيير إن كان نصفه القطري داخل الكرة أصلًا.',
        en: 'Implement clip_grad(grad, theta) applying the clipping rule: compute \u2016g\u2016 as the square root of the sum of squares, the scale factor min(1, \u03b8/\u2016g\u2016), and return the scaled gradient \u2014 unchanged if its norm is already inside the ball.',
      },
      starterCode: "import math\n\ndef clip_grad(grad, theta):\n    ...  # TODO: norm, scale = min(1, theta / norm), return scaled copy\n    return scaled\n\nprint(clip_grad([3.0, 4.0], 1.0))\nprint(clip_grad([3.0, 4.0], 10.0))\nprint(clip_grad([1.0], 0.25))\n",
      solution: "import math\n\ndef clip_grad(grad, theta):\n    norm = math.sqrt(sum(v * v for v in grad))\n    scale = min(1.0, theta / norm) if norm > 0 else 1.0\n    return [v * scale for v in grad]",
      tests: [
        {
          id: 't1',
          name: { ar: 'متجاوز الحد يقصر إلى الكرة', en: 'An over-limit gradient shrinks onto the ball' },
          code: "clipped = clip_grad([3.0, 4.0], 1.0)\nassert abs(clipped[0] - 0.6) < 1e-9 and abs(clipped[1] - 0.8) < 1e-9, 'expected [0.6, 0.8] | actual: %r' % clipped",
          expected: '[0.6, 0.8]',
        },
        {
          id: 't2',
          name: { ar: 'ضمن الحد يمر بلا تغيير', en: 'Within the limit it passes unchanged' },
          code: "assert clip_grad([3.0, 4.0], 10.0) == [3.0, 4.0], 'expected no change | actual: %r' % clip_grad([3.0, 4.0], 10.0)",
          expected: '[3.0, 4.0]',
        },
        {
          id: 't3',
          name: { ar: 'شعاع أحادي يقصر بالنسبة الصحيحة', en: 'A unit-length vector scales by the right ratio' },
          code: "clipped = clip_grad([1.0], 0.25)\nassert abs(clipped[0] - 0.25) < 1e-12, 'expected [0.25] | actual: %r' % clipped",
          expected: '[0.25]',
        },
      ],
      hints: [
        { ar: 'النصف القطري: norm = math.sqrt(sum(v * v for v in grad)) — لما [3, 4] يعطي 5.0.', en: 'The norm: norm = math.sqrt(sum(v * v for v in grad)) \u2014 for [3, 4] it is 5.0.' },
        { ar: 'العامل min(1, theta / norm) يضمن ألا يتضخم التدرج الصغير أبدًا — القصّ يقصّ فقط.', en: 'The factor min(1, theta / norm) guarantees a small gradient is never inflated \u2014 clipping only clips.' },
        { ar: 'انتبه لحالة norm = 0 (تدرج صفري): أعد العامل 1 لتفادي القسمة على صفر.', en: 'Watch the norm = 0 case (a zero gradient): use factor 1 to avoid dividing by zero.' },
        { ar: 'قيم تحقق: [3,4] مع θ=1 تعطي [0.6, 0.8]؛ مع θ=10 تبقى كما هي؛ و[1] مع θ=0.25 تعطي [0.25].', en: 'Sanity values: [3,4] with \u03b8=1 gives [0.6, 0.8]; with \u03b8=10 it stays; and [1] with \u03b8=0.25 gives [0.25].' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-scalar-rnn',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وأكتب مخرجه بالضبط (سطر واحد): هذه نسخة عددية من معادلة الحالة h_t = tanh(w_x·x_t + w_h·h_{t-1}) بحالة ابتدائية h=0. ما القائمة المطبوعة؟',
        en: 'Read the code and write its exact output (one line): this is the scalar version of the state equation h_t = tanh(w_x\u00b7x_t + w_h\u00b7h_{t-1}) starting from h=0. What list is printed?',
      },
      code: "import math\n\nh = 0.0\nstates = []\nfor x in [1.0, 0.0, -1.0]:\n    h = math.tanh(1.0 * x + 0.5 * h)\n    states.append(round(h, 4))\nprint(states)",
      answer: '[0.7616, 0.3634, -0.6741]',
      solution: '[0.7616, 0.3634, -0.6741]',
      hints: [
        { ar: 'الخطوة الأولى لا ذاكرة لها: tanh(1.0) = 0.7616.', en: 'The first step has no memory: tanh(1.0) = 0.7616.' },
        { ar: 'الثانية: tanh(1.0·0 + 0.5·0.7616) = tanh(0.3808) = 0.3634.', en: 'Second: tanh(1.0\u00b70 + 0.5\u00b70.7616) = tanh(0.3808) = 0.3634.' },
        { ar: 'الثالثة تجمع مدخلًا سالبًا مع أثر إيجابي: tanh(\u22121.0 + 0.5·0.3634) = tanh(\u22120.8183) = \u22120.6741.', en: 'The third mixes a negative input with a positive trace: tanh(\u22121.0 + 0.5\u00b70.3634) = tanh(\u22120.8183) = \u22120.6741.' },
        { ar: 'المخرج سطر واحد: [0.7616, 0.3634, -0.6741] — لاحظ كيف لا تزال الخطوة الثالثة تتذكر الخطوة الأولى عبر السلسلة.', en: 'One printed line: [0.7616, 0.3634, -0.6741] \u2014 notice step three still remembers step one through the chain.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\n# BPTT intuition: the recurrent weight acts like a base raised to a power.\n# A scalar proxy for the eigenvalues of W_hh:\nfor c in (0.9, 1.1):\n    row = [round(c ** k, 4) for k in range(1, 7)]\n    print('c=%.1f powers:' % c, row)\n\n# جرّب: عند أي خطوة يصير 0.9^k أقل من 0.6 (تلاشي)، ومتى يتجاوز 1.1^k الضعف (انفجار)؟\n# try: at which step does 0.9^k drop below 0.6 (vanishing), and when does 1.1^k\n#      exceed double (exploding)?\n# جرّب: غيّر القاعدتين إلى 0.5 و 2.0 وأعد التشغيل — صف التلاشي والانفجار يتسارع كثيرًا.\n# try: change the bases to 0.5 and 2.0 and rerun - vanishing and exploding accelerate.\n",
      prompt: {
        ar: 'الملعب يحسب قوى أسين 0.9 و 1.1 كنموذج مبسط لقوى (W_hh)^k في BPTT: سلسلة 0.9 تهبط بسرعة نحو الصفر (تدرجات تختفي فيبعُد تعلم التبعيات البعيدة)، وسلسلة 1.1 تنمو بلا توقف (تدريب يفلت). بين 0.9 و 1.1 هامش ضيق جدا — ولهذا عمق الزمن مشكلة عددية بامتياز.',
        en: 'The sandbox raises the bases 0.9 and 1.1 to powers as a scalar stand-in for (W_hh)^k in BPTT: the 0.9 chain dives toward zero (gradients vanish, so distant dependencies go unlearned), and the 1.1 chain grows without bound (training runs away). The safe margin between 0.9 and 1.1 is razor thin \u2014 which is why depth-in-time is fundamentally a numerical stability problem.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يعادل x·W_xh + h·W_hh ضرب [x|h] في [W_xh; W_hh]؟',
            en: 'Why does x\u00b7W_xh + h\u00b7W_hh equal [x|h] multiplied by [W_xh; W_hh]?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن توزيع الجداء على المجموع يجمع الحدين في جداء واحد على المصفوفتين مدمجتين', en: 'Distributing the product over the sum merges the two terms into one product with the stacked matrices' } },
            { id: 'b', text: { ar: 'لأن tanh خطية', en: 'Because tanh is linear' } },
            { id: 'c', text: { ar: 'تساوي تقريبية صحيحة فقط عندما تكون الأوزان صغيرة', en: 'An approximation that only holds for small weights' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذه خاصية توزيع الضرب على الجمع في الجبر الخطي: (x·W_xh + h·W_hh)_j = Σ_k [x|h]_k · [W_xh; W_hh]_{k,j}. تحققنا منها عدديًا بفرق 1.1e-16 في المثال المشغَّل — وهي أساس تنفيذ الطبقات المتكررة المدمجة.',
            en: 'It is the distributive law of matrix algebra: (x\u00b7W_xh + h\u00b7W_hh)_j = \u03a3_k [x|h]_k \u00b7 [W_xh; W_hh]_{k,j}. We verified it numerically to 1.1e-16 in the worked example \u2014 and it underlies how recurrent layers are implemented compactly.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'قصّ التدرجات g ← min(1, θ/‖g‖)·g يعالج مشكلة واحدة بالضبط. أيهما؟',
            en: 'Gradient clipping g \u2190 min(1, \u03b8/\u2016g\u2016)\u00b7g treats exactly one problem. Which?',
          },
          options: [
            { id: 'a', text: { ar: 'تلاشي التدرجات', en: 'Vanishing gradients' } },
            { id: 'b', text: { ar: 'انفجار التدرجات — يقيد الطول دون تحريف الاتجاه', en: 'Exploding gradients \u2014 it bounds the length without distorting direction' } },
            { id: 'c', text: { ar: 'كلاهما معًا', en: 'Both at once' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'القصّ يقيس التدرج على كرة نصف قطرها θ فلا ينفجر التحديث، لكنه لا يضخم التدرجات الصغيرة أبدًا (العامل ≤ 1) — فالتلاشي يحتاج حلا معماريًا كالأبواب في الفصل التالي.',
            en: 'Clipping rescales the gradient onto a ball of radius \u03b8 so the update cannot explode, but it never amplifies small gradients (the factor is \u22641) \u2014 vanishing needs an architectural fix like the gates of the next chapter.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في التحليل المبسط لـ BPTT، ∂L/∂h_t يجمع حدودًا تحتوي قوى (W_hh\u1d40)^(T\u2212i). ماذا يحدث عندما تكون قيم eigenvalue لـ W_hh أصغر من 1؟',
            en: 'In the simplified BPTT analysis, \u2202L/\u2202h_t collects terms with powers (W_hh\u1d40)^(T\u2212i). What happens when the eigenvalues of W_hh are below 1?',
          },
          options: [
            { id: 'a', text: { ar: 'القوى تكبر فتنفجر التدرجات', en: 'The powers grow and gradients explode' } },
            { id: 'b', text: { ar: 'القوى تتلاشى مع البعد عن الخطوة الحالية فتختفي إشارات الماضي البعيد', en: 'The powers vanish with distance from the current step, so long-past signals disappear' } },
            { id: 'c', text: { ar: 'لا تأثير — القوى تبقى 1', en: 'No effect \u2014 the powers stay 1' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قوى مصفوفة قيمها الذاتية أصغر من 1 تتلاشى أسّيًا: إشارة من الخطوة i تصل إلى T مقسومة على (عامل)^(T\u2212i) صغير جدًا — لهذا تختفي التبعيات البعيدة، ولذلك يُقصّ الزمن أو تُستعمل أطر مبوّبة مثل LSTM وGRU.',
            en: 'Powers of a matrix with eigenvalues below 1 decay exponentially: a signal from step i reaching T is damped by a tiny (factor)^(T\u2212i) \u2014 hence distant dependencies vanish, hence truncated time, and hence gated architectures like LSTM and GRU.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'من الصفر: one-hot + حلقة h = tanh(x·W_xh + h·W_hh + b_h) + طبقة إخراج — والمتطابقة [x|h]·[W_xh; W_hh] تبرهن أن الخطوة المتكررة طبقة كثيفة عادية (الهدف من s5 التنفيذ من الصفر).', en: 'From scratch: one-hot + the loop h = tanh(x\u00b7W_xh + h\u00b7W_hh + b_h) + an output layer \u2014 and the identity [x|h]\u00b7[W_xh; W_hh] shows the recurrent step is an ordinary dense layer (goal of s5 RNN Implementation from Scratch).' },
        { ar: 'عمليًا: nn.RNN تعطي نفس النموذج بمشغلات مترجمة أسرع، والتنبؤ النصي يحتاج فترة تسخين للبادئة قبل توليد الرموز (الهدف من s6 التنفيذ الموجز).', en: 'In practice: nn.RNN gives the same model with compiled, faster operators, and text prediction needs a warm-up period for the prefix before emitting tokens (goal of s6 Concise Implementation).' },
        { ar: 'BPTT يفرد الحلقة فيطبق القاعدة المتسلسلة على قوى W_hh: أصغر من 1 تلاشٍ وأكبر من 1 انفجار — قصّ التدرجات g ← min(1, θ/‖g‖)·g يعالج الانفجار فقط والقص المقطوع بعد τ خطوة هو التقريب العملي (الهدف من s7 الانتشار الخلفي عبر الزمن).', en: 'BPTT unrolls the loop and applies the chain rule to powers of W_hh: below 1 vanishes, above 1 explodes \u2014 clipping g \u2190 min(1, \u03b8/\u2016g\u2016)\u00b7g treats only explosion, and truncating after \u03c4 steps is the practical approximation (goal of s7 Backpropagation Through Time).' },
      ],
      reflectPrompt: {
        ar: 'لماذا يعمل قصّ التدرجات مع الانفجار ولا فائدة منه مع التلاشي؟ وصغ إجابتك في سطر واحد من واقع صيغة العامل min(1, θ/‖g‖).',
        en: 'Why does gradient clipping help explosion but not vanishing? Craft a one-line answer grounded in the factor min(1, \u03b8/\u2016g\u2016).',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch9.s5' },
        { book: 'D2L', section: 'd2l.ch9.s6' },
        { book: 'D2L', section: 'd2l.ch9.s7' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch9.s5' },
    { book: 'D2L', section: 'd2l.ch9.s6' },
    { book: 'D2L', section: 'd2l.ch9.s7' },
  ],
} satisfies Lesson;

export default lesson;
