import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch15.l4 — "BERT Pretraining Data and the Two Losses"
 * بيانات التدريب المسبق لـ BERT والخسارتان
 * Aligned with D2L ch15 s9 (The Dataset for Pretraining BERT) + s10
 * (Pretraining BERT). All expression is original — a paraphrase of the
 * source's ideas, never a verbatim translation. Runnable design: NSP pair
 * labels from a fixed 3-sentence paragraph (one swap as a literal), MLM
 * masking at FIXED positions with a fixed 80/10/10 action list, and the
 * combined loss = mlm + nsp from fixed logits. Every literal verified under
 * CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch15.l4',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 15,
  title: {
    ar: 'بيانات التدريب المسبق لـ BERT والخسارتان',
    en: 'BERT Pretraining Data and the Two Losses',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch15.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'عندنا معمارية BERT — فمن يعلّمها؟ مهمتان ذاتيتان الإشراف تعملان في آن واحد: masked language modeling تخمئن الرموز المحجوبة من سياقها ثنائي الاتجاه، وnext sentence prediction تحكم إن كانت الجملة الثانية تالية فعلية للأولى. في هذا الدرس نبني أمثلة التدريب يدويا من فقرة ثابتة: أزواج NSP بتسمياتها، ومواضع الحجب الثابتة بأفعالها 80/10/10، ثم نجمع الخسارتين في رقم واحد كما تفعل حلقة التدريب المسبق تماما.',
        en: 'We have the BERT architecture — so who teaches it? Two self-supervised tasks run at once: masked language modeling guesses blocked tokens from their bidirectional context, and next sentence prediction judges whether the second sentence truly follows the first. In this lesson we hand-build training examples from a fixed paragraph: NSP pairs with their labels, fixed mask positions with their 80/10/10 actions, then combine both losses into one number exactly as the pretraining loop does.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من فقرة إلى أمثلة، ومن مثالين إلى خسارة واحدة', en: 'From paragraph to examples, from two losses to one' },
      chunks: [
        {
          ar: 'المدخل المعتاد PTB كان مقطوعا من علاماته؛ BERT يحتاج نصا يحفظ الجُمل ليعمل NSP، لذا يستخدم الكتاب WikiText-2: فقرات تحتفظ بعلامات الترقيم وحالة الأحرف، وتُقتطع الجمل بفاصل « . ». من كل فقرة نولد أمثلة NSP: لكل زوج متجاور نحكم بالتساوي — إما أن يبقى الجار التالي الحقيقي بتسمية True أو يستبدل بجملة تعسفية من الفقرات بتسمية False. الزوج الذي يتجاوز طول المدخل الأقصى يُهمل: تذكّر أن <cls> و<sep> يأخذان 3 مواضع. ثم تُرمَّز كل عينة بـ <cls>+a+<sep>+b+<sep> مع قطع 0/1.',
          en: 'The old PTB input had its punctuation stripped; BERT needs text that preserves sentence boundaries for NSP, so the book uses WikiText-2: paragraphs keeping punctuation and case, split into sentences on « . ». From each paragraph we generate NSP examples: every adjacent pair is decided fifty-fifty — either the true follower with label True, or an arbitrary sentence from the corpus with label False. Pairs exceeding the max input length are skipped: remember <cls> and <sep> already take 3 positions. Each example is then encoded as <cls>+a+<sep>+b+<sep> with segments 0/1.',
        },
        {
          ar: 'للتنبؤ بالرموز المحجوبة نختار 15% من رموز المدخل للتنبؤ بها، وعند كل موضع مختار واحد من ثلاث أفعال: 80% يستبدل بـ <mask>، و10% يستبدل برمز آخر من المفردات، و10% يبقى دون تغيير — الخلط الأخير يمنع النموذج من افتراض أن ما لا يحمل <mask> مضمون الصحة. التسمية دائمًا الرمز الأصلي، وpred_positions تسجل المواضع، وmlm_weights تساوي 1 عند المواضع المختارة و0 عند الحشو. ترويسة MLM صغيرة تعيد إسقاط تمثيل الموضع على المفردات كلها، بينما ترويسة NSP تقرأ تمثيل <cls> فقط وتصنف ثنائيا.',
          en: 'For token prediction we choose 15% of the input tokens, and at each chosen position one of three actions applies: 80% become <mask>, 10% are swapped for another vocabulary token, and 10% stay unchanged — the last mix stops the model from assuming anything unmasked must be correct. The label is always the original token, pred_positions records the spots, and mlm_weights are 1 at chosen positions and 0 at padding. A small MLM head re-projects a position representation onto the whole vocabulary, while the NSP head reads only the <cls> representation and classifies binary.',
        },
        {
          ar: 'التدريب المسبق يجمع الخسارتين مجموعا: l = mlm_l + nsp_l، حيث mlm_l متوسط إنتروبيا متقاطعة على المواضع المحجوبة الموزونة، وnsp_l إنتروبيا متقاطعة على <cls>. النموذج الأصلي بنسختين: base بـ 12 طبقة و768 وحدة خفية و12 رأسا (110 مليون معامل) وlarge بـ 24 و1024 و16 (340 مليونا)؛ وللعرض تُدرَّب نسخة صغيرة 2 طبقة و128 وحدة ورأسان. التدريب يُقاس بخطوات لا بعصور، والمحسِّن adam بمعدل 0.01 — والهدف أن تخرج المعاملات صالحة للضبط الدقيق في ch16.',
          en: 'Pretraining adds the two losses: l = mlm_l + nsp_l, where mlm_l is the weighted mean cross-entropy over masked positions and nsp_l the cross-entropy on <cls>. The original model shipped in two sizes: base with 12 layers, 768 hidden units, 12 heads (110M parameters) and large with 24, 1024, 16 (340M); for demonstration a small BERT with 2 layers, 128 units, 2 heads is trained. Training counts steps rather than epochs, the optimizer is adam at rate 0.01 — and the goal is parameters ready for the fine-tuning of ch16.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'أزواج NSP بتسمياتها + حجب بمواضع ثابتة + الخسارة الكلية',
        en: 'NSP pairs with labels + masking at fixed positions + the total loss',
      },
      code: "import math\n\ndef softmax(xs):\n    m = max(xs)\n    es = [math.exp(x - m) for x in xs]\n    s = sum(es)\n    return [e / s for e in es]\n\ndef ce(logits, label):\n    return -math.log(softmax(logits)[label])\n\ndef get_tokens_and_segments(a, b):\n    tokens = ['<cls>'] + a + ['<sep>'] + b + ['<sep>']\n    segments = [0] * (len(a) + 2) + [1] * (len(b) + 1)\n    return tokens, segments\n\npara = [['i', 'love', 'deep', 'learning'], ['it', 'is', 'fun'], ['i', 'code', 'daily']]\nfor a, b, is_next in [(para[0], para[1], True),\n                      (para[1], para[2], True),\n                      (para[0], para[2], False)]:\n    toks, segs = get_tokens_and_segments(a, b)\n    print('is_next=%-5s len=%d segs=%s' % (is_next, len(toks), segs))\n\ntokens, segments = get_tokens_and_segments(para[0], para[1])\nprint('pair tokens:', tokens)\n\n# MLM at fixed positions [2, 4, 7]: mask / keep / replace (80/10/10 demo)\npositions, actions, repl = [2, 4, 7], ['mask', 'keep', 'replace'], 'code'\nmasked = list(tokens)\nlabels, weights = [], []\nfor p, act in zip(positions, actions):\n    labels.append(tokens[p])\n    weights.append(1)\n    if act == 'mask':\n        masked[p] = '<mask>'\n    elif act == 'replace':\n        masked[p] = repl\nprint('masked:', masked)\nprint('labels:', labels, 'weights:', weights)\n\n# cross-entropy of a (small) MLM head + NSP head on fixed logits\nvocab = ['<pad>', '<mask>', '<cls>', '<sep>', 'i', 'love', 'deep', 'learning',\n         'code', 'fun', 'is']\nlab_idx = [vocab.index(t) for t in labels]\nlogits = [[0.1, 0.0, 0.2, 0.0, 0.3, 2.5, 0.4, 0.1, 0.2, 0.0, 0.0],\n          [0.0, 0.0, 0.1, 0.0, 0.2, 0.3, 0.4, 2.0, 0.1, 0.0, 0.0],\n          [0.0, 0.1, 0.0, 0.0, 0.2, 0.1, 0.3, 0.2, 0.0, 0.0, 2.2]]\nmlm_l = sum(ce(logits[k], lab_idx[k]) for k in range(3))\nnsp_l = ce([0.2, 1.8], 1)\nprint('label ids:', lab_idx)\nfor k in range(3):\n    print('ce pos %d = %.9f' % (k, ce(logits[k], lab_idx[k])))\nprint('mlm_l=%.9f nsp_l=%.9f total=%.9f' % (mlm_l, nsp_l, mlm_l + nsp_l))",
      explanation: {
        ar: 'الفقرة الثابتة تعطي ثلاث عينات: (الجملة 0، الجملة 1) طولهما 10 رموز بتسمية True، و(1، 2) بطول 9 وTrue، ثم البديل المتعمَّد (0، 2) بطول 10 بتسمية False — التسمية معطاة حرفيا لا بسحب. الحجب على المواضع 2 و4 و7: love يصبح <mask>، وlearning يبقى (فعل keep)، وis يستبدل بـ code، والتسميات دائمًا الأصلية [love, learning, is] بمعرفات [5, 7, 10]. الخسارات: 0.664517831 و0.926515316 و0.797132276 فيكون mlm_l = 2.388165424، وnsp_l = 0.183900741 لأن لوغيتات <cls> توحي بقوة بأن الزوج تال، فالمجموع 2.572066165 — هذا الرقم هو ما تقلّله خطوة adam في التدريب المسبق.',
        en: 'The fixed paragraph yields three examples: (sentence 0, sentence 1) of length 10 with label True, (1, 2) of length 9 with True, then the deliberate non-follower (0, 2) of length 10 with label False — labels given literally, not drawn. Masking at positions 2, 4, 7: love becomes <mask>, learning stays (the keep action), is is replaced by code, and the labels are always the originals [love, learning, is] with ids [5, 7, 10]. The losses: 0.664517831, 0.926515316, 0.797132276 give mlm_l = 2.388165424, and nsp_l = 0.183900741 since the <cls> logits lean strongly toward a true follower, totaling 2.572066165 — the number an adam step chips away during pretraining.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.nsp-mlm-builders',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفذ دالتين كما في الكتاب: get_tokens_and_segments(tokens_a, tokens_b=None) تعيد (tokens, segments) لتسلسل مدخل BERT — لجملة مفردة: <cls>+a+<sep> وقطع أصفار، ولزوج: <cls>+a+<sep>+b+<sep> وأصفار لقطعة A وآحاد لقطعة B؛ وapply_mlm(tokens, positions, actions, repl) تعيد (masked, labels, weights) حيث الفعل mask يضع <mask>، وkeep يبقي الأصل، وreplace يضع repl، والتسميات هي الرموز الأصلية دائمًا وweights واحدة عند كل موضع مختار.',
        en: 'Implement two helpers as in the book: get_tokens_and_segments(tokens_a, tokens_b=None) returning (tokens, segments) for a BERT input sequence — a single text: <cls>+a+<sep> with zero segments; a pair: <cls>+a+<sep>+b+<sep> with zeros for segment A and ones for segment B; and apply_mlm(tokens, positions, actions, repl) returning (masked, labels, weights) where action mask sets <mask>, keep leaves the original, replace sets repl, labels are always the original tokens, and weights are 1 at every chosen position.',
      },
      starterCode: "def get_tokens_and_segments(tokens_a, tokens_b=None):\n    # TODO: build the BERT input sequence and 0/1 segment ids\n    ...\n\ndef apply_mlm(tokens, positions, actions, repl):\n    # TODO: return (masked_tokens, labels, weights)\n    ...\n",
      solution: "def get_tokens_and_segments(tokens_a, tokens_b=None):\n    if tokens_b is None:\n        tokens = ['<cls>'] + tokens_a + ['<sep>']\n        segments = [0] * len(tokens)\n    else:\n        tokens = ['<cls>'] + tokens_a + ['<sep>'] + tokens_b + ['<sep>']\n        segments = [0] * (len(tokens_a) + 2) + [1] * (len(tokens_b) + 1)\n    return tokens, segments\n\ndef apply_mlm(tokens, positions, actions, repl):\n    masked = list(tokens)\n    labels, weights = [], []\n    for p, act in zip(positions, actions):\n        labels.append(tokens[p])\n        weights.append(1)\n        if act == 'mask':\n            masked[p] = '<mask>'\n        elif act == 'replace':\n            masked[p] = repl\n    return masked, labels, weights",
      tests: [
        {
          id: 't1',
          name: { ar: 'جملة مفردة: طول n+2 وقطع أصفار', en: 'Single text: length n+2 with zero segments' },
          code: "t, s = get_tokens_and_segments(['i', 'love', 'deep', 'learning'])\nassert len(t) == 6 and t[0] == '<cls>' and t[-1] == '<sep>', 'expected 6 tokens with <cls>..<sep> | got %r' % (t,)\nassert s == [0, 0, 0, 0, 0, 0], 'single text must be all segment 0 | got %r' % (s,)",
          expected: '6 tokens, segments all 0',
        },
        {
          id: 't2',
          name: { ar: 'زوج جمل: أصفار لقطعة A وآحاد لقطعة B', en: 'Sentence pair: zeros for A, ones for B' },
          code: "t, s = get_tokens_and_segments(['i', 'love', 'deep', 'learning'], ['it', 'is', 'fun'])\nassert len(t) == 10 and t == ['<cls>', 'i', 'love', 'deep', 'learning', '<sep>', 'it', 'is', 'fun', '<sep>'], 'unexpected token layout | got %r' % (t,)\nassert s == [0, 0, 0, 0, 0, 0, 1, 1, 1, 1], 'expected 6 zeros then 4 ones | got %r' % (s,)",
          expected: "10 tokens, [0]*6 + [1]*4",
        },
        {
          id: 't3',
          name: { ar: 'الحجب: الأفعال الثلاثة وتسميات أصلية', en: 'Masking: the three actions with original labels' },
          code: "tokens = ['<cls>', 'i', 'love', 'deep', 'learning', '<sep>', 'it', 'is', 'fun', '<sep>']\nmasked, labels, weights = apply_mlm(tokens, [2, 4, 7], ['mask', 'keep', 'replace'], 'code')\nassert masked[2] == '<mask>' and masked[4] == 'learning' and masked[7] == 'code', 'actions must apply exactly | got %r' % (masked,)\nassert labels == ['love', 'learning', 'is'] and weights == [1, 1, 1], 'labels must be the originals | got %r %r' % (labels, weights)",
          expected: "['love', 'learning', 'is'], weights [1,1,1]",
        },
      ],
      hints: [
        { ar: 'في الزوج: طول قطعة A هو len(tokens_a) + 2 (لأن <cls> و<sep> معها) — ابدأ من هناك الآحاد.', en: 'For a pair: segment A spans len(tokens_a) + 2 (its <cls> and <sep> included) — the ones start right after.' },
        { ar: 'في apply_mlm انسخ القائمة أولا (masked = list(tokens)) حتى لا تتلف الأصول التي تحتاجها التسميات.', en: 'In apply_mlm copy the list first (masked = list(tokens)) so the originals needed for labels stay intact.' },
        { ar: 'استخدم zip(positions, actions) وامنح الحالات الثلاث بأمر if/elif — الحالة keep لا تحتاج أي تعديل.', en: 'Use zip(positions, actions) and branch over the three cases with if/elif — the keep case needs no edit at all.' },
        { ar: 'قيم تحقق: الزوج أعلاه يعطي 10 رموز و[0]*6+[1]*4، وlabels هي tokens[p] دائمًا بغض النظر عن الفعل.', en: 'Sanity values: the pair above gives 10 tokens and [0]*6+[1]*4, and labels are always tokens[p] regardless of the action.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-mlm-strategy',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'عند اختيار 15% من رموز المدخل لمهمة MLM، كيف تُعالج هذه المواضع المختارة؟',
        en: 'Having chosen 15% of input tokens for the MLM task, how are those chosen positions treated?',
      },
      options: [
        { id: 'a', text: { ar: '80% تستبدل بـ <mask> و10% برمز آخر من المفردات و10% تبقى دون تغيير', en: '80% become <mask>, 10% are swapped for another vocabulary token, 10% stay unchanged' } },
        { id: 'b', text: { ar: 'كلها تستبدل بـ <mask> دائمًا لوضوح المهمة', en: 'They all become <mask> for task clarity' } },
        { id: 'c', text: { ar: 'نصفها يُحذف من التسلسل كليا ونصفها يبقى', en: 'Half are deleted from the sequence entirely and half remain' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'اسأل نفسك: ماذا لو عرف النموذج أن كل موضع غير <mask> صحيح بالضرورة؟', en: 'Ask yourself: what if the model knew every position without <mask> was necessarily correct?' },
        { ar: 'فعل keep في مثالنا هو الموضع 4: بقي learning ظاهرا ومع ذلك عليه تسمية وأداء تنبؤ.', en: 'The keep action in our example is position 4: learning stayed visible yet still gets a label and a prediction.' },
        { ar: 'فعل replace (10%) يمنع أن يرتبط التنبؤ بمظهر <mask> حصريا — استبدالنا is بـ code في الموضع 7.', en: 'The replace action (10%) keeps prediction from hinging on the <mask> look alone — we swapped is for code at position 7.' },
        { ar: 'الجواب: a — خليط 80/10/10 هو الموازنة المعروفة لتدريب MLM.', en: 'Answer: a — the 80/10/10 mix is the well-known MLM recipe.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef softmax(xs):\n    m = max(xs)\n    es = [math.exp(x - m) for x in xs]\n    s = sum(es)\n    return [e / s for e in es]\n\ndef ce(logits, label):\n    return -math.log(softmax(logits)[label])\n\ndef bert_loss(mlm_rows, lab_idx, nsp_logits, nsp_label):\n    mlm_l = sum(ce(mlm_rows[k], lab_idx[k]) for k in range(len(lab_idx)))\n    nsp_l = ce(nsp_logits, nsp_label)\n    return mlm_l, nsp_l, mlm_l + nsp_l\n\nrows_a = [[0.1, 0.0, 0.2, 0.0, 0.3, 2.5, 0.4, 0.1, 0.2, 0.0, 0.0],\n          [0.0, 0.0, 0.1, 0.0, 0.2, 0.3, 0.4, 2.0, 0.1, 0.0, 0.0],\n          [0.0, 0.1, 0.0, 0.0, 0.2, 0.1, 0.3, 0.2, 0.0, 0.0, 2.2]]\nprint('trained-ish:', ['%.9f' % v for v in bert_loss(rows_a, [5, 7, 10], [0.2, 1.8], 1)])\nrows_b = [[2.5 if k == i else 0.0 for k in range(11)] for i in (5, 7, 10)]\nprint('one-hot head:', ['%.9f' % v for v in bert_loss(rows_b, [5, 7, 10], [0.2, 1.8], 1)])\n\n# try: make nsp_logits [1.8, 0.2] (wrong confidence) - how big is nsp_l now?\n# try: zero out one mlm row and watch which of the two losses dominates the total.\n",
      prompt: {
        ar: 'الملعب يقارن ترويسة MLM «شبه مدرَّبة» بأخرى واثقة تماما (لوغيتات one-hot): لاحظ كيف يهبط mlm_l لكن nsp_l يبقى كما هو لأنها ترويسة مستقلة تقرأ <cls> — خسارتان مستقلتان يجمعان في رقم واحد. ثم اقلب ثقة NSP وراقب الانفجار في nsp_l.',
        en: 'The sandbox compares a "trained-ish" MLM head with a fully confident one (one-hot logits): watch mlm_l plummet while nsp_l stays put because it is an independent head reading <cls> — two separate losses summed into one number. Then flip the NSP confidence and watch nsp_l explode.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يعتمد الكتاب WikiText-2 بدل PTB لبيانات التدريب المسبق لـ BERT؟',
            en: 'Why does the book use WikiText-2 instead of PTB for BERT pretraining data?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يحافظ على علامات الترقيم وحالة الأحرف ويحتفظ بالفقرات، وهذا لازم لمهمة NSP وتقسيم الجمل', en: 'It preserves punctuation, case, and paragraph structure, which NSP and sentence splitting need' } },
            { id: 'b', text: { ar: 'لأن أصغر حجما يسمح بحذف رموز <cls> و<sep>', en: 'Because its smaller size lets us drop <cls> and <sep> tokens' } },
            { id: 'c', text: { ar: 'لأنه يحتوي مقاطع فيديو مشروحة للنماذج', en: 'Because it contains explainer videos for the models' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'NSP يقارن جملتين متتاليتين، فلو حُذفت علامات النهاية كما في PTB لضاع معنى «الجملة التالية». WikiText-2 يحفظ الترقيم والأحرف ويكفي تقسيمه بـ « . »، وهو أكبر من PTB بأكثر من الضعف.',
            en: 'NSP compares consecutive sentences, so with PTB-style stripped punctuation the notion of "next sentence" collapses. WikiText-2 keeps punctuation and case, splits on « . », and is over twice as large as PTB.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في أمثلة NSP، ما تسمية الزوج الذي استُبدلت جملته الثانية بجملة من مكان آخر في النص؟',
            en: 'In NSP examples, what is the label of a pair whose second sentence was replaced by one from elsewhere in the corpus?',
          },
          options: [
            { id: 'a', text: { ar: 'False — الزوجان متجاوران في النص الأصلي بنسبة 50% فقط من الأمثلة', en: 'False — only about 50% of examples are true adjacent pairs' } },
            { id: 'b', text: { ar: 'True دائمًا لأن الجملتين من النص نفسه', en: 'Always True because both sentences come from the same corpus' } },
            { id: 'c', text: { ar: 'تسمية ثالثة تشير إلى عدم اليقين', en: 'A third label denoting uncertainty' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التوليد يقسم الأمثلة نصفين: الجار الحقيقي بتسمية True والشريك البديل بتسمية False — في مثالنا (para[0], para[2]) بطول 10 كتبنا له False حرفيا. الترويسة تصنف ثنائيا على تمثيل <cls>.',
            en: 'Generation splits examples in half: the true follower is labeled True and the stand-in False — in our example (para[0], para[2]) of length 10 we wrote False literally. The head classifies binary over the <cls> representation.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'كيف تُجمع خسارتا التدريب المسبق في حلقة train_bert؟',
            en: 'How are the two pretraining losses combined in the train_bert loop?',
          },
          options: [
            { id: 'a', text: { ar: 'المجموع المباشر: l = mlm_l + nsp_l حيث mlm_l موزون بمواضع الحجب وnsp_l على <cls>', en: 'A direct sum: l = mlm_l + nsp_l with mlm_l weighted over masked positions and nsp_l on <cls>' } },
            { id: 'b', text: { ar: 'تُدرَّب المهمتان في عصور متبادلة أولا MLM ثم NSP', en: 'The two tasks train in alternating epochs, first MLM then NSP' } },
            { id: 'c', text: { ar: 'تُؤخذ قيمة العظمى بين الخسارتين في كل خطوة', en: 'The maximum of the two losses is taken at each step' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'دالة _get_batch_loss_bert تعيد mlm_l وnsp_l وl = mlm_l + nsp_l؛ في مثالنا 2.388165424 + 0.183900741 = 2.572066165. كلا الترويسين يتشاركان الترميز فيتعلمان معا من كل دفعة.',
            en: '_get_batch_loss_bert returns mlm_l, nsp_l and l = mlm_l + nsp_l; in our example 2.388165424 + 0.183900741 = 2.572066165. Both heads share the encoder, so each batch teaches both tasks at once.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'بيانات BERT تُبنى من فقرات تحفظ الجمل: أمثلة NSP بزوج متجاور True أو شريك بديل False (بنسبة نصف/نصف) مع تجاهل الأزواج الأطول من الحد، وترميز <cls>+a+<sep>+b+<sep> بقطع 0/1 (الهدف من s9).', en: 'BERT data is built from paragraphs that keep sentences: NSP examples with an adjacent pair labeled True or a stand-in labeled False (half and half), pairs longer than the limit skipped, encoded as <cls>+a+<sep>+b+<sep> with 0/1 segments (goal of s9).' },
        { ar: 'MLM يختار 15% من الرموز ويطبق 80/10/10: <mask> أو رمز بديل أو بلا تغيير، والتسمية دائمًا الأصلية؛ الخسارة الكلية مجموع mlm_l (موزون على المواضع المحجوبة) وnsp_l (على <cls>) — 2.572066165 في مثالنا (الهدف من s9 وs10).', en: 'MLM picks 15% of tokens and applies 80/10/10: <mask>, a substitute token, or no change, with labels always the originals; the total loss is mlm_l (weighted over masked positions) plus nsp_l (on <cls>) — 2.572066165 in our example (goals of s9 and s10).' },
        { ar: 'التدريب المسبق يعد بخطوات لا بعصور: نسخة base أصلية 12 طبقة/768/12 رأسا (110M) وlarge 24/1024/16 (340M)، ونسخة العرض 2/128/2، بمحسّن adam بمعدل 0.01 حتى تخرج معاملات جاهزة للضبط الدقيق (الهدف من s10).', en: 'Pretraining counts steps not epochs: the original base is 12 layers/768/12 heads (110M) and large 24/1024/16 (340M), the demo model 2/128/2, with adam at rate 0.01 until parameters are ready for fine-tuning (goal of s10).' },
      ],
      reflectPrompt: {
        ar: 'لو صممت عينات NSP من فقرة واحدة فيها 4 جمل: كم مثالا تحصل عليه كأقصى تقدير قبل فرز الأطوال، وكيف تضمن التوازن بين True وFalse دون أي سحب؟ وما موضع واحد في مثال MLM لو حُجب يخل تفسير الجملة كلها؟',
        en: 'Given a 4-sentence paragraph: at most how many NSP examples can you harvest before the length filter, and how would you keep the True/False balance without any draw? And which single position in an MLM example, if masked, would garble the whole sentence interpretation?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch15.s9' },
        { book: 'D2L', section: 'd2l.ch15.s10' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch15.s9' },
    { book: 'D2L', section: 'd2l.ch15.s10' },
  ],
} satisfies Lesson;

export default lesson;
