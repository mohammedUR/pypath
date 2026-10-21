import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch1.l3 — "Python and the Interpreter / بايثون والمفسِّر"
 * Aligned with PY4E ch1 s4 (مفردات بايثون), s5 (مخاطبة بايثون),
 * s6 (المفسِّر والمترجم). All expression is original.
 */
const lesson = {
  id: 'py4e.ch1.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 1,
  title: { ar: 'بايثون والمفسِّر', en: 'Python and the Interpreter' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch1.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'هبطت بمركبتك على كوكبٍ لا يفهم لغتك، ولا يفهم إلا بضع كلمات محجوزة في لغته. تقول جملة كاملة فيهدّفون برماحهم، وتقول كلمتهم الصحيحة فيصفّقون لك. هكذا تمامًا حديثك مع بايثون: لغة صغيرة، قواعد صارمة، وكل كلمة لها وزن.',
        en: 'You land on a planet whose people understand only a few reserved words of their own language. Say a whole sentence and they raise their spears; say one of their reserved words and they applaud. Talking to Python is exactly like that: a small language, strict grammar, and every word carries weight.',
      },
    },
    {
      kind: 'predict',
      expectedError: 'NameError',  // intentional crash-teaching; verified by checks replay
      code: "primt('I come in peace')",
      question: {
        ar: 'خطأ إملائي صغير اختبق في السطر. ماذا سيحدث عند التشغيل: هل يُطبع النص أم يثور شيء ما؟',
        en: 'A tiny typo is hiding in this line. What happens when it runs: does the text print, or does something erupt?',
      },
      reveal: {
        ar: 'يثور شيء: NameError: name «primt» is not defined. بايثون تبحث عن كلمة primt في قاموسها فلا تجدها — فهي لا تخمّن مقصدك ولا تصحح تهجئتك. لاحظ أن النص داخل التنصيص كان سليمًا؛ الخطأ في الكلمة الأولى.',
        en: 'Something erupts: NameError: name “primt” is not defined. Python looks up primt in its dictionary, does not find it — and it never guesses your intent or fixes your spelling. Notice the quoted text was fine; the mistake is in the very first word.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'لغة بمفردات صغيرة جدًا', en: 'A language with a tiny vocabulary' },
      chunks: [
        {
          ar: 'على خلاف اللغات البشرية، بايثون تعرف عددًا قليلًا جدًا من الكلمات المسمّاة الكلمات المحجوزة (مثل: print وif وfor) — ولكل منها معنى واحد فقط لا يتغيّر. الحيوان الأليف الذي يفهم «اجلس» فقط لا يفهم جملة «أتمنى لو يمشي الناس أكثر» إلا بكلمة «يمشي»: هكذا بايثون بالضبط، تلتقط كلماتها المحجوزة وتتجاهل الباقي.',
          en: 'Unlike human languages, Python knows very few words — the reserved words (like print, if, for) — and each has exactly one fixed meaning. A pet that only understands “sit” hears your long sentence about people walking and catches just “walk”: that is Python, catching its reserved words and ignoring the rest.',
        },
        {
          ar: 'وأنت، حين تكتب برامج حقيقية، ستُنشئ مفرداتك الخاصة من فوق هذه الكلمات وتسمّيها المتغيرات — سنتعلمها في درس قادم. أمّا الآن فأنت تتعلم مخاطبتها: تكتب سطرًا، يقرؤه المفسِّر (interpreter)، وينفّذه فورًا، ثم ينتظر سطرًا آخر. محادثة، لا محاضرة.',
          en: 'When you write real programs, you will build your own vocabulary on top of these words and call them variables — coming in a later lesson. For now you are learning to talk to it: you write a line, the interpreter reads it, executes it immediately, then waits for the next line. A conversation, not a lecture.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المفسِّر مقابل المترجم', en: 'Interpreter versus compiler' },
      chunks: [
        {
          ar: 'المعالج لا يفهم بايثون ولا جافا سكربت؛ يفهم لغة واحدة فقط هي لغة الآلة: أصفارٌ وآحاد مثل 001010001110… . لك أن تقرأ هذه الأصفار بنفسك؟ بالكاد. لهذا وُجد المفسِّر (interpreter): يقرأ برنامجك كما كتبته، يفهمه، وينفّذ تعليماته مباشرة سطرًا سطرًا — وتستخدمه بايثون.',
          en: 'The CPU understands neither Python nor JavaScript; it understands only machine language: zeros and ones like 001010001110… . Could you read those yourself? Barely. That is why the interpreter exists: it reads your program as written, understands it, and executes its instructions directly, line by line — and Python uses this approach.',
        },
        {
          ar: 'أما المترجم (compiler) فيعمل بطريقة أخرى: يستلم البرنامج كاملًا، يترجمه دفعةً واحدة إلى لغة الآلة، ويحفظ الناتج في ملف تنفيذي (مثل .exe في ويندوز) ينفَّذ لاحقًا. لغات مثل C تستخدم المترجمات. الاثنان يحققان الغاية نفسها: نقل كلامك من لغة البشر إلى لغة المعالج.',
          en: 'A compiler works differently: it takes the whole program, translates it to machine language in one go, and saves the result as an executable file (like .exe on Windows) to run later. Languages like C use compilers. Both achieve the same goal: carrying your words from human language to CPU language.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نمطان للحديث: تفاعلي أم نص برمجي', en: 'Two ways to talk: interactive or script' },
      chunks: [
        {
          ar: 'في الوضع التفاعلي تكتب بعد إشارة >>> سطرًا واحدًا فيقرؤه المفسِّر ويردّ فورًا — مثل المحادثة مع سكان الكوكب. وفي الوضع البرمجي تكتب كل أسطر البرنامج في ملف نصي ينتهي بـ .py (نص برمجي script)، ثم تطلب من بايثون قراءته كاملًا بالأمر python hello.py.',
          en: 'In interactive mode you type one line after the >>> prompt and the interpreter answers immediately — like chatting with the planet dwellers. In script mode you write all the lines in a text file ending in .py (a script), then ask Python to read the whole thing with python hello.py.',
        },
        {
          ar: 'بيئة التمرين في هذه المنصة تشبه النص البرمجي: تكتب أسطرًا متعددة وتشغّلها دفعة واحدة. تذكّر فرقًا مهمًا ستراه قريبًا: التعبير الحسابي المكتوب وحده يظهر ناتجه في الوضع التفاعلي، لكنه في النص البرمجي يُحسب بصمت ولا يظهر شيئًا.',
          en: 'The exercise environment here behaves like a script: you write several lines and run them together. Remember one important difference you will see soon: a bare arithmetic expression shows its result in interactive mode, but in a script it is computed silently and shows nothing.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تعبير صامت وأمر صريح', en: 'A silent expression and a loud command' },
      code: '2 + 3\nprint(2 + 3)',
      explanation: {
        ar: 'السطر الأول يحسب 5 لكن لا أحد يسمعه — تعبير وحده في النص البرمجي صامت. السطر الثاني يحسب 5 نفسه ويصرخ بها للشاشة عبر print. اضغط «شغّل المثال»: لن يظهر إلا 5 واحدة. لو جربت 2 + 3 بعد إشارة >>> في وضع تفاعلي حقيقي لظهرت النتيجة تلقائيًا.',
        en: 'The first line computes 5 but nobody hears it — a bare expression in a script is silent. The second line computes the same 5 and shouts it to the screen via print. Press “Run the example”: only one 5 appears. If you had typed 2 + 3 after >>> in a real interactive session, the result would appear automatically.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.hello-world',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'قل لسكان كوكب بايثون جملتهم المقدسة: اكتب سطرًا يطبع بالضبط Hello world! (انتبه لعلامة التعجب وحالة الأحرف).',
        en: 'Say the sacred sentence to the Python planet: write a line that prints exactly Hello world! (mind the exclamation mark and the capital letters).',
      },
      starterCode: '# جملتك الأولى للمفسِّر / your first sentence to the interpreter\n',
      solution: "print('Hello world!')",
      tests: [
        {
          id: 't1',
          name: { ar: 'يُطبع Hello world! بالضبط', en: 'Exactly Hello world! is printed' },
          code: "assert __learner_output__.strip() == 'Hello world!', 'expected: Hello world! | actual: %r' % __learner_output__.strip()",
          expected: 'Hello world!',
        },
      ],
      hints: [
        { ar: 'ابدأ بالكلمة المحجوزة print ثم القوسين.', en: 'Start with the reserved word print, then the parentheses.' },
        { ar: 'النص داخل علامتي تنصيص، ولا تنسَ إغلاق القوس.', en: 'The text goes inside quotes, and do not forget to close the parenthesis.' },
        { ar: 'الهيكل: print("Hello world!")', en: 'The skeleton: print("Hello world!")' },
        { ar: "print('Hello world!')", en: "print('Hello world!')" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-compiler',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي هذين يستقبل البرنامج كاملًا، يترجمه دفعةً واحدة إلى لغة الآلة، ويحفظ الناتج في ملف تنفيذي؟',
        en: 'Which one receives the whole program, translates it to machine language in one go, and saves the result as an executable file?',
      },
      options: [
        { id: 'a', text: { ar: 'المفسِّر (interpreter)', en: 'The interpreter' } },
        { id: 'b', text: { ar: 'المترجم (compiler)', en: 'The compiler' } },
        { id: 'c', text: { ar: 'الشاشة', en: 'The screen' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'أحدهما محادثة سطرًا سطرًا، والآخر ترجمة كاملة ثم حفظ ملف.', en: 'One is a line-by-line conversation; the other translates everything, then saves a file.' },
        { ar: 'ملفات .exe هي ثمرة عمله.', en: '.exe files are the fruit of its work.' },
        { ar: 'اسمه يبدأ بحرف الميم: مترجم… compiler.', en: 'Its name is compiler.' },
        { ar: 'الجواب: المترجم (compiler). بايثون تتبنى الطريقة الأخرى.', en: 'Answer: the compiler. Python uses the other approach.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.fill-reserved',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: الكلمات القليلة التي تعرفها بايثون مسبقًا ولكل منها معنى واحد ثابت تسمى الكلمات ______.',
        en: 'Fill in: the few words Python knows in advance, each with one fixed meaning, are called the reserved ______ (in Arabic).',
      },
      answer: 'المحجوزة',
      solution: 'المحجوزة',
      hints: [
        { ar: 'رأيتَ هذه الكلمة في عنوان الفقرة الأولى.', en: 'You saw this word in the first section heading.' },
        { ar: 'print وif من أمثلتها — لا يستطيع أحد استعمالها بأسماء أخرى.', en: 'print and if are examples — nobody can repurpose them.' },
        { ar: 'الكلمة تبدأ بالميم.', en: 'The word starts with م.' },
        { ar: 'الجواب: المحجوزة.', en: 'Answer: المحجوزة (reserved).' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — محادثة مع المفسِّر\n# Your playground — a conversation with the interpreter\n\nprint("I come in peace")\nprint("سلامٌ لكم يا سكان الكوكب")\nprint(2 + 3)',
      prompt: {
        ar: 'جرّب بنفسك: اطبع رسالة لسكان الكوكب، ثم أضف سطر 2 + 3 بلا print ولاحظ صمته، ثم ضعها داخل print. من يتفاعل ومتى؟',
        en: 'Try it yourself: print a message for the planet dwellers, then add a bare 2 + 3 without print and watch its silence, then wrap it in print. Who reacts, and when?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'نعود للدرس الأول: ما دور علامتي التنصيص في print("مرحبا")؟',
            en: 'Back to lesson one: what do the quotes do in print("مرحبا")?',
          },
          options: [
            { id: 'a', text: { ar: 'تُخبران بايثون أن المحتوى نصّ يُطبع كما هو', en: 'They tell Python the content is text to print as-is' } },
            { id: 'b', text: { ar: 'تجعلان الطباعة أسرع', en: 'They make printing faster' } },
            { id: 'c', text: { ar: 'تُترجمان النص إلى العربية', en: 'They translate the text to Arabic' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'علامتا التنصيص تعرّفان النص. بدونها سيبحث بايثون عن متغيّر اسمه مرحبا ويتوقف برسالة NameError.',
            en: 'Quotes mark the text. Without them Python searches for a variable named مرحبا and stops with a NameError.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في الوضع التفاعلي، ماذا تعني إشارة >>> التي تظهر أمامك؟',
            en: 'In interactive mode, what does the >>> prompt mean?',
          },
          options: [
            { id: 'a', text: { ar: '«حدث خطأً ما»', en: '“An error happened”' } },
            { id: 'b', text: { ar: '«ماذا تريدني أن أفعل الآن؟» — المفسِّر ينتظر سطرًا جديدًا', en: '“What do you want me to do now?” — the interpreter waits for a line' } },
            { id: 'c', text: { ar: '«يجب إعادة تشغيل الحاسوب»', en: '“You must restart the computer”' } },
          ],
          answer: 'b',
          explanation: {
            ar: '>>> طريقة المفسِّر في السؤال: أعطني السطر التالي. تختفي في النص البرمجي لأن كل الأسطر مكتوبة مسبقًا في الملف.',
            en: '>>> is the interpreter asking: give me the next line. It disappears in script mode because all lines are pre-written in the file.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أكتب في نص برمجي (ملف .py) سطرًا وحيدًا: 3 * 4  بلا print. ماذا يظهر عند تشغيل الملف؟',
            en: 'In a script (a .py file) I write one single line: 3 * 4 with no print. What appears when the file runs?',
          },
          options: [
            { id: 'a', text: { ar: '12', en: '12' } },
            { id: 'b', text: { ar: 'لا شيء — التعبير وحده صامت في النص البرمجي', en: 'Nothing — a bare expression is silent in a script' } },
            { id: 'c', text: { ar: 'خطأ قواعدي', en: 'A syntax error' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'يُحسب الناتج ثم يُرمى: التعبير المكتوب وحده لا يعرض شيئًا في النص البرمجي. لاحظه داخل print إن أردت سماعه.',
            en: 'The result is computed then thrown away: a bare expression displays nothing in a script. Wrap it in print if you want to hear it.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'لغة الآلة التي يفهمها المعالج وحده تظهر كـ…',
            en: 'The machine language only the CPU understands looks like…',
          },
          options: [
            { id: 'a', text: { ar: 'جُمل عربية قصيرة', en: 'Short Arabic sentences' } },
            { id: 'b', text: { ar: 'أصفار وآحاد', en: 'Zeros and ones' } },
            { id: 'c', text: { ar: 'أكواد بايثون مضغوطة', en: 'Compressed Python code' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'لغة الآلة أصفار وآحاد: بسيطة البنية، شديدة التعقيد على البشر. المفسِّر والمترجم هما جسرُك عنها.',
            en: 'Machine language is zeros and ones: simple in structure, brutal for humans. The interpreter and compiler are your bridge over it.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "primt('Hello')",
          right: "print('Hello')",
          note: {
            ar: 'الخطأ هنا في الكلمة لا في النص: primt كلمة لا يعرفها المفسِّر فالرسالة NameError وليست SyntaxError. بايثون لا تصحح تهجئتك — انسخ الكلمات المحجوزة بدقة.',
            en: 'The mistake is the word, not the text: primt is unknown to the interpreter, so the message is NameError, not SyntaxError. Python does not fix your spelling — copy reserved words precisely.',
          },
        },
        {
          wrong: "print('Hello))",
          right: "print('Hello')",
          note: {
            ar: 'علامتا التنصيص أزواج متطابقة: بدأتَ بمفردة وأغلقتَ بمزدوجة، فظل القوس حبيس النص. اختر نوعًا واحدًا وأغلقه بنفسه.',
            en: 'Quotes come in matching pairs: you opened with a single quote and closed with a double, leaving the parenthesis trapped inside. Pick one kind and close with the same kind.',
          },
        },
        {
          wrong: '5 * 3',
          right: 'print(5 * 3)',
          note: {
            ar: 'في النص البرمجي، التعبير المكتوب وحده يُحسب بصمت ولا يظهر شيئًا — أشهر لغز يحيّر المبتدئين. اطبعه إن أردت رؤية الناتج.',
            en: 'In a script, a bare expression is computed silently and shows nothing — the most common beginner puzzle. Print it if you want to see the result.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'بايثون لغة بمفردات صغيرة: كلمات محجوزة بمعانٍ ثابتة، وأنت تبني فوقها مفرداتك الخاصة.', en: 'Python has a tiny vocabulary: reserved words with fixed meanings, and you build your own words on top.' },
        { ar: 'المفسِّر ينفّذ سطرًا سطرًا كمحادثة؛ المترجم يترجم البرنامج كاملًا إلى ملف تنفيذي.', en: 'The interpreter executes line by line like a conversation; the compiler translates the whole program into an executable file.' },
        { ar: 'الوضع التفاعلي يردّ فورًا بعد >>>، والنص البرمجي ينفّذ الأسطر كلها دفعةً — والتعبير الصامت لا يظهر فيه شيئًا.', en: 'Interactive mode replies instantly after >>>; a script runs all lines at once — and a bare expression shows nothing there.' },
      ],
      reflectPrompt: {
        ar: 'لو كان المفسِّر حيوانًا أليفًا تدريبه على خمس كلمات فقط: ما أول كلمتين تختارهما، ولماذا؟',
        en: 'If the interpreter were a pet you could train on only five words: which two would you pick first, and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch1.s4', pages: 'ص6 / pp.6' },
        { book: 'PY4E', section: 'py4e.ch1.s5', pages: 'ص7-9 / pp.7-9' },
        { book: 'PY4E', section: 'py4e.ch1.s6', pages: 'ص10-11 / pp.10-11' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch1.s4', pages: 'ص6 / pp.6' },
    { book: 'PY4E', section: 'py4e.ch1.s5', pages: 'ص7-9 / pp.7-9' },
    { book: 'PY4E', section: 'py4e.ch1.s6', pages: 'ص10-11 / pp.10-11' },
  ],
} satisfies Lesson;

export default lesson;
