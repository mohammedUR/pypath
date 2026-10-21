import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch10.l3 — "Machine Translation Data and the Encoder–Decoder"
 * بيانات الترجمة الآلية ومعمارية المرمِّز-المفكِّك
 * Aligned with D2L ch10 s5 (Machine Translation and the Dataset) + s6 (The
 * Encoder−Decoder Architecture). All expression is original — a paraphrase of
 * the source's ideas, never a verbatim translation. Runnable design: a tiny
 * English–French pipeline (preprocess, tokenize, <eos>/<pad>/<bos> shift,
 * valid_len) over the book's first sentence pairs; every literal verified
 * under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch10.l3',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 10,
  title: {
    ar: 'بيانات الترجمة الآلية ومعمارية المرمِّز-المفكِّك',
    en: 'Machine Translation Data and the Encoder–Decoder',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch10.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حتى الآن كانت متوالياتنا من جنس واحد: مدخل وطولَه. الترجمة مختلفة: جملة إنجليزية بطول ما، وجوابها الفرنسي بطول آخر، والكلمات لا تقابل بعضها بالترتيب نفسه. هذا نمط «متوالية-إلى-متوالية» يظهر في الحوارات والأسئلة والأجوبة أيضًا. سنبني أنبوب بيانات ترجمة مصغّر بأرقام الكتاب نفسها، ثم نرى المعمارية التي تتعامل مع الأطوال المتغيرة: مرمِّز يلخص، ومفكِّك يولّد كلمة كلمة.',
        en: 'Until now our sequences came in one flavor: an input and its length. Translation is different: an English sentence of one length, a French answer of another, with words not aligned in the same order. This sequence-to-sequence pattern also appears in dialogs and question answering. We will build a miniature translation pipeline using the book\u2019s own sentence pairs, then meet the architecture that handles variable lengths: an encoder that summarizes, and a decoder that generates token by token.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'بيانات ثنائية اللغة، ثم واجهة المرمِّز-المفكِّك', en: 'Bilingual data, then the encoder–decoder interface' },
      chunks: [
        {
          ar: 'مجموعة البيانات إنجليزي-فرنسي من مشروع Tatoeba: كل سطر زوج مفصول بـ tab، المصدر ثم الترجمة. المعالجة المسبقة بسيطة: تحويل الأحرف إلى صغيرة، وإدراج مسافة بين الكلمات وعلامات الترقيم، واستبدال المسافات غير القياسية. التقطيع هنا على مستوى الكلمة (وليس الحرف كما في النمذجة اللغوية)، ونلحق كل متتالية بالرمز الخاص <eos> الذي يخبر المولِّد متى يتوقف. ولأن الأطوال تختلف داخل الدفعة نفسها: نقصّ المتتاليات الطويلة أو نحشوها بـ <pad> حتى طول موحد num_steps، ونسجّل الطول الصحيح للمصدر بلا حشو. الحشو لا يحمل معنى، والرموز النادرة (أقل من مرتين) تصبح <unk> لتصغير المفردات. وللمفكِّك نجهّز المدخل بـ <bos> + الهدف منزاحًا رمزًا واحدًا، والملصقات هي الهدف منزاحًا من الجهة الأخرى.',
          en: 'The dataset is English\u2013French from the Tatoeba project: each line is a tab-separated pair, source then translation. Preprocessing is simple: lowercase everything, insert a space between words and punctuation, replace non-breaking spaces. Tokenization here is word-level (unlike the character-level language modeling of Chapter 9), and every sequence gets a special <eos> token telling a generator when to stop. Because lengths differ inside one minibatch: truncate long sequences or pad short ones with <pad> up to a fixed num_steps, and record the source\u2019s valid length excluding padding. Padding carries no meaning, and tokens occurring fewer than twice become <unk> to shrink the vocabulary. For the decoder we build its input as <bos> + the target shifted by one token, with labels the target shifted the other way.',
        },
        {
          ar: 'المعمارية المكوَّنة من جزأين: المرمِّز يأخذ متتالية متغيرة الطول ويحوّلها إلى «حالة» ذات شكل ثابت — تختصر كل الجملة في تمثيل واحد. والمفكِّك يعمل كنموذج لغوي شرطي: يقرأ الحالة المرمازة والرموز الهدفية المولَّدة حتى الآن، ويتنبأ بالرمز التالي، رمزًا بعد رمز، حتى يُنتج <eos>. من «They are watching .» إلى «Ils regardent .»: ترميز أولًا، ثم توليد. المرمِّز والمفكِّك لا يجب أن يكونا من النوع نفسه — الواجهة فقط هي المعيار: forward للمرمِّز، و init_state + forward للمفكِّك. هذا الفصل سيملأ الواجهة بـ RNN، والفصل القادم باهتمام Bahdanau ثم Transformer.',
          en: 'The architecture has two parts: the encoder takes a variable-length sequence and maps it into a fixed-shape state \u2014 the whole sentence compressed into one representation. The decoder acts as a conditional language model: it reads the encoded state plus the target tokens generated so far and predicts the next token, one at a time, until it emits <eos>. From "They are watching ." to "Ils regardent .": encode first, then generate. Encoder and decoder need not be the same kind of network \u2014 only the interface is the contract: forward for the encoder, init_state + forward for the decoder. This chapter fills the interface with RNNs; the next chapter does it with Bahdanau attention and then the Transformer.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'أنبوب ترجمة مصغّر: من «Go.» إلى دفعة جاهزة للمفكِّك',
        en: 'A miniature translation pipeline: from "Go." to a decoder-ready batch',
      },
      code: "def preprocess(line):\n    line = line.lower()\n    out = []\n    for i, ch in enumerate(line):\n        if ch in ',.!?' and i > 0 and line[i - 1] != ' ':\n            out.append(' ')\n        out.append(ch)\n    return ''.join(out)\n\npairs = [('Go.', 'Va !'), ('Hi.', 'Salut !'), ('Who?', 'Qui ?'),\n         ('Wow!', 'Ça alors !'), ('He is calm .', 'Il est calme .')]\nNUM_STEPS = 6\n\ndef pad(seq, n):\n    return (seq + ['<pad>'] * n)[:n]\n\nfor src, tgt in pairs:\n    s = [t for t in (preprocess(src) + ' <eos>').split(' ') if t]\n    t = [tk for tk in (preprocess(tgt) + ' <eos>').split(' ') if tk]\n    s = pad(s, NUM_STEPS)\n    t = pad(t, NUM_STEPS)\n    full = ['<bos>'] + t          # the book: prepend <bos>, then slice\n    dec_in, label = full[:-1], full[1:]\n    valid_len = sum(1 for tk in s if tk != '<pad>')\n    print('src  :', ' '.join(s), '| valid_len =', valid_len)\n    print('decin:', ' '.join(dec_in))\n    print('label:', ' '.join(label))",
      explanation: {
        ar: 'تتبّع الزوج الأخير: المصدر «He is calm .» يعالج إلى he is calm . فيصير خمسة رموز: he ثم is ثم calm ثم . ثم <eos> بطول صحيح 5 (لا حشو له سوى خانة واحدة). الهدف الفرنسي يصير خمسة رموز + <eos> يُحشى إلى 6، ثم يُسبق بـ <bos> فيتشكل متوالية من 7: dec_in يأخذ أول 6 و label يأخذ آخر 6 — هما التدفق نفسه منزاحًا خانة واحدة: المفكِّك يرى <bos> فيتنبأ il، ثم يرى il فيتنبأ est... وهذا بالضبط تجهيز «forcing المعلم» الذي سيتفصَّل فيه الدرس التالي. لاحظ الأزواج القصيرة: va ! تُحشى بثلاث <pad>، والطول الصحيح 3 يخبر النماذج اللاحقة أين تنتهي الكلمات الحقيقية.',
        en: 'Follow the last pair: "He is calm ." preprocesses to he is calm . and becomes the five tokens he, is, calm, ., <eos> with a valid length of 5 (only one padding slot). The French target becomes five tokens + <eos>, padded to 6, then prefixed with <bos> to form a 7-token stream: dec_in takes the first 6 and label the last 6 \u2014 the same stream shifted by one slot: the decoder sees <bos> and predicts il, then sees il and predicts est... This is exactly the teacher-forcing setup the next lesson details. Note the short pairs: va ! gets three <pad>s, and the valid length 3 tells later models where the real words end.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.build-target',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ build_target(tokens, num_steps) التي تجهّز هدف المفكِّك كما في الكتاب: ألحق <eos>، فاقصّ أو احشُ بـ <pad> حتى num_steps، ثم سبق المتوالية بـ <bos>، وأعد زوج (dec_in, label) — المدخل أول num_steps رمزًا والملصقات آخر num_steps رمزًا.',
        en: 'Implement build_target(tokens, num_steps) preparing the decoder target as the book does: append <eos>, truncate or pad with <pad> up to num_steps, prepend <bos> to the sequence, and return the pair (dec_in, label) \u2014 the input being the first num_steps tokens and the labels the last num_steps tokens.',
      },
      starterCode: "def build_target(tokens, num_steps):\n    ...  # TODO: append <eos>, truncate/pad to num_steps, prepend <bos>, slice\n    return dec_in, label\n\nprint(build_target(['va', '!'], 3))\nprint(build_target(['salut', 'ça', 'alors', '!'], 2))\n",
      solution: "def build_target(tokens, num_steps):\n    seq = (tokens + ['<eos>'])[:num_steps]\n    seq = seq + ['<pad>'] * (num_steps - len(seq))\n    full = ['<bos>'] + seq\n    return full[:-1], full[1:]",
      tests: [
        {
          id: 't1',
          name: { ar: 'هدف قصير: <bos> يدخل المدخل و <eos> يدخل الملصقات', en: 'Short target: <bos> opens the input, <eos> ends the labels' },
          code: "assert build_target(['va', '!'], 3) == (['<bos>', 'va', '!'], ['va', '!', '<eos>']), 'expected shifted pair | actual: %r' % (build_target(['va', '!'], 3),)",
          expected: "(['<bos>', 'va', '!'], ['va', '!', '<eos>'])",
        },
        {
          id: 't2',
          name: { ar: 'هدف أطول من num_steps يُقصَّ بعد <eos>', en: 'A target longer than num_steps is truncated' },
          code: "assert build_target(['salut', 'ça', 'alors', '!'], 2) == (['<bos>', 'salut'], ['salut', 'ça']), 'expected truncation | actual: %r' % (build_target(['salut', 'ça', 'alors', '!'], 2),)",
          expected: "(['<bos>', 'salut'], ['salut', 'ça'])",
        },
        {
          id: 't3',
          name: { ar: 'هدف أقصر يُحشى بـ <pad> في الطرفين', en: 'A shorter target is padded in both views' },
          code: "assert build_target(['va'], 4) == (['<bos>', 'va', '<eos>', '<pad>'], ['va', '<eos>', '<pad>', '<pad>']), 'expected padding | actual: %r' % (build_target(['va'], 4),)",
          expected: "(['<bos>', 'va', '<eos>', '<pad>'], ['va', '<eos>', '<pad>', '<pad>'])",
        },
      ],
      hints: [
        { ar: 'الترتيب مهم: ألحق <eos> أولًا، ثم قصّ إلى num_steps، ثم احشُ بما ينقص، ثم سبق بـ <bos>.', en: 'Order matters: append <eos> first, then truncate to num_steps, then pad the shortage, then prepend <bos>.' },
        { ar: 'بعد إضافة <eos> والقص: seq = (tokens + ["<eos>"])[:num_steps] ثم seq + ["<pad>"] * (num_steps - len(seq)).', en: 'After <eos> and the cut: seq = (tokens + ["<eos>"])[:num_steps] then seq + ["<pad>"] * (num_steps - len(seq)).' },
        { ar: 'المتوالية الكاملة full بطول num_steps + 1 بسبب <bos>؛ والقطع full[:-1] و full[1:] تضمن أن المدخل والملصقات بطول num_steps لكل منهما.', en: 'The full sequence is num_steps + 1 long because of <bos>; the slices full[:-1] and full[1:] make both views exactly num_steps long.' },
        { ar: 'تحقق: build_target(["va"], 4) يعطي dec_in = ["<bos>", "va", "<eos>", "<pad>"] و label = ["va", "<eos>", "<pad>", "<pad>"].', en: 'Sanity check: build_target(["va"], 4) gives dec_in = ["<bos>", "va", "<eos>", "<pad>"] and label = ["va", "<eos>", "<pad>", "<pad>"].' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-valid-len',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يسجّل محمّل البيانات في الكتاب الطول الصحيح للمصدر (عدد الرموز غير المحشوة بـ <pad>) بدل الاكتفاء بالمتوالية المحشوة موحدة الطول؟',
        en: 'Why does the book\u2019s data loader also record the source\u2019s valid length (token count excluding <pad>) instead of relying only on the padded, uniform-length array?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن <pad> لا يحمل معنى: النماذج اللاحقة تحتاج أن تعرف أين تنتهي الرموز الحقيقية كي لا يحصل الحشو على انتباه أو خسارة', en: 'Because <pad> carries no meaning: later models must know where real tokens end so padding gets no attention or loss' } },
        { id: 'b', text: { ar: 'لأن الطول الصحيح يُستخدم لترتيب الجمل أبجديًا داخل الدفعة', en: 'Because the valid length is used to sort sentences alphabetically within a batch' } },
        { id: 'c', text: { ar: 'لأنه يُستعمل لاختيار قيمة num_steps المناسبة لكل دفعة تلقائيًا', en: 'Because it is used to pick each batch\u2019s num_steps automatically' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الحشو أداة حسابية لتوحيد الأشكال داخل المصفوفات، لا معلومة لغوية.', en: 'Padding is a computational device for uniform tensor shapes, not linguistic content.' },
        { ar: 'لو شارك <pad> في الانتباه أو في دالة الخسارة لَشوِّش النموذج بمحتوى فارغ.', en: 'If <pad> participated in attention or in the loss, the model would be distracted by empty content.' },
        { ar: 'الكتاب يقول صراحة إن معلومة الطول بلا حشو «ستحتاجها بعض النماذج لاحقًا» — كطبقات الانتباه التي تُقنَّع.', en: 'The book says explicitly that the length excluding padding will be needed by some models later \u2014 attention layers that get masked.' },
        { ar: 'الجواب: a — الطول الصحيح هو مفتاح التقنيع (masking) الذي سيراه الدرس التالي في الخسارة.', en: 'Answer: a \u2014 the valid length is the key to the masking you will see in the loss next lesson.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "corpus = [['go', '.'], ['hi', '.'], ['run', '.'], ['run', '.'], ['who', '?'], ['wow', '!']]\ncounts = {}\nfor sent in corpus:\n    for tok in sent:\n        counts[tok] = counts.get(tok, 0) + 1\nvocab = sorted(t for t, c in counts.items() if c >= 2)\nprint('counts:', counts)\nprint('kept  :', vocab)\nprint('rest become <unk>:', sorted(t for t, c in counts.items() if c < 2))\n\n# جرّب: غيّر العتبة من 2 إلى 3 — أي رمز يبقى وحده؟\n# try: raise the threshold from 2 to 3 - which single token survives?\n# جرّب: أضف زوجًا سادسًا مثل ['run', '!'] ولاحظ كيف ينقذ 'run' وحده الرمز '!'.\n# try: add a sixth pair like ['run', '!'] and watch 'run' rescue '!' too.\n",
      prompt: {
        ar: 'الملعب يبني مفردات المصدر من أول ستة أزواج في الكتاب بعتبة min_freq=2: فقط «.» (4 مرات) و«run» (مرتان) ينجوان، وكل ما ظهر مرة واحدة يصير <unk> — ستة رموز من ثمانية تذوب! هكذا يكبح الكتاب تضخم المفردات على مستوى الكلمة. لاحظ المقايضة: مفردات أصغر تعني متواليات أقصر لكن معلومات مفقودة.',
        en: 'The sandbox builds the source vocabulary from the book\u2019s first six pairs with min_freq=2: only "." (4 occurrences) and "run" (twice) survive, and every singleton melts into <unk> \u2014 six of eight tokens! That is how the book tames word-level vocabulary growth. Note the trade: a smaller vocabulary means shorter sequences but lost information.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في تجهيز بيانات المفكِّك، ما علاقة مدخله (بعد <bos>) بمجموعة الملصقات؟',
            en: 'In the decoder data preparation, how does its input (after <bos>) relate to the label set?',
          },
          options: [
            { id: 'a', text: { ar: 'هما التدفق الهدف نفسه منزاحًا خانة واحدة: <bos> + الهدف من دون آخر رمز مقابل الهدف كاملًا بـ <eos>', en: 'The same target stream shifted by one slot: <bos> + target-without-last-token vs the full target with <eos>' } },
            { id: 'b', text: { ar: 'مدخل مستقل تمامًا يُقرأ من المصدر الإنجليزي', en: 'A fully separate input read from the English source' } },
            { id: 'c', text: { ar: 'المدخل والملصقات متطابقان رمزًا برمز', en: 'The input and the labels are identical token for token' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يبني مصفوفة الهدف بـ <bos> مسبوقة ثم يأخذ [:, :-1] مدخلًا و [:, 1:] ملصقات — انزياحٌ واحد يجعل كل موضع يتنبأ بالرمز التالي له، كما في النمذجة اللغوية (الفصل 9) لكن بمصدر مشروط.',
            en: 'The book prepends <bos> to the target array and takes [:, :-1] as input and [:, 1:] as labels \u2014 a one-slot shift so every position predicts its next token, as in language modeling (Chapter 9) but now conditioned on a source.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الذي ينتجه المرمِّز بالضبط ليستهلكه المفكِّك؟',
            en: 'What exactly does the encoder hand to the decoder?',
          },
          options: [
            { id: 'a', text: { ar: 'نسخة من المتتالية المصدرية كاملة الرموز', en: 'A copy of the full source sequence, token by token' } },
            { id: 'b', text: { ar: 'حالة ذات شكل ثابت تلخص متتالية متغيرة الطول', en: 'A fixed-shape state summarizing the variable-length sequence' } },
            { id: 'c', text: { ar: 'الترجمة الفرنسية الجاهزة لعرضها', en: 'The finished French translation, ready to display' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'عقد المعمارية: المرمِّز يحوّل متتالية متغيرة الطول إلى حالة موحدة الشكل، والمفكِّك يحوّل الحالة إلى متتالية متغيرة الطول. هذا «عنق الزجاجة» الذي سيعالجه انتباه Bahdanau في الدرس القادم.',
            en: 'The architectural contract: the encoder turns a variable-length sequence into a fixed-shape state, and the decoder turns that state into a variable-length sequence. This bottleneck is what Bahdanau attention tackles next lesson.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'التقطيع على مستوى الكلمة مقارنةً بالحروف (كما في الفصل 9):',
            en: 'Word-level tokenization compared with character-level (as in Chapter 9):',
          },
          options: [
            { id: 'a', text: { ar: 'متواليات أقصر بكثير لكن مفردات أكبر بكثير — تُهدَّأ بـ <unk> للرموز النادرة', en: 'Much shorter sequences but a much larger vocabulary \u2014 tamed by mapping rare tokens to <unk>' } },
            { id: 'b', text: { ar: 'متواليات أطول ومفردات أصغر', en: 'Longer sequences and a smaller vocabulary' } },
            { id: 'c', text: { ar: 'لا فرق في أيٍّ من الاثنين', en: 'No difference in either respect' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكلمة الواحدة رمز واحد فتقصر المتتالية، لكن عدد الكلمات الفريدة يفوق عدد الحروف بمراحل؛ لذلك تعامل الرموز التي تظهر أقل من مرتين كـ <unk> لتصغير المفردة على حساب معلومة طفيفة.',
            en: 'One word is one token so sequences shorten, but unique words vastly outnumber characters; hence tokens appearing fewer than twice become <unk>, shrinking the vocabulary at a minor information cost.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'بيانات الترجمة (الهدف من s5): معالجة مسبقة، تقطيع كلموي مع <eos>، قصّ/حشو إلى num_steps بـ <pad> مع تسجيل الطول الصحيح، <unk> للرموز النادرة، وتجهيز هدف المفكِّك بـ <bos> وانزياح خانة.', en: 'Translation data (goal of s5): preprocessing, word-level tokenization with <eos>, truncate/pad to num_steps with <pad> while recording the valid length, <unk> for rare tokens, and the decoder target built with <bos> and a one-slot shift.' },
        { ar: 'المعمارية (الهدف من s6): المرمِّز يضغط متتالية متغيرة الطول في حالة ثابتة الشكل، والمفكِّك نموذج لغوي شرطي يولّد رمزًا رمزًا حتى <eos> — والواجهة (forward و init_state) هي العقد الوحيد بينهما.', en: 'Architecture (goal of s6): the encoder compresses a variable-length sequence into a fixed-shape state, the decoder is a conditional language model generating until <eos> \u2014 and the interface (forward and init_state) is the only contract between them.' },
        { ar: 'الجسر القادم: الضغط الكامل للجملة في متجه واحد عائق للأطوال الطويلة — الدرس التالي يملأ الواجهة نفسها بـ RNNs ثم يضعف العنق بترميزات انتباه.', en: 'The bridge ahead: squeezing the whole sentence into one vector is the pain of long inputs \u2014 the next lesson fills the same interface with RNNs, then softens the bottleneck with attention.' },
      ],
      reflectPrompt: {
        ar: 'لو كانت دفعتك تضم جملة من 3 كلمات وأخرى من 9 مع num_steps=6: ما الذي سيحدث للأطول، وما المعلومة التي ستحتفظ بها عنها لتعويض الخسارة؟',
        en: 'If your batch mixes a 3-word sentence and a 9-word one with num_steps=6: what happens to the longer one, and what recorded information compensates for the loss?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch10.s5' },
        { book: 'D2L', section: 'd2l.ch10.s6' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch10.s5' },
    { book: 'D2L', section: 'd2l.ch10.s6' },
  ],
} satisfies Lesson;

export default lesson;
