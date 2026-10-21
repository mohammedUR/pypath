import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch6.l6 — "The Format Operator, Chapter 6 Review, and Project: Email Analyzer /
 * عامل التنسيق ومراجعة الفصل 6 ومشروع: محلّل البريد"
 * Aligned with PY4E ch6 s11 (عامل التنسيق), s12 (التنقيح), s13 (فهرس المصطلحات), s14 (تمارين).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch6.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 6,
  title: { ar: 'عامل التنسيق ومراجعة الفصل 6 ومشروع: محلّل البريد', en: 'The Format Operator, Chapter 6 Review, and Project: Email Analyzer' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch6.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'ختام الفصل السادس جلسة استرجاع لخريطته كلها — من الفهرس إلى التحليل — ثم أداة أخيرة أنيقة: عامل التنسيق % الذي يصبّ قيمك داخل قوالب نصية جاهزة للتقارير. ثم أول مشروع معالجة نصوص كامل لك: محلّل بريد يمشي على قائمة عناوين ويقتطع الأسماء والنطاقات ويعدّها ويخرج تقريرًا منسقًا. بنهاية الدرس ستكون قادرًا على: تنسيق التقارير بـ %d و%g، وتشخيص شرائح خاطئة بأدوات التنقيح، وتركيب أدوات الفصل كلها في برنامج واحد.',
        en: 'This close of chapter 6 is a retrieval session over its whole map — from indexing to parsing — then one last elegant tool: the format operator %, which pours your values into text templates fit for reports. Then your first complete text-processing project: an email analyzer that walks a list of addresses, cuts out names and domains, counts them, and prints a formatted report. By the end of this lesson you will be able to: format reports with %d and %g, diagnose faulty slices with debugging tools, and compose all the chapter’s tools into one program.',
      },
    },
    {
      kind: 'predict',
      code: "print('%d items' % 3)\nprint('%g' % 2.5)",
      question: {
        ar: 'ماذا يطبع السطران؟ وأين ذهبت علامتا %d و%g؟',
        en: 'What do the two lines print? And where did the %d and %g marks go?',
      },
      reveal: {
        ar: 'سيطبع 3 items ثم 2.5. العامل % يسكب القيمة في موضع القالب: %d مكان عدد صحيح و%g مكان عدد عائم — فتُستبدل العلامة بالقيمة نفسها. القالب يسارًا والقيم يمينًا بعد %.',
        en: 'It prints 3 items then 2.5. The % operator pours the value into the template’s slot: %d marks an integer’s place and %g a float’s — the mark is replaced by the value itself. Template on the left, values after % on the right.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'عامل التنسيق %', en: 'The format operator %' },
      chunks: [
        {
          ar: 'عامل التنسيق (format operator) يعمل على السلاسل النصية ويبني نصًّا جديدًا يملأ القالب بالقيم. العلامة %d تعني أن القيمة ستُعرض عددًا صحيحًا، والعلامة %g أن القيمة ستُعرض عددًا عائمًا:\n\'%d\' % 3 تعطي \'3\'\n\'%g\' % 2.5 تعطي \'2.5\'\n\'%d camelias\' % 100 تعطي \'100 camelias\'\nفأصبح عندك قالب جاهز تُسكب فيه الأعداد كما يُسكب الماء في قالب.',
          en: 'The format operator works on strings and builds a new text filling the template with values. The mark %d means the value will appear as an integer, and %g as a float:\n\'%d\' % 3 gives \'3\'\n\'%g\' % 2.5 gives \'2.5\'\n\'%d camelias\' % 100 gives \'100 camelias\'\nSo you now own a ready template into which numbers pour like water into a mold.',
        },
        {
          ar: 'ولتنسيق أكثر من قيمة في قالب واحد يوضع الجانب الأيمن بين قوسين (صف قيم):\n\'%d items at %g dollars\' % (3, 9.5)\nتعطي \'3 items at 9.5 dollars\'\nوانتبه: عدد العلامات في القالب يجب أن يطابق عدد القيم — زيادة أو نقصان يرمي TypeError. وسيصبح هذا العامل رفيقك في كل تقارير الفصول القادمة من عدّ الكلمات إلى إحصاءات الملفات.',
          en: 'To format more than one value in one template the right side goes in parentheses (a tuple of values):\n\'%d items at %g dollars\' % (3, 9.5)\ngives \'3 items at 9.5 dollars\'\nAnd beware: the number of marks in the template must match the number of values — one extra or one missing throws a TypeError. This operator will companion every report in coming chapters, from word counts to file statistics.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التنقيح: راقب فهرسك وشريحتك', en: 'Debugging: watch your index and your slice' },
      chunks: [
        {
          ar: 'حين تكتب برامج أعقد تزداد الأخطاء وأماكن تختبئ فيها، وتصبح عملية التنقيح بالتجزئة طريقًا لتقليل الوقت: قسّم المشكلة إلى نصفين وابحث في المنتصف عن قيمة وسطية يمكن التأكد منها، ثم أضف تعليمة طباعة وشغّل البرنامج — فإذا فشل التحقق كانت المشكلة في النصف الأول، وإلا فهي في الثاني. في كل تكرار تختصر البحث إلى النصف حتى تحصر المشكلة في سطر أو سطرين. وتذكّر من الفصل الثالث: اقرأ موجز التتبع من آخر سطر أولًا.',
          en: 'As your programs grow, so do the errors and their hiding places, and bisecting becomes the time-saver: split the problem in half, look near the middle for an intermediate value you can verify, add a print statement, and run — if the check fails the bug is in the first half, otherwise it is in the second. Each round halves the search until the bug is boxed into a line or two. And remember from chapter 3: read the traceback from its last line first.',
        },
        {
          ar: 'وللفصل السادس فخوّه الخاصة — أخطاء صامتة لا ترمي أي خطأ: شريحة فارغة \'\'، وfind الذي يعيد -1، ومقارنة حالة حروف خاطئة. سلاحك هنا الطباعة المؤقتة داخل الحلقة: اطبع الفهرس والشريحة في كل تكرار وراقب أين انحرفت القيم — مثل ما فعلنا مع total في مشروع الفصل الخامس. خطأ الفهرس بفهرس واحد (off-by-one) كالنسيان أن تضيف 1 بعد موقع @ هو أشهرها.',
          en: 'And chapter 6 owns special traps — silent errors that throw nothing: an empty slice \'\', a find returning -1, a case-mismatched comparison. Your weapon here is the temporary print inside the loop: print the index and the slice every iteration and watch where the values stray — exactly what we did with total in the chapter 5 project. The off-by-one index error, like forgetting the + 1 after an @ position, is the most famous of them.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فهرس مصطلحات الفصل السادس', en: 'The chapter 6 glossary' },
      chunks: [
        {
          ar: 'راجع مفردات الفصل كلمرة كلمة: الفهرس (index): تعبير صحيح يحدد موقع محرف في السلسلة. الشريحة (slice): جزء من سلسلة يُقتطع بنطاق [n:m]. الثبات/غير القابل للتعديل (immutable): صفة السلاسل التي تمنع تغيير محرف في مكانه. الكائن (object): شيء تحويه المتغيّر — البيانات وتوابع الصنف معًا. تابع الصنف (method): تابع مرتبط بكائن يُستدعى بعامل النقطة.',
          en: 'Review the chapter word by word: index: an integer expression locating a character in a string. slice: a piece of a string cut by the [n:m] range. immutable: the property of strings forbidding in-place character change. object: the thing a variable refers to — data and methods together. method: a function tied to an object and invoked with the dot operator.',
        },
        {
          ar: 'والمتبقي: العدّاد (counter): متغيّر يبدأ صفرًا ويزيد مع كل مطابقة أثناء المرور. المرور (traversal): معالجة محارف السلسلة واحدًا واحدًا بالترتيب. السلسلة الفرعية (substring): جزء من سلسلة يفحصه العامل in. التحليل (parsing): تحويل سلسلة إلى أجزاء مفهومة بـ find والتجزئة. عامل التنسيق (format operator): العامل % الذي يملأ قوالب النصوص بالقيم.',
          en: 'And the rest: counter: a variable starting at zero, incremented per match during traversal. traversal: processing a string’s characters one at a time in order. substring: a piece of a string tested by the in operator. parsing: turning a string into understood pieces with find and slicing. format operator: the % operator that fills text templates with values.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تقرير مصغّر بعامل التنسيق', en: 'A mini report with the format operator' },
      code: "word = 'banana'\ncount = 0\nfor letter in word:\n    if letter == 'a':\n        count = count + 1\nprint('%s has %d letters, %d of them are a' % (word, len(word), count))",
      explanation: {
        ar: 'نمط العدّ من درس المرور عدّ ثلاثا لa، ثم عامل التنسيق جمع النتائج الثلاث في سطر واحد: %s مكان السلسلة و%d مكان العددين — وقيم القالب الثلاث جاءت بين قوسين بالترتيب نفسه. خرْج السطر: banana has 6 letters, 3 of them are a. هكذا تصنع تقاريرك: حساب في الحلقة، وتنسيق بعدها.',
        en: 'The traversal-lesson counting pattern tallied three a’s, then the format operator gathered the three results into one line: %s for the string and %d for the two numbers — the template’s three values arrived in parentheses in the same order. The line’s output: banana has 6 letters, 3 of them are a. That is how reports are made: compute in the loop, format after it.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-format',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط دون تشغيله.',
        en: 'Read the code and predict its exact output without running it.',
      },
      code: "print('%d' % 7)\nprint('%g' % 2.5)",
      solution: '7\n2.5',
      answer: '7\n2.5',
      hints: [
        { ar: '%d يعرض القيمة عددًا صحيحًا كما هي.', en: '%d displays the value as an integer, as-is.' },
        { ar: '%g يعرض القيمة عددًا عائمًا بصيغتها العادية.', en: '%g displays the value as a float in its ordinary form.' },
        { ar: 'كل سطر يطبّع القالب بعد ملئه بقليله.', en: 'Each line prints the template after being filled with its value.' },
        { ar: 'الخرْج:\n7\n2.5', en: 'The output:\n7\n2.5' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.format-report',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "السلسلة word = 'python' معطاة. احسب طولها في المتغيّر n باستخدام len، ثم اطبع تقريرًا بعامل التنسيق على النحو: 'Letters: %d' % n. المتوقع: Letters: 6.",
        en: "The string word = 'python' is given. Compute its length into the variable n using len, then print a report with the format operator in the form: 'Letters: %d' % n. Expected: Letters: 6.",
      },
      starterCode: "word = 'python'\n# احسب n بطول السلسلة ثم اطبع القالب / compute n via len, then print the template\n",
      solution: "word = 'python'\nn = len(word)\nprint('Letters: %d' % n)",
      tests: [
        {
          id: 't1',
          name: { ar: 'n يساوي 6', en: 'n equals 6' },
          code: "assert n == 6, 'expected: 6 | actual: %r' % n",
          expected: '6',
        },
        {
          id: 't2',
          name: { ar: "يُطبع Letters: 6", en: 'Letters: 6 is printed' },
          code: "assert 'Letters: 6' in __learner_output__, ('expected: Letters: 6 | actual: %r' % __learner_output__)",
          expected: 'Letters: 6',
        },
      ],
      hints: [
        { ar: 'n = len(word) — سطر واحد.', en: 'n = len(word) — one line.' },
        { ar: "القالب نص يسارًا وn يمينًا: 'Letters: %d' % n.", en: "The template is text on the left and n on the right: 'Letters: %d' % n." },
        { ar: "الهيكل:\nn = len(word)\nprint('Letters: %d' % n)", en: "The skeleton:\nn = len(word)\nprint('Letters: %d' % n)" },
        { ar: "word = 'python'\nn = len(word)\nprint('Letters: %d' % n)", en: "word = 'python'\nn = len(word)\nprint('Letters: %d' % n)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-format-mismatch',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "ماذا يحدث عند تنفيذ '%d %d' % 3 ؟",
        en: "What happens when '%d %d' % 3 runs?",
      },
      options: [
        { id: 'a', text: { ar: 'TypeError — القالب فيه علامتان والقيمة واحدة', en: 'TypeError — the template has two marks but only one value' } },
        { id: 'b', text: { ar: 'يطبع 3 3 — يكرر القيمة', en: 'It prints 3 3 — repeating the value' } },
        { id: 'c', text: { ar: "يطبع 3 %d — يترك العلامة الثانية", en: 'It prints 3 %d — leaving the second mark' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'عُدّ علامات % في القالب وعُدّ القيم بعد %.', en: 'Count the % marks in the template and the values after %.' },
        { ar: 'علامتان وقيمة واحدة — هل التوازن ممكن؟', en: 'Two marks, one value — can balance be possible?' },
        { ar: 'القيم المتعددة تمر في صف بين قوسين: % (3, 5).', en: 'Multiple values travel in a parenthesized tuple: % (3, 5).' },
        { ar: 'الجواب: أ — TypeError، لأن عدد العلامات يجب أن يطابق عدد القيم تمامًا.', en: 'Answer: a — TypeError, because the number of marks must exactly match the number of values.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-at',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل — عُدّ المحارف: كم يساوي 'lina@pypath.io'.find('@')؟",
        en: "Without running — count the characters: what is 'lina@pypath.io'.find('@')?",
      },
      answer: '4',
      solution: '4',
      tolerance: 0,
      hints: [
        { ar: 'l ثم i ثم n ثم a — أربعة محارف قبل @.', en: 'l then i then n then a — four characters before @.' },
        { ar: 'الفهرسة تبدأ من الصفر: أول محرف فهرسه 0.', en: 'Indexing starts at zero: the first character is index 0.' },
        { ar: 'إذن @ هو المحرف الخامس — وفهرسه؟', en: 'So @ is the fifth character — and its index?' },
        { ar: 'الجواب: 4', en: 'Answer: 4' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex5.project-email-analyzer',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "المشروع: محلّل البريد. القائمة emails = ['ahmed@example.com', 'sara@pypath.io', 'omar@mail.eg', 'lina@pypath.io'] معطاة. اكتب حلقة تمرّ على العناوين، ولكل عنوان: 1) ابحث عن موقع @ بالتابع find في المتغيّر at. 2) استخرج اسم المستخدم في user بالتجزئة من البداية حتى at. 3) استخرج النطاق في domain بالتجزئة من at + 1 حتى النهاية. 4) اطبع سطرًا منسقًا بالضبط: print('%s -> %s' % (user, domain)). وعدّ في count عدد العناوين كلها وفي pypath_count عدد عناوين النطاق pypath.io. بعد الحلقة اطبع السطرين: 'Total: %d' % count و'pypath.io: %d' % pypath_count.",
        en: "The project: email analyzer. The list emails = ['ahmed@example.com', 'sara@pypath.io', 'omar@mail.eg', 'lina@pypath.io'] is given. Write a loop over the addresses; for each one: 1) find the position of @ with the find method into the variable at. 2) extract the username into user by slicing from the start up to at. 3) extract the domain into domain by slicing from at + 1 to the end. 4) print exactly one formatted line: print('%s -> %s' % (user, domain)). Count all addresses into count and the pypath.io addresses into pypath_count. After the loop print the two lines: 'Total: %d' % count and 'pypath.io: %d' % pypath_count.",
      },
      starterCode: "emails = ['ahmed@example.com', 'sara@pypath.io', 'omar@mail.eg', 'lina@pypath.io']\ncount = 0\npypath_count = 0\n# حلقة: find ثم تجزئة ثم طباعة منسقة ثم عدّ / loop: find, slice, formatted print, count\n",
      solution: "emails = ['ahmed@example.com', 'sara@pypath.io', 'omar@mail.eg', 'lina@pypath.io']\ncount = 0\npypath_count = 0\nfor email in emails:\n    at = email.find('@')\n    user = email[:at]\n    domain = email[at + 1:]\n    print('%s -> %s' % (user, domain))\n    count = count + 1\n    if domain == 'pypath.io':\n        pypath_count = pypath_count + 1\nprint('Total: %d' % count)\nprint('pypath.io: %d' % pypath_count)",
      tests: [
        {
          id: 't1',
          name: { ar: 'user يبلغ lina بعد الحلقة', en: 'user ends as lina after the loop' },
          code: "assert user == 'lina', 'expected: lina | actual: %r' % user",
          expected: 'lina',
        },
        {
          id: 't2',
          name: { ar: 'domain يبلغ pypath.io', en: 'domain ends as pypath.io' },
          code: "assert domain == 'pypath.io', 'expected: pypath.io | actual: %r' % domain",
          expected: 'pypath.io',
        },
        {
          id: 't3',
          name: { ar: 'count يساوي 4', en: 'count equals 4' },
          code: "assert count == 4, 'expected: 4 | actual: %r' % count",
          expected: '4',
        },
        {
          id: 't4',
          name: { ar: 'pypath_count يساوي 2', en: 'pypath_count equals 2' },
          code: "assert pypath_count == 2, 'expected: 2 | actual: %r' % pypath_count",
          expected: '2',
        },
        {
          id: 't5',
          name: { ar: 'الأسطر المنسقة تُطبع', en: 'The formatted lines are printed' },
          code: "assert 'ahmed -> example.com' in __learner_output__ and 'omar -> mail.eg' in __learner_output__, ('expected: ahmed -> example.com and omar -> mail.eg | actual: %r' % __learner_output__)",
          expected: 'ahmed -> example.com\nsara -> pypath.io\nomar -> mail.eg\nlina -> pypath.io',
        },
        {
          id: 't6',
          name: { ar: 'التقرير الختامي يُطبع', en: 'The closing report is printed' },
          code: "assert 'Total: 4' in __learner_output__ and 'pypath.io: 2' in __learner_output__, ('expected: Total: 4 and pypath.io: 2 | actual: %r' % __learner_output__)",
          expected: 'Total: 4\npypath.io: 2',
        },
      ],
      hints: [
        { ar: 'الوصفة الثلاثية من درس التحليل: find ثم find (أو تجزئة حتى النهاية) ثم شريحة.', en: 'The triple recipe from the parsing lesson: find, then find (or slice to the end), then a slice.' },
        { ar: "اسم المستخدم من البداية حتى @: user = email[:at]، والنطاق من بعده إلى النهاية: domain = email[at + 1:] — لا تنس + 1.", en: "Username from the start up to @: user = email[:at]; the domain from after it to the end: domain = email[at + 1:] — do not forget the + 1." },
        { ar: "العدّ يتفرع: count يزيد كل تكرار، وpypath_count يزيد فقط إذا domain == 'pypath.io' — تذكّر نمط التصفية من الفصل الخامس.", en: "Counting branches: count grows every iteration, pypath_count only when domain == 'pypath.io' — recall the filtering pattern from chapter 5." },
        { ar: "emails = ['ahmed@example.com', 'sara@pypath.io', 'omar@mail.eg', 'lina@pypath.io']\ncount = 0\npypath_count = 0\nfor email in emails:\n    at = email.find('@')\n    user = email[:at]\n    domain = email[at + 1:]\n    print('%s -> %s' % (user, domain))\n    count = count + 1\n    if domain == 'pypath.io':\n        pypath_count = pypath_count + 1\nprint('Total: %d' % count)\nprint('pypath.io: %d' % pypath_count)", en: "emails = ['ahmed@example.com', 'sara@pypath.io', 'omar@mail.eg', 'lina@pypath.io']\ncount = 0\npypath_count = 0\nfor email in emails:\n    at = email.find('@')\n    user = email[:at]\n    domain = email[at + 1:]\n    print('%s -> %s' % (user, domain))\n    count = count + 1\n    if domain == 'pypath.io':\n        pypath_count = pypath_count + 1\nprint('Total: %d' % count)\nprint('pypath.io: %d' % pypath_count)" },
      ],
    },
    {
      kind: 'debug',
      id: 'ex6.debug-domain-slice',
      required: true,
      brokenCode: "email = 'sara@pypath.io'\nat = email.find('@')\ndomain = email[at:]\nprint('Domain: %s' % domain)",
      prompt: {
        ar: 'تقرير زميلك يطبع Domain: @pypath.io — علامة @ سرقت مكانها في النطاق زورًا. شغّل الكود المعطوب، ثم استخدم أداة التنقيح: اطبع at وemail[at] وراقب أي شريحة يبدأ منها domain. اكتشف الخلل وأصلح التجزئة ليطبع Domain: pypath.io.',
        en: "Your friend’s report prints Domain: @pypath.io — the @ sign sneaked into the domain falsely. Run the broken code, then use the debugging tool: print at and email[at] and watch where the domain slice starts. Find the bug and fix the slice so it prints Domain: pypath.io.",
      },
      solution: "email = 'sara@pypath.io'\nat = email.find('@')\ndomain = email[at + 1:]\nprint('Domain: %s' % domain)",
      tests: [
        {
          id: 't1',
          name: { ar: 'domain يساوي pypath.io بعد الإصلاح', en: 'domain equals pypath.io after the fix' },
          code: "assert domain == 'pypath.io', 'expected: pypath.io | actual: %r' % domain",
          expected: 'pypath.io',
        },
        {
          id: 't2',
          name: { ar: 'domain لا يبدأ بعلامة @', en: 'domain does not start with @' },
          code: "assert not domain.startswith('@'), 'expected: no leading @ | actual: %r' % domain",
          expected: 'pypath.io',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع Domain: pypath.io', en: 'Domain: pypath.io is printed' },
          code: "assert 'Domain: pypath.io' in __learner_output__, ('expected: Domain: pypath.io | actual: %r' % __learner_output__)",
          expected: 'Domain: pypath.io',
        },
      ],
      hints: [
        { ar: 'email[at] هو العلامة @ نفسها — فأين تبدأ شريحة email[at:]؟', en: 'email[at] is the @ sign itself — so where does the slice email[at:] start?' },
        { ar: 'الشريحة تشمل فهرس بدايتها: [at:] تقتطع من موقع @ بعينه.', en: 'A slice includes its start: [at:] cuts from the very position of @.' },
        { ar: 'أنت تريد ما بعد العلامة لا العلامة: أضف 1 إلى بداية الشريحة.', en: 'You want what follows the sign, not the sign: add 1 to the slice’s start.' },
        { ar: "email = 'sara@pypath.io'\nat = email.find('@')\ndomain = email[at + 1:]\nprint('Domain: %s' % domain)", en: "email = 'sara@pypath.io'\nat = email.find('@')\ndomain = email[at + 1:]\nprint('Domain: %s' % domain)" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — المحلّل بين يديك\n# Your playground — the analyzer in your hands\n\nemails = ['ahmed@example.com', 'sara@pypath.io', 'omar@mail.eg', 'lina@pypath.io']\nfor email in emails:\n    at = email.find('@')\n    user = email[:at]\n    domain = email[at + 1:]\n    print('%s -> %s (%d chars)' % (user, domain, len(domain)))\n\nprint('')\nprint('%g' % 0.1)\nprint('%d%% ready' % 99)",
      prompt: {
        ar: 'جرّب بنفسك: أضف عناوين جديدة أو بلا @ وراقب، وحوّل التقرير إلى أحرف صغيرة بـ lower قبل العدّ ثم جرّب تزوير النطاق بحرف كبير. وقارن %g بـ %d على عدد عائم مثل 2.0، وجرّب علامة %% لطباعة % نفسه. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: add new addresses or ones without @ and watch, then lowercase the domain with lower before counting and try faking it with a capital letter. Compare %g with %d on a float like 2.0, and try the %% mark to print % itself. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'مراجعة الفصل: ماذا يعيد fruit[0] عندما fruit = \'banana\'؟',
            en: "Chapter review: what does fruit[0] return when fruit = 'banana'?",
          },
          options: [
            { id: 'a', text: { ar: "'b' — أول محرف لأن الترقيم من الصفر", en: "'b' — the first character, since numbering starts at zero" } },
            { id: 'b', text: { ar: "'a' — أول محرف لأن الترقيم من الواحد", en: "'a' — the first character, since numbering starts at one" } },
            { id: 'c', text: { ar: 'IndexError', en: 'IndexError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفهرس 0 هو أول محرف دائمًا — وfruit[1] يعطي a وهو الثاني. هذه القاعدة أساس كل شيء بُني هذا الفصل.',
            en: 'Index 0 is always the first character — and fruit[1] gives a, the second. This rule is the foundation the whole chapter stood on.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الأول والثاني: ما نتيجة التعبير \'py\' + \'thon\'؟',
            en: "And from chapters 1–2: what is the result of 'py' + 'thon'?",
          },
          options: [
            { id: 'a', text: { ar: "'python' — + على السلاسل تسلسل يلصقها", en: "'python' — + on strings concatenates them" } },
            { id: 'b', text: { ar: 'خطأ — لا يجمع السلاسل', en: 'An error — strings cannot be added' } },
            { id: 'c', text: { ar: '\'py thon\' — يضيف فراغًا تلقائيًا', en: "'py thon' — a space is added automatically" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'من أول طباعة في الفصل الأول إلى التسلسل في الفصل الثاني: + يلصق السلاسل في سلسلة جديدة — وهو ما ربطنا به J بـ greeting[1:] في تجزئة اليوم.',
            en: 'From the first print of chapter 1 to concatenation in chapter 2: + glues strings into a new one — the very glue we used to attach J onto greeting[1:] in this chapter’s slicing.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث مع اليوم: أي رسالة خطأ يرميها greeting[0] = \'J\'؟',
            en: "And from chapter 3 with today’s material: which error does greeting[0] = 'J' throw?",
          },
          options: [
            { id: 'a', text: { ar: "TypeError: 'str' object does not support item assignment", en: "TypeError: 'str' object does not support item assignment" } },
            { id: 'b', text: { ar: 'IndexError: string index out of range', en: 'IndexError: string index out of range' } },
            { id: 'c', text: { ar: 'SyntaxError: invalid syntax', en: 'SyntaxError: invalid syntax' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السلاسل غير قابلة للتعديل: الفهرس صحيح والقواعد سليمة لكن النوع يرفض الإسناد — والبديل بناء سلسلة جديدة بالتسلسل والتجزئة.',
            en: 'Strings are immutable: the index is valid and the syntax is fine but the type refuses assignment — the alternative is building a new string with concatenation and slicing.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الرابع: من منظور توابع الفصل الرابع — ما صفة word.upper()؟',
            en: 'And from chapter 4: in the vocabulary of that chapter — what kind of call is word.upper()?',
          },
          options: [
            { id: 'a', text: { ar: 'استدعاء يأخذ وسيطًا (السلسلة نفسها) ويعيد قيمة جديدة', en: 'A call taking an argument (the string itself) and returning a new value' } },
            { id: 'b', text: { ar: 'استدعاء خالٍ يطبع النتيجة فقط', en: 'A void call that only prints the result' } },
            { id: 'c', text: { ar: 'تعريف تابع جديد لا استدعاء', en: 'A new function definition, not a call' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التابع الصنف تابع مُنتج: يستقبل السلسلة عبر النقطة ويعيد نسخة معدلة دون المساس بالأصل — تابعٌ مثل max وlen لكن بقواعد كتابة النقطة.',
            en: 'A class method is fruitful: it receives the string via the dot and returns a transformed copy without touching the original — a function like max and len but with dot syntax.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الفصل الخامس مع المرور: في عدّ حرف a من banana — أين يُولد العدّاد count؟',
            en: "And from chapter 5 with traversal: when counting the letter a in banana — where is the counter count born?",
          },
          options: [
            { id: 'a', text: { ar: 'قبل الحلقة بالقيمة 0 — فلا يُمسح كل تكرار', en: 'Before the loop with value 0 — so it is never wiped per iteration' } },
            { id: 'b', text: { ar: 'داخل جسم الحلقة', en: 'Inside the loop body' } },
            { id: 'c', text: { ar: 'بعد الحلقة عند الطباعة', en: 'After the loop, right at the print' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التهيئة خطوة أولى مستقلة قبل الحلقة — نفس الوصفة التي عدّت الدرجات في مشروع الفصل الخامس عدّت اليوم محارف banana.',
            en: 'Initialization is a separate first step before the loop — the same recipe that tallied grades in the chapter 5 project tallied banana’s characters today.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: "ماذا يطبع print('Total: %d' % 4)؟",
            en: "What does print('Total: %d' % 4) print?",
          },
          options: [
            { id: 'a', text: { ar: 'Total: 4 — القالب مُسقي بالقيمة', en: 'Total: 4 — the template filled with the value' } },
            { id: 'b', text: { ar: 'Total: %d — العامل لا يعمل داخل print', en: 'Total: %d — the operator fails inside print' } },
            { id: 'c', text: { ar: '4', en: '4' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عامل التنسيق يبني النص الجديد قبل أن يطبعه print: العلامة %d استُبدلت بالعدد 4 فظهر السطر كاملًا.',
            en: 'The format operator builds the new text before print displays it: the %d mark was replaced by the number 4, producing the full line.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "email = 'sara@pypath.io'\nat = email.find('@')\ndomain = email[at:]",
          right: "email = 'sara@pypath.io'\nat = email.find('@')\ndomain = email[at + 1:]",
          note: {
            ar: 'خطأ الفهرس بفهرس واحد الأشهر في التحليل: الشريحة تشمل بدايتها فتقتطع @ مع النطاق. ما تريده يبدأ بعد العلامة — أضف 1.',
            en: 'Parsing’s most famous off-by-one: a slice includes its start, so @ rides along with the domain. What you want begins after the sign — add 1.',
          },
        },
        {
          wrong: "'%d items and %d boxes' % 3",
          right: "'%d items and %d boxes' % (3, 5)",
          note: {
            ar: 'قيمة واحدة لعلامتين ترمي TypeError فورًا. القيم المتعددة تسير في صف بين قوسين بالترتيب نفسه الذي تظهر به العلامات.',
            en: 'One value for two marks throws TypeError at once. Multiple values travel in a parenthesized tuple in the same order as the marks.',
          },
        },
        {
          wrong: "word = 'banana'\nword.upper()\nprint(word)  # BANANA؟",
          right: "word = 'banana'\nword = word.upper()\nprint(word)",
          note: {
            ar: 'الاستدعاء المهمل لا يغيّر شيئًا — الثبات يمنع التعديل في المكان والنسخة تسقط. اسند الناتج حتى لا يضيع عمل التابع.',
            en: 'A discarded call changes nothing — immutability forbids in-place mutation and the copy is dropped. Assign the result so the method’s work survives.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل السادس كله: السلسلة سلسلة محارف مفهرسة من الصفر، وlen وطولها، والمرور بحلقتي while وfor، ونمط العدّ، والتجزئة [n:m] وقيمها الافتراضية، والثبات وبناء السلاسل الجديدة، وin والمقارنة وتوحيد الحالة، وتوابع النقطة، والتحليل بـ find والتجزئة.', en: 'All of chapter 6: the string as a sequence indexed from zero, len and its length, traversal with while and for, the counting pattern, [n:m] slicing with defaults, immutability and building new strings, in and comparison with case normalization, dot methods, and parsing with find and slicing.' },
        { ar: 'عامل التنسيق % يملأ القوالب: %d للأعداد الصحيحة و%g للعائمة، والقيم المتعددة في صف — مع مطابقة تامة بين العلامات والقيم وإلا TypeError.', en: 'The format operator % fills templates: %d for integers and %g for floats, multiple values in a tuple — with an exact mark-to-value match or a TypeError.' },
        { ar: 'التنقيح في النصوص: أخطاء صامتة (شريحة فارغة، -1 من find، حالة الحروف) تكشفها الطباعة المؤقتة داخل الحلقة، والتقسيم إلى نصفين يحصر البحث — ومشروع محلّل البريد جمع الوصفة كلها: find، شريحتان، عدّادان، وتقرير منسق.', en: 'Text debugging: silent errors (empty slices, find’s -1, letter case) are exposed by temporary prints inside the loop, and halving narrows the hunt — and the email analyzer composed the whole recipe: find, two slices, two counters, and a formatted report.' },
      ],
      reflectPrompt: {
        ar: 'محلّلك اليوم يعمل على قائمة جاهزة من أربعة عناوين. حين تتعلم قراءة الملفات في الفصل القادم، أي سطر في مشروعك سيتغير ليقرأ آلاف العناوين من ملف حقيقي؟ وكم نطاقًا تتوقع أن يكتشفها التقرير؟',
        en: 'Today’s analyzer works on a ready list of four addresses. Once you learn to read files next chapter, which line of your project changes to swallow thousands of real addresses? And how many domains do you expect the report to discover?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch6.s11', pages: 'ص96 / pp.96' },
        { book: 'PY4E', section: 'py4e.ch6.s12', pages: 'ص97 / pp.97' },
        { book: 'PY4E', section: 'py4e.ch6.s13', pages: 'ص99 / pp.99' },
        { book: 'PY4E', section: 'py4e.ch6.s14', pages: 'ص100 / pp.100' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch6.s11', pages: 'ص96 / pp.96' },
    { book: 'PY4E', section: 'py4e.ch6.s12', pages: 'ص97 / pp.97' },
    { book: 'PY4E', section: 'py4e.ch6.s13', pages: 'ص99 / pp.99' },
    { book: 'PY4E', section: 'py4e.ch6.s14', pages: 'ص100 / pp.100' },
  ],
} satisfies Lesson;

export default lesson;
