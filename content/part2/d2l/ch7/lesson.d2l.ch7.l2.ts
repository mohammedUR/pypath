import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch7.l2 — "Padding, Stride, and Channels"
 * الحشو والخطوة والقنوات
 * Aligned with D2L ch7 s3 (Padding and Stride) + s4 (Multiple Input and
 * Multiple Output Channels). All expression is original — a paraphrase of the
 * source's ideas, never a verbatim translation. Runnable design: a padded,
 * strided conv2d over number grids with the shape formula, the book's
 * two-channel cross-correlation (56/72/104/120), stacked output channels
 * (K, K+1, K+2), and the 1x1-conv == per-pixel FC equivalence. Every printed
 * literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch7.l2',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 7,
  title: {
    ar: 'الحشو والخطوة والقنوات',
    en: 'Padding, Stride, and Channels',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch7.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'طبقات التفاف متتالية تأكل صورتك: عشر طبقات بنواة 5×5 تقلص صورة 240×240 إلى 200×200 وتلتهم أطرافها المعلوماتية. وللتحكم في هذا الانكماش — أو تعميده — لدينا أدوات بحجم ثلاثة: حشو يحمي الأطراف، وخطوة تقفز فوق مواقع لتصغير المخرج، وقنوات تجمع بين محلية الالتفاف وقوة الطبقات المتصلة. في هذا الدرس تحسب أشكال المخرجات بإصبعك وتنفذ التفافًا متعدد القنوات بحلقاتك أنت.',
        en: 'Successive conv layers eat your image: ten 5\u00d75 layers shrink a 240\u00d7240 picture to 200\u00d7200, obliterating boundary information. To control that shrinkage — or to embrace it — you have three tools: padding to protect the border, stride to jump locations and downsample, and channels to combine convolution locality with dense-layer power. In this lesson you compute output shapes by hand and implement multi-channel convolution with your own loops.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التحكم في الشكل ثم عمق القنوات', en: 'Controlling shape, then channel depth' },
      chunks: [
        {
          ar: 'الحشو padding يضيف صفوفًا وأعمدة من الأصفار حول المدخل: بإجمالي p_h صفوف وp_w أعمدة يصبح الشكل (n_h − k_h + p_h + 1) × (n_w − k_w + p_w + 1). الاختيار الشائع p_h = k_h − 1 وp_w = k_w − 1 يحفظ الحجم نفسه، ولأن النوى عمليًا فردية (1، 3، 5، 7) يُوزَّع الحشو بالتساوي على الجانبين ويصبح كل ناتج Y[i, j] محسوبًا من نافذة ممركزة على X[i, j] — وتُستخدم أطراف الصورة بالتساوي أيضًا. الخطوة stride تُحرّك النافذة أكثر من عنصر واحد للهبوط بالدقة، والصيغة العامة: ⌊(n_h − k_h + p_h + s_h)/s_h⌋ × ⌊(n_w − k_w + p_w + s_w)/s_w⌋؛ ومع p = k − 1 ومدخلات قابلة للقسمة تصير (n_h/s_h) × (n_w/s_w) — خطوة 2 تنصّف البعدَين.',
          en: 'Padding adds rows/columns of zeros around the input: with p_h total rows and p_w total columns the shape becomes (n_h \u2212 k_h + p_h + 1) \u00d7 (n_w \u2212 k_w + p_w + 1). The common choice p_h = k_h \u2212 1 and p_w = k_w \u2212 1 preserves size, and since kernels are practically odd (1, 3, 5, 7) padding splits evenly on both sides, making each Y[i, j] come from a window centered on X[i, j] — borders get used equally too. Stride moves the window more than one element per hop to downsample; the general formula: \u230a(n_h \u2212 k_h + p_h + s_h)/s_h\u230b \u00d7 \u230a(n_w \u2212 k_w + p_w + s_w)/s_w\u230b; with p = k \u2212 1 and divisible inputs it reduces to (n_h/s_h) \u00d7 (n_w/s_w) \u2014 stride 2 halves both dimensions.',
        },
        {
          ar: 'مع القنوات يصبح كل من المدخل والنواة ثلاثي الأبعاد: صورة RGB شكلها 3×h×w، فتحتاج النواة ci قناة مدخل كنواة k_h×k_w لكل قناة، وتُجمع النتائج على القنوات؛ ولكل قناة مخرج إضافية نواة كاملة، فيكون الشكل الكامل co×ci×k_h×k_w. التفاف 1×1 حالة خاصة: لا يرى الجوار المكاني إطلاقًا بل يمزج القنوات عند كل بكسل — طبقة متصلة بالكامل مطبقة على كل موقع بأوزان co×ci مشتركة، ويحفظ الشكل المكاني. الثمن: تكلفة الالتفاف O(h·w·k²·ci·co) — لصورة 256×256 بنواة 5×5 و128 قناة دخول وخروج نحو 26.8 مليار ضرب (≈ 53.7 مليار عملية مع الجمع)، وتصميمات لاحقة مثل ResNeXt ستخفف ذلك بتجميع القنوات.',
          en: 'With channels both input and kernel become 3-D: an RGB image is 3\u00d7h\u00d7w, so the kernel needs one k_h\u00d7k_w slice per input channel, with per-channel results summed; and each additional output channel gets its own full kernel, for a total shape of co\u00d7ci\u00d7k_h\u00d7k_w. A 1\u00d71 convolution is the special case: it sees no spatial neighborhood at all, mixing channels at each pixel — a fully connected layer applied per location with co\u00d7ci shared weights, preserving the spatial shape. The cost: convolution is O(h\u00b7w\u00b7k\u00b2\u00b7ci\u00b7co) \u2014 a 256\u00d7256 image with a 5\u00d75 kernel and 128 in/out channels needs about 26.8 billion multiplications (\u2248 53.7 billion ops counting additions), which later designs like ResNeXt trim via channel grouping.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'conv2d بحشو وخطوة + التفاف متعدد القنوات + تكافؤ 1×1',
        en: 'conv2d with padding and stride + multi-channel convolution + the 1x1 equivalence',
      },
      code: "def pad(X, ph, pw):\n    nh, nw = len(X), len(X[0])\n    top, left = ph // 2, pw // 2\n    out = [[0.0] * (nw + pw) for _ in range(nh + ph)]\n    for i in range(nh):\n        for j in range(nw):\n            out[i + top][j + left] = X[i][j]\n    return out\n\ndef conv2d(X, K, ph=0, pw=0, sh=1, sw=1):\n    kh, kw = len(K), len(K[0])\n    XP = pad(X, ph, pw) if (ph or pw) else X\n    nh, nw = len(XP), len(XP[0])\n    return [[sum(XP[i + a][j + b] * K[a][b] for a in range(kh) for b in range(kw))\n             for j in range(0, nw - kw + 1, sw)]\n            for i in range(0, nh - kh + 1, sh)]\n\ndef out_shape(n, k, p=0, s=1):\n    return (n - k + p + s) // s\n\nX3 = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]\nYp = conv2d(X3, [[0.0, 1.0], [2.0, 3.0]], ph=2, pw=2)\nprint('3x3 + pad 2 -> %dx%d, top-left %.1f' % (len(Yp), len(Yp[0]), Yp[0][0]))\nX8 = [[float(r * 8 + c) for c in range(8)] for r in range(8)]\nprint('shapes: (8,k3,p1)=%d  (8,k3,p1,s2)=%d  (8,k5,p2,s4)=%d' %\n      (out_shape(8, 3, 2), out_shape(8, 3, 2, 2), out_shape(8, 5, 2, 4)))\n\n# ---- multiple input channels: correlate per channel, sum over channels ----\ndef corr2d_multi_in(X, K):\n    ci, kh, kw = len(K), len(K[0]), len(K[0][0])\n    nh, nw = len(X[0]), len(X[0][0])\n    Y = [[0.0] * (nw - kw + 1) for _ in range(nh - kh + 1)]\n    for i in range(len(Y)):\n        for j in range(len(Y[0])):\n            Y[i][j] = sum(X[c][i + a][j + b] * K[c][a][b]\n                          for c in range(ci) for a in range(kh) for b in range(kw))\n    return Y\n\nXc = [[[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]],\n      [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]]]\nKc = [[[0.0, 1.0], [2.0, 3.0]], [[1.0, 2.0], [3.0, 4.0]]]\nprint('multi-in Y:', corr2d_multi_in(Xc, Kc))\nK3 = [Kc,\n      [[[v + 1.0 for v in row] for row in ch] for ch in Kc],\n      [[[v + 2.0 for v in row] for row in ch] for ch in Kc]]\nYo = [corr2d_multi_in(Xc, k) for k in K3]\nprint('multi-out Y[1]:', Yo[1])\nprint('multi-out Y[2]:', Yo[2])\n\n# ---- 1x1 conv == fully connected per pixel ----\ndef conv1x1(X, W):\n    co, ci = len(W), len(W[0])\n    h, w = len(X[0]), len(X[0][0])\n    return [[[sum(W[o][c] * X[c][i][j] for c in range(ci)) for j in range(w)]\n             for i in range(h)] for o in range(co)]\n\nW1x1 = [[0.5, -1.0, 2.0], [1.0, 0.0, 0.5]]\nXr = [[[1.0, 2.0], [3.0, 4.0]], [[5.0, 6.0], [7.0, 8.0]], [[9.0, 1.0], [2.0, 3.0]]]\nKk = []\nfor orow in W1x1:\n    kk = []\n    for w in orow:\n        kk.append([[w]])\n    Kk.append(kk)\nprint('1x1 == per-pixel FC:', conv1x1(Xr, W1x1) == [corr2d_multi_in(Xr, k) for k in Kk])\nprint('1x1 weights: co*ci = %d' % (2 * 3))\nops = 256 * 256 * 5 * 5 * 128 * 128\nprint('256x256, 5x5, 128->128: %d multiplications' % ops)",
      explanation: {
        ar: 'حشو 3×3 بإجمالي صفين وعمودين يعطي مخرج 4×4 وعنصره الأول 0 لأن النافذة تقع كليًا في الحشو. قاعدة الشكل تعيد أرقام الكتاب: (8، نواة 3، حشو 2) تبقى 8؛ وبخطوة 2 تنصّف إلى 4؛ وتمرين الكتاب (نواة 5، حشو عمودين، خطوة 4) يعطي 2. التفاف القناتين يجمع الارتباطين: أول عنصر (1×1 + 2×2 + 4×3 + 5×4) + (0×0 + 1×1 + 3×2 + 4×3) = 37 + 19 = 56، والمخرج الكامل [[56, 72], [104, 120]]؛ وتركيب ثلاث نوى K وK+1 وK+2 يعطي قنوات مخرج [[76, 100], [148, 172]] و[[96, 128], [192, 224]]. وتكافؤ 1×1 مع الطبقة المتصلة لكل بكسل يتحقق حرفيًا بعدد أوزان co×ci = 6 فقط، وحساب 256×256 بنواة 5×5 و128×128 قناة يعطي 26,843,545,600 ضربة.',
        en: 'Padding the 3\u00d73 grid with 2 total rows/columns gives a 4\u00d74 output whose top-left entry is 0 because the window lands entirely in the padding. The shape rule reproduces the book: (8, k3, p1) stays 8; with stride 2 it halves to 4; the book exercise (k5, 2 columns of padding, stride 4) gives 2. Two-channel convolution sums the per-channel correlations: the first element is (1\u00d71 + 2\u00d72 + 4\u00d73 + 5\u00d74) + (0\u00d70 + 1\u00d71 + 3\u00d72 + 4\u00d73) = 37 + 19 = 56, full output [[56, 72], [104, 120]]; stacking three kernels K, K+1, K+2 yields output channels [[76, 100], [148, 172]] and [[96, 128], [192, 224]]. The 1\u00d71 conv literally equals a per-pixel FC with just co\u00d7ci = 6 weights, and 256\u00d7256 with a 5\u00d75 kernel across 128\u00d7128 channels costs 26,843,545,600 multiplications.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.shapes-and-stride-conv',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين: out_shape(n, k, p=0, s=1) تُعيد ⌊(n − k + p + s)/s⌋ بعد أبعاد واحد؛ وconv2d(X, K, ph=0, pw=0, sh=1, sw=1) تنفذ الارتباط المتبادل بحشو إجمالي ph وpw (أنصاف على الجانبين) وخطوتين sh وsw — ph وpw إجمالي الحشو لا لكل جانب.',
        en: 'Implement two functions: out_shape(n, k, p=0, s=1) returning \u230a(n \u2212 k + p + s)/s\u230b for one dimension; and conv2d(X, K, ph=0, pw=0, sh=1, sw=1) computing cross-correlation with total padding ph and pw (halves on each side) and strides sh and sw \u2014 ph and pw are the total padding, not per side.',
      },
      starterCode: "def out_shape(n, k, p=0, s=1):\n    ...  # TODO: floor((n - k + p + s) / s)\n\ndef conv2d(X, K, ph=0, pw=0, sh=1, sw=1):\n    ...  # TODO: zero-pad, then slide the window with strides\n",
      solution: "def out_shape(n, k, p=0, s=1):\n    return (n - k + p + s) // s\n\ndef conv2d(X, K, ph=0, pw=0, sh=1, sw=1):\n    kh, kw = len(K), len(K[0])\n    nh, nw = len(X), len(X[0])\n    top, left = ph // 2, pw // 2\n    XP = [[0.0] * (nw + pw) for _ in range(nh + ph)]\n    for i in range(nh):\n        for j in range(nw):\n            XP[i + top][j + left] = X[i][j]\n    return [[sum(XP[i + a][j + b] * K[a][b] for a in range(kh) for b in range(kw))\n             for j in range(0, (nw + pw) - kw + 1, sw)]\n            for i in range(0, (nh + ph) - kh + 1, sh)]",
      tests: [
        {
          id: 't1',
          name: { ar: 'تمرين الكتاب: (3,5) حشو (0,2) خطوة (3,4) → 2×2', en: 'Book exercise: (3,5) kernel, padding (0,2), stride (3,4) -> 2x2' },
          code: "assert out_shape(8, 3, 0, 3) == 2, 'expected 2 | actual: %r' % out_shape(8, 3, 0, 3)\nassert out_shape(8, 5, 2, 4) == 2, 'expected 2 | actual: %r' % out_shape(8, 5, 2, 4)",
          expected: '2 and 2',
        },
        {
          id: 't2',
          name: { ar: 'حشو يحفظ الحجم: 8×8 بنواة 3 وحشو 2 يبقى 8×8', en: 'Padding preserves size: 8x8 with a 3x3 kernel and padding 2 stays 8x8' },
          code: "X8 = [[float(r * 8 + c) for c in range(8)] for r in range(8)]\nK3 = [[0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.0]]\nY = conv2d(X8, K3, ph=2, pw=2)\nassert (len(Y), len(Y[0])) == (8, 8), 'expected 8x8 | actual: %dx%d' % (len(Y), len(Y[0]))\nassert Y[3][3] == X8[3][3], 'centered window: Y[3][3] must equal X[3][3] | actual: %r' % Y[3][3]",
          expected: '8x8, identity at the center',
        },
        {
          id: 't3',
          name: { ar: 'الخطوة = أخذ عينات من مخرج الخطوة 1', en: 'Stride 2 = sampling the stride-1 output' },
          code: "X4 = [[float(r * 4 + c) for c in range(4)] for r in range(4)]\nK = [[0.0, 1.0], [2.0, 3.0]]\nYs = conv2d(X4, K, sh=2, sw=2)\nYd = [[sum(X4[i + a][j + b] * K[a][b] for a in range(2) for b in range(2)) for j in (0, 2)] for i in (0, 2)]\nassert Ys == Yd, 'expected %r | actual: %r' % (Yd, Ys)",
          expected: '[[24.0, 36.0], [72.0, 84.0]]',
        },
      ],
      hints: [
        { ar: '⌊(n − k + p + s)/s⌋ يعادل floor((n − k + p)/s) + 1 — استخدم القسمة الصحيحة //.  ', en: '\u230a(n \u2212 k + p + s)/s\u230b equals floor((n \u2212 k + p)/s) + 1 \u2014 use integer division //.' },
        { ar: 'القسمة العلوية للحشو: top = ph // 2 والباقي أسفل (نفس المنطق للأعمدة).', en: 'Split the padding: top = ph // 2, the remainder goes at the bottom (same for columns).' },
        { ar: 'مدى الانزلاق: range(0, n_padded − k + 1, s) — النافذة تبقى داخل المدخل المحشو.', en: 'Slide over range(0, n_padded \u2212 k + 1, s) \u2014 the window stays inside the padded input.' },
        { ar: 'قيم تحقق: (8، 3، 0، 3) و(8، 5، 2، 4) تعطي 2 و2؛ وفي t3 العنصر الأول 0×0 + 1×1 + 4×2 + 5×3 = 24 على الشبكة 4×4.', en: 'Sanity: (8, 3, 0, 3) and (8, 5, 2, 4) both give 2; in t3 the first element is 0\u00b70 + 1\u00b71 + 4\u00b72 + 5\u00b73 = 24 on the 4\u00d74 grid.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-1x1-conv',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'طبقة التفاف بنواة 1×1 وco = 8 قنوات مخرج وci = 32 قناة مدخل: ماذا تفعل بالضبط؟',
        en: 'A convolution layer with a 1\u00d71 kernel, co = 8 output channels and ci = 32 input channels: what exactly does it do?',
      },
      options: [
        { id: 'a', text: { ar: 'تكشف أنماطًا مكانية 1×1 في كل بكسل وتصغّر الارتفاع والعرض', en: 'It detects 1\u00d71 spatial patterns and shrinks height and width' } },
        { id: 'b', text: { ar: 'طبقة متصلة بالكامل على بُعد القنوات عند كل بكسل: تمزج 32 قناة في 8 بأوزان 8×32 مشتركة مع الحفاظ على الارتفاع والعرض', en: 'A fully connected layer across channels at each pixel: it mixes 32 channels into 8 with 8\u00d732 shared weights, keeping height and width' } },
        { id: 'c', text: { ar: 'تجمع القنوات الـ 32 كلها في قناة واحدة', en: 'It sums all 32 channels into a single channel' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'نافذة 1×1 لا تحتوي أي جار مكاني — كل الحساب على بُعد القنوات.', en: 'A 1\u00d71 window contains no spatial neighbor \u2014 all computation happens on the channel axis.' },
        { ar: 'الأوزان مرتبطة عبر المواقع: co×ci = 256 وزنًا فقط (+ انحياز)، والشكل المكاني h×w لا يتغير.', en: 'Weights are tied across locations: only co\u00d7ci = 256 weights (+ bias), and the h\u00d7w shape is unchanged.' },
        { ar: 'في الدرس تحققنا أنها تكافئ matmul على (co×ci)·(ci×h·w) — طبقة كثيفة لكل بكسل.', en: 'In the lesson we verified it equals a matmul of (co\u00d7ci)\u00b7(ci\u00d7h\u00b7w) \u2014 a dense layer per pixel.' },
        { ar: 'الجواب: b.', en: 'Answer: b.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def out_shape(n, k, p=0, s=1):\n    return (n - k + p + s) // s\n\n# the three shape knobs together\nfor k, p, s in ((3, 2, 1), (3, 2, 2), (5, 4, 1), (5, 4, 2), (7, 6, 3)):\n    n = 32\n    print('n=%d k=%d p=%d s=%d -> out=%d' % (n, k, p, s, out_shape(n, k, p, s)))\n\n# keep shrinking: ten 5x5 layers, no padding, on 240x240\nn = 240\nfor layer in range(10):\n    n = out_shape(n, 5)\n    if layer in (0, 4, 9):\n        print('after %d unpadded 5x5 layers: %d' % (layer + 1, n))\n\n# cost arithmetic: what doubles the bill?\nbase = 64 * 64 * 3 * 3 * 8 * 8\nprint('base cost 64x64 k3 8->8 :', base)\nprint('double ci and co        :', base * 4, '(4x)')\nprint('double the padding      :', base, '(unchanged: cost has no p term)')\n\n# جرّب: نواة 5×3 وحشو (4، 2) — لماذا يعيد ذلك الحجم 32×32 بالضبط؟\n# try: a 5x3 kernel with padding (4, 2) - why does that restore 32x32 exactly?\n# جرّب: عند أي خطوة s يصبح المخرج أقل من نصف المدخل رغم p = k - 1؟\n# try: at which stride s does the output drop below half the input even with p = k - 1?\n",
      prompt: {
        ar: 'الملعب يجمع أقراص الشكل الثلاثة (حجم النواة والحشو والخطوة) على شبكة 32×32، يعيد حساب تقلص 240×240 عبر عشر طبقات بلا حشو، ثم يحسب فاتورة التكلفة ويريك أثر مضاعفة القنوات مقابل مضاعفة الحشو.',
        en: 'The sandbox spins the three shape knobs (kernel, padding, stride) on a 32\u00d732 grid, recomputes the 240\u00d7240 shrinkage across ten unpadded 5\u00d75 layers, then prices the bill and shows what doubling channels vs doubling padding does to it.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'نواة 3×3: كم إجمالي الحشو المطلوب ليكون المخرج بحجم المدخل نفسه (خطوة 1)؟',
            en: 'A 3\u00d73 kernel: how much total padding keeps the output the same size as the input (stride 1)?',
          },
          options: [
            { id: 'a', text: { ar: 'p = 1 على جانب واحد فقط', en: 'p = 1 on one side only' } },
            { id: 'b', text: { ar: 'p = k − 1 = 2 إجمالًا، أي صف واحد وعمود واحد على كل جانب', en: 'p = k \u2212 1 = 2 in total, i.e. one row and one column on each side' } },
            { id: 'c', text: { ar: 'p = k = 3', en: 'p = k = 3' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشرط n − k + p + 1 = n يعطي p = k − 1 = 2 إجمالًا؛ ولأن k فردي يُقسم منصفًا (1 أعلى و1 أسفل و1 يسار و1 يمين) فتصبح كل نافذة ممركزة حول عنصرها وتُستخدم الأطراف بالتساوي.',
            en: 'Requiring n \u2212 k + p + 1 = n gives p = k \u2212 1 = 2 total; since k is odd it splits evenly (1 top, 1 bottom, 1 left, 1 right), centering every window on its element and using borders fairly.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'مدخل 64×64 ونواة 3×3 وحشو 2 وخطوة 2: ما شكل المخرج؟',
            en: 'A 64\u00d764 input, 3\u00d73 kernel, padding 2, stride 2: what is the output shape?',
          },
          options: [
            { id: 'a', text: { ar: '64×64', en: '64\u00d764' } },
            { id: 'b', text: { ar: '32×32', en: '32\u00d732' } },
            { id: 'c', text: { ar: '31×31', en: '31\u00d731' } },
          ],
          answer: 'b',
          explanation: {
            ar: '⌊(64 − 3 + 2 + 2)/2⌋ = ⌊65/2⌋ = 32 — ومع p = k − 1 ومدخل قابل للقسمة على الخطوة تصير القاعدة (n/s)×(n/s) تمامًا.',
            en: '\u230a(64 \u2212 3 + 2 + 2)/2\u230b = \u230a65/2\u230b = 32 \u2014 and with p = k \u2212 1 on a divisible input the rule collapses to (n/s)\u00d7(n/s) exactly.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'كم وزنًا (بلا انحياز) لطبقة التفاف بنواة 3×3 و4 قنوات مدخل و8 قنوات مخرج؟',
            en: 'How many weights (no bias) does a conv layer with a 3\u00d73 kernel, 4 input channels and 8 output channels have?',
          },
          options: [
            { id: 'a', text: { ar: '72', en: '72' } },
            { id: 'b', text: { ar: '288', en: '288' } },
            { id: 'c', text: { ar: '2880', en: '2880' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشكل الكامل للنواة co×ci×k_h×k_w = 8×4×3×3 = 288 — كل قناة مخرج تحصل على نواة كاملة عبر كل قنوات المدخل. ومع الانحياز تضاف 8.',
            en: 'The full kernel shape is co\u00d7ci\u00d7k_h\u00d7k_w = 8\u00d74\u00d73\u00d73 = 288 \u2014 each output channel owns a full kernel spanning all input channels. With bias, add 8.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الحشو يحمي الأطراف ويحفظ الحجم باختيار p = k − 1 (نوى فردية)، والخطوة تهبط بالدقة وفق ⌊(n − k + p + s)/s⌋ — وأقراص الشكل الثلاثة تكفي لتصميم أي سلسلة التفاف (الهدف من s3 الحشو والخطوة).', en: 'Padding protects borders and preserves size via p = k \u2212 1 (odd kernels); stride downsamples by \u230a(n \u2212 k + p + s)/s\u230b \u2014 the three shape knobs suffice to design any conv stack (goal of s3 Padding and Stride).' },
        { ar: 'القنوات: نواة co×ci×k×k تُجمع على قنوات المدخل وتُكدّس على قنوات المخرج، و1×1 = طبقة كثيفة لكل بكسل بأوزان co×ci، والفاتورة O(h·w·k²·ci·co) — 26.8 مليار ضربة لمثال الكتاب (الهدف من s4 قنوات المدخل والمخرج المتعددة).', en: 'Channels: a co\u00d7ci\u00d7k\u00d7k kernel sums over input channels and stacks over output channels; 1\u00d71 = a dense layer per pixel with co\u00d7ci weights; the bill is O(h\u00b7w\u00b7k\u00b2\u00b7ci\u00b7co) \u2014 26.8 billion multiplications for the book\u2019s example (goal of s4 Multiple Input and Multiple Output Channels).' },
      ],
      reflectPrompt: {
        ar: 'الحشو الصفري يمنح الشبكة أيضًا معلومات موقع ضمنية (تتعلم أين الفراغ). لو صممت شبكة تقرأ مستندات ماسحة، هل تفضل حشوًا يحفظ الحجم أم خطوة تقلص بسرعة — وعلى أي خاصية من طبيعة مستندك تبني القرار؟',
        en: 'Zero padding also smuggles in implicit position information (the net learns where the whitespace is). For a scanned-document reader, would you pick size-preserving padding or aggressive strides \u2014 and which property of documents would your decision rest on?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch7.s3' },
        { book: 'D2L', section: 'd2l.ch7.s4' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch7.s3' },
    { book: 'D2L', section: 'd2l.ch7.s4' },
  ],
} satisfies Lesson;

export default lesson;
