import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch16.l3 — "Fine-Tuning BERT for Downstream Tasks"
 * الضبط الدقيق لـ BERT للمهام اللاحقة
 * Aligned with D2L ch16 s6 (Fine-Tuning BERT for Sequence-Level and
 * Token-Level Applications) + s7 (Natural Language Inference: Fine-Tuning
 * BERT). All expression is original — a paraphrase of the source's ideas,
 * never a verbatim translation. Runnable design: a BERT pair input for a fixed
 * NLI pair, a dense classification head over the <cls> representation (fixed
 * logits -> softmax -> argmax), and head parameter-count math. Every literal
 * verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch16.l3',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 16,
  title: {
    ar: 'الضبط الدقيق لـ BERT للمهام اللاحقة',
    en: 'Fine-Tuning BERT for Downstream Tasks',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch16.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'تدريبت BERT مسبقا على ملياري كلمة — والآن مهمتك تصنيف أزواج إلى ثلاث فئات. لا تصميم معماري جديد: غلاف BERT يبقى كما هو، وتضيف طبقة كثيفة صغيرة فوق تمثيل <cls> وتدرّبها من الصفر بينما تُعدَّل كل معاملات المرمِّز قليلا. هذا الدرس يفتح صندوق «التغييرات الزهيدة»: تصنيف نص واحد، وتصنيف زوج، وانحدار تشابه دلالي، ووسم رمز برمز وسؤال وجواب — كلها من المرمِّز نفسه.',
        en: 'BERT pretrained on two billion words — and your task is classifying pairs into three classes. No new architecture: the BERT body stays as is, you add a small dense layer on top of the <cls> representation, train it from scratch, while every encoder parameter gets a light update. This lesson opens the "minimal changes" box: single-text classification, pair classification, semantic-textual-similarity regression, token tagging, and question answering — all from the same encoder.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'طبقة صغيرة فوق <cls>، أو فوق كل رمز', en: 'A small layer over <cls>, or over every token' },
      chunks: [
        {
          ar: 'مستوى التسلسل: في تصنيف نص واحد (مثل المشاعر أو CoLA للقبول النحوي) يغذي تمثيل <cls> — الذي تلخص التسلسل كله — شبكة كثيفة صغيرة تُخرج توزيع الفئات. وفي تصنيف أزواج (مثل NLI) المدخل <cls>+a+<sep>+b+<sep> والقرار من <cls> نفسه. ولانحدار التشابه الدلالي (درجات 0..5 في معيار STS) يبقى كل شيء عدا أن المخرج قيمة مستمرة والخسارة تربيعية. الفرق بين المهام: شكل المدخل وعدد مخرجات الطبقة الإضافية فقط.',
          en: 'Sequence level: in single-text classification (sentiment, or CoLA grammatical acceptability) the <cls> representation — which summarizes the whole sequence — feeds a small dense network that outputs the class distribution. In pair classification (like NLI) the input is <cls>+a+<sep>+b+<sep> and the decision still comes from <cls>. For semantic-textual-similarity regression (0..5 scores in the STS benchmark) everything stays except the output becomes a continuous value with squared loss. The differences between tasks: input shape and the number of outputs of the added layer.',
        },
        {
          ar: 'مستوى الرمز: في وسم الكلمات (مثل NER) يُصنَّف تمثيل كل رمز على حدة، وفي الإجابة عن الأسئلة تتنبأ طبقتان صغيرتان بموضع بداية الجواب ونهايته داخل الفقرة لكل رمز. القاعدة واحدة: المعاملات الإضافية (الطبقات الكثيفة) تُتعلم من الصفر، وكل معاملات BERT المُدرَّبة مسبقا تُضبط بالضبط الدقيق أثناء التعلم الموجَّه للمهمة — لا يبقى جمودا. لهذا يحتاج الضبط الدقيق موارد: نسخة base الأصلية 110 مليون معامل وlarge 340 مليونا.',
          en: 'Token level: in word tagging (like NER) every token representation is classified individually, and in question answering two small heads predict the answer start and end positions within the passage per token. The rule is constant: the added parameters (dense layers) are learned from scratch, and all pretrained BERT parameters are fine-tuned during the task supervised learning — nothing stays frozen. This is why fine-tuning needs resources: the original base has 110M parameters and large 340M.',
        },
        {
          ar: 'للمسار العملي: تحمل نسخة مُدرَّبة مسبقا (bert.small للعرض أو bert.base الكاملة) بملف مفردات vocab.json وملف معاملات pretrained.params، ثم تُغذي دفعات SNLI (مقدمات وفرضيات موسومة 0/1/2) إلى المرمِّز نفسه المستخدم في التدريب المسبق، وتُخرج الشبكة الإضافية الفئات الثلاث. الخسارة إنتروبيا متقاطعة اعتيادية، والمحسِّن adam، والتقييم دقة على مجموعة الاختبار. الأثر: أداء يتجاوز نموذج الانتباه اليدوي للدرس السابق بنفس البيانات تقريبا.',
          en: 'For the hands-on path: load a pretrained version (bert.small for demos or the full bert.base) from a vocab.json and a pretrained.params file, feed SNLI batches (premises and hypotheses labeled 0/1/2) through the same encoder used in pretraining, and let the added network output the three classes. The loss is plain cross-entropy, the optimizer adam, and evaluation is test-set accuracy. The payoff: accuracy beyond the previous lesson hand-built attention model on roughly the same data.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'مدخل زوج NLI ورأس تصنيف ثابت وعدّ معاملات الرؤوس',
        en: 'An NLI pair input, a fixed classification head, and head param counts',
      },
      code: "import math\n\ndef softmax(xs):\n    m = max(xs)\n    es = [math.exp(x - m) for x in xs]\n    s = sum(es)\n    return [e / s for e in es]\n\ndef bert_encode_pair(premise, hypothesis):\n    tokens = ['<cls>'] + premise + ['<sep>'] + hypothesis + ['<sep>']\n    segments = [0] * (len(premise) + 2) + [1] * (len(hypothesis) + 1)\n    return tokens, segments\n\ntokens, segments = bert_encode_pair(['a', 'man', 'is', 'running'],\n                                   ['a', 'man', 'is', 'sleeping'])\nprint('tokens:', tokens)\nprint('segments:', segments, 'cls at index', tokens.index('<cls>'))\n\n# the added head: a dense layer over the <cls> representation (toy 2-D)\ncls_vec = [0.4, -0.2]\nW = [[0.0, 0.0], [0.5, -0.5], [0.0, 0.0]]\nb = [0.0, 0.25, 0.0]\nlogits = [sum(wi * x for wi, x in zip(w, cls_vec)) + bb for w, bb in zip(W, b)]\nprobs = softmax(logits)\nprint('logits:', logits)\nprint('probs:', [round(p, 9) for p in probs])\nprint('predicted class:', probs.index(max(probs)),\n      '(0 entailment, 1 contradiction, 2 neutral)')\n\n# head parameter counts: in_features * classes + classes\nfor h, c in [(2, 3), (256, 2), (256, 3)]:\n    print('head %d->%d params = %d' % (h, c, h * c + c))",
      explanation: {
        ar: 'الزوج الثابت يعطي 11 رمزا و[0]×6 ثم [1]×5، و<cls> عند الفهرس 0 — تمثيله هو الذي يقرأ الرأس. الرأس الثابت 3×2 ينتج لوغيتات [0.0, 0.55, 0.0] واحتمالات [0.267862905, 0.464274189, 0.267862905] فيصنف الزوج contradiction باحتمال 0.464274189 — والحقيقة أن الزوج تضاد فعلا. عدّ المعاملات: رأس الدمية 2→3 يعطي 9 معاملات، ورأس المشاعر 256→2 يعطي 514، ورأس NLI في bert.small المخفي 256 يعطي 771 — هذه الطبقات وحدها تُدرَّب من الصفر بينما 256×آلاف يتقاسمون الضبط الدقيق.',
        en: 'The fixed pair gives 11 tokens and [0]×6 then [1]×5, with <cls> at index 0 — its representation is what the head reads. The fixed 3×2 head produces logits [0.0, 0.55, 0.0] and probabilities [0.267862905, 0.464274189, 0.267862905], classifying the pair as contradiction at 0.464274189 — and indeed the pair is a contradiction. Parameter counts: the toy 2→3 head is 9 parameters, the sentiment head 256→2 is 514, and the NLI head over bert.small hidden 256 is 771 — only these layers train from scratch while the 256-wide encoder shares the fine-tuning.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.pair-head',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفذ دالتين: bert_encode_pair(premise, hypothesis) تعيد (tokens, segments) كما في BERT — <cls> ثم المقدمة ثم <sep> ثم الفرضية ثم <sep>، وأصفار لقطعة A وآحاد لقطعة B؛ وpredict(W, b, cls_vec) تعيد (probs, pred) حيث probs تطبيق softmax على W·cls_vec + b وpred فهرس الأعظم. اختبرهما على الزوج الثابت من المثال المطبق.',
        en: 'Implement two functions: bert_encode_pair(premise, hypothesis) returning (tokens, segments) as in BERT — <cls>, premise, <sep>, hypothesis, <sep> with zeros for segment A and ones for segment B; and predict(W, b, cls_vec) returning (probs, pred) where probs is the softmax of W·cls_vec + b and pred is the argmax index. Test both on the fixed pair from the worked example.',
      },
      starterCode: "import math\n\ndef bert_encode_pair(premise, hypothesis):\n    # TODO: build the BERT pair sequence and 0/1 segments\n    ...\n\ndef predict(W, b, cls_vec):\n    # TODO: logits -> stable softmax -> (probs, argmax)\n    ...\n",
      solution: "import math\n\ndef bert_encode_pair(premise, hypothesis):\n    tokens = ['<cls>'] + premise + ['<sep>'] + hypothesis + ['<sep>']\n    segments = [0] * (len(premise) + 2) + [1] * (len(hypothesis) + 1)\n    return tokens, segments\n\ndef predict(W, b, cls_vec):\n    logits = [sum(wi * x for wi, x in zip(w, cls_vec)) + bb\n              for w, bb in zip(W, b)]\n    m = max(logits)\n    es = [math.exp(x - m) for x in logits]\n    s = sum(es)\n    probs = [e / s for e in es]\n    return probs, probs.index(max(probs))",
      tests: [
        {
          id: 't1',
          name: { ar: 'بنية مدخل الزوج وقطعتاه', en: 'Pair input layout and its two segments' },
          code: "t, s = bert_encode_pair(['a', 'man', 'is', 'running'], ['a', 'man', 'is', 'sleeping'])\nassert t[0] == '<cls>' and t.count('<sep>') == 2, 'need <cls> and exactly two <sep> | got %r' % (t,)\nassert s == [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1], '6 zeros then 5 ones | got %r' % (s,)",
          expected: '11 tokens, [0]*6 + [1]*5',
        },
        {
          id: 't2',
          name: { ar: 'الرأس الثابت يصنف تضادا', en: 'The fixed head classifies contradiction' },
          code: "W = [[0.0, 0.0], [0.5, -0.5], [0.0, 0.0]]\nb = [0.0, 0.25, 0.0]\nprobs, pred = predict(W, b, [0.4, -0.2])\nassert abs(probs[1] - 0.464274189) < 1e-6, 'contradiction prob ~0.464274 | got %r' % probs[1]\nassert pred == 1, 'argmax must be class 1 (contradiction) | got %r' % pred",
          expected: 'probs[1]≈0.464274189, pred=1',
        },
        {
          id: 't3',
          name: { ar: 'عدّ معاملات الرأس: h×c + c', en: 'Head param count: h*c + c' },
          code: "for h, c, want in [(2, 3, 9), (256, 2, 514), (256, 3, 771)]:\n    got = h * c + c\n    assert got == want, 'head %d->%d must be %d params | got %r' % (h, c, want, got)",
          expected: '9, 514, 771',
        },
      ],
      hints: [
        { ar: 'في bert_pair_input تذكّر أن <cls> و<sep> الأول يتبعان قطعة A: الأصفار len(premise) + 2.', en: 'In bert_pair_input remember <cls> and the first <sep> belong to segment A: len(premise) + 2 zeros.' },
        { ar: 'في predict احسب اللوغيت بقائمة مطوية ثم طبق softmax المستقر: m = max ثم exp(x − m).', en: 'In predict compute logits with a comprehension, then apply the stable softmax: m = max then exp(x − m).' },
        { ar: 'pred من probs.index(max(probs)) — لا تعيد أعلى لوغيت منفردا بل الفهرس بعد التطبيع.', en: 'pred comes from probs.index(max(probs)) — return the index after normalizing, not a raw logit.' },
        { ar: 'قيم تحقق: العدّ h×c+c يعطي 9 و514 و771، وprobs[1] ≈ 0.464274189 لأن اللوغيت الثاني 0.55 والأخرى 0.', en: 'Sanity values: h×c+c gives 9, 514, 771, and probs[1] ≈ 0.464274189 because the second logit is 0.55 while the others are 0.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-head-params',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'رأس تصنيف كثيف واحد يأخذ تمثيل <cls> بطول 256 ويخرج 3 فئات لـ NLI: كم معاملا تدرَّب من الصفر في هذا الرأس (أوزان + انحيازات)؟ أجب بعدد صحيح.',
        en: 'A single dense classification head takes the 256-length <cls> representation and outputs 3 classes for NLI: how many parameters are trained from scratch in this head (weights + biases)? Answer with an integer.',
      },
      answer: '771',
      tolerance: 0,
      solution: '771',
      hints: [
        { ar: 'الطبقة الكثيفة تحمل مصفوفة أوزان h×c ومتوسط انحياز بطول c.', en: 'A dense layer holds an h×c weight matrix plus a length-c bias vector.' },
        { ar: 'طبق على رأس الدمية: 2×3 + 3 = 9 — النمط نفسه مع h=256 وc=3.', en: 'Apply it to the toy head: 2×3 + 3 = 9 — same pattern with h=256 and c=3.' },
        { ar: 'قارن برأس مشاعر ثنائي على المدخل نفسه: 256×2 + 2 = 514 — الفرق 257 معاملا فقط.', en: 'Compare with a binary sentiment head on the same input: 256×2 + 2 = 514 — a difference of only 257 parameters.' },
        { ar: 'الجواب: 256×3 + 3 = 771.', en: 'Answer: 256×3 + 3 = 771.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef softmax(xs):\n    m = max(xs)\n    es = [math.exp(x - m) for x in xs]\n    s = sum(es)\n    return [e / s for e in es]\n\ndef bert_encode_pair(premise, hypothesis):\n    tokens = ['<cls>'] + premise + ['<sep>'] + hypothesis + ['<sep>']\n    segments = [0] * (len(premise) + 2) + [1] * (len(hypothesis) + 1)\n    return tokens, segments\n\n# token-level QA heads: predict answer start and end positions\ntokens, segments = bert_encode_pair(['a', 'man', 'is', 'running'],\n                                   ['a', 'man', 'is', 'sleeping'])\ntok_vecs = [[0.10, 0.00], [0.30, 0.20], [0.35, 0.25], [0.32, 0.22],\n            [0.40, 0.30], [0.15, 0.05], [0.30, 0.20], [0.35, 0.25],\n            [0.32, 0.22], [0.38, 0.28], [0.12, 0.04]]\nw_start, w_end, b0 = [1.0, 0.0], [0.0, 1.0], 0.0\nstart_logits = [sum(w * x for w, x in zip(w_start, v)) + b0 for v in tok_vecs]\nend_logits = [sum(w * x for w, x in zip(w_end, v)) + b0 for v in tok_vecs]\nstart_p, end_p = softmax(start_logits), softmax(end_logits)\nprint('answer span:', tokens[start_p.index(max(start_p))], '..',\n      tokens[end_p.index(max(end_p))])\nprint('start probs top:', round(max(start_p), 6), 'end probs top:', round(max(end_p), 6))\n\n# sequence-level head for the same pair (2-D toy <cls>)\nprobs, pred = None, None\nW = [[0.0, 0.0], [0.5, -0.5], [0.0, 0.0]]\nb = [0.0, 0.25, 0.0]\nlogits = [sum(wi * x for wi, x in zip(w, [0.4, -0.2])) + bb for w, bb in zip(W, b)]\nprobs = softmax(logits)\nprint('sequence-level pred:', probs.index(max(probs)))\n\n# try: swap w_start to [0.0, 1.0] - which token grabs the start now?\n# try: add a fourth class to the head - how does the param count change?\n",
      prompt: {
        ar: 'الملعب يضيف رأس مستوى الرمز: تنبؤ موضعي البداية والنهاية لجواب سؤال «ماذا كان الرجل يفعل؟» على الزوج نفسه — أعلى احتمال بداية يقع على running (0.4) وعلى النهاية sleeping (0.28). قارن بالرأس على مستوى التسلسل الذي يصنف الزوج كله: نفس المرمِّز، ترويسات مختلفة — هذه هي «التغييرات الزهيدة».',
        en: 'The sandbox adds a token-level head: predicting the start and end of the answer to "what was the man doing?" over the same pair — the top start probability lands on running (0.4) and the end on sleeping (0.28). Compare with the sequence-level head classifying the whole pair: same encoder, different heads — that is the "minimal changes" idea.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أثناء الضبط الدقيق لمهمة NLI، أي المعاملات تُدرَّب من الصفر؟',
            en: 'During fine-tuning for NLI, which parameters are trained from scratch?',
          },
          options: [
            { id: 'a', text: { ar: 'طبقات الإخراج الإضافية فقط — أما معاملات BERT المدرَّبة مسبقا فتُضبط دقيقا ولا تبقى مجمدة', en: 'Only the added output layers — the pretrained BERT parameters are fine-tuned, not frozen' } },
            { id: 'b', text: { ar: 'كل معاملات BERT من الصفر لأن المهمة جديدة', en: 'All BERT parameters from scratch because the task is new' } },
            { id: 'c', text: { ar: 'تضمينات المفردات فقط ويرمِّز مجمدا كليا', en: 'Only the token embeddings while the encoder stays fully frozen' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القاعدة من s6: طبقات الإضافية تتعلم من الصفر ومعاملات المرمِّز المُدرَّب مسبقا تُحدَّث جميعها بالضبط الدقيق. في مثالنا رأس 256→3 بحجم 771 معاملا يبدأ من الصفر فوق مرمِّز يشترك في التحديث.',
            en: 'The s6 rule: added layers learn from scratch while every pretrained encoder parameter is updated by fine-tuning. In our example a 256→3 head of 771 parameters starts from zero on top of an encoder that updates along.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في تصنيف أزواج النص، أي تمثيل يغذي طبقة الإخراج؟',
            en: 'In text-pair classification, which representation feeds the output layer?',
          },
          options: [
            { id: 'a', text: { ar: 'تمثيل رمز <cls> لأنه يلخص الزوج كله بعد الترميز الثنائي الاتجاه', en: 'The <cls> token representation, because it summarizes the whole pair after bidirectional encoding' } },
            { id: 'b', text: { ar: 'متوسط تمثيلات <sep> فقط', en: 'The average of the <sep> representations only' } },
            { id: 'c', text: { ar: 'تمثيل آخر رمز في الفرضية قبل <sep>', en: 'The representation of the last premise token before <sep>' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المدخل <cls>+a+<sep>+b+<sep> والقرار من تمثيل <cls> عند الفهرس 0 في مثالنا — المرمِّز يجعل هذا الرمز يجمع معلومات الجملتين مع القطعتين 0/1. للانحدار (STS) نفس المسار مع مخرج مستمر وخسارة تربيعية.',
            en: 'The input is <cls>+a+<sep>+b+<sep> and the decision comes from the <cls> representation at index 0 in our example — the encoder turns this token into a summary of both sentences with the 0/1 segments. Regression (STS) follows the same path with a continuous output and squared loss.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'كيف يتغير النموذج للانتقال من NLI إلى الإجابة عن الأسئلة الاستخلاصية؟',
            en: 'How does the model change to move from NLI to extractive question answering?',
          },
          options: [
            { id: 'a', text: { ar: 'تستبدل طبقة <cls> الثلاثية برأسين لكل رمز يتنبآن بموضع بداية الجواب ونهايته في الفقرة', en: 'The 3-way <cls> layer is replaced by two per-token heads predicting the answer start and end positions in the passage' } },
            { id: 'b', text: { ar: 'يعاد التدريب المسبق من الصفر على بيانات الأسئلة قبل أي ضبط', en: 'Pretraining restarts from scratch on question data before any fine-tuning' } },
            { id: 'c', text: { ar: 'يُضاعف عدد طبقات المرمِّز لتوسيع السياق', en: 'The number of encoder layers doubles to widen context' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأسئلة الاستخلاصية مهمة على مستوى الرمز: ترويسة لكل رمز تخرج لوغيتي بداية/نهاية، وفي sandbox حكايتنا سقطت البداية على running والنهاية على sleeping. المرمِّز نفسه يبقى — فقط الطبقة الإضافية تتغير شكلا وعدد معاملاتها (مثل 256→2 = 514).',
            en: 'Extractive QA is token-level: a per-token head outputs start/end logits, and in our sandbox the start fell on running and the end on sleeping. The encoder stays — only the added layer changes shape and size (e.g. 256→2 = 514).',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'مستوى التسلسل: تمثيل <cls> يغذي شبكة كثيفة صغيرة للتصنيف (نص واحد أو زوج) أو لمخرج مستمر بخسارة تربيعية في STS — شكل المدخل وعدد المخرجات هو كل ما يتغير (الهدف من s6).', en: 'Sequence level: the <cls> representation feeds a small dense network for classification (single text or pair) or a continuous output with squared loss for STS — input shape and output count are all that changes (goal of s6).' },
        { ar: 'مستوى الرمز: وسم الكلمات وQA يصنفان تمثيل كل رمز (بداية/نهاية الجواب)، والقاعدة ثابتة: الطبقات الإضافية من الصفر وكل معاملات BERT تُضبط دقيقا (الهدف من s6).', en: 'Token level: tagging and QA classify each token representation (answer start/end); the rule is constant — added layers from scratch, all BERT parameters fine-tuned (goal of s6).' },
        { ar: 'على SNLI: نسخة مدرَّبة مسبقا (bert.small للعرض وbase الكاملة) تُحمَّل من vocab.json وpretrained.params، ورأس 256→3 بحجم 771 معاملا يصنف فئات 0/1/2 ويتجاوز نموذج الانتباه اليدوي (الهدف من s7).', en: 'On SNLI: a pretrained model (bert.small for demos, full base otherwise) loads from vocab.json and pretrained.params, a 256→3 head of 771 parameters classifies the 0/1/2 labels and outperforms the hand-built attention model (goal of s7).' },
      ],
      reflectPrompt: {
        ar: 'عندك ثلاث مهام: مشاعر ثنائية وNLI ثلاثي واسترجاع إجابات. لو كانت ميزانيتك تسمح بضبط دقيق واحد فقط هذا الشهر، فأي مهمة تختار ولماذا لا يعني اختيارك أن المهمتين الأخريين مستحيلتين بنفس المرمِّز؟',
        en: 'You have three tasks: binary sentiment, 3-way NLI, and answer extraction. If your budget allows only one fine-tuning run this month, which task do you pick — and why does that choice not make the other two impossible with the same encoder?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch16.s6' },
        { book: 'D2L', section: 'd2l.ch16.s7' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch16.s6' },
    { book: 'D2L', section: 'd2l.ch16.s7' },
  ],
} satisfies Lesson;

export default lesson;
