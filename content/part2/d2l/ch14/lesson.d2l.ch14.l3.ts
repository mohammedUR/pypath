import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch14.l3 — "From Detection Datasets to SSD and R-CNNs"
 * من مجموعة بيانات الكشف إلى SSD وR-CNN
 * Aligned with D2L ch14 s6 (The Object Detection Dataset) + s7 (Single Shot
 * Multibox Detection) + s8 (Region-based CNNs). Original paraphrase throughout.
 * Runnable design: detection label-row scaling, the TinySSD anchor/prediction
 * channel tables verified arithmetically, the R-CNN stage-cost comparison, and
 * RoI pooling by hand with floor/ceil subwindow boundaries. Every literal
 * verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch14.l3',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 14,
  title: {
    ar: 'من مجموعة بيانات الكشف إلى SSD وR-CNN',
    en: 'From Detection Datasets to SSD and R-CNNs',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch14.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'بنينا كل مكوّنات الكشف — صناديق ومراسٍ ومقاييس — والآن نجمعها في نموذجين حقيقيين: SSD الذي يتنبأ بالكل في تمريرة واحدة، وعائلة R-CNN التي تقترح مناطق أولًا ثم تصنّفها. وسنبدأ من أصغر شيء: كيف يبدو صف تسمية لصورة واحدة في مجموعة كشف؟',
        en: 'We built every detection ingredient — boxes, anchors, scales — and now we assemble them into two real models: SSD, which predicts everything in a single pass, and the R-CNN family, which proposes regions first and classifies them after. But we start from the smallest thing: what does one image\u2019s label row look like in a detection dataset?',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'بيانات الكشف ثم نموذجان لكشفه', en: 'Detection data, then two detectors' },
      chunks: [
        {
          ar: 'لا توجد مجموعة صغيرة جاهزة للكشف مثل MNIST، لذا جمع الكتاب مجموعة الموز: 1000 صورة تدريب و100 تحقق بحجم 256×256، موزّة واحدة في كل صورة. كل تسمية خمسة أرقام: الصنف ثم ركنانا، مقسومة على 256 لتقع بين 0 و1. توصيف الدفعة يكون (حجم الدفعة، m، 5) حيث m أكبر عدد صناديق في صورة من المجموعة — الصور الأقل تُحشى بصناديق غير شرعية صنفها −1 تُصفّى من الخسارة.',
          en: 'No MNIST-style small dataset exists for detection, so the book curated a banana set: 1000 training and 100 validation images of 256×256, one banana per image. Each label is five numbers — class then two corners — divided by 256 to land in 0..1. A batch has shape (batch size, m, 5) where m is the largest box count any image has; shorter images get illegal padding boxes of class −1, filtered out of the loss.',
        },
        {
          ar: 'SSD (الكشف متعدد الصناديق بلقطة واحدة) شبكة أساس تستخرج الملامح تليها كتل تقلص الأبعاد للنصف. عند كل مقياس تتنبأ قناتان تلافيفيتان 3×3 بحشوة 1: مصنّف بـ a(q+1) قناة (q أصناف + خلفية) ومتنبئ صناديق بـ a×4 قناة. كتلة التقليص طبقتا تلافيف 3×3 بحشوة 1 ثم تجميع أقصى 2×2، فتضاعف الحقل الاستقبالي إلى 6×6. الشبكة الأساس ثلاث كتل تُنزل 256×256 إلى 32×32، ثم ثلاث كتل أخرى حتى 1×1: خمسة مقاييس.',
          en: 'SSD (single shot multibox detection) is a base feature network followed by blocks that halve the spatial size. At each scale two 3×3 convolutional predictors with padding 1 emit classes and boxes: a(q+1) channels (q classes + background) and a×4 channels. Each downsampling block is two 3×3 convs with padding 1 then a 2×2 max-pool, growing the receptive field to 6×6. A three-block base network takes 256×256 down to 32×32; three more blocks end at 1×1: five scales in total.',
        },
        {
          ar: 'بإعداد الكتاب يولَّد 4 مراسٍ لكل وحدة (مقياسان + 3 نسب − 1)، فعلى المقاييس الخمسة (32² + 16² + 8² + 4² + 1)×4 = 5444 مرساة لكل صورة. سلّم المقاييس يوزّع الفترة 0.2 إلى 1.05 على خمس خطوات: 0.2, 0.37, 0.54, 0.71, 0.88، والقيمة الكبرى لكل زوج جذر حاصل ضربهما (√(0.2×0.37) ≈ 0.272 وهكذا). الخسارة جمع جزأين: إنتروبيا متقاطعة للأصناف ومتوسط فرق مطلق L1 للإزاحات مع قناع يصفّر سالبات الحشو.',
          en: 'With the book\u2019s settings 4 anchors are generated per unit (two sizes + three ratios − 1), so the five scales hold (32² + 16² + 8² + 4² + 1)×4 = 5444 anchors per image. The scale ladder spreads 0.2 to 1.05 over five steps: 0.2, 0.37, 0.54, 0.71, 0.88, each pair\u2019s larger value being the square root of their product (√(0.2×0.37) ≈ 0.272 and so on). The loss adds two parts: cross-entropy for classes and an L1 mean absolute error for offsets, masked so padding negatives contribute zero.',
        },
        {
          ar: 'عائلة R-CNN تسير اتجاهًا معاكسًا: R-CNN يقترح نحو 2000 منطقة بالبحث الانتقائي ثم يمرر كل منطقة عبر CNN المستخرَجة من تدريب مسبق ويصنفها بآلات متجهات داعمة وينحّي صناديقها بالانحدار الخطي — ألفا ممريرة لكل صورة، بطيء جدًا. Fast R-CNN يمرر الصورة كاملة مرة واحدة ويقصّ مناطق الاهتمام بطبقة تجميع RoI إلى أشكال متساوية. Faster R-CNN يستبدل البحث الانتقائي بشبكة اقتراح مناطق مُدرَّبة مشتركة، وMask R-CNN يضيف فرعًا لكل بكسل عبر محاذاة RoI باستيفاء ثنائي.',
          en: 'The R-CNN family runs the opposite way: R-CNN proposes ~2000 regions via selective search, then runs each through a pretrained CNN, classifies with SVMs, and regresses boxes — thousands of passes per image, very slow. Fast R-CNN runs the whole image once and crops regions of interest into equal shapes with an RoI pooling layer. Faster R-CNN swaps selective search for a jointly trained region proposal network, and Mask R-CNN adds a per-pixel branch using RoI alignment with bilinear interpolation.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'صف تسمية + جدول SSD الحسابي + تجميع RoI يدويًا',
        en: 'A label row + the SSD arithmetic table + RoI pooling by hand',
      },
      code: "# s6: a detection label row (class + corners, scaled to 0..1 by /256)\nraw = [20, 40, 200, 220]                       # pixel corners on a 256x256 image\nlabel = [0] + [v / 256 for v in raw]           # class 0 = banana\nprint('label row (m=1):', label)\n\n# s7: the TinySSD anchor and prediction tables at 256x256 input\nlayers = [32, 16, 8, 4, 1]                     # feature-map side per block\na = 4                                          # anchors per unit (2 sizes + 3 ratios - 1)\nunits = [s * s for s in layers]\nanchors = [u * a for u in units]\nprint('units  :', units)\nprint('anchors:', anchors, 'total', sum(anchors))\n\nq = 1                                          # banana = one object class\ncls_channels = a * (q + 1)                     # +1 for background\ncls_flat = [u * cls_channels for u in units]\nprint('cls channels/unit:', cls_channels)\nprint('cls flat          :', cls_flat, 'total', sum(cls_flat))\nprint('bbox flat total   :', sum(anchors) * 4)\n\nimport math\nlo = [0.2, 0.37, 0.54, 0.71, 0.88]\nhi = [round(math.sqrt(lo[i] * (lo[i + 1] if i < 4 else 1.05)), 3) for i in range(5)]\nprint('scale pairs:', list(zip(lo, hi)))\n\n# s8: R-CNN stage cost + RoI pooling by hand (ceil subwindow boundaries)\nprint('R-CNN CNN passes per image:', 2000)\nprint('Fast R-CNN CNN passes     :', 1)\n\ndef roi_pool_2x2(X, r0, r1, c0, c1):\n    H, W = r1 - r0, c1 - c0\n    out = []\n    for i in range(2):\n        rr0 = r0 + (i * H) // 2                # floor boundary\n        rr1 = r0 + -(-((i + 1) * H) // 2)      # ceil boundary\n        row = []\n        for j in range(2):\n            cc0 = c0 + (j * W) // 2\n            cc1 = c0 + -(-((j + 1) * W) // 2)\n            row.append(max(X[r][c] for r in range(rr0, rr1) for c in range(cc0, cc1)))\n        out.append(row)\n    return out\n\nX = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]]\nprint('RoI 3x3 at (0,0) ->', roi_pool_2x2(X, 0, 3, 0, 3))\nprint('RoI 3x4 at (1,0) ->', roi_pool_2x2(X, 1, 4, 0, 4))",
      explanation: {
        ar: 'صف التسمية يحوّل الركنان البكسليين [20, 40, 200, 220] إلى [0.078125, 0.15625, 0.78125, 0.859375] بعد القسمة على 256. جدول SSD: وحدات [1024, 256, 64, 16, 1] تحمل 4096 و1024 و256 و64 و4 مراسي — 5444 مجتمعة؛ قنوات التصنيف 4×(1+1)=8 لكل وحدة أي 8192 و2048 و512 و128 و8 = 10888 قيمة صنف، و5444×4 = 21776 قيمة إزاحة. أزواج المقاييس تخرج [0.272, 0.447, 0.619, 0.79, 0.961] كما في الكتاب. تجميع RoI: نافذة 3×3 عند الزاوية تقسم إلى نوافذ فرعية بحدود أرضية وسقفية فتخرج [[5, 6], [9, 10]]، ونافذة 3×4 عند الصف 1 تخرج [[9, 11], [13, 15]] — الناتجان نفسهما في تجربة `torchvision.ops.roi_pool` بالكتاب، مع ممريرة CNN واحدة بدل 2000.',
        en: 'The label row converts pixel corners [20, 40, 200, 220] into [0.078125, 0.15625, 0.78125, 0.859375] after dividing by 256. The SSD table: units [1024, 256, 64, 16, 1] carry 4096, 1024, 256, 64, and 4 anchors — 5444 total; class channels are 4×(1+1)=8 per unit, giving 8192, 2048, 512, 128, 8 = 10888 class values, and 5444×4 = 21776 offset values. The scale pairs come out [0.272, 0.447, 0.619, 0.79, 0.961] exactly as in the book. RoI pooling: a 3×3 window at the origin splits into subwindows with floor/ceil boundaries and yields [[5, 6], [9, 10]], while a 3×4 window at row 1 yields [[9, 11], [13, 15]] — the same numbers as the book\u2019s `torchvision.ops.roi_pool` run, with one CNN pass instead of 2000.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.roi-pool',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ roi_pool_2x2(X, r0, r1, c0, c1): تأخذ نافذة اهتمام صفوف r0:r1 وأعمدة c0:c1 من مصفوفة X وتعيد 2×2 من الأقصى. قسّم النافذة إلى نوافذ فرعية بحدود أرضية للبداية وسقفية للنهاية: start = (i*H)//2 و end = ceil((i+1)*H/2) (يمكن كتابة السقف بـ -(-x//2)).',
        en: 'Implement roi_pool_2x2(X, r0, r1, c0, c1): take the region rows r0:r1 and cols c0:c1 of matrix X and return a 2×2 of maxima. Split the window into subwindows with floor start and ceil end boundaries: start = (i*H)//2 and end = ceil((i+1)*H/2) (ceiling can be written as -(-x//2)).',
      },
      starterCode: "def roi_pool_2x2(X, r0, r1, c0, c1):\n    H, W = r1 - r0, c1 - c0\n    # TODO: for each of the 2x2 subwindows, take the max over\n    # rows r0 + floor(i*H/2) .. r0 + ceil((i+1)*H/2) (same for cols with W)\n    ...\n",
      solution: "def roi_pool_2x2(X, r0, r1, c0, c1):\n    H, W = r1 - r0, c1 - c0\n    out = []\n    for i in range(2):\n        rr0 = r0 + (i * H) // 2\n        rr1 = r0 + -(-((i + 1) * H) // 2)\n        row = []\n        for j in range(2):\n            cc0 = c0 + (j * W) // 2\n            cc1 = c0 + -(-((j + 1) * W) // 2)\n            row.append(max(X[r][c] for r in range(rr0, rr1) for c in range(cc0, cc1)))\n        out.append(row)\n    return out",
      tests: [
        {
          id: 't1',
          name: { ar: 'نافذة 3×3 عند الزاوية', en: 'A 3×3 window at the origin' },
          code: "X = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]]\ngot = roi_pool_2x2(X, 0, 3, 0, 3)\nassert got == [[5, 6], [9, 10]], 'expected [[5, 6], [9, 10]] | got %r' % (got,)",
          expected: '[[5, 6], [9, 10]]',
        },
        {
          id: 't2',
          name: { ar: 'نافذة 3×4 عند الصف 1', en: 'A 3×4 window starting at row 1' },
          code: "X = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]]\ngot = roi_pool_2x2(X, 1, 4, 0, 4)\nassert got == [[9, 11], [13, 15]], 'expected [[9, 11], [13, 15]] | got %r' % (got,)",
          expected: '[[9, 11], [13, 15]]',
        },
        {
          id: 't3',
          name: { ar: 'نافذة تغطي المصفوفة كلها', en: 'A window covering the whole matrix' },
          code: "X = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]]\ngot = roi_pool_2x2(X, 0, 4, 0, 4)\nassert got == [[5, 7], [13, 15]], 'expected [[5, 7], [13, 15]] | got %r' % (got,)",
          expected: '[[5, 7], [13, 15]]',
        },
      ],
      hints: [
        { ar: 'حدود الصفوف للشطر i: تبدأ عند r0 + (i*H)//2 وتنتهي عند r0 + سقف((i+1)*H/2)، والسقف لعدد صحيح موجب هو -(-x//2).', en: 'Row bounds for half i: start at r0 + (i*H)//2 and end at r0 + ceil((i+1)*H/2); for positive integers the ceiling is -(-x//2).' },
        { ar: 'الأعمدة نفس المنطق مع W بدل H — النافذتان مستقلتان.', en: 'Columns follow the same logic with W instead of H — the two dimensions are independent.' },
        { ar: 'القيمة الخارجة لكل نافذة فرعية هي max على كل خلاياها: تكرار متداخل واحد يكفي.', en: 'Each subwindow\u2019s output is the max over all its cells: one nested generator suffices.' },
        { ar: 'قيمة تحقق: نافذة 3×3 عند الزاوية تعطي أقصى كل شطر: max(0,1,4,5)=5 وmax(2,6)=6 وmax(8,9)=9 و10.', en: 'Sanity: the 3×3 origin window gives max(0,1,4,5)=5, max(2,6)=6, max(8,9)=9, and 10.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.ssd-anchor-count',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'في SSD من كتاب الدرس على مدخلات 256×256: خمسة مقاييس بخرائط 32×32 و16×16 و8×8 و4×4 و1×1، و4 مراسٍ لكل وحدة مكانية. كم مرساة تُولَّد لكل صورة؟ (اكتب رقمًا)',
        en: 'In the chapter\u2019s SSD at 256×256 inputs: five scales with feature maps 32×32, 16×16, 8×8, 4×4, and 1×1, and 4 anchors per spatial unit. How many anchors are generated per image? (Enter a number)',
      },
      answer: '5444',
      solution: '5444',
      tolerance: 0.01,
      hints: [
        { ar: 'عدد الوحدات: 1024 و256 و64 و16 و1 — اجمعها.', en: 'Units: 1024, 256, 64, 16, and 1 — sum them.' },
        { ar: 'المجموع 1361 وحدة، وكل وحدة تحمل 4 مراسٍ.', en: 'The sum is 1361 units, each carrying 4 anchors.' },
        { ar: 'الجواب: 1361 × 4.', en: 'Answer: 1361 × 4.' },
        { ar: 'لاحظ كيف يسهم المقياس الأول وحده بـ 4096 من أصل 5444.', en: 'Notice the first scale alone contributes 4096 of the 5444.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# Rebuild the SSD tables with your own numbers.\nlayers = [32, 16, 8, 4, 1]\nfor a in [4, 6]:                       # anchors per unit\n    for q in [1, 10]:                  # object classes (banana vs CIFAR-like)\n        units = [s * s for s in layers]\n        anchors = sum(u * a for u in units)\n        cls_flat = sum(u * a * (q + 1) for u in units)\n        print('a=%d q=%2d -> anchors %5d | cls values %6d | bbox values %6d'\n              % (a, q, anchors, cls_flat, anchors * 4))\n\nimport math\nlo = [0.2, 0.37, 0.54, 0.71, 0.88]\nhi = [round(math.sqrt(lo[i] * (lo[i + 1] if i < 4 else 1.05)), 3) for i in range(5)]\nprint('scale ladder:', list(zip(lo, hi)))\n\n# جرّب: أضف مقياسًا سادسًا بخريطة 0.5×0.5 غير ممكنة — بدلًا من ذلك ضاعف حجم الدخل إلى 512\n# واتبع كيف تتضاعف الوحدات في أول أربعة مقاييس بينما يبقى الأخير 1×1.\n# try: instead of an impossible sixth 0.5x0.5 scale, double the input to 512 and\n# watch how the first four scales quadruple their units while the last stays 1x1.\n# جرّب: احسب عدد قيم التصنيف لو كانت a=6 وq=20 وقارنها بحالة a=4 وq=1.\n# try: compute the class-value count for a=6, q=20 and compare with a=4, q=1.\n",
      prompt: {
        ar: 'الملعب يعيد بناء جدولي SSD لأربع حالات: بعدد مراسٍ 4 أو 6 ولكائن واحد أو 10 أصناف، مع طباعة قيم المراسي والتصنيف والإزاحة وسلّم المقاييس. لاحظ أن مضاعفة a تضاعف كل شيء خطيًا بينما زيادة q تضخّم التصنيف فقط.',
        en: 'The sandbox rebuilds the SSD tables for four settings: 4 or 6 anchors per unit and 1 or 10 object classes, printing anchor, class, and bbox value counts plus the scale ladder. Doubling a doubles everything linearly while growing q inflates only the classification side.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في توصيف دفعة الكشف بالشكل (حجم الدفعة، m، 5): ما m وماذا يعني الصنف −1؟',
            en: 'In a detection batch of shape (batch size, m, 5): what is m, and what does class −1 mean?',
          },
          options: [
            { id: 'a', text: { ar: 'm أكبر عدد صناديق في أي صورة، و−1 صندوق حشو غير شرعي يُصفّى من الخسارة', en: 'm is the largest box count any image has; −1 marks illegal padding boxes filtered from the loss' } },
            { id: 'b', text: { ar: 'm عدد الأصناف، و−1 يعني خلفية', en: 'm is the number of classes; −1 means background' } },
            { id: 'c', text: { ar: 'm عدد قنوات الصورة، و−1 خطأ في التسمية يجب حذف الصورة', en: 'm is the image channel count; −1 is a labeling error requiring deletion' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الدفعات تتطلب عددًا متساويًا من الصناديق، فتُحشى الصور الأقل حتى m بصناديق صنفها −1 وإحداثياتها بلا معنى؛ القناع في الخسارة يصفّر إسهامها. في مجموعة الموز m=1 لأن كل صورة فيها صندوق واحد.',
            en: 'Batches need equal box counts, so shorter images are padded to m with class −1 boxes whose coordinates are meaningless; a loss mask zeroes their contribution. In the banana set m=1 because every image has exactly one box.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كم قناة يخرجها مصنّف SSD عند وحدة مكانية واحدة إذا وُلّدت a=4 مراسٍ وكان هناك q=3 أصناف كائنات؟',
            en: 'How many channels does an SSD class predictor emit per spatial unit with a=4 anchors and q=3 object classes?',
          },
          options: [
            { id: 'a', text: { ar: '12', en: '12' } },
            { id: 'b', text: { ar: '16', en: '16' } },
            { id: 'c', text: { ar: '20', en: '20' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المراسي تحتاج أصناف الكائنات الثلاثة زائد الخلفية: a(q+1) = 4×4 = 16 قناة. قناة الإزاحات المجاورة ستكون a×4 = 16 أيضًا لكن لسبب مختلف: أربعة أرقام لكل مرساة.',
            en: 'Anchors need the three object classes plus background: a(q+1) = 4×4 = 16 channels. The neighboring box predictor would also emit a×4 = 16, but for a different reason: four numbers per anchor.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما التغيير الجوهري الذي قدّمه Faster R-CNN على Fast R-CNN؟',
            en: 'What is the essential change Faster R-CNN introduced over Fast R-CNN?',
          },
          options: [
            { id: 'a', text: { ar: 'حذف طبقة تجميع RoI نهائيًا', en: 'Removing the RoI pooling layer entirely' } },
            { id: 'b', text: { ar: 'استبدال البحث الانتقائي بشبكة اقتراح مناطق تُدرَّب مشتركة مع بقية النموذج', en: 'Replacing selective search with a region proposal network trained jointly with the rest of the model' } },
            { id: 'c', text: { ar: 'الرجوع إلى تمريرة CNN لكل منطقة مقترحة', en: 'Going back to one CNN pass per proposed region' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'Fast R-CNN حلّ تكرار الممريرات لكنه ظل يعتمد على بحث انتقائي خارجي بطيء للاقتراح؛ Faster R-CNN جعل الاقتراح نفسه جزءًا من الشبكة (تنبؤ ثنائي وإزاحات للمراسي ثم NMS) فيتدرب كله من طرف إلى طرف ويقل عدد المقترحات دون خسارة دقة.',
            en: 'Fast R-CNN removed repeated passes but still leaned on slow external selective search for proposals; Faster R-CNN made proposal generation itself part of the network (binary class + offset predictions per anchor, then NMS), training end to end and cutting proposal counts without losing accuracy.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'مجموعة كشف الموز: 1000 تدريب و100 تحقق بحجم 256×256، والتسمية (صنف + ركنان)/256 بتوصيف دفعة (حجم الدفعة، m، 5) وحشو صنفه −1 (هدف s6 مجموعة بيانات الكشف).', en: 'The banana detection set: 1000 train and 100 validation images at 256×256, labels (class + corners)/256, batch shape (batch size, m, 5), padding of class −1 (goal of s6 The Object Detection Dataset).' },
        { ar: 'SSD شبكة أساس + كتل تقليص تولّد 5444 مرساة على خمسة مقاييس، بمصنّف a(q+1) قناة ومتنبئ a×4 قناة، وخسارة إنتروبيا متقاطعة للأصناف + L1 للإزاحات المقنّعة (هدف s7 الكشف متعدد الصناديق بلقطة واحدة).', en: 'SSD = base network + downsampling blocks generating 5444 anchors over five scales, with an a(q+1)-channel classifier and an a×4 box predictor, trained with cross-entropy for classes plus masked L1 for offsets (goal of s7 Single Shot Multibox Detection).' },
        { ar: 'R-CNN يكلف ممريرة لكل مقترح (~2000)، وFast R-CNN يمرر الصورة مرة واحدة ويجمّع RoI إلى أشكال متساوية بحدود أرضية-سقفية، وFaster R-CNN يستبدل البحث الانتقائي بشبكة اقتراح مدرَّبة، وMask R-CNN يضيف قناعًا لكل بكسل (هدف s8 شبكات R-CNN).', en: 'R-CNN pays one pass per proposal (~2000); Fast R-CNN runs the image once and RoI-pools regions into equal shapes with floor/ceil bounds; Faster R-CNN swaps selective search for a trained proposal network; Mask R-CNN adds per-pixel masks (goal of s8 Region-based CNNs).' },
      ],
      reflectPrompt: {
        ar: 'قارن SSD بعائلة R-CNN: أيهما يصلح للفيديو الحي، وأيهما يصلح لدقة قصوى على صور ثابتة — وما الكلفة التي تدفعها في كل حالة؟',
        en: 'Compare SSD with the R-CNN family: which suits live video, which suits maximum accuracy on still images, and what price does each pay?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch14.s6' },
        { book: 'D2L', section: 'd2l.ch14.s7' },
        { book: 'D2L', section: 'd2l.ch14.s8' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch14.s6' },
    { book: 'D2L', section: 'd2l.ch14.s7' },
    { book: 'D2L', section: 'd2l.ch14.s8' },
  ],
} satisfies Lesson;

export default lesson;
