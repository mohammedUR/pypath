import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch15.l3 — "Word Similarity, Analogy, and the Birth of BERT"
 * تشابه الكلمات والتناظر وميلاد BERT
 * Aligned with D2L ch15 s7 (Word Similarity and Analogy) + s8 (BERT). All
 * expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: cosine similarity + nearest
 * neighbours + a king−man+woman analogy over FIXED 2-D vectors, and BERT input
 * embedding dims math (token + segment + position) with one summed example.
 * Every literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch15.l3',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 15,
  title: {
    ar: 'تشابه الكلمات والتناظر وميلاد BERT',
    en: 'Word Similarity, Analogy, and the Birth of BERT',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch15.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'درّبت متجهاتك — فماذا تقول لنا؟ السؤال العملي الأول: ما أقرب الكلمات إلى «bank»؟ والسؤال الأذكى: هل يجيد الفضاء الحساب؟ king − man + woman يفترض أن يقترب من queen. لكن ثمة سقف: word2vec وGloVe يعطيان «bank» المتجه نفسه في «go to the bank to deposit money» و«go to the bank to sit down». هنا يبدأ BERT: مُرمِّز Transformer ثنائي الاتجاه يقرأ السياق من الجهتين، ويُضبط دقيقا لمعظم المهام بتغييرات معمارية زهيدة.',
        en: 'You trained your vectors — now what do they say? The first practical question: which words are nearest to "bank"? The sharper one: does the space do arithmetic? king − man + woman is supposed to land near queen. But there is a ceiling: word2vec and GloVe hand "bank" the same vector in "go to the bank to deposit money" and "go to the bank to sit down". Enter BERT: a bidirectional Transformer encoder that reads context from both sides and fine-tunes to most tasks with minimal architecture changes.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'قياس ما تعلمه، ثم متجهات تحس السياق', en: 'Measuring what was learned, then context-aware vectors' },
      chunks: [
        {
          ar: 'المقياس القياسي للتشابه بين متجهين x وy هو تشابه الجيب: x·y/(‖x‖‖y‖) ويقع في [−1, 1]. على متجهات مُدرَّبة مسبقا (GloVe بأبعاد 50/100/300 أو fastText) نبني بحث k الأقرب: نرتب الكلمات بتنازلي التشابه مع كلمة الاستعلام ونطبع الأعلى. المهمة الثانية تناظر الكلمات: أكمل «a بالنسبة إلى b كأن c بالنسبة إلى ؟» بحساب المتجه vec(a) − vec(b) + vec(c) ثم إيجاد أقرب كلمة إليه (باستثناء كلمات السؤال نفسه). النجاح هنا اختبار مباشر لقدرة الفضاء على ترميز العلاقات الدلالية، وهو ما يجعل هذه المهام أداة تقييم سريعة قبل أي مهمة لاحقة.',
          en: 'The standard gauge between two vectors x and y is cosine similarity: x·y/(‖x‖‖y‖), lying in [−1, 1]. On pretrained vectors (GloVe at 50/100/300 dims or fastText) we build a k-nearest lookup: rank words by descending similarity to a query and print the top ones. The second task is word analogy: complete "a is to b as c is to ?" by computing vec(a) − vec(b) + vec(c) and finding the nearest word to it (excluding the question words themselves). Success is a direct test of whether the space encodes semantic relations, which makes these tasks a quick evaluation before any downstream job.',
        },
        {
          ar: 'القيد: كل ما سبق تمثيل مستقل عن السياق — دالة f(x) تعتمد على الرمز وحده، فكلمة «crane» (كائن أم آلة؟) تحمل متجهًا واحدًا. الحل الوسيط كان ELMo: تمثيل حساس للسياق من LSTM ثنائي الاتجاه مُدرَّب مسبقا، لكنه يُضاف كمعالم إضافية لنموذج مخصص لكل مهمة. GPT قلب المعادلة: نموذج عام يُضبط لكل المهام، لكنه يقرأ من اليسار فقط فلا يرى إلا نصف السياق. BERT (من Transformer encoder) جمع الاثنين: سياق ثنائي الاتجاه + ضبط دقيق لمهمة عامة واحدة، مع طبقة إخراج صغيرة تُدرَّب من الصفر لكل مهمة.',
          en: 'The ceiling: everything above is context-independent — a function f(x) of the token alone, so "crane" (bird or machine?) carries one vector. The middle step was ELMo: a context-sensitive representation from a pretrained bidirectional LSTM, but added as extra features to a model customized per task. GPT flipped it: one general model fine-tuned to every task, yet reading only left-to-right and so seeing half the context. BERT (a Transformer encoder) combined the two: bidirectional context plus task-agnostic fine-tuning, with a small output layer trained from scratch per task.',
        },
        {
          ar: 'تمثيل مدخل BERT يجمع ثلاث إشعارات: تسلسل المدخل يبدأ بـ <cls> وتنتهي كل جملة بـ <sep>؛ للنص المزدوج: <cls> + sentence_a + <sep> + sentence_b + <sep>. المتجه النهائي لكل موضع = تضمين الرمز + تضمين القطعة (e_A أو e_B لتمييز الجملتين) + تضمين الموضع. الأبعاد تُحسب مباشرة: مفردات V وبعد d وطول أقصى L تعني مصفوفات (V, d) و(2, d) و(L, d) — بV=10 وd=4 وL=16 يكون الإجمالي 40+8+64=112 معاملا فقط لطبقات المدخل، وهي التي تُجمع جمعا عنصريا قبل أن يدخل الترميز.',
          en: "BERT's input representation adds three signals: the input sequence starts with <cls> and every sentence ends with <sep>; for a text pair: <cls> + sentence_a + <sep> + sentence_b + <sep>. Each position's final vector = token embedding + segment embedding (e_A or e_B to tell the two sentences apart) + position embedding. The dimensions are direct math: vocabulary V, dim d, max length L give matrices (V, d), (2, d), (L, d) — with V=10, d=4, L=16 that is 40+8+64=112 parameters for the input layers, summed element-wise before the encoder sees them.",
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'تشابه وجيران وتناظر على متجهات ثابتة + أبعاد مدخل BERT',
        en: 'Similarity, neighbours, analogy on fixed vectors + BERT input dims',
      },
      code: "import math\n\ndef dot(a, b):\n    return sum(x * y for x, y in zip(a, b))\n\ndef cosine(a, b):\n    na, nb = math.sqrt(dot(a, a)), math.sqrt(dot(b, b))\n    if na == 0 or nb == 0:\n        return 0.0\n    return dot(a, b) / (na * nb)\n\nvecs = {'bank': [0.9, 0.1], 'money': [0.8, 0.3], 'river': [0.4, 0.9],\n        'shore': [0.3, 0.8], 'loan': [0.7, 0.3], 'tree': [0.2, 0.7],\n        'cat': [0.1, 0.2], 'dog': [0.15, 0.15]}\nfor w in vecs:\n    if w != 'bank':\n        print('cos(bank,%s) = %.9f' % (w, cosine(vecs['bank'], vecs[w])))\nsims = sorted(((cosine(vecs['bank'], v), w)\n               for w, v in vecs.items() if w != 'bank'), reverse=True)\nprint('top-3 for bank:', [w for s, w in sims[:3]])\n\n# analogy: king - man + woman = ?\nman, woman = [0.85, 0.15], [0.80, 0.85]\nking, queen = [0.95, 0.20], [0.90, 0.90]\nvec = [king[0] - man[0] + woman[0], king[1] - man[1] + woman[1]]\nprint('king - man + woman =', vec)\nallw = {'man': man, 'woman': woman, 'king': king, 'queen': queen}\nbest = max(((cosine(vec, v), w) for w, v in allw.items()\n            if w not in ('man', 'woman', 'king')))\nprint('nearest to the analogy vector:', best[1], 'cos=%.9f' % best[0])\n\n# BERT input embedding dims: token + segment + position\nV, d, L = 10, 4, 16\nprint('token %dx%d=%d + segment 2x%d=%d + position %dx%d=%d = %d params'\n      % (V, d, V * d, d, 2 * d, L, d, L * d, V * d + 2 * d + L * d))\ntok_e = [0.1, 0.2, -0.1, 0.0]\nseg_e = [0.05, -0.05, 0.1, 0.2]\npos_e = [0.0, 0.01, 0.02, -0.01]\nprint('input vec =', [round(a + b + c, 4) for a, b, c in zip(tok_e, seg_e, pos_e)])",
      explanation: {
        ar: 'في الفضاء ثنائي البعد الثابت أعلى قيمة تشابه مع «bank» هي money = 0.969377437 ثم loan = 0.957024404 فdog = 0.780868809 — فالجيران الثلاثة يلتقطون نكهة «المال» وليس «النهر» (river = 0.504568019). التناظر يعمل مثاليا هنا: king − man + woman = [0.9, 0.9] يطابق queen بالضبط والتشابه 1.000000000. أبعاد مدخل BERT للدمية: 40 (رمز) + 8 (قطعتان) + 64 (موضع) = 112 معاملا، والجمع العنصري يرى متجه مدخل [0.15, 0.16, 0.02, 0.19] من المكونات الثلاثة — هذا هو المتجه الذي يتلقاه الترميز لكل موضع.',
        en: 'In the fixed 2-D space the top similarity to "bank" is money = 0.969377437, then loan = 0.957024404, then dog = 0.780868809 — the three neighbours catch the "money" flavour, not the "river" one (river = 0.504568019). The analogy works perfectly here: king − man + woman = [0.9, 0.9] matches queen exactly with cosine 1.000000000. The toy BERT input dims: 40 (token) + 8 (two segments) + 64 (position) = 112 parameters, and the element-wise sum produces the input vector [0.15, 0.16, 0.02, 0.19] from the three components — this is the vector the encoder consumes at each position.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.cosine-knn',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفذ دالتين: cosine(a, b) تعيد تشابه الجيب بين قائمتين (أعد 0.0 إذا كان أي متجه صفريا)، وmost_similar(word, table) تعيد اسم الكلمة الأقرب إلى word في قاموس table (باستثناء الكلمة نفسها) وفق cosine. اختبرهما على جدول vecs من المثال المطبق.',
        en: 'Implement two functions: cosine(a, b) returning the cosine similarity of two lists (return 0.0 if either vector is zero), and most_similar(word, table) returning the name of the word nearest to word in dict table (excluding the word itself) by cosine. Test both on the vecs table from the worked example.',
      },
      starterCode: "import math\n\ndef cosine(a, b):\n    # TODO: dot / (norm * norm), guard zero norms\n    ...\n\ndef most_similar(word, table):\n    # TODO: highest cosine among table items excluding `word`\n    ...\n",
      solution: "import math\n\ndef cosine(a, b):\n    na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n    if na == 0 or nb == 0:\n        return 0.0\n    return sum(x * y for x, y in zip(a, b)) / (na * nb)\n\ndef most_similar(word, table):\n    best, top = None, -2.0\n    for w, v in table.items():\n        if w == word:\n            continue\n        s = cosine(table[word], v)\n        if s > top:\n            best, top = w, s\n    return best",
      tests: [
        {
          id: 't1',
          name: { ar: 'تشابه عمودين متعامدين صفر، ومتجهين متطابقين واحد', en: 'Orthogonal vectors score 0, identical vectors score 1' },
          code: "assert abs(cosine([1, 0], [0, 1])) < 1e-12, 'orthogonal must be 0 | got %r' % cosine([1, 0], [0, 1])\nassert abs(cosine([2, 0], [1, 0]) - 1.0) < 1e-12, 'same direction must be 1 | got %r' % cosine([2, 0], [1, 0])",
          expected: '0.0 and 1.0',
        },
        {
          id: 't2',
          name: { ar: 'الحماية من المتجه الصفري', en: 'Guard against the zero vector' },
          code: "assert cosine([0, 0], [1, 2]) == 0.0, 'zero vector must return 0.0 | got %r' % cosine([0, 0], [1, 2])",
          expected: '0.0',
        },
        {
          id: 't3',
          name: { ar: 'أقرب جار لـ bank هو money، ولـ money هو loan', en: 'The nearest neighbour of bank is money; of money it is loan' },
          code: "vecs = {'bank': [0.9, 0.1], 'money': [0.8, 0.3], 'river': [0.4, 0.9],\n        'shore': [0.3, 0.8], 'loan': [0.7, 0.3], 'tree': [0.2, 0.7],\n        'cat': [0.1, 0.2], 'dog': [0.15, 0.15]}\nassert most_similar('bank', vecs) == 'money', 'expected money | got %r' % most_similar('bank', vecs)\nassert most_similar('money', vecs) == 'loan', 'expected loan | got %r' % most_similar('money', vecs)",
          expected: "'money' and 'bank'",
        },
      ],
      hints: [
        { ar: 'الجذر التربيعي للمجموع التربيعي هو المعيار: math.sqrt(sum(x*x for x in v)) — ثم احمِ حالة المقام الصفري.', en: 'The norm is the square root of the squared sum: math.sqrt(sum(x*x for x in v)) — then guard the zero-denominator case.' },
        { ar: 'في most_similar ابدأ من top = -2.0 (أقل من أدنى تشابه ممكن) وتجاوز الكلمة المستعلم عنها داخل الحلقة.', en: 'In most_similar start from top = -2.0 (below the smallest possible similarity) and skip the query word inside the loop.' },
        { ar: 'قارن بـ > فقط فيكفي: الترتيب بين المتساوين لا يهم لأن الاختبارات لها إجابة وحيدة.', en: 'A strict > comparison suffices: ties do not matter because the tests have a unique answer.' },
        { ar: 'قيم تحقق: cos(bank,money) ≈ 0.969377 أكبر من cos(bank,loan) ≈ 0.957024 — لذلك money هو الجار الأول وليس loan.', en: 'Sanity values: cos(bank,money) ≈ 0.969377 beats cos(bank,loan) ≈ 0.957024 — so money is the top neighbour, not loan.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-bert-positioning',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي عبارة تصف موقع BERT بين ELMo وGPT بدقة؟',
        en: 'Which statement positions BERT between ELMo and GPT correctly?',
      },
      options: [
        { id: 'a', text: { ar: 'ELMo ثنائي الاتجاه لكنه يُضاف كمعالم لنماذج مخصصة لكل مهمة؛ GPT عام يُضبط لكنه يقرأ من اليسار فقط؛ BERT يجمع: ترميز ثنائي الاتجاه + ضبط دقيق عام', en: 'ELMo is bidirectional but added as features to task-specific models; GPT is general and fine-tuned but reads left-to-right only; BERT combines bidirectional encoding with general fine-tuning' } },
        { id: 'b', text: { ar: 'BERT أول نموذج يستخدم LSTM ثنائي الاتجاه مسبق التدريب', en: 'BERT is the first model to use a pretrained bidirectional LSTM' } },
        { id: 'c', text: { ar: 'BERT يجمّد كل معاملاته ويُدرِّب طبقة الإخراج فقط لكل مهمة', en: 'BERT freezes all its parameters and only trains the output layer per task' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكر المفاضلة: حساسية السياق (اتجاهان) ضد عمومية المهمة (ضبط دقيق واحد لنماذج كثيرة).', en: 'Recall the trade-off: context sensitivity (both directions) versus task-agnosticism (one fine-tuning recipe for many tasks).' },
        { ar: 'GPT مبني على Transformer decoder توديعي الاتجاه؛ BERT على encoder الذي يرى الرمز الأيسر والأيمن معا.', en: 'GPT is built on an autoregressive Transformer decoder; BERT on an encoder that sees both left and right tokens.' },
        { ar: 'أثناء الضبط الدقيق تُعدَّل كل معاملات BERT بينما تُدرَّب طبقة الإخراج الإضافية من الصفر — لا العكس.', en: 'During fine-tuning all BERT parameters are updated while the extra output layer is trained from scratch — not the other way around.' },
        { ar: 'الجواب: a — وهي فكرة «أفضل ما في العالمين» التي ذاع بها BERT.', en: 'Answer: a — the "best of both worlds" idea that made BERT famous.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef cosine(a, b):\n    na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n    if na == 0 or nb == 0:\n        return 0.0\n    return sum(x * y for x, y in zip(a, b)) / (na * nb)\n\nspace = {'man': [0.85, 0.15], 'woman': [0.80, 0.85],\n         'king': [0.95, 0.20], 'queen': [0.90, 0.90],\n         'prince': [0.90, 0.45], 'princess': [0.85, 0.95]}\n\ndef complete(a, b, c, table):\n    v = [table[a][0] - table[b][0] + table[c][0],\n         table[a][1] - table[b][1] + table[c][1]]\n    ranked = sorted(((cosine(v, w), t) for t, w in table.items()\n                     if t not in (a, b, c)), reverse=True)\n    print('%s - %s + %s = %s' % (a, b, c, [round(x, 3) for x in v]))\n    return ranked[0][1]\n\nprint('a is to b as c is to:', complete('king', 'man', 'woman', space))\nprint('a is to b as c is to:', complete('queen', 'woman', 'man', space))\nprint('a is to b as c is to:', complete('prince', 'man', 'woman', space))\n\n# try: add a word 'crown' at [0.92, 0.5] - does it hijack the prince analogy?\n# try: shrink the gender gap (make man/woman closer) - where does the analogy break first?\n",
      prompt: {
        ar: 'الملعب يبني فضاء أوسع فيه prince وprincess ويجري ثلاثة تناظرات. لاحظ أن king−man+woman وprince−man+woman يهبطان على queen وprincess بالترتيب، بينما العكس queen−woman+man يعيد king — الفضاء يدعم العلاقة في الاتجاهين طالما بقيت فجوة «النوع» واضحة. جرّب ضغط الفجوة وراقب أول انكسار.',
        en: 'The sandbox builds a wider space with prince and princess and runs three analogies. Note that king−man+woman and prince−man+woman land on queen and princess respectively, while the reverse queen−woman+man returns king — the space supports the relation in both directions as long as the "gender" gap stays clear. Shrink the gap and watch the first breakage.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'كيف تُكمل مهمة التناظر «a بالنسبة إلى b كـ c بالنسبة إلى ؟» في فضاء المتجهات؟',
            en: 'How does the analogy task "a is to b as c is to ?" get completed in vector space?',
          },
          options: [
            { id: 'a', text: { ar: 'نحسب vec(a) − vec(b) + vec(c) ونبحث عن أقرب كلمة إليه مع استثناء كلمات السؤال', en: 'Compute vec(a) − vec(b) + vec(c) and search for the nearest word excluding the question words' } },
            { id: 'b', text: { ar: 'نحسب متوسط المتجهات الثلاثة ونختار عشوائيا من الجيران', en: 'We average the three vectors and pick a neighbour arbitrarily' } },
            { id: 'c', text: { ar: 'نضرب المتجهات عنصريا ونأخذ أكبر مركبة', en: 'We multiply the vectors element-wise and take the largest component' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'العلاقة تُشفَّر كاتجاه في الفضاء: vec(a)−vec(b) هو متجه العلاقة، وإضافته إلى vec(c) تعطي نقطة تبدأ منها البحث بتشابه الجيب. في مثالنا king−man+woman = [0.9, 0.9] سقط بالضبط على queen.',
            en: 'The relation is encoded as a direction: vec(a)−vec(b) is the relation vector, and adding it to vec(c) yields the point from which the cosine-nearest search starts. In our example king−man+woman = [0.9, 0.9] landed exactly on queen.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما المكوّنات الثلاثة التي تُجمع لتكوين متجه المدخل لكل موضع في BERT؟',
            en: 'Which three components are summed to form each BERT input position vector?',
          },
          options: [
            { id: 'a', text: { ar: 'تضمين الرمز + تضمين القطعة (e_A/e_B) + تضمين الموضع', en: 'Token embedding + segment embedding (e_A/e_B) + position embedding' } },
            { id: 'b', text: { ar: 'تضمين الرمز + تضمين الجار الأيسر + تضمين الجار الأيمن', en: 'Token embedding + left-neighbour embedding + right-neighbour embedding' } },
            { id: 'c', text: { ar: 'متجه one-hot + متجه الموضع فقط', en: 'A one-hot vector + a position vector only' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المدخل يجمع ثلاث مصفوفات: الرموز (V, d)، والقطع (2, d) لتمييز الجملتين، والمواضع (L, d). بV=10 وd=4 وL=16 يكون الحصاد 40+8+64=112 معاملا تُجمع عنصريا قبل الترميز.',
            en: 'The input sums three matrices: tokens (V, d), segments (2, d) to separate the two sentences, and positions (L, d). With V=10, d=4, L=16 that totals 40+8+64=112 parameters, added element-wise before encoding.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا لا يكفي تمثيل مستقل عن السياق لكلمة مثل «crane»؟',
            en: 'Why is a context-independent representation not enough for a word like "crane"?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الكلمة متعددة المعاني تحمل متجهًا واحدًا في «a crane is flying» و«a crane driver came» رغم اختلاف المعنى تماما', en: 'A polysemous word carries one vector in "a crane is flying" and "a crane driver came" although the meanings differ completely' } },
            { id: 'b', text: { ar: 'لأنها كلمة نادرة لا يظهر تكرارها في العدّاد', en: 'Because it is a rare word that never shows up in the counter' } },
            { id: 'c', text: { ar: 'لأن بعد d صغير فلا يسع أكثر من معنى واحد', en: 'Because the dim d is too small to hold more than one meaning' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التمثيل المستقل عن السياق دالة f(x) من الرمز وحده، فتعدد المعاني يُسحق في متجه واحد. BERT يجعل التمثيل f(x, c(x)) يعتمد على السياق ثنائي الاتجاه — وهذا هو جوهر «الحساسية للسياق».',
            en: 'A context-independent representation is a function f(x) of the token alone, so polysemy collapses into one vector. BERT makes the representation f(x, c(x)) depend on the bidirectional context — the essence of "context sensitivity".',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'تشابه الجيب x·y/(‖x‖‖y‖) يقيس التقارب، وبه نطبع جيران كلمة والتناظر: vec(a)−vec(b)+vec(c) ثم أقرب جار — في مثالنا bank يلتقط money/loan/dog وking−man+woman يسقط على queen تماما (الهدف من s7).', en: 'Cosine similarity x·y/(‖x‖‖y‖) measures closeness; with it we rank a word’s neighbours and solve analogies: vec(a)−vec(b)+vec(c) then nearest — in our example bank catches money/loan/dog and king−man+woman lands exactly on queen (goal of s7).' },
        { ar: 'التمثيلات المستقلة عن السياق سقفها تعدد المعاني؛ ELMo حساس للسياق لكنه خاص بالمهام، وGPT عام لكنه أحادي الاتجاه، وBERT يجمع الترميز الثنائي الاتجاه مع الضبط الدقيق العام (الهدف من s8).', en: 'Context-independent representations cap out at polysemy; ELMo is context-sensitive but task-specific, GPT is task-agnostic but left-to-right, and BERT combines bidirectional encoding with task-agnostic fine-tuning (goal of s8).' },
        { ar: 'مدخل BERT: <cls> ثم الجملة ثم <sep> (وللزوج <cls>+a+<sep>+b+<sep>)، ومتجه كل موضع = رمز + قطعة + موضع: مصفوفات (V,d) و(2,d) و(L,d) بدمية 10/4/16 تساوي 112 معاملا (الهدف من s8).', en: 'BERT input: <cls> then the sentence then <sep> (pairs: <cls>+a+<sep>+b+<sep>), and each position vector = token + segment + position: matrices (V,d), (2,d), (L,d) totaling 112 parameters for the 10/4/16 toy (goal of s8).' },
      ],
      reflectPrompt: {
        ar: 'لو طُلب منك تقييم متجهات مُدرَّبة مسبقا قبل استخدامها في مهمة فعلية: أي اختبارين ستشغلين أولا — جيران كلمة متعددة المعاني أم تناظر شائع — ولماذا لا يكفي أحيانا أن يسقط king−man+woman على queen في فضاء صغير؟',
        en: 'If asked to evaluate pretrained vectors before using them in a real task: which two probes would you run first — neighbours of a polysemous word or a common analogy — and why can a king−man+woman landing on queen in a tiny space still not suffice?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch15.s7' },
        { book: 'D2L', section: 'd2l.ch15.s8' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch15.s7' },
    { book: 'D2L', section: 'd2l.ch15.s8' },
  ],
} satisfies Lesson;

export default lesson;
