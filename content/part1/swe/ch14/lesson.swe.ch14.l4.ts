import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch14.l4 — "Continuous Security Pipelines and DORA Delivery Metrics
 * خطوط الأمن المستمر ومقاييس DORA للتسليم"
 * Aligned with SWE ch14 s6 (14.6 Continuous Security Pipelines, pp.397-398) +
 * s7 (14.7 DORA Delivery Metrics, pp.398-400).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * SIMULATED-METRICS PATTERN: no real repos, scanners, or CI dashboards — SCA
 * is modeled as a manifest dict checked against a known-issues list, and the
 * DORA calculators run over a fixed event log of datetime pairs
 * (commit/deploy + a failed flag). Deterministic only.
 */

const lesson = {
  id: 'swe.ch14.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 14,
  title: { ar: 'خطوط الأمن المستمر ومقاييس DORA للتسليم', en: 'Continuous Security Pipelines and DORA Delivery Metrics' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch14.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'خط الدرس الأول يتحقق أن التغيير يعمل — وهذا الدرس يضيف بوابات تسأل: هل يصلح أن يُعرَض لعالم معادٍ؟ التحليل الساكن الذي مارسته في SWE الفصل التاسع يصير هنا سياسة: ماسحات تفحص الكود بلا تشغيل، وأخرى تهاجم التطبيق الواجب من خارج، وثالثة تفحص قائمة اعتمادياتك — فالكود الذي كتبته طبقة رقيقة فوق كودَ جبتَه، وثغراته ثغراتك؛ وقارض أسرار يمنع المفاتيح من دخول التاريخ أصلًا. ثم السؤال الذي يسأله كل هذا الجهد: هل يعمل التسليم أصلًا؟ برنامج DORA البحثي أعطى أجوابًا مقيسًا: أربعة مفاتيح صارت خمسة — كم مرة تنشر، وكم يطول انتظار التزام حتى الإنتاج، وكم نصيب النشرات المفشلة، وكم يستغرق التعافي، وكم من نشرك كان رد فعل لا خطة. سنحسبها كلها من سجل أحداث ثابت: تواريخ التزام ونشر وفشل واستعادة. بنهاية الدرس ستكون قادرًا على: تسمية عائلات الماسحات الثلاث ومرحلة كل منها الصحيحة، وحساب مقاييس DORA الخمسة من سجل.',
        en: 'Lesson one\u2019s pipeline checks that a change works — this lesson adds gates asking: is it safe to expose to an adversarial world? The static analysis you practiced in SWE chapter 9 becomes policy here: scanners that read code without running it, others attacking the running app from outside, a third scanning your dependency manifest — the code you wrote is a thin layer atop code you imported, and its vulnerabilities are yours; a secrets scanner keeps credentials out of history entirely. Then the question behind all this effort: is delivery itself working? The DORA research program gave a measurable answer: four keys, now five — how often you deploy, how long a commit takes to reach production, what fraction of deployments fail, how long recovery takes, and how much of your deploying was reactive. We compute them from a fixed event log of commit/deploy datetimes plus a failed flag. By the end you can name the three scanner families and each one\u2019s correct stage, and calculate the five DORA metrics from a log.',
      },
    },
    {
      kind: 'predict',
      code: "outcomes = ['ok', 'ok', 'FAIL', 'ok', 'ok']\nfailed = 0\nfor o in outcomes:\n    if o == 'FAIL':\n        failed += 1\nprint('CFR: %.1f' % (failed / len(outcomes)))",
      question: {
        ar: 'خمس عمليات نشر، وعلامة FAIL واحدة. أي مقياس من مقاييس DORA يحسب هذا السطر بالضبط، وماذا يعني عمليًّا أن تكون قيمته 0.2 في فريق حقيقي؟',
        en: 'Five deployments, one FAIL marker. Which DORA metric does this line compute exactly, and what does a value of 0.2 mean practically on a real team?',
      },
      reveal: {
        ar: 'الطباعة: CFR: 0.2 — معدل فشل التغيير: نصيب النشرات التي سبّبت خللًا في الإنتاج (حوادث أو تراجع أو ترقيع عاجل) من كل النشرات: واحد من خمسة. إنه النصف «الاستقراري» من المقاييس — ويقرأ مقرونًا بشريكه: إن نشرت كل يوم وبقي المعدل 0.2 فهذا شريط أحمر، وإن نشرت أسبوعيًّا وبقي 0.2 فهذا باب مؤجل. المقياس وحده لا يكفي — والاقتران هو درس اليوم الثاني.',
        en: 'It prints CFR: 0.2 — the change fail rate: the share of deployments that caused a production failure (an incident, a rollback, a hotfix) among all deployments: one in five. It is the stability half of the metrics — and it is read paired with its counter-metric: deploying daily at 0.2 is a red flag; deploying weekly at 0.2 is a delayed door. No single metric suffices — pairing is the second half of today.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'عائلات الماسحات وموضع كل بوابة', en: 'The scanner families and where each gate belongs' },
      chunks: [
        {
          ar: 'ثلاث عائلات تقسم العمل. فحص أمن التطبيقات الساكن SAST يقرأ الشيفرة بلا تشغيل باحثًا أنماط الحقن وفك التسلسل غير الآمن وسوء استخدام الذاكرة — وهو الطرف الأمني من التحليل الساكن الذي مارسته، وكل دروس الفصل التاسع في الإنذارات الكاذبة تنطبق مضاعفة: بوابة SAST صاخبة يختم عليها المطورون بلا قراءة لا تحمي أحدًا.',
          en: 'Three families divide the work. Static application security testing (SAST) reads source without running it, hunting injection, unsafe deserialization, and memory misuse — the security end of the static analysis you practiced, and every chapter-9 lesson about false positives applies with interest: a noisy SAST gate developers rubber-stamp protects no one. Dynamic application security testing (DAST) attacks the running application from outside the way an adversary would: malformed inputs, injection payloads, authentication bypasses, knowing nothing about the source — the white-box/black-box complementarity again: SAST sees paths DAST may never reach; DAST sees deployed behavior (server configuration, header mistakes, service composition) no source scan can.',
        },
          {
          ar: 'والفحص الديناميكي DAST يهاجم التطبيق الواجب من خارج كما يفعل الخصم: مدخلات مشوهة وحقن وتجاوز مصادقة، بلا علم بالشيفرة — فالتكامل تكامل الصندوقين الأبيض والأسود: SAST يرى مسارات لا يصل إليها DAST، وDAST يرى سلوكًا منشورًا (إعدادات خوادم وأخطاء ترويسات وتركيب خدمات) لا تراه أي مسح شيفرة. وفحص تركيب البرمجيات SCA لا يقرأ كودك ولا تطبيقك الواجب بل manifest اعتمادياتك: مخزون الحزم الثالثة مقابل قواعد الثغرات المعروفة — لأن حسابًا غير مريح يقول: كودك طبقة رقيقة فوق أضعاف من كود جبتَه؛ أنت تشحن اعتمادياتك وثغراتها ثغراتك ولا مراجعة لكودك تكشفها.',
          en: 'Software composition analysis (SCA) reads neither your code nor your running app but your dependency manifest: the third-party inventory checked against known-vulnerability databases — because of an uncomfortable arithmetic: your code is a thin layer atop orders of magnitude of code you imported; you ship your dependencies, their vulnerabilities are yours, and no review of your code finds them.',
        },
        {
          ar: 'وقارض الأسرار رابعٌ إلزامي: يفتش الالتزامات عن مفاتيح API وكلمات مرور ومفاتيح خاصة قبل دخولها التاريخ — فتاريخ git أبدِيّ والقوارص تقشف المستودعات العمومية بلا توقف: سرٌّ دُفع تعرّض لحظة وصوله، والدوران بعده مؤلم، بينما بوابة منع التسريب شبه مجانية. وموضع البوابات مبدأ واحد: شغّل كل فحص عند أقدم نقطة يعطي جوابًا صحيحًا — الأسرار وSAST يكفيهما المصدر فتجريان عند الالتزام داخل النواة الحاجبة السريعة؛',
          en: 'A secrets scanner is the fourth mandatory gate: it searches commits for API keys, passwords, and private keys before they enter history — git history is effectively permanent and harvesting bots sweep public commits continuously; a pushed secret is compromised the moment it lands, rotation afterward is painful, while a pre-commit block is nearly free. Gate placement follows one principle: run each check at the earliest point it can give a correct answer — secrets and SAST need only source, so they run at commit time inside the fast merge-blocking core; SCA needs the resolved dependency set, so it runs at build time and again on a schedule, since the world\\u2019s knowledge of your dependencies changes while your code does not; DAST needs a running system, so it runs against a staging deployment.',
        },
          {
          ar: 'وSCA يحتاج مجموعة الاعتماديات المحلولة فتجري عند البناء وأيضًا على جدول دوري لأن معرفة العالم بثغراتك تتغير وكودك لا؛ وDAST يحتاج نظامًا واجبًا فتجري على نشر تجريبي. وسلسلة التوريد هي السقف: بوتات تحديث آلي (Dependabot الأنموذج) تفتح طلب دمج للترقية فتجري عليه حزمتك نفسها؛ والتضليل بأسماء قريبة من حزم شهيرة واختراق حسابات مشرفين وسولارويندز تاريخًا — والدفاعات تتكدس: ملفات قفل تثبّت الإصدارات وتوقيع وشهادات منشأ (SLSA) وقائمة مكونات برمجية SBOM — لكن الدفاع الأول ثقافي: إضافة اعتمادية قرار هندسي بنموذج تهديد لا غداء مجاني.',
          en: 'And the supply chain is the roof: automated update bots (Dependabot the archetype) open a pull request per bump, and your own pipeline proves the upgrade safe; typosquatting near popular package names and hijacked maintainer accounts (SolarWinds historically) are real — defenses stack: lockfiles pinning versions, signing and provenance attestation (SLSA), a software bill of materials (SBOM) — but the first defense is cultural: adding a dependency is an engineering decision with a threat model, not a free lunch.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'مفاتيح DORA: كيف تعرف أن التسليم يعمل', en: 'The DORA keys: knowing whether delivery works' },
      chunks: [
        {
          ar: 'برنامج بحثي متعدد السنوات استطلع عشرات آلاف الممارسين واستخرج مجموعة مقاييس نتائج تتنبأ مجتمعة بأداء التسليم — المفاتيح الأربعة الشهيرة: تكرار النشر كم مرة تنشر إلى الإنتاج، وزمن قيادة التغيير كم يطول انتظار التزام حتى الإنتاج، ومعدل فشل التغيير ما نصيب النشرات المسببة لخلل إنتاجي (حادثة أو تراجع أو ترقيع)، وزمن التعافي من نشر فاشل كم تستغرق استعادة الخدمة.',
          en: 'A multi-year research program surveying tens of thousands of professionals distilled outcome measures that jointly predict delivery performance — the famous four keys: deployment frequency (how often you deploy to production), change lead time (how long a commit takes to reach production), change fail rate (the fraction of deployments causing a production failure — an incident, a rollback, a hotfix), and failed-deployment recovery time (how long restoring service takes). The 2024 research added a fifth: deployment rework rate — the share of unplanned deployments shipped in response to an incident.',
        },
          {
          ar: 'ثم أضاف بحث 2024 مقياسًا خامسًا: معدل إعادة العمل — نصيب النشرات غير المخططة التي شُحنت ردًّا على حادثة. والترتيب الحالي مجموعتان: الإنتاجية (زمن القيادة والتكرار وزمن التعافي — سرعة سريان التغييرات بمن فيها الإصلاحات) وعدم الاستقرار (معدل الفشل ومعدل إعادة العمل — كم مرة تسوء النشرات أو توجد لتعقيب سوء سابق). ولاحظ الشكل: مجموعة تقيس سرعة انتقال القيمة ومجموعة تقيس سلامتها — وكلها نتائج لنظام التسليم كله لا أنشطة داخله، وهذا ما يجعلها تُراقَب.',
          en: 'The current grouping is twofold: throughput (lead time, frequency, recovery time — how fast changes, including fixes, flow) and instability (fail rate and rework rate — how often deployments go wrong or exist only to clean up after one). Notice the shape: one group measures how fast value moves, the other how safely — and all five are outcomes of the whole delivery system, not activities within it, which is what makes them worth watching.',
        },
        {
          ar: 'والمقاييس المقترنة تقاوم الغش — قانون Goodhart من الفصل الثاني عشر مؤسَّسًا هنا: حاول تحسين الإنتاجية بنشر نصف جاهز باستمرار فيرتفع معدل الفشل ويكشفك؛ وحاول تحسين الاستقرار بالنشر كل ربع بعد فحوص يدوية مطوّلة فينهار التكرار وزمن القيادة. كل مجموعة هي مضاد-مقياس الأخرى — والمقياس الخامس أغلق ثغرة كانت الأربعة تفوتها: تعافَ سريعًا برقيعات غير مخططة فيبدو زمن التعافي نخبويًّا، بينما يفضح معدل إعادة العمل كم من تسليمك تنظيف.',
          en: 'Paired metrics resist gaming — Goodhart\\u2019s law from chapter 12, institutionalized: game throughput by constantly shipping half-baked changes and the fail rate rises to expose you; game stability by deploying quarterly after months of manual checking and frequency and lead time collapse. Each group is the other\\u2019s counter-metric — and the fifth metric closed a cheat the four missed: recover fast via quick unplanned patches and recovery time looks elite while rework rate reveals how much of your delivery is cleanup.',
        },
          {
          ar: 'لا يوجد رخيص يُحسّن اللوحة كلها: التحسين الحقيقي تغييرات أصغر وخطوط أقوى وتعافٍ أسرع. والاكتشاف الذي قلب الفولكلور: السرعة والاستقرار مرتبطان إيجابًا — النخبة تنشر على الطلب وتستعيد في أقل من ساعة، والآلية مألوفة: التكرار يفرض صغَر التغيير، والصغير يسهل مراجعته واختباره ونسبته، والنِّسبة تسرّع التعافي، والتعافي الآمن يزيل الخوف الذي يدفع للتجميع — فالإصدارات الكبيرة الحذرة هي الخيار الخطير مرتديًا ثياب الحذر.',
          en: 'There is no cheap move that improves the whole dashboard: real improvement is smaller changes, stronger pipelines, faster recovery. And the finding that overturned decades of folklore: speed and stability correlate positively — elite performers deploy on demand and recover in under an hour; the mechanism is familiar: high frequency forces small changes; small changes are easier to review, test, and attribute; attribution speeds recovery; safe recovery removes the fear that drives batching — so slow, careful, big-batch releases are the risky choice wearing caution\\u2019s clothes.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'حاسبة زمن قيادة التغيير من سجل أحداث', en: 'A lead-time calculator over an event log' },
      code: "from datetime import datetime\n\nlog = [\n    {'commit': datetime(2025, 3, 3, 9, 0), 'deploy': datetime(2025, 3, 3, 15, 0)},\n    {'commit': datetime(2025, 3, 4, 11, 0), 'deploy': datetime(2025, 3, 5, 10, 0)},\n    {'commit': datetime(2025, 3, 5, 14, 0), 'deploy': datetime(2025, 3, 7, 9, 0)},\n]\n\nhours = [(e['deploy'] - e['commit']).total_seconds() / 3600 for e in log]\nfor h in hours:\n    print('lead: %.2f days' % (h / 24))\nprint('lead time: %.1f days' % (sum(hours) / len(hours) / 24))",
      explanation: {
        ar: 'المقياس عمليتان على سجل: الطرح بين تاريخَي commit وdeploy يعطي timedelta، وtotal_seconds() يحوّله إلى رقم نطلقه على 3600 فـ 24 لنحصل على أيام. الحسابات: التزام صباح الاثنين نُشر عصره — 0.25 يوم؛ والتزام الثلاثاء صباحًا نُشر الأربعاء صباحًا — 0.96؛ والتزام الأربعاء بعد الظهر بقي حتى الخميس صباحًا — 1.79. والمتوسط 72 ساعة على ثلاثة تغييرات = 1.0 يوم بالضبط. هذا «زمن قيادة التغيير» كما يقيسه الفريق الجاد: وسيط على تغييرات حديثة من سجل git ولوحة CI — لا أفضل حالة ولا ذاكرة. ولو رأيت الرقم يطول فالسؤال GQM الصحيح: في أي مرحلة من الخط يختبئ الوقت؟',
        en: 'The metric is two operations over a log: subtracting commit from deploy yields a timedelta, total_seconds() turns it into a number we scale by 3600 then 24 for days. The math: a Monday-morning commit deployed that afternoon — 0.25 days; Tuesday morning deployed Wednesday morning — 0.96; Wednesday afternoon waiting until Thursday — 1.79. The mean is 72 hours over three changes = exactly 1.0 day. That is change lead time as serious teams measure it: a median over recent changes from git log and a CI dashboard — not the best case, not memory. And when the number grows, the right GQM question is: which pipeline stage is hiding the time?',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.dora-calculators',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ compute_dora(changes) فوق سجل الأحداث المعطى (كل تغيير فيه commit وdeploy وfailed): احسب زمن القيادة لكل تغيير بالأيام واطبع المتوسط سطرًا lead time: %.1f days، ثم عدّ الفاشلين واطبع deploys: %d failed: %d، ثم اطبع CFR: %.1f، وأعد الثنائي (متوسط زمن القيادة، CFR). أبقِ قائمة changes والاستدعاء كما هي. المتوقع: lead time: 2.5 days ثم deploys: 5 failed: 1 ثم CFR: 0.2.',
        en: 'Implement compute_dora(changes) over the given event log (each change carries commit, deploy, failed): compute each change\u2019s lead time in days and print the mean as lead time: %.1f days, then count the failed ones and print deploys: %d failed: %d, then print CFR: %.1f, and return the pair (mean lead time, CFR). Keep the given changes list and the call as is. Expected: lead time: 2.5 days, then deploys: 5 failed: 1, then CFR: 0.2.',
      },
      starterCode: "from datetime import datetime\n\nchanges = [\n    {'commit': datetime(2025, 3, 3, 9, 0), 'deploy': datetime(2025, 3, 5, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 4, 9, 0), 'deploy': datetime(2025, 3, 6, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 5, 9, 0), 'deploy': datetime(2025, 3, 7, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 6, 9, 0), 'deploy': datetime(2025, 3, 9, 9, 0), 'failed': True},\n    {'commit': datetime(2025, 3, 7, 9, 0), 'deploy': datetime(2025, 3, 9, 9, 0), 'failed': False},\n]\n\ndef compute_dora(changes):\n    # زمن القيادة بالأيام لكل تغيير، ثم المتوسط وCFR والطباعات الثلاث والإرجاع\n    # per-change lead time in days, then the mean, CFR, three prints, and the return\n    pass\n\ncompute_dora(changes)",
      solution: "from datetime import datetime\n\nchanges = [\n    {'commit': datetime(2025, 3, 3, 9, 0), 'deploy': datetime(2025, 3, 5, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 4, 9, 0), 'deploy': datetime(2025, 3, 6, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 5, 9, 0), 'deploy': datetime(2025, 3, 7, 21, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 6, 9, 0), 'deploy': datetime(2025, 3, 9, 9, 0), 'failed': True},\n    {'commit': datetime(2025, 3, 7, 9, 0), 'deploy': datetime(2025, 3, 9, 9, 0), 'failed': False},\n]\n\ndef compute_dora(changes):\n    leads = []\n    for c in changes:\n        hours = (c['deploy'] - c['commit']).total_seconds() / 3600\n        leads.append(hours / 24)\n    failed = 0\n    for c in changes:\n        if c['failed']:\n            failed += 1\n    cfr = failed / len(changes)\n    print('lead time: %.1f days' % (sum(leads) / len(leads)))\n    print('deploys: %d failed: %d' % (len(changes), failed))\n    print('CFR: %.1f' % cfr)\n    return (sum(leads) / len(leads), cfr)\n\ncompute_dora(changes)",
      tests: [
        {
          id: 't1',
          name: { ar: 'زمن القيادة 2.5 يومًا', en: 'Lead time is 2.5 days' },
          code: "assert 'lead time: 2.5 days' in __learner_output__, 'expected: lead time: 2.5 days | actual: %r' % __learner_output__",
          expected: 'lead time: 2.5 days',
        },
        {
          id: 't2',
          name: { ar: 'معدل فشل التغيير 0.2', en: 'Change fail rate is 0.2' },
          code: "assert 'CFR: 0.2' in __learner_output__, 'expected: CFR: 0.2 | actual: %r' % __learner_output__",
          expected: 'CFR: 0.2',
        },
        {
          id: 't3',
          name: { ar: 'سطر العدّ مطبوع', en: 'The deploy/failed count line is printed' },
          code: "assert 'deploys: 5 failed: 1' in __learner_output__, 'expected: deploys: 5 failed: 1 | actual: %r' % __learner_output__",
          expected: 'deploys: 5 failed: 1',
        },
        {
          id: 't4',
          name: { ar: 'الثنائي المُعاد صحيح رقميًّا', en: 'The returned pair is numerically correct' },
          code: "r = compute_dora(changes)\nassert abs(r[0] - 2.5) < 1e-9 and abs(r[1] - 0.2) < 1e-9, 'expected: (2.5, 0.2) | actual: %r' % (r,)",
          expected: '(2.5, 0.2)',
        },
      ],
      hints: [
        { ar: 'زمن القيادة لكل تغيير: hours = (c[\'deploy\'] - c[\'commit\']).total_seconds() / 3600 ثم days = hours / 24 — اجمعها في قائمة leads كما في المثال العملي.', en: "Per-change lead time: hours = (c['deploy'] - c['commit']).total_seconds() / 3600 then days = hours / 24 — collect them into a leads list as in the worked example." },
        { ar: 'العدّ بشرط بسيط: failed يزيد 1 لكل c فيها c[\'failed\'] صادقة، وCFR = failed / len(changes) — قسمة على عدد النشرات كلها لا على الناجحة.', en: "Counting is one guard: increment failed for every c with c['failed'] true, and CFR = failed / len(changes) — divide by all deployments, not the passing ones." },
        { ar: 'الطباعات الثلاث بمنسّقات معلومة: \'lead time: %.1f days\' % المتوسط، و\'deploys: %d failed: %d\' % (len(changes), failed)، و\'CFR: %.1f\' % cfr — ثم أعد (المتوسط, cfr).', en: "Three known formatters: 'lead time: %.1f days' % the_mean, 'deploys: %d failed: %d' % (len(changes), failed), 'CFR: %.1f' % cfr — then return (the_mean, cfr)." },
        { ar: 'الحل الكامل:\ndef compute_dora(changes):\n    leads = []\n    for c in changes:\n        hours = (c[\'deploy\'] - c[\'commit\']).total_seconds() / 3600\n        leads.append(hours / 24)\n    failed = 0\n    for c in changes:\n        if c[\'failed\']:\n            failed += 1\n    cfr = failed / len(changes)\n    print(\'lead time: %.1f days\' % (sum(leads) / len(leads)))\n    print(\'deploys: %d failed: %d\' % (len(changes), failed))\n    print(\'CFR: %.1f\' % cfr)\n    return (sum(leads) / len(leads), cfr)', en: "Full solution:\ndef compute_dora(changes):\n    leads = []\n    for c in changes:\n        hours = (c['deploy'] - c['commit']).total_seconds() / 3600\n        leads.append(hours / 24)\n    failed = 0\n    for c in changes:\n        if c['failed']:\n            failed += 1\n    cfr = failed / len(changes)\n    print('lead time: %.1f days' % (sum(leads) / len(leads)))\n    print('deploys: %d failed: %d' % (len(changes), failed))\n    print('CFR: %.1f' % cfr)\n    return (sum(leads) / len(leads), cfr)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-sca',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — دون تشغيله. هذا نموذج مصغّر لبوابة SCA: أي حزمة سترفع راية؟',
        en: 'Read the code and predict its exact output — without running it. This is a miniature SCA gate: which package gets flagged?',
      },
      code: "manifest = {'flask': '2.0.1', 'requests': '2.25.1'}\nknown = ['requests 2.25.1']\nfor pkg in manifest:\n    line = '%s %s' % (pkg, manifest[pkg])\n    if line in known:\n        print('vulnerable: %s' % line)\n    else:\n        print('clean: %s' % line)",
      solution: 'clean: flask 2.0.1\nvulnerable: requests 2.25.1',
      answer: 'clean: flask 2.0.1\nvulnerable: requests 2.25.1',
      hints: [
        { ar: 'الحلقة تمشي مفاتيح القاموس بترتيب الإدراج: flask أولًا ثم requests — وline تُركَّب بالصيغة \'اسم إصدار\'.', en: "The loop walks the dict keys in insertion order: flask first, then requests — and line is composed as 'name version'." },
        { ar: 'العامل in هنا فحص انتماء في قائمة: سطر requests 2.25.1 موجود في known فتُطبع vulnerable — وسطر flask غير موجود فتُطبع clean.', en: 'The in operator here is list membership: the line requests 2.25.1 is in known so vulnerable prints — flask\u2019s line is not, so clean prints.' },
        { ar: 'لا مقارنة إصدارات رقمية هنا: العضوية نصية حرفيّة — في محاكم حقيقية تقارن الأدوات النطاقات (أقل من 2.26.0 مثلًا) وتُحدَّث باستمرار لأن الثغرات تُكتشف في إصدارات تشحنها أصلًا.', en: 'No numeric version comparison happens here: membership is literal string matching — real tools compare ranges (below 2.26.0, say) and keep re-running, because vulnerabilities are discovered in versions you already ship.' },
        { ar: 'الخرج:\nclean: flask 2.0.1\nvulnerable: requests 2.25.1', en: 'The output:\nclean: flask 2.0.1\nvulnerable: requests 2.25.1' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-rework',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'فريق يبدو ممتازًا: زمن تعافٍ نخبوي. التدقيق يكشف أن كل «تعافٍ» كان رقعة عاجلة غير مخططة شُحنت بعد الحادثة. أي مقياس أضافه بحث 2024 يفضح هذه اللعبة تحديدًا؟',
        en: 'A team looks excellent: elite recovery time. An audit reveals every \u201crecovery\u201d was a quick unplanned patch shipped after the incident. Which metric, added by the 2024 research, exposes exactly this game?',
      },
      options: [
        { id: 'a', text: { ar: 'معدل فشل التغيير — فهو يعدّ النشرات المفشلة', en: 'change fail rate — it counts failed deployments' } },
        { id: 'b', text: { ar: 'معدل إعادة العمل — نصيب النشرات غير المخططة التي شُحنت ردًّا على حادثة إنتاج', en: 'deployment rework rate — the share of unplanned deployments shipped in response to a production incident' } },
        { id: 'c', text: { ar: 'تكرار النشر — لأن الرقيعات ترفع العدد', en: 'deployment frequency — patches raise the count' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'الأربعة الكلاسيكية تركت ثغرة: تعافَ سريعًا برقيعات سريعة فيبدو زمن التعافي رائعًا — والمقياس الجديد صُمم خصيصًا لهذا الغش.', en: 'The original four left a gap: recover fast via quick patches and recovery time looks great — the new metric was designed for exactly this cheat.' },
        { ar: 'معدل الفشل قد يبقى منخفضًا إن سُجّلت الرقيعات نشرات ناجحة — هو لا يسأل لماذا وُجد النشر.', en: 'The fail rate can stay low if patches are logged as successful deployments — it never asks why a deployment existed.' },
        { ar: 'التكرار الأعلى قد يبدو حتى مؤشر إنتاجية — من دون سؤال «كم منها كان رد فعل؟» يبقى اللغز.', en: 'Higher frequency can even look like throughput — without asking \u201chow much of it was reactive?\u201d the riddle stands.' },
        { ar: 'الجواب: b — معدل إعادة العمل يضع عدم الاستقرار في وجه التعافي السريع: مجموعةٌ هي مضاد-مقياس الأخرى.', en: 'Answer: b — rework rate confronts fast recovery with instability: each group is the other\u2019s counter-metric.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-mttr',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'نشر فاشل لُوحظ في الساعة 14:00 وعادت الخدمة للعمل في 16:30. كم يساوي زمن التعافي MTTR بالساعات؟ (رقم فقط)',
        en: 'A failed deployment was noticed at 14:00 and service was restored at 16:30. What is the recovery time (MTTR) in hours? (number only)',
      },
      answer: '2.5',
      solution: '2.5',
      tolerance: 0,
      hints: [
        { ar: 'زمن التعافي يقاس من لحظة ملاحظة النشر السيئ (لا من لحظة نشره) حتى عودة الخدمة — الفجوة هنا من 14:00 إلى 16:30.',
          en: 'Recovery time runs from noticing the bad deploy (not from deploying) to restored service — the gap here runs from 14:00 to 16:30.' },
        { ar: 'من 14:00 إلى 16:00 ساعتان، ومن 16:00 إلى 16:30 نصف ساعة — اجمعهما.', en: '14:00 to 16:00 is two hours, 16:00 to 16:30 is half an hour — add them.' },
        { ar: 'وفي سجل حقيقي تُستخرج الحدين من نفس سجل النشرات الذي أخذت منه CFR — انضباط السجل هو ما يجعل المقاييس ممكنة.', en: 'On a real team both endpoints come from the same deploy log that produced your CFR — log discipline is what makes the metrics possible.' },
        { ar: 'الجواب: 2.5', en: 'Answer: 2.5' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "from datetime import datetime\n\nchanges = [\n    {'commit': datetime(2025, 3, 3, 9, 0), 'deploy': datetime(2025, 3, 4, 9, 0), 'failed': False},\n    {'commit': datetime(2025, 3, 5, 9, 0), 'deploy': datetime(2025, 3, 6, 9, 0), 'failed': True},\n]\n\ndef compute_dora(changes):\n    leads = [(c['deploy'] - c['commit']).total_seconds() / 3600 / 24 for c in changes]\n    failed = sum(1 for c in changes if c['failed'])\n    cfr = failed / len(changes)\n    print('lead time: %.1f days' % (sum(leads) / len(leads)))\n    print('CFR: %.1f' % cfr)\n    return (sum(leads) / len(leads), cfr)\n\ncompute_dora(changes)\n\n# جرّب: اجعل أحد الالتزامات ينتظر يومًا إضافيًّا — أي رقم تحرك: المتوسط أم CFR؟\n# try: make one commit wait an extra day — which number moved: the mean or the CFR?\n# جرّب: علّم النشرتين معًا failed: True — CFR يقفز إلى 1.0 وهو حد إنذار صريح\n# try: mark both deployments failed: True — CFR jumps to 1.0, a loud warning threshold\n# جرّب: أضف نشرًا ثالثًا صحيًّا سريعًا وشاهد CFR يهبط بينما زمن القيادة يتحسن — لوحة تُحسَّن معًا لا رخيصة\n# try: add a third healthy fast deploy and watch CFR drop while lead time improves — a dashboard improved together, not cheaply",
      prompt: {
        ar: 'الملعب حاسبتا DORA مصغّرتان: حرّك تواريخ الالتزام والنشر وشاهد زمن القيادة يتبعهما، وقلب رايات failed وشاهد CFR يستجيب. اسأل نفسك: أي رقم تريد تحسينه أولًا في فريق متخيَّل — ولماذا محاولة تحسينه وحده ستجلب شريكه ليكشفك؟ لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is a miniature DORA calculator: move commit and deploy dates and watch lead time follow; flip failed flags and watch CFR respond. Ask yourself: which number would you improve first on an imaginary team — and why would trying to improve it alone summon its partner to expose you? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن SWE الفصل التاسع: SAST هو الطرف الأمني لأي ممارسة تعلمتها هناك؟',
            en: 'From SWE chapter 9: SAST is the security end of which practice you learned there?',
          },
          options: [
            { id: 'a', text: { ar: 'الاختبار الديناميكي على التطبيق الواجب', en: 'Dynamic testing against the running app' } },
            { id: 'b', text: { ar: 'التحليل الساكن — قراءة الشيفرة بلا تشغيل للبحث عن أنماط، مع نفس مشكلة الإنذارات الكاذبة', en: 'Static analysis — reading code without running it to find patterns, with the same false-positive problem' } },
            { id: 'c', text: { ar: 'مراجعة الأقران في طلبات الدمج', en: 'Peer review in pull requests' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'SAST فحص شيفرة بلا تشغيل — فكل دروس الفصل التاسع تنطبق مضاعفة: الأداة تخطئ في الاتجاهين، والبوابة الصاخبة التي يختم عليها المطورون تفقد قيمتها. اضبط الحساسية كأنها أداة فصل 9 لا كجدار لا يُناقش.',
            en: 'SAST reads code without executing it — every chapter-9 lesson applies with interest: tools err in both directions, and a noisy gate developers rubber-stamp loses its value. Tune it like any chapter-9 tool, not like an unchallengeable wall.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن PY4E: في تتبع اليوم كتبنا line = \'%s %s\' % (pkg, manifest[pkg]) ثم سألنا if line in known. ماذا يعيد العامل in على قائمة؟',
            en: 'From PY4E: today\u2019s trace built line = \u2018%s %s\u2019 % (pkg, manifest[pkg]) then asked if line in known. What does the in operator return on a list?',
          },
          options: [
            { id: 'a', text: { ar: 'قيمة العنصر إن وُجد وإلا None', en: 'The element if found, otherwise None' } },
            { id: 'b', text: { ar: 'True إن كان العنصر موجودًا في القائمة وFalse إن لم يكن', en: 'True if the element is in the list, False otherwise' } },
            { id: 'c', text: { ar: 'فهرس العنصر أو -1', en: 'The element\u2019s index, or -1' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'in عامل انتماء يعيد قيمة منطقية — وهو ما جعل بوابة SCA المصغّرة سطرين: ركّب السطر و اسأل عن الانتماء. البحث الحقيقي يقارن نطاقات إصدارات وفق قواعد ثغرات متجددة، لكن الهيكل المنطقي نفسه.',
            en: 'in is a membership operator returning a boolean — which is what made the miniature SCA gate two lines: compose the string, ask about membership. Real tools compare version ranges against live vulnerability feeds, but the logical shape is the same.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في ترتيب DORA الحديث (2024): في أي مجموعة يجلس زمن التعافي من نشر فاشل، ولماذا؟',
            en: 'In the current (2024) DORA grouping: which group holds failed-deployment recovery time, and why?',
          },
          options: [
            { id: 'a', text: { ar: 'مجموعة عدم الاستقرار — لأن وجود فشل أصلًا عدم استقرار', en: 'instability — because having failures at all is instability' } },
            { id: 'b', text: { ar: 'مجموعة الإنتاجية — لأنه سرعة: كم تسرع التغييرات بمن فيها الإصلاحات إلى الإنتاج', en: 'throughput — because it is a speed: how fast changes, including fixes, reach production' } },
            { id: 'c', text: { ar: 'ليس ضمن المقاييس الخمسة', en: 'It is not among the five metrics' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'إعادة التجميع 2024 نقلت زمن التعافي إلى الإنتاجية لأنه قياس سرعة سريان — وضمّ معدل إعادة العمل إلى عدم الاستقرار لأنه يقيس كم من نشرك ردُّ فعل لا خطة. المجموعتان معًا هما ما يجعل الغش مكشوفًا.',
            en: 'The 2024 regrouping moved recovery time into throughput because it is a flow speed — and put rework rate into instability because it measures how much of your deploying is reactive. Together the groups are what make gaming visible.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ما الاكتشاف الذي قلب عقودًا من الفولكلور حول المقايضة بين السرعة والاستقرار؟',
            en: 'Which finding overturned decades of folklore about the speed-versus-stability trade-off?',
          },
          options: [
            { id: 'a', text: { ar: 'أن الفرق النخبوية تنشر أكثر وتفشل أقل وتتعافى أسرع — الارتباط إيجابي: التكرار يفرض صغَر التغيير فيسهل فحصه ونسبته وتراجعه', en: 'Elite teams deploy more, fail less, and recover faster — the correlation is positive: frequency forces small changes that are easier to review, attribute, and undo' } },
            { id: 'b', text: { ar: 'أن هناك مقايضة حقيقية: من يريد الاستقرار يبطئ النشر', en: 'A real trade-off exists: stability requires slowing down deployments' } },
            { id: 'c', text: { ar: 'أن المقاييس تعتمد على حجم الشركة لا على الممارسات', en: 'The metrics depend on company size, not practices' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'البيانات قالت العكس من الحدس القديم: الإصدارات الكبيرة «الحذرة» هي الخيار الخطير مرتديًا ثياب الحذر — فالتعافي الآمن يزيل الخوف الذي يدفع للتجميع، والحلقة تدور نحو الخير لا الشر.',
            en: 'The data said the opposite of the old intuition: slow, careful, big-batch releases are the risky choice wearing caution\u2019s clothes — safe recovery removes the fear that drives batching, and the loop turns virtuous instead of vicious.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'بوابة SAST تُصدر مئات الإنذارات فصار المطورون يختمون عليها بلا قراءة',
          right: 'اضبط حساسية البوابة كأداة فصل 9: أولوية للإنذارات القابلة للتنفيذ وذاكرة للأصناف المستبعدة — البوابة الصامتة أكثر خطرًا من لا بوابة',
          note: {
            ar: 'البوابة التي يتعلم الفريق تجاهلها تحمي لا أحد: أصبحت طقسًا. المبدأ نفسه من الفصل التاسع: الإنذار الكاذب الكثيف يقلب الأداة من كاشف إلى ضجيج — والعلاج صيانة لا إلغاء.',
            en: 'A gate the team learns to ignore protects no one: it became a ritual. The chapter-9 principle stands: high-volume false positives turn a tool from detector into noise — the cure is maintenance, not removal.',
          },
        },
        {
          wrong: 'فحص SCA مرة واحدة عند الإطلاق ثم نسيانه، وإضافة اعتمادية جديدة قرار «بيب وركّب»',
          right: 'SCA مستمرة: عند البناء وعلى جدول دوري — وإضافة اعتمادية قرار هندسي بنموذج تهديد',
          note: {
            ar: 'الثغرات تُكتشف في إصدارات تشحنها اليوم — فالفحص الواحد قديم لحظة انتهائه، والبوتات التي تفتح طلبات ترقية تجري عليها حزمتك نفسها فتصبح الحيوية أرخص كلما قوي خطك. والاعتمادية الجديدة تُسأل عنها نفس أسئلة الكود: من صاحبها وما سطحها وما بديلها؟',
            en: 'Vulnerabilities are discovered in versions you already ship — a one-time scan is stale the moment it ends; update bots open bump PRs that your own pipeline vetoes or proves, making freshness cheaper the stronger your pipeline. New dependencies get asked the same questions as code: who owns it, what surface, what alternative?',
          },
        },
        {
          wrong: 'تحويل مقاييس DORA إلى أهداف ربع سنوية مرصودة للأفراد',
          right: 'استخدمها GQM: أسئلة لا أهداف — لماذا زمن القيادة ثلاثة أيام وفي أي مرحلة يختبئ؟',
          note: {
            ar: 'قانون Goodhart جالس في مقعدك: أي مقياس هدف يُلعَب — واللعبة الوحيدة التي تفوز بها فعلًا هي تحسين النظام كله: تغييرات أصغر وخطوط أقوى وتعافٍ مُتدرَّب. راجع الأرقام في الاستعراض واصرح أسئلة، لا جوائز.',
            en: 'Goodhart sits in your retrospective: any metric turned into a target gets played — and the only winning move is improving the whole system: smaller changes, stronger pipelines, rehearsed recovery. Review the numbers as questions at your retro, not as prizes.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'عائلات الماسحات تكمّل بعضها: SAST يقرأ الشيفرة، وDAST يهاجم الواجب، وSCA يفحص الاعتماديات، وقارض الأسرار يمنع التسريب — وكلها تعمل عند أقدم نقطة تعطي جوابًا صحيحًا: التزام، بناء، جدول دوري، نشر تجريبي.', en: 'The scanner families complement each other: SAST reads source, DAST attacks the running app, SCA checks dependencies, secrets scanning blocks leaks — each at the earliest point it gives a correct answer: commit, build, a schedule, staging.' },
        { ar: 'مفاتيح DORA الخمسة نتائج لا أنشطة: زمن القيادة والتكرار وزمن التعافي (إنتاجية) مقابل معدل الفشل وإعادة العمل (عدم استقرار) — والمقارنة بين المجموعتين هي ما يقاوم الغش.', en: 'The five DORA keys are outcomes, not activities: lead time, frequency, recovery time (throughput) versus fail rate and rework rate (instability) — the pairing between the groups is what resists gaming.' },
        { ar: 'السرعة والاستقرار مرتبطان إيجابًا: التكرار يفرض صغَر التغيير فيسهل فحصه ونسبته وتراجعه — واحسب مقاييسك من سجل منضبط: متوسط/وسيط زمن القيادة، فشل مقسوم على نشرات، تعافٍ من الملاحظة إلى الاستعادة.', en: 'Speed and stability correlate positively: frequency forces small changes that are easier to review, attribute, and undo — compute your metrics from a disciplined log: mean/median lead time, failures over deploys, recovery from notice to restore.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وعلّم نشرتين من اثنتين failed فشاهد CFR يقفز إلى 1.0. اسأل نفسك: لو بدأت تُسجّل نشراتك من غد — أي عمودين ستكتبهما أولًا في السجل، وأي مقياس من الخمسة ستكون أثقل ما تُظهره أرقامك اليوم، وما أول سؤال GQM ستطرحه عنه؟',
        en: 'Open the sandbox, mark both deployments failed, and watch CFR jump to 1.0. Ask yourself: if you started logging your deployments tomorrow — which two columns would you write first, which of the five metrics would your current numbers wear heaviest, and what would your first GQM question about it be?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch14.s6', pages: 'ص397-398 / pp.397-398' },
        { book: 'SWE', section: 'swe.ch14.s7', pages: 'ص398-400 / pp.398-400' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch14.s6', pages: 'ص397-398 / pp.397-398' },
    { book: 'SWE', section: 'swe.ch14.s7', pages: 'ص398-400 / pp.398-400' },
  ],
} satisfies Lesson;

export default lesson;
