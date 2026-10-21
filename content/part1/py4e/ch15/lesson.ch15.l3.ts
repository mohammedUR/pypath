import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch15.l3 — "Querying and Aggregating / الاستعلامات والتجميع"
 * Aligned with PY4E ch15 s6 (استكشاف تويتر باستخدام قواعد البيانات).
 * All expression is original.
 * The book's Twitter-spider spirit with an embedded seed table shaped like the
 * book's Twitter(name, retrieved, friends): WHERE / ORDER BY ... DESC / LIMIT /
 * COUNT / AVG / MIN / MAX (+ a first look at GROUP BY for the project lesson).
 * All seed values hand-computed: count 6, friends sum 12, avg 2.0, max 4, min 1.
 */
const lesson = {
  id: 'py4e.ch15.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 15,
  title: { ar: 'الاستعلامات والتجميع', en: 'Querying and Aggregating' },
  estimatedMinutes: 17,
  prerequisites: ['py4e.ch15.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'برنامج الفصل في الكتاب عنكبوت يتجول في شبكة أصدقاء تويتر: يخزّن كل حساب في قاعدة بيانات مع عمود retrieved الذي يميز المستكشَف ممن لم يُستكشف بعد، وعمود يعدّ مرات ظهوره كصديق — وبهذا يستطيع البرنامج التوقف والإكمال بلا فقد بيانات. نحن نضمن جدول البيانات نفسه نصًّا في تمريناتنا كما ضمنّا ردود الخدمات سابقًا، ونصرف طاقتنا على السؤال الأهم: كيف نحاور الجدول؟ سطر SQL واحد يجيب ما كان يحتاج حلقات وشروطًا: WHERE يصفّي، وORDER BY ... DESC يرتب تنازليًّا، وLIMIT يقتطع، ودوال التجميع COUNT وAVG وMIN وMAX تلخص الآلاف في رقم واحد. بنهاية الدرس ستكون قادرًا على: كتابة استعلامات تصفية وترتيب واقتطاع، وحساب مجاميع جدول كامل، واستخراج قمة الصفوف.',
        en: 'The chapter\u2019s program in the book is a spider wandering the web of Twitter friends: it stores every account in a database with a retrieved column separating the explored from the unexplored, and a column counting how often it appeared as a friend — so the program can stop and resume without losing data. We embed the same data table as text in our exercises, the way we embedded service responses before, and spend our energy on the bigger question: how do we interview the table? One SQL line answers what took loops and conditions: WHERE filters, ORDER BY ... DESC sorts downward, LIMIT cuts, and the aggregates COUNT, AVG, MIN and MAX collapse thousands into one number. By the end of this lesson you will be able to: write filter, order and cut queries, compute whole-table aggregates, and pull out the top rows.',
      },
    },
    {
      kind: 'predict',
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE t (name TEXT, friends INTEGER)')\ncur.execute('INSERT INTO t VALUES (?, ?)', ('a', 3))\ncur.execute('INSERT INTO t VALUES (?, ?)', ('b', 1))\ncur.execute('SELECT COUNT(*), AVG(friends) FROM t')\nrow = cur.fetchone()\nprint(row[0])\nprint(row[1])",
      question: {
        ar: 'استعلام واحد سأل سؤالين في وقت واحد. كم صفا يعدّ COUNT(*)؟ وأي نوع يرد من AVG(friends) — صحيح أم عشري؟',
        en: 'One query asked two questions at once. How many rows does COUNT(*) count? And what type does AVG(friends) return — whole or decimal?',
      },
      reveal: {
        ar: '2 ثم 2.0. دوال التجميع تنهار صفوفًا كثيرة في صف إجابة واحد فيه خانة لكل دالة: [0] العدد و[1] المتوسط. والمتوسط رد عددًا عشريًّا 2.0 حتى لو كانت المدخلات صحيحة — AVG تحسب في عالم العشريات، فانتبه لشكل الطباعة.',
        en: '2 then 2.0. The aggregate functions collapse many rows into one answer row with a cell per function: [0] the count and [1] the average. The average came back as the decimal 2.0 even though the inputs are whole — AVG computes in the world of decimals, so watch the printed shape.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من حلقات بايثون إلى استعلام واحد', en: 'From Python loops to one query' },
      chunks: [
        {
          ar: 'جدول برنامج الكتاب يحمل لكل حساب ثلاثة أعمدة: name اسم الحساب، وretrieved صفر أو واحد يدل هل استُخرجت قائمة أصدقائه بعد، وfriends عداد مرات إضافته صديقًا. بذرتنا اليوم تلتف الشكل نفسه بستة صفوف. وحين تسكن البيانات جدولًا تتحول أسئلة الحلقات إلى أفعال SQL: SELECT name FROM Twitter WHERE retrieved = 0 LIMIT 1 — هذا السطر من برنامج الكتاب نفسه يختار الحساب التالي غير المستكشَف، أين عوامل if والشروط؟ صارت في اللغة.',
          en: 'The book program\u2019s table carries three columns per account: name for the account, retrieved zero-or-one telling whether its friends list was fetched yet, and friends counting how many times it was added as a friend. Today\u2019s seed mirrors that shape in six rows. And once data lives in a table, loop questions become SQL verbs: SELECT name FROM Twitter WHERE retrieved = 0 LIMIT 1 — this very line from the book\u2019s program picks the next unexplored account. Where did the if operators and conditions go? They moved into the language.',
        },
        {
          ar: 'WHERE يصفّي الصفوف بشرط منطقي واحد يقبل المقارنات وAND وOR، وORDER BY friends DESC يرتب تنازليًّا بحسب العمود (وASC تصاعديًّا وهي الافتراضية)، وLIMIT n يقتطع أول n صف بعد الترتيب. التوليفة الثلاثية — تصفية ثم ترتيب ثم اقتطاع — هي وصفة أعلى قيمتين أو أقدم ثلاثة صفوف أو أي قائمة قمة تريدها، بلا حلقة واحدة من بايثون.',
          en: 'WHERE filters rows with one logical condition accepting comparisons and AND and OR, ORDER BY friends DESC sorts downward by the column (ASC upward is the default), and LIMIT n cuts the first n rows after sorting. The triple combination — filter, then sort, then cut — is the recipe for top-two values, the three oldest rows, or any leaderboard you want, without a single Python loop.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'دوال التجميع تجيب عن أسئلة الكل', en: 'Aggregate functions answer whole-table questions' },
      chunks: [
        {
          ar: 'دوال التجميع تلخص مجموعة صفوف في إجابة واحدة: COUNT(*) يعد الصفوف، وAVG(column) متوسط قيم عمود، وMIN وMAX أصغر قيمة وأكبرها. استعلام واحد قد يجمعها كلها: SELECT COUNT(*), AVG(friends), MIN(friends), MAX(friends) FROM Twitter — ويعود صفًّا واحدًا فيه أربع خانات تفكها بـ [0] و[1] و[2] و[3]. وهنا أول نظرة على GROUP BY: تربط التجميع بمجموعات — SELECT friends, COUNT(*) FROM Twitter GROUP BY friends يعد كل قيمة فريدة كمرة ظهور، وسنحتاجه في مشروع الدرس الأخير لتقرير النوع الأكثر ألبومات.',
          en: 'Aggregate functions summarize a set of rows into one answer: COUNT(*) counts rows, AVG(column) averages a column\u2019s values, and MIN and MAX give the smallest and largest. One query may gather them all: SELECT COUNT(*), AVG(friends), MIN(friends), MAX(friends) FROM Twitter — returning a single row of four cells, unwrapped with [0], [1], [2] and [3]. And here is a first look at GROUP BY: it ties aggregation to groups — SELECT friends, COUNT(*) FROM Twitter GROUP BY friends counts every distinct value as an appearance; we will need it in the final lesson\u2019s project for the most-albums genre report.',
        },
        {
          ar: 'ودرس من بذرة مصممة بعناية: اخترنا أعداد أصدقاء بذرتنا بحيث يكون المتوسط عددًا نظيفًا (مجموعها 12 وصفوفها 6 فالمتوسط 2.0 بالضبط) وقمة الترتيب بلا تعادل (4 ثم 3 ثم 2) — لأن التعادل يجعل نتيجة LIMIT 2 رهن قرار الترتيب الداخلي. وفي بياناتك الحقيقية حين تخشى التعادل أضف مفتاح ترتيب ثانويًّا: ORDER BY friends DESC, name يكسر التعادلات هجائيًّا. تحقق يدويًّا من كل رقم قبل أن تؤمن به — هذه عادة الفصل.',
          en: 'And a lesson from a carefully designed seed: we picked our friends counts so the average is a clean number (sum 12 over 6 rows, average exactly 2.0) and the top of the ranking has no ties (4, then 3, then 2) — because a tie makes the LIMIT 2 result depend on internal sort decisions. In your real data, when you fear ties, add a secondary sort key: ORDER BY friends DESC, name breaks ties alphabetically. Hand-verify every number before trusting it — that is the chapter\u2019s habit.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'موجز شبكة الأصدقاء في استعلامين', en: 'A friends-network brief in two queries' },
      code: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE Twitter (name TEXT, retrieved INTEGER, friends INTEGER)')\nseed = [\n    ('drchuck', 1, 4),\n    ('opencontent', 1, 3),\n    ('lhawthorn', 1, 2),\n    ('steve_coppin', 0, 1),\n    ('davidkocher', 0, 1),\n    ('hrheingold', 0, 1),\n]\nfor row in seed:\n    cur.execute('INSERT INTO Twitter (name, retrieved, friends) VALUES (?, ?, ?)', row)\nconn.commit()\n\ncur.execute('SELECT name, friends FROM Twitter ORDER BY friends DESC LIMIT 2')\nprint(cur.fetchall())\n\ncur.execute('SELECT COUNT(*), AVG(friends), MIN(friends), MAX(friends) FROM Twitter')\nrow = cur.fetchone()\nprint(row[0], row[1], row[2], row[3])\nconn.close()",
      explanation: {
        ar: 'الاستعلام الأول سلسلة القمة: ترتيب تنازلي بالأصدقاء ثم اقتطاع اثنين — يعود fetchall قائمة صفوف فيها drchuck بأربعة وopencontent بثلاثة. والاستعلام الثاني الموجز الكامل: ستة صفوف، متوسط 2.0 (والمجموع 12 على 6 — تحقق بنفسك)، وأصغر قيمة 1 وأكبرها 4. استعلامان سطران — كانا يحتاجان حلقتين ومتغيرات عدّ في أيام القوائم.',
        en: 'The first query is the leaderboard: sort downward by friends, then cut two — fetchall returns the list of rows with drchuck at four and opencontent at three. The second query is the full brief: six rows, average 2.0 (sum 12 over 6 — verify it yourself), smallest value 1 and largest 4. Two queries, two lines — they once needed two loops and counting variables back in the list days.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.network-brief',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الجدول مضمّن في المحرر ببذرته الستة صفوف. اطلب بنفسك: اطبع عدد الحسابات غير المستكشَفة retrieved = 0 بالسطر waiting: %d، ثم متوسط الأصدقاء بالسطر average: %s، ثم اسم الحساب صاحب أكبر عدد أصدقاء بالسطر top: %s. القيم المتوقعة محسوبة يدويًّا: 3 و2.0 وdrchuck.',
        en: 'The table is embedded in the editor with its six-row seed. Ask it yourself: print the count of unexplored accounts retrieved = 0 as the line waiting: %d, then the average friends as average: %s, then the name of the account with the most friends as top: %s. The expected values are hand-computed: 3, then 2.0, then drchuck.',
      },
      starterCode: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE Twitter (name TEXT, retrieved INTEGER, friends INTEGER)')\nseed = [\n    ('drchuck', 1, 4),\n    ('opencontent', 1, 3),\n    ('lhawthorn', 1, 2),\n    ('steve_coppin', 0, 1),\n    ('davidkocher', 0, 1),\n    ('hrheingold', 0, 1),\n]\nfor row in seed:\n    cur.execute('INSERT INTO Twitter (name, retrieved, friends) VALUES (?, ?, ?)', row)\nconn.commit()\n\n# waiting: عدد صفوف WHERE retrieved = 0 / waiting: rows with WHERE retrieved = 0\n\n# average: AVG(friends) / average: AVG(friends)\n\n# top: الاسم بعد ORDER BY friends DESC LIMIT 1 / top: the name after ORDER BY friends DESC LIMIT 1\n",
      solution: "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE Twitter (name TEXT, retrieved INTEGER, friends INTEGER)')\nseed = [\n    ('drchuck', 1, 4),\n    ('opencontent', 1, 3),\n    ('lhawthorn', 1, 2),\n    ('steve_coppin', 0, 1),\n    ('davidkocher', 0, 1),\n    ('hrheingold', 0, 1),\n]\nfor row in seed:\n    cur.execute('INSERT INTO Twitter (name, retrieved, friends) VALUES (?, ?, ?)', row)\nconn.commit()\n\ncur.execute('SELECT COUNT(*) FROM Twitter WHERE retrieved = 0')\nprint('waiting: %d' % cur.fetchone()[0])\n\ncur.execute('SELECT AVG(friends) FROM Twitter')\nprint('average: %s' % cur.fetchone()[0])\n\ncur.execute('SELECT name FROM Twitter ORDER BY friends DESC LIMIT 1')\nprint('top: %s' % cur.fetchone()[0])",
      tests: [
        {
          id: 't1',
          name: { ar: 'عدد غير المستكشفين 3', en: 'The unexplored count is 3' },
          code: "assert 'waiting: 3' in __learner_output__, 'expected: waiting: 3 | actual: %r' % __learner_output__",
          expected: 'waiting: 3',
        },
        {
          id: 't2',
          name: { ar: 'المتوسط 2.0', en: 'The average is 2.0' },
          code: "assert 'average: 2.0' in __learner_output__, 'expected: average: 2.0 | actual: %r' % __learner_output__",
          expected: 'average: 2.0',
        },
        {
          id: 't3',
          name: { ar: 'القمة drchuck', en: 'The top is drchuck' },
          code: "assert 'top: drchuck' in __learner_output__, 'expected: top: drchuck | actual: %r' % __learner_output__",
          expected: 'top: drchuck',
        },
        {
          id: 't4',
          name: { ar: 'تحقق مستقل من القاعدة نفسها', en: 'An independent check against the database itself' },
          code: "cur.execute('SELECT COUNT(*) FROM Twitter WHERE retrieved = 0')\nwaiting = cur.fetchone()[0]\nassert waiting == 3, 'expected: 3 waiting in the table | actual: %r' % (waiting,)",
          expected: '3 waiting in the table',
        },
      ],
      hints: [
        { ar: 'ثلاثة استعلامات صغيرة أسهل من واحد متعب: COUNT بـ WHERE، ثم AVG، ثم ORDER BY مع LIMIT 1.', en: 'Three small queries beat one tired query: COUNT with WHERE, then AVG, then ORDER BY with LIMIT 1.' },
        { ar: 'كل استعلام يليه fetchone()[0] لأن كل واحد يعيد صفًّا واحدًا بخانة واحدة.', en: 'Each query is followed by fetchone()[0] because each returns one row of one cell.' },
        { ar: 'الهيكل:\ncur.execute(\'SELECT COUNT(*) FROM Twitter WHERE retrieved = 0\')\nprint(\'waiting: %d\' % cur.fetchone()[0])\ncur.execute(\'SELECT AVG(friends) FROM Twitter\')\nprint(\'average: %s\' % cur.fetchone()[0])\ncur.execute(\'SELECT name FROM Twitter ORDER BY friends DESC LIMIT 1\')\nprint(\'top: %s\' % cur.fetchone()[0])', en: "The skeleton:\ncur.execute('SELECT COUNT(*) FROM Twitter WHERE retrieved = 0')\nprint('waiting: %d' % cur.fetchone()[0])\ncur.execute('SELECT AVG(friends) FROM Twitter')\nprint('average: %s' % cur.fetchone()[0])\ncur.execute('SELECT name FROM Twitter ORDER BY friends DESC LIMIT 1')\nprint('top: %s' % cur.fetchone()[0])" },
        { ar: "cur.execute('SELECT COUNT(*) FROM Twitter WHERE retrieved = 0')\nprint('waiting: %d' % cur.fetchone()[0])\ncur.execute('SELECT AVG(friends) FROM Twitter')\nprint('average: %s' % cur.fetchone()[0])\ncur.execute('SELECT name FROM Twitter ORDER BY friends DESC LIMIT 1')\nprint('top: %s' % cur.fetchone()[0])", en: "cur.execute('SELECT COUNT(*) FROM Twitter WHERE retrieved = 0')\nprint('waiting: %d' % cur.fetchone()[0])\ncur.execute('SELECT AVG(friends) FROM Twitter')\nprint('average: %s' % cur.fetchone()[0])\ncur.execute('SELECT name FROM Twitter ORDER BY friends DESC LIMIT 1')\nprint('top: %s' % cur.fetchone()[0])" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-filter-range',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE t (name TEXT, friends INTEGER)')\ncur.execute('INSERT INTO t VALUES (?, ?)', ('a', 5))\ncur.execute('INSERT INTO t VALUES (?, ?)', ('b', 5))\ncur.execute('INSERT INTO t VALUES (?, ?)', ('c', 2))\ncur.execute('SELECT COUNT(*) FROM t WHERE friends > 2')\nprint(cur.fetchone()[0])\ncur.execute('SELECT MAX(friends) - MIN(friends) FROM t')\nprint(cur.fetchone()[0])",
      solution: '2\n3',
      answer: '2\n3',
      hints: [
        { ar: 'WHERE friends > 2 يصفّي: القيم 5 و5 و2 — أيهما ينجو؟', en: 'WHERE friends > 2 filters: the values are 5, 5 and 2 — which survive?' },
        { ar: 'MAX - MIN على القيم الثلاث يعطي الفرق بين أكبرها وأصغرها.', en: 'MAX - MIN over the three values gives the gap between the largest and the smallest.' },
        { ar: 'التجميع يرد صفًّا واحدًا دائمًا هنا — fetchone()[0] يفك الخانة.', en: 'The aggregate always returns one row here — fetchone()[0] unwraps the cell.' },
        { ar: 'الخرْج:\n2\n3', en: 'The output:\n2\n3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-row-shape',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بعد cur.execute(\'SELECT COUNT(*), AVG(friends) FROM Twitter\') — ما شكل نتيجة fetchone()؟',
        en: "After cur.execute('SELECT COUNT(*), AVG(friends) FROM Twitter') — what is the shape of fetchone()'s result?",
      },
      options: [
        { id: 'a', text: { ar: 'صف واحد tuple فيه خانتان: [0] العدد و[1] المتوسط — بغض النظر عن عدد صفوف الجدول', en: 'One tuple row of two cells: [0] the count and [1] the average — regardless of how many rows the table has' } },
        { id: 'b', text: { ar: 'صف واحد لكل صفوف الجدول — عددها بعدد الصفوف', en: 'One row per table row — as many as the table has' } },
        { id: 'c', text: { ar: 'قيمة عددية واحدة لا تحتاج [0]', en: 'A single scalar value that needs no [0]' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'التجميع ينهار صفوفًا كثيرة في إجابة واحدة — دالة واحدة خانة واحدة.', en: 'Aggregation collapses many rows into one answer — one function, one cell.' },
        { ar: 'خانتان في SELECT تعنيان خانتين في الصف العائد — تُفكان بـ [0] و[1].', en: 'Two cells in SELECT mean two cells in the returned row — unwrapped with [0] and [1].' },
        { ar: 'حتى COUNT(*) وحدها تعيد صفًّا — عادة [0] ملازمة لها في كل الفصل.', en: 'Even COUNT(*) alone returns a row — the [0] habit stays with it all chapter.' },
        { ar: 'الجواب: أ — صف واحد بخانتين مهما كان حجم الجدول.', en: 'Answer: a — one row of two cells whatever the table size.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-average',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: في بذرة التمرين الأول، أعداد الأصدقاء هي 4 و3 و2 و1 و1 و1. ما المتوسط؟ (اكتب العدد)',
        en: 'Without running: in the first exercise\u2019s seed, the friends counts are 4, 3, 2, 1, 1 and 1. What is the average? (Write the number)',
      },
      answer: '2',
      solution: '2',
      tolerance: 0,
      hints: [
        { ar: 'اجمع الستة أرقام أولًا — ثم اقسم على عددها.', en: 'Add the six numbers first — then divide by how many they are.' },
        { ar: 'المجموع 12 وعدد الصفوف 6.', en: 'The sum is 12 and the row count is 6.' },
        { ar: '12 مقسومة على 6 — وAVG كانت ستطبعها 2.0 عشريًّا.', en: '12 over 6 — and AVG would print it as the decimal 2.0.' },
        { ar: 'الجواب: 2', en: 'Answer: 2' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — قياد الجدول بأسئلة SQL\n# Your playground — interviewing the table with SQL questions\n\nimport sqlite3\n\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\n\ncur.execute('CREATE TABLE Twitter (name TEXT, retrieved INTEGER, friends INTEGER)')\nseed = [\n    ('drchuck', 1, 4),\n    ('opencontent', 1, 3),\n    ('lhawthorn', 1, 2),\n    ('steve_coppin', 0, 1),\n    ('davidkocher', 0, 1),\n    ('hrheingold', 0, 1),\n]\nfor row in seed:\n    cur.execute('INSERT INTO Twitter (name, retrieved, friends) VALUES (?, ?, ?)', row)\nconn.commit()\n\ncur.execute('SELECT name, friends FROM Twitter WHERE friends >= 2 ORDER BY friends DESC')\nfor row in cur:\n    print(row)\n\n# جرّب: GROUP BY تجربة أولى — عدّاد تكرارات كل قيمة أصدقاء / try: a first GROUP BY taste — counting every distinct friends value\n# جرّب: أضف LIMIT 3 بعد ORDER BY — من يبقى ومن يسقط؟ / try: add LIMIT 3 after ORDER BY — who stays, who falls?\n# جرّب: SUM(friends) — هل تساوي جمع AVG مضروبًا في COUNT؟ / try: SUM(friends) — does it equal AVG times COUNT?",
      prompt: {
        ar: 'جرّب بنفسك: صفّ بالشرط ثم رتب ثم اقتطع — وراقب كيف يتقلص الناتج في كل خطوة. ثم GROUP BY تجربة أولى: عدّاد تكرارات كل قيمة أصدقاء. وتحقق اليدوي عادة: احسب بنفسك ثم قارن. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: filter, then sort, then cut — and watch the result shrink at every step. Then a first GROUP BY taste: a counter for every distinct friends value. And keep the hand-verification habit: compute by yourself, then compare. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا يغيّر DESC في ORDER BY friends DESC؟',
            en: 'What does DESC change in ORDER BY friends DESC?',
          },
          options: [
            { id: 'a', text: { ar: 'يجعل الترتيب تنازليًّا من الأكبر إلى الأصغر — وبدونه الترتيب تصاعدي ASC افتراضيًّا', en: 'It makes the order descending, largest first — without it the order is ascending ASC by default' } },
            { id: 'b', text: { ar: 'يحذف الصفوف المتساوية في القيمة', en: 'It drops rows equal in value' } },
            { id: 'c', text: { ar: 'يعكس ترتيب الأعمدة في كل صف', en: 'It reverses the column order inside every row' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'DESC اختصار descending — سلسلة القمة تبدأ منه؛ وبدونه يرتب SQL تصاعديًّا فتصل أصغر القيم أولًا وتفوّت القمة.',
            en: 'DESC is short for descending — the leaderboard starts from it; without it SQL sorts ascending and the smallest values arrive first while the top slips away.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'برنامج الكتاب يختار الحساب التالي غير المستكشَف بسطر واحد — ما التوليفة التي تصف أعلى صف واحد بعينه؟',
            en: 'The book\u2019s program picks the next unexplored account in one line — which combination singles out the very top row?',
          },
          options: [
            { id: 'a', text: { ar: 'ORDER BY friends DESC LIMIT 1 — رتب تنازليًّا ثم اقتطع الصف الأول', en: 'ORDER BY friends DESC LIMIT 1 — sort downward, then cut the first row' } },
            { id: 'b', text: { ar: 'SELECT TOP 1 — كلمة سحرية تعرفها SQL وحدها', en: 'SELECT TOP 1 — a magic word only SQL knows' } },
            { id: 'c', text: { ar: 'WHERE friends = MAX(friends) — دالة التجميع داخل الشرط', en: 'WHERE friends = MAX(friends) — the aggregate inside the condition' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'LIMIT 1 بعد الترتيب هي الطريقة الكتابية النظيفة. أما وضع MAX داخل WHERE فلا تجيزه SQL — الدوال التجميعية لا تعيش في شرط التصفية المباشر.',
            en: 'LIMIT 1 after sorting is the clean, book-sanctioned way. Putting MAX inside WHERE is not allowed — aggregate functions do not live in the plain filter condition.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثامن: حلقة for على المؤشر for row in cur: تمر على الصفوف واحدًا واحدًا — لماذا ذكر الكتاب أن هذا أفعل من جلب كل الجدول دفعة واحدة؟',
            en: 'From chapter 8: the loop for row in cur: walks the rows one by one — why did the book call this more effective than fetching the whole table at once?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن المؤشر يقرأ من القاعدة ما تستهلكه الحلقة فقط — كفاءة حاسمة على الجداول الضخمة', en: 'Because the cursor reads from the database only what the loop consumes — a decisive efficiency on huge tables' } },
            { id: 'b', text: { ar: 'لأن جلب الجدول كله ممنوع لغويًّا في SQL', en: 'Because fetching the whole table is grammatically forbidden in SQL' } },
            { id: 'c', text: { ar: 'لأن الحلقة تطبع أسرع من fetchall', en: 'Because the loop prints faster than fetchall' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذه عادة ملفات الفصل السابع عادت: القراءة الكسولة صفيًّا بدل تحميل الكل — والكتاب نص عليها مع SELECT تحديدًا: المؤشر يقرأ وفق تكرارات الحلقة.',
            en: 'This is the chapter-7 file habit returning: lazy row-by-row reading instead of loading everything — and the book states it for SELECT specifically: the cursor reads along with the loop iterations.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ماذا يفعل SELECT * FROM Tracks WHERE title = \'My Way\' — ولاحظ علامة يساوي واحدة؟',
            en: "What does SELECT * FROM Tracks WHERE title = 'My Way' do — note the single equals sign?",
          },
          options: [
            { id: 'a', text: { ar: 'يعيد كل الأعمدة (*) لكل الصفوف التي عنوانها My Way — بيساوي واحدة لأنها قاعدة SQL لا بايثون', en: "It returns every column (*) of every row whose title is My Way — one equals sign because that is SQL's rule, not Python's" } },
            { id: 'b', text: { ar: 'يعدّ الصفوف المطابقة — النجمة تعني العدّ', en: 'It counts the matching rows — the star means counting' } },
            { id: 'c', text: { ar: 'يرمي خطأ لأن النجمة تحتاج ORDER BY', en: 'It throws because the star needs ORDER BY' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'النجمة كل الأعمدة، وWHERE يصفّي بيساوي واحدة كما نبّه الكتاب في ملخص SQL — وأنت استعملت النمط نفسه في هذا الدرس على عمود retrieved.',
            en: 'The star means every column, and WHERE filters with one equals sign as the book\u2019s SQL summary warned — you used the same pattern on the retrieved column this lesson.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "cur.execute('SELECT name FROM t WHERE friends = MAX(friends)')",
          right: "cur.execute('SELECT name FROM t ORDER BY friends DESC LIMIT 1')",
          note: {
            ar: 'دوال التجميع لا تعيش داخل WHERE المباشر — تحليل القمة يتم بالترتيب ثم الاقتطاع. ORDER BY ... DESC LIMIT 1 هو الوصفة المعتمدة في الكتاب والفصل.',
            en: 'Aggregate functions do not live inside a plain WHERE — the top is found by sorting, then cutting. ORDER BY ... DESC LIMIT 1 is the book- and chapter-sanctioned recipe.',
          },
        },
        {
          wrong: "cur.execute('SELECT name FROM t ORDER BY friends')  # أريد القمة!",
          right: "cur.execute('SELECT name FROM t ORDER BY friends DESC')",
          note: {
            ar: 'الترتيب الافتراضي تصاعدي فتجد أصغر قيمة في القمة لا أكبرها — إن أردت سلسلة القمة فDESC إجبارية، وإلا ظننت أن drchuck بخمسة أصدقاء هو الأصغر.',
            en: 'The default order is ascending, so the smallest value lands on top, not the largest — for a leaderboard DESC is mandatory, or you will mistake drchuck at five friends for the smallest.',
          },
        },
        {
          wrong: "cur.execute('SELECT COUNT(*) FROM t')\nprint(cur)",
          right: "cur.execute('SELECT COUNT(*) FROM t')\nprint(cur.fetchone()[0])",
          note: {
            ar: 'النتيجة تحتاج جلبًا: fetchone()[0] للصف الواحد — طباعة المؤشر تعطي شيئًا مثل <sqlite3.Cursor object> لا الرقم الذي سألت عنه.',
            en: 'The result needs fetching: fetchone()[0] for the single row — printing the cursor gives something like <sqlite3.Cursor object>, not the number you asked about.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'جدول الكتاب name وretrieved وfriends يحاوره SQL: WHERE يصفّي وORDER BY ... DESC يرتب وLIMIT يقتطع — قمة أي قائمة بسطر واحد.', en: 'The book\u2019s table of name, retrieved and friends is interviewed in SQL: WHERE filters, ORDER BY ... DESC sorts, LIMIT cuts — any leaderboard in one line.' },
        { ar: 'دوال التجميع COUNT وAVG وMIN وMAX تنهار صفوفًا كثيرة في صف إجابة تفكه [0] و[1] — وAVG تعود عشريًّا حتى من مدخلات صحيحة.', en: 'The aggregates COUNT, AVG, MIN and MAX collapse many rows into one answer row unwrapped with [0] and [1] — and AVG comes back decimal even from whole inputs.' },
        { ar: 'GROUP BY يربط التجميع بالمجموعات ويؤذن بمشروع الدرس الأخير — وتحقق يدويًّا من كل رقم: بذرتك محسوبة مسبقًا (6 صفوف ومتوسط 2.0).', en: 'GROUP BY ties aggregation to groups and announces the final lesson\u2019s project — and hand-verify every number: your seed is pre-computed (6 rows, average 2.0).' },
      ],
      reflectPrompt: {
        ar: 'اكتب استعلامًا واحدًا يجيب: ما عدد الحسابات التي أصداؤها 3 أو أكثر، مرتبة تنازليًّا بالأصدقاء؟ ثم أعد صياغته بحيث يقتطع أعلى اثنين فقط. أي كلمة أضفت في كل مرة — وهل كتبت أي حلقة؟',
        en: 'Write one query answering: how many accounts have 3 or more friends, sorted downward by friends? Then rephrase it to cut only the top two. Which word did you add each time — and did you write any loop at all?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch15.s6', pages: 'ص258 / pp.258' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch15.s6', pages: 'ص258 / pp.258' },
  ],
} satisfies Lesson;

export default lesson;
