import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch1.l4 — "Your First Program / أول برنامج لك"
 * Aligned with PY4E ch1 s7 (كتابة برنامج), s8 (ما هو البرنامج؟).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch1.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 1,
  title: { ar: 'أول برنامج لك', en: 'Your First Program' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch1.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'منذ خمسين عامًا طبع مبرمجون جملة Hello world! كأول برنامج لهم، ومنذ ذلك اليوم وهي الباب الذي يمرّ منه كل مبرمج في العالم. بعد دقائق قليلة ستدخل أنت من هذا الباب — وبرنامجك الأول سيكون أطول جملة بكثير من مجرد تحية.',
        en: 'Fifty years ago programmers printed Hello world! as their first program, and ever since, every programmer in the world has walked through that same door. In a few minutes you will walk through it too — and your first program will say much more than a greeting.',
      },
    },
    {
      kind: 'predict',
      expectedError: 'SyntaxError',  // intentional crash-teaching; verified by checks replay
      code: "print('Hello world!'",
      question: {
        ar: 'قوسٌ يغيب في لحظة تشتّت. هل يطبع بايثون النص ناقصًا، أم يرفض البرنامج كلّه؟',
        en: 'One parenthesis goes missing in a moment of distraction. Does Python print the text anyway, or refuse the whole program?',
      },
      reveal: {
        ar: 'يرفضه كلّه: SyntaxError. أخطاء القواعد تُكشف قبل التنفيذ — بايثون تفحص البرنامج كله أولًا، فإن لم يكن سليمًا لم ينفّذ منه شيئًا، حتى الأسطر الصحيحة. القوس الفاتح يحتاج قوسًا مغلقًا: الأقواس أزواج.',
        en: 'It refuses it entirely: SyntaxError. Grammar errors are caught before execution — Python checks the whole program first, and if it is not well-formed, nothing runs, not even the correct lines. An opening parenthesis needs its closing partner: parentheses come in pairs.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'print ليست مجرد كلمة: إنها استدعاء', en: 'print is not just a word: it is a call' },
      chunks: [
        {
          ar: 'print اسم دالة، والقوسان بعدها يعنيان «استدعِها الآن». داخل القوسين تضع الوسيطة: الشيء الذي تريدها أن تطبعه — نصًا كان أو رقمًا. print(17) تطبع 17، وprint("17") تطبع النص 17. الحساب داخل القوسين يُنجز أولًا: print(2 + 3) تطبع 5.',
          en: 'print is a function name, and the parentheses after it mean “call it now”. Inside the parentheses you place the argument: the thing you want printed — text or a number. print(17) prints 17, and print("17") prints the text 17. Arithmetic inside the parentheses is done first: print(2 + 3) prints 5.',
        },
        {
          ar: 'وبعد كل طباعة تنزل بايثون سطرًا جديدًا تلقائيًا. لهذا لو استدعيت print مرتين ظهر كل ناتج في سطر مستقل — وهي أسهل طريقة لبناء فقرات كاملة من مخرجاتك.',
          en: 'And after each print, Python moves to a new line automatically. That is why calling print twice shows each result on its own line — the easiest way to build whole paragraphs of output.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'النصوص تحتاج علامات تنصيص — أيًّا كانت', en: 'Text needs quotes — either kind' },
      chunks: [
        {
          ar: 'النص (السلسلة النصية) يُوضع بين علامتي تنصيص مزدوجة "..." أو مفردة \'...\' — والاثنتان صحيحتان، فاختر واحدة وأغلقه بنفسه. وميزة جميلة: النص العربي يعمل بكل بساطة داخل التنصيص، فهذه لغة عالمية.',
          en: 'Text (a string) goes between double quotes "..." or single quotes \'...\' — both are valid; pick one and close with the same one. And a lovely bonus: Arabic text works inside quotes with zero fuss — this is a global language.',
        },
        {
          ar: 'قاعدة ذهبية: ما بين التنصيص نصٌّ يُطبع كما هو حرفيًا، وما خارجه أمرٌ تفهمه بايثون. لذلك print("2 + 3") تطبع الحروف نفسها، بينما print(2 + 3) تحسب وتطبع 5. وحين تنسى التنصيص سترى NameError يقول لك إن الكلمة ليست اسمًا معروفًا.',
          en: 'Golden rule: what is inside quotes is text printed literally, and what is outside is a command Python understands. So print("2 + 3") prints the characters themselves, while print(2 + 3) computes and prints 5. If you forget the quotes you will see NameError saying the word is not a known name.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.two-lines',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب أول برنامج حقيقي لك من سطرين: السطر الأول يطبع Hello world! والسطر الثاني يطبع اسمك (أي اسم تريد).',
        en: 'Write your first real two-line program: the first line prints Hello world! and the second prints your name (any name you like).',
      },
      starterCode: '# سطران: تحية ثم اسمك / two lines: a greeting then your name\n',
      solution: "print('Hello world!')\nprint('سارة')",
      tests: [
        {
          id: 't1',
          name: { ar: 'السطر الأول: تحية Hello world!', en: 'First line: the Hello world! greeting' },
          code: "lines = [l for l in __learner_output__.splitlines() if l.strip()]\nassert lines and lines[0].strip() == 'Hello world!', 'expected: Hello world! as first line | actual: %r' % __learner_output__",
          expected: 'Hello world!',
        },
        {
          id: 't2',
          name: { ar: 'يظهر سطران على الأقل', en: 'At least two lines appear' },
          code: "lines = [l for l in __learner_output__.splitlines() if l.strip()]\nassert len(lines) >= 2, 'expected: at least 2 lines | actual: %d' % len(lines)",
          expected: 'سطران / 2 lines',
        },
      ],
      hints: [
        { ar: 'استدعاء print لكل سطر: اثنان من الاستدعاءات وراء بعض.', en: 'One print call per line: two calls, one after the other.' },
        { ar: 'كل نص — التحية واسمك — بين علامتي تنصيص، وكل قوس يُغلق.', en: 'Every text — the greeting and your name — inside quotes, every parenthesis closed.' },
        { ar: 'الهيكل:\nprint("Hello world!")\nprint("اسمك")', en: 'The skeleton:\nprint("Hello world!")\nprint("your name")' },
        { ar: "print('Hello world!')\nprint('سارة')", en: "print('Hello world!')\nprint('Sarah')" },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'بطاقة تعريف صغيرة', en: 'A little introduction card' },
      code: "print('مرحبًا! أنا سارة')\nprint('أتعلم بايثون من الصفر')\nprint('أحب: الكتب، القهوة، والأكواد القصيرة')",
      explanation: {
        ar: 'هذا برنامج من ثلاث تعليمات: تُنفَّذ من الأعلى إلى الأسفل، كل print يطبع سطرًا وينزل. لاحظ الفواصل والنقطتين داخل النصوص — كل شيء بين التنصيص يظهر حرفيًا. اضغط «شغّل المثال»، ثم انسخ الفكرة لنفسك في الملعب.',
        en: 'This is a three-instruction program: executed top to bottom, each print shows one line and moves down. Notice commas and the colon inside the texts — everything between quotes appears literally. Press “Run the example”, then copy the idea for yourself in the playground.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-quotes',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود بهدوء وتوقّع خرْجه بالضبط — سطرًا سطرًا — دون تشغيله. اكتب ما سيظهر.',
        en: 'Read the code quietly and predict its exact output — line by line — without running it. Type what will appear.',
      },
      code: "print('5')\nprint(5)",
      solution: '5\n5',
      answer: '5\n5',
      hints: [
        { ar: 'سطران، كل واحد يطبع شيئًا يبدو كرقم 5.', en: 'Two lines, each printing something that looks like the digit 5.' },
        { ar: 'السطر الأول يطبع نصًّا بين تنصيص، والثاني يطبع رقمًا حقيقيًا.', en: 'The first line prints text in quotes; the second prints a real number.' },
        { ar: 'على الشاشة يبدوان متطابقين — لكن أحدهما نص والآخر رقم، كما ستتعرف في الفصل الثاني.', en: 'On screen they look identical — but one is text and one is a number, as you will discover in chapter 2.' },
        { ar: 'الخرْج سطران، كل منهما: 5', en: 'The output is two lines, each: 5' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-valid-line',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي الأسطر الثلاثة يطبع كلمة مرحبا بلا أي خطأ؟',
        en: 'Which of the three lines prints مرحبا without any error?',
      },
      options: [
        { id: 'a', text: { ar: "print('مرحبا')", en: "print('مرحبا')" } },
        { id: 'b', text: { ar: "print('مرحبا'", en: "print('مرحبا'" } },
        { id: 'c', text: { ar: "print['مرحبا']", en: "print['مرحبا']" } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'استدعاء الدالة يحتاج قوسين عاديين ( … ) وليس مربعين [ … ].', en: 'Calling a function needs round parentheses ( … ), not square brackets [ … ].' },
        { ar: 'كل قوس فتح يحتاج قوسًا يغلقه.', en: 'Every opened parenthesis needs its closing one.' },
        { ar: 'الخيار الوحيد الذي جمع التنصيص الكامل والقوسين الكاملين.', en: 'Only one option has both complete quotes and complete parentheses.' },
        { ar: 'الجواب: print("مرحبا") بقوسين كاملين.', en: 'Answer: print("مرحبا") with full parentheses.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — اكتب بطاقتك الكاملة\n# Your playground — write your full card\n\nprint("مرحبًا! أنا ___")\nprint("من مدينة ___")\nprint("حلمي البرمجي: ___")',
      prompt: {
        ar: 'جرّب بنفسك: أكمل البطاقة بمعلوماتك، وأضف سطرًا رابعًا وخامسًا. جرّب أيضًا طباعة أرقام بلا تنصيص. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: complete the card with your details, then add a fourth and fifth line. Also try printing numbers without quotes. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'نعود لدرس المفسِّر: عند تشغيل نص برمجي، كيف ينفّذ بايثون أسطر برنامجك؟',
            en: 'Back to the interpreter lesson: when a script runs, how does Python execute your lines?',
          },
          options: [
            { id: 'a', text: { ar: 'بالترتيب من الأول إلى الأخير، واحدًا تلو الآخر', en: 'In order, first to last, one by one' } },
            { id: 'b', text: { ar: 'من الأخير إلى الأول', en: 'From last to first' } },
            { id: 'c', text: { ar: 'بترتيب عشوائي أسرع', en: 'In a faster random order' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التنفيذ تسلسلي دائمًا: سطرًا سطرًا من الأعلى إلى الأسفل. لهذا يهم ترتيب أسطر print في بطاقتك.',
            en: 'Execution is always sequential: line by line, top to bottom. That is why the order of your print lines matters.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا سيطبع هذا السطر؟  print("2 + 3")',
            en: 'What does this line print?  print("2 + 3")',
          },
          options: [
            { id: 'a', text: { ar: '5', en: '5' } },
            { id: 'b', text: { ar: '2 + 3', en: '2 + 3' } },
            { id: 'c', text: { ar: 'خطأ', en: 'An error' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'داخل التنصيص نص يُطبع حرفيًا. الحساب يتطلب إزالة التنصيص: print(2 + 3) هي التي تطبع 5.',
            en: 'Inside quotes it is text printed literally. Computing requires removing the quotes: print(2 + 3) is what prints 5.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'نسيَ مبرمج مبتدئ قوس الإغلاق في print("Hi"  . أي نوع من الأخطاء سيظهر؟',
            en: 'A beginner forgot the closing parenthesis in print("Hi"  . Which kind of error appears?',
          },
          options: [
            { id: 'a', text: { ar: 'خطأ قواعدي (SyntaxError) — يُكشف قبل التنفيذ', en: 'A syntax error (SyntaxError) — caught before execution' } },
            { id: 'b', text: { ar: 'خطأ دلالي — يطبع نتيجة خاطئة بصمت', en: 'A semantic error — silently prints a wrong result' } },
            { id: 'c', text: { ar: 'لا خطأ — يطبع Hi عادي', en: 'No error — it prints Hi normally' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'بايثون تفحص القواعد أولًا؛ البرنامج الناقص القوس لا ينفَّذ إطلاقًا. رسالة الخطأ ستشير إلى موضع الشك تقريبًا.',
            en: 'Python checks grammar first; a program missing a parenthesis never runs at all. The error message points roughly at the suspect spot.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي برنامجك الأول ظهرت كل جملة في سطر مستقل. ما السبب؟',
            en: 'In your first program each sentence appeared on its own line. Why?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن print تنزل سطرًا جديدًا بعد كل طباعة', en: 'Because print moves to a new line after each printout' } },
            { id: 'b', text: { ar: 'لأن الشاشة تقطع النص الطويل', en: 'Because the screen cuts long text' } },
            { id: 'c', text: { ar: 'لأن التنصيص يفرض سطورًا', en: 'Because quotes force line breaks' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'print تطبع ثم تنزل سطرًا تلقائيًا. سلوك مريح يجعل كل استدعاء = سطر خرْج.',
            en: 'print outputs then moves to a new line automatically. A convenient behavior: each call = one output line.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "print('Hello world!'",
          right: "print('Hello world!')",
          note: {
            ar: 'نسيان قوس الإغلاق يوقف البرنامج كله برسالة SyntaxError قبل أن يُطبع أي حرف. عدّ أقواسك: كل فتح يحتاج إغلاقًا.',
            en: 'Forgetting the closing parenthesis stops the whole program with a SyntaxError before a single character prints. Count your parentheses: every open needs a close.',
          },
        },
        {
          wrong: 'print(Hello world!)',
          right: "print('Hello world!')",
          note: {
            ar: 'النص بلا تنصيص يُقرأ كأسماء أمراض لا يعرفها بايثون: NameError: name «Hello» is not defined. أي نص تريد طباعته كما هو يحتاج علامتي تنصيص.',
            en: 'Unquoted text is read as names Python has never heard of: NameError: name “Hello” is not defined. Any text you want printed as-is needs quotes.',
          },
        },
        {
          wrong: "print('it's me')",
          right: "print(\"it's me\")",
          note: {
            ar: 'لو أردت الفاصلة العليا داخل النص المفرد، أغلق النص بالمزدوجة بدلًا منها — وإلا ظنّ بايثون أن النص انتهى مبكرًا وثارت SyntaxError.',
            en: 'If you need an apostrophe inside single-quoted text, wrap the text in double quotes instead — otherwise Python thinks the text ended early and raises a SyntaxError.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'print() استدعاء دالة: الاسم، ثم قوسان، بداخلهما ما تريد طباعته — نصًّا أو رقمًا أو حسابًا.', en: 'print() is a function call: the name, then parentheses holding what to print — text, a number, or arithmetic.' },
        { ar: 'النصوص بين علامتي تنصيص (مفردة أو مزدوجة)، والنص العربي يعمل بلا أي تعقيد.', en: 'Text goes between quotes (single or double), and Arabic text works with zero fuss.' },
        { ar: 'البرنامج تعليمات تُنفَّذ بترتيبها، وكل print ينتج سطر خرْج ثم ينزل.', en: 'A program is instructions executed in order, and each print produces one output line then moves down.' },
      ],
      reflectPrompt: {
        ar: 'برنامجك الأول طبع بطاقة تعريف. لو أضفت سطرًا سادسًا يقول شيئًا واحدًا عنك لكل من يشغّل برنامجك — ماذا سيقول؟',
        en: 'Your first program printed a small card. If you added a sixth line saying one thing about you to everyone who runs your program — what would it say?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch1.s7', pages: 'ص12 / pp.12' },
        { book: 'PY4E', section: 'py4e.ch1.s8', pages: 'ص12-13 / pp.12-13' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch1.s7', pages: 'ص12 / pp.12' },
    { book: 'PY4E', section: 'py4e.ch1.s8', pages: 'ص12-13 / pp.12-13' },
  ],
} satisfies Lesson;

export default lesson;
