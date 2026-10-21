import type { Lesson } from '@/lib/content/schema';

/**
 * mls.appendix.l3 — "The Book's Datasets"
 * مجموعات بيانات الكتاب
 * Aligned with the book's appendix (Datasets: Boston, Breast Cancer, Penguins,
 * Tips, Wine). Each dataset is described in our own words with a tiny 4-5 row
 * illustrative literal sample; runnable summary stats (mean/range) plus a
 * train-vs-report snippet. Pure Python, all values verified under CPython 3.
 */
const lesson = {
  id: 'mls.appendix.l3',
  version: 1,
  part: 'II',
  track: 'A0',
  book: 'MLS',
  chapter: 8,
  title: {
    ar: 'مجموعات بيانات الكتاب',
    en: 'The Book\u2019s Datasets',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.appendix.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'يتعثر كثير من المبتدئين لا في الخوارزمية بل في البيانات: أي مهمة تناسب هذه الأعمدة؟ ما معنى هذا الهدف؟ يختم الكتاب ملحقه بوصف خمس مجموعات سيعود إليها في كل فصل: بوسطن للانحدار، وسرطان الثدي للتصنيف الثنائي، والبطاريق والنبيذ للتصنيف، والإكراميات لانحدار الأشجار. سنمثل كل مجموعة بصفوف حرفية صغيرة، ونستخرج إحصاءاتها، ونتدرب على عادة "درّب ثم بلّغ" الأخيرة قبل فصل الشبكات القادم.',
        en: 'Beginners stumble over data more often than over algorithms: which task fits these columns? What does that target mean? The book closes its appendix by describing five datasets that return in every chapter: Boston for regression, breast cancer for binary classification, penguins and wine for classification, tips for tree-based regression. We model each with small literal rows, extract their stats, and rehearse the "train then report" habit ahead of the networks chapter.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خمس مجموعات، خمس مهام', en: 'Five datasets, five tasks' },
      chunks: [
        {
          ar: 'بوسطن: 506 حيًا في بوسطن، والهدف قيمة المساكن الوسيطة — كمية تقريبًا (يلاحظ الكتاب أنها مقيّدة عند 50 ألف دولار) — فالمهمة انحدار، والمتنبئات كلها رقمية كالغرف ومعدل الجريمة. سرطان الثدي: 569 عينة خلايا، والهدف حميد أم خبيث — تصنيف ثنائي بمقاييس رقمية كنصف القطر والتقعر. البطاريق: 344 بطريقًا من ثلاثة أنواع (Adelie وGentoo وChinstrap)، والهدف النوع — تصنيف متعدد الفئات بمتنبئات مختلطة رقمية (طول الزعنفة، الكتلة) وفئوية (الجزيرة)، ولهذا يستعمله الكتاب في نماذج الأشجار. الإكراميات: 244 فاتورة مطعم من عام 1990، والهدف مبلغ البقشيش بالدولار — انحدار بمتنبئات مختلطة (الفاتورة، حجم المائدة، اليوم)، فاستعمله الكتاب في انحدار الأشجار. النبيذ: 178 نبيذًا من ثلاث فئات بتحليل كيميائي رقمي بالكامل — تصنيف.',
          en: 'Boston: 506 Boston neighborhoods, target = median home value — roughly continuous (the book notes it is censored at $50,000) — so a regression task with all-numeric predictors like room count and crime rate. Breast cancer: 569 cell samples, target = malignant or benign — binary classification with numeric measures such as radius and concavity. Penguins: 344 penguins across three species (Adelie, Gentoo, Chinstrap), target = species — multi-class classification with mixed numeric (flipper length, body mass) and categorical (island) predictors, which is why the book saves it for tree models. Tips: 244 restaurant bills from 1990, target = the tip in dollars — regression with mixed predictors (total bill, party size, day of week), used by the book for tree-based regression. Wine: 178 wines in three classes from an all-numeric chemical analysis — classification.',
        },
        {
          ar: 'صندوق الرمل هنا لا ينزّل مجموعات sklearn أو seaborn — فهي غير متاحة في الكود القابل للتشغيل، وأسماء المكتبات تظهر في النثر فقط. بدلها نضمن عينات حرفية صغيرة من 5 صفوف لكل مجموعة تحمل شكل الأعمدة ومعناها. وقبل أي نمذجة عادة واحدة: إحصاءات موجزة — المتوسط يخبرك بمركز العمود والمدى (الأدنى إلى الأقصى) يخبرك بمقياسه وانتشاره ويكشف شذوذ الوحدات. ثم تمرين "درّب ثم بلّغ": أبسط نموذج يُدرَّب على صفوف التدريب ويُقيَّم خطؤه على صفوف محجوبة — هو التحقق المتقاطع الذي تعلمته في الدرس السابق مصغرًا إلى خطوة واحدة، وهو نفسه معيار الحكم الذي سنستخدمه على توقعات الشبكات.',
          en: 'This sandbox does not download sklearn or seaborn datasets — they are unavailable to runnable code, and library names stay inside prose. Instead we embed tiny 5-row literal samples per dataset carrying the columns\u2019 shape and meaning. Before any modeling, one habit: summary statistics — the mean tells you a column\u2019s center, and the range (min to max) tells you its scale and spread, exposing unit surprises. Then the "train then report" drill: fit the simplest model on training rows and report its error on held-out rows — the cross validation you learned last lesson shrunk to one step, and the same judging standard we will apply to network predictions.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'إحصاءات موجزة لخمس عينات، ثم تدريب مقابل تقرير', en: 'Summary stats for five samples, then train-vs-report' },
      code: "DATASETS = {\n    'boston': {\n        'task': 'regression',\n        'cols': ['rooms', 'age', 'medv'],\n        'rows': [[5.8, 65.2, 21.6], [6.4, 78.9, 24.5], [7.1, 61.5, 32.9], [4.9, 90.3, 18.2], [6.9, 55.8, 28.7]],\n    },\n    'cancer': {\n        'task': 'binary classification',\n        'cols': ['radius', 'concavity', 'label'],\n        'rows': [[13.5, 0.08, 1], [16.2, 0.19, 0], [11.9, 0.03, 1], [20.1, 0.34, 0], [14.3, 0.11, 1]],\n    },\n    'penguins': {\n        'task': 'multi-class (3 species)',\n        'cols': ['flipper_mm', 'mass_g', 'species'],\n        'rows': [[181.0, 3750.0, 0.0], [195.0, 4400.0, 1.0], [210.0, 5100.0, 1.0], [198.0, 4300.0, 0.0], [203.0, 4750.0, 2.0]],\n    },\n    'tips': {\n        'task': 'regression (tree-friendly)',\n        'cols': ['total_bill', 'party', 'tip'],\n        'rows': [[16.99, 2.0, 1.01], [10.34, 3.0, 1.66], [21.01, 3.0, 3.5], [23.68, 2.0, 3.31], [24.59, 4.0, 4.0]],\n    },\n    'wine': {\n        'task': 'classification (3 classes)',\n        'cols': ['alcohol', 'flavanoids', 'class'],\n        'rows': [[14.23, 3.06, 0.0], [13.2, 2.76, 0.0], [13.16, 3.24, 1.0], [14.34, 3.74, 2.0], [12.93, 3.32, 1.0]],\n    },\n}\nSTAT_COL = {'boston': 2, 'cancer': 0, 'penguins': 1, 'tips': 2, 'wine': 0}\n\ndef stats(vals):\n    return len(vals), sum(vals) / len(vals), min(vals), max(vals)\n\nprint('dataset   task                          col        mean      range')\nfor name, d in DATASETS.items():\n    vals = [row[STAT_COL[name]] for row in d['rows']]\n    n, m, lo, hi = stats(vals)\n    print('%-9s %-29s %-10s %8.3f  [%.2f, %.2f]' % (name, d['task'], d['cols'][STAT_COL[name]], m, lo, hi))\n\n# train-vs-report drill on tips: fit the mean tip on the first 3 rows,\n# report the MSE on the last 2 held-out rows.\ntips = [row[2] for row in DATASETS['tips']['rows']]\ntrain, report = tips[:3], tips[3:]\npred = sum(train) / len(train)\nrep_mse = sum((v - pred) ** 2 for v in report) / len(report)\nprint('tips mean-model: train mean=%.6f  report rows=%s  report mse=%.6f' % (pred, report, rep_mse))",
      explanation: {
        ar: 'جدول الإحصاءات يقرأ البيانات قبل أي نمذجة: medv في بوسطن متوسطها 25.180 بمدى [18.20, 32.90]؛ نصف القطر في سرطان الثدي متوسطه 15.200 ويمتد [11.90, 20.10]؛ كتلة البطاريق 4460.000 — لاحظ المقياس الآلاف مقارنة بأعمدة الآخرين، وهي أول ما يهم عند التقريب؛ البقشيش 2.696 بمدى [1.01, 4.00]؛ والكحول في النبيذ 13.572. ثم تمرين درّب-ثم-بلّغ على الإكراميات: متوسط أول ثلاث فواتير (تدريب) يساوي 2.056667، وتوقعه للصفين المحجوبين (3.31 و4.00) يخطئ بخسارة MSE تساوي 2.673694 — رقم تقرير صادق لأن الصفين لم يشاركا في الحساب، وهو نفس مقياس الطية المحجوبة في الدرس السابق.',
        en: 'The stats table reads the data before any modeling: Boston medv averages 25.180 across [18.20, 32.90]; cancer radius averages 15.200 spanning [11.90, 20.10]; penguin mass 4460.000 — note the thousands-scale against everyone else\u2019s columns, the first thing scaling decisions must respect; tips 2.696 over [1.01, 4.00]; wine alcohol 13.572. Then the train-vs-report drill on tips: the mean of the first three bills (training) is 2.056667, and predicting the two held-out rows (3.31 and 4.00) misses with report MSE 2.673694 — an honest number because those rows took no part in the fit, the same held-out-fold metric from last lesson in miniature.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.stats-fns',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين الإحصاء الأساسيتين: mean(vals) تعيد متوسط قائمة أرقام، وvalue_range(vals) تعيد المدى أي max(vals) - min(vals). ثم استخدمهما على عمود medv المعطى من عينة بوسطن. الدالتان تعيدان عددًا عائمًا ولا تطبعان شيئًا.',
        en: 'Implement the two baseline statistics: mean(vals) returning the average of a list of numbers, and value_range(vals) returning the range, i.e. max(vals) - min(vals). Then apply them to the given medv column from the Boston sample. Both return a float and print nothing.',
      },
      starterCode: "medv = [21.6, 24.5, 32.9, 18.2, 28.7]\n\ndef mean(vals):\n    ...  # TODO: sum(vals) / len(vals)\n\ndef value_range(vals):\n    ...  # TODO: max(vals) - min(vals)\n",
      solution: "medv = [21.6, 24.5, 32.9, 18.2, 28.7]\n\ndef mean(vals):\n    return sum(vals) / len(vals)\n\ndef value_range(vals):\n    return max(vals) - min(vals)",
      tests: [
        {
          id: 't1',
          name: { ar: 'متوسط بسيط صحيح', en: 'Simple mean is correct' },
          code: "assert abs(mean([2.0, 4.0, 6.0]) - 4.0) < 1e-9, 'expected 4.0 | actual: %r' % mean([2.0, 4.0, 6.0])",
          expected: '4.0',
        },
        {
          id: 't2',
          name: { ar: 'المدى بسيط صحيح', en: 'Simple range is correct' },
          code: "assert abs(value_range([3.5, 1.2, 9.8, 4.0]) - 8.6) < 1e-9, 'expected 8.6 | actual: %r' % value_range([3.5, 1.2, 9.8, 4.0])",
          expected: '8.6',
        },
        {
          id: 't3',
          name: { ar: 'على عمود بوسطن: متوسط 25.18 ومدى 14.7', en: 'On the Boston column: mean 25.18, range 14.7' },
          code: "assert abs(mean(medv) - 25.18) < 1e-9, 'expected 25.18 | actual: %r' % mean(medv)\nassert abs(value_range(medv) - 14.7) < 1e-9, 'expected 14.7 | actual: %r' % value_range(medv)",
          expected: 'mean == 25.18, range == 14.7',
        },
      ],
      hints: [
        { ar: 'المتوسط سطر واحد: sum(vals) / len(vals) — ولا تنسَ القسمة على العدد لا على 100.', en: 'The mean is one line: sum(vals) / len(vals) — divide by the count, nothing else.' },
        { ar: 'المدى = القيمة القصوى ناقص الصغرى: max(vals) - min(vals) — دالتا بايثون المدمجتان تكفيان.', en: 'Range = max minus min: max(vals) - min(vals) — the two built-ins are all you need.' },
        { ar: 'الترتيب لا يهم في أيٍّ من الدالتين: sum وmax وmin تعمل على أي ترتيب للقائمة.', en: 'Order is irrelevant in both: sum, max and min handle any arrangement of the list.' },
        { ar: 'قيم تحقق على medv: المجموع 125.9 فالمتوسط 25.18، والقصوى 32.9 والصغرى 18.2 فالمدى 14.7.', en: 'Sanity values on medv: the sum is 125.9 so the mean is 25.18; max 32.9 minus min 18.2 gives the range 14.7.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.dataset-match',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'تحتاج مجموعة بيانات لمهمة تصنيف ثنائي بهدف فئتين فقط. أي مجموعة من مجموعات الكتاب تختار، ولماذا؟',
        en: 'You need a dataset for a binary classification task with exactly two target classes. Which of the book\u2019s datasets do you pick, and why?',
      },
      options: [
        { id: 'a', text: { ar: 'بوسطن — لأن أهدافها أعداد كبيرة', en: 'Boston — because its targets are large numbers' } },
        { id: 'b', text: { ar: 'سرطان الثدي — لأن هدفها فئتان: خبيث أو حميد', en: 'Breast cancer — because its target has two classes: malignant or benign' } },
        { id: 'c', text: { ar: 'النبيذ — لأنه يحتوي قياسات كيميائية دقيقة', en: 'Wine — because it holds precise chemical measurements' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'التصنيف الثنائي يعني هدفًا بقيمتين ممكنتين فقط — عدّ الفئات في هدف كل مجموعة.', en: 'Binary classification means a target with exactly two possible values — count the classes in each dataset\u2019s target.' },
        { ar: 'بوسطن هدفها قيمة وسيطة للمساكن: كمية متصلة تقريبًا — هذه مهمة انحدار لا تصنيف.', en: 'Boston\u2019s target is a median home value: nearly continuous — a regression task, not classification.' },
        { ar: 'النبيذ مفيد جدًا لكنه ثلاث فئات (178 نبيذًا في ثلاث أصناف) — تصنيف متعدد لا ثنائي.', en: 'Wine is useful but three-class (178 wines in three groups) — multi-class, not binary.' },
        { ar: 'الجواب: b — سرطان الثدي: 569 عينة والهدف حميد/خبيث.', en: 'Answer: b — breast cancer: 569 samples, target malignant/benign.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يستخدم الكتاب نماذج الأشجار خصيصًا مع مجموعتي البطاريق والإكراميات؟',
            en: 'Why does the book reach for tree models specifically with the penguins and tips datasets?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن صفوفهما كثيرة جدًا', en: 'Because they have very many rows' } },
            { id: 'b', text: { ar: 'لأن متنبئاتهما مختلطة رقمية وفئوية (كالجزيرة واليوم)، والأشجار تتعامل مع الفئات طبيعيًا', en: 'Because their predictors mix numeric and categorical values (island, day of week), and trees handle categories naturally' } },
            { id: 'c', text: { ar: 'لأن أهدافهما رقمية دائمًا فيتحتم الأشجار', en: 'Because their targets are always numeric, forcing trees' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'النماذج الخطية والشبكات تريد مدخلات رقمية، فالفئات تحتاج ترميزًا إضافيًا (متغيرات دمية كما يقول الكتاب). الأشجار تفرّع على الفئات مباشرة — لذلك رشحها الكتاب للبطاريق (جزيرة) والإكراميات (يوم الأسبوع).',
            en: 'Linear models and networks want numeric inputs, so categories would need extra encoding (dummy variables, as the book mentions). Trees branch directly on categories — hence the book\u2019s pick for penguins (island) and tips (day of week).',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الذي يكشفه المدى [min, max] لعمود قبل النمذجة؟',
            en: 'What does the [min, max] range of a column reveal before modeling?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد الفئات الممكنة في الهدف', en: 'The number of possible target classes' } },
            { id: 'b', text: { ar: 'مقياس العمود وانتشاره — مثل كتلة البطاريق بالآلاف مقابل نصف القطر بالعشرات', en: 'The column\u2019s scale and spread — penguin mass in the thousands vs radius in the tens' } },
            { id: 'c', text: { ar: 'مدى ملاءمة الانحدار الخطي تحديدًا', en: 'Whether linear regression specifically will fit well' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المدى يكشف وحدات العمود ومقياسه — كتلة 3750..5100 غرام لا تقارن مباشرة بنصف قطر 11.9..20.1 ملم. هذا أول ما تفعله خطوات التقريب وضبط المقياس لاحقًا، ومتوسط وحده لا يكفي.',
            en: 'The range exposes a column\u2019s units and scale — mass 3750..5100 g cannot be compared directly with radius 11.9..20.1 mm. That is exactly what later scaling steps react to, and the mean alone never shows it.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في تمرين درّب-ثم-بلّغ على الإكراميات، لماذا نحسب خطأ التقرير على الصفين الأخيرين بدل الصفوف الثلاثة التي متوسّناها؟',
            en: 'In the tips train-vs-report drill, why compute the report error on the last two rows rather than the three rows we averaged?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن المتوسط دائمًا يخطئ في صفوف تدريبه صفرًا تقريبًا، فقياسه عليها يعطي رقمًا متفائلًا بلا معنى تعميمي', en: 'A mean model fits its own training rows nearly by construction, so scoring on them yields an optimistic number with no generalization meaning' } },
            { id: 'b', text: { ar: 'لأن الصفين الأخيرين أكبر قيمةً فالخطأ أوضح', en: 'Because the last two rows are larger values, making the error clearer' } },
            { id: 'c', text: { ar: 'لأن حساب MSE على صفوف التدريب ممنوع رياضيًا', en: 'Because computing MSE on training rows is mathematically forbidden' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نموذج المتوسط يضبط نفسه على صفوف تدريبه، وأي قياس عليها يقيس الحفظ لا الفهم — نفس منطق الطية المحجوبة في التحقق المتقاطع. التقرير على صفوف لم ترها يعطي تقديرًا لما سيحدث مع البيانات الجديدة.',
            en: 'The mean model is built from its training rows; scoring there measures memorization, not understanding — the same logic as the held-out fold in cross validation. Reporting on unseen rows estimates what happens with genuinely new data.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'خمس مجموعات يتكرر ذكرها في الكتاب: بوسطن (انحدار، هدف شبه متصل)، وسرطان الثدي (تصنيف ثنائي)، والبطاريق (ثلاثة أنواع، تنبئات مختلطة → أشجار)، والإكراميات (انحدار بمتنبئات فئوية → أشجار)، والنبيذ (ثلاث فئات، كل الأعمدة رقمية).', en: 'Five recurring datasets: Boston (regression, near-continuous target), breast cancer (binary classification), penguins (three species, mixed predictors → trees), tips (regression with categorical predictors → trees), wine (three classes, all-numeric columns).' },
        { ar: 'المهمة تُقرأ من الهدف لا من الأعمدة: هدف كمي = انحدار، وهدف فئوي = تصنيف، وعدد الفئات يحدد ثنائي أو متعدد. والمتنبئات الفئوية هي ما يدفع نحو الأشجار.', en: 'The task is read from the target, not the columns: numeric target = regression, categorical target = classification, and the class count decides binary vs multi-class. Categorical predictors are what push toward trees.' },
        { ar: 'عادة البيانات في صندوق الرمل: عينة حرفية صغيرة، إحصاءات موجزة (متوسط ومدى: 25.180 و[18.20, 32.90] لـ medv)، ثم درّب-ثم-بلّغ: متوسط تدريب 2.056667 أعطى خطأ تقرير 2.673694 على صفين محجوبين — التحقق المتقاطع في خطوة واحدة.', en: 'The sandbox data habit: a tiny literal sample, summary stats (mean and range: 25.180 over [18.20, 32.90] for medv), then train-vs-report: a 2.056667 training mean scored 2.673694 report MSE on two held-out rows — cross validation in one step.' },
      ],
      reflectPrompt: {
        ar: 'عيناتنا الحرفية خمسة صفوف لكل مجموعة بينما الحقيقية مئات. أي قرارات النمذجة يمكنك اتخاذها من إحصاءات عينة صغيرة بثقة، وأيها ستحتاج البيانات الكاملة حتمًا؟',
        en: 'Our literal samples hold five rows each while the real sets hold hundreds. Which modeling decisions can you trust from a small sample\u2019s stats, and which will unavoidably need the full data?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.A.s3' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.A.s3' },
  ],
} satisfies Lesson;

export default lesson;
