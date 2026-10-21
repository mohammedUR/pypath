import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch1.l3 — "The Essence of Deep Learning and the Road Ahead"
 * جوهر التعلم العميق وخارطة الطريق
 * Aligned with D2L ch1 s7 (The Essence of Deep Learning) + s8 (Summary) +
 * s9 (Exercises). All expression is original — a paraphrase of the source's
 * ideas, never a verbatim translation. Runnable design: a pure-Python 2-layer
 * composition on fixed inputs printing pre-activations, ReLU'd features and
 * the output; exercise 1 builds the general parameter-count function.
 * Every literal verified under CPython 3. Deterministic only: no input(),
 * no exit(), no unittest.main, no seeding needed.
 */
const lesson = {
  id: 'd2l.ch1.l3',
  version: 1,
  part: 'II',
  track: 'A1',
  book: 'D2L',
  chapter: 1,
  title: {
    ar: 'جوهر التعلم العميق وخارطة الطريق',
    en: 'The Essence of Deep Learning and the Road Ahead',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch1.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قديمًا كان «هندسة السمات» حرفة يدوية: كاشف حواف هنا ومستخرج SIFT هناك، ثم نموذج ضحل في النهاية. التعلم العميق قلب الطاولة: الطبقات نفسها تتعلّم السمات من البيانات، وتتدرّب كلها معًا من المدخل إلى المخرج. ستشاهد طبقتين صغيرتين تصنعان سمات حية وميتة (بفضل ReLU) على مدخلات ثابتة، ثم تحسب معاملات أي شبكة بدالة عامة — وتنهي الفصل الأول بخارطة رحلة الكتاب ومجموعة تمارينه.',
        en: 'Feature engineering used to be a handcraft: an edge detector here, a SIFT extractor there, then a shallow model at the end. Deep learning flipped the table: the layers themselves learn the features from data, and all of them train together end to end. You will watch two small layers produce live and dead features (thanks to ReLU) on fixed inputs, then write a general function that counts any network\u2019s parameters — closing chapter 1 with the book\u2019s journey map and its exercise set.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تمثيل متعدد الطبقات ثم خارطة الرحلة', en: 'Many-layered representation, then the journey map' },
      chunks: [
        {
          ar: 'العمق = طبقات كثيرة من التحويلات، والفرق الجوهري أن كلها تُتعلَّم معًا من البيانات لا تُصمَّم يدويًا. كل طبقة تبني سمات فوق سمات الطبقة التي قبلها: الحواف → الأشكال → الأجزاء → المفاهيم. التدريب من طرف إلى طرف end-to-end يستبدل خط التجميع القديم (سمات يدوية ثم نموذج ضحل مضبوط كلٌّ على حدة) بشبكة واحدة تُضبط كل معاملاتها ضد الخسارة نفسها — لذلك اختفت الحدود بين رؤية حاسوبية وكلام ومعالجة لغات: أدوات واحدة للجميع. ومع وفرة البيانات انتقلنا من نماذج بارامترية بفرضيات مبسطة إلى نماذج غير بارامترية أوسع، مع ثقافة تجريبية تقبل الحلول دون المستوى الأمثل ومسائل تحسين غير محدبة.',
          en: 'Depth = many layers of transformations, and the essential difference is that they are learned jointly from data rather than designed by hand. Each layer builds features on top of the previous layer\u2019s features: edges \u2192 shapes \u2192 parts \u2192 concepts. End-to-end training replaces the old assembly line (hand-crafted features, then a shallow model tuned separately) with one network whose every parameter is adjusted against the same loss — which is why the borders between computer vision, speech and NLP faded: one toolkit for all. With abundant data we also moved from parametric models with simplifying assumptions to wider nonparametric ones, embracing an empirical culture that tolerates suboptimal, nonconvex solutions.',
        },
        {
          ar: 'خارطة رحلة الكتاب كما يلخصها فصلنا: تجهيزات ch2 (موتّرات، جبر، تفاضل تلقائي، احتمال) → شبكات خطية للانحدار والتصنيف → البيرسبترون متعدد الطبقات وأساسياته → التحسين والانتظام → معماريات الالتفاف للرؤية ثم المتتاليات والانتباه → حتى النماذج التوليدية. منصتنا تسير القوس نفسه على مساراتها. وماذا تطلب منك؟ تمرين الكتاب يستحق تأملًا: أي أجزاء كودك اليوم «قابلة للتعلم» — خيارات تصميم تُضبط من أمثلة بدل شروط مكتوبة يدويًا؟ وأي مشاكل حولك فيها أمثلة كثيرة بلا قاعدة صريحة؟ هؤلاء مرشحون أوفر للتعلم العميق.',
          en: 'The book\u2019s journey, as our chapter summarizes: ch2 preliminaries (tensors, algebra, autograd, probability) \u2192 linear networks for regression and classification \u2192 the multilayer perceptron and its foundations \u2192 optimization and regularization \u2192 convolutional architectures for vision, then sequences and attention \u2192 all the way to generative models. Our platform walks the same arc across its tracks. And what does it ask of you? The book\u2019s exercise deserves reflection: which parts of your current code are "learnable" — design choices that could be fit from examples instead of hand-written conditions? And which problems around you have many examples yet no explicit rule? Those are prime candidates for deep learning.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'طبقتان تحكيان قصة السمات',
        en: 'Two layers telling the feature story',
      },
      code: "W1 = [[1.0, -1.0],\n      [0.5, 1.0]]\nb1 = [0.0, -1.0]\nW2 = [[2.0, 3.0]]\nb2 = [-4.0]\n\ndef relu(v):\n    return [max(0.0, t) for t in v]\n\ndef layer1(x):\n    z = [W1[i][0] * x[0] + W1[i][1] * x[1] + b1[i] for i in range(2)]\n    return z, relu(z)\n\ndef layer2(h):\n    return W2[0][0] * h[0] + W2[0][1] * h[1] + b2[0]\n\nfor x in ([2.0, 1.0], [-1.0, 3.0]):\n    z, h = layer1(x)\n    out = layer2(h)\n    print('x =', x, '-> z1 =', z, '-> h =', h, '-> out =', out)",
      explanation: {
        ar: 'عند x=[2,1]: ما قبل التنشيط z1=[1.0, 1.0] يمر عبر ReLU دون جرح فيصير السمتان h=[1.0, 1.0]، والطبقة الثانية تدمجهما: 2\u00b71 + 3\u00b71 − 4 = 1.0. عند x=[−1,3]: z1=[−4.0, 1.5] — وReLU تُطفئ السمة الأولى تمامًا فتصير h=[0.0, 1.5] والمخرج 0+4.5−4 = 0.5. لاحظ ما حدث: الطبقة الأولى «اخترعت» سمات، والثانية قرأت الحي منها فقط. هذا هو التعلم التمثيلي المصغر: تحويلات متتالية تبني تمثيلًا يسهل على الطبقة التالية أن تقرأه.',
        en: 'At x=[2,1]: the pre-activation z1=[1.0, 1.0] passes through ReLU untouched, becoming features h=[1.0, 1.0], and layer two combines them: 2\u00b71 + 3\u00b71 \u2212 4 = 1.0. At x=[\u22121,3]: z1=[\u22124.0, 1.5] — ReLU switches the first feature fully off, so h=[0.0, 1.5] and the output is 0 + 4.5 \u2212 4 = 0.5. Watch what happened: layer one "invented" features and layer two read only the live one. That is representation learning in miniature: successive transformations building a representation the next layer can read.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.param-count-function',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب param_count(sizes) لشبكة كثيفة متتالية بأحجام صحيحة: مجموع حواصل ضرب الأحجام المتجاورة (أوزان) زائد مجموع أحجام الطبقات غير المدخلة (انحيازات). تحقق: [2, 8, 8, 1] تعطي 105 و[3, 4, 1] تعطي 21.',
        en: 'Write param_count(sizes) for a dense sequential network of integer sizes: the sum of products of adjacent sizes (weights) plus the sum of non-input layer sizes (biases). Verify: [2, 8, 8, 1] gives 105 and [3, 4, 1] gives 21.',
      },
      starterCode: "def param_count(sizes):\n    ...  # TODO: sum sizes[i] * sizes[i+1] over adjacent pairs, plus sum(sizes[1:])\n\nprint(param_count([2, 8, 8, 1]))\n",
      solution: "def param_count(sizes):\n    weights = sum(sizes[i] * sizes[i + 1] for i in range(len(sizes) - 1))\n    biases = sum(sizes[1:])\n    return weights + biases",
      tests: [
        {
          id: 't1',
          name: { ar: 'الشبكة الصغيرة تعطي 105', en: 'The tiny net gives 105' },
          code: "assert param_count([2, 8, 8, 1]) == 105, 'expected 105 | actual: %r' % param_count([2, 8, 8, 1])",
          expected: '105',
        },
        {
          id: 't2',
          name: { ar: 'شبكة أصغر تعطي 21', en: 'A smaller net gives 21' },
          code: "assert param_count([3, 4, 1]) == 21, 'expected 21 | actual: %r' % param_count([3, 4, 1])",
          expected: '21',
        },
        {
          id: 't3',
          name: { ar: 'الحالات الحدية: عقدة واحدة وحافتان', en: 'Edge cases: one node and two nodes' },
          code: "assert param_count([1]) == 0 and param_count([1, 1]) == 2, 'no edges no params; one edge plus one bias = 2'",
          expected: '0 and 2',
        },
      ],
      hints: [
        { ar: 'الأوزان: sum(sizes[i] * sizes[i + 1] for i in range(len(sizes) - 1)) — زوج لكل حافة بين طبقتين.', en: 'Weights: sum(sizes[i] * sizes[i + 1] for i in range(len(sizes) - 1)) — one product per edge between two layers.' },
        { ar: 'الانحيازات: sum(sizes[1:]) — عصبون واحد غير مدخلي يحمل انحيازًا واحدًا.', en: 'Biases: sum(sizes[1:]) — each non-input neuron carries one bias.' },
        { ar: 'قيم تحقق: [2,8,8,1] → أوزان 16+64+8=88 وانحيازات 17 فيكون 105؛ و[3,4,1] → 12+4=16 زائد 5 فيكون 21.', en: 'Sanity values: [2,8,8,1] \u2192 weights 16+64+8=88 and biases 17, total 105; [3,4,1] \u2192 12+4=16 plus 5, total 21.' },
        { ar: 'الحالات الحدية تختبر فهمك: قائمة بطبقة واحدة لا حواف لها ولا انحيازات → 0؛ وقائمتان [1,1] تعطيان وزنًا واحدًا وانحيازًا واحدًا → 2.', en: 'Edge cases test understanding: a single-layer list has no edges and no biases \u2192 0; [1, 1] gives one weight and one bias \u2192 2.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-feature-shift',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في خطوط الأنابيب القديمة سبق Canny وSIFT تحديد السمات يدويًا قبل نموذج ضحل. ما التغيير الجوهري الذي جاء به التعلم العميق؟',
        en: 'In old pipelines, hand-crafted extractors like Canny and SIFT defined the features before a shallow model. What is the essential change deep learning brought?',
      },
      options: [
        { id: 'a', text: { ar: 'الطبقات تتعلم السمات معًا مع المهمة عبر تدريب من طرف إلى طرف — لا سمات يدوية', en: 'The layers learn the features jointly with the task via end-to-end training — no hand-crafted features' } },
        { id: 'b', text: { ar: 'استبدلت Canny بـ SIFT الأحدث فقط', en: 'It simply replaced Canny with the newer SIFT' } },
        { id: 'c', text: { ar: 'جعلت النماذج الضحلة أعمق قليلًا دون تغيير السمات', en: 'It made shallow models slightly deeper without touching the features' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الكلمة المفتاحية: end-to-end — كل المعاملات تُضبط ضد الخسارة نفسها.', en: 'The keyword: end-to-end — every parameter is tuned against the same loss.' },
        { ar: 'ما كان حرفة بشرية (استخراج سمات) صار جزءًا يُتعلَّم داخل الشبكة.', en: 'What used to be a human craft (feature extraction) became a learned part of the network itself.' },
        { ar: 'لهذا توحدت أدوات الرؤية والكلام واللغة: لم يعد لكل مجال سماته اليدوية الخاصة.', en: 'That is why vision, speech and language tools unified: each field no longer carries its own hand-made features.' },
        { ar: 'الجواب: a — تمثيل متعدد الطبقات يُتعلم من البيانات معًا.', en: 'Answer: a — a many-layered representation learned jointly from data.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "W1 = [[1.0, -1.0],\n      [0.5, 1.0]]\nb1 = [0.0, -1.0]\nW2 = [[2.0, 3.0]]\nb2 = [-4.0]\n\ndef forward(x):\n    z = [W1[i][0] * x[0] + W1[i][1] * x[1] + b1[i] for i in range(2)]\n    h = [max(0.0, t) for t in z]\n    out = W2[0][0] * h[0] + W2[0][1] * h[1] + b2[0]\n    return z, h, out\n\nfor x in ([0.0, 0.0], [4.0, 4.0], [-5.0, 1.0]):\n    z, h, out = forward(x)\n    print('x =', x, '-> z =', z, '-> h =', h, '-> out =', out)\n\n# جرّب: اقلب إشارة W2[0][0] — أي مدخل ينقلب مخرجه؟\n# try: flip the sign of W2[0][0] — which input flips its output?\n# جرّب: اجعل الوحدتين الخفيتين ميتين (h = [0, 0]) لكل المدخلات الثلاثة — ماذا يحدث للمخرجات؟\n# try: make both hidden units dead (h = [0, 0]) for all three inputs — what happens to the outputs?\n",
      prompt: {
        ar: 'الملعب يوسع تكوين الطبقتين على ثلاثة مدخلات: مدخل يعطي h=[0,0] ومخرجه انحياز الطبقة الثانية وحده. جرب قلب الإشارات وقتل الوحدات لترى كيف تتحكم الأوزان في السمات.',
        en: 'The sandbox extends the two-layer composition to three inputs: one yields h=[0,0] and an output equal to layer two\u2019s bias alone. Flip signs and kill units to see how weights steer the features.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الذي يجعل التعلم «عميقًا» deep حرفيًا؟',
            en: 'What makes learning "deep" in the literal sense?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد كبير من الطبقات من التحويلات تُتعلَّم معًا من البيانات', en: 'Many layers of transformations learned jointly from data' } },
            { id: 'b', text: { ar: 'استخدام GPUs بالضرورة', en: 'The mandatory use of GPUs' } },
            { id: 'c', text: { ar: 'كون البيانات ضخمة فقط', en: 'The data being large, nothing more' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'العمق يعني طبقات متعددة من التحويلات المُتعلَّمة معًا — لا مجرد نموذج واحد ضخم. البيانات الكبيرة والGPUs عاملان ممكِّنان لكنهما ليسا التعريف.',
            en: 'Depth means multiple layers of transformations trained together — not merely one big model. Big data and GPUs are enablers, not the definition.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا يعني «تدريب من طرف إلى طرف» end-to-end؟',
            en: 'What does "end-to-end training" mean?',
          },
          options: [
            { id: 'a', text: { ar: 'تدريب كل مكون على حدة ثم ربطها', en: 'Training each component separately, then wiring them together' } },
            { id: 'b', text: { ar: 'ضبط كل معاملات النظام ضد الخسارة نفسها في تدريب واحد، فتُستبدل السمات اليدوية بسمات مُتعلَّمة', en: 'Tuning every parameter of the system against the same loss in one training pass, replacing hand-crafted features with learned ones' } },
            { id: 'c', text: { ar: 'تدريب يبدأ من نقطة عشوائية وينتهي عند صفر خطأ', en: 'Training that starts from a fixed point and ends at zero error' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التدريب من طرف إلى طرف يبني النظام كله ثم يضبط أداءه مجتمعًا — فاستُبدلت مستخرجات السمات اليدوية بمرشحات تُضبط تلقائيًا وحققت دقة أعلى. هذا جوهر s7.',
            en: 'End-to-end training builds the whole system and tunes its performance jointly — hand-crafted extractors became automatically tuned filters with superior accuracy. That is the heart of s7.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'بحسب خلاصة الفصل، ما العوامل التي أطلقت معظم التقدم الحديث؟',
            en: 'Per the chapter summary, what factors drove most recent progress?',
          },
          options: [
            { id: 'a', text: { ar: 'وفرة البيانات من الحساسات الرخيصة وتطبيقات الإنترنت + تقدم الحوسبة عبر GPUs + إطارات عمل تسهّل بناء الأنظمة', en: 'Abundant data from cheap sensors and Internet-scale applications + compute progress via GPUs + frameworks that ease whole-system design' } },
            { id: 'b', text: { ar: 'اكتشاف قاعدة السلسلة حديثًا', en: 'The recent discovery of the chain rule' } },
            { id: 'c', text: { ar: 'تراجع حجم البيانات لصالح جودتها', en: 'Smaller but higher-quality data' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'خلاصة s8 تجمع الثلاثة: بيانات وفيرة، وعتاد GPU، وإطارات عمل جعلت تحسين النظام كله أسهل — وهي القصة نفسها التي رأيناها في الخط الزمني.',
            en: 'The s8 summary names all three: abundant data, GPU hardware, and frameworks that made whole-system optimization easy — the same story the timeline told.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الجوهر: طبقات كثيرة من التحويلات تُتعلَّم معًا فتبني تمثيلات (حواف → أشكال → مفاهيم)، والتدريب من طرف إلى طرف يلغي هندسة السمات اليدوية — والهدف من s7 جوهر التعلم العميق.', en: 'The essence: many layers of transformations learned jointly build representations (edges \u2192 shapes \u2192 concepts), and end-to-end training retires hand-crafted feature engineering — the goal of s7 The Essence of Deep Learning.' },
        { ar: 'الخلاصة والرحلة: تعلم الآلة = تحسن مع الخبرة، والعمق = تمثيل متعدد المستويات، والرحلة تمتد من تجهيزات ch2 إلى الخطية فالبيرسبترون متعدد الطبقات فالرؤية والمتتاليات فالتوليد — والهدف من s8 الخلاصة.', en: 'The summary and journey: machine learning improves with experience, depth is multi-level representation learning, and the road runs from ch2 preliminaries through linear models and the MLP to vision, sequences and generation — the goal of s8 Summary.' },
        { ar: 'التمارين صارت عدستك: ابحث عن أجزاء كودك القابلة للتعلم وعن مشاكل كثيرة الأمثلة بلا قاعدة، وعُد إلى w=wx حين تشتت — والهدف من s9 التمارين.', en: 'The exercises are now your lens: hunt for learnable parts of your code and for many-example-no-rule problems, and return to w=wx whenever lost — the goal of s9 Exercises.' },
      ],
      reflectPrompt: {
        ar: 'انظر إلى آخر دالة شرطية كتبتها: كم شرطًا فيها يمكن أن تتعلمه من عشرات الأمثلة بدل القواعد؟ وما البيانات التي ستجمعها لو قررت تحويله إلى نموذج صغير مثل w=wx؟',
        en: 'Look at the last if/else chain you wrote: how many of those conditions could be learned from dozens of examples instead? And what data would you gather if you decided to turn it into a tiny model like w=wx?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch1.s7' },
        { book: 'D2L', section: 'd2l.ch1.s8' },
        { book: 'D2L', section: 'd2l.ch1.s9' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch1.s7' },
    { book: 'D2L', section: 'd2l.ch1.s8' },
    { book: 'D2L', section: 'd2l.ch1.s9' },
  ],
} satisfies Lesson;

export default lesson;
