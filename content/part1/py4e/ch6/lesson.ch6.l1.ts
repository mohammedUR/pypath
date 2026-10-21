import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch6.l1 — "Characters and String Indexing / المحارف وفهرسة السلاسل"
 * Aligned with PY4E ch6 s1 (السلسلة النصية سلسلة من المحارف),
 * s2 (الحصول على طول السلسلة النصية باستخدام LEN).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch6.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 6,
  title: { ar: 'المحارف وفهرسة السلاسل', en: 'Characters and String Indexing' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch5.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حتى الآن تعاملنا مع النص ككتلة واحدة: اسمًا نطبع، أو رسالة نركّب. لكن كل ما تعرفه من برامج حقيقية — بحثٌ في صفحة، تحقّقٌ من بريد إلكتروني، لعبة تقرأ حرفًا حرفًا — يحتاج الوصول إلى المحارف داخل السلسلة وحدةً وحدة. في هذا الدرس تفتح صندوق السلسلة النصية وتتعلم عنوان كل محرف فيه. بنهاية الدرس ستكون قادرًا على: الوصول إلى محرف مفرد بعامله []، وفهم أن الفهرسة تبدأ من الصفر، وقياس طول السلسلة بـ len، واستخراج آخر محرف بثلاث طرق.',
        en: 'Until now you handled text as one solid block: a name to print, or a message to assemble. But everything real — searching a page, validating an email, a game reading input letter by letter — needs to reach the characters inside a string one by one. In this lesson you open the string box and learn the address of every character in it. By the end of this lesson you will be able to: access a single character with the [] operator, understand that indexing starts at zero, measure a string with len, and extract the last character three different ways.',
      },
    },
    {
      kind: 'predict',
      code: "fruit = 'banana'\nletter = fruit[1]\nprint(letter)",
      question: {
        ar: 'ماذا سيطبع؟ انتبه: قد لا يكون أول ما يخطر ببالك.',
        en: 'What does it print? Careful: it may not be the first thing that comes to mind.',
      },
      reveal: {
        ar: 'سيطبع a وليس b. الفهرس 1 هو المحرف الثاني — لأن الترقيم يبدأ من الصفر: الفهرس 0 يعطي b. هذه أكبر مفاجأة في الفصل كلها، والباقي يبنى عليها.',
        en: 'It prints a, not b. Index 1 is the second character — because numbering starts from zero: index 0 gives b. That is the biggest surprise of the whole chapter, and everything else builds on it.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'عامل القوس: عنوان المحرف', en: 'The bracket operator: the character’s address' },
      chunks: [
        {
          ar: "السلسلة النصية هي سلسلة من المحارف يمكن الوصول إلى كل منها على حدة باستخدام عامل القوس []. التعليمة letter = fruit[1] تعيد المحرف الواقع في الموقع ذي الفهرس 1 من fruit وتسنده إلى letter. يُدعى التعبير بين القوسين بالفهرس (index) — وهو يشير إلى المحرف المطلوب وفقًا لتسلسله في السلسلة، ومن هنا جاءت التسمية «سلسلة». في banana: المحرف الأول b فهرسه 0، والثاني a فهرسه 1، والثالث n فهرسه 2.",
          en: "A string is a sequence of characters, each reachable individually with the bracket operator []. The statement letter = fruit[1] returns the character at position index 1 in fruit and assigns it to letter. The expression between the brackets is called the index — it points to the desired character according to its order in the sequence, which is where the name \"string\" comes from. In banana: the first character b has index 0, the second a has index 1, the third n has index 2.",
        },
        {
          ar: "ويمكن استخدام أي تعبير كفهرس — متغيّر أو معاملات حسابية — لكن قيمته يجب أن تكون عددًا صحيحًا، وإلا واجهك الخطأ «فهارس السلاسل النصية يجب أن تكون أعدادًا صحيحة»: fruit[1.5] يرمي TypeError: string indices must be integers. العدد العائم لا يصلح عنوانًا لمحرف مهما كان قريبًا من عدد صحيح.",
          en: "Any expression may serve as an index — a variable or arithmetic operands — but its value must be an integer, or you face the error \"string indices must be integers\": fruit[1.5] throws TypeError: string indices must be integers. A float is no address for a character, however close it sits to a whole number.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'len والوصول إلى آخر محرف', en: 'len and reaching the last character' },
      chunks: [
        {
          ar: "التابع len يعيد عدد المحارف في السلسلة النصية: len('banana') تعطي 6. انتبه: len يعطيك الطول لا آخر فهرس. وقد تظن أن آخر محرف يُؤخذ بـ fruit[len(fruit)] — لكن سيعترضك خطأ الفهرسة IndexError: string index out of range. والسبب: لا يوجد في banana محرف فهرسه 6؛ ما دام العد يبدأ من الصفر فالمحارف الستة مفهرسة من 0 حتى 5.",
          en: "The function len returns the number of characters in a string: len('banana') gives 6. Note: len hands you the length, not the last index. You might assume the last character is fruit[len(fruit)] — but you are stopped by IndexError: string index out of range. The reason: banana has no character with index 6; since counting starts at zero, the six characters are indexed 0 through 5.",
        },
        {
          ar: "القاعدة: اطرح 1 من الطول للحصول على آخر محرف — fruit[len(fruit)-1] تعطي a. وهناك طريق آخر أنيق: الفهارس العكسية التي تعدّ من نهاية السلسلة؛ fruit[-1] يعيد آخر محرف وfruit[-2] يعيد ما قبل الأخير وهكذا. الطريقان يؤديان إلى المحرف نفسه — اختر الأوضح لقراءة شيفرتك.",
          en: "The rule: subtract 1 from the length to get the last character — fruit[len(fruit)-1] gives a. There is also an elegant second road: negative indices counting backwards from the end; fruit[-1] returns the last character and fruit[-2] the one before it, and so on. Both roads reach the same character — choose whichever reads more clearly in your code.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'من أول حرف إلى آخره', en: 'From the first character to the last' },
      code: "fruit = 'banana'\nprint(fruit[0])\nprint(fruit[5])\nprint(len(fruit))\nprint(fruit[len(fruit) - 1])\nprint(fruit[-1])",
      explanation: {
        ar: 'خمسة أسطر تروي القصة كاملة: fruit[0] أعطت b (الأول صفرًا)، وfruit[5] أعطت a (الأخير خمسة)، وlen أعطت 6 (عدد المحارف لا الفهرس الأخير)، ثم طريقان إلى آخر محرف: الطول ناقص واحد، والفهرس العكسي -1 — وكلاهما طبع a. لاحظ أن الطباعة الثالثة هي المصيدة الشهيرة: 6 فهرسٌ غير موجود.',
        en: 'Five lines tell the whole story: fruit[0] gave b (first is zero), fruit[5] gave a (last is five), len gave 6 (the character count, not the last index), then two roads to the last character: length minus one, and the negative index -1 — both printed a. Notice the third print is the famous trap: 6 is an index that does not exist.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.first-last',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "عرّف fruit بالقيمة 'banana'، ثم اطبع المحرف الأول عبر fruit[0]. بعدها استخدم len لاستخراج آخر محرف في متغيّر last واطبعه. المتوقع: b ثم a.",
        en: "Define fruit with the value 'banana', then print the first character via fruit[0]. After that, use len to extract the last character into a variable last and print it. Expected: b then a.",
      },
      starterCode: "fruit = 'banana'\n# اطبع الأول ثم استخرج last بطول السلسلة واطبعه / print the first, then extract last via len and print\n",
      solution: "fruit = 'banana'\nprint(fruit[0])\nlast = fruit[len(fruit) - 1]\nprint(last)",
      tests: [
        {
          id: 't1',
          name: { ar: 'fruit تساوي banana', en: 'fruit equals banana' },
          code: "assert fruit == 'banana', 'expected: banana | actual: %r' % fruit",
          expected: 'banana',
        },
        {
          id: 't2',
          name: { ar: 'last يساوي a', en: 'last equals a' },
          code: "assert last == 'a', 'expected: a | actual: %r' % last",
          expected: 'a',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع b ثم a', en: 'b then a are printed' },
          code: "assert 'b' in __learner_output__ and 'a' in __learner_output__, ('expected: b then a | actual: %r' % __learner_output__)",
          expected: 'b\na',
        },
      ],
      hints: [
        { ar: 'المحرف الأول فهرسه 0 دائمًا.', en: 'The first character is always at index 0.' },
        { ar: 'آخر فهرس = الطول ناقص واحد، والطول من len(fruit).', en: 'The last index = length minus one, and the length comes from len(fruit).' },
        { ar: 'الهيكل:\nprint(fruit[0])\nlast = fruit[len(fruit) - 1]\nprint(last)', en: 'The skeleton:\nprint(fruit[0])\nlast = fruit[len(fruit) - 1]\nprint(last)' },
        { ar: "fruit = 'banana'\nprint(fruit[0])\nlast = fruit[len(fruit) - 1]\nprint(last)", en: "fruit = 'banana'\nprint(fruit[0])\nlast = fruit[len(fruit) - 1]\nprint(last)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-index',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "word = 'hi'\nprint(word[0])\nprint(word[1])",
      solution: 'h\ni',
      answer: 'h\ni',
      hints: [
        { ar: 'الفهرس 0 هو أول محرف.', en: 'Index 0 is the first character.' },
        { ar: 'الفهرس 1 هو المحرف الثاني.', en: 'Index 1 is the second character.' },
        { ar: "كلمة hi محرفان فقط: h ثم i — لا يوجد فهرس 2 هنا.", en: 'The word hi has only two characters: h then i — there is no index 2 here.' },
        { ar: 'الخرْج:\nh\ni', en: 'The output:\nh\ni' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-float-index',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "بعد fruit = 'banana' نفّذ زميلك fruit[1.5]. ماذا يحدث؟",
        en: "After fruit = 'banana' your teammate runs fruit[1.5]. What happens?",
      },
      options: [
        { id: 'a', text: { ar: 'TypeError: string indices must be integers', en: 'TypeError: string indices must be integers' } },
        { id: 'b', text: { ar: 'IndexError: string index out of range', en: 'IndexError: string index out of range' } },
        { id: 'c', text: { ar: 'يطبع a — يقرّب العدد تلقائيًا', en: 'It prints a — Python rounds the number automatically' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'المشكلة في نوع الفهرس لا في مداه — 1.5 داخل المجال لكنه ليس صحيحًا.', en: 'The problem is the index type, not its range — 1.5 is in range but not an integer.' },
        { ar: 'أخطاء النوع تحمل اسم TypeError — عائلة عرفناها في الفصل الثالث.', en: 'Type errors carry the name TypeError — a family we met in chapter 3.' },
        { ar: 'رسالة الخطأ نفسها تقولها: string indices must be integers.', en: 'The error message says it itself: string indices must be integers.' },
        { ar: 'الجواب: a — TypeError لأن الفهرس يجب أن يكون عددًا صحيحًا.', en: 'Answer: a — TypeError because the index must be an integer.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-len',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل — كم تعيد len('banana')؟",
        en: "Without running — what does len('banana') return?",
      },
      answer: '6',
      solution: '6',
      tolerance: 0,
      hints: [
        { ar: 'عُدّ المحارف واحدًا واحدًا: b-a-n-a-n-a.', en: 'Count the characters one by one: b-a-n-a-n-a.' },
        { ar: 'len يعطي عدد المحارف لا عدد الفهارس الممكنة زيادة.', en: 'len gives the character count, nothing more.' },
        { ar: 'آخر فهرس سيكون 5 — لكن السؤال عن الطول.', en: 'The last index will be 5 — but the question asks for the length.' },
        { ar: 'الجواب: 6', en: 'Answer: 6' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — تنقّل بين الفهارس\n# Your playground — roam the indices\n\nfruit = 'banana'\nprint(fruit[0], fruit[2], fruit[5])\nprint(fruit[-1], fruit[-2])\nprint(len(fruit))\nprint(fruit[len(fruit) - 1])\nx = 3\nprint(fruit[x], fruit[x + 1])",
      prompt: {
        ar: 'جرّب بنفسك: غيّر الأرقام وراقب المحارف تتبدل، وجرّب فهرسًا سالبًا كبيرًا مثل fruit[-7] وراقب الخطأ، ثم جرّب فهرسًا عائمًا مثل fruit[2.0]. كذلك جرّب فهرسة سلسلة فارغة \'\'. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: change the numbers and watch the characters swap, try a large negative index like fruit[-7] and read the error, then try a float index like fruit[2.0]. Also try indexing an empty string ''. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الثاني: ماذا يعيد type(fruit[0])؟',
            en: 'And from chapter 2: what does type(fruit[0]) return?',
          },
          options: [
            { id: 'a', text: { ar: "<class 'str'> — المحرف المفرد سلسلة نصية أيضًا", en: "<class 'str'> — a single character is still a string" } },
            { id: 'b', text: { ar: "<class 'char'>", en: "<class 'char'>" } },
            { id: 'c', text: { ar: "<class 'int'>", en: "<class 'int'>" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'في بايثون لا يوجد نوع char منفصل: المحرف المفرد قيمة str بطول واحد — ولهذا يعمل len وكل توابع السلاسل عليه.',
            en: 'Python has no separate char type: a single character is a str of length one — which is why len and every string method work on it.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا آخر فهرس صالح في سلسلة طولها 6 هو 5؟',
            en: 'Why is the last valid index of a string of length 6 the number 5?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الترقيم يبدأ من الصفر فيكون 0 حتى 5', en: 'Because numbering starts at zero, running 0 through 5' } },
            { id: 'b', text: { ar: 'لأن بايثون تحجز فهرسًا أخيرًا للنهاية', en: 'Because Python reserves the final index for the end' } },
            { id: 'c', text: { ar: 'لأن الفهرس يبدأ من الواحد', en: 'Because indices start at one' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'ستة محارف مفهرسة من 0 إلى 5 — الفهرس دائمًا محارف الطول ناقص واحد. من هنا قاعدة fruit[len(fruit)-1].',
            en: 'Six characters are indexed 0 to 5 — the last index is always the length minus one. Hence the rule fruit[len(fruit)-1].',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "ما الخطأ الذي يرميه last = fruit[len(fruit)] عندما fruit = 'banana'؟",
            en: "What error does last = fruit[len(fruit)] throw when fruit = 'banana'?",
          },
          options: [
            { id: 'a', text: { ar: 'IndexError: string index out of range', en: 'IndexError: string index out of range' } },
            { id: 'b', text: { ar: 'TypeError', en: 'TypeError' } },
            { id: 'c', text: { ar: 'لا خطأ — يطبع a', en: 'No error — it prints a' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الطول 6 فهرس خارج السلسلة تمامًا — خطأ مدى لا خطأ نوع. تذكّر الفرق: TypeError للنوع الخاطئ، وIndexError للعنوان الغائب.',
            en: 'The length 6 is an address outside the string entirely — a range error, not a type error. Remember the difference: TypeError for the wrong type, IndexError for the missing address.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الخامس: كيف تمرّ حلقة for على مجموعة عناصر؟',
            en: 'And from chapter 5: how does a for loop move over a collection of items?',
          },
          options: [
            { id: 'a', text: { ar: 'تكرارًا لكل عنصر على حدة بالترتيب', en: 'One iteration per element, in order' } },
            { id: 'b', text: { ar: 'دفعة واحدة على المجموعة كلها', en: 'In one batch over the whole collection' } },
            { id: 'c', text: { ar: 'عددًا عشوائيًا من المرات', en: 'A random number of times' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'حلقة for محددة: عنصر = تكرار. في الدرس القادم سنمرّ بها على محارف السلسلة النصية تمامًا كما مررنا على القوائم.',
            en: 'A for loop is definite: one item = one iteration. In the next lesson we will walk it across string characters exactly as we walked it across lists.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'last = fruit[len(fruit)]',
          right: 'last = fruit[len(fruit) - 1]',
          note: {
            ar: 'الطول ليس فهرسًا: آخر فهرس هو الطول ناقص واحد، وإلا رميت IndexError: string index out of range. أو اختصر بـ fruit[-1].',
            en: 'The length is not an index: the last index is length minus one, or you get IndexError: string index out of range. Or shortcut with fruit[-1].',
          },
        },
        {
          wrong: 'letter = fruit[1.5]',
          right: 'letter = fruit[1]',
          note: {
            ar: 'الفهرس يجب أن يكون عددًا صحيحًا: 1.5 يرمي TypeError: string indices must be integers مهما بدا منطقيًا.',
            en: 'The index must be an integer: 1.5 throws TypeError: string indices must be integers, however reasonable it looks.',
          },
        },
        {
          wrong: "first = fruit[1]  # أول محرف؟",
          right: "first = fruit[0]  # أول محرف",
          note: {
            ar: 'أخطر سوء فهم في الفصل: الفهرس 1 هو المحرف الثاني. البداية صفر دائمًا — في banana تعطي fruit[1] حرف a لا b.',
            en: 'The chapter’s most dangerous misunderstanding: index 1 is the second character. Counting starts at zero — on banana, fruit[1] gives a, not b.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'السلسلة النصية سلسلة من المحارف، وعامل القوس [] يصل إلى محرف مفرد بالفهرس — والترقيم يبدأ من الصفر: أول محرف هو fruit[0].', en: 'A string is a sequence of characters; the bracket operator [] reaches one character by index — numbering starts at zero: the first character is fruit[0].' },
        { ar: 'التابع len يعيد عدد المحارف، وآخر فهرس صالح هو len-1؛ وفهرس خارج المجال يرمي IndexError، وفهرس غير صحيح يرمي TypeError.', en: 'len returns the character count; the last valid index is len-1; an out-of-range index throws IndexError and a non-integer index throws TypeError.' },
        { ar: 'الفهارس العكسية تعدّ من النهاية: fruit[-1] آخر محرف وfruit[-2] ما قبله — طريق ثانٍ أنيق إلى النهاية.', en: 'Negative indices count from the end: fruit[-1] is the last character and fruit[-2] the one before — a second elegant road to the end.' },
      ],
      reflectPrompt: {
        ar: 'فكّر في أول برنامج ستكتبه يعالج نصًا: ما أول محرف ستحتاج الوصول إليه بالفهرس؟ وهل ستصل إلى آخر محرف بطول ناقص واحد أم بـ -1؟ ولماذا؟',
        en: 'Think of the first text-processing program you will write: which first character will you need by index? And will you reach the last one via length minus one or via -1? Why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch6.s1', pages: 'ص86 / pp.86' },
        { book: 'PY4E', section: 'py4e.ch6.s2', pages: 'ص87 / pp.87' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch6.s1', pages: 'ص86 / pp.86' },
    { book: 'PY4E', section: 'py4e.ch6.s2', pages: 'ص87 / pp.87' },
  ],
} satisfies Lesson;

export default lesson;
