import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch6.l4 — Construction (mls.ch6.s4).
 * Three from-scratch build exercises: the bagged predictor, the forest
 * predictor with fixed feature subsets, and one boosting round.
 */
const lesson = {
  id: 'mls.ch6.l4',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 6,
  title: {
    ar: 'بناء المجمعات الثلاثة من الصفر',
    en: 'Building the three ensembles from scratch',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch6.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'ثلاث خبرات من الدروس السابقة ستمتزج هنا: الجذع، العينة المعاد سحبها، والوزن المتغير. ستكتب باني المجمعات الثلاثة كاملة بنفسك — وبأرقام ثابتة تتحقق منها حرفًا بحرف.',
        en: 'Three skills from previous lessons converge here: the stump, the bootstrap sample, and the moving weight. You will write all three ensemble builders yourself — against fixed numbers you can verify line by line.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ثلاث وصفات، أساس واحد', en: 'Three recipes, one backbone' },
      chunks: [
        {
          ar: 'المجمعات الثلاثة تشترك في الهيكل: مجموعة متعلمات قاعدة، وآلية دمج. التجميع يدمج بالمتوسط على عينات معاد سحبها؛ الغابة تضيف قصر نظر في الخصائص عند كل انقسام؛ التعزيز يدمج بالمجموع المرجح مع أوزان نقاط متغيرة. ما يتباين هو مصدر التنويع: عينة البيانات، أو الخصائص المرئية، أو تركيز الأوزان.',
          en: 'The three ensembles share a skeleton: a pool of base learners plus a merging rule. Bagging merges by averaging over bootstrap samples; the forest adds per-split feature near-sightedness; boosting merges by a weighted vote with moving point weights. What varies is the diversity source: the data sample, the visible features, or the weight focus.',
        },
        {
          ar: 'سنستخدم بيانات الفصل نفسها: XS = [1..8] وYS = [1,1,2,2,6,6,7,7] مع العينات الثابتة الثلاث من درس التجميع، وبيانات X2 ثنائية الخصائص من درس الغابة، وتسميات BY من درس التعزيز. كل دالة تُبنى مرة واحدة وتُختبر فورًا.',
          en: 'We reuse the chapter data: XS = [1..8] and YS = [1,1,2,2,6,6,7,7] with the three fixed bagging samples, the two-feature X2 from the forest lesson, and the labels BY from the boosting lesson. Each function is built once and tested immediately.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الهيكل المشترك: قاعدة + دمج', en: 'The shared skeleton: pool + merge' },
      code: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7],
         [0, 2, 3, 3, 5, 6, 6, 7],
         [1, 2, 2, 3, 4, 4, 5, 7]]

def sse(v):
    m = sum(v) / len(v)
    return sum((a - m) ** 2 for a in v)

def stump(xs_, ys_):
    best = None
    sx = sorted(set(xs_))
    for t in [(a + b) / 2 for a, b in zip(sx, sx[1:])]:
        left = [y for x, y in zip(xs_, ys_) if x <= t]
        right = [y for x, y in zip(xs_, ys_) if x > t]
        tot = sse(left) + sse(right)
        if best is None or tot < best[1]:
            best = (t, tot, sum(left) / len(left), sum(right) / len(right))
    return best

pool = [stump([XS[i] for i in idx], [YS[i] for i in idx]) for idx in BOOTS]
print("pool thresholds:", [p[0] for p in pool])
merged = sum((p[2] if 3 <= p[0] else p[3]) for p in pool) / len(pool)
print("merged at x=3 (via precomputed side): %.4f" % merged)`,
      explanation: {
        ar: 'الهيكل: pool قائمة جذوع مُدرَّبة على العينات، ثم قاعدة دمج (متوسط هنا). السطر الأخير يذكّرك بأهم عادة هندسية: لا تكرر منطق الفرع مرتين — مرّر x فعليًا واختبر الشرط داخليًا كما في دالة bagged في التمارين، لا بقرار مسبق خارجي كالسطر الاستعراضي أعلاه.',
        en: 'The skeleton: a pool list of stumps trained on the samples, then a merge rule (average here). The last line is a deliberate anti-pattern reminder: never duplicate branching logic outside the model — pass x into the merger and let it branch internally, exactly like the bagged function you will write in the exercises.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.build-bagged',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ stump وbagged كما في درس التجميع تمامًا (stump يعيد (t, tot, L, R)؛ bagged يمرر x لكل جذع ويأخذ متوسط الأوراق). اطبع bagged(3) وbagged(6) بالصيغة bagged(%d) = %.4f.',
        en: 'Build stump and bagged exactly as in the bagging lesson (stump returns (t, tot, L, R); bagged passes x to every stump and averages the leaves). Print bagged(3) and bagged(6) formatted as bagged(%d) = %.4f.',
      },
      starterCode: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7],
         [0, 2, 3, 3, 5, 6, 6, 7],
         [1, 2, 2, 3, 4, 4, 5, 7]]

def sse(v):
    ...  # TODO

def stump(xs_, ys_):
    ...  # TODO

def bagged(x):
    ...  # TODO

# TODO: train the pool on BOOTS, print bagged(3) and bagged(6)
`,
      solution: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7],
         [0, 2, 3, 3, 5, 6, 6, 7],
         [1, 2, 2, 3, 4, 4, 5, 7]]

def sse(v):
    m = sum(v) / len(v)
    return sum((a - m) ** 2 for a in v)

def stump(xs_, ys_):
    best = None
    sx = sorted(set(xs_))
    for t in [(a + b) / 2 for a, b in zip(sx, sx[1:])]:
        left = [y for x, y in zip(xs_, ys_) if x <= t]
        right = [y for x, y in zip(xs_, ys_) if x > t]
        tot = sse(left) + sse(right)
        if best is None or tot < best[1]:
            best = (t, tot, sum(left) / len(left), sum(right) / len(right))
    return best

pool = [stump([XS[i] for i in idx], [YS[i] for i in idx]) for idx in BOOTS]

def bagged(x):
    return sum((p[2] if x <= p[0] else p[3]) for p in pool) / len(pool)

print("bagged(%d) = %.4f" % (3, bagged(3)))
print("bagged(%d) = %.4f" % (6, bagged(6)))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'تجمع العتبات صحيح', en: 'The pool thresholds are right' },
          code: `assert [round(p[0], 2) for p in pool] == [4.5, 5.0, 4.5], 'pool thresholds | %r' % [p[0] for p in pool]`,
          expected: '[4.5, 5.0, 4.5]',
        },
        {
          id: 't2',
          name: { ar: 'المتوسط يمرر x داخليًا', en: 'The average branches on x internally' },
          code: `assert abs(bagged(3) - 1.5833333333333333) < 1e-9, 'bagged(3) | %r' % bagged(3)\nassert abs(bagged(6) - 6.5) < 1e-9, 'bagged(6) | %r' % bagged(6)\nassert abs(bagged(5) - 4.833333333333333) < 1e-9, 'bagged(5) | %r' % bagged(5)`,
          expected: '1.5833 / 6.5000 / 4.8333',
        },
      ],
      hints: [
        { ar: 'انقل حلّك من درس التجميع حرفيًا — الأرقام نفسها ستظهر.', en: 'Port your solution from the bagging lesson verbatim — the same numbers reappear.' },
        { ar: 'bagged(5): الجذع الأول يعطي 6.5 (5 > 4.5)، والثاني 1.75 (5 <= 5.0 يأخذ الورقة اليسرى)، والثالث 6.25 → المتوسط 14.5/3 = 4.8333.', en: 'bagged(5): stump one gives 6.5 (5 > 4.5), stump two 1.75 (5 <= 5.0 takes the left leaf), stump three 6.25 — the average is 14.5/3 = 4.8333.' },
        { ar: 'لا تحسب الفرع خارج الدالة؛ اترك bagged يقرر بمقارنة x بعتبة كل جذع.', en: 'Do not precompute the branch outside; let bagged compare x to each stump\u2019s threshold.' },
        { ar: 'المخرجات المتوقعة: bagged(3) = 1.5833 وbagged(6) = 6.5000.', en: 'Expected output: bagged(3) = 1.5833 and bagged(6) = 6.5000.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.build-forest',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ forest_stump(X, Y, feats) وrf_predict(row) كما في درس الغابة على X2/Y2/SUBSETS. اطبع rf([2, 9]) وrf([7, 1]) بالصيغة rf(%r) = %.4f.',
        en: 'Build forest_stump(X, Y, feats) and rf_predict(row) as in the forest lesson over X2/Y2/SUBSETS. Print rf([2, 9]) and rf([7, 1]) formatted as rf(%r) = %.4f.',
      },
      starterCode: `X2 = [[1, 8], [2, 7], [3, 9], [4, 8], [5, 2], [6, 1], [7, 3], [8, 2]]
Y2 = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
SUBSETS = [(0,), (1,), (0, 1)]

def sse(v):
    ...  # TODO

def forest_stump(X, Y, feats):
    ...  # TODO: scan allowed features only

def rf_predict(row):
    ...  # TODO: average the three trees

# TODO: print rf([2, 9]) and rf([7, 1])
`,
      solution: `X2 = [[1, 8], [2, 7], [3, 9], [4, 8], [5, 2], [6, 1], [7, 3], [8, 2]]
Y2 = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
SUBSETS = [(0,), (1,), (0, 1)]

def sse(v):
    m = sum(v) / len(v)
    return sum((a - m) ** 2 for a in v)

def forest_stump(X, Y, feats):
    best = None
    for f in feats:
        col = sorted(set(row[f] for row in X))
        for t in [(a + b) / 2 for a, b in zip(col, col[1:])]:
            left = [y for row, y in zip(X, Y) if row[f] <= t]
            right = [y for row, y in zip(X, Y) if row[f] > t]
            if not left or not right:
                continue
            tot = sse(left) + sse(right)
            if best is None or tot < best[2]:
                best = (f, t, tot, sum(left) / len(left), sum(right) / len(right))
    return best

trees = [forest_stump(X2, Y2, f) for f in SUBSETS]

def rf_predict(row):
    return sum((t[3] if row[t[0]] <= t[1] else t[4]) for t in trees) / len(trees)

print("rf(%r) = %.4f" % ([2, 9], rf_predict([2, 9])))
print("rf(%r) = %.4f" % ([7, 1], rf_predict([7, 1])))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'أشجار الغابة الثلاث', en: 'The three forest trees' },
          code: `trees = [forest_stump(X2, Y2, f) for f in SUBSETS]\nassert [(t[0], round(t[1], 2)) for t in trees] == [(0, 4.5), (1, 5.0), (0, 4.5)], 'trees | %r' % [(t[0], t[1]) for t in trees]\nassert all(abs(t[2] - 2.0) < 1e-9 for t in trees), 'all trees expected sse 2.0'`,
          expected: '(0,4.5) (1,5.0) (0,4.5), sse 2.0',
        },
        {
          id: 't2',
          name: { ar: 'تنبؤا الغابة', en: 'Forest predictions' },
          code: `assert abs(rf_predict([2, 9]) - 1.5) < 1e-9, 'rf([2,9]) | %r' % rf_predict([2, 9])\nassert abs(rf_predict([7, 1]) - 6.5) < 1e-9, 'rf([7,1]) | %r' % rf_predict([7, 1])`,
          expected: '1.5 and 6.5',
        },
      ],
      hints: [
        { ar: 'الفارق الوحيد عن الجذع الأحادي: حلقة خارجية على feats وقيمة f محفوظة في النتيجة.', en: 'The only change from the single stump: an outer loop over feats and f stored in the result.' },
        { ar: 'قارن tot بـ best[2] لأن البنية (f, t, tot, L, R).', en: 'Compare tot against best[2] because the tuple is (f, t, tot, L, R).' },
        { ar: 'rf_predict يقرأ row[t[0]] — الخاصية التي اختارتها كل شجرة.', en: 'rf_predict reads row[t[0]] — each tree\u2019s own chosen feature.' },
        { ar: 'المخرجات المتوقعة: rf([2, 9]) = 1.5000 وrf([7, 1]) = 6.5000.', en: 'Expected output: rf([2, 9]) = 1.5000 and rf([7, 1]) = 6.5000.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.build-boosting-round',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ boosting_round(w, preds, ys) كما في درس التعزيز وأجرِ جولتين على BX/BY: الأولى من أوزان متساوية مع جذع t=2.5 (+1 يمينًا)، والثانية من الأوزان الناتجة مع جذع t=4.5. اطبع alpha لكل جولة بالصيغة alpha1 = %.4f وalpha2 = %.4f.',
        en: 'Build boosting_round(w, preds, ys) as in the boosting lesson and run two rounds on BX/BY: round one from equal weights with the t=2.5 stump (+1 on the right), round two from the resulting weights with the t=4.5 stump. Print each alpha as alpha1 = %.4f and alpha2 = %.4f.',
      },
      starterCode: `import math

BX = [1, 2, 3, 4, 5, 6, 7, 8]
BY = [-1, -1, 1, -1, 1, 1, 1, -1]

def boosting_round(w, preds, ys):
    ...  # TODO: err, alpha, reweight, normalise

w0 = [1.0 / 8] * 8
preds0 = [1 if x > 2.5 else -1 for x in BX]
alpha1, w1 = boosting_round(w0, preds0, BY)
preds1 = [1 if x > 4.5 else -1 for x in BX]
alpha2, w2 = boosting_round(w1, preds1, BY)
print("alpha1 = %.4f" % alpha1)
print("alpha2 = %.4f" % alpha2)`,
      solution: `import math

BX = [1, 2, 3, 4, 5, 6, 7, 8]
BY = [-1, -1, 1, -1, 1, 1, 1, -1]

def boosting_round(w, preds, ys):
    err = sum(wi for wi, p, y in zip(w, preds, ys) if p != y)
    alpha = 0.5 * math.log((1 - err) / err)
    w_new = [wi * (math.exp(-alpha) if p == y else math.exp(alpha))
             for wi, p, y in zip(w, preds, ys)]
    z = sum(w_new)
    return alpha, [wi / z for wi in w_new]

w0 = [1.0 / 8] * 8
preds0 = [1 if x > 2.5 else -1 for x in BX]
alpha1, w1 = boosting_round(w0, preds0, BY)
preds1 = [1 if x > 4.5 else -1 for x in BX]
alpha2, w2 = boosting_round(w1, preds1, BY)
print("alpha1 = %.4f" % alpha1)
print("alpha2 = %.4f" % alpha2)`,
      tests: [
        {
          id: 't1',
          name: { ar: 'قوتا الجولتين', en: 'Both rounds\u2019 strengths' },
          code: `assert abs(alpha1 - 0.5 * math.log(3.0)) < 1e-9, 'alpha1 | %r' % alpha1\nassert abs(alpha2 - 0.5 * math.log(2.0)) < 1e-9, 'alpha2 | %r' % alpha2`,
          expected: '0.5493 and 0.3466',
        },
        {
          id: 't2',
          name: { ar: 'أوزان ما بعد الجولة الثانية', en: 'Weights after round two' },
          code: `expected = [0.0625, 0.0625, 0.125, 0.1875, 0.0625, 0.0625, 0.0625, 0.375]\nfor i, (a, b) in enumerate(zip(w2, expected)):\n    assert abs(a - b) < 1e-9, 'w2[%d] expected %r | actual: %r' % (i, b, a)\nassert abs(sum(w2) - 1.0) < 1e-9`,
          expected: '[0.0625, ..., 0.1875, ..., 0.375]',
        },
      ],
      hints: [
        { ar: 'انقل boosting_round من درس التعزيز حرفيًا — نفس الدالة تخدم الجولتين.', en: 'Port boosting_round from the boosting lesson verbatim — one function serves both rounds.' },
        { ar: 'الجولة الثانية تغذي أوزانها من مخرجات الأولى: w1 ثم preds1.', en: 'Round two feeds on round one\u2019s output: w1 then preds1.' },
        { ar: 'تحقق يدوي للجولة الثانية: err = 1/3 وZ يعيد التوزيع إلى 0.0625 للصحيح و0.125/0.1875/0.375 للمخطئة.', en: 'Hand check round two: err = 1/3 and the normaliser lands the correct points at 0.0625 and the misses at 0.125, 0.1875, 0.375.' },
        { ar: 'المخرجات المتوقعة: alpha1 = 0.5493 وalpha2 = 0.3466.', en: 'Expected output: alpha1 = 0.5493 and alpha2 = 0.3466.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz.ch6.l4',
      items: [
        {
          id: 'q1',
          question: { ar: 'ما مصدر التنويع في الغابة دون تعزيز الأوزان؟', en: 'What is the diversity source in a forest, without moving weights?' },
          options: [
            { id: 'a', text: { ar: 'العينات المعاد سحبها + اختطاف الخصائص', en: 'Bootstrap samples + feature subsetting' } },
            { id: 'b', text: { ar: 'العينات فقط', en: 'Samples only' } },
            { id: 'c', text: { ar: 'الخصائص فقط', en: 'Features only' } },
            { id: 'd', text: { ar: 'الجذور العميقة', en: 'Deep roots' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الغابة تجمع بين مصدرين: العينة والخصائص.',
            en: 'A forest combines both sources: the sample and the features.',
          },
        },
        {
          id: 'q2',
          question: { ar: 'لماذا نضع حلقة feats خارجية في forest_stump؟', en: 'Why does forest_stump loop over feats?' },
          options: [
            { id: 'a', text: { ar: 'لتقليل زمن الحساب', en: 'To reduce compute time' } },
            { id: 'b', text: { ar: 'لأن أفضل انقسام قد يكون عبر أي خصيصة مسموحة', en: 'Because the best split may lie in any allowed feature' } },
            { id: 'c', text: { ar: 'لأن sse يتطلب ذلك', en: 'Because sse requires it' } },
            { id: 'd', text: { ar: 'لتنسيق المخرجات', en: 'For output formatting' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشجرة تختار الأفضل عبر الخصائص المسموحة فقط — لذا يجب مسحها كلها.',
            en: 'The tree picks the best within allowed features — so all of them must be scanned.',
          },
        },
        {
          id: 'q3',
          question: { ar: 'أين يوضع التصبيع في boosting_round؟', en: 'Where does normalisation go in boosting_round?' },
          options: [
            { id: 'a', text: { ar: 'قبل حساب الخطأ', en: 'Before computing the error' } },
            { id: 'b', text: { ar: 'بعد إعادة التوزيع مباشرة', en: 'Immediately after reweighting' } },
            { id: 'c', text: { ar: 'في نهاية كل الجولات فقط', en: 'Only after all rounds' } },
            { id: 'd', text: { ar: 'لا حاجة له', en: 'Not needed' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بدون تصبيع بعد رفع e^alpha ستنفجر الأوزان عبر الجولات.',
            en: 'Without normalising after the e^alpha lift, weights explode across rounds.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'بنيت المجمعات الثلاثة فوق هيكل واحد: pool + قاعدة دمج.', en: 'You built all three ensembles on one skeleton: pool + merge rule.' },
        { ar: 'مصادر التنويع الثلاثة: العينة، الخصيصة، الوزن.', en: 'The three diversity sources: sample, feature, weight.' },
        { ar: 'نفس دوالك أعادت أرقام الدروس السابقة حرفيًا — علامة بناء صحيح.', en: 'Your functions reproduced the previous lessons\u2019 numbers exactly — the mark of a correct build.' },
      ],
      reflectPrompt: {
        ar: 'أي من المجمعات الثلاثة ستختار لبيانات فيها خصيصة مهيمنة واحدة؟ ولماذا؟',
        en: 'Which of the three ensembles would you pick for data with one dominant feature — and why?',
      },
    },
    { kind: 'sources', items: [{ book: 'MLS', section: 'mls.ch6.s4' }] },
  ],
  sources: [{ book: 'MLS', section: 'mls.ch6.s4' }],
} satisfies Lesson;

export default lesson;
