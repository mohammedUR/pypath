import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch8.l2 — "GoogLeNet and Batch Normalization"
 * GoogLeNet وتطبيع الدفعات
 * Aligned with D2L ch8 s4 (Multi-Branch Networks (GoogLeNet)) + s5 (Batch
 * Normalization). All expression is original — a paraphrase of the source's
 * ideas, never a verbatim translation. Runnable design: Inception-block
 * channel-concat arithmetic (the book's 256/480/512/832/1024 sums and the
 * 2:4:1:1 ratio), and batch normalization on a fixed column with verified
 * mean/var normalization, a learnable gamma/beta pass, and the moving
 * average. Every printed literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch8.l2',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 8,
  title: {
    ar: 'GoogLeNet وتطبيع الدفعات',
    en: 'GoogLeNet and Batch Normalization',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch8.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'هل تستعمل نواة كبيرة أم صغيرة؟ سؤال GoogLeNet كان: لماذا نختار أصلًا؟ فبنى كتلة تنفذ الأربعة فروعًا متوازية وتلصق نتائجها. وفي الوقت نفسه كان التدريب العميق يعاني أن كل طبقة ترى مدخلات تتحرك تحت قدميها — فجاء تطبيع الدفعات ليثبّت الإحصاءات طبقةً بطبقة. في هذا الدرس تحسب دمج الفروع بالأرقام وتطبّق التطبيع على عمود واحد حتى ترى المتوسط يذوب والتباين يتقلص إلى واحد.',
        en: 'A big kernel or a small one? GoogLeNet\u2019s question was: why choose at all? It built a block running four parallel branches and concatenating their results. Meanwhile deep training suffered from every layer seeing inputs shifting under its feet \u2014 so batch normalization arrived to pin the statistics, layer by layer. In this lesson you compute branch merging in numbers and apply normalization to a single column until you watch the mean dissolve and the variance shrink to one.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'فروع متوازية ثم إحصاءات مستقرة', en: 'Parallel branches, then stable statistics' },
      chunks: [
        {
          ar: 'كتلة Inception أربعة فروع متوازية: تفاف 1×1، ثم 1×1 يقلص القنوات قبل 3×3، ثم 1×1 قبل 5×5، ورابع فرع تجميع أعظمي 3×3 بخطوة 1 يليه 1×1 — كلها بحشو مناسب يجعل الارتفاع والعرض متساوية، ثم تُدمج المخرجات على بُعد القنوات. المعامل الوحيد المضبوط هو توزيع القنوات على الفروع؛ فالفروع الوسطى تنقص القنوات أولًا لتخفيض الكلفة (192/2 = 96 و192/12 = 16 في الكتلة الأولى). GoogLeNet جذر 7×7 بـ 64 قناة ثم 9 كتل inception في ثلاث مجموعات يفصلها تجميع، ورأس global average pooling — أول شبكة عصرية بمعاملات أقل من سابقيها ودقة أعلى.',
          en: 'An Inception block runs four parallel branches: a 1\u00d71 conv; a 1\u00d71 channel reducer before a 3\u00d73; a 1\u00d71 before a 5\u00d75; and a fourth branch of 3\u00d73 max-pooling (stride 1) followed by 1\u00d71 \u2014 all padded so heights and widths match, then concatenated along the channel axis. The tuned knob is how channels are split across branches; the middle branches reduce first to cut cost (192/2 = 96 and 192/12 = 16 in the first block). GoogLeNet: a 7\u00d77 stem with 64 channels, then 9 inception blocks in three groups separated by pooling, and a global-average-pooling head \u2014 the first modern net, cheaper than predecessors yet more accurate.',
        },
        {
          ar: 'تطبيع الدفعات يثبّت التفعيلات: للطبقة الكثيفة نحسب μ وσ² لكل خاصية على الدفعة نفسها ثم x_hat = (x − μ)/√(σ² + ε) ويمر عبر معاملَي قياس وإزاحة قابلين للتدريب γ وβ: الناتج γ·x_hat + β. في التلافيف يُطبق لكل قناة على كل المواقع: m·p·q قيمة في المتوسط، فلكل قناة μ وσ² وγ وβ خاصين بها — اتساق مع فرضية ثبات الموقع. وقت التنبؤ تُستبدل إحصاءات الدفعة بمتوسطات متحركة مُثبتة بعد التدريب. الفائدة العملية: تدرجات أهدأ فمعدل تعلم أكبر وتقارب أسرع، وطبقة متعامدة (layer normalization) تحل مشكلة الدفعة الصغيرة لأنها تطبع كل مثال وحده.',
          en: 'Batch normalization pins activations: for dense layers compute \u03bc and \u03c3\u00b2 per feature on the same minibatch, then x_hat = (x \u2212 \u03bc)/\u221a(\u03c3\u00b2 + \u03b5), passed through trainable scale and shift parameters \u03b3 and \u03b2: the output is \u03b3\u00b7x_hat + \u03b2. In convolutions it applies per channel across all locations: m\u00b7p\u00b7q values enter the average, each channel owning its own \u03bc, \u03c3\u00b2, \u03b3, \u03b2 \u2014 consistent with the translation-invariance assumption. At prediction time batch statistics are replaced by fixed moving averages computed after training. Practically: calmer gradients allow larger learning rates and faster convergence, and layer normalization solves the tiny-batch case by normalizing each example alone.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'دمج قنوات Inception بالأرقام + تطبيع دفعة على عمود ثابت',
        en: 'Inception channel merging in numbers + batch norm on a fixed column',
      },
      code: "# ---- 1) Inception block: output channels = sum of the four branches ----\ndef inception_out(c1, c2, c3, c4):\n    return c1 + c2 + c3 + c4\n\nprint('b3 inception 1: %d (ratio %d:%d:%d:%d)' % (inception_out(64, 128, 32, 32), 64, 128, 32, 32))\nprint('b3 inception 2: %d' % inception_out(128, 192, 96, 64))\nprint('b4 last:        %d' % inception_out(256, 320, 128, 128))\nprint('b5 last:        %d' % inception_out(384, 384, 128, 128))\nprint('reductions of 192 input channels: 192/2 = %d, 192/12 = %d' % (192 // 2, 192 // 12))\n\n# ---- 2) batch normalization on one fixed column ----\ndef batch_norm_col(xs, gamma, beta, eps=0.0):\n    mu = sum(xs) / len(xs)\n    var = sum((v - mu) ** 2 for v in xs) / len(xs)\n    hat = [(v - mu) / (var + eps) ** 0.5 for v in xs]\n    return [gamma * v + beta for v in hat], mu, var\n\nxs = [2.0, 4.0, 6.0, 8.0]\nout, mu, var = batch_norm_col(xs, 1.0, 0.0)\nprint('raw: mu=%.2f var=%.2f' % (mu, var))\nprint('x_hat =', ['%.6f' % v for v in out])\nnm = sum(out) / len(out)\nnv = sum((v - nm) ** 2 for v in out) / len(out)\nprint('normalized: mu=%.1e var=%.6f' % (nm, nv))\n\nout2, _, _ = batch_norm_col(xs, 2.0, 1.0)\nprint('gamma=2, beta=1 ->', ['%.4f' % v for v in out2])\nnm2 = sum(out2) / len(out2)\nnv2 = sum((v - nm2) ** 2 for v in out2) / len(out2)\nprint('scaled: mu=%.2f var=%.2f (gamma^2 = %.1f)' % (nm2, nv2, 2.0 ** 2))\n\n# ---- 3) moving averages for prediction time ----\nmm, mv, momentum = 0.0, 1.0, 0.1\nmm = (1 - momentum) * mm + momentum * mu\nmv = (1 - momentum) * mv + momentum * var\nprint('moving: mean=%.2f var=%.2f' % (mm, mv))",
      explanation: {
        ar: 'مجاميع الفروع تعيد أرقام الكتاب حرفيًا: 64+128+32+32 = 256 بنسبة 2:4:1:1 من مدخل 192 قناة (التقليلان 96 و16)، ثم 480، ثم 832 و1024 — الدمج جمع على بُعد القنوات لا إضافة عنصرية. تطبيع العمود [2, 4, 6, 8]: μ = 5 وσ² = 5 فيصير x_hat = ±1.341641 و±0.447214 بمتوسط 0 وتباين 1 بالضبط؛ ومع γ = 2 وβ = 1 ينتقل المتوسط إلى 1 والتباين إلى γ² = 4 — أي أن γ وβ يديران الإحصاءات بعد التطبيع لا قبله. والمتوسط المتحرك بعد أول دفعة: 0.9×0 + 0.1×5 = 0.5 و0.9×1 + 0.1×5 = 1.4 — إحصاءات مستقرة تُثبّت وقت التنبؤ.',
        en: 'The branch sums reproduce the book literally: 64+128+32+32 = 256 at a 2:4:1:1 ratio from a 192-channel input (reducers 96 and 16), then 480, then 832 and 1024 \u2014 merging is concatenation on the channel axis, not elementwise addition. Normalizing the column [2, 4, 6, 8]: \u03bc = 5 and \u03c3\u00b2 = 5 give x_hat = \u00b11.341641 and \u00b10.447214 with mean 0 and variance exactly 1; with \u03b3 = 2 and \u03b2 = 1 the mean moves to 1 and the variance to \u03b3\u00b2 = 4 \u2014 \u03b3 and \u03b2 steer the statistics after normalization, not before. The moving averages after one batch: 0.9\u00d70 + 0.1\u00d75 = 0.5 and 0.9\u00d71 + 0.1\u00d75 = 1.4 \u2014 stable statistics frozen for prediction time.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.batchnorm-and-inception',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين: batch_norm_col(xs, gamma, beta, eps=0.0) تطبّع عمودًا واحدًا: μ وσ² على العمود (تباين المجتمع قسمة n)، ثم x_hat = (x − μ)/√(σ² + eps)، وتعيد القائمة بعد γ·x_hat + β؛ وinception_out(c1, c2, c3, c4) تعيد مجموع قنوات الفروع الأربعة.',
        en: 'Implement two functions: batch_norm_col(xs, gamma, beta, eps=0.0) normalizing one column: \u03bc and \u03c3\u00b2 over the column (population variance, divide by n), then x_hat = (x \u2212 \u03bc)/\u221a(\u03c3\u00b2 + eps), returning the list after \u03b3\u00b7x_hat + \u03b2; and inception_out(c1, c2, c3, c4) returning the summed channel count of the four branches.',
      },
      starterCode: "def batch_norm_col(xs, gamma, beta, eps=0.0):\n    ...  # TODO: mu, var (divide by n), normalize, then gamma * x_hat + beta\n\ndef inception_out(c1, c2, c3, c4):\n    ...  # TODO: concatenate on the channel axis = add the counts\n",
      solution: "def batch_norm_col(xs, gamma, beta, eps=0.0):\n    n = len(xs)\n    mu = sum(xs) / n\n    var = sum((v - mu) ** 2 for v in xs) / n\n    hat = [(v - mu) / (var + eps) ** 0.5 for v in xs]\n    return [gamma * v + beta for v in hat], mu, var\n\ndef inception_out(c1, c2, c3, c4):\n    return c1 + c2 + c3 + c4",
      tests: [
        {
          id: 't1',
          name: { ar: 'بعد التطبيع: متوسط 0 وتباين 1', en: 'After normalization: mean 0, variance 1' },
          code: "out, mu, var = batch_norm_col([2.0, 4.0, 6.0, 8.0], 1.0, 0.0, 0.0)\nnm = sum(out) / len(out)\nnv = sum((v - nm) ** 2 for v in out) / len(out)\nassert abs(nm) < 1e-9, 'expected mean 0 | actual: %r' % nm\nassert abs(nv - 1.0) < 1e-9, 'expected variance 1 | actual: %r' % nv",
          expected: 'mean=0, var=1',
        },
        {
          id: 't2',
          name: { ar: 'γ = 2 وβ = 1 يعيدان تشكيل الإحصاءات', en: 'gamma = 2, beta = 1 reshape the statistics' },
          code: "out2, _, _ = batch_norm_col([2.0, 4.0, 6.0, 8.0], 2.0, 1.0, 0.0)\nassert abs(out2[0] + 1.6832815729997477) < 1e-9, 'expected -1.683281573 | actual: %r' % out2[0]\nassert abs(out2[3] - 3.6832815729997477) < 1e-9, 'expected 3.683281573 | actual: %r' % out2[3]",
          expected: '[-1.6833, ..., 3.6833]',
        },
        {
          id: 't3',
          name: { ar: 'كتلة inception الرابعة في b4: 512 قناة', en: 'The fourth-block inception in b4: 512 channels' },
          code: "assert inception_out(192, 208, 48, 64) == 512, 'expected 512 | actual: %r' % inception_out(192, 208, 48, 64)",
          expected: '512',
        },
      ],
      hints: [
        { ar: 'σ² = Σ(x − μ)²/n — قسمة على n (تباين المجتمع) لا n − 1 هنا.', en: '\u03c3\u00b2 = \u03a3(x \u2212 \u03bc)\u00b2/n \u2014 divide by n (population variance), not n \u2212 1, here.' },
        { ar: 'أعد قائمة محولة: [(v - mu) / (var + eps) ** 0.5 ...] ثم طبّق gamma وbeta عنصرًا عنصرًا.', en: 'Build the normalized list: [(v - mu) / (var + eps) ** 0.5 ...], then apply gamma and beta elementwise.' },
        { ar: 'الدمج على بُعد القنوات هو جمع أعداد القنوات الأربعة فقط.', en: 'Concatenating on the channel axis is simply adding the four channel counts.' },
        { ar: 'قيم تحقق: x_hat لأول عنصر −3/√5 = −1.3416407865؛ و192+208+48+64 = 512.', en: 'Sanity: the first x_hat is \u22123/\u221a5 = \u22121.3416407865; and 192+208+48+64 = 512.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.normalized-value',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'على العمود الثابت [2.0, 4.0, 6.0, 8.0] مع γ = 1 وβ = 0 وeps = 0: ما القيمة المطبعة للعنصر x = 6؟',
        en: 'On the fixed column [2.0, 4.0, 6.0, 8.0] with \u03b3 = 1, \u03b2 = 0 and eps = 0: what is the normalized value of the element x = 6?',
      },
      answer: '0.4472135954999579',
      tolerance: 1e-6,
      solution: '0.4472135954999579',
      hints: [
        { ar: 'μ = 5 وσ² = 5 لهذا العمود.', en: '\u03bc = 5 and \u03c3\u00b2 = 5 for this column.' },
        { ar: 'x_hat = (6 − 5)/√5.', en: 'x_hat = (6 \u2212 5)/\u221a5.' },
        { ar: '√5 = 2.23606797749979.', en: '\u221a5 = 2.23606797749979.' },
        { ar: 'الجواب: 0.4472135954999579.', en: 'Answer: 0.4472135954999579.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def batch_norm_col(xs, gamma, beta, eps=0.0):\n    n = len(xs)\n    mu = sum(xs) / n\n    var = sum((v - mu) ** 2 for v in xs) / n\n    hat = [(v - mu) / (var + eps) ** 0.5 for v in xs]\n    return [gamma * v + beta for v in hat], mu, var\n\n# per-channel normalization: two channels with very different scales\nch_a = [10.0, 12.0, 14.0, 16.0]\nch_b = [0.1, -0.3, 0.5, -0.1]\nfor tag, ch in (('A', ch_a), ('B', ch_b)):\n    out, mu, var = batch_norm_col(ch, 1.0, 0.0)\n    print('channel %s: mu=%.4f var=%.4f -> %s' % (tag, mu, var, ['%.4f' % v for v in out]))\n\n# moving averages over several batches\nmu_a = sum(ch_a) / len(ch_a)\nvar_a = sum((v - mu_a) ** 2 for v in ch_a) / len(ch_a)\nmm, mv, momentum = 0.0, 1.0, 0.1\nfor step in range(1, 6):\n    mm = (1 - momentum) * mm + momentum * mu_a\n    mv = (1 - momentum) * mv + momentum * var_a\n    if step in (1, 3, 5):\n        print('after batch %d: moving mean=%.4f moving var=%.4f' % (step, mm, mv))\n\n# eps guards the division: a nearly flat column, two eps values\nflat = [5.0, 5.0, 5.0, 5.001]\nfor eps in (1e-8, 1e-3):\n    oute, _, _ = batch_norm_col(flat, 1.0, 0.0, eps)\n    print('eps=%g -> %s' % (eps, ['%.4f' % v for v in oute]))\n\n# جرّب: ماذا يفعل gamma = 0 كليًا بالطبقة — ولماذا لا يكفي وحده لتصفيرها منطقيًا؟\n# try: what does gamma = 0 do to the whole layer - and why is that not a sensible zeroing?\n# جرّب: طبق التطبيع على عمودين ثم احسب متوسط كل منهما بعد beta مختلف لكل قناة.\n# try: normalize two columns, then give each a different beta and compare the resulting means.\n",
      prompt: {
        ar: 'الملعب يطبّع قناتين بمقياسين مختلفين تمامًا فتراهما تصيران على نفس المسطرة، ثم يتتبع المتوسطات المتحركة عبر خمس دفعات، ويجرب عمودًا مسطحًا لترى دور ε في إنقاذ القسمة.',
        en: 'The sandbox normalizes two channels on wildly different scales so you see them land on the same ruler, tracks moving averages across five batches, and feeds a flat column to show how \u03b5 rescues the division.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في طبقة تلافيفية، على أي مجموعة قيم يُحسب المتوسط والتباين لتطبيع الدفعات؟',
            en: 'For a convolutional layer, over which set of values are the mean and variance computed in batch normalization?',
          },
          options: [
            { id: 'a', text: { ar: 'لكل موقع مكاني على حدة عبر الدفعة', en: 'Per spatial location, across the batch' } },
            { id: 'b', text: { ar: 'لكل قناة على حدة، جمعًا على m·p·q (الدفعة × الارتفاع × العرض)', en: 'Per channel, pooled over m\u00b7p\u00b7q (batch \u00d7 height \u00d7 width)' } },
            { id: 'c', text: { ar: 'على كل مثال منفردًا كما في التطبيع الطبقي', en: 'Per single example, as in layer normalization' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التنفيذ التلافي يفترض ثبات الموقع، فيُجمع كل المواقع عبر كل أمثلة الدفعة لكل قناة، وتحصل كل قناة على μ وσ² وγ وβ خاصين بها — ولهذا يظل التطبيع معرفًا حتى بحجم دفعة 1.',
            en: 'The convolutional flavor assumes translation invariance: all locations across every batch example are pooled per channel, each channel owning its own \u03bc, \u03c3\u00b2, \u03b3, \u03b2 \u2014 which is also why the statistics stay well defined even for a batch of size 1.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في تطبيع الدفعات، ما الفرق بين (μ, σ²) وبين (γ, β)؟',
            en: 'In batch normalization, what distinguishes (\u03bc, \u03c3\u00b2) from (\u03b3, \u03b2)?',
          },
          options: [
            { id: 'a', text: { ar: 'كلاهما يُتعلم بالتدرج', en: 'Both are learned by gradient descent' } },
            { id: 'b', text: { ar: 'μ وσ² تُقدَّر من الدفعة (بمتوسطات متحركة للتنبؤ)، بينما γ وβ معاملان قابلان للتدريب يعيدان قياس وإزاحة الناتج المطبع', en: '\u03bc and \u03c3\u00b2 are estimated from the batch (moving averages at prediction), while \u03b3 and \u03b2 are trainable parameters rescaling and shifting the normalized output' } },
            { id: 'c', text: { ar: 'γ وβ تُقدَّر من الدفعة وμ وσ² ثابتة', en: '\u03b3 and \u03b2 are estimated from the batch while \u03bc and \u03c3\u00b2 stay fixed' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التطبيع يقذف بالإحصاءات إلى متوسط 0 وتباين 1، ثم يعيد γ وβ لنموذج الحرية: إن كان التطبيع الأعمى أصلًا أفضل فسيتعلم النموذج γ = σ وβ = μ تقريبًا — قرارًا في يد التعلم لا فرضًا عليه.',
            en: 'Normalization throws the statistics to mean 0 and variance 1, then \u03b3 and \u03b2 restore freedom: if blind normalization were optimal, the model would simply learn \u03b3 \u2248 \u03c3 and \u03b2 \u2248 \u03bc \u2014 a decision left to learning rather than forced.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'كتلة Inception لها فروع بقنوات 64 و128 و32 و32: كيف تُبنى قنوات المخرج؟',
            en: 'An Inception block has branches with 64, 128, 32 and 32 channels: how are the output channels built?',
          },
          options: [
            { id: 'a', text: { ar: 'تُجمع عنصرًا عنصرًا على بُعد القنوات فتبقى 128', en: 'They are added elementwise along the channel axis, staying 128' } },
            { id: 'b', text: { ar: 'تُدمج (concatenate) على بُعد القنوات: 64+128+32+32 = 256', en: 'They are concatenated along the channel axis: 64+128+32+32 = 256' } },
            { id: 'c', text: { ar: 'يُؤخذ الأعظم فرعًا فرعًا فتبقى 128', en: 'A max is taken branch-wise, leaving 128' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كل الفروع لها نفس الارتفاع والعرض بفضل الحشو، فيتسع التفاف الحواف المختلفة (1×1 و3×3 و5×5 والتجميع) على شريحة قنوات مختلفة — الدمج جمع أعداد لا جمع قيم: 64+128+32+32 = 256 بنسبة 2:4:1:1.',
            en: 'Padding keeps every branch at identical height and width, so detectors of different extents (1\u00d71, 3\u00d73, 5\u00d75 and pooling) each occupy their own channel slice \u2014 merging adds counts, not values: 64+128+32+32 = 256 at a 2:4:1:1 ratio.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'Inception تجيب «كل النوى معًا»: أربعة فروع (1×1، 1×1→3×3، 1×1→5×5، تجميع→1×1) بدمج قنوات، والمعامل الوحيد هو توزيع القنوات (192→256 بنسبة 2:4:1:1)، وGoogLeNet 9 كتل في ثلاث مجموعات برأس تجميع شامل (الهدف من s4 الشبكات متعددة الفروع GoogLeNet).', en: 'Inception answers \u201call kernels at once\u201d: four branches (1\u00d71, 1\u00d71\u21923\u00d73, 1\u00d71\u21925\u00d75, pool\u21921\u00d71) merged along channels, with channel allocation as the only knob (192\u2192256 at 2:4:1:1); GoogLeNet stacks 9 blocks in three groups under a GAP head (goal of s4 Multi-Branch Networks (GoogLeNet)).' },
        { ar: 'تطبيع الدفعات يثبّت إحصاءات كل خاصية/قناة (x − μ)/√(σ² + ε) ثم يعيد γ وβ قابلتي التدريب، وفي التلافيف تُجمع m·p·q لكل قناة، ووقت التنبؤ يستخدم متوسطات متحركة مثبتة — تدرجات أهدأ ومعدلات تعلم أكبر (الهدف من s5 تطبيع الدفعات).', en: 'Batch norm pins per-feature/per-channel statistics (x \u2212 \u03bc)/\u221a(\u03c3\u00b2 + \u03b5), then trainable \u03b3 and \u03b2 reshape; convolutions pool m\u00b7p\u00b7q per channel, and prediction uses frozen moving averages \u2014 calmer gradients and larger learning rates (goal of s5 Batch Normalization).' },
      ],
      reflectPrompt: {
        ar: 'تطبيع الدفعات يجعل كل طبقة تدرب على مدخلات ذات إحصاءات ثابتة، لكنه يربط الأمثلة بعضها ببعض داخل الدفعة. ماذا يفقد النموذج إحصائيًا بهذا الربط، ومتى تختار تطبيعًا طبقيًا بدلًا منه؟',
        en: 'Batch normalization gives every layer fixed-statistics inputs, but couples examples within a batch. What does that coupling cost statistically, and when would you switch to layer normalization?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch8.s4' },
        { book: 'D2L', section: 'd2l.ch8.s5' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch8.s4' },
    { book: 'D2L', section: 'd2l.ch8.s5' },
  ],
} satisfies Lesson;

export default lesson;
