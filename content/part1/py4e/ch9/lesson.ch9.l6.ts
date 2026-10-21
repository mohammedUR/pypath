import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch9.l6 — "Chapter 9 Review and Project: Word Counter /
 * مراجعة الفصل 9 ومشروع: عدّاد الكلمات"
 * Aligned with PY4E ch9 s6 (التنقيح), s7 (فهرس المصطلحات), s8 (تمارين), pp.152-154.
 * All expression is original.
 * Project: self-contained word counter — create a fixed text file with 'w',
 * read it, lowercase, strip punctuation (translate), count words with dict+get,
 * then print %-formatted stats (unique words + top word via a max-by-value
 * loop — no sorted()-on-tuples; that is chapter 10 territory).
 */
const lesson = {
  id: 'py4e.ch9.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 9,
  title: { ar: 'مراجعة الفصل 9 ومشروع: عدّاد الكلمات', en: 'Chapter 9 Review and Project: Word Counter' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch9.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: "أغلق الفصل التاسع على خريطته كاملة: قاموس يترجم بالمفاتيح، وهيستوغرام يفتح عدّاداته عند أول ظهور، وحلقات متداخلة تمشي على الملف، وتقرير يمشي على المفاتيح، وخط تنظيف يوحد النص قبل العدّ. ثم مشروعك الأضخم حتى الآن: عدّاد كلمات كامل يقرأ ملفًا تنشئه بنفسك، ينظفه، يعدّه بـ get، ويطبع تقريرًا بعامل التنسيق: عدد الكلمات المختلفة والكلمة الأكثر تكرارًا بحلقة بحث عن الأكبر. بنهاية الدرس ستكون قادرًا على: تركيب مراحل البرنامج الثلاث، وتشخيص أعطاله الشائعة، ومراجعة مصطلحات الفصل كلها.",
        en: "Chapter nine closes on its full map: a dictionary translating by keys, a histogram opening counters at first appearance, nested loops walking the file, a report walking the keys, and a cleaning line unifying text before counting. Then your biggest project yet: a complete word counter that reads a file you create yourself, cleans it, counts it with get, and prints a %-formatted report: the number of different words and the most frequent one via a max-search loop. By the end of this lesson you will be able to: compose the three program phases, diagnose its common failures, and review every term of the chapter.",
      },
    },
    {
      kind: 'predict',
      code: "hist = {'sun': 4, 'moon': 1}\nprint(len(hist))\nprint('sun' in hist)\nprint(hist.get('sky', 0))",
      question: {
        ar: 'مراجعة سريعة قبل المشروع: ماذا يطبع الأسطر الثلاثة؟ أجب من رأسك ثم شغّل.',
        en: 'A quick review before the project: what do the three lines print? Answer from memory, then run.',
      },
      reveal: {
        ar: 'يطبع 2 ثم True ثم 0. len تعدّ الأزواج، وin يسأل عن المفتاح، وget تعيد الافتراضية للمفتاح الغائب. إذا أجبت عن الثلاثة دون تردد فأنت جاهز للمشروع — إنما هو فصل واحد في ثلاثة أسطر.',
        en: 'It prints 2, then True, then 0. len counts the pairs, in asks about the key, and get returns the default for a missing key. If you answered all three without hesitation you are ready for the project — after all, it is one chapter in three lines.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التنقيح: عندما يكبر النص', en: 'Debugging: when the text grows' },
      chunks: [
        {
          ar: 'ثلاث خطوات تُنجي برامج البيانات الكبيرة: صغّر المدخلات — جرّب أول عشرة أسطر أو ملفًا مصغرًا قبل النص الكامل. افحص الملخصات لا التفاصيل — len(counts) وعدّاد كلمة معينة أسرع وأرشد من قراءة القاموس كله بعينك. واكتب فحوصًا ذاتية (sanity checks): مجموع العدّادات يجب أن يساوي عدد الكلمات المكتوبة في الملف — إن اختلف الرقمان فثمة خلل في مكان ما.',
          en: 'Three steps rescue big-data programs: scale down the input — try the first ten lines or a shrunken file before the full text. Check summaries, not details — len(counts) and one specific word counter are faster and wiser than eyeballing the whole dictionary. And write self-checks (sanity checks): the sum of all counters must equal the number of words written into the file — if the two numbers disagree, something is broken somewhere.',
        },
        {
          ar: 'وفي هذا الفصل مرضان متكرران: KeyError عند قراءة مفتاح أول مرة بلا get — والصيغة المختصرة وقايته. والعدّ الزائد عند نسيان else بعد if not in — فيُنشأ العنصر ثم يُزاد في نفس الدورة فيكبر كل عدّاد بواحد زائد. والأخطر صامت: عدّادات مكررة لنفس الكلمة بأشكالها — والتنظيف وقايته قبل أن يبدأ العدّ أصلًا.',
          en: 'And this chapter has two recurring ailments: KeyError when reading a key for the first time without get — guarded by the compact idiom. And the inflated count when else is forgotten after if not in — the item is born then bumped in the same pass, so every counter grows one too big. And the most dangerous is silent: duplicate counters for one word in its costumes — cleaned away before counting even starts.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فهرس مصطلحات الفصل', en: 'The chapter glossary' },
      chunks: [
        {
          ar: 'القاموس (dictionary) خريطة من مفاتيح إلى قيمها؛ والمفتاح (key) نصف الزوج الأول؛ والقيمة (value) نصفه الثاني؛ والعنصر (item) اسم آخر للزوج كاملًا. والبحث بالمفتاح (lookup) عملية جلب القيمة — وget يحرسها من المفاتيح الغائبة. وزوج مفتاح-قيمة هو الارتباط الذي حفظناه بأقواس {المفتاح: القيمة}.',
          en: 'A dictionary maps keys to their values; the key is the first half of the pair; the value the second; and item another name for the complete pair. Lookup is the act of fetching the value — and get guards it from missing keys. The key-value pair is the association we stored in {key: value} braces.',
        },
        {
          ar: 'الهيستوغرام (histogram) مجموعة عدّادات للتكرارات؛ والتطبيق (implementation) أسلوب حل المسألة — وثلاثة تطبيقات قد تحل العدّ الواحد. والجدول التقطيعي (hash table) الخوارزمية التي تجعل in على القواميس سريعًا مهما كبر. والحلقات المتداخلة (nested loops) حلقة داخل أخرى — قلب عدّاد الكلمات الذي بنيناه.',
          en: 'A histogram is a set of frequency counters; an implementation is a way of performing a computation — three implementations may solve one counting problem. The hash table is the algorithm keeping in fast on dictionaries however large they grow. And nested loops — a loop inside another — are the heart of the word counter we built.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المشروع: عدّاد الكلمات', en: 'The project: the word counter' },
      chunks: [
        {
          ar: "الوظيفة ثلاث مراحل. الإنشاء: قائمة أسطر تُكتب بوضع 'w' في story-l6.txt ثم close — دورة الفصل السابع. العدّ: فتح للقراءة، ولكل سطر خط الإنتاج كاملًا: translate يلقي الترقيم بـ string.punctuation، وlower يوحّد الحالة، وsplit يفرّق، وget يعدّ. التقرير: 'unique words: %d' % len(counts) ثم حلقة بحث عن الأكبر بعَلَم None من الفصل الخامس: لكل مفتاح إن كان counts[key] أكبر من الأعلى الحالي فاحفظ المفتاح وقيمته، ثم 'top word: %s (%d)'.",
          en: "The job has three phases. Creation: a list of lines written in 'w' mode into story-l6.txt then closed — the chapter-7 cycle. Counting: open for reading, and for every line the full production line: translate dumps punctuation via string.punctuation, lower unifies case, split breaks apart, get counts. The report: 'unique words: %d' % len(counts), then a max-search loop with the chapter-5 None flag: for every key, if counts[key] beats the current best, save the key and its value, then 'top word: %s (%d)'.",
        },
        {
          ar: 'لاحظ تكامل الفصول: import من الرابع، وعامل التنسيق % من السادس، والملفات من السابع، وقوائم split من الثامن، والقواميس من التاسع. وحدود المشروع مقصودة: نبحث عن الأكبر بحلقة بسيطة على المفاتيح — أما ترتيب الأزواج كاملة على نتيجتها فعالم المجموعات في الفصل القادم.',
          en: 'Watch the chapters integrate: import from four, the % format operator from six, files from seven, split lists from eight, dictionaries from nine. And the project limits are deliberate: we find the maximum with a simple loop over the keys — ordering the full list of pairs by their results belongs to the tuples world of the next chapter.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'العدّاد كاملًا أمامك', en: 'The counter, whole and working' },
      code: "import string\n\nout = open('poem-l6.txt', 'w')\nout.write('Love is patient, love is kind.\\n')\nout.write('Love is not envy; love never fails.\\n')\nout.close()\n\ncounts = dict()\nfhand = open('poem-l6.txt')\nfor line in fhand:\n    line = line.translate(str.maketrans('', '', string.punctuation))\n    line = line.lower()\n    for word in line.split():\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\nprint('unique words: %d' % len(counts))\nbest = None\nbest_word = None\nfor word in counts:\n    if best is None or counts[word] > best:\n        best = counts[word]\n        best_word = word\nprint('top word: %s (%d)' % (best_word, best))",
      explanation: {
        ar: 'السطران فيها فواصل ونقاط وفاصلة منقوطة وحروف كبيرة — وكلها ذهبت في خط الإنتاج. ثماني كلمات مختلفة، والأشهر love بأربع مرات، فيطبع التقرير: unique words: 8 ثم top word: love (4). حلقة الأكبر تبدأ بعَلَم None: أول مفتاح يحتل الصدارة تلقائيًا، ثم أي عدّاد أكبر يقلعها — نفس نمط أكبر-قيمة من الفصل الخامس على مفاتيح قاموس.',
        en: 'The two lines carry commas, periods, a semicolon and capitals — all gone down the production line. Eight different words, with love the most famous at four appearances, so the report prints: unique words: 8 then top word: love (4). The max loop starts with a None flag: the first key takes the crown automatically, then any bigger counter dethrones it — the same chapter-5 biggest-value pattern, now over dictionary keys.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-review',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "d = {'a': 1, 'b': 2}\nd['a'] = d.get('a', 0) + 10\nd['c'] = d.get('c', 0) + 5\nprint(d['a'])\nprint(d['c'])\nprint(len(d))",
      solution: '11\n5\n3',
      answer: '11\n5\n3',
      hints: [
        { ar: 'المفتاح a موجود فقرأ get قيمته 1 وزادها 10.', en: 'Key a exists, so get read its value 1 and added 10.' },
        { ar: 'المفتاح c غائب فقرأ get الافتراضية 0 وزادها 5.', en: 'Key c is absent, so get read the default 0 and added 5.' },
        { ar: 'القاموس صار فيه ثلاثة أزواج.', en: 'The dictionary now holds three pairs.' },
        { ar: 'الخرْج:\n11\n5\n3', en: 'The output:\n11\n5\n3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.word-counter',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل التاسع — عدّاد الكلمات: القائمة lines_text معطاة في المحرر (سطران بترقيم وحروف كبيرة). المرحلة 1: بحلقة for اكتب كل عنصر في ملف story-l6.txt بوضع 'w' ثم أغلق الملف. المرحلة 2: مع import string في الأعلى، افتح story-l6.txt للقراءة، ولكل سطر مرّه على خط الإنتاج: line = line.translate(str.maketrans('', '', string.punctuation)) ثم line = line.lower() ثم عدّ كلماته في قاموس counts بطريقة counts[word] = counts.get(word, 0) + 1. أغلق الملف بعد الحلقة. المرحلة 3: اطبع بعامل التنسيق % السطر 'unique words: %d' % len(counts)، ثم ابحث عن الكلمة الأكثر تكرارًا بحلقة على المفاتيح مع عَلَم None (احفظ أفضل مفتاح وقيمته في best_word وbest)، واطبع 'top word: %s (%d)' % (best_word, best). المتوقع: unique words: 7 ثم top word: sun (4).",
        en: "Chapter 9 project — the word counter: the list lines_text is given in the editor (two lines with punctuation and capitals). Phase 1: with a for loop write every element into the file story-l6.txt in 'w' mode, then close the file. Phase 2: with import string at the top, open story-l6.txt for reading, and pass every line down the production line: line = line.translate(str.maketrans('', '', string.punctuation)), then line = line.lower(), then count its words into a dictionary counts with counts[word] = counts.get(word, 0) + 1. Close the file after the loop. Phase 3: print with the % format operator the line 'unique words: %d' % len(counts), then find the most frequent word with a loop over the keys and a None flag (save the best key and value into best_word and best), and print 'top word: %s (%d)' % (best_word, best). Expected: unique words: 7, then top word: sun (4).",
      },
      starterCode: "import string\n\nlines_text = ['Sun, sun, and more sun!\\n', 'The moon rises; the sun sets.\\n']\n# المرحلة 1: اكتب الأسطر في story-l6.txt بوضع 'w' ثم أغلق / phase 1: write the lines into story-l6.txt with 'w', then close\n# المرحلة 2: افتح للقراءة، ونظّف كل سطر (translate ثم lower) وعدّ الكلمات في counts بطريقة get / phase 2: open for reading, clean each line (translate then lower), count words into counts with get\n# المرحلة 3: اطبع 'unique words: %d' % len(counts) ثم ابحث عن الأكبر بعَلَم None واطبع 'top word: %s (%d)' / phase 3: print the report lines after a max-search loop with a None flag\n",
      solution: "import string\n\nlines_text = ['Sun, sun, and more sun!\\n', 'The moon rises; the sun sets.\\n']\nout = open('story-l6.txt', 'w')\nfor item in lines_text:\n    out.write(item)\nout.close()\n\ncounts = dict()\nfhand = open('story-l6.txt')\nfor line in fhand:\n    line = line.translate(str.maketrans('', '', string.punctuation))\n    line = line.lower()\n    for word in line.split():\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\nprint('unique words: %d' % len(counts))\nbest = None\nbest_word = None\nfor word in counts:\n    if best is None or counts[word] > best:\n        best = counts[word]\n        best_word = word\nprint('top word: %s (%d)' % (best_word, best))",
      tests: [
        {
          id: 't1',
          name: { ar: 'كلمة sun عُدّت أربع مرات بعد التنظيف', en: 'Word sun counted 4 times after cleaning' },
          code: "assert counts['sun'] == 4, 'expected: 4 | actual: %r' % counts['sun']",
          expected: '4',
        },
        {
          id: 't2',
          name: { ar: 'كلمة the عُدّت مرتين', en: 'Word the counted 2 times' },
          code: "assert counts['the'] == 2, 'expected: 2 | actual: %r' % counts['the']",
          expected: '2',
        },
        {
          id: 't3',
          name: { ar: 'سبع كلمات مختلفة', en: 'Exactly seven different words' },
          code: "assert len(counts) == 7, 'expected: 7 | actual: %r' % len(counts)",
          expected: '7',
        },
        {
          id: 't4',
          name: { ar: 'يُطبع unique words: 7', en: 'unique words: 7 is printed' },
          code: "assert 'unique words: 7' in __learner_output__, ('expected: unique words: 7 | actual: %r' % __learner_output__)",
          expected: 'unique words: 7',
        },
        {
          id: 't5',
          name: { ar: 'يُطبع top word: sun (4)', en: 'top word: sun (4) is printed' },
          code: "assert 'top word: sun (4)' in __learner_output__, ('expected: top word: sun (4) | actual: %r' % __learner_output__)",
          expected: 'top word: sun (4)',
        },
      ],
      hints: [
        { ar: 'مراحل ثلاث لا رابع: كل write في حلقة الإنشاء، وكل نظافة وعدّ في حلقة القراءة، والتقرير بعدها.', en: 'Three phases, no fourth: every write in the creation loop, every clean and count in the reading loop, the report after it.' },
        { ar: 'خط الإنتاج للسطر داخل الحلقة بالترتيب: translate ثم lower ثم حلقة العدّ بـ get.', en: 'The per-line production line inside the loop, in order: translate, then lower, then the counting loop with get.' },
        { ar: "حلقة الأكبر:\nbest = None\nbest_word = None\nfor word in counts:\n    if best is None or counts[word] > best:\n        best = counts[word]\n        best_word = word\nprint('top word: %s (%d)' % (best_word, best))", en: "The max loop:\nbest = None\nbest_word = None\nfor word in counts:\n    if best is None or counts[word] > best:\n        best = counts[word]\n        best_word = word\nprint('top word: %s (%d)' % (best_word, best))" },
        { ar: 'بعد التنظيف: sun أربعًا وthe مرتين وmoon وand وmore وrises وsets مرة لكل منها — سبعة مفاتيح، والأعلى sun.', en: 'After cleaning: sun four times, the twice, and moon, and, more, rises, sets once each — seven keys, with sun on top.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-debug-shrink',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ومن درس التنقيح: عدّادك يعمل لكن نتائجه تبدو مرتبكة على ملف من 10000 سطر. ما أول خطوة حكيمة؟',
        en: 'From the debugging lesson: your counter works but its results look confusing on a 10000-line file. What is the wisest first step?',
      },
      options: [
        { id: 'a', text: { ar: 'صغّر المدخلات: جرّب أول عشرة أسطر أولًا', en: 'Scale down the input: try the first ten lines first' } },
        { id: 'b', text: { ar: 'أعد تشغيل البرنامج مئة مرة وآمل الاختلاف', en: 'Rerun the program a hundred times and hope for a change' } },
        { id: 'c', text: { ar: 'احذف التنظيف ليصبح البرنامج أسرع', en: 'Delete the cleaning to make the program faster' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'ما تنقيحنا به في الفصل الخامس؟ رسالة انتهاء المهلة علمتك شيئًا عن الحجم.', en: 'What did we debug with in chapter 5? The timeout message taught you something about size.' },
        { ar: 'الخطأ يظهر في نص صغير كما يظهر في كبير — لكن بسرعة أكبر بكثير.', en: 'The bug shows on a small text exactly as on a big one — only far faster.' },
        { ar: 'حذف التنظيف يفسد العدّ ولا ينقّحه.', en: 'Deleting cleaning corrupts the count; it never fixes it.' },
        { ar: 'الجواب: أ — صغّر المدخلات ثم افحص الملخصات مثل len(counts).', en: 'Answer: a — scale down the input, then check summaries like len(counts).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-increment',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل: نفّذ d = {} ثم d['x'] = d.get('x', 0) + 1 ثم d['x'] = d.get('x', 0) + 1. كم يطبع print(d['x'])؟",
        en: "Without running: execute d = {} then d['x'] = d.get('x', 0) + 1 then d['x'] = d.get('x', 0) + 1. What does print(d['x']) show?",
      },
      answer: '2',
      solution: '2',
      tolerance: 0,
      hints: [
        { ar: 'تتبّع أول إسناد: المفتاح x غائب فأعاد get الافتراضية 0.', en: 'Trace the first assignment: key x is absent, so get returned the default 0.' },
        { ar: 'تتبّع ثاني إسناد: الآن المفتاح موجود بقيمة 1.', en: 'Trace the second assignment: the key now exists with value 1.' },
        { ar: 'نمط العدّ الكلاسيكي: كل استدعاء يزيد العدّاد بواحد.', en: 'The classic counting pattern: every call bumps the counter by one.' },
        { ar: 'الجواب: 2', en: 'Answer: 2' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-missing-else',
      required: true,
      brokenCode: "text = 'sun sun moon'\ncounts = dict()\nfor word in text.split():\n    if word not in counts:\n        counts[word] = 1\n    counts[word] = counts[word] + 1\nprint(counts['sun'])\nprint(counts['moon'])",
      prompt: {
        ar: 'عدّاد الكلمات يضخّم الأرقام: المتوقع أن sun تساوي 2 وmoon تساوي 1، لكن البرنامج يطبع 3 ثم 2 — كل عدّاد زاد واحدًا زائدًا (الكلمة تُعدّ مرتين في أول ظهور لها). شغّل الكود المعطوب واتبع دورة التنقيح: تتبّع الدورة الأولى للكلمة sun — ماذا يوجد بعد إنشاء العنصر بقيمة 1 في نفس الدورة؟ اكتشف السطر الناقص وأصلح البرنامج ليطبع 2 ثم 1.',
        en: 'The word counter inflates its numbers: sun should be 2 and moon should be 1, but the program prints 3 then 2 — every counter grew one too big (the word is counted twice on its first appearance). Run the broken code and follow the debugging cycle: trace the first pass for the word sun — what comes after the item is born with value 1 in that same pass? Find the missing line and fix the program to print 2 then 1.',
      },
      solution: "text = 'sun sun moon'\ncounts = dict()\nfor word in text.split():\n    if word not in counts:\n        counts[word] = 1\n    else:\n        counts[word] = counts[word] + 1\nprint(counts['sun'])\nprint(counts['moon'])",
      tests: [
        {
          id: 't1',
          name: { ar: 'sun عُدّت مرتين', en: 'sun counted twice' },
          code: "assert counts['sun'] == 2, 'expected: 2 | actual: %r' % counts['sun']",
          expected: '2',
        },
        {
          id: 't2',
          name: { ar: 'moon عُدّت مرة', en: 'moon counted once' },
          code: "assert counts['moon'] == 1, 'expected: 1 | actual: %r' % counts['moon']",
          expected: '1',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع 2 ثم 1', en: 'Prints 2 then 1' },
          code: "assert '2' in __learner_output__ and '1' in __learner_output__, ('expected: 2 then 1 | actual: %r' % __learner_output__)",
          expected: '2 then 1',
        },
      ],
      hints: [
        { ar: 'الدورة الأولى لـ sun: الشرط if not in يتحقق فيُنشأ العنصر بقيمة 1 — ثم ماذا يوجد بعده في نفس الدورة؟', en: 'The first pass for sun: the if not in test holds, so the item is born with value 1 — then what comes next in that same pass?' },
        { ar: 'السطر counts[word] = counts[word] + 1 ليس داخل else — فيُنفَّذ دائمًا حتى بعد الإنشاء.', en: 'The line counts[word] = counts[word] + 1 is not inside an else — it always runs, even right after creation.' },
        { ar: 'أضف else: قبل سطر الزيادة وزد إزاحته أربعة فراغات ليصبح جسم else.', en: 'Add else: before the increment line and indent it four spaces to become the else body.' },
        { ar: "text = 'sun sun moon'\ncounts = dict()\nfor word in text.split():\n    if word not in counts:\n        counts[word] = 1\n    else:\n        counts[word] = counts[word] + 1\nprint(counts['sun'])\nprint(counts['moon'])", en: "text = 'sun sun moon'\ncounts = dict()\nfor word in text.split():\n    if word not in counts:\n        counts[word] = 1\n    else:\n        counts[word] = counts[word] + 1\nprint(counts['sun'])\nprint(counts['moon'])" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — عدّادك الخاص\n# Your playground — your very own counter\n\nimport string\n\ntext = 'Go now! Go, go! NOW, go.'\nclean = text.translate(str.maketrans('', '', string.punctuation)).lower()\ncounts = dict()\nfor word in clean.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts)\nbest = None\nbest_word = None\nfor word in counts:\n    if best is None or counts[word] > best:\n        best = counts[word]\n        best_word = word\nprint('top:', best_word, best)",
      prompt: {
        ar: 'جرّب: أسطرًا أخرى بترقيم وحروف كبيرة، وراقب كيف تتوحّد الأشكال في عدّاد واحد، ثم غيّر النص بحيث تتساوى كلمتان في الأعلى ولاحظ أيهما يفوز بحلقة الأكبر. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: other lines with punctuation and capitals, watch the costumes merge into one counter, then change the text so two words tie at the top and see which one the max loop crowns. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الأول: برنامجك يقرأ story.txt ويعدّ كلماته — أي مكون يحفظ الملف بعد انطفاء الجهاز؟',
            en: 'From chapter 1: your program reads story.txt and counts its words — which component keeps the file after the machine goes off?',
          },
          options: [
            { id: 'a', text: { ar: 'الذاكرة الثانوية مثل الأقراص', en: 'Secondary memory such as disks' } },
            { id: 'b', text: { ar: 'وحدة المعالجة المركزية', en: 'The CPU' } },
            { id: 'c', text: { ar: 'الذاكرة الرئيسية وحدها', en: 'Main memory alone' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الإصرار يسكن الذاكرة الثانوية — أول درس من الفصل السابع ولا يزال أساس كل برنامج ملفات.',
            en: 'Persistence lives in secondary memory — the first lesson of chapter 7 and still the foundation of every file program.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثاني: في counts[word] = counts.get(word, 0) + 1 — ما الترتيب الصحيح لما يحدث؟',
            en: 'From chapter 2: in counts[word] = counts.get(word, 0) + 1 — what is the correct order of events?',
          },
          options: [
            { id: 'a', text: { ar: 'يُحسب الطرف الأيمن (يقرأ القيمة أو 0 ويزيد واحدًا) ثم يُخزن الناتج في المفتاح', en: 'The right side computes (reads the value or 0 and adds one), then the result is stored at the key' } },
            { id: 'b', text: { ar: 'يُخزن أولًا ثم يُقرأ من المفتاح', en: 'It stores first, then reads from the key' } },
            { id: 'c', text: { ar: 'يتساءل المستخدم عن القيمة الجديدة', en: 'The user is asked for the new value' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الإسناد يقرأ ثم يحسب ثم يخزّن — قاعدة التحديث نفسها من الفصل الثاني على مفاتيح القاموس.',
            en: 'Assignment reads, then computes, then stores — the same chapter-2 update rule, now on dictionary keys.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث: الكتاب يلف open داخل try لأنه قد يفشل — ماذا نكتب في except؟',
            en: 'From chapter 3: the book wraps open inside try because it can fail — what goes in except?',
          },
          options: [
            { id: 'a', text: { ar: 'رسالة ودية مثل File cannot be opened بدل تقرير خطأ صريح', en: 'A friendly message like File cannot be opened instead of a raw traceback' } },
            { id: 'b', text: { ar: 'إعادة تشغيل البرنامج تلقائيًا', en: 'An automatic program restart' } },
            { id: 'c', text: { ar: 'لا شيء — try وحده يكفي', en: 'Nothing — try alone is enough' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'استعادة شيفرة صغيرة: السطر الخطر مغلّف والاستثناء الملتقط يطبع رسالة — نمط اختيار الملف من الفصل السابع أيضًا.',
            en: 'Small-code recovery: the risky line wrapped, the caught exception prints a message — the same file-choice pattern from chapter 7.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: "ومن الفصل الخامس: for ch in 'abc': — كم دورة تنفّذ؟",
            en: "From chapter 5: for ch in 'abc': — how many passes run?",
          },
          options: [
            { id: 'a', text: { ar: 'ثلاث دورات — محرف في كل دورة', en: 'Three passes — one character per pass' } },
            { id: 'b', text: { ar: 'دورة واحدة — النص كله دفعة واحدة', en: 'One pass — the whole text at once' } },
            { id: 'c', text: { ar: 'أربع دورات — محرف لكل حرف ومحرف للنهاية', en: 'Four passes — one per letter plus one for the end' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'دورة لكل عنصر — وهذا هو المرور الذي جعل هيستوغرام الأحرف ممكنًا قبل كلمات.',
            en: 'One pass per item — the traversal that made the letter histogram possible before the word one.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الفصل السابع: كتبت ملفًا بـ write وأردت قراءته فورًا — ما الشرط قبل الفتح للقراءة؟',
            en: 'From chapter 7: you wrote a file with write and want to read it right away — what must happen before opening for reading?',
          },
          options: [
            { id: 'a', text: { ar: 'close الكاتب أولًا كي تصل البيانات من المخزن المؤقت إلى الملف', en: 'close the writer first so the data leaves the buffer and reaches the file' } },
            { id: 'b', text: { ar: 'فتحه بوضع w أيضًا لضمان التوافق', en: 'Opening it in w mode too, for compatibility' } },
            { id: 'c', text: { ar: 'حذف الملف وإعادة إنشائه من جديد', en: 'Deleting the file and recreating it fresh' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القاعدة الذهبية من المشروع السابق: أغلق الكاتب قبل أن تفتح القارئ — وإلا قرأت ملفًا فارغًا أو ناقصًا.',
            en: 'The golden rule from the last project: close the writer before opening the reader — or you read an empty or partial file.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'وسؤال الفصل نفسه: لماذا counts[word] = counts.get(word, 0) + 1 أنسب من counts[word] = counts[word] + 1 للعدّ؟',
            en: 'And a chapter question: why is counts[word] = counts.get(word, 0) + 1 better than counts[word] = counts[word] + 1 for counting?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن get تعيد الافتراضية عند أول ظهور فلا يرمي KeyError', en: 'Because get returns the default on first appearance, so no KeyError is thrown' } },
            { id: 'b', text: { ar: 'لأن get تجعل الطباعة مرتبة أبجديًا', en: 'Because get makes the printing alphabetical' } },
            { id: 'c', text: { ar: 'لأن get تحذف المفتاح القديم قبل الزيادة', en: 'Because get deletes the old key before incrementing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'أول ظهور لا مفتاح له بعد: get يجيب بصفر آمن بدل صرخة KeyError — أربعة أسطر صارت سطرًا وأمِنّا العدّ.',
            en: 'A first appearance has no key yet: get answers a safe zero instead of a KeyError scream — four lines became one and the count stayed safe.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "counts[word] = counts.get(word) + 1",
          right: "counts[word] = counts.get(word, 0) + 1",
          note: {
            ar: 'بلا وسيط افتراضي يعيد get قيمة None فيرمي None + 1 خطأ TypeError عند أول ظهور. الافتراضية 0 هي قلب نمط العدّ كله.',
            en: 'Without a default argument get returns None, so None + 1 throws a TypeError on the first appearance. The default 0 is the heart of the whole counting idiom.',
          },
        },
        {
          wrong: "if word not in counts:\n    counts[word] = 1\ncounts[word] = counts[word] + 1",
          right: "counts[word] = counts.get(word, 0) + 1",
          note: {
            ar: 'إنشاء ثم زيادة في نفس الدورة = عدّ زائف يضخّم كل عدّاد بواحد. إما else أو اختصار get — ثلاثة أسطر صارت سطرًا.',
            en: 'Create-then-increment in the same pass = a fake count inflating every counter by one. Either an else or the get idiom — three lines became one.',
          },
        },
        {
          wrong: "fhand = open('story-l6.txt')\nfhand = fhand.lower()\nfhand = fhand.translate(str.maketrans('', '', string.punctuation))",
          right: "fhand = open('story-l6.txt')\nfor line in fhand:\n    line = line.lower()\n    line = line.translate(str.maketrans('', '', string.punctuation))",
          note: {
            ar: 'التنظيف توابع سلاسل تُطبق على كل سطر داخل الحلقة — المعرّف لا يحمل lower ولا translate وتطبيقهما عليه يرمي AttributeError.',
            en: 'Cleaning methods belong to strings applied to every line inside the loop — the handle owns no lower or translate, and applying them to it throws an AttributeError.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'القاموس يترجم مفتاحًا إلى قيمة، والهيستوغرام عدّاداته تُفتح عند أول ظهور — وget يحرس العدّ من KeyError.', en: 'A dictionary translates a key to a value, the histogram opens its counters at first appearance — and get guards the count from KeyError.' },
        { ar: 'عدّ الكلمات = ملفات + قوائم + قواميس + تنظيف: translate وlower وsplit قبل العدّ، والحلقات المتداخلة تمر على كل كلمة.', en: 'Word counting = files + lists + dictionaries + cleaning: translate, lower and split before counting, and nested loops visiting every word.' },
        { ar: 'التقرير يمشي على المفاتيح: تصفية وترتيب ومجموع — والأكبر بعَلَم None إلى أن يأتي عالم المجموعات في الفصل القادم.', en: 'The report walks the keys: filtering, sorting, summing — and the max via a None flag until the tuples world arrives next chapter.' },
        { ar: 'التنقيح: صغّر المدخلات، وافحص الملخصات، واكتب فحوصًا ذاتية — واحرُس من العدّ الزائد والعدّادات المكررة.', en: 'Debugging: scale down the input, check summaries, write self-checks — and guard against inflated counts and duplicated counters.' },
      ],
      reflectPrompt: {
        ar: "عدّادك جاهز لأي نص: خذ مقالًا حقيقيًا وخمّن قبل التشغيل الكلمات الثلاث الأعلى — ثم افحص بالملخصات هل صوّب توقّعك؟ وماذا سيفعل البرنامج بكلمة مثل don't بعد التنظيف؟",
        en: "Your counter is ready for any text: take a real article and bet on its top three words before running — then check with summaries whether your bet was right? And what will the program do to a word like don't after cleaning?",
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch9.s6', pages: 'ص152 / pp.152' },
        { book: 'PY4E', section: 'py4e.ch9.s7', pages: 'ص153 / pp.153' },
        { book: 'PY4E', section: 'py4e.ch9.s8', pages: 'ص154 / pp.154' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch9.s6', pages: 'ص152 / pp.152' },
    { book: 'PY4E', section: 'py4e.ch9.s7', pages: 'ص153 / pp.153' },
    { book: 'PY4E', section: 'py4e.ch9.s8', pages: 'ص154 / pp.154' },
  ],
} satisfies Lesson;

export default lesson;
