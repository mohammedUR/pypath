import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch14.l2 — "Continuous Deployment: Canaries and Rollbacks
 * النشر المستمر: الإصدارات الكنارية والتراجع"
 * Aligned with SWE ch14 s3 (14.3 Continuous Deployment, pp.383-389),
 * including the book's from zlib import crc32 stable-bucket example and the
 * Knight Capital / CrowdStrike case studies.
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * SIMULATED-DEPLOYMENT PATTERN: no real traffic, routers, or flag services in
 * the sandbox — deployment strategies are modeled in pure Python: crc32
 * stable buckets over a fixed user list, error-rate samples over a fixed
 * list, and an honest promote/rollback decision printed as
 * 'promoted: False'. Deterministic only.
 */

const lesson = {
  id: 'swe.ch14.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 14,
  title: { ar: 'النشر المستمر: الإصدارات الكنارية والتراجع', en: 'Continuous Deployment: Canaries and Rollbacks' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch14.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل التزام أخضر يعبر خط الدرس الأول — ثم ماذا؟ مصطلحان متشابهان يحملان وعدَّين مختلفين: التسليم المستمر يجعل كل تغيير ناجح أثرًا جاهزًا للنشر، والنشر المستمر يدفعه إلى الإنتاج آليًّا بلا إنسان في الحلقة. يبدو الثاني تهورًا حتى تعرف ما يمنعه: لا «آمن الدمج وغير جاهز للشحن» بلا علامة، ولا دفعات كبيرة تضيع أعطالها في الازدحام. واليوم تتعلم كيف يُبادل الكود الجديد القديم في نظام حي بأقل نطاق انفجار: أزرق-أخضر، وكناري يقيس معدل الأخطاء على شريحة صغيرة قبل التعميم، وعلامات ميزات تفصل النشر عن الإصدار بيتًا واحدًا في الكود، وتراجع يُتدرَّب كأنه معدات السلامة. بيئتك تشغّل بايثون لا موجّهات — فسنحاكي التوزيع بمثال الكتاب نفسه: from zlib import crc32 يجعل مستخدم maya يقع دائمًا في الكناري، وقرار promoted: False صادقًا.',
        en: 'Every green commit crosses lesson one\u2019s pipeline — then what? Two similar terms carry two different promises: continuous delivery makes every green change a deployable artifact; continuous deployment pushes it to production automatically, no human in the loop. The second sounds reckless until you see what it forbids: no \u201csafe to merge but not ready to ship\u201d without a flag, no big batches whose failures cannot be attributed. Today you learn how new code swaps for old in a live system at minimal blast radius: blue-green, a canary measuring error rates on a small slice before widening, feature flags separating deploy from release with one conditional, and rollback rehearsed like safety equipment. Your sandbox runs Python, not routers — so we simulate distribution with the book\u2019s own example: from zlib import crc32 puts user maya in the canary every single time, and the decision prints as an honest promoted: False.',
      },
    },
    {
      kind: 'predict',
      code: "pipeline = 'green'\nartifact = 'clinic-app:1.4.3'\nreleased = False\nartifact_ready = False\nif pipeline == 'green':\n    artifact_ready = True\nprint('artifact ready: %s' % artifact_ready)\nprint('released: %s' % released)",
      question: {
        ar: 'سطران يحملان حالة المشروع بعد خط أخضر. أيهما يمثل وعد «التسليم المستمر» وأيهما يمثل قرار «الإصدار»؟ وماذا يجب أن تتغير حتى يصير released: True دون لمس pipeline؟',
        en: 'Two lines carry the project state after a green pipeline. Which one is the promise of \u201ccontinuous delivery\u201d and which is the \u201crelease\u201d decision? And what must change for released: True without touching pipeline?',
      },
      reveal: {
        ar: 'الطباعة: artifact ready: True ثم released: False. هذا بالضبط الفرق: التسليم المستمر يعني أن كل خط أخضر ينتج أثرًا مثبت النشر — الجاهزية دائمًا، والإصدار زر يُضغط متى شاء العمل. أما النشر المستمر فيحذف الزر: كل أخضر يصير released: True آليًّا. السطران مستقلان قصْدًا — وفصل الجاهزية عن الوصول للمستخدمين هو موضوع اليوم كله: بيئتان، وشريحة كناري، وعلامة ميزة، وتراجع.',
        en: 'It prints artifact ready: True then released: False. That is exactly the difference: continuous delivery means every green pipeline yields a proven-deployable artifact — always ready, release a button the business presses. Continuous deployment removes the button: every green change becomes released: True automatically. The two lines are independent on purpose — and separating readiness from reaching users is today\u2019s whole subject: two environments, a canary slice, a feature flag, a rollback.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التسليم مقابل النشر، والأزرق-الأخضر', en: 'Delivery versus deployment, and blue-green' },
      chunks: [
        {
          ar: 'التسليم المستمر: كل تغيير يجتاز الخط ينتج أثرًا مثبت النشر — قرار الإصدار قرار عمل متاح لحظةً بلحظة بلا هندسة إضافية. والنشر المستمر خطوة أبعد: كل تغيير يجتاز الخط يُنشر آليًّا. يبدو الثاني تهوّرًا حتى تلاحظ ما يحرّمه: لا تغيير «آمن الدمج وغير جاهز» بلا علامة ميزة، ولا قائمة فحوص يدوية قبل الإصدار، ولا تجميع تغييرات في إصدار كبير لا يُنسب فشله لأحد — فكل خاصية أمان يجب أن تكون مؤتمتة لأن الأتمتة كل ما هناك. والنتيجة المفارقة التي سيقيسها درس المقاييس: النشر الأكثر تكرارًا أخطر نشرًا، لأن كل نشر أصغر، أفضل نسبة، وأسهل تراجعًا.',
          en: 'Continuous delivery: every change passing the pipeline yields a proven-deployable artifact — the release decision is a business choice, always available with no extra engineering. Continuous deployment goes further: every change passing the pipeline ships to production automatically. It sounds reckless until you see what it forbids: no \u201csafe to merge but not ready\u201d change without a flag, no manual pre-release checklist, no batching changes into a big release whose failures cannot be attributed — every safety property must be automated, because automation is all there is. The paradoxical result the metrics lesson will measure: deploying more often makes each deployment less risky, because each one is smaller, better attributed, and easier to undo.',
        },
        {
          ar: 'كيف تبادل النسختين في نظام حي؟ الأزرق-الأخضر يشغّل بيئتين متطابقتين: واحدة تخدم كل الحركة والأخرى جاهزة صامتة. للإصدار: انشر الجديد في الخاملة، وتحقق منها في ظروف إنتاج حقيقية، ثم اقلب الموجّه — والبيئة القديمة تبقى دافئة فيعود الأمر تغيير موجّه واحد إن أساء الجديد التصرف. الثمن مزدوج: بنية تحتية مضاعفة، وعناية خاصة بما هو عائد على الحالة — مخطط قاعدة بيانات مشترك بين البيئتين يجب أن يبقى متوافقًا مع النسختين أثناء التبديل. لذلك يليق الأزرق-الأخضر بالتبديل الشامل السريع، بينما يعتمد التعرض التدريجي على فكرة أخرى: أطعم الجديد لشريحة صغيرة أولًا واستمع — وهذا كناري الدرس التالي.',
          en: 'How do two versions swap in a live system? Blue-green runs two identical environments: one serves all traffic while the other sits idle. To release: deploy the new version to the idle one, verify it against production conditions, then flip the router — the old environment stays warm, so recovery is one router change if the new version misbehaves. The price: doubled infrastructure, and special care with anything stateful — a database schema shared by both environments must stay compatible with both versions during the switch. Blue-green fits a fast total switch; progressive exposure bets on another idea: feed the new version to a small slice first and listen — that is the canary.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الكناري، والعلامات، والتراجع — وحادثتان', en: 'Canaries, flags, and rollback — and two incidents' },
      chunks: [
        {
          ar: 'الكناري يطلق النسخة الجديدة على شريحة صغيرة — خادم واحد أو بالمئة من المستخدمين — ويراقب معدلات الأخطاء والزمن قبل التعميم، وعملاق الويب يعمّمه إلى حلقات: داخليون فشريحة صغيرة فجمهور أوسع، وفحوص صحة تُبوِّب كل ترقية وتوقف التراجع عند انحدار. جوهر الفكرة: لا تغيير يبلغ الجميع قبل أن ينجو من لقاء شخص.',
          en: 'A canary releases the new version to a small slice — one server, one percent of users — watching error rates and latency before widening; large operators generalize it into staged rings: internal users, then a small public slice, then broader rings, with health checks gating each promotion and halting on regression. The essence: no change reaches everyone before it has survived contact with someone. How is the slice chosen stably?',
        },
          {
          ar: 'كيف تختار الشريحة بثبات؟ بمثال الكتاب: from zlib import crc32 ثم crc32(user_id.encode()) % 100 يعطي كل مستخدم دلوًا ثابتًا 0..99 — فأقل من new_scheduler_pct يرى الجديد، والمستخدم نفسه يقع في الجانب نفسه في كل زيارة. وعلامة الميزة تنقل المفتاح نفسه إلى الكود: إصدارية تعيش أيامًا وتُحذف بعد اكتمال طرحها، وتشغيلية (مفتاح قتل) طويلة العمر ومقليلة العدد، وتجريبية تعيش طوال التجربة فقط — ولكل علامة مالك وعمر محدد وتاريخ حذف، والعلامة القديمة لا يُعاد استعمالها أبدًا: retire ثم احذف الكود الميت ثم اخترع اسمًا جديدًا.',
          en: 'The book\\u2019s example: from zlib import crc32, then crc32(user_id.encode()) % 100 gives every user a fixed bucket 0..99 — below new_scheduler_pct sees the new code, and the same user lands on the same side every visit. A feature flag moves the switch into code: release flags live days and are deleted once rolled out; operational flags (kill switches) are few, long-lived, and tested like safety gear; experiment flags live exactly as long as the experiment. Every flag needs an owner, a lifespan, a removal date — and never repurpose an old flag: retire it, delete its dead code, mint a new name.',
        },
        {
          ar: 'وعندما يخطئ النشر؟ التراجع يعيد الإصدار السابق، والتقدّم للإصلاح يشحن إصلاحًا فوق الحالة المكسورة — الأول أسرع ولا يحمل كودًا غير مُتحقق منه، فصار الانعكاس الافتراضي. لكن آلية لم تُختبر إشاعة لا قدرة: انحراف إصدارات قد يجعل الكود القديم عاجزًا عن قراءة ما كتبه الجديد، والأثر السابق قد لا يوجد أصلًا — لذا يُتدرَّب التراجع بروتين، وبعض التغييرات لا تُتراجع أصلًا (ترحيل بيانات لا رجعة فيه) فيصبح سرعة التقدم للأمام خاصية أمان.',
          en: 'And when a deployment goes wrong? Rollback returns to the previous version; roll-forward ships a fix on top. Rollback is usually faster and adds no unverified code, so it is the default reflex — but an untested mechanism is a rumor, not a capability: version skew can leave old code unable to read what new code wrote, and the previous artifact may not exist — so rollback is rehearsed routinely, and some changes (irreversible migrations) cannot roll back at all, making roll-forward speed a safety property.',
        },
          {
          ar: 'وحادثتان تختمان الفصل: Knight Capital 2012 — نسخ يدوي لثمانية خوادم فسُقط الخادم الثامن، وعلامة معاد استعمالها أيقظت كودًا ميتًا من 2003، وخسارة تتجاوز 460 مليونًا في نحو 45 دقيقة: بلا أتمتة لا تستطيع حتى ضمان أن ثمانية خوادم تعمل الكود نفسه. وCrowdStrike 2024 — دفع عالمي متزامن لمحتوى فيه 21 حقلًا مقابل 20 يوفرهما الكود، فانهارت 8.5 مليون آلة في ساعة: أتمتة كاملة بلا تعرض تدريجي آلة لشحن عيب واحد إلى العالم كله دفعة واحدة. الأتمتة تحدد سرعة نتيجتك؛ والتعريض التدريجي والاسترداد المُختبر يحددان إشارتها.',
          en: 'Two incidents bracket the chapter: Knight Capital, 2012 — a manual copy across eight servers missed one; a repurposed flag woke dead code from 2003; over $460M lost in about 45 minutes: without automation you cannot even guarantee eight servers run the same code. CrowdStrike, 2024 — a global simultaneous push of content with 21 fields against 20 the code supplied; roughly 8.5 million machines down within hours: full automation without progressive exposure is a machine for shipping one defect to everyone at once. Automation sets the speed of your outcome; progressive exposure and tested recovery decide its sign.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'محاكي كناري: دلائل ثابتة وقرار صادق', en: 'A canary simulator: stable buckets and an honest decision' },
      code: "from zlib import crc32\n\nusers = ['ana', 'basil', 'maya', 'omar', 'dmitri', 'yara']\nfor u in users:\n    b = crc32(u.encode()) % 100\n    where = 'canary' if b < 10 else 'stable'\n    print('%s: bucket %d -> %s' % (u, b, where))\n\nsamples = [3, 5, 4, 6, 5]\nthreshold = 4.0\nmean = sum(samples) / len(samples)\npromoted = mean <= threshold\nprint('mean errors: %.1f' % mean)\nprint('promoted: %s' % promoted)",
      explanation: {
        ar: 'شطران يلاحظهما: الأول يوزع ستة مستخدمين على دلائل ثابتة — crc32 يبصم اسم المستخدم فيبقى دلو maya هو 4 وomar هو 0 في كل زيارة: هكذا تُختار شريحة كنارية عادلة بلا خدمة جلسات؛ وعلى عدد مستخدمين كبير يقارب العُشر منهم الأدوار تحت 10. الثاني هو قرار الترقية: خمس عينات لمعدل الأخطاء على الكناري ومتوسطها 4.6 مقابل عتبة 4.0 — فالمقارنة mean <= threshold تعطي False، ويُطبع promoted: False بلا تجميل: الكناري امتص الضرر وأطلق الإنذار، والتراجع قلب موجّه أو علامة. الحكم الصادق هنا أهم من الحكم السعيد: خطأ صغير على 10% من الحركة يُكتشف رخيصًا، لكنه كارثة لو وصل الجميع دفعة واحدة.',
        en: 'Two halves to notice: the first distributes six users into stable buckets — crc32 fingerprints the username so maya\u2019s bucket stays 4 and omar\u2019s stays 0 on every visit: a fair canary slice with no session service; over a large population about a tenth lands below 10. The second is the promotion decision: five error-rate samples from the canary, mean 4.6 against a threshold of 4.0 — so mean <= threshold is False and we print promoted: False with no cosmetic sugar: the canary absorbed the harm and sounded the alarm, and rollback is one router or flag flip. The honest verdict matters more than the happy one: a small error rate on 10% of traffic is cheap to catch — catastrophic if everyone got it at once.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.canary-decision',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ canary_decision(samples, threshold) قلب محاكي الكناري: تحسب متوسط العينات، وتقرر promoted = mean <= threshold، وتطبع mean: %.1f ثم promoted: %s، وتعيد القيمة المنطقية. ثم أبقِ الاستدعاءين المعطيين: شريحة صحية [1, 2, 1, 2, 1] بعتبة 3.0، وشريحة مريضة [4, 6, 5] بعتبة 4.0. المتوقع: mean: 1.4 مع promoted: True، ثم mean: 5.0 مع promoted: False.',
        en: 'Implement canary_decision(samples, threshold), the heart of the canary simulator: compute the mean of the samples, decide promoted = mean <= threshold, print mean: %.1f then promoted: %s, and return the boolean. Keep the two given calls: a healthy slice [1, 2, 1, 2, 1] at threshold 3.0, and a sick slice [4, 6, 5] at threshold 4.0. Expected: mean: 1.4 with promoted: True, then mean: 5.0 with promoted: False.',
      },
      starterCode: "def canary_decision(samples, threshold):\n    # المتوسط ثم المقارنة ثم الطباعة ثم الإرجاع\n    # mean, comparison, prints, return\n    pass\n\ncanary_decision([1, 2, 1, 2, 1], 3.0)\ncanary_decision([4, 6, 5], 4.0)",
      solution: "def canary_decision(samples, threshold):\n    mean = sum(samples) / len(samples)\n    promoted = mean <= threshold\n    print('mean: %.1f' % mean)\n    print('promoted: %s' % promoted)\n    return promoted\n\ncanary_decision([1, 2, 1, 2, 1], 3.0)\ncanary_decision([4, 6, 5], 4.0)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الشريحة الصحية تُرقَّى', en: 'The healthy slice is promoted' },
          code: "assert 'promoted: True' in __learner_output__, 'expected: promoted: True | actual: %r' % __learner_output__",
          expected: 'promoted: True',
        },
        {
          id: 't2',
          name: { ar: 'الشريحة المريضة تُرفض بصدق', en: 'The sick slice is honestly rejected' },
          code: "assert 'promoted: False' in __learner_output__, 'expected: promoted: False | actual: %r' % __learner_output__",
          expected: 'promoted: False',
        },
        {
          id: 't3',
          name: { ar: 'الوسط المطبوع بالتنسيق المطلوب', en: 'Means printed in the required format' },
          code: "assert 'mean: 1.4' in __learner_output__ and 'mean: 5.0' in __learner_output__, 'expected: mean: 1.4 and mean: 5.0 | actual: %r' % __learner_output__",
          expected: 'mean: 1.4 and mean: 5.0',
        },
        {
          id: 't4',
          name: { ar: 'الحد يساوي العتبة يرقى', en: 'A mean exactly at the threshold promotes' },
          code: "assert canary_decision([2, 2], 2.0) is True and canary_decision([3, 4], 3.0) is False, 'expected: ([2,2],2.0) -> True and ([3,4],3.0) -> False | actual: %r' % ((canary_decision([2, 2], 2.0), canary_decision([3, 4], 3.0)),)",
          expected: '([2,2],2.0) -> True and ([3,4],3.0) -> False',
        },
      ],
      hints: [
        { ar: 'الوسط بعمليتين: sum(samples) / len(samples) ثم المقارنة المنطقية promoted = mean <= threshold — لاحظ <= لا <: العتبة نفسها مقبولة.', en: 'The mean is two operations: sum(samples) / len(samples), then the boolean comparison promoted = mean <= threshold — note <=, not <: a mean exactly at the threshold passes.' },
        { ar: 'الطباعة بمنسّقين معلومين: print(\'mean: %.1f\' % mean) ثم print(\'promoted: %s\' % promoted) — %s يطبع False وTrue كما هما.', en: "Two known formatters: print('mean: %.1f' % mean) then print('promoted: %s' % promoted) — %s prints False and True as-is." },
        { ar: 'أعد promoted في آخر الدالة حتى تستطيع الاختبارات (والحلقة الأكبر) أن تقرر الترقية أو التراجع آليًّا — القيمة المنطقية هي عقد الدالة.', en: 'Return promoted as the last line so tests (and a larger rollout loop) can automate promote or rollback — the boolean is the function\u2019s contract.' },
        { ar: 'الحل الكامل:\ndef canary_decision(samples, threshold):\n    mean = sum(samples) / len(samples)\n    promoted = mean <= threshold\n    print(\'mean: %.1f\' % mean)\n    print(\'promoted: %s\' % promoted)\n    return promoted', en: "Full solution:\ndef canary_decision(samples, threshold):\n    mean = sum(samples) / len(samples)\n    promoted = mean <= threshold\n    print('mean: %.1f' % mean)\n    print('promoted: %s' % promoted)\n    return promoted" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-blueroll',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — دون تشغيله. هذه هي بيئة زرقاء-خضراء وتراجعها في خمسة أسطر: أي بيئة تخدم بعد أن تتجاوز العينات الحد؟',
        en: 'Read the code and predict its exact output — without running it. This is blue-green and its rollback in five lines: which environment serves after the samples exceed the limit?',
      },
      code: "serving = 'green'\nerrors = [7, 9, 8]\nlimit = 5\nif max(errors) > limit:\n    serving = 'blue'\nprint('serving: %s' % serving)",
      solution: 'serving: blue',
      answer: 'serving: blue',
      hints: [
        { ar: 'max(errors) تقرأ أكبر قيمة في القائمة [7, 9, 8] — وهي 9، وليست أولها ولا متوسطها.', en: 'max(errors) reads the largest value in [7, 9, 8] — that is 9, not the first and not the mean.' },
        { ar: 'المقارنة 9 > 5 صادقة، فينفَّذ جسم الشرط: إسناد واحد يقلب البيئة الخادمة من green إلى blue — التراجع هنا إسناد لا عملية نشر.', en: 'The comparison 9 > 5 is true, so the branch body runs: one assignment flips the serving environment from green to blue — rollback here is an assignment, not a deployment operation.' },
        { ar: 'لو كانت كل العينات تحت الحد لظل green يخدم — لكن 9 تكسر الحد فيُطبع الحالة الجديدة.', en: 'If every sample stayed under the limit, green would keep serving — but 9 breaks it, so the new state prints.' },
        { ar: 'الخرج:\nserving: blue', en: 'The output:\nserving: blue' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-delivery',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'فريق يجعل كل تغيير أخضر ينتج أثرًا مثبت النشر، لكن مدير المنتج يضغط زر الإصدار مرة كل أسبوع. أي ممارسة من هذا الدرس يتبع هذا الفريق بالضبط؟',
        en: 'A team makes every green change yield a proven-deployable artifact, but the product manager presses the release button once a week. Which practice from this lesson is this team following, exactly?',
      },
      options: [
        { id: 'a', text: { ar: 'التكامل المستمر CI — لأن الخط يجري عند كل التزام', en: 'continuous integration — the pipeline runs on every commit' } },
        { id: 'b', text: { ar: 'التسليم المستمر — الجاهزية دائمة والإصدار قرار عمل متاح لحظةً بلحظة', en: 'continuous delivery — always ready, release a business choice available at any moment' } },
        { id: 'c', text: { ar: 'النشر المستمر — لأن كل شيء مؤتمت حتى الإصدار', en: 'continuous deployment — everything including release is automated' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'المفتاح في من يقرر الوصول للمستخدمين: إن كان زرًا بشريًّا متاحًا في أي لحظة فأنت في التسليم لا في النشر.', en: 'The key is who decides user exposure: a human button available at any moment puts you in delivery, not deployment.' },
        { ar: 'النشر المستمر يحذف الزر كليًّا: كل أخضر يصل الإنتاج آليًّا بلا إنسان في الحلقة — وهذا ليس ما وُصف.', en: 'Continuous deployment removes the button entirely: every green change reaches production automatically with no human in the loop — that is not the described setup.' },
        { ar: 'CI شرط مسبق للاثنين لكنه لا يقول شيئًا عن الأثر الجاهز أو الوصول للمستخدمين — السؤال عن المرحلة التالية له.', en: 'CI is a precondition for both but says nothing about deployable artifacts or user exposure — the question is about the stage after it.' },
        { ar: 'الجواب: b — التسليم المستمر يجعل الإصدار ممكنًا في أي لحظة؛ والنشر المستمر يجعله فعليًّا في كل لحظة.', en: 'Answer: b — delivery makes release possible at any moment; deployment makes it actual at every moment.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-blast',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'خدمة لها 200000 مستخدم يوميًّا، وكناري يأخذ 2% من الحركة في أول حلقة. كم مستخدمًا في أقصى نطاق انفجار لهذه الحلقة؟ (رقم فقط)',
        en: 'A service has 200,000 daily users; the canary takes 2% of traffic in its first ring. What is the worst-case blast radius of this ring, in users? (number only)',
      },
      answer: '4000',
      solution: '4000',
      tolerance: 0,
      hints: [
        { ar: 'نطاق الانفجار للشريحة هو عدد المستخدمين الذين يمكن أن يلمسهم العيب قبل أي قرار ترقية أو تراجع — هنا كل من في الـ 2%.', en: 'A slice\u2019s blast radius is the users the defect can touch before any promote/rollback decision — here, everyone inside the 2%.' },
        { ar: 'احسبها عمليتين: 200000 × 2 = 400000 ثم اقسم على 100 — أو 200000 × 0.02 مباشرة.', en: 'Two operations: 200000 × 2 = 400000, then divide by 100 — or 200000 × 0.02 directly.' },
        { ar: 'قارن بالبديل الذي رفضته الحلقات: تبديل أزرق-أخضر يعرض 100% أي 200000 مستخدم لنفس العيب المحتمل — خمسون ضعفًا.', en: 'Compare with the alternative rings reject: a blue-green switch exposes 100% — 200,000 users — to the same potential defect, fifty times as many.' },
        { ar: 'الجواب: 4000', en: 'Answer: 4000' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "from zlib import crc32\n\ndef bucket(user_id):\n    return crc32(user_id.encode()) % 100\n\ndef canary_decision(samples, threshold):\n    mean = sum(samples) / len(samples)\n    promoted = mean <= threshold\n    print('mean: %.1f' % mean)\n    print('promoted: %s' % promoted)\n    return promoted\n\nprint('omar: bucket %d' % bucket('omar'))\nprint('maya: bucket %d' % bucket('maya'))\ncanary_decision([1, 2, 1, 2], 2.0)\n\n# جرّب: غيّر عينة واحدة في القائمة وشاهد mean يقفز فوق العتبة — قرار الترقية هش بهذا الشكل المرئي\n# try: change one sample and watch mean jump past the threshold — the decision flips visibly\n# جرّب: اجعل العتبة 1.5 فتصير الشريحة الصحية نفسها مرفوضة — أين يجب أن تسكن العتبة: في الحدس أم في رقم معلن؟\n# try: set the threshold to 1.5 and watch the same healthy slice get rejected — where should a threshold live: intuition or a declared number?\n# جرّب: جرّب دلائل أسماء أخرى — هل يقع الاسم نفسه في الدليل نفسه في كل تشغيل؟ لهذا crc32 وليس قائمة صدف\n# try: bucket other names — does the same name land in the same bucket every run? that is why crc32, not a lucky list",
      prompt: {
        ar: 'الملعب محاكي الكناري: دلائل crc32 الثابتة وقرار promoted الصادق. حرك عينة واحدة وشاهد القرار ينقلب، وارفع العتبة فترى شريحة صحية تُرفض — ثم اسأل نفسك: من يملك رقم العتبة في فريقك المتخيَّل، ومتى آخر مرة تدرّب فيها التراجع؟ لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is the canary simulator: stable crc32 buckets and an honest promoted decision. Move one sample and watch the decision flip; raise the threshold and watch a healthy slice get rejected — then ask yourself: who owns the threshold number on your imaginary team, and when was rollback last rehearsed? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن PY4E الفصل التاسع: في مثال الكتاب قرأنا flags["new_scheduler_pct"] بالأقواس المربعة. ماذا يحدث لو قرأت مفتاحًا غير موجود بهذه الطريقة؟',
            en: 'From PY4E chapter 9: the book\u2019s example reads flags["new_scheduler_pct"] with square brackets. What happens when a missing key is read that way?',
          },
          options: [
            { id: 'a', text: { ar: 'تعيد None بصمت', en: 'It silently returns None' } },
            { id: 'b', text: { ar: 'يرفع KeyError — ولهذا تُقرأ العلامات الاختيارية بـ .get مع افتراضي', en: 'It raises KeyError — which is why optional flags are read with .get and a default' } },
            { id: 'c', text: { ar: 'تنشئ المفتاح بقيمة صفرية', en: 'It creates the key with a zero value' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'القراءة بالأقواس صارمة: مفتاح غائب يعني KeyError. وفي خطوط النشر الحقيقية تكون العلامات الاختيارية تقرأ بـ get مع افتراض آمن — الصمت المخطط له أفضل من انهيار الصفحة لأن علامة حُذفت من الإعداد.',
            en: 'Bracket reads are strict: a missing key is a KeyError. In real deployment code optional flags are read with .get and a safe default — planned silence beats a page crash because one flag left the config.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'أي استراتيجية تبقي نسختين كاملتين من الإنتاج تعملان في الوقت نفسه؟',
            en: 'Which strategy keeps two full copies of production running at the same time?',
          },
          options: [
            { id: 'a', text: { ar: 'الأزرق-الأخضر — بيئتان متطابقتان وقلب موجّه واحد', en: 'blue-green — two identical environments and one router flip' } },
            { id: 'b', text: { ar: 'الكناري — شريحة صغيرة فقط ترى الجديد', en: 'canary — only a small slice sees the new version' } },
            { id: 'c', text: { ar: 'علامة الميزة — كود واحد وحالة مفتاح في الإعداد', en: 'feature flag — one codebase and a toggle state' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأزرق-الأخضر يدفع ثمنه في البنية المضاعفة ليشتري تراجعًا بقلب موجّه؛ والكناري يوفر البنية لكنه يخليط النسختين في الحركة؛ والعلامة أرخص الجميع لكنها تفصل الإصدار لا النشر. ولكلٍّ ثمنه وسؤاله.',
            en: 'Blue-green pays in doubled infrastructure to buy a router-flip rollback; the canary saves infrastructure but mixes versions in traffic; the flag is cheapest of all but separates release, not deployment. Each has its own price and question.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي تغيير لا يمكن التراجع عنه إطلاقًا، فيصبح سرعة التقدّم للأمام نفسها خاصية أمان؟',
            en: 'Which change cannot be rolled back at all, making roll-forward speed itself the safety property?',
          },
          options: [
            { id: 'a', text: { ar: 'تغيير لون في واجهة المستخدم', en: 'A color change in the user interface' } },
            { id: 'b', text: { ar: 'ترحيل بيانات لا رجعة فيه — أو ترقيع أمني لا يصح فكّه', en: 'An irreversible data migration — or a security fix you must not un-ship' } },
            { id: 'c', text: { ar: 'إضافة ميزة خلف علامة مطفأة', en: 'A new feature behind a disabled flag' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الترحيل غير القابل للعكس غيّر الأرض التي يقف عليها النسخ القديمة، والترقيع الأمني فكُّه يعيد الثغرة — فالطريق الوحيد هو إصلاح أسرع، ولهذا يُقاس زمن حمل السطر الواحد إلى الإنتاج ويُعتبر قدرة سلامة.',
            en: 'An irreversible migration changed the ground old versions stand on, and un-shipping a security fix restores the hole — the only route is a faster fix, which is why one-line-fix lead time is measured as a safety capability.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي درس يستخلصه الكتاب من حادثة CrowdStrike دون Knight؟',
            en: 'Which lesson does the book draw from CrowdStrike that Knight does not teach?',
          },
          options: [
            { id: 'a', text: { ar: 'النشر اليدوي كارثي — خوادم ثمانية نُسخت يدويًّا وسقط أحدها', en: 'Manual deployment is dangerous — eight servers copied by hand, one missed' } },
            { id: 'b', text: { ar: 'الأتمتة وحدها ليست أمانًا: دفع عالمي متزامن بلا تعرض تدريجي شحن عيبًا واحدًا للجميع دفعة واحدة', en: 'Automation alone is not safety: a global simultaneous push with no progressive exposure shipped one defect to everyone at once' } },
            { id: 'c', text: { ar: 'الاختبارات الوحدوية تكفي لمنع مثل هذه الأعطال', en: 'Unit tests alone prevent such outages' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'Knight يثبت كلفة غياب الأتمتة، وCrowdStrike يثبت أن أتمتة بلا حلقات كنارية آلةُ توزيعٍ للعيب — الاثنان معًا: الأتمتة تحدد السرعة، والتعريض التدريجي يحدد الإشارة.',
            en: 'Knight shows the cost of no automation; CrowdStrike shows automation without canary rings is a defect-distribution machine — together: automation sets the speed, progressive exposure sets the sign.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'إعادة استعمال علامة قديمة للتحكم في سلوك جديد («الاسم موجود، لا يهم ما كان يفعل»)',
          right: 'العلامة القديمة تُقاعد وتُحذف من كودها الميت ويُختار اسم جديد — أسماء العلامات رخيصة والبديل لم يكن كذلك',
          note: {
            ar: 'هذه بالضبط سلسلة Knight: علامة Power Peg أعيد استعمالها وكودها الميت جالس منذ 2003 — فاستيقظ حين وجد خادمًا نسيَ التحديث. الكود الميت المسلّح عيب نائم في الإنتاج، والعلامة المُعاد استعمالها مفتاحه.',
            en: 'This is exactly Knight\u2019s chain: the Power Peg flag was repurposed with its dead code sitting since 2003 — it woke the moment one server missed the update. Armed dead code is a dormant defect in production, and a repurposed flag is its trigger.',
          },
        },
        {
          wrong: '«التغيير آمن الدمج لكنه ليس جاهزًا للشحن — سنحتفظ به في فرع حتى الموعد»',
          right: 'ادمجه مطفأً خلف علامة ميزة — التكامل يبقى متصلًا والإصدار يصير قلب بيت واحد',
          note: {
            ar: 'الفرع الطويل يعيد انحراف الدمج الكبير، والعلامة تعالج الاعتراض من جذوره: العمل غير المنتهٍ يُدمج معطلًا، والإصدار قرار ثوانٍ قابل للعكس — وأي علامة تعيش فوق سباق تحتاج مالكًا وتاريخ حذف مكتوبَين.',
            en: 'A long-lived branch re-creates big-bang merging; the flag solves the objection at its root: unfinished work merges dark, release becomes a reversible seconds-long flip — and any flag living past a sprint needs an owner and a removal date in writing.',
          },
        },
        {
          wrong: '«لدينا تراجع بالضغطة — لا حاجة لتجربته»',
          right: 'التراجع غير المُختبر إشاعة لا قدرة: تدرّب عليه بروتينًا — فليكن نهاية كل كناري فاشل طبيعيًّا',
          note: {
            ar: 'الانحراف بين الإصدارات قد يجعل الكود القديم عاجزًا عن قراءة بيانات الجديد، والأثر السابق قد لا يوجد — وحتى التراجع الخاطئ يفاقم (في Knight كان التراجع هو الذي عمّم السلوك المكسور على الثمانية). ميكانيزم لا يُتدرَّب عليه يفشل في أول أزمة حقيقية.',
            en: 'Version skew can leave old code unable to read new data, the previous artifact may be gone — and even the wrong rollback amplifies damage (at Knight it was the rollback that spread the broken behavior to all eight). A mechanism nobody rehearses fails at the first real crisis.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التسليم المستمر يجعل الإصدار ممكنًا في أي لحظة، والنشر المستمر يجعله فعليًّا في كل لحظة — والثاني يحرّم كل أمان غير مؤتمت: علامة أو لا دمج.', en: 'Continuous delivery makes release possible at any moment; continuous deployment makes it actual at every moment — the second forbids every non-automated safety net: flag it or do not merge it.' },
        { ar: 'التبادل الآمن نسختان: أزرق-أخضر يقلب موجّهًا بين بيئتين، وكناري يقرأ معدل أخطاء شريحة صغيرة — وcrc32(user_id) % 100 يعطي كل مستخدم دلوًا ثابتًا عادلًا، وpromoted: False قرارٌ صادق يصمت عن التعميم.', en: 'Two safe swaps: blue-green flips a router between environments; a canary reads a small slice\u2019s error rate — and crc32(user_id) % 100 gives every user a fair, stable bucket, with promoted: False the honest decision that halts the rollout.' },
        { ar: 'التراجع انعكاس افتراضي مُتدرَّب، والتقدّم للإصلاح سرعته خاصية أمان — وKnight (بلا أتمتة) وCrowdStrike (بلا تعريض تدريجي) السجلّان الدائمان لطرفَي الفشل.', en: 'Rollback is the default reflex and roll-forward speed a safety property — Knight (no automation) and CrowdStrike (no progressive exposure) are the permanent record of failure\u2019s two extremes.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وحرّك عينةً واحدةً في قائمة الأخطاء وشاهد القرار ينقلب بين promoted: True وpromoted: False. اسأل نفسك: لو كنت تدير خدمة لها مستخدمون حقيقيون — ما العتبة التي ستعلنها قبل أول نشر، وما أول شيء ستتدرّب عليه: الترقية أم التراجع؟ ولماذا الإجابة الصحيحة عادة الثانية؟',
        en: 'Open the sandbox and move a single sample in the error list, watching the decision flip between promoted: True and promoted: False. Ask yourself: running a service with real users — what threshold would you declare before the first deploy, and what would you rehearse first: promotion or rollback? Why is the second usually the right answer?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch14.s3', pages: 'ص383-389 / pp.383-389' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch14.s3', pages: 'ص383-389 / pp.383-389' },
  ],
} satisfies Lesson;

export default lesson;
