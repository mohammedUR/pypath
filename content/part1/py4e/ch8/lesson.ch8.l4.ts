import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch8.l4 — "Lists with Functions and Strings /
 * القوائم مع التوابع والسلاسل"
 * Aligned with PY4E ch8 s8 (القوائم والتوابع), s9 (القوائم والسلاسل النصية).
 * All expression is original. No input(): the book's average program is
 * adapted to a fixed list (platform determinism rule).
 */
const lesson = {
  id: 'py4e.ch8.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 8,
  title: { ar: 'القوائم مع التوابع والسلاسل', en: 'Lists with Functions and Strings' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch8.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'توابع جاهزة كانت تحسب لسلاسلك، واليوم تفتح عينيها على القوائم: len وmax وmin وsum تختصر حلقات كاملة في سطر واحد. ثم الانقلاب المذهل: تمرّر قائمة إلى تابعك وتعدّلها فيه — فتجد أنها تعدّلت عند المستدعي أيضًا! وفي الخضمّ يتعاون عالمان: السلاسل تنقسم إلى قوائم بالكلمات، فتبدأ رحلة تحليل النصوص الحقيقية. بنهاية الدرس ستكون قادرًا على: استخدام التوابع الجاهزة على القوائم، وفهم ما يحدث للقائمة داخل التابع، وتحويل السلاسل إلى قوائم بـ list وsplit.',
        en: 'Built-in functions served your strings, and today they open their eyes to lists: len, max, min and sum compress whole loops into one line. Then the stunning twist: pass a list into your function and modify it there — and find it modified back at the call site too! Meanwhile two worlds team up: strings split into lists of words, and real text analysis begins. By the end of this lesson you will be able to: use built-ins on lists, understand what happens to a list inside a function, and convert strings to lists with list and split.',
      },
    },
    {
      kind: 'predict',
      code: 'nums = [3, 41, 12, 9, 74, 15]\nprint(len(nums))\nprint(max(nums))\nprint(sum(nums))',
      question: {
        ar: 'ثلاثة توابع جاهزة تُقذف بالقائمة كلها. خمّن الأرقام الثلاثة قبل أن تشغّل.',
        en: 'Three built-ins are thrown the whole list. Guess the three numbers before you run it.',
      },
      reveal: {
        ar: 'يطبع 6 ثم 74 ثم 154. len عدا العناصر، وmax التقط الأكبر 74، وsum جمع الكل في 154. نفس التوابع التي كانت تحسب محارف سلسلتك — القائمة مجرد سلسلة أخرى في أعينها.',
        en: 'It prints 6 then 74 then 154. len counted the elements, max grabbed the biggest 74, and sum gathered all into 154. The same functions that counted your string characters — a list is just another sequence in their eyes.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'توابع جاهزة تقفز على الحلقات', en: 'Built-ins that leap over loops' },
      chunks: [
        {
          ar: 'توابع جاهزة تعمل على القوائم وتغنيك عن كتابة حلقات العدّ والجمع التي تدربت عليها في الفصل الخامس: nums = [3, 41, 12, 9, 74, 15] فيعطيك len(nums) هي 6، وmax(nums) هي 74، وmin(nums) هي 3، وsum(nums) هي 154. وبهذا تصبح المتوسط سطرًا واحدًا: sum(nums) / len(nums) تعطي 25.666... — نفس قيمة حلقة التراكم الكاملة.',
          en: 'Built-ins work on lists and spare you the counting and summing loops you drilled in chapter 5: for nums = [3, 41, 12, 9, 74, 15], len(nums) is 6, max(nums) is 74, min(nums) is 3, and sum(nums) is 154. The average becomes one line: sum(nums) / len(nums) gives 25.666... — the same value as the whole accumulation loop.',
        },
        {
          ar: 'لكن انتبه للحدود: sum تعمل فقط حين تكون عناصر القائمة أعدادًا، أما len وmax وmin فتعمل مع القوائم ذات العناصر النصية وكل ما يمكن مقارنته. والبرنامج الذي كتبته في الفصل الخامس لحساب المتوسط كان يحتاج متغيرين total وcount — اليوم يكفي قائمة واحدة تُلحق الأعداد ثم سطر الحساب في النهاية.',
          en: 'But mind the limits: sum works only when the list elements are numbers, while len, max and min also work on lists of strings and anything comparable. The chapter-5 average program needed two variables, total and count — today one list suffices: append the numbers as they come, then one computing line at the end.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'القائمة داخل التابع: مرجع لا نسخة', en: 'A list inside a function: a reference, not a copy' },
      chunks: [
        {
          ar: 'عندما تمرّر قائمة إلى تابع، يحصل التابع على مرجع للقائمة نفسها — لا نسخة منها. فإذا عدّل التابع على معامل القائمة تُلاحظ التغيير عند الاستدعاء. مثال الكتاب: التابع delete_head يحذف أول عنصر بـ del t[0]، وبعد استدعائه على letters تجدها صارت [\'b\', \'c\'] — المعامل t والمتغير letters اسمان لنفس الكائن (تسمية بديلة!).',
          en: "When you pass a list to a function, the function receives a reference to the very list — not a copy. If the function modifies the list parameter, the change shows at the call site. The book's example: the delete_head function deletes the first element with del t[0], and after calling it on letters you find it became ['b', 'c'] — the parameter t and the variable letters are two names for the same object (aliasing!).",
        },
        {
          ar: 'فماذا لم يحدث هذا مع الأعداد والسلاسل في الفصل الرابع؟ لأنها غير قابلة للتعديل: التابع كان يستلم قيمة ولا يستطيع تغيير الكائن الأصلي. القائمة القابلة للتعديل فتحت الباب لتوابع تعدّل بيانات المستدعي — قوة للتوابع المصممة عمدًا لذلك، وخطأ مخفي لمن ينسى. سنفحص هذا السلوك بحرص أكبر في الدرس الخامس.',
          en: "Why did this not happen with numbers and strings in chapter 4? Because they are immutable: the function received a value and could not touch the original object. The mutable list opened the door for functions that modify the caller's data — a power for functions designed for it, and a hidden bug for the forgetful. Lesson five will examine this behavior much more carefully.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'من سلسلة إلى قائمة: list وsplit', en: 'From string to list: list and split' },
      chunks: [
        {
          ar: "السلسلة سلسلة من المحارف، والقائمة سلسلة من القيم — والجسر بينهما التحويل. التابع الجاهز list يقسم السلسلة إلى قائمة محارف: s = 'spam' ثم t = list(s) فتصير t هي ['s', 'p', 'a', 'm']. وتذكّر تسمية التوابع المحجوزة: لا تسمِّ متغيرك list.",
          en: "A string is a sequence of characters and a list is a sequence of values — and the bridge between them is conversion. The built-in list breaks a string into a list of characters: s = 'spam' then t = list(s) leaves t as ['s', 'p', 'a', 'm']. And remember reserved built-in names: never name your variable list.",
        },
        {
          ar: "أما إن أردت كلمات لا حروف، فالتابع split يقسم السلسلة إلى قائمة كلمات عند المسافات: 'pining for the fjords'.split() تعطي ['pining', 'for', 'the', 'fjords'] ثم تختار كلمة بعامل الفهرس: [2] تعطي 'the'. ويمكن تمرير محدِّد (delimiter) يقسم عند محرف معين: 'spam-spam-spam'.split('-') تعطي ثلاث كلمات spam. وعكس split هو join، تابع سلاسل يجمّع قائمة كلمات بمحدِّد: '-'.join(t).",
          en: "But if you want words, not characters, the split method breaks a string into a list of words at the spaces: 'pining for the fjords'.split() gives ['pining', 'for', 'the', 'fjords'], then you pick a word with the index operator: [2] gives 'the'. You may pass a delimiter to split at a specific character: 'spam-spam-spam'.split('-') gives three spam words. The inverse of split is join, a string method that glues a list of words with a delimiter: '-'.join(t).",
        },
        {
          ar: 'والإثمار الحقيقي قادم من الملفات: سطر بريد حقيقي مثل From stephen.marquard@uct.ac.za Sat Jan 5 09:14:16 2008 ينقسم بـ split إلى قائمة كلمات مرتبة — فالكلمة الثالثة words[2] هي يوم الإرسال Sat. كل سطر ملف يصير قائمة يصوغها الفهرس — هذا هو تحليل الأسطر الذي سنبنيه في الدرس القادم.',
          en: 'The real harvest comes from files: a real mail line like From stephen.marquard@uct.ac.za Sat Jan 5 09:14:16 2008 splits with split into an ordered list of words — so the third word words[2] is the sending day Sat. Every file line becomes a list shaped by the index — that is the line parsing we will build next lesson.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تابع يمسّ قائمة، وسلسلة تنقسم', en: 'A function touches a list, a string splits' },
      code: "def delete_head(t):\n    del t[0]\n\nletters = ['a', 'b', 'c']\ndelete_head(letters)\nprint(letters)\n\nline = 'From stephen.marquard@uct.ac.za Sat Jan 5 09:14:16 2008'\nwords = line.split()\nprint(len(words))\nprint(words[0])\nprint(words[2])",
      explanation: {
        ar: "استدعينا delete_head على letters فحُذف 'a' وطُبعت ['b', 'c'] — التابع لم يعد شيئًا ولم ينسخ شيئًا: عدّل الكائن المشترك. ثم انقسم سطر البريد إلى سبع كلمات: الأولى 'From' والثالثة words[2] هي 'Sat' — يوم الإرسال خرج من السطر بمحرفين من الكود.",
        en: "We called delete_head on letters and 'a' vanished, printing ['b', 'c'] — the function returned nothing and copied nothing: it modified the shared object. Then the mail line split into seven words: the first 'From' and the third words[2] is 'Sat' — the sending day extracted from the line in two lines of code.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.average-list',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "القائمة nums معطاة بالقيم [3, 41, 12, 9, 74, 15] — برنامج المتوسط الذي كتبته في الفصل الخامس بحلقتين صار بلا حلقات: احسب total بـ sum وcount بـ len ثم average بقسمتهما، ثم اطبع ثلاثة أسطر بعامل التنسيق %: 'count: %d' ثم 'total: %d' ثم 'average: %g'. المتوقع: count: 6 وtotal: 154 وaverage: 25.6667.",
        en: "The list nums is given as [3, 41, 12, 9, 74, 15] — the average program you wrote in chapter 5 with two loops now runs loop-free: compute total with sum, count with len, then average by dividing them, then print three lines with the % format operator: 'count: %d', then 'total: %d', then 'average: %g'. Expected: count: 6, total: 154, average: 25.6667.",
      },
      starterCode: 'nums = [3, 41, 12, 9, 74, 15]\n# احسب total وcount وaverage بلا حلقات / compute total, count, average with no loops\n# ثم اطبع الأسطر الثلاثة بعامل % / then print the three %-formatted lines\n',
      solution: "nums = [3, 41, 12, 9, 74, 15]\ntotal = sum(nums)\ncount = len(nums)\naverage = total / count\nprint('count: %d' % count)\nprint('total: %d' % total)\nprint('average: %g' % average)",
      tests: [
        {
          id: 't1',
          name: { ar: 'total يساوي 154', en: 'total equals 154' },
          code: "assert total == 154, 'expected: 154 | actual: %r' % total",
          expected: '154',
        },
        {
          id: 't2',
          name: { ar: 'count يساوي 6 وaverage صحيح', en: 'count equals 6 and average is correct' },
          code: "assert count == 6 and abs(average - 25.666666666666668) < 1e-9, 'expected: count 6, average 25.6667 | actual: %r, %r' % (count, average)",
          expected: 'count: 6 / average: 25.6667',
        },
        {
          id: 't3',
          name: { ar: 'التقرير مطبوع بثلاثة أسطر', en: 'The report prints as three lines' },
          code: "assert 'count: 6' in __learner_output__ and 'total: 154' in __learner_output__ and 'average: 25.6667' in __learner_output__, ('expected: count: 6, total: 154, average: 25.6667 | actual: %r' % __learner_output__)",
          expected: 'count: 6 / total: 154 / average: 25.6667',
        },
      ],
      hints: [
        { ar: 'لا حلقات اليوم: sum يخزن المجموع، وlen يعدّ العناصر، والقسمة تعطي المتوسط.', en: 'No loops today: sum holds the total, len counts the elements, and division gives the average.' },
        { ar: 'عامل التنسيق من الفصل السادس: %d للأعداد الصحيحة و%g للعشرية المختصرة.', en: 'The chapter-6 format operator: %d for integers and %g for compact decimals.' },
        { ar: 'الهيكل:\ntotal = sum(nums)\ncount = len(nums)\naverage = total / count\nprint(\'count: %d\' % count)\nprint(\'total: %d\' % total)\nprint(\'average: %g\' % average)', en: "The skeleton:\ntotal = sum(nums)\ncount = len(nums)\naverage = total / count\nprint('count: %d' % count)\nprint('total: %d' % total)\nprint('average: %g' % average)" },
        { ar: "nums = [3, 41, 12, 9, 74, 15]\ntotal = sum(nums)\ncount = len(nums)\naverage = total / count\nprint('count: %d' % count)\nprint('total: %d' % total)\nprint('average: %g' % average)", en: "nums = [3, 41, 12, 9, 74, 15]\ntotal = sum(nums)\ncount = len(nums)\naverage = total / count\nprint('count: %d' % count)\nprint('total: %d' % total)\nprint('average: %g' % average)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-list-split',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "s = 'spam'\nt = list(s)\nprint(len(t))\nprint(t[0])\nprint('pining for the fjords'.split()[2])",
      solution: '4\ns\nthe',
      answer: '4\ns\nthe',
      hints: [
        { ar: "list('spam') يقسم السلسلة إلى محارفها الأربعة.", en: "list('spam') splits the string into its four characters." },
        { ar: 'أول محرف في spam هو s.', en: 'The first character of spam is s.' },
        { ar: 'split يعطي أربع كلمات، والفهرس [2] يختار الثالثة.', en: 'split gives four words, and index [2] picks the third.' },
        { ar: 'الخرْج:\n4\ns\nthe', en: 'The output:\n4\ns\nthe' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-reference',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'عرّفنا delete_head(t) الذي ينفّذ del t[0]. استدعيناها على القائمة letters = [\'a\', \'b\', \'c\']. ماذا تحتوي letters بعد الاستدعاء؟',
        en: "We defined delete_head(t) which runs del t[0], and called it on the list letters = ['a', 'b', 'c']. What does letters hold after the call?",
      },
      options: [
        { id: 'a', text: { ar: "['b', 'c'] — التابع عدّل القائمة الأصلية لأنه يستلم مرجعًا لها", en: "['b', 'c'] — the function modified the original list because it receives a reference to it" } },
        { id: 'b', text: { ar: "['a', 'b', 'c'] — التابع عدّل نسخة خاصة به", en: "['a', 'b', 'c'] — the function modified its own private copy" } },
        { id: 'c', text: { ar: 'ترمي TypeError لأن حذف عنصر داخل تابع ممنوع', en: 'It throws a TypeError because deleting inside a function is forbidden' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'المعامل t والمتغير letters اسمان لنفس الكائن.', en: 'The parameter t and the variable letters are two names for one object.' },
        { ar: 'القوائم قابلة للتعديل — فالتعديل داخل التابع يظهر خارجه.', en: 'Lists are mutable — so a modification inside the function shows outside.' },
        { ar: 'لو كان الوسيط سلسلة نصية غير قابلة للتعديل لتغير شيء.', en: 'Had the argument been an immutable string, nothing would change.' },
        { ar: "الجواب: أ — ['b', 'c']، وسنفصّل هذا السلوك في الدرس الخامس.", en: "Answer: a — ['b', 'c'], and lesson five will dissect this behavior." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-split',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'املأ الفرز: التابع الذي يقسم سلسلة نصية إلى قائمة من الكلمات عند المسافات، أو عند محدِّد تمرّره، هو ______.',
        en: 'Fill in the blank: the method that breaks a string into a list of words at the spaces — or at a delimiter you pass — is ______.',
      },
      answer: 'split',
      solution: 'split',
      hints: [
        { ar: 'هو تابع سلاسل لا تابع قوائم — تستدعيه على النص نفسه.', en: 'It is a string method, not a list method — you call it on the text itself.' },
        { ar: "جرب: 'a b c'.____() تعطي ['a', 'b', 'c'].", en: "Try: 'a b c'.____() gives ['a', 'b', 'c']." },
        { ar: 'وعكسه join يجمع القائمة إلى سلسلة.', en: 'And its inverse join glues a list back into a string.' },
        { ar: 'الجواب: split', en: 'Answer: split' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — تحليل سطور بريد\n# Your playground — parsing mail lines\n\nline1 = \'From zarah@media.berkeley.edu Fri Jan 4 18:10:48 2008\'\nline2 = \'spam-spam-spam\'\n\nwords = line1.split()\nprint(words)\nprint(\'day:\', words[2])\n\nemail = words[1]\nprint(\'email:\', email)\n\nprint(line2.split(\'-\'))\nprint(line2.split(\'-\')[1])\nprint(\' \'.join([\'pypath\', \'rocks\']))',
      prompt: {
        ar: 'جرّب بنفسك: قسّم أسطر البريد واختر أيام الإرسال، وجرّب عنوان البريد في words[1]. ثم العب بالمحدِّدات: split() بلا وسيط، وsplit(\'-\')، وsplit(\'@\') على العنوان، وعكسها join. وأخيرًا قارن max وmin على قائمة نصية [\'apple\', \'Banana\', \'date\'] — من سبق من؟ لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: split the mail lines and pick sending days, then examine the address in words[1]. Then play with delimiters: split() with no argument, split('-'), split('@') on the address, and the inverse join. Finally compare max and min on a string list ['apple', 'Banana', 'date'] — who comes first? No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل الرابع: في def delete_head(t): — ماذا نسمي t في الترويسة، وماذا نسمي letters عند الاستدعاء؟',
            en: 'Back to chapter 4: in def delete_head(t): — what do we call t in the header, and what do we call letters at the call?',
          },
          options: [
            { id: 'a', text: { ar: 't معامل، وletters وسيط', en: 't is a parameter, letters is an argument' } },
            { id: 'b', text: { ar: 't وسيط، وletters معامل', en: 't is an argument, letters is a parameter' } },
            { id: 'c', text: { ar: 'كلاهما متغيران عامّان', en: 'Both are global variables' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المعامل اسم يستقبل في التعريف، والوسيط قيمة تُرسل في الاستدعاء — واليوم تعلمنا أنهما مع القوائم يشيران لنفس الكائن.',
            en: 'A parameter is the name that receives in the definition, an argument is the value sent at the call — and today we learned that with lists both refer to the same object.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'أي تابع جاهز يرمي خطأً إذا كانت عناصر القائمة سلاسل نصية؟',
            en: 'Which built-in throws an error if the list elements are strings?',
          },
          options: [
            { id: 'a', text: { ar: 'sum — لأنه يجمع الأعداد فقط', en: 'sum — because it adds numbers only' } },
            { id: 'b', text: { ar: 'len — لأنه لا يقبل النصوص', en: 'len — because it refuses strings' } },
            { id: 'c', text: { ar: 'max — لأنه للأعداد فقط', en: 'max — because it is for numbers only' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'sum تعمل على الأعداد وحدها، بينما len وmax وmin تقبل أي عناصر قابلة للعدّ أو المقارنة — والسلاسل تقارن أبجديًا كما رأيت في الفصل السادس.',
            en: 'sum works on numbers alone, while len, max and min accept anything countable or comparable — and strings compare alphabetically as you saw in chapter 6.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ماذا يعيد \'spam-spam-spam\'.split(\'-\')؟',
            en: "What does 'spam-spam-spam'.split('-') return?",
          },
          options: [
            { id: 'a', text: { ar: "['spam', 'spam', 'spam'] — قائمة من ثلاث كلمات", en: "['spam', 'spam', 'spam'] — a list of three words" } },
            { id: 'b', text: { ar: "'spam spam spam' — سلسلة واحدة", en: "'spam spam spam' — one string" } },
            { id: 'c', text: { ar: 'spam — الكلمة الأولى فقط', en: 'spam — the first word only' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المحدِّد يرسم حدود القطع عند كل شرطة — والناتج قائمة. لاحظ أن المحدِّد نفسه لا يدخل النتيجة.',
            en: 'The delimiter draws the cutting lines at every hyphen — and the result is a list. Notice the delimiter itself never enters the result.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل السابع: سطر قادم من ملف بريد يبدأ بـ From — أي نمط من اليومين السابقين يعطيك كلماته فورًا؟',
            en: 'From chapter 7: a mail file line starts with From — which pattern from these past two lessons hands you its words at once?',
          },
          options: [
            { id: 'a', text: { ar: 'line.split() — فيصير السطر قائمة كلمات مفهرسة', en: 'line.split() — the line becomes an indexed list of words' } },
            { id: 'b', text: { ar: 'del line[0] — لحذف كلمة From', en: 'del line[0] — to delete the word From' } },
            { id: 'c', text: { ar: 'sum(line) — لجمع محارفه', en: 'sum(line) — to add up its characters' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split هو القطار الذي يحمل أسطر الملفات إلى عالم القوائم — وفي الدرس القادم ستبني عليه برنامج تحليل أسطر كاملًا.',
            en: 'split is the train that carries file lines into the land of lists — and next lesson you will build a full line-analysis program on top of it.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'nums = [3, 1, 2]\nnums = nums.sort()\nprint(sum(nums))',
          right: 'nums = [3, 1, 2]\nnums.sort()\nprint(sum(nums))',
          note: {
            ar: 'إسناد نتيجة sort وضعت None مكان القائمة، فصار sum(None) يرمي TypeError. التوابع المعدِّلة لا تُسَنَّد.',
            en: 'Assigning the sort result put None in place of the list, so sum(None) throws a TypeError. Modifying methods are never assigned.',
          },
        },
        {
          wrong: "s = 'hello'\ns[0] = 'H'",
          right: "s = 'hello'\ns2 = 'H' + s[1:]",
          note: {
            ar: 'list(s) تُنتج قائمة قابلة للتعديل، لكن s نفسها بقيت سلسلة ثابتة: إسناد محرف فيها يرمي TypeError. حولها بقائمة أو ابنِ سلسلة جديدة.',
            en: 'list(s) produces a mutable list, but s itself stays an immutable string: assigning to its character throws a TypeError. Convert to a list or build a new string.',
          },
        },
        {
          wrong: 'list = [1, 2, 3]\nwords = list("spam")',
          right: 'items = [1, 2, 3]\nwords = list("spam")',
          note: {
            ar: 'list اسم تابع جاهز محجوز: أسندت له قائمة فصار التابع التالي يرمي TypeError: object is not callable. احترم أسماء التوابع الجاهزة كما فعلت مع max في الفصل الرابع.',
            en: 'list is a reserved built-in name: after assigning a list to it, the next conversion throws TypeError: object is not callable. Respect built-in names as you did with max in chapter 4.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'len وmax وmin وsum تقفز على الحلقات: عددًا وأكبرًا وأصغرًا ومجموعًا في سطور — وsum للأعداد فقط.', en: 'len, max, min and sum leap over loops: count, largest, smallest and total in lines — with sum for numbers only.' },
        { ar: 'القائمة تمرّ إلى التابع كمرجع: delete_head عدّل قائمة المستدعي نفسها — لأن t وletters اسمان لكائن واحد قابل للتعديل.', en: 'A list travels into a function as a reference: delete_head modified the very caller list — because t and letters are two names of one mutable object.' },
        { ar: 'list يقسم السلسلة إلى محارف، وsplit يقسمها إلى كلمات (أو عند محدِّد)، وjoin يعكس العملية — وبهما يتحول كل سطر ملف إلى قائمة كلمات مفهرسة.', en: 'list breaks a string into characters, split breaks it into words (or at a delimiter), and join reverses the operation — turning every file line into an indexed list of words.' },
      ],
      reflectPrompt: {
        ar: 'البرنامج الذي احتاج في الفصل الخامس متغيرين وحلقة كاملة صار اليوم قائمة وسطرين. اذكر عملية إحصائية أخرى تدربت عليها في الفصل الخامس (أكبر قيمة؟ تكرار؟) وصُغ نسختها الجديدة بالقوائم في سطر أو سطرين.',
        en: 'A program that needed two variables and a whole loop in chapter 5 became a list and two lines today. Name another statistical operation you drilled in chapter 5 (largest value? repetition?) and phrase its new list version in one or two lines.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch8.s8', pages: 'ص125 / pp.125' },
        { book: 'PY4E', section: 'py4e.ch8.s9', pages: 'ص127 / pp.127' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch8.s8', pages: 'ص125 / pp.125' },
    { book: 'PY4E', section: 'py4e.ch8.s9', pages: 'ص127 / pp.127' },
  ],
} satisfies Lesson;

export default lesson;
