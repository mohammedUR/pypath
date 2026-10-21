import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch10.l4 — "Decoder Training, BLEU, and Beam Search"
 * تدريب المفكِّك و BLEU والبحث الحزمي
 * Aligned with D2L ch10 s7 (Sequence-to-Sequence Learning for Machine
 * Translation) + s8 (Beam Search). All expression is original — a paraphrase
 * of the source's ideas, never a verbatim translation. Runnable design: the
 * book's BLEU precision example, greedy-vs-alternative products, and a beam
 * search over a fixed log-probability tree; every literal verified under
 * CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch10.l4',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 10,
  title: {
    ar: 'تدريب المفكِّك و BLEU والبحث الحزمي',
    en: 'Decoder Training, BLEU, and Beam Search',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch10.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'عندنا المعمارية، وعندنا البيانات — كيف ندرّب وكيف نتوقع؟ في التدريب يُطعم المفكِّك الحقيقة الذهبية رمزًا برمز (teacher forcing)، وتُقنَّع الحشوات من الخسارة. وعند التوقع نولّد من مخرجاتنا السابقة: هل نأخذ دائمًا الرمز الأعلى احتمالًا؟ الكتاب يريك بالأرقام أن الجشع قد يخسر، والبحث الشامل مستحيل حسابيًا، فالبحث الحزمي هو الحل الوسط الذي يعمل فعليًا.',
        en: 'We have the architecture and the data \u2014 how do we train, and how do we predict? During training the decoder is fed the ground truth token by token (teacher forcing), with padding masked out of the loss. At prediction time we generate from our own previous outputs: should we always take the highest-probability token? The book shows with numbers that greedy can lose, that exhaustive search is computationally impossible, and that beam search is the compromise that actually works.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التحضير بالمعلم والقياس بـ BLEU، ثم استراتيجيات التوليد', en: 'Teacher forcing and measuring with BLEU, then decoding strategies' },
      chunks: [
        {
          ar: 'التدريب: مرمِّز RNN يقرأ المصدر رمزًا رمزًا (h_t = f(x_t, h_{t-1})) ويُعطي في النهاية سياقًا c — غالبًا الحالة الأخيرة h_T. المفكِّك RNN ثانٍ يبدأ من <bos> ويُطعم بالأهداف الصحيحة (forcing المعلم): مدخله <bos> + الهدف بلا آخر رمز، وملصقاته الهدف منزاحًا. عند التوقع بدلًا من ذلك يُدخل كل رمز متنبأٍ به في الخطوة التالية حتى يظهر <eos>. الخسارة إنتروبيا متقاطعة على توزيع المفردة، لكن الحشوات تُقنَّع بالصفر كي لا تدخل في المتوسط. وللقيس: BLEU يفحص كل n-gram في المتنبأ هل يوجد في الهدف — دقة p_n = المتطابق ÷ عدد n-grams المتنبأ — مع معامل exp(min(0, 1 − len_label/len_pred)) يعاقب القصور، وأوزان p_n^(1/2^n) تُكافئ تطابق القطع الأطول.',
          en: 'Training: an RNN encoder reads the source token by token (h_t = f(x_t, h_{t-1})) and hands over a context c \u2014 typically the final state h_T. A second RNN decoder starts from <bos> and is fed the true targets (teacher forcing): its input is <bos> + the target without its last token, and its labels are the target shifted by one. At prediction time, instead, each predicted token is fed back as the next step\u2019s input until <eos> appears. The loss is cross-entropy over the token distribution, but padding positions are masked to zero so they never enter the average. For evaluation: BLEU checks whether each n-gram of the prediction appears in the target \u2014 precision p_n = matches \u00f7 number of predicted n-grams \u2014 multiplied by exp(min(0, 1 \u2212 len_label/len_pred)), a factor penalizing short predictions, with weights p_n^(1/2^n) that reward matching longer chunks.',
        },
        {
          ar: 'التوليد على طيف: البحث الجشع يختار كل خطوة الرمز الأعلى احتمالًا بتكلفة رخيصة O(|Y|·T\u2032) لكن بلا ضمان. البحث الشامل يعدّ كل المتواليات O(|Y|^T\u2032) — مع |Y|=10000 و T\u2032=10 يبلغ 10^40 متتالية: خارج قدرة أي حاسوب. البحث الحزمي يحتفظ بأفضل k متتاليات جزئية في كل خطوة ويوسعها من k·|Y| ترشيح، فتكلفته O(k·|Y|·T\u2032)، و k=1 يرجع جشعًا. ولأن مقارنة متواليات بأطوال مختلفة بالجداء الخام تميل للقصور، تُختار المتتالية الفائزة بالدرجة (1/L^α)·Σ log P(y_t\u2032|...) حيث L الطول و α عادة 0.75 — المقام يعاقب الطول الزائد.',
          en: 'Generation lies on a spectrum: greedy search picks the highest-probability token each step at a cheap O(|Y|\u00b7T\u2032) cost but with no guarantee. Exhaustive search enumerates everything at O(|Y|^T\u2032) \u2014 with |Y|=10000 and T\u2032=10 that is 10^40 sequences: beyond any foreseeable computer. Beam search keeps the best k partial sequences at every step and expands them against k\u00b7|Y| candidates, costing O(k\u00b7|Y|\u00b7T\u2032); k=1 reduces it to greedy. And because raw products favor short outputs when comparing sequences of different lengths, the winner is chosen by the score (1/L^\u03b1)\u00b7\u03a3 log P(y_t\u2032|...) where L is the length and \u03b1 is usually 0.75 \u2014 the denominator penalizes excessive length.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'BLEU على مثال الكتاب، ثم مقارنة الجشع بالمستوى الأفضل',
        en: 'BLEU on the book\u2019s example, then greedy vs the better path',
      },
      code: "import math\n\ndef ngrams(tokens, n):\n    return [' '.join(tokens[i:i + n]) for i in range(len(tokens) - n + 1)]\n\ndef bleu(pred_seq, label_seq, k):\n    pred, label = pred_seq.split(' '), label_seq.split(' ')\n    len_pred, len_label = len(pred), len(label)\n    score = math.exp(min(0, 1 - len_label / len_pred))\n    for n in range(1, min(k, len_pred) + 1):\n        matches, label_subs = 0, {}\n        for g in ngrams(label, n):\n            label_subs[g] = label_subs.get(g, 0) + 1\n        for g in ngrams(pred, n):\n            if label_subs.get(g, 0) > 0:\n                matches += 1\n                label_subs[g] -= 1\n        score *= (matches / (len_pred - n + 1)) ** (0.5 ** n)\n    return score\n\npred, label = 'A B B C D', 'A B C D E F'   # the book's precision example\npred_toks, label_toks = pred.split(' '), label.split(' ')\nfor n in (1, 2, 3, 4):\n    label_subs = {}\n    for g in ngrams(label_toks, n):\n        label_subs[g] = label_subs.get(g, 0) + 1\n    matches = 0\n    for g in ngrams(pred_toks, n):\n        if label_subs.get(g, 0) > 0:\n            matches += 1\n            label_subs[g] -= 1\n    print('p%d = %d/%d' % (n, matches, len(pred_toks) - n + 1))\nprint('bleu k=2 :', round(bleu(pred, label, 2), 4))\nprint('bleu k=4 :', round(bleu(pred, label, 4), 4))\nprint('penalty  :', round(math.exp(min(0, 1 - 6 / 2)), 4))\nprint('greedy   :', round(0.5 * 0.4 * 0.4 * 0.6, 4))\nprint('alt path :', round(0.5 * 0.3 * 0.6 * 0.6, 4))\nalpha = 0.75\nfor seq, p in [(('A', 'B', 'C', '<eos>'), 0.048), (('A', 'C', 'B', '<eos>'), 0.054)]:\n    print(seq, 'score =', round(math.log(p) / len(seq) ** alpha, 4))",
      explanation: {
        ar: 'مثال الكتاب بدقة: المتنبأ A,B,B,C,D ضد الهدف A,B,C,D,E,F يعطي p1 = 4/5 (النسخة الثانية من B تُقصّ بالعد المحدود)، و p2 = 3/4، و p3 = 1/3، و p4 = 0. بقيم k=2 تخرج BLEU = 0.6815، وبـ k=4 تصير 0 لأن p4 = 0. عامل العقوبة يظهر وحده: متنبأ من رمزين أمام هدف من ستة يعاقَب بـ exp(1 − 6/2) = 0.1353 رغم أن p1 = p2 = 1. ثم فكرة s8 بالأرقام: الجشع يختار A,B,C,<eos> باحتمال 0.5×0.4×0.4×0.6 = 0.048، لكن اختيار C الأدنى في الخطوة الثانية يفتح مسارًا أفضل 0.5×0.3×0.6×0.6 = 0.054 — وبدرجة (1/L^0.75)·log P يتفوق المسار البديل (−1.0319 مقابل −1.0736): الجشع ليس الأمثل.',
        en: 'The book\u2019s example precisely: prediction A,B,B,C,D against target A,B,C,D,E,F gives p1 = 4/5 (the second B is clipped by counted matching), p2 = 3/4, p3 = 1/3, p4 = 0. With k=2 the BLEU score is 0.6815, and with k=4 it drops to 0 because p4 = 0. The penalty factor in isolation: a two-token prediction against a six-token target scores exp(1 \u2212 6/2) = 0.1353 even though p1 = p2 = 1. Then the s8 idea in numbers: greedy takes A,B,C,<eos> with probability 0.5\u00d70.4\u00d70.4\u00d70.6 = 0.048, but choosing the lower C at step two opens a better path 0.5\u00d70.3\u00d70.6\u00d70.6 = 0.054 \u2014 and under the (1/L^0.75)\u00b7log P score the alternative wins (\u22121.0319 vs \u22121.0736): greedy is not optimal.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.beam-pick',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ beam_pick(cands, alpha=0.75) التي تتلقى قائمة مرشحين نهائيين (متتالية كاملة تنتهي بـ <eos>، احتمالها) وتعيد المتتالية ذات أفضل درجة (1/L^alpha)·log(p) حيث L طول المتتالية. هذه هي الخطوة الأخيرة في البحث الحزمي بعد جمع المرشحين.',
        en: 'Implement beam_pick(cands, alpha=0.75) taking a list of final candidates (a complete sequence ending in <eos>, with its probability) and returning the sequence with the best score (1/L^alpha)\u00b7log(p), where L is the sequence length. This is the final step of beam search after collecting candidates.',
      },
      starterCode: "import math\n\ndef beam_pick(cands, alpha=0.75):\n    ...  # TODO: score each (seq, p) with log(p) / len(seq)**alpha, return the best seq\n    return best\n\nprint(beam_pick([(('A', 'B', '<eos>'), 0.08), (('C', 'B', '<eos>'), 0.09)]))\nprint(beam_pick([(('B', '<eos>'), 0.09), (('A', 'B', 'C', '<eos>'), 0.081)]))\n",
      solution: "import math\n\ndef beam_pick(cands, alpha=0.75):\n    best_seq, best_score = None, None\n    for seq, p in cands:\n        score = math.log(p) / (len(seq) ** alpha)\n        if best_score is None or score > best_score:\n            best_seq, best_score = seq, score\n    return best_seq",
      tests: [
        {
          id: 't1',
          name: { ar: 'الاحتمال الأعلى يفوز بين مرشحين مكتملين', en: 'The higher probability wins among complete candidates' },
          code: "import math\nc1 = [(('A', 'B', '<eos>'), 0.08), (('C', 'B', '<eos>'), 0.09), (('A', '<eos>'), 0.05), (('C', '<eos>'), 0.015)]\nassert beam_pick(c1) == ('C', 'B', '<eos>'), 'expected the 0.09 path | actual: %r' % (beam_pick(c1),)",
          expected: "('C', 'B', '<eos>')",
        },
        {
          id: 't2',
          name: { ar: 'مع alpha=0.75 يفوز الأطول الأعلى احتمالًا', en: 'With alpha=0.75 the longer higher-probability path wins' },
          code: "c2 = [(('B', '<eos>'), 0.09), (('A', 'B', 'C', '<eos>'), 0.081)]\nassert beam_pick(c2) == ('A', 'B', 'C', '<eos>'), 'expected the 4-token path | actual: %r' % (beam_pick(c2),)",
          expected: "('A', 'B', 'C', '<eos>')",
        },
        {
          id: 't3',
          name: { ar: 'مع alpha=0 يعود الميل نحو القصور', en: 'With alpha=0 the bias toward short outputs returns' },
          code: "c2 = [(('B', '<eos>'), 0.09), (('A', 'B', 'C', '<eos>'), 0.081)]\nassert beam_pick(c2, alpha=0.0) == ('B', '<eos>'), 'raw log-prob favors short | actual: %r' % (beam_pick(c2, alpha=0.0),)",
          expected: "('B', '<eos>')",
        },
      ],
      hints: [
        { ar: 'الدرجة عدد سالب دائمًا (لوغاريتم احتمال < 1): القيمة الأكبر (الأقل سلبية) تفوز.', en: 'The score is always negative (a logarithm of a probability < 1): the larger (less negative) value wins.' },
        { ar: 'حلقة واحدة تكفي: احسب score = math.log(p) / (len(seq) ** alpha) وثبّت الأفضل.', en: 'One loop suffices: compute score = math.log(p) / (len(seq) ** alpha) and keep the best.' },
        { ar: 'في الاختبار الثاني: log(0.09)/2^0.75 ≈ −1.432 مقابل log(0.081)/4^0.75 ≈ −0.889 — المقام ينقذ المتوالية الطويلة.', en: 'In the second test: log(0.09)/2^0.75 \u2248 \u22121.432 vs log(0.081)/4^0.75 \u2248 \u22120.889 \u2014 the denominator rescues the longer sequence.' },
        { ar: 'مع alpha=0 يصبح المجموع اللوغاريتمي الخام هو الحكم: رمزان سالبان أقل من أربعة، فيفوز القصير — لهذا وضع الكتاب α = 0.75.', en: 'With alpha=0 the raw log-sum decides: two negative terms beat four, so short wins \u2014 that is why the book sets \u03b1 = 0.75.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-beam-cost',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بحث حزمي بحجم حزمة k=5 فوق مفردة خرج |Y|=1000 وطول أقصى T\u2032=10. كم ترشيحًا يوسّعها البحث إجمالًا وفق تكلفة الكتاب O(k·|Y|·T\u2032)؟',
        en: 'Beam search with beam size k=5 over an output vocabulary |Y|=1000 and a maximum length T\u2032=10. How many candidate expansions does it perform in total under the book\u2019s cost O(k\u00b7|Y|\u00b7T\u2032)?',
      },
      answer: '50000',
      tolerance: 1e-9,
      solution: '50000',
      hints: [
        { ar: 'في كل خطوة تُوسَّع الحزمة كاملة: k × |Y| ترشيحًا، وعلى T\u2032 خطوات.', en: 'Each step expands the whole beam: k \u00d7 |Y| candidates, repeated over T\u2032 steps.' },
        { ar: '5 × 1000 = 5000 لكل خطوة.', en: '5 \u00d7 1000 = 5000 per step.' },
        { ar: '5000 × 10 = 50000 — بين 10^5 للجشع و 10^30 للشامل في هذا الحجم.', en: '5000 \u00d7 10 = 50000 \u2014 between 10^5 for greedy and 10^30 for exhaustive at this size.' },
        { ar: 'للمقارنة: الشامل يعدّ |Y|^T\u2032 = 10^30 متتالية هنا، والجشع 10^4 = 10000 فقط.', en: 'For comparison: exhaustive would enumerate |Y|^T\u2032 = 10^30 sequences here, greedy only 10^4 = 10000.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\n# fixed conditional probabilities: table[prefix] maps each token to its prob\nP1 = {(): {'A': 0.5, 'C': 0.3, 'B': 0.15, '<eos>': 0.05}}\nP2 = {\n    ('A',): {'B': 0.4, 'C': 0.3, 'A': 0.2, '<eos>': 0.1},\n    ('C',): {'B': 0.6, 'A': 0.2, 'C': 0.15, '<eos>': 0.05},\n    ('B',): {'A': 0.3, 'C': 0.3, 'B': 0.3, '<eos>': 0.1},\n}\nP3 = {\n    ('A', 'B'): {'<eos>': 0.4, 'C': 0.3, 'A': 0.2, 'B': 0.1},\n    ('A', 'C'): {'<eos>': 0.6, 'B': 0.2, 'C': 0.1, 'A': 0.1},\n    ('C', 'B'): {'<eos>': 0.5, 'B': 0.2, 'C': 0.2, 'A': 0.1},\n    ('B', 'A'): {'<eos>': 0.5, 'A': 0.2, 'B': 0.2, 'C': 0.1},\n    ('B', 'C'): {'<eos>': 0.5, 'C': 0.2, 'B': 0.2, 'A': 0.1},\n}\n\ndef beam_search(k):\n    tables = [P1, P2, P3]\n    beam, done = [((), 0.0)], []\n    for step in range(3):\n        table = tables[step]\n        cands = []\n        for prefix, lp in beam:\n            for tok, p in table[prefix].items():\n                cands.append((prefix + (tok,), lp + math.log(p)))\n        cands.sort(key=lambda c: -c[1])\n        beam = cands[:k]\n        finished, still = [], []\n        for seq, lp in beam:\n            (finished if seq[-1] == '<eos>' else still).append((seq, lp))\n        done += finished\n        beam = still\n        print('step %d: kept %s | finished %s'\n              % (step + 1,\n                 [(' '.join(s), round(lp, 3)) for s, lp in beam],\n                 [(' '.join(s), round(lp, 3)) for s, lp in finished]))\n        if not beam:\n            break\n    return done\n\nfor k in (1, 2):\n    done = beam_search(k)\n    scored = sorted(((lp / len(s) ** 0.75, s, lp) for s, lp in done), reverse=True)\n    for score, s, lp in scored:\n        print('k=%d final: %s p=%.4f score=%.4f' % (k, ' '.join(s), math.exp(lp), score))\n\n# جرّب: k=3 — هل يظهر المسار A C <eos> ذو 0.09 ضمن الحزمة قبل أن يكتمل؟\n# try: k=3 - does the 0.09 path A C <eos> survive inside the beam to completion?\n",
      prompt: {
        ar: 'الملعب يشغّل البحث الحزمي على شجرة احتمالات ثابتة بعمق 3. مع k=1 (جشع): الحزمة تسير A ← A B ← A B <eos> وتستقر على p = 0.08. مع k=2: الخطوة الأولى تحفظ C كأفضل ثانٍ (−1.204)، وفي الخطوة الثانية يتقدم C B (−1.715) على A C (−1.897)، وفي النهاية يفوز C B <eos> باحتمال 0.09 ودرجة −1.0563 — الحزمة الأعرض أنقذت الفرع الذي أهمله الجشع، وهي روح مثال الكتاب (0.048 مقابل 0.054).',
        en: 'The sandbox runs beam search over a fixed probability tree of depth 3. With k=1 (greedy): the beam walks A \u2192 A B \u2192 A B <eos> and settles for p = 0.08. With k=2: step one keeps C as the runner-up (\u22121.204), step two promotes C B (\u22121.715) over A C (\u22121.897), and the finish crowns C B <eos> with p = 0.09 and score \u22121.0563 \u2014 the wider beam rescued the branch greedy discarded, the very spirit of the book\u2019s example (0.048 vs 0.054).',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي استراتيجية توليد وحدها تضمن نظريًا العثور على المتتالية الأعلى احتمالًا، ولماذا لا تُستعمل؟',
            en: 'Which decoding strategy alone guarantees finding the highest-probability sequence, and why is it not used?',
          },
          options: [
            { id: 'a', text: { ar: 'الجشع — لكنه بطيء', en: 'Greedy \u2014 but it is slow' } },
            { id: 'b', text: { ar: 'البحث الشامل — يعدّ O(|Y|^T\u2032) متتالية، وهو تكلفة أسية مستحيلة عمليًا', en: 'Exhaustive search \u2014 it enumerates O(|Y|^T\u2032) sequences, an exponential cost that is practically impossible' } },
            { id: 'c', text: { ar: 'البحث الحزمي — لكنه يعيد النتيجة نفسها لـ k=1 دائمًا', en: 'Beam search \u2014 but it always returns the same result as k=1' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشامل هو الوحيد الذي يفحص كل شيء فيضمن الأمثل، لكن مع |Y|=10000 و T\u2032=10 يحتاج 10^40 تقييمًا — الكتاب يصفه بأنه توضيحي لا عملي. الحزمي بـ k=1 هو الجشع بالضبط (حالة خاصة)، لا العكس.',
            en: 'Exhaustive is the only one that checks everything, hence optimal; but with |Y|=10000 and T\u2032=10 it needs 10^40 evaluations \u2014 the book calls it illustrative, not practical. Beam with k=1 is exactly greedy (a special case), not the other way around.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في درجة اختيار الفائز (1/L^α)·Σ log P، ما دور قسمة L^α (عند α = 0.75)؟',
            en: 'In the winning score (1/L^\u03b1)\u00b7\u03a3 log P, what does dividing by L^\u03b1 (\u03b1 = 0.75) do?',
          },
          options: [
            { id: 'a', text: { ar: 'لا شيء — مجرد تسوية رقمية للعرض', en: 'Nothing \u2014 just numerical cosmetics for display' } },
            { id: 'b', text: { ar: 'يلغي الحاجة إلى رمز <eos> في التوليد', en: 'It removes the need for <eos> during generation' } },
            { id: 'c', text: { ar: 'المتولة الأطول تجمع حدودًا لوغاريتمية أكثر، فالمقام يعاقب الإفراط في الطول ويحفظ المقارنة بين الأطوال عادلة', en: 'Longer sequences accumulate more log terms, so the denominator penalizes excessive length and keeps comparisons across lengths fair' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'مجموع اللوغاريتمات الخام يميل للقصور (حدود سالبة أقل)؛ التقسيم بـ L^α يوازن جزئيًا مع إبقاء عقوبة على المتواليات الطويلة جدًا. جرّبت ذلك في ex1: alpha=0 يعيد القصير، و alpha=0.75 يمنح الأطول فرصته.',
            en: 'Raw log sums favor short outputs (fewer negative terms); dividing by L^\u03b1 balances that partially while still taxing very long sequences. You tested it in ex1: alpha=0 restores the short bias, alpha=0.75 gives longer sequences their fair shot.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في BLEU، ما الذي يقيسه عامل exp(min(0, 1 − len_label/len_pred))؟',
            en: 'In BLEU, what does the factor exp(min(0, 1 \u2212 len_label/len_pred)) measure?',
          },
          options: [
            { id: 'a', text: { ar: 'عقوبة على المتنبئات القصيرة: تنبؤ من رمزين أمام هدف من ستة يُضرب بـ ≈0.14 رغم أن دقاته 1', en: 'A penalty on short predictions: a 2-token prediction against a 6-token target is multiplied by \u22480.14 even with perfect precisions' } },
            { id: 'b', text: { ar: 'مكافأة على التنبؤات القصيرة لتسريع التوليد', en: 'A reward for short predictions to speed up generation' } },
            { id: 'c', text: { ar: 'قياس لدقة الـ n-grams نفسها', en: 'A measure of the n-gram precisions themselves' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الدقة p_n ترتفع تلقائيًا كلما قصر المتنبأ، فيعوّل هذا العامل على نسبة الطولين لمعاقبة القصور — تحسبه في الدرس: exp(1 − 6/2) = 0.1353. والـ n-grams مفهوم من الفصل 9 تعيد استعماله هنا.',
            en: 'Precision p_n rises automatically as predictions shorten, so this factor leans on the length ratio to punish brevity \u2014 computed in the lesson: exp(1 \u2212 6/2) = 0.1353. The n-gram notion itself comes from Chapter 9.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'تدريب seq2seq (الهدف من s7): forcing المعلم يغذي المفكِّك بالأهداف الحقيقية منزاحةً عن <bos>، والسياق c = h_T من المرمِّز، والخسارة تُقنَّع من الحشو، و BLEU يقيّم بـ n-grams مع عقوبة القصور.', en: 'Seq2seq training (goal of s7): teacher forcing feeds the decoder the true targets shifted behind <bos>, the context c = h_T comes from the encoder, the loss masks padding, and BLEU evaluates with n-grams plus a brevity penalty.' },
        { ar: 'التوليد (الهدف من s8): الجشع رخيص بلا ضمان (0.048 قد يخسر 0.054)، والشامل مستحيل (10^40)، والحزمي بميزانية k·|Y|·T\u2032 يحتفظ بفرق مرشحين ويفوز بدرجة (1/L^α)·Σ log P حيث α = 0.75.', en: 'Decoding (goal of s8): greedy is cheap but unguaranteed (0.048 can lose to 0.054), exhaustive is impossible (10^40), and beam search at a budget of k\u00b7|Y|\u00b7T\u2032 keeps a frontier of candidates and picks the winner by the (1/L^\u03b1)\u00b7\u03a3 log P score with \u03b1 = 0.75.' },
        { ar: 'الجسر القادم: السياق الوحيد h_T ما يزال عنق زجاجة — الفصل 11 يفتحه بانتباه يقرأ كل حالات المرمِّز في كل خطوة توليد.', en: 'The bridge ahead: the single context h_T is still a bottleneck \u2014 Chapter 11 opens it with attention that reads all encoder states at every generation step.' },
      ],
      reflectPrompt: {
        ar: 'لو تولّدت ترجمة قصيرة جدًا لكن بدقات n-gram مثالية: أي مكوّن من BLEU سيكشف الخداع، وأي معامل في درجة الحزمي يلعب الدور المقابل؟',
        en: 'If a translation comes out very short yet with perfect n-gram precisions: which BLEU component exposes the trick, and which factor of the beam score plays the opposing role?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch10.s7' },
        { book: 'D2L', section: 'd2l.ch10.s8' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch10.s7' },
    { book: 'D2L', section: 'd2l.ch10.s8' },
  ],
} satisfies Lesson;

export default lesson;
