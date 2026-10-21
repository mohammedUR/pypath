import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch14.l1 — "Why Objects? / لماذا نحتاج الكائنات؟"
 * Aligned with PY4E ch14 s1 (إدارة البرامج الكبيرة) + s2 (مقدمة) +
 * s3 (استخدام الكائنات).
 * All expression is original.
 * Runnable warm-ups stay entirely in already-known territory: methods on
 * list/str objects from ch6/ch8 + the book's party1.py three equivalent
 * item-access forms + dir() capability checks (membership only — never the
 * full dir() listing, which varies across Python builds).
 */
const lesson = {
  id: 'py4e.ch14.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 14,
  title: { ar: 'لماذا نحتاج الكائنات؟', en: 'Why Objects?' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch13.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'برامجك حتى الآن كانت من عشرات الأسطر — وتخيل برنامجًا من مليون سطر: لن يستوعبه عقل بشر كله دفعة واحدة. الفصل الرابع عشر يفتح البرمجة كائنية التوجه Object-Oriented Programming: أسلوب لترتيب الشيفرات يجعلك تركز على خمسين سطرًا وتفهمها وتتجاهل الباقي. والمفاجأة أنك تستخدم الكائنات منذ زمن: كل قائمة كبرت بـ append وكل سلسلة نظفت بـ strip هي كائن يحمل توابعه معه. اليوم نكشف هذا العالم من حولنا: نستدعي توابع كائنات نعرفها جيدًا، ونسأل dir() عن قدرات أي كائن، ونتأمل ثلاث صيغ متكافئة لسؤال واحد عن قائمة. بنهاية الدرس ستكون قادرًا على: تسمية الأنماط الأربعة التي درستها وموقع OOP منها، وتمييز التابع method والخاصية property كجزأين من الكائن، واستدعاء توابع كائنات str وlist وdict بثقة، وقراءة قدرات أي كائن بـ dir().',
        en: 'Your programs so far were tens of lines — now imagine a million-line program: no human mind absorbs it all at once. Chapter 14 opens object-oriented programming (OOP): a way of organizing code that lets you focus on fifty lines, understand them, and ignore the rest. The surprise is that you have been using objects all along: every list you grew with append and every string you cleaned with strip is an object carrying its methods with it. Today we uncover that world: we call methods on objects we know well, ask dir() for any object\u2019s capabilities, and study three equivalent forms of one question about a list. By the end of this lesson you will be able to: name the four patterns you studied and where OOP fits among them, tell the method and the property apart as the two halves of an object, call methods on str, list and dict objects with confidence, and read any object\u2019s capabilities with dir().',
      },
    },
    {
      kind: 'predict',
      code: "stuff = list()\nstuff.append('python')\nstuff.append('chuck')\nstuff.sort()\nprint(stuff[0])",
      question: {
        ar: 'هذه الأسطر من عالم الفصل الثامن المألوف. لكن اسأل نفسك سؤالًا جديدًا: أين يسكن append تحديدًا؟ ومن يملك sort؟ وماذا سيطبع السطر الأخير؟',
        en: 'These lines come from the familiar chapter-8 world. But ask yourself a new question: where exactly does append live? Who owns sort? And what will the last line print?',
      },
      reveal: {
        ar: 'chuck. رتبت sort القائمة فصار chuck قبل python، وstuff[0] استرجع أول عنصر. أما الجواب الأعمق: append وsort ليستا دالتين حرتين في الهواء — هما توابع يسكان داخل الكائن القائمة نفسه، ومن هنا صار بالإمكان كتابة stuff.append. الكائن يجمع البيانات والتوابع معًا في حزمة واحدة — وهذا درس اليوم كله.',
        en: 'chuck. sort ordered the list so chuck precedes python, and stuff[0] retrieved the first element. The deeper answer: append and sort are not free functions floating around — they are methods living inside the list object itself, which is why stuff.append is even writable. An object bundles its data and its methods together — and that is the whole of today\u2019s lesson.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الأنماط الأربعة ثم النمط الخامس', en: 'The four patterns, then the fifth' },
      chunks: [
        {
          ar: 'مررنا في الفصول الأولى بأربعة أنماط برمجية لبناء البرامج: الشيفرة التسلسلية، والشيفرة الشرطية ببنية if، والشيفرة التكرارية بالحلقات، ثم التخزين وإعادة الاستخدام بالتوابع — وإلى جانبها متغيرات وبنى بيانات مثل القوائم والصفوف والقواميس. وقد كتبتَ حتى الآن برامج كثيرة منها المتقن ومنها غير المتقن، لكن حين يبلغ البرنامج ملايين الأسطر لن يستطيع عقلك استيعابه دفعة واحدة. لذا نقسم البرنامج إلى قطع صغيرة: نركز على قطعة ونفهمها ونصلح خطأها ونضيف ميزاتها ونصرف النظر عمّا سواها. البرمجة كائنية التوجه هي طريقة لترتيب الشيفرات تمكنك من التركيز على خمسين سطرًا وفهمها وتجاهل التسعمئة وتسعة وتسعين ألفًا وتسعمئة سطر أخرى.',
          en: 'The early chapters passed through four programming patterns for building programs: sequential code, conditional code with if, repetitive code with loops, then store-and-reuse with functions — alongside variables and data structures like lists, tuples and dictionaries. You have written many programs by now, some polished and some clumsy; but when a program reaches millions of lines, no mind absorbs it in one gulp. So we split the program into small pieces: focus on one piece, understand it, fix its bug, add its feature, and ignore everything else. Object-oriented programming is a way of organizing code that lets you focus on fifty lines, understand them, and ignore the other 999,950.',
        },
        {
          ar: 'وكما تعلمنا باقي النواحي البرمجية، علينا تعلم مفاهيم البرمجة كائنية التوجه قبل استخدامها. هدف هذا الفصل ليس أن تصبح خبيرًا في يوم — بل أن تفهم مبدئيًا كيف تُبنى الكائنات وكيف تعمل، والأهم من ذلك: كيف تستفيد من الكائنات الجاهزة التي تزودنا بها لغة بايثون ومكتباتها. سنركز على مصطلحات الفصل وننفذ أمثلة بسيطة لوضع حجر الأساس لما هو آتٍ. وأهم مصطلحين اليوم: الكائن object جزء صغير من البرنامج يجمع شيفرة وبيانات، والتابع method شيفرة مسماة تسكن داخل الكائن.',
          en: 'As with every other programming topic, we must learn the concepts of object-oriented programming before using them. This chapter\u2019s goal is not to make you an expert in a day — but to give you a first feel for how objects are built and how they work, and above all: how to benefit from the ready-made objects that Python and its libraries hand us. We will focus on the chapter\u2019s vocabulary and run simple examples to lay a foundation for what comes. The two most important terms today: the object, a small piece of a program bundling code and data; and the method, named code living inside that object.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'أنت تستخدم كائنات منذ زمن', en: 'You have been using objects all along' },
      chunks: [
        {
          ar: 'دعني أخبرك بشيء: كنا نستخدم الكائنات بكثرة منذ الفصل الثامن. عندما كتبت stuff.append(\'python\') وstuff.sort() فإنك استدعيت توابعًا تملكها القائمة نفسها: append تعرف كيف تنمو بالقائمة، وsort تعرف كيف ترتبها. في شيفرة الكتاب party1.py تُبنى قائمة وتضاف إليها عنصران ثم ترتب، ثم يُطبع أول عنصر بثلاث طرق متكافئة: stuff[0] المألوفة بالأقواس المربعة، وstuff.__getitem__(0) باستدعاء التابع على الكائن مباشرة، وlist.__getitem__(stuff, 0) باستدعاء التابع من الصنف list وتمرير القائمة معاملًا. الثلاث تعطي chuck نفسه — والأقواس المربعة تبقى الأنسب والأقصر.',
          en: 'Here is a secret: we have been using objects heavily since chapter 8. When you wrote stuff.append(\'python\') and stuff.sort(), you were calling methods owned by the list itself: append knows how to grow the list, sort knows how to order it. In the book\u2019s party1.py a list is built, given two elements, sorted — and its first element is printed three equivalent ways: the familiar stuff[0] with square brackets, stuff.__getitem__(0) calling the method on the object directly, and list.__getitem__(stuff, 0) calling the method from the list class and passing the object as a parameter. All three give the same chuck — and square brackets stay the shortest, sanest pick.',
        },
        {
          ar: 'ويمكننا التعرف على قدرات أي كائن عبر النظر إلى خرج التابع dir(): مرر له الكائن فيعيد قائمة بأسماء توابعه وأسمائه الخاصة. dir(stuff) في الكتاب يعرض __getitem__ وappend وsort وclear وcount وindex وinsert وpop وremove وreverse وغيرها — قائمة قدرات القائمة كاملة. وسيغدو معنى أسماء الشرطتين السفليتين __ واضحًا في بقية الفصل. والكتاب يوصيك بالعودة إلى هذه الفقرة بعد نهاية الفصل وإعادة قراءتها كي تتحقق من فهمك — وسنفعل ذلك حرفيًّا في درس المراجعة.',
          en: 'And we can discover any object\u2019s capabilities by looking at the output of dir(): pass it the object and it returns a list of its methods\u2019 names and its own special names. dir(stuff) in the book shows __getitem__, append, sort, clear, count, index, insert, pop, remove, reverse and more — the list\u2019s full capability sheet. The meaning of the double-underscore names will become clear through the chapter. The book recommends returning to that paragraph after finishing the chapter to re-read it and check your understanding — and we will do exactly that in the review lesson.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'party1.py من الكتاب: ثلاث صيغ لسؤال واحد', en: 'The book\u2019s party1.py: three forms of one question' },
      code: "stuff = list()\nstuff.append('python')\nstuff.append('chuck')\nstuff.sort()\n\nprint(stuff[0])\nprint(stuff.__getitem__(0))\nprint(list.__getitem__(stuff, 0))\n\nprint('append' in dir(stuff))\nprint('sort' in dir(stuff))",
      explanation: {
        ar: 'السطر الأول يبني كائنًا من نوع list — تمامًا كما سنبني لاحقًا كائنًا من صنفنا نحن. append أضاف العناصر في نهاية القائمة وsort رتبتها. ثم ثلاثة أسطر تعطي chuck نفسه: الأولى الصيغة المألوفة بالأقواس المربعة، والثانية تستدعي التابع __getitem__ على الكائن مباشرة، والثالثة تستدعيه من الصنف list وتمرر القائمة معاملًا — وكلا التعبيرين الأخيرين يعني: نفّذ شيفرة __getitem__ وأعطها stuff و0. وأخيرًا dir(stuff) تؤكد أن append وsort من قدرات القائمة. ستستخدم الأقواس المربعة دائمًا — لكن الآن تعرف ما الذي يجري خلفها.',
        en: 'The first line builds an object of type list — exactly as we will later build an object of our own class. append added elements to the end and sort ordered them. Then three lines give the same chuck: the familiar square-bracket form, then calling the __getitem__ method on the object directly, then calling it from the list class and passing the object as a parameter — both longer expressions mean: run __getitem__\u2019s code and hand it stuff and 0. Finally dir(stuff) confirms append and sort are among the list\u2019s capabilities. You will always use square brackets — but now you know what runs behind them.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.build-team',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ كائن قائمة باسم team عبر team = list()، ثم أضف إليه بـ append ثلاثة أسماء بالترتيب: chuck ثم sally ثم ana. رتب الكائن بـ sort()، ثم اطبع أول عنصر وآخر عنصر وطول القائمة بـ len. المتوقع: ana ثم sally ثم 3.',
        en: 'Build a list object named team via team = list(), then add three names with append in order: chuck, then sally, then ana. Sort the object with sort(), then print the first element, the last element and the length with len. Expected: ana, then sally, then 3.',
      },
      starterCode: "team = list()\n# أضف الأسماء الثلاثة بـ append ثم رتب بـ sort ثم اطبع\n# add the three names with append, sort, then print\n",
      solution: "team = list()\nteam.append('chuck')\nteam.append('sally')\nteam.append('ana')\nteam.sort()\nprint(team[0])\nprint(team[-1])\nprint(len(team))",
      tests: [
        {
          id: 't1',
          name: { ar: 'القائمة مرتبة بأسمائها الثلاثة', en: 'The list is sorted with its three names' },
          code: "assert team == ['ana', 'chuck', 'sally'], 'expected: [ana, chuck, sally] | actual: %r' % (team,)",
          expected: '[ana, chuck, sally]',
        },
        {
          id: 't2',
          name: { ar: 'أول عنصر وآخر عنصر مطبوعان', en: 'First and last element printed' },
          code: "assert 'ana' in __learner_output__ and 'sally' in __learner_output__, 'expected: ana then sally | actual: %r' % __learner_output__",
          expected: 'ana then sally',
        },
        {
          id: 't3',
          name: { ar: 'الطول 3 مطبوع', en: 'The length 3 printed' },
          code: "assert '3' in __learner_output__, 'expected: 3 | actual: %r' % __learner_output__",
          expected: '3',
        },
      ],
      hints: [
        { ar: 'كل عمل هنا تابع على الكائن: team.append(\'chuck\') يضيف في النهاية — وteam.sort() يرتب في مكانها.', en: "Everything here is a method on the object: team.append('chuck') adds at the end — team.sort() orders in place." },
        { ar: 'بعد الترتيب: team[0] أول عنصر وteam[-1] آخر عنصر من الفصل الثامن.', en: 'After sorting: team[0] is the first element and team[-1] the last, straight from chapter 8.' },
        { ar: 'الهيكل:\nteam.append(\'chuck\')\nteam.append(\'sally\')\nteam.append(\'ana\')\nteam.sort()\nprint(team[0])\nprint(team[-1])\nprint(len(team))', en: "The skeleton:\nteam.append('chuck')\nteam.append('sally')\nteam.append('ana')\nteam.sort()\nprint(team[0])\nprint(team[-1])\nprint(len(team))" },
        { ar: "team.append('chuck')\nteam.append('sally')\nteam.append('ana')\nteam.sort()\nprint(team[0])\nprint(team[-1])\nprint(len(team))", en: "team.append('chuck')\nteam.append('sally')\nteam.append('ana')\nteam.sort()\nprint(team[0])\nprint(team[-1])\nprint(len(team))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-string-methods',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله. السلاسل كائنات أيضًا.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Strings are objects too.',
      },
      code: "word = 'python'\ncaps = word.upper()\nprint(caps)\nprint(word.find('th'))\nprint(word.replace('py', 'mi'))",
      solution: 'PYTHON\n2\nmithon',
      answer: 'PYTHON\n2\nmithon',
      hints: [
        { ar: 'upper تعيد نسخة بأحرف كبيرة من السلسلة — الفصل السادس كله توابع على كائنات السلاسل.', en: 'upper returns a capitalized copy of the string — all of chapter 6 is methods on string objects.' },
        { ar: 'find يعيد موضع أول ظهور للنص المطلوب — عدّ الأحرف من الصفر.', en: 'find returns the position of the first occurrence — count characters from zero.' },
        { ar: 'replace يعيد سلسلة جديدة بعد استبدال كل ظهور للنمط الأول بالثاني — وword نفسها لم تتغير.', en: 'replace returns a new string with every occurrence of the first pattern swapped for the second — and word itself is untouched.' },
        { ar: 'الخرْج:\nPYTHON\n2\nmithon', en: 'The output:\nPYTHON\n2\nmithon' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-dir',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا يمنحك dir(stuff) عندما يكون stuff قائمة؟',
        en: 'What does dir(stuff) give you when stuff is a list?',
      },
      options: [
        { id: 'a', text: { ar: 'قائمة بأسماء قدرات الكائن: توابعه وأسمائه الخاصة مثل append وsort و__getitem__', en: 'A list of the object\u2019s capability names: its methods and special names like append, sort and __getitem__' } },
        { id: 'b', text: { ar: 'عناصر القائمة نفسها مرتبة', en: 'The list\u2019s own elements, sorted' } },
        { id: 'c', text: { ar: 'عدد عناصر القائمة', en: 'The number of elements in the list' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الاسم مختصر من directory: فهرس بالأسماء — لا بالقيم.', en: 'The name is short for directory: an index of names — not values.' },
        { ar: 'جرّبها في الملعب: ستظهر أسماء تعرفها مثل append وأسماء غريبة تبدأ بشرطتين سفليتين.', en: 'Try it in the sandbox: familiar names like append appear next to strange double-underscore names.' },
        { ar: 'هذه هي طريقتنا في «سؤال الكائن عن قدراته» — وسنعيد استخدامها على أصنافنا في الدروس القادمة.', en: 'This is our way of asking an object what it can do — and we will reuse it on our own classes in coming lessons.' },
        { ar: 'الجواب: أ — dir يعرض أسماء قدرات الكائن.', en: 'Answer: a — dir lists the object\u2019s capability names.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-append',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'التابع الذي يُستدعى على كائن القائمة لإضافة عنصر في نهايتها هو stuff.____(\'x\')',
        en: 'The method called on a list object to add an element at its end is stuff.____(\'x\')',
      },
      answer: 'append',
      solution: 'append',
      hints: [
        { ar: 'استخدمته في كل تمارين الفصل الثامن لإطالة القوائم.', en: 'You used it in every chapter-8 exercise to grow lists.' },
        { ar: 'اسمه بالإنجليزية يعني «يضيف إلى النهاية».', en: 'Its English name means to attach at the end.' },
        { ar: 'هو تابع يسكن داخل القائمة — لذا يُكتب بعد النقطة على الكائن نفسه.', en: 'It is a method living inside the list — hence it is written after the dot on the object itself.' },
        { ar: 'الجواب: append', en: 'Answer: append' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — اسأل الكائنات عن قدراتها\n# Your playground — ask objects about their capabilities\n\nstuff = list()\nstuff.append('python')\nstuff.append('chuck')\nstuff.sort()\n\nprint(stuff[0])\nprint(stuff.__getitem__(0))\nprint(list.__getitem__(stuff, 0))\n\nprint('append' in dir(stuff))\nprint('sort' in dir(stuff))\n\n# جرّب: 'upper' in dir(stuff) ثم 'upper' in dir('hi') ثم 'append' in dir({})\n# try: 'upper' in dir(stuff) then 'upper' in dir('hi') then 'append' in dir({})\n# جرّب: اطبع len(dir('hi')) وقارنها مع len(dir([1]))\n# try: print len(dir('hi')) and compare with len(dir([1]))",
      prompt: {
        ar: 'جرّب بنفسك: اسأل dir عن قدرات قائمة وسلسلة وقاموس — أي تابع مشترك بين الثلاثة؟ وأي تابع تختص به كل واحدة وحدها؟ ثم جرّب list.__getitem__(stuff, 0) على قائمة فارغة لترى ماذا يرمي. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: ask dir about the capabilities of a list, a string and a dict — which method is shared by all three? Which one belongs to each alone? Then try list.__getitem__(stuff, 0) on an empty list to see what it throws. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: "ومن الفصل الثامن: stuff.append('python') — ماذا يفعل append وأين يسكن؟",
            en: "From chapter 8: stuff.append('python') — what does append do and where does it live?",
          },
          options: [
            { id: 'a', text: { ar: 'تابع يسكن داخل كائن القائمة يضيف العنصر إلى نهايتها في مكانها', en: 'A method living inside the list object that adds the element to its end in place' } },
            { id: 'b', text: { ar: 'دالة عامة تعيد قائمة جديدة وتترك الأصل بلا تغيير', en: 'A free function returning a new list and leaving the original untouched' } },
            { id: 'c', text: { ar: 'تابع للسلاسل النصية يحولها إلى قائمة', en: 'A string method that turns the string into a list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'append تابع method للقائمة: يعدل الكائن نفسه في مكانه ولا يعيد شيئًا — ولهذا نكتبه بعد النقطة على الكائن. اليوم أصبحت تعرف اسم هذا التصميم: الكائن يجمع بياناته وتوابعه.',
            en: 'append is the list\u2019s method: it mutates the object in place and returns nothing — which is why we write it after the dot on the object. Today you learned the name of this design: an object bundles its data with its methods.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السادس: word.upper() تعيد PYTHON — لماذا لم تتغير word نفسها؟',
            en: 'From chapter 6: word.upper() returns PYTHON — why did word itself not change?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن السلاسل مجمدة فالتابع يبني سلسلة جديدة كليًّا ويعيدها', en: 'Because strings are immutable, so the method builds and returns an entirely new string' } },
            { id: 'b', text: { ar: 'خطأ في السؤال — word تغيرت أيضًا', en: 'Trick question — word changed too' } },
            { id: 'c', text: { ar: 'لأن upper تعمل على نسخة مؤقتة تُحذف فورًا', en: 'Because upper works on a temporary copy that is deleted immediately' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السلاسل مجمدة كما علّم الفصل السادس: كل توابعها تعيد كائنًا جديدًا. والقوائم على النقيض قابلة للتعديل: sort وappend يغيّران الكائن نفسه — فرق جوهري بين نوعين من الكائنات تعرف جيدًا.',
            en: 'Strings are immutable as chapter 6 taught: every string method returns a new object. Lists are the opposite — mutable: sort and append change the object itself. A fundamental difference between two object kinds you know well.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يُوصى بـ dir() قبل استخدام كائن من مكتبة جديدة؟',
            en: 'Why is dir() recommended before using an object from an unfamiliar library?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يعرض أسماء قدرات الكائن فتعرف ما الذي يمكن استدعاؤه عليه دون قراءة كل التوثيق', en: 'It shows the object\u2019s capability names, so you learn what can be called on it without reading all the documentation' } },
            { id: 'b', text: { ar: 'لأنه ينفذ كل توابع الكائن ويطبع نتائجها', en: 'It runs every method of the object and prints the results' } },
            { id: 'c', text: { ar: 'لأنه يحذف التوابع التي لا تحتاجها', en: 'It deletes the methods you do not need' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'dir استطلاع لا تنفيذ: قائمة أسماء فقط. وهذا هو «استخدام الكائنات الجاهزة» الذي وعد به الكتاب: تسأل الكائن عن قدراته ثم تستدعي ما تحتاجه — والفصل كله سيصقل هذه العادة.',
            en: 'dir is reconnaissance, not execution: a list of names only. That is the ready-made-objects promise the book made: ask the object what it can do, then call what you need — the whole chapter will sharpen this habit.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ثلاث صيغ تعيد chuck: stuff[0] وstuff.__getitem__(0) وlist.__getitem__(stuff, 0) — أيها يوصي الكتاب بالاستخدام؟',
            en: 'Three forms return chuck: stuff[0], stuff.__getitem__(0) and list.__getitem__(stuff, 0) — which does the book recommend?',
          },
          options: [
            { id: 'a', text: { ar: 'stuff[0] — الأقواس المربعة الأنسب والأقصر، والصيغتان الأخريان لتأمل ما يجري خلفها', en: 'stuff[0] — square brackets are the fittest and shortest; the other two are for peering behind the curtain' } },
            { id: 'b', text: { ar: 'stuff.__getitem__(0) — لأنها الأصدق توابعيًّا', en: 'stuff.__getitem__(0) — the most honestly method-flavored one' } },
            { id: 'c', text: { ar: 'list.__getitem__(stuff, 0) — لأنها الصيغة الرسمية الوحيدة', en: 'list.__getitem__(stuff, 0) — the only official form' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يقول حرفيًّا: من الأنسب استخدام الأقواس المربعة للبحث عن عنصر محدد في قائمة. الصيغتان الأخريان كشفا أن الفهرسة شيفرة تعيش في الصنف — والاختصار اللذيذ هو الذي تعمل به يوميًّا.',
            en: 'The book says it outright: it is more appropriate to use square brackets to look up a specific element in a list. The longer forms revealed that indexing is code living in a class — and the sweet shortcut is what you use daily.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'stuff.sort  # بلا أقواس — اسم فقط',
          right: 'stuff.sort()  # الأقواس هي أمر التنفيذ',
          note: {
            ar: 'الاسم وحده يذكر بالتابع دون استدعائه — بلا أقواس لا خطأ ولا ترتيب: سطر صامت لا يفعل شيئًا. الأقواس هي التي تقول «نفّذ».',
            en: 'The bare name merely mentions the method without calling it — no error and no sorting: a silent line that does nothing. The parentheses are what say run.',
          },
        },
        {
          wrong: "append(stuff, 'x')  # كأنها دالة حرة",
          right: "stuff.append('x')  # تابع على الكائن",
          note: {
            ar: 'append ليس تابعًا حرًّا في الهواء بل يسكن داخل الكائن — تستدعيه عبر النقطة على القائمة نفسها. هذه عادة الفصل الثامن نفسها، والفصل الرابع عشر يفسّرها أخيرًا.',
            en: 'append is not a free function floating around; it lives inside the object — call it via the dot on the list itself. This was the chapter-8 habit all along, and chapter 14 finally explains it.',
          },
        },
        {
          wrong: "'upper' in dir(stuff)  # أظن كل الكائنات سواء",
          right: "'upper' in dir('hi')  # قدرات السلاسل لا القوائم",
          note: {
            ar: 'لكل نوع قدراته: upper للسلاسل وappend للقوائم — dir يكشف قائمة قدرات الكائن الممرر له تحديدًا، فاسأل الكائن الصحيح قبل أن تستنتج أن التابع مفقود.',
            en: 'Each type has its own capabilities: upper for strings, append for lists — dir reveals the capability sheet of the exact object passed, so ask the right object before concluding a method is missing.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'البرمجة كائنية التوجه طريقة لترتيب الشيفرات تركّزك على خمسين سطرًا وتجاهل الباقي — وهذا جوهر إدارة البرامج الكبيرة.', en: 'Object-oriented programming organizes code so you focus on fifty lines and ignore the rest — the heart of managing big programs.' },
        { ar: 'الكائن يجمع بياناته (الخواص) وتوابعه في حزمة واحدة: stuff.append وword.upper استدعاءات كنت تكتبها منذ الفصول الماضية دون أن تسميها كائنية.', en: 'An object bundles its data (properties) and methods together: stuff.append and word.upper were calls you have written for chapters without the OOP name for them.' },
        { ar: 'dir() يسأل أي كائن عن قائمة قدراته — وstuff[0] اختصار مألوف لشيفرة __getitem__ تسكن القائمة.', en: 'dir() asks any object for its capability sheet — and stuff[0] is the familiar shorthand for __getitem__ code living inside the list.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب واطبع dir(\'hi\') وdir([1]) وdir({}). ابحث عن اسم تابع واحد مشترك بين الثلاثة واسم تابع تختص به كل واحدة وحدها — ماذا يخبرك هذا عن «النوع» الذي بُني منه كل كائن؟',
        en: 'Open the sandbox and print dir(\'hi\'), dir([1]) and dir({}). Find one method name shared by all three and one method unique to each — what does that tell you about the type each object was built from?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch14.s1', pages: 'ص235 / pp.235' },
        { book: 'PY4E', section: 'py4e.ch14.s2', pages: 'ص235 / pp.235' },
        { book: 'PY4E', section: 'py4e.ch14.s3', pages: 'ص236 / pp.236' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch14.s1', pages: 'ص235 / pp.235' },
    { book: 'PY4E', section: 'py4e.ch14.s2', pages: 'ص235 / pp.235' },
    { book: 'PY4E', section: 'py4e.ch14.s3', pages: 'ص236 / pp.236' },
  ],
} satisfies Lesson;

export default lesson;
