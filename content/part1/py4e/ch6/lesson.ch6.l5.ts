import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch6.l5 — "String Methods and Parsing / توابع السلاسل وتحليلها"
 * Aligned with PY4E ch6 s9 (توابع السلاسل النصية), s10 (تحليل السلاسل النصية).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch6.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 6,
  title: { ar: 'توابع السلاسل وتحليلها', en: 'String Methods and Parsing' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch6.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'السلسلة النصية ليست نصًّا خامًا فقط — إنها كائن يحمل معه صندوق أدوات كامل: توابع تجعله أحرفًا كبيرة، تبحث داخله، وتنظف حوافه. ومع التجزئة من الدرس الماضي يصبح لديك سلاح التحليل (parsing): اقتطاع ما تريد من أي سطر مهما كان مزدحمًا — مثل استخراج النطاق من بريد إلكتروني داخل سجل طويل. بنهاية الدرس ستكون قادرًا على: استدعاء توابع السلاسل بعامل النقطة، واستخدام find وstrip وstartswith وlower، وتحليل سطر بريد بوصفة find ثم تجزئة.',
        en: 'A string is not just raw text — it is an object carrying a full toolbox: methods that capitalize it, search inside it, and clean its edges. Combined with last lesson’s slicing you now own the parsing weapon: cut what you want from any line however crowded — like extracting the domain from an email inside a long log. By the end of this lesson you will be able to: call string methods with the dot operator, use find, strip, startswith and lower, and parse an email line with the find-then-slice recipe.',
      },
    },
    {
      kind: 'predict',
      code: "word = 'banana'\nprint(word.upper())",
      question: {
        ar: 'ماذا سيطبع؟ وهل تغيّرت قيمة word نفسها بعد هذه التعليمة؟',
        en: 'What does it print? And has the value of word itself changed after this statement?',
      },
      reveal: {
        ar: 'سيطبع BANANA — وword بقيت banana. التابع يعيد نسخة جديدة بأحرف كبيرة ولا يمس الأصل، تذكيرًا بثبات السلاسل من الدرس الماضي. ولهذا لو أردت الاحتفاظ بالنسخة فسندها إلى متغيّر.',
        en: 'It prints BANANA — and word stays banana. The method returns a fresh capitalized copy without touching the original, echoing last lesson’s immutability. That is why, to keep the copy, you assign it to a variable.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'السلاسل كائنات، والتوابع بعامل النقطة', en: 'Strings as objects, methods with the dot' },
      chunks: [
        {
          ar: "السلاسل النصية إحدى أمثلة الكائنات (objects) في بايثون: الكائن يتضمن البيانات (السلسلة بحد ذاتها) وتوابع الصنف (methods) — وهي توابع مبنية ضمن الكائن ومتاحة لأي نسخة منه. يُظهر التابع type نوع الكائن — type('Hello world') تعطي <class 'str'> — ويُظهر dir قائمة التوابع المتاحة للكائن: capitalize وfind وlower وstrip وغيرها العشرات. استدعاء تابع الصنف يشابه استدعاء التابع العادي: كلاهما يأخذ وسائط ويعيد قيمة، لكن القواعد مختلفة: نستدعي تابع الصنف بإلحاق اسمه باسم المتغيّر بعامل النقطة — بدل upper(word) نكتب word.upper().",
          en: "Strings are one example of objects in Python: an object contains the data (the string itself) and class methods (methods) — functions built into the object and available to any copy of it. type shows the object’s type — type('Hello world') gives <class 'str'> — and dir lists the methods available on it: capitalize, find, lower, strip, and dozens more. Calling a class method resembles calling an ordinary function: both take arguments and return a value, but the syntax differs: we call the method by appending its name to the variable with the dot operator — instead of upper(word) we write word.upper().",
        },
        {
          ar: "مثال: التابع upper يعيد نسخة من السلسلة بأحرف كبيرة:\nword = 'banana'\nnew_word = word.upper()\nprint(new_word) تعطي BANANA\nعامل النقطة يحدد اسم التابع upper واسم السلسلة التي سيتعامل معها word. ويشير وجود الأقواس الفارغة إلى أن التابع لا يأخذ وسائط. ويُدعى استخدام التابع بالاستدعاء — نقول: استدعينا upper على السلسلة word.",
          en: "Example: the upper method returns a copy of the string in capitals:\nword = 'banana'\nnew_word = word.upper()\nprint(new_word) gives BANANA\nThe dot operator names the method upper and the string it will work on, word. Empty parentheses mean the method takes no arguments. Using a method is called invoking it — we say: we invoked upper on the string word.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'صندوق الأدوات: find وstrip وstartswith وlower', en: 'The toolbox: find, strip, startswith, lower' },
      chunks: [
        {
          ar: "التابع find يبحث عن موقع سلسلة فرعية داخل سلسلة ويعيد فهرسها:\nword = 'banana'\nword.find('a') تعطي 1 (أول ظهور)\nword.find('na') تعطي 2\nوقد يأخذ وسيطًا ثانيًا يحدد الفهرس الذي يبدأ عنده البحث: word.find('na', 3) تعطي 4. والتابع strip يزيل المسافات البيضاء (المسافات الفارغة والإزاحة بالتاب ومحارف السطر الجديد) من بداية السلسلة ونهايتها: '     Here we go     '.strip() تعطي 'Here we go'.",
          en: "The find method searches for the position of a substring inside a string and returns its index:\nword = 'banana'\nword.find('a') gives 1 (first occurrence)\nword.find('na') gives 2\nIt may take a second argument specifying the index where the search starts: word.find('na', 3) gives 4. The strip method removes whitespace (spaces, tab indentation, newline characters) from the beginning and end of a string: '     Here we go     '.strip() gives 'Here we go'.",
        },
        {
          ar: "وتعيد بعض التوابع قيمًا منطقية مثل startswith: 'Have a nice day'.startswith('Have') تعطي True بينما startswith('h') تعطي False — لأن المطابقة حساسة لحالة الحروف. لذلك من الأحسن تحويل السلسلة إلى أحرف صغيرة بـ lower قبل أي مطابقة، ويمكن سلسلة الاستدعاءات في تعبير واحد مع مراعاة الترتيب: line.lower().startswith('h') تعطي True — يُستدعى lower أولًا فتُحوَّل السلسلة، ثم يفحص startswith نتيجتها من اليسار إلى اليمين.",
          en: "Some methods return logical values, like startswith: 'Have a nice day'.startswith('Have') gives True while startswith('h') gives False — because matching is case-sensitive. So it is better to convert the string to lowercase with lower before any matching, and calls can be chained in one expression while respecting order: line.lower().startswith('h') gives True — lower is invoked first, transforming the string, then startswith inspects that result from left to right.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تحليل السلاسل: find ثم تجزئة', en: 'Parsing: find, then slice' },
      chunks: [
        {
          ar: "قد نحتاج إلى استخراج جزء من سطر مزدحم. مثال الكتاب: السطر\nFrom stephen.marquard@uct.ac.za Sat Jan 5 09:14:16 2008\nونريد النصف الثاني من عنوان البريد، أي uct.ac.za. الطريقة: نبحث أولًا عن موقع علامة @ في السلسلة، ثم نحدد موقع أول مسافة بعدها، ثم نجزئ السلسلة بين الموقعين. هذا النمط يسمى تحليل السلاسل (parsing) — find يعطيك الإحداثيات والتجزئة تقتطع الشريحة.",
          en: "Sometimes we need to extract a piece from a crowded line. The book’s example: the line\nFrom stephen.marquard@uct.ac.za Sat Jan 5 09:14:16 2008\nand we want the second half of the email address, that is uct.ac.za. The approach: first search for the position of the @ sign in the string, then locate the first space after it, then slice the string between the two positions. This pattern is called parsing — find hands you the coordinates and slicing cuts out the piece.",
        },
        {
          ar: "وانتبه لسلوك find الهادئ: إذا لم يجد ما يبحث عنه فإنه يعيد -1 — لا يرمي خطأ. لو جزّأت وثقة بلا فحص فقد تحصل على شريحة غريبة بصمت. لذلك في البرامج الحقيقية افحص نتيجة find قبل استخدامها كإحداثية — إذا كان atpos == -1 فالسطر لا يحوي @ أصلا.",
          en: "And heed find’s quiet behavior: when it finds nothing it returns -1 — it throws no error. Slice confidently without checking and you may silently harvest a strange fragment. So in real programs inspect find’s result before using it as a coordinate — if atpos == -1 the line holds no @ in the first place.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'استخراج النطاق من سجل بريد', en: 'Extracting the domain from a mail log' },
      code: "data = 'From stephen.marquard@uct.ac.za Sat Jan 5 09:14:16 2008'\natpos = data.find('@')\nprint(atpos)\nsppos = data.find(' ', atpos)\nprint(sppos)\nhost = data[atpos + 1:sppos]\nprint(host)",
      explanation: {
        ar: 'ثلاث خطوات كما في الكتاب: find(\'@\') أعطى 21 موقع العلامة، ثم find(\' \', 21) بحث من بعد 21 فأعطى 31 موقع أول مسافة بعدها، ثم الشريحة [22:31] اقتطعت ما بينهما: uct.ac.za. لاحظ atpos + 1: نريد ما بعد @ لا العلامة نفسها — نفس القاعدة التي تعلمتها مع الفهارس. هذه الوصفة الثلاثية (find، find، slice) تعمل على أي سطر بنيته معلوم مهما بلغ طوله.',
        en: 'Three steps as in the book: find(\'@\') gave 21, the position of the sign; then find(\' \', 21) searched from position 21 onward and gave 31, the first space after it; then the slice [22:31] cut what lies between: uct.ac.za. Note atpos + 1: we want what follows @, not the sign itself — the same rule you learned with indices. This triple recipe (find, find, slice) works on any line of known structure, however long.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.find-positions',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "السلسلة word = 'banana' معطاة. اطبع نتيجة word.find('na') ثم نتيجة word.find('na', 3). المتوقع: 2 ثم 4.",
        en: "The string word = 'banana' is given. Print the result of word.find('na') then of word.find('na', 3). Expected: 2 then 4.",
      },
      starterCode: "word = 'banana'\n# طباعتان بتابع find / two prints with the find method\n",
      solution: "word = 'banana'\nprint(word.find('na'))\nprint(word.find('na', 3))",
      tests: [
        {
          id: 't1',
          name: { ar: 'يُطبع 2', en: '2 is printed' },
          code: "assert '2' in __learner_output__, ('expected: 2 | actual: %r' % __learner_output__)",
          expected: '2\n4',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع 4', en: '4 is printed' },
          code: "assert '4' in __learner_output__, ('expected: 4 | actual: %r' % __learner_output__)",
          expected: '2\n4',
        },
      ],
      hints: [
        { ar: "find('na') يعيد فهرس أول ظهور للسلسلة الفرعية كاملة.", en: "find('na') returns the index of the substring’s first full occurrence." },
        { ar: "الوسيط الثاني يحدد من أين يبدأ البحث: find('na', 3) يتجاهل ما قبل الفهرس 3.", en: "The second argument sets where the search starts: find('na', 3) ignores everything before index 3." },
        { ar: "الهيكل:\nprint(word.find('na'))\nprint(word.find('na', 3))", en: "The skeleton:\nprint(word.find('na'))\nprint(word.find('na', 3))" },
        { ar: "word = 'banana'\nprint(word.find('na'))\nprint(word.find('na', 3))", en: "word = 'banana'\nprint(word.find('na'))\nprint(word.find('na', 3))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-startswith',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط دون تشغيله.',
        en: 'Read the code and predict its exact output without running it.',
      },
      code: "line = 'Have a nice day'\nprint(line.startswith('Have'))\nprint(line.startswith('h'))",
      solution: 'True\nFalse',
      answer: 'True\nFalse',
      hints: [
        { ar: 'السطر يبدأ فعلًا بـ Have.', en: 'The line truly starts with Have.' },
        { ar: 'لكن h الصغيرة ليست H الكبيرة — المطابقة حساسة للحالة.', en: 'But lowercase h is not capital H — matching is case-sensitive.' },
        { ar: 'التابع يعيد قيمة منطقية فقط: نعم أو لا.', en: 'The method returns only a logical value: yes or no.' },
        { ar: 'الخرْج:\nTrue\nFalse', en: 'The output:\nTrue\nFalse' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-upper-copy',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "نفّذت word = 'banana' ثم word.upper() ثم print(word). ماذا يطبع السطر الأخير؟",
        en: "You ran word = 'banana', then word.upper(), then print(word). What does the last line print?",
      },
      options: [
        { id: 'a', text: { ar: 'banana — التابع يعيد نسخة جديدة ولا يعدّل الأصل', en: 'banana — the method returns a new copy and never mutates the original' } },
        { id: 'b', text: { ar: 'BANANA — التابع عدّل word في مكانها', en: 'BANANA — the method modified word in place' } },
        { id: 'c', text: { ar: 'يرمي TypeError لأن word ثابتة', en: 'It throws TypeError because word is immutable' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر قانون الثبات من درس التجزئة: التوابع لا تعدّل الأصل.', en: 'Recall the immutability law from the slicing lesson: methods never mutate the original.' },
        { ar: 'upper يعيد نسخة جديدة — ومن لا يسند النسخة يفقدها.', en: 'upper returns a fresh copy — whoever does not assign it loses it.' },
        { ar: 'استدعاء بلا سند = نسخة تُهدر في الهواء.', en: 'An unassigned call = a copy discarded into thin air.' },
        { ar: 'الجواب: أ — banana كما كانت تمامًا؛ للاحتفاظ بالنسخة اكتب word = word.upper().', en: 'Answer: a — banana exactly as it was; to keep the copy write word = word.upper().' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-strip',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'املأ الفراغ: التابع الذي يزيل المسافات البيضاء من بداية السلسلة النصية ونهايتها هو ____.',
        en: 'Fill in the blank: the method that removes whitespace from the beginning and end of a string is ____.',
      },
      solution: 'strip',
      answer: 'strip',
      hints: [
        { ar: 'اسمه بالإنجليزية يعني «تقشير» — ينزع الطبقة الخارجية من المسافات.', en: 'Its English name means to peel — it strips the outer layer of whitespace.' },
        { ar: 'يُستدعى بعامل النقطة: line.____()', en: 'It is invoked with the dot: line.____()' },
        { ar: 'ليس lower ولا find — هو التابع الذي نظّف \'  Here we go  \'.', en: 'Not lower nor find — it is the method that cleaned \'  Here we go  \'.' },
        { ar: 'الجواب: strip', en: 'Answer: strip' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — افتح صندوق الأدوات\n# Your playground — open the toolbox\n\nline = '  Have a Nice Day  '\nprint(line.strip())\nprint(line.strip().lower())\nprint(line.strip().lower().startswith('have'))\nprint(line.find('Nice'))\n\nword = 'banana'\nprint(word.count('a'))\nprint(word.replace('a', 'o'))\nprint(word)",
      prompt: {
        ar: 'جرّب بنفسك: اكتب dir(word) وسترى كل توابع السلسلة العشرات، ثم استخدم help(str.count) لقراءة شرح مختصر. وسلسل الاستدعاءات بترتيب مختلف وراقب الأثر، وجرّب find على سلسلة فرعية غير موجودة وراقب -1 الهادئ. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: type dir(word) to see every string method, then help(str.count) for a short explanation. Chain the calls in different orders and watch the effect, and try find on a missing substring to meet the silent -1. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: "في الاستدعاء word.upper() — ما الذي يحدده عامل النقطة؟",
            en: "In the call word.upper() — what does the dot operator determine?",
          },
          options: [
            { id: 'a', text: { ar: 'اسم التابع والسلسلة التي سيعمل عليها', en: 'The method’s name and the string it will work on' } },
            { id: 'b', text: { ar: 'أولوية التنفيذ بين التعبيرين', en: 'Evaluation priority between the two expressions' } },
            { id: 'c', text: { ar: 'نوع القيمة المعادة', en: 'The type of the returned value' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'النقطة تربط التابع بالكائن صاحبه: ما قبل النقطة هو من يُستدعى عليه التابع وما بعدها اسمه — فبدل upper(word) نقول word.upper().',
            en: 'The dot binds the method to its object: before the dot is who the method runs on, after it is the method’s name — instead of upper(word) we say word.upper().',
          },
        },
        {
          id: 'q2',
          question: {
            ar: "ماذا يعيد word.find('x') عندما لا يحوي word الحرف x؟",
            en: "What does word.find('x') return when word holds no x?",
          },
          options: [
            { id: 'a', text: { ar: '-1 — بصمت ودون أي خطأ', en: '-1 — silently, with no error' } },
            { id: 'b', text: { ar: '0', en: '0' } },
            { id: 'c', text: { ar: 'يرمي IndexError', en: 'It throws IndexError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'find يعيد -1 حين يفشل البحث — قيمة مميزة يجب فحصها قبل استخدامها كإحداثية تجزئة، وإلا حصلت على شرائح غريبة بصمت.',
            en: 'find returns -1 when the search fails — a sentinel you must check before using it as a slice coordinate, or you will quietly harvest odd fragments.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الرابع: استدعاء تابع الصنف word.upper() يشابه استدعاء التابع العادي upper(word) في أي شيء؟',
            en: 'And from chapter 4: how does the method call word.upper() resemble the ordinary function call upper(word)?',
          },
          options: [
            { id: 'a', text: { ar: 'كلاهما يأخذ وسائط ويعيد قيمة — والفرق في قواعد الكتابة فقط', en: 'Both take arguments and return a value — only the syntax differs' } },
            { id: 'b', text: { ar: 'كلاهما يعدّل المتغيّر مباشرة', en: 'Both mutate the variable directly' } },
            { id: 'c', text: { ar: 'لا شبه — التابع الصنف لا يعيد قيمة', en: 'No resemblance — a class method returns nothing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا ما قاله الكتاب حرفيًا: الاستدعاءان متشابهان — وسائط وقيمة معادة — لكن قواعد الكتابة مختلفة: النقطة بدل الوسيط الأول.',
            en: 'This is what the book says verbatim: the two calls are alike — arguments and a returned value — but the syntax differs: the dot instead of a first argument.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: "في التعبير line.lower().startswith('h') — لماذا يُستدعى lower قبل startswith؟",
            en: "In the expression line.lower().startswith('h') — why is lower invoked before startswith?",
          },
          options: [
            { id: 'a', text: { ar: 'لأن الاستدعاءات تتسلسل من اليسار: نتيجة lower هي التي يفحصها startswith', en: 'Because calls chain left to right: lower’s result is what startswith inspects' } },
            { id: 'b', text: { ar: 'لأن بايثون تنفذ آخر تابع أولًا دائمًا', en: 'Because Python always executes the last method first' } },
            { id: 'c', text: { ar: 'لا فرق في الترتيب أبدًا', en: 'The order never matters' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الترتيب جوهر السلسلة: lower أولًا يوحّد الحالة، ثم يفحص startswith السلسلة الناتجة — بالعكس سيفحص النص الأصلي بحروفه المختلطة ويخطئ.',
            en: 'Order is the essence of the chain: lower first normalizes case, then startswith inspects the transformed string — reversed, it would inspect the original mixed-case text and err.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "word = 'banana'\nword.upper()\nprint(word)  # أتوقع BANANA",
          right: "word = 'banana'\nword = word.upper()\nprint(word)",
          note: {
            ar: 'استدعاء بلا سند يهدر النسخة الجديدة وword تبقى banana — الثبات يمنع التعديل في المكان. اسند الناتج إلى المتغيّر نفسه أو إلى غيره.',
            en: 'An unassigned call discards the fresh copy and word remains banana — immutability forbids in-place mutation. Assign the result to the same variable or another.',
          },
        },
        {
          wrong: "atpos = data.find('@')\nhost = data[atpos + 1:]  # ولا فحص؟",
          right: "atpos = data.find('@')\nif atpos == -1:\n    print('no @ found')\nelse:\n    host = data[atpos + 1:]",
          note: {
            ar: 'find يعيد -1 عند الفشل ولا يرمي خطأ — فتجزئة بعده بصمت تعطي شرائح غابرة من نهاية السلسلة. افحص -1 قبل الاستخدام.',
            en: 'find returns -1 on failure without throwing — slicing right after it silently yields far-fetched fragments from the string’s end. Check for -1 before using it.',
          },
        },
        {
          wrong: "line = 'Have a nice day'\nprint(line.startswith('h'))  # True؟",
          right: "line = 'Have a nice day'\nprint(line.lower().startswith('h'))",
          note: {
            ar: "startswith حساسة للحالة: h الصغيرة لا تطابق H الكبيرة فتعطي False. وحّد الحالة بـ lower قبل المطابقة — كما نصح الكتاب.",
            en: "startswith is case-sensitive: lowercase h does not match capital H and it gives False. Normalize case with lower before matching — as the book advises.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'السلاسل كائنات تحمل توابع صنفها: تُستدعى بعامل النقطة — word.upper() بدل upper(word) — والأقواس الفارغة تعني بلا وسائط.', en: 'Strings are objects carrying their class’s methods: invoked with the dot — word.upper() instead of upper(word) — and empty parentheses mean no arguments.' },
        { ar: 'find يعيد فهرس أول ظهور (مع وسيط بداية اختياري) و-1 عند الفشل؛ strip ينظف الطرفين؛ startswith يعيد قيمة منطقية؛ وlower يوحّد الحالة قبل المطابقة.', en: 'find returns the first occurrence’s index (with an optional start argument) and -1 on failure; strip cleans both ends; startswith returns a logical value; lower normalizes case before matching.' },
        { ar: 'التحليل (parsing) = find للإحداثيات ثم التجزئة للاقتطاع: موقع @ ثم أول مسافة بعده ثم شريحة بينهما — واستدعاءات يمكن سلسلتها من اليسار إلى اليمين.', en: 'Parsing = find for coordinates then slicing to cut: the position of @, the first space after it, then the slice between — and calls can be chained left to right.' },
      ],
      reflectPrompt: {
        ar: 'سجل آخر ظهر لك اليوم فيه طابع زمني وعنوان: ما التابعان من درسك اللذان يستخرجان العنوان منه؟ حاول كتابة الوصفة الثلاثية على سطر حقيقي من حياتك.',
        en: 'Think of a log you saw today with a timestamp and an address: which two methods from this lesson extract the address? Try writing the triple recipe on a real line from your life.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch6.s9', pages: 'ص92 / pp.92' },
        { book: 'PY4E', section: 'py4e.ch6.s10', pages: 'ص95 / pp.95' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch6.s9', pages: 'ص92 / pp.92' },
    { book: 'PY4E', section: 'py4e.ch6.s10', pages: 'ص95 / pp.95' },
  ],
} satisfies Lesson;

export default lesson;
