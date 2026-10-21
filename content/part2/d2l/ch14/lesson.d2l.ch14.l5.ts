import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch14.l5 — "Neural Style Transfer and the Two Kaggle Competitions"
 * نقل الأسلوب العصبي ومنافستا Kaggle
 * Aligned with D2L ch14 s12 (Neural Style Transfer) + s13 (Image Classification
 * (CIFAR-10) on Kaggle) + s14 (Dog Breed Identification on Kaggle). Original
 * paraphrase throughout. Runnable design: the three style-loss terms evaluated
 * at fixed values (Gram matrix, content squared loss, total variation), the
 * weighted sum with weights 1/1e4/10, plus the two competition metrics —
 * accuracy and multiclass log loss — on fixed examples. Every literal verified
 * under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch14.l5',
  version: 1,
  part: 'II',
  track: 'A4',
  book: 'D2L',
  chapter: 14,
  title: {
    ar: 'نقل الأسلوب العصبي ومنافستا Kaggle',
    en: 'Neural Style Transfer and the Two Kaggle Competitions',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch14.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أنت تحتفظ بالمحتوى (جبال مطيرة) وأنا أحتفظ بالأسلوب (لوحة البلوط الخريفية) — وأحدنا لا يرسم. نقل الأسلوب يجعل صورة مُخلَّقة هي المتدرَّب الوحيد بينما شبكة VGG المدرَّبة مسبقًا تجمد كقاضٍ يقيس الخسارة. ثم نغلق الفصل بميدانين حقيقيين: منافستا Kaggle حيث يُقاس كل شيء بمقياس واحد مكتوب في صفحة المسابقة.',
        en: 'You keep the content (a rainy mountain) and I keep the style (an autumn oak painting) — and neither of us paints. Style transfer makes a synthesized image the only trained variable while a pretrained VGG freezes into a judge that measures the loss. We then close the chapter in two real arenas: the Kaggle competitions, where everything is scored by the single metric printed on the competition page.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'أسلوب بلا رسام، ثم مقياس المنافسة', en: 'Style without a painter, then the competition metric' },
      chunks: [
        {
          ar: 'الفكرة: صورة المخرجات المُخلَّقة هي المعامل الوحيد المُحدَّث؛ شبكة VGG-19 المدرَّبة مسبقًا تُجمَّد وتُستخرج منها ملامح الطبقات المختارة. طبقة المحتوى قريبة من الخرج (الفهرس 25 — آخر التفاف في الكتلة الرابعة) لالتقاط الشكل العام، وطبقات الأسلوب أول التفاف في كل كتلة من الخمس (الفهارس 0, 5, 10, 19, 28) لالتقاط الملمس المحلي والعالمي معًا. ملامح المحتوى والأسلوب للصورتين الأصليتين تُحسب قبل التدريب ولا تُلمس بعدها.',
          en: 'The idea: the synthesized output image is the only updated parameter; a pretrained VGG-19 freezes and feeds forward to selected layers. The content layer sits near the output (index 25 — the last conv of the fourth block) to capture global shape, while style layers take the first conv of each of the five blocks (indices 0, 5, 10, 19, 28) to capture both local and global texture. The content and style features of the two source images are computed before training and never touched again.',
        },
        {
          ar: 'الخسارة ثلاثة أجزاء: خسارة المحتوى مربع الفرق بين ملامح المُخلَّقة والمحتوى؛ خسارة الأسلوب مربع الفرق بين مصفوفات غرام — تمثيل ارتباطات القنوات (c×c) بعد قسمة كل عنصر على c·hw حتى لا يطغى حجم الخريطة؛ وخسارة التباين الكلي التي تعاقب فرق البكسل المتجاور لتقليل الضجيج. المجموع الموزون بأوزان الكتاب 1 و1e4 و10 يوازن المحتوى مقابل الأسلوب مقابل النعومة.',
          en: 'The loss has three parts: content loss — the squared difference between synthesized and content features; style loss — the squared difference between Gram matrices, the c×c channel-correlation representations with each element divided by c·hw so map size never dominates; and total variation loss, which penalizes neighboring-pixel differences to cut noise. The weighted sum with the book\u2019s weights 1, 1e4, and 10 balances content against style against smoothness.',
        },
        {
          ar: 'منافسة CIFAR-10: 50000 صورة تدريب و300000 اختبار (10 فقط منها تُقيَّم والبقية عوائق ضد الغش) بـ 10 أصناف وأبعاد 32×32. نرتب الملفات الخام إلى مجلدات لكل صنف ونقسم تحققًا بنسبة r: لكل صنف max(1, ⌊n·r⌋) صور تحقق حيث n أصغر صنف — مع r=0.1 يتدرب 45000 ويتحقق 5000. الزيادة للتدريب فقط، والتطبيع وحده للاختبار، والمقياس الرسمي دقة (accuracy) فتصلح تسميات مفردة في ملف التسليم.',
          en: 'The CIFAR-10 competition: 50000 training and 300000 test images (only 10000 are evaluated; the rest exist to block hand-labeling), 10 classes at 32×32. Raw files are reorganized into per-class folders and a validation split of ratio r takes max(1, ⌊n·r⌋) images per class, n being the smallest class — with r=0.1 that is 45000 train and 5000 valid. Augmentation is training-only, normalization alone at test time, and the official metric is accuracy, so single labels suffice in the submission file.',
        },
        {
          ar: 'منافسة سلالات الكلاب: 120 سلالة و10222 صورة تدريب و10357 اختبار من ImageNet — صور أكبر وأبعادها متفاوتة، فالحل المعياري ضبط دقيق لنموذج مُدرَّب مسبقًا مع زيادة قصّ. المقياس هنا خسارة لوغاريتمية متعددة الأصناف (log loss): تُسلَّم احتمالات softmax لكل سلالة، والخطأ الواثق يعاقب أشد بكثير من الخطأ المرتاب — لذا تُسلَّم احتمالات لا تسميات مفردة.',
          en: 'The dog breed competition: 120 breeds with 10222 training and 10357 test images from ImageNet — larger, size-varied photos — so the canonical solution is fine-tuning a pretrained model with crop augmentation. The metric is multiclass log loss: you submit softmax probabilities per breed, and a confident mistake is punished far more than a hesitant one — hence probabilities, not single labels, go into the submission.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'حدود الخسارة الثلاث بقيم ثابتة + مقياسا المنافستين',
        en: 'The three loss terms at fixed values + the two competition metrics',
      },
      code: "# s12: the three style-transfer loss terms at fixed values\ndef gram(X):     # X: c channels, each a length-n vector (c, n)\n    c, n = len(X), len(X[0])\n    return [[sum(X[i][t] * X[j][t] for t in range(n)) / (c * n)\n             for j in range(c)] for i in range(c)]\n\nX = [[1.0, 2.0, 3.0, 4.0], [0.0, 1.0, 1.0, 0.0]]   # 2 channels, 2x2 spatial\nG = gram(X)\nprint('Gram G[0][0]=%.6f G[0][1]=%.6f G[1][1]=%.6f' % (G[0][0], G[0][1], G[1][1]))\n\ndef content_loss(y_hat, y):\n    n = sum(len(r) for r in y)\n    return sum((a - b) ** 2 for ra, rb in zip(y_hat, y) for a, b in zip(ra, rb)) / n\n\nyhat = [[1.5, 2.0], [3.0, 4.5]]\ny    = [[1.0, 2.0], [3.0, 4.0]]\nprint('content loss:', content_loss(yhat, y))\n\ndef tv_loss(x):\n    h, w = len(x), len(x[0])\n    dv = [abs(x[i][j] - x[i + 1][j]) for i in range(h - 1) for j in range(w)]\n    dh = [abs(x[i][j] - x[i][j + 1]) for i in range(h) for j in range(w - 1)]\n    return 0.5 * (sum(dv) / len(dv) + sum(dh) / len(dh))\n\ngrid = [[0.0, 1.0], [2.0, 4.0]]\nprint('tv loss     :', tv_loss(grid))\n\ncw, sw, tw = 1, 1e4, 10\ntotal = cw * content_loss(yhat, y) + sw * 0.01 + tw * tv_loss(grid)\nprint('total loss  : %.6f' % total)\n\n# s13/s14: the two Kaggle metrics on fixed examples\npreds  = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0]\nlabels = [0, 1, 1, 0, 1, 2, 2, 1, 0, 0]\nacc = sum(p == t for p, t in zip(preds, labels)) / len(labels)\nprint('CIFAR-10 accuracy:', acc)\n\nimport math\ndef log_loss(p_true):\n    return sum(-math.log(p) for p in p_true) / len(p_true)\n\nprint('dogs log loss    : %.6f' % log_loss([0.9, 0.4, 0.1]))\nprint('perfect guesses  :', log_loss([1.0, 1.0]))",
      explanation: {
        ar: 'مصفوفة غرام لقناتين بطول 4 تقسم جداءات النقاط على c·n=8: G[0][0]=(1+4+9+16)/8=3.75 وG[0][1]=0.625 وG[1][1]=0.25. خسارة المحتوى لفروق (0.5, 0, 0, 0.5) تعطي متوسط مربعاتها 0.125، وخسارة التباين الكلي للشبكة [[0,1],[2,4]] تساوي 0.5×(2.5+1.5)=2.0. المجموع بأوزان الكتاب: 0.125 + 0.01×1e4 + 2.0×10 = 120.125 — لاحظ كيف يحكم الأسلوب المجموع لأن وزنه 1e4. أما المقياسان: دقة 7 إصابات من 10 تساوي 0.7، وخسارة لوغاريتمية لاحتمالات حقيقية [0.9, 0.4, 0.1] تعطي 1.108079، والثقة التامة تعطي 0.0.',
        en: 'A Gram matrix for two channels of length 4 divides dot products by c·n=8: G[0][0]=(1+4+9+16)/8=3.75, G[0][1]=0.625, G[1][1]=0.25. The content loss over differences (0.5, 0, 0, 0.5) is the mean square 0.125, and total variation on the grid [[0,1],[2,4]] is 0.5×(2.5+1.5)=2.0. The weighted sum with the book\u2019s weights: 0.125 + 0.01×1e4 + 2.0×10 = 120.125 — note how style dominates because its weight is 1e4. The two metrics: 7 of 10 correct predictions give accuracy 0.7, log loss for true-class probabilities [0.9, 0.4, 0.1] is 1.108079, and perfect confidence scores 0.0.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.competition-metrics',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ مقياسي المنافستين: accuracy(preds, labels) الذي يعيد نسبة التطابق، وlog_loss(p_true) الذي يعيد −معدل اللوغاريتم الطبيعي لاحتمالات الصنف الحقيقي (استخدم math.log). احتمال 1.0 مثالي وخسارته صفر.',
        en: 'Implement the two competition metrics: accuracy(preds, labels) returning the match rate, and log_loss(p_true) returning the negative mean of the natural log of true-class probabilities (use math.log). A probability of 1.0 is perfect and costs zero.',
      },
      starterCode: "import math\n\ndef accuracy(preds, labels):\n    # TODO: fraction of positions where preds[i] == labels[i]\n    ...\n\ndef log_loss(p_true):\n    # TODO: -mean(ln p) over the true-class probabilities\n    ...\n",
      solution: "import math\n\ndef accuracy(preds, labels):\n    return sum(p == t for p, t in zip(preds, labels)) / len(labels)\n\ndef log_loss(p_true):\n    return sum(-math.log(p) for p in p_true) / len(p_true)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الدقة على عشر توقعات ثابتة = 0.7', en: 'Accuracy over ten fixed predictions is 0.7' },
          code: "got = accuracy([0, 1, 2, 0, 1, 2, 0, 1, 2, 0], [0, 1, 1, 0, 1, 2, 2, 1, 0, 0])\nassert abs(got - 0.7) < 1e-9, 'expected 0.7 | got %r' % (got,)",
          expected: '0.7',
        },
        {
          id: 't2',
          name: { ar: 'خسارة لوغاريتمية لثلاث احتمالات = 1.108079', en: 'Log loss over three probabilities is 1.108079' },
          code: "got = log_loss([0.9, 0.4, 0.1])\nassert abs(got - 1.1080787801753422) < 1e-9, 'expected ~1.108079 | got %r' % (got,)",
          expected: '1.108079 (abs err < 1e-9)',
        },
        {
          id: 't3',
          name: { ar: 'الثقة التامة تكلف صفرًا والدقة الكاملة واحدًا', en: 'Perfect confidence costs 0 and full accuracy is 1' },
          code: "assert log_loss([1.0, 1.0]) == 0.0, 'perfect confidence must cost 0'\nassert accuracy([1, 2], [1, 2]) == 1.0, 'all correct must give 1.0'",
          expected: '0.0 and 1.0',
        },
      ],
      hints: [
        { ar: 'الدقة: تكرار ثنائي مع zip يعدّ التطابقات ثم يقسم على الطول.', en: 'Accuracy: a zip loop counts matches, then divides by the length.' },
        { ar: 'الخسارة: اجمع −ln(p) لكل احتمال واقسم على العدد — احتمال ضعيف مثل 0.1 يكلف 2.302585 وحده.', en: 'Log loss: sum −ln(p) over the probabilities and divide by the count — a weak probability like 0.1 alone costs 2.302585.' },
        { ar: 'احذر أن math.log(0) ينهار — الاحتمالات المسلَّمة تكون موجبة تمامًا (softmax لا يعطي صفرًا تامًا).', en: 'Beware math.log(0) crashes — submitted probabilities are strictly positive (softmax never outputs exact zero).' },
        { ar: 'قيمة تحقق: (−ln0.9 − ln0.4 − ln0.1)/3 = 1.1080787801753422.', en: 'Sanity: (−ln0.9 − ln0.4 − ln0.1)/3 = 1.1080787801753422.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.style-total',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بأوزان الكتاب (المحتوى 1، الأسلوب 1e4، التباين الكلي 10) وعند قيم حدود: محتوى 0.125 وأسلوب 0.01 وتباين 2.0 — كم يساوي مجموع الخسارة الموزون؟ (اكتب رقمًا عشريًا)',
        en: 'With the book\u2019s weights (content 1, style 1e4, total variation 10) and boundary values content 0.125, style 0.01, TV 2.0 — what is the weighted total loss? (Enter a decimal number)',
      },
      answer: '120.125',
      solution: '120.125',
      tolerance: 0.01,
      hints: [
        { ar: 'الوزن مضروبًا في كل حد: 1×0.125 ثم 1e4×0.01 ثم 10×2.0.', en: 'Multiply each term by its weight: 1×0.125, then 1e4×0.01, then 10×2.0.' },
        { ar: 'حدود مرجحة: 0.125 و100 و20.', en: 'Weighted terms: 0.125, 100, and 20.' },
        { ar: 'الجواب: 0.125 + 100 + 20 = 120.125.', en: 'Answer: 0.125 + 100 + 20 = 120.125.' },
        { ar: 'لاحظ أن حد الأسلوب يستحوذ على ~83% من المجموع — لهذا تُضبط أوزانه بعناية.', en: 'Notice the style term owns ~83% of the total — that is why its weight is tuned carefully.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# Style-weight explorer: fixed per-term losses, different weight triples.\ncontent_l, style_l, tv_l = 0.125, 0.01, 2.0\nfor cw, sw, tw in [(1, 1e4, 10), (1, 1e3, 10), (10, 1e4, 1)]:\n    total = cw * content_l + sw * style_l + tw * tv_l\n    print('cw=%-4g sw=%-6g tw=%-3g -> total %.4f | style share %.1f%%'\n          % (cw, sw, tw, total, 100 * sw * style_l / total))\n\n# s13/s14: the validation split rule used by both competitions.\nimport math\nfor n_least, r in [(500, 0.1), (85, 0.1), (85, 0.2)]:\n    print('least class %d, ratio %.1f -> valid per class %d'\n          % (n_least, r, max(1, math.floor(n_least * r))))\n\n# جرّب: اختر وزنًا يجعل حد الأسلوب أقل من 50% من المجموع، ثم اشرح لماذا يظهر المخرج\n# أكثر محتوى أو أقل ضجيجًا بحسب الحد المسيطر.\n# try: pick a weight making the style term under 50% of the total, then explain why\n# the output shows more content or less noise depending on the dominant term.\n# جرّب: احسب خسارة لوغاريتمية لاحتمالات [0.7, 0.7, 0.7] وقارنها بـ [0.4, 0.4, 0.4]\n# لتشعر بعقاب الثقة المضللة.\n# try: compute log loss for [0.7, 0.7, 0.7] versus [0.4, 0.4, 0.4] to feel how\n# misleading confidence is punished.\n",
      prompt: {
        ar: 'الملعب يستكشف التوازن: بحدود خسارة ثابتة يجرّب ثلاث ثلاثيات أوزان ويطبع حصة الأسلوب من المجموع (83.2% ثم 33.2% ثم 96.9%) — رؤية مباشرة لسبب أن وزن 1e4 يجعل المُخلَّقة يطارد النمط اللوني. ثم يطبّق قاعدة قسم التحقق المشتركة بين المنافستين max(1, ⌊n·r⌋) على أصغر صنف.',
        en: 'The sandbox explores the balance: with fixed per-term losses it tries three weight triples and prints the style share of the total (83.2%, then 33.2%, then 96.9%) — a direct view of why the 1e4 weight makes the synthesized image chase the color pattern. It then applies both competitions\u2019 shared validation rule max(1, ⌊n·r⌋) to the least-populated class.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما المتغير الوحيد المُحدَّث أثناء تدريب نقل الأسلوب؟',
            en: 'What is the only variable updated during style-transfer training?',
          },
          options: [
            { id: 'a', text: { ar: 'معاملات شبكة VGG المستخرجة للملامح', en: 'The parameters of the feature-extracting VGG network' } },
            { id: 'b', text: { ar: 'بكسلات الصورة المُخلَّقة نفسها', en: 'The pixels of the synthesized image itself' } },
            { id: 'c', text: { ar: 'أوزان طبقة المحتوى فقط', en: 'Only the weights of the content layer' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشبكة المستخرجة مجمدة تمامًا؛ المُدرَّب الوحيد هو صورة المخرجات المُخلَّقة التي تعامل كمعاملات نموذج ويُحدَّثها المُحسِّن حتى تقل الخسارة الموزونة.',
            en: 'The extracting network is fully frozen; the only thing trained is the synthesized output image, treated as model parameters and updated by the optimizer until the weighted loss falls.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا تمثل مصفوفة غرام في خسارة الأسلوب ولماذا تقسم على c·hw؟',
            en: 'What does the Gram matrix represent in the style loss, and why divide by c·hw?',
          },
          options: [
            { id: 'a', text: { ar: 'ارتباطات بين قنوات الملامح، والقسمة تمنع أن تسيطر خرائط كبيرة على الخسارة', en: 'Correlations between feature channels; the division stops large maps from dominating the loss' } },
            { id: 'b', text: { ar: 'مواضع الحواف، والقسمة تطبّع الألوان', en: 'Edge locations; the division normalizes colors' } },
            { id: 'c', text: { ar: 'الفروق بين الصورة المُخلَّقة والمحتوى، والقسمة تسرّع التقارب', en: 'Differences between the synthesized and content images; the division speeds convergence' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'غرام لطبقة بأبعاد (1, c, h, w) هو X·Xᵀ بعد تسطيح كل قناة إلى متجه طولها hw: العنصر (i, j) حاصل ضرب نقطي بين قناتين فيقيس ارتباط ملمسهما. بما أن قيمه تكبر مع hw تقسم المصفوفة على عدد عناصرها c·hw لتظل الخسارة قابلة للمقارنة بين الطبقات.',
            en: 'For a layer of shape (1, c, h, w), the Gram matrix is X·Xᵀ after flattening each channel to a length-hw vector: entry (i, j) is a dot product of two channels, measuring how their textures co-occur. Since values grow with hw, dividing by the element count c·hw keeps the loss comparable across layers.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا تُسلَّم احتمالات (لا تسميات مفردة) في منافسة سلالات الكلاب؟',
            en: 'Why are probabilities (not single labels) submitted in the dog breed competition?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن مقياسها خسارة لوغاريتمية تعاقب الثقة الخاطئة بعنف، فالاحتمالات تفصح عن الريبة', en: 'Its metric is log loss, which punishes wrong confidence harshly, so probabilities express uncertainty' } },
            { id: 'b', text: { ar: 'لأن صيغة التسليم لا تقبل أرقام الأصناف', en: 'Because the submission format does not accept class ids' } },
            { id: 'c', text: { ar: 'لأن الاحتمالات تجعل التقييم أسرع', en: 'Because probabilities make evaluation faster' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الخسارة اللوغاريتمية −ln(p الحقيقي) تنفجر مع الثقة الخاطئة (احتمال 0.01 للصنف الصحيح يكلف 4.6) بينما يكلف التردد أقل؛ لذا تُسلَّم مخرجات softmax كاملة. في المقابل مقياس CIFAR-10 دقة فيكفي التسمية المفردة.',
            en: 'Log loss −ln(p_true) explodes on misplaced confidence (0.01 for the true class costs 4.6) while hesitation costs less, so full softmax outputs are submitted. By contrast CIFAR-10\u2019s metric is accuracy, where a single label suffices.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'نقل الأسلوب يُدرَّب صورة مُخلَّقة وحدها عبر شبكة VGG مجمدة: خسارة محتوى (مربع فرق الملامح) وأسلوب (مربع فرق مصفوفات غرام) وتباين كلي (جيران أقل اختلافًا) بأوزان 1/1e4/10 (هدف s12 نقل الأسلوب العصبي).', en: 'Style transfer trains only the synthesized image through a frozen VGG: content loss (squared feature difference), style loss (squared Gram-matrix difference), and total variation (calmer neighbors) weighted 1/1e4/10 (goal of s12 Neural Style Transfer).' },
        { ar: 'منافسة CIFAR-10 على Kaggle: تنظيم الملفات الخام في مجلدات أصناف، تقسيم تحقق max(1, ⌊n·r⌋) لكل صنف، زيادة للتدريب فقط، ومقياس رسمي دقة (هدف s13 تصنيف CIFAR-10 على Kaggle).', en: 'The CIFAR-10 Kaggle competition: reorganize raw files into per-class folders, split a validation set of max(1, ⌊n·r⌋) per class, augment training only, and the official metric is accuracy (goal of s13 Image Classification (CIFAR-10) on Kaggle).' },
        { ar: 'منافسة سلالات الكلاب: 120 سلالة و10222 صورة تدريب، ضبط دقيق لنموذج مسبق، ومقياس خسارة لوغاريتمية متعددة الأصناف يفرض تسليم احتمالات softmax لا تسميات (هدف s14 تحديد سلالات الكلاب على Kaggle).', en: 'The dog breed competition: 120 breeds, 10222 training images, fine-tuning of a pretrained model, and a multiclass log-loss metric that mandates submitting softmax probabilities rather than labels (goal of s14 Dog Breed Identification on Kaggle).' },
      ],
      reflectPrompt: {
        ar: 'لو خضت المنافستين: أي خطأ أسوأ في مقياس الكلاب — توقع صحيح بثقة 0.4 أم خاطئ بثقة 0.9؟ احسب الاثنين بخسارة لوغاريتمية وقرر، ثم عمّم الدرس على مواضيع تستثمر فيها الثقة.',
        en: 'If you entered the dog competition: which is worse on the log-loss metric — a correct prediction at 0.4 confidence or a wrong one at 0.9? Compute both and generalize the lesson to problems where confidence is a product.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch14.s12' },
        { book: 'D2L', section: 'd2l.ch14.s13' },
        { book: 'D2L', section: 'd2l.ch14.s14' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch14.s12' },
    { book: 'D2L', section: 'd2l.ch14.s13' },
    { book: 'D2L', section: 'd2l.ch14.s14' },
  ],
} satisfies Lesson;

export default lesson;
