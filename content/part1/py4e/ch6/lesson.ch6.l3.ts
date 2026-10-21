import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch6.l3 — "Slicing and Immutability / تجزئة السلاسل وثباتها"
 * Aligned with PY4E ch6 s4 (تجزئة السلاسل النصية),
 * s5 (السلاسل النصية غير قابلة للتعديل).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch6.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 6,
  title: { ar: 'تجزئة السلاسل وثباتها', en: 'Slicing and Immutability' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch6.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الفهرس يعطيك محرفًا واحدًا، لكن كثيرًا ما تريد قطعة: اسم المستخدم من بريد إلكتروني، أول كلمة من جملة، امتداد ملف. تجزئة السلاسل (slicing) هي مقصّ بايثون، وفي هذا الدرس ستتعلم أيضًا قانونًا لا يُخترق: السلاسل النصية غير قابلة للتعديل — لا يمكنك تغيير محرف في مكانه، لكنك تستطيع بناء سلسلة جديدة. بنهاية الدرس ستكون قادرًا على: اقتطاع شرائح بنطاقات النقطتين، واستخدام القيم الافتراضية للبداية والنهاية، وفهم الثبات وبديله الصحيح.',
        en: 'An index gives you one character, but often you want a piece: the username from an email, the first word of a sentence, a file extension. String slicing is Python’s scissors, and in this lesson you also learn an unbreakable law: strings are immutable — you cannot change a character in place, but you can build a new string. By the end of this lesson you will be able to: cut slices with colon ranges, use the default start and end values, and understand immutability and its correct workaround.',
      },
    },
    {
      kind: 'predict',
      code: "s = 'Monty Python'\nprint(s[0:5])",
      question: {
        ar: 'هل الناتج Monty أم Monty P؟ بمعنى: هل المحرف ذو الفهرس 5 مشمول؟',
        en: 'Is the output Monty or Monty P? In other words: is the character with index 5 included?',
      },
      reveal: {
        ar: 'الناتج Monty فقط. الشريحة [0:5] تشمل الفهرس الأول 0 وتستثني الفهرس الأخير 5 — تعيد المحارف 0 حتى 4. القاعدة الذهبية: تشمل البداية، وتستثني النهاية.',
        en: 'The output is Monty only. The slice [0:5] includes the first index 0 and excludes the last index 5 — it returns characters 0 through 4. The golden rule: include the start, exclude the end.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الشريحة: نطاق [n:m]', en: 'The slice: the [n:m] range' },
      chunks: [
        {
          ar: "نُسمّي الجزءَ المقتطع من السلسلة النصية بالشريحة (slice)، ويشابه اختيارُ شريحةٍ اختيارَ محرف: العامل [n:m] يعيد جزءًا من السلسلة من المحرف ذي الفهرس n إلى المحرف الذي يسبق ذا الفهرس m — أي يتضمن ذا الفهرس الأول n ولا يتضمن ذا الفهرس الأخير m. في 'Monty Python' تعيد s[0:5] النص Monty وتعيد s[6:12] النص Python. ولو تطابق الرقمان لبقيت القصة قصيرة: الأولى تشمل والثانية تستثني — لا مساحة للجدل.",
          en: "The part cut from a string is called a slice, and choosing a slice resembles choosing a character: the operator [n:m] returns the part of the string from the character at index n up to the character preceding index m — including the first index n and excluding the last index m. In 'Monty Python', s[0:5] returns Monty and s[6:12] returns Python. And when the two numbers coincide the story stays short: the first is included, the second excluded — no room for debate.",
        },
        {
          ar: 'وإذا حُذف الفهرس الأول (قبل النقطتين) بدأت التجزئة من بداية السلسلة، وإذا حُذف الثاني (بعد النقطتين) استمرت التجزئة حتى نهايتها:\nfruit = \'banana\'\nfruit[:3] تعطي \'ban\'\nfruit[3:] تعطي \'ana\'\nوهكذا تنقسم السلسلة إلى نصفين متكاملين بلا حساب فهرس واحد.',
          en: 'If the first index is omitted (before the colon) the slice starts at the beginning of the string, and if the second is omitted (after the colon) it continues to the end:\nfruit = \'banana\'\nfruit[:3] gives \'ban\'\nfruit[3:] gives \'ana\'\nAnd so the string splits into two complementary halves without computing a single index.',
        },
        {
          ar: "أما إذا كان الفهرس الأول أكبر أو يساوي الثاني فإن النتيجة سلسلة نصية فارغة تُمثَّل بعلامتي اقتباس: fruit[3:3] تعطي ''. السلسلة الفارغة لا تحوي أي محارف وطولها صفر — لكنها سلسلة نصية حقيقية: يقبلها len ويلمها كل شيء يتعلق بالسلاسل. وانسَ أيضًا أي انتظار لرسالة خطأ: التجزئة لا ترمي IndexError أبدًا — فالنطاق الخاطئ يعطيك فراغًا بصمت، وهذا فخ دلالي صامت.",
          en: "But when the first index is greater than or equal to the second, the result is an empty string represented by two quote marks: fruit[3:3] gives ''. The empty string holds no characters and its length is zero — yet it is a real string: len accepts it and everything string-related embraces it. And forget any expectation of an error message: slicing never throws IndexError — a wrong range silently hands you emptiness, a silent semantic trap.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'السلاسل النصية غير قابلة للتعديل', en: 'Strings are immutable' },
      chunks: [
        {
          ar: "قد يبدو مناسبًا استخدام الإسناد لتغيير محرف في السلسلة:\ngreeting = 'Hello, world!'\ngreeting[0] = 'J'\nفتظهر لك رسالة الخطأ: TypeError: 'str' object does not support item assignment. «الكائن» هنا هو السلسلة النصية، و«العنصر» هو المحرف الذي حاولت تسنيده. السلاسل النصية غير قابلة للتعديل (immutable): لا تستطيع تغيير سلسلة موجودة مهما فعلت — المفهوم نفسه الذي يعرفه بايثون بالكائن (object)، وسنتعرفه لاحقًا تعرفًا أفضل.",
          en: "It may seem natural to use assignment to change a character in a string:\ngreeting = 'Hello, world!'\ngreeting[0] = 'J'\nAnd you are stopped by the error message: TypeError: 'str' object does not support item assignment. The “object” here is the string and the “item” is the character you tried to assign. Strings are immutable: you can never change an existing string no matter what you do — this is the object (object) concept Python speaks in, which we will meet properly later.",
        },
        {
          ar: "الحل ليست التعديل بل الإنشاء: بناء سلسلة جديدة تمثّل التغيير على الأصلية:\ngreeting = 'Hello, world!'\nnew_greeting = 'J' + greeting[1:]\nprint(new_greeting)\nفي هذا المثال أُضيف محرف جديد إلى جزء من السلسلة greeting من دون تعديل الأصلية — والنتيجة Jello, world! بينما greeting بقيت كما هي. اجمع ما تعرفه: تسلسل + من الفصل الثاني وشريحة [1:] من هذا الدرس — هكذا «تعدّل» السلاسل في بايثون فعلًا.",
          en: "The solution is not mutation but creation: build a new string that represents the change on the original:\ngreeting = 'Hello, world!'\nnew_greeting = 'J' + greeting[1:]\nprint(new_greeting)\nIn this example a new character was glued onto part of the string greeting without touching the original — the result is Jello, world! while greeting stays exactly as it was. Combine what you know: the + concatenation from chapter 2 and the [1:] slice from this lesson — that is how strings are truly “edited” in Python.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'لا تعديل — بل سلسلة جديدة', en: 'No mutation — a new string instead' },
      code: "greeting = 'Hello, world!'\nprint(greeting[0:5])\nnew_greeting = 'J' + greeting[1:]\nprint(new_greeting)\nprint(greeting)",
      explanation: {
        ar: 'السطر الأول اقتطع Hello من الأصل. ثم بنينا new_greeting بربط J بالشريحة [1:] — كل ما بعد الفهرس 0 — فظهرت Jello, world!. والسطر الأخير هو الدرس الحقيقي: greeting ما زالت Hello, world! بلا تغيير. لم نعدّل الكائن القديم؛ أنشأنا كائنًا جديدًا — والقديم باقٍ بأمان لأي متغيّر آخر يشير إليه.',
        en: 'The first line cut Hello from the original. Then we built new_greeting by gluing J onto the [1:] slice — everything after index 0 — producing Jello, world!. And the last line is the real lesson: greeting is still Hello, world!, untouched. We did not mutate the old object; we created a new one — and the old one stays safely available to any other variable pointing at it.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.slice-banana',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "السلسلة word = 'banana' معطاة. استخرج بالتجزئة أول ثلاثة محارف في متغيّر first، وبقية السلسلة من الفهرس 3 إلى النهاية في متغيّر rest، ثم اطبع first وrest. المتوقع: ban ثم ana.",
        en: "The string word = 'banana' is given. Extract by slicing the first three characters into first, and the rest of the string from index 3 to the end into rest, then print first and rest. Expected: ban then ana.",
      },
      starterCode: "word = 'banana'\n# شريحتان: [:3] و[3:] ثم طباعة / two slices: [:3] and [3:], then print\n",
      solution: "word = 'banana'\nfirst = word[:3]\nrest = word[3:]\nprint(first)\nprint(rest)",
      tests: [
        {
          id: 't1',
          name: { ar: 'first يساوي ban', en: 'first equals ban' },
          code: "assert first == 'ban', 'expected: ban | actual: %r' % first",
          expected: 'ban',
        },
        {
          id: 't2',
          name: { ar: 'rest يساوي ana', en: 'rest equals ana' },
          code: "assert rest == 'ana', 'expected: ana | actual: %r' % rest",
          expected: 'ana',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع ban ثم ana', en: 'ban then ana are printed' },
          code: "assert 'ban' in __learner_output__ and 'ana' in __learner_output__, ('expected: ban then ana | actual: %r' % __learner_output__)",
          expected: 'ban\nana',
        },
      ],
      hints: [
        { ar: 'حذف الفهرس الأول يعني من البداية: [:3].', en: 'Omitting the first index means from the start: [:3].' },
        { ar: 'حذف الفهرس الثاني يعني حتى النهاية: [3:].', en: 'Omitting the second index means to the end: [3:].' },
        { ar: 'الهيكل:\nfirst = word[:3]\nrest = word[3:]\nprint(first)\nprint(rest)', en: 'The skeleton:\nfirst = word[:3]\nrest = word[3:]\nprint(first)\nprint(rest)' },
        { ar: "word = 'banana'\nfirst = word[:3]\nrest = word[3:]\nprint(first)\nprint(rest)", en: "word = 'banana'\nfirst = word[:3]\nrest = word[3:]\nprint(first)\nprint(rest)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-slice',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "s = 'abcdef'\nprint(s[1:4])\nprint(s[2:])",
      solution: 'bcd\ncdef',
      answer: 'bcd\ncdef',
      hints: [
        { ar: '[1:4] تشمل 1 وتستثني 4: المحارف 1 و2 و3.', en: '[1:4] includes 1 and excludes 4: characters 1, 2, and 3.' },
        { ar: 'الشريحة [2:] بلا نهاية تستمر إلى آخر السلسلة.', en: 'The slice [2:] with no end runs to the last character.' },
        { ar: 'المحارف مرقّمة a=0 وb=1 وc=2 وهكذا.', en: 'The characters are numbered a=0, b=1, c=2, and so on.' },
        { ar: 'الخرْج:\nbcd\ncdef', en: 'The output:\nbcd\ncdef' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-empty-slice',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "بعد fruit = 'banana' — ماذا تعيد fruit[3:3]؟",
        en: "After fruit = 'banana' — what does fruit[3:3] return?",
      },
      options: [
        { id: 'a', text: { ar: "سلسلة نصية فارغة '' — طولها صفر لكنها سلسلة", en: "An empty string '' — length zero but still a string" } },
        { id: 'b', text: { ar: "المحرف 'a'", en: "The character 'a'" } },
        { id: 'c', text: { ar: 'IndexError: string index out of range', en: 'IndexError: string index out of range' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'كلا الفهرسين متساويان — فكم محرفًا يقع بينهما؟', en: 'Both indices are equal — how many characters lie between them?' },
        { ar: 'التجزئة لا ترمي خطأ أبدًا مهما كان النطاق.', en: 'Slicing never throws an error, whatever the range.' },
        { ar: 'السلسلة الفارغة نصية حقيقية — قِسها بـ len.', en: 'The empty string is a real string — measure it with len.' },
        { ar: "الجواب: أ — الناتج '' سلسلة فارغة، والتجزئة لا تفحص مجالها بصرامة كالفهرسة.", en: "Answer: a — the result '' is an empty string, and slicing never polices its range the way indexing does." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-immutable',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'املأ الفراغ: لا يمكن تغيير محرف سلسلة نصية في مكانه، لأن السلاسل النصية غير قابلة لل____.',
        en: 'Fill in the blank: you cannot change a string character in place, because strings are im____ (immutable).',
      },
      solution: 'التعديل',
      answer: 'التعديل',
      hints: [
        { ar: 'المصطلح في الكتاب: «السلاسل النصية غير قابلة للتعديل».', en: 'The book’s term: strings are immutable (not modifiable).' },
        { ar: 'اسم مصدر الفعل «عدّل».', en: 'The noun form of the verb “modify”.' },
        { ar: 'خطأ إسناد المحرف كان TypeError وليس IndexError — لأن التعديل ممنوع أصلًا.', en: 'Assigning a character raised TypeError, not IndexError — because mutation is forbidden in the first place.' },
        { ar: 'الجواب: التعديل', en: 'Answer: modification (immutable = not modifiable)' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — مقصّ التجزئة وقانون الثبات\n# Your playground — the slicing scissors and the law of immutability\n\nfruit = 'banana'\nprint(fruit[:])\nprint(fruit[2:5])\nprint(fruit[3:3])\nprint(len(fruit[3:3]))\nprint(fruit[4:2])\n\nname = 'pypath'\nshout = name.upper().upper()\nprint(name)\nprint(shout)",
      prompt: {
        ar: 'جرّب بنفسك: fruit[:] تعيد السلسلة كلها (سؤال التمرين الثاني في الكتاب!)، وfruit[4:2] نطاق معكوس يعطي فراغًا بصمت. ثم جرّب كسر القانون: fruit[0] = \'B\' وراقب TypeError، ثم أصلحه بسلسلة جديدة. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: fruit[:] returns the whole string (the book’s second exercise!), and fruit[4:2] is a reversed range that silently gives emptiness. Then try breaking the law: fruit[0] = 'B' and watch the TypeError, then fix it with a new string. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الذي تشمله الشريحة s[n:m] وما الذي تستثنيه؟',
            en: 'What does the slice s[n:m] include and what does it exclude?',
          },
          options: [
            { id: 'a', text: { ar: 'تشمل الفهرس n وتستثني الفهرس m', en: 'It includes index n and excludes index m' } },
            { id: 'b', text: { ar: 'تشمل m وتستثني n', en: 'It includes m and excludes n' } },
            { id: 'c', text: { ar: 'تشمل الطرفين معًا', en: 'It includes both ends' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الشريحة تعيد المحارف من n حتى ما قبل m — وهذا ما يجعل طول s[n:m] يساوي m-n بالضبط، وقسّم السلسلة بـ [:3] و[3:] يعطي نصفين بلا حرف فائض ولا ناقص.',
            en: 'The slice returns characters from n up to just before m — which is why len(s[n:m]) is exactly m-n, and splitting a string with [:3] and [3:] yields two halves with no character duplicated or lost.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كم تعيد len(fruit[3:3]) عندما fruit = \'banana\'؟',
            en: "What does len(fruit[3:3]) return when fruit = 'banana'?",
          },
          options: [
            { id: 'a', text: { ar: '0 — الشريحة فارغة', en: '0 — the slice is empty' } },
            { id: 'b', text: { ar: '1', en: '1' } },
            { id: 'c', text: { ar: 'ترمي IndexError', en: 'It throws IndexError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'النطاق الفارغ يعطي سلسلة فارغة طولها صفر — والسلسلة الفارغة قيمة مشروعة تمامًا: لا خطأ ولا استثناء.',
            en: 'An empty range gives an empty string of length zero — and the empty string is a perfectly legal value: no error, no exception.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "ومن الفصل الثاني: في new_greeting = 'J' + greeting[1:] — ماذا يفعل العامل + هنا؟",
            en: "And from chapter 2: in new_greeting = 'J' + greeting[1:] — what does the + operator do here?",
          },
          options: [
            { id: 'a', text: { ar: 'يربط السلسلتين في سلسلة جديدة (تسلسل)', en: 'It glues the two strings into a new one (concatenation)' } },
            { id: 'b', text: { ar: 'يجمع قيمتهما كأعداد', en: 'It adds their values as numbers' } },
            { id: 'c', text: { ar: 'يستبدل أول محرف في greeting', en: 'It replaces the first character in greeting' } },
          ],
          answer: 'a',
          explanation: {
            ar: '+ على السلاسل تسلسل ينتج سلسلة جديدة لا يمس الأصلين — وهو النصف الأول من أسلوب «التعديل» المسموح مع الشريحة.',
            en: '+ on strings is concatenation producing a new string that touches neither original — the first half of the permitted “edit” technique alongside slicing.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثالث: إلى أي عائلة أخطاء ينتمي الخطأ الذي يرميه greeting[0] = \'J\'؟',
            en: "And from chapter 3: which error family does greeting[0] = 'J' belong to?",
          },
          options: [
            { id: 'a', text: { ar: 'TypeError — خطأ نوع: إسناد عنصر غير مدعوم للسلاسل', en: 'TypeError — a type error: item assignment is unsupported for strings' } },
            { id: 'b', text: { ar: 'IndexError — خطأ فهرسة', en: 'IndexError — an indexing error' } },
            { id: 'c', text: { ar: 'SyntaxError — خطأ قواعدي', en: 'SyntaxError — a syntax error' } },
          ],
          answer: 'a',
          explanation: {
            ar: "الرسالة نفسها TypeError: 'str' object does not support item assignment — القواعد سليمة والفهرس موجود، لكن نوع الكائن يرفض العملية أصلًا.",
            en: "The message itself says TypeError: 'str' object does not support item assignment — the syntax is fine and the index exists, but the object’s type refuses the operation outright.",
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "s = 'abcdef'\nprint(s[1:4])  # أتوقع bcde",
          right: "s = 'abcdef'\nprint(s[1:4])  # الناتج bcd",
          note: {
            ar: 'أشهر سوء فهم في التجزئة: الفهرس الثاني مستثنى — [1:4] تعطي ثلاثة محارف (1 و2 و3) لا أربعة. لو أردت bcde فاطلب [1:5].',
            en: 'Slicing’s most common misunderstanding: the second index is excluded — [1:4] gives three characters (1, 2, 3), not four. For bcde ask [1:5].',
          },
        },
        {
          wrong: "greeting = 'Hello, world!'\ngreeting[0] = 'J'",
          right: "greeting = 'Hello, world!'\nnew_greeting = 'J' + greeting[1:]",
          note: {
            ar: 'إسناد المحرف يرمي TypeError لأن السلاسل غير قابلة للتعديل. البديل: ابنِ سلسلة جديدة بالتسلسل والتجزئة — والأصل يبقى سالمًا.',
            en: 'Character assignment throws TypeError because strings are immutable. The alternative: build a new string with concatenation and slicing — and the original stays intact.',
          },
        },
        {
          wrong: "fruit = 'banana'\npart = fruit[4:2]  # أنتظر أيضًا؟",
          right: "fruit = 'banana'\npart = fruit[2:4]",
          note: {
            ar: 'الفهرس الأول أكبر من الثاني فالنطاق فارغ — تحصل على \'\' بصمت ولا يظهر أي خطأ يحذّرك. افحص شريحتك بطباعة len(part) عند الشك.',
            en: 'The first index exceeds the second so the range is empty — you get \'\' silently with no warning whatsoever. Check your slice by printing len(part) when in doubt.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الشريحة [n:m] تعيد المحارف من n حتى ما قبل m — تشمل البداية وتستثني النهاية، وطولها m-n بالضبط.', en: 'The slice [n:m] returns characters from n up to just before m — including the start, excluding the end, with length exactly m-n.' },
        { ar: 'حذف الفهرس الأول يعني من البداية وحذف الثاني يعني حتى النهاية؛ والنطاق المعكوس أو المتساوي يعطي سلسلة فارغة \'\' بلا أي خطأ.', en: 'Omitting the first index means from the start and omitting the second means to the end; an equal or reversed range gives the empty string \'\' with no error at all.' },
        { ar: 'السلاسل غير قابلة للتعديل: إسناد محرف يرمي TypeError — والطريق الوحيد للتغيير هو بناء سلسلة جديدة بالتسلسل + والتجزئة.', en: 'Strings are immutable: assigning a character throws TypeError — the only road to change is building a new string with + concatenation and slicing.' },
      ],
      reflectPrompt: {
        ar: 'بريد إلكتروني مثل ahmed@example.com: لو عرفت موقع @، كيف تقتطع اسم المستخدم والنطاق بشريحتين؟ اكتب الشريحتين على ورقة قبل الدرس القادم.',
        en: 'An email like ahmed@example.com: if you knew the position of @, which two slices would cut out the username and the domain? Write both slices on paper before the next lesson.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch6.s4', pages: 'ص89 / pp.89' },
        { book: 'PY4E', section: 'py4e.ch6.s5', pages: 'ص90 / pp.90' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch6.s4', pages: 'ص89 / pp.89' },
    { book: 'PY4E', section: 'py4e.ch6.s5', pages: 'ص90 / pp.90' },
  ],
} satisfies Lesson;

export default lesson;
