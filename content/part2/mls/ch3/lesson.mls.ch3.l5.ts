/**
 * Lesson mls.ch3.l5 — تنفيذ المصنفات التمييزية ومقارنتها
 *   / Implementing and Comparing Discriminative Classifiers
 * Book: MLS — Chapter 3 'Discriminative Classification', §3.5 Implementation (pp.33-37)
 * Runnable design: logistic vs perceptron vs fisher-threshold on one fixed labeled
 *   dataset, printed accuracy report; sklearn referenced in prose only.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch3.l5',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 3,
  title: {
    ar: 'تنفيذ المصنفات التمييزية ومقارنتها',
    en: 'Implementing and Comparing the Discriminative Classifiers',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch3.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'بنتَ المصنفات الثلاثة كل واحد على حدة؛ السؤال الحقيقي: أيها أفضل على نفس البيانات؟ المقارنة النزيهة بروتوكول واحد: بيانات تثبيت واحدة، وثلاث دوال تدريب، ومقياس واحد هو الدقة — نسبة التنبؤات الصحيحة. في المثال ستقف الثلاثة على منصة واحدة وتظهر فروقاتها الحقيقية: واحدة تنجو من نقطة يفشل فيها الآخران. وفي النصوص سترى كيف يظهر الثلاثة في مكتبة sklearn التي يستعملها الكتاب في قسم التنفيذ.',
        en: 'You built the three classifiers one at a time; the real question is which performs best on the same data. A fair comparison needs one protocol: one pinned dataset, three training functions, one metric — accuracy, the fraction of correct predictions. In the worked example all three line up on the same stage and their true differences appear: one of them survives a point where the other two fail. The prose then shows how the three appear in scikit-learn, which the book uses in its implementation section.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'بروتوكول المقارنة والتنفيذ الحقيقي',
        en: 'The comparison protocol and real implementations',
      },
      chunks: [
        {
          ar: 'الدقة = عدد التنبؤات الصحيحة مقسومًا على عدد النقاط. قاعدة ذهبية: كل النماذج ترى نفس بيانات التدريب ونفس بيانات التقييم، وإلا فالمقارنة بلا معنى. في مثالنا: ثماني نقاط بعد واحد، تسمياتها تحوي نقطة شاذة (النقطة 3 بتسمية 1 وسط منطقة الصنف 0). النموذج الذي يرسم حدًا عند 4.5 يصيب 7 من 8؛ النموذج الذي انجرف خلف الشاذة يصيب 6 من 8. الفرق بين 0.875 و0.750 هو كلفة مطاردة نقطة واحدة.',
          en: 'Accuracy = correct predictions divided by points. Golden rule: every model sees the same training data and the same evaluation data, otherwise the comparison is meaningless. In our example: eight one-dimensional points whose labels include an outlier (point 3 carries label 1 deep inside class-0 territory). A model that draws its boundary at 4.5 gets 7 of 8 right; one that drifted after the outlier gets 6 of 8. The gap between 0.875 and 0.750 is the price of chasing one point.',
        },
        {
          ar: 'في التنفيذ الحقيقي لا نكتب الحلقات يدويًا: في sklearn يأتي اللوجستي من LogisticRegression حيث C نظمّية تقل زيادته عن قيد الأوزان وmax_iter سقف التكرارات، ويعطي .predict() أصنافًا و.predict_proba() احتمالات. البيرسبترون جاهز في Perceptron من sklearn.linear_model. والكتاب يجرب هذه الأصناف على مجموعة breast cancer للثنائي وwine للمتعدد، ويحصل على دقة تدريب 0.984 للوجستي الثنائي و1.0 للمتعدد. نذكر هذا كنص فقط — مكتباتنا الثلاث هنا تبقى بايث صافيًا.',
          en: 'In real work nobody writes these loops by hand: in scikit-learn logistic regression is LogisticRegression, where C is a regularization knob (higher C means weaker penalty on the weights) and max_iter caps the solver iterations; .predict() returns classes and .predict_proba() probabilities. The perceptron ships as Perceptron from sklearn.linear_model. The book runs these on the breast cancer set for binary and wine for multiclass, getting training accuracy 0.984 for binary logistic and 1.0 for multiclass. We mention this as prose only — our three implementations here stay pure Python.',
        },
        {
          ar: 'كيف تقرأ التقرير؟ لا تكتفِ بالدقة. اطبع تنبؤات كل نموذج وحدد النقاط المخطأ فيها بالضبط: هل يخطئ الجميع في نفس النقطة (فالخلل في البيانات لا في النموذج)، أم يخطئ كلٌّ في نقطة مختلفة (فالنماذج تنزع أطرافًا مختلفة)؟ في مثالنا يخطئ اللوجستي في نقطتين والبيرسبترون في نقطتين مختلفتين وفيشر في واحدة — والشاذة نفسها هي سبب كل الأخطاء. التقرير المطبوع أداة تشخيص قبل أن يكون لوحة نتائج.',
          en: 'How do you read the report? Do not stop at accuracy. Print each model predictions and pin down exactly which points each one missed: if everyone misses the same point, the data is at fault, not the models; if they miss different points, the models lean different ways. In our example logistic misses two points, the perceptron two different ones, Fisher one — and the same outlier underlies every miss. A printed report is a diagnostic tool before it is a scoreboard.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'ثلاثة نماذج، تقرير واحد',
        en: 'Three models, one report',
      },
      code: `import math

X = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
y = [0, 0, 1, 0, 1, 1, 1, 1]

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))

def fit_logistic(X, y, epochs=400, lr=0.5):
    w0, w1 = 0.0, 0.0
    n = len(X)
    for _ in range(epochs):
        g0 = sum(sigmoid(w0 + w1 * x) - t for x, t in zip(X, y)) / n
        g1 = sum((sigmoid(w0 + w1 * x) - t) * x for x, t in zip(X, y)) / n
        w0 -= lr * g0
        w1 -= lr * g1
    return w0, w1

def fit_perceptron(X, y, epochs=10):
    w0, w1 = 0.0, 0.0
    for _ in range(epochs):
        for x, t in zip(X, y):
            yhat = 1 if w0 + w1 * x >= 0 else 0
            if yhat != t:
                w0 += t - yhat
                w1 += (t - yhat) * x
    return w0, w1

def fisher_threshold(c0, c1):
    m0 = sum(c0) / len(c0)
    m1 = sum(c1) / len(c1)
    sw = sum((x - m0) ** 2 for x in c0) + sum((x - m1) ** 2 for x in c1)
    w = (m1 - m0) / sw
    p0 = [w * x for x in c0]
    p1 = [w * x for x in c1]
    return w, (sum(p0) / len(p0) + sum(p1) / len(p1)) / 2

wl0, wl1 = fit_logistic(X, y)
wp0, wp1 = fit_perceptron(X, y)
wf, tf = fisher_threshold([x for x, t in zip(X, y) if t == 0],
                          [x for x, t in zip(X, y) if t == 1])

preds_logistic = [1 if sigmoid(wl0 + wl1 * x) >= 0.5 else 0 for x in X]
preds_perceptron = [1 if wp0 + wp1 * x >= 0 else 0 for x in X]
preds_fisher = [1 if wf * x > tf else 0 for x in X]

def accuracy(preds):
    return sum(p == t for p, t in zip(preds, y)) / len(y)

print(f"logistic  : acc={accuracy(preds_logistic):.3f} preds={preds_logistic}")
print(f"perceptron: acc={accuracy(preds_perceptron):.3f} preds={preds_perceptron}")
print(f"fisher    : acc={accuracy(preds_fisher):.3f} preds={preds_fisher}")
print("logistic misses at x =", [x for x, p, t in zip(X, preds_logistic, y) if p != t])`,
      explanation: {
        ar: 'اللوجستي انجرف خلف الشاذة: خطّه انزلق إلى ما دون 4 فأصاب 0.750 وتنبأ 1 عند النقطتين 3.0 و4.0. البيرسبترون بعد عشر دورات على بيانات غير قابلة للفصل كاد يقسو: تنبؤاته تبدأ بالصنف 1 من النقطة 2 — نفس الدقة 0.750. أما فيشر فأنصف: مركزا الصنفين أبعداه عن الشاذة، فعتبته استقرت عند 4.5 ودقته 0.875. ثلاث خوارزميات، ثلاث قوائم تنبؤ مختلفة، ومقياس واحد يكشفها.',
        en: 'Logistic drifted after the outlier: its line slid below 4, giving 0.750 with wrong calls at x = 3.0 and 4.0. The perceptron after ten epochs on non-separable data did hardly better: its predictions turn to class 1 from point 2 on — the same 0.750. Fisher is the fairest of the three: the class centers keep it away from the outlier, its threshold settles at 4.5, and it scores 0.875. Three algorithms, three different prediction lists, one metric exposing them.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.accuracy-report',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اللوجستي هو الناقص في التقرير. نفّذ fit_logistic بمتوسط التدرج (epochs=400 وlr=0.5 افتراضيًا) ثم اترك أسطر التقرير الثلاثة كما هي لتظهر دقة النماذج الثلاثة معًا.',
        en: 'Logistic is the missing model in the report. Implement fit_logistic with the mean gradient (epochs=400 and lr=0.5 by default), then leave the three report lines unchanged so all three accuracies appear together.',
      },
      starterCode: `import math

X = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
y = [0, 0, 1, 0, 1, 1, 1, 1]

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))

def fit_logistic(X, y, epochs=400, lr=0.5):
    # TODO: full-batch MEAN gradient each epoch (g0, g1), one downhill step.
    return 0.0, 0.0

def fit_perceptron(X, y, epochs=10):
    w0, w1 = 0.0, 0.0
    for _ in range(epochs):
        for x, t in zip(X, y):
            yhat = 1 if w0 + w1 * x >= 0 else 0
            if yhat != t:
                w0 += t - yhat
                w1 += (t - yhat) * x
    return w0, w1

def fisher_threshold(c0, c1):
    m0 = sum(c0) / len(c0)
    m1 = sum(c1) / len(c1)
    sw = sum((x - m0) ** 2 for x in c0) + sum((x - m1) ** 2 for x in c1)
    w = (m1 - m0) / sw
    p0 = [w * x for x in c0]
    p1 = [w * x for x in c1]
    return w, (sum(p0) / len(p0) + sum(p1) / len(p1)) / 2

wl0, wl1 = fit_logistic(X, y)
wp0, wp1 = fit_perceptron(X, y)
wf, tf = fisher_threshold([x for x, t in zip(X, y) if t == 0],
                          [x for x, t in zip(X, y) if t == 1])
preds_logistic = [1 if sigmoid(wl0 + wl1 * x) >= 0.5 else 0 for x in X]
preds_perceptron = [1 if wp0 + wp1 * x >= 0 else 0 for x in X]
preds_fisher = [1 if wf * x > tf else 0 for x in X]

def accuracy(preds):
    return sum(p == t for p, t in zip(preds, y)) / len(y)

print("logistic preds:", preds_logistic)
print("perceptron preds:", preds_perceptron)
print("fisher preds:", preds_fisher)
print(f"accuracy logistic = {accuracy(preds_logistic)}")
print(f"accuracy perceptron = {accuracy(preds_perceptron)}")
print(f"accuracy fisher = {accuracy(preds_fisher)}")`,
      solution: `import math

X = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
y = [0, 0, 1, 0, 1, 1, 1, 1]

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))

def fit_logistic(X, y, epochs=400, lr=0.5):
    w0, w1 = 0.0, 0.0
    n = len(X)
    for _ in range(epochs):
        g0 = sum(sigmoid(w0 + w1 * x) - t for x, t in zip(X, y)) / n
        g1 = sum((sigmoid(w0 + w1 * x) - t) * x for x, t in zip(X, y)) / n
        w0 -= lr * g0
        w1 -= lr * g1
    return w0, w1

def fit_perceptron(X, y, epochs=10):
    w0, w1 = 0.0, 0.0
    for _ in range(epochs):
        for x, t in zip(X, y):
            yhat = 1 if w0 + w1 * x >= 0 else 0
            if yhat != t:
                w0 += t - yhat
                w1 += (t - yhat) * x
    return w0, w1

def fisher_threshold(c0, c1):
    m0 = sum(c0) / len(c0)
    m1 = sum(c1) / len(c1)
    sw = sum((x - m0) ** 2 for x in c0) + sum((x - m1) ** 2 for x in c1)
    w = (m1 - m0) / sw
    p0 = [w * x for x in c0]
    p1 = [w * x for x in c1]
    return w, (sum(p0) / len(p0) + sum(p1) / len(p1)) / 2

wl0, wl1 = fit_logistic(X, y)
wp0, wp1 = fit_perceptron(X, y)
wf, tf = fisher_threshold([x for x, t in zip(X, y) if t == 0],
                          [x for x, t in zip(X, y) if t == 1])
preds_logistic = [1 if sigmoid(wl0 + wl1 * x) >= 0.5 else 0 for x in X]
preds_perceptron = [1 if wp0 + wp1 * x >= 0 else 0 for x in X]
preds_fisher = [1 if wf * x > tf else 0 for x in X]

def accuracy(preds):
    return sum(p == t for p, t in zip(preds, y)) / len(y)

print("logistic preds:", preds_logistic)
print("perceptron preds:", preds_perceptron)
print("fisher preds:", preds_fisher)
print(f"accuracy logistic = {accuracy(preds_logistic)}")
print(f"accuracy perceptron = {accuracy(preds_perceptron)}")
print(f"accuracy fisher = {accuracy(preds_fisher)}")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'تنبؤات اللوجستي المتحقق منها', en: 'verified logistic predictions' },
          code: `wl = fit_logistic(X, y)\npreds = [1 if sigmoid(wl[0] + wl[1] * x) >= 0.5 else 0 for x in X]\nassert preds == [0, 0, 0, 1, 1, 1, 1, 1], 'expected [0, 0, 0, 1, 1, 1, 1, 1] | actual: %r' % (preds,)`,
        },
        {
          id: 't2',
          name: { ar: 'دقة اللوجستي في التقرير', en: 'logistic accuracy in the report' },
          code: `assert 'accuracy logistic = 0.75' in __learner_output__, 'expected line: accuracy logistic = 0.75 | actual: %r' % __learner_output__`,
        },
        {
          id: 't3',
          name: { ar: 'دقة فيشر في التقرير', en: 'fisher accuracy in the report' },
          code: `assert 'accuracy fisher = 0.875' in __learner_output__, 'expected line: accuracy fisher = 0.875 | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'بنية fit_logistic: حلقة على epochs، وفي كل دورة احسب g0 وg1 كمتوسطين على n ثم اطرح lr منهما من w0 وw1.', en: 'fit_logistic skeleton: loop over epochs; each epoch compute g0 and g1 as means over n, then subtract lr times them from w0 and w1.' },
        { ar: 'g0 = sum(sigmoid(w0 + w1 * x) - t for x, t in zip(X, y)) / n وg1 = sum((sigmoid(w0 + w1 * x) - t) * x ...) / n.', en: 'g0 = sum(sigmoid(w0 + w1 * x) - t for x, t in zip(X, y)) / n and g1 = sum((sigmoid(w0 + w1 * x) - t) * x ...) / n.' },
        { ar: 'القرار الاحتمالي: النقطة تصنف 1 إذا كانت sigmoid(wl0 + wl1*x) >= 0.5 — موجود في السطر الجاهز.', en: 'The probability decision: a point is class 1 when sigmoid(wl0 + wl1*x) >= 0.5 — already in the ready line.' },
        { ar: 'النتيجة المرجعية: [0, 0, 0, 1, 1, 1, 1, 1] بدقة 0.75، وفيشر 0.875.', en: 'Reference results: [0, 0, 0, 1, 1, 1, 1, 1] at 0.75 accuracy, Fisher at 0.875.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.which-stopped',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'البيرسبترون توقف عن التحديث في دورة ما لأنه صنّف كل نقاط التدريب صحيحة. ماذا نعرف عن المستقيم الذي انتهى عنده؟',
        en: 'The perceptron stopped updating in some epoch because it classified every training point correctly. What do we know about the line it ended on?',
      },
      options: [
        { id: 'a', text: { ar: 'إنه المستقيم الفاصل الأمثل بين الصنفين', en: 'it is the optimal separating line between the classes' } },
        { id: 'b', text: { ar: 'إنه مستقيم فاصل واحد من الممكنات، بلا ضمان أنه الأفضل', en: 'it is one separating line among the possible ones, with no guarantee of being the best' } },
        { id: 'c', text: { ar: 'إنه حتمًا نفس حدة اللوجستي', en: 'it must coincide with the logistic boundary' } },
        { id: 'd', text: { ar: 'لا شيء — لأن التوقف لا يعني تصنيف كل النقاط صحيحًا', en: 'nothing — stopping does not imply all points are classified correctly' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'قاعدة التحديث تتوقف عن الحركة أول ما يختفي الخطأ — لا توجد دالة هدف تُحسَّن بعد ذلك.', en: 'The update rule stops moving as soon as the error disappears — there is no objective function being optimized beyond that.' },
        { ar: 'تذكّر تمرين الدورة الرابعة: توقف الأخطاء يعني حرفيًا صفر مخالفات.', en: 'Recall the epoch-four exercise: mistakes stopping means literally zero disagreements.' },
        { ar: 'حدود اللوجستي تُشتق من خسارة ناعمة، وحد البيرسبترون من ترتيب وصول النقاط — لا سبب لاتفاقهما.', en: "The logistic boundary comes from a smooth loss; the perceptron's from the order points arrived in — no reason for them to agree." },
        { ar: 'الإجابة: أي مستقيم فاصل يكفي البيرسبترون، وهذا كثيرًا ما يترك أداء أضعف عند الحواف.', en: 'Answer: any separating line satisfies the perceptron, which often leaves weaker performance at the edges.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في مقارنة عادلة بين مصنفين، أي شرط لا يجوز كسره؟',
            en: 'In a fair comparison of two classifiers, which condition must never be broken?',
          },
          options: [
            { id: 'a', text: { ar: 'أن يتدرب كلاهما على نفس البيانات ويقيَّم على نفس البيانات', en: 'both train on the same data and are evaluated on the same data' } },
            { id: 'b', text: { ar: 'أن يكتب كلاهما بلغة البرمجة نفسها', en: 'both are written in the same programming language' } },
            { id: 'c', text: { ar: 'أن يستخدم كلاهما نفس معدل التعلم', en: 'both use the same learning rate' } },
            { id: 'd', text: { ar: 'أن ينجح كلاهما في كل نقاط التدريب', en: 'both succeed on every training point' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المقارنة تقيس الفرق بين الخوارزميات لا بين البيانات؛ لذلك تثبيت البيانات في الطرفين شرط أساسي، أما معدلات التعلم فقد تختلف بحق بين خوارزميتين.',
            en: 'The comparison measures the difference between algorithms, not between datasets; pinning the data on both sides is essential, while learning rates may legitimately differ between algorithms.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في تقرير مثالنا: لماذا فشل الثلاثة معًا في تصنيف النقطة 3.0 (تسميتها 1)؟',
            en: 'In our worked report: why did all three fail on point 3.0 (labeled 1)?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن معدل التعلم كبير جدًا', en: 'because the learning rate is too large' } },
            { id: 'b', text: { ar: 'لأنها نقطة شاذة: خطية بعيدة عن نمط تسميات الصنفين', en: 'because it is an outlier: a label pattern the linear boundary cannot honor' } },
            { id: 'c', text: { ar: 'لأن فيشر لا يدعم التسميات غير المتوازنة', en: 'because Fisher does not support unbalanced labels' } },
            { id: 'd', text: { ar: 'لأن عدد الدورات قليل', en: 'because the epoch count is too small' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حد قرار خطي واحد لا يمكنه أن يحضن نقطة معزولة في قلب الصنف الآخر دون تخريب البقية؛ عندما يخطئ كل النماذج في نفس النقطة فالشك أولًا في البيانات.',
            en: 'A single linear boundary cannot embrace one isolated point deep in the other class without wrecking the rest; when every model misses the same point, suspect the data first.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في sklearn، أي استدعاء يعطيك احتمالات الأصناف بدل الأصناف الصلبة في نموذج اللوجستي؟',
            en: 'In scikit-learn, which call gives you class probabilities instead of hard labels for a logistic model?',
          },
          options: [
            { id: 'a', text: { ar: '.predict()', en: '.predict()' } },
            { id: 'b', text: { ar: '.predict_proba()', en: '.predict_proba()' } },
            { id: 'c', text: { ar: '.fit()', en: '.fit()' } },
            { id: 'd', text: { ar: '.score()', en: '.score()' } },
          ],
          answer: 'b',
          explanation: {
            ar: '.predict() يعيد الصنف بعد العتبة، بينما .predict_proba() يعيد احتمال كل صنف قبل القرار — البيرسبترون لا يملك مكافئًا حقيقيًا لثانيهما.',
            en: '.predict() returns the class after the threshold, while .predict_proba() returns each class probability before the decision — the perceptron has no real equivalent of the latter.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'المقارنة العادلة: بيانات مثبتة واحدة، وثلاث دوال تدريب، ومقياس واحد — الدقة، مع طباعة تنبؤات كل نموذج لتشخيص الأخطاء.',
          en: 'Fair comparison: one pinned dataset, three training functions, one metric — accuracy — plus each model printed predictions for diagnosis.',
        },
        {
          ar: 'على بياناتنا: اللوجستي 0.750 والبيرسبترون 0.750 وفيشر 0.875 — الفارق كله كلفة نقطة شاذة واحدة.',
          en: 'On our data: logistic 0.750, perceptron 0.750, Fisher 0.875 — the entire gap is the price of one outlier.',
        },
        {
          ar: 'حين يخطئ كل النماذج في نفس النقطة، فالمشكلة في البيانات غالبًا لا في الخوارزمية — التقرير أداة تشخيص.',
          en: 'When every model misses the same point, the data is usually at fault, not the algorithm — the report is a diagnostic.',
        },
        {
          ar: 'في العمل الحقيقي: LogisticRegression (بوسيطي C وmax_iter) وPerceptron من sklearn — وذكرها هنا نص فقط دون تنفيذ.',
          en: 'In real work: LogisticRegression (with C and max_iter arguments) and Perceptron from sklearn — referenced here as prose only, never executed.',
        },
      ],
      reflectPrompt: {
        ar: 'لو أضفت نقطة تسميتها 1 عند x = 20 إلى بيانات المثال: أي النماذج الثلاثة تتوقع أن يتحسن أداؤه أكثر، ولماذا يجب أن تشك في أي تحسن كهذا؟',
        en: 'If a point labeled 1 at x = 20 were added to the example data: which of the three models do you expect to improve most, and why should you distrust any such improvement?',
      },
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch3.s5', pages: 'ص33-37 / pp.33-37' },
  ],
} satisfies Lesson;

export default lesson;
