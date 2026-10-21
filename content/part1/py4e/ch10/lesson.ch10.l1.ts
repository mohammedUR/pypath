import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch10.l1 — "Tuples Are Immutable / الصفوف غير قابلة للتعديل"
 * Aligned with PY4E ch10 s1 (الصفوف غير قابلة للتعديل).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch10.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 10,
  title: { ar: 'الصفوف غير قابلة للتعديل', en: 'Tuples Are Immutable' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch9.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الفصول الأخيرة جمعت عائلتين من الحاويات: القوائم من الفصل الثامن — حية تُبنى وتُعدّل وترتّب — والقواميس من الفصل التاسع — مفاتيح وقيَم بلا ترتيب معلوم. اليوم ينضم ضيف ثالث يشبه القوائم في كل شيء تقريبًا ثم يخالفها في قاعدة واحدة حاسمة: لا يجوز تعديله بعد ولادته. بنهاية الدرس ستكون قادرًا على: إنشاء صف بأقواسه وفاصله، وقراءة عناصره بالفهرسة والتجزئة، وتمييز فخ العنصر الواحد، وفهم لماذا يمتنع الصف عن التغيير — وكيف يفتح هذا الامتناع بابَي الترتيب والمفاتيح اللذين سيبني عليهما الفصل كله.',
        en: 'Recent chapters gave you two families of containers: lists from chapter 8 — alive, built, edited, sorted — and dictionaries from chapter 9 — keys and values in no guaranteed order. Today a third guest arrives, resembling lists in nearly everything yet breaking with them in one decisive rule: it may not be modified after birth. By the end of this lesson you will be able to: create a tuple with its parentheses and comma, read its elements by indexing and slicing, spot the single-element trap, and understand why the tuple refuses to change — and how that refusal opens the two doors of sorting and keying on which this whole chapter stands.',
      },
    },
    {
      kind: 'predict',
      code: "t1 = ('a',)\nt2 = ('a')\nprint(type(t1) == type(t2))",
      question: {
        ar: 'سطران يبدوان توأمين: في الأول فاصلة بعد a، وفي الثاني لا فاصلة. هل يطبع True أم False؟',
        en: 'Two lines that look like twins: the first has a comma after a, the second does not. Does it print True or False?',
      },
      reveal: {
        ar: 'يطبع False — الفاصلة الصغيرة غيّرت نوع القيمة بالكامل: t1 صف tuple بينما t2 سلسلة نصية str. الأقواس وحدها لا تصنع صفًا؛ الفاصلة هي من تصنعه. هذا أول فخ في الفصل، وسنعود إليه بعد قليل.',
        en: 'It prints False — the tiny comma changed the value\u2019s type entirely: t1 is a tuple while t2 is a string. Parentheses alone do not make a tuple; the comma does. This is the chapter\u2019s first trap, and we will return to it shortly.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الصف: قائمة بخط لا يمحوه أحد', en: 'A tuple: a list no one can erase' },
      chunks: [
        {
          ar: "الصف tuple سلسلة من القيم: قيمه من كل الأنواع كما في القوائم، ويفهرس بأعداد صحيحة كما في السلاسل والقوائم. تكتبه قيمًا تفصلها فواصل: t = 'a', 'b', 'c' — والقوسان ليسا شرطًا لكنهما معتادان لتمييز الصفوف بصريًا: t = ('a', 'b', 'c', 'd', 'e'). والفهرسة تعمل كما تعلمت في الفصل السادس حرفيًا: t[0] تعطي 'a'، وt[1:3] تعطي ('b', 'c').",
          en: "A tuple is a sequence of values: its values can be of any type, and it is indexed by integers just like strings and lists. You write it as values separated by commas: t = 'a', 'b', 'c' — the parentheses are not required, but convention keeps tuples visually recognizable: t = ('a', 'b', 'c', 'd', 'e'). Indexing works exactly as chapter 6 taught: t[0] gives 'a', and t[1:3] gives ('b', 'c').",
        },
        {
          ar: "الصف الفارغ ينشأ بلا وسائط: t = tuple() ويطبع (). والتابع الجاهز tuple يحوّل أي سلسلة إلى صف من عناصرها: tuple('lupins') تعطي ('l', 'u', 'p', 'i', 'n', 's'). وتذكّر قاعدة الأسماء من الفصل الأول: tuple اسم تابع جاهز، فلا تجعله اسمًا لمتغير وإلا فقدت التابع أينما استدعاءه.",
          en: "An empty tuple is created with no arguments: t = tuple() prints (). And the built-in tuple converts any sequence into a tuple of its elements: tuple('lupins') gives ('l', 'u', 'p', 'i', 'n', 's'). Recall the naming rule from chapter 1: tuple is a built-in function name, so never use it as a variable name or you lose the function wherever you call it.",
        },
        {
          ar: 'والفرق الجوهري عن القائمة: الصف غير قابل للتعديل — لا إضافة ولا حذف ولا استبدال بعد الإنشاء. وفي المقابل يمنحك هذا القيد ميزة مكمّلة: الصف قابل للمقارنة، وتصلح عليه خوارزمية الهاش، فإمّا أن يُرتَّب داخل قائمة أو يُستخدم مفتاحًا في قاموس — شيئان ستبني عليهما هذا الفصل كله.',
          en: 'The essential difference from a list: a tuple is immutable — no adding, removing, or replacing after creation. In exchange, this constraint grants a complementary power: tuples are comparable and can pass through the hash algorithm, so a list of tuples can be sorted and tuples can serve as dictionary keys — the two things this whole chapter builds on.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فخ العنصر الواحد', en: 'The single-element trap' },
      chunks: [
        {
          ar: "لتكوين صف من عنصر واحد يجب أن يتبع العنصر فاصلة: t1 = ('a',) — وtype(t1) يجيب <class 'tuple'>. أما t2 = ('a') فليس صفًا إطلاقًا: الأقواس هنا مجرد أقواس تجميع رياضية والقيمة سلسلة نصية — type(t2) يجيب <class 'str'>. الفاصلة هي التوقيع الذي يقرؤه بايثون ليعرف أنك تريد صفًا؛ فاصلة واحدة بعد قيمة واحدة تكفي لتوليد صف كامل.",
          en: "To build a one-element tuple the element must be followed by a comma: t1 = ('a',) — and type(t1) answers <class 'tuple'>. But t2 = ('a') is not a tuple at all: the parentheses here are mere grouping brackets and the value is a string — type(t2) answers <class 'str'>. The comma is the signature Python reads to know you want a tuple; one comma after one value is enough to produce a full tuple.",
        },
        {
          ar: 'والنقيض المدهش: الأقواس الفارغة () تصنع صفًا فارغًا صحيحًا، لأن قوسي تجميع بلا شيء داخلهما لا معنى لهما فيفسّرهما بايثون صفًّا. اثنان فقط تستثنيهما من القاعدة العامة: () صف فارغ بلا فاصلة، والعنصر الواحد يحتاج فاصلة رغم وجود القيمة.',
          en: 'The astonishing converse: empty parentheses () do make a valid empty tuple, because grouping brackets with nothing inside carry no meaning, so Python reads them as a tuple. Only two cases break the general rule: () is an empty tuple with no comma, and a single element needs a comma despite having a value.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الامتناع عن التعديل وبدائله', en: 'Refusing to change — and the workarounds' },
      chunks: [
        {
          ar: "ماذا لو حاولت تعديل عنصر صف؟ t[0] = 'A' يوقف البرنامج برسالة TypeError: 'tuple' object does not support item assignment — نفس عائلة رسالة تعديل السلاسل في الفصل السادس. والحل بنفس روح ذلك الفصل: لا تعل الصف بل ابنِ صفًا جديدًا: t = ('A',) + t[1:] — عامل + يلحم صفين في صف ثالث، وعامل التجزئة t[1:] يأخذ كل العناصر بعد الأول.",
          en: "What if you try to modify a tuple element? t[0] = 'A' stops the program with TypeError: 'tuple' object does not support item assignment — the same message family as mutating strings in chapter 6. And the fix carries the same spirit as that chapter: do not mend the tuple; build a new one: t = ('A',) + t[1:] — the + operator welds two tuples into a third, and the slice t[1:] takes every element after the first.",
        },
        {
          ar: 'متى تختار الصف إذن؟ متى أردت ضمانًا: بيانات لا يحق للبرنامج تغييرها — أيام الأسبوع، إحداثيات نقطة، زوج (مفتاح، قيمة) قادم من قاموس. القائمة أرض بناء والصف أرض حفظ: القائمة تخزّن ثم تتحرك، والصف يخزّن ثم يطيع. وفي الدرسين القادمين سترى كيف يجعل هذا الثبات الصفَ عنصرَ ترتيب ومفتاحَ قاموس لا بديل عنه.',
          en: 'When do you choose a tuple, then? Whenever you want a guarantee: data the program has no right to change — weekdays, a point\u2019s coordinates, a (key, value) pair arriving from a dictionary. The list is construction ground and the tuple is preservation ground: the list stores then moves, the tuple stores then obeys. In the next two lessons you will see how this immutability makes the tuple an irreplacable sorting element and dictionary key.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'افحص الصف ثم ابنِ بديله', en: 'Inspect the tuple, then build its replacement' },
      code: "t = ('a', 'b', 'c', 'd', 'e')\nprint(t[0])\nprint(t[1:3])\nprint(t)\nt = ('A',) + t[1:]\nprint(t)",
      explanation: {
        ar: "قرأنا الصف بالفهرسة والتجزئة دون أي اعتراض — القراءة حرة دائمًا: a ثم ('b', 'c'). ثم لم نعدّل العنصر الأول بل أنشأنا صفًا جديدًا: ('A',) صف من عنصر واحد (انتبه للفاصلة)، وt[1:] باقي العناصر، و+ ألحقهما فصار t يشير إلى ('A', 'b', 'c', 'd', 'e'). الصف القديم بقي كما كان؛ القواعد التي حفظتها للسلاسل في الفصل السادس تسري هنا حرفيًا.",
        en: "We read the tuple by indexing and slicing with no objection — reading is always free: a then ('b', 'c'). Then we did not modify the first element; we built a new tuple: ('A',) is a one-element tuple (mind the comma), t[1:] is the rest, and + joined them so t now refers to ('A', 'b', 'c', 'd', 'e'). The old tuple stayed exactly as it was — the rules you memorized for strings in chapter 6 apply here verbatim.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.first-tuple',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "أنشئ صفًّا اسمه t يحوي العناصر 'a' و'b' و'c' و'd' و'e' بالترتيب (بأقواس وفواصل)، ثم اطبع t[0]، ثم اطبع t[1:3]. المتوقع: a ثم ('b', 'c').",
        en: "Create a tuple named t holding 'a', 'b', 'c', 'd', 'e' in order (with parentheses and commas), then print t[0], then print t[1:3]. Expected: a then ('b', 'c').",
      },
      starterCode: "# أنشئ الصف ثم اطبع عنصره الأول وتجزئته / create the tuple, then print its first element and a slice:\n",
      solution: "t = ('a', 'b', 'c', 'd', 'e')\nprint(t[0])\nprint(t[1:3])",
      tests: [
        {
          id: 't1',
          name: { ar: 't صف من خمسة أحرف بالترتيب', en: 't is the five-letter tuple in order' },
          code: "assert t == ('a', 'b', 'c', 'd', 'e'), 'expected: 5-letter tuple | actual: %r' % (t,)",
          expected: "5-letter tuple",
        },
        {
          id: 't2',
          name: { ar: 'يُطبع العنصر الأول a', en: 'The first element a is printed' },
          code: "assert 'a' in __learner_output__, ('expected: a | actual: %r' % __learner_output__)",
          expected: 'a',
        },
        {
          id: 't3',
          name: { ar: "يُطبع القطع ('b', 'c')", en: "The slice ('b', 'c') is printed" },
          code: "assert \"('b', 'c')\" in __learner_output__, ('expected: (\\'b\\', \\'c\\') | actual: %r' % __learner_output__)",
          expected: "('b', 'c')",
        },
      ],
      hints: [
        { ar: 'القوسان والفواصل كالقوائم تمامًا — لكن تذكّر أن الاقتباسات تُغلّف كل حرف لأنها سلاسل.', en: 'Parentheses and commas work exactly like lists — but remember the quotes wrap each letter because they are strings.' },
        { ar: 'الفهرسة والتجزئة صياغة الفصل السادس نفسها: t[0] وt[1:3].', en: 'Indexing and slicing use the very same chapter-6 syntax: t[0] and t[1:3].' },
        { ar: 'الهيكل:\nt = (\'a\', \'b\', \'c\', \'d\', \'e\')\nprint(t[0])\nprint(t[1:3])', en: "The skeleton:\nt = ('a', 'b', 'c', 'd', 'e')\nprint(t[0])\nprint(t[1:3])" },
        { ar: "t = ('a', 'b', 'c', 'd', 'e')\nprint(t[0])\nprint(t[1:3])", en: "t = ('a', 'b', 'c', 'd', 'e')\nprint(t[0])\nprint(t[1:3])" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-tuple',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "t = ('l', 'u', 'p', 'i', 'n', 's')\nprint(t[0])\nprint(t[2:4])\nprint(len(t))",
      solution: "l\n('p', 'i')\n6",
      answer: "l\n('p', 'i')\n6",
      hints: [
        { ar: 'السطر الأول يطبع محرفًا واحدًا بلا اقتباسات — هكذا يطبع print السلاسل.', en: 'The first line prints one character without quotes — that is how print shows strings.' },
        { ar: 'القطعة t[2:4] تحوي عنصرين من موضع 2 إلى 4 (قبل 4).', en: 'The slice t[2:4] holds two elements, from position 2 up to (not including) 4.' },
        { ar: 'len تعمل على الصف كما على القائمة والسلسلة: عدد العناصر.', en: 'len works on tuples as on lists and strings: the element count.' },
        { ar: "الخرْج:\nl\n('p', 'i')\n6", en: "The output:\nl\n('p', 'i')\n6" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-singleton',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "بعد تنفيذ t2 = ('a') — ماذا تجيب type(t2)؟",
        en: "After running t2 = ('a') — what does type(t2) answer?",
      },
      options: [
        { id: 'a', text: { ar: "<class 'str'> — سلسلة نصية، الأقواس بلا فاصلة لا تصنع صفًّا", en: "<class 'str'> — a string; parentheses without a comma make no tuple" } },
        { id: 'b', text: { ar: "<class 'tuple'> — القوسان يكفيان", en: "<class 'tuple'> — the parentheses are enough" } },
        { id: 'c', text: { ar: "<class 'list'> — القوسان يصنعان قائمة", en: "<class 'list'> — the parentheses make a list" } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'هذا فخ التنبؤ في أول الدرس — راجع نتيجته.', en: 'This is the trap from the lesson\u2019s prediction — revisit its result.' },
        { ar: 'الفاصلة هي تصريح الولادة، لا القوسان.', en: 'The comma is the birth certificate, not the parentheses.' },
        { ar: 'الصيغة الصحيحة لصف العنصر الواحد: (\'a\',).', en: "The correct form for a one-element tuple: ('a',)." },
        { ar: "الجواب: <class 'str'> — t2 مجرد سلسلة مغلّفة بأقواس تجميع.", en: "Answer: <class 'str'> — t2 is just a string wrapped in grouping brackets." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-tuple',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: التابع الجاهز ____ ينشئ صفًّا فارغًا عند استدعائه بلا وسائط، ويحوّل سلسلة مثل lupins إلى صف من محارفها.',
        en: 'Fill the blank with one word: the built-in ____ creates an empty tuple when called with no arguments, and converts a string like lupins into a tuple of its characters.',
      },
      answer: 'tuple',
      solution: 'tuple',
      hints: [
        { ar: 'ثلاثة استدعاءات في الدرس: بلا وسائط، وعلى سلسلة، وعلى قائمة.', en: 'Three calls appear in the lesson: no arguments, on a string, on a list.' },
        { ar: 'هو نفسه اسم النوع الذي يجيب عنه type.', en: 'It is the same name type answers with.' },
        { ar: 'اسمه خمسة أحرف ويبدأ بـ t.', en: 'It is five letters long and starts with t.' },
        { ar: 'الجواب: tuple', en: 'Answer: tuple' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — الصفوف تحت المجهر\n# Your playground — tuples under the microscope\n\nempty = tuple()\nprint(empty)\nprint(type(empty))\n\nsingle = ("a",)\nprint(single)\nprint(type(single))\n\nword = tuple("lupins")\nprint(word)\nprint(word[1])\nprint(word[-1])',
      prompt: {
        ar: "جرّب بنفسك: صفًّا فارغًا، وصفًّا بعنصر واحد، وصفًّا من سلسلة. ثم افحص الفهرسة السالبة من الفصل السادس على الصف. وأخيرًا — بحذر — اكتب word[0] = 'x' وشغّل لتقرأ رسالة TypeError بعينيك. لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: an empty tuple, a one-element tuple, a tuple from a string. Then test chapter-6 negative indexing on the tuple. Finally — carefully — write word[0] = 'x' and run it to read the TypeError with your own eyes. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الفرق الأهم بين الصف والقائمة؟',
            en: 'What is the most important difference between a tuple and a list?',
          },
          options: [
            { id: 'a', text: { ar: 'الصف غير قابل للتعديل بعد إنشائه والقائمة قابلة', en: 'The tuple is immutable after creation while the list is mutable' } },
            { id: 'b', text: { ar: 'الصف لا يدعم الفهرسة والقائمة تدعمها', en: 'The tuple does not support indexing while the list does' } },
            { id: 'c', text: { ar: 'الصف يحفظ أنواعًا واحدة فقط والقائمة تخلط الأنواع', en: 'The tuple holds only one type while the list mixes types' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفهرسة والتجزئة وlen تعمل على الاثنين؛ الخلاف كله في الثبات: الصف مجمد والقائمة حية — ومن هذا الجمد يأتي قابل المقارنة وقابل الهاش.',
            en: 'Indexing, slicing and len work on both; the dispute is all about permanence: the tuple is frozen and the list alive — and from that freezing come comparability and hashability.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السادس: السلاسل تشترك مع الصفوف في صفة واحدة — أيها؟',
            en: 'From chapter 6: strings share one property with tuples — which one?',
          },
          options: [
            { id: 'a', text: { ar: 'كلاهما غير قابل للتعديل — محاولة التغيير ترمي TypeError', en: 'Both are immutable — a change attempt throws TypeError' } },
            { id: 'b', text: { ar: 'كلاهما قابل للتعديل حرفًا حرفًا', en: 'Both can be edited character by character' } },
            { id: 'c', text: { ar: 'كلاهما لا يدعم التجزئة بالفواصل المنقوطة', en: 'Neither supports slicing with colons' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'greeting[0] = "J" في الفصل السادس وt[0] = "A" اليوم — الرسالتان من العائلة نفسها: object does not support item assignment، والبديل دائمًا بناء سلسلة جديدة.',
            en: 'greeting[0] = "J" in chapter 6 and t[0] = "A" today — the two messages are siblings: object does not support item assignment, and the fix is always building a new sequence.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'كيف تنشئ صفًّا من عنصر واحد يحوي العدد 42؟',
            en: 'How do you create a one-element tuple holding the number 42?',
          },
          options: [
            { id: 'a', text: { ar: '(42,) — فاصلة بعد القيمة', en: '(42,) — a comma after the value' } },
            { id: 'b', text: { ar: '(42) — القوسان يكفيان', en: '(42) — the parentheses are enough' } },
            { id: 'c', text: { ar: 'tuple[42] — بأقواس مربعة', en: 'tuple[42] — with square brackets' } },
          ],
          answer: 'a',
          explanation: {
            ar: '(42) مجرد تعبير حسابي في قوس تجميع قيمته 42. الفاصلة وحدها ترفع القيمة إلى صف: (42,) صف من عنصر واحد.',
            en: '(42) is just an arithmetic expression inside grouping brackets, worth 42. Only the comma lifts the value into a tuple: (42,) is a one-element tuple.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل التاسع: عناصر القاموس تخرج بترتيب الإدراج لا ترتيب مرغوب — فأي ميزة في الصفوف ستعيد لنا الترتيب في هذا الفصل؟',
            en: 'From chapter 9: dictionary items come out in insertion order, not a chosen order — which tuple feature will restore ordering for us in this chapter?',
          },
          options: [
            { id: 'a', text: { ar: 'الصفوف قابلة للمقارنة — فتحويل عناصر القاموس إلى قائمة صفوف يجعل الترتيب ممكنًا', en: 'Tuples are comparable — converting dictionary items into a list of tuples makes sorting possible' } },
            { id: 'b', text: { ar: 'الصفوف أسرع في الحساب فتستبدل القواميس كليًّا', en: 'Tuples compute faster, replacing dictionaries entirely' } },
            { id: 'c', text: { ar: 'الصفوف تحذف المفاتيح المكررة تلقائيًا', en: 'Tuples automatically remove duplicate keys' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'items في الدرس القادم يصبّ القاموس في قائمة صفوف، وsort يرتّب الصفوف — وهذه هي الجسر الذي يعبره الفصل كله نحو لوحة الكلمات الأكثر تكرارًا.',
            en: 'In the next lesson items pours the dictionary into a list of tuples, and sort orders them — that is the bridge this whole chapter crosses toward the most-common-words leaderboard.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 't = ("a")',
          right: 't = ("a",)',
          note: {
            ar: 'قوس بلا فاصلة يمنحك سلسلة لا صفًّا — type سيكشفها <class \'str\'>. الفاصلة هي التي تصنع الصف مهما صغر حجمه.',
            en: 'A parenthesis without a comma gives you a string, not a tuple — type will expose <class \'str\'>. The comma makes the tuple, however small it is.',
          },
        },
        {
          wrong: "t = ('a', 'b')\nt[0] = 'A'",
          right: "t = ('a', 'b')\nt = ('A',) + t[1:]",
          note: {
            ar: 'التعديل المباشر يرمي TypeError: \'tuple\' object does not support item assignment. ابنِ صفًّا جديدًا باللحام: صف العنصر البديل (بفاصلته) + باقي الصف بالتجزئة.',
            en: "Direct assignment throws TypeError: 'tuple' object does not support item assignment. Weld a new tuple instead: the replacement element as a one-tuple (with its comma) plus the rest via slicing.",
          },
        },
        {
          wrong: "tuple = (1, 2)\nprint(tuple('lupins'))",
          right: "t = (1, 2)\nprint(tuple('lupins'))",
          note: {
            ar: 'سرد tuple اسمًا لمتغير يطمس التابع الجاهز — الاستدعاء التالي يرمي TypeError: \'tuple\' object is not callable. حافظ على أسماء التوابع الجاهزة منزوعة.',
            en: "Rebinding tuple as a variable buries the built-in — the next call throws TypeError: 'tuple' object is not callable. Keep built-in function names unclaimed.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الصف سلسلة قيم كالقائمة: الفهرسة والتجزئة وlen تعمل عليه، لكنه غير قابل للتعديل بعد إنشائه.', en: 'A tuple is a sequence of values like a list: indexing, slicing and len all work — but it is immutable once created.' },
        { ar: "فخّا الصف: العنصر الواحد يحتاج فاصلة (('a',))، والصف الفارغ هو tuple() بلا فاصلة.", en: "The two tuple traps: a single element needs a comma (('a',)), and the empty tuple is tuple() with no comma." },
        { ar: 'الثبات ليس عيبًا: الصف قابل للمقارنة وقابل للهاش — وأساس ترتيب الأزواج واستخدامه مفتاحًا في القواميس في دروس هذا الفصل.', en: 'Immutability is not a flaw: tuples are comparable and hashable — the foundation for sorting pairs and using them as dictionary keys in this chapter\u2019s lessons.' },
      ],
      reflectPrompt: {
        ar: 'فكّر في ثلاث قطع بيانات لا ينبغي أن تتغير بعد إنشائها — تاريخ ميلادك، إحداثيات بيت طفولتك، نتيجة مباراة انتهت. أيّها تختار تمثيله صفًّا، وأيها قد يضطر للتعديل فيصير قائمة؟',
        en: 'Think of three pieces of data that should never change once created — your birth date, the coordinates of your childhood home, a finished match\u2019s score. Which would you represent as a tuple, and which might force an edit and become a list?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch10.s1', pages: 'ص157 / pp.157' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch10.s1', pages: 'ص157 / pp.157' },
  ],
} satisfies Lesson;

export default lesson;
