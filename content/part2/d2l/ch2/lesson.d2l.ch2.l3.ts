import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch2.l3 — "Autograd, Probability, and Reading the Docs"
 * التفاضل التلقائي والاحتمالات وعادة قراءة التوثيق
 * Aligned with D2L ch2 s5 (Automatic Differentiation) + s6 (Probability and
 * Statistics) + s7 (Documentation). All expression is original — a paraphrase
 * of the source's ideas, never a verbatim translation. Runnable design: the
 * platform module minigrad runs a Value chain y=(2x+1)^2 at x=2 (grad 20)
 * checked against the chain rule; a fixed 10-day sample turns frequencies
 * into probabilities; E[payoff]=1.80. Exercise 1 compares minigrad autograd
 * with finite differences. Every literal verified under CPython 3.
 */
const lesson = {
  id: 'd2l.ch2.l3',
  version: 1,
  part: 'II',
  track: 'A0',
  book: 'D2L',
  chapter: 2,
  title: {
    ar: 'التفاضل التلقائي والاحتمالات وعادة قراءة التوثيق',
    en: 'Autograd, Probability, and Reading the Docs',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch2.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الدرس السابق اشتققنا يدويًا. لكن شبكة بملايين المعاملات لا تحتمل الاشتقاق اليدوي — هنا يأتي التفاضل التلقائي autograd: بناء سلسلة الحسابات ثم تطبيق قاعدة السلسلة عكسيًا. ستشغّل محرك minigrad المصغر وتتحقق من تدرجه بمقارنة رقمية، ثم تنتقل إلى لغة عدم اليقين: ترددات تتحول إلى احتمالات، وتوقع ربح، ولماذا قد يخدعك اختبار دقيق عندما يكون المرض نادرًا.',
        en: 'Last lesson you differentiated by hand. But a network with millions of parameters cannot wait for hand work — enter automatic differentiation (autograd): record the computation, then apply the chain rule in reverse. You will run the platform\u2019s tiny minigrad engine and verify its gradient numerically, then switch to the language of uncertainty: frequencies becoming probabilities, an expected payoff, and why a very accurate test can still mislead when a disease is rare.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التفاضل التلقائي ثم الاحتمال ثم التوثيق', en: 'Autograd, then probability, then docs' },
      chunks: [
        {
          ar: 'الفكرة: كلما حسبت قيمة، يسجّل إطار العمل من يَنتج من مَن في مخطط حسابي computational graph؛ وعند الطلب على التدرج يمشي المخطط عكسيًا مضاعفًا المشتقات المحلية وفق قاعدة السلسلة — هذا هو backpropagation. في الكتاب: `x.requires_grad_(True)` ثم `y.backward()` ثم x.grad يعطي المشتقة دون اشتقاق يدوي. محركنا minigrad نفس الفكرة مصغرة: كل Value يحفظ قيمته ومن أنتجها، وbackward() تملأ grad. المثال y=(2x+1)\u00b2 عند x=2: بقاعدة السلسلة dy/da = 2a = 10 وda/dx = 2 فيكون dy/dx = 20 — وسيؤكدها المحرك رقميًا. لاحظ أيضًا أن التدرجات تتراكم في grad بين الاستدعاءات، لذا تُصفَّر قبل كل خطوة تدريب.',
          en: 'The idea: as you compute, the framework records who produced whom in a computational graph; when you ask for a gradient it walks the graph backwards, multiplying local derivatives via the chain rule — that is backpropagation. In the book: `x.requires_grad_(True)`, then `y.backward()`, then x.grad delivers the derivative with no hand work. Our minigrad engine is the same idea miniature: every Value stores its data and its producers, and backward() fills grad. For y=(2x+1)\u00b2 at x=2: dy/da = 2a = 10 and da/dx = 2, so dy/dx = 20 — the engine will confirm it numerically. Note too that gradients accumulate in grad between calls, so they are zeroed before each training step.',
        },
        {
          ar: 'الاحتمال لغة عدم اليقين: متغير عشوائي قيمته نتيجة لم تُحسم بعد، وتوزيعه يذكر احتمال كل نتيجة. من عينة نحسب ترددات، ومع نمو العينة تميل الترددات إلى الاحتمالات الحقيقية. الاحتمال الشرطي P(A|B) يقيّم A بعد رؤية B، والاستقلال يعني أن الرؤية لا تغير شيئًا. ونظرية بايز تربط: الاحتمال البعدي ∝ الامتكانية × الأولوي — لكن اختبر نادر الانتشار يجعل البعد الصحي منخفضًا رغم دقته، لأن الإنذارات الكاذبة تُجمع من جمهور الس quận الصحيح الضخم. والتوقع E[X] = Σ p\u1d62v\u1d62 هو متوسط مرجّح بالاحتمالات.',
          en: 'Probability is the language of uncertainty: a variable whose value is an undecided outcome, with a distribution assigning each outcome its chance. From a sample we count frequencies, and as the sample grows they settle toward true probabilities. Conditional probability P(A|B) scores A after seeing B; independence means seeing B changes nothing. Bayes\u2019 theorem ties it together: posterior \u221d likelihood \u00d7 prior — but a test for a rare condition still yields a low positive-patient probability despite high accuracy, because false alarms are collected from the enormous healthy population. The expectation E[X] = \u03a3 p\u1d62v\u1d62 is the probability-weighted average.',
        },
        {
          ar: 'عادة ثالثة صغيرة لكنها توفر ساعات: اقرأ التوثيق أولًا. dir(module) يعرض كل ما فيه (تجاهل الأسماء التي تبدأ بـ _)، وhelp(func) يجلب التفاصيل، وفي دفاتر Jupyter الاختصار func? يكفي. الكتاب يؤكد على خطوة ذكية: بعد قراءة الشرح شغّل اختبارًا صغيرًا يؤكد تفسيرك قبل أن تعتمد عليه. التوثيق الرسمي أوسع من أي كتاب، ومطالعة شيفرة المكتبات نفسها تجعلك مهندسًا أفضل — جرب help على دالة أنت تستخدمها فعلًا في هذا الفصل.',
          en: 'A third habit that saves hours: read the documentation first. dir(module) lists everything inside (skip names starting with _), help(func) brings the details, and in Jupyter the shortcut func? is enough. The book adds a smart step: after reading the description, run a tiny test that confirms your interpretation before relying on it. Official docs go far beyond any book, and reading library source code makes you a better engineer too — try help on a function you actually use in this chapter.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'سلسلة minigrad تتفقد نفسها + ترددات وتوقع',
        en: 'A minigrad chain checks itself + frequencies and expectation',
      },
      code: "from minigrad import Value\n\nx = Value(2.0)\na = 2 * x + 1\ny = a ** 2\ny.backward()\nchain = 2 * a.data * 2\nprint('y = %.2f | autograd dy/dx = %.2f | chain rule = %.2f' % (y.data, x.grad, chain))\n\ncounts = {'rain': 0, 'cloudy': 0, 'clear': 0}\ndays = ['rain', 'clear', 'rain', 'cloudy', 'rain', 'clear', 'rain', 'cloudy', 'rain', 'clear']\nfor d in days:\n    counts[d] += 1\nfor k in counts:\n    print('P(%s) = %.2f' % (k, counts[k] / len(days)))\n\npayoffs = [0.0, 2.0, 10.0]\nprobs = [0.5, 0.4, 0.1]\nprint('E[payoff] = %.2f' % sum(p * v for p, v in zip(probs, payoffs)))",
      explanation: {
        ar: 'المخطط سُجل خطوة بخطوة: x=2.0 ثم a=2x+1=5.0 ثم y=a\u00b2=25.0. بعد backward() يحمل x.grad قيمة 20.0، وقاعدة السلسلة اليدوية 2\u00b7a\u00b72 = 20.0 تطابقها حرفيًا. في الجزء الثاني عيّنة من 10 أيام ثابتة: المطر 5 مرات فP(rain)=0.50، غائم مرتين ف0.20، صافٍ ثلاثًا ف0.30 — التردد ÷ العينة. وأخيرًا توقع الدفع: 0.5\u00b70 + 0.4\u00b72 + 0.1\u00b710 = 1.80 — مجموع كل قيمة مضروبة باحتمالها.',
        en: 'The graph was recorded step by step: x=2.0, then a=2x+1=5.0, then y=a\u00b2=25.0. After backward(), x.grad holds 20.0, and the hand-applied chain rule 2\u00b7a\u00b72 = 20.0 matches it exactly. In the second part a fixed 10-day sample: rain fell 5 times so P(rain)=0.50, cloudy twice so 0.20, clear three times so 0.30 — frequency over sample size. Finally the expected payoff: 0.5\u00b70 + 0.4\u00b72 + 0.1\u00b710 = 1.80 — each value weighted by its probability.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.autograd-vs-finite-diff',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين وتحقق من اتفاقهما: finite_diff(fn, x, h=1e-5) بفرق مركزي، وautograd_grad(fn, x) عبر minigrad — أنشئ Value(x)، مرّرها لـ fn، نفّذ backward()، وأعد grad العقدة. ثم قارنهما على 3t\u00b2+2t و(2t+1)\u00b2.',
        en: 'Implement two functions and check they agree: finite_diff(fn, x, h=1e-5) with a central difference, and autograd_grad(fn, x) via minigrad — create Value(x), pass it to fn, run backward(), and return the node\u2019s grad. Then compare them on 3t\u00b2+2t and (2t+1)\u00b2.',
      },
      starterCode: "from minigrad import Value\n\ndef finite_diff(fn, x, h=1e-5):\n    ...  # TODO: (fn(x + h) - fn(x - h)) / (2 * h)\n\ndef autograd_grad(fn, x):\n    ...  # TODO: Value(x) -> fn(v) -> backward() -> return v.grad\n",
      solution: "from minigrad import Value\n\ndef finite_diff(fn, x, h=1e-5):\n    return (fn(x + h) - fn(x - h)) / (2 * h)\n\ndef autograd_grad(fn, x):\n    v = Value(float(x))\n    y = fn(v)\n    y.backward()\n    return v.grad",
      tests: [
        {
          id: 't1',
          name: { ar: 'الفرق المركزي يقترب من 14', en: 'Central difference approaches 14' },
          code: "f = lambda t: 3 * t ** 2 + 2 * t\nassert abs(finite_diff(f, 2.0) - 14.0) < 1e-4, 'expected 14 up to 1e-4 | actual: %r' % finite_diff(f, 2.0)",
          expected: '14 up to 1e-4',
        },
        {
          id: 't2',
          name: { ar: 'minigrad يعطي 14 تمامًا', en: 'minigrad gives exactly 14' },
          code: "f = lambda t: 3 * t ** 2 + 2 * t\nassert abs(autograd_grad(f, 2.0) - 14.0) < 1e-9, 'expected exactly 14 | actual: %r' % autograd_grad(f, 2.0)",
          expected: 'exactly 14.0',
        },
        {
          id: 't3',
          name: { ar: 'اتفاق الطرفين على سلسلة التركيب', en: 'Both agree on the composed chain' },
          code: "g = lambda t: (2 * t + 1) ** 2\nfd = finite_diff(g, 2.0)\nag = autograd_grad(g, 2.0)\nassert abs(ag - 20.0) < 1e-9 and abs(fd - ag) < 1e-4, 'expected 20 | finite-diff %r vs autograd %r' % (fd, ag)",
          expected: '20 via both paths',
        },
      ],
      hints: [
        { ar: 'الفرق المركزي: (fn(x + h) - fn(x - h)) / (2 * h) — أدق من الفرق الأمامي لأن حد الخطأ من رتبة h\u00b2.', en: 'Central difference: (fn(x + h) - fn(x - h)) / (2 * h) — more accurate than forward since its error term is order h\u00b2.' },
        { ar: 'في autograd_grad: v = Value(float(x)) ثم y = fn(v) ثم y.backward() ثم return v.grad — عقدة جديدة في كل استدعاء فتكون التدرجات نظيفة.', en: 'In autograd_grad: v = Value(float(x)), then y = fn(v), then y.backward(), then return v.grad — a fresh node per call keeps gradients clean.' },
        { ar: 'تحليليًا: مشتق 3t\u00b2+2t هي 6t+2 فيكون عند t=2 هو 14؛ ومشتق (2t+1)\u00b2 بقاعدة السلسلة هي 4(2t+1) فيكون عند t=2 هو 20.', en: 'Analytically: 3t\u00b2+2t has derivative 6t+2, which is 14 at t=2; (2t+1)\u00b2 has chain-rule derivative 4(2t+1), which is 20 at t=2.' },
        { ar: 'minigrad يضرب ويجمع ويطوّع: `3 * v ** 2 + 2 * v` و`(2 * v + 1) ** 2` كلها تعبيرات صالحة على Value.', en: 'minigrad multiplies, adds and raises: `3 * v ** 2 + 2 * v` and `(2 * v + 1) ** 2` are all valid expressions on a Value.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-base-rate',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'اختبار طبي لا يخطئ أبدًا مع المرضى المصابين وينذر كذبًا بنسبة 1% فقط، ومع ذلك P(مرض | نتيجة موجبة) ≈ 13%. ما التفسير؟',
        en: 'A medical test never misses a diseased patient and has only a 1% false-positive rate, yet P(disease | positive) \u2248 13%. What explains this?',
      },
      options: [
        { id: 'a', text: { ar: 'المرض نادر: الأولوية الصغيرة تخنق حد المصابين، بينما يولّد 1% من الجمهور الصحي الضخم إنذارات كاذبة كثيرة', en: 'The disease is rare: the tiny prior strangles the diseased term, while 1% of the huge healthy population still yields many false alarms' } },
        { id: 'b', text: { ar: 'الحساب خاطئ لأن اختبارًا بهذه الدقة يجب أن يعطي أكثر من 90%', en: 'The arithmetic is wrong — a test this accurate must exceed 90%' } },
        { id: 'c', text: { ar: 'لأن الاحتمالات لا تجمع أبدًا إلى 1', en: 'Because probabilities never sum to 1' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'قسّم المجتمع: 0.15% مصابون و99.85% أصحاء — طبّق الاختبار على كل مجموعة.', en: 'Split the population: 0.15% diseased and 99.85% healthy — run the test on each group.' },
        { ar: 'البسط 1.0\u00b70.0015 والناتج 0.011485: البعد = 0.0015/0.011485 ≈ 0.1306.', en: 'Numerator 1.0\u00b70.0015, denominator 0.011485: posterior = 0.0015/0.011485 \u2248 0.1306.' },
        { ar: 'الحل ليس اختبار أفضل بل معلومة إضافية: اختبار مستقل ثانٍ يرفع البعد إلى ≈ 83% في مثال الكتاب.', en: 'The fix is not a better test but more information: an independent second test lifts the posterior to \u2248 83% in the book\u2019s example.' },
        { ar: 'الجواب: a — نظرية بايز تكافئ الأولوية: البعد ∝ الامتكانية × الأولوية.', en: 'Answer: a — Bayes pays the prior: posterior \u221d likelihood \u00d7 prior.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "prior = 0.0015            # P(H=1): مدى ندرة الحالة\nsens1, fp1 = 1.0, 0.01    # الاختبار الأول: P(+|H=1) و P(+|H=0)\nsens2, fp2 = 0.98, 0.03   # الاختبار الثاني: أضعف لكنه مستقل\n\nmarg1 = sens1 * prior + fp1 * (1 - prior)\npost1 = sens1 * prior / marg1\nprint('after test 1: P(H=1 | +) = %.4f' % post1)\n\njoint_sick = sens1 * sens2 * prior\njoint_healthy = fp1 * fp2 * (1 - prior)\npost2 = joint_sick / (joint_sick + joint_healthy)\nprint('after test 2: P(H=1 | +,+) = %.4f' % post2)\n\n# جرّب: ارفع prior إلى 0.15 وراقب البعدين يصعدان معًا.\n# try: raise the prior to 0.15 and watch both posteriors climb.\n# جرّب: اجعل الاختبارين متطابقين (sens2, fp2 = sens1, fp1) — لماذا لا يضيف الموجب الثاني شيئًا تقريبًا حين يكونان مترابطين تمامًا؟\n# try: make the two tests identical (sens2, fp2 = sens1, fp1) — why does the second positive add almost nothing then?\n",
      prompt: {
        ar: 'ملعب نظرية بايز: اختبار دقيق وحده يعطي بعدًا ≈ 0.1306، واختبار ثانٍ مستقل (أضعف!) يرفعه إلى ≈ 0.8306. الرافعة هي الاستقلال الشرطي — هو ما يسمح بجمع الأدلة.',
        en: 'A Bayes\u2019 theorem playground: one accurate test alone gives a posterior of \u2248 0.1306, and a second, weaker, independent test lifts it to \u2248 0.8306. The lever is conditional independence — that is what lets evidence combine.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا يفعل الاستدعاء y.backward() في autograd؟',
            en: 'What does calling y.backward() do in autograd?',
          },
          options: [
            { id: 'a', text: { ar: 'يعيد حساب y من البداية بقيم جديدة', en: 'Recomputes y from scratch with new values' } },
            { id: 'b', text: { ar: 'يمشي المخطط الحسابي عكسيًا مطبقًا قاعدة السلسلة ليملأ المشتقات في grad', en: 'Walks the computational graph backwards applying the chain rule to fill the grads' } },
            { id: 'c', text: { ar: 'يحذف المخطط ويحرر الذاكرة', en: 'Deletes the graph and frees memory' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'backward() يبدأ من grad=1 عند الناتج ويمتد عكسيًا مضاعفًا المشتقات المحلية — backpropagation. القيم نفسها لا تُعاد حسابها؛ المشتقات هي التي تُجمع في عقد grad (وتتراكم بين الاستدعاءات حتى تُصفّر).',
            en: 'backward() starts from grad=1 at the output and propagates backwards, multiplying local derivatives — backpropagation. The values themselves are not recomputed; derivatives accumulate in each node\u2019s grad (and accumulate across calls until zeroed).',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'استثمار يفشل باحتمال 0.5 (عائد 0)، أو يعود ضعفين باحتمال 0.4، أو عشرة أضعاف باحتمال 0.1. ما E[العائد]؟',
            en: 'An investment fails with probability 0.5 (return 0), doubles with probability 0.4, or returns 10\u00d7 with probability 0.1. What is E[return]?',
          },
          options: [
            { id: 'a', text: { ar: '4.0', en: '4.0' } },
            { id: 'b', text: { ar: '1.8', en: '1.8' } },
            { id: 'c', text: { ar: '2.0', en: '2.0' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'E = 0.5\u00b70 + 0.4\u00b72 + 0.1\u00b710 = 0.8 + 1.0 = 1.8 — متوسط مرجّح بالاحتمالات، لا متوسط النتائج الممكنة البسيط (4.0) ولا الحالة المتفائلة (10).',
            en: 'E = 0.5\u00b70 + 0.4\u00b72 + 0.1\u00b710 = 0.8 + 1.0 = 1.8 — a probability-weighted average, not the plain mean of outcomes (4.0) nor the optimistic case (10).',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي افتراض سمح للكتاب بدمج نتيجتي اختبارين في posterior واحد أدق؟',
            en: 'Which assumption let the book combine two test outcomes into one sharper posterior?',
          },
          options: [
            { id: 'a', text: { ar: 'الاستقلال الشرطي للاختبارين بحالة المريض', en: 'Conditional independence of the two tests given disease status' } },
            { id: 'b', text: { ar: 'أن الاختبارين متطابقان تمامًا', en: 'That the two tests are identical' } },
            { id: 'c', text: { ar: 'أن المرض شائع جدًا', en: 'That the disease is very common' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مع الاستقلال الشرطي تُضرب الامتكانيات: P(D1,D2|H) = P(D1|H)P(D2|H). اختبار متطابق سيكرر نفس الدليل فلا يضيف شيئًا — الدليل الجديد يأتي من مصدر مستقل.',
            en: 'Under conditional independence the likelihoods multiply: P(D1,D2|H) = P(D1|H)P(D2|H). An identical test would repeat the same evidence and add nothing — new information comes from an independent source.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'autograd يسجل مخططًا حسابيًا أثناء الحساب ثم يطبق قاعدة السلسلة عكسيًا (backpropagation): y=(2x+1)\u00b2 عند x=2 أعطى dy/dx = 20 مطابقًا للاشتقاق اليدوي (الهدف من s5 التفاضل التلقائي).', en: 'Autograd records a computational graph as you compute, then applies the chain rule backwards (backpropagation): y=(2x+1)\u00b2 at x=2 gave dy/dx = 20, matching the hand derivative (goal of s5 Automatic Differentiation).' },
        { ar: 'الاحتمال يحكم عدم اليقين: ترددات عينة ثابتة تتحول إلى P(rain)=0.50 وP(cloudy)=0.20 وP(clear)=0.30، والتوقع E=Σp\u1d62v\u1d62=1.80، وبايز توازن الامتكانية بالأولوية حتى يخدع اختبار دقيقًا في مرض نادر (الهدف من s6 الاحتمالات والإحصاء).', en: 'Probability governs uncertainty: a fixed sample\u2019s frequencies become P(rain)=0.50, P(cloudy)=0.20, P(clear)=0.30, the expectation E=\u03a3p\u1d62v\u1d62=1.80, and Bayes weighs likelihood against prior — which is why an accurate test can still mislead on a rare condition (goal of s6 Probability and Statistics).' },
        { ar: 'اقرأ التوثيق قبل التخمين: dir للمسح وhelp للتفاصيل، ثم اختبار صغير يؤكد تفسيرك — عادة تصنع الفرق طوال الكتاب (الهدف من s7 التوثيق).', en: 'Read docs before guessing: dir to survey, help for detail, then a tiny test to confirm your reading — a habit that pays off for the whole book (goal of s7 Documentation).' },
      ],
      reflectPrompt: {
        ar: 'تحققت من autograd بفرق محدود رقمي. متى تثق بالمحرك تلقائيًا ومتى تشك فيه؟ وما القرار الذي غيّرته بايز في حياتك حين تذكرت أن تتحقق من الأولوية قبل الحكم على النتيجة؟',
        en: 'You verified autograd with a numerical finite difference. When would you trust the engine blindly and when should you probe it? And where might Bayes change a real decision of yours — checking the prior before judging an outcome?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch2.s5' },
        { book: 'D2L', section: 'd2l.ch2.s6' },
        { book: 'D2L', section: 'd2l.ch2.s7' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch2.s5' },
    { book: 'D2L', section: 'd2l.ch2.s6' },
    { book: 'D2L', section: 'd2l.ch2.s7' },
  ],
} satisfies Lesson;

export default lesson;
