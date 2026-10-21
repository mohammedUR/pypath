import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch9.l1 — "Working with Sequences: From Statistics to Text"
 * التعامل مع المتتاليات: من الإحصاء إلى النص
 * Aligned with D2L ch9 s1 (Working with Sequences) + s2 (Converting Raw
 * Text into Sequence Data). All expression is original — a paraphrase of
 * the source's ideas, never a verbatim translation. Runnable design: the
 * full text pipeline (preprocess -> char tokens -> vocab -> indices) plus
 * bigram statistics on a tiny fixed corpus; every literal verified under
 * CPython 3. Deterministic only: no input(), no exit(), no unittest.main,
 * no seeding needed.
 */
const lesson = {
  id: 'd2l.ch9.l1',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 9,
  title: {
    ar: 'التعامل مع المتتاليات: من الإحصاء إلى النص',
    en: 'Working with Sequences: From Statistics to Text',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch14.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل ما درسناه حتى الآن يفترض مدخلات بطول ثابت: جدول صفوف، أو صورة 28×28. لكن الكلام والنص والأسعار متتاليات طولها يتغير — وخطوتها الحالية تعتمد على ما قبلها. هنا تبدأ سلسلة نمذجة المتتاليات: نتعلم أولًا كيف نُحوِّل نصًا خامًا إلى أرقام يمكن لشبكة قراءتها (معالجة → تقطيع → مفردات → أرقام)، وكيف يكشف إحصاء اللغة قانون Zipf الذي يفسّر لماذا لا يكفي العدّ وحده.',
        en: 'Everything so far assumed fixed-length inputs: table rows, or a 28\u00d728 image. But speech, text and prices are sequences of varying length \u2014 and each step depends on the ones before it. This lesson opens sequence modeling: first, how to turn raw text into numbers a network can read (preprocess \u2192 tokenize \u2192 vocabulary \u2192 indices), and how language statistics expose Zipf\u2019s law, which explains why counting alone is not enough.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التنبؤ الذاتي والذاكرة: أدوات إحصاء المتتاليات', en: 'Autoregression and memory: the statistics of sequences' },
      chunks: [
        {
          ar: 'المتتالية قائمة مرتبة من المتجهات x_1 إلى x_T: كلمات نص، أسعار مؤشر، قراءات حساس. لا نفترض استقلال الخطوات — بل استقلال المتتاليات الكاملة فقط، ولهذا تنجح لوحات الإكمال التلقائي في تخمين كلمتك القادمة. الهدف الأبسط نمذجة الكثافة: تقدير P(x_t | x_{t-1}, ..., x_1). انحدار إشارة على قيمها السابقة يُسمى autoregressive، وعدد مدخلاته يتزايد مع الزمن — والحلان الكلاسيكيان: نافذة ثابتة بطول τ (افتراض Markov: المستقبل يعتمد على التاريخ القريب فقط)، أو حالة خفية h_t تلخّص الماضي وتتحدث بالمعادلة h_t = g(h_{t-1}, x_{t-1}) — وهي بذرة RNN. قاعدة ذهبية: لا تتدرب على المستقبل. وعند التنبؤ k خطوات بلصق تنبؤاتنا كمدخلات، تتراكم الأخطاء وتنهار الجودة بسرعة — كتوقعات الطقس بعد يومين.',
          en: 'A sequence is an ordered list of vectors x_1 through x_T: words of a document, index prices, sensor readings. We do not assume steps are independent \u2014 only that whole sequences are, which is why autofill can guess your next word. The simplest goal is density modeling: estimate P(x_t | x_{t-1}, ..., x_1). A regression of a signal on its own past is called autoregressive, and its input count grows with time \u2014 two classic fixes: a fixed window of \u03c4 steps (a Markov assumption: the future depends only on recent history), or a latent summary h_t of the past updated by h_t = g(h_{t-1}, x_{t-1}) \u2014 the seed of the RNN. Golden rule: never train on the future. And when predicting k steps ahead by feeding our own predictions back, errors accumulate and quality collapses fast \u2014 like weather forecasts two days out.',
        },
        {
          ar: 'قبل أي نموذج، يمر النص الخام بأربع خطوات: تحميل السلسلة، تنظيفها (أحرف صغيرة وإزالة علامات الترقيم)، تقطيعها إلى رموز tokens — حروف أو كلمات أو قطع كلمات — ثم بناء مفردات vocabulary تربط كل رمز فريد برقم، مع رمز خاص <unk> لكل ما هو نادر أو غير مرئي. التقطيع بالحروف يعطي مفردات صغيرة ومتتاليات طويلة (28 رمزًا تكفي كتابًا كاملًا في مثال الكتاب)، وبالكلمات يحدث العكس: مفردات ضخمة ومتتاليات قصيرة. وإحصاء اللغة يكشف قانون Zipf: تردد الكلمة يتناسب عكسيًا مع رتبتها n_i \u221d 1/i^α — قلة شائعة جدًا وذيل طويل نادر، والنمط نفسه يتكرر مع الأزواج bigrams؛ لذا يفشل العدّ الصرف في التقاط البنية، وهذا ما يدفعنا نحو النماذج العصبية.',
          en: 'Before any model, raw text passes through four steps: load the string, clean it (lowercase, strip punctuation), tokenize it \u2014 characters, words, or word pieces \u2014 then build a vocabulary mapping each distinct token to an index, with a special <unk> token for anything rare or unseen. Character-level tokenization gives a tiny vocabulary and long sequences (28 tokens sufficed for a whole book in the text\u2019s example); word-level does the opposite: a huge vocabulary and short sequences. And language statistics reveal Zipf\u2019s law: word frequency decays with rank, n_i \u221d 1/i^α \u2014 a few very common words and a very long rare tail, a pattern that repeats for bigrams too. So plain counting cannot capture the structure \u2014 which pushes us toward neural models.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'خط الأنابيب كاملًا على مجموعة نصية صغيرة ثابتة',
        en: 'The full pipeline on a tiny fixed corpus',
      },
      code: "import re\n\ncorpus = 'the time machine the time traveller the time machine by h g wells'\n\n# step 1: preprocess - keep letters, fold case, everything else becomes a space\ntext = re.sub('[^A-Za-z]+', ' ', corpus).lower()\n\n# step 2: tokenize at the character level (one token = one character)\ntokens = list(text)\nprint('first 12 tokens:', tokens[:12])\n\n# step 3: vocabulary - sorted unique tokens with <unk> reserved\nidx_to_token = sorted(set(['<unk>'] + tokens))\ntoken_to_idx = {t: i for i, t in enumerate(idx_to_token)}\nprint('vocab size:', len(idx_to_token))\n\n# step 4: encode and decode (a lossless round trip)\nindices = [token_to_idx[t] for t in tokens[:10]]\nprint('indices:', indices)\nprint('decoded:', ''.join(idx_to_token[i] for i in indices))\n\n# word-level statistics: counts and the most frequent bigrams\nwords = text.split()\nprint('words:', len(words), '| unique words:', len(set(words)))\nbigrams = {}\nfor a, b in zip(words[:-1], words[1:]):\n    bigrams[(a, b)] = bigrams.get((a, b), 0) + 1\ntop = sorted(bigrams.items(), key=lambda kv: (-kv[1], kv[0]))[:3]\nprint('top bigrams:', top)",
      explanation: {
        ar: 'أربع خطوات على 13 كلمة: بعد التنظيف صارت السلسلة أحرفًا صغيرة ومسافات فقط، والتقطيع بالحروف أعطى الرموز الاثني عشر الأولى t,h,e, ,t,i,m,e, ,m,a,c. المفردات مرتبة أبجديًا مع <unk> المحجوز: 18 رمزًا (المسافة تسبق الأحرف في الترتيب)، فصار «the time m» = [14, 7, 5, 0, 14, 8, 10, 5, 0, 10] — والفك يعيد النص كما كان: الترميز بلا فقد. على مستوى الكلمات: 13 كلمة منها 8 فريدة، وأكثر الأزواج تكرارًا («the time» ثلاث مرات ثم «time machine» مرتين) — حتى في هذا النص القصير تتصدّر الأزواج المتكررة، وهذه هي الإشارة التي ستنمذجها نماذج اللغة.',
        en: 'Four steps over 13 words: after cleaning, the string is lowercase letters and spaces only, and character tokenization yields the first twelve tokens t,h,e, ,t,i,m,e, ,m,a,c. The vocabulary is sorted with <unk> reserved: 18 tokens (the space sorts before letters), so "the time m" becomes [14, 7, 5, 0, 14, 8, 10, 5, 0, 10] \u2014 and decoding restores the text exactly: the encoding is lossless. At the word level: 13 words, 8 unique, and the most frequent pairs are ("the", "time") \u00d73 then ("time", "machine") \u00d72 \u2014 even in this tiny corpus repeated pairs stand out, and that signal is exactly what language models will model.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.build-vocab',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ build_vocab(tokens) التي تعيد (token_to_idx, idx_to_token) حيث <unk> دائمًا في الفهرس 0 وبقية الرموز الفريدة مرتبة بعده أبجديًا. ثم نفّذ encode(tokens, token_to_idx) التي تحوّل الرموز إلى أرقام وتُسقط أي رمز غير معروف إلى 0، و decode(indices, idx_to_token) للفك.',
        en: 'Implement build_vocab(tokens) returning (token_to_idx, idx_to_token) where <unk> is always index 0 and the remaining unique tokens follow in sorted order. Then implement encode(tokens, token_to_idx) mapping tokens to indices with unknown tokens falling back to 0, and decode(indices, idx_to_token) to go back.',
      },
      starterCode: "def build_vocab(tokens):\n    ...  # TODO: reserve '<unk>' at index 0, then sorted unique tokens\n    return token_to_idx, idx_to_token\n\ndef encode(tokens, token_to_idx):\n    ...  # TODO: unknown tokens map to 0\n    return indices\n\ndef decode(indices, idx_to_token):\n    return [idx_to_token[i] for i in indices]\n",
      solution: "def build_vocab(tokens):\n    unique = sorted(set(tokens))\n    idx_to_token = ['<unk>'] + unique\n    token_to_idx = {t: i for i, t in enumerate(idx_to_token)}\n    return token_to_idx, idx_to_token\n\ndef encode(tokens, token_to_idx):\n    return [token_to_idx.get(t, 0) for t in tokens]\n\ndef decode(indices, idx_to_token):\n    return [idx_to_token[i] for i in indices]",
      tests: [
        {
          id: 't1',
          name: { ar: '<unk> يأخذ الفهرس 0 والبقية مرتبة', en: '<unk> takes index 0, the rest sorted' },
          code: "token_to_idx, idx_to_token = build_vocab(['a', 'b', 'a'])\nassert token_to_idx == {'<unk>': 0, 'a': 1, 'b': 2}, 'expected <unk>:0, a:1, b:2 | actual: %r' % token_to_idx",
          expected: "{'<unk>': 0, 'a': 1, 'b': 2}",
        },
        {
          id: 't2',
          name: { ar: 'الرمز المجهول يُرمَّز بـ 0', en: 'Unknown tokens encode to 0' },
          code: "token_to_idx, _ = build_vocab(['a', 'b', 'a'])\nassert encode(['a', 'z', 'b'], token_to_idx) == [1, 0, 2], 'expected [1, 0, 2] | actual: %r' % encode(['a', 'z', 'b'], token_to_idx)",
          expected: '[1, 0, 2]',
        },
        {
          id: 't3',
          name: { ar: 'الرحلة ذهابًا وإيابًا بلا فقد للرموز المعروفة', en: 'Round trip is lossless for known tokens' },
          code: "t2i, i2t = build_vocab(list('the time m'))\nassert decode(encode(list('the'), t2i), i2t) == ['t', 'h', 'e'], 'round trip must restore the tokens | actual: %r' % decode(encode(list('the'), t2i), i2t)",
          expected: "['t', 'h', 'e']",
        },
      ],
      hints: [
        { ar: 'ابدأ بـ unique = sorted(set(tokens)) ثم ضع <unk> قبلها: idx_to_token = [\'<unk>\'] + unique.', en: 'Start from unique = sorted(set(tokens)) then prepend: idx_to_token = [\'<unk>\'] + unique.' },
        { ar: 'ابنِ القاموس بحلقة تعداد: token_to_idx = {t: i for i, t in enumerate(idx_to_token)}.', en: 'Build the dict with enumerate: token_to_idx = {t: i for i, t in enumerate(idx_to_token)}.' },
        { ar: 'الترميز بمناولة آمنة: token_to_idx.get(t, 0) — القيمة الافتراضية 0 هي بالضبط دور <unk>.', en: 'Encode with a safe lookup: token_to_idx.get(t, 0) \u2014 the default 0 is exactly the <unk> role.' },
        { ar: 'قيم تحقق: على [\'a\',\'b\',\'a\'] تكون المفردات {\'<unk>\':0,\'a\':1,\'b\':2} و encode([\'a\',\'z\',\'b\']) = [1,0,2].', en: 'Sanity values: on [\'a\',\'b\',\'a\'] the vocab is {\'<unk>\':0,\'a\':1,\'b\':2} and encode([\'a\',\'z\',\'b\']) = [1,0,2].' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-tokenization',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'تقطيع النص نفسه على مستوى الحروف بدل الكلمات (كما في مثال الكتاب حيث اكتفى كامل رواية بـ 28 رمزًا حرفيًا) له أثر مباشر على شكل البيانات. ما هو؟',
        en: 'Tokenizing the same text at the character level instead of the word level (in the book\u2019s example an entire novel needed only 28 character tokens) has a direct effect on the data. Which one?',
      },
      options: [
        { id: 'a', text: { ar: 'مفردات أصغر بكثير ومتتاليات أطول لكل مستند', en: 'A much smaller vocabulary and longer sequences per document' } },
        { id: 'b', text: { ar: 'مفردات أكبر ومتتاليات أقصر', en: 'A larger vocabulary and shorter sequences' } },
        { id: 'c', text: { ar: 'لا فرق إطلاقًا — عدد الرموز متطابق', en: 'No difference at all \u2014 the token count is identical' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'عدّ الاحتمالات: مفردات الحروف محدودة (26 حرفًا + مسافة + رموز خاصة) مهما كان حجم النص.', en: 'Count the possibilities: a character vocabulary is bounded (26 letters + space + specials) no matter the corpus size.' },
        { ar: 'كل كلمة من متوسط 5 أحرف تصبح 6 رموز (الحروف + المسافة) — المتتالية تطول.', en: 'Each ~5-letter word becomes ~6 tokens (letters plus a space) \u2014 the sequence grows longer.' },
        { ar: 'التقطيع بالكلمات يفعل العكس تمامًا: عشرات الآلاف من الرموز وخطوات زمنية أقل.', en: 'Word-level tokenization does the exact opposite: tens of thousands of tokens but fewer time steps.' },
        { ar: 'الجواب: a — مقايضة كلاسيكية بين حجم المفردات وطول المتتالية.', en: 'Answer: a \u2014 the classic trade-off between vocabulary size and sequence length.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import re\n\ntext = re.sub('[^A-Za-z]+', ' ', 'the time machine the time traveller the time machine by h g wells').lower()\nwords = text.split()\n\ndef vocab_with_min_freq(words, min_freq):\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    kept = sorted({w for w, c in counts.items() if c >= min_freq})\n    return ['<unk>'] + kept, counts\n\nfor mf in (1, 2, 3):\n    idx_to_token, counts = vocab_with_min_freq(words, mf)\n    print('min_freq=%d -> vocab size %d (kept %s)' % (mf, len(idx_to_token), idx_to_token[1:]))\n\ncounts = vocab_with_min_freq(words, 1)[1]\nprint('counts:', counts)\n# جرّب: احسب P(next | the) من counts كنسبة n(the, next) / n(the).\n# try: compute P(next | the) from counts as n(the, next) / n(the).\n# جرّب: أضف جملة جديدة إلى النص وأعد التشغيل — أي الرموز تسقط إلى <unk> عند min_freq=3؟\n# try: append a new sentence and rerun - which tokens fall to <unk> at min_freq=3?\n",
      prompt: {
        ar: 'الملعب يفحص أثر عتبة التردد min_freq على حجم المفردات: بلا عتبة 9 رموز، وعند min_freq=2 يبقى الأساس المتكرر فقط، وعند 3 لا يبقى فوق <unk> إلا «the». هذه هي المقايضة نفسها التي تديرها عند بناء أي مفردات: عتبة أعلى = مفردات أصغر = مزيد من الرموز تسقط إلى <unk>.',
        en: 'The sandbox probes how the min_freq threshold reshapes a vocabulary: with no threshold 9 tokens survive, min_freq=2 keeps only the repeated core, and min_freq=3 leaves just "the" above <unk>. This is the same trade-off you manage in any real vocabulary: higher threshold = smaller vocabulary = more tokens fall to <unk>.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في النمذجة الذاتية الانحدارية P(x_t | x_{t-1}, ..., x_1)، ما الصعوبة الأساسية في استعمال كامل التاريخ كمدخلات؟',
            en: 'In autoregressive modeling P(x_t | x_{t-1}, ..., x_1), what is the core difficulty of using the entire history as inputs?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد المدخلات يتغير مع t، بينما النماذج المعتادة تريد متجهًا بطول ثابت', en: 'The input count grows with t, while ordinary models expect a fixed-length vector' } },
            { id: 'b', text: { ar: 'التاريخ كله متماثل إحصائيًا فلا يحمل معلومة', en: 'The whole history is statistically identical and carries no information' } },
            { id: 'c', text: { ar: 'لا يمكن حساب P للرموز المنفصلة', en: 'P cannot be computed for discrete tokens' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل خطوة جديدة تضيف مدخلًا، فيتغير شكل المسألة مع الزمن. الحلان المعتادان: تثبيت نافذة بطول τ (افتراض Markov) أو تلخيص الماضي في حالة خفية h_t — وهو ما تبنيه RNN.',
            en: 'Each new step adds an input, so the problem\u2019s shape changes over time. The classic fixes: fix a window of \u03c4 steps (a Markov assumption) or summarize the past in a latent state h_t \u2014 which is what RNNs build.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'متى نقول إن متتالية تحقق خاصية Markov من الرتبة الأولى؟',
            en: 'When does a sequence satisfy a first-order Markov condition?',
          },
          options: [
            { id: 'a', text: { ar: 'حين تكون الخطوات مستقلة تمامًا', en: 'When the steps are fully independent' } },
            { id: 'b', text: { ar: 'حين تكفي الخطوة السابقة وحدها: P(x_t | x_{t-1}, ..., x_1) = P(x_t | x_{t-1})', en: 'When the previous step alone suffices: P(x_t | x_{t-1}, ..., x_1) = P(x_t | x_{t-1})' } },
            { id: 'c', text: { ar: 'حين يكون طول المتتالية 1', en: 'When the sequence length is 1' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'خاصية Markov من الرتبة τ تعني أن المستقبل مستقل عن الماضي البعيد بمعلومية أقرب τ خطوة؛ وعند τ=1 يكفي x_{t-1} وحده — وهذا يسمح بتفكيك P(x_1..x_T) جداءً لشرطيات ثنائية.',
            en: 'A \u03c4th-order Markov condition means the future is independent of the distant past given the nearest \u03c4 steps; at \u03c4=1, x_{t-1} alone suffices \u2014 letting P(x_1..x_T) factor into a product of pairwise conditionals.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'تنبأت 4 خطوات للأمام بلصق كل تنبؤ في المدخلات (كما في مثال الأسعار). ما المتوقع لجودة التنبؤات البعيدة؟',
            en: 'You predict 4 steps ahead by feeding each prediction back as an input (like the price example). What happens to far-ahead predictions?',
          },
          options: [
            { id: 'a', text: { ar: 'تتحسن لأن النموذج يرى المزيد من البيانات', en: 'They improve because the model sees more data' } },
            { id: 'b', text: { ar: 'تتراكم الأخطاء خطوة بعد خطوة فتتدهور الجودة بسرعة', en: 'Errors accumulate step after step, so quality degrades quickly' } },
            { id: 'c', text: { ar: 'تبقى مطابقة تمامًا للتنبؤ أحادي الخطوة', en: 'They stay identical to the one-step prediction' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كل خطوة تُدخل خطأ الخطوة السابقة في الحساب، فيتكاكم الخطأ (ε ثم ε+cε ثم …) — النموذج ليس المشكلة بل التنبؤ متعدد الخطوات نفسه. لهذا تُبنى نماذج بحالة تُحدَّث بدل إعادة لصق التنبؤات.',
            en: 'Each step injects the previous step\u2019s error into the computation, so errors compound (\u03b5, then \u03b5+c\u03b5, ...) \u2014 the model is fine, multi-step prediction itself is the problem. Hence models with an updated state rather than re-fed predictions.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المتتاليات لا تستقل خطواتها: نمذجة P(x_t | الماضي) تحتاج إما نافذة Markov ثابتة أو حالة خفية تُحدَّث خطوة بخطوة، والتنبؤ البعيد k خطوات يفقد جودته لأن الأخطاء تتراكم (الهدف من s1 التعامل مع المتتاليات).', en: 'Sequence steps are not independent: modeling P(x_t | past) needs either a fixed Markov window or an updated latent state, and k-step-ahead prediction degrades because errors accumulate (goal of s1 Working with Sequences).' },
        { ar: 'النص يصير أرقامًا بأربع خطوات: تنظيف، تقطيع (حروف/كلمات)، مفردات مع <unk>، ثم ترميز بلا فقد — وقانون Zipf يفسر لماذا لا يكفي العدّ وحده ويدفعنا نحو نماذج تتعلم التمثيلات (الهدف من s2 تحويل النص الخام إلى بيانات متتالية).', en: 'Text becomes numbers in four steps: clean, tokenize (chars/words), build a vocabulary with <unk>, then encode losslessly \u2014 and Zipf\u2019s law explains why counting alone fails, pushing us to models that learn representations (goal of s2 Converting Raw Text into Sequence Data).' },
      ],
      reflectPrompt: {
        ar: 'لو بنيت لوحة إكمال تلقائي للعربية: أي تقطيع تختار (حروف/كلمات/قطع كلمات) ولماذا؟ وعند أي تردد تضع عتبة المفردات؟',
        en: 'If you built an Arabic autocomplete: which tokenization would you pick (characters / words / word pieces) and why? And where would you set the vocabulary frequency threshold?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch9.s1' },
        { book: 'D2L', section: 'd2l.ch9.s2' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch9.s1' },
    { book: 'D2L', section: 'd2l.ch9.s2' },
  ],
} satisfies Lesson;

export default lesson;
