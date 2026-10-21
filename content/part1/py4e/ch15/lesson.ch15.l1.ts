import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch15.l1 — "What Is a Database? / ما هي قاعدة البيانات؟"
 * Aligned with PY4E ch15 s1 (ما هي قاعدة البيانات؟) + s2 (مفاهيم قواعد
 * البيانات) + s3 (متصفح قاعدة البيانات SQLITE).
 * All expression is original.
 * Runnable warm-up uses sqlite3.connect(':memory:') exclusively (the platform
 * runtime preloads sqlite3); the book's file-based music.sqlite and the DB
 * Browser GUI stay desktop-only in prose.
 */
const lesson = {
  id: 'py4e.ch15.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 15,
  title: { ar: 'ما هي قاعدة البيانات؟', en: 'What Is a Database?' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch14.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حتى الآن عشت بياناتك في الذاكرة: قوائم وقواميس تُولد مع البرنامج وتموت مع انتهائه. الفصل الخامس عشر يفتح آخر أبواب الكتاب: قاعدة البيانات — برنامج قائم بذاته تتحدث معه بلغة SQL، يحفظ بياناتك على القرص فيبقى بعد انتهاء برنامجك، ويفهرسها فتبقى سريعة مهما ضخمت. ونحن محظوظون: SQLite مضمّنة في بايثون نفسها — ومضمّنة في مُشغّل هذه المنصة أيضًا، فكل سطر SQL في هذا الفصل قابل للتشغيل الحقيقي هنا. بنهاية الدرس ستكون قادرًا على: تسمية ما يميز قاعدة البيانات عن القواميس والملفات العادية، ووصف بنية الجداول والصفوف والأعمدة، وفتح اتصال بمؤشر وتنفيذ أول CREATE وSELECT حقيقيين.',
        en: 'Until now your data lived in memory: lists and dictionaries born with the program and dying with it. Chapter 15 opens the book\u2019s last door: the database — a standalone program you talk to in SQL, keeping your data on disk so it outlives your program, and indexing it so it stays fast no matter how large it grows. And we are lucky: SQLite is built into Python itself — and built into this platform\u2019s runtime too, so every SQL line in this chapter runs for real, right here. By the end of this lesson you will be able to: name what sets a database apart from dictionaries and plain files, describe the structure of tables, rows and columns, and open a connection with a cursor and run your first real CREATE and SELECT.',
      },
    },
    {
      kind: 'predict',
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('SELECT 1')\nrow = cur.fetchone()\nprint(row)\nprint(row[0])",
      question: {
        ar: 'قاعدة بيانات فُتحت للتو لأول مرة في مسارك. ماذا يعيد fetchone() بعد SELECT 1 — قيمة واحدة مجردة أم شيئًا آخر؟',
        en: 'A database has just been opened for the first time on your path. What does fetchone() return after SELECT 1 — a bare single value, or something else?',
      },
      reveal: {
        ar: '(1,) ثم 1. حتى القيمة الوحيدة تعود ملتفّة في صف — وصف قاعدة البيانات هو صف بايثون tuple من الفصل الثامن. لذلك يسبق الكتاب [0] على fetchone() دائمًا: نحن نفكّ الغلاف ثم نأخذ القيمة. هذه العادة — execute ثم fetchone ثم [0] — ستلازمك كل الفصل.',
        en: '(1,) then 1. Even a lone value comes back wrapped in a row — and a database row is a Python tuple, chapter 8\u2019s old friend. That is why the book prefixes [0] on fetchone() throughout: we unwrap the cover, then take the value. This habit — execute, then fetchone, then [0] — will stay with you all chapter.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'قاعدة البيانات: قاموس يعيش على القرص', en: 'A database: a dictionary that lives on disk' },
      chunks: [
        {
          ar: 'يعرّف الكتاب قاعدة البيانات بأنها ملف منظّم لتخزين البيانات، وتنظّم معظمها بطريقة تشبه قواميس الفصل التاسع: مفاتيح تقابل قيمًا. الفرق الجوهري أن القاعدة تسكن القرص الصلب أو أي وحدة تخزين دائمة، فتبقى بياناتها بعد انتهاء البرنامج، وتتسع لأكثر مما يستوعب القاموس المقيد بحجم الذاكرة. وبرمجيات القواعد مصممة لتظل سريعة مهما كبرت: تنشئ فهارس تتزامن مع كل إدخال جديد فلا يتباطأ الوصول إلى مدخل بعينه.',
          en: 'The book defines a database as an organized file for storing data, and most are organized in a way that resembles chapter 9\u2019s dictionaries: keys mapped to values. The essential difference is that the database lives on the hard disk or any persistent storage, so its data survives the program\u2019s end, and it holds more than a dict capped by memory size. Database software is engineered to stay fast as it grows: it builds indexes that keep pace with every insertion, so reaching one specific entry never slows down.',
        },
        {
          ar: 'وأنظمة كثيرة تخدم هذا الغرض: Oracle وMySQL وMicrosoft SQL Server وPostgreSQL وSQLite. يختار الكتاب SQLite لأنها شائعة ومضمّنة في بايثون نفسها، ومصممة لتُدمج داخل التطبيقات — متصفح Firefox مثلًا يستخدمها داخليًا. وهي مناسبة لمسائل استكشاف البيانات مثل تجول العنكبوت في شبكة أصدقاء تويتر — البرنامج الذي سيبنيه هذا الفصل. وقاعدة البيانات هنا برنامج قائم بذاته: أنت تُرسل إليه أوامر SQL ويرد عليك صفوفًا.',
          en: 'Many systems serve this purpose: Oracle, MySQL, Microsoft SQL Server, PostgreSQL and SQLite. The book picks SQLite because it is popular and built into Python itself, and designed to be embedded inside applications — the Firefox browser uses it internally, among others. It also suits data-exploration problems like spidering the web of Twitter friends — the program this chapter will build. And the database is a standalone program: you send it SQL commands and it answers with rows.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'جداول وأسطر وأعمدة — ومتصفح على حاسوبك', en: 'Tables, rows and columns — and a browser on your computer' },
      chunks: [
        {
          ar: 'على أول نظرة تشبه قاعدة البيانات الجدول المليء بالحقول: بنيتها الرئيسية ثلاث — الجداول والأسطر والأعمدة. يذكر الكتاب أسماءها الصورية في قواعد البيانات العلائقية: العلاقة relation للجدول، والصف tuple للسطر، والسمة attribute للعمود — لكننا سنعتمد الكلمات الشائعة كما فعل الكتاب. احفظ الشكل: جدول واحد يحوي صفوفًا متشابهة البنية، وكل عمود نوعه معلن — نص أو عدد صحيح أو عدد عشري.',
          en: 'At first glance a database looks like a table full of fields: its main structures are three — tables, rows and columns. The book names their formal shapes in relational databases: relation for the table, tuple for the row, attribute for the column — but we will use the common words, as the book does. Keep the shape in mind: one table holds rows of the same structure, and every column has a declared type — text, integer or decimal.',
        },
        {
          ar: 'وأداة سطح مكتب تساعدك عندك على حاسوبك الخاص: متصفح قاعدة البيانات SQLite — برنامج مجاني من sqlitebrowser.org يشبه محرر النصوص كما يشبهها للملفات النصية: عمليات بسيطة كإنشاء جدول أو تعديل صف أو استعلام خاطف تُجرى فيه مباشرة. أما العمليات المتعددة والمعقدة فنكتب لها برنامج بايثون — تمامًا كما نفعل مع النصوص. في هذه المنصة سنفعل كل شيء عبر بايثون ومكتبة sqlite3 المحمّلة في مُشغّلنا، وهو ما يجعل كل تمرين قابلًا للتشغيل هنا والآن.',
          en: 'And a desktop tool helps you on your own computer: the SQLite Database Browser — a free program from sqlitebrowser.org that stands to databases as the text editor stands to text files: simple operations like creating a table, editing a row or a passing query happen directly inside it. Multiple, complex operations, however, deserve a Python program — exactly as with text. On this platform we do everything through Python and the sqlite3 library loaded in our runtime — which makes every exercise runnable here and now.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'أول اتصال حقيقي: جدول وصف واحد', en: 'A first real connection: one table, one row' },
      code: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE friends (name TEXT, friends INTEGER)')\ncur.execute('INSERT INTO friends (name, friends) VALUES (?, ?)', ('drchuck', 20))\ncur.execute('SELECT name, friends FROM friends')\n\nrow = cur.fetchone()\nprint(row)\nprint(row[0])\nconn.close()",
      explanation: {
        ar: 'أربعة خطوات سترافقك كل الفصل: connect يفتح قناة إلى محرك قاعدة البيانات — هنا :memory: أي قاعدة خاصة تعيش طوال هذا التشغيل فقط في الذاكرة (الكتاب على حاسوبك يتصل بملف music.sqlite بنفس الاستدعاءات)، ثم cursor يعيد المؤشر الذي يشبه مقبض الملف من الفصل السابع، ثم execute ينفذ أمر SQL واحدًا واحدًا، وأخيرًا fetchone يجلب الصف التالي صفًّا من صفوف tuple. لاحظ علامتي ? في INSERT: موضعان تُسلَّم فيهما القيم كبيانات — تفصيلهما الكامل في الدرس التالي.',
        en: 'Four steps will accompany you all chapter: connect opens a channel to the database engine — here :memory:, a private database living in memory for this run only (the book, on your computer, connects to a music.sqlite file with the same calls); then cursor hands you the cursor, resembling chapter 7\u2019s file handle; then execute runs one SQL command at a time; and finally fetchone pulls the next row as a tuple of values. Notice the two ? marks in INSERT: slots where values are handed over as data — fully unpacked next lesson.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.first-table',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ أول قاعدة لك: أنشئ جدول tracks بعمودين title من نوع TEXT وplays من نوع INTEGER، وأدخل فيه صفًّا واحدًا بقيم (My Way, 15) باستخدام علامتي ?، ثم نفّذ SELECT لعمودي الجدول، واجلب الصف بـ fetchone في متغير row، واطبعه.',
        en: 'Build your first database: create a table tracks with two columns, title of type TEXT and plays of type INTEGER, insert one row with the values (My Way, 15) using the two ? marks, run a SELECT over the table\u2019s two columns, fetch the row with fetchone into a variable row, and print it.',
      },
      starterCode: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\n# أنشئ الجدول / create the table\n# cur.execute('CREATE TABLE ...')\n\n# أدخل الصف بعلامتي ? / insert the row with two ?\n\n# نفّذ SELECT ثم اجلب الصف في row واطبعه / run SELECT, fetch the row into row and print\n",
      solution: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\ncur.execute('SELECT title, plays FROM tracks')\nrow = cur.fetchone()\nprint(row)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الصف المجلوب هو (My Way, 15)', en: 'The fetched row is (My Way, 15)' },
          code: "assert row == ('My Way', 15), 'expected: (My Way, 15) | actual: %r' % (row,)",
          expected: '(My Way, 15)',
        },
        {
          id: 't2',
          name: { ar: 'الصف طُبع في الخرج', en: 'The row was printed' },
          code: "assert \"('My Way', 15)\" in __learner_output__, 'expected: the row printed | actual: %r' % __learner_output__",
          expected: 'the row printed',
        },
        {
          id: 't3',
          name: { ar: 'الصف مخزّن فعلًا في الجدول', en: 'The row is really stored in the table' },
          code: "cur.execute('SELECT COUNT(*) FROM tracks')\nstored = cur.fetchone()[0]\nassert stored == 1, 'expected: 1 stored row | actual: %r' % (stored,)",
          expected: '1 stored row',
        },
      ],
      hints: [
        { ar: 'نمط المثال المُشرَح نفسه حرفيًّا: CREATE TABLE بعمودين — اسمان ونوعان بين قوسين.', en: 'The pattern is literally the worked example: CREATE TABLE with two columns — names and types inside parentheses.' },
        { ar: 'في INSERT ضع علامتي ? مكان القيمتين ومررهما صفًّا في المعامل الثاني: (\'My Way\', 15).', en: "In INSERT put two ? marks in place of the values and pass them as a tuple in the second argument: ('My Way', 15)." },
        { ar: 'الهيكل:\ncur.execute(\'CREATE TABLE tracks (title TEXT, plays INTEGER)\')\ncur.execute(\'INSERT INTO tracks (title, plays) VALUES (?, ?)\', (\'My Way\', 15))\ncur.execute(\'SELECT title, plays FROM tracks\')\nrow = cur.fetchone()\nprint(row)', en: "The skeleton:\ncur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\ncur.execute('SELECT title, plays FROM tracks')\nrow = cur.fetchone()\nprint(row)" },
        { ar: "cur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\ncur.execute('SELECT title, plays FROM tracks')\nrow = cur.fetchone()\nprint(row)", en: "cur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\ncur.execute('SELECT title, plays FROM tracks')\nrow = cur.fetchone()\nprint(row)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-one-cell',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('SELECT 1')\nrow = cur.fetchone()\nprint(row)\nprint(row[0])\nprint(len(row))",
      solution: '(1,)\n1\n1',
      answer: '(1,)\n1\n1',
      hints: [
        { ar: 'SELECT 1 استعلام لا يلمس أي جدول — يرد دائمًا القيمة 1.', en: 'SELECT 1 touches no table — it always answers the value 1.' },
        { ar: 'fetchone تعيد صفًّا لا قيمة مجردة — حتى لو كان فيه خانة واحدة.', en: 'fetchone returns a row, not a bare value — even when it holds a single cell.' },
        { ar: 'الصف ذو الخانة الواحدة يُطبع (1,) — و[0] يفكه إلى 1 — وlen يقيس عدد الخانات لا قيمتها.', en: 'The one-cell row prints (1,) — [0] unwraps it to 1 — and len counts the cells, not their value.' },
        { ar: 'الخرْج:\n(1,)\n1\n1', en: 'The output:\n(1,)\n1\n1' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-persistence',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'حسب الفصل: قاموس بايثون وقاعدة بيانات كلاهما يربط مفاتيح بقيم — فما الفرق الجوهري الذي جعل قاعدة البيانات تناسب بيانات تتجاوز عمر البرنامج الواحد؟',
        en: 'Per the chapter: a Python dict and a database both map keys to values — so which essential difference made the database the right home for data outliving a single program run?',
      },
      options: [
        { id: 'a', text: { ar: 'القاعدة تخزن على وحدة تخزين دائمة كالقرص الصلب فتبقى بعد انتهاء البرنامج، وتفهرس بياناتها فتبقى سريعة مهما كبرت', en: 'The database stores on persistent storage like the hard disk, so data outlives the program, and it indexes data so lookups stay fast as it grows' } },
        { id: 'b', text: { ar: 'القاعدة أسرع دائمًا من القاموس في كل الحالات مهما كانت', en: 'The database is always faster than a dict in every case' } },
        { id: 'c', text: { ar: 'القاعدة لا تستخدم مفاتيح أصلًا بل ترقّم كل شيء بالترتيب', en: 'The database uses no keys at all, it just numbers everything in order' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'اسأل: أين تسكن كل بنية؟ الذاكرة تموت بانتهاء البرنامج — والقرص لا.', en: 'Ask: where does each structure live? Memory dies with the program — the disk does not.' },
        { ar: 'ميزة ثانية ذكرها الكتاب: الفهارس التي تُنشأ مع كل إدخال فلا يتباطأ الوصول مهما كبر الحجم.', en: 'A second feature the book names: indexes built alongside every insertion, so access never slows as size grows.' },
        { ar: 'الخياران الآخران ادعاءات: القاعدة قد تكون أبطأ من قاموس صغير، وهي تستخدم المفاتيح مثل القواميس تمامًا.', en: 'The other two options are claims: a database can be slower than a small dict, and it does use keys exactly like dicts.' },
        { ar: 'الجواب: أ — القرص الدائم والفهارس؛ أما "أسرع دائمًا" فادعاء لا يقوله الكتاب.', en: 'Answer: a — persistent disk plus indexes; "always faster" is a claim the book never makes.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-connect',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل بالكلمة الواحدة: التابع الذي يفتح قناة الاتصال بمحرك قاعدة البيانات هو sqlite3.____(¶¶:memory:¶¶) — وقد مررنا له :memory: لقاعدة تعيش طوال التشغيل.',
        en: 'Complete with one word: the method that opens the channel to the database engine is sqlite3.____(¶¶:memory:¶¶) — we passed :memory: for a database living for the duration of the run.',
      },
      answer: 'connect',
      solution: 'connect',
      hints: [
        { ar: 'هو أول استدعاء في كل برنامج قواعد بيانات رأيته هذا الدرس.', en: 'It is the first call in every database program you saw this lesson.' },
        { ar: 'اتصال بالإنجليزية — واسمه يصف دوره حرفيًّا.', en: 'Connection in English — the name literally describes its role.' },
        { ar: 'بعد الاتصال يأتي cursor، وقبل الاثنين لا شيء.', en: 'After it comes cursor — and before both, nothing.' },
        { ar: 'الجواب: connect', en: 'Answer: connect' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — أول محادثة مع محرك قاعدة بيانات\n# Your playground — a first conversation with a database engine\n\nimport sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('SELECT 1')\nprint(cur.fetchone())\n\ncur.execute('CREATE TABLE notes (body TEXT)')\ncur.execute('INSERT INTO notes (body) VALUES (?)', ('first note',))\ncur.execute('SELECT body FROM notes')\nprint(cur.fetchone())\n\n# جرّب: أدخل ملاحظة ثانية ثم أضف حلقة for تطبع كل الصفوف / try: insert a second note, then a for loop printing every row\n# جرّب: اطبع type(cur.fetchone()) بعد استهلاك كل الصفوف — ماذا يرد؟ / try: print type(cur.fetchone()) after the rows run out — what comes back?",
      prompt: {
        ar: 'جرّب بنفسك: أرسل SELECT 1 واكتشف شكل الصف، ثم أنشئ جدول ملاحظات وأدخل فيه صفين وامر عليهما بحلقة for كما في الفصل الثامن. ثم اسأل fetchone بعد نفاد الصفوف — الإجابة None هي أول علامة علم تصادفها في هذا الفصل وستصلح لك حارسًا لاحقًا. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: send SELECT 1 and discover the row\u2019s shape, then create a notes table, insert two rows and walk them with a for loop as in chapter 8. Then ask fetchone after the rows run out — the None answer is your first flag of this chapter and will serve you as a guard later. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا تبقى قواعد البيانات سريعة في الوصول إلى مدخل بعينه حتى مع ملايين الإدخالات؟',
            en: 'Why do databases stay fast when reaching one specific entry even with millions of records?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنها تنشئ فهارس تتزامن مع إدخال البيانات الجديدة، فالوصول إلى أي مدخل لا يبطؤ مع الكبر', en: 'Because they build indexes that keep pace with new insertions, so reaching any entry does not slow with size' } },
            { id: 'b', text: { ar: 'لأنها تحمل كل البيانات في ذاكرة الحاسوب كاملة', en: 'Because they hold all data fully in the computer\u2019s memory' } },
            { id: 'c', text: { ar: 'لأنها تبحث من أول الجدول إلى آخره بسرعة مذهلة', en: 'Because they scan from the first row to the last at amazing speed' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب نص على السبب حرفيًّا: الفهارس التي تُنشأ مع كل إدخال جديد تسمح بالوصول السريع — وهو ما يصنع فرقًا حقيقيًا عند الملايين لا العشرات.',
            en: 'The book states the reason verbatim: indexes built alongside each new insertion allow fast access — a difference that truly matters at millions of rows, not dozens.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في مصطلحات قواعد البيانات العلائقية: ما الأسماء الصورية للجدول والسطر والعمود؟',
            en: 'In relational-database terminology: what are the formal names of the table, the row and the column?',
          },
          options: [
            { id: 'a', text: { ar: 'العلاقة relation والصف tuple والسمة attribute — لكن الكتاب يعتمد الكلمات الشائعة: table وrow وcolumn', en: 'relation for the table, tuple for the row, attribute for the column — but the book uses the common words: table, row, column' } },
            { id: 'b', text: { ar: 'القاموس dictionary والمفتاح key والقيمة value', en: 'dictionary, key and value' } },
            { id: 'c', text: { ar: 'الملف file والمقبض handle والمخزن buffer', en: 'file, handle and buffer' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأسماء الصورية من نظرية العلاقات، والكتاب ذكرها ثم اعتذر عنها: سنستخدم الكلمات الشائعة — جداول وأسطر وأعمدة — فهي أوضح للمبتدئ.',
            en: 'The formal names come from relational theory; the book mentions them then steps aside: we will use the common words — tables, rows, columns — clearer for a beginner.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "ومن الفصل التاسع: d['chuck'] = 46 يخزن 46 تحت مفتاح chuck في الذاكرة. ما الذي يضيفه INSERT INTO ages VALUES (?, ?) بنفس المعنى؟",
            en: "From chapter 9: d['chuck'] = 46 stores 46 under the key chuck in memory. What does INSERT INTO ages VALUES (?, ?) add, in the same spirit?",
          },
          options: [
            { id: 'a', text: { ar: 'يخزن الصف في قاعدة البيانات فتبقى البيانات بعد انتهاء البرنامج وتتسع أبعد من حجم الذاكرة', en: 'It stores the row in the database, so the data outlives the program and scales past memory size' } },
            { id: 'b', text: { ar: 'لا شيء — الاثنان عمليتان متطابقتان تمامًا', en: 'Nothing — the two are exactly identical operations' } },
            { id: 'c', text: { ar: 'يخزن البيانات أسرع لكنها تفقد بعد انتهاء السطر فقط', en: 'It stores data faster, but it is lost at the end of the statement' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'INSERT هو نظير الإسناد في القاموس لكنه يكتب في القاعدة: نفس فكرة مفتاح وقيمة، مع البقاء على القرص والاتساع والفهرسة — الفروق التي فتح بها الفصل بابه.',
            en: 'INSERT is the dict assignment\u2019s counterpart that writes into the database: the same key-and-value idea, with disk persistence, scale and indexing — the very differences the chapter opened with.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'الكتاب شبه متصفح قاعدة البيانات على حاسوبك بمحرر النصوص — فيمَ يكفي المتصفح ومتى نكتب برنامج بايثون؟',
            en: 'The book likens the desktop DB Browser to a text editor — when is the browser enough, and when do we write a Python program?',
          },
          options: [
            { id: 'a', text: { ar: 'العمليات البسيطة والمفردة تُجرى في المتصفح، والعمليات المتعددة أو المعقدة تستحق برنامجًا — كعلاقتنا بمحرر النصوص والملفات', en: 'Single, simple operations happen in the browser; multiple or complex operations deserve a program — just like our relationship between text editors and files' } },
            { id: 'b', text: { ar: 'المتصفح للقراءة فقط ولا يقبل أي تعديل', en: 'The browser is read-only and accepts no edits' } },
            { id: 'c', text: { ar: 'لا يوجد فرق — المتصفح يفعل كل ما تفعله بايثون بالضبط', en: 'No difference — the browser does exactly everything Python does' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التشبيه الكتابي دقيق: تعديل بسيط في ملف؟ افتح المحرر. عمليات كثيرة ومتكررة؟ اكتب برنامجًا. والقاعدة نفس المنطق — وهذا البرنامج هو ما سنتعلمه كل الفصل.',
            en: 'The book\u2019s analogy is precise: a small edit in a file? Open the editor. Many repeated operations? Write a program. Databases follow the same logic — and that program is what this whole chapter teaches.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "cur.execute('SELECT 1')\nrow = cur.fetchone()\n# دون إنشاء مؤشر أولًا / no cursor created first",
          right: "cur = conn.cursor()\ncur.execute('SELECT 1')\nrow = cur.fetchone()",
          note: {
            ar: 'في نمط الكتاب استدعاء execute على المؤشر لا على الاتصال: أنشئ cur = conn.cursor() بعد الاتصال مباشرة، وإلا NameError عند أول execute.',
            en: 'In the book\u2019s style, execute is called on the cursor, not the connection: create cur = conn.cursor() right after connecting, or the first execute meets a NameError.',
          },
        },
        {
          wrong: "cur.execute('SELECT 1')\nvalue = cur.fetchone()\nprint(value + 1)",
          right: "cur.execute('SELECT 1')\nrow = cur.fetchone()\nprint(row[0] + 1)",
          note: {
            ar: 'fetchone يعيد صفًّا tuple لا قيمة مجردة — حتى لخانة واحدة. اجمع row[0] لا الصف نفسه، وإلا TypeError عند جمع صف بعدد.',
            en: 'fetchone returns a row tuple, not a bare value — even for one cell. Add row[0], not the row itself, or a TypeError meets your attempt to add a row and a number.',
          },
        },
        {
          wrong: "cur.execute('SELECT name FROM friends')\nprint(cur)  # أظنّ هذا الصفوف! / expecting the rows here!",
          right: "cur.execute('SELECT name FROM friends')\nprint(cur.fetchone())",
          note: {
            ar: 'طباعة المؤشر نفسه لا تطبع البيانات — المؤشر طلب معلّق ينتظر الاستهلاك. اطلب الصفوف: fetchone للصف التالي أو fetchall للقائمة كلها أو حلقة for على المؤشر.',
            en: 'Printing the cursor itself prints no data — the cursor is a pending request waiting to be consumed. Ask for rows: fetchone for the next one, fetchall for the whole list, or a for loop over the cursor.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'قاعدة البيانات ملف منظّم على تخزين دائم يربط مفاتيح بقيم كقاموسنا، لكنه يبقى بعد انتهاء البرنامج ويفهرس بياناته فلا يبطؤ مهما كبر.', en: 'A database is an organized file on persistent storage mapping keys to values like our dicts — but it outlives the program and indexes its data, staying fast as it grows.' },
        { ar: 'بنيتها جداول وصفوف وأعمدة (صوريًّا: علاقة relation وصف tuple وسمة attribute) — وSQLite مضمّنة في بايثون وفي مُشغّل هذه المنصة فكل أمثلتنا حقيقية.', en: 'Its structure is tables, rows and columns (formally relation, tuple, attribute) — and SQLite is built into Python and into this platform\u2019s runtime, so every example here is real.' },
        { ar: 'الخطوات الأربعة: connect لفتح القناة، cursor لمقبض يشبه ملفات الفصل السابع، execute لأمر SQL واحد، وfetchone لصف tuple — و[0] يفك القيمة.', en: 'The four steps: connect opens the channel, cursor gives a handle like chapter 7\u2019s files, execute runs one SQL command, and fetchone returns a tuple row — [0] unwraps the value.' },
      ],
      reflectPrompt: {
        ar: 'اكتب من الذاكرة البرنامج الرباعي: اتصال بمؤشر، إنشاء جدول هوايات hobbies بعمودين، إدخال هوايتك المفضلة، واسترجاعها وطباعتها. أي خطوة نسيتها أول مرة — ولماذا يتعطل البرنامج بدونها؟',
        en: 'Write the four-step program from memory: connect with a cursor, create a hobbies table with two columns, insert your favorite hobby, then fetch and print it. Which step did you forget first — and why does the program stall without it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch15.s1', pages: 'ص252 / pp.252' },
        { book: 'PY4E', section: 'py4e.ch15.s2', pages: 'ص252 / pp.252' },
        { book: 'PY4E', section: 'py4e.ch15.s3', pages: 'ص253 / pp.253' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch15.s1', pages: 'ص252 / pp.252' },
    { book: 'PY4E', section: 'py4e.ch15.s2', pages: 'ص252 / pp.252' },
    { book: 'PY4E', section: 'py4e.ch15.s3', pages: 'ص253 / pp.253' },
  ],
} satisfies Lesson;

export default lesson;
