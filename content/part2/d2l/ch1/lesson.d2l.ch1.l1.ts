import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch1.l1 — "Learning from Data: Components and Kinds of Machine Learning"
 * التعلم من البيانات: مكونات تعلم الآلة وأنواعه
 * Aligned with D2L ch1 s1 (A Motivating Example) + s2 (Key Components) +
 * s3 (Kinds of Machine Learning Problems). All expression is original — a
 * paraphrase of the source's ideas, never a verbatim translation. Runnable
 * design: a tiny fit-by-gradient-descent demo (y = w*x on 4 fixed points,
 * 100 steps, lr 0.05) that frames data/model/loss/optimizer; every literal
 * verified under CPython 3. Deterministic only: no input(), no exit(),
 * no unittest.main, no seeding needed.
 */
const lesson = {
  id: 'd2l.ch1.l1',
  version: 1,
  part: 'II',
  track: 'A1',
  book: 'D2L',
  chapter: 1,
  title: {
    ar: 'التعلم من البيانات: مكونات تعلم الآلة وأنواعه',
    en: 'Learning from Data: Components and Kinds of Machine Learning',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch2.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'لا أحد يعرف كيف يُكتب برنامج يستيقظ على كلمة «Alexa» من 44,000 عينة صوت في الثانية — ولهذا نستخدم التعلم الآلي: بدل كتابة القواعد، نكتب برنامجًا يعدّل مفاتيحه بنفسه من أمثلة. في هذا الدرس ستشاهد الحلقة كاملة بأصغر صورة: بيانات من 4 نقاط، نموذج y=wx، خسارة مربعات، ونزول اشتقاقي 100 خطوة يقود w إلى 2.0. ثم ترسم خريطة المشاكل: مراقَب، غير مراقَب، وتفاعلي.',
        en: 'Nobody knows how to hand-code a program that wakes up on the word "Alexa" from 44,000 audio samples per second — that is why we use machine learning: instead of writing rules, we write a program that tunes its own knobs from examples. In this lesson you will watch the whole loop in miniature: 4 data points, the model y=wx, a squared-error loss, and 100 steps of gradient descent driving w to 2.0. Then you will map the problem landscape: supervised, unsupervised, and interactive.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من القواعد إلى التعلم، ثم خريطة المشاكل', en: 'From rules to learning, then the problem map' },
      chunks: [
        {
          ar: 'البرامج التقليدية قواعد صارمة يكتبها بشر وتظل كما هي مهما تراكمت الخبرة؛ والتعلم الآلي عكسه: خوارزميات تتحسن مع الخبرة (بيانات أو تفاعل). الحيلة في مثال كلمة الاستيقاظ: نحن نعرف أن نتعرف على الكلمة حتى لو لا نعرف كيف، فيكفي أن نجمع أمثلة موسومة ثم نضبط معاملات نموذج مرن — «برمجة بالبيانات». أربعة مكونات تلازمك في كل مشكلة: البيانات القابلة للتعلم منها (أمثلة ذات سمات features وأحيانًا تسميات labels)، والنموذج الذي يحول المدخلات إلى تنبؤات، ودالة الهدف/الخسارة التي تقيس سوء الأداء (الأدنى أفضل، مثل مربعات الخطأ للانحدار)، وخوارزمية تحسين تعدل المعاملات لخفض الخسارة — أشهرها النزول الاشتقاقي.',
          en: 'Traditional programs are rigid rules written by humans and unchanged however much experience accrues; machine learning is the opposite: algorithms that improve with experience (data or interaction). The trick in the wake-word example: you can recognize the word even if you cannot say how — so collect labeled snippets and tune the parameters of a flexible model, "programming with data". Four components accompany every problem: the data to learn from (examples with features and, when supervised, labels), the model that transforms inputs into predictions, the objective/loss function that scores badness (lower is better, e.g. squared error for regression), and an optimization algorithm that nudges parameters downhill — gradient descent being the classic.',
        },
        {
          ar: 'خريطة المشاكل: في التعلم المراقَب supervised تصل الأمثلة موسومة، ويتفرع إلى انحدار regression (كم؟ سعر بيت، مدة جراحة)، وتصنيف classification (أيٌّ من؟ ثنائي أو متعدد الفئات باحتمالات وتكلفة قرار — لا تأكل الفطر لأن 20% خطر موت يفوق أي عشاء!)، والوسم multi-label، والترتيب والبحث، وأنظمة التوصية، وتعلم المتتاليات sequence (ترجمة، كلام-إلى-نص حيث تتغير الأطوال). في غير المراقَب unsupervised لا تسميات: تجميع، وتقدير مبادئ، وتمثيلات؛ والتعلم الذاتي self-supervised يستخرج الإشراف من البيانات نفسها (ملء الفراغات). وعند التفاعل مع بيئة تتغير بفعل أفعالنا يدخل التعلم المعزز RL: وكيل وسياسة policy ومكافآت متأخرة (مثل شطرنج: المكافأة آخر المباراة فقط) مع مشكلة إسناد الفضل ومقايضة الاستكشاف والاستغلال.',
          en: 'The problem map: in supervised learning examples arrive labeled, splitting into regression (how much? — a house price, surgery length), classification (which one? — binary or multiclass with probabilities and decision costs — do not eat the mushroom because a 20% chance of death outweighs any dinner!), multi-label tagging, search and ranking, recommender systems, and sequence learning (translation, speech-to-text, where lengths vary). In unsupervised learning there are no labels: clustering, subspace estimation, representations; self-supervised learning mines supervision from the data itself (fill in the blanks). And when interacting with an environment that our actions change, reinforcement learning enters: an agent, a policy, delayed rewards (chess pays only at the end), the credit-assignment problem, and the explore-vs-exploit trade.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'الحلقة كاملة: نزول اشتقاقي يتعلم الميل',
        en: 'The whole loop: gradient descent learns a slope',
      },
      code: "xs = [1.0, 2.0, 3.0, 4.0]\nys = [2.0, 4.0, 6.0, 8.0]\n\ndef mse(w):\n    return sum((w * x - y) ** 2 for x, y in zip(xs, ys)) / len(xs)\n\ndef grad(w):\n    return sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)\n\nw = 0.0\nlr = 0.05\nfor step in range(100):\n    if step in (0, 1, 2, 3, 99):\n        print('step %3d | w = %.4f | mse = %.4f' % (step, w, mse(w)))\n    w = w - lr * grad(w)\nprint('learned w = %.6f | predictions:' % w, [w * x for x in xs])",
      explanation: {
        ar: 'البيانات: الأزواج (x, y). النموذج: y=wx — معامل واحد يسمى هنا w. الخسارة: mse = متوسط (wx−y)². المُحسِّن: w ← w − lr·∇mse بأخذ متوسط 2(wx−y)x على النقاط. تبدأ w=0 بخسارة 30.0، وبعد خطوة واحدة 1.5 بخسارة 1.875، ثم 1.8750 ثم 1.9688 — كل خطوة تقص مسافة الربع المتبقية — وبعد 100 خطوة w = 2.0000 بخسارة 0.0000 والتنبؤات [2, 4, 6, 8] مطابقة تمامًا. الأربعة مكونات ظاهرة في ستة أسطر: هذا هو تدريب النماذج بلا مبالغة في التبسيط.',
        en: 'Data: the (x, y) pairs. Model: y=wx — one parameter, called w here. Loss: mse, the mean of (wx\u2212y)\u00b2. Optimizer: w \u2190 w \u2212 lr\u00b7\u2207mse with the gradient being the average of 2(wx\u2212y)x over the points. Starting at w=0 the loss is 30.0; after one step w=1.5 with loss 1.875, then 1.8750, then 1.9688 — each step closes three quarters of the remaining gap — and after 100 steps w = 2.0000 with loss 0.0000 and predictions [2, 4, 6, 8] matching exactly. Four components visible in six lines: model training, massively simplified.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.train-slope',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ train_w(xs, ys, lr, steps) التي تبدأ من w=0.0 وتكرر 100% من خطوات النزول الاشتقاقي بالمتوسط على النقاط: g = mean(2(w·x−y)·x) ثم w ← w − lr·g، وتعيد w النهائي.',
        en: 'Implement train_w(xs, ys, lr, steps) that starts from w=0.0 and repeats the mean gradient-descent step over the points: g = mean(2(w\u00b7x\u2212y)\u00b7x) then w \u2190 w \u2212 lr\u00b7g, returning the final w.',
      },
      starterCode: "def train_w(xs, ys, lr, steps):\n    w = 0.0\n    ...  # TODO: loop steps times, mean gradient, update w\n    return w\n",
      solution: "def train_w(xs, ys, lr, steps):\n    w = 0.0\n    n = len(xs)\n    for _ in range(steps):\n        g = sum(2 * (w * xs[i] - ys[i]) * xs[i] for i in range(n)) / n\n        w = w - lr * g\n    return w",
      tests: [
        {
          id: 't1',
          name: { ar: 'يتعلم الميل 2.0', en: 'It learns the slope 2.0' },
          code: "w = train_w([1.0, 2.0, 3.0, 4.0], [2.0, 4.0, 6.0, 8.0], 0.05, 100)\nassert abs(w - 2.0) < 1e-6, 'expected w near 2.0 | actual: %r' % w",
          expected: 'w = 2.0',
        },
        {
          id: 't2',
          name: { ar: 'يتعلم الميل 3.0 على هدف مضاعف', en: 'It learns the slope 3.0 on a doubled target' },
          code: "w = train_w([1.0, 2.0, 3.0, 4.0], [3.0, 6.0, 9.0, 12.0], 0.05, 100)\nassert abs(w - 3.0) < 1e-6, 'expected w near 3.0 | actual: %r' % w",
          expected: 'w = 3.0',
        },
        {
          id: 't3',
          name: { ar: 'الخسارة تنخفض بعيدًا عن بدايتها', en: 'The loss drops far below its start' },
          code: "def mse_at(w, xs, ys):\n    return sum((w * x - y) ** 2 for x, y in zip(xs, ys)) / len(xs)\n\nw = train_w([1.0, 2.0, 3.0, 4.0], [2.0, 4.0, 6.0, 8.0], 0.05, 100)\nassert mse_at(w, [1.0, 2.0, 3.0, 4.0], [2.0, 4.0, 6.0, 8.0]) < mse_at(0.0, [1.0, 2.0, 3.0, 4.0], [2.0, 4.0, 6.0, 8.0]) / 100, 'training must drive the loss far below its start'",
          expected: 'final mse << 30.0',
        },
      ],
      hints: [
        { ar: 'التدرج متوسط على النقاط: g = sum(2 * (w * xs[i] - ys[i]) * xs[i] for i in range(n)) / n — لا تنسَ القسمة.', en: 'The gradient averages over points: g = sum(2 * (w * xs[i] - ys[i]) * xs[i] for i in range(n)) / n — do not forget the division.' },
        { ar: 'التحديث داخل الحلقة: w = w - lr * g، والحلقة steps مرة بالضبط.', en: 'Update inside the loop: w = w - lr * g, repeated exactly steps times.' },
        { ar: 'قيم تحقق: البداية w=0 بخسارة 30.0؛ بعد خطوة واحدة w=1.5؛ بعد 100 خطوة w=2.0 لمقاربتنا ys=[2,4,6,8].', en: 'Sanity values: start w=0 with loss 30.0; after one step w=1.5; after 100 steps w=2.0 for ys=[2,4,6,8].' },
        { ar: 'التحديث يعمل لأي هدف مضاعف: ys=[3,6,9,12] يدفع w نحو 3.0 بنفس الخطوات — دالة واحدة تخدم الاختبارين.', en: 'The same step works for any scaled target: ys=[3,6,9,12] drives w toward 3.0 — one function serves both tests.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-problem-kinds',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'عندك 10,000 رسالة بريدية موسومة «مزعج/غير مزعج» وتريد نموذجًا يصنف رسائل جديدة. إلى أي نوع من تعلم الآلة تنتمي المهمة؟',
        en: 'You have 10,000 emails labeled "spam / not spam" and want a model to classify new messages. Which kind of machine learning task is this?',
      },
      options: [
        { id: 'a', text: { ar: 'تعلم مراقَب — تصنيف ثنائي', en: 'Supervised learning — binary classification' } },
        { id: 'b', text: { ar: 'تعلم غير مراقَب — تجميع', en: 'Unsupervised learning — clustering' } },
        { id: 'c', text: { ar: 'تعلم معزز — مكافآت متأخرة', en: 'Reinforcement learning — delayed rewards' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'العلامة الفارقة: هل وصلت الأمثلة موسومة من قبل مشرف؟', en: 'The tell: did the examples arrive already labeled by a supervisor?' },
        { ar: 'موسومة + هدف فئوي من فئتين (مزعج/غير مزعج) = تصنيف ثنائي مراقَب بالتعريف.', en: 'Labeled examples plus a two-way categorical target (spam / not spam) = binary supervised classification by definition.' },
        { ar: 'التجميع غير المراقَب لا يرى تسميات إطلاقًا، والمعزز يتعلم من مكافآت بعد أفعال لا من تسميات جاهزة.', en: 'Unsupervised clustering never sees labels at all, and reinforcement learns from rewards after actions, not from ready-made labels.' },
        { ar: 'الجواب: a — الأمثلة موسومة مسبقًا والمخرج فئة من اثنتين.', en: 'Answer: a — the examples come pre-labeled and the output is one of two classes.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "xs = [1.0, 2.0, 3.0, 4.0]\nys = [2.0, 4.0, 6.0, 8.0]\n\ndef grad(w):\n    return sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)\n\ndef mse(w):\n    return sum((w * x - y) ** 2 for x, y in zip(xs, ys)) / len(xs)\n\nfor lr in [0.05, 0.2, 0.3]:\n    w = 0.0\n    for _ in range(20):\n        w = w - lr * grad(w)\n    print('lr=%.2f -> w after 20 steps = %.4f | mse = %.6f' % (lr, w, mse(w)))\n\n# جرّب: فسّر كل سطر. أي معدل تعلم يتأرجح ويتباعد إلى ما لا نهاية، ولماذا؟\n# try: explain each row. Which learning rate overshoots forever, and why?\n# جرّب: غيّر ys إلى [1.0, 2.0, 3.0, 4.0] (الهدف w = 1.0) وأعد التشغيل.\n# try: change ys to [1.0, 2.0, 3.0, 4.0] (target w = 1.0) and rerun.\n",
      prompt: {
        ar: 'الملعب يفحص حساسية معدل التعلم: 0.05 يستقر عند 2.0، و0.2 يتأرجح ويتباعد، و0.3 ينفجر. النموذج نفسه والبيانات نفسها — المُحسِّن وحده غيّر المصير.',
        en: 'The sandbox probes learning-rate sensitivity: 0.05 settles at 2.0, 0.2 oscillates and diverges, 0.3 explodes. Same model, same data — the optimizer alone changed the outcome.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما دور دالة الخسارة loss function في حلبة التدريب؟',
            en: 'What role does the loss function play in the training loop?',
          },
          options: [
            { id: 'a', text: { ar: 'تولّد أمثلة تدريب جديدة', en: 'It generates new training examples' } },
            { id: 'b', text: { ar: 'تقيس سوء مطابقة التنبؤات للأهداف، وخفضها هو هدف المُحسِّن', en: 'It scores how badly predictions match targets, and minimizing it is the optimizer\u2019s goal' } },
            { id: 'c', text: { ar: 'تخزن البيانات على القرص', en: 'It stores data on disk' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الخسارة رقم واحد يلخّص جودة النموذج على الدفعة (مثل متوسط مربعات الخطأ)؛ والمحسِّن يقرأ تدرجها بالنسبة للمعاملات ليعرف اتجاه التعديل. اتفاقية: الأدنى أفضل.',
            en: 'The loss is a single number summarizing model quality on the batch (like mean squared error); the optimizer reads its gradient with respect to the parameters to choose the update direction. Convention: lower is better.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'تريد تجميع مستخدمي موقع حسب سلوك تصفحهم دون أي تسميات. أي نوع؟',
            en: 'You want to group website users by browsing behavior with no labels at all. Which kind?',
          },
          options: [
            { id: 'a', text: { ar: 'انحدار مراقَب', en: 'Supervised regression' } },
            { id: 'b', text: { ar: 'تجميع غير مراقَب', en: 'Unsupervised clustering' } },
            { id: 'c', text: { ar: 'تعلم معزز بوكيل وسياسة', en: 'Reinforcement learning with an agent and policy' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'لا تسميات إطلاقًا — المسألة «اكتشف بنية في البيانات» وهي التجميع clustering من عائلة غير المراقَب. المراقَب يحتاج أهدافًا، والمعزز يحتاج بيئة ومكافآت.',
            en: 'No labels exist — the task is discovering structure in data, which is clustering from the unsupervised family. Supervised needs targets; reinforcement needs an environment and rewards.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا نحتفظ بمجموعة اختبار test set لا يراها التدريب؟',
            en: 'Why hold out a test set the training never sees?',
          },
          options: [
            { id: 'a', text: { ar: 'لتسريع حساب التدرج', en: 'To speed up gradient computation' } },
            { id: 'b', text: { ar: 'لتقدير الأداء على بيانات لم تُرَ — التفوق على التدريب وحده قد يكون حفظًا (تلائم زائد)', en: 'To estimate performance on unseen data — doing well on training alone may be memorization (overfitting)' } },
            { id: 'c', text: { ar: 'لأن الخوارزميات تتطلب عددًا فرديًا من النقاط', en: 'Because algorithms require an odd number of points' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كطالب يحفظ أسئلة التدريب ثم يفشل في الامتحان الفعلي: النموذج قد يتلائم زائدًا مع دفعة التدريب. الاختبار المحجوز هو مقياسنا للتعميم.',
            en: 'Like a student memorizing practice questions then failing the final: a model can overfit its training batch. The held-out test set is our measure of generalization.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التعلم = ضبط المعاملات من البيانات بدل كتابة القواعد: نجمع أمثلة موسومة ونضبط «مفاتيح» نموذج مرن — برمجة بالبيانات (الهدف من s1 المثال المحفز).', en: 'Learning = tuning parameters from data instead of writing rules: collect labeled examples and adjust a flexible model\u2019s knobs — programming with data (goal of s1 A Motivating Example).' },
        { ar: 'أربعة مكونات دائمة: بيانات (سمات + تسميات)، نموذج، دالة خسارة، ومُحسِّن — وقد جسّدها نزول اشتقاقي أوصل w من 0.0 إلى 2.0 في 100 خطوة (الهدف من s2 المكونات الأساسية).', en: 'Four permanent components: data (features + labels), a model, a loss function, and an optimizer — embodied by gradient descent taking w from 0.0 to 2.0 in 100 steps (goal of s2 Key Components).' },
        { ar: 'خريطة الأنواع: مراقَب (انحدار/تصنيف/وسم/بحث/توصية/متتاليات)، وغير مراقَب وذاتي الإشراف، وتفاعلي مع تعلم معزز يعالج المكافآت المتأخرة (الهدف من s3 أنواع مشاكل تعلم الآلة).', en: 'The kind map: supervised (regression / classification / tagging / search / recommendation / sequences), unsupervised and self-supervised, and interactive reinforcement learning with delayed rewards (goal of s3 Kinds of Machine Learning Problems).' },
      ],
      reflectPrompt: {
        ar: 'اختر مهمة من عملك اليومي: هل يمكن كتابتها بقواعد صريحة أم يجب أن تُتعلم من أمثلة؟ وما أرخص تسمية ممكنة لو أردت تحويلها إلى مشكلة مراقَبة صغيرة مثل w=wx؟',
        en: 'Pick a task from your daily work: could it be written as explicit rules, or must it be learned from examples? And what would the cheapest labeling look like if you turned it into a tiny supervised problem like w=wx?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch1.s1' },
        { book: 'D2L', section: 'd2l.ch1.s2' },
        { book: 'D2L', section: 'd2l.ch1.s3' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch1.s1' },
    { book: 'D2L', section: 'd2l.ch1.s2' },
    { book: 'D2L', section: 'd2l.ch1.s3' },
  ],
} satisfies Lesson;

export default lesson;
