/**
 * Lesson mls.ch4.l2 — بايز الساذج
 *   / Naive Bayes
 * Book: MLS — Chapter 4 'Generative Classification', §4.2 Naive Bayes (pp.38-53)
 * Runnable design: fixed 6-document spam/ham word-count corpus (pure Python) ->
 *   Laplace-smoothed word probabilities, log-likelihood sums, posterior argmax.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'mls.ch4.l2',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 4,
  title: {
    ar: 'بايز الساذج',
    en: 'Naive Bayes',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch4.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'مرشحات البريد المزعج كانت أول انتصارات تعلم الآلة في حياتنا اليومية، وخلف معظمها يقف بايز الساذج: مصنف توليدي يفترض سذاجة مشهورة — أن الكلمات في الرسالة مستقلة شرطيًا عن بعضها بمجرد معرفة الصنف. افتراض خاطئ لغويًا (كلمة «مجاني» تجعل «الآن» أرجح!)، لكنه يجعل الحساب جدول عدّ بسيط، ويعمل عمليًا بشكل مذهل. ستدرب مرشحًا على ست رسائل فقط وتراه يفرز رسالتين جديدتين بشكل صحيح.',
        en: 'Spam filters were one of machine learning first everyday victories, and behind most of them stood Naive Bayes: a generative classifier with a famous naive assumption — that the words in a message are conditionally independent once you know the class. The assumption is linguistically wrong (the word free makes now more likely!), but it turns the computation into simple count tables, and in practice it works remarkably well. You will train a filter on just six messages and watch it correctly sort two new ones.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'استقلال ساذج وجمع لوغاريتمات',
        en: 'A naive independence and log sums',
      },
      chunks: [
        {
          ar: 'بايز الساذج يقبل نموذج LDA/QDA للسوابق، لكنه يستبدل الغاوسي المشترك بافتراض الاستقلال الشرطي: p(x | y = k) = p(x1 | k) * p(x2 | k) * ... حتى آخر خصيصة. النتيجة الحاسمة: تقدير كل خصيصة منفردة يغني عن حساب توزيع مشترك كامل. للكلمات نستعمل نموذج العدّ: احتمال الكلمة d داخل الصنف k هو عدد مرات ظهورها في رسائل ذلك الصنف مقسومًا على مجموع الكلمات فيه — مع تنعيم لابلاس بإضافة 1 للبسط وV للمقام حتى لا تصير أي كلمة مستحيلة.',
          en: 'Naive Bayes keeps the LDA/QDA treatment of priors but replaces the joint Gaussian with conditional independence: p(x | y = k) = p(x1 | k) * p(x2 | k) * ... up to the last feature. The decisive consequence: estimating each feature separately replaces the impossible job of modeling a full joint distribution. For words we use a count model: the probability of word d inside class k is its count in that class messages divided by the total words there — with Laplace smoothing adding 1 to the numerator and V to the denominator so no word is ever impossible.',
        },
        {
          ar: 'الاحتمال اللاحق للصنف k هو pi_k مضروبًا في حاصل ضرب احتمالات كلمات الرسالة. الضرب المباشر كارثة عدديًا: عشر كلمات باحتمالات صغيرة تنتج رقمًا يقترب من صفر فيغرق في دقة الحاسوب. الحل: لوغاريتمات — الضرب يصير جمعًا: log pi_k + مجموع c_d * log p(word_d | k). نقارن المجاميع مباشرة ونختار الأكبر: هذا هو argmax على الاحتمال اللاحق. الصفر في العدّ يسقط حدّه كله، فالكلمات الغائبة لا تؤثر.',
          en: 'The posterior for class k is pi_k times the product of the message word probabilities. Direct multiplication is a numerical disaster: ten small probabilities sink toward zero and underflow. The fix is logarithms — multiplication becomes addition: log pi_k + the sum of c_d * log p(word_d | k). Compare the sums directly and take the largest: that is the argmax over the posterior. A zero count drops its whole term, so absent words contribute nothing.',
        },
        {
          ar: 'أين يقع السذاجة بالضبط؟ في العدّ، نتظاهر أن كل كلمة تُرى منفردة بمعزل عن جيرانها، فكلمات مرتبطة واقعيًا (مثل «عرض» و«خصم») تُحسب كأنها مستقلة. الكتاب يبني نسخته بحيث تحمل كل خصيصة توزيعها الخاص (غاوسي أو برنولي أو بواسون) ويشير في قسم التنفيذ إلى أن GaussianNB في sklearn يفترض الغاوسي لكل الخصائص. على بيانات النبيذ في الكتاب جاء بايز الساذج أخيرًا في دقة التدريب — كلفة السذاجة حين ترتبط الخصائص.',
          en: 'Where exactly is the naivety? In the counting we pretend every word is seen in isolation, so realistically correlated words (like offer and discount) are treated as independent. The book builds its version so each feature carries its own distribution (Gaussian, Bernoulli, or Poisson) and notes in the implementation section that GaussianNB in sklearn assumes Gaussian features. On the book wine data Naive Bayes came last in training accuracy — the price of naivety when features correlate.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'مرشح مزعجات على ست رسائل',
        en: 'A spam filter on six messages',
      },
      code: `import math

DOCS = [
    ([2, 0, 1], "spam"),
    ([1, 0, 2], "spam"),
    ([1, 1, 1], "spam"),
    ([0, 2, 0], "ham"),
    ([0, 1, 1], "ham"),
    ([1, 2, 0], "ham"),
]
WORDS = ["free", "meeting", "money"]

spam_counts = [0, 0, 0]
ham_counts = [0, 0, 0]
n_spam = n_ham = 0
for counts, label in DOCS:
    target = spam_counts if label == "spam" else ham_counts
    for d, c in enumerate(counts):
        target[d] += c
    if label == "spam":
        n_spam += 1
    else:
        n_ham += 1
total_spam = sum(spam_counts)
total_ham = sum(ham_counts)
V = len(WORDS)

def log_score(test, prior, counts, total):
    s = math.log(prior)
    for d, c in enumerate(test):
        s += c * math.log((counts[d] + 1) / (total + V))
    return s

for test in ([1, 0, 1], [0, 2, 0]):
    s = log_score(test, n_spam / 6, spam_counts, total_spam)
    h = log_score(test, n_ham / 6, ham_counts, total_ham)
    pick = "spam" if s > h else "ham"
    print(f"doc {test} -> log spam = {s:.4f}, log ham = {h:.4f}, pick: {pick}")`,
      explanation: {
        ar: 'العدّ: رسائل المزعج تضم free أربع مرات وmoney أربع وmeeting مرة (المجموع 9)؛ ورسائل ham عكسها تقريبًا (1، 5، 1 بمجموع 7). مع تنعيم لابلاس وV = 3: p(free|spam) = 5/12. الرسالة الأولى [1, 0, 1] تجمع log-spam = -2.4441 مقابل log-ham = -3.9120 فتُصنف spam؛ والثانية [0, 2, 0] تُصنف ham بفارق أوضح (-4.2767 مقابل -1.7148). لاحظ حدّ الكلمة الغائبة: تسقط كليًا لأن c = 0.',
        en: 'The counts: spam messages contain free four times and money four and meeting once (9 total); ham is nearly the mirror image (1, 5, 1, total 7). With Laplace smoothing and V = 3: p(free|spam) = 5/12. Message one [1, 0, 1] sums to log-spam = -2.4441 against log-ham = -3.9120 and is classified spam; message two [0, 2, 0] is classified ham by a clearer margin (-4.2767 versus -1.7148). Note the absent-word term: it vanishes entirely because c = 0.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.nb-count-model',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ laplace_p(d, counts, total) لاحتمال كلمة منعّمة، وlog_score(test, prior, counts, total) التي تجمع log(prior) وح Log لكل كلمة بعدّها. اترك أسطر الطباعة كما هي.',
        en: 'Implement laplace_p(d, counts, total) for a smoothed word probability, and log_score(test, prior, counts, total) summing log(prior) plus each word log term weighted by its count. Leave the print lines unchanged.',
      },
      starterCode: `import math

SPAM_COUNTS = [4, 1, 4]
HAM_COUNTS = [1, 5, 1]
TOTAL_SPAM = 9
TOTAL_HAM = 7
V = 3

def laplace_p(d, counts, total):
    return 0.5  # TODO: (counts[d] + 1) / (total + V)

def log_score(test, prior, counts, total):
    # TODO: log(prior), then add c*log(laplace_p(...)) per word
    return 0.0

test = [1, 0, 1]
s = log_score(test, 0.5, SPAM_COUNTS, TOTAL_SPAM)
h = log_score(test, 0.5, HAM_COUNTS, TOTAL_HAM)
print(f"p(free|spam) = {laplace_p(0, SPAM_COUNTS, TOTAL_SPAM):.4f}")
print(f"p(meeting|ham) = {laplace_p(1, HAM_COUNTS, TOTAL_HAM):.4f}")
print(f"log spam = {s:.4f}")
print(f"log ham = {h:.4f}")
print("pick:", "spam" if s > h else "ham")`,
      solution: `import math

SPAM_COUNTS = [4, 1, 4]
HAM_COUNTS = [1, 5, 1]
TOTAL_SPAM = 9
TOTAL_HAM = 7
V = 3

def laplace_p(d, counts, total):
    return (counts[d] + 1) / (total + V)

def log_score(test, prior, counts, total):
    s = math.log(prior)
    for d, c in enumerate(test):
        s += c * math.log(laplace_p(d, counts, total))
    return s

test = [1, 0, 1]
s = log_score(test, 0.5, SPAM_COUNTS, TOTAL_SPAM)
h = log_score(test, 0.5, HAM_COUNTS, TOTAL_HAM)
print(f"p(free|spam) = {laplace_p(0, SPAM_COUNTS, TOTAL_SPAM):.4f}")
print(f"p(meeting|ham) = {laplace_p(1, HAM_COUNTS, TOTAL_HAM):.4f}")
print(f"log spam = {s:.4f}")
print(f"log ham = {h:.4f}")
print("pick:", "spam" if s > h else "ham")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'تنعيم لابلاس صحيح', en: 'Laplace smoothing is right' },
          code: `assert abs(laplace_p(0, SPAM_COUNTS, TOTAL_SPAM) - 5.0/12.0) < 1e-9, 'expected p(free|spam) = 5/12 | actual: %r' % laplace_p(0, SPAM_COUNTS, TOTAL_SPAM)\nassert abs(laplace_p(1, HAM_COUNTS, TOTAL_HAM) - 0.6) < 1e-9, 'expected p(meeting|ham) = 0.6 | actual: %r' % laplace_p(1, HAM_COUNTS, TOTAL_HAM)`,
        },
        {
          id: 't2',
          name: { ar: 'المجموعتان اللوغاريتميتان', en: 'the two log sums' },
          code: `assert abs(log_score([1, 0, 1], 0.5, SPAM_COUNTS, TOTAL_SPAM) - (-2.444084655267745)) < 1e-9, 'expected log spam = -2.444084655267745 | actual: %r' % log_score([1, 0, 1], 0.5, SPAM_COUNTS, TOTAL_SPAM)\nassert abs(log_score([1, 0, 1], 0.5, HAM_COUNTS, TOTAL_HAM) - (-3.9120230054281455)) < 1e-9, 'expected log ham = -3.9120230054281455 | actual: %r' % log_score([1, 0, 1], 0.5, HAM_COUNTS, TOTAL_HAM)`,
        },
        {
          id: 't3',
          name: { ar: 'القرار في التقرير', en: 'the decision in the report' },
          code: `assert 'pick: spam' in __learner_output__, 'expected line: pick: spam | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'laplace_p: return (counts[d] + 1) / (total + V) — البسط عدّ الكلمة زائد واحد والمقام مجموع الكلمات زائد V.', en: 'laplace_p: return (counts[d] + 1) / (total + V) — numerator is the word count plus one, denominator the word total plus V.' },
        { ar: 'ابدأ log_score بـ s = math.log(prior) ثم حلقة على enumerate(test): s += c * math.log(laplace_p(d, counts, total)).', en: 'Start log_score with s = math.log(prior), then loop over enumerate(test): s += c * math.log(laplace_p(d, counts, total)).' },
        { ar: 'الكلمة الغائبة (c = 0) تضيف صفرًا تلقائيًا — لا حاجة لشرط خاص.', en: 'An absent word (c = 0) adds zero automatically — no special case needed.' },
        { ar: 'المطلوب: p(free|spam) = 0.4167 وlog spam = -2.4441 وlog ham = -3.9120 والقرار spam.', en: 'Expected: p(free|spam) = 0.4167, log spam = -2.4441, log ham = -3.9120, decision spam.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.why-log-sum',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا نجمع لوغاريتمات الاحتمالات بدل ضربها مباشرة في بايز الساذج؟',
        en: 'Why does Naive Bayes sum log probabilities instead of multiplying the raw probabilities?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن اللوغاريتم يرفع الدقة النظرية للنموذج', en: 'because logarithms improve the theoretical accuracy of the model' } },
        { id: 'b', text: { ar: 'لأن ضرب أعداد صغيرة كثيرة يغرق تحت أقل عدد يمثله الحاسوب، والجمع لوغاريتميًا آمن عدديًا', en: 'because multiplying many small numbers underflows the smallest value the computer can represent, while summing logs is numerically safe' } },
        { id: 'c', text: { ar: 'لأن الضرب غير معرف على الاحتمالات', en: 'because multiplication is undefined on probabilities' } },
        { id: 'd', text: { ar: 'لتجنب تنعيم لابلاس كليًا', en: 'to avoid Laplace smoothing entirely' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'احتمال كلمة واحدة قد يكون 0.01؛ ماذا يحدث لاثنتي عشرة كلمة كهذه مضروبة؟', en: 'One word probability might be 0.01; what happens to twelve of those multiplied together?' },
        { ar: 'اللوغاريتم يحول الحاصل الضربي الطويل إلى مجموع سطور قصيرة سالبة محدودة.', en: 'The logarithm turns the long product into a short sum of bounded negative lines.' },
        { ar: 'الترتيب بين الصنفين لا يتغير تحت اللوغاريتم لأنه دالة متزايدة — فالقرار يبقى نفسه.', en: 'The ordering between the two classes is unchanged under the log because it is increasing — the decision stays the same.' },
        { ar: 'الإجابة: b — الجمع اللوغاريتمي يقي من الطفحان السفلي دون تغيير القرار.', en: 'Answer: b — log sums guard against underflow without changing the decision.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الافتراض «الساذج» في بايز الساذج؟',
            en: 'What is the naive assumption in Naive Bayes?',
          },
          options: [
            { id: 'a', text: { ar: 'أن كل الخصائص لها التوزيع الغاوسي نفسه', en: 'that all features share the same Gaussian' } },
            { id: 'b', text: { ar: 'أن الخصائص مستقلة شرطيًا بالنسبة للصنف', en: 'that features are conditionally independent given the class' } },
            { id: 'c', text: { ar: 'أن السوابق كلها متساوية', en: 'that all priors are equal' } },
            { id: 'd', text: { ar: 'أن البيانات قابلة للفصل خطيًا', en: 'that the data is linearly separable' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'السذاجة هي تفكيك p(x|y) إلى حاصل ضرب احتمالات كل خصيصة منفردة: p(x1|y)*p(x2|y)*... وهو ما يسمح بالعدّ بدل النمذجة المشتركة.',
            en: 'The naivety is factorizing p(x|y) into a product of per-feature probabilities: p(x1|y)*p(x2|y)*..., which allows plain counting instead of joint modeling.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'بعد حساب درجة كل صنف، كيف يتخذ بايز الساذج قراره؟',
            en: 'After computing each class score, how does Naive Bayes decide?',
          },
          options: [
            { id: 'a', text: { ar: 'يأخذ متوسط الدرجات', en: 'it averages the scores' } },
            { id: 'b', text: { ar: 'يختار الصنف ذا الدرجة الأعلى (argmax)', en: 'it picks the class with the highest score (argmax)' } },
            { id: 'c', text: { ar: 'يعيد كل الأصناف مع درجاتها', en: 'it returns every class with its score' } },
            { id: 'd', text: { ar: 'يرفض القرار إذا كانت الفروق صغيرة', en: 'it refuses to decide when the gaps are small' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الاحتمال اللاحق p(y|x) يتناسب مع p(x|y)*pi_k لأن المقام مشترك؛ أكبر درجة لوغاريتمية تعني أكبر لاحق، فالقرار argmax.',
            en: 'The posterior p(y|x) is proportional to p(x|y)*pi_k because the denominator is shared; the largest log score means the largest posterior, so the call is argmax.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما دور تنعيم لابلاس في نموذج العدّ؟',
            en: 'What does Laplace smoothing do in the count model?',
          },
          options: [
            { id: 'a', text: { ar: 'يرفع كل الاحتمالات إلى 1', en: 'it raises all probabilities to 1' } },
            { id: 'b', text: { ar: 'يمنع احتمال الصفر للكلمة غير المرصودة في صنف ما فيسقط النموذج كله', en: 'it prevents a zero probability for a word unseen in some class, which would zero out the whole model' } },
            { id: 'c', text: { ar: 'يجعل التوزيع غاوسيًا', en: 'it makes the distribution Gaussian' } },
            { id: 'd', text: { ar: 'يزيل الكلمات النادرة من القاموس', en: 'it removes rare words from the vocabulary' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بدون تنعيم، كلمة لم تظهر في رسائل صنف تحصل على p = 0 فتنهار درجة ذلك الصنف لأي رسالة تحويها؛ إضافة 1 وV تحفظ احتمالًا صغيرًا موجبًا للجميع.',
            en: 'Without smoothing a word never seen in a class gets p = 0 and collapses that class score for any message containing it; adding 1 and V keeps a small positive probability for everyone.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'بايز الساذج توليدي بنفس هيكل LDA: سابق لكل صنف — لكنه يستبدل الغاوسي بافتراض الاستقلال الشرطي بين الخصائص.',
          en: 'Naive Bayes is generative with the same LDA skeleton: a prior per class — but swaps the Gaussian for conditional independence between features.',
        },
        {
          ar: 'نموذج العدّ: p(word|class) من عدّ الكلمات مع تنعيم لابلاس (counts+1)/(total+V) — جدول، لا معادلات.',
          en: 'The count model: p(word|class) from word counts with Laplace smoothing (counts+1)/(total+V) — a table, not equations.',
        },
        {
          ar: 'الحساب لوغاريتمي: log pi_k زائد مجموع c_d*log p(word_d|k) — الجمع آمن والقرار argmax على المجاميع.',
          en: 'The computation is logarithmic: log pi_k plus the sum of c_d*log p(word_d|k) — safe sums and an argmax over them.',
        },
        {
          ar: 'على رسائلنا الست تصنف [1, 0, 1] مزعجة (-2.4441 مقابل -3.9120) و[0, 2, 0] عادية — بسلاح جدول عدّ صغير.',
          en: 'On our six messages [1, 0, 1] is classified spam (-2.4441 versus -3.9120) and [0, 2, 0] ham — armed with nothing but a small count table.',
        },
      ],
      reflectPrompt: {
        ar: 'افتراض الاستقلال خاطئ لغويًا لكنه ناجح عمليًا: اذكر حالة يكون فيها الضرر حقيقيًا، وحالة يكون فيها مبالغًا في الخطر.',
        en: 'The independence assumption is linguistically wrong yet practically successful: name one case where the damage is real, and one where it is overstated.',
      },
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch4.s2', pages: 'ص38-53 / pp.38-53' },
  ],
} satisfies Lesson;

export default lesson;
