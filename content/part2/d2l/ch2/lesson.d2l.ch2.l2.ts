import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch2.l2 — "Linear Algebra and Calculus in Plain Python"
 * الجبر الخطي والتفاضل ببايثون صرفة
 * Aligned with D2L ch2 s3 (Linear Algebra) + s4 (Calculus).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: dot/norms/matvec on fixed literals,
 * then the derivative of f(x)=3x^2+2x by rule vs finite difference at three
 * points, and partials of f(x1,x2)=3x1^2+2x1x2+x2^2. Every literal verified
 * under CPython 3. Deterministic only: no input(), no exit(), no unittest.main.
 */
const lesson = {
  id: 'd2l.ch2.l2',
  version: 1,
  part: 'II',
  track: 'A0',
  book: 'D2L',
  chapter: 2,
  title: {
    ar: 'الجبر الخطي والتفاضل ببايثون صرفة',
    en: 'Linear Algebra and Calculus in Plain Python',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch2.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل نموذج تعلم عميق هو في جوهره عمليتان: ضرب متجهات ومصفوفات، ثم تفاضل خسارة لمعرفة أين تتحرك المعاملات. في هذا الدرس ستبني dot وnorm وmatvec بيديك على أعداد ثابتة، وتشتق f(x)=3x²+2x بالقاعدة وبالفرق المحدود على ثلاث نقاط، ثم تحسب التدرج الجزئي لدالة بمتغيرين. هذه هي العضلات التي سيتدفق عليها التفاضل التلقائي في الدرس القادم.',
        en: 'Every deep learning model boils down to two moves: multiplying vectors and matrices, then differentiating a loss to see where its parameters should move. In this lesson you will build dot, norm and matvec by hand on fixed numbers, derive f(x)=3x\u00b2+2x both by rule and by finite difference at three points, then compute partial derivatives of a two-variable function. These are the muscles that automatic differentiation will flex in the next lesson.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من العدد القياسي إلى المصفوفة', en: 'From scalar to matrix' },
      chunks: [
        {
          ar: 'العدد القياسي scalar رقم واحد، والمتجه vector مصفوفة أرقام بطول ثابت (باختصار محور واحد)، والمصفوفة matrix جدول m×n (محوران) — والصفوف فيها سجلات والأعمدة سمات. العملية الأساسية هي الضرب القياسي dot: uᵀv = Σ uᵢvᵢ، وهو مجموع مرجّح عندما يكون الأوزان موجبة وتجمع إلى 1. تقيس المعيار norm حجم المتجه: ‖x‖₂ = √Σxᵢ² هو طول إقليدي، و‖x‖₁ = Σ|xᵢ| مسافة مانهاتن الأقل حساسية للشواذ. وضرب مصفوفة A بمتجه x هو عمود ناتج كل عنصر منه dot بين صف من A وx — وهو نفسه حساب مخرجات طبقة في شبكة عصبية. في الكتاب: torch.dot وtorch.norm وA@x.',
          en: 'A scalar is one number, a vector a fixed-length strip of numbers (one axis), a matrix an m×n table (two axes) — rows are records, columns are attributes. The core operation is the dot product: u\u1d40v = \u03a3 u\u1d62v\u1d62, a weighted sum whenever the weights are nonnegative and add to 1. A norm measures how big a vector is: \u2016x\u2016\u2082 = \u221a\u03a3x\u1d62\u00b2 is the Euclidean length, while \u2016x\u2016\u2081 = \u03a3|x\u1d62| is the Manhattan distance, less sensitive to outliers. Multiplying a matrix A by a vector x yields one entry per row of A, each a dot product with x — the very computation of a neural network layer\u2019s outputs. In the book: torch.dot, torch.norm and A@x.',
        },
        {
          ar: 'التفاضل يقيس معدل التغير: f\u2032(x) هي نهاية (f(x+h)\u2212f(x))/h عندما يصغر h — ميل المماس عند النقطة. قواعد شائعة تختصر كل شيء: مشتق الثابت 0، ومشتق x\u207f هو nx\u207f\u207b\u00b9، ومشتق e\u02e3 هو e\u02e3، ومشتق ln x هو 1/x، مع جمع الحدود وضربها بالثوابت بحرية. فمثلًا مشتق 3x\u00b2+2x هو 6x+2. عند متغيرات عدة نشتق جزئيًا: نعامل البقية كثوابت، ومتجه المشتقات الجزئية هو التدرج ∇f الذي يشير إلى اتجاه أسرع صعود — والنزول عكسه. وقاعدة السلسلة dy/dx = (dy/du)(du/dx) تفرّق التراكيب، وهي المفتاح الذي سيؤتمته autograd في الدرس التالي.',
          en: 'Differentiation measures rate of change: f\u2032(x) is the limit of (f(x+h)\u2212f(x))/h as h shrinks — the slope of the tangent line. Common rules do the heavy lifting: the derivative of a constant is 0, x\u207f differentiates to nx\u207f\u207b\u00b9, e\u02e3 to e\u02e3, ln x to 1/x, with sums and constant multiples differentiating piecewise. So the derivative of 3x\u00b2+2x is 6x+2. With several variables we differentiate partially: hold the others constant, and the vector of partial derivatives is the gradient \u2207f, pointing uphill — optimization walks the other way. And the chain rule dy/dx = (dy/du)(du/dx) differentiates compositions, the very mechanism autograd automates in the next lesson.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'dot وnorms وmatvec ثم مشتق بثلاث طرق رؤية',
        en: 'dot, norms and matvec, then a derivative three ways',
      },
      code: "import math\n\ndef dot(u, v):\n    return sum(a * b for a, b in zip(u, v))\n\ndef norm2(u):\n    return math.sqrt(dot(u, u))\n\ndef norm1(u):\n    return sum(abs(a) for a in u)\n\ndef matvec(A, x):\n    return [dot(row, x) for row in A]\n\nA = [[0.0, 1.0, 2.0],\n     [3.0, 4.0, 5.0]]\nx = [1.0, 1.0, 1.0]\nu = [3.0, -4.0]\n\nprint('dot([1,2,3],[4,5,6]) =', dot([1.0, 2.0, 3.0], [4.0, 5.0, 6.0]))\nprint('l2(3,-4) =', norm2(u), '| l1(3,-4) =', norm1(u))\nprint('A @ [1,1,1] =', matvec(A, x))\n\ndef f(t):\n    return 3 * t ** 2 + 2 * t\n\ndef fp(t):\n    return 6 * t + 2\n\nh = 1e-5\nfor x0 in [-1.0, 0.0, 2.0]:\n    fd = (f(x0 + h) - f(x0)) / h\n    print('at x=%+.0f: rule=%+.1f finite-diff=%+.6f' % (x0, fp(x0), fd))\n\ndef grad(x1, x2):\n    return (6 * x1 + 2 * x2, 2 * x1 + 2 * x2)\n\nprint('grad f(x1,x2) at (1,2) =', grad(1.0, 2.0))",
      explanation: {
        ar: 'الجزء الأول جبر خطي حرفي: dot([1,2,3],[4,5,6]) = 4+10+18 = 32.0، ومعيارا المتجه (3,−4) هما 5.0 إقليدي (مثلث 3-4-5) و7.0 مانهاتن، وA@[1,1,1] يجمع صفوف A فيكون [3.0, 12.0]. الجزء الثاني تفاضل: القاعدة تعطي f\u2032(x)=6x+2 فيكون عند x=−1 هو −4 وعند 0 هو 2 وعند 2 هو 14. الفرق المحدود بـ h=1e-5 يطابقها حتى ~3e-5 (الحد الخطي + 3h من حد الخطأ) — مطابقة رقمية للاشتقاق اليدوي. وتدرج f(x1,x2)=3x1\u00b2+2x1x2+x2\u00b2 عند (1,2) هو (10.0, 6.0): مشتقان جزئيان في متجه واحد.',
        en: 'Part one is literal linear algebra: dot([1,2,3],[4,5,6]) = 4+10+18 = 32.0; the norms of (3,\u22124) are 5.0 Euclidean (a 3-4-5 triangle) and 7.0 Manhattan; A@[1,1,1] sums the rows of A giving [3.0, 12.0]. Part two is calculus: the rule gives f\u2032(x)=6x+2, so at x=\u22121 it is \u22124, at 0 it is 2, at 2 it is 14. The finite difference with h=1e-5 matches to ~3e-5 (the linear term plus 3h of truncation error) — a numerical confirmation of the hand derivative. And the gradient of f(x1,x2)=3x1\u00b2+2x1x2+x2\u00b2 at (1,2) is (10.0, 6.0): two partials assembled into one vector.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.numerical-gradient',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ numerical_gradient(f, pt, h=1e-5) التي تحسب تدرج f عند نقطة pt (متوفّلة) بالفرق المركزي: لكل إحداثي i تكون المشتقة الجزئية (f(pt+h·eᵢ) − f(pt−h·eᵢ)) / (2h)، وتعيد متجهًا (tuple).',
        en: 'Implement numerical_gradient(f, pt, h=1e-5) that computes the gradient of f at a tuple pt with central differences: for each coordinate i the partial is (f(pt+h\u00b7e\u1d62) \u2212 f(pt\u2212h\u00b7e\u1d62)) / (2h), returned as a tuple.',
      },
      starterCode: "def numerical_gradient(f, pt, h=1e-5):\n    ...  # TODO: perturb one coordinate at a time, central difference, collect into a tuple\n",
      solution: "def numerical_gradient(f, pt, h=1e-5):\n    grads = []\n    for i in range(len(pt)):\n        up = list(pt)\n        dn = list(pt)\n        up[i] = up[i] + h\n        dn[i] = dn[i] - h\n        g = (f(*up) - f(*dn)) / (2 * h)\n        grads.append(g)\n    return tuple(grads)",
      tests: [
        {
          id: 't1',
          name: { ar: 'تدرج الدالة التربيعية المختلطة عند (1,2)', en: 'Gradient of the mixed quadratic at (1,2)' },
          code: "def f2(x1, x2):\n    return 3 * x1 ** 2 + 2 * x1 * x2 + x2 ** 2\n\ng = numerical_gradient(f2, (1.0, 2.0))\nassert abs(g[0] - 10.0) < 1e-4 and abs(g[1] - 6.0) < 1e-4, 'expected (10, 6) up to 1e-4 | actual: %r' % (g,)",
          expected: '(10.0, 6.0) up to 1e-4',
        },
        {
          id: 't2',
          name: { ar: 'مشتقة x^3 عند 2 تساوي 12', en: 'Derivative of x^3 at 2 is 12' },
          code: "def cube(t):\n    return t ** 3\n\ng = numerical_gradient(cube, (2.0,))\nassert abs(g[0] - 12.0) < 1e-3, 'expected 12 up to 1e-3 | actual: %r' % (g,)",
          expected: '12 up to 1e-3',
        },
        {
          id: 't3',
          name: { ar: 'الخريطة الخطية مركزية تمامًا', en: 'A linear map is exact under central differences' },
          code: "def lin(t):\n    return 3 * t\n\ng = numerical_gradient(lin, (4.0,), h=1e-3)\nassert abs(g[0] - 3.0) < 1e-9, 'central difference of a linear map is exact | actual: %r' % (g,)",
          expected: 'exactly 3.0',
        },
      ],
      hints: [
        { ar: 'انسخ النقطة مرتين لكل إحداثي: up وdn، وغيّر الإحداثي i وحده ثم اطبق f(*up) وf(*dn).', en: 'Copy the point twice per coordinate: up and dn; change only coordinate i, then call f(*up) and f(*dn).' },
        { ar: 'الفرق المركزي أدق من الأمامي: (f(up) − f(dn)) / (2h) — لاحظ القاسم 2h.', en: 'Central differences beat forward ones: (f(up) \u2212 f(dn)) / (2h) — mind the 2h denominator.' },
        { ar: 'قيم تحقق: عند f(x1,x2)=3x1\u00b2+2x1x2+x2\u00b2 التحليلي ∇f = (6x1+2x2, 2x1+2x2) فيكون عند (1,2) هو (10, 6).', en: 'Sanity values: for f(x1,x2)=3x1\u00b2+2x1x2+x2\u00b2 the analytic gradient is \u2207f = (6x1+2x2, 2x1+2x2), i.e. (10, 6) at (1,2).' },
        { ar: 'اجمع النواتج في قائمة ثم أعدها tuple(grads) حتى يعمل كل من pt=(2.0,) وpt=(1.0, 2.0).', en: 'Collect results in a list and return tuple(grads) so both pt=(2.0,) and pt=(1.0, 2.0) work.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-gradient-direction',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'عند نقطة x₀ كانت f\u2032(x₀) > 0. لتقليل f، إلى أين تحرك x؟',
        en: 'At a point x\u2080 you find f\u2032(x\u2080) > 0. To decrease f, in which direction should x move?',
      },
      options: [
        { id: 'a', text: { ar: 'نحو زيادة x — مع اتجاه المشتقة', en: 'Increase x — along the derivative' } },
        { id: 'b', text: { ar: 'نحو إنقاص x — عكس اتجاه المشتقة', en: 'Decrease x — against the derivative' } },
        { id: 'c', text: { ar: 'الاتجاه لا يهم لأن المشتقة موجبة', en: 'Direction does not matter since the derivative is positive' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'المشتقة الموجبة تعني أن f ترتفع عندما تزيد x قليلًا.', en: 'A positive derivative means f rises when x grows a little.' },
        { ar: 'خطوة النزول x ← x − lr·f\u2032(x) تسير عكس التدرج دائمًا.', en: 'The descent step x \u2190 x \u2212 lr\u00b7f\u2032(x) always walks against the gradient.' },
        { ar: 'جرّب ذهنيًا f(x)=3x\u00b2+2x عند x=2: المشتقة 14 > 0 والقاع على اليسار عند x=\u22121/3.', en: 'Try it mentally on f(x)=3x\u00b2+2x at x=2: the derivative is 14 > 0 and the valley lies to the left at x=\u22121/3.' },
        { ar: 'الجواب: b — النزول الاشتقاقي يقفز عكس الميل.', en: 'Answer: b — gradient descent steps against the slope.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef dot(u, v):\n    return sum(a * b for a, b in zip(u, v))\n\ndef norm2(u):\n    return math.sqrt(dot(u, u))\n\nu = [1.0, 2.0, 3.0]\nv = [4.0, 5.0, 6.0]\nhad = [a * b for a, b in zip(u, v)]\nprint('u*v =', had, '| sum(u*v) =', sum(had))\n\nA = [[0.0, 1.0, 2.0],\n     [3.0, 4.0, 5.0]]\nAT = [list(col) for col in zip(*A)]\nprint('A transpose:', AT)\n\nS = [[1.0, 2.0, 3.0],\n     [2.0, 0.0, 4.0],\n     [3.0, 4.0, 5.0]]\nprint('S symmetric:', S == [list(c) for c in zip(*S)])\n\nw = [0.2, 0.3, 0.5]\nvals = [10.0, 20.0, 30.0]\nprint('weighted avg:', dot(w, vals))\n\n# جرّب: احسب norm2 لكل صف من A دون فهارس (zip + قائمة داخل قائمة).\n# try: compute norm2 of every row of A without indexing (zip + comprehensions).\n# جرّب: تحقق من متباينة المثلث على u وv: norm2([a+b for ...]) <= norm2(u) + norm2(v).\n# try: check the triangle inequality on u and v: norm2 of the sum vs sum of the norms.\n",
      prompt: {
        ar: 'الملعب يوسع أدواتك: حاصل الضرب عنصر-بعنصر (Hadamard) الذي مجموعه يساوي dot، والنقل transpose عبر zip، ومصفوفة متماثلة، ومتوسط مرجّح كضرب قياسي بأوزان تجمع إلى 1.',
        en: 'The sandbox extends your toolkit: the elementwise (Hadamard) product whose sum equals the dot product, the transpose via zip, a symmetric matrix, and a weighted average as a dot product with weights summing to 1.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما قيمة dot([1,2,3],[4,5,6])؟',
            en: 'What is dot([1,2,3],[4,5,6])?',
          },
          options: [
            { id: 'a', text: { ar: '21', en: '21' } },
            { id: 'b', text: { ar: '32', en: '32' } },
            { id: 'c', text: { ar: '6', en: '6' } },
          ],
          answer: 'b',
          explanation: {
            ar: '1\u00b74 + 2\u00b75 + 3\u00b76 = 4+10+18 = 32. هذا هو مجموع المربعات غير — بل مجموع حواصل الأزواج المتقابلة، وهو نفسه sum(u*v) بعد الضرب عنصر-بعنصر.',
            en: '1\u00b74 + 2\u00b75 + 3\u00b76 = 4+10+18 = 32. It is not a sum of squares — it is the sum of pairwise products, the same as sum(u*v) after an elementwise multiply.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما المعيار الإقليدي ‖(3, −4)‖₂؟',
            en: 'What is the Euclidean norm \u2016(3, \u22124)\u2016\u2082?',
          },
          options: [
            { id: 'a', text: { ar: '7', en: '7' } },
            { id: 'b', text: { ar: '5', en: '5' } },
            { id: 'c', text: { ar: '25', en: '25' } },
          ],
          answer: 'b',
          explanation: {
            ar: '√(9+16) = √25 = 5 — مثلث 3-4-5. القيمة 7 هي معيار ‖·‖₁ (3+4)، والقيمة 25 مربع المعيار لا معياره.',
            en: '\u221a(9+16) = \u221a25 = 5 — the 3-4-5 triangle. 7 is the \u2016\u00b7\u2016\u2081 norm (3+4), and 25 is the squared norm, not the norm.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما مشتق f(x) = 3x\u00b2 + 2x؟',
            en: 'What is the derivative of f(x) = 3x\u00b2 + 2x?',
          },
          options: [
            { id: 'a', text: { ar: '6x + 2', en: '6x + 2' } },
            { id: 'b', text: { ar: '3x + 2', en: '3x + 2' } },
            { id: 'c', text: { ar: '6x', en: '6x' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قاعدة القوة على كل حد: مشتق 3x\u00b2 هو 6x ومشتق 2x هو 2. الطرح ثم الجمع: عند x=2 تكون 14 كما أظهر الفرق المحدود في المثال.',
            en: 'The power rule on each term: 3x\u00b2 differentiates to 6x and 2x to 2, summed. At x=2 that is 14 — exactly what the finite difference showed in the worked example.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الجبر الخطي بلغة بايثون: dot مجموع الأزواج (ومتوسط مرجّح بأوزان تجمع إلى 1)، وnorm2/norm1 معيارا الحجم، وmatvec صف-بصف — الهدف من s3 الجبر الخطي.', en: 'Linear algebra in Python terms: dot sums pairwise products (a weighted average when weights sum to 1), norm2/norm1 measure size, matvec works row by row — the goal of s3 Linear Algebra.' },
        { ar: 'التفاضل هو محرك التعلم: f\u2032 معدل التغير (نهاية الفرق)، وقواعد القوة والجمع تعطي f\u2032(x)=6x+2 لـ 3x\u00b2+2x، والفرق المحدود يتحقق منها رقميًا — الهدف من s4 التفاضل.', en: 'Differentiation is the engine of learning: f\u2032 is the rate of change (a limit of differences), power and sum rules give f\u2032(x)=6x+2 for 3x\u00b2+2x, and finite differences confirm it numerically — the goal of s4 Calculus.' },
        { ar: 'عند عدة متغيرات: المشتقات الجزئية تتجم في تدرج ∇f عند (1,2) يساوي (10, 6) لدالتنا، وقاعدة السلسلة ستربط الطبقات في الدرس التالي.', en: 'With several variables: partial derivatives assemble into the gradient \u2207f — (10, 6) at (1,2) for our function — and the chain rule will chain layers together in the next lesson.' },
      ],
      reflectPrompt: {
        ar: 'شاهدت الفرق المحدود يقارب القاعدة حتى ~3e-5. لو صغّرنا h إلى 1e-12 فهل تتحسن النتيجة دائمًا؟ فكّر في خطأ التقريب العشري مقابل خطأ الاقتطاع قبل أن تجرب في الملعب.',
        en: 'You watched the finite difference match the rule to ~3e-5. If we shrink h to 1e-12, does the result always improve? Think about floating-point rounding versus truncation error before testing it in the sandbox.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch2.s3' },
        { book: 'D2L', section: 'd2l.ch2.s4' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch2.s3' },
    { book: 'D2L', section: 'd2l.ch2.s4' },
  ],
} satisfies Lesson;

export default lesson;
