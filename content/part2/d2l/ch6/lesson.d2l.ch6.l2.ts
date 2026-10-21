import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch6.l2 — "Parameter Initialization and Lazy Initialization"
 * تهيئة المعاملات والتهيئة الكسولة
 * Aligned with D2L ch6 s3 (Parameter Initialization) + s4 (Lazy Initialization).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: an init-policy engine over literal
 * shapes with an own LCG for the Xavier uniform draw (bound sqrt(6/(nin+nout))),
 * plus a LazyLinear that materializes weight shapes only at the first forward.
 * Every literal verified under CPython 3. Deterministic only: no input(),
 * no exit(), no unittest.main, no random module (own LCG, fixed seed).
 */
const lesson = {
  id: 'd2l.ch6.l2',
  version: 1,
  part: 'II',
  track: 'A3',
  book: 'D2L',
  chapter: 6,
  title: {
    ar: 'تهيئة المعاملات والتهيئة الكسولة',
    en: 'Parameter Initialization and Lazy Initialization',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch6.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'نفس الشبكة نفسها قد تتقارب في دقائق أو تتعثر إلى الأبد — والفرق غالبًا في القيم التي بدأت بها المعاملات. ولأن الأطراف تريد أيضًا أن تُكتب الشبكات بلا عناء، ابتكرت مكتبات التعلم العميق حيلة ذكية ثانية: لا تسألني عن حجم المدخل الآن، اكتشفه عند أول تمريرة بيانات. هذا الدرس يشرح البروتوكولين: كيف نُهيّئ المعاملات بقواعد مدروسة، وكيف تؤجل التهيئة الكسولة lazy initialization حتى تعرف الأشكال.',
        en: 'The very same network may converge in minutes or stall forever — and the difference is often the values its parameters started from. And because frameworks also want networks written painlessly, they invented a second clever trick: don\u2019t ask me the input size now, discover it at the first data pass. This lesson covers both protocols: how to initialize parameters with principled rules, and how lazy initialization defers until the shapes are known.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'بروتوكولات التهيئة', en: 'Initialization protocols' },
      chunks: [
        {
          ar: 'الافتراضي في الأطراف سحب موحّد يعتمد على بعدي المدخل والمخرج، لكنك تستطيع فرض أي بروتوكول: توزيع طبيعي بانحراف 0.01 مع انحيازات صفْر، أو قيمة ثابتة (42 مثلًا)، أو Xavier الذي يسحب من U(−a, a) حيث a = sqrt(6/(nin+nout)) — المدى يضيق كلما كبرت الطبقة، فتبقى تباين التفعيلات متساويًا عبر الطبقات بدلًا من أن ينفجر أو يتبخر. ويمكنك حتى بروتوكول غريب: اسحب من U(−10, 10) ثم صفّر كل ما كان |w| < 5. القاعدة العملية: التهيئة قرار تصميمي، و`nn.init.normal_` و`nn.init.xavier_uniform_` و`net.apply(...)` في الكتاب أدوات تنفيذها.',
          en: 'The framework default is a uniform draw scaled by the input and output dimensions, but you can impose any protocol: a normal distribution with std 0.01 and zero biases, a constant value (say 42), or Xavier — draw from U(\u2212a, a) with a = sqrt(6/(nin+nout)). The range shrinks as the layer widens, keeping activation variance steady across layers instead of exploding or vanishing. You can even impose an odd protocol: draw from U(\u221210, 10), then zero out anything with |w| < 5. The practical point: initialization is a design decision, and in the book `nn.init.normal_`, `nn.init.xavier_uniform_` and `net.apply(...)` are its tools.',
        },
        {
          ar: 'التهيئة الكسولة تحل مفارقة: عرّفت `nn.LazyLinear(8)` قبل أن تعرف أن المدخل 20 بُعدًا — فكيف يُبنى مصفوفة أوزان؟ الحل أن الإطار يؤجل: لا شيء يُهيأ حتى تمرر بيانات فعلية. عند أول forward يقرأ الإطار عرض المدخل (20)، يصنع W بشكل (8, 20)، ثم يتابع للطبقة التالية (1, 8) وهكذا تسلسليًا حتى تكتمل كل الأشكال ثم تُهيأ القيم. الفائدة تتضاعف مع الالتفافات: دقة الصورة تحدد أشكال كل الطبقات اللاحقة، والكسل يجعل تعديل المعمارية أخطاء أقل. في الكتاب: `apply_init` يمرر مدخلات وهمية لإجبار التهيئة حين تريد بروتوكولًا خاصًا.',
          en: 'Lazy initialization resolves a paradox: you defined `nn.LazyLinear(8)` before knowing the input is 20-dimensional — so how is the weight matrix built? The framework defers: nothing is initialized until real data flows. At the first forward it reads the input width (20), materializes W of shape (8, 20), then moves on to the next layer (1, 8) and so on sequentially until every shape is known and the values are finally drawn. The benefit compounds for convolutions: image resolution determines every downstream shape, and laziness makes architecture edits far less error-prone. In the book: `apply_init` pushes dummy inputs through to force initialization when you want a custom protocol.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'محرك سياسات تهيئة + استنتاج أشكال كسول',
        en: 'An init-policy engine + lazy shape inference',
      },
      code: "import math\n\nclass LCG:\n    def __init__(self, seed):\n        self.state = seed % 2147483647\n\n    def next(self):\n        self.state = (self.state * 48271) % 2147483647\n        return self.state / 2147483647\n\ndef init_layer(name, nin, nout, mode, rng):\n    if mode == 'xavier':\n        a = math.sqrt(6.0 / (nin + nout))\n        w = [[-a + 2.0 * a * rng.next() for _ in range(nin)] for _ in range(nout)]\n    elif mode == 'constant':\n        w = [[42.0] * nin for _ in range(nout)]\n    else:  # 'zeros'\n        w = [[0.0] * nin for _ in range(nout)]\n    return {'name': name, 'w': w, 'b': [0.0] * nout}\n\nrng = LCG(seed=1)\nh = init_layer('h', 4, 8, 'xavier', rng)\nprint('a = sqrt(6/(4+8)) =', round(math.sqrt(6.0 / 12.0), 4))\nprint('h.w row0:', [round(v, 4) for v in h['w'][0]])\no = init_layer('o', 8, 1, 'zeros', rng)\nprint('o.w:', o['w'], '| all biases zero:', all(v == 0.0 for l in (h, o) for v in l['b']))\n\nclass LazyLinear:\n    def __init__(self, nout):\n        self.nout = nout\n        self.w = None  # shape still unknown\n\n    def observe(self, in_width):\n        self.w = [[0.0] * in_width for _ in range(self.nout)]\n        self.b = [0.0] * self.nout\n        return (self.nout, in_width)\n\nnet = [LazyLinear(8), LazyLinear(1)]\nprint('before first forward:', [l.w for l in net])\nwidth = 20\nshapes = []\nfor layer in net:\n    shapes.append(layer.observe(width))\n    width = layer.nout\nprint('after first forward:', shapes)",
      explanation: {
        ar: 'بروتوكول Xavier يحسب المدى a = sqrt(6/12) = 0.7071 لطبقة 4→8، ثم يسحب القيم من U(−a, a) بمولّد خطي مطابق الحالة (بذرة ثابتة = نفس النتيجة كل مرة)، والانحيازات صفر دائمًا. أما الجزء الكسول فهو جوهر `nn.LazyLinear`: قبل أول forward لا يوجد شكل للوزن (None)، وعند مرور عرض 20 تتحقق الأشكال تسلسليًا: (8, 20) للطبقة الأولى ثم (1, 8) للثانية — الاستنتاج يتسلسل لأن مخرج كل طبقة هو مدخل التالية.',
        en: 'The Xavier protocol computes the range a = sqrt(6/12) = 0.7071 for a 4\u21928 layer, then draws from U(\u2212a, a) with a linear congruential generator at a fixed state (same seed, same result every run), with biases always zero. The lazy half is the heart of `nn.LazyLinear`: before the first forward there is no weight shape at all (None); once a width of 20 flows through, the shapes resolve sequentially — (8, 20) for the first layer, then (1, 8) for the second. Inference chains because each layer\u2019s output is the next one\u2019s input.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.lazy-shapes',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب xavier_a(nin, nout) التي تعيد المدى a = sqrt(6/(nin+nout))، وinfer_shapes(in_width, hidden_sizes) التي تحاكي استنتاج التهيئة الكسولة: تبدأ من عرض المدخل وتعيد قائمة أشكال أوزان الطبقات بالترتيب (كل شكل زوج (nout, nin) الحالي) مع تحديث العرض بمخرج كل طبقة.',
        en: 'Write xavier_a(nin, nout) returning the range a = sqrt(6/(nin+nout)), and infer_shapes(in_width, hidden_sizes) simulating lazy initialization: start from the input width and return the list of weight shapes in order (each shape a pair (nout, current nin)), updating the width with each layer\u2019s output.',
      },
      starterCode: "import math\n\ndef xavier_a(nin, nout):\n    ...  # TODO: sqrt(6 / (nin + nout))\n\ndef infer_shapes(in_width, hidden_sizes):\n    ...  # TODO: chain (nout, width) pairs, width <- nout each step\n",
      solution: "import math\n\ndef xavier_a(nin, nout):\n    return math.sqrt(6.0 / (nin + nout))\n\ndef infer_shapes(in_width, hidden_sizes):\n    shapes = []\n    width = in_width\n    for nout in hidden_sizes:\n        shapes.append((nout, width))\n        width = nout\n    return shapes",
      tests: [
        {
          id: 't1',
          name: { ar: 'مدى Xavier لطبقة 4→8', en: 'Xavier range for a 4\u21928 layer' },
          code: "assert abs(xavier_a(4, 8) - 0.7071067811865476) < 1e-9, 'expected 0.7071 | actual: %r' % xavier_a(4, 8)",
          expected: '0.7071067811865476',
        },
        {
          id: 't2',
          name: { ar: 'سلسلة 20 → 8 → 1', en: 'The 20 → 8 → 1 chain' },
          code: "assert infer_shapes(20, [8, 1]) == [(8, 20), (1, 8)], 'expected [(8, 20), (1, 8)] | actual: %r' % infer_shapes(20, [8, 1])",
          expected: '[(8, 20), (1, 8)]',
        },
        {
          id: 't3',
          name: { ar: 'سلسلة أعمق 4 → 3 → 2 → 1', en: 'A deeper 4 → 3 → 2 → 1 chain' },
          code: "assert infer_shapes(4, [3, 2, 1]) == [(3, 4), (2, 3), (1, 2)], 'expected chain [(3, 4), (2, 3), (1, 2)] | actual: %r' % infer_shapes(4, [3, 2, 1])",
          expected: '[(3, 4), (2, 3), (1, 2)]',
        },
      ],
      hints: [
        { ar: 'a = math.sqrt(6.0 / (nin + nout)) — تأكد من القسمة العائمة 6.0 وليس 6.', en: 'a = math.sqrt(6.0 / (nin + nout)) — make sure it is float division 6.0, not 6.' },
        { ar: 'في infer_shapes احتفظ بمتغير width يبدأ من in_width؛ كل تكرار يسجل (nout, width) ثم يحدّث width = nout.', en: 'In infer_shapes keep a width variable starting at in_width; each iteration records (nout, width) then updates width = nout.' },
        { ar: 'قيم تحقق: infer_shapes(20, [8, 1]) = [(8, 20), (1, 8)] — مخرج الطبقة الأولى هو مدخل الثانية.', en: 'Sanity: infer_shapes(20, [8, 1]) = [(8, 20), (1, 8)] — the first layer\u2019s output is the second\u2019s input.' },
        { ar: 'لا حاجة لأي حالة عامة: الدالة نقية، وكل الأشكال تنبثق من العرض الحالي فقط.', en: 'No global state needed: the function is pure, and every shape follows from the current width alone.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-xavier',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'طبقة كاملة مدخلاتها 128 ومخرجاتها 32 مُهيأة بـ Xavier uniform. ما المدى a للسحب من U(−a, a)؟ (أجب بأربع منازل عشرية.)',
        en: 'A fully connected layer with 128 inputs and 32 outputs is initialized with Xavier uniform. What is the range a of the U(\u2212a, a) draw? (Answer to four decimal places.)',
      },
      answer: '0.1936',
      tolerance: 0.001,
      solution: '0.1936',
      hints: [
        { ar: 'القاعدة: a = sqrt(6/(nin+nout)) من المفهوم — بلا أي أبعاد أخرى.', en: 'The rule: a = sqrt(6/(nin+nout)) from the concept — no other dimensions involved.' },
        { ar: 'هنا nin + nout = 128 + 32 = 160، إذن a = sqrt(6/160) = sqrt(0.0375).', en: 'Here nin + nout = 128 + 32 = 160, so a = sqrt(6/160) = sqrt(0.0375).' },
        { ar: 'قارن بالطبقة 4→8 في الدرس: sqrt(0.5) = 0.7071 — الطبقة الأعرض مداها أضيق بكثير.', en: 'Compare with the lesson\u2019s 4\u21928 layer: sqrt(0.5) = 0.7071 — the wider layer\u2019s range is much narrower.' },
        { ar: 'الجواب: 0.1936 (تقريبًا؛ القيمة الدقيقة 0.19364916...).', en: 'Answer: 0.1936 (approximately; the exact value is 0.19364916...).' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\nclass LCG:\n    def __init__(self, seed):\n        self.state = seed % 2147483647\n    def next(self):\n        self.state = (self.state * 48271) % 2147483647\n        return self.state / 2147483647\n\ndef masked_init(nin, nout, seed):\n    rng = LCG(seed)\n    out = []\n    for _ in range(nout):\n        row = []\n        for _ in range(nin):\n            u = -10.0 + 20.0 * rng.next()\n            row.append(u if abs(u) >= 5.0 else 0.0)\n        out.append(row)\n    return out\n\nw = masked_init(4, 2, seed=7)\nprint('w row0:', [round(v, 4) for v in w[0]])\nprint('kept:', sum(1 for r in w for v in r if v != 0.0), 'of', 8)\nprint('mask ok:', all(v == 0.0 or 5.0 <= abs(v) <= 10.0 for r in w for v in r))\nprint('xavier a (128, 32):', round(math.sqrt(6.0 / 160.0), 4))\n# جرّب: غيّر seed وشاهد أي قيم يُبقيها القناع abs(u) >= 5 وأيها يصفّرها.\n# try: change the seed and watch which values the abs(u) >= 5 mask keeps and which it zeroes.\n# جرّب: قارن a لـ Xavier عند (128, 32) مع (32, 128) — هل الترتيب يهم؟\n# try: compare Xavier's a for (128, 32) vs (32, 128) — does the order matter?\n",
      prompt: {
        ar: 'الملعب ينفذ البروتوكول الغريب من الكتاب: سحب من U(−10, 10) ثم قناع يصفّر كل |w| < 5، مع مولّد خطي ثابت البذرة. جرّب بذورًا وأحجامًا مختلفة.',
        en: 'The sandbox runs the book\u2019s odd protocol: draws from U(\u221210, 10), then a mask zeroes anything with |w| < 5, using a fixed-seed linear generator. Try different seeds and sizes.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في البروتوكول المعتاد (طبيعي σ=0.01)، ماذا نفعل بالانحيازات biases؟',
            en: 'In the common protocol (normal, \u03c3=0.01), what do we do with the biases?',
          },
          options: [
            { id: 'a', text: { ar: 'نهيئها من التوزيع الطبيعي نفسه', en: 'We initialize them from the same normal distribution' } },
            { id: 'b', text: { ar: 'نصفّرها جميعًا', en: 'We set them all to zero' } },
            { id: 'c', text: { ar: 'نتركها كما هي دون تغيير', en: 'We leave them untouched' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'البروتوكول القياسي: أوزان من N(0, 0.01²) وانحيازات صفر — الانحياز لا يحتاج عشوائية لأنه إزاحة لكل وحدة.',
            en: 'The standard protocol: weights from N(0, 0.01\u00b2) and zero biases — a bias needs no randomness since it is just a per-unit offset.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الذي يتحكم فيه مدى Xavier a = sqrt(6/(nin+nout))؟',
            en: 'What does the Xavier range a = sqrt(6/(nin+nout)) control?',
          },
          options: [
            { id: 'a', text: { ar: 'سرعة الحفظ على القرص', en: 'The speed of saving to disk' } },
            { id: 'b', text: { ar: 'تباين التفعيلات يبقى متساويًا عبر الطبقات بدل أن ينفجر أو يتبخر', en: 'Activation variance stays steady across layers instead of exploding or vanishing' } },
            { id: 'c', text: { ar: 'عدد المعاملات في الطبقة', en: 'The number of parameters in the layer' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المدى يتناسب عكسيًا مع جذر مجموع الأبعاد، فتبقى مقادير المدخلات إلى كل طبقة في النطاق نفسه — وهو موضوع استقرار الشبكات العميقة.',
            en: 'The range scales inversely with the square root of the dimension sum, keeping each layer\u2019s input magnitudes in the same band — the heart of deep-network stability.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'متى يعرف إطار التهيئة الكسولة شكل أول مصفوفة أوزان؟',
            en: 'When does a lazily initialized framework learn the first weight matrix\u2019s shape?',
          },
          options: [
            { id: 'a', text: { ar: 'عند لحظة تعريف الطبقة في الشيفرة', en: 'The moment the layer is written in code' } },
            { id: 'b', text: { ar: 'عند أول تمريرة بيانات فعلية عبر الشبكة', en: 'At the first forward pass with actual data' } },
            { id: 'c', text: { ar: 'لا يعرفها أبدًا إلا إذا كتبتها يدويًا', en: 'Never, unless you write it by hand' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التأجيل حتى أول forward: عرض المدخل يحدد شكل الطبقة الأولى، ثم يتسلسل الاستنتاج للطبقات الأعمق حتى تكتمل الأشكال كلها.',
            en: 'Deferral until the first forward: the input width fixes the first layer\u2019s shape, then inference chains into deeper layers until every shape is known.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التهيئة بروتوكولات مختارة: طبيعي σ=0.01 مع انحيازات صفر، ثابت، أو Xavier بمدى sqrt(6/(nin+nout)) — وتستطيع بروتوكولًا مخصصًا بقناع (الهدف من s3 تهيئة المعاملات).', en: 'Initialization is a menu of protocols: normal \u03c3=0.01 with zero biases, constants, or Xavier with range sqrt(6/(nin+nout)) — and custom masks are allowed (goal of s3 Parameter Initialization).' },
        { ar: 'التهيئة الكسولة تؤجل إنشاء الأشكال إلى أول forward: عرض المدخل يطلق سلسلة استنتاج (nout, width) عبر الطبقات (الهدف من s4 التهيئة الكسولة).', en: 'Lazy initialization defers shape creation to the first forward: the input width triggers a chain of (nout, width) inference across layers (goal of s4 Lazy Initialization).' },
        { ar: 'البذرة الثابتة والمولّد الخطي يجعلان أي سحب "عشوائي" قابلًا للتكرار والتحقق — نفس فلسفة المولد داخل منصة minigrad.', en: 'A fixed seed with a linear congruential generator makes any "random" draw reproducible and verifiable — the same philosophy as the generator inside the platform\u2019s minigrad.' },
      ],
      reflectPrompt: {
        ar: 'شبكتك تتقارب ببطء شديد وتفعيلات الطبقة الثانية تتضخم. أي أداة من هذا الدرس تنظر إليها أولًا: البروتوكول أم الكسل — ولماذا لا يصلح "الكسل" علاجًا لمشكلة تضخم القيم؟',
        en: 'Your network converges painfully slowly and the second layer\u2019s activations blow up. Which tool from this lesson do you inspect first: the protocol or laziness — and why can laziness never fix exploding values?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch6.s3' },
        { book: 'D2L', section: 'd2l.ch6.s4' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch6.s3' },
    { book: 'D2L', section: 'd2l.ch6.s4' },
  ],
} satisfies Lesson;

export default lesson;
