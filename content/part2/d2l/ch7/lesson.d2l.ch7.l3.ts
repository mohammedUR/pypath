import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch7.l3 — "Pooling and LeNet"
 * التجميع وشبكة LeNet
 * Aligned with D2L ch7 s5 (Pooling) + s6 (Convolutional Neural Networks
 * (LeNet)). All expression is original — a paraphrase of the source's ideas,
 * never a verbatim translation. Runnable design: pool2d (max/avg) with
 * padding+stride on number grids, the invariance demo, and the LeNet-5 shape
 * trace with a verified 61706 parameter count. Every printed literal verified
 * under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch7.l3',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 7,
  title: {
    ar: 'التجميع وشبكة LeNet',
    en: 'Pooling and LeNet',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch7.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الكشف عن حافة يهتم بموقعها بدقة بكسل، لكن الإجابة عن «هل في الصورة قطة؟» لا تحتاج هذا الدقة إطلاقًا — الكائن قد يقفز بكسلًا يمينًا أو يسارًا دون أن يغيّر الجواب. طبقات التجميع تجمع المعلومات على نافذة بلا أي معاملات تتعلمها، فتمنع الترجمة الصغيرة من قلب النتائج وتصغّر الدقة. وفي هذا الدرس نجمع القطع كلها في أول CNN تاريخي: LeNet، ونقرأ بنيتها شكلًا شكلًا ومعاملًا معاملًا.',
        en: 'Edge detection cares about position down to the pixel, but answering \u201cis there a cat?\u201d needs none of that precision — the object may shift a pixel either way without changing the answer. Pooling layers aggregate over a window with zero learned parameters, so a tiny translation cannot flip the result while resolution drops. In this lesson we assemble everything into the first historical CNN: LeNet, reading it shape by shape and parameter by parameter.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تجميع بلا معاملات، ثم أول شبكة التفافية كاملة', en: 'Aggregating without parameters, then the first full CNN' },
      chunks: [
        {
          ar: 'طبقة التجميع تنزلق بنافذة ثابتة كما الالتفاف لكن بلا نواة: تحسب الأعظم أو المتوسط لكل نافذة — max-pooling يمنح درجة من عدم الترجمة (لو تحركت الحافة بكسلًا داخل النافذة يبقى الأعظم نفسه) وهو المفضل عمليًا، وaverage-pooling يخفّض الضجيج بمزج الجيران. قواعد الشكل كلها موروثة: الحشو والخطوة بنفس الصيغ، والافتراضي في المكتبات أن الخطوة = حجم النافذة. القنوات تعامل بحرص: كل قناة تُجمَّع منفصلة دون جمع عبر القنوات، فيبقى عدد قنوات المخرج = عدد قنوات المدخل — وهذا عكس الالتفاف الذي يمزج القنوات. نافذة 2×2 بخطوة 2 تُربّع الدقة المكانية في كل مرة.',
          en: 'A pooling layer slides a fixed window like convolution but with no kernel: it takes the maximum or the average of each window \u2014 max-pooling grants some translation invariance (if the edge shifts a pixel inside the window, the max is unchanged) and is the practical favorite, while average pooling denoises by blending neighbors. All shape rules carry over: padding and stride use the same formulas, and frameworks default the stride to the window size. Channels are treated carefully: each channel is pooled separately with no summing across channels, so output channels = input channels \u2014 unlike convolution, which mixes them. A 2\u00d72 window with stride 2 quarters the spatial resolution each time.',
        },
        {
          ar: 'LeNet-5 (LeCun، 1998) جزءان: مشفّر التفافي بطبقتين، ثم كتلة كثيفة بثلاث طبقات متصلة. كل وحدة التفاف بنواة 5×5 يليها sigmoid ثم متوسط 2×2 بخطوة 2 (كانت الأدوات المتاحة قبل ReLU وmax-pooling): الأولى 6 قنوات مع حشو 2 فيبقى 28×28، والثانية 16 قناة بلا حشو فتنزل إلى 10×10. ثم flatten إلى 400 وطبقات 120 و84 و10 للتصنيف العشري. المسار: 28×28 → 6×28×28 → 6×14×14 → 16×10×10 → 16×5×5 → 400 → 120 → 84 → 10. في الكتاب تُبنى عبر `nn.Sequential` مع تهيئة Xavier من `nn.init.xavier_uniform_` — وتقلص القنوات المرتفعة مع الدقة المنخفضة هو النمط الذي ستوسعه فصول قادمة.',
          en: 'LeNet-5 (LeCun, 1998) has two parts: a convolutional encoder of two layers, then a dense block of three fully connected layers. Each conv uses a 5\u00d75 kernel followed by sigmoid then 2\u00d72 average pooling with stride 2 (the available tools before ReLU and max-pooling): the first maps to 6 channels with padding 2 so 28\u00d728 survives, the second to 16 channels with no padding, dropping to 10\u00d710. Then flatten to 400 and layers of 120, 84 and 10 for the ten classes. The trace: 28\u00d728 \u2192 6\u00d728\u00d728 \u2192 6\u00d714\u00d714 \u2192 16\u00d710\u00d710 \u2192 16\u00d75\u00d75 \u2192 400 \u2192 120 \u2192 84 \u2192 10. In the book it is assembled with `nn.Sequential` plus Xavier init via `nn.init.xavier_uniform_` \u2014 growing channels while shrinking resolution, the pattern coming chapters will scale up.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'pool2d بأيدينا + تجربة عدم الترجمة + مسار LeNet ومعاملاته',
        en: 'Hand-rolled pool2d + an invariance experiment + the LeNet trace and parameter count',
      },
      code: "def pad_grid(X, p):\n    nh, nw = len(X), len(X[0])\n    out = [[0.0] * (nw + 2 * p) for _ in range(nh + 2 * p)]\n    for i in range(nh):\n        for j in range(nw):\n            out[i + p][j + p] = X[i][j]\n    return out\n\ndef pool2d(X, ph, pw, mode='max', pad=0, stride=1):\n    XP = pad_grid(X, pad) if pad else X\n    nh, nw = len(XP), len(XP[0])\n    Y = []\n    for i in range(0, nh - ph + 1, stride):\n        row = []\n        for j in range(0, nw - pw + 1, stride):\n            win = [XP[i + a][j + b] for a in range(ph) for b in range(pw)]\n            row.append(max(win) if mode == 'max' else sum(win) / len(win))\n        Y.append(row)\n    return Y\n\nX3 = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]\nprint('max:', pool2d(X3, 2, 2))\nprint('avg:', ['%.1f' % v for v in pool2d(X3, 2, 2, 'avg')[0]], ['%.1f' % v for v in pool2d(X3, 2, 2, 'avg')[1]])\n\nX4 = [[float(r * 4 + c) for c in range(4)] for r in range(4)]\nprint('window 3, pad 1, stride 2:', pool2d(X4, 3, 3, pad=1, stride=2))\nprint('framework default (stride = window):', pool2d(X4, 3, 3, stride=3))\n\n# ---- invariance: a bright block shifting one pixel is still caught ----\ndef bright_block(off_col):\n    G = [[0.0] * 6 for _ in range(6)]\n    for i in range(2, 4):\n        for j in range(off_col, off_col + 2):\n            G[i][j] = 9.0\n    return G\n\nfor tag, g in (('at col 2', bright_block(2)), ('at col 3', bright_block(3))):\n    print('%-9s -> pooled: %s' % (tag, pool2d(g, 2, 2, stride=2)))\n\n# ---- LeNet-5 shape trace and parameter count ----\ndef conv_out(n, k, p=0, s=1):\n    return (n - k + 2 * p) // s + 1\n\ndef conv_params(co, ci, k):\n    return co * (ci * k * k + 1)\n\ndef fc_params(nout, nin):\n    return nout * (nin + 1)\n\nn1 = conv_out(28, 5, p=2)\np1 = n1 // 2\nn2 = conv_out(p1, 5)\np2 = n2 // 2\nflat = 16 * p2 * p2\ntotal = (conv_params(6, 1, 5) + conv_params(16, 6, 5)\n         + fc_params(120, flat) + fc_params(84, 120) + fc_params(10, 84))\nprint('conv1 -> 6 x %d x %d' % (n1, n1))\nprint('pool1 -> 6 x %d x %d' % (p1, p1))\nprint('conv2 -> 16 x %d x %d' % (n2, n2))\nprint('pool2 -> 16 x %d x %d' % (p2, p2))\nprint('flatten -> %d' % flat)\nprint('params: conv 156 + 2416, fc %d + %d + %d -> total %d'\n      % (fc_params(120, flat), fc_params(84, 120), fc_params(10, 84), total))",
      explanation: {
        ar: 'على شبكة الكتاب يعطي max-pooling 2×2 المخرج [[4, 5], [7, 8]] لأن max(0, 1, 3, 4) = 4 وهكذا، والمتوسط [[2, 3], [5, 6]]. بنافذة 3 وحشو 1 وخطوة 2 على 4×4 نحصل على [[5, 7], [13, 15]] — النافذة الأولى تغطي صفًا وعمود حشو مع 0,1,4,5 فأعظمها 5. الكتلة المضيئة تظهر قيمة 9 في خريطة التجميع سواء وقفت عند العمود 2 أم انزاحت إلى 3 — الاكتشاف نجا من إزاحة بكسل واحد. مسار LeNet يؤكد أرقام الكتاب: 28 → 14 → 10 → 5 ثم 400، ومعاملاته 156 + 2416 + 48120 + 10164 + 850 = 61706 — أقل بعشرات الملايين من نظيرته المتصلة بالكامل.',
        en: 'On the book grid, 2\u00d72 max-pooling gives [[4, 5], [7, 8]] since max(0, 1, 3, 4) = 4 and so on, and averaging gives [[2, 3], [5, 6]]. With a 3\u00d73 window, padding 1 and stride 2 on the 4\u00d74 grid we get [[5, 7], [13, 15]] \u2014 the first window covers a padded row and column plus 0, 1, 4, 5, whose max is 5. The bright block shows value 9 in the pooled map whether it sits at column 2 or shifts to 3 \u2014 detection survived a one-pixel move. The LeNet trace confirms the book: 28 \u2192 14 \u2192 10 \u2192 5 then 400, with parameters 156 + 2416 + 48120 + 10164 + 850 = 61706 \u2014 tens of millions fewer than its fully connected counterpart.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.pool2d',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ pool2d(X, ph, pw, mode=\'max\', pad=0, stride=1): تجميع أعظمي أو متوسط (mode = \'max\' أو \'avg\') بنافذة ph×pw مع حشو أصفار متماثل pad على كل جانب وخطوة stride — بلا أي معاملات، والقنوات لو وجدت تُعالج منفصلة.',
        en: 'Implement pool2d(X, ph, pw, mode=\'max\', pad=0, stride=1): max or average aggregation (mode = \'max\' or \'avg\') over a ph\u00d7pw window with symmetric zero padding pad on each side and the given stride \u2014 no learned parameters; channels, if present, are pooled separately.',
      },
      starterCode: "def pool2d(X, ph, pw, mode='max', pad=0, stride=1):\n    ...  # TODO: optional zero-pad, then max()/avg() over each window\n",
      solution: "def pool2d(X, ph, pw, mode='max', pad=0, stride=1):\n    nh, nw = len(X), len(X[0])\n    if pad:\n        XP = [[0.0] * (nw + 2 * pad) for _ in range(nh + 2 * pad)]\n        for i in range(nh):\n            for j in range(nw):\n                XP[i + pad][j + pad] = X[i][j]\n    else:\n        XP = X\n    nh, nw = len(XP), len(XP[0])\n    Y = []\n    for i in range(0, nh - ph + 1, stride):\n        row = []\n        for j in range(0, nw - pw + 1, stride):\n            win = [XP[i + a][j + b] for a in range(ph) for b in range(pw)]\n            row.append(max(win) if mode == 'max' else sum(win) / len(win))\n        Y.append(row)\n    return Y",
      tests: [
        {
          id: 't1',
          name: { ar: 'شبكة الكتاب: أعظمي [[4, 5], [7, 8]]', en: 'Book grid: max [[4, 5], [7, 8]]' },
          code: "X = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]\nassert pool2d(X, 2, 2) == [[4.0, 5.0], [7.0, 8.0]], 'expected [[4.0, 5.0], [7.0, 8.0]] | actual: %r' % pool2d(X, 2, 2)",
          expected: '[[4.0, 5.0], [7.0, 8.0]]',
        },
        {
          id: 't2',
          name: { ar: 'المتوسط [[2, 3], [5, 6]]', en: 'Average [[2, 3], [5, 6]]' },
          code: "X = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]\nassert pool2d(X, 2, 2, 'avg') == [[2.0, 3.0], [5.0, 6.0]], 'expected [[2.0, 3.0], [5.0, 6.0]] | actual: %r' % pool2d(X, 2, 2, 'avg')",
          expected: '[[2.0, 3.0], [5.0, 6.0]]',
        },
        {
          id: 't3',
          name: { ar: 'حشو 1 وخطوة 2 على شبكة 4×4: [[5, 7], [13, 15]]', en: 'Padding 1, stride 2 on 4x4: [[5, 7], [13, 15]]' },
          code: "X4 = [[float(r * 4 + c) for c in range(4)] for r in range(4)]\nY = pool2d(X4, 3, 3, pad=1, stride=2)\nassert Y == [[5.0, 7.0], [13.0, 15.0]], 'expected [[5.0, 7.0], [13.0, 15.0]] | actual: %r' % (Y,)",
          expected: '[[5.0, 7.0], [13.0, 15.0]]',
        },
      ],
      hints: [
        { ar: 'الشكل: مدى الانزلاق range(0, n_pad − ph + 1, stride) صفًا وrange(0, n_pad − pw + 1, stride) عمودًا.', en: 'Shapes: slide over range(0, n_pad \u2212 ph + 1, stride) for rows and range(0, n_pad \u2212 pw + 1, stride) for columns.' },
        { ar: 'اجمع عناصر النافذة بقائمتين متداخلتين: [XP[i+a][j+b] for a in range(ph) for b in range(pw)] ثم max أو sum/len.', en: 'Collect the window with nested comprehensions: [XP[i+a][j+b] for a in range(ph) for b in range(pw)], then max or sum/len.' },
        { ar: 'الحشو المتماثل: p صفوف فوق وp أسفل — الشبكة المحشوة (n + 2p) × (n + 2p).', en: 'Symmetric padding: p rows above and p below \u2014 the padded grid is (n + 2p) \u00d7 (n + 2p).' },
        { ar: 'قيم تحقق: أول نافذة في t1 هي max(0, 1, 3, 4) = 4؛ وفي t3 أول نافذة تغطي الحشو + 0, 1, 4, 5 فيكون الأعظم 5.', en: 'Sanity: the first window in t1 is max(0, 1, 3, 4) = 4; in t3 the first window covers padding + 0, 1, 4, 5, whose max is 5.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-lenet-shapes',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الشيفرة (قاعدة شكل التفاف والتجميع لشبكة LeNet على مدخل 28×28) وتوقَّع مخرجها الكامل سطرًا سطرًا.',
        en: 'Read the code (the conv/pool shape rules applied to LeNet on a 28\u00d728 input) and predict its complete output, line by line.',
      },
      code: "def conv_out(n, k, p=0, s=1):\n    return (n - k + 2 * p) // s + 1\n\nn1 = conv_out(28, 5, p=2)\np1 = n1 // 2\nn2 = conv_out(p1, 5)\np2 = n2 // 2\nprint('conv1 -> 6 x %d x %d' % (n1, n1))\nprint('pool1 -> 6 x %d x %d' % (p1, p1))\nprint('conv2 -> 16 x %d x %d' % (n2, n2))\nprint('pool2 -> 16 x %d x %d' % (p2, p2))\nprint('flatten -> %d' % (16 * p2 * p2))",
      answer: 'conv1 -> 6 x 28 x 28\npool1 -> 6 x 14 x 14\nconv2 -> 16 x 10 x 10\npool2 -> 16 x 5 x 5\nflatten -> 400',
      solution: 'conv1 -> 6 x 28 x 28\npool1 -> 6 x 14 x 14\nconv2 -> 16 x 10 x 10\npool2 -> 16 x 5 x 5\nflatten -> 400',
      hints: [
        { ar: 'conv_out(n, 5, p=2) = (28 − 5 + 4)//1 + 1 = 28: الحشو 2 يعيد الحجم نفسه.', en: 'conv_out(n, 5, p=2) = (28 \u2212 5 + 4)//1 + 1 = 28: padding 2 restores the size.' },
        { ar: 'التجميع 2×2 بخطوة 2 ينصّف: 28 // 2 = 14.', en: 'A 2\u00d72 pool with stride 2 halves: 28 // 2 = 14.' },
        { ar: 'الالتفاف الثاني بلا حشو: (14 − 5 + 0)//1 + 1 = 10.', en: 'The second convolution has no padding: (14 \u2212 5 + 0)//1 + 1 = 10.' },
        { ar: 'flatten = 16 × 5 × 5 = 400.', en: 'flatten = 16 \u00d7 5 \u00d7 5 = 400.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def pool2d(X, ph, pw, mode='max', pad=0, stride=1):\n    nh, nw = len(X), len(X[0])\n    Y = []\n    for i in range(0, nh - ph + 1, stride):\n        row = []\n        for j in range(0, nw - pw + 1, stride):\n            win = [X[i + a][j + b] for a in range(ph) for b in range(pw)]\n            row.append(max(win) if mode == 'max' else sum(win) / len(win))\n        Y.append(row)\n    return Y\n\n# the book's edge detector output (6x8 image, white-black-white columns)\nimg = [[1.0] * 8 for _ in range(6)]\nfor i in range(6):\n    for j in range(2, 6):\n        img[i][j] = 0.0\ndef corr2d(X, K):\n    kh, kw = len(K), len(K[0])\n    return [[sum(X[i + a][j + b] * K[a][b] for a in range(kh) for b in range(kw))\n             for j in range(len(X[0]) - kw + 1)] for i in range(len(X) - kh + 1)]\n\nE = corr2d(img, [[1.0, -1.0]])\nprint('conv edge row0:', E[0])\nprint('max-pooled 2x2 row0:', pool2d(E, 2, 2)[0])\nprint('avg-pooled 2x2 row0:', ['%.2f' % v for v in pool2d(E, 2, 2, 'avg')[0]])\n\n# shift the image one column to the right: detection survives pooling\nshifted = [[0.0] * 8 for _ in range(6)]\nfor i in range(6):\n    for j in range(1, 3):\n        shifted[i][j] = 1.0\n    for j in range(3, 7):\n        shifted[i][j] = 0.0\nE2 = corr2d(shifted, [[1.0, -1.0]])\nprint('shifted conv row0:', E2[0])\nprint('shifted max-pooled row0:', pool2d(E2, 2, 2)[0])\n\n# جرّب: قارن avg وmax على خرج الحواف — أيهما يُبقي +1 و-1 بوضوح؟\n# try: compare avg vs max on the edge output - which keeps +1 and -1 crisp?\n# جرّب: نافذة 3×3 بخطوة 3 على شبكة 4×4 — كم تبلغ قيمة المخرج الوحيد ولماذا (خطوة = نافذة)؟\n# try: a 3x3 window with stride 3 on a 4x4 grid - what single output value do you get and why (stride = window)?\n",
      prompt: {
        ar: 'الملعب يمرر كاشف الحواف من درس l1 عبر التجميع: أعظمي يحافظ على نبضات +1 و−1 بوضوح، ومتوسط يذيبها في كسور؛ ثم يزيح الصورة عمودًا كاملًا لترى أن التجميع الأعظمي ما يزال يمسك الحافة بعد الإزاحة.',
        en: 'The sandbox pushes the l1 edge detector through pooling: max-pooling keeps the +1 and \u22121 pulses crisp while averaging melts them into fractions; then the image shifts a full column so you can watch max-pooling still catching the edge after the move.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'كم معاملًا قابلًا للتدريب في طبقة max-pooling 2×2؟',
            en: 'How many trainable parameters does a 2\u00d72 max-pooling layer have?',
          },
          options: [
            { id: 'a', text: { ar: '4 — واحد لكل عنصر في النافذة', en: '4 \u2014 one per window element' } },
            { id: 'b', text: { ar: 'صفر — العملية حتمية بلا نواة', en: 'Zero \u2014 the operation is deterministic with no kernel' } },
            { id: 'c', text: { ar: 'واحد لكل قناة مدخل', en: 'One per input channel' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التجميع مجرد دالة أعظم أو متوسط على النافذة — لا نواة ولا أوزان تتعلم ولا تهيئة، عكس الالتفاف الذي تحسب نواته من البيانات. هذا يخفض الحجم ويمنح ثباتًا للترجمة معًا.',
            en: 'Pooling is just a max or mean over the window \u2014 no kernel, no weights to learn, nothing to initialize, unlike convolution whose kernels are learned from data. It cuts size and adds translation robustness at zero cost.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'مدخل بـ 6 قنوات يمر عبر طبقة تجميع أعظمي 2×2: كم قناة مخرج تنتج؟',
            en: 'A 6-channel input goes through a 2\u00d72 max-pooling layer: how many output channels result?',
          },
          options: [
            { id: 'a', text: { ar: '6 — كل قناة تُجمَّع منفصلة', en: '6 \u2014 each channel is pooled separately' } },
            { id: 'b', text: { ar: '1 — القنوات تُجمع معًا', en: '1 \u2014 channels are summed together' } },
            { id: 'c', text: { ar: '12 — كل قناة تعطي قناتين', en: '12 \u2014 each channel yields two' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التجميع يعمل على كل قناة على حدة ولا يمزج بينها: عدد القنوات يبقى كما هو، بينما الارتفاع والعرض ينصفان. المزج عبر القنوات وظيفة الالتفاف وحده.',
            en: 'Pooling operates per channel and never mixes them: the channel count is preserved while height and width halve. Cross-channel mixing is exclusively convolution\u2019s job.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا تستخدم الطبقة التلافيفية الأولى في LeNet حشوًا 2 مع نواة 5×5 على مدخل 28×28؟',
            en: 'Why does LeNet\u2019s first convolution use padding 2 with a 5\u00d75 kernel on a 28\u00d728 input?',
          },
          options: [
            { id: 'a', text: { ar: 'لتكبير الصورة قبل المعالجة', en: 'To enlarge the image before processing' } },
            { id: 'b', text: { ar: 'لأن p = k − 1 = 4 منصفًا (2 لكل جانب) يحفظ البعد 28×28، فيظل الانكماش موزونًا على طبقات التجميع', en: 'Because p = k \u2212 1 = 4 split evenly (2 per side) preserves 28\u00d728, keeping the shrinkage under the pooling layers\u2019 control' } },
            { id: 'c', text: { ar: 'لتقليل عدد القنوات', en: 'To reduce the number of channels' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بدون الحشو لانخفض البعد فورًا إلى 24. بقاعدة p = k − 1 على نواة فردية يبقى المخرج 28×28 ويُترك الهبوط لطبقتي التجميع 2×2 (28 → 14 → 10 بعد الالتفاف الثاني بلا حشو → 5) — مسار منظم قابل للتنبؤ.',
            en: 'Without padding the dimension would drop to 24 immediately. With p = k \u2212 1 on an odd kernel the output stays 28\u00d728 and the shrinkage is left to the 2\u00d72 pooling layers (28 \u2192 14 \u2192 10 after the unpadded second conv \u2192 5) \u2014 an organized, predictable trace.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التجميع بلا معاملات: أعظم أو متوسط على نافذة، بقواعد الحشو والخطوة نفسها، ويُعالج كل قناة منفصلة فيبقى عددها، و2×2 بخطوة 2 تُربّع الدقة (الهدف من s5 التجميع).', en: 'Pooling has no parameters: max or mean over a window, reusing the same padding/stride rules, pooling each channel separately so its count survives, and 2\u00d72 with stride 2 quarters the resolution (goal of s5 Pooling).' },
        { ar: 'LeNet-5 أول CNN كامل: تلافيفان 5×5 (6 ثم 16 قناة) مع sigmoid ومتوسط 2×2، ثم flatten 400 وطبقات 120/84/10 — المسار 28→28→14→10→5→400 ومعامله 61706 فقط، وتهيئة Xavier عبر `nn.init.xavier_uniform_` (الهدف من s6 الشبكات التلافيفية LeNet).', en: 'LeNet-5, the first complete CNN: two 5\u00d75 convs (6 then 16 channels) with sigmoid and 2\u00d72 averaging, then flatten 400 and 120/84/10 layers \u2014 the trace 28\u219228\u219214\u219210\u21925\u2192400 with just 61706 parameters, Xavier-initialized via `nn.init.xavier_uniform_` (goal of s6 Convolutional Neural Networks (LeNet)).' },
      ],
      reflectPrompt: {
        ar: 'التجميع الأعظمي يتنازل عن معلومات الموقع مقابل ثبات الترجمة. في مهمة تعتمد الموقع فعليًا (قراءة لوحة أرقام سيارة مثلًا)، أين تنهار هذه المقايضة، وما البديل الذي يحفظ الموقع؟',
        en: 'Max-pooling trades away position for translation robustness. For a task where position truly matters (reading a license plate, say), where does that trade-off collapse \u2014 and what alternative preserves position?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch7.s5' },
        { book: 'D2L', section: 'd2l.ch7.s6' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch7.s5' },
    { book: 'D2L', section: 'd2l.ch7.s6' },
  ],
} satisfies Lesson;

export default lesson;
