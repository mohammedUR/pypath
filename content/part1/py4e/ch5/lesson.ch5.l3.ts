import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch5.l3 — "The for Loop / حلقة for"
 * Aligned with PY4E ch5 s5 (الحلقات المحددة باستخدام FOR).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch5.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 5,
  title: { ar: 'حلقة for', en: 'The for Loop' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch5.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أنت لا تعرف دائمًا متى تتوقف الأشياء — لكنك تعرف أحيانًا ما هي بدقة: هذه القائمة من الأصدقاء، هذه الدرجات، هذه الكلمات. حين يكون ما ستدور عليه معروفًا من البداية، تعطيك بايثون حلقة أنظف وأقصر: for. بنهاية هذا الدرس ستكون قادرًا على: التمييز بين الحلقة المحددة وغير المحددة، وكتابة حلقة for فوق قائمة، وتسمية أدوار for وin ومتغيّر التكرار.',
        en: 'You do not always know when things stop — but sometimes you know exactly what they are: this list of friends, these scores, these words. When what you will iterate over is known from the start, Python hands you a cleaner, shorter loop: for. By the end of this lesson you will be able to: tell a definite loop from an indefinite one, write a for loop over a list, and name the roles of for, in, and the iteration variable.',
      },
    },
    {
      kind: 'predict',
      code: "friends = ['Joseph', 'Glenn', 'Sally']\nfor friend in friends:\n    print('Happy New Year:', friend)\nprint('Done!')",
      question: {
        ar: 'كم سطرًا سيُطبع، وما مضمونها؟ تلميح: القائمة فيها ثلاثة أسماء.',
        en: 'How many lines get printed, and what do they say? Hint: the list holds three names.',
      },
      reveal: {
        ar: 'أربعة أسطر: تهانٍ لكل صديق ثم Done!. الحلقة نفّذت جسمها مرة لكل عنصر في القائمة — ثلاث تكرارات — ثم خرجت إلى الطباعة الختامية. لا شرط ولا إنقاص: القائمة نفسها هي من تقرر عدد المرات.',
        en: 'Four lines: a greeting for each friend, then Done!. The loop ran its body once per element in the list — three iterations — then fell through to the final print. No condition, no decrement: the list itself decides how many times.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'حلقة محددة مقابل حلقة غير محددة', en: 'Definite loop versus indefinite loop' },
      chunks: [
        {
          ar: 'نحتاج أحيانًا أن نتعامل مع مجموعة من الأشياء: قائمة من الكلمات أو الأرقام أو حتى أسطر ملف نصي. حينئذ يستحسن استخدام الحلقة المحددة for. تعد حلقة while حلقة غير محددة لأنها ببساطة تتكرر حتى يصبح شرطها غير صحيح — قد لا نعرف عدد المرات مسبقًا. في حين تعد حلقة for حلقة محددة لأنها تتكرر بعدد الأشياء الموجودة في المجموعة.',
          en: 'Sometimes we need to work through a collection of things: a list of words or numbers, or even lines of a text file. Then it is best to use the definite loop, for. The while loop is an indefinite loop because it simply repeats until its condition becomes false — we may not know the number of times in advance. The for loop, on the other hand, is a definite loop because it repeats once for each item in the collection.',
        },
        {
          ar: 'وتلك المجموعة تسمى قائمة: قيم بين قوسين معقوفين مفصولة بفواصل — friends = [\'Joseph\', \'Glenn\', \'Sally\'] قائمة من ثلاث سلاسل نصية. ستدرس القوائم تفصيلًا في فصل قادم؛ اليوم يكفيك التعامل معها كصندوق أشياء تسير عليه الحلقة واحدةً واحدة.',
          en: "That collection is called a list: values between square brackets separated by commas — friends = ['Joseph', 'Glenn', 'Sally'] is a list of three strings. You will study lists in depth in a later chapter; for today it is enough to treat it as a box of items that the loop walks through one by one.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تشريح for: ترويسة، جسم، متغيّر تكرار', en: 'Anatomy of for: header, body, iteration variable' },
      chunks: [
        {
          ar: 'قواعد كتابة حلقة for مماثلة لكتابة حلقة while: ترويسة تنتهي بنقطتين، يتلوها جسم بإزاحة. مثال الكتاب:\nfor friend in friends:\n    print(\'Happy New Year:\', friend)\nكلًا من for وin كلمتان محجوزتان للغة بايثون — تذكر درس الأسماء في الفصل الثاني — وكل من friend وfriends متغيرات.',
          en: "The grammar of a for loop mirrors the while loop: a header ending with a colon, followed by an indented body. The book's example:\nfor friend in friends:\n    print('Happy New Year:', friend)\nBoth for and in are reserved words of the Python language — remember the naming lesson from chapter 2 — while friend and friends are variables.",
        },
        {
          ar: 'نسمي المتغير friend متغيّر التكرار في الحلقة: يتغير لكل تكرار، ويتعاقب على العناصر تلقائيًا — واحدًا تلو الآخر بالترتيب. لا تحدّثه بنفسك كما فعلت مع n في while: الحلقة تتولى ذلك، وهي مسؤولة عن اكتمال التنفيذ تلو الأنتهاء عند نفاد العناصر.',
          en: 'We call the variable friend the iteration variable of the loop: it changes with every iteration, taking the elements automatically — one after another, in order. You do not update it yourself as you did with n in while: the loop manages that for you, and it finishes on its own when the items run out.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'أدوات سريعة: التكرار فوق نص، وrange', en: 'Quick tools: iterating a string, and range' },
      chunks: [
        {
          ar: 'for لا تقبل القوائم فقط: النص سلسلة من الحروف فتتعاقب عليها الحلقة حرفًا حرفًا — for ch in \'بايثون\': تطبع ستة حروف. وهذا ذوق مبكر من التكرار فوق التسلسلات ستعيشه أكثر في فصول السلاسل والملفات والقوائم.',
          en: "for is not limited to lists: a string is a sequence of characters, so the loop takes them letter by letter — for ch in 'python': prints six letters. This is an early taste of iterating over sequences you will live with more in the strings, files and lists chapters.",
        },
        {
          ar: 'وإذا أردت التكرار عددًا محددًا من المرات دون قائمة جاهزة، توجد أداة مساعدة: for i in range(5): تتكرر خمس مرات وتعطي i قيمًا من 0 إلى 4. احفظها للعدّ السريع — ونستعملها كثيرًا في الأنماط القادمة.',
          en: 'And if you want to repeat an exact number of times without a ready-made list, there is a helper: for i in range(5): runs five times and gives i the values 0 through 4. Keep it for quick counting — we will lean on it in the coming patterns.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الحلقة على حروف كلمة', en: 'A loop over the letters of a word' },
      code: "word = 'بايثون'\nfor ch in word:\n    print(ch)\nprint('انتهت الحروف')",
      explanation: {
        ar: 'متغيّر التكرار ch استلم في التكرار الأول الحرف بـ، وفي الثاني ا، وهكذا حتى ن — ستة تكرارات بعدد الحروف، ثم خرجت الحلقة إلى السطر الأخير. غيّر الكلمة في السطر الأول وأعد التشغيل: عدد التكرارات يتغير وحده — هذا معنى "حلقة محددة": العدد محدد بمحتوى المجموعة.',
        en: 'The iteration variable ch received ب in the first iteration, ا in the second, and so on until ن — six iterations, one per letter, then the loop fell through to the last line. Change the word on the first line and run again: the iteration count changes by itself — that is what "definite loop" means: the count is fixed by the contents of the collection.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.write-friends',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'القائمة friends = [\'Joseph\', \'Glenn\', \'Sally\'] معطاة في المحرر. اكتب حلقة for تطبع لكل صديق سطرًا بالشكل: Happy New Year: متبوعًا باسمه — ثم بعد الحلقة اطبع Done!. (استخدم متغيّر التكرار friend.)',
        en: "The list friends = ['Joseph', 'Glenn', 'Sally'] is given in the editor. Write a for loop that prints one line per friend in the form: Happy New Year: followed by their name — then after the loop print Done!. (Use the iteration variable friend.)",
      },
      starterCode: "friends = ['Joseph', 'Glenn', 'Sally']\n# اكتب حلقة for ثم اطبع Done! / write the for loop, then print Done!\n",
      solution: "friends = ['Joseph', 'Glenn', 'Sally']\nfor friend in friends:\n    print('Happy New Year:', friend)\nprint('Done!')",
      tests: [
        {
          id: 't1',
          name: { ar: 'تُطبع التهنئة لثلاثة أصدقاء', en: 'The greeting prints for all three friends' },
          code: "assert 'Happy New Year: Joseph\\nHappy New Year: Glenn\\nHappy New Year: Sally' in __learner_output__, ('expected: 3 greetings | actual: %r' % __learner_output__)",
          expected: 'Happy New Year: Joseph / Glenn / Sally',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع Done! بعد الحلقة', en: 'Done! prints after the loop' },
          code: "assert 'Done!' in __learner_output__, ('expected: Done! | actual: %r' % __learner_output__)",
          expected: 'Done!',
        },
      ],
      hints: [
        { ar: 'الترويسة: for friend in friends: — والجسم سطر طباعة واحد بإزاحة.', en: 'Header: for friend in friends: — the body is a single indented print line.' },
        { ar: 'يمرّر print وسيطين: النص ثم friend — سيضعهما على سطر واحد بفاصل.', en: 'Pass print two arguments: the text then friend — it puts them on one line with a space.' },
        { ar: "الهيكل:\nfor friend in friends:\n    print('Happy New Year:', friend)\nprint('Done!')", en: "The skeleton:\nfor friend in friends:\n    print('Happy New Year:', friend)\nprint('Done!')" },
        { ar: "friends = ['Joseph', 'Glenn', 'Sally']\nfor friend in friends:\n    print('Happy New Year:', friend)\nprint('Done!')", en: "friends = ['Joseph', 'Glenn', 'Sally']\nfor friend in friends:\n    print('Happy New Year:', friend)\nprint('Done!')" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-for-body',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'انتبه: الجسم فيه سطران — يُنفَّذان كاملين في كل تكرار. توقّع الخرْج بالضبط.',
        en: 'Careful: the body has two lines — both run fully on every iteration. Predict the exact output.',
      },
      code: 'for n in [5, 7]:\n    print(n)\n    print(n * 2)',
      solution: '5\n10\n7\n14',
      answer: '5\n10\n7\n14',
      hints: [
        { ar: 'التكرار الأول بـ n = 5: يطبع 5 ثم يطبع 10.', en: 'First iteration with n = 5: prints 5 then prints 10.' },
        { ar: 'التكرار الثاني بـ n = 7: يطبع 7 ثم يطبع 14.', en: 'Second iteration with n = 7: prints 7 then prints 14.' },
        { ar: 'لا سطر ختامي هنا — كل الخرْج من داخل الجسم.', en: 'No closing line here — the whole output comes from inside the body.' },
        { ar: 'الخرْج:\n5\n10\n7\n14', en: 'The output:\n5\n10\n7\n14' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-definite',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما الذي يجعل حلقة for «محددة»؟',
        en: 'What makes a for loop "definite"?',
      },
      options: [
        { id: 'a', text: { ar: 'أنها تتكرر بعدد الأشياء الموجودة في المجموعة', en: 'It repeats once for each item in the collection' } },
        { id: 'b', text: { ar: 'أنها تتكرر حتى يصبح شرطها غير صحيح', en: 'It repeats until its condition becomes false' } },
        { id: 'c', text: { ar: 'أنها أسرع في التنفيذ من while', en: 'It executes faster than while' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'قارن مع while: كم مرة سيتكرر؟ لا أحد يعلم — يعتمد على القيم.', en: 'Compare with while: how many times will it run? Nobody knows — it depends on values.' },
        { ar: 'في for عدد التكرارات معروف من حجم القائمة نفسها قبل أن تبدأ.', en: 'In for, the iteration count is known from the size of the list before it even starts.' },
        { ar: 'السرعة ليست المعيار — المعيار هو معرفة العدد مسبقًا.', en: 'Speed is not the criterion — the criterion is knowing the count in advance.' },
        { ar: 'الجواب: أ — for تتعاقب على عناصر المجموعة: عنصر = تكرار.', en: 'Answer: a — for walks the collection item by item: one item = one iteration.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-iteration-var',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: المتغير الذي يتعاقب على عناصر المجموعة ويتغير في كل تكرار يسمى متغير ______.',
        en: 'Fill in: the variable that takes the collection\'s elements in turn, changing every iteration, is called the ______ variable.',
      },
      answer: 'التكرار',
      solution: 'التكرار',
      hints: [
        { ar: 'في مثال الأصدقاء كان اسمه friend، وفي مثال الكلمة كان ch.', en: 'In the friends example it was friend, in the word example it was ch.' },
        { ar: 'هو نفس المصطلح الذي قابلناه في حلقة while من درس أمس.', en: 'It is the same term we met in the while loop of yesterday\'s lesson.' },
        { ar: 'الكتاب يسميه iteration variable.', en: 'The book calls it the iteration variable.' },
        { ar: 'الجواب: التكرار', en: 'Answer: التكرار' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — حلقات على كل شيء\n# Your playground — loops over everything\n\nfor name in ['سارة', 'عمر', 'ليان']:\n    print('أهلًا', name)\n\nfor i in range(4):\n    print('الدورة', i)\n\nfor letter in 'abc':\n    print(letter * 3)",
      prompt: {
        ar: 'جرّب بنفسك: غيّر القائمة والأسماء، وغيّر عدد range ولاحظ أنه يبدأ من 0، وجرّب حلقة فوق جملة كاملة بدل abc. ماذا يحدث لو صار الجسم فارغًا بلا إزاحة؟ جرّب واقرأ رسالة الخطأ. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: change the list and the names, change range's number and notice it starts at 0, and try looping over a whole sentence instead of abc. What happens if the body is empty with no indentation? Try it and read the error. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي الحلقتين تعرف عدد تكراراتها من البداية؟',
            en: 'Which of the two loops knows its iteration count from the start?',
          },
          options: [
            { id: 'a', text: { ar: 'for — الحلقة المحددة', en: 'for — the definite loop' } },
            { id: 'b', text: { ar: 'while — الحلقة غير المحددة', en: 'while — the indefinite loop' } },
            { id: 'c', text: { ar: 'كلتاهما تعرفه دائمًا', en: 'Both always know it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'for تتكرر بعدد عناصر مجموعتها — عددها معروف من محتوى القائمة. أما while فتتكرر حتى يصبح شرطها غير صحيح وقد لا نعرف متى.',
            en: 'for repeats once per element of its collection — the count is known from the list itself. while repeats until its condition becomes false, and we may not know when.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كم تكرارًا ينفّذها جسم الحلقة for friend in friends إذا كان في القائمة ثلاثة أسماء؟',
            en: 'How many iterations does the body of for friend in friends run for a list of three names?',
          },
          options: [
            { id: 'a', text: { ar: 'واحد', en: 'One' } },
            { id: 'b', text: { ar: 'ثلاثة', en: 'Three' } },
            { id: 'c', text: { ar: 'يتوقف على أطول اسم', en: 'It depends on the longest name' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'تكرار لكل عنصر: ثلاثة أسماء = ثلاثة تكرارات. طول الأسماء لا علاقة له بعدد العناصر.',
            en: 'One iteration per element: three names = three iterations. Name length has nothing to do with element count.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثاني: for وin — إلى أي فئة تنتمي كلمتا اللغة هاتان؟',
            en: 'And from chapter 2: for and in — which category of language words do these belong to?',
          },
          options: [
            { id: 'a', text: { ar: 'أسماء متغيّرات عادية نختارها', en: 'Ordinary variable names we choose' } },
            { id: 'b', text: { ar: 'كلمات محجوزة لا يجوز استخدامها كأسماء', en: 'Reserved words that may not be used as names' } },
            { id: 'c', text: { ar: 'تابعان جاهزان', en: 'Built-in functions' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الكلمات المحجوزة تشكل قواعد اللغة نفسها — ولهذا لا يمكنك تسمية متغيّرك for أو in، تمامًا كما تعلمت في درس أسماء المتغيّرات.',
            en: 'Reserved words form the grammar itself — which is why you cannot name your variable for or in, exactly as you learned in the naming lesson.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثالث: ترويسة for تنتهي بنقطتين وجسمها بإزاحة — هذه القواعد نفسها التي تعلمتها مع أي بنية؟',
            en: 'And from chapter 3: the for header ends with a colon and its body is indented — the same grammar you learned with which structure?',
          },
          options: [
            { id: 'a', text: { ar: 'بنية if الشرطية', en: 'The if conditional' } },
            { id: 'b', text: { ar: 'تعليمة الطباعة print', en: 'The print statement' } },
            { id: 'c', text: { ar: 'تعليمة الإسناد', en: 'The assignment statement' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'if وfor وwhile كلها بنايات برأس بنقطتين وجسم بادئ — تعلمتها مع if وتذكرها مع كل بناية جديدة من الفصل الخامس.',
            en: 'if, for and while are all structures with a colon-headed header and an indented body — you learned it with if and you will reuse it with every structure in chapter 5.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "friends = ['Joseph']\nfor friend in friends\n    print(friend)",
          right: "friends = ['Joseph']\nfor friend in friends:\n    print(friend)",
          note: {
            ar: 'الترويسة تنتهي بنقطتين — نسيانهما يرمي SyntaxError: invalid syntax. القاعدة نفسها من if: رأس بنقطتين ثم جسم.',
            en: 'The header ends with a colon — forgetting it throws SyntaxError: invalid syntax. The same rule as if: a colon-headed header, then a body.',
          },
        },
        {
          wrong: "friends = ['Joseph', 'Glenn']\nfor friend in friends:\nprint(friend)",
          right: "friends = ['Joseph', 'Glenn']\nfor friend in friends:\n    print(friend)",
          note: {
            ar: 'الجسم بلا إزاحة يرمي SyntaxError: expected an indented block — بايثون لا تعرف أي التعليمات تنتمي للحلقة. الإزاحة هي تعريف الجسم.',
            en: 'A body with no indentation throws SyntaxError: expected an indented block — Python cannot tell which statements belong to the loop. Indentation defines the body.',
          },
        },
        {
          wrong: "friends = ['Joseph', 'Glenn']\nfor friend in friends:\n    print(friends)",
          right: "friends = ['Joseph', 'Glenn']\nfor friend in friends:\n    print(friend)",
          note: {
            ar: 'طبعت القائمة كلها لا الصديق الحالي: friends (بالألف) هي الصندوق كله، وfriend (بدونه) متغيّر التكرار الذي يحمل العنصر الحالي. حرف واحد يفرق بينهما.',
            en: 'You printed the whole list, not the current friend: friends (with the s) is the entire box, while friend (without it) is the iteration variable holding the current element. One letter apart.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'while حلقة غير محددة تتكرر حتى يصبح شرطها غير صحيح؛ وfor حلقة محددة تتكرر بعدد الأشياء في المجموعة (قائمة، نص، أو range).', en: 'while is an indefinite loop repeating until its condition fails; for is a definite loop repeating once per item in the collection (a list, a string, or range).' },
        { ar: 'for وin كلمتان محجوزتان، ومتغيّر التكرار يتعاقب على العناصر تلقائيًا — لا تحدّثه بنفسك.', en: 'for and in are reserved words, and the iteration variable takes the elements automatically — you never update it yourself.' },
        { ar: 'القواعد نفسها التي تعلمتها مع if: ترويسة بنقطتين وجسم بإزاحة — عنصر واحد في كل تكرار.', en: 'The same grammar you learned with if: a colon-headed header and an indented body — one element per iteration.' },
      ],
      reflectPrompt: {
        ar: 'اختر قائمة حقيقية من حياتك (أسماء، مهام، روابط): صُغ حلقة for عليها — ما اسم متغيّر التكرار المناسب، وماذا سيطبع الجسم في أول تكرار؟',
        en: 'Pick a real list from your life (names, tasks, links): phrase a for loop over it — what should the iteration variable be called, and what would the body print in the first iteration?',
      },
    },
    {
      kind: 'sources',
      items: [{ book: 'PY4E', section: 'py4e.ch5.s5', pages: 'ص78 / pp.78' }],
    },
  ],
  sources: [{ book: 'PY4E', section: 'py4e.ch5.s5', pages: 'ص78 / pp.78' }],
} satisfies Lesson;

export default lesson;
