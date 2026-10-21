import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch8.l1 — "Lists: A Sequence of Elements / القائمة سلسلة من العناصر"
 * Aligned with PY4E ch8 s1 (القائمة هي سلسلة), s2 (القوائم قابلة للتعديل).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch8.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 8,
  title: { ar: 'القائمة سلسلة من العناصر', en: 'Lists: A Sequence of Elements' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch7.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الفصل السادس كانت السلسلة النصية سلسلة من المحارف — صندوق واحد يحمل حروفًا متراصة. لكن حياتك البرمجية الحقيقية تحتاج أكثر من ذلك: قائمة أسعار، قائمة كلمات، قائمة درجات. اليوم يبدأ الفصل الثامن بأخطر بنية بيانات في رحلتك: القائمة، التي تحمل أي عدد من القيم من أي نوع — وبخطوة جريئة: تسمح لك بتغييرها بعد إنشائها. بنهاية الدرس ستكون قادرًا على: إنشاء قوائم والوصول إلى عناصرها بالفهرس، وتمييز قابلية القوائم للتعديل عن ثبات السلاسل النصية.',
        en: 'In chapter 6 a string was a sequence of characters — one box holding letters in a row. But real programs need more: a list of prices, a list of words, a list of grades. Today chapter 8 begins with the most powerful data structure of your journey so far: the list, which holds any number of values of any type — and takes a bold step: it lets you change it after creation. By the end of this lesson you will be able to: build lists and reach their elements by index, and tell list mutability apart from string immutability.',
      },
    },
    {
      kind: 'predict',
      code: 'numbers = [17, 123]\nnumbers[1] = 5\nprint(numbers)',
      question: {
        ar: 'في الفصل السادس رفضت بايثون السطر greeting[0] = \'J\' على سلسلة نصية. فماذا يطبع هذا الكود على قائمة؟',
        en: "In chapter 6 Python refused the line greeting[0] = 'J' on a string. So what does this code print when the data is a list?",
      },
      reveal: {
        ar: 'يطبع [17, 5] — دون أي اعتراض! القائمة سمحت بتبديل عنصرها: القيمة 123 في الفهرس 1 صارت 5. هذه هي القابلية للتعديل (mutability) التي ستميز القوائم عن كل ما تعلمته قبلها.',
        en: 'It prints [17, 5] — with no objection at all! The list allowed swapping its element: the value 123 at index 1 became 5. This is mutability, the trait that will set lists apart from everything you learned before.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'القائمة: سلسلة من القيم', en: 'A list: a sequence of values' },
      chunks: [
        {
          ar: 'القائمة (list) سلسلة من القيم، كما كانت السلسلة النصية سلسلة من المحارف — لكن قيم القائمة يمكن أن تكون من أي نوع بيانات. تُسمى القيم داخل القائمة العناصر (elements أو items). وأسهل طريقة لإنشاء قائمة هي حصر عناصرها داخل قوسين مربعين [ ] تفصلها الفواصل: [10, 20, 30, 40] قائمة من أربعة أعداد صحيحة، و[\'crunchy frog\', \'ram bladder\'] قائمة من سلسلتين نصيتين.',
          en: "A list is a sequence of values, just as a string is a sequence of characters — but the values of a list can be of any data type. The values inside a list are called elements or items. The easiest way to create a list is to enclose the elements in square brackets [ ] separated by commas: [10, 20, 30, 40] is a list of four integers, and ['crunchy frog', 'ram bladder'] is a list of two strings.",
        },
        {
          ar: 'ليس شرطًا أن تكون عناصر القائمة من نوع واحد: [\'spam\', 2.0, 5, [10, 20]] قائمة تجمع سلسلة نصية وعددًا عشريًا وعددًا صحيحًا وقائمة أخرى! ووجود قائمة داخل قائمة يسمى التداخل (nested). أما القائمة التي لا تحوي أي عنصر فتسمى القائمة الفارغة (empty list) وتُكتب [] فقط — ستستخدمها كثيرًا كنقطة انطلاق تملؤها لاحقًا.',
          en: "List elements do not have to share one type: ['spam', 2.0, 5, [10, 20]] gathers a string, a float, an integer and even another list! A list inside another list is called nested. A list holding nothing at all is the empty list, written [] — you will use it a lot as a starting point that you fill later.",
        },
        {
          ar: 'وكما أسندت النصوص والأعداد إلى متغيرات، أسند القائمة إلى متغير: cheeses = [\'Cheddar\', \'Edam\', \'Gouda\'] ثم numbers = [17, 123] ثم empty = []. وبمجرد إسنادها يصبح المتغير اسمًا تشير به إلى القائمة كلها — واطبعها print وسترى القائمة كاملة بقوسيها: [\'Cheddar\', \'Edam\', \'Gouda\'] [17, 123] [].',
          en: "Just as you assigned strings and numbers to variables, assign a list to a variable: cheeses = ['Cheddar', 'Edam', 'Gouda'], then numbers = [17, 123], then empty = []. Once assigned, the variable is a name referring to the whole list — print it and you will see the full list with its brackets: ['Cheddar', 'Edam', 'Gouda'] [17, 123] [].",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الفهرسة: نفس القواعد التي أتقنتها في السلاسل', en: 'Indexing: the same rules you mastered for strings' },
      chunks: [
        {
          ar: 'طريقة الوصول إلى عناصر القائمة هي ذاتها المستخدمة للوصول إلى المحارف في السلاسل: عامل القوس المربّع، والتعبير داخله هو الفهرس. تذكّر أن الفهارس تبدأ من الصفر: cheeses[0] تعطي \'Cheddar\' — أول عنصر. وأي تعبير قيمته عدد صحيح يصلح فهرسًا.',
          en: "Reaching a list element works exactly like reaching a character in a string: the bracket operator, and the expression inside is the index. Remember indices start at zero: cheeses[0] gives 'Cheddar' — the first element. And any expression evaluating to an integer works as an index.",
        },
        {
          ar: 'فهارس القوائم تتصرف تمامًا كفهارس السلاسل النصية: قراءة أو كتابة فهرس غير موجود ترمي IndexError، والفهرس السالب يبدأ العد عكسيًا من النهاية — cheeses[-1] تعطي آخر عنصر \'Gouda\'. وlen(cheeses) يعطي عدد العناصر 3. القاعدة الذهبية من الفصل السادس صارت قانونًا عامًا: آخر فهرس مشروع هو len(t) - 1.',
          en: "List indices behave exactly like string indices: reading or writing a nonexistent index throws IndexError, and a negative index counts backwards from the end — cheeses[-1] gives the last element 'Gouda'. And len(cheeses) gives the element count 3. The golden rule from chapter 6 is now a general law: the last legal index is len(t) - 1.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'القوائم قابلة للتعديل — وهذا الفرق الكبير', en: 'Lists are mutable — and that is the big difference' },
      chunks: [
        {
          ar: 'القائمة علاقة بين الفهارس والعناصر: كل فهرس مرتبط بعنصر — وهذه العلاقة تسمى الربط (mapping). وخلافًا للسلاسل النصية، القوائم قابلة للتعديل (mutable): يمكنك تغيير ترتيب عناصرها أو إعادة تعيين عنصر فيها. عندما يظهر عامل القوس على الجانب الأيسر من الإسناد فهو يحدد العنصر الذي ستُسنَد إليه القيمة: numbers[1] = 5 استبدل العنصر في الفهرس 1 فصارت القائمة [17, 5].',
          en: 'A list is a mapping from indices to elements: each index is linked to one element. And unlike strings, lists are mutable: you can change the order of their elements or reassign an element. When the bracket operator appears on the left side of an assignment, it identifies the element about to receive the value: numbers[1] = 5 replaced the element at index 1, so the list became [17, 5].',
        },
        {
          ar: 'قارن مع الفصل السادس: greeting[0] = \'J\' على السلسلة \'Hello\' رمت TypeError لأن السلاسل غير قابلة للتعديل (immutable) — الوحيد كان بناء سلسلة جديدة. أما القائمة فتُعدَّل في مكانها بنفس الكائن. هذه المرونة قوة عظيمة ومصدر أخطاء عظيم — ستتعلم في دروس هذا الفصل متى تُعدّل ومتى تنسخ.',
          en: "Compare with chapter 6: greeting[0] = 'J' on the string 'Hello' threw a TypeError because strings are immutable — the only way out was building a new string. A list, however, is modified in place, in the very same object. This flexibility is a great power and a great bug source — this chapter will teach you when to modify and when to copy.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'أنشئ، فهرس، عدّ، عدّل', en: 'Create, index, count, modify' },
      code: "mixed = ['spam', 2.0, 5, [10, 20]]\nprint(mixed[0])\nprint(mixed[3])\nprint(len(mixed))\n\ncheeses = ['Cheddar', 'Edam', 'Gouda']\nprint(cheeses[-1])\ncheeses[0] = 'Brie'\nprint(cheeses)\n\nempty = []\nprint(len(empty))",
      explanation: {
        ar: "القائمة mixed تجمع أربعة أنواع — لكن طولها 4 لأن القائمة المتداخلة [10, 20] تُحسب عنصرًا واحدًا. الفهرس -1 وقفنا به عند آخر عنصر \'Gouda\'، ثم استبدلنا رأس القائمة بـ \'Brie\' بنفس عامل القوس الذي قرأ به — اليسار يكتب واليمين يقرأ. والقائمة الفارغة طولها 0 وسط كل هذا. لاحظ أن بايثون تطبع القوائم بقوسين مربعين وفواصل.",
        en: "The list mixed gathers four types — yet its length is 4 because the nested list [10, 20] counts as a single element. The index -1 landed on the last element 'Gouda', then we swapped the head of the list for 'Brie' with the same bracket operator that read it — left side writes, right side reads. And the empty list has length 0 amid all this. Note that Python prints lists with square brackets and commas.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.mutate-list',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "عرّف القائمة scores بالقيم [10, 20, 30]، ثم استبدل العنصر الأخير بالقيمة 99 عبر الفهرس (لديك ثلاث طرق: scores[2]، أو scores[-1]، أو scores[len(scores) - 1])، ثم اطبع القائمة. الخرْج المتوقع: [10, 20, 99].",
        en: 'Define the list scores with the values [10, 20, 30], then replace the last element with the value 99 via an index (you have three roads: scores[2], or scores[-1], or scores[len(scores) - 1]), then print the list. Expected output: [10, 20, 99].',
      },
      starterCode: 'scores = [10, 20, 30]\n# غيّر العنصر الأخير ثم اطبع القائمة / change the last element then print the list\n',
      solution: 'scores = [10, 20, 30]\nscores[2] = 99\nprint(scores)',
      tests: [
        {
          id: 't1',
          name: { ar: 'القائمة صارت [10, 20, 99]', en: 'The list became [10, 20, 99]' },
          code: "assert scores == [10, 20, 99], 'expected: [10, 20, 99] | actual: %r' % scores",
          expected: '[10, 20, 99]',
        },
        {
          id: 't2',
          name: { ar: 'القائمة مطبوعة كما هي', en: 'The list is printed as-is' },
          code: "assert '[10, 20, 99]' in __learner_output__, ('expected: [10, 20, 99] | actual: %r' % __learner_output__)",
          expected: '[10, 20, 99]',
        },
      ],
      hints: [
        { ar: 'الإسناد للفهرس لا يحتاج أي تابع — عامل القوس على يسار علامة = يكتب مباشرة.', en: 'Assigning to an index needs no method at all — the bracket on the left of = writes directly.' },
        { ar: 'آخر عنصر في قائمة طولها 3 فهرسه 2 — لأن العد يبدأ من الصفر.', en: 'The last element of a length-3 list has index 2 — because counting starts at zero.' },
        { ar: 'الهيكل:\nscores[2] = 99\nprint(scores)', en: 'The skeleton:\nscores[2] = 99\nprint(scores)' },
        { ar: 'scores = [10, 20, 30]\nscores[2] = 99\nprint(scores)', en: 'scores = [10, 20, 30]\nscores[2] = 99\nprint(scores)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-indexing',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "cheeses = ['x', 'y', 'z']\nprint(cheeses[0])\nprint(cheeses[-1])\nprint(len(cheeses))",
      solution: 'x\nz\n3',
      answer: 'x\nz\n3',
      hints: [
        { ar: 'الفهرس 0 يعطي أول عنصر دائمًا.', en: 'Index 0 always gives the first element.' },
        { ar: 'الفهرس السالب -1 يعطي آخر عنصر.', en: 'The negative index -1 gives the last element.' },
        { ar: 'len يعدّ العناصر: ثلاث سلاسل نصية.', en: 'len counts the elements: three strings.' },
        { ar: 'الخرْج:\nx\nz\n3', en: 'The output:\nx\nz\n3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-indexerror',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 't = [10, 20, 30] — ماذا يحدث عند تنفيذ print(t[3])؟',
        en: 't = [10, 20, 30] — what happens when print(t[3]) runs?',
      },
      options: [
        { id: 'a', text: { ar: 'خطأ IndexError لأن آخر فهرس مشروع هو 2', en: 'An IndexError because the last legal index is 2' } },
        { id: 'b', text: { ar: 'يطبع 30', en: 'It prints 30' } },
        { id: 'c', text: { ar: 'يطبع None', en: 'It prints None' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'ثلاثة عناصر تعني الفهارس 0 و1 و2 فقط.', en: 'Three elements mean indices 0, 1 and 2 only.' },
        { ar: 'هذا نفس سلوك السلاسل في الفصل السادس.', en: 'This is the same behavior strings showed in chapter 6.' },
        { ar: 'العد يبدأ من الصفر فينتهي عند الطول ناقص واحد.', en: 'Counting starts at zero, so it ends at length minus one.' },
        { ar: 'الجواب: أ — IndexError: list index out of range.', en: 'Answer: a — IndexError: list index out of range.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-nested-len',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: كم يُطبع print(len([\'spam\', 2.0, 5, [10, 20]]))؟ انتبه إلى القائمة المتداخلة.',
        en: "Without running: what does print(len(['spam', 2.0, 5, [10, 20]])) show? Watch the nested list.",
      },
      answer: '4',
      solution: '4',
      tolerance: 0,
      hints: [
        { ar: 'عدّ العناصر الظاهرة على المستوى الأعلى فقط.', en: 'Count only the elements visible at the top level.' },
        { ar: 'القائمة المتداخلة [10, 20] تُحسب عنصرًا واحدًا مهما كان حجمها.', en: 'The nested list [10, 20] counts as one element however big it is.' },
        { ar: 'السلسلة والعدد العشري والعدد الصحيح ثلاثة عناصر، والمتداخلة رابعها.', en: 'The string, the float and the integer are three elements, and the nested one is their fourth.' },
        { ar: 'الجواب: 4', en: 'Answer: 4' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — اصنع قوائمك\n# Your playground — build your lists\n\nmovies = [\'Inception\', 2010, 8.8]\nprint(movies)\nprint(movies[0], movies[-1])\nmovies[2] = 9.0\nprint(movies)\n\nempty = []\nprint(len(empty))',
      prompt: {
        ar: 'جرّب بنفسك: اصنع قائمة من أنواع مختلطة، اقرأ عناصرها بالفهارس الموجبة والسالبة، وغيّر عنصرًا. ثم جرّب الفكرة المحرّمة: movies[3] — ماذا حدث ولماذا؟ وجرّب print(\'banana\'[0]) ثم محاولة تعديلها. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: build a list of mixed types, read its elements with positive and negative indices, and modify one. Then try the forbidden move: movies[3] — what happened and why? Also try print('banana'[0]) then attempt to modify it. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل السادس: لماذا فشل السطر greeting[0] = \'J\' على سلسلة نصية بينما ينجح نفس السطر على قائمة؟',
            en: "Back to chapter 6: why did greeting[0] = 'J' fail on a string while the same line succeeds on a list?",
          },
          options: [
            { id: 'a', text: { ar: 'لأن السلاسل غير قابلة للتعديل والقوائم قابلة', en: 'Because strings are immutable while lists are mutable' } },
            { id: 'b', text: { ar: 'لأن السلاسل لا تحتوي فهارس', en: 'Because strings have no indices' } },
            { id: 'c', text: { ar: 'لأن القوس المربّع يعمل على القوائم فقط', en: 'Because square brackets only work on lists' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السلسلة كائن ثابت: أي "تعديل" يعني بناء سلسلة جديدة. القائمة كائن قابل للتعديل يُقبل تغيير عناصره في مكانه.',
            en: 'A string is an immutable object: any "change" means building a new string. A list is a mutable object that accepts in-place changes.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كيف تُكتب القائمة الفارغة؟',
            en: 'How is the empty list written?',
          },
          options: [
            { id: 'a', text: { ar: '[]', en: '[]' } },
            { id: 'b', text: { ar: "''", en: "''" } },
            { id: 'c', text: { ar: 'None', en: 'None' } },
          ],
          answer: 'a',
          explanation: {
            ar: '[] قائمة بلا عناصر وطولها 0 — وهي نقطة البداية المعتادة لقائمة ستملؤها لاحقًا بعناصر جديدة.',
            en: '[] is a list with no elements and length 0 — the usual starting point of a list you will fill with new elements later.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'cheeses = [\'Cheddar\', \'Edam\', \'Gouda\'] — ماذا تعطي cheeses[-1]؟',
            en: "cheeses = ['Cheddar', 'Edam', 'Gouda'] — what does cheeses[-1] give?",
          },
          options: [
            { id: 'a', text: { ar: "'Gouda' — الفهرس السالب يعدّ من النهاية", en: "'Gouda' — the negative index counts from the end" } },
            { id: 'b', text: { ar: "'Cheddar' — لأن -1 تعني أول عنصر", en: "'Cheddar' — because -1 means the first element" } },
            { id: 'c', text: { ar: 'IndexError', en: 'An IndexError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'العد السلبي يبدأ من آخر عنصر: -1 الأخير و-2 ما قبله — نفس قاعدة السلاسل في الفصل السادس.',
            en: 'Negative counting starts at the last element: -1 is the last and -2 the one before — the same rule strings followed in chapter 6.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثاني: عند تنفيذ numbers[1] = 5، ماذا يحدث للقائمة numbers الأصلية؟',
            en: 'From chapter 2: when numbers[1] = 5 runs, what happens to the original numbers list?',
          },
          options: [
            { id: 'a', text: { ar: 'يُستبدل عنصرها الثاني بالقيمة 5 في القائمة نفسها', en: 'Its second element is replaced with 5, inside the same list' } },
            { id: 'b', text: { ar: 'تُنشأ قائمة جديدة ويبقى الأصل سالمًا', en: 'A new list is created and the original stays intact' } },
            { id: 'c', text: { ar: 'يُضاف عنصر جديد إلى نهايتها', en: 'A new element is appended to its end' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الإسناد لعنصر بفهرس يعدّل القائمة في مكانها — هذه هي قابلية التعديل، وستكون مصدر مفاجآت لطيفة قادمة في درس الإحالات.',
            en: 'Assigning to an indexed element modifies the list in place — that is mutability, and it will spring some lovely surprises in the references lesson.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "word = 'banana'\nword[0] = 'B'",
          right: "letters = ['b', 'a', 'n']\nletters[0] = 'B'",
          note: {
            ar: 'السلاسل غير قابلة للتعديل: محاولة إسناد عنصر فيها ترمي TypeError. الطريق الوحيد مع السلاسل بناء سلسلة جديدة مثل \'B\' + word[1:] — أما القوائم فيُعدَّل عنصرها بلا ضجيج.',
            en: "Strings are immutable: assigning to one of their characters throws a TypeError. With strings the only road is a new string like 'B' + word[1:] — while a list element is modified silently.",
          },
        },
        {
          wrong: 't = [10, 20, 30]\nlast = t[len(t)]',
          right: 't = [10, 20, 30]\nlast = t[len(t) - 1]',
          note: {
            ar: 't[len(t)] تتجاوز النهاية فترمي IndexError — الفهارس المشروعة من 0 إلى الطول ناقص واحد، أو اختصر بـ t[-1].',
            en: 't[len(t)] overshoots the end and throws IndexError — legal indices run from 0 to length minus one, or just use t[-1].',
          },
        },
        {
          wrong: "empty = ''\nempty.append('a')",
          right: "empty = []\nempty.append('a')",
          note: {
            ar: 'القائمة الفارغة [] وليست السلسلة الفارغة \'\' — وappend تابع قوائم لا يعمل على السلاسل فيرمي AttributeError.',
            en: "The empty list is [], not the empty string '' — and append is a list method that fails on strings with an AttributeError.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'القائمة سلسلة من القيم من أي نوع، عناصرها بين قوسين مربعين، ويمكن أن تتداخل قوائم داخل قوائم، والقائمة الفارغة [].', en: 'A list is a sequence of values of any type, written between square brackets, lists may nest inside lists, and the empty list is [].' },
        { ar: 'الفهرسة ببنية القوس مثل السلاسل تمامًا: تبدأ من الصفر، والسالب يعدّ من النهاية، والتجاوز يرمي IndexError، وlen يعطي عدد العناصر.', en: 'Indexing works exactly like strings: starts at zero, negative counts from the end, overshooting throws IndexError, and len gives the element count.' },
        { ar: 'القوائم قابلة للتعديل: عامل القوس على يسار الإسناد يستبدل العنصر في المكان — بينما السلاسل ثابتة وتحتاج بناء سلسلة جديدة.', en: 'Lists are mutable: the bracket on the left of an assignment replaces the element in place — while strings are immutable and need a brand-new string.' },
      ],
      reflectPrompt: {
        ar: 'اذكر ثلاث بيانات من حياتك اليومية يصعب تخزينها في متغير واحد — واصف كيف تمثّلها بقائمة واحدة: ما عناصرها؟ من أي أنواع؟ وهل ستتغير قيمها أثناء عمل البرنامج؟',
        en: 'Name three pieces of data from your daily life that are hard to store in a single variable — and describe how one list would represent them: what are its elements? Of what types? Will its values change while the program runs?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch8.s1', pages: 'ص119 / pp.119' },
        { book: 'PY4E', section: 'py4e.ch8.s2', pages: 'ص119 / pp.119' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch8.s1', pages: 'ص119 / pp.119' },
    { book: 'PY4E', section: 'py4e.ch8.s2', pages: 'ص119 / pp.119' },
  ],
} satisfies Lesson;

export default lesson;
