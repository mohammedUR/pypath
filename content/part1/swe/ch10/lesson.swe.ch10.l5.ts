import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch10.l5 — "Chapter 10 Review and Project: The Test Suite
 * مراجعة الفصل 10 ومشروع: حزمة الاختبارات"
 * Aligned with SWE ch10 s7 (Conclusion), book pp.274-275, recapping s1-s6.
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: instrumented function (seen-list per branch) + boundary
 * case list over normalize_grade, an honest harness, and an oracle-bug debug
 * block. Deterministic only: no input(), no random, no exit(), no
 * unittest.main.
 */
const lesson = {
  id: 'swe.ch10.l5',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 10,
  title: { ar: 'مراجعة الفصل 10 ومشروع: حزمة الاختبارات', en: 'Chapter 10 Review and Project: The Test Suite' },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch10.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'خمسة دروس وبقيت خطوة واحدة: حزمة اختبارات تُحسب بها. خلاصة الفصل أن كل سؤال صعب في الاختبار يصبح قابلًا للحل عند تسمية مجموعة من العناصر وقياس كسر ما غطيته: مدخلات مختارة من أصناف وحدود، وكفاية رقم لا إحساس، وأوراكل يصدر من المواصفة، وأتمتة تعيد التشغيل عند كل تعديل — على مستويات مرتبة من unit إلى acceptance، بمعايير صندوق أبيض تصعد statement فbranch فMC/DC، ومعايير صندوق أسود تجزّئ وتحاذي الحدود وتغطي الأزواج. مشروع اليوم يجمع ذلك كله في حزمة واحدة ذات معنى: دالة بمواصفة وحدود، ومقياس فروع مدمج يجعل الكفاية مرئية، وعشر حالات تثبت السلوك عند كل حافة — ثم كتلة تصحيح تذكّرك أن حزمةً تحمّر قد يكون العيب فيها أوراكلها لا الكود. بنهاية الدرس ستكون قادرًا على: بناء حزمة تفي بمعيار تغطية معلن، وقراءة فشل الحزمة بحياد بين الكود والمرجع.',
        en: 'Five lessons and one step left: a test suite you can count on. The chapter\u2019s through-line: every hard testing question becomes tractable once you name a set of items to cover and measure the fraction covered — inputs chosen from classes and boundaries, adequacy as a number not a feeling, an oracle sourced from the specification, and automation that reruns on every change — at ordered levels from unit to acceptance, with white-box criteria climbing statement, then branch, then MC/DC, and black-box criteria partitioning, edging and pairing. Today\u2019s project binds it all into one meaningful suite: a function with a spec and boundaries, a built-in branch meter that makes adequacy visible, and ten cases proving behavior at every edge — then a debug block reminding you that a red suite may have a broken oracle, not broken code. By the end you will be able to: build a suite meeting a declared coverage criterion, and read a suite failure impartially between code and oracle.',
      },
    },
    {
      kind: 'predict',
      code: "hits = ['fail', 'pass', 'high']\ntotal = 4\nprint('branches: %d/%d' % (len(hits), total))",
      question: {
        ar: 'دالة بثلاثة فروع مرئية في القائمة وفرع رابع غائب. أي سلوك لم تختبره هذه الجلسة؟ وأي قيمة مدخل واحدة تضيفه إلى hits فتصبح التغطية 4/4؟',
        en: 'A function with three visible branches in the list and a fourth missing. Which behavior has this session not tested? And which single input value appends it, making coverage 4/4?',
      },
      reveal: {
        ar: 'الطباعة: branches: 3/4. الفرع الغائب هو invalid — حالة المدخل غير الصالح التي تعيد القيمة الحارسة. مدخل واحد يضيفه: أي قيمة سالبة مثل -1 أو أي قيمة فوق السقف مثل 101. ومن هنا قاعدة المشروع: الكفاية رقم مرئي — أنت تقرر أي معيار تعلن (فروع؟ حدود؟ أزواج؟) ثم تُظهر العدد.',
        en: 'It prints branches: 3/4. The missing branch is invalid — the bad-input case returning the sentinel. One input adds it: any negative value like -1, or anything over the ceiling like 101. Hence the project\u2019s rule: adequacy is a visible number — you declare the criterion (branches? boundaries? pairs?) and then show the count.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل: من الأسئلة الأربعة إلى المعايير', en: 'The chapter map: from four questions to criteria' },
      chunks: [
        {
          ar: 'الأسئلة الأربعة من الدرس الأول تعود في كل قرار اختبار: selection أي مدخلات نختار (أصناف تكافؤ وحدود وأزواج لا صيد عشوائي)، وadequacy متى نتوقف (كسر مغطى تحت معيار مسمّى — أرضية لا سقف)، وoracle من يحكم على الخرج (قيمة من المواصفة، أو خاصية، أو مقارنة بتنفيذ مستقل، أو عين)، وautomation كيف تتكرر الحزمة آليًّا عند كل تعديل لتصطاد regressions. والمستويات تترتب هرمًا اقتصاديًّا: unit سريع ومعزول بالأبدال، وintegration للوصلات، وfunctional/system للتحقق، وacceptance للتصديق، وsmoke كبوابة سريعة — فتستثمر أكثر حيث التغذية الراجعة أسرع وأرخص.',
          en: 'The four questions from lesson one return in every testing decision: selection — which inputs (equivalence classes, boundaries and pairs, not random fishing); adequacy — when to stop (a covered fraction under a named criterion — a floor, not a ceiling); oracle — who judges the output (a spec-derived value, a property, a cross-check, or an eye); and automation — how the suite reruns on every change to catch regressions. Levels stack into an economic pyramid: fast isolated unit tests with doubles, integration at the seams, functional/system for verification, acceptance for validation, smoke as a quick gate — so you invest most where feedback is fastest and cheapest.',
        },
        {
          ar: 'معايير الصندوق الأبيض تقيس إجهاد الكود بسلم قوة: statement تغطي كل سطر ينفَّذ، وbranch تطلب من كل قرار نتيجتيه — وهي أدق لأن سطرًا واحدًا قد يخفي فرعًا كاملًا — ثم path على المسارات كلها (نظريةً أقوى وعمليًّا منفجر)، وMC/DC الحل الوسط الخطّي الذي يعزل أثر كل شرط في القرارات المركبة الحرجة. ومعايير الصندوق الأسود تقيس إجهاد المواصفة: أصناف تكافؤ بممثل لكل سلوك، وحدود حيث تتجمع العيوب عند المقارنات الهشة، وأزواج تكافئ الانفجار التوافقي مستندة إلى نتيجة NIST أن أغلب عيوب التفاعل ثنائية. ولا معيار واحد يكفي — بل شبكة منسوجة منها جميعًا.',
          en: 'White-box criteria measure code stress on a strength ladder: statement covers every executed line; branch demands both outcomes of every decision — strictly stronger because one line can hide a whole arm; path over all routes (strongest in theory, explosive in practice); and MC/DC, the linear middle path isolating each condition\u2019s effect in critical compound decisions. Black-box criteria measure spec stress: equivalence classes with one representative per behavior, boundaries where defects cluster at fragile comparisons, and pairs taming the combinatorial explosion per the NIST finding that most interaction defects are two-way. No single criterion suffices — the net is woven from all of them.',
        },
        {
          ar: 'والخلاصة التي يختم بها الكتاب: لا كمية اختبار تثبت صحة البرنامج — لكن حزمة مبنية من هذه المعايير، صندوقًا أبيض وأسود، على المستوى الصحيح، بأوراكل صادق، تُشغَّل آليًّا عند كل تغيير، هي أوثق شبكة وأوفرها لاقتناص العيوب التي وعدنا الفصل الأول بعدم قابليتها للمنع. والفصل القادم يقلب هذه الغريزة العدائية نحو مهاجم حقيقي: أمن البرمجيات يدرس المدخلات الخبيثة ومسارات الخطأ كأداة هجوم لا كأداة كشف.',
          en: 'And the book\u2019s closing verdict: no amount of testing proves correctness — but a suite built from these criteria, black-box and white-box, at the right level, with honest oracles, run automatically on every change, is the most reliable and economical net for catching the defects chapter one promised are inevitable. The next chapter flips this adversarial instinct toward a real attacker: software security studies malicious inputs and error paths as attack tools, not just detection aids.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'حزمة ذات معنى: الكفاية المرئية', en: 'A suite that means something: visible adequacy' },
      chunks: [
        {
          ar: 'سرّ الحزمة التي تحسب: دالة مزوّدة بمقياس. بدل الدالة الصامتة، تُزوَّد كل فرعة بسطر واحد يسجّل اسمها في قائمة seen — لا تغيير في السلوك، فقط شهادة حضور. بعد تشغيل الحالات تصبح التغطية قراءةً لا تخمينًا: len(set(seen)) يقول كم فرعًا لمست فعًلا. هذا التدعيم instrumentation هو ما حوّل تغطية الكود من مفهوم نظري في الدرس الثاني إلى رقم تطبعه وحدك الآن — ونفس الفكرة تعمم: عدّاد أصناف للصندوق الأسود، وعدّاد أزواج للاختبار التوافقي.',
          en: 'The secret of a countable suite: an instrumented function. Instead of silent code, every branch appends one line recording its name into a seen list — no behavior change, just an attendance certificate. After the cases run, coverage is a reading, not a guess: len(set(seen)) says how many branches were actually touched. This instrumentation is what turned code coverage from the theory of lesson two into a number you print yourself — and the idea generalizes: a class counter for black-box work, a pair counter for combinatorial testing.',
        },
        {
          ar: 'وعندما تحمّر الحزمة، قرّر بحياد: الفشل يعني تناقضًا بين ثلاثة أشياء — الكود، والأوراكل، أو المواصفة نفسها إن بدا الكود والأوراكل متسقين. أول من يُفحص غالبًا هو الأوراكل: هل القيمة المتوقعة منسوخة من المواصفة أم من تخمين قديم؟ ثم الكود، ثم المواصفة (فربما اكتشف اختبارك عيبًا في المواصفة ذاتها). هذا الحياد هو مهارة اليوم الخفية: الحزمة الصادقة تكشف التناقض، والحزمة المتواطئة مع تخمينك تخفيه.',
          en: 'And when the suite goes red, judge impartially: failure means a contradiction among three things — the code, the oracle, or the specification itself when code and oracle agree. The usual first suspect is the oracle: is the expected value copied from the spec or from an old guess? Then the code. Then the spec — your test may have found a defect in the specification itself. This impartiality is today\u2019s hidden skill: an honest suite exposes the contradiction; a suite colluding with your guess hides it.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'حزمة مصغّرة بمقياس فروع', en: 'A miniature instrumented suite' },
      code: "seen = []\n\ndef band(score):\n    if score < 60:\n        seen.append('fail')\n        return 'fail'\n    if score < 80:\n        seen.append('pass')\n        return 'pass'\n    seen.append('high')\n    return 'high'\n\ncases = [\n    ('just below', 59, 'fail'),\n    ('on the line', 60, 'pass'),\n    ('high edge', 80, 'high'),\n    ('mid', 70, 'pass'),\n]\n\npassed = 0\nfor name, arg, expected in cases:\n    if band(arg) == expected:\n        passed = passed + 1\n    else:\n        print('FAILED:', name)\n\nprint('tests: %d passed: %d' % (len(cases), passed))\nprint('branches: %d of 3' % len(set(seen)))",
      explanation: {
        ar: 'أربعة مكونات تلاحظها: الدالة المزوّدة بسجل seen — كل فرعة توقّع حضورها؛ وقائمة حالات فيها حدها الأدنى (59) وحدها الأعلى (80) ووسط للفئة الأخيرة؛ وحلقة الحكم الصادقة التي تطبع FAILED بالاسم عند كل تناقض؛ وسطري الحصيلة — عد الاختبارات وعدّ الفروع الفعلية من إجمالي 3. النتيجة tests: 4 passed: 4 وbranches: 3 of 3 تعني حزمة خضراء تستوفي معيار الفروع المعلن. المشروع الآن يوسّع الصورة نفسها إلى مواصفة بفرع رابع (invalid) وعشرة مدخلات تحيط كل حد.',
        en: "Four components to notice: the instrumented function with its seen log — every branch signs its attendance; a case list holding the lower edge (59), the upper edge (80) and a middle of the last class; the honest judging loop printing FAILED with a name on every contradiction; and the two summary lines — test count and actual branches touched out of 3. The result tests: 4 passed: 4 and branches: 3 of 3 means a green suite meeting the declared branch criterion. The project now scales the same picture to a spec with a fourth branch (invalid) and ten inputs surrounding every edge.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-classify',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. مراجعة سريعة لمنطق الفئات والحدود من الدرس الثالث: أي فرع يمسك كل قيمة؟',
        en: 'Read the code and predict its exact output — one line per print — without running it. A quick review of class and boundary logic from lesson three: which branch catches each value?',
      },
      code: "def classify(level):\n    if level < 1:\n        return 'low'\n    if level > 100:\n        return 'high'\n    return 'ok'\n\nfor v in [0, 55, 101]:\n    print(v, classify(v))",
      solution: '0 low\n55 ok\n101 high',
      answer: '0 low\n55 ok\n101 high',
      hints: [
        { ar: 'القيمة 0 تفي بشرط level < 1 فتُصنَّف low قبل أي فحص آخر.', en: 'The value 0 satisfies level < 1 and classifies low before any other check.' },
        { ar: 'القيمة 55 تجتاز الفحصين الأولين (ليست < 1 وليست > 100) فتقع في الفرع الافتراضي ok.', en: 'The value 55 passes both guards (not < 1 and not > 100) so it lands in the default ok branch.' },
        { ar: 'القيمة 101 تفشل في level < 1 ثم تفشل في ok فلا يبقى إلا level > 100 → high — لاحظ أن الفرع الافتراضي ok يعمل كبوابة أخيرة لا كفئة مستقلة.', en: 'The value 101 fails level < 1 and fails ok, leaving level > 100 → high — note the default ok branch acts as a final gate, not an independent class.' },
        { ar: 'الخرج:\n0 low\n55 ok\n101 high', en: 'The output:\n0 low\n55 ok\n101 high' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.project-suite',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: حزمة اختبارات لمواصفة normalize_grade — عدد صحيح: أقل من 0 أو أكبر من 100 تعيد -1 (مدخل غير صالح)؛ 0-59 تعيد 0؛ 60-79 تعيد 1؛ 80-100 تعيد 2. الدالة مزوّدة بمقياس seen. ابنِ قائمة cases من عشر حالات بالترتيب التالي تمامًا: (-1، 0، 30، 59، 60، 70، 79، 80، 100، 101) بمتوقعات (-1، 0، 0، 0، 1، 1، 1، 2، 2، -1) وأسماء وصفية إنجليزية، ثم حلقة الحكم التي تطبع FAILED مع الاسم عند التناقض، ثم اطبع: tests: %d passed: %d وbranches: %d of 4. المتوقع: tests: 10 passed: 10 وbranches: 4 of 4.',
        en: 'The project: a test suite for the normalize_grade spec — integer in: below 0 or above 100 returns -1 (invalid); 0-59 returns 0; 60-79 returns 1; 80-100 returns 2. The function is instrumented with seen. Build a cases list of exactly ten cases in this order: (-1, 0, 30, 59, 60, 70, 79, 80, 100, 101) with expected values (-1, 0, 0, 0, 1, 1, 1, 2, 2, -1) and descriptive English names, then the honest judging loop printing FAILED with the name on any mismatch, then print tests: %d passed: %d and branches: %d of 4. Expected: tests: 10 passed: 10 and branches: 4 of 4.',
      },
      starterCode: "seen = []\n\ndef normalize_grade(score):\n    if score < 0 or score > 100:\n        seen.append('invalid')\n        return -1\n    if score < 60:\n        seen.append('fail')\n        return 0\n    if score < 80:\n        seen.append('pass')\n        return 1\n    seen.append('high')\n    return 2\n\ncases = [\n    # عشر حالات: (الاسم، المدخل، المتوقع) بالترتيب المطلوب\n    # ten cases: (name, input, expected) in the required order\n]\n\n# حلقة الحكم الصادقة ثم سطرا الحصيلة\n# the honest judging loop, then the two summary lines\n",
      solution: "seen = []\n\ndef normalize_grade(score):\n    if score < 0 or score > 100:\n        seen.append('invalid')\n        return -1\n    if score < 60:\n        seen.append('fail')\n        return 0\n    if score < 80:\n        seen.append('pass')\n        return 1\n    seen.append('high')\n    return 2\n\ncases = [\n    ('invalid low', -1, -1),\n    ('floor', 0, 0),\n    ('mid fail', 30, 0),\n    ('fail edge', 59, 0),\n    ('pass edge', 60, 1),\n    ('mid pass', 70, 1),\n    ('pass ceiling', 79, 1),\n    ('high edge', 80, 2),\n    ('ceiling', 100, 2),\n    ('invalid high', 101, -1),\n]\n\npassed = 0\nfor name, arg, expected in cases:\n    if normalize_grade(arg) == expected:\n        passed = passed + 1\n    else:\n        print('FAILED:', name)\n\nprint('tests: %d passed: %d' % (len(cases), passed))\nprint('branches: %d of 4' % len(set(seen)))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الحصيلة خضراء بالكامل', en: 'The summary is fully green' },
          code: "assert 'tests: 10 passed: 10' in __learner_output__, 'expected: tests: 10 passed: 10 | actual: %r' % __learner_output__",
          expected: 'tests: 10 passed: 10',
        },
        {
          id: 't2',
          name: { ar: 'كل الفروع الأربعة مستهللة', en: 'All four branches exercised' },
          code: "assert 'branches: 4 of 4' in __learner_output__, 'expected: branches: 4 of 4 | actual: %r' % __learner_output__",
          expected: 'branches: 4 of 4',
        },
        {
          id: 't3',
          name: { ar: 'المواصفة صحيحة عند الحواف', en: 'The spec holds at the edges' },
          code: "assert normalize_grade(-1) == -1 and normalize_grade(59) == 0 and normalize_grade(60) == 1 and normalize_grade(79) == 1 and normalize_grade(80) == 2 and normalize_grade(101) == -1, 'expected: -1/0/1/1/2/-1 | actual: %r' % ((normalize_grade(-1), normalize_grade(59), normalize_grade(60), normalize_grade(79), normalize_grade(80), normalize_grade(101)),)",
          expected: '-1/0/1/1/2/-1',
        },
        {
          id: 't4',
          name: { ar: 'لا فشل مخفي وعشر حالات', en: 'No hidden failures and ten cases' },
          code: "assert 'FAILED' not in __learner_output__ and len(cases) == 10, 'expected: no FAILED and 10 cases | actual: %r' % (__learner_output__ + ' | cases=' + str(len(cases)))",
          expected: 'no FAILED and 10 cases',
        },
      ],
      hints: [
        { ar: 'كل حالة tuple ثلاثي: (الاسم، المدخل، المتوقع). الحدود التي حول كل انتقال هي جوهر القائمة: 0 و59 طُرفَي فئة 0، و60 و79 طُرفَي فئة 1، و80 و100 طُرفَا فئة 2، مع ممثل وسط (30 و70) وحالتي الرفض -1 و101.', en: 'Each case is a triple: (name, input, expected). The edges around every transition are the heart of the list: 0 and 59 bound class 0, 60 and 79 bound class 1, 80 and 100 bound class 2, plus a middle representative (30 and 70) and the two rejections -1 and 101.' },
        { ar: 'حلقة الحكم هي نمط الدرس الأول: passed = passed + 1 عند التطابق، وإلا print(\'FAILED:\', name). وفي النهاية طبعتان: عدد الاختبارات مع الناجح، وعدد الفروع len(set(seen)) من 4.', en: "The judging loop is lesson one's pattern: passed = passed + 1 on match, else print('FAILED:', name). Then two prints: test count with passed, and branches as len(set(seen)) of 4." },
        { ar: 'الهيكل:\ncases = [\n    (\'invalid low\', -1, -1),\n    (\'floor\', 0, 0),\n    (\'mid fail\', 30, 0),\n    (\'fail edge\', 59, 0),\n    (\'pass edge\', 60, 1),\n    (\'mid pass\', 70, 1),\n    (\'pass ceiling\', 79, 1),\n    (\'high edge\', 80, 2),\n    (\'ceiling\', 100, 2),\n    (\'invalid high\', 101, -1),\n]\n\npassed = 0\nfor name, arg, expected in cases:\n    if normalize_grade(arg) == expected:\n        passed = passed + 1\n    else:\n        print(\'FAILED:\', name)\n\nprint(\'tests: %d passed: %d\' % (len(cases), passed))\nprint(\'branches: %d of 4\' % len(set(seen)))', en: "The skeleton:\ncases = [\n    ('invalid low', -1, -1),\n    ('floor', 0, 0),\n    ('mid fail', 30, 0),\n    ('fail edge', 59, 0),\n    ('pass edge', 60, 1),\n    ('mid pass', 70, 1),\n    ('pass ceiling', 79, 1),\n    ('high edge', 80, 2),\n    ('ceiling', 100, 2),\n    ('invalid high', 101, -1),\n]\n\npassed = 0\nfor name, arg, expected in cases:\n    if normalize_grade(arg) == expected:\n        passed = passed + 1\n    else:\n        print('FAILED:', name)\n\nprint('tests: %d passed: %d' % (len(cases), passed))\nprint('branches: %d of 4' % len(set(seen)))" },
        { ar: 'لو ظهر FAILED أو branches أقل من 4 فلا تصلح الدالة — إنها مطابقة للمواصفة. راجع حالتك المخالفة: القيم المتوقعة يجب أن تُنسخ من المواصفة حرفًّا — خصوصًا عند 79 (فئة 1) و80 (فئة 2).', en: 'If a FAILED appears or branches fall short of 4, do not fix the function — it matches the spec. Audit your cases: expected values must be copied verbatim from the spec — especially at 79 (class 1) and 80 (class 2).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-criterion',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'قرار مركب (A and B) اجتاز حزمة تغطية فروع كاملة، لكن اكتُشف لاحقًا أن B شرط ميت لا يغيّر النتيجة قط. أي معيار من هذا الفصل كان سيكشفه؟',
        en: 'A compound decision (A and B) passed a full branch-coverage suite, yet B was later found to be a dead condition that never changes the outcome. Which criterion from this chapter would have exposed it?',
      },
      options: [
        { id: 'a', text: { ar: 'تغطية العبارات statement coverage — لأنها تعدّ كل سطر', en: 'statement coverage — because it counts every line' } },
        { id: 'b', text: { ar: 'تغطية الفروع branch coverage — لأنها أقوى معيار للقرارات', en: 'branch coverage — the strongest decision criterion' } },
        { id: 'c', text: { ar: 'MC/DC — لأنها تطالب بزوج اختبارات يُظهر أثر كل شرط المستقل في القرار', en: 'MC/DC — it demands an isolating pair showing each condition independently affects the decision' } },
      ],
      answer: 'c',
      solution: 'c',
      hints: [
        { ar: 'تغطية العبارات أضعف السلم — فقد تُنفَّذ كل الأسطر بينما القرار يمر بمسار واحد.', en: 'Statement coverage is the weakest rung — every line can execute while the decision takes a single route.' },
        { ar: 'تغطية الفروع بالضبط ما اجتازته الحزمة: القرار كاملًا أخذ True وFalse — بينما B بقي ديكورًا في الحالتين.', en: 'Branch coverage is exactly what the suite passed: the whole decision took True and False — while B stayed decoration in both.' },
        { ar: 'زوج MC/DC المعزل لـ B يثبّت A ويقلب B وحده — فإن لم تنقلب النتيجة فشل الشرطُ الاختبارَ ويُعلن ميتًا.', en: 'The isolating MC/DC pair for B pins A and flips B alone — if the outcome does not flip, the condition fails the test and is declared dead.' },
        { ar: 'الجواب: c — MC/DC وحده يفحص الأثر المستقل، وهو ما جعله إلزاميًّا في الطيران.', en: 'Answer: c — MC/DC alone examines independent effect, which made it mandatory in avionics.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-grid',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'ثلاثة معاملات ثنائية القيمة (نعم/لا لكل منها). كم تكوينًا كاملًا تغطيه الشبكة الشاملة؟ (رقم فقط)',
        en: 'Three binary parameters (yes/no each). How many full configurations does exhaustive testing cover? (number only)',
      },
      answer: '8',
      solution: '8',
      tolerance: 0,
      hints: [
        { ar: 'كل معامل يضاعف عدد التركيبات — القاعدة 2 أس عدد المعاملات.', en: 'Each parameter doubles the combinations — the rule is 2 to the power of the parameter count.' },
        { ar: '2 × 2 × 2 — أو 2 ** 3 بلغة بايثون.', en: '2 × 2 × 2 — or 2 ** 3 in Python.' },
        { ar: 'وهذا سبب كتابة الجدول الكامل بأربعة صفوف فقط لقرار من شرطين: 2 أس 2.', en: 'This is why a two-condition decision needed only four truth-table rows: 2 to the 2.' },
        { ar: 'الجواب: 8', en: 'Answer: 8' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "seen = []\n\ndef normalize_grade(score):\n    if score < 0 or score > 100:\n        seen.append('invalid')\n        return -1\n    if score < 60:\n        seen.append('fail')\n        return 0\n    if score < 80:\n        seen.append('pass')\n        return 1\n    seen.append('high')\n    return 2\n\ncases = [('floor', 0, 0), ('high edge', 80, 2)]\n\npassed = 0\nfor name, arg, expected in cases:\n    if normalize_grade(arg) == expected:\n        passed = passed + 1\n    else:\n        print('FAILED:', name)\n\nprint('tests: %d passed: %d' % (len(cases), passed))\nprint('branches: %d of 4' % len(set(seen)))\n\n# جرّب: أضف حالتين فقط ترفعان التغطية من 2/4 إلى 4/4 — أي الفرعين أضفتهما؟\n# try: add just two cases lifting coverage from 2/4 to 4/4 — which two branches?\n# جرّب: غيّر متوقع حالة واحدة خطأً وشاهد FAILED يصرخ بالاسم — هذا أوراكل صادق\n# try: corrupt one expected value and watch FAILED call the name — that is an honest oracle\n# جرّب: احذف print('FAILED:', name) من الحلقة — هل ما زالت الحزمة تُخفي الفشل أم تكشفه؟\n# try: delete print('FAILED:', name) from the loop — does the suite still hide or expose the failure?",
      prompt: {
        ar: 'الملعب مشروعك مصغّرًا: حالتان فقط والتغطية 2/4 — أضف حالتين محسوبتين لتستوفي معيار الفروع بأقل عدد، ثم افسد أوراكلًا واحدًا وشاهد الحزمة الصادقة تصرخ، ثم احذف سطر FAILED وشاهد الحزمة المتواطئة تكذب بهدوء. هكذا تفهم لماذا تهم الأتمتة الصادقة لا مجرد إعادة التشغيل. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is your project in miniature: two cases and 2/4 coverage — add two calculated cases to meet the branch criterion minimally, then corrupt one oracle and watch the honest suite scream, then delete the FAILED line and watch the colluding suite lie quietly. That is why honest automation matters, not just rerunning. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'debug',
      id: 'ex5.debug-oracle',
      required: true,
      brokenCode: "seen = []\n\ndef normalize_grade(score):\n    if score < 0 or score > 100:\n        seen.append('invalid')\n        return -1\n    if score < 60:\n        seen.append('fail')\n        return 0\n    if score < 80:\n        seen.append('pass')\n        return 1\n    seen.append('high')\n    return 2\n\ncases = [\n    ('zero', 0, 0),\n    ('fail edge', 59, 0),\n    ('pass edge', 79, 0),\n    ('high edge', 80, 2),\n]\n\npassed = 0\nfor name, arg, expected in cases:\n    if normalize_grade(arg) == expected:\n        passed = passed + 1\n    else:\n        print('FAILED:', name, '-> got %s' % normalize_grade(arg))\n\nprint('tests: %d passed: %d' % (len(cases), passed))",
      prompt: {
        ar: 'الحزمة تحمّر: FAILED: pass edge -> got 1 وtests: 4 passed: 3. لكن دالة normalize_grade مطابقة للمواصفة حرفًّا — تحقق بنفسك: 79 تقع في 60-79 فالصحيح أن تعيد 1. فالعيب في الأوراكل لا في الكود: القيمة المتوقعة لحالة pass edge خُطئت إلى 0 بينما المواصفة تقول 1. صحّح القيمة المتوقعة وفق المواصفة حتى تصير الحزمة خضراء صادقة: tests: 4 passed: 4.',
        en: 'The suite is red: FAILED: pass edge -> got 1 and tests: 4 passed: 3. But normalize_grade matches the spec verbatim — verify yourself: 79 falls in 60-79 so the correct return is 1. The defect is in the oracle, not the code: the expected value for the pass edge case was mistyped as 0 while the spec says 1. Fix the expected value per the spec until the suite is honestly green: tests: 4 passed: 4.',
      },
      solution: "seen = []\n\ndef normalize_grade(score):\n    if score < 0 or score > 100:\n        seen.append('invalid')\n        return -1\n    if score < 60:\n        seen.append('fail')\n        return 0\n    if score < 80:\n        seen.append('pass')\n        return 1\n    seen.append('high')\n    return 2\n\ncases = [\n    ('zero', 0, 0),\n    ('fail edge', 59, 0),\n    ('pass edge', 79, 1),\n    ('high edge', 80, 2),\n]\n\npassed = 0\nfor name, arg, expected in cases:\n    if normalize_grade(arg) == expected:\n        passed = passed + 1\n    else:\n        print('FAILED:', name, '-> got %s' % normalize_grade(arg))\n\nprint('tests: %d passed: %d' % (len(cases), passed))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الحزمة خضراء بعد إصلاح الأوراكل', en: 'The suite is green after the oracle fix' },
          code: "assert 'tests: 4 passed: 4' in __learner_output__, 'expected: tests: 4 passed: 4 | actual: %r' % __learner_output__",
          expected: 'tests: 4 passed: 4',
        },
        {
          id: 't2',
          name: { ar: 'لا صفوف فشل متبقية', en: 'No FAILED lines remain' },
          code: "assert 'FAILED' not in __learner_output__, 'expected: no FAILED lines | actual: %r' % __learner_output__",
          expected: 'no FAILED lines',
        },
        {
          id: 't3',
          name: { ar: 'الدالة ظلت مطابقة للمواصفة', en: 'The function still matches the spec' },
          code: "assert normalize_grade(79) == 1 and normalize_grade(80) == 2 and normalize_grade(59) == 0, 'expected: 1/2/0 | actual: %r' % ((normalize_grade(79), normalize_grade(80), normalize_grade(59)),)",
          expected: '1/2/0',
        },
      ],
      hints: [
        { ar: 'لا تمسّ الدالة إطلاقًا — هي مطابقة للمواصفة. العيب في حقل واحد داخل الحالة المسمّاة pass edge.', en: 'Do not touch the function at all — it matches the spec. The defect is one field inside the case named pass edge.' },
        { ar: 'المواصفة: 60-79 تعيد 1. فالمدخل 79 متوقعًا 1 لا 0 — الحد الأعلى لفئة pass يظل داخلها.', en: 'The spec: 60-79 returns 1. So input 79 expects 1, not 0 — the upper bound of the pass class stays inside it.' },
        { ar: 'عدّل السطر إلى (\'pass edge\', 79, 1) ثم أعِد التشغيل: يجب أن تختفي FAILED ويصير السطر tests: 4 passed: 4.', en: "Change the line to ('pass edge', 79, 1) and rerun: FAILED must disappear and the line must read tests: 4 passed: 4." },
        { ar: 'الحل الكامل:\ncases = [\n    (\'zero\', 0, 0),\n    (\'fail edge\', 59, 0),\n    (\'pass edge\', 79, 1),\n    (\'high edge\', 80, 2),\n]\n\npassed = 0\nfor name, arg, expected in cases:\n    if normalize_grade(arg) == expected:\n        passed = passed + 1\n    else:\n        print(\'FAILED:\', name, \'-> got %s\' % normalize_grade(arg))\n\nprint(\'tests: %d passed: %d\' % (len(cases), passed))', en: "Full fix:\ncases = [\n    ('zero', 0, 0),\n    ('fail edge', 59, 0),\n    ('pass edge', 79, 1),\n    ('high edge', 80, 2),\n]\n\npassed = 0\nfor name, arg, expected in cases:\n    if normalize_grade(arg) == expected:\n        passed = passed + 1\n    else:\n        print('FAILED:', name, '-> got %s' % normalize_grade(arg))\n\nprint('tests: %d passed: %d' % (len(cases), passed))" },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن PY4E الفصل الثالث: if وelif وelse تصنع فروع التنفيذ. ماذا يعدّ بالضبط معيار تغطية الفروع على هذه البنية؟',
            en: 'From PY4E chapter 3: if, elif and else create execution branches. What exactly does the branch-coverage criterion count on this structure?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد الأسطر المكتوبة داخل البنية', en: 'The number of lines written inside the structure' } },
            { id: 'b', text: { ar: 'كل قرار يأخذ نتيجتيه True وFalse مرة واحدة على الأقل — بما يشمل الشرطان الحارسان ومسار else الافتراضي', en: 'Every decision takes both outcomes True and False at least once — including the guards and the default else route' } },
            { id: 'c', text: { ar: 'عدد مرات تشغيل الحزمة', en: 'How many times the suite ran' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الفروع التي يعدّها المعيار هي نتائج القرارات لا أسطر الشيفرة: سطر واحد يحوي شرطين مركبين يخفي قرارين — وهذه بالضبط الفجوة التي تصعّد MC/DC في الدرس الرابع.',
            en: 'The branches counted are decision outcomes, not source lines: one line holding a compound condition hides two decisions — exactly the gap MC/DC escalated in lesson four.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن PY4E الفصل الرابع: def وreturn يجعلان الدالة وحدة تخزين واستدعاء. لماذا كانت الدالة وحدة الاختبار الطبيعية عند unit testing؟',
            en: 'From PY4E chapter 4: def and return make a function a storable, callable unit. Why is the function the natural unit for unit testing?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنها أسرع ما يكتب في المحرر', en: 'Because it is the fastest to type' } },
            { id: 'b', text: { ar: 'لأن حدودها واضحة: مدخل معروف، استدعاء واحد، وقيمة عائدة تقارن بالمرجع — عقد صغير قابل للحكم الآلي', en: 'Because its boundaries are crisp: a known input, one call, and a return value comparable against a reference — a small contract machine-judgeable' } },
            { id: 'c', text: { ar: 'لأن الدوال لا ترتكب أخطاء عادةً', en: 'Because functions rarely contain defects' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'وحدة الاختبار تحتاج عقدًا محكمًا حتى يصبح الأوراكل ممكنًا — وdef/return يمنحانه: مدخل بارامتري وخرج معاد. لهذا نفس الدالة تُستدعى في حزمتك اليوم آلاف المرات بلا عين بشرية.',
            en: 'A unit needs a tight contract for an oracle to exist — def/return provides it: parameterized input, returned output. That is why the same function can be called thousands of times in your suite today with no human eye.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'وحدتان تنجحان منفردتين في unit tests ثم يُخرِب تركيبهما الوصلة بينهما. أي مستوى من هرم الفصل مخصص لاصطياد هذا؟',
            en: 'Two units pass their isolated unit tests, then their combination breaks at the seam. Which level of the chapter\u2019s pyramid is built to catch this?',
          },
          options: [
            { id: 'a', text: { ar: 'unit testing — أعد الاختبار بمدخلات أكبر', en: 'unit testing — retest with bigger inputs' } },
            { id: 'b', text: { ar: 'integration testing — يفحص الوصلات والافتراضات المشتركة بين المتعاونين', en: 'integration testing — it exercises the seams and shared assumptions between collaborators' } },
            { id: 'c', text: { ar: 'smoke testing — تشغيل سريع للتأكد أن التطبيق يعمل', en: 'smoke testing — a quick run confirming the app boots' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الهرم يوزع الأدوار: unit للداخل، integration للوصلات، functional/system للتحقق الكامل، acceptance للتصديق. عيب الوصلة — افتراض وحدات مختلف عن العقد — موطنه المستوى الثاني.',
            en: 'The pyramid divides roles: unit for insides, integration for seams, functional/system for full verification, acceptance for validation. A seam defect — one unit\u2019s assumption breaking the shared contract — lives at the second level.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أيُّ العيوب التالية قد يفوت تغطيةَ فروع كاملة وتجزئةَ أصناف كاملة معًا؟',
            en: 'Which defect can slip through full branch coverage and full equivalence partitioning at once?',
          },
          options: [
            { id: 'a', text: { ar: 'فرع لم يُنفَّذ قط', en: 'A branch never executed' } },
            { id: 'b', text: { ar: 'مدخل غير صالح يُقبل بالخطأ', en: 'An invalid input wrongly accepted' } },
            { id: 'c', text: { ar: 'شرط ميت داخل قرار مركب لا يغيّر النتيجة وحده — يكشفه MC/DC لا الفروع', en: 'A dead condition inside a compound decision that alone never changes the outcome — exposed by MC/DC, not branches' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'تغطية الفروع تقيس القرار ككل: يكفيه أن يأخذ نتيجتيه مرة — بينما الشرط الميت يظل بلا أثر في كل الاختبارات. زوج MC/DC المعزل هو الحكم الوحيد على الأثر المستقل، كما رأيت في الدرس الرابع.',
            en: 'Branch coverage measures the decision as a whole: both outcomes once suffice — the dead condition stays inert throughout. The isolating MC/DC pair is the only judge of independent effect, as lesson four showed.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'حزمتك تحمّر والفحص يظهر أن الدالة مطابقة للمواصفة. أول ما تفحصه وفق درس اليوم؟',
            en: 'Your suite went red and the check shows the function matches the spec. What do you examine first, per today\u2019s lesson?',
          },
          options: [
            { id: 'a', text: { ar: 'الأوراكل: هل القيمة المتوقعة منسوخة من المواصفة أم من تخمين قديم؟', en: 'The oracle: is the expected value copied from the spec or from an old guess?' } },
            { id: 'b', text: { ar: 'أعيد تشغيل الحزمة — ربما يختفي الفشل وحده', en: 'Rerun the suite — the failure may vanish on its own' } },
            { id: 'c', text: { ar: 'احذف الحالة الحمراء فتصير الحزمة خضراء', en: 'Delete the red case so the suite goes green' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'فشل الحزمة تناقض بين الكود والأوراكل والمواصفة — والأرجح قبلة الأوراكل: متوقع مهجور من نسخة قديمة من المواصفة. حذف الحالة تواطؤ يخفي التناقض بدل حسمه، وإعادة التشغيل الجوفاء لا تحسم شيئًا.',
            en: 'A red suite is a contradiction among code, oracle and spec — and the likeliest culprit is the oracle: a stale expected value from an older spec revision. Deleting the case is collusion that hides the contradiction; blind rerunning settles nothing.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'من الدرس الرابع: ما الذي يضمنه جدول الأزواج pairwise بالضبط؟',
            en: 'From lesson four: what exactly does a pairwise table guarantee?',
          },
          options: [
            { id: 'a', text: { ar: 'تغطية كل تركيبة كاملة من كل المعاملات', en: 'Covering every full combination of all parameters' } },
            { id: 'b', text: { ar: 'لكل زوج معاملات، ظهور كل تقاطع قيم في اختبار واحد على الأقل', en: 'For every parameter pair, every value intersection appears in at least one test' } },
            { id: 'c', text: { ar: 'تغطية كل فروع الكود مرة واحدة', en: 'Covering every code branch once' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الضمان زوجي لا شامل: عيب Safari+JP يُصطاد لأن اختبارًا ما يجمعهما، بينما تركيبة ثلاثية نادرة قد تفوت — ولهذا ترتقي الأدوات إلى 3-way عند تبرير الخطر. الجدول الشهير حققه بـ 9 اختبارات بدل 27.',
            en: 'The guarantee is pairwise, not exhaustive: the Safari+JP bug is caught because some test pairs them, while a rare three-way combination may slip — which is why tools escalate to 3-way when risk justifies. The famous table achieved it in 9 tests instead of 27.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'حزمة حمراء تعني دائمًا كودًا مكسورًا',
          right: 'افحص بالترتيب: الأوراكل أولًا (هل المتوقع من المواصفة؟) ثم الكود ثم المواصفة نفسها',
          note: {
            ar: 'بلوك التصحيح اليوم كان مثالك: الدالة مطابقة والمتوقع مخطئ — والحياد بين الثلاثة مهارة: الحزمة الصادقة تكشف التناقض ولا تقرر مسبقًا من المذنب. أصلح الأوراكل حين يموّه، والكود حين يخالف المواصفة.',
            en: 'Today\u2019s debug block was your case: the function conforms and the oracle lies — impartiality among the three is the skill: an honest suite exposes the contradiction without pre-deciding the culprit. Fix the oracle when it distorts, the code when it violates the spec.',
          },
        },
        {
          wrong: 'حزمة بلا قياس: «اختبرنا كثيرًا فكفى»',
          right: 'دالة مزوّدة بمقياس seen وسطر branches: 4 of 4 — الكفاية رقم تُعلنه وتُظهره',
          note: {
            ar: 'التدعيم حوّل التغطية من وعود إلى قراءة: بعد التشغيل تعرف أي الفروع مستهلل فعًلا. أعلن معيارك (فروع؟ حدود؟ أزواج؟) واطبع كسرك — وإلا فلن تعرف متى كفى الحزام ومتى صار ثقيلًا بلا حماية إضافية.',
            en: 'Instrumentation turned coverage from promises into readings: after the run you know which branches truly fired. Declare your criterion (branches? boundaries? pairs?) and print your fraction — otherwise you never know when the harness suffices and when it became dead weight.',
          },
        },
        {
          wrong: 'التوقف عند 100% تغطية فروع بوصفها خط النهاية',
          right: 'التغطية أرضية لا سقف: أضف الأصناف والحدود والأزواج — ولا معيار يثبت الصحة',
          note: {
            ar: 'خلاصة الكتاب: لا كمية اختبار تثبت صحة البرنامج — لكن الشبكة المنسوجة من معايير متكاملة هي أوفى ما نملك. 100% فروع مع شرط ميت ما زالت ثغرة، كما رأيت — فاصعد المعيار بحسب الخطر ولا تبِع الاطمئنان الكاذب.',
            en: 'The book\u2019s verdict: no amount of testing proves correctness — but the net woven from complementary criteria is the best we have. 100% branches with a dead condition still leaks, as you saw — escalate the criterion with the risk and never sell false comfort.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الأسئلة الأربعة (selection وadequacy وoracle وautomation) هي عدسة أي حزمة: مدخلات من فئات وحدود وأزواج، وكفاية كسر مُعلن، وأوراكل من المواصفة، وإعادة تشغيل آلية عند كل تعديل — على هرم مستويات من unit إلى acceptance.', en: 'The four questions (selection, adequacy, oracle, automation) are the lens for any suite: inputs from classes, boundaries and pairs; adequacy as a declared fraction; an oracle from the spec; automatic reruns on every change — across a pyramid of levels from unit to acceptance.' },
        { ar: 'سلم الصندوق الأبيض statement ⇐ branch ⇐ path مع MC/DC الخطّي للقرارات المركبة، وسلم الصندوق الأسود أصناف وحدود وأزواج — ولا معيار يكفي وحده: الحزمة القوية تنسجها معًا.', en: 'The white-box ladder statement ⇐ branch ⇐ path with linear MC/DC for compound decisions, and the black-box ladder of classes, boundaries and pairs — no criterion suffices alone: strong suites weave them together.' },
        { ar: 'المشروع: دالة مزوّدة بمقياس فروع + عشر حالات تحيط كل حد + حلقة حكم صادقة = حزمة تُعلن معيارها وتطبعه (tests: 10 passed: 10 وbranches: 4 of 4) — وحين تحمّر فافحص الأوراكل قبل الكود.', en: 'The project: an instrumented function + ten cases surrounding every edge + an honest judging loop = a suite that declares its criterion and prints it (tests: 10 passed: 10 and branches: 4 of 4) — and when it goes red, examine the oracle before the code.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وارفع حزمتك من 2/4 إلى 4/4 بأقل عدد حالات، ثم افسد أوراكلًا وشاهد الصراخ، ثم احذف سطر FAILED وشاهد الكذب الصامت. اسأل نفسك: في مشروعك القادم — أي معيار ستعلن قاعدة توقف، ولماذا لا يكفي أن «تبدو الحزمة خضراء»؟',
        en: 'Open the sandbox, lift your suite from 2/4 to 4/4 with the fewest cases, corrupt an oracle and watch it scream, then delete the FAILED line and watch the quiet lie. Ask yourself: in your next project — which criterion will you declare as the stopping rule, and why is a green-looking suite never enough?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch10.s7', pages: 'ص274-275 / pp.274-275' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch10.s7', pages: 'ص274-275 / pp.274-275' },
  ],
} satisfies Lesson;

export default lesson;