import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch2.l1 — "Tensors as Nested Lists: Data Manipulation and Preprocessing"
 * المتوترات كقوائم متداخلة: معالجة البيانات وتنظيفها
 * Aligned with D2L ch2 s1 (Data Manipulation) + s2 (Data Preprocessing).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: a pure-Python mini tensor toolkit
 * (shape / ndim / elementwise add / broadcast (3,1)+(1,2)) plus a mean-impute
 * report on a 4-row missing-value table. Every literal verified under CPython 3.
 * Deterministic only: no input(), no exit(), no unittest.main, no seeding needed.
 */
const lesson = {
  id: 'd2l.ch2.l1',
  version: 1,
  part: 'II',
  track: 'A0',
  book: 'D2L',
  chapter: 2,
  title: {
    ar: 'المتوترات كقوائم متداخلة: معالجة البيانات وتنظيفها',
    en: 'Tensors as Nested Lists: Data Manipulation and Preprocessing',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.appendix.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قبل أي نموذج تعلم عميق توجد بيانات يجب تخزينها ثم تنظيفها. في هذا الدرس ستبني نسخة مصغرة من فكرة الموتر tensor بقوائم بايثون متداخلة: الشكل، العمليات عنصر-بعنصر، والبث broadcasting — ثم تنظف جدولًا فيه قيم ناقصة بالمنطق نفسه الذي يستخدمه الكتاب: متوسط العمود للأرقام، وفئة خاصة للمفقود في الأعمدة الفئوية. بنهاية الدرس ستستطيع تحويل أي جدول فوضوي إلى مصفوفة رقمية جاهزة للتدريب.',
        en: 'Before any deep learning model there is data that must be stored, then cleaned. In this lesson you will build a miniature version of the tensor idea from nested Python lists: shape, elementwise operations, and broadcasting — then clean a table with missing values using the same logic the book uses: the column mean for numbers, a dedicated category for the missing mark in categorical columns. By the end you can turn a messy table into a numeric matrix that is ready for training.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'موتّرات صغيرة وبيانات ناقصة', en: 'Tiny tensors and missing data' },
      chunks: [
        {
          ar: 'الموتر أرقام مرتبة في شبكة، وقائمة بايثون متداخلة تكفي لفهمه: القائمة المسطحة متجه (محور واحد)، وقائمة قوائم متساوية الأطوال مصفوفة (محوران)، وكل تداخل أعمق يضيف محورًا. ثلاثة أرقام تصفه: shape (الطول على كل محور) وndim (عدد المحاور) وnumel (مجموع العناصر). العمليات عنصر-بعنصر تطبق قاعدة عددية على كل زوج متقابل: جمع مصفوفتين متماثلتي الشكل يجمع كل زوج، والمقارنة == تنتج قناع True/False. أما البث broadcasting فيعالج اختلاف الأشكال: مصفوفة (3,1) زائد صف (1,2) تُنسخ كل منهما على محورها ذي الطول 1 لتصيرا (3,2) ثم تُجمعان. في الكتاب: `torch.arange(12)` وreshape وtorch.cat تقول الشيء نفسه على نطاق أكبر.',
          en: 'A tensor is numbers arranged in a grid, and a nested Python list is enough to understand one: a flat list is a vector (1 axis), a list of equal-length lists is a matrix (2 axes), and deeper nesting adds axes. Three numbers describe it: shape (length along each axis), ndim (number of axes), and numel (total elements). Elementwise operations apply a scalar rule to every aligned pair: adding two same-shape matrices adds every pair, and a == comparison yields a True/False mask. Broadcasting handles differing shapes: a (3,1) matrix plus a (1,2) row first copies each along its length-1 axis so both become (3,2), then adds. In the book: `torch.arange(12)`, reshape and torch.cat say the same thing at larger scale.',
        },
        {
          ar: 'البيانات الحقيقية تصل فوضوية، والقيم الناقصة حشراتها الدائمة. قاعدتان معياريتان: في العمود الرقمي نستبدل كل فراغ بمتوسط العمود المحسوب من القيم المعلومة وحدها (imputation)؛ وفي العمود الفئوي مثل RoofType نعامل علامة الفقد كأنها فئة قائمة بذاتها، فنقسم العمود إلى أعمدة مؤشرات (Slate من عدمه، ومفقود من عدمه). بعد الترميز والملء يصبح الجدول كله أرقامًا ويمكن تحميله في موتر جاهز للنموذج. الكتاب ينفذ ذلك عبر pandas: `read_csv` ثم fillna ثم get_dummies — ومثالنا المُشغَّل يسير المسار نفسه على جدول من أربعة صفوف.',
          en: 'Real data arrives messy, and missing values are its bedbugs. Two standard heuristics: for a numerical column, impute — replace each gap with the column mean computed over the known entries only; for a categorical column like RoofType, treat the missing mark as its own category and split the column into indicator columns (Slate or not, missing or not). After encoding and imputing, the whole table is numeric and can be loaded into a tensor that is ready for a model. The book does this with pandas: `read_csv`, then fillna, then get_dummies — our runnable example walks the same path on a four-row table.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'أدوات موتر مصغرة + تقرير ملء الفراغات',
        en: 'A mini tensor toolkit + an impute report',
      },
      code: "def shape(t):\n    s = []\n    row = t\n    while isinstance(row, list):\n        s.append(len(row))\n        row = row[0]\n    return tuple(s)\n\nX = [[0.0, 1.0, 2.0, 3.0],\n     [4.0, 5.0, 6.0, 7.0],\n     [8.0, 9.0, 10.0, 11.0]]\nY = [[2.0, 1.0, 4.0, 3.0],\n     [1.0, 2.0, 3.0, 4.0],\n     [4.0, 3.0, 2.0, 1.0]]\n\nprint('shape:', shape(X), '| ndim:', len(shape(X)), '| numel:', len(X) * len(X[0]))\n\nadded = [[X[i][j] + Y[i][j] for j in range(4)] for i in range(3)]\nprint('X+Y row0:', added[0])\nprint('X==Y row0:', [X[0][j] == Y[0][j] for j in range(4)])\n\nA = [[0.0], [1.0], [2.0]]\nb = [0.0, 1.0]\nbc = [[A[i][0] + b[j] for j in range(2)] for i in range(3)]\nprint('broadcast (3,1)+(1,2) ->', shape(bc), ':', bc)\n\nrooms = [None, 2.0, 4.0, None]\nprice = [127500.0, 106000.0, 178100.0, 140000.0]\nknown = [r for r in rooms if r is not None]\nmean_rooms = sum(known) / len(known)\nfilled = [r if r is not None else mean_rooms for r in rooms]\nprint('missing rooms: %d/4 | mean=%.1f | filled:' % (4 - len(known), mean_rooms), filled)",
      explanation: {
        ar: 'الدالة shape تنزل عبر التداخل فتقرأ الطول على كل محور: (3, 4) لمصفوفتنا، محوران، 12 عنصرًا. الجمع عنصر-بعنصر أعطى الصف الأول [2.0, 2.0, 6.0, 6.0]، وقناع == التقى مرة واحدة فقط (القيمة 1.0). البث ولّد مصفوفة (3, 2) من (3,1)+(1,2). أما الجزء الثاني فهو تنظيف مصغر: عمود NumRooms فيه فراغان من 4، والمتوسط المحسوب من المعروفين (2+4)/2 = 3.0 يملأ الفراغين — وهو بالضبط ما تفعله fillna(inputs.mean()) في الكتاب قبل تحويل الجدول إلى موتر.',
        en: 'The shape function walks down the nesting and reads the length along each axis: (3, 4), two axes, 12 elements. Elementwise addition gave row0 [2.0, 2.0, 6.0, 6.0], and the == mask matched exactly once (the value 1.0). Broadcasting produced a (3, 2) matrix from (3,1)+(1,2). The second half is cleaning in miniature: NumRooms has 2 gaps out of 4, and the mean of the known entries (2+4)/2 = 3.0 fills both — exactly what fillna(inputs.mean()) does in the book before the table becomes a tensor.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.broadcast-and-impute',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين: broadcast_add(A, row) تجمع مصفوفة شكلها (n,1) مع صف شكله (m,) بالبث وتعيد (n,m)؛ وmean_impute(col) تملأ كل None في العمود بمتوسط القيم المعلومة (ولا تغير شيئًا إن لم يوجد فراغ).',
        en: 'Implement two functions: broadcast_add(A, row) adds an (n,1) matrix to a row of shape (m,) via broadcasting and returns (n,m); and mean_impute(col) fills every None in a column with the mean of the known values (changing nothing when there are no gaps).',
      },
      starterCode: "def broadcast_add(A, row):\n    ...  # TODO: [[A[i][0] + row[j] for j in ...] for i in ...]\n\ndef mean_impute(col):\n    ...  # TODO: mean of the not-None values, then fill the gaps\n",
      solution: "def broadcast_add(A, row):\n    return [[A[i][0] + row[j] for j in range(len(row))] for i in range(len(A))]\n\ndef mean_impute(col):\n    known = [v for v in col if v is not None]\n    m = sum(known) / len(known)\n    return [v if v is not None else m for v in col]",
      tests: [
        {
          id: 't1',
          name: { ar: 'البث (3,1)+(1,2) يعطي (3,2)', en: 'Broadcasting (3,1)+(1,2) yields (3,2)' },
          code: "got = broadcast_add([[0.0], [1.0], [2.0]], [0.0, 1.0])\nflat = [v for r in got for v in r]\nwant = [0.0, 1.0, 1.0, 2.0, 2.0, 3.0]\nassert len(flat) == 6 and all(abs(flat[k] - want[k]) < 1e-9 for k in range(6)), 'expected [[0,1],[1,2],[2,3]] | actual: %r' % got",
          expected: '[[0.0, 1.0], [1.0, 2.0], [2.0, 3.0]]',
        },
        {
          id: 't2',
          name: { ar: 'الملء بالمتوسط يعوض الفراغين', en: 'Mean imputation fills both gaps' },
          code: "assert mean_impute([None, 2.0, 4.0, None]) == [3.0, 2.0, 4.0, 3.0], 'expected [3.0, 2.0, 4.0, 3.0] | actual: %r' % mean_impute([None, 2.0, 4.0, None])",
          expected: '[3.0, 2.0, 4.0, 3.0]',
        },
        {
          id: 't3',
          name: { ar: 'لا فراغات means لا تغيير', en: 'No gaps means no change' },
          code: "assert mean_impute([5.0, None]) == [5.0, 5.0] and mean_impute([1.0, 2.0]) == [1.0, 2.0], 'expected only the gaps to be filled'",
          expected: 'gaps filled, values kept',
        },
      ],
      hints: [
        { ar: 'البث: الناتج n×m — العنصر (i, j) هو A[i][0] + row[j]؛ فكّر في حلقة داخل حلقة أو قائمة داخل قائمة.', en: 'Broadcasting: the result is n×m — entry (i, j) is A[i][0] + row[j]; think of one loop inside another, or a list comprehension per row.' },
        { ar: 'الملء: اعزل المعروف أولًا known = [v for v in col if v is not None] ثم m = sum(known) / len(known).', en: 'Imputing: first isolate the known values known = [v for v in col if v is not None], then m = sum(known) / len(known).' },
        { ar: 'قيم تحقق: broadcast_add([[0.0],[1.0],[2.0]], [0.0, 1.0]) = [[0.0, 1.0], [1.0, 2.0], [2.0, 3.0]] وmean_impute([None, 2.0, 4.0, None]) = [3.0, 2.0, 4.0, 3.0].', en: 'Sanity values: broadcast_add([[0.0],[1.0],[2.0]], [0.0, 1.0]) = [[0.0, 1.0], [1.0, 2.0], [2.0, 3.0]] and mean_impute([None, 2.0, 4.0, None]) = [3.0, 2.0, 4.0, 3.0].' },
        { ar: 'في mean_impute أعِد [v if v is not None else m for v in col] حتى تبقى القيم المعلومة كما هي تمامًا.', en: 'In mean_impute return [v if v is not None else m for v in col] so the known values stay untouched.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-broadcast-shape',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أضفنا مصفوفة شكلها (3,1) إلى صف شكله (1,2) باستخدام البث broadcasting. ما شكل الناتج؟',
        en: 'We add a matrix of shape (3,1) to a row of shape (1,2) using broadcasting. What is the shape of the result?',
      },
      options: [
        { id: 'a', text: { ar: '(3,1) — يغلب شكل المصفوفة', en: '(3,1) — the matrix shape wins' } },
        { id: 'b', text: { ar: '(3,2) — كل طرف يُنسخ على محوره الأحادي', en: '(3,2) — each side is copied along its length-1 axis' } },
        { id: 'c', text: { ar: 'خطأ — الأشكال المختلفة لا تُجمع أبدًا', en: 'An error — different shapes can never be added' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'قاعدة البث من خطوتين: انسخ على المحاور ذات الطول 1 حتى يتساوى الشكلان، ثم نفّذ العملية عنصر-بعنصر.', en: 'Broadcasting is a two-step rule: copy along length-1 axes until shapes match, then run the elementwise operation.' },
        { ar: '(3,1) تتمدد إلى (3,2) بتكرار عمودها، و(1,2) تتمدد إلى (3,2) بتكرار صفها الوحيد.', en: '(3,1) stretches to (3,2) by repeating its column; (1,2) stretches to (3,2) by repeating its single row.' },
        { ar: 'الجمع بعدها عادي: العنصر (i, j) هو A[i][0] + b[j].', en: 'The addition is then ordinary: entry (i, j) is A[i][0] + b[j].' },
        { ar: 'الجواب: b — هذه بالضبط مصفوفة [[0,1],[1,2],[2,3]] من المثال المُشغَّل.', en: 'Answer: b — exactly the [[0,1],[1,2],[2,3]] matrix from the runnable example.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "X = [[0.0, 1.0, 2.0, 3.0],\n     [4.0, 5.0, 6.0, 7.0],\n     [8.0, 9.0, 10.0, 11.0]]\n\ndef col_means(M):\n    n = len(M)\n    m = len(M[0])\n    return [sum(M[i][j] for i in range(n)) / n for j in range(m)]\n\nprint('X sum:', sum(sum(r) for r in X))\nprint('col means:', col_means(X))\n\nroof = ['nan', 'nan', 'Slate', 'nan']\nencoded = [[1.0, 0.0] if r == 'Slate' else [0.0, 1.0] for r in roof]\nprint('roof encoded:', encoded)\n\n# جرّب: اطرح col_means(X) من كل صف لممركزة الجدول (بيانات متمركزة كما في فصول الانحدار).\n# try: subtract col_means(X) from every row to center the table (like the regression chapters).\n# جرّب: ابنِ قناع X == Y لمصفوفة Y ثابتة وعدّ قيم True.\n# try: build an X == Y mask against a constant matrix and count the True entries.\n",
      prompt: {
        ar: 'الملعب يجمع عمليات الأعمدة والترميز الفئوي: جموع ووسطيات، وترميز أعمدة مؤشرات لعمود سقف فيه فقد. وسّعه بتمركزة الأعمدة وبناء أقنعة مقارنة.',
        en: 'The sandbox pairs column operations with categorical encoding: sums and means, plus indicator columns for a roof column with missing marks. Extend it by centering columns and building comparison masks.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'قائمة من 3 قوائم، كل قائمة طولها 4 — ما نوعها وما shape الخاص بها؟',
            en: 'A list of 3 lists, each of length 4 — what is it and what is its shape?',
          },
          options: [
            { id: 'a', text: { ar: 'متجه من 12 عنصرًا، shape (12,)', en: 'A 12-element vector, shape (12,)' } },
            { id: 'b', text: { ar: 'مصفوفة من محورين، shape (3, 4)', en: 'A 2-axis matrix, shape (3, 4)' } },
            { id: 'c', text: { ar: 'موتر من ثلاثة محاور، shape (3, 4, 1)', en: 'A 3-axis tensor, shape (3, 4, 1)' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'محور لكل مستوى تداخل: المحور الخارجي طوله 3 والداخلي 4 — مصفوفة 3×4 وnumel = 12. المتجه قائمة مسطحة، والمحور الثالث يتطلب تداخلًا إضافيًا.',
            en: 'One axis per nesting level: the outer axis has length 3 and the inner 4 — a 3×4 matrix with numel = 12. A vector is a flat list; a third axis would need another nesting level.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'عمود عدد الغرف قيمته [None, 2, 4, None]. ماذا تفعل بقاعدة ملء المتوسط؟',
            en: 'A room-count column holds [None, 2, 4, None]. What does the mean-imputation rule do?',
          },
          options: [
            { id: 'a', text: { ar: 'تحذف الصفوف الناقصة كلها', en: 'It deletes the rows containing gaps' } },
            { id: 'b', text: { ar: 'تملأ الفراغين بالقيمة 3.0 (متوسط المعروف)', en: 'It fills both gaps with 3.0 (the mean of the known values)' } },
            { id: 'c', text: { ar: 'تملأ الفراغين بصفر', en: 'It fills both gaps with zero' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المتوسط يُحسب من المعروفين فقط: (2+4)/2 = 3.0 فيصبح العمود [3.0, 2.0, 4.0, 3.0]. الحذف خيار قانوني لكنه يهدر صفوفًا كاملة، والصفر يشوه العمود.',
            en: 'The mean is computed from the known entries only: (2+4)/2 = 3.0, giving [3.0, 2.0, 4.0, 3.0]. Deletion is a legal alternative but wastes whole rows; zero would distort the column.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'عمود فئوي قيمه Slate أو مفقود — كيف يتعامل معه الكتاب قبل التحويل إلى موتر؟',
            en: 'A categorical column holds Slate or missing — how does the book handle it before tensor conversion?',
          },
          options: [
            { id: 'a', text: { ar: 'يعامل المفقود كفئة قائمة بذاتها وينشئ عمودي مؤشرات', en: 'It treats missing as its own category and creates indicator columns' } },
            { id: 'b', text: { ar: 'يستبدل كل شيء بالمتوسط', en: 'It replaces everything with the mean' } },
            { id: 'c', text: { ar: 'يحذف العمود كله', en: 'It drops the whole column' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مع get_dummies(dummy_na=True) ينقسم العمود إلى RoofType_Slate وRoofType_nan: صف Slate يحصل 1/0 والمفقود 0/1. الأعمدة الفئوية لا وسطية لها — الفئة هي وحدة المعالجة.',
            en: 'With get_dummies(dummy_na=True) the column splits into RoofType_Slate and RoofType_nan: a Slate row gets 1/0 and a missing row 0/1. Categorical columns have no mean — the category is the unit of processing.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الموتّرات قوائم متداخلة: shape يقرأ الطول على كل محور وndim عدد المحاور وnumel مجموع العناصر؛ العمليات عنصر-بعنصر والبث يحل اختلاف الأشكال بنسخ المحاور الأحادية (الهدف من s1 معالجة البيانات).', en: 'Tensors are nested lists: shape reads the length per axis, ndim counts axes, numel totals elements; elementwise ops pair aligned entries and broadcasting resolves shape clashes by copying length-1 axes (goal of s1 Data Manipulation).' },
        { ar: 'التنظيف قبل النمذجة: الرقمي يُملأ بمتوسط العمود من القيم المعلومة، والفئوي يُرمَّز بأعمدة مؤشرات مع اعتبار الفقد فئة (الهدف من s2 معالجة البيانات المسبقة).', en: 'Clean before modeling: numeric gaps get the column mean over known values, categorical columns become indicator columns with missing as its own category (goal of s2 Data Preprocessing).' },
        { ar: 'المسار كامل من CSV إلى موتر: اقرأ، افصل المدخلات عن الهدف، رمّز واملأ، ثم حوّل إلى مصفوفة رقمية — خطوات الكتاب نفسها بقوائم بايثون صرفة.', en: 'The full path from CSV to tensor: read, split inputs from target, encode and impute, then convert to a numeric matrix — the book\u2019s very steps in plain Python lists.' },
      ],
      reflectPrompt: {
        ar: 'جدولك القادم فيه 30% قيم ناقصة في عمود رقمي و80% في عمود فئوي. أيهما تحذف وأيهما تملأ، وما الخطر الذي يفرض عليك القرار قبل رؤية أي نموذج؟',
        en: 'Your next table has 30% missing values in a numeric column and 80% in a categorical one. Which do you drop and which do you impute — and what risk forces that call before you ever see a model?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch2.s1' },
        { book: 'D2L', section: 'd2l.ch2.s2' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch2.s1' },
    { book: 'D2L', section: 'd2l.ch2.s2' },
  ],
} satisfies Lesson;

export default lesson;
