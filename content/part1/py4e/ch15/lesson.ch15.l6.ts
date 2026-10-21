import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch15.l6 — "Chapter 15 Review and Project: The Music Library Database /
 * مراجعة الفصل 15 ومشروع: قاعدة بيانات المكتبة الموسيقية"
 * Aligned with PY4E ch15 s11 (الملخص) + s12 (التنقيح) + s13 (فهرس المصطلحات).
 * All expression is original.
 * Project: a self-contained :memory: music library — three tables (genres,
 * artists, albums) with embedded seed rows, a JOIN pairing every album with
 * its artist, and an aggregate report (artists / albums / top genre / avg
 * tracks). Debug block: a JOIN without the ON match rule runs and prints the
 * cartesian-product symptom 'albums: 6' instead of 3.
 * Seed hand-computed: tracks 8+10+7+6+5+12 = 48 over 6 albums, avg 8.0;
 * genres Tarab 3 / Jazz 2 / Folk 1 albums (top genre unique).
 */
const lesson = {
  id: 'py4e.ch15.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 15,
  title: { ar: 'مراجعة الفصل 15 ومشروع: قاعدة بيانات المكتبة الموسيقية', en: 'Chapter 15 Review and Project: The Music Library Database' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch15.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'يُغلق الفصل الخامس عشر الكتاب على أوسع بنية بيانات تعلمتها: قاعدة علائقية كاملة. مررنا بخمس محطات: قاعدة البيانات قاموس يعيش على القرص، وجداول تصرّح بأعمدتها، ولغة SQL بأفعالها الأربعة وعلامتي ?، ثم نمذجة الجداول المتعددة بمفاتيحها، وأخيرًا JOIN قاعدة المطابقة. اليوم مراجعة شاملة وفهرس المصطلحات ومشروع الختام: قاعدة بيانات المكتبة الموسيقية — ثلاثة جداول (أنواع وفنانون وألبومات) ببذور مضمّنة، واستعلام JOIN يقترن كل ألبوم بفنانه، وتقرير تجميعي يطبع أعداد الجداول والنوع الأغنى ومتوسط المسارات، ثم تنقيح خلل صامت: JOIN بلا قاعدة مطابقة يضاعف الأعداد. بنهاية الدرس ستكون قادرًا على: استرجاع مصطلحات الفصل، وبناء نموذج ثلاثي الجداول من الصفر، وتشخيص الضرب الديكارتي وإصلاحه.',
        en: 'Chapter 15 closes the book on the widest data structure you have learned: a full relational database. We passed five stations: the database as a dictionary living on disk, tables declaring their columns, SQL with its four verbs and two ? marks, modeling multiple tables with their keys, and finally JOIN\u2019s match rule. Today is a full review plus the glossary and the closing project: the music library database — three tables (genres, artists, albums) with embedded seeds, a JOIN query pairing every album with its artist, an aggregate report printing table counts, the richest genre and the average tracks, then a silent-flaw debug: a JOIN with no match rule multiplying the numbers. By the end of this lesson you will be able to: retrieve the chapter\u2019s vocabulary, build a three-table model from zero, and diagnose and fix the cartesian product.',
      },
    },
    {
      kind: 'predict',
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE t (g TEXT)')\ncur.execute('INSERT INTO t VALUES (?)', ('a',))\ncur.execute('INSERT INTO t VALUES (?)', ('a',))\ncur.execute('INSERT INTO t VALUES (?)', ('b',))\ncur.execute('SELECT g, COUNT(*) FROM t GROUP BY g ORDER BY COUNT(*) DESC LIMIT 1')\nprint(cur.fetchone())",
      question: {
        ar: 'سطر واحد عرف القيمة الأكثر تكرارًا — كيف؟ تتبع عمل GROUP BY ثم ORDER BY ثم LIMIT على الصفوف الثلاثة.',
        en: 'One line knew the most frequent value — how? Trace GROUP BY, then ORDER BY, then LIMIT over the three rows.',
      },
      reveal: {
        ar: "('a', 2) — GROUP BY جمع الصفوف المتشابهة في مجموعتين a وb، وCOUNT(*) عدّ كل مجموعة، وORDER BY ... DESC رتبت المجموعات بالعدد التنازلي، وLIMIT 1 اقتطعت القمة. هذه التوليفة الرباعية هي محرك سطر top genre في مشروع اليوم.",
        en: "('a', 2) — GROUP BY gathered the like rows into two groups a and b, COUNT(*) counted each group, ORDER BY ... DESC ranked the groups downward by count, and LIMIT 1 cut the top. This four-word combo powers today\u2019s top genre line.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل ومصطلحاته', en: 'The chapter map and its glossary' },
      chunks: [
        {
          ar: 'خريطة الفصل بخمسة مسارات: الأول ما هي قاعدة البيانات — ملف منظّم على تخزين دائم أسرع بالفهارس، وبنيتها جداول وأسطر وأعمدة (صوريًّا: علاقة وصف tuple وسمة). الثاني أول الجداول: CREATE TABLE بأنواع الأعمدة TEXT وINTEGER وREAL، والمؤشر كمقبض ملف، وcommit يثبت الكتابة. الثالث لغة SQL: الأفعال الأربعة INSERT وSELECT وUPDATE وDELETE مع WHERE وORDER BY وعلامتي ? التي تُسلّم القيم بيانًّا. الرابع نمذجة البيانات: لا تكرار السلاسل، وINTEGER PRIMARY KEY يرقّم تلقائيًّا، وUNIQUE قيد، ونمط استرجاع-أو-أضف بـ lastrowid. الخامس المفاتيح الثلاثة وJOIN بشرط ON.',
          en: 'The chapter\u2019s map has five routes: first, what a database is — an organized file on persistent storage kept fast by indexes, structured as tables, rows and columns (formally relation, tuple, attribute). Second, first tables: CREATE TABLE with column types TEXT, INTEGER and REAL, the cursor as a file handle, commit making writes stick. Third, SQL: the four verbs INSERT, SELECT, UPDATE and DELETE with WHERE and ORDER BY and the two ? marks handing values over as data. Fourth, data modeling: never repeat strings, INTEGER PRIMARY KEY numbering automatically, UNIQUE as a constraint, and retrieve-or-add with lastrowid. Fifth, the three keys and JOIN with its ON condition.',
        },
        {
          ar: 'وفهرس المصطلحات — كما يجمعه الكتاب: قاعدة البيانات database ملف منظم لتخزين البيانات على وحدة دائمة؛ الجدول table بنية من صفوف وأعمدة بنمط واحد؛ الصف row (أو tuple) سجل واحد كامل؛ العمود column (أو attribute) خانة بنوع معلن؛ المفتاح الأساسي primary key رقم تولّده القاعدة يربط الصفوف بين الجداول؛ المفتاح الخارجي foreign key رقم يشير إلى مفتاح أساسي في جدول آخر؛ JOIN عبارة تربط الجداول وفق شرط المطابقة؛ والتجميع aggregate دوال تلخص صفوفًا كثيرة في إجابة واحدة كCOUNT وAVG. هذه الثمانية هي عقود الفصل.',
          en: 'And the glossary — as the book assembles it: a database is an organized file storing data on persistent storage; a table is a structure of rows and columns of one pattern; a row (or tuple) is one complete record; a column (or attribute) is a cell of declared type; a primary key is a database-generated number linking rows across tables; a foreign key is a number pointing at a primary key in another table; JOIN is the clause linking tables by a match condition; and an aggregate is a function summarizing many rows into one answer like COUNT and AVG. These eight are the chapter\u2019s anchors.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'وصفة التقرير — وعلة الأعداد المتضخمة', en: 'The report recipe — and the inflated-numbers flaw' },
      chunks: [
        {
          ar: 'تقرير المشروع أربعة أسطر وكل سطر وصفة معروفة من الدروس الماضية: عدد صفوف جدول بـ COUNT(*) وfetchone()[0]؛ والنوع الأغنى ألبوماتًا بـ GROUP BY على اسم النوع ثم COUNT(*) ثم ORDER BY ... DESC وLIMIT 1؛ والمتوسط بـ AVG(tracks) مطبوعًا بتنسيق %.1f لخانة عشرية واحدة — وكلها أرقام تحققت يدويًّا من البذرة: ثلاثة فنانين وستة ألبومات وTarab بثلاثة ألبومات ومتوسط 8.0 من مجموع 48. وخط الأزواج يقترن كل ألبوم بفنانه بـ JOIN ON — القسمة تُلازم التركيب.',
          en: 'The project report is four lines, each a recipe from past lessons: a table\u2019s row count with COUNT(*) and fetchone()[0]; the richest genre with GROUP BY on the genre name, then COUNT(*), then ORDER BY ... DESC and LIMIT 1; and the average with AVG(tracks) printed in the %.1f format for one decimal cell — all numbers hand-verified from the seed: three artists, six albums, Tarab at three albums, and an 8.0 average from a sum of 48. And the pairs line joins every album with its artist via JOIN ON — the split never loses its re-assembly.',
        },
        {
          ar: 'وأما العلة الصامتة فتسكن سطرًا واحدًا: SELECT COUNT(*) FROM albums JOIN artists بلا ON — المحرك يقترن كل ألبوم بكل فنان: الضرب الديكارتي، فستة ألبومات وثلاثة فنانين يظهران 18 صفًّا وعدّاد التقرير يكذب. العلامة المميزة: عدد أكبر من صفوف أي جدول منفرد. الإصلاح يضيف قاعدة المطابقة ON albums.artist_id = artists.id فيعود العدد 6. وستلعب دور المحقق في كتلة التنقيح: شغّل المعطوب، لاحظ التضخم، أصلح الشرط — بنفس عين الحارس التي أصلحت مقارنات الحالة في الفصل الثالث عشر.',
          en: 'As for the silent flaw, it lives in one line: SELECT COUNT(*) FROM albums JOIN artists with no ON — the engine pairs every album with every artist: the cartesian product, so six albums and three artists pretend to be 18 rows and the report counter lies. The signature: a number larger than any single table\u2019s rows. The fix adds the match rule ON albums.artist_id = artists.id and the count returns to 6. You play the detective in the debug block: run the broken code, watch the inflation, fix the condition — with the same guard\u2019s eye that fixed status comparisons back in chapter 13.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تقرير مصغّر: ألبومات وأنواع', en: 'A miniature report: albums and genres' },
      code: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE genres (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, genre_id INTEGER, tracks INTEGER)')\n\nfor gid, gname in [(1, 'Tarab'), (2, 'Jazz')]:\n    cur.execute('INSERT INTO genres (id, name) VALUES (?, ?)', (gid, gname))\nfor title, genre_id, tracks in [('Ahdan', 1, 8), ('Kifak Inta', 1, 10), ('Ana Mosh Kafir', 2, 6)]:\n    cur.execute('INSERT INTO albums (title, genre_id, tracks) VALUES (?, ?, ?)', (title, genre_id, tracks))\nconn.commit()\n\ncur.execute('SELECT COUNT(*) FROM albums')\nprint('albums: %d' % cur.fetchone()[0])\n\ncur.execute('SELECT genres.name, COUNT(*) FROM albums JOIN genres ON albums.genre_id = genres.id GROUP BY genres.name ORDER BY COUNT(*) DESC LIMIT 1')\nprint('top genre: %s' % cur.fetchone()[0])\n\ncur.execute('SELECT AVG(tracks) FROM albums')\nprint('avg tracks: %.1f' % cur.fetchone()[0])\nconn.close()",
      explanation: {
        ar: 'ثلاثة من أسطر التقرير الأربعة جاهزة هنا: albums: 3 بعدّ مباشر، وtop genre: Tarab لأن مجموعتي النوعين قُيدا وعُدّا ورُتبتا ففازت Tarab بألبومين مقابل واحد، وavg tracks: 8.0 لأن مجموع المسارات 24 على ثلاثة ألبومات. لاحظ سطر GROUP BY الكامل — هو أطول سطر في المشروع لكنه تركيب من خمس كلمات تعرفهن كلها. المشروع يضيف جدول artists وخط الأزواج.',
        en: 'Three of the report\u2019s four lines are ready here: albums: 3 by direct count, top genre: Tarab because the two genres were grouped, counted and ranked with Tarab winning two albums against one, and avg tracks: 8.0 because the tracks sum to 24 over three albums. Note the full GROUP BY line — the project\u2019s longest, yet a composition of five words you already own. The project adds the artists table and the pairs line.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-mini-report',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE t (g TEXT, tracks INTEGER)')\ncur.execute('INSERT INTO t VALUES (?, ?)', ('a', 8))\ncur.execute('INSERT INTO t VALUES (?, ?)', ('a', 4))\ncur.execute('INSERT INTO t VALUES (?, ?)', ('b', 6))\ncur.execute('SELECT COUNT(*) FROM t WHERE g = ?', ('a',))\nprint(cur.fetchone()[0])\ncur.execute('SELECT AVG(tracks) FROM t')\nprint(cur.fetchone()[0])",
      solution: '2\n6.0',
      answer: '2\n6.0',
      hints: [
        { ar: 'WHERE g = a يصفّي الصفين الأولين — وCOUNT يعدّهما.', en: 'WHERE g = a filters the first two rows — COUNT counts them.' },
        { ar: 'AVG على المسارات الثلاثة: اجمع ثم اقسم على العدد.', en: 'AVG over the three tracks: add, then divide by the count.' },
        { ar: 'المجموع 18 على ثلاثة صفوف — وAVG تطبع الناتج عشريًّا.', en: 'The sum is 18 over three rows — and AVG prints the result as a decimal.' },
        { ar: 'الخرْج:\n2\n6.0', en: 'The output:\n2\n6.0' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.music-library-project',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: قاعدة بيانات المكتبة الموسيقية. الجداول الثلاثة والبذور مضمّنة في المحرر (genre_id 1 هي Tarab و2 Jazz و3 Folk). اطلب: أولًا JOIN يطبع كل ألبوم باسم فنانه بالصيغة album: %s / artist: %s، ثم التقرير الرباعي: artists: %d بعدد الفنانين، وalbums: %d بعدد الألبومات، وtop genre: %s للنوع صاحب أكثر الألبومات (GROUP BY ثم ORDER BY ثم LIMIT 1)، وavg tracks: %.1f لمتوسط المسارات. القيم محسوبة يدويًّا: 3 و6 وTarab و8.0.',
        en: "The project: the music library database. The three tables and seeds are embedded in the editor (genre_id 1 is Tarab, 2 Jazz, 3 Folk). Ask it: first a JOIN printing every album with its artist's name as album: %s / artist: %s, then the four-line report: artists: %d counting artists, albums: %d counting albums, top genre: %s for the genre with the most albums (GROUP BY then ORDER BY then LIMIT 1), and avg tracks: %.1f for the average tracks. Hand-computed values: 3, 6, Tarab, 8.0.",
      },
      starterCode: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE genres (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, artist_id INTEGER, genre_id INTEGER, tracks INTEGER)')\n\nfor gid, gname in [(1, 'Tarab'), (2, 'Jazz'), (3, 'Folk')]:\n    cur.execute('INSERT INTO genres (id, name) VALUES (?, ?)', (gid, gname))\nfor aid, aname in [(1, 'Fairuz'), (2, 'Ziad Rahbani'), (3, 'Marcel Khalife')]:\n    cur.execute('INSERT INTO artists (id, name) VALUES (?, ?)', (aid, aname))\nfor title, artist_id, genre_id, tracks in [\n    ('Ahdan', 1, 1, 8),\n    ('Kifak Inta', 1, 1, 10),\n    ('Ya Ana Ya Ana', 1, 1, 7),\n    ('Ana Mosh Kafir', 2, 2, 6),\n    ('Houdou Nisbi', 2, 2, 5),\n    ('Wahin', 3, 3, 12),\n]:\n    cur.execute('INSERT INTO albums (title, artist_id, genre_id, tracks) VALUES (?, ?, ?, ?)', (title, artist_id, genre_id, tracks))\nconn.commit()\n\n# 1) JOIN يطبع album: %s / artist: %s لكل ألبوم / the JOIN printing album: %s / artist: %s per album\n\n# 2) artists: %d / artists: %d\n\n# 3) albums: %d / albums: %d\n\n# 4) top genre: %s — GROUP BY وORDER BY وLIMIT 1 / top genre: %s — GROUP BY, ORDER BY, LIMIT 1\n\n# 5) avg tracks: %.1f / avg tracks: %.1f\n",
      solution: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE genres (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, artist_id INTEGER, genre_id INTEGER, tracks INTEGER)')\n\nfor gid, gname in [(1, 'Tarab'), (2, 'Jazz'), (3, 'Folk')]:\n    cur.execute('INSERT INTO genres (id, name) VALUES (?, ?)', (gid, gname))\nfor aid, aname in [(1, 'Fairuz'), (2, 'Ziad Rahbani'), (3, 'Marcel Khalife')]:\n    cur.execute('INSERT INTO artists (id, name) VALUES (?, ?)', (aid, aname))\nfor title, artist_id, genre_id, tracks in [\n    ('Ahdan', 1, 1, 8),\n    ('Kifak Inta', 1, 1, 10),\n    ('Ya Ana Ya Ana', 1, 1, 7),\n    ('Ana Mosh Kafir', 2, 2, 6),\n    ('Houdou Nisbi', 2, 2, 5),\n    ('Wahin', 3, 3, 12),\n]:\n    cur.execute('INSERT INTO albums (title, artist_id, genre_id, tracks) VALUES (?, ?, ?, ?)', (title, artist_id, genre_id, tracks))\nconn.commit()\n\ncur.execute('SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id')\nfor row in cur:\n    print('album: %s / artist: %s' % (row[0], row[1]))\n\ncur.execute('SELECT COUNT(*) FROM artists')\nprint('artists: %d' % cur.fetchone()[0])\n\ncur.execute('SELECT COUNT(*) FROM albums')\nprint('albums: %d' % cur.fetchone()[0])\n\ncur.execute('SELECT genres.name FROM albums JOIN genres ON albums.genre_id = genres.id GROUP BY genres.name ORDER BY COUNT(*) DESC LIMIT 1')\nprint('top genre: %s' % cur.fetchone()[0])\n\ncur.execute('SELECT AVG(tracks) FROM albums')\nprint('avg tracks: %.1f' % cur.fetchone()[0])",
      tests: [
        {
          id: 't1',
          name: { ar: 'عددا الجداول صحيحان', en: 'Both table counts are right' },
          code: "assert 'artists: 3' in __learner_output__ and 'albums: 6' in __learner_output__, 'expected: artists: 3 / albums: 6 | actual: %r' % __learner_output__",
          expected: 'artists: 3 / albums: 6',
        },
        {
          id: 't2',
          name: { ar: 'النوع الأغنى Tarab', en: 'The richest genre is Tarab' },
          code: "assert 'top genre: Tarab' in __learner_output__, 'expected: top genre: Tarab | actual: %r' % __learner_output__",
          expected: 'top genre: Tarab',
        },
        {
          id: 't3',
          name: { ar: 'متوسط المسارات 8.0', en: 'The average tracks is 8.0' },
          code: "assert 'avg tracks: 8.0' in __learner_output__, 'expected: avg tracks: 8.0 | actual: %r' % __learner_output__",
          expected: 'avg tracks: 8.0',
        },
        {
          id: 't4',
          name: { ar: 'الأزواج مركبة بJOIN: ألبوم مع فنانه', en: 'Pairs assembled by JOIN: album with its artist' },
          code: "assert 'album: Kifak Inta / artist: Fairuz' in __learner_output__ and 'album: Houdou Nisbi / artist: Ziad Rahbani' in __learner_output__, 'expected: joined album/artist pairs | actual: %r' % __learner_output__",
          expected: 'joined album/artist pairs',
        },
        {
          id: 't5',
          name: { ar: 'تحقق مستقل: الـ JOIN المطابق يعطي 6 لا 18', en: 'Independent check: the matched JOIN gives 6, not 18' },
          code: "cur.execute('SELECT COUNT(*) FROM albums JOIN artists ON albums.artist_id = artists.id')\njoined = cur.fetchone()[0]\nassert joined == 6, 'expected: 6 joined rows (not 18 cartesian) | actual: %r' % (joined,)",
          expected: '6 joined rows (not 18 cartesian)',
        },
      ],
      hints: [
        { ar: 'خط الأزواج هو JOIN من الدرس الخامس نفسه: SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id ثم حلقة.', en: 'The pairs line is lesson five\u2019s JOIN: SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id then a loop.' },
        { ar: 'أسطر العدّا سطران مستقلان بـ COUNT(*) وfetchone()[0] — لا تحاول دمجهما.', en: 'The two count lines are two independent statements with COUNT(*) and fetchone()[0] — do not merge them.' },
        { ar: 'الهيكل:\ncur.execute(\'SELECT COUNT(*) FROM artists\')\nprint(\'artists: %d\' % cur.fetchone()[0])\ncur.execute(\'SELECT COUNT(*) FROM albums\')\nprint(\'albums: %d\' % cur.fetchone()[0])\ncur.execute(\'SELECT genres.name FROM albums JOIN genres ON albums.genre_id = genres.id GROUP BY genres.name ORDER BY COUNT(*) DESC LIMIT 1\')\nprint(\'top genre: %s\' % cur.fetchone()[0])\ncur.execute(\'SELECT AVG(tracks) FROM albums\')\nprint(\'avg tracks: %.1f\' % cur.fetchone()[0])', en: "The skeleton:\ncur.execute('SELECT COUNT(*) FROM artists')\nprint('artists: %d' % cur.fetchone()[0])\ncur.execute('SELECT COUNT(*) FROM albums')\nprint('albums: %d' % cur.fetchone()[0])\ncur.execute('SELECT genres.name FROM albums JOIN genres ON albums.genre_id = genres.id GROUP BY genres.name ORDER BY COUNT(*) DESC LIMIT 1')\nprint('top genre: %s' % cur.fetchone()[0])\ncur.execute('SELECT AVG(tracks) FROM albums')\nprint('avg tracks: %.1f' % cur.fetchone()[0])" },
        { ar: "cur.execute('SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id')\nfor row in cur:\n    print('album: %s / artist: %s' % (row[0], row[1]))\ncur.execute('SELECT COUNT(*) FROM artists')\nprint('artists: %d' % cur.fetchone()[0])\ncur.execute('SELECT COUNT(*) FROM albums')\nprint('albums: %d' % cur.fetchone()[0])\ncur.execute('SELECT genres.name FROM albums JOIN genres ON albums.genre_id = genres.id GROUP BY genres.name ORDER BY COUNT(*) DESC LIMIT 1')\nprint('top genre: %s' % cur.fetchone()[0])\ncur.execute('SELECT AVG(tracks) FROM albums')\nprint('avg tracks: %.1f' % cur.fetchone()[0])", en: "cur.execute('SELECT albums.title, artists.name FROM albums JOIN artists ON albums.artist_id = artists.id')\nfor row in cur:\n    print('album: %s / artist: %s' % (row[0], row[1]))\ncur.execute('SELECT COUNT(*) FROM artists')\nprint('artists: %d' % cur.fetchone()[0])\ncur.execute('SELECT COUNT(*) FROM albums')\nprint('albums: %d' % cur.fetchone()[0])\ncur.execute('SELECT genres.name FROM albums JOIN genres ON albums.genre_id = genres.id GROUP BY genres.name ORDER BY COUNT(*) DESC LIMIT 1')\nprint('top genre: %s' % cur.fetchone()[0])\ncur.execute('SELECT AVG(tracks) FROM albums')\nprint('avg tracks: %.1f' % cur.fetchone()[0])" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-inflation',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بذرة فيها 6 ألبومات و3 فنانين — وظهر تقرير زميلك سطر albums: 18. ما التفسير الأرجح حسب علامة الإنذار التي حفظتها؟',
        en: 'A seed holds 6 albums and 3 artists — and a teammate\u2019s report printed albums: 18. Per the alarm sign you memorized, what is the likeliest explanation?',
      },
      options: [
        { id: 'a', text: { ar: 'JOIN بلا ON — الضرب الديكارتي قرن كل ألبوم بكل فنان: 6 × 3 = 18، والإصلاح إضافة ON albums.artist_id = artists.id', en: 'A JOIN without ON — the cartesian product paired every album with every artist: 6 × 3 = 18, and the fix is adding ON albums.artist_id = artists.id' } },
        { id: 'b', text: { ar: 'عدّاد COUNT أضاف 12 خطأً — الكلمة المعنية هي COUNT نفسها', en: 'The COUNT counter added 12 by mistake — the culprit is COUNT itself' } },
        { id: 'c', text: { ar: 'القاعدة أُدخلت فيها ألبومات مكررة 3 مرات لكل ألبوم', en: 'The database was fed each album three times over' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: '18 أكبر من صفوف أي جدول منفرد — ماذا يفعل JOIN حين يُترك بلا قاعدة؟', en: '18 exceeds any single table\u2019s rows — what does JOIN do when left without a rule?' },
        { ar: '6 ألبومات × 3 فنانين — اقتران الكل بالكل يعطي حاصل الضرب.', en: '6 albums × 3 artists — pairing all with all yields the product.' },
        { ar: 'COUNT لا تخطئ في العدّ — وتكرار الإدخال كان سيصطدم بقيد أو يظهر في الأزواج.', en: 'COUNT does not miscount — and duplicate inserts would hit a constraint or show in the pairs.' },
        { ar: 'الجواب: أ — العلة في قاعدة المطابقة الغائبة، لا في العدّ.', en: 'Answer: a — the flaw is the missing match rule, not the counting.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-avg',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: أعداد مسارات ألبومات المشروع الستة هي 8 و10 و7 و6 و5 و12. ما المتوسط الذي سيطبعه سطر avg tracks؟',
        en: 'Without running: the tracks counts of the project\u2019s six albums are 8, 10, 7, 6, 5 and 12. What average will the avg tracks line print?',
      },
      answer: '8',
      solution: '8',
      tolerance: 0,
      hints: [
        { ar: 'اجمع الستة أرقام — ثم اقسم على 6.', en: 'Add the six numbers — then divide by 6.' },
        { ar: 'المجموع 48 على ستة ألبومات.', en: 'The sum is 48 over six albums.' },
        { ar: '48 مقسومة على 6 — والسطر سيطبقه بتنسيق %.1f فيظهر 8.0.', en: '48 over 6 — and the line prints it in the %.1f format, showing 8.0.' },
        { ar: 'الجواب: 8', en: 'Answer: 8' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-join-no-on',
      required: true,
      brokenCode: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, artist_id INTEGER)')\n\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Fairuz',))\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Ziad Rahbani',))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Ahdan', 1))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Kifak Inta', 1))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Houdou Nisbi', 2))\nconn.commit()\n\ncur.execute('SELECT COUNT(*) FROM albums JOIN artists')  # الربط بلا قاعدة مطابقة / the join with no match rule\ntotal = cur.fetchone()[0]\nprint('albums: %d' % total)",
      prompt: {
        ar: 'التقرير يقول albums: 6 والقاعدة فيها ثلاثة ألبومات فقط! الكود يعمل بلا أي خطأ — والعدد كذب. شغّل المعطوب ولاحظ العلامة المميزة: نتيجة JOIN أكبر من صفوف أي جدول (3 ألبومات × فنانان = 6). هذا هو الضرب الديكارتي: بلا قاعدة مطابقة يقترن كل صف بكل صف. أصلح الاستعلام بإضافة شرط ON albums.artist_id = artists.id ليقرأ التقرير albums: 3.',
        en: 'The report says albums: 6 while the database holds only three albums! The code runs without any error — and the number lies. Run the broken code and notice the signature: a JOIN result larger than any single table (3 albums × 2 artists = 6). This is the cartesian product: with no match rule, every row pairs with every row. Fix the query by adding the condition ON albums.artist_id = artists.id so the report reads albums: 3.',
      },
      solution: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, artist_id INTEGER)')\n\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Fairuz',))\ncur.execute('INSERT INTO artists (name) VALUES (?)', ('Ziad Rahbani',))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Ahdan', 1))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Kifak Inta', 1))\ncur.execute('INSERT INTO albums (title, artist_id) VALUES (?, ?)', ('Houdou Nisbi', 2))\nconn.commit()\n\ncur.execute('SELECT COUNT(*) FROM albums JOIN artists ON albums.artist_id = artists.id')  # قاعدة المطابقة تعود / the match rule returns\ntotal = cur.fetchone()[0]\nprint('albums: %d' % total)",
      tests: [
        {
          id: 't1',
          name: { ar: 'العدد الصادق: 3', en: 'The honest count: 3' },
          code: "assert 'albums: 3' in __learner_output__, 'expected: albums: 3 | actual: %r' % __learner_output__",
          expected: 'albums: 3',
        },
        {
          id: 't2',
          name: { ar: 'سطر تقرير واحد بلا تضخم', en: 'One report line, no inflation' },
          code: "assert __learner_output__.count('albums:') == 1, 'expected: exactly one albums line | actual: %r' % __learner_output__",
          expected: 'exactly one albums line',
        },
        {
          id: 't3',
          name: { ar: 'كل ألبوم وجد شريكه — تحقق مستقل', en: 'Every album found its partner — independent check' },
          code: "cur.execute('SELECT COUNT(*) FROM albums')\nalbums_total = cur.fetchone()[0]\ncur.execute('SELECT COUNT(*) FROM albums JOIN artists ON albums.artist_id = artists.id')\njoined_total = cur.fetchone()[0]\nassert albums_total == 3 and joined_total == albums_total, 'expected: 3 albums all matched | actual: %r' % ((albums_total, joined_total),)",
          expected: '3 albums all matched',
        },
      ],
      hints: [
        { ar: 'لا استثناء ولا انهيار — العلة صامتة: COUNT عدّ ما أعطاه المحرك بلا سؤال.', en: 'No exception, no crash — the flaw is silent: COUNT counted whatever the engine handed over without asking.' },
        { ar: 'الفرق بين 6 و3 هو 3 — عدد الفنانين: كل ألبوم اقترن بفنانين اثنين بدل واحد.', en: 'The gap between 6 and 3 is 3 — the artist count: every album paired with two artists instead of one.' },
        { ar: 'الإصلاح كلمة واحدة ضمن الاستعلام: ... JOIN artists ON albums.artist_id = artists.id — أضف الشرط بعد اسم الجدول الثاني.', en: 'The fix is one phrase inside the query: ... JOIN artists ON albums.artist_id = artists.id — add the condition after the second table name.' },
        { ar: 'بعد الإصلاح: SELECT COUNT(*) FROM albums JOIN artists ON albums.artist_id = artists.id يطبع albums: 3.', en: "After the fix: SELECT COUNT(*) FROM albums JOIN artists ON albums.artist_id = artists.id prints albums: 3." },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — مكتبتك الموسيقية الكاملة\n# Your playground — your full music library\n\nimport sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE genres (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT UNIQUE)')\ncur.execute('CREATE TABLE albums (id INTEGER PRIMARY KEY, title TEXT, artist_id INTEGER, genre_id INTEGER, tracks INTEGER)')\n\nfor gid, gname in [(1, 'Tarab'), (2, 'Jazz'), (3, 'Folk')]:\n    cur.execute('INSERT INTO genres (id, name) VALUES (?, ?)', (gid, gname))\nfor aid, aname in [(1, 'Fairuz'), (2, 'Ziad Rahbani'), (3, 'Marcel Khalife')]:\n    cur.execute('INSERT INTO artists (id, name) VALUES (?, ?)', (aid, aname))\nfor title, artist_id, genre_id, tracks in [\n    ('Ahdan', 1, 1, 8),\n    ('Kifak Inta', 1, 1, 10),\n    ('Ya Ana Ya Ana', 1, 1, 7),\n    ('Ana Mosh Kafir', 2, 2, 6),\n    ('Houdou Nisbi', 2, 2, 5),\n    ('Wahin', 3, 3, 12),\n]:\n    cur.execute('INSERT INTO albums (title, artist_id, genre_id, tracks) VALUES (?, ?, ?, ?)', (title, artist_id, genre_id, tracks))\nconn.commit()\n\n# جرّب: أضف ألبومًا رابعًا لFairuz (genre_id 1) وأعد سطر top genre وavg tracks / try: add a fourth Fairuz album (genre_id 1) and re-run top genre and avg tracks\n# جرّب: JOIN بلا ON — كم صفا يظهران؟ / try: JOIN without ON — how many rows pretend to exist?\n# جرّب: WHERE genre_id = 2 على خط الأزواج — ألبومات Jazz وحدها / try: WHERE genre_id = 2 on the pairs line — only the Jazz albums",
      prompt: {
        ar: 'جرّب بنفسك: وسّع المكتبة بألبوم جديد وأعد التقرير — هل تغير top genre؟ واقترف جريمة الضرب الديكارتي مرة بعينيك قبل أن تحرس منها أبدًا. ثم صفّي الأزواج بنوع بعينه بWHERE. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: grow the library with a new album and re-run the report — did top genre change? Commit the cartesian crime once with your own eyes before guarding against it forever. Then filter the pairs to one genre with WHERE. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الثامن: قائمة أعداد وأردت أعلى قيمتين منها — كيف كنت تفعلها قبل أن يعلمك ORDER BY ... DESC LIMIT 2؟',
            en: 'From chapter 8: a list of numbers and you wanted its top two — how did you do it before ORDER BY ... DESC LIMIT 2 taught you?',
          },
          options: [
            { id: 'a', text: { ar: 'sort() للترتيب ثم الشريحة [:2] — وSQL تجمع الاثنتين في عبارة واحدة على الصفوف', en: 'sort() then the [:2] slice — and SQL fuses the two into one clause over rows' } },
            { id: 'b', text: { ar: 'max() مرتين ثم حذف القيمة الأولى من القائمة', en: 'max() twice, then removing the first value from the list' } },
            { id: 'c', text: { ar: 'لم يكن ذلك ممكنًا على القوائم — ميزة جديدة كليًّا في SQL', en: 'It was impossible on lists — a brand-new SQL-only power' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفكرة نفسها عبر العالمين: رتب ثم اقتطع. القائمة تحتاج sort ثم شريحة، والجدول يفعلها في ORDER BY ... DESC LIMIT 2 — دون نسخ أو ترتيب يدوي.',
            en: 'The same idea across both worlds: sort, then cut. The list needs sort plus a slice; the table does it in ORDER BY ... DESC LIMIT 2 — no copying, no manual ordering.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل التاسع: عدّاد القواميس counts[g] = counts.get(g, 0) + 1 — ما علاقة GROUP BY g مع COUNT(*) به؟',
            en: 'From chapter 9: the dict counter counts[g] = counts.get(g, 0) + 1 — what does GROUP BY g with COUNT(*) have to do with it?',
          },
          options: [
            { id: 'a', text: { ar: 'GROUP BY يجمع الصفوف المتشابهة في المفتاح g وCOUNT(*) يعد كل مجموعة — عدّاد الكتاب سطرًا واحدًا داخل القاعدة', en: 'GROUP BY gathers like rows by the key g and COUNT(*) counts each group — the dict counter as one line inside the database' } },
            { id: 'b', text: { ar: 'GROUP BY يحذف المكررات فقط ولا علاقة له بالعدّ', en: 'GROUP BY merely deletes duplicates and has nothing to do with counting' } },
            { id: 'c', text: { ar: 'علاقة عكسية — COUNT يمنع GROUP BY من العمل', en: 'An inverse relation — COUNT blocks GROUP BY from working' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذه هي الفكرة ذاتها: تجميع حسب قيمة ثم عدّ — قاموسك كان يفعلها في ذاكرة الجلسة، والقاعدة تفعلها على أقراص كاملة بسطر واحد في المشروع (سطر top genre).',
            en: 'The very same idea: group by value, then count. Your dict did it in session memory; the database does it across full disks with one line — the project\u2019s top genre line.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الحادي عشر: التعبير النمطي يبحث داخل النصوص — فأين يعمل WHERE ومتى تختار كلًّا منهما؟',
            en: 'From chapter 11: a regular expression searches inside texts — where does WHERE work, and when do you pick each?',
          },
          options: [
            { id: 'a', text: { ar: 'WHERE يعمل على صفوف قاعدة البيانات بشرط منطقي قبل أن تعود النتائج — regex لنص حر وWHERE لجدول منظم', en: 'WHERE works on database rows with a logical condition before results return — regex for free text, WHERE for an organized table' } },
            { id: 'b', text: { ar: 'WHERE هو اسم التعبير النمطي داخل SQL — الأداة نفسها', en: 'WHERE is the regex inside SQL — the very same tool' } },
            { id: 'c', text: { ar: 'لا فرق — كلاهما يعمل على النصوص فقط', en: 'No difference — both work on texts only' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'أداتان في عالمين: regex يقتنص أنماطا من نص خام كسجلات البريد، وWHERE يصفّي صفوفًا منظمة بأعمدة معلنة — وكلاهما فلترة، لكن المكان والقواعد مختلفان تمامًا.',
            en: 'Two tools in two worlds: regex harvests patterns from raw text like mail logs, and WHERE filters organized rows of declared columns — both are filtering, but the venue and rules differ entirely.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثالث عشر: برنامج الكتاب يستقبل رد JSON ويحلله بـ json.loads — فما دور علامتي ? في الخطوة التالية؟',
            en: 'From chapter 13: the book\u2019s program receives a JSON reply and parses it with json.loads — so what role do the two ? marks play in the next step?',
          },
          options: [
            { id: 'a', text: { ar: 'تُسلّم قيم الحقول المستخرجة من الـ JSON إلى INSERT كبيانات خالصة — فلا يمكن لأي اسم أو نص أن يتحول إلى كود SQL', en: 'They hand the field values extracted from the JSON to INSERT as pure data — no name or text can turn into SQL code' } },
            { id: 'b', text: { ar: 'تُحلل JSON داخل SQL مباشرة — علامتا استفهام محلل ثانٍ', en: 'They parse the JSON inside SQL directly — the question marks are a second parser' } },
            { id: 'c', text: { ar: 'لا دور لها بعد json.loads — القيم تُلصق في نص الأمر', en: 'No role after json.loads — values are glued into the command text' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'سلسلة البيانات الكاملة: urlopen يجيب، وloads يفك الـ JSON إلى قواميس وقوائم، وINSERT بعلامتي ? يخزن القيم بيانًّا — فتبقى على القرص لتسألها بSQL في أي وقت لاحق.',
            en: 'The full data pipeline: urlopen answers, loads unwraps the JSON into dicts and lists, and INSERT with two ? marks stores the values as data — so they live on disk, queryable by SQL at any later time.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'رتب المفاتيح الثلاثة لوظائفها: أيها يبحث به العالم الخارجي، وأيها تولّده القاعدة للربط، وأيها يشير إلى جدول آخر؟',
            en: 'Sort the three keys by their jobs: which does the outside world search by, which does the database generate for linking, and which points at another table?',
          },
          options: [
            { id: 'a', text: { ar: 'المنطقي logical يبحث به العالم، والأساسي primary تولّده القاعدة ويربط الصفوف، والخارجي foreign يشير إلى مفتاح أساسي في جدول آخر', en: 'The logical key is searched by the world, the primary is database-generated and links rows, the foreign points at a primary key in another table' } },
            { id: 'b', text: { ar: 'الخارجي يبحث به العالم، والمنطقي يربط الصفوف، والأساسي يشير للجداول', en: 'The foreign is searched by the world, the logical links rows, the primary points at tables' } },
            { id: 'c', text: { ar: 'الثلاثة مرادفات — الاسم يعتمد على النظام', en: 'All three are synonyms — the name depends on the system' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قسمة الفصل التاسعة كما هي: name منطقي بحثًا، وid أساسي ربطًا، وfrom_id وartist_id خارجية إشارةً — واصطلاح التسمية يكشف النوع بلمحة.',
            en: 'The chapter\u2019s ninth-section division as-is: name logical for searching, id primary for linking, from_id and artist_id foreign for pointing — and the naming convention reveals the kind at a glance.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'لماذا يتضخم عدد صفوف نتيجة SELECT COUNT(*) FROM albums JOIN artists حين تُحذف عبارة ON؟',
            en: 'Why does the row count of SELECT COUNT(*) FROM albums JOIN artists inflate when the ON clause is dropped?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن كل صف من الجدول الأول يقترن بكل صف من الثاني — الضرب الديكارتي — فيصبح العدد حاصل ضرب عددي صفوف الجدولين', en: 'Because every row of the first table pairs with every row of the second — the cartesian product — so the count becomes the product of the two tables\u2019 row counts' } },
            { id: 'b', text: { ar: 'لأن المحرك يضيف ألبومات وهمية لتعويض الناقص', en: 'Because the engine invents placeholder albums to fill the gap' } },
            { id: 'c', text: { ar: 'لأن COUNT بدون ON تعد الصفوف مرتين', en: 'Because COUNT without ON counts rows twice' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'بلا قاعدة مطابقة لا يعرف المحرك أي صف يقترن بأي صف، فيقرن الكل بالكل — وفي كتلة التنقيح رأيت 6 بدل 3، وفي بذرة 6×3 رأيت 18. ON هي الوصفة الوحيدة.',
            en: 'With no match rule the engine knows no pairing, so it pairs all with all — in the debug block you saw 6 instead of 3, and in a 6×3 seed you would see 18. ON is the one remedy.',
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
            ar: 'الضرب الديكارتي في تقريرك يضاعف كل عدد: 6×3 = 18 — سطر ON واحد يعيد الصواب. ولت: عدد أكبر من صفوف أي جدول علامة خيانة قاعدة المطابقة.',
            en: 'The cartesian product in your report multiplies every number: 6×3 = 18 — one ON line restores the truth. Remember: a count larger than any table\u2019s rows is the match rule betraying you.',
          },
        },
        {
          wrong: "cur.execute('SELECT genres.name, COUNT(*) FROM albums JOIN genres ON albums.genre_id = genres.id')",
          right: "cur.execute('SELECT genres.name, COUNT(*) FROM albums JOIN genres ON albums.genre_id = genres.id GROUP BY genres.name')",
          note: {
            ar: 'عمود عادي بجوار دالة تجميع بلا GROUP BY لا يرمي خطأ هنا — يعيد صفا واحدًا باسم اعتباطي وعدد كلي: قيمة صامتة الخطأ. كلما جمعت عمودًا مع COUNT فاجمع GROUP BY.',
            en: 'A plain column beside an aggregate without GROUP BY raises no error here — it returns one row with an arbitrary name and a whole-table count: a silently wrong value. Whenever you mix a column with COUNT, bring GROUP BY along.',
          },
        },
        {
          wrong: "cur.execute('SELECT AVG(tracks) FROM albums')\nprint('avg tracks: %d' % cur.fetchone()[0])",
          right: "cur.execute('SELECT AVG(tracks) FROM albums')\nprint('avg tracks: %.1f' % cur.fetchone()[0])",
          note: {
            ar: 'AVG تعود عددًا عشريًّا حتى من مدخلات صحيحة — و%d قد يقصّها أو يربكها، و%.1f يعرض خانة عشرية واحدة كما في تقريرنا: avg tracks: 8.0.',
            en: 'AVG returns a decimal even from whole inputs — %d may truncate or confuse it, while %.1f shows one decimal cell as in our report: avg tracks: 8.0.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'خريطة الفصل: قاعدة على القرص بفهارسها، جداول مصرّحة، أفعال SQL الأربعة بعلامتي ?، نمذجة بلا سلاسل مكررة، ومفاتيح ثلاثة وJOIN بشرط ON.', en: 'The chapter map: a disk database with indexes, declared tables, the four SQL verbs with two ? marks, string-free modeling, and three keys with JOIN\u2019s ON condition.' },
        { ar: 'مشروع المكتبة الموسيقية جمع كل شيء: ثلاثة جداول ببذور مضمّنة، وJOIN يقترن كل ألبوم بفنانه، وتقرير أربعة أسطر أرقامه محسوبة يدويًّا (3 و6 وTarab و8.0).', en: 'The music library project gathered it all: three tables with embedded seeds, a JOIN pairing every album with its artist, and a four-line report with hand-computed numbers (3, 6, Tarab, 8.0).' },
        { ar: 'الخلل الصامت الذي أصلحته: JOIN بلا ON يضاعف الأعداد — والوصفة النهائية: تصفّي بWHERE وترتيب بORDER BY واقتطاع بLIMIT وتجميع بCOUNT وAVG فوق قاعدة مطابقة صحيحة.', en: 'The silent flaw you fixed: JOIN without ON multiplies the numbers — and the final recipe: filter with WHERE, sort with ORDER BY, cut with LIMIT, aggregate with COUNT and AVG, all atop a correct match rule.' },
      ],
      reflectPrompt: {
        ar: 'أغلق الكتاب وابنِ من الذاكرة مكتبتك الخاصة: ثلاثة جداول بمجالك المفضل (كتب وأفلام أو لاعبون وفرق)، بذرتان لكل جدول، JOIN واحد، وتقرير من سطرين. أي خطوة نسيتها — CREATE أم commit أم ON؟',
        en: 'Close the book and build your own library from memory: three tables in a field you love (books and films, or players and teams), two seed rows each, one JOIN, and a two-line report. Which step did you forget — CREATE, commit, or ON?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch15.s11', pages: 'ص281 / pp.281' },
        { book: 'PY4E', section: 'py4e.ch15.s12', pages: 'ص281 / pp.281' },
        { book: 'PY4E', section: 'py4e.ch15.s13', pages: 'ص282 / pp.282' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch15.s11', pages: 'ص281 / pp.281' },
    { book: 'PY4E', section: 'py4e.ch15.s12', pages: 'ص281 / pp.281' },
    { book: 'PY4E', section: 'py4e.ch15.s13', pages: 'ص282 / pp.282' },
  ],
} satisfies Lesson;

export default lesson;
