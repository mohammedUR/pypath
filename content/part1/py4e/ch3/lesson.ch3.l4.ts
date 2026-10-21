import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch3.l4 — "Handling Errors with try and except / معالجة الأخطاء بـ try و except"
 * Aligned with PY4E ch3 s7 (التعامل مع الاستثناء باستخدام بنية try وexcept).
 * All expression is original.
 * Sandbox note: no keyboard here, so user input is simulated with the `typed`
 * variable (same pattern as ch2.l5) — try/except still protects int()/float().
 */
const lesson = {
  id: 'py4e.ch3.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 3,
  title: { ar: 'معالجة الأخطاء بـ try و except', en: 'Handling Errors with try and except' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch3.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'المستخدم سيكتب حروفًا حيث تتوقع أرقامًا — اليوم أو بعد شهر، وهذا موعود لا قرار منه. البرنامج الجيد لا ينهار أمام ذلك؛ يلتقط أنفاسه ويرد بلطف. try/except هي خوذة برنامجك: لا تمنع الضربة، لكنها تحوّلها من انهيار مهين إلى رسالة مهذبة.',
        en: 'The user will type letters where you expect numbers — today or a month from now, that is a promise, not a possibility. A good program does not collapse; it catches its breath and answers politely. try/except is your program’s helmet: it does not prevent the blow, but turns a humiliating crash into a polite message.',
      },
    },
    {
      kind: 'predict',
      expectedError: 'ValueError',  // intentional crash-teaching; verified by checks replay
      code: "print('قبل')\nx = int('fred')\nprint('بعد')",
      question: {
        ar: 'هل ستظهر الرسالتان معًا: قبل وبعد؟',
        en: 'Will both messages appear: before and after?',
      },
      reveal: {
        ar: "يظهر قبل فقط: int رفض التحويل ورمى ValueError فتوقف التنفيذ فورًا — لم يصل البرنامج إلى بعد أبدًا. الخطأ غير المعالَج يقطع البرنامج في منتصفه، وهذه هي المشكلة التي سنتعلم حماية أنفسنا منها اليوم.",
        en: "Only قبل appears: int refused the conversion and raised ValueError, so execution stopped instantly — the program never reached بعد. An unhandled error cuts the program in the middle, and that is exactly the problem we learn to protect against today.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'موجز التتبع: صديق لا عدو', en: 'The traceback: a friend, not an enemy' },
      chunks: [
        {
          ar: "عندما ينفجر برنامجٌ نصّي، تعرض بايثون موجز تتبع (Traceback) يشبه جدارًا من الكلمات. لا تخف منه: اقرأه من آخر سطر أولًا — هناك اسم الخطأ ورسالته المختصرة، مثل ValueError: could not convert string to float: 'fred'. وفوقه أسطر تخبرك بأي ملف وأي رقم سطر حدث الانفجار: انتقل إلى ذلك السطر وابدأ التشخيص. آخر سطر = مصدر الصراخ، ورقم السطر = عنوان البحث.",
          en: "When a script explodes, Python shows a Traceback that looks like a wall of words. Do not panic: read its last line first — that is where the error name and its short message live, like ValueError: could not convert string to float: 'fred'. Above it, lines tell you which file and which line number blew up: go to that line and start diagnosing. Last line = the source of the scream; the line number = the address to search.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'try/except: الضمان', en: 'try/except: the insurance policy' },
      chunks: [
        {
          ar: 'بنية try/except مضمّنة في بايثون لمعالجة الأخطاء المتوقعة وغير المتوقعة. الفكرة: ضع الأسطر الخطرة داخل try:، فإن سار التنفيذ سليمًا تجاهلت بايثون كتلة except كليًا، وإن حدث خطأ قفزت فورًا إلى except ونفّذتها بدل أن تنهار. يشبهها الكتاب بسياسة الضمان للتنفيذ التسلسلي: لا تدفع ثمن except إلا إذا تعطّل شيء.',
          en: 'try/except is a built-in Python structure for handling expected and unexpected errors. The idea: put the risky lines inside try:; if everything runs smoothly Python ignores the except block entirely, and if an error occurs it jumps straight to except and runs it instead of collapsing. The book compares it to an insurance policy for the sequential flow: you pay for except only when something breaks.',
        },
        {
          ar: 'هذا يسمى التقاط الاستثناء. والمعالجة ليست مجرد طباعة رسالة: الكتاب يذكر أن التقاط الاستثناء فرصة لإصلاح المشكلة، أو المحاولة مرة أخرى، أو — على الأقل — إنهاء البرنامج بأمان. المستخدم الذي كتب fred بدلًا من رقم يقرأ «الرجاء إدخال عدد» بدل رؤية برنامجه يسقط أمام عينيه.',
          en: 'This is called catching an exception. And handling is more than printing a message: the book says catching the exception is a chance to fix the problem, try again, or — at the very least — end the program gracefully. The user who typed fred instead of a number reads «الرجاء إدخال عدد» instead of watching the program fall on its face.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'أين تضع القوس الواقي', en: 'Where to place the protective arc' },
      chunks: [
        {
          ar: 'ضع داخل try أصغر كتلة تحتوي الخطورة: عادةً سطر التحويل int(...) أو float(...) الذي قد يرفض إدخال المستخدم، وما يعتمد عليه بعده مباشرة. لا تحصر البرنامج كله في try وإلا أخفيت الأخطاء الحقيقية وصعُب التشخيص. وفي مثال الكتاب (محوّل الحرارة fahren2) وُضعت التحويل والحساب والطباعة داخل try معًا: لأنه لا معنى لمواصلة التنفيذ إذا فشل التحويل نفسه.',
          en: 'Put inside try the smallest block that contains the risk: usually the conversion line int(...) or float(...) that may refuse the user’s input, plus what directly depends on it. Do not wrap the entire program in try or you will hide real errors and make diagnosing harder. In the book’s example (the temperature converter fahren2) the conversion, the math and the print sit inside try together: there is no point continuing if the conversion itself failed.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'محوّل الحرارة المحمي — بمحاكاة الإدخال', en: 'The guarded temperature converter — with simulated input' },
      code: "# في المنصة لا توجد لوحة مفاتيح — نحاكي ما كتبه المستخدم\n# no keyboard here — we simulate the user's typing\ntyped = 'fred'\ntry:\n    fahr = float(typed)\n    cel = (fahr - 32.0) * 5.0 / 9.0\n    print(cel)\nexcept:\n    print('الرجاء إدخال عدد')",
      explanation: {
        ar: "هذا برنامج الكتاب نفسه (fahren2) بمحاكاة الإدخال: float(typed) يرفض fred فيقفز التنفيذ من منتصف try إلى except فيُطبع «الرجاء إدخال عدد». غيّر typed إلى '72' وأعد التشغيل: تنفَّذ الكتلة كاملة وتظهر الدرجة المئوية، ولم يُنفَّذ except إطلاقًا. هكذا يعمل الضمان: تدفع فقط عند الكسر.",
        en: "This is the book’s own program (fahren2) with simulated input: float(typed) rejects fred, execution jumps from the middle of try to except, and «الرجاء إدخال عدد» prints. Change typed to '72' and run again: the whole block executes, the Celsius value appears, and except never ran. That is how insurance works: you pay only when something breaks.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.safe-sum',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "المستخدم «كتب» في typed القيمة '12' (نص). اكتب بنية try/except: داخل try حوّل typed بـ int واطبع مجموعه مع 5 (المتوقع 17)، وفي except اطبع أرقام فقط.",
        en: "The user “typed” '12' into typed (a string). Write a try/except: inside try convert typed with int and print its sum with 5 (expected 17); inside except print أرقام فقط.",
      },
      starterCode: "typed = '12'\n# اكتب بنية try/except كاملة / write a full try/except\n",
      solution: "typed = '12'\ntry:\n    n = int(typed)\n    print(n + 5)\nexcept:\n    print('أرقام فقط')",
      tests: [
        {
          id: 't1',
          name: { ar: 'يُطبع 17', en: '17 is printed' },
          code: "assert '17' in __learner_output__, ('expected: 17 | actual: %r' % __learner_output__)",
          expected: '17',
        },
        {
          id: 't2',
          name: { ar: 'رسالة الخطأ لم تظهر — التحويل نجح', en: 'The error message did not appear — the conversion succeeded' },
          code: "assert 'أرقام فقط' not in __learner_output__, ('expected: no أرقام فقط | actual: %r' % __learner_output__)",
          expected: '17 فقط / 17 only',
        },
      ],
      hints: [
        { ar: 'تذكّر درس input في الفصل الثاني: التحويل int(typed) أولًا، ثم الجمع.', en: 'Remember the input lesson in chapter 2: convert with int(typed) first, then add.' },
        { ar: 'بنية try وexcept كلتاهما سطران رئيسيان بنقطتين، وتحتهما كتلتان بادئتان.', en: 'Both try and except are header lines with colons, each followed by an indented block.' },
        { ar: "الهيكل:\ntry:\n    n = int(typed)\n    print(n + 5)\nexcept:\n    print('أرقام فقط')", en: "The skeleton:\ntry:\n    n = int(typed)\n    print(n + 5)\nexcept:\n    print('أرقام فقط')" },
        { ar: "typed = '12'\ntry:\n    n = int(typed)\n    print(n + 5)\nexcept:\n    print('أرقام فقط')", en: "typed = '12'\ntry:\n    n = int(typed)\n    print(n + 5)\nexcept:\n    print('أرقام فقط')" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-jump',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تتبّع بعينيك: أي الحروف ستُطبع وبأي ترتيب؟ (رسالة واحدة قد تكون مفاجأة.)',
        en: 'Trace with your eyes: which letters get printed, in what order? (One of them is a surprise.)',
      },
      code: "print('أ')\ntry:\n    print('ب')\n    x = int('صفر')\n    print('ج')\nexcept:\n    print('د')\nprint('هـ')",
      solution: 'أ\nب\nد\nهـ',
      answer: 'أ\nب\nد\nهـ',
      hints: [
        { ar: 'أ تُطبع قبل الدخول في try، وب تُطبع داخلها.', en: 'أ prints before entering try, and ب prints inside it.' },
        { ar: "int('صفر') يفشل — ماذا يحدث لسطر ج الذي بعده؟", en: "int('صفر') fails — what happens to the line ج that follows?" },
        { ar: 'القفزة تذهب إلى except ثم يستكمل البرنامج بعدها من الطريق العام.', en: 'The jump lands in except, then the program continues on the main road.' },
        { ar: 'الخرْج:\nأ\nب\nد\nهـ', en: 'The output:\nأ\nب\nد\nهـ' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-valueerror',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "ماذا يرمي int('hello')؟",
        en: "What does int('hello') raise?",
      },
      options: [
        { id: 'a', text: { ar: 'ValueError', en: 'ValueError' } },
        { id: 'b', text: { ar: 'TypeError', en: 'TypeError' } },
        { id: 'c', text: { ar: 'SyntaxError', en: 'SyntaxError' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'النص موجود ومررت بمعامل صحيح — المشكلة في محتواه لا في نوعه.', en: 'The string exists and one argument was passed — the problem is its content, not its type.' },
        { ar: 'رأيت الرسالة نفسها في درس input بالفصل الثاني: invalid literal for int().', en: 'You saw this exact message in the chapter 2 input lesson: invalid literal for int().' },
        { ar: 'TypeError لنوعين لا يتعاملان، وSyntaxError للقواعد قبل التشغيل.', en: 'TypeError is for mismatched types; SyntaxError is for grammar before running.' },
        { ar: 'الجواب: ValueError — قيمة غير صالحة للتحويل.', en: 'Answer: ValueError — an invalid value for conversion.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — خوذتك الخاصة\n# Your playground — your own helmet\n\ntyped = '7'\ntry:\n    n = int(typed)\n    print(n * 3)\nexcept:\n    print('أدخل عددًا صحيحًا')",
      prompt: {
        ar: "جرّب بنفسك: غيّر typed إلى '3.5' ثم إلى 'سبعة' ولاحظ القفزة إلى except (3.5 يرفضه int لكن يقبله float — جرّب float('3.5') مباشرة). ثم أضف طباعة داخل try بعد حساب n وراقب أنها لا تُنفَّذ عند الفشل. لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: change typed to '3.5' and then to 'سبعة' and watch the jump to except (int rejects 3.5 but float accepts it — try float('3.5') directly). Then add a print inside try after computing n and watch it skip when the conversion fails. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الثاني: لماذا نحاصر التحويل int(typed) بـ try تحديدًا؟',
            en: 'And from chapter 2: why do we guard the conversion int(typed) with try specifically?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن input يعيد نصًّا دائمًا وقد لا يكون رقمًا', en: 'Because input always returns a string, which may not be a number' } },
            { id: 'b', text: { ar: 'لأن int عملية بطيئة', en: 'Because int is a slow operation' } },
            { id: 'c', text: { ar: 'لأن بايثون تفرضه قواعديًا', en: 'Because Python’s grammar forces it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'input يعيد str دائمًا، والمستخدم قد يكتب أي شيء؛ int ترفض غير الرقمي برمي ValueError — وtry/except يلتقطها بلطف.',
            en: 'input always returns a str and the user may type anything; int refuses non-numeric content by raising ValueError — and try/except catches it politely.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'متى تُنفَّذ كتلة except؟',
            en: 'When does the except block run?',
          },
          options: [
            { id: 'a', text: { ar: 'دائمًا بعد try', en: 'Always, right after try' } },
            { id: 'b', text: { ar: 'فقط إذا حدث خطأ داخل try', en: 'Only if an error occurs inside try' } },
            { id: 'c', text: { ar: 'إذا تحقق شرط منطقي نكتبه بعدها', en: 'When a boolean condition written after it holds' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'except ليست شرطًا بل استجابة: تنفَّذ فقط عند القفزة، وتُجاهل كليًا في التشغيل السليم.',
            en: 'except is not a condition but a response: it runs only on the jump, and is skipped entirely on a clean run.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'من أين تبدأ قراءة موجز التتبع (Traceback)؟',
            en: 'Where do you start reading a Traceback?',
          },
          options: [
            { id: 'a', text: { ar: 'من آخر سطر: اسم الخطأ ورسالته', en: 'From the last line: the error name and its message' } },
            { id: 'b', text: { ar: 'من أول سطر', en: 'From the first line' } },
            { id: 'c', text: { ar: 'من المنتصف', en: 'From the middle' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السطر الأخير يحمل نوع الخطأ ورسالته المختصرة، وفوقه رقم السطر المسبب — اقرأ من الأسفل وصعد.',
            en: 'The last line carries the error type and its short message, with the offending line number just above — read bottom-up.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'برنامج بلا try رمى خطأ عند سطره الثاني. ماذا حدث لبقية أسطره؟',
            en: 'A program without try raised an error at its second line. What happened to the rest of its lines?',
          },
          options: [
            { id: 'a', text: { ar: 'نُفِّذت عاديًا', en: 'They ran as usual' } },
            { id: 'b', text: { ar: 'لم تُنفَّذ — توقف التنفيذ فورًا', en: 'They never ran — execution stopped immediately' } },
            { id: 'c', text: { ar: 'تأجّلت حتى نهاية البرنامج', en: 'They were deferred to the end of the program' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'كما في توقّع الدرس: الخطأ غير المعالَج يقطع البرنامج في منتصفه — وهذا ما تمنعه try/except.',
            en: 'As the opening prediction showed: an unhandled error cuts the program in half — that is exactly what try/except prevents.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "typed = 'خمسة'\nn = int(typed)\nprint(n + 1)",
          right: "typed = 'خمسة'\ntry:\n    n = int(typed)\nexcept:\n    print('أرقام فقط')",
          note: {
            ar: 'التحويل الذي يلمس إدخال المستخدم بلا حماية قنبلة موقوتة: أول حرف غريب ينهي البرنامج. حاصر سطر التحويل.',
            en: 'A conversion touching user input without protection is a ticking bomb: the first odd character ends the program. Guard the conversion line.',
          },
        },
        {
          wrong: "try:\n    ...برنامجك كله مئة سطر...\nexcept:\n    pass",
          right: "try:\n    n = int(typed)\nexcept:\n    print('أرقام فقط')",
          note: {
            ar: 'القوس الواقي العريض يخفي كل الأخطاء — حتى الحقيقية منها — فيصبح التشخيص عمىً كاملًا. حاصر الأسطر الخطرة فقط، واجعل رسالتك مفيدة.',
            en: 'A wide protective arc hides every error — the genuine ones included — turning diagnosis into total blindness. Guard only the risky lines, and make your message useful.',
          },
        },
        {
          wrong: 'try\n    x = 1\nexcept:',
          right: 'try:\n    x = 1\nexcept:',
          note: {
            ar: 'try: وexcept: سطران رئيسيان — لكل منهما نقطتاه كما في if وelse، وتحتهما كتلتان بادئتان.',
            en: 'try: and except: are both header lines — each needs its colon, like if and else, each followed by an indented block.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'موجز التتبع يقرأ من آخر سطر: اسم الخطأ ورسالته، وأعلى منه مكان السطر المسبب.', en: 'Read a traceback from its last line: the error name and message, with the offending line just above.' },
        { ar: 'try/except يحاصر الخطورة: نجاح ← تُجاهل except، خطأ ← قفزة إلى except بدل الانهيار (التقاط الاستثناء).', en: 'try/except fences off the risk: success → except is skipped; error → jump to except instead of crashing (catching an exception).' },
        { ar: 'المعالجة الجيدة تمنح فرصة إصلاح أو إعادة محاولة أو إنهاء بأمان — واحصر try في الأسطر الخطرة.', en: 'Good handling offers a fix, a retry, or a graceful exit — and keeps try scoped to the risky lines only.' },
      ],
      reflectPrompt: {
        ar: 'تذكّر آخر مرة انهار أمامك تطبيق برسالة تقنية غامضة. لو كنت مطوّره: ماذا كانت سترسالة except الخاصة بك؟ اكتبها بجملة.',
        en: 'Recall the last time an app crashed on you with a cryptic technical message. If you were its developer: what would your except message have said? Write it in one sentence.',
      },
    },
    {
      kind: 'sources',
      items: [{ book: 'PY4E', section: 'py4e.ch3.s7', pages: 'ص46-48 / pp.46-48' }],
    },
  ],
  sources: [{ book: 'PY4E', section: 'py4e.ch3.s7', pages: 'ص46-48 / pp.46-48' }],
} satisfies Lesson;

export default lesson;
