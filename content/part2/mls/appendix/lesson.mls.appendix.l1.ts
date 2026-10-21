import type { Lesson } from '@/lib/content/schema';

/**
 * mls.appendix.l1 — "Derivatives and Gradient Descent"
 * المشتقات والنزول التدريجي
 * Aligned with the book's appendix (Derivatives and Gradient Descent).
 * Fixed convex bowl f(w) = (w-3)^2 + 2 with analytic derivative 2(w-3);
 * central difference and GD trajectories verified under CPython 3.
 * All runnable fields are pure stdlib — no libraries, no seeds needed.
 */
const lesson = {
  id: 'mls.appendix.l1',
  version: 1,
  part: 'II',
  track: 'A0',
  book: 'MLS',
  chapter: 8,
  title: {
    ar: 'المشتقات والنزول التدريجي',
    en: 'Derivatives and Gradient Descent',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.appa.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل نموذج قابليناه حتى الآن — من الانحدار الخطي إلى الشبكة العصبية — كان يبحث عن معاملات تقلل خسارة، والنزول التدريجي هو المحرك المشترك لهذا البحث. قبل أن نثق به على شبكة بألف معامل، نجرّبه على وعاء بمعة واحدة f(w) = (w-3)² + 2 حيث نعرف الحل الحقيقي: w = 3. ستتحقق من أن المشتقة العددية تطابق التحليلية، وستشاهد بيديك ما يفعله معدل التعلم السيئ.',
        en: 'Every model we have fitted — from linear regression to the neural network — searched for parameters that minimize a loss, and gradient descent is the shared engine of that search. Before trusting it on a thousand-weight network, test it on a one-parameter bowl f(w) = (w-3)² + 2 where the true answer is known: w = 3. You will verify that the numerical derivative matches the analytic one, and watch with your own eyes what a bad learning rate does.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'المشتقة عدديًا وتحليليًا، ثم خطوات النزول', en: 'Derivatives numerically and analytically, then descent steps' },
      chunks: [
        {
          ar: 'مشتقة الدالة عند نقطة هي ميلها المحلي: مقدار تغير f لحدة التغير الصغير في w. التحليليًا تعطينا قواعد الحساب الصيغ مباشرة — من ملحق الرياضيات في الكتاب: f(x) = x^a مشتقتها a·x^(a-1)، فمشتقة (w-3)² هي 2(w-3). عدديًا نقرّب الميل من قيم الدالة نفسها: الفرق الأمامي (f(w+h) - f(w))/h، والفرق المركزي (f(w+h) - f(w-h))/(2h) الذي يأخذ متوسط الميل على جانبي النقطة فيلغي خطأ الرتبة الأولى؛ الخطأ الباقي رتبته h². للمكافئ التربيعي تحديدًا يكون الفرق المركزي مضبوطًا حتى تقريب الفاصلة العائمة — وهذا اختبار ممتاز لصحة التنفيذ.',
          en: 'The derivative of a function at a point is its local slope: how sharply f changes for a tiny change in w. Analytically, calculus rules hand us closed forms — from the book\u2019s math appendix: f(x) = x^a differentiates to a·x^(a-1), so the derivative of (w-3)² is 2(w-3). Numerically we approximate the slope from function values alone: the forward difference (f(w+h) - f(w))/h, and the central difference (f(w+h) - f(w-h))/(2h), which averages the slope on both sides of the point and cancels the first-order error, leaving an error of order h². For a quadratic specifically the central difference is exact up to floating-point rounding — an excellent correctness test for an implementation.',
        },
        {
          ar: 'يصف الكتاب النزول التدريجي بخطوات ثابتة: اختر معدل تعلم η صغيرًا، وهيّئ المعاملات قيمة ابتدائية (عشوائيًا في نص الكتاب)، ثم كرر حتى عدد ثابت من التكرارات أو حتى يتوقف المعامل عن التغير: احسب δ = ∂L/∂β ثم حدّث β ← β - η·δ. التدرج يشير إلى جهة أصعد الخسارة، فالخطوة السالبة تنزلنا. على وعائنا (w-3)² + 2 يكون التحديث w ← w - η·2(w-3): كلما اقتربنا من 3 صغر التدرج فصغرت الخطوات تلقائيًا. لكن η كبيرة تجعل كل خطوة تتجاوز القاع إلى الجهة الأخرى — عند η = 1 تتأرجح بين نقطتين إلى الأبد، وفوق 1 تبتعد كل حقبة: هذا هو الاختلال الذي يخيفه الممارسون في الشبكات الكبيرة.',
          en: 'The book lays gradient descent out in fixed steps: choose a small learning rate η, instantiate the parameters at an initial guess (the book says to pick them randomly), then iterate for a fixed number of iterations or until the parameters barely move: compute δ = ∂L/∂β, then update β ← β - η·δ. The gradient points uphill, so the negative step walks down. On our bowl (w-3)² + 2 the update is w ← w - η·2(w-3): as w nears 3 the gradient shrinks and steps shrink with it. But a large η makes each step overshoot to the other side — at η = 1 the walk oscillates between two points forever, and above 1 it drifts away every epoch: the instability practitioners fear in large networks.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'وعاء واحد، مشتقتان، ثلاثة معدلات تعلم', en: 'One bowl, two derivatives, three learning rates' },
      code: "def f(w):\n    return (w - 3.0) ** 2 + 2.0\n\ndef df(w):\n    return 2.0 * (w - 3.0)\n\ndef grad_num(w, h=1e-5):\n    return (f(w + h) - f(w - h)) / (2.0 * h)\n\nprint('w     f(w)     analytic  central-diff')\nfor w in [0.0, 1.0, 3.0, 4.5]:\n    print('%.1f  %.4f  %+.4f    %+.6f' % (w, f(w), df(w), grad_num(w)))\n\nw = 0.0\nlr = 0.1\nfor step in range(15):\n    w = w - lr * df(w)\n    if step % 3 == 0 or step == 14:\n        print('step %2d  w=%.6f  f=%.6f' % (step, w, f(w)))\n\nprint('learning-rate sweep, 12 steps each from w=0:')\nfor lr in [0.1, 0.55, 1.0, 1.05]:\n    w = 0.0\n    for _ in range(12):\n        w = w - lr * df(w)\n    print('lr=%.2f -> w12=%.6f  f=%.6f' % (lr, w, f(w)))",
      explanation: {
        ar: 'الجدول الأول يطابق المشتقتين: عند w=1 مثلًا كلاهما -4.0000، وعند القاع w=3 تكون صفرًا — والفرق المركزي مضبوط حتى 1e-8 لأن الدالة تربيعية. ثم النزول بمعدل 0.1 من w=0: الخطوات 0.600000 ثم 1.771200 ثم 2.370854 ثم 2.677877 ثم 2.835073 حتى 2.894447 عند الخطوة 14 — زحف سليم نحو 3 والخسارة تنزل من 11.0 إلى 2.011141. مسح المعدلات يكشف الشخصيات الثلاث: 0.1 زاحف بطيء (w12=2.793842)، و0.55 يصل القاع تمامًا في 12 خطوة (3.000000) رغم أن كل خطوة تتجاوز الهدف قليلًا، و1.0 يتأرجح بين 0 و6 إلى الأبد (w12=0.000000)، و1.05 يهرب من القاع (w12=-6.415285 والخسارة 90.647594).',
        en: 'The first table matches the two derivatives: at w=1 both print -4.0000, and at the bottom w=3 both are zero — the central difference holds to 1e-8 because the function is quadratic. Then descent at rate 0.1 from w=0: steps 0.600000, 1.771200, 2.370854, 2.677877, 2.835073 up to 2.894447 at step 14 — a clean crawl toward 3 while the loss falls from 11.0 to 2.011141. The rate sweep exposes three personalities: 0.1 a slow crawler (w12=2.793842); 0.55 lands exactly on the bottom in 12 steps (3.000000) even though every step overshoots slightly; 1.0 oscillates between 0 and 6 forever (w12=0.000000); and 1.05 flees the bowl (w12=-6.415285, loss 90.647594).',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.central-diff',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ deriv(fn, w, h=1e-5) التي تعيد مشتقة الدالة fn عند w بالفرق المركزي: (fn(w+h) - fn(w-h)) / (2h). الدالة fn تدخل كوسيط — لا تفترض شيئًا عن صيغتها. الاختبارات تفحصها على الوعاء (w-3)²+2 وعلى مكعب w³.',
        en: 'Implement deriv(fn, w, h=1e-5) returning the derivative of fn at w via the central difference: (fn(w+h) - fn(w-h)) / (2h). The function fn arrives as an argument — assume nothing about its form. The tests probe it on the bowl (w-3)²+2 and on the cube w³.',
      },
      starterCode: "def f(w):\n    return (w - 3.0) ** 2 + 2.0\n\ndef g(w):\n    return w ** 3\n\ndef deriv(fn, w, h=1e-5):\n    ...  # TODO: central difference (fn(w + h) - fn(w - h)) / (2.0 * h)\n",
      solution: "def f(w):\n    return (w - 3.0) ** 2 + 2.0\n\ndef g(w):\n    return w ** 3\n\ndef deriv(fn, w, h=1e-5):\n    return (fn(w + h) - fn(w - h)) / (2.0 * h)",
      tests: [
        {
          id: 't1',
          name: { ar: 'مشتقة الوعاء عند w=1 تساوي -4', en: 'Bowl derivative at w=1 equals -4' },
          code: "assert abs(deriv(f, 1.0) - (-4.0)) < 1e-4, 'expected -4.0 | actual: %r' % deriv(f, 1.0)",
          expected: '-4.0',
        },
        {
          id: 't2',
          name: { ar: 'مشتقة الوعاء عند القاع w=3 تساوي 0', en: 'Bowl derivative at the bottom w=3 equals 0' },
          code: "assert abs(deriv(f, 3.0)) < 1e-4, 'expected 0.0 | actual: %r' % deriv(f, 3.0)",
          expected: '0.0',
        },
        {
          id: 't3',
          name: { ar: 'مشتقة المكعب عند w=2 تساوي 12', en: 'Cube derivative at w=2 equals 12' },
          code: "assert abs(deriv(g, 2.0) - 12.0) < 1e-4, 'expected 12.0 | actual: %r' % deriv(g, 2.0)",
          expected: '12.0',
        },
      ],
      hints: [
        { ar: 'الفكرة كلها سطر واحد: قيّم الدالة على جانبي النقطة بمسافة h ثم اقسم فرق القيم على عرض الفتحة 2h.', en: 'The whole idea is one line: evaluate the function on both sides at distance h, then divide the value gap by the bracket width 2h.' },
        { ar: 'انتبه لترتيب الأقواس: البسط (fn(w + h) - fn(w - h)) كامل قبل القسمة على (2.0 * h).', en: 'Mind the parentheses: the numerator (fn(w + h) - fn(w - h)) is complete before dividing by (2.0 * h).' },
        { ar: 'لا تستدعي df أو أي صيغة تحليلية داخل deriv — الوسيط fn يكفي، وهذه هي قوة الطريقة العددية: تعمل على أي دالة قابلة للتقييم.', en: 'Do not call df or any analytic formula inside deriv — the fn argument is enough; that is the numeric method\u2019s power: it works on any evaluable function.' },
        { ar: 'قيم تحقق: deriv(f, 1.0) ≈ -4.000000، وderiv(f, 3.0) ≈ 0.000000، وderiv(g, 2.0) ≈ 12.000000 — الخطأ الحقيقي أصغر من 1e-8.', en: 'Sanity values: deriv(f, 1.0) ≈ -4.000000, deriv(f, 3.0) ≈ 0.000000, deriv(g, 2.0) ≈ 12.000000 — the true error is below 1e-8.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.lr-oscillation',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: على الوعاء f(w) = (w-3)² + 2 مشتقتها 2(w-3)، ابدأ من w = 0 بمعدل تعلم η = 1.0 (تحديث w ← w - η·2(w-3)). كم تساوي w بعد خطوتين؟ أجب بعدد عائم.',
        en: 'Without running: on the bowl f(w) = (w-3)² + 2 with derivative 2(w-3), start at w = 0 with learning rate η = 1.0 (update w ← w - η·2(w-3)). What is w after two steps? Answer as a float.',
      },
      answer: '0.0',
      solution: '0.0',
      tolerance: 0.01,
      hints: [
        { ar: 'الخطوة الأولى: w1 = 0 - 1.0 · 2·(0 - 3) = 0 + 6 = 6.', en: 'First step: w1 = 0 - 1.0 · 2·(0 - 3) = 0 + 6 = 6.' },
        { ar: 'الخطوة الثانية: عند w=6 يكون التدرج 2·(6-3) = 6، فw2 = 6 - 1.0·6.', en: 'Second step: at w=6 the gradient is 2·(6-3) = 6, so w2 = 6 - 1.0·6.' },
        { ar: 'النتيجة العودة إلى نقطة البداية بالضبط: معدل 1.0 على تربيع يخلق مضاعف ارتداد -1 فيتأرجح المسير بين 0 و6 إلى الأبد دون أن يلمس القاع.', en: 'The result lands exactly back at the start: rate 1.0 on a quadratic creates a rebound multiplier of -1, so the walk bounces between 0 and 6 forever without touching the bottom.' },
        { ar: 'الجواب: 0.0', en: 'Answer: 0.0' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def f(w):\n    return (w - 3.0) ** 2 + 2.0\n\ndef df(w):\n    return 2.0 * (w - 3.0)\n\nfor lr in [0.05, 0.2, 0.5, 0.9, 1.0, 1.02]:\n    w = 0.0\n    path = []\n    for _ in range(8):\n        w = w - lr * df(w)\n        path.append(w)\n    print('lr=%.2f  w8=%9.4f  f=%9.4f  last3=%s' % (lr, w, f(w), ['%.2f' % v for v in path[-3:]]))\n\n# جرّب: من أين تأتي حدود الاستقرار؟ اكتب التحديث بصيغة w <- (1 - 2*lr)*w + 6*lr\n#      واقرأ المضاعف (1 - 2*lr): سالبه يعني تذبذبًا وقيمته المطلقة فوق 1 تعني تشتتًا.\n# try: where do the stability bounds come from? rewrite the update as\n#      w <- (1 - 2*lr)*w + 6*lr and read the multiplier (1 - 2*lr):\n#      negative means oscillation, absolute value above 1 means divergence.\n# جرّب: ابدأ من w=10 بدل 0 — هل تتغير حدود الاستقرار؟\n# try: start from w=10 instead of 0 — do the stability bounds move?\n",
      prompt: {
        ar: 'الملعب يمشي 8 خطوات لستة معدلات تعلم ويعرض آخر ثلاث مواضع. ابحث عن الحد الفاصل بين الزحف والتذبذب والتشتت، وتحقق من تفسير المضاعف (1 - 2·lr) في التعليق.',
        en: 'The sandbox walks 8 steps at six learning rates and shows the last three positions. Hunt the boundary between crawling, oscillating, and diverging, and check the multiplier explanation (1 - 2·lr) in the comments.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يُفضّل الفرق المركزي على الفرق الأمامي لتقريب المشتقة؟',
            en: 'Why is the central difference preferred over the forward difference for approximating a derivative?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يحتاج تقييمًا واحدًا فقط للدالة', en: 'Because it needs only one function evaluation' } },
            { id: 'b', text: { ar: 'لأن خطأه من رتبة h² بدل رتبة h، فهو أدق لنفس h', en: 'Because its error is order h² instead of order h, making it more accurate for the same h' } },
            { id: 'c', text: { ar: 'لأنه يعمل على الدوال غير القابلة للاشتقاق فقط', en: 'Because it only works on non-differentiable functions' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الفرق المركزي يوسط الميل على جانبي النقطة فيلغي حد الخطأ الأول؛ يبقى خطأ رتبة h². ثمنه تقييمان للدالة بدل واحد — مقايضة معقولة حين تكون الدالة رخيصة التقييم.',
            en: 'The central difference averages the slopes on both sides, cancelling the first-order error term and leaving O(h²). Its price is two evaluations instead of one — a fair trade when the function is cheap to evaluate.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'على وعائنا (w-3)² + 2، ماذا يفعل معدل التعلم η = 1.0 بالضبط؟',
            en: 'On our bowl (w-3)² + 2, what exactly does learning rate η = 1.0 do?',
          },
          options: [
            { id: 'a', text: { ar: 'يصل إلى الحل w = 3 في خطوة واحدة', en: 'It reaches the solution w = 3 in a single step' } },
            { id: 'b', text: { ar: 'يتأرجح بين قيمتين (0 و6 من نقطة البداية 0) إلى الأبد دون التقارب', en: 'It oscillates between two values (0 and 6 from the start 0) forever without converging' } },
            { id: 'c', text: { ar: 'يتقارب أسرع من 0.1 لكن مع تقريب أخشن', en: 'It converges faster than 0.1 but with a coarser approximation' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'على تربيع، التحديث يعاد كتابته w ← (1 - 2η)w + 6η؛ عند η = 1 يصبح المضاعف -1 فيقلب المسير حول القاع بين 0 و6 بلا نهاية. عند η فوق 0.5 يبدأ التذبذب وفوق 1 يشتت.',
            en: 'On a quadratic the update rewrites as w ← (1 - 2η)w + 6η; at η = 1 the multiplier is -1, flipping the walk around the bowl between 0 and 6 indefinitely. Oscillation begins above η = 0.5 and divergence above 1.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'متى نلجأ إلى النزول التدريجي أصلًا بدل حل المعادلة ∂L/∂β = 0 تحليليًا؟',
            en: 'When do we actually turn to gradient descent instead of solving ∂L/∂β = 0 analytically?',
          },
          options: [
            { id: 'a', text: { ar: 'حين لا يتوفر حل مغلق الصيغة — كالنماذج غير الخطية كالشبكات العصبية', en: 'When no closed-form solution exists — as with nonlinear models like neural networks' } },
            { id: 'b', text: { ar: 'حين تكون البيانات صغيرة جدًا', en: 'When the dataset is very small' } },
            { id: 'c', text: { ar: 'حين تكون الخسارة سالبة', en: 'When the loss is negative' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يضعها هكذا: إن أمكن وضع المشتقة صفرًا وحلها فعلنا (كالانحدار الخطي)؛ وإلا فالنزول التدريجي بحث تكراري عن قيمة تقريبية تقلل خسارة قابلة للاشتقاق — وهو الوضع القياسي في الشبكات.',
            en: 'The book frames it exactly so: if the derivative can be set to zero and solved, do that (as in linear regression); otherwise gradient descent iteratively approximates the parameters that minimize a differentiable loss — the standard situation for networks.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المشتقة = الميل المحلي. تحليليًا قواعد جاهزة (x^a ← a·x^(a-1))؛ عدديًا الفرق المركزي (f(w+h) - f(w-h))/(2h) بخطأ رتبة h² — ومضبوط حتى التقريب للدوال التربيعية.', en: 'The derivative is the local slope. Analytically, ready rules (x^a ← a·x^(a-1)); numerically, the central difference (f(w+h) - f(w-h))/(2h) with O(h²) error — exact up to rounding for quadratics.' },
        { ar: 'النزول التدريجي: η صغير، قيمة ابتدائية، ثم كرر δ = ∂L/∂β وβ ← β - η·δ حتى توقف ثابت أو تغير لا يُذكر. كل خطوة تصغر تلقائيًا كلما ضعف التدرج.', en: 'Gradient descent: small η, an initial guess, then repeat δ = ∂L/∂β and β ← β - η·δ until a fixed budget or a negligible change. Steps shrink on their own as the gradient weakens.' },
        { ar: 'على وعاء (w-3)²+2: معدل 0.1 يزحف إلى 2.894447 في 15 خطوة، و0.55 يصيب القاع في 12 خطوة، و1.0 يتأرجح بين 0 و6، و1.05 يشتت. المضاعف (1 - 2η) يفسر الشخصيات الثلاث.', en: 'On the bowl (w-3)²+2: rate 0.1 crawls to 2.894447 in 15 steps, 0.55 nails the bottom in 12 steps, 1.0 bounces between 0 and 6, and 1.05 diverges. The multiplier (1 - 2η) explains all three personalities.' },
      ],
      reflectPrompt: {
        ar: 'كتب الكتاب تهيئة المعاملات "عشوائيًا" بينما محركنا مزروع البذرة. متى يهم حقًا من أين بدأت — وعلى وعائنا المحدب بالتحديد، هل يمكن لقيمة البداية أن تحبس النزول في حل سيئ؟',
        en: 'The book says to instantiate the parameters randomly while our engine seeds everything. When does the starting point truly matter — and on this specific convex bowl, can any start trap descent in a bad local spot?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.A.s1' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.A.s1' },
  ],
} satisfies Lesson;

export default lesson;
