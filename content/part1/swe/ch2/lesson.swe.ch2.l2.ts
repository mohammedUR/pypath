import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch2.l2 — "Agile Development: Extreme Programming"
 * التطوير الرشيق: البرمجة الفائقة
 * Aligned with SWE ch2 s3 (Agile Development: Extreme Programming, pp.41-43).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: a deterministic TDD red-green-refactor ledger (a real red
 * phase via try/except NameError, then the least code that passes, then a
 * behavior-preserving rename) plus a CI merge counter over a fixed commit
 * sequence with a longest-green-streak computation.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
const lesson = {
  id: 'swe.ch2.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 2,
  title: { ar: 'التطوير الرشيق: البرمجة الفائقة', en: 'Agile Development: Extreme Programming' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch2.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قائمة مراجعات الكود في فريقك قد بلغت أربعين طلبًا، والاختبار "مرحلة" مجدولة بعد شهرين، والدمج يحدث كل جمعة — وكل جمعة عاصفة. ثم يقرأ زميلك XP فيقول جملة غريبة: إن كانت الممارسة جيدة فارفع مقبضها إلى أقصى ما يمكن. إن كان الاختبار جيدًا فاختبر باستمرار لا في مرحلة؛ وإن كانت المراجعة جيدة فراجع بلا توقف بالبرمجة الثنائية لا بـ PR يتقادم؛ وإن كان الدمج جيدًا فادمج عدة مرات يوميًا لا أسبوعيًا. هذا الدرس عن الممارسات التي تجعل كل سبرنت سكرم ينتج زيادة صلبة فعلًا لا تشبه الشحن. ستكتب حلقة TDD كاملة بأصواتها الثلاثة — أحمر ثم أخضر ثم إعادة هيكلة — وترى سبب قاعدة العمر: لا تثق باختبار لم تره يفشل.',
        en: 'Your team\u2019s review queue is forty pull requests deep, testing is a "phase" scheduled two months out, and integration happens every Friday — and every Friday is a storm. Then a teammate reads XP and says something strange: if a practice is good, turn its dial up as far as it goes. If testing is good, test constantly, not in a phase. If review is good, review continuously by pairing, not with a PR that ages. If integration is good, merge many times a day, not weekly. This lesson is about the practices that make each Scrum sprint produce an increment that is genuinely solid, not just demo-shaped. You will write a full TDD cycle with its three voices — red, green, refactor — and see why the durable rule exists: never trust a test you have never seen fail.',
      },
    },
    {
      kind: 'predict',
      code: "try:\n    is_overdue(4, 3)\nexcept NameError:\n    print('red: NameError')\n\ndef is_overdue(days_late, limit):\n    return days_late > limit\n\nprint('green: %s' % is_overdue(4, 3))",
      question: {
        ar: 'أول نداء لدالة لا وجود لها بعد، محاطًا بـ try يلتقط NameError. لماذا يكتب مهندس اختبارًا يعرف مسبقًا أنه سيفشل — وماذا يطبع الكود؟',
        en: 'The first call to a function that does not exist yet, wrapped in a try that catches NameError. Why would an engineer write a test she knows will fail — and what does the code print?',
      },
      reveal: {
        ar: 'الطباعة: red: NameError ثم green: True. الفشل المتعمد يثبت ثلاثة أشياء مرة واحدة: الاختبار يُنفَّذ فعلًا، وفشله مربوط بالسلوك الغائب بعينه، وهو يفرّق التنفيذ الحالي عن المقصود — ويثبّت ما يعني "منتهي" لهذه الشريحة. لو لم تره يحمرّ أبدًا فلن تعرف هل يفحص شيئًا أصلًا: أحمر هو شهادة ميلاد الاختبار.',
        en: 'It prints red: NameError then green: True. The deliberate failure proves three things at once: the test actually executes, its failure is tied to exactly the missing behavior, and it can tell the current implementation apart from the intended one — and it pins what "done" means for this slice. If you never saw it go red, you cannot know it checks anything at all: red is the test\u2019s birth certificate.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'XP: مقابض مرفوعة إلى أقصاها وقصص كبطاقات', en: 'XP: dials up to extreme, stories like cards' },
      chunks: [
        {
          ar: 'أين ينظّم سكرم وقت الفريق، تُلزم البرمجة الفائقة Extreme Programming بانضباطه الهندسي. XP تأخذ ممارسات معروفة الجودة — الاختبار، مراجعة الكود، الدمج، التصميم البسيط — وترفع مقابضها إلى "الفائق": اختبار دائم، مراجعة متصلة بالبرمجة الثنائية، دمج عدة مرات يوميًا مع خط أنابيب آلي يبني ويختبر كل دمج. الإطاران متكاملان لا متنافسان، وفرق كثيرة تجمعهما: سكرم للإيقاع وXP لملء كل سبرنت بانضباط يجعل الزيادة "منتهية" حقًا — بحيث يستطيع تعريف الإنجاز أن يتضمن "مُختبَر، مُراجَع، مُدمج" بصدق.',
          en: 'Where Scrum organizes the team\u2019s time, Extreme Programming (XP) prescribes its engineering discipline. XP takes practices already known to be good — testing, code review, integration, simple design — and turns their dials up to "extreme": test constantly, review continuously by pairing, integrate many times a day with an automated build-and-test pipeline verifying each merge. The two frameworks are complementary, not rivals, and many teams combine them: Scrum for the cadence, XP to fill each sprint with the discipline that makes the increment genuinely done — so the Definition of Done can honestly say "tested, reviewed, integrated".',
        },
        {
          ar: 'المتطلبات في XP قصص مستخدم user stories: وصف قصير لميزة من زاوية الزبون، بحجم بطاقة فهرس، بقالب "بصفتي <دورًا> أريد <قدرة> حتى <منفعة>". والقصة عمدًا ليست مواصفة — هي في العبارة المشهورة وعدٌ بمحادثة: البطاقة موضع حوار مع الزبون عن تفاصيل ستفهمها أفضل بعد أن تبني أول نسخة وتعرضها. صغرها يجعلها سهلة الترتيب والتقدير والإدخال سبرنتًا. وتُختصر صفات القصة الجيدة في INVEST: مستقلة Independent، قابلة للتفاوض Negotiable، ثمينة Valuable، قابلة للتقدير Estimable، صغيرة Small، قابلة للاختبار Testable — والخاصية الأهم للبناء أخيرة: إن لم تستطع تحديد كيف ستختبر تحقق القصة فلم تفهمها بعد كفايةً لبناءها.',
          en: 'XP captures requirements as user stories: short descriptions of a feature told from the customer\u2019s point of view, sized to an index card, on the template "As a <role>, I want <capability> so that <benefit>". A story is deliberately not a specification — in the famous phrase, a promise to have a conversation: the card is a placeholder for a discussion whose details you will understand far better once you build the first version and show it. Their small size makes them easy to prioritize, estimate and slot into a sprint. Good stories are summarized by INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable — and the property that matters most for building is the last: if you cannot state how you would test that a story is satisfied, you do not yet understand it well enough to build it.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الحلقة الحمراء-الخضراء-إعادة الهيكلة', en: 'The red–green–refactor loop' },
      chunks: [
        {
          ar: 'أكثر أفكار XP تأثيرًا: الاختبار ليس مرحلة بعد التطوير بل جزء منه — يُكتب باستمرار، ويُشغَّل دائمًا، ويُستخدم أداة تصميم. التوقيع هو التطوير بقصوى الاختبار TDD: حلقة ضيقة تُختصر إلى أحمر-أخضر-إعادة هيكلة. اكتب اختبارًا صغيرًا لسلوك غير موجود بعد وراقبه يفشل للسبب المتوقع (أحمر): الفشل يؤكد أن الاختبار يُنفَّذ فعلًا، وأن فشله مربوط بالسلوك الغائب، وأنه يفرق التنفيذ الحالي عن المقصود. ثم اكتب أقل شيفرة تجعل الاختبار يمر (أخضر). ثم حسّن التصميم والاختبار يحرس ضد الكسر (إعادة هيكلة). وكرر بدورات من دقائق، مع قاعدة دائمة: لا تثق باختبار لم تره يفشل، ولا بفشل لم تفهمه — أحمر ناتج عن إعداد مكسور أو import ناقص ليس الأحمر الذي تبحث عنه.',
          en: 'XP\u2019s most influential idea: testing is not a phase after development — it is part of it, written continuously, run constantly, used as a design tool. The signature practice is test-driven development (TDD), a tight loop summarized as red–green–refactor. Write a small test for behavior that does not exist yet and watch it fail for the expected reason (red): the failure confirms the test actually executes, that its failure is tied to the missing behavior, and that it distinguishes current from intended code. Then write the least code that makes it pass (green). Then improve the design while the test guards against breakage (refactor). Repeat in minutes-long cycles — with a durable rule: never trust a test you have never seen fail, and never trust a failure you have not understood; a red from a broken setup or a missing import is not the red you are looking for.',
        },
        {
          ar: 'لماذا تعمل هكذا؟ ثلاثة أسباب. أولًا الاختبارات المكتوبة أولًا صادقة — لا يمكن تشكيلها بصمت لتطابق ما تفعله الشيفرة صدفةً. ثانيًا الحزمة المتنامية شبكة تراجعات: تغيّر بلا خوف لأن الكسر يعلن نفسه فورًا، وهذا بالضبط ما يجعل إعادة الهيكلة المستمرة آمنة. ثالثًا كتابة الاختبار أولًا تجبرك على استخدام واجهتك قبل بنائها فتظهر التصاميم المزعجة مبكرًا. لاحظ أن السبب الثالث عن التصميم لا عن الإمساك بالعيوب: الاختبار في XP أقل عن صيد الأعطال في النهاية وأكثر عن قيادة التصميم وتمكين التغيير.',
          en: 'Why work this way? Three reasons. First, tests written first are honest — they cannot be quietly shaped to match whatever the code happens to do. Second, the growing suite is a regression net: you change code fearlessly because a break announces itself immediately — which is exactly what makes continuous refactoring safe. Third, writing the test first forces you to use your own interface before you build it, surfacing awkward designs early. Note that the third reason is about design, not about catching bugs: testing in XP is less about trapping defects at the end and more about driving design and enabling change.',
        },
        {
          ar: 'ومتى نصمم؟ الثقافة المخطِّطة تصمم كل شيء مقدمًا، وXP تقول: صمّم قليلًا، دائمًا. التصميم الشامل المبكر تخمينٌ عن مستقبل لا تفهمه بعد — وتخمينات المستقبل مصدر رئيس للتعقيد العرضي. ثلاث عادات: تصميم بسيط — ابنِ أبسط شيء قد يشتغل للقصص التي تملكها الآن (ضد العمومية التخمينية: YAGNI — لن تحتاجها)؛ وإعادة هيكلة مستمرة تحسن بنية الشيفرة القائمة دون تغيير سلوكها؛ وحزمة الاختبارات التي تجعل ذلك آمنًا — فيصير التصميم ناشئًا: بجودة فهمك الحالي ويتحسن مع تحسن فهمك بدل أن يتجمد عند لحظة أقل فهم. لكن هذا ليس تخليًا عن التفكير المقدم: قرارات يصعب عكسها — شكل بياناتك، اختيار إطار، نموذج أمني — تستحق تأملًا متعمدًا سلفًا. والفخ: بلا إعادة هيكلة منضبطة وحزمة قوية يصير "سنصمم مع التقدم" "لن نصمم أبدًا" وينهار المشروع في عقدة العشوائيات.',
          en: 'When to design? The plan-driven culture designs everything up front; XP answers: design a little, all the time. A comprehensive up-front design is a guess about a future you do not yet understand, and such guesses feed accidental complexity. Three habits: simple design — build the simplest thing that could possibly work for the stories you have now (YAGNI, you aren\u2019t gonna need it); continuous refactoring improving structure without changing behavior; and the test suite that makes it safe — so design emerges with your current understanding, never frozen at the moment you understood least. Not a license to skip thinking: decisions expensive to reverse — data shape, a framework choice, a security model — still deserve deliberate up-front thought. The pitfall: without disciplined refactoring and a strong suite, "design as we go" becomes "never design" and the codebase collapses into a tangle.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'دفتر حلقة TDD: أحمر ثم أخضر ثم إعادة هيكلة', en: 'A TDD ledger: red, then green, then refactor' },
      code: "CASES = [((4, 3), True), ((3, 3), False), ((0, 5), False)]\n\ndef run_suite(fn):\n    failed = 0\n    for (days, limit), want in CASES:\n        if fn(days, limit) != want:\n            failed += 1\n    return failed\n\ntry:\n    run_suite(is_overdue)\n    print('red: suite passed unexpectedly')\nexcept NameError:\n    print('red: NameError - failure is the missing behavior')\n\ndef is_overdue(days_late, grace_days):\n    return days_late > grace_days\n\nfailed = run_suite(is_overdue)\nprint('green: failures %d' % failed)\n\ndef is_overdue(days_late, grace_days):\n    # renamed for clarity; behavior unchanged\n    return days_late > grace_days\n\nprint('refactor: failures %d' % run_suite(is_overdue))",
      explanation: {
        ar: 'الحلقة كما تُعاش: أحمر — نداء is_overdue قبل وجودها فيلتقط except الـ NameError ويطبع أن الفشل هو السلوك الغائب نفسه؛ لو مرت الحزمة هنا لكنا نشك في اختبارنا لا في الشيفرة. أخضر — أقل شيفرة تمشي الحالات الثلاث: مقارنة واحدة؛ لو فشلت حالة (3, 3) لكنا عرفنا فورًا أين الخطأ. إعادة هيكلة — تحسين الأسماء (limit تصير grace_days) والسلوك كما هو: failures 0 قبل وبعد. هذه "شهادة ميلاد" تُقرأ: كل خطوة مثبتة بسطر، والحزمة الصغيرة هي التي تسمح بالخطوة الثالثة بلا خوف.',
        en: 'The loop as it is lived: red — calling is_overdue before it exists, so except catches the NameError and prints that the failure is the missing behavior itself; had the suite passed here, we would suspect our test, not the code. Green — the least code that walks the three cases: one comparison; if the (3, 3) case failed we would know exactly where. Refactor — improving names (limit becomes grace_days) with behavior unchanged: failures 0 before and after. Read it as a birth certificate: every step pinned by a line, and the tiny suite is what makes the third step fearless.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-steps',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. عدّ الأحمر والأخضر في دفتر الحلقة.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Count the reds and greens in the loop ledger.',
      },
      code: "ledger = ['red', 'green', 'refactor', 'red', 'green']\ngreens = 0\nfor step in ledger:\n    if step == 'green':\n        greens = greens + 1\nprint('steps: %d' % len(ledger))\nprint('greens: %d' % greens)\nprint('reds: %d' % ledger.count('red'))",
      solution: "steps: 5\ngreens: 2\nreds: 2",
      answer: "steps: 5\ngreens: 2\nreds: 2",
      hints: [
        { ar: 'القائمة فيها خمس خطوات بترتيب حلقتين مكتملتين تقريبًا: red, green, refactor, red, green.', en: 'The list holds five steps, roughly two full cycles: red, green, refactor, red, green.' },
        { ar: 'العداد greens يزيد عند كل green: مرتان — فيطبع greens: 2.', en: 'The greens counter increments on each green: twice — printing greens: 2.' },
        { ar: 'ledger.count(\'red\') يعيد عدد مواضع red في القائمة: اثنان.', en: "ledger.count('red') returns the number of red positions: two." },
        { ar: 'الخرج:\nsteps: 5\ngreens: 2\nreds: 2', en: "The output:\nsteps: 5\ngreens: 2\nreds: 2" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.ci-counter',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'إذا كان الاختبار جيدًا فالدمج جيد عدة مرات يوميًا — مع خط أنابيب يتحقق من كل دمج. أكمل ci_ledger(merges) حيث merges قائمة أزواج (اسم الدمج، هل نجحت اختباراته). لكل دمج اطبع %s: green أو %s: broken، وحدّث العدّادات: عدد الناجحين وعدد الكاسرين وأطول سلسلة خضراء متصلة (تُصفَّر عند كل كسر). في النهاية اطبع merges: %d green: %d broken: %d streak: %d وأعد ثلاثية (الناجحون، الكاسرون، أطول سلسلة). ثم استدعِها على MERGES المعطاة.',
        en: 'If testing is good, integrate many times a day — with a pipeline verifying every merge. Complete ci_ledger(merges) where merges is a list of (merge name, did its tests pass) pairs. For each merge print %s: green or %s: broken, and update the counters: greens, broken, and the longest consecutive green streak (reset on every break). At the end print merges: %d green: %d broken: %d streak: %d and return the triple (greens, broken, streak). Then call it on the given MERGES.',
      },
      starterCode: "def ci_ledger(merges):\n    greens = 0\n    broken = 0\n    streak = 0\n    best = 0\n\n    # TODO: لكل دمج اطبع حالته وحدّث العدادات وأطول سلسلة خضراء\n    # TODO: for each merge print its status and update counters and the longest streak\n\n    print('merges: %d green: %d broken: %d streak: %d' % (len(merges), greens, broken, best))\n    return (greens, broken, best)\n\nMERGES = [('m1', True), ('m2', True), ('m3', False), ('m4', True), ('m5', True), ('m6', True)]\nresult = ci_ledger(MERGES)\n",
      solution: "def ci_ledger(merges):\n    greens = 0\n    broken = 0\n    streak = 0\n    best = 0\n    for name, ok in merges:\n        if ok:\n            greens = greens + 1\n            streak = streak + 1\n            best = max(best, streak)\n            print('%s: green' % name)\n        else:\n            broken = broken + 1\n            streak = 0\n            print('%s: broken' % name)\n    print('merges: %d green: %d broken: %d streak: %d' % (len(merges), greens, broken, best))\n    return (greens, broken, best)\n\nMERGES = [('m1', True), ('m2', True), ('m3', False), ('m4', True), ('m5', True), ('m6', True)]\nresult = ci_ledger(MERGES)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الدمج الكاسر مرئي بالاسم', en: 'The breaking merge is visible by name' },
          code: "assert 'm3: broken' in __learner_output__, 'expected: m3: broken | actual: %r' % __learner_output__",
          expected: 'm3: broken',
        },
        {
          id: 't2',
          name: { ar: 'سطر الحصيلة بالأرقام الصحيحة', en: 'The summary line with correct numbers' },
          code: "assert 'merges: 6 green: 5 broken: 1 streak: 3' in __learner_output__, 'expected: merges: 6 green: 5 broken: 1 streak: 3 | actual: %r' % __learner_output__",
          expected: 'merges: 6 green: 5 broken: 1 streak: 3',
        },
        {
          id: 't3',
          name: { ar: 'الثلاثية المُعادة صحيحة', en: 'The returned triple is correct' },
          code: "assert result == (5, 1, 3), 'expected: (5, 1, 3) | actual: %r' % (result,)",
          expected: '(5, 1, 3)',
        },
        {
          id: 't4',
          name: { ar: 'السلسلة تُصفَّر عند الكسر', en: 'The streak resets on a break' },
          code: "other = ci_ledger([('x1', True), ('x2', False), ('x3', True)])\nassert other == (2, 1, 1), 'expected: (2, 1, 1) after a reset | actual: %r' % (other,)",
          expected: '(2, 1, 1) after a reset',
        },
      ],
      hints: [
        { ar: 'لكل زوج (name, ok): إن ok فزد greens وstreak وحدّث best = max(best, streak)؛ وإلا فزد broken وصفّر streak.', en: 'For each (name, ok): if ok, increment greens and streak and update best = max(best, streak); otherwise increment broken and reset streak to 0.' },
        { ar: 'اطبع حالة الدمج داخل الفرع نفسه: print(\'%s: green\' % name) أو print(\'%s: broken\' % name).', en: "Print the merge status inside the same branch: print('%s: green' % name) or print('%s: broken' % name)." },
        { ar: 'المسار المتوقع: m1 وm2 أخضر (سلسلة 2)، m3 كاسر (تصفير)، ثم m4 وm5 وm6 أخضر — سلسلة تبلغ 3 في النهاية.', en: 'The expected path: m1 and m2 green (streak 2), m3 breaks (reset), then m4, m5, m6 green — the streak reaches 3 at the end.' },
        { ar: 'لو خرج streak خطأً فتتبّع بيديك: بعد m3 يجب أن يبدأ العد من صفر عند m4 — أطول سلسلة نهائية هي 3 الأخيرة لا 2 الأولى.', en: 'If your streak is wrong, trace by hand: after m3 counting must restart from zero at m4 — the final longest streak is the trailing 3, not the earlier 2.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-yagni',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'زميلك بني لميزة تسجيل دخول بطريقة واحدة فقط إطار مصادقة كاملًا بثلاثة محولات لمزودين قد نحتاجهم "عامًا قادمًا"، فتضخم العمل الشهر كله. أي ممارسة XP خرقها؟',
        en: 'For a login feature with exactly one authentication method, a teammate builds a full auth framework with three provider adapters "we might need next year", tripling the month\u2019s work. Which XP practice did he violate?',
      },
      options: [
        { id: 'a', text: { ar: 'الدمج المستمر — كان ينبغي أن يدمج كل محول على حدة', en: 'Continuous integration — he should have merged each adapter separately' } },
        { id: 'b', text: { ar: 'التصميم البسيط وYAGNI — أبسط شيء قد يشتغل للقصص الحالية، لا عمومية تخمينية عن قصص لم تُطلب', en: 'Simple design and YAGNI — the simplest thing that could work for the stories you have now, not speculative generality for stories nobody asked for' } },
        { id: 'c', text: { ar: 'البرمجة الثنائية — كان ينبغي أن يبنيه مع شريك', en: 'Pair programming — he should have built it with a partner' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل أولًا: أي قصة حالية تطلب ثلاثة محولات؟ إن لم توجد قصة فالممارسة نفسها تجيب.', en: 'Ask first: which current story asks for three adapters? If no story exists, the practice itself answers.' },
        { ar: 'الممارسة هي أبسط تصميم قد يشتغل، ومعها المبدأ المختصر YAGNI — لن تحتاجها.', en: 'The practice is simple design, with its catchphrase YAGNI — you are not gonna need it.' },
        { ar: 'الخيار الصحيح هو الذي يجعلك تسأل عن القصص الحالية قبل أي عمومية تخمينية.', en: 'The right option is the one that insists on current stories before any speculative generality.' },
        { ar: 'الجواب b — التصميم البسيط وYAGNI: أبسط شيء قد يشتغل للقصص الحالية لا إطار عام لمستقبل مزعوم.', en: 'Answer b — simple design and YAGNI: the simplest thing that could work for current stories, not a speculative framework.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-refactor',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'دورة TDD: أحمر (اختبار يفشل للسبب المتوقع)، ثم أخضر (أقل شيفرة تُجيزه)، ثم ____ (تحسين التصميم دون تغيير السلوك والحزمة تحرس). (كلمة إنجليزية واحدة)',
        en: 'The TDD cycle: red (a test fails for the expected reason), then green (the least code that passes), then ____ (improving the design without changing behavior, the suite guarding). (one English word)',
      },
      answer: 'refactor',
      solution: 'refactor',
      hints: [
        { ar: 'الخطوة الثالثة في الحلقة اسمها في الدرس حرفيًا.', en: 'The third step of the loop is named literally in the lesson.' },
        { ar: 'هي تحسين بنية الشيفرة القائمة مع بقاء السلوك كما هو.', en: 'It improves the structure of existing code while behavior stays the same.' },
        { ar: 'الحزمة الخضراء هي ما يجعلها آمنة: أي انزلاق في السلوك يُعلن نفسه.', en: 'The green suite is what makes it safe: any slipped behavior announces itself.' },
        { ar: 'الجواب: refactor', en: 'Answer: refactor' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "MERGES = [('m1', True), ('m2', True), ('m3', False), ('m4', True), ('m5', True), ('m6', True)]\n\n# عدّادات الدمج المستمر — جرّب تغيير التسلسل وشاهد السلسلة\n# continuous-integration counters — change the sequence and watch the streak\ngreens = 0\nbroken = 0\nstreak = 0\nbest = 0\nfor name, ok in MERGES:\n    if ok:\n        greens += 1\n        streak += 1\n        best = max(best, streak)\n    else:\n        broken += 1\n        streak = 0\n    print('%s: %s streak: %d' % (name, 'green' if ok else 'broken', streak))\nprint('merges: %d green: %d broken: %d streak: %d' % (len(MERGES), greens, broken, best))\n\n# جرّب: اجعل m4 كاسرًا — أين تصير أطول سلسلة؟ وماذا يعني ذلك لثقة الفريق بعد الظهر؟\n# try: make m4 a break — where does the longest streak land? and what does that do to afternoon confidence?\n# جرّب: أضف خمس عمليات دمج خضراء بعد m6 — هل يتغير best؟ قارن مع «دمج الجمعة الكبير»\n# try: add five green merges after m6 — does best change? compare with a big Friday merge\n",
      prompt: {
        ar: 'الملعب يعرض عدّادات الدمج المستمر خطوة بخطوة مع السلسلة الحية: كم مرة تُصفَّر؟ حوّل دمجًا إلى كسر وشاهد أين تسقط أطول سلسلة. الفكرة التي تستحق التأمل: كسر واحد في الوسط يصفّر السلسلة لكنه لا يمس عدّاد النجاح الكلي — وهذا هو "خلل واحد صغير في كل مرة" الذي يفرق الدمج المستمر عن دمج الجمعة الكبير.',
        en: 'The sandbox walks the CI counters step by step with the live streak: how often does it reset? Flip one merge into a break and watch where the longest streak falls. The idea worth chewing: a single mid-sequence break resets the streak but not the total-green counter — that is the "one small mismatch at a time" that separates continuous integration from a big Friday merge.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'من الأسباب الثلاثة لكتابة الاختبار أولًا — أيها عن التصميم لا عن الإمساك بالعيوب؟',
            en: 'Of the three reasons to write the test first — which one is about design rather than catching bugs?',
          },
          options: [
            { id: 'a', text: { ar: 'الاختبارات المكتوبة أولًا صادقة ولا تُشكَّل لتطابق الشيفرة', en: 'Tests written first are honest and cannot be shaped to match the code' } },
            { id: 'b', text: { ar: 'كتابة الاختبار أولًا تجبرك على استخدام واجهتك قبل بنائها فتنكشف التصاميم المزعجة مبكرًا', en: 'Writing the test first forces you to use your own interface before building it, surfacing awkward designs early' } },
            { id: 'c', text: { ar: 'الحزمة المتنامية شبكة تراجعات تجعل التغيير بلا خوف', en: 'The growing suite is a regression net that makes change fearless' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'السبب الأول عن صدق الاختبار والثاني عن الأمان عند التغيير — كلاهما متعلق بالعيوب والكسور؛ أما الثالث فهو هندسة واجهات: أول مستخدم لواجهتك هو اختبارك، فإذا كانت مزعجة عرفتها قبل أن يبنى عليها عشرون موضعًا.',
            en: 'The first reason is about test honesty and the second about safety under change — both defect-related; the third is interface engineering: your test is the interface\u2019s first user, so if it feels awkward you learn that before twenty call sites depend on it.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الذي تعنيه عبارة أن قصة المستخدم "وعدٌ بمحادثة"؟',
            en: 'What does it mean that a user story is "a promise to have a conversation"?',
          },
          options: [
            { id: 'a', text: { ar: 'أنها مواصفة مكتملة مُجمّدة تُنفَّذ حرفيًا', en: 'That it is a complete, frozen specification executed literally' } },
            { id: 'b', text: { ar: 'أن البطاقة موضع حوار مع الزبون عن التفاصيل — تُفهم أفضل بعد بناء أول نسخة وعرضها', en: 'That the card is a placeholder for a customer conversation about details — understood far better once the first version is built and shown' } },
            { id: 'c', text: { ar: 'أنها بديل عن الاختبارات في تعريف الإنجاز', en: 'That it replaces tests in the Definition of Done' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'القصة بطاقة فهرس بحجم محدود تُبقي المتطلبات صغيرة وملموسة ومؤصلة على قيمة للزائر — والحوار هو مصدر التفاصيل. لهذا هي "قابلة للتفاوض" في INVEST: العقد الصلب يتعارض مع التعلم من البرمجية العاملة.',
            en: 'A story is an index-card-sized placeholder keeping requirements small, concrete and grounded in user value — the conversation supplies the details. That is why it is Negotiable in INVEST: a rigid contract conflicts with learning from working software.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي توزيع أدوار صحيح بين سكرم وXP عند جمعهما؟',
            en: 'Which division of labor is correct when combining Scrum and XP?',
          },
          options: [
            { id: 'a', text: { ar: 'سكرم للهندسة وXP للإيقاع الزمني', en: 'Scrum for engineering, XP for the time cadence' } },
            { id: 'b', text: { ar: 'سكرم يعطي الإيقاع — سبرنتات وقائمة ومراجعة واسترجاعة — وXP يملأ السبرنت بانضباط هندسي: TDD وإعادة هيكلة ودمج مستمر', en: 'Scrum gives the cadence — sprints, backlog, review, retrospective — and XP fills the sprint with engineering discipline: TDD, refactoring, continuous integration' } },
            { id: 'c', text: { ar: 'هما منافسان تختار أحدهما فقط لكل مشروع', en: 'They are rivals; each project picks exactly one' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الجمع أشهر من كل منهما منفردًا: سكرم بلا هندسة ينتج زيادات تجتاز العرض وتبلى في الصيانة؛ وXP بلا إيقاع ينحدر بلا أولويات واضحة أو تغذية من الزبون. معًا: ماذا ومتى من سكرم، وكيف من XP — فيصدق تعريف الإنجاز.',
            en: 'The combination beats either alone: Scrum without engineering produces increments that pass the demo and rot in maintenance; XP without a rhythm drifts without clear priorities or stakeholder feedback. Together: what and when from Scrum, how from XP — and the Definition of Done becomes honest.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن فصل خطوط التسليم: XP تقول "ادمج عدة مرات يوميًا". أي أداة من ذلك الفصل تحقق كل دمج آليًا؟',
            en: 'From the delivery-pipelines chapter: XP says "integrate many times a day". Which artifact from that chapter verifies each merge automatically?',
          },
          options: [
            { id: 'a', text: { ar: 'تقرير الاسترجاعة الأسبوعي', en: 'The weekly retrospective report' } },
            { id: 'b', text: { ar: 'خط أنابيب الدمج المستمر الذي يبني ويختبر كل دمج آليًا', en: 'The continuous-integration pipeline that builds and tests every merge automatically' } },
            { id: 'c', text: { ar: 'قائمة الأعمال المتراكمة المرتبة', en: 'The ordered product backlog' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الدمج المتكرر بلا تحقق آلي مجرد زيادة الضجيج: خط الأنابيب — بناء واختبارات على كل دمج — هو ما يجعل "عدة مرات يوميًا" آمنة، وهو نفسه ما رأيته مفصلًا في فصل التسليم من الالتزام حتى النشر.',
            en: 'Frequent merging without automated verification just multiplies noise: the pipeline — build plus tests on every merge — is what makes "many times a day" safe, the same pipeline the delivery chapter dissected from commit to deployment.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'كتبت الشيفرة ثم ألصقت بها اختبارات تطابق ما تفعله',
          right: 'الاختبار أولًا: أحمر يثبت أن الاختبار ينفذ ويرتبط بالسلوك الغائب، ثم أقل شيفرة تخضّره',
          note: {
            ar: 'الاختبار المكتوب بعد الشيفرة مرآة لها: سيمر دائمًا ولن يعلمك شيئًا. الأحمر شهادة ميلاد الاختبار — وبدونها لا تعرف هل يفحص شيئًا أصلًا. والفشل الأول قد يكشف تصميم واجهة مزعجًا قبل أن يُبنى عليه.',
            en: 'A test written after the code is its mirror: it will always pass and teach you nothing. Red is the test\u2019s birth certificate — without it you cannot know the test checks anything at all. And that first failure often exposes an awkward interface before anything depends on it.',
          },
        },
        {
          wrong: 'الحزمة حمراء بسبب import ناقص — سأعدّل الشيفرة حتى تمر',
          right: 'لا تثق بفشل لم تفهمه: الأحمر الصحيح مربوط بالسلوك الغائب بعينه — أصلح الإعداد أولًا ثم راقب الفشل الحقيقي',
          note: {
            ar: 'أحمر الإعداد المكسور يخفي الفشل الحقيقي وقد يغريك بكتابة شيفرة تخفي المشكلة. قاعدة الدرس مزدوجة: لا تثق باختبار لم تره يفشل، ولا بفشل لم تفهم سببه — توقف واسأل: هل يفشل للسبب الذي كتبت الاختبار من أجله؟',
            en: 'A red from broken setup hides the real failure and tempts you to write code that buries the problem. The lesson\u2019s rule is doubled: never trust a test you have never seen fail, and never trust a failure you have not understood — stop and ask: is it failing for exactly the reason I wrote this test?',
          },
        },
        {
          wrong: 'التصميم الناشئ يعني لا تصميم مقدمًا إطلاقًا — سنبني ونرى',
          right: 'صمّم قليلًا دائمًا: YAGNI ضد العمومية التخمينية لا ضد التفكير — والقرارات يصعب عكسها (شكل البيانات، الإطار، الأمن) تستحق تأملًا متعمدًا',
          note: {
            ar: 'بلا إعادة هيكلة منضبطة وحزمة قوية يصير "نصمم مع التقدم" "لن نصمم أبدًا" وينهار المشروع في تعقيد عرضي. أما ما يصعب عكسه فليس تخمينًا عن المستقبل بل ركيزة تستحق التخطيط — وهذا الفرق بين ناشئ ومنهك.',
            en: 'Without disciplined refactoring and a strong suite, "we\u2019ll design as we go" becomes "we\u2019ll never design" and the codebase collapses into accidental complexity. What is expensive to reverse is not a guess about the future but a foundation worth planning — that is the line between emergent and collapsed.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'XP ترفع مقابض الممارسات الجيدة إلى أقصاها: اختبار دائم، مراجعة متصلة بالبرمجة الثنائية، دمج عدة مرات يوميًا مع خط أنابيب يتحقق من كل دمج. والجمع مع سكرم أشهر من كل منهما منفردًا: الإيقاع من سكرم والانضباط الهندسي من XP.', en: 'XP turns good practices\u2019 dials to extreme: constant testing, continuous review via pairing, many merges a day with a pipeline verifying each. The Scrum+XP combination beats either alone: cadence from Scrum, engineering discipline from XP.' },
        { ar: 'المتطلبات قصص مستخدم بحجم بطاقة — وعدٌ بمحادثة لا مواصفة — وINVEST يلخص صفاتها، وأهمها للبناء قابلية الاختبار. وحلقة TDD: أحمر يثبت الاختبار ويربط الفشل بالسلوك الغائب، أخضر بأقل شيفرة، إعادة هيكلة والحزمة تحرس — ولا تثق باختبار لم تره يفشل.', en: 'Requirements are index-card user stories — promises to converse, not specs — summarized by INVEST, with testability the property that matters most for building. The TDD loop: red proves the test runs and ties failure to missing behavior, green with the least code, refactor under the suite\u2019s guard — never trust a test you have never seen fail.' },
        { ar: 'التصميم يُصمَّم قليلًا دائمًا: أبسط شيء للقصص الحالية (YAGNI)، وإعادة هيكلة مستمرة، وحزمة تجعلها آمنة — فيلاحق التصميم فهمك بدل أن يتجمد عند أقل لحظة فهم. والقرارات يصعب عكسها تستحق تفكيرًا مقدمًا متعمدًا.', en: 'Design happens a little, all the time: the simplest thing for current stories (YAGNI), continuous refactoring, and the suite that makes it safe — so design tracks your understanding instead of freezing at the moment you knew least. Expensive-to-reverse decisions still deserve deliberate up-front thought.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وحوّل دمجًا واحدًا إلى كسر وراقب السلسلة. ثم اسأل نفسك: في آخر ميزة بنيتها — ما أول اختبار كتبته بعد الشيفرة، وماذا كان سيكشف لو كتبته قبلها؟',
        en: 'Open the sandbox, flip one merge into a break, and watch the streak. Then ask yourself: in the last feature you built — what was the first test you wrote after the code, and what would it have exposed written before?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch2.s3', pages: 'ص41-43 / pp.41-43' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch2.s3', pages: 'ص41-43 / pp.41-43' },
  ],
} satisfies Lesson;

export default lesson;
