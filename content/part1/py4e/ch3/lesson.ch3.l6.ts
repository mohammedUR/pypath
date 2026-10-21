import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch3.l6 — "Chapter 3 Review and Project: The Safe Calculator /
 * مراجعة الفصل 3 ومشروع: الآلة الحاسبة الآمنة"
 * Aligned with PY4E ch3 s9 (التنقيح), s10 (فهرس المصطلحات), s11 (تمارين).
 * All expression is original.
 * Sandbox note: input() is simulated via `typed` variables (pattern from
 * ch2.l5) so the project is fully gradeable in-browser.
 */
const lesson = {
  id: 'py4e.ch3.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 3,
  title: { ar: 'مراجعة الفصل 3 ومشروع: الآلة الحاسبة الآمنة', en: 'Chapter 3 Review and Project: The Safe Calculator' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch3.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'ثلاثة أسطر تقرر، وسطر واحد يضمن: أنت الآن تكتب برامج تسأل وتقارن وتتسلسل وتلتقط أخطاء المستخدم قبل أن تصل إليها. ختام الفصل الثالث جلسة استرجاع لكل الخريطة، ثم أول مشروع كامل فيه: آلة حاسبة آمنة لا تنهار مهما كتب المستخدم الغاضب.',
        en: 'Three lines decide, one line insures: you can now write programs that ask, compare, chain, and intercept user errors before they hit you. This close of chapter 3 is a retrieval session over the whole map, then the chapter’s first complete project: a safe calculator that never crashes, no matter what the angry user types.',
      },
    },
    {
      kind: 'predict',
      code: "typed = '8'\nn = int(typed)\nif n % 2 == 0:\n    print('زوجي')\nelse:\n    print('فردي')",
      question: {
        ar: 'بأدوات الفصل الثالث كله: ماذا سيُطبع؟',
        en: 'Using the whole chapter 3 toolkit: what will be printed?',
      },
      reveal: {
        ar: "زوجي — typed يحمل نصًّا فحوّلناه بـ int (درس الفصل الثاني)، ثم سألنا 8 % 2 == 0 فتحقق الشرط ونفَّذ الفرع الأول (درسا if وelse). ثلاثة فصول تتلاقى في ستة أسطر: هذا هو مستواك الآن.",
        en: "زوجي — typed holds a string, so we converted it with int (a chapter 2 lesson), then asked 8 % 2 == 0, which held, so the first branch ran (the if and else lessons). Three chapters converge in six lines: that is where you stand now.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل الثالث في دقيقتين', en: 'Chapter 3 in two minutes' },
      chunks: [
        {
          ar: 'بدأنا بالتعابير المنطقية: قيمة True أو False من صنف bool، وعوامل المقارنة == != > < >= <= — مع تحذير الخلط بين = الإسناد و== المقارنة. ثم عوامل and وor وnot التي تجمع الأسئلة. وشرط if مع الكتلة البادئة والنقطتين، وelse للبديل: فرعان ويُنفَّذ واحد حتمًا.',
          en: 'We began with boolean expressions: a True or False value of class bool, and the comparison operators == != > < >= <= — with the warning never to confuse = (assignment) with == (comparison). Then the combining operators and, or and not. Then if with its indented block and colon, and else for the alternative: two branches, exactly one must run.',
        },
        {
          ar: 'كبّرنا القرار بالسلسلة elif حيث الترتيب معنى (الأخص أولًا)، ورأينا الشرط المتداخل وكيف يُسطّح بـ and. ثم جاء درس النجاة: try/except يلتقط أخطاء المستخدم بدل الانهيار، وموجز التتبع يُقرأ من آخر سطر. وختمنا بالتقييم قصير الدارة ونمط الحارس الذي يمنع الخطر قبل وقوعه.',
          en: 'We scaled the decision with elif chains, where ordering is meaning (most specific first), met nested conditionals and their flattening with and. Then the survival lesson: try/except catches user errors instead of crashing, and the traceback is read from its last line. We closed with short-circuit evaluation and the guardian pattern that stops danger before it happens.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المشروع: الآلة الحاسبة الآمنة', en: 'The project: the safe calculator' },
      chunks: [
        {
          ar: "الوظيفة: نقرأ ما «كتبه» المستخدم في متغيّرين typed_a وtyped_b (محاكاة input من الفصل الثاني — فالمنصة بلا لوحة مفاتيح). داخل try: نحوّلهما بـ int إلى أعداد، نطبع نتيجة المقارنة a > b، ثم مجموعهما a + b، ثم قسمتهما a / b. وإذا رفض التحويل أي إدخال، تقفز البرنامج إلى وتُطبع رسالة أرقام فقط — بلا انهيار.",
          en: "The job: read what the user “typed” into two variables typed_a and typed_b (simulating chapter 2’s input — this platform has no keyboard). Inside try: convert both with int, print the comparison a > b, then their sum a + b, then their division a / b. If any input fails conversion, the program jumps to except and prints أرقام فقط — no crash.",
        },
        {
          ar: 'لاحظ طبقات الأمان التي تعلمتها: التحويلات داخل try (درس try/except)، والمقارنة تُجرى على أعداد حقيقية لا على نص (درس التعابير المنطقية — تذكّر أن "5" == 5 كانت تكذب عليك)، والقسمة تحت سقف try الأب. برنامج يعمل من أول تشغيل — لكنه يعمل بأمان من أول مستخدم غاضب.',
          en: 'Notice the layers of protection you learned: conversions inside try (the try/except lesson), the comparison performed on real numbers not text (the boolean expressions lesson — remember how "5" == 5 lied to you), and the division under the parent try’s roof. A program that works on the first run — but works safely from the first angry user.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نموذج مصغّر للآلة', en: 'A miniature model of the machine' },
      code: "typed_a = '12'\ntyped_b = '4'\ntry:\n    a = int(typed_a)\n    b = int(typed_b)\n    print(a >= b)\n    print(a - b)\nexcept:\n    print('أرقام فقط')",
      explanation: {
        ar: "المستخدم «كتب» 12 و4: التحويل نجح فطُبع True (12 أكبر من أو تساوي 4) ثم 8 (حاصل الطرح). غيّر typed_b إلى 'أبجد' وأعد التشغيل: قفزة إلى except ورسالة مهذبة، ولا أثر لانهيار. هذا هو هيكل مشروعك نفسه — توسّعه بالمقارنة والجمع والقسمة.",
        en: "The user “typed” 12 and 4: conversion succeeded, so True printed (12 is greater than or equal to 4), then 8 (the difference). Change typed_b to 'أبجد' and run again: a jump to except and a polite message, no crash anywhere. This is your project’s exact skeleton — extend it with the comparison, the sum and the division.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-review',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تسخين مراجعة: تتبّع السلسلة والسطر الخارج عنها، وتوقّع الخرْج بالضبط.',
        en: 'Review warm-up: trace the chain and the line outside it, and predict the exact output.',
      },
      code: "x = 7\nif x > 10:\n    print('كبير')\nelif x > 5:\n    print('متوسط')\nprint('تم')",
      solution: 'متوسط\nتم',
      answer: 'متوسط\nتم',
      hints: [
        { ar: 'هل 7 > 10؟ ثم: هل 7 > 5؟', en: 'Is 7 > 10? Then: is 7 > 5?' },
        { ar: 'أول شرط يتحقق يُنفَّذ وتنتهي السلسلة.', en: 'The first condition that holds runs and the chain ends.' },
        { ar: 'وتم ليست داخل أي كتلة — تُنفَّذ دائمًا.', en: 'And تم is inside no block — it always runs.' },
        { ar: 'الخرْج:\nمتوسط\nتم', en: 'The output:\nمتوسط\nتم' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.safe-calculator',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل الثالث — الآلة الحاسبة الآمنة: typed_a = '9' وtyped_b = '3' (نصّان). اكتب بنية try/except: داخل try حوّل الاثنين بـ int، ثم اطبع ثلاثة أسطر بالترتيب: نتيجة a > b، ثم a + b، ثم a / b. وفي except اطبع أرقام فقط. المتوقع في الخرْج: True ثم 12 ثم 3.0.",
        en: "Chapter 3 project — the safe calculator: typed_a = '9' and typed_b = '3' (both strings). Write a try/except: inside try convert both with int, then print three lines in order: the result of a > b, then a + b, then a / b. In except print أرقام فقط. Expected output: True, then 12, then 3.0.",
      },
      starterCode: "typed_a = '9'\ntyped_b = '3'\n# الآلة الحاسبة الآمنة / the safe calculator\n# try:\n#     ...\n# except:\n#     ...\n",
      solution: "typed_a = '9'\ntyped_b = '3'\ntry:\n    a = int(typed_a)\n    b = int(typed_b)\n    print(a > b)\n    print(a + b)\n    print(a / b)\nexcept:\n    print('أرقام فقط')",
      tests: [
        {
          id: 't1',
          name: { ar: 'تُطبع نتيجة المقارنة True', en: 'The comparison True is printed' },
          code: "assert 'True' in __learner_output__, ('expected: True | actual: %r' % __learner_output__)",
          expected: 'True',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع المجموع 12', en: 'The sum 12 is printed' },
          code: "assert '12' in __learner_output__, ('expected: 12 | actual: %r' % __learner_output__)",
          expected: '12',
        },
        {
          id: 't3',
          name: { ar: 'تُطبع القسمة 3.0 — القسمة الحقيقية تنتج عائمًا', en: 'The division 3.0 is printed — true division yields a float' },
          code: "assert '3.0' in __learner_output__, ('expected: 3.0 | actual: %r' % __learner_output__)",
          expected: '3.0',
        },
        {
          id: 't4',
          name: { ar: 'رسالة الخطأ غائبة — الإدخال سليم', en: 'The error message is absent — inputs were valid' },
          code: "assert 'أرقام فقط' not in __learner_output__, ('expected: no أرقام فقط | actual: %r' % __learner_output__)",
          expected: 'True / 12 / 3.0',
        },
      ],
      hints: [
        { ar: 'الترتيب داخل try: تحويلان ثم ثلاث طباعات — وexcept تحتها برسالة.', en: 'Order inside try: two conversions then three prints — with except and its message below.' },
        { ar: 'لا تنسَ أن a / b قسمة حقيقية: 9 / 3 تعطي 3.0 وليس 3.', en: 'Do not forget a / b is true division: 9 / 3 gives 3.0, not 3.' },
        { ar: "الهيكل:\ntry:\n    a = int(typed_a)\n    b = int(typed_b)\n    print(a > b)\n    print(a + b)\n    print(a / b)\nexcept:\n    print('أرقام فقط')", en: "The skeleton:\ntry:\n    a = int(typed_a)\n    b = int(typed_b)\n    print(a > b)\n    print(a + b)\n    print(a / b)\nexcept:\n    print('أرقام فقط')" },
        { ar: "typed_a = '9'\ntyped_b = '3'\ntry:\n    a = int(typed_a)\n    b = int(typed_b)\n    print(a > b)\n    print(a + b)\n    print(a / b)\nexcept:\n    print('أرقام فقط')", en: "typed_a = '9'\ntyped_b = '3'\ntry:\n    a = int(typed_a)\n    b = int(typed_b)\n    print(a > b)\n    print(a + b)\n    print(a / b)\nexcept:\n    print('أرقام فقط')" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-error-family',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ومن الفصل الأول: ValueError التي يرميها int على إدخال سيئ — إلى أي عائلة من العائلات الثلاث تنتمي؟',
        en: 'And from chapter 1: the ValueError raised by int on bad input — which of the three families does it belong to?',
      },
      options: [
        { id: 'a', text: { ar: 'خطأ أثناء التشغيل (runtime)', en: 'A runtime error' } },
        { id: 'b', text: { ar: 'خطأ قواعدي (syntax)', en: 'A syntax error' } },
        { id: 'c', text: { ar: 'خطأ دلالي صامت', en: 'A silent semantic error' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'القواعدية يلتقطها المفسّر قبل التشغيل، والدلالية لا ترسل رسائل أصلًا.', en: 'Syntax errors are caught before running; semantic ones never send messages.' },
        { ar: 'هذه تنفجر في منتصف التنفيذ برسالة واضحة وموجز تتبع.', en: 'This one explodes mid-execution with a clear message and a traceback.' },
        { ar: 'ولهذا بالضبط صُممت try/except لالتقاطها.', en: 'And that is exactly why try/except was designed to catch it.' },
        { ar: 'الجواب: أ — خطأ زمن تشغيل، وtry/except صديقه الطبيعي.', en: 'Answer: a — a runtime error, and try/except is its natural counterpart.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-mod',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل — من درس العوامل في الفصل الثاني: كم 17 % 5؟',
        en: 'Without running — from the chapter 2 operators lesson: what is 17 % 5?',
      },
      answer: '2',
      solution: '2',
      tolerance: 0,
      hints: [
        { ar: '% يسأل عن الباقي لا عن خارج القسمة.', en: '% asks for the remainder, not the quotient.' },
        { ar: '5 × 3 = 15 — وكم بقي من 17؟', en: '5 × 3 = 15 — how much is left of 17?' },
        { ar: 'الباقي أصغر دائمًا من المقام.', en: 'The remainder is always smaller than the denominator.' },
        { ar: 'الجواب: 2', en: 'Answer: 2' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-crash',
      expectedError: 'ValueError',  // intentional crash-teaching; verified by checks replay
      required: true,
      brokenCode: "typed = 'خمسة'\nn = int(typed)\nprint('تم التحويل')",
      prompt: {
        ar: "برنامج زميلك ينهار بقسوة: ValueError في السطر الثاني ولا يُطبع تم التحويل أصلًا. احمِ التحويل بـ try/except بحيث تُطبع أرقام فقط عند الفشل — وقرر بنفسك أين يستقر سطر الطباعة، ولماذا.",
        en: "Your friend’s program crashes hard: ValueError at the second line, and تم التحويل never prints at all. Guard the conversion with try/except so أرقام فقط prints on failure — and decide yourself where the print line should live, and why.",
      },
      solution: "typed = 'خمسة'\ntry:\n    n = int(typed)\nexcept:\n    print('أرقام فقط')",
      tests: [
        {
          id: 't1',
          name: { ar: 'تُطبع الرسالة أرقام فقط', en: 'The message أرقام فقط is printed' },
          code: "assert 'أرقام فقط' in __learner_output__, ('expected: أرقام فقط | actual: %r' % __learner_output__)",
          expected: 'أرقام فقط',
        },
        {
          id: 't2',
          name: { ar: 'لا انهيار — لا أثر لـ ValueError في الخرْج', en: 'No crash — no ValueError trace in the output' },
          code: "assert 'ValueError' not in __learner_output__, ('expected: no ValueError | actual: %r' % __learner_output__)",
          expected: 'أرقام فقط',
        },
        {
          id: 't3',
          name: { ar: 'رسالة النجاح الكاذبة لم تُطبع', en: 'The false success message was not printed' },
          code: "assert 'تم التحويل' not in __learner_output__, ('expected: no تم التحويل | actual: %r' % __learner_output__)",
          expected: 'أرقام فقط',
        },
      ],
      hints: [
        { ar: 'السطر الخطرة واحد فقط: التحويل — وهو الذي يحتاج الحماية.', en: 'Only one line is risky: the conversion — and it is the one needing protection.' },
        { ar: 'بنية try: وexcept: بنقطتيهما، والسطر الخطرة داخل الأولى.', en: 'The try: and except: headers, each with its colon; the risky line goes inside the first.' },
        { ar: 'سطر تم التحويل داخل try بعد التحويل لن يُنفَّذ عند الفشل — فهل معناه إذًا؟', en: 'A تم التحويل line inside try after the conversion never runs on failure — so what would it mean?' },
        { ar: "typed = 'خمسة'\ntry:\n    n = int(typed)\nexcept:\n    print('أرقام فقط')", en: "typed = 'خمسة'\ntry:\n    n = int(typed)\nexcept:\n    print('أرقام فقط')" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — الآلة الكاملة\n# Your playground — the full machine\n\ntyped_a = '8'\ntyped_b = '0'\ntry:\n    a = int(typed_a)\n    b = int(typed_b)\n    if b != 0 and a / b > 1:\n        print('القسمة تعطي أكثر من 1')\n    else:\n        print('القسمة صغيرة أو مستحيلة')\nexcept:\n    print('أرقام فقط')",
      prompt: {
        ar: "جرّب بنفسك: غيّر typed_b إلى 'صفر' (نصًّا) ولاحظ القفزة إلى except لأن int رفض التحويل. ثم اجعل typed_b = 0 رقمًا وراقب الحارس b != 0 يوقف القسمة بهدوء. ثمانية أسطر فيها كامل الفصل الثالث: تحويل محمي، وشرط، وسلسلة، وحارس.",
        en: "Try it yourself: change typed_b to 'صفر' (as text) and watch the jump to except because int refused the conversion. Then make typed_b = 0 a number and watch the guardian b != 0 quietly stop the division. Eight lines carrying the whole chapter: a guarded conversion, a condition, a chain, and a guardian.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الثاني: ماذا يعيد input دائمًا قبل أي تحويل؟',
            en: 'And from chapter 2: what does input always return, before any conversion?',
          },
          options: [
            { id: 'a', text: { ar: 'نصًّا str حتى لو كانت أرقامًا', en: 'A string str, even if it holds digits' } },
            { id: 'b', text: { ar: 'عددًا صحيحًا', en: 'An integer' } },
            { id: 'c', text: { ar: 'قيمة منطقية True', en: 'A boolean True' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'لهذا كان التحويل بـ int ضرورة، ولهذا حاصرناه بـ try: إدخال المستخدم نصّ دائمًا قد يكون fred.',
            en: 'That is why conversion with int is a necessity, and why we guard it with try: user input is always a string that may be fred.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في سلسلة elif تحققت شروط ثلاثة معًا — كم فرعًا يُنفَّذ؟',
            en: 'In an elif chain, three conditions all held — how many branches run?',
          },
          options: [
            { id: 'a', text: { ar: 'واحد: أول من تحقق', en: 'One: the first that held' } },
            { id: 'b', text: { ar: 'ثلاثة بالترتيب', en: 'All three, in order' } },
            { id: 'c', text: { ar: 'الأخير', en: 'The last one' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'أول شرط يتحقق يُنفَّذ فرعه وتنتهي العبارة كلها — هذا هو التسلسل الشرطي كما درسناه.',
            en: 'The first condition that holds runs its branch and the whole statement ends — that is the chained conditional as we studied it.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'الخطأ الذي ينفجر أثناء التشغيل برسالة مثل ValueError — كيف نلتقطه بلطف؟',
            en: 'An error that explodes at runtime with a message like ValueError — how do we catch it politely?',
          },
          options: [
            { id: 'a', text: { ar: 'بنية try/except', en: 'With a try/except structure' } },
            { id: 'b', text: { ar: 'بتعليق # فوق السطر', en: 'With a # comment above the line' } },
            { id: 'c', text: { ar: 'بـ print إضافي بعد البرنامج', en: 'With an extra print after the program' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'try يحاصر الخطورة وexcept يستقبل القفزة — والتعليق والطباعة لا يمنعان شيئًا من الانهيار.',
            en: 'try fences off the risk and except receives the jump — a comment and a print prevent nothing.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'متى تُجاهل كتلة except كليًا؟',
            en: 'When is the except block skipped entirely?',
          },
          options: [
            { id: 'a', text: { ar: 'عندما ينجح تنفيذ كتلة try كاملة', en: 'When the whole try block runs successfully' } },
            { id: 'b', text: { ar: 'عندما يفشل التحويل', en: 'When the conversion fails' } },
            { id: 'c', text: { ar: 'لا تُجاهل أبدًا', en: 'It is never skipped' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا ضمان التنفيذ التسلسلي: لا رسوم إلا عند الكسر — التشغيل السليم لا يلمس except.',
            en: 'That is the sequential-flow insurance: you pay only on a break — a clean run never touches except.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "typed = '5'\nif typed > 3:\n    print('كبير')",
          right: "typed = '5'\nif int(typed) > 3:\n    print('كبير')",
          note: {
            ar: 'النص مقارنةً بعدد: \"5\" > 3 يرمي TypeError في بايثون 3 — حوّل أولًا ثم قارن. و\"5\" == 5 كانت تكذب بـ False في درس التعابير المنطقية.',
            en: 'Text compared to a number: "5" > 3 throws TypeError in Python 3 — convert first, then compare. And "5" == 5 quietly lied with False in the boolean expressions lesson.',
          },
        },
        {
          wrong: "typed = 'عشرة'\nn = int(typed)\nprint(n * 2)",
          right: "typed = 'عشرة'\ntry:\n    n = int(typed)\nexcept:\n    print('أرقام فقط')",
          note: {
            ar: 'تحويل إدخال المستخدم بلا حماية = قنبلة موقوتة: أول كلمة غير رقمية تنهي البرنامج بقسوة. try/except في المكان الصحيح يجعل الانهيار رسالة مهذبة.',
            en: 'Converting user input without protection is a ticking bomb: the first non-numeric word ends the program harshly. try/except in the right place turns the crash into a polite message.',
          },
        },
        {
          wrong: "try:\n    n = int(typed)\nexcept:\n    pass",
          right: "try:\n    n = int(typed)\nexcept:\n    print('أرقام فقط')",
          note: {
            ar: 'except الصامتة تترك المستخدم في حيرة: البرنامج انتهى بلا نتيجة ولا سبب. أعطِ رسالة مفيدة — إصلاح أو محاولة أو إنهاء بأمان.',
            en: 'A silent except leaves the user puzzled: the program ended with no result and no reason. Give a useful message — fix it, retry, or exit gracefully.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل الثالث كله: مقارنة وbool، and/or/not، if/else والكتل البادئة، سلاسل elif وترتيبها، التداخل وتسطيحه، try/except، والقصر والحارس.', en: 'All of chapter 3: comparisons and bool, and/or/not, if/else and indented blocks, elif chains and their ordering, nesting and flattening, try/except, and short-circuiting with the guardian.' },
        { ar: 'المشروع جمع الطبقات: تحويل محمي بـ try، مقارنات على أعداد حقيقية، ورسالة مهذبة عند الفشل.', en: 'The project stacked the layers: a guarded conversion inside try, comparisons on real numbers, and a polite message on failure.' },
        { ar: 'البرنامج الآمن لا يفترض مستخدمًا مثاليًا: يفترض fred — ويرد عليه بلطف.', en: 'A safe program assumes no perfect user: it assumes fred — and answers him politely.' },
      ],
      reflectPrompt: {
        ar: 'آلة الحاسبة الآمنة أول مشروع كامل لك بقرارات وحماية. ما الوظيفة التي ستضيفها له غدًا — وبأي أداة من الفصل الثالث ستنفّذها؟',
        en: 'The safe calculator is your first complete project with decisions and protection. Which feature will you add to it tomorrow — and which chapter 3 tool will implement it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch3.s9', pages: 'ص51 / pp.51' },
        { book: 'PY4E', section: 'py4e.ch3.s10', pages: 'ص51-52 / pp.51-52' },
        { book: 'PY4E', section: 'py4e.ch3.s11', pages: 'ص53-54 / pp.53-54' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch3.s9', pages: 'ص51 / pp.51' },
    { book: 'PY4E', section: 'py4e.ch3.s10', pages: 'ص51-52 / pp.51-52' },
    { book: 'PY4E', section: 'py4e.ch3.s11', pages: 'ص53-54 / pp.53-54' },
  ],
} satisfies Lesson;

export default lesson;
