/**
 * Lesson mls.ch3.l2 — خوارزمية البيرسبترون
 *   / The Perceptron Algorithm
 * Book: MLS — Chapter 3 'Discriminative Classification', §3.2 The Perceptron Algorithm (pp.33-37)
 * Runnable design: fixed linearly separable dataset as pure lists -> mistake-driven
 *   update loop with a fixed epoch count; trace of a two-point epoch.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch3.l2',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 3,
  title: {
    ar: 'خوارزمية البيرسبترون',
    en: 'The Perceptron Algorithm',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch3.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الانحدار اللوجستي يعامل كل نقطة باحتمال وينزلق نحو حدود قرار مثلى. البيرسبترون أقسح من ذلك بكثير: لا احتمالات، ولا خسارة ناعمة — فقط قائمة أخطاء. مر على النقاط واحدة واحدة؛ أصبت فلا شيء، أخطأت فأصلح الخط مستقيمًا قليلًا في اتجاه هذه النقطة. هذه الخوارزمية من 1958 كانت أول محاولات تعلم الآلة الحقيقية، وهي الجد المباشر للشبكات العصبية التي ستبنيها في الفصل السابع. سنتتبع تحديثاتها رقمًا رقمًا على بيانات ثابتة.',
        en: 'Logistic regression treats every point as a probability and glides toward an optimal boundary. The perceptron is far blunter: no probabilities, no smooth loss — just a list of mistakes. Walk the points one by one; get one right and nothing happens, get one wrong and nudge the line toward that point. Proposed in 1958, it was one of the first real machine learning algorithms and the direct ancestor of the neural networks you will build in chapter 7. You will trace its updates number by number on fixed data.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'التعلم من الخطأ وحده',
        en: 'Learning from mistakes alone',
      },
      chunks: [
        {
          ar: 'البيرسبترون نموذج خطي للتصنيف الثنائي مثل اللوجستي: نتيجة z = w0 + w1*x، لكن القرار قطعي: yhat = 1 إذا z >= 0 وإلا 0. لاحظ قاعدة التعادل: النتيجة صفر تنتمي للصنف 1. لا يوجد سيجمويد ولا احتمال — الإخراج إما صفر أو واحد. لهذا يسمى أحيانًا مصنف العتبة الثنائية: المستقيم w0 + w1*x = 0 هو حد القرار في بعد واحد، نقطة واحدة.',
          en: 'The perceptron is a linear binary classifier like logistic regression: a score z = w0 + w1*x, but the decision is hard: yhat = 1 if z >= 0 else 0. Note the tie rule: a score of exactly zero belongs to class 1. There is no sigmoid and no probability — the output is either 0 or 1. That is why it is also called a binary threshold classifier: in one dimension the line w0 + w1*x = 0 is the decision boundary, a single point.',
        },
        {
          ar: 'قاعدة التحديث تعمل عند الخطأ فقط: إذا كان التنبؤ yhat مختلفًا عن التسمية t، حدث w0 += (t - yhat) وw1 += (t - yhat)*x. النقطة السالبة صنّفناها 1؟ الخطأ (0 - 1) = -1 يسحب المستقيم نزولًا وبعيدًا عنها. النقطة الموجبة صنّفناها 0؟ الخطأ (1 - 0) = +1 يدفع المستقيم صعودًا نحوها. النقاط الصحيحة لا تفعل شيئًا. حجم الخطوة ثابت في أبسط صيغة (lr = 1)، والتحديث محلي: نقطة واحدة في كل مرة.',
          en: 'The update rule fires only on a mistake: if the prediction yhat differs from the true label t, apply w0 += (t - yhat) and w1 += (t - yhat)*x. A negative point we called 1? The error (0 - 1) = -1 pulls the line down and away from it. A positive point we called 0? The error (1 - 0) = +1 pushes the line up toward it. Correct points do nothing. In the simplest form the step size is fixed (lr = 1) and each update is local: one point at a time.',
        },
        {
          ar: 'نظرية تقارب البيرسبترون تقول: إذا كانت البيانات قابلة للفصل خطيًا فستتوقف الأخطاء بعد عدد منتهٍ من التحديثات مهما بدأت الأوزان. وإذا لم تكن قابلة للفصل فلن تتوقف أبدًا — ولهذا نستعمل في الممارسة عدد دورات محدد ونقبل آخر أوزان. الفارق الجوهري عن اللوجستي: البيرسبترون يصنع أي مستقيم فاصل يمر به، لا أفضلها؛ ولا يعطي درجة ثقة إطلاقًا. الكتاب نفسه يذكّر أنه نادر الاستعمال عمليًا لكنه حجر الأساس في الشبكات العصبية.',
          en: 'The perceptron convergence theorem says: if the data is linearly separable, the mistakes stop after finitely many updates no matter how the weights start. If it is not separable, they never stop — which is why practice uses a fixed epoch budget and keeps the last weights. The deep contrast with logistic regression: the perceptron returns any separating line, not the best one, and offers no confidence score at all. The book itself notes it is rarely used in practice but is a building block for neural networks.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'أربع دورات على ثلاث نقاط قابلة للفصل',
        en: 'Four epochs on three separable points',
      },
      code: `X = [1.0, 2.0, 3.0]
y = [0, 0, 1]
w0, w1, lr = 0.0, 0.0, 1.0
EPOCHS = 4

for epoch in range(1, EPOCHS + 1):
    mistakes = 0
    for x, t in zip(X, y):
        yhat = 1 if w0 + w1 * x >= 0 else 0
        if yhat != t:
            w0 += lr * (t - yhat)
            w1 += lr * (t - yhat) * x
            mistakes += 1
    print(f"epoch {epoch}: mistakes={mistakes} w=({w0:.1f}, {w1:.1f})")

print(f"final: w0={w0:.1f}, w1={w1:.1f}")
for x, t in zip(X, y):
    z = w0 + w1 * x
    print(f"check x={x:.1f}: z={z:.1f} pred={1 if z >= 0 else 0} true={t}")`,
      explanation: {
        ar: 'تتبع الدورة الأولى يدويًا: النقطة 1 (تسمية 0) تعطي z = 0 فيصنفها 1 — خطأ يسحب الأوزان إلى (-1, -1)؛ النقطة 2 صحيحة؛ النقطة 3 (تسمية 1) تعطي z سالبًا — خطأ يدفعها إلى (0, 2). عدد الأخطاء 2 ثم 3 ثم 3 ثم 1، وينتهي المطاف عند w = (-3, 1) الذي يصنف النقاط الثلاث صح: نقطة التصنيف بين 2 و3 تقريبًا. لاحظ أن الدورة الرابعة لا تزال تصحح شيئًا — التقارب هنا جاء متأخرًا.',
        en: 'Trace epoch one by hand: point 1 (label 0) gets z = 0 so it is called 1 — a mistake pulling the weights to (-1, -1); point 2 is right; point 3 (label 1) gets a negative z — a mistake pushing to (0, 2). Mistakes per epoch run 2, 3, 3, 1 and the weights settle at w = (-3, 1), which classifies all three points correctly: the cut sits between 2 and 3. Note epoch four still fixed something — convergence arrived late here.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.update-rule',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة update(w0, w1, x, t, lr=1.0) التي تطبق قاعدة البيرسبترون على نقطة واحدة: تتنبأ، فإن أصابت أعادت الأوزان كما هي، وإن أخطأت طبقت التحديث وأعادت الأوزان الجديدة.',
        en: 'Implement update(w0, w1, x, t, lr=1.0) applying the perceptron rule to a single point: predict, return the weights unchanged if correct, otherwise apply the update and return the new weights.',
      },
      starterCode: `def update(w0, w1, x, t, lr=1.0):
    # TODO: predict with the current line, and if the prediction is wrong,
    # move both weights toward classifying this point correctly.
    return w0, w1

print("u1 =", update(0.0, 0.0, 2.0, 0))
print("u2 =", update(0.0, 0.0, 3.0, 1))
print("u3 =", update(1.0, 1.0, 1.0, 1))`,
      solution: `def update(w0, w1, x, t, lr=1.0):
    yhat = 1 if w0 + w1 * x >= 0 else 0
    if yhat != t:
        w0 += lr * (t - yhat)
        w1 += lr * (t - yhat) * x
    return w0, w1

print("u1 =", update(0.0, 0.0, 2.0, 0))
print("u2 =", update(0.0, 0.0, 3.0, 1))
print("u3 =", update(1.0, 1.0, 1.0, 1))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'خطأ عند النقطة 2', en: 'mistake at point 2' },
          code: `got = update(0.0, 0.0, 2.0, 0)\nassert abs(got[0] - (-1.0)) < 1e-9 and abs(got[1] - (-2.0)) < 1e-9, 'expected (-1.0, -2.0) | actual: %r' % (got,)`,
        },
        {
          id: 't2',
          name: { ar: 'صواب يعني لا تحديث', en: 'correct means no update' },
          code: `got = update(0.0, 0.0, 3.0, 1)\nassert abs(got[0]) < 1e-9 and abs(got[1]) < 1e-9, 'expected (0.0, 0.0) | actual: %r' % (got,)`,
        },
        {
          id: 't3',
          name: { ar: 'تدريب كامل بأربع دورات', en: 'full 4-epoch training' },
          code: `w0, w1 = 0.0, 0.0\nfor _ in range(4):\n    for x, t in zip([1.0, 2.0, 3.0], [0, 0, 1]):\n        w0, w1 = update(w0, w1, x, t)\nassert abs(w0 - (-3.0)) < 1e-9 and abs(w1 - 1.0) < 1e-9, 'expected (-3.0, 1.0) after 4 epochs | actual: %r' % ((w0, w1),)`,
        },
      ],
      hints: [
        { ar: 'التنبؤ سطر واحد: yhat = 1 if w0 + w1 * x >= 0 else 0 — الصفر بالضبط يذهب للصنف 1.', en: 'Prediction in one line: yhat = 1 if w0 + w1 * x >= 0 else 0 — exactly zero goes to class 1.' },
        { ar: 'التحديث عند الخطأ فقط: w0 += lr * (t - yhat) ثم w1 += lr * (t - yhat) * x.', en: 'Update only on a mistake: w0 += lr * (t - yhat), then w1 += lr * (t - yhat) * x.' },
        { ar: 'لا تنس return (w0, w1) في الحالتين — أعِد الزوج دائمًا.', en: 'Do not forget return (w0, w1) in both branches — always return the pair.' },
        { ar: 'التحقق: u1 = (-1.0, -2.0) وu2 = (0.0, 0.0) وu3 = (1.0, 1.0).', en: 'Check: u1 = (-1.0, -2.0), u2 = (0.0, 0.0), u3 = (1.0, 1.0).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-epoch',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'دورة واحدة على نقطتين: تتبّع الكود سطرًا سطرًا واكتب المخرج الحرفي (ثلاثة أسطر).',
        en: 'One epoch over two points: trace the code line by line and write the exact output (three lines).',
      },
      code: `w0, w1 = 0.0, 0.0
points = [(2.0, 0), (3.0, 1)]
updates = 0
for x, t in points:
    yhat = 1 if w0 + w1 * x >= 0 else 0
    if yhat != t:
        w0 += t - yhat
        w1 += (t - yhat) * x
        updates += 1
print("w0 =", w0)
print("w1 =", w1)
print("updates =", updates)`,
      answer: 'w0 = 0.0\nw1 = 1.0\nupdates = 2',
      solution: 'w0 = 0.0\nw1 = 1.0\nupdates = 2',
      hints: [
        { ar: 'النقطة (2.0, 0): z = 0 فيصنفها 1 — خطأ؛ التحديث: w0 = -1 وw1 = -2.', en: 'Point (2.0, 0): z = 0 so it is called 1 — a mistake; update: w0 = -1, w1 = -2.' },
        { ar: 'النقطة (3.0, 1) الآن: z = -1 + (-2)*3 = -7 سالب فيصنفها 0 — خطأ ثانٍ؛ التحديث: w0 = -1 + 1 = 0 وw1 = -2 + 3 = 1.', en: 'Now point (3.0, 1): z = -1 + (-2)*3 = -7 is negative so it is called 0 — a second mistake; update: w0 = -1 + 1 = 0 and w1 = -2 + 3 = 1.' },
        { ar: 'كل خطأ زاد العداد: updates = 2.', en: 'Each mistake bumped the counter: updates = 2.' },
        { ar: 'الأسطر الثلاثة: w0 = 0.0 ثم w1 = 1.0 ثم updates = 2.', en: 'The three lines: w0 = 0.0, then w1 = 1.0, then updates = 2.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'متى تُطبَّق قاعدة تحديث البيرسبترون؟',
            en: 'When does the perceptron update rule fire?',
          },
          options: [
            { id: 'a', text: { ar: 'على كل نقطة في كل دورة', en: 'on every point in every epoch' } },
            { id: 'b', text: { ar: 'عند الخطأ في التصنيف فقط', en: 'only when the prediction is wrong' } },
            { id: 'c', text: { ar: 'عندما تكون النتيجة z سالبة', en: 'when the score z is negative' } },
            { id: 'd', text: { ar: 'عندما تصل الخسارة إلى صفر', en: 'when the loss reaches zero' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'النقاط المصنفة صحيحًا لا تغير شيئًا؛ التحديث تصحيحي بحت يتحرك بمقدار الخطأ (t - yhat) في اتجاه النقطة.',
            en: 'Correctly classified points change nothing; the update is purely corrective, moving by the error (t - yhat) toward the point.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'بيانات قابلة للفصل خطيًا: ماذا يضمن نظر تقارب البيرسبترون؟',
            en: 'For linearly separable data, what does the perceptron convergence theorem guarantee?',
          },
          options: [
            { id: 'a', text: { ar: 'أن يصل إلى المستقيم الفاصل الأمثل', en: 'that it reaches the optimal separating line' } },
            { id: 'b', text: { ar: 'أن يتوقف بعد عدد منتهٍ من التحديثات بأي مستقيم فاصل', en: 'that it stops after finitely many updates with some separating line' } },
            { id: 'c', text: { ar: 'أن يعطي احتمالات معايرة', en: 'that it outputs calibrated probabilities' } },
            { id: 'd', text: { ar: 'أن يتعلم في دورة واحدة دائمًا', en: 'that it always learns in a single epoch' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الضمان وجودي فقط: توقف منتهٍ عند مستقيم فاصل ما — لا أفضل ولا أحدها؛ والاحتمالات غير موجودة أصلًا في هذا النموذج.',
            en: 'The guarantee is existential only: it halts after finitely many mistakes on some separating line — not the best one, and probabilities are not part of this model at all.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ماذا يحدث لو شغّلنا البيرسبترون بلا سقف للدورات على بيانات غير قابلة للفصل خطيًا؟',
            en: 'What happens if the perceptron runs without an epoch cap on data that is not linearly separable?',
          },
          options: [
            { id: 'a', text: { ar: 'يتوقف عند أفضل حد يمتلكه', en: 'it stops at the best boundary it can find' } },
            { id: 'b', text: { ar: 'يستمر في التحديث إلى ما لا نهاية', en: 'it keeps updating forever' } },
            { id: 'c', text: { ar: 'يطفأ تلقائيًا عند خطأين متتاليين', en: 'it switches off after two consecutive errors' } },
            { id: 'd', text: { ar: 'يحوّل نفسه تلقائيًا إلى انحدار لوجستي', en: 'it automatically becomes logistic regression' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بدون فصل خطي لا توجد حالة تصنيف كل النقاط فيها صح، فالتحديثات لا تتوقف — لهذا نضع EPOCHS ثابتًا ونأخذ آخر أوزان.',
            en: 'Without linear separability no state classifies every point correctly, so updates never stop — hence a fixed EPOCHS budget and keeping the last weights.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'البيرسبترون: نتيجة خطية + قرار قطعي عند الصفر (التعادل للصنف 1) — لا سيجمويد ولا احتمالات.',
          en: 'Perceptron: linear score + a hard cut at zero (ties go to class 1) — no sigmoid, no probabilities.',
        },
        {
          ar: 'قاعدة التحديث تُطبق عند الخطأ فقط: w0 += (t - yhat) وw1 += (t - yhat)*x — خطأ نحو النقطة.',
          en: 'The update fires only on mistakes: w0 += (t - yhat) and w1 += (t - yhat)*x — an error-sized move toward the point.',
        },
        {
          ar: 'على بياناتنا الثابتة استقر التدريب عند w = (-3, 1) بعد دورات بأخطاء 2، 3، 3، 1 — ويتصرف النموذج صحيحًا على النقاط الثلاث.',
          en: 'On our fixed data training settled at w = (-3, 1) after epochs with 2, 3, 3, 1 mistakes — and the model handles all three points correctly.',
        },
        {
          ar: 'الضمان وجودي لا أمثل: أي مستقيم فاصل يكفي، وغير القابل للفصل لا يتوقف أبدًا — سقف الدورات ضرورة عملية.',
          en: 'The guarantee is existential, not optimal: any separating line will do, and non-separable data never halts — an epoch cap is a practical necessity.',
        },
      ],
      reflectPrompt: {
        ar: 'اللوجستي يقلل خسارة ناعمة والبيرسبترون يصحح الأخطاء فقط: أي السلوكين تفضله لو كانت بياناتك تحوي نقاطًا مسمومة؟ ولو احتجت درجة ثقة؟',
        en: 'Logistic regression minimizes a smooth loss; the perceptron only fixes mistakes. Which behavior do you want when the data has poison points, and when you need a confidence score?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch3.s2', pages: 'ص33-37 / pp.33-37' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch3.s2', pages: 'ص33-37 / pp.33-37' },
  ],
} satisfies Lesson;

export default lesson;
