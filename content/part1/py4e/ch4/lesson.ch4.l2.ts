import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch4.l2 — "Type Conversion and Math Functions / توابع تحويل النوع والتوابع الرياضية"
 * Aligned with PY4E ch4 s3 (توابع تحويل النوع), s4 (التوابع الرياضية).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch4.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 4,
  title: { ar: 'توابع تحويل النوع والتوابع الرياضية', en: 'Type Conversion and Math Functions' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch4.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الأعداد في بايثون تلبس أزياء: النص "32" يشبه العدد لكنه نص، والعدد 3.99999 يخفي عددًا صحيحًا في جوفه. توابع التحويل هي غرفة الملابس. وبعدها صندوق أدوات مدفون تحت الأرض: الوحدة الرياضية — كنز من الدوال لا يُفتح إلا بمفتاح اسمه import.',
        en: 'Numbers in Python wear costumes: the text "32" looks like a number but is text, and the float 3.99999 hides an integer inside. Type conversion functions are the wardrobe. And after that, a toolbox buried underground: the math module — a treasure chest of functions that opens only with a key named import.',
      },
    },
    {
      kind: 'predict',
      code: 'print(int(3.99999))\nprint(int(-2.3))',
      question: {
        ar: 'هل تُقرِّب int العدد إلى أقرب عدد صحيح، أم تفعل شيئًا آخر؟ توقّع السطرين.',
        en: 'Does int round to the nearest integer, or does it do something else? Predict both lines.',
      },
      reveal: {
        ar: 'يُطبع 3 ثم -2: التابع int لا يُقرِّب أبدًا — يكتفي بإلغاء القسم العشري. 3.99999 ليست 4 مهما اقتربت، والسالب يُقتطع نحو الصفر: -2.3 تصبح -2 لا -3. الاقتطاع والتقريب شيئان مختلفان تمامًا.',
        en: 'It prints 3 then -2: int never rounds — it simply cancels the decimal part. 3.99999 is not 4 no matter how close, and negatives truncate toward zero: -2.3 becomes -2, not -3. Truncating and rounding are entirely different things.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'غرفة الملابس: int وfloat وstr', en: 'The wardrobe: int, float and str' },
      chunks: [
        {
          ar: "تقدّم بايثون توابع جاهزة تحوّل القيم من نوع لآخر. int يأخذ أي قيمة ويحوّلها إلى عدد صحيح إن أمكن: int('32') تعطي 32، أما int('Hello') فترفض برسالة ValueError: invalid literal for int(). ويستطيع int تحويل الأعداد العشرية إلى صحيحة — لكنه لا يُقرِّب: int(3.99999) تعطي 3، وint(-2.3) تعطي -2.",
          en: "Python provides built-in functions that convert values from one type to another. int takes any value and converts it to an integer if possible: int('32') gives 32, while int('Hello') refuses with ValueError: invalid literal for int(). int can also convert floats to integers — but it never rounds: int(3.99999) gives 3, and int(-2.3) gives -2.",
        },
        {
          ar: "وانتبه لفخّ دقيق: int('3.14159') ترمي ValueError أيضًا، لأن int يقبل النصوص التي تصف أعدادًا صحيحة فقط — النص به فاصلة ليس من حظّه. لذا المسار الصحيح للنص العشري يمر بـ float أولًا. أما float فيحوّل الأعداد الصحيحة والنصوص الرقمية إلى أعداد ذات فاصلة: float(32) تعطي 32.0 وfloat('3.14159') تعطي 3.14159.",
          en: "Watch a subtle trap: int('3.14159') also throws ValueError, because int only accepts text describing whole numbers — text with a decimal point is not its business, so the right path for decimal text goes through float first. Meanwhile float converts integers and numeric text into floats: float(32) gives 32.0 and float('3.14159') gives 3.14159.",
        },
        {
          ar: "وأخيرًا str يحوّل وسيطه إلى سلسلة نصية: str(32) تعطي '32'، وstr(3.14159) تعطي '3.14159'. مفيدة حين تريد لصق عدد داخل رسالة، أو حين تريد حفظ قيمة كنص. لكن تذكّر درس الفصل الثاني: النص الناتج لا يجمع مع الأعداد — str(32) + 5 انفجار.",
          en: "Finally str converts its argument to a string: str(32) gives '32', and str(3.14159) gives '3.14159'. Useful when you want to glue a number into a message, or store a value as text. But remember chapter 2: the resulting text does not add to numbers — str(32) + 5 explodes.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الوحدة الرياضية والتأشيرة بالنقطة', en: 'The math module and dot notation' },
      chunks: [
        {
          ar: 'تمتلك بايثون وحدة رياضية تحوي معظم التوابع الرياضية المعروفة، وعليك استدعاء الوحدة أولًا: import math. هذه التعليمة تنشئ كائن وحدة يدعى math — وللوصول إلى أحد توابعه تحدد اسم الوحدة واسم التابع مفصولين بنقطة: math.log10 وmath.sin. هذه الصيغة تُدعى تأشيرة النقطة.',
          en: 'Python has a math module holding most of the well-known mathematical functions, and you must import the module first: import math. That statement creates a module object named math — and to reach one of its functions you specify the module name and the function name separated by a dot: math.log10, math.sin. This format is called dot notation.',
        },
        {
          ar: "مثال الكتاب الحقيقي: ratio = signal_power / noise_power ثم decibels = 10 * math.log10(ratio) — حساب الديسيبل لنسبة الإشارة إلى الضجيج. والوحدة تحوي متغيّرات أيضًا: math.pi يعطي π بدقة 15 خانة. والدوال المثلثية مثل math.sin تأخذ الزوايا بالراديان: للتحويل من الدرجات اقسم على 360 واضرب في 2π.",
          en: "The book’s real example: ratio = signal_power / noise_power, then decibels = 10 * math.log10(ratio) — computing decibels for a signal-to-noise ratio. The module holds variables too: math.pi gives π to 15 digits. And trigonometric functions like math.sin take angles in radians: to convert from degrees divide by 360 and multiply by 2π.",
        },
        {
          ar: 'ولربّة تطبيق عملي: الفائدة المركّبة. principal * math.pow(1 + rate, years) يحسب نموّ مالك عبر السنوات — وmath.pow تابع يأخذ وسيطين: الأساس والأسّ. لاحظ أن كل توابع الوحدة مُنتجة: تعيد قيمًا نخزنها في متغيّرات أو نطبعها أو ندمجها في تعابير — وهذا مصطلح درسنا القادم.',
          en: 'And for a practical application: compound interest. principal * math.pow(1 + rate, years) computes how your money grows over the years — math.pow is a function taking two arguments: base and exponent. Notice every math function is fruitful: it returns values we store in variables, print, or fold into expressions — a term that stars in our next lesson.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'من الجذور إلى الفائدة المركّبة', en: 'From square roots to compound interest' },
      code: 'import math\n\nprint(math.sqrt(25))\nprint(math.log10(1000))\nprint(math.pi)\n\nprincipal = 1000\nrate = 0.05\nyears = 10\namount = principal * math.pow(1 + rate, years)\nprint(round(amount, 2))',
      explanation: {
        ar: 'math.sqrt(25) تعطي 5.0 (عائم حتى لو كان الجذر صحيحًا)، وmath.log10(1000) تعطي 3.0 لأن 10³ = 1000، وmath.pi تعطي π. ثم الفائدة المركّبة: ألف بفائدة 5% لعشر سنوات تصبح نحو 1628.89 — وround لفّط النتيجة لعرض نظيف. لاحظ التداخل: استدعاء داخل استدعاء، من الداخل إلى الخارج.',
        en: 'math.sqrt(25) gives 5.0 (a float even for a whole root), math.log10(1000) gives 3.0 because 10³ = 1000, and math.pi gives π. Then compound interest: 1000 at 5% for ten years grows to about 1628.89 — with round wrapping the result for a clean display. Notice the nesting: a call inside a call, innermost first.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.convert-truncate',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المتغيّر value يحمل 7.9. أنشئ whole = int(value) واطبعها، ثم اطبع float(7). المتوقع: 7 ثم 7.0 — انتبه: int لا تُقرِّب.',
        en: 'The variable value holds 7.9. Create whole = int(value) and print it, then print float(7). Expected: 7 then 7.0 — careful: int does not round.',
      },
      starterCode: 'value = 7.9\n# حوّل واطبع / convert and print\n',
      solution: 'value = 7.9\nwhole = int(value)\nprint(whole)\nprint(float(7))',
      tests: [
        {
          id: 't1',
          name: { ar: 'whole تساوي 7 — اقتطاع لا تقريب', en: 'whole equals 7 — truncated, not rounded' },
          code: "assert whole == 7, 'expected: 7 | actual: %r' % whole",
          expected: '7',
        },
        {
          id: 't2',
          name: { ar: 'whole عدد صحيح int', en: 'whole is an int' },
          code: "assert type(whole) == int, 'expected: int | actual: %r' % type(whole).__name__",
          expected: 'int',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع 7.0 — float تضيف الفاصلة', en: '7.0 is printed — float adds the decimal' },
          code: "assert '7.0' in __learner_output__, ('expected: 7.0 | actual: %r' % __learner_output__)",
          expected: '7.0',
        },
      ],
      hints: [
        { ar: 'سطران فقط بعد المتغيّر: whole = int(value) ثم طباعتان.', en: 'Just two lines after the variable: whole = int(value), then two prints.' },
        { ar: 'float(7) تعطي 7.0 — عائم بأجزاء معدومة.', en: 'float(7) gives 7.0 — a float with zero fraction.' },
        { ar: 'الهيكل:\nwhole = int(value)\nprint(whole)\nprint(float(7))', en: 'The skeleton:\nwhole = int(value)\nprint(whole)\nprint(float(7))' },
        { ar: 'value = 7.9\nwhole = int(value)\nprint(whole)\nprint(float(7))', en: 'value = 7.9\nwhole = int(value)\nprint(whole)\nprint(float(7))' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-int-float-text',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "ماذا يحدث عند تنفيذ int('3.14159')؟",
        en: "What happens when int('3.14159') runs?",
      },
      options: [
        { id: 'a', text: { ar: 'تعطي 3 — تقتطع ما بعد الفاصلة', en: 'It gives 3 — chopping after the decimal point' } },
        { id: 'b', text: { ar: 'ترمي ValueError — تقبل نصوص الأعداد الصحيحة فقط', en: 'It throws ValueError — it only accepts whole-number text' } },
        { id: 'c', text: { ar: 'تعطي 3.14159', en: 'It gives 3.14159' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'الاقتطاع يعمل على الأعداد العشرية الحقيقية — أما النصوص فلها قواعد أخرى.', en: 'Truncation applies to real floats — text plays by different rules.' },
        { ar: 'تذكّر رسالة int(\'Hello\'): invalid literal — السؤال أي نص يُقبل أصلًا.', en: "Remember int('Hello')'s invalid literal message — the question is which text is accepted at all." },
        { ar: 'لو أردت 3 من النص العشري: int(float(\'3.14159\')).', en: "To get 3 from decimal text: int(float('3.14159'))." },
        { ar: "الجواب: ب — النص به فاصلة فترفضه int برسالة ValueError.", en: 'Answer: b — the text has a decimal point, so int refuses it with ValueError.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.numeric-sqrt',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل — من الوحدة الرياضية: كم math.sqrt(81)؟',
        en: 'Without running — from the math module: what is math.sqrt(81)?',
      },
      answer: '9',
      solution: '9',
      tolerance: 0,
      hints: [
        { ar: 'الجذر التربيعي: أي عدد مضروب في نفسه يعطي 81؟', en: 'Square root: which number times itself gives 81?' },
        { ar: '9 × 9 = 81.', en: '9 × 9 = 81.' },
        { ar: 'التابع سيعيدها عائمًا: 9.0 — وكلاهما مقبول.', en: 'The function returns it as a float: 9.0 — either form is accepted.' },
        { ar: 'الجواب: 9', en: 'Answer: 9' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.trace-convert',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — دون تشغيله.',
        en: 'Read the code and predict its exact output — without running it.',
      },
      code: "x = int('7')\ny = float(x)\nprint(y)",
      solution: '7.0',
      answer: '7.0',
      hints: [
        { ar: "النص '7' يصبح العدد 7 الصحيح.", en: "The text '7' becomes the integer 7." },
        { ar: 'ثم float تضيف الفاصلة: 7 يصير 7.0.', en: 'Then float adds the decimal: 7 becomes 7.0.' },
        { ar: 'تُطبع قيمة y واحدة فقط.', en: 'Only the value of y is printed.' },
        { ar: 'الخرْج:\n7.0', en: 'The output:\n7.0' },
      ],
    },
    {
      kind: 'sandbox',
      expectedError: 'ValueError',  // intentional crash-teaching; verified by checks replay
      starterCode: "import math\n\nprint(math.sqrt(2) / 2)\nprint(math.sin(0.7))\ndegrees = 45\nradians = degrees / 360.0 * 2 * math.pi\nprint(math.sin(radians))\nprint(int('32'), int(3.99999))\nprint(float(32), str(3.14159))\nprint(int('Hello'))",
      prompt: {
        ar: "جرّب بنفسك: احسب جيب زاوية بالراديان، ووازن بين sin(0.7) وsin(الدرجات محوّلة). ثم اقرأ رسالة الخطأ في السطر الأخير: ValueError — هذه هي صوت int حين يُطلب منها المستحيل. جرّب أيضًا int(float('3.7')) — لماذا نجحت؟ لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: compute the sine of an angle in radians, and compare sin(0.7) with the degrees converted first. Then read the error message on the last line: ValueError — that is int’s voice when asked for the impossible. Also try int(float('3.7')) — why did that succeed? No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: "عودة إلى الفصل الثاني: كم يساوي int('17') + 5؟",
            en: "Back to chapter 2: what is int('17') + 5?",
          },
          options: [
            { id: 'a', text: { ar: '22 — التحويل ثم الجمع', en: '22 — conversion then addition' } },
            { id: 'b', text: { ar: "'225' — لصق النص", en: "'225' — gluing text" } },
            { id: 'c', text: { ar: 'خطأ TypeError', en: 'A TypeError' } },
          ],
          answer: 'a',
          explanation: {
            ar: "int('17') تعيد العدد 17، ثم 17 + 5 = 22. لو لم نحوّل لصق النصوص: '17' + '5' تعطي '175'.",
            en: "int('17') returns the number 17, then 17 + 5 = 22. Without conversion, gluing strings gives '175'.",
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كم يساوي int(2.9)؟',
            en: 'What is int(2.9)?',
          },
          options: [
            { id: 'a', text: { ar: '2 — اقتطاع القسم العشري', en: '2 — truncating the decimal part' } },
            { id: 'b', text: { ar: '3 — تقريب لأقرب عدد صحيح', en: '3 — rounding to the nearest integer' } },
            { id: 'c', text: { ar: '2.9 — لا يتغير', en: '2.9 — unchanged' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'int لا تُقرِّب أبدًا: تُلغي القسم العشري فقط. 2.9 ليست قريبة من 3 عند int — بل بعيدة عن 3 تمامًا.',
            en: 'int never rounds: it cancels the decimal part only. To int, 2.9 is not “almost 3” — it is exactly 2.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا نكتب math.sqrt وليس sqrt مباشرة؟',
            en: 'Why do we write math.sqrt rather than plain sqrt?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن sqrt تسكن داخل الوحدة — والتأشيرة بالنقطة تصلك إليها', en: 'Because sqrt lives inside the module — dot notation takes you there' } },
            { id: 'b', text: { ar: 'لأن بايثون ترفض أسماء التوابع بلا نقطة', en: 'Because Python rejects function names without a dot' } },
            { id: 'c', text: { ar: 'لأن sqrt كلمة محجوزة في اللغة', en: 'Because sqrt is a reserved word in the language' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'import math ينشئ كائن الوحدة، وتأشيرة النقطة math.sqrt تحدد التابع داخلها — كعنوان شقة داخل عمارة.',
            en: 'import math creates the module object, and dot notation math.sqrt pinpoints the function inside it — like a flat address inside a building.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: "ومن الفصل الثالث: خطأ int('Hello') برسالة ValueError — إلى أي عائلة ينتمي؟",
            en: "And from chapter 3: int('Hello') fails with ValueError — which family does it belong to?",
          },
          options: [
            { id: 'a', text: { ar: 'خطأ أثناء التشغيل — ينفجر منتصف التنفيذ', en: 'A runtime error — it explodes mid-execution' } },
            { id: 'b', text: { ar: 'خطأ قواعدي — يُكتشف قبل التشغيل', en: 'A syntax error — caught before running' } },
            { id: 'c', text: { ar: 'خطأ دلالي صامت — بلا رسالة', en: 'A silent semantic error — no message' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القواعد سليمة والنوع معروف — الفشل يقع أثناء التشغيل بموجز تتبع، ولهذا كان try/except في الفصل الماضي هو الحارس.',
            en: 'The grammar is fine and the type is known — the failure happens at runtime with a traceback, which is why chapter 3’s try/except stood guard.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'print(sqrt(25))',
          right: 'import math\nprint(math.sqrt(25))',
          note: {
            ar: 'بدون استيراد الوحدة سيصرخ NameError: name sqrt is not defined. خطوتان لا ثالث لهما: import math ثم تأشيرة النقطة.',
            en: 'Without importing the module you get NameError: name sqrt is not defined. Two steps, no shortcuts: import math, then dot notation.',
          },
        },
        {
          wrong: "n = int('3.7')",
          right: "n = int(float('3.7'))",
          note: {
            ar: "int يقبل النصوص الصحيحة فقط: '3.7' يرمي ValueError. حوّل النص إلى عائم أولًا بـ float ثم اقتطع بـ int — فتعطي 3.",
            en: "int only accepts whole-number text: '3.7' throws ValueError. Convert the text to a float first, then truncate with int — you get 3.",
          },
        },
        {
          wrong: "print(str(32) + 5)",
          right: "print(str(32) + ' هو عدد')",
          note: {
            ar: 'str تنتج نصًّا، والنص لا يُجمع مع عدد: TypeError من درس الفصل الثاني. إما أن تجمع نصًّا مع نص، أو تحوّل بـ int وتجمع أعدادًا.',
            en: 'str produces text, and text does not add to numbers: TypeError from chapter 2. Either glue text to text, or convert with int and add numbers.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'int وfloat وstr تحوّل الأنواع: int تقتطع الكسور ولا تُقرِّب، وتقبل النصوص الصحيحة فقط، وترفض غيرها برسالة ValueError.', en: 'int, float and str convert types: int truncates and never rounds, accepts only whole-number text, and refuses the rest with ValueError.' },
        { ar: 'import math يفتح الوحدة الرياضية، وتأشيرة النقطة math.sqrt وmath.pi تصل إلى توابعها ومتغيّراتها.', en: 'import math opens the math module, and dot notation — math.sqrt, math.pi — reaches its functions and variables.' },
        { ar: 'التوابع الرياضية مُنتجة: تعيد قيمًا نخزنها وندمجها — من الديسيبل إلى الفائدة المركّبة.', en: 'Math functions are fruitful: they return values we store and combine — from decibels to compound interest.' },
      ],
      reflectPrompt: {
        ar: 'تخيّل برنامج تسوّق: الأسعار تصل نصًّا من المستخدم. اكتب بالكلمات سلسلة التحويلات التي ستجريها قبل الجمع، وأين تحتاج round للعرض؟',
        en: 'Imagine a shopping program: prices arrive as text from the user. Describe in words the conversion chain you would run before adding, and where you would need round for display?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch4.s3', pages: 'ص57-58 / pp.57-58' },
        { book: 'PY4E', section: 'py4e.ch4.s4', pages: 'ص58-59 / pp.58-59' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch4.s3', pages: 'ص57-58 / pp.57-58' },
    { book: 'PY4E', section: 'py4e.ch4.s4', pages: 'ص58-59 / pp.58-59' },
  ],
} satisfies Lesson;

export default lesson;
