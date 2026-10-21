import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch5.l3 — "Generalization, Dropout, and Predicting House Prices"
 * التعميم والتسريب والتنبؤ بأسعار المنازل
 * Aligned with D2L ch5 s5 (Generalization in Deep Learning) + s6 (Dropout) +
 * s7 (Predicting House Prices on Kaggle). All expression is original — a
 * paraphrase of the source's ideas, never a verbatim translation. Runnable
 * design: dropout with a FIXED 0/1 mask and the expectation-preservation
 * proof, the standardize/mean-fill/one-hot preprocessing pipeline on a tiny
 * literal column, and K-fold index slicing. Every printed literal verified
 * under CPython 3. Deterministic only: no input(), no exit().
 */
const lesson = {
  id: 'd2l.ch5.l3',
  version: 1,
  part: 'II',
  track: 'A3',
  book: 'D2L',
  chapter: 5,
  title: {
    ar: 'التعميم والتسريب والتنبؤ بأسعار المنازل',
    en: 'Generalization, Dropout, and Kaggle Houses',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch5.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'شبكتك تحفظ بيانات التدريب تمامًا — خطأ تدريب صفر — ومع ذلك قد تخسر على البيانات الجديدة. هذا هو نظام الاستيفاء الذي ظهر مع التعلم العميق، ولا ينفعنا فيه زملاء النماذج الخطية التقليدية. في هذا الدرس تتعلم أدوات إغلاق الفجوة: التسريب الذي يُسقط وحدات عشوائيًا ويُعيد موازنتها، ثم خط المعالجة الكامل لبيانات حقيقية فوضوية من منافسة Kaggle للتنبؤ بأسعار المنازل مع قياس الخطأ على المقياس اللوغاريتمي والتحقق المتقاطع.',
        en: 'Your network memorizes the training set perfectly — zero training error — and may still lose on new data. That is the interpolation regime deep learning landed us in, and the classical linear-model toolkit does not map onto it. This lesson gives you the gap-closing tools: dropout, which drops units and rescales the rest, then the full preprocessing pipeline for genuinely messy data from the Kaggle house-price competition, with error measured on a log scale and validated by cross-validation.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من نظرية التعميم إلى بيانات حقيقية', en: 'From generalization theory to real data' },
      chunks: [
        {
          ar: 'النماذج العميقة مفرطة المعاملات: تتعدى معاملاتها عدد الأمثلة، فتستوفي بيانات التدريب كاملة (تُطابق حتى الشُرَر المضروبة)، والنماذج المتنافسة كلها تصنع خطأ تدريب صفريًا — لذا كل المكسب يأتي من تقليص الفجوة بين التدريب والاختبار، وقد تكون الفجوة غير رتيبة مع التعقيد (نمط النزول المزدوج). الأقرب للحدس هو النظر إلى الشبكات كنماذج لا معاملية مثل جار k الأقرب الذي يحفظ البيانات ويُعيد البناء حسب مسافة مختارة. أدوات عملية: الإيقاف المبكر بمراقبة خطأ التحقق مع عتبة صبر، وتلاشي أثر وزن ℓ2 وlasso الذي لم يعد يفسر استمرار شعبيتها إلا بانحيازات إخبارية أفضل.',
          en: 'Deep nets are over-parametrized: more parameters than examples, able to interpolate the training set exactly (even fitting corrupted labels), and every competing architecture reaches zero training error — so all gains must come from closing the train-test gap, and that gap can be non-monotonic in complexity (the double-descent pattern). The best intuition is to treat them like nonparametric models such as k-nearest-neighbors, which memorizes data and reconstructs by a chosen distance. Practical tools: early stopping, monitoring validation error with a patience threshold, and weight decay (ridge/lasso), whose continued popularity survives even though it no longer constrains power in the classical sense.',
        },
        {
          ar: 'التسريب dropout يُحقن ضجيجًا داخل الطبقات الخفية: أثناء التدريب فقط يُصفَّر كل تفعيل باحتمال p ويُقسم الناجي على (1−p): h′ = 0 باحتمال p، وإلا h/(1−p) — فالقيمة المتوقعة تبقى E[h′] = h بلا انحياز. الفكرة صارت معيارية بعد Srivastava وزملائه (2014): يمنع التكيّف المشترك co-adaptation حيث تعتمد طبقة على نمط تفعيلات بعينه في ما قبلها. وقت التنبؤ يُطفأ التسريب كليًا وتمر القيم كما هي. في الكتاب يُطبق بعد كل دالة تنشيط بخيار p لكل طبقة — عبر `nn.Dropout(p)` في النسخة المختصرة — ويكون أقل قرب المدخلات وأعلى في الأعماق.',
          en: 'Dropout injects noise inside hidden layers: during training only, each activation is zeroed with probability p and the survivors are divided by (1−p): h\u2032 = 0 with probability p, else h/(1\u2212p) — so the expectation is unchanged, E[h\u2032] = h, unbiased. It became standard through Srivastava et al. (2014): it prevents co-adaptation, where a layer leans on one specific activation pattern upstream. At prediction time dropout is switched off entirely and values flow unchanged. In the book it is applied after every activation with a per-layer p — via `nn.Dropout(p)` in the concise version — typically lower near the input, higher deeper.',
        },
        {
          ar: 'بيانات Kaggle الحقيقية خليط أنواع: أعمدة عددية تُوحّد المقياس بـ x ← (x − μ)/σ، والقيم المفقودة تُستبدل بمتوسط العمود فتصير 0 بعد التوحيد، والفئوية تتحول إلى أعمدة مؤشر 0/1 عبر `pd.get_dummies` (مع dummy_na) — 79 خاصية تصير 331. خطأ المسابقة يُقاس لوغاريتميًا: RMSE بين log y وlog ŷ، لأن δ في |log y − log ŷ| يعني نسبة ضمن e^±δ — نهتم بالنسب لا الفروق المطلقة. ولن نقيس على المجموعة الرسمية إلا بعد التقديم، فنقطع بيانات التدريب (1460 صفًا) إلى K أجزاء للتحقق المتقاطع ونمتثل متوسط أخطائها.',
          en: 'Real Kaggle data mixes types: numeric columns are standardized with x \u2190 (x \u2212 \u03bc)/\u03c3, missing values are replaced by the column mean (which becomes 0 after standardization), and categorical ones become 0/1 indicator columns via `pd.get_dummies` (with dummy_na) — 79 features become 331. The competition error is log-scaled: RMSE between log y and log \u0177, because \u03b4 in |log y \u2212 log \u0177| means the ratio sits within e^\u00b1\u03b4 — we care about relative, not absolute, gaps. Since the official test labels arrive only after submitting, we slice the 1460 training rows into K folds for cross-validation and average their validation errors.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'تسريب بقناع ثابت + توحيد المقياس وone-hot + شُرَق K',
        en: 'Dropout with a fixed mask + standardize/one-hot + K fold slices',
      },
      code: "# ---- 1) dropout with a FIXED keep-mask (no sampling, deterministic) ----\nh0 = [1.0, 2.0, 3.0, 4.0, 5.0]\np = 0.4\nkeep = [0, 1, 1, 0, 1]                # 1 = keep, 0 = drop\nh1 = [0.0 if k == 0 else v / (1.0 - p) for k, v in zip(keep, h0)]\nprint(\"h  =\", h0)\nprint(\"h' =\", ['%.4f' % v for v in h1])\nexpect = [(1.0 - p) * (v / (1.0 - p)) for v in h0]   # E[h'] per element\nprint(\"E[h'] =\", expect, ' -> unbiased: E[h\\'] == h')\n\n# ---- 2) standardize a numeric column (sample std, like pandas .std()) ----\nxs = [65.0, 80.0, 68.0, 60.0]         # a LotFrontage-like column\nmu = sum(xs) / len(xs)\nsd = (sum((v - mu) ** 2 for v in xs) / (len(xs) - 1)) ** 0.5\nzs = [(v - mu) / sd for v in xs]\nprint('mu=%.2f  sd=%.4f' % (mu, sd))\nprint('z   =', ['%.4f' % v for v in zs], ' <- a missing value would become 0.0 here')\n\n# ---- 3) one-hot encoding of a categorical column ----\nzone = ['RL', 'RM', 'RL', 'RL']\ncols = sorted(set(zone))\nonehot = [[1 if v == c else 0 for c in cols] for v in zone]\nprint('columns %s -> %s' % (cols, onehot))\n\n# ---- 4) K-fold cross-validation index slices ----\nrows = 10\nk = 5\nsize = rows // k\nfolds = [list(range(j * size, (j + 1) * size)) for j in range(k)]\nprint('%d-fold over %d rows: %s' % (k, rows, folds))",
      explanation: {
        ar: 'بقناع ثابت p = 0.4: الناجون يتضاعفون قسمةً على 0.6 فتظهر h′ = [0, 3.3333, 5.0, 0, 8.3333]، والقيمة المتوقعة لكل عنصر (1−p)·h/(1−p) = h بالضبط — هذا هو شرط عدم الانحياز الذي يسمح بحقن الضجيج دون تغيير متوسط الطبقة. توحيد العمود [65, 80, 68, 60] يعطي μ = 68.25 وانحرافًا العينة sd = 8.5 بالضبط، فتتحول القيم إلى [−0.3824, 1.3824, −0.0294, −0.9706]، والقيمة المفقودة بعد المعالجة تصير 0 أي المتوسط. one-hot حوّل عمود MSZoning إلى عمودي RL/RM. وأخيرًا 10 صفوف إلى 5 شُرَق بحجم 2: [[0,1],[2,3],[4,5],[6,7],[8,9]] — كل شرق يصير تحققًا والباقي تدريبًا.',
        en: 'With a fixed mask at p = 0.4: survivors are divided by 0.6, giving h\u2032 = [0, 3.3333, 5.0, 0, 8.3333], and the per-element expectation (1\u2212p)·h/(1\u2212p) equals h exactly — the unbiasedness condition that lets noise in without shifting the layer mean. Standardizing [65, 80, 68, 60] gives \u03bc = 68.25 and a sample sd of exactly 8.5, mapping values to [−0.3824, 1.3824, −0.0294, −0.9706]; a missing value would become 0, i.e. the mean. One-hot turned the MSZoning column into RL/RM indicators. Finally 10 rows slice into 5 folds of size 2: [[0,1],[2,3],[4,5],[6,7],[8,9]] — each fold validates while the rest trains.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.dropout-and-standardize',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين من أدوات الدرس: dropout_layer(h, p, keep_mask) تُصفّر العناصر التي قناعها 0 وتقسم الناجين على (1 − p)؛ وstandardize(xs) تُعيد ثلاثية (zs, mu, sd) حيث sd الانحراف المعياري للعينة (القسمة على n − 1 مثل pandas) وzs القيم الموحدة (x − μ)/sd.',
        en: 'Implement two tools from the lesson: dropout_layer(h, p, keep_mask) zeroes entries whose mask is 0 and divides survivors by (1 \u2212 p); and standardize(xs) returns the triple (zs, mu, sd) where sd is the sample standard deviation (divide by n \u2212 1, like pandas) and zs holds the standardized values (x \u2212 \u03bc)/sd.',
      },
      starterCode: "def dropout_layer(h, p, keep_mask):\n    ...  # TODO: 0 where mask==0, else h / (1 - p)\n\ndef standardize(xs):\n    ...  # TODO: mu, sample sd (n-1), then zs -> return (zs, mu, sd)\n",
      solution: "def dropout_layer(h, p, keep_mask):\n    return [0.0 if k == 0 else v / (1.0 - p) for k, v in zip(keep_mask, h)]\n\ndef standardize(xs):\n    n = len(xs)\n    mu = sum(xs) / n\n    sd = (sum((v - mu) ** 2 for v in xs) / (n - 1)) ** 0.5\n    zs = [(v - mu) / sd for v in xs]\n    return zs, mu, sd",
      tests: [
        {
          id: 't1',
          name: { ar: 'الناجي يُعاد موازنته والمُسقَط يصير صفرًا', en: 'Survivors rescaled, dropped become zero' },
          code: "out = dropout_layer([4.0, 4.0, 4.0, 4.0], 0.5, [1, 0, 1, 0])\nassert out == [8.0, 0.0, 8.0, 0.0], 'expected [8.0, 0.0, 8.0, 0.0] | actual: %r' % (out,)",
          expected: '[8.0, 0.0, 8.0, 0.0]',
        },
        {
          id: 't2',
          name: { ar: 'بلا تسريب (p = 0) لا تغيير', en: 'With p = 0 nothing changes' },
          code: "out = dropout_layer([1.0, 2.0, 3.0], 0.0, [1, 1, 1])\nassert out == [1.0, 2.0, 3.0], 'expected [1.0, 2.0, 3.0] | actual: %r' % (out,)",
          expected: '[1.0, 2.0, 3.0]',
        },
        {
          id: 't3',
          name: { ar: 'توحيد عمود الدرس: sd = 8.5 بالضبط', en: 'Standardize the lesson column: sd = exactly 8.5' },
          code: "zs, mu, sd = standardize([65.0, 80.0, 68.0, 60.0])\nassert abs(mu - 68.25) < 1e-9, 'expected mu=68.25 | actual: %r' % mu\nassert abs(sd - 8.5) < 1e-9, 'expected sd=8.5 | actual: %r' % sd\nassert abs(zs[0] + 0.38235294117647056) < 1e-9, 'expected zs[0]=-0.3823529412 | actual: %r' % zs[0]",
          expected: 'mu=68.25, sd=8.5, zs[0]=-0.3824',
        },
      ],
      hints: [
        { ar: 'قسّم الناجي على (1 − p) لا على p — هذا ما يجعل E[h′] = h.', en: 'Divide survivors by (1 \u2212 p), not by p — that is what makes E[h\u2032] = h.' },
        { ar: 'zip(keep_mask, h) يجاور كل قيمة بقناعها في سطر واحد.', en: 'zip(keep_mask, h) pairs each value with its mask in one line.' },
        { ar: 'الانحراف للعينة: sd = √(Σ(x−μ)² / (n−1)) — القسمة على n − 1.', en: 'Sample standard deviation: sd = \u221a(\u03a3(x\u2212\u03bc)\u00b2 / (n\u22121)) — divide by n \u2212 1.' },
        { ar: 'قيم تحقق: p = 0.5 وقناع [1,0,1,0] على أربعة أرباع تعطي [8, 0, 8, 0]؛ وعمود [65, 80, 68, 60] معياره 8.5 بالضبط.', en: 'Sanity: p = 0.5 with mask [1,0,1,0] over four 4s gives [8, 0, 8, 0]; column [65, 80, 68, 60] has sd exactly 8.5.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.survivor-value',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'في طبقة خفية قيمتها h = 10 طبّقنا التسريب باحتمال p = 0.2 فنجا هذا التفعيل (قناعه 1). ما القيمة التي يحملها بعد إعادة الموازنة؟',
        en: 'In a hidden layer an activation h = 10 went through dropout with p = 0.2 and survived (mask 1). What value does it carry after rescaling?',
      },
      answer: '12.5',
      tolerance: 1e-9,
      solution: '12.5',
      hints: [
        { ar: 'الناجي يُقسم على (1 − p) لتعويض الناقص.', en: 'A survivor is divided by (1 \u2212 p) to compensate for the dropped.' },
        { ar: 'هنا 1 − p = 0.8.', en: 'Here 1 \u2212 p = 0.8.' },
        { ar: 'القيمة = h / (1 − p) = 10 / 0.8.', en: 'Value = h / (1 \u2212 p) = 10 / 0.8.' },
        { ar: 'الجواب: 12.5.', en: 'Answer: 12.5.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\n# the log-scale error the competition uses\ny = 208500.0\nyhat = 250000.0\ndelta = abs(math.log(y) - math.log(yhat))\nprint('y=%d  yhat=%d' % (y, yhat))\nprint('|log y - log yhat| = %.6f' % delta)\nprint('guarantee: yhat/y in [e^-d, e^+d] = [%.4f, %.4f]' % (math.exp(-delta), math.exp(delta)))\n\n# same absolute mistake, two different markets\nprint('relative error rural (y=125000):  %.2f%%' % (100.0 * 100000.0 / 125000.0))\nprint('relative error Los Altos (y=4M):  %.2f%%' % (100.0 * 100000.0 / 4000000.0))\n\n# dropout probabilities at work (fixed masks, deterministic)\nfor p, keep in ((0.0, [1, 1, 1, 1]), (0.5, [1, 0, 1, 0]), (0.25, [0, 1, 1, 0])):\n    h = [2.0, 4.0, 6.0, 8.0]\n    h1 = [0.0 if k == 0 else v / (1.0 - p) for k, v in zip(keep, h)]\n    print('p=%.2f keep=%s -> %s' % (p, keep, ['%.3f' % v for v in h1]))\n\n# K-fold over 1460 training rows\nrows, k = 1460, 5\nprint('fold size for %d rows, k=%d: %d' % (rows, k, rows // k))\n\n# جرّب: كيف يتغير δ لو أخطأت بعشرين بالمئة نسبةً لا بمئة ألف مطلقة؟\n# try: how does delta change for a 20% relative mistake instead of a fixed 100k?\n# جرّب: p = 0.9 مع قناع يُبقي عنصرًا واحدًا — كم تبلغ قيمته بعد الموازنة؟\n# try: p = 0.9 with a mask keeping one element - what is its rescaled value?\n",
      prompt: {
        ar: 'الملعب يحسب خطأ المسابقة اللوغاريتمي على مثال سعر حقيقي (208500 مقابل توقع 250000) ويحوّله إلى ضمان نسبة e^±δ، ثم يقارن الخطأ النسبي في سوقين مختلفين، ويعرض قناع تسريب ثابتة باحتمالات مختلفة.',
        en: 'The sandbox computes the competition log-error on a real price (208500 vs a 250000 prediction), converts it into the e^\u00b1\u03b4 ratio guarantee, compares the relative mistake across two very different markets, and runs fixed dropout masks at several probabilities.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في نظام الاستيفاء حيث كل البنى المتنافسة تصنع خطأ تدريب صفريًا، من أين يأتي التحسن الإضافي؟',
            en: 'In the interpolation regime, where every competing architecture achieves zero training error, where do further gains come from?',
          },
          options: [
            { id: 'a', text: { ar: 'من تقليل خطأ التدريب أكثر فأكثر', en: 'From pushing training error even lower' } },
            { id: 'b', text: { ar: 'من تقليص الفجوة بين التدريب والاختبار (التخفيف من فرط التخصيص)', en: 'From shrinking the train-test gap (mitigating overfitting)' } },
            { id: 'c', text: { ar: 'من إزالة التنظيم تمامًا لأنه لم يعد مفيدًا', en: 'From removing regularization entirely since it no longer helps' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حين يكون خطأ التدريب صفرًا لكل الخيارات فلا مكان للتحسين إلا جانب الاختبار: التسريب والإيقاف المبكر وتلاشي الوزن وغيرها كلها وسائل لتقليص الفجوة العامة، حتى التي تبدو أنها تزيد تعقيد النموذج.',
            en: 'Once training error is zero for every option, the only side left to improve is test: dropout, early stopping and weight decay all work by closing the generalization gap — even interventions that look like they add complexity.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا يُطفأ التسريب وقت التنبؤ عادةً؟',
            en: 'Why is dropout usually disabled at prediction time?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه لا يعمل إلا مع البيانات الصورية', en: 'Because it only works on image data' } },
            { id: 'b', text: { ar: 'لأن الإسقاط ضجيج تدريبي، والتنبؤ يحتاج الشبكة الكاملة الحتمية — والموازنة أثناء التدريب تكفي لتصحيح القيم المتوقعة', en: 'Dropping is training noise; prediction wants the full deterministic network — the training-time rescaling already fixed the expected values' } },
            { id: 'c', text: { ar: 'لأن حسابه مكلف جدًا وقت التنبؤ', en: 'Because it is too expensive at prediction time' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'أثناء التدريب نريد كسر التكيف المشترك بحقن ضجيج غير منحاز (E[h′] = h). لكن عند التنبؤ نريد أفضل تقدير حتمي من كل الوحدات، والاستثناء الوحيد بعض الباحثين يستخدمونه لقياس عدم اليقين بتشغيله عدة مرات ومقارنة التوقعات.',
            en: 'During training we break co-adaptation with unbiased noise (E[h\u2032] = h). At prediction we want the best deterministic estimate from every unit. The one exception: some researchers run dropout at test time repeatedly to gauge uncertainty from prediction spread.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يقيس التنبؤ بأسعار المنازل الخطأ على المقياس اللوغاريتمي؟',
            en: 'Why does house-price prediction measure error on the log scale?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يهتم بالنسبة لا بالفرق المطلق: δ في |log y − log ŷ| يعني أن النسبة ضمن e^±δ', en: 'It cares about ratios, not absolute gaps: \u03b4 in |log y \u2212 log \u0177| means the ratio lies within e^\u00b1\u03b4' } },
            { id: 'b', text: { ar: 'لأن اللوغاريتم يجعل الحساب أسرع', en: 'Because logarithms make computation faster' } },
            { id: 'c', text: { ar: 'لأن الأسعار سالبة أحيانًا', en: 'Because prices are sometimes negative' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'خطأ مئة ألف كارثة في سوق بيت وسطيه 125 ألف ومفاضلة تافهة في سوق يتجاوز متوسطه 4 ملايين. المقياس اللوغاريتمي يجعل الخطأ نسبيًا: |log y − log ŷ| ≤ δ يعادل e^−δ ≤ ŷ/y ≤ e^δ، وهو مقياس المسابقة الرسمي.',
            en: 'A 100k mistake is catastrophic where the median house is 125k and trivial where the median tops 4M. The log scale makes error relative: |log y \u2212 log \u0177| \u2264 \u03b4 is equivalent to e^\u2212\u03b4 \u2264 \u0177/y \u2264 e^\u03b4 — the competition\u2019s official metric.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الشبكات العميقة مفرطة المعاملات وتستوفي بيانات التدريب حتى المشوبخ، فالمكسب كله من إغلاق فجوة التعميم — والإيقاف المبكر بتتبع خطأ التحقق أداة بسيطة توفر الوقت أيضًا (الهدف من s5 التعميم في التعلم العميق).', en: 'Deep nets are over-parametrized and interpolate the training set, corrupted labels included, so all gains come from closing the generalization gap — early stopping on validation error is a simple tool that also saves time (goal of s5 Generalization in Deep Learning).' },
        { ar: 'التسريب يُصفّر التفعيلات باحتمال p ويوازن الناجين بقسمة (1−p) فتبقى E[h′] = h، يمنع التكيف المشترك ويعمل تدريبًا فقط — في الكتاب `nn.Dropout(p)` بعد كل تنشيط (الهدف من s6 التسريب).', en: 'Dropout zeroes activations with probability p and rescales survivors by 1/(1\u2212p) so E[h\u2032] = h; it fights co-adaptation and is training-only — in the book `nn.Dropout(p)` after every activation (goal of s6 Dropout).' },
        { ar: 'بيانات حقيقية: وحّد المقياس، املأ المفقود بمتوسط العمود، حوّل الفئوية إلى أعمدة 0/1 (79 ← 331)، وقس الخطأ لوغاريتميًا لأن النسب أهم، واختر المعاملات بتحقق متقاطع K-fold (الهدف من s7 التنبؤ بأسعار المنازل على Kaggle).', en: 'Real data: standardize, fill missing with the column mean, one-hot the categoricals (79 \u2190 331), measure error in log space because ratios matter, and tune via K-fold cross-validation (goal of s7 Predicting House Prices on Kaggle).' },
      ],
      reflectPrompt: {
        ar: 'التسريب يضيف ضجيجًا ويحسّن التعميم، والاستيفاء الكامل خطأ تدريب صفري لا يضمن شيئًا. متى يكون «إتقان التدريب» مؤشرًا خادعًا على النجاح، وكيف تكتشف الخداع قبل أن تدفع ثمنه على الاختبار؟',
        en: 'Dropout adds noise and helps generalization; perfect interpolation (zero training error) guarantees nothing. When is flawless training performance a misleading signal of success — and how do you catch the deception before paying for it on the test set?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch5.s5' },
        { book: 'D2L', section: 'd2l.ch5.s6' },
        { book: 'D2L', section: 'd2l.ch5.s7' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch5.s5' },
    { book: 'D2L', section: 'd2l.ch5.s6' },
    { book: 'D2L', section: 'd2l.ch5.s7' },
  ],
} satisfies Lesson;

export default lesson;
