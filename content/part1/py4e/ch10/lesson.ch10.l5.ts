import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch10.l5 — "The Most Common Words / الكلمات الأكثر تكرارًا"
 * Aligned with PY4E ch10 s6 (الكلمات الأكثر تكرارًا) + s7 (استخدام الصفوف كمفاتيح ضمن القواميس).
 * All expression is original. The worked program is a self-contained miniature of the
 * book's count3.py (file created in-memory first — no input(), deterministic).
 */
const lesson = {
  id: 'py4e.ch10.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 10,
  title: { ar: 'الكلمات الأكثر تكرارًا', en: 'The Most Common Words' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch10.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الوعد الذي قطعناه في الفصل التاسع يُوفّى اليوم: عدّاد الكلمات صار جاهزًا لكنه قائمة فوضوية من مئات الأزواج — البحث فيه يدويًا غير عملي. الآن خمسة أسطر جديدة فتصير لوحة تتصدّرها الكلمات الأكثر تكرارًا في نص كامل — من أشهر أمثلة تحليل النصوص بلغة بايثون. وبعد البرنامج الشهير نغلق الدرس بفكرة نظيفة: الصفوف مفاتيح في القواميس — نقطتا إحداثيّين كمفتاح وجواب عند كل نقطة. بنهاية الدرس ستكون قادرًا على: تركيب خطوات البرنامج الأربع الأخيرة، وتفسير كسر التكافؤات في اللوحة، واستخدام صف كمفتاح مركب.',
        en: 'The chapter-9 promise is honored today: the word counter is ready but its output is a messy list of hundreds of pairs — searching it by hand is impractical. Five new lines turn it into a board led by the most frequent words of a full text — one of the most famous text-analysis examples in Python. And after the famous program the lesson closes with a clean idea: tuples as dictionary keys — two coordinates as a key, an answer waiting at each point. By the end of this lesson you will be able to: assemble the program\u2019s final four steps, explain the board\u2019s tie-breaking, and use a tuple as a compound key.',
      },
    },
    {
      kind: 'predict',
      code: "counts = {'the': 7, 'and': 3, 'of': 5}\nt = list()\nfor word, count in counts.items():\n    t.append((count, word))\nt.sort(reverse=True)\nprint(t[0])",
      question: {
        ar: 'أي زوج سيقف في قمة القائمة بعد الترتيب التنازلي — الكلمة الأبجدية الأولى أم العدد الأكبر؟',
        en: 'Which pair will stand at the top after the descending sort — the alphabetically first word or the largest count?',
      },
      reveal: {
        ar: "يطبع (7, 'the') — لأن الصف يبدأ بالعدد فصار أول الحكام. and عددها 3 تراجعت رغم تقدمها الأبجدي، لأن المقارنة وقفت عند العنصر الأول: 5 و7 قبل أي نظرة إلى الحروف. هذه هي الحيلة كلها: من يسبق الصف يحكم الترتيب.",
        en: "It prints (7, 'the') — the tuple leads with the count, so the count is the first judge. and, counting 3, fell behind despite its alphabetical head start, because comparison stopped at the first element: 5 and 7 were weighed before any glance at letters. That is the whole trick: whoever leads the tuple governs the order.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'البرنامج الكامل: من ملف إلى لوحة', en: 'The full program: file to board' },
      chunks: [
        {
          ar: 'القسم الأول تراث الفصل التاسع: نفتح الملف ونمر على الأسطر، وننظف بـ translate من علامات الترقيم، ونصغّر بـ lower، ونقطع بـ split، ونعدّ بـ counts[word] = counts.get(word, 0) + 1. حتى هذه النقطة القاموس فوضوي — طباعته المجردة غير عملية للبحث عن الكلمات المتصدرة.',
          en: 'The first section is chapter-9 heritage: open the file and walk the lines, clean punctuation with translate, lowercase with lower, split with split, count with counts[word] = counts.get(word, 0) + 1. Up to this point the dictionary is untidy — printing it raw is impractical for finding the leading words.',
        },
        {
          ar: "القسم الثاني هو الجديد: نبني قائمة من صفوف (عدد، كلمة) بحلقة for word, count in counts.items(): lst.append((count, word)). ثم lst.sort(reverse=True) فتصدر أعلى الأعداد، وعند التكافؤ يرتب المفتاح أبجديًا. ثم تقطع الشريحة lst[:10] أعلى عشرة، وحلقة أخيرة تفكك وتطبع: for count, word in lst[:10]: print(count, word).",
          en: "The second section is the new part: build a list of (count, word) tuples via for word, count in counts.items(): lst.append((count, word)). Then lst.sort(reverse=True) leads with the highest counts, and ties fall back to the alphabetical key. Then the slice lst[:10] takes the top ten, and a final loop unpacks and prints: for count, word in lst[:10]: print(count, word).",
        },
        {
          ar: 'خرج الكتاب على مسرحية روميو وجولييت كاملة يتصدره i بـ 61 ثم and بـ 42 وromeo بـ 40 — وانظر كيف تعادلت to وthe عند 34 فحسم أبجديًا تنازليًا. بايثون بخمسة أسطر فوق عدّادك القديم حوّل ملفًا فوضويًا إلى ترتيب معلوماتي — وهذا سر جاذبيتها لتحليل البيانات.',
          en: 'The book\u2019s output over the full Romeo and Juliet is led by i at 61, then and at 42 and romeo at 40 — and see how to and the tied at 34, settled alphabetically descending. With five lines above your old counter, Python turned a chaotic file into informational order — the secret of its appeal to data analysts.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الصفوف مفاتيح في القواميس', en: 'Tuples as dictionary keys' },
      chunks: [
        {
          ar: "والآن القفزة الأخيرة: هل يجوز أن يكون مفتاح القاموس صفًّا؟ نعم — والقائمة لا! القاموس يستخدم خوارزمية الهاش التي تتطلب مفتاحًا لا يتغير تحت قدميه، والقائمة قابلة للتعديل فترمي TypeError: unhashable type: 'list'، أما الصف فمجمد فيصلح مفتاحًا. هذا هو ثمرة الثبات الذي بدأنا به الفصل: المجمد وحده يُوثق بمكان واحد ثابت.",
          en: "Now the final leap: may a dictionary key be a tuple? Yes — while a list may not! The dictionary runs the hash algorithm, which demands a key that never shifts beneath it; a list is mutable and throws TypeError: unhashable type: 'list', while a tuple is frozen and qualifies as a key. That is the fruit of the immutability this chapter opened with: only the frozen can be pinned to one fixed place.",
        },
        {
          ar: "الصيغة المركبة: directory['Cleese', 'John'] = '555-1234' — داخل الأقواس صف ضمني (لقب، اسم) هو المفتاح الواحد، وقيمته رقم الهاتف. أو شبكة إحداثيات: points[(0, 0)] = 'origin' وpoints[(1, 2)] = 'tree' — نقطتان كمفتاحين وقيمة عند كل نقطة. بهذا النمط تبني جداول ثنائية البعد بلا قوائم داخل قوائم.",
          en: "The compound form: directory['Cleese', 'John'] = '555-1234' — inside the brackets an implicit (surname, name) tuple is the single key, with a phone number as its value. Or a coordinate grid: points[(0, 0)] = 'origin' and points[(1, 2)] = 'tree' — two points as keys, a value waiting at each. With this pattern you build two-dimensional tables without lists nested inside lists.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'البرنامج الشهير بثوب مصغّر', en: 'The famous program, miniaturized' },
      code: "import string\ntext = 'But soft, what light through yonder window breaks?\\nIt is the east, and Juliet is the sun.\\nArise, fair sun, and kill the envious moon,\\nWho is already sick and pale with grief.'\nout = open('romeo.txt', 'w')\nout.write(text)\nout.close()\n\nfhand = open('romeo.txt')\ncounts = dict()\nfor line in fhand:\n    line = line.translate(str.maketrans(' ', ' ', string.punctuation))\n    line = line.lower()\n    words = line.split()\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\n\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nfor count, word in lst[:5]:\n    print(count, word)",
      explanation: {
        ar: 'الملف وُلد بـ w من الفصل السابع ثم قُرئ سطرًا سطرًا ونُظّف ونُصغّر ونُعدّ بالقاموس مع get — تراث الفصل التاسع كاملًا. ثم التمييز: صفوف (عدد، كلمة)، فالترتيب التنازلي فالشريحة أعلى 5. الناتج: the وis وand عند 3 ثم sun عند 2 ثم yonder عند 1 — والكلمات المتكافئة ترتّب أبجديًا تنازليًا (the قبل is قبل and، وyonder قبل نظيراتها). خمسة أسطر فوق العدّاد القديم صنعت لوحة الصدارة.',
        en: 'The file was born in w mode from chapter 7, then read line by line, cleaned, lowercased, and counted with a dictionary and get — chapter-9 heritage in full. Then decorating: (count, word) tuples, descending sort, top-5 slice. The output: the, is and and at 3, then sun at 2 and yonder at 1 — tied words ordered alphabetically descending (the before is before and, yonder ahead of its equals). Five lines above the old counter produced the leaderboard.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.top-two',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'قاموس التكرارات معطى في المحرر: counts = {"i": 61, "and": 42, "romeo": 40, "thee": 24}. أنشئ قائمة lst، واملأها بحلقة for على counts.items() بصفوف (العدد، الكلمة)، ورتّبها تنازليًا، ثم اطبع الكلمتين الأوليين في سطرين: في كل دورة اطبع word ثم count مع فاصل مسافة — print(word, count). المتوقع: i 61 ثم and 42.',
        en: 'The frequency dictionary is given in the editor: counts = {"i": 61, "and": 42, "romeo": 40, "thee": 24}. Create a list lst, fill it with a for loop over counts.items() building (count, word) tuples, sort it descending, then print the top two words on two lines: each pass print word then count with a space — print(word, count). Expected: i 61 then and 42.',
      },
      starterCode: "counts = {'i': 61, 'and': 42, 'romeo': 40, 'thee': 24}\n# ميّز ثم رتّب ثم اطبع أعلى اثنين / decorate, sort, print the top two:\n",
      solution: "counts = {'i': 61, 'and': 42, 'romeo': 40, 'thee': 24}\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nfor count, word in lst[:2]:\n    print(word, count)",
      tests: [
        {
          id: 't1',
          name: { ar: 'lst قائمة الأزواج المرتبة تنازليًا', en: 'lst is the list of pairs sorted descending' },
          code: "assert lst == [(61, 'i'), (42, 'and'), (40, 'romeo'), (24, 'thee')], 'expected: (count, word) pairs sorted descending | actual: %r' % (lst,)",
          expected: '(count, word) pairs sorted descending',
        },
        {
          id: 't2',
          name: { ar: 'القمة i 61 مطبوعة', en: 'The top pair i 61 is printed' },
          code: "assert 'i 61' in __learner_output__, ('expected: i 61 | actual: %r' % __learner_output__)",
          expected: 'i 61',
        },
        {
          id: 't3',
          name: { ar: 'الوصيف and 42 مطبوع', en: 'The runner-up and 42 is printed' },
          code: "assert 'and 42' in __learner_output__, ('expected: and 42 | actual: %r' % __learner_output__)",
          expected: 'and 42',
        },
      ],
      hints: [
        { ar: 'التمييز يضع العدد أولًا لأنه مقياس الترتيب: lst.append((count, word)).', en: 'Decorating puts the count first because it is the ranking measure: lst.append((count, word)).' },
        { ar: 'الشريحة lst[:2] تحفظ أعلى اثنين فقط — والطباعة داخل حلقة تتفكك بينهما.', en: 'The slice lst[:2] keeps only the top two — printing happens in a loop that unpacks them.' },
        { ar: 'الهيكل:\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nfor count, word in lst[:2]:\n    print(word, count)', en: 'The skeleton:\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nfor count, word in lst[:2]:\n    print(word, count)' },
        { ar: "lst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nfor count, word in lst[:2]:\n    print(word, count)", en: "lst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nfor count, word in lst[:2]:\n    print(word, count)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-pairs',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "t = [(24, 'love'), (40, 'romeo')]\nt.sort(reverse=True)\nfor count, word in t:\n    print(word, count)",
      solution: 'romeo 40\nlove 24',
      answer: 'romeo 40\nlove 24',
      hints: [
        { ar: 'sort(reverse=True) يضع العدد الأكبر أولًا في قمة القائمة.', en: 'sort(reverse=True) puts the larger count at the top of the list.' },
        { ar: 'print(word, count) يطبع الكلمة قبل العدد — عكس ترتيب الصف.', en: 'print(word, count) prints the word before the count — reversing the tuple order.' },
        { ar: 'دورتان فقط — قائمة من صفين.', en: 'Only two passes — the list holds two tuples.' },
        { ar: 'الخرْج:\nromeo 40\nlove 24', en: 'The output:\nromeo 40\nlove 24' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-decorate-order',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا نضع العدد قبل الكلمة في الصف (count, word) قبل الترتيب؟',
        en: 'Why does the (count, word) tuple put the count before the word before sorting?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن sort يقارن بالعنصر الأول فترتب الأزواج بالعدد', en: 'Because sort compares the first element, so pairs rank by count' } },
        { id: 'b', text: { ar: 'لأن القاموس يفرض هذا الترتيب عند التحويل', en: 'Because the dictionary forces this order on conversion' } },
        { id: 'c', text: { ar: 'لأن items يعيد الأزواج معكوسة أصلًا', en: 'Because items returns the pairs inverted already' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'راجع قاعدة المقارنة: أول موضع مختلف يحسم.', en: 'Recall the comparison rule: the first differing position decides.' },
        { ar: 'items يعيد (مفتاح، قيمة) — نحن من يقلب الترتيب عند البناء.', en: 'items returns (key, value) — we are the ones flipping the order while building.' },
        { ar: 'ولو أردت الترتيب أبجديًا بالكلمة لقلبت الصف.', en: 'And had you wanted alphabetical order by word, you would flip the tuple.' },
        { ar: 'الجواب: لأن sort يقارن بالعنصر الأول — فالعدد يتقدم الصف ليحكم.', en: 'Answer: because sort compares the first element — the count leads the tuple to rule.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-book-i',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'من خرج الكتاب الشهير على نص روميو وجولييت الكاملة (السطور العشرة الأولى): كم عدد تكرارات الكلمة التي تحتل القمة؟',
        en: 'From the book\u2019s famous output over the full Romeo and Juliet text (its first ten lines): how many repetitions does the top word have?',
      },
      answer: '61',
      solution: '61',
      tolerance: 0,
      hints: [
        { ar: 'خرج الكتاب يبدأ بسطر يذكر العدد ثم الكلمة.', en: 'The book\u2019s output opens with a line naming the count then the word.' },
        { ar: 'الكلمة المتصدرة هي i — حرف واحد.', en: 'The leading word is i — a single letter.' },
        { ar: 'العدد أكبر من 60 وأقل من 62.', en: 'The count is greater than 60 and less than 62.' },
        { ar: 'الجواب: 61', en: 'Answer: 61' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — لوحتك الصغيرة\n# Your playground — your own little board\n\ncounts = {"love": 24, "romeo": 40, "juliet": 32}\nlst = list()\nfor word, count in counts.items():\n    lst.append((count, word))\nlst.sort(reverse=True)\nprint(lst)\nfor count, word in lst[:2]:\n    print(count, word)\n\ngrid = {}\ngrid[(0, 0)] = "start"\ngrid[(1, 2)] = "treasure"\nprint(grid)\nprint(grid[(1, 2)])',
      prompt: {
        ar: 'جرّب بنفسك: لوحتك على قاموسك الخاص، ثم اقلب الصف إلى (كلمة، عدد) وراقب انقلاب الترتيب، ثم شغّل الشبكة الإحداثية واطبع نقطة بأقواسها. وحاول عمدًا grid[[3, 4]] = "x" ولاحظ الرسالة. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: run the board on your own dictionary, then flip the tuple to (word, count) and watch the order collapse, then run the coordinate grid and print a point with its brackets. And deliberately try grid[[3, 4]] = "x" to read the message. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل التاسع: ماذا يفعل counts.get(word, 0)؟',
            en: 'From chapter 9: what does counts.get(word, 0) do?',
          },
          options: [
            { id: 'a', text: { ar: 'يعيد العدد الحالي للكلمة أو 0 إن لم توجد — فيصير العد سطرًا واحدًا', en: 'Returns the word\u2019s current count or 0 if absent — making counting a single line' } },
            { id: 'b', text: { ar: 'يحذف الكلمة من القاموس ويعيد قيمتها القديمة', en: 'Removes the word from the dictionary and returns its old value' } },
            { id: 'c', text: { ar: 'يرمي KeyError إن لم توجد الكلمة', en: 'Throws KeyError if the word is absent' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'get ببديله الافتراضي أنهى عصر if/else الطويل في العدّ — وفي برنامج اليوم احتسب كل الكلمات في سطر واحد.',
            en: 'get with its default ended the era of long if/else counting — and in today\u2019s program it counted every word in one line.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السابع: ماذا تعيد line.split() على سطر من نص الملف؟',
            en: 'From chapter 7: what does line.split() return on a line of the file text?',
          },
          options: [
            { id: 'a', text: { ar: 'قائمة كلمات مقسومة على المسافات', en: 'A list of words split on whitespace' } },
            { id: 'b', text: { ar: 'صفًّا من الكلمات غير قابل للتعديل', en: 'An immutable tuple of words' } },
            { id: 'c', text: { ar: 'السطر نفسه محذوفةً منه المسافات الزائدة فقط', en: 'The same line with extra whitespace removed only' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split ينتج قائمة الكلمات التي تمشي عليها حلقة العدّ الداخلية — بدونها لما تفرقت الكلمات عن بعضها أصلًا.',
            en: 'split produces the word list the inner counting loop walks — without it the words would never separate in the first place.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا لا يجوز استخدام قائمة كمفتاح في قاموس؟',
            en: 'Why may a list not be used as a dictionary key?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن القوائم قابلة للتعديل فترمي TypeError: unhashable type: list', en: "Because lists are mutable and throw TypeError: unhashable type: 'list'" } },
            { id: 'b', text: { ar: 'لأن القوائم أبطأ من القواميس', en: 'Because lists are slower than dictionaries' } },
            { id: 'c', text: { ar: 'لأن القوائم لا تفهرس بأعداد صحيحة', en: 'Because lists are not indexed by integers' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'خوارزمية الهاش تحتاج مفتاحًا مجمدًا لا يتغير مكانًا — والصف غير قابل للتعديل فيصلح، والقائمة ترمي الخطأ.',
            en: 'The hash algorithm needs a frozen key that never changes address — the immutable tuple qualifies while the list throws the error.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل السادس: ماذا تفعل line.lower() قبل العدّ؟',
            en: 'From chapter 6: what does line.lower() do before counting?',
          },
          options: [
            { id: 'a', text: { ar: 'توحّد الحالة فلا تنقسم الكلمة إلى The وthe بعدادين', en: 'Unifies case so a word does not split into The and the as two counters' } },
            { id: 'b', text: { ar: 'تحذف المسافات من طرفي السطر', en: 'Strips whitespace from the line ends' } },
            { id: 'c', text: { ar: 'تحوّل السطر إلى قائمة كلمات', en: 'Turns the line into a list of words' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'بدون lower صارت في روميو الكاملة نسختان لكل اسم — ولوحة الصدارة ستضاعف الأسماء بدل تصنيفها.',
            en: 'Without lower, the full Romeo text would hold two copies of every name — and the leaderboard would double names instead of ranking them.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'lst.append((word, count))',
          right: 'lst.append((count, word))',
          note: {
            ar: 'بالكلمة أولًا يترتب كل شيء أبجديًا لا بالتكرار — القمة صارت كلمة تبدأ بحرف متقدم. من يسبق الصف يحكم الترتيب: ضع العدد أولًا.',
            en: 'Word first and everything sorts alphabetically, not by frequency — the top becomes a word with an early letter. Whoever leads the tuple rules: put the count first.',
          },
        },
        {
          wrong: 'lst.sort()  # أريد الأكثر تكرارًا',
          right: 'lst.sort(reverse=True)',
          note: {
            ar: 'الترتيب الافتراضي تصاعدي فتصدر اللوحة أقل الكلمات تكرارًا — لوحة مقلوبة تمامًا. التنازلي يحتاج reverse=True.',
            en: 'The default sort is ascending, so the board would lead with the least frequent words — a completely inverted board. Descending needs reverse=True.',
          },
        },
        {
          wrong: "markers[[1, 2]] = 'tree'",
          right: "markers[(1, 2)] = 'tree'",
          note: {
            ar: "قائمة كمفتاح ترمي TypeError: unhashable type: 'list' — القوائم تتحرك والقاموس يطلب مفتاحًا مجمدًا. صفّها فتجمد وتصلح مفتاحًا.",
            en: "A list as key throws TypeError: unhashable type: 'list' — lists move and dictionaries demand a frozen key. Make it a tuple and it freezes into a valid key.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'البرنامج الشهير = عدّاد الفصل التاسع + خمسة أسطر: صفوف (عدد، كلمة)، ترتيب تنازلي، شريحة أعلى 10، حلقة طباعة.', en: 'The famous program = the chapter-9 counter + five lines: (count, word) tuples, a descending sort, a top-10 slice, a printing loop.' },
        { ar: 'التكافؤات تحسم أبجديًا بالمفتاح — لذلك ظهرت to وthe متجاورتين عند 34 في خرج الكتاب.', en: 'Ties break alphabetically by key — that is why to and the appeared side by side at 34 in the book\u2019s output.' },
        { ar: 'الصفوف مفاتيح صالحة في القواميس لأنها مجمدة — والقوائم ترمي TypeError: unhashable type: list.', en: "Tuples are valid dictionary keys because they are frozen — lists throw TypeError: unhashable type: 'list'." },
      ],
      reflectPrompt: {
        ar: 'نص من ألف كلمة ولوحة أعلى عشرة: اذكر سؤالين واقعيين يمكن أن تجيب عنهما بهذه اللوحة — في بريدك الوارد، في كتابك المدرسي، في تعليقات تطبيق تستخدمه.',
        en: 'A thousand-word text and a top-ten board: name two real questions this board could answer — about your inbox, a school textbook, or the comments of an app you use.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch10.s6', pages: 'ص164 / pp.164' },
        { book: 'PY4E', section: 'py4e.ch10.s7', pages: 'ص166 / pp.166' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch10.s6', pages: 'ص164 / pp.164' },
    { book: 'PY4E', section: 'py4e.ch10.s7', pages: 'ص166 / pp.166' },
  ],
} satisfies Lesson;

export default lesson;
