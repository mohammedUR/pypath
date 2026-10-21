import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch1.l2 — "The Likelihood-Maximization Perspective"
 * منظور تعظيم الأرجحية
 * Aligned with MLS ch1 s2 (The Likelihood-Maximization Perspective).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved).
 * Runnable design: fixed dataset X=[1..5], y=[2.1,3.9,6.1,7.8,10.2]; Gaussian
 * negative log-likelihood at several weight pairs plus a sigma scan.
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch1.l2',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 1,
  title: { ar: 'منظور تعظيم الأرجحية', en: 'The Likelihood-Maximization Perspective' },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch1.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الدرس السابق بحثنا عن الخط الذي يُقلّل الخسارة. المنظور الثاني يسأل سؤالًا مختلفًا: أي خط يجعل البيانات المرصودة أكثر ترجيحًا؟ افترض أن كل قيمة y تُولَّد من توزيع طبيعي مركزه على الخط، ثم اسأل: أي معاملات تعطي أكبر أرجحية لهذه العينة بالذات؟ المفاجأة الكبرى — وهي جوهر هذا الدرس — أن الجواب يطابق خط المربعات الصغرى تمامًا. ستتعلم بناء الأرجحية، ولماذا نستخدم لوغاريتمها، وتكتب دالة NLL غاوسية كاملة وتقارن قيمها بين خطوط مرشحة.',
        en: 'The previous lesson hunted for the line that minimizes a loss. The second perspective asks a different question: which line makes the observed data most plausible? Assume each y value is drawn from a Normal distribution centered on the line, then ask: which weights give this very sample the greatest likelihood? The big reveal — the heart of this lesson — is that the answer coincides exactly with the least-squares line. You will learn to build the likelihood, why we take its logarithm, and you will code a full Gaussian NLL function and compare its values across candidate lines.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'النموذج الغاوسي والأرجحية', en: 'The Gaussian model and the likelihood' },
      chunks: [
        {
          ar: 'بدل معاملة y كعدد ثابت، نعامله كمتغير عشوائي: Y_n | x_n يتبع توزيعًا طبيعيًا متوسطه β^T x_n وتباينه σ². بمعاملات مرشحة w0 وw1 يصبح مركز كل نقطة هو ŷ_n = w0 + w1*x_n، وتبقى σ² عرض الضجيج حول الخط. أرجحية العينة هي حاصل ضرب كثافات كل النقاط عند قيمها المرصودة: L = Π N(y_n; ŷ_n, σ²). المعاملات التي تعظم L تسمى مقدر الأرجحية العظمى MLE: هي الخط الذي يجعل ما رأيناه أقل استبعادًا ممكنًا تحت النموذج.',
          en: 'Instead of treating y as a fixed number, treat it as a random variable: Y_n | x_n follows a Normal distribution with mean β^T x_n and variance σ². For candidate weights w0 and w1 the center of each point becomes ŷ_n = w0 + w1*x_n, and σ² remains the spread of the noise around the line. The likelihood of the sample is the product of every point\u2019s density at its observed value: L = Π N(y_n; ŷ_n, σ²). The weights maximizing L are called the maximum likelihood estimate, MLE: the line that makes what we saw least surprising under the model.',
        },
        {
          ar: 'حاصل ضرب كثافات كثيرة صغيرة ينهار عدديًا ويتحول إلى منتجات مملة للاشتقاق. اللوغاريتم يحل الأمرين معًا: log يحوّل الضرب إلى مجموع، ويحفظ نقطة التعظيم لأنه دالة متزايدة. لوغاريتم الأرجحية لكل نقطة: -0.5*log(2πσ²) - (y_n - ŷ_n)²/(2σ²). لاحظ الحدين: ثابت يعتمد على σ فقط، وحيد يعتمد على المعاملات وهو سالب نصف مربع الباقي مقسومًا على σ². لذلك تعظيم log-likelihood يعني تصغير مجموع مربعات البواقي: MLE ≡ المربعات الصغرى حين يكون الضجيج غاوسيًا بتباين ثابت — المنظوران وجهان لعملة واحدة.',
          en: 'A product of many tiny densities collapses numerically and is awkward to differentiate. The logarithm solves both problems at once: log turns the product into a sum and preserves the maximizer because it is an increasing function. Per point, the log-likelihood is -0.5*log(2πσ²) - (y_n - ŷ_n)²/(2σ²). Notice the two terms: one constant depending only on σ, and one depending on the weights — minus half the squared residual over σ². So maximizing the log-likelihood means shrinking the sum of squared residuals: MLE ≡ least squares when the noise is Gaussian with constant variance. The two perspectives are one coin, two faces.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مقارنة الخطوط بلوغاريتم الأرجحية السالب', en: 'Comparing lines via the negative log-likelihood' },
      code: "import math\n\nX = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef gaussian_nll(w0, w1, X, y, sigma):\n    n = len(X)\n    total = 0.0\n    for i in range(n):\n        err = y[i] - (w0 + w1 * X[i])\n        total += 0.5 * math.log(2 * math.pi * sigma ** 2) + (err * err) / (2 * sigma ** 2)\n    return total\n\nprint('nll at (1.00, 1.00): %.4f' % gaussian_nll(1.0, 1.0, X, y, 1.0))\nprint('nll at (0.00, 2.00): %.4f' % gaussian_nll(0.0, 2.0, X, y, 1.0))\nprint('nll at (-0.01, 2.01): %.4f' % gaussian_nll(-0.01, 2.01, X, y, 1.0))",
      explanation: {
        ar: 'NLL هي سالب لوغاريتم الأرجحية: تعظيم الأرجحية = تصغير NLL. الخط (1, 1) بعيد فقيمته 19.9497، و(0, 2) أفضل بـ 4.6497، وأفضل الثلاثة هو (-0.01, 2.01) بـ 4.6482 — الخط نفسه الذي فاز بمنظور الخسارة في الدرس السابق. لاحظ الفارق بين الخيارين الأخيرين 0.0015 فقط: الجزء الحساس من NLL هو مجموع مربعات البواقي (0.107 مقابل 0.110) مقسومًا على 2σ². الثابت 0.5*log(2πσ²) لا يتغير بين الخطوط فيتلاشى عند المقارنة — وهذه هي الصلة الحرفية بين المنظورين.',
        en: 'NLL is the negative log-likelihood: maximizing likelihood equals minimizing NLL. The distant line (1, 1) scores 19.9497; (0, 2) improves to 4.6497; the best of the three is (-0.01, 2.01) at 4.6482 — the very line that won the loss perspective last lesson. Note the last two differ by only 0.0015: the discriminative part of NLL is the sum of squared residuals (0.107 vs 0.110) divided by 2σ². The constant 0.5*log(2πσ²) never changes between lines, so it washes out in comparisons — that is the literal bridge between the two perspectives.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.implement-gaussian-nll',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة gaussian_nll(w0, w1, X, y, sigma) التي تعيد سالب لوغاريتم الأرجحية الغاوسية كاملًا (بالـ الثابت 0.5*log(2πσ²)) على البيانات المعطاة. استخدم math.log فقط، وأعد القيمة دون طباعة.',
        en: 'Implement gaussian_nll(w0, w1, X, y, sigma) returning the full Gaussian negative log-likelihood (including the constant 0.5*log(2πσ²)) on the given data. Use only math.log and return the value without printing.',
      },
      starterCode: "import math\n\nX = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef gaussian_nll(w0, w1, X, y, sigma):\n    ...  # TODO: sum of 0.5*log(2*pi*sigma**2) + (err**2) / (2*sigma**2)\n",
      solution: "import math\n\nX = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef gaussian_nll(w0, w1, X, y, sigma):\n    n = len(X)\n    total = 0.0\n    for i in range(n):\n        err = y[i] - (w0 + w1 * X[i])\n        total += 0.5 * math.log(2 * math.pi * sigma ** 2) + (err * err) / (2 * sigma ** 2)\n    return total",
      tests: [
        {
          id: 't1',
          name: { ar: 'القيمة عند الخط البعيد صحيحة', en: 'Value at the far-off line is correct' },
          code: "assert abs(gaussian_nll(0.0, 0.0, X, y, 1.0) - 115.4497) < 1e-3, 'expected 115.4497 | actual: %r' % gaussian_nll(0.0, 0.0, X, y, 1.0)",
          expected: '115.4497',
        },
        {
          id: 't2',
          name: { ar: 'القيمة عند خط المربعات الصغرى صحيحة', en: 'Value at the least-squares line is correct' },
          code: "assert abs(gaussian_nll(-0.01, 2.01, X, y, 1.0) - 4.6482) < 1e-3, 'expected 4.6482 | actual: %r' % gaussian_nll(-0.01, 2.01, X, y, 1.0)",
          expected: '4.6482',
        },
        {
          id: 't3',
          name: { ar: 'الخط الأقرب ينتصر في NLL', en: 'The closer line wins on NLL' },
          code: "assert gaussian_nll(-0.01, 2.01, X, y, 1.0) < gaussian_nll(0.0, 2.0, X, y, 1.0), 'expected the least-squares line to have smaller NLL'",
          expected: '4.6482 < 4.6497',
        },
      ],
      hints: [
        { ar: 'لكل نقطة: err = y[i] - (w0 + w1 * X[i])، ثم أضف 0.5 * math.log(2 * math.pi * sigma ** 2) + (err * err) / (2 * sigma ** 2).', en: 'Per point: err = y[i] - (w0 + w1 * X[i]), then add 0.5 * math.log(2 * math.pi * sigma ** 2) + (err * err) / (2 * sigma ** 2).' },
        { ar: 'القيمة تحقق: عند (0, 0) مجموع مربعات y يساوي 221.71 فيصبح NLL = 2.5*log(2π) + 110.855 ≈ 115.4497.', en: 'Sanity value: at (0, 0) the sum of squared y is 221.71, so NLL = 2.5*log(2π) + 110.855 ≈ 115.4497.' },
        { ar: 'لا تخلط: σ² = sigma ** 2 يظهر في موضعين، داخل اللوغاريتم ومقسومًا عليه مربع الباقي.', en: 'Do not mix up: σ² = sigma ** 2 appears twice, inside the log and dividing the squared residual.' },
        { ar: 'أعد المجموع فقط — الطباعة داخل الدالة ستفسد الاختبارات التي تقارن القيمة المرجعة.', en: 'Return the total only — printing inside the function would pollute the tests that compare the returned value.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-mle-lsq',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ضمن افتراض ضجيج غاوسي N(0, σ²) بتباين ثابت ومعروف، أي علاقة بين مقدر الأرجحية العظمى وحل المربعات الصغرى في الانحدار الخطي؟',
        en: 'Under the assumption of Gaussian noise N(0, σ²) with fixed, known variance, what relation holds between the maximum likelihood estimate and the least-squares solution in linear regression?',
      },
      options: [
        { id: 'a', text: { ar: 'يختلفان: MLE يعظم الأرجحية والمربعات الصغرى يقلل الخسارة، ولا صلة بينهما', en: 'They differ: MLE maximizes likelihood while least squares minimizes loss, with no relation' } },
        { id: 'b', text: { ar: 'يتطابقان: تعظيم لوغاريتم الأرجحية يكافئ تصغير مجموع مربعات البواقي', en: 'They coincide: maximizing the log-likelihood equals minimizing the sum of squared residuals' } },
        { id: 'c', text: { ar: 'يعتمد التقارب على عدد النقاط فقط', en: 'Their agreement depends only on the number of points' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اكتب log-likelihood لنقطة واحدة: ثابت يعتمد على σ وحده، ناقص (الباقي)² على 2σ².', en: 'Write the per-point log-likelihood: a constant depending on σ alone, minus the squared residual over 2σ².' },
        { ar: 'الجزء الوحيد المعتمد على المعاملات هو -مجموع (الباقي)²/(2σ²) — فتعظيمه = تصغير مجموع مربعات البواقي.', en: 'The only weights-dependent part is -sum of squared residuals over 2σ² — maximizing it equals shrinking that sum.' },
        { ar: 'σ² موجب ثابت لا يغير موقع القمة، بل يغير مقياس الخسارة فقط.', en: 'The positive constant σ² does not move the maximum — it only rescales the loss.' },
        { ar: 'الجواب: b — الافتراض الغاوسي هو بالضبط ما يجعل المنظورين متطابقين.', en: 'Answer: b — the Gaussian assumption is precisely what makes the two perspectives coincide.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\nX = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef gaussian_nll(w0, w1, X, y, sigma):\n    n = len(X)\n    total = 0.0\n    for i in range(n):\n        err = y[i] - (w0 + w1 * X[i])\n        total += 0.5 * math.log(2 * math.pi * sigma ** 2) + (err * err) / (2 * sigma ** 2)\n    return total\n\nw0, w1 = -0.01, 2.01\nfor sigma in [0.05, 0.1, 0.146, 0.2, 0.3, 0.5, 1.0]:\n    print('sigma=%.3f nll=%.4f' % (sigma, gaussian_nll(w0, w1, X, y, sigma)))\n\n# جرّب: أفضل σ يشبه جذر متوسط مربعات البواقي — احسب (0.0214) ** 0.5 وقارن.\n# try: the best sigma resembles the root mean squared residual — compute (0.0214) ** 0.5 and compare.\n# جرّب: ثبّت σ عند 1.0 وحرك w1 بمقدار 0.01 — كم يتغير NLL تقريبًا؟\n# try: fix sigma at 1.0 and nudge w1 by 0.01 — roughly how much does the NLL move?\n",
      prompt: {
        ar: 'الملعب يفحص الضلع الثاني من النموذج الغاوسي: عرض الضجيج σ. ثبّت الخط عند الفائز وحرّك σ وراقب أين تنخفض NLL.',
        en: 'The sandbox probes the second dial of the Gaussian model: the noise width σ. Pin the line at the winner and slide σ while watching where the NLL dips.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في النموذج الغاوسي للانحدار، ماذا يمثل σ²؟',
            en: 'In the Gaussian model for regression, what does σ² represent?',
          },
          options: [
            { id: 'a', text: { ar: 'ميل الخط', en: 'The slope of the line' } },
            { id: 'b', text: { ar: 'تباين الضجيج حول الخط', en: 'The variance of the noise around the line' } },
            { id: 'c', text: { ar: 'عدد النقاط المستخدمة في التدريب', en: 'The number of training points' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كل ملاحظة Y_n | x_n ~ N(β^T x_n, σ²): المركز على الخط والانتشار σ². المركز يتحكم فيه المعاملات، وσ² وصف للضجيج — ولهذا يظهر فقط في الثابت والمقام في NLL.',
            en: 'Each observation is Y_n | x_n ~ N(β^T x_n, σ²): centered on the line with spread σ². The weights control the center; σ² describes the noise — which is why it appears only in the constant and the denominator of the NLL.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا نعمل بلوغاريتم الأرجحية بدل الأرجحية نفسها؟',
            en: 'Why do we work with the log-likelihood instead of the likelihood itself?',
          },
          options: [
            { id: 'a', text: { ar: 'اللوغاريتم يحوّل الضرب إلى مجموع ويحافظ على نقطة التعظيم', en: 'The log turns the product into a sum and preserves the maximizer' } },
            { id: 'b', text: { ar: 'اللوغاريتم يجعل القيم دائمًا أكبر', en: 'The log always makes values larger' } },
            { id: 'c', text: { ar: 'اللوغاريتم يلغي الحاجة إلى افتراض توزيع', en: 'The log removes the need for a distributional assumption' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأرجحية المشتركة حاصل ضرب كثافات N نقطة؛ ضرب أعداد صغيرة جدًا يستنزف الدقة واشتقاقه مرهق. log يحوّله إلى مجموع حدود قابلة للاشتقاق، ولأنه متزايد فإن argmax يبقى نفسه.',
            en: 'The joint likelihood is a product of N densities; multiplying very small numbers drains precision and differentiating is painful. The log converts it into a sum of easy derivatives, and being increasing, the argmax is unchanged.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي حد في لوغاريتم الأرجحية هو الوحيد المعتمد على معاملات الخط w0 و w1؟',
            en: 'Which term of the log-likelihood is the only one depending on the line weights w0 and w1?',
          },
          options: [
            { id: 'a', text: { ar: 'الحد الثابت 0.5*log(2πσ²)', en: 'The constant 0.5*log(2πσ²)' } },
            { id: 'b', text: { ar: 'الحد -(y_n - ŷ_n)²/(2σ²) التابع للباقي', en: 'The residual term -(y_n - ŷ_n)²/(2σ²)' } },
            { id: 'c', text: { ar: 'لا يوجد أي حد يعتمد على المعاملات', en: 'No term depends on the weights' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الثابت 0.5*log(2πσ²) يعتمد على σ فقط ويتطابق بين كل الخطوط. حد الباقي وحده يحمل أثر w0 وw1 — لذا تصغير مجموع مربعات البواقي يكافئ تعظيم الأرجحية الغاوسية حرفيًا.',
            en: 'The constant 0.5*log(2πσ²) depends on σ alone and is identical for every line. Only the residual term carries the effect of w0 and w1 — so minimizing the sum of squared residuals literally maximizes the Gaussian likelihood.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المنظور الثاني يعامل y كمتغير عشوائي غاوسي مركزه على الخط: Y_n | x_n ~ N(β^T x_n, σ²)، ويختار المعاملات التي تعظم أرجحية العينة — مقدر الأرجحية العظمى MLE.', en: 'The second perspective treats y as a Gaussian random variable centered on the line, Y_n | x_n ~ N(β^T x_n, σ²), and picks the weights maximizing the sample likelihood — the maximum likelihood estimate, MLE.' },
        { ar: 'لوغاريتم الأرجحية يحوّل الضرب إلى مجموع: لكل نقطة ثابت يعتمد على σ وحده، ناقص مربع الباقي على 2σ². عمليًا نصغّر NLL، سالب لوغاريتم الأرجحية.', en: 'The log-likelihood turns the product into a sum: per point a constant depending on σ alone, minus the squared residual over 2σ². In practice we minimize the NLL, the negative log-likelihood.' },
        { ar: 'الحدين الوحيد المعتمد على المعاملات هو مجموع مربعات البواقي — لذلك MLE ≡ المربعات الصغرى تحت ضجيج غاوسي بتباين ثابت. المنظوران يذكران نفس الخط بالضبط.', en: 'The only weights-dependent term is the sum of squared residuals — hence MLE ≡ least squares under Gaussian noise with constant variance. Both perspectives nominate the exact same line.' },
      ],
      reflectPrompt: {
        ar: 'جرّبت في الملعب تغيير σ مع خط ثابت: أي σ صغّرت NLL ولماذا يرتبط بجذر MSE؟ وماذا يعني أن يكون حد الباقي هو الوحيد المعتمد على المعاملات في كلا المنظورين؟',
        en: 'In the sandbox you varied σ with the line fixed: which σ minimized the NLL and why does it track the root of the MSE? And what does it mean that the residual term is the only weights-dependent one in both perspectives?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch1.s2' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch1.s2' },
  ],
} satisfies Lesson;

export default lesson;
