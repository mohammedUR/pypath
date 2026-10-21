import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch12.l4 — "Adam and the Learning Rate Clock"
 * Adam وساعة معدل التعلم
 * Aligned with D2L ch12 s10 (Adam) + s11 (Learning Rate Scheduling). All
 * expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: a 3-step Adam trace with bias
 * correction on (x-1)^2 plus three LR schedules printed at fixed epochs.
 * Every literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch12.l4',
  version: 1,
  part: 'II',
  track: 'A7',
  book: 'D2L',
  chapter: 12,
  title: {
    ar: 'Adam وساعة معدل التعلم',
    en: 'Adam and the Learning Rate Clock',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch12.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'جمع الفصل حتى الآن أربع أفكار: خطوات رخيصة، دفعات، سرعة، ومعايرة لكل إحداثية. adam يجمعها كلها في خوارزمية واحدة هي الخيار الافتراضي لعشرات الآلاف من الممارسين — ثم يبقى سؤال لم تُجبه أي خوارزمية: متى نخفض η وبكم؟ سنتتبع adam خطوة بخطوة لنرى تصحيح التحيز يُصلح بداية متواضعة، ثم نُشغّل ثلاث جداول لمعدل التعلم: الجذر التربيعي، والدفعات الثابتة، والجيب التمامي.',
        en: 'The chapter has stacked four ideas so far: cheap steps, batches, velocity, and per-coordinate scaling. Adam combines them all into one algorithm that became the default for tens of thousands of practitioners — and yet one question remains that no optimizer answers for us: when do we lower η, and by how much? We will trace Adam step by step to watch bias correction fix a timid start, then run three learning-rate schedules: square-root decay, step decay, and cosine.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'معادلة adam الكاملة، ثم جدولة η', en: 'The full Adam equation, then scheduling η' },
      chunks: [
        {
          ar: 'adam يحتفظ بمتوسطين متسربين لكل معامل: السرعة v ← β₁v + (1−β₁)g بـ β₁=0.9، والمقياس s ← β₂s + (1−β₂)g² بـ β₂=0.999 — المقياس أبطأ ذاكرة من السرعة عمدًا. البداية من الصفر تجعل كليهما متواضعًا في الخطوات الأولى، فيأتي تصحيح التحيز: v̂ = v/(1−β₁ᵗ) وŝ = s/(1−β₂ᵗ)، وعند t=1 يعودان بالضبط إلى g وg². التحديث النهائي x ← x − η·v̂/(√ŝ+ε) يجمع: خطوة في اتجاه السرعة المُقحمة بحجم لكل إحداثية، وη صريحة تبقى تحت سيطرتك (وε مثل 10⁻⁶). حين يتذبذب s بعنف يمكن أن يتباعد adam؛ يوجي يقترح بديل s يحذف الاتجاه ولا يحذف الحجم.',
          en: 'Adam keeps two leaky averages per parameter: velocity v ← β₁v + (1−β₁)g with β₁=0.9, and scale s ← β₂s + (1−β₂)g² with β₂=0.999 — deliberately a slower memory than the velocity. Starting both at zero makes them timid in the first steps, which is what bias correction fixes: v̂ = v/(1−β₁ᵗ) and ŝ = s/(1−β₂ᵗ); at t=1 they come back exactly to g and g². The final update x ← x − η·v̂/(√ŝ+ε) combines everything: a step along the debiased velocity, scaled per coordinate, with an explicit η still under your control (and ε around 10⁻⁶). When s swings wildly, Adam can diverge; Yogi proposes an s update that drops the direction but keeps the magnitude.',
        },
        {
          ar: 'جدولة معدل التعلم فنّ منفصل: معدل كبير في البداية يسرّع، ومعدل متناقص يهدّئ الاهتزاز حول الصغْر بل ويخفض فرط التخصيص. الأشكال الشائعة: تلاشي كثير الحدود η(t) = η₀(t+1)^(−1/2) المريح نظريًا على المسائل المحدبة، والتلاشي المتعدد المراحل η ← η·α عند محطات مثل {15, 30}، وجدول الجيب التمامي η(t) = η_T + (η₀−η_T)/2·(1+cos(πt/T)) الذي يبقي المعدل مرتفعًا طويلًا ثم ينحدر بسلاسة إلى η_T ويثبت عندها. والأهم: warmup — بداية خطية صعودًا (مثل 5 خطوات) تقي الشبكات العميقة من انفجار الخطوات الأولى حين تكون الأوزان بدايتها بعيدة عن كل معنى.',
          en: 'Scheduling the learning rate is a separate art: a large early rate accelerates, and a decaying one calms the rattle around the minimum — and may even reduce overfitting. Common shapes: polynomial decay η(t) = η₀(t+1)^(−1/2), well-behaved in theory on convex problems; multi-step decay η ← η·α at milestones like {15, 30}; and the cosine schedule η(t) = η_T + (η₀−η_T)/2·(1+cos(πt/T)), which keeps the rate high for a long stretch then glides down to η_T and pins it there. Most important is warmup — a short linear ramp-up (say 5 steps) that shields very deep networks from first-step blow-ups while the initial weights are still meaningless.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'أثر adam مع تصحيح التحيز + ثلاثة جداول لـ η',
        en: 'Adam with bias correction + three η timetables',
      },
      code: "import math\n\ndef adam_1d(eta=0.5, beta1=0.9, beta2=0.999, eps=1e-6, steps=3, x0=10.0):\n    x, v, s = x0, 0.0, 0.0\n    for t in range(1, steps + 1):\n        g = 2 * (x - 1)                        # f = (x-1)^2\n        v = beta1 * v + (1 - beta1) * g\n        s = beta2 * s + (1 - beta2) * g * g\n        vh = v / (1 - beta1 ** t)              # bias correction\n        sh = s / (1 - beta2 ** t)\n        x -= eta * vh / (math.sqrt(sh) + eps)\n        print('t=%d g=%.6f v=%.6f vhat=%.6f shat=%.6f x=%.6f' % (t, g, v, vh, sh, x))\n    return x\n\nprint('adam final x = %.6f' % adam_1d())\n\ndef sqrt_lr(t, eta0=0.1):\n    return eta0 * (t + 1) ** -0.5\n\ndef cosine_lr(t, T=20, eta0=0.3, etaT=0.01):\n    if t > T:\n        t = T                                  # pin beyond the horizon\n    return etaT + (eta0 - etaT) / 2 * (1 + math.cos(math.pi * t / T))\n\ndef step_lr(t, eta0=0.5, milestones=(15, 30)):\n    lr = eta0\n    for m in milestones:\n        if t >= m:\n            lr *= 0.5\n    return lr\n\nfmt = lambda vals: ' '.join('%.6f' % v for v in vals)\nprint('sqrt   t=0,4,9,19     ->', fmt([sqrt_lr(t) for t in (0, 4, 9, 19)]))\nprint('cosine t=0,5,10,20,30 ->', fmt([cosine_lr(t) for t in (0, 5, 10, 20, 30)]))\nprint('step   t=0,14,15,30,45->', fmt([step_lr(t) for t in (0, 14, 15, 30, 45)]))",
      explanation: {
        ar: 'تتبع adam على f=(x−1)² من x=10: عند t=1 يُظهر تصحيح التحيز قوته كاملة — v̂=18.000000 وŝ=324.000000 أي g وg² بالضبط، فالخطوة الأولى تتقدم كأن الحالة كانت ممتلئة. عند t=2 وt=3 تتحول الحالتان إلى 17.473684/306.491247 و16.930589/289.664245 ويتقدم x: 9.500000 ثم 9.000948 ثم 8.503561. أما الجداول: الجذر يهبط من 0.100000 إلى 0.022361، والجيب التمامي يبقى مرتفعًا (0.300000 ثم 0.257530) قبل أن يهبط إلى 0.155000 عند منتصف الطريق ويثبت عند 0.010000 بعد الأفق، والمراحل تنصّف عند 15 و30: 0.500000 → 0.250000 → 0.125000.',
        en: 'The Adam trace on f=(x−1)² from x=10: at t=1 bias correction shows its full power — v̂=18.000000 and ŝ=324.000000, exactly g and g², so the first step moves as if the state were full. At t=2 and t=3 the states become 17.473684/306.491247 and 16.930589/289.664245 and x advances: 9.500000, then 9.000948, then 8.503561. The timetables: square-root falls from 0.100000 to 0.022361; cosine stays high (0.300000, then 0.257530) before gliding to 0.155000 at the midpoint and pinning at 0.010000 beyond the horizon; the milestone schedule halves at 15 and 30: 0.500000 → 0.250000 → 0.125000.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.schedules',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ جدولين: cosine_lr(t, T=20, eta0=0.3, etaT=0.01) بالصيغة etaT + (eta0−etaT)/2·(1+cos(π·t/T)) مع تثبيت القيمة عند ηT لأي t > T؛ وstep_lr(t, eta0=0.5, milestones=(15, 30)) الذي ينصف المعدل عند بلوغ كل محطة. أعِد قيمة المعدل العددية من كل دالة.',
        en: 'Implement two schedules: cosine_lr(t, T=20, eta0=0.3, etaT=0.01) via etaT + (eta0−etaT)/2·(1+cos(π·t/T)) with the value pinned at ηT for any t > T; and step_lr(t, eta0=0.5, milestones=(15, 30)) which halves the rate when each milestone is reached. Each function returns the numeric rate.',
      },
      starterCode: "import math\n\ndef cosine_lr(t, T=20, eta0=0.3, etaT=0.01):\n    # TODO: pin t at T when beyond, then apply the cosine formula\n    ...\n\ndef step_lr(t, eta0=0.5, milestones=(15, 30)):\n    # TODO: halve eta0 at every reached milestone\n    ...\n",
      solution: "import math\n\ndef cosine_lr(t, T=20, eta0=0.3, etaT=0.01):\n    if t > T:\n        t = T\n    return etaT + (eta0 - etaT) / 2 * (1 + math.cos(math.pi * t / T))\n\ndef step_lr(t, eta0=0.5, milestones=(15, 30)):\n    lr = eta0\n    for m in milestones:\n        if t >= m:\n            lr *= 0.5\n    return lr",
      tests: [
        {
          id: 't1',
          name: { ar: 'الجيب التمامي عند البداية والمنتصف والنهاية', en: 'Cosine at the start, midpoint, and end' },
          code: "assert abs(cosine_lr(0) - 0.3) < 1e-9, 't=0 must equal eta0 | got %r' % cosine_lr(0)\nassert abs(cosine_lr(10) - 0.155) < 1e-9, 't=10 must equal 0.155 | got %r' % cosine_lr(10)\nassert abs(cosine_lr(20) - 0.01) < 1e-9, 't=20 must equal etaT | got %r' % cosine_lr(20)",
          expected: '0.3, 0.155, 0.01',
        },
        {
          id: 't2',
          name: { ar: 'التثبيت بعد الأفق الزمني', en: 'Pinning beyond the horizon' },
          code: "assert abs(cosine_lr(5) - 0.257530) < 1e-6, 't=5 expected 0.257530 | got %r' % cosine_lr(5)\nassert abs(cosine_lr(30) - 0.01) < 1e-9 and abs(cosine_lr(200) - 0.01) < 1e-9, 'beyond T the rate must stay pinned at 0.01'",
          expected: 'pinned at 0.01 past T',
        },
        {
          id: 't3',
          name: { ar: 'المراحل تنصّف عند 15 و30 فقط', en: 'Milestones halve at 15 and 30 only' },
          code: "assert abs(step_lr(0) - 0.5) < 1e-12 and abs(step_lr(14) - 0.5) < 1e-12, 'before the first milestone the rate stays 0.5'\nassert abs(step_lr(15) - 0.25) < 1e-12 and abs(step_lr(30) - 0.125) < 1e-12 and abs(step_lr(45) - 0.125) < 1e-12, 'halving must happen exactly at 15 and 30'",
          expected: '0.5, 0.5, 0.25, 0.125, 0.125',
        },
      ],
      hints: [
        { ar: 'في cosine_lr احمِ الحالة t > T أولًا (اجعلها T) ثم طبق الصيغة — وإلا سيبدأ cos بالصعود مجددًا بعد الأفق.', en: 'In cosine_lr guard the t > T case first (set it to T) and only then apply the formula — otherwise cos starts rising again past the horizon.' },
        { ar: 'في step_lr ابدأ من lr = eta0 واضرب في 0.5 لكل محطة يحققها t: حلقة بسيطة على قائمة المحطات.', en: 'In step_lr start from lr = eta0 and multiply by 0.5 for every milestone t has reached: a simple loop over the milestone list.' },
        { ar: 'قيم تحقق: cosine_lr(10) = 0.155 بالضبط لأن cos(π·10/20) = cos(π/2) ≈ 0، وstep_lr(15) = 0.25 لانخفاض محطة واحدة فقط.', en: 'Sanity values: cosine_lr(10) = 0.155 exactly because cos(π·10/20) = cos(π/2) ≈ 0, and step_lr(15) = 0.25 with only one milestone passed.' },
        { ar: 'أعِد float عاديًا من كل دالة — لا تطبع داخلها ولا تُعِد نصًا، الاختبارات تقارن قيمًا عددية.', en: 'Return a plain float from each function — do not print inside or return text; the tests compare numeric values.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-bias-correction',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يحتاج adam إلى تصحيح التحيز v̂ = v/(1−β₁ᵗ) في البداية تحديدًا؟',
        en: 'Why does Adam need bias correction v̂ = v/(1−β₁ᵗ) specifically at the start?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن البدء من v=s=0 يجعل المتوسطين أصغر من قيمتهما المستقرة فيتباطأ البدء، والقسمة على (1−βᵗ) تعيد لهما مقياسهما', en: 'Starting from v=s=0 makes both averages smaller than their steady values, slowing the start; dividing by (1−βᵗ) restores their scale' } },
        { id: 'b', text: { ar: 'لأن β₁ᵗ ينفجر عدديًا مع الزمن فيجب تقسيمه', en: 'Because β₁ᵗ explodes numerically over time and must be divided out' } },
        { id: 'c', text: { ar: 'لأن التصحيح يمنع ظهور قيم سالبة في السرعة', en: 'Because the correction prevents negative values in the velocity' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'في t=1: v = 0.1·g ثم v̂ = v/(1−0.9) = g — عدّ عدد الحدود التي «فقدتها» المتوسطة في بدايتها.', en: 'At t=1: v = 0.1·g yet v̂ = v/(1−0.9) = g — count how many terms the average has "missed" at startup.' },
        { ar: 'المجموع β⁰+β¹+...+β^(t−1) = (1−βᵗ)/(1−β): الأوزان لا تكتمل إلا مع الزمن.', en: 'The sum β⁰+β¹+...+β^(t−1) = (1−βᵗ)/(1−β): the weights only complete over time.' },
        { ar: 'شاهد المثال المُشغَّل: عند t=1 أعاد التصحيح v̂ إلى 18.000000 = g بالضبط وŝ إلى 324.000000 = g².', en: 'Watch the worked example: at t=1 the correction restored v̂ to 18.000000 = g exactly and ŝ to 324.000000 = g².' },
        { ar: 'الجواب: a — ومع الزمن يتقارب 1−βᵗ إلى 1 فيتلاشى أثر التصحيح من تلقاء نفسه.', en: 'Answer: a — and over time 1−βᵗ converges to 1, so the correction fades away on its own.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\n\ndef cosine_lr(t, T=20, eta0=0.3, etaT=0.01):\n    if t > T:\n        t = T\n    return etaT + (eta0 - etaT) / 2 * (1 + math.cos(math.pi * t / T))\n\ndef warmup_cosine(t, warm=5, T=20, eta0=0.3, etaT=0.01):\n    if t < warm:\n        return eta0 * t / warm\n    return cosine_lr(t, T, eta0, etaT)\n\nfmt = lambda vals: ' '.join('%.6f' % v for v in vals)\nprint('plain  t=0,2,4,5,6 ->', fmt([cosine_lr(t) for t in (0, 2, 4, 5, 6)]))\nprint('warmup t=0,2,4,5,6 ->', fmt([warmup_cosine(t) for t in (0, 2, 4, 5, 6)]))\n\n# جرّب: شغّل النزول التدريجي على f=(x-1)^2 من x=10 بمعدل يتبع warmup_cosine بدل المعدل الثابت وقارن المسار.\n# try: run gradient descent on f=(x-1)^2 from x=10 with a rate following warmup_cosine instead of a constant and compare the path.\n# جرّب: غيّر عدد خطوات warmup إلى 10 ولاحظ متى يلتقي المساران.\n# try: change the warmup length to 10 and observe where the two paths meet.\n",
      prompt: {
        ar: 'الملعب يقارن جدول الجيب التمامي الصريح بنسخة warmup تصعد خطيًا من 0 خلال 5 خطوات ثم تسلم القيادة للجيب التمامي. لاحظ أن t=5 يجتمع فيهما عند 0.257530 بالضبط، ثم يفترقا قليلًا عند t=6 (0.240229 لضمهما).',
        en: 'The sandbox compares the plain cosine schedule with a warmup version that ramps linearly from 0 over 5 steps and then hands over to the cosine. Note that at t=5 the two meet exactly at 0.257530, then diverge slightly at t=6 (0.240229 for the joined one).',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي تقنيات الفصل يجمع adam دفعة واحدة؟',
            en: 'Which techniques from this chapter does Adam combine in one update?',
          },
          options: [
            { id: 'a', text: { ar: 'السرعة المتسربة والتكيّف لكل إحداثية وتصحيح التحيز ومعدل تعلم صريح', en: 'Leaky velocity, per-coordinate scaling, bias correction, and an explicit learning rate' } },
            { id: 'b', text: { ar: 'مقلوب Hessian وخطوات موثوقة من الرتبة الثانية', en: 'The inverse Hessian and trusted second-order steps' } },
            { id: 'c', text: { ar: 'دفعة كاملة من كل مثال دون أخذ عينات', en: 'A full batch over every example without sampling' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'adam = momentum (v) + rmsprop (s) + تصحيح تحيز البدء من الصفر + η صريحة. لا مرتبة ثانية ولا دفعات كاملة: كل شيء من الرتبة الأولى بتكلفة تخزين حالتين فقط لكل معامل.',
            en: 'Adam = momentum (v) + RMSProp (s) + bias correction for the zero start + an explicit η. No second-order machinery and no full batches: everything is first-order at the cost of just two states per parameter.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا يفعل جدول الجيب التمامي بعد بلوغ الأفق T؟',
            en: 'What does the cosine schedule do once it reaches the horizon T?',
          },
          options: [
            { id: 'a', text: { ar: 'يعيد الصعود من η₀ في دورة جديدة تلقائيًا', en: 'It automatically restarts the climb from η₀ in a new cycle' } },
            { id: 'b', text: { ar: 'يثبّت المعدل عند ηT ولا يرفعه مجددًا', en: 'It pins the rate at ηT and never raises it again' } },
            { id: 'c', text: { ar: 'يجعل المعدل صفرًا نهائيًا فيتوقف التدريب', en: 'It sets the rate to zero for good, halting training' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بعد T نثبّت η عند ηT (0.010000 في مثالنا عند t=30): صيغة cos لم تُعَد للاستمرار، والغاية أن ينتهي التدريب على «صقل» هادئ قرب ηT بدل ذبذبات مفاجئة.',
            en: 'Past T we pin η at ηT (0.010000 in our example at t=30): the cosine formula is not designed to keep cycling, and the point is to finish training in a quiet refining regime near ηT rather than with sudden swings.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا تفيد مرحلة warmup في الشبكات شديدة العمق؟',
            en: 'Why does a warmup phase help in very deep networks?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنها تمنع انفجار التحديثات في الخطوات الأولى حين يكون اتجاه التدرج غير موثوق بعد', en: 'It prevents first-step blow-ups while the initial gradient directions are still untrustworthy' } },
            { id: 'b', text: { ar: 'لأنها ترفع معدل التعلم فورًا إلى أقصاه لتسريع البداية', en: 'Because it instantly raises the learning rate to its maximum to speed up the start' } },
            { id: 'c', text: { ar: 'لأنها تعيد تهيئة الأوزان تلقائيًا كل خطوة', en: 'Because it re-initializes the weights automatically at every step' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التخصيص الأولي شبه اعتباطي، والتحديثات الأولى قد تكون ضخمة الاتجاه خاطئ. الصعود الخطي (مثل 0.120000 عند t=2 و0.240000 عند t=4 في مثالنا) يمنح النموذج فرصة للاستقرار قبل الخطوات الكبيرة.',
            en: 'The initial parameters are near-arbitrary and the earliest updates can be huge in a wrong direction. The linear ramp (0.120000 at t=2 and 0.240000 at t=4 in our example) lets the network settle before large steps arrive.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'adam يجمع السرعة v (β₁=0.9) والمقياس s (β₂=0.999) مع تصحيح تحيز v̂=v/(1−β₁ᵗ) وŝ=s/(1−β₂ᵗ): عند t=1 يعود التقديران إلى g وg² تمامًا (الهدف من s10 adam).', en: 'Adam combines velocity v (β₁=0.9) and scale s (β₂=0.999) with bias correction v̂=v/(1−β₁ᵗ), ŝ=s/(1−β₂ᵗ): at t=1 both estimates return exactly to g and g² (goal of s10 Adam).' },
        { ar: 'عند تذبذب s بعنف قد يتباعد adam، ويقترح يوجي تحديثًا يحذف إشارة الفرق ويحفظ حجمه (الهدف من s10 adam).', en: 'When s swings wildly Adam may diverge; Yogi proposes an s update that drops the sign of the deviation but keeps its magnitude (goal of s10 Adam).' },
        { ar: 'جدولة η فن مستقل: جذر تربيعي η₀(t+1)^(−1/2)، أو تنصيف عند محطات، أو جيب تمامي يثبت عند ηT بعد الأفق — والwarmup الخطي يقي البدايات العميقة (الهدف من s11 جدولة معدل التعلم).', en: 'Scheduling η is its own art: square-root η₀(t+1)^(−1/2), halving at milestones, or cosine that pins at ηT past the horizon — and a linear warmup protects deep starts (goal of s11 Learning Rate Scheduling).' },
      ],
      reflectPrompt: {
        ar: 'خطة تدريبك التالية 60 خطوة ومعدل البداية 0.3. صمّم الجدول كاملًا: warmup من كم خطوة، وأي شكل هبوط، وأين يثبت النهاية — وما القرينة التي ستراقبها لتقرر أن اختيارك خاطئ؟',
        en: 'Your next training plan is 60 steps with an initial rate of 0.3. Design the whole schedule: how many warmup steps, which decay shape, where the end pins — and what signal will you monitor to know your choice was wrong?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch12.s10' },
        { book: 'D2L', section: 'd2l.ch12.s11' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch12.s10' },
    { book: 'D2L', section: 'd2l.ch12.s11' },
  ],
} satisfies Lesson;

export default lesson;
