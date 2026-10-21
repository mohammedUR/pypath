import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch1.l3 — "The Iron Triangle and Social Responsibility"
 * مثلث القيود والمسؤولية الاجتماعية
 * Aligned with SWE ch1 s5 (Balancing Constraints: The Iron Triangle, pp.24-25) +
 * s6 (Social Responsibility, pp.25-26).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: a deterministic tradeoff advisor (capacity = time * cost;
 * fix any two corners, compute the forced third) + a fixed crunch-debt trace
 * and a responsibility checklist gate — pure fixed-data arithmetic.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
const lesson = {
  id: 'swe.ch1.l3',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 1,
  title: { ar: 'مثلث القيود والمسؤولية الاجتماعية', en: 'The Iron Triangle and Social Responsibility' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch1.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'مديرك يريد خمس ميزات إضافية، قبل شهرين، بلا توظيف جديد — ويصف ذلك طموحًا. هذا الدرس يمنحك الأداة التي ترد بها بهدوء: المثلث الحديدي — النطاق والكلفة والزمن قيود مترابطة لا يمكنك تثبيتها ثلاثتها، ومن يطلب الثلاثة يطلب حسابًا مستحيلًا. ثم يذهب الدرس أبعد من الجدولة: قراراتك الهندسية قرارات أخلاقية. سيارة فولكسفاغن حققت مواصفتها تمامًا — وكانت فضيحة؛ وجهاز Therac-25 قتل مرضى بسلسلة أخطاء يعرفها كل مهندس. بنهاية الدرس ستكون قادرًا على: حساب الركن المفروض حين يثبَّت اثنان، وتسمية اختيار أجايل داخل المثلث، واستعمال مدونة ACM أساسًا قابلًا للاقتباس لقول لا — ومعرفة لماذا «أنا نفذت المواصفة» ليس دفاعًا.',
        en: 'Your manager wants five more features, two months earlier, with no new hires — and calls it ambition. This lesson hands you the tool that answers calmly: the iron triangle — scope, cost and time are coupled constraints you cannot pin all three of, and whoever demands all three demands impossible arithmetic. Then the lesson goes beyond scheduling: your engineering decisions are ethical decisions. A Volkswagen satisfied its specification exactly — and was a scandal; the Therac-25 killed patients with a chain of failures every engineer recognizes. By the end you will be able to: compute the forced third corner when two are fixed, name agile\u2019s choice inside the triangle, and use the ACM Code as a citable basis for saying no — knowing why "I was just implementing the spec" is no defense.',
      },
    },
    {
      kind: 'predict',
      code: "scope = 10      # features demanded\ntime = 4        # months\ncost = 2        # developers\ncapacity = time * cost\nprint('capacity: %d' % capacity)\nprint('shortfall: %d' % (scope - capacity))",
      question: {
        ar: 'عشرة ميزات مطلوبة في أربعة أشهر بمطورين اثنين — وكل ميزة تستهلك شهر مطور واحد. ماذا يطبع السطر الثاني، وأي ركن سيصرف الفجوة إن لم تختره أنت؟',
        en: 'Ten features demanded in four months with two developers — each feature consumes one developer-month. What does the second line print, and which corner will absorb the gap if you do not choose one?',
      },
      reveal: {
        ar: 'shortfall: 2 — الفجوة ميزتان ولن تختفي بالأمنيات: سعة الفريق ثمانية أشهر-مطور والمطلوب عشرة. إن لم تختر الركن الذي ينصرف — قصّ النطاق أو تحريك التاريخ أو التوظيف — انصرف الوحيد منك: الجودة تُقتطع بصمت من كل ميزة. هذه جملة المثلث الحديدي كلها.',
        en: 'shortfall: 2 — the gap is two features and wishes will not dissolve it: the team\u2019s capacity is eight developer-months against ten demanded. If you do not choose which corner gives — cut scope, move the date, or hire — the choice makes itself: quality is silently shaved off every feature. That is the iron triangle in one sentence.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'المثلث الحديدي: اختر اثنين', en: 'The iron triangle: pick any two' },
      chunks: [
        {
          ar: 'كل مشروع يعمل تحت ثلاثة قيود مترابطة: النطاق — كم يفعل النظام (الميزات والجودة)، والكلفة — كم يستهلك من جهد ومال، والزمن — متى يشحن. وهي مقيدة: لا يمكنك تثبيت الثلاثة بحرية. نطاق أكثر في الزمن نفسه؟ ادفع كلفة أكثر (أشخاص وأدوات). شحن أسرع بلا كلفة إضافية؟ قلّص النطاق. القول المأثور — جيد وسريع ورخيص: اختر اثنين — يلخّص الواقع أن الجودة ليست مجانية، وأن المدير الذي يطلب مزيدًا من النطاق عاجلًا وبكلفة أقل إنما يستبدل بالحساب طموحًا.',
          en: 'Every project runs under three coupled constraints: scope — how much the system does (features and quality), cost — how much effort and money it consumes, and time — when it must ship. They are linked: you cannot freely fix all three. More scope at the same time? Pay more cost (people, tools). Shipping sooner without extra cost? Cut scope. The classic quip — good, fast, cheap: pick two — captures the reality that quality is not free, and that a manager demanding more scope, sooner, for less is mistaking innumeracy for ambition.',
        },
        {
          ar: 'وأساليب أجايل تختار صراحة داخل المثلث: تثبت الزمن والكلفة — تكرار محدد الطول بفريق ثابت — وتترك النطاق مرنًا، والهدف أن تشحن شيئًا ذا قيمة في الموعد حتى لو لم يكتمل كل شيء. أما الأساليب المخططة فتثبت النطاق غالبًا وتترك الزمن مرنًا. وفخ يكرره الواقع: ابتلاع زيادة النطاق بصمت بالعمل ليلًا — crunch — لا يحل المقايضة بل يخفيها: اقتراض من الجودة القادمة يُسدَّد بفوائد عيوب وإنهاك. وأدوات المقايضة — نقاط القصص وMoSCoW وترتيب قيمة/كلفة/خطر — قادمة في فصلي العملية والتقدير.',
          en: 'Agile methods make a deliberate choice inside the triangle: fix time and cost — a fixed-length iteration with a fixed team — and let scope flex, aiming to ship something valuable on the date even if not everything. Plan-driven methods more often fix scope and let time flex. And a recurring trap: silently absorbing a scope increase by working nights — crunch — does not resolve the trade-off, it hides it: a loan against future quality repaid with interest as defects and burnout. The trade-off tools — story points, MoSCoW, value/cost/risk ranking — arrive in the process and estimation chapters.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المسؤولية الاجتماعية: المواصفة ليست درعًا', en: 'Social responsibility: the spec is no shield' },
      chunks: [
        {
          ar: 'البرمجيات تشغّل أجهزة طبية وسيارات وانتخابات وأنظمة مالية — فالقرارات الهندسية قرارات أخلاقية، و«أنا نفذت المواصفة فقط» ليس دفاعًا. فضيحة انبعاثات فولكسفاغن 2015: جهاز تحايل في الديزل يكتشف إجراء اختبار الانبعاثات من أنماط المقود والسرعة والزمن، فيتحول إلى وضع أنظف أخفض أداء أثناء الاختبار فقط، وعلى الطريق يطلق أكاسيد نيتروجين بأضعاف الحد القانوني. البرمجية عملت تمامًا كما صُممت — وهذه هي المشكلة: لم يكن فشل اختبارات، بل متطلبًا ما كان يجب تنفيذه أصلًا. مهندسون كتبوا تلك الشيفرة. نظام يحقق مواصفته قد يكون فاسدًا أخلاقيًا — وعلى المحترف أحيانًا أن يرفض أن يبني ما يُطلب منه.',
          en: 'Software runs medical devices, cars, elections and financial systems — so engineering decisions are ethical decisions, and "I was just implementing the spec" is no defense. The 2015 Volkswagen emissions scandal: a defeat device in diesels detected the emissions test from steering, speed and time patterns, switching to a cleaner lower-performance mode only during the test — and on the road emitted nitrogen oxides many times the legal limit. The software worked exactly as designed — and that is the problem: not a testing failure but a requirement that should never have been implemented. Engineers wrote that code. A system can satisfy its specification and still be ethically wrong — and a professional must sometimes refuse to build what they are asked to build.',
        },
        {
          ar: 'والمهنة كتبت معاييرها: مدونة ACM للأخلاقيات والسلوك المهني والمدونة المشتركة ACM/IEEE-CS لهندسة البرمجيات تنص — بين مبادئ أخرى — على العمل في المصلحة العامة، وإنتاج عمل عالي الجودة، والصدق عن عملك وحدوده، والحفاظ على الكفاءة. وليست زينة: تمنحك أساسًا مشتركًا قابلًا للاقتباس لقول لا ولرفع مخاوفك بلا أن تصير رأيًا شخصيًا. أما Therac-25 بين 1985 و1987: جهاز علاج إشعاعي أوصل جرعات قاتلة إلى ستة مرضى على الأقل. الأسباب كتاب دروس: حالة سباق تظهر حين يكتب المشغّل بسرعة؛ وإزالة الحواجز المادية التي كانت شبكة الأمان في الطرازات السابقة فبقي البرنامج الحارس الوحيد؛ وشيفرة موروثة لم تُصمم لهذه التركيبة؛ ورسائل خطأ مضللة؛ وثقافة افترضت صحة البرنامج ورفضت تقارير الميدان. في الأنظمة الحرجة للسلامة عيوبُ البرمجيات تقتل — والعملية والاختبار والاستجابة الصادقة للحادث مسألة حياة وموت لا أعباء بيدقراطية.',
          en: 'The profession has written its norms: the ACM Code of Ethics and the joint ACM/IEEE-CS Software Engineering Code state — among other principles — act in the public interest, produce high-quality work, be honest about your work and its limitations, and maintain competence. They are not decoration: they give a shared, citable basis for saying no and raising concerns without it being mere personal opinion. And Therac-25, 1985-1987: a radiation-therapy machine delivered massive overdoses to at least six patients. The causes are a textbook: a race condition surfacing when the operator typed quickly; removal of the hardware interlocks that backed up earlier models, leaving software the sole safeguard; reused code never designed for this configuration; misleading error messages; and a culture that assumed the software correct and dismissed field reports. In safety-critical systems software defects kill — process, testing and honest incident response are life and death, not bureaucracy.',
        },
        {
          ar: 'وخمسة دروس تتكرر عبر القضايا: ابنِ الشيء الصحيح لا الشيء الصحّ فقط — شكّك في متطلب يؤذي المستخدمين أو الجمهور؛ ولا تعتمد على حاجز واحد — دفاع بطبقات: حواجز مادية وفحوص برمجية، ومراجعات واختبارات؛ وخذ تقارير الميدان بجدية — الشذوذ المرفوض فشلٌ ينتظر التكرار؛ والتزامن وإعادة الاستخدام مضاعفا خطر يستحقان صرامة إضافية؛ وأنت مسؤول عمّا تشحنه مهما كان مَن طلب.',
          en: 'Five lessons recur across the cases: build the right thing, not only the thing right — challenge requirements that would harm users or the public; do not rely on a single safeguard — defense in depth: hardware interlocks and software checks, reviews and tests; take field reports seriously — a dismissed anomaly is a failure waiting to recur; concurrency and reuse are risk multipliers deserving extra rigor; and you are accountable for what you ship, regardless of who asked for it.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مستشار المقايضة: اثنان ثابتان والثالث مفروض', en: 'The tradeoff advisor: two fixed, one forced' },
      code: "def advisor(scope, time, cost, flex):\n    # exactly two corners are fixed; the named one must move\n    if flex == 'scope':\n        return 'max scope: %d' % (time * cost)\n    if flex == 'time':\n        return 'min time: %.1f months' % (scope / cost)\n    return 'min cost: %.1f devs' % (scope / time)\n\nprint(advisor(10, 4, 2, 'scope'))\nprint(advisor(10, 4, 2, 'time'))\nprint(advisor(10, 4, 2, 'cost'))",
      explanation: {
        ar: 'الطلب نفسه بثلاث صيغ: 10 ميزات، 4 أشهر، مطوران — والسعة 8 أشهر-مطور لا تكفي. حين تُسمح بالنطاق تصير السعة 8 ميزات؛ وحين يثبت النطاق ويُسمح للزمن تحتاج 5.0 أشهر؛ وحين يثبت النطاق والزمن تحتاج 2.5 مطور — وواقعيًا توظف 3 أو تمدد الزمن لأن نصف إنسان غير موجود. والنموذج حساب ثابت لا عشوائية فيه، وقيمته أنه يجعل المقايضة مرئية بآحاد لا بمشاعر: أي محادثة مع أصحاب المصلحة تبدأ بسؤال «أي ركن ينصرف؟» وتنتهي بعقد صادق بدل crunch صامت. ولاحظ: المستشار لا يقرر بدلًا منك — يعرض ثمن كل خيار والقرار إنساني.',
        en: 'The same demand in three readings: 10 features, 4 months, 2 developers — and the 8 developer-month capacity falls short. Let scope give and capacity becomes 8 features; fix scope and let time give and you need 5.0 months; fix scope and time and you need 2.5 developers — realistically you hire 3 or stretch the calendar, because half a person does not exist. The model is fixed arithmetic with no randomness, and its value is making the trade-off visible in units, not feelings: any stakeholder conversation that starts with which corner gives ends with an honest contract instead of silent crunch. Note: the advisor does not decide for you — it prices each option, and the decision stays human.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.advisor',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ المستشار كدالة: advisor(scope, time, cost, flex) تعيد القيمة المفروضة للركن المسمّى — النطاق الأقصى time*cost، أو الزمن الأدنى scope/cost، أو الكلفة الدنيا scope/time — وترفع ValueError لقيمة flex مجهولة. اطبع الأسطر الثلاثة بالصيغ scope flex: %d وtime flex: %.1f وcost flex: %.1f مع (10، 4، 2)، وأكّد بـ assert أن النطاق 8 والزمن 5.0 والكلفة 2.5.',
        en: 'Implement the advisor as a function: advisor(scope, time, cost, flex) returns the value forced onto the named corner — max scope time*cost, or min time scope/cost, or min cost scope/time — and raises ValueError for an unknown flex. Print the three lines formatted scope flex: %d, time flex: %.1f, cost flex: %.1f with (10, 4, 2), and assert scope is 8, time is 5.0, cost is 2.5.',
      },
      starterCode: "def advisor(scope, time, cost, flex):\n    # TODO: flex == 'scope' -> return time * cost\n    # TODO: flex == 'time'  -> return scope / cost\n    # TODO: flex == 'cost'  -> return scope / time\n    # TODO: otherwise raise ValueError('unknown flex')\n    ...\n\n# TODO: print the three lines: scope flex: %d, time flex: %.1f, cost flex: %.1f\n# TODO: assert advisor(10, 4, 2, 'scope') == 8, time == 5.0, cost == 2.5\n",
      solution: "def advisor(scope, time, cost, flex):\n    if flex == 'scope':\n        return time * cost\n    if flex == 'time':\n        return scope / cost\n    if flex == 'cost':\n        return scope / time\n    raise ValueError('unknown flex')\n\nprint('scope flex: %d' % advisor(10, 4, 2, 'scope'))\nprint('time flex: %.1f' % advisor(10, 4, 2, 'time'))\nprint('cost flex: %.1f' % advisor(10, 4, 2, 'cost'))\n\nassert advisor(10, 4, 2, 'scope') == 8\nassert advisor(10, 4, 2, 'time') == 5.0\nassert advisor(10, 4, 2, 'cost') == 2.5",
      tests: [
        {
          id: 't1',
          name: { ar: 'الدالة تعمم على أرقام لم تُطبع', en: 'The function generalizes to unprinted numbers' },
          code: "assert advisor(12, 3, 2, 'scope') == 6 and advisor(10, 5, 2, 'time') == 5.0, 'expected: 6 and 5.0 | actual: %r' % ((advisor(12, 3, 2, 'scope'), advisor(10, 5, 2, 'time')),)",
          expected: '6 and 5.0',
        },
        {
          id: 't2',
          name: { ar: 'أسطر الطباعة الثلاثة صحيحة', en: 'All three printed lines are correct' },
          code: "assert 'scope flex: 8' in __learner_output__ and 'time flex: 5.0' in __learner_output__ and 'cost flex: 2.5' in __learner_output__, 'expected: 8 / 5.0 / 2.5 lines | actual: %r' % __learner_output__",
          expected: '8 / 5.0 / 2.5 lines',
        },
        {
          id: 't3',
          name: { ar: 'الفرع المجهول يرفض بصوت عالٍ', en: 'The unknown branch refuses loudly' },
          code: "assert advisor(9, 3, 3, 'cost') == 3.0, 'expected: 3.0 | actual: %r' % advisor(9, 3, 3, 'cost')",
          expected: '3.0',
        },
      ],
      hints: [
        { ar: 'المستشار يعيد قيمة عددية لا جملة — والتنسيق يحدث في الطباعة الرئيسة: %d للنطاق الصحيح و%.1f للكسور.', en: 'The advisor returns a numeric value, not a sentence — formatting happens at the main print: %d for integer scope, %.1f for fractions.' },
        { ar: 'scope / cost وscope / time قسمة عشرية في بايثون: 10 / 4 = 2.5 و10 / 2 = 5.0 — لا تستبدلها بقسمة صحيحة.', en: 'scope / cost and scope / time are true division in Python: 10 / 4 = 2.5 and 10 / 2 = 5.0 — do not swap in integer division.' },
        { ar: 'الهيكل:\nif flex == \'scope\':\n    return time * cost\nif flex == \'time\':\n    return scope / cost\nif flex == \'cost\':\n    return scope / time\nraise ValueError(\'unknown flex\')', en: "The skeleton:\nif flex == 'scope':\n    return time * cost\nif flex == 'time':\n    return scope / cost\nif flex == 'cost':\n    return scope / time\nraise ValueError('unknown flex')" },
        { ar: 'الفرع الأخير ليس else سكوتًا: الترفيع ValueError يوقف التنفيذ برسالة واضحة بدل إعادة None صامتة — والمستشار الأمين يرفض المدخل المجهول.', en: 'The final branch is not a silent else: raising ValueError stops execution with a clear message instead of returning None — an honest advisor refuses unknown input.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-crunch',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقع خرجه سطرًا لكل طباعة: فريق يبتلع زيادة نطاق بصمت بالسهر — سرعته تنقص 2 كل سبرنت حتى الصفر، ودينه يزيد 3 كل سبرنت. ماذا تطبع الحلقة؟',
        en: 'Read the code and predict its output — one line per print: a team silently absorbs a scope increase by crunching — its velocity drops by 2 each sprint, floored at zero, while its debt grows by 3 each sprint. What does the loop print?',
      },
      code: "debt = 0\nvelocity = 8\nfor sprint in [1, 2, 3, 4]:\n    velocity = max(0, velocity - 2)\n    debt = debt + 3\n    print('s%d velocity: %d debt: %d' % (sprint, velocity, debt))",
      solution: "s1 velocity: 6 debt: 3\ns2 velocity: 4 debt: 6\ns3 velocity: 2 debt: 9\ns4 velocity: 0 debt: 12",
      answer: "s1 velocity: 6 debt: 3\ns2 velocity: 4 debt: 6\ns3 velocity: 2 debt: 9\ns4 velocity: 0 debt: 12",
      hints: [
        { ar: 'السرعة: 8 ثم 6 ثم 4 ثم 2 ثم 0 — وmax يثبّتها عند الصفر في السبرنت الرابع.', en: 'Velocity: 8, then 6, then 4, then 2, then 0 — max pins it at zero in the fourth sprint.' },
        { ar: 'الدين يتراكم بلا سقف: 3 بعد كل سبرنت — 3 و6 و9 و12.', en: 'Debt accumulates with no cap: +3 after each sprint — 3, 6, 9, 12.' },
        { ar: 'الطباعة بعد التحديثين — فالسطر الأول يعرض القيم الجديدة s1 velocity: 6 debt: 3.', en: 'The print comes after both updates — so the first line shows the new values s1 velocity: 6 debt: 3.' },
        { ar: 'الخرج الكامل:\ns1 velocity: 6 debt: 3\ns2 velocity: 4 debt: 6\ns3 velocity: 2 debt: 9\ns4 velocity: 0 debt: 12', en: "The full output:\ns1 velocity: 6 debt: 3\ns2 velocity: 4 debt: 6\ns3 velocity: 2 debt: 9\ns4 velocity: 0 debt: 12" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-vw',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'فضيحة فولكسفاغن: النظام حقق مواصفته تمامًا، وفحوصه المرئية كلها نجحت. لماذا لم تكن اختبارات أفضل كافية لمنع الفضيحة؟',
        en: 'The Volkswagen scandal: the system satisfied its specification exactly, and every visible check passed. Why would better testing not have prevented the scandal?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن الاختبارات لم تغطِ أنماط القيادة على الطريق', en: 'Because the tests did not cover on-road driving patterns' } },
        { id: 'b', text: { ar: 'لأن العيب لم يكن في التنفيذ بل في المتطلب نفسه — مطلبٌ ما كان يجب تنفيذه أصلًا، وعلى المهني أحيانًا أن يرفض البناء', en: 'Because the defect was not in the implementation but in the requirement itself — a demand that should never have been implemented, and a professional must sometimes refuse to build' } },
        { id: 'c', text: { ar: 'لأن الفاحصين كانوا من الشركة نفسها', en: 'Because the testers worked for the same company' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'الدرس يقولها حرفيًا: البرمجية عملت تمامًا كما صُممت — وهذه هي المشكلة.', en: 'The lesson says it literally: the software worked exactly as designed — and that is the problem.' },
        { ar: 'اختبار أفضل يتحقق من «بناء الشيء صح» — لكن الفساد هنا في «أي شيء نبنيه» أصلًا.', en: 'Better testing verifies building the thing right — but the corruption here is in which thing to build in the first place.' },
        { ar: 'لهذا مبدأ المهنة: ابنِ الشيء الصحيح لا الشيء الصحّ فقط — وعلى المحترف رفض متطلب يؤذي الجمهور.', en: 'Hence the professional principle: build the right thing, not only the thing right — and refuse requirements that harm the public.' },
        { ar: 'الجواب: b — متطلب ما كان يجب تنفيذه، ولا اختبار يطارد ما لم يكن عيب تنفيذ أصلًا.', en: 'Answer: b — a requirement that should never have been implemented; no test hunts a defect that is not one of implementation.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-depth',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'املأ الفرز بكلمة إنجليزية واحدة من درس Therac-25: لا تعتمد على حاجز واحد — الدفاع في العمق: defense in ____ (حواجز متعددة متداخلة: مادية وبرمجية، ومراجعات واختبارات).',
        en: 'Fill the blank with one English word from the Therac-25 lesson: do not rely on a single safeguard — defense in ____ (multiple overlapping layers: hardware and software, reviews and tests).',
      },
      answer: 'depth',
      solution: 'depth',
      hints: [
        { ar: 'أزال Therac-25 الحواجز المادية فبقي البرنامج الحارس الوحيد — فحصلت الجرعات القاتلة.', en: 'Therac-25 removed the hardware interlocks, leaving software the sole safeguard — and the overdoses followed.' },
        { ar: 'الدرس الخامس من قضايا الدرس: دفاع بطبقات متداخلة لا حاجز مفرد مهما كان قويًا.', en: 'The fifth lesson from the cases: defense in layers, not a single safeguard however strong.' },
        { ar: 'والمفردة الإنجليزية نفسها عادت في فصل الأمن: الطبقات المتعددة تحمي أحدها الآخر.', en: 'The same English term returned in the security chapter: multiple layers protect one another.' },
        { ar: 'الجواب: depth', en: 'Answer: depth' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def advisor(scope, time, cost, flex):\n    if flex == 'scope':\n        return time * cost\n    if flex == 'time':\n        return scope / cost\n    if flex == 'cost':\n        return scope / time\n    raise ValueError('unknown flex')\n\nprint(advisor(10, 4, 2, 'scope'))\nprint(advisor(10, 4, 2, 'time'))\nprint(advisor(10, 4, 2, 'cost'))\n\nCHECK = {'public_interest': True, 'honest': True, 'safe': True}\nflags = [name for name in sorted(CHECK) if not CHECK[name]]\nprint('review:', ','.join(flags) if flags else 'clear')\n\n# جرّب: اجعل safe تساوي False — ماذا يصير سطر review؟ هذه بذرة بوابة المسؤولية في مشروع الدرس القادم.\n# try: flip safe to False — what does the review line become? that is the seed of next lesson's responsibility gate.\n# جرّب: احسب ماذا يصير الزمن لو زاد النطاق إلى 12 بثبات الكلفة.\n# try: compute what time becomes if scope grows to 12 at fixed cost.\n",
      prompt: {
        ar: 'الملعب يضع المثلث والبوصلة الأخلاقية معًا: حرّك الأركان الثلاثة وشاهد الثالث يُحسب رغمًا، وقلب راية واحدة في قائمة المسؤولية وشاهد الحكم ينقلب. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox puts the triangle and the ethical compass side by side: move any two corners and watch the third get computed anyway; flip one flag in the responsibility list and watch the verdict flip. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أجايل داخل المثلث الحديدي تثبت أي ركنين وتترك الثالث مرنًا؟',
            en: 'Inside the iron triangle, which two corners do agile methods fix, leaving the third to flex?',
          },
          options: [
            { id: 'a', text: { ar: 'الزمن والكلفة — والنطاق ينصرف', en: 'Time and cost — scope flexes' } },
            { id: 'b', text: { ar: 'النطاق والزمن — والكلفة تنصرف', en: 'Scope and time — cost flexes' } },
            { id: 'c', text: { ar: 'النطاق والكلفة — والزمن ينصرف', en: 'Scope and cost — time flexes' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'تكرار محدد الطول بفريق ثابت: الزمن والكلفة مثبتان والنطاق هو المتغير — الهدف شحن شيء ذي قيمة في الموعد. أما المخططة فتثبت النطاق غالبًا وتترك الزمن مرنًا — ولا شيء يثبت الثلاثة.',
            en: 'A fixed-length iteration with a fixed team: time and cost pinned, scope is the variable — the aim is shipping something valuable on the date. Plan-driven methods usually pin scope and let time flex — and nothing pins all three.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن فصل الأمن: مبدأ «لا تعتمد على حاجز واحد» الذي قتل غيابه مرضى Therac-25 — أي ممارسة أمنية تجسّد الفكرة نفسها؟',
            en: 'From the security chapter: the do-not-rely-on-a-single-safeguard principle whose absence killed Therac-25 patients — which security practice embodies the same idea?',
          },
          options: [
            { id: 'a', text: { ar: 'defense in depth: طبقات دفاعية متعددة — تحقق مدخلات وأقل امتياز ومراجعات واختبارات', en: 'defense in depth: multiple protective layers — input validation, least privilege, reviews and tests' } },
            { id: 'b', text: { ar: 'كلمات مرور أطول فقط', en: 'Just longer passwords' } },
            { id: 'c', text: { ar: 'تشفير قاعدة البيانات وحده', en: 'Encrypting the database alone' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الحاجز الوحيد حاجز يُزال — كما أُزيلت الحواجز المادية في Therac-25 فبقي البرنامج بلا شبكة أمان تحته. الدفاع في العمق يجعل اختراق طبقة لا يكفي: مادي وبرمجي ومراجعة واختبار — نفس الروح في فصل الأمن وفي قضايا هذا الدرس.',
            en: 'A single safeguard is a safeguard that can be removed — as Therac-25\u2019s hardware interlocks were, leaving software with nothing beneath it. Defense in depth makes any one breach insufficient: hardware, software, review, test — the same spirit as the security chapter and this lesson\u2019s cases.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'والكتاب يذكّر: النشر المستمر جعل الإصدار قرارًا روتينيًا لا حدثًا سنويًا. كيف يعيد ذلك تشكيل المثلث؟',
            en: 'And the book reminds you: continuous delivery made releasing a routine decision instead of a yearly event. How does that reshape the triangle?',
          },
          options: [
            { id: 'a', text: { ar: 'يلغي المثلث — فلا قيود بعد النشر الآلي', en: 'It abolishes the triangle — no constraints after automation' } },
            { id: 'b', text: { ar: 'شحنات أصغر أسرع: النطاق يتجزأ، والزمن لكل تغيير يتقلص، والمقايضة تصير صغيرة روتينية', en: 'Smaller faster ships: scope splits up, per-change time shrinks, and the trade-off becomes a small routine one' } },
            { id: 'c', text: { ar: 'يجعل الكلفة هي القيد الوحيد المتبقي', en: 'It makes cost the only remaining constraint' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حين يصير الإصدار روتينيًا (فصل التسليم) لا تحتاج إلى دفعة عملاقة تختبر المثلث حتى الكسر: كل تغيير صغير يسأل المقايضة ذاتها بمقياس صغير — ولهذا يبقى المثلث حيًّا في كل قرار إصدار لا في ميثاق سنوي.',
            en: 'When release is routine (the delivery chapter) you no longer need a giant batch that stretches the triangle until it snaps: every small change asks the same trade-off at small scale — which is why the triangle stays alive in every release decision, not in a yearly charter.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'المدير يطلب نطاقًا أكثر قبلًا وبأقل، ويقترح الفريق الابتلاع بالسهر crunch. ما حكم الدرس؟',
            en: 'A manager demands more scope sooner for less, and the team proposes absorbing it by crunching. What is the lesson\u2019s verdict?',
          },
          options: [
            { id: 'a', text: { ar: 'حل عملي بلا ضحايا إن ظل مؤقتًا', en: 'A practical fix with no victims, as long as it stays temporary' } },
            { id: 'b', text: { ar: 'إخفاء المقايضة: اقتراض من الجودة القادمة يُسدَّد بفوائد عيوب وإنهاك', en: 'Hiding the trade-off: a loan against future quality repaid with interest as defects and burnout' } },
            { id: 'c', text: { ar: 'مقبول في آخر سبرنت فقط', en: 'Acceptable in the final sprint only' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'crunch لا يلغي المقايضة بل ينقل فاتورتها: الجودة تُقتطع الآن بصمت وتُسدَّد لاحقًا بفوائد — عيوب وإنهاك. المهارة الأمانة: جعل المقايضة ظاهرة وأسماء الأركان منصرفة صراحة لا صامتة في ليالٍ الفريق.',
            en: 'Crunch does not remove the trade-off, it moves the invoice: quality is silently shaved now and repaid later with interest — defects and burnout. The skill is honesty: make the trade-off visible and name the corner that gives, instead of burying it in the team\u2019s nights.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'المدير يطلب ميزات أكثر قبلًا وبأقل — طموح يستحق الاحترام، سأبتلع الفرق بالسهر',
          right: 'المثلث مقيد: لا يثبت الثلاثة — والسهر يخفي المقايضة ويقترض من الجودة؛ اعرض الثمن بالأرقام وسمِّ الركن الذي ينصرف',
          note: {
            ar: 'مثال التوقع رآك والفجوة 2 ميزة: إن لم تسمِّ الركن المنصرف نصرف وحده — جودة صامتة تُقتطع من كل ميزة. مستشار الدرس يجعل الطلب مستحيل الحساب أمام الجميع: السعة 8 والمطلوب 10 — اختر من ينصرف.',
            en: 'The predict block showed it: a gap of 2 features — if you do not name the corner that gives, it gives itself, as silent quality shaved from every feature. The lesson\u2019s advisor makes the impossible arithmetic visible to everyone: capacity 8, demand 10 — choose what gives.',
          },
        },
        {
          wrong: 'المواصفة تحققت إذن كل شيء سليم — وأنا منفذ فقط',
          right: 'فولكسفاغن: نظام يحقق مواصفته قد يكون فاسدًا أخلاقيًا — والقرارات الهندسية أخلاقية و«نفذت المواصفة» دفاع غير مقبول؛ لديك ACM Code أساسًا قابلًا للاقتباس للرفض',
          note: {
            ar: 'التحقق من «بناء الشيء صح» لا يساوي «بناء الشيء الصحيح» — والفضيحة كانت متطلبًا لا فشل اختبارات. والمدونات ليست زينة: انقل معك المبادئ الأربعة (المصلحة العامة، الجودة، الصدق عن الحدود، الكفاءة) لتقول لا بلغة مهنة لا رأي شخصي.',
            en: 'Verifying the thing right is not building the right thing — the scandal was a requirement, not a testing failure. And the codes are not decoration: carry the principles (public interest, quality, honesty about limitations, competence) to say no in the profession\u2019s language, not as personal opinion.',
          },
        },
        {
          wrong: 'حاجز واحد كافٍ إن كان قويًا — فحص واحد يقطع الطريق كله',
          right: 'Therac-25: الدفاع بطبقات متداخلة — حواجز مادية وفحوص برمجية ومراجعات واختبارات — وتقارير الميدان تؤخذ بجدية، والتزامن وإعادة الاستخدام مضاعفا خطر',
          note: {
            ar: 'إزالة الحواجز المادية جعلت البرنامج الحارس الوحيد — وثقافة «البرنامج صحيح» رفضت إنذارات الميدان حتى القتل. أي نظام يهمك أمراره: عدّ طبقاته؛ إن وجدت طبقة واحدة فأنت تبني Therac-25 الجديد ببطء.',
            en: 'Removing the hardware interlocks left software as the sole safeguard — and a culture sure of its code dismissed field alarms until patients died. For any system you care about: count its layers; if there is only one, you are slowly building a new Therac-25.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المثلث الحديدي: نطاق وكلفة وزمن مترابطة — اختر اثنين. أجايل تثبت الزمن والكلفة وتترك النطاق ينصرف، والمخططة تعكسه، وcrunch لا يحل المقايضة بل يخفيها ويقترض من الجودة.', en: 'The iron triangle: scope, cost and time are coupled — pick two. Agile fixes time and cost and lets scope flex; plan-driven flips it; crunch does not resolve the trade-off but hides it and borrows against quality.' },
        { ar: 'المستشار يحسب الركن المفروض: ركنان ثابتان والثالث رقم — 8 أشهر-مطور لا تشتري 10 ميزات. وعرض الثمن بآحاد لا بمشاعر يجعل القرار إنسانيًا صادقًا لأصحاب المصلحة بدل crunch صامت.', en: 'The advisor computes the forced corner: two fixed, the third is a number — 8 developer-months do not buy 10 features. Pricing the trade-off in units, not feelings, keeps the human decision honest for stakeholders instead of silent crunch.' },
        { ar: 'القرارات الهندسية أخلاقية: فولكسفاغن أثبتت أن تحقق المواصفة لا يعني الصواب — متطلب ما كان يجب تنفيذه؛ وTherac-25 أن حاجزًا واحدًا لا يكفي وتقارير الميدان تؤخذ بجدية؛ ومدونة ACM أساسك القابل للاقتباس للرفض — و«نفذت المواصفة» ليس دفاعًا.', en: 'Engineering decisions are ethical: Volkswagen proved spec satisfaction is not correctness — a requirement that should never have been implemented; Therac-25 proved one safeguard is not enough and field reports matter; the ACM Code is your citable basis for refusal — "I was just implementing the spec" is no defense.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وحرّك السعة والطلب. اسأل نفسك: في مشروعك القادم — أي ركن سيسمح له بالانصاف عمدًا، وأي طلب ستضعه على بوابة الرفض مهما كانت الأرقام؟',
        en: 'Open the sandbox and move capacity and demand. Ask yourself: in your next project — which corner will you deliberately let give, and which request will you place behind a refusal gate no matter the numbers?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch1.s5', pages: 'ص24-25 / pp.24-25' },
        { book: 'SWE', section: 'swe.ch1.s6', pages: 'ص25-26 / pp.25-26' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch1.s5', pages: 'ص24-25 / pp.24-25' },
    { book: 'SWE', section: 'swe.ch1.s6', pages: 'ص25-26 / pp.25-26' },
  ],
} satisfies Lesson;

export default lesson;
