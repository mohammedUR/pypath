import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch10.l2 — "Code Coverage: White-Box Testing / تغطية الكود: الاختبار بالصندوق الأبيض"
 * Aligned with SWE ch10 s3 (Code Coverage I: White-Box Testing), book pp.264-267.
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never a
 * verbatim translation.
 * Runnable design: hits/edges counter dicts as manual instrumentation (the book's
 * classify_and_sum tradition), dead-branch discovery via set difference.
 * Deterministic only: no input(), no random, no exit(), no unittest.main.
 */
const lesson = {
  id: 'swe.ch10.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 10,
  title: { ar: 'تغطية الكود: الاختبار بالصندوق الأبيض', en: 'Code Coverage: White-Box Testing' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch10.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الدرس السابق بنيت حزام اختبارات وعرّفت الكفاية بمعيار معدود — فكيف نقيس المعدود نفسه؟ الصندوق الأبيض يفتح الكود ويختار المدخلات من بنية الدالة لا من خيالنا: نرسم الدالة رسمًا موجّهًا فتتحول الجمل والقرارات والمسارات إلى عقد وحروف معدودة، ثم نسمّي معيارًا — تغطية الجمل أم تغطية القرارات — ونحسب الكسر المغطى. اليوم سترى لماذا تفشل «اختبرت كل الجمل» أمام حافة لم تؤخذ يومًا، وكيف تكشف البروبات فرعًا لم يعمل تحت أي اختبار، ولماذا تجعل الحلقة تغطية المسارات مستحيلة عمليًّا مع بقاء عدد الحواف منتهيًا. بنهاية الدرس ستكون قادرًا على: قياس تغطية الجمل والقرارات ببروبات يدوية، وترتيب المعايير statement وbranch وpath بالقوة، وحساب التعقيد الدوراني، وكتابة الاختبار الناقص الذي يصل التغطية إلى 100%.',
        en: 'Last lesson built a test harness and defined adequacy as a countable criterion — so how do we measure the count? White-box testing opens the code and picks inputs from the function\u2019s structure rather than intuition: draw the function as a graph and statements, decisions and paths become countable nodes and edges; then name a criterion — statement or branch coverage — and compute the covered fraction. Today you will see why covering every statement still loses to a never-taken edge, how probes expose a branch that never ran under any test, and why a loop makes full path coverage practically impossible while edges stay finite. By the end of this lesson you will be able to: measure statement and branch coverage with manual probes, rank the statement, branch and path criteria by strength, compute cyclomatic complexity, and write the one missing test that lifts coverage to 100%.',
      },
    },
    {
      kind: 'predict',
      code: "edges = []\n\ndef pick(n):\n    if n % 2 == 0:\n        edges.append('even')\n    else:\n        edges.append('odd')\n\nfor n in [2, 7, 0, 9]:\n    pick(n)\n\nprint(edges)",
      question: {
        ar: 'أربع استدعاءات على دالة بقرار واحد: أي حافة تأخذها كل قيمة، وماذا يطبع السطر الأخير؟ انتبه لقيمة يخطئ فيها الكثيرون.',
        en: 'Four calls to a one-decision function: which edge does each value take, and what does the last line print? Watch out for one value most people get wrong.',
      },
      reveal: {
        ar: "الخرج: ['even', 'odd', 'even', 'odd']. الفخ هو 0: لأن 0 % 2 == 0 صادق، فالصفر زوجي ويأخذ حافة even — الحافة لا ترى «حجم» المدخل بل نتيجة الشرط فقط. هذا بالضبط ما ستقيسه اليوم: لكل مدخل، أي حافة أُخذت — ومجموع الحواف المأخوذة هو تغطية القرارات.",
        en: "The output: ['even', 'odd', 'even', 'odd']. The trap is 0: since 0 % 2 == 0 is true, zero is even and takes the even edge — an edge sees the condition result, never the magnitude of the input. That is exactly what you will measure today: for each input, which edge was taken — and the count of taken edges is branch coverage.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الرسم قبل العدّ: control-flow graph', en: 'Draw before you count: the control-flow graph' },
      chunks: [
        {
          ar: 'الصندوق الأبيض يختار المدخلات بالنظر إلى بنية الكود، ولكي نتحدث عن البنية بدقة ننمذج الدالة كرسم موجّه CFG: العقد كتل مستقيمة من الجمل بلا تفرّع، والحروف انتقالات التحكم بينها. القرار — if أو شرط حلقة — عقدة بحرفين صادرين: صادق وكاذب؛ والدمج عقدة بحرفين واردين. بهذا تصبح الألفاظ الغامضة «جملة» و«فرع» و«مسار» معدودة. خذ classify_and_sum: قراران، if وwhile؛ وحرف while الصادق يعود إلى خلفه دورة، ولهذا عدد المسارات غير محدود — يمكن الدوران 0 أو 1 أو 2 مرة — بينما عدد الحواف منتهٍ. من هذه الفجوة كل شيء: تغطية المسارات الكاملة مستحيلة عمليًّا هنا، ولذلك نستقر على معايير أضعف قابلة للإنجاز.',
          en: 'White-box testing selects inputs by looking at code structure; to talk about structure precisely we model a function as a directed graph, the CFG: nodes are straight-line blocks of statements, edges are transfers of control. A decision — an if or a loop condition — is a node with two outgoing edges, true and false; a merge is a node with two incoming edges. Vague words like statement, branch and path become countable. Take classify_and_sum: two decisions, an if and a while; and while\u2019s true edge loops back — a cycle — so the number of paths is unbounded (you can go around 0, 1, 2 times) while edges stay finite. Everything follows from this gap: full path coverage is practically impossible here, so we settle for weaker, achievable criteria.',
        },
        {
          ar: 'ومن الرسم رقم يستحق الحفظ: التعقيد الدوراني cyclomatic complexity = عدد القرارات + 1، ويعادل تقريبًا عدد المسارات المستقلة — أي عدد الاختبارات الذي ستطلبه تغطية القرارات. classify_and_sum فيه قراران فتعقيده 3: نحو ثلاثة اختبارات مدروسة تكفي لغطاء كامل. النطاقات المتعارف عليها: 1-10 كود بسيط سهل الاختبار، 11-20 متوسط، 21-50 محفوف، وفوق ذلك كود يصعب تغطيته شاملًا ويُفضى تفكيكه. والمقياس بوصلة لا درجة: الدوال عالية التعقيد تحوي عيوبًا أكثر وفروعًا يصعب تغطيتها، فوجّه إليها جهد الاختبار وإعادة الهيكلة أولًا.',
          en: 'And from the graph, a number worth memorizing: cyclomatic complexity = the count of decisions + 1, roughly the number of independent paths — the test count branch coverage will demand. classify_and_sum has two decisions, so its complexity is 3: about three considered tests suffice for full coverage. The conventional bands: 1-10 simple, readily testable code; 11-20 moderate; 21-50 risky; above that, code hard to cover comprehensively and better decomposed. The metric is a compass, not a grade: high-complexity functions hold more defects and harder-to-cover branches, so direct testing and refactoring effort there first.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'سلّم المعايير: statement وbranch وpath', en: 'The criteria ladder: statement, branch, path' },
      chunks: [
        {
          ar: 'ثلاثة معايير كلاسيكية متدرجة القوة. تغطية الجمل statement coverage: كل عقدة تنفَّذ مرة واحدة على الأقل — أضعفها وأسهلها. تغطية القرارات branch coverage: كل حافة صادرة عن قرار تؤخذ باتجاهيها، الصادق والكاذب. تغطية المسارات path coverage: كل مسار من الدخول إلى الخروج — الأقوى والمستحيلة عادة مع الحلقات. والعلاقة أحادية الاتجاه: 100% قرارات تقتضي 100% جمل لأن كل عقدة بين القرارات مرّت حتمًا، والعكس يخفق: if بلا else يبلغ 100% جمل باختبار واحد يجعل الشرط صادقًا، بينما حافة الكاذب لم تلمس قط. ولهذا حين يقول فريق «تغطيتنا 90%» اسأل فورًا: تغطية ماذا؟ الفجوة بين المعيارين هي مخبأ العيوب الحقيقية.',
          en: 'Three classic criteria in rising strength. Statement coverage: every node executes at least once — the weakest, easiest bar. Branch coverage: every edge out of a decision is taken both ways, true and false. Path coverage: every entry-to-exit path — the strongest, usually impossible with loops. The implication runs one way: 100% branch forces 100% statement, since every node between decisions must have run; the converse fails: an if with no else reaches 100% statement with a single true-input test while the false edge is never touched. So when a team says our coverage is 90%, ask immediately: coverage of what? The gap between the two criteria is where real defects hide.',
        },
        {
          ar: 'والنسبة نفسها كسر: المغطى على المجموع تحت المعيار المسمّى. انبّه لدورها: أرضية لا سقف — 100% تعني أن كل شيء اشتغلت لا أنها صحيحة، لكن نسبة منخفضة إنذار حقيقي، لأن كودًا لم يعمل تحت أي اختبار هو كود لا تعرف عنه شيئًا تجريبيًّا. واحذر الفخ الإداري: قيادة الفريق برقم مجرد تولّد اختبارات بلا assertions تشغّل الكود ولا تفحصه، فترتفع النسبة وينهار المعنى. التغطية أداة تشخيص تُقرأ مع oracle صادق — وهذه حجة الدرس الأول التي تعود الآن بقيمة عملية.',
          en: 'The percentage itself is a fraction: covered over total under the named criterion. Mind its role: a floor, not a ceiling — 100% means everything ran, not that it is correct; but a low number is a genuine alarm, because code that never ran under any test is code you know nothing about empirically. And beware the managerial trap: driving a team by a bare number breeds assertion-free tests that execute code without checking it, raising the number while emptying the meaning. Coverage is a diagnostic read together with an honest oracle — lesson one\u2019s argument returning with practical teeth.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'البروبات والكود الميت', en: 'Probes and dead code' },
      chunks: [
        {
          ar: 'كيف تقاس النسبة فعلًا؟ أدوات التغطية تسلّح البرنامج instrumentation: بروب عند كل جملة أو قرار يسجّل ما اشتغل. نحن سنفعلها يدويًّا بقاموس عدّادات: مفتاح لكل جملة مهمة ومفتاح لكل حافة، يزيد عند المرور — الفكرة نفسها بمقياس مصغّر. وكلفتها حقيقية: فوق 10-30% زمنًا وثنائيات أكبر حجمًا بكثير — لا تُذكر في حزمة unit على حاسوب، وتُثقل تطبيق هاتف. ولذلك يبحث الباحثون عن قياس بلا تسلّح عبر مراقبات العتاد، وقد استعادوا حتى 90% من تغطية القرارات بكلفة أدنى — لكن المبدأ واحد: سجّل ما اشتغل ثم اقسم.',
          en: 'How is the fraction measured for real? Coverage tools instrument the program: a probe at every statement or branch records what ran. We will do it manually with counter dictionaries: one key per important statement, one per edge, incremented on passage — the same idea at miniature scale. Its cost is real: 10-30% time overhead and much larger binaries — unnoticeable for a laptop unit suite, prohibitive on a phone. Research therefore explores measurement without instrumentation via hardware monitors, recovering up to 90% of branch coverage at lower cost — but the principle is one: record what ran, then divide.',
        },
        {
          ar: 'وأثمن ما تكشفه البروبات: الكود الذي لم يعمل تحت أي اختبار. فرّق بين حالتين. فرع لم يغطِّه حزامك الحالي: قائمة مهام — اكتب الاختبار الناقص. وفرع لا يستطيع أي مدخل الوصول إليه أصلًا — كود ميت كreturn بعد سلسلة returns: عيب محتمل أو نية لم تكتمل، والصواب حذفه لا تغطيته. وقاعدة الحلقات تكمل الصورة: بدل ملاحقة مسارات لا تنتهي، اختبر الحلقة صفر تكرار ثم مرة ثم عدة مرات — ثلاث قيم مدروسة تغطي سلوك الحلقة العملي كله.',
          en: 'And the probes\u2019 most valuable revelation: code that never ran under any test. Distinguish two cases. A branch your current suite misses: a to-do — write the missing test. A branch no input can reach at all — dead code like a return after a chain of returns: a probable defect or an unfinished intention, and the right move is deleting it, not covering it. The loop rule completes the picture: instead of chasing unbounded paths, test the loop zero times, once, then many — three considered values cover the loop\u2019s practical behavior.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'اكتشاف فرع ميت بفرق المجموعات', en: 'Dead-branch discovery by set difference' },
      code: "hits = set()\nALL_TAGS = {'reject-price', 'reject-percent', 'compute'}\n\ndef apply_discount(price, percent):\n    if price < 0:\n        hits.add('reject-price')\n        return -1.0\n    if percent > 100:\n        hits.add('reject-percent')\n        return -1.0\n    hits.add('compute')\n    return price * (100 - percent) / 100\n\nfor price, percent in [(100.0, 25), (-5.0, 10)]:\n    print('apply_discount(%r, %r) = %r' % (price, percent, apply_discount(price, percent)))\n\nprint('covered: %r' % (sorted(hits),))\nprint('uncovered: %r' % (sorted(ALL_TAGS - hits),))",
      explanation: {
        ar: 'apply_discount من عائلة أمثلة الفصل: guardان للرفض ثم الحساب. بروب في كل فرع يسجّل وسمه في المجموعة hits، والمجموعة ALL_TAGS تعرف كل الأوسمة الممكنة. الحزام الحالي [(100.0, 25), (-5.0, 10)] يغطي compute وreject-price — والفرق ALL_TAGS - hits يعلن reject-percent: فرع لم يعمل تحت أي اختبار. هل هو ميت؟ لا — مدخل (50.0, 150) يصل إليه: إذن هو اختبار ناقص لا كود ميت، وسطر uncovered هو قائمة مهامك. لو رُصدت التغطية في الإنتاج لكان هذا السطر أول ما تقرؤه بعد كل تشغيل حزام.',
        en: 'apply_discount from the chapter\u2019s running family: two rejection guards, then the computation. A probe in each branch records its tag into the hits set, and ALL_TAGS knows every possible tag. The current harness [(100.0, 25), (-5.0, 10)] covers compute and reject-price — and the difference ALL_TAGS - hits announces reject-percent: a branch that never ran under any test. Is it dead? No — input (50.0, 150) reaches it: so it is a missing test, not dead code, and the uncovered line is your to-do list. If coverage ran in production telemetry, this line would be the first thing to read after every harness run.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.coverage-probes',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الدالة classify_and_sum مزوّدة ببروبات: قاموس hits يعدّ الجمل المنفذة وقاموس edges يعدّ حواف القرارات، والدالة covered تعدّ المفاتيح التي تجاوز عدّادها الصفر. حلقة الاستدعاءات جاهزة بـ n = 3 ثم n = 0. (1) اطبع سطر التغطية بالصيغة بالضبط: statements: %d/4 | branches: %d/4 مستخدمًا covered(hits) وcovered(edges). (2) أضف استدعاءً واحدًا ناقصًا يرفع التغطيتين معًا إلى 4/4 ثم أعد طباعة السطر بالصيغة نفسها. المتوقع: السطر الأول 3/4 والسطر الثاني 4/4.',
        en: 'The function classify_and_sum is instrumented: the dict hits counts executed statements, the dict edges counts decision edges, and covered counts keys whose counter passed zero. The call loop is ready with n = 3 then n = 0. (1) Print the coverage line in exactly this form: statements: %d/4 | branches: %d/4 using covered(hits) and covered(edges). (2) Add the one missing call that lifts both coverages to 4/4, then print the line again in the same form. Expected: the first line 3/4 and the second 4/4.',
      },
      starterCode: "hits = {'init': 0, 'body': 0, 'negative': 0, 'done': 0}\nedges = {'d1-T': 0, 'd1-F': 0, 'd2-T': 0, 'd2-F': 0}\n\ndef classify_and_sum(n):\n    hits['init'] += 1\n    total = 0\n    i = 1\n    while i <= n:\n        edges['d2-T'] += 1\n        hits['body'] += 1\n        total = total + i\n        i = i + 1\n    edges['d2-F'] += 1\n    if n < 0:\n        edges['d1-T'] += 1\n        hits['negative'] += 1\n    else:\n        edges['d1-F'] += 1\n    hits['done'] += 1\n    return total\n\ndef covered(counter):\n    n = 0\n    for key in counter:\n        if counter[key] > 0:\n            n += 1\n    return n\n\nfor n in [3, 0]:\n    classify_and_sum(n)\n\n# اطبع السطر الأول بالصيغة: statements: %d/4 | branches: %d/4\n# print the first line in the form: statements: %d/4 | branches: %d/4\n\n# أضف الاستدعاء الناقص ثم أعد طباعة السطر بالصيغة نفسها\n# add the missing call, then print the line again in the same form\n",
      solution: "hits = {'init': 0, 'body': 0, 'negative': 0, 'done': 0}\nedges = {'d1-T': 0, 'd1-F': 0, 'd2-T': 0, 'd2-F': 0}\n\ndef classify_and_sum(n):\n    hits['init'] += 1\n    total = 0\n    i = 1\n    while i <= n:\n        edges['d2-T'] += 1\n        hits['body'] += 1\n        total = total + i\n        i = i + 1\n    edges['d2-F'] += 1\n    if n < 0:\n        edges['d1-T'] += 1\n        hits['negative'] += 1\n    else:\n        edges['d1-F'] += 1\n    hits['done'] += 1\n    return total\n\ndef covered(counter):\n    n = 0\n    for key in counter:\n        if counter[key] > 0:\n            n += 1\n    return n\n\nfor n in [3, 0]:\n    classify_and_sum(n)\n\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))\n\nclassify_and_sum(-5)\n\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))",
      tests: [
        {
          id: 't1',
          name: { ar: 'السطر الأول يُظهر 3/4 للاثنين', en: 'The first line shows 3/4 for both' },
          code: "assert 'statements: 3/4 | branches: 3/4' in __learner_output__, 'expected: statements: 3/4 | branches: 3/4 | actual: %r' % __learner_output__",
          expected: 'statements: 3/4 | branches: 3/4',
        },
        {
          id: 't2',
          name: { ar: 'السطر الثاني يبلغ 100%', en: 'The second line reaches 100%' },
          code: "assert 'statements: 4/4 | branches: 4/4' in __learner_output__, 'expected: statements: 4/4 | branches: 4/4 | actual: %r' % __learner_output__",
          expected: 'statements: 4/4 | branches: 4/4',
        },
        {
          id: 't3',
          name: { ar: 'كل العدّادات اشتغلت بعد الاستدعاء الناقص', en: 'Every counter fired after the missing call' },
          code: "assert covered(hits) == 4 and covered(edges) == 4, 'expected: 4 and 4 | actual: %r' % ((covered(hits), covered(edges)),)",
          expected: '4 and 4',
        },
        {
          id: 't4',
          name: { ar: 'الحافة الناقصة كانت d1-T مع الجملة negative', en: 'The missing edge was d1-T with the negative statement' },
          code: "assert hits['negative'] >= 1 and edges['d1-T'] >= 1, 'expected: negative + d1-T hit | actual: %r' % ((hits['negative'], edges['d1-T']),)",
          expected: 'negative + d1-T hit',
        },
      ],
      hints: [
        { ar: 'أي حافة لم تؤخذ بعد؟ الحلقة دوت مرتين فأخذت d2-T وd2-F، والقيمتان 3 و0 غير سالبتان فأخذتا d1-F — يبقى d1-T: تحتاج n سالبة.', en: 'Which edge is still untaken? The loop ran twice giving d2-T and d2-F, and both 3 and 0 are non-negative so they took d1-F — what remains is d1-T: it needs a negative n.' },
        { ar: 'الصيغة المطلوبة سلسلة واحدة فيها كسران مفصولان بـ | — مرّر covered(hits) وcovered(edges) إلى سلسلة الصيغة نفسها في الموضعين.', en: 'The required form is one string with two fractions separated by | — pass covered(hits) and covered(edges) into the same format string in the two slots.' },
        { ar: "الهيكل:\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))\n\nclassify_and_sum(-5)\n\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))", en: "The skeleton:\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))\n\nclassify_and_sum(-5)\n\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))" },
        { ar: "الحل الكامل:\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))\n\nclassify_and_sum(-5)\n\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))\n\n— السطر الأول: 3/4 | 3/4 لأن negative وd1-T لم يعملا؛ وبعد n = -5 يعملان فيبلغ السطر الثاني 4/4 | 4/4.", en: "The full solution:\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))\n\nclassify_and_sum(-5)\n\nprint('statements: %d/4 | branches: %d/4' % (covered(hits), covered(edges)))\n\n— the first line: 3/4 | 3/4 because negative and d1-T never fired; after n = -5 both fire, so the second line reads 4/4 | 4/4." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-edges',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. تذكّر: الحافة تُختار بنتيجة الشرط لا بحجم القيمة، وانتبه للقيمة الحدّية 10.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Remember: the edge is chosen by the condition result, not the value magnitude, and watch the boundary value 10.',
      },
      code: "tags = []\n\ndef check(x):\n    if x > 10:\n        tags.append('T')\n    else:\n        tags.append('F')\n\nfor x in [5, 20, 10, 0]:\n    check(x)\n\nprint(tags)\nprint('false edge: %d true edge: %d' % (tags.count('F'), tags.count('T')))",
      solution: "['F', 'T', 'F', 'F']\nfalse edge: 3 true edge: 1",
      answer: "['F', 'T', 'F', 'F']\nfalse edge: 3 true edge: 1",
      hints: [
        { ar: 'الشرط x > 10 صارم: القيمة 10 لا تجعله صادقًا فتسلك حافة else كالقيم الأصغر.', en: 'The condition x > 10 is strict: the value 10 does not satisfy it, so it takes the else edge like the smaller values.' },
        { ar: "5 و10 و0 تعطي F، و20 وحدها تعطي T — فالقائمة ['F', 'T', 'F', 'F'].", en: "5, 10 and 0 give F, and 20 alone gives T — so the list is ['F', 'T', 'F', 'F']." },
        { ar: 'العدّ: F ثلاث مرات وT مرة واحدة، والصيغة تطبعهما بالترتيب false ثم true.', en: 'The counts: F three times and T once, and the format prints them in order, false then true.' },
        { ar: "الخرج:\n['F', 'T', 'F', 'F']\nfalse edge: 3 true edge: 1", en: "The output:\n['F', 'T', 'F', 'F']\nfalse edge: 3 true edge: 1" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-subsumption',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'دالة فيها if واحد بلا else، واختبار واحد فقط بمدخل يجعل شرطه صادقًا. ماذا تقيس التغطيتان بعد هذا الاختبار الواحد؟',
        en: 'A function with a single if and no else, and one test whose input makes the condition true. What do the two coverage measures report after this single test?',
      },
      options: [
        { id: 'a', text: { ar: 'تغطية الجمل 50% وتغطية القرارات 100%', en: 'statement coverage 50% and branch coverage 100%' } },
        { id: 'b', text: { ar: 'تغطية الجمل 100% وتغطية القرارات 50% — كل الجمل اشتغلت لكن حافة false لم تؤخذ قط', en: 'statement coverage 100% and branch coverage 50% — every statement ran, but the false edge was never taken' } },
        { id: 'c', text: { ar: 'كلتاهما 100% لأن اختبارًا واحدًا يمر بالدالة كاملة', en: 'both 100% because a single test flows through the whole function' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'مع الشرط صادقًا يمر التنفيذ بالجمل قبل if وفي جسمها وبعدها — أي كل الجمل.', en: 'With the condition true, execution passes the statements before the if, inside its body, and after it — that is every statement.' },
        { ar: 'القرار له حافتان فقط: صادق وكاذب — والاختبار الواحد أخذ واحدة منهما.', en: 'The decision has exactly two edges, true and false — and the single test took one of them.' },
        { ar: 'هذه هي الحالة القياسية التي يخفق فيها عكس الاحتواء: branch يحتوي statement ولا يشتبه به.', en: 'This is the canonical case where the converse of subsumption fails: branch subsumes statement, not the other way.' },
        { ar: 'الجواب: b — الجمل 100% والقرارات 50%؛ الفجوة بينهما هي حافة الكاذب غير المأخوذة.', en: 'Answer: b — statements 100% and branches 50%; the gap between them is the never-taken false edge.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-branch',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'المعيار الذي يشترط أن تؤخذ كل حافة صادرة عن كل قرار — بالاتجاهين صادق وكاذب — هو تغطية ____. (كلمة إنجليزية واحدة)',
        en: 'The criterion requiring every edge out of every decision to be taken — in both directions, true and false — is ____ coverage. (one English word)',
      },
      answer: 'branch',
      solution: 'branch',
      hints: [
        { ar: 'الاسم هو اسم الحافة نفسها في رسم التحكم.', en: 'The name is the very name of the edge in the control-flow graph.' },
        { ar: 'أقوى من تغطية الجمل وأضعف من تغطية المسارات.', en: 'Stronger than statement coverage, weaker than path coverage.' },
        { ar: 'في هذا الدرس قسناها بقاموس edges بمفاتيح d1-T وd1-F وd2-T وd2-F.', en: 'In this lesson we measured it with an edges dict keyed d1-T, d1-F, d2-T and d2-F.' },
        { ar: 'الجواب: branch', en: 'Answer: branch' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def classify_and_sum(n):\n    if n < 0:\n        return 'negative'\n    total = 0\n    i = 1\n    while i <= n:\n        total = total + i\n        i = i + 1\n    return 'sum=%d' % total\n\nfor n in [0, 1, 4]:\n    print(n, classify_and_sum(n))\n\n# جرّب: قاعدة الحلقات 0/1/many — أي قيم n تغطي صفر تكرار ومرة واحدة وعدة تكرارات؟\n# try: the loop rule 0/1/many — which n values cover zero, one, and many iterations?\n# جرّب: أضف بروب عدّادات (قاموسا hits وedges كما في الدرس) وتحقق أن القيم الثلاث تغطي كل الحواف\n# try: add a counter probe (hits and edges dicts as in the lesson) and verify the three values cover every edge\n",
      prompt: {
        ar: 'الملعب يفتح classify_and_sum بلا بروبات. توقّع يدويًّا قبل كل تعديل: كم تكرارًا تدور الحلقة عند n = 0 وn = 1 وn = 4؟ أي قيم تغطي صفرًا ومرة وعدة — قاعدة 0/1/many؟ ثم عدّ القرارات واحسب التعقيد الدوراني، وأضف بروب العدّادات كما في الدرس وتحقق أن ثلاث قيم تكفي لكل الحواف. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox opens classify_and_sum without probes. Hand-predict before every edit: how many iterations at n = 0, n = 1, n = 4? Which values cover zero, one, and many — the 0/1/many rule? Then count decisions, compute cyclomatic complexity, add the counter probe as in the lesson, and verify three values cover every edge. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الدرس الأول: ما الذي يحوّل «هل كفينا؟» من إحساس إلى سؤال معدود — والذي صار اليوم رقمًا يمكن قياسه بالبروبات؟',
            en: 'From lesson one: what turns have-we-tested-enough from a feeling into a countable question — the one you can now measure as a number?',
          },
          options: [
            { id: 'a', text: { ar: 'معيار كفاية مسمّى: مجموعة أشياء يجب تغطيتها، والتغطية هي الكسر المغطى منها', en: 'A named adequacy criterion: a set of things to cover, with coverage the covered fraction of it' } },
            { id: 'b', text: { ar: 'عدد ساعات الفريق في الاختبار', en: 'The number of team hours spent testing' } },
            { id: 'c', text: { ar: 'حدس قائد الفريق بعد النظر إلى الخرج', en: 'The team lead\u2019s gut feeling after looking at the output' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'معيار الكفاية مسمّى ومعدود: عقد أو حواف أو أصناف أو حدود — والتغطية كسره المغطى. اليوم حوّلنا حرفي d1 وd2 إلى عدّادات فقِيس النسبة فعليًّا، وهذا بالضبط معنى أن تكون الكفاية قاعدة توقف لا شعورًا.',
            en: 'An adequacy criterion is named and countable: nodes, edges, classes or boundaries — coverage is its covered fraction. Today we turned edges d1 and d2 into counters and measured the fraction — exactly what it means for adequacy to be a stopping rule, not a feeling.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن PY4E الفصل الثالث: if وelif وelse تنفّذ كتلة بحسب نتيجة الشرط. في رسم التحكم CFG، ماذا يقابل شرط الـ if؟',
            en: 'From PY4E chapter 3: if, elif and else run a block depending on the condition result. In the CFG, what does an if condition correspond to?',
          },
          options: [
            { id: 'a', text: { ar: 'عقدة قرار بحرفين صادرين — الصادق والكاذب', en: 'A decision node with two outgoing edges — true and false' } },
            { id: 'b', text: { ar: 'عقدة خطية بحرف صادر واحد', en: 'A straight-line node with a single outgoing edge' } },
            { id: 'c', text: { ar: 'حرف راجع إلى خلف العقدة', en: 'An edge looping back behind the node' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل if في PY4E الفصل الثالث هو نقطة تفرّع: نتيجة الشرط تختار كتلة من اثنتين — وهذا عقدة القرار بحرفيه صادق وكاذب في CFG. أما الحرف الراجع فمنازل حلقات while وهي قصة الفجوة بين المسارات والحواف.',
            en: 'Every if in PY4E chapter 3 is a fork: the condition result picks one of two blocks — precisely a decision node with true and false edges in the CFG. The looping edge belongs to while loops, the story of the paths-versus-edges gap.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'دالة فيها ثلاثة قرارات: if وwhile وif. كم تعقيدها الدوراني، وكم اختبارًا مدروسًا يطلب غطاء القرارات تقريبًا؟',
            en: 'A function with three decisions: an if, a while and an if. What is its cyclomatic complexity, and roughly how many considered tests does branch coverage demand?',
          },
          options: [
            { id: 'a', text: { ar: '2 — وعدد الاختبارات لا علاقة له بالمعقّد', en: '2 — and test count has no relation to complexity' } },
            { id: 'b', text: { ar: '4 — نحو أربعة اختبارات مدروسة', en: '4 — about four considered tests' } },
            { id: 'c', text: { ar: '8 — لأن كل قرار يضاعف المسارات', en: '8 — because every decision doubles the paths' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التعقيد الدوراني = القرارات + 1 = 3 + 1 = 4، وهو تقدير عدد المسارات المستقلة الذي تطلبه تغطية القرارات. الأفضل أن 8 هو عدد صفوف جدول الحقيقة لثلاثة شروط — سقف التعامل الشامل الذي يتحدث عنه الدرس الرابع.',
            en: 'Cyclomatic complexity = decisions + 1 = 3 + 1 = 4, the estimate of independent paths branch coverage demands. (The 8 is the truth-table row count for three conditions — the exhaustive ceiling the next lessons discuss.)',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي العلاقات بين معياري تغطية الجمل وتغطية القرارات صحيحة؟',
            en: 'Which relation between statement coverage and branch coverage is correct?',
          },
          options: [
            { id: 'a', text: { ar: '100% جمل تقتضي 100% قرارات', en: '100% statement implies 100% branch' } },
            { id: 'b', text: { ar: '100% قرارات تقتضي 100% جمل — والعكس يخفق عند if بلا else', en: '100% branch implies 100% statement — and the converse fails for an if with no else' } },
            { id: 'c', text: { ar: 'لا توجد علاقة بينهما إطلاقًا', en: 'No relation exists between them at all' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'إذا أُخذت كل الحواف فإن كل عقدة بين القرارات مرّت حتمًا، فتغطية القرارات تحتوي تغطية الجمل. والعكس يخفق: if بلا else مع اختبار شرطه صادق يحقق الجمل كاملة ويترك حافة الكاذب — والفجوة بينهما مخبأ العيوب.',
            en: 'Taking every edge forces every node between decisions to have run, so branch coverage subsumes statement coverage. The converse fails: an if with no else plus one true-input test covers all statements while leaving the false edge untaken — and that gap is where defects hide.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: '«تغطيتنا 100% إذن الكود صحيح»',
          right: '«غطينا كل عقدة وحافة — نعلم أن كل شيء اشتغلت، لا أنه صحيح»',
          note: {
            ar: 'التغطية أرضية لا سقف: النسبة تقيس التشغيل لا الصحة، ويبقى oracle — القيمة المتوقعة الصادقة — هو الحكم. النسبة المنخفضة إنذار، والمرتفعة راحة زائفة إن لم تكن الاختبارات تفحص فعلًا.',
            en: 'Coverage is a floor, not a ceiling: the fraction measures execution, not correctness, and the oracle — the honest expected value — still does the judging. A low number is an alarm; a high one is false comfort unless the tests actually check.',
          },
        },
        {
          wrong: 'أطارد تغطية مسارات 100% في دالة فيها حلقة',
          right: 'قاعدة الحلقات: صفر تكرار ثم مرة ثم عدة — ثلاث قيم مدروسة',
          note: {
            ar: 'حرف الحلقة الصادق يعود إلى خلفه فتتضاعف المسارات مع كل قيمة مدخل: عدد المسارات غير محدود بينما الحواف منتهية. ملاحقة المسارات مستحيلة عمليًّا؛ قاعدة 0/1/many تغطي السلوك العملي بكلفة ثابتة.',
            en: 'The loop\u2019s true edge loops back, so paths multiply with every input value: the path count is unbounded while edges stay finite. Chasing paths is practically impossible; the 0/1/many rule covers practical behavior at constant cost.',
          },
        },
        {
          wrong: 'if بلا else: اختبار واحد بشرط صادق يكفي لأن كل الجمل اشتغلت',
          right: 'اختبار ثانٍ يأخذ حافة الكاذب — وإلا فتغطية قراراتك 50%',
          note: {
            ar: 'هذا هو فشل عكس الاحتواء: الجمل كلها مرّت والقرار لم يُختبر إلا من جهة واحدة. اسأل دائمًا «تغطية ماذا؟» — والفجوة بين الجمل والقرارات هي بالضبط المكان الذي يختبئ فيه عيب >= بدل >.',
            en: 'This is the failure of the converse of subsumption: every statement ran while the decision was exercised from one side only. Always ask coverage of what? — and the statement-versus-branch gap is exactly where a >= instead of > defect hides.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'رسم التحكم CFG يحوّل البنية إلى أرقام: عقد وقرارات وحواف ومسارات؛ والتعقيد الدوراني = القرارات + 1 يقدّر حجم حزام تغطية القرارات (1-10 بسيط، 11-20 متوسط، 21-50 محفوف).', en: 'The CFG turns structure into numbers: nodes, decisions, edges, paths; cyclomatic complexity = decisions + 1 estimates the size of a branch-coverage harness (1-10 simple, 11-20 moderate, 21-50 risky).' },
        { ar: 'سلّم المعايير: path تقتضي branch وتقتضي statement — والعلاقة لا تنعكس؛ النسبة كسر مغطى أرضية لا سقف، واسأل دائمًا «تغطية ماذا؟».', en: 'The criteria ladder: path implies branch implies statement — and the implication never reverses; the fraction is a covered floor, not a ceiling, and always ask coverage of what?.' },
        { ar: 'البروبات (قواميس العدّادات) تكشف الفرع الذي لم يعمل تحت أي اختبار: فرع ناقص التغطية قائمة مهام، وفرع لا سبيل إليه كود ميت يُحذف؛ والحلقات تُختبر 0/1/many.', en: 'Probes (counter dicts) reveal branches that never ran under any test: an uncovered branch is a to-do, an unreachable branch is dead code to delete; and loops are tested 0/1/many.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وأضف بروب العدّادات كما في الدرس، وتوقّع قبل كل تشغيل: عند n = 6 كم تكرارًا تدور الحلقة وما قيمة sum؟ ثم اسأل نفسك: هل تحتاج قيمة خامسة غير -5 و0 و1 و4 لأي حافة جديدة؟ ولماذا لا يضيف n = 5 أي حافة لم تُؤخذ؟',
        en: 'Open the sandbox, add the counter probe as in the lesson, and predict before each run: at n = 6, how many iterations and what sum? Then ask yourself: do you need any fifth value beyond -5, 0, 1 and 4 for any new edge? And why does n = 5 add no untaken edge?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch10.s3', pages: 'ص264-267 / pp.264-267' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch10.s3', pages: 'ص264-267 / pp.264-267' },
  ],
} satisfies Lesson;

export default lesson;
