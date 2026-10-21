import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch11.l3 — "The Transformer, ViT, and Pretraining at Scale"
 * المحوّل و ViT والتدريب المسبق واسع النطاق
 * Aligned with D2L ch11 s7 (The Transformer Architecture) + s8 (Transformers
 * for Vision) + s9 (Large-Scale Pretraining with Transformers). All expression
 * is original — a paraphrase of the source's ideas, never a verbatim
 * translation. Runnable design: a Transformer encoder-block shape trace with
 * a parameter census, masked decoder self-attention rows, ViT patch-count
 * math, and the book's pretraining scale table; every literal verified under
 * CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch11.l3',
  version: 1,
  part: 'II',
  track: 'A6',
  book: 'D2L',
  chapter: 11,
  title: {
    ar: 'المحوّل و ViT والتدريب المسبق واسع النطاق',
    en: 'The Transformer, ViT, and Pretraining at Scale',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch11.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل القطع جاهزة: انتباه ذاتي متعدد الرؤوس، ترميز موضعي، وشبكات تغذية. المحوّل يركبها في كتلة واحدة تُكدَّس — بلا طبقة تلافيفية ولا متكررة واحدة — ثم يقفز من الترجمة إلى الصور بتقطيع الصورة كأنها جملة، وأخيرًا إلى عصر ما قبل التدريب: BERT و T5 و GPT تتسابق على المعاملات والرموز وفق قوانين تحجيم قوتية. هذا الدرس يتتبّع الأشكال ويَعُدّ المعاملات ويقرأ جدول السباق.',
        en: 'All the pieces exist: multi-head self-attention, positional encoding, feed-forward networks. The Transformer assembles them into one stackable block \u2014 without a single convolutional or recurrent layer \u2014 then leaps from translation to vision by slicing images like sentences, and finally into the pretraining era: BERT, T5, and GPT racing on parameters and tokens under power-law scaling rules. This lesson traces the shapes, counts the parameters, and reads the race table.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'كتلة المحوّل، ثم بقع الصورة، ثم أوضاع ما قبل التدريب', en: 'The Transformer block, then image patches, then pretraining modes' },
      chunks: [
        {
          ar: 'كتلة المرمِّز لها طبقان فرعيان: تجميع انتباهي ذاتي متعدد الرؤوس ثم شبكة تغذية موضعية (MLP بطبقتين يعمل بالـ MLP نفسه على كل موضع)، وكلٌّ ملفوف بجمع متبقٍّ ثم تسوية طبقية (add & norm). التبقيّ يتطلب sublayer(x) ببُعد x نفسه d، فلا تغيير شكل عبر الكتلة كلها. التسوية الطبقية تطبّع عبر بعد الميزات لكل موضع — ومستقلة عن حجم الدفعة وطوله، لذا تتفوق batch norm في النصوص متغيرة الطول. المفكِّك يضيف طبقة ثالثة: انتباه مرمِّز-مفكِّك تستعلم منه مخرجات المفكِّك عن مخرجات المرمِّز — مع تقنيع ذاتي سببي: كل موضع يرى الماضي والحاضر فقط حفاظًا على الخصوصية التلقائية. وقبل كل شيء تُضرب التضمينات بـ √d لتوازن مدى الترميز الموضعي (بين −1 و 1).',
          en: 'The encoder block has two sublayers: multi-head self-attention pooling, then a positionwise feed-forward network (a two-layer MLP, the same MLP at every position), each wrapped in a residual addition followed by layer normalization (add & norm). Residuals require sublayer(x) to keep x\u2019s dimension d, so the shape never changes across the block. Layer normalization normalizes across the feature dimension per position \u2014 batch-size and length independent, which is why it beats batch norm on variable-length text. The decoder adds a third sublayer, encoder\u2013decoder attention, where decoder outputs query encoder outputs \u2014 with causal masked self-attention: each position sees only past and present, preserving autoregression. Embeddings are also multiplied by \u221ad to balance the positional encoding\u2019s (\u22121, 1) range.',
        },
        {
          ar: 'ViT (Transformers للرؤية) يعامل الصورة كجملة: صورة h×w بـ c قنوات تُقطَّع لبقع p×p فينتج m = h·w/p\u00b2 بقعة، كل منها مسطَّحة إلى متجه طول c·p\u00b2 — والتنفيذ عمليًا التفاف بنواة وخطوة بحجم البقعة. يُضاف رمز <cls> خاص فتصبح المتتالية m+1 متجهًا تُسقط خطيًا وتُجمع مع تضمينات موضعية متعلمة، ثم يمر عليها مرمِّز المحوّل، ويُقرأ تمثيل <cls> — الذي رأى البقع كلها بالانتباه الذاتي — ليتنبأ بالصنف. الفارق البنيوي عن كتلة الدرس: تسوية قبلية (pre-norm) قبل الانتباه والـ MLP وتفعيل GELU. والأهم عمليًا: بلا قابلية الانزياح والجوار التي تمنح CNN، يخسر ViT على البيانات الصغيرة — ويتفوق بفارق كبير فقط عند التدريب على مئات ملايين الصور.',
          en: 'ViT treats an image as a sentence: an h\u00d7w image with c channels is cut into p\u00d7p patches giving m = h\u00b7w/p\u00b2 patches, each flattened to a c\u00b7p\u00b2 vector \u2014 implemented as a convolution whose kernel and stride both equal the patch size. A special <cls> token is prepended so the sequence holds m+1 vectors, linearly projected and summed with learned positional embeddings, passed through a Transformer encoder; the <cls> representation \u2014 which attended to all patches \u2014 predicts the class. Structurally it differs by pre-normalization (before attention and the MLP) and GELU activations. Practically: lacking the translation-invariance and locality priors of CNNs, ViT loses on small datasets \u2014 and wins by a large margin only when trained on hundreds of millions of images.',
        },
        {
          ar: 'ما قبل التدريب الواسع يجعل المحوّل أساسًا لثلاثة أوضاع: encoder-only مثل BERT — نمذجة لغوية مُقنَّعة تتنبأ بالرموز المحجوبة بحصانة ثنائية الاتجاه (كل رمز يرى الجميع)، ثم يُضبط على مهام عبر رمز <cls>؛ encoder–decoder مثل T5 — توحيد كل مهمة كنص-إلى-نص مع تلف مسبق بإعادة تركيب المقاطع المتتالية، والمفكِّك سببي؛ و decoder-only مثل GPT — نمذجة لغوية انحدارية بحوشية سببية تتعلم من كل نص بلا وسوم، وتؤدي المهام بالتعلم في السياق (صفر/واحد/قليل النماذج) دون تحديث معاملات. والسلوك المحجمي قوتي: الأداء يتحسن كقانون قوى مع المعاملات والرموز والحساب معًا — و Chinchilla علّمت أن الرموز تستحق أكثر مما تظن.',
          en: 'Large-scale pretraining makes the Transformer the base for three modes: encoder-only like BERT \u2014 masked language modeling predicting blocked tokens with bidirectional vision (every token sees everyone), fine-tuned via the <cls> representation; encoder\u2013decoder like T5 \u2014 unifying tasks as text-to-text with span-corruption reconstruction, a causal decoder; and decoder-only like GPT \u2014 autoregressive language modeling with a causal mask learning from unlabeled text, performing tasks by in-context learning (zero/one/few-shot) with no parameter update. Scaling behavior is a power law: performance improves smoothly with parameters, tokens, and compute together \u2014 and Chinchilla taught that tokens deserve more credit than assumed.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'تتبّع كتلة المرمِّز: أشكال لا تتغير، وجرد معاملات دقيق',
        en: 'Tracing the encoder block: shapes that never change, an exact parameter census',
      },
      code: "d, ffn, batch, T = 24, 48, 2, 9\nX = (batch, T, d)\nprint('X shape       :', X)\nprint('after attn    :', X, '(multi-head attention preserves the shape)')\nprint('after addnorm :', X, '(residual + layer norm keep it)')\nprint('ffn inner     :', (batch, T, ffn), '-> back to', X)\n\n# parameter census with use_bias=False in attention (the book's default)\nmha = 4 * d * d                    # W_q, W_k, W_v, W_o\nffn_params = d * ffn + ffn + ffn * d + d\nln = 2 * 2 * d                     # gamma + beta for each of two layer norms\nprint('mha params:', mha, '| ffn params:', ffn_params, '| addnorm params:', ln)\nprint('block total:', mha + ffn_params + ln)\n\nimport math\n\ndef softmax(scores):\n    m = max(scores)\n    exps = [math.exp(s - m) for s in scores]\n    return [e / sum(exps) for e in exps]\n\n# decoder self-attention: a query at position 2 may see keys 0..2 only\nscores_row = [0.9, -0.3, 0.6, 0.2]\ndec_valid_len = 3\nmasked = [s if i < dec_valid_len else -1e6 for i, s in enumerate(scores_row)]\nprint('masked row:', [round(x, 4) for x in softmax(masked)])\nprint('plain row :', [round(x, 4) for x in softmax(scores_row)])",
      explanation: {
        ar: 'تتبّع الأشكال هو عقد المحوّل: دخل (2, 9, 24) فخرج (2, 9, 24) — الانتباه الذاتي يقرأ نفسه، والتبقّي والتسوية تحفظان البعد، والـ FFN يتسع داخليًا إلى 48 ثم يعود إلى 24. الجرد: الانتباه المتعدد 4 مصفوفات 24×24 = 2304، وشبكة التغذية 24·48+48+48·24+24 = 2376، والتسويتان الطبقيتان (γ و β لكل بُعد) 96 — المجموع 4776 لكل كتلة، وتُكدَّس الكتل بلا تغيير. أما الصف المقنَّع: استعلام الموضع 2 يرى المفاتيح 0..2 فقط فتختفي درجة المفتاح الرابع عمليًا: [0.4897, 0.1475, 0.3628, 0.0] مقابل [0.3939, 0.1186, 0.2918, 0.1956] بلا تقنيع — هذه هي الحوشية السببية التي تحفظ الانحدارية في مفكِّك GPT.',
        en: 'The shape trace is the Transformer\u2019s contract: in (2, 9, 24), out (2, 9, 24) \u2014 self-attention reads itself, add & norm preserve the dimension, and the FFN swells internally to 48 before returning to 24. The census: multi-head attention is 4 matrices of 24\u00d724 = 2304; the FFN is 24\u00b748+48+48\u00b724+24 = 2376; the two layer norms (\u03b3 and \u03b2 per dimension) add 96 \u2014 4776 per block, stackable without any shape change. The masked row: a query at position 2 may see keys 0..2 only, so the fourth score vanishes effectively: [0.4897, 0.1475, 0.3628, 0.0] versus [0.3939, 0.1186, 0.2918, 0.1956] unmasked \u2014 the causal mask that keeps GPT-style decoders autoregressive.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.vit-patches',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ vit_patch_count(h, w, p, c) التي تعيد ثلاثية: عدد البقع m = (h//p)·(w//p)، وطول متجه البقعة المسطَّحة c·p\u00b2، وطول متتالية المرمِّز مع رمز <cls> (m+1). هذه هي حسابات patch embedding في ViT.',
        en: 'Implement vit_patch_count(h, w, p, c) returning a triple: the patch count m = (h//p)\u00b7(w//p), the flattened patch-vector length c\u00b7p\u00b2, and the encoder sequence length including the <cls> token (m+1). These are the ViT patch-embedding numbers.',
      },
      starterCode: "def vit_patch_count(h, w, p, c):\n    ...  # TODO: m patches, each c*p*p long, plus the <cls> token\n    return m, patch_len, seq_len\n\nprint(vit_patch_count(96, 96, 16, 3))\nprint(vit_patch_count(224, 224, 16, 3))\nprint(vit_patch_count(224, 224, 32, 1))\n",
      solution: "def vit_patch_count(h, w, p, c):\n    m = (h // p) * (w // p)\n    patch_len = c * p * p\n    return m, patch_len, m + 1",
      tests: [
        {
          id: 't1',
          name: { ar: 'مثال الكتاب: صورة 96×16 بقعًا تعطي 36 بقعة ومتتالية 37', en: 'The book\u2019s example: a 96px image with 16px patches gives 36 patches, sequence 37' },
          code: "assert vit_patch_count(96, 96, 16, 3) == (36, 768, 37), 'expected (36, 768, 37) | actual: %r' % (vit_patch_count(96, 96, 16, 3),)",
          expected: '(36, 768, 37)',
        },
        {
          id: 't2',
          name: { ar: 'مقاس ImageNet القياسي 224 مع بقع 16', en: 'The standard ImageNet size 224 with 16px patches' },
          code: "assert vit_patch_count(224, 224, 16, 3) == (196, 768, 197), 'expected (196, 768, 197) | actual: %r' % (vit_patch_count(224, 224, 16, 3),)",
          expected: '(196, 768, 197)',
        },
        {
          id: 't3',
          name: { ar: 'بقع أكبر تعني متتالية أقصر وبقع أطول', en: 'Bigger patches mean a shorter sequence but longer patch vectors' },
          code: "assert vit_patch_count(224, 224, 32, 1) == (49, 1024, 50), 'expected (49, 1024, 50) | actual: %r' % (vit_patch_count(224, 224, 32, 1),)",
          expected: '(49, 1024, 50)',
        },
      ],
      hints: [
        { ar: 'القسمة صحيحة لكل بعد على حدة ثم تُضرب: (h // p) * (w // p) — لا تقسّم المحيطات أولًا.', en: 'Integer-divide each side separately, then multiply: (h // p) * (w // p) \u2014 never divide areas first.' },
        { ar: 'البقعة p×p بعمق c مسطَّحة إلى c * p * p رقمًا.', en: 'A p\u00d7p patch with depth c flattens to c * p * p numbers.' },
        { ar: 'لا تنسَ رمز <cls>: المتتالية m + 1 وليس m.', en: 'Do not forget <cls>: the sequence is m + 1, not m.' },
        { ar: 'تحقق: 224/16 = 14 فالعدد 14·14 = 196، وكل بقعة 3·256 = 768 — والتسوية نفسها في الكتاب مع conv نواة وخطوة 16.', en: 'Sanity: 224/16 = 14 so 14\u00b714 = 196 patches, each 3\u00b7256 = 768 long \u2014 the book realizes the same numbers with a conv of kernel and stride 16.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-pretraining',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود واكتب مخرجه بالضبط سطرًا سطرًا: ثلاثة نماذج مُدرَّبة مسبقًا، وضع كل منها (المعمارية) وأرقام الكتاب التقريبية بالمعاملات (بالمليون) والرموز (بالمليار).',
        en: 'Read the code and write its exact output line by line: three pretrained models, each with its mode (architecture) and the book\u2019s approximate parameter (in millions) and token (in billions) counts.',
      },
      code: "pretraining = [\n    ('BERT', 'encoder-only', 350, 250),\n    ('T5-11B', 'encoder-decoder', 11000, 1000),\n    ('Chinchilla', 'decoder-only', 70000, 1400),\n]\nfor name, mode, params_m, tokens_b in pretraining:\n    print('%s: %s, %dM params, %dB tokens' % (name, mode, params_m, tokens_b))",
      answer: 'BERT: encoder-only, 350M params, 250B tokens\nT5-11B: encoder-decoder, 11000M params, 1000B tokens\nChinchilla: decoder-only, 70000M params, 1400B tokens',
      solution: 'BERT: encoder-only, 350M params, 250B tokens\nT5-11B: encoder-decoder, 11000M params, 1000B tokens\nChinchilla: decoder-only, 70000M params, 1400B tokens',
      hints: [
        { ar: 'BERT نمذجة مقنَّعة ثنائية الاتجاه على مرمِّز وحيد: 350 مليون معامل و250 مليار رمز.', en: 'BERT is bidirectional masked modeling on an encoder only: 350 million parameters, 250 billion tokens.' },
        { ar: 'T5-11B نص-إلى-نص على مرمِّز-مفكِّك: 11 مليار معامل = 11000 مليون، وتريليون رمز = 1000 مليار.', en: 'T5-11B is text-to-text on an encoder\u2013decoder: 11 billion parameters = 11000M, and a trillion tokens = 1000B.' },
        { ar: 'Chinchilla مفكِّك وحيد سببي: 70 مليار معامل و1.4 تريليون رمز — رموز أكثر من Gopher بنموذج أصغر.', en: 'Chinchilla is a causal decoder-only: 70 billion parameters, 1.4 trillion tokens \u2014 more tokens than Gopher on a smaller model.' },
        { ar: 'الصياغة حرفية: الاسم ثم : ثم الوضع، فعدد المعاملات بلا فراغ قبل M، ثم B tokens.', en: 'The format is literal: name, colon, mode, then the parameter count with no space before M, then B tokens.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# the book's reported pretraining runs, on one line each\ntable = [\n    ('BERT', 'encoder-only', 350, 250),\n    ('GPT-2', 'decoder-only', 1500, None),\n    ('T5-11B', 'encoder-decoder', 11000, 1000),\n    ('Megatron-Turing NLG', 'decoder-only', 530000, 270),\n    ('Chinchilla', 'decoder-only', 70000, 1400),\n    ('PaLM', 'decoder-only', 540000, 780),\n]\nfor name, mode, params_m, tokens_b in table:\n    tok = '40 GB of text' if tokens_b is None else '%dB tokens' % tokens_b\n    print('%-21s %-16s %8dM  %s' % (name, mode, params_m, tok))\n\n# جرّب: رتّب الجدول تنازليًا بالرموز — من يتدرب أطول نسبيًا على حجمه؟\n# try: sort the table by tokens descending - who trains longest relative to size?\n",
      prompt: {
        ar: 'الملعب يعرض جدول ما قبل التدريب كما يورد الكتاب: BERT صغير نسبيًا لكن تدريبه ثنائي الاتجاه على 250 مليار رمز؛ GPT-2 (1.5 مليار) على 40 غيغابايت نصًا أطلق التعلم في السياق؛ ثم السباق: 530 مليار لـ Megatron-Turing مقابل 540 مليار لـ PaLM — بينما Chinchilla (70 مليارًا فقط) تتفوق على Gopher الأضخم بتدريب أطول على 1.4 تريليون رمز. قانون القوى يعني أن المعاملات والرموز والحساب يجب أن تكبر معًا — والتحجيم المتوازن قضية مفتوحة.',
        en: 'The sandbox lays out the book\u2019s pretraining table: BERT is comparatively small but bidirectionally trained on 250B tokens; GPT-2 (1.5B) on 40 GB of text launched in-context learning; then the race \u2014 530B for Megatron-Turing vs 540B for PaLM \u2014 while Chinchilla (only 70B) outperforms the much larger Gopher by training longer on 1.4 trillion tokens. The power law says parameters, tokens, and compute must grow together \u2014 and balanced scaling remains an open question.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'كم طبقة فرعية في كتلة مفكِّك المحوّل، وما هي؟',
            en: 'How many sublayers does a Transformer decoder block have, and what are they?',
          },
          options: [
            { id: 'a', text: { ar: 'اثنتان مثل المرمِّز: انتباه ذاتي وشبكة تغذية', en: 'Two, like the encoder: self-attention and a feed-forward network' } },
            { id: 'b', text: { ar: 'ثلاث: انتباه ذاتي مُقنَّع سببيًا، ثم انتباه مرمِّز-مفكِّك، ثم شبكة تغذية موضعية', en: 'Three: causally masked self-attention, then encoder\u2013decoder attention, then a positionwise FFN' } },
            { id: 'c', text: { ar: 'أربع — مع طبقة تسوية دفعية إضافية', en: 'Four \u2014 with an extra batch-norm layer' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المرمِّز طبقتان (انتباه ذاتي + FFN)؛ والمفكِّك يضيف انتباه مرمِّز-مفكِّك بينهما فيصير ثلاثًا، وكل واحدة بتسوية طبقية بعد جمع متبقٍّ — والانتباه الذاتي مُقنَّع سببيًا حفاظًا على التوليد الانحداري.',
            en: 'The encoder has two sublayers (self-attention + FFN); the decoder inserts encoder\u2013decoder attention between them for three, each with a residual add then layer norm \u2014 and the self-attention is causally masked to preserve autoregressive generation.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا يتفوق ResNet على ViT في مجموعات مثل Fashion-MNIST، وينقلب الأمر على البيانات الضخمة؟ (اربط بما تعرفه عن CNN من الفصل 8)',
            en: 'Why does a ResNet beat ViT on datasets like Fashion-MNIST, with the order reversed on massive data? (Link this to what you know of CNNs from Chapter 8)',
          },
          options: [
            { id: 'a', text: { ar: 'لأن ViT يحتاج وحدات معالجة رسومية لا يتوفرها التدريب الصغير', en: 'Because ViT needs GPUs that small-scale training cannot provide' } },
            { id: 'b', text: { ar: 'لأن الالتفاف يحمل مقدَّرات مسبقة (ثبات الانزياح والجوار المحلي) تصغر مساحة البحث على البيانات الصغيرة، بينما يكسب الانتباه النقي قابلية التوسع مع النماذج والبيانات الأضخم', en: 'Because convolution carries priors (translation invariance, local neighborhoods) that shrink the search space on small data, while pure attention scales better with ever larger models and datasets' } },
            { id: 'c', text: { ar: 'لأن ViT لا يستطيع نظريًا معالجة صور رمادية', en: 'Because ViT theoretically cannot process grayscale images' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بلا مبادئ الالتفاف يعلّم ViT كل شيء من الصفر فيحتاج بيانات كثيرة؛ عند 300 مليون صورة تنقلب الموازينة ويختلف بفارق كبير. الكتاب يذكر أيضًا كلفة O(n\u00b2) مع البقع التي تحد الدقة العالية.',
            en: 'Without convolution\u2019s priors ViT learns everything from scratch and needs lots of data; at 300 million images the balance flips by a large margin. The book also notes the O(n\u00b2) cost in patches that limits high resolutions.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'BERT و GPT يتعلمان مسبقًا على النص ذاته: ما الفرق الجوهري في نمط انتباه كل منهما؟ (وقد ضبطت ضبطًا دقيقًا على BERT في درس سابق من هذا المسار)',
            en: 'BERT and GPT both pretrain on raw text: what is the essential difference in their attention patterns? (You fine-tuned BERT earlier in this track)',
          },
          options: [
            { id: 'a', text: { ar: 'BERT مُرمِّز بحصانة ثنائية الاتجاه — كل رمز يرى الجميع ليتنبأ بالمقنَّع؛ و GPT مفكِّك سببي — كل رمز يرى ماضيه فقط ليتنبأ بالقادم', en: 'BERT is a bidirectional encoder \u2014 every token sees everyone to predict the masked ones; GPT is a causal decoder \u2014 each token sees only its past to predict the next' } },
            { id: 'b', text: { ar: 'كلاهما سببي، والفرق في حجم البيانات فقط', en: 'Both are causal; the difference is only data size' } },
            { id: 'c', text: { ar: 'BERT يرى المستقبل و GPT يراه أيضًا عند التدريب', en: 'BERT sees the future and so does GPT during training' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نمذجة BERT المقنَّعة تتطلب رؤية السياق من الجهتين (ثنائية الاتجاه)؛ ونمذجة GPT اللغوية الانحدارية تفرض الحوشية السببية. ولهذا يُضبط BERT على الفهم (تصنيف، NLI — كما في d2l.ch16.l3) ويولّد GPT — والتعلم في السياق بلا تحديث معاملات وراءه.',
            en: 'BERT\u2019s masked modeling requires seeing context from both sides (bidirectional); GPT\u2019s autoregressive modeling imposes the causal mask. Hence BERT is fine-tuned for understanding (classification, NLI \u2014 as in d2l.ch16.l3) while GPT generates \u2014 with in-context learning requiring no parameter update.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المحوّل (الهدف من s7): كتلة من انتباه ذاتي متعدد رؤوس + FFN موضعية، كلٌّ بجمع متبقٍّ وتسوية طبقية، أشكالها ثابتة (الدرس: (2,9,24) داخلًا وخارجًا و4776 معاملًا)؛ والمفكِّك يضيف انتباه مرمِّز-مفكِّك وتقنيعًا سببيًا.', en: 'The Transformer (goal of s7): a block of multi-head self-attention + a positionwise FFN, each with a residual add and layer norm, shapes unchanged (the lesson traced (2,9,24) in and out with 4776 parameters); the decoder adds encoder\u2013decoder attention and a causal mask.' },
        { ar: 'ViT (الهدف من s8): الصورة جملة بقع — m = h·w/p\u00b2 بقعة بطول c·p\u00b2 زائد <cls> — تمر على مرمِّز المحوّل بتسوية قبلية؛ القوة في التحجيم لا في البيانات الصغيرة حيث تفوق CNN المقدَّرات المسبقة.', en: 'ViT (goal of s8): the image becomes a sentence of patches \u2014 m = h\u00b7w/p\u00b2 patches of length c\u00b7p\u00b2 plus <cls> \u2014 through a Transformer encoder with pre-norm; the win is in scaling, not small data where CNN priors prevail.' },
        { ar: 'ما قبل التدريب (الهدف من s9): ثلاثة أوضاع — encoder-only (BERT، نمذجة مقنَّعة)، encoder–decoder (T5، نص-إلى-نص بمقاطع)، decoder-only (GPT، نمذجة انحدارية وتعلم في السياق) — وتحجيم قوتي في المعاملات والرموز والحساب، و Chinchilla تُرجّح الرموز.', en: 'Pretraining (goal of s9): three modes \u2014 encoder-only (BERT, masked modeling), encoder\u2013decoder (T5, text-to-text spans), decoder-only (GPT, autoregressive + in-context learning) \u2014 with power-law scaling in parameters, tokens, and compute, and Chinchilla weighting tokens heavily.' },
      ],
      reflectPrompt: {
        ar: 'لو صممت نسخة ViT لصور طبية 512×512: ما عد البقع عند p=16، وهل ستكفي بيانات مستشفى واحد أم تحتاج تدريبًا مسبقًا واسعًا؟ ولماذا؟',
        en: 'Designing a ViT for 512\u00d7512 medical images: how many patches at p=16, and would one hospital\u2019s data suffice or do you need broad pretraining \u2014 and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch11.s7' },
        { book: 'D2L', section: 'd2l.ch11.s8' },
        { book: 'D2L', section: 'd2l.ch11.s9' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch11.s7' },
    { book: 'D2L', section: 'd2l.ch11.s8' },
    { book: 'D2L', section: 'd2l.ch11.s9' },
  ],
} satisfies Lesson;

export default lesson;
