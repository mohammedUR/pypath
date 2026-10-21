import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch5.l4 — Implementation: single tree vs baselines (mls.ch5.s4).
 * Comparison of the depth-2 construction tree against a depth-1 stump and the
 * mean baseline on the same fixed eight-point dataset used across ch5.
 */
const lesson = {
  id: 'mls.ch5.l4',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 5,
  title: {
    ar: 'Implementation: شجرة واحدة مقابل الأساسيات',
    en: 'Implementation: one tree against the baselines',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch5.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'بنيتَ الشجرة من الصفر في الدرس السابق. الآن السؤال الذي يسأله كل مهندس: هل تستحق كل هذا العناء؟ سنقيس شجرة العمق 2 مقابل جذع واحد مقابل المتوسط الساذج على البيانات نفسها، ونرى أين يذهب الخطأ بالضبط.',
        en: 'You built the tree from scratch last lesson. Now the question every engineer asks: was it worth it? We measure the depth-2 tree against a single stump and the naive mean baseline on the same data, and watch exactly where the error goes.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'المقارنة العادلة: نفس البيانات، ثلاثة نماذج', en: 'A fair comparison: same data, three models' },
      chunks: [
        {
          ar: 'المقياس هنا متوسط مربعات الخطأ MSE على بيانات التدريب نفسها: xs من 1 إلى 8 وys = [1, 1, 2, 2, 6, 6, 7, 7]. المتوسط الساذج يتنبأ بـ 4.0 دائمًا فيتكلف 6.5. الجذع الواحد (عمق 1) يقسم عند 4.5 فيعطي 1.5 لليسار و6.5 لليمين فينزل الخطأ إلى 0.25. وشجرة العمق 2 تقسم كل طفل مرة أخرى عند 2.5 و6.5 فتصبح أوراقها 1.0 و2.0 و6.0 و7.0 — أي تطابق تام مع البيانات وخطأ صفر.',
          en: 'The metric is training MSE on the same eight points: xs 1..8 and ys = [1, 1, 2, 2, 6, 6, 7, 7]. The naive mean always predicts 4.0 and pays 6.5. A single stump (depth 1) splits at 4.5, predicting 1.5 left and 6.5 right, dropping the error to 0.25. The depth-2 tree splits each child again at 2.5 and 6.5, producing leaves 1.0, 2.0, 6.0, 7.0 — a perfect fit with zero error.',
        },
        {
          ar: 'انتبه: صفر خطأ تدريب ليس هدفًا دائمًا. في الفصل القادم (التجميع) سنرى أن تعقيد الشجرة يزيد عدم الاستقرار، وأن التجميع يعالج التذبذب لا الانحياز. هنا نقيس هندسة نقية: كم ينقص الخطأ مع كل مستوى عمق إضافي، وعلى من نلوم عند كل مستوى.',
          en: 'Note: zero training error is not always the goal. Next chapter (ensembles) shows that deeper trees are less stable, and that ensembles fix variance, not bias. Here we measure pure engineering: how much error each extra depth level removes, and which region of the data each level is responsible for.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'لوحة النتائج على النقاط الثماني', en: 'Scoreboard on the eight points' },
      code: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]

def mse(res):
    return sum(r * r for r in res) / len(res)

def predict_d2(x):
    if x <= 4.5:
        return 1.0 if x <= 2.5 else 2.0
    return 6.0 if x <= 6.5 else 7.0

def predict_d1(x):
    return 1.5 if x <= 4.5 else 6.5

baseline = sum(YS) / len(YS)

r_base = [y - baseline for y in YS]
r_d1 = [y - predict_d1(x) for x, y in zip(XS, YS)]
r_d2 = [y - predict_d2(x) for x, y in zip(XS, YS)]
print("baseline MSE: %.4f" % mse(r_base))
print("depth-1 MSE: %.4f" % mse(r_d1))
print("depth-2 MSE: %.4f" % mse(r_d2))
print("leaves:", predict_d2(1), predict_d2(3), predict_d2(6), predict_d2(8))`,
      explanation: {
        ar: 'خط الأس 6.5000 — هذا ثمن تجاهل البيانات كليًا. الجذع يخفضه إلى 0.2500 لأنه التقط القاعدة الكبرى (اليسار صغير، اليمين كبير). العمق 2 يصل إلى 0.0000 لأن كل ورقة أصبحت مجموعة نقاط متطابقة القيمة: 1.0 و2.0 و6.0 و7.0. كل مستوى عمق لحق ثلث الخطأ تقريبًا في هذه البيانات الصغيرة.',
        en: 'The baseline pays 6.5000 — the cost of ignoring the data entirely. The stump drops it to 0.2500 by capturing the big rule (small left, big right). Depth 2 reaches 0.0000 because every leaf became a group of identical targets: 1.0, 2.0, 6.0, 7.0. Each level removed roughly a third of the error on this small dataset.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.tree-vs-baselines',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ predict_d2(x) كما في المثال (عتبات 4.5 ثم 2.5 و6.5، وأوراق 1.0 و2.0 و6.0 و7.0)، ودالة mse(res). ثم اطبع ثلاثة أسطر بالصيغة: baseline MSE: %.4f وdepth-1 MSE: %.4f وdepth-2 MSE: %.4f، بعد بناء البواقي على XS وYS المعطاة.',
        en: 'Implement predict_d2(x) as in the example (thresholds 4.5 then 2.5 and 6.5, leaves 1.0, 2.0, 6.0, 7.0) plus mse(res). Then print three lines formatted: baseline MSE: %.4f, depth-1 MSE: %.4f, depth-2 MSE: %.4f, computed from residuals on the given XS and YS.',
      },
      starterCode: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]

def mse(res):
    ...  # TODO: mean of squared residuals

def predict_d2(x):
    ...  # TODO: two-level thresholds 4.5 -> 2.5 / 6.5

# TODO: compute residuals for the baseline (mean), a depth-1 stump
# (1.5 / 6.5 at 4.5), and your depth-2 tree, then print the three lines.
`,
      solution: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]

def mse(res):
    return sum(r * r for r in res) / len(res)

def predict_d2(x):
    if x <= 4.5:
        return 1.0 if x <= 2.5 else 2.0
    return 6.0 if x <= 6.5 else 7.0

baseline = sum(YS) / len(YS)
r_base = [y - baseline for y in YS]
r_d1 = [y - (1.5 if x <= 4.5 else 6.5) for x, y in zip(XS, YS)]
r_d2 = [y - predict_d2(x) for x, y in zip(XS, YS)]
print("baseline MSE: %.4f" % mse(r_base))
print("depth-1 MSE: %.4f" % mse(r_d1))
print("depth-2 MSE: %.4f" % mse(r_d2))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'تنبؤات العمق 2 على أربع نقاط مميزة', en: 'Depth-2 predictions on four probe points' },
          code: `assert predict_d2(1) == 1.0 and predict_d2(3) == 2.0, 'left leaves wrong | %r' % (predict_d2(1), predict_d2(3))\nassert predict_d2(6) == 6.0 and predict_d2(8) == 7.0, 'right leaves wrong | %r' % (predict_d2(6), predict_d2(8))`,
          expected: '1.0, 2.0, 6.0, 7.0',
        },
        {
          id: 't2',
          name: { ar: 'قيم MSE الثلاث مطابقة', en: 'The three MSE values match' },
          code: `r_base = [y - 4.0 for y in YS]\nr_d1 = [y - (1.5 if x <= 4.5 else 6.5) for x, y in zip(XS, YS)]\nr_d2 = [y - predict_d2(x) for x, y in zip(XS, YS)]\nassert abs(mse(r_base) - 6.5) < 1e-9, 'baseline expected 6.5 | actual: %r' % mse(r_base)\nassert abs(mse(r_d1) - 0.25) < 1e-9, 'depth-1 expected 0.25 | actual: %r' % mse(r_d1)\nassert mse(r_d2) == 0.0, 'depth-2 expected 0.0 | actual: %r' % mse(r_d2)`,
          expected: '6.5 / 0.25 / 0.0',
        },
      ],
      hints: [
        { ar: 'predict_d2 سطران شرطيان فقط: أولًا x <= 4.5، ثم داخل كل فرع عتبة الطفل (2.5 يسارًا و6.5 يمينًا).', en: 'predict_d2 is two conditional lines: first x <= 4.5, then the child threshold inside each branch (2.5 left, 6.5 right).' },
        { ar: 'mse(r) = sum(r*r for r in res) / len(res) — لا تنسَ القسمة على الطول.', en: 'mse(r) = sum(r*r for r in res) / len(res) — do not forget the division by length.' },
        { ar: 'بواقي خط الأس: [y - 4.0 for y in YS] لأن المتوسط 32/8 = 4.0 بالضبط.', en: 'Baseline residuals: [y - 4.0 for y in YS] because the mean is exactly 32/8 = 4.0.' },
        { ar: 'النتائج المتوقعة: 6.5000 ثم 0.2500 ثم 0.0000 — إن لم تظهر فرقًا عن جذع 4.5 فقد نسيت عتبة الطفل.', en: 'Expected: 6.5000 then 0.2500 then 0.0000 — if depth-2 equals the stump you forgot the child threshold.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.why-depth-helps',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا خفض الجذع الخطأ من 6.5 إلى 0.25 بينما كاد العمق 2 يصفّره؟',
        en: 'Why did the stump cut MSE from 6.5 to 0.25 while depth 2 nearly zeroed it?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن الجذع استخدم عتبة خاطئة', en: 'Because the stump used a wrong threshold' } },
        { id: 'b', text: { ar: 'لأن العمق الأكبر فصل المجموعتين الداخليتين (1,2) و(6,7) في أوراق متجانسة', en: 'Because the deeper tree separated the inner pairs (1,2) and (6,7) into homogeneous leaves' } },
        { id: 'c', text: { ar: 'لأن MSE لا يعتمد على العمق', en: 'Because MSE does not depend on depth' } },
        { id: 'd', text: { ar: 'لأن الجذع يشبه المتوسط الساذج', en: 'Because a stump is the same as the naive mean' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'انظر إلى ys: قيمتها تقفز مرتين — عند الحد بين 2 و6، وداخل كل نصف هناك درجة ثانية.', en: 'Look at ys: the value jumps twice — once between 2 and 6, and once more inside each half.' },
        { ar: 'الجذع يلتقط القفزة الكبرى فقط (عند 4.5) فيبقى تدرج داخل كل نصف.', en: 'The stump captures only the big jump (at 4.5), leaving a gradient inside each half.' },
        { ar: 'عتبتا الأطفال 2.5 و6.5 تلقطان القفزة الثانية فيعطي كل ورقة قيمة ثابتة واحدة.', en: 'The child thresholds 2.5 and 6.5 catch the second jump, so each leaf holds one constant value.' },
        { ar: 'المتبقي بعد الجذع: (±0.5)² لكل نقطة = 0.25 — كلها من القفزة الداخلية غير الملتقطة.', en: 'After the stump: (±0.5) squared per point = 0.25 — all from the uncaught inner jump.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz.ch5.l4',
      items: [
        {
          id: 'q1',
          question: { ar: 'ما MSE للجذع (عمق 1، عتبة 4.5، متوسطات 1.5/6.5) على بيانات الدرس؟', en: 'What is the MSE of the depth-1 stump (threshold 4.5, means 1.5/6.5) on the lesson data?' },
          options: [
            { id: 'a', text: { ar: '0.0', en: '0.0' } },
            { id: 'b', text: { ar: '0.25', en: '0.25' } },
            { id: 'c', text: { ar: '6.5', en: '6.5' } },
            { id: 'd', text: { ar: '2.0', en: '2.0' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كل نقطة تخطئ بمقدار 0.5: (0.5)² = 0.25 لكل نقطة والمتوسط 0.25.',
            en: 'Every point misses by 0.5: (0.5) squared = 0.25 each, averaging 0.25.',
          },
        },
        {
          id: 'q2',
          question: { ar: 'أوراق شجرة العمق 2 على بياناتنا هي:', en: 'The depth-2 tree leaves on our data are:' },
          options: [
            { id: 'a', text: { ar: '1.5 و6.5', en: '1.5 and 6.5' } },
            { id: 'b', text: { ar: '1.0 و2.0 و6.0 و7.0', en: '1.0, 2.0, 6.0, 7.0' } },
            { id: 'c', text: { ar: '4.0 فقط', en: '4.0 only' } },
            { id: 'd', text: { ar: '2.5 و6.5', en: '2.5 and 6.5' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كل طفل انقسم مرة ثانية فأنتجت أوراقًا رباعية مطابقة للقيم المميزة الأربع.',
            en: 'Each child split once more, producing four leaves matching the four distinct targets.',
          },
        },
        {
          id: 'q3',
          question: { ar: 'صحيح أو خطأ: خطأ تدريب صفري يعني أن هذا النموذج هو الأفضل دائمًا للتنبؤ المستقبلي.', en: 'True or false: zero training error means this model will always be the best for future predictions.' },
          options: [
            { id: 'a', text: { ar: 'صحيح', en: 'True' } },
            { id: 'b', text: { ar: 'خطأ', en: 'False' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'خطأ التدريب ليس تعميمًا؛ الشجرة الأعمق قد تكون أكثر تذبذبًا على بيانات جديدة — وهذا موضوع فصل التجميع.',
            en: 'Training error is not generalization; the deeper tree may be less stable on new data — the topic of the ensembles chapter.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المتوسط الساذج كلف 6.5، والجذع 0.25، وشجرة العمق 2 صفر على بيانات التدريب.', en: 'The naive mean paid 6.5, the stump 0.25, and the depth-2 tree zero on training data.' },
        { ar: 'كل مستوى عمق يلتقط قفزة جديدة في الهدف: 4.5 ثم 2.5 و6.5.', en: 'Each depth level captures a new jump in the target: 4.5, then 2.5 and 6.5.' },
        { ar: 'خطأ التدريب الصفري ليس ضمان تعميم — قيس على بيانات لم يرها النموذج.', en: 'Zero training error does not guarantee generalization — measure on unseen data.' },
      ],
      reflectPrompt: {
        ar: 'أي نقطة ستظل مخطئًا لو أضفنا نقطة جديدة عند x=9 وy=20؟ وكيف تكتشف ذلك قبل النشر؟',
        en: 'Which point would still go wrong if we added x=9, y=20? How would you catch that before shipping?',
      },
    },
    { kind: 'sources', items: [{ book: 'MLS', section: 'mls.ch5.s4' }] },
  ],
  sources: [{ book: 'MLS', section: 'mls.ch5.s4' }],
} satisfies Lesson;

export default lesson;
