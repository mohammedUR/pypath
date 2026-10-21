import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch8.l3 — "ResNet, DenseNet, and Designing Architectures"
 * ResNet وDenseNet وتصميم البنى
 * Aligned with D2L ch8 s6 (Residual Networks (ResNet) and ResNeXt) +
 * s7 (Densely Connected Networks (DenseNet)) + s8 (Designing Convolution
 * Network Architectures). All expression is original — a paraphrase of the
 * source's ideas, never a verbatim translation. Runnable design: the residual
 * add on scalars (identity survives dead weights), the shape-changing block
 * arithmetic, DenseNet concat growth [3, 13, 23] with a transition, and a
 * stage (channels, resolution) capacity table. Every printed literal verified
 * under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch8.l3',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 8,
  title: {
    ar: 'ResNet وDenseNet وتصميم البنى',
    en: 'ResNet, DenseNet, and Designing Architectures',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch8.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أعمق شبكة بنيتها حتى الآن قد تكون أسوأ من قصيرة: صنف الدوال غير المتداخلة لا يضمن أن الأكبر أقرب إلى الحقيقة. فكرة ResNet البسيطة: اجعل الطبقة الإضافية تتعلم الباقي g(x) = f(x) − x فقط، فيكفيها أن تسكت لتعود الشبكة هوية. وDenseNet ذهبت أبعد: بدل الجمع اجمع المخرجات كلها. ثم تعلم كيف يصمم المهندسون عائلات بنى كاملة لا نموذجًا واحدًا.',
        en: 'The deepest network you can build may be worse than a short one: for non-nested function classes, growing the class does not guarantee getting closer to the truth. ResNet\u2019s simple move: make each extra layer learn only the residual g(x) = f(x) \u2212 x, so it can go silent and the network falls back to the identity. DenseNet went further: instead of adding, concatenate everything. Then you learn how engineers design whole families of architectures rather than one model.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الفئة المتداخلة، ثم التسلسل الكثيف، ثم فضاءات التصميم', en: 'Nested classes, then dense chaining, then design spaces' },
      chunks: [
        {
          ar: 'إذا لم تكن صنوف الدوال متداخلة F ⊆ F′ فقد تبعُد الشبكة الأكبر عن الحقيقة أكثر؛ أما التداخل فيضمن أن الزيادة لا تضر — يكفي أن تتعلم الطبقة الجديدة f(x) = x. كتلة التخلف residual block تجعل هذا سهلًا: بدل أن يتعلم المسار f(x) مباشرة يتعلم g(x) = f(x) − x والمخرج y = x + g(x) قبل التنشيط الأخير (اتصال تخلف skip). كتلتان 3×3 بنفس القنوات تكفيان، وعند تغيير الشكل يدخل التفاف 1×1 بخطوة على فرع المدخل: مدخل 3 قنوات 6×6 يصير 6 قنوات 3×3. وResNeXt يقسم القنوات إلى مجموعات block-diagonal لتخفيف كلفة O(h·w·k²·ci·co).',
          en: 'If function classes are not nested (F \u2286 F\u2032), a bigger network may drift further from the truth; nesting guarantees growth cannot hurt \u2014 the new layer only needs to learn f(x) = x. The residual block makes that easy: instead of learning f(x) directly, the stacked path learns g(x) = f(x) \u2212 x and the output is y = x + g(x) before the last activation (the skip connection). Two 3\u00d73 convs at equal channels suffice; when the shape must change, a strided 1\u00d71 conv joins the input branch: 3 channels of 6\u00d76 become 6 channels of 3\u00d73. ResNeXt splits channels into block-diagonal groups to cut the O(h\u00b7w\u00b7k\u00b2\u00b7ci\u00b7co) bill.',
        },
        {
          ar: 'DenseNet تقارب متسلسل: ResNet فكك الدالة f(x) = x + g(x) حدّين، فماذا لو أردنا كل الحدود؟ الجواب الوصل لا الجمع: x → [x, f\u2081(x), f\u2082([x, f\u2081(x)]), f\u2083([x, f\u2081(x), f\u2082(...)]), ...] — كل كتلة تلتصق مخرجها بمدخلاتها كلها، فتنمو القنوات بمعدل نمو growth rate k ثابت لكل كتلة: 3 قنوات + كتلتان من 10 = 23 قناة. لتحكم في الانفجار تأتي طبقة الانتقال transition: تفاف 1×1 يخفض القنوات ثم تجميع متوسط 2×2 بخطوة 2 ينصّف البعدين (23 → 10 قنوات و8×8 → 4×4). البنية: BN ثم تنشيط ثم التفاف — ترتيب ما قبل التفعيل.',
          en: 'DenseNet goes serial: ResNet decomposed f(x) = x + g(x) into two terms \u2014 what about capturing every term? Concatenate instead of add: x \u2192 [x, f\u2081(x), f\u2082([x, f\u2081(x)]), f\u2083([x, f\u2081(x), f\u2082(...)]), ...] \u2014 each block appends its output to all its inputs, so channels grow by a fixed growth rate k per block: 3 channels + two 10-channel blocks = 23. To tame the blow-up, a transition layer applies a 1\u00d71 conv cutting channels, then 2\u00d72 average pooling with stride 2 halving both dimensions (23 \u2192 10 channels, 8\u00d78 \u2192 4\u00d74). Structure order: BN, then activation, then conv \u2014 the pre-activation arrangement.',
        },
        {
          ar: 'التصميم الحديث يقارن فضاءات لا نماذج: أي شبكة AnyNet = جذع stem يعالج المدخل ثم جسم من مراحل stages يربع كل منها الدقة (ينصّف البعدين) وكل مرحلة كتل منها بعمق d\u1d62 وقنوات c\u1d62 ومجموعات g\u1d62 ونسبة عنق زجاجة k\u1d62، ثم رأس للتصنيف. قيّم توزيع النماذج داخل الفضاء بدل شبكة واحدة، ثم اضغط الفضاء بقيود تجريبية (قنوات متزايدة، عمق متساوٍ) حتى يبقى نمط واحد: RegNet. الدرس: صمم عائلة بمقايضات سرعة/دقة، لا بطلًا واحدًا — كما فعلت VGG قبله.',
          en: 'Modern design compares spaces, not models: any AnyNet = a stem processing the input, then a body of stages that each quarter the resolution (halving both dimensions), every stage holding blocks with depth d\u1d62, channels c\u1d62, groups g\u1d62 and bottleneck ratio k\u1d62, then a classification head. Evaluate the distribution of models inside the space instead of one network, then compress the space with empirical constraints (growing channels, equal depths) until a single pattern remains: RegNet. The lesson: design a family with speed/accuracy trade-offs, not a single champion \u2014 as VGG foreshadowed.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'جمع التخلف بالأرقام + نمو الوصل الكثيف + جدول سعة المراحل',
        en: 'Residual adds in numbers + dense concat growth + a stage capacity table',
      },
      code: "# ---- 1) residual add on a scalar: the identity survives dead weights ----\ndef residual_value(x, w1, w2):\n    return x + w2 * max(0.0, w1 * x)\n\ndef plain_value(x, w1, w2):\n    return w2 * max(0.0, w1 * x)\n\nfor w1, w2 in ((-1.0, 2.0), (0.5, 1.0), (2.0, 0.5)):\n    print('x=3 w1=%.1f w2=%.1f -> plain=%.1f  residual=%.1f' % (w1, w2, plain_value(3.0, w1, w2), residual_value(3.0, w1, w2)))\n\n# ---- 2) shape-changing residual block ----\ndef res_out_shape(n, stride=1):\n    return (n - 1) // stride + 1\n\nprint('Residual(3) on 6x6           -> %d channels, %dx%d' % (3, res_out_shape(6), res_out_shape(6)))\nprint('Residual(6, 1x1conv, stride2) -> %d channels, %dx%d' % (6, res_out_shape(6, 2), res_out_shape(6, 2)))\n\n# ---- 3) DenseNet concat growth + transition ----\ndef dense_channels(c_in, k, num_convs):\n    return c_in + num_convs * k\n\nc = 3\ntrace = [c]\nfor _ in range(2):\n    c += 10                     # growth rate k = 10 per conv block\n    trace.append(c)\nprint('dense block growth:', trace)\nprint('after transition: %d -> 10 channels, 8x8 -> 4x4' % trace[-1])\n\n# ---- 4) a stage capacity table (AnyNet-style) ----\nstages = [(32, 96), (64, 48), (128, 24), (256, 12)]\nfor i, (chs, res) in enumerate(stages):\n    print('stage %d: %3d channels at %2dx%2d' % (i + 1, chs, res, res))\n\ndef conv_params(co, ci, k):\n    return co * (ci * k * k + 1)\n\nblock1 = conv_params(64, 32, 3) + conv_params(64, 64, 3)\nprint('params of a two-conv block in stage 1: %d' % block1)",
      explanation: {
        ar: 'الأوزان الميتة w1 = −1 تسكت المسار غير المتبقي (plain = 0) لكن الكتلة المتبقية تعيد x نفسه = 3.0 — الهوية بلا تعلم؛ ومع w1 = 0.5 يضاف 1.5 فيصير 4.5، ومع w1 = 2 يصير 6.0. كتلة تغيير الشكل: 3 قنوات 6×6 تصير 6 قنوات 3×3 عبر 1×1 بخطوة 2 (6−1)//2+1 = 3. الوصل الكثيف يبني [3, 13, 23] لأن الكتلة الثانية رأت 13 قناة مدخل، ثم طبقة الانتقال ترجعها إلى 10 قنوات على 4×4. جدول السعة يوضح القاعدة: الدقة تُربع كل مرحلة (96→12) والقنوات تتضاعف (32→256)، وكتلة المرحلة الأولى تكلّف 55424 معاملًا.',
        en: 'Dead weights w1 = \u22121 silence the plain path (plain = 0), yet the residual block returns x itself = 3.0 \u2014 identity for free; with w1 = 0.5 it adds 1.5 giving 4.5, and with w1 = 2 it reaches 6.0. The shape-changing block: 3 channels of 6\u00d76 become 6 channels of 3\u00d73 via a strided 1\u00d71 ((6\u22121)//2+1 = 3). Dense concatenation builds [3, 13, 23] because the second block saw 13 input channels, then the transition brings it back to 10 channels on 4\u00d74. The capacity table shows the rule: resolution quarters per stage (96\u219212) while channels double (32\u2192256), and stage-1\u2019s two-conv block costs 55424 parameters.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.residual-and-dense',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ: residual_value(x, w1, w2) لكتلة تخلف عددية: تعيد x + w2·relu(w1·x) حيث relu(v) = max(0, v)؛ وdense_channels(c_in, k, num_convs) تعيد عدد قنوات مخرج كتلة كثيفة من num_convs كتل كل منها k قنوات (الوصلاعلى القنوات).',
        en: 'Implement: residual_value(x, w1, w2) for a scalar residual block returning x + w2\u00b7relu(w1\u00b7x) with relu(v) = max(0, v); and dense_channels(c_in, k, num_convs) returning the output channel count of a dense block of num_convs blocks each contributing k channels (concatenation on channels).',
      },
      starterCode: "def residual_value(x, w1, w2):\n    ...  # TODO: x + w2 * relu(w1 * x)\n\ndef dense_channels(c_in, k, num_convs):\n    ...  # TODO: c_in + num_convs * k\n",
      solution: "def residual_value(x, w1, w2):\n    return x + w2 * max(0.0, w1 * x)\n\ndef dense_channels(c_in, k, num_convs):\n    return c_in + num_convs * k",
      tests: [
        {
          id: 't1',
          name: { ar: 'أوزان ميتة: الكتلة المتبقية تعيد الهوية', en: 'Dead weights: the residual block returns the identity' },
          code: "assert residual_value(3.0, -1.0, 2.0) == 3.0, 'expected 3.0 | actual: %r' % residual_value(3.0, -1.0, 2.0)",
          expected: '3.0',
        },
        {
          id: 't2',
          name: { ar: 'فرع حي: يضاف الباقي', en: 'Live branch: the residual adds' },
          code: "assert abs(residual_value(3.0, 0.5, 1.0) - 4.5) < 1e-9, 'expected 4.5 | actual: %r' % residual_value(3.0, 0.5, 1.0)\nassert abs(residual_value(3.0, 2.0, 0.5) - 6.0) < 1e-9, 'expected 6.0 | actual: %r' % residual_value(3.0, 2.0, 0.5)",
          expected: '4.5 and 6.0',
        },
        {
          id: 't3',
          name: { ar: 'كتلة كثيفة بمثال الكتاب: 3 + 2×10 = 23', en: 'The book dense block: 3 + 2\u00d710 = 23' },
          code: "assert dense_channels(3, 10, 2) == 23, 'expected 23 | actual: %r' % dense_channels(3, 10, 2)",
          expected: '23',
        },
      ],
      hints: [
        { ar: 'relu(v) = max(0.0, v) — عند w1·x سالب يعيد الفرع صفرًا ويبقى x وحده.', en: 'relu(v) = max(0.0, v) \u2014 when w1\u00b7x is negative the branch returns zero and x alone survives.' },
        { ar: 'في الكثيف: الكتلة الأولى تخرج c+k، والثانية ترى c+k مدخلًا فتخرج c+2k — لأن الوصل يراكم كل المخرجات.', en: 'Dense: the first block outputs c+k; the second sees c+k inputs and outputs c+2k \u2014 concatenation accumulates every output.' },
        { ar: 'الصيغة العامة للكتلة الكثيفة: c_out = c_in + num_convs · k (k معدل النمو).', en: 'General dense-block formula: c_out = c_in + num_convs \u00b7 k (k is the growth rate).' },
        { ar: 'قيم تحقق: (3، −1، 2) → 3.0 و(3، 0.5، 1) → 4.5 وdense_channels(3، 12، 4) = 51.', en: 'Sanity: (3, \u22121, 2) \u2192 3.0, (3, 0.5, 1) \u2192 4.5, dense_channels(3, 12, 4) = 51.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-nested-classes',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما الضمان الذي تمنحه اتصالات التخلف عند إضافة طبقات جديدة إلى شبكة عميقة؟',
        en: 'What guarantee do residual connections give when adding new layers to a deep network?',
      },
      options: [
        { id: 'a', text: { ar: 'أن معاملات الشبكة ستنخفض', en: 'That the parameter count will shrink' } },
        { id: 'b', text: { ar: 'أن صنف الدوال يتداخل: الطبقة الجديدة تستطيع أن تتظفر بالهوية (تتعلم g = 0) فلا تكون الشبكة الأعمق أبدًا أسوأ', en: 'That function classes nest: the new layer can capture the identity (learn g = 0), so the deeper network is never worse' } },
        { id: 'c', text: { ar: 'أن التدريب سيتطلب ذاكرة أقل', en: 'That training will need less memory' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'بدون التداخل F ⊆ F′ لا ضمان أن الحل الأفضل في الفئة الأكبر أقرب للحقيقة — قد يبعد.', en: 'Without nesting F \u2286 F\u2032 there is no guarantee the best solution in the bigger class sits closer to the truth \u2014 it may drift away.' },
        { ar: 'المسار المكدس يتعلم g(x) = f(x) − x؛ ولو كانت الهوية هي المطلوب يكفي g = 0 أي أوزان صفرية.', en: 'The stacked path learns g(x) = f(x) \u2212 x; if the identity is desired, g = 0 (zero weights) suffices.' },
        { ar: 'لهذا تستخدم Transformers وRNNs وشبكات الرسوم اتصالات تخلف أيضًا — نفس مبدأ التداخل.', en: 'That is why Transformers, RNNs and graph nets also use residual connections \u2014 the same nesting principle.' },
        { ar: 'الجواب: b.', en: 'Answer: b.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def residual_value(x, w1, w2):\n    return x + w2 * max(0.0, w1 * x)\n\ndef dense_channels(c_in, k, num_convs):\n    return c_in + num_convs * k\n\n# chain two residual blocks: composition stays friendly\nx = 3.0\nfor step, (w1, w2) in enumerate(((-1.0, 2.0), (0.5, 1.0)), start=1):\n    x = residual_value(x, w1, w2)\n    print('after residual block %d: x = %.2f' % (step, x))\n\n# growth-rate arithmetic: how big can a dense block get?\nfor k in (12, 32):\n    c = 64\n    seq = [c]\n    for _ in range(4):\n        c = dense_channels(c, k, 1)\n        seq.append(c)\n    print('growth k=%d over 4 blocks: %s' % (k, seq))\n\n# transitions keep it sane: 1x1 conv then halving\nprint('296 channels at 8x8 -> transition -> 128 channels at 4x4')\n\n# جرّب: شحن سلسلة residual بخمس كتل أوزان ميتة — هل يتغير x إطلاقًا؟\n# try: run a chain of five dead-weight residual blocks - does x change at all?\n# جرّب: عند أي معدل نمو k تتجاوز قنوات DenseNet قنوات المرحلة التلافيفية بعد أربع كتل؟\n# try: at which growth rate k do DenseNet channels overtake the conv stage after four blocks?\n",
      prompt: {
        ar: 'الملعب يركب كتلتين تخلفيتين متتاليتين لترى تراكم البواقي، ثم يحسب نمو قنوات DenseNet بمعدلي نمو عبر أربع كتل ويذكر طبقة الانتقال التي تهدئ الانفجار.',
        en: 'The sandbox stacks two residual blocks so you watch residuals accumulate, then computes DenseNet channel growth at two growth rates across four blocks and points at the transition layer that calms the explosion.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في كتلة التخلف، ماذا يتعلم المسار المكدس مقارنة بالكتلة العادية؟',
            en: 'In a residual block, what does the stacked path learn compared with a regular block?',
          },
          options: [
            { id: 'a', text: { ar: 'f(x) نفسها كما في الكتلة العادية', en: 'f(x) itself, as in a regular block' } },
            { id: 'b', text: { ar: 'الباقي g(x) = f(x) − x فقط، فيكفيها الصفر لتحقيق الهوية', en: 'Only the residual g(x) = f(x) \u2212 x, so zero suffices for the identity' } },
            { id: 'c', text: { ar: 'المدخل x مقلوبًا', en: 'The input x, inverted' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المخرج y = x + g(x): إن كانت f(x) = x هي المطلوب يكفي دفع أوزان الطبقات المكدسة إلى الصفر — أسهل بكثير من تعلم دالة هوية كاملة عبر أوزان مفيدة، وهذا ما يجعل التعميق آمنًا.',
            en: 'The output is y = x + g(x): if f(x) = x is desired, pushing the stacked layers\u2019 weights to zero suffices \u2014 far easier than learning a full identity map through useful weights, and that is what makes deepening safe.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'متى تحتاج كتلة التخلف إلى تفاف 1×1 على فرع الاتصال؟',
            en: 'When does a residual block need a 1\u00d71 convolution on the skip branch?',
          },
          options: [
            { id: 'a', text: { ar: 'دائمًا — لكل كتلة تخلف', en: 'Always \u2014 in every residual block' } },
            { id: 'b', text: { ar: 'عندما يتغير شكل المدخل: قنوات مختلفة أو خطوة 2 تنصّف الأبعاد، فيجب ضبط x قبل الجمع', en: 'When the input shape changes: different channels or a stride-2 halving, so x must be adjusted before the addition' } },
            { id: 'c', text: { ar: 'فقط في الطبقة الأولى من الشبكة', en: 'Only in the network\u2019s first layer' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الجمع y = x + g(x) يتطلب تطابق الأشكال؛ كتلة بخطوة 2 وقنوات مضاعفة تحول 3×6×6 إلى 6×3×3 فيتولى التفاف 1×1 بخطوة 2 على x نفس الضبط: مدخل 4×3×6×6 يصير 4×6×3×3.',
            en: 'The addition y = x + g(x) requires matching shapes; a stride-2 block with doubled channels turns 3\u00d76\u00d76 into 6\u00d73\u00d73, so a strided 1\u00d71 conv on x performs the same adjustment: a 4\u00d73\u00d76\u00d76 input becomes 4\u00d76\u00d73\u00d73.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما وظيفة طبقة الانتقال transition في DenseNet؟',
            en: 'What is the role of a transition layer in DenseNet?',
          },
          options: [
            { id: 'a', text: { ar: 'زيادة معدل النمو k', en: 'Increasing the growth rate k' } },
            { id: 'b', text: { ar: 'ضبط التعقيد: تفاف 1×1 يخفض القنوات ثم تجميع متوسط بخطوة 2 ينصّف الارتفاع والعرض', en: 'Controlling complexity: a 1\u00d71 conv cuts the channels, then average pooling with stride 2 halves height and width' } },
            { id: 'c', text: { ar: 'دمج القنوات بدل وصلها', en: 'Adding channels instead of concatenating' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الوصل المتواصل يضخّم القنوات بلا حدود (3→13→23→...)، فتقصّ طبقة الانتقال القنوات بـ 1×1 وتنصّف الدقة — مثال الكتاب: 23 قناة على 8×8 تصير 10 قنوات على 4×4.',
            en: 'Relentless concatenation inflates channels without bound (3\u219213\u219223\u2192...), so a transition clips them with a 1\u00d71 conv and halves the resolution \u2014 the book\u2019s example: 23 channels on 8\u00d78 become 10 channels on 4\u00d74.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التداخل F ⊆ F′ هو الضمان، وكتلة التخلف تحققه: y = x + g(x) مع g(x) = f(x) − x، وتفاف 1×1 بخطوة عند تغيّر الشكل (3×6×6 → 6×3×3) — وResNeXt يجمع القنوات لتخفيف الكلفة (الهدف من s6 شبكات التخلف ResNet وResNeXt).', en: 'Nesting F \u2286 F\u2032 is the guarantee, and the residual block delivers it: y = x + g(x) with g(x) = f(x) \u2212 x, plus a strided 1\u00d71 conv when shapes change (3\u00d76\u00d76 \u2192 6\u00d73\u00d73) \u2014 ResNeXt groups channels to cut cost (goal of s6 Residual Networks (ResNet) and ResNeXt).' },
        { ar: 'DenseNet توصل لا تجمع: x → [x, f\u2081(x), f\u2082([x, f\u2081(x)])...] فتنمو القنوات بمعدل النمو k (3→13→23)، وطبقة الانتقال (1×1 ثم تجميع 2×2 خطوة 2) تعيد الضبط (23 → 10 على 4×4) بترتيب ما قبل التفعيل (الهدف من s7 الشبكات الكثيفة DenseNet).', en: 'DenseNet concatenates rather than adds: x \u2192 [x, f\u2081(x), f\u2082([x, f\u2081(x)])...] so channels grow by the growth rate k (3\u219213\u219223), and a transition (1\u00d71 then 2\u00d72 stride-2 pooling) restores order (23 \u2192 10 on 4\u00d74), pre-activation style (goal of s7 Densely Connected Networks (DenseNet)).' },
        { ar: 'تصميم البنى صار فضاءات: جذع ثم جسم من مراحل تُربع الدقة وتتضاعف قنواتها (96→12 و32→256) بمعاملات d وc وg وk لكل مرحلة، وتقييم توزيعي يضغط الفضاء إلى RegNet — عائلة بمقايضات لا بطل واحد (الهدف من s8 تصميم بنى الشبكات التلافيفية).', en: 'Architecture design became spaces: a stem, then stages that quarter resolution while doubling channels (96\u219212, 32\u2192256) parameterized by d, c, g, k per stage; distribution-driven evaluation compresses the space into RegNet \u2014 a family of trade-offs, not one champion (goal of s8 Designing Convolution Network Architectures).' },
      ],
      reflectPrompt: {
        ar: 'ResNet تجمع وDenseNet توصل — كلاهما يمرر المعلومات عبر عمق الشبكة بطريقتين مختلفتين تمامًا. لو صممت شبكة لجهاز محدود الذاكرة، أي الفلسفتين تختار ولماذا؟',
        en: 'ResNet adds and DenseNet concatenates \u2014 both pass information across depth in utterly different ways. For a memory-limited device, which philosophy would you pick, and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch8.s6' },
        { book: 'D2L', section: 'd2l.ch8.s7' },
        { book: 'D2L', section: 'd2l.ch8.s8' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch8.s6' },
    { book: 'D2L', section: 'd2l.ch8.s7' },
    { book: 'D2L', section: 'd2l.ch8.s8' },
  ],
} satisfies Lesson;

export default lesson;
