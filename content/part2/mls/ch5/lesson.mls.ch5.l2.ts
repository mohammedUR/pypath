/**
 * Lesson mls.ch5.l2 — أشجار التصنيف: نقاء معامل جيني
 *   / Classification Trees: Gini Purity
 * Book: MLS — Chapter 5 'Decision Trees', §5.2 Classification Trees (pp.54-65).
 * The book grows classification trees by splitting on label purity (penguins);
 * we run a Gini-minimizing split scan pure-Python on one fixed labeled set.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch5.l2',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 5,
  title: {
    ar: 'أشجار التصنيف: نقاء معامل جيني',
    en: 'Classification Trees: Gini Purity',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch5.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في درس الانحدار قِسنا جودة الانقسام بمدى تجانس الأرقام. لكن ماذا لو كانت الأهداف صفوفًا لا أرقامًا: بريء/مريب، صنف أ/صنف ب؟ لا معنى لمتوسط الصفوف — نحتاج مقياس نقاء يعمل على العدّات. معامل جيني هو ذلك المقياس، وفي هذا الدرس نمسح به كل العتبات على مجموعة موسومة ثابتة ونرى أين يصير الطفلان أنقى من الأب.',
        en: 'In the regression lesson we measured split quality by how homogeneous the numbers are. But what if the targets are classes, not numbers: spam/ham, species A/species B? Averaging classes is meaningless — we need a purity measure that works on counts. The Gini index is that measure, and in this lesson we use it to scan every threshold on one fixed labeled set and watch where both children become purer than the parent.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'جيني: مقياس النقاء الذي يفهم الصفوف',
        en: 'Gini: the purity measure that understands classes',
      },
      chunks: [
        {
          ar: 'عقدة تصنيف تُوصف بتركيبتها: نسبة كل صف فيها. معامل جيني يلخّصها بسطر واحد: G = 1 − Σ p_k²، حيث p_k نسبة الصف k. عقدة نقية (صف واحد فقط) تعطي G = 0، وعقدة ثنائية متوازنة 50/50 تعطي G = 0.5 — أسوأ حال ممكنة لعقدة ثنائية. ورقة الشجرة تتنبأ بالصف الأغلب في منطقتها، فكلما نقا العقدة قلّ احتمال الخطأ عند التنبؤ.',
          en: 'A classification node is described by its composition: the share of each class. The Gini index compresses it into one line: G = 1 - sum of p_k squared, where p_k is the share of class k. A pure node (a single class) scores G = 0, and a balanced binary node 50/50 scores G = 0.5 — the worst case for two classes. A leaf predicts the majority class of its region, so the purer the node, the lower the chance of a wrong prediction.',
        },
        {
          ar: 'انقسام جيد يجعل متوسط جيني الطفلين، موزونًا بحجميهما، أصغر ما يمكن:weighted = (nL·G_L + nR·G_R) / n. نستخدم مسح العتبات نفسه من درس الانحدار حرفيًا — منتصفات الفجوات بين القيم المتتالية — لكن المعيار تغيّر من SSE إلى جيني الموزون. في الكتاب: شجرة البطاريق تفتح بسؤال «طول الزعنفة ≤ 206.5؟» فوق 333 نقطة (146 Adelie و68 Gentoo و119 Chinstrap) لأن هذا الانقسام أنقص جينيًا بين كل ما فُحص.',
          en: 'A good split makes the size-weighted average of the children Gini as small as possible: weighted = (nL*G_L + nR*G_R) / n. We reuse the threshold scan from the regression lesson verbatim — midpoints of gaps between consecutive values — but the criterion switches from SSE to weighted Gini. In the book: the penguins tree opens with "flipper length <= 206.5?" over 333 points (146 Adelie, 68 Gentoo, 119 Chinstrap) because that split had the lowest Gini among everything examined.',
        },
        {
          ar: 'انتبه لفارق دقيق: انخفاض جيني الموزون لا يضمن صفر أخطاء. عقدة فيها 3 من صف و1 من آخر أكثر نقاءً من 2/2 لكنها ما زالت تخطئ في التنبؤ بالأغلب ربع المرات. لهذا نقيس الشجرة بعد بنائها بدقة التصنيف — نسبة التنبؤات الصحيحة — ونقرأ أين أخطأت، لا الرقم وحده.',
          en: 'Note one subtlety: a lower weighted Gini does not guarantee zero errors. A node holding 3 of one class and 1 of another is purer than a 2/2 node but still mispredicts the majority a quarter of the time. That is why we measure the finished tree with classification accuracy — the share of correct predictions — and read where it errs, not just the single number.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'مسح جيني على ست نقاط موسومة',
        en: 'A Gini scan over six labeled points',
      },
      code: `def gini(labels):
    n = len(labels)
    if n == 0:
        return 0.0
    p1 = labels.count(1) / n
    p0 = labels.count(0) / n
    return 1.0 - p0 ** 2 - p1 ** 2

def thresholds_for(xs):
    sx = sorted(set(xs))
    return [(a + b) / 2 for a, b in zip(sx, sx[1:])]

xs = [1, 2, 3, 4, 5, 6]
ys = [0, 0, 1, 1, 0, 1]
n = len(ys)
print("parent gini =", gini(ys))

best_t, best_g = None, None
for t in thresholds_for(xs):
    left = [y for x, y in zip(xs, ys) if x <= t]
    right = [y for x, y in zip(xs, ys) if x > t]
    wg = (len(left) * gini(left) + len(right) * gini(right)) / n
    if best_g is None or wg < best_g:
        best_t, best_g = t, wg
    print(f"t={t}: gL={gini(left):.4f} gR={gini(right):.4f} weighted={wg:.4f}")

print("best split: t =", best_t, " weighted_gini =", best_g)
stump = [0 if x <= best_t else 1 for x in xs]
acc = sum(p == y for p, y in zip(stump, ys)) / n
errs = [x for x, p, y in zip(xs, stump, ys) if p != y]
print("stump preds =", stump)
print("accuracy =", round(acc, 4), " errors at x =", errs)`,
      explanation: {
        ar: 'الأب فيه ثلاث أصفار وثلاث آحاد فجينيه 0.5 — التماثل الكامل. عند t=2.5 يصير اليسار [0,0] نقيًا تمامًا واليمين [1,1,0,1] بنسبة 3/4 فجينيه 0.375، والموزون (2·0 + 4·0.375)/6 = 0.25 — أدنى قيمة في الجدول. لاحظ أن t=3.5 و4.5 أسوأ رغم قربها من «منتصف» الصفوف: الانقسام الجيد يعزل الصفوف لا أن يوازنها هندسيًا. الجذع الفائز يتنبأ 1 لكل x > 2.5 فيخطئ عند x=5 فقط (تسميته 0 بين آحاد الورقة اليمنى) بدقة 5/6 ≈ 0.8333.',
        en: 'The parent holds three zeros and three ones so its Gini is 0.5 — perfect symmetry. At t=2.5 the left [0,0] becomes entirely pure and the right [1,1,0,1] sits at 3/4 giving Gini 0.375, so the weighted score is (2*0 + 4*0.375)/6 = 0.25 — the lowest in the table. Notice t=3.5 and t=4.5 do worse despite sitting near the geometric middle of the classes: a good split isolates classes, it does not balance them spatially. The winning stump predicts 1 for every x > 2.5 and errs only at x=5 (labeled 0 inside the right leaf majority), for accuracy 5/6 = 0.8333.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.gini-best-split',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل gini(labels) وbest_gini_split(xs, ys) لتعيدا (أفضل_عتبة، أقل_جيني_موزون). المطلوب: gini([0,0,1,1]) = 0.5، وأفضل انقسام على بيانات الدرس هو (2.5, 0.25)، وجيني الموزون عند t=3.5 يساوي 4/9.',
        en: 'Complete gini(labels) and best_gini_split(xs, ys) returning (best_threshold, min_weighted_gini). Required: gini([0,0,1,1]) = 0.5, the best split on the lesson data is (2.5, 0.25), and the weighted Gini at t=3.5 equals 4/9.',
      },
      starterCode: `def gini(labels):
    # TODO: 1 - p0^2 - p1^2 over the labels
    return 0.0

def thresholds_for(xs):
    sx = sorted(set(xs))
    return [(a + b) / 2 for a, b in zip(sx, sx[1:])]

def best_gini_split(xs, ys):
    # TODO: scan thresholds, weight each child's gini by its size
    return None, None

xs = [1, 2, 3, 4, 5, 6]
ys = [0, 0, 1, 1, 0, 1]
t, g = best_gini_split(xs, ys)
print("best split: t =", t, " weighted_gini =", g)`,
      solution: `def gini(labels):
    n = len(labels)
    if n == 0:
        return 0.0
    p1 = labels.count(1) / n
    p0 = labels.count(0) / n
    return 1.0 - p0 ** 2 - p1 ** 2

def thresholds_for(xs):
    sx = sorted(set(xs))
    return [(a + b) / 2 for a, b in zip(sx, sx[1:])]

def best_gini_split(xs, ys):
    best_t, best_g = None, None
    n = len(ys)
    for t in thresholds_for(xs):
        left = [y for x, y in zip(xs, ys) if x <= t]
        right = [y for x, y in zip(xs, ys) if x > t]
        wg = (len(left) * gini(left) + len(right) * gini(right)) / n
        if best_g is None or wg < best_g:
            best_t, best_g = t, wg
    return best_t, best_g

xs = [1, 2, 3, 4, 5, 6]
ys = [0, 0, 1, 1, 0, 1]
t, g = best_gini_split(xs, ys)
print("best split: t =", t, " weighted_gini =", g)`,
      tests: [
        {
          id: 't1',
          name: { ar: 'جيني لعقدة متوازنة ونقية', en: 'gini of a balanced and a pure node' },
          code: `assert abs(gini([0, 0, 1, 1]) - 0.5) < 1e-9, 'expected 0.5 | actual: %r' % gini([0, 0, 1, 1])\nassert abs(gini([1, 1, 1]) - 0.0) < 1e-9, 'expected 0.0 | actual: %r' % gini([1, 1, 1])`,
        },
        {
          id: 't2',
          name: { ar: 'أفضل انقسام على بيانات الدرس', en: 'best split on the lesson data' },
          code: `xs = [1, 2, 3, 4, 5, 6]\nys = [0, 0, 1, 1, 0, 1]\nt, g = best_gini_split(xs, ys)\nassert t == 2.5, 'expected threshold 2.5 | actual: %r' % t\nassert abs(g - 0.25) < 1e-9, 'expected 0.25 | actual: %r' % g`,
        },
        {
          id: 't3',
          name: { ar: 'الجيني الموزون عند 3.5', en: 'weighted gini at 3.5' },
          code: `xs = [1, 2, 3, 4, 5, 6]\nys = [0, 0, 1, 1, 0, 1]\nleft = [y for x, y in zip(xs, ys) if x <= 3.5]\nright = [y for x, y in zip(xs, ys) if x > 3.5]\nwg = (len(left) * gini(left) + len(right) * gini(right)) / 6\nassert abs(wg - 4 / 9) < 1e-9, 'expected 4/9 | actual: %r' % wg`,
        },
      ],
      hints: [
        { ar: 'gini عدّات فقط: p0 = عدّ الأصف / الطول، p1 = عدّ الآحاد / الطول، ثم 1 − p0² − p1².', en: 'gini is pure counting: p0 = zeros / length, p1 = ones / length, then 1 - p0**2 - p1**2.' },
        { ar: 'في best_gini_split وزّن كل طفل بحجمه: (nL·G_L + nR·G_R) / n — لا تنسَ القسمة على الطول الكلي.', en: 'In best_gini_split weight each child by its size: (nL*G_L + nR*G_R) / n — do not forget the division by the total length.' },
        { ar: 'تتبّع الأفضل كما في درس الانحدار: خزّن أول زوج، ثم استبدله فقط عند أنقص موزون.', en: 'Track the best as in the regression lesson: store the first pair, then replace it only on a strictly lower weighted score.' },
        { ar: 'المخرج المطلوب: best split: t = 2.5  weighted_gini = 0.25.', en: 'Expected output: best split: t = 2.5  weighted_gini = 0.25.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.why-stump-errs',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'الجذع الفائز يتنبأ 1 لكل x > 2.5، ومع ذلك يخطئ في x=5 الموسومة 0. لماذا لم ينتقِ مسح جيني عتبةً تخطئ في لا شيء؟',
        en: 'The winning stump predicts 1 for every x > 2.5, yet it misses x=5 which is labeled 0. Why did the Gini scan not find a threshold with zero errors?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن جيني لا يناسب البيانات الثنائية ويلزم استخدام الدقة مباشرة', en: 'because Gini does not suit binary data and accuracy should be used directly' } },
        { id: 'b', text: { ar: 'لأن x=5 (صنف 0) تسكن بين x=3 وx=4 (صنف 1): أي عتبة تعزلها ستضع x=1 أو x=2 في الجهة الخطأ — لا يوجد انقسام واحد نقي تمامًا', en: 'because x=5 (class 0) sits between x=3 and x=4 (class 1): any threshold isolating it would push x=1 or x=2 to the wrong side — no single split is perfectly pure' } },
        { id: 'c', text: { ar: 'لأن المسح توقف عند 2.5 قبل فحص العتبات الأكبر', en: 'because the scan stopped at 2.5 before examining larger thresholds' } },
        { id: 'd', text: { ar: 'لأن الأوزان الموزونة تعاقب الصف الأقل عددًا', en: 'because the size weighting penalizes the minority class' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'الترتيب على المحور: x=1 (0)، x=2 (0)، x=3 (1)، x=4 (1)، x=5 (0)، x=6 (1).', en: 'The axis order: x=1 (0), x=2 (0), x=3 (1), x=4 (1), x=5 (0), x=6 (1).' },
        { ar: 'الانقسام الواحد يقطع المحور شطرين متتاليين فقط — لا يستطيع عزل جزيرة وسط صف آخر.', en: 'A single split cuts the axis into two consecutive pieces only — it cannot isolate an island inside another class.' },
        { ar: 'جرب يدويًا: أي عتبة تجعل x=5 وحدها في طرف؟ ماذا يحدث لـ x=1 أو x=2 حينها؟', en: 'Try by hand: which threshold would leave x=5 alone on one side? What happens to x=1 or x=2 then?' },
        { ar: 'الإجابة: b — العيب في عائلة الانقسامات نفسها لا في المقياس؛ هذا هو «الانحياز» الذي سيعالجه التعزيز في الفصل السادس.', en: 'Answer: b — the flaw is in the split family, not the criterion; this is the bias that boosting will attack in chapter 6.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عقدة تحوي 3 نقاط من الصنف 0 ونقطة واحدة من الصنف 1. كم يساوي معامل جيني لها؟',
            en: 'A node holds 3 points of class 0 and 1 point of class 1. What is its Gini index?',
          },
          options: [
            { id: 'a', text: { ar: '0.0', en: '0.0' } },
            { id: 'b', text: { ar: '0.25', en: '0.25' } },
            { id: 'c', text: { ar: '0.375', en: '0.375' } },
            { id: 'd', text: { ar: '0.5', en: '0.5' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'G = 1 − (3/4)² − (1/4)² = 1 − 0.5625 − 0.0625 = 0.375. العقدة غير نقية لكنها أنقى من 2/2 التي تعطي 0.5.',
            en: 'G = 1 - (3/4)^2 - (1/4)^2 = 1 - 0.5625 - 0.0625 = 0.375. The node is impure yet purer than a 2/2 node which scores 0.5.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الذي تغيّر بين درس الانحدار ودرس التصنيف في مسح العتبات؟',
            en: 'What changed between the regression and classification lessons in the threshold scan?',
          },
          options: [
            { id: 'a', text: { ar: 'شيء — نفس المعيار تمامًا', en: 'nothing — exactly the same criterion' } },
            { id: 'b', text: { ar: 'المرشحون صاروا قيم x نفسها بدل منتصفاتها', en: 'candidates became the raw x values instead of their midpoints' } },
            { id: 'c', text: { ar: 'المعيار صار جيني موزون بحجمي الطفلين بدل مجموع SSE', en: 'the criterion became size-weighted Gini of the two children instead of total SSE' } },
            { id: 'd', text: { ar: 'المسح صير يفحص انقسامين في كل عتبة', en: 'the scan began testing two splits per threshold' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'البنية واحدة: مسح منتصفات الفجوات وتتبّع الأفضل. فقط استُبدل مجموع SSE بالجيني الموزون لأن الأهداف صارت صفوفًا لا أرقامًا.',
            en: 'The structure is identical: scan gap midpoints and track the best. Only total SSE was replaced by weighted Gini because the targets are classes, not numbers.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في شجرة البطاريق بالكتاب: ما الذي يجعل السؤال الأول «طول الزعنفة ≤ 206.5؟» هو المختار؟',
            en: 'In the book penguins tree: what makes "flipper length <= 206.5?" the chosen first question?',
          },
          options: [
            { id: 'a', text: { ar: 'أنه أدنى انقسام جينيًا بين كل العتبات والخصائص المفحوصة', en: 'it has the lowest Gini among all thresholds and features examined' } },
            { id: 'b', text: { ar: 'أنه أول عمود في جدول البيانات', en: 'it is the first column of the data table' } },
            { id: 'c', text: { ar: 'أنه يوازن عدد الأنواع الثلاثة تمامًا', en: 'it perfectly balances the three species counts' } },
            { id: 'd', text: { ar: 'لأنه السؤال الوحيد الممكن على خصيصة رقمية', en: 'it is the only possible question on a numeric feature' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يفحص الانقسامات المرشحة ويختار أنقصها نقاءً موزونًا؛ انقسام الزعنفة عند 206.5 يفصل الصفوف أفضل من غيره فوق الـ 333 نقطة (146/68/119).',
            en: 'The book examines candidate splits and keeps the lowest weighted impurity; the flipper split at 206.5 separates the classes best of all over the 333 points (146/68/119).',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'معامل جيني G = 1 − Σ p_k² يقيس نقاء العقدة: صفر للنقية و0.5 لأسوأ عقدة ثنائية.',
          en: 'The Gini index G = 1 - sum p_k^2 measures node purity: 0 for pure, 0.5 for the worst two-class mix.',
        },
        {
          ar: 'معيار الانقسام التصنيفي هو جيني الطفلين موزونًا بحجميهما — فاز t=2.5 بقيمة 0.25 على بياناتنا.',
          en: 'The classification split criterion is the children size-weighted Gini — t=2.5 won with 0.25 on our data.',
        },
        {
          ar: 'الجذع الفائز دقة 5/6 وخطؤه الوحيد عند x=5 لأن أي انقسام واحد لا يستطيع عزلها — مشكلة عائلة لا مشكلة مقياس.',
          en: 'The winning stump scores 5/6 with its only error at x=5 because no single split can isolate it — a family problem, not a criterion problem.',
        },
        {
          ar: 'بعد البناء قِس دقة الشجرة واقرأ مواضع أخطائها — الجيني الأنقص لا يعني صفر أخطاء.',
          en: 'After building, measure accuracy and read the error positions — the lowest Gini does not mean zero errors.',
        },
      ],
      reflectPrompt: {
        ar: 'لو أضفت نقطة سابعة x=7 موسومة 0، فهل يبقى t=2.5 هو الأفضل؟ أعد المسح يدويًا وراقب كيف يغير صف واحد ترتيب الجدول كله.',
        en: 'If you added a seventh point x=7 labeled 0, would t=2.5 remain the winner? Re-run the scan by hand and watch how one row reshuffles the whole table.',
      },
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch5.s2', pages: 'ص54-65 / pp.54-65' },
  ],
} satisfies Lesson;

export default lesson;
