import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch2.l5 — "User Input and Comments / إدخال المستخدم والتعليقات"
 * Aligned with PY4E ch2 s10 (إدخال البيانات من المستخدم), s11 (التعليقات).
 * All expression is original.
 * Note: the sandbox runtime has no keyboard, so input() is taught with a
 * simulated "typed" variable — the pattern is explained in the lesson.
 */
const lesson = {
  id: 'py4e.ch2.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 2,
  title: { ar: 'إدخال المستخدم والتعليقات', en: 'User Input and Comments' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch2.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حتى الآن برامجك كانت تلقي خطبة: تتكلم ولا تسمع أحدًا. الدالة input تقلب الطاولة — البرنامج يتوقف، يفتح أذنه، وينتظر أنت. ومعها سنتعلم أداة الهمس للمبرمجين: التعليقات، التي تسمعها البشر ولا تسمعها بايثون أبدًا.',
        en: 'Until now your programs delivered monologues: they spoke and heard nobody. The input function flips the table — the program stops, opens its ear, and waits for you. And with it we learn the programmers’ whisper: comments, heard by humans and never by Python.',
      },
    },
    {
      kind: 'predict',
      code: "# هذا تعليق يشرح السطر التالي\nprint('التعليقات للبشر')",
      question: {
        ar: 'السطر الأول يبدأ بـ # — هل سيظهر شيئًا منه في الخرْج؟',
        en: 'The first line starts with # — will any of it appear in the output?',
      },
      reveal: {
        ar: 'لن يظهر منه حرف: كل شيء من # إلى نهاية السطر تتجاهله بايثون كليًا. التعليق رسالة من عقل مبرمج إلى عقل مبرمج آخر — وغالبًا ستكون ذلك المبرمج الآخر أنت بعد شهر، ناسيًا لماذا كتبت هذا السطر.',
        en: 'Not a single character: everything from # to the end of the line is completely ignored by Python. A comment is a message from one programmer’s mind to another’s — and that other programmer is usually you, a month later, wondering why you wrote that line.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'input(): البرنامج يفتح أذنه', en: 'input(): the program opens its ear' },
      chunks: [
        {
          ar: 'عند استدعاء input يتوقف البرنامج وينتظر المستخدم يكتب شيئًا ويضغط Enter، ثم يُعاد ما كتبه. ومن الأدب البرمجي تمرير رسالة ترحيب له: name = input("ما اسمك؟ ") تعرض السؤال وتنتظر. (كان اسمها raw_input في بايثون 2 القديمة — إن صادفتها في كود قديم فأنت تعرف السبب.)',
          en: 'When input is called, the program pauses, the user types something and presses Enter, and what they typed comes back. Good manners: pass a greeting prompt — name = input("What is your name? ") shows the question and waits. (It was called raw_input in old Python 2 — if you meet it in old code, you know why.)',
        },
        {
          ar: 'وفاجأة الأساسيات: input يعيد دائمًا سلسلة نصية str — حتى لو كتب المستخدم أرقامًا! كتب 17؟ وصلك النص "17" لا العدد 17. بيئة التمرين هنا بلا لوحة مفاتيح، لذلك نحاكي: typed = "17" يمثل ما كتبه المستخدم — والقواعد كما هي تمامًا.',
          en: 'A fundamentals surprise: input always returns a string str — even if the user types digits! They typed 17? You receive the text "17", not the number 17. This exercise environment has no keyboard, so we simulate: typed = "17" stands for what the user typed — the rules stay exactly the same.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'int(): ترجمة النص إلى عدد', en: 'int(): translating text into a number' },
      chunks: [
        {
          ar: 'لتحويل النص إلى عدد صحيح قابل للحساب استدعِ int: النص "17" يصبح العدد 17، وحينها يعمل الجمع والطرح بسعادة. الكتاب يسأل سكانه عن سرعة السنونو: speed = input(...) ثم int(speed) ثم int(speed) + 5 = 22.',
          en: 'To turn text into a computable integer, call int: the text "17" becomes the number 17, and then addition and subtraction live happily. The book asks its user about the airspeed of an unladen swallow: speed = input(...), then int(speed), then int(speed) + 5 = 22.',
        },
        {
          ar: 'ولو كتب المستخدم شيئًا ليس رقمًا — مثل "ماذا تعني، سنونو أفريقي أم أوروبي؟" — فسيصرخ int برسالة ValueError: invalid literal for int(). لا خوف: سنحترم أخطاء المستخدم ونحترمها بالكود في الفصل الثالث. الآن يكفي أن تعرف مصدر الصراخ.',
          en: 'And if the user types something that is not a number — like “what do you mean, an African or a European swallow?” — int shouts ValueError: invalid literal for int(). No fear: we will learn to handle user errors gracefully in chapter 3. For now, knowing where the shout comes from is enough.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.convert-add',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المستخدم «كتب» في المتغيّر typed القيمة "25" (نص!). حوّلها إلى عدد واحسب total = العدد + 5 ثم اطبع total. (النتيجة 30 كعدد صحيح لا كنص.)',
        en: 'The user “typed” the value "25" into the variable typed (a string!). Convert it to a number, compute total = the number + 5, then print total. (The result is 30 as an integer, not text.)',
      },
      starterCode: "typed = '25'  # ما «كتبه» المستخدم / what the user \"typed\"\n# حوّل واحسب واطبع / convert, compute, print\n",
      solution: "typed = '25'\nnumber = int(typed)\ntotal = number + 5\nprint(total)",
      tests: [
        {
          id: 't1',
          name: { ar: 'total يساوي 30', en: 'total equals 30' },
          code: "assert total == 30, 'expected: 30 | actual: %r' % total",
          expected: '30',
        },
        {
          id: 't2',
          name: { ar: 'total عدد صحيح لا نص', en: 'total is an integer, not text' },
          code: "assert type(total) == int, 'expected: int | actual: %r' % type(total).__name__",
          expected: 'int',
        },
      ],
      hints: [
        { ar: 'التحويل: int(typed) — ضع النص الذي تريد ترجمته بين القوسين.', en: 'Conversion: int(typed) — put the text you want translated inside the parentheses.' },
        { ar: 'احفظ التحويل في صندوق: number = int(typed)، ثم اجمع عليه.', en: 'Store the conversion in a box: number = int(typed), then add to it.' },
        { ar: 'الهيكل:\nnumber = int(typed)\ntotal = number + 5\nprint(total)', en: 'The skeleton:\nnumber = int(typed)\ntotal = number + 5\nprint(total)' },
        { ar: "typed = '25'\nnumber = int(typed)\ntotal = number + 5\nprint(total)", en: "typed = '25'\nnumber = int(typed)\ntotal = number + 5\nprint(total)" },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الحوار الكامل: سؤال، تحويل، جواب', en: 'The full dialogue: ask, convert, answer' },
      code: "# في المنصة لا توجد لوحة مفاتيح — نحاكي ما يكتبه المستخدم\n# no keyboard in this platform — we simulate the user's typing\ntyped = '17'\nspeed = int(typed)\nprint(speed + 5)",
      explanation: {
        ar: 'في نافذة أوامر حقيقية كان السطر الثاني يكتب: speed = input("ما سرعتك؟ ") — والباقي مطابق. input أحضر النص، وint ترجمه إلى عدد، و+ حسب، وprint أعلن 22. أربع أدوات صغيرة = حوار كامل مع المستخدم. (لو أهملت int لصرخ TypeError في سطر speed + 5.)',
        en: 'In a real terminal the second line would read: speed = input("What is your speed? ") — the rest identical. input brought the text, int translated it into a number, + computed, and print announced 22. Four small tools = a full dialogue with the user. (Skip int and TypeError screams at the speed + 5 line.)',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التعليقات: الهمس الذي لا يسمعه بايثون', en: 'Comments: the whisper Python never hears' },
      chunks: [
        {
          ar: 'كل ما بعد # حتى نهاية السطر يُتجاهل تمامًا: تعليقًا كان على سطر مستقل أم في نهاية سطر كود. البرامج تكبر وتصعب قراءتها، والتعليق يشرح باللغة الطبيعية ما يفعله الكود ولماذا.',
          en: 'Everything after # until the end of the line is completely ignored: whether the comment stands alone on its own line or trails the end of a code line. Programs grow and get hard to read, and a comment explains in natural language what the code does and why.',
        },
        {
          ar: 'لكن انتبه: أفضل تعليق يشرح السبب لا الواضح. v = 5 # assign 5 to v تعليق بلا قيمة — الكود يقوله أصلًا. أما v = 5 # السرعة بالمتر/ثانية فهو كنز: معلومة لا وجود لها في الكود. والأسماء الوصفية الجيدة — من الدرس الماضي — تقلل حاجتك للتعليقات أصلًا.',
          en: 'But beware: the best comment explains why, not the obvious. v = 5 # assign 5 to v is worthless — the code already says it. While v = 5 # speed in meters/second is a treasure: information that exists nowhere in the code. And good descriptive names — from last lesson — reduce your need for comments in the first place.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-input-type',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'المستخدم كتب 42 ثم ضغط Enter أمام input(). ما نوع ما يعيده input؟',
        en: 'The user typed 42 and pressed Enter at input(). What is the type of what input returns?',
      },
      options: [
        { id: 'a', text: { ar: 'عدد صحيح int', en: 'An integer int' } },
        { id: 'b', text: { ar: 'سلسلة نصية str — دائمًا، حتى لو كانت أرقامًا', en: 'A string str — always, even for digits' } },
        { id: 'c', text: { ar: 'يعتمد على ما كتب المستخدم', en: 'It depends on what the user typed' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'الفخّ في الخيار الثالث: يبدو منطقيًا لكنه خاطئ.', en: 'The trap is the third option: it sounds logical but is wrong.' },
        { ar: 'تذكّر أن لوحة المفاتيح تنتج حروفًا…', en: 'Remember, a keyboard produces characters…' },
        { ar: 'لهذا احتجنا int() أصلًا.', en: 'That is exactly why we needed int() at all.' },
        { ar: 'الجواب: str دائمًا — والتحويل مسؤوليتك أنت بـ int().', en: 'Answer: always str — conversion is your job, via int().' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.fill-comment',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: التعليق في بايثون يبدأ بالرمز ______.',
        en: 'Fill in: a Python comment starts with the symbol ______.',
      },
      answer: '#',
      solution: '#',
      hints: [
        { ar: 'رأيته أعلى كل ملف تدربت عليه اليوم.', en: 'You have seen it at the top of every file you practiced on today.' },
        { ar: 'هو المفتاح الذي يمنع بايثون من قراءة ما بعده.', en: 'It is the key that stops Python from reading what follows.' },
        { ar: 'رمز واحد يحمل اسم «هاش» أو «مربع».', en: 'One symbol, named hash or pound.' },
        { ar: 'الجواب: #', en: 'Answer: #' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — وثّق برنامجك وأنت تكتبه\n# Your playground — document your program as you write it\n\n# محاكي محادثة قصيرة / a tiny conversation simulator\ntyped = "سارة"      # ما «كتبه» المستخدم / what the user "typed"\nname = typed        # في برنامج حقيقي: التابع input يقرأ الإجابة في name\nprint("أهلًا يا " + name)  # + تلصق النصوص / + glues strings',
      prompt: {
        ar: 'جرّب بنفسك: غيّر قيمة typed، أضف سؤالًا ثانيًا محاكى (مثل عمر)، وحوّله بـ int إن كان رقمًا. اكتب تعليقًا يشرح السبب — لا الواضح. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: change typed’s value, add a second simulated question (like age), and convert it with int if it is a number. Write a comment explaining why — not the obvious. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة لدرس الأمس: ما ناتج 7 % 2؟',
            en: 'Back to yesterday: what is 7 % 2?',
          },
          options: [
            { id: 'a', text: { ar: '3.5', en: '3.5' } },
            { id: 'b', text: { ar: '1', en: '1' } },
            { id: 'c', text: { ar: '0', en: '0' } },
          ],
          answer: 'b',
          explanation: {
            ar: '7 // 2 = 2 والباقي 1 — وهذا الباقي هو % بالضبط. باقي 0 كان سيعني زوجية.',
            en: '7 // 2 = 2 with remainder 1 — and that remainder is exactly %. A remainder of 0 would mean even.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'وتذكّر الفصل الأول: print("17") يطبع نصًّا. ما الدالة التي ترجعه عددًا؟',
            en: 'And back to chapter 1: print("17") prints text. Which function turns it back into a number?',
          },
          options: [
            { id: 'a', text: { ar: 'str()', en: 'str()' } },
            { id: 'b', text: { ar: 'int()', en: 'int()' } },
            { id: 'c', text: { ar: 'type()', en: 'type()' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'int("17") تعيد العدد 17 — وكلمة type تخبرك بالنوع ولا تغيّره.',
            en: 'int("17") returns the number 17 — while type only tells you the type, never changes it.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ماذا يفعل البرنامج عند الوصول إلى استدعاء input؟',
            en: 'What does the program do when it reaches an input call?',
          },
          options: [
            { id: 'a', text: { ar: 'يتوقف وينتظر حتى يكتب المستخدم ويضغط Enter', en: 'Pauses and waits until the user types and presses Enter' } },
            { id: 'b', text: { ar: 'يمسح الشاشة', en: 'Clears the screen' } },
            { id: 'c', text: { ar: 'ينهي البرنامج فورًا', en: 'Ends the program immediately' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذه لحظة الإصغاء: البرنامج يتوقف، والمستخدم يكتب، ثم يُستأنف التنفيذ وما كُتب يعاد كنص.',
            en: 'That is the listening moment: the program pauses, the user types, then execution resumes with the typed text returned as a string.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'المستخدم كتب 5 أمام input ثم نفذت بايثون: int(الناتج) + 2. كم النتيجة؟',
            en: 'The user typed 5 at input, then Python runs: int(result) + 2. What is the result?',
          },
          options: [
            { id: 'a', text: { ar: '52', en: '52' } },
            { id: 'b', text: { ar: '7', en: '7' } },
            { id: 'c', text: { ar: 'خطأ TypeError', en: 'A TypeError' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الناتج كان النص "5"، وint حوّله إلى العدد 5، فأصبح 5 + 2 = 7. بلا التحويل كان الجمع سينفجر TypeError.',
            en: 'The return was the text "5"; int converted it to the number 5, making 5 + 2 = 7. Without the conversion the addition would explode with TypeError.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "typed = '25'\nprint(typed + 5)",
          right: "typed = '25'\nprint(int(typed) + 5)",
          note: {
            ar: 'النص + الرقم = TypeError: لا يمكن لبايثون أن تخمّن هل تريد 30 أم "255". حوّل أولًا بـ int ثم اجمع.',
            en: 'Text + number = TypeError: Python will not guess whether you want 30 or "255". Convert with int first, then add.',
          },
        },
        {
          wrong: "# طباعة الترحيب print('مرحبا')",
          right: "# طباعة الترحيب\nprint('مرحبا')",
          note: {
            ar: 'وضعت الأمر كله على سطر التعليق فأصبح غير مرئي لبايثون: كل ما بعد # في السطر نفسه يتجاهل. ضع التعليق في سطر والكود في سطر.',
            en: 'You put the whole command on the comment line, making it invisible to Python: everything after # on the same line is ignored. Comment on one line, code on another.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'input() يوقف البرنامج وينتظر المستخدم ويعيد ما كتبه كنص str دائمًا — حتى لو كانت أرقامًا.', en: 'input() pauses the program, waits for the user, and returns what they typed as a str — always, even digits.' },
        { ar: 'int() تترجم النص الرقمي إلى عدد صحيح قابل للحساب، وترفض بصراحة ما ليس رقمًا (ValueError).', en: 'int() translates numeric text into a computable integer, and frankly refuses anything else (ValueError).' },
        { ar: 'التعليق # رسالة للبشر تتجاهلها بايثون كليًا: اشرح السبب لا الواضح، واسمّ جيدًا لتقلل الحاجة إليه.', en: 'A # comment is a human message Python ignores entirely: explain why, not the obvious — and name things well to need fewer of them.' },
      ],
      reflectPrompt: {
        ar: 'لو صممت برنامجك الأول لتفعيل شيء حقيقي: ما السؤال الذي ستضعه داخل input() أولًا، ولماذا؟',
        en: 'If your first real program activated something in your life: what question would you put inside input() first, and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch2.s10', pages: 'ص30-31 / pp.30-31' },
        { book: 'PY4E', section: 'py4e.ch2.s11', pages: 'ص31-32 / pp.31-32' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch2.s10', pages: 'ص30-31 / pp.30-31' },
    { book: 'PY4E', section: 'py4e.ch2.s11', pages: 'ص31-32 / pp.31-32' },
  ],
} satisfies Lesson;

export default lesson;
