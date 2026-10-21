import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch2.l3 — "Generalized Linear Models: Poisson Regression"
 * النماذج الخطية المعممة: انحدار بواسون
 * Aligned with MLS ch2 s3 (Generalized Linear Models (GLMs)).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved).
 * Runnable design: tiny fixed count data x=[0,1,2,3], y=[1,2,4,8] (true model
 * lam = 2^x); exp link, Poisson NLL (log y! constant dropped), 400 gradient
 * steps at lr=0.01 converging to w0=0.0001, w1=0.6931 = ln 2. Every literal
 * verified under CPython 3.
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch2.l3',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 2,
  title: { ar: 'النماذج الخطية المعممة: انحدار بواسون', en: 'Generalized Linear Models: Poisson Regression' },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch2.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كم زائرًا سيصل موقعك غدًا؟ أعداد لا سالب، وتباين يكبر مع المتوسط — الخط المستقيم غير مناسب هنا: قد يتنبأ بزوار سالبين! النماذج الخطية المعممة GLM تحل هذا بتغييرين مدروسين: توزيع مختلف للهدف (بواسون للأعداد) ودالة ربط تمر الخط عبر exp فيبقى النموذج خطيًا داخل اللوغاريتم وموجبًا في العالم الحقيقي. ستدرّب انحدار بواسون كاملًا على أربع نقاط وتراه يكتشف القاعدة 2^x بنفسه.',
        en: 'How many visitors will your site get tomorrow? Counts are never negative, and their variance grows with the mean — a straight line is the wrong tool here: it might predict negative visitors! Generalized linear models, GLMs, fix this with two deliberate changes: a different distribution for the target (Poisson for counts) and a link function that routes the line through exp, keeping the model linear in log-space and positive in the real world. You will train a full Poisson regression on four points and watch it discover the rule 2^x by itself.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'توزيع + ربط = GLM', en: 'Distribution + link = GLM' },
      chunks: [
        {
          ar: 'كل GLM يُبنى من قطعتين: توزيع عشوائي للهدف y_n ودالة ربط g تربط متوسطه mu_n بالمتغيّر الخطي eta_n = w0 + w1*x_n. في الانحدار العادي: توزيع طبيعي وربط محايد mu = eta. في انحدار بواسون: y_n ~ Poisson(mu_n) للأعداد، والربط القياسي لوغاريتمي: log(mu_n) = eta_n أي mu_n = exp(w0 + w1*x_n) — المتوسط موجب دائمًا مهما كانت المعاملات. دالة الكتلة البواسونية: P(Y = k) = mu^k * e^(-mu) / k!، ومتوسطها وتباينها كلاهما mu — لهذا يتناسب التذبذب مع المستوى.',
          en: 'Every GLM has two parts: a random distribution for the target y_n and a link function g connecting its mean mu_n to the linear predictor eta_n = w0 + w1*x_n. Ordinary regression: Normal distribution, identity link mu = eta. Poisson regression: y_n ~ Poisson(mu_n) for counts, with the canonical log link: log(mu_n) = eta_n, i.e. mu_n = exp(w0 + w1*x_n) — the mean stays positive whatever the weights. The Poisson mass function is P(Y = k) = mu^k * e^(-mu) / k!, and both its mean and variance equal mu — which is why fluctuation scales with level.',
        },
        {
          ar: 'للتدريب نصغّر سالب لوغاريتم الأرجحية. بعد حذف الثابت -log(y_n!) الذي لا يعتمد على المعاملات يتبقى لكل نقطة: mu_n - y_n*log(mu_n) (عوّض mu_n = exp(eta_n) وستظهر eta_n في الطرف الأول). المشتقات تُبشّر: دNLL/دw0 = مجموع (mu_n - y_n) ودفNLL/دw1 = مجموع (mu_n - y_n)*x_n — نفس هيكل الانحدار الخطي تمامًا لأن الربط اللوغاريتمي هو الربط الطبيعي لتوزيع بواسون. انتبه أيضًا: بتر الثابت يعني أن NLL قد تصبح سالبة على بيانات مُوافَق عليها جيدًا — قارن دائمًا بين قيمتين على البيانات نفسها.',
          en: 'Training minimizes the negative log-likelihood. After dropping the constant -log(y_n!) that never touches the weights, each point contributes mu_n - y_n*log(mu_n) (substitute mu_n = exp(eta_n) and eta_n appears in the first term). The gradients are friendly: dNLL/dw0 = sum of (mu_n - y_n) and dNLL/dw1 = sum of (mu_n - y_n)*x_n — the very same structure as linear regression, because the log link is the natural link of the Poisson. Note too: truncating the constant means the NLL can go negative on well-fitted data — always compare two values on the same data.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تدريب بواسون يكتشف 2^x', en: 'A Poisson fit discovers 2^x' },
      code: "import math\n\nx = [0, 1, 2, 3]\ny = [1, 2, 4, 8]\n\ndef poisson_nll(w0, w1, x, y):\n    total = 0.0\n    for i in range(len(x)):\n        lam = math.exp(w0 + w1 * x[i])\n        total += lam - y[i] * math.log(lam)\n    return total\n\nw0, w1, lr = 0.0, 0.0, 0.01\nfor step in range(400):\n    g0 = sum(math.exp(w0 + w1 * x[i]) - y[i] for i in range(4))\n    g1 = sum((math.exp(w0 + w1 * x[i]) - y[i]) * x[i] for i in range(4))\n    w0 -= lr * g0\n    w1 -= lr * g1\nprint('after 400 steps: w0=%.4f w1=%.4f' % (w0, w1))\nprint('nll: start=%.4f end=%.4f' % (poisson_nll(0.0, 0.0, x, y), poisson_nll(w0, w1, x, y)))\nfor i in range(4):\n    print('x=%d y=%d lam=%.3f' % (x[i], y[i], math.exp(w0 + w1 * x[i])))",
      explanation: {
        ar: 'البداية عند (0, 0) تجعل كل mu_n = 1، فالنموذج أقل من البيانات في كل النقاط ما عدا الأولى — التدرج عند الأصل (-11, -28) يدفع صعودًا. بعد 400 خطوة صغيرة (lr = 0.01) نصل إلى w0 = 0.0001 وw1 = 0.6931 = ln(2) تقريبًا: النموذج اكتشف أن y يتضاعف مع كل وحدة x. والمعدلات النهائية 1.000, 2.000, 4.000, 8.000 تطابق y تمامًا. جربتُ خطوات أكبر: lr=0.02 يهبط بسرعة ثم يتذبذب حول القاع بقيمة أسوأ (-8.12)، وlr=0.1 ينفجر فورًا لأن exp يكبر أي تجاوز — الدالة الأسية تجعل انحدار بواسون أكثر حساسية لمعدل التعلم.',
        en: 'Starting at (0, 0) sets every mu_n = 1, so the model undershoots the data everywhere except the first point — the gradient at the origin, (-11, -28), pushes uphill. After 400 small steps (lr = 0.01) we reach w0 = 0.0001 and w1 = 0.6931 = ln(2): the model discovered that y doubles with every unit of x. The final rates 1.000, 2.000, 4.000, 8.000 match y exactly. I tried bigger steps: lr=0.02 descends fast then oscillates around the bottom at a worse value (-8.12), and lr=0.1 explodes immediately because exp amplifies any overshoot — the exponential link makes Poisson descent more learning-rate sensitive.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.poisson-nll-grads',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين على بيانات العداد المعطاة: poisson_nll(w0, w1, x, y) تعيد مجموع (mu_n - y_n*log(mu_n)) مع mu_n = exp(w0 + w1*x_n) بلا ثابت log(y!)، وpoisson_grads(w0, w1, x, y) تعيد الزوج (مجموع (mu_n - y_n), مجموع (mu_n - y_n)*x_n). استخدم math.exp وmath.log.',
        en: 'Implement two functions on the given count data: poisson_nll(w0, w1, x, y) returning the sum of (mu_n - y_n*log(mu_n)) with mu_n = exp(w0 + w1*x_n), without the log(y!) constant; and poisson_grads(w0, w1, x, y) returning the pair (sum of (mu_n - y_n), sum of (mu_n - y_n)*x_n). Use math.exp and math.log.',
      },
      starterCode: "import math\n\nx = [0, 1, 2, 3]\ny = [1, 2, 4, 8]\n\ndef poisson_nll(w0, w1, x, y):\n    ...  # TODO: sum of lam - y * log(lam) with lam = exp(w0 + w1 * x)\n\ndef poisson_grads(w0, w1, x, y):\n    ...  # TODO: return (sum(lam - y), sum((lam - y) * x))\n",
      solution: "import math\n\nx = [0, 1, 2, 3]\ny = [1, 2, 4, 8]\n\ndef poisson_nll(w0, w1, x, y):\n    total = 0.0\n    for i in range(len(x)):\n        lam = math.exp(w0 + w1 * x[i])\n        total += lam - y[i] * math.log(lam)\n    return total\n\ndef poisson_grads(w0, w1, x, y):\n    g0 = sum(math.exp(w0 + w1 * x[i]) - y[i] for i in range(len(x)))\n    g1 = sum((math.exp(w0 + w1 * x[i]) - y[i]) * x[i] for i in range(len(x)))\n    return g0, g1",
      tests: [
        {
          id: 't1',
          name: { ar: 'NLL عند نقطة الأصل يساوي 4.0', en: 'NLL at the origin equals 4.0' },
          code: "assert abs(poisson_nll(0.0, 0.0, x, y) - 4.0) < 1e-9, 'expected 4.0 | actual: %r' % poisson_nll(0.0, 0.0, x, y)",
          expected: '4.0',
        },
        {
          id: 't2',
          name: { ar: 'التدرج عند الأصل (-11, -28)', en: 'Gradient at the origin is (-11, -28)' },
          code: "g0, g1 = poisson_grads(0.0, 0.0, x, y)\nassert abs(g0 + 11.0) < 1e-9 and abs(g1 + 28.0) < 1e-9, 'expected (-11, -28) | actual: %r' % ((g0, g1),)",
          expected: '(-11, -28)',
        },
        {
          id: 't3',
          name: { ar: 'أربع مئة خطوة صغيرة تهبط دون الصفر', en: 'Four hundred small steps descend below zero' },
          code: "w0, w1 = 0.0, 0.0\nfor _ in range(400):\n    g0, g1 = poisson_grads(w0, w1, x, y)\n    w0 -= 0.01 * g0\n    w1 -= 0.01 * g1\nend = poisson_nll(w0, w1, x, y)\nassert end < 0.0 and abs(end - (-8.567)) < 1e-2, 'expected nll about -8.567 | actual: %r' % end",
          expected: 'nll = -8.5670',
        },
      ],
      hints: [
        { ar: 'لكل نقطة: lam = math.exp(w0 + w1 * x[i]) — هذا mu_n نفسه، لا تفصل بينهما.', en: 'Per point: lam = math.exp(w0 + w1 * x[i]) — this is mu_n itself, no need to separate the two.' },
        { ar: 'حد NLL: lam - y[i] * math.log(lam). عند (0, 0): lam = 1 وlog(1) = 0 فيكون المجموع 4.0.', en: 'The NLL term: lam - y[i] * math.log(lam). At (0, 0): lam = 1 and log(1) = 0, so the total is 4.0.' },
        { ar: 'التدرجان: g0 = مجموع (lam - y[i]) وg1 = مجموع (lam - y[i]) * x[i]. عند الأصل: lam = 1 فيكون g0 = (1-1)+(1-2)+(1-4)+(1-8) = -11.', en: 'The gradients: g0 = sum of (lam - y[i]) and g1 = sum of (lam - y[i]) * x[i]. At the origin lam = 1, so g0 = (1-1)+(1-2)+(1-4)+(1-8) = -11.' },
        { ar: 'في حلقة التدريب حدّث w0 وw1 معًا ثم أعد حساب lam — قيم القديمة لا تنفع بعد التحديث.', en: 'In the training loop update w0 and w1 together, then recompute lam — stale values are useless after the update.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-lam3',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بعد التدريب المذكور (400 خطوة، lr = 0.01) وصل w0 = 0.0001 وw1 = 0.6931. ما قيمة mu عند x = 3 مقربة لأقرب عدد صحيح؟ (احسب exp(w0 + w1*3) ثم قرّب.)',
        en: 'After the training above (400 steps, lr = 0.01) the weights reach w0 = 0.0001 and w1 = 0.6931. What is mu at x = 3, rounded to the nearest integer? (Compute exp(w0 + w1*3) then round.)',
      },
      answer: '8',
      solution: '8',
      tolerance: 0.5,
      hints: [
        { ar: 'الأس: 0.0001 + 0.6931*3 = 2.0794 — وهذا قريب من 3*ln(2) = ln(8).', en: 'The exponent: 0.0001 + 0.6931*3 = 2.0794 — close to 3*ln(2) = ln(8).' },
        { ar: 'e^2.0794 ≈ 7.9999 — الربط الأسّي يحوّل الإضافة في الفضاء اللوغاريتمي إلى ضرب حقيقي: مضاعفة ثلاثية.', en: 'e^2.0794 ≈ 7.9999 — the exponential link turns addition in log-space into real-world multiplication: a triple doubling.' },
        { ar: 'لو كان النموذج خطيًا مباشرًا mu = w0 + w1*x لكان التنبؤ 2.0794 — بعيدًا جدًا عن 8 المرصودة.', en: 'A direct linear model mu = w0 + w1*x would predict 2.0794 — far from the observed 8.' },
        { ar: 'الجواب: 8', en: 'Answer: 8' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\nx = [0, 1, 2, 3]\ny = [1, 2, 4, 8]\n\ndef poisson_nll(w0, w1, x, y):\n    total = 0.0\n    for i in range(len(x)):\n        lam = math.exp(w0 + w1 * x[i])\n        total += lam - y[i] * math.log(lam)\n    return total\n\nfor lr in [0.005, 0.01, 0.02, 0.05]:\n    w0, w1 = 0.0, 0.0\n    blew = False\n    for step in range(200):\n        g0 = sum(math.exp(w0 + w1 * x[i]) - y[i] for i in range(4))\n        g1 = sum((math.exp(w0 + w1 * x[i]) - y[i]) * x[i] for i in range(4))\n        w0 -= lr * g0\n        w1 -= lr * g1\n        if w0 > 50.0 or w1 > 50.0:\n            blew = True\n            break\n    print('lr=%.3f blew=%s w0=%.4f w1=%.4f' % (lr, blew, w0, w1))\n\n# جرّب: غيّر y إلى [2, 4, 8, 16] — ما الذي يجب أن يصير w0 وw1؟\n# try: change y to [2, 4, 8, 16] — what should w0 and w1 become?\n# جرّب: أدخل نقطة شاذة y=100 عند x=3 — كيف يقفز النموذج ولماذا؟\n# try: plant an outlier y=100 at x=3 — how does the model jump and why?\n",
      prompt: {
        ar: 'الملعب يختبر حساسية الربط الأسّي: أربعة معدلات تعلم حتى 0.05. راقب أين يلتئم التدريب وأين ينفجر.',
        en: 'The sandbox stress-tests the exponential link: four learning rates up to 0.05. Watch where training heals and where it blows up.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما القطعتان اللتان يُبنى منهما كل GLM؟',
            en: 'What are the two components every GLM is built from?',
          },
          options: [
            { id: 'a', text: { ar: 'توزيع للهدف ودالة ربط تربط متوسطه بالمتغيّر الخطي', en: 'A distribution for the target and a link function connecting its mean to the linear predictor' } },
            { id: 'b', text: { ar: 'طبقة إدخال وطبقة إخراج', en: 'An input layer and an output layer' } },
            { id: 'c', text: { ar: 'قبلي وبعدي', en: 'A prior and a posterior' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'GLM = توزيع عشوائي (طبيعي، بواسون، ...) + ربط (محايد، لوغاريتمي، ...). الانحدار العادي حالة خاصة: طبيعي + ربط محايد. بواسون يأخذ الربط اللوغاريتمي.',
            en: 'A GLM = random distribution (Normal, Poisson, ...) + link (identity, log, ...). Ordinary regression is the special case: Normal + identity link. Poisson takes the log link.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا نستخدم دالة الربط log في انحدار بواسون بدل التنبؤ المباشر mu = w0 + w1*x؟',
            en: 'Why use the log link in Poisson regression instead of predicting mu = w0 + w1*x directly?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن exp يضمن بقاء mu موجبًا مهما كانت المعاملات، ويجعل الأثر ضربيًا يناسب النمو', en: 'Because exp keeps mu positive whatever the weights, and makes the effect multiplicative, which suits growth' } },
            { id: 'b', text: { ar: 'لأن log يسهّل الطباعة', en: 'Because log makes printing easier' } },
            { id: 'c', text: { ar: 'لأن بواسون يتطلب معاملات سالبة', en: 'Because Poisson requires negative coefficients' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأعداد لا تكون سالبة أبدًا، والخط المستقيم يتجاوز الصفر حتمًا عند x سالبة كفاية أو معاملات شاذة. exp(w0 + w1*x) > 0 دائمًا، وزيادة وحدة في x تضرب mu في e^w1 — نمو نسبي لا إضافي، وهو ما تراه في أعداد الزوار والمرض والأعطال.',
            en: 'Counts are never negative, and a straight line inevitably crosses zero for small enough x or odd weights. exp(w0 + w1*x) > 0 always, and one extra unit of x multiplies mu by e^w1 — relative, not additive, growth: exactly how visitors, infections and failures behave.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'مشتقات NLL البواسوني مجموع (mu_n - y_n) ومجموع (mu_n - y_n)*x_n. بماذا يذكرك هذا الشكل؟',
            en: 'The Poisson NLL gradients are the sum of (mu_n - y_n) and the sum of (mu_n - y_n)*x_n. What does this shape remind you of?',
          },
          options: [
            { id: 'a', text: { ar: 'تدرجات الانحدار الخطي مع البواقي — نفس الهيكل بفضل الربط الطبيعي', en: 'The linear regression gradients with residuals — same structure thanks to the natural link' } },
            { id: 'b', text: { ar: 'تدرجات Lasso لأنها تحتوي قيمة مطلقة', en: 'Lasso gradients because of an absolute value' } },
            { id: 'c', text: { ar: 'لا يشبه شيئًا سبق رؤيته', en: 'Nothing seen before' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفرق (mu_n - y_n) هو الباقي بواسونيًا: الفرق بين المتوسط المتوقع والمرصود. الربط اللوغاريتمي هو الربط الطبيعي لبواسون، ولهذا تأتي المشتقات بنفس أناقة المربعات الصغرى — عائلة واحدة من النماذج.',
            en: 'The difference (mu_n - y_n) is the Poisson residual: expected mean minus observed. The log link is Poisson\u2019s natural link, so the derivatives come out as clean as least squares — one family of models, one pattern.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'GLM = توزيع للهدف + دالة ربط. انحدار بواسون: y ~ Poisson(mu) وmu = exp(w0 + w1*x) — تنبؤ موجب دائمًا وأثر ضربي للمعاملات.', en: 'A GLM = a target distribution + a link function. Poisson regression: y ~ Poisson(mu) with mu = exp(w0 + w1*x) — always-positive predictions and a multiplicative coefficient effect.' },
        { ar: 'التدريب يصغّر NLL المبتور: مجموع (mu_n - y_n*log(mu_n))، بمشتقات شبيهة بتدرجات المربعات الصغرى: مجموع (mu_n - y_n) ومجموعه مضروبًا في x.', en: 'Training minimizes the truncated NLL: the sum of (mu_n - y_n*log(mu_n)), with derivatives shaped like the least-squares gradients: sum of (mu_n - y_n), and that same sum times x.' },
        { ar: 'على بيانات [1, 2, 4, 8] اكتشف التدريب w1 = ln(2) وmu = (1, 2, 4, 8) — النموذج قرأ النمو الأسّي. وlr=0.1 ينفجر: الربط الأسّي حساس لمعدل التعلم.', en: 'On data [1, 2, 4, 8] training discovered w1 = ln(2) and mu = (1, 2, 4, 8) — the model read exponential growth. And lr=0.1 explodes: the exponential link is learning-rate sensitive.' },
      ],
      reflectPrompt: {
        ar: 'الربط اللوغاريتمي حوّل «زيادة وحدة في x» إلى «ضرب في e^w1». أين تريد هذا التفسير الضربي في مجالك: أوبئة؟ مبيعات؟ حركة شبكة؟ وما الخطأ الذي سيرتكبه الخط المستقيم هناك؟',
        en: 'The log link turned one extra unit of x into a multiplication by e^w1. Where would that multiplicative reading serve your field: epidemics? sales? network traffic? And what mistake would a straight line commit there?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch2.s3' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch2.s3' },
  ],
} satisfies Lesson;

export default lesson;
