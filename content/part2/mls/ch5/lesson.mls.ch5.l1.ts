/**
 * Lesson mls.ch5.l1 — أشجار الانحدار: أول سؤال وأفضل سؤال
 *   / Regression Trees: The First, Best Question
 * Book: MLS — Chapter 5 'Decision Trees', §5.1 Regression Trees (pp.54-65).
 * The book builds regression trees by splitting samples to purify the target;
 * we run an SSE-minimizing split scan pure-Python on one fixed 1-D dataset.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch5.l1',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 5,
  title: {
    ar: 'أشجار الانحدار: أول سؤال وأفضل سؤال',
    en: 'Regression Trees: The First, Best Question',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch4.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'النماذج التي بنيتَها حتى الآن تعطي كل نقطة المعاملة نفسها: معادلة واحدة تطبق على الجميع. شجرة القرار تعمل بالعكس: تسأل كل نقطة سؤالًا نعم/لا عن قيمتها، وتوجّهها يسارًا أو يمينًا حسب الجواب. هنا نتعلم كيف تُختار أفضل سؤال أول: نمسح كل العتبات الممكنة على بيانات ثابتة صغيرة ونترك مجموع مربعات الخطأ يقرر — بالحساب لا بالحدس.',
        en: 'Every model you have built so far treats all points alike: one equation applied to everyone. A decision tree works the other way: it asks each point a yes/no question about its value and routes it left or right by the answer. Here you learn how the first, best question is chosen: we scan every possible threshold on a small fixed dataset and let the sum of squared errors decide — by arithmetic, not intuition.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'من السؤال إلى الورقة: تشريح شجرة الانحدار',
        en: 'From question to leaf: the anatomy of a regression tree',
      },
      chunks: [
        {
          ar: 'الشجرة سلسلة أسئلة ثنائية. كل عقدة داخلية تسأل: هل x ≤ t؟ فتنقسم البيانات إلى طفل أيسر (الجواب نعم) وطفل أيمن (الجواب لا). الأوراق في قاع الشجرة لا تسأل شيئًا؛ تنبّت بالمتوسط — متوسط قيم y لنقاط التدريب التي وقعت فيها. التنبؤ لنقطة جديدة يعني النزول من الجذر: عند كل عقدة نقارن x بالعتبة ونمضي يمينًا أو يسارًا حتى ورقة. هذه البساطة هي سر قابلية التفسير: تستطيع قراءة الشجرة كقائمة قواعد صريحة.',
          en: 'A tree is a chain of binary questions. Each internal node asks: is x <= t? and splits the data into a left child (yes) and a right child (no). Leaves at the bottom ask nothing; they answer with a mean — the average y of the training points that landed there. Predicting a new point means descending from the root: at each node compare x with the threshold and go left or right until a leaf. This simplicity is why trees are so interpretable: you can read one as an explicit list of rules.',
        },
        {
          ar: 'كيف نختار العتبة t؟ في الانحدار نقاء الطفل يعني تجانس قيمه: مجموع مربعات الخطأ (SSE) حول متوسط الورقة. انقسام جيد يجعل SSE الطفلين مجتمعين أصغر بكثير من SSE الأب. المرشحون الطبيعيون للعتبات هم منتصفات المسافات بين قيم x المتجاورة بعد الترتيب — لا نقطة مراقبة تسكن بين قيمتين متتاليتين، فلا معنى لعتبة بينهما. نمسح كل المرشحين ونأخذ العتبة ذات أصغر مجموع: SSE أيسر + SSE أيمن.',
          en: 'How is the threshold t chosen? In regression, a child is pure when its target values are homogeneous: the sum of squared errors (SSE) around the leaf mean. A good split makes the two children combined SSE far smaller than the parent SSE. The natural threshold candidates are the midpoints between consecutive sorted x values — no observed point lives between two consecutive values, so a threshold there would change nothing. We scan every candidate and keep the one with the smallest total: left SSE plus right SSE.',
        },
        {
          ar: 'في الكتاب: شجرة تصنيف على بيانات البطاريق تبدأ بالسؤال «هل طول الزعنفة ≤ 206.5 ملم؟» ثم تكرر العملية في كل طفل — البنية نفسها التي نبنيها هنا للانحدار. وتحذير الكتاب مهم: الأشجار المفردة قابلة للتفسير لكنها تعاني في الدقة والمتانة؛ فهي حساسة لأي تغيير في بيانات التدريب. هذا الهشاشة هو موضوع الفصل السادس كله: لماذا تجتمع عدة أشجار متوسطة في نموذج واحد أقوى.',
          en: 'In the book: a classification tree on the penguins data opens with the question "is flipper length <= 206.5 mm?" and then repeats the process in each child — the same structure we build here for regression. The book warning matters too: single trees are interpretable but suffer in precision and robustness; they are sensitive to any change in the training data. That fragility is the entire subject of chapter 6: why several mediocre trees combine into one stronger model.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'مسح العتبات على ثماني نقاط',
        en: 'Scanning thresholds on eight points',
      },
      code: `def sse(ys):
    if not ys:
        return 0.0
    m = sum(ys) / len(ys)
    return sum((y - m) ** 2 for y in ys)

def thresholds_for(xs):
    sx = sorted(set(xs))
    return [(a + b) / 2 for a, b in zip(sx, sx[1:])]

xs = [1, 2, 3, 4, 5, 6, 7, 8]
ys = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]

print("parent SSE =", sse(ys))
best_t, best_sse = None, None
for t in thresholds_for(xs):
    left = [y for x, y in zip(xs, ys) if x <= t]
    right = [y for x, y in zip(xs, ys) if x > t]
    total = sse(left) + sse(right)
    if best_sse is None or total < best_sse:
        best_t, best_sse = t, total
    print(f"t={t}: left={sse(left):.4f} right={sse(right):.4f} total={total:.4f}")

print("best split: t =", best_t, " sse =", best_sse)
lm = sum(y for x, y in zip(xs, ys) if x <= best_t) / 4
rm = sum(y for x, y in zip(xs, ys) if x > best_t) / 4
print("leaf means: left =", lm, " right =", rm)
stump = [lm if x <= best_t else rm for x in xs]
mse = sum((p - y) ** 2 for p, y in zip(stump, ys)) / len(ys)
print("stump train MSE =", mse)`,
      explanation: {
        ar: 'اقرأ الجدول من الأعلى للأسفل: عند العتبة 1.5 يبقى الطفل الأيسر بنقطة واحدة نقية (SSE صفر) لكن الأيمن يحتشد بسبع نقاط متفاوتة (41.7143). كلما اقتربنا من المنتصف انخفض المجموع حتى بلغ أدنى قيمة 2.0 عند t=4.5: اليسار [1,1,2,2] حول متوسطه 1.5 واليمين [6,6,7,7] حول 6.5، وكل منهما SSE = 1.0. بعدها يرتفع المجموع تناظريًا. الجذع الناتج (شجرة بعمق واحد) يتنبأ 1.5 لـ x ≤ 4.5 و6.5 لما بعده، بخطأ تربيعي متوسط 0.25 على التدريب مقابل 6.5 لخط الأساس — سؤال واحد قصّ الخطأ إلى جزء من واحد وعشرين.',
        en: 'Read the table top down: at threshold 1.5 the left child holds one pure point (SSE zero) but the right crowds seven mixed points (41.7143). As the threshold moves toward the middle the total falls until it bottoms out at 2.0 for t=4.5: the left [1,1,2,2] around its mean 1.5 and the right [6,6,7,7] around 6.5, each with SSE = 1.0. After that the total rises symmetrically. The resulting stump (a depth-1 tree) predicts 1.5 for x <= 4.5 and 6.5 beyond, with training MSE 0.25 versus 6.5 for the mean baseline — one question cut the error to a twenty-first of it.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.find-best-split',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل best_split(xs, ys) لتعيد زوجًا (أفضل_عتبة، أصغر_SSE) بمسح منتصفات القيم المتجاورة كما في المثال. المطلوب أن تعيد (4.5, 2.0) على بيانات الدرس و(2.5, 0.0) على نقاط الطفل الأيسر.',
        en: 'Complete best_split(xs, ys) to return the pair (best_threshold, min_sse) by scanning midpoints of consecutive values as in the example. It must return (4.5, 2.0) on the lesson data and (2.5, 0.0) on the left-child points.',
      },
      starterCode: `def sse(ys):
    if not ys:
        return 0.0
    m = sum(ys) / len(ys)
    return sum((y - m) ** 2 for y in ys)

def thresholds_for(xs):
    sx = sorted(set(xs))
    return [(a + b) / 2 for a, b in zip(sx, sx[1:])]

def best_split(xs, ys):
    # TODO: scan every threshold, track the smallest left+right SSE
    return None, None

xs = [1, 2, 3, 4, 5, 6, 7, 8]
ys = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
t, s = best_split(xs, ys)
print("best split: t =", t, " sse =", s)`,
      solution: `def sse(ys):
    if not ys:
        return 0.0
    m = sum(ys) / len(ys)
    return sum((y - m) ** 2 for y in ys)

def thresholds_for(xs):
    sx = sorted(set(xs))
    return [(a + b) / 2 for a, b in zip(sx, sx[1:])]

def best_split(xs, ys):
    best_t, best_sse = None, None
    for t in thresholds_for(xs):
        left = [y for x, y in zip(xs, ys) if x <= t]
        right = [y for x, y in zip(xs, ys) if x > t]
        total = sse(left) + sse(right)
        if best_sse is None or total < best_sse:
            best_t, best_sse = t, total
    return best_t, best_sse

xs = [1, 2, 3, 4, 5, 6, 7, 8]
ys = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
t, s = best_split(xs, ys)
print("best split: t =", t, " sse =", s)`,
      tests: [
        {
          id: 't1',
          name: { ar: 'أفضل انقسام على بيانات الدرس', en: 'best split on the lesson data' },
          code: `xs = [1, 2, 3, 4, 5, 6, 7, 8]\nys = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]\nt, s = best_split(xs, ys)\nassert t == 4.5, 'expected threshold 4.5 | actual: %r' % t\nassert abs(s - 2.0) < 1e-9, 'expected SSE 2.0 | actual: %r' % s`,
        },
        {
          id: 't2',
          name: { ar: 'أطفال الجذع عند العتبة المثلى', en: 'the stump children at the optimal threshold' },
          code: `xs = [1, 2, 3, 4, 5, 6, 7, 8]\nys = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]\nleft = [y for x, y in zip(xs, ys) if x <= 4.5]\nright = [y for x, y in zip(xs, ys) if x > 4.5]\nassert abs(sse(left) - 1.0) < 1e-9, 'expected left SSE 1.0 | actual: %r' % sse(left)\nassert abs(sse(right) - 1.0) < 1e-9, 'expected right SSE 1.0 | actual: %r' % sse(right)`,
        },
        {
          id: 't3',
          name: { ar: 'انقسام الطفل الأيسر يكون نقيًا', en: 'the left child splits to pure leaves' },
          code: `t, s = best_split([1, 2, 3, 4], [1.0, 1.0, 2.0, 2.0])\nassert t == 2.5, 'expected threshold 2.5 | actual: %r' % t\nassert abs(s - 0.0) < 1e-9, 'expected SSE 0.0 | actual: %r' % s`,
        },
      ],
      hints: [
        { ar: 'ابدأ من قالب المثال حرفيًا: حلقة على thresholds_for(xs) وداخلها احسب left وright والمجموع.', en: 'Start from the worked template verbatim: loop over thresholds_for(xs), and inside compute left, right, and the total.' },
        { ar: 'احتفظ بأفضل زمن رأيته: إذا كان best_sse ما زال None أو كان total أصغر، خزّن (t, total).', en: 'Track the best seen so far: if best_sse is still None or total is smaller, store (t, total).' },
        { ar: 'على بيانات الدرس t=4.5 يعطي يسرًا [1,1,2,2] وأيمن [6,6,7,7] بـ SSE = 1.0 لكل طرف.', en: 'On the lesson data t=4.5 gives left [1,1,2,2] and right [6,6,7,7] with SSE = 1.0 on each side.' },
        { ar: 'المخرج المطلوب: best split: t = 4.5  sse = 2.0.', en: 'Expected output: best split: t = 4.5  sse = 2.0.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.left-leaf-value',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'الجذع الفائز ينقسم عند t=4.5. ما قيمة y التي تصدرها ورقته اليسرى (أي تنبؤ الجذع لأي x ≤ 4.5)؟ اكتب الرقم.',
        en: 'The winning stump splits at t=4.5. What y value does its left leaf emit (the stump prediction for any x <= 4.5)? Enter the number.',
      },
      answer: '1.5',
      tolerance: 1e-9,
      solution: '1.5',
      hints: [
        { ar: 'الورقة تتنبأ بمتوسط قيم y التي وقعت في حيزها.', en: 'A leaf predicts the mean of the y values that fell into its region.' },
        { ar: 'الجهة اليسرى تحوي النقاط x = 1, 2, 3, 4 بقيم [1, 1, 2, 2].', en: 'The left side holds the points x = 1, 2, 3, 4 with values [1, 1, 2, 2].' },
        { ar: 'المجموع 6 على أربع نقاط.', en: 'The sum is 6 over four points.' },
        { ar: 'الإجابة: 6 ÷ 4 = 1.5.', en: 'Answer: 6 / 4 = 1.5.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا تخزّن ورقة شجرة الانحدار؟',
            en: 'What does a regression tree leaf store?',
          },
          options: [
            { id: 'a', text: { ar: 'معدل الخطأ في تلك المنطقة', en: 'the error rate of that region' } },
            { id: 'b', text: { ar: 'متوسط قيم y لنقاط التدريب التي وقعت فيها', en: 'the mean y of the training points that landed in it' } },
            { id: 'c', text: { ar: 'معادلة الانحدار الخطي الموجبة على المنطقة', en: 'a linear regression equation fitted on the region' } },
            { id: 'd', text: { ar: 'العتبة التي أوصلت النقاط إليها', en: 'the threshold that routed points into it' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الأوراق لا تسأل أسئلة؛ تجيب بالمتوسط: متوسط قيم الهدف لنقاط التدريب داخل المنطقة التي تحرسها الورقة.',
            en: 'Leaves ask no questions; they answer with a mean: the average target value of the training points inside the region the leaf guards.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا نرشّح منتصفات المسافات بين قيم x المتجاورة كعتبات فقط؟',
            en: 'Why are only midpoints between consecutive x values considered as thresholds?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن أي عتبة بين قيمتين متتاليتين تنتج نفس الانقسام تمامًا، فلا فائدة من فحص أكثر منها', en: 'any threshold between two consecutive values yields exactly the same split, so scanning more of them adds nothing' } },
            { id: 'b', text: { ar: 'لأن العتبات الأخرى تجعل الحساب غير محدد النتيجة', en: 'because other thresholds make the computation non-deterministic' } },
            { id: 'c', text: { ar: 'لأن الانقسام يجب أن يكون عند نقطة تدريب فعلية', en: 'because the split must sit exactly on a training point' } },
            { id: 'd', text: { ar: 'لأن عدد العتبات المسموح به محدود بعدد الأوراق', en: 'because the number of allowed thresholds is capped by the leaf count' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قاعدة الانقسام x ≤ t لا ترى إلا ترتيب النقاط؛ تحريك العتبة داخل فجوة بين قيمتين لا ينقل أي نقطة من طرف لآخر، فيبقى الانقسام مطابقًا — وكل فجوة يمثلها منتصفها.',
            en: 'The rule x <= t only sees the ordering of points; moving the threshold inside a gap between two values moves no point across, so the split stays identical — each gap is represented by its midpoint.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في مسحنا فاز t=4.5 بمجموع SSE = 2.0. ماذا كان مجموع SSE عند t=2.5؟',
            en: 'In our scan t=4.5 won with total SSE = 2.0. What was the total SSE at t=2.5?',
          },
          options: [
            { id: 'a', text: { ar: '2.0 أيضًا — التعادل محتمل', en: '2.0 as well — ties are possible' } },
            { id: 'b', text: { ar: '0.0 لأن الأيسر صار نقيًا', en: '0.0 because the left side became pure' } },
            { id: 'c', text: { ar: '28.0 — الأيمن يحتشد بست نقاط متفاوتة', en: '28.0 — the right side crowds six mixed points' } },
            { id: 'd', text: { ar: '52.0 مثل الأب', en: '52.0, same as the parent' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'عند t=2.5 يبقى اليسار نقيًا بـ SSE صفر، لكن اليمين يجمع [2,6,6,7,7,2] حول متوسط 5.0 فيمنح SSE = 28.0؛ المجموع 28.0 مقابل 2.0 للعتبة الفائزة.',
            en: 'At t=2.5 the left stays pure with zero SSE, but the right gathers [2,6,6,7,7,2] around mean 5.0 giving SSE = 28.0; the total is 28.0 versus 2.0 for the winning threshold.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'شجرة الانحدار تسأل أسئلة x ≤ t وتجيب بالمتوسطات: العقد تقسّم والأوراق تتنبأ.',
          en: 'A regression tree asks x <= t questions and answers with means: nodes split, leaves predict.',
        },
        {
          ar: 'جودة الانقسام في الانحدار تقاس بـ SSE: اختر العتبة التي تصغّر مجموع SSE الطفلين (فازت 4.5 بمجموع 2.0 هنا).',
          en: 'Split quality in regression is measured by SSE: pick the threshold minimizing the children combined SSE (4.5 won with total 2.0 here).',
        },
        {
          ar: 'مرشحو العتبات هم منتصفات الفجوات بين قيم x المتتالية فقط — ما بينهما لا يغير شيئًا.',
          en: 'Threshold candidates are only the midpoints of gaps between consecutive x values — anything between changes nothing.',
        },
        {
          ar: 'جذع واحد خفّض MSE من 6.5 إلى 0.25، لكن الكتاب يحذّر: الأشجار المفردة هشّة — والفصل القادم يعالج ذلك بالتجميع.',
          en: 'One stump cut MSE from 6.5 to 0.25, but the book warns: single trees are fragile — the next chapter fixes that with ensembles.',
        },
      ],
      reflectPrompt: {
        ar: 'لو استبدلت القيمتين 6.0 و7.0 في اليمين بـ 6.0 و100.0، فهل يبقى الفائز t=4.5؟ أعد المسح حسابيًا واشرح أثر القيم المتطرفة على اختيار العتبة.',
        en: 'If you replaced the right-side 6.0 and 7.0 with 6.0 and 100.0, would t=4.5 still win? Re-run the scan numerically and explain how extreme values steer threshold choice.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch5.s1', pages: 'ص54-65 / pp.54-65' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch5.s1', pages: 'ص54-65 / pp.54-65' },
  ],
} satisfies Lesson;

export default lesson;
