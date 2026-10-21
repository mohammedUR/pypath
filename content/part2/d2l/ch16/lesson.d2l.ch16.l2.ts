import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch16.l2 — "Natural Language Inference with Attention"
 * الاستدلال اللغوي الطبيعي بالانتباه
 * Aligned with D2L ch16 s4 (Natural Language Inference and the Dataset) + s5
 * (Natural Language Inference: Using Attention). All expression is original —
 * a paraphrase of the source's ideas, never a verbatim translation. Runnable
 * design: token-overlap features on 3 fixed (premise, hypothesis) pairs with
 * the three labels, then soft-alignment attention weights for a fixed
 * entailment pair (premise/hypothesis embeddings as literals). Every literal
 * verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch16.l2',
  version: 1,
  part: 'II',
  track: 'A5',
  book: 'D2L',
  chapter: 16,
  title: {
    ar: 'الاستدلال اللغوي الطبيعي بالانتباه',
    en: 'Natural Language Inference with Attention',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch16.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: '«امرأتان تحتضنان» — هل يعني ذلك أنهما تتبادلان المودة؟ الاستدلال اللغوي الطبيعي يصنف علاقة فرضية بمقدمة إلى واحدة من ثلاث: entailment أو contradiction أو neutral. سنبدأ بخدعة بسيطة — عدّ الكلمات المشتركة — ونكتشف عجزها أمام التضاد، ثم نبني المحاذاة الناعمة بالانتباه: كل كلمة في الجملة تتجه إلى كل كلمة في الأخرى، بلا RNN ولا التفاف، وبخطية في التكلفة.',
        en: '"Two women are hugging" — does that mean they are showing affection? Natural language inference classifies the relation of a hypothesis to a premise as one of three: entailment, contradiction, or neutral. We start with a cheap trick — counting shared words — and watch it fail on contradiction, then build soft alignment with attention: every word in one sentence attends to every word in the other, with no RNN and no convolution, at linear cost.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ثلاث علاقات، ومحاذاة ناعمة بخطوات ثلاث', en: 'Three relations, and soft alignment in three steps' },
      chunks: [
        {
          ar: 'NLI يقرر منطق الجمل الزوجية: entailment إذا استُنتجت الفرضية من المقدمة («تحتضنان» ⇒ «تتبادلان المودة»)، وcontradiction إذا استُنتج نقيضها («يركض» ⇒ لا «ينام»)، وneutral فيما عدا ذلك («يعزفون» لا يخبر هل هم مشهورون). المعيار التدريبي SNLI يضم أكثر من 500000 زوج إنجليزي موسوم، تُقرأ مقدماته وفرضياته وقاموس تسمياته entailment=0 وcontradiction=1 وneutral=2، مع تنظيف أقواس ومسافات مكررة. الدفعات تُبنى بحشو الطول الأقصى لكل دفعة.',
          en: 'NLI decides sentence-pair logic: entailment when the hypothesis follows from the premise ("hugging" ⇒ "showing affection"), contradiction when its negation follows ("running" ⇒ not "sleeping"), neutral otherwise ("performing" says nothing about being famous). The training benchmark SNLI holds over 500000 labeled English pairs, read as premises, hypotheses, and a label map entailment=0, contradiction=1, neutral=2, with parentheses and repeated whitespace cleaned. Batches are formed by padding to each batch max length.',
        },
        {
          ar: 'نموذج الانتباه القابل للتفكيك يعمل بثلاث خطوات مشتركة التدريب: attending ثم comparing ثم aggregating. المحاذاة الناعمة تحسب e_ij = f(a_i)·f(b_j) حيث f شبكة MLP تطبق على كل رمز منفردا — وهذه الحيلة تحوّل m×n تطبيق إلى m+n فقط (خطي بدل تربيعي). ثم beta_i = متوسط موزون لرموز الفرضية بأوزان softmax(e_ij)، وalpha_j بالمثل من المقدمة. المقارنة تغذي كل زوج [a_i; beta_i] و[b_j; alpha_j] في شبكة، والتجميع يجمع النتائج ويصنف إلى الفئات الثلاث.',
          en: 'The decomposable attention model runs three jointly trained steps: attending, comparing, aggregating. Soft alignment computes e_ij = f(a_i)·f(b_j) where f is an MLP applied to each token separately — this trick turns m×n applications into just m+n (linear instead of quadratic). Then beta_i is a softmax-weighted average of hypothesis tokens by e_ij, and alpha_j symmetrically over the premise. Comparing feeds each pair [a_i; beta_i] and [b_j; alpha_j] into a network, and aggregating sums those outputs and classifies into the three classes.',
        },
        {
          ar: 'المفردات هنا GloVe مُدرَّبة مسبقا وتُثبَّت، والفرضيات المولدة آليا في SNLI تمنح توازنا في التسميات. لماذا ينير الانتباه العلاقة؟ لأن المحاذاة تكشف الأزواج المفصلية: sleep مع tired في المقدمة/الفرضية، وi مع i. وثقل المعاملات صغير نسبيا — لا تسلسل ولا التفاف — فكان هذا النموذج الأفضل وقتها على SNLI بكلفة أقل. الدرس العملي: ميزات التداخل السطحية تبدأ جيدة ثم تتوقف؛ المحاذاة المدربة تكمل الطريق.',
          en: 'The vocabulary here is frozen pretrained GloVe, and SNLI hypotheses are machine-generated which keeps labels balanced. Why does attention illuminate the relation? Because alignment exposes the pivotal pairs: sleep with tired across premise/hypothesis, and i with i. Parameter count stays modest — no recurrence, no convolution — and this model was then the best on SNLI at lower cost. The practical lesson: surface overlap features start strong then stall; trained alignment finishes the road.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'ميزات التداخل على ثلاثة أزواج + محاذاة ناعمة لزوج entailment',
        en: 'Overlap features on three pairs + soft alignment for an entailment pair',
      },
      code: "import math\n\ndef dot(a, b):\n    return sum(x * y for x, y in zip(a, b))\n\ndef softmax(xs):\n    m = max(xs)\n    es = [math.exp(x - m) for x in xs]\n    s = sum(es)\n    return [e / s for e in es]\n\nlabel_names = ['entailment', 'contradiction', 'neutral']\npairs = [\n    (['two', 'women', 'are', 'hugging', 'each', 'other'],\n     ['two', 'women', 'are', 'showing', 'affection'], 0),\n    (['a', 'man', 'is', 'running'], ['a', 'man', 'is', 'sleeping'], 1),\n    (['the', 'musicians', 'are', 'performing'], ['the', 'musicians', 'are', 'famous'], 2),\n]\nfor prem, hyp, y in pairs:\n    ov = set(prem) & set(hyp)\n    frac = len(ov) / len(set(hyp))\n    print('%s overlap=%s frac=%.4f' % (label_names[y], sorted(ov), frac))\n\n# soft alignment for the fixed entailment pair:\n# premise 'the child smiles' vs hypothesis 'the child is happy'\nA = {'the': [0.1, 0.0], 'child': [0.9, 0.6], 'smiles': [0.5, -0.3]}\nB = {'the': [0.1, 0.0], 'child': [0.9, 0.6], 'is': [0.0, 0.1], 'happy': [0.6, -0.3]}\nptoks = ['the', 'child', 'smiles']\nhtoks = ['the', 'child', 'is', 'happy']\nEmat = [[dot(A[a], B[b]) for b in htoks] for a in ptoks]\nprint('e matrix:', [[round(x, 4) for x in row] for row in Emat])\nfor a, row in zip(ptoks, Emat):\n    wts = softmax(row)\n    beta = [sum(wts[j] * B[b][k] for j, b in enumerate(htoks)) for k in (0, 1)]\n    print('beta(%s): w=%s -> %s' % (a, [round(w, 6) for w in wts], [round(x, 6) for x in beta]))",
      explanation: {
        ar: 'ميزة التداخل تعطي 0.6000 للتنزم و0.7500 للتضاد و0.7500 للحياد — النسبان الأخيرتان متطابقتان رغم اختلاف العلاقة كليا، وهذا عجز الميزة السطحية أمام «is sleeping» مقابل «is famous». المحاذاة الناعمة: مصفوفة e ثلاثية أربع تظهر قمة child·child = 1.17، وbeta(child) يوزع 0.473034 على child و0.210433 على happy، بينما beta(smiles) يميل إلى happy بوزن 0.307150 مقابل 0.272418 لchild — «smiles» يتنبأ بـ «happy» فيقال الزوج نزم. كل أوزان beta تُغذى في خطوة المقارنة والتجميع لتصنيف الفئات الثلاث.',
        en: 'The overlap feature gives 0.6000 for entailment, 0.7500 for contradiction and 0.7500 for neutral — the last two are identical although the relations differ completely, and that is the surface feature failing on "is sleeping" versus "is famous". Soft alignment: the 3×4 e matrix peaks at child·child = 1.17; beta(child) spreads 0.473034 on child and 0.210433 on happy, while beta(smiles) leans to happy with weight 0.307150 against 0.272418 for child — "smiles" predicting "happy" is what makes the pair entailment. All beta vectors feed the compare and aggregate steps that classify the three classes.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.soft-align',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفذ soft_align(a_vecs, b_vecs) التي تعيد قائمة beta: لكل متجه a_i من المقدمة احسب درجات e = a_i·b_j على كل رموز الفرضية، وحولها softmax مستقرا (اطرح الأعظم قبل exp)، ثم beta_i = متوسط b_vecs الموزون بالأوزان. يجب أن تعمل مع أي عدد من الرموز في الجهتين.',
        en: 'Implement soft_align(a_vecs, b_vecs) returning a list of beta: for each premise vector a_i compute scores e = a_i·b_j over all hypothesis tokens, apply a numerically stable softmax (subtract the max before exp), then beta_i = the weighted average of b_vecs by those weights. It must work for any number of tokens on both sides.',
      },
      starterCode: "import math\n\ndef softmax(xs):\n    # TODO: stable softmax (subtract max first)\n    ...\n\ndef soft_align(a_vecs, b_vecs):\n    # TODO: for each a_i, scores -> softmax weights -> weighted average of b_vecs\n    ...\n",
      solution: "import math\n\ndef softmax(xs):\n    m = max(xs)\n    es = [math.exp(x - m) for x in xs]\n    s = sum(es)\n    return [e / s for e in es]\n\ndef soft_align(a_vecs, b_vecs):\n    out = []\n    for a in a_vecs:\n        es = [sum(x * y for x, y in zip(a, b)) for b in b_vecs]\n        wts = softmax(es)\n        out.append([sum(wts[j] * b_vecs[j][k] for j in range(len(b_vecs)))\n                    for k in range(len(b_vecs[0]))])\n    return out",
      tests: [
        {
          id: 't1',
          name: { ar: 'درجات متساوية تعطي متوسط الفرضية', en: 'Equal scores return the mean of the hypothesis' },
          code: "r = soft_align([[0.0, 0.0]], [[1.0, 0.0], [0.0, 1.0]])\nassert r == [[0.5, 0.5]], 'a zero query must attend uniformly | got %r' % (r,)",
          expected: '[[0.5, 0.5]]',
        },
        {
          id: 't2',
          name: { ar: 'درجة حادة تركّز الوزن على الأقوى', en: 'A sharp score concentrates the weight' },
          code: "r = soft_align([[10.0, 0.0]], [[1.0, 0.0], [0.0, 1.0]])\nassert r[0][0] > 0.99 and r[0][1] < 0.01, 'attention must focus on the aligned token | got %r' % (r,)",
          expected: 'weight on first token > 0.99',
        },
        {
          id: 't3',
          name: { ar: 'فرضية برمز واحد تعيد المتجه نفسه', en: 'A one-token hypothesis returns that vector' },
          code: "r = soft_align([[0.3, 0.7]], [[0.3, 0.7]])\nassert abs(r[0][0] - 0.3) < 1e-12 and abs(r[0][1] - 0.7) < 1e-12, 'single token: beta must equal b | got %r' % (r,)",
          expected: '[[0.3, 0.7]]',
        },
      ],
      hints: [
        { ar: 'الاستقرار العددي: m = max(xs) ثم exp(x − m) — النتيجة نفسها رياضيا لكنها لا تفيض.', en: 'Numerical stability: m = max(xs) then exp(x − m) — mathematically identical, but it never overflows.' },
        { ar: 'beta_i = مجموع wts[j] * b_vecs[j][k] لكل مكوّن k — قسمان: الأوزان ثم الخلط الموزون.', en: 'beta_i = sum of wts[j] * b_vecs[j][k] per component k — two stages: weights then the weighted mix.' },
        { ar: 'الحالة t1 تكشف خطأ شائعا: نسيان تطبيع الأوزان يجعل beta أكبر من مدخلاتها.', en: 'Case t1 exposes a common bug: forgetting to normalize the weights makes beta larger than its inputs.' },
        { ar: 'قيم تحقق: softmax([10, 0]) ≈ [0.999955, 0.000045] — لهذا حد الاختبار > 0.99 آمن بهامش واسع.', en: 'Sanity values: softmax([10, 0]) ≈ [0.999955, 0.000045] — that is why the > 0.99 test bound is safe with wide margin.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-decomposition',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما فائدة حيلة التفكيك في e_ij = f(a_i)·f(b_j) حيث تطبق f على كل رمز منفردا؟',
        en: 'What does the decomposition trick in e_ij = f(a_i)·f(b_j), with f applied to each token separately, buy us?',
      },
      options: [
        { id: 'a', text: { ar: 'تنخفض تطبيقات f من m×n إلى m+n فتصبح الكلفة خطية في طولي الجملتين', en: 'f applications drop from m×n to m+n, making the cost linear in the two sentence lengths' } },
        { id: 'b', text: { ar: 'تلغي الحاجة إلى متجهات الكلمات المدرَّبة مسبقا', en: 'It removes the need for pretrained word vectors' } },
        { id: 'c', text: { ar: 'تضمن أن كل أوزان الانتباه تصبح 0 أو 1', en: 'It guarantees attention weights become 0 or 1' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'احسبها: f على كل a_i (m مرة) وعلى كل b_j (n مرة) ثم جداءات قياسية رخيصة — بدل f على كل زوج (m×n مرة).', en: 'Count it: f over each a_i (m times) and each b_j (n times) plus cheap dot products — versus f over every pair (m×n times).' },
        { ar: 'النموذج يسمى decomposable لهذا تحديدا: يقبل التفكيك إلى مكونات تُحسب مرة واحدة.', en: 'The model is called decomposable for exactly this: it factors into components computed once.' },
        { ar: 'الانتباه يبقى ناعما بالكامل: أوزان أعداد حقيقية بين 0 و1 مجموعها 1 لكل صف.', en: 'Attention stays fully soft: weights are real numbers in [0, 1] summing to 1 per row.' },
        { ar: 'الجواب: a — ولذلك عُد هذا النموذج بلا RNN ولا التفاف وذو معاملات قليلة.', en: 'Answer: a — which is why this model needs no RNN or convolution and few parameters.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef dot(a, b):\n    return sum(x * y for x, y in zip(a, b))\n\ndef softmax(xs):\n    m = max(xs)\n    es = [math.exp(x - m) for x in xs]\n    s = sum(es)\n    return [e / s for e in es]\n\ndef soft_align(a_vecs, b_vecs):\n    out = []\n    for a in a_vecs:\n        es = [dot(a, b) for b in b_vecs]\n        wts = softmax(es)\n        out.append([sum(wts[j] * b_vecs[j][k] for j in range(len(b_vecs)))\n                    for k in range(len(b_vecs[0]))])\n    return out\n\nA = {'the': [0.1, 0.0], 'child': [0.9, 0.6], 'smiles': [0.5, -0.3]}\nB = {'the': [0.1, 0.0], 'child': [0.9, 0.6], 'is': [0.0, 0.1], 'happy': [0.6, -0.3]}\nptoks, htoks = ['the', 'child', 'smiles'], ['the', 'child', 'is', 'happy']\nbetas = soft_align([A[t] for t in ptoks], [B[t] for t in htoks])\nalphas = soft_align([B[t] for t in htoks], [A[t] for t in ptoks])\nfor t, bta in zip(ptoks, betas):\n    print('beta(%s) = %s' % (t, [round(x, 6) for x in bta]))\nfor t, alp in zip(htoks, alphas):\n    print('alpha(%s) = %s' % (t, [round(x, 6) for x in alp]))\n\n# compare step preview: feed each pair [a_i ; beta_i] to the classifier MLP\ni = ptoks.index('smiles')\nprint('compare input for smiles:', [A['smiles'][0], A['smiles'][1], betas[i][0], betas[i][1]])\n\n# try: sharpen 'happy' to [0.8, -0.5] - does smiles now align to it harder than to child?\n# try: make premise and hypothesis identical - what shape do beta and alpha take?\n",
      prompt: {
        ar: 'الملعب يشغل المحاذاة في الاتجاهين: beta من المقدمة إلى الفرضية وalpha بالعكس، ثم يطبع مدخل المقارنة لرمز smiles. لاحظ أن alpha(happy) لا يساوي beta(smiles) — الاتجاهان مستقلان وهذا جوهر الخطوات الثلاث. جرّب حذف التشابه بين child في الجهتين وراقب أين تهاجر الأوزان.',
        en: 'The sandbox runs alignment both ways: beta from premise to hypothesis and alpha the reverse, then prints the compare input for the smiles token. Note that alpha(happy) is not beta(smiles) — the two directions are independent, the essence of the three steps. Try breaking the child similarity across the two sides and watch where the weights migrate.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'زوج: المقدمة «a man is running» والفرضية «a man is sleeping». ما تسميته في NLI ولماذا يخدع تداخل الكلمات؟',
            en: 'Pair: premise "a man is running", hypothesis "a man is sleeping". What is its NLI label and why does word overlap mislead?',
          },
          options: [
            { id: 'a', text: { ar: 'contradiction — رغم تداخل 3 من 4 كلمات (0.75) فالمقدمة تستلزم نقيض الفرضية', en: 'contradiction — despite 3-of-4 token overlap (0.75), the premise entails the negation of the hypothesis' } },
            { id: 'b', text: { ar: 'entailment — لأن التداخل مرتفع', en: 'entailment — because the overlap is high' } },
            { id: 'c', text: { ar: 'neutral — لأن كلمتي الرجولة والنوم مختلفتان', en: 'neutral — because running and sleeping are different words' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التداخل السطحي أعطى 0.7500 لهذا الزوج و0.7500 لزوج الحياد — الميزة نفسها لعلاقتين مختلفتين تماما. التضاد يُقرأ من الدلالة (running مقابل sleeping) لا من العدّ، ولهذا تحتاج النماذج محاذاة مدربة لا مجرد مفردات مشتركة.',
            en: 'Surface overlap scored 0.7500 for this pair and 0.7500 for the neutral pair — one feature, two totally different relations. Contradiction is read from semantics (running vs sleeping), not counts, which is why models need trained alignment rather than shared-word statistics.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في نموذج الانتباه القابل للتفكيك، ما الذي تنتجه خطوة attending لكل رمز i في المقدمة؟',
            en: 'In the decomposable attention model, what does the attending step produce for each premise token i?',
          },
          options: [
            { id: 'a', text: { ar: 'beta_i: متوسط موزون لرموز الفرضية بأوزان softmax على درجات التوافق e_ij', en: 'beta_i: a softmax-weighted average of hypothesis tokens using alignment scores e_ij' } },
            { id: 'b', text: { ar: 'فهرس الرمز الواحد الأكثر تشابها فقط', en: 'Just the single most similar token index' } },
            { id: 'c', text: { ar: 'تسمية العلاقة مباشرة لكل رمز', en: 'The relation label directly per token' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المحاذاة ناعمة: beta_i = مجموع softmax(e_ij)·b_j، وقد رأينا beta(smiles) يوزع أوزانه على child وhappy معا (0.272418 و0.307150) بدل اختيار واحد. ثم تأتي المقارنة على [a_i; beta_i] والتجميع للتصنيف.',
            en: 'Alignment is soft: beta_i = Σ softmax(e_ij)·b_j — we saw beta(smiles) spread its weight over both child and happy (0.272418 and 0.307150) instead of picking one. Comparing on [a_i; beta_i] and aggregating follow.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يُعد SNLI أساسا جيدا لتدريب نماذج NLI؟',
            en: 'Why is SNLI a good basis for training NLI models?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يضم أكثر من 500000 زوج موسوم بالفئات الثلاث بفضل توليد الفرضيات آليا فيتوازن التسميات', en: 'It holds over 500000 pairs labeled with the three classes; machine-generated hypotheses keep the labels balanced' } },
            { id: 'b', text: { ar: 'لأن كل أمثلته مكتوبة يدويا بخبرة لغوية فلا أخطاء', en: 'Because every example is handcrafted by linguists with no errors' } },
            { id: 'c', text: { ar: 'لأنه يقصر على زوجين لكل مفردة فيسهل حفظه', en: 'Because it limits itself to two pairs per word so it is easy to memorize' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الحجم الكبير والتوازن (فرضيات مولدة من مجيبين بشريين حول كل صورة) يمنحان النموذج تغطية واسعة للعلاقات الثلاث دون انحياز لفئة واحدة. القراءة تمر على مقدمات وفرضيات وقاموس entailment=0 وcontradiction=1 وneutral=2.',
            en: 'The large scale and balance (hypotheses generated by humans for each image) give the model broad coverage of the three relations without biasing any class. Reading yields premises, hypotheses, and the map entailment=0, contradiction=1, neutral=2.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'NLI يصنف الزوج (مقدمة، فرضية) إلى entailment/contradiction/neutral، وSNLI يوفر أكثر من 500000 زوج موسوم بتوازن آلي (الهدف من s4).', en: 'NLI classifies (premise, hypothesis) into entailment/contradiction/neutral, and SNLI supplies 500000+ balanced machine-generated labeled pairs (goal of s4).' },
        { ar: 'تداخل الكلمات ميزة مخادعة: 0.6000 للنزم و0.7500 للتضاد و0.7500 للحياد — العلاقة تتطلب فهم الأزواج الدلالية لا العدّ (الهدف من s4).', en: 'Word overlap is a deceptive feature: 0.6000 for entailment, 0.7500 for contradiction, 0.7500 for neutral — the relation needs semantic pairs, not counts (goal of s4).' },
        { ar: 'المحاذاة الناعمة بالانتباه: e_ij = f(a_i)·f(b_j) بكلفة m+n لا m×n، وbeta_i متوسط موزون للفرضية (beta(smiles) مال إلى happy بوزن 0.307150)، ثم مقارنة وتجميع يصنفا الفئات الثلاث (الهدف من s5).', en: 'Soft attention alignment: e_ij = f(a_i)·f(b_j) at m+n cost not m×n, beta_i a weighted average over the hypothesis (beta(smiles) leaned to happy with weight 0.307150), then compare and aggregate classify the three classes (goal of s5).' },
      ],
      reflectPrompt: {
        ar: 'لو صممت ميزة يدوية واحدة إضافية غير التداخل لتمييز التضاد عن الحياد على أزواجنا الثلاثة، فماذا تكون — وهل تظل صالحة لغات أخرى أم أنها فخ لغة إنجليزية فقط؟',
        en: 'If you could design one extra hand-crafted feature beyond overlap to separate contradiction from neutral on our three pairs, what would it be — and would it still work across other languages, or is it an English-only trap?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch16.s4' },
        { book: 'D2L', section: 'd2l.ch16.s5' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch16.s4' },
    { book: 'D2L', section: 'd2l.ch16.s5' },
  ],
} satisfies Lesson;

export default lesson;
