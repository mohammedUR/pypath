import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch1.l6 — "Chapter 1 Review and Mini-Project / مراجعة الفصل 1 ومشروع مصغّر"
 * Aligned with PY4E ch1 s11 (التنقيح), s13 (فهرس المصطلحات), s14 (تمارين).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch1.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 1,
  title: { ar: 'مراجعة الفصل 1 ومشروع مصغّر', en: 'Chapter 1 Review and Mini-Project' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch1.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قبل خمسة دروس كانت print كلمة أجنبية، واليوم ستبني برنامجًا كاملًا بيدك الواحدة — خمسة أسطر تقدّمك للعالم. هذا هو سر التعلم: أن تنظر خلفك فجأة فتجد المسافة التي قطعتها أطول مما ظننت.',
        en: 'Five lessons ago print was a foreign word; today you will build a complete program with your own hands — five lines that introduce you to the world. That is the secret of learning: looking back and finding the distance you covered is longer than you thought.',
      },
    },
    {
      kind: 'predict',
      code: "print('تم!')\nprint('تم!')\nprint('تم!')",
      question: {
        ar: 'قبل المراجعة: هل تظهر كلمة «تم!» مرة واحدة مجمّعة، أم ثلاث مرات؟ وأي سطر يُنفَّذ أولًا؟',
        en: 'Before the review: does “تم!” appear once, all together, or three times? And which line executes first?',
      },
      reveal: {
        ar: 'ثلاث مرات، في ثلاثة أسطر، بالترتيب من الأعلى إلى الأسفل — كل print أمر مستقل والتنفيذ تسلسلي دائمًا. إن أجبت بثقة فأنت تملك قلب الفصل الأول كله.',
        en: 'Three times, on three lines, top to bottom — each print is its own command and execution is always sequential. If you answered with confidence, you already own the heart of chapter 1.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل الأول في دقيقتين', en: 'Chapter 1 in two minutes' },
      chunks: [
        {
          ar: 'بدأنا بالسؤال «لماذا نبرمج؟»: لأن الحاسوب سريع ومنضبط — وأنجز المهام المملة بلا خطأ. ثم فتّحنا الحاسوب: معالج يسأل «ماذا أنفّذ؟»، ذاكرة رئيسية سريعة منسية، ذاكرة ثانوية بطيئة متذكّرة، أجهزة دخل وخرج، وشبكة. وبعد ذلك تعلمنا كيف نكلمه: عبر المفسِّر الذي ينفّذ سطرًا سطرًا.',
          en: 'We started with “why program?”: because the computer is fast and obedient — it does boring tasks without error. Then we opened it up: a CPU asking “what next?”, fast-forgetting main memory, slow-but-persistent secondary memory, input/output devices, and a network. Then we learned to talk to it: through the interpreter that executes line by line.',
        },
        {
          ar: 'وكتبنا أول برنامج لنا بأمر print، وتعرّفنا على مكوّنات البرامج (دخل، خرج، تسلسل، شرط، تكرار، إعادة استخدام) وعلى الأخطاء الثلاثة: قواعدية تُكشف قبل التنفيذ، منطقية في الترتيب، ودلالية تعطي نتيجة خاطئة بصمت. والتنقيح هو فن قراءة رسالة الخطأ وتتبع الخلل — مهارة تمارينها اليوم.',
          en: 'We wrote our first program with print, met the building blocks (input, output, sequence, condition, repetition, reuse) and the three errors: syntax caught before execution, logic in ordering, semantic silently giving wrong results. Debugging is the art of reading the error message and tracing the flaw — and today’s exercises train exactly that.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-first',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تسخين ذاكرة: توقّع خرْج هذا الكود بالضبط دون تشغيله.',
        en: 'Memory warm-up: predict this code’s exact output without running it.',
      },
      code: "print('2 + 2')\nprint(2 + 2)",
      solution: '2 + 2\n4',
      answer: '2 + 2\n4',
      hints: [
        { ar: 'سطران: أحدهما بين تنصيص والآخر بلا.', en: 'Two lines: one inside quotes, one without.' },
        { ar: 'الموجود بين التنصيص يُطبع حرفيًا؛ والحساب بلا تنصيص يُنجَز قبل الطباعة.', en: 'Quoted content prints literally; unquoted arithmetic is computed before printing.' },
        { ar: 'السطر الأول نص: 2 + 2. السطر الثاني حساب: 4.', en: 'Line one is text: 2 + 2. Line two is arithmetic: 4.' },
        { ar: 'الخرْج:\n2 + 2\n4', en: 'The output:\n2 + 2\n4' },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المشروع المصغّر: بطاقة تعريف رقمية', en: 'Mini-project: your digital introduction card' },
      chunks: [
        {
          ar: 'مهمتك: برنامج من خمسة أسطر يقدّمك لمن يشغّله — تمامًا كما في تمارين الكتاب. البطاقة المثالية: سطر للترحيب واسمك، سطر لما تتعلمه (اذكر كلمة بايثون)، سطر لمدينتك أو هوايتك، سطر لهدفك البرمجي، وسطر ختامي لاذع بالذوق. استخدم print فقط، وسطرًا لكل معلومة.',
          en: 'Your task: a five-line program that introduces you to whoever runs it — just like the book’s exercises. The ideal card: a greeting line with your name, a line about what you are learning (mention the word Python), a line with your city or hobby, a line with your programming goal, and a tasteful closing line. Use print only, one line per fact.',
        },
        {
          ar: 'قبل أن تضغط «تحقق»: شغّل برنامجك بنفسك واقرأ الخرْج بعين المبرمج. هل الأسطر الخمسة كلها ظهرت؟ هل الترتيب منطقي؟ إن ظهر خطأ فاقرأ رسالته — التسلسل يقول لك: الخطأ يقف عند أول سطر فشل، وما قبله نجح.',
          en: 'Before pressing “Check”: run your program yourself and read the output with a programmer’s eye. Did all five lines appear? Is the order sensible? If an error appears, read its message — sequential execution tells you: the error sits at the first failed line, and everything before it succeeded.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نموذج للإلهام (لا تنسخه حرفيًا!)', en: 'A model to inspire you (do not copy it verbatim!)' },
      code: "print('مرحبًا، أنا ليلى')\nprint('أتعلم بايثون من الصفر')\nprint('من مدينة غزة')\nprint('هدفي: برنامج يحسب مصاريفي الشهرية')\nprint('شكرًا لقراءة بطاقتي!')",
      explanation: {
        ar: 'خمسة استدعاءات print، خمسة أسطر خرْج، بالترتيب المكتوب. لاحظ أن كل سطر معلومة واحدة — هذا يجعل البطاقة سهلة القراءة وسهلة التصحيح. الآن اكتب نسختك أنت في التمرين التالي؛ سيُقاس فيها عدد الأسطر وذكر كلمة بايثون.',
        en: 'Five print calls, five output lines, in written order. Notice each line carries one fact — that keeps the card easy to read and easy to fix. Now write your own version in the next exercise; it will be measured on line count and mentioning Python.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex2.card-project',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'مشروع الفصل الأول: اكتب برنامج بطاقة التعريف — خمسة أسطر على الأقل تقدّمك، أحدها يذكر كلمة بايثون. اجعلها بطاقتك أنت، لا بطاقة ليلى!',
        en: 'Chapter 1 project: write your introduction card — at least five lines introducing you, one of them mentioning Python. Make it YOUR card, not Leila’s!',
      },
      starterCode: '# بطاقة تعريفك الرقمية — خمسة أسطر / your digital card — five lines\n# print("...")\n',
      solution: "print('مرحبًا، أنا أحمد')\nprint('أتعلم بايثون من الصفر')\nprint('من مدينة عمّان')\nprint('هدفي: أن أفهم الذكاء الاصطناعي')\nprint('يوم سعيد لك!')",
      tests: [
        {
          id: 't1',
          name: { ar: 'خمسة أسطر على الأقل في الخرْج', en: 'At least five lines of output' },
          code: "lines = [l for l in __learner_output__.splitlines() if l.strip()]\nassert len(lines) >= 5, 'expected: at least 5 lines | actual: %d' % len(lines)",
          expected: '5 أسطر / 5 lines',
        },
        {
          id: 't2',
          name: { ar: 'سطر يذكر بايثون', en: 'A line mentions Python' },
          code: "assert 'بايثون' in __learner_output__ or 'Python' in __learner_output__, 'expected: a line mentioning بايثون/Python | actual: %r' % __learner_output__",
          expected: 'بايثون / Python',
        },
      ],
      hints: [
        { ar: 'كل سطر معلومة واحدة داخل استدعاء print مستقل.', en: 'One fact per line, each inside its own print call.' },
        { ar: 'لا تنسَ السطر الذي يذكر كلمة بايثون — هو شرط الاختبار.', en: 'Do not forget the line mentioning Python — the test requires it.' },
        { ar: 'الهيكل:\nprint("مرحبًا، أنا ___")\nprint("أتعلم بايثون ___")\nprint("من ___")\nprint("هدفي ___")\nprint("ختام")', en: 'The skeleton:\nprint("Hi, I am ___")\nprint("I am learning Python ___")\nprint("From ___")\nprint("My goal: ___")\nprint("Closing line")' },
        { ar: "print('مرحبًا، أنا أحمد')\nprint('أتعلم بايثون من الصفر')\nprint('من مدينة عمّان')\nprint('هدفي: أن أفهم الذكاء الاصطناعي')\nprint('يوم سعيد لك!')", en: "print('Hi, I am Ahmad')\nprint('I am learning Python from scratch')\nprint('From Amman')\nprint('My goal: understand AI')\nprint('Have a great day!')" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-syntax',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي نوع من الأخطاء الثلاثة يُكشف قبل أن ينفَّذ أول سطر من البرنامج؟',
        en: 'Which of the three error kinds is caught before the program’s first line executes?',
      },
      options: [
        { id: 'a', text: { ar: 'الخطأ القواعدي (SyntaxError)', en: 'The syntax error (SyntaxError)' } },
        { id: 'b', text: { ar: 'الخطأ الدلالي (Semantic)', en: 'The semantic error' } },
        { id: 'c', text: { ar: 'الخطأ المنطقي (Logic)', en: 'The logic error' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر: بايثون تفحص شيئًا ما قبل أن تلمس البرنامج.', en: 'Remember: Python checks something before touching the program.' },
        { ar: 'الترتيب الخاطئ والمعنى الخاطئ لا يعوقان التنفيذ إطلاقًا.', en: 'Wrong order and wrong meaning never block execution.' },
        { ar: 'هو الذي تراه حين تنسى قوسًا أو تنصيصًا.', en: 'It is the one you see when a parenthesis or quote goes missing.' },
        { ar: 'الجواب: القواعدي — بايثون تفحص القواعد قبل التنفيذ.', en: 'Answer: syntax — grammar is checked before anything runs.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.mcq-architecture',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'عودة إلى درس بنية الحاسوب: أي مكوّن يحتفظ ببرنامجك بعد إطفاء الحاسوب تمامًا؟',
        en: 'Back to the architecture lesson: which component keeps your program after the computer is fully powered off?',
      },
      options: [
        { id: 'a', text: { ar: 'الذاكرة الرئيسية (RAM)', en: 'Main memory (RAM)' } },
        { id: 'b', text: { ar: 'الذاكرة الثانوية (القرص)', en: 'Secondary memory (the disk)' } },
        { id: 'c', text: { ar: 'وحدة المعالجة (CPU)', en: 'The CPU' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'ذاكرتان: واحدة سريعة تنسى عند الإطفاء، وأخرى أبطأ تتذكّر.', en: 'Two memories: one fast and forgetful at power-off, one slower and remembering.' },
        { ar: 'الملفات وبرامج .py تعيش عليه حتى بلا كهرباء.', en: 'Files and .py programs live on it even without power.' },
        { ar: 'ليست الأسرع — لكنها الأوفرى للحفظ.', en: 'Not the fastest — but the keeper.' },
        { ar: 'الجواب: الذاكرة الثانوية.', en: 'Answer: secondary memory.' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-card',
      expectedError: 'SyntaxError',  // intentional crash-teaching; verified by checks replay
      required: true,
      brokenCode: "primt('بطاقتي')\nprint('أنا طالب برمجة'\nprint('هدفي إتقان بايثون')",
      prompt: {
        ar: 'بطاقة زميلك مكسورة فيها خطآن: أحدهما في الكلمة الأولى والآخر في السطر الثاني. أصلحهما حتى تُطبع الأسطر الثلاثة كاملة.',
        en: 'Your friend’s card has two bugs: one in the first word and one in the second line. Fix both so all three lines print.',
      },
      solution: "print('بطاقتي')\nprint('أنا طالب برمجة')\nprint('هدفي إتقان بايثون')",
      tests: [
        {
          id: 't1',
          name: { ar: 'يظهر سطر بطاقتي', en: 'The card-title line appears' },
          code: "assert 'بطاقتي' in __learner_output__, 'expected: بطاقتي in output | actual: %r' % __learner_output__",
          expected: 'بطاقتي',
        },
        {
          id: 't2',
          name: { ar: 'ثلاثة أسطر مكتملة', en: 'Three complete lines' },
          code: "lines = [l for l in __learner_output__.splitlines() if l.strip()]\nassert len(lines) >= 3, 'expected: at least 3 lines | actual: %d' % len(lines)",
          expected: '3 أسطر / 3 lines',
        },
      ],
      hints: [
        { ar: 'خطآن من عائلتين مختلفتين: أحدهما NameError والآخر SyntaxError.', en: 'Two bugs from two different families: one NameError, one SyntaxError.' },
        { ar: 'في السطر الأول: كلمة محجوزة مكتوبة بشكل لا يعرفه بايثون. في الثاني: قوس ينقص.', en: 'First line: a reserved word spelled unrecognizably. Second line: a missing parenthesis.' },
        { ar: 'primt → print. وأضف ) إلى نهاية السطر الثاني بعد التنصيص.', en: 'primt → print. And add ) to the end of the second line, after the closing quote.' },
        { ar: "print('بطاقتي')\nprint('أنا طالب برمجة')\nprint('هدفي إتقان بايثون')", en: "print('بطاقتي')\nprint('أنا طالب برمجة')\nprint('هدفي إتقان بايثون')" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — نسخة تجريبية من بطاقتك النهائية\n# Your playground — a draft of your final card\n\nprint("بطاقة تجريبية v0.1")\nprint("جرّب إضافة رموز: *** === ~~~")\nprint("أو أسطر فارغة بين المعلومات")',
      prompt: {
        ar: 'جرّب بنفسك: حسّن بطاقتك برموز فاصلة، أو أضف أسطرًا، أو جرّب print بلا تنصيص وشاهد رسالة الخطأ بصبور. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: polish your card with separator symbols, add lines, or try print without quotes and calmly watch the error. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'مراجعة شاملة: ماذا يفعل المفسِّر (interpreter) حين يشغّل برنامجك؟',
            en: 'Full-circle review: what does the interpreter do when it runs your program?',
          },
          options: [
            { id: 'a', text: { ar: 'يقرأ كودك وينفّذه سطرًا سطرًا', en: 'Reads your code and executes it line by line' } },
            { id: 'b', text: { ar: 'يترجمه كاملًا إلى ملف .exe ثم ينام', en: 'Translates it entirely into an .exe file then sleeps' } },
            { id: 'c', text: { ar: 'يخزنه في الذاكرة الثانوية بلا تنفيذ', en: 'Stores it in secondary memory without executing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المفسِّر محادثة: سطر يُقرأ ويُنفَّذ فورًا. المترجم هو من يترجم الكل دفعةً ويحفظ ملفًا تنفيذيًا.',
            en: 'The interpreter is a conversation: a line is read and executed immediately. It is the compiler that translates everything at once into an executable.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'من درس البنية: ما السؤال الوحيد الذي يطرحه المعالج ثلاثة مليارات مرة في الثانية؟',
            en: 'From the architecture lesson: what is the only question the CPU asks three billion times per second?',
          },
          options: [
            { id: 'a', text: { ar: '«ماذا أنفّذ التالي؟»', en: '“What do I execute next?”' } },
            { id: 'b', text: { ar: '«أين المستخدم؟»', en: '“Where is the user?”' } },
            { id: 'c', text: { ar: '«كم الساعة الآن؟»', en: '“What time is it?”' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'وبرنامجك هو الإجابة: تعليمات مخزَّنة مسبقًا يستدعيها المعالج في الوقت المناسب.',
            en: 'And your program is the answer: instructions stored ahead of time, fetched by the CPU at the right moment.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أكتب في ملف .py سطرًا وحيدًا: 7 + 3. ماذا يظهر على الشاشة عند التشغيل؟',
            en: 'I write a single line in a .py file: 7 + 3. What appears on screen when it runs?',
          },
          options: [
            { id: 'a', text: { ar: '10', en: '10' } },
            { id: 'b', text: { ar: 'لا شيء — التعبير المكتوب وحده صامت في النص البرمجي', en: 'Nothing — a bare expression is silent in a script' } },
            { id: 'c', text: { ar: '7 + 3 كما هي', en: '7 + 3 as-is' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'يُحسب الناتج ثم يُرمى بلا عرض. لعرضه: print(7 + 3). هذه فخّ يقع فيه كل مبتدئ مرة واحدة على الأقل.',
            en: 'The result is computed then discarded without display. To show it: print(7 + 3). Every beginner falls into this trap at least once.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'برنامج يعمل حتى النهاية بلا رسائل ثم يطبع 2 + 2 كـ 44. أي خطأ هذا؟',
            en: 'A program runs to the end with no messages, then prints 2 + 2 as 44. Which error is this?',
          },
          options: [
            { id: 'a', text: { ar: 'قواعدي', en: 'Syntax' } },
            { id: 'b', text: { ar: 'دلالي — تنفيذ ناجح ونتيجة خاطئة', en: 'Semantic — successful run, wrong result' } },
            { id: 'c', text: { ar: 'لا خطأ — 44 رقم جميل', en: 'No error — 44 is a lovely number' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الأخطاء الدلالية والمنطقية لا ترسل رسائل: البرنامج «ينجح» والنتيجة وحدها تفضح الخلل. لهذا نقرأ خرْجنا بعين منتقدة.',
            en: 'Semantic and logic errors send no messages: the program “succeeds” and only the result exposes the flaw. That is why we read our output with a critic’s eye.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'print "مرحبا"',
          right: "print('مرحبا')",
          note: {
            ar: 'أقواس print إلزامية في بايثون 3 — صيغة بلا أقواس من زمن بايثون 2 القديم وستوقفك برسالة SyntaxError: Missing parentheses.',
            en: 'The parentheses around print are mandatory in Python 3 — the no-parentheses form is from old Python 2 and stops you with SyntaxError: Missing parentheses.',
          },
        },
        {
          wrong: 'print(مرحبا)',
          right: "print('مرحبا')",
          note: {
            ar: 'بدون تنصيص يظن بايثون أن مرحبا اسم متغيّر، فيتوقف عند السطر برسالة NameError. كل نص يُطبع كما هو يحتاج علامتي تنصيص.',
            en: 'Without quotes Python thinks مرحبا is a variable name and stops at that line with NameError. Every literally-printed text needs quotes.',
          },
        },
        {
          wrong: 'primt("جاهز")',
          right: 'print("جاهز")',
          note: {
            ar: 'NameError في الكلمة المحجوزة نفسها: تهجئة print يجب أن تكون حرفًا بحرف. رسالة الخطأ تذكر الاسم غير المعروف — قارنها بالكلمة التي كتبتها.',
            en: 'A NameError on the reserved word itself: print must be spelled letter by letter. The error message names the unknown word — compare it with what you typed.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل الأول كله: لماذا نبرمج، بنية الحاسوب، المفسِّر، أول برنامج، المكوّنات والأخطاء الثلاثة.', en: 'All of chapter 1: why program, computer architecture, the interpreter, your first program, the building blocks and the three errors.' },
        { ar: 'البرنامج الحقيقي يُقرأ خرْجه بعين منتقدة: شغّل، انظر، صحّح، ثم تحقق.', en: 'A real program’s output is read with a critic’s eye: run, look, fix, then verify.' },
        { ar: 'رسالة الخطأ خريطة كنز: نوع المشكلة في أول كلمة، ومكانها التقريبي في السطر.', en: 'An error message is a treasure map: the problem type in its first word, its rough place in the line.' },
      ],
      reflectPrompt: {
        ar: 'قِمّ نفسك من 1 إلى 5 في وصف بطاقتك البرمجية، واذكر فكرة واحدة من الفصل الأول تعود إليها إن تعثرت.',
        en: 'Rate yourself 1 to 5 on your programming card, and name one idea from chapter 1 you will revisit if you get stuck.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch1.s11', pages: 'ص16-17 / pp.16-17' },
        { book: 'PY4E', section: 'py4e.ch1.s13', pages: 'ص18-19 / pp.18-19' },
        { book: 'PY4E', section: 'py4e.ch1.s14', pages: 'ص20 / pp.20' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch1.s11', pages: 'ص16-17 / pp.16-17' },
    { book: 'PY4E', section: 'py4e.ch1.s13', pages: 'ص18-19 / pp.18-19' },
    { book: 'PY4E', section: 'py4e.ch1.s14', pages: 'ص20 / pp.20' },
  ],
} satisfies Lesson;

export default lesson;
