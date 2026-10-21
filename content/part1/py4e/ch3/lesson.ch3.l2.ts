import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch3.l2 — "if and Alternative Execution / الشرط if والتنفيذ البديل"
 * Aligned with PY4E ch3 s3 (التنفيذ المشروط), s4 (التنفيذ البديل).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch3.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 3,
  title: { ar: 'الشرط if والتنفيذ البديل', en: 'if and Alternative Execution' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch3.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حتى الآن كانت أسطر برامجك تُنفَّذ كلها، واحدًا تلو الآخر، بلا استثناء. لكن الحياة الحقيقية مشروطة: إن أمطرت فخذ المظلة، وإلا اتركها. عبارة if تمنح برنامجك أول قدرته على القرار: إن تحقق الشرط افعل شيئًا، وإلا افعل شيئًا آخر — أو لا تفعل شيئًا إطلاقًا.',
        en: 'Until now every line of your programs ran, one after another, with no exceptions. But real life is conditional: if it rains, take the umbrella; otherwise leave it. The if statement gives your program its first power of decision: if the condition holds, do something; otherwise do something else — or nothing at all.',
      },
    },
    {
      kind: 'predict',
      code: "x = 3\nif x < 10:\n    print('Small')\nprint('Done')",
      question: {
        ar: 'أي الرسالتين ستظهر: Small، أم Done، أم كلتاهما؟',
        en: 'Which message will appear: Small, or Done, or both?',
      },
      reveal: {
        ar: "كلتاهما! الشرط محقَّق فطُبع Small، وprint('Done') ليست بمسافة بادئة فهي خارج الكتلة: تُنفَّذ دائمًا سواء تحقق الشرط أم لا. المسافة البادئة هي التي تحدد من ينتمي إلى قرار if ومن لا ينتمي.",
        en: "Both! The condition held so Small printed, and print('Done') is not indented — it is outside the block: it always runs whether the condition holds or not. Indentation is what decides who belongs to the if decision and who does not.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'بنية if: سطر رئيسي وكتلة بادئة', en: 'The if structure: a header line and an indented block' },
      chunks: [
        {
          ar: "أبسط صيغة: if x > 0: ثم تحتها سطر بادئ print('x is positive'). التعبير المنطقي بعد if يسمى الشرط. السطر الرئيسي ينتهي بنقطتين : ثم تأتي أسطر الكتلة بمسافة بادئة (4 فراغات أو مفتاح Tab). إن تحقَّق الشرط نُفِّذت الكتلة، وإن لم يتحقَّق تُجاهلت كليًا وكأنها غير موجودة.",
          en: "The simplest form: if x > 0: followed by an indented line print('x is positive'). The boolean expression after if is called the condition. The header line ends with a colon : and the block lines come indented (4 spaces or the Tab key). If the condition holds the block runs; if not, it is skipped entirely as if it never existed.",
        },
        {
          ar: 'هذا الشكل — سطر رئيسي بنقطتين تتبعه كتلة بادئة — يسمى العبارة المركّبة، وهو نفس بناء تعريف التوابع وحلقات for التي ستأتي في فصول قادمة: تعلّمه مرة واحدة وتستخدمه في كل مكان. ولاحظ: يجب أن يلي if تعليمة واحدة بادئة على الأقل. إن لم تكتب الكود بعد فاستخدم pass التي لا تفعل شيئًا، كعنصر نائب: if x < 0: pass — مع تعليق يحفظ نيتك.',
          en: 'This shape — a colon-terminated header followed by an indented block — is called a compound statement, and it is the same skeleton as function definitions and for loops coming in later chapters: learn it once, use it everywhere. Note also: at least one indented statement must follow if. If you have not written the code yet, use pass, which does nothing, as a placeholder: if x < 0: pass — with a comment preserving your intent.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المسافة البادئة قواعد لا تجميل', en: 'Indentation is grammar, not decoration' },
      chunks: [
        {
          ar: 'في لغات أخرى تفصل الأقواس { } بين الكتل، أما في بايثون فالمسافة البادئة جزء من قواعد اللغة نفسها: أربع فراغات تعني «أنا داخل if». نسيانها يوقف البرنامج برسالة IndentationError: expected an indented block، وخلط مستويين مختلفين داخل الكتلة نفسها يرفض أيضًا. واجعل عادتك: 4 فراغات دائمًا، ولا تخلط Tab مع الفراغات في الملف نفسه.',
          en: 'In other languages braces { } separate blocks; in Python indentation is part of the grammar itself: four spaces mean “I am inside the if”. Forgetting it stops the program with IndentationError: expected an indented block, and mixing two different levels inside the same block is refused too. Make it a habit: 4 spaces always, and never mix Tab with spaces in the same file.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التنفيذ البديل: if وelse', en: 'Alternative execution: if and else' },
      chunks: [
        {
          ar: "الصيغة الثانية تعطي احتمالين يفصل بينهما الشرط: if x % 2 == 0: print('x is even') ثم else: print('x is odd'). بما أن الشرط إما محقَّق أو غير محقَّق، فسيُنفَّذ أحد الفرعين حتمًا — وتسمى الفرعان فروعًا لأنهما طريقان ينفصلان في مسار التنفيذ. وانتبه: else لا تأخذ شرطًا بعدها — النقطتان فقط.",
          en: "The second form offers two possibilities, separated by the condition: if x % 2 == 0: print('x is even'), then else: print('x is odd'). Since the condition is either true or false, exactly one of the two branches must run — and the two are called branches because they are diverging paths in the execution flow. Beware: else takes no condition after it — just the colon.",
        },
        {
          ar: 'قاعدة النقطتين ستلاحقك بأشكال كثيرة: if ...: وelse: كلاهما سطر رئيسي ينتهي بـ :. نسيانها هو أشهر خطأ قواعدي في الفصل كله، ورسالته SyntaxError: invalid syntax — حينها عد إلى السطر الذي يشير إليه الخطأ وتفقّد النقطتين أولًا، ثم المسافة البادئة بعدها.',
          en: 'The colon rule will chase you in many shapes: if ...: and else: are both header lines ending in :. Forgetting it is the most common syntax error of the whole chapter, reported as SyntaxError: invalid syntax — when you see it, return to the line the error points to, check the colon first, then the indentation after it.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'زوجي أم فردي — أول قرار كامل', en: 'Even or odd — your first full decision' },
      code: "x = 4\nif x % 2 == 0:\n    print('زوجي')\nelse:\n    print('فردي')",
      explanation: {
        ar: 'الشرط يستعير عامل الباقي % من الفصل الثاني: 4 % 2 يساوي 0 فالعدد زوجي، فيُنفَّذ الفرع الأول فقط ويُطبع زوجي، ويُتجاهل الفرع الآخر كليًا. غيّر 4 إلى 7 وأعد التشغيل: سينقلب القرار إلى الفرع الثاني. قراران مكتوبان في الكود، وفرع واحد يُنفَّذ في كل تشغيل.',
        en: 'The condition borrows the remainder operator % from chapter 2: 4 % 2 equals 0, so the number is even — only the first branch runs and زوجي prints, while the other branch is skipped entirely. Change 4 to 7 and run again: the decision flips to the second branch. Two branches written in code, exactly one executed per run.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.hot-or-mild',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'عرّف temp = 42، ثم اكتب بنية if/else: إن كان temp أكبر من 40 اطبع حار، وإلا اطبع معتدل. سينفَّذ فرع واحد فقط.',
        en: 'Define temp = 42, then write an if/else structure: if temp is greater than 40 print حار, otherwise print معتدل. Only one branch will run.',
      },
      starterCode: 'temp = 42\n# if ... :\n#     ...\n',
      solution: "temp = 42\nif temp > 40:\n    print('حار')\nelse:\n    print('معتدل')",
      tests: [
        {
          id: 't1',
          name: { ar: 'يُطبع حار', en: 'حار is printed' },
          code: "assert 'حار' in __learner_output__, ('expected: حار | actual: %r' % __learner_output__)",
          expected: 'حار',
        },
        {
          id: 't2',
          name: { ar: 'لا يُطبع معتدل — الفرع الآخر تُجاهل', en: 'معتدل is not printed — the other branch was skipped' },
          code: "assert 'معتدل' not in __learner_output__, ('expected: no معتدل | actual: %r' % __learner_output__)",
          expected: 'حار فقط / حار only',
        },
      ],
      hints: [
        { ar: 'الشرط مقارنة من درس الأمس: temp > 40.', en: 'The condition is a comparison from yesterday’s lesson: temp > 40.' },
        { ar: 'تذكّر الهيكل: سطر if بنقطتين، تحته سطر بادئ، ثم else بنقطتين وسطر بادئ.', en: 'Remember the skeleton: an if line with a colon, an indented line under it, then else with a colon and an indented line.' },
        { ar: "الهيكل:\ntemp = 42\nif temp > 40:\n    print('حار')\nelse:\n    print('معتدل')", en: "The skeleton:\ntemp = 42\nif temp > 40:\n    print('حار')\nelse:\n    print('معتدل')" },
        { ar: "temp = 42\nif temp > 40:\n    print('حار')\nelse:\n    print('معتدل')", en: "temp = 42\nif temp > 40:\n    print('حار')\nelse:\n    print('معتدل')" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-skip',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'الشرط هنا لن يتحقَّق. توقّع ما سيُطبَع بالضبط — دون تشغيل.',
        en: 'The condition here will not hold. Predict exactly what gets printed — without running.',
      },
      code: "n = 7\nif n > 10:\n    print('كبير')\nprint('انتهى')",
      solution: 'انتهى',
      answer: 'انتهى',
      hints: [
        { ar: 'اسأل أولًا: هل 7 > 10؟', en: 'Ask first: is 7 > 10?' },
        { ar: 'الشرط خاطئ فتُجاهل الكتلة البادئة كلها.', en: 'The condition is false, so the whole indented block is skipped.' },
        { ar: 'لكن السطر غير البادئ ليس داخل الكتلة — متى يُنفَّذ؟', en: 'But the non-indented line is not inside the block — when does it run?' },
        { ar: 'الخرْج: انتهى', en: 'The output: انتهى' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.fill-compound',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: العبارة التي تتكون من سطر رئيسي ينتهي بنقطتين تتبعه كتلة مسافة بادئة تسمى العبارة ______.',
        en: 'Complete the term: a statement made of a header line ending in a colon followed by an indented block is called a ______ statement.',
      },
      answer: 'المركبة',
      solution: 'المركبة',
      hints: [
        { ar: 'كلمة من حرفين تقريبا — عكس «بسيطة».', en: 'The opposite of “simple”.' },
        { ar: 'سميت كذلك لأنها تتكون من أكثر من سطر.', en: 'It is named that because it consists of more than one line.' },
        { ar: 'الكتاب يستخدمها لوصف if وelse معًا.', en: 'The book uses it to describe both if and else.' },
        { ar: 'الجواب: المركبة', en: 'Answer (in Arabic): المركبة — compound' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.mcq-else-condition',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا لا نكتب بعد else شرطًا مثل else x < 0: ؟',
        en: 'Why do we never write a condition after else, like else x < 0: ?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن else تعني «وإلا» تلقائيًا: كل ما لم يتحقق فوقها', en: 'Because else automatically means “otherwise”: everything the conditions above did not catch' } },
        { id: 'b', text: { ar: 'لأن else تأخذ شرطًا دائمًا لكنه مخفي', en: 'Because else always takes a hidden condition' } },
        { id: 'c', text: { ar: 'حتى يصير الكود أقصر', en: 'Just to make the code shorter' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الشرط إما محقَّق أو غير محقَّق — لا احتمال ثالث.', en: 'A condition is either true or false — there is no third option.' },
        { ar: 'إذا وصل التنفيذ إلى else فمعنى ذلك أن الشرط فوقها فشل بالفعل.', en: 'If execution reached else, the condition above has already failed.' },
        { ar: 'إذًا else هي «كل الباقي» — لا تحتاج سؤالًا جديدًا.', en: 'So else is “everything left” — it needs no new question.' },
        { ar: 'الجواب: أ — else تعني تلقائيًا كل ما لم يلتقطه الشرط.', en: 'Answer: a — else automatically means whatever the condition did not catch.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — صمّم قرارك الخاص\n# Your playground — design your own decision\n\ndegree = 75\nif degree >= 60:\n    print('ناجح')\nprint('انتهى الفحص')",
      prompt: {
        ar: "جرّب بنفسك: غيّر degree إلى 50 ولاحظ اختفاء ناجح وبقاء انتهى الفحص. أضف فرع else. ثم جرّب حذف المسافة البادئة من سطر print('ناجح') واقرأ رسالة الخطأ بعين مطمئنة — قراءة الأخطاء مهارة، لا عار.",
        en: "Try it yourself: change degree to 50 and watch ناجح disappear while انتهى الفحص stays. Add an else branch. Then try removing the indentation from the print('ناجح') line and read the error message calmly — reading errors is a skill, not a shame.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'من دروس الفصل الثاني: ما ناتج 10 % 2 — الذي تعتمد عليه زوجية الأعداد؟',
            en: 'From chapter 2 lessons: what is 10 % 2 — the test behind even numbers?',
          },
          options: [
            { id: 'a', text: { ar: '0', en: '0' } },
            { id: 'b', text: { ar: '5', en: '5' } },
            { id: 'c', text: { ar: '2', en: '2' } },
          ],
          answer: 'a',
          explanation: {
            ar: '10 % 2 = 0 — باقي القسمة صفر، ولذلك كان الشرط x % 2 == 0 هو اختبار الزوجية في مثال الدرس.',
            en: '10 % 2 = 0 — the remainder is zero, which is why x % 2 == 0 is the evenness test used in the lesson’s example.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا تفعل الكتلة البادئة بعد if عندما يكون الشرط غير محقَّق؟',
            en: 'What happens to the indented block after if when the condition is false?',
          },
          options: [
            { id: 'a', text: { ar: 'تُنفَّذ كما هي', en: 'It runs as usual' } },
            { id: 'b', text: { ar: 'تُجاهل كليًا', en: 'It is skipped entirely' } },
            { id: 'c', text: { ar: 'ينهار البرنامج', en: 'The program crashes' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'هذا معنى الشرط بالضبط: الكتلة تنفذ عند التحقق وتتجاهل عند خلافه — كما في تمرين التتبع أعلاه.',
            en: 'That is exactly what a condition means: the block runs when it holds and is skipped when it does not — as the trace exercise above showed.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الأول: نسيان النقطتين بعد if — إلى أي عائلة من عائلات الأخطاء الثلاث ينتمي؟',
            en: 'And from chapter 1: forgetting the colon after if — which of the three error families is it?',
          },
          options: [
            { id: 'a', text: { ar: 'خطأ قواعدي SyntaxError قبل التشغيل', en: 'A syntax error, caught before running' } },
            { id: 'b', text: { ar: 'خطأ أثناء التشغيل', en: 'A runtime error' } },
            { id: 'c', text: { ar: 'خطأ دلالي صامت', en: 'A silent semantic error' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'شكل السطر غير صحيح فترفضه بايثون قبل التنفيذ برسالة SyntaxError: invalid syntax — والعلاج: عد للسطر المذكور وأضف :.',
            en: 'The line’s shape is wrong, so Python refuses it before running with SyntaxError: invalid syntax — the fix: go to the reported line and add the :.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'كم فرعًا يُنفَّذ في بنية if/else في كل تشغيل؟',
            en: 'How many branches of an if/else run on each execution?',
          },
          options: [
            { id: 'a', text: { ar: 'واحد بالضبط', en: 'Exactly one' } },
            { id: 'b', text: { ar: 'اثنان دائمًا', en: 'Always two' } },
            { id: 'c', text: { ar: 'صفر إن لم يتحقق الشرط', en: 'Zero if the condition is false' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الشرط إما محقَّق أو غير محقَّق، فأحد الفرعين حتمًا — لا ثالث ولا اثنان. هذه هي «التنفيذ البديل».',
            en: 'The condition is either true or false, so exactly one branch runs — never two, never zero. That is “alternative execution”.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "if x > 0\n    print('موجب')",
          right: "if x > 0:\n    print('موجب')",
          note: {
            ar: 'النقطتان إلزاميتان في نهاية السطر الرئيسي — غيابهما أشهر SyntaxError في الفصل كله.',
            en: 'The colon is mandatory at the end of the header line — forgetting it is the chapter’s most common SyntaxError.',
          },
        },
        {
          wrong: "if x > 0:\nprint('موجب')",
          right: "if x > 0:\n    print('موجب')",
          note: {
            ar: 'بدون المسافة البادئة لا تعرف بايثون أن السطر داخل if فترفع IndentationError. أربع فراغات دائمًا.',
            en: 'Without indentation Python cannot tell the line belongs to the if and raises IndentationError. Four spaces, always.',
          },
        },
        {
          wrong: "if x > 0:\n    print('موجب')\n    print('انتهى')",
          right: "if x > 0:\n    print('موجب')\nprint('انتهى')",
          note: {
            ar: 'هل تريد انتهى في كل الحالات؟ أخرجه من الكتلة: ما بادئ ينفَّذ مع القرار فقط، وما غير بادئ يُنفَّذ دائمًا — الإزاحة هنا تغيّر معنى البرنامج كله.',
            en: 'Want انتهى in every case? Take it out of the block: indented lines run only with the decision; non-indented lines always run — indentation here changes the whole meaning of the program.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'if تنفّذ كتلة بادئة فقط عندما يتحقق شرطها المنطقي، وإلا تتجاهلها كليًا.', en: 'if runs its indented block only when its boolean condition holds; otherwise the block is skipped entirely.' },
        { ar: 'العبارة المركبة: سطر رئيسي بنقطتين + كتلة بادئة بأربع فراغات — نفس بناء التوابع والحلقات لاحقًا.', en: 'A compound statement: a colon-terminated header + a 4-space indented block — the same skeleton as functions and loops later on.' },
        { ar: 'else يعطي البديل: فرعان ويُنفَّذ واحد حتمًا — والفرعان طريقان ينفصلان في مسار البرنامج.', en: 'else provides the alternative: two branches, exactly one must run — the branching point of your program’s flow.' },
      ],
      reflectPrompt: {
        ar: 'اكتب قرارًا من يومك بصيغة if/else بعينيك (بالعربية لا بأس): إن... وإلا... — ثم صُغ شرطه تعبيرًا منطقيًا بايثونيًا.',
        en: 'Write a decision from your day as if/else in your own words (Arabic is fine): if... else... — then phrase its condition as a Python boolean expression.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch3.s3', pages: 'ص40-42 / pp.40-42' },
        { book: 'PY4E', section: 'py4e.ch3.s4', pages: 'ص42-43 / pp.42-43' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch3.s3', pages: 'ص40-42 / pp.40-42' },
    { book: 'PY4E', section: 'py4e.ch3.s4', pages: 'ص42-43 / pp.42-43' },
  ],
} satisfies Lesson;

export default lesson;
