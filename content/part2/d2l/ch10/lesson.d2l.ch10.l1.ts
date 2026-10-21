import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch10.l1 — "Gated Memory: LSTM and GRU"
 * ذاكرة مُبوَّبة: LSTM وGRU
 * Aligned with D2L ch10 s1 (Long Short-Term Memory) + s2 (Gated Recurrent
 * Units). All expression is original — a paraphrase of the source's ideas,
 * never a verbatim translation. Runnable design: LSTM gate math evaluated
 * at fixed scalar values over three steps, frozen-cell and convex-update
 * extremes, and a forget-bias sandbox; every literal verified under
 * CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch10.l1',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 10,
  title: {
    ar: 'ذاكرة مُبوَّبة: LSTM وGRU',
    en: 'Gated Memory: LSTM and GRU',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch9.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قصّ التدرجات يعالج الانفجار، لكن التلاشي ظل معلقًا: معلومة من أول الجملة تذوب قبل أن تصل إلى آخره. حل LSTM (1997): خلية ذاكرة بحالة داخلية تمرّ عبر الزمن بوزن 1 تقريبًا، وثلاثة أبواب سيجمويدية تقرر متى تُكتب ومتى تُمسح ومتى تُقرأ. GRU (2014) يحقق الفكرة نفسها ببابين فقط. سنحسب رياضيات الأبواب بأرقام حرفية ونرى الذاكرة تتجمد وتتنفس.',
        en: 'Clipping handles explosion, but vanishing stayed open: information from the start of a sentence melts before reaching its end. LSTM\u2019s fix (1997): a memory cell whose internal state flows through time with weight ~1, plus three sigmoid gates deciding when to write, when to erase, and when to read. GRU (2014) achieves the same idea with only two gates. We will compute the gate math at fixed values and watch memory freeze and breathe.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'بوابات الذاكرة الثلاث، ثم اختصارها إلى بابين', en: 'Three memory gates, then shrinking to two' },
      chunks: [
        {
          ar: 'خلية LSTM تحسب من المدخل x_t والحالة السابقة h_{t-1} ثلاث بوابات سيجمويدية بين 0 و1: بوابة الإدخال I_t (كم يُكتب من المعلومة الجديدة)، وبوابة النسيان F_t (كم تبقى من الذاكرة القديمة)، وبوابة الإخراج O_t (كم يُسمح للحالة بالتأثير في الطبقات الأخرى) — إضافة إلى عقدة الإدخال C\u0303_t بتفعيل tanh بين −1 و1. تحديث الحالة الداخلية جداء عناصري: C_t = F_t ⊙ C_{t-1} + I_t ⊙ C\u0303_t، ثم الحالة الظاهرة H_t = O_t ⊙ tanh(C_t). الحالة الداخلية تبقى داخل الخلية ولا تُمرر للطبقة العليا. الحالتان الحدان يفسران كل شيء: F=1 و I=0 يجمدان C_{t-1} كما هي عبر أي عدد من الخطوات — قناة تدرج شبه ثابتة تحل التلاشي — بينما الأبواب المتوسطة تسمح بالكتابة الانتقائية والمسح الانتقائي.',
          en: 'From input x_t and previous state h_{t-1}, an LSTM cell computes three sigmoid gates in (0, 1): the input gate I_t (how much of the new information to write), the forget gate F_t (how much old memory survives), and the output gate O_t (how much the state may influence other layers) \u2014 plus an input node C\u0303_t with tanh in (\u22121, 1). The internal state updates elementwise: C_t = F_t \u2299 C_{t-1} + I_t \u2299 C\u0303_t, and the visible state is H_t = O_t \u2299 tanh(C_t). The internal state stays inside the cell and is not passed upward. The two extremes explain everything: F=1 with I=0 freezes C_{t-1} across arbitrarily many steps \u2014 a near-constant gradient channel that defeats vanishing \u2014 while intermediate gates allow selective writing and selective erasing.',
        },
        {
          ar: 'GRU يبسّط: باب تحديث Z_t وباب إعادة ضبط R_t فقط (بلا حالة خلية منفصلة وبلا بوابة إخراج). المرشّح H\u0303_t = tanh(X_t·W_xh + (R_t ⊙ H_{t-1})·W_hh + b_h): البوابة R قرب 1 تعيد سلوك RNN العادي، وقرب 0 تمسح الماضي فيقرأ المرشّح المدخل وحده. ثم مزيج محدب: H_t = Z_t ⊙ H_{t-1} + (1−Z_t) ⊙ H\u0303_t — عند Z≈1 تُهمل x_t كليًا وتتخطى الخطوة في سلسلة التبعية (ذاكرة طويلة)، وعند Z≈0 تتخذ الحالة المرشّح الجديد. خلاصة الكتاب: R يلتقط التبعيات قصيرة المدى و Z يلتقط الطويلة. الثمن والبديل: LSTM أثقل بأربعة مجموعات أوزان مقابل ثلاث لـ GRU وواحدة لـ RNN العادي — وأداؤهما غالبًا متقارب، فاختيار GRU يوفر حسابًا بلا خسارة واضحة.',
          en: 'GRU simplifies: only an update gate Z_t and a reset gate R_t (no separate cell state, no output gate). The candidate H\u0303_t = tanh(X_t\u00b7W_xh + (R_t \u2299 H_{t-1})\u00b7W_hh + b_h): with R near 1 this recovers a vanilla RNN, and with R near 0 the past is erased so the candidate reads only the input. Then a convex combination: H_t = Z_t \u2299 H_{t-1} + (1\u2212Z_t) \u2299 H\u0303_t \u2014 at Z\u22481 the input x_t is ignored and the step is skipped in the dependency chain (long memory); at Z\u22480 the state takes the fresh candidate. The book\u2019s summary: R captures short-term dependencies and Z captures long-term ones. The cost: LSTM carries four weight groups versus three for GRU and one for a plain RNN \u2014 yet they often perform comparably, so GRU saves compute without a clear loss.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'رياضيات البوابات بأرقام حرفية: خلية LSTM ثلاث خطوات',
        en: 'Gate math at fixed values: one LSTM cell, three steps',
      },
      code: "import math\n\ndef sigmoid(x):\n    return 1.0 / (1.0 + math.exp(-x))\n\n# one scalar LSTM cell, literal weights: gates read only x (hidden term is 0)\nh, c = 0.0, 0.0\nfor t, x in enumerate([1.0, -1.0, 0.5], start=1):\n    i_g = sigmoid(x)          # input gate   (W_xi = 1, bias 0)\n    f_g = sigmoid(2.0)        # forget gate  (all-zero weights, bias 2)\n    o_g = sigmoid(2.0 * x)    # output gate  (W_xo = 2, bias 0)\n    c_t = math.tanh(x)        # input node   (W_xc = 1, bias 0)\n    c = f_g * c + i_g * c_t\n    h = o_g * math.tanh(c)\n    print('t=%d | x=%+.2f i=%.4f f=%.4f o=%.4f ct=%+.4f -> c=%.4f h=%.4f'\n          % (t, x, i_g, f_g, o_g, c_t, c, h))\n\n# extremes: forget fully open, input fully shut -> the cell state is frozen\nprint('frozen cell:', 1.0 * 0.7 + 0.0 * math.tanh(3.0))\n\n# GRU hidden update is a convex combination: H = Z*H_prev + (1-Z)*H_tilde\nH_prev, H_tilde = 0.8, -0.4\nfor z in (1.0, 0.5, 0.0):\n    print('Z=%.1f -> H = %.2f' % (z, z * H_prev + (1 - z) * H_tilde))",
      explanation: {
        ar: 'اتبع الذاكرة c عبر الأسطر: عند t=1 تفتح بوابة الإدخال (0.7311) فتكتب tanh(1)=0.7616 مضروبًا بها، والنسيان 0.8808 يحتفظ بلا شيء (c كانت صفرًا) — فتصبح c=0.5568 والحالة الظاهرة h=0.8808·tanh(c)=0.4453. عند t=2 مدخل سالب: الإدخال يكتب −0.2048 والنسيان يبقي 0.4904 من القديم فتتراجع c إلى 0.2856، وبوابة الإخراج شبه مغلقة (0.1192) فتكتم h إلى 0.0331 — الخلية تحتفظ بالمعلومة دون أن تعرضها! عند t=3 تتنفس: إخراج 0.7311 يرفع h إلى 0.3600. السطر الجامد يبرهن التجميد: 1·0.7 + 0·tanh(3) = 0.7 بالضبط — قناة تمرير نقية. وأخيرًا GRU: عند Z=1 تبقى H=0.80، وعند Z=0.5 الوسط 0.20، وعند Z=0 تتخذ المرشّح −0.40 — مزيج محدب حرفي بين الماضي والمرشّح.',
        en: 'Follow the memory c down the lines: at t=1 the input gate opens (0.7311) and writes tanh(1)=0.7616 scaled by it, while forgetting keeps 0.8808 of nothing (c was zero) \u2014 so c=0.5568 and the visible state h=0.8808\u00b7tanh(c)=0.4453. At t=2 the input turns negative: the input gate writes \u22120.2048 while forgetting retains 0.4904 of the old value, so c recedes to 0.2856 \u2014 and with the output gate nearly shut (0.1192) h is muted to 0.0331: the cell holds information without displaying it! At t=3 it breathes out: an output gate of 0.7311 lifts h to 0.3600. The frozen line proves the extreme: 1\u00b70.7 + 0\u00b7tanh(3) = 0.7 exactly \u2014 a pure pass-through channel. And GRU: at Z=1 the state stays 0.80, at Z=0.5 the midpoint 0.20, at Z=0 it takes the candidate \u22120.40 \u2014 a literal convex combination of past and candidate.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.gru-step',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ gru_step(x, h, r, z) التي تحسب خطوة GRU واحدة بأوزان وحدوية: المرشّح h_tilde = tanh(x + r·h) ثم التحديث H = z·h + (1−z)·h_tilde. الوظيفة يجب أن تعيد قيمة H الجديدة.',
        en: 'Implement gru_step(x, h, r, z) computing one GRU step with unit weights: the candidate h_tilde = tanh(x + r\u00b7h), then the update H = z\u00b7h + (1\u2212z)\u00b7h_tilde. The function must return the new H.',
      },
      starterCode: "import math\n\ndef gru_step(x, h, r, z):\n    ...  # TODO: candidate with the reset gate, then the convex update\n    return new_h\n\nprint(gru_step(5.0, 0.8, 1.0, 1.0))\nprint(gru_step(0.5, 0.0, 1.0, 0.0))\nprint(gru_step(0.5, 100.0, 0.0, 0.0))\n",
      solution: "import math\n\ndef gru_step(x, h, r, z):\n    h_tilde = math.tanh(x + r * h)\n    return z * h + (1 - z) * h_tilde",
      tests: [
        {
          id: 't1',
          name: { ar: 'Z=1 يتخطى الخطوة: الحالة لا تتغير', en: 'Z=1 skips the step: the state is unchanged' },
          code: "import math\nassert abs(gru_step(5.0, 0.8, 1.0, 1.0) - 0.8) < 1e-12, 'expected 0.8 | actual: %r' % gru_step(5.0, 0.8, 1.0, 1.0)",
          expected: '0.8',
        },
        {
          id: 't2',
          name: { ar: 'Z=0 يتخذ المرشّح كاملًا', en: 'Z=0 takes the candidate wholesale' },
          code: "import math\nassert abs(gru_step(0.5, 0.0, 1.0, 0.0) - math.tanh(0.5)) < 1e-12, 'expected tanh(0.5) | actual: %r' % gru_step(0.5, 0.0, 1.0, 0.0)",
          expected: 'tanh(0.5)',
        },
        {
          id: 't3',
          name: { ar: 'R=0 يمسح الماضي فلا يتسرب شيء من h', en: 'R=0 wipes the past so nothing of h leaks' },
          code: "import math\nassert abs(gru_step(0.5, 100.0, 0.0, 0.0) - math.tanh(0.5)) < 1e-12, 'the reset gate must block the old state | actual: %r' % gru_step(0.5, 100.0, 0.0, 0.0)",
          expected: 'tanh(0.5)',
        },
      ],
      hints: [
        { ar: 'المرشّح يقرأ المدخل والحالة المُعاد ضبطها: h_tilde = math.tanh(x + r * h) — الـ r يدخل داخل الـ tanh وليس خارجه.', en: 'The candidate reads the input and the reset state: h_tilde = math.tanh(x + r * h) \u2014 r goes inside the tanh, not outside.' },
        { ar: 'التحديث مزيج محدب: z * h + (1 - z) * h_tilde — الأوزان z و (1−z) تجمع إلى 1.', en: 'The update is a convex combination: z * h + (1 - z) * h_tilde \u2014 the weights z and (1\u2212z) sum to 1.' },
        { ar: 'حالتان حدّيتان للفحص: z=1 يعيد h كما هو مهما كان x، و z=0 يعيد h_tilde كما هو.', en: 'Two boundary cases to test: z=1 returns h unchanged whatever x is, and z=0 returns h_tilde unchanged.' },
        { ar: 'قيم تحقق: gru_step(0.5, 0, 1, 0) = tanh(0.5) ≈ 0.4621، وحتى مع h=100 فإن r=0 يمنع تسربها.', en: 'Sanity values: gru_step(0.5, 0, 1, 0) = tanh(0.5) \u2248 0.4621, and even with h=100 a reset r=0 blocks it from leaking.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-lstm-params',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'طبقة LSTM بأربعة أشباه طبقات (ثلاث بوابات + عقدة إدخال) ولكل منها أوزان مدخلات d×h وأوزان حالة h×h وانحياز h. كم معاملًا لطبقة LSTM بعدد مدخلات d=16 وعدد وحدات خفية h=32؟',
        en: 'An LSTM layer holds four half-layers (three gates + the input node), each with input weights d\u00d7h, state weights h\u00d7h, and a bias h. How many parameters does an LSTM layer have with d=16 inputs and h=32 hidden units?',
      },
      answer: '6272',
      tolerance: 1e-9,
      solution: '6272',
      hints: [
        { ar: 'مجموعة واحدة = d·h + h·h + h = 16·32 + 32·32 + 32.', en: 'One group = d\u00b7h + h\u00b7h + h = 16\u00b732 + 32\u00b732 + 32.' },
        { ar: '16·32 = 512 و 32·32 = 1024 — فالمجموعة الواحدة 512 + 1024 + 32 = 1568.', en: '16\u00b732 = 512 and 32\u00b732 = 1024 \u2014 so one group is 512 + 1024 + 32 = 1568.' },
        { ar: 'LSTM يحمل أربع مجموعات (I و F و O و C\u0303): 4 × 1568.', en: 'An LSTM carries four groups (I, F, O, C\u0303): 4 \u00d7 1568.' },
        { ar: 'للمقارنة: GRU بثلاث مجموعات = 4704، و RNN عادي بمجموعة واحدة = 1568.', en: 'For comparison: a GRU with three groups = 4704, and a plain RNN with one group = 1568.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef sigmoid(x):\n    return 1.0 / (1.0 + math.exp(-x))\n\n# how open is the forget gate, and what survives three steps of gentle writing?\nfor bf in (-2.0, 0.0, 2.0, 5.0):\n    c = 1.0\n    for _ in range(3):\n        c = sigmoid(bf) * c + 0.1 * math.tanh(1.0)\n    print('b_f=%+.1f -> f=%.4f, cell after 3 steps: %.4f' % (bf, sigmoid(bf), c))\n\n# جرّب: عند b_f=-2 تذوب الذاكرة (0.088)، وعند 5 تتراكم فوق 1.0 — أين خط الاستواء العملي؟\n# try: at b_f=-2 memory melts (0.088); at 5 it piles past 1.0 - where is the\n#      practical equilibrium?\n# جرّب: غيّر مقدار الكتابة من 0.1 إلى 0.5 وأعد التشغيل ولاحظ كيف يتفاقم أثر النسيان.\n# try: change the write amount from 0.1 to 0.5 and rerun; watch forgetting compound.\n",
      prompt: {
        ar: 'الملعب يمشي بوابة النسيان عبر أربع قيم انحياز: عند b_f=−2 تبقى البوابة 0.1192 فتذوب الذاكرة إلى 0.088 بعد ثلاث خطوات؛ وعند +2 (0.8808) تنمو بلطف إلى 0.886؛ وعند +5 (0.9933) تكاد تتجمد وتتضخم إلى 1.207. انحياز النسيان ليس تفصيلًا: هو محبس تدفق الذاكرة كلها.',
        en: 'The sandbox walks the forget gate across four biases: at b_f=\u22122 the gate sits at 0.1192 and memory melts to 0.088 after three steps; at +2 (0.8808) it grows gently to 0.886; at +5 (0.9933) it nearly freezes and swells to 1.207. The forget bias is no detail: it is the valve that meters the entire memory stream.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي البوابات في LSTM تقرر متى تُمسح الحالة الداخلية إلى الصفر؟',
            en: 'Which LSTM gate decides when the internal state is flushed toward zero?',
          },
          options: [
            { id: 'a', text: { ar: 'بوابة الإدخال', en: 'The input gate' } },
            { id: 'b', text: { ar: 'بوابة النسيان', en: 'The forget gate' } },
            { id: 'c', text: { ar: 'بوابة الإخراج', en: 'The output gate' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'C_t = F_t ⊙ C_{t-1} + I_t ⊙ C\u0303_t: العامل F يضرب القديم مباشرة، فقربه من 0 يمسح الذاكرة وقربه من 1 يحفظها. الإدخال يتحكم بالكتابة والإخراج بالقراءة فقط.',
            en: 'C_t = F_t \u2299 C_{t-1} + I_t \u2299 C\u0303_t: the factor F multiplies the old state directly, so near 0 it flushes and near 1 it preserves. The input gate only controls writing and the output gate reading.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كيف تعالج حالة الخلية C مشكلة تلاشي التدرج التي يعانيها RNN العادي؟',
            en: 'How does the cell state C address the vanishing-gradient problem of a plain RNN?',
          },
          options: [
            { id: 'a', text: { ar: 'تمر عبر الزمن بجمع وزنّي بدل الضرب المتكرر، ويمكن أن تمر بوزن ≈1 عبر خطوات كثيرة', en: 'It flows through time additively instead of repeated multiplication, and can pass with weight \u22481 across many steps' } },
            { id: 'b', text: { ar: 'لأنها تُطبّق tanh في كل خطوة فتحفظ المدى', en: 'Because tanh is applied at every step, bounding the range' } },
            { id: 'c', text: { ar: 'لأنها أكبر بُعديًا من الحالة h', en: 'Because it is higher-dimensional than the state h' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مسار C جمعي (F⊙C + I⊙C\u0303) وليس مضروبًا بوزن يتغير، فعند F≈1 و I≈0 تسيل المعلومة والتدرج عبر خطوات كثيرة دون تذوب — هذا «الوزن 1» الذي وصفت به الكتاب الذاكرة الطويلة.',
            en: 'The C path is additive (F\u2299C + I\u2299C\u0303) rather than multiplied by a changing weight, so with F\u22481 and I\u22480 information and gradient can flow across many steps without melting \u2014 the «weight 1» recurrent edge the book describes.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في GRU، ماذا يحدث عند بوابة تحديث Z قريبة من 1؟',
            en: 'In a GRU, what happens when the update gate Z is close to 1?',
          },
          options: [
            { id: 'a', text: { ar: 'الحالة الجديدة تساوي المرشّح وتُهمل الحالة القديمة', en: 'The new state equals the candidate and the old state is discarded' } },
            { id: 'b', text: { ar: 'تبقى الحالة القديمة ويُهمل أثر المدخل الحالي — تخطي الخطوة في سلسلة التبعية', en: 'The old state is kept and the current input is ignored \u2014 the step is skipped in the dependency chain' } },
            { id: 'c', text: { ar: 'تُمسح الحالة إلى صفر', en: 'The state is reset to zero' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'H = Z⊙H_prev + (1−Z)⊙H\u0303: عند Z≈1 يغلب الحفظ فتتخطى الخطوة في سلسلة التبعية وتعبر المعلومة مسافة أطول — عكسه Z≈0 يُدخل المرشّح الجديد. البوابة R هي التي تتحكم بحذف الماضي من داخل المرشّح.',
            en: 'H = Z\u2299H_prev + (1\u2212Z)\u2299H\u0303: at Z\u22481 keeping dominates, the step is skipped in the dependency chain and information travels farther; the opposite Z\u22480 admits the fresh candidate. It is the reset gate R that erases the past inside the candidate.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'LSTM = ثلاث بوابات سيجمويدية (إدخال/نسيان/إخراج) + عقدة إدخال tanh، وتحديث C_t = F⊙C_{t-1} + I⊙C\u0303_t ثم H_t = O⊙tanh(C_t) — مع بقاء C داخل الخلية (الهدف من s1 الذاكرة قصيرة-المدى الطويلة).', en: 'LSTM = three sigmoid gates (input/forget/output) + a tanh input node, updating C_t = F\u2299C_{t-1} + I\u2299C\u0303_t then H_t = O\u2299tanh(C_t) \u2014 with C staying internal (goal of s1 Long Short-Term Memory).' },
        { ar: 'الأطرف تفسر القوة: F=1 و I=0 يجمدان الذاكرة عبر الزمن (قناة تدرج شبه ثابتة تعالج التلاشي)، والأبواب المتوسطة تعطي كتابة ومسحًا انتقائيين.', en: 'The extremes explain the power: F=1 with I=0 freezes memory across time (a near-constant gradient channel defeating vanishing), and intermediate gates give selective writing and erasing.' },
        { ar: 'GRU يكفي ببابين: R يمسح الماضي داخل المرشّح (تبعيات قصيرة) و Z يمزج convex بين القديم والمرشّح (تبعيات طويلة) — بثلاث مجموعات أوزان بدل أربع في LSTM وواحدة في RNN (الهدف من s2 وحدات التكرار المبوَّبة).', en: 'GRU manages with two gates: R erases the past inside the candidate (short-term dependencies) and Z convexly blends old state and candidate (long-term dependencies) \u2014 three weight groups versus four in LSTM and one in a plain RNN (goal of s2 Gated Recurrent Units).' },
      ],
      reflectPrompt: {
        ar: 'لو كنت تضبط نموذج لغة يحتاج تذكر أسماء قيلت قبل مئات الرموز: أي بوابة تتوقع أن يتغير انحيازها أكثر، ولأي قيمة؟',
        en: 'Tuning a language model that must remember names mentioned hundreds of tokens earlier: which gate\u2019s bias do you expect to shift most, and toward what value?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch10.s1' },
        { book: 'D2L', section: 'd2l.ch10.s2' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch10.s1' },
    { book: 'D2L', section: 'd2l.ch10.s2' },
  ],
} satisfies Lesson;

export default lesson;
