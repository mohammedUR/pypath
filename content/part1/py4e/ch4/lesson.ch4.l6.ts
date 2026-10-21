import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch4.l6 — "Chapter 4 Review and Project: Password Generator /
 * مراجعة الفصل 4 ومشروع: مولّد كلمات المرور"
 * Aligned with PY4E ch4 s12 (التنقيح), s13 (فهرس المصطلحات), s14 (تمارين).
 * All expression is original.
 * Sandbox note: no input() anywhere — the project is fully gradeable in-browser.
 * Determinism note: the project seeds the generator so the reference solution
 * and its tests are stable (Pyodide = CPython Mersenne-Twister).
 */
const lesson = {
  id: 'py4e.ch4.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 4,
  title: { ar: 'مراجعة الفصل 4 ومشروع: مولّد كلمات المرور', en: 'Chapter 4 Review and Project: Password Generator' },
  estimatedMinutes: 30,
  prerequisites: ['py4e.ch4.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الفصل الرابع غيّر علاقتك بالكود: من مستهلك للجاهزات إلى صانع للتوابع. ختامه جلسة استرجاع كاملة — استدعاء وتحويلات ووحدات وتعريفات وتسلسل تنفيذ — ثم مشروع يجمع كل ذلك: مولّد كلمات مرور يصنع سرًّا جديدًا من قلب الوحدة العشوائية.',
        en: 'Chapter 4 changed your relationship with code: from consuming built-ins to manufacturing functions. Its finale is a full retrieval session — calls, conversions, modules, definitions, and flow of execution — then a project that stitches it all: a password generator that conjures a fresh secret from the heart of the random module.',
      },
    },
    {
      kind: 'predict',
      code: 'def twice(x):\n    return x * 2\n\nprint(twice(twice(3)))',
      question: {
        ar: 'ماذا يطبع؟ وتتبّع القفزات: من استدعى من؟ وأي return عاد إلى أي مكان؟',
        en: 'What does it print? And trace the jumps: who called whom? And which return went back where?',
      },
      reveal: {
        ar: "يطبع 12. الاستدعاء الداخلي twice(3) قفز وعاد بـ 6، فصارت 6 وسيطًا للاستدعاء الخارجي الذي قفز وعاد بـ 12 — قيمةٌ مُعادة تصير وسيطًا لاستدعاء آخر. هذا بالضبط مخطط مشروع اليوم: تابع ينتج قيمًا تستهلكها طبقات أخرى.",
        en: 'It prints 12. The inner call twice(3) jumped and came back with 6, which became the argument of the outer call, which jumped and came back with 12 — a return value turning into another call’s argument. This is exactly today’s project blueprint: a function producing values that other layers consume.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل الرابع في دقيقتين', en: 'Chapter 4 in two minutes' },
      chunks: [
        {
          ar: 'بدأنا بالاستدعاء: التابع اسم لتسلسل تعليمات يأخذ وسائط ويعيد قيمة، والقوسان بعد الاسم هما إشارة التنفيذ. جاهزاتنا: max وmin وlen وtype — وتسمية متغيّر باسم جاهزة تحرق التابع. ثم غرفة التحويل: int تقتطع ولا تُقرِّب وتقبل النصوص الصحيحة فقط، وfloat وstr تكمل الثلاثي.',
          en: 'We began with calls: a function is a named sequence of statements taking arguments and returning a value, and the parentheses after the name are the run signal. Our built-ins: max, min, len and type — and naming a variable after one burns it. Then the conversion wardrobe: int truncates, never rounds, and only accepts whole-number text, with float and str completing the trio.',
        },
        {
          ar: 'ثم الوحدتان: import math وأتأشيرة النقطة math.sqrt وmath.pi، وimport random مع random.random وrandint وchoice والبذرة seed التي تثبّت التسلسل. وبعد ذلك القفزة الكبيرة: def يعرّف تابعًا — ترويسة بالنقطتين وجسم مزاح — والتعريف ينشئ الكائن ولا ينفّذ الجسم، والاستدعاء قفزة في تسلسل التنفيذ تعود إلى مكانها.',
          en: 'Then the two modules: import math with dot notation math.sqrt and math.pi, and import random with random.random, randint and choice, plus the seed that pins the sequence. After that, the big leap: def defines a function — a colon-terminated header and an indented body — the definition creates the object without running the body, and a call is a jump in the flow of execution that returns to where it left off.',
        },
        {
          ar: 'وختمنا بالمعاملات والوسائط: المعامل يستقبل والوسيط يُرسل ويُحسب قبل الاستدعاء. والتوابع المُنتجة تعيد بـ return بينما الخالية تعطي None. وأسباب التوابع الثلاثة: أسماء تقرأ بسهولة، تكرار مُلغى، وأجزاء تُصحّح على حدة.',
          en: 'We closed with parameters and arguments: the parameter receives, the argument is sent and computed before the call. Fruitful functions return with return while void ones give None. And the three reasons for functions: names that read easily, eliminated repetition, and pieces debugged in isolation.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المشروع: مولّد كلمات المرور', en: 'The project: the password generator' },
      chunks: [
        {
          ar: "الوظيفة: تابع make_password() بلا معاملات يبني كلمة مرور من ثلاثة اختيارات عشوائية من سلسلة محارف آمنة ويعيدها بـ return: p = random.choice(chars) + random.choice(chars) + random.choice(chars). عامل + يلصق المحارف كما تعلمت في الفصل الثاني، وchoice — من درس الأعداد العشوائية — ينتقي حرفًا. في البرنامج الرئيسي: import random، ثم seed(4) للتجربة المثبتة، ثم الاستدعاء والطباعة.",
          en: "The job: a parameterless make_password() builds a password from three random picks of a safe character string and returns it: p = random.choice(chars) + random.choice(chars) + random.choice(chars). The + operator glues characters just as you learned in chapter 2, and choice — from the random-numbers lesson — picks a letter. In the main program: import random, then seed(4) for the pinned experiment, then the call and the print.",
        },
        {
          ar: 'لم نستخدم حلقة لأنها درس الفصل القادم: اليوم نلصق الاستدعاءات الثلاثة بأيدينا، وسترميها في حلقة واحدة حين تتعلمها — نفس الفكرة، أداة أنظف. ولاحظ الحتمية الاختبارية: البذرة الثابتة تجعل الجميع يولّد الكلمة نفسها في كل تشغيل — وهكذا تُختبر العشوائية؛ احذف البذرة في ملعبك وشاهد الحرية.',
          en: 'No loop yet — that is next chapter’s lesson: today we glue the three calls by hand, and you will collapse them into a single loop once you learn it — same idea, cleaner tool. Notice the testability: a fixed seed makes everyone generate the same password on every run — that is how randomness gets tested; drop the seed in your sandbox and watch freedom.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التنقيح وفهرس المصطلحات', en: 'Debugging and the glossary' },
      chunks: [
        {
          ar: 'عند حدوث خطأ يُعرض تقرير مليء بالمعلومات لدرجة الإرهاق، وأفيد أجزائه اثنان: ماهية الخطأ، وفي أي جزء من الشيفرة حدث. الأخطاء القواعدية سهلة الاكتشاف لكن تفاصيلها مضلّلة: المسافات الفارغة غير مرئية فتمرّ خطأ إزاحة خادع. والقاعدة الذهبية: التقرير يشير إلى مكان اكتشاف المشكلة، والخطأ الفعلي غالبًا في سطر سابق — كتعريف نسي نقطتين فيُكتشف عند السطر التالي.',
          en: 'When an error occurs, a report full of information appears — too much to absorb. Its two most useful parts: what kind of error, and where in the code. Syntax errors are easy to find but their details can mislead: whitespace is invisible, so a sneaky indentation error slips through. And the golden rule: the report points to where the problem was detected — the actual bug is often in an earlier line, like a definition missing its colon that gets discovered at the next line.',
        },
        {
          ar: 'ومراجعة فهرس المصطلحات بكلماته المفتاحية: تابع وتعريف التابع والترويسة والجسم، والمعامل والوسيط، والقيمة المُعادة، والمُنتج والخالٍ وNone، والوحدة وتأشيرة النقطة، وتسلسل التنفيذ. لو تلعثمت في مصطلح فعُد إلى درسه — اللغة البرمجية تُقرأ أيضًا.',
          en: 'And a glossary pass over the chapter’s keywords: function, function definition, header, body, parameter, argument, return value, fruitful, void, None, module, dot notation, flow of execution. If a term trips you, revisit its lesson — programming language is read too.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'المولّد يعمل: نفس البذرة، نفس السرّ', en: 'The generator runs: same seed, same secret' },
      code: "import random\n\ndef make_password():\n    chars = 'abcdefghjkmnpqrstuvwxyz23456789'\n    p = random.choice(chars) + random.choice(chars) + random.choice(chars) + random.choice(chars)\n    return p\n\nrandom.seed(1)\nprint(make_password())\nprint(make_password())",
      explanation: {
        ar: 'مع البذرة 1 يعطي البرنامج في كل تشغيل: ev64 ثم 3cjd — الاستدعاءان انتزاعا ثمانية أرقام متتالية من التسلسل المثبّت، أربعة لكل كلمة. مجموعة المحارف حذفت المتشابهات: لا l ولا 1 ولا O ولا 0 — فلا يخطئ القارئ. احذف سطر البذرة في ملعبك فيتغير السرّ كل تشغيل. وفي حلقات الفصل القادم ستصير الاستدعاءات الأربعة حلقة واحدة.',
        en: 'With seed 1 the program gives, on every run: ev64 then 3cjd — the two calls pulled eight consecutive numbers from the pinned sequence, four per password. The character set dropped look-alikes: no l, no 1, no O, no 0 — so a reader never stumbles. Remove the seed line in your sandbox and the secret changes every run. And with next chapter’s loops, those four calls become one loop.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-review',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تسخين مراجعة: تتبّع القفزات والقيم المُعادة، وتوقّع الخرْج بالضبط.',
        en: 'Review warm-up: trace the jumps and return values, and predict the exact output.',
      },
      code: 'def f(x):\n    return x + 1\n\na = f(2)\nb = f(a)\nprint(b)',
      solution: '4',
      answer: '4',
      hints: [
        { ar: 'f(2) تعيد 3 فتُخزَّن في a.', en: 'f(2) returns 3 and is stored in a.' },
        { ar: 'ثم f(a) هي f(3) — كم تعيد؟', en: 'Then f(a) is f(3) — what does it return?' },
        { ar: 'print يطبع قيمة b فقط.', en: 'print outputs the value of b only.' },
        { ar: 'الخرْج:\n4', en: 'The output:\n4' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.password-project',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل الرابع — مولّد كلمات المرور: عرّف تابع make_password() بلا معاملات يبني كلمة مرور من ثلاثة اختيارات عشوائية من chars = 'abcdef' ويعيدها بـ return. في البرنامج الرئيسي: استورد random، ثبّت random.seed(4)، ثم p = make_password() واطبع p. مع هذه البذرة ستحصل أنت وزملاؤك على الكلمة نفسها في كل تشغيل: bca.",
        en: "Chapter 4 project — the password generator: define a parameterless function make_password() that builds a password from three random picks of chars = 'abcdef' and returns it with return. In the main program: import random, fix random.seed(4), then p = make_password() and print p. With this seed you and your classmates get the same word on every run: bca.",
      },
      starterCode: "import random\n\ndef make_password():\n    chars = 'abcdef'\n    # ابنِ الكلمة من 3 اختيارات والصقها، ثم أعِدها / build from 3 picks, glue, then return\n",
      solution: "import random\n\ndef make_password():\n    chars = 'abcdef'\n    p = random.choice(chars) + random.choice(chars) + random.choice(chars)\n    return p\n\nrandom.seed(4)\np = make_password()\nprint(p)",
      tests: [
        {
          id: 't1',
          name: { ar: 'make_password كائن تابع قابل للاستدعاء', en: 'make_password is a callable function object' },
          code: "assert callable(make_password), 'expected: function | actual: %r' % type(make_password).__name__",
          expected: 'function',
        },
        {
          id: 't2',
          name: { ar: 'التابع يعيد نصًّا بطول 3', en: 'The function returns a 3-character string' },
          code: "p2 = make_password()\nassert type(p2) == str and len(p2) == 3, 'expected: 3-char str | actual: %r' % p2",
          expected: 'bca',
        },
        {
          id: 't3',
          name: { ar: 'محارفها من abcdef فقط', en: 'Its characters come from abcdef only' },
          code: "p3 = make_password()\nassert set(p3) <= set('abcdef'), 'expected: chars from abcdef | actual: %r' % p3",
          expected: 'abcdef',
        },
        {
          id: 't4',
          name: { ar: 'يُطبع bca — البذرة تثبّت الكلمة', en: 'bca is printed — the seed pins the word' },
          code: "assert 'bca' in __learner_output__, ('expected: bca | actual: %r' % __learner_output__)",
          expected: 'bca',
        },
      ],
      hints: [
        { ar: 'داخل التابع: ثلاثة استدعاءات choice ملصوقة بعامل + في متغيّر p، ثم return p.', en: 'Inside the function: three choice calls glued with + into a variable p, then return p.' },
        { ar: 'لا تنسَ سطر البذرة في البرنامج الرئيسي بعد التعريف: random.seed(4)', en: 'Do not forget the seed line in the main program, after the definition: random.seed(4)' },
        { ar: 'الهيكل:\np = random.choice(chars) + random.choice(chars) + random.choice(chars)\nreturn p', en: 'The skeleton:\np = random.choice(chars) + random.choice(chars) + random.choice(chars)\nreturn p' },
        { ar: "import random\n\ndef make_password():\n    chars = 'abcdef'\n    p = random.choice(chars) + random.choice(chars) + random.choice(chars)\n    return p\n\nrandom.seed(4)\np = make_password()\nprint(p)", en: "import random\n\ndef make_password():\n    chars = 'abcdef'\n    p = random.choice(chars) + random.choice(chars) + random.choice(chars)\n    return p\n\nrandom.seed(4)\np = make_password()\nprint(p)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-debug-location',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ومن درس التنقيح: تقرير الخطأ يشير إلى سطر معيّن — أين يقع الخطأ الفعلي غالبًا؟',
        en: 'From the debugging lesson: the error report points at a specific line — where does the actual bug usually sit?',
      },
      options: [
        { id: 'a', text: { ar: 'غالبًا في سطر سابق — التقرير يكشف مكان الاكتشاف لا مكان الخطأ', en: 'Usually in an earlier line — the report reveals where it was detected, not where it is' } },
        { id: 'b', text: { ar: 'دائمًا في السطر المشار إليه بالضبط', en: 'Always exactly on the line it points to' } },
        { id: 'c', text: { ar: 'في آخر سطر بالبرنامج', en: 'On the program’s last line' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر مثال الكتاب: المسافة البادئة الخادعة، والتعريف الذي نسي نقطتين.', en: 'Remember the book’s example: the deceptive indentation, and the definition that forgot its colon.' },
        { ar: 'المسافات غير المرئية تمرّ خادعة، والخطأ يُكتشف متأخرًا.', en: 'Invisible whitespace sneaks past, and the error is discovered late.' },
        { ar: 'مكان الاكتشاف ≠ مكان الجريمة — هذا هو جوهر التنقيح.', en: 'Where it was detected ≠ where it was committed — that is the heart of debugging.' },
        { ar: 'الجواب: أ — ابحث غالبًا في السطور السابقة للمكان المُشار إليه.', en: 'Answer: a — search the earlier lines above the reported place.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-import',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: توابع math وrandom لا تُستخدم إلا بعد جلب الوحدة بتعليمة ______.',
        en: 'Fill in: the functions of math and random are only usable after bringing in the module with the ______ statement.',
      },
      answer: 'import',
      solution: 'import',
      hints: [
        { ar: 'أول سطر في مولّد كلمات المرور.', en: 'The first line of the password generator.' },
        { ar: 'كلمة واحدة تسبق اسم الوحدة: ______ math', en: 'One word before the module name: ______ math' },
        { ar: 'بدونها: NameError عند أول استدعاء.', en: 'Without it: NameError at the first call.' },
        { ar: 'الجواب: import', en: 'Answer: import' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-order',
      expectedError: 'NameError',  // intentional crash-teaching; verified by checks replay
      required: true,
      brokenCode: "greet()\n\ndef greet():\n    print('أهلًا!')",
      prompt: {
        ar: "برنامج زميلك يصرخ: NameError: name 'greet' is not defined — والأداة موجودة في الملف أصلًا! الخلل في الترتيب: أصلح البرنامج بحيث يُعرَّف التابع قبل استدعائه، تذكّر تسلسل التنفيذ من أعلى إلى أسفل.",
        en: "Your friend’s program screams: NameError: name 'greet' is not defined — yet the tool is right there in the file! The flaw is the ordering: fix the program so the function is defined before it is called — remember the top-to-bottom flow of execution.",
      },
      solution: "def greet():\n    print('أهلًا!')\n\ngreet()",
      tests: [
        {
          id: 't1',
          name: { ar: 'تُطبع رسالة الترحيب', en: 'The greeting is printed' },
          code: "assert 'أهلًا!' in __learner_output__, ('expected: أهلًا! | actual: %r' % __learner_output__)",
          expected: 'أهلًا!',
        },
        {
          id: 't2',
          name: { ar: 'greet كائن تابع موجود', en: 'greet exists as a function object' },
          code: "assert callable(greet), 'expected: function | actual: %r' % type(greet).__name__",
          expected: 'function',
        },
        {
          id: 't3',
          name: { ar: 'الاستدعاء مرة واحدة — لا تكرار', en: 'Called once — no duplication' },
          code: "assert __learner_output__.count('أهلًا!') == 1, ('expected: once | actual: %r' % __learner_output__)",
          expected: 'أهلًا!',
        },
      ],
      hints: [
        { ar: 'التعريف نفسه سليم — لا تحذف شيئًا منه.', en: 'The definition itself is fine — delete nothing from it.' },
        { ar: 'المشكلة ترتيب السطرين: أيهما ينفَّذ أولًا؟', en: 'The problem is the order of the two parts: which runs first?' },
        { ar: 'ضع التعريف أولًا، والاستدعاء بعده في سطر مستقل بلا إزاحة.', en: 'Put the definition first, then the call on its own unindented line.' },
        { ar: "def greet():\n    print('أهلًا!')\n\ngreet()", en: "def greet():\n    print('أهلًا!')\n\ngreet()" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import random\n\ndef make_password():\n    chars = 'abcdefghjkmnpqrstuvwxyz23456789'\n    p = random.choice(chars) + random.choice(chars) + random.choice(chars) + random.choice(chars)\n    return p\n\nprint(make_password())\nprint(make_password())\nprint(make_password())",
      prompt: {
        ar: 'جرّب بنفسك: شغّل المولّد ثلاث مرات بلا بذرة — سرّ جديد كل تشغيل. ثم أضف random.seed(99) في الأعلى وشغّل مرتين: ثبات كامل. طوّر الكلمة إلى 6 محارف بلصق استدعاءين إضافيين، وجرّب مجموعة محارف مختلفة. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: run the generator three times with no seed — a fresh secret every run. Then add random.seed(99) at the top and run twice: total stability. Grow the password to 6 characters by gluing two more calls, and try a different character set. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: "ومن الفصل الأول: في الاستدعاء print('Hello world!') — ماذا نسمّي 'Hello world!'؟",
            en: "And from chapter 1: in the call print('Hello world!') — what do we call 'Hello world!'?",
          },
          options: [
            { id: 'a', text: { ar: 'الوسيط — الدخل المُمرَّر للتابع', en: 'The argument — the input passed to the function' } },
            { id: 'b', text: { ar: 'المعامل — الاسم في الترويسة', en: 'The parameter — the name in the header' } },
            { id: 'c', text: { ar: 'القيمة المُعادة', en: 'The return value' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الوسيط يدخل من سطر الاستدعاء. المعامل سيأتي بعد يومين من الفصل الأول — اسم في الترويسة يستقبل — وهذا الفصل علّمك الاثنين معًا.',
            en: 'The argument enters from the call line. The parameter arrived two days after chapter 1 — a name in the header that receives — and this chapter taught you both.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثاني: كم يساوي int(7.9)؟',
            en: 'And from chapter 2: what is int(7.9)?',
          },
          options: [
            { id: 'a', text: { ar: '7 — اقتطاع بلا تقريب', en: '7 — truncated, not rounded' } },
            { id: 'b', text: { ar: '8 — تقريب لأقرب عدد', en: '8 — rounded to the nearest' } },
            { id: 'c', text: { ar: 'خطأ ValueError', en: 'A ValueError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'int على عدد عشري تُلغي القسم العشري: 7.9 تصبح 7. التقريب مسؤوليتك أنت بأدوات أخرى — مثل round التي لمست في مشروع الفائدة المركّبة.',
            en: 'int on a float cancels the decimal part: 7.9 becomes 7. Rounding is your own job with other tools — like the round you touched in the compound-interest project.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث: أي بنية تشارك def نفس قواعد النقطتين والكتلة المزاحة؟',
            en: 'And from chapter 3: which structure shares def’s rules of the colon and the indented block?',
          },
          options: [
            { id: 'a', text: { ar: 'if — العبارة المركّبة نفسها: ترويسة بالنقطتين وجسم مزاح', en: 'if — the same compound statement: a colon header and an indented body' } },
            { id: 'b', text: { ar: 'print — لأنها تطبع كتلًا', en: 'print — because it prints blocks' } },
            { id: 'c', text: { ar: 'len — لأنها تعيد عددًا', en: 'len — because it returns a count' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'def وif أخوان في قواعد العبارات المركّبة: ترويسة تنتهي بنقطتين، وجسم مزاح يربط بالترويسة. من أتقن if في الفصل الثالث ورث def بلا جهد.',
            en: 'def and if are siblings in compound-statement grammar: a colon-terminated header and an indented body attached to it. Mastering if in chapter 3 inherited def effortlessly.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: "ومن درس اليوم الأول: ماذا تعيد max('Hello world')؟",
            en: "And from this chapter’s first lesson: what does max('Hello world') return?",
          },
          options: [
            { id: 'a', text: { ar: "w — أكبر محرف", en: 'w — the largest character' } },
            { id: 'b', text: { ar: "الفراغ — أصغر محرف", en: 'The space — the smallest character' } },
            { id: 'c', text: { ar: '11', en: '11' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'max تعطي أكبر محرف وهو w، و11 كان جواب len. الاثنتان من الجاهزات التي تتلاعب بها النصوص — وسنعيدها مع القوائم قريبًا.',
            en: 'max gives the largest character, w, while 11 was len’s answer. Both are built-ins that juggle strings — and we will meet them again with lists soon.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'وختامًا: result = تابع_خالٍ() — ماذا يُخزَّن في result؟',
            en: 'Finally: result = void_function() — what gets stored in result?',
          },
          options: [
            { id: 'a', text: { ar: 'None — قيمة مميّزة من صنف NoneType', en: 'None — a special value of class NoneType' } },
            { id: 'b', text: { ar: "النص 'None'", en: "The string 'None'" } },
            { id: 'c', text: { ar: 'خطأ TypeError فورًا', en: 'An immediate TypeError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الإسناد نفسه لا يفشل: يخزَّن None بهدوء، والانفجار يأتي لاحقًا إن حسبت عليه — result * 2 مثلًا. التابع الخالي يعطي None دائمًا.',
            en: 'The assignment itself does not fail: None is quietly stored, and the explosion comes later if you compute on it — result * 2, for example. A void function always gives None.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'import math\nprint(random.randint(1, 6))',
          right: 'import random\nprint(random.randint(1, 6))',
          note: {
            ar: 'استيراد math لا يفتح random: كل وحدة تُستورد باسمها وإلا جاء NameError: name random is not defined. استيرادان إن احتجت الاثنتين.',
            en: 'Importing math does not open random: every module is imported by its own name, otherwise NameError: name random is not defined. Two imports if you need both.',
          },
        },
        {
          wrong: "result = print('مرحبا')\nprint(result * 2)",
          right: "print('مرحبا')\nprint('مرحبا')",
          note: {
            ar: 'print نفسها تابع خالٍ يُعيد None: result * 2 يرمي TypeError: unsupported operand type(s) for *. لا تُسند نتيجة تابع خالٍ وتحسب عليها.',
            en: 'print itself is a void function returning None: result * 2 throws TypeError: unsupported operand type(s) for *. Never store a void call’s result and compute on it.',
          },
        },
        {
          wrong: "def make_password():\n    p = random.choice('abcdef')\n    return p",
          right: "import random\n\ndef make_password():\n    p = random.choice('abcdef')\n    return p",
          note: {
            ar: 'التابع معرّف لكن وحدته لم تُستورد: أول استدعاء يرمي NameError: name random is not defined. استورد الوحدات في أعلى البرنامج قبل التعريفات التي تستخدمها.',
            en: 'The function is defined but its module was never imported: the first call throws NameError: name random is not defined. Import your modules at the top of the program, before the definitions that use them.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل الرابع كله: استدعاء ووسائط وقيم مُعادة، جاهزات max/min/len/type، تحويلات int/float/str، وحدتا math وrandom مع البذرة، def وترويسة وجسم، تسلسل تنفيذ يقفز، معاملات تستقبل، ومُنتجة تعيد وخالية تعطي None.', en: 'All of chapter 4: calls, arguments and return values; built-ins max/min/len/type; conversions int/float/str; the math and random modules with the seed; def with header and body; a jumping flow of execution; receiving parameters; fruitful returns and void None.' },
        { ar: 'المشروع جمعها في عشر أسطر: def + random.choice + عامل + + return + seed — مولّد كلمات مرور حتمي للتجربة وحرّ بلا بذرة.', en: 'The project gathered it all in ten lines: def + random.choice + the + operator + return + seed — a password generator, deterministic for testing, free without a seed.' },
        { ar: 'والتنقيح يعلّمك أن تقرأ التقرير: نوع الخطأ ومكان الاكتشاف — والخطأ الحقيقي غالبًا في سطر سابق، والمسافات غير المرئية فخ.', en: 'And debugging teaches you to read the report: the error kind and the detection place — the real bug usually sits in an earlier line, and invisible whitespace is a trap.' },
      ],
      reflectPrompt: {
        ar: 'طوّر مولّدك ذهنيًا: كيف تضمن ألا تحوي الكلمة محارف متشابهة؟ وكيف تجعلها أطول قبل وصول الحلقات؟ وما السبب الذي يجعلك تستخدم بذرة في التطوير وتحذفها في الإطلاق؟',
        en: 'Improve your generator on paper: how do you guarantee no look-alike characters? How do you make the password longer before loops arrive? And why fix a seed while developing, then drop it at launch?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch4.s12', pages: 'ص68 / pp.68' },
        { book: 'PY4E', section: 'py4e.ch4.s13', pages: 'ص69 / pp.69' },
        { book: 'PY4E', section: 'py4e.ch4.s14', pages: 'ص70 / pp.70' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch4.s12', pages: 'ص68 / pp.68' },
    { book: 'PY4E', section: 'py4e.ch4.s13', pages: 'ص69 / pp.69' },
    { book: 'PY4E', section: 'py4e.ch4.s14', pages: 'ص70 / pp.70' },
  ],
} satisfies Lesson;

export default lesson;
