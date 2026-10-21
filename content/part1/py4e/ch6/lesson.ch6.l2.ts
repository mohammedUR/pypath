import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch6.l2 — "Traversing Strings and Counting / المرور على السلاسل والعدّ"
 * Aligned with PY4E ch6 s3 (التعامل مع محارف السلسلة النصية باستخدام الحلقات),
 * s6 (استخدام الحلقات والعدّ).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch6.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 6,
  title: { ar: 'المرور على السلاسل والعدّ', en: 'Traversing Strings and Counting' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch6.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'فهرسٌ واحد يعطيك محرفًا واحدًا — لكن قوة البرنامج في تكرار الفعل: اطبع كل محرف، وعدّ كل حرف معين، وابحث عن أول ظهور. معالجة محارف السلسلة واحدًا واحدًا من أولها إلى آخرها تسمى المرور (traversal)، وبحلقة واحدة وعدّاد واحد تصبح قادرًا على تحليل أي نص. بنهاية الدرس ستكون قادرًا على: المرور على سلسلة بحلقتي while وfor، وتركيب نمط العدّ من الفصل الخامس على المحارف.',
        en: 'One index gives you one character — but a program’s power is repetition: print every character, count every target letter, find the first occurrence. Processing a string’s characters one at a time from first to last is called traversal, and with one loop and one counter you can analyze any text. By the end of this lesson you will be able to: traverse a string with both while and for, and apply the chapter 5 counting pattern to characters.',
      },
    },
    {
      kind: 'predict',
      code: "for ch in 'abc':\n    print(ch)",
      question: {
        ar: 'كم سطرًا سيُطبع، وماذا فيها؟ قارن بحلقة for على قائمة من الفصل الخامس.',
        en: 'How many lines are printed, and what do they contain? Compare with a for loop over a list from chapter 5.',
      },
      reveal: {
        ar: 'ثلاثة أسطر: a ثم b ثم c. السلسلة النصية مجموعة مثل القائمة تمامًا — حلقة for تسير عليها محرفًا محرفًا بالترتيب، وكل محرف يُسند إلى متغيّر التكرار ch في دوره.',
        en: 'Three lines: a then b then c. A string is a collection just like a list — a for loop walks it character by character in order, and each character is assigned to the iteration variable ch during its turn.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'المرور على السلسلة: while ثم for', en: 'Traversal: while, then for' },
      chunks: [
        {
          ar: 'المرور على عناصر السلسلة (traversal) يعالج كل محرف على حدة بدءًا من أول محرف، ويُحدَّد المحرف ثم تُنفَّذ عليه عمليات، وتُتابع العملية حتى المحرف الأخير. طريقة تنفيذه بحلقة while:\nindex = 0\nwhile index < len(fruit):\n    letter = fruit[index]\n    print(letter)\n    index = index + 1\nتمر الحلقة على محارف السلسلة وتُظهر كل محرف على سطر مستقل. ولأن الشرط هو index < len(fruit) فسيختل الشرط حين يتساوى الفهرس مع الطول، فلا يُنفَّذ الجسم على فهرس غير موجود.',
          en: 'Traversal processes each character individually starting from the first: the character is picked, operations run on it, and the process continues to the last character. One way to do it is a while loop:\nindex = 0\nwhile index < len(fruit):\n    letter = fruit[index]\n    print(letter)\n    index = index + 1\nThe loop walks the string’s characters and shows each one on its own line. Because the condition is index < len(fruit), the condition fails when the index equals the length — so the body never runs on a nonexistent index.',
        },
        {
          ar: 'وهناك طريقة أخرى أوضح وأقصر — حلقة for:\nfor char in fruit:\n    print(char)\nيُسند المحرفُ الموجود في السلسلة إلى المتغيّر char في كل دور من أدوار الحلقة، التي تستمر حتى آخر محرف. لاحظ ما اختفى: لا تهيئة فهرس ولا زيادة يدوية ولا شرط حدودي — الحلقة المحددة تدير التفاصيل عنك. هذه هي الصيغة التي سنستخدمها غالبًا.',
          en: 'And there is a clearer, shorter way — the for loop:\nfor char in fruit:\n    print(char)\nThe character found in the string is assigned to the variable char on each turn of the loop, which continues to the last character. Notice what vanished: no index initialization, no manual increment, no boundary condition — the definite loop manages the details for you. This is the form we will usually use.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط العدّ على المحارف', en: 'The counting pattern on characters' },
      chunks: [
        {
          ar: 'البرنامج التالي يحسب عدد مرات ظهور المحرف a في السلسلة النصية:\nword = \'banana\'\ncount = 0\nfor letter in word:\n    if letter == \'a\':\n        count = count + 1\nprint(count)\nيُمثّل هذا البرنامج نموذجًا لبرامج العدّ: المتغيّر count يبدأ من القيمة 0، ثم يزداد في كل مرة يظهر فيها المحرف a، وعند انتهاء الحلقة يتضمن العدد الكلي لمرات الظهور — وهو 3 في banana.',
          en: 'The following program counts how many times the character a appears in a string:\nword = \'banana\'\ncount = 0\nfor letter in word:\n    if letter == \'a\':\n        count = count + 1\nprint(count)\nThis program is a model of counting programs: the variable count starts at 0, then grows each time the character a appears, and when the loop ends it holds the total number of occurrences — 3 in banana.',
        },
        {
          ar: 'لاحظ أن شيئًا جديدًا لم يُخترع هنا: هذا هو نمط العدّ نفسه من الفصل الخامس بوصفته الثلاثية — تهيئة العدّاد قبل الحلقة، وزيادة شرطية داخل الجسم، والنتيجة بعد الحلقة. الجديد الوحيد أن المجموعة المتكررة سلسلة نصية والعنصر محرف. ولو أردت تابعًا يعيد العد لأي حرف، فستلفّ الشيفرة بـ def كما تعلمت في الفصل الرابع — وهو التمرين الثالث في الكتاب.',
          en: 'Notice that nothing new was invented here: this is the very counting pattern from chapter 5 with its three-step recipe — initialize the counter before the loop, conditional increment inside the body, and the result after the loop. The only novelty is that the iterated collection is a string and the element is a character. And if you want a function that counts any letter, wrap the code in def as you learned in chapter 4 — that is the book’s third exercise.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'عدّاد واحد يعرف السر', en: 'One counter knows the secret' },
      code: "word = 'banana'\ncount = 0\nfor letter in word:\n    if letter == 'a':\n        count = count + 1\nprint(count)",
      explanation: {
        ar: 'المحارف تمر واحدًا واحدًا: b لا تطابق فلا زيادة، a تطابق فترتفع إلى 1، n لا، a فتصير 2، n لا، a فتصير 3. بعد الحلقة طُبع 3 — عدد مرات ظهور a في banana. صغّر البيانات وطبّع letter داخل الحلقة مؤقتًا إن أردت رؤية العدّاد يتحرك بنفسك — هذه أداة تنقيح ستعود إليها كثيرًا.',
        en: 'The characters pass one by one: b does not match so no increase, a matches and count becomes 1, n no, a makes 2, n no, a makes 3. After the loop it printed 3 — the number of times a appears in banana. Shrink the data and temporarily print letter inside the loop if you want to watch the counter move yourself — a debugging tool you will return to often.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.count-o',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "السلسلة word = 'monty python' معطاة. اكتب حلقة for تعدّ عدد مرات ظهور المحرف 'o' في المتغيّر count (ابدأه صفرًا قبل الحلقة)، ثم اطبع count. المتوقع: 2.",
        en: "The string word = 'monty python' is given. Write a for loop that counts how many times the character 'o' appears into the variable count (start it at zero before the loop), then print count. Expected: 2.",
      },
      starterCode: "word = 'monty python'\ncount = 0\n# حلقة + شرط + زيادة ثم طباعة / loop + condition + increment, then print\n",
      solution: "word = 'monty python'\ncount = 0\nfor letter in word:\n    if letter == 'o':\n        count = count + 1\nprint(count)",
      tests: [
        {
          id: 't1',
          name: { ar: 'count يساوي 2', en: 'count equals 2' },
          code: "assert count == 2, 'expected: 2 | actual: %r' % count",
          expected: '2',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع 2', en: '2 is printed' },
          code: "assert '2' in __learner_output__, ('expected: 2 | actual: %r' % __learner_output__)",
          expected: '2',
        },
      ],
      hints: [
        { ar: 'الوصفة الثلاثية: count = 0 قبل الحلقة، وزيادة داخل الجسم، وطباعة بعدها.', en: 'The three-step recipe: count = 0 before the loop, the increment inside the body, the print after it.' },
        { ar: "داخل الجسم: if letter == 'o': ثم سطر الزيادة بإزاحة إضافية.", en: "Inside the body: if letter == 'o': then the increment line with extra indentation." },
        { ar: "الهيكل:\nfor letter in word:\n    if letter == 'o':\n        count = count + 1\nprint(count)", en: "The skeleton:\nfor letter in word:\n    if letter == 'o':\n        count = count + 1\nprint(count)" },
        { ar: "word = 'monty python'\ncount = 0\nfor letter in word:\n    if letter == 'o':\n        count = count + 1\nprint(count)", en: "word = 'monty python'\ncount = 0\nfor letter in word:\n    if letter == 'o':\n        count = count + 1\nprint(count)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-count',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط دون تشغيله.',
        en: 'Read the code and predict its exact output without running it.',
      },
      code: "count = 0\nfor ch in 'aba':\n    if ch == 'a':\n        count = count + 1\nprint(count)",
      solution: '2',
      answer: '2',
      hints: [
        { ar: 'تتبّع محرفًا محرفًا: a يزيد، b لا، a يزيد.', en: 'Trace character by character: a increments, b does not, a increments.' },
        { ar: 'العدّاد وُلد صفرًا ووُلد خارج الحلقة — لا يُمسح بين التكرارات.', en: 'The counter was born at zero and born outside the loop — it never resets between iterations.' },
        { ar: 'طباعة واحدة بعد الحلقة فقط، لا داخلها.', en: 'One print after the loop only, not inside it.' },
        { ar: 'الخرْج: 2', en: 'The output: 2' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-iterations',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "كم تكرارًا ينفّذها جسم الحلقة في for letter in 'banana':؟",
        en: "How many iterations does the body of for letter in 'banana': run?",
      },
      options: [
        { id: 'a', text: { ar: 'ستة — تكرار لكل محرف', en: 'Six — one per character' } },
        { id: 'b', text: { ar: 'ثلاثة — لكل حرف مختلف', en: 'Three — one per distinct letter' } },
        { id: 'c', text: { ar: 'يعتمد على عدد حروف a', en: 'It depends on how many a characters there are' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر سلوك القوائم في الفصل الخامس: عنصر واحد = تكرار واحد.', en: 'Recall list behavior from chapter 5: one element = one iteration.' },
        { ar: 'عدّ محارف banana: ستة سواء تكررت القيم أم لا.', en: 'Count banana’s characters: six, whether values repeat or not.' },
        { ar: 'لا شرط داخل الجسم يوقف الحلقة مبكرًا هنا.', en: 'No condition inside the body stops the loop early here.' },
        { ar: 'الجواب: أ — ستة تكرارات، لأن for محددة وعنصر واحد = تكرار واحد.', en: 'Answer: a — six iterations, because for is definite and one element = one iteration.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-traversal',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'املأ الفراغ: معالجة محارف السلسلة النصية واحدًا واحدًا من أولها حتى آخرها تسمى ____ (traversal).',
        en: 'Fill in the blank: processing the characters of a string one at a time from its first to its last is called ____ (traversal).',
      },
      solution: 'المرور',
      answer: 'المرور',
      hints: [
        { ar: 'الكتاب سمّى هذا النمط من المعالجة بـ «المرور على عناصر السلسلة».', en: 'The book names this processing style “traversing the string”.' },
        { ar: 'اسم فعل مفرّد يبدأ بالميم: الم... رور.', en: 'A single noun form — in English it starts with t.' },
        { ar: 'ليس الفهرسة ولا التجزئة — هو الحركة على العناصر كلها بالترتيب.', en: 'Not indexing nor slicing — it is the ordered movement over all elements.' },
        { ar: 'الجواب: المرور', en: 'Answer: traversal' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — مرور بعدّ مزدوج\n# Your playground — traversal with a double count\n\nword = \'banana\'\ncount_a = 0\ncount_n = 0\nfor letter in word:\n    print(letter)\n    if letter == \'a\':\n        count_a = count_a + 1\n    if letter == \'n\':\n        count_n = count_n + 1\nprint(\'a:\', count_a)\nprint(\'n:\', count_n)\n\nindex = 0\nwhile index < len(word):\n    print(index, word[index])\n    index = index + 1',
      prompt: {
        ar: 'جرّب بنفسك: راقب المحارف تمر والعدّادان يتحركان، ثم راقب نسخة while التي تكشف الفهرس بجانب كل محرف. غيّر الكلمة، واحذف سطر index = index + 1 وشاهد رسالة المهلة (حلقة لا نهائية!) ثم أعده. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: watch the characters pass and the two counters move, then watch the while version that exposes the index next to every character. Change the word, delete the line index = index + 1 and watch the timeout message (infinite loop!), then put it back. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الخامس: متى تُهيّأ قيمة العدّاد count قبل الحلقة؟',
            en: 'And from chapter 5: when is the counter count initialized relative to the loop?',
          },
          options: [
            { id: 'a', text: { ar: 'قبل الحلقة — فلا يُمسح مع كل تكرار', en: 'Before the loop — so it is not wiped every iteration' } },
            { id: 'b', text: { ar: 'داخل جسم الحلقة', en: 'Inside the loop body' } },
            { id: 'c', text: { ar: 'بعد الحلقة', en: 'After the loop' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التهيئة خطوة أولى مستقلة قبل الحلقة: لو وُلد count داخل الجسم لمس صفره كل تكرار وأنهى الحلقة بقيمة 1 مهما كانت السلسلة.',
            en: 'Initialization is a separate first step before the loop: if count were born inside the body it would reset to zero each iteration and the loop would end with 1 no matter the string.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في نسخة while من المرور — ماذا يحدث لو حُذف سطر index = index + 1؟',
            en: 'In the while version of traversal — what happens if the line index = index + 1 is deleted?',
          },
          options: [
            { id: 'a', text: { ar: 'حلقة لا نهائية يتوقفها عدّاد المهلة', en: 'An infinite loop stopped by the timeout watchdog' } },
            { id: 'b', text: { ar: 'يرمي IndexError فورًا', en: 'It throws IndexError immediately' } },
            { id: 'c', text: { ar: 'تُطبع السلسلة مرة واحدة', en: 'The string is printed once' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفهرس يبقى 0 والشرط يبقى محققًا إلى الأبد — اللانهائية التي عرفناها في الفصل الخامس، ورسالة المهلة في المنصة تخبرك بها.',
            en: 'The index stays 0 and the condition stays true forever — the infinity you met in chapter 5; the platform’s timeout message is how you recognize it.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا شرط الحلقة while index < len(fruit) وليس <=؟',
            en: 'Why is the while condition index < len(fruit) and not <=?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن آخر فهرس صالح هو len-1 — و<= ستصل إلى فهرس غير موجود فترمي IndexError', en: 'Because the last valid index is len-1 — with <= you would reach a nonexistent index and get IndexError' } },
            { id: 'b', text: { ar: 'لأن <= أبطأ في التنفيذ', en: 'Because <= runs slower' } },
            { id: 'c', text: { ar: 'لأن with <= لا تعمل مع السلاسل', en: 'Because <= does not work with strings' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المحارف مفهرسة من 0 إلى len-1: عند تساوي الفهرس مع الطول يجب أن يتوقف الجسم — وهذا تحديدا ما يفعله <.',
            en: 'Characters are indexed 0 to len-1: when the index equals the length the body must stop — exactly what < enforces.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الرابع: لتحويل عدّاد الحروف إلى تابع جاهز للاستخدام المتكرر — ما الخطوة الصحيحة؟',
            en: 'And from chapter 4: to turn the letter counter into a reusable function — what is the right move?',
          },
          options: [
            { id: 'a', text: { ar: 'تعريفه بـ def مع وسيطين (السلسلة والحرف) وreturn للعدّ', en: 'Define it with def taking two parameters (the string and the letter) and return the count' } },
            { id: 'b', text: { ar: 'نسخ الشيفرة ولصقها في كل برنامج نحتاجها فيه', en: 'Copy-paste the code into every program that needs it' } },
            { id: 'c', text: { ar: 'جعل المتغيّر count اسمًا محجوزًا في اللغة', en: 'Make the variable count a reserved word of the language' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا هو التمرين الثالث في الكتاب: def count(word, letter) مع حلقة وreturn — إعادة الاستخدام هي ميزة التوابع التي بنيناها في الفصل الرابع.',
            en: 'That is the book’s third exercise: def count(word, letter) with a loop and a return — reuse is exactly the function feature we built in chapter 4.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'index = 0\nwhile index < len(word):\n    print(word[index])',
          right: 'index = 0\nwhile index < len(word):\n    print(word[index])\n    index = index + 1',
          note: {
            ar: 'من نسي تحديث متغيّر التكرار علّق البرنامج في حلقة لا نهائية — الفهرس لا يتقدم والشرط يبقى صادقًا. الزيادة سطر داخل الجسم بإزاحة صحيحة.',
            en: 'Forgetting to update the iteration variable hangs the program in an infinite loop — the index never advances and the condition stays true. The increment is a line inside the body, correctly indented.',
          },
        },
        {
          wrong: 'count = 0\nfor letter in word:\n    count = 0\n    if letter == \'a\':\n        count = count + 1',
          right: 'count = 0\nfor letter in word:\n    if letter == \'a\':\n        count = count + 1',
          note: {
            ar: 'تهيئة العدّاد داخل الجسم تمسحه كل تكرار — تنتهي الحلقة بقيمة 1 أو 0 أينما وُلد العدّاد. التهيئة قبل الحلقة دائمًا.',
            en: 'Initializing the counter inside the body wipes it every iteration — the loop ends with 1 or 0 wherever the counter was born. Initialize before the loop, always.',
          },
        },
        {
          wrong: 'count = 0\nfor letter in word:\n    if letter == \'a\':\n        count = count + letter',
          right: "count = 0\nfor letter in word:\n    if letter == 'a':\n        count = count + 1",
          note: {
            ar: 'أضفتَ المحرف نفسه لا الواحد: count + letter يخلط نصًا بعددًا فيرمي TypeError. العدّ يعني زيادة 1 لكل مطابقة.',
            en: 'You added the character itself, not one: count + letter mixes text with a number and throws TypeError. Counting means +1 per match.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المرور (traversal) هو معالجة محارف السلسلة واحدًا واحدًا بالترتيب — بحلقة while مع فهرس وشرط index < len، أو بحلقة for أوضح تُسند كل محرف إلى متغيّر التكرار.', en: 'Traversal processes a string’s characters one at a time in order — via a while loop with an index and the condition index < len, or via a clearer for loop that assigns each character to the iteration variable.' },
        { ar: 'نمط العدّ من الفصل الخامس يعمل على المحارف كما عمل على القوائم: عدّاد يبدأ صفرًا قبل الحلقة، وزيادة شرطية داخل الجسم، والنتيجة بعد الحلقة.', en: 'The chapter 5 counting pattern works on characters exactly as it worked on lists: a counter born at zero before the loop, a conditional increment in the body, the result after the loop.' },
        { ar: 'حلقة for محددة: تكرار لكل محرف مهما تكررت قيمه — وغيرها من الأشكال (while بلا تحديث) يقود إلى اللانهاية ومهلة المنصة.', en: 'A for loop is definite: one iteration per character regardless of repeated values — other shapes (a while without an update) lead to infinity and the platform timeout.' },
      ],
      reflectPrompt: {
        ar: 'اختر كلمة من لغتك الأم: أي محرف فيها تتوقع أن يكون الأكثر تكرارًا؟ اكتب عدّادًا له في الملعب وتحقق — هل صحّ توقعك؟',
        en: 'Pick a word from your own language: which character do you expect to be most frequent in it? Write a counter for it in the sandbox and check — was your guess right?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch6.s3', pages: 'ص88 / pp.88' },
        { book: 'PY4E', section: 'py4e.ch6.s6', pages: 'ص90 / pp.90' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch6.s3', pages: 'ص88 / pp.88' },
    { book: 'PY4E', section: 'py4e.ch6.s6', pages: 'ص90 / pp.90' },
  ],
} satisfies Lesson;

export default lesson;
