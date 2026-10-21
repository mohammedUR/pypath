import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch7.l1 — "Opening Files / فتح الملفات"
 * Aligned with PY4E ch7 s1 (الإصرار على التعلم), s2 (فتح الملفات).
 * All expression is original.
 * Note: the sandbox has no real disk — sample files are created in memory
 * (open 'w' → write → close) before being opened for reading, fully
 * deterministic (Pyodide MEMFS semantics).
 */
const lesson = {
  id: 'py4e.ch7.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 7,
  title: { ar: 'فتح الملفات', en: 'Opening Files' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch6.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل برامجك حتى الآن كانت تعيش لحظة واحدة: شغّلتها، حسبت، طُبع، وانطفأت الذاكرة. غدًا لا يبقى شيء. لكن رسائلك وسجلاتك ودرجاتك موجودة حقًا — لأن ثمة مكانًا ثانيًا للذاكرة لا يخاف انقطاع الكهرباء: الملفات. في هذا الدرس نفتح الفصل السابع: كيف تفتح بايثون ملفًا، وما الذي تعيده لك فعلًا. بنهاية الدرس ستكون قادرًا على: تفسير دور الذاكرة الثانوية، واستدعاء open للحصول على معرّف الملف، وتمييز المعرّف عن البيانات.',
        en: 'Every program you wrote until now lived for one moment: run it, compute, print, and the memory goes dark. Tomorrow nothing remains. Yet your messages, logs and grades do exist for real — because there is a second kind of memory that does not fear a power cut: files. This lesson opens chapter 7: how Python opens a file and what it actually hands back. By the end of this lesson you will be able to: explain the role of secondary memory, call open to get a file handle, and tell the handle apart from the data.',
      },
    },
    {
      kind: 'predict',
      code: "out = open('mbox.txt', 'w')\nout.write('Hi\\n')\nout.close()\nfhand = open('mbox.txt')\nprint(fhand)",
      question: {
        ar: 'فتحنا الملف للقراءة ثم طبعنا معرّفه fhand. هل سيطبع السطر المخزّن Hi؟',
        en: 'We opened the file for reading then printed its handle fhand. Will it print the stored line Hi?',
      },
      reveal: {
        ar: "لن يطبع Hi. ما يظهر شيء يشبه <_io.TextIOWrapper name='mbox.txt' mode='r' ...> — معرّف الملف: بابٌ يؤدي إلى البيانات، وليس البيانات نفسها. لقراءة المحتوى نحتاج خطوة إضافية سنتعلمها في هذا الدرس والدرس التالي.",
        en: "It will not print Hi. What appears looks like <_io.TextIOWrapper name='mbox.txt' mode='r' ...> — the file handle: a doorway leading to the data, not the data itself. Reaching the content takes one more step, taught in this lesson and the next.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الإصرار: لماذا نحتاج الملفات؟', en: 'Persistence: why do we need files?' },
      chunks: [
        {
          ar: 'تعلمنا حتى الآن كتابة البرامج وتنفيذها في وحدة المعالجة المركزية مع الذاكرة الرئيسية — وهما المكان الذي يحدث فيه «التفكير». لكن حفظ شيء في هذه الذاكرة حفظٌ مؤقت: بمجرد فصل التغذية الكهربائية عن الحاسوب يُحذف كل ما فيها، البرنامج والبيانات معًا. برامج الفصول السابقة ذكية لكنها تكتب على الرمل — والموج يمحوه.',
          en: 'So far we wrote programs that ran on the CPU together with the main memory — the places where “thinking” happens. But storing anything there is temporary: the moment power is cut from the computer, everything inside is erased, program and data alike. The programs of earlier chapters were smart but wrote on sand — the wave wipes it clean.',
        },
        {
          ar: 'يقدّم هذا الفصل وسيط تخزين جديد يسمى الذاكرة الثانوية (secondary memory) — أو الملفات. تمتاز الذاكرة الثانوية بعدم فقدان محتوياتها عند فقدان الطاقة، وفي وحدة تخزين متنقلة مثل ذاكرة USB يمكن نقل بياناتك من نظام إلى نظام آخر. سنتعامل هنا أساسًا مع الملفات النصية: الملفات القياسية التي يمكن لأي برنامج قراءتها وكتابتها، ولا يهمنا بعدُ الملفات الثنائية المصممة لبرمجيات قواعد البيانات.',
          en: 'This chapter introduces a new storage medium named secondary memory — that is, files. Secondary memory keeps its contents even when power is lost, and with a portable storage unit like a USB flash drive you can move your data from one system to another. Here we focus mainly on text files: standard files that any program can read and write; the binary files designed for database software stay out of scope for now.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فتح الملفات: open() ومعرّف الملف', en: 'Opening files: open() and the file handle' },
      chunks: [
        {
          ar: "قبل قراءة ملف أو الكتابة عليه يجب فتحه: open('mbox.txt') تطلب من نظام التشغيل أن يعثر على الملف بالاسم ويتأكد من وجوده، ثم تعيد معرّف الملف (file handle) عند النجاح. لاحظ أننا لم نمرر وضع فتح: الوضع الافتراضي هو القراءة 'r'. كما في الكتاب: fhand = open('mbox.txt') ثم print(fhand) فتظهر معلومات المعرّف — مثل <_io.TextIOWrapper name='mbox.txt' mode='r' ...> — لا المحتوى.",
          en: "Before reading a file or writing to it you must open it: open('mbox.txt') asks the operating system to find the file by name and confirm it exists, then returns a file handle on success. Notice we passed no opening mode: the default mode is reading 'r'. As in the book: fhand = open('mbox.txt'), then print(fhand) shows the handle's info — like <_io.TextIOWrapper name='mbox.txt' mode='r' ...> — never the content.",
        },
        {
          ar: 'المعرّف لا يمثل البيانات الفعلية الموجودة في الملف: هو واجهة نستخدمها لقراءة البيانات. يُمنَح المعرّف إذا كان الملف موجودًا ولديك الأذونات المطلوبة؛ وإذا لم يكن الملف موجودًا فشلت العملية وظهر تقرير خطأ FileNotFoundError ولن تحصل على معرّف أصلًا. سنحترم هذا الفشل بالكود لاحقًا في هذا الفصل.',
          en: 'The handle does not represent the actual data inside the file: it is an interface we use to read the data. The handle is granted when the file exists and you hold the required permissions; if the file does not exist the opening fails, a FileNotFoundError traceback appears, and you get no handle at all. We will handle that failure in code later in this chapter.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'من الملف إلى الأسطر: محرف السطر الجديد', en: 'From file to lines: the newline character' },
      chunks: [
        {
          ar: "الملف النصي سلسلة طويلة من المحارف، ولنرى الأسطر نتخيل محرفًا خاصًا غير مرئي في نهاية كل سطر: محرف السطر الجديد (newline) الذي نكتبه \\n. يبدو محرفين — شرطة مائلة عكسية ثم حرف n — لكنه محرف واحد: len('X\\nY') تعطي 3. هذا المحرف هو الذي يقسم محارف الملف إلى سطور، وكل قراءة قادمة ستبني عليه.",
          en: "A text file is one long string of characters, and to see lines we imagine a special invisible character at the end of each line: the newline character, written \\n. It looks like two characters — a backslash then the letter n — but it is one: len('X\\nY') gives 3. This character is what splits the file characters into lines, and all the reading to come builds on it.",
        },
        {
          ar: "ولأن منصتنا بلا قرص حقيقي، كل أمثلتنا تصنع ملفها أولًا: open('mbox.txt', 'w') للكتابة، write لوضع الأسطر، ثم close — وبعدها نفتح الملف نفسه للقراءة. الرمز 'w' هو وضع الكتابة وسنفصّله في درس لاحق؛ احفظ الآن الطقس الكامل: افتح للكتابة، اكتب، أغلق، ثم افتح للقراءة.",
          en: "And because our platform has no real disk, every example makes its own file first: open('mbox.txt', 'w') for writing, write to place the lines, then close — after that we open the very same file for reading. The 'w' symbol is write mode and gets its own lesson later; memorize for now the full ritual: open for writing, write, close, then open for reading.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'اصنع الملف ثم افتحه', en: 'Make the file, then open it' },
      code: "out = open('mbox.txt', 'w')\nout.write('From: sara@x.com\\n')\nout.write('Subject: hi\\n')\nout.close()\n\nfhand = open('mbox.txt')\nprint(fhand)\nprint(fhand.read())\nfhand.close()",
      explanation: {
        ar: 'أولًا صنعنا الملف ووضعنا فيه سطرين ثم أغلقناه. بعدها open بدون وضعٍ أرجعت معرّف القراءة، وطبعنا المعرّف نفسه فظهر وصف الباب لا محتواه. وفقط مع read() انهمرت البيانات: سطرا البريد. لاحظ الدور الكامل: كتابة ثم إغلاق ثم قراءة ثم إغلاق.',
        en: 'First we made the file, placed two lines in it, and closed it. Then open with no mode returned the reading handle, and we printed the handle itself — the door description appeared, not its content. Only with read() did the data pour out: the two mail lines. Notice the full cycle: write, close, read, close.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.open-read',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "اصنع ملفًا اسمه mbox-l1.txt بوضع 'w' واكتب فيه سطرين بالضبط: 'Hello py4e\\n' ثم 'Files are fun\\n'، ثم أغلقه. أعد فتحه للقراءة، وخزّن كامل محتواه في المتغير data عبر read()، وأغلقه، ثم اطبع data.",
        en: "Make a file named mbox-l1.txt in 'w' mode and write exactly two lines into it: 'Hello py4e\\n' then 'Files are fun\\n', then close it. Reopen it for reading, store its full content in the variable data via read(), close it, then print data.",
      },
      starterCode: '# اصنع الملف ثم اقرأه / make the file, then read it\n',
      solution: "out = open('mbox-l1.txt', 'w')\nout.write('Hello py4e\\n')\nout.write('Files are fun\\n')\nout.close()\nfhand = open('mbox-l1.txt')\ndata = fhand.read()\nfhand.close()\nprint(data)",
      tests: [
        {
          id: 't1',
          name: { ar: 'data تحوي السطرين كاملين', en: 'data holds both complete lines' },
          code: "assert data == 'Hello py4e\\nFiles are fun\\n', 'expected: two full lines | actual: %r' % data",
          expected: 'Hello py4e / Files are fun',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع السطر الثاني', en: 'The second line is printed' },
          code: "assert 'Files are fun' in __learner_output__, ('expected: Files are fun | actual: %r' % __learner_output__)",
          expected: 'Files are fun',
        },
        {
          id: 't3',
          name: { ar: 'الملف نفسه سليم في الذاكرة', en: 'The file itself is intact in memory' },
          code: "chk = open('mbox-l1.txt')\ncontent = chk.read()\nchk.close()\nassert content == 'Hello py4e\\nFiles are fun\\n', 'expected: file content preserved | actual: %r' % content",
          expected: 'file content preserved',
        },
      ],
      hints: [
        { ar: "الطقس رباعي الحركات: افتح بـ 'w'، اكتب كل سطر بـ write، أغلق، ثم افتح من جديد بدون وضع.", en: "The ritual has four moves: open with 'w', write each line, close, then open again with no mode." },
        { ar: 'لا تنسَ محرف السطر الجديد \\n في نهاية كل سطر مكتوب.', en: 'Do not forget the newline character \\n at the end of each written line.' },
        { ar: "الهيكل:\nout = open(..., 'w')\nout.write(...)\nout.close()\nfhand = open(...)\ndata = fhand.read()\nfhand.close()\nprint(data)", en: "The skeleton:\nout = open(..., 'w')\nout.write(...)\nout.close()\nfhand = open(...)\ndata = fhand.read()\nfhand.close()\nprint(data)" },
        { ar: "out = open('mbox-l1.txt', 'w')\nout.write('Hello py4e\\n')\nout.write('Files are fun\\n')\nout.close()\nfhand = open('mbox-l1.txt')\ndata = fhand.read()\nfhand.close()\nprint(data)", en: "out = open('mbox-l1.txt', 'w')\nout.write('Hello py4e\\n')\nout.write('Files are fun\\n')\nout.close()\nfhand = open('mbox-l1.txt')\ndata = fhand.read()\nfhand.close()\nprint(data)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-read',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله. تذكّر أن read() تجمع كل شيء حتى محارف السطر الجديد.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Remember read() gathers everything, newline characters included.',
      },
      code: "out = open('notes.txt', 'w')\nout.write('AB\\nCD\\n')\nout.close()\nfhand = open('notes.txt')\ndata = fhand.read()\nprint(len(data))\nprint(data)\nfhand.close()",
      solution: '6\nAB\nCD',
      answer: '6\nAB\nCD',
      hints: [
        { ar: 'عدّ محارف السلسلة المكتوبة: AB ثم محرف سطر جديد ثم CD ثم محرف آخر.', en: 'Count the characters written: AB, then a newline, then CD, then another newline.' },
        { ar: 'len(data) يعدّ المحارف ولا يعدّ الأسطر.', en: 'len(data) counts characters, not lines.' },
        { ar: 'عند الطباعة يعمل كل \\n كنهاية سطر حقيقية.', en: 'When printed, each \\n acts as a real end of line.' },
        { ar: 'الخرْج:\n6\nAB\nCD', en: 'The output:\n6\nAB\nCD' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-handle',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "ماذا يعيد open('mbox.txt') عند نجاح الفتح؟",
        en: "What does open('mbox.txt') return on success?",
      },
      options: [
        { id: 'a', text: { ar: 'معرّف الملف: واجهة للوصول إلى بياناته', en: 'A file handle: an interface to reach the data' } },
        { id: 'b', text: { ar: 'محتوى الملف كاملًا كسلسلة نصية', en: 'The whole file content as a string' } },
        { id: 'c', text: { ar: 'قائمة بأسطر الملف', en: 'A list of the file lines' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر نتيجة print(fhand) في الدرس.', en: 'Recall the result of print(fhand) in this lesson.' },
        { ar: 'لو أعاد المحتوى لأمكن طباعته مباشرة بعد الفتح.', en: 'If it returned the content, printing it right after opening would work.' },
        { ar: 'قراءة البيانات تحتاج خطوة إضافية: read أو حلقة.', en: 'Reading the data takes one more step: read or a loop.' },
        { ar: 'الجواب: أ — معرّف الملف، والبيانات تأتي لاحقًا.', en: 'Answer: a — the file handle; the data comes later.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-open',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: التابع الذي يطلب من نظام التشغيل فتح ملف ويعيد معرّف الملف هو ______.',
        en: 'Fill in: the function that asks the operating system to open a file and returns the file handle is ______.',
      },
      answer: 'open',
      solution: 'open',
      hints: [
        { ar: 'استدعيناه في السطر الأول من كل مثال في هذا الدرس.', en: 'You called it in the first line of every example in this lesson.' },
        { ar: 'كلمة إنجليزية من أربعة حروف تعني «افتح».', en: 'A four-letter English word meaning to open.' },
        { ar: 'وضعها الافتراضي عند الاستدعاء هو القراءة.', en: 'Its default mode when called is reading.' },
        { ar: 'الجواب: open', en: 'Answer: open' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — صانع ملفات وفتّاح أبواب\n# Your playground — a file maker and door opener\n\nout = open("sandbox.txt", "w")\nout.write("first line\\n")\nout.write("second line\\n")\nout.close()\n\nfhand = open("sandbox.txt")\nprint(fhand)          # الباب نفسه / the door itself\nprint(fhand.read())   # ما خلف الباب / what is behind it\nfhand.close()',
      prompt: {
        ar: 'جرّب بنفسك: أضف سطورًا جديدة، ثم اطبع len للنص المقروء، وجرّب len(fhand) قبل read وراقب صرخة TypeError — المعرّف ليس نصًا. ثم افتح ملفًا لم تصنعه أصلًا وراقب FileNotFoundError. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add new lines, print len of the read text, then try len(fhand) before read and watch the TypeError — the handle is not text. Then open a file you never made and watch FileNotFoundError. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى بنية الحاسوب في الفصل الأول: ماذا يحدث لمحتوى الذاكرة الرئيسية عند فصل التغذية الكهربائية؟',
            en: 'Back to computer architecture in chapter 1: what happens to main memory when the power is cut?',
          },
          options: [
            { id: 'a', text: { ar: 'يُحذف كل شيء — ولهذا نحتاج الذاكرة الثانوية', en: 'Everything is erased — and that is why we need secondary memory' } },
            { id: 'b', text: { ar: 'يبقى محفوظًا حتى نفتح البرنامج مرة أخرى', en: 'It stays saved until we open the program again' } },
            { id: 'c', text: { ar: 'ينتقل تلقائيًا إلى وحدة المعالجة المركزية', en: 'It moves automatically to the CPU' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الذاكرة الرئيسية مكان «التفكير» المؤقت؛ الملفات في الذاكرة الثانوية تنجو من انقطاع الطاقة — وهذا معنى الإصرار في عنوان القسم الأول.',
            en: 'Main memory is the temporary thinking place; files in secondary memory survive the power cut — that is the persistence in section one.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: "ماذا يمثل المتغير fhand بعد fhand = open('mbox.txt')؟",
            en: "What does the variable fhand represent after fhand = open('mbox.txt')?",
          },
          options: [
            { id: 'a', text: { ar: 'البيانات النصية المخزنة في الملف', en: 'The text data stored in the file' } },
            { id: 'b', text: { ar: 'معرّف الملف: واجهة للقراءة لا البيانات نفسها', en: 'The file handle: an interface for reading, not the data itself' } },
            { id: 'c', text: { ar: 'عدد أسطر الملف', en: 'The number of lines in the file' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'print(fhand) يعرض كائن المعرّف لا المحتوى — والوصول إلى البيانات يحتاج read() أو حلقة قراءة.',
            en: 'print(fhand) shows the handle object, never the content — reaching the data needs read() or a reading loop.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "ما وضع الفتح الافتراضي في open('mbox.txt') عندما لا نمرر وسيطًا ثانيًا؟",
            en: "What is the default opening mode of open('mbox.txt') when no second argument is passed?",
          },
          options: [
            { id: 'a', text: { ar: "القراءة 'r'", en: "Reading 'r'" } },
            { id: 'b', text: { ar: "الكتابة 'w'", en: "Writing 'w'" } },
            { id: 'c', text: { ar: 'لا وضع افتراضي — الاستدعاء خطأ', en: 'No default — the call is an error' } },
          ],
          answer: 'a',
          explanation: {
            ar: "الوضع الافتراضي 'r' قراءة. أما 'w' فيجب طلبها صراحة — وسماتها الخطرة قادمة في درس الكتابة.",
            en: "The default mode is 'r' reading. 'w' must be requested explicitly — and its dangerous traits arrive in the writing lesson.",
          },
        },
        {
          id: 'q4',
          question: {
            ar: "وكم محرفًا يعدّها len('X\\nY')؟",
            en: "And how many characters does len('X\\nY') count?",
          },
          options: [
            { id: 'a', text: { ar: '3 — لأن \\n محرف واحد رغم شكله', en: '3 — because \\n is one character despite its looks' } },
            { id: 'b', text: { ar: '4 — لأن \\n محرفان', en: '4 — because \\n is two characters' } },
            { id: 'c', text: { ar: '2 — لأن \\n غير مرئي ولا يُعد', en: '2 — because \\n is invisible and never counted' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'شرطة مائلة عكسية + حرف n طريقة كتابة فقط؛ المحرف واحد يفصل الأسطر — وهو مثال الكتاب نفسه.',
            en: 'Backslash + the letter n is just the way it is written; the character is one and it splits lines — the very example from the book.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "fhand = open('mbox.txt')\nprint(fhand)",
          right: "fhand = open('mbox.txt')\nprint(fhand.read())",
          note: {
            ar: 'المعرّف ليس البيانات: طباعة fhand تعرض وصف الباب لا محتواه. اطلب read() لترى البيانات.',
            en: 'The handle is not the data: printing fhand shows the door description, never the content. Ask for read() to see the data.',
          },
        },
        {
          wrong: "fhand = open('mystery.txt')",
          right: "out = open('mystery.txt', 'w')\nout.write('now it exists\\n')\nout.close()\nfhand = open('mystery.txt')",
          note: {
            ar: 'فتح ملف غير موجود يرمي FileNotFoundError ولا يعيد معرّفًا. في منصتنا لا ملفات موروثة: اصنع ملفك أولًا ثم افتحه.',
            en: 'Opening a missing file throws FileNotFoundError and returns no handle. On our platform no files are inherited: make your file first, then open it.',
          },
        },
        {
          wrong: 'print(len(fhand))',
          right: 'print(len(fhand.read()))',
          note: {
            ar: 'len يعمل على السلاسل لا على معرّفات الملفات: len(fhand) يرمي TypeError. اقرأ المحتوى أولًا ثم عدّ محارفه.',
            en: 'len works on strings, not on file handles: len(fhand) throws TypeError. Read the content first, then count its characters.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الذاكرة الثانوية (الملفات) تنجو من انقطاع الكهرباء على خلاف الذاكرة الرئيسية — فهي مكان الإصرار.', en: 'Secondary memory (files) survives a power cut unlike main memory — that is where persistence lives.' },
        { ar: "open تطلب من نظام التشغيل فتح الملف وتعيد معرّف الملف، والوضع الافتراضي للقراءة 'r'.", en: "open asks the operating system to open the file and returns a file handle; the default mode is reading 'r'." },
        { ar: 'المعرّف واجهة لا بيانات: المحتوى يصل عبر read أو حلقة، والأسطر يتحددها محرف السطر الجديد \\n المحرف الواحد.', en: 'The handle is an interface, not data: content arrives via read or a loop, and lines are defined by the single newline character \\n.' },
      ],
      reflectPrompt: {
        ar: 'اذكر ثلاثة ملفات نصية تتعامل معها في يومك العادي، ولماذا كان خسارتها عند انقطاع الكهرباء كارثة؟',
        en: 'Name three text files you touch in an ordinary day — why would losing them in a power cut be a disaster?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch7.s1', pages: 'ص102 / pp.102' },
        { book: 'PY4E', section: 'py4e.ch7.s2', pages: 'ص103 / pp.103' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch7.s1', pages: 'ص102 / pp.102' },
    { book: 'PY4E', section: 'py4e.ch7.s2', pages: 'ص103 / pp.103' },
  ],
} satisfies Lesson;

export default lesson;
