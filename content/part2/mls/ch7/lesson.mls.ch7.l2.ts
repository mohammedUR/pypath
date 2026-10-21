import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch7.l2 — "Building the Network from Scratch: Loops, then minigrad"
 * بناء الشبكة من الصفر: الحلقات ثم minigrad
 * Aligned with MLS ch7 s2 (Construction). The book builds two classes (looping
 * over observations vs matrix gradients, numpy); we mirror the structure with
 * pure-Python loops, then use the platform module `import minigrad`.
 * All literals verified under CPython 3 (loss values from seeded LCG init).
 */
const lesson = {
  id: 'mls.ch7.l2',
  version: 1,
  part: 'II',
  track: 'A3',
  book: 'MLS',
  chapter: 7,
  title: {
    ar: 'بناء الشبكة من الصفر: الحلقات ثم minigrad',
    en: 'Building the Network from Scratch: Loops, then minigrad',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch7.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في قسم البناء يكتب الكتاب شبكته بنفسه: أصناف Python تحمل الأوزان وتحسب التمرير الأمامي والتدرجات — أولًا بحلقة على الملاحظات، ثم بصيغة مصفوفية أسرع. سنكرر هذه الرحلة هنا بأداتين: حلقات بحتة تكشف كل عملية، ثم محرك المنصة minigrad الذي يضيف التفاضل التلقائي. في نهاية الدرس ستقارن نتائج الطريقين رقمًا برقم، وتدرّب الشبكة حقبة واحدة بيديك.',
        en: 'In its construction section the book writes the network itself: Python classes that hold the weights and compute the forward pass and gradients — first looping over observations, then in a faster matrix form. We repeat that journey with two tools: pure loops that expose every operation, then the platform engine minigrad, which adds automatic differentiation. By the end you will compare both routes number by number and train the network one epoch with your own hands.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'صنف بحلقات، ثم محرك تدرجات', en: 'A loop-built class, then a gradient engine' },
      chunks: [
        {
          ar: 'ينظم الكتاب شبكته في أصناف: صنف لطبقة يخزن مصفوفة أوزان ومتجه انحيازات ودالة تفعيل، وصنف للشبكة يركّب الطبقات. نص الكتاب يستخدم numpy لعمليات المصفوفات، لكن البنية نفسها تُكتب بحلقات بحتة: عصبون = حلقة داخلية تجمع w*x، وطبقة = حلقة خارجية على العصبونات، والشبكة = تسلسل نداءات. ويبني الكتاب نسختين للتدريب: الأولى تمرّ على الملاحظات واحدة واحدة وتجمع التدرجات الجزئية، والثانية تكدّس كل الملاحظات في مصفوفات وتحسب تدرج الدفعة كاملة دفعة واحدة. الرياضيات واحدة؛ الفرق تنظيمي وسرعة.',
          en: 'The book organizes its network into classes: a layer class storing a weight matrix, a bias vector and an activation, and a network class composing the layers. The book\u2019s code uses numpy for the matrix algebra, but the same structure is writable in pure loops: a neuron is an inner loop accumulating w*x, a layer an outer loop over neurons, and the network a chain of calls. The book also builds two training variants: the first walks through observations one at a time and adds up their individual gradients, while the second stacks all observations into matrices and computes the whole batch gradient in one sweep. Identical math; the difference is organization and speed.',
        },
        {
          ar: 'محرك المنصة minigrad يمنحك البنية نفسها مع ميزة إضافية: كل عدد مغلف بعقدة Value تحفظ قيمتها وتدرجها وتتذكر العمليات التي بُنيت منها، فنداء backward() يتجول في الرسم عكسيًا ويطبق قاعدة السلسلة تلقائيًا. المتاح لك: minigrad.MLP(nin, hiddens, seed) يبني طبقات مخفية بتفعيل relu وطبقة إخراج خطية، بتهيئة موزونة ببذرة LCG ثابتة — النتائج متطابقة في كل تشغيل. ودورة التدريب اليدوية أربع جمل: توقعات ثم loss = minigrad.mse(ys, preds) ثم model.zero_grad() وloss.backward() ثم تحديث p.data -= lr * p.grad لكل معامل.',
          en: 'The platform engine minigrad gives you the same structure plus one gift: every number is wrapped in a Value node that stores its data and gradient and remembers the operations that produced it, so a single backward() call walks the graph in reverse and applies the chain rule automatically. What you get: minigrad.MLP(nin, hiddens, seed) builds relu hidden layers and a linear output layer, initialized by a seeded LCG — results are identical on every run. The manual training cycle is four sentences: predictions, loss = minigrad.mse(ys, preds), then model.zero_grad() and loss.backward(), then update p.data -= lr * p.grad for every parameter.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'طبقة بحلقات بحتة — مرآة مصغرة لبنية الكتاب', en: 'A pure-loop layer — a miniature of the book\u2019s class design' },
      code: "class PureLayer:\n    \"\"\"One dense layer: linear map + optional ReLU, plain loops only.\"\"\"\n\n    def __init__(self, W, b, use_relu=True):\n        self.W = W            # nout rows x nin columns\n        self.b = b\n        self.use_relu = use_relu\n\n    def __call__(self, x):\n        out = []\n        for j in range(len(self.W)):\n            s = self.b[j]\n            for d in range(len(x)):\n                s += self.W[j][d] * x[d]\n            if self.use_relu and s < 0:\n                s = 0.0\n            out.append(s)\n        return out\n\nH = PureLayer([[0.8], [-1.2], [0.5]], [0.1, -0.2, 0.0], use_relu=True)\nO = PureLayer([[1.5, -0.7, 2.0]], [0.3], use_relu=False)\n\nxs = [[1.0], [2.0], [3.0], [4.0]]\nfor x in xs:\n    y = O(H(x))[0]\n    print('x=%.1f -> y=%.4f' % (x[0], y))",
      explanation: {
        ar: 'الصنف PureLayer مرآة مصغرة لبنية الكتاب: أوزان كصفوف، انحيازات كقائمة، ونداء الشبكة يحسب المجموع الموزون ثم التفعيل. الطبقة H فيها 3 عصبونات relu والطبقة O خطية بعصبون واحد، فالشبكة 1-3-1. على المدخلات 1..4 تُطبع التوقعات 2.6500 و4.8500 و7.0500 و9.2500: عند x=1.0 مثلًا تكون قيم الطبقة المخفية [0.9, 0.0, 0.5] (العصبون الثاني سالب فانطأ)، والمخرج 0.3 + 1.5·0.9 + 2.0·0.5 = 2.65. لا شيء هنا غير + و* ومقارنة — والشبكات الكبيرة نفس الوصفة موزعة على ملايين الأوزان.',
        en: 'PureLayer mirrors the book\u2019s class design in miniature: weights as rows, biases as a list, and a call that computes the weighted sum then the activation. Layer H holds 3 relu neurons and layer O is a single linear neuron, so the net is 1-3-1. On inputs 1..4 the printed predictions are 2.6500, 4.8500, 7.0500, 9.2500: at x=1.0 the hidden values are [0.9, 0.0, 0.5] (the second neuron is negative, so it zeroes out) and the output is 0.3 + 1.5·0.9 + 2.0·0.5 = 2.65. Nothing here but +, * and a comparison — big networks are the same recipe spread over millions of weights.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.scratch-forward',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل forward1(x0): شبكة 1-3-1 بأوزان معطاة كقيم حرفية — ثلاثة عصبونات مخفية بتفعيل ReLU ثم مخرج خطي واحد. أعد المخرج كعدد عائم. استخدم حلقات بحتة بلا مكتبات.',
        en: 'Complete forward1(x0): a 1-3-1 network with the given literal weights — three hidden neurons with ReLU, then one linear output. Return the output as a float. Use plain loops, no libraries.',
      },
      starterCode: "def forward1(x0):\n    # hidden layer: 3 ReLU neurons, then a linear output\n    w1 = [0.6, -0.4, 1.1]\n    b1 = [0.2, 0.3, -0.5]\n    w2 = [2.0, 0.5, -1.0]\n    b2 = 0.1\n    ...  # TODO: 3 hidden pre-activations s = b1[j] + w1[j] * x0, apply ReLU,\n    #      then the linear output b2 + w2[0]*h[0] + w2[1]*h[1] + w2[2]*h[2]\n",
      solution: "def forward1(x0):\n    # hidden layer: 3 ReLU neurons, then a linear output\n    w1 = [0.6, -0.4, 1.1]\n    b1 = [0.2, 0.3, -0.5]\n    w2 = [2.0, 0.5, -1.0]\n    b2 = 0.1\n    h = []\n    for j in range(3):\n        s = b1[j] + w1[j] * x0\n        h.append(s if s > 0 else 0.0)\n    return b2 + w2[0] * h[0] + w2[1] * h[1] + w2[2] * h[2]",
      tests: [
        {
          id: 't1',
          name: { ar: 'المخرج عند x0 = 1.0 يساوي 1.1', en: 'Output at x0 = 1.0 equals 1.1' },
          code: "assert abs(forward1(1.0) - 1.1) < 1e-9, 'expected 1.1 | actual: %r' % forward1(1.0)",
          expected: '1.1',
        },
        {
          id: 't2',
          name: { ar: 'المخرج عند x0 = 2.5 يساوي 1.25', en: 'Output at x0 = 2.5 equals 1.25' },
          code: "assert abs(forward1(2.5) - 1.25) < 1e-9, 'expected 1.25 | actual: %r' % forward1(2.5)",
          expected: '1.25',
        },
        {
          id: 't3',
          name: { ar: 'المخرجات عند 2.0 و4.0 تساوي 1.2 و1.4', en: 'Outputs at 2.0 and 4.0 equal 1.2 and 1.4' },
          code: "assert abs(forward1(2.0) - 1.2) < 1e-9, 'expected 1.2 | actual: %r' % forward1(2.0)\nassert abs(forward1(4.0) - 1.4) < 1e-9, 'expected 1.4 | actual: %r' % forward1(4.0)",
          expected: '1.2, 1.4',
        },
      ],
      hints: [
        { ar: 'ابنِ قائمة h بحلقة على j من 0 إلى 2: احسب s = b1[j] + w1[j] * x0 ثم ألحق s إذا كان s > 0 وإلا ألحق 0.0.', en: 'Build a list h with a loop over j in 0..2: compute s = b1[j] + w1[j] * x0, then append s if s > 0 else 0.0.' },
        { ar: 'المخرج الخطي بلا تفعيل: ابدأ من b2 وأضف حواصل الضرب w2[j] * h[j] للعصبونات الثلاثة.', en: 'The linear output has no activation: start from b2 and add the products w2[j] * h[j] for the three neurons.' },
        { ar: 'قيم تحقق: عند x0 = 2.0 تكون الطبقة المخفية [1.4, 0.0, 1.7] والمخرج 0.1 + 2.0·1.4 - 1.0·1.7 = 1.2.', en: 'Sanity value: at x0 = 2.0 the hidden layer is [1.4, 0.0, 1.7] and the output is 0.1 + 2.0·1.4 - 1.0·1.7 = 1.2.' },
        { ar: 'الاستبدال المختصر s if s > 0 else 0.0 يكتب ReLU في سطر واحد داخل append.', en: 'The shorthand s if s > 0 else 0.0 writes ReLU in one line inside append.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.minigrad-match',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الآن المحرك: أنشئ minigrad.MLP(1, [3], seed=11) واستخرج أوزانه إلى قوائم بحتة w1 وb1 وw2 وb2 (من .data للعقد)، ثم اكتب scratch_forward(x0) بحلقات بحتة تحاكي تمرير minigrad الأمامي نفسه. يجب أن يتطابق الطريقان على كل النقاط بفارق أقل من 1e-6 — فالحلقات والحلقات الملفوفة في Value تحسب الشيء نفسه.',
        en: 'Now the engine: build minigrad.MLP(1, [3], seed=11), extract its weights into plain lists w1, b1, w2, b2 (from each node\u2019s .data), then write scratch_forward(x0) in pure loops reproducing minigrad\u2019s forward pass exactly. Both routes must agree on every point to within 1e-6 — loops and Value-wrapped loops compute the same thing.',
      },
      starterCode: "import minigrad\n\nxs = [[1.0], [2.0], [3.0], [4.0]]\nmodel = minigrad.MLP(1, [3], seed=11)\nmg_out = [model(x).data for x in xs]\n\n# TODO 1: extract plain lists from the model:\n#   w1[j] = model.layers[0].neurons[j].w[0].data\n#   b1[j] = model.layers[0].neurons[j].b.data\n#   w2    = [p.data for p in model.layers[1].neurons[0].w]\n#   b2    = model.layers[1].neurons[0].b.data\n\n# TODO 2: def scratch_forward(x0): loops + ReLU + linear output, no minigrad\n\n# TODO 3: assert |scratch_forward(xs[k][0]) - mg_out[k]| < 1e-6 for all k\n",
      solution: "import minigrad\n\nxs = [[1.0], [2.0], [3.0], [4.0]]\nmodel = minigrad.MLP(1, [3], seed=11)\nmg_out = [model(x).data for x in xs]\n\nw1 = [n.w[0].data for n in model.layers[0].neurons]\nb1 = [n.b.data for n in model.layers[0].neurons]\nout_neuron = model.layers[1].neurons[0]\nw2 = [p.data for p in out_neuron.w]\nb2 = out_neuron.b.data\n\ndef scratch_forward(x0):\n    h = []\n    for j in range(3):\n        s = b1[j] + w1[j] * x0\n        h.append(s if s > 0 else 0.0)\n    s = b2\n    for j in range(3):\n        s += w2[j] * h[j]\n    return s\n\nmax_diff = 0.0\nfor k in range(4):\n    diff = abs(scratch_forward(xs[k][0]) - mg_out[k])\n    max_diff = max(max_diff, diff)\nprint('max |scratch - minigrad| =', max_diff)\nassert max_diff < 1e-6",
      tests: [
        {
          id: 't1',
          name: { ar: 'الاستخراج صحيح الأبعاد', en: 'Extraction has the right shapes' },
          code: "assert len(w1) == 3 and len(b1) == 3 and len(w2) == 3, 'w1=%r b1=%r w2=%r' % (w1, b1, w2)\nassert abs(w1[0] - model.layers[0].neurons[0].w[0].data) < 1e-12",
          expected: 'len(w1) == 3, len(w2) == 3',
        },
        {
          id: 't2',
          name: { ar: 'التطابق على النقاط الأربع تحت 1e-6', en: 'Match on the four points under 1e-6' },
          code: "for k in range(4):\n    assert abs(scratch_forward(xs[k][0]) - model(xs[k]).data) < 1e-6, 'mismatch at k=%d' % k",
          expected: 'all 4 diffs < 1e-6',
        },
        {
          id: 't3',
          name: { ar: 'تطابق صارم تحت 1e-12 على نقاط إضافية', en: 'Strict match under 1e-12 on extra points' },
          code: "for v in [0.0, -1.0, 2.5]:\n    assert abs(scratch_forward(v) - model([v]).data) < 1e-12, 'mismatch at %r' % v",
          expected: 'all diffs < 1e-12',
        },
      ],
      hints: [
        { ar: 'الطبقة الأولى في MLP(1, [3]) هي layer[0] وفيها neurons الثلاثة؛ عصبون واحد من مدخل واحد يعني w له عنصر واحد: n.w[0].data.', en: 'The first layer of MLP(1, [3]) is layers[0] with its three neurons; a one-input neuron has a single weight: n.w[0].data.' },
        { ar: 'طبقة الإخراج layer[1] فيها عصبون واحد: أوزانه الثلاثة out_neuron.w وانحيازه out_neuron.b — كلها عقد Value فخذ .data من كل واحدة.', en: 'The output layer layers[1] has one neuron: its three weights live in out_neuron.w and its bias in out_neuron.b — all Value nodes, so take .data from each.' },
        { ar: 'التمرير: h[j] = relu(b1[j] + w1[j] * x0) ثم المخرج b2 + مجموع w2[j] * h[j] — بالضبط ما تفعله minigrad داخل Neuron.__call__ وLayer.', en: 'The pass: h[j] = relu(b1[j] + w1[j] * x0), then output b2 + sum of w2[j] * h[j] — exactly what minigrad does inside Neuron.__call__ and Layer.' },
        { ar: 'الفرق المتوقع 0.0 بالضبط: نفس الأعداد ونفس ترتيب العمليات — فالتوكيد عند 1e-6 واسع جدًا، وتستطيع شدّه إلى 1e-12.', en: 'The expected diff is exactly 0.0: same numbers, same operation order — so the 1e-6 assert is generous, and you can tighten it to 1e-12.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.one-epoch',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'حقبة تدريب واحدة بيديك على البيانات الثابتة xs وys: احسب التوقعات والخسارة loss_before، ثم model.zero_grad() وloss.backward()، ثم حدّث كل معامل p.data -= lr * p.grad، ثم أعد الحساب واحفظ loss_after. بمعدل lr = 0.05 يجب أن تنخفض الخسارة من نحو 36.73 إلى نحو 24.42.',
        en: 'One training epoch, by hand, on the fixed xs and ys: compute predictions and loss_before, then model.zero_grad() and loss.backward(), then update every parameter p.data -= lr * p.grad, then recompute and store loss_after. With lr = 0.05 the loss should drop from about 36.73 to about 24.42.',
      },
      starterCode: "import minigrad\n\nxs = [[1.0], [2.0], [3.0], [4.0]]\nys = [2.0, 3.9, 6.2, 7.8]\nmodel = minigrad.MLP(1, [3], seed=11)\nlr = 0.05\n\npreds = [model(x) for x in xs]\nloss = minigrad.mse(ys, preds)\nloss_before = loss.data\n\n# TODO: model.zero_grad()\n# TODO: loss.backward()  -- the chain rule sweeps the graph\n# TODO: for p in model.parameters(): p.data -= lr * p.grad\n\npreds_after = [model(x) for x in xs]\nloss_after = minigrad.mse(ys, preds_after).data\nprint('loss before: %.6f' % loss_before)\nprint('loss after one epoch: %.6f' % loss_after)\n",
      solution: "import minigrad\n\nxs = [[1.0], [2.0], [3.0], [4.0]]\nys = [2.0, 3.9, 6.2, 7.8]\nmodel = minigrad.MLP(1, [3], seed=11)\nlr = 0.05\n\npreds = [model(x) for x in xs]\nloss = minigrad.mse(ys, preds)\nloss_before = loss.data\n\nmodel.zero_grad()\nloss.backward()\nfor p in model.parameters():\n    p.data -= lr * p.grad\n\npreds_after = [model(x) for x in xs]\nloss_after = minigrad.mse(ys, preds_after).data\nprint('loss before: %.6f' % loss_before)\nprint('loss after one epoch: %.6f' % loss_after)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الخسارة بعد الحقبة تطابق القيمة المتحقق منها', en: 'Post-epoch loss matches the verified value' },
          code: "assert abs(loss_after - 24.41809467848747) < 1e-6, 'expected ~24.418095 | actual: %r' % loss_after",
          expected: '24.418095',
        },
        {
          id: 't2',
          name: { ar: 'الخسارة انخفضت فعلًا', en: 'The loss genuinely decreased' },
          code: "assert loss_after < loss_before, 'expected decrease, got %r -> %r' % (loss_before, loss_after)",
          expected: 'loss_after < loss_before (36.725677 -> 24.418095)',
        },
        {
          id: 't3',
          name: { ar: 'الشبكة فيها 10 معاملات قابلة للتحديث', en: 'The network has 10 updatable parameters' },
          code: "assert len(model.parameters()) == 10, 'expected 10 parameters | actual: %r' % len(model.parameters())",
          expected: '10',
        },
      ],
      hints: [
        { ar: 'الترتيب إلزامي: zero_grad() أولًا (وإلا تراكمت تدرجات قديمة)، ثم backward()، ثم التحديث. لو عكست الترتيب فالتحديث سيستخدم تدرجات محسوبة على نموذج معدّل.', en: 'The order is mandatory: zero_grad() first (otherwise old gradients accumulate), then backward(), then the update. Reversing it would update with gradients of a half-updated model.' },
        { ar: 'التدرجات تتراكم داخل عقد Value (+=)، ولذلك يحتاج كل حقبة تصفيرًا جديدًا — back propagation لا يصفّر تلقائيًا.', en: 'Gradients accumulate inside Value nodes (+=), so every epoch needs a fresh zeroing — back propagation does not clear them for you.' },
        { ar: 'التحديث قفزة صغيرة في الاتجاه المعاكس للتدرج: p.data -= lr * p.grad — عدّل البيانات فقط، فالتدرج سيُعاد حسابه في الحقبة التالية.', en: 'The update is a small step against the gradient: p.data -= lr * p.grad — touch .data only; the gradient is recomputed next epoch.' },
        { ar: 'قيم تحقق: loss_before = 36.725677 وloss_after = 24.418095 (بذرة 11 وlr = 0.05) — إذا ظهرت أرقام أخرى فالمرجح أنك نسيت zero_grad أو استخدمت معاملات مغلفة بلا .data.', en: 'Sanity values: loss_before = 36.725677 and loss_after = 24.418095 (seed 11, lr = 0.05) — other numbers usually mean a skipped zero_grad or updating Value objects instead of .data.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا نستدعي model.zero_grad() قبل loss.backward() في كل حقبة؟',
            en: 'Why call model.zero_grad() before loss.backward() on every epoch?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن التدرجات تتراكم في عقد Value، وبلا تصفير تمتزج تدرجات الحقبة الحالية بقدمها', en: 'Because gradients accumulate in Value nodes; without zeroing, this epoch\u2019s gradients blend with stale ones' } },
            { id: 'b', text: { ar: 'لأن zero_grad يحرر الذاكرة المستخدمة برسم الحساب', en: 'Because zero_grad frees the memory used by the computation graph' } },
            { id: 'c', text: { ar: 'لأن backward يتطلب أن تكون البيانات معدومة القيمة قبل البدء', en: 'Because backward requires the data to be zero-valued before starting' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عمليات + في قاعدة السلسلة تتراكم (self.grad += ...) لأن العقدة الواحدة قد تؤثر في مخرجات عدة. التراكيب المتسلسلة لا تحتاج التراكم عمليًا، لكن المحرك العام يصفّر دائمًا قبل كل مسار عكسي لتجنب خلط الحقب.',
            en: 'The chain rule adds into nodes (self.grad += ...) because one node may influence several outputs. A straight chain does not strictly need it, but a general engine always zeroes before each backward sweep to keep epochs from mixing.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في نسخة الكتاب الأولى، ماذا تفعل الحلقة على الملاحظات أثناء التدريب؟',
            en: 'In the book\u2019s first (looping) variant, what does the loop over observations do during training?',
          },
          options: [
            { id: 'a', text: { ar: 'تدرّب شبكة منفصلة لكل ملاحظة على حدة', en: 'It trains a separate network per observation' } },
            { id: 'b', text: { ar: 'تحسب تدرج الخسارة لكل ملاحظة ثم تجمع التدرجات قبل تحديث الأوزان', en: 'It computes each observation\u2019s loss gradient and sums the gradients before updating the weights' } },
            { id: 'c', text: { ar: 'تحذف الملاحظات ذات الخسارة العالية', en: 'It discards the observations with the highest loss' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'لأن خسارة مجموعة البيانات مجموع خسائر الملاحظات، ومشتقة المجموع مجموع المشتقات، فالحلقة تجمع التدرجات الفردية ثم تحدّث الأوزان مرة واحدة. النسخة المصفوفية تحقق الجمع نفسه بمنتجات مصفوفية أسرع.',
            en: 'Since the dataset loss is the sum of per-observation losses, and the derivative of a sum is the sum of derivatives, the loop adds up individual gradients and updates the weights once. The matrix variant achieves the same sum faster with matrix products.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ماذا يعود نداء model(x) في minigrad؟',
            en: 'What does model(x) return in minigrad?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد float عاديًا بلا أي ارتباط برسم الحساب', en: 'A plain float, detached from any computation graph' } },
            { id: 'b', text: { ar: 'عقدة Value تحمل .data و.grad وبقيت موصولة برسم العمليات لكي يعمل backward', en: 'A Value node carrying .data and .grad, still wired into the operation graph so backward can work' } },
            { id: 'c', text: { ar: 'قائمة توقعات لكل الطبقات', en: 'A list of predictions from every layer' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المخرج عقدة Value من طبقة الإخراج الخطية: .data للتوقع و.grad لمكان التدرج، والارتباط بـ _prev هو رسم الحساب الذي يجتازه backward عكسيًا.لهذا نأخذ .data حين نريد العدد فقط — كما فعلنا عند استخراج الأوزان.',
            en: 'The output is a Value node from the linear output layer: .data is the prediction, .grad its gradient slot, and the _prev links form the computation graph that backward sweeps in reverse. That is why we read .data when we only want the number — as we did when extracting weights.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'بنية الكتاب تُستنسخ بحلقات بحتة: عصبون = مجموع موزون + ReLU، وطبقة = حلقة على العصبونات، والشبكة = تراكيب طبقات. النسختان في الكتاب (حلقة على الملاحظات مقابل مصفوفات) نفس الرياضيات بسرعتين مختلفتين.', en: 'The book\u2019s structure clones cleanly in pure loops: neuron = weighted sum + ReLU, layer = loop over neurons, network = composed layers. Its two variants (observation loop vs matrices) are the same math at different speeds.' },
        { ar: 'minigrad يلف كل عدد بعقدة Value تحفظ .data و.grad وتتذكر العمليات؛ MLP(nin, hiddens, seed) يبني شبكة relu + مخرج خطي بتهيئة LCG مزروعة البذرة فتتكرر النتائج حرفيًا.', en: 'minigrad wraps every number in a Value node holding .data and .grad and remembering operations; MLP(nin, hiddens, seed) builds a relu net with a linear output under a seeded LCG init, so results repeat exactly.' },
        { ar: 'دورة التدريب اليدوية: توقعات ← mse ← zero_grad ← backward ← تحديث p.data -= lr * p.grad. حقبة واحدة على بياناتنا خفضت الخسارة من 36.725677 إلى 24.418095.', en: 'The manual training cycle: predictions, mse, zero_grad, backward, update p.data -= lr * p.grad. One epoch on our data cut the loss from 36.725677 to 24.418095.' },
      ],
      reflectPrompt: {
        ar: 'استخرجنا الأوزان من minigrad إلى قوائم ثم أعدنا بناء التمرير الأمامي بحلقات وتطابق الناتج حتى 1e-12. ماذا يخبرك هذا التطابق التام عن علاقة "المحرك الذكي" بـ"الحلقة الغبية"؟ ومتى يصبح الفارق في السرعة حاسمًا؟',
        en: 'We lifted the weights out of minigrad into plain lists, rebuilt the forward pass in loops, and matched it to 1e-12. What does this exact agreement say about the relation between the "clever engine" and the "dumb loop" — and when does the speed gap start to matter?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch7.s2' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch7.s2' },
  ],
} satisfies Lesson;

export default lesson;
