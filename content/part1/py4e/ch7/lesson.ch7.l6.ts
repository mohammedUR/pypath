import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch7.l6 — "Chapter 7 Review and Project: File Notebook /
 * مراجعة الفصل 7 ومشروع: دفتر الملفات"
 * Aligned with PY4E ch7 s9 (التنقيح), s10 (فهرس المصطلحات), s11 (تمارين).
 * All expression is original.
 * Project: write a fixed list of notes to a file, close, reopen with a guard,
 * then print a %-formatted summary (ties ch6 format operator + ch5 loops +
 * ch3 try/except). Deterministic in-memory file lifecycle.
 */
const lesson = {
  id: 'py4e.ch7.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 7,
  title: { ar: 'مراجعة الفصل 7 ومشروع: دفتر الملفات', en: 'Chapter 7 Review and Project: File Notebook' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch7.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أقفل الفصل السابع على خريطته كاملة: ذاكرة تنجو من الكهرباء، معرّف يفتح الباب، read وحلقة for تقرآن بطريقتين، بحث يصفّي الأسطر، وقلم \'w\' يكتب — ويمسح. ثم أول مشروع تخزين حقيقي لك: دفتر ملفات يكتب ملاحظاتك في ملف، يغلقه، يعيد فتحه محميًا، ويستخرج تقريرًا كاملًا بعامل التنسيق من الفصل السادس. بنهاية الدرس ستكون قادرًا على: تركيب دورة الكتابة والقراءة في برنامج واحد، وتشخيص أعطال الملفات الشائعة.',
        en: 'Chapter 7 closes on its full map: memory that survives a power cut, a handle that opens the door, read and a for loop reading two ways, a search that filters lines, and the \'w\' pen that writes — and wipes. Then your first real storage project: a file notebook that writes your notes to a file, closes it, reopens it guarded, and extracts a full report with the chapter-6 format operator. By the end of this lesson you will be able to: compose the write-and-read cycle into one program, and diagnose the common file failures.',
      },
    },
    {
      kind: 'predict',
      code: "out = open('notes.txt', 'w')\nout.write('a\\nb\\n')\nout.close()\n\nout2 = open('notes.txt', 'w')\nout2.close()\n\nfhand = open('notes.txt')\ndata = fhand.read()\nfhand.close()\nprint(data == '')",
      question: {
        ar: 'كتبنا ملاحظتين ثم أغلقنا الملف. ثم فتحنا الملف نفسه بوضع \'w\' مرة ثانية وأغلقناه دون كتابة شيء. هل بقي فيه شيء؟',
        en: "We wrote two notes and closed the file. Then we opened the same file in 'w' mode a second time and closed it without writing anything. Is anything left inside?",
      },
      reveal: {
        ar: 'يطبع True — الملف أصبح فارغًا. مجرد فتح بوضع \'w\' يمسح المحتوى القديم لحظة الفتح قبل أي كتابة. هذا أشهر أمراض ملفات المبتدئين، وهو نصيبنا من درس التنقيح اليوم.',
        en: "It prints True — the file is now empty. Merely opening in 'w' mode wipes the old content at the moment of opening, before any writing. This is the beginner’s most common file ailment — and our share of today’s debugging lesson.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التنقيح: حيث تمرض برامج الملفات', en: 'Debugging: where file programs fall ill' },
      chunks: [
        {
          ar: 'ثلاثة أعطال تتكرر في كل برنامج ملفات: الأول اسم خاطئ فيرمي FileNotFoundError — واقرأ سطر التتبع الأخير فهو يسمي الملف والسبب (الفصل الثالث). الثاني بيانات كتبتها ولا تظهر: نسيت close فبقيت في المخزن المؤقت لم تصل الملف. الثالث ملف صار فجأة فارغًا: فتحته بوضع \'w\' وأنت تظن أنك تفتحه للقراءة — كما في التنبؤ.',
          en: 'Three failures recur in every file program: the first is a wrong name throwing FileNotFoundError — read the last traceback line, it names the file and the cause (chapter 3). The second is data you wrote that never shows: you forgot close, so it stayed in the buffer and never reached the file. The third is a file suddenly empty: you opened it in \'w\' mode believing you were opening it for reading — as in the prediction.',
        },
        {
          ar: 'وأدواتك كما دربتها في الفصل الخامس: اطبع في كل دورة من الحلقة len(line) وراقب المحارف تمر، وافحص len(data) بعد القراءة، وتذكّر أن رسالة انتهاء المهلة تعني غالبًا حلقة لا تتوقف. والاختبار الذهبي: اكتب، أغلق، أعد القراءة — دورة كاملة تصرّخ عند أول حلقة مكسورة.',
          en: 'Your tools are the ones trained in chapter 5: print len(line) on every loop pass and watch the characters flow, check len(data) after reading, and remember that the timeout message usually means a loop that never stops. And the golden test: write, close, re-read — a full cycle that screams at the first broken link.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فهرس مصطلحات الفصل', en: 'The chapter glossary' },
      chunks: [
        {
          ar: 'من عالم الملفات: الذاكرة الثانوية (secondary memory) وسيط التخزين الدائم كالأقراص وذاكرة USB؛ والملف (file) سلسلة بيانات مسماة تسكنها؛ ومعرّف الملف (file handle) الواجهة التي يعيدها open للوصول إلى بيانات الملف؛ ومحرف السطر الجديد (newline) المحرف الواحد \\n الذي يقسم الملف إلى أسطر.',
          en: 'From the file world: secondary memory is the permanent storage medium like disks and USB drives; a file is a named sequence of data living on it; the file handle is the interface open returns for reaching the file data; and the newline is the single character \\n that splits a file into lines.',
        },
        {
          ar: 'ومن عالم الأنماط: البحث (searching) مرور على الأسطر واختيار المهمة منها؛ والتخلص من المسافات (stripping) تنظيف أطراف السلسلة بـ rstrip؛ والتصفية (filtering) تخطي الأسطر غير المطابقة بـ continue؛ والتنقيح (debugging) فن تتبع الخلل حتى مصدره. احفظها بأسمائها الإنجليزية فهي لغة الوثائق والفرق.',
          en: 'And from the pattern world: searching walks the lines and picks the interesting ones; stripping cleans the string edges with rstrip; filtering skips the non-matching lines with continue; and debugging is the craft of tracing a bug to its source. Memorize their English names — that is the language of docs and teams.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المشروع: دفتر الملفات', en: 'The project: the file notebook' },
      chunks: [
        {
          ar: "الوظيفة على مرحلتين. مرحلة الكتابة: القائمة notes تحوي أربعة أسطر جاهزة كل منها بمحرف \\n — حلقة for تكتبها كلها في notebook.txt ثم close. مرحلة التحليل: نحمي الفتح الثاني بـ try/except مع عَلَم None من الدرس الرابع، ثم حلقة واحدة على المعرّف تطبق أنماط الفصل الخامس: عدّ الأسطر في lines، وعدّ المحارف len(line) في chars، وعدّ الأسطر التي تحوي الكلمة المفتاحية files بعامل in من الفصل السادس في hits.",
          en: 'The job has two phases. Writing phase: the list notes holds four ready lines each carrying its \\n — a for loop writes them all into notebook.txt then closes it. Analysis phase: we guard the second opening with try/except and the None flag from lesson four, then a single loop over the handle applies the chapter-5 patterns: counting lines into lines, counting characters len(line) into chars, and counting lines containing the keyword files with the chapter-6 in operator into hits.',
        },
        {
          ar: "التقرير الأخير يجمع الفصل السادس: ثلاثة أسطر بعامل التنسيق % — print('lines: %d' % lines) ثم مثلها لchars ولhits. تلاحظ التكامل: حلقات من الفصل الخامس، وحماية من الثالث، وتنسيق من السادس، وملفات من السابع — أربعة فصول في عشرين سطرًا. هذا حجم البرنامج الحقيقي: كلما تعلمت فصلًا صار برنامجك الأكبر أقصر.",
          en: "The final report collects chapter 6: three lines with the % format operator — print('lines: %d' % lines) and the like for chars and hits. Watch the integration: loops from chapter 5, a guard from chapter 3, formatting from chapter 6, files from chapter 7 — four chapters in twenty lines. That is what real programs are: every chapter you learn makes your biggest program shorter.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الدفتر كاملًا أمامك', en: 'The notebook, whole and working' },
      code: "notes = ['learning files\\n', 'files remember\\n', 'py4e rocks\\n', 'close your files\\n']\nout = open('notebook.txt', 'w')\nfor note in notes:\n    out.write(note)\nout.close()\n\nfhand = None\ntry:\n    fhand = open('notebook.txt')\nexcept:\n    print('File cannot be opened: notebook.txt')\nif fhand is not None:\n    lines = 0\n    chars = 0\n    hits = 0\n    for line in fhand:\n        lines = lines + 1\n        chars = chars + len(line)\n        if 'files' in line:\n            hits = hits + 1\n    fhand.close()\n    print('lines: %d' % lines)\n    print('chars: %d' % chars)\n    print('keyword hits: %d' % hits)",
      explanation: {
        ar: 'المرحلة الأولى كتبت أربعة أسطر وأغلقت. المرحلة الثانية فتحت محمية فعامت الحلقة: 4 أسطر و58 محرفًا — محارف \\n تعدّ كغيرها — و3 أسطر تحوي files. لو غاب close الأول لربما قرأنا ملفًا ناقصًا، ولو فُتح بـ \'w\' في التحليل لصار الدفتر فارغًا. دورة حياة الملف كلها في 20 سطرًا.',
        en: 'Phase one wrote four lines and closed. Phase two opened guarded and the loop reported: 4 lines and 58 characters — the \\n helpers counted like the rest — and 3 lines containing files. Had the first close been missing we might have read a partial file, and had the analysis opened with \'w\' the notebook would be empty. The whole file lifecycle in 20 lines.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-notebook',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة.',
        en: 'Read the code and predict its exact output — one line per print.',
      },
      code: "out = open('tinybook.txt', 'w')\nout.write('hi\\n')\nout.write('bye\\n')\nout.close()\nfhand = open('tinybook.txt')\ndata = fhand.read()\nfhand.close()\nprint(len(data))\nprint(data)",
      solution: '7\nhi\nbye',
      answer: '7\nhi\nbye',
      hints: [
        { ar: 'عدّ محارف السطرين مع محرفي السطر الجديد.', en: 'Count the two lines characters with their two newlines.' },
        { ar: 'len يعدّ المحارف — وread جمع الملف كله.', en: 'len counts characters — and read gathered the whole file.' },
        { ar: 'print(data) يترجم \\n إلى سطرين حقيقيين.', en: 'print(data) translates the \\n into two real lines.' },
        { ar: 'الخرْج:\n7\nhi\nbye', en: 'The output:\n7\nhi\nbye' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.file-notebook',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل السابع — دفتر الملفات: القائمة notes معطاة في المحرر (أربعة أسطر كل منها بمحرف \\n). المرحلة الأولى: بحلقة for اكتب كل عنصر في ملف notebook.txt بوضع 'w' ثم أغلق الملف. المرحلة الثانية: افتح notebook.txt داخل try مع عَلَم None (وفي except اطبع 'File cannot be opened: notebook.txt')، ثم بحلقة for على المعرّف احسب: lines = عدد الأسطر، وchars = مجموع len(line)، وhits = عدد الأسطر التي تحوي الكلمة 'files' (بعامل in). أغلق الملف ثم اطبع ثلاثة أسطر بعامل التنسيق % بالضبط: 'lines: %d' % lines ثم 'chars: %d' % chars ثم 'keyword hits: %d' % hits. المتوقع: lines: 4 وchars: 48 وkeyword hits: 2.",
        en: "Chapter 7 project — the file notebook: the list notes is given in the editor (four lines, each with its \\n). Phase one: with a for loop write every element into the file notebook.txt in 'w' mode, then close the file. Phase two: open notebook.txt inside try with a None flag (in except print 'File cannot be opened: notebook.txt'), then with a for loop over the handle compute: lines = the number of lines, chars = the sum of len(line), and hits = the number of lines containing the word 'files' (with the in operator). Close the file, then print exactly three lines with the % format operator: 'lines: %d' % lines, then 'chars: %d' % chars, then 'keyword hits: %d' % hits. Expected: lines: 4, chars: 48, keyword hits: 2.",
      },
      starterCode: "notes = ['note one\\n', 'files in memory\\n', 'note three\\n', 'files again\\n']\n# المرحلة 1: اكتب الملاحظات في notebook.txt ثم أغلق / phase 1: write the notes then close\n# المرحلة 2: افتح محميًا وعدّ lines وchars وhits / phase 2: open guarded, count lines, chars, hits\n# التقرير: ثلاثة أسطر بعامل التنسيق % / the report: three %-formatted lines\n",
      solution: "notes = ['note one\\n', 'files in memory\\n', 'note three\\n', 'files again\\n']\nout = open('notebook.txt', 'w')\nfor note in notes:\n    out.write(note)\nout.close()\nfhand = None\ntry:\n    fhand = open('notebook.txt')\nexcept:\n    print('File cannot be opened: notebook.txt')\nif fhand is not None:\n    lines = 0\n    chars = 0\n    hits = 0\n    for line in fhand:\n        lines = lines + 1\n        chars = chars + len(line)\n        if 'files' in line:\n            hits = hits + 1\n    fhand.close()\n    print('lines: %d' % lines)\n    print('chars: %d' % chars)\n    print('keyword hits: %d' % hits)",
      tests: [
        {
          id: 't1',
          name: { ar: 'lines يساوي 4', en: 'lines equals 4' },
          code: "assert lines == 4, 'expected: 4 | actual: %r' % lines",
          expected: '4',
        },
        {
          id: 't2',
          name: { ar: 'chars يساوي 48', en: 'chars equals 48' },
          code: "assert chars == 48, 'expected: 48 | actual: %r' % chars",
          expected: '48',
        },
        {
          id: 't3',
          name: { ar: 'hits يساوي 2', en: 'hits equals 2' },
          code: "assert hits == 2, 'expected: 2 | actual: %r' % hits",
          expected: '2',
        },
        {
          id: 't4',
          name: { ar: 'التقرير مطبوع بثلاثة أسطر موقّعة بعامل %', en: 'The report prints as three %-formatted labeled lines' },
          code: "assert 'lines: 4' in __learner_output__ and 'chars: 48' in __learner_output__ and 'keyword hits: 2' in __learner_output__, ('expected: lines: 4, chars: 48, keyword hits: 2 | actual: %r' % __learner_output__)",
          expected: 'lines: 4 / chars: 48 / keyword hits: 2',
        },
        {
          id: 't5',
          name: { ar: 'الملف نفسه يحوي الملاحظات الأربع', en: 'The file itself holds the four notes' },
          code: "chk = open('notebook.txt')\ncontent = chk.read()\nchk.close()\nassert content == ''.join(notes), 'expected: file mirrors the notes list | actual: %r' % content",
          expected: 'file mirrors the notes list',
        },
      ],
      hints: [
        { ar: 'مرحلتان لا ثالث لهما: كل write داخل حلقة الكتابة، وكل count داخل حلقة التحليل.', en: 'Two phases, no third: every write lives in the writing loop, every count in the analysis loop.' },
        { ar: 'عامل in يجيب: هل الكلمة داخل السطر؟ if \'files\' in line: hits = hits + 1', en: "The in operator answers: is the word inside the line? if 'files' in line: hits = hits + 1" },
        { ar: 'الهيكل:\nout = open(\'notebook.txt\', \'w\')\nfor note in notes:\n    out.write(note)\nout.close()\nfhand = None\ntry:\n    fhand = open(\'notebook.txt\')\nexcept:\n    print(\'File cannot be opened: notebook.txt\')\nif fhand is not None:\n    lines = 0\n    chars = 0\n    hits = 0\n    for line in fhand:\n        lines = lines + 1\n        chars = chars + len(line)\n        if \'files\' in line:\n            hits = hits + 1\n    fhand.close()\n    print(\'lines: %d\' % lines)\n    print(\'chars: %d\' % chars)\n    print(\'keyword hits: %d\' % hits)', en: "The skeleton:\nout = open('notebook.txt', 'w')\nfor note in notes:\n    out.write(note)\nout.close()\nfhand = None\ntry:\n    fhand = open('notebook.txt')\nexcept:\n    print('File cannot be opened: notebook.txt')\nif fhand is not None:\n    lines = 0\n    chars = 0\n    hits = 0\n    for line in fhand:\n        lines = lines + 1\n        chars = chars + len(line)\n        if 'files' in line:\n            hits = hits + 1\n    fhand.close()\n    print('lines: %d' % lines)\n    print('chars: %d' % chars)\n    print('keyword hits: %d' % hits)" },
        { ar: 'الأسطر الأربعة مجموع محارفها 48 — إذا ظهر لك رقم آخر فافحص: هل كتبت \\n؟ هل أغلقت قبل الفتح الثاني؟', en: 'The four lines total 48 characters — if another number appears, check: did you write the \\n? Did you close before the second opening?' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-wipe',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ومن درس التنقيح: زميلك فتح ملف ملاحظاته بوضع \'w\' واثقًا أنه سيقرأه، ثم أغلقنه وقرأه. ماذا وجد؟',
        en: "From the debugging lesson: your friend opened his notes file in 'w' mode sure he was reading it, then closed and read it. What did he find?",
      },
      options: [
        { id: 'a', text: { ar: 'ملفًا فارغًا — مجرد الفتح بـ \'w\' مسح المحتوى', en: "An empty file — merely opening with 'w' wiped the content" } },
        { id: 'b', text: { ar: 'ملاحظاته سليمة — القراءة لا تغيّر شيئًا', en: 'His notes intact — reading changes nothing' } },
        { id: 'c', text: { ar: 'تقرير FileNotFoundError ولم يُقرأ الملف', en: 'A FileNotFoundError and the file was never read' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'هذا بالضبط سيناريو التنبؤ في أول الدرس.', en: 'This is exactly the prediction scenario at the top of the lesson.' },
        { ar: 'الوضع يُحدد سلوك الفتح لا ما تكتبه بعده.', en: 'The mode defines the opening behavior, not what you write afterward.' },
        { ar: 'للقراءة: افتح بلا وضع أو بـ \'r\' صراحة.', en: "For reading: open with no mode or explicitly 'r'." },
        { ar: 'الجواب: أ — الملف ولد فارغًا لحظة الفتح.', en: 'Answer: a — the file was reborn empty at the moment of opening.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-no-trailing',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل: كُتب في ملف السلسلة 'X\\nY\\nZ' (بلا محرف سطر جديد في النهاية!) ثم قُرئ كله بـ read(). كم يطبع print(len(data))؟",
        en: "Without running: the string 'X\\nY\\nZ' (no trailing newline!) was written to a file, then read back fully with read(). What does print(len(data)) show?",
      },
      answer: '5',
      solution: '5',
      tolerance: 0,
      hints: [
        { ar: 'عدّها حرفًا حرفًا: X ثم \\n ثم Y ثم \\n ثم Z.', en: 'Count one by one: X, then \\n, then Y, then \\n, then Z.' },
        { ar: 'هنا لا محرف سطر جديد في النهاية — لا تفترضه.', en: 'Here there is no trailing newline — never assume one.' },
        { ar: 'نفس مبدأ len(\'X\\nY\') من الدرس الثاني مع محرف إضافي.', en: "Same principle as len('X\\nY') from lesson two, plus one more character." },
        { ar: 'الجواب: 5', en: 'Answer: 5' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-reopen-w',
      required: true,
      brokenCode: "notes = ['first note\\n', 'second note\\n']\nout = open('mybook.txt', 'w')\nfor note in notes:\n    out.write(note)\nout.close()\n\n# أردت التأكد أن الملف جاهز — فتحته مرة ثانية / wanted to be sure the file is ready — reopened it\nout = open('mybook.txt', 'w')\nout.close()\n\nfhand = open('mybook.txt')\ndata = fhand.read()\nfhand.close()\nprint('chars: %d' % len(data))",
      prompt: {
        ar: "تقرير الدفتر يطبع chars: 0 رغم كتابة ملاحظتين (مجموع محارفهما 23). شغّل الكود المعطوب ثم اتبع دورة التنقيح: أين فُتح الملف بوضع كتابة بلا داعٍ؟ ماذا فعل ذلك الفتح بالمحتوى؟ اكتشف الخلل وأصلحه ليطبع التقرير chars: 23 ويبقى الملف محتفظًا بملاحظتيه.",
        en: "The notebook report prints chars: 0 although two notes were written (23 characters in total). Run the broken code, then follow the debugging cycle: where was the file opened in write mode needlessly? What did that opening do to the content? Find the bug and fix it so the report prints chars: 23 and the file keeps its two notes.",
      },
      solution: "notes = ['first note\\n', 'second note\\n']\nout = open('mybook.txt', 'w')\nfor note in notes:\n    out.write(note)\nout.close()\n\nfhand = open('mybook.txt')\ndata = fhand.read()\nfhand.close()\nprint('chars: %d' % len(data))",
      tests: [
        {
          id: 't1',
          name: { ar: 'data يحمل الملاحظتين كاملتين', en: 'data carries both complete notes' },
          code: "assert data == 'first note\\nsecond note\\n', 'expected: both notes | actual: %r' % data",
          expected: 'first note / second note',
        },
        {
          id: 't2',
          name: { ar: 'التقرير يطبع chars: 23', en: 'The report prints chars: 23' },
          code: "assert 'chars: 23' in __learner_output__, ('expected: chars: 23 | actual: %r' % __learner_output__)",
          expected: 'chars: 23',
        },
        {
          id: 't3',
          name: { ar: 'الملف نفسه احتفظ بالملاحظات', en: 'The file itself kept the notes' },
          code: "chk = open('mybook.txt')\ncontent = chk.read()\nchk.close()\nassert content == 'first note\\nsecond note\\n', 'expected: file intact | actual: %r' % content",
          expected: 'file intact',
        },
      ],
      hints: [
        { ar: 'الملاحظة الكسرة هي التعليق في المنتصف: فتح ثانٍ بوضع \'w\'.', en: 'The breaking note is the comment in the middle: a second opening in \'w\' mode.' },
        { ar: 'الفتح بـ \'w\' يمسح لحظة فتحه — حتى بلا أي write بعده.', en: "Opening with 'w' wipes at the moment of opening — even with no write afterward." },
        { ar: 'التحقق يتطلب فتحًا للقراءة لا للكتابة: احذف السطرين المكسرين وأبقِ القارئ.', en: 'Verification needs a reading opening, not a writing one: delete the two broken lines and keep the reader.' },
        { ar: "notes = ['first note\\n', 'second note\\n']\nout = open('mybook.txt', 'w')\nfor note in notes:\n    out.write(note)\nout.close()\n\nfhand = open('mybook.txt')\ndata = fhand.read()\nfhand.close()\nprint('chars: %d' % len(data))", en: "notes = ['first note\\n', 'second note\\n']\nout = open('mybook.txt', 'w')\nfor note in notes:\n    out.write(note)\nout.close()\n\nfhand = open('mybook.txt')\ndata = fhand.read()\nfhand.close()\nprint('chars: %d' % len(data))" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — دفترك الخاص\n# Your playground — your very own notebook\n\nnotes = ["day 1: files breathe\\n", "day 2: python loops\\n", "day 3: try guards me\\n"]\nout = open("journal.txt", "w")\nfor note in notes:\n    out.write(note)\nout.close()\n\nfhand = open("journal.txt")\nlines = 0\nhits = 0\nfor line in fhand:\n    lines = lines + 1\n    if "python" in line:\n        hits = hits + 1\nfhand.close()\nprint("lines: %d" % lines)\nprint("python hits: %d" % hits)',
      prompt: {
        ar: 'جرّب بنفسك: أضف ملاحظات جديدة، وغيّر الكلمة المفتاحية، ثم جرّب الفكرة القاتلة: أضف فتح journal.txt بـ \'w\' قبل التحليل وراقب lines تصفر. ثم أعد بناء البرنامج سليمًا. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add new notes, change the keyword, then try the fatal idea: open journal.txt with \'w\' before the analysis and watch lines collapse to zero. Then rebuild it right. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الأول: لماذا تستخدم البرامج الملفات بدل الاكتفاء بالذاكرة الرئيسية؟',
            en: 'From chapter 1: why do programs use files instead of relying on main memory alone?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الذاكرة الثانوية تحفظ البيانات بعد انطفاء الجهاز', en: 'Because secondary memory keeps the data after the machine goes off' } },
            { id: 'b', text: { ar: 'لأن الملفات تُنفَّذ أسرع من المتغيرات', en: 'Because files run faster than variables' } },
            { id: 'c', text: { ar: 'لأن الذاكرة الرئيسية لا تحمل أرقامًا', en: 'Because main memory cannot hold numbers' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'وحدة المعالجة والذاكرة الرئيسية مكان التفكير المؤقت؛ الإصرار يسكن الذاكرة الثانوية — أول درس في هذا الفصل.',
            en: 'CPU and main memory are the temporary thinking place; persistence lives in secondary memory — the first lesson of this chapter.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثاني: input() يعيد ما يكتبه المستخدم كنص. وبالمقابل، read() يعيد الملف المقروء على هيئة…',
            en: 'From chapter 2: input() returns what the user typed as text. In parallel, read() returns the file it read as…',
          },
          options: [
            { id: 'a', text: { ar: 'سلسلة نصية واحدة فيها كل المحارف حتى محارف الأسطر', en: 'One string holding every character, newlines included' } },
            { id: 'b', text: { ar: 'قائمة أسطر منفصلة', en: 'A list of separate lines' } },
            { id: 'c', text: { ar: 'معرّف ملف جديد', en: 'A new file handle' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'read يجمع الملف كله سلسلة واحدة — والأسطر تبقى قابلة للاستخراج لأن محارف \\n ما تزال فيها. أما القوائم فلم نصل إليها بعد.',
            en: 'read gathers the whole file into one string — lines remain extractable because their \\n characters are still inside. Lists are a bridge for later.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث: لماذا وضعنا open في مشروع الدفتر داخل try؟',
            en: 'From chapter 3: why did we put the notebook open inside try?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الفتح قد يفشل — فنرد برسالة بدل تقرير خطأ', en: 'Because the opening can fail — we answer with a message instead of a traceback' } },
            { id: 'b', text: { ar: 'لأن try يجعل القراءة أسرع', en: 'Because try makes reading faster' } },
            { id: 'c', text: { ar: 'لأن try يحذف الملف القديم بأمان', en: 'Because try safely deletes the old file' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'شيفرة الاستعادة نفسها: السطر الخطر مغلّف، والاستثناء الملتقط يفتح رسالة File cannot be opened — من درس اختيار الملف.',
            en: 'The same recovery code: the risky line wrapped, the caught exception opens a File cannot be opened message — from the file-choice lesson.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الرابع: write() تعيد عدد المحارف المكتوبة — فما تصنيفها الصحيح؟',
            en: 'From chapter 4: write() returns the number of characters written — so what is its proper classification?',
          },
          options: [
            { id: 'a', text: { ar: 'تابع مُنتج: استدعاؤه تعبير قيمته هي الناتج المُعاد', en: 'A fruitful function: its call is an expression whose value is the returned result' } },
            { id: 'b', text: { ar: 'تابع خالي: ينفذ ويهمل العودة', en: 'A void function: it acts and ignores returning' } },
            { id: 'c', text: { ar: 'إجراء نظام لا يمكن استدعاؤه مرتين', en: 'A system procedure that cannot be called twice' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قيمة العودة وصلت إلى n في مثالنا — تعريف التوابع المُنتجة بالحرف، وقد استفدنا منها في عدّ المحارف.',
            en: 'The return value landed in n in our example — the fruitful definition to the letter, and we used it to count characters.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الفصل الخامس: في for line in fhand: — ما دور line وكم مرة يُنفَّذ الجسم لملف من 4 أسطر؟',
            en: 'From chapter 5: in for line in fhand: — what is the role of line, and how many times does the body run for a 4-line file?',
          },
          options: [
            { id: 'a', text: { ar: 'متغيّر تكرار يأخذ سطرًا في كل دورة — والجسم 4 مرات', en: 'An iteration variable taking one line per pass — the body runs 4 times' } },
            { id: 'b', text: { ar: 'ثابت محجوز يطبع السطر الأول فقط', en: 'A reserved constant printing only the first line' } },
            { id: 'c', text: { ar: 'اسم الملف — والجسم مرة واحدة', en: 'The file name — the body runs once' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نمط for المحدد: دورة لكل عنصر — وكل عنصر هنا سطر يحمل \\n في آخره. بهذا العدّ بنينا كل إحصاءات المشروع.',
            en: 'The definite for pattern: one pass per item — and each item here is a line trailing its \\n. Every statistic in the project leans on it.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'وسؤال الفصل السابع نفسه: لماذا تفشل المقارنة line == \'note one\' على سطر قادم من الملف؟',
            en: "And a chapter-7 question: why does the comparison line == 'note one' fail on a line read from a file?",
          },
          options: [
            { id: 'a', text: { ar: 'لأن السطر ينتهي بمحرف \\n فالسلسلتان مختلفتان — وrstrip يحل ذلك', en: 'Because the line ends with \\n so the strings differ — rstrip fixes it' } },
            { id: 'b', text: { ar: 'لأن == لا تعمل على أسطر الملفات', en: 'Because == does not work on file lines' } },
            { id: 'c', text: { ar: 'لأن الملفات تُقرأ بترتيب معكوس', en: 'Because files are read in reverse order' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل سطر ملف يخرج بحمولته زائد محرف السطر الجديد. نظّفه بـ rstrip أو قارن بـ startswith — وإلا فالمقارنة تفشل بصمت.',
            en: 'Every file line comes out carrying its payload plus the newline. Clean it with rstrip or compare with startswith — otherwise the comparison fails silently.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "out = open('notebook.txt', 'w')\nout.write('my notes\\n')\nfhand = open('notebook.txt')\nprint(fhand.read())",
          right: "out = open('notebook.txt', 'w')\nout.write('my notes\\n')\nout.close()\nfhand = open('notebook.txt')\nprint(fhand.read())\nfhand.close()",
          note: {
            ar: 'بلا close قد تبقى البيانات في المخزن المؤقت فيقرأ القارئ ملفًا فارغًا أو ناقصًا. القاعدة الذهبية: أغلق الكاتب قبل أن تفتح القارئ.',
            en: 'Without close the data may still sit in the buffer and the reader finds an empty or partial file. Golden rule: close the writer before you open the reader.',
          },
        },
        {
          wrong: "out.write('total lines: 4')\nout.write('total chars: 48')",
          right: "out.write('total lines: 4\\n')\nout.write('total chars: 48\\n')",
          note: {
            ar: 'سطران مكتوبان بلا \\n يصيران سطرًا واحدًا ملتصقًا — وعدّاداتك في المشروع ستحسب أسطرًا أقل ومحارف بلا فواصل. \\n قرارك أنت في write.',
            en: 'Two writes without \\n become one glued line — and your project counters will count fewer lines and blur chars. In write, \\n is your decision.',
          },
        },
        {
          wrong: 'fhand = open("notebook.txt")\ndata = fhand.read()\nlines = len(data)',
          right: 'fhand = open("notebook.txt")\nlines = 0\nfor line in fhand:\n    lines = lines + 1\nfhand.close()',
          note: {
            ar: 'len(data) يعطي المحارف لا الأسطر — 48 ليس 4. لعدّ الأسطر حلقة على المعرّف، أو عُدّ محارف \\n في data بحلقة من الفصل الخامس.',
            en: 'len(data) gives characters, not lines — 48 is not 4. To count lines loop over the handle, or count the \\n characters in data with a chapter-5 loop.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الذاكرة الثانوية تحفظ بعد الانطفاء، وopen يعيد معرّفًا لا بيانات — والمعرّف باب القراءة والكتابة معًا.', en: 'Secondary memory persists after shutdown, and open returns a handle, not data — the handle is the door for both reading and writing.' },
        { ar: 'قراءتان: read يجمع الملف سلسلة واحدة، وfor line in fhand يمشي سطرًا سطرًا — والبحث يصفّي بـ startswith وfind وrstrip وcontinue.', en: 'Two readings: read gathers the file as one string, for line in fhand walks line by line — and searching filters with startswith, find, rstrip and continue.' },
        { ar: "الكتابة بوضع 'w' تمسح الموجود لحظة الفتح، وwrite يعيد عدد المحارف ولا يضيف أسطرًا، وclose يودع البيانات في الملف.", en: "Writing in 'w' mode wipes on opening, write returns the character count and adds no newlines, and close deposits the data into the file." },
        { ar: 'التنقيح: اسم خاطئ يرمي FileNotFoundError، ونسيان close يخفي البيانات، وفتح \'w\' ثانٍ يمسح — ودورتك الذهبية: اكتب، أغلق، أعد القراءة.', en: 'Debugging: a wrong name throws FileNotFoundError, a forgotten close hides data, a second \'w\' opening wipes — and your golden cycle: write, close, re-read.' },
      ],
      reflectPrompt: {
        ar: 'اكتب بخطك ثلاث أسطر تلخص الفصل السابع لمبرمج مستقبلي — ثم اجعلها أول ملاحظات في دفتر ملفات حقيقي ستكتبه بنفسك خارج المنصة.',
        en: 'Write three lines in your own words summarizing chapter 7 for a future programmer — then make them the first notes of a real file notebook you build outside the platform.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch7.s9', pages: 'ص114 / pp.114' },
        { book: 'PY4E', section: 'py4e.ch7.s10', pages: 'ص115 / pp.115' },
        { book: 'PY4E', section: 'py4e.ch7.s11', pages: 'ص116 / pp.116' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch7.s9', pages: 'ص114 / pp.114' },
    { book: 'PY4E', section: 'py4e.ch7.s10', pages: 'ص115 / pp.115' },
    { book: 'PY4E', section: 'py4e.ch7.s11', pages: 'ص116 / pp.116' },
  ],
} satisfies Lesson;

export default lesson;
