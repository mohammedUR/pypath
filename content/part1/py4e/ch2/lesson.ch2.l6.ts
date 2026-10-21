import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch2.l6 — "Chapter 2 Review and Project: Temperature Converter /
 * مراجعة الفصل 2 ومشروع: مُحوِّل درجات الحرارة"
 * Aligned with PY4E ch2 s13 (التنقيح), s14 (فهرس المصطلحات), s15 (تمارين).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch2.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 2,
  title: { ar: 'مراجعة الفصل 2 ومشروع: مُحوِّل درجات الحرارة', en: 'Chapter 2 Review and Project: Temperature Converter' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch2.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أنت الآن تملك مجموعة الأدوات الافتتاحية كاملة: قيم بأنواعها، صناديق بأسماء وصفية، تعابير بترتيب محترم، عوامل تحسب وتقصّ، وinput يسمع المستخدم. حان وقت أول مشروع حقيقي يخدم حياة حقيقية: آلة تحوّل درجة الحرارة وتقول لك هل تحتاج معطفًا.',
        en: 'You now hold the complete opening toolkit: typed values, descriptively named boxes, well-ordered expressions, slicing-computing operators, and an input that listens. Time for your first real project serving real life: a machine that converts temperature and tells you whether to grab a coat.',
      },
    },
    {
      kind: 'predict',
      code: 'celsius = 30\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)',
      question: {
        ar: 'معادلة التحويل أمامك مباشرة. هل يظهر الجواب عددًا صحيحًا أم عائمًا؟ وكم يساوي؟',
        en: 'The conversion formula is right there. Will the answer be an integer or a float? And what is it?',
      },
      reveal: {
        ar: '86.0 — عدد عائم! تذكّر سرّ القسمة الحقيقية: 9 / 5 تنتج 1.8، فتلوث السلسلة كلها بالفاصلة. الأسبقية عملت بترتيبها: الضرب والقسمة أولًا ثم الجمع. إن أردت 86 صحيحة فستحتاج // — لكن الحرارة تحب دقتها.',
        en: '86.0 — a float! Remember the true-division secret: 9 / 5 produces 1.8, infecting the whole chain with a decimal point. Precedence worked in order: multiplication and division first, then addition. Want a clean 86? You would need // — but temperature likes its precision.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل الثاني في دقيقتين', en: 'Chapter 2 in two minutes' },
      chunks: [
        {
          ar: 'بدأنا بالقيم وأنواعها: int وfloat وstr — والتنصيص يصنع نصًّا من أي شيء، وtype() يكشف القناع. ثم جاء المتغيّر: صندوق مسمّى بقواعده (لا أرقام في البداية، لا كلمات مفتاحية) وأدبه (أسماء وصفية). وبعدها عرفنا الفرق بين تعليمة تنفَّذ وتعبير يُحسب، وسلّم PEMDAS الذي يرتب الحساب.',
          en: 'We started with values and types: int, float and str — quotes turn anything into text, and type() unmasks it. Then came the variable: a named box with rules (no leading digits, no keywords) and manners (descriptive names). Then we separated statements that execute from expressions that compute, and climbed the PEMDAS ladder that orders arithmetic.',
        },
        {
          ar: 'ثم توسعت العائلة: / حقيقية تعطي float، و// صحيحة، و% للحصول على الباقي وقصّ الخانات — وحتى تكرار النصوص بـ *. وانتهينا بإدخال المستخدم: input يعيد نصًّا دائمًا وint() يترجمة إلى عدد، والتعليقات # تهمس للبشر. كلها أدوات هذا المشروع.',
          en: 'Then the family grew: / true division giving floats, // floor division, % for remainders and digit-slicing — even string repetition with *. We ended with user input: input always returns text, int() translates it, and # comments whisper to humans. All of them are tools for this project.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-accum',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تسخين: تتبّع الصناديق سطرًا سطرًا وتوقّع الخرْج النهائي.',
        en: 'Warm-up: track the boxes line by line and predict the final output.',
      },
      code: 'x = 5\nx = x * 2\nx = x + 10\nprint(x)',
      solution: '20',
      answer: '20',
      hints: [
        { ar: 'كل سطر إسناد يقرأ القيمة القديمة ويخزّن الجديدة في نفس الصندوق.', en: 'Each assignment line reads the old value and stores the new one in the same box.' },
        { ar: '5 ثم 5 * 2 = 10 ثم 10 + 10.', en: '5, then 5 * 2 = 10, then 10 + 10.' },
        { ar: 'print يعرض آخر محتوى للصندوق.', en: 'print shows the box’s latest content.' },
        { ar: 'الخرْج: 20', en: 'The output: 20' },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المشروع: مُحوِّل درجات الحرارة', en: 'The project: a temperature converter' },
      chunks: [
        {
          ar: 'المعادلة العالمية: الدرجة بالفهرنهايت = الدرجة بالمئوية × 9 ÷ 5 + 32. مهمتك: عرّف متغيّر celsius بقيمة 25، واحسب fahrenheit بالمعادلة كما هي — بلا اختصار ولا إعادة ترتيب — ثم اطبع fahrenheit. النتيجة المتوقعة 77.0.',
          en: 'The universal formula: degrees Fahrenheit = degrees Celsius × 9 ÷ 5 + 32. Your task: define a variable celsius with the value 25, compute fahrenheit with the formula exactly as written — no shortcuts, no reordering — then print fahrenheit. The expected result is 77.0.',
        },
        {
          ar: 'قبل «تحقق»: شغّل برنامجك واقرأ الخرْج بعين منتقدة — عادة الاحتراف التي تعلمناها في نهاية الفصل الأول. ظهر 77.0؟ ممتاز. ظهر 13.0 أو 510.0؟ خطأ أسبقية صامت — ألقِ نظرة على أقواسك وأين وضعها المفسّر من دون إذنك.',
          en: 'Before “Check”: run your program and read the output with a critic’s eye — the pro habit from the end of chapter 1. Got 77.0? Excellent. Got 13.0 or 510.0? A silent precedence bug — look at your parentheses and where the interpreter placed them without your permission.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نموذج المحوّل: حرارة الجسم', en: 'The converter model: body temperature' },
      code: 'celsius = 37\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)',
      explanation: {
        ar: '37 درجة مئوية = 98.6 فهرنهايت — حرارة جسمك الطبيعية، محسوبة بثلاثة أسطر. لاحظ: الصندوق celsius يحمل المدخل، والصندوق fahrenheit يحمل الناتج، والمعادلة كُتبت كما في الكتب العلمية تمامًا. غيّر 37 إلى أي قيمة وأعد التشغيل.',
        en: '37 degrees Celsius = 98.6 Fahrenheit — your normal body temperature, computed in three lines. Notice: the celsius box holds the input, the fahrenheit box holds the result, and the formula is written exactly as in science books. Change 37 to any value and run again.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex2.converter-project',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'مشروع الفصل الثاني: عرّف celsius = 25، واحسب fahrenheit بالمعادلة celsius * 9 / 5 + 32، ثم اطبع fahrenheit. الهدف: 77.0 يظهر في الخرْج.',
        en: 'Chapter 2 project: define celsius = 25, compute fahrenheit with celsius * 9 / 5 + 32, then print fahrenheit. Goal: 77.0 appears in the output.',
      },
      starterCode: '# محوّل الحرارة — مشروع الفصل الثاني\n# the temperature converter — chapter 2 project\ncelsius = 25\n# fahrenheit = ...\n',
      solution: 'celsius = 25\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)',
      tests: [
        {
          id: 't1',
          name: { ar: 'celsius تساوي 25', en: 'celsius equals 25' },
          code: "assert celsius == 25, 'expected: 25 | actual: %r' % celsius",
          expected: '25',
        },
        {
          id: 't2',
          name: { ar: 'fahrenheit تساوي 77.0', en: 'fahrenheit equals 77.0' },
          code: "assert round(fahrenheit, 1) == 77.0, 'expected: 77.0 | actual: %r' % fahrenheit",
          expected: '77.0',
        },
      ],
      hints: [
        { ar: 'انسخ المعادلة حرفيًا: celsius * 9 / 5 + 32 — بلا أقواس إضافية.', en: 'Copy the formula literally: celsius * 9 / 5 + 32 — no extra parentheses.' },
        { ar: 'الإسناد يحسب اليمين أولًا ثم يخزّنه في fahrenheit.', en: 'Assignment computes the right side first, then stores it in fahrenheit.' },
        { ar: 'الهيكل:\ncelsius = 25\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)', en: 'The skeleton:\ncelsius = 25\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)' },
        { ar: 'celsius = 25\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)', en: 'celsius = 25\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.numeric-parens',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: كم ناتج (2 + 3) * 4؟',
        en: 'Without running: what is (2 + 3) * 4?',
      },
      answer: '20',
      solution: '20',
      tolerance: 0,
      hints: [
        { ar: 'الأقواس لها الكلمة الأولى في PEMDAS.', en: 'Parentheses get the first word in PEMDAS.' },
        { ar: 'احسب داخل القوسين أولًا: 2 + 3.', en: 'Compute inside the parentheses first: 2 + 3.' },
        { ar: 'ثم اضرب الناتج في 4.', en: 'Then multiply the result by 4.' },
        { ar: 'الجواب: 20.', en: 'Answer: 20.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.mcq-true-division',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في مشروعك ظهر 77.0 لا 77 — السبب ظهر في المعادلة. أي عامل هو المسؤول عن ظهور الفاصلة؟',
        en: 'Your project printed 77.0, not 77 — the culprit hides in the formula. Which operator is responsible for the decimal point?',
      },
      options: [
        { id: 'a', text: { ar: 'الضرب *', en: 'Multiplication *' } },
        { id: 'b', text: { ar: 'القسمة الحقيقية / التي تنتج float دائمًا', en: 'True division / which always produces a float' } },
        { id: 'c', text: { ar: 'الجمع +', en: 'Addition +' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'تذكّر درس العوامل: أي عامل منها «ملوّث» بالكسور دائمًا؟', en: 'Remember the operators lesson: which one is always “contaminated” with fractions?' },
        { ar: '9 / 5 = 1.8 — والقسمة الصحيحة 9 // 5 = 1.', en: '9 / 5 = 1.8 — while floor division 9 // 5 = 1.' },
        { ar: 'هي نفسها التي أعطت 59 / 60 = 0.9833…', en: 'It is the same one that gave 59 / 60 = 0.9833…' },
        { ar: 'الجواب: القسمة الحقيقية / — أما // فكانت ستنتج عددًا صحيحًا.', en: 'Answer: true division / — floor division // would have produced an integer.' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-converter',
      required: true,
      brokenCode: "celsius = 25\nfahrenheit = celsius * 9 / 5 + 32\nprint('fahrenheit')",
      prompt: {
        ar: 'محوّل زميلك يعمل بلا أي رسالة خطأ — لكنه يطبع كلمة fahrenheit بدل درجة الحرارة! هذا خطأ دلالي صامت. شخّصه وأصلحه ليطبع 77.0.',
        en: 'Your friend’s converter runs with no error message — but it prints the word fahrenheit instead of the temperature! A silent semantic error. Diagnose it and fix it so it prints 77.0.',
      },
      solution: "celsius = 25\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)",
      tests: [
        {
          id: 't1',
          name: { ar: 'يُطبع 77.0 بالضبط', en: 'Exactly 77.0 is printed' },
          code: "assert __learner_output__.strip() == '77.0', 'expected: 77.0 | actual: %r' % __learner_output__.strip()",
          expected: '77.0',
        },
      ],
      hints: [
        { ar: 'التنفيذ نجح والنتيجة خاطئة — تذكّر درس الأخطاء الثلاثة: هذا عائلته الدلالية.', en: 'The run succeeded and the result is wrong — remember the three errors lesson: this one is in the semantic family.' },
        { ar: 'انظر إلى سطر print وأسئلة التنصيص: ما الذي يجعل بايثون تطبع الكلمة نفسها؟', en: 'Look at the print line and the quotes: what makes Python print the word itself?' },
        { ar: 'التنصيص حول fahrenheit حوّل الاسم إلى نص حرفي. أزل علامتي التنصيص لطباعة محتوى الصندوق.', en: 'The quotes around fahrenheit turned the name into literal text. Remove the quotes to print the box’s content.' },
        { ar: "print(fahrenheit)", en: "print(fahrenheit)" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — معمل درجات الحرارة\n# Your playground — the temperature lab\n\nc = 100\nf = c * 9 / 5 + 32\nprint(f)   # ماء يغلي / water boils\nc2 = 0\nprint(c2 * 9 / 5 + 32)   # تجمّد الماء / water freezes',
      prompt: {
        ar: 'جرّب بنفسك: حوّل درجات من حياتك — حرارة الفرن، يوم الصيف الحارق، يوم الشتاء البارد. ثم عكس المعادلة (الفهرنهايت إلى مئوية) يحتاج أقواسًا ذكية: جرّب (f - 32) * 5 / 9. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: convert temperatures from your life — oven heat, a burning summer day, a freezing winter one. Then reverse the formula (Fahrenheit to Celsius) with clever parentheses: try (f - 32) * 5 / 9. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'من الفصل الأول: برنامج يعمل حتى النهاية بلا رسائل ويعطي نتيجة خاطئة — عائلة أي خطأ؟',
            en: 'From chapter 1: a program runs to the end with no messages and gives a wrong result — which error family?',
          },
          options: [
            { id: 'a', text: { ar: 'قواعدية', en: 'Syntax' } },
            { id: 'b', text: { ar: 'دلالية أو منطقية', en: 'Semantic or logic' } },
            { id: 'c', text: { ar: 'لا خطأ — التصميم هكذا', en: 'No error — it is designed that way' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'وهذا بالضبط نوع خطأ سطر print("fahrenheit") في تمرين التصحيح: تنفيذ ناجح، معنى خاطئ.',
            en: 'Exactly the family of the print("fahrenheit") bug in the debugging exercise: a successful run with a wrong meaning.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'من أول الفصل: type("3.2") تجيب…',
            en: 'From the chapter’s start: type("3.2") answers…',
          },
          options: [
            { id: 'a', text: { ar: '<class \'float\'>', en: '<class \'float\'>' } },
            { id: 'b', text: { ar: '<class \'str\'>', en: '<class \'str\'>' } },
            { id: 'c', text: { ar: '<class \'int\'>', en: '<class \'int\'>' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التنصيص حكم نهائي: "3.2" نص من محارف، لا عدد عائم — مثل "25" في درس input.',
            en: 'Quotes are the final verdict: "3.2" is a string of characters, not a float — just like "25" in the input lesson.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'من درس الأسماء: أي اسم متغيّر قانوني وبأسلوب محترف؟',
            en: 'From the naming lesson: which variable name is legal and pro-style?',
          },
          options: [
            { id: 'a', text: { ar: '2nd_temp', en: '2nd_temp' } },
            { id: 'b', text: { ar: 'body_temp_celsius', en: 'body_temp_celsius' } },
            { id: 'c', text: { ar: 'class', en: 'class' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'وصفي، يبدأ بحرف، بلا كلمات محجوزة — الثلاثة معًا. الأول يبدأ برقم والثالث كلمة مفتاحية.',
            en: 'Descriptive, starts with a letter, no reserved words — all three at once. The first starts with a digit; the third is a keyword.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'المستخدم «كتب» 25 أمام input. كيف تحصل على عدد تضربه في 9؟',
            en: 'The user “typed” 25 at input. How do you get a number you can multiply by 9?',
          },
          options: [
            { id: 'a', text: { ar: 'int(input()) ثم اضرب', en: 'int(input()) then multiply' } },
            { id: 'b', text: { ar: 'اضرب مباشرة — بايثون تفهم', en: 'Multiply directly — Python understands' } },
            { id: 'c', text: { ar: 'type(input())', en: 'type(input())' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'input يعيد نصًّا دائمًا، وint() يترجمة إلى عدد. بلا التحويل: TypeError عند الضرب. (اكتشفنا سرًّا إضافيًا: النص * عدد صحيح يكرر النص — لذلك التحويل أهم من أي وقت.)',
            en: 'input always returns text, and int() translates it to a number. Without conversion: TypeError at multiplication. (Bonus secret discovered: string * integer repeats the string — so conversion matters more than ever.)',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'fahrenheit = celsius * (9 / 5 + 32)',
          right: 'fahrenheit = celsius * 9 / 5 + 32',
          note: {
            ar: 'قوس في المكان الخاطئ: 25 × 38.8 = 970 بدل 77 — تنفيذ سليم ونتيجة مروعة. الأقواس سلاح ذو حدين: لا تضعها إلا حيث تريد التدخل فعلًا.',
            en: 'A parenthesis in the wrong place: 25 × 38.8 = 970 instead of 77 — a clean run with a horrible result. Parentheses are double-edged: place them only where you truly intend to intervene.',
          },
        },
        {
          wrong: "print(fahrenheit + ' درجة')",
          right: "print(fahrenheit)",
          note: {
            ar: 'رقم + نص = TypeError. كلا العالمين لا يختلطان في + — اطبع الرقم وحده الآن، وستتعلم فنون الخلط الآمن في دروس قادمة.',
            en: 'Number + text = TypeError. The two worlds do not mix in + — print the number alone for now; the arts of safe mixing come in later lessons.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل الثاني كله: أنواع، متغيّرات مسمّاة بحكمة، تعليمات وتعبيرات، PEMDAS، عوامل القسمة الثلاثة، input وint، والتعليقات.', en: 'All of chapter 2: types, wisely named variables, statements vs expressions, PEMDAS, the three division operators, input and int, and comments.' },
        { ar: 'المعادلة العلمية تُترجم إلى كود كما هي — والأقواس فقط حيث تريد تغيير الترتيب.', en: 'A scientific formula translates to code as written — parentheses only where you mean to change the order.' },
        { ar: 'الخطأ الدلالي الصامت (print("fahrenheit")) أخطر أنواع الأخطاء: لهذا نقرأ الخرْج بعين منتقدة بعد كل تشغيل.', en: 'The silent semantic error (print("fahrenheit")) is the most dangerous kind — that is why we read output with a critic’s eye after every run.' },
      ],
      reflectPrompt: {
        ar: 'محوّل الحرارة أول برنامج «مفيد» لك. ما الشيء الذي تقيسه في حياتك وسيصبح مشروعك القادم؟ اذكره بجملة — وسنحتفظ به للأفكار.',
        en: 'The converter is your first “useful” program. What do you measure in your life that could become your next project? Name it in one sentence — we will keep it for ideas.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch2.s13', pages: 'ص34 / pp.34' },
        { book: 'PY4E', section: 'py4e.ch2.s14', pages: 'ص35-36 / pp.35-36' },
        { book: 'PY4E', section: 'py4e.ch2.s15', pages: 'ص37-38 / pp.37-38' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch2.s13', pages: 'ص34 / pp.34' },
    { book: 'PY4E', section: 'py4e.ch2.s14', pages: 'ص35-36 / pp.35-36' },
    { book: 'PY4E', section: 'py4e.ch2.s15', pages: 'ص37-38 / pp.37-38' },
  ],
} satisfies Lesson;

export default lesson;
