import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch7.l3 — "Searching Through a File / البحث خلال ملف"
 * Aligned with PY4E ch7 s5 (البحث خلال ملف).
 * All expression is original.
 * The book's spam-confidence program is adapted to a self-created sample file
 * (spamconf.txt) — deterministic, no downloads, no input().
 */
const lesson = {
  id: 'py4e.ch7.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 7,
  title: { ar: 'البحث خلال ملف', en: 'Searching Through a File' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch7.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الملف الحقيقي طويل ومزعج: آلاف الأسطر وأنت تريد خمسة منها فقط. البحث خلال ملف هو مصاهرة نمط تصفية الحلقات من الفصل الخامس مع توابع السلاسل من الفصل السادس — فتصير بايثون مكتشفَ بيانات: تعرض السطر المهم، تتخطى آلاف الأسطر المملة، وتستخرج الأرقام وتحسب متوسطها. بنهاية الدرس ستكون قادرًا على: تصفية الأسطر بـ startswith وcontinue، وتنظيف السطر بـ rstrip، وقصّ ما بعد النقطتين وتحويله بـ float تحت حماية try.',
        en: 'A real file is long and boring: thousands of lines when you want five. Searching through a file is the marriage of the filter pattern from chapter 5 with the string tools of chapter 6 — turning Python into a data detector: show the interesting line, skip thousands of dull ones, extract numbers and average them. By the end of this lesson you will be able to: filter lines with startswith and continue, clean a line with rstrip, and slice what follows the colon and convert it with float under the guard of try.',
      },
    },
    {
      kind: 'predict',
      code: "line = 'From: sara@x.com\\n'\nprint(line.startswith('From:'))\nprint('hello'.find('z'))",
      question: {
        ar: 'ماذا يطبع السطران؟ السؤال الأول عن البادئة، والثاني عن سلسلة غائبة.',
        en: 'What do the two lines print? The first asks about a prefix, the second about a missing substring.',
      },
      reveal: {
        ar: 'يطبع True ثم -1. تابع الصنف startswith يسأل: هل تبدأ السلسلة بهذه البادئة؟ فيجيب بقيمة منطقية. وfind — من الفصل السادس — يعيد موقع السلسلة، وإذا لم يجدها يعيد -1. هاتان الأداتان هما عينا برنامج البحث اليوم.',
        en: 'It prints True then -1. The string method startswith asks: does the string start with this prefix? and answers with a logical value. And find — from chapter 6 — returns the position, or -1 when the substring is absent. These two tools are the eyes of today’s search program.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التصفية: أسطر مهمة وتخطي البقية', en: 'Filtering: interesting lines, skip the rest' },
      chunks: [
        {
          ar: 'عند البحث في ملف من الشائع تجاهل معظم السطور والتركيز على التي تفي بشرط. نجمع نمط حلقة الملف مع تابع البادئة: داخل الحلقة نستدعي if line.startswith(\'From: \') فنطبع السطر المهم فقط. ونعم — يظهر بعد كل سطر مطبوع سطر فارغ، لأن السطر القادم من الملف ينتهي بمحرف سطر جديد تطبعه print ثم تضيف هي سطرًا آخر.',
          en: "When searching a file it is very common to ignore most lines and focus on those meeting a condition. We combine the file-loop pattern with the prefix method: inside the loop we call if line.startswith('From: ') and print only the interesting line. And yes — an extra blank line shows after each printed one, because a line from the file ends with a newline that print emits, then print adds its own.",
        },
        {
          ar: "العلاج الأنسب تابع rstrip الذي يحذف المسافات البيضاء من نهاية السلسلة — ومنها محرف السطر الجديد: line = line.rstrip() فيصير السطر نظيفًا للطباعة والمقارنة. أما هيكلة الحلقة الأنيقة فتستخدم continue من الفصل الخامس: أسطر غير مهمة؟ if not line.startswith('From:'): continue يتخطاها، وما دون continue يعالج المهمة فقط.",
          en: "The neatest cure is rstrip, which strips whitespace from the end of the string — the newline included: line = line.rstrip() and the line becomes clean for printing and comparing. And the elegant loop structure uses continue from chapter 5: uninteresting lines? if not line.startswith('From:'): continue skips them, and everything below continue handles only the interesting ones.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التقطيع: استخرج القيمة من السطر', en: 'Slicing: extract the value from the line' },
      chunks: [
        {
          ar: "السطر المهم غالبًا يحمل بيانات نريدها: 'X-DSPAM-Confidence: 0.8475'. بالأدوات السداسية نستخرجها: find(':') يحدد موقع النقطتين، ثم نقطّع من بعده. احذر الحساب الدقيق: المحرف التالي للنقطتين فراغ، فالقيمة تبدأ عند الموقع pos + 2 — خطأ بمقدار واحد يلصق فراغًا بأول رقم.",
          en: "An interesting line usually carries data we want: 'X-DSPAM-Confidence: 0.8475'. With the chapter-6 tools we extract it: find(':') locates the colon, then we slice from after it. Mind the precise arithmetic: the character right after the colon is a space, so the value starts at pos + 2 — an off-by-one glues a space onto your first digit.",
        },
        {
          ar: "وfind لا يعيد موقعًا دائمًا: إذا غابت السلسلة أرجع -1، لذا يستخدمه الكتاب كفلتر أيضًا: if line.find('@uct.ac.za') == -1: continue — تخطَّ كل سطر لا يحوي العنوان، واطبع البقية. هذا محاكاة أداة البحث في محرر النصوص: لا بادئة محددة، بل سلسلة في أي موضع من السطر.",
          en: "And find does not always return a position: an absent string gives -1, so the book also uses it as a filter: if line.find('@uct.ac.za') == -1: continue — skip every line lacking the address and print the rest. This mimics the search tool of a text editor: no fixed prefix, a substring anywhere in the line.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التحويل تحت الحماية: float داخل try', en: 'Conversion under guard: float inside try' },
      chunks: [
        {
          ar: "بعد القصّ تصير لدينا سلسلة نصية '0.8475' لا عددًا: float(piece) يترجمها إلى عدد قابل للجمع. لكن بيانات العالم وسخة — قد يأتي سطر تالف قيمته ليست رقمًا، فيصرخ float برسالة ValueError وينهار البرنامج كله في منتصف ملف طويل.",
          en: "After slicing we hold a string like '0.8475', not a number: float(piece) translates it into something addable. But real-world data is dirty — a corrupted line may carry a non-numeric value, float screams ValueError, and the whole program collapses in the middle of a long file.",
        },
        {
          ar: "هنا يعود درسنا من الفصل الثالث: نغلق السطر الخطر داخل try ونضع في except شيفرة استعادة تُطبع رسالة Cannot parse ثم تكمل الحلقة. هكذا يمضي برنامج البحث فوق البيانات الفاسدة بدل أن يسقط عندها — حلقة، تصفية، تقطيع، حماية: أدوات أربعة فصول في برنامج واحد.",
          en: 'Here our chapter-3 lesson returns: wrap the risky line in try and place recovery code in except that prints Cannot parse and lets the loop go on. So the search program marches over rotten data instead of falling on it — a format operator, filtering, slicing, guarding: four chapters of tools in one program.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'متوسط الثقة: برنامج البريد المزعج', en: 'The confidence average: the spam program' },
      code: "out = open('spamconf.txt', 'w')\nout.write('From: sara@x.com\\n')\nout.write('X-DSPAM-Confidence: 0.8475\\n')\nout.write('Subject: hello\\n')\nout.write('X-DSPAM-Confidence: 0.6178\\n')\nout.close()\n\nfhand = open('spamconf.txt')\ntotal = 0\ncount = 0\nfor line in fhand:\n    line = line.rstrip()\n    if not line.startswith('X-DSPAM-Confidence:'):\n        continue\n    pos = line.find(':')\n    piece = line[pos + 2:]\n    try:\n        value = float(piece)\n    except:\n        print('Cannot parse:', piece)\n        continue\n    total = total + value\n    count = count + 1\nfhand.close()\nprint('count:', count)\nprint('average:', round(total / count, 5))",
      explanation: {
        ar: 'هذا هو برنامج الكتاب الشهير على ملف صنعناه بأنفسنا. تصفية startswith رمت كل الأسطر ما عدا سطري الثقة، وrstrip نضّفهما، والتقطيع من pos + 2 أخذ القيمة بعد النقطتين والفراغ، وfloat حوّلها، وفشل التحويل كان سيُمسك في except. المجموع 1.4653 على سطرين: المتوسط 0.73265 — عدّاد ومجموع من الفصل الخامس يعملان فوق ملف من الفصل السابع.',
        en: 'This is the book’s famous program over a file we made ourselves. The startswith filter threw away every line but the two confidence ones, rstrip cleaned them, pos + 2 sliced the value after the colon and the space, float converted it, and a failed conversion would be caught in except. The total 1.4653 over two lines: average 0.73265 — the counter and accumulator of chapter 5 running on a file from chapter 7.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.spam-average',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "اصنع ملفًا اسمه spamconf.txt بوضع 'w' واكتب فيه الأسطر الأربعة بالضبط: 'From: sara@x.com\\n' ثم 'X-DSPAM-Confidence: 0.8475\\n' ثم 'Subject: hello\\n' ثم 'X-DSPAM-Confidence: 0.6178\\n' ثم أغلقه. ثم افتحه للقراءة واعبر حلقة for: نظّف كل سطر بـ rstrip، وتخطَّ ما لا يبدأ بـ 'X-DSPAM-Confidence:' بـ continue، واستخرج القيمة بعد النقطتين بـ find ثم التقطيع، وحوّلها بـ float، واكمن التحويل في try/except يطبع 'Cannot parse:' عند الفشل. اتراكم العدد في count والمجموع في total، وأغلق الملف، ثم اطبع 'count:' مع count و'average:' مع round(total / count, 5).",
        en: "Make a file named spamconf.txt in 'w' mode and write exactly these four lines: 'From: sara@x.com\\n', 'X-DSPAM-Confidence: 0.8475\\n', 'Subject: hello\\n', 'X-DSPAM-Confidence: 0.6178\\n', then close it. Then open it for reading and run a for loop: clean each line with rstrip, skip lines not starting with 'X-DSPAM-Confidence:' using continue, extract the value after the colon with find then slicing, convert with float, and guard the conversion in a try/except that prints 'Cannot parse:' on failure. Accumulate the count in count and the sum in total, close the file, then print 'count:' with count and 'average:' with round(total / count, 5).",
      },
      starterCode: "# اصنع الملف ثم ابحث فيه / make the file, then search it\n",
      solution: "out = open('spamconf.txt', 'w')\nout.write('From: sara@x.com\\n')\nout.write('X-DSPAM-Confidence: 0.8475\\n')\nout.write('Subject: hello\\n')\nout.write('X-DSPAM-Confidence: 0.6178\\n')\nout.close()\nfhand = open('spamconf.txt')\ntotal = 0\ncount = 0\nfor line in fhand:\n    line = line.rstrip()\n    if not line.startswith('X-DSPAM-Confidence:'):\n        continue\n    pos = line.find(':')\n    piece = line[pos + 2:]\n    try:\n        value = float(piece)\n    except:\n        print('Cannot parse:', piece)\n        continue\n    total = total + value\n    count = count + 1\nfhand.close()\nprint('count:', count)\nprint('average:', round(total / count, 5))",
      tests: [
        {
          id: 't1',
          name: { ar: 'عدد سطور الثقة 2', en: 'Two confidence lines counted' },
          code: "assert count == 2, 'expected: 2 | actual: %r' % count",
          expected: '2',
        },
        {
          id: 't2',
          name: { ar: 'مجموع القيمتين 1.4653 تقريبًا', en: 'The two values sum to 1.4653' },
          code: "assert abs(total - 1.4653) < 0.0001, 'expected: 1.4653 | actual: %r' % total",
          expected: '1.4653',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع العدّ والمتوسط الموقّعان', en: 'The labeled count and average are printed' },
          code: "assert 'count: 2' in __learner_output__ and 'average: 0.73265' in __learner_output__, ('expected: count: 2, average: 0.73265 | actual: %r' % __learner_output__)",
          expected: 'count: 2 / average: 0.73265',
        },
      ],
      hints: [
        { ar: 'النمط الثلاثي داخل الحلقة: rstrip ثم شرط التخطي بـ continue ثم المعالجة.', en: 'The three-move pattern inside the loop: rstrip, the skip condition with continue, then the processing.' },
        { ar: 'القيمة تبدأ عند pos + 2 — النقطتان في pos والفراغ في pos + 1.', en: 'The value starts at pos + 2 — the colon sits at pos and the space at pos + 1.' },
        { ar: 'الهيكل:\nfor line in fhand:\n    line = line.rstrip()\n    if not line.startswith(\'X-DSPAM-Confidence:\'):\n        continue\n    pos = line.find(\':\')\n    piece = line[pos + 2:]\n    try:\n        value = float(piece)\n    except:\n        print(\'Cannot parse:\', piece)\n        continue\n    total = total + value\n    count = count + 1', en: "The skeleton:\nfor line in fhand:\n    line = line.rstrip()\n    if not line.startswith('X-DSPAM-Confidence:'):\n        continue\n    pos = line.find(':')\n    piece = line[pos + 2:]\n    try:\n        value = float(piece)\n    except:\n        print('Cannot parse:', piece)\n        continue\n    total = total + value\n    count = count + 1" },
        { ar: "وبعد الحلقة: fhand.close() ثم print('count:', count) وprint('average:', round(total / count, 5))", en: "And after the loop: fhand.close() then print('count:', count) and print('average:', round(total / count, 5))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-extract',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة. تتبّع find والتقطيع والتحويل بترتيبه.',
        en: 'Read the code and predict its exact output — one line per print. Trace find, slicing and conversion in order.',
      },
      code: "line = 'X-DSPAM-Confidence: 0.75\\n'\nline = line.rstrip()\npos = line.find(':')\npiece = line[pos + 2:]\nprint(piece)\nprint(float(piece) * 2)",
      solution: '0.75\n1.5',
      answer: '0.75\n1.5',
      hints: [
        { ar: 'rstrip أزال محرف السطر الجديد — القصّ لن يحمله معه.', en: 'rstrip removed the newline — the slice will not carry it along.' },
        { ar: 'بعد النقطتين يأتي فراغ ثم القيمة: pos + 2 يقفز فوق الاثنين.', en: 'After the colon come a space then the value: pos + 2 jumps over both.' },
        { ar: 'float(\'0.75\') يساوي 0.75 وضربه في 2 يجعله 1.5.', en: "float('0.75') is 0.75 and doubling it gives 1.5." },
        { ar: 'الخرْج:\n0.75\n1.5', en: 'The output:\n0.75\n1.5' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-rstrip',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا نستدعي line = line.rstrip() في بداية جسم حلقة البحث؟',
        en: 'Why do we call line = line.rstrip() at the top of a search loop body?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن السطر القادم من الملف ينتهي بمحرف سطر جديد يفسد الطباعة والمقارنة', en: 'Because a line from the file ends with a newline that spoils printing and comparison' } },
        { id: 'b', text: { ar: 'لأن rstrip يحذف المسافات الداخلية بين الكلمات', en: 'Because rstrip deletes the spaces between words' } },
        { id: 'c', text: { ar: 'لأن الملفات تُقرأ مقلوبة بدونها', en: 'Because files are read backwards without it' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر الأسطر الفارغة المزدوجة في خرْج الدرس الماضي.', en: 'Recall the doubled blank lines in last lesson’s output.' },
        { ar: 'rstrip تعمل على الطرف الأيمن للسلسلة لا على قلبه.', en: 'rstrip works on the right edge of the string, not on reversing it.' },
        { ar: 'هي مسافات بيضاء من النهاية: \\n وغيره.', en: 'It is trailing whitespace: \\n and friends.' },
        { ar: 'الجواب: أ — تنظيف النهاية قبل أي معالجة.', en: 'Answer: a — clean the tail before any processing.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-rstrip',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: التابع الذي يحذف المسافات البيضاء — ومنها محرف السطر الجديد — من نهاية السلسلة هو ______.',
        en: 'Fill in: the method that strips whitespace — the newline included — from the end of a string is ______.',
      },
      answer: 'rstrip',
      solution: 'rstrip',
      hints: [
        { ar: 'اسمه يقول: strip من اليمين.', en: 'Its name says it: strip from the right.' },
        { ar: 'تابع صنف سلسلة يُستدعى بعامل النقطة.', en: 'A string method invoked with the dot operator.' },
        { ar: 'ستة حروف تبدأ بـ r.', en: 'Six letters starting with r.' },
        { ar: 'الجواب: rstrip', en: 'Answer: rstrip' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — مكتشف بيانات\n# Your playground — the data detector\n\nout = open("inbox.txt", "w")\nout.write("From: sara@x.com\\n")\nout.write("From: omar@y.org\\n")\nout.write("Subject: files\\n")\nout.write("From: lina@x.com\\n")\nout.close()\n\nfhand = open("inbox.txt")\nfor line in fhand:\n    line = line.rstrip()\n    if line.find("@x.com") == -1:\n        continue\n    print(line)\nfhand.close()',
      prompt: {
        ar: 'جرّب بنفسك: غيّر سلسلة البحث إلى @y.org ثم إلى Subject، وحوّل continue إلى print وفحص == -1 إلى != وراقب كيف ينقلب المرشّح. ثم اكتب حلقة تجمع أسماء النطاقات بعد @. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: change the search string to @y.org then Subject, flip continue and the == -1 check to see the filter invert. Then write a loop collecting the domains after @. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل الثالث: float(\'abc\') داخل حلقة بحث — ماذا يحدث بدون try؟',
            en: "Back to chapter 3: float('abc') inside a search loop — what happens without try?",
          },
          options: [
            { id: 'a', text: { ar: 'ترمي ValueError وينهار البرنامج', en: 'It throws ValueError and the program collapses' } },
            { id: 'b', text: { ar: 'تعيد العدد 0 بهدوء', en: 'It quietly returns the number 0' } },
            { id: 'c', text: { ar: 'تتخطى السطر وتكمل تلقائيًا', en: 'It skips the line and carries on automatically' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التحويل يصرخ ولا يخمّن — لهذا أغلقناه في try ووضعنا في except شيفرة استعادة تطبع Cannot parse وتكمل.',
            en: 'The conversion screams rather than guessing — so we wrapped it in try and put recovery code in except that prints Cannot parse and moves on.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما وظيفة continue في نمط تخطي الأسطر غير المهمة؟',
            en: 'What does continue do in the skip-uninteresting-lines pattern?',
          },
          options: [
            { id: 'a', text: { ar: 'يقفز إلى أعلى الحلقة لبدء تكرار جديد متخطيًا ما بعده', en: 'Jumps to the top of the loop starting a new iteration, skipping what follows' } },
            { id: 'b', text: { ar: 'يخرج من الحلقة كليًا مثل break', en: 'Leaves the loop entirely like break' } },
            { id: 'c', text: { ar: 'يعيد تنفيذ نفس السطر مرة أخرى', en: 'Re-runs the same line once more' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'continue تخطٍّ لا انسحاب: الأسطر غير المهمة تُرمى وما بعد continue يعالج الأسطر المهمة فقط — على خلاف break الذي ينهي الحلقة.',
            en: 'continue is a skip, not an exit: dull lines are thrown away and what follows continue handles only the interesting ones — unlike break which ends the loop.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا ظهرت أسطر فارغة بين السطور المطبوعة في أول نسخة من برنامج البحث؟',
            en: 'Why did blank lines appear between the printed lines in the first version of the search program?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن كل سطر يحمل محرف \\n وprint أضاف سطرًا آخر', en: 'Because each line carries its \\n and print added another' } },
            { id: 'b', text: { ar: 'لأن الملف كان فيه أسطر فارغة أصلًا', en: 'Because the file already had blank lines' } },
            { id: 'c', text: { ar: 'لأن startswith يطبع مرتين', en: 'Because startswith prints twice' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'محرف السطر الجديد لا يُطبع كنص بل يظهر أثره — والطباعة تضيف نهاية سطر خاص بها، فيكون التباعد مزدوجًا. rstrip حلا المشكلة.',
            en: 'The newline is not printed as text, its effect appears — and print adds its own line ending, so the spacing doubles. rstrip is the fix.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل السادس: ماذا يعيد تابع الصنف find إذا لم يجد السلسلة المطلوبة؟',
            en: 'And from chapter 6: what does the string method find return when the substring is not found?',
          },
          options: [
            { id: 'a', text: { ar: '-1', en: '-1' } },
            { id: 'b', text: { ar: '0', en: '0' } },
            { id: 'c', text: { ar: 'سلسلة فارغة', en: 'An empty string' } },
          ],
          answer: 'a',
          explanation: {
            ar: '-1 يعني «لم أجدها» — ولهذا صار الاختبار line.find(...) == -1 مرشّحًا مقلوبًا يخطي الأسطر الخالية من كلمة البحث.',
            en: '-1 means not found — which is why line.find(...) == -1 works as an inverted filter skipping lines lacking the search word.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'if line == "Subject: hello":\n    print("found")',
          right: 'if line.rstrip() == "Subject: hello":\n    print("found")',
          note: {
            ar: 'المقارنة بالتساوي تفشل دائمًا لأن السطر الحقيقي يحمل \\n في آخره. نظّف بـ rstrip أولًا أو قارن بـ startswith.',
            en: 'Equality never fires because the real line trails its \\n. Strip with rstrip first — or compare with startswith.',
          },
        },
        {
          wrong: 'piece = line[pos + 1:]',
          right: 'piece = line[pos + 2:]',
          note: {
            ar: 'الموقع pos هو النقطتان وpos + 1 هو الفراغ — القصّ من pos + 1 يعطيك " 0.8475" بفراغ لاصق. القيمة تبدأ عند pos + 2.',
            en: 'pos is the colon and pos + 1 is the space — slicing from pos + 1 yields " 0.8475" with a glued space. The value starts at pos + 2.',
          },
        },
        {
          wrong: 'if not line.startswith("From:"):\n    break',
          right: 'if not line.startswith("From:"):\n    continue',
          note: {
            ar: 'break يوقف القراءة عند أول سطر غير مطابق فيفقد البقية. continue يرمي السطر الحالي ويواصل البحث — احذر الخلط بين القفزتين.',
            en: 'break stops reading at the first unmatched line and loses the rest. continue discards the current line and keeps searching — mind the two jumps.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'البحث في ملف = حلقة الملف + أدوات السلاسل: startswith وfind يفلتران وcontinue يتخطى غير المهم.', en: 'Searching a file = the file loop + string tools: startswith and find filter, and continue skips the uninteresting.' },
        { ar: 'rstrip ينظف محرف السطر الجديد من نهاية كل سطر قبل الطباعة أو المقارنة أو القصّ.', en: 'rstrip cleans the newline off the end of each line before printing, comparing or slicing.' },
        { ar: 'بعد find والتقطيع يتحول النص بعد النقطتين بـ float تحت حماية try/except — فتصمد البرامج أمام البيانات الوسخة.', en: 'After find and slicing, the text after the colon converts with float under a try/except guard — so programs survive dirty data.' },
      ],
      reflectPrompt: {
        ar: 'فكّر في سجل حقيقي (رسائل، فواتير، درجات): ما السطر المهم فيه؟ وما البادئة أو الكلمة التي ستبني عليها مرشّحك؟',
        en: 'Think of a real log (mails, invoices, grades): which line is the interesting one? What prefix or keyword would your filter rely on?',
      },
    },
    {
      kind: 'sources',
      items: [{ book: 'PY4E', section: 'py4e.ch7.s5', pages: 'ص107 / pp.107' }],
    },
  ],
  sources: [{ book: 'PY4E', section: 'py4e.ch7.s5', pages: 'ص107 / pp.107' }],
} satisfies Lesson;

export default lesson;
