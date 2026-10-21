import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch3.l1 — "Boolean Expressions / التعابير المنطقية"
 * Aligned with PY4E ch3 s1 (التعابير المنطقية), s2 (العوامل المنطقية).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch3.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 3,
  title: { ar: 'التعابير المنطقية', en: 'Boolean Expressions' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch2.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'البرامج الذكية تتخذ قرارات: هل كلمة المرور صحيحة؟ هل الرصيد يكفي؟ هل الدرجة ضمن النطاق؟ وكل هذه القرارات — مهما بدت معقدة — تنحلّ في النهاية إلى سؤال بجوابين فقط: نعم أو لا. في هذا الدرس تتعلّم كيف يطرح بايثون هذه الأسئلة، وماذا يجيب.',
        en: 'Smart programs make decisions: Is the password correct? Is the balance enough? Is the score within range? And all of these — however complex they look — boil down to a question with only two possible answers: yes or no. In this lesson you learn how Python asks such questions, and what it answers.',
      },
    },
    {
      kind: 'predict',
      code: 'print(5 == 5)\nprint(5 == 6)',
      question: {
        ar: 'ماذا سيطبع السطران؟ انتبه: علامتا مساواة، لا واحدة.',
        en: 'What will the two lines print? Careful: two equal signs, not one.',
      },
      reveal: {
        ar: 'سيطبع True ثم False. علامتا المساواة == ليستا أمر تخزين ولا حساب: هي سؤال مقارنة — «هل 5 يساوي 5؟» — وجواب السؤال قيمة منطقية. السطر الأول أفاد بالتأكيد، والثاني بالنفي.',
        en: 'It prints True then False. The double equals == stores nothing and computes nothing: it is a comparison question — “is 5 equal to 5?” — and the answer to that question is a logical value. The first line affirmed; the second denied.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التعبير المنطقي: قيمة من جوابين', en: 'A boolean expression: a value of two answers' },
      chunks: [
        {
          ar: 'التعبير المنطقي تعبيرٌ نتيجته إحدى قيمتين فقط: محقَّقة True أو خاطئة False. العامل == يقارن بين معاملين ويسأل «هل هما متساويان؟» فتجيب بايثون: 5 == 5 تعطي True و5 == 6 تعطي False. قلها هكذا: العوامل الحسابية في الفصل الماضي كانت تُخرج أعدادًا، أما عوامل المقارنة فتُخرج أجوبة.',
          en: 'A boolean expression is an expression whose result is one of exactly two values: true True or false False. The == operator compares two operands and asks “are they equal?” — Python answers: 5 == 5 gives True, and 5 == 6 gives False. Put it this way: arithmetic operators from last chapter produced numbers; comparison operators produce answers.',
        },
        {
          ar: "True وFalse ليستا نصًّا ولا عددًا: هما قيمتان من صنف خاص اسمه bool — اكتب type(True) وستقرأ <class 'bool'>. وانتبه للهجاء: القيمتان تبدآن بحرف كبير دائمًا. True صحيحة، أما true أو TRUE فبايثون لا تعرفها وستصرخ NameError لأنها تتظاهر بأنها اسم متغيّر لم تعرّفه.",
          en: "True and False are neither text nor a number: they are values of a special class named bool — type type(True) and you will read <class 'bool'>. Mind the spelling: both start with a capital letter. True is correct, while true or TRUE is unknown to Python — it screams NameError because it assumes you named a variable you never defined.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'عائلة عوامل المقارنة', en: 'The comparison operator family' },
      chunks: [
        {
          ar: 'إلى جانب == يوجد: x != y (مختلفان)، x > y (أكبر تمامًا)، x < y (أصغر تمامًا)، x >= y (أكبر أو يساوي)، x <= y (أصغر أو يساوي) — وتوجد أيضًا x is y وx is not y لكن اجعلها لاحقًا؛ == تكفيك الآن. واعلم أن الرموز الرياضية المعتادة ليست كلها موجودة: لا وجود في بايثون لـ =< ولا لـ =>.',
          en: 'Alongside == there are: x != y (not equal), x > y (strictly greater), x < y (strictly less), x >= y (greater or equal), x <= y (less or equal) — plus x is y and x is not y, but save those for later; == serves you for now. And note that not every familiar math symbol exists: Python has no =< and no =>.',
        },
        {
          ar: 'والفخ الأكبر في الدرس كله: علامة واحدة = ليست مقارنة أبدًا. = إسناد يخزّن القيمة (تعلمناه في الفصل الثاني)، و== مقارنة تسأل فقط. من يكتب 5 = 5 يحصل على SyntaxError فورًا. ثبّت القاعدة في رأسك: تسأل باثنتين، وتخزّن بواحدة.',
          en: 'And the biggest trap of the whole lesson: a single = is never a comparison. = is assignment that stores a value (chapter 2), while == is comparison that only asks. Anyone writing 5 = 5 gets a SyntaxError immediately. Nail the rule down: ask with two, store with one.',
        },
        {
          ar: 'وتذكّر من الفصل الثاني أن الأنواع لا تختلط بالمجان: النص "5" ليس العدد 5، ولذلك "5" == 5 تعطي False بهدوء. أما مقارنة الحجم بين نوعين مختلفين مثل 1 < \'2\' فترفضها بايثون 3 تمامًا برسالة TypeError — حوّل النوع أولًا ثم اسأل.',
          en: "And remember from chapter 2 that types do not mix for free: the text \"5\" is not the number 5, so \"5\" == 5 quietly gives False. But comparing sizes across types, like 1 < '2', is flat-out refused by Python 3 with a TypeError — convert the type first, then ask.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'ثلاث روابط تجمع الأسئلة', en: 'Three links that combine questions' },
      chunks: [
        {
          ar: 'العوامل المنطقية الثلاثة and وor وnot تجمع الأسئلة الصغيرة في قرار واحد. التعبير x > 0 and x < 10 لا يتحقق إلا إذا تحقق الشرطان معًا (x موجب وأصغر من 10). والتعبير n % 2 == 0 or n % 3 == 0 يتحقق إذا تحقق أحد الشرطين على الأقل (يقبل القسمة على 2 أو على 3). وnot (x > y) ينفي ما بعده: يتحقق إذا كان x > y خاطئًا، أي إذا كان x أصغر من أو يساوي y.',
          en: 'The three logical operators and, or and not combine small questions into one decision. x > 0 and x < 10 holds only if both hold (x is positive and less than 10). n % 2 == 0 or n % 3 == 0 holds if at least one holds (divisible by 2 or by 3). And not (x > y) negates what follows: it holds when x > y is false — that is, when x is less than or equal to y.',
        },
        {
          ar: 'بالمعنى الدقيق يجب أن تكون معاملات هذه العوامل تعابير منطقية، لكن بايثون متسامحة: تفسر أي عدد غير صفري على أنه True — جرّب 17 and True وسترى True. هذه المرونة قد تفيد، لكن تفاصيلها الدقيقة مربكة؛ الكتاب نفسه ينصحك بتجنّبها حتى تتأكد أنك تعرف ما تفعله. سنستفيد من and وor بذكاء في درس لاحق من هذا الفصل.',
          en: 'Strictly speaking, the operands of these operators should be boolean expressions, but Python is forgiving: it reads any nonzero number as True — try 17 and True and you will see True. The flexibility can help, but its fine print is confusing; the book itself advises avoiding it until you are sure you know what you are doing. We will put and and or to clever use later in this chapter.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'اسأل، لا تخزّن', en: 'Ask, do not store' },
      code: "x = 7\nprint(x > 5)\nprint(x == 7)\nprint(x != 7)\nprint(type(x > 5))",
      explanation: {
        ar: "خزّنا 7 في x ثم طرحنا ثلاثة أسئلة فأجابت بايثون بالترتيب: True، True، False. والسطر الأخير يكشف هوية الجواب: <class 'bool'> — قيمة منطقية. ولاحظ أن الأسئلة لم تغيّر شيئًا: x بقيت 7. المقارنة تقرأ الصناديق ولا تحرّكها.",
        en: "We stored 7 in x, then asked three questions, and Python answered in order: True, True, False. The last line reveals the answer's identity: <class 'bool'> — a logical value. Notice the questions changed nothing: x stayed 7. Comparisons read the boxes; they never move them.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.compare-age',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'عرّف متغيّر age بالقيمة 15، ثم اطبع نتيجة السؤال age >= 13 (هل العمر 13 فأكثر؟). الخرْج المتوقع: True.',
        en: 'Define a variable age with the value 15, then print the result of the question age >= 13 (is the age 13 or more?). Expected output: True.',
      },
      starterCode: '# عرّف age ثم اسأل / define age, then ask:\n',
      solution: 'age = 15\nprint(age >= 13)',
      tests: [
        {
          id: 't1',
          name: { ar: 'age تساوي 15', en: 'age equals 15' },
          code: "assert age == 15, 'expected: 15 | actual: %r' % age",
          expected: '15',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع True', en: 'True is printed' },
          code: "assert 'True' in __learner_output__, ('expected: True | actual: %r' % __learner_output__)",
          expected: 'True',
        },
      ],
      hints: [
        { ar: 'أنت لا تحتاج if هنا — فقط عرّف المتغيّر واطبع قيمة مقارنة.', en: 'You do not need if here — just define the variable and print a comparison.' },
        { ar: 'المقارنة نفسها قيمة: يمكن طباعتها مباشرة مثل أي عدد.', en: 'The comparison itself is a value: it can be printed directly like any number.' },
        { ar: 'الهيكل:\nage = 15\nprint(age >= 13)', en: 'The skeleton:\nage = 15\nprint(age >= 13)' },
        { ar: 'age = 15\nprint(age >= 13)', en: 'age = 15\nprint(age >= 13)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-compare',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: 'x = 5\ny = 8\nprint(x < y)\nprint(x == y)',
      solution: 'True\nFalse',
      answer: 'True\nFalse',
      hints: [
        { ar: 'السؤال الأول: هل 5 أصغر من 8؟', en: 'First question: is 5 less than 8?' },
        { ar: 'السؤال الثاني: هل 5 يساوي 8؟', en: 'Second question: is 5 equal to 8?' },
        { ar: 'كل طباعة تُخرج سطرًا: جواب السؤال الأول ثم جواب الثاني.', en: 'Each print outputs one line: the first answer, then the second.' },
        { ar: 'الخرْج:\nTrue\nFalse', en: 'The output:\nTrue\nFalse' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-bool-type',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا تجيب type(True)؟',
        en: 'What does type(True) answer?',
      },
      options: [
        { id: 'a', text: { ar: "<class 'bool'>", en: "<class 'bool'>" } },
        { id: 'b', text: { ar: "<class 'str'>", en: "<class 'str'>" } },
        { id: 'c', text: { ar: "<class 'int'>", en: "<class 'int'>" } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر: True ليست نصًّا بين علامتي تنصيص.', en: 'Remember: True is not text between quotes.' },
        { ar: 'ليست عددًا أيضًا — لها صنف خاص بها.', en: 'It is not a number either — it has a class of its own.' },
        { ar: 'اسم الصنف ثلاثة حروف يبدأ بـ b.', en: 'The class name is three letters starting with b.' },
        { ar: "الجواب: <class 'bool'> — لأن True وFalse قيمتان منطقيتان.", en: "Answer: <class 'bool'> — because True and False are logical values." },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — اسأل بلا خوف\n# Your playground — ask without fear\n\nprint(3 != 3)\nprint(10 >= 10)\nprint("ب" == "ب")\nprint(2 + 2 == 4)\nprint("5" == 5)',
      prompt: {
        ar: 'جرّب بنفسك: قارن أعمارًا، قارن نصوصًا متطابقة، واسأل عن نتيجة عملية حسابية. ثم لاحظ السطر الأخير: لماذا "5" == 5 تعطي False؟ لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: compare ages, compare identical texts, ask about the result of an arithmetic operation. Then look at the last line: why does "5" == 5 give False? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل الثاني: ماذا يفعل الرمز = الواحد؟',
            en: 'Back to chapter 2: what does a single = do?',
          },
          options: [
            { id: 'a', text: { ar: 'يخزّن قيمة في متغيّر (إسناد)', en: 'Stores a value in a variable (assignment)' } },
            { id: 'b', text: { ar: 'يقارن بين قيمتين', en: 'Compares two values' } },
            { id: 'c', text: { ar: 'يطبع على الشاشة', en: 'Prints to the screen' } },
          ],
          answer: 'a',
          explanation: {
            ar: '= إسناد يخزّن، و== مقارنة تسأل. اليوم أضفنا النصف الثاني للصورة: المقارنة تُخرج قيمة منطقية ولا تغيّر شيئًا.',
            en: '= assigns and stores; == compares and asks. Today we added the second half of the picture: comparison outputs a logical value and changes nothing.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما ناتج التعبير 10 % 2 == 0؟',
            en: 'What is the value of 10 % 2 == 0?',
          },
          options: [
            { id: 'a', text: { ar: 'True', en: 'True' } },
            { id: 'b', text: { ar: 'False', en: 'False' } },
            { id: 'c', text: { ar: 'خطأ TypeError', en: 'A TypeError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'أولًا يحسب باقي القسمة من درس العوامل: 10 % 2 = 0، ثم يسأل == : هل 0 يساوي 0؟ نعم — فالجواب True. الحساب أولًا ثم السؤال.',
            en: 'First the remainder from the operators lesson: 10 % 2 = 0, then == asks: is 0 equal to 0? Yes — so the answer is True. Compute first, then ask.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'التعبير x > 0 and x < 10 — متى يتحقق؟',
            en: 'The expression x > 0 and x < 10 — when does it hold?',
          },
          options: [
            { id: 'a', text: { ar: 'إذا تحقق الشرطان معًا', en: 'When both conditions hold' } },
            { id: 'b', text: { ar: 'إذا تحقق أحد الشرطين على الأقل', en: 'When at least one condition holds' } },
            { id: 'c', text: { ar: 'إذا فشل الشرطان', en: 'When both conditions fail' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'and تجمع بشرط الاثنين معًا — والدرس القادم سيستخدمها كثيرًا في بناء القرارات.',
            en: 'and combines with an all-or-nothing rule — the next lesson will lean on it heavily when building decisions.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الأول: كتابة true بحرف صغير — متى يظهر خطؤها؟',
            en: 'And from chapter 1: writing true in lowercase — when does its error appear?',
          },
          options: [
            { id: 'a', text: { ar: 'قبل التشغيل كخطأ قواعدي', en: 'Before running, as a syntax error' } },
            { id: 'b', text: { ar: 'أثناء التشغيل كـ NameError', en: 'While running, as a NameError' } },
            { id: 'c', text: { ar: 'لا يظهر أبدًا', en: 'It never appears' } },
          ],
          answer: 'b',
          explanation: {
            ar: "القواعد سليمة والشكل صحيح، لكن المفسّر أثناء التشغيل يبحث عن اسم true فيرفع NameError: name 'true' is not defined — خطأ زمن تشغيل، وليس قواعديًا.",
            en: "The grammar is fine and the shape looks legal, but at runtime the interpreter hunts for a name called true and raises NameError: name 'true' is not defined — a runtime error, not a syntax one.",
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'if x = 5:\n    print("خمسة")',
          right: 'if x == 5:\n    print("خمسة")',
          note: {
            ar: 'علامة واحدة إسناد لا مقارنة — يوقفك المفسّر بـ SyntaxError: invalid syntax. تسأل باثنتين، وتخزّن بواحدة.',
            en: 'A single sign assigns, it never compares — the interpreter stops you with SyntaxError: invalid syntax. Ask with two, store with one.',
          },
        },
        {
          wrong: 'ready = true',
          right: 'ready = True',
          note: {
            ar: 'القيمتان المنطقيتان بحرف كبير دائمًا: True وFalse. الصيغة الصغيرة true تفهمها بايثون كاسم متغيّر غير معرّف فيرمي NameError.',
            en: 'The two logical values always start capital: True and False. Lowercase true is read as an undefined variable name and throws NameError.',
          },
        },
        {
          wrong: "print('5' == 5)",
          right: 'print(5 == 5)',
          note: {
            ar: 'النص ليس عددًا: "5" == 5 تعطي False بهدوء، و1 < "2" ترمي TypeError. حوّل النوع أولًا بـ int ثم قارن.',
            en: 'Text is not a number: "5" == 5 quietly gives False, and 1 < "2" throws a TypeError. Convert the type with int first, then compare.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التعبير المنطقي قيمته True أو False — من صنف bool، وليستا نصًّا ولا عددًا، وتبدآن بحرف كبير.', en: 'A boolean expression evaluates to True or False — values of class bool, neither text nor a number, always capitalized.' },
        { ar: 'عوامل المقارنة == != > < >= <= تقرأ القيم وتسأل عن العلاقة ولا تغيّر شيئًا.', en: 'Comparison operators == != > < >= <= read values, ask about the relation, and change nothing.' },
        { ar: 'and وor وnot تجمع الأسئلة الصغيرة في قرار واحد — والخلط بين = الإسناد و== المقارنة أشهر خطأ في الفصل.', en: 'and, or and not combine small questions into one decision — and confusing = (assignment) with == (comparison) is the chapter’s most famous bug.' },
      ],
      reflectPrompt: {
        ar: 'فكّر في تطبيق تستخدمه يوميًا: اذكر قرارين يتخذهما نيابة عنك، وصُغ كلًّا منهما كسؤال مقارنة بصيغة بايثون.',
        en: 'Think of an app you use daily: name two decisions it makes for you, and phrase each one as a Python-style comparison question.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch3.s1', pages: 'ص39 / pp.39' },
        { book: 'PY4E', section: 'py4e.ch3.s2', pages: 'ص40 / pp.40' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch3.s1', pages: 'ص39 / pp.39' },
    { book: 'PY4E', section: 'py4e.ch3.s2', pages: 'ص40 / pp.40' },
  ],
} satisfies Lesson;

export default lesson;
