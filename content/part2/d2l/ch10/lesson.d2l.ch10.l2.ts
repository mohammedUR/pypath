import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch10.l2 — "Deep RNNs and Bidirectional RNNs"
 * الشبكات المتكررة العميقة والثنائية الاتجاه
 * Aligned with D2L ch10 s3 (Deep Recurrent Neural Networks) + s4
 * (Bidirectional Recurrent Neural Networks). All expression is original —
 * a paraphrase of the source's ideas, never a verbatim translation.
 * Runnable design: a stacked two-layer scalar RNN and a forward/backward
 * pairing over a fixed sequence; every literal verified under CPython 3.
 * Deterministic only.
 */
const lesson = {
  id: 'd2l.ch10.l2',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 10,
  title: {
    ar: 'الشبكات المتكررة العميقة والثنائية الاتجاه',
    en: 'Deep RNNs and Bidirectional RNNs',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch10.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الشبكة المتكررة عميقة بالفعل في اتجاه الزمن: خطوة أولى تمر عبر T طبقات متكررة قبل أن تؤثر في النهاية. لكن ماذا عن العمق في اتجاه المدخل-إلى-المخرج الذي منح MLP وCNN قوتها؟ وهل يجب أن يكون التنبؤ أعمى لما سيأتي؟ هذا الدرس يكدّس الطبقات المتكررة فوق بعضها، ثم يضاعف الرؤية بطبقة ثانية تقرأ المتتالية من النهاية إلى البداية.',
        en: 'A recurrent network is already deep in time: a first step travels through T recurrent applications before it can influence the end. But what about the input-to-output depth that gave MLPs and CNNs their power? And should a prediction really be blind to what comes next? This lesson stacks recurrent layers on top of each other, then doubles the vision with a second layer reading the sequence back to front.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التكديس في العمق، والقراءة في الاتجاهين', en: 'Stacking in depth, reading in both directions' },
      chunks: [
        {
          ar: 'الشبكة المتكررة العميقة تكدّس L طبقات متكررة: مخارج الطبقة l عند كل خطوة تصبح مدخلات الطبقة l+1 عند الخطوة نفسها، بجانب حالة الطبقة l+1 من الخطوة السابقة — أي أن لكل وحدة جارين: جار زماني في طبقتها وجار عمودي في خطوتها. المعادلة: H_t^(l) = φ_l(H_t^(l−1)·W_xh^(l) + H_{t-1}^(l)·W_hh^(l) + b_h^(l)) بشرط H_t^(0) = X_t، وطبقة الإخراج تقرأ الطبقة الأخيرة فقط: O_t = H_t^(L)·W_hq + b_q. الأبعاد الشائعة: عمق L بين 1 و8 وعرض h بين 64 و2056، ويمكن استبدال أي خلية بـ LSTM أو GRU فنحصل على نسخة عميقة مبوَّبة. تحذير الكتاب: التهيئة تحتاج عناية والتقارب يتطلب ضبط معدل التعلم والقصّ أكثر من الشبكة أحادية الطبقة.',
          en: 'A deep RNN stacks L recurrent layers: the outputs of layer l at every step become the inputs of layer l+1 at the same step, alongside layer l+1\u2019s own state from the previous step \u2014 each unit has two neighbors: a temporal one in its layer and a vertical one at its step. The equation: H_t^(l) = \u03c6_l(H_t^(l\u22121)\u00b7W_xh^(l) + H_{t-1}^(l)\u00b7W_hh^(l) + b_h^(l)) with H_t^(0) = X_t, and the output layer reads only the last one: O_t = H_t^(L)\u00b7W_hq + b_q. Common sizes: depth L in (1, 8) and width h in (64, 2056), and any cell can be swapped for an LSTM or GRU to get a gated deep variant. The book\u2019s caution: initialization needs care and convergence demands more learning-rate and clipping tuning than a single-layer network.',
        },
        {
          ar: 'الشبكة الثنائية الاتجاه BiRNN تشغّل طبقتين متكررتين على المدخلات نفسها في اتجاهين متعاكسين: طبقة أمامية من x_1 إلى x_T وأخرى خلفية من x_T إلى x_1، ثم يُدمج مخرجا كل خطوة ببعضهما فتكون H_t ∈ R^(n×2h) — أبعاد الحالة تتضاعف، وطبقة الإخراج تقرأ الدمج: O_t = H_t·W_hq + b_q مع W_hq ∈ R^(2h×q). هذا منطقي تمامًا عندما يكون السياق كاملًا متاحًا: وسم أجزاء الكلام، أو ملء الفراغ الذي يتغير معناه حسب ما بعده («I am ___» مقابل «I am ___ hungry» مقابل «I am ___ hungry, and I can eat half a pig»). لكنه مستحيل في التوليد التلقائي: عند التنبؤ بالرمز القادم لا يوجد «ما بعده» بعد. ولهذا تستعمل BiRNN أساسًا للترميز لا للتوليد، وتكلفتها التدريبية أعلى بسبب سلاسل التدرج المضاعفة.',
          en: 'A bidirectional RNN runs two recurrent layers over the same inputs in opposite directions: a forward layer from x_1 to x_T and a backward layer from x_T to x_1, then the two outputs of each step are concatenated, giving H_t \u2208 R^(n\u00d72h) \u2014 the state dimension doubles, and the output layer reads the concatenation: O_t = H_t\u00b7W_hq + b_q with W_hq \u2208 R^(2h\u00d7q). This makes complete sense when the full context is available: part-of-speech tagging, or filling a blank whose meaning changes with what follows ("I am ___" vs "I am ___ hungry" vs "I am ___ hungry, and I can eat half a pig"). But it is impossible for autoregressive generation: when predicting the next token there is no "after" yet. Hence BiRNNs are mainly encoders, not generators, and training costs more because the gradient chains double.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'طبقتان مكدستان + قراءة أمامية وخلفية لمتتالية واحدة',
        en: 'Two stacked layers + forward and backward reads of one sequence',
      },
      code: "import math\n\ndef rnn_layer(xs, w_x, w_h):\n    h = 0.0\n    out = []\n    for x in xs:\n        h = math.tanh(w_x * x + w_h * h)\n        out.append(h)\n    return out\n\nxs = [1.0, 0.5, -1.0]\nlayer1 = rnn_layer(xs, 1.0, 0.5)\nlayer2 = rnn_layer(layer1, 0.8, 0.3)\nprint('layer 1:', [round(v, 4) for v in layer1])\nprint('layer 2:', [round(v, 4) for v in layer2])\n\n# bidirectional: a second layer reads the same sequence in reverse\nfwd = rnn_layer(xs, 1.0, 0.5)\nbwd = rnn_layer(xs[::-1], -0.5, 0.2)[::-1]\nprint('forward :', [round(v, 4) for v in fwd])\nprint('backward:', [round(v, 4) for v in bwd])\nprint('pairs   :', [(round(f, 4), round(b, 4)) for f, b in zip(fwd, bwd)])",
      explanation: {
        ar: 'الطبقة الأولى تمضي [0.7616, 0.7068, −0.5694] على المدخلات [1.0, 0.5, −1.0]، ثم تتغذى هذه المخارج كمدخلات للطبقة الثانية فتعطي [0.5436, 0.6222, −0.2625] — لاحظ أن المدخل السالب −1.0 وصل الطبقة الثانية كـ −0.5694 وليس كقيمته الخام: العمق يعيد تمثيل كل شيء. أما الاتجاهان: الأمامي [0.7616, 0.7068, −0.5694] والخلفي (بقراءة المتتالية معكوسة بأوزان −0.5/0.2 ثم عكس النتيجة) [−0.4863, −0.1563, 0.4621] — والأزواج المدموجة [(0.7616, −0.4863), (0.7068, −0.1563), (−0.5694, 0.4621)] هي ما يقرؤه طبقة الإخراج: لكل خطوة رؤية الماضي والمستقبل معًا، وضِعف أبعاد الحالة.',
        en: 'Layer one runs [0.7616, 0.7068, \u22120.5694] over inputs [1.0, 0.5, \u22121.0], and those outputs feed layer two, giving [0.5436, 0.6222, \u22120.2625] \u2014 note that the raw input \u22121.0 reached layer two as \u22120.5694: depth re-represents everything. For the directions: forward [0.7616, 0.7068, \u22120.5694] and backward (reading the reversed sequence with weights \u22120.5/0.2, then reversing the result) [\u22120.4863, \u22120.1563, 0.4621] \u2014 the merged pairs [(0.7616, \u22120.4863), (0.7068, \u22120.1563), (\u22120.5694, 0.4621)] are what the output layer reads: for every step, past and future together, at twice the state dimension.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.bidir-pair',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ bidir(xs, wf, hf, wb, hb) التي تشغّل طبقة أمامية بأوزان (wf, hf) على xs وطبقة خلفية بأوزان (wb, hb) على المتتالية المعكوسة، ثم تعيد قائمة أزواج (f_t, b_t) — حيث الحالة الخلفية للخطوة t هي الحالة التي حسبتها الطبقة الخلفية عندما قرأت من النهاية.',
        en: 'Implement bidir(xs, wf, hf, wb, hb) running a forward layer with weights (wf, hf) over xs and a backward layer with weights (wb, hb) over the reversed sequence, then returning a list of pairs (f_t, b_t) \u2014 where the backward state for step t is the one the backward layer computed while reading from the end.',
      },
      starterCode: "import math\n\ndef rnn_layer(xs, w_x, w_h):\n    h = 0.0\n    out = []\n    for x in xs:\n        h = math.tanh(w_x * x + w_h * h)\n        out.append(h)\n    return out\n\ndef bidir(xs, wf, hf, wb, hb):\n    ...  # TODO: forward run + backward run over the reversed input, then pair\n    return pairs\n",
      solution: "import math\n\ndef rnn_layer(xs, w_x, w_h):\n    h = 0.0\n    out = []\n    for x in xs:\n        h = math.tanh(w_x * x + w_h * h)\n        out.append(h)\n    return out\n\ndef bidir(xs, wf, hf, wb, hb):\n    fwd_states = rnn_layer(xs, wf, hf)\n    bwd_states = rnn_layer(xs[::-1], wb, hb)[::-1]\n    return list(zip(fwd_states, bwd_states))",
      tests: [
        {
          id: 't1',
          name: { ar: 'طول المخرج يساوي طول المتتالية', en: 'Output length equals sequence length' },
          code: "res = bidir([1.0, 0.5, -1.0], 1.0, 0.5, -0.5, 0.2)\nassert len(res) == 3, 'expected 3 pairs | actual: %r' % res",
          expected: '3 pairs',
        },
        {
          id: 't2',
          name: { ar: 'عنصر واحد يعطي (tanh(x), tanh(wb·x))', en: 'A single element yields (tanh(x), tanh(wb\u00b7x))' },
          code: "import math\nres = bidir([1.0], 1.0, 0.5, -0.5, 0.2)\nassert abs(res[0][0] - math.tanh(1.0)) < 1e-12 and abs(res[0][1] - math.tanh(-0.5)) < 1e-12, 'expected (tanh(1.0), tanh(-0.5)) | actual: %r' % res",
          expected: '(tanh(1.0), tanh(-0.5))',
        },
        {
          id: 't3',
          name: { ar: 'الحالة الخلفية للأول هي آخر حالة في الجري المعكوس', en: 'The first backward state is the last of the reversed run' },
          code: "res = bidir([1.0, 0.5, -1.0], 1.0, 0.5, -0.5, 0.2)\nref = rnn_layer([1.0, 0.5, -1.0][::-1], -0.5, 0.2)[-1]\nassert abs(res[0][1] - ref) < 1e-12, 'backward at position 0 must come from the end | actual: %r' % (res[0][1],)",
          expected: 'res[0][1] == ref',
        },
      ],
      hints: [
        { ar: 'الجري الخلفي: rnn_layer(xs[::-1], wb, hb) — ثم اعكس النتيجة بـ [::-1] لتصير محاذاة للخطوات الأمامية.', en: 'The backward run: rnn_layer(xs[::-1], wb, hb) \u2014 then flip with [::-1] so it aligns with the forward steps.' },
        { ar: 'الدمج ببساطة zip: list(zip(fwd_states, bwd_states)) يعطي الأزواج بترتيب الخطوات.', en: 'Merging is just zip: list(zip(fwd_states, bwd_states)) yields the pairs in step order.' },
        { ar: 'افحص حدًّا واحدًا: على [1.0] يكون الناتج (tanh(1.0), tanh(\u22120.5)) مباشرة.', en: 'Check a single boundary: on [1.0] the result is (tanh(1.0), tanh(\u22120.5)) directly.' },
        { ar: 'المحاذاة هي الفخ الشائع: بدون العكس النهائي ستربط حالة البداية بالخطوة الأولى بدل الأخيرة.', en: 'Alignment is the common trap: without the final reversal you would pair the start state with step one instead of the last.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-when-bidir',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي المهام التالية لا يصح فيها استعمال شبكة متكررة ثنائية الاتجاه في وقت الاستدلال؟',
        en: 'For which of these tasks is a bidirectional RNN inappropriate at inference time?',
      },
      options: [
        { id: 'a', text: { ar: 'وسم أجزاء الكلام لكلمة في جملة مكتملة', en: 'Part-of-speech tagging for a word in a complete sentence' } },
        { id: 'b', text: { ar: 'توليد النص التلقائي: التنبؤ بالرمز القادم واحدًا تلو الآخر', en: 'Autoregressive text generation: predicting the next token one at a time' } },
        { id: 'c', text: { ar: 'ملء رمز محجوب في جملة موجودة بالكامل', en: 'Filling a masked token in a fully available sentence' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'السؤال الجوهري: هل «المستقبل» موجود فعلًا في اللحظة التي يتنبأ فيها النموذج؟', en: 'The key question: does the "future" actually exist at the moment the model predicts?' },
        { ar: 'في الوسم وملء المحجوب تُقرأ الجملة كاملة أولًا — الطبقة الخلفية قانونية.', en: 'In tagging and masked filling the whole sentence is read first \u2014 the backward layer is legitimate.' },
        { ar: 'في التوليد لا يوجد بعد رموز قادمة عند كل خطوة، والطبقة الخلفية سترى شيئًا غير موجود بعد.', en: 'In generation no future tokens exist at each step, so a backward layer would peek at something not yet written.' },
        { ar: 'الجواب: b — لهذا تُستعمل BiRNN للترميز لا للتوليد.', en: 'Answer: b \u2014 that is why BiRNNs are used for encoding, not generation.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef rnn_layer(xs, w_x, w_h):\n    h = 0.0\n    out = []\n    for x in xs:\n        h = math.tanh(w_x * x + w_h * h)\n        out.append(h)\n    return out\n\nxs = [1.0, 0.5, -1.0]\nbwd = rnn_layer(xs[::-1], -0.5, 0.2)[::-1]\nbwd2 = rnn_layer([1.0, 0.5, 2.0][::-1], -0.5, 0.2)[::-1]\nprint('bwd with last = -1.0:', [round(v, 4) for v in bwd])\nprint('bwd with last =  2.0:', [round(v, 4) for v in bwd2])\nprint('changing the LAST input moved the FIRST backward state')\n\n# جرّب: غيّر أول عنصر بدل الأخير — أي جهة من المخرج الخلفي تتحرك هذه المرة؟\n# try: change the FIRST element instead of the last - which end of the backward\n#      output moves this time?\n",
      prompt: {
        ar: 'الملعب يثبت مركزية الاتجاه: تغيير آخر مدخل من −1.0 إلى 2.0 لم يتحرك منه شيء في الحالة الأمامية، لكن الحالة الخلفية الأولى انقلبت من −0.4863 إلى −0.52 ومن −0.1563 إلى −0.3819 وحتى الأخيرة صارت −0.7616 — الطبقة الخلفية تعرف المستقبل لأنها تبدأ من نهايته.',
        en: 'The sandbox proves directionality: changing the last input from \u22121.0 to 2.0 leaves the forward state untouched, but the backward states all move \u2014 the first flips from \u22120.4863 to \u22120.52, the second from \u22120.1563 to \u22120.3819, the last becomes \u22120.7616. The backward layer knows the future because it starts from the end.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في شبكة متكررة عميقة بـ L طبقات، أي حالة تقرأها طبقة الإخراج؟',
            en: 'In a deep RNN with L layers, which state does the output layer read?',
          },
          options: [
            { id: 'a', text: { ar: 'مجموع حالات جميع الطبقات', en: 'The sum of all layers\u2019 states' } },
            { id: 'b', text: { ar: 'حالة الطبقة الأخيرة L فقط: O_t = H_t^(L)·W_hq + b_q', en: 'Only the last layer\u2019s state: O_t = H_t^(L)\u00b7W_hq + b_q' } },
            { id: 'c', text: { ar: 'حالة الطبقة الأولى لأنها الأقرب للمدخلات', en: 'The first layer\u2019s state, being closest to the inputs' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كل طبقة متكررة تُغذّي التي فوقها، وطبقة الإخراج موصولة بحالة الطبقة الأخيرة فقط عند كل خطوة — الطبقات الوسيطة لا ترى الضوء مباشرة.',
            en: 'Each recurrent layer feeds the one above it, and the output layer is connected only to the last layer\u2019s state at each step \u2014 intermediate layers never see the light directly.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'بعد دمج حالتي الاتجاهين في BiRNN، ما بُعد الحالة H_t لكل مثال إذا كان لكل اتجاه h وحدة خفية؟',
            en: 'After concatenating the two directions in a BiRNN, what is the dimension of H_t per example if each direction has h hidden units?',
          },
          options: [
            { id: 'a', text: { ar: 'h — الدمج يجمع القيم لا يضيف أبعادًا', en: 'h \u2014 concatenation merges values without adding dimensions' } },
            { id: 'b', text: { ar: '2h', en: '2h' } },
            { id: 'c', text: { ar: 'h²', en: 'h\u00b2' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الدمج (concatenation) يلصق متجهي الاتجاهين فتصبح الحالة بطول 2h، ومن ثمّ تكون مصفوفة طبقة الإخراج W_hq ∈ R^(2h×q). هذا ضِعف كلفة المعالم في طبقة الإخراج.',
            en: 'Concatenation glues the two direction vectors, so the state is 2h long, and the output layer\u2019s matrix becomes W_hq \u2208 R^(2h\u00d7q). That is double the parameter cost in the output layer.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'الكتاب يحذّر أن تدريب الشبكات المتكررة العميقة يحتاج عناية خاصة. ما أبرز ما يجب ضبطه؟',
            en: 'The book warns that training deep RNNs needs special care. What chiefly needs tuning?',
          },
          options: [
            { id: 'a', text: { ar: 'معدل التعلم وحد قصّ التدرجات لضمان التقارب المستقر', en: 'The learning rate and the gradient clipping bound to keep convergence stable' } },
            { id: 'b', text: { ar: 'حجم مفردات الرموز فقط', en: 'Only the token vocabulary size' } },
            { id: 'c', text: { ar: 'لا شيء — العمق يحل كل المشاكل تلقائيًا', en: 'Nothing \u2014 depth solves everything automatically' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل طبقة إضافية تضاعف سلاسل الضرب في الزمن والعمق معًا، فتنفجر أو تتلاشى التدرجات أسرع — القصّ وضبط معدل التعلم والتهيئة المتأنية هي أدوات السيطرة.',
            en: 'Every extra layer multiplies the product chains in both time and depth, so gradients explode or vanish faster \u2014 clipping, a tuned learning rate, and careful initialization are the controls.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'العمق المزدوج: كل طبقة تتلقى مخارج الطبقة الأدنى عند الخطوة نفسها وحالتها من الخطوة السابقة، وطبقة الإخراج تقرأ الطبقة الأخيرة فقط (الهدف من s3 الشبكات المتكررة العميقة).', en: 'Double depth: every layer receives the layer below\u2019s outputs at the same step and its own state from the previous step, and the output layer reads only the last layer (goal of s3 Deep Recurrent Neural Networks).' },
        { ar: 'BiRNN يقرأ المتتالية مرتين باتجاهين ويدمج الحالتين فتتضاعف الأبعاد إلى 2h — مثالي للترميز والوسم وملء المحجوب (الهدف من s4 الشبكات المتكررة ثنائية الاتجاه).', en: 'A BiRNN reads the sequence twice in both directions and concatenates the states, doubling dimensions to 2h \u2014 ideal for encoding, tagging, and masked filling (goal of s4 Bidirectional Recurrent Neural Networks).' },
        { ar: 'الحدود الصريحة: لا BiRNN في التوليد التلقائي (لا مستقبل بعد)، وكلفة التدريب أعلى بسلاسل تدرج مضاعفة — لذا يعمق الممارسون الشبكة المبوَّبة ويحتفظون بالثنائية للترميز.', en: 'Explicit limits: no BiRNN in autoregressive generation (no future yet), and training costs more with doubled gradient chains \u2014 so practitioners deepen the gated cell and reserve bidirectionality for encoders.' },
      ],
      reflectPrompt: {
        ar: 'لديك مهمة وسم أحرف في نص منتهٍ وأخرى توليد أوامر shell حيًّا: أيها تأخذ معمارية ثنائية الاتجاه، وأين تتوقف عند الأحادية مع تكديس الطبقات؟',
        en: 'You have a character-tagging task on finished text and a live shell-command generation task: which one takes a bidirectional architecture, and where do you stay unidirectional with stacked layers?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch10.s3' },
        { book: 'D2L', section: 'd2l.ch10.s4' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch10.s3' },
    { book: 'D2L', section: 'd2l.ch10.s4' },
  ],
} satisfies Lesson;

export default lesson;
