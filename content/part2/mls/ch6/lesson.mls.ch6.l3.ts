import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch6.l3 — Boosting (mls.ch6.s3).
 * Discrete AdaBoost on a tiny fixed 1-D dataset: two boosting rounds with a
 * deterministic stump scan, literal weight updates, and the ensemble verdict.
 */
const lesson = {
  id: 'mls.ch6.l3',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 6,
  title: {
    ar: 'التعزيز: أوزان تحمل الذكرى',
    en: 'Boosting: weights that carry memory',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch6.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'التجميع درّب أشجارًا متوازية مستقلة. التعزيز يقلب المعادلة: أشجار ضعيفة متتالية، كل واحدة تركّز على أخطاء سابقتها عبر أوزان. جولة واحدة تكفي لرؤية الآلية كاملة — والعمليات الحسابية قصيرة بما يكفي لتتحقق منها بنفسك.',
        en: 'Bagging trains independent trees in parallel. Boosting flips the equation: a sequence of weak learners, each focused on its predecessor\u2019s mistakes through weights. One round shows the whole mechanism — and the arithmetic is short enough to check by hand.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'AdaBoost: الأوزان تحمل الذكرى', en: 'AdaBoost: the weights carry memory' },
      chunks: [
        {
          ar: 'الخوارزمية: ابدأ بأوزان متساوية w_i = 1/n. في كل جولة: اختر الجذع الأقل خطأ موزون err، ثم احسب قوته alpha = 0.5·ln((1−err)/err)، ثم ارفع وزن كل نقطة مخطئة بضربها في e^alpha واخفض وزن الصحيحة بـ e^−alpha، ثم طبّع بالقسمة على المجموع Z. بعد T جولات يكون التنبؤ النهائي إشارة المجموع المرجح Σ alpha_t·h_t(x).',
          en: 'The algorithm: start with equal weights w_i = 1/n. Each round: pick the stump with the lowest weighted error err, compute its strength alpha = 0.5 ln((1-err)/err), then multiply each misclassified point\u2019s weight by e^alpha, each correct one by e^(-alpha), and normalise by the total Z. After T rounds the final prediction is the sign of the weighted sum of stump outputs, of alpha_t times h_t(x).',
        },
        {
          ar: 'بياناتنا الثمانية: x = [1..8] والتسميات y = [−1,−1,1,−1,1,1,1,−1] — نقطتان مخالفتان للنمط (x=3 وx=8) يصنعان التحدي. الجولة الأولى اخترت الجذع t=2.5 (+1 يمينًا) بخطأ موزون 0.25 وقوة alpha = 0.5·ln3 ≈ 0.5493، ورُفعت أوزانا النقطتين x=4 وx=8 إلى 0.25 بينما نزلت البقية إلى 1/12. الجولة الثانية اخترت t=4.5 بخطأ 1/3 وقوة 0.5·ln2 ≈ 0.3466.',
          en: 'Our eight points: x = [1..8] with labels y = [-1,-1,1,-1,1,1,1,-1] — two pattern-breaking labels (x=3 and x=8) create the challenge. Round one picked the stump t=2.5 (+1 on the right) with weighted error 0.25 and strength alpha = 0.5 ln 3 = 0.5493, lifting the weights of x=4 and x=8 to 0.25 while easing the rest down to 1/12. Round two picked t=4.5 with error 1/3 and strength 0.5 ln 2 = 0.3466.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'جولتا تعزيز على ثماني نقاط', en: 'Two boosting rounds on eight points' },
      code: `import math

BX = [1, 2, 3, 4, 5, 6, 7, 8]
BY = [-1, -1, 1, -1, 1, 1, 1, -1]
w = [1.0 / 8] * 8
alphas, stumps = [], []

for rnd in range(2):
    best = None
    cands = sorted(set(BX))
    for t in [(a + b) / 2 for a, b in zip(cands, cands[1:])]:
        for pol in (1, -1):
            preds = [pol if x > t else -pol for x in BX]
            err = sum(wi for wi, p, y in zip(w, preds, BY) if p != y)
            if best is None or err < best[0]:
                best = (err, t, pol)
    err, t, pol = best
    alpha = 0.5 * math.log((1 - err) / err)
    preds = [pol if x > t else -pol for x in BX]
    w = [wi * (math.exp(-alpha) if p == y else math.exp(alpha))
         for wi, p, y in zip(w, preds, BY)]
    z = sum(w)
    w = [wi / z for wi in w]
    alphas.append(alpha)
    stumps.append((t, pol))
    print("round %d: t=%.1f pol=%+d err=%.4f alpha=%.4f" % (rnd, t, pol, err, alpha))
    print("  weights: %s" % (" ".join("%.4f" % wi for wi in w)))

def ada_predict(x):
    s = sum(a * (p if x > t else -p) for a, (t, p) in zip(alphas, stumps))
    return 1 if s > 0 else -1

for x in (1, 3, 4, 5, 8):
    print("ada(%d) = %+d" % (x, ada_predict(x)))`,
      explanation: {
        ar: 'الجولة 0: الجذع t=2.5 أخطأ x=4 وx=8 (خطأ 0.25) فصارت وزنهما 0.25 ومجموع بقية النقاط 6/12. الجولة 1: تحت الأوزان الجديدة صار أفضل جذع t=4.5 بخطأ 1/3 (يخطئ x3 وx4 وx8 الموزونة). المجمع النهائي: عند x=5 صار التصويت 0.5493−0.3466 = 0.2027 موجب — أي أن النقطة التي أخطأ فيها الجذع الأول وحده صُححت بالتعزيز؛ وعند x=1 وx=8 يبقى الحكم كما هو.',
        en: 'Round 0: the t=2.5 stump misclassified x=4 and x=8 (error 0.25), so both weights rose to 0.25 and the rest settled at 6/12 combined. Round 1: under the new weights the best stump is t=4.5 with error 1/3 (it misses the now-heavy x3, x4, x8). The final ensemble: at x=5 the vote is 0.5493 - 0.3466 = 0.2027, positive — the point the first stump alone misread has been corrected by boosting; at x=1 and x=8 the verdict stands.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.one-boosting-round',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ boosting_round(w, preds, ys) التي تتلقى الأوزان الحالية وتنبؤات الجذع المختار والتسميات، وتعيد (alpha, w_new): alpha = 0.5·ln((1−err)/err) حيث err الخطأ الموزون، وw_new الأوزان بعد رفع المخطئة وخفض الصحيحة والتصحيح. على البيانات المختصة يجب أن يعيد (0.5493..., [1/12 × 6 ثم 0.25 ثم 0.25]) بالترتيب المذكور في المثال.',
        en: 'Implement boosting_round(w, preds, ys) receiving current weights, the chosen stump\u2019s predictions, and labels, returning (alpha, w_new): alpha = 0.5 ln((1-err)/err) with err the weighted error, and w_new the weights after lifting the misses, easing the hits, and normalising. On the provided data it must return (0.5493..., [1/12 six times then 0.25, 0.25]) in the example\u2019s order.',
      },
      starterCode: `import math

BX = [1, 2, 3, 4, 5, 6, 7, 8]
BY = [-1, -1, 1, -1, 1, 1, 1, -1]
w0 = [1.0 / 8] * 8
preds0 = [1 if x > 2.5 else -1 for x in BX]

def boosting_round(w, preds, ys):
    ...  # TODO: weighted error, alpha, reweight, normalise

alpha1, w1 = boosting_round(w0, preds0, BY)
print("alpha = %.4f" % alpha1)
print("weights: %s" % (" ".join("%.4f" % wi for wi in w1)))`,
      solution: `import math

BX = [1, 2, 3, 4, 5, 6, 7, 8]
BY = [-1, -1, 1, -1, 1, 1, 1, -1]
w0 = [1.0 / 8] * 8
preds0 = [1 if x > 2.5 else -1 for x in BX]

def boosting_round(w, preds, ys):
    err = sum(wi for wi, p, y in zip(w, preds, ys) if p != y)
    alpha = 0.5 * math.log((1 - err) / err)
    w_new = [wi * (math.exp(-alpha) if p == y else math.exp(alpha))
             for wi, p, y in zip(w, preds, ys)]
    z = sum(w_new)
    return alpha, [wi / z for wi in w_new]

alpha1, w1 = boosting_round(w0, preds0, BY)
print("alpha = %.4f" % alpha1)
print("weights: %s" % (" ".join("%.4f" % wi for wi in w1)))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'قوة الجذع الأول', en: 'The first stump\u2019s strength' },
          code: `expected_alpha = 0.5 * math.log(3.0)\nassert abs(alpha1 - expected_alpha) < 1e-9, 'alpha expected 0.5*ln(3) | actual: %r' % alpha1`,
          expected: '0.5493',
        },
        {
          id: 't2',
          name: { ar: 'الأوزان بعد إعادة التوزيع', en: 'Weights after the reweight' },
          code: `for i in (0, 1, 2, 4, 5, 6):\n    assert abs(w1[i] - 1.0 / 12) < 1e-9, 'weight %d expected 1/12 | actual: %r' % (i, w1[i])\nassert abs(w1[3] - 0.25) < 1e-9 and abs(w1[7] - 0.25) < 1e-9, 'missed points expected 0.25 | %r' % (w1[3], w1[7])\nassert abs(sum(w1) - 1.0) < 1e-9, 'weights must sum to 1'`,
          expected: '1/12 × 6, 0.25, 0.25',
        },
        {
          id: 't3',
          name: { ar: 'جولة ثانية تحت الأوزان الجديدة', en: 'A second round under the new weights' },
          code: `preds1 = [1 if x > 4.5 else -1 for x in BX]\nalpha2, w2 = boosting_round(w1, preds1, BY)\nassert abs(alpha2 - 0.5 * math.log(2.0)) < 1e-9, 'alpha2 expected 0.5*ln(2) | actual: %r' % alpha2\nassert abs(w2[3] - 0.1875) < 1e-9, 'w2[3] expected 0.1875 | actual: %r' % w2[3]`,
          expected: 'alpha2 = 0.3466, w2[3] = 0.1875',
        },
      ],
      hints: [
        { ar: 'الخطأ الموزون: اجمع w_i فقط عند النقاط التي يختلف فيها التنبؤ عن التسمية.', en: 'Weighted error: sum w_i only where the prediction differs from the label.' },
        { ar: 'المخطئة تتضاعف بـ e^alpha والصحيحة تُضرب بـ e^−alpha — ثم اقسم الكل على المجموع.', en: 'Misses are multiplied by e^alpha, hits by e^(-alpha) — then divide everything by the total.' },
        { ar: 'تحقق يدوي: 6 نقاط صحيحة × (1/8)/√3 + نقطتان × (1/8)·√3، والمجموع Z = √3/2 — بعد القسمة تحصل على 1/12 و0.25.', en: 'Hand check: 6 correct points x (1/8)/sqrt(3) plus two points x (1/8)sqrt(3); total Z = sqrt(3)/2 — after dividing you get 1/12 and 0.25.' },
        { ar: 'المخرجات المتوقعة: alpha = 0.5493 ثم الأوزان 0.0833 × 6 و0.2500 × 2.', en: 'Expected output: alpha = 0.5493 then weights 0.0833 x 6 and 0.2500 x 2.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.why-alpha-scale',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يكون alpha = 0.5·ln((1−err)/err) كبيرًا عندما يكون err قريبًا من الصفر؟',
        en: 'Why is alpha = 0.5 ln((1-err)/err) large when err is near zero?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن الجذع شبه المثالي يستحق صوتًا أعلى في المجمع', en: 'A near-perfect stump deserves a louder voice in the ensemble' } },
        { id: 'b', text: { ar: 'لأنه يعاقب الأوزان الكبيرة', en: 'Because it punishes large weights' } },
        { id: 'c', text: { ar: 'لأن ln دائمًا موجب', en: 'Because ln is always positive' } },
        { id: 'd', text: { ar: 'حتى تتوقف الحلقة مبكرًا', en: 'So that the loop stops early' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'alpha هو معامل الجذع في مجموع التصويت النهائي.', en: 'alpha is the stump\u2019s coefficient in the final weighted vote.' },
        { ar: 'عند err = 0.5 يصبح alpha = 0 — صوت معدوم لتعلم عشوائي.', en: 'At err = 0.5 alpha becomes 0 — a muted voice for a coin-flip learner.' },
        { ar: 'كلما اقترب err من الصفر زادت نسبة (1−err)/err فزاد اللوغاريتم.', en: 'As err approaches zero, (1-err)/err grows, and so does its logarithm.' },
        { ar: 'التصويت المرجح يثق بالمتعلمات الدقيقة ويهمش المتعلمات العشوائية.', en: 'The weighted vote trusts accurate learners and marginalises coin-flippers.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz.ch6.l3',
      items: [
        {
          id: 'q1',
          question: { ar: 'ماذا يحدث لوزن النقطة التي يخطئ فيها الجذع المختار؟', en: 'What happens to the weight of a point the chosen stump misclassified?' },
          options: [
            { id: 'a', text: { ar: 'يتوقف عن المشاركة', en: 'It drops out' } },
            { id: 'b', text: { ar: 'يرتفع بمعامل e^alpha', en: 'It rises by a factor e^alpha' } },
            { id: 'c', text: { ar: 'يبقى كما هو', en: 'It stays the same' } },
            { id: 'd', text: { ar: 'ينخفض إلى الصفر', en: 'It drops to zero' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'رفع وزن المخطئات هو ما يجعل الجولة التالية تركّز عليها.',
            en: 'Lifting the misses is what makes the next round focus on them.',
          },
        },
        {
          id: 'q2',
          question: { ar: 'في مثالنا، ما قوة الجذع الأول بخطأ 0.25؟', en: 'In our example, what is the strength of the first stump with error 0.25?' },
          options: [
            { id: 'a', text: { ar: '0.5·ln(3) ≈ 0.5493', en: '0.5 ln(3) = 0.5493' } },
            { id: 'b', text: { ar: '0.5·ln(2) ≈ 0.3466', en: '0.5 ln(2) = 0.3466' } },
            { id: 'c', text: { ar: '0.25', en: '0.25' } },
            { id: 'd', text: { ar: '1.0', en: '1.0' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'alpha = 0.5·ln(0.75/0.25) = 0.5·ln(3).',
            en: 'alpha = 0.5 ln(0.75/0.25) = 0.5 ln(3).',
          },
        },
        {
          id: 'q3',
          question: { ar: 'الفرق الجوهري بين التعزيز والتجميع:', en: 'The essential difference between boosting and bagging:' },
          options: [
            { id: 'a', text: { ar: 'التعزيز تسلسلي تركز فيه كل جولة على أخطاء سابقتها', en: 'Boosting is sequential — each round focuses on its predecessor\u2019s errors' } },
            { id: 'b', text: { ar: 'التعزيز يستخدم أشجارًا أعمق', en: 'Boosting uses deeper trees' } },
            { id: 'c', text: { ar: 'التعزيز يحتاج بيانات أكثر', en: 'Boosting needs more data' } },
            { id: 'd', text: { ar: 'لا فرق جوهري', en: 'There is no essential difference' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التجميع متوازٍ ومستقل؛ التعزيز متسلسل وتتحدث الأوزان عبر الجولات.',
            en: 'Bagging is parallel and independent; boosting is sequential with weights carrying across rounds.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'AdaBoost: أوزان تبدأ متساوية ثم ترفع المخطئات وتخفض الصحيحات كل جولة.', en: 'AdaBoost: equal weights, then each round lifts misses and eases hits.' },
        { ar: 'قوة كل جذع alpha = 0.5·ln((1−err)/err) — صوت أقوى للأدق.', en: 'Each stump\u2019s strength alpha = 0.5 ln((1-err)/err) — a louder voice for the accurate.' },
        { ar: 'في مثالنا صحّحت الجولة الثانية نقطة x=5 بموازنة صوتي الجذعين.', en: 'In our example round two corrected x=5 by balancing the two stumps\u2019 voices.' },
      ],
      reflectPrompt: {
        ar: 'لو أخطأ الجذع في أكثر من نصف الأوزان (err > 0.5) ماذا يفعل alpha؟ ولماذا هذا منطقي؟',
        en: 'If a stump misses more than half the weights (err > 0.5), what does alpha do — and why is that sensible?',
      },
    },
    { kind: 'sources', items: [{ book: 'MLS', section: 'mls.ch6.s3' }] },
  ],
  sources: [{ book: 'MLS', section: 'mls.ch6.s3' }],
} satisfies Lesson;

export default lesson;
