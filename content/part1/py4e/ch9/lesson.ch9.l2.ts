import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch9.l2 — "Counting with Dictionaries / العدّ بالقواميس"
 * Aligned with PY4E ch9 s2 (العدّ), book p.145.
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch9.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 9,
  title: { ar: 'العدّ بالقواميس', en: 'Counting with Dictionaries' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch9.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كم مرة تكرر حرف o في كلمة؟ كم مرة ذُكر اسم عميل في سجل؟ العدّ بالمتغيرات المفردة يطلب أن تعرف كل ما ستعدّه قبل أن تبدأ — والقاموس يكسر هذا القيد: يفتح عدّادًا جديدًا لحظة ظهور شيء جديد لأول مرة. بنهاية الدرس ستكون قادرًا على: حل مسألة العد بثلاثة تطبيقات مقارنة، وكتابة عدّاد القاموس بصيغة if/in/else، وتسمية ناتجه بالهيستوغرام، واختصار أربعة أسطر بسطر واحد بـ get.',
        en: 'How often does the letter o repeat in a word? How often is a client named in a log? Counting with lone variables requires knowing everything you will count before you start — the dictionary breaks that constraint: it opens a new counter the moment something new shows up for the first time. By the end of this lesson you will be able to: solve the counting problem with three comparable implementations, write the dictionary counter with if/in/else, name its output a histogram, and shrink four lines into one with get.',
      },
    },
    {
      kind: 'predict',
      code: "counts = {'chuck': 1, 'annie': 42}\nprint(counts.get('annie', 0))\nprint(counts.get('tim', 0))",
      question: {
        ar: 'ماذا يطبع السطران؟ الوسيط الثاني لـ get جديد عليك.',
        en: 'What do the two lines print? The second argument of get is new to you.',
      },
      reveal: {
        ar: 'يطبع 42 ثم 0. التابع get يطلب مفتاحًا وقيمة افتراضية: إن وُجد المفتاح أعاد قيمته في القاموس (42)، وإن غاب أعاد الافتراضية (0) بدل أن يرمي KeyError. التخمين الجيد كان: get سؤال أمان.',
        en: 'It prints 42, then 0. The get method takes a key and a default: if the key exists it returns its value in the dictionary (42), and if it is absent it returns the default (0) instead of throwing KeyError. A good guess was: get is a safety question.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'مشكلة العدّ وثلاثة تطبيقات', en: 'The counting problem and three implementations' },
      chunks: [
        {
          ar: "افترض نصًا وتريد تكرار كل حرف فيه. توجد طرق عدة: الأولى إنشاء 26 متغيرًا — واحد لكل حرف إنكليزي — وسلسلة عبارات شرطية تزيد المتغير المناسب. الثانية قائمة من 26 عنصرًا نحوّل كل محرف إلى رقم بـ ord لنستخدمه فهرسًا ونزيد عدّاده. الثالثة قاموس: الأحرف مفاتيح وعدّاداتها قيم. كل طريقة تطبيق (implementation) — أسلوب لحل المسألة — وبعضها أفضل من غيره.",
          en: "Suppose a text and you want the count of every letter in it. Several roads exist: the first creates 26 variables — one per English letter — and a chain of conditionals incrementing the matching variable. The second is a 26-element list where each character converts to a number with ord to use as an index for its counter. The third is a dictionary: letters as keys and their counters as values. Each road is an implementation — a way of solving the problem — and some are better than others.",
        },
        {
          ar: "ميزة التطبيق بالقاموس أنك لا تحتاج معرفة الأحرف التي ستظهر مسبقًا: نخصص للعنصر مكانًا بعد ظهوره أول مرة. ولو غيّرت المسألة غدًا إلى عدّ الكلمات بدل الأحرف لاحتجت مع 26 متغيرًا بنية جديدة كاملة — أما القاموس نفسه فيكفي لأي عدد من المفاتيح بلا تعديل.",
          en: 'The advantage of the dictionary implementation is that you do not need to know the letters that will appear in advance: we give an item its place after its first appearance. And if the problem changed tomorrow to counting words instead of letters, the 26 variables would need a whole new structure — while the same dictionary serves any number of keys without modification.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الهيستوغرام: عدّاد يولد عند الحاجة', en: 'The histogram: a counter born on demand' },
      chunks: [
        {
          ar: "برنامج العد الكلاسيكي:\nword = 'brontosaurus'\nd = dict()\nfor c in word:\n    if c not in d:\n        d[c] = 1\n    else:\n        d[c] = d[c] + 1\nprint(d)\nالحلقة تمر على محارف النص، وكل مرة لا نجدها في القاموس ننشئ عنصرًا جديدًا مفتاحه المحرف وقيمته الابتدائية 1، وإذا كان المفتاح موجودًا مكتفينا بزيادة قيمته.",
          en: "The classic counting program:\nword = 'brontosaurus'\nd = dict()\nfor c in word:\n    if c not in d:\n        d[c] = 1\n    else:\n        d[c] = d[c] + 1\nprint(d)\nThe loop walks the characters of the text; every time a character is not in the dictionary we create a new item with the character as key and 1 as initial value, and if the key already exists we just bump its value.",
        },
        {
          ar: 'بهذا حسبنا علميًا هيستوغرامًا (histogram) — مصطلح إحصائي يعني مجموعة عدّادات لتكرارات العناصر. الخرج يقرأ: a وb ظهرا مرة واحدة، وo وس تكررا مرتين... وانتبه إلى نقطة الانكسار في البرنامج: أول ظهور ينشئ العنصر، وكل ظهور لاحق يزيد فقط.',
          en: 'With this we have scientifically computed a histogram — a statistical term for a set of counters of element frequencies. The output reads: a and b appeared once, and o and s repeated twice... Note the breaking point of the program: a first appearance creates the item, and every later appearance only increments.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'get: أربعة أسطر في سطر واحد', en: 'get: four lines in one' },
      chunks: [
        {
          ar: "للقواميس تابع اسمه get يطلب معاملين: المفتاح وقيمة افتراضية يعيدها إن لم يوجد المفتاح، وإلا أعاد القيمة الموافقة الموجودة. counts = {'chuck': 1, 'annie': 42, 'jan': 100} فprint(counts.get('jan', 0)) تعطي 100 وprint(counts.get('tim', 0)) تعطي 0 — يحل مشكلة المفتاح الغائب تلقائيًا بلا if.",
          en: "Dictionaries own a method named get taking two arguments: the key and a default returned when the key is absent, otherwise it returns the matching stored value. counts = {'chuck': 1, 'annie': 42, 'jan': 100}, so print(counts.get('jan', 0)) gives 100 and print(counts.get('tim', 0)) gives 0 — it solves the missing-key problem automatically with no if.",
        },
        {
          ar: "بهذا نكتب برنامجنا بأسلوب مختصر: d[c] = d.get(c, 0) + 1 — بلا if وبلا else: أربعة أسطر صارت سطرًا واحدًا. هذا الأسلوب شائع في بايثون وسنستعمله كثيرًا في بقية الكتاب؛ قارن بين الأسلوبين على المثال نفسه: كلاهما ينتج الهيستوغرام ذاته، والطويل أوضح للمبتدئ والأقصر أنيق للمحترف.",
          en: "With it we write our program in a compact style: d[c] = d.get(c, 0) + 1 — no if, no else: four lines became one. This idiom is common in Python and we will use it repeatedly for the rest of the book; compare both styles on the same example: both produce the very same histogram, the long one is clearer for a beginner and the short one elegant for a professional.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الهيستوغرام بطريقة get', en: 'The histogram, the get way' },
      code: "word = 'brontosaurus'\nd = dict()\nfor c in word:\n    d[c] = d.get(c, 0) + 1\nprint(d)\nprint(len(d))",
      explanation: {
        ar: "ثمانية محارف مختلفة في الكلمة، فأجاب len بـ 8. الطباعة تعرض الأزواج: b مرة، وr مرتين، وo مرتين... ولاحظ أن الترتيب ليس جزءًا من المعنى — الجواب هو الأزواج لا مواقعها. وسطر الحساب الوحيد يقرأ العدد الحالي أو 0 في أول ظهور ثم يخزن الزيادة.",
        en: "Eight different characters live in the word, so len answered 8. The printing shows the pairs: b once, r twice, o twice... and notice order is not part of the meaning — the answer is the pairs, not their positions. And the single counting line reads the current count or 0 on first appearance, then stores the increment.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.count-mississippi',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "النص word = 'mississippi' معطى في المحرر. عدّ تكرار كل محرف في قاموس counts باستخدام حلقة for وبطريقة counts[c] = counts.get(c, 0) + 1. ثم اطبع counts['s'] وcounts['i'] وlen(counts). المتوقع: 4 ثم 4 ثم 4.",
        en: "The text word = 'mississippi' is given in the editor. Count every character into a dictionary counts using a for loop and the idiom counts[c] = counts.get(c, 0) + 1. Then print counts['s'], counts['i'] and len(counts). Expected: 4, then 4, then 4.",
      },
      starterCode: "word = 'mississippi'\ncounts = dict()\n# حلقة for على محارف word، وكل محرف يزيد عدّاده بطريقة get / loop over the characters of word, increment with get\n# ثم اطبع counts['s'] وcounts['i'] وlen(counts) / then print counts['s'], counts['i'] and len(counts)\n",
      solution: "word = 'mississippi'\ncounts = dict()\nfor c in word:\n    counts[c] = counts.get(c, 0) + 1\nprint(counts['s'])\nprint(counts['i'])\nprint(len(counts))",
      tests: [
        {
          id: 't1',
          name: { ar: 'حرف s عُدّ أربع مرات', en: 'Letter s counted 4 times' },
          code: "assert counts['s'] == 4, 'expected: 4 | actual: %r' % counts['s']",
          expected: '4',
        },
        {
          id: 't2',
          name: { ar: 'حرف i عُدّ أربع مرات', en: 'Letter i counted 4 times' },
          code: "assert counts['i'] == 4, 'expected: 4 | actual: %r' % counts['i']",
          expected: '4',
        },
        {
          id: 't3',
          name: { ar: 'حرف p عُدّ مرتين', en: 'Letter p counted 2 times' },
          code: "assert counts['p'] == 2, 'expected: 2 | actual: %r' % counts['p']",
          expected: '2',
        },
        {
          id: 't4',
          name: { ar: 'أربعة محارف مختلفة فقط', en: 'Exactly four different characters' },
          code: "assert len(counts) == 4, 'expected: 4 | actual: %r' % len(counts)",
          expected: '4',
        },
      ],
      hints: [
        { ar: 'حلقة for على النص تمر محرفًا محرفًا — من دروس المرور على السلاسل.', en: 'A for loop over the string walks character by character — from the string traversal lessons.' },
        { ar: 'سطر العد الواحد يكفي داخل الحلقة: counts[c] = counts.get(c, 0) + 1.', en: 'One counting line suffices inside the loop: counts[c] = counts.get(c, 0) + 1.' },
        { ar: 'الهيكل:\nfor c in word:\n    counts[c] = counts.get(c, 0) + 1\nprint(counts[\'s\'])\nprint(counts[\'i\'])\nprint(len(counts))', en: "The skeleton:\nfor c in word:\n    counts[c] = counts.get(c, 0) + 1\nprint(counts['s'])\nprint(counts['i'])\nprint(len(counts))" },
        { ar: "mississippi فيها m مرة وi أربعًا وs أربعًا وp مرتين — أربعة مفاتيح في القاموس.", en: 'mississippi holds m once, i four times, s four times, p twice — four keys in the dictionary.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-get',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "d = {'x': 5}\nprint(d.get('x', 0))\nprint(d.get('y', 0))\nd['y'] = d.get('y', 0) + 1\nprint(d['y'])",
      solution: '5\n0\n1',
      answer: '5\n0\n1',
      hints: [
        { ar: 'الاستدعاء الأول: المفتاح x موجود فأعاد get قيمته.', en: 'The first call: key x exists, so get returned its value.' },
        { ar: 'الاستدعاء الثاني: المفتاح y غائب فأعاد get الافتراضية.', en: 'The second call: key y is absent, so get returned the default.' },
        { ar: 'الإسناد الثاني قرأ الافتراضية 0 وزاد واحدًا ثم خزّن.', en: 'The second assignment read the default 0, added one, then stored.' },
        { ar: 'الخرْج:\n5\n0\n1', en: 'The output:\n5\n0\n1' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-implementation',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يُعد التطبيق بالقاموس الأنسب لعدّ الأحرف مقارنة بـ 26 متغيرًا؟',
        en: 'Why is the dictionary implementation the best fit for counting letters compared with 26 variables?',
      },
      options: [
        { id: 'a', text: { ar: 'لأنه لا يطلب معرفة الأحرف التي ستظهر مسبقًا — يفتح عدّادًا عند أول ظهور', en: 'It does not require knowing the letters in advance — it opens a counter at first appearance' } },
        { id: 'b', text: { ar: 'لأن 26 متغيرًا ممنوعة في بايثون', en: 'Because 26 variables are forbidden in Python' } },
        { id: 'c', text: { ar: 'لأنه يطبع النتائج مرتبة أبجديًا دائمًا', en: 'Because it always prints results alphabetically sorted' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تخيّل مسألة عدّ الكلمات بدل الأحرف — كم متغيرًا ستحتاج؟', en: 'Imagine counting words instead of letters — how many variables would you need?' },
        { ar: 'القاموس ينشئ العنصر لحظة الحاجة لا قبل البرنامج.', en: 'The dictionary creates an item at the moment of need, not before the program runs.' },
        { ar: 'والطباعة بلا ترتيب مضمون — كما تعلم من الدرس الماضي.', en: 'And printing has no guaranteed order — as you learned last lesson.' },
        { ar: 'الجواب: أ — القاموس يخصص مكان العنصر بعد ظهوره، فأي مفاتيح جديدة مقبولة.', en: 'Answer: a — the dictionary reserves the item place after it appears, so any new keys are welcome.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-banana',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل: نفّذنا حلقة العد d[c] = d.get(c, 0) + 1 على النص 'banana'. كم يطبع print(len(d))؟",
        en: "Without running: we executed the counting loop d[c] = d.get(c, 0) + 1 over the text 'banana'. What does print(len(d)) show?",
      },
      answer: '3',
      solution: '3',
      tolerance: 0,
      hints: [
        { ar: 'len(d) يعيد عدد المفاتيح — أي عدد المحارف المختلفة.', en: 'len(d) returns the number of keys — that is, the number of different characters.' },
        { ar: 'اكتب الكلمة وحدد المحارف الفريدة فيها.', en: 'Write the word out and spot its unique characters.' },
        { ar: 'المحارف الفريدة: b وa وn — أي مناظر مكررة تعدّ مرة واحدة.', en: 'The unique characters: b, a, n — any repeated twins count once.' },
        { ar: 'الجواب: 3', en: 'Answer: 3' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — عدّاداتك\n# Your playground — your own counters\n\ntext = 'abracadabra'\nhist = dict()\nfor ch in text:\n    hist[ch] = hist.get(ch, 0) + 1\nprint(hist)\nprint('a:', hist.get('a', 0))\nprint('z:', hist.get('z', 0))",
      prompt: {
        ar: 'جرّب: غيّر النص وعدّ من جديد، ثم أعد العد بالأسلوب الطويل if not in / else وقارن الخرجين، وجرّب get بمفتاح غير موجود. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: change the text and count again, then recount with the long if not in / else style and compare outputs, and try get with a missing key. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: "ومن الفصل السادس: الحلقة for ch in 'hi': — كم دورة تنفّذ وماذا يأخذ ch؟",
            en: "From chapter 6: the loop for ch in 'hi': — how many passes run and what does ch take?",
          },
          options: [
            { id: 'a', text: { ar: 'دورتان — ch يأخذ محرفًا في كل دورة', en: 'Two passes — ch takes one character per pass' } },
            { id: 'b', text: { ar: 'دورة واحدة — ch يأخذ النص كله', en: 'One pass — ch takes the whole string' } },
            { id: 'c', text: { ar: 'ثلاث دورات — فالنص يحمل محرفي حروف ومحرف مسافة', en: 'Three passes — the string holds two letters and a space' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المرور على السلاسل من الفصل السادس: دورة لكل محرف — وهذا هو المتعدّد الذي بنينا عليه هيستوغرام اليوم.',
            en: 'String traversal from chapter 6: one pass per character — exactly the iterable we built today’s histogram on.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: "counts.get('tim', 0) عندما لا يوجد tim — ماذا تعيد ولماذا؟",
            en: "counts.get('tim', 0) when tim is absent — what does it return and why?",
          },
          options: [
            { id: 'a', text: { ar: 'القيمة الافتراضية 0 بدل أن يرمي KeyError', en: 'The default 0 instead of throwing KeyError' } },
            { id: 'b', text: { ar: 'لا شيء — البرنامج يتوقف بخطأ', en: 'Nothing — the program halts with an error' } },
            { id: 'c', text: { ar: 'قيمة أول مفتاح في القاموس', en: 'The value of the first key in the dictionary' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'get وسيطه الثاني قيمة الاحتياط: يجيب بها إن غاب المفتاح — لذلك اختصرنا if وelse الأربعة بسطر واحد.',
            en: 'get’s second argument is the fallback: it answers with it when the key is missing — that is how four lines of if and else collapsed into one.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'الهيستوغرام — في سياق برمجتنا — هو:',
            en: 'A histogram — in the context of our program — is:',
          },
          options: [
            { id: 'a', text: { ar: 'مجموعة عدّادات لتكرارات العناصر', en: 'A set of counters for element frequencies' } },
            { id: 'b', text: { ar: 'نوع جديد من الحلقات المتداخلة', en: 'A new kind of nested loop' } },
            { id: 'c', text: { ar: 'تابع جاهز يرتب القوائم', en: 'A built-in function that sorts lists' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الهيستوغرام مصطلح إحصائي دخل بايثون عبر القاموس: المفاتيح الأشياء المعدودة والقيم عدّاداتها.',
            en: 'A statistical term that entered our Python through the dictionary: keys are the counted things and values are their counters.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثاني: d[c] = d.get(c, 0) + 1 — ماذا يفعل الرمز = هنا بالضبط؟',
            en: 'From chapter 2: d[c] = d.get(c, 0) + 1 — what exactly does the = sign do here?',
          },
          options: [
            { id: 'a', text: { ar: 'إسناد: يحسب الطرف الأيمن أولًا ثم يخزن الناتج في المفتاح c', en: 'Assignment: it computes the right side first, then stores the result at key c' } },
            { id: 'b', text: { ar: 'مقارنة تسأل هل القيمة القديمة تساوي الجديدة', en: 'A comparison asking whether the old value equals the new' } },
            { id: 'c', text: { ar: 'يحذف المفتاح القديم قبل الكتابة', en: 'It deletes the old key before writing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قاعدة التحديث من الفصل الثاني: اقرأ ثم احسب ثم خزّن — d[c] = قيمة-قديمة-أو-صفر زائد واحد.',
            en: 'The chapter-2 update rule: read, then compute, then store — d[c] = old-value-or-zero plus one.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'for c in word:\n    d[c] = d[c] + 1',
          right: 'for c in word:\n    d[c] = d.get(c, 0) + 1',
          note: {
            ar: 'في أول ظهور للحرف لا يوجد المفتاح بعد، فيرمي d[c] + 1 خطأ KeyError. الافتراضية 0 في get تحمي أول ظهور.',
            en: 'On a letter’s first appearance the key does not exist yet, so d[c] + 1 throws KeyError. The default 0 in get guards the first appearance.',
          },
        },
        {
          wrong: 'if c not in d:\n    d[c] = 1\nd[c] = d[c] + 1',
          right: 'if c not in d:\n    d[c] = 1\nelse:\n    d[c] = d[c] + 1',
          note: {
            ar: 'نسيان else جعل أول ظهور يُنشأ بقيمة 1 ثم يُزاد فورًا في نفس الدورة — كل العدادات تصير أكبر من الصحيح بواحد. الزيادة تخص الظهور الثاني فما بعده.',
            en: 'Forgetting else made the first appearance born with 1 then immediately bumped in the same pass — every counter ends one larger than the truth. The increment belongs to the second appearance onward.',
          },
        },
        {
          wrong: 'd[c] = d.get(c) + 1',
          right: 'd[c] = d.get(c, 0) + 1',
          note: {
            ar: 'بلا وسيط افتراضي يعيد get قيمة None — وNone + 1 يرمي TypeError. الافتراضية 0 ليست ترفًا بل قلب العدّ.',
            en: 'Without a default argument get returns None — and None + 1 throws a TypeError. The default 0 is not a luxury; it is the heart of counting.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'العد بالقاموس: المفتاح هو الشيء المعدود والقيمة عدّاده — ولا حاجة لمعرفة المفاتيح مسبقًا.', en: 'Counting with a dictionary: the key is the counted thing and the value is its counter — with no need to know the keys in advance.' },
        { ar: 'الصيغة الطويلة if not in / else تنشئ عند أول ظهور وتزيد لاحقًا — والناتج هوستوغرام: مجموعة عدّادات.', en: 'The long form if not in / else creates on first appearance and increments later — and the output is a histogram: a set of counters.' },
        { ar: 'get(key, default) تعيد قيمة المفتاح أو الافتراضية، وتختصر العد إلى سطر: d[c] = d.get(c, 0) + 1.', en: 'get(key, default) returns the key’s value or the default, and compresses counting into one line: d[c] = d.get(c, 0) + 1.' },
      ],
      reflectPrompt: {
        ar: 'فكّر في ثلاثة أشياء تعدّها يوميًا (كلمات في مقال، رسائل لكل مرسل، علامات في سجل) وصُغ عدّاد قاموس لكل منها: ما مفاتيحه؟ وماذا يحدث في أول ظهور؟',
        en: 'Think of three things you count daily (words in an article, messages per sender, marks in a log) and shape a dictionary counter for each: what are its keys? And what happens on a first appearance?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch9.s2', pages: 'ص145 / pp.145' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch9.s2', pages: 'ص145 / pp.145' },
  ],
} satisfies Lesson;

export default lesson;
