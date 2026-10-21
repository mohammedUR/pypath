import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch1.l2 — "From Least Squares to the GPU Era"
 * من المربعات الصغرى إلى عصر المعالجات الرسومية
 * Aligned with D2L ch1 s4 (Roots) + s5 (The Road to Deep Learning) +
 * s6 (Success Stories). All expression is original — a paraphrase of the
 * source's ideas, never a verbatim translation. Runnable design: a printed
 * timeline + decade growth factors + the 2-8-8-1 parameter breakdown
 * (w=88, b=17, total=105); exercise 1 rebuilds Köbel's trimmed mean.
 * Every literal verified under CPython 3. Deterministic only: no input(),
 * no exit(), no unittest.main, no seeding needed.
 */
const lesson = {
  id: 'd2l.ch1.l2',
  version: 1,
  part: 'II',
  track: 'A1',
  book: 'D2L',
  chapter: 1,
  title: {
    ar: 'من المربعات الصغرى إلى عصر المعالجات الرسومية',
    en: 'From Least Squares to the GPU Era',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch1.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'فكرة «تعلّم من البيانات» ليست وليدة العقد الأخير: غاوس كان يلائم خطوطًا بالمربعات الصغرى قبل قرنين، وعلماء الأعصاب ألهمت اسم «الشبكة العصبية» قبل قرن. فماذا كان ينقص؟ البيانات والعتاد. في هذا الدرس تمشي خطًا زمنيًا من بايز إلى Transformer، وتحسب بنفسك كيف ينفجر عدد معاملات شبكة صغيرة 2-8-8-1 إلى 105 — ثم تفهم لماذا اشتعلت الأفكار القديمة فجأة بعد 2012.',
        en: 'Learning from data is not a product of the last decade: Gauss was fitting lines by least squares two centuries ago, and neuroscience inspired the name "neural network" a century ago. So what was missing? Data and hardware. In this lesson you will walk a timeline from Bayes to the Transformer, compute yourself how a tiny 2-8-8-1 network already needs 105 parameters — and then understand why the old ideas suddenly caught fire after 2012.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'جذور قديمة وطريق مفجّر وقصص نجاح', en: 'Old roots, an explosive road, and success stories' },
      chunks: [
        {
          ar: 'الجذور إحصائية وعصبية معًا: توزيعا Bernoulli وGaussian قديمان، وغاوس ابتكر المربعات الصغرى الذي ما يزال عمود حساب التأمين والتشخيص (قانون أوم نفسه نموذج خطي!). في العصور الوسطى قدّم كوبل أول «متوسط مقصوص»: 16 رجلًا يقيسون القدم ويُسقط الطرفان قبل المتوسط. ثم فيشر والإحصاء الحديث، وشانون ونظرية المعلومات، وتورنغ وسؤال «هل تستطيع الآلات التفكير؟» عام 1950. ومن الأعصاب: قاعدة هيب «ما اشتعل معًا تواصل معًا» عام 1949، والبيرسبترون لروزنبلات — وهي أصول خوارزميات الانحدار الاشتقاقي. اسم «عصبية» بقي والتفسير الحرفي خفّ: تبادل طبقات خطية وغير خطية، وسلسلة قواعد لضبط كل المعاملات دفعة واحدة (backpropagation). ثم خفت الصوت 1995-2005: الحوسبة غالية والبيانات صغيرة (MNIST كانت «ضخمة») فتفوقت طرائق النواة والأشجار.',
          en: 'The roots are statistical and neural at once: the Bernoulli and Gaussian distributions are ancient, Gauss invented least squares still powering insurance and diagnostics (even Ohm\u2019s law is a linear model!). In the middle ages K\u00f6bel offered the first "trimmed mean": measure 16 men\u2019s feet, drop the extremes, average the rest. Then Fisher and modern statistics, Shannon\u2019s information theory, and Turing\u2019s 1950 question "can machines think?". From neuroscience: Hebb\u2019s 1949 "fire together, wire together" and Rosenblatt\u2019s perceptron — ancestors of today\u2019s gradient-based algorithms. The biological name stuck while the literal reading faded: alternating linear and nonlinear layers, plus the chain rule adjusting all parameters at once (backpropagation). Then 1995-2005 went quiet: compute was expensive, data small (MNIST counted as "huge"), so kernel methods and trees won.',
        },
        {
          ar: 'ما الذي أشعل الشرارة؟ ثلاثة وقود: بيانات هائلة من الويب والحساسات الرخيصة (من 100 عينة Iris عام 1970 إلى تريليون سجل 2020 — نمو ×10\u00b9\u2070)، وحوسبة رخيصة عبر GPUs الموجهة للألعاب (من 100 KF إلى 1 PF في نصف قرن)، وخوارزميات أذكى: dropout ضد التلائم الزائد، وآليات الانتباه، ومعمارية Transformer ذات التوسع الجميل، ونماذج اللغة، وGANs ونماذج الانتشار التوليدية، والتدريب الموزع على آلاف البطاقات. لذلك أُعيد اكتشاف MLP وCNN وLSTM القديمة. والنتائج تكلّمت: مساعدات صوتية، وتعرّف أهداف بانخفاض خطأ ImageNet من 28% عام 2010 إلى 2.25% عام 2017، وألغازو في Go، وبوكر، وقيادة شبه ذاتية، وترجمة فورية — مع بقاء القلق الأقرب العدل والتحيز لا الخيال العلمي.',
          en: 'What lit the fire? Three fuels: web-scale data from cheap sensors (from 100 Iris samples in 1970 to a trillion records in 2020 — \u00d710\u00b9\u2070 growth), cheap computation through gaming GPUs (100 KF to 1 PF in half a century), and smarter algorithms: dropout against overfitting, attention mechanisms, the beautifully scaling Transformer architecture, language models, GANs and diffusion for generation, and distributed training across thousands of cards. Old MLPs, CNNs and LSTMs were rediscovered. Results followed: voice assistants, object recognition with ImageNet top-5 error falling from 28% in 2010 to 2.25% in 2017, AlphaGo at Go, poker bots, semi-autonomous driving, live translation — while the nearest worry remains fairness and bias, not science fiction.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'خط زمني + عقدان من النمو + عدّ معاملات',
        en: 'A timeline + two growth curves + counting parameters',
      },
      code: "timeline = [\n    (1687, 'precise natural laws arrive; fitting data follows soon after'),\n    (1763, 'Bayes: a theorem for reasoning under uncertainty'),\n    (1805, 'least squares: fit a line by minimizing squared error'),\n    (1943, 'McCulloch and Pitts model a neuron as a threshold unit'),\n    (1949, 'Hebb: neurons that fire together wire together'),\n    (1958, 'Rosenblatt trains the perceptron'),\n    (1986, 'backpropagation spreads: the chain rule trains whole networks'),\n    (1998, 'convolutional networks read handwritten digits'),\n    (2012, 'GPUs plus ImageNet: deep networks win by a wide margin'),\n    (2017, 'the Transformer: attention replaces recurrence'),\n]\n\nfor year, what in timeline:\n    print('%d  %s' % (year, what))\n\nfirst = (1970, 1e2, 1e5)\nlast = (2020, 1e12, 1e15)\nprint('dataset growth %d->%d: %.0e | flops growth: %.0e' % (first[0], last[0], last[1] / first[1], last[2] / first[2]))\n\ndef params(sizes):\n    w = sum(sizes[i] * sizes[i + 1] for i in range(len(sizes) - 1))\n    b = sum(sizes[1:])\n    return w, b\n\nw, b = params([2, 8, 8, 1])\nprint('net 2-8-8-1: weights = %d | biases = %d | total = %d' % (w, b, w + b))",
      explanation: {
        ar: 'الخط الزمني يكشف نمطين: أفكار قديمة جدًا (بايز 1763، مربعات غاوس) وأفكار عصبية (1943-1986) — كلها سبقت 2012 بوقت طويل. جدول العقد في الكتاب يقول الباقي: البيانات نمت من 100 (Iris) إلى 10\u00b9\u00b2 والعمليات الفاصلة من 10\u2075 إلى 10\u00b9\u2075 — كلاهما ×10\u00b9\u2070. وأي شبكة حتى الصغيرة تحتاج معاملات كثيرة: 2→8 تعطي 16 وزنًا، و8→8 تعطي 64، و8→1 تعطي 8 — المجموع 88 وزنًا زائد 8+8+1=17 انحيازًا = 105. تخيّل مدخلات صورة 200\u00d7200\u00d73!',
        en: 'The timeline shows two patterns: very old ideas (Bayes 1763, Gauss\u2019s least squares) and neural ones (1943-1986) — all long before 2012. The book\u2019s decade table says the rest: data grew from 100 (Iris) to 10\u00b9\u00b2 records and floating-point speed from 10\u2075 to 10\u00b9\u2075 FLOPS — both \u00d710\u00b9\u2070. And even a tiny network needs many parameters: 2\u21928 gives 16 weights, 8\u21928 gives 64, 8\u21921 gives 8 — 88 weights plus 8+8+1=17 biases = 105 total. Now imagine a 200\u00d7200\u00d73 image input!',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trimmed-mean',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أعد بناء «خوارزمية» كوبل: trimmed_mean(values) ترتب النسخة، تسقط أصغر قيمة وأكبر قيمة (واحدة من كل)، وتعيد متوسط الباقي. جرّبها على أطوال أقدام الـ 16.',
        en: 'Rebuild K\u00f6bel\u2019s algorithm: trimmed_mean(values) sorts a copy, drops one smallest and one largest value, and returns the mean of the rest. Try it on the 16 foot lengths.',
      },
      starterCode: "def trimmed_mean(values):\n    ...  # TODO: sort a copy, slice off the ends, average the middle\n\nfeet = [22, 25, 25, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 29, 29, 33]\nprint('plain mean:', sum(feet) / len(feet))\nprint('trimmed mean:', trimmed_mean(feet))\n",
      solution: "def trimmed_mean(values):\n    vs = sorted(values)\n    core = vs[1:-1]\n    return sum(core) / len(core)",
      tests: [
        {
          id: 't1',
          name: { ar: 'أقدام كوبل تعطي 27.0 بعد القص', en: 'K\u00f6bel\u2019s feet give 27.0 after trimming' },
          code: "feet = [22, 25, 25, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 29, 29, 33]\nassert abs(trimmed_mean(feet) - 27.0) < 1e-9, 'expected 27.0 | actual: %r' % trimmed_mean(feet)",
          expected: '27.0',
        },
        {
          id: 't2',
          name: { ar: 'أربع قيم: اسقط الطرفين ووسطّح الوسطين', en: 'Four values: drop the ends, average the middle' },
          code: "assert abs(trimmed_mean([1.0, 2.0, 3.0, 4.0]) - 2.5) < 1e-9, 'drop one min and one max, average the middle'",
          expected: '2.5',
        },
        {
          id: 't3',
          name: { ar: 'تكرار عند الحد الأدنى يسقط واحدة فقط', en: 'A duplicated minimum loses only one copy' },
          code: "assert abs(trimmed_mean([10.0, 10.0, 10.0, 20.0]) - 10.0) < 1e-9, 'duplicate minima: drop only one of them'",
          expected: '10.0',
        },
      ],
      hints: [
        { ar: 'vs = sorted(values) تصنع نسخة مرتبة دون المساس بالأصل — لا ترتب القائمة المدخلة نفسها.', en: 'vs = sorted(values) makes a sorted copy without touching the original — do not sort the input list in place.' },
        { ar: 'التقطيع vs[1:-1] يسقط العنصرين الأول (الأصغر) والأخير (الأكبر) ويبقي الوسط.', en: 'The slice vs[1:-1] drops the first (smallest) and last (largest) elements, keeping the middle.' },
        { ar: 'قيم تحقق: متوسط الأقدام الخام 27.0625 والمقصوص 378/14 = 27.0 (سقطت 22 و33 بمجموع 55).', en: 'Sanity values: the raw mean is 27.0625 and the trimmed one 378/14 = 27.0 (22 and 33 dropped, summing 55).' },
        { ar: 'التكرارات لا تقلقك: [10, 10, 10, 20] بعد القص يبقى [10, 10] — القص يسقط نسخة واحدة من كل طرف.', en: 'Duplicates are harmless: [10, 10, 10, 20] trims to [10, 10] — one copy is dropped per side.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-param-count',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'شبكة كثيفة متتالية بأحجام 2 → 8 → 8 → 1: احسب يدويًا مجموع الأوزان (حاصل ضرب أحجام الطبقات المتجاورة) زائد الانحيازات (عدد العصبونات في الطبقات غير المدخلة). كم معاملًا للمجموع؟',
        en: 'A dense sequential network with sizes 2 \u2192 8 \u2192 8 \u2192 1: compute by hand the total weights (products of adjacent layer sizes) plus biases (one per non-input neuron). What is the grand total?',
      },
      answer: '105',
      tolerance: 1e-9,
      solution: '105',
      hints: [
        { ar: 'الأوزان: 2\u00b78 + 8\u00b78 + 8\u00b71.', en: 'Weights: 2\u00b78 + 8\u00b78 + 8\u00b71.' },
        { ar: '16 + 64 + 8 = 88 وزنًا، والانحيازات 8 + 8 + 1 = 17.', en: '16 + 64 + 8 = 88 weights, and biases 8 + 8 + 1 = 17.' },
        { ar: 'الجمع النهائي: 88 + 17.', en: 'The final sum: 88 + 17.' },
        { ar: 'تحقق بالكود في الملعب: هذا هو الرقم الذي طبعه المثال المُشغَّل.', en: 'Verify with code in the worked example: this is exactly the number it printed.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-why-now',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أفكار مثل MLP (1943) وCNN (1998) وLSTM (1997) بقيت شبه خاملة حتى نحو 2012 ثم «أُعيد اكتشافها». ما الذي تغير فعلًا؟',
        en: 'Ideas like MLP (1943), CNN (1998) and LSTM (1997) lay nearly dormant until around 2012, then were "rediscovered". What actually changed?',
      },
      options: [
        { id: 'a', text: { ar: 'بيانات ضخمة من الويب + عتاد GPUs رخيص + تحسينات خوارزمية (dropout وانتباه وتدريب موزع)', en: 'Web-scale data + cheap GPU hardware + algorithmic improvements (dropout, attention, distributed training)' } },
        { id: 'b', text: { ar: 'الرياضيات اللازمة لم تُكتشف قبل 2012', en: 'The required mathematics was only discovered after 2012' } },
        { id: 'c', text: { ar: 'المجموعات أصبحت أصغر فأسهل تدريبًا', en: 'Datasets got smaller and therefore easier to train' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'جدول العقد في الكتاب: ×10\u00b9\u2070 في البيانات و×10\u00b9\u2070 في العمليات الفاصلة بين 1970 و2020.', en: 'The book\u2019s decade table: \u00d710\u00b9\u2070 in data and \u00d710\u00b9\u2070 in floating-point speed between 1970 and 2020.' },
        { ar: 'GPUs وُلدت للألعاب ثم وجدت عملها الحقيقي في ضرب المصفوفات.', en: 'GPUs were born for games, then found their true calling in matrix multiplication.' },
        { ar: 'الأفكار نفسها كانت موجودة — انظر الخط الزمني: 1943 و1986 و1998 كلها قبل فترة الصمت.', en: 'The ideas already existed — see the timeline: 1943, 1986 and 1998 all predate the quiet years.' },
        { ar: 'الجواب: a — الوقود الثلاثي: بيانات وعتاد وخوارزميات.', en: 'Answer: a — the triple fuel: data, hardware, and algorithms.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "decades = [(1970, 1e2, 1e5), (1980, 1e3, 1e6), (1990, 1e4, 1e7),\n           (2000, 1e7, 1e9), (2010, 1e10, 1e12), (2020, 1e12, 1e15)]\n\nprev = None\nfor year, data, flops in decades:\n    if prev is None:\n        print('%d  data=%.0e  flops=%.0e' % (year, data, flops))\n    else:\n        print('%d  data=%.0e (x%.0e)  flops=%.0e (x%.0e)' % (year, data, data / prev[1], flops, flops / prev[2]))\n    prev = (year, data, flops)\n\n# جرّب: أيهما نما أسرع لكل عقدة، البيانات أم العمليات؟ وأين يقع الحجم النسبي للذاكرة في جدول الكتاب؟\n# try: which grew faster per decade, data or flops? Where does memory size sit in the book's table?\n# جرّب: شبكة 2-8-8-1 تحتاج 105 معاملات. كبّرها إلى 200-8-8-1 وراقب انفجار العدد مع عرض المدخلات.\n# try: a 2-8-8-1 net needs 105 parameters. Scale it to 200-8-8-1 and watch the count explode with input width.\n",
      prompt: {
        ar: 'الملعب يعيد بناء جدول العقود مع نسب النمو بين كل عقدين متجاورين — قارن منحنيي البيانات والحوسبة ثم جرب توسيع الشبكة وعدّ المعاملات.',
        en: 'The sandbox rebuilds the decade table with growth ratios between adjacent decades — compare the data and compute curves, then scale the network and count parameters.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'الاسم مرتبط بابتكار «المربعات الصغرى» الذي ما يزال أساس الانحدار حتى اليوم — من هو؟',
            en: 'The name attached to least squares, still the basis of regression today, belongs to whom?',
          },
          options: [
            { id: 'a', text: { ar: 'غاوس', en: 'Gauss' } },
            { id: 'b', text: { ar: 'تورنغ', en: 'Turing' } },
            { id: 'c', text: { ar: 'شانون', en: 'Shannon' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'غاوس (1777-1855) صاحب المربعات الصغرى وتوزيع الجرس. تورنغ صاحب سؤال «هل تستطيع الآلات التفكير؟» واختباره، وشانون صاحب نظرية المعلومات — ثلاثة جذور مختلفة لنفس الشجرة.',
            en: 'Gauss (1777-1855) gave us least squares and the bell curve. Turing asked "can machines think?" and proposed his test; Shannon founded information theory — three distinct roots of the same tree.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا خفت بحث الشبكات العصبية تقريبًا بين 1995 و2005؟',
            en: 'Why did neural network research nearly stall between 1995 and 2005?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن قاعدة السلسلة كانت مجهولة حينها', en: 'Because the chain rule was unknown at the time' } },
            { id: 'b', text: { ar: 'لأن الحوسبة كانت نادرة والبيانات صغيرة، فتفوقت طرائق كالأنوية والأشجار بنتائج مضمونة', en: 'Because compute was scarce and datasets small, so kernel methods and trees won with predictable results' } },
            { id: 'c', text: { ar: 'لأن GPUs كانت أسرع مما نحتاج', en: 'Because GPUs were faster than needed' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التدريب مكلف حسابيًا والذاكرة الوحيدة المتوفرة كانت RAM ضخمة بلا قوة معالجة كافية؛ وMNIST بستين ألف رقم كانت «ضخمة». الأدوات الإحصائية القوية أعطت نتائج أسرع ومضمونة — حتى تغير الوقود الثلاثي.',
            en: 'Training was computationally expensive and memory plentiful only as RAM without processing power; MNIST\u2019s 60,000 digits counted as "huge". Strong statistical tools delivered faster, guaranteed results — until the triple fuel changed.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'خطأ ImageNet top-5 نزل من 28% (2010) إلى 2.25% (2017). ماذا يوضح هذا القفز في قصص النجاح؟',
            en: 'ImageNet top-5 error fell from 28% (2010) to 2.25% (2017). What does that leap illustrate in the success stories?',
          },
          options: [
            { id: 'a', text: { ar: 'أن بيانات التصنيف استُنفدت', en: 'That classification data ran out' } },
            { id: 'b', text: { ar: 'أن التعرّف على الأهداف انتقل من مهمة عسيرة عام 2010 إلى تفوق عملي يشبه البشر في سنوات قليلة', en: 'That object recognition went from a hard open problem in 2010 to practical, human-parity performance within a few years' } },
            { id: 'c', text: { ar: 'أن GPUs لم تشارك في ذلك', en: 'That GPUs played no part in it' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قفزة ImageNet هي المعلن المرئي لعصر GPU: شبكات أعمق على بيانات أضخم تحققت نتائج كانت مستحيلة قبل سنوات، وامتد الأثر إلى الطب (تشخيص سرطان الجلد) والألعاب (AlphaGo) والقيادة.',
            en: 'The ImageNet leap is the visible herald of the GPU era: deeper networks on much larger data achieved what was impossible years earlier, spilling into medicine (skin-cancer diagnosis), games (AlphaGo) and driving.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الجذور عميقة: إحصاء قديم (بايز 1763، مربعات غاوس، أول متوسط مقصوص عند كوبل) + إلهام عصبي (هيب 1949، البيرسبترون 1958) — والهدف من s4 الجذور.', en: 'The roots run deep: old statistics (Bayes 1763, Gauss\u2019s least squares, K\u00f6bel\u2019s first trimmed mean) plus neural inspiration (Hebb 1949, the perceptron 1958) — the goal of s4 Roots.' },
        { ar: 'الطريق إلى العمق فتحه وقود ثلاثي: بيانات ×10\u00b9\u2070 وحوسبة ×10\u00b9\u2070 (GPUs) وخوارزميات (dropout، انتباه، Transformer، تدريب موزع) فأعادت إحياء الأفكار القديمة — والهدف من s5 الطريق إلى التعلم العميق.', en: 'The road to deep learning opened with triple fuel: \u00d710\u00b9\u2070 data, \u00d710\u00b9\u2070 compute (GPUs), and algorithms (dropout, attention, Transformers, distributed training) that revived dormant ideas — the goal of s5 The Road to Deep Learning.' },
        { ar: 'القصص أثبتت الجدارة: مساعدات صوتية، خطأ ImageNet من 28% إلى 2.25%، AlphaGo وبوكر، قيادة شبه ذاتية — والهدف من s6 قصص النجاح.', en: 'The stories proved the worth: voice assistants, ImageNet error from 28% to 2.25%, AlphaGo and poker bots, semi-autonomous driving — the goal of s6 Success Stories.' },
      ],
      reflectPrompt: {
        ar: 'كانت الأفكار جاهزة قبل نصف قرن وانتظرت العتاد والبيانات. أي فكرة من عملك اليوم تعتقد أنها «قبل وقتها» فقط لأن البيانات أو الحوسبة غير متاحة بعد؟ وكيف تتحسب لانفجارها؟',
        en: 'The ideas were ready half a century early, waiting for hardware and data. Which idea from your own work do you suspect is simply "ahead of its time" because the data or compute is not there yet — and how would you prepare for its explosion?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch1.s4' },
        { book: 'D2L', section: 'd2l.ch1.s5' },
        { book: 'D2L', section: 'd2l.ch1.s6' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch1.s4' },
    { book: 'D2L', section: 'd2l.ch1.s5' },
    { book: 'D2L', section: 'd2l.ch1.s6' },
  ],
} satisfies Lesson;

export default lesson;
