/**
 * Lesson mls.ch3.l3 — مميّز فيشر الخطي
 *   / Fisher's Linear Discriminant
 * Book: MLS — Chapter 3 'Discriminative Classification', §3.3 Fisher's Linear Discriminant (pp.33-37)
 * Runnable design: two fixed 1-D classes -> class means, within-class scatter,
 *   direction w = (m1-m0)/Sw, midpoint threshold, projected values printed.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch3.l3',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 3,
  title: {
    ar: 'مميّز فيشر الخطي',
    en: "Fisher's Linear Discriminant",
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch3.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'اللوجستي يقلل خسارة والبيرسبترون يصحح أخطاء — وكلاهما يبحث عن مستقيم في فضاء الخصائص الأصلي. فيشر جاء بفكرة مختلفة تمامًا: لا تبحث عن الحد مباشرة، بل أوجد الاتجاه الذي تتباعد فيه مركزا الصنفين أكثر ما يمكن مقارنة بانتشار كل صنف حول مركزه، ثم أسقط النقاط على هذا الاتجاه. في بعد واحد تصبح المسألة مقارنة أرقام بعتبة واحدة. ستحسب الاتجاه بقاعدة واحدة أنيقة وتتحقق من فصل الصنفين كليًا.',
        en: 'Logistic regression minimizes a loss and the perceptron fixes mistakes — both search for a boundary in the original feature space. Fisher took a different route: do not look for the boundary directly; find the direction along which the two class centers spread apart the most relative to how much each class spreads around its own center, then project the points onto that direction. In one dimension the problem collapses to comparing numbers against one threshold. You will compute the direction with one elegant rule and check that the classes separate.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'أسقط ثم قارن',
        en: 'Project, then compare',
      },
      chunks: [
        {
          ar: 'الفكرة: ابحث عن اتجاه إسقاط يجعل الصنفين يبدوان متباعدين قدر الإمكان. مقياس فيشر يقارن شيئين: المسافة بين متوسطي الصنفين بعد الإسقاط (نريدها كبيرة)، والتشتت داخل كل صنف حول متوسطه (نريده صغيرًا). في بعد واحد تكون المتوسطات m0 = متوسط نقاط الصنف 0 وm1 = متوسط نقاط الصنف 1، والتشتت داخل الصنف Sw = مجموع (x - m0)^2 على الصنف 0 زائد مجموع (x - m1)^2 على الصنف 1.',
          en: 'The idea: find a projection direction that makes the two classes look as far apart as possible. The Fisher criterion compares two things: the distance between the projected class means (want it large) and the spread within each class around its own mean (want it small). In one dimension the means are m0 = the average of class-0 points and m1 = the average of class-1 points, and the within-class scatter is Sw = the sum of (x - m0)^2 over class 0 plus the sum of (x - m1)^2 over class 1.',
        },
        {
          ar: 'الاتجاه الأمثل في بعد واحد قاعدة واحدة: w = (m1 - m0) / Sw. المقام Sw يعاقب الأصناف المتناثرة: لو تضاعف انتشار الصنفين مع ثبات المسافة بين مركزيهما نصف الاتجاه، أي أن الإسقاط لم يعد واثقًا. بعد الإسقاط تكون قيم الصنف 0 حول w*m0 وقيم الصنف 1 حول w*m1؛ والعتبة الطبيعية منتصف المسافة بين المتوسطين المسقطين: t = (w*m0 + w*m1) / 2. نصنف النقطة 1 إذا كان إسقاطها أكبر من العتبة.',
          en: 'The optimal direction in one dimension is a single rule: w = (m1 - m0) / Sw. The denominator Sw penalizes spread classes: if both spreads double while the centers stay put, the direction halves — the projection is no longer confident. After projecting, class 0 values sit around w*m0 and class 1 around w*m1; the natural threshold is halfway between the projected means: t = (w*m0 + w*m1) / 2. Predict class 1 when the projection exceeds the threshold.',
        },
        {
          ar: 'أين يقع فيشر من خريطة الفصل الثالث؟ هو تمييزي: لا يفترض توزيعًا احتماليًا للخصائص ولا يستعمل قاعدة بايز، بل يصنع الاتجاه من إحصاءات مباشرة. ومع ذلك ستقابله فكرة قريبة في الفصل الرابع تحت اسم LDA التحليلي التوليدي — الكتاب نفسه يشير إلى أن تنفيذ sklearn باسم LinearDiscriminantAnalysis يمكن قراءته من الزاويتين. الفرق الجوهري هنا: فيشر يعطيك اتجاهًا وعتبة، لا احتمالات.',
          en: "Where does Fisher sit on chapter 3's map? It is discriminative: no probabilistic assumption about the features, no Bayes rule — the direction comes straight from summary statistics. Yet a close relative reappears in chapter 4 under the generative name LDA; the book itself notes that scikit-learn's LinearDiscriminantAnalysis can be read from both angles. The essential difference here: Fisher hands you a direction and a threshold, not probabilities.",
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'إسقاط صنفين على بعد واحد',
        en: 'Projecting two classes onto one dimension',
      },
      code: `c0 = [2.0, 1.0, 3.0]
c1 = [5.0, 7.0, 9.0]

m0 = sum(c0) / len(c0)
m1 = sum(c1) / len(c1)
sw = sum((x - m0) ** 2 for x in c0) + sum((x - m1) ** 2 for x in c1)
w = (m1 - m0) / sw

proj0 = [w * x for x in c0]
proj1 = [w * x for x in c1]
pm0 = sum(proj0) / len(proj0)
pm1 = sum(proj1) / len(proj1)
threshold = (pm0 + pm1) / 2

X = c0 + c1
y = [0, 0, 0, 1, 1, 1]
preds = [1 if w * x > threshold else 0 for x in X]
acc = sum(p == t for p, t in zip(preds, y)) / len(y)
print(f"m0 = {m0}, m1 = {m1}")
print(f"Sw = {sw}")
print(f"w = {w}")
print(f"projected means: {pm0}, {pm1}")
print(f"threshold = {threshold}")
print("predictions:", preds)
print(f"accuracy = {acc}")`,
      explanation: {
        ar: 'المتوسطان m0 = 2.0 وm1 = 7.0؛ التشتت داخل الصنف Sw = (0+1+1) + (4+0+4) = 10.0. الاتجاه w = 5/10 = 0.5. بعد الإسقاط يتمركز الصنف 0 حول 1.0 والصنف 1 حول 3.5، فالعتبة 2.25. القيم المسقطة للصنف 0 كلها ≤ 1.5 وللصنف 1 كلها ≥ 2.5 — فصل تام ودقة 1.0. لاحظ كيف لعب Sw دوره: لو كانت الأصناف أوسع لانخفض w وقلّت الثقة.',
        en: 'The means are m0 = 2.0 and m1 = 7.0; the within-class scatter is Sw = (0+1+1) + (4+0+4) = 10.0. The direction w = 5/10 = 0.5. After projection class 0 centers at 1.0 and class 1 at 3.5, so the threshold is 2.25. Projected class-0 values are all ≤ 1.5 and class-1 values all ≥ 2.5 — perfect separation, accuracy 1.0. Notice the role of Sw: wider classes would lower w and shrink the confidence.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.fisher-direction',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ fisher_w(c0, c1) التي تعيد اتجاه فيشر لبيانات بعد واحد، وproject(xs, w) التي تسقط قائمة نقاط. طبّقهما على البيانات المثبتة في الأسفل واترك أسطر الطباعة كما هي.',
        en: 'Implement fisher_w(c0, c1) returning the Fisher direction for 1-D data, and project(xs, w) projecting a list of points. Apply them to the fixed data below and leave the print lines unchanged.',
      },
      starterCode: `def fisher_w(c0, c1):
    # TODO: class means, within-class scatter Sw, then (m1 - m0) / Sw
    return 0.0

def project(xs, w):
    # TODO: multiply every point by the direction w
    return [0.0 for _ in xs]

w = fisher_w([1.0, 2.0, 3.0], [4.0, 6.0, 8.0])
print(f"w = {w}")
print("proj class1 =", [round(v, 4) for v in project([4.0, 6.0, 8.0], w)])`,
      solution: `def fisher_w(c0, c1):
    m0 = sum(c0) / len(c0)
    m1 = sum(c1) / len(c1)
    sw = sum((x - m0) ** 2 for x in c0) + sum((x - m1) ** 2 for x in c1)
    return (m1 - m0) / sw

def project(xs, w):
    return [w * x for x in xs]

w = fisher_w([1.0, 2.0, 3.0], [4.0, 6.0, 8.0])
print(f"w = {w}")
print("proj class1 =", [round(v, 4) for v in project([4.0, 6.0, 8.0], w)])`,
      tests: [
        {
          id: 't1',
          name: { ar: 'الاتجاه يساوي 0.4', en: 'direction equals 0.4' },
          code: `assert abs(fisher_w([1.0, 2.0, 3.0], [4.0, 6.0, 8.0]) - 0.4) < 1e-9, 'expected w = 0.4 | actual: %r' % fisher_w([1.0, 2.0, 3.0], [4.0, 6.0, 8.0])`,
        },
        {
          id: 't2',
          name: { ar: 'الإسقاط صحيح', en: 'projection is right' },
          code: `w = fisher_w([1.0, 2.0, 3.0], [4.0, 6.0, 8.0])\ngot = project([4.0, 6.0, 8.0], w)\nassert abs(got[0] - 1.6) < 1e-9 and abs(got[1] - 2.4) < 1e-9 and abs(got[2] - 3.2) < 1e-9, 'expected [1.6, 2.4, 3.2] | actual: %r' % (got,)`,
        },
        {
          id: 't3',
          name: { ar: 'سطر الطباعة', en: 'print line' },
          code: `assert 'proj class1 = [1.6, 2.4, 3.2]' in __learner_output__, 'expected line: proj class1 = [1.6, 2.4, 3.2] | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'في fisher_w: احسب m0 وm1 بمتوسط كل قائمة، ثم Sw بمجموع مربعات الانحرافات في الصنفين.', en: 'In fisher_w: compute m0 and m1 as the average of each list, then Sw as the sum of squared deviations in both classes.' },
        { ar: 'الصيغة الكاملة: return (m1 - m0) / sw — البسط مسافة المركزين والمقام التشتت.', en: 'The full formula: return (m1 - m0) / sw — numerator is the center distance, denominator the scatter.' },
        { ar: 'في project استعمل قائمة مفهومة: return [w * x for x in xs].', en: 'In project use a comprehension: return [w * x for x in xs].' },
        { ar: 'على هذه البيانات: Sw = 2 + 8 = 10 وw = 4/10 = 0.4، والإسقاطات [1.6, 2.4, 3.2].', en: 'On this data: Sw = 2 + 8 = 10 and w = 4/10 = 0.4, with projections [1.6, 2.4, 3.2].' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-direction',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'نفس دالة fisher_w على الصنفين c0 = [2.0, 1.0, 3.0] وc1 = [5.0, 7.0, 9.0] من المثال المطبق: ما قيمة الاتجاه w؟ (أدخل الرقم فقط)',
        en: 'Run fisher_w on the worked-example classes c0 = [2.0, 1.0, 3.0] and c1 = [5.0, 7.0, 9.0]: what is the direction w? (enter the number only)',
      },
      answer: '0.5',
      tolerance: 1e-9,
      solution: '0.5',
      hints: [
        { ar: 'المتوسطان m0 = 2.0 وm1 = 7.0 فالبسط m1 - m0 = 5.0.', en: 'The means are m0 = 2.0 and m1 = 7.0, so the numerator m1 - m0 = 5.0.' },
        { ar: 'التشتت Sw = (0 + 1 + 1) + (4 + 0 + 4) = 10.0.', en: 'The scatter is Sw = (0 + 1 + 1) + (4 + 0 + 4) = 10.0.' },
        { ar: 'قسّم: w = 5.0 / 10.0.', en: 'Divide: w = 5.0 / 10.0.' },
        { ar: 'الإجابة: 0.5.', en: 'The answer: 0.5.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما دور المقام Sw في اتجاه فيشر w = (m1 - m0) / Sw؟',
            en: "What role does the denominator Sw play in Fisher's direction w = (m1 - m0) / Sw?",
          },
          options: [
            { id: 'a', text: { ar: 'يضخّم الاتجاه كلما زاد التشتت', en: 'it amplifies the direction as scatter grows' } },
            { id: 'b', text: { ar: 'يعاقب تشتت الأصناف فيصغر الاتجاه كلما زاد التداخل', en: 'it penalizes within-class scatter, shrinking the direction as overlap grows' } },
            { id: 'c', text: { ar: 'يضمن أن w موجب دائمًا', en: 'it guarantees w is always positive' } },
            { id: 'd', text: { ar: 'لا دور له عمليًا في بعد واحد', en: 'it plays no real role in one dimension' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'Sw هو مجموع مربعات انحرافات كل صنف عن متوسطه؛ كلما كبر قلّت وثقة الفصل فانخفض w — مقياس فيشر نسبة بين تباعد المركزين وتشتت الداخل.',
            en: 'Sw is the sum of squared deviations of each class from its mean; the larger it is, the less confident the separation, so w drops — the Fisher criterion is a ratio of center separation to internal spread.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لو تضاعف تشتت الصنفين حول مركزيهما مع ثبات المسافة بين المركزين، فماذا يحدث لـ w؟',
            en: 'If both class spreads double while the distance between centers stays the same, what happens to w?',
          },
          options: [
            { id: 'a', text: { ar: 'يتضاعف', en: 'it doubles' } },
            { id: 'b', text: { ar: 'لا يتغير', en: 'it stays the same' } },
            { id: 'c', text: { ar: 'ينصف', en: 'it halves' } },
            { id: 'd', text: { ar: 'يصبح صفرًا', en: 'it becomes zero' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'Sw يتضاعف والبسط ثابت، فالنسبة w = (m1 - m0)/Sw تنصف — الإسقاط نفسه لكن الثقة به أقل.',
            en: 'Sw doubles while the numerator is unchanged, so the ratio w = (m1 - m0)/Sw halves — same projection, less confidence in it.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'بعد إسقاط النقاط على الاتجاه، كيف يصنف فيشر نقطة جديدة في أبسط صيغة؟',
            en: 'After projecting the points, how does the simplest Fisher classifier label a new point?',
          },
          options: [
            { id: 'a', text: { ar: 'يحسب احتمالًا لاصليًا ويقارنه بـ 0.5', en: 'it computes a posterior probability and compares it to 0.5' } },
            { id: 'b', text: { ar: 'يقارن إسقاطها بعتبة منتصف المسافة بين المتوسطين المسقطين', en: 'it compares its projection to a threshold halfway between the projected means' } },
            { id: 'c', text: { ar: 'يختار أقرب جار في الفضاء الأصلي', en: 'it picks the nearest neighbor in the original space' } },
            { id: 'd', text: { ar: 'يعيد التصنيف حتى تتوقف الأخطاء كالبيرسبترون', en: 'it keeps updating until mistakes stop, like the perceptron' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'العتبة t = (w*m0 + w*m1)/2 تقسم المحور المسقط؛ أي إسقاط فوقها صنف 1 وتحتها صنف 0 — قرار قطعي بلا احتمالات.',
            en: 'The threshold t = (w*m0 + w*m1)/2 splits the projected axis; a projection above it is class 1, below it class 0 — a hard call with no probabilities.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'فيشر يبحث عن اتجاه يزيد نسبة تباعد مركزي الصنفين إلى التشتت داخل كل صنف — لا عن حد قرار مباشرة.',
          en: "Fisher searches for the direction maximizing the ratio of class-center separation to within-class scatter — not a decision boundary directly.",
        },
        {
          ar: 'في بعد واحد: w = (m1 - m0)/Sw حيث Sw مجموع مربعات الانحرافات داخل الصنفين؛ المتناثر يعاقَب.',
          en: 'In one dimension: w = (m1 - m0)/Sw where Sw sums squared within-class deviations; spread gets penalized.',
        },
        {
          ar: 'التصنيف بعتبة واحدة: منتصف المسافة بين المتوسطين المسقطين — على بياناتنا فصل تام بدقة 1.0.',
          en: 'Classification uses one threshold: midway between the projected means — on our data it separated the classes perfectly, accuracy 1.0.',
        },
        {
          ar: 'فيشر تمييزي بإحصاءات مباشرة، لكن قريبه التوليدي LDA سيظهر في الفصل القادم بنفس الاسم تقريبًا.',
          en: 'Fisher is discriminative, built from raw statistics, yet its generative cousin LDA reappears next chapter under almost the same name.',
        },
      ],
      reflectPrompt: {
        ar: 'صنفان بنفس المسافة بين مركزيهما لكن أحدهما أوسع بكثير: لماذا يعطي فيشر اتجاهًا أصغر للثنائي الأوسع، ومتى يفضل ذلك عمليًا؟',
        en: "Two classes with the same center distance but very different spreads: why does Fisher assign the wider pair a smaller direction, and when is that the right call in practice?",
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch3.s3', pages: 'ص33-37 / pp.33-37' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch3.s3', pages: 'ص33-37 / pp.33-37' },
  ],
} satisfies Lesson;

export default lesson;
