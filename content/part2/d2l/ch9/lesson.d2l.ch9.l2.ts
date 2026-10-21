import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch9.l2 — "Language Models and Recurrent Networks"
 * نماذج اللغة والشبكات المتكررة
 * Aligned with D2L ch9 s3 (Language Models) + s4 (Recurrent Neural
 * Networks). All expression is original — a paraphrase of the source's
 * ideas, never a verbatim translation. Runnable design: a bigram LM on a
 * fixed corpus, perplexity from fixed probabilities, and an RNN hidden
 * state recurrence with literal scalar weights; every literal verified
 * under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch9.l2',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 9,
  title: {
    ar: 'نماذج اللغة والشبكات المتكررة',
    en: 'Language Models and Recurrent Networks',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch9.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: '«to recognize speech» و«to wreck a nice beach» يبدوان متطابقين صوتيًا — وما يحسم الأمر هو نموذج لغة يعرف أي التركيبين معقول. في هذا الدرس نقدّر احتمال جملة كاملة بتفكيكها إلى شرطيات، نجرب نموذج bigram بالعدّ، نتعلم المقياس القياسي perplexity، ثم نرى كيف تحل الشبكة المتكررة مشكلة التاريخ المتنامي بحالة خفية تُحدَّث خطوة بخطوة.',
        en: '"to recognize speech" and "to wreck a nice beach" sound nearly identical \u2014 and what disambiguates them is a language model that knows which phrase is plausible. In this lesson we estimate the probability of a whole sentence by factoring it into conditionals, try a counting bigram model, learn the standard metric perplexity, and then see how a recurrent network solves the growing-history problem with a hidden state updated step by step.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من سلسلة الشرطيات إلى perplexity', en: 'From a chain of conditionals to perplexity' },
      chunks: [
        {
          ar: 'نموذج اللغة يقدّر الاحتمال المشترك P(x_1, ..., x_T)، وقاعدة الاحتمال تفككه من اليسار إلى اليمين: P(x_1)·P(x_2|x_1)·P(x_3|x_1,x_2)... وهكذا. افتراض Markov يقصّر الشرط: نموذج unigram يستقل الرموز، وbigram يشترط بالسابق مباشرة، وtrigram بالاثنين قبله. التقدير بالعدّ: P(x\u2032|x) = n(x,x\u2032)/n(x) — لكن الأزواج النادرة تجعل التقدير هشًا، وتمهيد Laplace (إضافة ε الصغيرة للأعداد) يمنع الاحتمالات الصفرية دون أن يحل المشكلة الجوهرية: عدد التركيبات ينفجر ولا نتعلم معنى الكلمات. مقياس الجودة هو متوسط الإنتروبيا التقاطعية −(1/n)·Σ log P(x_t|السياق)، ولأسباب تاريخية نباعسه أسّيًا: perplexity = exp(ذلك المتوسط) — تفسر كعدد فاعل من الخيارات لكل خطوة: نموذج مثالي يعطي 1، ونموذج موحّد على مفردات حجمها m يعطي m بالضبط.',
          en: 'A language model estimates the joint P(x_1, ..., x_T), and the chain rule factors it left to right: P(x_1)\u00b7P(x_2|x_1)\u00b7P(x_3|x_1,x_2)... A Markov assumption shortens each conditional: a unigram model treats tokens independently, a bigram conditions on the immediate predecessor, a trigram on the two before it. Counting estimates P(x\u2032|x) = n(x,x\u2032)/n(x) \u2014 but rare pairs make it brittle, and Laplace smoothing (adding a small \u03b5 to counts) prevents zero probabilities without fixing the deeper issue: combinations explode and no meaning is learned. Quality is measured by average cross-entropy \u2212(1/n)\u00b7\u03a3 log P(x_t|context), and by historical convention we exponentiate it: perplexity = exp(that average) \u2014 read it as the effective number of choices per step: a perfect model yields 1, and a uniform model over a vocabulary of size m yields exactly m.',
        },
        {
          ar: 'نموذج العدّ يخزن جداول ضخمة ويتجاهل المعنى («cat» و«feline» لا علاقة بينهما عنده). البديل: نموذج متغير كامن يقارّب P(x_t | h_{t-1}) حيث h حالة خفية تلخّص كل ما رُئي حتى الآن: h_t = f(x_t, h_{t-1}). لاحظ الفرق الدقيق: الطبقات الخفية hidden layers أجزاء محجوبة في المسار من المدخل إلى المخرج، أما الحالة الخفية hidden state فمدخل إضافي وُلد من خطوات سابقة. الشبكة المتكررة RNN تجسّد ذلك بمعادلتين لكل خطوة t: الحالة H_t = φ(X_t·W_xh + H_{t-1}·W_hh + b_h) ثم المخرج O_t = H_t·W_hq + b_q — والمعاملات نفسها تُعاد استخدامها في كل الخطوات، فكلفة المعالم لا تنمو مع طول المتتالية، وتصنيف softmax على O_t يعطي توزيع الرمز القادم (نموذج لغة حرفي).',
          en: 'A counting model stores huge tables and ignores meaning ("cat" and "feline" are unrelated to it). The alternative: a latent-variable model approximating P(x_t | h_{t-1}) where h is a hidden state summarizing everything seen so far: h_t = f(x_t, h_{t-1}). Note the distinction: hidden layers are parts of the input-to-output path hidden from view, while a hidden state is an extra input produced by earlier steps. A recurrent neural network realizes this with two equations per step t: the state H_t = \u03c6(X_t\u00b7W_xh + H_{t-1}\u00b7W_hh + b_h), then the output O_t = H_t\u00b7W_hq + b_q \u2014 the same parameters reused at every step, so the parameter cost does not grow with sequence length, and a softmax over O_t yields the next-token distribution (a character-level language model).',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'bigram بالعدّ + perplexity + حالة خفية تتحرك',
        en: 'A counting bigram + perplexity + a moving hidden state',
      },
      code: "import math\n\n# --- a counting bigram model on the tiny corpus from lesson 1 ---\nwords = 'the time machine the time traveller the time machine by h g wells'.split()\nn = len(words)\nunigram = {}\nfor w in words:\n    unigram[w] = unigram.get(w, 0) + 1\nbigram = {}\nfor a, b in zip(words[:-1], words[1:]):\n    bigram[(a, b)] = bigram.get((a, b), 0) + 1\n\ndef cond(a, b):\n    return bigram.get((a, b), 0) / unigram[a]\n\nprint('P(time | the) =', cond('the', 'time'))\nprint('P(machine | time) =', cond('time', 'machine'))\nprint('P(traveller | time) =', cond('time', 'traveller'))\np_start = unigram['the'] / n\np_seq = p_start * cond('the', 'time') * cond('time', 'machine')\nprint('P(the time machine) =', round(p_seq, 4))\n\n# --- perplexity: exp of the mean negative log-likelihood ---\ndef perplexity(probs):\n    return math.exp(-sum(math.log(p) for p in probs) / len(probs))\n\nprint('ppl [0.5, 0.25, 0.25] =', round(perplexity([0.5, 0.25, 0.25]), 4))\nprint('uniform over 18 chars -> ppl = vocab size =', round(perplexity([1 / 18] * 18), 4))\n\n# --- an RNN hidden state is a summary that feeds back ---\ndef rnn_run(xs, w_x, w_h, h=0.0):\n    states = []\n    for x in xs:\n        h = math.tanh(w_x * x + w_h * h)\n        states.append(round(h, 4))\n    return states\n\nprint('hidden states:', rnn_run([1.0, 0.0, -1.0], 1.0, 0.8))",
      explanation: {
        ar: 'ثلاث فكرة في تقرير واحد. أولًا نموذج bigram: الكلمة «the» ظهرت 3 مرات وكلها تبعتها «time» فـ P(time|the)=1.0، بينما «time» ظهرت 3 مرات تبعتها «machine» مرتين و«traveller» مرة فـ 0.667 و0.333؛ واحتمال الجملة «the time machine» = P(the)·P(time|the)·P(machine|time) = (3/13)·1·(2/3) ≈ 0.1538. ثانيًا المقياس: احتمالات [0.5, 0.25, 0.25] تعطي perplexity ≈ 3.1748 — أي «2.7 خيار فاعل لكل خطوة» — بينما التوزيع الموحد على 18 حرفًا يعطي 18.0 بالضبط، وهذا خط الأساس الذي يجب على أي نموذج هزيمته. ثالثًا الحالة الخفية بمعادلة h = tanh(1.0·x + 0.8·h) تمضي [0.7616, 0.5436, -0.5118] على المدخلات [1, 0, -1]: تلخيص متجدد للماضي لا جدول أعداد.',
        en: 'Three ideas in one report. First the bigram model: "the" occurred 3 times and was always followed by "time", so P(time|the)=1.0; "time" occurred 3 times followed twice by "machine" and once by "traveller", giving 0.667 and 0.333; the sentence "the time machine" scores P(the)\u00b7P(time|the)\u00b7P(machine|time) = (3/13)\u00b71\u00b7(2/3) \u2248 0.1538. Second the metric: probabilities [0.5, 0.25, 0.25] give perplexity \u2248 3.1748 \u2014 about "2.7 effective choices per step" \u2014 while a uniform distribution over 18 characters gives exactly 18.0, the baseline any model must beat. Third the hidden state with h = tanh(1.0\u00b7x + 0.8\u00b7h) moves [0.7616, 0.5436, -0.5118] under inputs [1, 0, -1]: a running summary of the past, not a table of counts.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.perplexity',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ perplexity(probs) التي تأخذ قائمة احتمالات حقيقية موجبة للرموز الملاحظة وتعيد exp(−متوسط log p): أي لوغاريتم طبيعي، مأخوذ بمتوسط على الرموز، مرفوعًا أسًّا.',
        en: 'Implement perplexity(probs) taking a list of positive real probabilities of the observed tokens and returning exp(\u2212mean(log p)): natural logarithm, averaged over tokens, then exponentiated.',
      },
      starterCode: "import math\n\ndef perplexity(probs):\n    ...  # TODO: -mean(log p), then exponentiate\n    return value\n\nprint('perfect model :', perplexity([1.0, 1.0]))\nprint('uniform over 4:', perplexity([0.25, 0.25, 0.25, 0.25]))\nprint('mixed         :', perplexity([0.5, 0.25, 0.25]))\n",
      solution: "import math\n\ndef perplexity(probs):\n    return math.exp(-sum(math.log(p) for p in probs) / len(probs))",
      tests: [
        {
          id: 't1',
          name: { ar: 'النموذج المثالي يعطي 1', en: 'A perfect model gives 1' },
          code: "import math\nassert abs(perplexity([1.0, 1.0]) - 1.0) < 1e-9, 'expected 1.0 | actual: %r' % perplexity([1.0, 1.0])",
          expected: '1.0',
        },
        {
          id: 't2',
          name: { ar: 'التوزيع الموحد يساوي حجم المفردات', en: 'The uniform distribution equals the vocabulary size' },
          code: "import math\nassert abs(perplexity([0.25] * 4) - 4.0) < 1e-9, 'expected 4.0 | actual: %r' % perplexity([0.25] * 4)",
          expected: '4.0',
        },
        {
          id: 't3',
          name: { ar: 'الحالة المختلطة تعطي القيمة المتحقق منها', en: 'The mixed case matches the verified value' },
          code: "import math\np = perplexity([0.5, 0.25, 0.25])\nassert abs(p - 3.1748021039363987) < 1e-6, 'expected ~3.1748 | actual: %r' % p",
          expected: '~3.1748',
        },
      ],
      hints: [
        { ar: 'الصيغة: math.exp(-sum(math.log(p) for p in probs) / len(probs)) — متوسط داخل الأس، وليس أس كل حد.', en: 'The formula: math.exp(-sum(math.log(p) for p in probs) / len(probs)) \u2014 the mean goes inside the exponent, not the exponent around each term.' },
        { ar: 'اللوغاريتم الطبيعي math.log — و perplexity المثالي (كل p=1) يساوي 1 لأن log 1 = 0.', en: 'Use the natural log math.log \u2014 a perfect perplexity (all p=1) is 1 because log 1 = 0.' },
        { ar: 'تحقق بالعلاقة العكسية: التوزيع الموحد على m رموز يعطي m بالضبط — جرّبه على [0.25]*4.', en: 'Check with the inverse relation: a uniform distribution over m tokens gives exactly m \u2014 try [0.25]*4.' },
        { ar: 'قيمة مرجعية: perplexity([0.5, 0.25, 0.25]) ≈ 3.1748 — يجب أن تطابق إلى 1e-6.', en: 'Reference value: perplexity([0.5, 0.25, 0.25]) \u2248 3.1748 \u2014 it must match to 1e-6.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-shift',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وأكتب مخرجه بالضبط (سطران): عند تدريب نموذج لغة على نوافذ طولها num_steps، المدخلات X نافذة من المتتالية والهدف Y هي المتتالية نفسها مزاحة خطوة واحدة. ما X و Y المطبوعان؟',
        en: 'Read the code and write its exact output (two lines): when training a language model on windows of num_steps tokens, X is a window of the sequence and Y is the same sequence shifted by one. What X and Y are printed?',
      },
      code: "tokens = [21, 9, 6, 0, 21, 10, 14, 6]\nnum_steps = 4\ninputs = tokens[0:num_steps]\nlabels = tokens[1:num_steps + 1]\nprint(inputs)\nprint(labels)",
      answer: '[21, 9, 6, 0]\n[9, 6, 0, 21]',
      solution: '[21, 9, 6, 0]\n[9, 6, 0, 21]',
      hints: [
        { ar: 'التقطيع في Python لا يشمل الحد الأعلى: tokens[0:4] يعطي العناصر 0..3 فقط.', en: 'Python slices exclude the upper bound: tokens[0:4] gives elements 0..3 only.' },
        { ar: 'الإزاحة تبدأ من 1: tokens[1:5] تعطي العناصر 1..4.', en: 'The shift starts at 1: tokens[1:5] gives elements 1..4.' },
        { ar: 'كل هدف Y_t هو الرمز الذي يجب أن يتنبأ به النموذج بعد رؤية X_t — لهذا Y هو X مزاحًا خطوة.', en: 'Each target Y_t is the token the model must predict after seeing X_t \u2014 that is why Y is X shifted by one.' },
        { ar: 'المخرج سطران: [21, 9, 6, 0] ثم [9, 6, 0, 21].', en: 'The output is two lines: [21, 9, 6, 0] then [9, 6, 0, 21].' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\nwords = 'the time machine the time traveller the time machine by h g wells'.split()\nunigram = {}\nfor w in words:\n    unigram[w] = unigram.get(w, 0) + 1\nbigram = {}\nfor a, b in zip(words[:-1], words[1:]):\n    bigram[(a, b)] = bigram.get((a, b), 0) + 1\n\ndef smoothed_cond(a, b, eps):\n    # Laplace-style smoothing: mix the count with a small floor\n    num = bigram.get((a, b), 0) + eps * (unigram[b] / len(words))\n    den = unigram[a] + eps\n    return num / den\n\nfor eps in (0.0, 0.5, 5.0, 100.0):\n    row = ['%s:%.3f' % (b, smoothed_cond('time', b, eps)) for b in ('machine', 'traveller')]\n    print('eps=%5.1f  P(.|time) ->' % eps, row)\n\n# جرّب: مع eps الضخم يقترب التوزيع من الموحد — لماذا؟ وما ثمن ذلك على الأزواج الموثوقة؟\n# try: with a huge eps the distribution approaches uniform - why, and what does that\n#      cost the well-attested pairs?\n",
      prompt: {
        ar: 'الملعب يفحص تمهيد Laplace: بدون تمهيد P(machine|time)=0.667 و P(traveller|time)=0.333؛ ومع eps=100 يزحف التوزيع نحو التوحيد (0.5 تقريبًا لكل منهما). التمهيد يشتري أمانًا ضد الصفر ويدفع ثمنه بإضعاف كل إشارة — وهذا أحد أسباب فضول النماذج العصبية التي تتعلم الشرطيات بدل عدّها.',
        en: 'The sandbox probes Laplace smoothing: with no smoothing P(machine|time)=0.667 and P(traveller|time)=0.333; at eps=100 the distribution crawls toward uniform (\u22480.5 each). Smoothing buys safety against zero and pays by diluting every signal \u2014 one reason neural models that learn conditionals are attractive.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'نموذج لغة موحّد تمامًا على مفردات حجمها 1000 رمز: ما قيمة perplexity الخاصة به؟',
            en: 'A language model that is perfectly uniform over a 1000-token vocabulary: what is its perplexity?',
          },
          options: [
            { id: 'a', text: { ar: '1', en: '1' } },
            { id: 'b', text: { ar: '1000', en: '1000' } },
            { id: 'c', text: { ar: 'يعتمد على طول النص', en: 'It depends on the text length' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التوزيع الموحد يعطي لكل رمز لوجاريتم −log(1/m) = log m، والمتوسط log m، ورفعه أسًّا يعيد m. لهذا perplexity يساوي حجم المفردات عند خط الأساس الموحد — وهو الحد الأعلى الذي يجب هزيمته.',
            en: 'A uniform distribution assigns every token \u2212log(1/m) = log m; the average is log m and exponentiating recovers m. So perplexity equals the vocabulary size at the uniform baseline \u2014 the bar any useful model must beat.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرق الجوهري بين الطبقة الخفية hidden layer والحالة الخفية hidden state؟',
            en: 'What is the essential difference between a hidden layer and a hidden state?',
          },
          options: [
            { id: 'a', text: { ar: 'لا فرق — اسمان لنفس الشيء', en: 'No difference \u2014 two names for the same thing' } },
            { id: 'b', text: { ar: 'الطبقة الخفية جزء من مسار المدخل-المخرج، والحالة الخفية مدخل وُلد من الخطوات السابقة', en: 'A hidden layer is part of the input-to-output path; a hidden state is an input produced by previous time steps' } },
            { id: 'c', text: { ar: 'الحالة الخفية هي دائمًا مخرج الطبقة الأخيرة', en: 'The hidden state is always the last layer\u2019s output' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الطبقات الخفية محجوبة عن النظر على طريق واحد داخل الشبكة، أما الحالة الخفية فهي متغير كامن يحمل ملخص الماضي ويُغذى إلى الخطوة التالية: h_t = f(x_t, h_{t-1}). هذا التمييز هو جوهر تعريف RNN.',
            en: 'Hidden layers sit unseen along one pass through the network, while a hidden state is a latent variable carrying a summary of the past into the next step: h_t = f(x_t, h_{t-1}). This distinction is the heart of the RNN definition.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا تحتاج نماذج n-gram إلى تمهيد Laplace أصلا؟',
            en: 'Why do n-gram models need Laplace smoothing in the first place?',
          },
          options: [
            { id: 'a', text: { ar: 'لتسريع العدّ', en: 'To speed up counting' } },
            { id: 'b', text: { ar: 'لأن كثيرًا من التركيبات المعقولة لا تظهر في بيانات التدريب فتصير احتمالاتها صفرًا', en: 'Because many plausible combinations never appear in training, making their probability zero' } },
            { id: 'c', text: { ar: 'لأن اللوغاريتم غير معرّف للأعداد الصحيحة', en: 'Because the logarithm is undefined for integers' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'عدد التركيبات المحتملة ينفجر أسّيًا مع طول n، ومعظمها نادر أو غائب؛ احتمال صفر يدمّر نموذج اللغة (وأي تسلسل يحويه). التمهيد يضيف أرضية صغيرة، لكن العلاج أعمق: نموذج يتعلم التشابه بين الرموز — وهو دور الشبكات.',
            en: 'The number of combinations explodes exponentially with n and most are rare or absent; a zero probability breaks a language model (any sequence containing it). Smoothing adds a small floor, but the deeper fix is a model that learns similarity between tokens \u2014 the job of networks.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'نموذج اللغة يفكك الاحتمال المشترك إلى شرطيات، وافتراضات Markov (unigram/bigram/trigram) تقصّر السياق على حساب الدقة — مع تمهيد Laplace ضد الأصفار (الهدف من s3 نماذج اللغة).', en: 'A language model factors the joint into conditionals, and Markov assumptions (unigram/bigram/trigram) shorten context at the cost of accuracy \u2014 with Laplace smoothing against zeros (goal of s3 Language Models).' },
        { ar: 'perplexity = أسّ متوسط الإنتروبيا التقاطعية: 1 للمثالي وحجم المفردات للموحّد — والنموذج الموحد هو خط الأساس (الهدف من s3 أيضًا، فرع المقياس).', en: 'Perplexity = the exponentiated mean cross-entropy: 1 for a perfect model, vocabulary size for a uniform one \u2014 the uniform model is the baseline (also from s3, the metric branch).' },
        { ar: 'RNN يحل مشكلة التاريخ المتنامي بحالة خفية H_t = φ(X_t·W_xh + H_{t-1}·W_hh + b_h) بمعاملات مشتركة عبر الزمن، وطبقة إخراج O_t = H_t·W_hq + b_q تعطي توزيع الرمز القادم (الهدف من s4 الشبكات المتكررة).', en: 'An RNN solves the growing-history problem with a hidden state H_t = \u03c6(X_t\u00b7W_xh + H_{t-1}\u00b7W_hh + b_h) whose parameters are shared across time, and an output layer O_t = H_t\u00b7W_hq + b_q giving the next-token distribution (goal of s4 Recurrent Neural Networks).' },
      ],
      reflectPrompt: {
        ar: 'لو صممت نموذج لغة للرسائل القصيرة: ما n الذي تختاره لنموذج العدّ، وما أول ما ستخسره مقارنة بنموذج بحالة خفية؟',
        en: 'Designing a language model for short messages: what n would you pick for a counting model, and what is the first thing you would lose compared to a model with a hidden state?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch9.s3' },
        { book: 'D2L', section: 'd2l.ch9.s4' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch9.s3' },
    { book: 'D2L', section: 'd2l.ch9.s4' },
  ],
} satisfies Lesson;

export default lesson;
