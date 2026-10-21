import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch20.l1 — "Generative Adversarial Networks: the Minimax Game and DCGAN"
 * الشبكات التوليدية التضادية: لعبة التقابل الأدنى-الأعلى و DCGAN
 * Aligned with D2L ch20 s1 (Generative Adversarial Networks) + s2 (Deep
 * Convolutional GANs). All expression is original — a paraphrase of the
 * source's ideas, never a verbatim translation. Runnable design: minimax
 * loss values for fixed D(x)/G(z) logits plus the DCGAN shape arithmetic
 * (transposed-conv and conv output formulas). Every literal verified under
 * CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch20.l1',
  version: 1,
  part: 'II',
  track: 'A8',
  book: 'D2L',
  chapter: 20,
  title: {
    ar: 'الشبكات التوليدية التضادية: لعبة التقابل الأدنى-الأعلى و DCGAN',
    en: 'Generative Adversarial Networks: the Minimax Game and DCGAN',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch18.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل شبكاتك حتى الآن كانت تمييزية: من الصورة إلى التصنيف. لكن كيف تولّد صورة جديدة تشبه عالمك التدريبي؟ فكرة 2014 الذكية: لا تُصمم مولدًا بمعزل — اجعله يتنافس مع مميّز خبير في كشف المزيف، فكلما صار المميز أشطر اضطر المولد للاحتال أعمق، حتى يعجز حتى أقوى مصنِّف عن الفصل بين الحقيقي والمولَّد. سنحسب قيم الخسارة بأيدينا على أعداد لوغت ثابتة، ثم نتتبع جدول أشكال DCGAN طبقة طبقة.',
        en: 'Every network you built so far was discriminative: image in, label out. But how do you generate a new image that resembles your training world? The clever 2014 idea: do not design a generator in isolation — make it compete against a discriminator expert at spotting fakes, so as the judge sharpens, the counterfeiter must dig deeper, until even a strong classifier cannot separate real from generated. We will compute the loss values by hand on fixed logits, then trace the DCGAN shape table layer by layer.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'لعبة التقابل: المميّز والمولّد', en: 'The adversarial game: discriminator versus generator' },
      chunks: [
        {
          ar: 'النمذجة التوليدية تريد عينات جديدة من توزيع البيانات نفسه، والاختبار الإحصائي المرافق هو اختبار العينتين: هل X و X′ من التوزيع ذاته؟ الشبكات التضادية تستخدم هذا الاختبار بنّاءً: المولد G يحول متجه كامن z (مسحوب من ضوضاء بسيطة) إلى بيانات مزيفة x′ = G(z)، والمميز D مصنِّف ثنائي يعيد D(x) = σ(o) احتمال أن x حقيقي. التوليد جيد إذا عجز المميز عن الفصل — وهذه إشارة تدريب كاملة للمولد.',
          en: 'Generative modelling wants fresh samples from the data distribution itself, and the companion statistical tool is the two-sample test: do X and X\u2032 come from the same distribution? GANs use that test constructively: the generator G maps a latent vector z (drawn from simple noise) to fake data x\u2032 = G(z), while the discriminator D is a binary classifier outputting D(x) = σ(o), the probability that x is real. Generation succeeds when the discriminator can no longer separate the two — and that verdict doubles as a training signal for the generator.',
        },
        {
          ar: 'الرياضيات لعبة تقابل أدنى-أعلى. المميز يقلل خسارة الإنتروبيا المتقاطعة: min_D { −y log D(x) − (1−y) log(1−D(x)) } — يعامل الحقيقي بعلامة y=1 والمزيف بعلامة y=0. المولد يخدع: يريد D(G(z)) ≈ 1. الصيغة الأصلية max_G −log(1−D(G(z))) تشبع (تتلاشى تدرجاتها) حين يصبح المميز واثقًا بالرفض، لذا يُستخدم عمليًا المكافئ غير المشبع min_G −log(D(G(z))) — أي إطعام المزيف للمميز بعلامة 1. الهدف الشامل: min_D max_G { −E_x log D(x) − E_z log(1−D(G(z))) }. عند التوازن المثالي D(x) = 1/2 لكل شيء وكل حدود تساوي log 2 — وهي القيمة 0.693 التي ظهرت في تدريب الكتاب لحظة البدء.',
          en: 'The mathematics is a minimax game. The discriminator minimizes cross-entropy: min_D { \u2212y log D(x) \u2212 (1\u2212y) log(1\u2212D(x)) } — real data labeled y=1, fake y=0. The generator wants D(G(z)) \u2248 1. The original form max_G \u2212log(1\u2212D(G(z))) saturates (its gradients vanish) once the discriminator confidently rejects, so practice uses the non-saturating equivalent min_G \u2212log(D(G(z))) — feeding the fake to the discriminator labeled 1. The full objective: min_D max_G { \u2212E_x log D(x) \u2212 E_z log(1\u2212D(G(z))) }. At the ideal equilibrium D(x) = 1/2 everywhere and every term equals log 2 — the 0.693 the book\u2019s training loop printed at the very first epoch.',
        },
        {
          ar: 'DCGAN تنقل اللعبة إلى الصور بقوسين متناظرين: المولد سلسلة كتل من التفاف منقول (transposed convolution) ثم تطبيع دفعي ثم ReLU، يكبّر من متجه z إلى صورة 64×64 عبر مضاعفة الأبعاد كل كتلة، وتنتهي بطبقة tanh لإخراج القيم في (−1, 1)؛ والمميز مرآته: التفاف عادي بنفس المعاملات مع Leaky ReLU الذي يترك ميلًا صغيرًا α للقيم السالبة فيعالج مشكلة «ReLU الميت». الحساب الهندسي: للتفاق المنقول من n إلى k + s(n−1) − 2p، وللتفاق العادي إلى ⌊(n − k + 2p + s)/s⌋ — سنطبقهما على الأعداد الحرفية في المثال.',
          en: 'DCGAN moves the game to images with two mirrored stacks: the generator chains blocks of transposed convolution, batch normalization, and ReLU, growing a latent vector into a 64\u00D764 image by doubling spatial size each block, and ends with tanh to emit values in (\u22121, 1); the discriminator mirrors it with plain convolutions of the same hyperparameters plus Leaky ReLU, which keeps a small slope \u03B1 for negative inputs and cures the dying-ReLU problem. The geometry: a transposed convolution maps n to k + s(n\u22121) \u2212 2p, a plain one to \u230A(n \u2212 k + 2p + s)/s\u230B — we apply both to literal numbers in the worked example.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'قيم الخسارة على لوغت ثابتة + جدول أشكال DCGAN',
        en: 'Loss values on fixed logits + the DCGAN shape table',
      },
      code: "import math\n\ndef sigmoid(o):\n    return 1.0 / (1.0 + math.exp(-o))\n\ndef softplus(o):\n    return math.log(1.0 + math.exp(o))\n\n# fixed discriminator logits for one real and one fake sample\nO_REAL, O_FAKE = 2.0, -1.0\nprint('D(x)    = sigmoid(%.1f) = %.6f' % (O_REAL, sigmoid(O_REAL)))\nprint('D(G(z)) = sigmoid(%.1f) = %.6f' % (O_FAKE, sigmoid(O_FAKE)))\n\n# discriminator loss (y = 1 for real, y = 0 for fake); softplus identity:\n# -log(sigmoid(o)) = softplus(-o) and -log(1 - sigmoid(o)) = softplus(o)\nl_real = softplus(-O_REAL)\nl_fake = softplus(O_FAKE)\nl_D = 0.5 * (l_real + l_fake)\nprint('loss_D: real %.6f + fake %.6f -> mean %.6f' % (l_real, l_fake, l_D))\n\n# generator loss on the SAME fake sample, two rival forms\nl_G_sat  = -math.log(1.0 - sigmoid(O_FAKE))    # (20.1.2) saturating\nl_G_nsat = -math.log(sigmoid(O_FAKE))          # (20.1.3) non-saturating\nprint('loss_G: saturating %.6f vs non-saturating %.6f' % (l_G_sat, l_G_nsat))\n\nprint('at equilibrium every term = log 2 = %.6f' % softplus(0.0))\n\n# DCGAN shape arithmetic (k = 4 everywhere)\ndef tconv(n, k=4, s=2, p=1):\n    return k + s * (n - 1) - 2 * p\n\ndef conv(n, k=4, s=2, p=1):\n    return (n - k + 2 * p + s) // s\n\ng = [1]\ng.append(tconv(g[-1], 4, 1, 0))          # latent 1x1 -> 4x4 (stride 1, no pad)\nfor _ in range(4):\n    g.append(tconv(g[-1]))               # double each block: 8, 16, 32, 64\nprint('generator sizes: %s -> final (3, 64, 64) with tanh' % g)\n\nd = [64]\nfor _ in range(4):\n    d.append(conv(d[-1]))                # halve: 32, 16, 8, 4\nprint('discriminator sizes: %s -> final conv (k=4, s=1, p=0): %d' % (d, conv(4, 4, 1, 0)))\nprint('generator channels: 100 -> %d -> %d -> %d -> %d -> 3' % (64 * 8, 64 * 4, 64 * 2, 64))",
      explanation: {
        ar: 'قيم اللوغت: D(x) = 0.880797 للعينة الحقيقية و D(G(z)) = 0.268941 للمزيفة — مميز يفكر بحرص. خسارته: الحقيقي softplus(−2) = 0.126928 والمزيف softplus(−1) = 0.313262 فالمتوسط 0.220095. المولد على نفس المزيف: الصيغة المشبعة −log(1−D) تعطي 0.313262 (مطابقة لخسارة المميز على المزيف — نفس الرياضيات)، بينما غير المشبعة −log(D) تعطي 1.313262: أكبر، لكن تدرجاتها تنجو حين يكون المميز واثقًا بالرفض. وعند التوازن (كل مخرجات 0.5) كل حد = log 2 = 0.693147 — نفس القيمة التي طبعها تدريب الكتاب عند أول دورة. الأشكال: المولد يمر 1→4→8→16→32→64 بقنوات 100→512→256→128→64→3، والمميز يعكس: 64→32→16→8→4→1 بقنوات 3→64→128→256→512→1.',
        en: 'Logits: D(x) = 0.880797 for the real sample and D(G(z)) = 0.268941 for the fake — a cautious discriminator. Its loss: real softplus(\u22122) = 0.126928 plus fake softplus(\u22121) = 0.313262, mean 0.220095. The generator on the same fake: the saturating form \u2212log(1\u2212D) gives 0.313262 (identical to the discriminator\u2019s fake term — same mathematics), while the non-saturating \u2212log(D) gives 1.313262: larger, but its gradients survive when the discriminator is confident in rejection. At equilibrium (all outputs 0.5) every term is log 2 = 0.693147 — the value the book\u2019s training loop printed at epoch one. Shapes: the generator flows 1\u21924\u21928\u219216\u219232\u219264 with channels 100\u2192512\u2192256\u2192128\u219264\u21923, and the discriminator mirrors it: 64\u219232\u219216\u21928\u21924\u21921 with channels 3\u219264\u2192128\u2192256\u2192512\u21921.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.bce-logit',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ bce_logit(o, y) التي تعيد خسارة الإنتروبيا المتقاطعة من اللوغيت o مباشرة (بدون حساب sigmoid): softplus(o) إذا كان y = 0 و softplus(−o) إذا كان y = 1، حيث softplus(x) = log(1 + eˣ). استعن باختصار الخصائص المتناظرة.',
        en: 'Implement bce_logit(o, y) computing cross-entropy directly from the logit o (never materializing sigmoid): softplus(o) when y = 0 and softplus(\u2212o) when y = 1, where softplus(x) = log(1 + e\u02E3). Lean on the symmetric identities.',
      },
      starterCode: "import math\n\ndef softplus(x):\n    return math.log(1.0 + math.exp(x))\n\ndef bce_logit(o, y):\n    # TODO: softplus(o) for y == 0, softplus(-o) for y == 1\n    pass\n",
      solution: "import math\n\ndef softplus(x):\n    return math.log(1.0 + math.exp(x))\n\ndef bce_logit(o, y):\n    return softplus(o) if y == 0 else softplus(-o)",
      tests: [
        {
          id: 't1',
          name: { ar: 'قيم مرجعية على لوغت الدرس', en: 'Reference values on the lesson logits' },
          code: "assert abs(bce_logit(2.0, 1) - 0.12692801104297263) < 1e-9, 'got %r' % bce_logit(2.0, 1)\nassert abs(bce_logit(-1.0, 0) - 0.3132616875182229) < 1e-9, 'got %r' % bce_logit(-1.0, 0)\nassert abs(bce_logit(-1.0, 1) - 1.3132616875182229) < 1e-9, 'got %r' % bce_logit(-1.0, 1)",
          expected: '0.126928, 0.313262, 1.313262',
        },
        {
          id: 't2',
          name: { ar: 'تناظر الأدوار: تبديل العلامة يبدل الدور', en: 'Role symmetry: flipping the sign swaps the role' },
          code: "for o in (0.7, -1.3, 2.5):\n    assert abs(bce_logit(o, 1) - bce_logit(-o, 0)) < 1e-12, 'y=1 with logit o must equal y=0 with logit -o'",
          expected: 'bce(o, 1) == bce(-o, 0)',
        },
        {
          id: 't3',
          name: { ar: 'متوسط خسارة المميز لحظة الدرس', en: 'The lesson\u2019s discriminator mean loss' },
          code: "l_D = 0.5 * (bce_logit(2.0, 1) + bce_logit(-1.0, 0))\nassert abs(l_D - 0.22009484928059776) < 1e-9, 'got %r' % l_D\nassert abs(bce_logit(0.0, 1) - math.log(2.0)) < 1e-12, 'a logit of 0 is the equilibrium: log 2'",
          expected: '0.22009484928059776; equilibrium = log 2',
        },
      ],
      hints: [
        { ar: 'المفتاح المتناظر: −log(σ(o)) = softplus(−o) و −log(1 − σ(o)) = softplus(o) — تحقق منهما بالجبر قبل البرمجة.', en: 'The symmetric key: \u2212log(σ(o)) = softplus(\u2212o) and \u2212log(1 \u2212 σ(o)) = softplus(o) — verify both algebraically before coding.' },
        { ar: 'سطر واحد يكفي: return softplus(o) if y == 0 else softplus(-o) — لا حاجة لاستدعاء math.exp مرتين.', en: 'One line suffices: return softplus(o) if y == 0 else softplus(-o) — no need to call math.exp twice.' },
        { ar: 'قيم تحقق: softplus(2) = log(1 + e²) ≈ 2.126928؟ انتبه — الخسارة الحقيقية (y=1) هي softplus(−2) ≈ 0.126928 لا العكس.', en: 'Sanity values: softplus(2) = log(1 + e\u00B2) \u2248 2.126928 — careful, the real-sample loss (y=1) is softplus(\u22122) \u2248 0.126928, not the other way.' },
        { ar: 'الاختبار الثالث يكرر حساب الدرس: متوسط الحدين 0.126928 و 0.313262 يساوي 0.220095 تقريبًا، وعند o=0 تكون الخسارة log 2.', en: 'The third test replays the lesson: the mean of 0.126928 and 0.313262 is about 0.220095, and at o=0 the loss is log 2.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-tconv-shape',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'كتلة مولد DCGAN: التفاف منقول بنواة 4×4 وخطوة 2 ولوح 1 على مدخل عرضه n = 16. ما عرض المخرج؟ (معادلة الكتاب: k + s(n−1) − 2p.)',
        en: 'A DCGAN generator block: a transposed convolution with a 4\u00D74 kernel, stride 2, padding 1 applied to an input of width n = 16. What is the output width? (Book equation: k + s(n\u22121) \u2212 2p.)',
      },
      answer: '32',
      solution: '32',
      hints: [
        { ar: 'عوّض مباشرة: k=4، s=2، p=1، n=16 في k + s(n−1) − 2p.', en: 'Substitute directly: k=4, s=2, p=1, n=16 into k + s(n\u22121) \u2212 2p.' },
        { ar: '4 + 2×15 − 2 = 32 — الكتلة تضاعف العرض، كما في معادلة الكتاب 20.2.1.', en: '4 + 2\u00D715 \u2212 2 = 32 — the block doubles the width, exactly as the book\u2019s equation 20.2.1 shows.' },
        { ar: 'للمقارنة: التفاق العادي بنفس المعاملات يقسم العرض على 2 (16 → 8) — هو المرآة المضادة للتفاف المنقول.', en: 'For contrast: a plain convolution with the same settings halves the width (16 \u2192 8) — the anti-mirror of the transposed one.' },
        { ar: 'الجواب: 32 — ولذلك سلسلة كتل المولد تمر 4 → 8 → 16 → 32 → 64.', en: 'Answer: 32 — which is why the generator\u2019s block chain flows 4 \u2192 8 \u2192 16 \u2192 32 \u2192 64.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef sigmoid(o):\n    return 1.0 / (1.0 + math.exp(-o))\n\ndef softplus(o):\n    return math.log(1.0 + math.exp(o))\n\nprint('loss table: o -> D(o), bce(y=1), bce(y=0)')\nfor o in (-3.0, -1.0, 0.0, 1.0, 3.0):\n    print('  o=%+.1f  D=%.6f  real-loss=%.6f  fake-loss=%.6f'\n          % (o, sigmoid(o), softplus(-o), softplus(o)))\n\ndef tconv(n, k=4, s=2, p=1):\n    return k + s * (n - 1) - 2 * p\n\ndef conv(n, k=4, s=2, p=1):\n    return (n - k + 2 * p + s) // s\n\nprint('shape playground (k=4):')\nfor (n, s, p) in ((1, 1, 0), (4, 2, 1), (16, 2, 1), (32, 2, 1)):\n    print('  tconv n=%d, s=%d, p=%d -> %d' % (n, s, p, tconv(n, 4, s, p)))\nfor n in (64, 32, 16, 8, 4):\n    print('  conv  n=%d, s=2, p=1 -> %d' % (n, conv(n, 4, 2, 1)))\n\n# جرّب: أي لوغيت يجعل خسارة المميز على العينة الحقيقية تساوي خسارته على المزيفة؟ وما قيمتها؟\n# try: which logit makes the discriminator's real-sample loss equal its fake-sample loss, and what is that value?\n# جرّب: صمم مولدًا ينتج 128×128 بدل 64×64: كم كتلة تضيف وما قنواتها؟\n# try: design a generator producing 128x128 instead of 64x64: how many blocks do you add and with which channels?\n",
      prompt: {
        ar: 'الملعب يجمع وجهي الدرس: جدول خسائر على لوغت متناظرة يُظهر التوازن عند o=0 (كل القيم log 2)، وحاسبة أشكال تختبر معادلتا التفاف المنقول والعادي. لاحظ التماثل التام: خسارة «حقيقي» عند o هي خسارة «مزيف» عند −o.',
        en: 'The sandbox joins both halves of the lesson: a loss table over symmetric logits exhibits the equilibrium at o=0 (every value log 2), and a shape calculator exercises the transposed and plain convolution formulas. Note the perfect symmetry: the real-loss at o equals the fake-loss at \u2212o.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما صيغة لعبة التقابل الشاملة بين المميز D والمولد G؟',
            en: 'What is the comprehensive minimax objective between discriminator D and generator G?',
          },
          options: [
            { id: 'a', text: { ar: 'min_D max_G { −E_x log D(x) − E_z log(1−D(G(z))) }', en: 'min_D max_G { \u2212E_x log D(x) \u2212 E_z log(1\u2212D(G(z))) }' } },
            { id: 'b', text: { ar: 'min_D min_G { E_x log D(x) + E_z log D(G(z)) }', en: 'min_D min_G { E_x log D(x) + E_z log D(G(z)) }' } },
            { id: 'c', text: { ar: 'max_D max_G { D(x) − D(G(z)) } — الفارق الخام بين الاحتمالات', en: 'max_D max_G { D(x) \u2212 D(G(z)) } — the raw gap between the two probabilities' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المميز يقلل (يميّز الحقيقي من المزيف) والمولد يعظم داخل نفس التعبير (يخدع المميز): الدلالة السالبة للوغاريتم على بيانات حقيقية وعلى المزيف بعلامة 1−D. في المثال المُشغَّل ظهر حدّا التعبير كـ 0.126928 (حقيقي) و 0.313262 (مزيف) عند لوغت 2.0 و −1.0.',
            en: 'The discriminator minimizes (separate real from fake) and the generator maximizes inside the same expression (fool the discriminator): negative log-likelihoods over real data and over fakes with the 1\u2212D term. In the worked example the two terms appeared as 0.126928 (real) and 0.313262 (fake) at logits 2.0 and \u22121.0.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا يُفضَّل على المولد فقد non-saturating ‏−log D(G(z)) بدل الأصل −log(1−D(G(z)))؟',
            en: 'Why do practitioners prefer the non-saturating generator loss \u2212log D(G(z)) over the original \u2212log(1\u2212D(G(z)))?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الأصلية تشبع عندما يرفض المميز بثقة (D(G(z)) صغير) فتتلاشى التدرجات، بينما غير المشبعة تظل منحدرة حادة', en: 'The original saturates when the discriminator confidently rejects (small D(G(z))) and its gradients vanish, while the non-saturating form keeps a steep slope' } },
            { id: 'b', text: { ar: 'لأنها تقلل حساب exp بمرة واحدة فقط', en: 'Because it saves one exp evaluation' } },
            { id: 'c', text: { ar: 'لأن الأصلية تجعل المولد يفوز دائمًا فيتحطم التوازن', en: 'Because the original makes the generator always win, breaking the equilibrium' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأرقام في المثال حسمتها: على نفس المزيف (لوغيت −1) أعطت المشبعة 0.313262 وغير المشبعة 1.313262. القيمة الأكبر ليست جشعًا بل تدرجًا أحيض: حين يكون D(G(z)) قريبًا من الصفر يظل ميل −log(D) شديدًا فيتعلم المولد، بينما تنفطر −log(1−D) نحو صفر.',
            en: 'The worked numbers settle it: on the same fake (logit \u22121) the saturating form gave 0.313262 and the non-saturating 1.313262. The larger value is not greed but a livelier gradient: when D(G(z)) is near zero the slope of \u2212log(D) stays steep and the generator keeps learning, while \u2212log(1\u2212D) flattens toward zero.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في DCGAN، ما تركيبة كتلة المولد وما وظيفة tanh الختامية؟',
            en: 'In DCGAN, what composes a generator block and what is the role of the final tanh?',
          },
          options: [
            { id: 'a', text: { ar: 'تفاف منقول + تطبيع دفعي + ReLU؛ وtanh الختامية تعيد القيم إلى المدى (−1, 1) لتطابق تطبيع بيانات التدريب', en: 'A transposed convolution + batch normalization + ReLU; the final tanh rescales outputs to (\u22121, 1) to match the normalized training data' } },
            { id: 'b', text: { ar: 'تفاف عادي + dropout + sigmoid؛ وtanh تمنع القيم السالبة', en: 'A plain convolution + dropout + sigmoid; tanh suppresses negative values' } },
            { id: 'c', text: { ar: 'تجميع أقصى + ReLU؛ وtanh تحول الصورة إلى احتمالات', en: 'Max-pooling + ReLU; tanh turns the image into probabilities' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كتلة المولد تكبر الأبعاد بالتفاف المنقول (من 4×4 إلى 8×8 مثلًا) وتثبت التوزيعات بالتطبيع الدفعي وتنتهي بـ ReLU؛ أما الطبقة الختامية فتفاف منقول إلى 3 قنوات وtanh لأن بيانات التدريب نُظمت بـ 0.5/0.5 إلى المدى (−1, 1). المميز المرآة يستخدم Leaky ReLU بمعامل 0.2 بدل ReLU.',
            en: 'A generator block upsamples with a transposed convolution (say 4\u00D74 to 8\u00D78), stabilizes distributions with batch normalization, and applies ReLU; the final layer is a transposed convolution to 3 channels with tanh, because the training data were normalized with 0.5/0.5 into (\u22121, 1). The mirrored discriminator uses Leaky ReLU with \u03B1 = 0.2 instead of ReLU.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'النمذجة التوليدية تعكس التمييز: اختبار العينتين يتحول إلى إشارة بنّاء — مولد يزوّر ومميز يحكم في لعبة تنافسية دائمة (الهدف من s1: الفكرة والبنية).', en: 'Generative modelling flips discrimination: the two-sample test becomes a constructive signal — a generator forging and a discriminator judging, locked in permanent competition (goal of s1: the idea and architecture).' },
        { ar: 'اللعبة min_D max_G بخسائر إنتروبيا متقاطعة؛ الصيغة غير المشبعة −log D(G(z)) تحفظ التدرجات حين يرفض المميز بثقة، والتوازن المثالي عند D = 1/2 بكل حد = log 2 (الهدف من s1: دوال الخسارة).', en: 'The game is min_D max_G under cross-entropy losses; the non-saturating form \u2212log D(G(z)) preserves gradients when the discriminator rejects confidently, and the ideal equilibrium sits at D = 1/2 with every term = log 2 (goal of s1: the loss functions).' },
        { ar: 'DCGAN تنقل اللعبة إلى الصور: كتل تفاف منقول + تطبيع دفعي + ReLU في المولد (1→4→…→64 بقنوات 512→3)، ومرآة بـ Leaky ReLU في المميّز، مع معادلتَي الأبعاد k + s(n−1) − 2p و⌊(n − k + 2p + s)/s⌋ (الهدف من s2 DCGAN).', en: 'DCGAN takes the game to images: generator blocks of transposed convolution + batch norm + ReLU (1\u21924\u2192\u2026\u219264 with channels 512\u21923), a Leaky-ReLU mirror for the discriminator, and the two size formulas k + s(n\u22121) \u2212 2p and \u230A(n \u2212 k + 2p + s)/s\u230B (goal of s2 DCGAN).' },
      ],
      reflectPrompt: {
        ar: 'قيمة log 2 = 0.693 هي نبض التوازن: صمّم جدول مراقبة لتدريب GAN تسجل فيه حدود المميز والمولد كل دورة — ماذا يعني بقاء القيمتين قرب 0.693 طويلًا؟ وماذا يعني انهيار أحدهما نحو الصفر؟',
        en: 'log 2 = 0.693 is the pulse of equilibrium: design a GAN training dashboard that logs both discriminator and generator losses every epoch — what does it mean when both hover near 0.693 for a long time, and what does it mean when one collapses toward zero?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch20.s1' },
        { book: 'D2L', section: 'd2l.ch20.s2' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch20.s1' },
    { book: 'D2L', section: 'd2l.ch20.s2' },
  ],
} satisfies Lesson;

export default lesson;
