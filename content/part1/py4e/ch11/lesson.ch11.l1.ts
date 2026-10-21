import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch11.l1 — "Matching Characters with Regular Expressions /
 * مطابقة المحارف بالتعبيرات النمطية"
 * Aligned with PY4E ch11 s1 (مطابقة المحارف).
 * All expression is original.
 * Lines are embedded as a fixed list (no file needed, deterministic).
 */
const lesson = {
  id: 'py4e.ch11.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 11,
  title: { ar: 'مطابقة المحارف بالتعبيرات النمطية', en: 'Matching Characters with Regular Expressions' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch10.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'عشرة فصول ونحن نفحص النصوص بالقطع: find للمواضع، وsplit للكلمات، والتجزئة للقطع — وكل مهمة بحث واستخراج كانت تحتاج تركيبًا يدويًا جديدًا. اليوم بايثون تفتح لك لغةً صغيرة كاملة داخل لغتها: التعابير النمطية، مخصصة لوصف شكل النص الذي تبحث عنه. بنهاية الدرس ستكون قادرًا على: استيراد مكتبة re وكتابة أول بحث بـ re.search، والتفريق بين find وsearch، وتقييد المطابقة ببداية السطر بالرمز ^، وشرح لماذا يطابق "From:" سطرًا لا يطابقه "^From:".',
        en: 'Ten chapters of slicing our way through text: find for positions, split for words, slices for pieces — and every search-and-extract task needed fresh hand assembly. Today Python opens a whole small language inside its own: regular expressions, dedicated to describing the shape of the text you seek. By the end of this lesson you will be able to: import the re library and write your first re.search, tell find and search apart, pin matching to the start of the line with the ^ symbol, and explain why "From:" matches a line that "^From:" refuses.',
      },
    },
    {
      kind: 'predict',
      code: "import re\nlines = ['From: stephen@uct.ac.za', 'Spam: From: not really']\nfor line in lines:\n    if re.search('From:', line):\n        print(line)\nprint('---')\nfor line in lines:\n    if re.search('^From:', line):\n        print(line)",
      question: {
        ar: 'الحلقة الأولى تطبع كم سطرًا، والحلقة الثانية كم؟ والرمز ^ الذي ظهر فجأة — ماذا صنف من رفض؟',
        en: 'How many lines does the first loop print, and how many the second? And the ^ symbol that suddenly appeared — what kind of refusal is it making?',
      },
      reveal: {
        ar: 'الأولى سطران: "From:" تطابق السلسلة في أي موضع — حتى وسط "Spam: From: not really". الثانية سطر واحد: ^ تقيّد المطابقة ببداية السطر، والسطر الثاني يبدأ بـ Spam فاستُبعد. محرف واحد فصل بين قبول كل شيء وقبول البداية فقط — هذه أول قوة حقيقية في التعابير النمطية.',
        en: 'The first prints two: "From:" matches the substring anywhere — even mid-way through "Spam: From: not really". The second prints one: ^ pins the match to the start of the line, and the line beginning with Spam is excluded. One character separated accepting-everything from accepting-the-start-only — the first real power of regular expressions.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'لغة صغيرة داخل اللغة', en: 'A small language inside the language' },
      chunks: [
        {
          ar: 'البحث في الأسطر واستخراج البيانات منها مهمة تتكرر في كل برنامج نصي، لذلك تمنح بايثون مكتبة كاملة اسمها re — مكتبة التعابير النمطية. التعابير النمطية لغة برمجة خاصة بعمليات البحث والتحليل في السلاسل النصية: تكتب سلسلة قصيرة تصف شكل السطر الذي تريده، والمكتبة تفحص كل سطر عنك. كتبت عن هذه اللغة كتب كاملة؛ سنأخذ في هذا الفصل أساسياتها التي تكفي لمعظم أعمال التحليل، ونبدأ بأبسط تابع فيها: re.search(النمط، السطر).',
          en: 'Searching lines and extracting data repeats in every text program, so Python ships a whole library named re — the regular expressions library. A regular expression is a small programming language dedicated to searching and analyzing strings: you write a short string describing the shape of the line you want, and the library inspects every line for you. Whole books have been written about this language; this chapter covers the essentials that serve most analysis work, starting from its simplest tool: re.search(pattern, line).',
        },
        {
          ar: 'يُستدعى import re مرة في أول البرنامج، ثم تعمل re.search مع كل سطر داخل حلقة for كما فعلنا مع الملفات في الفصل السابع. التابع يعيد كائن مطابقة حين يجد النمط، وNone حين يخفق — والكائن قيمة صادقة والـ None كاذبة، لذا يعمل الاستدعاء مباشرة داخل if دون أي مقارنة إضافية.',
          en: 'import re runs once at the top of the program, then re.search works line by line inside a for loop just like the files of chapter 7. The method returns a match object when the pattern is found and None when it fails — the object is truthy and None is falsy, so the call sits directly inside an if with no extra comparison.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'search مقابل find: حرفي في مواجهة لغة', en: 'search vs find: literal meets language' },
      chunks: [
        {
          ar: 're.search("From:", line) يطابق النص الحرفي From: في أي موضع من السطر — وهذا بالضبط ما كان line.find("From:") يفعله منذ الفصل السادس: كلاهما يجد سلسلة جزئية، والفرق في العائد. find يعيد موضعًا رقميًا أو 1- عند الفشل، وsearch يعيد كائن مطابقة أو None، وكلاهما صالح للاختبار داخل if. برنامج الفصل الأول في التعابير النمطية لا يظهر قوتها بعد: نفس النتيجة كانت ممكنة بـ find.',
          en: 're.search("From:", line) matches the literal text From: anywhere in the line — exactly what line.find("From:") has done since chapter 6: both locate a substring, and the difference is the return. find gives a numeric position or -1 on failure; search gives a match object or None; both test fine inside an if. The first regular-expression program does not yet show its power: the same result was possible with find.',
        },
        {
          ar: 'القوة تظهر حين نضيف الرموز الخاصة إلى النمط: محارف لا تعني نفسها بل تعني قواعد — بداية سطر، أو محرف مجهول، أو تكرار. كل رمز تتعلمه في هذا الفصل يزيد دقة مطابقتك دون أن تكشف سطرًا برمجيًا إضافيًا. أول هذه الرموز وأشهرها: ^.',
          en: 'The power shows when special symbols enter the pattern: characters that do not mean themselves but rules — a line start, an unknown character, a repetition. Every symbol you learn this chapter sharpens the match without adding a single extra line of code. The first and most famous of these symbols: ^.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المرساة ^: بداية السطر فقط', en: 'The ^ anchor: start of the line only' },
      chunks: [
        {
          ar: 'الرمز ^ في مطلع النمط يجعل المطابقة تبدأ من أول محرف في السطر: "^From:" تطابق الأسطر التي تبدأ بـ From: فقط، وترفض السطر الذي يظهر فيه From: بعد كلمات أخرى. بهذا فلترنا أسطر الرسائل من بين مئات الترويسات. وهنا كان بإمكاننا استعمال startswith() من الفصل السادس والحصول على النتيجة نفسها — الكتاب يقولها بصراحة: هذا المثال بسيط جدًا، وغايته أن يثبت أن التعابير النمطية تستخدم رموزًا خاصة لمزيد من التحكم، وأن ما تعرفه من فصول سابقة يظل صالحًا.',
          en: 'The ^ symbol at the head of a pattern makes matching begin at the first character of the line: "^From:" matches only lines starting with From: and refuses lines where From: appears after other words. That alone filters message lines out of hundreds of headers. startswith() from chapter 6 could have produced the same result here — the book says it plainly: this example is very simple, its point is proving that regular expressions use special symbols for finer control, and that what you know from earlier chapters still holds.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'فلترة أسطر From: بالمرساة', en: 'Filtering From: lines with the anchor' },
      code: "import re\nlines = [\n    'From: stephen.marquard@uct.ac.za',\n    'Return-Path: From: postmaster@collab.sakaiproject.org',\n    'From: cwen@iupui.edu',\n    'Author: stephen.marquard@uct.ac.za',\n]\nfor line in lines:\n    line = line.rstrip()\n    if re.search('^From:', line):\n        print(line)",
      explanation: {
        ar: 'استدعاء rstrip من الفصل السابع ينظف نهاية السطر، وحلقة for من الفصل الخامس تمشي سطرًا سطرًا، ثم re.search يفحص النمط ^From: في كل سطر. السطران الأول والثالث يبدآن بـ From: فيُطبعان؛ والسطر الثاني يحوي From: في وسطه بعد Return-Path: فترفضه المرساة؛ والرابع لا يحوي النمط أصلًا. لاحظ أن if لم يقارن النتيجة بأي شيء — وجود كائن المطابقة كافٍ ليكون صادقًا.',
        en: 'rstrip from chapter 7 cleans the line end, the for loop from chapter 5 walks line by line, then re.search tests the pattern ^From: on each line. Lines one and three start with From: and print; line two holds From: mid-way after Return-Path: so the anchor refuses it; line four never contained the pattern. Notice the if compares the result to nothing — the mere presence of a match object is truthy enough.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.anchor-filter',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "الأسطر معطاة في المحرر. اكتب حلقة for تمشي عليها، وداخل الحلقة استخدم re.search بنمط يبدأ بالرمز ^ ليطابق السطور التي تبدأ بـ Author: فقط؛ وكل سطر مطابق أضفه إلى قائمة hits واطبعه. المتوقع طباعة سطرين فقط: Author: csev@umich.edu ثم Author: cwen@iupui.edu.",
        en: "The lines are given in the editor. Write a for loop over them, and inside it use re.search with a pattern starting with ^ that matches only lines beginning with Author:; add every matching line to a list named hits and print it. Expected: exactly two lines printed — Author: csev@umich.edu then Author: cwen@iupui.edu.",
      },
      starterCode: "lines = ['Author: csev@umich.edu', 'X-Author: hidden', 'Author: cwen@iupui.edu', 'Spam: Author: no']\nimport re\nhits = []\n# حلقة + re.search بنمط ^Author: / loop + re.search with the ^Author: pattern\n",
      solution: "import re\nlines = ['Author: csev@umich.edu', 'X-Author: hidden', 'Author: cwen@iupui.edu', 'Spam: Author: no']\nhits = []\nfor line in lines:\n    if re.search(r'^Author:', line):\n        hits.append(line)\n        print(line)",
      tests: [
        {
          id: 't1',
          name: { ar: 'hits تحوي السطرين الصحيحين فقط', en: 'hits holds exactly the two correct lines' },
          code: "assert hits == ['Author: csev@umich.edu', 'Author: cwen@iupui.edu'], 'expected: two Author lines | actual: %r' % (hits,)",
          expected: 'two Author lines',
        },
        {
          id: 't2',
          name: { ar: 'السطران مطبوعان', en: 'Both lines are printed' },
          code: "assert 'Author: csev@umich.edu' in __learner_output__ and 'Author: cwen@iupui.edu' in __learner_output__, ('expected: both Author lines | actual: %r' % __learner_output__)",
          expected: 'both Author lines',
        },
        {
          id: 't3',
          name: { ar: 'X-Author استُبعد — المرساة عملت', en: 'X-Author excluded — the anchor worked' },
          code: "assert 'X-Author' not in __learner_output__ and 'Spam' not in __learner_output__, ('expected: no X-Author or Spam lines | actual: %r' % __learner_output__)",
          expected: 'no X-Author or Spam lines',
        },
      ],
      hints: [
        { ar: 'ما الذي يميز السطر المطلوب عن "X-Author: hidden"؟ الموضع — الأول لا غير.', en: 'What separates the wanted line from "X-Author: hidden"? The position — start only.' },
        { ar: 'المرساة ^ تُكتب أول النمط نفسه: "^Author:" داخل re.search.', en: 'The anchor ^ is written at the very start of the pattern: "^Author:" inside re.search.' },
        { ar: 'الهيكل:\nfor line in lines:\n    if re.search(r"^Author:", line):\n        hits.append(line)\n        print(line)', en: 'The skeleton:\nfor line in lines:\n    if re.search(r"^Author:", line):\n        hits.append(line)\n        print(line)' },
        { ar: "for line in lines:\n    if re.search(r'^Author:', line):\n        hits.append(line)\n        print(line)", en: "for line in lines:\n    if re.search(r'^Author:', line):\n        hits.append(line)\n        print(line)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-anchor',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import re\nline = 'X-Spam: From: here'\nprint(bool(re.search('From:', line)))\nprint(bool(re.search('^From:', line)))\nprint(line.find('From:') > 0)",
      solution: 'True\nFalse\nTrue',
      answer: 'True\nFalse\nTrue',
      hints: [
        { ar: 'السؤال الأول: هل From: موجود في السطر أيًّا كان موضعها؟', en: 'First question: is From: present anywhere in the line?' },
        { ar: 'السؤال الثاني: هل يبدأ السطر نفسه بـ From:؟ تذكّر أن المرساة تشتد على أول محرف.', en: 'Second question: does the line itself start with From:? Remember the anchor binds the very first character.' },
        { ar: 'السؤال الثالث: find يعيد الموضع الرقمي — From: تبدأ عند المحرف الثامن، و8 أكبر من صفر.', en: 'Third question: find returns the numeric position — From: starts at the eighth character, and 8 is greater than zero.' },
        { ar: 'الخرْج:\nTrue\nFalse\nTrue', en: 'The output:\nTrue\nFalse\nTrue' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-anchor',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا يفعل الرمز ^ حين يقع في مطلع التعبير النمطي؟',
        en: 'What does the ^ symbol do when placed at the head of a regular expression?',
      },
      options: [
        { id: 'a', text: { ar: 'يقيّد المطابقة ببداية السطر', en: 'Pins the match to the start of the line' } },
        { id: 'b', text: { ar: 'يلغي النمط ويطابق كل شيء', en: 'Cancels the pattern and matches everything' } },
        { id: 'c', text: { ar: 'يطابق محرف ^ الحرفي في وسط السطر', en: 'Matches the literal ^ character mid-line' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'راجع predict: نفس السطر قبِله النمط العادي ورفضه النمط المرسّى.', en: 'Revisit the prediction: the same line passed the plain pattern and failed the anchored one.' },
        { ar: 'اسمه بالإنجليزية anchor أي مرساة — والمرساة تثبت السفينة عند أول السطر.', en: 'Its English name is anchor — and an anchor pins the ship at the head of the line.' },
        { ar: 'بلا المرساة يطابق النمط من أي موضع — معها من أول محرف لا غير.', en: 'Without the anchor the pattern matches from any position — with it, from the first character only.' },
        { ar: 'الجواب: يقيّد المطابقة ببداية السطر.', en: 'Answer: it pins the match to the start of the line.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-search',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: نستدعي re.____(النمط، السطر) لفحص وجود النمط في السطر — تعيد كائن مطابقة أو None.',
        en: 'Fill the blank with one word: we call re.____(pattern, line) to test whether the pattern exists in the line — it returns a match object or None.',
      },
      answer: 'search',
      solution: 'search',
      hints: [
        { ar: 'اسم التابع هو نفسه الفعل الذي يصف عمله: يبحث.', en: 'The method name is the very verb describing its job: it searches.' },
        { ar: 'هو التابع الوحيد من مكتبة re الذي استعملناه في هذا الدرس.', en: 'It is the only re-library method used in this lesson.' },
        { ar: 'ستة أحرف وتبدأ بـ s وتنتهي بـ h.', en: 'Six letters, starts with s, ends with h.' },
        { ar: 'الجواب: search', en: 'Answer: search' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — مرساتك الأولى\n# Your playground — your first anchor\n\nimport re\n\nlines = [\n    "From: a@b.c",\n    "Spam: From: nope",\n    "FromX: tricky",\n    "from: lowercase",\n]\nfor line in lines:\n    if re.search("From:", line):\n        print("anywhere:", line)\nfor line in lines:\n    if re.search("^From:", line):\n        print("anchored:", line)\nprint(re.search("^From:", "From: yes"))\nprint(re.search("^From:", "no match here"))',
      prompt: {
        ar: 'جرّب بنفسك: أضف أسطرًا جديدة واقلب بين "From:" و"^From:" ولاحظ الحصيلة، ثم جرّب "^FromX:" و"FromX" واقرأ ما يعيده re.search نفسه حين ينجح (سطر يبدأ بـ <re.Match...) وحين يخفق (None). لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add new lines and flip between "From:" and "^From:" watching the harvest, then try "^FromX:" and "FromX" and read what re.search itself returns on success (a line starting <re.Match...) and on failure (None). No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي النمطين يطبع السطر "Spam: From: not really"؟',
            en: 'Which pattern prints the line "Spam: From: not really"?',
          },
          options: [
            { id: 'a', text: { ar: '"From:" بلا مرساة — لأن السلسلة موجودة في وسط السطر', en: '"From:" without the anchor — the substring sits mid-line' } },
            { id: 'b', text: { ar: '"^From:" — لأن المرساة تقبل أي موضع', en: '"^From:" — the anchor accepts any position' } },
            { id: 'c', text: { ar: 'لا يطبعانه — السطر لا يحوي النمط', en: 'Neither — the line lacks the pattern' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المرساة تشدّد البداية، والسطر يبدأ بـ Spam — فيرفضه "^From:"؛ بينما "From:" تبحث في أي موضع فتجدها بعد الكلمة الأولى.',
            en: 'The anchor hardens the start, and the line begins with Spam — so "^From:" refuses it; while "From:" searches any position and finds it after the first word.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السادس: أي تابع سلسلة يعطي الحكم نفسه الذي يعطيه re.search("^From:", line) في هذا الدرس؟',
            en: 'From chapter 6: which string method delivers the same verdict as re.search("^From:", line) does in this lesson?',
          },
          options: [
            { id: 'a', text: { ar: 'line.startswith("From:")', en: 'line.startswith("From:")' } },
            { id: 'b', text: { ar: 'line.lower()', en: 'line.lower()' } },
            { id: 'c', text: { ar: 'line.replace("From:", "")', en: 'line.replace("From:", "")' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب نفسه أقرّ بأمنا: في حالة "^From:" كان startswith يكفي — قوة التعابير النمطية تبدأ حين تتجاوز الحرفية إلى الرموز الخاصة.',
            en: 'The book itself concedes it: for "^From:" startswith suffices — regex power begins when you go beyond literals into special symbols.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الخامس: في حلقة for line in lines التي تحوي أربعة أسطر — كم مرة تُستدعى re.search وما اسم line؟',
            en: 'From chapter 5: in the loop for line in lines holding four lines — how many times is re.search called, and what is line called?',
          },
          options: [
            { id: 'a', text: { ar: 'أربع مرات — وline متغير التكرار يأخذ سطرًا في كل دورة', en: 'Four times — and line is the iteration variable taking one line per pass' } },
            { id: 'b', text: { ar: 'مرة واحدة — وline القائمة كلها', en: 'Once — and line is the whole list' } },
            { id: 'c', text: { ar: 'ثماني مرات — مرتان لكل سطر', en: 'Eight times — twice per line' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نمط for المحدد: دورة لكل عنصر — وفحص re.search يقع داخل جسد الحلقة فيتكرر بعدد الأسطر.',
            en: 'The definite-for pattern: one pass per element — and the re.search check sits in the loop body, repeating with the line count.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ماذا يعيد re.search حين لا يجد النمط في السطر؟',
            en: 'What does re.search return when the pattern is absent from the line?',
          },
          options: [
            { id: 'a', text: { ar: 'None — وهي قيمة كاذبة تفشل داخل if بصمت', en: 'None — a falsy value that fails inside an if silently' } },
            { id: 'b', text: { ar: 'يعيد عددًا سالبًا في حال الفشل، مثل find', en: '-1, like find' } },
            { id: 'c', text: { ar: 'قائمة فارغة', en: 'An empty list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'search من عائلة كائنات المطابقة: إما كائن صادق أو None — بينما find يعيد 1- وfindall يعيد قائمة فارغة؛ كل أداة بلغة عائدها.',
            en: 'search belongs to the match-object family: either a truthy object or None — while find returns -1 and findall an empty list; each tool speaks its own return language.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'if line.find("^From:") > 0:',
          right: "if re.search(r'^From:', line):",
          note: {
            ar: 'find لا يفهم الرموز الخاصة: سيبحث حرفيًا عن محارف ^From: الأربعة في السطر ولن يجدها أبدًا. الرموز الخاصة لغة re.search وحدها.',
            en: 'find understands no special symbols: it would literally hunt for the four characters ^From: in the line and never find them. Special symbols are the language of re.search alone.',
          },
        },
        {
          wrong: 'if line.find("From:"):',
          right: "if re.search('From:', line):",
          note: {
            ar: 'فخ الصفر: find يعيد 0 حين تبدأ السطر بالنص، وصفر قيمة كاذبة فيتخطى if السطر الصحيح تمامًا! إن أردت find فاختبر صراحة: > = 0.',
            en: 'The zero trap: find returns 0 when the line starts with the text, and 0 is falsy, so the if skips the perfectly correct line! If you insist on find, test explicitly: >= 0.',
          },
        },
        {
          wrong: 're.search(line, "^From:")',
          right: "re.search('^From:', line)",
          note: {
            ar: 'تبديل الوسيطين عطل صامت: ستبحث المكتبة عن السطر كله داخل النمط القصير فتعيد None دائمًا — لا خطأ ولا إنذار، فقط فلتر ميت.',
            en: 'Swapped arguments are a silent fault: the library would hunt for the whole line inside the short pattern and always return None — no error, no warning, just a dead filter.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'التعابير النمطية لغة صغيرة داخل بايثون للبحث والتحليل في النصوص — تُستدعى بمكتبة re قبل الاستعمال.', en: 'Regular expressions are a small language inside Python for searching and analyzing text — import re before use.' },
        { ar: 're.search(النمط، السطر) يعيد كائن مطابقة أو None — وكلاهما يعمل مباشرة داخل if دون مقارنة.', en: 're.search(pattern, line) returns a match object or None — both work directly inside an if with no comparison.' },
        { ar: 'النمط الحرفي يطابق أي موضع، والمرساة ^ تقيّد المطابقة ببداية السطر — محرف واحد يغيّر الفلسفة.', en: 'A literal pattern matches any position; the ^ anchor pins matching to the start of the line — one character flips the philosophy.' },
        { ar: 'find وstartswith يبقيان صالحين للنصوص الحرفية — والتعابير النمطية تتألق عند أول رمز خاص تدخله النمط.', en: 'find and startswith remain valid for literal text — regular expressions shine the moment the first special symbol enters the pattern.' },
      ],
      reflectPrompt: {
        ar: 'صندوق بريدك يضم ترويسات Subject: وX-Sender: وFrom:. لو أردت طباعة الأسطر التي تبدأ بـ Subject: فقط، ما النمط الذي تكتبه؟ وماذا كان سيحدث لو أزلت ^ ووُجد سطر فيه كلمة Subject في وسطه؟',
        en: 'Your mailbox holds Subject:, X-Sender: and From: headers. To print only lines starting with Subject:, which pattern do you write? And what would happen if you dropped ^ and a line carried the word Subject mid-way?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch11.s1', pages: 'ص173 / pp.173' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch11.s1', pages: 'ص173 / pp.173' },
  ],
} satisfies Lesson;

export default lesson;
