import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch10.l1 — "Why Test? Levels of Testing / لماذا نختبر؟ ومستويات الاختبار"
 * Aligned with SWE ch10 s1 (Overview of Testing) + s2 (Levels of Testing),
 * book pp.253–264. All expression is original — a paraphrase of the CC BY-SA
 * 4.0 source, never a verbatim translation.
 * Runnable design: assert-based mini harnesses in the book's apply_discount
 * tradition (input, expected, observed), test doubles (stub/mock) in the
 * sandbox. Deterministic only: no input(), no random, no exit(),
 * no unittest.main.
 */
const lesson = {
  id: 'swe.ch10.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 10,
  title: { ar: 'لماذا نختبر؟ ومستويات الاختبار', en: 'Why Test? Levels of Testing' },
  estimatedMinutes: 25,
  prerequisites: ['swe.ch9.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'برنامجك نجح في كل تجاربك — فهل اطمأنّ القلب؟ الفصل التاسع هاجم العيوب قبل التشغيل بالفحص الساكن static checking والأنواع والمراجعة review؛ أما هذا الفصل فيهاجم ما تبقى بتشغيل البرنامج على مدخلات مختارة ومقارنة فِعله بما يجب أن يكون. الاختبار لا يثبت صحة برنامج قط — لكنه أوثق شبكة عملية لاقتناص العيوب التي تفوت المراجعة، وتلك التي سيدخلها تعديل قادم. والمهارة المركزية: أي اختبارات نكتب، ومتى نكفي؟ اليوم تشرّح الاختبار: مدخل وقيمة متوقعة وسلوك ملحوظ، والمشكلات الأربعة المتكررة selection وadequacy وoracle وautomation، ثم مستويات الاختبار unit وintegration وsystem وacceptance والهرم الذي يرتبها اقتصاديًّا. بنهاية الدرس ستكون قادرًا على: بناء حزام اختبارات مصغّر يعدّ الناجح والفاشل، وتمييز المستوى المناسب لكل عيب، وترتيب أنواع oracle من الأقوى إلى الأضعف، وتفسير لماذا يجعل الـ unit test الكشف رخيصًا ومبكرًا.',
        en: 'Your program passed every trial you gave it — are we done? Chapter 9 attacked defects before running, with static checking, types and review; this chapter attacks the rest by running the program on chosen inputs and comparing what it does with what it should do. Testing never proves a program correct — but it is the most practical net for catching the defects reviews miss, and the ones a future change will introduce. The central skill: which tests to write, and when are they enough. Today you dissect a test: an input, an expected value, an observed behavior; the four recurring problems — selection, adequacy, oracle and automation; then the test levels — unit, integration, system and acceptance — and the pyramid that ranks them economically. By the end of this lesson you will be able to: build a miniature test harness that counts passes and failures, match each defect to its right level, rank oracle types from strongest to weakest, and explain why the unit test makes detection cheap and early.',
      },
    },
    {
      kind: 'predict',
      code: "def initial(name):\n    return name[0]      # defect: forgot .upper()\n\ncases = [\n    ('amy', 'A'),\n    ('bob', 'B'),\n]\npassed = 0\nfailed = 0\nfor name, expected in cases:\n    if initial(name) == expected:\n        passed = passed + 1\n    else:\n        failed = failed + 1\n        print('FAILED:', name)\n\nprint('passed: %d failed: %d' % (passed, failed))",
      question: {
        ar: 'حزام اختبارات مصغّر كامل في سطور: دالة وحدة، وقائمة حالات (الاسم، المتوقع)، وحلقة تُطبّق المتوقع كـ oracle. ماذا سيطبع قبل أن تشغّله؟ وكم حالة ستنجو؟',
        en: 'A miniature test harness in a few lines: one unit function, a list of (name, expected) cases, and a loop applying the expected value as the oracle. What will it print before you run it? And how many cases survive?',
      },
      reveal: {
        ar: 'ثلاثة أسطر: FAILED: amy ثم FAILED: bob ثم passed: 0 failed: 2. العيب في initial: نسيت upper فأعادت a بدل A — والحزام كشف حضوره فورًا. لاحظ الفرق عن «شغّلتها ونظرت»: الحزام يحكم لكل حالة تلقائيًّا ويجمع الأحكام في رقمين، فهو قابل للتكرار في كل تعديل قادم. هكذا يتحول الاختبار من فن شخصي إلى آلية هندسية — وهذا درس اليوم كله.',
        en: 'Three lines: FAILED: amy, then FAILED: bob, then passed: 0 failed: 2. The defect lives in initial: it forgot upper and returned a instead of A — and the harness revealed its presence instantly. Note the difference from run-it-and-look: the harness records a verdict per case automatically and sums them into two numbers, so it repeats cheaply on every future change. That is testing turning from a personal art into an engineering mechanism — the whole of today.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من «شغّلها وانظر» إلى الهندسة', en: 'From run-and-look to engineering' },
      chunks: [
        {
          ar: 'التقيتَ بالاختبار في صورته المصغّرة مرارًا: شغّل الكود وانظر إلى الخرج واقرر إن كان صحيحًا. المتاعب أن البرنامج الحقيقي يحتمل مدخلات أكثر من ذرات الكون، فالنظرة السريعة لا تتناسب مع الحجم ولا تخبرك متى تتوقف. اختبارٌ بمعنى هذا الفصل يسجل ثلاثة أمور: مدخلًا أو تهيئة، ونتيجة متوقعة، وسلوكًا ملحوظًا عند التشغيل — وينجح إذا تطابق الملحوظ مع المتوقع. والمجموعة التي تُشغَّل معًا تسمى test suite. وقاعدته الذهبية: الاختبار يكشف حضور العيوب ولا يثبت غيابها قط — نجاح المجموعة يعني «لم يُستثار عيب بهذه المدخلات» لا «لا عيب موجود»، وكل الفصل محاولة لجعل العبارة الأولى أقوى ما يمكن.',
          en: 'You have met testing in miniature again and again: run the code, look at the output, decide if it is right. The trouble: a real program admits more inputs than there are atoms in the universe, so run-and-look neither scales nor tells you when to stop. A test in this chapter\u2019s sense records three things: an input or setup, an expected result, and the observed behavior when run — passing when observed matches expected. A collection run together is a test suite. And its golden rule: testing can reveal the presence of defects but never their absence — a passing suite means no defect was triggered by these inputs, not that none exists, and the whole chapter is about making the first statement as strong as it can practically be.',
        },
        {
          ar: 'أربعة مشكلات صعبة تتكرر مع كل ما تختبره، ونسميها الآن لأن بقية الفصل أجوبة عنها. Selection: فضاء المدخلات فلكي — أي حفنة تشغّل فعلًا؟ Adequacy: بعد تشغيل بعض الاختبارات، متى تكون كافية — ما قاعدة التوقف؟ Oracle: لكل مدخل، من يقرر أن الخرج الملحوظ صحيح؟ وأحيانًا هذا أصعب من إنتاج الخرج نفسه. Automation والتكرار: اختبار لا تُعيد تشغيله بتكلفة زهيدة يكاد لا يساوي شيئًا، لأن قيمته البعيدة هي اقتناص regressions — عيوب قديمة يعيد تعديل جديد إدخالها؛ والتنقّل اليدوي «أنقر وانظر» يرسب في هذا البند تحديدًا. ونقد مثل «اختباراتك ضعيفة» يتفتت دائمًا إلى واحد من الأربعة: مدخلات خاطئة، أو توقف مبكر، أو oracle متساهل، أو اختبارات لا تجري تلقائيًّا.',
          en: 'Four hard problems recur with everything you test; name them now, because the rest of the chapter answers them. Selection: the input space is astronomical — which handful do you actually run? Adequacy: after running some tests, when is it enough — what is the stopping rule? Oracle: for each input, who decides the observed output is correct? Sometimes that is harder than producing the output. Automation and repeatability: a test you cannot re-run cheaply is nearly worthless, because its long-term value is catching regressions — old defects reintroduced by new changes; manual click-around fails exactly this item. And criticism like your tests are weak always resolves into one of the four: wrong inputs, stopping too early, a lax oracle, or tests that never run automatically.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الكفاية وسلّم الحُكّام', en: 'Adequacy and the oracle ladder' },
      chunks: [
        {
          ar: '«اختبرناه» ليست قاعدة توقف؛ أما «غطينا كل branch وكل صنف تكافؤ وكل boundary وكل الاختبارات تنجح» فهي كذلك. معيار الكفاية test-adequacy criterion شرط قابل للفحص يحوّل سؤال «هل كفينا؟» الغامض إلى سؤال معدود: مجموعة أشياء يجب تغطيتها — عبارات أو branches أو مسارات أو أصناف أو حدود — والتغطية coverage هي الكسر المغطى من المجموع. التغطية أرضية لا سقف: 100% من branches يعني أن كلها اشتغلت لا أنها كلها صحيحة؛ لكن التغطية المنخفضة إنذار حقيقي — كود لم يعمل تحت أي اختبار هو كود لا تعرف عنه شيئًا. واحذر الفخ: قيادة الفريق برقم تغطية مجرد تنتج اختبارات بلا assertions تشغّل الكود ولا تفحصه — التغطية أداة تشخيص لا هدف، وتقترن دائمًا بـ oracle صادق.',
          en: 'We tested it is not a stopping rule; we covered every branch, every equivalence class and every boundary, and all tests pass is. A test-adequacy criterion is a checkable condition that turns the vague have-we-tested-enough into a countable question: a set of things to cover — statements, branches, paths, classes, boundaries — and coverage is the covered fraction of that set. Coverage is a floor, not a ceiling: 100% branch coverage means every branch ran, not that each is correct; but low coverage is a genuine alarm — code that never ran under any test is code you know nothing about empirically. Beware the pitfall: driving a team by a bare coverage number breeds assertion-free tests that execute code without checking it — coverage is a diagnostic, not a goal, always paired with an honest oracle.',
        },
        {
          ar: 'الـ oracle هو ما يقرر لمدخل معين هل الخرج صحيح، وله سلّم من الأقوى إلى الأضعف. القيمة المتوقعة الدقيقة: تعرف الجواب وتثبته — assert add(2, 3) == 5؛ الأقوى لكنها متاحة فقط حين تحسب الجواب استقلالًا. خاصية أو ثابتة invariant: لا تسمّي الجواب لكنك تعرف شرطًا يجب أن يحققه — للترتيب: الخرج permutation للدخل وغير متناقص؛ وللتشفير: decrypt(encrypt(x)) == x. المقارنة المتقاطعة cross-check: قارن بتنفيذ مستقل — نسخة مرجعية بطيئة أو إصدار سابق. والحكم البشري: عين تنظر — ضروري للذوق والمظهر، بطيء وغير قابل للتكرار، عدو الأتمتة. وصعوبة اختيار oracle لأنظمة كالخرائط وترتيب نتائج البحث معروفة باسم oracle problem — وهي غالبًا أصعب جزء في اختبار الأنظمة الحقيقية.',
          en: 'The oracle is whatever decides, for a given input, whether the output is correct — a ladder from strongest to weakest. Exact expected value: you know the answer and hard-code it — assert add(2, 3) == 5; strongest, but only when you can compute it independently. Property or invariant: you cannot name the answer but know a condition it must satisfy — for a sort: the output is a permutation of the input and non-decreasing; for encryption: decrypt(encrypt(x)) == x. Cross-check: compare with an independent implementation — a slow reference or a previous release. Human judgment: an eye inspects — necessary for look-and-feel, slow, non-repeatable, the enemy of automation. The difficulty of choosing oracles for maps or search ranking is the famous oracle problem — often the hardest part of testing real systems.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'مستويات الاختبار والهرم', en: 'Test levels and the pyramid' },
      chunks: [
        {
          ar: 'يحدث الاختبار على مستويات تتفاوت في حجم النظام قيد الفحص، وهي متكاملة لا متكررة. الـ unit test يفحص أصغر قطعة قابلة للاختبار بمعزل عن النظام — دالة أو تابع أو صنف — وتُستبدل تبعياته ببدائل: الـ stub يعيد أجوبة معلّبة، والـ mock يضيف تسجيل النداءات فتؤكد على كيفية الاستخدام، والـ fake تنفيذ عامل مصغّر كقاعدة بيانات في الذاكرة.',
          en: 'Testing happens at levels differing in how much of the system is under test, and they are complementary, not redundant. A unit test exercises the smallest independently testable piece in isolation — a function, method or class — with dependencies replaced by doubles: a stub returns canned answers, a mock additionally records calls so you can assert on how the unit used it, and a fake is a small working implementation like an in-memory database.',
        },
          {
          ar: 'واختبارات الوحدة خيول المجموعة: سريعة ودقيقة وثابتة. ووصفة FIRST تنقّح كل اختبار: Fast بأجزاء الثانية، Independent بلا حالة مشتركة ولا ترتيب لازم، Repeatable على كل جهاز وتشغيل، Self-validating يحمل oracle نفسه ولا ينتظر عينًا، Timely يُكتب مع الكود أو قبله. ولماذا مبكرًا؟ اقتصاد الهرم: عيب يلتقطه unit test يعود بخطأ محدد في ثوانٍ، وترتفع كلفته في كل مرحلة ينجو منها حتى تصير شكوى عميل واستردادًا.',
          en: 'Unit tests are the workhorses of a suite: fast, precise, stable. The FIRST recipe polices every test: Fast in milliseconds; Independent, no shared state or required order; Repeatable on every machine and run; Self-validating, carrying its own oracle instead of waiting for an eye; Timely, written with or before the code. Why early? Pyramid economics: a defect caught by a unit test returns in seconds on the exact line, and costs more at every stage it survives — up to a customer complaint and a refund.',
        },
        {
          ar: 'فوق الوحدة: integration testing يشغّل الواجهات والتفاعلات بين الوحدات — هناك تنكشف الافتراضات المختلفة وصيغ البيانات الخاطئة: وحدة تعيد أمتارًا وأخرى تنتظر أقدام، وكل unit test نجح ومع ذلك الوصلة مكسورة. ثم functional testing يفحص ميزة كاملة على مواصفتها كصندوق أسود، وsystem testing يشغّل النظام كاملًا في بيئة شبيهة بالإنتاج مع المتطلبات غير الوظيفية كالأداء والأمان، وacceptance testing يجيب سؤال العميل: هل أوقّع؟ — بمعاييره هو، وUAT بمستخدمين حقيقيين ومهام واقعية.',
          en: 'Above the unit: integration testing exercises the interfaces and interactions between units — mismatched assumptions and wrong data formats surface there: one unit returns meters, another expects feet, every unit test passes, yet the seam is broken. Then functional testing checks a complete feature against its specification as a black box, system testing runs the whole integrated system in a production-like environment with non-functional requirements like performance and security, and acceptance testing answers the customer\\u2019s question — will I sign for this?',
        },
          {
          ar: 'والميزان اللغوي: وظيفي وsystem يسألان «هل بنينا المنتج صحيحًا؟» verification، وacceptance يسأل «هل بنينا المنتج الصحيح؟» validation. وsmoke test مرور سريع ضحل بعد كل بناء: هل النظام حي أصلًا؟ واحذر فوق ذلك المخروط المقلوب: كومة E2E بطيئة متقلّبة flaky يتعلم الجميع تجاهل بنياتها الحمراء — استثمر عمدًا في قاعدة الهرم العريضة.',
          en: '— against the customer\\u2019s own criteria, with UAT using real users on realistic tasks. The vocabulary: functional and system ask did we build the product right (verification); acceptance asks did we build the right product (validation). A smoke test is a fast, shallow pass after each build: is the build alive at all? And beware the inverted ice-cream cone: a pile of slow, flaky E2E tests everyone learns to ignore — invest deliberately in the pyramid\\u2019s broad base.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مجموعة unit test بأسلوب assert', en: 'An assert-style unit suite' },
      code: "def apply_discount(price, percent):\n    \"\"\"Reduce price by percent (0..100); reject bad input.\"\"\"\n    if price < 0:\n        raise ValueError('price must be non-negative')\n    if percent < 0 or percent > 100:\n        raise ValueError('percent must be in 0..100')\n    return round(price * (1 - percent / 100), 2)\n\nassert apply_discount(100.0, 0) == 100.0\nassert apply_discount(143.0, 50) == 71.5\nassert apply_discount(9.99, 10) == 8.99\nassert apply_discount(40.0, 100) == 0.0\n\nfor price, percent in [(-1.0, 10), (100.0, 150)]:\n    try:\n        apply_discount(price, percent)\n        print('missed rejection for %r' % ((price, percent),))\n    except ValueError:\n        pass\n\nprint('suite ok: 4 passed + 2 rejections')",
      explanation: {
        ar: 'الدالة apply_discount من عائلة أمثلة الفصل: تخفيض سعر بنسبة في 0..100 ورفض المدخل السيئ برفع ValueError. أربعة assert لكل سلوك مسمّى — بلا خصم، نصف الخصم، التقريب إلى فلس، الخصم الكامل — ثم حلقة تمرّ على مدخلين سيئين وتتوقع الرفع: try/except يلتقط ValueError فتسكت الحالة الصحيحة، وأي رفض فائت يُطبع. لا عين بشرية تقرأ أرقامًا هنا: كل اختبار يحمل oracle الخاص به، والسطر الأخير suite ok هو التأكيد الذاتي. ولاحظ انتقاء المدخلات: 0 و100 حدّا النطاق — ونعود إليهما بجدية في درس الصندوق الأسود — و150 صنف غير صالح. هذه هي وحدة الاختبار بعينها: قطعة واحدة معزولة، وoracle صريح، ورسالة فشل تسمّي السلوك.',
        en: 'The function apply_discount from the chapter\u2019s running family: reduce a price by a percent in 0..100 and reject bad input by raising ValueError. Four asserts, one per named behavior — no discount, half off, rounding to cents, full discount — then a loop walks two bad inputs expecting rejection: try/except catches ValueError so a well-behaved rejection stays silent, and any missed rejection prints. No human eye reads numbers here: every test carries its own oracle, and the final suite ok line is the self-validation. Notice the input choice: 0 and 100 are the range\u2019s edges — we return to them seriously in the black-box lesson — and 150 is an invalid class. That is unit testing itself: one isolated piece, an explicit oracle, a failure message naming the behavior.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.mini-harness',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب الحلقة التي تكمل الحزام: لكل حالة من cases نفّذ fn(arg) وقارن النتيجة بـ expected. عند التطابق زد passed واحدًا؛ وإلا زد failed واطبع FAILED مع اسم الحالة. في النهاية اطبع سطرًا واحدًا بصيغة passed: %d failed: %d. المتوقع مع الحالات المعطاة: passed: 3 failed: 0.',
        en: 'Write the loop that completes the harness: for each case in cases run fn(arg) and compare the result with expected. On a match add one to passed; otherwise add one to failed and print FAILED with the case name. At the end print one line in the form passed: %d failed: %d. Expected with the given cases: passed: 3 failed: 0.',
      },
      starterCode: "def double(x):\n    return x * 2\n\ncases = [\n    ('double of 3', double, 3, 6),\n    ('double of 0', double, 0, 0),\n    ('double of -4', double, -4, -8),\n]\n\npassed = 0\nfailed = 0\n# اكتب الحلقة: for name, fn, arg, expected in cases — نفّذ وقارن وعُدّ ثم اطبع الحصيلة\n# write the loop: for name, fn, arg, expected in cases — run, compare, count, then print the summary\n",
      solution: "def double(x):\n    return x * 2\n\ncases = [\n    ('double of 3', double, 3, 6),\n    ('double of 0', double, 0, 0),\n    ('double of -4', double, -4, -8),\n]\n\npassed = 0\nfailed = 0\nfor name, fn, arg, expected in cases:\n    if fn(arg) == expected:\n        passed = passed + 1\n    else:\n        failed = failed + 1\n        print('FAILED:', name)\n\nprint('passed: %d failed: %d' % (passed, failed))",
      tests: [
        {
          id: 't1',
          name: { ar: 'سطر الحصيلة مطبوع بالصيغة الصحيحة', en: 'The summary line printed in the right form' },
          code: "assert 'passed: 3 failed: 0' in __learner_output__, 'expected: passed: 3 failed: 0 | actual: %r' % __learner_output__",
          expected: 'passed: 3 failed: 0',
        },
        {
          id: 't2',
          name: { ar: 'الدالة double تعمل كما يجب', en: 'The double function behaves' },
          code: "assert double(3) == 6 and double(0) == 0 and double(-4) == -8, 'expected: 6 / 0 / -8 | actual: %r' % ((double(3), double(0), double(-4)),)",
          expected: '6 / 0 / -8',
        },
        {
          id: 't3',
          name: { ar: 'ثلاث حالات في القائمة', en: 'Three cases in the list' },
          code: "assert len(cases) == 3, 'expected: 3 cases | actual: %r' % len(cases)",
          expected: '3 cases',
        },
        {
          id: 't4',
          name: { ar: 'لا أسطر فشل — كل الحالات نجحت', en: 'No FAILED lines — every case passed' },
          code: "assert 'FAILED' not in __learner_output__, 'expected: no FAILED lines | actual: %r' % __learner_output__",
          expected: 'no FAILED lines',
        },
      ],
      hints: [
        { ar: 'الحلقة تفكّ الحقول الأربعة للحالة دفعة واحدة: for name, fn, arg, expected in cases — ثم استدعاء واحد fn(arg) ومقارنة بـ expected.', en: 'The loop unpacks the four case fields at once: for name, fn, arg, expected in cases — then one call fn(arg) compared with expected.' },
        { ar: "العدّادان جاهزان قبل الحلقة؛ استخدم passed = passed + 1 في فرع التطابق، وfailed = failed + 1 مع print('FAILED:', name) في فرع الاختلاف.", en: "The counters already exist; use passed = passed + 1 in the match branch, and failed = failed + 1 with print('FAILED:', name) in the mismatch branch." },
        { ar: "الهيكل:\nfor name, fn, arg, expected in cases:\n    if fn(arg) == expected:\n        passed = passed + 1\n    else:\n        failed = failed + 1\n        print('FAILED:', name)\nprint('passed: %d failed: %d' % (passed, failed))", en: "The skeleton:\nfor name, fn, arg, expected in cases:\n    if fn(arg) == expected:\n        passed = passed + 1\n    else:\n        failed = failed + 1\n        print('FAILED:', name)\nprint('passed: %d failed: %d' % (passed, failed))" },
        { ar: "def double(x):\n    return x * 2\n\ncases = [\n    ('double of 3', double, 3, 6),\n    ('double of 0', double, 0, 0),\n    ('double of -4', double, -4, -8),\n]\n\npassed = 0\nfailed = 0\nfor name, fn, arg, expected in cases:\n    if fn(arg) == expected:\n        passed = passed + 1\n    else:\n        failed = failed + 1\n        print('FAILED:', name)\n\nprint('passed: %d failed: %d' % (passed, failed))", en: "def double(x):\n    return x * 2\n\ncases = [\n    ('double of 3', double, 3, 6),\n    ('double of 0', double, 0, 0),\n    ('double of -4', double, -4, -8),\n]\n\npassed = 0\nfailed = 0\nfor name, fn, arg, expected in cases:\n    if fn(arg) == expected:\n        passed = passed + 1\n    else:\n        failed = failed + 1\n        print('FAILED:', name)\n\nprint('passed: %d failed: %d' % (passed, failed))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-last-two',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. تذكّر سلوك الشرائح من الفصل الثامن مع السلاسل الأقصر من الطول المطلوب.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Recall chapter-8 slicing behavior for strings shorter than the requested length.',
      },
      code: "def last_two(s):\n    return s[-2:]\n\ncases = [\n    ('python', 'on'),\n    ('hi', 'hi'),\n]\nfor arg, expected in cases:\n    got = last_two(arg)\n    if got == expected:\n        print('ok %s' % arg)\n    else:\n        print('bad %s -> %s' % (arg, got))\n\nprint('done')",
      solution: 'ok python\nok hi\ndone',
      answer: 'ok python\nok hi\ndone',
      hints: [
        { ar: "الشريحة s[-2:] تعيد آخر حرفين — وللسلسلة الأقصر من حرفين تعيد السلسلة كلها بلا خطأ، كما علّم الفصل الثامن.", en: 'The slice s[-2:] returns the last two characters — and for a string shorter than two it returns the whole string without error, as chapter 8 taught.' },
        { ar: "last_two('python') = 'on' يطابق المتوقع — فتُطبع ok python.", en: "last_two('python') = 'on' matches the expectation — so ok python prints." },
        { ar: "last_two('hi') = 'hi' أيضًا مطابق — فلا يظهر FAILED إطلاقًا ويُطبع done في النهاية.", en: "last_two('hi') = 'hi' matches too — so no FAILED ever appears and done prints last." },
        { ar: 'الخرج:\nok python\nok hi\ndone', en: 'The output:\nok python\nok hi\ndone' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-levels',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'وحدتان تنجح كل منهما في unit test منفرد، لكن الأولى تعيد مسافة بالمتر والثانية تنتظرها بالقدم — فالخرج المركب خاطئ. أي مستوى اختبار يصطاد هذا العيب؟',
        en: 'Two units each pass in an isolated unit test, but the first returns a distance in meters while the second expects feet — the combined output is wrong. Which test level catches this defect?',
      },
      options: [
        { id: 'a', text: { ar: 'unit testing — أسرع المستويات وأدقها', en: 'unit testing — the fastest, most precise level' } },
        { id: 'b', text: { ar: 'integration testing — لأن العيب في الوصلة والافتراضات المشتركة بين وحدتين', en: 'integration testing — the defect lives in the seam and the shared assumptions between two units' } },
        { id: 'c', text: { ar: 'acceptance testing — لأن العميل أول من يكتشفه', en: 'acceptance testing — the customer discovers it first' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'كل وحدة صحيحة بمعزل عن الأخرى — إذن الخلل ليس داخل وحدة بل بينها.', en: 'Each unit is correct in isolation — so the flaw is not inside a unit but between two.' },
        { ar: 'هذا صنف العيوب الذي لا تراه اختبارات الوحدة أصلًا: عدم تطابق العقد بين وحدتين متعاونتين.', en: 'This is the defect class unit tests are blind to: a mismatched contract between two collaborating units.' },
        { ar: 'المستوى الذي يكبّر النطاق من زوج متعاونين نحو أنظمة فرعية كاملة هو الذي يفحص الواجهات.', en: 'The level that grows the scope from a pair of collaborators toward whole subsystems is the one that exercises the interfaces.' },
        { ar: 'الجواب: b — integration testing يصطاد عدم تطابق الواجهات والافتراضات.', en: 'Answer: b — integration testing catches interface and assumption mismatches.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-oracle',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'ما يقرر — لمدخل معين — هل الخرج الملحوظ صحيح أم لا، وهو أحيانًا أصعب أجزاء الاختبار، يسمى ____. (كلمة إنجليزية واحدة)',
        en: 'Whatever decides, for a given input, whether the observed output is correct — sometimes the hardest part of testing — is called the ____. (one English word)',
      },
      answer: 'oracle',
      solution: 'oracle',
      hints: [
        { ar: 'الاسم مستعار من عالم التنبؤ: الجهة التي تعطيك الجواب المرجعي.', en: 'The name is borrowed from prophecy: the source that hands you the reference answer.' },
        { ar: 'في assert add(2, 3) == 5 فإن القيمة 5 نفسها تقوم بهذا الدور.', en: 'In assert add(2, 3) == 5 the value 5 itself plays this role.' },
        { ar: 'قد يكون قيمة دقيقة أو خاصية invariant أو مقارنة بتنفيذ مستقل أو عينًا بشرية.', en: 'It may be an exact value, an invariant property, a cross-check against an independent implementation, or a human eye.' },
        { ar: 'الجواب: oracle', en: 'Answer: oracle' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def apply_discount(price, percent):\n    if price < 0:\n        raise ValueError('price must be non-negative')\n    if percent < 0 or percent > 100:\n        raise ValueError('percent must be in 0..100')\n    return round(price * (1 - percent / 100), 2)\n\nclass PriceService:\n    def __init__(self, catalog, discounts):\n        self.catalog = catalog\n        self.discounts = discounts\n\n    def quote(self, item):\n        return apply_discount(self.catalog.price_of(item), self.discounts.percent_for(item))\n\nclass StubCatalog:\n    def price_of(self, item):\n        return 12.0\n\nclass StubDiscounts:\n    def percent_for(self, item):\n        return 25\n\nsvc = PriceService(StubCatalog(), StubDiscounts())\nprint('quote: %s' % svc.quote('mug'))\n\nclass MockDiscounts:\n    def __init__(self):\n        self.calls = []\n\n    def percent_for(self, item):\n        self.calls.append(item)\n        return 25\n\nmock = MockDiscounts()\nPriceService(StubCatalog(), mock).quote('mug')\nprint('calls: %r' % (mock.calls,))\n\n# جرّب: اجعل StubDiscounts يعيد 50 بدل 25 — احسب quote يدويًّا قبل التشغيل\n# try: make StubDiscounts return 50 instead of 25 — hand-compute quote before running\n# جرّب: استدعِ quote على عنصر ناقص مثل 'cup' — أين يرتفع ValueError ولماذا؟\n# try: call quote on a missing item like 'cup' — where does ValueError rise and why?",
      prompt: {
        ar: 'جرّب بنفسك: الـ stub يغذي الخدمة بأجوبة معلّبة، والـ mock يسجّل النداءات فتقرأ calls بعد الاستدعاء — هكذا تؤكد على التفاعل لا على النتيجة وحدها. بدّل قيمة الـ stub وتوقّع quote قبل التشغيل، ثم استدعِ quote على عنصر غير موجود في الكتالوج ولا في الخصومات وشاهد أين ينكسر. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: the stub feeds the service canned answers, and the mock records calls so you can read calls after invoking — asserting on the interaction, not just the result. Change the stub value and predict quote before running, then call quote for an item missing from both catalog and discounts and watch where it breaks. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن PY4E الفصل الرابع: def تخزن شيفرة باسم وتعيدها بـ return. بمَ خدم هذا الاختبار الآلي اليوم؟',
            en: 'From PY4E chapter 4: def stores code under a name and returns with return. How did that serve automated testing today?',
          },
          options: [
            { id: 'a', text: { ar: 'الدالة هي الوحدة قيد الاختبار: مدخل معروف واستدعاء واحد وقيمة مرجعية نقارن بها ما تعيده — عقد التخزين وإعادة الاستخدام نفسه', en: 'The function is the unit under test: a known input, one call, and a reference value to compare its return against — the same store-and-reuse contract' } },
            { id: 'b', text: { ar: 'الدوال لا علاقة لها بالاختبار الآلي', en: 'Functions have nothing to do with automated testing' } },
            { id: 'c', text: { ar: 'return يمنع كتابة الاختبارات لأنه يوقف الدالة', en: 'return prevents writing tests because it stops the function' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الـ unit test يستدعي دالة بمدخل معروف ويقارن ما تعيده بقيمة مرجعية — وdef وreturn من الفصل الرابع هما البنية نفسها؛ الجديد أن التحقق أصبح آليًّا بـ assert بدل النظر اليدوي.',
            en: 'A unit test calls a function with a known input and compares its return with a reference value — def and return from chapter 4 are the very structure; the new part is that verification became automated with assert instead of an eyeball.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل التاسع: الفحص الساكن static checking والأنواع والمراجعة review تعمل دون تشغيل البرنامج. أين يقع الاختبار بالنسبة إليها؟',
            en: 'From chapter 9: static checking, types and review work without running the program. Where does testing sit relative to them?',
          },
          options: [
            { id: 'a', text: { ar: 'بديل يُلغي الحاجة إليها نهائيًّا', en: 'A replacement that removes the need for them entirely' } },
            { id: 'b', text: { ar: 'الخط الديناميكي التالي: يهاجم بالتشغيل على مدخلات مختارة العيوب التي تفوّتها الأدوات الساكنة والمراجعة — والاثنان يكملان بعضهما', en: 'The next, dynamic line: it attacks by running on chosen inputs the defects the static tools and review miss — the two complement each other' } },
            { id: 'c', text: { ar: 'نفس الشيء باسم مختلف', en: 'The same thing under a different name' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الفصل التاسع قبل التشغيل، وهذا الفصل أثناء التشغيل: الاختبار لا يثبت الصحة لكنه يصطاد ما فات الساكن — ولذلك يجتمعان في خط إنتاج واحد كما سترى لاحقًا.',
            en: 'Chapter 9 runs before execution, this chapter during it: testing never proves correctness but catches what the static side missed — which is why the two eventually join one pipeline.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'فريق يقول: «اختبرنا التطبيق ونظرنا إليه فيبدو سليمًا». أي المشكلات الأربع يرتكبونها أولًا كقاعدة توقف؟',
            en: 'A team says: we tested the app and looked at it, it seems fine. Which of the four problems are they committing first as a stopping rule?',
          },
          options: [
            { id: 'a', text: { ar: 'selection — اختيار المدخلات', en: 'selection — choosing inputs' } },
            { id: 'b', text: { ar: 'adequacy — «يبدو سليمًا» ليست معيار كفاية معدودًا', en: 'adequacy — it seems fine is not a countable adequacy criterion' } },
            { id: 'c', text: { ar: 'automation — لا أتمتة', en: 'automation — no automation' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قاعدة التوقف الصحيحة معدودة: غطينا كل branch وكل صنف تكافؤ وكل boundary وكل الاختبارات نجحت — أما «يبدو سليمًا» فإحساس لا criterion، وهو بالضبط ما يحوّله معيار الكفاية إلى رقم.',
            en: 'A proper stopping rule is countable: we covered every branch, every equivalence class and every boundary, and all tests pass — it seems fine is a feeling, which is exactly what an adequacy criterion turns into a number.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'دالة ترسم خريطة مدينة — أي oracle تختار عمليًّا للتحقق من خرجها؟',
            en: 'A function renders a city map — which oracle do you practically choose to verify its output?',
          },
          options: [
            { id: 'a', text: { ar: 'قيمة متوقعة دقيقة محفوظة لكل مدخل ممكن', en: 'An exact expected value stored for every possible input' } },
            { id: 'b', text: { ar: 'حكم بشري على اللقطة — لأن الصورة الصحيحة يصعب تسميتها، وهذا جوهر oracle problem', en: 'Human judgment on the snapshot — because the right picture is hard to name, which is the heart of the oracle problem' } },
            { id: 'c', text: { ar: 'لا oracle ممكن إطلاقًا فنترك الدالة بلا اختبار', en: 'No oracle is possible at all, so we leave the function untested' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'للخرائط والترتيب والتوقعات لا «جواب صحيح» يُحسب بسهولة — فيسقط الاختيار على خاصية أو مقارنة أو عين بشرية؛ وصعوبة تسمية الجواب الصحيح هي oracle problem التي حذّر منها الفصل.',
            en: 'For maps, ranking and forecasts there is no easily computed right answer — so the choice falls to a property, a cross-check, or a human eye; the difficulty of naming the correct output is the oracle problem the chapter warned about.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "print(double(3))  # ثم انظر بعينك",
          right: "assert double(3) == 6  # الحكم داخل الاختبار",
          note: {
            ar: 'الطباعة تنتظر عينًا بشرية في كل تشغيل — اختبار غير self-validating لا يجري تلقائيًّا ولا يحمي من regressions؛ أما assert فيحمل oracle ويعرف النجاح والفشل بنفسه.',
            en: 'Printing waits for a human eye on every run — a non-self-validating test never runs automatically and protects nothing from regressions; an assert carries its oracle and knows pass and fail by itself.',
          },
        },
        {
          wrong: 'حالات للمدخلات الصالحة فقط',
          right: 'أصناف صالحة وغير صالحة معًا: 55 و-3 و250 و"text"',
          note: {
            ar: 'الفئة المفقودة دائمًا هي غير الصالحة — انتقاء المدخلات الذي يتجاهل الأصناف الفاشلة يترك نصف المواصفة بلا حكم، وهي بالضبط الفئات التي يغفلها الاختبار العشوائي.',
            en: 'The missing class is always the invalid one — input selection that ignores the failing classes leaves half the specification unjudged, exactly the classes ad-hoc testing skips.',
          },
        },
        {
          wrong: '«اختبرنا كفاية لأننا تعبنا»',
          right: '«غطينا كل branch وكل صنف وكل حد — وكل الاختبارات نجحت»',
          note: {
            ar: 'قاعدة التوقف معيار معدود لا إحساس: الكفاية تُقاس بكسر تغطية تحت criterion مسمّى — وإلا فلن تعرف متى كلف الاختبار قيمته ومتى صار مضيعة.',
            en: 'A stopping rule is a criterion, not a feeling: adequacy is measured as a coverage fraction under a named criterion — otherwise you never know when tests paid for themselves and when they became waste.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الاختبار يسجّل ثلاثية: مدخل وقيمة متوقعة وسلوك ملحوظ — وينجح عند التطابق؛ والمجموعة test suite تُشغَّل آليًّا لاقتناص regressions عند كل تعديل.', en: 'A test records the triple: input, expected value, observed behavior — passing on match; the test suite runs automatically to catch regressions on every change.' },
        { ar: 'المشكلات الأربع: selection أي مدخلات، adequacy متى نكفي (التغطية كسر مغطى وأرضية لا سقف)، oracle من يحكم (قيمة/خاصية/مقارنة/عين)، automation وإعادة التكرار — ونقد أي مجموعة يتحلل إليها.', en: 'The four problems: selection (which inputs), adequacy (when enough — coverage as a covered fraction, a floor not a ceiling), oracle (who judges: exact value, property, cross-check, eye), automation and repeatability — any suite critique decomposes into them.' },
        { ar: 'المستويات متكاملة: unit معزول بأبدال stub/mock/fake ووصفة FIRST، integration للوصلات، functional/system للتحقق verification، acceptance للتصديق validation، وsmoke كبوابة — والهرم يرشّد الاستثمار: كثير سريع، قليل بطيء.', en: 'Levels complement: unit isolated with stub/mock/fake doubles and the FIRST recipe, integration for seams, functional/system for verification, acceptance for validation, smoke as a gate — the pyramid rations investment: many fast, few slow.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب واجعل StubDiscounts يعيد 50 بدل 25، واحسب يدويًّا quote قبل التشغيل. ثم اسأل نفسك: أي oracle استخدمت في الحساب — قيمة دقيقة أم خاصية؟ ولماذا بدت حالة «bowl بلا خصم» سهلة بينما «عنصر مفقود» أصعب في تحديد المتوقع؟',
        en: 'Open the sandbox, make StubDiscounts return 50 instead of 25, and hand-compute quote before running. Then ask yourself: which oracle did you use — an exact value or a property? And why did the no-discount bowl case feel easy while the missing item felt hard to specify?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch10.s1', pages: 'ص253-258 / pp.253-258' },
        { book: 'SWE', section: 'swe.ch10.s2', pages: 'ص258-264 / pp.258-264' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch10.s1', pages: 'ص253-258 / pp.253-258' },
    { book: 'SWE', section: 'swe.ch10.s2', pages: 'ص258-264 / pp.258-264' },
  ],
} satisfies Lesson;

export default lesson;
