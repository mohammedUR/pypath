import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch8.l6 — "Chapter 8 Review and Project: Word Organizer /
 * مراجعة الفصل 8 ومشروع: منظّم الكلمات"
 * Aligned with PY4E ch8 s14 (التنقيح), s15 (فهرس المصطلحات), s16 (تمارين).
 * All expression is original.
 * Project: a fixed sentence is split, punctuation-stripped, lowercased, sorted,
 * then unique words are counted with the in-check pattern and a %-formatted
 * report is printed (ties ch6 format operator + ch5 loops + ch8 lists).
 */
const lesson = {
  id: 'py4e.ch8.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 8,
  title: { ar: 'مراجعة الفصل 8 ومشروع: منظّم الكلمات', en: 'Chapter 8 Review and Project: Word Organizer' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch8.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أقفل الفصل الثامن على خريطته كاملة: قوائم تُنشأ وتُفهرس وتُعدّل، ومرور يقرأ ويحدّث، وتوابع تلحق وترتب وتحذف، وسلاسل تنقسم إلى كلمات، وإحالات تتسرب التعديلات عبرها. ثم مشروعك القادم: منظّم كلمات يستقبل جملة ثابتة، ينظّف كلماتها، يرتبها، ويعدّ الفريدة منها في تقرير بعامل التنسيق. بنهاية الدرس ستكون قادرًا على: تركيب أنماط القوائم في برنامج واحد، وتشخيص أعطال الإحالات والتوابع الخالية الشائعة.',
        en: 'Chapter 8 closes on its full map: lists created, indexed and modified, traversal that reads and updates, methods that append, order and delete, strings splitting into words, and references leaking modifications through. Then your next project: a word organizer that takes a fixed sentence, cleans its words, sorts them, and counts the unique ones in a %-formatted report. By the end of this lesson you will be able to: compose the list patterns into one program, and diagnose the common aliasing and void-method failures.',
      },
    },
    {
      kind: 'predict',
      code: "words = ['fig', 'Apple', 'date']\nwords.sort()\nprint(words[0])\nprint(words[-1])",
      question: {
        ar: 'في الفصل السادس رأيت أن المقارنة الأبجدية تضع الحروف الكبيرة قبل الصغيرة. فمن سيتصدر بعد sort؟ ومن سيختم؟',
        en: 'In chapter 6 you saw alphabetical comparison putting uppercase before lowercase. So who leads after sort? And who closes the line?',
      },
      reveal: {
        ar: "يتصدر 'Apple' (الحرف الكبير A أصغر ترتيبًا من كل الصغيرة) ويختم 'fig' (f يأتي بعد d). القائمة المرتبة هي ['Apple', 'date', 'fig'] — وقاعدة المقارنة من الفصل السادس هي التي تحكم sort اليوم.",
        en: "It leads with 'Apple' (the capital A sorts below every lowercase letter) and closes with 'fig' (f comes after d). The sorted list is ['Apple', 'date', 'fig'] — and it is the chapter-6 comparison rule that governs sort today.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التنقيح: أربع حيَل توفّر ساعات', en: 'Debugging: four tricks that save hours' },
      chunks: [
        {
          ar: 'الخلط بين القوائم وسوابقها مصدر أكبر أعطال هذا الفصل. الحيلة الأولى: معظم توابع القوائم تعدّل الوسيط وتعيد None — عكس توابع السلاسل التي تعيد سلسلة جديدة وتترك الأصل. من اعتاد word = word.strip() قد يكتب t = t.sort() فتتجه t إلى None ويفشل كل ما بعدها. الحيلة الثانية: اختر مصطلحًا والتزم به — للإضافة append أو t = t + [x] (والصحيحان فقط)، وللحذف pop أو remove أو del أو التجزئة. أما t.append([x]) فيلحق قائمة متداخلة، وt + [x] وحده لا يخزن شيئًا، وt = t + x يرمي TypeError لأن x ليست قائمة.',
          en: 'Mixing lists with their ancestors is the top bug source of this chapter. Trick one: most list methods modify the argument and return None — the opposite of string methods, which return a new string and leave the original. Accustomed to word = word.strip(), you may write t = t.sort(), sending t to None and failing everything after. Trick two: pick an idiom and stick to it — for adding, append or t = t + [x] (the only two correct forms); for deleting, pop or remove or del or a slice. Meanwhile t.append([x] appends a nested list, a bare t + [x] stores nothing, and t = t + x throws a TypeError because x is not a list.',
        },
        {
          ar: 'الحيلة الثالثة: انسخ لتجنب التسمية البديلة — إن أردت الترتيب مع الاحتفاظ بالأصل فاصنع نسخة أولًا: orig = t[:] ثم t.sort()، أو استخدم التابع الجاهز sorted الذي يعيد قائمة مرتبة جديدة ويترك الأصل (ولا تسمِّ متغيرك sorted). الحيلة الرابعة: مع أسطر الملفات وsplit أعد النظر في نمط الحارس — السطر الفارغ يعطي [] وأي فهرسة بعده تُسقط البرنامج، فاجعل len(words) تسبق words[0] دائمًا.',
          en: 'Trick three: copy to avoid aliasing — to sort while keeping the original, build a copy first: orig = t[:] then t.sort(), or use the sorted built-in, which returns a new ordered list and leaves the original alone (and never name a variable sorted). Trick four: with file lines and split, revisit the guardian pattern — an empty line yields [] and any indexing after it drops the program, so let len(words) always precede words[0].',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فهرس مصطلحات الفصل', en: 'The chapter glossary' },
      chunks: [
        {
          ar: 'من عالم البنية: القائمة (list) سلسلة من القيم؛ والعنصر (element/item) قيمة داخلها؛ والسلسلة (sequence) عائلة الترتيب الأكبر؛ والمتداخلة (nested) قائمة داخل قائمة تُحسب عنصرًا واحدًا؛ والفهرس (index) رقم الموقع الذي يبدأ من الصفر؛ والتجزئة (slice) قطعة تشمل أول فهرس وتستثني الثاني؛ والمرور (traversing) زيادة العناصر واحدة واحدة بحلقة؛ والربط (mapping) علاقة كل فهرس بعنصره؛ والقابلة للتعديل (mutable) التي تقبل تغيير عناصرها في المكان.',
          en: 'From the structure world: a list is a sequence of values; an element (item) is a value inside it; a sequence is the wider ordered family; nested is a list inside a list counted as one element; the index is the position number starting at zero; a slice is a piece including the first index and excluding the second; traversing visits the elements one by one with a loop; mapping is the relation binding each index to its element; and mutable is the trait of accepting in-place changes.',
        },
        {
          ar: 'ومن عالم السلوك: المرجع أو الإحالة (reference) ارتباط اسم بكائن؛ والتسمية البديلة (aliasing) كائن باسمين؛ ومتكافئتان (equivalent) قائمتان بنفس القيمة؛ ومتطابقتان (identical) كائنٌ واحد باسمين؛ وعامل is يسأل عن الهوية؛ والمحدِّد (delimiter) محرف القسمة في split؛ والحارس (guardian) فحص الطول قبل الفهرسة؛ والتوابع الخالية (void methods) تعدّل وتعيد None. احفظها بأسمائها الإنجليزية فهي لغة الوثائق والفرق.',
          en: 'From the behavior world: a reference binds a name to an object; aliasing gives one object two names; equivalent lists share the same value; identical are one object under two names; the is operator asks about identity; the delimiter is the split cutting character; the guardian checks length before indexing; and void methods modify and return None. Memorize their English names — that is the language of docs and teams.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المشروع: منظّم الكلمات', en: 'The project: the word organizer' },
      chunks: [
        {
          ar: "الأنبوب على أربع محطات. المحطة الأولى التقسيم: sentence سلسلة ثابتة، فتنقسم بـ split() إلى قائمة كلمات خام تحمل معها علامات الترقيم. المحطة الثانية التنظيف: قائمة clean فارغة، وحلقة for تمر على الكلمات وتلحق كل كلمة بعد تنظيفها: w.strip('.,') يمسح النقطة والفاصلة من طرفي الكلمة — تجزئة نفس strip من الفصل السادس لكن بمحارف تحددها أنت — ثم .lower() يوحد الحروف كما في تحليل البريد.",
          en: 'The pipeline has four stations. Station one, splitting: sentence is a fixed string, so split() breaks it into a raw list of words still carrying punctuation. Station two, cleaning: the empty list clean, and a for loop passes over the words appending each after tidying it: w.strip(\'.,\') wipes dots and commas from both ends of the word — the same strip from chapter 6, but with characters you choose — then .lower() unifies the case as you did parsing mail.',
        },
        {
          ar: 'المحطة الثالثة الترتيب: clean.sort() يرتب الكلمات في مكانها — وقاعدة المقارنة الأبجدية من الفصل السادس تحكم. المحطة الرابعة التفرد: قائمة unique فارغة، وحلقة على clean تسأل بعامل in من الفصل السادس: if w not in unique فألحقها — فتخرج قائمة بلا تكرار. ثم التقرير بأربعة أسطر بعامل التنسيق % من الفصل السادس: عدد الكلمات len(clean) وعدد الفريدة len(unique) وأولها وآخرها.',
          en: 'Station three, ordering: clean.sort() orders the words in place — governed by the chapter-6 alphabetical rule. Station four, uniqueness: the empty list unique, and a loop over clean asks with the chapter-6 in operator: if w not in unique, append it — leaving a list with no repetitions. Then the report in four lines with the chapter-6 % format operator: the word count len(clean), the unique count len(unique), the first and the last.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'المنظّم كاملًا أمامك', en: 'The organizer, whole and working' },
      code: "sentence = 'Lists hold many values in order. Python lists are mutable and handy.'\nwords = sentence.split()\nclean = []\nfor w in words:\n    clean.append(w.strip('.,').lower())\nclean.sort()\nunique = []\nfor w in clean:\n    if w not in unique:\n        unique.append(w)\nprint('words: %d' % len(clean))\nprint('unique: %d' % len(unique))\nprint('first: %s' % clean[0])\nprint('last: %s' % clean[-1])",
      explanation: {
        ar: "اثنتا عشرة كلمة خرجت من split، ونظّفها الأنبوب فنزلت منها النقاط وسادت الحروف الصغيرة، ورتبها sort: أول الكلمات 'and' وآخرها 'values'. والحارس الثاني in منع التكرار: 'lists' دخلت مرة واحدة من اثنتين — فكانت 12 كلمة و11 فريدة. أربعة فصول في خمسة عشر سطرًا: حلقات من الخامس، ومقارنة وتنسيق من السادس، وقوائم وتوابع من الثامن.",
        en: "Twelve words came out of split, the pipeline cleaned them — dots fell off, lowercase ruled — and sort lined them up: 'and' first and 'values' last. The second in guard blocked repetition: 'lists' entered once out of two — 12 words and 11 unique. Four chapters in fifteen lines: loops from chapter 5, comparison and formatting from chapter 6, lists and methods from chapter 8.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-delete-extend',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: 't = [1, 2, 3, 4, 5]\ndel t[1:3]\nprint(len(t))\nprint(t[0])\nprint(t[-1])',
      solution: '3\n1\n5',
      answer: '3\n1\n5',
      hints: [
        { ar: 'del مع تجزئة يمحو كل الفهارس من 1 حتى قبل 3.', en: 'del with a slice wipes every index from 1 up to before 3.' },
        { ar: 'عدّ ما تبقى من الخمسة بعد محو عنصرين.', en: 'Count what remains of the five after erasing two.' },
        { ar: 'أول العناصر الباقية وما قبل الأخير منها.', en: 'The head of the remainder, and its tail.' },
        { ar: 'الخرْج:\n3\n1\n5', en: 'The output:\n3\n1\n5' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.project-word-organizer',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل الثامن — منظّم الكلمات: الجملة sentence معطاة في المحرر (سلسلة ثابتة لا تُغيَّر). أنشئ قائمة clean فارغة، وبحلقة for مرّ على sentence.split() وألحق كل كلمة إلى clean بعد تنظيفها: w.strip('.,').lower(). ثم رتّب clean بالتابع المناسب (بلا إسناد). ثم أنشئ قائمة unique فارغة، وبحلقة ثانية ألحق كل كلمة w من clean فقط إذا لم تكن موجودة فيها (استخدم w not in unique). أخيرًا اطبع أربعة أسطر بعامل التنسيق % بالضبط: 'words: %d' % len(clean) ثم 'unique: %d' % len(unique) ثم 'first: %s' % clean[0] ثم 'last: %s' % clean[-1]. المتوقع: words: 11 وunique: 8 وfirst: and وlast: skills.",
        en: "Chapter 8 project — the word organizer: the sentence is given in the editor (a fixed string, do not change it). Create an empty list clean, and with a for loop traverse sentence.split() appending every word into clean after cleaning it: w.strip('.,').lower(). Then sort clean with the proper method (no assignment). Then create an empty list unique, and with a second loop append every word w from clean only if it is not already inside (use w not in unique). Finally print exactly four lines with the % format operator: 'words: %d' % len(clean), then 'unique: %d' % len(unique), then 'first: %s' % clean[0], then 'last: %s' % clean[-1]. Expected: words: 11, unique: 8, first: and, last: skills.",
      },
      starterCode: "sentence = 'Python builds paths. Lists build Python programs, and paths build skills.'\n# 1) clean: قسّم ثم نظّف وألحق / clean: split, then strip+lower and append\n# 2) رتّب clean / sort clean\n# 3) unique: ألحق غير المكرر بعامل in / unique: append the uniques with the in operator\n# 4) اطبع التقرير بأربعة أسطر بعامل % / print the report as four %-formatted lines\n",
      solution: "sentence = 'Python builds paths. Lists build Python programs, and paths build skills.'\nwords = sentence.split()\nclean = []\nfor w in words:\n    clean.append(w.strip('.,').lower())\nclean.sort()\nunique = []\nfor w in clean:\n    if w not in unique:\n        unique.append(w)\nprint('words: %d' % len(clean))\nprint('unique: %d' % len(unique))\nprint('first: %s' % clean[0])\nprint('last: %s' % clean[-1])",
      tests: [
        {
          id: 't1',
          name: { ar: 'clean قائمة مرتبة نظيفة', en: 'clean is a sorted clean list' },
          code: "assert clean == ['and', 'build', 'build', 'builds', 'lists', 'paths', 'paths', 'programs', 'python', 'python', 'skills'], 'expected: sorted clean words | actual: %r' % clean",
          expected: 'sorted clean words',
        },
        {
          id: 't2',
          name: { ar: 'unique بلا تكرار وطولها 8', en: 'unique has no repeats and length 8' },
          code: "assert len(unique) == 8 and unique == ['and', 'build', 'builds', 'lists', 'paths', 'programs', 'python', 'skills'], 'expected: 8 unique words | actual: %r' % unique",
          expected: '8 unique words',
        },
        {
          id: 't3',
          name: { ar: 'عددا الكلمات والفريدة مطبوعان', en: 'Both word counts are printed' },
          code: "assert 'words: 11' in __learner_output__ and 'unique: 8' in __learner_output__, ('expected: words: 11, unique: 8 | actual: %r' % __learner_output__)",
          expected: 'words: 11 / unique: 8',
        },
        {
          id: 't4',
          name: { ar: 'أول كلمة وآخر كلمة مطبوعان', en: 'First and last words are printed' },
          code: "assert 'first: and' in __learner_output__ and 'last: skills' in __learner_output__, ('expected: first: and, last: skills | actual: %r' % __learner_output__)",
          expected: 'first: and / last: skills',
        },
      ],
      hints: [
        { ar: 'أربع محطات بالترتيب: قسّم، نظّف وألحق، رتّب، فلتر التفرد — لا تقفز بينها.', en: 'Four stations in order: split, clean+append, sort, uniqueness filter — never jump between them.' },
        { ar: 'التنظيف سلسلة توابع: w.strip(\'.,\').lower() — الترتيب من اليسار لليمين.', en: "Cleaning is a method chain: w.strip('.,').lower() — flowing left to right." },
        { ar: 'الهيكل:\nwords = sentence.split()\nclean = []\nfor w in words:\n    clean.append(w.strip(\'.,\').lower())\nclean.sort()\nunique = []\nfor w in clean:\n    if w not in unique:\n        unique.append(w)\nprint(\'words: %d\' % len(clean))\nprint(\'unique: %d\' % len(unique))\nprint(\'first: %s\' % clean[0])\nprint(\'last: %s\' % clean[-1])', en: "The skeleton:\nwords = sentence.split()\nclean = []\nfor w in words:\n    clean.append(w.strip('.,').lower())\nclean.sort()\nunique = []\nfor w in clean:\n    if w not in unique:\n        unique.append(w)\nprint('words: %d' % len(clean))\nprint('unique: %d' % len(unique))\nprint('first: %s' % clean[0])\nprint('last: %s' % clean[-1])" },
        { ar: 'sort يعدّل في المكان ويستحق لا إسنادًا — وw not in unique هو سؤال العضوية الذي يمنع التكرار.', en: 'sort modifies in place and deserves no assignment — and w not in unique is the membership question that blocks repeats.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.middle-function',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "تمرين الكتاب: عرّف تابعًا باسم middle يستقبل قائمة t ويعيد قائمة جديدة تحوي جميع عناصرها عدا الأول والأخير (بالتجزئة)، دون تعديل القائمة الأصلية. ثم جرّبه: letters = ['a', 'b', 'c', 'd']، خزّن نتيجته في rest، واطبع rest ثم اطبع letters. المتوقع: ['b', 'c'] ثم ['a', 'b', 'c', 'd'].",
        en: "The book's exercise: define a function named middle that receives a list t and returns a new list holding all its elements except the first and the last (via slicing), without modifying the original list. Then try it: letters = ['a', 'b', 'c', 'd'], store its result in rest, and print rest, then print letters. Expected: ['b', 'c'] then ['a', 'b', 'c', 'd'].",
      },
      starterCode: "# عرّف middle ثم جرّبها / define middle then try it\ndef middle(t):\n    # أعد قائمة جديدة بلا أول عنصر وآخره / return a new list without the first and last\n    pass\n\nletters = ['a', 'b', 'c', 'd']\nrest = middle(letters)\nprint(rest)\nprint(letters)\n",
      solution: "def middle(t):\n    return t[1:-1]\n\nletters = ['a', 'b', 'c', 'd']\nrest = middle(letters)\nprint(rest)\nprint(letters)",
      tests: [
        {
          id: 't1',
          name: { ar: 'middle يعيد الوسط بلا أول وآخر', en: 'middle returns the middle without first and last' },
          code: "assert middle([1, 2, 3, 4]) == [2, 3], 'expected: [2, 3] | actual: %r' % middle([1, 2, 3, 4])",
          expected: '[2, 3]',
        },
        {
          id: 't2',
          name: { ar: 'القائمة الأصلية لم تُمسّ', en: 'The original list is untouched' },
          code: "assert letters == ['a', 'b', 'c', 'd'], 'expected: original intact | actual: %r' % letters",
          expected: 'original intact',
        },
        {
          id: 't3',
          name: { ar: "الوسط ['b', 'c'] مطبوع", en: "The middle ['b', 'c'] is printed" },
          code: "assert \"['b', 'c']\" in __learner_output__, ('expected: [b, c] | actual: %r' % __learner_output__)",
          expected: "['b', 'c']",
        },
      ],
      hints: [
        { ar: 'التابع المنتج يعيد — لا يعدّل. التجزئة تبني قائمة جديدة تلقائيًا.', en: 'A fruitful function returns — it does not modify. Slicing builds a new list automatically.' },
        { ar: 'الفهرس السالب في التجزئة يعمل كالفهرس المفرد: [1:-1] يعني من 1 حتى قبل الأخير.', en: 'The negative index works in slices as it does alone: [1:-1] means from 1 up to before the last.' },
        { ar: 'الهيكل:\ndef middle(t):\n    return t[1:-1]', en: 'The skeleton:\ndef middle(t):\n    return t[1:-1]' },
        { ar: 'قارن مع التمرين الشقيق chop الذي يعدّل في المكان بـ del t[0] وdel t[-1] ويعيد None.', en: 'Compare with its sibling chop, which modifies in place with del t[0] and del t[-1] and returns None.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.mcq-safe-copy',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أردت نسخة احتياطية مرتبة مع بقاء القائمة الأصلية على ترتيبها. أي سطر يحقق ذلك بأمان؟',
        en: 'You want a sorted backup while the original list keeps its order. Which line achieves that safely?',
      },
      options: [
        { id: 'a', text: { ar: 'backup = sorted(t) — أو backup = t[:] ثم backup.sort()', en: 'backup = sorted(t) — or backup = t[:] then backup.sort()' } },
        { id: 'b', text: { ar: 'backup = t — ثم backup.sort()', en: 'backup = t — then backup.sort()' } },
        { id: 'c', text: { ar: 'backup = t.sort() — ثم طباعة t', en: 'backup = t.sort() — then printing t' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'ب = أ من درس الإحالات: الاسم الثاني ليس نسخة.', en: 'b = a from the references lesson: the second name is not a copy.' },
        { ar: 'sorted تابع جاهز يعيد قائمة جديدة مرتبة ويترك الأصل.', en: 'sorted is a built-in that returns a new ordered list and leaves the original.' },
        { ar: 'التجزئة الكاملة [:] هي النسخة — وsort عليها يرتب النسخة وحدها.', en: 'The full slice [:] is the copy — and sorting it touches the copy alone.' },
        { ar: 'الجواب: أ — أما ب فيرتب الأصل، وج يجعل backup قيمة None ويضر t.', en: 'Answer: a — b sorts the original, and c makes backup None while damaging t.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex5.numeric-method-count',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: t = [1, 2, 3] ثم t.extend([4, 5]) ثم t.remove(2) — كم يُطبع print(len(t))؟',
        en: 'Without running: t = [1, 2, 3], then t.extend([4, 5]), then t.remove(2) — what does print(len(t)) show?',
      },
      answer: '4',
      solution: '4',
      tolerance: 0,
      hints: [
        { ar: 'extend يمدّد بالعناصر الاثنين — كم صار الطول؟', en: 'extend stretches with the two elements — what is the length now?' },
        { ar: 'remove يمحو قيمة واحدة — أي عدد من الطول؟', en: 'remove erases one value — subtract how many from the length?' },
        { ar: 'القائمة النهائية: [1, 3, 4, 5].', en: 'The final list: [1, 3, 4, 5].' },
        { ar: 'الجواب: 4', en: 'Answer: 4' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex6.debug-alias-backup',
      required: true,
      brokenCode: "original = ['banana', 'apple', 'cherry']\nbackup = original\n# أردت نسخة احتياطية ثم رتبتها / wanted a backup, then sorted it\nbackup.sort()\nprint('backup: %s' % backup)\nprint('original: %s' % original)",
      prompt: {
        ar: "أظهر التقرير أن الأصل تفقد ترتيبه: original صارت مرتبة مثل backup تمامًا رغم أننا رتبنا backup فقط! شغّل الكود المعطوب وراقب السطرين، ثم تتبع: ماذا صنع السطر backup = original؟ هل نسخ القائمة أم جعل اسمًا ثانيًا لنفس الكائن؟ أصلح السطر لتحصل على نسخة مستقلة فيُطبع backup: ['apple', 'banana', 'cherry'] بينما يبقى original: ['banana', 'apple', 'cherry'].",
        en: "The report showed the original losing its order: original came out sorted exactly like backup although we only sorted backup! Run the broken code and watch the two lines, then trace: what did the line backup = original do? Did it copy the list or make a second name for the same object? Fix that line so you get an independent copy: print backup: ['apple', 'banana', 'cherry'] while original stays ['banana', 'apple', 'cherry'].",
      },
      solution: "original = ['banana', 'apple', 'cherry']\nbackup = original[:]\nbackup.sort()\nprint('backup: %s' % backup)\nprint('original: %s' % original)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الأصل احتفظ بترتيبه', en: 'The original kept its order' },
          code: "assert original == ['banana', 'apple', 'cherry'], 'expected: original intact | actual: %r' % original",
          expected: 'original intact',
        },
        {
          id: 't2',
          name: { ar: 'النسخة مرتبة', en: 'The backup is sorted' },
          code: "assert backup == ['apple', 'banana', 'cherry'], 'expected: sorted backup | actual: %r' % backup",
          expected: 'sorted backup',
        },
        {
          id: 't3',
          name: { ar: 'الأصل مطبوع سليمًا', en: 'The intact original is printed' },
          code: "assert \"['banana', 'apple', 'cherry']\" in __learner_output__, ('expected: original intact in output | actual: %r' % __learner_output__)",
          expected: "['banana', 'apple', 'cherry']",
        },
      ],
      hints: [
        { ar: 'لا خطأ قواعدي ولا استثناء — الخلل مفهومي: سطر واحد فقط.', en: 'No syntax error and no exception — the bug is conceptual: a single line.' },
        { ar: 'بعد backup = original فالاسمان لكائن واحد، وsort عبر backup رتب الكائن المشترك.', en: 'After backup = original the two names own one object, and sorting through backup ordered the shared object.' },
        { ar: 'النسخة المستقلة تُؤخذ بالتجزئة الكاملة: backup = original[:].', en: 'The independent copy comes from the full slice: backup = original[:].' },
        { ar: "original = ['banana', 'apple', 'cherry']\nbackup = original[:]\nbackup.sort()\nprint('backup: %s' % backup)\nprint('original: %s' % original)", en: "original = ['banana', 'apple', 'cherry']\nbackup = original[:]\nbackup.sort()\nprint('backup: %s' % backup)\nprint('original: %s' % original)" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — نظّم كلماتك أنت\n# Your playground — organize your very own words\n\ntext = "py4e made lists easy; lists made python fun."\nwords = text.split()\nclean = []\nfor w in words:\n    clean.append(w.strip(".,;").lower())\nclean.sort()\nprint(clean)\n\nunique = []\nfor w in clean:\n    if w not in unique:\n        unique.append(w)\nprint(unique)\nprint("unique: %d" % len(unique))',
      prompt: {
        ar: 'جرّب بنفسك: غيّر الجملة، ووسّع المحارف المنظفة (أضف ; أو !)، وأضف كلمات مكررة عمدًا وراقب unique. ثم جرّب الخطر: بدّل clean.sort() بسطر sorted_clean = clean.sort() واطبع — ماذا صار؟ ثم أعد بناءه بالطريقة الصحيحة أو بالتابع sorted. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: change the sentence, widen the strip set (add ; or !), and sprinkle repeated words on purpose while watching unique. Then try the danger: swap clean.sort() for a line sorted_clean = clean.sort() and print it — what became of it? Then rebuild it the right way, or with the sorted built-in. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الثاني: في السطر numbers[i] = numbers[i] * 2 — ماذا تعني علامة = الواحدة؟',
            en: 'From chapter 2: in the line numbers[i] = numbers[i] * 2 — what does the single = mean?',
          },
          options: [
            { id: 'a', text: { ar: 'إسناد: اقرأ اليمين ثم خزّن النتيجة في الموقع الأيسر', en: 'Assignment: evaluate the right, then store the result at the left target' } },
            { id: 'b', text: { ar: 'مساواة رياضية تفحص العددين', en: 'A mathematical equality checking two numbers' } },
            { id: 'c', text: { ar: 'نسخ دائم للقائمة كلها', en: 'A permanent copy of the whole list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الإسناد يقيّم الجانب الأيمن أولًا ثم يخزّن — وهنا كان الموقع عنصرًا مفهرسًا، فصار التحديث في مكان العنصر نفسه.',
            en: 'Assignment evaluates the right side first, then stores — and here the target was an indexed element, so the update landed on the element itself.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الرابع: صُنفت sort بأنها تابع خالٍ (void) — فماذا يحدث عند كتابة t = t.sort()؟',
            en: 'From chapter 4: sort was classified as a void method — so what happens when you write t = t.sort()?',
          },
          options: [
            { id: 'a', text: { ar: 'تصير t قيمة None وتفقد القائمة المرتبة', en: 't becomes None and you lose the sorted list' } },
            { id: 'b', text: { ar: 'تحصل على قائمتين: مرتبة وأخرى سليمة', en: 'You get two lists: one sorted and one intact' } },
            { id: 'c', text: { ar: 'لا شيء — الإسناد لا يؤثر على التوابع الخالية', en: 'Nothing — assignment has no effect on void methods' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التابع الخالي عدّل القائمة في المكان ثم أعاد None — والإسناد خزّن هذا لا شيء فوق اسمك. القاعدة: ترتيب بلا إسناد.',
            en: 'The void method modified the list in place then returned None — and the assignment stored that nothing over your name. Rule: sort without assignment.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الخامس: في for w in clean: — ما هو w وكم مرة يدور الجسم لقائمة من 11 كلمة؟',
            en: 'From chapter 5: in for w in clean: — what is w, and how many times does the body run for an 11-word list?',
          },
          options: [
            { id: 'a', text: { ar: 'متغير تكرار يأخذ كلمة كل دورة — والجسم 11 مرة', en: 'An iteration variable taking one word per pass — the body runs 11 times' } },
            { id: 'b', text: { ar: 'فهرس يرقم الكلمات — والجسم مرة واحدة', en: 'An index numbering the words — the body runs once' } },
            { id: 'c', text: { ar: 'قائمة جديدة — والجسم لا يتوقف', en: 'A new list — the body never stops' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نمط for المحدد من الفصل الخامس نفسه — وقد بنينا عليه محطتي التنظيف والتفرد في مشروع اليوم.',
            en: 'The definite for pattern straight from chapter 5 — and today both the cleaning and uniqueness stations were built on it.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل السادس: بعد sort، لماذا تتصدر Apple كلمة date رغم أن حروف d تسبق حروف A في الأبجدية المعروفة؟',
            en: 'From chapter 6: after sorting, why does Apple come before date even though d precedes A in the familiar alphabet?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن المقارنة تستخدم ترتيب المحارف، والحرف الكبير أصغر رقمًا من الصغير', en: 'Because comparison uses character order, and the capital letter has a smaller code than the lowercase one' } },
            { id: 'b', text: { ar: 'لأن الكلمات القصيرة تتقدم دائمًا', en: 'Because shorter words always come first' } },
            { id: 'c', text: { ar: 'لأن sort يرتب عشوائيًا', en: 'Because sort orders randomly' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نفس قاعدة المقارنة التي حفرتها في الفصل السادس: الحروف الكبيرة تسبق الصغيرة في ترتيب المحارف — ولهذا يفضَّل توحيد الحروف بـ lower قبل المقارنة، تمامًا كأنبوب مشروعنا.',
            en: 'The same comparison rule you drilled in chapter 6: capitals precede lowercase in character order — which is why unifying case with lower before comparing is preferred, exactly like our project pipeline.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الفصل السابع: في برنامج يحلل أسطر ملف بالتقسيم — لماذا نفحص len(words) قبل words[0]؟',
            en: 'From chapter 7: in a program parsing file lines by splitting — why do we check len(words) before words[0]?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن السطر الفارغ يعطي قائمة فارغة — والفهرسة عليها ترمي IndexError', en: 'Because an empty line yields an empty list — and indexing it throws IndexError' } },
            { id: 'b', text: { ar: 'لأن len تُسرّع قراءة الملف', en: 'Because len speeds up file reading' } },
            { id: 'c', text: { ar: 'لأن split يرفض الأسطر القصيرة', en: 'Because split refuses short lines' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نمط الحارس من دروس اليوم: split على سطر فارغ يعطي [] ثم أي words[0] ينهار. فحص الطول قبل الفهرسة هو خاتم الأمان.',
            en: 'The guardian pattern from today: split on an empty line gives [] and any words[0] collapses. Checking length before indexing is the safety seal.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'وسؤال الفصل الثامن نفسه: a = [1, 2, 3] وb = a وb.append(4) — ماذا تعطي print(a)؟',
            en: 'And a chapter-8 question: a = [1, 2, 3], b = a, b.append(4) — what does print(a) give?',
          },
          options: [
            { id: 'a', text: { ar: '[1, 2, 3, 4] — الاسمين لكائن واحد فأُلحق في الاثنين', en: '[1, 2, 3, 4] — the two names are one object, so both saw the append' } },
            { id: 'b', text: { ar: '[1, 2, 3] — append لمس b وحدها', en: '[1, 2, 3] — append touched b alone' } },
            { id: 'c', text: { ar: '[4] — لأن الإسناد أنشأ قائمة جديدة', en: '[4] — because the assignment created a new list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التسمية البديلة: الإسناد جعل a وb إحالتين إلى القائمة نفسها، وappend تعدّل الكائن المشترك فيصل الأثر إلى الاسمين. من يريد عزله ينسخ بـ [:].',
            en: 'Aliasing: the assignment made a and b two references to one list, and append modified the shared object, so the effect reached both names. Whoever wants isolation copies with [:].',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 't = [3, 1, 2]\nordered = t.sort()\nprint(ordered[0])',
          right: 't = [3, 1, 2]\nt.sort()\nprint(t[0])',
          note: {
            ar: 'sort يعيد None — فordered ليست قائمة وفهرستها تُسقط البرنامج. التابع المعدِّل يُستدعى ويُترك، أو استخدم sorted الجاهز إن أردت قيمة معادة.',
            en: 'sort returns None — so ordered is not a list and indexing it drops the program. Call the modifying method and leave it, or use the sorted built-in when you need a returned value.',
          },
        },
        {
          wrong: "t = ['a', 'b']\nt = t + 'c'",
          right: "t = ['a', 'b']\nt = t + ['c']",
          note: {
            ar: 'الجمع يصل قائمة بقائمة: اليمين المجرد يرمي TypeError: can only concatenate list to list. ألحق بين قوسين، أو استخدم append لعنصر واحد.',
            en: "Concatenation joins list to list: a bare right side throws TypeError: can only concatenate list to list. Wrap the addition in brackets, or use append for one element.",
          },
        },
        {
          wrong: "clean = ['b', 'a']\nbackup = clean\nbackup.append('c')",
          right: "clean = ['b', 'a']\nbackup = clean[:]\nbackup.append('c')",
          note: {
            ar: 'الإسناد العادي اسم بديل لا نسخة — صار للقائمة بابان وكل تعديل عبرهما يظهر في الطرفين. انسخ بالتجزئة الكاملة [:] حين تريد استقلال النسخة.',
            en: 'A plain assignment is an alias, not a copy — the list now has two doors and every change through either shows at both. Copy with the full slice [:] when you want an independent backup.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'أنبوب المنظّم: split يقسم، وstrip + lower ينظف، وsort يرتب في المكان، وin يفلتر التفرد — والتقرير يُطبع بعامل %.', en: 'The organizer pipeline: split divides, strip + lower cleans, sort orders in place, in filters uniqueness — and the report prints with the % operator.' },
        { ar: 'التنقيح: التوابع الخالية تعيد None فلا تُسَنَّد، والتزم مصطلحًا للإضافة والحذف، وانسخ بـ [:] أو sorted قبل تعديل نسخة، واحرس الفهارس بعد split.', en: 'Debugging: void methods return None so never assign them, stick to one idiom for adding and deleting, copy with [:] or sorted before modifying a copy, and guard indices after split.' },
        { ar: 'الكائن يحمل قيمة والاسم يحمل إحالة: المتكافئان ليسا المتطابقين، والتسمية البديلة تسرّب كل تعديل عبر الأبواب كلها.', en: 'The object carries the value and the name carries a reference: the equivalent are not the identical, and aliasing leaks every change through all its doors.' },
      ],
      reflectPrompt: {
        ar: 'أعيد بناء منظّم الكلمات بجملة من عندك بالكامل خارج المنصة، ثم أضف محطة خامسة من اختراعك (أطول كلمة؟ عدد الكلمات التي تبدأ بحرف معين؟). ما الذي احتجت من فصول سابقة لإكمالها؟',
        en: 'Rebuild the word organizer with your own sentence entirely outside the platform, then add a fifth station of your invention (longest word? how many words start with a given letter?). Which earlier chapters did you need to finish it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch8.s14', pages: 'ص133 / pp.133' },
        { book: 'PY4E', section: 'py4e.ch8.s15', pages: 'ص138 / pp.138' },
        { book: 'PY4E', section: 'py4e.ch8.s16', pages: 'ص139 / pp.139' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch8.s14', pages: 'ص133 / pp.133' },
    { book: 'PY4E', section: 'py4e.ch8.s15', pages: 'ص138 / pp.138' },
    { book: 'PY4E', section: 'py4e.ch8.s16', pages: 'ص139 / pp.139' },
  ],
} satisfies Lesson;

export default lesson;
