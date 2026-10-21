import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch10.l6 — "Chapter 10 Review and Project: Word Leaderboard /
 * مراجعة الفصل 10 ومشروع: لوحة صدارة الكلمات"
 * Aligned with PY4E ch10 s8 (السلاسل النصية والقوائم والصفوف), s9 (التنقيح),
 * s10 (فهرس المصطلحات), s11 (تمارين).
 * All expression is original.
 * Project: a word leaderboard — write a fixed text to a file ('w'), read +
 * lowercase + strip punctuation (ties ch9), count with dict+get, decorate
 * (count, word) tuples, sort(reverse=True), top 3, %-formatted leaderboard
 * lines 'rank. word: count'. Deterministic MEMFS file lifecycle.
 */
const lesson = {
  id: 'py4e.ch10.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 10,
  title: { ar: 'مراجعة الفصل 10 ومشروع: لوحة صدارة الكلمات', en: 'Chapter 10 Review and Project: Word Leaderboard' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch10.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أقفل الفصل العاشر على خريطته كاملة: صف يولد بفاصلة ويقف متجمدًا، ومقارنة تقف عند أول اختلاف، وإسناد يبادل القيم بلا متغير ثالث، وitems يصبّ القاموس في صفوف، ثم البرنامج الشهير الذي يصدر التكرارات. اليوم مراجعة شاملة ومشروع الختام: لوحة صدارة كلمات تكتب نصًّا في ملف، تعدّه بنظافة الفصل التاسع، ترتّب أزواجه، وتطبع أول ثلاثة بتنسيق مهني. بنهاية الدرس ستكون قادرًا على: تمييز عائلة السلاسل النصية والقوائم والصفوف وتحويلاتها، وتنقيح أعطال هياكل البيانات الثلاثة، ومراجعة مصطلحات الفصل، وتنفيذ المشروع كاملًا.',
        en: 'Chapter 10 closes on its full map: a tuple born of a comma standing frozen, a comparison stopping at the first difference, assignment exchanging values with no third variable, items pouring the dictionary into tuples, then the famous program that ranks frequencies. Today is a full review plus the closing project: a word leaderboard that writes a text into a file, counts it with chapter-9 cleaning, sorts its pairs, and prints the top three with professional formatting. By the end of this lesson you will be able to: tell the string-list-tuple family apart and convert among them, debug the three data-structure ailments, review the chapter glossary, and run the whole project.',
      },
    },
    {
      kind: 'predict',
      code: "s = 'abc'\nt = tuple(s)\nl = list(t)\nprint(t == l)\nprint(t == tuple(l))",
      question: {
        ar: 'الصف t والقائمة l يحملان الحروف نفسها بالترتيب نفسه. هل يساوي أحدهما الآخر؟',
        en: 'The tuple t and the list l carry the same letters in the same order. Does either equal the other?',
      },
      reveal: {
        ar: 'False ثم True — بايثون لا يساوي صفًّا بقائمة حتى لو تطابقت عناصرهما: النوع جزء من الهوية. لكن tuple(l) أعاد بناء الصف فصارا أخوين متطابقين. التحويلات بين العائلة الثلاثة جسور مفتوحة، والمقارنة تسأل عن النوع قبل العناصر.',
        en: 'False then True — Python never equates a tuple with a list even when their elements match: the type is part of the identity. But tuple(l) rebuilt the tuple, making them identical twins. Conversions across the three-family bridge stay open, and comparison asks about type before elements.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'عائلة السلاسل: نص وقائمة وصف', en: 'The sequence family: strings, lists, tuples' },
      chunks: [
        {
          ar: 'السلسلة النصية string نص محارف، والقائمة list قيم حية قابلة للتعديل، والصف tuple قيم مجمدة — وكلها سلاسل sequences: مركبات مرتبة تُفهرس بأعداد صحيحة وتدعم عامل القوس وlen والتجزئة وعامل in (فصول 6-8). الفروق في الجودة: النص والصف مجمدان والقائمة تتحرك — والقياس المشترك بينها الـ len والفهرسة.',
          en: 'A string is a text of characters, a list is living editable values, a tuple is frozen values — and all are sequences: ordered compounds indexed by integers supporting the bracket operator, len, slicing and the in operator (chapters 6-8). The differences are in quality: string and tuple are frozen while the list moves — and len and indexing measure them all alike.',
        },
        {
          ar: "والتحويل بينها بأتوابع جاهزة: tuple('abc') يبني صفًّا من النص، وlist((1, 2, 3)) يبني قائمة من الصف، وstr() يعيد تمثيل أي شيء نصًّا (الفصل 6). كما في التنبؤ: القيم المتطابقة بأنواع مختلفة لا تتساوى — التحويل جسر لا اندماج. اختر الأداة على المقاس: نص للكتابة والقراءة، قائمة للبناء والتعديل، صف للتجميد والمفاتيح.",
          en: "Conversions run on built-ins: tuple('abc') builds a tuple from the text, list((1, 2, 3)) builds a list from the tuple, and str() represents anything as text (chapter 6). As in the prediction: equal values of different types are not equal — conversion is a bridge, not a merge. Choose the tool by fit: string for reading and writing, list for building and editing, tuple for freezing and keying.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التنقيح: حين تمرض الهياكل', en: 'Debugging: when data structures fall ill' },
      chunks: [
        {
          ar: 'الهياكل الكبيرة لا تُنقّح بطباعتها كاملة. ثلاث أدوات من الكتاب: قلّص الدخل — جرّب أول عشرة أسطر أو أصغر مثال حتى يتضح العطل (نص مشروعنا اليوم 18 كلمة). اطبع موجزًا — لا القاموس كله بل len(counts) وقيمة كلمات مختارة. اكتب اختبارات منطقية — هل مجموع القيم يساوي عدد الكلمات المقروءة؟ إن خالف فهناك كلمة فُقدت أو ضُاعفت.',
          en: 'Big structures are not debugged by printing them whole. Three tools from the book: reduce the input — try the first ten lines or the smallest example until the fault shows (our project text today is 18 words). Print summaries — not the whole dictionary but len(counts) and a few chosen values. Write logical self-checks — does the sum of values equal the number of words read? A mismatch means a word was lost or doubled.',
        },
        {
          ar: 'وفي هذا الفصل تحديدًا ثلاثة أعطال مشهورة: تفكيك غير متوازن يرمي ValueError، وقائمة تُستخدم مفتاحًا فترمي TypeError: unhashable type، وترتيب الأزواج بالطرف الخاطئ — صمت قاتل لا يرمي شيئًا لكنه يقلب اللوحة أبجديًا بدل تكراريًا. والأخطر هو الأخير: اطبع أول ثلاثة بعد كل ترتيب لتفقدها بعينك.',
          en: 'And this chapter specifically has three famous ailments: an unbalanced unpack throwing ValueError, a list used as a key throwing TypeError: unhashable type, and sorting the pairs by the wrong side — a deadly silence that throws nothing yet turns the board alphabetical instead of frequency-based. The last is the worst: print the top three after every sort and inspect them with your eyes.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فهرس مصطلحات الفصل', en: 'The chapter glossary' },
      chunks: [
        {
          ar: 'الصف tuple: سلسلة قيم غير قابلة للتعديل تفهرس بأعداد صحيحة. العنصر الواحد singleton: صف من عنصر واحد يحتاج فاصلة أخيرة — (\'a\',). العنصر item: اسم آخر لقيمة داخل سلسلة. التسلسل sequence: أي مركب مرتب قابل للفهرسة — نص وقائمة وصف.',
          en: 'A tuple: an immutable sequence of values indexed by integers. A singleton: a one-element tuple needing a trailing comma — (\'a\',). An item: another name for a value inside a sequence. A sequence: any ordered, indexable compound — string, list, tuple.',
        },
        {
          ar: 'الهيكل البياني data structure: تنظيم البيانات داخل البرنامج لتسهيل معالجتها — قاموس العدّاد وقائمة الصفوف هما هيكلا مشروعنا. القابل للمقارنة comparable: نوع يجوز مقارنة قيمه بـ < و> — شرط الترتيب. القابل للهاش hashable: نوع يصلح مفتاح قاموس — والأنواع غير القابلة للتعديل كلها كذلك. إسناد الصفوف tuple assignment: إسناد عدة متغيرات دفعة واحدة من سلسلة. التجزئة slice: قطعة من سلسلة بعامل :.',
          en: 'A data structure: organizing data inside the program for easy processing — the counting dictionary and the tuple list are our project\u2019s structures. Comparable: a type whose values may be compared with < and > — the prerequisite of sorting. Hashable: a type fit for dictionary keys — all immutable types qualify. Tuple assignment: assigning several variables at once from a sequence. A slice: a piece of a sequence via the : operator.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'لوحة صدارة الكلمات كاملة', en: 'The word leaderboard, whole and working' },
      code: "import string\ntext = 'Romeo loves Juliet. Juliet loves the moon, and the night loves Romeo. And the stars watch the night.'\nout = open('wordboard.txt', 'w')\nout.write(text)\nout.close()\n\nfhand = open('wordboard.txt')\ncounts = dict()\nfor line in fhand:\n    line = line.translate(str.maketrans(' ', ' ', string.punctuation))\n    line = line.lower()\n    words = line.split()\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\n\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\n\nrank = 1\nfor count, word in lst[:3]:\n    print('%d. %s: %d' % (rank, word, count))\n    rank = rank + 1",
      explanation: {
        ar: "المرحلة الأولى: ملف وُلد بـ w من الفصل السابع وسُجّل فيه النص. المرحلة الثانية: قراءة سطرًا سطرًا ونظافة الترقيم بـ translate وتصغير بـ lower وتقطيع بـ split وعدّ بـ get — تراث الفصل التاسع. المرحلة الثالثة: التمييز (عدد، كلمة) والترتيب التنازلي — تراث هذا الفصل. المرحلة الرابعة: شريحة أعلى 3 وحلقة بإسناد صفوف وطباعة بعامل التنسيق % من الفصل السادس، وrank عدّاد يدوي يرقم المراتب. الناتج: the في الصدارة بأربعة وloves بثلاثة وromeo بالمركز الثالث — تكافؤه مع night وjuliet وand حُسم أبجديًا تنازليًا لصالحه. أربعة فصول في برنامج واحد.",
        en: "Phase one: a file born in w mode from chapter 7, receiving the text. Phase two: line-by-line reading, punctuation cleaning with translate, lowercasing, splitting, counting with get — chapter-9 heritage. Phase three: (count, word) decorating and the descending sort — this chapter\u2019s heritage. Phase four: a top-3 slice, a loop with tuple assignment, %-format printing from chapter 6, and rank, a manual counter numbering the places. The result: the leads at four, loves at three, romeo third — its tie with night, juliet and and settled alphabetically descending in its favor. Four chapters in one program.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-family',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "s = 'abc'\nprint(tuple(s))\nprint(list((1, 2)))\nprint(len(tuple('hi')))",
      solution: "('a', 'b', 'c')\n[1, 2]\n2",
      answer: "('a', 'b', 'c')\n[1, 2]\n2",
      hints: [
        { ar: 'tuple يحوّل النص إلى صف محارف — وprint يظهره بأقواسه واقتباساته.', en: 'tuple turns the text into a tuple of characters — print shows it with brackets and quotes.' },
        { ar: 'list يحوّل الصف إلى قائمة — والأقواس المربعة بصمة القوائم.', en: 'list turns the tuple into a list — square brackets are the list signature.' },
        { ar: 'len على الصف يعدّ العناصر: hi محرفان.', en: 'len on a tuple counts elements: hi is two characters.' },
        { ar: "الخرْج:\n('a', 'b', 'c')\n[1, 2]\n2", en: "The output:\n('a', 'b', 'c')\n[1, 2]\n2" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.word-leaderboard',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل العاشر — لوحة صدارة الكلمات: النص معطى في المحرر. المرحلة الأولى: اكتبه في ملف wordboard.txt بوضع 'w' ثم أغلق الملف. المرحلة الثانية: افتح الملف للقراءة، وحلقة على الأسطر تطبّق نظافة الفصل التاسع: translate لحذف علامات الترقيم ثم lower ثم split، وعدّ كل كلمة بـ counts[word] = counts.get(word, 0) + 1، ثم أغلق الملف. المرحلة الثالثة: أنشئ lst واملأها بصفوف (العدد، الكلمة) من counts.items()، ورتّبها بـ sort(reverse=True). المرحلة الرابعة: عَلَم rank يبدأ بـ 1، وحلقة على lst[:3] تطبع في كل دورة '%d. %s: %d' % (rank, word, count) ثم تزيد rank واحدًا. المتوقع: 1. the: 4 ثم 2. loves: 3 ثم 3. romeo: 2.",
        en: "Chapter 10 project — the word leaderboard: the text is given in the editor. Phase one: write it to wordboard.txt in 'w' mode, then close the file. Phase two: open the file for reading, and a loop over the lines applies chapter-9 cleaning: translate to strip punctuation, then lower, then split, counting every word with counts[word] = counts.get(word, 0) + 1, then close the file. Phase three: create lst and fill it with (count, word) tuples from counts.items(), then sort it with sort(reverse=True). Phase four: a flag rank starting at 1, and a loop over lst[:3] printing '%d. %s: %d' % (rank, word, count) each pass, then raising rank by one. Expected: 1. the: 4, then 2. loves: 3, then 3. romeo: 2.",
      },
      starterCode: "text = 'Romeo loves Juliet. Juliet loves the moon, and the night loves Romeo. And the stars watch the night.'\nimport string\n# المرحلة 1: اكتب النص في wordboard.txt ثم أغلق / phase 1: write the text then close\n# المرحلة 2: اقرأ ونظّف وعدّ بـ get ثم أغلق / phase 2: read, clean, count with get, close\n# المرحلة 3: صفوف (عدد، كلمة) وترتيب تنازلي / phase 3: (count, word) tuples, descending sort\n# المرحلة 4: أعلى 3 بتنسيق المراتب / phase 4: top 3 with rank formatting\n",
      solution: "import string\ntext = 'Romeo loves Juliet. Juliet loves the moon, and the night loves Romeo. And the stars watch the night.'\nout = open('wordboard.txt', 'w')\nout.write(text)\nout.close()\n\nfhand = open('wordboard.txt')\ncounts = dict()\nfor line in fhand:\n    line = line.translate(str.maketrans(' ', ' ', string.punctuation))\n    line = line.lower()\n    words = line.split()\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\n\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\n\nrank = 1\nfor count, word in lst[:3]:\n    print('%d. %s: %d' % (rank, word, count))\n    rank = rank + 1",
      tests: [
        {
          id: 't1',
          name: { ar: 'القمة the بـ 4 تكرارات', en: 'The top word the with 4 occurrences' },
          code: "assert 'the: 4' in __learner_output__, ('expected: the: 4 | actual: %r' % __learner_output__)",
          expected: 'the: 4',
        },
        {
          id: 't2',
          name: { ar: 'الوصيف loves بـ 3 تكرارات', en: 'The runner-up loves with 3 occurrences' },
          code: "assert 'loves: 3' in __learner_output__, ('expected: loves: 3 | actual: %r' % __learner_output__)",
          expected: 'loves: 3',
        },
        {
          id: 't3',
          name: { ar: 'المركز الثالث romeo بـ 2 — التكافؤ حُسم أبجديًا', en: 'Third place romeo with 2 — the tie broke alphabetically' },
          code: "assert 'romeo: 2' in __learner_output__ and 'watch: 1' not in __learner_output__, ('expected: romeo: 2 without watch: 1 | actual: %r' % __learner_output__)",
          expected: 'romeo: 2',
        },
        {
          id: 't4',
          name: { ar: 'تنسيق المراتب كامل: 1. ثم 2. ثم 3.', en: 'Full rank formatting: 1. then 2. then 3.' },
          code: "assert '1. the: 4' in __learner_output__ and '2. loves: 3' in __learner_output__ and '3. romeo: 2' in __learner_output__, ('expected: 1. the: 4 / 2. loves: 3 / 3. romeo: 2 | actual: %r' % __learner_output__)",
          expected: '1. the: 4 / 2. loves: 3 / 3. romeo: 2',
        },
        {
          id: 't5',
          name: { ar: 'العدّاد كامل: juliet بـ 2 وwatch بـ 1 و9 كلمات مختلفة', en: 'The counter is complete: juliet at 2, watch at 1, 9 distinct words' },
          code: "assert counts['juliet'] == 2 and counts['watch'] == 1 and len(counts) == 9, ('expected: juliet 2, watch 1, 9 distinct | actual: juliet %r watch %r distinct %d' % (counts['juliet'], counts['watch'], len(counts)))",
          expected: 'juliet 2 / watch 1 / 9 distinct',
        },
        {
          id: 't6',
          name: { ar: 'القائمة المرتبة صحيحة: القمة والقاع', en: 'The sorted list is right: top and bottom' },
          code: "assert lst[0] == (4, 'the') and lst[2] == (2, 'romeo'), ('expected: lst[0] (4, \\'the\\') and lst[2] (2, \\'romeo\\') | actual: %r' % (lst,))",
          expected: "lst[0] (4, 'the') / lst[2] (2, 'romeo')",
        },
      ],
      hints: [
        { ar: 'أربع مراحل لا خامس لها: كتابة، ثم عدّ، ثم ترتيب، ثم طباعة — كل مرحلة بمنعطفها.', en: 'Four phases, no fifth: writing, counting, sorting, printing — each with its own turn.' },
        { ar: 'سطر النظافة من الفصل التاسع جاهز انسخه حرفيًا: line = line.translate(str.maketrans(\' \', \' \', string.punctuation)) ثم line = line.lower() ثم words = line.split().', en: "The chapter-9 cleaning line copies verbatim: line = line.translate(str.maketrans(' ', ' ', string.punctuation)) then line = line.lower() then words = line.split()." },
        { ar: 'الهيكل:\nimport string\ntext = ...\nout = open(\'wordboard.txt\', \'w\')\nout.write(text)\nout.close()\nfhand = open(\'wordboard.txt\')\ncounts = dict()\nfor line in fhand:\n    line = line.translate(str.maketrans(\' \', \' \', string.punctuation))\n    line = line.lower()\n    words = line.split()\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nrank = 1\nfor count, word in lst[:3]:\n    print(\'%d. %s: %d\' % (rank, word, count))\n    rank = rank + 1', en: "The skeleton:\nimport string\ntext = ...\nout = open('wordboard.txt', 'w')\nout.write(text)\nout.close()\nfhand = open('wordboard.txt')\ncounts = dict()\nfor line in fhand:\n    line = line.translate(str.maketrans(' ', ' ', string.punctuation))\n    line = line.lower()\n    words = line.split()\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nrank = 1\nfor count, word in lst[:3]:\n    print('%d. %s: %d' % (rank, word, count))\n    rank = rank + 1" },
        { ar: "تذكّر صيغة التنسيق: %d للعدد و%s للنص — '%d. %s: %d' % (rank, word, count). وrank يبدأ بـ 1 ويزيد داخل الحلقة بعد كل طباعة.", en: "Remember the format specifiers: %d for the number and %s for the text — '%d. %s: %d' % (rank, word, count). And rank starts at 1 and increments inside the loop after each print." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-hashable',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي السطور الثلاثة يرمي TypeError: unhashable type؟',
        en: 'Which of the three lines throws TypeError: unhashable type?',
      },
      options: [
        { id: 'a', text: { ar: "d[[0, 1]] = 'origin' — قائمة كمفتاح", en: "d[[0, 1]] = 'origin' — a list as key" } },
        { id: 'b', text: { ar: "d[(0, 1)] = 'origin' — صف كمفتاح", en: "d[(0, 1)] = 'origin' — a tuple as key" } },
        { id: 'c', text: { ar: "d['a'] = 1 — نص كمفتاح", en: "d['a'] = 1 — a string as key" } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'القاموس يطلب مفتاحًا مجمدًا — أي نوع لا يتغير بعد إنشائه؟', en: 'The dictionary demands a frozen key — which type never changes after creation?' },
        { ar: 'الصف والنص مجمدان؛ القائمة حية تتحرك.', en: 'Tuple and string are frozen; the list moves.' },
        { ar: 'الأقواس المربعة بصمة القوائم القابلة للتعديل.', en: 'Square brackets are the signature of mutable lists.' },
        { ar: 'الجواب: أ — القوائم غير قابلة للهاش فترمي TypeError: unhashable type: list.', en: "Answer: a — lists are unhashable and throw TypeError: unhashable type: 'list'." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-distinct',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل: في نص المشروع — Romeo loves Juliet. Juliet loves the moon, and the night loves Romeo. And the stars watch the night. — بعد النظافة والتصغير والعدّ: كم عدد الكلمات المختلفة (طول counts)؟",
        en: "Without running: in the project text — Romeo loves Juliet. Juliet loves the moon, and the night loves Romeo. And the stars watch the night. — after cleaning, lowercasing and counting: how many distinct words (the length of counts)?",
      },
      answer: '9',
      solution: '9',
      tolerance: 0,
      hints: [
        { ar: 'سرد الكلمات المختلفة أسهل من عدّ التكرارات: romeo وloves وjuliet وthe وmoon وand وnight وstars وwatch.', en: 'Listing the distinct words is easier than counting repeats: romeo, loves, juliet, the, moon, and, night, stars, watch.' },
        { ar: 'التصغير وحّد Juliet وjuliet وAnd وand — فلا تكرار أسماء.', en: 'Lowercasing unified Juliet with juliet and And with and — no duplicated names.' },
        { ar: 'عدّها على أصابعك: تسع كلمات مختلفة في 18 كلمة مقروءة.', en: 'Count them on your fingers: nine distinct words within 18 words read.' },
        { ar: 'الجواب: 9', en: 'Answer: 9' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-sort-by-key',
      required: true,
      brokenCode: "import string\ntext = 'Romeo loves Juliet. Juliet loves the moon, and the night loves Romeo. And the stars watch the night.'\nout = open('wordboard.txt', 'w')\nout.write(text)\nout.close()\n\nfhand = open('wordboard.txt')\ncounts = dict()\nfor line in fhand:\n    line = line.translate(str.maketrans(' ', ' ', string.punctuation))\n    line = line.lower()\n    words = line.split()\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\n\n# رتبتُ الأزواج مباشرةً وأنا واثق أنها ستترتب بحسب العدد / sorted the pairs directly, sure they rank by count\nlst = list(counts.items())\nlst.sort(reverse=True)\n\nrank = 1\nfor word, count in lst[:3]:\n    print('%d. %s: %d' % (rank, word, count))\n    rank = rank + 1",
      prompt: {
        ar: 'لوحة الصدارة تطبع watch بعدد 1 في المركز الأول — وكلمة واحدة تكررت أربع مرات لا تظهر في القمة! شغّل الكود المعطوب ولاحظ الترتيب: ما الذي بدأ صفّ كل زوج؟ (تلميح من الفصل التاسع: counts.items() يعطي مفتاحًا ثم قيمة). اكتشف الخلل وأصلحه ليظهر الترتيب الصحيح: 1. the: 4 ثم 2. loves: 3 ثم 3. romeo: 2.',
        en: 'The leaderboard prints watch with a count of 1 in first place — while a word repeated four times is nowhere near the top! Run the broken code and inspect the order: what leads each pair tuple? (A chapter-9 hint: counts.items() gives key then value.) Find the bug and fix it so the correct board appears: 1. the: 4, then 2. loves: 3, then 3. romeo: 2.',
      },
      solution: "import string\ntext = 'Romeo loves Juliet. Juliet loves the moon, and the night loves Romeo. And the stars watch the night.'\nout = open('wordboard.txt', 'w')\nout.write(text)\nout.close()\n\nfhand = open('wordboard.txt')\ncounts = dict()\nfor line in fhand:\n    line = line.translate(str.maketrans(' ', ' ', string.punctuation))\n    line = line.lower()\n    words = line.split()\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\n\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\n\nrank = 1\nfor count, word in lst[:3]:\n    print('%d. %s: %d' % (rank, word, count))\n    rank = rank + 1",
      tests: [
        {
          id: 't1',
          name: { ar: 'القمة the: 4 وليست watch: 1', en: 'The top is the: 4, not watch: 1' },
          code: "assert 'the: 4' in __learner_output__ and 'watch: 1' not in __learner_output__, ('expected: the: 4 without watch: 1 | actual: %r' % __learner_output__)",
          expected: 'the: 4',
        },
        {
          id: 't2',
          name: { ar: 'اللوحة الصحيحة كاملة بالمراتب', en: 'The correct board complete with ranks' },
          code: "assert '1. the: 4' in __learner_output__ and '2. loves: 3' in __learner_output__ and '3. romeo: 2' in __learner_output__, ('expected: 1. the: 4 / 2. loves: 3 / 3. romeo: 2 | actual: %r' % __learner_output__)",
          expected: '1. the: 4 / 2. loves: 3 / 3. romeo: 2',
        },
        {
          id: 't3',
          name: { ar: 'القائمة معكوسة (عدد، كلمة) قبل الترتيب', en: 'The list was inverted to (count, word) before sorting' },
          code: "assert lst[0] == (4, 'the') and lst[2] == (2, 'romeo'), ('expected: lst[0] (4, \\'the\\') and lst[2] (2, \\'romeo\\') | actual: %r' % (lst,))",
          expected: "lst[0] (4, 'the') / lst[2] (2, 'romeo')",
        },
      ],
      hints: [
        { ar: 'الترتيب الخاطئ صامت: لا استثناء ولا رسالة — فقط لوحة مقلوبة. هذا أخطر عيوب التنقيح الثلاثة.', en: 'The wrong order is silent: no exception, no message — just an inverted board. That is the deadliest of the three debugging ailments.' },
        { ar: 'counts.items() يعطي أزواج (مفتاح، قيمة) أي (كلمة، عدد) — فبدأ الصف بالكلمة فترتب أبجديًا.', en: 'counts.items() gives (key, value) pairs — that is (word, count) — so the tuple led with the word and sorted alphabetically.' },
        { ar: 'الحل نمط DSU كاملًا: ابنِ صفوفًا جديدة تبدأ بالعدد — for word, count in counts.items(): lst.append((count, word)) — ثم sort(reverse=True).', en: 'The fix is the full DSU pattern: build new tuples led by the count — for word, count in counts.items(): lst.append((count, word)) — then sort(reverse=True).' },
        { ar: 'ولايقن الحلقة الأخيرة تفكك بالترتيب الجديد: for count, word in lst[:3]: — العدد أولًا في الصف يعني العدد أولًا في التفكيك.', en: 'And make the final loop unpack in the new order: for count, word in lst[:3]: — count first in the tuple means count first in unpacking.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — لوحة من صنعك\n# Your playground — a board of your own\n\nimport string\n\ntext = "python is fun. python is power. lists move, tuples freeze, dicts count."\nout = open("myboard.txt", "w")\nout.write(text)\nout.close()\n\nfhand = open("myboard.txt")\ncounts = dict()\nfor line in fhand:\n    line = line.translate(str.maketrans(" ", " ", string.punctuation))\n    line = line.lower()\n    for word in line.split():\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\n\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nrank = 1\nfor count, word in lst[:3]:\n    print("%d. %s: %d" % (rank, word, count))\n    rank = rank + 1\nprint(len(counts))',
      prompt: {
        ar: 'جرّب بنفسك: بدّل النص بجملتك، وزد الشريحة إلى أعلى 5، وجرّب حذف line.lower() ولاحظ كيف تنفصل python عن Python. ثم قارن len(counts) قبل وبعد التصغير. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: swap in your own sentence, extend the slice to the top 5, and try removing line.lower() to watch python split from Python. Then compare len(counts) before and after lowercasing. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الأول: لماذا تُعد بايثون لغة مناسبة لتحليل النصوص واكتشاف المعرفة منها — كما لاحظ الكتاب بعد برنامج الكلمات الأكثر تكرارًا؟',
            en: 'From chapter 1: why is Python a fitting language for text analysis and knowledge discovery — as the book notes after the most-common-words program?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن توابعها الجاهزة وأنماطها المختصرة تجعل البرامج القصيرة قوية', en: 'Because its built-ins and compact patterns make short programs powerful' } },
            { id: 'b', text: { ar: 'لأنها أسرع لغة على وجه الأرض', en: 'Because it is the fastest language on earth' } },
            { id: 'c', text: { ar: 'لأنها الوحيدة التي تقرأ الملفات', en: 'Because it is the only language that reads files' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'برنامج اليوم جمع ملفات وقواميس وحلقات وصفوف في عشرين سطرًا — والكتاب ختم الفصل بأن بايثون خيار مناسب لاكتشاف المعرفة من البيانات.',
            en: 'Today\u2019s program combined files, dictionaries, loops and tuples in twenty lines — and the book closed the chapter calling Python a suitable choice for knowledge discovery.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثاني: x, y = y, x — أي جزء يُحسب أولًا ولماذا يصح التبديل؟',
            en: 'From chapter 2: x, y = y, x — which side evaluates first and why does the swap hold?',
          },
          options: [
            { id: 'a', text: { ar: 'اليمين أولًا — فيتجمد الصف (y, x) ثم تسند قيمه', en: 'The right side first — the tuple (y, x) freezes, then its values assign' } },
            { id: 'b', text: { ar: 'اليسار أولًا — فتفرغ المتغيرات قبل القراءة', en: 'The left side first — the variables empty before reading' } },
            { id: 'c', text: { ar: 'الجانبان معًا لحظيًا بلا ترتيب', en: 'Both sides simultaneously with no order' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قاعدة الإسناد من الفصل الثاني: احسب اليمين ثم اسند — وإسناد الصفوف عممها فجمد الزوج كاملًا قبل أول نقل.',
            en: 'The chapter-2 assignment rule: evaluate right, then assign — tuple assignment generalized it, freezing the whole pair before the first transfer.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث: t[0] = "A" على صف — أي نوع خطأ ومتى يظهر؟',
            en: 'From chapter 3: t[0] = "A" on a tuple — what kind of error, and when does it appear?',
          },
          options: [
            { id: 'a', text: { ar: 'TypeError أثناء التشغيل — القواعد سليمة والعملية مرفوضة', en: 'A TypeError at runtime — the syntax is fine but the operation is refused' } },
            { id: 'b', text: { ar: 'SyntaxError قبل التشغيل — السطر غير صالح قواعديًا', en: 'A SyntaxError before running — the line is grammatically invalid' } },
            { id: 'c', text: { ar: 'لا خطأ — القيمة تتبدل بصمت', en: 'No error — the value changes silently' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الشكل قواعديًا صحيح لكن الصف مجمد فيرفض العملية وقت التنفيذ — فصل الأعطال الثلاثة: قواعدية قبل التشغيل ومنطقية وتشغيلية بعده.',
            en: 'The shape is grammatically legal but the frozen tuple refuses the operation at run time — the chapter-3 trio: syntax before running, logic and runtime after.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الرابع: تابع يعيد زوجًا (عدد، كلمة) إلى مستدعيه — ما تصنيفه؟',
            en: 'From chapter 4: a function returning a (count, word) pair to its caller — what is its classification?',
          },
          options: [
            { id: 'a', text: { ar: 'تابع مُنتج — استدعاؤه تعبير قيمته الزوج المعاد', en: 'A fruitful function — its call is an expression worth the returned pair' } },
            { id: 'b', text: { ar: 'تابع خالي — ينفذ ويهمل العودة', en: 'A void function — it acts and ignores returning' } },
            { id: 'c', text: { ar: 'إجراء نظام لا يجوز استدعاؤه مرتين', en: 'A system procedure that must not be called twice' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'إعادة زوج تُنتج قيمة صالحة للتعبيرات والتفكيك — تعريف التابع المُنتج، ومثلها قامت بحمل الصفوف في أنماط اليوم.',
            en: 'Returning a pair yields a value valid in expressions and unpacking — the fruitful definition, the same kind that carried tuples through today\u2019s patterns.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الفصل الخامس: في for count, word in lst[:3]: — كم دورة تنفذ وكم متغير تكرار تحمل رأسها؟',
            en: 'From chapter 5: in for count, word in lst[:3]: — how many passes run and how many iteration variables does the header carry?',
          },
          options: [
            { id: 'a', text: { ar: 'ثلاث دورات ومتغيران يتفكك كل زوج بينهما', en: 'Three passes and two variables that unpack each pair' } },
            { id: 'b', text: { ar: 'ثلاث دورات ومتغير واحد يحمل القائمة', en: 'Three passes and one variable holding the list' } },
            { id: 'c', text: { ar: 'دورة واحدة على القائمة كلها', en: 'One pass over the whole list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الشريحة قصّت القائمة إلى ثلاثة، ورأس الحلقة إسناد صف متكرر: كل زوج يوزع قيمتَيه في count وword — نمط الفصل الخامس بلغة الفصل العاشر.',
            en: 'The slice trimmed the list to three, and the loop header is repeated tuple assignment: each pair distributes its two values into count and word — chapter-5 pattern in chapter-10 language.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'ومن الفصل السابع: لماذا أغلقنا الملف بعد العدّ قبل بناء اللوحة؟',
            en: 'From chapter 7: why did we close the file after counting, before building the board?',
          },
          options: [
            { id: 'a', text: { ar: 'لتفريغ المخزن وتحرير المعرّف بعد انتهاء القراءة — فالترتيب لا يحتاج الملف', en: 'To flush the buffer and release the handle once reading ends — sorting needs no file' } },
            { id: 'b', text: { ar: 'لأن close يحذف الملف من القرص', en: 'Because close deletes the file from disk' } },
            { id: 'c', text: { ar: 'لأن الحلقات لا تعمل على الملفات المغلقة فقط', en: 'Because loops only work on closed files' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'دورة حياة الملف من الفصل السابع اكتملت: ولادة بـ w وقراءة ثم إغلاق — وبقيت البيانات في القاموس والقائمة لا في الملف.',
            en: 'The chapter-7 file lifecycle completed: birth in w, reading, then close — the data now lives in the dictionary and list, not in the file.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "d = {}\nd[[0, 1]] = 'origin'",
          right: "d = {}\nd[(0, 1)] = 'origin'",
          note: {
            ar: "قائمة كمفتاح ترمي TypeError: unhashable type: 'list' لأنها تتحرك. صفّها — أقواس مستديرة — فتجمد وتصلح مفتاحًا لإحداثياتك.",
            en: "A list as key throws TypeError: unhashable type: 'list' because it moves. Make it a tuple — round brackets — and it freezes into a valid key for your coordinates.",
          },
        },
        {
          wrong: "lst = list(counts.items())\nlst.sort(reverse=True)\nfor word, count in lst[:3]:",
          right: "lst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nfor count, word in lst[:3]:",
          note: {
            ar: 'أزواج (مفتاح، قيمة) تبدأ بالكلمة فترتب أبجديًا — لوحة معجم لا صدارة تكرار، وبلا أي رسالة خطأ. نمط DSU كاملًا: اعكس الصف قبل الترتيب.',
            en: '(key, value) pairs lead with the word and sort alphabetically — a glossary board, not a frequency leaderboard, with no error message at all. The full DSU pattern: invert the tuple before sorting.',
          },
        },
        {
          wrong: "words = line.split()\nwords = words.lower()",
          right: "line = line.lower()\nwords = line.split()",
          note: {
            ar: 'التصغير بعد التقطيع يرمي AttributeError: \'list\' object has no attribute \'lower\' — الترتيب قانون: نظّف السلسلة أولًا ثم قطّعها.',
            en: "Lowercasing after splitting throws AttributeError: 'list' object has no attribute 'lower' — order is law: clean the string first, then split it.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'عائلة السلاسل: نص وقائمة وصف — كلها تفهرس وتجزّأ وتطيع len، والنص والصف مجمدان والقائمة حية، والتحويل بينها بأتوابع جاهزة.', en: 'The sequence family: string, list, tuple — all indexable, sliceable and len-obedient; string and tuple frozen, list alive, conversions on built-ins.' },
        { ar: 'التنقيح: قلّص الدخل واطبع موجزًا واكتب اختبارات منطقية — والترتيب بالطرف الخاطئ أخطر الأعطال لأنه صامت تمامًا.', en: 'Debugging: reduce input, print summaries, write logical self-checks — and sorting by the wrong side is the deadliest fault because it is utterly silent.' },
        { ar: "المصطلحات: صف وsingleton وعنصر وتسلسل وهيكل بيانات وقابل للمقارنة وقابل للهاش وإسناد صفوف وتجزئة.", en: 'Glossary: tuple, singleton, item, sequence, data structure, comparable, hashable, tuple assignment, slice.' },
        { ar: 'المشروع جمع أربعة فصول: ملف من السابع ونظافة وget من التاسع وصفوف وترتيب من العاشر وتنسيق % من السادس.', en: 'The project joined four chapters: files from the seventh, cleaning and get from the ninth, tuples and sorting from the tenth, % formatting from the sixth.' },
      ],
      reflectPrompt: {
        ar: 'لو بُنيت لوحة صدارة من رسائلك الخاصة فما الكلمات الثلاث التي تتوقعها في القمة؟ شغّل مشروع اليوم خارج المنصة على نص تكتبه بنفسك واكتشف الحقيقة — ثم قارن توقعك بالنتيجة.',
        en: 'If a leaderboard were built from your own messages, which three words would you expect on top? Run today\u2019s project outside the platform on a text you write yourself and discover the truth — then compare prediction with result.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch10.s8', pages: 'ص166 / pp.166' },
        { book: 'PY4E', section: 'py4e.ch10.s9', pages: 'ص167 / pp.167' },
        { book: 'PY4E', section: 'py4e.ch10.s10', pages: 'ص167 / pp.167' },
        { book: 'PY4E', section: 'py4e.ch10.s11', pages: 'ص168 / pp.168' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch10.s8', pages: 'ص166 / pp.166' },
    { book: 'PY4E', section: 'py4e.ch10.s9', pages: 'ص167 / pp.167' },
    { book: 'PY4E', section: 'py4e.ch10.s10', pages: 'ص167 / pp.167' },
    { book: 'PY4E', section: 'py4e.ch10.s11', pages: 'ص168 / pp.168' },
  ],
} satisfies Lesson;

export default lesson;
