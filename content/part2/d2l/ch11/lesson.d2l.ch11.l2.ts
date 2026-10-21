import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch11.l2 — "From Bahdanau to Multi-Head Self-Attention"
 * من بهداناو إلى الرؤوس المتعددة والانتباه الذاتي
 * Aligned with D2L ch11 s4 (The Bahdanau Attention Mechanism) + s5 (Multi-Head
 * Attention) + s6 (Self-Attention and Positional Encoding). All expression is
 * original — a paraphrase of the source's ideas, never a verbatim translation.
 * Runnable design: an additive attention score at fixed values, two fixed
 * heads on a two-token sequence, and sin/cos positional rows; every literal
 * verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch11.l2',
  version: 1,
  part: 'II',
  track: 'A6',
  book: 'D2L',
  chapter: 11,
  title: {
    ar: 'من بهداناو إلى الرؤوس المتعددة والانتباه الذاتي',
    en: 'From Bahdanau to Multi-Head Self-Attention',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch11.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'مفكِّك الدرس الماضي يرى الجملة كاملة عبر متجه واحد — عنق زجاجة يخنق الجمل الطويلة. فكرة بهداناو (2014): لا تضغط؛ اجعل السياق يُحسب من جديد عند كل خطوة توليد، بانتباه يزن حالات المرمِّز كلها. ثم التوسع الطبيعي: رؤوس متعددة ترى فضاءات تمثيل مختلفة، ثم إطلاق الانتباه من نفسه: كل رمز يستعلم عن بقية الرموز. لكن التوليد المتوازي يفقد الترتيب — فيعود في صورة جمع جمعيّ من جيب وجيب تمام.',
        en: 'Last lesson\u2019s decoder sees the whole sentence through one vector \u2014 a bottleneck that strangles long inputs. Bahdanau\u2019s idea (2014): do not compress; recompute the context at every generation step with attention weighting all encoder states. Then the natural expansions: multiple heads looking through different representation subspaces, and self-attention letting every token query every other. But parallel generation loses order \u2014 which returns as an additive mix of sine and cosine.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'سياق متجدد، رؤوس متعددة، ثم انتباه ذاتي موضعي', en: 'A living context, many heads, then positioned self-attention' },
      chunks: [
        {
          ar: 'في انتباه Bahdanau يصبح السياق دالة زمن: c_t\u2032 = Σ_t α(s_t\u2032\u22121, h_t)·h_t — الاستعلام حالة المفكِّك من الخطوة السابقة، والمفاتيح والقيم معًا حالات المرمِّز كلها h_t. أي أن كل رمز توليدي يُعاد موازنة الجملة المصدرية كاملة قبل توليده، والوزن يحسب بدالة الانتباه الإضافية من الدرس الماضي. هذا «التعلم المحاذاة» حوّل الترجمة: بدل مرور كل المعلومة عبر h_T واحد، يلتقط المفكِّك ما يناسب خطوته — وهو الفكرة التي أنجبت Transformers لاحقًا.',
          en: 'In Bahdanau attention the context becomes a function of time: c_t\u2032 = \u03a3_t \u03b1(s_t\u2032\u22121, h_t)\u00b7h_t \u2014 the query is the decoder\u2019s previous state, and the keys and values are all encoder states h_t together. Every generation step re-weighs the whole source sentence before emitting its token, with the weight computed by the additive scoring function from last lesson. This learned alignment transformed translation: instead of squeezing everything through one h_T, the decoder picks what suits its current step \u2014 the idea that later gave birth to Transformers.',
        },
        {
          ar: 'الرأس الواحد يرى التوافق بمنظار واحد. الانتباه متعدد الرؤوس يُسقط q و k و v بعدد h من الإسقاطات الخطية المتعلمة، ويشغّل تجميعًا انتباهيًا متوازيًا لكل رأس، ثم يدمج h المخرج ويمررها بإسقاط W_o: لكل رأس رأس h_i = f(W_i^(q) q, W_i^(k) k, W_i^(v) v). لتثبيت الكلفة يُختار p_q = p_k = p_v = p_o/h — مثلًا 100 وحدة خفية و5 رؤوس تعني 20 بُعدًا لكل رأس. فتلتقط الرؤوس تبعيات مختلفة المدى وشرائح دلالية مختلفة في التوازي.',
          en: 'One head sees compatibility through one lens. Multi-head attention projects q, k, and v with h independently learned linear maps, runs attention pooling for every head in parallel, concatenates the h outputs, and passes them through W_o: each head h_i = f(W_i^(q) q, W_i^(k) k, W_i^(v) v). To cap the cost, p_q = p_k = p_v = p_o/h \u2014 100 hidden units with 5 heads means 20 dimensions per head. Different heads then capture dependencies of different ranges and different semantic slices, all at once.',
        },
        {
          ar: 'الانتباه الذاتي: المتواليات نفسها تلعب الأدوار الثلاثة — y_i = f(x_i, (x_1, x_1), …, (x_n, x_n)) فكل رمز يقابل كل الرموز مباشرة. المقارنة مع المعماريات: CNN بنواة k تكلف O(k·n·d\u00b2) بمسار أقصى O(n/k)؛ RNN يكلف O(n·d\u00b2) لكن تسلسليًا n خطوة ومسار O(n)؛ والانتباه الذاتي O(n\u00b2·d) بحساب متوازٍ كامل ومسار O(1) — أقصر طريق لأي ترابط، والثمن التربيعي مع n. ولأن التجميع الانتباهي لا يعرف الترتيب، يُجمع مع المدخل ترميز موضعي ثابت: p_i,2j = sin(i/10000^(2j/d)) و p_i,2j+1 = cos(i/10000^(2j/d)) — ترددات تتناقص على طول الأبعاد تحمل معلومات موضعية مطلقة ونسبية معًا.',
          en: 'Self-attention: the sequence plays all three roles \u2014 y_i = f(x_i, (x_1, x_1), \u2026, (x_n, x_n)) \u2014 every token directly matched against every other. Architecture comparison: a CNN with kernel k costs O(k\u00b7n\u00b7d\u00b2) with maximum path O(n/k); an RNN costs O(n\u00b7d\u00b2) but runs n sequential steps with path O(n); self-attention is O(n\u00b2\u00b7d) with fully parallel computation and path O(1) \u2014 the shortest route between any two positions, paid for by quadratic cost in n. And because attention pooling knows no order, a fixed positional encoding is added to the input: p_i,2j = sin(i/10000^(2j/d)) and p_i,2j+1 = cos(i/10000^(2j/d)) \u2014 frequencies decreasing along dimensions, carrying absolute and relative position at once.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'درجة إضافية وقيم ثابتة، رأسان مثبتان، وصفوف sin/cos',
        en: 'An additive score at fixed values, two fixed heads, and sin/cos rows',
      },
      code: "import math\n\ndef softmax(scores):\n    m = max(scores)\n    exps = [math.exp(s - m) for s in scores]\n    return [e / sum(exps) for e in exps]\n\ndef proj(W, v):\n    return [sum(W[i][j] * v[j] for j in range(len(v))) for i in range(len(W))]\n\n# --- Bahdanau additive attention at fixed values (h = 2) ---\nq = [1.0, 2.0]\nK = [[0.5, -0.5], [1.0, 1.0], [-1.0, 0.0]]\nWq = [[1.0, 0.0], [0.0, 1.0]]\nWk = [[1.0, 0.0], [0.0, -1.0]]\nwv = [1.0, -1.0]\nscores = []\nfor k in K:\n    feats = [a + b for a, b in zip(proj(Wq, q), proj(Wk, k))]\n    tanned = [math.tanh(f) for f in feats]\n    scores.append(sum(w * t for w, t in zip(wv, tanned)))\nprint('additive scores  :', [round(s, 6) for s in scores])\nw = softmax(scores)\nprint('attention weights:', [round(x, 4) for x in w])\ncontext = [sum(w[i] * K[i][j] for i in range(len(K))) for j in range(2)]\nprint('context:', [round(c, 4) for c in context])\n\n# --- two fixed heads on two tokens (d = 2, one dimension per head) ---\nX = [[1.0, 0.0], [0.0, 1.0]]\n\ndef head_outputs(X, coord):\n    outs = []\n    for i in range(2):\n        S = [X[i][coord] * X[j][coord] for j in range(2)]\n        ww = softmax(S)\n        outs.append(sum(ww[j] * X[j][coord] for j in range(2)))\n    return outs\n\nh1, h2 = head_outputs(X, 0), head_outputs(X, 1)\nprint('head 1:', [round(v, 4) for v in h1])\nprint('head 2:', [round(v, 4) for v in h2])\nprint('token 1 ->', [round(h1[0], 4), round(h2[0], 4)],\n      '| token 2 ->', [round(h1[1], 4), round(h2[1], 4)])\n\n# --- fixed sin/cos positional encoding, d = 4 ---\nd = 4\nfor i in range(4):\n    row = []\n    for j in range(d // 2):\n        omega = 1.0 / (10000 ** (2 * j / d))\n        row.append(math.sin(i * omega))\n        row.append(math.cos(i * omega))\n    print('pos %d:' % i, [round(v, 4) for v in row])",
      explanation: {
        ar: 'الدرجة الإضافية: W_q·q = [1, 2] و W_k يقلب إشارة البعد الثاني، فالميزات لكل مفتاح [1.5, 2.5] و [2, 1] و [0, 2] تعطي بعد tanh الدجات [−0.081466, 0.202433, −0.964028]. الـ softmax يوزع الأوزان [0.3647, 0.4844, 0.1509] والسياق (المفاتيح هي القيم) [0.5159, 0.3021] — مزيج جديد لكل استعلام. الرأسان على رمزين: الرأس الأول يقرأ البعد الأول فتكون أوزان الرمز الأول softmax([1, 0]) = [0.7311, 0.2689] ومخرجه 0.7311، بينما الرأس الثاني لا يرى إشارة (البعد الثاني صفير للرمز الأول) فأوزانه موحدة ومخرجه 0.5 — والرمز الثاني يعكس الصورة. الدمج [0.7311, 0.5] و [0.5, 0.7311]: رأسان، نمطا انتباه مختلفان، فضاءان. وصفوف الموضع تبدأ [0, 1, 0, 1] ثم تتذبذب: sin(i) و cos(i) سريعان في العمودين الأولين و sin(i/100) و cos(i/100) بطيئان في الأخيرين — ترددات متناقصة كما في الأرقام الثنائية.',
        en: 'The additive score: W_q\u00b7q = [1, 2] while W_k flips the second coordinate\u2019s sign, so the features per key are [1.5, 2.5], [2, 1], [0, 2], giving after tanh the scores [\u22120.081466, 0.202433, \u22120.964028]. Softmax spreads weights [0.3647, 0.4844, 0.1509] and the context (keys = values) is [0.5159, 0.3021] \u2014 a fresh mixture per query. Two heads on two tokens: head 1 reads coordinate one, so token 1\u2019s weights are softmax([1, 0]) = [0.7311, 0.2689] and its output is 0.7311, while head 2 sees no signal (token 1\u2019s second coordinate is zero for both keys) \u2014 uniform weights, output 0.5; token 2 mirrors the pattern. The concatenations [0.7311, 0.5] and [0.5, 0.7311] show two heads, two attention patterns, two subspaces. Positional rows start [0, 1, 0, 1] then oscillate: sin(i) and cos(i) are fast in the first two columns, sin(i/100) and cos(i/100) slow in the last \u2014 decreasing frequencies like binary digits.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.additive-score',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ additive_score(q, k, Wq, Wk, wv) التي تحسب درجة الانتباه الإضافي: أسقط q بـ Wq و k بـ Wk إلى الفضاء الخفي نفسه، اجمعهما، مرر tanh على كل بعد خفي، ثم اضرب بالمتجه wv واجمع — أعد عددًا واحدًا.',
        en: 'Implement additive_score(q, k, Wq, Wk, wv) computing the additive attention score: project q by Wq and k by Wk into the same hidden space, add them, apply tanh per hidden unit, then take the dot product with wv \u2014 return a single number.',
      },
      starterCode: "import math\n\ndef additive_score(q, k, Wq, Wk, wv):\n    ...  # TODO: project, add, tanh per hidden unit, dot with wv\n    return score\n\nWq = [[1.0, 0.0], [0.0, 1.0]]\nWk = [[1.0, 0.0], [0.0, -1.0]]\nprint(additive_score([1.0, 2.0], [0.5, -0.5], Wq, Wk, [1.0, -1.0]))\nprint(additive_score([0.0, 0.0], [0.0, 0.0], Wq, Wk, [1.0, 1.0]))\nprint(additive_score([0.5], [0.5], [[1.0]], [[1.0]], [1.0]))\n",
      solution: "import math\n\ndef additive_score(q, k, Wq, Wk, wv):\n    feats = []\n    for row_q, row_k in zip(Wq, Wk):\n        z = sum(row_q[j] * q[j] for j in range(len(q))) \\\n            + sum(row_k[j] * k[j] for j in range(len(k)))\n        feats.append(math.tanh(z))\n    return sum(w * f for w, f in zip(wv, feats))",
      tests: [
        {
          id: 't1',
          name: { ar: 'مثال الدرس: tanh(1.5) − tanh(2.5) سالب رغم تشابه المدخلات', en: 'The lesson\u2019s example: tanh(1.5) \u2212 tanh(2.5) is negative despite similar inputs' },
          code: "import math\ns = additive_score([1.0, 2.0], [0.5, -0.5], [[1.0, 0.0], [0.0, 1.0]], [[1.0, 0.0], [0.0, -1.0]], [1.0, -1.0])\nassert abs(s - (math.tanh(1.5) - math.tanh(2.5))) < 1e-12, 'expected tanh(1.5)-tanh(2.5) | actual: %r' % s",
          expected: 'tanh(1.5) - tanh(2.5)',
        },
        {
          id: 't2',
          name: { ar: 'مدخلات صفرية تعطي درجة صفر مهما كانت الأوزان', en: 'Zero inputs give a zero score whatever the weights' },
          code: "s = additive_score([0.0, 0.0], [0.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [[1.0, 0.0], [0.0, 1.0]], [1.0, 1.0])\nassert abs(s) < 1e-12, 'expected 0.0 | actual: %r' % s",
          expected: '0.0',
        },
        {
          id: 't3',
          name: { ar: 'فضاء خفي أحادي: الدرجة tanh(q + k) ببساطة', en: 'One hidden unit: the score is simply tanh(q + k)' },
          code: "import math\ns = additive_score([0.5], [0.5], [[1.0]], [[1.0]], [1.0])\nassert abs(s - math.tanh(1.0)) < 1e-12, 'expected tanh(1.0) | actual: %r' % s",
          expected: 'tanh(1.0)',
        },
      ],
      hints: [
        { ar: 'لكل صف i من المصفوفات: z_i = Wq[i]·q + Wk[i]·k ثم feats.append(math.tanh(z_i)) — التجميع الإضافي يحدث داخل tanh.', en: 'For each row i: z_i = Wq[i]\u00b7q + Wk[i]\u00b7k then feats.append(math.tanh(z_i)) \u2014 the addition happens inside the tanh.' },
        { ar: 'الخطوة الأخيرة حاصل ضرب قياسي مع wv: sum(w * f for w, f in zip(wv, feats)).', en: 'The final step is a dot product with wv: sum(w * f for w, f in zip(wv, feats)).' },
        { ar: 'بعد tanh تكون كل ميزة في (−1, 1)، لكن wv قد يسلّط إشارات متعاكسة فتخرج درجات سالبة كما في t1.', en: 'After tanh each feature lies in (\u22121, 1), but wv may carry opposing signs, so scores can go negative as in t1.' },
        { ar: 'قيم تحقق: t1 يعطي ≈ −0.0815، و t3 يعطي tanh(1.0) ≈ 0.7616.', en: 'Sanity values: t1 gives \u2248 \u22120.0815, and t3 gives tanh(1.0) \u2248 0.7616.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-positional',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يحتاج الانتباه الذاتي إلى ترميز موضعي صريح بينما لا يحتاجه RNN؟',
        en: 'Why does self-attention need an explicit positional encoding while an RNN does not?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن softmax لا يقبل قيمًا سالبة دون ترميز موضعي', en: 'Because softmax rejects negative values without positional encoding' } },
        { id: 'b', text: { ar: 'لأن RNN يستهلك الرموز واحدًا تلو الآخر فيعرف الترتيب بنيويًا، بينما التجميع الانتباهي مجموع موزون لا يتأثر بترتيب المدخلات — بدل الرموز تبدل المخرجات', en: 'Because an RNN consumes tokens one at a time and knows order structurally, while attention pooling is a weighted sum indifferent to input order \u2014 permuting tokens permutes the outputs' } },
        { id: 'c', text: { ar: 'لأن الترميز الموضعي يقلص التعقيد التربيعي O(n\u00b2d) إلى O(nd\u00b2)', en: 'Because positional encoding reduces the quadratic O(n\u00b2d) complexity to O(nd\u00b2)' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل نفسك: لو بدلت موضعي رمزين في المدخل، هل يتغير وزن أي زوج (q, k)؟', en: 'Ask yourself: if you swap two tokens in the input, does any (q, k) weight change?' },
        { ar: 'التجمع الانتباهي يعيد التركيب نفسه بأي ترتيب للحدود — مجموع لا يعني الموقع.', en: 'Attention pooling returns the same mixture under any ordering of its terms \u2014 a sum carries no location.' },
        { ar: 'الـ RNN يحمل ترتيبه في بنيته: كل خطوة تُبنى على السابقة، فلا حاجة لإخباره بالترتيب.', en: 'An RNN carries order in its very structure: each step builds on the previous, so it needs no order hint.' },
        { ar: 'الجواب: b — الحل الجمعي sin/cos يعيد حقن الترتيب بلا تسلسل، مع معلومة مطلقة ونسبية معًا.', en: 'Answer: b \u2014 the additive sin/cos scheme reinjects order without sequencing, carrying absolute and relative information.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\nd = 6\n\ndef pos(i, j):\n    omega = 1.0 / (10000 ** (2 * (j // 2) / d))\n    return math.sin(i * omega) if j % 2 == 0 else math.cos(i * omega)\n\n# the book's relative-position property: a fixed 2x2 rotation maps\n# (p_i,0, p_i,1) to (p_{i+delta,0}, p_{i+delta,1}) for any offset delta\nok_all = True\nfor i in range(0, 4):\n    for delta in (1, 2, 3):\n        c, s = math.cos(delta), math.sin(delta)\n        pi = (pos(i, 0), pos(i, 1))\n        rot = (c * pi[0] + s * pi[1], -s * pi[0] + c * pi[1])\n        pj = (pos(i + delta, 0), pos(i + delta, 1))\n        ok = abs(rot[0] - pj[0]) < 1e-9 and abs(rot[1] - pj[1]) < 1e-9\n        ok_all = ok_all and ok\n        if i == 1 and delta == 2:\n            print('i=1 delta=2 rotation:', [round(v, 4) for v in rot])\n            print('i=1 delta=2 position:', [round(v, 4) for v in pj])\nprint('all 12 offsets reproduce p_{i+delta}:', ok_all)\n\n# جرّب: d=4 و delta=5 — هل تصمد خاصية الدوران بعد إزاحات كبيرة؟\n# try: d=4 with delta=5 - does the rotation property survive large offsets?\n",
      prompt: {
        ar: 'الملعب يتحقق من خاصية الموضع النسبي في الكتاب: مصفوفة دوران ثابتة (لا تعتمد على i) تدور (p_i,0, p_i,1) بمقدار δ فتعطي (p_i+δ,0, p_i+δ,1) — عند i=1 و δ=2 يعطي الدوران [0.1411, −0.99] وهو بالضبط (sin 3, cos 3). النتيجة: كل الإزاحات الاثنا عشر تنجح، أي أن النموذج يستطيع أن يتعلم الانتباه بالإزاحات النسبية من الترميز المطلق نفسه.',
        en: 'The sandbox verifies the book\u2019s relative-position property: a fixed 2\u00d72 rotation (independent of i) turns (p_i,0, p_i,1) by \u03b4 into (p_i+\u03b4,0, p_i+\u03b4,1) \u2014 at i=1, \u03b4=2 the rotation yields [0.1411, \u22120.99], exactly (sin 3, cos 3). All twelve offsets succeed: a model can learn to attend by relative offsets from the same absolute encoding.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في انتباه Bahdanau، ما أدوار حالات المرمِّز h_t وحالة المفكِّك السابقة s_t\u2032\u22121؟',
            en: 'In Bahdanau attention, what roles do the encoder states h_t and the previous decoder state s_t\u2032\u22121 play?',
          },
          options: [
            { id: 'a', text: { ar: 'h_t مفاتيح وقيمًا معًا، و s_t\u2032\u22121 استعلامًا', en: 'h_t are both keys and values, s_t\u2032\u22121 is the query' } },
            { id: 'b', text: { ar: 'h_t استعلامًا و s_t\u2032\u22121 مفتاحًا وقيمة', en: 'h_t is the query and s_t\u2032\u22121 the key and value' } },
            { id: 'c', text: { ar: 'كلاهما استعلامات متناوبة حسب الخطوة', en: 'Both alternate as queries depending on the step' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'c_t\u2032 = Σ α(s_t\u2032\u22121, h_t)·h_t: حالة المفكِّك السابقة تسأل، وحالات المرمِّز تُجيب وتُوزن وتُجمع — لهذا يقول الكتاب إن s_t\u2032\u22121 استعلام و h_t مفتاح وقيمة معًا.',
            en: 'c_t\u2032 = \u03a3 \u03b1(s_t\u2032\u22121, h_t)\u00b7h_t: the decoder\u2019s previous state asks, the encoder states answer and are weighted and pooled \u2014 hence the book\u2019s phrasing: s_t\u2032\u22121 is the query, h_t both key and value.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'بطبقة انتباه متعدد الرؤوس بعدد 100 وحدة إخراج و h = 5 رؤوس، كم بعدًا للإسقاط في كل رأس وفق اختيار الكتاب لتثبيت الكلفة؟',
            en: 'For a multi-head attention layer with 100 output units and h = 5 heads, how many projection dimensions per head under the book\u2019s cost-capping choice?',
          },
          options: [
            { id: 'a', text: { ar: '100 — كل رأس يرى الفضاء كاملًا', en: '100 \u2014 every head sees the full space' } },
            { id: 'b', text: { ar: '20 — لأن p_q = p_k = p_v = p_o/h', en: '20 \u2014 because p_q = p_k = p_v = p_o/h' } },
            { id: 'c', text: { ar: '500 — الرؤوس تجمع أبعادها', en: '500 \u2014 the heads pool their dimensions' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'لتجنب تضخم الكلفة يُختار p_o/h لكل إسقاط: 100/5 = 20 بعدًا لكل رأس، وتُحسب الرؤوس الخمسة بالتوازي ثم يُدمج خرجها بإسقاط W_o يعيد 100.',
            en: 'To cap cost each projection uses p_o/h: 100/5 = 20 dimensions per head; the five heads run in parallel and their concatenated output goes through W_o back to 100.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'بمقارنة تعقيد خريطة n رمزًا ببعد d: أي العبارات صحيح للانتباه الذاتي مقابل RNN؟',
            en: 'Comparing the cost of mapping n tokens of dimension d: which statement is correct for self-attention vs an RNN?',
          },
          options: [
            { id: 'a', text: { ar: 'الانتباه الذاتي O(n\u00b2d) متوازٍ بمسار O(1)، و RNN بـ O(nd\u00b2) تسلسلي بمسار O(n)', en: 'Self-attention O(n\u00b2d), parallel with path O(1); the RNN O(nd\u00b2), sequential with path O(n)' } },
            { id: 'b', text: { ar: 'الانتباه الذاتي أرخص حسابيًا وأبطأ توازيًا', en: 'Self-attention is computationally cheaper and less parallel' } },
            { id: 'c', text: { ar: 'كلاهما O(n\u00b2d) لكن بمسارات مختلفة', en: 'Both are O(n\u00b2d) but with different path lengths' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'ضرب (n\u00d7d) في (d\u00d7n) ثم (n\u00d7n) في (n\u00d7d) يعطي O(n\u00b2d) بعمليات متوازية كاملة ومسار أقصى O(1) — مقابل O(nd\u00b2) لكن بخطوات متعاقبة ومسار O(n) للـ RNN. التربيعية في n هي الثمن الذي يحد المتواليات الطويلة جدًا.',
            en: 'Multiplying (n\u00d7d) by (d\u00d7n) and then (n\u00d7n) by (n\u00d7d) costs O(n\u00b2d) with fully parallel computation and maximum path O(1) \u2014 versus the RNN\u2019s O(nd\u00b2) with sequential steps and path O(n). The quadratic term is the price that caps very long sequences.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'انتباه Bahdanau (الهدف من s4): السياق يُعاد حسابه كل خطوة توليد c_t\u2032 = Σ α(s_t\u2032\u22121, h_t)·h_t — استعلام من المفكِّك، مفاتيح وقيم من المرمِّز، بدرجة إضافية tanh — فيتحول h_T الجامد إلى محاذاة متعلمة.', en: 'Bahdanau attention (goal of s4): the context is recomputed at every step c_t\u2032 = \u03a3 \u03b1(s_t\u2032\u22121, h_t)\u00b7h_t \u2014 query from the decoder, keys and values from the encoder, additive tanh scoring \u2014 turning the rigid h_T into a learned alignment.' },
        { ar: 'الرؤوس المتعددة (الهدف من s5): h إسقاطات متعلمة بعرض p_o/h تعمل بالتوازي ثم تُدمج بـ W_o — كل رأس فضاء وتصنيف تبعيات خاص، بلا زيادة في الكلفة.', en: 'Multi-head attention (goal of s5): h learned projections of width p_o/h run in parallel and merge through W_o \u2014 each head its own subspace and dependency profile, at no extra cost.' },
        { ar: 'الانتباه الذاتي والترميز الموضعي (الهدف من s6): كل رمز يقابل الجميع (O(n\u00b2d)، مسار O(1)، توازٍ كامل)، والترتيب يعود عبر جمع p_i,2j = sin(i/10000^(2j/d)) و p_i,2j+1 = cos(...) بمعلومات مطلقة ونسبية.', en: 'Self-attention and positional encoding (goal of s6): every token matches everyone (O(n\u00b2d), path O(1), full parallelism), and order returns via adding p_i,2j = sin(i/10000^(2j/d)) and p_i,2j+1 = cos(...) with absolute and relative information.' },
      ],
      reflectPrompt: {
        ar: 'لديك جملة من 2000 رمز: أي مكوّن من هذا الدرس يزدحم أولًا — عنق زجاجة h_T أم التربيعية n\u00b2؟ وكيف يعالج كلٌّ من Bahdanau والترميز الموضعي جانبًا من المعضلة؟',
        en: 'With a 2000-token sentence: which component clogs first \u2014 the h_T bottleneck or the n\u00b2 term? And how do Bahdanau attention and positional encoding each address one side of that dilemma?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch11.s4' },
        { book: 'D2L', section: 'd2l.ch11.s5' },
        { book: 'D2L', section: 'd2l.ch11.s6' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch11.s4' },
    { book: 'D2L', section: 'd2l.ch11.s5' },
    { book: 'D2L', section: 'd2l.ch11.s6' },
  ],
} satisfies Lesson;

export default lesson;
