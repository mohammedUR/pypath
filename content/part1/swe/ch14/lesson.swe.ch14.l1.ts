import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch14.l1 — "SaaS and the Cloud and Continuous Integration Pipelines
 * الخدمات السحابية وخطوط التكامل المستمر"
 * Aligned with SWE ch14 s1 (14.1 SaaS and the Cloud, pp.375-379) +
 * s2 (14.2 Continuous Integration Pipelines, pp.379-383).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * SIMULATED-CI PATTERN: there is no CI server, shell, or container runtime in
 * the browser sandbox — real pipeline tooling appears ONLY in concept prose.
 * Every runnable field is a pure-Python pipeline model (a stages list, job
 * status dicts, and a fixed commit stream) producing run logs like
 * 'build: ok / test: FAIL / pipeline: red'. Deterministic only.
 */

const lesson = {
  id: 'swe.ch14.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 14,
  title: { ar: 'الخدمات السحابية وخطوط التكامل المستمر', en: 'SaaS and the Cloud and Continuous Integration Pipelines' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch12.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'اثنا عشر فصلًا علّموك كيف تبني البرمجيات وتتحقق منها — لكن commit مُتحقق منه داخل مستودع لا ينفع أحدًا. هذا الفصل يقطع المسافة بين «الكود كُتب» و«المستخدمون يشغّلونه»، وكل ما سبق إما يصبح حقيقيًّا هنا أو يظل نظريًّا. تحوّلان أنهيا عهد التسليم كعملية ثانوية: انتقال البرمجيات إلى السحابة حيث صار الإصدار قرارًا يوميًّا لا مناسبة، وأتمتة التحقق في خط التكامل المستمر حيث تصبح المراجعات والتحليل الساكن والاختبارات بوابات لا يتخطاها تغيير. بيئة المتصفح لا تشغّل خوادم CI ولا حاويات — فسنبني كل شيء نموذجًا بايثونيًّا خالصًا: قائمة مراحل، وقواميس حالة، وتيار التزامات ثابت يُنتج سجلّ تشغيل يمكن قراءته. بنهاية الدرس ستكون قادرًا على: شرح انقلاب SaaS وأساسيات السحابة الأربعة، وتسمية مراحل الخط بترتيب كلفتها، وتطبيق انضباط البناء المكسور، ومحاكاة خط fail-fast يوقف التزامًا مكسورًا عند أول فشل.',
        en: 'Twelve chapters taught you to build software and verify it — but a verified commit sitting in a repository helps no one. This chapter covers the stretch between \u201cthe code is written\u201d and \u201cusers are running it\u201d, where every earlier discipline either becomes real or stays theoretical. Two shifts ended delivery as an afterthought: software moving to the cloud, where releasing stopped being a ceremony and became a daily decision, and the CI pipeline, where reviews, static analysis and tests become gates no change can skip. Your browser sandbox runs no CI servers and no containers — so we model everything in pure Python: a stages list, status dicts, and a fixed commit stream producing a readable run log. By the end you will be able to: explain the SaaS inversion and the four cloud essentials, name pipeline stages in cost order, apply broken-build discipline, and simulate a fail-fast pipeline that stops a broken commit at its first failure.',
      },
    },
    {
      kind: 'predict',
      code: "commits = {'c1': {'build': 'ok', 'test': 'ok'}, 'c2': {'build': 'ok', 'test': 'FAIL'}}\nfor cid in ['c1', 'c2']:\n    ok = 0\n    for stage in commits[cid]:\n        if commits[cid][stage] == 'ok':\n            ok += 1\n    print('%s stages: %d' % (cid, ok))",
      question: {
        ar: 'التزامان، وكل stage في كل التزام يحمل حالة نصية. أي التزام يجب أن يوقف الخط، وما القيمة النصية الوحيدة التي تفصل السطرين المطبوعين عن قراءة red؟',
        en: 'Two commits, each stage carrying a text status. Which commit should stop the line, and which single status value separates these printed counts from a red verdict?',
      },
      reveal: {
        ar: 'الطباعة: c1 stages: 2 ثم c2 stages: 1. التزام c2 هو الذي يوقف الخط لأن حالة test فيه ليست ok. الفكرة العميقة: البوابة كلها تقوم على مقارنة نصية واحدة — ok تعني «مرّت» وFAIL تعني «توقف»، وعدّ المراحل الناجحة هو أول خطوة نحو حكم pipeline: green أو pipeline: red. كل شيء في درس اليوم سيبني على هذا التبسيط المتعمد: حالة نصية لكل مرحلة، وحكم مشتق منها.',
        en: 'It prints c1 stages: 2 then c2 stages: 1. Commit c2 is the one that stops the line because its test status is not ok. The deep idea: the whole gate is one string comparison — ok means passed, FAIL means stop, and counting the passing stages is the first step toward a pipeline: green or pipeline: red verdict. Everything today builds on that deliberate simplification: one status per stage, and a verdict derived from them.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من قرص مصغّر إلى خدمة تعمل: SaaS والسحابة', en: 'From shrink-wrap to running service: SaaS and the cloud' },
      chunks: [
        {
          ar: 'معظم تاريخ البرمجيات كان التسليم فيه أثرًا يُشحن: قرص أو مثبِّت يأخذه العميل ويشغّله على جهازه، وينتهي دور البائع عند بوابة المصنع — فالإصدارات نادرة وثقيلة وغير قابلة للترقيع لشهور. البرمجيات كخدمة SaaS تقلب الترتيب: البرنامج يعمل على آلات يتحكم بها البائع، ويصل إليه المستخدم عبر الشبكة — في شكله النقي لا شيء يُشحن. النتيجة: البائع يتحكم بما يعمل في الإنتاج (إصدارات كنارية وعلامات ميزات تسمح بخلط الإصدارات قليلًا)، ويلاحظ الاستخدام الفعلي من السجلات، والتحديث عملية داخلية تصمت عدة مرات يوميًّا. وتشغيل مستأجرين متعددين على نسخة واحدة يجعل الخدمة اقتصادية — لكنه يجعل العزل مشكلة برمجية: تسريب بيانات مستأجر و«الجار الصاخب» أوضاع فشل لم تكن ممكنة في القرص المشحون.',
          en: 'For most of software history, delivering meant shipping an artifact — a CD or installer the customer ran on their machine, the vendor\u2019s job ending at the factory gate; releases were rare, heavy, and unpatchable for months. Software as a service (SaaS) inverts it: the software runs on vendor-controlled machines and users reach it over the network — nothing ships. Consequences: the provider controls what runs in production (canaries and feature flags may briefly mix versions), observes real usage through logs, and an update is an internal, invisible, many-times-a-day operation. Multi-tenancy — one instance serving many customers — is what makes SaaS economical, but it turns isolation into a software problem: tenant-data leaks and the noisy neighbor are failure modes a shipped artifact never had.',
        },
        {
          ar: 'الحمل غير المتوقع يُدار بالتوسّع الأفقي: نسخ أكثر من الخدمة نفسها خلف موزع أحمال بدل آلة أكبر — وهو لا يعمل نظيفًا إلا إذا أجاب أي خادم أي طلب، ولهذا كانت عديمة الحالة في تصميم REST قرار تسليم لا قرارًا معماريًّا فقط. والسحابة العامة تبيع أربع عائلات: compute وstorage وnetwork وsecurity/identity، بوعد اقتصادي ثلاثي: تدفع ما تستخدمه، وتضع نظامك قرب مستخدميك، والعتاد مشكلة غيرك. لكن مسؤولية الأمن مشتركة: المزوّد يؤمّن السحابة (المرافق والعتاد) وأنت تؤمّن ما بداخلها — إعدادات نظامك وكودك وبياناتك ومن يصل إليها؛ دلو تخزين مفتوح على العالم خللٌ لك أنت مهما أُمِّنت المنشأة. وعندما يصبح النشر رخيصًا متصلًا يتلاشى ضغط موعد الإصدار الواحد: الإصدار قرار صغير قابل للتراجع، لكل ميزة على حدة.',
          en: 'Unpredictable load is handled by horizontal scaling: more copies of the same service behind a load balancer instead of a bigger machine — which only works cleanly if any copy can serve any request, making RESTful statelessness a delivery decision, not just an architectural one. The public cloud sells four component families: compute, storage, network, and security/identity, with a threefold economic promise: pay for what you use, place systems near your users, and hardware becomes someone else\u2019s problem. But security responsibility is shared: the provider secures the cloud (facilities, hardware, hypervisor) while you secure what is in it — your OS configuration, code, data, and access; a world-readable storage bucket is your breach, however secure the facility. And once deploying is cheap and continuous, the single release date dissolves: release becomes a small, revocable, per-feature decision.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'خط التكامل المستمر: البوابة التي لا يخطها التزام', en: 'The CI pipeline: the gauntlet no commit skips' },
      chunks: [
        {
          ar: 'CI أولًا سياسة تفريع ثم خادم: في التطوير القائم على الجذع trunk-based يلتزم الفريق كله في خط رئيس واحد مباشرة أو عبر فروع قصيرة تعيش ساعات إلى يومين — فالانحراف بين الفروع يزيد مع الزمن، والدمج الكبير المتأخر يعيد كارثة التكامل الانفجاري. ومرارتك «كيف ألتزم عملًا غير منتهٍ؟» جوابها القياسي: أخفِه خلف علامة ميزة، فيصبح التكامل والإصدار قرارين مستقلين.',
          en: 'CI is first a branching policy, then a server: in trunk-based development the whole team commits to one shared mainline, directly or via short-lived branches living hours to a couple of days — divergence grows with time, and a big late merge recreates big-bang integration. The classic objection \\u201chow do I commit unfinished work?\\u201d has a standard answer: hide it behind a feature flag, making integration and release independent decisions.',
        },
          {
          ar: 'أما خط CI فهو الممر الآلي لكل التزام، ومراحله بترتيب الكفة تصاعديًّا مع فشل سريع: build يثبت أن التغيير يُترجم واعتمادياته تُحل — أرخص فحص فيبدأ أولًا؛ ثم فحوص ساكنة (linters ومفحوصات أنواع) تمسك أصناف عيوب بلا تنفيذ سطر؛ ثم الاختبارات بترتيب الهرم: unit أولًا لأنها أسرع وأدق تعيينًا للفشل، ثم integration، ثم طبقة رقيقة من end-to-end؛ فإن نجح كل ذلك ينتج الخط أثرًا مُرقَّمًا يُبنى مرة واحدة ويُخزَّن ولا يُعاد بناؤه — لأن الأثر الذي اختبرته هو حرفيًّا ما ستنشره.',
          en: 'The pipeline itself is the automated gauntlet every commit runs, stages ordered by increasing cost, failing fast: build proves the change compiles and dependencies resolve — the cheapest check, so it runs first; static checks (linters, type checkers) catch defect classes without executing a line; then tests in pyramid order — unit first because they are fast and localize failures, then integration, then a thin end-to-end layer; if all pass, the pipeline produces a versioned artifact built exactly once, never rebuilt — the artifact you tested is literally the one you deploy.',
        },
        {
          ar: 'الخط يساوي ما يساويه رد فعل الفريق على الأحمر: البناء الأحمر طارئ الجميع — إصلاحه أو تراجع الالتزام المكسور يتقدم على أي عمل جديد، ولا يُلتزم فوق بناء أحمر أبدًا، وإن لم يُصلَح بسرعة فيُتراجَع — التراجع ليس إهانة بل أرخص طريق إلى حالة معروفة الصلاح.',
          en: 'A pipeline is only as good as the team\\u2019s response to red: a red mainline is everyone\\u2019s emergency — fixing it or reverting the breaking commit outranks new work, you never commit on top of a broken build, and if you cannot fix it quickly, revert — reverting is not defeat, it is the cheap path back to known-good.',
        },
          {
          ar: 'والاختبار المتقلب flaky أخطر من اختبار يفشل دائمًا: إنه يعلّم الفريق تجاهل الأحمر حتى تمر الأخطاء الحقيقية على نفس التهمة — فاعزله فورًا وعالجه كعيب في الحزمة نفسها. والسرعة قيد صلب: هدف معقول نحو عشر دقائق من الدفع إلى الحكم؛ إن طال الخط دفع المطورين إلى تغييرات أكبر لتوزيع الانتظار — فعالج البطء كخلل عملية: ادفع الفحوص أسفل الهرم، وشغّل المراحل المستقلة بالتوازي، وخلّص الأجزاء غير المتغيرة من إعادة البناء.',
          en: 'A flaky test is more corrosive than an always-failing one: it teaches the team to ignore red until real failures slip through on the same shrug — quarantine it immediately and treat its existence as a defect in the suite itself. Speed is a hard constraint: a useful target is roughly ten minutes from push to verdict; a slow pipeline pushes developers toward bigger, riskier batches — so treat slowness as a process defect: push checks down the pyramid, run independent stages in parallel, and cache so unchanged parts are not rebuilt.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'خط مصغّر fail-fast: توقف عند أول فشل', en: 'A miniature fail-fast pipeline: stop at the first failure' },
      code: "stages = ['build', 'static', 'test', 'package']\n\ncommits = {\n    'c1': {'build': 'ok', 'static': 'ok', 'test': 'FAIL', 'package': 'ok'},\n    'c2': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},\n}\n\ndef run_pipeline(cid):\n    commit = commits[cid]\n    for stage in stages:\n        status = commit[stage]\n        print('%s: %s' % (stage, status))\n        if status == 'FAIL':\n            print('pipeline: red')\n            return 'red'\n    print('pipeline: green')\n    return 'green'\n\nrun_pipeline('c1')\nrun_pipeline('c2')",
      explanation: {
        ar: 'أربعة أشياء تلاحظها: قائمة stages بترتيب الكفة — build أولًا لأنه أرخص فحص؛ وقاموس لكل التزام يحمل حالة كل مرحلة؛ وحلقة تمشي المراحل بالترتيب وتطبع سجل التشغيل سطرًا سطرًا؛ وحكم فوري عند أول FAIL — التزام c1 طبع build: ok وstatic: ok ثم test: FAIL فنطبع pipeline: red وخرجنا فورًا: مرحلة package لم تُهدر عليه ثانية. أما c2 فمشى المراحل الأربع كلها وأطبعت pipeline: green. هذه دلالة fail-fast: حكم الخط يأتي عند أول فشل لا عند آخر نجاح، وكل ثانية بعد الفشل هدر. في التمرين ستعمّم النموذج على تيار ثلاثة التزامات مع مرحلة static مكسورة.',
        en: 'Four things to notice: the stages list in cost order — build first as the cheapest check; a status dict per commit; a loop walking the stages in order printing the run log line by line; and an instant verdict at the first FAIL — commit c1 printed build: ok, static: ok, then test: FAIL, so we printed pipeline: red and returned immediately: the package stage never wasted a second on it. Commit c2 walked all four stages and printed pipeline: green. That is fail-fast semantics: the verdict arrives at the first failure, not the last success — every second after a failure is waste. The exercise generalizes this model to a three-commit stream with a broken static stage.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.pipeline-runner',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'عمّم النموذج إلى تيار ثلاثة التزامات. المطلوب تنفيذ run_pipeline(cid) التي تمشي قائمة stages بالترتيب، وتطبع لكل مرحلة سطرًا بالصيغة stage: status، وعند أول حالة FAIL تطبع pipeline: red وتتوقف فورًا — لا تطبع شيئًا للمراحل اللاحقة — وتعيد السلسلة red؛ فإن نجحت المراحل كلها تطبع pipeline: green وتعيد green. أبقِ حلقة الاستدعاء على c1 وc2 وc3 كما هي. المتوقع: c1 خضراء كاملة، ثم c2 تتحمر عند static، ثم c3 خضراء.',
        en: 'Generalize the model to a three-commit stream. Implement run_pipeline(cid) that walks the stages list in order, prints one line per stage in the form stage: status, and at the first FAIL prints pipeline: red and stops immediately — printing nothing for later stages — returning the string red; if every stage passes it prints pipeline: green and returns green. Keep the given c1/c2/c3 call loop as is. Expected: c1 fully green, c2 goes red at static, c3 green again.',
      },
      starterCode: "stages = ['build', 'static', 'test', 'package']\n\ncommits = {\n    'c1': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},\n    'c2': {'build': 'ok', 'static': 'FAIL'},\n    'c3': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},\n}\n\ndef run_pipeline(cid):\n    # امشِ المراحل بالترتيب، اطبع stage: status، وتوقف عند أول FAIL\n    # walk the stages in order, print stage: status, stop at the first FAIL\n    pass\n\nfor cid in ['c1', 'c2', 'c3']:\n    run_pipeline(cid)",
      solution: "stages = ['build', 'static', 'test', 'package']\n\ncommits = {\n    'c1': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},\n    'c2': {'build': 'ok', 'static': 'FAIL'},\n    'c3': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},\n}\n\ndef run_pipeline(cid):\n    commit = commits[cid]\n    for stage in stages:\n        status = commit[stage]\n        print('%s: %s' % (stage, status))\n        if status == 'FAIL':\n            print('pipeline: red')\n            return 'red'\n    print('pipeline: green')\n    return 'green'\n\nfor cid in ['c1', 'c2', 'c3']:\n    run_pipeline(cid)",
      tests: [
        {
          id: 't1',
          name: { ar: 'سجل التشغيل يُظهر الفشل والتحمر', en: 'The run log shows the failure and the red verdict' },
          code: "assert 'build: ok' in __learner_output__ and 'static: FAIL' in __learner_output__ and 'pipeline: red' in __learner_output__, 'expected: build: ok, static: FAIL, pipeline: red | actual: %r' % __learner_output__",
          expected: 'build: ok, static: FAIL, pipeline: red',
        },
        {
          id: 't2',
          name: { ar: 'التزامان صحيحان يحصلان على green', en: 'Healthy commits get green' },
          code: "assert 'pipeline: green' in __learner_output__, 'expected: pipeline: green | actual: %r' % __learner_output__",
          expected: 'pipeline: green',
        },
        {
          id: 't3',
          name: { ar: 'fail-fast: لا مراحل بعد التحمر', en: 'fail-fast: nothing runs after red' },
          code: "assert 'pipeline: red\\nbuild: ok' in __learner_output__, 'expected: the line after pipeline: red is the next commit build: ok (no skipped stages) | actual: %r' % __learner_output__",
          expected: 'the line after pipeline: red is the next commit build: ok (no skipped stages)',
        },
        {
          id: 't4',
          name: { ar: 'الدالة تعيد الحكم', en: 'The function returns the verdict' },
          code: "assert run_pipeline('c2') == 'red' and run_pipeline('c3') == 'green', 'expected: c2 -> red and c3 -> green | actual: %r' % ((run_pipeline('c2'), run_pipeline('c3')),)",
          expected: 'c2 -> red and c3 -> green',
        },
      ],
      hints: [
        { ar: 'الهيكل هو المثال العملي نفسه: لكل stage في stages اقرأ الحالة من commits[cid]، واطبع \'%s: %s\' % (stage, status) قبل أي مقارنة — سجل التشغيل يسبق الحكم.', en: "The skeleton is the worked example itself: for each stage in stages read the status from commits[cid] and print '%s: %s' % (stage, status) before any comparison — the run log precedes the verdict." },
        { ar: 'الفشل السريع يعني return داخل الحلقة: عند status == \'FAIL\' اطبع pipeline: red ثم return \'red\' — وما بعد return لا يُنفَّذ، ولهذا لن تظهر مراحل لاحقة بعد التحمر.', en: "Fail-fast means returning inside the loop: when status == 'FAIL' print pipeline: red then return 'red' — nothing after return executes, which is why later stages never appear after red." },
        { ar: 'السطر التالي بعد pipeline: red يجب أن يكون build: ok الخاص بـ c3 — إن ظهرت مرحلة package أو static إضافية بعد الأحمر فأنت تكمل الحلقة بعد الفشل، والعيب في موضع return.', en: "The line right after pipeline: red must be c3's build: ok — if an extra static or package line appears after red you are continuing the loop past the failure; the defect is in where the return sits." },
        { ar: 'الحل الكامل:\ndef run_pipeline(cid):\n    commit = commits[cid]\n    for stage in stages:\n        status = commit[stage]\n        print(\'%s: %s\' % (stage, status))\n        if status == \'FAIL\':\n            print(\'pipeline: red\')\n            return \'red\'\n    print(\'pipeline: green\')\n    return \'green\'', en: "Full solution:\ndef run_pipeline(cid):\n    commit = commits[cid]\n    for stage in stages:\n        status = commit[stage]\n        print('%s: %s' % (stage, status))\n        if status == 'FAIL':\n            print('pipeline: red')\n            return 'red'\n    print('pipeline: green')\n    return 'green'" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-verdict',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. انتبه: هذه الحلقة لا تتوقف عند الفشل، لكنها تحمل حكمًا.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Notice: this loop does not stop on failure, yet it carries a verdict.',
      },
      code: "stages = ['build', 'static', 'test']\ncommit = {'build': 'ok', 'static': 'FAIL', 'test': 'ok'}\nverdict = 'green'\nfor s in stages:\n    print('%s: %s' % (s, commit[s]))\n    if commit[s] != 'ok':\n        verdict = 'red'\nprint(verdict)",
      solution: 'build: ok\nstatic: FAIL\ntest: ok\nred',
      answer: 'build: ok\nstatic: FAIL\ntest: ok\nred',
      hints: [
        { ar: 'الحلقة تطبع حالة كل مرحلة بالترتيب المكتوب في القائمة، بلا أي توقف: build ثم static ثم test — سجل كامل مهما حدث.', en: 'The loop prints every stage status in list order with no stopping: build, then static, then test — a complete log no matter what.' },
        { ar: 'القيمة static: FAIL تغيّر verdict إلى red لكنها لا تقطع الدوران — فالسطر الثالث يطبع test: ok رغم التحمر.', en: 'The static: FAIL value flips verdict to red but does not break the loop — the third line still prints test: ok despite the red.' },
        { ar: 'بعد الحلقة يُطبع الحكم النهائي: verdict أصبح red بعد الفرع الثاني ولم يعد green.', en: 'After the loop the final verdict prints: verdict became red at the second stage and never returned to green.' },
        { ar: 'الخرج:\nbuild: ok\nstatic: FAIL\ntest: ok\nred', en: 'The output:\nbuild: ok\nstatic: FAIL\ntest: ok\nred' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-red-build',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'التزام زميل كسر بناء الجذع صباح اليوم، وأنت في وسط ميزة عاجلة لا علاقة لها به. ماذا يقول انضباط البناء المكسور؟',
        en: 'A teammate\u2019s commit broke the trunk build this morning, and you are mid-way through an unrelated urgent feature. What does broken-build discipline say?',
      },
      options: [
        { id: 'a', text: { ar: 'التزم شغلك فوق البناء الأحمر — تغييراتك مستقلة عن الخلل', en: 'Commit your work on top of the red build — your changes are unrelated to the defect' } },
        { id: 'b', text: { ar: 'البناء الأحمر طارئ الجميع: إصلاحه أو تراجع الالتزام المكسور يتقدم على العمل الجديد، والتراجع خيار مشروع ورخيص', en: 'A red mainline is everyone\u2019s emergency: fixing it or reverting the breaking commit outranks new work, and reverting is a legitimate, cheap move' } },
        { id: 'c', text: { ar: 'انتظر البناء الليلي المجدول — سيصير الخط أخضر صباحًا وحده', en: 'Wait for the scheduled nightly build — the pipeline will be green by morning on its own' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'الالتزام فوق بناء أحمر يكدّس تغييرًا غير مُتحقق منه فوق آخر — بالضبط الانحراف الذي وُجد CI ليمنعه.', en: 'Committing on a red build stacks unverified change on unverified change — exactly the divergence CI exists to prevent.' },
        { ar: 'ما دام الخط أحمر فلا أحد يعرف إن كان النظام يعمل؛ كل ساعة تأخير تعني زملاء محجوبين أو يبنون على رمل.', en: 'While the build is red nobody knows whether the system works; every delayed hour means blocked teammates or people building on sand.' },
        { ar: 'التراجع ليس هزيمة: إنه الطريق الرخيص المتاح دائمًا إلى حالة معروفة الصلاح — والفريق الذي يعتبره روتينًا يبقى أخضر أكثر من الفريق الذي يعتبره إهانة.', en: 'Reverting is not defeat: it is the cheap, always-available path back to a known-good state — teams that treat it as routine stay green far more than teams that treat it as an insult.' },
        { ar: 'الجواب: b — إصلاح أو تراجع فورًا، ولا التزام فوق الأحمر، ولا بناء أحمر يبيت ليلته.', en: 'Answer: b — fix or revert immediately, never commit on red, never leave a broken build overnight.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-revert',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'إن لم تستطع إصلاح البناء الأحمر بسرعة، فالانسحاب الرخيص المتاح دائمًا في ثقافة CI هو عمل ______ للالتزام المكسور بدل تركه يحجب الفريق. (كلمة إنجليزية واحدة)',
        en: 'If you cannot fix a red build quickly, the cheap, always-available exit in CI culture is to ______ the breaking commit rather than leave the team blocked. (one English word)',
      },
      answer: 'revert',
      solution: 'revert',
      hints: [
        { ar: 'الفكرة ليست «أصلح الآن أو لا شيء» — هناك مسار ثالث مشروع يعيد الجذع إلى آخر حالة معروفة الصلاح.', en: 'The choice is not \u201cfix now or nothing\u201d — there is a legitimate third route that returns the trunk to the last known-good state.' },
        { ar: 'أنت تعرف هذا الفعل من SWE الفصل الثامن: git ______ يضيف التزامًا جديدًا يقلب القديم دون محو التاريخ.', en: 'You know this act from SWE chapter 8: git ______ adds a new commit reversing an old one without erasing history.' },
        { ar: 'الفعل ليس reset (فهو يعيد كتابة التاريخ المشترك) بل تراجع آمن قابل للمشاركة.', en: 'The act is not reset (which rewrites shared history) but a safe, shareable reversal.' },
        { ar: 'الجواب: revert — والفريق الذي يعتبره روتينًا يبقى أخضر أكثر.', en: 'Answer: revert — teams that treat it as routine stay green far more.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "stages = ['build', 'static', 'test', 'package']\ncommits = {\n    'c1': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},\n    'c2': {'build': 'ok', 'static': 'ok', 'test': 'FAIL', 'package': 'ok'},\n}\n\ndef run_pipeline(cid):\n    commit = commits[cid]\n    for stage in stages:\n        status = commit[stage]\n        print('%s: %s' % (stage, status))\n        if status == 'FAIL':\n            print('pipeline: red')\n            return 'red'\n    print('pipeline: green')\n    return 'green'\n\nrun_pipeline('c1')\nrun_pipeline('c2')\n\n# جرّب: انقل FAIL إلى build في c2 ولاحظ أقصر سجل ممكن — هذا معنى «أرخص فحص أولًا»\n# try: move the FAIL into c2's build and watch the shortest possible log — that is \"cheapest check first\"\n# جرّب: احذف سطري print('pipeline: red') وreturn 'red' وضع مكانها verdict = 'red' وطبع الحكم بعد الحلقة — ماذا يحدث لسجل c2؟\n# try: replace the pipeline: red print + return pair with verdict = 'red' printed after the loop — what happens to c2's log?\n# جرّب: أضف التزامًا ثالثًا فيه package وحدها FAIL — هل يصل الأثر إلى مرحلة الحزمة أصلًا؟\n# try: add a third commit failing only at package — does the artifact stage ever get reached?",
      prompt: {
        ar: 'الملعب خطك المصغّر: حرك حالة FAIL بين المراحل ولاحظ كيف يقصّر السجل عند الفشل المبكر، ثم انزع الفشل السريع وشاهد الخط يهدر ثواني على التزام ميت. اسأل نفسك: أي مرحلة سترى تغييراتك أولًا في مشروعك الحقيقي، ولماذا يجب أن تبقى أرخصها أولًا؟ لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is your miniature pipeline: move the FAIL across stages and watch the log shrink when failure lands early, then remove fail-fast and watch the line waste seconds on a dead commit. Ask yourself: which stage sees your change first in a real project, and why must the cheapest stay first? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن SWE الفصل العاشر: مرحلة test في الخط تشغّل الاختبارات بترتيب الهرم. أي مستوى يجري أولًا ولماذا؟',
            en: 'From SWE chapter 10: the pipeline\u2019s test stage runs tests in pyramid order. Which level runs first and why?',
          },
          options: [
            { id: 'a', text: { ar: 'end-to-end لأنها الأقرب لسلوك المستخدم الحقيقي', en: 'end-to-end, because it is closest to real user behavior' } },
            { id: 'b', text: { ar: 'unit لأنها الأسرع وأدق ما يعيّن موضع الفشل — والهرم ميزانية تُبقي الطبقة البطيئة رقيقة', en: 'unit, because they are fastest and localize failures precisely — the pyramid is a budget keeping the slow layer thin' } },
            { id: 'c', text: { ar: 'integration لأنها توازن بين السرعة والواقعية', en: 'integration, balancing speed and realism' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الهرم ميزانية هندسية لا أذواق: unit سريعة ومعزولة فتُقصد أولًا، والطبقات الأغلى تصعد كلما ضاق المرشح. والخط البطيء يعيد إنتاج التغييرات الكبيرة التي جاء CI ليقضي عليها.',
            en: 'The pyramid is an engineering budget: fast isolated unit tests go first, pricier layers climb as the candidate narrows. A slow pipeline re-creates the big batches CI was built to eliminate.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن SWE الفصل التاسع: أي مرحلة في الخط تحوّل التحليل الساكن من ممارسة مجدية إلى بوابة إلزامية؟',
            en: 'From SWE chapter 9: which pipeline stage turns static analysis from a diligent practice into a mandatory gate?',
          },
          options: [
            { id: 'a', text: { ar: 'مرحلة build — لأنها تُصرّف الاعتماديات', en: 'the build stage — it resolves dependencies' } },
            { id: 'b', text: { ar: 'مرحلة الفحوص الساكنة بعد build — linters ومفحوصات الأنواع تمسك أصناف عيوب كاملة بلا تنفيذ سطر', en: 'the static-checks stage after build — linters and type checkers catch whole defect classes without executing a line' } },
            { id: 'c', text: { ar: 'لا مكان للتحليل الساكن في خط CI — يبقى فحصًا يدويًّا', en: 'static analysis has no place in CI — it stays a manual check' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الفحوص الساكنة رخيصة لأنها لا تشغّل الكود، فتتقدم مباشرة بعد build وقبل الاختبارات — وهنا يصبح ما تعلمته في الفصل التاسع سياسةً لا تنصيحة: بوابة لا يخطها تغيير.',
            en: 'Static checks are cheap because nothing executes, so they sit right after build and before tests — turning chapter 9\u2019s practice into policy: a gate no change can skip.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يطلب CI تفريعًا قصير العمر لا فروع ميزات تعيش أسابيع؟',
            en: 'Why does CI demand short-lived branches instead of feature branches living for weeks?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الفروع الطويلة تستهلك الأسماء الجميلة في المستودع', en: 'Because long branches consume good branch names' } },
            { id: 'b', text: { ar: 'لأن الانحراف بين الفرعين يزيد مع الزمن، والدمج المتأخر الكبير يعيد التكامل الانفجاري الذي يمنعه CI', en: 'Because divergence grows with time, and a big late merge recreates the big-bang integration CI exists to prevent' } },
            { id: 'c', text: { ar: 'لأن الخوادم لا تحمل أكثر من فرع واحد مفتوحًا', en: 'Because servers cannot hold more than one open branch' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'دمج عدة مرات يوميًّا يحمل انحراف ساعات قليلة: نزاعات نادرة وتافهة حين تحدث. والعمل غير المنتهٍ يُخفى خلف علامة ميزة — فيبقى التكامل متصلًا والإصدار قرارًا مستقلًّا.',
            en: 'Merging several times a day carries hours of divergence: conflicts are rare and trivial when they occur. Unfinished work hides behind a feature flag — integration stays continuous while release stays an independent decision.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن PY4E الفصل التاسع: في النموذج قرأنا الحالات بـ commit[stage]. أي تعبير يقرأ الحالة بأمان ويعيد skipped حين تغيب المرحلة عن القاموس؟',
            en: 'From PY4E chapter 9: the model read statuses with commit[stage]. Which expression reads safely, returning skipped when the stage is absent from the dict?',
          },
          options: [
            { id: 'a', text: { ar: "commit(stage, 'skipped') — استدعاء القاموس كدالة", en: "commit(stage, 'skipped') — calling the dict like a function" } },
            { id: 'b', text: { ar: "commit.get(stage, 'skipped')", en: "commit.get(stage, 'skipped')" } },
            { id: 'c', text: { ar: 'commit[stage] or skipped', en: 'commit[stage] or skipped' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'get هي القراءة الآمنة للقاموس: القيمة إن وُجد المفتاح وإلا الافتراضي — بينما [] يرفع KeyError والاستدعاء كدالة يفشل. الحيلة نفسها تخدمك عند مراحل اختيارية في خطوط حقيقية.',
            en: 'dict.get is the safe lookup: the value if the key exists, the default otherwise — [] raises KeyError and calling a dict like a function fails. The same trick serves optional stages in real pipelines.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: '«خطي أحمر لكن تغييري صغير ومستقل — سألتزم فوقه»',
          right: 'لا التزام فوق بناء أحمر أبدًا: أصلح أو تراجع أولًا، ثم انزل بشغلك على أساس أخضر',
          note: {
            ar: 'الأحمر يعني أن ضمان «الشيفرة المشتركة تعمل» سقط عن الجميع — وكل التزام فوقه رهان غير مُتحقق. انضباط CI سلوك اجتماعي قبل أن يكون أداة: من يلتزم فوق الأحمر يكسب دقائق ويكلّف الفريق ساعات.',
            en: 'Red means the machine-checked guarantee that the shared code works has collapsed for everyone — every commit on top is an unverified bet. CI discipline is social before it is technical: committing on red wins minutes and costs the team hours.',
          },
        },
        {
          wrong: 'اختبار يفشل أحيانًا؟ «أعد تشغيله، هذا واحد متقلب»',
          right: 'اعزل الاختبار المتقلب فورًا وعالجه أو احذفه — وجوده عيب في الحزمة نفسها',
          note: {
            ar: 'المتقلب أخطر من الفاشل دائمًا: إنه يعلّم الفريق أن الأحمر أحيانًا لا يعني شيئًا، فتمر الإخفاقات الحقيقية على نفس التهمة. سببه عادة سباقات أو حالة مشتركة أو اعتماد على الترتيب — وكلها تُصلَح، والتجاهل ليس إصلاحًا.',
            en: 'Flaky is worse than always-failing: it teaches the team that red sometimes means nothing, so real failures slip through on the same shrug. The usual causes — races, shared state, order dependence — are fixable; ignoring them is not a fix.',
          },
        },
        {
          wrong: 'خط يعادل ساعة؟ «نتأقلم: نجمع التغييرات ونشغّلها مرة واحدة»',
          right: 'عالج البطء كخلل عملية: هدف نحو عشر دقائق، ادفع الفحوص أسفل الهرم، ووازِ بالتوازي والتخزين المؤقت',
          note: {
            ar: 'البطء يغيّر السلوك قبل أن يغيّر الأرقام: المطورون يكدّسون تغييرات أكبر لتوزيع الانتظار — فتعود عمليات الدمج الكبيرة الخطرة من الباب الخلفي. السرعة ليست رفاهية؛ إنها الشرط الذي يجعل الالتزام الصغير المتكرر ممكنًا أصلًا.',
            en: 'Slowness changes behavior before it changes numbers: developers batch bigger changes to amortize the wait — and the large risky merges walk back in. Speed is not a luxury; it is the condition that makes small frequent commits possible at all.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'SaaS يقلب التسليم: لا شيء يُشحن، والبائع يتحكم بما يعمل في الإنتاج ويلاحظ الاستخدام فعليًّا — والسحابة تبيع compute وstorage وnetwork وsecurity/identity، بمسؤولية أمن مشتركة: المزوّد يؤمّن السحابة وأنت تؤمّن ما بداخلها.', en: 'SaaS inverts delivery: nothing ships; the provider controls production and observes real usage — the cloud sells compute, storage, network and security/identity under a shared responsibility model: the provider secures the cloud, you secure what is in it.' },
        { ar: 'خط CI بوابات بترتيب الكفة: build ثم فحوص ساكنة ثم اختبارات بترتيب الهرم ثم أثر مُرقَّم يُبنى مرة واحدة — والفشل السريع يجعل الحكم يصل عند أول فشل لا عند آخر نجاح.', en: 'A CI pipeline gates in cost order: build, static checks, tests in pyramid order, then a versioned artifact built exactly once — fail-fast means the verdict arrives at the first failure, not the last success.' },
        { ar: 'الانضباط الاجتماعي هو ما يجعل الخط قيمة: الأحمر طارئ الجميع، ولا التزام فوق الأحمر، والتراجع رخيص ومشروع، والمتقلب يُعزل فورًا — والخط البطيء خلل عملية يعيد التغييرات الكبيرة.', en: 'The social contract makes the pipeline matter: red is everyone\u2019s emergency, never commit on red, revert is cheap and legitimate, flaky tests get quarantined immediately — and a slow pipeline is a process defect that re-creates big batches.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وحرّك حالة FAIL عبر المراحل الأربع ولاحظ كيف يتقصّر السجل كلما هبط الفشل مبكرًا. اسأل نفسك: في أول مشروع تسليمه فعليًّا — ما أصغر خط CI تشعر أنك قادر على الدفاع عنه (مرحلتان؟ ثلاث؟)، وما أول ما سيكسره زملاؤك إن لم يُكتب انضباط الأحمر في وثيقة الفريق؟',
        en: 'Open the sandbox and slide the FAIL across the four stages, watching the log shrink as failure lands earlier. Ask yourself: in your first real delivery — what is the smallest CI pipeline you could defend (two stages? three?), and what would teammates break first if broken-build discipline were not written down?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch14.s1', pages: 'ص375-379 / pp.375-379' },
        { book: 'SWE', section: 'swe.ch14.s2', pages: 'ص379-383 / pp.379-383' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch14.s1', pages: 'ص375-379 / pp.375-379' },
    { book: 'SWE', section: 'swe.ch14.s2', pages: 'ص379-383 / pp.379-383' },
  ],
} satisfies Lesson;

export default lesson;
