import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch1.l2 — "Computer Architecture / بنية الحاسوب"
 * Aligned with PY4E ch1 s2 (بنية الحاسوب). All expression is original.
 */
const lesson = {
  id: 'py4e.ch1.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 1,
  title: { ar: 'بنية الحاسوب', en: 'Computer Architecture' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch1.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'تخيّل أن أحدهم صغَّر حجمك إلى خمسة مليمترات ووضعك داخل الحاسوب، ومهمتك أن تأمر المعالج — الذي يسأل ثلاثة مليارات مرة في الثانية: «ماذا أنفّذ؟». مستحيل أن تجيب بهذه السرعة، لذلك تكتب أوامرك مسبقًا وتخزّنها في الذاكرة… وبهذا تكون قد كتبت أول برنامج في حياتك.',
        en: 'Imagine someone shrinks you to five millimeters and puts you inside the computer, with one job: answering the CPU, which asks three billion times per second, “what should I execute next?”. Impossible to answer that fast in person — so you write your instructions ahead of time and store them in memory… and that is your first program.',
      },
    },
    {
      kind: 'predict',
      code: "print('ماذا أنفّذ؟')\nprint('ماذا أنفّذ؟')",
      question: {
        ar: 'المعالج يسأل سؤاله مرتين في هذا البرنامج. كم سطرًا سيظهر على الشاشة: واحد أم اثنان؟',
        en: 'The CPU asks its question twice in this program. How many lines will appear on screen: one or two?',
      },
      reveal: {
        ar: 'سطران! بايثون تنفّذ التعليمات واحدةً تلو الأخرى من الأعلى إلى الأسفل: كل print أمر مستقل يُنفَّذ مرة واحدة. المعالج الحقيقي يكرر سؤاله مليارات المرات — وبرنامجك هو قائمة الإجابات.',
        en: 'Two lines! Python executes instructions one by one, top to bottom: each print is a separate command, run once. A real CPU repeats its question billions of times — and your program is the list of answers.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ماذا يوجد داخل الحاسوب؟', en: "What's inside the computer?" },
      chunks: [
        {
          ar: 'إذا فككت هاتفًا أو حاسوبًا ستجد وحدة المعالجة المركزية (CPU): الجزء المسؤول حصرًا عن سؤال «ماذا أنفّذ؟». ومعالج بسرعة 3 جيجاهرتز يسألها ثلاثة مليارات مرة في الثانية — لذلك علّمنا البرمجة أن نجيب له بسرعة، أي أن نكتب أوامر جاهزة مسبقًا.',
          en: 'Open up a phone or a computer and you will find the CPU (Central Processing Unit): the part responsible for exactly one question, “what do I execute next?”. A 3 GHz processor asks it three billion times per second — which is why we program: we answer ahead of time with ready-made instructions.',
        },
        {
          ar: 'بجانب المعالج الذاكرة الرئيسية: سريعة جدًا وقريبة من المعالج، لكنها تنسى كل شيء عند إطفاء الحاسوب. والذاكرة الثانوية — أقراص التخزين والذاكرة الومضية وأقراص USB — أبطأ بكثير، لكنها تحفظ معلوماتك حتى بعد الإطفاء. سرعة مقابل بقاء: وكل مكوّن له دوره.',
          en: 'Next to the CPU is main memory: very fast, very close to the processor, but it forgets everything when the power goes off. Secondary memory — disks, flash memory, USB drives — is far slower, but it keeps your data even after shutdown. Speed versus persistence: each part plays its role.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.print-parts',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اطبع اسمَي مكوّنين بأساميهما الإنجليزية المختصرة: السطر الأول CPU والسطر الثاني RAM. سطر لكل مكوّن.',
        en: 'Print the names of two components using their short English names: first line CPU, second line RAM. One line per component.',
      },
      starterCode: '# سطران: الأول CPU والثاني RAM / two lines: first CPU then RAM\n# print("...")\n',
      solution: "print('CPU')\nprint('RAM')",
      tests: [
        {
          id: 't1',
          name: { ar: 'يظهر CPU في الخرْج', en: 'CPU appears in the output' },
          code: "assert 'CPU' in __learner_output__, 'expected: CPU in output | actual: %r' % __learner_output__",
          expected: 'CPU',
        },
        {
          id: 't2',
          name: { ar: 'يظهر RAM في الخرْج', en: 'RAM appears in the output' },
          code: "assert 'RAM' in __learner_output__, 'expected: RAM in output | actual: %r' % __learner_output__",
          expected: 'RAM',
        },
      ],
      hints: [
        {
          ar: 'أمر الطباعة الذي تعرفه من الدرس السابق يكفي: print مع القوسين.',
          en: 'The print command from the previous lesson is enough: print with parentheses.',
        },
        {
          ar: 'الأسماء CPU وRAM نصوص، والنصوص توضع بين علامتي تنصيص.',
          en: 'CPU and RAM are text, and text goes between quotes.',
        },
        {
          ar: 'الهيكل: print("CPU") في سطر، وprint("RAM") في سطر آخر.',
          en: 'The skeleton: print("CPU") on one line, print("RAM") on another.',
        },
        {
          ar: "print('CPU')\nprint('RAM')",
          en: "print('CPU')\nprint('RAM')",
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-cpu-question',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي مكوّن يختصّ بالسؤال: «ماذا أنفّذ الآن؟»؟',
        en: 'Which component is dedicated to the question: “what do I execute now?”',
      },
      options: [
        { id: 'a', text: { ar: 'الذاكرة الثانوية (القرص)', en: 'Secondary memory (the disk)' } },
        { id: 'b', text: { ar: 'وحدة المعالجة المركزية (CPU)', en: 'The CPU' } },
        { id: 'c', text: { ar: 'الشاشة', en: 'The screen' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'تذكّر استعارة المبرمج الصغير داخل الحاسوب: من الذي ينفّذ الأوامر فعلًا؟', en: 'Recall the tiny programmer metaphor: who actually executes the commands?' },
        { ar: 'الذاكرة تحفظ، الشاشة تعرض — لكن من يسأل «ماذا أنفّذ؟»؟', en: 'Memory stores, the screen shows — but who asks “what do I execute?”' },
        { ar: 'الاختصار نفسه يفيدك: Central Processing Unit — وحدة المعالجة.', en: 'The acronym helps: Central Processing Unit.' },
        { ar: 'الجواب: وحدة المعالجة المركزية (CPU).', en: 'Answer: the CPU.' },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الأطراف والشبكة: كيف يخاطب الحاسوب العالم؟', en: 'Edges and network: how the computer meets the world' },
      chunks: [
        {
          ar: 'أجهزة الإدخال تحمل الكلام منك إلى الحاسوب: لوحة المفاتيح، الفأرة، الميكروفون، لوحة اللمس. وأجهزة الإخراج تحمل الجواب إليك: الشاشة ومكبر الصوت. برامجنا الأولى ستأخذ دخلها من لوحة المفاتيح وتخرج نتائجها على الشاشة.',
          en: 'Input devices carry your words into the computer: keyboard, mouse, microphone, touchpad. Output devices carry the answer back to you: the screen and speakers. Our first programs will take input from the keyboard and show results on the screen.',
        },
        {
          ar: 'ومعظم الحواسيب متصل بشبكة: تبادل البيانات مع أجهزة أخرى. يمكن اعتبارها ذاكرة ثانوية إضافية لكن أبطأ وأقل أمانًا. وظيفتك كمبرمج ليست تفكيك هذه الأجزاء — بل أن تنسّق بينها بأوامر ذكية لحل مشاكلك.',
          en: 'Most computers are also connected to a network: exchanging data with other machines. You can think of it as extra secondary memory, but slower and less safe. Your job as a programmer is not to disassemble these parts — it is to coordinate them with clever instructions that solve your problems.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'برنامج يعرّف بأجزاء الحاسوب', en: 'A program introducing the parts' },
      code: "print('المعالج: ماذا أنفّذ الآن؟')\nprint('الذاكرة الرئيسية: أحفظ ما تحتاجه فورًا')\nprint('الذاكرة الثانوية: أحفظ كل شيء حتى بعد الإطفاء')\nprint('الشبكة: أنقل البيانات إلى العالم')",
      explanation: {
        ar: 'أربعة أسطر = أربع تعليمات مخزَّنة في الذاكرة، ينفّذها المعالج بترتيبها: سطرًا سطرًا. اضغط «شغّل المثال» ولاحظ أن الخرْج يظهر بنفس ترتيب الأسطر تمامًا — هكذا يعمل التنفيذ التسلسلي دائمًا.',
        en: 'Four lines = four instructions stored in memory, executed by the CPU in order, line by line. Press “Run the example” and notice the output appears in exactly the same order as the lines — that is sequential execution, always.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex3.fill-secondary',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: المكوّن الذي يحفظ بياناتك حتى بعد إطفاء الحاسوب هو الذاكرة ______.',
        en: 'Fill in: the component that keeps your data even after the computer is turned off is the ______ memory.',
      },
      answer: 'الثانوية',
      solution: 'الثانوية',
      hints: [
        { ar: 'نوعان من الذاكرة: واحدة سريعة تنسى، وأخرى أبطأ تتذكّر.', en: 'Two kinds of memory: one fast and forgetful, one slower and persistent.' },
        { ar: 'الأقراص وأقراص USB تعمل عليها هذه الذاكرة.', en: 'Disks and USB drives are this kind of memory.' },
        { ar: 'كلمة واحدة بالعربية تُكمل الجملة.', en: 'One Arabic word completes the sentence.' },
        { ar: 'الجواب: الثانوية.', en: 'Answer (in Arabic): الثانوية — secondary.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — قدّم مكونات حاسوبك بنفسك\n# Your playground — introduce your computer parts yourself\n\nprint("أنا الحاسوب، وهذه أجزائي:")\nprint("CPU: العقل الذي ينفّذ")\nprint("الذاكرة: يداه السريعتان")',
      prompt: {
        ar: 'جرّب بنفسك: اطبع سطرًا لكل مكوّن من مكوّنات حاسوبك كما لو كان يقدّم نفسه. أضف أجهزة إدخال وإخراج من عندك. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: print a line for each part of your computer as if introducing itself. Add input and output devices of your own. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'نعود لدرس أمس: ماذا يطبع هذا السطر؟  print("2 + 3")',
            en: 'Back to yesterday: what does this line print?  print("2 + 3")',
          },
          options: [
            { id: 'a', text: { ar: '5', en: '5' } },
            { id: 'b', text: { ar: '2 + 3 كما هو لأنه داخل تنصيص', en: '2 + 3 as-is, because it is in quotes' } },
            { id: 'c', text: { ar: 'خطأ قواعدي', en: 'A syntax error' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'علامتا التنصيص تعنيان «نصّ اطبعه كما هو» — لا عملية حسابية. وهذه القاعدة سترافقك في كل درس قادم.',
            en: 'Quotes mean “print this text as-is” — not arithmetic. This rule will follow you through every lesson.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'المعالج يسأل سؤاله ثلاثة مليارات مرة في الثانية. ما هذا السؤال؟',
            en: 'The CPU asks its question three billion times per second. What is the question?',
          },
          options: [
            { id: 'a', text: { ar: '«ما لون الشاشة الآن؟»', en: '“What color is the screen now?”' } },
            { id: 'b', text: { ar: '«ماذا أنفّذ التالي؟»', en: '“What do I execute next?”' } },
            { id: 'c', text: { ar: '«أين تخزَّنت الملفات؟»', en: '“Where are the files stored?”' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'وحدة المعالجة المركزية آلة تنفيذ خالصة: سؤالها الوحيد «ماذا أنفّذ؟» — وبرنامجك هو الإجابة المكتوبة مسبقًا.',
            en: 'The CPU is a pure execution machine: its only question is “what do I execute?” — and your program is the answer, written ahead of time.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا نحتاج الذاكرة الثانوية أصلًا إذا كانت الذاكرة الرئيسية أسرع بكثير؟',
            en: 'Why do we need secondary memory at all if main memory is so much faster?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنها أرخص وأجمل شكلًا', en: 'Because it is cheaper and prettier' } },
            { id: 'b', text: { ar: 'لأن الرئيسية تنسى كل شيء عند الإطفاء والثانوية تتذكّر', en: 'Because main memory forgets everything at power-off, secondary remembers' } },
            { id: 'c', text: { ar: 'لأن بايثون لا تعمل بغيرها', en: 'Because Python refuses to run without it' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الذاكرة الرئيسية سريعة لكنها متطايرة: يختفي كل شيء عند إطفاء الحاسوب. الثانوية أبطأ لكنها تحفظ ملفاتك وبرامجك للأبد تقريبًا.',
            en: 'Main memory is fast but volatile: everything vanishes at power-off. Secondary memory is slower but keeps your files and programs almost forever.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "print(CPU)",
          right: "print('CPU')",
          note: {
            ar: 'بدون علامتي تنصيص يظن بايثون أن CPU اسمَ متغيّر معرَّف في مكان ما، فيتوقف برسالة NameError. الأسماء التي تريد طباعتها كنص تحتاج تنصيصًا دائمًا.',
            en: 'Without quotes Python thinks CPU is a variable defined somewhere, and stops with a NameError. Names you want printed as text always need quotes.',
          },
        },
        {
          wrong: "print('RAM'",
          right: "print('RAM')",
          note: {
            ar: 'الأقواس تأتي أزواجًا: كل قوس فتح يحتاج قوس إغلاق. نسيان الإغلاق يوقف البرنامج برسالة SyntaxError قبل أن ينفَّذ أي شيء.',
            en: 'Parentheses come in pairs: every opening one needs a closing one. Forgetting to close stops the program with a SyntaxError before anything runs.',
          },
        },
        {
          wrong: "Print('RAM')",
          right: "print('RAM')",
          note: {
            ar: 'بايثون حساسة لحالة الأحرف: print ليست Print. المفسر لا يصحح تهجئتك — اقرأ رسالة الخطأ: name «Print» is not defined تعني أن الكلمة غير معروفة.',
            en: 'Python is case-sensitive: print is not Print. The interpreter does not fix your spelling — read the error: “name Print is not defined” means the word is unknown.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'داخل الحاسوب: معالج يسأل «ماذا أنفّذ؟»، ذاكرة رئيسية سريعة منسية، ذاكرة ثانوية بطيئة متذكّرة، أجهزة إدخال وإخراج، وشبكة.', en: 'Inside the computer: a CPU asking “what next?”, fast-forgetting main memory, slow-but-persistent secondary memory, input/output devices, and a network.' },
        { ar: 'البرنامج تعليمات مخزَّنة مسبقًا في الذاكرة ليجيب المعالج بسرعته الهائلة.', en: 'A program is instructions stored in memory ahead of time so the CPU can answer at full speed.' },
        { ar: 'التنفيذ تسلسلي دائمًا: من السطر الأول إلى الأخير، بلا تخطٍّ ولا مفاجآت.', en: 'Execution is always sequential: first line to last, no skipping, no surprises.' },
      ],
      reflectPrompt: {
        ar: 'لو صغَّرك الحاسوب إلى خمسة مليمترات: أي مكوّن ستقف بجانبه لمساعدته، ولماذا تحديدًا؟',
        en: 'If the computer shrank you to five millimeters: which component would you stand beside to help, and why that one?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch1.s2', pages: 'ص4-5 / pp.4-5' },
      ],
    },
  ],
  sources: [{ book: 'PY4E', section: 'py4e.ch1.s2', pages: 'ص4-5 / pp.4-5' }],
} satisfies Lesson;

export default lesson;
