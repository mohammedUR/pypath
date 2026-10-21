import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch14.l2 — "Object Detection: Bounding Boxes, Anchor Boxes, Multiscale"
 * كشف الأجسام: الصناديق المحيطة والمراسي وتعدد المقاييس
 * Aligned with D2L ch14 s3 (Object Detection and Bounding Boxes) + s4 (Anchor
 * Boxes) + s5 (Multiscale Object Detection). Original paraphrase throughout.
 * Runnable design: corner/center box conversion round-trips, IoU between fixed
 * boxes, anchor widths/heights at fixed scale-ratio pairs, anchor counts per
 * pixel and per feature-map scale, and a greedy NMS sandbox. Every literal
 * verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch14.l2',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 14,
  title: {
    ar: 'كشف الأجسام: الصناديق المحيطة والمراسي وتعدد المقاييس',
    en: 'Object Detection: Bounding Boxes, Anchor Boxes, Multiscale',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch14.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'التصنيف يجيب عن «ما هذه الصورة؟» أما كشف الأجسام فيجيب عن «ما الأجسام وأين هي بالضبط؟» — سائق ذاتي لا يكفيه معرفة أن أمامك مشاة، بل يحتاج مواقعهم. المفتاح حسابي بحت: مستطيلات بأربع أرقام، وآلاف المراسي المولدة حول كل بكسل، ومقياس تشابه واحد (IoU) يحكم كل شيء من وسم التدريب حتى تنقية المخرجات.',
        en: 'Classification answers \u201cwhat is in this image?\u201d while object detection answers \u201cwhat objects are there and exactly where?\u201d — a self-driving car does not merely need to know pedestrians exist, it needs their positions. The machinery is purely computational: rectangles described by four numbers, thousands of anchors generated around every pixel, and one similarity score (IoU) governing everything from training labels to output cleanup.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من الصندوق إلى المرساة إلى المقياس', en: 'From box to anchor to scale' },
      chunks: [
        {
          ar: 'نمثّل موقع الجسم بصندوق محيط مستطيل بتمثيلين متكافئين: ركنان (الزاوية العلوية اليسرى x1,y1 والسفلية اليمنى x2,y2) أو مركز وأبعاد (cx, cy, w, h). التحويل بينهما حساب مباشر: المركز متوسط الركنين والعرض فرقهما — والتحويل ذهابًا وإيابًا يعيد الصندوق نفسه تمامًا. في مثال الكتاب صندوق الكلب [60.0, 45.0, 378.0, 516.0] يتحول إلى مركز [219.0, 280.5, 318.0, 471.0].',
          en: 'An object\u2019s location is a rectangular bounding box in two equivalent forms: two corners (upper-left x1,y1 and lower-right x2,y2) or center-plus-size (cx, cy, w, h). Converting is direct arithmetic — the center is the corner midpoint and the width their difference — and a round trip reproduces the box exactly. In the book\u2019s example the dog box [60.0, 45.0, 378.0, 516.0] maps to center form [219.0, 280.5, 318.0, 471.0].',
        },
        {
          ar: 'خوارزميات الكشف تولّد مراسي (anchor boxes) بأشكال مختلفة حول كل بكسل: عند مقياس s∈(0,1] ونسبة عرض-إلى-ارتفاع r يكون العرض s·√r والارتفاع s/√r. كل التركيبات n×m حول كل بكسل مكلفة (whnm صندوقًا)، لذا يُكتفى عمليًا بالتركيبات التي تحوي s1 أو r1 — أي n+m−1 مرساة لكل بكسل. ومقياس التشابه بين أي صندوقين هو IoU: مساحة التقاطع على مساحة الاتحاد، من 0 (لا تقاطع) إلى 1 (تطابق تام).',
          en: 'Detection algorithms generate anchor boxes of varying shapes around every pixel: at scale s∈(0,1] and width-to-height ratio r, the width is s·√r and the height s/√r. All n×m combinations per pixel are expensive (whnm boxes), so practice keeps only combinations containing s1 or r1 — n+m−1 anchors per pixel. The similarity between any two boxes is IoU: intersection area over union area, from 0 (no overlap) to 1 (identical).',
        },
        {
          ar: 'التدريب يحتاج وسم كل مرساة: صنف الجسم الأقرب إليها (أو الخلفية إذا كان أكبر IoU لديها دون عتبة) وإزاحة بين مركز الصندوق الحقيقي ومركزها. وعند التنبؤ تتكدس صناديق متشابهة حول الجسم نفسه، فيأتي كبح القيم غير العظمى (NMS): رتّب حسب الثقة، احتفظ بالأعلى، واحذف كل من يتجاوز IoU معه عتبة ε، ثم كرر حتى لا يبقى زوج متشابه.',
          en: 'Training needs every anchor labeled: the class of its closest ground-truth box (or background when even its best IoU is below a threshold) plus an offset between the true center and its own. At prediction time near-identical boxes pile around each object, so non-maximum suppression (NMS) steps in: sort by confidence, keep the highest, drop everything whose IoU with it exceeds ε, and repeat until no similar pair survives.',
        },
        {
          ar: 'الأجسام الصغيرة أكثر شيوعًا: على صورة 2×2 يظهر جسم 1×1 في أربعة مواضع و1×2 في موضعين و2×2 في موضع واحد — لذا نولّد مراسي أكثر للصغار وأقل للكبار. عبر طبقات CNN تتقلص خرائط الملامح وتتسع الحقول الاستقبالية: خريطة 4×4 بمقياس صغير للصغار، و2×2 بمقياس أكبر، و1×1 بمقياس كبير للمركز وحده. هكذا تُستغل التمثيلات الطبقية لكشف أحجام مختلفة.',
          en: 'Small objects are more common: on a 2×2 image a 1×1 object can appear in four places, 1×2 in two, 2×2 in one — so we generate more anchors for the small and fewer for the large. Across CNN layers feature maps shrink while receptive fields grow: a 4×4 map with a small scale for the small, 2×2 with a larger scale, and 1×1 with a big scale for the center alone. Layerwise representations thus detect objects of different sizes.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'تحويلات الصناديق وIoU وأبعاد المراسي وعدّ المقاييس',
        en: 'Box conversions, IoU, anchor dimensions, and scale counting',
      },
      code: "# s3: two bounding-box representations\ndef corner_to_center(box):\n    x1, y1, x2, y2 = box\n    return [(x1 + x2) / 2, (y1 + y2) / 2, x2 - x1, y2 - y1]\n\ndef center_to_corner(box):\n    cx, cy, w, h = box\n    return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2]\n\ndog = [60.0, 45.0, 378.0, 516.0]\nprint('dog in corners:', dog)\nprint('dog in center  :', corner_to_center(dog))\nprint('round trip ok  :', center_to_corner(corner_to_center(dog)) == dog)\n\n# s4: IoU (the Jaccard index of two pixel sets)\ndef iou(a, b):\n    ix = min(a[2], b[2]) - max(a[0], b[0])\n    iy = min(a[3], b[3]) - max(a[1], b[1])\n    inter = max(ix, 0.0) * max(iy, 0.0)\n    area_a = (a[2] - a[0]) * (a[3] - a[1])\n    area_b = (b[2] - b[0]) * (b[3] - b[1])\n    return inter / (area_a + area_b - inter)\n\nprint('IoU overlapping:', iou([0, 0, 4, 4], [2, 1, 6, 3]))\nprint('IoU dog vs cat :', iou(dog, [400.0, 112.0, 655.0, 493.0]))\n\n# s4: anchor width/height at scale s and ratio r: w = s*sqrt(r), h = s/sqrt(r)\nimport math\nfor s, r in [(0.75, 1.0), (0.75, 2.0), (0.75, 0.5)]:\n    print('s=%.2f r=%.1f -> w=%.6f h=%.6f' % (s, r, s * math.sqrt(r), s / math.sqrt(r)))\n\n# s4/s5: anchor counts\nprint('per pixel (3 sizes, 3 ratios):', 3 + 3 - 1)\nprint('whole 561x728 image          :', 561 * 728 * 5)\nprint('multiscale fmap 4x4,2x2,1x1  :', [16 * 3, 4 * 3, 1 * 3], 'total', 48 + 12 + 3)",
      explanation: {
        ar: 'صندوق الكلب [60.0, 45.0, 378.0, 516.0] يتحول إلى صيغة المركز [219.0, 280.5, 318.0, 471.0] والتحويل العكسي يعيده كما هو. IoU للمستطيلين المتقاطعين [0,0,4,4] و[2,1,6,3] يساوي 0.2 (تقاطع 2×2=4 على اتحاد 16+8−4=20)، أما الكلب والقط في مثال الكتاب فمتفارقان أفقيًا (378 < 400) فيكون IoU صفرًا تمامًا. أبعاد المراسي عند s=0.75: مع r=1 مربع 0.75×0.75، ومع r=2 يمتد عرضيًا 1.060660×0.530330، ومع r=0.5 العكس. والحساب: 3+3−1=5 مراسٍ لكل بكسل أي 2042040 لصورة 561×728 كاملة، بينما توزيعها على ثلاث مقاييس 4×4 ثم 2×2 ثم 1×1 يعطي 48 و12 و3 — 63 مرساة فقط بدل ملايين.',
        en: 'The dog box [60.0, 45.0, 378.0, 516.0] maps to center form [219.0, 280.5, 318.0, 471.0] and the inverse returns it unchanged. IoU for the overlapping [0,0,4,4] and [2,1,6,3] is 0.2 (a 2×2=4 intersection over a union of 16+8−4=20), while the book\u2019s dog and cat are horizontally disjoint (378 < 400) so their IoU is exactly 0. Anchor shapes at s=0.75: r=1 gives a 0.75×0.75 square, r=2 stretches wide to 1.060660×0.530330, and r=0.5 the reverse. The counts: 3+3−1=5 anchors per pixel means 2042040 across a full 561×728 image, whereas spreading them over three scales (4×4, then 2×2, then 1×1) gives 48, 12, and 3 — just 63 anchors instead of millions.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.box-iou',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ الدوال الثلاث: corner_to_center(box) وcenter_to_corner(box) بين تمثيلي الركنين والمركز، وiou(a, b) الذي يعيد مساحة التقاطع على الاتحاد مع قصّ القيم السالبة إلى صفر. الصناديق قوائم من أربعة أرقام [x1, y1, x2, y2].',
        en: 'Implement three functions: corner_to_center(box) and center_to_corner(box) between the two-corner and center representations, and iou(a, b) returning intersection-over-union with negative overlaps clamped to zero. Boxes are 4-number lists [x1, y1, x2, y2].',
      },
      starterCode: "def corner_to_center(box):\n    # TODO: center = midpoint of corners, size = their difference\n    ...\n\ndef center_to_corner(box):\n    # TODO: inverse mapping\n    ...\n\ndef iou(a, b):\n    # TODO: intersection over union, clamp negatives to 0\n    ...\n",
      solution: "def corner_to_center(box):\n    x1, y1, x2, y2 = box\n    return [(x1 + x2) / 2, (y1 + y2) / 2, x2 - x1, y2 - y1]\n\ndef center_to_corner(box):\n    cx, cy, w, h = box\n    return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2]\n\ndef iou(a, b):\n    ix = min(a[2], b[2]) - max(a[0], b[0])\n    iy = min(a[3], b[3]) - max(a[1], b[1])\n    inter = max(ix, 0.0) * max(iy, 0.0)\n    area_a = (a[2] - a[0]) * (a[3] - a[1])\n    area_b = (b[2] - b[0]) * (b[3] - b[1])\n    return inter / (area_a + area_b - inter)",
      tests: [
        {
          id: 't1',
          name: { ar: 'التحويل ذهابًا وإيابًا يعيد الصندوق', en: 'A conversion round trip reproduces the box' },
          code: "got = center_to_corner(corner_to_center([60.0, 45.0, 378.0, 516.0]))\nassert got == [60.0, 45.0, 378.0, 516.0], 'round trip must be exact | got %r' % (got,)",
          expected: '[60.0, 45.0, 378.0, 516.0]',
        },
        {
          id: 't2',
          name: { ar: 'IoU لمستطيلين متقاطعين = 0.2', en: 'IoU of two overlapping boxes is 0.2' },
          code: "got = iou([0, 0, 4, 4], [2, 1, 6, 3])\nassert abs(got - 0.2) < 1e-9, 'expected 0.2 | got %r' % (got,)",
          expected: '0.2',
        },
        {
          id: 't3',
          name: { ar: 'المتفارقان صفر والمتطابقان واحد', en: 'Disjoint is 0 and identical is 1' },
          code: "assert iou([0, 0, 2, 2], [3, 3, 5, 5]) == 0.0, 'disjoint boxes must give 0.0'\nassert abs(iou([1, 2, 4, 6], [1, 2, 4, 6]) - 1.0) < 1e-9, 'identical boxes must give 1.0'",
          expected: '0.0 and 1.0',
        },
      ],
      hints: [
        { ar: 'المركز متوسط الركنين: (x1+x2)/2 و(y1+y2)/2، والأبعاد فروق مباشرة.', en: 'The center is the corner midpoint: (x1+x2)/2 and (y1+y2)/2; the size is a plain difference.' },
        { ar: 'في iou احسب عرض التقاطع min(x2) − max(x1) وارتفاعه بالمثل، ثم اضربهما بعد قصّ السالبات إلى صفر.', en: 'In iou compute the intersection width min(x2) − max(x1) and height likewise, then multiply after clamping negatives to zero.' },
        { ar: 'الاتحاد = مساحة a + مساحة b − التقاطع؛ هذا يمنع عدّ التقاطع مرتين.', en: 'Union = area(a) + area(b) − intersection; this avoids double-counting the overlap.' },
        { ar: 'قيمة تحقق: التقاطع 2×2=4 والاتحاد 16+8−4=20 فيكون IoU = 0.2.', en: 'Sanity value: intersection 2×2=4, union 16+8−4=20, so IoU = 0.2.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.multiscale-count',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'في الكشف متعدد المقاييس وُلّدت المراسي على خرائط ملامح بأحجام 8×8 ثم 4×4 ثم 2×2 ثم 1×1، مع 4 مراسٍ لكل وحدة مكانية. كم مرساة في المجموع عبر المقاييس الأربعة؟ (اكتب رقمًا)',
        en: 'In multiscale detection, anchors are generated on feature maps of sizes 8×8, then 4×4, then 2×2, then 1×1, with 4 anchors per spatial unit. How many anchors in total across the four scales? (Enter a number)',
      },
      answer: '340',
      solution: '340',
      tolerance: 0.01,
      hints: [
        { ar: 'عدد الوحدات لكل مقياس: 64 و16 و4 و1.', en: 'Units per scale: 64, 16, 4, and 1.' },
        { ar: 'اجمعها: 64+16+4+1 = 85 وحدة، وكل وحدة تحمل 4 مراسٍ.', en: 'Sum them: 64+16+4+1 = 85 units, each carrying 4 anchors.' },
        { ar: 'الجواب: 85 × 4.', en: 'Answer: 85 × 4.' },
        { ar: 'لاحظ الانكماش السريع: أكبر مقياس وحده يحمل 64 من أصل 85 وحدة.', en: 'Note the fast shrinkage: the largest scale alone holds 64 of the 85 units.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# Greedy non-maximum suppression over 4 fixed predicted boxes.\ndef iou(a, b):\n    ix = min(a[2], b[2]) - max(a[0], b[0])\n    iy = min(a[3], b[3]) - max(a[1], b[1])\n    inter = max(ix, 0.0) * max(iy, 0.0)\n    aa = (a[2] - a[0]) * (a[3] - a[1])\n    ab = (b[2] - b[0]) * (b[3] - b[1])\n    return inter / (aa + ab - inter)\n\nboxes = [[0.1, 0.08, 0.52, 0.92], [0.08, 0.2, 0.56, 0.95],\n         [0.15, 0.3, 0.62, 0.91], [0.55, 0.2, 0.9, 0.88]]\nscores = [0.9, 0.8, 0.7, 0.9]\norder = sorted(range(len(scores)), key=lambda i: -scores[i])\nprint('confidence order:', order)\nkeep, rest = [], list(order)\nwhile rest:\n    best = rest.pop(0)\n    keep.append(best)\n    rest = [i for i in rest if iou(boxes[best], boxes[i]) <= 0.5]\nprint('kept after NMS  :', keep)\nfor i in keep:\n    print('  box', i, 'score', scores[i], 'coords', boxes[i])\nprint('IoUs vs box 0   :', ['%.4f' % iou(boxes[0], b) for b in boxes[1:]])\n\n# جرّب: خفّض العتبة إلى 0.3 ثم ارفعها إلى 0.9 ولاحظ كيف يتغير عدد الصناديق الباقية.\n# try: lower the threshold to 0.3 then raise it to 0.9 and watch the kept set change.\n# جرّب: اجعل الدرجات [0.7, 0.8, 0.9, 0.9] وتتبع الترتيب الجديد والصناديق المحفوظة.\n# try: set the scores to [0.7, 0.8, 0.9, 0.9] and trace the new order and kept boxes.\n",
      prompt: {
        ar: 'الملعب يكبح القيم غير العظمى طمعيًا على مثال الكتاب: أربعة صناديق متوقعة بدرجات ثقة [0.9, 0.8, 0.7, 0.9] وعتبة 0.5. الصندوق 0 الأعلى ثقة يُبقي نفسه ويقضي على 1 و2 (IoU معهما 0.7368 و0.5454 يتجاوز العتبة) ويُبقي 3 المتفارق منه — النتيجة [0, 3] كما في مخرجات الكتاب.',
        en: 'The sandbox runs greedy non-maximum suppression on the book\u2019s example: four predicted boxes with confidences [0.9, 0.8, 0.7, 0.9] and threshold 0.5. The top-confidence box 0 keeps itself, eliminates 1 and 2 (IoUs 0.7368 and 0.5454 exceed the threshold) and keeps the disjoint 3 — the result [0, 3], matching the book\u2019s output.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما صيغة المركز والبعد للصندوق [0, 0, 2, 2]؟',
            en: 'What is the center-plus-size form of the box [0, 0, 2, 2]?',
          },
          options: [
            { id: 'a', text: { ar: '[1, 1, 2, 2]', en: '[1, 1, 2, 2]' } },
            { id: 'b', text: { ar: '[0, 0, 2, 2]', en: '[0, 0, 2, 2]' } },
            { id: 'c', text: { ar: '[2, 2, 1, 1]', en: '[2, 2, 1, 1]' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المركز متوسط الركنين: (0+2)/2 = 1 لكل من cx وcy، والعرض والارتفاع فروق الركنين: 2−0 = 2 لكل منهما — فيكون التمثيل [1, 1, 2, 2].',
            en: 'The center is the corner midpoint: (0+2)/2 = 1 for both cx and cy, and the width and height are corner differences: 2−0 = 2 each — giving [1, 1, 2, 2].',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما المدى والمعنى الدقيق لقيمة IoU بين صندوقين؟',
            en: 'What is the exact range and meaning of the IoU between two boxes?',
          },
          options: [
            { id: 'a', text: { ar: 'نسبة مساحة التقاطع إلى مساحة الاتحاد، بين 0 و1', en: 'The ratio of intersection area to union area, between 0 and 1' } },
            { id: 'b', text: { ar: 'المسافة الأوروبية بين مركزي الصندوقين', en: 'The Euclidean distance between the two box centers' } },
            { id: 'c', text: { ar: 'نسبة التقاطع إلى مساحة الصندوق الأكبر فقط، وقد تتجاوز 1', en: 'Intersection over the larger box\u2019s area only, and it can exceed 1' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'IoU هو مؤشر جاكار على مجموعتي بكسلَي الصندوقين: |A∩B| ÷ |A∪B|. صفر يعني لا تقاطع و1 يعني تطابقًا تامًا، ولا يمكنه تجاوز 1 لأن التقاطع جزء من الاتحاد.',
            en: 'IoU is the Jaccard index over the two boxes\u2019 pixel sets: |A∩B| ÷ |A∪B|. Zero means no overlap and 1 means identical; it cannot exceed 1 because the intersection is part of the union.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا تُخصَّص المراسي الأكبر للخرائط المكانية الأصغر في أعماق الشبكة؟',
            en: 'Why are larger anchors assigned to the spatially smaller maps deeper in the network?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الحقول الاستقبالية هناك أوسع فتصلح لكشف الأجسام الأكبر، ولأن الكبيرة أقل تكرارًا فتحتاج مواضع أقل', en: 'Receptive fields there are wider, fitting larger objects; large objects are also rarer, needing fewer sampled positions' } },
            { id: 'b', text: { ar: 'لأن الخرائط الصغيرة أسرع حسابيًا فنضع فيها المراسي الكثيرة', en: 'Because small maps are computationally faster, so we put the dense anchors there' } },
            { id: 'c', text: { ar: 'لأن الأجسام الكبيرة تظهر دائمًا في مركز الصورة', en: 'Because large objects always appear at the image center' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل وحدة في خريطة عميقة ترى منطقة واسعة من الصورة الأصلية (حقل استقبالي كبير)، فتصلح للكبيرة؛ وحساب الاحتمالات يقول إن الصغيرة أكثر ظهورًا (4 مواضع لجسم 1×1 على شبكة 2×2 مقابل موضع واحد لجسم 2×2) فنكثّف العينات عند المقاييس الصغيرة.',
            en: 'Each unit on a deep map sees a wide region of the original image (a large receptive field), fitting bigger objects; and small objects occur more often (a 1×1 object has 4 placements on a 2×2 grid versus 1 for 2×2), so sampling is densified at small scales.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'كشف الأجسام يتنبأ بالصنف والموضع معًا، والموضع صندوق محيط بتمثيلين متكافئين (ركنان أو مركز وبعد) يتحولان ذهابًا وإيابًا بدقة (هدف s3 كشف الأجسام والصناديق المحيطة).', en: 'Object detection predicts class and location together; the location is a bounding box in two equivalent forms (corners or center-plus-size) that convert back and forth exactly (goal of s3 Object Detection and Bounding Boxes).' },
        { ar: 'المراسي تولَّد حول كل بكسل بأبعاد s·√r و s/√r بعدد n+m−1 لكل بكسل، وIoU (التقاطع على الاتحاد) يقيس التشابه ويقود وسم الصنف والإزاحة، وNMS ينقّي المخرجات المتشابهة (هدف s4 صناديق المراسي).', en: 'Anchors are generated around every pixel with dimensions s·√r and s/√r, n+m−1 per pixel; IoU (intersection over union) measures similarity, drives class and offset labeling, and NMS cleans up duplicate outputs (goal of s4 Anchor Boxes).' },
        { ar: 'الأجسام الصغيرة أكثر تكرارًا فتُكثَّف المراسي عند المقاييس الصغيرة، وخرائط الملامح الأعمق بحقول استقبالية أوسع تحمل مراسي أكبر — تعدد المقاييس يستغل التمثيلات الطبقية للشبكة (هدف s5 كشف الأجسام متعدد المقاييس).', en: 'Small objects are more frequent, so anchors are densified at small scales, while deeper maps with wider receptive fields carry larger anchors — multiscale detection exploits the network\u2019s layerwise representations (goal of s5 Multiscale Object Detection).' },
      ],
      reflectPrompt: {
        ar: 'صمّم توزيع مراسٍ لصورة 256×256 تظهر فيها دراجات (كبيرة) وطيور (صغيرة): كم مقياسًا تختار وبأي أحجام خرائط، وكيف تضبط المقاييس s لكل منها؟',
        en: 'Design an anchor layout for a 256×256 image containing bicycles (large) and birds (small): how many scales and which map sizes would you choose, and how would you set the scale s for each?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch14.s3' },
        { book: 'D2L', section: 'd2l.ch14.s4' },
        { book: 'D2L', section: 'd2l.ch14.s5' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch14.s3' },
    { book: 'D2L', section: 'd2l.ch14.s4' },
    { book: 'D2L', section: 'd2l.ch14.s5' },
  ],
} satisfies Lesson;

export default lesson;
