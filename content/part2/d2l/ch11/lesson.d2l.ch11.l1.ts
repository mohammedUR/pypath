import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch11.l1 — "Queries, Keys, and Values: How Attention Pools Data"
 * الاستعلامات والمفاتيح والقيم: كيف يجمّع الانتباه البيانات
 * Aligned with D2L ch11 s1 (Queries, Keys, and Values) + s2 (Attention
 * Pooling by Similarity) + s3 (Attention Scoring Functions). All expression
 * is original — a paraphrase of the source's ideas, never a verbatim
 * translation. Runnable design: scaled dot-product attention weights from
 * fixed q/k via a pure-python softmax, masked softmax, kernel-regression
 * weights; every literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch11.l1',
  version: 1,
  part: 'II',
  track: 'A6',
  book: 'D2L',
  chapter: 11,
  title: {
    ar: 'الاستعلامات والمفاتيح والقيم: كيف يجمّع الانتباه البيانات',
    en: 'Queries, Keys, and Values: How Attention Pools Data',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch16.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قاعدة بيانات تجيب استعلام «Li» بـ «Mu» بدقة، وتجيب التقريبي بـ «Lipton». الانتباه هو هذه القاعدة لكن ناعمة وقابلة للتفاضل: بدل إرجاع قيمة واحدة، يعيد مزيجًا موزونًا من كل القيم بأوزان قرب الاستعلام من كل مفتاح. ستحسب الأوزان بنفسك من متجهات ثابتة، وترى الحشوات تُقنَّع، وتفهم لماذا تُقسَّم حواصل الضرب على √d.',
        en: 'A database answers the query "Li" with "Mu" exactly, and an approximate match with "Lipton". Attention is that database made soft and differentiable: instead of returning one value, it returns a weighted mixture of all values, weighted by how close the query is to each key. You will compute the weights yourself from fixed vectors, watch padding get masked out, and understand why dot products get divided by \u221ad.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من قاعدة بيانات إلى تجميع انتباهي، فدوال التنقيط', en: 'From a database to attention pooling, then scoring functions' },
      chunks: [
        {
          ar: 'عرف قاعدة D = {(k1, v1), …, (km, vm)} واستعلامًا q. التجميع الانتباهي: Attention(q, D) = Σ_i α(q, k_i)·v_i — تركيب خطي للقيم بأوزان توافق q مع كل مفتاح. الحالات الخاصة تفسر كل شيء: وزن واحد 1 والبقية أصفار = استعلام قاعدة بيانات تقليدي؛ أوزان متساوية 1/m = متوسط (average pooling)؛ وأشيع الأوزان مزيج محدب: غير سالبة ومجموعها 1. الشائع ضمان ذلك بتمرير أي دالة توافق a(q, k) عبر softmax: α(q, k_i) = exp(a(q, k_i)) ÷ Σ_j exp(a(q, k_j)) — عملية قابلة للتفاضل وتدرجها لا يتلاشى، وتعمل على أي حجم قاعدة دون تغيير طريقتها.',
          en: 'Given a database D = {(k1, v1), \u2026, (km, vm)} and a query q, attention pooling is Attention(q, D) = \u03a3_i \u03b1(q, k_i)\u00b7v_i \u2014 a linear combination of the values with weights measuring the compatibility of q with each key. The special cases explain everything: exactly one weight 1 and the rest 0 is a classic database lookup; equal weights 1/m is average pooling; and the most common choice is a convex combination \u2014 nonnegative weights summing to 1. That is guaranteed by passing any compatibility function a(q, k) through a softmax: \u03b1(q, k_i) = exp(a(q, k_i)) \u00f7 \u03a3_j exp(a(q, k_j)) \u2014 differentiable, with gradients that never vanish, valid over arbitrarily large databases without changing the operation.',
        },
        {
          ar: 'أقدم سلف للانتباه هو انحدار Nadaraya–Watson النووي (1964): الاستعلام موقعُ توقع، والمفاتيح مواقع المشاهدات، والقيم قيمها؛ والتقدير f(q) = Σ_i v_i·α(q, k_i) ÷ Σ_j α(q, k_j) بنواة تشابه: غاوسية exp(−‖q−k‖²/2) أو صندوقية أو Epanechnikov، وبعرض σ يضبط النعومة — نواة أضيق تلتصق بالبيانات المحلية وأعرض تنعم. لا تدريب يُذكر. لكن النوى يدوية الحدودة، والدرس الأهم: الأفضل تعلُّم تمثيلات q و k — وهذا ما تفعله طبقات الانتباه العصبية.',
          en: 'The oldest ancestor of attention is Nadaraya\u2013Watson kernel regression (1964): the query is where you predict, keys are where data was observed, and values are the observed labels; the estimate f(q) = \u03a3_i v_i\u00b7\u03b1(q, k_i) \u00f7 \u03a3_j \u03b1(q, k_j) uses similarity kernels \u2014 Gaussian exp(\u2212\u2016q\u2212k\u2016\u00b2/2), boxcar, or Epanechnikov \u2014 with a width \u03c3 controlling smoothness: a narrower kernel hugs local data, a wider one smooths. No training required. But hand-crafted kernels are limited, and the deeper lesson is to learn the representations of q and k \u2014 exactly what neural attention layers do.',
        },
        {
          ar: 'دوال التنقيط تحدد التوافق. توسيع النواة الغاوسية يعطي q\u22a4k ناقص حدودًا تتساقط بعد التطبيع، فيبقى الضرب القياسي المقيَّس: a(q, k) = q\u22a4k/√d — لأن حاصل ضرب متجهين بمداخل عشوائية مستقلة متوسطها صفر وتباينه d، والقسمة على √d تعيد التباين إلى 1 فتبقى مدخلات exp مضبوطة مهما كبر d. وللتقنيع: softmax المُقنَّع يعطي المواضع بعد الطول الصحيح رقمًا سالبًا كبيرًا (مثل −10^6) فيصفر وزنها. وإذا اختلف بُعد q عن k: الانتباه الإضافي a(q, k) = w_v\u22a4tanh(W_q q + W_k k) — قطرة MLP ذات طبقة خفية واحدة تُساوي الأبعاد أولًا.',
          en: 'Scoring functions define compatibility. Expanding the Gaussian kernel leaves q\u22a4k after terms that vanish under normalization \u2014 hence the scaled dot product: a(q, k) = q\u22a4k/\u221ad. A dot product of two vectors with iid zero-mean unit-variance entries has variance d, and dividing by \u221ad restores variance 1 so the inputs of exp stay controlled however large d grows. For masking: a masked softmax assigns positions beyond the valid length a large negative score (like \u221210^6) so their weight becomes zero. And when the dimensions of q and k differ, additive attention a(q, k) = w_v\u22a4tanh(W_q q + W_k k) \u2014 a one-hidden-layer MLP drop \u2014 reconciles the spaces first.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'أوزان انتباه من متجهات ثابتة: softmax مقيَّس ومُقنَّع',
        en: 'Attention weights from fixed vectors: scaled softmax, then masked',
      },
      code: "import math\n\ndef softmax(scores):\n    m = max(scores)\n    exps = [math.exp(s - m) for s in scores]\n    total = sum(exps)\n    return [e / total for e in exps]\n\nq = [1.0, 0.0]\nK = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [-1.0, 0.0]]\nV = [10.0, 20.0, 30.0, 40.0]\nd = len(q)\nscores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in K]\nw = softmax(scores)\nprint('scores :', [round(s, 4) for s in scores])\nprint('weights:', [round(x, 4) for x in w], '| sum =', round(sum(w), 6))\nout = sum(wi * v for wi, v in zip(w, V))\nprint('output :', round(out, 4))\n\ndef masked_softmax(scores, valid_len, fill=-1e6):\n    masked = [s if i < valid_len else fill for i, s in enumerate(scores)]\n    return softmax(masked)\n\nw2 = masked_softmax(scores, 2)\nprint('masked len=2:', [round(x, 4) for x in w2])\nprint('masked out  :', round(sum(wi * v for wi, v in zip(w2, V)), 4))\nw1 = masked_softmax(scores, 1)\nprint('masked len=1:', [round(x, 4) for x in w1], '->', round(sum(wi * v for wi, v in zip(w1, V)), 4))\nuniform = [1 / len(K)] * len(K)\nprint('average pooling:', sum(wi * v for wi, v in zip(uniform, V)))\none_hot = [1.0, 0.0, 0.0, 0.0]\nprint('exact lookup   :', sum(wi * v for wi, v in zip(one_hot, V)))",
      explanation: {
        ar: 'الاستعلام q = [1, 0] يوافق k1 تمامًا ويحاذي k3 نصفًا ويعادي k4: الحواصل 1 و 0 و 1 و −1، وبالقسمة على √2 تصير الدجات [0.7071, 0, 0.7071, −0.7071]. الـ softmax يعطي أوزانًا تجمع إلى 1 تمامًا: [0.3655, 0.1802, 0.3655, 0.0889]، والمخرج 21.777 — مزيج مائل نحو القيمتين المتوافقتين (10 و 30). التقنيع يغير المشهد: بطول صحيح 2 تتوزع الأوزان [0.6698, 0.3302, 0.0, 0.0] والمخرج 13.3024، وبطول 1 يصير وزن k1 واحدًا فيخرج 10.0 بالضبط — استعلام قاعدة بيانات نقية. والحالتان الاختزاليتان: أوزان متساوية تعيد متوسط القيم 25.0، ووزن 1 على k1 يعيد قيمتها 10.0.',
        en: 'The query q = [1, 0] matches k1 exactly, half-aligns with k3, and opposes k4: the dots are 1, 0, 1, \u22121, scaled by 1/\u221a2 into scores [0.7071, 0, 0.7071, \u22120.7071]. The softmax yields weights summing to exactly 1: [0.3655, 0.1802, 0.3655, 0.0889], and the output 21.777 \u2014 a mixture leaning toward the compatible values (10 and 30). Masking changes the picture: with a valid length of 2 the weights become [0.6698, 0.3302, 0.0, 0.0] and the output 13.3024; with a valid length of 1 the weight of k1 is 1.0 and the output is exactly 10.0 \u2014 a pure database lookup. The two degenerate cases: uniform weights return the value average 25.0, and a one-hot on k1 returns its value 10.0.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.attention-fn',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ attention(q, K, V, valid_len=None) التي تحسب الانتباه بالضرب القياسي المقيَّس: الدجات q·k/√d لكل مفتاح، فـ softmax (مع تقنيع المواضع ≥ valid_len بـ −1e6 عند تمرير valid_len)، ثم المجموع الموزون للقيم.',
        en: 'Implement attention(q, K, V, valid_len=None) computing scaled dot-product attention: scores q\u00b7k/\u221ad for each key, then a softmax (masking positions \u2265 valid_len with \u22121e6 when valid_len is given), then the weighted sum of the values.',
      },
      starterCode: "import math\n\ndef softmax(scores):\n    m = max(scores)\n    exps = [math.exp(s - m) for s in scores]\n    return [e / sum(exps) for e in exps]\n\ndef attention(q, K, V, valid_len=None):\n    ...  # TODO: scaled scores, optional mask, softmax, weighted sum of V\n    return out\n\nprint(attention([1.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [10.0, 20.0], valid_len=2))\nprint(attention([1.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [10.0, 20.0], valid_len=1))\nprint(attention([0.0, 0.0], [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [-1.0, 0.0]], [10.0, 20.0, 30.0, 40.0]))\n",
      solution: "import math\n\ndef softmax(scores):\n    m = max(scores)\n    exps = [math.exp(s - m) for s in scores]\n    return [e / sum(exps) for e in exps]\n\ndef attention(q, K, V, valid_len=None):\n    d = len(q)\n    sc = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in K]\n    if valid_len is not None:\n        sc = [s if i < valid_len else -1e6 for i, s in enumerate(sc)]\n    w = softmax(sc)\n    return sum(wi * v for wi, v in zip(w, V))",
      tests: [
        {
          id: 't1',
          name: { ar: 'مفتاحان حقيقيان: المزيج يتحيز للأقرب', en: 'Two real keys: the mixture leans toward the closer one' },
          code: "r = attention([1.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [10.0, 20.0], valid_len=2)\nassert abs(r - 13.302384506733432) < 1e-9, 'expected 13.3024 | actual: %r' % r",
          expected: '13.3024',
        },
        {
          id: 't2',
          name: { ar: 'طول صحيح 1: استعلام قاعدة بيانات نقية', en: 'Valid length 1: a pure database lookup' },
          code: "r = attention([1.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [10.0, 20.0], valid_len=1)\nassert abs(r - 10.0) < 1e-9, 'expected exactly the first value | actual: %r' % r",
          expected: '10.0',
        },
        {
          id: 't3',
          name: { ar: 'استعلام متعامد عن الكل: أوزان موحدة = متوسط القيم', en: 'A query orthogonal to everything: uniform weights = value average' },
          code: "r = attention([0.0, 0.0], [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [-1.0, 0.0]], [10.0, 20.0, 30.0, 40.0])\nassert abs(r - 25.0) < 1e-9, 'expected the average 25.0 | actual: %r' % r",
          expected: '25.0',
        },
      ],
      hints: [
        { ar: 'القسمة على √d تحدث مرة واحدة عند حساب الدجات: sc = [q·k / math.sqrt(len(q)) for k in K].', en: 'Divide by \u221ad once, while scoring: sc = [q\u00b7k / math.sqrt(len(q)) for k in K].' },
        { ar: 'التقنيع قبل الـ softmax وليس بعده: استبدل الدجات الزائدة بـ -1e6 فتصير أُسّها صفرًا عمليًا.', en: 'Mask before the softmax, not after: replace excess scores with -1e6 so their exponentials vanish.' },
        { ar: 'المجموع الموزون سطر واحد: sum(wi * v for wi, v in zip(w, V)).', en: 'The weighted sum is one line: sum(wi * v for wi, v in zip(w, V)).' },
        { ar: 'قيم تحقق: المزيج على مفتاحين = 13.3024، وطول 1 يعيد V[0] حرفيًا، و q = صفر يعطي أوزانًا متساوية 0.5/0.5 فالمخرج 15؟ لا — انتبه: على أربعة مفاتيح تكون 0.25 لكل منها والمخرج 25.', en: 'Sanity values: the two-key mixture = 13.3024; valid length 1 returns V[0] literally; a zero query over four keys gives 0.25 each and 25.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-scale',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'متجهان q و k بطول d = 64 مداخلهما مستقلة متساوية التوزيع بمتوسط صفر وتباين 1. حاصل ضربهما القياسي الخام q·k له تباين d. بعد قسمة الدرجة على √d كما في الانتباه المقيَّس، كم يصبح تباين الدرجة؟',
        en: 'Two vectors q and k of length d = 64 with iid zero-mean unit-variance entries have a raw dot product q\u00b7k with variance d. After dividing the score by \u221ad as in scaled dot-product attention, what is the variance of the score?',
      },
      answer: '1',
      tolerance: 1e-9,
      solution: '1',
      hints: [
        { ar: 'قسمة متغير ما على ثابت c تقسم تباينه على c\u00b2.', en: 'Dividing a variable by a constant c divides its variance by c\u00b2.' },
        { ar: 'هنا c = √d فيصير التباين d / (√d)\u00b2.', en: 'Here c = \u221ad, so the variance becomes d / (\u221ad)\u00b2.' },
        { ar: 'd / d = 1 — أيا كان d، وهذا جوهر التوسيع.', en: 'd / d = 1 \u2014 whatever d is, and that is the whole point of the scaling.' },
        { ar: 'بدون التوسيع لتبدد مدخلات exp مع d=64: تباين 64 يعني درجات متطرفة و softmax شبه ثنائي.', en: 'Without scaling, d=64 would give variance 64: extreme scores and a near one-hot softmax.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\nxs = [1.0, 2.0, 4.0]\nys = [2 * math.sin(x) + x for x in xs]   # the book's f(x) = 2 sin(x) + x\nq = 3.0\n\ndef nw_weights(q, xs, sigma):\n    kernels = [math.exp(-((q - x) ** 2) / (2 * sigma ** 2)) for x in xs]\n    total = sum(kernels)\n    return [k / total for k in kernels]\n\nprint('ys:', [round(y, 4) for y in ys], '| true f(3) =', round(2 * math.sin(3) + 3, 4))\nfor sigma in (1.0, 0.5):\n    w = nw_weights(q, xs, sigma)\n    f = sum(wi * y for wi, y in zip(w, ys))\n    print('sigma=%.1f weights=%s f(3)=%.4f' % (sigma, [round(x, 4) for x in w], f))\n\n# جرّب: sigma=2.0 — هل تقترب الأوزان من 1/3 فتصير النواة شبه الثابتة؟\n# try: sigma=2.0 - do the weights approach 1/3, turning the kernel near-constant?\n",
      prompt: {
        ar: 'الملعب يشغّل Nadaraya–Watson على ثلاث مشاهدات لـ f(x) = 2sin(x)+x عند استعلام q = 3. بعرض σ=1 تتوزع الأوزان [0.1004, 0.4498, 0.4498] فيكون التقدير 3.1054؛ وبσ=0.5 يذوب وزن البعيد إلى 0.0012 فيرتفع التقدير إلى 3.1519. القيمة الصحيحة 3.2822: النواة الأضيق تثق بالجيران فتتأقلم محليًا، والأعرض تتنعم نحو المتوسط — والمخرج دائمًا تركيب محدب للقيم مهما كانت σ.',
        en: 'The sandbox runs Nadaraya\u2013Watson over three observations of f(x) = 2sin(x)+x at query q = 3. With width \u03c3=1 the weights spread [0.1004, 0.4498, 0.4498] giving estimate 3.1054; with \u03c3=0.5 the far weight melts to 0.0012 and the estimate rises to 3.1519. The true value is 3.2822: a narrower kernel trusts neighbors and adapts locally, a wider one smooths toward the mean \u2014 and the output is always a convex combination of the values, whatever \u03c3.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا ينتج التجميع الانتباهي Attention(q, D) في الحالة الاختزالية التي يكون فيها وزن واحد 1 والبقية أصفارًا؟',
            en: 'What does attention pooling Attention(q, D) produce in the degenerate case where exactly one weight is 1 and the rest are 0?',
          },
          options: [
            { id: 'a', text: { ar: 'متوسط كل القيم في القاعدة', en: 'The average of all values in the database' } },
            { id: 'b', text: { ar: 'قيمة المفتاح المطابق فقط — سلوك استعلام قاعدة البيانات التقليدي', en: 'Only the value of the matching key \u2014 classic database-query behavior' } },
            { id: 'c', text: { ar: 'صفرًا لأن الأوزان معظمها أصفار', en: 'Zero, because most weights are zero' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المخرج تركيب خطي Σ α(q, k_i)·v_i؛ عند ذوبان جميع الأوزان إلا واحد يبقى v المطابق وحده — الانتباه الناعم يحتوي الاستعلام الصلب كحالة خاصة، وبينهما كل درجات المزيج المحدب.',
            en: 'The output is a linear combination \u03a3 \u03b1(q, k_i)\u00b7v_i; when all weights but one vanish, only the matching v survives \u2014 soft attention contains the hard lookup as a special case, with every degree of convex mixture in between.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا تُقسَّم حواصل الضرب القياسية على √d في انتباه Transformers؟',
            en: 'Why are dot-product scores divided by \u221ad in Transformer attention?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن حاصل الضرب لمداخل مستقلة وحدة التباين له تباين d، والقسمة تعيده إلى 1 فتبقى softmax مستقرة عدديًا', en: 'Because the dot product of iid unit-variance entries has variance d; dividing restores 1, keeping the softmax numerically stable' } },
            { id: 'b', text: { ar: 'لتقليل عدد المعاملات القابلة للتعلم', en: 'To reduce the number of learnable parameters' } },
            { id: 'c', text: { ar: 'لتسريع الحساب بتصغير المصفوفات', en: 'To speed up computation by shrinking the matrices' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'تباين q\u22a4k ينمو خطيًا مع d؛ درجات متباينة جدًا تجعل softmax يقفز إلى واحد-ساخن ويخنق التدرجات. القسمة على √d تحفظ التباين 1 مهما بلغ البعد — ذكرت في s3 وأسست لكل ما يأتي.',
            en: 'The variance of q\u22a4k grows linearly in d; wildly spread scores push softmax toward one-hot and throttle gradients. Dividing by \u221ad keeps variance 1 at any dimension \u2014 established in s3 and foundational for everything after.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'softmax المُقنَّع يعطي المواضع بعد الطول الصحيح درجة −10^6. لماذا هذا الرقم تحديدًا؟',
            en: 'Masked softmax gives positions beyond the valid length a score of \u221210^6. Why that particular number?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن أسّ −10^6 عمليًا صفر، فيصير وزن الحشو صفرًا دون أنكسر تطبيع الأوزان الباقية', en: 'Because exp(\u221210^6) is effectively zero: padding weight becomes 0 without breaking the normalization of the remaining weights' } },
            { id: 'b', text: { ar: 'لأنه أصغر عدد يمكن تمثيله بلغة بايثون', en: 'Because it is the smallest number representable in Python' } },
            { id: 'c', text: { ar: 'ليُحذف الرمز فعليًا من المصفوفة قبل الحساب', en: 'So the token is physically deleted from the tensor before computing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'لا يمكن حذف مواضع من مصفوفة دفعة موحدة الشكل، فتُدفَع درجاتها بعيدًا حتى يتلاشى أُسّها: صفر وزن، وتظل الأوزان الحقيقية تجمع إلى 1. رأيت أثره في المثال: بطول صحيح 2 اختفت الوزنان الأخيرتان كليًا.',
            en: 'You cannot delete positions from a uniform-shape batch tensor, so their scores are pushed far enough that their exponentials vanish: zero weight, while real weights still sum to 1. You saw the effect: with valid length 2 the last two weights disappeared entirely.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'إطار Q/K/V (الهدف من s1): التجميع الانتباهي تركيب خطي للقيم بأوزان توافق، و softmax يجعلها مزيجًا محدبًا — من الاستعلام الصلب (وزن 1) إلى المتوسط (أوزان متساوية).', en: 'The Q/K/V framework (goal of s1): attention pooling is a linear combination of values with compatibility weights, and softmax turns them into a convex mixture \u2014 spanning the hard lookup (weight 1) to the average (uniform weights).' },
        { ar: 'الجذر التاريخي (الهدف من s2): انحدار Nadaraya–Watson نووي بلا تدريب، بنواة غاوسية وعرض σ يضبط النعومة — يكشف حدود النوى اليدوية ويدفع نحو تعلم تمثيلات q و k.', en: 'The historical root (goal of s2): training-free Nadaraya\u2013Watson kernel regression with a Gaussian kernel whose width \u03c3 tunes smoothness \u2014 revealing the limits of hand-crafted kernels and motivating learned q/k representations.' },
        { ar: 'دوال التنقيط (الهدف من s3): الضرب القياسي المقيَّس q·k/√d (إعادة التباين إلى 1)، و softmax المُقنَّع للحشو بدرجات −10^6، والانتباه الإضافي tanh للأبعاد المختلفة — أساس كل ما سيأتي في هذا الفصل.', en: 'Scoring functions (goal of s3): the scaled dot product q\u00b7k/\u221ad (variance back to 1), masked softmax for padding via \u221210^6 scores, and additive tanh attention for mismatched dimensions \u2014 the basis for the rest of this chapter.' },
      ],
      reflectPrompt: {
        ar: 'في نظام ترجمة حقيقي: ما الذي يلعب دور q وما الذي يلعب دور (k, v) حين يولّد المفكِّك الرمز الثالث؟ ونقاش: هل توافق q مع المفتاح دالة مسافة أم ضرب قياسي مقيَّس؟',
        en: 'In a real translation system, what plays the role of q and what plays (k, v) when the decoder emits its third token? And discuss: is query-key compatibility a distance or a scaled dot product?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch11.s1' },
        { book: 'D2L', section: 'd2l.ch11.s2' },
        { book: 'D2L', section: 'd2l.ch11.s3' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch11.s1' },
    { book: 'D2L', section: 'd2l.ch11.s2' },
    { book: 'D2L', section: 'd2l.ch11.s3' },
  ],
} satisfies Lesson;

export default lesson;
