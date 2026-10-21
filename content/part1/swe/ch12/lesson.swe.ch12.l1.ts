import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch12.l1 — "Meaningful Metrics and Software Quality
 * مقاييس ذات معنى وجودة البرمجيات"
 * Aligned with SWE ch12 s1 (12.1 Meaningful Metrics, pp.315-316) +
 * s2 (12.2 Software Quality, pp.317-318).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * RUNNABLE-STATS design: no plotting and no numeric stack — every runnable
 * field builds metrics from a fixed dict of defect counts per release with
 * plain loops and %-formatting. Deterministic only: no interactive reads, no
 * exit, no seeding of any kind.
 */
const lesson = {
  id: 'swe.ch12.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 12,
  title: { ar: 'مقاييس ذات معنى وجودة البرمجيات', en: 'Meaningful Metrics and Software Quality' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch11.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل الفصول السابقة طلب منك أن تفعل شيئًا بإتقان: استخرج المتطلبات، صمّم للتغيير، راجع الكود، اختبر بعمق، أمّن الثغرات. هذا الفصل يسأل سؤالًا مختلفًا: من أين تعرف أن ذلك نجح؟ الآراء عن الجودة رخيصة ومتناقضة — «أشعر أن الإصدار صار أفضل» لا تساوي شيئًا أمام «كفاءة إزالة العيوب ارتفعت من 84% إلى 91%، وهذا فاصل الثقة». القياس هو كيف نرى ما لا يُرى: لا يمكنك الإمساك بـ«قابلية الصيانة» بيدك ولا الإشارة إلى سنتيمتر مكعب من «الموثوقية» — المقياس قاعدة تُسند رقمًا إلى خاصية بحيث يحفظ شيئًا صادقًا عن العالم. لكن الأرقام سلاح ذو حدين: مقياس سيئ سيُحسَّن على حساب الغاية نفسها. لذا هذا الفصل بقدر ما يحسب، يعلّم التواضع: أرقامًا من قاموس إصدارات ثابت نحمله من أول درس إلى آخره. بنهاية الدرس ستكون قادرًا على: تفرقة الكيان والخاصية والمقياس، والحكم على صلاحية مقياس وموثوقيته، وترتيب GQM من الهدف إلى السؤال إلى الرقم، وتسمية أوجه الجودة المتعددة بدل «درجة جودة» واحدة.',
        en: 'Every earlier chapter asked you to do something well: elicit requirements, design for change, review code, test thoroughly, secure it. This chapter asks a different question: how do you know whether it worked? Opinions about quality are cheap and contradictory — \u201cI feel the build got better\u201d is worth nothing next to \u201cdefect-removal efficiency rose from 84% to 91%, and here is the confidence interval.\u201d Measurement is how we see the invisible: you cannot hold \u201cmaintainability\u201d in your hand or point at a cubic centimeter of \u201creliability\u201d — a metric is a rule that assigns a number to an attribute so the assignment preserves something true about the world. But numbers cut both ways: a badly chosen metric will be optimized at the expense of the very goal. So this chapter computes and teaches humility in equal measure — anchored to one fixed dict of releases we carry from lesson one to the last. By the end you will be able to: distinguish entity, attribute and metric, judge a metric\u2019s validity and reliability, order GQM from goal to question to metric, and name the many forms of quality instead of one score.',
      },
    },
    {
      kind: 'predict',
      code: "defects = [1, 2, 3, 4, 20]\nprint('mean: %.1f' % (sum(defects) / len(defects)))\nprint('median: %.1f' % sorted(defects)[2])",
      question: {
        ar: 'رقمان من القائمة نفسها: 6.0 و3.0. أيهما سترفع إلى الإدارة لوصف «إصدار نمطي»، ولماذا يختلفان إلى هذا الحد؟ وماذا يخفي كل منهما؟',
        en: 'Two numbers from the same list: 6.0 and 3.0. Which would you report to management as a \u201ctypical release\u201d, why do they differ so much, and what does each one hide?',
      },
      reveal: {
        ar: 'الطباعة: mean: 6.0 ثم median: 3.0. القيمة 20 الشاذة سحبت المتوسط إلى ضعف الوسيط تقريبًا — والوسيط بقي ثابتًا لأنه لا يهتم بحجم الذيل. ولا يظهر الرقمان التشتت أصلًا: القفزة من 1 إلى 20 هي القصة الحقيقية. هذا موضوع الفصل كله: رقم واحد يخفي، والمقياس الجيد يُحار بهيئة تُظهر الشكل — وسنقيس لاحقًا بالصناديق والتباين وفواصل الثقة.',
        en: 'It prints mean: 6.0 then median: 3.0. The outlier 20 dragged the mean to nearly twice the median — the median stayed put because it ignores tail size. And neither number shows dispersion at all: the swing from 1 to 20 is the real story. That is this whole chapter: a single number hides, and a good metric is reported in a shape that reveals — later we measure with boxplots, variance and confidence intervals.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الكيان والخاصية والمقياس: أرقام تمثل الواقع', en: 'Entity, attribute, metric: numbers that represent reality' },
      chunks: [
        {
          ar: 'ثلاثة كيانات نظرية القياس تطلب منك عدم خلطها أبدًا: الكيان entity — الشيء المقاس (ملف، إصدار، جلسة مراجعة)؛ والخاصية attribute — الخاصية المحددة التي تهمّنا (حجمه، عدد عيوبه)؛ والمقياس metric — القاعدة التي تحوّل الخاصية إلى قيمة (أسطر الكود، عيوب لكل ألف سطر). الكيان الواحد له خصائص كثيرة، والخاصية الواحدة تقبل مقاييس كثيرة: «الحجم» وحده يقاس بالبايت أو الأسطر أو العبارات أو الرموز. أصل معظم هراء القياس هو الخلط بينها: «الملف 400» بلا معنى حتى تقول 400 ماذا، تقيس أي خاصية.',
          en: 'Measurement theory names three entities you must never blur: the entity — the thing being measured (a file, a release, a review session); the attribute — the specific property of interest (its size, its defect count); and the metric — the rule mapping the attribute to a value (lines of code, defects per KLOC). One entity has many attributes, and one attribute admits many metrics: \u201csize\u201d alone can be bytes, lines, statements or tokens. Confusing them is the root of most measurement nonsense: \u201cthe file is 400\u201d is meaningless until you say 400 what, of which attribute.',
        },
        {
          ar: 'التعريف الجامع: المقياس صالح valid إذا تحرك بالاتجاه نفسه الذي تتحرك به الخاصية — إن كان الملف A أعقد فعلًا من B فيجب أن يعطيه رقمًا أكبر؛ وهو موثوق reliable إذا أعاد تكرار القياس القيمة نفسها. المقياس قد يكون موثوقًا وغير صالح: عدّ الأسطر يكرر بدقة مذهلة، ومع ذلك مقياس فقير لإنتاجية المبرمج. حين تتوقف الأرقام عن تتبع الواقع فالمقياس قد فشل مهما حُسب بعناية.',
          en: 'The compact definitions: a metric is valid if entities differing in the attribute differ in the metric in the same direction — if file A really is more complex than B, a valid complexity metric must give A the larger number; and reliable if repeating the measurement yields the same value. A metric can be reliable yet invalid: counting lines repeats beautifully and still measures programmer productivity poorly. When numbers stop tracking reality, the metric has failed no matter how carefully it was computed.',
        },
        {
          ar: 'ولأن كل شيء تقريبًا قابل للقياس، الفرق المفيد يجتاز أربعة اختبارات معًا: ذو صلة relevant — يتحرك حين تتحرك الخاصية التي تهمك (عدّ التعليقات لا يتتبع جودة الكود)؛ وقابل للتنفيذ actionable — حين يسوء الرقم تعرف ماذا تفعل؛ ورخيص كفاية — كلفة جمعه أقل من قيمة القرار الذي يخدمه؛ ومقاوم للتلاعب robust — لأن قانون Goodhart يقول: حين يصير المقياس هدفًا للحوافز يبدأ الناس بتحسين الرقم على حساب الغاية. افعلها وأنشئ لكل مقياس مقياسًا مضادًا يكشف الغش: «التذاكر المغلقة» مع «التذاكر المعاد فتحها».',
          en: 'Since almost anything can be measured, a useful metric passes four tests at once: relevant — it moves when the attribute you care about moves (comment counts do not track code quality); actionable — when the number is bad you know what to do; cheap enough — collection cost is small next to the decision it informs; and robust against gaming — because Goodhart\u2019s law says: the moment a metric becomes an incentive target, people optimize the number at the goal\u2019s expense. Counter it: pair every metric with a counter-metric that would degrade if someone cheated — \u201ctickets closed\u201d with \u201ctickets reopened\u201d.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: '«الجودة» ليست شيئًا واحدًا، وGQM يعطي الاتجاه', en: 'Quality is not one thing, and GQM gives the direction' },
      chunks: [
        {
          ar: 'جدال «الجودة» غالبًا أشخاص يتكلمون عن أشياء مختلفة باسم واحد. سمِّها صراحة: الجودة الوظيفية functional — هل يفعل البرنامج ما يجب، صحيحًا؟ والجودة الإجرائية process — هل طريقة بنائه قابلة للتكرار والتحسين، أم أن فريقًا ينجح بالأبطال سيقلب ربعًا قادمًا عملة؟ وجودة المنتج product — الصحة البنيوية الداخلية: قراءة، نمطية، اقتران منخفض، تغطية اختبار؛ لا يراها المستخدم لكنها تحكم كلفة التغيير. والجودة التشغيلية operational — سلوك النظام في الإنتاج: الإتاحة، زمن الاستجابة، الاسترجاع. وأخيرًا رضا العملاء — الصورة التي تدفع الفواتير، وترتبط بأخواتها ارتباطًا ضعيفًا: العملاء قد يعشقوا برنامجًا معيبًا يحل مشكلتهم. المعيار ISO/IEC 25010 ينظّم جودة المنتج في تسع خصائص — والعادة الأهم من الحفظ: قبل أن تقيس الجودة، قل أي جودة.',
          en: 'Arguments about \u201cquality\u201d are usually people meaning different things by one word. Name it explicitly: functional quality — does the software do what it is supposed to, correctly? Process quality — is the way it is built repeatable and improving, or is a team that ships by heroics next quarter\u2019s coin flip? Product quality — internal structural health: readability, modularity, low coupling, test coverage; invisible to users, governing the cost of change. Operational quality — production behavior: availability, latency, recoverability. And customer satisfaction — the form that pays the bills, only loosely correlated with the others: users can love buggy software that solves their problem. ISO/IEC 25010 organizes product quality into nine characteristics — and the habit matters more than memorizing: before you measure quality, say which quality.',
        },
        {
          ar: 'والتوجيه من الأعلى طريقة GQM (Goal-Question-Metric) لباسيلي: الهدف هدفًا عملًا/هندسيًا محدثًا بالغرض والبؤرة والوجهة والسياق («حسّن موثوقية خدمة الشراء من وجهة نظر العميل في الإنتاج»)؛ ثم سؤال محدد تجيب إجابته هل نحقق الهدف («هل يصيب العملاء أعطالًا أقل من الربع الماضي؟»)؛ ثم مقياس يملك البيانات («عيوب يكتشفها العميل لكل ألف تنصيب، شهريًا»). البدء من المقياس يغرقك في أربعين رقمًا لا تعني شيئًا؛ البدء من الهدف يجعل كل رقم يستحق مكانه بإجابة سؤال سألته فعلًا. والمقياس الذي لا يجيب سؤالًا حيًا احذفه: يكلف جمعًا ويدعو للتلاعب. مقاييس الدعم القياسية — حجم التذاكر وزمن أول استجابة والحل والتراكم وإعادة الفتح وCSAT/NPS — تسافر جميعًا كحزمة: كل واحد منها يخدع وحده.',
          en: 'And the top-down discipline is Basili\u2019s GQM (Goal-Question-Metric): a goal stated with purpose, focus, viewpoint and context (\u201cimprove the reliability of the checkout service from the customer\u2019s viewpoint in production\u201d); a concrete question whose answer tells you whether you are meeting it (\u201cAre customers hitting fewer failures than last quarter?\u201d); a metric supplying the data (\u201ccustomer-found defects per 1,000 active installs, monthly\u201d). Starting from the metric drowns you in forty numbers meaning nothing; starting from the goal makes every dashboard number earn its place by answering a question you actually asked. A metric answering no live question: delete it — it costs collection and tempts gaming. Standard support metrics — ticket volume, time to first response and resolution, backlog, reopen rate, CSAT/NPS — travel as a pack: any one of them alone misleads.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مقاييس من قاموس إصدارات: المتوسط والأسوأ والمضاعف', en: 'Metrics from a releases dict: mean, worst and a multiple' },
      code: "releases = {'r1': 2, 'r2': 4, 'r3': 5, 'r4': 5, 'r5': 7, 'r6': 8,\n            'r7': 9, 'r8': 10, 'r9': 12, 'r10': 14, 'r11': 23}\ntotal = sum(releases.values())\nmean = total / len(releases)\nworst = 'r1'\nfor k in releases:\n    if releases[k] > releases[worst]:\n        worst = k\nprint('total: %d' % total)\nprint('mean: %.1f' % mean)\nprint('worst: %s (%d)' % (worst, releases[worst]))\nprint('worst is %.1f x the mean' % (releases[worst] / mean))",
      explanation: {
        ar: 'هذا قاموس الكيان→الخاصية الذي سيصحبنا الفصل كله: أحد عشر إصدارًا (الكيان) وعدد عيوبها التي وجدها العملاء (الخاصية). أربع قراءات في أربعة أسطر: المجموع 99، والمتوسط 9.0 (عملية قسمة حقيقية لا صحيحة)، والأسوأ r7؟ لا — r11 بـ23 عيبًا، ثم المضاعف 2.6: الأسوأ يقارب ثلاثة أضعاف المتوسط. المضاعف نفسه مقياس ratio مسموح لأن عدّ العيوب مقياس نسبي zero حقيقي — «ضعف العيوب» معنى له. لاحظ ما لا يظهر: التشتت. أحد عشر رقمًا انهارت في رقم واحد، والإصدار الشاذ 23 اختفى في المتوسط — الدرس الرابع سيرجعه بصريًا.',
        en: 'This is the entity→attribute dict that carries the whole chapter: eleven releases (entities) and their customer-found defect counts (the attribute). Four readings in four lines: total 99, mean 9.0 (a true float division, not integer), the worst release r11 with 23 defects, and the multiple 2.6 — the worst release is nearly three times the mean. The multiple itself is a legal ratio metric because defect counts are ratio-scaled with a true zero — \u201ctwice the defects\u201d means something. Notice what is missing: dispersion. Eleven numbers collapsed into one, and the outlier 23 vanished inside the mean — lesson four will make it visible again.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.metric-reading',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. مراجعة سريعة لقواميس PY4E: len على القاموس يعدّ المفاتيح، وsum على values يجمع القيم.',
        en: 'Read the code and predict its exact output — one line per print — without running it. A quick PY4E-dicts refresher: len over a dict counts keys, and sum over values adds them.',
      },
      code: "releases = {'r1': 4, 'r2': 8, 'r3': 12}\ntotal = sum(releases.values())\nprint('releases: %d' % len(releases))\nprint('total: %d' % total)\nprint('mean: %.1f' % (total / len(releases)))",
      solution: 'releases: 3\ntotal: 24\nmean: 8.0',
      answer: 'releases: 3\ntotal: 24\nmean: 8.0',
      hints: [
        { ar: 'القاموس فيه ثلاثة مفاتيح: len(releases) تساوي 3 — القواميس تُعدّ بالمفاتيح لا بالقيم.', en: 'The dict has three keys: len(releases) is 3 — dicts count keys, not values.' },
        { ar: 'sum(releases.values()) يجمع 4 + 8 + 12 = 24 — القيم فقط تدخل الجمع.', en: 'sum(releases.values()) adds 4 + 8 + 12 = 24 — only the values enter the sum.' },
        { ar: 'المتوسط قسمة حقيقية: 24 / 3 = 8.0، و%.1f تعرض منزلة عشرية واحدة فتظهر 8.0 لا 8.', en: 'The mean is a true division: 24 / 3 = 8.0, and %.1f shows one decimal — 8.0, not 8.' },
        { ar: 'الخرج:\nreleases: 3\ntotal: 24\nmean: 8.0', en: 'The output:\nreleases: 3\ntotal: 24\nmean: 8.0' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.share-metric',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ثلاثة إصدارات بأعداد عيوب: r1=5 وr2=10 وr3=25 (قاموس releases جاهز). اطبع أربعة أسطر بهذه الصيغ حرفيًا: total: %d ثم mean: %.1f ثم max: %s (%d) باسم المفتاح الأكبر وقيمته، ثم r3 share: %.1f%% — نصيب r3 من مجموع العيوب نسبةً (25 من 40). المتوقع: total: 40 / mean: 13.3 / max: r3 (25) / r3 share: 62.5%.',
        en: 'Three releases with defect counts: r1=5, r2=10, r3=25 (the releases dict is given). Print exactly four lines: total: %d, then mean: %.1f, then max: %s (%d) with the biggest key and its value, then r3 share: %.1f%% — r3\u2019s share of total defects as a percentage (25 of 40). Expected: total: 40 / mean: 13.3 / max: r3 (25) / r3 share: 62.5%.',
      },
      starterCode: "releases = {'r1': 5, 'r2': 10, 'r3': 25}\n\n# المجموع والمتوسط (قسمة حقيقية)\n# total and mean (true division)\n\n# المفتاح ذو القيمة الأكبر بحلقة (لا max() هنا)\n# the biggest key with a loop (no max() here)\n\n# الأسطر الأربعة المطلوبة\n# the four required lines\n",
      solution: "releases = {'r1': 5, 'r2': 10, 'r3': 25}\ntotal = sum(releases.values())\nmean = total / len(releases)\nmx = ''\nfor k in releases:\n    if mx == '' or releases[k] > releases[mx]:\n        mx = k\nprint('total: %d' % total)\nprint('mean: %.1f' % mean)\nprint('max: %s (%d)' % (mx, releases[mx]))\nprint('r3 share: %.1f%%' % (100.0 * releases['r3'] / total))",
      tests: [
        {
          id: 't1',
          name: { ar: 'المجموع والمتوسط صحيحان', en: 'Total and mean are correct' },
          code: "assert 'total: 40' in __learner_output__ and 'mean: 13.3' in __learner_output__, 'expected: total: 40 then mean: 13.3 | actual: %r' % __learner_output__",
          expected: 'total: 40 then mean: 13.3',
        },
        {
          id: 't2',
          name: { ar: 'الأكبر ونصيب r3 مطبوعان', en: 'Max and the r3 share are printed' },
          code: "assert 'max: r3 (25)' in __learner_output__ and 'r3 share: 62.5%' in __learner_output__, 'expected: max: r3 (25) then r3 share: 62.5% | actual: %r' % __learner_output__",
          expected: 'max: r3 (25) then r3 share: 62.5%',
        },
        {
          id: 't3',
          name: { ar: 'المتوسط قيمة حقيقية لا صحيحة', en: 'The mean is a float, not a truncation' },
          code: "assert abs(mean - 40 / 3) < 1e-9, 'expected: mean == 40/3 (13.333...) | actual: %r' % (mean,)",
          expected: 'mean == 40/3 (13.333...)',
        },
        {
          id: 't4',
          name: { ar: 'النسبة والمفتاح الأكبر محسوبان بدقة', en: 'Share and max computed exactly' },
          code: "assert abs(100.0 * releases['r3'] / total - 62.5) < 1e-9 and mx == 'r3', 'expected: 62.5 and r3 | actual: %r' % ((100.0 * releases['r3'] / total, mx),)",
          expected: '62.5 and r3',
        },
      ],
      hints: [
        { ar: 'المجموع والمتوسط نمط الدرس الشارح: sum(releases.values()) ثم القسمة على len(releases) — قسمة / حقيقية فتظهر 13.3 مع %.1f.', en: 'Total and mean follow the worked example: sum(releases.values()) divided by len(releases) — true / division shows 13.3 with %.1f.' },
        { ar: 'المفتاح الأكبر بحلقة مثل worked: متغير mx يبدأ فارغًا، وكل مفتاح يقارن قيمته بقيمة mx الحالي.', en: 'The biggest key uses the worked loop pattern: an mx variable starts empty, and each key compares its value against the current mx.' },
        { ar: 'النسبة: 100.0 * releases[\'r3\'] / total — اضرب في 100 قبل القسمة أو بعدها، و %% داخل سلسلة التنسيق تطبع علامة % واحدة.', en: "The share: 100.0 * releases['r3'] / total — and %% inside a format string prints one % sign." },
        { ar: 'الهيكل:\ntotal = sum(releases.values())\nmean = total / len(releases)\nmx = \'\'\nfor k in releases:\n    if mx == \'\' or releases[k] > releases[mx]:\n        mx = k\nprint(\'total: %d\' % total)\nprint(\'mean: %.1f\' % mean)\nprint(\'max: %s (%d)\' % (mx, releases[mx]))\nprint(\'r3 share: %.1f%%\' % (100.0 * releases[\'r3\'] / total))', en: "The skeleton:\ntotal = sum(releases.values())\nmean = total / len(releases)\nmx = ''\nfor k in releases:\n    if mx == '' or releases[k] > releases[mx]:\n        mx = k\nprint('total: %d' % total)\nprint('mean: %.1f' % mean)\nprint('max: %s (%d)' % (mx, releases[mx]))\nprint('r3 share: %.1f%%' % (100.0 * releases['r3'] / total))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.goodhart',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أعلنت إدارة مكافأة شهرية لكل عيب يُبلّغ عنه المختبر. بعد ربعين تضاعفت التقارير لكن زبائر الإنتاج يشتكون أكثر. بضوء Goodhart، أي تفسير وتصحيح يطابق درس اليوم؟',
        en: 'Management announced a monthly bonus per defect the test team files. Two quarters later report counts doubled, yet production customers complain more. In Goodhart\u2019s terms, which explanation and fix matches today\u2019s lesson?',
      },
      options: [
        { id: 'a', text: { ar: 'المختبر صار أذكى في الاصطياد — ضاعف المكافأة', en: 'The testers got better at hunting — double the bonus' } },
        { id: 'b', text: { ar: 'المقياس صار هدفًا فغرق في بلاغات تافهة منخفضة الخطورة — اربطه بمقياس مضاد مثل نسبة العيوب التي تصل العملاء أو تُعاد فتحها', en: 'The metric became a target and flooded with trivial low-severity filings — pair it with a counter-metric such as the escape rate or reopen rate' } },
        { id: 'c', text: { ar: 'الحوافز لا تؤثر على القياس — المشكلة في الأداة المستعملة للبلاغ', en: 'Incentives do not affect measurement — the problem is the reporting tool' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'قانون Goodhart: حين يصير المقياس هدفًا يُحسَّن الرقم نفسه لا الواقع الذي يقيسه — «عدد العيوب المبلغة» يقاس الجهد لا الأمان.', en: 'Goodhart\u2019s law: when a measure becomes a target, the number is optimized instead of the reality — \u201cbugs filed\u201d measures effort, not safety.' },
        { ar: 'بلاغ تافه يرفع الرقم بلا أثر على جودة الإصدار — وهذا بالضبط «التلاعب» الذي وعدت به الحوافز.', en: 'A trivial filing raises the number with zero effect on the release\u2019s quality — exactly the gaming the bonus invited.' },
        { ar: 'المضاد يقاس بالاتجاه المعاكس فيكشف اللعب: معدل الإفلات D_after يقيس ما وصل العملاء فعلًا، وإعادة الفتح تكشف الإغلاقات المتسرعة.', en: 'A counter-metric moves opposite to the gamed one and exposes the cheat: escape rate (D_after) measures what actually reached customers; reopen rate exposes rushed closures.' },
        { ar: 'الجواب: b — pair \u201cbugs filed\u201d with escape/reopen so gaming one degrades the other.', en: 'Answer: b — pair \u201cbugs filed\u201d with escape/reopen so gaming one degrades the other.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.gqm-order',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'في طريقة GQM يولّد الهدف سؤالًا، والسؤال يولّد ____. (كلمة إنجليزية واحدة)',
        en: 'In GQM, the goal generates a question, and the question generates a ____. (one English word)',
      },
      answer: 'Metric',
      solution: 'Metric',
      hints: [
        { ar: 'الاختصار نفسه يحفظ الترتيب: Goal ثم Question ثم الحرف الثالث.', en: 'The acronym itself stores the order: G, Q, then the third letter.' },
        { ar: 'هو الرقم الذي يجيب السؤال — والبدء منه لا من الهدف هو الخطأ الذي يحذر منه الدرس.', en: 'It is the number that answers the question — starting from it instead of the goal is the trap the lesson warns about.' },
        { ar: 'الرسم: Goal ← Question ← هذا — وكل رقم في اللوحة يستحق مكانه بإجابة سؤال سُئل فعلًا.', en: 'The chain: Goal → Question → this — every dashboard number earns its place by answering an actually-asked question.' },
        { ar: 'الجواب: Metric', en: 'Answer: Metric' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "releases = {'r1': 2, 'r2': 4, 'r3': 5, 'r4': 5, 'r5': 7, 'r6': 8,\n            'r7': 9, 'r8': 10, 'r9': 12, 'r10': 14, 'r11': 23}\n\ntotal = sum(releases.values())\nmean = total / len(releases)\nprint('total: %d' % total)\nprint('mean: %.1f' % mean)\n\nfor k in releases:\n    print('%s share: %.1f%%' % (k, 100.0 * releases[k] / total))\n\n# جرّب: أي إصدار يأكل النصيب الأكبر؟ كم مرة ضعف متوسطه؟\n# try: which release eats the biggest share? how many times the mean is it?\n# جرّب: احذف r11 من القاموس وأعد الحساب — كم ينزاح المتوسط؟ أي رقم مات؟\n# try: delete r11 from the dict and recompute — how far does the mean slide? which reading dies?\n# جرّب: أضف مقياسًا مضادًا — لو كان قياسنا «أسوأ إصدار» فما الذي يكشف أنه تلاعب؟\n# try: add a counter-metric — if our metric were \u201cworst release\u201d, what would expose gaming of it?",
      prompt: {
        ar: 'الملعب قاموس الفصل كله: احسب نصيب كل إصدار من مجموع العيوب، ثم احذف الإصدار الشاذ وراقب المتوسط ينزاح — هكذا تحسّ بيدك أن الرقم الواحد هشّ. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox holds the chapter\u2019s dict: compute each release\u2019s share of total defects, then delete the outlier and watch the mean slide — that is what fragility of a single number feels like. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن PY4E الفصل التاسع: القاموس يخزن أزواج مفتاح/قيمة. في درس اليوم حمل releases = {\'r1\': 2, ...} مجموعة بياناتنا كاملة. لماذا كان القاموس البنية الطبيعية هنا؟',
            en: 'From PY4E chapter 9: a dict stores key/value pairs. In today\u2019s lesson releases = {\'r1\': 2, ...} carried our whole dataset. Why is the dict the natural structure here?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن القواميس ترتب نفسها تصاعديًا تلقائيًا', en: 'Because dicts sort themselves ascending automatically' } },
            { id: 'b', text: { ar: 'لأن كل كيان (إصدار) مفتاح يطابق قيمة القياس — الوصول بالاسم يطابق فكرة «كيان ثم خاصية»', en: 'Because each entity (release) is a key mapping to its measured value — access by name mirrors \u201centity, then attribute\u201d' } },
            { id: 'c', text: { ar: 'لأن القواميس أسرع من القوائم في الضرب والقسمة', en: 'Because dicts are faster than lists at multiplication and division' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'القاموس يجسد جدول الكيان→الخاصية حرفيًا: المفتاح هو الكيان r1 والقيمة هي قراءة الخاصية (العيوب). الترتيب ليس من صفات القاموس — ولا نحتاجه هنا؛ وما زلنا نحسب المجموع بـ sum(values()) كما في الفصل التاسع.',
            en: 'The dict literally embodies the entity→attribute table: the key is the entity r1, the value is the attribute reading (defects). Ordering is not a dict property — we do not need it here; and we still total with sum(values()) as in chapter nine.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'عدّاد أسطر الكود يعطي الرقم نفسه عند كل تشغيل، لكنه مقياس سيئ لإنتاجية المبرمج. هذا مثال على مقياس:',
            en: 'A lines-of-code counter returns the same number on every run, yet it measures programmer productivity poorly. This is a metric that is:',
          },
          options: [
            { id: 'a', text: { ar: 'صالحًا وغير موثوق', en: 'valid but unreliable' } },
            { id: 'b', text: { ar: 'موثوقًا لكنه غير صالح — التكرار يعطي القيمة نفسها، لكن الرقم لا يمثل الإنتاجية', en: 'reliable but invalid — repetition gives the same value, yet the number does not represent productivity' } },
            { id: 'c', text: { ar: 'صالحًا وموثوقًا — والعيب في من يقرأه', en: 'valid and reliable — the fault is in the reader' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الموثوقية شرط لازم غير كافٍ: تكرار القراءة يعني استقرار العدّة لا صدقها. الصلاحية تطلب اتجاهًا يطابق الواقع — والمزيد من الأسطر غالبًا يعني تكرارًا وتضخيمًا لا إنتاجية، فالاتجاه معكوس.',
            en: 'Reliability is necessary but not sufficient: repeatable readings mean a stable instrument, not a truthful one. Validity demands the direction match reality — more lines usually means duplication and padding, not productivity, so the direction is inverted.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'فريق يبدأ بلوحة قياس فيها 40 رقمًا ثم يسأل: «ما معنى هذه؟». أي خطأ GQM ارتكبه؟',
            en: 'A team starts from a 40-number dashboard and then asks: \u201cwhat do these mean?\u201d. Which GQM mistake is this?',
          },
          options: [
            { id: 'a', text: { ar: 'بدأ من المقياس لا من الهدف — فصار لكل رقم سؤال ميت أو لا سؤال', en: 'It started from the metric, not the goal — so each number has a dead question or none' } },
            { id: 'b', text: { ar: 'لا خطأ — 40 رقمًا أفضل من 4', en: 'No mistake — 40 numbers beat 4' } },
            { id: 'c', text: { ar: 'الخطأ أنه لم يستعمل ISO 25010 لتسمية الخصائص', en: 'The mistake is not using ISO 25010 to name the attributes' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'GQM اتجاه واحد: هدف ← سؤال ← مقياس. البدء من الأرقام يغرقك في بيانات تتصرف بلا شيء — والقاعدة الصارمة: مقياس لا يجيب سؤالًا حيًا يُحذف، لأنه يكلف جمعًا ويدعو للتلاعب.',
            en: 'GQM runs one way: goal → question → metric. Starting from numbers drowns you in data that drives no action — and the strict rule: a metric answering no live question is deleted, since it costs collection and tempts gaming.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي «أوجه الجودة» من درس اليوم يقيس «إتاحة الخدمة وزمن الاستجابة في الإنتاج»؟',
            en: 'Which form of quality from today\u2019s lesson covers \u201cservice availability and latency in production\u201d?',
          },
          options: [
            { id: 'a', text: { ar: 'الجودة الوظيفية functional', en: 'functional quality' } },
            { id: 'b', text: { ar: 'جودة المنتج product — هي التي يراها المستخدم', en: 'product quality — the kind users see' } },
            { id: 'c', text: { ar: 'الجودة التشغيلية operational', en: 'operational quality' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'التشغيلية هي سلوك النظام حيًّا في الإنتاج: إتاحة، زمن استجابة، استهلاك موارد، استرجاع. الوظيفية تتسائل «هل يفعل ما يجب؟»، وجودة المنتج بنيوية داخلية لا يراها المستخدم أصلًا — خدمة كاملة الميزات ساقطة ساعتين أسبوعيًا جودتها التشغيلية سيئة.',
            en: 'Operational quality is the system\u2019s live behavior in production: availability, latency, resource use, recoverability. Functional asks \u201cdoes it do what it should?\u201d; product quality is internal structure users never see — a feature-complete service down two hours a week has poor operational quality.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: '«الرقم مأخوذ آليًا فهو موضوعي» — موثوقية العدّة دليل صدقها',
          right: 'افصل السؤالين: هل يكرر القياس قيمته (موثوقية)؟ وهل يمثل الخاصية بالاتجاه الصحيح (صلاحية)؟',
          note: {
            ar: 'عدّ الأسطر يكرر بدقة ويقيس الإنتاجية عكس الصواب. المقياس الفاشل قد يكون أرقى حسابًا — الفشل في التمثيل لا في الطرح. اسأل دائمًا: لو تغيّرت الخاصية في الواقع، هل يتحرك الرقم معها؟',
            en: 'A line counter repeats perfectly and reads productivity backwards. A failed metric can be impeccably computed — failure lives in representation, not arithmetic. Always ask: if the attribute changed in reality, would the number move with it?',
          },
        },
        {
          wrong: 'لوحة فيها 40 رقمًا تعني قياسًا ناضجًا',
          right: 'كل رقم يجب أن يجيب سؤالًا حيًا تحت هدف معلن — وإلا احذفه',
          note: {
            ar: 'GQM اتجاه لا ينعكس: هدف ← سؤال ← مقياس. الرقم اليتيم يكلف جمعًا في كل إصدار، ويدعو أحدهم أن يجعله هدفًا فيلعب به. اللوحة الناضجة قصيرة، وكل سطر فيها يعرف لماذا هو هناك.',
            en: 'GQM runs one way: goal → question → metric. An orphan number costs collection every release and invites someone to make it a target and game it. A mature dashboard is short, and every line on it knows why it is there.',
          },
        },
        {
          wrong: 'مقياس واحد بلا مقياس مضاد يكفي للحكم',
          right: 'اربط كل مقياس بحوافز بمضاد ينحدر إذا لُعب: مغلقة مع معاد فتحها، وعدد مع معدل إفلات',
          note: {
            ar: 'قانون Goodhart ليس استثناء بل القاعدة: أي رقم صار هدفًا سيُحسَّن على حساب الغاية. المضاد يجعل التلاعب مكلفًا — تحسين الرقم الأول يُسوئ الرقم الثاني فيظهر اللعب في الضوء.',
            en: 'Goodhart\u2019s law is the rule, not the exception: any number turned into a target gets optimized at the goal\u2019s expense. The counter-metric makes gaming expensive — improving the first number degrades the second, and the cheat surfaces.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'القياس يسند رقمًا إلى خاصية بحيث يحفظ شيئًا صادقًا عن العالم: كيان (إصدار) + خاصية (عيوبه) + مقياس (القاعدة). المقياس صالح إذا تتبع الواقع بالاتجاه، وموثوق إذا كرر قيمته — والاثنان مختلفان: LOC موثوق وغير صالح.', en: 'Measurement assigns a number to an attribute preserving something true about the world: entity (release) + attribute (its defects) + metric (the rule). Valid tracks reality in direction; reliable repeats its value — and they differ: LOC is reliable and invalid.' },
        { ar: 'المقياس المفيد: ذو صلة، قابل للتنفيذ، رخيص كفاية، ومقاوم للتلاعب — وأي مقياس صار هدف حوافز سيُلعب (Goodhart)، فعايره بمقياس مضاد. GQM يعطي الاتجاه: هدف ← سؤال ← مقياس، وما لا يجيب سؤالًا حيًا يُحذف.', en: 'A useful metric is relevant, actionable, cheap enough and gaming-resistant — and any metric turned into an incentive target gets gamed (Goodhart), so pair it with a counter-metric. GQM gives direction: goal → question → metric; what answers no live question gets deleted.' },
        { ar: '«الجودة» أشكال: وظيفية وإجرائية ومنتج وتشغيلية ورضا عملاء — قبل القياس قل أي جودة ومن وجهة نظر من. ومن قاموس releases حسبنا المجموع 99 والمتوسط 9.0 والأسوأ r11 (23) وهو 2.6 ضعف المتوسط — والمضاعف قانوني لأن العيوب مقياس نسبي بصفر حقيقي.', en: 'Quality has forms: functional, process, product, operational, customer satisfaction — before measuring, say which quality and whose viewpoint. From the releases dict we computed total 99, mean 9.0, worst r11 (23) at 2.6x the mean — a legal ratio metric since defect counts are ratio-scaled with a true zero.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب واحذف r11 ثم أعد الحساب. اسأل نفسك: في فريقك، أي رقم على اللوحة يجيب سؤالًا حيًا فعلًا؟ وأي مقياس منكسب حوافز اليوم سيغرق في التلاعب غدًا — وما المضاد الذي ستربطه به؟',
        en: 'Open the sandbox, delete r11 and recompute. Ask yourself: on your team\u2019s dashboard, which numbers answer a genuinely live question? And which incentive-earning metric will drown in gaming tomorrow — what counter-metric will you pair with it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch12.s1', pages: 'ص315-316 / pp.315-316' },
        { book: 'SWE', section: 'swe.ch12.s2', pages: 'ص317-318 / pp.317-318' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch12.s1', pages: 'ص315-316 / pp.315-316' },
    { book: 'SWE', section: 'swe.ch12.s2', pages: 'ص317-318 / pp.317-318' },
  ],
} satisfies Lesson;

export default lesson;
