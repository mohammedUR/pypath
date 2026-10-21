import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch10.l4 — "Dictionaries and Tuples / القواميس والصفوف"
 * Aligned with PY4E ch10 s4 (القواميس والصفوف) + s5 (الإسناد المتعدد مع القواميس).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch10.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 10,
  title: { ar: 'القواميس والصفوف', en: 'Dictionaries and Tuples' },
  estimatedMinutes: 17,
  prerequisites: ['py4e.ch10.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قاموس الفصل التاسع عدّاد ذكي لكنه فوضوي: عناصره تخرج بترتيب الإدراج والقيم تتصدر بأشواكها. اليوم نبني الجسر: items يصبّ القاموس في قائمة صفوف (مفتاح، قيمة) — والصفوف كما تعرف قابلة للترتيب. ومفاجأة الحلقة: for key, val in d.items() تفكك كل زوج في متغيرين في كل دورة. بنهاية الدرس ستكون قادرًا على: استخراج الأزواج وترتيبها بالمفتاح، والمرور على القاموس بزوجين في الدورة، وعكس الصفوف لتترتب بالقيمة.',
        en: 'The chapter-9 dictionary is a clever counter but a messy one: its items emerge in insertion order with values jostling unranked. Today we build the bridge: items pours the dictionary into a list of (key, value) tuples — and tuples, as you know, can be sorted. And the loop\u2019s surprise: for key, val in d.items() unpacks every pair into two variables each pass. By the end of this lesson you will be able to: extract pairs and sort them by key, walk a dictionary two variables per pass, and invert the tuples so they sort by value.',
      },
    },
    {
      kind: 'predict',
      code: "d = {'a': 10, 'b': 1, 'c': 22}\nt = list(d.items())\nt.sort()\nprint(t)",
      question: {
        ar: 'items أعاد ماذا بالضبط؟ وبعد sort — بأي ترتيب ستخرج الأزواج: بقيمها أم بمفاتيحها؟',
        en: 'What exactly did items return? And after sort — in what order do the pairs emerge: by their values or by their keys?',
      },
      reveal: {
        ar: "يطبع [('a', 10), ('b', 1), ('c', 22)] — أزواج (مفتاح، قيمة) مرتبة أبجديًا بالمفتاح. القاموس وحده لا يعرف ترتيبًا مختارًا، لكن قائمته من الصفوف تعرف: كل صف قابل للمقارنة والعنصر الأول — المفتاح — هو الحاكم.",
        en: 'It prints [(\'a\', 10), (\'b\', 1), (\'c\', 22)] — (key, value) pairs ordered alphabetically by key. The dictionary alone knows no chosen order, but its list of tuples does: every tuple is comparable and the first element — the key — governs.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'items: من قاموس إلى قائمة صفوف', en: 'items: from dictionary to list of tuples' },
      chunks: [
        {
          ar: "التابع items يُستدعى على القاموس ويعيد قائمة من الصفوف، كل صف زوج (مفتاح، قيمة): d = {'a': 10, 'b': 1, 'c': 22} ثم t = list(d.items()) فتصير t قائمة صفوف. وأزواج القاموس نفسها بلا ترتيب مختار — لكن القائمة الناتجة قابلة للترتيب لأن الصفوف قابلة للمقارنة. t.sort() يرتبها فيصير التسلسل أبجديًا: a ثم b ثم c.",
          en: "The items method is called on the dictionary and returns a list of tuples, each tuple a (key, value) pair: d = {'a': 10, 'b': 1, 'c': 22} then t = list(d.items()) leaves t a list of tuples. The dictionary\u2019s own pairs carry no chosen order — but the resulting list can be sorted because tuples are comparable. t.sort() reorders it alphabetically: a, then b, then c.",
        },
        {
          ar: 'هذه هي الطريقة القياسية لفرض نظام على قاموس: حوّله إلى قائمة صفوف، رتّب، ثم استعمل القائمة. وانتبه أن القاموس الأصلي لم يتغير — items أعطاك نسخة قابلة للترتيب لا قاموسًا معادًا ترتيبًا.',
          en: 'This is the standard way to impose order on a dictionary: convert it to a list of tuples, sort, then work with the list. And note the original dictionary never changed — items handed you a sortable copy, not a reordered dictionary.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الإسناد المتعدد مع القواميس', en: 'Multiple assignment with dictionaries' },
      chunks: [
        {
          ar: 'اجمع items مع إسناد الصفوف وحلقة for فتحصل على النمط الذهبي: for key, val in d.items(): print(val, key). حلقة بمتغيرَي تكرار: items تعيد قائمة صفوف، وكل صف يتفكك في كل دورة إلى key وval — كأن كل دورة تنفذ key, val = الزوج. وبذلك تمشي على المفاتيح والقيم معًا دون فهرسة.',
          en: 'Combine items with tuple assignment and a for loop and you get the golden pattern: for key, val in d.items(): print(val, key). A loop with two iteration variables: items returns a list of tuples, and each tuple unpacks into key and val every pass — as if each pass ran key, val = pair. This walks keys and values together with no indexing.',
        },
        {
          ar: 'انتبه لموقع كل طرف: items يمر على الأزواج (مفتاح، قيمة). فلو كتبت for val, key in d.items() لتبادلت الأسماء وتطبع القيمة مكان المفتاح. ولو كتبت for key, val in d فقط — بلا items — لضاق التفكيك في المفاتيح وحدها وصرخ ValueError.',
          en: 'Mind each side\u2019s position: items walks (key, value) pairs. Write for val, key in d.items() and the names swap, printing the value where the key belongs. Write for key, val in d — without items — and the unpacking narrows to keys alone, screaming ValueError.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'القاموس المعكوس: الترتيب بالقيمة', en: 'The inverted dictionary: sorting by value' },
      chunks: [
        {
          ar: 'لكننا نريد غالبًا الترتيب بحسب القيمة — عدد التكرارات — لا بحسب المفتاح. الحل: بناء قائمة صفوف معكوسة (قيمة، مفتاح): حلقة for key, val in d.items(): l.append((val, key)) ثم l.sort(reverse=True) فتتصدر القائمة أعلى قيمة. الحيلة من الدرس الماضي بأغراض جديدة: من قاموس إلى صفوف معكوسة إلى ترتيب تنازلي — وبها سيُبنى أشهر برنامج في هذا الفصل بعد درسين.',
          en: 'But usually we want to sort by value — the repetition count — not by key. The fix: build an inverted list of (value, key) tuples: a loop for key, val in d.items(): l.append((val, key)), then l.sort(reverse=True) leads the list with the highest value. Yesterday\u2019s trick, new purposes: dictionary to inverted tuples to descending order — the pattern behind this chapter\u2019s most famous program two lessons ahead.',
        },
        {
          ar: 'القيمة تتقدم الصف لأن sort يقارن بالعنصر الأول أولًا — درس أمس حرفيًا. وعند تكافؤ القيم يحسم المفتاح الأبجدي الترتيب — سترى هذا العمل بيدك في لوحة صدارة الدرس الخامس.',
          en: 'The value leads the tuple because sort compares the first element first — last lesson verbatim. And on equal values the alphabetical key settles the order — you will watch it work in the leaderboard two lessons ahead.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مرور مضاعف ثم قائمة معكوسة', en: 'A double pass, then an inverted list' },
      code: "d = {'a': 10, 'b': 1, 'c': 22}\nfor key, val in d.items():\n    print(val, key)\nl = list()\nfor key, val in d.items():\n    l.append((val, key))\nl.sort(reverse=True)\nprint(l)",
      explanation: {
        ar: "الحلقة الأولى تفكك كل زوج فتطبع القيمة قبل المفتاح: 10 a ثم 1 b ثم 22 c — بترتيب الإدراج a ثم b ثم c. ثم بنينا القائمة المعكوسة (10, 'a') و(1, 'b') و(22, 'c') ورتبناها تنازليًا فصارت [(22, 'c'), (10, 'a'), (1, 'b')] — القيمة في مقدمة كل صف فحاكمت الترتيب، والمفتاح حَكَم عند التكافؤ.",
        en: "The first loop unpacks each pair, printing the value before the key: 10 a, then 1 b, then 22 c — in insertion order a, b, c. Then we built the inverted tuples (10, 'a'), (1, 'b'), (22, 'c') and sorted descending into [(22, 'c'), (10, 'a'), (1, 'b')] — the value rules the ranking and the key judges ties.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.invert-sort',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'القاموس معطى في المحرر: scores = {"omar": 12, "lina": 20, "ahmed": 15}. أنشئ قائمة lst واملأها بحلقة for على scores.items() بصفوف (القيمة، المفتاح)، ثم رتّبها تنازليًا بـ sort(reverse=True)، ثم اطبع lst. المتوقع: [(20, \'lina\'), (15, \'ahmed\'), (12, \'omar\')].',
        en: 'The dictionary is given in the editor: scores = {"omar": 12, "lina": 20, "ahmed": 15}. Create a list lst and fill it with a for loop over scores.items() building (value, key) tuples, sort it descending with sort(reverse=True), then print lst. Expected: [(20, \'lina\'), (15, \'ahmed\'), (12, \'omar\')].',
      },
      starterCode: "scores = {'omar': 12, 'lina': 20, 'ahmed': 15}\n# اعكس الصفوف ثم رتّب ثم اطبع / invert the tuples, sort, print:\n",
      solution: "scores = {'omar': 12, 'lina': 20, 'ahmed': 15}\nlst = list()\nfor key, val in scores.items():\n    lst.append((val, key))\nlst.sort(reverse=True)\nprint(lst)",
      tests: [
        {
          id: 't1',
          name: { ar: 'lst القائمة المعكوسة المرتبة تنازليًا', en: 'lst is the inverted list sorted descending' },
          code: "assert lst == [(20, 'lina'), (15, 'ahmed'), (12, 'omar')], 'expected: inverted pairs sorted by value | actual: %r' % (lst,)",
          expected: 'inverted pairs sorted by value',
        },
        {
          id: 't2',
          name: { ar: 'القمة (20, lina) مطبوعة', en: 'The top pair (20, lina) is printed' },
          code: "assert \"(20, 'lina')\" in __learner_output__, ('expected: (20, \\'lina\\') | actual: %r' % __learner_output__)",
          expected: "(20, 'lina')",
        },
        {
          id: 't3',
          name: { ar: 'القاع (12, omar) مطبوع', en: 'The bottom pair (12, omar) is printed' },
          code: "assert \"(12, 'omar')\" in __learner_output__, ('expected: (12, \\'omar\\') | actual: %r' % __learner_output__)",
          expected: "(12, 'omar')",
        },
      ],
      hints: [
        { ar: 'الصف المعكوس يضع القيمة أولًا: lst.append((val, key)).', en: 'The inverted tuple puts the value first: lst.append((val, key)).' },
        { ar: 'scores.items() يعطي (مفتاح، قيمة) — أنت تقلب الترتيب عند البناء.', en: 'scores.items() gives (key, value) — you flip the order while building.' },
        { ar: 'الهيكل:\nlst = list()\nfor key, val in scores.items():\n    lst.append((val, key))\nlst.sort(reverse=True)\nprint(lst)', en: 'The skeleton:\nlst = list()\nfor key, val in scores.items():\n    lst.append((val, key))\nlst.sort(reverse=True)\nprint(lst)' },
        { ar: "lst = list()\nfor key, val in scores.items():\n    lst.append((val, key))\nlst.sort(reverse=True)\nprint(lst)", en: "lst = list()\nfor key, val in scores.items():\n    lst.append((val, key))\nlst.sort(reverse=True)\nprint(lst)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-items',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "d = {'x': 5, 'y': 20, 'z': 12}\nfor key, val in d.items():\n    print(val, key)",
      solution: '5 x\n20 y\n12 z',
      answer: '5 x\n20 y\n12 z',
      hints: [
        { ar: 'print(val, key) يطبع القيمة أولًا والمفتاح ثانيًا.', en: 'print(val, key) prints the value first and the key second.' },
        { ar: 'الأزواج تمر بترتيب الإدراج: x ثم y ثم z.', en: 'The pairs pass in insertion order: x, then y, then z.' },
        { ar: 'ثلاث دورات — دورة لكل زوج — وكل دورة سطر.', en: 'Three passes — one per pair — and each pass one line.' },
        { ar: 'الخرْج:\n5 x\n20 y\n12 z', en: 'The output:\n5 x\n20 y\n12 z' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-items',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا يعيد d.items()؟',
        en: 'What does d.items() return?',
      },
      options: [
        { id: 'a', text: { ar: 'قائمة صفوف (مفتاح، قيمة) لكل عنصر في القاموس', en: 'A list of (key, value) tuples, one per dictionary item' } },
        { id: 'b', text: { ar: 'قائمة المفاتيح فقط', en: 'A list of the keys only' } },
        { id: 'c', text: { ar: 'قاموسًا مرتبًا حسب القيم', en: 'A dictionary sorted by values' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'القاموس لا يتحول قاموسًا آخر — يتحول سلسلة من الأزواج.', en: 'The dictionary does not become another dictionary — it becomes a sequence of pairs.' },
        { ar: 'كل زوج صف غير قابل للتعديل — ومن هنا قابل للمقارنة.', en: 'Each pair is an immutable tuple — hence comparable.' },
        { ar: 'لفّها بـ list إن أردت قائمة كاملة تُرتَّب بـ sort.', en: 'Wrap it in list if you want a full list sortable with sort.' },
        { ar: 'الجواب: قائمة صفوف (مفتاح، قيمة).', en: 'Answer: a list of (key, value) tuples.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-reverse',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ باسم الوسيط الواحد: لنرتب قائمة الصفوف المعكوسة تنازليًا نستدعي lst.sort(____=True).',
        en: 'Fill the blank with the single argument name: to sort the inverted tuple list descending we call lst.sort(____=True).',
      },
      answer: 'reverse',
      solution: 'reverse',
      hints: [
        { ar: 'الوسيط يحمل اسم المعنى نفسه بالإنجليزية.', en: 'The argument is named exactly like its meaning in English.' },
        { ar: 'بلا هذا الوسيط يخرج الترتيب تصاعديًا فتصدر الأصغر قيمة.', en: 'Without this argument the order comes out ascending and the smallest value leads.' },
        { ar: 'سبعة أحرف ويبدأ بـ r.', en: 'Seven letters and starts with r.' },
        { ar: 'الجواب: reverse', en: 'Answer: reverse' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — أزواج في كل اتجاه\n# Your playground — pairs in every direction\n\ncounts = {"a": 3, "b": 1, "c": 2}\nprint(list(counts.items()))\nfor key, val in counts.items():\n    print(val, key)\nlst = list()\nfor key, val in counts.items():\n    lst.append((val, key))\nlst.sort()\nprint(lst)\nlst.sort(reverse=True)\nprint(lst)',
      prompt: {
        ar: 'جرّب بنفسك: items بعدها list ثم sort، واقلب الأسماء في رأس الحلقة ولاحظ ماذا يتغير، وراقب القائمة تقلب بين التصاعدي والتنازلي. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: items then list then sort; flip the names in the loop header and watch what changes; watch the list flip between ascending and descending. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل التاسع: لماذا لا نرتب القاموس نفسه مباشرة؟',
            en: 'From chapter 9: why do we not sort the dictionary itself directly?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن القاموس بلا ترتيب مختار — نحوّل عناصره إلى قائمة صفوف ثم نرتب القائمة', en: 'Because the dictionary has no chosen order — we convert its items into a list of tuples and sort that list' } },
            { id: 'b', text: { ar: 'لأن القاموس لا يقبل sort لأنه أكبر من الذاكرة', en: 'Because the dictionary rejects sort for being larger than memory' } },
            { id: 'c', text: { ar: 'لأن sort يرتب المفاتيح فيحذف القيم', en: 'Because sort orders keys and deletes the values' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القاموس تركيبة مفاتيح سريعة لا تسلسل مرتب — وعندما نحتاج نظامًا نصبه عبر items ثم sort على القائمة الناتجة.',
            en: 'The dictionary is a fast key structure, not an ordered sequence — when we need order we impose it via items then sort on the resulting list.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في for key, val in d.items(): — ماذا يحدث في كل دورة؟',
            en: 'In for key, val in d.items(): — what happens each pass?',
          },
          options: [
            { id: 'a', text: { ar: 'إسناد صف متكرر: الزوج (مفتاح، قيمة) يتفكك في متغيرين', en: 'A repeated tuple assignment: the (key, value) pair unpacks into two variables' } },
            { id: 'b', text: { ar: 'يُنسخ القاموس كله في key وval مجرد اسمين شكليين', en: 'The whole dictionary is copied and key and val are just cosmetic names' } },
            { id: 'c', text: { ar: 'يمر الزوجان الأولان فقط ثم تتوقف الحلقة', en: 'Only the first two pairs pass, then the loop stops' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل دورة تكافئ key, val = زوج — درس إسناد الصفوف يعمل آلاف المرات صامتًا داخل حلقة واحدة.',
            en: 'Each pass equals key, val = pair — the tuple-assignment lesson running thousands of times silently inside one loop.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثاني: x, y = y, x — لماذا يعمل التبديل بلا متغير ثالث؟',
            en: 'From chapter 2: x, y = y, x — why does the swap work with no third variable?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الطرف الأيمن يُحسب كله أولًا كصف ثم تسند قيمه', en: 'Because the right side is fully evaluated first as a tuple, then its values are assigned' } },
            { id: 'b', text: { ar: 'لأن بايثون يتبادل الاسمين دون نقل القيم', en: 'Because Python swaps the two names without moving values' } },
            { id: 'c', text: { ar: 'لأن x وy يشتركان في الصندوق نفسه', en: 'Because x and y share the same box' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'اليمين (y, x) يُقرأ ويجمد قبل أي حركة — ثم تنزل قيمه في الترتيب على الطرف الأيسر. الترتيب اللحظي الذي أنقذ التبديل.',
            en: 'The right side (y, x) is read and frozen before anything moves — then its values descend in order onto the left side. The momentary ordering that saved the swap.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'لماذا نبني صفوفًا معكوسة (قيمة، مفتاح) لنرتب بحسب القيمة؟',
            en: 'Why do we build inverted (value, key) tuples to sort by value?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن sort يقارن بالعنصر الأول — فالقيمة يجب أن تتقدم الصف', en: 'Because sort compares the first element — so the value must lead the tuple' } },
            { id: 'b', text: { ar: 'لأن القاموس يفرض قلب الأزواج عند الإخراج', en: 'Because the dictionary forces pair inversion on output' } },
            { id: 'c', text: { ar: 'لأن sort لا يقارن السلاسل فنبعدها عن القمة', en: 'Because sort cannot compare strings so we push them away from the front' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قاعدة الدرس الثاني حرفيًا: أول موضع مختلف يحسم. اجعل ما تريد الترتيب به يتقدم الصف — وعند التكافؤ يحسم المفتاح.',
            en: 'Lesson two\u2019s rule verbatim: the first differing position decides. Make what you rank by lead the tuple — and on ties the key settles it.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "d = {'a': 10, 'b': 1}\nprint(sorted(d))",
          right: "d = {'a': 10, 'b': 1}\nprint(sorted(d.items()))",
          note: {
            ar: 'ترتيب القاموس مباشرةً يرتب المفاتيح وحدها ويهمل القيم — للترتيب بالأزواج لفّها items ثم رتّب القائمة.',
            en: 'Sorting the dictionary directly orders the keys alone and drops the values — for pair ordering wrap with items then sort the list.',
          },
        },
        {
          wrong: "for key, val in d:\n    print(key, val)",
          right: "for key, val in d.items():\n    print(key, val)",
          note: {
            ar: 'بلا items تمشي على المفاتيح وحدها، ومحاولة تفكيك كل مفتاح نصي في متغيرين ترمي ValueError. items هي التي تسلّمك الأزواج.',
            en: 'Without items you walk the keys alone, and trying to unpack each textual key into two variables throws ValueError. items is what hands you the pairs.',
          },
        },
        {
          wrong: "t = d.items()\nt.sort()",
          right: "t = list(d.items())\nt.sort()",
          note: {
            ar: 'items ليست قائمة كاملة قابلة للترتيب بل عرض حي على الأزواج — استدعاء sort عليها يرمي AttributeError. لفّها بـ list أولًا.',
            en: 'items is not a full sortable list but a live view over the pairs — calling sort on it throws AttributeError. Wrap it in list first.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'items يحوّل القاموس إلى قائمة صفوف (مفتاح، قيمة) قابلة للترتيب — والقاموس الأصلي لا يتغير.', en: 'items converts the dictionary into a sortable list of (key, value) tuples — the original dictionary never changes.' },
        { ar: 'for key, val in d.items(): إسناد صف متكرر — متغيران لكل زوج في كل دورة.', en: 'for key, val in d.items(): is repeated tuple assignment — two variables per pair per pass.' },
        { ar: 'للترتيب بالقيمة: اعكس الصف إلى (قيمة، مفتاح) ثم sort(reverse=True) — العنصر الأول حاكم والتكافؤ للمفتاح.', en: 'To sort by value: invert the tuple to (value, key) then sort(reverse=True) — the first element rules and ties go to the key.' },
      ],
      reflectPrompt: {
        ar: 'قاموس أصدقائك وعمر كل منهم: اكتب على الورق سطر الحلقة الذي يطبع الأصغر سنًا أولًا — أي صفيْ (اسم، عمر) أم (عمر، اسم) تحتاج، وأي عامل ترتيب؟',
        en: 'A dictionary of your friends and their ages: write on paper the loop line that prints the youngest first — which tuple do you need, (name, age) or (age, name), and which sort argument?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch10.s4', pages: 'ص162 / pp.162' },
        { book: 'PY4E', section: 'py4e.ch10.s5', pages: 'ص163 / pp.163' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch10.s4', pages: 'ص162 / pp.162' },
    { book: 'PY4E', section: 'py4e.ch10.s5', pages: 'ص163 / pp.163' },
  ],
} satisfies Lesson;

export default lesson;
