/**
 * Lesson mls.ch4.l4 — المباراة على بيانات واحدة: LDA ضد QDA ضد بايز الساذج
 *   / The Same-Data Showdown: LDA vs QDA vs Naive Bayes
 * Book: MLS — Chapter 4 'Generative Classification', §4.4 Implementation (pp.38-53),
 *   with §4.1 LDA/QDA background. The book fits sklearn's LinearDiscriminantAnalysis,
 *   QuadraticDiscriminantAnalysis, and GaussianNB on the wine data and compares decision
 *   boundaries; we run the identical experiment pure-Python on one fixed 1-D dataset.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch4.l4',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 4,
  title: {
    ar: 'المباراة على بيانات واحدة: LDA ضد QDA ضد بايز الساذج',
    en: 'The Same-Data Showdown: LDA vs QDA vs Naive Bayes',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch4.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'بنيتَ في الدرس الماضي ثلاثة مصنفات توليدية؛ والسؤال الطبيعي الآن: أيها يفوز؟ هذا هو قسم التنفيذ في الفصل الرابع: الكتاب يركّب النسخ الثلاث من scikit-learn — LinearDiscriminantAnalysis وQuadraticDiscriminantAnalysis وGaussianNB — على بيانات النبيذ ويقارن حدود القرار. ونحن نجري المباراة نفسها على مجموعة بيانات ثابتة واحدة بلغة بايثون صافية: ثلاثة نماذج، لوحة نتائج واحدة، وفائز يُقاس ولا يُخمَّن.',
        en: 'You built three generative classifiers last lesson; the natural question now is: which one wins? This is the implementation section of chapter 4: the book fits the three scikit-learn versions — LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis, and GaussianNB — on the wine data and compares their decision boundaries. We stage the same duel on one fixed dataset in pure Python: three models, one scoreboard, and a winner that is measured rather than guessed.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'بروتوكول المقارنة وسبب اختلاف النماذج',
        en: 'The comparison protocol and why the models differ',
      },
      chunks: [
        {
          ar: 'تجربة مقارنة تحتاج بروتوكولًا صارمًا: مجموعة بيانات واحدة ثابتة تخدم التدريب والتقييم معًا، ونماذج تُقاس على النقاط نفسها بالضبط. هنا ثماني نقاط على محور واحد: الصنف 0 ضيق حول 2.75 (النقاط 2.0 و2.5 و3.0 و3.5) والصنف 1 واسع حول 8.0 (النقاط 5.0 و6.0 و9.0 و12.0). الدقة هي نسبة التنبؤات الصحيحة، وقائمة errors تكشف النقاط التي أخطأ فيها كل نموذج — الرقم وحده لا يكفي، فأنت تريد أن تعرف أين انخدع كل مصنف.',
          en: 'A comparison needs a strict protocol: one fixed dataset serving both training and evaluation, and models measured on exactly the same points. Here are eight points on one axis: class 0 is narrow around 2.75 (points 2.0, 2.5, 3.0, 3.5) and class 1 is wide around 8.0 (points 5.0, 6.0, 9.0, 12.0). Accuracy is the fraction of correct predictions, and an errors list reveals which points each model missed — the single number is not enough; you want to know where each classifier slipped.',
        },
        {
          ar: 'الفرق بين الثلاثة يقع كلّه في التباين. LDA يجمع تباينًا واحدًا مشتركًا، فيبقى حد القرار خطًا مستقيمًا عند منتصف المسافة بين المتوسطين (هنا 5.375). QDA يعطي كل صنف تباينه الخاص، فينحني الحد: الصنف الواسع ينتشر أبعد ويطالب بالنقاط البعيدة. أما GaussianNB فيفترض غاوسيًا مستقلًا لكل خصيصة في كل صنف — ومع خصيصة واحدة يُختزل نموذجه إلى متوسط وتباين لكل صنف، وهذا حرفيًا QDA الذي بنيناه في الدرس الماضي؛ لذا يجب أن تتطابق دقتهما هنا تطابقًا تامًا.',
          en: 'The difference between the three lives entirely in the variance. LDA pools one shared variance, so the decision boundary stays a straight line at the midpoint of the means (here 5.375). QDA gives each class its own variance, so the boundary bends: the wide class spreads farther out and claims distant points. GaussianNB assumes an independent Gaussian per feature per class — with a single feature its model reduces to a mean and a variance per class, literally the QDA we built last lesson; so their accuracies must coincide exactly here.',
        },
        {
          ar: 'اقرأ اللوحة كتجربة لا كترتيب لفضائل النماذج: حقق QDA وNB دقة 1.0 لأن تباين الصنف الواسع احتمل النقطة 5.0 البعيدة عن مركزه، بينما التزمت LDA بالحد المشترك وألصقت النقطة بالصنف الضيق. هل يعني ذلك أن QDA أفضل دائمًا؟ إطلاقًا: المرونة الأعلى تعني تقديرات أكثر، وقد تخسر على بيانات ثابتة أخرى. القاعدة المهنية: قارن المرشحين على البيانات نفسها، واقرأ الأخطاء لا الدقة وحدها — هذا ما يفعله الكتاب مع نسخ sklearn الثلاث قبل الثقة بها.',
          en: 'Read the scoreboard as an experiment, not a ranking of virtues: QDA and NB scored 1.0 because the wide class variance tolerated the point 5.0 far from its center, while LDA stuck to the shared boundary and handed that point to the narrow class. Does that make QDA always better? Not at all: more flexibility means more estimates to get wrong, and it can lose on other fixed data. The professional rule: compare candidates on the same data and read the errors, not just accuracy — exactly what the book does with the three sklearn versions before trusting them.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'لوحة النتائج: ثلاثة نماذج، بيانات واحدة',
        en: 'The scoreboard: three models, one dataset',
      },
      code: `import math

c0 = [2.0, 2.5, 3.0, 3.5]
c1 = [5.0, 6.0, 9.0, 12.0]
xs = c0 + c1
ys = [0, 0, 0, 0, 1, 1, 1, 1]

mu0, mu1 = sum(c0) / len(c0), sum(c1) / len(c1)
var0 = sum((x - mu0) ** 2 for x in c0) / len(c0)
var1 = sum((x - mu1) ** 2 for x in c1) / len(c1)
var = (var0 + var1) / 2
pi0 = pi1 = 0.5

def score(x, pi, mu, v):
    return math.log(pi) - 0.5 * math.log(2 * math.pi * v) - (x - mu) ** 2 / (2 * v)

def predict(points, shared):
    preds = []
    for x in points:
        v0 = var if shared else var0
        v1 = var if shared else var1
        preds.append(0 if score(x, pi0, mu0, v0) >= score(x, pi1, mu1, v1) else 1)
    return preds

model = {0: (pi0, mu0, var0), 1: (pi1, mu1, var1)}

def nb_predict(x):
    best, best_score = None, None
    for k in (0, 1):
        pi, mu, v = model[k]
        s = score(x, pi, mu, v)
        if best_score is None or s > best_score:
            best, best_score = k, s
    return best

lda_preds = predict(xs, True)
qda_preds = predict(xs, False)
nb_preds = [nb_predict(x) for x in xs]

def report(name, preds):
    acc = sum(p == y for p, y in zip(preds, ys)) / len(ys)
    errs = [x for x, p, y in zip(xs, preds, ys) if p != y]
    print(f"{name:<4}acc={acc:.4f} errors={errs}")

report("LDA", lda_preds)
report("QDA", qda_preds)
report("NB", nb_preds)
print("QDA == NB predictions:", qda_preds == nb_preds)
print("LDA/QDA agreement:", sum(a == b for a, b in zip(lda_preds, qda_preds)), "/ 8")`,
      explanation: {
        ar: 'اقرأ اللوحة من الأعلى إلى الأسفل: LDA أخطأ في النقطة 5.0 فقط (دقة 0.8750) لأن حدها الخطي عند منتصف المتوسطين 5.375 وضع النقطة في جهة الصنف الضيق. QDA بلغ 1.0000 لأن التباين الخاص بالصنف الواسع (7.5 مقابل 0.3125) وسّع نطاقه حتى شمل 5.0. NB دقته أيضًا 1.0000 وتنبؤاته مطابقة لـ QDA نقطة بنقطة — ليست مصادفة بل نتيجة بنيوية: في بعد واحد نموذا GaussianNB وQDA هما الحساب نفسه. لاحظ سطر الاتفاق: 7 من 8 نقاط متفقة، والاختلاف كله في 5.0. في الكتاب: المقارنة تجري على بيانات النبيذ عبر LinearDiscriminantAnalysis وQuadraticDiscriminantAnalysis وGaussianNB مع رسم حدود القرار.',
        en: 'Read the board top down: LDA misses only the point 5.0 (accuracy 0.8750) because its straight boundary at the means midpoint 5.375 places the point on the narrow-class side. QDA reaches 1.0000 because the wide class own variance (7.5 versus 0.3125) stretches its region until it covers 5.0. NB also scores 1.0000 and its predictions match QDA point for point — not a coincidence but structural: in one dimension GaussianNB and QDA are the same computation. Note the agreement line: 7 of 8 points agree, and all disagreement lives at 5.0. In the book: the comparison runs on the wine data through LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis, and GaussianNB with decision-boundary plots.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.same-data-showdown',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل qda_predict(points) لتستخدم تباين كل صنف (var0 وvar1) بدل التباين المشترك، مع إبقاء lda_predict وأسطر الطباعة الثلاثة كما هي. التقرير المطلوب: دقة LDA = 0.875 ودقة QDA = 1.0 والاختلاف عند 5.0 فقط.',
        en: 'Complete qda_predict(points) so each class uses its own variance (var0 and var1) instead of the shared one, keeping lda_predict and the three print lines unchanged. Target report: LDA accuracy 0.875, QDA accuracy 1.0, disagreement only at 5.0.',
      },
      starterCode: `import math

c0 = [2.0, 2.5, 3.0, 3.5]
c1 = [5.0, 6.0, 9.0, 12.0]
xs = c0 + c1
ys = [0, 0, 0, 0, 1, 1, 1, 1]
mu0, mu1 = sum(c0) / len(c0), sum(c1) / len(c1)
var0 = sum((x - mu0) ** 2 for x in c0) / len(c0)
var1 = sum((x - mu1) ** 2 for x in c1) / len(c1)
var = (var0 + var1) / 2
pi0 = pi1 = 0.5

def score(x, pi, mu, v):
    return math.log(pi) - 0.5 * math.log(2 * math.pi * v) - (x - mu) ** 2 / (2 * v)

def lda_predict(points):
    # shared variance: a straight boundary at the midpoint of the means
    return [0 if score(x, pi0, mu0, var) >= score(x, pi1, mu1, var) else 1 for x in points]

def qda_predict(points):
    # TODO: same template but each class uses its own variance (var0 / var1)
    return [0 for _ in points]

lda_preds = lda_predict(xs)
qda_preds = qda_predict(xs)
print("LDA acc =", sum(p == y for p, y in zip(lda_preds, ys)) / len(ys))
print("QDA acc =", sum(p == y for p, y in zip(qda_preds, ys)) / len(ys))
print("disagree =", [x for x, a, b in zip(xs, lda_preds, qda_preds) if a != b])`,
      solution: `import math

c0 = [2.0, 2.5, 3.0, 3.5]
c1 = [5.0, 6.0, 9.0, 12.0]
xs = c0 + c1
ys = [0, 0, 0, 0, 1, 1, 1, 1]
mu0, mu1 = sum(c0) / len(c0), sum(c1) / len(c1)
var0 = sum((x - mu0) ** 2 for x in c0) / len(c0)
var1 = sum((x - mu1) ** 2 for x in c1) / len(c1)
var = (var0 + var1) / 2
pi0 = pi1 = 0.5

def score(x, pi, mu, v):
    return math.log(pi) - 0.5 * math.log(2 * math.pi * v) - (x - mu) ** 2 / (2 * v)

def lda_predict(points):
    # shared variance: a straight boundary at the midpoint of the means
    return [0 if score(x, pi0, mu0, var) >= score(x, pi1, mu1, var) else 1 for x in points]

def qda_predict(points):
    # each class uses its own variance, so the boundary bends
    return [0 if score(x, pi0, mu0, var0) >= score(x, pi1, mu1, var1) else 1 for x in points]

lda_preds = lda_predict(xs)
qda_preds = qda_predict(xs)
print("LDA acc =", sum(p == y for p, y in zip(lda_preds, ys)) / len(ys))
print("QDA acc =", sum(p == y for p, y in zip(qda_preds, ys)) / len(ys))
print("disagree =", [x for x, a, b in zip(xs, lda_preds, qda_preds) if a != b])`,
      tests: [
        {
          id: 't1',
          name: { ar: 'تنبؤات QDA الكاملة على البيانات', en: 'full QDA predictions on the dataset' },
          code: `c0 = [2.0, 2.5, 3.0, 3.5]\nc1 = [5.0, 6.0, 9.0, 12.0]\nassert qda_predict(c0 + c1) == [0, 0, 0, 0, 1, 1, 1, 1], 'expected [0, 0, 0, 0, 1, 1, 1, 1] | actual: %r' % (qda_predict(c0 + c1),)`,
        },
        {
          id: 't2',
          name: { ar: 'دقتا النموذجين على البيانات نفسها', en: 'both accuracies on the same data' },
          code: `ys = [0, 0, 0, 0, 1, 1, 1, 1]\nxs = [2.0, 2.5, 3.0, 3.5, 5.0, 6.0, 9.0, 12.0]\nqacc = sum(p == y for p, y in zip(qda_predict(xs), ys)) / 8\nlacc = sum(p == y for p, y in zip(lda_predict(xs), ys)) / 8\nassert abs(qacc - 1.0) < 1e-9, 'expected QDA accuracy 1.0 | actual: %r' % qacc\nassert abs(lacc - 0.875) < 1e-9, 'expected LDA accuracy 0.875 | actual: %r' % lacc`,
        },
        {
          id: 't3',
          name: { ar: 'نقطة الاختلاف الوحيدة', en: 'the single disagreement point' },
          code: `xs = [2.0, 2.5, 3.0, 3.5, 5.0, 6.0, 9.0, 12.0]\ndis = [x for x, a, b in zip(xs, lda_predict(xs), qda_predict(xs)) if a != b]\nassert dis == [5.0], 'expected disagreement at [5.0] | actual: %r' % dis\nassert 'disagree = [5.0]' in __learner_output__, 'expected line: disagree = [5.0] | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'القالب موجود حرفيًا في lda_predict؛ الفرق الوحيد أن كل صنف يأخذ تباينه: var0 للصنف 0 وvar1 للصنف 1.', en: 'The template sits verbatim in lda_predict; the only change is that each class takes its own variance: var0 for class 0 and var1 for class 1.' },
        { ar: 'السطر الكامل: return [0 if score(x, pi0, mu0, var0) >= score(x, pi1, mu1, var1) else 1 for x in points].', en: 'The full line: return [0 if score(x, pi0, mu0, var0) >= score(x, pi1, mu1, var1) else 1 for x in points].' },
        { ar: 'حد LDA عند منتصف المتوسطين 5.375 فيقع 5.0 في جهة الصنف الضيق؛ تباين الصنف الواسع في QDA يفتح له الباب — لهذا 5.0 هي نقطة الاختلاف الوحيدة.', en: 'The LDA boundary sits at the means midpoint 5.375, so 5.0 lands on the narrow-class side; in QDA the wide class variance opens the door for it — that is why 5.0 is the single disagreement point.' },
        { ar: 'المخرج المطلوب: LDA acc = 0.875 وQDA acc = 1.0 وdisagree = [5.0].', en: 'Expected output: LDA acc = 0.875, QDA acc = 1.0, disagree = [5.0].' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.why-identical',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا تطابقت دقة QDA ودقة GaussianNB تمامًا على هذه البيانات أحادية البعد، بينما اختلفت دقة LDA؟',
        en: 'Why did QDA and GaussianNB score exactly the same accuracy on this one-dimensional dataset, while LDA differed?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن النموذجين يستحقمان السوابق ويضبطانها مثل LDA', en: 'because both models estimate and calibrate priors like LDA' } },
        { id: 'b', text: { ar: 'لأن GaussianNB يفترض غاوسيًا مستقلًا لكل خصيصة في كل صنف، ومع خصيصة واحدة يُختزل إلى متوسط وتباين لكل صنف — وهذا هو QDA نفسه', en: 'because GaussianNB assumes an independent Gaussian per feature per class, and with one feature it reduces to a mean and variance per class — which is exactly QDA' } },
        { id: 'c', text: { ar: 'لأن النموذجين يستخدمان سوابق غير متساوية بين الصنفين', en: 'because the two models use unequal priors between the classes' } },
        { id: 'd', text: { ar: 'لأن كليهما يحوّل البيانات إلى عدّات كلمات قبل الحساب', en: 'because both turn the data into word counts before computing' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'تذكّر ملاحظة الدرس الماضي: افتراض الاستقلال الشرطي لا يفعل شيئًا حين توجد خصيصة واحدة.', en: 'Recall last lesson observation: conditional independence does nothing when there is a single feature.' },
        { ar: 'GaussianNB يخزّن لكل صنف متوسطًا وتباينًا لكل خصيصة؛ اقتصر إلى خصيصة واحدة فبقي متوسط وتباين لكل صنف.', en: 'GaussianNB stores a mean and a variance per feature per class; restrict to one feature and a mean and a variance per class remain.' },
        { ar: 'LDA وحدها تجمع تباينًا مشتركًا واحدًا عبر الصنفين — هذا هو الفرق الوحيد على محور واحد.', en: 'Only LDA pools one shared variance across the two classes — that is the only difference on one axis.' },
        { ar: 'الإجابة: b — في بعد واحد يكون GaussianNB وQDA الحساب نفسه.', en: 'Answer: b — in one dimension GaussianNB and QDA are the same computation.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا يفعل قسم التنفيذ في الكتاب (§4.4) عمليًا؟',
            en: 'What does the book implementation section (§4.4) actually do?',
          },
          options: [
            { id: 'a', text: { ar: 'يشتق مصنفًا توليديًا رابعًا جديدًا بغير قاعدة بايز', en: 'it derives a brand-new fourth generative classifier without Bayes rule' } },
            { id: 'b', text: { ar: 'يركّب LinearDiscriminantAnalysis وQuadraticDiscriminantAnalysis وGaussianNB من scikit-learn على بيانات النبيذ ويتحقق أن حدود قراراتها تطابق بناءات الفصل', en: 'it fits scikit-learn LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis, and GaussianNB on the wine data and checks their decision boundaries match the chapter constructions' } },
            { id: 'c', text: { ar: 'يستبدل قاعدة بايز بالنزول التدرجي', en: 'it replaces Bayes rule with gradient descent' } },
            { id: 'd', text: { ar: 'يعرض البيانات الخام فقط دون أي نموذج', en: 'it plots the raw data without any model' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قسم التنفيذ يركّب النسخ الثلاث الجاهزة من scikit-learn ثم يرسم حدود قراراتها ويتأكد أنها تطابق ما بُني في قسم البناء — التحقق بالمقارنة على نفس البيانات.',
            en: 'The implementation section fits the three ready-made scikit-learn versions, plots their decision boundaries, and confirms they match what the construction section built — verification by comparison on the same data.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في لوحة نتائجنا: لماذا أخطأت LDA في النقطة 5.0 بينما أصابها QDA وNB؟',
            en: 'On our scoreboard: why did LDA miss the point 5.0 while QDA and NB got it right?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن سوابق الصنفين غير متساوية', en: 'because the class priors are unequal' } },
            { id: 'b', text: { ar: 'لأن التباين المشترك يجعل حد LDA خطًا عند منتصف المتوسطين 5.375 فتقع النقطة في جهة الصنف الضيق، بينما يمنحها تباين الصنف الواسع الخاص في QDA مكانًا في نطاقه', en: 'because the shared variance makes the LDA boundary a line at the means midpoint 5.375, putting the point on the narrow-class side, while QDA own wide-class variance grants it room inside its region' } },
            { id: 'c', text: { ar: 'لأن LDA لا تستخدم اللوغاريتمات في درجاتها', en: 'because LDA does not use logarithms in its scores' } },
            { id: 'd', text: { ar: 'لأن النقطة 5.0 وردت مرتين في بيانات التدريب', en: 'because the point 5.0 appears twice in the training data' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بتباين مشترك واحد يُقسم المحور عند منتصف المتوسطين (5.375) فتُحكم 5.0 للصنف الضيق. أما تباين 7.5 للصنف الواسع فيخفض عقوبة البعد ويجعل كثافته عند 5.0 أعلى من كثافة الصنف الضيق المتباين 0.3125.',
            en: 'With one shared variance the axis is split at the midpoint of the means (5.375), so 5.0 is assigned to the narrow class. The wide class variance of 7.5 lowers the distance penalty and makes its density at 5.0 higher than that of the narrow class with variance 0.3125.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'حقق QDA وNB دقة أعلى من LDA على بياناتنا الثابتة. ما الاستنتاج السليم؟',
            en: 'QDA and NB beat LDA on our fixed data. What is the sound conclusion?',
          },
          options: [
            { id: 'a', text: { ar: 'QDA هو الخيار الأفضل دائمًا مهما كانت البيانات', en: 'QDA is always the best choice regardless of the data' } },
            { id: 'b', text: { ar: 'المرونة الأعلى لا تضمن شيئًا: قد تخسر QDA على بيانات ثابتة أخرى، والقاعدة هي مقارنة المرشحين على البيانات نفسها وقراءة الأخطاء', en: 'more flexibility guarantees nothing: QDA can lose on other fixed data, and the rule is to compare candidates on the same data and read the errors' } },
            { id: 'c', text: { ar: 'LDA لا تصلح للبيانات أحادية البعد إطلاقًا', en: 'LDA is useless on one-dimensional data' } },
            { id: 'd', text: { ar: 'المقارنة العادلة مستحيلة دون مكتبة sklearn', en: 'a fair comparison is impossible without sklearn' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'نموذج أكثر مرونة يقدّر معاملات أكثر، وقد يخسر على بيانات أخرى. الفوز هنا نتيجة تجربة على بيانات محددة لا قانون عام؛ لذا تُقارن النماذج على البيانات نفسها وتُفحص أخطاؤها قبل الحكم.',
            en: 'A more flexible model estimates more parameters and may lose on other data. Winning here is the outcome of one experiment on one dataset, not a law; so models are compared on the same data and their errors inspected before any verdict.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'أجريتَ المقارنة الكاملة على مجموعة ثابتة واحدة: دقة LDA = 0.875 بخطأ وحيد عند 5.0، ودقة QDA وNB = 1.0000 لكلٍّ منهما.',
          en: 'You ran the full comparison on one fixed dataset: LDA accuracy 0.875 with a single error at 5.0, and QDA and NB accuracy 1.0000 each.',
        },
        {
          ar: 'تطابق QDA مع NB نقطة بنقطة ليس مصادفة: في بعد واحد كلاهما متوسط وتباين لكل صنف — ملاحظة الدرس الماضي صارت رقمًا مقيسًا.',
          en: 'QDA matching NB point for point is no accident: in one dimension both are a mean and a variance per class — last lesson observation, now a measured number.',
        },
        {
          ar: 'تباين مشترك واحد يعني حدًا خطيًا عند منتصف المتوسطين (5.375)؛ وتباين لكل صنف يعني حدًا منحنيًا يتبع انتشار كل صنف.',
          en: 'One shared variance means a linear boundary at the midpoint of the means (5.375); per-class variances mean a curved boundary that follows each class spread.',
        },
        {
          ar: 'الكتاب يثق بنسخ scikit-learn الثلاث بعد مقارنة حدودها على البيانات نفسها — اجعل «بيانات واحدة، لوحة واحدة» عادتك قبل اختيار أي نموذج.',
          en: 'The book trusts the three scikit-learn versions after comparing their boundaries on the same data — make "one dataset, one scoreboard" your habit before choosing any model.',
        },
      ],
      reflectPrompt: {
        ar: 'لو تضخّم تباين الصنف الضيق من 0.3125 إلى 3.0، فهل تبقى 5.0 نقطة اختلاف بين LDA وQDA؟ جرّب حسابيًا واشرح ماذا يحدث للحدَّين.',
        en: 'If the narrow class variance grew from 0.3125 to 3.0, would 5.0 remain a disagreement point between LDA and QDA? Try it numerically and explain what happens to the two boundaries.',
      },
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch4.s4', pages: 'ص38-53 / pp.38-53' },
    { book: 'MLS', section: 'mls.ch4.s1', pages: 'ص38-53 / pp.38-53' },
  ],
} satisfies Lesson;

export default lesson;
