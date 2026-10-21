import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch15.l4 — "Data Modeling and Multiple Tables / نمذجة البيانات
 * والجداول المتعددة"
 * Aligned with PY4E ch15 s7 (نمذجة البيانات) + s8 (برمجة قاعدة بيانات ذات
 * الجداول المتعددة).
 * All expression is original.
 * The book's Twitter modeling (People/Follows, no repeated strings, UNIQUE
 * constraints, retrieve-or-add with cur.lastrowid) is taught faithfully; the
 * runnable worked example applies the same pattern to the music-library tables
 * (artists + albums with artist_id) that the final project will build on.
 */
const lesson = {
  id: 'py4e.ch15.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 15,
  title: { ar: 'نمذجة البيانات والجداول المتعددة', en: 'Data Modeling and Multiple Tables' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch15.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'جدول واحد كفى حين عدّينا أصدقاء كل حساب — لكنه يتعثر حين نسأل: من يتابع من؟ القوة الحقيقية لقاعدة البيانات العلائقية في جداول متعددة مترابطة، وعملية تقسيم البيانات إليها وإنشاء الروابط تسمى نمذجة البيانات. ستعيد اليوم كتابة نموذج الكتاب: جدول أشخاص بمفتاح رقمي تولّده القاعدة تلقائيًّا، وجدول علاقات يخزن أزواج أرقام لا أسماء — والنمط البرمجي الشهير: استرجع المفتاح أو أضف الصف وخذ مفتاحه الجديد. بنهاية الدرس ستكون قادرًا على: تبرير تقسيم جدول واحد، وإنشاء جداول بمفاتيح أساسية وقيود UNIQUE، وتنفيذ نمط استرجاع-أو-أضف بـ lastrowid.',
        en: 'One table sufficed while we counted each account\u2019s friends — but it stumbles when we ask: who follows whom? The real power of a relational database lies in multiple linked tables, and the craft of splitting data among them and creating the links is called data modeling. Today you re-architect the book\u2019s model: a people table with a numeric key the database generates automatically, and a relations table storing pairs of numbers instead of names — plus the famous programming pattern: retrieve the key, or add the row and take its new key. By the end of this lesson you will be able to: justify splitting one table, create tables with primary keys and UNIQUE constraints, and implement retrieve-or-add with lastrowid.',
      },
    },
    {
      kind: 'predict',
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE People (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('INSERT INTO People (name) VALUES (?)', ('drchuck',))\ncur.execute('INSERT INTO People (name) VALUES (?)', ('opencontent',))\ncur.execute('SELECT id, name FROM People')\nprint(cur.fetchall())",
      question: {
        ar: 'لم نمرر أي id في أي INSERT — فمن أين جاء الرقمان 1 و2 في النتيجة؟',
        en: 'We passed no id in either INSERT — so where did the numbers 1 and 2 in the result come from?',
      },
      reveal: {
        ar: '[(1, \'drchuck\'), (2, \'opencontent\')] — القاعدة نفسها رسمت الرقمين. العمود المصرَّح INTEGER PRIMARY KEY يجعل SQLite تُسند تلقائيًّا رقمًا فريدًا لكل صف جديد تُدخله — أنت لا تعتني بالترقيم، والقاعدة تضمن عدم التكرار. هذا المفتاح الأساسي هو خيط الربط الذي سيربط الجداول كلها.',
        en: "[(1, 'drchuck'), (2, 'opencontent')] — the database itself drew the two numbers. A column declared INTEGER PRIMARY KEY makes SQLite assign a unique number automatically to every new row you insert — you never mind the numbering, and the database guarantees no repeats. This primary key is the thread that will tie all the tables together.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من جدول واحد إلى جداول مترابطة', en: 'From one table to linked tables' },
      chunks: [
        {
          ar: 'يذكر الكتاب المشكلة بدقة: لنسجل كل علاقة متابعة في جدول Pals (from_friend, to_friend) بالأسماء — فسنضيف اسم drchuck عشرين مرة باعتباره أول طرف، وهذا ينتهك أهم معايير قواعد البيانات: لا تكرر السلسلة النصية نفسها أكثر من مرة. السلاسل تشغل حجمًا أكبر من الأرقام على القرص وفي الذاكرة وتحتاج زمن معالجة أكبر في المقارنة — وميزان بضعة مئات من المدخلات قد يتسامح، أما مليون شخص بمئة مليون علاقة فالبحث فيه يتوقف على هذا القرار. الحل: استبدل كل سلسلة متكررة برقم.',
          en: 'The book frames the problem precisely: record every follow in a Pals (from_friend, to_friend) table by name — and drchuck\u2019s name gets added twenty times as the first party, violating the cardinal rule of databases: never repeat the same string. Strings take more disk and memory space than numbers and need more processing time to compare — a scale of a few hundred entries might forgive it, but with a million people and a hundred million links, searching stops and stares at this decision. The answer: replace every repeated string with a number.',
        },
        {
          ar: 'نموذج الكتاب جدولان: People (id INTEGER PRIMARY KEY, name TEXT UNIQUE, retrieved INTEGER) وFollows (from_id INTEGER, to_id INTEGER, UNIQUE(from_id, to_id)). العمود id مفتاح أساسي تسنده SQLite تلقائيًّا لكل صف، وUNIQUE على الاسم وعلى الزوج معًا قيود تفرضها القاعدة أثناء الإدخال فتمنع أخطاءنا — كإضافة العلاقة نفسها مرتين. وفي مكتبتنا الموسيقية النمط نفسه: جدول artists بمفاتيحه وجدول albums يحمل في كل صف artist_id رقمًا بدل اسم الفنان — كل *_id سهم نحو جدول آخر.',
          en: 'The book\u2019s model is two tables: People (id INTEGER PRIMARY KEY, name TEXT UNIQUE, retrieved INTEGER) and Follows (from_id INTEGER, to_id INTEGER, UNIQUE(from_id, to_id)). The id column is a primary key SQLite assigns automatically per row, and the UNIQUE on the name and on the pair together are constraints the database enforces at insert time, blocking our mistakes — like adding the same relation twice. In our music library the same pattern: an artists table with its keys and an albums table whose every row carries an artist_id number instead of the artist name — every *_id is an arrow toward another table.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'استرجع أو أضف: المفتاح يحلّ المشكلة', en: 'Retrieve or add: the key resolves it' },
      chunks: [
        {
          ar: 'النمط الأشهر في برامج الكتاب — نُفذ مرتين — هو: عندك اسم منطقي وتريد مفتاحه الرقمي. اسأل أولًا: SELECT id FROM People WHERE name = ? LIMIT 1 ثم fetchone()[0] — فإن وجدت الصف فالمفتاح بين يديك. وإن لم يوجد فأضف الصف الجديد ثم اسأل cur.lastrowid: قيمة سحرية يحملها المؤشر بعد كل INSERT وتعطيك المفتاح الذي أسندته القاعدة للصف الجديد. بهذين الطريقين يتحول كل اسم يظهر من رد JSON إلى رقم نظيف في جدول People.',
          en: 'The most famous pattern in the book\u2019s programs — executed twice — is: you hold a logical name and want its numeric key. First ask: SELECT id FROM People WHERE name = ? LIMIT 1 then fetchone()[0] — if the row exists, the key is in your hands. If it does not, insert the new row and then read cur.lastrowid: a magic attribute the cursor carries after every INSERT, giving you the key the database assigned to the new row. By these two roads every name appearing in a JSON reply becomes a clean number in the People table.',
        },
        {
          ar: 'ولاحظ الصيغة INSERT OR IGNORE INTO People (name, retrieved) VALUES (?, 0): إذا انتهك الإدخال قيد UNIQUE فالقاعدة عادة ترفع خطأ، وOR IGNORE يطلب منها تجاهل الإدخال المخالف بهدوء — شبكة أمان يحكي الكتاب عنها بشغف لأنها تمنع الأخطاء وتسهّل الكود. وبعدها يفحص البرنامج cur.rowcount: عدد الصفوف المتأثرة — إن لم يكن 1 فثبت أن الإدخال فشل فعلًا. أما تخزين العلاقة نفسها فقد صار INSERT OR IGNORE INTO Follows (from_id, to_id) VALUES (?, ?) بمفتاحين اثنين فقط.',
          en: 'Notice the form INSERT OR IGNORE INTO People (name, retrieved) VALUES (?, 0): if an insert violates a UNIQUE constraint the database normally raises an error, and OR IGNORE asks it to quietly skip the violating insert — a safety net the book speaks of fondly because it blocks mistakes and simplifies the code. Afterward the program checks cur.rowcount, the count of affected rows — if it is not 1, the insert truly failed. As for storing the relation itself, it has become INSERT OR IGNORE INTO Follows (from_id, to_id) VALUES (?, ?) with just two keys.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'فنانون وألبومات: جدولان بمفتاح رابط', en: 'Artists and albums: two tables, one linking key' },
      code: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, artist_id INTEGER)')\n\ndef artist_id(name):\n    # استرجع المفتاح إن كان الفنان معروفًا / retrieve the key if the artist is known\n    cur.execute('SELECT id FROM artists WHERE name = ? LIMIT 1', (name,))\n    row = cur.fetchone()\n    if row is None:\n        # أضف الصف وخذ المفتاح الجديد / add the row and take its new key\n        cur.execute('INSERT INTO artists (name) VALUES (?)', (name,))\n        return cur.lastrowid\n    return row[0]\n\nfor title, artist in [('Ahdan', 'Fairuz'), ('Kifak Inta', 'Fairuz'), ('Houdou Nisbi', 'Ziad Rahbani')]:\n    aid = artist_id(artist)\n    cur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', (title, aid))\nconn.commit()\n\ncur.execute('SELECT id, name FROM artists')\nprint(cur.fetchall())\ncur.execute('SELECT title, artist_id FROM albums')\nprint(cur.fetchall())\nconn.close()",
      explanation: {
        ar: 'الدالة artist_id هي نمط استرجاع-أو-أضف مصغّرًا: استعلام بـ LIMIT 1، وعلامة None من fetchone — العلم الذي تعلمناه في الفصل الثالث عشر بدل try/except — ثم إضافة وlastrowid عند الحاجة. فنّانة Fairuz سُجلت مرة واحدة بمفتاح 1 وألبومان يحملان الرقم نفسه بدل تكرار اسمها، وZiad Rahbani نال مفتاح 2. الجدولان يُسألان كلٌّ على حدة — وفي الدرس القادم سيعيد JOIN فصلهما في إجابة واحدة.',
        en: 'The artist_id function is retrieve-or-add in miniature: a LIMIT 1 query, the None flag from fetchone — the flag we learned in chapter 13 instead of try/except — then an insert and lastrowid when needed. The artist Fairuz was registered once with key 1 and two albums carry that same number instead of repeating her name, while Ziad Rahbani took key 2. The two tables are queried separately — and next lesson JOIN will re-fuse them into single answers.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.people-follows',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ نموذج الكتاب المصغّر: جدول People (id INTEGER PRIMARY KEY, name TEXT UNIQUE) وجدول Follows (from_id INTEGER, to_id INTEGER, UNIQUE(from_id, to_id)). أدخل الأسماء drchuck وopencontent وlhawthorn (فليتقم كلٌّ منها مفتاحه تلقائيًّا)، ثم أدخل علاقتي (1, 2) و(1, 3) في Follows، والتزم بـ commit، ثم اطبع SELECT id, name FROM People كاملًا بـ fetchall، وSELECT from_id, to_id FROM Follows كذلك.',
        en: 'Build the book\u2019s model in miniature: a People table (id INTEGER PRIMARY KEY, name TEXT UNIQUE) and a Follows table (from_id INTEGER, to_id INTEGER, UNIQUE(from_id, to_id)). Insert the names drchuck, opencontent and lhawthorn (let each take its key automatically), then insert the relations (1, 2) and (1, 3) into Follows, commit, then print SELECT id, name FROM People in full with fetchall, and likewise SELECT from_id, to_id FROM Follows.',
      },
      starterCode: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\n# جدولا الكتاب / the book's two tables\n# cur.execute('CREATE TABLE People ...')\n# cur.execute('CREATE TABLE Follows ...')\n\n# أدخل الأسماء الثلاثة (بلا id — القاعدة ترقم) / insert the three names (no id — the database numbers)\n\n# أدخل علاقتي المتابعة / insert the two follow relations\n\n# commit ثم اطبع الجدولين / commit then print both tables\n",
      solution: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE People (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE Follows (from_id INTEGER, to_id INTEGER, UNIQUE(from_id, to_id))')\n\nfor name in ['drchuck', 'opencontent', 'lhawthorn']:\n    cur.execute('INSERT INTO People (name) VALUES (?)', (name,))\n\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 2))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 3))\nconn.commit()\n\ncur.execute('SELECT id, name FROM People')\nprint(cur.fetchall())\ncur.execute('SELECT from_id, to_id FROM Follows')\nprint(cur.fetchall())",
      tests: [
        {
          id: 't1',
          name: { ar: 'الأشخاص الثلاثة بمفاتيحهم التلقائية', en: 'The three people with their automatic keys' },
          code: "cur.execute('SELECT id, name FROM People')\npeople = cur.fetchall()\nassert people == [(1, 'drchuck'), (2, 'opencontent'), (3, 'lhawthorn')], 'expected: three numbered people | actual: %r' % (people,)",
          expected: 'three numbered people',
        },
        {
          id: 't2',
          name: { ar: 'علاقتا المتابعة مخزنتان', en: 'Both follow relations stored' },
          code: "cur.execute('SELECT from_id, to_id FROM Follows')\nfollows = cur.fetchall()\nassert follows == [(1, 2), (1, 3)], 'expected: two relations | actual: %r' % (follows,)",
          expected: 'two relations',
        },
        {
          id: 't3',
          name: { ar: 'الخرج يعرض الجدولين', en: 'The output shows both tables' },
          code: "assert \"[(1, 'drchuck'), (2, 'opencontent'), (3, 'lhawthorn')]\" in __learner_output__ and '[(1, 2), (1, 3)]' in __learner_output__, 'expected: both fetchall reprs printed | actual: %r' % __learner_output__",
          expected: 'both fetchall reprs printed',
        },
      ],
      hints: [
        { ar: 'في INSERT إلى People اكتب (name) فقط في الحقول — لا تلمس id، فالقاعدة ترقم عنك.', en: 'In the INSERT into People list only (name) in the fields — never touch id; the database numbers for you.' },
        { ar: 'حلقة for على قائمة الأسماء تكفي للإدخال الثلاثي — كما في برنامج الكتاب twfriends.py.', en: 'A for loop over the list of names covers the three inserts — as in the book\u2019s twfriends.py program.' },
        { ar: 'الهيكل:\nfor name in [\'drchuck\', \'opencontent\', \'lhawthorn\']:\n    cur.execute(\'INSERT INTO People (name) VALUES (?)\', (name,))\ncur.execute(\'INSERT INTO Follows (from_id, to_id) VALUES (?, ?)\', (1, 2))\ncur.execute(\'INSERT INTO Follows (from_id, to_id) VALUES (?, ?)\', (1, 3))\nconn.commit()', en: "The skeleton:\nfor name in ['drchuck', 'opencontent', 'lhawthorn']:\n    cur.execute('INSERT INTO People (name) VALUES (?)', (name,))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 2))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 3))\nconn.commit()" },
        { ar: "for name in ['drchuck', 'opencontent', 'lhawthorn']:\n    cur.execute('INSERT INTO People (name) VALUES (?)', (name,))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 2))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 3))\nconn.commit()\ncur.execute('SELECT id, name FROM People')\nprint(cur.fetchall())\ncur.execute('SELECT from_id, to_id FROM Follows')\nprint(cur.fetchall())", en: "for name in ['drchuck', 'opencontent', 'lhawthorn']:\n    cur.execute('INSERT INTO People (name) VALUES (?)', (name,))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 2))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 3))\nconn.commit()\ncur.execute('SELECT id, name FROM People')\nprint(cur.fetchall())\ncur.execute('SELECT from_id, to_id FROM Follows')\nprint(cur.fetchall())" },
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
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE People (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('INSERT INTO People (name) VALUES (?)', ('a',))\ncur.execute('INSERT INTO People (name) VALUES (?)', ('b',))\ncur.execute('SELECT id FROM People WHERE name = ?', ('b',))\nprint(cur.fetchone()[0])\ncur.execute('INSERT INTO People (name) VALUES (?)', ('c',))\nprint(cur.lastrowid)",
      solution: '2\n3',
      answer: '2\n3',
      hints: [
        { ar: 'أول إدخال أخذ id = 1 تلقائيًّا وثاني إدخال أخذ 2.', en: 'The first insert automatically took id = 1 and the second took 2.' },
        { ar: 'SELECT id WHERE name = b يجيب عن مفتاح الصف الثاني.', en: 'SELECT id WHERE name = b answers the second row\u2019s key.' },
        { ar: 'lastrowid بعد INSERT الثالث يحمل مفتاح الصف الأحدث.', en: 'lastrowid after the third INSERT carries the newest row\u2019s key.' },
        { ar: 'الخرْج:\n2\n3', en: 'The output:\n2\n3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-numbers-not-strings',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'حسب معيار الكتاب: لماذا نخزن artist_id رقميًّا في كل ألبوم بدل تكرار اسم الفنان نصًّا؟',
        en: 'Per the book\u2019s rule: why do we store a numeric artist_id in every album instead of repeating the artist\u2019s name as text?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن تكرار السلسلة النصية ينتهك أهم معايير القواعد — والأرقام أصغر في التخزين وأسرع في المقارنة والترتيب، والمفتاح يربط الجداول', en: 'Because repeating the string violates the cardinal rule — numbers are smaller in storage and faster to compare and sort, and the key links the tables' } },
        { id: 'b', text: { ar: 'لأن SQL تمنع تخزين نص في أكثر من صف بقاعدة صريحة', en: 'Because SQL explicitly forbids storing text in more than one row' } },
        { id: 'c', text: { ar: 'لأن الأسماء قد تتغير والأرقام أجمل في الطباعة', en: 'Because names may change and numbers look prettier in printouts' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكر حساب الكتاب: مليون شخص ومئة مليون رابط — كم مرة تتكرر سلسلة الاسم؟', en: 'Remember the book\u2019s arithmetic: a million people and a hundred million links — how many times does the name string repeat?' },
        { ar: 'الميزة مزدوجة: المساحة والسرعة في المقارنة — والمفتاح الرقمي هو خيط الربط بين الجداول أصلًا.', en: 'The advantage is twofold: space and comparison speed — and the numeric key is the very thread linking tables.' },
        { ar: 'SQL لا تمنع تكرار النصوص عمومًا — القاعدة عرفية من معايير التصميم لا من قواعد اللغة.', en: 'SQL does not generally forbid repeating text — the rule is a design convention, not a language law.' },
        { ar: 'الجواب: أ — لا تكرار للسلاسل، وأرقام أصغر وأسرع وتربط.', en: 'Answer: a — no repeated strings, and numbers are smaller, faster and linking.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-lastrowid',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل بالكلمة الواحدة: بعد INSERT ناجح لصف جديد يحمل خاصية المؤشر cur.____ قيمة المفتاح الأساسي الذي أسندته القاعدة لذلك الصف.',
        en: 'Complete with one word: after a successful INSERT of a new row, the cursor attribute cur.____ holds the primary key the database assigned to that row.',
      },
      answer: 'lastrowid',
      solution: 'lastrowid',
      hints: [
        { ar: 'اسمها يذكر "آخر صف" — سطر واحد يكفي للتفسير.', en: 'Its name mentions the last row — one line explains it all.' },
        { ar: 'رأيناها في الدرس المُشرَح داخل دالة استرجاع-أو-أضف.', en: 'You saw it in the worked example inside the retrieve-or-add function.' },
        { ar: 'تبدأ بـ last وتنتهي بـ rowid — وصف واحد طويل.', en: 'It starts with last and ends with rowid — one long word.' },
        { ar: 'الجواب: lastrowid', en: 'Answer: lastrowid' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — القيود تتكلم: جرّب خرقها\n# Your playground — the constraints speak: try to break them\n\nimport sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Fairuz',))\n\n# جرّب: أدخل Fairuz مرة أخرى بلا OR IGNORE — ماذا يرمي المحرك؟ / try: insert Fairuz again without OR IGNORE — what does the engine raise?\n# cur.execute('INSERT INTO artists (name) VALUES (?)', ('Fairuz',))\n\n# ثم جرّب النسخة الآمنة وقارن rowcount / then try the safe version and compare rowcount\ncur.execute('INSERT OR IGNORE INTO artists (name) VALUES (?)', ('Fairuz',))\nprint('rowcount:', cur.rowcount)\nprint('lastrowid:', cur.lastrowid)\n\n# جرّب: أدخل فنانًا جديدًا ولاحظ هل عاد الترقيم إلى 1؟ / try: insert a new artist and watch whether numbering restarts at 1?\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Ziad Rahbani',))\nprint('new key:', cur.lastrowid)",
      prompt: {
        ar: 'جرّب بنفسك: خرق UNIQUE بلا OR IGNORE يرمي IntegrityError — والأمان بـ OR IGNORE يجعل rowcount صفرًا مبلغًا أن الإدخال تجاهل. ولاحظ أن الترقيم لم يعد إلى 1 بعد رفض Fairuz: المفاتيح لا تُعاد تصفيرها. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: breaking UNIQUE without OR IGNORE raises IntegrityError — and the safe OR IGNORE form reports rowcount zero, confessing the insert was ignored. And notice the numbering did not restart at 1 after Fairuz\u2019s rejection: keys are never renumbered. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الذي تسميه عملية تقسيم البيانات إلى جداول متعددة وإنشاء الروابط بينها؟',
            en: 'What do we call the craft of splitting data into multiple tables and creating the links between them?',
          },
          options: [
            { id: 'a', text: { ar: 'نمذجة البيانات data modeling — والمخطط الذي يظهر الجداول وعلاقاتها يسمى نموذج البيانات', en: 'Data modeling — and the diagram showing the tables and their relationships is called the data model' } },
            { id: 'b', text: { ar: 'التجميع aggregation — لأننا نجمع البيانات في جداول', en: 'Aggregation — because we gather data into tables' } },
            { id: 'c', text: { ar: 'التسلسل serialization — لأننا نصطف الصفوف', en: 'Serialization — because we line up the rows' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يعرّفها حرفيًّا: نمذجة البيانات هي تقسيم البيانات إلى عدد من الجداول وإنشاء روابط بينها — ومهارة تحتاج خبرة، ونتعلم أساسياتها فقط.',
            en: 'The book defines it verbatim: data modeling is splitting data into a number of tables and creating links between them — a skill demanding experience, and we learn only its basics.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الذي يضيفه UNIQUE(from_id, to_id) إلى جدول Follows؟',
            en: 'What does UNIQUE(from_id, to_id) add to the Follows table?',
          },
          options: [
            { id: 'a', text: { ar: 'قيدًا تفرضه القاعدة: لا يُقبل إدخال يكرر زوج المفتاحين نفسه — فتُمنع علاقة الصداقة المكررة قبل ولادتها', en: 'A constraint the database enforces: no insert may repeat the same key pair — a duplicated friendship is blocked before birth' } },
            { id: 'b', text: { ar: 'ترتيبًا تلقائيًّا للصفوف بحسب العمودين', en: 'An automatic ordering of the rows by the two columns' } },
            { id: 'c', text: { ar: 'فهرسًا يسرّع العدّ فقط دون منع شيء', en: 'An index that only speeds counting, blocking nothing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القيود قواعد نطلب من القاعدة تنفيذها أثناء الإدخال — والكتاب يراهن عليها: تمنع الأخطاء وتسهل الكود، ومع INSERT OR IGNORE تتحول الإنذارات إلى تجاهل هادئ.',
            en: 'Constraints are rules we ask the database to enforce at insert time — and the book relies on them: they block mistakes and simplify code, and with INSERT OR IGNORE the alarms turn into a calm skip.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الرابع عشر: الصنف قالب يصنع منه كائنات كثيرة بنفس الخواص — فما نظيره في قواعد البيانات؟',
            en: 'From chapter 14: a class is a template manufacturing many objects of the same attributes — what is its counterpart in databases?',
          },
          options: [
            { id: 'a', text: { ar: 'الجدول: تصريح أعمدة واحد يصنع منه صفوفًا كثيرة متشابهة البنية — وكل صف يشبه كائنًا من الصنف', en: 'The table: one column declaration manufacturing many structurally identical rows — and every row resembles an object of the class' } },
            { id: 'b', text: { ar: 'الاتصال conn — لأنه يفتح شيئًا واحدًا لكل العمليات', en: 'The conn connection — because it opens one thing for all operations' } },
            { id: 'c', text: { ar: 'لا نظير — الكائنات والصفوف عالمان لا علاقة بينهما', en: 'No counterpart — objects and rows are unrelated worlds' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التوازي جميل: CREATE TABLE تعريف صنف، وكل INSERT كائن جديد يمتثل للقالب — وPRIMARY KEY يشبه هوية الكائن التي تميزه عن إخوته.',
            en: 'The parallel is lovely: CREATE TABLE defines a class, and every INSERT is a new object conforming to the template — and PRIMARY KEY is like the object identity distinguishing it from its siblings.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي خاصية تخبرك بمفتاح الصف الذي أدخلته للتو، وأيها تخبرك كم صفا تأثر بآخر أمر كتابة؟',
            en: 'Which attribute tells you the key of the row you just inserted, and which tells you how many rows the last write command affected?',
          },
          options: [
            { id: 'a', text: { ar: 'cur.lastrowid للمفتاح الجديد وcur.rowcount لعدد الصفوف المتأثرة — وبرنامج الكتاب يفحص rowcount != 1 لاصطياد فشل الإدخال', en: 'cur.lastrowid for the new key and cur.rowcount for the affected-row count — and the book\u2019s program checks rowcount != 1 to catch an insert failure' } },
            { id: 'b', text: { ar: 'rowcount للمفتاح وlastrowid للعدد — الاسمان متبادلان', en: 'rowcount for the key and lastrowid for the count — the two names are interchangeable' } },
            { id: 'c', text: { ar: 'كلاهما في conn لا في cur', en: 'Both live on conn, not on cur' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الاسمان على المؤشر ووظيفتهما مختلفة تمامًا: lastrowid يذكر الصف الأخير، وrowcount يذكر عدد الصفوف المتأثرة — وقد استعملهما برنامج twfriends.py معًا في نمط استرجاع-أو-أضف.',
            en: 'The two names sit on the cursor with entirely different jobs: lastrowid remembers the last row, rowcount counts affected rows — and twfriends.py used both together in retrieve-or-add.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "cur.execute('INSERT INTO albums (title, artist_name) VALUES (?, ?)', ('Ahdan', 'Fairuz'))",
          right: "cur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Ahdan', 1))",
          note: {
            ar: 'تكرار اسم الفنان في كل ألبوم يعيد جريمة السلاسل المكررة — خزّن المفتاح الرقمي مرة واحدة في artists واستدعه من كل ألبوم بـ artist_id.',
            en: 'Repeating the artist name in every album re-commits the repeated-strings crime — store the numeric key once in artists and reference it from every album via artist_id.',
          },
        },
        {
          wrong: "# حذفت صفًّا فأظن أن المفاتيح ستُعاد ترقيمها / deleted a row and expect keys to renumber",
          right: "# المفاتيح لا تُعاد الترقيم أبدًا — الصف الجديد يأخذ رقمًا أحدث / keys are never renumbered — a new row takes a newer number",
          note: {
            ar: 'القاعدة لا تصفّر الترقيم ولا تعيد استعمال المفاتيح المحذوفة — الصفوف المتبقية تبقى بمفاتيحها، وأي افتراض بعكس ذلك يفسد روابط جداولك كلها.',
            en: 'The database never resets numbering or recycles deleted keys — remaining rows keep their keys, and assuming otherwise corrupts every link across your tables.',
          },
        },
        {
          wrong: "cur.execute('INSERT INTO artists (name) VALUES (?)', ('Fairuz',))  # ثانيةً / a second time",
          right: "cur.execute('INSERT OR IGNORE INTO artists (name) VALUES (?)', ('Fairuz',))",
          note: {
            ar: 'INSERT العادي على صف يخرق UNIQUE يرمي IntegrityError ويقاطع البرنامج — حين يكون التكرار متوقعًا استخدم INSERT OR IGNORE ثم افحص cur.rowcount.',
            en: 'A plain INSERT onto a UNIQUE-violating row raises IntegrityError and interrupts the program — when duplicates are expected use INSERT OR IGNORE and then check cur.rowcount.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'القوة الحقيقية في جداول مترابطة: نمذجة البيانات تقسم وتصل — والقاعدة الذهبية لا تكرر السلسلة النصية، استبدلها برقم.', en: 'The real power is linked tables: data modeling splits and links — and the cardinal rule never repeats a string; replace it with a number.' },
        { ar: 'INTEGER PRIMARY KEY يجعل القاعدة ترقّم تلقائيًّا، وUNIQUE قيد يحرس التفرد، وINSERT OR IGNORE مع cur.rowcount شبكة أمان الكتاب.', en: 'INTEGER PRIMARY KEY makes the database number automatically, UNIQUE is the guarding constraint, and INSERT OR IGNORE with cur.rowcount is the book\u2019s safety net.' },
        { ar: 'نمط استرجاع-أو-أضف: SELECT id ... LIMIT 1 ثم fetchone، وإن كان None فINSERT وcur.lastrowid — به يتحول كل اسم إلى مفتاح نظيف.', en: 'Retrieve-or-add: SELECT id ... LIMIT 1 then fetchone, and if None then INSERT and cur.lastrowid — by it every name becomes a clean key.' },
      ],
      reflectPrompt: {
        ar: 'أعد تصميم جدولك الأحادي من درس الاستعلامات: قسّمه إلى حسابات وعلاقات متابعة. اكتب تصريحي CREATE TABLE كاملين بالقيود، ثم قرر: في أي الجدولين يذهب عمود retrieved ولماذا؟',
        en: 'Redesign your single table from the querying lesson: split it into accounts and follow relations. Write both CREATE TABLE statements with their constraints, then decide: which of the two tables hosts the retrieved column, and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch15.s7', pages: 'ص266 / pp.266' },
        { book: 'PY4E', section: 'py4e.ch15.s8', pages: 'ص268 / pp.268' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch15.s7', pages: 'ص266 / pp.266' },
    { book: 'PY4E', section: 'py4e.ch15.s8', pages: 'ص268 / pp.268' },
  ],
} satisfies Lesson;

export default lesson;
