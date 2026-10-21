import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch15.l5 — "The Three Kinds of Keys and JOIN / المفاتيح الثلاثة و JOIN"
 * Aligned with PY4E ch15 s9 (أنواع المفاتيح الثلاثة) + s10 (استخدام عبارة JOIN
 * لاستعادة البيانات).
 * All expression is original.
 * Logical / primary / foreign keys with the book's id vs *_id naming; JOIN with
 * the ON match rule following the book's Follows JOIN People query; the runnable
 * demo JOINs albums to artists producing (album, artist) rows. The cartesian
 * product of a JOIN without ON is foreshadowed here and becomes the final
 * lesson's debug block.
 */
const lesson = {
  id: 'py4e.ch15.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 15,
  title: { ar: 'المفاتيح الثلاثة و JOIN', en: 'The Three Kinds of Keys and JOIN' },
  estimatedMinutes: 18,
  prerequisites: ['py4e.ch15.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قسمنا البيانات إلى جداول — واليوم نتعلم الأسماء الرسمية لمفاتيح الربط الثلاثة ثم نعيد ما فصله: JOIN تأخذ جدولين وتعيد تركهما في صفوف طويلة مركبة وفق قاعدة مطابقة تكتبها أنت بعد ON. سترى استعلام الكتاب الشهير Follows JOIN People يُقرأ كجملة عربية، وستطبق النمط على مكتبتك الموسيقية: كل ألبوم يقترن باسم فنانه من الجدول الآخر. وبنهاية الدرس ستكشف بنفسك علة القسمة حين تُنسى قاعدة المطابقة — الضرب الديكارتي — التي ستصلحها في مشروع الدرس الأخير. بنهاية الدرس ستكون قادرًا على: تصنيف أي عمود إلى مفتاحه، وكتابة JOIN بشرط ON صحيح، وقراءة نتيجتها صفًّا صفًّا.',
        en: 'We split the data into tables — today we learn the official names of the three linking keys, then re-fuse what we split: JOIN takes two tables and re-assembles them into long combined rows according to a match rule you write after ON. You will read the book\u2019s famous Follows JOIN People query like an Arabic sentence, and apply the pattern to your music library: every album paired with its artist\u2019s name from the other table. By the lesson\u2019s end you will also spot the flaw of splitting when the match rule is forgotten — the cartesian product — which you will fix in the final lesson\u2019s project. By the end of this lesson you will be able to: classify any column into its key kind, write a JOIN with a correct ON condition, and read its result row by row.',
      },
    },
    {
      kind: 'predict',
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE a (id INTEGER PRIMARY KEY, name TEXT)')\ncur.execute('CREATE TABLE b (title TEXT, a_id INTEGER)')\ncur.execute('INSERT INTO a VALUES (?, ?)', (1, 'X'))\ncur.execute('INSERT INTO b VALUES (?, ?)', ('t1', 1))\ncur.execute('SELECT b.title, a.name FROM b JOIN a ON b.a_id = a.id')\nprint(cur.fetchall())",
      question: {
        ar: 'جدولان منفصلان — والأمر أخذ صف t1 من b وصف X من a وصمهما معًا. أي كلمة في الأمر كانت صاحبة القرار؟',
        en: 'Two separate tables — and the command took row t1 from b and row X from a and pressed them together. Which word in the command made the decision?',
      },
      reveal: {
        ar: "[('t1', 'X')] — والقرار لـ ON: الشرط b.a_id = a.id هو قاعدة المطابقة التي تقرر أي صف من b يقترن بأي صف من a. بلا هذه القاعدة لا يعرف المحرك علاقة الجدولين بشيء — وهذا سطر واحد يفصل النتيجة الصحيحة عن الفوضى.",
        en: "[('t1', 'X')] — and the decision belongs to ON: the condition b.a_id = a.id is the match rule deciding which row of b pairs with which row of a. Without this rule the engine knows nothing of the tables\u2019 relationship — one line separating the right answer from chaos.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ثلاثة مفاتيح وثلاث وظائف', en: 'Three keys, three jobs' },
      chunks: [
        {
          ar: 'ثلاثة أنواع من المفاتيح كما صنفها الكتاب: المفتاح المنطقي logical key هو ما يبحث به العالم الخارجي — اسم الحساب name الذي سألنا عنه بـ WHERE، ومن المفيد جعله UNIQUE لكن العقلية تسمح أحيانًا بتكراره. والمفتاح الأساسي primary key رقم تولّده القاعدة تلقائيًّا — لا وجود له خارج البرنامج — ووظيفته الربط بين صفوف جداول مختلفة، وهو أسرع في المقارنة لأنه عدد صحيح لا يشغل مساحة ولا يحتاج ترتيبًا معجميًّا. والمفتاح الخارجي foreign key رقم في صف يشير إلى المفتاح الأساسي لصف في جدول آخر.',
          en: 'Three kinds of keys as the book classifies them: the logical key is what the outside world searches by — the account name we asked WHERE about; making it UNIQUE is useful, though the world may sometimes allow repeats. The primary key is a number the database generates automatically — it has no meaning outside the program — and its job is linking rows across different tables, fastest to compare as an integer needing no space and no alphabetical ordering. And the foreign key is a number in one row pointing at another table row\u2019s primary key.',
        },
        {
          ar: 'أما اصطلاح التسمية الذي اتبعه الكتاب فيجعل المخطط يُقرأ كخريطة: المفتاح الأساسي يُسمى دائمًا id، والمفاتيح الخارجية تنتهي باللاحقة _id — from_id وto_id في نموذج تويتر، وartist_id وgenre_id في مكتبتنا الموسيقية. فحين ترى عمودًا ينتهي بـ _id فاعلم أنه سهم: رقم يشير إلى صف في جدول آخر يملك هذا الرقم id. وبهذا الاصطلاح يصير فهم نموذج بيانات غريب أمرًا ممكنًا في دقيقة.',
          en: 'And the naming convention the book followed makes the schema read like a map: the primary key is always called id, and foreign keys end with the suffix _id — from_id and to_id in the Twitter model, artist_id and genre_id in our music library. So when you see a column ending in _id, know it is an arrow: a number pointing at a row in another table that owns this number as id. With this convention, understanding a stranger\u2019s data model becomes a one-minute task.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'JOIN: قاعدة المطابقة التي تعيد التركيب', en: 'JOIN: the match rule that re-assembles' },
      chunks: [
        {
          ar: 'الآن وقد فصلنا وربطنا بالمفاتيح تعيد SELECT تركيب الجدولين حين نطلبها: SELECT * FROM Follows JOIN People ON Follows.from_id = People.id WHERE People.id = 1 — هذه هي صيغة الكتاب حرفيًّا. JOIN تعني أننا نستعيد التقاطع بين الجدولين، وON تحمل شرط التقاطع: قاعدة المطابقة. نقرأ الاستعلام كما قرأه الكتاب: نستعيد صفوف Follows ونضيف إلى كل صف الصف من People الذي تتطابق فيه from_id مع id — فتنشأ صفوف معدلة طويلة تحوي خانات الجدولين، لكل زوج متوافق صف واحد، وتتكرر البيانات بالقدر الذي نحتاجه.',
          en: 'Now that we split and linked with keys, SELECT re-assembles the two tables when asked: SELECT * FROM Follows JOIN People ON Follows.from_id = People.id WHERE People.id = 1 — the book\u2019s very own line. JOIN means we retrieve the intersection of the two tables, and ON carries the intersection condition: the match rule. We read the query as the book did: take the Follows rows and attach to each one the People row where from_id matches id — producing long modified rows holding cells from both tables, one per matching pair, with data duplicated as much as needed.',
        },
        {
          ar: 'وفي مكتبتنا الموسيقية: SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id — كل ألبوم يقترن بفنانه. أما الخطر الأشهر فهو نسيان ON: حين لا توجد قاعدة مطابقة يقترن كل صف من الأول بكل صف من الثاني — الضرب الديكارتي — فيتضخم عدد النتائج إلى حاصل ضرب عددي الصفوف: ثلاثة ألبومات وفنانان يظنان ستة صفوف! سترى هذه العلة بعينك في مشروع الدرس الأخير — واحفظ العلامة المبكرة: عدد JOIN أكبر من صفوف أي جدول؟ شك في قاعدة المطابقة.',
          en: 'And in our music library: SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id — every album paired with its artist. The most famous danger is forgetting ON: with no match rule, every row of the first pairs with every row of the second — the cartesian product — and the result count inflates to the product of the two row counts: three albums and two artists pretending to be six rows! You will see this flaw with your own eyes in the final lesson\u2019s project — so keep the early warning: a JOIN count larger than any table\u2019s rows? Suspect the match rule.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'كل ألبوم باسم فنانه: JOIN على مكتبتك', en: 'Every album with its artist: JOIN on your library' },
      code: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, artist_id INTEGER)')\n\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Fairuz',))\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Ziad Rahbani',))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Ahdan', 1))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Kifak Inta', 1))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Houdou Nisbi', 2))\nconn.commit()\n\ncur.execute('SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id')\nfor row in cur:\n    print('%s / %s' % (row[0], row[1]))\nconn.close()",
      explanation: {
        ar: 'السطر الحاسم هو ON albums.artist_id = artists.id: لكل صف ألبوم تبحث القاعدة عن صف الفنان الذي يساوي مفتاحه artist_id — فيخرج Ahdan / Fairuz وKifak Inta / Fairuz ثم Houdou Nisbi / Ziad Rahbani. لاحظ تأهيل الأسماء بـ table.column: كلا الجدولين يملك عمود id فالتأهيل ضروري ليس فقط للوضوح بل للدلالة. ولو أردت ألبومات فنّانة بعينها أضفت WHERE artists.name = ? بعد ON — التصفية تعمل على الصفوف المركبة.',
        en: 'The decisive line is ON albums.artist_id = artists.id: for every album row the rule searches for the artist row whose key equals the album\u2019s artist_id — out come Ahdan / Fairuz and Kifak Inta / Fairuz, then Houdou Nisbi / Ziad Rahbani. Notice the table.column qualification: both tables own a column called id, so qualification is necessary not only for clarity but for meaning. And to list one artist\u2019s albums you would add WHERE artists.name = ? after the ON — filtering works on the combined rows.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.follows-join-people',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الجدولان مضمّنان في المحرر (People بثلاثة صفوف مرقمة وFollows بعلاقتين 1→2 و1→3). اكتب الاستعلام الذي يعيد تركيب الاسم: SELECT Follows.to_id, People.name FROM Follows JOIN People ON Follows.to_id = People.id — ثم حلقة for تطبع كل صف بالصيغة %d -> %s. المتوقع: 2 -> opencontent ثم 3 -> lhawthorn.',
        en: "The two tables are embedded in the editor (People with three numbered rows and Follows with the relations 1\u21922 and 1\u21923). Write the query that re-assembles the name: SELECT Follows.to_id, People.name FROM Follows JOIN People ON Follows.to_id = People.id — then a for loop printing every row in the %d -> %s format. Expected: 2 -> opencontent then 3 -> lhawthorn.",
      },
      starterCode: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE People (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE Follows (from_id INTEGER, to_id INTEGER)')\nfor name in ['drchuck', 'opencontent', 'lhawthorn']:\n    cur.execute('INSERT INTO People (name) VALUES (?)', (name,))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 2))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 3))\nconn.commit()\n\n# JOIN يعيد تركيب الاسم من to_id / JOIN re-assembles the name from to_id\n# ثم حلقة for تطبع %d -> %s لكل صف / then a for loop printing %d -> %s per row\n",
      solution: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE People (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE Follows (from_id INTEGER, to_id INTEGER)')\nfor name in ['drchuck', 'opencontent', 'lhawthorn']:\n    cur.execute('INSERT INTO People (name) VALUES (?)', (name,))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 2))\ncur.execute('INSERT INTO Follows (from_id, to_id) VALUES (?, ?)', (1, 3))\nconn.commit()\n\ncur.execute('SELECT Follows.to_id, People.name FROM Follows JOIN People ON Follows.to_id = People.id')\nfor row in cur:\n    print('%d -> %s' % (row[0], row[1]))",
      tests: [
        {
          id: 't1',
          name: { ar: 'النتيجة المركبة صحيحة', en: 'The combined result is right' },
          code: "cur.execute('SELECT Follows.to_id, People.name FROM Follows JOIN People ON Follows.to_id = People.id')\nrows = cur.fetchall()\nassert rows == [(2, 'opencontent'), (3, 'lhawthorn')], 'expected: two combined rows | actual: %r' % (rows,)",
          expected: 'two combined rows',
        },
        {
          id: 't2',
          name: { ar: 'الخرج يعرض الاسمين بصيغة السهم', en: 'The output shows both names in arrow format' },
          code: "assert '2 -> opencontent' in __learner_output__ and '3 -> lhawthorn' in __learner_output__, 'expected: 2 -> opencontent / 3 -> lhawthorn | actual: %r' % __learner_output__",
          expected: '2 -> opencontent / 3 -> lhawthorn',
        },
        {
          id: 't3',
          name: { ar: 'بلا ON كانت النتيجة ستتضخم — تحقق من العدد', en: 'Without ON the result would inflate — verify the count' },
          code: "cur.execute('SELECT COUNT(*) FROM Follows JOIN People ON Follows.to_id = People.id')\njoined = cur.fetchone()[0]\nassert joined == 2, 'expected: 2 joined rows (not 6 cartesian) | actual: %r' % (joined,)",
          expected: '2 joined rows (not 6 cartesian)',
        },
      ],
      hints: [
        { ar: 'ON يقارن عمودًا من كل جدول: Follows.to_id = People.id — المتابَتُ هي التي نريد اسمها.', en: 'ON compares one column from each table: Follows.to_id = People.id — the followed one is whose name we want.' },
        { ar: 'في SELECT سمِّ العمودين مؤهلين: Follows.to_id وPeople.name — فكلا الجدولين يملك id ولا نريده هنا.', en: 'Name both columns qualified in SELECT: Follows.to_id and People.name — both tables own an id and we do not want it here.' },
        { ar: 'الهيكل:\ncur.execute(\'SELECT Follows.to_id, People.name FROM Follows JOIN People ON Follows.to_id = People.id\')\nfor row in cur:\n    print(\'%d -> %s\' % (row[0], row[1]))', en: "The skeleton:\ncur.execute('SELECT Follows.to_id, People.name FROM Follows JOIN People ON Follows.to_id = People.id')\nfor row in cur:\n    print('%d -> %s' % (row[0], row[1]))" },
        { ar: "cur.execute('SELECT Follows.to_id, People.name FROM Follows JOIN People ON Follows.to_id = People.id')\nfor row in cur:\n    print('%d -> %s' % (row[0], row[1]))", en: "cur.execute('SELECT Follows.to_id, People.name FROM Follows JOIN People ON Follows.to_id = People.id')\nfor row in cur:\n    print('%d -> %s' % (row[0], row[1]))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-join-count',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE a (id INTEGER PRIMARY KEY, name TEXT)')\ncur.execute('CREATE TABLE b (title TEXT, a_id INTEGER)')\ncur.execute('INSERT INTO a VALUES (?, ?)', (1, 'X'))\ncur.execute('INSERT INTO a VALUES (?, ?)', (2, 'Y'))\ncur.execute('INSERT INTO b VALUES (?, ?)', ('t1', 1))\ncur.execute('INSERT INTO b VALUES (?, ?)', ('t2', 2))\ncur.execute('INSERT INTO b VALUES (?, ?)', ('t3', 2))\ncur.execute('SELECT COUNT(*) FROM b JOIN a ON b.a_id = a.id')\nprint(cur.fetchone()[0])\ncur.execute('SELECT b.title FROM b JOIN a ON b.a_id = a.id WHERE a.name = ? ORDER BY b.title LIMIT 1', ('Y',))\nprint(cur.fetchone()[0])",
      solution: '3\nt2',
      answer: '3\nt2',
      hints: [
        { ar: 'كل صفوف b تحمل a_id صالحًا (1 أو 2) — فكلها تجد شريكًا في a.', en: 'Every b row carries a valid a_id (1 or 2) — so all find a partner in a.' },
        { ar: 'المطابقة تعطي صفًّا مركبًا لكل زوج متوافق — عدّ أزواج المطابقة لا الجداول.', en: 'The match gives one combined row per compatible pair — count matching pairs, not tables.' },
        { ar: 'WHERE a.name = Y يصفّي الصفوف المركبة ثم ORDER BY b.title LIMIT 1 يقتطع الأول هجائيًّا من t2 وt3.', en: 'WHERE a.name = Y filters the combined rows, then ORDER BY b.title LIMIT 1 cuts the first alphabetically from t2 and t3.' },
        { ar: 'الخرْج:\n3\nt2', en: 'The output:\n3\nt2' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-on-role',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما دور عبارة ON في SELECT ... FROM albums JOIN artists ON albums.artist_id = artists.id؟',
        en: 'What is the role of the ON clause in SELECT ... FROM albums JOIN artists ON albums.artist_id = artists.id?',
      },
      options: [
        { id: 'a', text: { ar: 'تعلن قاعدة المطابقة: اقترن كل صف ألبوم بصف الفنان الذي يساوي مفتاحه artist_id — صف مركب لكل زوج متوافق', en: 'It declares the match rule: pair every album row with the artist row whose key equals the album\u2019s artist_id — one combined row per compatible pair' } },
        { id: 'b', text: { ar: 'تعيد ترتيب النتيجة تنازليًّا كبديل عن ORDER BY', en: 'It re-sorts the result downward as an alternative to ORDER BY' } },
        { id: 'c', text: { ar: 'تحدد أي الأعمدة تُطبع في النتيجة', en: 'It decides which columns appear in the result' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'بلا ON لا يعرف المحرك أي صف يقترن بأي صف — فماذا كان سيفعل؟', en: 'Without ON the engine knows no pairing — what would it have done?' },
        { ar: 'ON شرط منطقي يقارن عمودين — مفتاحًا خارجيًّا بمفتاح أساسي.', en: 'ON is a logical condition comparing two columns — a foreign key against a primary key.' },
        { ar: 'أما الترتيب فلـ ORDER BY واختيار الأعمدة لـ SELECT — لكل كلمة وظيفتها.', en: 'Sorting belongs to ORDER BY and column choice to SELECT — every word has its own job.' },
        { ar: 'الجواب: أ — ON قاعدة المطابقة التي تولد الصفوف المركبة.', en: 'Answer: a — ON is the match rule generating the combined rows.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-on',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل بالكلمة الواحدة: العبارة التي تحمل قاعدة المطابقة في SELECT ... FROM Follows ____ People ON Follows.from_id = People.id هي كلمة ____ نفسها قبل اسم الجدول الثاني.',
        en: 'Complete with one word: the clause carrying the match rule in SELECT ... FROM Follows ____ People ON Follows.from_id = People.id is the word ____ itself, right before the second table name.',
      },
      answer: 'JOIN',
      solution: 'JOIN',
      hints: [
        { ar: 'الفراغ بين اسمي الجدولين — الكلمة التي تطلب الربط.', en: 'The blank between the two table names — the word requesting the link.' },
        { ar: 'رأيتها في كل استعلام هذا الدرس — أربعة أحرف كبيرة.', en: 'You saw it in every query this lesson — four capital letters.' },
        { ar: 'ON تأتي بعدها، لكن الكلمة المطلوبة هي التي قبل ON.', en: 'ON comes after it, but the wanted word is the one before ON.' },
        { ar: 'الجواب: JOIN', en: 'Answer: JOIN' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — اقلب الاتجاه: من الفنان إلى ألبوماته\n# Your playground — flip the direction: from artist to their albums\n\nimport sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, artist_id INTEGER)')\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Fairuz',))\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Ziad Rahbani',))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Ahdan', 1))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Kifak Inta', 1))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Houdou Nisbi', 2))\nconn.commit()\n\ncur.execute('SELECT artists.name, albums.title FROM artists JOIN albums ON albums.artist_id = artists.id WHERE artists.name = ?', ('Fairuz',))\nfor row in cur:\n    print('%s / %s' % (row[0], row[1]))\n\n# جرّب: احذف WHERE — من يظهر وبأي ترتيب؟ / try: remove WHERE — who appears and in what order?\n# جرّب: احذف ON كليًّا — كم صفا تحصل عليه؟ (لغز الدرس القادم!) / try: drop ON entirely — how many rows do you get? (next lesson's mystery!)",
      prompt: {
        ar: 'جرّب بنفسك: اقلب اتجاه الربط فتبدأ من artists وتصل ألبوماتها بWHERE لفنّانة بعينها. ثم جرّب حذف ON كليًّا وعُدّ النتيجة — ستقابل الضرب الديكارتي قبل وقته، وسنصلحه رسميًّا في مشروع الدرس الأخير. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: flip the join direction, starting from artists and reaching their albums with WHERE for one specific artist. Then try dropping ON entirely and count the result — you will meet the cartesian product ahead of schedule; we fix it officially in the final lesson\u2019s project. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في جدول albums العمود artist_id — فأي نوع من المفاتيح الثلاثة هو؟',
            en: 'In the albums table, the column artist_id — which of the three key kinds is it?',
          },
          options: [
            { id: 'a', text: { ar: 'مفتاح خارجي foreign key — رقم يشير إلى المفتاح الأساسي لصف في جدول artists', en: 'A foreign key — a number pointing at the primary key of a row in the artists table' } },
            { id: 'b', text: { ar: 'مفتاح أساسي primary key — لأنه يميز الألبوم', en: 'A primary key — because it identifies the album' } },
            { id: 'c', text: { ar: 'مفتاح منطقي logical key — لأن العالم يبحث به', en: 'A logical key — because the world searches by it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'اللاحقة _id في اصطلاح الكتاب تبوح: artist_id سهم نحو artists.id — أما مفتاح الألبوم الأساسي فهو id بتاعه، والمفتاح المنطقي سيكون عنوان الألبوم لو بحث الناس به.',
            en: 'The _id suffix in the book\u2019s convention confesses it: artist_id is an arrow toward artists.id — the album\u2019s own primary key is its id, and its logical key would be the title if people searched by it.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا تصنع JOIN عند كل زوج صفوف متوافق مع شرط ON؟',
            en: 'What does JOIN do for every pair of rows compatible with the ON condition?',
          },
          options: [
            { id: 'a', text: { ar: 'تنشئ صفًّا مركبًا واحدًا طويلًا يحوي خانات الجدولين — وتتكرر البيانات بالقدر الذي نحتاجه', en: 'It creates one long combined row holding cells from both tables — with data duplicated as much as needed' } },
            { id: 'b', text: { ar: 'تحذف أحد الصفين وتحتفظ بآخرهما فقط', en: 'It deletes one of the two rows and keeps only the latter' } },
            { id: 'c', text: { ar: 'تجمع قيم الأعمدة عدديًّا في صف واحد', en: 'It adds the column values numerically into one row' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب وصفها بدقة: JOIN تنشئ صفوفًا معدلة طويلة تحوي خانات الجدولين لكل زوج متوافق — صفوف Ahdan تتكرر فيها خانات Fairuz لأنها الوالدة الاسمية لكل منها.',
            en: 'The book describes it precisely: JOIN builds long modified rows holding both tables\u2019 cells for every compatible pair — Ahdan\u2019s rows repeat Fairuz\u2019s cells because she is the nominal parent of each.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث عشر: برنامج الكتاب يحلل رد JSON بـ json.loads ثم يغذي القاعدة — فماذا يضيف تخزين SQL فوق قاموس js المؤقت؟',
            en: 'From chapter 13: the book\u2019s program parses the JSON reply with json.loads and feeds the database — so what does SQL storage add over the temporary js dict?',
          },
          options: [
            { id: 'a', text: { ar: 'البقاء على القرص بين التشغيلات والاستعلام بـ SQL — الأسماء تُخزن مرة وتُرقّم بمفاتيح فتبقى العلاقات قابلة للربط والسؤال', en: 'Survival on disk across runs and SQL querying — names are stored once and numbered with keys, so relations stay linkable and questionable' } },
            { id: 'b', text: { ar: 'لا شيء — القاموس المؤقت يفعل كل ما تفعل القاعدة', en: 'Nothing — the temporary dict does everything the database does' } },
            { id: 'c', text: { ar: 'السرعة فقط — القاعدة أسرع من القاموس دائمًا', en: 'Speed only — the database is always faster than a dict' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'جسر الفصلين: JSON يسلّمك البنية في الذاكرة لجلسة واحدة، والقاعدة تحفظها مرقّمة بالمفاتيح لتسألها غدًا بـ WHERE وJOIN — هذا هو سبب وجود برنامج العنكبوت أصلًا.',
            en: 'The bridge between chapters: JSON hands you the structure in memory for one session; the database keeps it, keyed and numbered, so you can ask it tomorrow with WHERE and JOIN — the very reason the spider program exists.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'وفق اصطلاح التسمية الذي اتبعه الكتاب: كيف تفرّق في المخطط بين المفتاح الأساسي والمفاتيح الخارجية بلمحة واحدة؟',
            en: 'Per the book\u2019s naming convention: how do you tell the primary key from the foreign keys in a schema at a glance?',
          },
          options: [
            { id: 'a', text: { ar: 'المفتاح الأساسي يُسمى id دائمًا، والخارجية تنتهي بلاحقة _id كfrom_id وto_id وartist_id', en: 'The primary key is always named id, and foreign keys end with the _id suffix like from_id, to_id and artist_id' } },
            { id: 'b', text: { ar: 'الأساسي يكتب بأحرف كبيرة والخارجية بأحرف صغيرة', en: 'The primary is written in capitals and the foreign ones in lowercase' } },
            { id: 'c', text: { ar: 'لا اصطلاح — يجب قراءة كل CREATE TABLE كاملًا في كل مرة', en: 'No convention — you must re-read every full CREATE TABLE every time' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الاصطلاح جعل نموذج الكتاب يُقرأ كخريطة أسهم: كل *_id سهم نحو جدول يملك id مطابقًا — عادة صغيرة توفر دقائق في كل نموذج جديد تقابله.',
            en: 'The convention makes the book\u2019s model read like a map of arrows: every *_id points to a table owning a matching id — a small habit saving minutes in every new model you meet.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "cur.execute('SELECT COUNT(*) FROM albums JOIN artists')",
          right: "cur.execute('SELECT COUNT(*) FROM albums JOIN artists ON albums.artist_id = artists.id')",
          note: {
            ar: 'JOIN بلا قاعدة مطابقة يقترن كل صف بكل صف — الضرب الديكارتي: 3 × 2 = 6 صفوف كاذبة. ON إجبارية عمليًّا حتى لو قبلها المحرك نحويًّا.',
            en: 'A JOIN without a match rule pairs every row with every row — the cartesian product: 3 × 2 = 6 lying rows. ON is practically mandatory even if the engine accepts its absence grammatically.',
          },
        },
        {
          wrong: "cur.execute('SELECT id, name FROM albums JOIN artists ON albums.artist_id = artists.id')",
          right: "cur.execute('SELECT albums.id, albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id')",
          note: {
            ar: 'كلا الجدولين يملك id وربما name — العمود غير المؤهل غامض وقد يرمي خطأ أو يعيد العمود الخطأ. أهلّ الأسماء بـ table.column في كل JOIN.',
            en: 'Both tables own id and possibly name — an unqualified column is ambiguous and may raise an error or return the wrong one. Qualify names with table.column in every JOIN.',
          },
        },
        {
          wrong: "cur.execute('SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_name = artists.name')",
          right: "cur.execute('SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id')",
          note: {
            ar: 'الربط بالأسماء النصية يعيد اختراع السلاسل المكررة ويكسر عند كل اختلاف إملائي — اربط دائمًا بمفتاح خارجي رقمي إلى مفتاح أساسي.',
            en: 'Joining by text names reinvents repeated strings and breaks on every spelling difference — always join a numeric foreign key to a primary key.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المفاتيح الثلاثة: المنطقي ما يبحث به العالم (name)، والأساسي رقم تولّده القاعدة للربط الداخلي (id)، والخارجي رقم يشير إلى أساسي في جدول آخر (*_id).', en: 'Three keys: the logical one the world searches by (name), the primary a database-generated number for internal linking (id), and the foreign a number pointing at another table\u2019s primary (*_id).' },
        { ar: 'JOIN تعيد تركيب الجداول: ON تحمل قاعدة المطابقة (foreign = primary) فتنشأ صفوف مركبة لكل زوج متوافق — وWHERE يصفّي النتيجة المركبة.', en: 'JOIN re-assembles the tables: ON carries the match rule (foreign = primary), producing combined rows per compatible pair — and WHERE filters the combined result.' },
        { ar: 'علامة الإنذار: نتيجة JOIN أكبر من صفوف أي جدول؟ قاعدة المطابقة سقطت — الضرب الديكارتي — ومشروع الدرس الأخير سيصلحه أمام عينيك.', en: 'The alarm sign: a JOIN result larger than any table\u2019s rows? The match rule fell — the cartesian product — and the final lesson\u2019s project will fix it before your eyes.' },
      ],
      reflectPrompt: {
        ar: 'صِف نموذج مكتبتك الموسيقية بلغة الأسهم: لكل عمود _id اكتب من أي جدول إلى أي جدول يشير. ثم اكتب الاستعلام الذي يربط albums بالاثنين معًا: بفنانه وبنوعه — ماذا احتجت من كلمات JOIN وON؟',
        en: 'Describe your music-library model in arrow language: for every _id column write which table it points from and to. Then write the query joining albums to both at once: its artist and its genre — what JOIN and ON words did you need?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch15.s9', pages: 'ص273 / pp.273' },
        { book: 'PY4E', section: 'py4e.ch15.s10', pages: 'ص277 / pp.277' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch15.s9', pages: 'ص273 / pp.273' },
    { book: 'PY4E', section: 'py4e.ch15.s10', pages: 'ص277 / pp.277' },
  ],
} satisfies Lesson;

export default lesson;
