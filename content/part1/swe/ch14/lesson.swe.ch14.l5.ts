import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch14.l5 — "Chapter 14 Review and Project: a Mini Delivery Pipeline
 * مراجعة الفصل 14 ومشروع: خط تسليم مصغّر"
 * Aligned with SWE ch14 s8 (14.8 Conclusion, pp.400-402) — the chapter's own
 * one-sentence compression: make change small, make its path to users
 * automatic and progressively exposed, and watch the outcomes.
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * REVIEW-PROJECT PATTERN: the lesson re-composes the chapter's fixed models
 * into one pipeline — l1's fail-fast stage walk (stages list + status dicts),
 * l2's canary judged from error samples over crc32 stable buckets (user maya
 * always lands in the slice, bucket 4), and l4's DORA calculators over the
 * run history — printing verdict lines like 'stages passed: 2 / decision:
 * rollback'. Deterministic only.
 */

const lesson = {
  id: 'swe.ch14.l5',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 14,
  title: { ar: 'مراجعة الفصل 14 ومشروع: خط تسليم مصغّر', en: 'Chapter 14 Review and Project: a Mini Delivery Pipeline' },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch14.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أربعة دروس بنوا القطع: خطٌّ يوقف التزامًا مكسورًا عند أول فشل، وكناري يقيس قبل التعميم، وصورة تُبنى مرة، ومقاييس DORA تُقرأ من سجل. درس اليوم لا يضيف قطعة — بل يركّبها في آلة واحدة ويختم بجملة الكتاب التي لخّصت الفصل: اجعل التغيير صغيرًا، واجعل طريقه إلى المستخدمين آليًّا ومعرَّضًا تدريجيًّا، وراقب النتائج. المشروع خطُّ تسليم مصغّر يستقبل أحداث webhook ثابتة: يمشي المراحل بالترتيب ويتوقف عند أول فشل بسبب مكتوب، ويحكم على الكناري من عينات أخطاء الشريحة لا من الشعور، ثم يحسب خلاصة DORA من تاريخ التشغيل ويطبع حكمًا صادقًا مثل stages passed: 2 / decision: rollback. وكتلة التصحيح ستذكّرك أن خطًّا يكمل بعد الفشل أخطر من خط أحمر: لأنه يرتقي وهو يبتسم.',
        en: 'Four lessons built the pieces: a pipeline that stops a broken commit at its first failure, a canary that measures before widening, an image built once, and DORA metrics read from a log. Today adds no piece — it assembles them into one machine and closes with the book\u2019s one-sentence compression: make change small, make its path to users automatic and progressively exposed, and watch the outcomes. The project is a mini delivery pipeline fed fixed webhook events: it walks the stages in order and stops at the first failure with a written reason, judges the canary from the slice\u2019s error samples, not a feeling, then computes a DORA summary from the run history and prints an honest verdict like stages passed: 2 / decision: rollback. And the debug block reminds you that a pipeline continuing past failure is worse than a red one — it promotes while smiling.',
      },
    },
    {
      kind: 'predict',
      code: "from zlib import crc32\n\nb = crc32('maya'.encode()) % 100\nprint('bucket: %d' % b)\nprint('slice: %s' % ('canary' if b < 10 else 'stable'))",
      question: {
        ar: 'درس الكناري عاد في سطرين: المستخدم maya وبصمة crc32. أي شريحة سترى النسخة الجديدة أولًا، ولماذا يعيد crc32 الحدس نفسه في كل زيارة دون خدمة جلسات؟',
        en: 'The canary lesson returns in two lines: user maya and a crc32 fingerprint. Which slice sees the new version first, and why does crc32 produce the same verdict on every visit with no session service?',
      },
      reveal: {
        ar: 'الطباعة: bucket: 4 ثم slice: canary. بصمة crc32 دالة حتمية للاسم: maya يسقط دائمًا في الدلو 4 وهو دون 10، فتأتي إلى الكناري في كل زيارة — نفس الآلة التي وزعت ستة مستخدمين في الدرس الثاني. والمشروع اليوم يقف على هذه الشريحة بالضبط: عينات أخطائها هي ما يحكم مرحلة canary في الخط ويقرر promote أو rollback.',
        en: 'It prints bucket: 4 then slice: canary. A crc32 fingerprint is a deterministic function of the name: maya always lands in bucket 4, below 10, so she reaches the canary on every visit — the same machine that distributed six users in lesson two. Today\u2019s project stands exactly on that slice: its error samples are what judge the pipeline\u2019s canary stage and decide promote or rollback.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الفصل في مرآة: البوابات والتعرض والوصول', en: 'The chapter in a mirror: gates, exposure, and reach' },
      chunks: [
        {
          ar: 'الفصل قطعٌ ثلاث تلتقي اليوم. القطعة الأولى بوابة الدخول: خط CI يرتب الفحوص بترتيب الكفة — build ثم الفحوص الساكنة ثم الاختبارات بهرمها ثم أثر يُبنى مرة واحدة — ويحكم عند أول فشل؛ وانضباطه اجتماعي قبل أن يكون أداة: لا التزام فوق الأحمر، والتراجع رخيص ومشروع، والمتقلب يُعزل فورًا. القطعة الثانية التعرض: التسليم المستمر يجعل كل أخضر أثرًا جاهزًا والنشر المستمر يدفعه آليًّا؛ والكناري يوزع المستخدمين بدلاءً ثابتة — crc32(user_id.encode()) % 100 وmaya دائمًا في الدلو 4 — فيمتص العيب في شريحة صغيرة قبل التعميم، وعلامات الميزة تفصل النشر عن الإصدار، والتراجع هو الانعكاس الافتراضي لأنه لا يشحن كودًا غير مُتحقق. وحادثتا Knight Capital وCrowdStrike يسجلان طرفَي الخطأ: بلا أتمتة، وأتمتة بلا تعريض تدريجي.',
          en: 'The chapter is three pieces meeting today. Piece one, the intake gate: a CI pipeline orders checks by cost — build, static checks, tests in pyramid order, then an artifact built exactly once — and judges at the first failure; its discipline is social before technical: never commit on red, revert is cheap and legitimate, flaky tests get quarantined immediately. Piece two, exposure: continuous delivery makes every green change a deployable artifact and continuous deployment pushes it automatically; the canary assigns users stable buckets — crc32(user_id.encode()) % 100 with maya always in bucket 4 — absorbing a defect in a small slice before widening, feature flags separate deploy from release, and rollback is the default reflex because it ships no unverified code. Knight Capital and CrowdStrike record the two failure extremes: no automation, and automation without progressive exposure.',
        },
        {
          ar: 'القطعة الثالثة الوصول والقياس: صورة تُبنى مرة فتجري حرفيًّا في الاختبار والإنتاج، وطبقات مخزَّنة تجعل إعادة البناء رخيصة، وحالة تعيش على أقراص خارج دورة حياة الحاويات، واسم يتحول عنوانًا عبر ذاكرة تنقضي مع TTL، وTLS يوثّق الخادم، وحافة تمتص الهجمات. ثم السؤال الذي يجعل كل هذا مرئيًّا: عائلات الماسحات — SAST يقرأ الشيفرة وDAST يهاجم الواجب وSCA يفحص الاعتماديات وقارض الأسرار يمنع التسريب — يجري كل منها عند أقدم نقطة تعطي جوابًا صحيحًا. ومفاتيح DORA الخمسة تُقرأ من سجل منضبط: زمن القيادة والتكرار وزمن التعافي في مجموعة الإنتاجية، مقابل معدل الفشل وإعادة العمل في عدم الاستقرار — ومحاولة تحسين مجموعة وحدها تستدعي شريكتها لتكشفك.',
          en: 'Piece three, reach and measurement: an image built once runs literally in test and production, cached layers keep rebuilds cheap, state lives on disks outliving containers, a name becomes an address through a TTL-scoped cache, TLS authenticates the server, and the edge absorbs attacks. Then the question that makes it all visible: the scanner families — SAST reads source, DAST attacks the running app, SCA checks dependencies, secrets scanning blocks leaks — each runs at the earliest point it can give a correct answer. And the five DORA keys are read from a disciplined log: lead time, frequency, and recovery time in the throughput group, against fail rate and rework rate in instability — trying to improve one group alone summons its partner to expose you.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تشريح المشروع: خط تسليم مصغّر', en: 'The project\u2019s anatomy: a mini delivery pipeline' },
      chunks: [
        {
          ar: 'المشروع يجمع القطع في دالة واحدة. الأحداث ثابتة: لكل تشغيل run حالة build وtest قادمة من الويب-هوك، ومرحلة canary ليست نصًّا مُعطى بل تُقيَّم حيًّا من عينات أخطاء الشريحة — mean <= ERROR_THRESHOLD يعني ok وإلا FAIL، وهي مقارنة درس الكناري نفسها. الدالة تمشي المراحل بترتيب الكفة وتطبع سجل التشغيل سطرًا سطرًا؛ وعند أول غير-ok تطبع سبب التوقف stopped: <stage> وتقطع فورًا — لا مرحلة لاحقة تُهدر ثانية. عدّاد passed يزيد للمراحل الناجحة فقط، فيصير الحكم مقارنة بسيطة: promote فقط إذا اجتازت المراحل كلها، وغير ذلك rollback. السطر الختامي stages passed: 2 / decision: rollback هو عقد الدالة: عددٌ وخُلاصة في سطر واحد قابل للتدقيق.',
          en: 'The project composes the pieces into one function. The events are fixed: each run carries build and test statuses from the webhook, and the canary stage is not a given string — it is evaluated live from the slice\u2019s error samples: mean <= ERROR_THRESHOLD means ok, otherwise FAIL, the canary lesson\u2019s own comparison. The function walks the stages in cost order printing the run log line by line; at the first not-ok it prints the stop reason stopped: <stage> and cuts immediately — no later stage wastes a second. The passed counter grows only for stages that succeeded, so the verdict is a simple comparison: promote only if every stage passed, otherwise rollback. The closing line stages passed: 2 / decision: rollback is the function\u2019s contract: a count and a summary in one auditable line.',
        },
        {
          ar: 'ثم يُقرأ الأثر من سجل التشغيل كما أسّست حاسبات درس DORA: كل تغيير في التاريخ يحمل تاريخَي commit وdeploy وفرع failed؛ الطرح والتحويل إلى أيام يعطي زمن القيادة لكل تغيير ويُطبع متوسطه lead time: %.1f days؛ وعدّ الرايات الحمراء يعطي deploys: %d failed: %d وقسمتها على النشرات كلها CFR: %.1f. لاحظ أن الخط نفسه يغذي المقاييس: كل قرار rollback صادق يعني راية failed في السجل غدًا — فخطٌّ يجمّل حكمه يسمّم مقاييسه. ولهذا الحكم الصادق أهم من الحكم السعيد: CFR مرتفع على خط أمين إنارة تحذير؛ وحكم أخضر مزيف على خط مكسور يخفي الكارثة حتى تصلك في الإنتاج.',
          en: 'Then the artifact is read from the run history the way lesson DORA\u2019s calculators established: every change in the log carries commit and deploy datetimes plus a failed flag; subtracting and converting to days gives each change\u2019s lead time with the mean printed as lead time: %.1f days; counting red flags gives deploys: %d failed: %d and, divided by all deployments, CFR: %.1f. Notice the pipeline feeds the metrics: every honest rollback decision means a failed flag in tomorrow\u2019s log — a pipeline that cosmetizes its verdict poisons its metrics. That is why the honest verdict matters more than the happy one: a high CFR on an honest pipeline is a warning light; a fake green on a broken pipeline hides the catastrophe until it reaches production.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الآلة كاملة: من webhook إلى قرار مُقاس', en: 'The whole machine: from webhook to a measured decision' },
      code: "from datetime import datetime\n\nstages = ['build', 'canary']\nruns = {'r1': {'build': 'ok'}, 'r2': {'build': 'ok'}}\ncanary_errors = {'r1': [1, 2, 1, 2, 1], 'r2': [4, 6, 5]}\nERROR_THRESHOLD = 4.0\nhistory = [\n    {'commit': datetime(2025, 3, 10, 9, 0), 'deploy': datetime(2025, 3, 10, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 11, 9, 0), 'deploy': datetime(2025, 3, 12, 21, 0), 'failed': True},\n]\n\ndef deliver(run_id):\n    run = runs[run_id]\n    passed = 0\n    for stage in stages:\n        if stage == 'canary':\n            samples = canary_errors[run_id]\n            status = 'ok' if sum(samples) / len(samples) <= ERROR_THRESHOLD else 'FAIL'\n        else:\n            status = run.get(stage, 'skipped')\n        print('%s: %s' % (stage, status))\n        if status != 'ok':\n            print('stopped: %s' % stage)\n            break\n        passed += 1\n    decision = 'promote' if passed == len(stages) else 'rollback'\n    print('stages passed: %d / decision: %s' % (passed, decision))\n\ndeliver('r1')\ndeliver('r2')\n\nleads = [(c['deploy'] - c['commit']).total_seconds() / 3600 / 24 for c in history]\nfailed = sum(1 for c in history if c['failed'])\nprint('lead time: %.1f days' % (sum(leads) / len(leads)))\nprint('deploys: %d failed: %d' % (len(history), failed))\nprint('CFR: %.1f' % (failed / len(history)))",
      explanation: {
        ar: 'أربعة أشياء تلاحظها: قائمة stages بترتيب الكفة ومرحلة canary خاصة — حالتها لا تُقرأ من الويب-هوك بل تُحسب من عينات الشريحة بمقارنة l2 (متوسط [1, 2, 1, 2, 1] هو 1.4 فيمرّ، ومتوسط [4, 6, 5] هو 5.0 فوق العتبة 4.0 فيفشل)؛ والحارس بعد الطباعة: عند أول غير-ok يُطبع stopped: <stage> ويقطع break — لذلك رأى r2 stopped: canary لا أي مرحلة لاحقة؛ والحكم مشتق من العدّ: passed == len(stages) وحده يمنح promote — r1 رقّت وسطرها stages passed: 2 / decision: promote، وr2 تتراجع بـ stages passed: 1 / decision: rollback؛ ثم خلاصة DORA من التاريخ: زمنا قيادة 0.5 و1.5 يومًا بمتوسط 1.0، وراية فشل واحدة من نشرتين فCFR: 0.5. لاحظ الاتساق: r2 التي تراجعت هي راية failed في السجل — الخط والمقاييس يحكيان القصة نفسها.',
        en: 'Four things to notice: the stages list in cost order with a special canary stage — its status is not read from the webhook but computed from the slice\u2019s samples with l2\u2019s comparison (the mean of [1, 2, 1, 2, 1] is 1.4 so it passes; the mean of [4, 6, 5] is 5.0, above the 4.0 threshold, so it fails); the guard sits after the print: at the first not-ok, stopped: <stage> prints and break cuts — which is why r2 saw stopped: canary and nothing after; the verdict derives from the count: only passed == len(stages) earns promote — r1 promoted with stages passed: 2 / decision: promote, r2 rolls back with stages passed: 1 / decision: rollback; then the DORA summary over history: lead times of 0.5 and 1.5 days averaging 1.0, one failed flag out of two deploys so CFR: 0.5. Notice the consistency: the run that rolled back is the failed flag in the log — pipeline and metrics tell one story.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.mini-pipeline',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: عمّم الآلة إلى ثلاث مراحل وثلاثة تشغيلات وسجل DORA. نفّذ deliver(run_id) التي تمشي stages بالترتيب، وتقرأ build وtest من runs بـ .get(stage, \'skipped\')، وتقيّم canary من عينات canary_errors[run_id] (ok إذا كان المتوسط <= ERROR_THRESHOLD وإلا FAIL)، وتطبع لكل مرحلة stage: status؛ وعند أول غير-ok تطبع stopped: <stage> وتتوقف — لا شيء لاحق — ولا تزيد passed إلا للمراحل الناجحة؛ ثم تطبع stages passed: %d / decision: %s وتعيد الثنائي (passed, decision) حيث decision هي promote إذا اجتازت المراحل كلها وإلا rollback. ونفّذ dora_summary(history) بطريقة حاسبات l4: اطبع lead time: %.1f days ثم deploys: %d failed: %d ثم CFR: %.1f. أبقِ البيانات والاستدعاءات كما هي. المتوقع: r1 تُرقَّى، وr2 تتحمر عند test، وr3 سطرها stages passed: 2 / decision: rollback، ثم lead time: 1.0 days وdeploys: 3 failed: 1 وCFR: 0.3.',
        en: 'The project: generalize the machine to three stages, three runs, and a DORA log. Implement deliver(run_id) that walks stages in order, reads build and test from runs via .get(stage, \u2018skipped\u2019), evaluates canary from canary_errors[run_id] (ok when the mean <= ERROR_THRESHOLD, else FAIL), and prints one line per stage in the form stage: status; at the first not-ok print stopped: <stage> and stop — nothing later — never counting passed for a failed stage; then print stages passed: %d / decision: %s and return the pair (passed, decision) where decision is promote only if every stage passed, else rollback. Also implement dora_summary(history) the way l4\u2019s calculators did: print lead time: %.1f days, then deploys: %d failed: %d, then CFR: %.1f. Keep the data and calls as is. Expected: r1 promotes, r2 goes red at test, r3\u2019s line reads stages passed: 2 / decision: rollback, then lead time: 1.0 days, deploys: 3 failed: 1, CFR: 0.3.',
      },
      starterCode: "from datetime import datetime\n\nstages = ['build', 'test', 'canary']\n\nruns = {\n    'r1': {'build': 'ok', 'test': 'ok'},\n    'r2': {'build': 'ok', 'test': 'FAIL'},\n    'r3': {'build': 'ok', 'test': 'ok'},\n}\n\ncanary_errors = {'r1': [1, 2, 1, 2, 1], 'r2': [4, 6, 5], 'r3': [4, 6, 5]}\nERROR_THRESHOLD = 4.0\n\nhistory = [\n    {'commit': datetime(2025, 3, 10, 9, 0), 'deploy': datetime(2025, 3, 10, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 11, 9, 0), 'deploy': datetime(2025, 3, 13, 9, 0), 'failed': True},\n    {'commit': datetime(2025, 3, 12, 9, 0), 'deploy': datetime(2025, 3, 12, 21, 0), 'failed': False},\n]\n\ndef deliver(run_id):\n    # امشِ المراحل؛ canary تُقيَّم من العينات: ok إذا mean <= ERROR_THRESHOLD وإلا FAIL\n    # walk the stages; canary is judged from samples: ok when mean <= ERROR_THRESHOLD else FAIL\n    # عند أول غير-ok: اطبع stopped: <stage> وتوقف، ولا تعدّ المرحلة الفاشلة\n    # at the first not-ok: print stopped: <stage> and stop; never count the failed stage\n    # ثم اطبع سطر stages passed / decision وأعد (passed, decision)\n    # then print the stages passed / decision line and return (passed, decision)\n    pass\n\ndef dora_summary(history):\n    # زمن القيادة بالأيام (المتوسط) ثم deploys/failed ثم CFR — طريقة حاسبات l4\n    # mean lead time in days, then deploys/failed, then CFR — l4's calculators\n    pass\n\nfor run_id in ['r1', 'r2', 'r3']:\n    deliver(run_id)\n\ndora_summary(history)",
      solution: "from datetime import datetime\n\nstages = ['build', 'test', 'canary']\n\nruns = {\n    'r1': {'build': 'ok', 'test': 'ok'},\n    'r2': {'build': 'ok', 'test': 'FAIL'},\n    'r3': {'build': 'ok', 'test': 'ok'},\n}\n\ncanary_errors = {'r1': [1, 2, 1, 2, 1], 'r2': [4, 6, 5], 'r3': [4, 6, 5]}\nERROR_THRESHOLD = 4.0\n\nhistory = [\n    {'commit': datetime(2025, 3, 10, 9, 0), 'deploy': datetime(2025, 3, 10, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 11, 9, 0), 'deploy': datetime(2025, 3, 13, 9, 0), 'failed': True},\n    {'commit': datetime(2025, 3, 12, 9, 0), 'deploy': datetime(2025, 3, 12, 21, 0), 'failed': False},\n]\n\ndef deliver(run_id):\n    run = runs[run_id]\n    passed = 0\n    for stage in stages:\n        if stage == 'canary':\n            samples = canary_errors[run_id]\n            mean = sum(samples) / len(samples)\n            status = 'ok' if mean <= ERROR_THRESHOLD else 'FAIL'\n        else:\n            status = run.get(stage, 'skipped')\n        print('%s: %s' % (stage, status))\n        if status != 'ok':\n            print('stopped: %s' % stage)\n            break\n        passed += 1\n    decision = 'promote' if passed == len(stages) else 'rollback'\n    print('stages passed: %d / decision: %s' % (passed, decision))\n    return (passed, decision)\n\ndef dora_summary(history):\n    leads = []\n    for c in history:\n        leads.append((c['deploy'] - c['commit']).total_seconds() / 3600 / 24)\n    failed = 0\n    for c in history:\n        if c['failed']:\n            failed += 1\n    print('lead time: %.1f days' % (sum(leads) / len(leads)))\n    print('deploys: %d failed: %d' % (len(history), failed))\n    print('CFR: %.1f' % (failed / len(history)))\n\nfor run_id in ['r1', 'r2', 'r3']:\n    deliver(run_id)\n\ndora_summary(history)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الكناري المريض يعطي سطر الحكم المطلوب', en: 'The sick canary yields the required verdict line' },
          code: "assert 'stages passed: 2 / decision: rollback' in __learner_output__, 'expected: stages passed: 2 / decision: rollback | actual: %r' % __learner_output__",
          expected: 'stages passed: 2 / decision: rollback',
        },
        {
          id: 't2',
          name: { ar: 'الترقية الكاملة وسبب التوقف معًا', en: 'The full promotion and the stop reason together' },
          code: "assert 'stages passed: 3 / decision: promote' in __learner_output__ and 'stopped: test' in __learner_output__, 'expected: stages passed: 3 / decision: promote and stopped: test | actual: %r' % __learner_output__",
          expected: 'stages passed: 3 / decision: promote and stopped: test',
        },
        {
          id: 't3',
          name: { ar: 'فشل سريع: التوقف يلي الفشل مباشرة', en: 'fail-fast: the stop immediately follows the failure' },
          code: "assert 'test: FAIL\\nstopped: test' in __learner_output__, 'expected: stopped: test directly after test: FAIL (no later stage ran) | actual: %r' % __learner_output__",
          expected: 'stopped: test directly after test: FAIL (no later stage ran)',
        },
        {
          id: 't4',
          name: { ar: 'خلاصة DORA والثنائي المُعاد', en: 'The DORA summary and the returned pair' },
          code: "assert 'lead time: 1.0 days' in __learner_output__ and 'deploys: 3 failed: 1' in __learner_output__ and 'CFR: 0.3' in __learner_output__ and deliver('r2') == (1, 'rollback'), 'expected: lead time: 1.0 days, deploys: 3 failed: 1, CFR: 0.3, deliver(r2) == (1, rollback) | actual: %r' % ((deliver('r2'),),)",
          expected: 'lead time: 1.0 days, deploys: 3 failed: 1, CFR: 0.3, deliver(r2) == (1, rollback)',
        },
      ],
      hints: [
        { ar: 'الهيكل هو المثال العملي مع مرحلة إضافية في المنتصف: لكل stage في stages اقرأ الحالة، لكن canary حالة تُحسب: samples = canary_errors[run_id] وmean = sum(samples) / len(samples) ثم status = \'ok\' if mean <= ERROR_THRESHOLD else \'FAIL\'.', en: "The skeleton is the worked example plus one middle stage: for each stage in stages read the status, but canary\u2019s status is computed: samples = canary_errors[run_id], mean = sum(samples) / len(samples), then status = 'ok' if mean <= ERROR_THRESHOLD else 'FAIL'." },
        { ar: 'الحارس بين الطباعة والعدّ: عند status != \'ok\' اطبع \'stopped: %s\' % stage واقطع بـ break — وما بعد break لا يُنفَّذ؛ وpassed += 1 لا يُكتب إلا بعد الحارس فلا يُحصى إلا الناجح.', en: "The guard sits between the print and the count: when status != 'ok' print 'stopped: %s' % stage and break — nothing after break executes; and passed += 1 is written only after the guard so only successes count." },
        { ar: 'الحكم والخلاصة: decision = \'promote\' if passed == len(stages) else \'rollback\' ثم اطبع \'stages passed: %d / decision: %s\' % (passed, decision) وأعد الثنائي؛ وفي dora_summary اجمع leads بـ (c[\'deploy\'] - c[\'commit\']).total_seconds() / 3600 / 24 وعدّ failed ثم اطبع الأسطر الثلاثة.', en: "Verdict and summary: decision = 'promote' if passed == len(stages) else 'rollback', print 'stages passed: %d / decision: %s' % (passed, decision), return the pair; in dora_summary collect leads via (c['deploy'] - c['commit']).total_seconds() / 3600 / 24, count failed, and print the three lines." },
        { ar: 'الحل الكامل:\ndef deliver(run_id):\n    run = runs[run_id]\n    passed = 0\n    for stage in stages:\n        if stage == \'canary\':\n            samples = canary_errors[run_id]\n            mean = sum(samples) / len(samples)\n            status = \'ok\' if mean <= ERROR_THRESHOLD else \'FAIL\'\n        else:\n            status = run.get(stage, \'skipped\')\n        print(\'%s: %s\' % (stage, status))\n        if status != \'ok\':\n            print(\'stopped: %s\' % stage)\n            break\n        passed += 1\n    decision = \'promote\' if passed == len(stages) else \'rollback\'\n    print(\'stages passed: %d / decision: %s\' % (passed, decision))\n    return (passed, decision)\n\ndef dora_summary(history):\n    leads = [(c[\'deploy\'] - c[\'commit\']).total_seconds() / 3600 / 24 for c in history]\n    failed = sum(1 for c in history if c[\'failed\'])\n    print(\'lead time: %.1f days\' % (sum(leads) / len(leads)))\n    print(\'deploys: %d failed: %d\' % (len(history), failed))\n    print(\'CFR: %.1f\' % (failed / len(history)))', en: "Full solution:\ndef deliver(run_id):\n    run = runs[run_id]\n    passed = 0\n    for stage in stages:\n        if stage == 'canary':\n            samples = canary_errors[run_id]\n            mean = sum(samples) / len(samples)\n            status = 'ok' if mean <= ERROR_THRESHOLD else 'FAIL'\n        else:\n            status = run.get(stage, 'skipped')\n        print('%s: %s' % (stage, status))\n        if status != 'ok':\n            print('stopped: %s' % stage)\n            break\n        passed += 1\n    decision = 'promote' if passed == len(stages) else 'rollback'\n    print('stages passed: %d / decision: %s' % (passed, decision))\n    return (passed, decision)\n\ndef dora_summary(history):\n    leads = [(c['deploy'] - c['commit']).total_seconds() / 3600 / 24 for c in history]\n    failed = sum(1 for c in history if c['failed'])\n    print('lead time: %.1f days' % (sum(leads) / len(leads)))\n    print('deploys: %d failed: %d' % (len(history), failed))\n    print('CFR: %.1f' % (failed / len(history)))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-verdict',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. هذا قلب قرار المشروع مصغَّرًا: عيّن أي قيمة يقف عندها العدّ.',
        en: 'Read the code and predict its exact output — one line per print — without running it. This is the project\u2019s decision core in miniature: pinpoint where the count stops.',
      },
      code: "statuses = ['ok', 'ok', 'FAIL']\npassed = 0\nfor s in statuses:\n    if s != 'ok':\n        break\n    passed += 1\nprint('passed: %d of %d' % (passed, len(statuses)))\nprint('decision: %s' % ('promote' if passed == len(statuses) else 'rollback'))",
      solution: 'passed: 2 of 3\ndecision: rollback',
      answer: 'passed: 2 of 3\ndecision: rollback',
      hints: [
        { ar: 'الحلقة تمشي القائمة بالترتيب: أول عنصرين ok فيمران الفحص ويزيد passed مرتين.', en: 'The loop walks the list in order: the first two elements are ok, so the guard passes twice and passed grows to 2.' },
        { ar: 'العنصر الثالث FAIL يخلف الشرط فيُنفَّذ break فورًا — passed يبقى 2 ولا يُعدّ الفاشل.', en: 'The third element FAIL fails the guard, so break executes immediately — passed stays 2 and the failed stage is never counted.' },
        { ar: 'الطباعة الأولى: passed == 2 وlen(statuses) == 3 فيصير passed: 2 of 3؛ والثانية: 2 != 3 فالمقارنة تعطي rollback.', en: 'The first print: passed == 2 and len(statuses) == 3, giving passed: 2 of 3; the second: 2 != 3, so the comparison yields rollback.' },
        { ar: 'الخرج:\npassed: 2 of 3\ndecision: rollback', en: 'The output:\npassed: 2 of 3\ndecision: rollback' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-rollforward',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'الكناري رصد انحدارًا فتراجعت عن النسخة. يقترح زميل: «وفّر علينا التراجع — انشر إصلاحًا فوقها فورًا، roll-forward». في أي وضع يكون التقدم للأمام هو الخيار الوحيد المتاح أصلًا؟',
        en: 'The canary caught a regression so you rolled back. A teammate suggests: \u201cspare us the rollback — ship a fix on top right away, roll-forward\u201d. In which situation is roll-forward the only option available at all?',
      },
      options: [
        { id: 'a', text: { ar: 'عندما يريد الفريق إظهار سرعة تعافٍ نخبوِية في لوحة DORA', en: 'When the team wants to show elite recovery time on the DORA dashboard' } },
        { id: 'b', text: { ar: 'عندما يكون التغيير لا رجعة فيه — ترحيل بيانات أعاد كتابتها: لا إصدار سابق يستطيع قراءة ما كتبه الجديد، فيصبح سرعة التقدم للأمام خاصية أمان', en: 'When the change is irreversible — a data migration that rewrote it: no previous version can read what the new one wrote, so roll-forward speed becomes a safety property' } },
        { id: 'c', text: { ar: 'عندما يكون الفشل في مرحلة build فقط — فلا شيء نُشر أصلًا', en: 'When the failure is only in the build stage — nothing was deployed anyway' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'التراجع افتراضي لأنه أسرع ولا يشحن كودًا غير مُتحقق — لكن افتراضه مشروط بوجود إصدار سابق يستطيع العمل مع الحالة الحالية.', en: 'Rollback is the default because it is faster and ships no unverified code — but the default is conditional on a previous version existing that can work with the current state.' },
        { ar: 'انحراف الإصدارات قد يجعل الكود القديم عاجزًا عن قراءة ما كتبه الجديد — وهنا ينهار شرط التراجع نفسه لا سرعته فقط.', en: 'Version skew can leave old code unable to read what new code wrote — there the precondition of rollback itself collapses, not merely its speed.' },
        { ar: 'وبعض التغييرات لا إصدار سابق لها أصلًا يصلح: الترحيل الذي أعاد كتابة البيانات لا رجعة فيه — فيصير التقدم للأمام سريعًا هو خط الأمان.', en: 'And some changes have no usable previous version at all: a migration that rewrote the data is irreversible — so fast roll-forward becomes the safety line.' },
        { ar: 'الجواب: b — في التغييرات اللا رجعة فيها يكون roll-forward هو الخيار الوحيد، ولهذا يُتدرَّب وسرعته تُقاس.', en: 'Answer: b — for irreversible changes roll-forward is the only option, which is why it is rehearsed and its speed measured.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-leadtime',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'في مشروع اليوم: سجل التاريخ فيه أزمنة قيادة 0.5 و2.0 و0.5 يومًا. أضفت نشرًا رابعًا التزم صباحًا ونُشر بعد يومين تمامًا (failed: False). كم يصير متوسط زمن القيادة بالأيام؟ (رقم فقط)',
        en: 'In today\u2019s project the history log holds lead times of 0.5, 2.0, and 0.5 days. You add a fourth deployment committed in the morning and deployed exactly two days later (failed: False). What is the new mean lead time in days? (number only)',
      },
      answer: '1.25',
      solution: '1.25',
      tolerance: 0,
      hints: [
        { ar: 'النشر الرابع زمن قيادته هو 2.0 يومًا — أضفه إلى 0.5 + 2.0 + 0.5.', en: 'The fourth deployment\u2019s lead time is 2.0 days — add it to 0.5 + 2.0 + 0.5.' },
        { ar: 'المجموع 5.0 أيام.', en: 'The sum is 5.0 days.' },
        { ar: 'اقسم على أربعة لا على ثلاثة — المتوسط على النشرات الأربعة كلها: 5.0 / 4.', en: 'Divide by four, not three — the mean over all four deployments: 5.0 / 4.' },
        { ar: 'الجواب: 1.25', en: 'Answer: 1.25' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "from datetime import datetime\n\nstages = ['build', 'test', 'canary']\nruns = {\n    'r1': {'build': 'ok', 'test': 'ok'},\n    'r2': {'build': 'ok', 'test': 'FAIL'},\n    'r3': {'build': 'ok', 'test': 'ok'},\n}\ncanary_errors = {'r1': [1, 2, 1, 2, 1], 'r2': [4, 6, 5], 'r3': [4, 6, 5]}\nERROR_THRESHOLD = 4.0\nhistory = [\n    {'commit': datetime(2025, 3, 10, 9, 0), 'deploy': datetime(2025, 3, 10, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 11, 9, 0), 'deploy': datetime(2025, 3, 13, 9, 0), 'failed': True},\n    {'commit': datetime(2025, 3, 12, 9, 0), 'deploy': datetime(2025, 3, 12, 21, 0), 'failed': False},\n]\n\ndef deliver(run_id):\n    run = runs[run_id]\n    passed = 0\n    for stage in stages:\n        if stage == 'canary':\n            samples = canary_errors[run_id]\n            status = 'ok' if sum(samples) / len(samples) <= ERROR_THRESHOLD else 'FAIL'\n        else:\n            status = run.get(stage, 'skipped')\n        print('%s: %s' % (stage, status))\n        if status != 'ok':\n            print('stopped: %s' % stage)\n            break\n        passed += 1\n    decision = 'promote' if passed == len(stages) else 'rollback'\n    print('stages passed: %d / decision: %s' % (passed, decision))\n\ndef dora_summary(history):\n    leads = [(c['deploy'] - c['commit']).total_seconds() / 3600 / 24 for c in history]\n    failed = sum(1 for c in history if c['failed'])\n    print('lead time: %.1f days' % (sum(leads) / len(leads)))\n    print('deploys: %d failed: %d' % (len(history), failed))\n    print('CFR: %.1f' % (failed / len(history)))\n\nfor run_id in ['r1', 'r2', 'r3']:\n    deliver(run_id)\ndora_summary(history)\n\n# جرّب: اجعل عينات r1 مريضة [4, 6, 5] — canary يقف حاجزًا عند آخر مرحلة: stopped: canary والقرار rollback\n# try: make r1's samples sick [4, 6, 5] — the canary gate trips at the last stage: stopped: canary, decision rollback\n# جرّب: ارفع ERROR_THRESHOLD إلى 6.0 — فجأة الكناري المريض يُرقَّى: العتبة سياسة مكتوبة تُراجَع لا حقيقة سماوية\n# try: raise ERROR_THRESHOLD to 6.0 — suddenly the sick canary promotes: the threshold is written, reviewable policy, not heaven's truth\n# جرّب: علّم نشرتَي history معًا failed: True — CFR يقفز إلى 0.7 ويتهم خطك لا زملاءك\n# try: mark two history deploys failed: True — CFR jumps to 0.7 and indicts your pipeline, not your teammates",
      prompt: {
        ar: 'الملعب هو مشروعك كاملًا: اجعل الكناري المريض يحرس آخر مرحلة وشاهد الحكم ينقلب عند العتبة، وحرك العتبة نفسها لتعرف أنها سياسة تُكتب لا قانون طبيعي، وقلّب رايات failed في التاريخ لترى CFR يتبع صدق خطك. اسأل نفسك: في أول خط تسليم حقيقي تبنيه — أي مرحلتين تكتبهما أولًا، وما القيمة التي تجعل promote مقيَّدًا بها، ومن يملك حق تعديلها؟ لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is your whole project: let a sick canary guard the last stage and watch the verdict flip at the threshold, move the threshold itself to see it is written policy not natural law, and flip failed flags in the history to watch CFR follow your pipeline\u2019s honesty. Ask yourself: in the first real delivery pipeline you build — which two stages would you write first, what value would gate promote, and who owns the right to change it? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'debug',
      id: 'ex5.debug-gateless',
      required: true,
      brokenCode: "stages = ['build', 'test', 'canary']\nruns = {\n    'r1': {'build': 'ok', 'test': 'ok'},\n    'r2': {'build': 'ok', 'test': 'FAIL'},\n}\ncanary_errors = {'r1': [1, 2, 1, 2, 1], 'r2': [1, 1, 1]}\nERROR_THRESHOLD = 4.0\n\ndef deliver(run_id):\n    run = runs[run_id]\n    passed = 0\n    for stage in stages:\n        if stage == 'canary':\n            samples = canary_errors[run_id]\n            status = 'ok' if sum(samples) / len(samples) <= ERROR_THRESHOLD else 'FAIL'\n        else:\n            status = run.get(stage, 'skipped')\n        print('%s: %s' % (stage, status))\n        passed = passed + 1\n    decision = 'promote' if passed == len(stages) else 'rollback'\n    print('stages passed: %d / decision: %s' % (passed, decision))\n\ndeliver('r1')\ndeliver('r2')",
      prompt: {
        ar: 'الخط يبدو أخضر وهو مكسور: في r2 طُبع test: FAIL ومع ذلك توالت المراحل فطُبع canary: ok ثم stages passed: 3 / decision: promote — ترقية فوق مرحلة فاشلة. العيب: حلقة تمشي المراحل بلا فحص حالة — تزيد العدّاد عند كل مرحلة ولا تتوقف عند الفشل، فيصير شرط passed == len(stages) كاذب الصدق. أضف الفحص المفقود: عند أول غير-ok اطبع stopped: <stage> واقطع، ولا تزد passed إلا بعد اجتياز الحارس، حتى يصير حكم r2 صادقًا: stages passed: 1 / decision: rollback ويبقى حكم r1 كما هو: stages passed: 3 / decision: promote.',
        en: 'The pipeline looks green while broken: r2 printed test: FAIL, yet the walk continued — canary: ok then stages passed: 3 / decision: promote — a promotion over a failed stage. The defect: a loop with no status check — it increments the counter at every stage and never stops at failure, making the passed == len(stages) condition dishonestly true. Add the missing check: at the first not-ok print stopped: <stage> and break, incrementing passed only after the guard passes, so r2\u2019s verdict becomes honest — stages passed: 1 / decision: rollback — while r1 stays stages passed: 3 / decision: promote.',
      },
      solution: "stages = ['build', 'test', 'canary']\nruns = {\n    'r1': {'build': 'ok', 'test': 'ok'},\n    'r2': {'build': 'ok', 'test': 'FAIL'},\n}\ncanary_errors = {'r1': [1, 2, 1, 2, 1], 'r2': [1, 1, 1]}\nERROR_THRESHOLD = 4.0\n\ndef deliver(run_id):\n    run = runs[run_id]\n    passed = 0\n    for stage in stages:\n        if stage == 'canary':\n            samples = canary_errors[run_id]\n            status = 'ok' if sum(samples) / len(samples) <= ERROR_THRESHOLD else 'FAIL'\n        else:\n            status = run.get(stage, 'skipped')\n        print('%s: %s' % (stage, status))\n        if status != 'ok':\n            print('stopped: %s' % stage)\n            break\n        passed = passed + 1\n    decision = 'promote' if passed == len(stages) else 'rollback'\n    print('stages passed: %d / decision: %s' % (passed, decision))\n\ndeliver('r1')\ndeliver('r2')",
      tests: [
        {
          id: 't1',
          name: { ar: 'حكم r2 صادق بعد الإصلاح', en: 'r2\u2019s verdict is honest after the fix' },
          code: "assert 'stages passed: 1 / decision: rollback' in __learner_output__, 'expected: stages passed: 1 / decision: rollback | actual: %r' % __learner_output__",
          expected: 'stages passed: 1 / decision: rollback',
        },
        {
          id: 't2',
          name: { ar: 'سبب التوقف مكتوب', en: 'The stop reason is written' },
          code: "assert 'stopped: test' in __learner_output__, 'expected: stopped: test | actual: %r' % __learner_output__",
          expected: 'stopped: test',
        },
        {
          id: 't3',
          name: { ar: 'التوقف يلي الفشل مباشرة بلا مراحل لاحقة', en: 'The stop directly follows the failure, no later stages' },
          code: "assert 'test: FAIL\\nstopped: test' in __learner_output__, 'expected: stopped: test immediately after test: FAIL (no canary line ran after the failure) | actual: %r' % __learner_output__",
          expected: 'stopped: test immediately after test: FAIL (no canary line ran after the failure)',
        },
        {
          id: 't4',
          name: { ar: 'ترقية واحدة صادقة لا اثنتان', en: 'One honest promotion, not two' },
          code: "assert __learner_output__.count('decision: promote') == 1, 'expected: exactly one decision: promote (r1 only) | actual: %r' % __learner_output__",
          expected: 'exactly one decision: promote (r1 only)',
        },
      ],
      hints: [
        { ar: 'لا تمس فرع canary ولا سطر الحكم — كلاهما يعمل. العيب في الموضع الوحيد بين print وpassed = passed + 1: لا يوجد فحص للحالة هناك.', en: 'Do not touch the canary branch or the decision line — both work. The defect is the one place between print and passed = passed + 1: no status check sits there.' },
        { ar: 'النمط هو run_pipeline من الدرس الأول: عند status != \'ok\' اطبع \'stopped: %s\' % stage ثم break — وما بعد break لا يُنفَّذ أبدًا، فتختفي مراحل ما بعد الفشل من السجل.', en: "The pattern is lesson one\u2019s run_pipeline: when status != 'ok' print 'stopped: %s' % stage then break — nothing after break ever executes, so post-failure stages vanish from the log." },
        { ar: 'العدّ بعد الحارس لا قبله: passed = passed + 1 يُنقل ليكون آخر جسم الحلقة، فيعدّ المراحل الناجحة فقط — وشرط passed == len(stages) يصير صدقًا لا تزييفًا.', en: 'Count after the guard, not before: move passed = passed + 1 to be the loop body\u2019s last statement, so only successful stages count — and passed == len(stages) becomes truth, not forgery.' },
        { ar: 'الإصلاح الكامل:\n        print(\'%s: %s\' % (stage, status))\n        if status != \'ok\':\n            print(\'stopped: %s\' % stage)\n            break\n        passed = passed + 1', en: "The full fix:\n        print('%s: %s' % (stage, status))\n        if status != 'ok':\n            print('stopped: %s' % stage)\n            break\n        passed = passed + 1" },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'من الفصل كله: لماذا يبني خط CI الأثر مرة واحدة ولا يُعاد بناؤه قبل النشر؟',
            en: 'From the whole chapter: why does a CI pipeline build the artifact exactly once and never rebuild it before deploy?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن إعادة البناء أغلى دائمًا من نسخ الأثر', en: 'Because rebuilding always costs more than copying the artifact' } },
            { id: 'b', text: { ar: 'لأن الأثر الذي اختبرته يجب أن يكون حرفيًّا الأثر الذي ينشر — إعادة بناء «نفس الكود» قد تنتج شيئًا مختلفًا خفيًّا لأن مترجمًا أو اعتمادية تغيّرت', en: 'Because the artifact you tested must literally be the one you deploy — rebuilding \u201cthe same code\u201d can produce something subtly different because a compiler or dependency moved' } },
            { id: 'c', text: { ar: 'لأن الأثر الواحد يخدم كل المستخدمين من آلة واحدة', en: 'Because one artifact serves all users from a single machine' } },
          ],
          answer: 'b',
          explanation: {
            ar: '«ابنِ مرة، شغّل في أي مكان» ليس ترفًا: قيمة الفحص كله تتبخر إن لم يكن المُختبَر هو المُنشر — ولهذا تحقق l3 من بصمات الطبقات بـ crc32 قبل النشر.',
            en: '\u201cBuild once, run anywhere\u201d is not a luxury: the entire test\u2019s value evaporates if the tested thing is not the deployed thing — which is why lesson three verified layer fingerprints with crc32 before deploying.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'اختبار يفشل أحيانًا فقط، والفريق يعيد التشغيل ويمضي. ما الخطوة الصحيحة فورًا؟',
            en: 'A test fails only sometimes, and the team reruns and moves on. What is the correct immediate step?',
          },
          options: [
            { id: 'a', text: { ar: 'إعادة التشغيل حتى يمر — الفشل المتقطع ليس عيبًا حقيقيًّا', en: 'Rerun until it passes — an intermittent failure is not a real defect' } },
            { id: 'b', text: { ar: 'نقل الاختبار إلى مرحلة ليلية أقل ضغطًا', en: 'Move the test to a less pressured nightly stage' } },
            { id: 'c', text: { ar: 'عزله فورًا وعلاجه كعيب في الحزمة نفسها — المتقلب يعلّم الفريق تجاهل الأحمر فتمر الإخفاقات الحقيقية على التهمة نفسها', en: 'Quarantine it immediately and treat its existence as a defect in the suite itself — flaky teaches the team to ignore red until real failures slip through on the same shrug' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'المتقلب أخطر من الفاشل دائمًا: إنه يخفف معنى الأحمر تدريجيًّا. أسبابه المعتادة — سباقات وحالة مشتركة واعتماد على الترتيب — تُصلَح كلها، والتجاهل ليس إصلاحًا.',
            en: 'Flaky is worse than always-failing: it dilutes the meaning of red over time. Its usual causes — races, shared state, order dependence — are all fixable, and ignoring them is not a fix.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'كيف يضمن اختيار الشريحة بالدلائل crc32(user_id.encode()) % 100 أن المستخدم نفسه يقع في الجانب نفسه في كل زيارة؟',
            en: 'How does slice selection by buckets, crc32(user_id.encode()) % 100, guarantee the same user lands on the same side on every visit?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن crc32 يخزّن المستخدم في قاعدة بيانات جلسات', en: 'Because crc32 stores the user in a session database' } },
            { id: 'b', text: { ar: 'لأنه بصمة حتمية للاسم: الاسم نفسه يعطي الدلو نفسه دائمًا — فالشريحة عادلة وبلا خدمة جلسات', en: 'Because it is a deterministic fingerprint of the name: the same name always yields the same bucket — a fair slice with no session service' } },
            { id: 'c', text: { ar: 'لأنه يعيد توزيع الدلائل بتوازن جديد كل يوم', en: 'Because it rebalances the buckets daily' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'maya في الدلو 4 وomar في الدلو 0 في كل زيارة — هذا ما جعل شريحة الكناري في المشروع قابلة للقياس: نفس الأشخاص يرون الجديد فيتساقط تعدد الإصدارات من الحساب.',
            en: 'maya sits in bucket 4 and omar in bucket 0 on every visit — this is what made the project\u2019s canary slice measurable: the same people see the new code, so version mixing never confounds the account.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي درس يجسّده حادث Knight Capital 2012 — نسخ يدوي لثمانية خوادم سقط فيه الخادم الثامن، وعلامة معاد استعمالها أيقظت كودًا ميتًا؟',
            en: 'Which lesson does the 2012 Knight Capital incident embody — a manual copy across eight servers missed one, and a repurposed flag woke dead code?',
          },
          options: [
            { id: 'a', text: { ar: 'بلا أتمتة لا تستطيع حتى ضمان أن ثمانية خوادم تعمل الكود نفسه — والعلامة القديمة لا يُعاد استعمالها أبدًا: retire ثم احذف ثم اخترع اسمًا جديدًا', en: 'Without automation you cannot even guarantee eight servers run the same code — and an old flag is never repurposed: retire it, delete its dead code, mint a new name' } },
            { id: 'b', text: { ar: 'النشر اليدوي مقبول للأعداد الصغيرة من الخوادم إن كان الفريق منتبهًا', en: 'Manual deployment is acceptable for a small number of servers if the team is careful' } },
            { id: 'c', text: { ar: 'الأعطال الكبرى سببها العتاد والشبكات لا عمليات النشر', en: 'Major outages are caused by hardware and networks, not deployment processes' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'خسارة تتجاوز 460 مليونًا في نحو 45 دقيقة من كودٍ ميت في خادم واحد — الأتمتة ليست ترف سرعة بل شرط صحة أساسي: «أي خوادم تعمل أي إصدار؟» يجب أن يكون له جواب آلي.',
            en: 'Over $460M lost in about 45 minutes from dead code on one server — automation is not a speed luxury but a basic correctness precondition: \u201cwhich servers run which version?\u201d must have an automated answer.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'غيّرتَ سجل DNS وتصل شكاوى من مستخدمين ما زالوا يصلون إلى عنوان قديم. من يُلام؟',
            en: 'You changed a DNS record and users still complain they reach the old address. Who is to blame?',
          },
          options: [
            { id: 'a', text: { ar: 'الكود — لا بد أنه يقرأ العنوان من مكان خاطئ', en: 'The code — it must be reading the address from the wrong place' } },
            { id: 'b', text: { ar: 'مسجّل النطاق — أخطأ تطبيق التغيير حتمًا', en: 'The registrar — it must have failed to apply the change' } },
            { id: 'c', text: { ar: 'لا أحد يُلام بعد: الأجواب المخزَّنة تبقى حتى ينقضي TTL — ولهذا تخفض TTL قبل الترحيل المخطط له وترفعه بعده', en: 'Nobody, yet: cached answers linger until their TTL expires — which is why you lower the TTL well before a planned migration and raise it after' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'الفخ الشهير أن تلم الكود لما هو طبيعة الذاكرة: كل جواب يعيش مدة TTL حيث خُزِّن — والتخطيط للترحيل يبدأ بخفض TTL مبكرًا لا بلوم الكود.',
            en: 'The famous trap is blaming code for the nature of caching: every answer lives for its TTL wherever it was stored — and migration planning starts with lowering the TTL early, not with debugging the code.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'تريد إظهار استقرار نخبوِي فقررت النشر مرة كل ربع سنة بعد فحوص يدوية مطوّلة. أي مقاييس تنهار وتكشف اللعبة؟',
            en: 'You want to show elite stability, so you decide to deploy once a quarter after lengthy manual checks. Which metrics collapse and expose the game?',
          },
          options: [
            { id: 'a', text: { ar: 'معدل الفشل ومعدل إعادة العمل — سيسجلان صفرًا لامعًا', en: 'Change fail rate and rework rate — they will shine at zero' } },
            { id: 'b', text: { ar: 'تكرار النشر وزمن قيادة التغيير — مجموعة الإنتاجية كلها تنهار، وقانون Goodhart يفضحك: كل مقياس يُجعل هدفًا يُلعَب', en: 'Deployment frequency and change lead time — the whole throughput group collapses, and Goodhart\u2019s law exposes you: any metric turned into a target gets played' } },
            { id: 'c', text: { ar: 'زمن التعافي وحده — سيطول لأن النشرات قليلة', en: 'Recovery time alone — it will grow because deployments are rare' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'لهذا تقترن المجموعتان: تحسين الاستقرار بتجميع النشرات ينهار على الإنتاجية — ولا يوجد رخيص يُحسّن اللوحة كلها؛ التحسين الحقيقي تغييرات أصغر وخطوط أقوى وتعافٍ مُتدرَّب.',
            en: 'This is why the groups pair: buying stability by batching collapses throughput — and no cheap move improves the whole dashboard; real improvement is smaller changes, stronger pipelines, rehearsed recovery.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'حلقة الخط تزيد العدّاد عند كل مرحلة بلا فحص — فيُطبع promote وتحته مرحلة فاشلة',
          right: 'افحص الحالة قبل العدّ: عند أول غير-ok اطبع stopped: <stage> واقطع — الحكم يُشتق من نجاح حقيقي لا من عدٍّ أعمى',
          note: {
            ar: 'خطٌّ يكمل بعد الفشل أخطر من خط أحمر: الأحمر يُلحّ على أحد، أما الأخضر المزيف فيُرتقي إلى الإنتاج وهو يبتسم. شرط passed == len(stages) لا قيمة له إلا إذا كان كل زيادة في passed وراء حارس.',
            en: 'A pipeline continuing past failure is worse than a red one: red pesters somebody, while fake green promotes straight to production while smiling. The condition passed == len(stages) is worthless unless every increment sits behind a guard.',
          },
        },
        {
          wrong: 'أعدنا بناء «نفس الكود» مساءً ونشرنا الناتج — طالما المصدر لم يتغير فالنتيجة واحدة',
          right: 'الأثر يُبنى مرة واحدة ويُخزَّن: الأثر الذي اختبرته حرفيًّا هو الذي ينشر — وإلا فتحقق من بصمات الطبقات (crc32) قبل النشر',
          note: {
            ar: 'إعادة البناء قد تنتج شيئًا مختلفًا خفيًّا لأن مترجمًا أو اعتمادية تحركت بين البنيين — وأنت اختبرت النسخة الأولى لا الثانية. تحقق l3 من الطبقات ليس طقسًا: إنه الفرق بين أثر مُختبَر وأثر مُفترَض.',
            en: 'A rebuild can produce something subtly different because a compiler or dependency moved between the two builds — and you tested the first, not the second. Lesson three\u2019s layer check is not a ritual: it is the difference between a tested artifact and an assumed one.',
          },
        },
        {
          wrong: 'سجل النشرات بلا تواريخ دقيقة ولا رايات failed — «سنحفظ الأرقام من الذاكرة عند العرض»',
          right: 'اكتب commit وdeploy وfailed لحظة الحدث — المقاييس تُقرأ من سجل منضبط، وحكم صادق اليوم يعني CFR موثوقًا غدًا',
          note: {
            ar: 'مقاييس DORA ليست أرقامًا تُستحضر بل قراءات لسجل: كل rollback صادق راية failed غدًا، وكل حكم مُجمَّل يسمّم CFR. الخط الذي يجامل نفسه يفقد أدقّ ما يملك: مرآة صادقة.',
            en: 'DORA metrics are not recalled numbers but readings of a log: every honest rollback is tomorrow\u2019s failed flag, and every cosmetized verdict poisons CFR. A pipeline that flatters itself loses its most valuable possession: an honest mirror.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'جملة الفصل الواحدة: اجعل التغيير صغيرًا، واجعل طريقه إلى المستخدمين آليًّا ومعرَّضًا تدريجيًّا، وراقب النتائج — بوابات CI هي الفصلان 9 و10 صارا إلزامًا، وDORA هو الفصل 12 صار صادقًا، والنشر المستمر هو رهان الدورات القصيرة وقد صار فيزيائيًّا.', en: 'The chapter in one sentence: make change small, make its path to users automatic and progressively exposed, and watch the outcomes — CI gates are chapters 9 and 10 made mandatory, DORA is chapter 12 made honest, and continuous deployment is the short-cycle bet made physical.' },
        { ar: 'المشروع ركّب ثلاث آلات في واحدة: مشية مراحل بترتيب الكفة تتوقف عند أول فشل بسبب مكتوب، وكناري يُحكم من عينات الشريحة بـ mean <= ERROR_THRESHOLD، وخلاصة DORA من سجل التاريخ — وحكمها سطر واحد قابل للتدقيق: stages passed: %d / decision: %s.', en: 'The project composed three machines into one: a cost-ordered stage walk stopping at the first failure with a written reason, a canary judged from slice samples via mean <= ERROR_THRESHOLD, and a DORA summary over the history log — its verdict one auditable line: stages passed: %d / decision: %s.' },
        { ar: 'الخط والمقاييس حكاية واحدة: كل rollback صادق راية failed في السجل غدًا — خطٌّ يجمّل حكمه يسمّم مقاييسه، والحكم الصادق أهم من الحكم السعيد؛ والفصل القادم يفتح الذيل الطويل: الكود القديم وإعادة الهيكلة والدين التقني.', en: 'Pipeline and metrics tell one story: every honest rollback is tomorrow\u2019s failed flag — a pipeline that cosmetizes its verdict poisons its metrics, and the honest verdict matters more than the happy one; the next chapter opens the long tail: legacy code, refactoring, and technical debt.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب واجعل الكناري المريض يحرس آخر مرحلة وشاهد الحكم ينقلب عند العتبة وCFR يتتبع صدق السجل. اسأل نفسك: في أول خط تسليم حقيقي تبنيه — أي مرحلتين تكتبهما أولًا ولماذا هاتان تحديدًا، وما القيمة التي تجعل قرار promote مقيَّدًا بها، ومن يملك حق تعديلها وكم مرة؟',
        en: 'Open the sandbox, let a sick canary guard the last stage, and watch the verdict flip at the threshold while CFR follows the log\u2019s honesty. Ask yourself: in the first real delivery pipeline you build — which two stages would you write first and why those two, what value would gate the promote decision, and who owns the right to change it, and how often?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch14.s8', pages: 'ص400-402 / pp.400-402' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch14.s8', pages: 'ص400-402 / pp.400-402' },
  ],
} satisfies Lesson;

export default lesson;
