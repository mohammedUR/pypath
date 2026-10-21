import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch5.l2 — "Forward Propagation, Backward Propagation, and Initialization"
 * الانتشار الأمامي والخلفي وتهيئة المعاملات
 * Aligned with D2L ch5 s3 (Forward Propagation, Backward Propagation, and
 * Computational Graphs) + s4 (Numerical Stability and Initialization). All
 * expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: a full forward AND backward pass by
 * hand on a 2-2-1 net with sigmoid and L2 regularization, a numerical
 * gradient check, the Xavier formulas, and the vanishing-gradient product.
 * Every printed literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch5.l2',
  version: 1,
  part: 'II',
  track: 'A3',
  book: 'D2L',
  chapter: 5,
  title: {
    ar: 'الانتشار الأمامي والخلفي وتهيئة المعاملات',
    en: 'Forward/Backward Propagation and Initialization',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch5.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'منذ الدرس الأول نستدعي `y.backward()` ونكمل طريقنا وكأن السطر يفعل السحر. في هذا الدرس نفتح الصندوق: نحسب الانتشار الأمامي ثم الخلفي بأيدينا على شبكة صغيرة، رقمًا رقمًا، حتى نرى قاعدة السلسلة تعمل. ثم ننتقل إلى السؤال الذي يُسقط الشبكات العميقة قبل أن تتدرب: من أي توزيع نبدأ المعاملات؟ تهيئة سيئة تُبخّر التدرجات أو تفجّرها، وتهيئة جيدة تُبقيها في الحجم الصحيح.',
        en: 'Since the first lesson we have called `y.backward()` and moved on as if that line were magic. This lesson opens the box: we compute the forward and backward pass by hand on a small network, number by number, until we see the chain rule work. Then we tackle the question that sinks deep nets before training even starts: what distribution do we draw initial weights from? Poor initialization evaporates or detonates gradients; good initialization keeps them the right size.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من الرسم البياني إلى التدرجات', en: 'From the computational graph to gradients' },
      chunks: [
        {
          ar: 'الانتشار الأمامي هو حساب وتخزين كل متغير وسيط بالترتيب من المدخل إلى المخرج: z = W⁽¹⁾x ثم h = φ(z) ثم o = W⁽²⁾h، ثم الخسارة L = l(o, y) ودالة الهدف J = L + s حيث s = (λ/2)(‖W⁽¹⁾‖²F + ‖W⁽²⁾‖²F) حد التنظيم. الانتشار الخلفي يسير بالاتجاه المعاكس وفق قاعدة السلسلة: ∂J/∂W⁽²⁾ = ∂J/∂o·hᵀ + λW⁽²⁾، ثم ∂J/∂h = W⁽²⁾ᵀ∂J/∂o، و∂J/∂z = ∂J/∂h ⊙ φ′(z) لأن التنشيط عنصري، وأخيرًا ∂J/∂W⁽¹⁾ = ∂J/∂z·xᵀ + λW⁽¹⁾. التدريب يتناوب المسارين: الأمامي يخزّن القيم التي يعيد الخلفي استخدامها، ولهذا يتطلب التدريب ذاكرة أكبر بكثير من التنبؤ وحده.',
          en: 'Forward propagation calculates and stores every intermediate variable from input to output: z = W⁽¹⁾x, then h = φ(z), then o = W⁽²⁾h, then the loss L = l(o, y) and the objective J = L + s where s = (λ/2)(‖W⁽¹⁾‖²F + ‖W⁽²⁾‖²F) is the regularization term. Backpropagation walks the reverse direction with the chain rule: ∂J/∂W⁽²⁾ = ∂J/∂o·hᵀ + λW⁽²⁾, then ∂J/∂h = W⁽²⁾ᵀ∂J/∂o, then ∂J/∂z = ∂J/∂h ⊙ φ′(z) since the activation is elementwise, and finally ∂J/∂W⁽¹⁾ = ∂J/∂z·xᵀ + λW⁽¹⁾. Training alternates the two passes: the forward pass stores values the backward pass reuses, which is why training needs far more memory than plain prediction.',
        },
        {
          ar: 'في شبكة من L طبقات يكون تدرج الناتج بالنسبة لطبقة مبكرة جداء مصفوفات — فإذا كانت العوامل صغيرة تبخّر التدرج (vanishing) وإذا كانت كبيرة انفجر (exploding).sigmoid مشتبه أول: مشتقتها s(1−s) لا تتجاوز 0.25 وتقترب من الصفر عند طرفي المدى، فيتلاشى الجداء عبر الطبقات ما لم نبقَ في المنطقة الذهبية حول الصفر — لهذا صار ReLU الافتراضي. مشكلة أخرى: تهيئة كل الأوزان بالقيمة نفسها تجعل الوحدات الخفية توائمًا أبدًا لأن التدرجات تخرج متطابقة — يجب كسر التناظر بتهيئة تُسحب توزيعًا. توازن Xavier يقترح σ = √(2/(n_in + n_out)) للغاوسي، أي مدى ±√(6/(n_in + n_out)) للموحّد، فلا يتضخم تباين التفعيلات مع اتساع الطبقة ولا يتلاشى مع تضييقها.',
          en: 'In an L-layer network the gradient of the output with respect to an early layer is a product of matrices — small factors make it vanish, large ones make it explode. sigmoid is a prime suspect: its derivative s(1−s) never exceeds 0.25 and dies at both ends, so the product fades across layers unless every input stays in the golden zone near zero — hence ReLU as the default. Another trap: initializing all weights to the same constant keeps hidden units twins forever, since their gradients come out identical — symmetry must be broken by drawing weights from a distribution. Xavier balancing suggests σ = √(2/(n_in + n_out)) for a Gaussian, i.e. a uniform range of ±√(6/(n_in + n_out)), so activation variance neither balloons with width nor collapses.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'أمامي وخلفي باليد على شبكة 2-2-1 + فحص التدرج عدديًا + Xavier',
        en: 'A hand-run forward+backward on a 2-2-1 net + a numerical gradient check + Xavier',
      },
      code: "import math\n\ndef sigmoid(v):\n    return 1.0 / (1.0 + math.exp(-v))\n\nx = [1.0, -2.0]\nW1 = [[1.0, -0.5], [0.25, 2.0]]   # 2 hidden units x 2 inputs\nW2 = [1.0, -1.0]\ny = 1.0\nlam = 0.1\n\n# ---- forward: store everything ----\nz = [sum(W1[i][j] * x[j] for j in range(2)) for i in range(2)]\nh = [sigmoid(v) for v in z]\no = sum(W2[i] * h[i] for i in range(2))\nL = 0.5 * (o - y) ** 2\nnorm1 = sum(w * w for row in W1 for w in row)\nnorm2 = sum(w * w for w in W2)\ns = 0.5 * lam * (norm1 + norm2)\nJ = L + s\nprint('z=%s' % ['%.4f' % v for v in z])\nprint('h=%s' % ['%.4f' % v for v in h])\nprint('o=%.4f  L=%.6f  s=%.6f  J=%.6f' % (o, L, s, J))\n\n# ---- backward: reverse the chain ----\ndJ_do = o - y\ndW2 = [dJ_do * h[i] + lam * W2[i] for i in range(2)]\ndJ_dz = [W2[i] * dJ_do * h[i] * (1 - h[i]) for i in range(2)]\ndW1 = [[dJ_dz[i] * x[j] + lam * W1[i][j] for j in range(2)] for i in range(2)]\nprint('dJ/do=%.4f' % dJ_do)\nprint('dJ/dz=%s' % ['%.4f' % v for v in dJ_dz])\nprint('dW2=%s' % ['%.4f' % v for v in dW2])\nprint('dW1=%s' % [['%.4f' % v for v in row] for row in dW1])\n\n# ---- does the analytic gradient match finite differences? ----\ndef J_of(A, B):\n    zz = [sum(A[i][j] * x[j] for j in range(2)) for i in range(2)]\n    hh = [sigmoid(v) for v in zz]\n    oo = sum(B[i] * hh[i] for i in range(2))\n    return 0.5 * (oo - y) ** 2 + 0.05 * (sum(w * w for r in A for w in r) + sum(w * w for w in B))\n\neps = 1e-6\nWp = [row[:] for row in W1]; Wp[1][0] += eps\nWm = [row[:] for row in W1]; Wm[1][0] -= eps\nnum = (J_of(Wp, W2) - J_of(Wm, W2)) / (2 * eps)\nprint('numeric dW1[1][0]=%.8f  analytic=%.8f  diff=%.2e' % (num, dW1[1][0], abs(num - dW1[1][0])))\n\n# ---- Xavier bounds for this net and beyond ----\nprint('xavier: gauss sigma(2,2)=%.4f  uniform bound(2,2)=%.4f' % (math.sqrt(2.0 / 4.0), math.sqrt(6.0 / 4.0)))\nprint('xavier: gauss sigma(2,1)=%.4f' % math.sqrt(2.0 / 3.0))\n\n# ---- vanishing product: sigmoid'(z) across 4 deep layers ----\ngs = [sigmoid(v) * (1 - sigmoid(v)) for v in (4.0, -4.0, 3.0, -3.0)]\nprod = 1.0\nfor gv in gs:\n    prod *= gv\nprint('sig-grads=%s  product=%.3e  (0.25^5=%.10f)' % (['%.4f' % v for v in gs], prod, 0.25 ** 5))",
      explanation: {
        ar: 'الأمامي: z = [2.0, −3.75] ثم h = [0.8808, 0.0230] والناتج o = 0.8578 والخسارة L = 0.010108 وحد التنظيم s = 0.365625 والهدف J = 0.375733. الخلفي عكس السلسلة: ∂J/∂o = −0.1422 ثم dW2 = [−0.0252, −0.1033] وdW1 = [[0.0851, −0.0201], [0.0282, 0.1936]] — لاحظ إضافة حد λW في كل معامل. الفحص العددي بالفروق المركزية يطابق التحليلي بفارق ≈ 10⁻⁸ فالتشتق اليدوي صحيح. حدود Xavier لهذه الشبكة: σ = 0.7071 ومدى موحد ±1.2247. وجداء مشتقات sigmoid عبر أربع طبقات بعيدة عن الصفر يتهاوى إلى 6.4×10⁻⁷ — هذه هي كارثة التلاشي بالأرقام.',
        en: 'Forward: z = [2.0, −3.75], then h = [0.8808, 0.0230], output o = 0.8578, loss L = 0.010108, regularization s = 0.365625, objective J = 0.375733. Backward reverses the chain: ∂J/∂o = −0.1422, then dW2 = [−0.0252, −0.1033] and dW1 = [[0.0851, −0.0201], [0.0282, 0.1936]] — note the +λW term added to every parameter. The central-difference check matches the analytic gradient to ≈ 10⁻⁸, so the hand derivation is correct. Xavier bounds for this net: σ = 0.7071 and a uniform range of ±1.2247. And the product of sigmoid derivatives across four far-from-zero layers collapses to 6.4×10⁻⁷ — vanishing gradients in numbers.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.backward-by-hand',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ تمريرًا أماميًا وخلفيًا لشبكة بطبقة خفية واحدة بتنشيط sigmoid وخسارة تربيعية L = 0.5(o − y)² وحد تنظيم s = 0.5·λ·(‖W1‖²F + ‖W2‖²F): الدالة forward(x, W1, W2) تُعيد (o, h)، والدالة grads(x, y, W1, W2, lam) تُعيد (dW1, dW2) وفق المعادلات: ∂J/∂o = o − y، وdW2ᵢ = ∂J/∂o·hᵢ + λ·W2ᵢ، و∂J/∂zᵢ = W2ᵢ·∂J/∂o·hᵢ(1−hᵢ)، وdW1[i][j] = ∂J/∂zᵢ·x[j] + λ·W1[i][j].',
        en: 'Implement the forward and backward pass of a one-hidden-layer net with sigmoid activation, squared loss L = 0.5(o − y)\u00b2 and a regularizer s = 0.5·λ·(‖W1‖\u00b2F + ‖W2‖\u00b2F): forward(x, W1, W2) returns (o, h), and grads(x, y, W1, W2, lam) returns (dW1, dW2) using: ∂J/∂o = o − y, dW2\u1d62 = ∂J/∂o·h\u1d62 + λ·W2\u1d62, ∂J/∂z\u1d62 = W2\u1d62·∂J/∂o·h\u1d62(1−h\u1d62), dW1[i][j] = ∂J/∂z\u1d62·x[j] + λ·W1[i][j].',
      },
      starterCode: "import math\n\ndef sigmoid(v):\n    return 1.0 / (1.0 + math.exp(-v))\n\ndef forward(x, W1, W2):\n    ...  # TODO: z = W1 @ x, h = sigmoid(z), o = W2 . h -> return (o, h)\n\ndef grads(x, y, W1, W2, lam):\n    ...  # TODO: reverse the chain, add the +lam*W terms -> return (dW1, dW2)\n",
      solution: "import math\n\ndef sigmoid(v):\n    return 1.0 / (1.0 + math.exp(-v))\n\ndef forward(x, W1, W2):\n    z = [sum(W1[i][j] * x[j] for j in range(len(x))) for i in range(len(W1))]\n    h = [sigmoid(v) for v in z]\n    o = sum(W2[i] * h[i] for i in range(len(W2)))\n    return o, h\n\ndef grads(x, y, W1, W2, lam):\n    o, h = forward(x, W1, W2)\n    dJ_do = o - y\n    dW2 = [dJ_do * h[i] + lam * W2[i] for i in range(len(W2))]\n    dJ_dz = [W2[i] * dJ_do * h[i] * (1 - h[i]) for i in range(len(W2))]\n    dW1 = [[dJ_dz[i] * x[j] + lam * W1[i][j] for j in range(len(x))] for i in range(len(W1))]\n    return dW1, dW2",
      tests: [
        {
          id: 't1',
          name: { ar: 'الأمامي على شبكة الدرس', en: 'Forward on the lesson net' },
          code: "W1 = [[1.0, -0.5], [0.25, 2.0]]\no, h = forward([1.0, -2.0], W1, [1.0, -1.0])\nassert abs(o - 0.8578197081) < 1e-9, 'expected o=0.8578197081 | actual: %r' % o\nassert abs(h[0] - 0.8807970779778823) < 1e-9 and abs(h[1] - 0.022977369910025615) < 1e-9, 'expected h=[0.8808, 0.0230] | actual: %r' % (h,)",
          expected: 'o=0.8578197081, h=[0.8808, 0.0230]',
        },
        {
          id: 't2',
          name: { ar: 'التدرجات مع حد التنظيم', en: 'Gradients include the regularizer' },
          code: "W1 = [[1.0, -0.5], [0.25, 2.0]]\ndW1, dW2 = grads([1.0, -2.0], 1.0, W1, [1.0, -1.0], 0.1)\nassert abs(dW2[0] + 0.025231985679874114) < 1e-9, 'expected dW2[0]=-0.0252319857 | actual: %r' % dW2[0]\nassert abs(dW2[1] + 0.10326692916164029) < 1e-9, 'expected dW2[1]=-0.1032669292 | actual: %r' % dW2[1]\nassert abs(dW1[0][0] - 0.08507198137632702) < 1e-9, 'expected dW1[0][0]=0.0850719814 | actual: %r' % dW1[0][0]",
          expected: 'dW2=[-0.0252, -0.1033], dW1[0][0]=0.0851',
        },
        {
          id: 't3',
          name: { ar: 'التدرج التحليلي يطابق الفروق المركزية', en: 'Analytic gradient matches central differences' },
          code: "def J_ref(A, B):\n    o_, h_ = forward([1.0, -2.0], A, B)\n    n1 = sum(w * w for row in A for w in row)\n    n2 = sum(w * w for w in B)\n    return 0.5 * (o_ - 1.0) ** 2 + 0.05 * (n1 + n2)\n\nW1 = [[1.0, -0.5], [0.25, 2.0]]\nW2 = [1.0, -1.0]\ndW1, dW2 = grads([1.0, -2.0], 1.0, W1, W2, 0.1)\neps = 1e-6\nWp = [[1.0, -0.5], [0.25 + eps, 2.0]]\nWm = [[1.0, -0.5], [0.25 - eps, 2.0]]\nnum = (J_ref(Wp, W2) - J_ref(Wm, W2)) / (2 * eps)\nassert abs(num - dW1[1][0]) < 1e-6, 'numeric %r vs analytic %r' % (num, dW1[1][0])\nWp2 = W2[:]; Wp2[0] += eps\nWm2 = W2[:]; Wm2[0] -= eps\nnum2 = (J_ref(W1, Wp2) - J_ref(W1, Wm2)) / (2 * eps)\nassert abs(num2 - dW2[0]) < 1e-6, 'numeric %r vs analytic %r' % (num2, dW2[0])",
          expected: 'analytic == numeric (< 1e-6)',
        },
      ],
      hints: [
        { ar: 'z له طول عدد الوحدات الخفية: العنصر i هو Σⱼ W1[i][j]·x[j]؛ ثم h = sigmoid(z) والناتج Σ h[i]·W2[i].', en: 'z has one entry per hidden unit: entry i is Σ\u2c7c W1[i][j]·x[j]; then h = sigmoid(z) and the output is Σ h[i]·W2[i].' },
        { ar: '∂J/∂o = o − y لأن مشتقة 0.5(o−y)² هي (o−y) نفسها.', en: '∂J/∂o = o − y because the derivative of 0.5(o−y)\u00b2 is (o−y) itself.' },
        { ar: 'لا تنس حد λ·W في dW1 وdW2 — التنظيم جزء من J ويشتق مثل أي حد آخر.', en: 'Do not forget the λ·W term in dW1 and dW2 — the regularizer is part of J and differentiates like any other term.' },
        { ar: 'قيم تحقق على شبكة الدرس: o = 0.8578197081 وdW2 = [−0.0252, −0.1033] وdW1[0][0] = 0.0851.', en: 'Sanity on the lesson net: o = 0.8578197081, dW2 = [−0.0252, −0.1033], dW1[0][0] = 0.0851.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.xavier-bound',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'طبقة متصلة بالكامل لها n_in = 100 مدخلًا وn_out = 200 ناتجًا. وفق تهيئة Xavier الموحدة تُسحب الأوزان من U(−a, a). ما قيمة a (الحد الأعلى للمدى)؟ أعطِ الجواب بصيغة عشرية.',
        en: 'A fully connected layer has n_in = 100 inputs and n_out = 200 outputs. Under Xavier uniform initialization weights are drawn from U(−a, a). What is a (the range bound)? Answer as a decimal.',
      },
      answer: '0.1414213562373095',
      tolerance: 1e-6,
      solution: '0.1414213562373095',
      hints: [
        { ar: 'التوزيع الموحد U(−a, a) تباينه a²/3.', en: 'The uniform distribution U(−a, a) has variance a\u00b2/3.' },
        { ar: 'شرط Xavier: σ² = 2/(n_in + n_out)، ونساوي a²/3 = 2/(n_in + n_out).', en: 'The Xavier condition is σ\u00b2 = 2/(n_in + n_out); set a\u00b2/3 = 2/(n_in + n_out).' },
        { ar: 'إذن a = √(6/(n_in + n_out)) = √(6/300).', en: 'So a = √(6/(n_in + n_out)) = √(6/300).' },
        { ar: 'الجواب: a = 0.1414213562373095 (≈ 0.1414).', en: 'Answer: a = 0.1414213562373095 (≈ 0.1414).' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef sigmoid(v):\n    return 1.0 / (1.0 + math.exp(-v))\n\n# 1) the sigmoid derivative dies away from zero\nfor v in (-4.0, -1.0, 0.0, 1.0, 4.0):\n    s = sigmoid(v)\n    print(\"x=%5.1f  sig'(x)=%.5f\" % (v, s * (1 - s)))\n\n# 2) chain a product of layer factors: how deep can we go?\nprod = 1.0\nfor layer in range(1, 9):\n    prod *= 0.25          # worst-case sigmoid factor per layer\n    if layer % 2 == 0:\n        print('after %d saturated layers: factor=%.3e' % (layer, prod))\n\n# 3) symmetry: two hidden units with identical weights stay twins\nx = [1.0, -2.0]\nW1_same = [[0.5, 1.0], [0.5, 1.0]]   # both rows equal -> h[0] == h[1]\nW1_diff = [[0.5, 1.0], [-0.5, 0.25]]\nfor tag, W1 in (('same', W1_same), ('diff', W1_diff)):\n    z = [sum(W1[i][j] * x[j] for j in range(2)) for i in range(2)]\n    h = [sigmoid(v) for v in z]\n    print('%s rows -> z=%s h=%s' % (tag, ['%.4f' % v for v in z], ['%.4f' % v for v in h]))\n\n# جرّب: بدّل 0.25 بعامل ReLU (1 أو 0) وأعد حساب الجداء — لماذا يقي ReLU من التلاشي؟\n# try: replace 0.25 with a ReLU factor (1 or 0) and redo the product - why does ReLU resist vanishing?\n# جرّب: احسب σ لـ Xavier لطبقة n_in = 784 وn_out = 10، ثم المدى الموحد المقابل.\n# try: compute Xavier sigma for n_in = 784 and n_out = 10, then the matching uniform bound.\n",
      prompt: {
        ar: 'الملعب يقيس مشتقة sigmoid عند خمس نقاط، يضاعف أسوأ عامل (0.25) عبر طبقات حتى ترى الاختفاء الأسّي، ثم يعرض شبكة وحداتها توائم لترى أثر تهيئة متناظرة على التفعيلات.',
        en: 'The sandbox measures the sigmoid derivative at five points, multiplies the worst-case factor (0.25) across layers so you watch the exponential fade, then shows a network with twin units so you see what symmetric initialization does to activations.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يحتاج تدريب الشبكة العصبية ذاكرة أكبر بكثير من التنبؤ بها؟',
            en: 'Why does training a neural network need far more memory than prediction?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الأوزان تتضاعف أثناء التدريب', en: 'Because the weights multiply during training' } },
            { id: 'b', text: { ar: 'لأن الانتشار الخلفي يعيد استخدام القيم الوسيطة المخزنة أثناء الأمامي حتى تنتهي الحسابات', en: 'Because backpropagation reuses the intermediate values stored during the forward pass until it finishes' } },
            { id: 'c', text: { ar: 'لأن التنبؤ يخزن التدرجات أيضًا', en: 'Because prediction also stores gradients' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حجم القيم الوسيطة يتناسب مع عدد الطبقات وحجم الدفعة، ويجب إبقاؤها حتى يكتمل الانتشار الخلفي — لهذا تتضاعف الحاجة للذاكرة مع الشبكات الأعمق والدفعات الأكبر.',
            en: 'Intermediate values scale with the number of layers and the batch size and must be kept until backpropagation completes — which is why memory needs balloon for deeper nets and larger batches.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'بأي ترتيب يحسب الانتشار الخلفي تدرجات المعاملات؟',
            en: 'In what order does backpropagation compute parameter gradients?',
          },
          options: [
            { id: 'a', text: { ar: 'بالترتيب نفسه الذي يسير به الانتشار الأمامي', en: 'In the same order as the forward pass' } },
            { id: 'b', text: { ar: 'بترتيب عشوائي يعتمد على الدفعة', en: 'In a batch-dependent arbitrary order' } },
            { id: 'c', text: { ar: 'بالترتيب المعاكس: من المخرج نحو المدخل وفق قاعدة السلسلة', en: 'The reverse order: from output toward input via the chain rule' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'نبدأ من ∂J/∂L ثم ∂J/∂o ف∂J/∂h ف∂J/∂z وصولًا إلى W⁽¹⁾ — كل تدرج يعتمد على ما بعده، فيلزم السير من النهاية إلى البداية مع تخزين النتائج الوسيطة.',
            en: 'We start from ∂J/∂L, then ∂J/∂o, then ∂J/∂h, then ∂J/∂z down to W⁽¹⁾ — each gradient depends on the next, so we must walk from the end to the beginning, storing intermediates.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما الذي يحققه اختيار σ = √(2/(n_in + n_out)) في تهيئة Xavier؟',
            en: 'What does choosing σ = √(2/(n_in + n_out)) achieve in Xavier initialization?',
          },
          options: [
            { id: 'a', text: { ar: 'جعل تباين التفعيلات والتدرجات مستقلًا تقريبًا عن عدد مدخلات الطبقة ومخرجاتها', en: 'Keeping activation and gradient variance roughly independent of a layer\u2019s input and output counts' } },
            { id: 'b', text: { ar: 'ضمان أن تكون كل الأوزان موجبة', en: 'Guaranteeing all weights stay positive' } },
            { id: 'c', text: { ar: 'تسريع التنبؤ لا التدريب', en: 'Speeding up prediction, not training' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'شرط الأمامي يطلب n_in·σ² = 1 وشرط الخلفي n_out·σ² = 1، ولا يمكن تحقيقهما معًا فيوسط Xavier بينهما بـ σ² = 2/(n_in + n_out) فلا يتضخم التباين في الطبقات الواسعة ولا يتلاشى في الضيقة.',
            en: 'The forward condition wants n_in·σ\u00b2 = 1 and the backward one n_out·σ\u00b2 = 1; both cannot hold at once, so Xavier splits the difference with σ\u00b2 = 2/(n_in + n_out), keeping variance stable in wide and narrow layers alike.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الانتشار الأمامي يحسب ويخزّن z وh وo وL والهدف J = L + s؛ والانتشار الخلفي يعكس السلسلة: ∂J/∂W⁽²⁾ = ∂J/∂o·hᵀ + λW⁽²⁾ ثم ∂J/∂z = ∂J/∂h ⊙ φ′(z) — وإعادة استخدام المخزون هي سبب ذاكرة التدريب (الهدف من s3 الانتشار الأمامي والخلفي والرسوم البيانية الحسابية).', en: 'Forward computes and stores z, h, o, L and the objective J = L + s; backward reverses the chain: ∂J/∂W⁽²⁾ = ∂J/∂o·hᵀ + λW⁽²⁾ then ∂J/∂z = ∂J/∂h ⊙ φ′(z) — reuse of stored values is why training needs memory (goal of s3 Forward Propagation, Backward Propagation, and Computational Graphs).' },
        { ar: 'تدرج شبكة عميقة جداء عوامل: sigmoid بمشتقته ≤ 0.25 يُتبخر، والتهيئة المتناظرة تُبقي الوحدات توائمًا؛ وXavier σ = √(2/(n_in + n_out)) (موحد ±√(6/(n_in + n_out))) يوازن التباين بين الأمام والخلف (الهدف من s4 الاستقرار العددي والتهيئة).', en: 'A deep net gradient is a product of factors: sigmoid (derivative ≤ 0.25) evaporates it, symmetric initialization keeps units twins; Xavier σ = √(2/(n_in + n_out)) (uniform ±√(6/(n_in + n_out))) balances variance between forward and backward (goal of s4 Numerical Stability and Initialization).' },
      ],
      reflectPrompt: {
        ar: 'أثبت الفحص العددي أن تشتقنا اليدوي صحيح حتى 10⁻⁸. فإذا كان إطار العمل يحسب التدرجات تلقائيًا وهكذا، متى يظل فهم المعادلات نفسه هو الفارق بين نموذج يتدرب وآخر لا يتحرك؟',
        en: 'The numerical check proved our hand derivation correct to 10⁻⁸. Given that frameworks compute gradients automatically like this, when does understanding the equations themselves become the difference between a model that trains and one that never moves?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch5.s3' },
        { book: 'D2L', section: 'd2l.ch5.s4' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch5.s3' },
    { book: 'D2L', section: 'd2l.ch5.s4' },
  ],
} satisfies Lesson;

export default lesson;
