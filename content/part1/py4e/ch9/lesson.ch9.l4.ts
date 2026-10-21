import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch9.l4 — "Looping Over Dictionaries / الحلقات على القواميس"
 * Aligned with PY4E ch9 s4 (الحلقات والقواميس), book p.149.
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch9.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 9,
  title: { ar: 'الحلقات على القواميس', en: 'Looping Over Dictionaries' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch9.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'بنينا هيستوغرامًا محترمًا — لكنه مكدّس بلا تقرير. من يطبع مليون عدّاد ل يقرأها؟ نحن نريد الأسطر الكبيرة فقط، والمجموع والمتوسط، والأزواج مرتبة أبجديًا. حلقة for تعرف طريقها داخل القاموس: تمر على المفاتيح واحدة واحدة، ونحن نجلب كل قيمة بمفتاحها. بنهاية الدرس ستكون قادرًا على: المرور على القاموس بمفاتيحه، وتصفية العناصر بقيمة أكبر من حد، وترتيب المفاتيح بـ keys() ثم sort()، وحساب مجموع ومتوسط القيم من values().',
        en: 'We built a respectable histogram — but it is a pile with no report. Who prints a million counters to read them? We want the big entries only, the sum and the average, the pairs sorted alphabetically. A for loop knows its way inside a dictionary: it walks the keys one by one, and we fetch each value by its key. By the end of this lesson you will be able to: walk a dictionary through its keys, filter entries by a value threshold, sort keys with keys() then sort(), and compute the sum and average of the values from values().',
      },
    },
    {
      kind: 'predict',
      code: "counts = {'jan': 100, 'chuck': 1}\nfor key in counts:\n    print(key, counts[key])",
      question: {
        ar: 'ماذا يطبع البرنامج؟ وماذا يأخذ key في كل دورة؟',
        en: 'What does the program print? And what does key take on each pass?',
      },
      reveal: {
        ar: 'يطبع jan 100 ثم chuck 1. الحلقة تمر على المفاتيح: في كل دورة يأخذ key مفتاحًا واحدًا، ونحن نجلب قيمته بعامل الفهرس counts[key]. ملاحظة العرض: في بايثون الحديثة يُطبع بترتيب الإدخال، لكن الكتاب يذكّرك أن ترتيب القاموس ليس عقدًا — لا تعتمد عليه.',
        en: 'It prints jan 100, then chuck 1. The loop walks the keys: on each pass key takes one key, and we fetch its value with the index operator counts[key]. A display note: modern Python prints in insertion order, but the book reminds you that dictionary order is no contract — never rely on it.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الحلقة تمشي على المفاتيح', en: 'The loop walks the keys' },
      chunks: [
        {
          ar: "حلقة for تمر على مفاتيح القاموس. في المثال counts = {'chuck': 1, 'annie': 42, 'jan': 100} يطبع البرنامج المفتاح مع قيمته: print(key, counts[key]). الفاصلة داخل print تطبع الوسيطتين في سطر واحد مفصولتين بمسافة — من دروس الفصل الثاني.",
          en: "A for loop walks the keys of a dictionary. In counts = {'chuck': 1, 'annie': 42, 'jan': 100} the program prints each key with its value: print(key, counts[key]). The comma inside print outputs both arguments on one line separated by a space — from the chapter-2 lessons.",
        },
        {
          ar: 'وهذا النمط يخدم التصفية من الفصل الخامس مباشرة: نريد العناصر ذات القيمة الأكبر من عشرة فقط، فداخل الحلقة نكتب if counts[key] > 10: ثم نطبع. فتظهر jan وannie ويتخطى chuck — المرور بالمفاتيح وعامل الفهرس معًا يصنعان أي تقرير تريده من القاموس.',
          en: 'And this pattern directly serves the chapter-5 filtering: we want only the entries with a value greater than ten, so inside the loop we write if counts[key] > 10: then print. jan and annie appear and chuck is skipped — walking the keys plus the index operator craft any report you want from a dictionary.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الترتيب: keys() ثم sort()', en: 'Order: keys() then sort()' },
      chunks: [
        {
          ar: 'المفاتيح غير مرتبة بترتيب معين، ولو أردنا الأزواج أبجديًا نحوّل المفاتيح إلى قائمة أولًا: lst = list(counts.keys()) ثم نرتبها في مكانها بـ lst.sort() — من دروس القوائم — ثم حلقة طباعة: for key in lst: print(key, counts[key]) فتظهر الأزواج بالترتيب: annie ثم chuck ثم jan.',
          en: 'Keys come in no particular order; to get the pairs alphabetically we first convert the keys into a list: lst = list(counts.keys()), then sort it in place with lst.sort() — from the lists lessons — then a printing loop: for key in lst: print(key, counts[key]) so the pairs appear in order: annie, then chuck, then jan.',
        },
        {
          ar: 'ونفس الفكرة بصيغة أقصر: for key in sorted(counts): — ترتّب المفاتيح لحظتها. والقاعدة باقية من الدرس الأول: الترتيب وسيلة عرض فقط؛ القاموس نفسه لا يعتمد عليه في شيء، والقيمة تُجلب بالمفتاح دائمًا.',
          en: 'And the same idea in a shorter dress: for key in sorted(counts): — sorting the keys on the spot. The lesson-one rule stands: order is only a display tool; the dictionary itself depends on it for nothing, and the value is always fetched by its key.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'values(): المجموع والمتوسط', en: 'values(): sum and average' },
      chunks: [
        {
          ar: 'وأحيانًا نريد أرقام العدّادات لا مفاتيحها: vals = list(counts.values()) يعيد قائمة القيم، وlen(counts) يعطي عدد الأزواج. المجموع نمط المجمّع من الفصل الخامس: total = 0 قبل حلقة، ثم داخلها total = total + v، والمتوسط = total / len(counts) بعدها.',
          en: 'Sometimes we want the counter numbers, not their keys: vals = list(counts.values()) returns a list of the values, and len(counts) gives the number of pairs. The sum is the chapter-5 accumulator pattern: total = 0 before a loop, then inside it total = total + v, and the average = total / len(counts) after it.',
        },
        {
          ar: 'وموجز عملي: sum(vals) تابع جاهز يختصر الحلقة — لكن نمط المجمّع يبقى الأساس الذي تفهم به ما يجري تحت الغطاء. وفي لغة العدّ: المتوسط يعني كم مرة ظهر العنصر النموذجي، والأكبر يعني العنصر الأشهر — وكلاهما سؤالان عن القيم لا عن المفاتيح.',
          en: 'And a practical shortcut: sum(vals), a built-in that collapses the loop — yet the accumulator pattern remains the foundation for understanding what happens under the hood. In counting language: the average says how often the typical element appeared, and the largest says the most famous one — both are questions about values, not keys.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تقرير من الهيستوغرام', en: 'A report from the histogram' },
      code: "counts = {'chuck': 1, 'annie': 42, 'jan': 100}\nfor key in counts:\n    if counts[key] > 10:\n        print(key, counts[key])\nvals = list(counts.values())\ntotal = 0\nfor v in vals:\n    total = total + v\nprint('total:', total)\nprint('average:', round(total / len(vals), 2))",
      explanation: {
        ar: 'التصفية أظهرت العدّادات الكبيرة فقط: jan 100 ثم annie 42 — وتخطّت chuck. ثم جمعنا القيم الثلاث: 143، وقسمناها على ثلاثة أزواج فأجاب المتوسط 47.67 بعد round من الفصل الخامس. ثلاثة أنماط قديمة في برنامج واحد: مرور بالمفاتيح، وتصفية بالقيمة، ومجمّع على القيم.',
        en: 'The filter showed only the big counters: jan 100 then annie 42 — and skipped chuck. Then we summed the three values: 143, divided by three pairs, and the average answered 47.67 after the chapter-5 round. Three old patterns in one program: walking keys, filtering by value, accumulating values.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.report-counts',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "القاموس counts = {'ahmed': 3, 'sara': 7, 'omar': 12} معطى في المحرر. اكتب حلقة تمر على مفاتيحه وتطبع كل زوج قيمته أكبر من 5 بصيغة print(key, counts[key]). بعد الحلقة احسب مجموع القيم كلها في متغير total بنمط المجمّع على list(counts.values())، ثم اطبع print('total:', total). المتوقع: sara 7 ثم omar 12 ثم total: 22.",
        en: "The dictionary counts = {'ahmed': 3, 'sara': 7, 'omar': 12} is given in the editor. Write a loop over its keys printing every pair whose value is greater than 5, in the form print(key, counts[key]). After the loop, compute the sum of all the values into a variable total with the accumulator pattern over list(counts.values()), then print print('total:', total). Expected: sara 7, then omar 12, then total: 22.",
      },
      starterCode: "counts = {'ahmed': 3, 'sara': 7, 'omar': 12}\n# حلقة على المفاتيح مع تصفية counts[key] > 5 / loop over the keys with the counts[key] > 5 filter\n# ثم مجموع القيم في total وطباعته / then sum the values into total and print it\n",
      solution: "counts = {'ahmed': 3, 'sara': 7, 'omar': 12}\nfor key in counts:\n    if counts[key] > 5:\n        print(key, counts[key])\ntotal = 0\nfor v in list(counts.values()):\n    total = total + v\nprint('total:', total)",
      tests: [
        {
          id: 't1',
          name: { ar: 'المجموع يساوي 22', en: 'The total equals 22' },
          code: "assert total == 22, 'expected: 22 | actual: %r' % total",
          expected: '22',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع سطر sara 7', en: 'The line sara 7 is printed' },
          code: "assert 'sara 7' in __learner_output__, ('expected: sara 7 | actual: %r' % __learner_output__)",
          expected: 'sara 7',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع سطر omar 12', en: 'The line omar 12 is printed' },
          code: "assert 'omar 12' in __learner_output__, ('expected: omar 12 | actual: %r' % __learner_output__)",
          expected: 'omar 12',
        },
        {
          id: 't4',
          name: { ar: 'يُطبع total: 22', en: 'total: 22 is printed' },
          code: "assert 'total: 22' in __learner_output__, ('expected: total: 22 | actual: %r' % __learner_output__)",
          expected: 'total: 22',
        },
      ],
      hints: [
        { ar: 'الحلقة نفسها من التنبؤ: for key in counts: — والتصفية من الفصل الخامس داخلها.', en: 'The loop is the one from the prediction: for key in counts: — with the chapter-5 filter inside.' },
        { ar: 'المجمّع يبدأ قبل الحلقة: total = 0 ثم داخل حلقة ثانية على القيم: total = total + v.', en: 'The accumulator starts before the loop: total = 0, then inside a second loop over the values: total = total + v.' },
        { ar: "الهيكل:\nfor key in counts:\n    if counts[key] > 5:\n        print(key, counts[key])\ntotal = 0\nfor v in list(counts.values()):\n    total = total + v\nprint('total:', total)", en: "The skeleton:\nfor key in counts:\n    if counts[key] > 5:\n        print(key, counts[key])\ntotal = 0\nfor v in list(counts.values()):\n    total = total + v\nprint('total:', total)" },
        { ar: 'ahmed قيمته 3 فتتخطاه التصفية — والقيم الثلاث مجموعها 22: صغيرة + كبيرة = 22.', en: 'ahmed has value 3 so the filter skips it — and the three values sum to 22.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-keys',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "d = {'x': 2, 'y': 3}\ns = 0\nfor key in d:\n    s = s + d[key]\nprint(s)\nprint(list(d.keys()))",
      solution: "5\n['x', 'y']",
      answer: "5\n['x', 'y']",
      hints: [
        { ar: 'الحلقة تجمع القيم: 2 ثم 3.', en: 'The loop sums the values: 2 then 3.' },
        { ar: 'keys() يعيد قائمة المفاتيح — وبترتيب الإدخال في بايثون الحديثة.', en: 'keys() returns the list of keys — in insertion order on modern Python.' },
        { ar: 'الطباعة الثانية تطبع القائمة كما تطبع القوائم بأقواسها.', en: 'The second print outputs the list the way lists always print, brackets included.' },
        { ar: "الخرْج:\n5\n['x', 'y']", en: "The output:\n5\n['x', 'y']" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-loopvar',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في الحلقة for key in counts: — ماذا يأخذ key في كل دورة؟',
        en: 'In the loop for key in counts: — what does key take on each pass?',
      },
      options: [
        { id: 'a', text: { ar: 'مفتاحًا واحدًا من مفاتيح القاموس', en: 'One key from the dictionary keys' } },
        { id: 'b', text: { ar: 'زوجًا كاملًا مفتاح: قيمة', en: 'A whole pair, key: value' } },
        { id: 'c', text: { ar: 'قيمة واحدة من القيم', en: 'One value from the values' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'جرّب print(key) لوحده في الملعب وراقب ما يظهر.', en: 'Try print(key) alone in the sandbox and watch what appears.' },
        { ar: 'عامل الفهرس counts[key] هو الذي يجلب القيمة.', en: 'The index operator counts[key] is what fetches the value.' },
        { ar: 'الحلقة على القاموس = الحلقة على مفاتيحه.', en: 'Looping over a dictionary equals looping over its keys.' },
        { ar: 'الجواب: أ — مفتاحًا واحدًا في كل دورة، والقيمة تُجلب بالمفتاح.', en: 'Answer: a — one key per pass, and the value is fetched by that key.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-keys',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'اكتب الكلمة المناسبة: لعرض الأزواج مرتبة أبجديًا نبدأ بقائمة المفاتيح: lst = list(counts.____()) ثم نرتبها بـ lst.sort().',
        en: 'Fill in: to display the pairs alphabetically we start from the keys list: lst = list(counts.____()) then sort it with lst.sort().',
      },
      solution: 'keys',
      answer: 'keys',
      hints: [
        { ar: 'أربعة حروف — وهو نقيض التابع الذي يعيد القيم.', en: 'Four letters — the opposite of the method returning the values.' },
        { ar: 'رأيته في المثال المرتب: lst = list(counts.keys()).', en: 'You saw it in the sorting example: lst = list(counts.keys()).' },
        { ar: 'الشكل الصحيح: lst = list(counts.keys())', en: 'The correct shape: lst = list(counts.keys())' },
        { ar: 'الجواب: keys', en: 'Answer: keys' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — تقاريرك\n# Your playground — your own reports\n\nstock = {'pen': 12, 'ink': 3, 'paper': 7}\nfor key in stock:\n    print(key, stock[key])\nlow = list(stock.keys())\nlow.sort()\nprint(low)\nvals = list(stock.values())\nprint('sum:', sum(vals))\nprint('avg:', round(sum(vals) / len(vals), 2))",
      prompt: {
        ar: "جرّب: صفِّ العناصر التي قيمتها أقل من 5، ورتّب المفاتيح واطبع الأزواج بالترتيب، وجرّب sum مباشرة على القيم. لا اختبار هنا — فضولك فقط.",
        en: 'Try it yourself: filter the entries with values below 5, sort the keys and print the pairs in order, and try sum directly over the values. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الثامن: ماذا تفعل lst.sort()؟',
            en: 'From chapter 8: what does lst.sort() do?',
          },
          options: [
            { id: 'a', text: { ar: 'ترتّب القائمة نفسها في مكانها ولا تعيد شيئًا', en: 'Sorts the list in place and returns nothing' } },
            { id: 'b', text: { ar: 'تعيد قائمة جديدة مرتبة وتترك الأصل كما هو', en: 'Returns a new sorted list and leaves the original untouched' } },
            { id: 'c', text: { ar: 'تعكس ترتيب العناصر فقط', en: 'Merely reverses the element order' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'sort تابع قائمة يعمل في مكانه — لذلك رتبناه ثم حلقنا على القائمة نفسها.',
            en: 'sort is an in-place list method — that is why we sorted first, then looped over that same list.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا لا نعتمد على ترتيب عناصر القاموس عند بناء التقرير؟',
            en: 'Why do we never rely on dictionary order when building a report?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الترتيب ليس عقد القاموس — القيمة تُجلب بالمفتاح أينما وقف العنصر', en: 'Because order is not the dictionary’s contract — values are fetched by key wherever the item sits' } },
            { id: 'b', text: { ar: 'لأن الترتيب يتغير مع كل استدعاء len', en: 'Because the order changes with every len call' } },
            { id: 'c', text: { ar: 'لأن المفاتيح أرقام دائمًا وترتيبها لا معنى له', en: 'Because keys are always numbers whose order is meaningless' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القاموس يخدم بالمفاتيح لا بالمواقع — ولعرض مرتب نبنيه نحن بقائمة keys مرتبة.',
            en: 'The dictionary serves by keys, not positions — and for a sorted display we build it ourselves from a sorted keys list.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لطباعة الأزواج مرتبة أبجديًا حسب المفتاح، ما التسلسل الصحيح؟',
            en: 'To print the pairs alphabetically by key, what is the correct sequence?',
          },
          options: [
            { id: 'a', text: { ar: 'قائمة من keys() ثم sort() ثم حلقة طباعة على القائمة', en: 'A list from keys(), then sort(), then a printing loop over the list' } },
            { id: 'b', text: { ar: 'counts.sort() ثم حلقة على القاموس', en: 'counts.sort() then a loop over the dictionary' } },
            { id: 'c', text: { ar: 'طباعة القاموس مباشرة وهي مرتبة تلقائيًا', en: 'Print the dictionary directly — it sorts itself' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القواميس لا تملك sort ولا تُخزن ترتيبًا مضمونًا — الترتيب يُبنى على قائمة مفاتيح مستقلة.',
            en: 'Dictionaries own no sort and keep no guaranteed order — the ordering is built on a separate keys list.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثاني: في print(key, counts[key]) — ما دور الفاصلة؟',
            en: 'From chapter 2: in print(key, counts[key]) — what does the comma do?',
          },
          options: [
            { id: 'a', text: { ar: 'تطبع الوسيطتين في السطر نفسه مفصولتين بمسافة', en: 'Prints both arguments on the same line separated by a space' } },
            { id: 'b', text: { ar: 'تحسب الفرق بين الوسيطتين وتطبعه', en: 'Computes the difference between the arguments and prints it' } },
            { id: 'c', text: { ar: 'تطبع كل وسيطة في سطر مستقل', en: 'Prints each argument on its own line' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'print تقبل عدة وسائط والفاصلة تفصلها — فخرجنا jan 100 جاء من وسيطين لا من سلسلة مركّبة.',
            en: 'print accepts several arguments and the comma separates them — our jan 100 output came from two arguments, not a glued string.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'for key in counts:\n    print(key, key)',
          right: 'for key in counts:\n    print(key, counts[key])',
          note: {
            ar: 'متغيّر الحلقة يأخذ المفتاح فقط — القيمة تحتاج عامل الفهرس. طباعة key مرتين تكرر الاسم ولا تعرض العدد.',
            en: 'The loop variable takes only the key — the value needs the index operator. Printing key twice repeats the name and never shows the count.',
          },
        },
        {
          wrong: 'counts.sort()',
          right: 'lst = list(counts.keys())\nlst.sort()',
          note: {
            ar: 'القواميس لا تملك sort — الترتيب من دوال القوائم. حوّل المفاتيح إلى قائمة أولًا ثم رتّبها.',
            en: 'Dictionaries own no sort — ordering belongs to list tools. Convert the keys to a list first, then sort it.',
          },
        },
        {
          wrong: 'for key in counts:\n    total = 0\n    total = total + counts[key]\nprint(total)',
          right: 'total = 0\nfor key in counts:\n    total = total + counts[key]\nprint(total)',
          note: {
            ar: 'تصفير المجمّع داخل الحلقة يمحو كل ما جمعه — يبقى مجموع آخر مفتاح فقط. من أمراض الفصل الخامس الشهيرة: الابتداء قبل الحلقة لا داخلها.',
            en: 'Zeroing the accumulator inside the loop erases everything collected — only the last key survives. The famous chapter-5 ailment: initialize before the loop, not inside it.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'for key in dict تمر على المفاتيح، وcounts[key] يجلب القيمة — ومعًا يبنيان أي تقرير من القاموس.', en: 'for key in dict walks the keys, and counts[key] fetches the value — together they build any report from a dictionary.' },
        { ar: 'التصفية بالقيمة (if counts[key] > حد) والترتيب (keys ثم sort) نمطان من أنماط الحلقات القديمة على بيانات جديدة.', en: 'Filtering by value (if counts[key] > threshold) and sorting (keys then sort) are old loop patterns applied to new data.' },
        { ar: 'values() يعيد القيم قائمة: المجموع بنمط المجمّع والمتوسط بقسمته على len(counts) — وsum(vals) اختصاره الجاهز.', en: 'values() returns the values as a list: sum via the accumulator and the average by dividing by len(counts) — with sum(vals) as the built-in shortcut.' },
      ],
      reflectPrompt: {
        ar: 'أعطِ هيستوغرامك رأسًا: صُغ ثلاثة أسئلة تقريرية يجيبها البرنامج (أكثر كلمة تكرارًا؟ كم كلمة ظهرت مرة واحدة؟) — وأي نمط حلقات تحتاج لكل سؤال؟',
        en: 'Give your histogram a head: shape three report questions the program can answer (most frequent word? how many words appeared once?) — and which loop pattern do you need for each?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch9.s4', pages: 'ص149 / pp.149' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch9.s4', pages: 'ص149 / pp.149' },
  ],
} satisfies Lesson;

export default lesson;
