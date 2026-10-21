import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch9.l5 — "Text Processing: Lowercase and Punctuation /
 * معالجة النصوص: الحروف الصغيرة وعلامات الترقيم"
 * Aligned with PY4E ch9 s5 (التعامل مع النصوص), book p.150.
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch9.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 9,
  title: { ar: 'معالجة النصوص: الحروف الصغيرة وعلامات الترقيم', en: 'Text Processing: Lowercase and Punctuation' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch9.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: "برنامج العدّ نجح — على نص مخلَّص من الترقيم. النص الحقيقي وحش: But, soft! بحرفها الكبير وفاصلتها، وWho مكتوبة بحرف كبير — وsplit يعامل soft! وsoft ككلمتين مختلفتين فيفتح لهما عدّادين منفصلين. الحل تنظيف السطر قبل العدّ: lower يوحّد الحروف، وtranslate مع جدول حذف يزيل علامات الترقيم كلها بسطر واحد. بنهاية الدرس ستكون قادرًا على: توحيد الحالة بـ lower، وإلغاء الترقيم بـ translate وstring.punctuation، وترتيب خطوات التنظيف، وتشغيل برنامج عدّ الكلمات الكامل على نص مرقّم حقيقي.",
        en: "The counting program worked — on a text stripped of punctuation. Real text is a beast: But, soft! with its capital and comma, and Who spelled with a capital — and split treats soft! and soft as two different words, opening two separate counters. The fix is cleaning the line before counting: lower unifies the letters, and translate with a deletion table strips every punctuation mark in one line. By the end of this lesson you will be able to: unify case with lower, delete punctuation with translate and string.punctuation, order the cleaning steps, and run the full word-counting program on genuinely punctuated text.",
      },
    },
    {
      kind: 'predict',
      code: "w1 = 'soft!'\nw2 = 'soft'\nprint(w1 == w2)\nprint(w1.lower())\nclean = w1.translate(str.maketrans('', '', '!'))\nprint(clean == w2)",
      question: {
        ar: 'ثلاثة أسطر: هل الكلمتان متطابقتان؟ وماذا يفعل lower وحده؟ وماذا يفعل translate؟',
        en: 'Three questions: are the two words equal? What does lower alone do? And what does translate do?',
      },
      reveal: {
        ar: 'يطبع False ثم soft! ثم True. soft! وsoft كلمتان مختلفتان للعدّاد. lower وحده خفّض الحروف لكنه أبقى العلامة — soft!. أما translate مع جدول حذف فأزال ! فتطابقت الكلمة مع soft. كل تابع عالج مشكلة واحدة، والتطابق اكتمل بالاثنين.',
        en: 'It prints False, then soft!, then True. soft! and soft are two different words for a counter. lower alone lowered the letters but kept the mark — soft!. Meanwhile translate with a deletion table removed !, so the word matched soft. Each method treated one problem, and the match completed with both.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'مشكلتان تفسدان العدّ', en: 'Two problems that corrupt the count' },
      chunks: [
        {
          ar: 'النص الأصلي فيه ترقيم وحروف كبيرة: But, soft! what light... وبما أن split يعامل الكلمات كرموز تفصلها الفراغات، فسيعامل soft! وsoft ككلمتين مختلفتين وينشئ لكل منهما مكانًا منفردًا في القاموس. وكذلك who وWho كلمتان مختلفتان لأن النص فيه حروف كبيرة وصغيرة.',
          en: 'The original text carries punctuation and capitals: But, soft! what light... And since split treats words as tokens separated by spaces, it will treat soft! and soft as two different words and give each its own slot in the dictionary. Likewise who and Who are two different words because the text mixes lower and upper case.',
        },
        {
          ar: 'النتيجة هيستوغرام مشوّه: عدّاد لكل شكل من أشكال الكلمة بدل عدّاد واحد يجمعها — فيبدو النص أفقر مفردات من الحقيقة ويخفق تقرير الأكثر تكرارًا. الحل مشكلتان صغيرتان: توحيد الحالة، وحذف الترقيم — نعالجهما قبل split وقبل العدّ.',
          en: 'The result is a corrupted histogram: a counter for every costume of the word instead of one counter gathering them all — the text then looks poorer in vocabulary than it is, and the most-frequent report fails. The fix is two small problems: unify the case, and delete the punctuation — both treated before split and before counting.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'lower وtranslate وجدول الحذف', en: 'lower, translate, and the deletion table' },
      chunks: [
        {
          ar: 'lower من دروس السلاسل في الفصل السادس: line.lower() يعيد نسخة بأحرف صغيرة كلها. أما translate فهو الأقوى: line.translate(str.maketrans(fromstr, tostr, deletestr)) — استبدل محارف fromstr بمحارف الموقع نفسه في tostr، واحذف جميع محارف deletestr. وللحذف فقط نبني الجدول بوسيطين فارغين: str.maketrans(\'\', \'\', حروف-الحذف).',
          en: "lower from the chapter-6 string lessons: line.lower() returns a copy in all lowercase. translate is the strongest: line.translate(str.maketrans(fromstr, tostr, deletestr)) — replace the characters of fromstr with the same-position characters of tostr, and delete all the characters of deletestr. For deletion only, we build the table with two empty arguments: str.maketrans('', '', the-chars-to-delete).",
        },
        {
          ar: "ومن أين نجلب قائمة الترقيم كاملة؟ من الوحدة string: نكتب import string في أعلى البرنامج ثم string.punctuation — وهي سلسلة تحوي كل محارف الترقيم المألوفة من ! إلى ~. فالسطر السحري: line.translate(str.maketrans('', '', string.punctuation)) يمسح الفواصل والنقاط وعلامات التعجب دفعة واحدة.",
          en: "And where does the full punctuation list come from? The string module: we write import string at the top of the program, then string.punctuation — a string holding every familiar punctuation character from ! to ~. So the magic line: line.translate(str.maketrans('', '', string.punctuation)) wipes commas, periods and exclamation marks in one go.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'البرنامج الكامل: نظّف ثم عدّ', en: 'The full program: clean, then count' },
      chunks: [
        {
          ar: 'الترتيب داخل الحلقة: نلقي الترقيم بـ translate ثم نوحّد الحالة بـ lower ثم نفرّق بـ split ثم نعدّ بطريقة get. (lower قبل translate أو بعده — النتيجة هنا واحدة، لكن ثبّت ترتيبًا واحدًا لا تتردد فيه.) كل سطر يمر على خط الإنتاج قبل أن تصبح كلماته أرقامًا.',
          en: 'The order inside the loop: dump the punctuation with translate, then unify the case with lower, then split, then count with the get idiom. (lower before or after translate — the result is identical here, but fix one order and never waver.) Every line passes down the production line before its words become numbers.',
        },
        {
          ar: 'ومن الفصل السابع تذكير: التنظيف يحدث للسطر داخل الحلقة — لا للمعرّف. وبرنامج واحد يجمع الفصول: import من الرابع، والملفات من السابع، وقوائم split من الثامن، والقواميس من التاسع. هذا أكبر برنامج تبنيه حتى الآن — وكل سطر فيه من درس تعرفه.',
          en: 'And a chapter-7 reminder: cleaning happens to the line inside the loop — never to the handle. One program gathers the chapters: import from four, files from seven, split lists from eight, dictionaries from nine. This is your biggest program yet — and every line of it comes from a lesson you know.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'عدّاد روميو الكامل', en: 'The complete Romeo counter' },
      code: "import string\n\nout = open('romeo-full.txt', 'w')\nout.write('But, soft! what light through yonder window breaks?\\n')\nout.write('It is the east, and Juliet is the sun.\\n')\nout.write('Arise, fair sun, and kill the envious moon,\\n')\nout.write('Who is already sick and pale with grief,\\n')\nout.close()\n\ncounts = dict()\nfhand = open('romeo-full.txt')\nfor line in fhand:\n    line = line.translate(str.maketrans('', '', string.punctuation))\n    line = line.lower()\n    words = line.split()\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\nfhand.close()\nprint(counts['sun'])\nprint(counts['is'])\nprint(len(counts))",
      explanation: {
        ar: 'النص فيها فواصل وعلامات تعجب واستفهام ونقاط وحروف كبيرة — ومع ذلك أجاب العدّاد بدقة: sun مرتين وis ثلاث مرات و26 كلمة مختلفة. لاحظ خط الإنتاج داخل الحلقة: translate ثم lower ثم split ثم get — أربعة أنابيب يمر فيها كل سطر قبل أن تصبح كلماته أرقامًا. ولو أزيلت أي أنبوب لانقسمت عدّادات فورًا.',
        en: 'The text carries commas, exclamation and question marks, periods and capitals — yet the counter answered precisely: sun twice, is three times, 26 different words. Watch the production line inside the loop: translate, then lower, then split, then get — four pipes every line flows through before its words become numbers. Remove any pipe and the counters split apart at once.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.clean-count',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "السطر line = 'Data, data, DATA!' معطى مع import string في المحرر. نظّفه: ألغِ الترقيم بـ translate وstring.punctuation ثم خفّض الحروف بـ lower، ثم عدّ كلماته في قاموس counts بطريقة counts[word] = counts.get(word, 0) + 1 على كلمات split. اطبع counts['data'] واطبع len(counts). المتوقع: 3 ثم 1.",
        en: "The line line = 'Data, data, DATA!' is given with import string in the editor. Clean it: delete the punctuation with translate and string.punctuation, then lowercase with lower, then count its words into a dictionary counts with counts[word] = counts.get(word, 0) + 1 over the split words. Print counts['data'] and print len(counts). Expected: 3, then 1.",
      },
      starterCode: "import string\nline = 'Data, data, DATA!'\n# نظّف السطر: translate ثم lower / clean the line: translate then lower\n# عدّ الكلمات في counts بطريقة get / count the words into counts with the get idiom\n# اطبع counts['data'] وlen(counts) / print counts['data'] and len(counts)\n",
      solution: "import string\nline = 'Data, data, DATA!'\nline = line.translate(str.maketrans('', '', string.punctuation))\nline = line.lower()\ncounts = dict()\nfor word in line.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts['data'])\nprint(len(counts))",
      tests: [
        {
          id: 't1',
          name: { ar: 'كلمة data عُدّت ثلاثًا رغم أشكالها', en: 'Word data counted 3 times across its costumes' },
          code: "assert counts['data'] == 3, 'expected: 3 | actual: %r' % counts['data']",
          expected: '3',
        },
        {
          id: 't2',
          name: { ar: 'مفتاح واحد فقط في القاموس', en: 'Exactly one key in the dictionary' },
          code: "assert len(counts) == 1, 'expected: 1 | actual: %r' % len(counts)",
          expected: '1',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع 3', en: '3 is printed' },
          code: "assert '3' in __learner_output__, ('expected: 3 | actual: %r' % __learner_output__)",
          expected: '3',
        },
        {
          id: 't4',
          name: { ar: 'لا مفاتيح ملطخة بالترقيم أو الحروف الكبيرة', en: 'No punctuation-stained or uppercase keys remain' },
          code: "assert 'DATA' not in counts and 'data,' not in counts and 'data!' not in counts, 'expected: cleaned keys | actual: %r' % list(counts.keys())",
          expected: 'cleaned keys',
        },
      ],
      hints: [
        { ar: 'سطرا التنظيف يسبقان الحلقة: translate بمسار string.punctuation ثم lower.', en: 'The two cleaning lines precede the loop: translate with string.punctuation, then lower.' },
        { ar: 'لاحظ أن الأشكال الثلاثة Data وdata وDATA! تصبح كلمة واحدة بعد التنظيف.', en: 'Notice the three costumes Data, data and DATA! all become one word after cleaning.' },
        { ar: "الهيكل:\nline = line.translate(str.maketrans('', '', string.punctuation))\nline = line.lower()\ncounts = dict()\nfor word in line.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts['data'])\nprint(len(counts))", en: "The skeleton:\nline = line.translate(str.maketrans('', '', string.punctuation))\nline = line.lower()\ncounts = dict()\nfor word in line.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts['data'])\nprint(len(counts))" },
        { ar: "لو ظهر len(counts) بغير 1 فمفتاحان انقسما: راجع translate (الترقيم) وlower (الحالة).", en: 'If len(counts) is not 1, two keys split apart: review translate (punctuation) and lower (case).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-clean',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "s = 'Hi, There!'\nprint(s.lower())\nprint(s.translate(str.maketrans('', '', ',!')))\nprint(s.lower().translate(str.maketrans('', '', ',!')))",
      solution: 'hi, there!\nHi There\nhi there',
      answer: 'hi, there!\nHi There\nhi there',
      hints: [
        { ar: 'lower وحده يخفض الحروف ولا يمس الفواصل.', en: 'lower alone lowercases and never touches commas.' },
        { ar: 'translate وحده يحذف الفاصلة والعلامة ويبقى الحرف الكبير.', en: 'translate alone deletes the comma and mark while the capital remains.' },
        { ar: 'التركيب بالسلسلة يطبق الاثنين بالترتيب: lower أولا ثم translate.', en: 'Chaining applies both in order: lower first, then translate.' },
        { ar: 'الخرْج:\nhi, there!\nHi There\nhi there', en: 'The output:\nhi, there!\nHi There\nhi there' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-maketrans',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "ماذا يفعل str.maketrans('', '', string.punctuation)؟",
        en: "What does str.maketrans('', '', string.punctuation) do?",
      },
      options: [
        { id: 'a', text: { ar: 'يبني جدول حذف يلغي كل محارف الترقيم عند تمريره إلى translate', en: 'Builds a deletion table that wipes every punctuation character when passed to translate' } },
        { id: 'b', text: { ar: 'يحوّل الحروف الكبيرة إلى صغيرة مباشرة', en: 'Converts uppercase letters to lowercase directly' } },
        { id: 'c', text: { ar: 'يفرّق النص إلى قائمة كلمات', en: 'Breaks the text into a list of words' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الوسيطان الأولان فارغان — فلا استبدال يحدث.', en: 'The first two arguments are empty — so no replacement happens.' },
        { ar: 'الوسيط الثالث هو قائمة ما يُحذف.', en: 'The third argument is the delete list.' },
        { ar: 'maketrans تبني الجدول، وtranslate هو الذي ينفذ.', en: 'maketrans builds the table; translate is the one that executes.' },
        { ar: 'الجواب: أ — جدول حذف يحذف الترقيم كله حين يمرر إلى translate.', en: 'Answer: a — a deletion table that strips all punctuation when handed to translate.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-translate',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: "اكتب الكلمة المناسبة: التابع الذي يحذف علامات الترقيم من السطر مع جدول من maketrans: line = line.____(str.maketrans('', '', string.punctuation))",
        en: "Fill in: the method that deletes punctuation from the line with a maketrans table: line = line.____(str.maketrans('', '', string.punctuation))",
      },
      solution: 'translate',
      answer: 'translate',
      hints: [
        { ar: 'تسعة حروف تبدأ بحرف t — واسمه يعني ترجمة النص إلى نسخة نظيفة.', en: 'Nine letters starting with t — its name means translating the text into a clean copy.' },
        { ar: 'maketrans يبني الجدول و____ ينفذه على السطر.', en: 'maketrans builds the table and ____ executes it on the line.' },
        { ar: "الشكل الصحيح: line = line.translate(str.maketrans('', '', string.punctuation))", en: "The correct shape: line = line.translate(str.maketrans('', '', string.punctuation))" },
        { ar: 'الجواب: translate', en: 'Answer: translate' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — مصنع التنظيف\n# Your playground — the cleaning factory\n\nimport string\n\nline = 'Well, done! Keep, going!'\nclean = line.translate(str.maketrans('', '', string.punctuation)).lower()\nprint(line)\nprint(clean)\nprint(clean.split())",
      prompt: {
        ar: 'جرّب: أسطرًا أخرى بترقيم مختلف وحروف كبيرة وقارن قبل وبعد، ثم جرّب الجدول بوسيطين غير فارغين للاستبدال بدل الحذف. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: other lines with different punctuation and capitals, compare before and after, then try the table with two non-empty arguments to replace instead of delete. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل السادس: رأينا lower في مقارنة السلاسل — فلماذا نطبقه هنا قبل العدّ أيضًا؟',
            en: 'From chapter 6: we met lower in string comparison — why apply it before counting too?',
          },
          options: [
            { id: 'a', text: { ar: "لأن 'Who' و'who' تختلفت بلا توحيد — في المقارنة وفي العدّ معًا", en: "Because 'Who' and 'who' differ without unification — in comparison and in counting alike" } },
            { id: 'b', text: { ar: 'لأن lower يزيل المسافات أيضًا', en: 'Because lower also removes spaces' } },
            { id: 'c', text: { ar: 'لأن lower يجعل البرنامج أسرع', en: 'Because lower makes the program faster' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نفس خطورة Pineapple قبل banana من الفصل السادس: الأشكال تختلف والأصناف واحد — التوحيد يصلح المقارنة والعدّ.',
            en: 'The same trap as Pineapple before banana in chapter 6: shapes differ while the thing is one — unification fixes both comparison and counting.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا يفتح split عدّادين لـ soft! وsoft؟',
            en: 'Why does split open two counters for soft! and soft?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يفرّق عند الفراغات فقط فتبقى العلامة ملتصقة بالكلمة', en: 'It splits at spaces only, so the mark stays glued to the word' } },
            { id: 'b', text: { ar: 'لأن soft! أطول حرفًا فلا تدخل القاموس', en: 'Because soft! is longer, so it never enters the dictionary' } },
            { id: 'c', text: { ar: 'لأن القاموس يكرر المفاتيح عمدًا', en: 'Because the dictionary deliberately duplicates keys' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split رموز مفصولة فراغات: العلامة جزء من الرمز حتى تحذفها أنت بـ translate.',
            en: 'split sees space-separated tokens: the mark is part of the token until you delete it with translate.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما الترتيب الصحيح لخطوات معالجة كل سطر في برنامج العدّ الكامل؟',
            en: 'What is the correct order of steps for each line in the full counting program?',
          },
          options: [
            { id: 'a', text: { ar: 'translate ثم lower ثم split ثم العدّ بـ get', en: 'translate, then lower, then split, then counting with get' } },
            { id: 'b', text: { ar: 'split ثم translate ثم lower', en: 'split, then translate, then lower' } },
            { id: 'c', text: { ar: 'العدّ أولًا ثم التنظيف للنتائج', en: 'Count first, then clean the results' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التنظيف يسبق التفريق يسبق العدّ — كلمات نظيفة تدخل عدّادات نظيفة.',
            en: 'Cleaning precedes splitting precedes counting — clean words enter clean counters.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل السابع: لماذا نكتب محرف سطر جديد في نهاية كل سطر نكتبه بـ write؟',
            en: 'From chapter 7: why do we write a newline at the end of every line we write with write?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن write لا يضيف أسطرًا بنفسه — وإلا تلتحم الكلمات عند حدود الأسطر', en: 'write adds no line breaks itself — or words fuse across line borders' } },
            { id: 'b', text: { ar: 'لأن الملف يرفض القراءة بلا أسطر جديدة', en: 'Because the file refuses to be read without newlines' } },
            { id: 'c', text: { ar: 'لا داعي لذلك إطلاقًا — write يضيفها تلقائيًا', en: 'Never needed — write adds them automatically' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'write حرفي بلا مجاملة: ما لا تكتبه \\n لن يُكتب — والكلمات الملتحمة تخدع عدّاد الكلمات فورًا.',
            en: 'write is literal with no favors: whatever \\n you do not write never appears — and fused words fool the word counter instantly.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "for word in line.split():\n    counts[word] = counts.get(word, 0) + 1\n# بلا تنظيف: Who وwho عدّادان",
          right: "line = line.translate(str.maketrans('', '', string.punctuation))\nline = line.lower()\nfor word in line.split():\n    counts[word] = counts.get(word, 0) + 1",
          note: {
            ar: 'بلا تنظيف يزدهر القاموس بعدّادات مكررة لنفس الكلمة بأشكالها: Who وwho وWho, — نظّف داخل الحلقة قبل split.',
            en: 'Without cleaning the dictionary blooms with duplicate counters for the same word in its costumes: Who, who, Who, — clean inside the loop, before split.',
          },
        },
        {
          wrong: "line = line.translate(str.maketrans(string.punctuation, ''))",
          right: "line = line.translate(str.maketrans('', '', string.punctuation))",
          note: {
            ar: 'صيغة maketrans بوسيطين للاستبدال وتتطابق أطوال السلسلتين وإلا رميت ValueError — أما الحذف فبوسيطين فارغين ثم قائمة الحذف في الوسيط الثالث.',
            en: 'The two-argument maketrans form is for replacement and demands equal-length strings or it throws a ValueError — deletion uses two empty arguments then the delete list as the third.',
          },
        },
        {
          wrong: "fhand = open('romeo-full.txt')\nfhand = fhand.lower()\nfhand = fhand.translate(str.maketrans('', '', string.punctuation))",
          right: "fhand = open('romeo-full.txt')\nfor line in fhand:\n    line = line.translate(str.maketrans('', '', string.punctuation))\n    line = line.lower()",
          note: {
            ar: 'lower وtranslate توابع سلاسل لا معرّفات ملفات — وتطبيقهما على المعرّف يرمي AttributeError. التنظيف للسطر داخل الحلقة.',
            en: 'lower and translate are string methods, not file-handle methods — applying them to the handle throws an AttributeError. Clean the line inside the loop.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الترقيم والحالة يفسدان العدّ: soft! وsoft وWho وwho عدّادات مكررة لنفس الكلمة.', en: 'Punctuation and case corrupt the count: soft!, soft, Who and who are duplicate counters for one word.' },
        { ar: 'lower يوحّد الحالة، وtranslate مع str.maketrans(\'\', \'\', string.punctuation) يلغي الترقيم — قبل split وقبل العدّ.', en: "lower unifies the case, and translate with str.maketrans('', '', string.punctuation) deletes the punctuation — before split and before counting." },
        { ar: 'البرنامج الكامل خط إنتاج: import string، translate، lower، split، عدّ بـ get — وبعده يعدّ أي نص بنظافة.', en: 'The full program is a production line: import string, translate, lower, split, count with get — after which any text counts cleanly.' },
      ],
      reflectPrompt: {
        ar: 'خذ مقالًا حقيقيًا عندك: اذكر ثلاث علامات ترقيم ستحذفها، وكلمة واحدة ستتكرر بأشكال مختلفة قبل التنظيف — كيف يوحد البرنامج عدّادها؟',
        en: 'Take a real article of yours: name three punctuation marks you would delete, and one word that would repeat in different costumes before cleaning — how does the program unify its counter?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch9.s5', pages: 'ص150 / pp.150' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch9.s5', pages: 'ص150 / pp.150' },
  ],
} satisfies Lesson;

export default lesson;
