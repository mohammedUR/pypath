/**
 * Lesson mls.ch3.l4 — بناء المصنفات التمييزية
 *   / Constructing the Discriminative Classifiers
 * Book: MLS — Chapter 3 'Discriminative Classification', §3.4 Construction (pp.33-37)
 * Runnable design: three from-scratch builds with pure Python lists (no numpy):
 *   logistic gradient step, perceptron fit to (w0, w1), Fisher 1-D projection classifier.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch3.l4',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 3,
  title: {
    ar: 'بناء المصنفات التمييزية',
    en: 'Constructing the Discriminative Classifiers',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch3.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قرأت عن ثلاث خوارزميات؛ الآن ستبنيها بيدك. هذا هو قسم البناء في الكتاب: تحويل الأفكار إلى دوال صغيرة تُختبر. لن نستورد numpy ولا sklearn — قوائم بايثون وحلقات تكفي تمامًا لهذه البيانات الصغيرة، وستفهم كل عملية قسمة من الداخل. ثلاثة تمارين برمجية: خطوة تدرج لوجستي، وملاءمة بيرسبترون كاملة، ومصنف فيشر بالإسقاط والعتبة. كل نتيجة في التمارين محسوبة ومتحقق منها مسبقًا، فستعرف فورًا إن كان بناؤك صحيحًا.',
        en: 'You have read about three algorithms; now you build them. This is the construction section of the book: turning ideas into small, testable functions. No numpy and no sklearn imports — Python lists and loops are enough for data this small, and you will understand every division from the inside. Three coding exercises: a logistic gradient step, a full perceptron fit, and a Fisher projection classifier with its threshold. Every result is pre-computed and verified, so you will know immediately whether your build is right.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'ثلاث قواعد تدريب، بيانات واحدة',
        en: 'Three training rules, one dataset shape',
      },
      chunks: [
        {
          ar: 'المصنفات الثلاثة تشترك في الهيكل: قائمة خصائص وقائمة تسميات، ونموذج خطي بوزنين (w0, w1). ما يختلف هو قاعدة تغيير الأوزان. اللوجستي: احسب احتمالات بالسيجمويد، ثم متوسط التدرجين g0 = مجموع (p - y) وg1 = مجموع (p - y)*x مقسومًا على عدد النقاط، ثم اطرح معدل التعلم. سنتفق على التدرج المتوسط (قسمة على n) لأنه يجعل معدل التعلم مستقلًا عن حجم البيانات.',
          en: 'The three classifiers share one skeleton: a list of features, a list of labels, and a linear model with two weights (w0, w1). What changes is the rule for moving the weights. Logistic: compute probabilities with the sigmoid, then take the mean gradients g0 = sum of (p - y) and g1 = sum of (p - y)*x divided by the number of points, and subtract the learning rate times them. We standardize on the mean gradient (divide by n) because it keeps the learning rate independent of dataset size.',
        },
        {
          ar: 'البيرسبترون: مرّ على النقاط بالترتيب في كل دورة، وتنبأ، وحدث عند الخطأ فقط، حتى ينتهي سقف الدورات. أعد الزوج النهائي (w0, w1). فيشر: لا تدريب تكراري أصلًا — المعادلات مغلقة: m0 وm1 وSw ثم w = (m1 - m0)/Sw والعتبة منتصف المتوسطين المسقطين. لاحظ الطيف: من حلقة تحسين تكرارية، إلى حلقة تصحيح أخطاء، إلى معادلة واحدة.',
          en: 'The perceptron: walk the points in order each epoch, predict, update only on mistakes, until the epoch cap runs out; return the final pair (w0, w1). Fisher: no iterative training at all — the equations are closed form: m0 and m1 and Sw, then w = (m1 - m0)/Sw with the threshold halfway between the projected means. Notice the spectrum: an optimization loop, an error-correction loop, and a single formula.',
        },
        {
          ar: 'عند البناء من الصفر، الاختبار جزء من التصميم: ثبّت البيانات، احسب النتيجة المتوقعة يدويًا أو بنصبريب موثوق، ثم اكتب assert بمسامحة صغيرة للأعداد العشرية (abs(a - b) < 1e-9 لا a == b). وقوائم التنبؤات تُقارن كاملة: [0, 0, 1, 0] إما تطابق تام أو فشل واضح. هذه هي العادة التي ستحميك حين تنتقل من ثلاث نقاط إلى ثلاثة آلاف.',
          en: 'When building from scratch, testing is part of the design: pin the data, compute the expected result by hand or with a trusted script, then assert with a small float tolerance (abs(a - b) < 1e-9, never a == b). And prediction lists are compared whole: [0, 0, 1, 0] either matches exactly or fails loudly. This habit is what will protect you when you move from three points to three thousand.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'هيكل مشترك قبل التمارين',
        en: 'One shared skeleton before the exercises',
      },
      code: `X = [1.0, 2.0, 3.0]
y = [0, 0, 1]

def summarize(c):
    m = sum(c) / len(c)
    sw = sum((x - m) ** 2 for x in c)
    return m, sw

m0, sw0 = summarize([x for x, t in zip(X, y) if t == 0])
m1, sw1 = summarize([x for x, t in zip(X, y) if t == 1])
print(f"class 0: mean={m0:.1f} scatter={sw0:.1f}")
print(f"class 1: mean={m1:.1f} scatter={sw1:.1f}")
print(f"separation (m1 - m0) = {m1 - m0:.1f}")
print(f"pooled scatter = {sw0 + sw1:.1f}")`,
      explanation: {
        ar: 'قبل أي تدريب، الإحصاءات نفسها تروي قصة: متوسطا الصنفين 1.5 و3.0 بمسافة 1.5 بينهما، وتشتت الصنف الأول 0.5 بينما الثاني صفر لأنه نقطة واحدة. لو طبقنا قاعدة فيشر على هذه البيانات لكان الاتجاه w = 1.5/0.5 = 3.0 — نسبة تباعد المركزين إلى التشتت. ستعيد بناء هذه القاعدة نفسها في التمرين الثالث على بيانات أوسع. ابنِ عادة صغيرة: اطبع الإحصاءات أولًا، ثم درّب.',
        en: 'Before any training, the raw statistics already tell a story: class means 1.5 and 3.0 with a 1.5 gap, class-0 scatter of 0.5 and a class-1 scatter of zero because it is a single point. Applying the Fisher rule to this data would give the direction w = 1.5/0.5 = 3.0 — center separation over scatter. You will rebuild that same rule in the third exercise on wider data. Build the habit: print the statistics first, then train.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.logistic-step',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ logistic_step(X, y, w0, w1, lr): خطوة تدرج لوجستي واحدة بمتوسط التدرج على الدفعة، تعيد الزوج الجديد (w0, w1). اترك أسطر الطباعة كما هي.',
        en: 'Implement logistic_step(X, y, w0, w1, lr): one logistic gradient step with the batch-mean gradient, returning the new pair (w0, w1). Leave the print lines unchanged.',
      },
      starterCode: `import math

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))

def logistic_step(X, y, w0, w1, lr):
    # TODO: mean gradient over the batch, then one step downhill
    return w0, w1

a, b = logistic_step([1.0, 2.0], [0, 1], 0.0, 0.0, 1.0)
print(f"step1 = ({a:.4f}, {b:.4f})")
a, b = logistic_step([1.0, 2.0], [0, 1], 0.0, 0.5, 1.0)
print(f"step2 = ({a:.4f}, {b:.4f})")`,
      solution: `import math

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))

def logistic_step(X, y, w0, w1, lr):
    n = len(X)
    g0 = sum(sigmoid(w0 + w1 * x) - t for x, t in zip(X, y)) / n
    g1 = sum((sigmoid(w0 + w1 * x) - t) * x for x, t in zip(X, y)) / n
    return w0 - lr * g0, w1 - lr * g1

a, b = logistic_step([1.0, 2.0], [0, 1], 0.0, 0.0, 1.0)
print(f"step1 = ({a:.4f}, {b:.4f})")
a, b = logistic_step([1.0, 2.0], [0, 1], 0.0, 0.5, 1.0)
print(f"step2 = ({a:.4f}, {b:.4f})")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'الخطوة الأولى من الصفر', en: 'first step from zero' },
          code: `got = logistic_step([1.0, 2.0], [0, 1], 0.0, 0.0, 1.0)\nassert abs(got[0]) < 1e-9 and abs(got[1] - 0.25) < 1e-9, 'expected (0.0, 0.25) | actual: %r' % (got,)`,
        },
        {
          id: 't2',
          name: { ar: 'الخطوة الثانية متوافقة مع المرجع', en: 'second step matches reference' },
          code: `got = logistic_step([1.0, 2.0], [0, 1], 0.0, 0.5, 1.0)\nassert abs(got[0] - (-0.17675895491592974)) < 1e-9, 'expected w0 = -0.17675895491592974 | actual: %r' % got[0]\nassert abs(got[1] - 0.4577117557690678) < 1e-9, 'expected w1 = 0.4577117557690678 | actual: %r' % got[1]`,
        },
        {
          id: 't3',
          name: { ar: 'الخطوة تخفض الخسارة', en: 'the step lowers the loss' },
          code: `import math\ndef _bce(X, y, w0, w1):\n    return sum(-(t * math.log(1.0/(1.0+math.exp(-(w0 + w1*x)))) + (1-t) * math.log(1.0 - 1.0/(1.0+math.exp(-(w0 + w1*x))))) for x, t in zip(X, y)) / len(X)\na, b = logistic_step([1.0, 2.0], [0, 1], 0.0, 0.0, 1.0)\nassert _bce([1.0, 2.0], [0, 1], a, b) < _bce([1.0, 2.0], [0, 1], 0.0, 0.0), 'step must lower the BCE loss'`,
        },
      ],
      hints: [
        { ar: 'احسب g0 وg1 كمتوسطين: قسم مجموع (p - t) ومجموع (p - t)*x على n = len(X).', en: 'Compute g0 and g1 as means: divide the sum of (p - t) and the sum of (p - t)*x by n = len(X).' },
        { ar: 'التدرج يطرح: return w0 - lr * g0, w1 - lr * g1.', en: 'Gradients subtract: return w0 - lr * g0, w1 - lr * g1.' },
        { ar: 'من الصفر: كل p = 0.5 فيكون g0 = 0.0 وg1 = (0.5*1 + (-0.5)*2)/2 = -0.25 فيصعد w1 إلى 0.25.', en: 'From zero: every p = 0.5, so g0 = 0.0 and g1 = (0.5*1 + (-0.5)*2)/2 = -0.25, lifting w1 to 0.25.' },
        { ar: 'المخرج المطلوب: step1 = (0.0000, 0.2500) ثم step2 = (-0.1768, 0.4577).', en: 'Expected output: step1 = (0.0000, 0.2500) then step2 = (-0.1768, 0.4577).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.perceptron-fit',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ perceptron_fit(X, y, epochs, lr=1.0) التي تدرّب البيرسبترون من (0.0, 0.0) وتعيد الزوج النهائي (w0, w1). النتيجة على بيانات التمرين محسوبة مسبقًا — تحقق منها بالأسطر المثبتة.',
        en: 'Implement perceptron_fit(X, y, epochs, lr=1.0) training the perceptron from (0.0, 0.0) and returning the final pair (w0, w1). The result on the exercise data is pre-computed — verify against the fixed print lines.',
      },
      starterCode: `def perceptron_fit(X, y, epochs, lr=1.0):
    # TODO: start at (0.0, 0.0); each epoch walk the points in order and
    # apply the update whenever the prediction is wrong. Return (w0, w1).
    return 0.0, 0.0

w = perceptron_fit([1.0, 2.0, 3.0], [0, 0, 1], 4)
print("w =", w)
print("preds =", [1 if w[0] + w[1] * x >= 0 else 0 for x in [1.0, 2.0, 3.0, 1.5]])`,
      solution: `def perceptron_fit(X, y, epochs, lr=1.0):
    w0, w1 = 0.0, 0.0
    for _ in range(epochs):
        for x, t in zip(X, y):
            yhat = 1 if w0 + w1 * x >= 0 else 0
            if yhat != t:
                w0 += lr * (t - yhat)
                w1 += lr * (t - yhat) * x
    return w0, w1

w = perceptron_fit([1.0, 2.0, 3.0], [0, 0, 1], 4)
print("w =", w)
print("preds =", [1 if w[0] + w[1] * x >= 0 else 0 for x in [1.0, 2.0, 3.0, 1.5]])`,
      tests: [
        {
          id: 't1',
          name: { ar: 'النتيجة المتحقق منها', en: 'the verified result' },
          code: `got = perceptron_fit([1.0, 2.0, 3.0], [0, 0, 1], 4)\nassert abs(got[0] - (-3.0)) < 1e-9 and abs(got[1] - 1.0) < 1e-9, 'expected (-3.0, 1.0) | actual: %r' % (got,)`,
        },
        {
          id: 't2',
          name: { ar: 'التنبؤات على أربع نقاط', en: 'predictions on four points' },
          code: `w0, w1 = perceptron_fit([1.0, 2.0, 3.0], [0, 0, 1], 4)\npreds = [1 if w0 + w1 * x >= 0 else 0 for x in [1.0, 2.0, 3.0, 1.5]]\nassert preds == [0, 0, 1, 0], 'expected [0, 0, 1, 0] | actual: %r' % (preds,)`,
        },
        {
          id: 't3',
          name: { ar: 'الاستقرار بعد التقارب', en: 'stability after convergence' },
          code: `a = perceptron_fit([1.0, 2.0, 3.0], [0, 0, 1], 4)\nb = perceptron_fit([1.0, 2.0, 3.0], [0, 0, 1], 10)\nassert abs(a[0] - b[0]) < 1e-9 and abs(a[1] - b[1]) < 1e-9, 'weights must stop changing once every point is right: %r vs %r' % (a, b)`,
        },
      ],
      hints: [
        { ar: 'ابدأ w0, w1 = 0.0, 0.0 خارج حلقة الدورات، وداخل كل دورة امشِ على zip(X, y) بالترتيب.', en: 'Start with w0, w1 = 0.0, 0.0 outside the epoch loop; inside each epoch walk zip(X, y) in order.' },
        { ar: 'التحديث كما تعلمته: yhat = 1 if w0 + w1 * x >= 0 else 0، وعند الخطأ w0 += lr*(t - yhat) وw1 += lr*(t - yhat)*x.', en: 'The update as you learned it: yhat = 1 if w0 + w1 * x >= 0 else 0; on a mistake w0 += lr*(t - yhat) and w1 += lr*(t - yhat)*x.' },
        { ar: 'على هذه البيانات تنتهي الدورات الأربع عند w = (-3.0, 1.0) — النقطة 1.5 الجديدة تُصنف 0.', en: 'On this data the four epochs end at w = (-3.0, 1.0) — the new point 1.5 is classified 0.' },
        { ar: 'بعد التقارب لا تحدث تحديثات، فنتيجة 10 دورات تطابق نتيجة 4 — استعملها اختبارًا ثالثًا.', en: 'After convergence no updates fire, so 10 epochs must match 4 — use that as a third test.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.fisher-classifier',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل بناء مصنف فيشر الكامل: fisher_w للاتجاه، وfisher_predict(c0, c1, xs) التي تحسب العتبة من المتوسطين المسقطين وتصنف كل نقطة في xs (1 إذا تجاوز الإسقاط العتبة).',
        en: 'Finish the full Fisher classifier: fisher_w for the direction, and fisher_predict(c0, c1, xs) computing the threshold from the projected means and labeling every point in xs (1 when its projection exceeds the threshold).',
      },
      starterCode: `def fisher_w(c0, c1):
    # TODO: (m1 - m0) / Sw for 1-D data
    return 0.0

def fisher_predict(c0, c1, xs):
    # TODO: direction w, threshold midway between projected class means,
    # then predict 1 when w*x is above the threshold.
    return [0 for _ in xs]

c0 = [2.0, 1.0, 3.0]
c1 = [5.0, 7.0, 9.0]
print(f"w = {fisher_w(c0, c1)}")
print("preds =", fisher_predict(c0, c1, [1.5, 2.0, 6.0, 8.0]))`,
      solution: `def fisher_w(c0, c1):
    m0 = sum(c0) / len(c0)
    m1 = sum(c1) / len(c1)
    sw = sum((x - m0) ** 2 for x in c0) + sum((x - m1) ** 2 for x in c1)
    return (m1 - m0) / sw

def fisher_predict(c0, c1, xs):
    w = fisher_w(c0, c1)
    p0 = [w * x for x in c0]
    p1 = [w * x for x in c1]
    t = (sum(p0) / len(p0) + sum(p1) / len(p1)) / 2
    return [1 if w * x > t else 0 for x in xs]

c0 = [2.0, 1.0, 3.0]
c1 = [5.0, 7.0, 9.0]
print(f"w = {fisher_w(c0, c1)}")
print("preds =", fisher_predict(c0, c1, [1.5, 2.0, 6.0, 8.0]))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'الاتجاه على بيانات التمرين', en: 'direction on the exercise data' },
          code: `assert abs(fisher_w([2.0, 1.0, 3.0], [5.0, 7.0, 9.0]) - 0.5) < 1e-9, 'expected w = 0.5 | actual: %r' % fisher_w([2.0, 1.0, 3.0], [5.0, 7.0, 9.0])`,
        },
        {
          id: 't2',
          name: { ar: 'تنبؤات النقاط الجديدة', en: 'predictions for the new points' },
          code: `c0 = [2.0, 1.0, 3.0]\nc1 = [5.0, 7.0, 9.0]\nassert fisher_predict(c0, c1, [1.5, 2.0, 6.0, 8.0]) == [0, 0, 1, 1], 'expected [0, 0, 1, 1] | actual: %r' % (fisher_predict(c0, c1, [1.5, 2.0, 6.0, 8.0]),)`,
        },
        {
          id: 't3',
          name: { ar: 'تنبؤات التدريب كاملة', en: 'full training predictions' },
          code: `c0 = [2.0, 1.0, 3.0]\nc1 = [5.0, 7.0, 9.0]\nassert fisher_predict(c0, c1, c0 + c1) == [0, 0, 0, 1, 1, 1], 'expected [0, 0, 0, 1, 1, 1] on training data'`,
        },
      ],
      hints: [
        { ar: 'fisher_w نفس دالة التمرين السابق: متوسطان ثم Sw ثم النسبة.', en: 'fisher_w is the same function as last exercise: two means, then Sw, then the ratio.' },
        { ar: 'العتبة: اسقط كل صنف، خذ متوسط كل قائمة مسقطة، ثم خذ منتصفهما: t = (pm0 + pm1) / 2.', en: 'Threshold: project each class, take the mean of each projected list, then their midpoint: t = (pm0 + pm1) / 2.' },
        { ar: 'القرار: return [1 if w * x > t else 0 for x in xs] — مقارنة صارمة أكبر من.', en: 'The decision: return [1 if w * x > t else 0 for x in xs] — a strict greater-than.' },
        { ar: 'المخرج المطلوب: w = 0.5 ثم preds = [0, 0, 1, 1] — العتبة 2.25 و1.5 و2.0 تحتها و6.0 و8.0 فوقها.', en: 'Expected output: w = 0.5 then preds = [0, 0, 1, 1] — the threshold is 2.25 with 1.5 and 2.0 below it, 6.0 and 8.0 above.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي المصنفات الثلاثة ينتج احتمالًا بين 0 و1 بطبيعته؟',
            en: 'Which of the three classifiers naturally outputs a probability between 0 and 1?',
          },
          options: [
            { id: 'a', text: { ar: 'اللوجستي فقط', en: 'logistic regression only' } },
            { id: 'b', text: { ar: 'البيرسبترون فقط', en: 'the perceptron only' } },
            { id: 'c', text: { ar: 'فيشر فقط', en: 'Fisher only' } },
            { id: 'd', text: { ar: 'الثلاثة جميعًا', en: 'all three' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'اللوجستي يمرر النتيجة عبر سيجمويد فيعطي p في (0,1)؛ البيرسبترون يعطي 0/1 وفيشر يعطي اتجاهًا وعتبة.',
            en: 'Logistic passes its score through a sigmoid and yields p in (0, 1); the perceptron gives 0/1 and Fisher gives a direction plus threshold.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في بناء البيرسبترون، متى تُحدَّث الأوزان داخل الحلقة؟',
            en: 'In the perceptron build, when do the weights update inside the loop?',
          },
          options: [
            { id: 'a', text: { ar: 'كل نقطة بلا شرط', en: 'every point, unconditionally' } },
            { id: 'b', text: { ar: 'فقط عندما يخالف yhat التسمية t', en: 'only when yhat disagrees with the label t' } },
            { id: 'c', text: { ar: 'فقط في الدورة الأولى', en: 'only in the first epoch' } },
            { id: 'd', text: { ar: 'فقط عندما تكون النتيجة z موجبة', en: 'only when the score z is positive' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'النقاط الصحيحة لا تغير شيئًا؛ شرط yhat != t هو بوابة التحديث الوحيدة.',
            en: 'Correct points change nothing; the gate yhat != t is the only trigger for an update.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا نكتب abs(a - b) < 1e-9 بدل a == b عند اختبار الأوزان العشرية؟',
            en: 'Why write abs(a - b) < 1e-9 instead of a == b when testing decimal weights?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن == أبطأ من الطرح', en: 'because == is slower than subtraction' } },
            { id: 'b', text: { ar: 'لأن عمليات الفاصلة العائمة تحمل بقايا تقريب تُفشل المساواة التامة', en: 'because floating-point operations carry rounding residue that fails exact equality' } },
            { id: 'c', text: { ar: 'لأن بايثون لا تدعم == للأعداد العشرية', en: 'because Python does not support == for floats' } },
            { id: 'd', text: { ar: 'لأن 1e-9 هي دقة الآلة القصوى', en: 'because 1e-9 is the maximum machine precision' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حساب مثل 0.4*6 قد ينتج 2.4000000000000004؛ مقارنة السبب العشري المقصود بمسامحة صغيرة هي العادة الصحيحة للاختبارات.',
            en: 'A computation like 0.4*6 can produce 2.4000000000000004; comparing against the intended decimal with a small tolerance is the correct testing habit.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'الهيكل مشترك (خصائص + تسميات + وزنان) وقاعدة التحديث هي ما يميز كل مصنف: متوسط تدرج، أو تصحيح أخطاء، أو معادلة مغلقة.',
          en: 'One skeleton (features + labels + two weights) and the update rule is what distinguishes each classifier: mean gradient, error correction, or a closed-form formula.',
        },
        {
          ar: 'بنيتَ خطوة اللوجستي: من (0, 0) خرجت (0.0, 0.25)؛ وخطوة ثانية من w1 = 0.5 أعادت (-0.1768, 0.4577) — أرقام مرجعية متحقق منها.',
          en: 'You built the logistic step: from (0, 0) it returns (0.0, 0.25); a second step from w1 = 0.5 returns (-0.1768, 0.4577) — verified reference numbers.',
        },
        {
          ar: 'بنيتَ ملاءمة البيرسبترون الكاملة: أربع دورات على ثلاث نقاط تستقر عند (-3.0, 1.0) وتتنبأ [0, 0, 1, 0].',
          en: 'You built the full perceptron fit: four epochs on three points settle at (-3.0, 1.0) predicting [0, 0, 1, 0].',
        },
        {
          ar: 'بنيتَ مصنف فيشر: w = 0.5 وعتبة 2.25 وتنبؤات [0, 0, 1, 1] للنقاط الجديدة — بلا أي حلقة تدريب.',
          en: 'You built the Fisher classifier: w = 0.5, threshold 2.25, predictions [0, 0, 1, 1] for the new points — without any training loop.',
        },
      ],
      reflectPrompt: {
        ar: 'المصنفات الثلاثة تسأل أسئلة مختلفة عن نفس البيانات: أي قاعدة تحديث ستفهمها أعمق لو اضطررت لشرحها لزميل بلا معادلات، ولماذا؟',
        en: 'The three classifiers ask different questions of the same data: which update rule would you understand deepest if you had to explain it to a colleague without equations, and why?',
      },
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch3.s4', pages: 'ص33-37 / pp.33-37' },
  ],
} satisfies Lesson;

export default lesson;
