import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch6.l1 — Bagging (mls.ch6.s1).
 * Bootstrap aggregating with three FIXED literal bootstrap samples over the
 * chapter-five dataset; each sample fits a depth-1 stump, predictions average.
 */
const lesson = {
  id: 'mls.ch6.l1',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 6,
  title: {
    ar: 'التجميع: قوة العينات المعاد سحبها',
    en: 'Bagging: the power of resampled copies',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch5.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'شجرة واحدة تتوتر مع أي اهتزاز في البيانات. فكرة التجميع bootstrap: درّب عدة أشجار على عينات معاد سحبها من البيانات، ثم خذ متوسط تنبؤاتها. سنستخدم ثلاث عينات ثابتة حرفيًا لتبقى كل خطوة قابلة للتحقق والمحاكاة.',
        en: 'A single tree wobbles with any shake in the data. Bootstrap aggregating (bagging): train several trees on resampled copies of the data, then average their predictions. We use three literal, fixed samples so every step stays verifiable.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'العينات المعاد سحبها تكسر التذبذب', en: 'Resampled copies break the wobble' },
      chunks: [
        {
          ar: 'العينة المعاد سحبها تسحب n نقطة مع التكرار من n نقطة الأصلية: بعضها يتكرر وبعضها لا يظهر. كل شجرة ترى عالمًا مختلفًا قليلًا فتتعلم عتبة مختلفة قليلًا. تباين الإجابات بين الأشجار يقيس عدم استقرار المتعلم؛ ومتوسط الإجابات يقلل هذا التباين. من الناحية الحسابية: إذا كان لكل تنبؤ خطأ مشترك b وتذبذب مستقل σ²، فإن متوسط m تنبؤًا يحتفظ بالانحياز b لكنه يخفض التباين إلى σ²/m.',
          en: 'A bootstrap sample draws n points with replacement from the n original points: some repeat, some vanish. Each tree therefore sees a slightly different world and learns a slightly different threshold. The spread between trees measures learner instability; averaging the answers reduces that spread. In math terms: if each prediction shares bias b but has independent variance sigma-squared, averaging m predictions keeps bias b yet shrinks variance to sigma-squared over m.',
        },
        {
          ar: 'سندرّب جذوعًا (أشجار عمق 1) على ثلاث عينات ثابتة: S1 = [0,1,1,3,4,5,6,7]، S2 = [0,2,3,3,5,6,6,7]، S3 = [1,2,2,3,4,4,5,7] ( فهارس نقاط xs = [1..8]). العتبات الناتجة: 4.5 و5.0 و4.5 — قريبة لكنها ليست متطابقة، وهذا هو التذبذب الذي سيهضمه المتوسط.',
          en: 'We will train stumps (depth-1 trees) on three fixed samples: S1 = [0,1,1,3,4,5,6,7], S2 = [0,2,3,3,5,6,6,7], S3 = [1,2,2,3,4,4,5,7] (indices into xs = [1..8]). The learned thresholds are 4.5, 5.0, and 4.5 — close but not identical, which is exactly the wobble the average digests.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'ثلاثة جذوع من ثلاث عينات', en: 'Three stumps from three samples' },
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

stumps = [stump([XS[i] for i in idx], [YS[i] for i in idx]) for idx in BOOTS]
for s in stumps:
    print("stump: t=%.1f sse=%.4f L=%.2f R=%.2f" % s)

def bagged(x):
    return sum((s[2] if x <= s[0] else s[3]) for s in stumps) / len(stumps)

print("bagged(3) = %.4f" % bagged(3))
print("bagged(6) = %.4f" % bagged(6))`,
      explanation: {
        ar: 'العينة الأولى ضاعفت نقطتي 2 و4 فانحرفت العتبة قليلًا نحو اليسار (t=4.5)؛ الثانية ضاعفت 3 و6 فدفت العتبة إلى 5.0؛ الثالثة أنتجت 4.5 أيضًا. متوسط التنبؤ عند x=3 هو 1.5833: مزيج من أوراق 1.25 و1.75، أي أقرب إلى الواقع من أي جذع منفرد. عند x=6 تعطي الأشجار الثلاث 6.5 فمتوسطها 6.5 — اتفاق كامل.',
        en: 'The first sample duplicated points 2 and 4, nudging its threshold to 4.5; the second duplicated 3 and 6, pushing to 5.0; the third also landed on 4.5. The averaged prediction at x=3 is 1.5833 — a blend of leaves 1.25 and 1.75, closer to the truth than any single stump. At x=6 all three trees say 6.5, so the average is 6.5 — full agreement.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.bagged-predictor',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ stump(xs_, ys_) كما في المثال (يمسح منتصفات القيم المميزة ويختار أقل مجموع sse، ويعيد (t, tot, L, R))، ثم ابنِ bagged(x) كمتوسط تنبؤات الجذوع الثلاثة على BOOTS. اطبع سطري bagged(3) وbagged(6) بالصيغة bagged(%d) = %.4f.',
        en: 'Implement stump(xs_, ys_) as in the example (scan midpoints of distinct values, keep the lowest total sse, return (t, tot, L, R)), then build bagged(x) as the average of the three stumps trained on BOOTS. Print bagged(3) and bagged(6) formatted as bagged(%d) = %.4f.',
      },
      starterCode: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7],
         [0, 2, 3, 3, 5, 6, 6, 7],
         [1, 2, 2, 3, 4, 4, 5, 7]]

def stump(xs_, ys_):
    ...  # TODO: scan midpoints, minimize sse(left) + sse(right)

def bagged(x):
    ...  # TODO: average the three stumps' leaf predictions

# TODO: print bagged(3) and bagged(6)
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

stumps = [stump([XS[i] for i in idx], [YS[i] for i in idx]) for idx in BOOTS]

def bagged(x):
    return sum((s[2] if x <= s[0] else s[3]) for s in stumps) / len(stumps)

print("bagged(%d) = %.4f" % (3, bagged(3)))
print("bagged(%d) = %.4f" % (6, bagged(6)))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'عتبات الجذوع الثلاثة', en: 'The three stump thresholds' },
          code: `st = [stump([XS[i] for i in idx], [YS[i] for i in idx]) for idx in BOOTS]\nassert abs(st[0][0] - 4.5) < 1e-9 and abs(st[1][0] - 5.0) < 1e-9, 'first two thresholds wrong | %r' % ([s[0] for s in st],)\nassert abs(st[2][0] - 4.5) < 1e-9, 'third threshold expected 4.5 | actual: %r' % st[2][0]`,
          expected: '4.5, 5.0, 4.5',
        },
        {
          id: 't2',
          name: { ar: 'تنبؤا المجمع المتوسط', en: 'The averaged ensemble predictions' },
          code: `assert abs(bagged(3) - 1.5833333333333333) < 1e-9, 'bagged(3) expected 1.5833 | actual: %r' % bagged(3)\nassert abs(bagged(6) - 6.5) < 1e-9, 'bagged(6) expected 6.5 | actual: %r' % bagged(6)`,
          expected: '1.5833 and 6.5000',
        },
      ],
      hints: [
        { ar: 'وسط كل فجوة: [(a + b) / 2 for a, b in zip(sorted(set(xs_)), sorted(set(xs_))[1:])].', en: 'Midpoints: [(a + b) / 2 for a, b in zip(sorted(set(xs_)), sorted(set(xs_))[1:])].' },
        { ar: 'الجذع يعيد أربع قيم: العتبة، مجموع sse، متوسط اليسار، متوسط اليمين — بهذا الترتيب.', en: 'The stump returns four values: threshold, total sse, left mean, right mean — in that order.' },
        { ar: 'bagged يجمع (s[2] إذا x <= s[0] وإلا s[3]) لكل جذع ثم يقسم على 3.', en: 'bagged sums (s[2] if x <= s[0] else s[3]) across stumps then divides by 3.' },
        { ar: 'المخرجات المتوقعة: bagged(3) = 1.5833 وbagged(6) = 6.5000.', en: 'Expected output: bagged(3) = 1.5833 and bagged(6) = 6.5000.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.why-average',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ثلاثة جذوع أعطت العتبات 4.5 و5.0 و4.5. ما الذي يكسبه المتوسط منها؟',
        en: 'Three stumps produced thresholds 4.5, 5.0, 4.5. What does averaging them buy us?',
      },
      options: [
        { id: 'a', text: { ar: 'يقلل تباين التنبؤ مع بقاء الانحياز', en: 'It reduces prediction variance while keeping the bias' } },
        { id: 'b', text: { ar: 'يزيل انحياز الجذوع تمامًا', en: 'It removes the stumps\u2019 bias entirely' } },
        { id: 'c', text: { ar: 'يجعل النموذج أسرع في التدريب', en: 'It makes the model train faster' } },
        { id: 'd', text: { ar: 'يضمن خطأ تدريب صفريًا', en: 'It guarantees zero training error' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'متوسط m تنبؤًا مستقل التباين يخفض التباين إلى جزء 1/m.', en: 'Averaging m predictions with independent variance divides it by m.' },
        { ar: 'كل جذع تعلم من عينة مختلفة — تذبذبها ليس مشتركًا بالكامل.', en: 'Each stump learned from a different sample — their wobble is not fully shared.' },
        { ar: 'الانحياز يبقى: لو كانت الجذوع كلها منحازة نفس الاتجاه فالمتوسط لن يصلح ذلك.', en: 'Bias survives: if all stumps lean the same wrong way, averaging cannot fix it.' },
        { ar: 'لهذا يوصف التجميع بأنه علاج عدم الاستقرار (variance) لا الانحياز.', en: 'That is why bagging is described as a variance cure, not a bias cure.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz.ch6.l1',
      items: [
        {
          id: 'q1',
          question: { ar: 'ما العينة المعاد سحبها بحجم 8؟', en: 'What is a bootstrap sample of size 8?' },
          options: [
            { id: 'a', text: { ar: '8 نقاط جديدة من التوزيع نفسه', en: '8 fresh points from the same distribution' } },
            { id: 'b', text: { ar: '8 نقاط من الأصل مسحوبة مع التكرار', en: '8 points from the original drawn with replacement' } },
            { id: 'c', text: { ar: '8 نقاط دون النقاط الشاذة', en: '8 points with the outliers removed' } },
            { id: 'd', text: { ar: '8 نقاط مقسومة إلى فئات متوازنة', en: '8 points stratified across classes' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'السحب مع التكرار هو تعريف bootstrap: تتكرر بعض النقاط ويغيب بعضها.',
            en: 'Drawing with replacement is the definition of bootstrap: some points repeat, some disappear.',
          },
        },
        {
          id: 'q2',
          question: { ar: 'في مثالنا، لماذا كانت عتبة الجذع الثاني 5.0 وليس 4.5؟', en: 'In our example, why did the second stump choose 5.0 instead of 4.5?' },
          options: [
            { id: 'a', text: { ar: 'لأن عينته ضاعفت نقاطًا من النصف الأيمن فتغير التوازن', en: 'Its sample duplicated points from the right half, shifting the balance' } },
            { id: 'b', text: { ar: 'لأن الجذع الثاني أعمق', en: 'Because the second stump is deeper' } },
            { id: 'c', text: { ar: 'لأن sse لا يُحسب بالطريقة نفسها', en: 'Because sse is computed differently' } },
            { id: 'd', text: { ar: 'خطأ برمجي في العينة', en: 'A bug in the sample' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'تكرار النقاط 3 و6 غير توزيع الأوزان داخل العينة فتغير أفضل انقسام.',
            en: 'Duplicating points 3 and 6 changed the within-sample weighting, hence the best split.',
          },
        },
        {
          id: 'q3',
          question: { ar: 'متى يتوقف التجميع عن المساعدة؟', en: 'When does bagging stop helping?' },
          options: [
            { id: 'a', text: { ar: 'عندما تكون تنبؤات المتعلمين المستقرة ومشتركة الانحياز', en: 'When the base learners are stable and share the same bias' } },
            { id: 'b', text: { ar: 'عندما تكون البيانات كبيرة', en: 'When the dataset is large' } },
            { id: 'c', text: { ar: 'عندما نستخدم أشجارًا عميقة', en: 'When we use deep trees' } },
            { id: 'd', text: { ar: 'لا يتوقف أبدًا', en: 'Never' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'لو لم يكن للتذبذب مصدر مشترك فالمتوسط لا يضيف شيئًا؛ والانحياز المشترك يبقى كما هو.',
            en: 'If there is little independent wobble, the average adds nothing; shared bias remains.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التجميع = أشجار على عينات معاد سحبها + متوسط التنبؤات.', en: 'Bagging = trees on bootstrap samples + averaged predictions.' },
        { ar: 'عيناتنا الثلاث أعطت عتبات 4.5 و5.0 و4.5، ومتوسطها خفف التذبذب.', en: 'Our three samples yielded thresholds 4.5, 5.0, 4.5; the average damped the wobble.' },
        { ar: 'التجميع يعالج التباين لا الانحياز.', en: 'Bagging treats variance, not bias.' },
      ],
      reflectPrompt: {
        ar: 'لو كانت كل عيناتك تحاذي نقطة شاذة واحدة، ماذا يحدث للمتوسط؟ وكيف تكتشف ذلك من العتبات؟',
        en: 'If every sample happens to include one outlier, what happens to the average? How would the thresholds reveal it?',
      },
    },
    { kind: 'sources', items: [{ book: 'MLS', section: 'mls.ch6.s1' }] },
  ],
  sources: [{ book: 'MLS', section: 'mls.ch6.s1' }],
} satisfies Lesson;

export default lesson;
