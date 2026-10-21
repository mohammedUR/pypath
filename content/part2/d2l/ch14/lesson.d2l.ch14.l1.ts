import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch14.l1 — "Image Augmentation and Fine-Tuning: More Generalization from Less Data"
 * زيادة الصور والضبط الدقيق: تعميم أفضل من بيانات أقل
 * Aligned with D2L ch14 s1 (Image Augmentation) + s2 (Fine-Tuning). All prose and
 * code are original paraphrases of the source ideas, never verbatim translation.
 * Runnable design: image augmentation as deterministic list transforms on a small
 * pixel grid (flips, brightness with clipping), plus the fine-tuning parameter
 * budget of ResNet-18 (copied backbone vs newly initialized head). Every literal
 * verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch14.l1',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 14,
  title: {
    ar: 'زيادة الصور والضبط الدقيق: تعميم أفضل من بيانات أقل',
    en: 'Image Augmentation and Fine-Tuning: Better Generalization with Less Data',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch8.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'عندما تكون مجموعة بياناتك صغيرة — بضع آلاف صور فقط — يبدأ النموذج العميق بحفظ الأمثلة بدل تعمّمها. عندك سلاحان مجرَّبان: زيادة الصور تولّد أمثلة تدريب جديدة بتغييرات محسوبة (قلب، قص، لون)، والضبط الدقيق يستعير معرفة مُدرَّبة مسبقًا على ملايين الصور ويكيّفها لمهمتك. في مثال الكتاب، الضبط الدقيق رفع دقة الاختبار من 0.850 إلى 0.940 دون صورة إضافية واحدة.',
        en: 'When your dataset is small — a few thousand images at best — a deep model starts memorizing instead of generalizing. You have two proven weapons: image augmentation manufactures new training examples with controlled changes (flip, crop, color), and fine-tuning borrows knowledge pretrained on millions of images and adapts it to your task. In the book\u2019s experiment, fine-tuning lifted test accuracy from 0.850 to 0.940 without a single extra image.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'زيادة الصور ثم نقل المعرفة', en: 'Augmentation first, then knowledge transfer' },
      chunks: [
        {
          ar: 'زيادة الصور تولّد أمثلة تدريب مشابهة لكن مختلفة بعدة تغييرات، فتقلّل اعتماد النموذج على خصائص لا علاقة لها بالصنف. القلب الأفقي لا يغيّر هوية معظم الأجسام، والقص يجعل الهدف يظهر في مواضع ومقاييس مختلفة، وتغيير السطوع والتشبع والدرجة اللونية يقلّل الحساسية للألوان. القاعدة الذهبية: الزيادة للتدريب فقط — عند التنبؤ نحتاج نتائج حتمية فلا تبقى إلا التحويلات الثابتة كالتحويل إلى موتر.',
          en: 'Image augmentation generates similar-but-distinct training examples through a series of changes, weakening the model\u2019s dependence on attributes unrelated to the class. Horizontal flips preserve the identity of most objects, cropping makes the subject appear at different positions and scales, and shifting brightness, saturation, and hue reduces color sensitivity. The golden rule: augment training only — at prediction time we need definitive results, so only fixed transforms like tensor conversion remain.',
        },
        {
          ar: 'تُدمج عدة طرق زيادة معًا عبر `Compose` في الكتاب: `RandomHorizontalFlip` ثم `ColorJitter` ثم `RandomResizedCrop`. والتجربة المرجعية تدرّب ResNet-18 على CIFAR-10 مع القلب الأفقي فقط: خسارة 0.215 ودقة تدريب 0.925 ودقة اختبار 0.810. لاحظ الفجوة بين التدريب والاختبار — الزيادة تقلّصها لأنها تكبّر فعليًا ما يراه النموذج في كل حقبة.',
          en: 'Several augmentation methods combine through `Compose` in the book: `RandomHorizontalFlip`, then `ColorJitter`, then `RandomResizedCrop`. The reference experiment trains ResNet-18 on CIFAR-10 with horizontal flipping alone: loss 0.215, train accuracy 0.925, test accuracy 0.810. Notice the train-test gap — augmentation narrows it because it effectively enlarges what the model sees every epoch.',
        },
        {
          ar: 'الضبط الدقيق (fine-tuning) ينقل معرفة من مجموعة مصدر ضخمة (ImageNet: أكثر من 10 ملايين صورة و1000 صنف) إلى مجموعة هدف صغيرة. خطواته الأربع: (1) تدريب نموذج المصدر مسبقًا؛ (2) نسخ تصميمه ومعاملاته كلها ما عدا طبقة الإخراج؛ (3) إضافة طبقة إخراج جديدة بعدد أصناف الهدف تبدأ من تهيئة جديدة؛ (4) التدريب على بيانات الهدف: الطبقة الجديدة من الصفر والبقية تُضبط بلطف.',
          en: 'Fine-tuning transfers knowledge from a large source dataset (ImageNet: over 10 million images, 1000 classes) to a small target one. Its four steps: (1) pretrain the source model; (2) copy all of its design and parameters except the output layer; (3) add a new output layer sized to the target classes, freshly initialized; (4) train on the target data — the new layer learns from zero while the rest are gently adjusted.',
        },
        {
          ar: 'معدلات التعلم تنقسم مجموعتين: معاملات ما قبل التدريب فعّالة أصلًا فتكفيها معدل صغير (5e-5 في الكتاب)، بينما طبقة الإخراج الجديدة تبدأ من الصفر فتحتاج عشرة أضعاف ذلك. على مجموعة النقانق الصغيرة أعطى هذا الضبط دقة اختبار 0.940 مقابل 0.850 لنموذج مُدرَّب من الصفر بالبنية نفسها — القيمة كلها في البدايات الأفضل.',
          en: 'Learning rates split into two groups: pretrained parameters are already effective, so a small rate suffices (5e-5 in the book), while the fresh output layer starts from scratch and needs ten times that. On the small hot-dog dataset this reached test accuracy 0.940 versus 0.850 for an identically-shaped model trained from scratch — the entire gain comes from better starting points.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'زيادة حتمية على شبكة بكسل + ميزانية معاملات الضبط الدقيق',
        en: 'Deterministic augmentation on a pixel grid + the fine-tuning parameter budget',
      },
      code: "# Augmentation as pure list transforms on a 2x2 pixel grid (deterministic).\ndef hflip(img):                    # mirror each row (left-right)\n    return [row[::-1] for row in img]\n\ndef vflip(img):                    # mirror the row order (up-down)\n    return img[::-1]\n\ndef brightness(img, delta, vmax=255):\n    return [[min(v + delta, vmax) for v in row] for row in img]\n\nimg = [[10, 200], [60, 90]]\nprint('original  :', img)\nprint('hflip     :', hflip(img))\nprint('vflip     :', vflip(img))\nprint('bright +50:', brightness(img, 50))\nprint('clipped   :', brightness([[240, 30]], 50))\n\n# Fine-tuning budget for ResNet-18: ImageNet head 512->1000, target head 512->2.\nfc_src = 512 * 1000 + 1000\nfc_tgt = 512 * 2 + 2\nbackbone = 11181642 - fc_src\nprint('source head params :', fc_src)\nprint('copied backbone    :', backbone)\nprint('new head params    :', fc_tgt)\nprint('two LR groups      : base 5e-05, head %.1e' % (10 * 5e-05))",
      explanation: {
        ar: 'القلب الأفقي يعكس كل صف: [[10,200],[60,90]] تصبح [[200,10],[90,60]]، والقلب الرأسي يعكس ترتيب الصفوف. إضافة السطوع +50 تعطي [[60,250],[110,140]]، وعند 240+50=290 نقصّ إلى الحد 255 — القصّ جزء من التحويل اللوني. في ميزانية الضبط الدقيق: رأس المصدر 512×1000+1000=513000 معامل يُستبدل برأس 512×2+2=1026 معاملًا يبدأ من الصفر، وتبقى 10668642 معاملًا منسوخة تُضبط بالمعدل الصغير بينما يأخذ الرأس الجديد 5.0e-04 (عشرة أضعاف 5e-05).',
        en: 'The horizontal flip mirrors each row: [[10,200],[60,90]] becomes [[200,10],[90,60]], and the vertical flip reverses row order. Brightness +50 yields [[60,250],[110,140]], and 240+50=290 is clipped down to the 255 ceiling — clipping is part of the color transform. In the fine-tuning budget: the source head of 512×1000+1000=513000 parameters is replaced by a 512×2+2=1026-parameter head trained from scratch, while 10668642 copied backbone parameters tune at the small rate and the new head trains at 5.0e-04 (ten times 5e-05).',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.augment-transforms',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ ثلاث زيادات حتمية على صورة ممثلة بقائمة ثنائية الأبعاد من الأعداد: hflip يعكس كل صف، vflip يعكس ترتيب الصفوف، brightness يضيف delta لكل بكسل مع قصّ عند vmax (الافتراضي 255). قوائم خالصة — لا مكتبات.',
        en: 'Implement three deterministic augmentations on an image given as a 2-D list of numbers: hflip mirrors each row, vflip reverses the row order, and brightness adds delta to every pixel with clipping at vmax (default 255). Pure lists — no libraries.',
      },
      starterCode: "def hflip(img):\n    # TODO: mirror each row\n    ...\n\ndef vflip(img):\n    # TODO: reverse the row order\n    ...\n\ndef brightness(img, delta, vmax=255):\n    # TODO: add delta with clipping at vmax\n    ...\n",
      solution: "def hflip(img):\n    return [row[::-1] for row in img]\n\ndef vflip(img):\n    return img[::-1]\n\ndef brightness(img, delta, vmax=255):\n    return [[min(v + delta, vmax) for v in row] for row in img]",
      tests: [
        {
          id: 't1',
          name: { ar: 'القلب الأفقي يعكس كل صف', en: 'hflip mirrors each row' },
          code: "got = hflip([[1, 2, 3], [4, 5, 6]])\nassert got == [[3, 2, 1], [6, 5, 4]], 'expected [[3, 2, 1], [6, 5, 4]] | got %r' % (got,)",
          expected: '[[3, 2, 1], [6, 5, 4]]',
        },
        {
          id: 't2',
          name: { ar: 'القلب الرأسي يعكس ترتيب الصفوف', en: 'vflip reverses the row order' },
          code: "got = vflip([[1, 2, 3], [4, 5, 6]])\nassert got == [[4, 5, 6], [1, 2, 3]], 'expected [[4, 5, 6], [1, 2, 3]] | got %r' % (got,)",
          expected: '[[4, 5, 6], [1, 2, 3]]',
        },
        {
          id: 't3',
          name: { ar: 'السطوع يضيف ويقصّ عند الحد', en: 'brightness adds and clips at the ceiling' },
          code: "got = brightness([[240, 30]], 50)\nassert got == [[255, 80]], 'expected [[255, 80]] | got %r' % (got,)\nassert brightness([[0, 10]], 0) == [[0, 10]], 'delta 0 must leave the image unchanged'",
          expected: '[[255, 80]]; delta 0 unchanged',
        },
      ],
      hints: [
        { ar: 'التقطيع [::-1] يعكس أي قائمة: على الصف يعطيك القلب الأفقي وعلى قائمة الصفوف يعطيك الرأسي.', en: 'The slice [::-1] reverses any list: apply it to a row for hflip and to the list of rows for vflip.' },
        { ar: 'استخدم فهم قائمة متداخلًا في brightness: صفًا صفًا، وبكسلًا بكسلًا داخل الصف.', en: 'Use a nested list comprehension in brightness: row by row, pixel by pixel inside the row.' },
        { ar: 'القصّ سطر واحد: min(v + delta, vmax) يضمن ألا يتجاوز أي بكسل السقف.', en: 'Clipping is one call: min(v + delta, vmax) guarantees no pixel exceeds the ceiling.' },
        { ar: 'قيمة تحقق: brightness([[240, 30]], 50) = [[255, 80]] لأن 290 يُقصّ إلى 255.', en: 'Sanity value: brightness([[240, 30]], 50) = [[255, 80]] because 290 is clipped to 255.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.head-params',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'في الضبط الدقيق لـ ResNet-18 لمهمة بصنفين: طبقة الإخراج الجديدة خريطة خطية من 512 إلى 2 مع انحياز لكل خرج. كم معاملًا في هذه الطبقة وحدها؟ (اكتب رقمًا)',
        en: 'When fine-tuning ResNet-18 for a 2-class task, the new output layer is a linear map from 512 to 2 with a bias per output. How many parameters does this layer alone hold? (Enter a number)',
      },
      answer: '1026',
      solution: '1026',
      tolerance: 0.01,
      hints: [
        { ar: 'الطبقة الخطية تحمل مصفوفة أوزان 512×2 وانحيازًا بطول 2.', en: 'A linear layer holds a 512×2 weight matrix plus a length-2 bias.' },
        { ar: 'احسب: 512 × 2 = 1024 ثم أضف الانحياز 2.', en: 'Compute 512 × 2 = 1024, then add the bias of 2.' },
        { ar: 'قارن برأس المصدر: 512×1000+1000 = 513000 معاملًا يُستبدل بهذا الرأس الصغير.', en: 'Compare with the source head: 512×1000+1000 = 513000 parameters, replaced by this small head.' },
        { ar: 'الجواب: 1026.', en: 'Answer: 1026.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# A 3x3 grid and a fixed pipeline: vflip -> hflip -> brightness.\nimg = [[10, 20, 30],\n       [40, 50, 60],\n       [70, 80, 90]]\n\ndef compose(img, steps):\n    out = img\n    for name, arg in steps:\n        if name == 'vflip':\n            out = out[::-1]\n        elif name == 'hflip':\n            out = [row[::-1] for row in out]\n        elif name == 'bright':\n            out = [[min(v + arg, 255) for v in row] for row in out]\n    return out\n\nsteps = [('vflip', None), ('hflip', None), ('bright', 5)]\nprint('pipeline out:', compose(img, steps))\nprint('step by step:')\ncur = img\nfor name, arg in steps:\n    cur = compose(cur, [(name, arg)])\n    print(' after', name, arg, '->', cur)\n\n# جرّب: غيّر ترتيب الخطوات ولاحظ أي الترتيبات تعطي النتيجة نفسها ولماذا.\n# try: reorder the steps and see which orders coincide and why.\n# جرّب: أضف خطوة crop تأخذ نافذة صفوف a:b وأعمدة c:d واحصل على قصّات مختلفة من الشبكة نفسها.\n# try: add a crop step taking rows a:b and cols c:d to get different views of the same grid.\n",
      prompt: {
        ar: 'الملعب يطبّق خط أنابيب زيادة حتميًا على شبكة 3×3: قلب رأسي ثم أفقي ثم سطوع +5، مع طباعة كل خطوة. القلب والقص يبدلَان (بلا تفضيل للترتيب) بينما السطوع ليس كذلك — جرّب بنفسك واقرأ الفرق.',
        en: 'The sandbox runs a fixed augmentation pipeline on a 3×3 grid: vertical flip, horizontal flip, then brightness +5, printing each stage. Flips and crops commute (order-free) while brightness does not — verify it yourself and read the difference.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا نطبّق زيادة الصور على أمثلة التدريب فقط ونتركها عن التنبؤ؟',
            en: 'Why do we apply image augmentation to training examples only and skip it at prediction?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الزيادة تستهلك ذاكرة أكبر عند التنبؤ', en: 'Because augmentation uses more memory at prediction time' } },
            { id: 'b', text: { ar: 'لأننا نريد نتائج حتمية للتنبؤ، والزيادة العشوائية تُدخل تقلّبًا في المخرجات', en: 'Because predictions must be definitive, and stochastic augmentation injects output variance' } },
            { id: 'c', text: { ar: 'لأن الزيادة تصحّح التسميات تلقائيًا', en: 'Because augmentation fixes the labels automatically' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'هدف الزيادة توسيع فعّال لبيانات التدريب وتحسين التعميم؛ أما عند التنبؤ فنريد إجابة قابلة للتكرار، لذلك يقتصر التحويل على خطوات ثابتة كالتحويل إلى موتر والتطبيع.',
            en: 'Augmentation exists to enlarge effective training data and improve generalization; at prediction we want reproducible answers, so only fixed steps like tensor conversion and normalization remain.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الأثر الذي يحققه القصّ بمقاييس ونسب متغيرة (RandomResizedCrop) في تدريب المصنّفات؟',
            en: 'What effect does RandomResizedCrop achieve during classifier training?',
          },
          options: [
            { id: 'a', text: { ar: 'يجعل الهدف يظهر في مواضع ومقاييس مختلفة فتقل حساسية النموذج للموضع', en: 'The subject appears at different positions and scales, reducing position sensitivity' } },
            { id: 'b', text: { ar: 'يرفع دقة طبقة الإخراج بزيادة عدد أصنافها', en: 'It raises output-layer accuracy by adding classes' } },
            { id: 'c', text: { ar: 'يستبدل الحاجة إلى طبقات التجميع كليًا', en: 'It removes the need for pooling layers entirely' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القصّ بمقاييس ونسب مختلفة يجعل الكائن يظهر أينما وكيفما، فيتعلم النموذج ملامح أعمّ بدل الارتهان لموضع ثابت — وهو دور طبقات التجميع لكن على مستوى البيانات.',
            en: 'Crops at varying scales and ratios let the object appear anywhere at any size, so the model learns broader features instead of relying on a fixed position — the data-level analogue of what pooling does.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في الضبط الدقيق بمجموعتي معدلَي تعلم، مَن يحصل على المعدل الأكبر (10η) ولماذا؟',
            en: 'In fine-tuning with two learning-rate groups, who gets the larger rate (10η) and why?',
          },
          options: [
            { id: 'a', text: { ar: 'طبقات الجذع المنسوخة لأنها تحتاج تعديلًا كبيرًا', en: 'The copied backbone layers, because they need heavy adjustment' } },
            { id: 'b', text: { ar: 'طبقة الإخراج الجديدة لأنها تبدأ من تهيئة جديدة وتتعلم من الصفر', en: 'The new output layer, because it starts from a fresh initialization and learns from scratch' } },
            { id: 'c', text: { ar: 'الجميع بمعدل واحد لأن الانقسام يبطئ التقارب', en: 'Everyone at one rate because splitting slows convergence' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'معاملات الجذع المدرَّبة مسبقًا فعّالة أصلًا فتكفيها معدل صغير لحمايتها، بينما رأس الإخراج الجديد يبدأ من الصفر فيحتاج معدلًا أكبر ليصل سريعًا — في الكتاب: 5e-5 للجذع وعشرة أضعافه للرأس.',
            en: 'Pretrained backbone parameters are already effective and a small rate protects them, while the fresh output head must travel farther and benefits from a larger rate — in the book: 5e-5 for the backbone and ten times that for the head.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'زيادة الصور تولّد أمثلة تدريب متغيرة (قلب، قص، لون) لتقليل الاعتماد على الموضع واللون وتحسين التعميم، وتُطبّق على التدريب فقط لأن التنبؤ يحتاج نتائج حتمية (هدف s1 زيادة الصور).', en: 'Image augmentation creates varied training examples (flip, crop, color) to weaken dependence on position and color and improve generalization; it is applied at training only because prediction needs definitive results (goal of s1 Image Augmentation).' },
        { ar: 'الضبط الدقيق ينقل معرفة نموذج مصدر ضخم: نسخ كل الطبقات ما عدا الإخراج، رأس جديد بعدد أصناف الهدف، ومعدلا تعلم — صغير للمعاملات المنسوخة وعشرة أضعافه للرأس الجديد (هدف s2 الضبط الدقيق).', en: 'Fine-tuning transfers source-model knowledge: copy everything except the output layer, attach a head sized to the target classes, and use two learning rates — small for copied parameters, ten times larger for the fresh head (goal of s2 Fine-Tuning).' },
      ],
      reflectPrompt: {
        ar: 'لو كانت لديك 2000 صورة فقط لمهمة جديدة: أيّ الزيادات ستختار بحسب طبيعة الأجسام، وأي طبقات ستجمّد وأيها ستترك تتدرب — ولماذا؟',
        en: 'With only 2000 images for a new task: which augmentations would you pick given the objects\u2019 nature, and which layers would you freeze or train — and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch14.s1' },
        { book: 'D2L', section: 'd2l.ch14.s2' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch14.s1' },
    { book: 'D2L', section: 'd2l.ch14.s2' },
  ],
} satisfies Lesson;

export default lesson;
