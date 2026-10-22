/**
 * Lesson mls.ch4.l1 — التحليل التمييزي الخطي والتربيعي
 *   / Linear and Quadratic Discriminant Analysis
 * Book: MLS — Chapter 4 'Generative Classification', §4.1 LDA and QDA (pp.38-53)
 * Runnable design: fixed 1-D two-class data -> priors, class-conditional Gaussian
 *   parameters, LDA (shared variance) vs QDA (per-class) discriminant scores at x=4.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch4.l1',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 4,
  title: {
    ar: 'التحليل التمييزي الخطي والتربيعي',
    en: 'Linear and Quadratic Discriminant Analysis',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch3.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قلب الفصل الرابع قلب طريقة التفكير: بدل أن نسأل أي صنف أقرب لهذه النقطة، نسأل: لو كانت النقطة من الصنف k، فما احتمال أن تبدو هكذا؟ نمذج كيف تُولَّد البيانات داخل كل صنف بتوزيع غاوسي، نقدّر سابقة كل صنف من نسبته في العينة، ثم نستعمل قاعدة بايز لتقليب الاتجاه. سترى في مثال واحد كيف يؤدي اختيار تباين مشترك أم تباين لكل صنف إلى قرارين مختلفين تمامًا لنفس النقطة.',
        en: 'Chapter 4 flips the way we think: instead of asking which class this point is closest to, ask — if the point came from class k, how likely is it to look like this? We model how data is generated inside each class with a Gaussian, estimate each prior from its share of the sample, then use Bayes rule to invert the direction. One example will show how choosing a shared versus per-class variance leads to two completely different decisions for the same point.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'المنظور التوليدي: سابقة وغاوسي لكل صنف',
        en: 'The generative view: priors and per-class Gaussians',
      },
      chunks: [
        {
          ar: 'المصنف التوليدي يفترض أن لكل صنف k سابقة pi_k — احتمال ظهوره قبل رؤية أي خصائص — وتقديرها الطبيعي هو نسبة الصنف في العينة: pi_k = N_k / N. ثم يفترض توزيعًا للخصائص داخل كل صنف: x | Y = k يتبع غاوسي بمتوسط mu_k وتباين يحدده النموذج. عند تصنيف نقطة جديدة نحسب الدرجة log(pi_k) ناقص مربع بعد النقطة عن mu_k على 2*sigma^2، ونختار الصنف ذا الدرجة الأعلى — هذا هو النسب من p(x|y) إلى p(y|x) عبر قاعدة بايز مع إسقاط المقام المشترك.',
          en: 'A generative classifier assumes each class k has a prior pi_k — the probability of seeing it before any features — and its natural estimate is the class share of the sample: pi_k = N_k / N. It then assumes a distribution for the features inside each class: x | Y = k follows a Gaussian with mean mu_k and a variance the model chooses. To classify a new point we compute the score log(pi_k) minus the squared distance to mu_k over 2*sigma^2, and pick the highest-scoring class — that is inverting p(x|y) into p(y|x) via Bayes rule with the common denominator dropped.',
        },
        {
          ar: 'LDA يفترض تباينًا واحدًا مشتركًا لكل الأصناف: نقدّره من مجموع التشتتات داخل الأصناف مقسومًا على N الكلي. في حين يمنح QDA كل صنف تباينه الخاص sigma^2_k مع حد إضافي في الدرجة: -0.5*log(sigma^2_k). في بعد واحد تكون درجات LDA متناظرة حول كل مركز بالعرض نفسه، فحد القرار بين صنفين يقع في منتصف المسافة تمامًا؛ أما درجات QDA فعرضها يختلف من صنف لآخر، فينحرف الحد نحو الصنف الأضيق.',
          en: 'LDA assumes one shared variance for all classes: estimated from the within-class scatter sums divided by the total N. QDA instead gives each class its own variance sigma^2_k, adding an extra score term: -0.5*log(sigma^2_k). In one dimension LDA score curves are symmetric around each center with the same width, so the boundary between two classes sits exactly midway; QDA curves have different widths, so the boundary bends toward the narrower class.',
        },
        {
          ar: 'النتيجة العملية للحد الإضافي: الأصناف الواسعة تطالب بالنقاط البعيدة. لو كان الصنف 1 أوسع من الصنف 0، فإن نقطة بعيدة عن المركزين قد تحصل على درجة أعلى من الصنف 1 رغم أن مركزه أبعد منها — لأن انحدار الغاوسي الواسع ألطف. هذا بالضبط ما ستشاهده في المثال المطبق عند x = 4: LDA يختار الصنف 0 الأضيق الأقرب، وQDA يختار الصنف 1 الأوسع. لا أحد منهما مخطئ رياضيًا — الفرضيتان مختلفتان.',
          en: 'The practical consequence of the extra term: wide classes claim far points. If class 1 is wider than class 0, a point far from both centers can score higher for class 1 even though its center is farther away — the wider Gaussian falls off more gently. That is exactly what the worked example shows at x = 4: LDA picks the closer, narrower class 0, while QDA picks the wider class 1. Neither is mathematically wrong — the two assumptions differ.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'درجتان متنافستان عند x = 4',
        en: 'Two competing scores at x = 4',
      },
      code: `import math

c0 = [1.0, 2.0, 3.0]
c1 = [5.0, 7.0, 9.0]
n0, n1 = len(c0), len(c1)
pi0, pi1 = n0 / (n0 + n1), n1 / (n0 + n1)
mu0, mu1 = sum(c0) / n0, sum(c1) / n1
s0 = sum((x - mu0) ** 2 for x in c0)
s1 = sum((x - mu1) ** 2 for x in c1)
var_lda = (s0 + s1) / (n0 + n1)
var0, var1 = s0 / n0, s1 / n1

def lda_score(x, pi, mu, var):
    return math.log(pi) - (x - mu) ** 2 / (2 * var)

def qda_score(x, pi, mu, var):
    return math.log(pi) - (x - mu) ** 2 / (2 * var) - 0.5 * math.log(var)

x = 4.0
d0l = lda_score(x, pi0, mu0, var_lda)
d1l = lda_score(x, pi1, mu1, var_lda)
d0q = qda_score(x, pi0, mu0, var0)
d1q = qda_score(x, pi1, mu1, var1)
print(f"priors: {pi0}, {pi1} | means: {mu0}, {mu1}")
print(f"lda var = {var_lda:.4f} | qda vars: {var0:.4f}, {var1:.4f}")
print(f"lda scores at x={x}: d0 = {d0l:.4f}, d1 = {d1l:.4f}")
print(f"qda scores at x={x}: d0 = {d0q:.4f}, d1 = {d1q:.4f}")
print(f"lda pick: {0 if d0l > d1l else 1}")
print(f"qda pick: {0 if d0q > d1q else 1}")`,
      explanation: {
        ar: 'البيانات تعطي سوابق 0.5 و0.5 ومتوسطين 2.0 و7.0. التباين المشترك للـ LDA هو 10/6 ≈ 1.6667، بينما QDA يرى 0.6667 للصنف 0 و2.6667 للصنف 1. عند x = 4: درجات LDA هي -1.8931 مقابل -3.3931 فيفوز الصنف 0 الأقرب. لكن درجات QDA هي -3.4904 مقابل -2.8711 فيفوز الصنف 1 الأوسع رغم أن مركزه أبعد! الحد -0.5*log(2.6667) ≈ -0.4904 خفف عقوبة البعد للصنف الواسع أكثر مما فعل -0.5*log(0.6667) للضيق.',
        en: 'The data gives priors 0.5 and 0.5 and means 2.0 and 7.0. The shared LDA variance is 10/6 ≈ 1.6667, while QDA sees 0.6667 for class 0 and 2.6667 for class 1. At x = 4: LDA scores are -1.8931 versus -3.3931, so the closer class 0 wins. But QDA scores are -3.4904 versus -2.8711, so the wider class 1 wins despite the farther center! The term -0.5*log(2.6667) ≈ -0.4904 eased the distance penalty for the wide class far more than -0.5*log(0.6667) did for the narrow one.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.lda-qda-scores',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ الدالتين lda_score(x, pi, mu, var) وqda_score(x, pi, mu, var) بالصيغتين المذكورتين، ثم اترك أسطر الطباعة الأربعة كما هي لتقارن قراري النموذجين عند x = 4.',
        en: 'Implement lda_score(x, pi, mu, var) and qda_score(x, pi, mu, var) with the two formulas, then leave the four print lines unchanged to compare both model decisions at x = 4.',
      },
      starterCode: `import math

def lda_score(x, pi, mu, var):
    return 0.0  # TODO: log(pi) - (x - mu)^2 / (2*var)

def qda_score(x, pi, mu, var):
    return 0.0  # TODO: lda_score - 0.5*log(var)

x = 4.0
d0l = lda_score(x, 0.5, 2.0, 10.0 / 6.0)
d1l = lda_score(x, 0.5, 7.0, 10.0 / 6.0)
d0q = qda_score(x, 0.5, 2.0, 2.0 / 3.0)
d1q = qda_score(x, 0.5, 7.0, 8.0 / 3.0)
print(f"lda scores at x={x}: d0 = {d0l:.4f}, d1 = {d1l:.4f}")
print(f"qda scores at x={x}: d0 = {d0q:.4f}, d1 = {d1q:.4f}")
print(f"lda pick: {0 if d0l > d1l else 1}")
print(f"qda pick: {0 if d0q > d1q else 1}")`,
      solution: `import math

def lda_score(x, pi, mu, var):
    return math.log(pi) - (x - mu) ** 2 / (2 * var)

def qda_score(x, pi, mu, var):
    return math.log(pi) - (x - mu) ** 2 / (2 * var) - 0.5 * math.log(var)

x = 4.0
d0l = lda_score(x, 0.5, 2.0, 10.0 / 6.0)
d1l = lda_score(x, 0.5, 7.0, 10.0 / 6.0)
d0q = qda_score(x, 0.5, 2.0, 2.0 / 3.0)
d1q = qda_score(x, 0.5, 7.0, 8.0 / 3.0)
print(f"lda scores at x={x}: d0 = {d0l:.4f}, d1 = {d1l:.4f}")
print(f"qda scores at x={x}: d0 = {d0q:.4f}, d1 = {d1q:.4f}")
print(f"lda pick: {0 if d0l > d1l else 1}")
print(f"qda pick: {0 if d0q > d1q else 1}")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'درجات LDA عند x = 4', en: 'LDA scores at x = 4' },
          code: `assert abs(lda_score(4.0, 0.5, 2.0, 10.0/6.0) - (-1.8931471805599451)) < 1e-9, 'expected d0 = -1.8931471805599451 | actual: %r' % lda_score(4.0, 0.5, 2.0, 10.0/6.0)\nassert abs(lda_score(4.0, 0.5, 7.0, 10.0/6.0) - (-3.393147180559945)) < 1e-9, 'expected d1 = -3.393147180559945 | actual: %r' % lda_score(4.0, 0.5, 7.0, 10.0/6.0)`,
        },
        {
          id: 't2',
          name: { ar: 'درجات QDA عند x = 4', en: 'QDA scores at x = 4' },
          code: `assert abs(qda_score(4.0, 0.5, 2.0, 2.0/3.0) - (-3.490414626505863)) < 1e-9, 'expected d0 = -3.490414626505863 | actual: %r' % qda_score(4.0, 0.5, 2.0, 2.0/3.0)\nassert abs(qda_score(4.0, 0.5, 7.0, 8.0/3.0) - (-2.8710618070658085)) < 1e-9, 'expected d1 = -2.8710618070658085 | actual: %r' % qda_score(4.0, 0.5, 7.0, 8.0/3.0)`,
        },
        {
          id: 't3',
          name: { ar: 'قرارا النموذجين في التقرير', en: 'both decisions in the report' },
          code: `assert 'lda pick: 0' in __learner_output__, 'expected line: lda pick: 0 | actual: %r' % __learner_output__\nassert 'qda pick: 1' in __learner_output__, 'expected line: qda pick: 1 | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'lda_score سطر واحد: return math.log(pi) - (x - mu) ** 2 / (2 * var).', en: 'lda_score is one line: return math.log(pi) - (x - mu) ** 2 / (2 * var).' },
        { ar: 'qda_score = درجة LDA نفسها ناقص 0.5 * math.log(var) — هذا هو الحد الإضافي للتغطية بالتوزيع الكامل.', en: 'qda_score = the LDA score minus 0.5 * math.log(var) — the extra full-distribution term.' },
        { ar: 'في البدايات: p = 0.5 فالحد الأول log(0.5) ≈ -0.6931 في كل الدرجة.', en: 'Both scores start with log(pi) = log(0.5) ≈ -0.6931.' },
        { ar: 'المطلوب: d0 للـ LDA = -1.8931 وd1 = -3.3931؛ وللـ QDA: d0 = -3.4904 وd1 = -2.8711.', en: 'Expected: LDA d0 = -1.8931 and d1 = -3.3931; QDA d0 = -3.4904 and d1 = -2.8711.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-verdicts',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'هذه الشيفرة تعيد حساب القرارين عند x = 4 بقيم معلمة يدويًا. تتبّع الكود واكتب المخرج الحرفي (سطران).',
        en: 'This snippet recomputes both decisions at x = 4 with hand-pinned parameters. Trace it and write the exact output (two lines).',
      },
      code: `import math

mu0, mu1 = 2.0, 7.0
var_lda = 10.0 / 6.0
var0, var1 = 2.0 / 3.0, 8.0 / 3.0
pi0 = pi1 = 0.5

d0 = math.log(pi0) - (4.0 - mu0) ** 2 / (2 * var_lda)
d1 = math.log(pi1) - (4.0 - mu1) ** 2 / (2 * var_lda)
print("lda pick:", 0 if d0 > d1 else 1)

d0 = math.log(pi0) - (4.0 - mu0) ** 2 / (2 * var0) - 0.5 * math.log(var0)
d1 = math.log(pi1) - (4.0 - mu1) ** 2 / (2 * var1) - 0.5 * math.log(var1)
print("qda pick:", 0 if d0 > d1 else 1)`,
      answer: 'lda pick: 0\nqda pick: 1',
      solution: 'lda pick: 0\nqda pick: 1',
      hints: [
        { ar: 'في LDA: d0 = log(0.5) - 4/(10/3) ≈ -1.8931 وd1 = log(0.5) - 9/(10/3) ≈ -3.3931 — الأول أكبر.', en: 'For LDA: d0 = log(0.5) - 4/(10/3) ≈ -1.8931 and d1 = log(0.5) - 9/(10/3) ≈ -3.3931 — the first is larger.' },
        { ar: 'في QDA: d0 يحصل على عقوبة باعدة كبيرة (قسمة على تباين صغير 2/3) وعلى -0.5*log(2/3)؛ وd1 تنخفض عقوبته كثيرًا بتباين 8/3.', en: 'For QDA: d0 takes a big distance penalty (dividing by the small variance 2/3) plus -0.5*log(2/3); d1 is eased a lot by the variance 8/3.' },
        { ar: 'المفارقة أن d1 في QDA (-2.8711) أكبر من d0 (-3.4904) رغم بُعد المركز — العرض يغلب المسافة.', en: 'Counterintuitively QDA d1 (-2.8711) beats d0 (-3.4904) despite the farther center — width beats distance.' },
        { ar: 'السطران: lda pick: 0 ثم qda pick: 1.', en: 'The two lines: lda pick: 0 then qda pick: 1.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'كيف يُقدَّر السابق pi_k في المصنفات التوليدية بطريقة الإمكان الأعظم؟',
            en: 'How is the prior pi_k estimated in generative classifiers under maximum likelihood?',
          },
          options: [
            { id: 'a', text: { ar: 'يُضبط يدويًا إلى 0.5 دائمًا', en: 'it is set by hand to 0.5 always' } },
            { id: 'b', text: { ar: 'نسبة نقاط الصنف k إلى العدد الكلي N_k / N', en: 'the share of class-k points out of the total, N_k / N' } },
            { id: 'c', text: { ar: 'متوسط خصائص الصنف k', en: 'the mean of class-k features' } },
            { id: 'd', text: { ar: 'يُحتسب من التباين المشترك', en: 'it is derived from the shared variance' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'تعظيم إمكان التوزيع الفئوي بقيد مجموع السوابق 1 يعطي مباشرة pi_k = N_k/N — حصة الصنف في العينة.',
            en: 'Maximizing the categorical likelihood under the constraint that priors sum to 1 gives directly pi_k = N_k/N — the class share of the sample.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرضية التي يميز LDA عن QDA؟',
            en: 'Which assumption distinguishes LDA from QDA?',
          },
          options: [
            { id: 'a', text: { ar: 'LDA يفترض تباينًا مشتركًا بين الأصناف وQDA يمنح كل صنف تباينه', en: 'LDA assumes a shared variance across classes; QDA gives each class its own' } },
            { id: 'b', text: { ar: 'LDA يستعمل قاعدة بايز وQDA لا يستعملها', en: 'LDA uses Bayes rule; QDA does not' } },
            { id: 'c', text: { ar: 'LDA للبيانات الثنائية فقط وQDA للمتعددة', en: 'LDA is binary-only; QDA is multiclass' } },
            { id: 'd', text: { ar: 'LDA يقدّر المتوسطات وQDA يقدّر السوابق فقط', en: 'LDA estimates means; QDA estimates only priors' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كلاهما يقدّر سوابق ومتوسطات لكل صنف؛ الفرق الوحيد أن تباين LDA واحد مشترك (فيظهر في الدرجة بلا حد لوغاريتمي خاص) بينما لـ QDA تباين لكل صنف مع حد -0.5*log(sigma^2_k).',
            en: 'Both estimate priors and per-class means; the only difference is that LDA shares one variance (so no per-class log term in the score) while QDA has per-class variances with the -0.5*log(sigma^2_k) term.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'نقطة بعيدة عن المركزين معًا، والصنف 1 أوسع تباينًا: من يفوز غالبًا تحت QDA؟',
            en: 'A point far from both centers, with class 1 having the larger variance: who usually wins under QDA?',
          },
          options: [
            { id: 'a', text: { ar: 'الصنف الأضيق دائمًا', en: 'always the narrower class' } },
            { id: 'b', text: { ar: 'الصنف الأوسع، لأن غاوسيه يتراجع أبطأ مع البعد', en: 'the wider class, because its Gaussian decays more slowly with distance' } },
            { id: 'c', text: { ar: 'الصنف ذا السابق الأصغر', en: 'the class with the smaller prior' } },
            { id: 'd', text: { ar: 'تعادل دائم خارج المدى المرصود', en: 'always a tie outside the observed range' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الحد -0.5*log(sigma^2_k) وخفض عقوبة البعد يجعلان منحنى الصنف الواسع أعلى في الأطراف — تطالب الأصناف الواسعة بالنقاط البعيدة.',
            en: 'The -0.5*log(sigma^2_k) term and the gentler distance penalty keep the wide-class curve higher in the tails — wide classes claim far points.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'التوليدي يقلب السؤال: pi_k من نسبة الصنف، وغاوسي لكل صنف يصف شكل بياناته، وقاعدة بايز تحوّل p(x|y) إلى قرار.',
          en: 'The generative view inverts the question: pi_k from the class share, a Gaussian per class describing its data shape, and Bayes rule turning p(x|y) into a decision.',
        },
        {
          ar: 'درجة التصنيف: log(pi_k) - (x - mu_k)^2/(2*sigma^2)؛ والفائز صاحب الدرجة الأعلى.',
          en: 'The classification score: log(pi_k) - (x - mu_k)^2/(2*sigma^2); the highest score wins.',
        },
        {
          ar: 'LDA تباين مشترك 10/6 ≈ 1.6667 وحد قرار في المنتصف؛ QDA تباينان 0.6667 و2.6667 وحد إضافي -0.5*log(sigma^2_k).',
          en: 'LDA shares one variance, 10/6 ≈ 1.6667, with a midway boundary; QDA has variances 0.6667 and 2.6667 plus the -0.5*log(sigma^2_k) term.',
        },
        {
          ar: 'عند x = 4 اختلفا: LDA اختارت 0 وQDA اختارت 1 — الأصناف الواسعة تطالب بالنقاط البعيدة.',
          en: 'At x = 4 they disagreed: LDA chose 0 and QDA chose 1 — wide classes claim far points.',
        },
      ],
      reflectPrompt: {
        ar: 'لو كانت كل بيانات العالم تتبع غاوسيات بتباين مشترك فما الفائدة من QDA أصلًا؟ وما كلفة استعماله حين يكون التباينان متقاربين حقًا؟',
        en: 'If all data in the world followed Gaussians with a shared variance, what would QDA ever be good for? And what does it cost you when the true variances are nearly equal?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch4.s1', pages: 'ص38-53 / pp.38-53' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch4.s1', pages: 'ص38-53 / pp.38-53' },
  ],
} satisfies Lesson;

export default lesson;
