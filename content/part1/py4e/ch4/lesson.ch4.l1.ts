import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch4.l1 — "Calling Functions and Built-ins / استدعاء التوابع والتوابع الجاهزة"
 * Aligned with PY4E ch4 s1 (استدعاء التوابع), s2 (التوابع الجاهزة).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch4.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 4,
  title: { ar: 'استدعاء التوابع والتوابع الجاهزة', en: 'Calling Functions and Built-ins' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch3.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'سرّ صغير: أنت تستدعي التوابع منذ أول سطر كتبته. print وtype وint — كلها توابع، أي أسماء لتسلسلات تعليمات جاهزة تنجز عملًا. اليوم نفتح الصندوق: ما التابع؟ كيف نستدعيه؟ وماذا يعيد لنا؟ ثم نتعرف على ثلاثة توابع جاهزة ستستخدمها في كل برنامج تكتبه بقية عمرك.',
        en: 'A little secret: you have been calling functions since your very first line. print, type and int — all of them are functions: names for ready-made sequences of statements that do a job. Today we open the box: what is a function? How do we call it? And what does it hand back? Then we meet three built-ins you will use in every program you ever write.',
      },
    },
    {
      kind: 'predict',
      code: "print(max('Hello world'))\nprint(min('Hello world'))\nprint(len('Hello world'))",
      question: {
        ar: 'ثلاثة استدعاءات لثلاثة توابع جاهزة — ماذا يطبع كل سطر؟ وانتبه للسطر الثاني جيدًا.',
        en: 'Three calls to three built-in functions — what does each line print? And watch the second line closely.',
      },
      reveal: {
        ar: "السطر الأول يطبع w: أكبر حرف في النص. السطر الثاني يطبع أصغر محرف — وهو الفراغ، لذا يبدو السطر فارغًا وهو ليس فارغًا: فيه فراغ واحد! والسطر الثالث يطبع 11: عدد المحارف، والفراغ محسوب فيها. ثلاثة توابع، ثلاث نتائج مختلفة، كلها «أخذت» النص وأعادت قيمة.",
        en: "The first line prints w: the largest character in the text. The second prints the smallest character — the space — so the line looks empty but is not: it holds one space! The third prints 11: the number of characters, space included. Three functions, three different results, each “taking” the text and returning a value.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ما التابع؟ تشريح الاستدعاء', en: 'What is a function? Anatomy of a call' },
      chunks: [
        {
          ar: 'في سياق البرمجة، التابع هو سلسلة معرَّفة من التعليمات تُنفّذ عملية حسابية، وتستدعيه باسمه. رأيت الاستدعاء من قبل: type(32) — الاسم type والتعبير بين الأقواس وسيط التابع، وهو قيمة ثابتة أو متغيّر نمرّره للتابع كدخل. ونتيجة هذا التابع تحديد نوع الوسيط.',
          en: 'In programming, a function is a named sequence of statements that performs an operation, and you invoke it by name. You have seen a call before: type(32) — the name is type, and the expression between the parentheses is the function’s argument: a value or variable we pass in as input. This function’s result is the type of its argument.',
        },
        {
          ar: 'من الشائع القول إن التابع «يأخذ» الوسيط و«يعيد» النتيجة، وتُدعى النتيجة القيمة المُعادة. القوسان بعد الاسم هما إشارة الاستدعاء: الاسم وحده يذكر التابع، والاسم مع القوسين ينفّذانه. هذا كل شيء — والاستدعاء الذي رأيته مئة مرة مثل print(...) هو المخطط نفسه بالضبط.',
          en: 'It is common to say the function “takes” an argument and “returns” a result — and the result is called the return value. The parentheses after the name are the call signal: the name alone merely mentions the function; the name with parentheses executes it. That is the whole story — and the calls you have seen a hundred times, like print(...), follow exactly the same blueprint.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'ثلاثة توابع جاهزة لا تفارقك', en: 'Three built-ins that never leave you' },
      chunks: [
        {
          ar: "بايثون تقدّم توابع جاهزة كثيرة نستخدمها دون تعريف: وضع مبتكرو اللغة حلولًا لمسائل شائعة وضمّنوها فيها. max يعيد القيمة الأكبر، وmin يعيد الأصغر: max('Hello world') تعطي w لأنه أكبر محرف، وmin تعطي الفراغ لأنه أصغر محرف. وهي لا تقتصر على النصوص — ستراها تعمل على أي مجموعة قيم في الفصول القادمة.",
          en: "Python offers many built-in functions usable without defining anything: its creators bundled solutions to common problems into the language. max returns the largest value and min the smallest: max('Hello world') gives w because it is the largest character, and min gives the space because it is the smallest. They are not limited to text — you will see them work on any collection of values in coming chapters.",
        },
        {
          ar: "أما len فهو من أشهر الجاهزات: يعيد عدد العناصر الموجودة في وسيطه. إذا كان الوسيط نصًّا فهو عدد المحارف — وlen('Hello world') تعطي 11 لأن الفراغ عنصر يُحتسب. واعلم أن أسماء التوابع الجاهزة يجب أن تُعامل بوصفها كلمات محجوزة: تجنّب تسمية متغيّر باسم max أو len مهما كان الإغراء.",
          en: "As for len, it is among the most famous built-ins: it returns the number of items in its argument. For a string, that is the character count — and len('Hello world') gives 11 because the space is counted as an item. And know this: built-in function names should be treated as reserved words — never name a variable max or len, no matter how tempting.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الاستدعاءات تتداخل داخل التعبيرات', en: 'Calls nest inside expressions' },
      chunks: [
        {
          ar: "لأن التابع يعيد قيمة، يمكن وضع الاستدعاء في أي مكان تقبل فيه القيمة: print(len('Hello world'))، أو len(word) + 5، أو type(len('abc')). القاعدة: يُحسب الاستدعاء الأعمق أولًا فتصعد نتائجه إلى الخارج — تمامًا كما حسبنا الأقواس الداخلية أولًا في درس ترتيب العمليات بالفصل الثاني.",
          en: "Because a function returns a value, a call can sit anywhere a value is allowed: print(len('Hello world')), or len(word) + 5, or type(len('abc')). The rule: the innermost call computes first and its result flows outward — exactly like the innermost parentheses computed first in the chapter 2 order-of-operations lesson.",
        },
        {
          ar: "وتداخل الاستدعاءات ليس ترفًا: إنه أسلوب التفكير البرمجي. أنت تحوّل النص إلى عدد ثم تسأل عن زوجيته: n = int('42') ثم n % 2 == 0 — وكان بالإمكان دمجهما. كل تابع ينتج شيئًا، وكل شيء يمكن أن يصبح وسيطًا لتابع آخر.",
          en: "Nesting calls is not a luxury: it is how programmers think. You convert text to a number, then ask whether it is even: n = int('42'), then n % 2 == 0 — and the two steps could be combined. Every function produces something, and that something can become the argument of another function.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'فحص كامل لنص واحد', en: 'A full check-up on one string' },
      code: "word = 'Hello world'\nprint(len(word))\nprint(max(word))\nprint(min(word))\nprint(type(len(word)))",
      explanation: {
        ar: "خزّنا النص في word ثم فحصناه بأربع طباعات: 11 محرفًا (الفراغ ضمنها)، وأكبرها w وأصغرها فراغ — لذلك يبدو السطر الثالث فارغًا. والسطر الأخير يكشف هوية القيمة المُعادة من len: صنف int. لاحظ أن الاستدعاءات لم تغيّر word — التوابع تقرأ وتعيد، ولا تحرّك الصناديق.",
        en: "We stored the text in word, then ran a four-print check-up: 11 characters (space included), the largest is w and the smallest is a space — which is why the third line looks empty. The last line reveals the identity of len’s return value: class int. Notice the calls never changed word — functions read and return; they never move the boxes.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.probe-word',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "عرّف متغيّر word بالقيمة 'python'، ثم اطبع ثلاثة أسطر: len(word) ثم max(word) ثم min(word). المتوقع: 6 ثم y ثم h.",
        en: "Define a variable word with the value 'python', then print three lines: len(word), then max(word), then min(word). Expected: 6, then y, then h.",
      },
      starterCode: "# عرّف word ثم اطبع الثلاثة / define word, then print the three:\n",
      solution: "word = 'python'\nprint(len(word))\nprint(max(word))\nprint(min(word))",
      tests: [
        {
          id: 't1',
          name: { ar: 'word يساوي python', en: 'word equals python' },
          code: "assert word == 'python', 'expected: python | actual: %r' % word",
          expected: 'python',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع الطول 6', en: 'The length 6 is printed' },
          code: "assert '6' in __learner_output__, ('expected: 6 | actual: %r' % __learner_output__)",
          expected: '6',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع الأكبر y', en: 'The largest y is printed' },
          code: "assert 'y' in __learner_output__, ('expected: y | actual: %r' % __learner_output__)",
          expected: 'y',
        },
        {
          id: 't4',
          name: { ar: 'يُطبع الأصغر h', en: 'The smallest h is printed' },
          code: "assert 'h' in __learner_output__, ('expected: h | actual: %r' % __learner_output__)",
          expected: 'h',
        },
      ],
      hints: [
        { ar: 'ثلاثة استدعاءات على المتغيّر نفسه: len ثم max ثم min — كل واحدة داخل print.', en: 'Three calls on the same variable: len, then max, then min — each one inside a print.' },
        { ar: 'لا تنسَ القوسين بعد كل اسم تابع: len(word) لا len word.', en: 'Do not forget the parentheses after each function name: len(word), not len word.' },
        { ar: "الهيكل:\nword = 'python'\nprint(len(word))\nprint(max(word))\nprint(min(word))", en: "The skeleton:\nword = 'python'\nprint(len(word))\nprint(max(word))\nprint(min(word))" },
        { ar: "word = 'python'\nprint(len(word))\nprint(max(word))\nprint(min(word))", en: "word = 'python'\nprint(len(word))\nprint(max(word))\nprint(min(word))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-len-space',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "ماذا تعيد len('Hello world')؟",
        en: "What does len('Hello world') return?",
      },
      options: [
        { id: 'a', text: { ar: '10 — عدد الحروف فقط', en: '10 — letters only' } },
        { id: 'b', text: { ar: '11 — الفراغ محسوب ضمن العناصر', en: '11 — the space counts as an item' } },
        { id: 'c', text: { ar: '12', en: '12' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'len يعدّ العناصر في وسيطه — والسؤال: هل الفراغ عنصر؟', en: 'len counts the items in its argument — the question: is the space an item?' },
        { ar: 'النص يحوي 11 محرفًا بين أول H وآخر d، أحدها فراغ.', en: 'The string holds 11 characters between the first H and the last d, one of them a space.' },
        { ar: 'الفخّ هو الخيار الأول: عدّ الحروف ونسي الفراغ.', en: 'The trap is the first option: counting letters and forgetting the space.' },
        { ar: 'الجواب: 11 — الفراغ يُحتسب لأنه محرف مثل غيره.', en: 'Answer: 11 — the space counts because it is a character like any other.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-maxmin',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — دون تشغيله.',
        en: 'Read the code and predict its exact output — without running it.',
      },
      code: 'x = max(3, 7, 5)\ny = min(3, 7, 5)\nprint(x + y)',
      solution: '10',
      answer: '10',
      hints: [
        { ar: 'أكبر قيمة من 3 و7 و5؟ وأصغرها؟', en: 'Largest of 3, 7, 5? And the smallest?' },
        { ar: 'x تساوي 7 وy تساوي 3.', en: 'x is 7 and y is 3.' },
        { ar: 'ثم تطبع print مجموعهما.', en: 'Then print outputs their sum.' },
        { ar: 'الخرْج:\n10', en: 'The output:\n10' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-count',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: التابع ______ يعيد عدد العناصر الموجودة في وسيطه.',
        en: 'Fill in: the function ______ returns the number of items in its argument.',
      },
      answer: 'len',
      solution: 'len',
      hints: [
        { ar: 'استخدمته في التمرين الأول لعدّ حروف python.', en: 'You used it in the first exercise to count the letters of python.' },
        { ar: 'اسمه ثلاثة حروف، وهو اختصار كلمة length.', en: 'Its name is three letters, short for length.' },
        { ar: "len('python') تعطي 6.", en: "len('python') gives 6." },
        { ar: 'الجواب: len', en: 'Answer: len' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — فحّص التوابع الجاهزة\n# Your playground — probe the built-ins\n\nprint(max(10, 99, 42))\nprint(min('abcxyz'))\nprint(len('مرحبا'))\nprint(type(max(1, 2)))\nprint(len(''))",
      prompt: {
        ar: "جرّب بنفسك: عدّ حروف اسمك، وقارن بين كلمتين بـ max('cat', 'dog')، واسأل عن طول النص الفارغ. لاحظ السطر الأخير: لماذا len('') تعطي 0؟ لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: count the letters of your name, compare two words with max('cat', 'dog'), and ask for the length of the empty string. Look at the last line: why does len('') give 0? No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: "عودة إلى أول برنامج في الفصل الأول: في الاستدعاء print('Hello world!') ماذا نسمّي القيمة بين القوسين؟",
            en: "Back to your first program in chapter 1: in the call print('Hello world!') what do we call the value between the parentheses?",
          },
          options: [
            { id: 'a', text: { ar: 'الوسيط — الدخل الذي نمرّره للتابع', en: 'The argument — the input we pass to the function' } },
            { id: 'b', text: { ar: 'المعامل — متغيّر داخل التابع', en: 'The parameter — a variable inside the function' } },
            { id: 'c', text: { ar: 'الكتلة — مجموعة تعليمات بادئة', en: 'The block — a group of indented statements' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هي وسيط: قيمة نمرّرها للتابع. أما المعامل فسيأتي دوره الحقيقي في درس لاحق من هذا الفصل حين نعرّف توابعنا الخاصة.',
            en: 'It is an argument: a value we pass in. The parameter takes center stage later in this chapter, when we define our own functions.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: "ماذا تعيد min('Hello world')؟",
            en: "What does min('Hello world') return?",
          },
          options: [
            { id: 'a', text: { ar: 'الفراغ — أصغر محرف في النص', en: 'The space — the smallest character in the string' } },
            { id: 'b', text: { ar: 'الحرف H', en: 'The letter H' } },
            { id: 'c', text: { ar: 'خطأ TypeError', en: 'A TypeError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'min يعيد أصغر محرف، والفراغ أصغر من الحروف في ترتيب المحارف — لذلك كان سطر الخرْج يبدو فارغًا في درس اليوم.',
            en: 'min returns the smallest character, and the space sorts before letters — which is why that output line looked empty in today’s lesson.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "كم ناتج print(len('abc') + len('de'))؟",
            en: "What does print(len('abc') + len('de')) produce?",
          },
          options: [
            { id: 'a', text: { ar: '5', en: '5' } },
            { id: 'b', text: { ar: '32', en: '32' } },
            { id: 'c', text: { ar: 'خطأ TypeError', en: 'A TypeError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الاستدعاءات تُحسب من الداخل أولًا: 3 ثم 2، ثم يُجمعان فتُطبع 5. الطباعة لا تحدث قبل الحساب.',
            en: 'The calls compute inside-out first: 3 then 2, then the sum 5 is printed. Printing never happens before computing.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'العبارة «التابع يأخذ الوسيط ويعيد النتيجة» — ما اسم النتيجة رسميًا؟',
            en: 'The phrase “the function takes an argument and returns the result” — what is the result formally called?',
          },
          options: [
            { id: 'a', text: { ar: 'القيمة المُعادة', en: 'The return value' } },
            { id: 'b', text: { ar: 'الوسيط', en: 'The argument' } },
            { id: 'c', text: { ar: 'التعليمة', en: 'The statement' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الوسيط يدخل، والقيمة المُعادة تخرج — ومفردة return ستأخذ معناها العملي حين نعرّف توابعنا في هذا الفصل.',
            en: 'Arguments go in, the return value comes out — and the word return becomes hands-on when we define our own functions later in this chapter.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'max = 10\nprint(max(3, 7))',
          right: 'biggest = 10\nprint(max(3, 7))',
          note: {
            ar: "سمّيت متغيّرك max فمحوت التابع الجاهز، وصار max(3, 7) محاولة استدعاء العدد 10: TypeError: 'int' object is not callable. أسماء التوابع الجاهزة كالكلمات المحجوزة — تجنّبها.",
            en: "You named your variable max, wiping out the built-in, so max(3, 7) now tries to call the number 10: TypeError: 'int' object is not callable. Built-in names are like reserved words — avoid them.",
          },
        },
        {
          wrong: 'print(len)',
          right: "print(len('abc'))",
          note: {
            ar: 'بدون قوسين تحمل كائن التابع نفسه فتُطبع هويته <built-in function len> بدلًا من تنفيذه. الاسم يذكر، والقوسان ينفّذان.',
            en: 'Without parentheses you grab the function object itself and print its identity <built-in function len> instead of running it. The name mentions; the parentheses execute.',
          },
        },
        {
          wrong: "print(max(3, '7'))",
          right: 'print(max(3, 7))',
          note: {
            ar: "max تقارن معاملَيها، والعدد لا يقارن بالنص: TypeError — تذكير من الفصل الثاني بأن الأنواع لا تختلط. وحوّل أولًا إن لزم: max(3, int('7')).",
            en: "max compares its arguments, and a number cannot be compared with text: TypeError — chapter 2’s reminder that types do not mix. Convert first if needed: max(3, int('7')).",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التابع اسم لتسلسل تعليمات ينفّذ عملية: نستدعيه بالاسم والأقواس، ونمرّر له وسائط، فيعود بالقيمة المُعادة.', en: 'A function is a named sequence of statements performing an operation: call it by name with parentheses, pass it arguments, and it comes back with a return value.' },
        { ar: 'max وmin يعيدان الأكبر والأصغر، وlen يعدّ العناصر — والفراغ محرف يُحتسب — وتُعامل أسماؤها ككلمات محجوزة.', en: 'max and min return the largest and smallest, len counts items — the space counts as a character — and their names are treated as reserved.' },
        { ar: 'الاستدعاءات تتداخل داخل التعبيرات: يُحسب الأعمق أولًا وتصعد نتيجته إلى الخارج.', en: 'Calls nest inside expressions: the innermost computes first and its result flows outward.' },
      ],
      reflectPrompt: {
        ar: 'اذكر ثلاثة توابع جاهزة استخدمتها حتى اليوم (print وtype وint وlen وmax…). لكل واحد: ما الوسيط الذي يأخذه، وما القيمة المُعادة؟ اكتبها في سطر واحد لكل تابع.',
        en: 'Name three built-ins you have used so far (print, type, int, len, max…). For each: what argument does it take, and what does it return? Write one line per function.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch4.s1', pages: 'ص56 / pp.56' },
        { book: 'PY4E', section: 'py4e.ch4.s2', pages: 'ص56-57 / pp.56-57' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch4.s1', pages: 'ص56 / pp.56' },
    { book: 'PY4E', section: 'py4e.ch4.s2', pages: 'ص56-57 / pp.56-57' },
  ],
} satisfies Lesson;

export default lesson;
