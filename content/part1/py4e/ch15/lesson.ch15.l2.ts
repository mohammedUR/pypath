import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch15.l2 — "Your First Tables with SQL / أول جداولك بـ SQL"
 * Aligned with PY4E ch15 s4 (إنشاء جدول لقاعدة بيانات) + s5 (ملخص عن لغة
 * الاستعلام البنيوية SQL).
 * All expression is original.
 * The book's music.sqlite file flow is taught in prose (desktop framing);
 * every runnable block uses sqlite3.connect(':memory:'). The ? placeholder is
 * framed as the one-line answer to SQL injection.
 */
const lesson = {
  id: 'py4e.ch15.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 15,
  title: { ar: 'أول جداولك بـ SQL', en: 'Your First Tables with SQL' },
  estimatedMinutes: 18,
  prerequisites: ['py4e.ch15.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الدرس الماضي فتح الاتصال — اليوم تبني الجدول نفسه. قواعد البيانات أكثر تصريحًا من قوائم بايثون: قبل ملء أي جدول تصرح بأسماء أعمدة وأنواعها، فيختار المحرك أفعى طريقة لتخزين كل معلومة والبحث فيها. ثم تتقن جمل SQL الأربع الحاملة لكل عمليات البيانات: INSERT وSELECT وUPDATE وDELETE — وتتعلم عادة علامتي ? التي تُسلّم القيم كبيانات بدل لصقها في الأمر، وهي خط الدفاع الأول عن قاعدتك. بنهاية الدرس ستكون قادرًا على: CREATE TABLE بأنواع أعمدة، وINSERT بقيم ? مع commit، وSELECT بحلقة قراءة، ولمحة UPDATE وDELETE وDROP TABLE IF EXISTS.',
        en: 'Last lesson opened the connection — today you build the table itself. Databases are more explicit than Python lists: before filling any table you declare its column names and types, so the engine picks the most effective way to store and search every piece. Then you master the four SQL statements carrying all data work: INSERT, SELECT, UPDATE and DELETE — and the ? placeholder habit that hands values over as data instead of gluing them into the command, your first line of defense for the database. By the end of this lesson you will be able to: CREATE TABLE with column types, INSERT with ? values plus commit, SELECT with a reading loop, and a first look at UPDATE, DELETE and DROP TABLE IF EXISTS.',
      },
    },
    {
      kind: 'predict',
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE t (x INTEGER)')\ncur.execute('INSERT INTO t (x) VALUES (?)', (7,))\ncur.execute('SELECT x FROM t')\nprint(cur.fetchall())",
      question: {
        ar: 'أدخلنا صفًّا واحدًا فيه قيمة واحدة — ما الشكل الذي يعيده fetchall()؟ قائمة أم صف؟ وماذا بداخله؟',
        en: 'We inserted one row holding one value — what shape does fetchall() return? A list? A row? And what is inside it?',
      },
      reveal: {
        ar: '[(7,)] — قائمة صفوف، كل صف فيها tuple حتى لو كانت خانته الواحدة. fetchall تعيد كل ما بقي من نتيجة SELECT دفعة واحدة، بينما fetchone كانت تجلب صفًّا صفًّا. القاعدة الذهبية: SELECT يعطيك قائمة، وكل عنصر فيها صف.',
        en: '[(7,)] — a list of rows, every row a tuple even with its single cell. fetchall returns everything left of the SELECT result at once, while fetchone fetched row by row. The golden rule: SELECT hands you a list, and every element in it is a row.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الجدول يُصرَّح قبل أن يُملأ', en: 'The table is declared before it is filled' },
      chunks: [
        {
          ar: 'تطالب قواعد البيانات ببنية أكثر تحديدًا من قوائم وقواميس بايثون: قبل إنشاء الجدول تحدد أسماء أعمدته ونوع البيانات المقصودة لكل عمود — TEXT للنصوص وINTEGER للأعداد الصحيحة وREAL للعشرية (وستقابل NVARCHAR في أنظمة أخرى كمرادف للنص). هذا التصريح يتيح للمحرك اختيار أكثر الطرق فعالية لتخزين المعلومة والبحث عنها. برنامج الكتاب الأول ينشئ جدول Tracks بعمودين: cur.execute(\'CREATE TABLE Tracks (title TEXT, plays INTEGER)\') — وعلى حاسوبك يتصل أولًا بملف music.sqlite فيمُنشأ إن لم يكن، أما هنا فنواصل connect(\':memory:\') بقاعدتنا الخاصة بتشغيل واحد. ولاحظ السطر الذي يسبقه: DROP TABLE IF EXISTS يحذف الجدول القديم بمحتوياته إن وُجد — حذف بلا رجعة — فيُعاد إنشاء الجدول نظيفًا كل تشغيل بلا أخطاء.',
          en: 'Databases demand a more definite structure than Python lists and dicts: before creating a table you specify its column names and the intended data type of each — TEXT for text, INTEGER for whole numbers, REAL for decimals (and you will meet NVARCHAR in other systems as a text synonym). This declaration lets the engine choose the most effective way to store the information and search it. The book\u2019s first program creates a Tracks table with two columns: cur.execute(\'CREATE TABLE Tracks (title TEXT, plays INTEGER)\') — and on your computer it first connects to a music.sqlite file, created if absent, while here we keep connect(\':memory:\') with our one-run private database. Note the line before it: DROP TABLE IF EXISTS deletes the old table with all its contents if present — irreversibly — so the table is recreated clean on every run without errors.',
        },
        {
          ar: 'المؤشر — كما شبهه الكتاب — يشبه مقبض الملف من الفصل السابع: cursor() تقابل open()، وexecute() تقابل أوامر الكتابة، والفرق أن كل execute ينفذ أمر SQL واحدًا. نكتب الكلمات المفتاحية للغة بأحرف كبيرة (CREATE وINSERT وSELECT) وأسماء جداولنا وأعمدتها بأحرف صغيرة — اصطلاح الكتاب الذي يسهل قراءة الأمر. وبعد INSERT نستدعي conn.commit() لكتابة التغييرات في القاعدة، ثم SELECT لاستدعاء الصفوف ونمرّ عليها بحلقة for — والمؤشر ذكي: لا يقرأ الجدول كله دفعة واحدة بل يسلّم الصفوف وفق تكرارات الحلقة، كفاءة تذكرنا بقراءة الملفات سطرًا سطرًا.',
          en: 'The cursor — as the book puts it — resembles the file handle from chapter 7: cursor() parallels open(), execute() parallels write calls, the difference being each execute runs one SQL command. We spell the language keywords in capitals (CREATE, INSERT, SELECT) and our own table and column names in lowercase — the book\u2019s convention that makes commands easier to read. After INSERT we call conn.commit() to write the changes into the database, then SELECT to call the rows and walk them with a for loop — and the cursor is smart: it does not read the whole table at once but hands rows along as the loop iterates, the same efficiency as reading files line by line.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'علامتا ? — قيم تُسلَّم لا تُلصق', en: 'The two ? marks — values handed over, not glued in' },
      chunks: [
        {
          ar: 'في INSERT يشير الأمر إلى الجدول، يعرّف الحقول المطلوبة (title, plays)، ثم يضع VALUES (?, ?) — علامتي استفهام مكان القيم الفعلية التي تُمرَّر صفًّا في المعامل الثاني لـ execute: (\'My Way\', 15). لماذا لا نلصق القيم في النص مباشرة؟ لأن أي قيمة قادمة من مستخدم تحمل اقتباسًا أو كلمات SQL قد تعيد كتابة أمرك كله — ثغرة تعرف باسم حقن SQL — بينما تعامل علامة ? القيمة بيانًّا خالصًا لا يمكنه أن يتحول إلى كود أبدًا. عادة واحدة، حماية كاملة.',
          en: 'In INSERT the command names the table, defines the fields (title, plays), then places VALUES (?, ?) — question marks standing where the actual values will be, passed as a tuple in the second argument to execute: (\'My Way\', 15). Why not glue the values straight into the text? Because any user-supplied value carrying a quote or SQL words could rewrite your whole command — the flaw known as SQL injection — while a ? mark treats the value as pure data that can never turn into code. One habit, full protection.',
        },
        {
          ar: 'وملخص الكتاب للغة يكمل صندوق أدواتك: SELECT تستدعي الأعمدة المطلوبة مع WHERE لتحديد الصفوف — ولاحظ أن SQL تستخدم علامة يساوي واحدة حيث تستخدم بايثون اثنتين — والنجمة * تعني كل الأعمدة. ORDER BY تتحكم بترتيب الصفوف المعادة. DELETE تحذف الصفوف المطابقة لـ WHERE، وUPDATE تغير قيمًا بعد SET لكل الصفوف المطابقة لـ WHERE — وإن غاب WHERE تحدث كل صفوف الجدول! هذه الأربعة — INSERT وSELECT وUPDATE وDELETE — تكفي لإنشاء البيانات وتعديلها كلها.',
          en: 'And the book\u2019s SQL summary completes your toolbox: SELECT names the wanted columns with WHERE picking the rows — note SQL uses a single equals sign where Python uses two — and the star * means all columns. ORDER BY controls the order of returned rows. DELETE removes the rows matching WHERE, and UPDATE changes values after SET for every row matching WHERE — and if WHERE is absent, every row in the table updates! These four — INSERT, SELECT, UPDATE, DELETE — suffice for creating and changing all your data.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'جدول People: إدخال بعلامتي ? ثم تحديث', en: 'The People table: insert with ? then update' },
      code: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE People (name TEXT, age INTEGER)')\ncur.execute('INSERT INTO People (name, age) VALUES (?, ?)', ('Chuck', 46))\ncur.execute('INSERT INTO People (name, age) VALUES (?, ?)', ('Zaid', 19))\nconn.commit()\n\ncur.execute('SELECT name, age FROM People')\nfor row in cur:\n    print(row)\n\ncur.execute('UPDATE People SET age = 20 WHERE name = ?', ('Zaid',))\ncur.execute('SELECT age FROM People WHERE name = ?', ('Zaid',))\nprint(cur.fetchone()[0])\nconn.close()",
      explanation: {
        ar: 'جدول People بعمودين مصرّحين، ثم INSERT مرتين وكل مرة القيمتان صفًّا خلف علامتي ? — لا لصق ولا اقتباسات مكسورة. حلقة for على المؤشر تطبع الصفين كما يعيدهما tuple: (\'Chuck\', 46) ثم (\'Zaid\', 19). ثم UPDATE بـ WHERE تستهدف صفًّا واحدًا بالاسم وتغيّر عمره، وSELECT جديد بـ WHERE يجلب القيمة المحدثة 20. وأخيرًا conn.close() يودع القاعدة كما يغلق الملف.',
        en: 'A People table with two declared columns, then INSERT twice, each time passing the two values as a tuple behind the two ? marks — no gluing, no broken quotes. A for loop over the cursor prints the two rows as the tuples they are: (\'Chuck\', 46) then (\'Zaid\', 19). Then an UPDATE with WHERE targets one row by name and changes its age, and a fresh SELECT with WHERE fetches the updated value 20. Finally conn.close() says goodbye to the database, just like closing a file.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.tracks-table',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أعد بناء جدول الأغاني من الكتاب: أنشئ جدول tracks (title من نوع TEXT وplays من نوع INTEGER)، وأدخل صفّي (Thunderstruck, 20) و(My Way, 15) بعلامتي ?، ثم conn.commit()، ثم SELECT لعمودي الجدول وحلقة for تطبع كل صف. المتوقع صفّا tuple بالترتيب نفسه.',
        en: 'Rebuild the book\u2019s songs table: create a table tracks (title of type TEXT and plays of type INTEGER), insert the rows (Thunderstruck, 20) and (My Way, 15) with two ? marks, then conn.commit(), then a SELECT over both columns and a for loop printing every row. Expected: the two tuple rows in the same order.',
      },
      starterCode: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\n# أنشئ الجدول بعمودين مصرّحين / create the table with two declared columns\n\n# أدخل الصفين بعلامتي ? / insert the two rows with ?\n\n# اكتب التغييرات / commit\n\n# SELECT وحلقة for تطبع كل صف / SELECT and a for loop printing every row\n",
      solution: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('Thunderstruck', 20))\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\nconn.commit()\n\ncur.execute('SELECT title, plays FROM tracks')\nfor row in cur:\n    print(row)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الصفوفان مخزنان بالترتيب', en: 'Both rows stored in order' },
          code: "cur.execute('SELECT title, plays FROM tracks')\nrows = cur.fetchall()\nassert rows == [('Thunderstruck', 20), ('My Way', 15)], 'expected: two rows in order | actual: %r' % (rows,)",
          expected: 'two rows in order',
        },
        {
          id: 't2',
          name: { ar: 'الخرج يعرض الصفين', en: 'The output shows both rows' },
          code: "assert \"('Thunderstruck', 20)\" in __learner_output__ and \"('My Way', 15)\" in __learner_output__, 'expected: both rows printed | actual: %r' % __learner_output__",
          expected: 'both rows printed',
        },
        {
          id: 't3',
          name: { ar: 'عدد صفوف الجدول اثنان', en: 'The table holds two rows' },
          code: "cur.execute('SELECT COUNT(*) FROM tracks')\ncnt = cur.fetchone()[0]\nassert cnt == 2, 'expected: 2 rows | actual: %r' % (cnt,)",
          expected: '2 rows',
        },
      ],
      hints: [
        { ar: 'كل INSERT سطر مستقل: أمر VALUES (?, ?) وصف قيم بعده — مرتان لا حلقة.', en: 'Each INSERT is its own line: a VALUES (?, ?) command followed by a tuple of values — twice, no loop.' },
        { ar: 'لا تنسَ conn.commit() بعد الإدخال — عادة الكتاب في db2.py قبل الطباعة.', en: 'Do not forget conn.commit() after the inserts — the book\u2019s habit in db2.py, right before printing.' },
        { ar: 'الهيكل:\ncur.execute(\'CREATE TABLE tracks (title TEXT, plays INTEGER)\')\ncur.execute(\'INSERT INTO tracks (title, plays) VALUES (?, ?)\', (\'Thunderstruck\', 20))\ncur.execute(\'INSERT INTO tracks (title, plays) VALUES (?, ?)\', (\'My Way\', 15))\nconn.commit()\ncur.execute(\'SELECT title, plays FROM tracks\')\nfor row in cur:\n    print(row)', en: "The skeleton:\ncur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('Thunderstruck', 20))\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\nconn.commit()\ncur.execute('SELECT title, plays FROM tracks')\nfor row in cur:\n    print(row)" },
        { ar: "cur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('Thunderstruck', 20))\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\nconn.commit()\ncur.execute('SELECT title, plays FROM tracks')\nfor row in cur:\n    print(row)", en: "cur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('Thunderstruck', 20))\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\nconn.commit()\ncur.execute('SELECT title, plays FROM tracks')\nfor row in cur:\n    print(row)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-update-delete',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله. انتبه: أحد الأوامر بلا WHERE.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Beware: one of the commands has no WHERE.',
      },
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE t (name TEXT, age INTEGER)')\ncur.execute('INSERT INTO t VALUES (?, ?)', ('Sally', 22))\ncur.execute('UPDATE t SET age = age + 1')\ncur.execute('SELECT age FROM t')\nprint(cur.fetchone()[0])\ncur.execute('DELETE FROM t')\ncur.execute('SELECT COUNT(*) FROM t')\nprint(cur.fetchone()[0])",
      solution: '23\n0',
      answer: '23\n0',
      hints: [
        { ar: 'UPDATE بلا WHERE تحدث كل صفوف الجدول — وهنا صف واحد فقط، فعمر Sally يصير 23.', en: 'UPDATE without WHERE updates every row in the table — here just one row, so Sally\u2019s age becomes 23.' },
        { ar: 'SELECT age من جدول فيه صف واحد يعطي fetchone صفًّا واحدًا، و[0] يفك القيمة.', en: 'SELECT age on a one-row table gives fetchone a single row, and [0] unwraps the value.' },
        { ar: 'DELETE بلا WHERE يحذف كل الصفوف — ثم COUNT(*) يعد ما تبقى.', en: 'DELETE without WHERE removes every row — then COUNT(*) counts what remains.' },
        { ar: 'الخرْج:\n23\n0', en: 'The output:\n23\n0' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-placeholder',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا نكتب VALUES (?, ?) ونمرر القيم صفًّا في المعامل الثاني، بدل لصقها في نص الأمر؟',
        en: 'Why do we write VALUES (?, ?) and pass the values as a tuple in the second argument, instead of gluing them into the command text?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن علامة ? تعامل القيمة بيانًّا خالصًا — فنص قادم من مستخدم لا يمكنه أن يتحول إلى كود SQL يخترق الأمر', en: 'Because a ? mark treats the value as pure data — user-supplied text can never turn into SQL code that hijacks the command' } },
        { id: 'b', text: { ar: 'لأن علامة ? تجعل الاستعلام أسرع ميكانيكيًّا فقط بلا أي علاقة بالأمان', en: 'Because a ? mark only makes the query mechanically faster, with no relation to security' } },
        { id: 'c', text: { ar: 'لأن SQL ترفض أي قيمة نصية مكتوبة داخل الأمر أصلًا', en: 'Because SQL refuses any text value written inside the command in the first place' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تخيل مستخدمًا أدخل قيمة تحوي اقتباسًا مفردًا — ماذا يفعل الاقتباس الغريب داخل نص الأمر الملصوق؟', en: 'Imagine a user entering a value with a single quote inside — what does the odd quote do inside the glued command text?' },
        { ar: 'ثغرة حقن SQL تجعل نص المستخدم يُقرأ كأوامر — وعلامة ? تفصل البيانات عن الأمر تمامًا.', en: 'SQL injection makes user text read as commands — the ? mark separates data from the command entirely.' },
        { ar: 'كتابة القيمة داخل الأمر ممكنة نحويًّا لكنها خطرة — وهذا هو الدرس بالضبط.', en: 'Writing the value into the command is grammatically possible but dangerous — and that is precisely the lesson.' },
        { ar: 'الجواب: أ — القيم تُسلَّم بيانًّا فلا تتحول إلى كود أبدًا.', en: 'Answer: a — values are handed over as data and can never turn into code.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-commit',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل بالكلمة الواحدة: بعد INSERT وUPDATE وDELETE يستدعي برنامج الكتاب conn.____() لكتابة التغييرات فعليًّا في قاعدة البيانات.',
        en: 'Complete with one word: after INSERT, UPDATE and DELETE the book\u2019s programs call conn.____() to actually write the changes into the database.',
      },
      answer: 'commit',
      solution: 'commit',
      hints: [
        { ar: 'الاسم بالإنجليزية يعني "التزام" — أنت تلتزم بالتغييرات وتثبتها.', en: 'The English name means committing — you commit to the changes and make them stick.' },
        { ar: 'رأيناها في db2.py بعد الإدخالين وقبل الطباعة، ومرة أخرى بعد DELETE.', en: 'You saw it in db2.py after the two inserts and before printing, and once more after DELETE.' },
        { ar: 'بدونها قد تبقى الكتابة معلقة في الذاكرة وتضيع — خصوصًا مع قاعدة ملف حقيقي.', en: 'Without it the writes may stay pending in memory and vanish — especially with a real file database.' },
        { ar: 'الجواب: commit', en: 'Answer: commit' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — صندوق أدوات SQL الأربع\n# Your playground — the four-verb SQL toolbox\n\nimport sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE tracks (title TEXT, plays INTEGER)')\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('Thunderstruck', 20))\ncur.execute('INSERT INTO tracks (title, plays) VALUES (?, ?)', ('My Way', 15))\nconn.commit()\n\ncur.execute('SELECT title, plays FROM tracks ORDER BY title')\nfor row in cur:\n    print(row)\n\n# جرّب: UPDATE Tracks SET plays = 16 WHERE title = 'My Way' ثم أعد الطباعة / try: UPDATE tracks SET plays = 16 WHERE title = 'My Way' then reprint\n# جرّب: DELETE FROM tracks WHERE plays < 100 كما في الكتاب ثم COUNT(*) — كم بقي؟ / try: DELETE FROM tracks WHERE plays < 100 as in the book, then COUNT(*) — how many remain?\n# جرّب: SELECT * FROM tracks — ماذا تعيد النجمة؟ / try: SELECT * FROM tracks — what does the star return?",
      prompt: {
        ar: 'جرّب بنفسك أوامر الأربعة: UPDATE بقيمة جديدة ثم أعد الطباعة، وDELETE بـ WHERE ككتاب الكتاب فلاحظ COUNT بعد الحذف، والنجمة * التي تجلب كل الأعمدة. وتذكّر: في هذه المنصة القاعدة :memory: تعيد الولادة مع كل تشغيل — فلن تخسر شيئًا مهما حذفت. لا اختبار هنا — فضولك فقط.',
        en: 'Try the four verbs yourself: UPDATE with a new value then reprint, DELETE with WHERE exactly like the book\u2019s, watch COUNT after deleting, and the star * that fetches every column. Remember: on this platform the :memory: database is reborn with every run — you cannot lose anything no matter what you delete. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في شرط WHERE داخل SQL — كيف نكتب المقارنة التي نكتبها في بايثون بـ ==؟',
            en: 'Inside a WHERE clause in SQL — how do we write the comparison Python writes with ==?',
          },
          options: [
            { id: 'a', text: { ar: 'بعلامة يساوي واحدة: WHERE title = \'My Way\' — بقية المقارنات (> و< و>= و!= وAND وOR) كما في بايثون', en: "A single equals sign: WHERE title = 'My Way' — the other comparisons (> and < and >= and != and AND and OR) are as in Python" } },
            { id: 'b', text: { ar: 'بعلامتين يساوي كبايثون تمامًا — SQL وبايثون لغة واحدة', en: 'With two equals signs exactly like Python — SQL and Python are one language' } },
            { id: 'c', text: { ar: 'بالتابع eq(title, \'My Way\')', en: "With the method eq(title, 'My Way')" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب نبّه على هذه الاختلاف الصغيرة تحديدًا: علامة واحدة في SQL — وتنبيه ذكي لأن العين المتعودة على بايثون تمر عليه بلا انتباه.',
            en: 'The book flags this small difference specifically: one sign in SQL — a smart warning, because eyes trained on Python glide right past it.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا تفعل UPDATE Tracks SET plays = 0 إذا كُتبت بلا عبارة WHERE؟',
            en: 'What does UPDATE Tracks SET plays = 0 do when written without a WHERE clause?',
          },
          options: [
            { id: 'a', text: { ar: 'تحدّث كل صفوف الجدول — فWHERE هو الذي يحدد الصفوف المستهدفة وغيابه يعني الجميع', en: 'It updates every row in the table — WHERE is what picks the target rows, and its absence means all of them' } },
            { id: 'b', text: { ar: 'لا تفعل شيئًا — UPDATE تتطلب WHERE شرطًا لغويًّا', en: 'Nothing — UPDATE grammatically requires a WHERE' } },
            { id: 'c', text: { ar: 'تحدّث الصف الأول فقط', en: 'It updates only the first row' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب نص عليها: UPDATE تعدل كل السطور المطابقة لـ WHERE أو جميع سطور الجدول في حال عدم استخدامه — أخطر جملة تنسى فيها WHERE.',
            en: 'The book states it: UPDATE changes the rows matching WHERE, or all rows of the table when it is absent — the most dangerous statement to write without WHERE.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل السابع: شبه الكتاب المؤشر بمقبض الملف — فأي استدعاء في عالم القواعد يقابل open() في عالم الملفات؟',
            en: 'From chapter 7: the book likened the cursor to a file handle — which call in the database world parallels open() in the file world?',
          },
          options: [
            { id: 'a', text: { ar: 'cur = conn.cursor() — وبعده execute لكل أمر كما بعد open نقرأ سطرًا سطرًا', en: 'cur = conn.cursor() — then execute per command, just as after open we read line by line' } },
            { id: 'b', text: { ar: 'sqlite3.connect() نفسها هي المقابل — والمؤشر مجرد اسم آخر لها', en: 'sqlite3.connect() itself is the parallel — the cursor is just another name for it' } },
            { id: 'c', text: { ar: 'لا مقابل — الملفات والقواعد عالمان لا تشتركان في شيء', en: 'No parallel — files and databases are worlds sharing nothing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الاتصال يفتح القاعدة كما open يفتح الملف، لكن المؤشر هو مقبض العمل اليومي: عليه تنفذ الأوامر وتقرأ الصفوف — كما تقرأ من مقبض الملف.',
            en: 'The connection opens the database as open opens a file, but the cursor is the daily-work handle: commands run on it and rows are read from it — as you read from a file handle.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'لماذا يبدأ برنامج الكتاب بـ DROP TABLE IF EXISTS Tracks قبل CREATE TABLE؟',
            en: 'Why does the book\u2019s program start with DROP TABLE IF EXISTS Tracks before CREATE TABLE?',
          },
          options: [
            { id: 'a', text: { ar: 'ليحذف الجدول القديم بمحتوياته إن وُجد فيُعاد إنشاؤه نظيفًا كل تشغيل دون خطأ "الجدول موجود"', en: 'To delete the old table with its contents if present, so it is recreated clean on every run without an "table exists" error' } },
            { id: 'b', text: { ar: 'لتسريع CREATE — الحذف يجعل الإنشاء أسرع', en: 'To speed up CREATE — deleting makes creation faster' } },
            { id: 'c', text: { ar: 'لأن SQL لا تسمح بإنشاء أكثر من جدول واحد في قاعدة واحدة', en: 'Because SQL allows only one table per database' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'DROP TABLE IF EXISTS تذكرة إعادة تشغيل نظيفة — والكتاب نبّه: الحذف يمحو الجدول ومحتوياته بلا رجعة، فاستخدمها حيث تريد البناء من الصفر فعلًا.',
            en: 'DROP TABLE IF EXISTS is a clean-rerun ticket — and the book warns: dropping erases the table and its data irreversibly, so use it where you truly want to build from zero.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "name = \"O'Brien\"\ncur.execute('INSERT INTO People (name) VALUES (\\'%s\\')' % name)",
          right: "cur.execute('INSERT INTO People (name) VALUES (?)', (name,))",
          note: {
            ar: 'لصق القيم في نص الأمر يكسر الاقتباسات ويفتح باب حقن SQL — علامة ? تسلّم القيمة بيانًّا خالصًا مهما كان محتواها، حتى الاقتباسات الغريبة تمر سالمة.',
            en: 'Gluing values into the command text breaks quotes and opens the SQL-injection door — a ? mark hands the value over as pure data whatever it holds; even the strangest quote passes safely.',
          },
        },
        {
          wrong: "cur.execute('INSERT INTO People (name, age) VALUES (?, ?)', ('Sara', 30))\n# نسيان الالتزام / commit forgotten",
          right: "cur.execute('INSERT INTO People (name, age) VALUES (?, ?)', ('Sara', 30))\nconn.commit()",
          note: {
            ar: 'الكتابة قد تبقى معلقة حتى commit — قاعدة :memory: هنا تخفي الفرق لأنها تموت مع التشغيل، لكن على حاسوبك مع ملف حقيقي ستضيع صفوفك بعد الإغلاق. الالتزام بعد كل مجموعة كتابة.',
            en: 'Writes may stay pending until commit — the :memory: database here hides the difference because it dies with the run, but on your computer with a real file your rows vanish after closing. Commit after every batch of writes.',
          },
        },
        {
          wrong: "cur.execute('SELECT * FROM People WHERE name == ?')",
          right: "cur.execute('SELECT * FROM People WHERE name = ?')",
          note: {
            ar: 'SQL ليست بايثون: علامة يساوي واحدة في WHERE — و== ترفع خطأ صياغة. باقي المقارنات (> و< و>= و!= وAND وOR) متاحة كما تعرفها.',
            en: 'SQL is not Python: a single equals sign in WHERE — and == raises a syntax error. The rest of the comparisons (> and < and >= and != and AND and OR) are available as you know them.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'تصريح ثم ملء: CREATE TABLE بأسماء أعمدة وأنواع (TEXT وINTEGER وREAL)، وDROP TABLE IF EXISTS يضمن بداية نظيفة كل تشغيل.', en: 'Declare, then fill: CREATE TABLE with column names and types (TEXT, INTEGER, REAL), and DROP TABLE IF EXISTS guarantees a clean start every run.' },
        { ar: 'علامتا ? تُسلّمان القيم بيانًّا لا كودًا — حمايتك الأولى من حقن SQL — وcommit يثبت الكتابة، وSELECT تعود قائمة صفوف تمر عليها بحلقة for.', en: 'The two ? marks hand values over as data, never code — your first shield against SQL injection — commit makes writes stick, and SELECT returns a list of rows to walk with a for loop.' },
        { ar: 'الأفعال الأربعة INSERT وSELECT وUPDATE وDELETE مع WHERE وORDER BY تغطي كل عمليات البيانات — وتذكّر: يساوي واحدة في SQL، وUPDATE بلا WHERE تمس الجميع.', en: 'The four verbs INSERT, SELECT, UPDATE and DELETE with WHERE and ORDER BY cover all data work — and remember: one equals sign in SQL, and UPDATE without WHERE touches everyone.' },
      ],
      reflectPrompt: {
        ar: 'اكتب من الذاكرة جدولك الخاص بموادك الدراسية: جدول courses بعمودين، أدخل ثلاث مواد بعلامات ?، ثم UPDATE لمادة غيّرت ساعاتها، ثم SELECT مرتبة بالاسم. كم أمر SQL كتبت إجمالًا — وأيها نسيت commit بعده؟',
        en: 'Write your own study-subject table from memory: a courses table with two columns, insert three subjects with ? marks, then UPDATE one whose hours changed, then SELECT ordered by name. How many SQL commands did you write in total — and after which did you forget commit?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch15.s4', pages: 'ص253 / pp.253' },
        { book: 'PY4E', section: 'py4e.ch15.s5', pages: 'ص257 / pp.257' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch15.s4', pages: 'ص253 / pp.253' },
    { book: 'PY4E', section: 'py4e.ch15.s5', pages: 'ص257 / pp.257' },
  ],
} satisfies Lesson;

export default lesson;
