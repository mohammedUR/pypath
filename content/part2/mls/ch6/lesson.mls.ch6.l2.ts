import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch6.l2 — Random Forests (mls.ch6.s2).
 * Bagging plus feature subsampling: each of the three fixed trees may only
 * look at a fixed literal subset of the two features when splitting.
 */
const lesson = {
  id: 'mls.ch6.l2',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 6,
  title: {
    ar: 'الغابة العشوائية: تنويع الزوايا',
    en: 'Random forests: diversifying the angles',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch6.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'التجميع يفشل إذا اتفقت الأشجار جميعها على الخطأ نفسه. الغابة العشوائية تضيف ثاني مكون: عند كل انقسام تُسمح الشجرة برؤية مجموعة فرعية من الخصائص فقط. النتيجة: أشجار أقل تشابهًا، فمتوسطها أقوى.',
        en: 'Bagging fails when every tree makes the same mistake. Random forests add a second ingredient: at each split a tree may only look at a subset of the features. The result: less correlated trees, and a stronger average.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'اختطاف الخصائص يزيّف الأشجار', en: 'Feature subsetting decorrelates trees' },
      chunks: [
        {
          ar: 'في الغابة العشوائية، كل انقسام يختار أفضل عتبة ضمن مجموعة خصائص مختارة عشوائيًا (في الكتاب: √p أو p/3 حسب النوع). هنا نستخدم خصائصين فقط ومجموعات ثابتة حرفيًا: الشجرة A ترى الخاصية 0 (إحداثي x)، الشجرة B ترى الخاصية 1 (إحداثي y)، والشجرة C ترى الاثنين. بياناتنا: X2 = [[1,8],[2,7],[3,9],[4,8],[5,2],[6,1],[7,3],[8,2]] وY2 = [1,1,2,2,6,6,7,7] — المجموعة السفلى يسارًا والأعلى يمينًا في كلا المحورين.',
          en: 'In a random forest, every split picks the best threshold within a randomly chosen feature subset (the book: sqrt(p) or p/3 depending on the task). We have just two features, so our fixed literal subsets are: tree A sees feature 0 (the x coordinate), tree B sees feature 1 (the y coordinate), and tree C sees both. Data: X2 = [[1,8],[2,7],[3,9],[4,8],[5,2],[6,1],[7,3],[8,2]] and Y2 = [1,1,2,2,6,6,7,7] — the low group sits top-left, the high group bottom-right on both axes.',
        },
        {
          ar: 'النتائج المحسوبة: الشجرة A انقسمت على الخاصية 0 عند 4.5 (أوراق 1.5 و6.5)، والشجرة B انقسمت على الخاصية 1 عند 5.0 (أوراق 6.5 لليسار و1.5 لليمين — لاحظ انعكاس الاتجاه لأن المحور معكوس)، والشجرة C اختارت أيضًا الخاصية 0 عند 4.5. التنويع في اختيار الخاصية يظهر في الشجرة B: معلومة لم ترها الأخريات.',
          en: 'Computed results: tree A split on feature 0 at 4.5 (leaves 1.5 and 6.5), tree B split on feature 1 at 5.0 (leaves 6.5 left and 1.5 right — note the flipped direction because that axis is reversed), and tree C also chose feature 0 at 4.5. The diversity shows in tree B: it carries information the other two never saw.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'ثلاث أشجار بثلاث مجموعات خصائص', en: 'Three trees, three feature subsets' },
      code: `X2 = [[1, 8], [2, 7], [3, 9], [4, 8], [5, 2], [6, 1], [7, 3], [8, 2]]
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
for t in trees:
    print("tree: feat=%d t=%.1f sse=%.4f L=%.2f R=%.2f" % t)

def rf_predict(row):
    return sum((t[3] if row[t[0]] <= t[1] else t[4]) for t in trees) / len(trees)

print("rf([2, 9]) = %.4f" % rf_predict([2, 9]))
print("rf([7, 1]) = %.4f" % rf_predict([7, 1]))`,
      explanation: {
        ar: 'كل شجرة وصلت إلى sse = 2.0 لكن من زوايا مختلفة: A وC عبر المحور x عند 4.5، وB عبر المحور y عند 5.0. تنبؤ المجمع عند [2,9] هو 1.5 (الأشجار الثلاث اتفقت) وعند [7,1] هو 6.5. لاحظ أن Shجرة B وحدها كانت ستخطئ لو سألنا عن نقطة يسار-أعلى فقط بعيدًا عن القطر، وهنا يأتي دور بقية الأشجار في تصحيحها.',
        en: 'Every tree reached sse = 2.0 but from different angles: A and C through the x axis at 4.5, B through the y axis at 5.0. The ensemble predicts 1.5 at [2,9] (unanimous) and 6.5 at [7,1]. Note that tree B alone would err for a top-left point far from the diagonal — the other trees are there to correct it.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.rf-predictor',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ forest_stump(X, Y, feats) التي تمسح الخصائص المسموحة فقط وتعيد (f, t, tot, L, R) لأفضل انقسام، ثم rf_predict(row) كمتوسط الأشجار الثلاث على SUBSETS. اطبع سطري rf([2, 9]) وrf([7, 1]) بالصيغة rf(%r) = %.4f.',
        en: 'Implement forest_stump(X, Y, feats) scanning only the allowed features and returning (f, t, tot, L, R) for the best split, plus rf_predict(row) averaging the three trees over SUBSETS. Print rf([2, 9]) and rf([7, 1]) formatted as rf(%r) = %.4f.',
      },
      starterCode: `X2 = [[1, 8], [2, 7], [3, 9], [4, 8], [5, 2], [6, 1], [7, 3], [8, 2]]
Y2 = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
SUBSETS = [(0,), (1,), (0, 1)]

def forest_stump(X, Y, feats):
    ...  # TODO: scan allowed features and their midpoints, minimize total sse

def rf_predict(row):
    ...  # TODO: average the three trees' leaf predictions

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
          name: { ar: 'اختيارات الأشجار الثلاث', en: 'The three trees\u2019 choices' },
          code: `trees = [forest_stump(X2, Y2, f) for f in SUBSETS]\nassert trees[0][0] == 0 and abs(trees[0][1] - 4.5) < 1e-9, 'tree A expected (0, 4.5) | actual: %r' % trees[0][:2]\nassert trees[1][0] == 1 and abs(trees[1][1] - 5.0) < 1e-9, 'tree B expected (1, 5.0) | actual: %r' % trees[1][:2]\nassert abs(trees[1][3] - 6.5) < 1e-9 and abs(trees[1][4] - 1.5) < 1e-9, 'tree B leaves flipped | %r' % trees[1][3:]`,
          expected: '(0,4.5), (1,5.0), flipped leaves',
        },
        {
          id: 't2',
          name: { ar: 'تنبؤا الغابة', en: 'The forest predictions' },
          code: `assert abs(rf_predict([2, 9]) - 1.5) < 1e-9, 'rf([2,9]) expected 1.5 | actual: %r' % rf_predict([2, 9])\nassert abs(rf_predict([7, 1]) - 6.5) < 1e-9, 'rf([7,1]) expected 6.5 | actual: %r' % rf_predict([7, 1])`,
          expected: '1.5 and 6.5',
        },
      ],
      hints: [
        { ar: 'عمود الخصيصة: [row[f] for row in X] — خذ قيمه المميزة المرتبة ثم منتصفاتها.', en: 'Feature column: [row[f] for row in X] — take its sorted distinct values, then midpoints.' },
        { ar: 'أفضل dict يحمل خمس قيم بالترتيب (f, t, tot, L, R) — قارن tot بـ best[2] لا best[1].', en: 'The best tuple holds (f, t, tot, L, R) in that order — compare tot against best[2], not best[1].' },
        { ar: 'احمِ الانقسام: إن كان أحد الطرفين فارغًا فتخطَّ المرشح بـ continue.', en: 'Guard the split: if either side is empty, skip the candidate with continue.' },
        { ar: 'المخرجات المتوقعة: rf([2, 9]) = 1.5000 وrf([7, 1]) = 6.5000.', en: 'Expected output: rf([2, 9]) = 1.5000 and rf([7, 1]) = 6.5000.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.why-subset-features',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يخفض اختطاف الخصائص الارتباط بين أشجار الغابة؟',
        en: 'Why does feature subsetting reduce correlation between forest trees?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن كل شجرة قد تضطر لاستخدام خاصية أضعف فتتعلم زاوية مختلفة', en: 'Because a tree may be forced onto a weaker feature and learns a different angle' } },
        { id: 'b', text: { ar: 'لأنه يقلل عدد الأشجار', en: 'Because it reduces the number of trees' } },
        { id: 'c', text: { ar: 'لأنه يزيل الضوضاء من البيانات', en: 'Because it removes noise from the data' } },
        { id: 'd', text: { ar: 'لأنه يجعل كل شجرة أعمق', en: 'Because it makes each tree deeper' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'في مثالنا: الشجرة B لم ترَ المحور x قط فتعلمت القاعدة عبر المحور y.', en: 'In our example: tree B never saw the x axis, so it learned the rule through the y axis.' },
        { ar: 'الخصائص القوية المهيمنة كانت ستُنتج أشجارًا متماثلة تقريبًا.', en: 'One dominant strong feature would otherwise produce nearly identical trees.' },
        { ar: 'الارتباط الأقل بين الأخطاء يعني متوسطًا يخفض التباين أكثر فعالية.', en: 'Less correlated errors mean the average reduces variance more effectively.' },
        { ar: 'لهذا تُختار مجموعة من حجم الجذر التربيعي لعدد الخصائص عند كل انقسام في الكتاب.', en: 'That is why the book picks a subset of size sqrt(number of features) at every split.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz.ch6.l2',
      items: [
        {
          id: 'q1',
          question: { ar: 'ما الإضافة التي تقدمها الغابة العشوائية فوق التجميع البسيط؟', en: 'What does a random forest add on top of plain bagging?' },
          options: [
            { id: 'a', text: { ar: 'عتبات أعمق', en: 'Deeper thresholds' } },
            { id: 'b', text: { ar: 'اختطاف الخصائص عند كل انقسام', en: 'Feature subsetting at every split' } },
            { id: 'c', text: { ar: 'أوزانًا متغيرة للنقاط', en: 'Changing point weights' } },
            { id: 'd', text: { ar: 'تصويت بالأغلبية بدل المتوسط', en: 'Majority vote instead of averaging' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'اختطاف الخصائص يزيّف الأشجار وهو جوهر الغابة العشوائية.',
            en: 'Feature subsetting decorrelates the trees — the core of random forests.',
          },
        },
        {
          id: 'q2',
          question: { ar: 'في مثالنا، لماذا كانت وراق الشجرة B معكوسة (6.5 يسارًا و1.5 يمينًا)؟', en: 'In our example, why are tree B\u2019s leaves flipped (6.5 left, 1.5 right)?' },
          options: [
            { id: 'a', text: { ar: 'خطأ حسابي', en: 'A computation bug' } },
            { id: 'b', text: { ar: 'لأن الخاصية 1 صغيرة في المجموعة العالية والعكس للخاصية 0', en: 'Feature 1 is small for the high-value group, opposite to feature 0' } },
            { id: 'c', text: { ar: 'لأن sse يعمل بالعكس على المحور y', en: 'Because sse works backwards on the y axis' } },
            { id: 'd', text: { ar: 'لأن العينة مقلوبة', en: 'Because the sample is inverted' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'نقاط المجموعة العالية لها y صغير (2,1,3,2) لذا انقسام y<=5 يعطي 6.5 يسارًا.',
            en: 'High-value points have small y (2,1,3,2), so the y<=5 split puts 6.5 on the left.',
          },
        },
        {
          id: 'q3',
          question: { ar: 'شجرة قاعدة ضعيفة جدًا في غابة كبيرة — ماذا يحدث عادة للتنبؤ الكلي؟', en: 'One very weak tree inside a large forest — what usually happens to the overall prediction?' },
          options: [
            { id: 'a', text: { ar: 'يفسدها تمامًا', en: 'It ruins the prediction' } },
            { id: 'b', text: { ar: 'يمتصها متوسط البقية', en: 'The average of the rest absorbs it' } },
            { id: 'c', text: { ar: 'يضاعف خطأها', en: 'It doubles its error' } },
            { id: 'd', text: { ar: 'يعيد تدريبها تلقائيًا', en: 'The forest retrains it automatically' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'متوسط تنبؤات أشجار كثيرة يخمد صوت شجرة منحرفة واحدة.',
            en: 'Averaging many trees damps one skewed voice.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الغابة = تجميع + اختطاف خصائص عند كل انقسام.', en: 'A forest = bagging + feature subsetting at each split.' },
        { ar: 'أشجارنا الثلاث وصلت sse = 2.0 من زوايا مختلفة: x عند 4.5، y عند 5.0، ثم x مجددًا.', en: 'Our three trees all hit sse = 2.0 from different angles: x at 4.5, y at 5.0, then x again.' },
        { ar: 'الشجرة غير المترابطة تحمل معلومة تكميلية يصحح بها المجمع أخطاء أخواتها.', en: 'A decorrelated tree carries complementary information the ensemble uses to correct its siblings.' },
      ],
      reflectPrompt: {
        ar: 'لو كانت إحدى الخصائص مهيمنة بوضوح، كيف يتغير أداء الغابة مقارنة بالتجميع العادي؟',
        en: 'If one feature clearly dominates, how does the forest behave compared to plain bagging?',
      },
    },
    { kind: 'sources', items: [{ book: 'MLS', section: 'mls.ch6.s2' }] },
  ],
  sources: [{ book: 'MLS', section: 'mls.ch6.s2' }],
} satisfies Lesson;

export default lesson;
