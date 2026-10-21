import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch3.l3 — "Chained and Nested Conditionals / السلاسل الشرطية والشرط المتداخل"
 * Aligned with PY4E ch3 s5 (التسلسل الشرطي), s6 (الشرط المتداخل).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch3.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 3,
  title: { ar: 'السلاسل الشرطية والشرط المتداخل', en: 'Chained and Nested Conditionals' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch3.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'ليست كل القرارات نعم أو لا: في الامتحان A أو B أو C أو راسب، وفي المصعد الطابق الأول أو الثالث أو الأرضي. حين تحتاج أكثر من فرعين تكتب سلسلة شروط — وهنا يتربص بك أخطر أخطاء هذا الفصل: الترتيب. شرط في المكان الخطأ يلتقط كل شيء ويترك الباقي جوعى.',
        en: 'Not every decision is yes or no: in an exam you get A, B, C, or fail; an elevator stops at floor one, three, or the ground. When you need more than two branches you write a chain of conditions — and that is where the chapter’s most dangerous bug lurks: ordering. One condition in the wrong place swallows everything and leaves the rest starving.',
      },
    },
    {
      kind: 'predict',
      code: "x = 5\ny = 5\nif x < y:\n    print('أصغر')\nelif x > y:\n    print('أكبر')\nelse:\n    print('متساويان')",
      question: {
        ar: 'أي الرسائل الثلاث ستظهر؟',
        en: 'Which of the three messages will appear?',
      },
      reveal: {
        ar: "متساويان — فُحص الشرط الأول فلم يتحقق، ثم الثاني فلم يتحقق، فذهب التنفيذ إلى else. لاحظ الكلمة الجديدة elif: اختصار لعبارة else if، وهي التي تبني السلسلة الشرطية من فروع متتالية.",
        en: "متساويان — the first condition was checked and failed, then the second failed too, so execution fell through to else. Notice the new keyword elif: short for “else if” — the brick that builds a conditional chain of consecutive branches.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'السلسلة الشرطية: elif', en: 'The chained conditional: elif' },
      chunks: [
        {
          ar: "عندما يكون هناك أكثر من احتمالين نحتاج أكثر من فرعين: if x < y: ثم elif x > y: ثم else: — كل فرع بسطر رئيسي وكتلة بادئة كما تعرف. تُفحص الشروط بالترتيب من الأعلى إلى الأسفل: أول شرط يتحقق يُنفَّذ فرعه وتنتهي العبارة كلها — حتى لو كانت شروط أخرى بعد ستصح أيضًا. أول من يفوز يقطع الطريق على الجميع.",
          en: "When there are more than two possibilities you need more than two branches: if x < y:, then elif x > y:, then else: — each branch with its own header line and indented block, as you know. Conditions are checked top to bottom in order: the first one that holds runs its branch and the whole statement ends — even if later conditions would also have held. The first winner cuts the road for everyone.",
        },
        {
          ar: "لا حدّ لعدد elif في السلسلة، وelse في النهاية اختيارية: ضعها إن أردت فروعًا لـ «كل ما تبقى»، واحذفها إن لم ترد شيئًا يحدث حين تفشل كل الشروط. ومثال الكتاب: فحص choice == 'a' ثم choice == 'b' ثم choice == 'c' — ثلاثة فروع كلها تسأل عن المتغيّر نفسه، وواحد منها وحده سيُنفَّذ.",
          en: "There is no limit on the number of elif branches, and a final else is optional: include it when you want a branch for “whatever remains”, drop it when nothing should happen if all conditions fail. The book’s example checks choice == 'a', then choice == 'b', then choice == 'c' — three branches all asking about the same variable, and exactly one of them runs.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الترتيب يقرر', en: 'Ordering decides' },
      chunks: [
        {
          ar: 'في السلسلة الترتيب ليس ذوقًا بل معنى. لو فحصت score >= 60 قبل score >= 90، فالطالب الذي حصل على 95 سيلتقطه فرع الستين أولًا فيُقال عنه ناجح، ولن يصل التنفيذ أبدًا إلى ممتاز — كود سليم قواعديًا يعمل بلا رسائل، ونتيجته خاطئة: هذا خطأ دلالي صامت من عائلة الفصل الأول. القاعدة: ضع الشروط من الأخص إلى الأعم، واختبر عند الحدود (90، 60، 59).',
          en: 'In a chain, order is meaning, not taste. If you check score >= 60 before score >= 90, the branch for 60 catches the student who scored 95 first and calls them ناجح; execution never reaches ممتاز — code that is grammatically clean, runs without a single message, and produces a wrong answer: a silent semantic error from chapter 1’s family. The rule: order conditions from most specific to most general, and test at the boundaries (90, 60, 59).',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الشرط المتداخل وتسطيحه', en: 'Nested conditionals and flattening them' },
      chunks: [
        {
          ar: "يمكن وضع if داخل فرع من if آخر — هذا هو الشرط المتداخل: if x == y: ... else: وداخله if x < y: ... else: ... . الشرط الخارجي يحوي فرعين، وأحدهما يحتوي شرطًا كاملًا بفرعيه. الإزاحة تُظهر البنية بوضوح، لكن قراءة الشروط المتداخلة تصعب كلما تداخل أكثر — والكتاب ينصح بتجنّبها قدر الإمكان.",
          en: "You can place an if inside a branch of another if — that is a nested conditional: if x == y: ... else: and inside it if x < y: ... else: ... . The outer conditional has two branches, one of which contains a whole conditional with branches of its own. Indentation makes the structure visible, but nested conditionals get harder to read the deeper they go — the book advises avoiding them when you can.",
        },
        {
          ar: 'والحل الأنيق: العوامل المنطقية من درس أول الفصل تُسطّح التداخل. الشرطان المتداخلان — if 0 < x: وداخله if x < 10: — لا تنفَّذ الطباعة إلا إذا تحقق معًا، فيكفي سطر واحد: if 0 < x and x < 10: — بنية مسطّحة ومعناها مطابق تمامًا: x عدد موجب من خانة واحدة.',
          en: 'The elegant fix: the logical operators from the first lesson of this chapter flatten nesting. The two nested conditions — if 0 < x: and inside it if x < 10: — only print when both hold, so one line suffices: if 0 < x and x < 10: — a flat structure with an exactly equivalent meaning: x is a positive single-digit number.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'سلسلة الدرجات', en: 'The grade chain' },
      code: "score = 83\nif score >= 90:\n    print('ممتاز')\nelif score >= 75:\n    print('جيد جدًا')\nelif score >= 60:\n    print('ناجح')\nelse:\n    print('راسب')",
      explanation: {
        ar: '83 لا تنجو من >= 90 فتنزلق السلسلة إلى الأسفل، وتنجو في >= 75 فيُطبع جيد جدًا وتنتهي العبارة فورًا — 83 كانت ستنجح أيضًا في >= 60 لكنها لن تصل إليه أبدًا. جرّب 95 ثم 60 ثم 40 وراقب أي فرع يلتقط كل قيمة: أول من يتحقق يكفي.',
        en: '83 fails >= 90 so the chain slides down, succeeds at >= 75, prints جيد جدًا and the statement ends immediately — 83 would also pass >= 60, but it will never get there. Try 95, then 60, then 40 and watch which branch catches each value: the first one that holds is enough.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.grade-chain',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب سلسلة شرطية لمتغيّر score = 83: اطبع ممتاز إن score >= 90، وإلا جيد جدًا إن score >= 75، وإلا ناجح إن score >= 60، وإلا راسب. الترتيب جزء من التمرين!',
        en: 'Write a chained conditional for score = 83: print ممتاز if score >= 90, elif جيد جدًا if score >= 75, elif ناجح if score >= 60, else راسب. The ordering is part of the exercise!',
      },
      starterCode: 'score = 83\n# if ... :\n#     ...\n# elif ... :\n#     ...\n',
      solution: "score = 83\nif score >= 90:\n    print('ممتاز')\nelif score >= 75:\n    print('جيد جدًا')\nelif score >= 60:\n    print('ناجح')\nelse:\n    print('راسب')",
      tests: [
        {
          id: 't1',
          name: { ar: 'يُطبع جيد جدًا', en: 'جيد جدًا is printed' },
          code: "assert 'جيد جدًا' in __learner_output__, ('expected: جيد جدًا | actual: %r' % __learner_output__)",
          expected: 'جيد جدًا',
        },
        {
          id: 't2',
          name: { ar: 'فرع واحد فقط — لا ممتاز ولا ناجح ولا راسب', en: 'Exactly one branch — no ممتاز, no ناجح, no راسب' },
          code: "assert 'ممتاز' not in __learner_output__ and 'ناجح' not in __learner_output__ and 'راسب' not in __learner_output__, ('expected: single branch جيد جدًا | actual: %r' % __learner_output__)",
          expected: 'جيد جدًا فقط / جيد جدًا only',
        },
      ],
      hints: [
        { ar: 'ابدأ بالشرط الأخص: score >= 90 — ثم انزل تدريجيًا.', en: 'Start with the most specific condition: score >= 90 — then descend gradually.' },
        { ar: 'كل elif فرع بديل يُفحص فقط إذا فشل ما قبله.', en: 'Each elif is an alternative checked only when everything before it failed.' },
        { ar: "الهيكل:\nif score >= 90:\n    print('ممتاز')\nelif score >= 75:\n    print('جيد جدًا')\nelif score >= 60:\n    print('ناجح')\nelse:\n    print('راسب')", en: "The skeleton:\nif score >= 90:\n    print('ممتاز')\nelif score >= 75:\n    print('جيد جدًا')\nelif score >= 60:\n    print('ناجح')\nelse:\n    print('راسب')" },
        { ar: "score = 83\nif score >= 90:\n    print('ممتاز')\nelif score >= 75:\n    print('جيد جدًا')\nelif score >= 60:\n    print('ناجح')\nelse:\n    print('راسب')", en: "score = 83\nif score >= 90:\n    print('ممتاز')\nelif score >= 75:\n    print('جيد جدًا')\nelif score >= 60:\n    print('ناجح')\nelse:\n    print('راسب')" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-chain',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تتبّع السلسلة بعينيك وتوقّع الخرْج بالضبط.',
        en: 'Trace the chain with your own eyes and predict the exact output.',
      },
      code: "x = 9\nif x > 100:\n    print('ضخم')\nelif x > 5:\n    print('متوسط')\nelse:\n    print('صغير')",
      solution: 'متوسط',
      answer: 'متوسط',
      hints: [
        { ar: 'السؤال الأول: هل 9 > 100؟', en: 'First question: is 9 > 100?' },
        { ar: 'إن فشل الأول يُفحص elif التالي فقط.', en: 'If the first fails, only the next elif is checked.' },
        { ar: 'أول شرط يتحقق يطبع ويُنهي السلسلة.', en: 'The first condition that holds prints and ends the chain.' },
        { ar: 'الخرْج: متوسط', en: 'The output: متوسط' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-first-win',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في سلسلة حيث x = 100 وفُحصت شروط x > 10 ثم x > 5 — كلها صحيحة. أي فرع يُنفَّذ؟',
        en: 'In a chain where x = 100 and the conditions x > 10 then x > 5 are checked — all true. Which branch runs?',
      },
      options: [
        { id: 'a', text: { ar: 'الأول فقط — وأول شرط يتحقق يمنع فحص البقية', en: 'Only the first — and the first true condition stops the rest from being checked' } },
        { id: 'b', text: { ar: 'الفرع الأخير', en: 'The last branch' } },
        { id: 'c', text: { ar: 'كل الفروع التي تحققت شروطها بالترتيب', en: 'Every branch whose condition held, in order' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر مثال الدرجات: 83 كانت ستنجح في شرطين.', en: 'Remember the grades example: 83 would have passed two conditions.' },
        { ar: 'لكنها طُبعت رسالة واحدة فقط.', en: 'Yet only one message was printed.' },
        { ar: 'السلسلة تنتهي فور أول فرع يُنفَّذ.', en: 'The chain ends the moment one branch runs.' },
        { ar: 'الجواب: أ — أول شرط يتحقق يُنفَّذ فرعه وتنتهي العبارة.', en: 'Answer: a — the first true condition runs its branch and the statement ends.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-elif',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: الكلمة ______ اختصار لعبارة else if وهي التي تبني السلسلة الشرطية.',
        en: 'Fill in: the keyword ______ is short for “else if” and builds the conditional chain.',
      },
      answer: 'elif',
      solution: 'elif',
      hints: [
        { ar: 'أربعة حروف تبدأ بـ e.', en: 'Four letters, starting with e.' },
        { ar: 'رأيتها في توقّع بداية الدرس بين if وelse.', en: 'You saw it in the opening prediction, between if and else.' },
        { ar: 'هي if بشرط جديد تُفحص فقط إذا فشل شرط if الأصلي.', en: 'It is an if with a new condition, checked only when the original if failed.' },
        { ar: 'الجواب: elif', en: 'Answer: elif' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — سلسلة أم تداخل؟\n# Your playground — chain or nest?\n\nx = 7\nif x == 0:\n    print('صفر')\nelse:\n    if x < 10:\n        print('خانة واحدة')\n    else:\n        print('خانتان فأكثر')",
      prompt: {
        ar: 'الشرط المتداخل أعلاه يقرأ بصعوبة. أسطّحه: if x == 0 ... elif x < 10 ... else ... — ثم جرّب القيم 0 و7 و15 وتأكد أن السلسلة المُسطَّحة تعطي الأجوبة نفسها. أي النسختين أسهل على عينك بعد شهر؟',
        en: 'The nested conditional above is hard to read. Flatten it: if x == 0 ... elif x < 10 ... else ... — then try the values 0, 7 and 15 and confirm the flat chain gives identical answers. Which version is easier on your eyes a month from now?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في سلسلة elif، كم فرعًا يُنفَّذ في كل تشغيل؟',
            en: 'In an elif chain, how many branches run on each execution?',
          },
          options: [
            { id: 'a', text: { ar: 'واحد بالضبط — أول شرط يتحقق', en: 'Exactly one — the first condition that holds' } },
            { id: 'b', text: { ar: 'كل الفروع التي تحققت شروطها', en: 'Every branch whose condition held' } },
            { id: 'c', text: { ar: 'الفرع الأخير دائمًا', en: 'Always the last branch' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'تُفحص الشروط بالترتيب، وأول من يتحقق يُنفَّذ وتنتهي العبارة كلها — حتى لو تحققت شروط بعده.',
            en: 'Conditions are checked in order; the first to hold runs and the whole statement ends — even if later conditions would also have held.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الأول: سلسلة مرتّبت بحيث يلتقط فرع مبكر كل القيم فلا يصل التنفيذ أبدًا للفرع الصحيح. البرنامج يعمل بلا رسائل والنتيجة خاطئة — أي عائلة خطأ؟',
            en: 'And from chapter 1: a chain ordered so an early branch catches every value and execution never reaches the right one. The program runs with no messages and a wrong result — which error family?',
          },
          options: [
            { id: 'a', text: { ar: 'قواعدية SyntaxError', en: 'Syntax' } },
            { id: 'b', text: { ar: 'دلالية صامتة', en: 'Silent semantic' } },
            { id: 'c', text: { ar: 'أثناء التشغيل برسالة', en: 'Runtime with a message' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'لا رسالة ولا انهيار — فقط نتيجة خاطئة. لهذا نقرأ الخرْج بعين منتقدة ونختبر عند الحدود، كما في تمرين السلسلة.',
            en: 'No message, no crash — just a wrong answer. That is why we read output with a critic’s eye and test at the boundaries, as in the chain exercise.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أين يجب أن يكون else إن وُجدت في السلسلة، وهل هي إلزامية؟',
            en: 'Where must else sit in a chain, and is it mandatory?',
          },
          options: [
            { id: 'a', text: { ar: 'في النهاية — وهي اختيارية', en: 'At the end — and it is optional' } },
            { id: 'b', text: { ar: 'في البداية — وإلزامية', en: 'At the start — and mandatory' } },
            { id: 'c', text: { ar: 'في أي مكان — بشرط بنقطتين', en: 'Anywhere — as long as it has a colon' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'else هي «كل ما تبقى» فيعقل منطقيًا أن تكون آخر فرع، والسلسلة تعمل بلاها إن لم يرد شيء عند فشل الجميع.',
            en: 'else means “whatever remains”, so logically it comes last; the chain works without it when nothing should happen if all conditions fail.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'كيف تُسطّح الشرطين المتداخلين: if 0 < x: وداخله if x < 10: ؟',
            en: 'How do you flatten the nested pair: if 0 < x: with if x < 10: inside it?',
          },
          options: [
            { id: 'a', text: { ar: 'if 0 < x and x < 10:', en: 'if 0 < x and x < 10:' } },
            { id: 'b', text: { ar: 'if 0 < x or x < 10:', en: 'if 0 < x or x < 10:' } },
            { id: 'c', text: { ar: 'if 0 < x + x < 10:', en: 'if 0 < x + x < 10:' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التداخل يعني «الاثنان معًا» — وهذا معنى and. أما or فستمرّر x = 20 أو x = -1 وهذا غير مطابق.',
            en: 'Nesting means “both at once” — exactly what and means. or would let x = 20 or x = -1 through, which is not equivalent.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "if score >= 60:\n    print('ناجح')\nelif score >= 90:\n    print('ممتاز')",
          right: "if score >= 90:\n    print('ممتاز')\nelif score >= 60:\n    print('ناجح')",
          note: {
            ar: 'الفرع العام أولًا يبتلع كل القيم: 95 يُقال عنه ناجح ولا يصل ممتاز أبدًا. الأخص أولًا، ثم الأعم — والاختبار عند الحدود يكشف الفخ.',
            en: 'A general branch first swallows every value: 95 gets called ناجح and never reaches ممتاز. Most specific first, most general last — and boundary testing exposes the trap.',
          },
        },
        {
          wrong: "if x > 0:\n    print('موجب')\nif x > 5:\n    print('كبير')",
          right: "if x > 0:\n    print('موجب')\nelif x > 5:\n    print('كبير')",
          note: {
            ar: 'هذان if منفصلان لا سلسلة: قد يُنفَّذ الاثنان معًا (جرّب x = 7). elif هو الذي يقول «وإلا إذا» فيقطع التسلسل بعد أول فرع.',
            en: 'These are two separate ifs, not a chain: both can run (try x = 7). elif is what says “or else if” and cuts the sequence after the first branch.',
          },
        },
        {
          wrong: "if x > 0:\n    if x < 10:\n        if x != 5:\n            print('مقبول')",
          right: "if x > 0 and x < 10 and x != 5:\n    print('مقبول')",
          note: {
            ar: 'التداخل العميق يدفن المعنى تحت طبقات إزاحة. and تُسطّحه إلى سطر واحد — والكتاب نفسه ينصح بتجنّب الشروط المتداخلة قدر الإمكان.',
            en: 'Deep nesting buries meaning under layers of indentation. and flattens it into one line — the book itself advises avoiding nested conditionals whenever you can.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'السلسلة الشرطية elif تفحص الشروط بالترتيب وتنفّذ أول فرع يتحقق فقط — ثم تنتهي.', en: 'An elif chain checks conditions in order and runs only the first branch that holds — then stops.' },
        { ar: 'الترتيب جزء من المعنى: الأخص أولًا وإلا التقط الفرع العام كل القيم (خطأ دلالي صامت).', en: 'Ordering is part of the meaning: most specific first, or the general branch swallows every value (a silent semantic error).' },
        { ar: 'الشرط المتداخل يعمل لكنه يصعب قراءته — and/or تُسطّحه غالبًا إلى سطر واحد.', en: 'Nested conditionals work but get hard to read — and/or usually flatten them into one line.' },
      ],
      reflectPrompt: {
        ar: 'فكّر في قرار من ثلاثة مسارات على الأقل في يومك (درجة، مواصلات، وجبة). صُغ سلسلته elif على الورق: ما الشرط الأخص الذي يجب أن يُفحص أولًا؟',
        en: 'Think of a decision with at least three paths in your day (a grade, transport, a meal). Sketch its elif chain on paper: which is the most specific condition to check first?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch3.s5', pages: 'ص43-45 / pp.43-45' },
        { book: 'PY4E', section: 'py4e.ch3.s6', pages: 'ص45-46 / pp.45-46' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch3.s5', pages: 'ص43-45 / pp.43-45' },
    { book: 'PY4E', section: 'py4e.ch3.s6', pages: 'ص45-46 / pp.45-46' },
  ],
} satisfies Lesson;

export default lesson;
