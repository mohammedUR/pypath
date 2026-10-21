import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch10.l4 — "MC/DC and Combinatorial Testing / MC/DC والاختبار التوافقي"
 * Aligned with SWE ch10 s5 (Code Coverage II: MC/DC) + s6 (Input Coverage II:
 * Combinatorial Testing), book pp.269-274. All expression is original — a
 * paraphrase of the CC BY-SA 4.0 source, never a verbatim translation.
 * Runnable design: hand-computed MC/DC sets over a two-condition gate, the
 * book's independent-criteria A||B demo, and a pair-coverage checker over the
 * book's 3x3x3 -> 9-test covering table. Deterministic only: no input(), no
 * random, no exit(), no unittest.main.
 */
const lesson = {
  id: 'swe.ch10.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 10,
  title: { ar: 'MC/DC والاختبار التوافقي', en: 'MC/DC and Combinatorial Testing' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch10.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'غطّيت كل فروع دالتك وصنّفت كل أصناف مدخلاتها — فهل انتهى الأمر؟ ليس بعد: قرار مركب واحد مثل age >= 18 and has_id يمكن أن يجتاز تغطية الفروع بينما شرطٌ فيه ميت لا يؤثر في النتيجة أبدًا، وضبطُ إعدادات من ثلاثة معاملات يمكن أن يخفي عيبًا لا يظهر إلا في تركيبة واحدة من 27. اليوم نرفع سقف المعيارين: في الصندوق الأبيض يأتي MC/DC — Modified Condition/Decision Coverage — ليطالب بأن يُثبت كل شرط أثره المستقل في القرار بمجموعة اختبارات نموذجية قدرها N+1 لا 2 أس N؛ وفي الصندوق الأسود يأتي الاختبار التوافقي combinatorial testing ليغطي كل أزواج القيم بدل كل التركيبات، مستندًا إلى نتيجة NIST أن أغلب عيوب التفاعل ثنائية. بنهاية الدرس ستكون قادرًا على: اشتقاق مجموعة MC/DC من جدول الحقيقة، والتمييز بين تغطية الشروط وتغطية القرار بوصفهما معيارين مستقلين، وكتابة مدقّق تغطية أزواج على جدول التغطية الشهير 9 اختبارات لثلاثة معاملات ثلاثية.',
        en: 'You covered every branch and partitioned every input class — done? Not yet: one compound decision like age >= 18 and has_id can pass full branch coverage while a condition inside it is dead weight that never affects the outcome, and a three-parameter configuration can hide a defect that only fires in one combination out of 27. Today both ceilings rise: on the white-box side comes MC/DC — Modified Condition/Decision Coverage — demanding that every condition prove its independent effect on the decision with a typically N+1-sized test set instead of 2 to the N; on the black-box side comes combinatorial testing, covering every pair of values instead of every combination, backed by the NIST finding that most interaction defects are two-way. By the end of this lesson you will be able to: derive an MC/DC set from a truth table, distinguish condition coverage from decision coverage as genuinely independent criteria, and write a pair-coverage checker over the famous 9-test covering table for three 3-valued parameters.',
      },
    },
    {
      kind: 'predict',
      code: "def allow(age, member):\n    return age >= 18 and member\n\ntests = [(20, True), (20, False), (16, True)]\nfor age, member in tests:\n    print(age, member, allow(age, member))",
      question: {
        ar: 'ثلاثة اختبارات لقرار مركب من شرطين. أي شرط أثبت أثره المستقل؟ وهل تنقلب نتيجة القرار مرة واحدة على الأقل؟ وأي اختبار إضافي وحيد يجعل المجموعة مكتملة وفق MC/DC؟',
        en: 'Three tests for a compound two-condition decision. Which condition proved its independent effect? Does the decision outcome flip at least once? And which single added test completes the set under MC/DC?',
      },
      reveal: {
        ar: 'الخرج: 20 True True و20 False False و16 True False. الشرط member أثبت استقلاليته بالزوج (20,True)→True و(20,False)→False: بقية الشروط ثابتة والنتيجة انقلبت. لكن العمر لم يثبت شيئًا — والقرار لم يأخذ قيمة False إلا مرة وTrue مرة فتغطية القرار تحققت. المجموعة تكتمل باختبار واحد: (16, True) الذي يعزل العمر (member ثابت True والعمر ينتقل من 20 إلى 16 والنتيجة من True إلى False) — فيصبح العدد 4 وفق قاعدة N+1 لشرطين.',
        en: "The output: 20 True True, 20 False False, 16 True False. The member condition proved independence via the pair (20,True)→True and (20,False)→False: everything else held and the outcome flipped. But age proved nothing — and the decision did take both values, so decision coverage holds. One test completes the set: (16, True), which isolates age (member fixed at True, age moved from 20 to 16, outcome from True to False) — making it 4 tests, the N+1 rule for two conditions.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'MC/DC: أثر كل شرط مستقلًّا', en: 'MC/DC: every condition proves itself' },
      chunks: [
        {
          ar: 'افصل أولًا معيارين أدقّ. تغطية الشروط condition coverage تطلب أن يأخذ كل شرط فردي القيمة True والقيمة False مرة واحدة على الأقل — وتقول شيئًا عن نتيجة القرار. تغطية القرار decision coverage — وهي تغطية الفروع نفسها — تطلب أن يأخذ القرار كاملًا النتيجتين — ولا تنظر إلى الشروط الفردية. وهذان المعياران مستقلان حقًّا. البرهان من الكتاب: قرار A or B باختبارين (A=True, B=False) و(A=False, B=True) — كل شرط أخذ القيمتين فتغطية الشروط 100%، لكن القرار خرج True في الاختبارين فلم يأخذ False أبدًا فتغطية القرار 50%. وبالعكس: اختبارا (True,False) و(False,False) يعطيان تغطية قرار كاملة بينما B لم تأخذ True قط. لا معيار يضمن وحده أن كل شرط قادر فعًلا على تغيير النتيجة.',
          en: "First separate two finer criteria. Condition coverage requires each individual condition to take True and False at least once — and says nothing about the decision's outcome. Decision coverage — the same thing as branch coverage — requires the whole decision to take both outcomes — and never looks at individual conditions. The two are genuinely independent. The book's proof: decision A or B with just two tests (A=True, B=False) and (A=False, B=True) — every condition took both values, so condition coverage is 100%; yet the decision came out True in both, so it never came out False and decision coverage is 50%. The reverse pair (True,False) and (False,False) gives full decision coverage while B never takes True. Neither criterion alone guarantees that every condition can actually change the result.",
        },
        {
          ar: 'هنا يدخل MC/DC — Modified Condition/Decision Coverage — أقوى معيار عملي: كل شرط يجب أن يُظهر أثره المستقل في نتيجة القرار. والدليل عملي: لكل شرط زوجُ اختبارات يختلفان فيه هذا الشرط وحده بينما يبقى ما سواه ثابتًا، وتنقلب نتيجة القرار بين الاختبارين. ذلك الزوج يثبت أن الشرط ليس ديكورًا بل يتحكم في النتيجة بمفرده. ويجمع MC/DC أربعة اشتراطات: القرار يأخذ النتيجتين، وكل شرط يأخذ القيمتين، وكل شرط له زوج معزل، وكل ذلك عادةً بمجموعة قدرها N+1 اختبارًا لقرار فيه N شرطًا — عدد خطّي بدل 2 أس N للشبكة الشاملة. لهذا يفرضه معيار DO-178C في أعلى مستويات ضمان التصميم لبرمجيات الطيران، حيث يكون إثبات أثر كل شرط التزامًا لا ترفًا.',
          en: "That is where MC/DC — Modified Condition/Decision Coverage — enters as the strongest practical criterion: every condition must be shown to independently affect the decision's outcome. The proof is concrete: for each condition you exhibit a pair of tests in which only that condition changes, everything else is held fixed, and the decision's result flips between the two. That pair proves the condition is not decoration but genuinely controls the outcome on its own. MC/DC bundles four requirements: the decision takes both outcomes; every condition takes both values; each condition has an isolating pair; and all of it usually fits in N+1 tests for a decision of N conditions — linear, versus 2-to-the-N for exhaustive testing. This is why DO-178C mandates MC/DC at the most critical design-assurance levels of avionics software, where proving every condition's effect is an obligation, not a luxury.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الاختبار التوافقي: كل الأزواج لا كل التركيبات', en: 'Combinatorial testing: all pairs, not all combinations' },
      chunks: [
        {
          ar: 'كثير من الأنظمة تُضبط بمعاملات عديدة في وقت واحد، والعيوب كثيرًا ما تختبئ في تركيبات لا في قيم فردية. صفحة دفع مضبوطة بثلاثة معاملات — المتصفح من {Chrome, Firefox, Safari} ونظام التشغيل من {Windows, macOS, Linux} واللغة من {EN, FR, JP} — تحتاج 3×3×3 = 27 تشغيلًا للتغطية الشاملة، والانفجار توافقي: عشر رايات ثنائية تعني 1024 تركيبة. أما «جرّب كل قيمة مرة» فيفوّت عيوب التفاعل مثل «تنسيق التاريخ ينكسر فقط على Safari مع اللغة JP». هنا يفيد نمط تجريبي رصدته دراسات NIST على قواعد بيانات العيوب عبر مجالات كثيرة: الغالبية العظمى من عيوب التفاعل تثيرها أزواجُ معاملات فقط، وأغلب ما تبقى ثلاثيات. إذن غطِّ الأزواج pairwise بدل التركيبات.',
          en: "Many systems are configured by several parameters at once, and defects often lurk in combinations rather than single values. A checkout page parameterized by three parameters — Browser from {Chrome, Firefox, Safari}, OS from {Windows, macOS, Linux}, Locale from {EN, FR, JP} — needs 3×3×3 = 27 runs exhaustively, and the explosion is multiplicative: ten binary flags already mean 1,024 combinations. Meanwhile try-each-value-once misses interaction bugs like the date format that breaks only on Safari with the JP locale. Here an empirical regularity from NIST studies of fault databases across domains helps: the large majority of interaction defects are triggered by the interaction of just two parameters, and almost all of the rest by three. So cover the pairs — pairwise testing — instead of the combinations.",
        },
        {
          ar: 'الهدف بدقة: اختر مجموعة صغيرة من التكوينات بحيث يظهر كل تقاطع قيم لكل زوج من المعاملات في اختبار واحد على الأقل. جدول الكتاب الشهير يغطي المعاملات الثلاثة الثلاثية بتسعة اختبارات بدل 27 — ستتحقق منه برمجيًّا في التمارين. ولن تبني هذه الجداول يدويًّا في العمل الحقيقي: أدوات مثل PICT من مايكروسوفت وACTS من NIST تولّد مصفوفة تغطية شبه مصغّرة، وتمدّ من زوجي إلى ثلاثي عندما يبرر الخطر. ما لا تستطيع الأداة فعله هو نموذجُك: تحديد المعاملات وقيمها ذات المعنى — مستعينًا بأصناف التكافؤ والقيم الحدّية من الدرس السابق — وقيود التوافق مثل «Safari يستلزم macOS». الاختبار التوافقي يتكامل مع تحليل الصندوق الأسود؛ لا يحلّ مكانه.',
          en: 'The goal precisely: choose a small set of configurations such that for every pair of parameters, every pair of their values appears together in at least one test. The book\u2019s famous table covers the three 3-valued parameters in nine tests instead of 27 — you will verify it programmatically in the exercises. You rarely build these tables by hand in real work: tools such as Microsoft\u2019s PICT or NIST\u2019s ACTS generate a minimal or near-minimal covering array, and can extend from 2-way to 3-way when risk justifies it. What no tool can supply is your model: the parameters and their meaningful values — chosen with the equivalence classes and boundaries of the previous lesson — plus compatibility constraints like Safari implies macOS. Combinatorial testing composes with black-box analysis; it does not replace it.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'من جدول الحقيقة إلى مجموعة MC/DC', en: 'From truth table to MC/DC set' },
      code: "def gate(age, has_id):\n    if age >= 18 and has_id:\n        return 'allow'\n    return 'deny'\n\ntable = [(18, True), (18, False), (17, True), (17, False)]\nfor age, has_id in table:\n    print(age, has_id, '->', gate(age, has_id))",
      explanation: {
        ar: 'الجدول الكامل لقرار من شرطين يبلغ 4 صفوف. اقضِ على صف واحد فقط — (17, False) — وتبقى 3 اختبارات = N+1. تحقق من الأزواج المعزولة: للشرط age >= 18 الزوج (18,True)→allow و(17,True)→deny — has_id ثابت True والعمر انتقل والنتيجة انقلبت. وللشرط has_id الزوج (18,True)→allow و(18,False)→deny — العمر ثابت وhas_id انتقل والنتيجة انقلبت. الاختبار (18,True) مشترك بين الزوجين — وهذا سر الاقتصاد: في MC/DC يخدم الاختبار الواحد أزواجًا عدة، فتنكمش 4 صفوف إلى 3.',
        en: 'The full truth table of a two-condition decision has 4 rows. Eliminate exactly one row — (17, False) — and 3 tests remain: N+1. Check the isolating pairs: for age >= 18 the pair (18,True)→allow and (17,True)→deny — has_id held at True, age moved, the outcome flipped. For has_id the pair (18,True)→allow and (18,False)→deny — age held, has_id moved, the outcome flipped. The test (18,True) is shared between the two pairs — that is the trick behind the economy: in MC/DC one test serves several pairs, shrinking 4 rows to 3.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.mcdc-complete',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'عندك اختبار واحد فقط في المجموعة: (18, True). أكملها إلى مجموعة MC/DC صحيحة لقرار gate — أضف اختبارين بحيث: يأخذ القرار النتيجتين، ولكل شرط زوج يعزله (يبقى الشرط الآخر ثابتًا وينقلب الخرج). ثم اطبع سطرَي الحصيلة: mcdc tests: %d بعدد الاختبارات، وoutcomes: followed بمخرجات gate مفصولة بمسافة بترتيب القائمة. المتوقع: mcdc tests: 3 ثم outcomes: allow deny deny.',
        en: "You have a single test in the set: (18, True). Complete it into a valid MC/DC set for the gate decision — add two tests so that: the decision takes both outcomes, and every condition has an isolating pair (the other condition held fixed, the output flipped). Then print two summary lines: mcdc tests: %d with the count, and outcomes: followed by gate's outputs space-separated in list order. Expected: mcdc tests: 3 then outcomes: allow deny deny.",
      },
      starterCode: "def gate(age, has_id):\n    if age >= 18 and has_id:\n        return 'allow'\n    return 'deny'\n\ntests = [(18, True)]\n# أضف اختبارين بحيث تكتمل مجموعة MC/DC:\n# زوج يعزل الشرط age >= 18 (has_id ثابت True، العمر يتغير، الخرج ينقلب)\n# وزوج يعزل الشرط has_id (العمر ثابت 18، has_id يتغير، الخرج ينقلب)\n# ثم اطبع:\n# mcdc tests: %d\n# outcomes: allow deny deny\n",
      solution: "def gate(age, has_id):\n    if age >= 18 and has_id:\n        return 'allow'\n    return 'deny'\n\ntests = [(18, True)]\ntests.append((17, True))\ntests.append((18, False))\n\nprint('mcdc tests: %d' % len(tests))\nprint('outcomes: %s' % ' '.join(gate(a, h) for a, h in tests))",
      tests: [
        {
          id: 't1',
          name: { ar: 'عدد الاختبارات ثلاثة — قاعدة N+1', en: 'Three tests — the N+1 rule' },
          code: "assert 'mcdc tests: 3' in __learner_output__, 'expected: mcdc tests: 3 | actual: %r' % __learner_output__",
          expected: 'mcdc tests: 3',
        },
        {
          id: 't2',
          name: { ar: 'الخرجات بالترتيب الصحيح', en: 'Outcomes in the right order' },
          code: "assert 'outcomes: allow deny deny' in __learner_output__, 'expected: outcomes: allow deny deny | actual: %r' % __learner_output__",
          expected: 'outcomes: allow deny deny',
        },
        {
          id: 't3',
          name: { ar: 'المجموعة تحوي ثلاث حالات', en: 'The set holds three cases' },
          code: "assert len(tests) == 3, 'expected: 3 tests | actual: %r' % len(tests)",
          expected: '3 tests',
        },
        {
          id: 't4',
          name: { ar: 'gate يتصرف وفق القرار المركب', en: 'gate behaves per the compound decision' },
          code: "assert gate(18, True) == 'allow' and gate(17, True) == 'deny' and gate(18, False) == 'deny', 'expected: allow/deny/deny | actual: %r' % ((gate(18, True), gate(17, True), gate(18, False)),)",
          expected: 'allow/deny/deny',
        },
      ],
      hints: [
        { ar: 'تحتاج زوجًا يبقي has_id ثابتًا على True بينما العمر ينتقل بين 18 و17 — وزوجًا يبقي العمر ثابتًا على 18 بينما has_id ينتقل بين True وFalse. الاختبار المعطى (18, True) مشترك بين الزوجين.', en: 'You need one pair holding has_id fixed at True while age moves between 18 and 17 — and one pair holding age fixed at 18 while has_id moves between True and False. The given test (18, True) is shared by both pairs.' },
        { ar: 'قاعدة N+1 لقرار من شرطين تعني ثلاثة اختبارات بالضبط: القيمة الوحيدة الناقصة لتحقيق النتيجتين والعزلين هي إضافة (17, True) و(18, False).', en: 'The N+1 rule for a two-condition decision means exactly three tests: the only values missing for both outcomes and both isolations are (17, True) and (18, False).' },
        { ar: 'الهيكل:\ntests.append((17, True))\ntests.append((18, False))\nprint(\'mcdc tests: %d\' % len(tests))\nprint(\'outcomes: %s\' % \' \'.join(gate(a, h) for a, h in tests))', en: "The skeleton:\ntests.append((17, True))\ntests.append((18, False))\nprint('mcdc tests: %d' % len(tests))\nprint('outcomes: %s' % ' '.join(gate(a, h) for a, h in tests))" },
        { ar: "الحل الكامل:\ndef gate(age, has_id):\n    if age >= 18 and has_id:\n        return 'allow'\n    return 'deny'\n\ntests = [(18, True)]\ntests.append((17, True))\ntests.append((18, False))\n\nprint('mcdc tests: %d' % len(tests))\nprint('outcomes: %s' % ' '.join(gate(a, h) for a, h in tests))", en: "Full solution:\ndef gate(age, has_id):\n    if age >= 18 and has_id:\n        return 'allow'\n    return 'deny'\n\ntests = [(18, True)]\ntests.append((17, True))\ntests.append((18, False))\n\nprint('mcdc tests: %d' % len(tests))\nprint('outcomes: %s' % ' '.join(gate(a, h) for a, h in tests))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.pair-coverage',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'هذا جدول الكتاب: تسعة تكوينات تغطي ثلاثة معاملات ثلاثية القيم. اكتب الدالة pair_coverage(table, i, j) التي تعيد عدد أزواج القيم المميزة الظاهرة في العمودين i وj عبر الجدول، ثم اطبع أربعة أسطر: b-o: %d/9 وb-l: %d/9 وo-l: %d/9 لكل زوج أعمدة، وrows: %d of 27. المتوقع أن تصل الأزواج الثلاثة إلى 9/9 — فالجدول يغطي كل الأزواج بـ 9 اختبارات بدل 27.',
        en: 'This is the book\u2019s table: nine configurations covering three 3-valued parameters. Write pair_coverage(table, i, j) returning the number of distinct value pairs appearing across columns i and j, then print four lines: b-o: %d/9, b-l: %d/9 and o-l: %d/9 for each column pair, and rows: %d of 27. All three pairs should reach 9/9 — the table covers every pair with 9 tests instead of 27.',
      },
      starterCode: "table = [\n    ('Chrome', 'Windows', 'EN'),\n    ('Chrome', 'macOS', 'FR'),\n    ('Chrome', 'Linux', 'JP'),\n    ('Firefox', 'Windows', 'FR'),\n    ('Firefox', 'macOS', 'JP'),\n    ('Firefox', 'Linux', 'EN'),\n    ('Safari', 'Windows', 'JP'),\n    ('Safari', 'macOS', 'EN'),\n    ('Safari', 'Linux', 'FR'),\n]\n\ndef pair_coverage(table, i, j):\n    # اجمع أزواج القيم (row[i], row[j]) في مجموعة واعِد حجمها\n    # collect the value pairs (row[i], row[j]) in a set and return its size\n    pass\n\n# اطبع الأسطر الأربعة\n# print the four lines\n",
      solution: "table = [\n    ('Chrome', 'Windows', 'EN'),\n    ('Chrome', 'macOS', 'FR'),\n    ('Chrome', 'Linux', 'JP'),\n    ('Firefox', 'Windows', 'FR'),\n    ('Firefox', 'macOS', 'JP'),\n    ('Firefox', 'Linux', 'EN'),\n    ('Safari', 'Windows', 'JP'),\n    ('Safari', 'macOS', 'EN'),\n    ('Safari', 'Linux', 'FR'),\n]\n\ndef pair_coverage(table, i, j):\n    seen = set()\n    for row in table:\n        seen.add((row[i], row[j]))\n    return len(seen)\n\nprint('b-o: %d/9' % pair_coverage(table, 0, 1))\nprint('b-l: %d/9' % pair_coverage(table, 0, 2))\nprint('o-l: %d/9' % pair_coverage(table, 1, 2))\nprint('rows: %d of 27' % len(table))",
      tests: [
        {
          id: 't1',
          name: { ar: 'زوجا الأعمدة الأول والثاني مغطيان كاملين', en: 'Both first column pairs fully covered' },
          code: "assert 'b-o: 9/9' in __learner_output__ and 'b-l: 9/9' in __learner_output__, 'expected: b-o: 9/9 and b-l: 9/9 | actual: %r' % __learner_output__",
          expected: 'b-o: 9/9 and b-l: 9/9',
        },
        {
          id: 't2',
          name: { ar: 'الزوج الثالث مغطى كاملًا', en: 'The third pair fully covered' },
          code: "assert 'o-l: 9/9' in __learner_output__, 'expected: o-l: 9/9 | actual: %r' % __learner_output__",
          expected: 'o-l: 9/9',
        },
        {
          id: 't3',
          name: { ar: 'الدالة تحسب فعًلا', en: 'The function really counts' },
          code: "assert pair_coverage(table, 0, 1) == 9 and pair_coverage(table, 1, 2) == 9, 'expected: 9 and 9 | actual: %r' % ((pair_coverage(table, 0, 1), pair_coverage(table, 1, 2)),)",
          expected: '9 and 9',
        },
        {
          id: 't4',
          name: { ar: 'الاقتصاد ظاهر: 9 من 27', en: 'The economy is visible: 9 of 27' },
          code: "assert 'rows: 9 of 27' in __learner_output__, 'expected: rows: 9 of 27 | actual: %r' % __learner_output__",
          expected: 'rows: 9 of 27',
        },
      ],
      hints: [
        { ar: 'دالة واحدة تكفي: مرّ على صفوف الجدول وأضف (row[i], row[j]) إلى مجموعة seen — فالمجموعة تنزع التكرار تلقائيًّا — ثم أعِد len(seen).', en: 'One function suffices: walk the table rows, add (row[i], row[j]) to a seen set — sets dedupe automatically — and return len(seen).' },
        { ar: 'لكل زوج معاملات 3×3 = 9 تقاطعات ممكنة، ولثلاثة أزواج 27 تقاطعًا. جدول من 9 صفوف يكفي لأن كل صف يخدم ثلاثة أزواج معاملات في وقت واحد.', en: 'Each parameter pair has 3×3 = 9 possible intersections, and three pairs make 27. Nine rows suffice because each row serves three parameter pairs at once.' },
        { ar: 'الهيكل:\ndef pair_coverage(table, i, j):\n    seen = set()\n    for row in table:\n        seen.add((row[i], row[j]))\n    return len(seen)\n\nprint(\'b-o: %d/9\' % pair_coverage(table, 0, 1))\nprint(\'b-l: %d/9\' % pair_coverage(table, 0, 2))\nprint(\'o-l: %d/9\' % pair_coverage(table, 1, 2))\nprint(\'rows: %d of 27\' % len(table))', en: "The skeleton:\ndef pair_coverage(table, i, j):\n    seen = set()\n    for row in table:\n        seen.add((row[i], row[j]))\n    return len(seen)\n\nprint('b-o: %d/9' % pair_coverage(table, 0, 1))\nprint('b-l: %d/9' % pair_coverage(table, 0, 2))\nprint('o-l: %d/9' % pair_coverage(table, 1, 2))\nprint('rows: %d of 27' % len(table))" },
        { ar: 'لو ظهر أحد الأزواج أقل من 9 فافحص الجدول: هل تكرر تقاطع وفاته آخر تقاطع؟ في جدول الكتاب الصحيح كل التقاطعات التسعة تظهر لكل زوج — إن نقص واحدًا فغالبًا خطأ مطبعي في صف.', en: 'If any pair lands below 9, inspect the table: is a missing intersection duplicated elsewhere? In the correct book table all nine intersections appear for every pair — a shortfall usually means a typo in one row.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-independence',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. هذا هو مقياس استقلالية المعيارين من الشرح: تغطية شروط كاملة قد تصطدم بتغطية قرار ناقصة.',
        en: 'Read the code and predict its exact output — one line per print — without running it. This is the criteria-independence meter from the concept: full condition coverage can coexist with incomplete decision coverage.',
      },
      code: "def decision(A, B):\n    return A or B\n\ntests = [(True, False), (False, True)]\ncount_true = 0\ncount_false = 0\nfor A, B in tests:\n    if decision(A, B):\n        count_true = count_true + 1\n    else:\n        count_false = count_false + 1\n\nprint('decision T: %d' % count_true)\nprint('decision F: %d' % count_false)",
      solution: 'decision T: 2\ndecision F: 0',
      answer: 'decision T: 2\ndecision F: 0',
      hints: [
        { ar: 'decision(True, False) = True وdecision(False, True) = True — عامل or يكتفي بشرط واحد صحيح.', en: 'decision(True, False) = True and decision(False, True) = True — a single true condition satisfies or.' },
        { ar: 'لكل استدعاء يزداد count_true لأن القرار True في الحالتين — فلا يدخل فرع count_false أبدًا.', en: 'Every call increments count_true because the decision is True both times — the count_false branch never runs.' },
        { ar: 'تغطية الشروط هنا 100% (كل شرط أخذ True وFalse) بينما تغطية القرار 50% فقط: أقصِر عدّادَي السطرين الأخيرين.', en: 'Condition coverage here is 100% (each condition took True and False) while decision coverage is only 50%: read the two final counters.' },
        { ar: 'الخرج:\ndecision T: 2\ndecision F: 0', en: 'The output:\ndecision T: 2\ndecision F: 0' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.mcq-pairwise',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'جدول الأزواج من التمرين السابق اختصر 27 تشغيلًا إلى 9. ما الضمان الذي يقدمه — ولا يقدمه اختبار كل قيمة مرة واحدة؟',
        en: 'The pairwise table from the previous exercise shrank 27 runs to 9. What guarantee does it deliver — that one-value-per-parameter testing does not?',
      },
      options: [
        { id: 'a', text: { ar: 'يغطي كل تركيبة كاملة من المعاملات الثلاثة مرة واحدة', en: 'It covers every full combination of the three parameters once' } },
        { id: 'b', text: { ar: 'لكل زوج معاملات، يظهر كل تقاطع قيم في اختبار واحد على الأقل — فعيب التفاعل الثنائي مثل Safari+JP لن يفوت', en: 'For every parameter pair, every value intersection appears in at least one test — so a two-way interaction bug like Safari+JP cannot slip through' } },
        { id: 'c', text: { ar: 'يضمن أن كل شرط داخل الكود أخذ قيمتيه — فهو معيار صندوق أبيض', en: 'It guarantees every condition inside the code took both values — it is a white-box criterion' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'الخيار a وصف التغطية الشاملة 27 — وهذا بالضبط ما وفّرت عليه.', en: 'Option a describes exhaustive 27-run coverage — exactly what you saved.' },
        { ar: 'الخيار c من عالم الصندوق الأبيض: الشروط داخل الكود لا علاقة لها بجدول مدخلات خارجي.', en: 'Option c is white-box territory: conditions inside the code are unrelated to an external input table.' },
        { ar: 'تعريف pairwise: لكل زوج معاملات، كل تقاطع قيم في اختبار واحد على الأقل — وعيب Safari+JP يظهر لأن اختبارًا ما يجمعهما.', en: 'The pairwise definition: for every parameter pair, every value intersection in at least one test — and the Safari+JP bug surfaces because some test pairs them.' },
        { ar: 'الجواب: b — الضمان ثنائي التفاعل، ومستند إلى نتيجة NIST أن أغلب عيوب التفاعل أزواج.', en: 'Answer: b — the guarantee is two-way interaction, backed by the NIST finding that most interaction defects are pairs.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def gate3(a, b, c):\n    if a and (b or c):\n        return 'go'\n    return 'stop'\n\n# جدول الحقيقة الكامل لقرار من 3 شروط = 8 صفوف\n# the full truth table of a 3-condition decision = 8 rows\nimport itertools\nfor a, b, c in itertools.product([True, False], repeat=3):\n    print(a, b, c, '->', gate3(a, b, c))\n\n# جرّب: اختر 4 صفوف (N+1 لثلاثة شروط) تجعل كل شرط له زوج معزل — اكتبها يدويًّا ثم تحقق\n# try: pick 4 rows (N+1 for three conditions) giving every condition an isolating pair — write them by hand then verify\n# جرّب: بدّل and بـ or في gate3 وأعد اشتقاق المجموعة — أي الصفوف تغيّر دورها؟\n# try: swap and for or in gate3 and re-derive the set — which rows change roles?\n# جرّب: أضف معاملًا رابعًا واحسب 2**4 — هل ما زالت الشبكة الكاملة معقولة؟\n# try: add a fourth parameter and compute 2**4 — is exhaustive still reasonable?",
      prompt: {
        ar: 'الملعب بين يديك: قرار من ثلاثة شروط وجدول حقيقة كامل من 8 صفوف يولّده itertools — بلا عشوائية وبلا شبكة. اشتق يدويًّا مجموعة MC/DC من أربعة صفوف بحيث يملك كل شرط زوجًا معزلًا، ثم بدّل and بـ or وشاهد كيف تنقلب أدوار الصفوف. وحين تزداد المعاملات احسب 2 أس N وشاهد الانفجار التوافقي الذي يجعل pairwise منطقيًّا. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is yours: a three-condition decision and a full 8-row truth table generated by itertools — no randomness, no grid. Hand-derive a 4-row MC/DC set giving every condition an isolating pair, then swap and for or and watch the rows change roles. And as parameters grow, compute 2 to the N and feel the combinatorial explosion that makes pairwise the sane choice. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن PY4E الفصل الثالث: التقييم قصير الدارة — and يكفّ عند أول False. كيف يفسّر هذا شرطًا لا يؤثر في القرار إطلاقًا؟',
            en: 'From PY4E chapter 3: short-circuit evaluation — and stops at the first False. How does that explain a condition that never affects the decision?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن التقييم قد يقصر قبل الوصول إلى الشرط، فيبقى بلا أي دور في النتيجة — ولهذا يطالب MC/DC بزوج يثبت أثر كل شرط المستقل', en: 'Because evaluation may stop before reaching it, leaving it with no role in the outcome — which is why MC/DC demands a pair proving each condition\u2019s independent effect' } },
            { id: 'b', text: { ar: 'لأن and يحوّل كل الشروط إلى True دائمًا', en: 'Because and turns every condition True' } },
            { id: 'c', text: { ar: 'لأن التقييم قصير الدارة يمنع تغطية الشروط تمامًا', en: 'Because short-circuit evaluation makes condition coverage impossible' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'في a and b إذا كان a خطأً لا يُقيَّم b أصلًا — فيمكن لـ b أن يكون شرطًا ميتًا عمليًّا. زوج MC/DC المعزل يثبت أن الشرط يستطيع قلب النتيجة عندما تُثبَّت البقية — وإلا كان زينة.',
            en: 'In a and b, when a is False, b is never evaluated — so b can be practically dead. An isolating MC/DC pair proves the condition can flip the outcome when the rest is held fixed — otherwise it is decoration.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرق الجوهري بين تغطية الفروع (decision coverage) وMC/DC على قرار مركب؟',
            en: 'What is the essential difference between branch (decision) coverage and MC/DC on a compound decision?',
          },
          options: [
            { id: 'a', text: { ar: 'لا فرق — الاثنان يقيسان الشيء نفسه بوحدات مختلفة', en: 'No difference — they measure the same thing in different units' } },
            { id: 'b', text: { ar: 'تغطية الفروع تنظر إلى القرار كاملًا (True/False مرة لكل منهما)، وMC/DC تطلب إضافةً زوجًا معزلًا لكل شرط يثبت أثره المستقل', en: 'Branch coverage looks at the whole decision (both True and False once), while MC/DC additionally requires an isolating pair per condition proving its independent effect' } },
            { id: 'c', text: { ar: 'MC/DC بديل للتغطية العشوائية للمدخلات فقط', en: 'MC/DC is just a replacement for random input coverage' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المعياران مستقلان كما رأيت في تمرين A or B: قد تكتمل الشروط ولا ينقلب القرار، وقد يكتمل القرار ويغيب شرط. MC/DC يجمع الاشتراطات: قرار بنتيجتين، وشروط بقيمتين، وزوج معزل لكل شرط — بمجموعة N+1 عادة.',
            en: 'The criteria are independent as the A or B exercise showed: conditions can be complete while the decision never flips, and the decision can flip while a condition never moves. MC/DC bundles the requirements: both outcomes, both values per condition, an isolating pair per condition — usually in N+1 tests.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن PY4E الفصل الخامس: حلقة for تولّد التركيبات واحدًا تلو الآخر. لماذا لا تكفي حلقة شاملة كل التركيبات استراتيجيةَ اختبار عمليًّا؟',
            en: 'From PY4E chapter 5: a for loop can enumerate combinations one by one. Why is an exhaustive-all-combinations loop not a practical test strategy?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الحلقات لا تستطيع المرور على قوائم متداخلة', en: 'Because loops cannot walk nested lists' } },
            { id: 'b', text: { ar: 'لأن التركيبات تنفجر توافقيًّا: 3×3×3 = 27 وعشر رايات ثنائية = 1024 — فالتغطية الزوجية تحقق أغلب القيمة بكلفة كسرية', en: 'Because combinations explode combinatorially: 3×3×3 = 27 and ten binary flags = 1,024 — pairwise captures most of the value at a fraction of the cost' } },
            { id: 'c', text: { ar: 'لأن الحلقات تولّد مدخلات غير صالحة فقط', en: 'Because loops only generate invalid inputs' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشروع الشامل ممكن حسابيًّا لكنه غير مجدٍ: NIST وجدت أن أغلب عيوب التفاعل ثنائية — فتغطية الأزواج تصطاد الغالبية بعدد اختبارات ينمو خطيًّا تقريبًا لا أسيًّا.',
            en: 'Exhaustive enumeration is computable but uneconomical: NIST found most interaction defects are two-way — pairwise catches the bulk with a test count that grows roughly linearly, not exponentially.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أداة توليد مصفوفات التغطية مثل PICT أو ACTS تولّد الجدول عنك. فما الذي يبقى مسؤوليتك أنت — النموذج — قبل تشغيلها؟',
            en: 'A covering-array tool like PICT or ACTS generates the table for you. What remains your responsibility — the model — before you run it?',
          },
          options: [
            { id: 'a', text: { ar: 'تحديد المعاملات وقيمها ذات المعنى (من أصناف التكافؤ والحدود) وقيود التوافق مثل Safari يستلزم macOS', en: 'Naming the parameters and their meaningful values (from equivalence classes and boundaries) plus compatibility constraints like Safari implies macOS' } },
            { id: 'b', text: { ar: 'لا شيء — الأداة تعرف مواصفتك تلقائيًّا', en: 'Nothing — the tool knows your specification automatically' } },
            { id: 'c', text: { ar: 'كتابة الشيفرة قيد الاختبار داخل الأداة', en: 'Writing the code under test inside the tool' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأداة تحسب المصفوفة، لكن جودتها بجودة نموذجك: معاملات غير مهمة أو قيم متطابقة سلوكيًّا أو غياب القيود يعطي جدولًا يغطي أزواجًا بلا معنى. الاختبار التوافقي يتكامل مع تحليل الصندوق الأسود من الدرس السابق — لا يحلّ مكانه.',
            en: 'The tool computes the array, but its quality is your model\u2019s quality: irrelevant parameters, behaviorally duplicate values, or missing constraints yield a table that covers meaningless pairs. Combinatorial testing composes with the black-box analysis of the previous lesson — it does not replace it.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'تغطية الشروط 100% تعني أن كل شرط يؤثر في النتيجة',
          right: 'الاثنان مستقلان: (True,False) و(False,True) على A or B — شروط مكتملة والقرار لم يأخذ False قط',
          note: {
            ar: 'الخطر الأكبر في القرارات المركبة أن يشعر المختبر بالاطمئنان من عدّادات الشروط — بينما القرار نفسه لم يُختبر في النتيجة المفقودة، أو بقي شرط بلا أثر. MC/DC يجعل الأثر المستقل شرط قبول لا افتراضًا.',
            en: 'The biggest trap in compound decisions is feeling safe because condition counters are full — while the decision itself was never tested in the missing outcome, or a condition stayed inert. MC/DC makes independent effect an acceptance requirement, not an assumption.',
          },
        },
        {
          wrong: 'اختبار كل التركيبات دائمًا لأنه «الأدق»',
          right: 'الأزواج أولًا: أغلب عيوب التفاعل ثنائية — 27 تكوينًا تختصر إلى 9 اختبارات',
          note: {
            ar: 'التغطية الشاملة تفوق تكلفة فائدتها ما لم تكن المخاطر حرجة، وحتى حينئذ تبدأ الأدوات من الزوجي وترتقي إلى 3-way عند الحاجة. القيمة تأتي من نموذج جيد — معاملات ذات معنى وقيود واقعية — لا من حجم الجدول.',
            en: 'Exhaustive coverage costs more than it buys unless the risk is critical, and even then tools start pairwise and escalate to 3-way when needed. Value comes from a good model — meaningful parameters and realistic constraints — not from table size.',
          },
        },
        {
          wrong: 'أعطيت الأداة المعاملات بلا قيود فحصلت على تكوينات مستحيلة',
          right: 'أضف قيود التوافق إلى النموذج: Safari يستلزم macOS، والمنطقة JP لا تجتمع مع locale EN وهكذا',
          note: {
            ar: 'مصفوفة تغطية بلا قيود تنتج تكوينات لا وجود لها في الواقع فيُهدر اختبار على تركيبات لن تحدث — والثغرة الحقيقية تبقى مغطاة على الورق فقط. النموذج — لا الأداة — يحدد صحة التغطية.',
            en: 'A covering array without constraints produces configurations that cannot exist, spending tests on combinations that never happen while the real gap stays covered on paper only. The model — not the tool — decides whether coverage is real.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'تغطية الشروط وتغطية القرار معياران مستقلان: كلٌّ قد يكتمل وحده ويغيب الآخر — ومثال A or B باختبارين يكفي لإثبات الاستقلال.', en: 'Condition and decision coverage are independent: each can be satisfied while the other is not — the two-test A or B example is the whole proof.' },
        { ar: 'MC/DC يطالب بأن يُظهر كل شرط أثره المستقل بزوج معزل (البقية ثابتة، الشرط ينتقل، النتيجة تنقلب) — وعادةً يتحقق بمجموعة N+1 لقرار فيه N شرطًا، وهو مطلوب في أعلى مستويات DO-178C للطيران.', en: 'MC/DC requires every condition to show its independent effect via an isolating pair (rest fixed, condition moves, outcome flips) — usually achieved with N+1 tests for N conditions, and mandated at the most critical DO-178C avionics levels.' },
        { ar: 'الاختبار التوافقي يغطي أزواج القيم بدل التركيبات استنادًا إلى نتيجة NIST: أغلب عيوب التفاعل ثنائية — والجدول الشهير يغطي 3 معاملات ثلاثية بـ 9 اختبارات بدل 27، وأنت تورد النموذج: المعاملات والقيم من الفئات والحدود وقيود التوافق.', en: 'Combinatorial testing covers value pairs instead of combinations, backed by NIST: most interaction defects are two-way — the famous table covers three 3-valued parameters in 9 tests instead of 27, and you supply the model: parameters and values from classes and boundaries plus compatibility constraints.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وامشِ على gate3: اشتق يدويًّا مجموعة من أربعة صفوف يعزل كل شرط فيها، ثم بدّل and بـ or وأعد الاشتقاق. اسأل نفسك: أي صفوف حافظت على دورها؟ ثم احسب 2 أس 5 — عند أي عدد معاملات تتوقف عن الحلم بالتغطية الشاملة وتنتقل إلى pairwise؟',
        en: 'Open the sandbox and walk gate3: hand-derive a four-row set isolating every condition, then swap and for or and re-derive. Ask yourself: which rows kept their roles? Then compute 2 to the 5 — at how many parameters do you give up dreaming of exhaustive coverage and move to pairwise?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch10.s5', pages: 'ص269-272 / pp.269-272' },
        { book: 'SWE', section: 'swe.ch10.s6', pages: 'ص273-274 / pp.273-274' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch10.s5', pages: 'ص269-272 / pp.269-272' },
    { book: 'SWE', section: 'swe.ch10.s6', pages: 'ص273-274 / pp.273-274' },
  ],
} satisfies Lesson;

export default lesson;