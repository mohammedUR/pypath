import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch9.l3 — "Dictionaries and Files: Counting Words / القواميس والملفات: عدّ الكلمات"
 * Aligned with PY4E ch9 s3 (القواميس والملفات), book p.147.
 * All expression is original.
 * File exercises are SELF-CONTAINED: the solution creates its sample file
 * with 'w' before reading (Pyodide MEMFS verified working).
 */
const lesson = {
  id: 'py4e.ch9.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 9,
  title: { ar: 'القواميس والملفات: عدّ الكلمات', en: 'Dictionaries and Files: Counting Words' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch9.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حان وقت الدمج: حلقات الملفات من الفصل السابع، وقوائم split من الفصل الثامن، والقواميس من درسَي اليوم السابقين — النتيجة أشهر برنامج إحصائي عند المبرمجين: عدّاد الكلمات. يقرأ ملفًا سطرًا سطرًا، يفرّق كل سطر إلى كلمات، ويبني هيستوغرامًا لكل كلمات النص. بنهاية الدرس ستكون قادرًا على: فرَق السطور بـ split، وتركيب الحلقات المتداخلة، واختصار الزيادة بـ +=، وكتابة برنامج عدّ كلمات كامل على ملف تنشئه بنفسك.',
        en: 'Time to merge: file loops from chapter 7, split lists from chapter 8, dictionaries from the last two lessons — the result is the most famous statistical program among programmers: the word counter. It reads a file line by line, splits each line into words, and builds a histogram for every word of the text. By the end of this lesson you will be able to: break lines apart with split, compose nested loops, shorten increments with +=, and write a full word-counting program over a file you create yourself.',
      },
    },
    {
      kind: 'predict',
      code: "line = 'It is the east and Juliet is the sun'\nwords = line.split()\nprint(len(words))\nprint(words[0])",
      question: {
        ar: 'ماذا يطبع السطران؟ التابع split رفيقك من دروس القوائم.',
        en: 'What do the two lines print? The split method is your friend from the lists lessons.',
      },
      reveal: {
        ar: 'يطبع 9 ثم It. التابع split يفرّق السطر عند الفراغات ويعيد قائمة كلمات: تسع كلمات، وأولها It. من الآن كل سطر ملف يتحول بسهولة إلى دفعة كلمات جاهزة للعدّ.',
        en: 'It prints 9, then It. The split method breaks the line at spaces and returns a list of words: nine words, the first of them It. From now on, every file line easily turns into a batch of words ready for counting.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من سطر إلى كلمات إلى عدّاد', en: 'From line to words to counter' },
      chunks: [
        {
          ar: "استخدام القواميس لعدّ تكرار الكلمات في الملفات النصية استخدام شائع جدًا. سنأخذ مثالًا صغيرًا من مسرحية روميو وجولييت — نسخة مبسطة بلا علامات ترقيم:\nBut soft what light through yonder window breaks\nIt is the east and Juliet is the sun\n...سنكتب برنامجًا يقرأ أسطر النص ويجزئها إلى قوائم كلمات ثم يمر على كل كلمة ليعدّ تكراراتها حافظًا النتيجة في قاموس.",
          en: "Using dictionaries to count word frequencies in text files is a very common practice. We will take a small example from Romeo and Juliet — a simplified version with no punctuation:\nBut soft what light through yonder window breaks\nIt is the east and Juliet is the sun\n...We will write a program that reads the lines of the text, breaks each into a list of words, then walks every word counting its repetitions while keeping the result in a dictionary.",
        },
        {
          ar: 'الهيكل الثلاثي: حلقة على أسطر الملف، وداخلها split يفرّق السطر، ثم حلقة داخلية على الكلمات. ولكل كلمة السؤال نفسه من الهيستوغرام: هل هي مفتاح موجود؟ إن لا — أنشئ عدّادها بالقيمة 1، وإن نعم — زده.',
          en: 'The three-part skeleton: a loop over the file lines, a split inside it to break the line, then an inner loop over the words. And for every word the same histogram question: is it a present key? If not — create its counter with value 1; if yes — bump it.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الحلقات المتداخلة', en: 'Nested loops' },
      chunks: [
        {
          ar: 'حلقة داخل حلقة تسمى حلقات متداخلة (nested loops): حلقة خارجية وحلقة داخلية. الداخلية تنفّذ جميع تكراراتها من أجل كل تكرار واحد للحلقة الخارجية، فيبدو عملها سريعًا محمومًا بينما الخارجية تمشي بهدوء. هذا النمط يضمن لنا المرور على كل كلمة في كل سطر من النص المدخل.',
          en: 'A loop inside a loop is called nested loops: an outer loop and an inner one. The inner loop runs all of its passes for every single pass of the outer loop, so its work looks fast and frantic while the outer strolls calmly. This pattern guarantees we visit every word in every line of the input text.',
        },
        {
          ar: 'وتذكّر من الفصل الثامن: words = line.split() تعيد قائمة، وحلقة for تمر على القوائم كما تمر على النصوص. فالمجموع: for line in fhand ثم for word in words — طبقتان تغطيان الملف كله كلمة كلمة، ونمط العدّ نفسه من الدرس الماضي يعمل دون تغيير.',
          en: 'And recall from chapter 8: words = line.split() returns a list, and a for loop walks lists just as it walks strings. So the sum: for line in fhand then for word in words — two layers covering the whole file word by word, and the counting pattern from last lesson runs unchanged.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'زيادة مضغوطة + حارس الفتح', en: 'Compact increment + the open guard' },
      chunks: [
        {
          ar: "في تعليمة else استخدمنا الصيغة المختصرة للزيادة: counts[word] += 1 وهي تكافئ counts[word] = counts[word] + 1 — نمط تحديث المتغير من الفصل الثاني بصيغة أخف. وتوجد بدائل شبيهة: -= و*= و/=.",
          en: 'In the else branch we used the compact increment form: counts[word] += 1, equivalent to counts[word] = counts[word] + 1 — the chapter-2 update pattern in a lighter dress. Similar alternatives exist: -=, *= and /=.',
        },
        {
          ar: "برنامج الكتاب يحمي open بـ try/except وعند الفشل يطبع رسالة 'File cannot be opened' ويستدعي exit() — من درس اختيار الملف في الفصل السابع. على منصتنا ننشئ ملفنا بأنفسنا قبل قراءته فلا يفشل الفتح أبدًا، ونغلق المعرّف بـ close بعد العدّ — عادة الفصل السابع الذهبية.",
          en: "The book wraps open in try/except and on failure prints a 'File cannot be opened' message and calls exit() — from the chapter-7 file-choice lesson. On our platform we create our own file before reading it, so the open never fails, and we close the handle with close after counting — the golden chapter-7 habit.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'عدّاد كلمات روميو', en: 'The Romeo word counter' },
      code: "out = open('romeo.txt', 'w')\nout.write('But soft what light through yonder window breaks\\n')\nout.write('It is the east and Juliet is the sun\\n')\nout.write('Arise fair sun and kill the envious moon\\n')\nout.write('Who is already sick and pale with grief\\n')\nout.close()\n\ncounts = dict()\nfhand = open('romeo.txt')\nfor line in fhand:\n    words = line.split()\n    for word in words:\n        if word not in counts:\n            counts[word] = 1\n        else:\n            counts[word] += 1\nfhand.close()\nprint(counts)\nprint(len(counts))",
      explanation: {
        ar: 'المرحلة الأولى كتبت أربعة أسطر وأغلقت الملف — دورة الفصل السابع كاملة. المرحلة الثانية عدّت: 33 كلمة موزعة على 26 كلمة مختلفة، فأجاب len بـ 26. المتكررات وحدها تجاوزت 1: is وand وthe ثلاث مرات وsun مرتين. حلقة العدّ هي الهيستوغرام نفسه من الدرس الماضي — تغيّر المعدود من المحارف إلى الكلمات فقط.',
        en: 'Phase one wrote four lines and closed the file — the full chapter-7 cycle. Phase two counted: 33 words spread over 26 different words, so len answered 26. Only the repeated ones exceed 1: is, and and the three times each, and sun twice. The counting loop is the very histogram from last lesson — only the counted thing changed from characters to words.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.count-file-words',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "برنامج عدّ كلمات مصغر: المرحلة 1 — أنشئ ملفًا اسمه words-l3.txt بوضع 'w' يحوي السطرين بالضبط: 'python is fun' ثم 'python is powerful' (كل سطر بمحرف سطر جديد في نهايته)، ثم أغلقه. المرحلة 2 — افتحه للقراءة وعدّ تكرار كل كلمة في قاموس counts بحلقات متداخلة مع split. المرحلة 3 — أغلق الملف واطبع counts['python'] ثم len(counts). المتوقع: 2 ثم 4.",
        en: "A miniature word counter: Phase 1 — create a file named words-l3.txt in 'w' mode holding exactly these two lines: 'python is fun' then 'python is powerful' (each line with a newline at its end), then close it. Phase 2 — open it for reading and count every word into a dictionary counts with nested loops and split. Phase 3 — close the file and print counts['python'] then len(counts). Expected: 2, then 4.",
      },
      starterCode: "# المرحلة 1: أنشئ الملف بوضع 'w' واكتب السطرين ثم أغلق / phase 1: create the file with 'w', write both lines, close\n# python is fun\n# python is powerful\n# المرحلة 2: افتح للقراءة وعدّ الكلمات في counts بحلقات متداخلة / phase 2: open for reading, count words into counts with nested loops\n# المرحلة 3: أغلق واطبع counts['python'] ثم len(counts) / phase 3: close, then print counts['python'] and len(counts)\n",
      solution: "out = open('words-l3.txt', 'w')\nout.write('python is fun\\n')\nout.write('python is powerful\\n')\nout.close()\n\ncounts = dict()\nfhand = open('words-l3.txt')\nfor line in fhand:\n    words = line.split()\n    for word in words:\n        if word not in counts:\n            counts[word] = 1\n        else:\n            counts[word] += 1\nfhand.close()\nprint(counts['python'])\nprint(len(counts))",
      tests: [
        {
          id: 't1',
          name: { ar: 'كلمة python عُدّت مرتين', en: 'Word python counted twice' },
          code: "assert counts['python'] == 2, 'expected: 2 | actual: %r' % counts['python']",
          expected: '2',
        },
        {
          id: 't2',
          name: { ar: 'كلمة powerful عُدّت مرة', en: 'Word powerful counted once' },
          code: "assert counts['powerful'] == 1, 'expected: 1 | actual: %r' % counts['powerful']",
          expected: '1',
        },
        {
          id: 't3',
          name: { ar: 'أربع كلمات مختلفة', en: 'Exactly four different words' },
          code: "assert len(counts) == 4, 'expected: 4 | actual: %r' % len(counts)",
          expected: '4',
        },
        {
          id: 't4',
          name: { ar: 'يُطبع 2 ثم 4', en: 'Prints 2 then 4' },
          code: "assert '2' in __learner_output__ and '4' in __learner_output__, ('expected: 2 then 4 | actual: %r' % __learner_output__)",
          expected: '2 then 4',
        },
      ],
      hints: [
        { ar: 'مرحلتان لا ثالث لهما: كل write داخل مرحلة الإنشاء، وكل count داخل حلقة القراءة.', en: 'Two phases, no third: every write belongs to the creation phase, every count to the reading loop.' },
        { ar: 'ولا تنسَ \\n في نهاية كل سطر تكتبه — وإلا تلتحم الكلمات عند حدود الأسطر.', en: 'Do not forget \\n at the end of every line you write — or words will fuse across line borders.' },
        { ar: 'الهيكل:\nout = open(\'words-l3.txt\', \'w\')\nout.write(\'python is fun\\n\')\nout.write(\'python is powerful\\n\')\nout.close()\ncounts = dict()\nfhand = open(\'words-l3.txt\')\nfor line in fhand:\n    words = line.split()\n    for word in words:\n        if word not in counts:\n            counts[word] = 1\n        else:\n            counts[word] += 1\nfhand.close()\nprint(counts[\'python\'])\nprint(len(counts))', en: "The skeleton:\nout = open('words-l3.txt', 'w')\nout.write('python is fun\\n')\nout.write('python is powerful\\n')\nout.close()\ncounts = dict()\nfhand = open('words-l3.txt')\nfor line in fhand:\n    words = line.split()\n    for word in words:\n        if word not in counts:\n            counts[word] = 1\n        else:\n            counts[word] += 1\nfhand.close()\nprint(counts['python'])\nprint(len(counts))" },
        { ar: "الملف فيه 6 كلمات موزعة على 4 كلمات مختلفة: python مرتين، وis مرتين، وfun وpowerful مرة لكل منهما.", en: 'The file holds 6 words spread over 4 different ones: python twice, is twice, fun and powerful once each.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-nested',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط دون تشغيله — كم مرة زاد العدّاد؟',
        en: 'Read the code and predict its exact output without running it — how many times did the counter grow?',
      },
      code: "lines = ['a b', 'c']\nn = 0\nfor line in lines:\n    for word in line.split():\n        n = n + 1\nprint(n)",
      solution: '3',
      answer: '3',
      hints: [
        { ar: 'الحلقة الداخلية تعمل كاملة من أجل كل سطر.', en: 'The inner loop runs completely for every line.' },
        { ar: 'السطر الأول فيه كلمتان والثاني كلمة واحدة.', en: 'The first line holds two words, the second one word.' },
        { ar: 'n يزيد مرة واحدة لكل كلمة يمر عليها.', en: 'n grows once for every word it visits.' },
        { ar: 'الخرْج:\n3', en: 'The output:\n3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-nested',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في الحلقات المتداخلة، متى تنفّذ الحلقة الداخلية تكراراتها كاملة؟',
        en: 'In nested loops, when does the inner loop run all of its passes?',
      },
      options: [
        { id: 'a', text: { ar: 'من أجل كل تكرار واحد من تكرارات الحلقة الخارجية', en: 'For every single pass of the outer loop' } },
        { id: 'b', text: { ar: 'مرة واحدة فقط قبل أن تبدأ الخارجية', en: 'Just once, before the outer loop starts' } },
        { id: 'c', text: { ar: 'بعد انتهاء الحلقة الخارجية تمامًا', en: 'After the outer loop has completely finished' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تخيّل ساعة: العقارب الكبيرة تدور ببطء والصغيرة تجري داخلها.', en: 'Picture a clock: the big hand strolls while the small one races inside its every step.' },
        { ar: 'بهذا نضمن زيارة كل كلمة في كل سطر.', en: 'That is how we guarantee visiting every word in every line.' },
        { ar: 'لو انعكس الأمر لتعدّ أسطر كل كلمة — وهو ما لا يصنع معنى.', en: 'Reversed, it would count the lines of every word — which makes no sense.' },
        { ar: 'الجواب: أ — الداخلية محمومة لكل خطوة هادئة من الخارجية.', en: 'Answer: a — the inner loop is frantic for every calm step of the outer.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-split',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'اكتب الكلمة المناسبة: التابع ____ يفرّق السطر عند الفراغات ويعيد قائمة من الكلمات.',
        en: 'Fill in: the method ____ breaks the line at spaces and returns a list of words.',
      },
      solution: 'split',
      answer: 'split',
      hints: [
        { ar: 'خمسة حروف تبدأ بحرف s.', en: 'Five letters starting with s.' },
        { ar: 'رأيته في التنبؤ: words = line.____()', en: 'You saw it in the prediction: words = line.____()' },
        { ar: 'الشكل الصحيح: words = line.split()', en: 'The correct shape: words = line.split()' },
        { ar: 'الجواب: split', en: 'Answer: split' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — عدّد كلماتك\n# Your playground — count your own words\n\nout = open('mywords.txt', 'w')\nout.write('one two three\\n')\nout.write('two three four\\n')\nout.close()\n\ncounts = dict()\nfhand = open('mywords.txt')\nfor line in fhand:\n    for word in line.split():\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\nprint(counts)\nprint('two:', counts['two'])",
      prompt: {
        ar: 'جرّب: غيّر الأسطر وأعد العدّ، واطبع عدّاد كلمة معينة بـ counts[\'two\']، ثم استبدل حلقة if/else بطريقة get. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: change the lines and count again, print a specific counter with counts[\'two\'], then swap the if/else for the get idiom. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل السابع: الحلقة for line in fhand: تمر على الملف كيفًا؟',
            en: 'From chapter 7: how does the loop for line in fhand: walk the file?',
          },
          options: [
            { id: 'a', text: { ar: 'سطرًا سطرًا — وكل line سلسلة تحمل محرف سطر جديد في آخرها', en: 'Line by line — each line a string carrying a newline at its end' } },
            { id: 'b', text: { ar: 'كلمة كلمة كما تعيدها split', en: 'Word by word exactly as split returns them' } },
            { id: 'c', text: { ar: 'محرفًا محرفًا من أول الملف إلى آخره', en: 'Character by character from the first to the last' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المرور على المعرّف يعطي أسطرًا كاملة — ولهذا نحتاج split داخل الحلقة لنحوّل كل سطر إلى كلمات.',
            en: 'Looping over the handle yields whole lines — which is why we need split inside the loop to turn each line into words.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: "كم كلمة تعيدها line.split() للسطر 'Arise fair sun and kill'؟",
            en: "How many words does line.split() return for the line 'Arise fair sun and kill'?",
          },
          options: [
            { id: 'a', text: { ar: 'خمس كلمات', en: 'Five words' } },
            { id: 'b', text: { ar: 'أربع كلمات — الفاصلة تحذف كلمة', en: 'Four words — the comma swallows one' } },
            { id: 'c', text: { ar: 'كلمة واحدة نصية طويلة', en: 'One long text word' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split يفرّق عند كل فراغ: Arise وfair وsun وand وkill — خمسة عناصر في القائمة.',
            en: 'split breaks at every space: Arise, fair, sun, and, kill — five elements in the list.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أين نضع counts = dict() في برنامج عدّ الكلمات؟',
            en: 'Where do we put counts = dict() in the word-counting program?',
          },
          options: [
            { id: 'a', text: { ar: 'قبل الحلقة الخارجية مرة واحدة', en: 'Before the outer loop, once' } },
            { id: 'b', text: { ar: 'داخل الحلقة الداخلية مع كل كلمة', en: 'Inside the inner loop, with every word' } },
            { id: 'c', text: { ar: 'بعد الحلقات مباشرة قبل الطباعة', en: 'Right after the loops, before printing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القاموس يُنشأ مرة واحدة قبل العدّ — وإن أنشأته داخل الحلقة لامُسحت عدّاداتك مع كل سطر جديد.',
            en: 'The dictionary is created once before counting — creating it inside the loop would wipe your counters with every new line.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الخامس: الصيغة counts[word] += 1 تكافئ:',
            en: 'From chapter 5: the form counts[word] += 1 is equivalent to:',
          },
          options: [
            { id: 'a', text: { ar: 'counts[word] = counts[word] + 1', en: 'counts[word] = counts[word] + 1' } },
            { id: 'b', text: { ar: 'counts[word] = 1', en: 'counts[word] = 1' } },
            { id: 'c', text: { ar: 'counts = counts + 1', en: 'counts = counts + 1' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نمط تحديث المتغير بصيغته المختصرة: اقرأ القديمة زِد واحدة وخزّن مكانها — نفس المعنى أقصر شكلًا.',
            en: 'The update pattern in its short dress: read the old, add one, store it back — same meaning, shorter shape.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "for line in fhand:\n    counts = dict()\n    for word in line.split():\n        counts[word] = counts.get(word, 0) + 1",
          right: "counts = dict()\nfor line in fhand:\n    for word in line.split():\n        counts[word] = counts.get(word, 0) + 1",
          note: {
            ar: 'إنشاء القاموس داخل الحلقة يمسح العدّادات مع كل سطر — فيبقى عدّ آخر سطر فقط. عرّف القاموس قبل الحلقة الخارجية مرة واحدة.',
            en: 'Creating the dictionary inside the loop wipes the counters with every line — only the last line survives. Define the dictionary before the outer loop, once.',
          },
        },
        {
          wrong: "for word in line:\n    counts[word] = counts.get(word, 0) + 1",
          right: "for word in line.split():\n    counts[word] = counts.get(word, 0) + 1",
          note: {
            ar: 'الحلقة على السطر مباشرة تمر على المحارف (درس المرور على السلاسل) فتعدّ الحروف لا الكلمات. split أولًا ثم عدّ.',
            en: 'Looping over the line directly walks characters (the string traversal lesson), so it counts letters, not words. split first, then count.',
          },
        },
        {
          wrong: "out.write('breaks')\nout.write('It is the east')",
          right: "out.write('breaks\\n')\nout.write('It is the east')",
          note: {
            ar: 'بلا محرف سطر جديد تلتحم كلمة نهاية السطر بأول كلمة تالية فتصبح كلمة واحدة غريبة مثل breaksIt — ويعدّها البرنامج كلمة لا وجود لها. كل write يقرر أسطره بنفسه.',
            en: "Without a newline the line-end word fuses with the next line's first word into a strange single word like breaksIt — and the program counts a word that never existed. Every write decides its own line breaks.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'عدّ الكلمات = ملفات + قوائم + قواميس: split يفرّق، والحلقات المتداخلة تمر على كل كلمة في كل سطر.', en: 'Word counting = files + lists + dictionaries: split breaks apart, nested loops visit every word in every line.' },
        { ar: 'الحلقة الداخلية تنفّذ دوراتها كاملة من أجل كل دورة خارجية — والقاموس يُنشأ قبل الحلقة الخارجية.', en: 'The inner loop runs all its passes for every outer pass — and the dictionary is created before the outer loop.' },
        { ar: '+= اختصار الزيادة المألوفة — وبرنامج العدّ هو هيستوغرام الكلمات الذي سنقرّه في الدرسين القادمين.', en: '+= is the familiar increment shortcut — and the counting program is the word histogram we will refine in the next two lessons.' },
      ],
      reflectPrompt: {
        ar: 'برنامج العدّ يعمل على أي نص: تخيّل ملف مذكراتك اليومية فيه — أي ثلاث كلمات تتوقع أعلى عدّاد؟ وما الكلمة التي قد تخدع العدّاد (ترقيم، حالة حرف)؟',
        en: 'The counting program works on any text: picture a file of your diary — which three words would you bet have the highest counter? And which word might fool the counter (punctuation, letter case)?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch9.s3', pages: 'ص147 / pp.147' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch9.s3', pages: 'ص147 / pp.147' },
  ],
} satisfies Lesson;

export default lesson;
