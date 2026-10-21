import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch6.l5 — Implementation (mls.ch6.s5).
 * Honest comparison on the chapter dataset: single stump vs bagged stumps
 * (MSE) and single stump vs boosted pair (accuracy), with the sklearn framing
 * kept to prose.
 */
const lesson = {
  id: 'mls.ch6.l5',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 6,
  title: {
    ar: 'لوحة النتائج الصادقة',
    en: 'The honest scoreboard',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch6.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حان وقت الحكم. سنجرّب المجمعات الثلاثة على بيانات الفصل نفسها ونطبع النتائج كما هي — بما فيها النتيجة المزعجة: على ثماني نقاط نظيفة، قد يخسر التجميع أمام شجرة واحدة. الحقيقة الرقمية أهم من النتيجة المريحة.',
        en: 'Time to judge. We run all three ensembles on the chapter data and print the results as they are — including the awkward one: on eight clean points, bagging can lose to a single tree. Numeric truth beats a comfortable story.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ماذا نقيس، ومتى يفوز كل مجمّع؟', en: 'What we measure, and when each ensemble wins' },
      chunks: [
        {
          ar: 'للانحدار نقيس MSE: الجذع المفرد يعطي 0.25 على بياناتنا، بينما متوسط الجذوع الثلاثة المدرّبة على العينات المعاد سحبها يعطي 0.3924 — أسوأ قليلًا! السبب: عينات bootstrap ضاعفت نقاطًا فزيّحت العتبات، والمتعلم الأساس (جذع على 8 نقاط) مستقر أصلًا. التجميع يعالج التباين؛ ومتعلم مستقر تباينه ضئيل فلا مكسب.',
          en: 'For regression we measure MSE: the single stump scores 0.25 on our data, while the average of the three bootstrap-trained stumps scores 0.3924 — slightly worse! Why: the bootstrap samples duplicated points and scattered the thresholds, and the base learner (a stump on 8 points) is already stable. Bagging treats variance; a stable learner has little of it to treat.',
        },
        {
          ar: 'التجربة الثانية تقلب النتيجة: أضف نقطتين مشوشتين (x=9 مع y=20 وx=10 مع y=−3) فتصبح الشجرة المفردة هشة: جذعها يضحّي بالنصف الأيسر كله (أوراقه 1.5 و7.1667) ويرتفع خطؤها إلى 27.1833، بينما ينقسم المجمع إلى ثلاثة جذوع بتساوٍ مختلفة (8.5 و9 و9) فينزل إلى 21.8918. أما التعزيز على تسميات BY فقد عادل أفضل جذع مفرد (0.75 مقابل 0.75) — على ثماني نقاط نظيفة لا يظهر مكسبه بعد.',
          en: 'The second experiment flips the verdict: add two noisy points (x=9 with y=20 and x=10 with y=-3) and the single tree becomes brittle: its stump sacrifices the whole left half (leaves 1.5 and 7.1667) and its error climbs to 27.1833, while the ensemble spreads into three differently-placed stumps (8.5, 9, 9) and lands at 21.8918. As for boosting on labels BY, it matched the best single stump (0.75 vs 0.75) — on eight clean points its gain does not show yet.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'لوحة المقارنة النهائية', en: 'The final scoreboard' },
      code: `import math

XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7],
         [0, 2, 3, 3, 5, 6, 6, 7],
         [1, 2, 2, 3, 4, 4, 5, 7]]
NOISY_XS = XS + [9, 10]
NOISY_YS = YS + [20.0, -3.0]
NOISY_BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7, 8, 8],
               [0, 2, 3, 3, 5, 6, 6, 7, 9, 9],
               [1, 2, 2, 4, 4, 5, 7, 7, 9, 9]]
BX = [1, 2, 3, 4, 5, 6, 7, 8]
BY = [-1, -1, 1, -1, 1, 1, 1, -1]

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

def mse(res):
    return sum(r * r for r in res) / len(res)

def eval_pair(xs_, ys_, boots):
    pool = [stump([xs_[i] for i in idx], [ys_[i] for i in idx]) for idx in boots]

    def bagged(x):
        return sum((p[2] if x <= p[0] else p[3]) for p in pool) / len(pool)

    s = stump(xs_, ys_)
    r_single = [y - (s[2] if x <= s[0] else s[3]) for x, y in zip(xs_, ys_)]
    r_bag = [y - bagged(x) for x, y in zip(xs_, ys_)]
    return mse(r_single), mse(r_bag)

clean_single, clean_bag = eval_pair(XS, YS, BOOTS)
noisy_single, noisy_bag = eval_pair(NOISY_XS, NOISY_YS, NOISY_BOOTS)
print("clean  single %.4f bagged %.4f" % (clean_single, clean_bag))
print("noisy  single %.4f bagged %.4f" % (noisy_single, noisy_bag))

w = [1.0 / 8] * 8
alphas, stumps_b = [], []
for t_chosen in (2.5, 4.5):
    preds = [1 if x > t_chosen else -1 for x in BX]
    err = sum(wi for wi, p, y in zip(w, preds, BY) if p != y)
    alpha = 0.5 * math.log((1 - err) / err)
    w = [wi * (math.exp(-alpha) if p == y else math.exp(alpha))
         for wi, p, y in zip(w, preds, BY)]
    z = sum(w)
    w = [wi / z for wi in w]
    alphas.append(alpha)
    stumps_b.append(t_chosen)

def ada(x):
    s = sum(a * (1 if x > t else -1) for a, t in zip(alphas, stumps_b))
    return 1 if s > 0 else -1

best_single_acc = 0.75
acc_boost = sum(1 for x, y in zip(BX, BY) if ada(x) == y) / 8
print("class  single %.4f boosted %.4f" % (best_single_acc, acc_boost))`,
      explanation: {
        ar: 'ثلاث نتائج صادقة: على البيانات النظيفة خسر التجميع (0.2500 مقابل 0.3924) لأن الجذع مستقر ولا تباين يعالجه؛ وعلى البيانات المشوشة فاز (21.8918 مقابل 27.1833) لأن النقطتين الشاذتين زعزعتا الجذع المفرد بينما وزّع المجمع الضرر على ثلاث عتبات؛ وفي التصنيف عادل التعزيز أفضل جذع مفرد (0.75 = 0.75) — مكسبه الحقيقي يظهر مع متعلمات أضعف وبيانات أكبر.',
        en: 'Three honest results: on clean data bagging lost (0.2500 vs 0.3924) because the stump is stable with no variance to treat; on noisy data it won (21.8918 vs 27.1833) because the two outliers destabilised the single stump while the ensemble spread the damage across three thresholds; and in classification boosting matched the best single stump (0.75 = 0.75) — its real gain appears with weaker learners and bigger data.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.scoreboard',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أعد إنتاج لوحة النتائج على البيانات النظيفة والمشوشة: ابنِ stump وbagged وeval_pair كما في المثال، واطبع السطرين بصيغة clean  single %.4f bagged %.4f ثم noisy  single %.4f bagged %.4f.',
        en: 'Reproduce the scoreboard on the clean and noisy data: build stump, bagged, and eval_pair as in the example, and print the two lines formatted clean  single %.4f bagged %.4f then noisy  single %.4f bagged %.4f.',
      },
      starterCode: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7],
         [0, 2, 3, 3, 5, 6, 6, 7],
         [1, 2, 2, 3, 4, 4, 5, 7]]
NOISY_XS = XS + [9, 10]
NOISY_YS = YS + [20.0, -3.0]
NOISY_BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7, 8, 8],
               [0, 2, 3, 3, 5, 6, 6, 7, 9, 9],
               [1, 2, 2, 4, 4, 5, 7, 7, 9, 9]]

def sse(v):
    ...  # TODO

def stump(xs_, ys_):
    ...  # TODO

def mse(res):
    ...  # TODO

# TODO: build eval_pair, then print the clean and noisy lines
`,
      solution: `XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7],
         [0, 2, 3, 3, 5, 6, 6, 7],
         [1, 2, 2, 3, 4, 4, 5, 7]]
NOISY_XS = XS + [9, 10]
NOISY_YS = YS + [20.0, -3.0]
NOISY_BOOTS = [[0, 1, 1, 3, 4, 5, 6, 7, 8, 8],
               [0, 2, 3, 3, 5, 6, 6, 7, 9, 9],
               [1, 2, 2, 4, 4, 5, 7, 7, 9, 9]]

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

def mse(res):
    return sum(r * r for r in res) / len(res)

def eval_pair(xs_, ys_, boots):
    pool = [stump([xs_[i] for i in idx], [ys_[i] for i in idx]) for idx in boots]

    def bagged(x):
        return sum((p[2] if x <= p[0] else p[3]) for p in pool) / len(pool)

    s = stump(xs_, ys_)
    r_single = [y - (s[2] if x <= s[0] else s[3]) for x, y in zip(xs_, ys_)]
    r_bag = [y - bagged(x) for x, y in zip(xs_, ys_)]
    return mse(r_single), mse(r_bag)

clean_single, clean_bag = eval_pair(XS, YS, BOOTS)
noisy_single, noisy_bag = eval_pair(NOISY_XS, NOISY_YS, NOISY_BOOTS)
print("clean  single %.4f bagged %.4f" % (clean_single, clean_bag))
print("noisy  single %.4f bagged %.4f" % (noisy_single, noisy_bag))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'القيم الأربع مطابقة', en: 'All four values match' },
          code: `assert abs(clean_single - 0.25) < 1e-9, 'clean single expected 0.25 | actual: %r' % clean_single\nassert abs(clean_bag - 0.3923611111111111) < 1e-9, 'clean bagged expected 0.3924 | actual: %r' % clean_bag\nassert abs(noisy_single - 27.183333333333334) < 1e-6, 'noisy single expected 27.1833 | actual: %r' % noisy_single\nassert abs(noisy_bag - 21.891840277777776) < 1e-6, 'noisy bagged expected 21.8918 | actual: %r' % noisy_bag`,
          expected: '0.25 / 0.3924 / 27.1833 / 21.8918',
        },
        {
          id: 't2',
          name: { ar: 'انقلاب الحكم مع الضوضاء', en: 'The verdict flips under noise' },
          code: `assert clean_bag > clean_single, 'on clean data bagging is expected to lose'\nassert noisy_bag < noisy_single, 'on noisy data bagging is expected to win'`,
          expected: 'loses clean, wins noisy',
        },
      ],
      hints: [
        { ar: 'انقل stump وbagged من درس البناء، ثم لفّهما بـ eval_pair تعيد (mse_single, mse_bagged).', en: 'Port stump and bagged from the construction lesson, then wrap them in eval_pair returning (mse_single, mse_bagged).' },
        { ar: 'بيانات الضوضاء: NOISY_XS = XS + [9, 10] وNOISY_YS = YS + [20.0, -3.0] وعيناتها الثابتة في المثال.', en: 'Noisy data: NOISY_XS = XS + [9, 10], NOISY_YS = YS + [20.0, -3.0], with the fixed samples from the example.' },
        { ar: 'سطرا الطباعة فيهما فراغان بعد clean/noisy — انسخ الصيغة حرفيًا.', en: 'Both print lines carry two spaces after clean/noisy — copy the format verbatim.' },
        { ar: 'المخرجات المتوقعة: 0.2500/0.3924 نظيف، و27.1833/21.8918 مشوش.', en: 'Expected output: 0.2500/0.3924 clean, 27.1833/21.8918 noisy.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.boosting-verdict',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بعد تنفيذ مقطع التعزيز من المثال (جولا t=2.5 ثم t=4.5): كم دقة المجمع المعزز ada على BX/BY؟ أدخل الإجابة كعدد عشري مثل 0.75.',
        en: 'After running the boosting snippet from the example (rounds t=2.5 then t=4.5): what is the accuracy of the ada ensemble on BX/BY? Enter a decimal such as 0.75.',
      },
      answer: '0.75',
      tolerance: 1e-9,
      solution: `0.75`,
      hints: [
        { ar: 'قوة الجذعين: 0.5493 و0.3466 — وزناهما يجعلان نقطة x=5 تُقرأ +1.', en: 'The stumps\u2019 strengths: 0.5493 and 0.3466 — their ratio makes x=5 read +1.' },
        { ar: 'أفضل جذع مفرد (t=2.5) أخطأ x4 وx8 فقط (خطآن من ثمانية).', en: 'The best single stump (t=2.5) missed only x4 and x8 (two of eight).' },
        { ar: 'المعزز يخطئ النقطتين نفسهما — تعادل مع الجذع المفرد على هذه البيانات الصغيرة.', en: 'The boosted pair misses the same two points — a tie with the single stump on this tiny set.' },
        { ar: '6/8 = 0.75.', en: '6/8 = 0.75.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz.ch6.l5',
      items: [
        {
          id: 'q1',
          question: { ar: 'لماذا خسر التجميع في MSE على بياناتنا الصغيرة؟', en: 'Why did bagging lose the MSE contest on our tiny data?' },
          options: [
            { id: 'a', text: { ar: 'لأن الجذع الأساس مستقر والعينات أزاحت العتبات فقط', en: 'The base stump is stable and the samples merely scattered thresholds' } },
            { id: 'b', text: { ar: 'لأن التجميع لا يعمل على الانحدار', en: 'Because bagging cannot do regression' } },
            { id: 'c', text: { ar: 'لأن sse خطأ كمقياس', en: 'Because sse is the wrong metric' } },
            { id: 'd', text: { ar: 'لأننا استخدمنا 3 أشجار فقط وكان يلزم 100', en: 'Because 3 trees are too few; we needed 100' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'متعلم مستقر + بيانات صغيرة = لا تباين يُعالج، بينما تضيف إعادة السحب ضجيجًا.',
            en: 'A stable base learner on tiny data has no variance to treat, while resampling injects noise.',
          },
        },
        {
          id: 'q2',
          question: { ar: 'كيف انتهت مقارنة الدقة بين التعزيز وأفضل جذع مفرد على BY؟', en: 'How did the accuracy comparison between boosting and the best single stump on BY end?' },
          options: [
            { id: 'a', text: { ar: 'تعادل 0.75 = 0.75 — البيانات صغيرة جدًا لإظهار مكسب التعزيز', en: 'A tie, 0.75 = 0.75 — the data is too small to show boosting\u2019s gain' } },
            { id: 'b', text: { ar: 'فاز التعزيز بفارق كبير', en: 'Boosting won by a wide margin' } },
            { id: 'c', text: { ar: 'فاز الجذع المفرد', en: 'The single stump won' } },
            { id: 'd', text: { ar: 'كل منهما 0.5', en: 'Both scored 0.5' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'أفضل جذع مفرد يخطئ x4 وx8، ومجمع الجولتين يخطئ النقطتين نفسهما — مكسب التعزيز يحتاج متعلمات أضعف وبيانات أكبر.',
            en: 'The best single stump misses x4 and x8, and the two-round ensemble misses the same two — boosting needs weaker learners and more data to show its edge.',
          },
        },
        {
          id: 'q3',
          question: { ar: 'القاعدة العملية لاختيار المجمع:', en: 'The practical rule for choosing an ensemble:' },
          options: [
            { id: 'a', text: { ar: 'التجميع دائمًا أولًا', en: 'Always bag first' } },
            { id: 'b', text: { ar: 'طابق العلاج مع المرض: تباين → تجميع، انحياز → تعزيز', en: 'Match the cure to the disease: variance → bagging, bias → boosting' } },
            { id: 'c', text: { ar: 'التعزيز دائمًا أدق', en: 'Boosting is always more accurate' } },
            { id: 'd', text: { ar: 'اجمعهما في كل مرة', en: 'Always stack both' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كل أداة تعالج مصدر خطأ مختلفًا، والتشخيص أولًا.',
            en: 'Each tool treats a different error source — diagnose first.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'في الانحدار: جذع 0.25 مقابل مجمّع 0.3924 — التجميع لا ينجح دائمًا.', en: 'Regression: stump 0.25 vs ensemble 0.3924 — bagging does not always win.' },
        { ar: 'في التصنيف تعادل التعزيز مع أفضل جذع مفرد (0.75) على بياناتنا الصغيرة.', en: 'In classification boosting tied the best single stump (0.75) on our small data.' },
        { ar: 'قاعدة الاختيار: عالج التباين بالتجميع والانحياز بالتعزيز.', en: 'Selection rule: treat variance with bagging, bias with boosting.' },
      ],
      reflectPrompt: {
        ar: 'أضف نقطة شاذة واحدة إلى YS وأعد تشغيل لوحة النتائج: هل يقلب ذلك الحكم على التجميع؟ ماذا يخبرك هذا عن متى تُجرى التجارب؟',
        en: 'Add one outlier to YS and rerun the scoreboard: does the verdict on bagging flip? What does that tell you about when experiments are run?',
      },
    },
    { kind: 'sources', items: [{ book: 'MLS', section: 'mls.ch6.s5' }] },
  ],
  sources: [{ book: 'MLS', section: 'mls.ch6.s5' }],
} satisfies Lesson;

export default lesson;
