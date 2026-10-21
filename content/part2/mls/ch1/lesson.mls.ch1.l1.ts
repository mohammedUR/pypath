import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch1.l1 — "Linear Regression: The Loss-Minimization Perspective"
 * الانحدار الخطي: منظور تقليل الخسارة
 * Aligned with MLS ch1 s1 (The Loss-Minimization Perspective).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation (license: all rights reserved).
 * Runnable design: fixed dataset X=[1..5], y=[2.1,3.9,6.1,7.8,10.2]; MSE grid
 * scan with argmin report; pure fixed-data arithmetic, no libraries.
 * Deterministic only: no input(), no exit(), no unittest.main, no LCG needed.
 */
const lesson = {
  id: 'mls.ch1.l1',
  version: 1,
  part: 'II',
  track: 'A2',
  book: 'MLS',
  chapter: 1,
  title: { ar: 'منظور تقليل الخسارة', en: 'The Loss-Minimization Perspective' },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch1.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل نموذج تعلم آلي يبدأ بسؤال واحد: ما أفضل قيم للمعاملات؟ يختصر الانحدار الخطي هذه الدورة كاملة: خط بمعاملين، ودالة خسارة تقيس سوء المطابقة، وطريق نحو أدنى خسارة. في هذا الدرس نتبنى المنظور الأول من منظوري الكتاب: تقليل الخسارة. سترى لماذا اخترنا مربعات الفروق تحديدًا، ومعنى argmin، وكيف يعطينا حساب التفاضل اتجاه التحسين، وكيف يحوّل النزول التدريجي هذا الاتجاه إلى خطوات عملية. بنهاية الدرس ستكتب دالة mse بنفسك وتحسب تدرج الخسارة يدويًا وتتحقق من أن خطوة واحدة على الأقل تخفض الخسارة فعلًا.',
        en: 'Every machine learning model starts with one question: which parameter values are best? Ordinary linear regression compresses the whole loop: a line with two weights, a loss that scores how badly it fits, and a route toward the lowest loss. This lesson adopts the first of the book\u2019s two perspectives: minimizing loss. You will see why squared differences are the standard choice, what argmin means, how calculus hands us the direction of improvement, and how gradient descent turns that direction into concrete steps. By the end you will write your own mse function, compute the loss gradient by hand, and verify that a single step genuinely lowers the loss.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الخسارة المربعة و argmin', en: 'Squared loss and the argmin' },
      chunks: [
        {
          ar: 'يفترض الانحدار الخطي أن الهدف y دالة خطية في المتغير x زائد ضجيج: y = w0 + w1*x + ε، حيث w0 الحد الثابت وw1 الميل. والتدريب يعني اختيار w0 وw1 من البيانات نفسها. منظور تقليل الخسارة يحول هذه المهمة إلى مسألة تحسين: عرّف دالة خسارة تعاقب سوء مطابقة أي خط مرشح، ثم ابحث عن المعاملات التي تجعلها أدنى ما يمكن. الخيار القياسي في الانحدار هو خسارة مربعات الخطأ: متوسط مربعات الفروق بين القيم المرصودة y_n والقيم المجهرة ŷ_n = w0 + w1*x_n، ويسمى متوسط مربعات الخطأ MSE. التربيع يعاقب الأخطاء الكبيرة بشدة ويجعل الخسارة ملساء قابلة للاشتقاق — وهذا بالضبط ما تحتاجه طرق التدرج.',
          en: 'Linear regression assumes the target y is a linear function of the predictor x plus noise: y = w0 + w1*x + ε, where w0 is the intercept and w1 the slope. Training means choosing w0 and w1 from the data itself. The loss-minimization perspective turns this into an optimization problem: define a loss that scores how badly any candidate line fits, then search for the weights that make it smallest. The standard choice in regression is squared error loss: the average of squared differences between observed y_n and fitted values ŷ_n = w0 + w1*x_n — the mean squared error, MSE. Squaring punishes large misses hard and keeps the loss smooth and differentiable, exactly what gradient methods need.',
        },
        {
          ar: 'المعاملان الأدنى خسارة يُكتبان بصيغة argmin: قيمة w0 وw1 التي عندهما MSE أدنى ما يمكن. وحساب التفاضل يكشف اتجاه التحسين: المشتقة الجزئية للـ MSE بالنسبة إلى w0 تساوي -(2/N) مجموع البواقي (y_n - ŷ_n)، وبالنسبة إلى w1 المعدل نفسه مضروبًا في x_n. حين تكون المشتقة سالبة، زيادة المعامل تخفض الخسارة؛ وحين تكون موجبة، إنقاصه يخفضها. النزول التدريجي يستثمر هذا حرفيًا: احسب التدرج عند المعاملات الحالية، واتخذ خطوة صغيرة بحجم learning rate في الاتجاه المعاكس للتدرج، ثم كرر. على خسارة على شكل وعاء أملس يقود هذا المشي إلى نقطة argmin — خط المطابقة الأفضل.',
          en: 'The loss-minimizing weights are written with an argmin: the values of w0 and w1 where the MSE is smallest. Calculus reveals the direction of improvement: the partial derivative of the MSE with respect to w0 is -(2/N) times the sum of residuals (y_n - ŷ_n), and with respect to w1 it is the same average multiplied by x_n. Where the derivative is negative, increasing the weight lowers the loss; where positive, decreasing it does. Gradient descent exploits exactly this: evaluate the gradient at the current weights, take a small step of size learning rate in the negative gradient direction, and repeat. On a smooth bowl-shaped loss this walk converges to the argmin — the best-fitting line.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مسح شبكة للخسارة والعثور على argmin', en: 'Scanning a grid of losses to find the argmin' },
      code: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef mse(w0, w1, X, y):\n    n = len(X)\n    total = 0.0\n    for i in range(n):\n        err = y[i] - (w0 + w1 * X[i])\n        total += err * err\n    return total / n\n\nprint('w0=1.0 w1=1.0 -> mse=%.4f' % mse(1.0, 1.0, X, y))\nprint('w0=0.0 w1=2.0 -> mse=%.4f' % mse(0.0, 2.0, X, y))\n\nbest = None\nfor w0 in [-0.2, -0.1, 0.0, 0.1]:\n    for w1 in [1.9, 2.0, 2.1]:\n        v = mse(w0, w1, X, y)\n        if best is None or v < best[0]:\n            best = (v, w0, w1)\nprint('grid argmin: w0=%.1f w1=%.1f mse=%.4f' % (best[1], best[2], best[0]))",
      explanation: {
        ar: 'على بيانات ثابتة من خمس نقاط، دالة mse تجمع مربعات البواقي وتقسم على عددها. الخط (w0=1, w1=1) مخطئ إجمالًا فخسارته 6.1420، بينما (0, 2) يقترب فتهبط الخسارة إلى 0.0220. ثم مسح شبكة صغيرة من 12 زوجًا يكشف argmin التقريبي: (0.0, 2.0) بخسارة 0.0220 — وهو قريب جدًا من الحل الدقيق (-0.01, 2.01). الفكرة الجوهرية: الخسارة وعاء، وكل زوج معاملات نقطة عليه، والتدريب رحلة نحو قاع الوعاء. المسح الشبكي يكفي لتقريب الحل هنا لأن معاملين فقط، لكن التدرج أذكى وأعمم: يخبرك بالاتجاه دون تجربة كل نقطة.',
        en: 'On a fixed five-point dataset, mse sums the squared residuals and divides by their count. The line (w0=1, w1=1) is badly off, so its loss is 6.1420, while (0, 2) is close and the loss drops to 0.0220. A small scan over 12 weight pairs then exposes the approximate argmin: (0.0, 2.0) with loss 0.0220 — very near the exact solution (-0.01, 2.01). The core picture: the loss is a bowl, every weight pair is a point on it, and training is a journey toward the bottom. A grid scan suffices to approximate the answer with only two weights, but the gradient is smarter and scales: it tells you the direction without trying every point.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.implement-mse',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالة mse(w0, w1, X, y) التي تعيد متوسط مربعات الخطأ لخط ŷ = w0 + w1*x على البيانات المعطاة. استخدم الحلقة (بلا مكتبات) وأعد القيمة كعدد عائم. الدالة يجب أن تعيد القيمة فقط دون أي طباعة.',
        en: 'Implement mse(w0, w1, X, y) returning the mean squared error of the line ŷ = w0 + w1*x on the given data. Use a plain loop (no libraries) and return the value as a float. The function should only return the value — no printing.',
      },
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef mse(w0, w1, X, y):\n    ...  # TODO: average of squared residuals (y - (w0 + w1 * x)) ** 2\n",
      solution: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef mse(w0, w1, X, y):\n    n = len(X)\n    total = 0.0\n    for i in range(n):\n        err = y[i] - (w0 + w1 * X[i])\n        total += err * err\n    return total / n",
      tests: [
        {
          id: 't1',
          name: { ar: 'الخسارة عند (0, 1) صحيحة', en: 'Loss at (0, 1) is correct' },
          code: "assert abs(mse(0.0, 1.0, X, y) - 11.182) < 1e-9, 'expected 11.182 | actual: %r' % mse(0.0, 1.0, X, y)",
          expected: '11.182',
        },
        {
          id: 't2',
          name: { ar: 'الخسارة عند (1, 1) صحيحة', en: 'Loss at (1, 1) is correct' },
          code: "assert abs(mse(1.0, 1.0, X, y) - 6.142) < 1e-9, 'expected 6.142 | actual: %r' % mse(1.0, 1.0, X, y)",
          expected: '6.142',
        },
        {
          id: 't3',
          name: { ar: 'الخسارة عند متوسط y بلا ميل تساوي التباين', en: 'Loss at the mean with zero slope equals the variance' },
          code: "assert abs(mse(6.02, 0.0, X, y) - 8.1016) < 1e-9, 'expected 8.1016 | actual: %r' % mse(6.02, 0.0, X, y)",
          expected: '8.1016',
        },
      ],
      hints: [
        { ar: 'الباقي عند كل نقطة هو err = y[i] - (w0 + w1 * X[i]) — الفرق بين المرصود والمُجهَّر.', en: 'The residual at each point is err = y[i] - (w0 + w1 * X[i]) — observed minus fitted.' },
        { ar: 'اجمع مربعات البواقي في مجموع بمهاد 0.0، ثم اقسم على len(X) — متوسط لا مجموع.', en: 'Accumulate the squared residuals into a total starting at 0.0, then divide by len(X) — a mean, not a sum.' },
        { ar: 'قيمة تحقق: mse(1.0, 1.0, X, y) = 6.142 لأن البواقي 1.1, 1.9, 3.1, 3.8, 5.2 ومجموع مربعاتها 30.71.', en: 'Sanity value: mse(1.0, 1.0, X, y) = 6.142 because the residuals are 1.1, 1.9, 3.1, 3.8, 5.2 and their squares sum to 30.71.' },
        { ar: 'الهيكل:\ntotal = 0.0\nfor i in range(len(X)):\n    err = y[i] - (w0 + w1 * X[i])\n    total += err * err\nreturn total / len(X)', en: 'The skeleton:\ntotal = 0.0\nfor i in range(len(X)):\n    err = y[i] - (w0 + w1 * X[i])\n    total += err * err\nreturn total / len(X)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-grad-w0',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: عند (w0, w1) = (1, 1) تكون البواقي 1.1, 1.9, 3.1, 3.8, 5.2 ومجموعها 10.1. احسب المشتقة الجزئية لمتوسط مربعات الخطأ بالنسبة إلى w0 عند هذه النقطة، مذيلة إلى منزلتين عشريتين.',
        en: 'Without running: at (w0, w1) = (1, 1) the residuals are 1.1, 1.9, 3.1, 3.8, 5.2 and they sum to 10.1. Compute the partial derivative of the MSE with respect to w0 at this point, rounded to two decimals.',
      },
      answer: '-4.04',
      solution: '-4.04',
      tolerance: 0.01,
      hints: [
        { ar: 'الصيغة: دMSE/دw0 = -(2/N) مجموع البواقي عند النقطة الحالية.', en: 'The formula: dMSE/dw0 = -(2/N) times the sum of residuals at the current point.' },
        { ar: 'عوّض: -(2/5) * 10.1 — لا تنسَ الإشارة السالبة.', en: 'Substitute: -(2/5) * 10.1 — do not drop the minus sign.' },
        { ar: 'الإشارة السالبة تعني أن زيادة w0 سترفع الخسارة هنا، فالنزول سينقص w0.', en: 'The negative sign means raising w0 would increase the loss here, so descent will decrease w0.' },
        { ar: 'الجواب: -4.04', en: 'Answer: -4.04' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "X = [1, 2, 3, 4, 5]\ny = [2.1, 3.9, 6.1, 7.8, 10.2]\n\ndef mse(w0, w1, X, y):\n    n = len(X)\n    total = 0.0\n    for i in range(n):\n        err = y[i] - (w0 + w1 * X[i])\n        total += err * err\n    return total / n\n\nfor w1 in [1.8, 1.9, 2.0, 2.1, 2.2]:\n    row = ['w1=%.1f' % w1]\n    for w0 in [-0.2, 0.0, 0.2]:\n        row.append('w0=%+.1f:%.4f' % (w0, mse(w0, w1, X, y)))\n    print(' '.join(row))\n\n# جرّب: أضف قيمًا أدق حول (w0=-0.01, w1=2.01) — هل تهبط الخسارة دون 0.0220؟\n# try: add finer values around (w0=-0.01, w1=2.01) — does the loss dip below 0.0220?\n# جرّب: غيّر نقطة واحدة في y وأعد المسح — كيف تتحرك نقطة argmin؟\n# try: change one point in y and rescan — how does the argmin move?\n",
      prompt: {
        ar: 'الملعب يعرض خسارة MSE كجدول ثنائي الأبعاد: كل صف ميل وكل عمود حد ثابت. لا اختبارات هنا — عبث بالأرقام وراقب شكل الوعاء بعينيك.',
        en: 'The sandbox lays the MSE out as a two-dimensional table: one row per slope, one column per intercept. No tests here — poke at the numbers and watch the bowl with your own eyes.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الخسارة القياسية التي يقللها الانحدار الخطي العادي في منظور تقليل الخسارة؟',
            en: 'Which is the standard loss minimized by ordinary linear regression under the loss-minimization perspective?',
          },
          options: [
            { id: 'a', text: { ar: 'مجموع الفروق المطلقة بين y و ŷ', en: 'The sum of absolute differences between y and ŷ' } },
            { id: 'b', text: { ar: 'متوسط مربعات الفروق بين y و ŷ', en: 'The average of squared differences between y and ŷ' } },
            { id: 'c', text: { ar: 'عدد النقاط التي لم يمر بها الخط', en: 'The count of points the line fails to pass through' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'خسارة مربعات الخطأ هي المتوسط: (1/N) مجموع (y_n - ŷ_n)². التربيع يعاقب الأخطاء الكبيرة بشدة ويجعل الخسارة ملساء قابلة للاشتقاق، بخلاف القيم المطلقة التي غير قابلة للاشتقاق عند الصفر.',
            en: 'Squared error loss is the average (1/N) sum of (y_n - ŷ_n)². Squaring penalizes large misses hard and keeps the loss smooth and differentiable, unlike absolute values which are non-differentiable at zero.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا تعني الصيغة argmin للمعاملات w0 و w1؟',
            en: 'What does the argmin over weights w0 and w1 denote?',
          },
          options: [
            { id: 'a', text: { ar: 'أدنى قيمة للخسارة نفسها', en: 'The smallest value of the loss itself' } },
            { id: 'b', text: { ar: 'قيم المعاملات التي عندها الخسارة أدنى ما يمكن', en: 'The weight values at which the loss is smallest' } },
            { id: 'c', text: { ar: 'اتجاه التدرج عند أي نقطة', en: 'The gradient direction at any point' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'argmin يعيد الحجج (قيم w0 وw1) التي تحقق أدنى خسارة، بينما min يعيد قيمة الخسارة الدنيا نفسها. التدريب يبحث عن argmin ثم يستعمل min كتقرير عن جودة الوصول.',
            en: 'argmin returns the arguments (the w0, w1 values) achieving the lowest loss, while min returns that lowest value itself. Training searches for the argmin and uses the min as a report on how well it arrived.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'خطوة النزول التدريجي تحرك المعاملات في أي اتجاه؟',
            en: 'In which direction does a gradient descent step move the weights?',
          },
          options: [
            { id: 'a', text: { ar: 'اتجاه التدرج نفسه', en: 'Along the gradient itself' } },
            { id: 'b', text: { ar: 'الاتجاه المعاكس للتدرج', en: 'Opposite to the gradient' } },
            { id: 'c', text: { ar: 'اتجاه بعيد عن قيم y كلها', en: 'Away from all the y values' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التدرج يشير إلى اتجاه أسرع زيادة في الخسارة، فلأننا نريد التقليل نمشي في سالب التدرج: w_new = w - lr * grad. حجم الخطوة يضبطه معدل التعلم lr — كبير منه يقفز فوق القاع وصغير منه يزحف.',
            en: 'The gradient points in the direction of fastest increase of the loss, so to minimize we walk along its negative: w_new = w - lr * grad. The learning rate lr sets the step size — too large overshoots the bowl, too small crawls.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الانحدار الخطي يفترض y = w0 + w1*x + ε، والتدريب = اختيار w0 وw1 من البيانات. منظور تقليل الخسارة يجعل هذا تحسينًا: قلّل MSE، متوسط مربعات الفروق بين المرصود والمُجهَّر.', en: 'Linear regression assumes y = w0 + w1*x + ε, and training means choosing w0 and w1 from the data. The loss-minimization perspective makes this an optimization: minimize the MSE, the average of squared differences between observed and fitted values.' },
        { ar: 'الهدف هو argmin للخسارة. التدرج يعطي الاتجاه: دMSE/دw0 = -(2/N) مجموع البواقي، ودفMSE/دw1 هو المعدل نفسه مضروبًا في x_n.', en: 'The target is the argmin of the loss. The gradient gives the direction: dMSE/dw0 = -(2/N) times the sum of residuals, and dMSE/dw1 is that same average multiplied by x_n.' },
        { ar: 'النزول التدريجي يكرر: قِس التدرج، ثم خطُ خطوة صغيرة في الاتجاه المعاكس. على وعاء أملس تلتقي الخطوات عند قاع الوعاء — خط المطابقة الأفضل.', en: 'Gradient descent repeats: measure the gradient, then step a small distance the opposite way. On a smooth bowl the steps converge to the bottom — the best-fitting line.' },
      ],
      reflectPrompt: {
        ar: 'في المسح الشبكي وُجد argmin تقريبي عند (0.0, 2.0) والحل الدقيق (-0.01, 2.01). متى يصبح المسح الشبكي غير عملي، وما الذي يضيفه التدرج بوصفه بوصلة بدل خريطة كاملة؟',
        en: 'The grid scan found an approximate argmin at (0.0, 2.0) while the exact answer is (-0.01, 2.01). When does grid scanning become impractical, and what does the gradient add as a compass instead of a full map?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch1.s1' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch1.s1' },
  ],
} satisfies Lesson;

export default lesson;
