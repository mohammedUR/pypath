/**
 * Lesson mls.ch3.l1 — الانحدار اللوجستي
 *   / Logistic Regression
 * Book: MLS — Chapter 3 'Discriminative Classification', §3.1 Logistic Regression (pp.33-37)
 * Runnable design: fixed two-point dataset -> sigmoid, mean BCE loss, one full-batch
 *   gradient step printed with .4f values; exercise builds sigmoid + bce with tests.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch3.l1',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 3,
  title: {
    ar: 'الانحدار اللوجستي',
    en: 'Logistic Regression',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch2.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الفصلين الماضيين تنبأ النموذج بأرقام: سعر، وقياس، وعدد. لكن كثيرًا من الأسئلة لا إجابة عنها رقم متصل: هل هذه الرسالة إعلان مزعج أم لا؟ هل الورم حميد أم خبيث؟ هنا يبدأ التصنيف. الانحدار اللوجستي أشهر مصنف تمييزي: يأخذ مجموعًا موزونًا للخصائص كما يفعل الانحدار الخطي تمامًا، ثم يمرره عبر دالة سيجمويد ليقرأه احتمالًا بين 0 و1. ستحسب الخسارة والتدرج بأرقامك قبل أن تكتب أي سطر تدريب.',
        en: 'In the last two chapters the model predicted numbers: a price, a measure, a count. But many questions have no continuous answer: is this email spam or not, is this tumor benign or malignant? That is classification. Logistic regression is the workhorse discriminative classifier: it forms a weighted sum of the features exactly like linear regression, then passes it through the sigmoid to read it as a probability between 0 and 1. You will compute the loss and the gradient on fixed numbers before writing any training loop.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'من التنبؤ بالأرقام إلى التنبؤ بالاحتمالات',
        en: 'From predicting numbers to predicting probabilities',
      },
      chunks: [
        {
          ar: 'المصنف التمييزي يتعلم دالة مباشرة من الخصائص إلى العضوية في صنف: لا يسأل كيف تولَّدت البيانات، بل يصنع حدود قرار. الانحدار اللوجستي يبدأ كالانحدار الخطي: نتيجة خطية z = w0 + w1*x. ثم تُحوَّل النتيجة إلى احتمال عبر سيجمويد: sigma(z) = 1 / (1 + e^-z). السيجمويد دالة متزايدة تصبّ أي رقم في المدى المفتوح (0, 1): القيم الكبيرة تقترب من 1، والسالبة الكبيرة من 0، وsigma(0) = 0.5. نقطة القسمة الطبيعية عند 0.5: إذا تجاوز الاحتمال المتنبأ به 0.5 نقول الصنف 1، وإلا الصنف 0.',
          en: 'A discriminative classifier learns a direct function from features to class membership: it does not ask how the data was generated, it just draws a decision boundary. Logistic regression starts like linear regression: a linear score z = w0 + w1*x. The score becomes a probability through the sigmoid: sigma(z) = 1 / (1 + e^-z). The sigmoid is increasing and squashes any number into the open interval (0, 1): large positive inputs approach 1, large negative ones approach 0, and sigma(0) = 0.5. The natural cut is 0.5: predicted probability above 0.5 means class 1, otherwise class 0.',
        },
        {
          ar: 'كيف نختار w0 وw1؟ بالحد من خسارة. الخسارة هنا هي سالب لوغاريتم الاحتمال (NLL)، وتعرف أيضًا باسم الانتروبيا المتقاطعة الثنائية BCE. لنقطة واحدة بتسمية y واحتمال متنبأ به p: الخسارة = -(y*log(p) + (1-y)*log(1-p)). إذا كانت التسمية 1 فالخسارة -log(p): تخبر النموذج أن يرفع p. وإذا كانت 0 فالخسارة -log(1-p): أن يخفضه. التنبؤ الواثق والصائب كلفته قريبة من صفر؛ التنبؤ الواثق والخاطئ كلفته كبيرة جدًا. الخسارة الكلية متوسط هذه الحدود على كل النقاط.',
          en: 'How do we pick w0 and w1? By minimizing a loss. The loss is the negative log likelihood (NLL), also called binary cross-entropy (BCE). For one point with label y and predicted probability p: loss = -(y*log(p) + (1-y)*log(1-p)). If the label is 1 the loss is -log(p): it pushes the model to raise p. If the label is 0 the loss is -log(1-p): it pushes the model to lower p. A confident correct prediction costs almost nothing; a confident wrong one costs a lot. The total loss is the mean of these terms over all points.',
        },
        {
          ar: 'التدريب نزول تدرجي كالمعتاد، لكن للتدرج شكل جميل: مشتقة الخسارة بالنسبة للنتيجة الخطية هي (p - y) فقط — الخطأ في الاحتمال. وبقاعدة السلسلة، التدرج بالنسبة إلى w1 هو مجموع (p - y)*x على النقاط، وبالنسبة إلى w0 مجموع (p - y). خطوة التدريب: احسب احتمالات كل النقاط بالنموذج الحالي، اجمع التدرجين، ثم اطرح حصة تعلم learning rate منهما. سترى في المثال أن خطوة واحدة تخفض الخسارة فعليًا.',
          en: 'Training is gradient descent as usual, and the gradient has a beautiful shape: the derivative of the loss with respect to the linear score is just (p - y), the error in probability. By the chain rule, the gradient for w1 is the sum of (p - y)*x over the points, and for w0 the sum of (p - y). One training step: compute each point probability under the current weights, sum the two gradients, then subtract a learning rate times them. You will see in the worked example that a single step genuinely lowers the loss.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'خطوة تدريب واحدة على نقطتين',
        en: 'One training step on two points',
      },
      code: `import math

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))

X = [1.0, 2.0]
y = [0, 1]

def bce_mean(X, y, w0, w1):
    total = 0.0
    for x, t in zip(X, y):
        p = sigmoid(w0 + w1 * x)
        total += -(t * math.log(p) + (1 - t) * math.log(1 - p))
    return total / len(X)

w0, w1, lr = 0.0, 0.0, 1.0
loss_before = bce_mean(X, y, w0, w1)
g0 = sum(sigmoid(w0 + w1 * x) - t for x, t in zip(X, y)) / len(X)
g1 = sum((sigmoid(w0 + w1 * x) - t) * x for x, t in zip(X, y)) / len(X)
w0 -= lr * g0
w1 -= lr * g1
loss_after = bce_mean(X, y, w0, w1)
print(f"sigmoid(2) = {sigmoid(2.0):.4f}")
print(f"loss before = {loss_before:.4f}")
print(f"grad w1 = {g1:.4f}")
print(f"new w1 = {w1:.4f}")
print(f"loss after = {loss_after:.4f}")`,
      explanation: {
        ar: 'نبدأ من w0 = w1 = 0 فيعطي النموذج احتمال 0.5 لكل نقطة، فالخسارة -log(0.5) = 0.6931. التدرج بالنسبة إلى w1: النقطة الأولى (0.5 - 0)*1 = 0.5 والثانية (0.5 - 1)*2 = -1.0، ومتوسطهما -0.25. خطوة واحدة بمعدل تعلم 1 تنقل w1 إلى 0.25، فتنخفض الخسارة إلى 0.6500. الاتجاه صحيح: النقطة الموجبة أكبر تحتاج ميلًا أعلى.',
        en: 'Starting from w0 = w1 = 0 the model says 0.5 everywhere, so the loss is -log(0.5) = 0.6931. The w1 gradient: point one contributes (0.5 - 0)*1 = 0.5 and point two (0.5 - 1)*2 = -1.0, averaging -0.25. One step with learning rate 1 moves w1 to 0.25 and the loss drops to 0.6500. The direction is right: the larger positive point asks for a steeper slope.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.sigmoid-bce',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ الدالتين الأساسيتين: sigmoid(z) وbce(p, y) (خسارة نقطة واحدة)، ثم اترك أسطر الطباعة الأربعة كما هي دون تغيير.',
        en: 'Implement the two core functions: sigmoid(z) and bce(p, y) (single-point loss), then leave the four print lines unchanged.',
      },
      starterCode: `import math

def sigmoid(z):
    return 0.5  # TODO: 1 / (1 + exp(-z))

def bce(p, y):
    return 0.0  # TODO: -(y*log(p) + (1-y)*log(1-p))

print(f"sigmoid(0) = {sigmoid(0.0):.4f}")
print(f"sigmoid(2) = {sigmoid(2.0):.4f}")
print(f"bce(0.5, 1) = {bce(0.5, 1.0):.4f}")
print(f"bce(0.9, 1) = {bce(0.9, 1.0):.4f}")`,
      solution: `import math

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))

def bce(p, y):
    return -(y * math.log(p) + (1 - y) * math.log(1 - p))

print(f"sigmoid(0) = {sigmoid(0.0):.4f}")
print(f"sigmoid(2) = {sigmoid(2.0):.4f}")
print(f"bce(0.5, 1) = {bce(0.5, 1.0):.4f}")
print(f"bce(0.9, 1) = {bce(0.9, 1.0):.4f}")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'سيجمويد الصفر نصف', en: 'sigmoid at zero is one half' },
          code: `assert abs(sigmoid(0.0) - 0.5) < 1e-9, 'expected sigmoid(0.0) = 0.5 | actual: %r' % sigmoid(0.0)`,
        },
        {
          id: 't2',
          name: { ar: 'سيجمويد عند 2', en: 'sigmoid at 2' },
          code: `assert abs(sigmoid(2.0) - 0.8807970779778823) < 1e-9, 'expected sigmoid(2.0) = 0.8807970779778823 | actual: %r' % sigmoid(2.0)`,
        },
        {
          id: 't3',
          name: { ar: 'قيم الخسارة صحيحة', en: 'loss values are right' },
          code: `assert abs(bce(0.5, 1) - 0.6931471805599453) < 1e-9, 'expected bce(0.5, 1) = 0.6931471805599453 | actual: %r' % bce(0.5, 1)\nassert abs(bce(0.9, 1) - 0.10536051565782628) < 1e-9, 'expected bce(0.9, 1) = 0.10536051565782628 | actual: %r' % bce(0.9, 1)`,
        },
        {
          id: 't4',
          name: { ar: 'سطر الطباعة الأخير', en: 'final print line' },
          code: `assert 'bce(0.9, 1) = 0.1054' in __learner_output__, 'expected line: bce(0.9, 1) = 0.1054 | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'السيجمويد: return 1.0 / (1.0 + math.exp(-z)) — لاحظ الإشارة السالبة داخل الأس.', en: 'The sigmoid: return 1.0 / (1.0 + math.exp(-z)) — mind the minus sign in the exponent.' },
        { ar: 'bce حدودها: -(y * math.log(p) + (1 - y) * math.log(1 - p))، حدين فقط يُختار حسب قيمة y.', en: 'bce body: -(y * math.log(p) + (1 - y) * math.log(1 - p)); only one of the two terms survives depending on y.' },
        { ar: 'عند p = 0.5 الحدان متساويان فالخسارة -log(0.5) ≈ 0.6931، وعند p = 0.9 مع y = 1 الخسارة -log(0.9) ≈ 0.1054.', en: 'At p = 0.5 both terms coincide so the loss is -log(0.5) ≈ 0.6931; at p = 0.9 with y = 1 it is -log(0.9) ≈ 0.1054.' },
        { ar: 'الناتج المطلوب: sigmoid(2) = 0.8808 ثم bce(0.9, 1) = 0.1054 في السطر الأخير.', en: 'Expected output: sigmoid(2) = 0.8808 and the last line bce(0.9, 1) = 0.1054.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.gradient-term',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'نقطة ذات خصيصة x تنبأ النموذج لها باحتمال p = 0.9 وتسميتها الحقيقية y = 1. ما إسهام هذه النقطة في تدرج w1 (قبل متوسطتها مع بقية النقاط)؟',
        en: 'A point with feature x gets predicted probability p = 0.9 while its true label is y = 1. What does this point contribute to the w1 gradient (before averaging over points)?',
      },
      options: [
        { id: 'a', text: { ar: '+0.9x — التدرج يتناسب مع الاحتمال نفسه', en: '+0.9x — the gradient scales with the probability itself' } },
        { id: 'b', text: { ar: '−0.1x — الخطأ (p − y) مضروبًا في الخصيصة', en: '−0.1x — the error (p − y) times the feature' } },
        { id: 'c', text: { ar: '0 — التنبؤ صائب فلا تحديث', en: '0 — the prediction is right, so no update' } },
        { id: 'd', text: { ar: '+1.0x — التدرج يعتمد على التسمية وحدها', en: '+1.0x — the gradient depends on the label only' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'تدرج w1 لكل نقطة هو (p - y) * x — الخطأ في الاحتمال مضروبًا بالخصيصة.', en: 'The per-point w1 gradient is (p - y) * x — the probability error times the feature.' },
        { ar: 'احسب الخطأ: p - y = 0.9 - 1 = -0.1.', en: 'Compute the error: p - y = 0.9 - 1 = -0.1.' },
        { ar: 'حذارِ: التنبؤ لم يصل إلى 1 بعد، فالخسارة ليست صفرًا رغم صحته الاتجاهي.', en: 'Careful: the prediction has not reached 1 yet, so the loss is not zero even though it leans the right way.' },
        { ar: 'الإجابة: -0.1x — إسهام سالب صغير يدفع w1 إلى الأعلى عند الطرح.', en: 'Answer: -0.1x — a small negative contribution that pushes w1 up when subtracted.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما مدى خرج دالة السيجمويد لأي مدخل حقيقي؟',
            en: 'What range does the sigmoid output for any real input?',
          },
          options: [
            { id: 'a', text: { ar: 'كل الأعداد الحقيقية', en: 'all real numbers' } },
            { id: 'b', text: { ar: 'المدى المفتوح بين 0 و1', en: 'the open interval between 0 and 1' } },
            { id: 'c', text: { ar: 'بين -1 و1', en: 'between -1 and 1' } },
            { id: 'd', text: { ar: 'الأعداد الموجبة فقط', en: 'positive numbers only' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'السيجمويد دالة تشبع متزايدة: تقترب من 1 عندما يكبر z ومن 0 عندما يصغر، ولا تلمس الحدين أبدًا — لذلك تصلح احتمالًا.',
            en: 'The sigmoid is an increasing saturating function: it approaches 1 as z grows and 0 as it falls, never touching either — which is what makes it usable as a probability.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'أي خسارة يقلل الانحدار اللوجستي الثنائي أثناء التدريب؟',
            en: 'Which loss does binary logistic regression minimize during training?',
          },
          options: [
            { id: 'a', text: { ar: 'متوسط مربعات الفرق', en: 'mean squared error' } },
            { id: 'b', text: { ar: 'الانتروبيا المتقاطعة الثنائية (سالب لوغاريتم الاحتمال)', en: 'binary cross-entropy (negative log likelihood)' } },
            { id: 'c', text: { ar: 'القيمة المطلقة للفرق', en: 'absolute error' } },
            { id: 'd', text: { ar: 'عدد أخطاء التصنيف فقط', en: 'the number of misclassifications only' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الخسارة اللوجستية هي سالب لوغاريتم احتمال التسمية الصحيحة تحت نموذج برنولي: -log(p) للتسمية 1 و-log(1-p) للتسمية 0.',
            en: 'The logistic loss is the negative log likelihood of the correct label under a Bernoulli model: -log(p) for label 1 and -log(1-p) for label 0.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يوصف الانحدار اللوجستي بأنه مصنف تمييزي؟',
            en: 'Why is logistic regression called a discriminative classifier?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يميز بين أكثر من صنفين دائمًا', en: 'because it always separates more than two classes' } },
            { id: 'b', text: { ar: 'لأنه يتعلم P(y|x) مباشرة دون نمذجة توزيع الخصائص لكل صنف', en: 'because it learns P(y|x) directly without modeling the feature distribution per class' } },
            { id: 'c', text: { ar: 'لأنه يستعمل قاعدة بايز لحساب الاحتمال اللاحق', en: 'because it uses Bayes rule to compute the posterior' } },
            { id: 'd', text: { ar: 'لأنه يحذف الخصائص غير المميزة قبل التدريب', en: 'because it drops uninformative features before training' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التمييزي يصنع حدود قرار مباشرة من الخصائص إلى العضوية؛ التوليدي (الفصل القادم) يبدأ من p(x|y) والسوابق ثم يستدل بالعكس عبر قاعدة بايز.',
            en: 'The discriminative approach draws a decision boundary straight from features to membership; the generative one (next chapter) starts from p(x|y) and priors and inverts with Bayes rule.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'الانحدار اللوجستي = نتيجة خطية + سيجمويد: sigma(w0 + w1*x) يقرأ النتيجة احتمالًا في (0, 1) والعتبة 0.5 تصنع القرار.',
          en: 'Logistic regression = linear score + sigmoid: sigma(w0 + w1*x) reads the score as a probability in (0, 1) and the 0.5 cut makes the call.',
        },
        {
          ar: 'الخسارة BCE لكل نقطة: -(y*log(p) + (1-y)*log(1-p)) — تعاقب الثقة الخاطئة بقوة وتكافئ الصواب القريب من اليقين.',
          en: 'Per-point BCE loss: -(y*log(p) + (1-y)*log(1-p)) — it punishes confident mistakes hard and barely charges confident correct calls.',
        },
        {
          ar: 'التدرج بسيط: مجموع (p - y)*x لـ w1 ومجموع (p - y) لـ w0 — خطأ الاحتمال هو المحرك.',
          en: 'The gradient is simple: sum (p - y)*x for w1 and sum (p - y) for w0 — the probability error drives everything.',
        },
        {
          ar: 'خطوة نزول تدرجي واحدة خفضت الخسارة من 0.6931 إلى 0.6500 على بياناتنا الثابتة — نفس الحلقة تتكرر مئات المرات في التدريب الفعلي.',
          en: 'One gradient step cut the loss from 0.6931 to 0.6500 on our fixed data — the real training loop just repeats that step hundreds of times.',
        },
      ],
      reflectPrompt: {
        ar: 'لماذا نمرر النتيجة الخطية عبر سيجمويد بدل قطعها عند صفر مباشرة؟ ماذا نخسب لو كانت مخرجات النموذج 0 أو 1 فقط؟',
        en: 'Why pass the linear score through a sigmoid instead of hard-cutting it at zero? What would we lose if the model only ever said 0 or 1?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch3.s1', pages: 'ص33-37 / pp.33-37' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch3.s1', pages: 'ص33-37 / pp.33-37' },
  ],
} satisfies Lesson;

export default lesson;
