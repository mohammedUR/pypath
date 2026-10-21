import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch12.l1 — "Why Optimization Is Hard: Convexity and Gradient Descent"
 * لماذا التحسين صعب: التحدب والنزول التدريجي
 * Aligned with D2L ch12 s1 (Optimization and Deep Learning) + s2 (Convexity)
 * + s3 (Gradient Descent). All expression is original — a paraphrase of the
 * source's ideas, never a verbatim translation. Runnable design: midpoint
 * convexity checks on fixed pairs plus 1-D/2-D gradient descent with verified
 * per-step floats. Every literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch12.l1',
  version: 1,
  part: 'II',
  track: 'A7',
  book: 'D2L',
  chapter: 12,
  title: {
    ar: 'لماذا التحسين صعب: التحدب والنزول التدريجي',
    en: 'Why Optimization Is Hard: Convexity and Gradient Descent',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch11.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل نموذج دربته حتى الآن كان يقوده مُحسِّن صامت: خوارزمية تُنقص دالة الخسارة خطوة بعد خطوة. لكن اختيار معدل التعلم قد يجعل التدريب بطيئًا للغاية أو منفجرًا، وفهم سبب ذلك يبدأ من التحدب. في هذا الدرس نفحص التحدب باختبار منتصف القطعة على نقاط ثابتة، ثم نشغّل النزول التدريجي بمعدلات تعلم ثلاثة لنرى بعيوننا: تباطؤًا، ووصولًا، وانفجارًا.',
        en: 'Every model you have trained so far was steered by a silent optimizer: an algorithm that lowers the loss step by step. But the learning rate can make training slow as mud or explosive, and understanding why starts with convexity. In this lesson we test convexity with a midpoint check on fixed pairs, then run gradient descent at three learning rates to watch, with our own eyes: crawling, converging, and blowing up.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التحسين مقابل التعلم، التحدب، والنزول التدريجي', en: 'Optimization vs learning, convexity, and gradient descent' },
      chunks: [
        {
          ar: 'الهدفان مختلفان. المُحسِّن يعمل على تقليل دالة الهدف — وهي عادةً خسارة التدريب — أما التعلم العميق فيريد تقليل خطأ التعميم على بيانات لم يرها. الفجوة بينهما هي فرط التخصيص: خسارة تدريب منخفضة لا تعني نموذجًا جيدًا، لذا نحتاج قيودًا وتنظيمًا إلى جانب التحسين نفسه. أغلب مسائل التعلم العميق غير محدبة، لكن تحليل الحالة المحدبة يمنحنا حدسًا وخوارزميات تنجح خارجها أيضًا. لاحظ أيضًا أن خوارزميات التحسين تُصغَّر عادةً؛ وما إن نريد التكبير حتى نعكس إشارة الهدف.',
          en: 'The two goals differ. An optimizer minimizes an objective function — usually the training loss — while deep learning wants a low generalization error on data it has never seen. The gap between them is overfitting: a low training loss does not mean a good model, so we need regularization and constraints on top of optimization. Most deep learning problems are nonconvex, yet analyzing the convex case yields intuition and algorithms that keep working outside it. Note also that optimizers are built to minimize; to maximize anything, just flip the sign of the objective.',
        },
        {
          ar: 'المجموعة محدبة إذا كانت القطعة الواصلة بين أي نقطتين منها تبقى داخلها، والدالة محدبة إذا كانت لا تعلو خطها الواصل: λ·f(x) + (1−λ)·f(x′) ≥ f(λx + (1−λ)x′) لكل λ بين 0 و1 — هذا هو اختبار منتصف القطعة الذي نشغّله في المثال. نتيجة لطيفة: متباينة Jensen تعممها على المتوسطات، وأي صغْر محلي لدالة محدبة هو صغْرٌ شامل، فلا طريقة «لعلوق» في وادٍ جانبي. كما أن المجموعات السفلية {x : f(x) ≤ b} لدالة محدبة محدبة نفسها، وفي حالة الاشتقاق الثاني يكفي فحص أن f″ ≥ 0.',
          en: 'A set is convex if the segment joining any two of its points stays inside, and a function is convex if it never lies above its chord: λ·f(x) + (1−λ)·f(x′) ≥ f(λx + (1−λ)x′) for every λ in [0, 1] — the midpoint test we run in the worked example. A nice payoff: Jensen\u2019s inequality generalizes it to averages, and any local minimum of a convex function is a global one, so there is no way to get stuck in a side valley. Also, below-sets {x : f(x) ≤ b} of a convex function are themselves convex, and for twice-differentiable functions it suffices that f″ ≥ 0.',
        },
        {
          ar: 'النزول التدريجي يستند إلى تقريب تايلور من الرتبة الأولى: للحركة الصغيرة ε تنخفض f إذا سلكنا عكس التدرج، فيصبح التحديث x ← x − η·f′(x) بمعدل تعلم η ثابت. معدل صغير جدًا يزحف (بعد 10 خطوات بـ η=0.05 لا نزال بعيدًا)، ومعدل كبير جدًا يتجاوز الصغْر ويتباعد (بـ η=1.1 على f(x)=x² تنفجر x). وفي الأبعاد المتعددة يظهر «الوادي الضيق»: اتجاهات ذات انحناء شديد وأخرى مسطحة تجعل اختيار η واحدًا صعبًا — وهذا يمهد لـ momentum وadagrad لاحقًا. أما طريقة Newton فتدفع ثمن مقلوب Hessian: دقيقة لكنها محظورة عمليًا في الشبكات العميقة.',
          en: 'Gradient descent rests on a first-order Taylor expansion: for a small step ε, f decreases if we walk against the gradient, giving the update x ← x − η·f′(x) with a fixed learning rate η. Too small a rate crawls (after 10 steps at η=0.05 we are still far away); too large a rate overshoots the minimum and diverges (η=1.1 on f(x)=x² makes x explode). In multiple dimensions the narrow-canyon problem appears: some directions curve sharply while others are flat, which is why one global η is hard to pick — foreshadowing momentum and adagrad. Newton\u2019s method pays for the inverse Hessian: exact, but infeasible for deep networks.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'اختبار التحدب بالمنتصف + النزول التدريجي بثلاثة معدلات',
        en: 'The midpoint convexity test + gradient descent at three rates',
      },
      code: "import math\n\nsq = lambda x: x * x                      # convex\ncospi = lambda x: math.cos(math.pi * x)   # nonconvex\n\ndef margin(f, x, xp, lam):\n    \"\"\"chord value minus function value at the interpolated point.\"\"\"\n    chord = lam * f(x) + (1 - lam) * f(xp)\n    mid = lam * x + (1 - lam) * xp\n    return chord - f(mid)\n\nprint('x^2   pair (-2.0, 1.5), lam=0.3 -> margin %+.6f' % margin(sq, -2.0, 1.5, 0.3))\nprint('x^2   pair (10.0, 4.0), lam=0.5 -> margin %+.6f' % margin(sq, 10.0, 4.0, 0.5))\nprint('cos(pi x) pair (-1.5, 1.0), lam=0.5 -> margin %+.6f' % margin(cospi, -1.5, 1.0, 0.5))\n\ndef gd(eta, steps, x0=10.0):\n    x = x0\n    for _ in range(steps):\n        x -= eta * (2 * x)      # gradient of x^2 is 2x\n    return x\n\nprint('gd x^2, eta=0.05, 10 steps -> x = %.6f' % gd(0.05, 10))\nprint('gd x^2, eta=0.20, 10 steps -> x = %.6f' % gd(0.20, 10))\nprint('gd x^2, eta=1.10, 10 steps -> x = %.6f' % gd(1.10, 10))\n\nx1, x2 = -5.0, -2.0\nfor _ in range(20):\n    x1 -= 0.1 * (2 * x1)        # f = x1^2 + 2 x2^2\n    x2 -= 0.1 * (4 * x2)\nprint('2-D gd, eta=0.1, 20 steps -> x1 = %.6f, x2 = %.6f' % (x1, x2))",
      explanation: {
        ar: 'هامش الاختبار للدالة المربّعة موجب في الزوجين (2.5725 و9.0000): الوتر يعلو الدالة، وهي محدبة. أما cos(πx) فالهامش −1.207107 سالب: انكسر شرط التحدب، فهي غير محدبة. في النزول التدريجي على x² من x=10 بعد 10 خطوات: η=0.05 تصل 3.486784 (زحف بطيء)، η=0.2 تصل 0.060466 (تقارب نظيف لأن مضاعف الخطوة 0.6)، وη=1.1 تصل 61.917364 (انفجار لأن المضاعف −1.2 يكبّر البعد عن الصغْر كل خطوة). وفي الوادي ثنائي الأبعاد من (−5, −2) بمعدل 0.1 وصلنا (−0.057646, −0.000073): كل اتجاه يتقلص بمضاعف ثابت مختلف، 0.8 و0.6.',
        en: 'The test margin for the square is positive on both pairs (2.5725 and 9.0000): the chord sits above the function, so it is convex. For cos(πx) the margin is −1.207107: the convexity condition breaks, so it is nonconvex. In gradient descent on x² from x=10 after 10 steps: η=0.05 reaches 3.486784 (slow crawl), η=0.2 reaches 0.060466 (clean convergence, since the per-step factor is 0.6), and η=1.1 reaches 61.917364 (blow-up, because the factor −1.2 magnifies the distance to the minimum every step). In the 2-D valley from (−5, −2) with rate 0.1 we land at (−0.057646, −0.000073): each axis shrinks by its own constant factor, 0.8 and 0.6.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.gd-parabola',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ gd_parabola(eta, steps) للدالة f(x) = (x−1)² مشتقّتها f′(x) = 2(x−1)، بدءًا من x=10.0. أعِد قائمة المسار trajectory فيها الموضع الابتدائي ثم كل موضع بعد التحديث. القاعدة: x ← x − eta·2(x−1).',
        en: 'Implement gd_parabola(eta, steps) for f(x) = (x−1)² with derivative f′(x) = 2(x−1), starting from x=10.0. Return the trajectory list holding the initial position followed by every post-update position. Rule: x ← x − eta·2(x−1).',
      },
      starterCode: "def gd_parabola(eta, steps):\n    x = 10.0\n    trajectory = [x]\n    # TODO: loop steps times: x = x - eta * 2 * (x - 1); append x\n    return trajectory\n",
      solution: "def gd_parabola(eta, steps):\n    x = 10.0\n    trajectory = [x]\n    for _ in range(steps):\n        x = x - eta * 2 * (x - 1)\n        trajectory.append(x)\n    return trajectory",
      tests: [
        {
          id: 't1',
          name: { ar: 'المسار طوله steps+1', en: 'Trajectory has steps+1 entries' },
          code: "traj = gd_parabola(0.2, 10)\nassert len(traj) == 11 and traj[0] == 10.0, 'expected 11 entries starting at 10.0 | got len=%d' % len(traj)",
          expected: '11 entries, first = 10.0',
        },
        {
          id: 't2',
          name: { ar: 'النقطة النهائية مطابقة رياضيًا', en: 'Final point matches the closed form' },
          code: "traj = gd_parabola(0.2, 10)\nwant = 1.0 + 9.0 * 0.6 ** 10\nassert abs(traj[-1] - want) < 1e-9, 'expected %r | got %r' % (want, traj[-1])",
          expected: '1.0544195584',
        },
        {
          id: 't3',
          name: { ar: 'الخسارة تتناقص رتيبًا على المسار', en: 'Loss decreases monotonically along the path' },
          code: "traj = gd_parabola(0.2, 10)\nlosses = [(x - 1.0) ** 2 for x in traj]\nassert all(losses[i + 1] < losses[i] for i in range(len(losses) - 1)), 'loss must strictly decrease every step'\nassert abs(traj[-1] - 1.0) < 0.06, 'after 10 steps we should be near x=1 | got %r' % traj[-1]",
          expected: 'strictly decreasing, near x=1',
        },
      ],
      hints: [
        { ar: 'ابدأ من x=10.0 وألحق القيمة بالقائمة قبل الحلقة وبعد كل تحديث، حتى يكون الطول steps+1.', en: 'Start from x=10.0 and append the value before the loop and after every update, so the length is steps+1.' },
        { ar: 'التحديث سطر واحد: x = x - eta * 2 * (x - 1) — مشتقة (x−1)² هي 2(x−1).', en: 'The update is one line: x = x - eta * 2 * (x - 1) — the derivative of (x−1)² is 2(x−1).' },
        { ar: 'قيمة تحقق: بعد 10 خطوات بـ eta=0.2 تصبح x = 1 + 9·0.6¹⁰ = 1.0544195584 لأن كل خطوة تضرب المسافة إلى 1 في 0.6.', en: 'Sanity value: after 10 steps at eta=0.2, x = 1 + 9·0.6¹⁰ = 1.0544195584, because each step multiplies the distance to 1 by 0.6.' },
        { ar: 'للاختبار الثالث احسب الخسارة (x−1)² على كل موضع وتأكد أنها تتناقص صرامةً من خطوة إلى التالية.', en: 'For the third test compute the loss (x−1)² at every position and check it strictly decreases from one step to the next.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-convex-minima',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'دالة محدبة على مجموعة محدبة وصلت إلى صغْرٍ محلي في نقطة x*. ماذا نعلم عن هذا الصغْر؟',
        en: 'A function that is convex on a convex set has reached a local minimum at a point x*. What do we know about that minimum?',
      },
      options: [
        { id: 'a', text: { ar: 'إنه بالضرورة صغْر شامل — لا يمكن العلوق في وادٍ جانبي', en: 'It is necessarily a global minimum — there is no side valley to get stuck in' } },
        { id: 'b', text: { ar: 'قد يكون صغْرًا محليًا خبيثًا بعيدًا عن الأمثل', en: 'It may be a nasty local minimum far from optimal' } },
        { id: 'c', text: { ar: 'لا علاقة للتحدب بموضع الصغائر إطلاقًا', en: 'Convexity says nothing about where minima sit' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'أعد التفكير في اختبار منتصف القطعة: إذا وُجدت نقطة أفضل من x*، فإن نقطة على القطعة بينها وبين x* تكون أفضل من x* أيضًا.', en: 'Revisit the midpoint test: if a better point x′ existed, some point on the segment between x′ and x* would be better than x* too.' },
        { ar: 'هذا تناقض مع كون x* صغْرًا محليًا، فالفرضية تسقط.', en: 'That contradicts x* being a local minimum, so the assumption collapses.' },
        { ar: 'لهذا يريحنا تحليل الدوال المحدبة: النزول التدريجي لا يعلوق أبدًا في وادٍ ثانوي.', en: 'That is why convex analysis is comfortable: gradient descent can never get trapped in a secondary valley.' },
        { ar: 'الجواب: a — الخاصية الثمينة للتحدب في هذا الدرس.', en: 'Answer: a — the prized convexity property from this lesson.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\nmargin = lambda f, x, xp, lam: lam * f(x) + (1 - lam) * f(xp) - f(lam * x + (1 - lam) * xp)\n\nsq = lambda x: x * x\nquartic = lambda x: x ** 4\nexp2 = lambda x: math.exp(2 * x)\ncospi = lambda x: math.cos(math.pi * x)\n\nfor name, f in [('x^2', sq), ('x^4', quartic), ('exp(2x)', exp2), ('cos(pi x)', cospi)]:\n    m1 = margin(f, -2.0, 3.0, 0.4)\n    m2 = margin(f, 0.5, 2.5, 0.5)\n    print('%-9s margins: %+.6f, %+.6f -> %s' % (name, m1, m2,\n          'convex on these pairs' if m1 >= 0 and m2 >= 0 else 'convexity broken here'))\n\n# جرّب: امسح λ من 0 إلى 1 على زوج واحد وابحث عن أول λ يصبح عنده الهامش سالبًا.\n# try: sweep lam from 0 to 1 on one pair and find the first lam where the margin turns negative.\n# جرّب: شغّل النزول التدريجي على x^2 بمعدلات 0.9 و1.0 و1.05 وقارن السلوك عند حدا الاستقرار 1.0.\n# try: run gradient descent on x^2 at rates 0.9, 1.0 and 1.05 and compare behavior around the stability edge 1.0.\n",
      prompt: {
        ar: 'الملعب يفحص التحدب بأزواج ثابتة على أربع دوال، ثم يترك لك استكشاف حد الاستقرار. اختبار الهامش أداة تركيبية: نتيجة موجبة لا تثبت التحدب شمولًا، لكن نتيجة سالبة واحدة تكفي لنفيه.',
        en: 'The sandbox probes convexity with fixed pairs on four functions, then leaves the stability edge to you. The margin test is constructive: a positive result does not prove convexity everywhere, but a single negative result is enough to refute it.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الفرق الجوهري بين هدف المُحسِّن وهدف التعلم العميق؟',
            en: 'What is the essential difference between an optimizer\u2019s goal and deep learning\u2019s goal?',
          },
          options: [
            { id: 'a', text: { ar: 'المُحسِّن يقلل خسارة التدريب، والتعلم العميق يريد خفض خطأ التعميم', en: 'The optimizer minimizes training loss, while deep learning wants low generalization error' } },
            { id: 'b', text: { ar: 'المُحسِّن يعظّم الدقة والتعلم يقلّل الخسارة', en: 'The optimizer maximizes accuracy while learning minimizes loss' } },
            { id: 'c', text: { ar: 'لا فرق — الهدفان متطابقان تمامًا', en: 'No difference — the two goals are identical' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'دالة الهدف تُبنى على بيانات التدريب، فتقليلها لا يضمن الأداء على بيانات جديدة؛ لذلك يرافق التحسين تنظيم وقيود لمقاومة فرط التخصيص. الفجوة بين الخسارتين هي جوهر المشكلة.',
            en: 'The objective is built on training data, so minimizing it does not guarantee performance on new data; that is why optimization is paired with regularization and constraints against overfitting. The gap between the two losses is the heart of the problem.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'على f(x) = x² من x = 10، لماذا يتقارب النزول التدريجي بـ η=0.2 ويتباعد بـ η=1.1؟',
            en: 'On f(x) = x² from x = 10, why does gradient descent converge at η=0.2 but diverge at η=1.1?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن التحديث يضرب x في (1 − 2η): 0.6 يقلّصه بينما −1.2 يكبّره', en: 'The update multiplies x by (1 − 2η): 0.6 shrinks it while −1.2 magnifies it' } },
            { id: 'b', text: { ar: 'لأن η=1.1 يجعل المشتقة تساوي صفرًا', en: 'Because η=1.1 makes the derivative zero' } },
            { id: 'c', text: { ar: 'لأن x² غير محدبة عند η كبير', en: 'Because x² becomes nonconvex for large η' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الخطوة على هذا المربع تعيد كتابة x كـ (1−2η)·x: عندما |1−2η|<1 يقترب الحل من الصفر، وعندما |1−2η|>1 — كما في 1.1 — يتضخم البعد عن الصغْر كل خطوة حتى يبلغ 61.917364 بعد 10 خطوات.',
            en: 'On this quadratic each step rewrites x as (1−2η)·x: when |1−2η|<1 the solution approaches zero, and when |1−2η|>1 — as with 1.1 — the distance to the minimum inflates every step, hitting 61.917364 after 10 steps.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا لا تُستخدم طريقة Newton مباشرة في التعلم العميق؟',
            en: 'Why is Newton\u2019s method not used directly in deep learning?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنها لا تتقارب على الدوال المحدبة', en: 'Because it fails to converge on convex functions' } },
            { id: 'b', text: { ar: 'لأنها تتطلب Hessian بحجم O(d²) وتكلفة حسابه ومقلوبه محظورة عمليًا', en: 'It needs an O(d²) Hessian whose computation and inversion are practically prohibitive' } },
            { id: 'c', text: { ar: 'لأنها لا تستخدم التدرج إطلاقًا', en: 'Because it never uses gradients at all' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'Hessian مصفوفة d×d: تخزينها ومضاعفتها ومقلوبها مكلف للغاية حين يبلغ عدد المعاملات الملايين، لذا تُستخدم بدائل من الرتبة الأولى تحاكي فوائدها — وهذا ما سنبنيه في بقية الفصل.',
            en: 'The Hessian is a d×d matrix: storing, multiplying, and inverting it is prohibitively expensive when parameters number in the millions, so first-order methods that imitate its benefits dominate — which is what the rest of the chapter builds.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التحسين يقلل خسارة التدريب بينما التعلم العميق يستهدف التعميم؛ الفجوة فرط تخصيص يُدار بالتنظيم لا بالتحسين وحده (الهدف من s1 التحسين والتعلم العميق).', en: 'Optimization lowers training loss while deep learning targets generalization; the gap is overfitting, managed by regularization rather than optimization alone (goal of s1 Optimization and Deep Learning).' },
        { ar: 'التحدب يُختبر بمتباينة الوتر λ·f(x)+(1−λ)·f(x′) ≥ f(النقطة المُقحمة)، ويضمن أن الصغْر المحلي شامل (الهدف من s2 التحدب).', en: 'Convexity is probed with the chord inequality λ·f(x)+(1−λ)·f(x′) ≥ f(interpolated point), and it guarantees local minima are global (goal of s2 Convexity).' },
        { ar: 'النزول التدريجي x ← x − η·f′(x) حساس جدًا لـ η: صغير يزحف وكبير ينفجر؛ والوادي غير المنتظم في الأبعاد الأعلى يمهد للأساليب التكيفية (الهدف من s3 النزول التدريجي).', en: 'Gradient descent x ← x − η·f′(x) is acutely sensitive to η: small crawls, large explodes; the ill-conditioned valley in higher dimensions foreshadows adaptive methods (goal of s3 Gradient Descent).' },
      ],
      reflectPrompt: {
        ar: 'في مشروعك القادم سيكون لسطح الخسارة اتجاهان بارزان شديد التفاوت في الانحناء. أي بصمة من سلوك النزول التدريجي في المثال المُشغَّل ستبحث عنها في منحنى الخسارة لتشخيص الوادي الضيق قبل تغيير الخوارزمية؟',
        en: 'Your next loss surface will have two directions of wildly different curvature. Which signature from the runnable gradient-descent behavior will you look for in the loss curve to diagnose the narrow canyon before switching algorithms?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch12.s1' },
        { book: 'D2L', section: 'd2l.ch12.s2' },
        { book: 'D2L', section: 'd2l.ch12.s3' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch12.s1' },
    { book: 'D2L', section: 'd2l.ch12.s2' },
    { book: 'D2L', section: 'd2l.ch12.s3' },
  ],
} satisfies Lesson;

export default lesson;
