import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch1.l1 — "Why Program? / لماذا نتعلّم البرمجة؟"
 * Reference lesson with the full anatomy. All expression is original,
 * aligned with PY4E ch1 sections s1, s3, s12 (see sources below).
 */
const lesson = {
  id: 'py4e.ch1.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 1,
  title: { ar: 'لماذا نتعلّم البرمجة؟', en: 'Why Program?' },
  estimatedMinutes: 15,
  prerequisites: [],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'تخيّل أنك تريد معرفة أكثر كلمة تكرارًا في كتاب من ثلاثمئة صفحة. أنت ستقرأ وتعدّ بأصابعك أيامًا طويلة… الحاسوب يفعلها في ثوانٍ، بلا ملل وبلا خطأ. البرمجة هي فنّ أن تعطيه هذه التعليمات الدقيقة — وفي هذا الدرس ستكتب أول أمر لها.',
        en: 'Imagine you want to find the most frequent word in a three-hundred-page book. You would read and count on your fingers for days… a computer does it in seconds, without boredom and without mistakes. Programming is the art of giving it those precise instructions — and in this lesson you will write your first one.',
      },
    },
    {
      kind: 'predict',
      code: "print('Hello world!')",
      question: {
        ar: 'قبل أن نشرح أي شيء: ماذا سيطبع هذا السطر؟ اختر توقّعًا من رأسك، ثم اكشف.',
        en: 'Before we explain anything: what will this line print? Make a guess first, then reveal.',
      },
      reveal: {
        ar: "سيطبع بالضبط: Hello world! — دون علامتي التنصيص. علامتا التنصيص تُخبران بايثون «هذا نصّ»، وما بينهما فقط هو ما يظهر على الشاشة.",
        en: "It prints exactly: Hello world! — without the quotes. The quotes tell Python “this is text”, and only what is between them appears on screen.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الحاسوب يحتاج تعليمات دقيقة', en: 'Computers need precise instructions' },
      chunks: [
        {
          ar: 'الحاسوب ليس ذكيًا؛ هو سريع جدًا ومنضبط جدًا. ينفّذ ما تقوله له حرفيًا، بترتيب، من أول سطر إلى آخر سطر. لذلك حين لا يعمل برنامجك، فالخلل غالبًا في التعليمات لا في الآلة — وهذا خبر ممتاز: لأنك تستطيع إصلاح تعليماتك.',
          en: 'A computer is not smart; it is just very fast and very obedient. It executes exactly what you tell it, in order, from the first line to the last. So when your program misbehaves, the flaw is usually in the instructions, not the machine — and that is great news: you can fix your instructions.',
        },
        {
          ar: 'البرمجة إذًا كتابة وصفة يفهمها الحاسوب: خطوات مرقّمة، لا افتراضات فيها ولا «أنت تعرف قصدي». بايثون من أسهل اللغات لكتابة هذه الوصفات، لأن شكلها قريب من اللغة البشرية، وتعمل على كل الأجهزة تقريبًا.',
          en: 'Programming, then, is writing a recipe the computer understands: numbered steps, no assumptions, no “you know what I mean”. Python is one of the easiest languages for writing such recipes, because it looks close to human language and runs on almost every device.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'برامجنا تتكلّم مع البيانات', en: 'Our programs talk to data' },
      chunks: [
        {
          ar: 'كل البرامج — من لعبة صغيرة إلى محرّك بحث — تقريبًا تفعل الشيء نفسه: تأخذ بيانات (كلمات، أرقام، صور)، تعالجها، ثم تُخرج نتيجة. قدّامك الآن أبسط أمر للإخراج: print. أمرٌ يقول لبايثون «أظهر هذا على الشاشة».',
          en: 'Almost every program — from a tiny game to a search engine — does the same thing: it takes data (words, numbers, images), processes it, and produces a result. Right now you are meeting the simplest output command: print. It tells Python “show this on the screen”.',
        },
        {
          ar: 'ولكي يفهم بايثون أن ما بين القوسين نصٌّ وليس أمرًا، نضعه بين علامتي تنصيص "..." أو \'...\'. جرّب أن تتوقّع: ما الفرق بين print(2 + 3) وprint("2 + 3")؟ الأول يحسب ويطبع 5، والثاني يطبع النص كما هو.',
          en: 'And so Python understands that what is inside the parentheses is text and not a command, we wrap it in quotes "..." or \'...\'. Try to predict: what is the difference between print(2 + 3) and print("2 + 3")? The first computes and prints 5; the second prints the text as-is.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'أول أمرين لك', en: 'Your first two commands' },
      code: "print('مرحبًا! أنا بايثون')\nprint(2 + 3)",
      explanation: {
        ar: 'السطر الأول يطبع نصًّا كما هو — ولاحظ أن النص العربي يعمل بكل بساطة. السطر الثاني يحسب 2 + 3 فيطبع 5. بايثون ينفّذ السطرين بترتيب: الأول ثم الثاني. اضغط «شغّل المثال» وشاهد بنفسك.',
        en: 'The first line prints text as-is — and notice that Arabic text works just fine. The second line computes 2 + 3 and prints 5. Python executes the two lines in order: first, then second. Press “Run the example” and see for yourself.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.print-name',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب سطر بايثون يطبع اسمك على الشاشة. أي اسم يصحّ — المهم أن يظهر شيئًا حقيقيًا عند التشغيل.',
        en: 'Write a line of Python that prints your name. Any name works — what matters is that something real appears when it runs.',
      },
      starterCode: '# اكتب كودك هنا… / write your code here:\n',
      solution: 'print("اسمك هنا")  # your name here',
      tests: [
        {
          id: 't1',
          name: { ar: 'يطبع الكود شيئًا على الشاشة', en: 'The code prints something to the screen' },
          code: "assert __learner_output__.strip() != '', 'expected some output, got none'",
          expected: 'أي سطر خرْج / any output line',
        },
      ],
      hints: [
        {
          ar: 'استخدم أمر print وضع ما تريد طباعته بين قوسين.',
          en: 'Use the print command and put what you want printed inside parentheses.',
        },
        {
          ar: 'النص (مثل اسمك) يجب أن يوضع بين علامتي تنصيص حتى يفهمه بايثون.',
          en: 'Text (like your name) must be wrapped in quotes so Python understands it.',
        },
        {
          ar: 'الهيكل: print("نص") — جرّبه الآن مع اسمك.',
          en: 'The skeleton: print("text") — try it now with your name.',
        },
        {
          ar: 'print("اسمك هنا") — استبدل ما بين التنصيص باسمك أنت.',
          en: 'print("your name here") — replace what is between the quotes with your own name.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-output',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود التالي بهدوء وتوقّع ما سيطبعه بالضبط — دون تشغيله. اكتب الخرْج كما سيظهر.',
        en: 'Read the following code quietly and predict what it prints — without running it. Type the output as it would appear.',
      },
      code: 'x = 3\ny = x * 4\nprint(y)',
      solution: '12',
      answer: '12',
      hints: [
        { ar: 'تتبّع سطرًا سطرًا: السطر الأول يخزّن 3 في x.', en: 'Follow line by line: the first line stores 3 in x.' },
        { ar: 'السطر الثاني يحسب 3 × 4 ويخزّن النتيجة في y.', en: 'The second line computes 3 × 4 and stores it in y.' },
        { ar: 'print(y) يطبع قيمة y نفسها، وليس الحرف y.', en: 'print(y) prints the value of y itself, not the letter y.' },
        { ar: 'الخرْج هو نتيجة 3 × 4.', en: 'The output is the result of 3 × 4.' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex3.debug-print',
      expectedError: 'SyntaxError',  // intentional crash-teaching; verified by checks replay
      required: true,
      brokenCode: "print 'Hello'",
      prompt: {
        ar: 'هذا السطر كان يعمل في نسخة قديمة من بايثون، لكنه الآن يقذف SyntaxError. أصلحه ليطبع Hello.',
        en: 'This line used to work in an old version of Python, but now it throws a SyntaxError. Fix it so it prints Hello.',
      },
      solution: "print('Hello')",
      tests: [
        {
          id: 't1',
          name: { ar: 'يُطبع Hello بالضبط', en: 'Exactly Hello is printed' },
          code: "assert __learner_output__.strip() == 'Hello', ('expected: Hello | actual: %r' % __learner_output__.strip())",
          expected: 'Hello',
        },
      ],
      hints: [
        { ar: 'اقرأ رسالة الخطأ: SyntaxError تعني أن شكل السطر غير صحيح — المشكلة في القواعد لا في الكلمة print.', en: 'Read the error: SyntaxError means the shape of the line is wrong — the problem is the grammar, not the word print.' },
        { ar: 'في بايثون الحديثة print دالة: تُستدعى بأقواس، مثل أي أداة تستدعيها.', en: 'In modern Python, print is a function: you call it with parentheses, like any tool you invoke.' },
        { ar: 'الهيكل: print(نص) — ضع النص بين القوسين مع علامتي التنصيص.', en: 'The skeleton: print(text) — put the text inside parentheses, with quotes.' },
        { ar: "print('Hello')", en: "print('Hello')" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode:
        '# ملعبك الحرّ — جرّب بلا خوف:\n# طبّع نصوصًا، جرّب أرقامًا، اجمع طرائق\n# Your playground — try without fear:\n# print text, try numbers, mix styles\n\nprint("أنا أتعلّم بايثون 🌱")\nprint(7 * 6)\nprint("7 * 6")',
      prompt: {
        ar: 'جرّب بنفسك: اطبع جملة بالعربية، ورقمًا، ثم قارن بين print(7 * 6) وprint("7 * 6"). ماذا لاحظت؟ لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: print a sentence in Arabic, and a number, then compare print(7 * 6) with print("7 * 6"). What do you notice? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا يفعل المفسِّر (interpreter)؟',
            en: 'What does the interpreter do?',
          },
          options: [
            { id: 'a', text: { ar: 'يقرأ كودك وينفّذه سطرًا سطرًا', en: 'Reads your code and executes it line by line' } },
            { id: 'b', text: { ar: 'يحوّل الكود إلى ملف PDF', en: 'Converts your code into a PDF file' } },
            { id: 'c', text: { ar: 'يترجم الكود إلى العربية', en: 'Translates the code into Arabic' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المفسِّر هو البرنامج الذي يقرأ أوامر بايثون وينفّذها فورًا، واحدًا تلو الآخر.',
            en: 'The interpreter is the program that reads your Python commands and executes them immediately, one by one.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا يطبع هذا؟  print("2 + 3")',
            en: 'What does this print?  print("2 + 3")',
          },
          options: [
            { id: 'a', text: { ar: '5', en: '5' } },
            { id: 'b', text: { ar: '2 + 3 كما هو، لأنه داخل تنصيص', en: '2 + 3 as-is, because it is inside quotes' } },
            { id: 'c', text: { ar: 'خطأ', en: 'An error' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'علامتا التنصيص تجعلان بايثون يتعامل مع المحتوى كنصّ يُطبع كما هو، لا كعملية حسابية.',
            en: 'Quotes make Python treat the content as text to print as-is, not as arithmetic.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي الطرق الصحيحة لطباعة نص في بايثون 3؟',
            en: 'Which way prints text correctly in Python 3?',
          },
          options: [
            { id: 'a', text: { ar: "print('Hi')", en: "print('Hi')" } },
            { id: 'b', text: { ar: "print 'Hi'", en: "print 'Hi'" } },
            { id: 'c', text: { ar: "echo 'Hi'", en: "echo 'Hi'" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'في بايثون 3 الطباعة دالة تحتاج أقواسًا. الصيغة بلا أقواس تنتمي لبايثون 2 القديم.',
            en: 'In Python 3 printing is a function and needs parentheses. The no-parentheses form belongs to old Python 2.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "print \"مرحبا\"",
          right: 'print("مرحبا")',
          note: {
            ar: 'أقواس print إلزامية في بايثون 3 — صيغة بلا أقواس من زمن بايثون 2 وستوقفك برسالة SyntaxError.',
            en: 'The parentheses around print are mandatory in Python 3 — the no-parentheses form is from Python 2 and stops you with a SyntaxError.',
          },
        },
        {
          wrong: 'الاسم = "سارة"',
          right: 'name = "سارة"',
          note: {
            ar: 'النص العربي داخل علامتي التنصيص؟ بكل سرور. لكن كقاعدة عملية اكتب أسماء المتغيرات بحروف لاتينية (name وليس الاسم): أسهل في القراءة والمشاركة والتوثيق، وتتفادى مشاكل الخطوط بين الأدوات.',
            en: 'Arabic text inside quotes? Absolutely. But as a practical rule, write variable names in Latin letters (name, not الاسم): easier to read, share and document, and you avoid font issues across tools.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الحاسوب سريع ومنضبط لا ذكي — البرمجة هي إعطاؤه تعليمات دقيقة.', en: 'A computer is fast and obedient, not smart — programming is giving it precise instructions.' },
        { ar: 'print() أمر الإخراج: يعرض ما بين القوسين على الشاشة.', en: 'print() is the output command: it shows what is inside the parentheses on screen.' },
        { ar: 'علامتا التنصيص تُعرّفان النصّ؛ بدونهما يفهم بايثون المحتوى كأمر أو عملية حسابية.', en: 'Quotes mark text; without them Python reads the content as a command or arithmetic.' },
      ],
      reflectPrompt: {
        ar: 'اذكر شيئًا في حياتك اليومية تتمنى لو «برمجتَه» ليتنفّذ تلقائيًا. لماذا هذا تحديدًا؟',
        en: 'Name one thing in your daily life you wish you could “program” to happen automatically. Why that one?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch1.s1', pages: 'ص2-6 / pp.2-6' },
        { book: 'PY4E', section: 'py4e.ch1.s3', pages: 'ص6-9 / pp.6-9' },
        { book: 'PY4E', section: 'py4e.ch1.s12', pages: 'ص16-18 / pp.16-18' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch1.s1', pages: 'ص2-6 / pp.2-6' },
    { book: 'PY4E', section: 'py4e.ch1.s3', pages: 'ص6-9 / pp.6-9' },
    { book: 'PY4E', section: 'py4e.ch1.s12', pages: 'ص16-18 / pp.16-18' },
  ],
} satisfies Lesson;

export default lesson;
