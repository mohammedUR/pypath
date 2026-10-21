import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch4.l5 — "Parameters, Arguments, and Fruitful Functions /
 * المعاملات والوسائط والتوابع المُنتجة"
 * Aligned with PY4E ch4 s9 (المعاملات والوسائط),
 * s10 (التوابع المُنتجة والتوابع الخالية), s11 (لماذا نستخدم التوابع؟).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch4.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 4,
  title: { ar: 'المعاملات والوسائط والتوابع المُنتجة', en: 'Parameters, Arguments, and Fruitful Functions' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch4.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الدرس الماضي صنع توابعًا تعرف حديثًا واحدًا: اطبعي دائمًا نفس الجملة. اليوم نعطيها أذنين: المعاملات تستقبل وسائطك، فيصير التابع الواحد صندوقًا يخدم آلاف الحالات. ثم السؤال الأعمق: تابع يطبع وتابع يعيد — ما الفرق؟ الجواب كلمة واحدة: return.',
        en: 'Last lesson built functions that know one line: always print the same sentence. Today we give them ears: parameters receive your arguments, so a single function serves thousands of cases. Then the deeper question: a function that prints versus a function that returns — what is the difference? The answer is one word: return.',
      },
    },
    {
      kind: 'predict',
      code: "def print_twice(x):\n    print(x)\n    print(x)\n\nprint_twice(5 * 2)",
      question: {
        ar: 'كم سطرًا يُطبع؟ وما القيمة؟ ومتى حُسب التعبير 5 * 2 — قبل الاستدعاء أم داخله؟',
        en: 'How many lines print? What value? And when was the expression 5 * 2 computed — before the call or inside it?',
      },
      reveal: {
        ar: 'سطران: 10 و10. التعبير 5 * 2 حُسب مرة واحدة قبل الاستدعاء، ثم سُندت نتيجته إلى المعامل x داخل التابع. الوسيط لا يدخل كنص — بل كقيمة محسوبة سلفًا، ويحمل اسمًا جديدًا داخل التابع.',
        en: 'Two lines: 10 and 10. The expression 5 * 2 was computed exactly once before the call, and its result was assigned to the parameter x inside the function. An argument does not enter as text — it enters as a precomputed value, wearing a new name inside the function.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'المعامل يستقبل، والوسيط يُرسل', en: 'The parameter receives, the argument is sent' },
      chunks: [
        {
          ar: 'بعض التوابع الجاهزة تتطلب وسائط: math.sin تأخذ عددًا، وmath.pow تأخذ وسيطين — الأساس والأسّ — وتُسند هذه الوسائط إلى متغيّرات داخل التابع تُدعى معاملات. مثال الكتاب: def print_twice(bruce) — الوسيط المُمرَّر يُسند إلى المعامل bruce، وعند الاستدعاء يطبع التابع قيمة المعامل مرتين، أيًا كانت.',
          en: 'Some built-ins require arguments: math.sin takes a number, math.pow takes two — base and exponent — and these arguments are assigned to variables inside the function called parameters. The book’s example: def print_twice(bruce) — the argument you pass is assigned to the parameter bruce, and when called the function prints the parameter’s value twice, whatever it is.',
        },
        {
          ar: "ويقبل التابع أي قيمة يمكن طباعتها: print_twice('Spam')، وprint_twice(17)، وحتى print_twice(math.pi). وبإمكانك تمرير تعبير كامل: print_twice('Spam ' * 4) — فالوسيط يُحسب قبل الاستدعاء مرة واحدة فقط، ثم تسند نتيجته للمعامل.",
          en: "And the function accepts any printable value: print_twice('Spam'), print_twice(17), even print_twice(math.pi). You can pass a whole expression too: print_twice('Spam ' * 4) — the argument is evaluated before the call, exactly once, and its result is assigned to the parameter.",
        },
        {
          ar: "ويمكنك تمرير متغيّر: michael = 'Eric, the half a bee.' ثم print_twice(michael). والعلاقة بين اسم المتغيّر الخارجي واسم المعامل الداخلي لا وجود لها: نحن مررنا القيمة، وداخل التابع تُدعى bruce مهما كان اسمها في الخارج. القيمة تسافر، والاسم يبقى في بيته.",
          en: "You can also pass a variable: michael = 'Eric, the half a bee.', then print_twice(michael). The outside variable’s name and the inside parameter’s name have no relation whatsoever: we passed a value, and inside the function it is called bruce no matter what it was called outside. The value travels; the name stays home.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'مُنتجة تعيد، خالية تُنجز', en: 'Fruitful returns, void performs' },
      chunks: [
        {
          ar: 'بعض التوابع — الرياضية مثلًا — تعطي نتائج: نسميها التوابع المُنتجة. وأخرى مثل print_twice تُنجز مهمة لكنها لا تُرجع قيمة: نسميها التوابع الخالية. حين تستدعي تابعًا مُنتجًا في الوضع التفاعلي تعرض بايثون النتيجة، لكن في نص برمجي — إن لم تخزنها في متغيّر أو تطبعها — فالقيمة تضيع بلا أثر: math.sqrt(5) وحدها سطر غير مفيد.',
          en: 'Some functions — the math ones, for example — give results: we call them fruitful functions. Others, like print_twice, perform a task but return no value: we call them void functions. Call a fruitful function in interactive mode and Python shows the result; but in a script, if you neither store it in a variable nor print it, the value vanishes: a lone math.sqrt(5) line is useless.',
        },
        {
          ar: "وماذا لو أسندت نتيجة تابع خالٍ إلى متغيّر؟ تحصل على قيمة مميّزة تدعى None: result = print_twice('Bing') تطبع Bing مرتين، ثم print(result) يطبع None. وNone ليست النص 'None' — بل قيمة خاصة من صنف خاص: print(type(None)) يعطي <class 'NoneType'>.",
          en: "And what if you assign a void function’s result to a variable? You get a special value called None: result = print_twice('Bing') prints Bing twice, then print(result) prints None. And None is not the string 'None' — it is a special value of its own class: print(type(None)) gives <class 'NoneType'>.",
        },
        {
          ar: 'ولصناعة تابع مُنتج نستخدم تعليمة return. مثال الكتاب: def addtwo(a, b): ثم added = a + b ثم return added — وبعدها x = addtwo(3, 5) وprint(x) تطبع 8. داخل التابع صار a تساوي 3 وb تساوي 5، وحُسب الجمع في متغيّر محلي، ثم أرسل return النتيجة إلى المستدعى فسُندت إلى x.',
          en: 'To craft a fruitful function we use the return statement. The book’s example: def addtwo(a, b):, then added = a + b, then return added — after which x = addtwo(3, 5) and print(x) prints 8. Inside the function a became 3 and b became 5, the sum was computed into a local variable, then return sent the result to the caller, where it was assigned to x.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'لماذا نزعج أنفسنا بالتوابع؟', en: 'Why bother with functions at all?' },
      chunks: [
        {
          ar: 'قد لا يكون واضحًا لمَ نقسّم البرنامج إلى توابع. الأسباب: إنشاء تابع يمنحك فرصة تسمية مجموعة تعليمات، فيصير برنامجك أسهل قراءة وفهمًا وتصحيحًا — الاسم الوصفي مثل make_password يشرح نيّة الكود في كلمة.',
          en: 'It may not be obvious why we bother splitting a program into functions. The reasons: creating a function gives you the chance to name a group of statements, making your program easier to read, understand and debug — a descriptive name like make_password states the code’s intent in one word.',
        },
        {
          ar: 'ثم التوابع تُلغي التكرار: تعليمة تُكتب مرة وتُستدعى مئة مرة، وتُعيد الاستخدام عبر البرامج — تابع مصمم جيدًا يصير مفردة مفيدة في قاموسك لبرامج قادمة كثيرة. وأخيرًا تقسيم البرنامج الطويل إلى أجزاء مسمّاة يتيح تصحيح كل جزء على حدة، بدل مطاردة خطأ في ألف سطر متصلة.',
          en: 'Then functions eliminate repetition: write a statement once, call it a hundred times, and reuse it across programs — a well-designed function becomes a useful word in your vocabulary for many future programs. Finally, splitting a long program into named pieces lets you debug each piece in isolation, instead of hunting a bug through a thousand tangled lines.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'addtwo: أول تابع مُنتج لك', en: 'addtwo: your first fruitful function' },
      code: 'def addtwo(a, b):\n    added = a + b\n    return added\n\nx = addtwo(3, 5)\nprint(x)\nprint(addtwo(10, -4) * 2)',
      explanation: {
        ar: 'الاستدعاء الأول: 3 سُندت إلى a و5 إلى b، وحُسب 8 في المتغيّر المحلي added، وأعاد return القيمة فسُندت إلى x وطُبعت. الاستدعاء الثاني جاء داخل تعبير: 6 مُرّت للطباعة مضروبة في 2 فظهرت 12. هكذا تتلائف التوابع المُنتجة مع الجاهزات — مكان القيمة مكانها: تعبير أو وسيط أو متغيّر.',
        en: 'The first call: 3 was assigned to a and 5 to b, the sum 8 was computed into the local variable added, and return handed the value back to be stored in x and printed. The second call sits inside an expression: 6 was passed to the print multiplied by 2, showing 12. This is how fruitful functions mix with built-ins — wherever a value fits: in an expression, an argument, or a variable.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.write-double',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'عرّف تابعًا مُنتجًا اسمه double يأخذ معاملًا n ويُعيد n * 2 بـ return — ولا تطبع داخله. ثم result = double(21) واطبع result. المتوقع: 42.',
        en: 'Define a fruitful function named double taking a parameter n and returning n * 2 with return — do not print inside it. Then result = double(21) and print result. Expected: 42.',
      },
      starterCode: '# عرّف التابع المُنتج ثم استدعه واطبع النتيجة / define the fruitful function, call it, print the result\n',
      solution: 'def double(n):\n    return n * 2\n\nresult = double(21)\nprint(result)',
      tests: [
        {
          id: 't1',
          name: { ar: 'double كائن تابع قابل للاستدعاء', en: 'double is a callable function object' },
          code: "assert callable(double), 'expected: function | actual: %r' % type(double).__name__",
          expected: 'function',
        },
        {
          id: 't2',
          name: { ar: 'double تُعيد القيمة — double(5) يساوي 10', en: 'double returns a value — double(5) equals 10' },
          code: "assert double(5) == 10, 'expected: 10 | actual: %r' % double(5)",
          expected: '10',
        },
        {
          id: 't3',
          name: { ar: 'result تساوي 42', en: 'result equals 42' },
          code: "assert result == 42, 'expected: 42 | actual: %r' % result",
          expected: '42',
        },
        {
          id: 't4',
          name: { ar: 'يُطبع 42', en: '42 is printed' },
          code: "assert '42' in __learner_output__, ('expected: 42 | actual: %r' % __learner_output__)",
          expected: '42',
        },
      ],
      hints: [
        { ar: 'الترويسة تحمل معاملًا بين القوسين: def double(n):', en: 'The header holds a parameter between the parentheses: def double(n):' },
        { ar: 'الجسم سطر واحد يبدأ بـ return — لا print.', en: 'The body is one line starting with return — no print.' },
        { ar: 'الهيكل:\ndef double(n):\n    return n * 2\n\nresult = double(21)\nprint(result)', en: 'The skeleton:\ndef double(n):\n    return n * 2\n\nresult = double(21)\nprint(result)' },
        { ar: 'def double(n):\n    return n * 2\n\nresult = double(21)\nprint(result)', en: 'def double(n):\n    return n * 2\n\nresult = double(21)\nprint(result)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-return',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — دون تشغيله.',
        en: 'Read the code and predict its exact output — without running it.',
      },
      code: 'def mystery(x):\n    return x * 3\n\ny = mystery(4)\nprint(y)\nprint(mystery(1) + mystery(2))',
      solution: '12\n9',
      answer: '12\n9',
      hints: [
        { ar: 'mystery(4) تعيد 12 فتُخزَّن في y.', en: 'mystery(4) returns 12 and is stored in y.' },
        { ar: 'السطر الثاني استدعاءان: 3 و6.', en: 'The second line is two calls: 3 and 6.' },
        { ar: 'ثم يُطبع مجموعهما.', en: 'Then their sum is printed.' },
        { ar: 'الخرْج:\n12\n9', en: 'The output:\n12\n9' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-void-none',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "نفّذنا result = print_twice('Bing') حيث print_twice تابع يطبع مرتين ولا يُعيد شيئًا. ماذا يكون داخل result؟",
        en: "We ran result = print_twice('Bing') where print_twice prints twice and returns nothing. What ends up inside result?",
      },
      options: [
        { id: 'a', text: { ar: "None — قيمة خاصة من صنف NoneType", en: 'None — a special value of class NoneType' } },
        { id: 'b', text: { ar: "النص 'Bing'", en: "The string 'Bing'" } },
        { id: 'c', text: { ar: "النص 'None'", en: "The string 'None'" } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تابع خالٍ ينجز مهمته — ثم ماذا يسلّم؟', en: 'A void function does its job — then what does it hand over?' },
        { ar: 'الخيار الثالث فخّ: None ليست نصًّا.', en: 'The third option is a trap: None is not text.' },
        { ar: 'print(type(None)) يكشف هويتها: NoneType.', en: 'print(type(None)) reveals its identity: NoneType.' },
        { ar: 'الجواب: None من صنف NoneType — القيمة المميّزة للتوابع الخالية.', en: 'Answer: None of class NoneType — the special value of void functions.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-return',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: التعليمة ______ تُرسل نتيجة التابع إلى المُستدعى كقيمة مُعادة.',
        en: 'Fill in: the ______ statement sends the function’s result to the caller as a return value.',
      },
      answer: 'return',
      solution: 'return',
      hints: [
        { ar: 'رأيتها في addtwo وdouble.', en: 'You saw it in addtwo and double.' },
        { ar: 'كلمة إنجليزية واحدة تعني «أعِد».', en: 'One English word meaning “give back”.' },
        { ar: 'بدونها يكون التابع خاليًا ويعطي None.', en: 'Without it the function is void and gives None.' },
        { ar: 'الجواب: return', en: 'Answer: return' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def print_twice(bruce):\n    print(bruce)\n    print(bruce)\n\nprint_twice('Spam')\nprint_twice(17)\nimport math\nprint_twice(math.pi)\nprint_twice('Spam ' * 4)\nresult = print_twice('Bing')\nprint(result)\nprint(type(result))",
      prompt: {
        ar: "جرّب بنفسك: مرّر نصًّا وعددًا وتعبيرًا كاملًا إلى تابعك — كلها تعمل. ثم التقِ None شخصيًا في السطرين الأخيرين. غيّر اسم المعامل إلى anything وتأكد أن كل شيء يعمل كما كان: القيمة تسافر والاسم يبقى. لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: pass a string, a number, and a whole expression to your function — all work. Then meet None personally in the last two lines. Rename the parameter to anything and confirm everything still behaves: the value travels, the name stays. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: "عودة إلى تداخل الاستدعاءات من درس الجاهزات: في double(int('5')) — ماذا يُحسب أولًا؟",
            en: "Back to call nesting from the built-ins lesson: in double(int('5')) — what is computed first?",
          },
          options: [
            { id: 'a', text: { ar: "int('5') الداخلي يعطي 5، ثم double(5) تعطي 10", en: "The inner int('5') gives 5, then double(5) gives 10" } },
            { id: 'b', text: { ar: 'double أولًا ثم int', en: 'double first, then int' } },
            { id: 'c', text: { ar: 'يُحسبان معًا في وقت واحد', en: 'Both at the same time' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الاستدعاءات تُحسب من الداخل إلى الخارج — نفس قاعدة الأقواس الداخلية: الداخلي ينتج قيمة تصير وسيطًا للخارجي.',
            en: 'Calls evaluate inside-out — the same rule as innermost parentheses: the inner one produces a value that becomes the outer one’s argument.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في def addtwo(a, b) والاستدعاء addtwo(3, 5) — أي وصف صحيح؟',
            en: 'In def addtwo(a, b) and the call addtwo(3, 5) — which description is correct?',
          },
          options: [
            { id: 'a', text: { ar: 'a وb معاملات داخل التابع، و3 و5 وسائط مُمرَّرة', en: 'a and b are parameters inside the function; 3 and 5 are arguments passed in' } },
            { id: 'b', text: { ar: 'a وb وسائط، و3 و5 معاملات', en: 'a and b are arguments; 3 and 5 are parameters' } },
            { id: 'c', text: { ar: 'كلها معاملات بلا فرق', en: 'All of them are parameters, no difference' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المعامل اسم في ترويسة التعريف يستقبل، والوسيط قيمة في سطر الاستدعاء تُرسل — عند الاستدعاء صار a تساوي 3 وb تساوي 5.',
            en: 'A parameter is a name in the definition header that receives; an argument is a value in the call line that is sent. At call time a became 3 and b became 5.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'math.sqrt(25) من أي نوع — مُنتج أم خالٍ؟',
            en: 'Is math.sqrt(25) fruitful or void?',
          },
          options: [
            { id: 'a', text: { ar: 'مُنتج — يعيد 5.0 فنخزنه ونستخدمه', en: 'Fruitful — it returns 5.0, which we store and use' } },
            { id: 'b', text: { ar: 'خالٍ — يعيد None', en: 'Void — it returns None' } },
            { id: 'c', text: { ar: 'لا يوجد تصنيف للتوابع الرياضية', en: 'Math functions have no such classification' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل توابع الوحدة الرياضية مُنتجة: تعطي نتائج نستفيد منها بالتخزين أو الطباعة أو الدمج في تعابير — عكس الخالية التي تنجز وتنصرف.',
            en: 'All math-module functions are fruitful: they give results we use by storing, printing, or folding into expressions — unlike void ones that perform and leave.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ماذا يطبع print(type(None))؟',
            en: 'What does print(type(None)) print?',
          },
          options: [
            { id: 'a', text: { ar: "<class 'NoneType'>", en: "<class 'NoneType'>" } },
            { id: 'b', text: { ar: "<class 'str'>", en: "<class 'str'>" } },
            { id: 'c', text: { ar: '<class \'function\'>', en: '<class \'function\'>' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'None قيمة مميّزة لها صنفها الخاص NoneType — وليست النص "None" ولا العدد صفر ولا قيمة منطقية.',
            en: 'None is a special value with its own class NoneType — not the string "None", not zero, and not a boolean.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'def double(n):\n    print(n * 2)\n\nresult = double(5)\nprint(result * 2)',
          right: 'def double(n):\n    return n * 2\n\nresult = double(5)\nprint(result * 2)',
          note: {
            ar: 'الطباعة ليست الإعادة: double الخالية أعادت None فانفجر الضرب: TypeError: unsupported operand type(s) for *. من تريد نتيجته لا تطبعه بل return.',
            en: 'Printing is not returning: the void double handed back None, so the multiplication exploded: TypeError: unsupported operand type(s) for *. If you want a result, return it — do not print it.',
          },
        },
        {
          wrong: 'def double(n):\n    return n * 2\n\nprint(n)',
          right: 'def double(n):\n    return n * 2\n\nprint(double(5))',
          note: {
            ar: 'المعامل يعيش داخل التابع: n في الخارج NameError. الحصول على النتيجة يكون عبر استدعاء التابع لا عبر اسم معامله.',
            en: 'The parameter lives inside the function: n outside is a NameError. You get the result by calling the function, not by naming its parameter.',
          },
        },
        {
          wrong: 'x = addtwo(3)',
          right: 'x = addtwo(3, 5)',
          note: {
            ar: 'التعريف يتوقع معاملين فجاء وسيط واحد: TypeError: addtwo() missing 1 required positional argument. عدد الوسائط يطابق عدد المعاملات.',
            en: 'The definition expects two parameters but one argument arrived: TypeError: addtwo() missing 1 required positional argument. The argument count must match the parameter count.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المعامل متغيّر داخل التابع يستقبل الوسيط عند الاستدعاء؛ الوسيط يُحسب قبل الاستدعاء مرة واحدة، ولا علاقة لاسم المتغيّر المُمرَّر باسم المعامل.', en: 'A parameter is a variable inside the function that receives the argument at call time; the argument is evaluated once before the call, and the passed variable’s name has no relation to the parameter’s.' },
        { ar: 'التوابع المُنتجة تعيد قيمة بـ return نستفيد منها، والخالية تنجز مهمة وتعطي None من صنف NoneType.', en: 'Fruitful functions return a value via return that we use; void functions perform a task and hand back None of class NoneType.' },
        { ar: 'التوابع تسمّي وتُلغي التكرار وتُعاد الاستخدام وتقسّم التصحيح — لهذا يستحق البرنامج الكبير أن يُبنى منها.', en: 'Functions name, de-duplicate, enable reuse, and split debugging — which is why big programs deserve to be built from them.' },
      ],
      reflectPrompt: {
        ar: 'خذ برنامجك القديم — آلة الحاسبة الآمنة من الفصل الثالث. أي جزء ستحوّله إلى تابع؟ ما اسمه؟ هل يكون مُنتجًا يعيد قيمة أم خاليًا يطبع؟ ولماذا؟',
        en: 'Take an old program of yours — chapter 3’s safe calculator. Which part would you wrap into a function? What would you name it? Would it be fruitful, returning a value, or void, printing? And why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch4.s9', pages: 'ص64-66 / pp.64-66' },
        { book: 'PY4E', section: 'py4e.ch4.s10', pages: 'ص66-67 / pp.66-67' },
        { book: 'PY4E', section: 'py4e.ch4.s11', pages: 'ص67-68 / pp.67-68' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch4.s9', pages: 'ص64-66 / pp.64-66' },
    { book: 'PY4E', section: 'py4e.ch4.s10', pages: 'ص66-67 / pp.66-67' },
    { book: 'PY4E', section: 'py4e.ch4.s11', pages: 'ص67-68 / pp.67-68' },
  ],
} satisfies Lesson;

export default lesson;
