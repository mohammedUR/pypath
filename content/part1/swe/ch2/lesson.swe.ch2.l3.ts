import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch2.l3 — "Waterfall Limits and V Processes"
 * حدود الشلال وعروض V
 * Aligned with SWE ch2 s4 (Limitations of Waterfall Processes, pp.43-45) +
 * s5 (Levels of Design and Testing: V Processes, pp.46-48).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: a deterministic V mirror dict (each design level paired
 * with its test level) plus a late-defect cost loop — a fixed multiplier
 * ladder showing how the same defect's fix cost grows with discovery phase.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
const lesson = {
  id: 'swe.ch2.l3',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 2,
  title: { ar: 'حدود الشلال وعروض V', en: 'Waterfall Limits and V Processes' },
  estimatedMinutes: 28,
  prerequisites: ['swe.ch2.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الشهر العاشر في مشروع ينفذ بخطة شلالية: كل مرحلة اعتُمدت رسميًا، والرسوم البيانية للحالة كلها خضراء منذ شهور. ثم يبدأ أسبوع الدمج — والفرق الثلاثة تلتقي مكوناتها للمرة الأولى. وحدة واحدة تنتج أقدام وأخرى تنتظر أمتارًا؛ ووحدة افترضت أن القائمة مرتبة والوحدة الأخرى لم تعد بذلك؛ وخطأ متطلبات من الشهر الأول يظهر الآن بعدما بُني عليه كل شيء. المشروع كان يبدو سليمًا حتى هذا الأسبوع بالضبط. هذا الدرس يشريح سبب ذلك: أين يجد الشلال نفسه مخطئًا، ولماذا يكون ذلك دائمًا في أغلى لحظة ممكنة — ثم كيف يعالج عرض V جزءًا من المرض بربط كل مستوى تصميم بمستوى اختبار، مع بقاء الشلال المتسلسل كما هو.',
        en: 'Month ten of a waterfall project: every phase was formally signed off, and all the status dashboards have been green for months. Then integration week starts — and three teams\u2019 components meet for the first time. One module produces feet while another expects meters; one assumed the list was sorted and the other never promised it; a requirements mistake from month one surfaces now, after everything has been built on top of it. The project looked healthy right up to exactly this week. This lesson dissects why: where waterfall finds out it is wrong, and why it is always at the most expensive possible moment — then how the V-model fixes one part of the disease by tying every design level to a matching test level, while keeping the sequential spine.',
      },
    },
    {
      kind: 'predict',
      code: "PAIR = {'unit': 'implementation', 'integration': 'detailed design', 'system': 'architecture'}\nprint(PAIR['unit'])\nprint(PAIR['system'])\nprint('acceptance -> ?')",
      question: {
        ar: 'قاموس يربط كل مستوى اختبار بمستوى التصميم الذي يفحصه. أي مستوى تصميم ينبغي أن يقابله acceptance لتكتمل المرآة؟',
        en: 'A dict pairing each test level with the design level it checks. Which design level should pair with acceptance to complete the mirror?',
      },
      reveal: {
        ar: 'acceptance يقابل requirements: اختبارات القبول تفحص المتطلبات الأصلية نفسها — هل بنينا الشيء الصحيح؟ كملنا القاموس: requirements ↔ acceptance وarchitecture ↔ system وdetailed design ↔ integration وimplementation ↔ unit. هذه المرآة هي جوهر عرض V، وسنبنيها في الدرس مع ثمن اكتشاف العيوب متأخرًا.',
        en: 'acceptance pairs with requirements: acceptance tests check the original requirements themselves — did we build the right thing? The completed mirror: requirements ↔ acceptance, architecture ↔ system, detailed design ↔ integration, implementation ↔ unit. That mirror is the heart of the V-model, which we will build alongside the price of finding defects late.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الشلال: تمريرة واحدة يحجب فيها الاكتشافُ الكلفة', en: 'Waterfall: one pass where discovery lags cost' },
      chunks: [
        {
          ar: 'نموذج الشلال يدير المشروع تمريرة واحدة عبر تتابع صارم من المراحل — متطلبات، تصميم، تنفيذ، تحقق، صيانة — كل مرحلة تكتمل وتُعتمد قبل بدء تاليتها، كماء يهبط درجات ولا يعود. جاذبيته حقيقية: بسيط الشرح، سهل التخطيط والفوترة، ويُقدّم التفكير المعتقل إلى أول المشروع؛ وللمسائل المفهومة جيدًا والمتطلبات المستقرة يمكن أن ينجح. وملاحظة تاريخية قبل النقد: التتابع الصارم ذو التمريرة الواحدة هو الشلال الكتابي — لكن ورقة رويز 1970 المصدر المعتاد قدّمت التتابع ثم جادلت أنه محفوف بالمخاطر ويحتاج تغذية راجعة وتكرارًا؛ فتبنّت الصناعة الرسم التخطيطي وتخطت التحذير، ونحن ننتقد النموذج كما مورس فعلًا.',
          en: 'The waterfall model runs the project as a single pass through a strict sequence of phases — requirements, design, implementation, verification, maintenance — each phase completed and signed off before the next begins, like water stepping down and never back. Its appeal is real: simple to explain, easy to plan and bill against, and it front-loads the thinking; for well-understood problems with stable requirements it can work fine. One historical note before critiquing: the strict single-pass model is the textbook waterfall — but Royce\u2019s 1970 paper, the usual citation, presented the sequence and then argued it was risky and needed feedback and iteration; the industry adopted the diagram and skipped the warning, and we critique the model as it was actually practiced.',
        },
        {
          ar: 'العيب الأعمق ليس ماذا يكتشف بل متى: لأن التحقق مرحلة متأخرة، تجتمع القطع المبنية منفردة قرب النهاية أول مرة — دمج الانفجار الكبير big-bang: مكونات شهور تلتقي دفعة واحدة. يحدث شيئان سيئان معًا: الدمج يكشف كل الافتراضات المتضاربة بين المكونات في وقت واحد — وفك أعطال متفاعلة كثيرة دفعة واحدة أصعب بكثير من إصلاحها واحدًا واحدًا — وفي الوقت نفسه يعني اختبارُ النهاية أن أخطاء المتطلبات من الشهر الأول، الأغلى نوعًا، تُكتشف في الشهر العاشر بعدما بُني عليها كل شيء. فالمشروع يبدو سليمًا حتى مرحلة الدمج ثم ينهار لأن كل المخاطر أُجّلت إلى النهاية: اللحظة التي تعرف فيها أول مرة هل يعمل النظام هي اللحظة التي يتبقى فيها أقل وقت ومال للإصلاح — تأجيل الدمج والاختبار لا يزيل الخطر بل يركّزه حيث يضر أكثر.',
          en: 'The deepest flaw is not what it discovers but when: because verification is a late phase, separately built pieces come together near the end — big-bang integration, months of components meeting at once. Two bad things happen together: integration surfaces every mismatched assumption between components, and untangling many interacting failures at once is far harder than fixing them one at a time; end-of-project testing means requirements mistakes from month one — the truly expensive kind — are discovered in month ten, after everything built on them must be unwound. So the project looks healthy right up to integration, then falls apart — all the risk was deferred to the end: the moment you first learn whether the system works is the moment with the least time and money left to fix it. Deferring integration and testing does not remove risk; it concentrates it where it does the most damage.',
        },
        {
          ar: 'والحجة الاقتصادية هي منحنى كلفة التغيير: دراسات المشاريع الحقيقية ترصد طويلًا أن كلفة إصلاح عيب أو استيعاب تغيير ترتفع حدّةً كلما تأخر اكتشافه — خطأ متطلبات يُمسك أثناء المتطلبات شبه مجاني، والخطأ نفسه بعد الإطلاق يكلف أضعافًا أسية لأن عملًا كثيرًا بُني فوق الخطأ (وتصل التقديرات إلى نحو مئة ضعف). المضاعفات الدقيقة تتفاوت بين الدراسات والأدوات الحديثة تسطّح المنحنى قليلًا، لكن شكله ثابت ويدفع تصميم العمليات: عملية تؤجل اكتشاف المشكلات إلى النهاية اقتصاديًا مقلوبة — وكل طريقة تكرارية هي جزئيًا استراتيجية لإزاحة الاكتشاف يسارًا. وإن أجبرتك قيود على شكل شلالي فعُلاجات الدرس معروفة: نمذجة أولية للأجزاء الأصعب، ومراجعات صارمة عند كل حد مرحلة، ودمج تدريجي داخل الخطة، وشلالات صغيرة متكررة بدل شلال عملاق — ولاحظ أن كل علاج منها يسحب الشلال نحو التكرار.',
          en: 'The economic argument is the cost-of-change curve: studies of real projects observe that the cost of fixing a defect or accommodating a change rises steeply the later it is discovered — a requirements error caught during requirements is nearly free, while the same error after release can cost orders of magnitude more because so much work built atop it (estimates reach roughly a hundred times). Exact multipliers vary by study and modern tooling flattens the curve, but the shape is robust and drives process design: a process deferring discovery of problems to the end is economically backwards — every iterative method partly slides discovery leftward. If constraints force a waterfall-ish shape, the lesson\u2019s mitigations are known: prototype the risky parts first, review rigorously at every phase boundary, integrate incrementally within the plan, and run several small waterfalls instead of one giant — every mitigation pulls waterfall toward iteration.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'عرض V: كل مستوى تصميم يقابله مستوى اختبار', en: 'The V-model: every design level meets a test level' },
      chunks: [
        {
          ar: 'نموذج V تحسين للشلال يعالج شكوى بعينها: يجعل الاختبار مواطنًا من الدرجة الأولى ويربط كل مستوى تصميم بمستوى اختبار مطابق. ارسم المراحل هابطة في الذراع الأيسر — تفكيك من متطلبات واسعة نازلة إلى تصميم تفصيلي — ثم صاعدة في الأيمن — تكامل وتحقق من وحدات صغيرة صعودًا إلى النظام الكامل، فيتكون حرف V. والخطوط المنقطة بين الذراعين تحمل الفكرة المركزية: التنفيذ يتحقق منه اختبارات الوحدة؛ والتصميم التفصيلي اختبارات التكامل التي تفحص أن القطع تتلاءم كما ادّعى التصميم؛ والمعمارية اختبارات النظام؛ والمتطلبات الأصلية اختبارات القبول. والمعنى العملي مباشر: خطط الاختبارات أثناء التصميم لا كفكرة لاحقة، واعلم من البداية أن الأخطاء المختلفة تُمسك عند مستويات مختلفة.',
          en: 'The V-model is a waterfall refinement fixing one specific complaint: it makes testing a first-class citizen and ties every level of design to a matching level of testing. Draw the phases descending the left arm — decomposition from broad requirements down to detailed design — then ascending the right — integration and verification from small units back up to the whole system, forming a V. The dashed lines between arms carry the central insight: the implementation is verified by unit tests; the detailed module design by integration tests, which check the pieces fit the way the design claimed; the architecture by system tests; and the original requirements by acceptance tests. The practical meaning is direct: plan the tests while you do the design, not as an afterthought — and know from the start that different mistakes are caught at different levels.',
        },
        {
          ar: 'سلّم المستويات الأربعة في الذراع الأيمن، ولكل سؤاله ونطاقه — ومن أنفع النماذج الذهنية في الهندسة. اختبار الوحدة يفحص أصغر القطع — دالة أو صنف أو وحدة — منفردة، وعادة بكاتبها: هل يفعل ما يقوله تصميمه التفصيلي؟ سريعة وكثيرة وعمود TDD. واختبار التكامل يفحص أن الوحدات تعمل معًا وأن الافتراضات بينها تتطابق: هل تتلاءم القطع؟ — بالضبط الخطر الذي يسيء إليه الدمج الجامع، وفعله تدريجيًا يجد عدم التطابق واحدًا واحدًا. واختبار النظام يمارس النظام المدمج مقابل سلوكه المحدد بما فيه الصفات غير الوظيفية — الأداء والأمن والموثوقية: هل يفي النظام الكامل بمواصفته؟ واختبار القبول يفحص النظام مقابل حاجات الزبون — ويفضَّل بمشاركته: هل بنينا الشيء الصحيح؟ اجتازُ اختبارات النظام يثبت أنك بنيت النظام صحيحًا، واجتيازُ القبول يثبت أنك بنيت النظام الصحيح — ويتفرقان حين تكون المواصفة خاطئة. والمستويات ليست ملك الشلال: الفرق الرشيقة تدير الأربعة باستمرار لا بمرحلة نهائية — ومساهمة V الدائمة مفردات السلم الذي عليه كل عملية.',
          en: 'The right arm\u2019s ladder names four testing levels, each with its own question. Unit testing checks the smallest pieces — function, class, or module — in isolation: does this piece do what its detailed design says? Fast, numerous, the backbone of TDD. Integration testing checks that units work together — interfaces and assumptions line up: do the pieces fit? — exactly what big-bang integration mishandles. System testing exercises the integrated system against its specified behavior, including non-functional qualities — performance, security, reliability: does it meet its specification? Acceptance testing checks the system against the customer\u2019s needs: did we build the right thing? Passing system tests proves you built the system right; passing acceptance tests proves you built the right system — they diverge when the specification is wrong. These levels are not waterfall\u2019s property: agile teams run all four continuously — the V\u2019s lasting contribution is the ladder\u2019s vocabulary.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مرآة V وسلّم الكلفة', en: 'The V mirror and the cost ladder' },
      code: "V_PAIRS = [\n    ('requirements', 'acceptance'),\n    ('architecture', 'system'),\n    ('detailed design', 'integration'),\n    ('implementation', 'unit'),\n]\nfor left, right in V_PAIRS:\n    print('%s <-> %s' % (left, right))\n\nBASE_HOURS = 2\nMULT = {'requirements': 1, 'design': 5, 'implementation': 20, 'testing': 50, 'production': 100}\nfor phase in MULT:\n    print('caught in %s cost: %dh' % (phase, BASE_HOURS * MULT[phase]))",
      explanation: {
        ar: 'جزآن في مقطع واحد. المرآة: أربعة أزواج تقرأ من اليسار إلى اليمين — كل مستوى تصميم يقابله مستوى اختبار يفحصه، وهذا هو الجدول الذي تخطط به الاختبارات أثناء التصميم لا بعده. وسلّم الكلفة: عيب واحد قاعدته إصلاحه ساعتان، ومضاعفات نموذجية توضح الشكل (المضاعفات الدقيقة تتفاوت بين الدراسات — النموذج هنا للتوضيح): المسك أثناء المتطلبات 2h، وفي الإنتاج 200h. الفرق بين السطرين الأول والأخير هو كل الحجة الاقتصادية ضد تأجيل الاكتشاف: الخطأ نفسه، واللحظتان فقط مختلفتان.',
        en: 'Two parts in one snippet. The mirror: four pairs read left to right — every design level paired with the test level that checks it, the table you plan tests from while designing, not after. The cost ladder: one defect whose baseline fix is 2 hours, with illustrative multipliers showing the shape (exact numbers vary by study — the model here is for intuition): caught during requirements 2h, in production 200h. The gap between the first and last line is the entire economic argument against deferred discovery: the same defect, only the moment differs.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-pair',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. تذكّر كيف تعيد get قيمة المفتاح أو البديل.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Recall how get returns a key\u2019s value or a fallback.',
      },
      code: "PAIR = {'unit': 'implementation', 'integration': 'detailed design', 'system': 'architecture'}\nprint(PAIR['unit'])\nprint(PAIR.get('acceptance', 'requirements'))\nprint(PAIR['system'])",
      solution: "implementation\nrequirements\narchitecture",
      answer: "implementation\nrequirements\narchitecture",
      hints: [
        { ar: 'السطر الأول يقرأ المفتاح unit مباشرة: قيمته implementation.', en: 'The first line reads the unit key directly: its value is implementation.' },
        { ar: 'المفتاح acceptance غير موجود، فتعيد get البديل requirements — وهذا هو الزوج الذي يكتمل به عرض V.', en: 'The acceptance key is missing, so get returns the fallback requirements — the very pair that completes the V.' },
        { ar: 'السطر الأخير يقرأ system: قيمته architecture.', en: 'The last line reads system: its value is architecture.' },
        { ar: 'الخرج:\nimplementation\nrequirements\narchitecture', en: "The output:\nimplementation\nrequirements\narchitecture" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.cost-curve',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ سلم الكلفة: أكمل late_cost(base_hours) التي تمشي على قاموس MULT بترتيبه (المتطلبات حتى الإنتاج) وتحسب كلفة إصلاح العيب إذا اكتُشف في كل مرحلة: base_hours × المضاعف، وتطبع لكل مرحلة سطرًا بصيغة caught in %s cost: %dh. ثم اطبع النسبة بين كلفة الإنتاج وكلفة المتطلبات بصيغة production vs requirements: %dx وأعد قاموس المراحل وكلفتها. استدعها بـ 2.',
        en: 'Build the cost ladder: complete late_cost(base_hours) that walks the MULT dict in its order (requirements through production), computes the defect\u2019s fix cost if caught in each phase as base_hours × multiplier, and prints one line per phase formatted caught in %s cost: %dh. Then print the production-to-requirements ratio as production vs requirements: %dx and return the dict of phase→cost. Call it with 2.',
      },
      starterCode: "MULT = {'requirements': 1, 'design': 5, 'implementation': 20, 'testing': 50, 'production': 100}\n\ndef late_cost(base_hours):\n    costs = {}\n\n    # TODO: امشِ MULT بترتيبه واحسب الكلفة واطبع سطرًا لكل مرحلة\n    # TODO: walk MULT in order, compute the cost, print one line per phase\n\n    # TODO: اطبع النسبة بين الإنتاج والمتطلبات\n    # TODO: print the production-to-requirements ratio\n\n    return costs\n\nresult = late_cost(2)\n",
      solution: "MULT = {'requirements': 1, 'design': 5, 'implementation': 20, 'testing': 50, 'production': 100}\n\ndef late_cost(base_hours):\n    costs = {}\n    for phase in MULT:\n        costs[phase] = base_hours * MULT[phase]\n        print('caught in %s cost: %dh' % (phase, costs[phase]))\n    ratio = costs['production'] // costs['requirements']\n    print('production vs requirements: %dx' % ratio)\n    return costs\n\nresult = late_cost(2)",
      tests: [
        {
          id: 't1',
          name: { ar: 'آخر سلم في الإنتاج: 200 ساعة', en: 'The last ladder rung in production: 200h' },
          code: "assert 'caught in production cost: 200h' in __learner_output__, 'expected: caught in production cost: 200h | actual: %r' % __learner_output__",
          expected: 'caught in production cost: 200h',
        },
        {
          id: 't2',
          name: { ar: 'القاموس المُعيد بقيمه الصحيحة', en: 'The returned dict has the right values' },
          code: "assert result == {'requirements': 2, 'design': 10, 'implementation': 40, 'testing': 100, 'production': 200}, 'expected: 2/10/40/100/200 | actual: %r' % (result,)",
          expected: '2/10/40/100/200',
        },
        {
          id: 't3',
          name: { ar: 'النسبة مئة ضعف', en: 'The ratio is a hundred-fold' },
          code: "assert 'production vs requirements: 100x' in __learner_output__, 'expected: production vs requirements: 100x | actual: %r' % __learner_output__",
          expected: 'production vs requirements: 100x',
        },
        {
          id: 't4',
          name: { ar: 'السلم يتصاعد بترتيب المراحل', en: 'The ladder ascends in phase order' },
          code: "assert 'caught in requirements cost: 2h' in __learner_output__ and 'caught in testing cost: 100h' in __learner_output__, 'expected: 2h early and 100h at testing | actual: %r' % __learner_output__",
          expected: '2h early and 100h at testing',
        },
      ],
      hints: [
        { ar: 'قاموس بايثون يحفظ ترتيب الإدراج: امشِ for phase in MULT فتحصل على المتطلبات ثم التصميم ثم التنفيذ ثم الاختبار ثم الإنتاج.', en: 'Python dicts preserve insertion order: walking for phase in MULT yields requirements, design, implementation, testing, production.' },
        { ar: 'كل مرحلة: costs[phase] = base_hours * MULT[phase] ثم اطبع السطر بالصيغة المطلوبة في المتن نفسه.', en: 'Per phase: costs[phase] = base_hours * MULT[phase], then print the formatted line in the same body.' },
        { ar: 'النسبة قسمة صحيحة: costs[\'production\'] // costs[\'requirements\'] مع base_hours = 2 تعطي 200 // 2 = 100.', en: "The ratio is integer division: costs['production'] // costs['requirements'] with base_hours = 2 gives 200 // 2 = 100." },
        { ar: 'لو اختلفت الأرقام: 2 و10 و40 و100 و200 — كل قيمة مضاعفها 1 و5 و20 و50 و100 على الترتيب، والنسبة 100x.', en: 'If your numbers differ: 2, 10, 40, 100, 200 — each value is base × its multiplier 1, 5, 20, 50, 100, and the ratio is 100x.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-acceptance',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'اختبارات النظام كلها خضراء، ثم يجيء الزبون باختبارات القبول فتفشل ثلاثة منها. وفق سلّم V — ماذا يعني ذلك؟',
        en: 'All system tests pass; then the customer arrives with acceptance tests and three of them fail. Per the V ladder — what does this mean?',
      },
      options: [
        { id: 'a', text: { ar: 'اختبارات القبول أقل صرامة من النظام فلا بد أنها مصاغة خطأ', en: 'Acceptance tests are less strict than system tests, so they must be written wrong' } },
        { id: 'b', text: { ar: 'بنيتَ النظام صحيحًا وربما لم تبنِ النظام الصحيح: القبول يفحص حاجات الزبون، ويتفرقان حين تكون المواصفة نفسها خاطئة', en: 'You built the system right but possibly not the right system: acceptance checks the customer\u2019s needs, and the two diverge when the specification itself was wrong' } },
        { id: 'c', text: { ar: 'أعد تشغيل اختبارات النظام حتى يمر أربعون مرة — الثقة تتراكم', en: 'Rerun the system tests until they pass forty times — confidence accumulates' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'افصل سؤالين: هل بنيتَ النظام صحيحًا؟ وهل بنيتَ النظام الصحيح؟ كل منهما ذراع في الـ V.', en: 'Separate two questions: did you build the system right? And did you build the right system? Each is one arm of the V.' },
        { ar: 'اختبارات النظام تثبت المطابقة للمواصفة؛ اختبارات القبول تثبت أن المواصفة نفسها قابلت حاجة الزبون.', en: 'System tests prove conformance to the spec; acceptance tests prove the spec itself met the customer need.' },
        { ar: 'التناقض بين نظام أخضر وفشل القبول يشير إلى أعلى الذراع الأيسر في الـ V — المتطلبات لا التنفيذ.', en: 'Green system tests failing at acceptance point to the upper-left arm of the V — the requirements, not the code.' },
        { ar: 'الجواب b — بنيتَ النظام صحيحًا وربما لم تبنِ النظام الصحيح: فشل القبول يعالَج في ذراع المتطلبات.', en: 'Answer b — you built the system right but possibly not the right system: fix it on the requirements arm.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-integration',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'في سلّم الكلفة بالدرس: عيب قاعدة إصلاحه ساعتان اكتُشف في مرحلة implementation (المضاعف 20). كم تكلف إصلاحه بالساعات؟',
        en: 'In the lesson\u2019s cost ladder: a defect with a 2-hour baseline fix is discovered during the implementation phase (multiplier 20). What is its fix cost in hours?',
      },
      answer: '40',
      solution: '40',
      hints: [
        { ar: 'القاعدة: كلفة الاكتشاف = base_hours × مضاعف المرحلة.', en: 'The rule: discovery cost = base_hours × the phase multiplier.' },
        { ar: 'عوّض: 2 × 20.', en: 'Substitute: 2 × 20.' },
        { ar: 'للمقارنة: نفس العيب لو اكتُشف أثناء المتطلبات لتكلف 2h فقط.', en: 'For comparison: the same defect caught during requirements would cost only 2h.' },
        { ar: 'الجواب: 40', en: 'Answer: 40' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "V_PAIRS = [\n    ('requirements', 'acceptance'),\n    ('architecture', 'system'),\n    ('detailed design', 'integration'),\n    ('implementation', 'unit'),\n]\nfor left, right in V_PAIRS:\n    print('%s <-> %s' % (left, right))\n\nBASE_HOURS = 2\nMULT = {'requirements': 1, 'design': 5, 'implementation': 20, 'testing': 50, 'production': 100}\nfor phase in MULT:\n    print('caught in %s cost: %dh' % (phase, BASE_HOURS * MULT[phase]))\n\n# جرّب: ثبّت BASE_HOURS = 5 — هل تتغير النسبة بين الإنتاج والمتطلبات؟ لماذا؟\n# try: set BASE_HOURS = 5 — does the production-to-requirements ratio change? why?\n# جرّب: أنشئ زوجًا جديدًا للمرآة بمستوى خامس تتخيله (مثل ops) — أي مستوى اختبار يقابله؟\n# try: invent a fifth mirror pair for a level you imagine (say ops) — which test level pairs?\n",
      prompt: {
        ar: 'الملعب يضع المرآة والسلّم جنبًا إلى جنب — انظر كيف يتصاعد السطر الأخير أضعاف الأول بينما الزوجان من نفس الـ V. ثم العب: غيّر BASE_HOURS ولاحظ أن الشكل لا يتغير (النسبة ثابتة) — لأن الحجة في المضاعفات لا في القاعدة. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox puts the mirror and the ladder side by side — watch the last line dwarf the first while both pairs belong to the same V. Then play: change BASE_HOURS and notice the shape does not change (the ratio holds) — the argument lives in the multipliers, not the baseline. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في شلال صارم: متى تعرف أول مرة هل يعمل النظام فعلًا؟',
            en: 'In a strict waterfall: when do you first learn whether the system actually works?',
          },
          options: [
            { id: 'a', text: { ar: 'عند اعتماد كل مرحلة — التوقيعات تضمن الصحة', en: 'At each phase sign-off — the signatures guarantee correctness' } },
            { id: 'b', text: { ar: 'قرب النهاية عند الدمج والاختبار — بالضبط حين يتبقى أقل وقت ومال للإصلاح', en: 'Near the end, at integration and testing — exactly when the least time and money remain to fix it' } },
            { id: 'c', text: { ar: 'أثناء جمع المتطلبات لأن المراجعات تكشف كل شيء', en: 'During requirements gathering, because reviews reveal everything' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشلال يخفي المشكلات حتى أغلى لحظة: القطع تُبنى منفردة وتلتقي أول مرة قرب النهاية، فتبدو لوحات الحالة خضراء حتى أسبوع الدمج. تأجيل الدمج والاختبار لا يزيل الخطر — يركّزه حيث يضر أكثر.',
            en: 'Waterfall hides problems until the costliest moment: pieces are built separately and first meet near the end, so dashboards stay green right up to integration week. Deferring integration and testing does not remove risk — it concentrates it where it does the most damage.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا يصعب فكّ دمج الانفجار الكبير مقارنة بالدمج التدريجي؟',
            en: 'Why is untangling big-bang integration so much harder than incremental integration?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن كل الافتراضات المتضاربة بين المكونات تظهر دفعة واحدة وتتفاعل، بدل خلل واحد صغير في كل مرة', en: 'Because every mismatched assumption between components surfaces at once and interacts, instead of one small mismatch at a time' } },
            { id: 'b', text: { ar: 'لأن الدمج الجامع يشغّل اختبارات أقل بالضرورة', en: 'Because big-bang integration necessarily runs fewer tests' } },
            { id: 'c', text: { ar: 'لأنه يحتاج مواصفات أطول', en: 'Because it requires longer specifications' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'متر ينتظر أمتارًا وآخر ينتج أقدام، وقائمة افترض أحدهم أنها مرتبة ولم يعد الآخر بذلك — كل هذا يظهر معًا ويتشابك، فتصبح قراءة الأسباب والنتائج جحيمًا. الدمج التدريجي يجعل كل تغيير صغيرًا معلوم السبب: هذا مبدأ الدمج المستمر الذي رأيته في XP وفصل التسليم.',
            en: 'One module expecting meters while another produces feet, one assuming a sorted list the other never promised — all of it surfaces together and interlocks, making cause-and-effect unreadable. Incremental integration keeps each change small and attributable: the same principle behind the continuous integration you saw in XP and the delivery chapter.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي اقتران في مرآة V صحيح؟',
            en: 'Which pairing in the V-model mirror is correct?',
          },
          options: [
            { id: 'a', text: { ar: 'المعمارية ↔ اختبارات الوحدة', en: 'Architecture ↔ unit tests' } },
            { id: 'b', text: { ar: 'التصميم التفصيلي ↔ اختبارات التكامل — فهي تفحص أن القطع تتلاءم كما ادّعى التصميم', en: 'Detailed design ↔ integration tests — they check the pieces fit as the design claimed' } },
            { id: 'c', text: { ar: 'المتطلبات ↔ اختبارات النظام', en: 'Requirements ↔ system tests' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المرآة كاملة: implementation ↔ unit، وdetailed design ↔ integration، وarchitecture ↔ system، وrequirements ↔ acceptance. كل زوج يعني: خطط هذا الاختبار وأنت تصمم ذلك المستوى، فالأخطاء المختلفة تُمسك عند مستويات مختلفة.',
            en: 'The full mirror: implementation ↔ unit, detailed design ↔ integration, architecture ↔ system, requirements ↔ acceptance. Each pair means: plan this test while designing that level, since different mistakes are caught at different levels.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل التاسع: من علاجات الشلال "راجع المتطلبات والتصاميم بصرامة قبل البناء عليها". ما اسم التقنية التي أعطاك إياها ذلك الفصل لهذا الفحص المنظم؟',
            en: 'From chapter nine: one waterfall mitigation is "review requirements and designs rigorously before building on them". What is the name of the structured review technique that chapter taught?',
          },
          options: [
            { id: 'a', text: { ar: 'اختبارات التوصيف — ترصد السلوك وتثبته', en: 'Characterization tests — they observe and pin behavior' } },
            { id: 'b', text: { ar: 'الفحوص Inspections — مراجعة منظمة للمستندات والشيفرة قبل البناء عليها', en: 'Inspections — structured reviews of documents and code before building on them' } },
            { id: 'c', text: { ar: 'خرائط التلال — نقاط تتحرك على تل', en: 'Hill charts — dots moving on a hill' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حين لا تستطيع الاعتماد على اختبار متأخر لإمساك أخطاء مبكرة، تصير الفحوص — المراجعات المنظمة — التأمين الرخيص عند كل حد مرحلة. أما اختبارات التوصيف فأداة الفصل الخامس عشر للشيفرة العتيقة، وخرائط التلال من Shape Up في هذا الفصل.',
            en: 'When you cannot rely on late testing to catch early mistakes, inspections — structured reviews — are the cheap insurance at every phase boundary. Characterization tests are the chapter-fifteen tool for legacy code, and hill charts belong to Shape Up later in this chapter.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'الشلال آمن لأن كل مرحلة تُعتمد رسميًا قبل التالية',
          right: 'الاعتماد يوقّع على الورق لا على الواقع — أول تلامس حقيقي للنظام عند الدمج في النهاية حيث أقل وقت ومال',
          note: {
            ar: 'التوقيع لا يجرب الافتراضات بين المكونات؛ لا شيء يعرف هل يعمل النظام كله قبل أن يجتمع كله. ولهذا يمكن لمشروع أن يبدو سليمًا عشرة أشهر ثم ينهار في أسبوع — المخاطر لم تُعالج بل أُخفيت حتى آخر لحظة.',
            en: 'A sign-off validates paper, not reality; nothing knows whether the whole system works until the whole system meets. That is how a project can look healthy for ten months and collapse in a week — the risks were not handled, just hidden until the last moment.',
          },
        },
        {
          wrong: 'ندمج كل شيء في الأسبوع الأخير لنوفر وقت الدمج المتكرر',
          right: 'الدمج التدريجي يكشف عدم تطابق واحدًا واحدًا — والدمج الجامع يكشفها كلها دفعة واحدة متشابكة',
          note: {
            ar: 'توفير الوقت وهمي: ساعات الدمج المتكرر أرخص من أسابيع فك تشابك أعطال متفاعلة قرب الموعد. نفس المنطق الذي يجعل كل طريقة تكرارية تسحب الاكتشاف يسارًا — اكتشف الخطأ وهو رخيص.',
            en: 'The savings are illusory: hours of frequent integration cost less than weeks untangling interacting failures near the deadline. It is the same logic behind every iterative method sliding discovery leftward — find the mistake while it is cheap.',
          },
        },
        {
          wrong: 'اختبارات النظام خضراء إذن المنتج صحيح ويمكن إطلاقه',
          right: 'النظام صحيح ≠ النظام الصحيح: القبول يقيس حاجة الزبون — ويتفرقان حين تكون المواصفة نفسها خاطئة',
          note: {
            ar: 'نجاح اختبارات النظام يثبت المطابقة للمواصفة فقط. لو كانت المواصفة خطأ الشهر الأول فستجتاز كل اختبارات النظام وتفشل عند الزبون — أغلى عيب في المنحنى، والوحيد الذي لا يصلح باختبارات أكثر بل بعودة إلى الذراع الأيسر.',
            en: 'Passing system tests only proves conformance to the spec. If the spec carried a month-one mistake, every system test will pass and the customer will still reject it — the most expensive defect on the curve, and the only one no amount of extra testing fixes: it loops back to the left arm.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الشلال تمريرة واحدة بمراحل معتمدة: جاذبه البساطة والتخطيط والفوترة، وينجح فقط حيث المتطلبات مستقرة والمسألة مفهومة. عيبه البنيوي أن يكتشف خطأه متأخرًا: دمج الانفجار الكبير يكشف كل الافتراضات المتضاربة دفعة، وأخطاء الشهر الأول تظهر في الشهر العاشر.', en: 'Waterfall is a single pass with signed-off phases: seductively simple, easy to plan and bill, fine only where requirements are stable and the problem is understood. Its structural flaw is late discovery: big-bang integration surfaces every mismatched assumption at once, and month-one mistakes appear in month ten.' },
        { ar: 'منحنى كلفة التغيير يرتفع حدّةً مع تأخر الاكتشاف — خطأ المتطلبات شبه مجاني أثناء المتطلبات وقد يبلغ نحو مئة ضعف بعد الإطلاق — فتؤجيل الاكتشاف إلى النهاية اقتصاديًا مقلوبة، وكل الطرق التكرارية استراتيجيات لإزاحة الاكتشاف يسارًا. وعلاجات الشلال القسري (نمذجة الأجزاء الخطرية، فحوص الحدود، دمج تدريجي، شلالات صغيرة) كلها تسحبه نحو التكرار.', en: 'The cost-of-change curve rises steeply with discovery time — a requirements error is nearly free during requirements and can approach a hundred-fold after release — so deferring discovery is economically backwards, and every iterative method is a strategy for sliding discovery leftward. Even waterfall\u2019s forced-shape mitigations (prototyping risky parts, boundary reviews, incremental integration, small waterfalls) all pull it toward iteration.' },
        { ar: 'عرض V يجعل الاختبار مواطنًا أولى: مرآة تربط implementation ↔ unit وdetailed design ↔ integration وarchitecture ↔ system وrequirements ↔ acceptance — خطط الاختبار أثناء التصميم. سلّمه الأربعة أسئلته: هل يفعل ما يقوله تصميمه؟ هل تتلاءم القطع؟ هل يفي بالمواصفة؟ هل بنينا الشيء الصحيح؟ — سلمٍ تستعمله كل العمليات، والرشيقة تديره باستمرار لا بمرحلة نهائية.', en: 'The V-model makes testing first-class: a mirror tying implementation ↔ unit, detailed design ↔ integration, architecture ↔ system, requirements ↔ acceptance — plan tests while designing. Its four-level ladder asks: does the piece match its design? do the pieces fit? does the system meet the spec? did we build the right thing? — a ladder every process climbs, agile teams running it continuously rather than as a final phase.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وتتبّع السلم بعينك من 2h إلى 200h. ثم اسأل نفسك: في آخر مشروع سمعت عنه تعثّر — في أي مرحلة اكتُشف الخطأ فعلًا، وكم تأخر عن مرحلته؟',
        en: 'Open the sandbox and trace the ladder with your eyes from 2h to 200h. Then ask yourself: in the last troubled project you heard about — at which phase was the mistake actually discovered, and what would it have cost caught at its own phase?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch2.s4', pages: 'ص43-45 / pp.43-45' },
        { book: 'SWE', section: 'swe.ch2.s5', pages: 'ص46-48 / pp.46-48' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch2.s4', pages: 'ص43-45 / pp.43-45' },
    { book: 'SWE', section: 'swe.ch2.s5', pages: 'ص46-48 / pp.46-48' },
  ],
} satisfies Lesson;

export default lesson;
