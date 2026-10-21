import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch2.l3 — "Statements, Expressions, and Order of Operations /
 * التعليمات والتعابير وترتيب العمليات"
 * Aligned with PY4E ch2 s4 (التعليمات), s6 (التعابير), s7 (تراتبية العمليات).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch2.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 2,
  title: { ar: 'التعليمات والتعابير وترتيب العمليات', en: 'Statements, Expressions, and Order of Operations' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch2.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الرياضيات المدرسية، 2 × 3 − 1 نتيجتها حكمٌ متفق عليه عالميًا: 5، لا 4. بايثون تتبع الاتفاق نفسه حرفيًا — ومن يخالفه تُعاقبه بنتيجة صامتة خاطئة. هذا الدرس يمنحك دفتر قواعد الترتيب، وأقوى ورقة فيها اسمها الأقواس.',
        en: 'In school mathematics, 2 × 3 − 1 has a globally agreed verdict: 5, not 4. Python follows that agreement to the letter — and quietly punishes anyone who forgets it with a wrong result. This lesson hands you the order-of-operations rulebook, whose strongest card is called parentheses.',
      },
    },
    {
      kind: 'predict',
      code: 'print(2 * 3 - 1)',
      question: {
        ar: 'هل تحسب بايثون من اليسار بلا ترتيب (2 × 3 = 6 ثم 6 − 1)، أم لها ترتيب خاص؟ كم سيطبع؟',
        en: 'Does Python just compute left to right (2 × 3 = 6, then 6 − 1), or does it have its own order? What does it print?',
      },
      reveal: {
        ar: 'سيطبع 5: الضرب يُنجز قبل الطرح. لو حسبت يسارًا يسارًا كأنك تقرأ سطرًا لظهر 5 أيضًا هنا — لكن جرّب 1 + 2 * 3: من يقرأ يسارًا يقول 9، وترتيب بايثون يقول 7 وهو الرأي الصحيح. الضرب أسبقية على الجمع، دائمًا.',
        en: 'It prints 5: multiplication happens before subtraction. Left-to-right happens to give 5 here too — but try 1 + 2 * 3: the left-to-right reader says 9, while Python’s order says 7, and 7 is right. Multiplication outranks addition, always.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تعليمة أم تعبير؟', en: 'Statement or expression?' },
      chunks: [
        {
          ar: 'التعليمة (statement) جزء من الكود يستطيع المفسّر تنفيذه: أمر كامل — مثل print("hi") أو الإسناد x = 5. أما التعبير (expression) فهو مزيج من القيم والمتغيّرات والعوامل ينتج قيمة: 17 وx وx + 17 كلها تعابير.',
          en: 'A statement is a piece of code the interpreter can execute: one complete command — like print("hi") or the assignment x = 5. An expression, on the other hand, is a combination of values, variables and operators that produces a value: 17, x and x + 17 are all expressions.',
        },
        {
          ar: 'الفرق العملي يظهر في النص البرمجي: التعليمة تفعل شيئًا (تطبع أو تخزّن)، والتعبير المكتوب وحده يحسب قيمته بصمت ثم يرميها — تذكّر 7 + 3 الصامت. القيمة وحدها تعبير، والمتغيّر وحده تعبير أيضًا؛ لكن دون print أو إسناد فلا أحد يسمعها.',
          en: 'The practical difference shows in scripts: a statement does something (prints or stores), while a bare expression computes its value silently and throws it away — remember the silent 7 + 3. A value alone is an expression, and so is a variable alone; but without print or assignment, nobody hears it.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.minutes-day',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أنشئ متغيّر minutes بقيمة عدد الدقائق في اليوم كاملًا، باستخدام تعبير حسابي: 24 * 60 (لا تكتب 1440 جاهزًا!). ثم اطبع minutes.',
        en: 'Create a variable minutes holding the number of minutes in a whole day, using an arithmetic expression: 24 * 60 (do not just write 1440!). Then print minutes.',
      },
      starterCode: '# صندوق minutes يحسب بنفسه / the minutes box computes for itself\nminutes = 0  # استبدل الصفر بتعبير 24 * 60 / replace 0 with the expression 24 * 60\nprint(minutes)',
      solution: 'minutes = 24 * 60\nprint(minutes)',
      tests: [
        {
          id: 't1',
          name: { ar: 'minutes تساوي 1440', en: 'minutes equals 1440' },
          code: "assert minutes == 1440, 'expected: 1440 | actual: %r' % minutes",
          expected: '1440',
        },
      ],
      hints: [
        { ar: 'اليوم فيه 24 ساعة، والساعة 60 دقيقة — اضربهما.', en: 'A day has 24 hours and an hour has 60 minutes — multiply them.' },
        { ar: 'الإسناد يحسب اليمين أولًا ثم يخزّن: minutes = 24 * 60.', en: 'Assignment computes the right side first, then stores: minutes = 24 * 60.' },
        { ar: 'الهيكل:\nminutes = 24 * 60\nprint(minutes)', en: 'The skeleton:\nminutes = 24 * 60\nprint(minutes)' },
        { ar: 'minutes = 24 * 60\nprint(minutes)', en: 'minutes = 24 * 60\nprint(minutes)' },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'PEMDAS: سُلّم الأسبقية', en: 'PEMDAS: the precedence ladder' },
      chunks: [
        {
          ar: 'حين يتزاحم أكثر من عامل في تعبير واحد، تتبع بايثون القواعد الرياضية المألوفة، واختصار PEMDAS يرتّب السلم: الأقواس أولًا ثم الرفع إلى قوة ** ثم الضرب والقسمة ثم الجمع والطرح. فـ 2 * (3 - 1) تعطي 4، و(1 + 1) ** (5 - 2) تعطي 8.',
          en: 'When several operators crowd one expression, Python follows the familiar math rules, and the acronym PEMDAS ranks the ladder: parentheses first, then exponentiation **, then multiplication and division, then addition and subtraction. So 2 * (3 - 1) gives 4, and (1 + 1) ** (5 - 2) gives 8.',
        },
        {
          ar: 'والعوامل المتساوية في الدرج تُنفَّذ من اليسار إلى اليمين: 5 - 3 - 1 تعطي 1 لأن 5 - 3 حُسب أولًا. القاعدة الذهبية التي يوصي بها الكتاب: إذا شككت في الأسبقية فضع أقواسًا — حتى لو لم تغيّر النتيجة، فـ (minute * 100) / 60 أسهل قراءة وأكثر أمانًا من الشك.',
          en: 'And operators of equal rank run left to right: 5 - 3 - 1 gives 1 because 5 - 3 is computed first. The golden rule the book recommends: whenever you doubt precedence, add parentheses — even if they change nothing, (minute * 100) / 60 is easier to read and safer than doubt.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'خمسة أحكام من محكمة الأسبقية', en: 'Five verdicts from the precedence court' },
      code: 'print(2 * 3 - 1)\nprint(6 + 4 / 2)\nprint(5 - 3 - 1)\nprint(2 ** 1 + 1)\nprint(2 ** (1 + 1))',
      explanation: {
        ar: 'بالترتيب: 2 * 3 − 1 = 5 (الضرب قبل الطرح)، و6 + 4 / 2 = 8.0 (القسمة قبل الجمع — ولاحظ ظهور .0 لأن / تنتج عددًا عائمًا، سرّ نكشفه في الدرس القادم)، و5 − 3 − 1 = 1 (يسار إلى يمين)، و2 ** 1 + 1 = 3 (الرفع قبل الجمع)، و2 ** (1 + 1) = 4 (الأقواس أعادت ترتيب الكارت).',
        en: 'In order: 2 * 3 − 1 = 5 (multiplication before subtraction); 6 + 4 / 2 = 8.0 (division before addition — and notice the .0, because / produces a float, a secret we unlock next lesson); 5 − 3 − 1 = 1 (left to right); 2 ** 1 + 1 = 3 (exponentiation before addition); 2 ** (1 + 1) = 4 (parentheses reshuffle the cards).',
      },
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-pemdas',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل وبلا حاسبة: كم ناتج التعبير 2 ** 3 + 1؟ اكتب الرقم فقط.',
        en: 'Without running or a calculator: what is the value of 2 ** 3 + 1? Type the number only.',
      },
      answer: '9',
      solution: '9',
      tolerance: 0,
      hints: [
        { ar: 'PEMDAS: من يسبق من — ** أم +؟', en: 'PEMDAS: who outranks whom — ** or +?' },
        { ar: 'احسب الرفع أولًا: 2 ** 3 = 8.', en: 'Compute the exponent first: 2 ** 3 = 8.' },
        { ar: 'ثم أضف 1 إلى الناتج.', en: 'Then add 1 to the result.' },
        { ar: 'الجواب: 9.', en: 'Answer: 9.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-silent-expression',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي سطر من الثلاثة لا يُظهر شيئًا على الشاشة عند تشغيل نص برمجي؟',
        en: 'Which of the three lines shows nothing on screen when run as a script?',
      },
      options: [
        { id: 'a', text: { ar: 'print(2 + 3)', en: 'print(2 + 3)' } },
        { id: 'b', text: { ar: '2 + 3', en: '2 + 3' } },
        { id: 'c', text: { ar: 'x = 2 + 3', en: 'x = 2 + 3' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'قارن الأنواع: تعليمة تُنفَّذ، وتعبير يُحسب — وأيّهما يُظهر شيئًا؟', en: 'Compare kinds: a statement executes, an expression computes — which one shows anything?' },
        { ar: 'اثنان منها يفعلان شيئًا مرئيًا أو مفيدًا.', en: 'Two of them do something visible or useful.' },
        { ar: 'الإسناد يخزّن بصمت لكنه يبقي الناتج حيًّا في x.', en: 'Assignment stores silently but keeps the result alive in x.' },
        { ar: 'الجواب: 2 + 3 — يُحسب ويُرمى فورًا، لا يُخزَّن ولا يُعرض.', en: 'Answer: 2 + 3 — computed then thrown away instantly, neither stored nor shown.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — محكمة الأسبقية بين يديك\n# Your playground — the precedence court in your hands\n\nprint(10 - 2 - 3)\nprint(10 - (2 - 3))\nprint(2 + 3 * 4)\nprint((2 + 3) * 4)',
      prompt: {
        ar: 'جرّب بنفسك: تنبأ بنتيجة كل سطر قبل التشغيل، ثم شغّل وقارن. أضف أقواسًا لقلب أحكام اثنين منها. من يملك الكلمة الأخيرة: أنت أم PEMDAS؟',
        en: 'Try it yourself: predict each line before running, then run and compare. Add parentheses to overturn two of the verdicts. Who gets the last word: you or PEMDAS?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة لدرس المتغيّرات: بعد x = 5 ثم x = "خمسة" — ماذا تجيب type(x)؟',
            en: 'Back to the variables lesson: after x = 5 then x = "خمسة" — what does type(x) answer?',
          },
          options: [
            { id: 'a', text: { ar: '<class \'int\'>', en: '<class \'int\'>' } },
            { id: 'b', text: { ar: '<class \'str\'>', en: '<class \'str\'>' } },
            { id: 'c', text: { ar: 'ترفض بايثون السطر الثاني', en: 'Python rejects the second line' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الصندوق يحتفظ بآخر قيمة ونوعها: النص استبدل العدد، فالنوع صار str.',
            en: 'The box keeps its latest value and its type: the string replaced the number, so the type is now str.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كم ينتج 3 * 1 ** 3؟ (تلميح الكتاب نفسه!)',
            en: 'What does 3 * 1 ** 3 produce? (the book’s own hint!)',
          },
          options: [
            { id: 'a', text: { ar: '27', en: '27' } },
            { id: 'b', text: { ar: '3', en: '3' } },
            { id: 'c', text: { ar: '9', en: '9' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الرفع ** يسبق الضرب: 1 ** 3 = 1، ثم 3 * 1 = 3. من ظن 27 حسب اليسار أولًا — نفس فخّ 2 ** 1 + 1.',
            en: 'Exponentiation outranks multiplication: 1 ** 3 = 1, then 3 * 1 = 3. If you guessed 27 you computed left first — the same trap as 2 ** 1 + 1.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي جملة تصف الإسناد x = 5 بدقة؟',
            en: 'Which sentence describes the assignment x = 5 precisely?',
          },
          options: [
            { id: 'a', text: { ar: 'تعبير ينتج قيمة تظهر على الشاشة', en: 'An expression producing a value shown on screen' } },
            { id: 'b', text: { ar: 'تعليمة تنفَّذ بصمت وتخزّن 5 في x', en: 'A statement executed silently, storing 5 in x' } },
            { id: 'c', text: { ar: 'سؤال تطرحه بايثون: هل x يساوي 5؟', en: 'A question Python asks: does x equal 5?' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الإسناد تعليمة كاملة تنفَّذ صامتة. (السؤال «هل يساوي؟» له رمز آخر تمامًا ستراه في الفصل الثالث.)',
            en: 'Assignment is a complete statement, executed silently. (The “does it equal?” question has a totally different symbol, arriving in chapter 3.)',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'وتذكّر الفصل الأول: print("2 * 3") — ماذا يظهر؟',
            en: 'And back to chapter 1: print("2 * 3") — what appears?',
          },
          options: [
            { id: 'a', text: { ar: '6', en: '6' } },
            { id: 'b', text: { ar: '2 * 3 حرفيًا', en: '2 * 3 literally' } },
            { id: 'c', text: { ar: 'خطأ قواعدي', en: 'A syntax error' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التنصيص جعلها نصًّا يُطبع كما هو — لا أسبقية ولا حساب داخل علامتي تنصيص أصلًا.',
            en: 'Quotes made it text printed as-is — no precedence or arithmetic exists inside quotes at all.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'x = 5\nX = x + 1\nprint(x)',
          right: 'x = 5\nx = x + 1\nprint(x)',
          note: {
            ar: 'x وX صندوقان مختلفان تمامًا: بايثون حساسة لحالة الأحرف. السطر الثاني أنشأ صندوقًا جديدًا وترك x عند 5 — وNameError بانتظار من يستدعي X في جهاز آخر الحروف.',
            en: 'x and X are two entirely different boxes: Python is case-sensitive. The second line created a new box and left x at 5 — and a NameError awaits whoever calls X later.',
          },
        },
        {
          wrong: 'print(2 ** 1 + 1)',
          right: 'print(2 ** (1 + 1))',
          note: {
            ar: 'أردت 2 مرفوعة لمجموع 1+1 لكن ** يسبق + فظهر 3. الأقواس تُعيد ترتيب الكارت — ضعها كلما خالط القصدُ الشكّ.',
            en: 'You meant 2 raised to the sum 1+1, but ** outranks + and 3 appeared. Parentheses reshuffle the cards — add them whenever intent mixes with doubt.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التعليمة أمر كامل يُنفَّذ (print، إسناد)، والتعبير ينتج قيمة — والمكتوب وحده صامت في النص البرمجي.', en: 'A statement is a complete executed command (print, assignment); an expression produces a value — and a bare one is silent in scripts.' },
        { ar: 'الترتيب: أقواس، ثم **، ثم * و /، ثم + و −، والمتساوي من اليسار إلى اليمين.', en: 'Order: parentheses, then **, then * and /, then + and −, with ties running left to right.' },
        { ar: 'الأقواس أداة الأمان والوضوح: ضعها كلما شككت، حتى لو لم تغيّر الناتج.', en: 'Parentheses are the safety-and-clarity tool: add them whenever you doubt, even if they change nothing.' },
      ],
      reflectPrompt: {
        ar: 'اذكر موقفًا من حياتك تحتاج فيه إلى «أقواس» — أي تحديد ترتيب الخطوات يدويًا خلافًا للعادة. كيف تشبه ذلك تعبيرًا حسابيًا؟',
        en: 'Name a life situation where you need “parentheses” — that is, manually fixing the order of steps against habit. How does it resemble an arithmetic expression?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch2.s4', pages: 'ص26-27 / pp.26-27' },
        { book: 'PY4E', section: 'py4e.ch2.s6', pages: 'ص28 / pp.28' },
        { book: 'PY4E', section: 'py4e.ch2.s7', pages: 'ص28-29 / pp.28-29' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch2.s4', pages: 'ص26-27 / pp.26-27' },
    { book: 'PY4E', section: 'py4e.ch2.s6', pages: 'ص28 / pp.28' },
    { book: 'PY4E', section: 'py4e.ch2.s7', pages: 'ص28-29 / pp.28-29' },
  ],
} satisfies Lesson;

export default lesson;
