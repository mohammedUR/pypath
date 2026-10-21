import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch16.l2 — "Generating Map Data Files / توليد ملفات الخرائط"
 * Aligned with PY4E ch16 s1 (عرض خريطة باستخدام بيانات جغرافية من غوغل —
 * برنامج geodump.py وملف where.js وwhere.html).
 * All expression is original.
 * SIMULATED-RENDERER design: the book's where.js/where.html pair is the
 * external renderer (browser + Google Maps JS); the runnable code GENERATES
 * the where.js CONTENT from parsed geodata (string building + %-format),
 * writes it to a MEMFS file (where-l16.js, mode 'w'), reads it back and
 * verifies it. No Google Maps here — we build the data artifact.
 */
const lesson = {
  id: 'py4e.ch16.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 16,
  title: { ar: 'توليد ملفات الخرائط', en: 'Generating Map Data Files' },
  estimatedMinutes: 17,
  prerequisites: ['py4e.ch16.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الدرس الماضي جمعنا إحداثيات في ردود JSON. واليوم الحلقة الثانية في سلسلة الكتاب: geodump.py يقرأ قاعدة البيانات ويكتب ملف where.js — قائمة إحداثيات بلغة JavaScript يقرؤها where.html في المتصفح ويرسمها على خريطة غوغل. نحن لا نملك متصفحًا ولا خرائط غوغل في المنصة — ونحن لا نحتاجها: مهمتنا توليد الملف نفسه حرفًا حرفًا والتحقق منه. نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية. بنهاية الدرس ستكون قادرًا على: بناء سطور where.js بتنسيق %s، وكتابتها في ملف بوضع w وقراءتها عائدة، والتحقق من الملف بالعدّ والبحث عن علامة.',
        en: 'Last lesson we gathered coordinates inside JSON replies. Today comes the book\u2019s second link: geodump.py reads the database and writes a where.js file — a list of coordinates in JavaScript that where.html reads in the browser and draws on a Google map. We have neither browser nor Google Maps in the platform — and we do not need them: our job is generating that very file, letter by letter, and verifying it. We generate the chart data here; the rendering happens in an external tool. By the end of this lesson you will be able to: build where.js lines with %s formatting, write them to a file in w mode and read them back, and verify the file by counting and by searching for a marker.',
      },
    },
    {
      kind: 'predict',
      code: "lat = 42.3396998\nlng = -71.08975\nlabel = 'Northeastern University'\nprint('[%s, %s, %s]' % (lat, lng, label))\nprint(\"[%s, %s, '%s']\" % (lat, lng, label))",
      question: {
        ar: 'السطران يبنيان صفًّا واحدًا من where.js بطريقتين. ماذا يطبع كل منهما — وأيهما يصلح بيانات JavaScript حقيقية؟',
        en: 'The two lines build one where.js row in two ways. What does each print — and which one is valid JavaScript data?',
      },
      reveal: {
        ar: 'الأول: [42.3396998, -71.08975, Northeastern University] — والتسمية بلا اقتباس فلا يفهمها JavaScript كنص. الثاني: [42.3396998, -71.08975, \u2019Northeastern University\u2019] — علامات الاقتباس المفردة جزء من السلسلة المبنية، فصار الصف بيانات صالحة. التنسيق لا يفرّق بين نص ورمز: %s يضع القيمة كما هي، ونحن من يضيف الاقتباس.',
        en: 'The first: [42.3396998, -71.08975, Northeastern University] — the label has no quotes, so JavaScript cannot read it as text. The second: [42.3396998, -71.08975, \u2019Northeastern University\u2019] — the single quotes are part of the built string, so the row became valid data. Formatting does not distinguish text from code: %s inserts the value as it is, and we are the ones adding the quotes.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'geodump.py: من القاعدة إلى where.js', en: 'geodump.py: from the database to where.js' },
      chunks: [
        {
          ar: 'بمجرد امتلاء geodata.sqlite، يشغّل الكتاب geodump.py: يقرأ كل صف ويطبع الاسم والإحداثيين — Northeastern University, ... Boston, MA 02115, USA 42.3396998 -71.08975 — ثم يختم: 12 records written to where.js وOpen where.html to view the data in a browser. محتوى where.js قائمة قوائم: myData = [[42.3396998, -71.08975, \u2019Northeastern Uni ... Boston, MA 02115\u2019], [40.6963857, -89.6160811, \u2019Bradley University, ...\u2019], ...]; — وصيغة القوائم في JavaScript تشبه صيغة بايثون إلى حد كبير، ولهذا نبنيها بيدنا بلا مكتبة.',
          en: 'Once geodata.sqlite is full, the book runs geodump.py: it reads every row and prints the name and the two coordinates — Northeastern University, ... Boston, MA 02115, USA 42.3396998 -71.08975 — then closes with 12 records written to where.js and Open where.html to view the data in a browser. The content of where.js is a list of lists: myData = [[42.3396998, -71.08975, \u2019Northeastern Uni ... Boston, MA 02115\u2019], [40.6963857, -89.6160811, \u2019Bradley University, ...\u2019], ...]; — and JavaScript list syntax resembles Python\u2019s closely, which is why we can build it by hand with no library.',
        },
        {
          ar: 'بناء الملف نص تتراكم أسطره: سطر الافتتاح myData = [، ثم سطر [%s, %s, \u2019%s\u2019], لكل سجل، ثم سطر الإغلاق ]; — ونلصقها بـ \u2019\\n\u2019.join من الفصل الثامن. الكتابة بوضع w من الفصل السابع: افتح، اكتب، أغلق — ثم اقرأ الملف عائدًا وتحقق: كم سطرًا؟ وهل العلامة myData = [ موجودة؟ التحقق هو الذي يميز مولّدًا موثوقًا.',
          en: 'Building the file is text whose lines accumulate: an opening line myData = [, then one [%s, %s, \u2019%s\u2019], line per record, then the closing ]; — glued with \u2019\\n\u2019.join from chapter eight. Writing uses w mode from chapter seven: open, write, close — then read the file back and verify: how many lines? Is the myData = [ marker present? Verification is what separates a trustworthy generator from a hopeful one.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'where.html: العرض في المتصفح', en: 'where.html: rendering in the browser' },
      chunks: [
        {
          ar: 'الملف where.html شيفرة HTML وJavaScript لمعاينة خريطة غوغل: يقرأ أحدث بيانات where.js فيُعلّق كل موقع كدبوس على الخريطة، ويمكنك التحرك بين المواقع لترى ما وجدته الواجهة. وإن فتحت where.html ولم تظهر بيانات، فالكتاب يوجّهك إلى وحدة المطورين developer console في المتصفح لتفحص أخطاء JavaScript — هذا برهان أن العرض حكاية متصفح لا حكاية بايثون.',
          en: 'The file where.html is HTML and JavaScript code for previewing a Google map: it reads the latest data in where.js, pins each location on the map, and you can move between locations to see what the API found. If you open where.html and nothing shows, the book points you to the browser\u2019s developer console to inspect JavaScript errors — proof that rendering is a browser story, not a Python story.',
        },
        {
          ar: 'في منصتنا: نكتب where-l16.js في نظام الملفات ونتحقق منه ببايثون — والمتصفح الذي يرسم الخريطة أداة خارجية يبقى خارج جدراننا. نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية. هذه هي الرقابة الصادقة: برنامجك يُقاس على ما يولّده، لا على ما لا يستطيع رسمه.',
          en: 'In our platform: we write where-l16.js into the file system and verify it with Python — while the browser that draws the map stays an external tool beyond our walls. We generate the chart data here; the rendering happens in an external tool. This is the honest scope: your program is measured by what it generates, not by what it cannot draw.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'توليد where.js والتحقق منه', en: 'Generating where.js and verifying it' },
      code: "rows = [\n    [42.3396998, -71.08975, 'Northeastern University, Boston, MA 02115, USA'],\n    [40.6963857, -89.6160811, 'Bradley University, Peoria, IL 61625, USA'],\n    [-37.9152113, 145.134682, 'Monash University, Clayton VIC 3800, Australia'],\n    [53.2833333, 69.3833333, 'Kokshetau, Kazakhstan'],\n]\nlines = ['myData = [']\nfor row in rows:\n    lines.append(\"[%s, %s, '%s'],\" % (row[0], row[1], row[2]))\nlines.append('];')\ncontent = '\\n'.join(lines)\n\nout = open('where-l16.js', 'w')\nout.write(content)\nout.close()\n\nfhand = open('where-l16.js')\nback = fhand.read()\nfhand.close()\n\nprint('records: %d' % len(rows))\nprint('lines: %d' % len(back.split('\\n')))\nprint('marker found: %s' % ('myData = [' in back))\nprint(\"row found: %s\" % (\"[53.2833333, 69.3833333, 'Kokshetau, Kazakhstan'],\" in back))",
      explanation: {
        ar: 'قائمة lines تتراكم: سطر الافتتاح، ثم سطر مصمم لكل سجل — الأقواس والفواصل حرفية، و%s تعوّض الإحداثيين، و\u2019%s\u2019 يلف التسمية باقتباس مفرد فيصير نصًّا في JavaScript. join يلصق الأسطر بمحرف السطر الجديد، وw يكتب where-l16.js من صفحة بيضاء. القراءة العائدة تحسب 6 أسطر وتجد العلامة والصف — أربعة أسطر تحقق تعادل ألف ثقة. على متصفح حقيقي، where.html سيقرأ هذا الملف ويرسم أربعة دبابيس.',
        en: 'The lines list accumulates: the opening line, then one crafted line per record — brackets and commas literal, %s substituting the two coordinates, and \u2019%s\u2019 wrapping the label in single quotes so it becomes text in JavaScript. join glues the lines with the newline character, and w writes where-l16.js from a blank page. Reading it back counts 6 lines and finds the marker and the row — four verification lines are worth a thousand assurances. In a real browser, where.html would read this file and pin four markers.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.wherejs-write',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الصفوف الثلاثة معطاة في المحرر. ابنِ ملف خريطة باسم map-l16.js: سطر myData = [ ثم سطر [%s, %s, \u2019%s\u2019], لكل صف ثم ]; — انضم الأسطر بـ \u2019\\n\u2019 واكتبها بوضع w ثم اقرأ الملف عائدًا واطبع ثلاثة أسطر تحقق: records: %d بعدد الصفوف، وlines: %d بعدد أسطر الملف المقروء، وmarker found: True إن وُجدت العلامة. المتوقع: records: 3 ثم lines: 5 ثم marker found: True.',
        en: "The three rows are given in the editor. Build a map file named map-l16.js: a myData = [ line, then one [%s, %s, \u2019%s\u2019], line per row, then ]; — join the lines with \u2019\\n\u2019, write them in w mode, then read the file back and print three verification lines: records: %d with the row count, lines: %d with the number of lines read, and marker found: True if the marker exists. Expected: records: 3, then lines: 5, then marker found: True.",
      },
      starterCode: "rows = [\n    [53.2833333, 69.3833333, 'Kokshetau, Kazakhstan'],\n    [-37.9152113, 145.134682, 'Monash University, Clayton VIC 3800, Australia'],\n    [42.3396998, -71.08975, 'Northeastern University, Boston, MA 02115, USA'],\n]\n# lines = ['myData = ['] ثم سطر [%s, %s, '%s'], لكل صف ثم '];'\n# اكتب map-l16.js بوضع w ثم اقرأه عائدًا واطبع records وlines وmarker found\n",
      solution: "rows = [\n    [53.2833333, 69.3833333, 'Kokshetau, Kazakhstan'],\n    [-37.9152113, 145.134682, 'Monash University, Clayton VIC 3800, Australia'],\n    [42.3396998, -71.08975, 'Northeastern University, Boston, MA 02115, USA'],\n]\nlines = ['myData = [']\nfor row in rows:\n    lines.append(\"[%s, %s, '%s'],\" % (row[0], row[1], row[2]))\nlines.append('];')\ncontent = '\\n'.join(lines)\n\nout = open('map-l16.js', 'w')\nout.write(content)\nout.close()\n\nfhand = open('map-l16.js')\nback = fhand.read()\nfhand.close()\n\nprint('records: %d' % len(rows))\nprint('lines: %d' % len(back.split('\\n')))\nprint('marker found: %s' % ('myData = [' in back))",
      tests: [
        {
          id: 't1',
          name: { ar: 'عدد السجلات مطبوع', en: 'The record count is printed' },
          code: "assert 'records: 3' in __learner_output__, 'expected: records: 3 | actual: %r' % __learner_output__",
          expected: 'records: 3',
        },
        {
          id: 't2',
          name: { ar: 'عدد الأسطر صحيح: 3 صفوف مع الافتتاح والإغلاق', en: 'The line count is right: 3 rows plus opener and closer' },
          code: "assert 'lines: 5' in __learner_output__, 'expected: lines: 5 | actual: %r' % __learner_output__",
          expected: 'lines: 5',
        },
        {
          id: 't3',
          name: { ar: 'العلامة وجدت', en: 'The marker was found' },
          code: "assert 'marker found: True' in __learner_output__, 'expected: marker found: True | actual: %r' % __learner_output__",
          expected: 'marker found: True',
        },
        {
          id: 't4',
          name: { ar: 'الملف نفسه يحمل صف موناش كاملًا', en: 'The file itself carries the full Monash row' },
          code: "data = open('map-l16.js').read()\nassert \"[-37.9152113, 145.134682, 'Monash University, Clayton VIC 3800, Australia'],\" in data, 'expected: the Monash row inside map-l16.js | actual: %r' % data",
          expected: 'the Monash row inside map-l16.js',
        },
      ],
      hints: [
        { ar: 'قائمة متراكمة كما في worked: ابدأ lines = [\'myData = [\'] وحلقة for تضيف سطرًا لكل صف.', en: "An accumulating list as in the worked example: start with lines = ['myData = ['] and a for loop adding one line per row." },
        { ar: 'سطر الصف: \"[%s, %s, \u2019%s\u2019],\" % (row[0], row[1], row[2]) — لاحظ الاقتباس المفرد حول الاسم والفاصلة الأخيرة.', en: 'The row line: \"[%s, %s, \u2019%s\u2019],\" % (row[0], row[1], row[2]) — note the single quotes around the label and the trailing comma.' },
        { ar: 'الهيكل:\nlines = [\'myData = [\']\nfor row in rows:\n    lines.append(\"[%s, %s, \u2019%s\u2019],\" % (row[0], row[1], row[2]))\nlines.append(\u2019];\u2019)\ncontent = \u2019\\n\u2019.join(lines)\nout = open(\u2019map-l16.js\u2019, \u2019w\u2019)\nout.write(content)\nout.close()', en: 'The skeleton:\nlines = [\'myData = [\']\nfor row in rows:\n    lines.append(\"[%s, %s, \u2019%s\u2019],\" % (row[0], row[1], row[2]))\nlines.append(\u2019];\u2019)\ncontent = \u2019\\n\u2019.join(lines)\nout = open(\u2019map-l16.js\u2019, \u2019w\u2019)\nout.write(content)\nout.close()' },
        { ar: 'التحقق: اقرأ الملف عائدًا واحسب back.split(\u2019\\n\u2019) وابحث عن العلامة بعامل in.', en: "Verification: read the file back, count back.split(\u2019\\n\u2019), and search for the marker with the in operator." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-wherejs',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "rows = [[53.2833333, 69.3833333, 'Kokshetau']]\nlat, lng, label = rows[0]\nprint(\"[%s, '%s']\" % (lng, label))\nprint(len(rows))",
      solution: "[69.3833333, 'Kokshetau']\n1",
      answer: "[69.3833333, 'Kokshetau']\n1",
      hints: [
        { ar: 'rows[0] قائمة من ثلاث قيم — وفكّ الحزمة يوزعها على lat وlng وlabel بترتيبها.', en: 'rows[0] is a list of three values — unpacking distributes them to lat, lng and label in order.' },
        { ar: 'التنسيق يطبع lng أولًا ثم التسمية بين اقتباسين مفردين — لاحظ الترتيب.', en: 'The format prints lng first, then the label wrapped in single quotes — mind the order.' },
        { ar: 'len(rows) عدد الصفوف لا الأعمدة.', en: 'len(rows) counts rows, not columns.' },
        { ar: 'الخرْج:\n[69.3833333, \u2019Kokshetau\u2019]\n1', en: 'The output:\n[69.3833333, \u2019Kokshetau\u2019]\n1' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-wherehtml',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'كيف تصل الإحداثيات المكتوبة في where.js إلى عين المستخدم كخريطة؟',
        en: 'How do the coordinates written in where.js reach the user\u2019s eye as a map?',
      },
      options: [
        { id: 'a', text: { ar: 'where.html في المتصفح يقرأ where.js ويرسم المواقع على خريطة غوغل بشيفرة JavaScript', en: 'where.html in the browser reads where.js and draws the locations on a Google map with JavaScript' } },
        { id: 'b', text: { ar: 'بايثون تفتح where.js وتطبع الخريطة في الطرفية', en: 'Python opens where.js and prints the map in the terminal' } },
        { id: 'c', text: { ar: 'geodata.sqlite يحول السجلات إلى صورة تلقائيًّا', en: 'geodata.sqlite converts the records into an image automatically' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الكتاب يقول حرفيًّا: افتح where.html على المتصفح لمعاينة المواقع.', en: 'The book says it literally: open where.html in the browser to preview the locations.' },
        { ar: 'where.js بيانات فقط — أين تعيش شيفرة الرسم؟', en: 'where.js is data only — where does the drawing code live?' },
        { ar: 'والإن لم تظهر البيانات، فأين يوجّهك الكتاب لتفحص الأخطاء؟ وحدة المطورين في المتصفح.', en: 'And if no data shows, where does the book send you to debug? The browser\u2019s developer console.' },
        { ar: 'الجواب: أ — المتصفح هو العارض، وwhere.html هو من يقرأ where.js.', en: 'Answer: a — the browser is the viewer, and where.html is what reads where.js.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-mydata',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: ملف where.js يحمل قائمة الإحداثيات في متغير JavaScript اسمه ____ على النحو myData = [[lat, lng, \u2019label\u2019], ...];.',
        en: 'Fill the blank with one word: where.js holds the coordinate list in a JavaScript variable named ____ as in myData = [[lat, lng, \u2019label\u2019], ...];.',
      },
      answer: 'myData',
      solution: 'myData',
      hints: [
        { ar: 'سبعة أحرف بحرف M كبير في وسطها — وتراه في سطر الافتتاح الذي بنيناه.', en: 'Seven letters with a capital M in the middle — you see it in the opening line we built.' },
        { ar: 'where.html يبحث عن هذا الاسم بالتحديد ليعرف أين البيانات.', en: 'where.html looks for exactly this name to know where the data lives.' },
        { ar: 'معناه حرفيًّا: بياناتي — بيانات خريطتي.', en: 'It literally means: my data — my map\u2019s data.' },
        { ar: 'الجواب: myData', en: 'Answer: myData' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — مولّد خرائطك\n# Your playground — your own map generator\n\nrows = [\n    [53.2833333, 69.3833333, \'Kokshetau, Kazakhstan\'],\n    [-37.9152113, 145.134682, \'Monash University, Clayton VIC 3800, Australia\'],\n]\nlines = [\'myData = [\']\nfor row in rows:\n    lines.append("[%s, %s, \'%s\']," % (row[0], row[1], row[2]))\nlines.append(\'];\')\ncontent = \'\\n\'.join(lines)\n\nout = open(\'where-l16.js\', \'w\')\nout.write(content)\nout.close()\nprint(open(\'where-l16.js\').read())\n\n# جرّب: أضف صفًّا لجامعة من بلدك ولاحظ عدد الأسطر / try: add a row for a university from your country and watch the line count\n# جرّب: انزع الاقتباسين حول التسمية واقرأ الملف — ماذا فسد؟ / try: drop the quotes around the label, read the file — what broke?\n# جرّب: افتح الملف بوضع \'a\' مرتين — هل تتراكم السجلات؟ / try: open the file in \'a\' mode twice — do records pile up?',
      prompt: {
        ar: 'جرّب بنفسك: أضف صفًّا لجامعتك وعدّ الأسطر. ثم انزع الاقتباس المفرد حول التسمية واقرأ الملف — أي أسطر فقد صلاحيتها كبيانات JavaScript؟ ثم جرّب وضع a بدل w مرتين وراقب التراكم — هذه هي الحال التي يعالجها w. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add a row for your own university and count the lines. Then drop the single quotes around the label and read the file — which lines stopped being valid JavaScript data? Then try a mode instead of w twice and watch the pile-up — this is exactly what w fixes. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل السادس: في \"[%s, %s, \u2019%s\u2019],\" % row — ما دور كل %s؟',
            en: 'From chapter 6: in \"[%s, %s, \u2019%s\u2019],\" % row — what does each %s do?',
          },
          options: [
            { id: 'a', text: { ar: 'يستبدل قيمة واحدة من التسلسل في موضعها كما هي — والأقواس والفواصل تبقى حرفية', en: 'Substitutes one value from the sequence into its slot as it is — brackets and commas stay literal' } },
            { id: 'b', text: { ar: 'يحذف القيمة ويترك الفراغ', en: 'Deletes the value and leaves a blank' } },
            { id: 'c', text: { ar: 'يحوّل كل السلسلة إلى أعداد', en: 'Converts the whole string into numbers' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مشغّل % من الفصل السادس يملأ المواضع بالترتيب — وبه بنينا كل سجل في where.js: قيمتان عدديتان وتسمية مقتبسة بين أقواس حرفية.',
            en: 'The % operator from chapter six fills slots in order — and with it we built each where.js record: two numeric values and a quoted label between literal brackets.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما دور where.html في تطبيق الكتاب؟',
            en: 'What is where.html\u2019s role in the book\u2019s application?',
          },
          options: [
            { id: 'a', text: { ar: 'صفحة HTML وJavaScript تُفتح في متصفح فتقرأ where.js وترسم المواقع على خريطة غوغل', en: 'An HTML and JavaScript page opened in a browser; it reads where.js and draws the locations on a Google map' } },
            { id: 'b', text: { ar: 'قاعدة بيانات تحفظ الإحداثيات', en: 'A database that stores the coordinates' } },
            { id: 'c', text: { ar: 'برنامج بايثون يستدعي واجهة غوغل', en: 'A Python program calling the Google API' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'where.js بيانات، وwhere.html عارض — والزوج معًا هو حيلة الكتاب لفصل توليد البيانات عن رسمها في المتصفح.',
            en: 'where.js is data and where.html is the viewer — together they are the book\u2019s trick for separating data generation from drawing it in the browser.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث عشر: هل myData = [[...], ...]; في where.js وثيقة JSON؟',
            en: 'From chapter 13: is myData = [[...], ...]; in where.js a JSON document?',
          },
          options: [
            { id: 'a', text: { ar: 'لا — إنه إسناد JavaScript إلى متغير مع فاصلة منقوطة، أما JSON فنص بيانات خالص بلا إسناد', en: 'No — it is a JavaScript assignment into a variable with a semicolon, while JSON is pure data text with no assignment' } },
            { id: 'b', text: { ar: 'نعم — لأن القوائم المتداخلة تمنعه', en: 'Yes — because nested lists forbid it' } },
            { id: 'c', text: { ar: 'نعم — لأن JSON لغة JavaScript الرسمية للخرائط', en: 'Yes — because JSON is JavaScript\u2019s official map language' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'JSON يصلح لـ json.loads، أما where.js فيُلصق داخل صفحة ويُنفَّذ بلغة JavaScript — شبّه بفرق نص بيانات وبرنامج يُسند بيانات إلى متغير.',
            en: 'JSON is what json.loads consumes, while where.js is pasted inside a page and executed as JavaScript — compare a data text with a program assigning data to a variable.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'رتّب خط أنابيب الكتاب من أولها إلى آخرها.',
            en: 'Order the book\u2019s pipeline from first to last.',
          },
          options: [
            { id: 'a', text: { ar: 'where.data ثم geoload.py ثم geodata.sqlite ثم geodump.py ثم where.js ثم where.html', en: 'where.data, then geoload.py, then geodata.sqlite, then geodump.py, then where.js, then where.html' } },
            { id: 'b', text: { ar: 'where.html ثم where.js ثم geodata.sqlite ثم geoload.py', en: 'where.html, then where.js, then geodata.sqlite, then geoload.py' } },
            { id: 'c', text: { ar: 'geodump.py ثم where.data ثم where.html ثم geodata.sqlite', en: 'geodump.py, then where.data, then where.html, then geodata.sqlite' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عناوين تُقرأ، فتُرمّز في قاعدة، فتُكتب ملفًا، فتُعرض في متصفح — كل حلقة تستهلك مخرَج التي قبلها.',
            en: 'Addresses are read, encoded into a database, written to a file, then displayed in a browser — each stage consumes the previous stage\u2019s output.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "lines.append('[%s, %s, %s],' % row)  # تسمية بلا اقتباس",
          right: "lines.append(\"[%s, %s, '%s'],\" % (row[0], row[1], row[2]))",
          note: {
            ar: 'بدون الاقتباس المفرد حول التسمية يصير السطر كودًا مكسورًا في JavaScript: Northeastern University اسم متغير غير معرّف عندها. الاقتباس جزء من السلسلة المبنية لا ترف.',
            en: 'Without the single quotes around the label the line becomes broken JavaScript code: Northeastern University would be an undefined variable there. The quotes are part of the built string, not decoration.',
          },
        },
        {
          wrong: "out = open('where-l16.js', 'a')  # تراكم على تشغيلات سابقة",
          right: "out = open('where-l16.js', 'w')",
          note: {
            ar: 'وضع a يلحق فيضيف سجلات مكررة كل تشغيل ويخدع المتصفح ببيانات قديمة وجديدة متداخلة. وضع w يفرّغ ثم يكتب — ملف جديد كل مرة كما تريد إعادة التوليد.',
            en: 'Append mode piles duplicated records on every run and feeds the browser old and new data interleaved. w mode empties then writes — a fresh file each time, exactly what regeneration wants.',
          },
        },
        {
          wrong: '# نسيان سطر الإغلاق]; أو سطر الافتتاح myData = [',
          right: "lines = ['myData = [']\n...\nlines.append('];')",
          note: {
            ar: 'where.html ينفّذ الملف كله: إغلاق ناقص يكسر القائمة كاملة فتختفي كل الدبابيس — وستبحث عن الخلل في وحدة المطورين لا في بايثون. لهذا نتحقق في بايثون قبل تسليم الملف.',
            en: 'where.html executes the whole file: a missing closer breaks the entire list and every pin vanishes — and you would hunt the bug in the developer console, not in Python. That is why we verify in Python before shipping the file.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'geodump.py يقرأ geodata.sqlite ويكتب where.js: myData = [[lat, lng, \u2019label\u2019], ...]; — قائمة قوائم بصيغة JavaScript الشبيهة ببايثون.', en: 'geodump.py reads geodata.sqlite and writes where.js: myData = [[lat, lng, \u2019label\u2019], ...]; — a list of lists in JavaScript syntax resembling Python.' },
        { ar: 'التوليد نص يتراكم: سطر افتتاح، وسطر [%s, %s, \u2019%s\u2019], لكل سجل، وسطر إغلاق — ثم join وكتابة بوضع w وقراءة عائدة تتحقق بالعدّ والعلامة.', en: 'Generation is accumulating text: an opener, one [%s, %s, \u2019%s\u2019], line per record, a closer — then join, writing in w mode, and a read-back verified by counting and the marker.' },
        { ar: 'where.html في المتصفح هو العارض الخارجي الذي يرسم على خريطة غوغل — نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية.', en: 'where.html in the browser is the external viewer drawing on a Google map — we generate the chart data here; the rendering happens in an external tool.' },
      ],
      reflectPrompt: {
        ar: 'لو كان لديك 400 جامعة في القاعدة، فما الذي يتغير في مولّدك؟ ولا شيء — الحلقة نفسها. متى يصبح حجم where.js مشكلة، وماذا ستضيف للتحقق قبل تسليم ملف يقرؤه متصفح؟',
        en: 'With 400 universities in the database, what changes in your generator? Nothing — the same loop. When does where.js\u2019s size become a problem, and what would you add to verification before shipping a file a browser will read?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch16.s1', pages: 'ص285 / pp.285' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch16.s1', pages: 'ص285 / pp.285' },
  ],
} satisfies Lesson;

export default lesson;
