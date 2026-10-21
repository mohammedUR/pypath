import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch4.l2 — "A Base Classifier and Softmax from Scratch"
 * الصنف الأساس للتصنيف وsoftmax من الصفر
 * Aligned with D2L ch4 s3 (The Base Classification Model) + s4 (Softmax
 * Regression Implementation from Scratch). All expression is original — a
 * paraphrase of the source's ideas, never a verbatim translation. Runnable
 * design: a hand-computed forward pass of softmax regression on two flattened
 * 2x2 images (fixed weights), with accuracy, indexed cross-entropy and the
 * parameter count. Every printed literal verified under CPython 3.
 */
const lesson = {
  id: 'd2l.ch4.l2',
  version: 1,
  part: 'II',
  track: 'A3',
  book: 'D2L',
  chapter: 4,
  title: {
    ar: 'الصنف الأساس للتصنيف وsoftmax من الصفر',
    en: 'A Base Classifier and Softmax from Scratch',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch4.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'المصنِّف يقيس نجاحه بمقياس مختلف عن خسارته: يدرب بـ cross-entropy لكنه يعلن الدقة. في هذا الدرس نضيف طبقة التجريد الثانية من الكتاب: صنف Classifier أساس يبلّغ الخسارة والدقة على دفعات التحقق، ثم نبني انحدار softmax كاملًا من الصفر — تسطيح الصورة إلى متجه، ضرب مصفوفة، softmax، فهرسة الخسارة — ونشغّله يدويًا على صورتين مصغرتين بأوزان ثابتة.',
        en: 'A classifier is judged by a different yardstick than its loss: it trains with cross-entropy but reports accuracy. This lesson adds the book second abstraction layer: a base Classifier class that logs both loss and accuracy on validation batches, then builds softmax regression fully from scratch — flatten the image to a vector, multiply the matrix, apply softmax, index the loss — and runs it by hand on two miniature images with fixed weights.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الصنف Classifier والدقة ثم النموذج من الصفر', en: 'The Classifier class and accuracy, then the scratch model' },
      chunks: [
        {
          ar: 'التصنيف يحتاج روتينًا مشتركًا: صنف Classifier يرث Module ويضيف validation_step يبلّغ الخسارة والدقة معًا، وaccuracy تحسب نسبة التوقعات الصحيحة: argmax على محور الفئات لكل صف ثم مقارنة مع التسميات ومتوسط. الدقة نفسها غير قابلة للتفريق — argmax قفزة لا منحدر — لذلك ندرب بـ cross-entropy ونبلّغ الدقة للمقارنة بين النماذج والمسابقات. الكتاب يجعل المحسّن الافتراضي `torch.optim.SGD` على self.parameters().',
          en: 'Classification deserves shared machinery: a Classifier class extends Module with a validation_step that reports loss and accuracy together, and an accuracy method computing the fraction of correct predictions: argmax over the class axis for every row, compare with the labels, average. Accuracy itself is not differentiable — argmax is a jump, not a slope — so we optimize cross-entropy and report accuracy for benchmarks and leaderboards. The book defaults the optimizer to `torch.optim.SGD` over self.parameters().',
        },
        {
          ar: 'النموذج من الصفر: كل صورة 28×28 تُسطَّح إلى متجه طولها 784، فالأوزان W مصفوفة 784×10 والانحياز b متجه 10 (7850 معاملًا). forward يعيد softmax(XW + b)، والخسارة cross-entropy تُنفذ بالفهرسة: y كفهارس ينتقي من y_hat الاحتمال الصحيح لكل مثال بدل حلقات بايثون بطيئة. التدريب نفس حلقة الانحدار الخطي مع lr=0.1 و10 عصور، وعند التنبؤ نعرض الصور التي أخطأ فيها النموذج: wrong = preds != y. في الكتاب تُستخدم `nn.Sequential` مع `nn.Flatten` و`nn.LazyLinear` في النسخة المختصرة، و`F.cross_entropy` تدمج softmax والخسارة بعدميًا.',
          en: 'The scratch model: every 28×28 image is flattened into a length-784 vector, so the weights W form a 784×10 matrix and the bias b a length-10 vector (7850 parameters in total). forward returns softmax(XW + b), and cross-entropy is implemented by indexing: the label vector y selects, from y_hat, the predicted probability of each true class — avoiding slow Python loops. Training reuses the linear-regression loop with lr=0.1 and 10 epochs, and prediction highlights the mistakes: wrong = preds != y. The book concise version uses `nn.Sequential` with `nn.Flatten` and `nn.LazyLinear`, while `F.cross_entropy` fuses softmax and loss for numerical safety.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'تمرير أمامي يدوي على صورتين مصغرتين',
        en: 'A hand-computed forward pass on two miniature images',
      },
      code: "import math\n\ndef stable_softmax(row):\n    m = max(row)\n    exps = [math.exp(v - m) for v in row]\n    return [e / sum(exps) for e in exps]\n\nW = [[0.3, -0.1, 0.0],\n     [0.0, 0.4, -0.2],\n     [0.2, 0.0, 0.5],\n     [-0.1, 0.3, 0.1]]          # 4 features x 3 classes\nb = [0.0, 0.1, -0.1]\n\ndef logits(x):\n    return [sum(x[i] * W[i][j] for i in range(4)) + b[j] for j in range(3)]\n\ndef argmax(row):\n    best = 0\n    for j in range(1, len(row)):\n        if row[j] > row[best]:\n            best = j\n    return best\n\nimages = [[1.0, 2.0, 0.5, 1.5], [0.5, 1.0, 2.0, 0.5]]   # two flattened 2x2 images\nlabels = [0, 2]\npreds = []\nfor x in images:\n    o = logits(x)\n    p = stable_softmax(o)\n    preds.append(argmax(p))\n    print('logits:', ['%.4f' % v for v in o], '-> probs:', ['%.4f' % v for v in p])\nacc = sum(1 for i in range(2) if preds[i] == labels[i]) / 2\nprint('preds:', preds, 'labels:', labels, '| accuracy = %.1f' % acc)\npicked = [stable_softmax(logits(images[i]))[labels[i]] for i in range(2)]\nce = -sum(math.log(picked[i]) for i in range(2)) / 2\nprint('picked probs:', ['%.4f' % p for p in picked], '| cross-entropy = %.4f' % ce)\nprint('params: %d weights + %d biases = %d' % (4 * 3, 3, 4 * 3 + 3))",
      explanation: {
        ar: 'الصورة الأولى أعطت logits [0.2500, 1.2500, −0.1000] فتوزيع [0.2261, 0.6146, 0.1593] وتوقع الفئة 1 — لكن تسميتها 0، خطأ! الصورة الثانية أعطت [0.5000, 0.6000, 0.7500] وتوقع 2 صحيحًا. الدقة إذن 0.5 — والاحتمالات المنتقاة بالتسميات [0.2261, 0.3789] تعطي خسارة 1.2287، أعلى مما لو أصبنا. لاحظ أن argmax للـ probs يساوي argmax للـ logits كما وعدنا. وأخيرًا العدّ: 12 وزنًا و3 انحيازات = 15 معاملًا — نفس بنية 784×10+10 لكن بمقياس مصغر.',
        en: 'The first image produced logits [0.2500, 1.2500, −0.1000], distribution [0.2261, 0.6146, 0.1593] and predicted class 1 — but its label is 0, a mistake! The second image gave [0.5000, 0.6000, 0.7500] and correctly predicted 2. Accuracy is therefore 0.5, and the label-indexed probabilities [0.2261, 0.3789] give a loss of 1.2287 — higher than a correct guess would cost. Notice argmax of the probabilities equals argmax of the logits, as promised. The count: 12 weights plus 3 biases = 15 parameters — the same 784×10+10 shape in miniature.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.accuracy-and-pick',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين: accuracy(y_hat, y) تعيد نسبة الصفوف التي argmax(y_hat[i]) يساوي y[i]؛ وpick_probs(y_hat, y) تعيد قائمة الاحتمالات المنتقاة y_hat[i][y[i]].',
        en: 'Implement two functions: accuracy(y_hat, y) returns the fraction of rows where argmax(y_hat[i]) equals y[i]; and pick_probs(y_hat, y) returns the list of selected probabilities y_hat[i][y[i]].',
      },
      starterCode: "def argmax(row):\n    ...  # TODO: index of the largest entry\n\ndef accuracy(y_hat, y):\n    ...  # TODO: fraction of argmax == label\n\ndef pick_probs(y_hat, y):\n    ...  # TODO: y_hat[i][y[i]] per row\n",
      solution: "def argmax(row):\n    best = 0\n    for j in range(1, len(row)):\n        if row[j] > row[best]:\n            best = j\n    return best\n\ndef accuracy(y_hat, y):\n    return sum(1 for i in range(len(y)) if argmax(y_hat[i]) == y[i]) / len(y)\n\ndef pick_probs(y_hat, y):\n    return [y_hat[i][y[i]] for i in range(len(y))]",
      tests: [
        {
          id: 't1',
          name: { ar: 'دقة كاملة', en: 'Perfect accuracy' },
          code: "a = accuracy([[0.9, 0.05, 0.05], [0.1, 0.8, 0.1]], [0, 1])\nassert abs(a - 1.0) < 1e-12, 'expected 1.0 | actual: %r' % a",
          expected: '1.0',
        },
        {
          id: 't2',
          name: { ar: 'دقة نصفية', en: 'Half accuracy' },
          code: "a = accuracy([[0.9, 0.05, 0.05], [0.1, 0.8, 0.1]], [0, 2])\nassert abs(a - 0.5) < 1e-12, 'expected 0.5 | actual: %r' % a",
          expected: '0.5',
        },
        {
          id: 't3',
          name: { ar: 'الاحتمالات المنتقاة بالفهرسة', en: 'Indexed probability selection' },
          code: "p = pick_probs([[0.1, 0.3, 0.6], [0.3, 0.2, 0.5]], [0, 2])\nassert p == [0.1, 0.5], 'expected [0.1, 0.5] | actual: %r' % (p,)",
          expected: '[0.1, 0.5]',
        },
      ],
      hints: [
        { ar: 'argmax يمر على الصف ويحفظ موضع الأكبر — احترس من التعادل: أول موضع يكفي.', en: 'argmax scans the row keeping the largest position — ties: the first position is fine.' },
        { ar: 'accuracy = عدد الإصابات / عدد الأمثلة — نفس ما يفعله compare.mean() في الكتاب.', en: 'accuracy = hits / examples — exactly compare.mean() in the book.' },
        { ar: 'pick_probs هي الحيلة التي تجعل cross_entropy سريعة: فهرسة مزدوجة بلا حلقات صريحة داخل الصف.', en: 'pick_probs is the trick that makes cross_entropy fast: double indexing, no per-row loop.' },
        { ar: 'قيم تحقق: الصفوف [[0.9,...],[0.1,0.8,...]] مع y=[0,1] تعطي 1.0 ومع y=[0,2] تعطي 0.5.', en: 'Sanity: rows [[0.9,...],[0.1,0.8,...]] with y=[0,1] give 1.0 and with y=[0,2] give 0.5.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-params',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'نموذج softmax regression على Fashion-MNIST (صور 28×28 مسطحة، 10 فئات): كم عدد معاملاته الكلي؟',
        en: 'A softmax regression model on Fashion-MNIST (flattened 28×28 images, 10 classes): how many parameters does it have in total?',
      },
      options: [
        { id: 'a', text: { ar: '784 — وزن لكل بكسل', en: '784 — one weight per pixel' } },
        { id: 'b', text: { ar: '7850 — مصفوفة 784×10 زائد انحياز من 10', en: '7850 — a 784×10 matrix plus a 10-vector bias' } },
        { id: 'c', text: { ar: '7840 — الأوزان فقط دون الانحياز', en: '7840 — weights only, bias forgotten' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'كل بكسل متصل بكل فئة: 28×28 = 784 مدخلًا × 10 مخرجات.', en: 'Every pixel connects to every class: 28×28 = 784 inputs × 10 outputs.' },
        { ar: 'لكل فئة انحياز واحد إضافي.', en: 'Each class adds one bias.' },
        { ar: '784 × 10 = 7840 ثم أضف 10.', en: '784 × 10 = 7840, then add 10.' },
        { ar: 'الجواب: b — 7850، وهو نفس العد الذي تحققنا عليه على مصغّر 4×3+3 = 15.', en: 'Answer: b — 7850, the same count we verified at miniature scale as 4×3+3 = 15.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef stable_softmax(row):\n    m = max(row)\n    exps = [math.exp(v - m) for v in row]\n    return [e / sum(exps) for e in exps]\n\ndef argmax(row):\n    best = 0\n    for j in range(1, len(row)):\n        if row[j] > row[best]:\n            best = j\n    return best\n\n# sweep the bias of one class and watch accuracy move\nW = [[0.3, -0.1, 0.0],\n     [0.0, 0.4, -0.2],\n     [0.2, 0.0, 0.5],\n     [-0.1, 0.3, 0.1]]\nimages = [[1.0, 2.0, 0.5, 1.5], [0.5, 1.0, 2.0, 0.5]]\nlabels = [0, 2]\n\nfor boost in (-0.3, 0.0, 0.3, 0.6):\n    b = [0.0, 0.1, -0.1 + boost]\n    preds = []\n    for x in images:\n        o = [sum(x[i] * W[i][j] for i in range(4)) + b[j] for j in range(3)]\n        preds.append(argmax(stable_softmax(o)))\n    acc = sum(1 for i in range(2) if preds[i] == labels[i]) / 2\n    print('bias2 boost %+0.1f -> preds %s acc %.1f' % (boost, preds, acc))\n\n# جرّب: هل يستطيع تعديل انحيازات فقط أن يرفع الدقة إلى 1.0 هنا؟ ولماذا لا يصلح هذا كسياسة تدريب عامة؟\n# try: can bias tweaks alone lift accuracy to 1.0 here? And why is that not a general training strategy?\n",
      prompt: {
        ar: 'الملعب يزيح انحياز الفئة الثالثة ويراقب كيف تتغير التوقعات والدقة — تذكير بأن الانحيازات معاملات قابلة للتدريب تؤثر في عتبات القرار.',
        en: 'The sandbox nudges the third-class bias and watches predictions and accuracy move — a reminder that biases are trainable parameters steering decision thresholds.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا ندرب المصنّف بخسارة cross-entropy بدل تحسين الدقة مباشرة؟',
            en: 'Why do we train classifiers with cross-entropy rather than optimizing accuracy directly?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الدقة غير قابلة للتفريق — argmax قفزة بلا منحدر فلا تدرجات للتحديث', en: 'Because accuracy is not differentiable — argmax is a jump with no slope, so no gradients to update with' } },
            { id: 'b', text: { ar: 'لأن الدقة لا يمكن حسابها إلا بعد التدريب', en: 'Because accuracy cannot be computed before training' } },
            { id: 'c', text: { ar: 'لأن cross-entropy أخفض تكلفة حسابية', en: 'Because cross-entropy is cheaper to compute' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الدقة مقياس للإبلاغ لا للتحسين: argmax يقطع الترتيب فتدرجه صفرًا في كل موضع تقريبًا. لذلك ندرب بخسارة ناعمة قابلة للتفريق ونقرأ الدقة على بيانات التحقق.',
            en: 'Accuracy is a reporting metric, not an objective: argmax breaks ranking so its gradient is zero almost everywhere. We optimize a smooth differentiable loss and read accuracy on validation data.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'صورة 28×28 رمادية تدخل النموذج بعد تسطيحها: كم خاصية يصبح لديها؟',
            en: 'A 28×28 grayscale image enters the model after flattening: how many features does it have?',
          },
          options: [
            { id: 'a', text: { ar: '56 — مجموع البعدين', en: '56 — the two dimensions summed' } },
            { id: 'b', text: { ar: '784 — حاصل ضربهما كمتجه واحد', en: '784 — their product, as a single vector' } },
            { id: 'c', text: { ar: '78400 — البكسلات مضروبة في القنوات', en: '78400 — pixels times channels' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التسطيح يفرش الشبكة ثنائية البعد في متجه طوله 28×28 = 784 بقناة واحدة. لهذا أوزان النموذج 784×10: عمود لكل فئة وصف لكل بكسل.',
            en: 'Flattening unrolls the 2-D grid into a vector of length 28×28 = 784 with one channel. Hence the 784×10 weight matrix: a column per class, a row per pixel.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي تابع في صنف Classifier يبلّغ الخسارة والدقة معًا على دفعات التحقق؟',
            en: 'Which method of the book Classifier reports both loss and accuracy on validation batches?',
          },
          options: [
            { id: 'a', text: { ar: 'training_step', en: 'training_step' } },
            { id: 'b', text: { ar: 'forward', en: 'forward' } },
            { id: 'c', text: { ar: 'validation_step', en: 'validation_step' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'validation_step تحسب Y_hat ثم ترسم loss وacc معًا؛ training_step مسؤولة عن الخسارة في التدريب فقط. هذا الفصل بين المقاييس هو ما يجعل منحنيات التحقق قابلة للمقارنة عبر النماذج.',
            en: 'validation_step computes Y_hat then plots loss and acc together; training_step only handles the training loss. Separating metrics this way keeps validation curves comparable across models.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'صنف Classifier الأساس يبلّغ الخسارة والدقة معًا على دفعات التحقق؛ accuracy نسبة argmax الصحيحة وتقاس ولا تُدرَّب (الهدف من s3 نموذج التصنيف الأساس).', en: 'The base Classifier class reports loss and accuracy together on validation batches; accuracy is the fraction of correct argmax calls — measured, never optimized (goal of s3 The Base Classification Model).' },
        { ar: 'softmax من الصفر: تسطيح الصورة إلى 784، أوزان 784×10 وb من 10 (7850 معاملًا)، خسارة بالفهرسة y_hat[range(n), y]، وحلقة تدريب مكوَّرة من الانحدار الخطي (الهدف من s4 تنفيذ softmax من الصفر).', en: 'Softmax from scratch: flatten to 784, a 784×10 weight matrix plus a 10 bias (7850 parameters), indexed loss y_hat[range(n), y], and a training loop recycled from linear regression (goal of s4 Softmax Regression from Scratch).' },
      ],
      reflectPrompt: {
        ar: 'صورتنا الأولى خُدعت لأن وزن الفئة 1 تزامن مع قيم بكسلاتها. ما الذي يفتقده النموذج الخطي جذريًا حتى يميز «قطة» من «كلب» رغم تساوي سطوع البكسلات؟',
        en: 'Our first image was fooled because class 1 weights happened to align with its pixel values. What does a purely linear model fundamentally lack to tell a cat from a dog even when pixel brightness ties?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch4.s3' },
        { book: 'D2L', section: 'd2l.ch4.s4' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch4.s3' },
    { book: 'D2L', section: 'd2l.ch4.s4' },
  ],
} satisfies Lesson;

export default lesson;
