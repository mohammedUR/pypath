import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch8.l1 — "From AlexNet to NiN"
 * من AlexNet إلى NiN
 * Aligned with D2L ch8 s1 (Deep Convolutional Neural Networks (AlexNet)) +
 * s2 (Networks Using Blocks (VGG)) + s3 (Network in Network (NiN)). All
 * expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: verified shape traces and parameter
 * counts for AlexNet and VGG-11, the two-3x3-vs-5x5 arithmetic, and a
 * global-average-pooling demo. Every printed literal verified under
 * CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch8.l1',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 8,
  title: {
    ar: 'من AlexNet إلى NiN',
    en: 'From AlexNet to NiN',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch7.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'عام 2012 فازت AlexNet بمسابقة ImageNet بفارق ساحق، فتحولت الصناعة من خصائص تُصمم يدويًا إلى خصائص تُتعلم. لكن أعمق أثر تركته فلسفتان: VGG حوّلت الشبكات إلى كتل مكررة تُركّب بحلقة، وNiN قتلت طبقات الاتصال الكامل العملاقة. في هذا الدرس تقرأ البنى الثلاث بالحساب فقط: تتبع الأشكال وتحسب المعاملات رقمًا رقمًا لتكتشف أين تذهب الملايين فعلًا.',
        en: 'In 2012 AlexNet won ImageNet by a landslide, and the field pivoted from hand-designed features to learned ones. But its deepest legacy is two ideas: VGG turned networks into repeatable blocks you compose with a loop, and NiN killed the giant fully connected layers. In this lesson you read all three architectures through pure arithmetic: trace the shapes and count the parameters number by number to see where the millions actually go.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ثلاث خطوات نحو التصميم الحديث', en: 'Three steps toward modern design' },
      chunks: [
        {
          ar: 'AlexNet شبكة من 8 طبقات: خمس تلافيفية (نوى 11×11 ثم 5×5 ثم 3×3) وثلاث متصلة بالكامل منها طبقة الإخراج، مع تجميع أعظمي 3×3 بخطوة 2 بعد الطبقات الأولى والخامسة، وقنوات أكثر من LeNet بعشرة أضعاف. ثلاث تحولات جوهرية: ReLU بدل sigmoid فمشتقته 1 في الموجب لا تختنق مع أي تهيئة، وdropout بقيمة 0.5 على الطبقتين الكبيرتين للتحكم في السعة، وتوسيع البيانات (قلب وقص وتغيير ألوان). على مدخل 224: 54 → تجميع 26 → 12 → 5 ثم flatten 6400 وطبقتا 4096.',
          en: 'AlexNet is an 8-layer net: five convolutional (kernels 11\u00d711, then 5\u00d75, then 3\u00d73) and three fully connected including the output, with 3\u00d73 max-pooling at stride 2 after the first, second and fifth conv layers, and ten times LeNet\u2019s channels. Three fundamental shifts: ReLU instead of sigmoid, whose derivative of 1 on positives never chokes regardless of initialization; dropout at 0.5 on the two big dense layers for capacity control; and data augmentation (flipping, cropping, color changes). On a 224 input: 54 \u2192 pool 26 \u2192 12 \u2192 5, then flatten 6400 into two 4096 layers.',
        },
        {
          ar: 'VGG أدخلت فكرة الكتل: block = عدة التفافات 3×3 بحشو 1 تحفظ الحجم + ReLU، ثم تجميع أعظمي 2×2 بخطوة 2 ينصّف. VGG-11 خمس كتل بأعداد تلافيف (1، 1، 2، 2، 2) وقنوات تتضاعف 64 حتى 512. سؤال المصممين: عمق أم عرض؟ تلافيفان 3×3 تلامسان البكسلات نفسها التي تلمسها 5×5 لكن بأوزان 18c² مقابل 25c² — ومع تنشيط بينهما فالعمق الضيق فاز، فصارت 3×3 المعيار الذهبي. والأهم أن arch قائمة أزواج (عدد التلافيف، القنوات) تجعل الشبكة عائلة كاملة لا نموذجًا واحدًا.',
          en: 'VGG introduced blocks: a block = several 3\u00d73 convs with padding 1 preserving size + ReLU, then a 2\u00d72 max-pool with stride 2 that halves. VGG-11 has five blocks with (1, 1, 2, 2, 2) convolutions and channels doubling from 64 to 512. The designers\u2019 question: depth or width? Two 3\u00d73 convs touch the same pixels as one 5\u00d75 but cost 18c\u00b2 weights versus 25c\u00b2 \u2014 and with an activation in between, deep-narrow won, making 3\u00d73 the gold standard. Crucially, arch is a list of (num_convs, channels) pairs, turning the network into a whole family rather than one model.',
        },
        {
          ar: 'NiN هاجمت الطبقات العملاقة: حتى VGG-11 يحتاج مصفوفة تستهلك مئات الميغابايتات، وخلط الاتصال الكامل مبكرًا يدمّر البنية المكانية. الحل من شقين: كتلة NiN = التفاف كبير + تلافيفان 1×1 (طبقة كثيفة لكل بكسل عبر القنوات فتضيف لاخطية بلا ثمن مكاني)، ثم في الرأس global average pooling يوسط كل خريطة سمات إلى رقم واحد بدل المصفوفة الضخمة: خريطة 10×5×5 تتحول مباشرة إلى متجه 10. النتيجة معاملات أقل بمراتب — وأثرهما باقٍ في كل البنى الحديثة.',
          en: 'NiN attacked the giant layers: even VGG-11 needs a matrix costing hundreds of MB of RAM, and inserting dense layers early destroys spatial structure. The fix has two prongs: a NiN block = one large conv + two 1\u00d71 convs (a per-pixel dense layer across channels, adding nonlinearity with no spatial cost), and in the head, global average pooling averages each feature map to a single number instead of the huge matrix: a 10\u00d75\u00d75 map becomes a 10-vector directly. The result is orders-of-magnitude fewer parameters \u2014 and both prongs survive in every modern architecture.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'تتبع AlexNet وVGG-11 بالأشكال والمعاملات + حساب 3×3 مقابل 5×5',
        en: 'AlexNet and VGG-11 shape/parameter traces + the 3x3-vs-5x5 arithmetic',
      },
      code: "def conv_out(n, k, p=0, s=1):\n    return (n - k + 2 * p) // s + 1\n\ndef pool_out(n, k, s=1):\n    return (n - k) // s + 1\n\ndef conv_params(co, ci, k):\n    return co * (ci * k * k + 1)\n\ndef fc_params(nout, nin):\n    return nout * (nin + 1)\n\n# ---- AlexNet on 224x224: shape trace ----\na = conv_out(224, 11, p=1, s=4)   # 11x11 stride 4 padding 1\nprint('alexnet conv1 -> %d' % a)\na = pool_out(a, 3, 2)\na = conv_out(a, 5, p=2)\na = pool_out(a, 3, 2)\nprint('alexnet after pool2 -> %d' % a)\na = conv_out(a, 3, p=1)\na = conv_out(a, 3, p=1)\na = conv_out(a, 3, p=1)\na = pool_out(a, 3, 2)\nprint('alexnet after pool3 -> %d, flatten %d' % (a, 256 * a * a))\n\n# ---- AlexNet parameters ----\nalex_conv = (conv_params(96, 1, 11) + conv_params(256, 96, 5) + conv_params(384, 256, 3)\n             + conv_params(384, 384, 3) + conv_params(256, 384, 3))\nalex_fc = fc_params(4096, 6400) + fc_params(4096, 4096) + fc_params(10, 4096)\nprint('alexnet conv=%d  fc=%d  total=%d' % (alex_conv, alex_fc, alex_conv + alex_fc))\n\n# ---- VGG-11: five blocks, channels double ----\narch = [(1, 64), (1, 128), (2, 256), (2, 512), (2, 512)]\nn = 224\nci = 1\ntotal_conv = 0\nfor num_convs, ch in arch:\n    for _ in range(num_convs):\n        total_conv += conv_params(ch, ci, 3)\n        ci = ch\n    n = n // 2\n    print('vgg block -> %d x %d x %d' % (ch, n, n))\nvgg_fc = fc_params(4096, 512 * n * n) + fc_params(4096, 4096) + fc_params(10, 4096)\nprint('vgg flatten %d  conv=%d  fc=%d  total=%d' % (512 * n * n, total_conv, vgg_fc, total_conv + vgg_fc))\n\n# ---- two 3x3 vs one 5x5 (same channels c) ----\nc = 64\nprint('2x(3x3)=%d  1x(5x5)=%d  3x(3x3)=%d' % (2 * 9 * c * c, 25 * c * c, 3 * 9 * c * c))",
      explanation: {
        ar: 'مسار AlexNet: (224+2−11)//4+1 = 54 ثم تجميع إلى 26، والتفاف 5×5 يحفظ 26 فتجميع إلى 12، وثلاثة تلافيف 3×3 تبقى 12 فتجميع إلى 5 — flatten 256×25 = 6400. الحساب يكشف مفاجأة: التلافيف كلها 3,723,968 معاملًا فقط بينما الطبقات المتصلة 43,040,778 — 92% من النموذج في الذيل! في VGG-11 تتبع الكتل 112→56→28→14→7 بقنوات 64→512، والتلافيف 9,219,328 مقابل 119,586,826 للطبقات الكثيفة (flatten 512×49 = 25088)، والمجموع 128,806,154. أما مقارنة c = 64: تلافيفان 3×3 تكلفان 73,728 مقابل 102,400 لـ 5×5، وثلاث تلافيف 110,592 ≈ مال 5×5 — هكذا يُشترى العمق بثمن العرض.',
        en: 'The AlexNet trace: (224+2\u221211)//4+1 = 54, pool to 26, a 5\u00d75 conv keeps 26, pool to 12, three 3\u00d73 convs keep 12, pool to 5 \u2014 flatten 256\u00d725 = 6400. The count reveals a surprise: all convolutions together hold only 3,723,968 parameters while the dense layers hold 43,040,778 \u2014 92% of the model lives in the tail! For VGG-11 the blocks trace 112\u219256\u219228\u219214\u21927 with channels 64\u2192512, convolutions at 9,219,328 versus 119,586,826 dense (flatten 512\u00d749 = 25088), totaling 128,806,154. And for c = 64: two 3\u00d73 convs cost 73,728 versus 102,400 for one 5\u00d75, while three 3\u00d73 hit 110,592 \u2248 the 5\u00d75 price \u2014 depth bought at width\u2019s cost.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.vgg-param-count',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ conv_params(co, ci, k) التي تُعيد عدد معاملات طبقة التفاف مع الانحياز: co·(ci·k·k + 1)؛ ثم vgg11_conv_params() تجمع معاملات كل طبقات VGG-11 التلافيفية على الترتيب arch المعطى (القنوات تتضاعف من 64 حتى 512، والقناة الداخلة للكتلة الأولى هي 1).',
        en: 'Implement conv_params(co, ci, k) returning a conv layer\u2019s parameter count with bias: co\u00b7(ci\u00b7k\u00b7k + 1); then vgg11_conv_params() accumulating every convolution of VGG-11 over the given arch (channels double from 64 to 512; the first block\u2019s input channel count is 1).',
      },
      starterCode: "arch = [(1, 64), (1, 128), (2, 256), (2, 512), (2, 512)]\n\ndef conv_params(co, ci, k):\n    ...  # TODO: co * (ci * k * k + 1)\n\ndef vgg11_conv_params():\n    ...  # TODO: walk arch, chain the channel counts, accumulate\n",
      solution: "arch = [(1, 64), (1, 128), (2, 256), (2, 512), (2, 512)]\n\ndef conv_params(co, ci, k):\n    return co * (ci * k * k + 1)\n\ndef vgg11_conv_params():\n    total = 0\n    ci = 1\n    for num_convs, ch in arch:\n        for _ in range(num_convs):\n            total += conv_params(ch, ci, 3)\n            ci = ch\n    return total",
      tests: [
        {
          id: 't1',
          name: { ar: 'أول التفاف في VGG: 64 قناة من قناة واحدة', en: 'First VGG conv: 64 channels from 1' },
          code: "assert conv_params(64, 1, 3) == 640, 'expected 640 | actual: %r' % conv_params(64, 1, 3)",
          expected: '640',
        },
        {
          id: 't2',
          name: { ar: 'التفاف 256 من 256: 590080', en: 'A 256-from-256 conv: 590080' },
          code: "assert conv_params(256, 256, 3) == 590080, 'expected 590080 | actual: %r' % conv_params(256, 256, 3)",
          expected: '590080',
        },
        {
          id: 't3',
          name: { ar: 'مجموع تلافيف VGG-11 = 9219328', en: 'All VGG-11 convolutions = 9219328' },
          code: "assert vgg11_conv_params() == 9219328, 'expected 9219328 | actual: %r' % vgg11_conv_params()",
          expected: '9219328',
        },
      ],
      hints: [
        { ar: 'كل convParams = co × (ci·9 + 1) — الانحياز واحد لكل قناة مخرج.', en: 'Each conv contributes co \u00d7 (ci\u00b79 + 1) \u2014 one bias per output channel.' },
        { ar: 'القناة الداخلة للكتلة الأولى 1، وبعد كل التفاف تصبح القناة الداخلة التالية هي القنوات المخرجة نفسها.', en: 'The first block\u2019s input is 1 channel; after each conv the next input count is that conv\u2019s output count.' },
        { ar: 'الكتلة الثالثة مثلًا: 128→256 ثم 256→256 (كلا التلافيفين يخرج 256).', en: 'For example block 3: 128\u2192256 then 256\u2192256 (both convs output 256).' },
        { ar: 'قيم تحقق: (64، 1، 3) = 640 و(128، 64، 3) = 73856 والمجموع 9,219,328.', en: 'Sanity: (64, 1, 3) = 640 and (128, 64, 3) = 73856, total 9,219,328.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-deep-vs-wide',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا فضّل مصممو VGG تلافيفين 3×3 متتاليتين على تلافيف 5×5 واحدة بنفس القنوات؟',
        en: 'Why did VGG\u2019s designers prefer two stacked 3\u00d73 convolutions over a single 5\u00d75 with the same channel count?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن النافذة الأصغر ترى حقل إدراك أكبر', en: 'Because the smaller window sees a larger receptive field' } },
        { id: 'b', text: { ar: 'لأنهما تلامسان المدى المكاني نفسه (5×5) بأوزان أقل 18c² مقابل 25c²، ومع تنشيط إضافي بينهما — العمق الضيق فاز تجريبيًا', en: 'They cover the same 5\u00d75 receptive field with fewer weights, 18c\u00b2 versus 25c\u00b2, plus an extra activation \u2014 deep-narrow won empirically' } },
        { id: 'c', text: { ar: 'لأن التفافين يقلّصان الارتفاع والعرض مرتين', en: 'Because two convolutions halve height and width twice' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'تلافيفان 3×3 متتاليتان: كل بكسل في النافذة الثانية يرى 3×3 من مخرج الأولى الذي رأى 3×3 — الحقل 5×5.', en: 'Two stacked 3\u00d73 convs: each pixel of the second window sees 3\u00d73 of the first output, which itself saw 3\u00d73 \u2014 a 5\u00d75 field.' },
        { ar: 'بحساب الأوزان لنفس c: 2×9c² = 18c² مقابل 25c² — توفير 28% مع ReLU إضافية.', en: 'Count weights for the same c: 2\u00d79c\u00b2 = 18c\u00b2 versus 25c\u00b2 \u2014 a 28% saving plus an extra ReLU.' },
        { ar: 'حشو 1 في كل التفاف 3×3 يحفظ الحجم — لا انكماش يُذكر بين التلافيفين.', en: 'Padding 1 in every 3\u00d73 conv preserves size \u2014 no shrinkage happens between the two convs.' },
        { ar: 'الجواب: b.', en: 'Answer: b.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def conv_params(co, ci, k):\n    return co * (ci * k * k + 1)\n\ndef fc_params(nout, nin):\n    return nout * (nin + 1)\n\n# 1) NiN's head: global average pooling instead of a giant matrix\nmaps = [[[1.0, 2.0], [3.0, 4.0]], [[5.0, 6.0], [7.0, 8.0]], [[9.0, 1.0], [2.0, 3.0]]]\ngap = [sum(sum(row) for row in m) / (len(m) * len(m[0])) for m in maps]\nprint('maps 3 x 2x2  -> GAP vector:', gap)\nprint('GAP params: 0   vs FC(25088->4096):', fc_params(4096, 25088))\n\n# 2) where does AlexNet keep its parameters?\nconv = conv_params(96, 1, 11) + conv_params(256, 96, 5) + conv_params(384, 256, 3) \\\n     + conv_params(384, 384, 3) + conv_params(256, 384, 3)\nfc = fc_params(4096, 6400) + fc_params(4096, 4096) + fc_params(10, 4096)\nprint('alexnet conv share: %.1f%%' % (100.0 * conv / (conv + fc)))\n\n# 3) the 1x1 trick: two 96-channel convs inside a NiN block\nprint('nin block1: 11x11=%d + two 1x1: %d each' % (conv_params(96, 1, 11), conv_params(96, 96, 1)))\n\n# جرّب: احسب نسبة معاملات VGG-11 الموجودة في الذيل الكثيف — أين تسكن الملايين؟\n# try: compute the share of VGG-11 parameters living in the dense tail - where do the millions reside?\n# جرّب: كيف يتغير مجموع VGG لو تضاعفت القنوات في كل كتلة من 128 بدل 64؟\n# try: how does the VGG total change if every block doubles channels starting from 128 instead of 64?\n",
      prompt: {
        ar: 'الملعب يطبق global average pooling على خرائط سمات صغيرة ويقارنه بطبقة كثيفة بعشرات الملايين، ثم يقيس حصة AlexNet التلافيفية من معاملاتها، ويحسب ثمن كتلة NiN الأولى مع تلافيفي 1×1.',
        en: 'The sandbox applies global average pooling to small feature maps and contrasts it with a tens-of-millions dense layer, measures what share of AlexNet\u2019s parameters are convolutional, and prices NiN\u2019s first block with its two 1\u00d71 convs.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي تغيير في AlexNet عالج مشكلة تلاشي التدرجات المرتبطة بـ sigmoid؟',
            en: 'Which change in AlexNet addressed the sigmoid-related vanishing-gradient problem?',
          },
          options: [
            { id: 'a', text: { ar: 'التحول إلى ReLU الذي مشتقته 1 في المدى الموجب فلا تختنق التدرجات مهما كانت التهيئة', en: 'Switching to ReLU, whose derivative is 1 on positives so gradients never choke regardless of initialization' } },
            { id: 'b', text: { ar: 'تكبير نوى الالتفاف إلى 11×11', en: 'Enlarging the conv kernels to 11\u00d711' } },
            { id: 'c', text: { ar: 'تقليل عدد القنوات إلى عشر', en: 'Reducing the channel count tenfold' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'sigmoid قرب التشبع (0 أو 1) تختفي مشتقته فتتوقف بعض المعاملات عن التحديث؛ ReLU بخط مستقيم في الموجب يُبقي التدرج حيًا — وهو جزء من قصة الاستقرار العددي من الدرس السابق، مع dropout 0.5 وتوسيع البيانات للتحكم في السعة.',
            en: 'Near saturation (0 or 1) sigmoid\u2019s derivative disappears and some parameters stop updating; ReLU\u2019s straight line on positives keeps gradients alive \u2014 part of the previous lesson\u2019s numerical-stability story, alongside dropout 0.5 and augmentation for capacity control.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كتلة VGG واحدة بتلافيفين وقنوات 256: ماذا يحدث للارتفاع والعرض عبر الكتلة؟',
            en: 'One VGG block with two convolutions at 256 channels: what happens to height and width across the block?',
          },
          options: [
            { id: 'a', text: { ar: 'ينصّف مرة مع كل التفاف (نصفان إجمالًا)', en: 'They halve once per convolution (twice total)' } },
            { id: 'b', text: { ar: 'تبقى بلا تغيير خلال التلافيفين (حشو 1)، ثم تنصّف مرة واحدة في التجميع الختامي', en: 'They stay unchanged through both convs (padding 1), then halve once in the closing max-pool' } },
            { id: 'c', text: { ar: 'تتضاعف القنوات ويظل البعد كما هو', en: 'Channels double while the size stays' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التفاف 3×3 بحشو 1 محايد للشكل، فالكتلة كلها تحسم هبوط الدقة في تجميع 2×2 بخطوة 2: سلسلة قابلة للتنبؤ 224→112→56→28→14→7 عبر الكتل الخمس.',
            en: 'A 3\u00d73 conv with padding 1 is shape-neutral, so the whole block concentrates resolution loss into its 2\u00d72 stride-2 max-pool: a predictable chain 224\u2192112\u219256\u219228\u219214\u21927 across the five blocks.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما الدوران التكميليان لتلافيف 1×1 والتجميع المتوسط الشامل في NiN؟',
            en: 'What are the complementary roles of 1\u00d71 convolutions and global average pooling in NiN?',
          },
          options: [
            { id: 'a', text: { ar: 'توفير لاخطية لكل بكسل عبر القنوات، ثم استبدال طبقات الاتصال العملاقة بمتوسط لكل خريطة سمات', en: 'Per-pixel channel-wise nonlinearity, then replacing giant fully connected layers with one average per feature map' } },
            { id: 'b', text: { ar: 'تقليل القنوات ثم ضاعفتها', en: 'Reducing channels, then doubling them' } },
            { id: 'c', text: { ar: 'زيادة الدقة المكانية ثم خفضها', en: 'Raising spatial resolution, then lowering it' } },
          ],
          answer: 'a',
          explanation: {
            ar: '1×1 طبقة كثيفة على بُعد القنوات لكل موقع فتضيف لاخطية معلومة، وglobal average pooling يحوّل خريطة classes×5×5 إلى متجه مباشرة بلا معاملات — معًا يزيلان مصفوفة flatten الضخمة ويخفضان المعاملات بمراتب.',
            en: 'A 1\u00d71 conv is a dense layer on the channel axis at each location, adding learnable nonlinearity; global average pooling turns a classes\u00d75\u00d75 map straight into a vector with zero parameters \u2014 together they eliminate the huge flatten matrix and cut parameters by orders of magnitude.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'AlexNet 8 طبقات بنوى 11→5→3 وReLU وdropout 0.5 وتوسيع بيانات — وتتبعها 54→26→12→5 وflatten 6400 يكشف أن 92% من معاملاتها في الذيل الكثيف (الهدف من s1 شبكات الالتفاف العميقة AlexNet).', en: 'AlexNet, 8 layers with 11\u21925\u21923 kernels, ReLU, dropout 0.5 and augmentation \u2014 its trace 54\u219226\u219212\u21925 and flatten 6400 reveal 92% of parameters live in the dense tail (goal of s1 Deep Convolutional Neural Networks (AlexNet)).' },
        { ar: 'VGG كتلة = تلافيف 3×3 بحشو 1 + تجميع ينصّف، وarch قائمة أزواج تجعلها عائلة؛ وتلافيفان 3×3 (18c²) يكافئان 5×5 (25c²) فصار العمق الضيق معيارًا — VGG-11: أشكال 112→7 ومعاملات 128,806,154 معظمها كثيف (الهدف من s2 الشبكات بالكتل VGG).', en: 'VGG: a block = 3\u00d73 convs with padding 1 + a halving pool, and arch is a list of pairs making it a family; two 3\u00d73 convs (18c\u00b2) match one 5\u00d75 (25c\u00b2), crowning deep-narrow \u2014 VGG-11: shapes 112\u21927, 128,806,154 parameters, mostly dense (goal of s2 Networks Using Blocks (VGG)).' },
        { ar: 'NiN قتل العملاق: تلافيف 1×1 لاخطية لكل بكسل عبر القنوات + global average pooling يبني المخرج بلا معاملات — فتنهار المعاملات بمراتب وتبقى الفكرة في كل البنى الحديثة (الهدف من s3 الشبكة داخل الشبكة NiN).', en: 'NiN killed the giant: 1\u00d71 convs add per-pixel channel-wise nonlinearity and global average pooling builds the output with zero parameters \u2014 orders of magnitude fewer weights, an idea surviving in every modern architecture (goal of s3 Network in Network (NiN)).' },
      ],
      reflectPrompt: {
        ar: 'الحساب أظهر أن الطبقات الكثيفة تبتلع المعاملات بينما التلافيف رخيصة. لماذا إذن صمدت البنى الحديثة على تقليل الذيل الكثيف تحديدًا، ومتى يستحق الاتصال الكامل ثمنه رغم كل شيء؟',
        en: 'The arithmetic showed dense layers swallow parameters while convolutions are cheap. Why did modern architectures specifically target the dense tail, and when is full connectivity still worth its price?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch8.s1' },
        { book: 'D2L', section: 'd2l.ch8.s2' },
        { book: 'D2L', section: 'd2l.ch8.s3' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch8.s1' },
    { book: 'D2L', section: 'd2l.ch8.s2' },
    { book: 'D2L', section: 'd2l.ch8.s3' },
  ],
} satisfies Lesson;

export default lesson;
