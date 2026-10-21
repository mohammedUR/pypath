import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch12.l1 — "The HTTP Protocol: How the Web Talks /
 * بروتوكول HTTP: كيف تتحدث الشبكة"
 * Aligned with PY4E ch12 s1 (بروتوكول نقل النص التشعبي HTTP).
 * All expression is original.
 * SIMULATED-NETWORK design: Pyodide has no sockets and no urllib.request.
 * The protocol is taught through an EMBEDDED raw HTTP response string that
 * the learner parses (split on the blank line, count headers, print status).
 * socket/urllib.request appear only as clearly framed desktop-Python prose.
 */
const lesson = {
  id: 'py4e.ch12.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 12,
  title: { ar: 'بروتوكول HTTP: كيف تتحدث الشبكة', en: 'The HTTP Protocol: How the Web Talks' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch11.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أحد عشر فصلًا قرأنا فيها ملفات من قرصك — والآن يعلو الطموح: ملفات على أجهزة أخرى في طرف العالم. الفصل الثاني عشر يفتح شبكة الإنترنت عبر بروتوكولها الحاكم HTTP، لكن بروتوكولًا بلا شبكة لا يُتعلم — فنحن نحاكي الشبكة بمتن مخزّن: نخزّن ردًّا خامًا حقيقي الشكل في متغير داخل المنصة ونحلله كما يفعل المتصفح. بنهاية الدرس ستكون قادرًا على: وصف تشريح طلب GET والرد الكامل، وتمييز سطر الحالة من الترويسات من السطر الفارغ من المتن، وتحليل استجابة مخزّنة بـ split لحساب رمز الحالة وعدد الترويسات واستخراج المتن.',
        en: 'Eleven chapters reading files from your disk — and now the ambition rises: files on other machines across the world. Chapter twelve opens the internet through its governing protocol HTTP. But a protocol cannot be learned without a network — so we simulate the network with a stored response: a raw, true-to-life reply kept in a variable inside the platform, parsed exactly as a browser would. By the end of this lesson you will be able to: describe the anatomy of a GET request and a full response, distinguish the status line from the headers from the blank line from the body, and analyze a stored response with split to extract the status code, count the headers, and reach the body.',
      },
    },
    {
      kind: 'predict',
      code: "line = 'HTTP/1.1 200 OK'\nprint(line.split()[1])",
      question: {
        ar: 'سطر الحالة قادم من خادم ويب حقيقي. ماذا سيطبع الكود — ولماذا يعمل split على السطر كلها؟',
        en: 'This status line arrived from a real web server. What does the code print — and why does split work on the whole line?',
      },
      reveal: {
        ar: 'يطبع 200. split() يقسم عند المسافات فيعيد قائمة من ثلاث سلاسل: HTTP/1.1 ثم 200 ثم OK — والموضع [1] هو رمز الحالة. سطر الحالة ثلاث كلمات دائمًا تقريبًا: إصدار البروتوكول، ثم الرمز، ثم العبارة.',
        en: 'It prints 200. split() cuts at the spaces and returns a list of three strings: HTTP/1.1, then 200, then OK — and position [1] is the status code. A status line is almost always three words: protocol version, then the code, then the phrase.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'مآخذ الشبكة وبروتوكول', en: 'Sockets and a protocol' },
      chunks: [
        {
          ar: 'مقبض الشبكة (socket) يشبه الملف إلى حد ما، لكنه يؤمّن اتصالًا ثنائي الاتجاه بين برنامجين: ما تكتبه فيه يُرسل إلى الطرف الآخر، وما تقرأه منه قادم من التطبيق الآخر. ومكتبة socket الجاهزة في بايثون تُسهّل إنشاء الاتصالات — على حاسوبك أنت، فهي غير متاحة في منصة pypath. وإذا انتظر الطرفان بيانات دون أن يرسل أحدهما شيئًا فسينتظران طويلًا؛ لذلك يتبع المتحدثون عبر الإنترنت بروتوكولًا: مجموعة قواعد تحدد من يبدأ، وماذا يُرسل، وما الردود، ومن يلي.',
          en: 'A socket resembles a file somewhat, but it secures a two-way connection between two programs: what you write into it is sent to the other side, and what you read from it was sent by the other application. The ready-made Python library socket eases creating such connections — on your own computer, for it is not available in the pypath platform. And if both sides wait for data without either sending anything, they will wait a long time; that is why internet speakers follow a protocol: a set of rules deciding who starts, what is sent, what the replies are, and who comes next.',
        },
        {
          ar: 'بروتوكول الويب الحاكم هو HTTP ومستنده طويل ومعقد، لكن قلبه بسيط: لطلب مستند من خادم مثل data.pr4e.org نرسل سطرًا واحدًا — GET http://data.pr4e.org/romeo.txt HTTP/1.0 — ثم سطرًا فارغًا. الكلمة GET تعني أعطني المستند، والمعامل الثاني هو صفحة الويب المطلوبة. في هذا الفصل سنكتب الأمر بهذا الشكل الحقيقي، لكننا في المنصة نحاكي الشبكة بمتن مخزّن: استجابة خام نحفظها في متغير بدلًا من سفر عبر الإنترنت.',
          en: 'The governing protocol of the web is HTTP, and its document is long and complex, yet its core is simple: to request a document from a server such as data.pr4e.org we send one line — GET http://data.pr4e.org/romeo.txt HTTP/1.0 — then a blank line. The word GET means give me the document, and the second argument is the web page requested. In this chapter we write the command in this true shape, but inside the platform we simulate the network with a stored response: a raw reply kept in a variable instead of traveling the internet.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تشريح الرد: الحالة والترويسة والمتن', en: 'Response anatomy: status, headers, body' },
      chunks: [
        {
          ar: 'يرد الخادم بأربعة أقسام بالترتيب: سطر الحالة مثل HTTP/1.1 200 OK أو HTTP/1.1 404 Not Found — 200 يعني نجاحًا و404 يعني أن المستند غير موجود؛ ثم الترويسات (headers): أسطر «اسم: قيمة» تصف المستند مثل Server: Apache وContent-Type: text/plain وContent-Length: 167؛ ثم سطر فارغ تمامًا؛ ثم المتن (body) وهو البيانات الفعلية. السطر الفارغ هو الحد الفاصل: ما قبله وصف، وما بعده محتوى.',
          en: 'The server replies with four parts in order: a status line such as HTTP/1.1 200 OK or HTTP/1.1 404 Not Found — 200 means success and 404 means the document was not found; then the headers: «name: value» lines describing the document, such as Server: Apache, Content-Type: text/plain and Content-Length: 167; then a completely blank line; then the body, the actual data. The blank line is the boundary: everything before it is description, everything after it is content.',
        },
        {
          ar: "على الشبكة الحقيقية ينتهي كل سطر بزوج المحارف \\r\\n، فيُكتب السطر الفارغ \\r\\n\\r\\n — وسنلتقي بالشكل البايتي الكامل في الدرس الثالث. هنا نبسّط: نستخدم \\n في أسطرنا المخزّنة والسطر الفارغ \\n\\n، فالمنطق واحد. لاحظ أن رمز الحالة سلسلة نصية '200' لا عدد — فكل ما يصل عبر الشبكة نصّ أولًا، والتحويل لاحقًا قرارك أنت.",
          en: "On the real network every line ends with the character pair \\r\\n, so the blank line is written \\r\\n\\r\\n — we meet the fully byte-shaped form in the third lesson. Here we simplify: we use \\n in our stored lines and \\n\\n for the blank line; the logic is identical. Note that the status code is a string '200', not a number — everything arriving over the network is text first, and converting it is your decision later.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تشريح رد مخزّن', en: 'Dissecting a stored response' },
      code: "response = 'HTTP/1.1 200 OK\\nDate: Wed, 11 Apr 2018 18:52:55 GMT\\nServer: Apache\\nContent-Type: text/plain\\nContent-Length: 48\\n\\nBut soft what light through yonder window breaks'\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint(status[1])\nprint(status[2])\nprint(len(head.split('\\n')) - 1)\nprint(len(body.split()))",
      explanation: {
        ar: "السطر الأول مخزّن بدلًا من وصوله عبر socket — هذه هي محاكاتنا. split('\\n\\n', 1) يقطع عند السطر الفارغ: head كل ما قبله وbody المتن. أول أسطر head هو سطر الحالة، فنقسمه مرتين: split('\\n') للأسطر ثم split() للكلمات فيعطي status[1] = 200 وstatus[2] = OK. عدد الترويسات أسطر head ناقص سطر الحالة: 5 − 1 = 4. والمتن ثماني كلمات — أول سطر من قصيدة romeo.txt التي سيجلبها درس المتصفح تاليًا.",
        en: "The first line stores what a socket would have delivered — that is our simulation. split('\\n\\n', 1) cuts at the blank line: head is everything before it and body is the payload. The first line of head is the status line, so we split it twice: split('\\n') for lines then split() for words, giving status[1] = 200 and status[2] = OK. The header count is head lines minus the status line: 5 − 1 = 4. And the body is eight words — the first line of the romeo.txt verse the browser lesson will fetch next.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.parse-404',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "الرد معطى في المحرر: استجابة 404 مخزّنة. قسّمها عند السطر الفارغ إلى head وbody، ثم اطبع: 'status: %s' مع رمز الحالة، و'headers: %d' مع عدد الترويسات (أسطر head ناقص سطر الحالة)، و'words: %d' مع عدد كلمات المتن. المتوقع: status: 404 ثم headers: 3 ثم words: 6.",
        en: "The response is given in the editor: a stored 404 reply. Split it at the blank line into head and body, then print: 'status: %s' with the status code, 'headers: %d' with the header count (head lines minus the status line), and 'words: %d' with the body word count. Expected: status: 404, then headers: 3, then words: 6.",
      },
      starterCode: "response = 'HTTP/1.1 404 Not Found\\nDate: Wed, 11 Apr 2018 18:52:55 GMT\\nServer: Apache\\nContent-Type: text/plain\\n\\nSorry, the page was not found'\n# اقسم عند السطر الفارغ ثم اطبع status وheaders وwords / split at the blank line, then print status, headers, words\n",
      solution: "response = 'HTTP/1.1 404 Not Found\\nDate: Wed, 11 Apr 2018 18:52:55 GMT\\nServer: Apache\\nContent-Type: text/plain\\n\\nSorry, the page was not found'\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('status: %s' % status[1])\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('words: %d' % len(body.split()))",
      tests: [
        {
          id: 't1',
          name: { ar: 'رمز الحالة 404 مطبوع', en: 'The status code 404 is printed' },
          code: "assert 'status: 404' in __learner_output__, ('expected: status: 404 | actual: %r' % __learner_output__)",
          expected: 'status: 404',
        },
        {
          id: 't2',
          name: { ar: 'عدد الترويسات 3 مطبوع', en: 'The header count 3 is printed' },
          code: "assert 'headers: 3' in __learner_output__, ('expected: headers: 3 | actual: %r' % __learner_output__)",
          expected: 'headers: 3',
        },
        {
          id: 't3',
          name: { ar: 'عدد كلمات المتن 6 مطبوع', en: 'The body word count 6 is printed' },
          code: "assert 'words: 6' in __learner_output__, ('expected: words: 6 | actual: %r' % __learner_output__)",
          expected: 'words: 6',
        },
        {
          id: 't4',
          name: { ar: 'التحليل نفسه صحيح: body كامل وstatus[2] عبارة الرد', en: 'The parsing itself is right: full body and status[2] is the phrase' },
          code: "assert body == 'Sorry, the page was not found' and status[2] == 'Not', ('expected: body intact and status[2] Not | actual: %r %r' % (body, status[2]))",
          expected: 'body intact / status[2] Not',
        },
      ],
      hints: [
        { ar: "ابدأ بالحد الفاصل: head, body = response.split('\\n\\n', 1) — الرقم 1 يمنع تجزئة المتن إن ظهر فيه سطر فارغ.", en: "Start from the boundary: head, body = response.split('\\n\\n', 1) — the 1 stops the body from being re-split if it ever holds a blank line." },
        { ar: "سطر الحالة هو head.split('\\n')[0] وكلماته status = ...split() — فالرمز status[1].", en: "The status line is head.split('\\n')[0] and its words status = ...split() — so the code is status[1]." },
        { ar: "الهيكل:\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('status: %s' % status[1])\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('words: %d' % len(body.split()))", en: "The skeleton:\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('status: %s' % status[1])\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('words: %d' % len(body.split()))" },
        { ar: 'الترويسات = أسطر head ناقص 1 (سطر الحالة ليس ترويسة)؛ وكلمات المتن = len(body.split()).', en: 'Headers = head lines minus 1 (the status line is not a header); body words = len(body.split()).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-head',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "head = 'HTTP/1.1 200 OK\\nServer: Apache'\nlines = head.split('\\n')\nprint(len(lines))\nprint(lines[0].split()[1])\nprint('Content-Type: text/plain'.split(': ')[1])",
      solution: '2\n200\ntext/plain',
      answer: '2\n200\ntext/plain',
      hints: [
        { ar: "split('\\n') يقسم عند نهايات الأسطر: سطرا head اثنان.", en: "split('\\n') cuts at line ends: head holds two lines." },
        { ar: 'سطر الحالة يقسم بالمسافات إلى ثلاث كلمات — الرمز في الموضع 1.', en: 'The status line splits at spaces into three words — the code sits at position 1.' },
        { ar: "الترويسة «اسم: قيمة» تنقسم عند ': ' — والقيمة كاملة بعدها.", en: 'A header is "name: value" and splits at ": " — the whole value follows.' },
        { ar: 'الخرْج:\n2\n200\ntext/plain', en: 'The output:\n2\n200\ntext/plain' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-404',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'وصل سطر الحالة: HTTP/1.1 404 Not Found. ماذا يعني ذلك لطلبك؟',
        en: 'The status line arrived: HTTP/1.1 404 Not Found. What does it mean for your request?',
      },
      options: [
        { id: 'a', text: { ar: 'المستند المطلوب غير موجود على الخادم', en: 'The requested document does not exist on the server' } },
        { id: 'b', text: { ar: 'نجح الطلب وسيمر المتن بعده', en: 'The request succeeded and a body will follow' } },
        { id: 'c', text: { ar: 'متصفحك قديم ويحتاج ترقية', en: 'Your browser is outdated and needs an upgrade' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'رموز 2xx تبشر بالنجاح — و404 ليس منهن.', en: '2xx codes announce success — 404 is not among them.' },
        { ar: 'العبارة خلف الرمز تشرحه: Not Found.', en: 'The phrase after the code explains it: Not Found.' },
        { ar: 'شاهدت مثال الدرس: المتن جاء لكن رمز الحالة فضح الخطأ.', en: 'You saw the lesson example: a body arrived, but the status code exposed the failure.' },
        { ar: 'الجواب: المستند المطلوب غير موجود على الخادم.', en: 'Answer: the requested document does not exist on the server.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-get',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: الطلب الذي يبدأ به المتصفح كل استرجاع لمستند ويب يكتب ____ ثم عنوان الصفحة ثم HTTP/1.0، ثم سطر فارغ.',
        en: 'Fill the blank with one word: the request that begins every web document retrieval writes ____ then the page address then HTTP/1.0, then a blank line.',
      },
      answer: 'GET',
      solution: 'GET',
      hints: [
        { ar: 'ثلاثة أحرف كبيرة — وتعني «أعطني».', en: 'Three capital letters — meaning "give me".' },
        { ar: 'شاهدته أول سطر في طلب الدرس: GET http://data.pr4e.org/romeo.txt HTTP/1.0.', en: 'You saw it as the first line of the lesson request: GET http://data.pr4e.org/romeo.txt HTTP/1.0.' },
        { ar: 'لاحظ أن GET يُكتب بحروف كبيرة دائمًا في بروتوكول HTTP.', en: 'Note that GET is always written in capitals in the HTTP protocol.' },
        { ar: 'الجواب: GET', en: 'Answer: GET' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — ردود تحت المجهر\n# Your playground — responses under the microscope\n\nresponse = 'HTTP/1.1 200 OK\\nDate: Mon, 01 Jan 2024 00:00:00 GMT\\nServer: Apache\\nContent-Type: text/html\\n\\n<h1>Hello</h1>'\nhead, body = response.split('\\n\\n', 1)\nprint(head)\nprint('---')\nprint(body)\nprint(head.split('\\n')[0].split()[1])\nprint(len(head.split('\\n')) - 1)",
      prompt: {
        ar: "جرّب بنفسك: طبع head كاملًا ثم body بعد الفاصل. بدّل 200 بـ 404 وOK بـ Not Found ولاحظ أن الكود نفسه يعمل — التحليل لا يهتم بالقيم. أضف ترويسة جديدة وسطرًا ثانيًا للمتن وأعد العدّ. جرّب split('\\n\\n') بلا الوسيط 1 على رد فيه سطران فارغان. لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: print the whole head, then the body after the boundary. Swap 200 for 404 and OK for Not Found and watch the same code work — parsing ignores values. Add a new header and a second body line, then recount. Try split('\\n\\n') without the 1 argument on a reply with two blank lines. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الذي يفصل الترويسات عن المتن في رد HTTP؟',
            en: 'What separates the headers from the body in an HTTP response?',
          },
          options: [
            { id: 'a', text: { ar: 'سطر فارغ تمامًا', en: 'A completely blank line' } },
            { id: 'b', text: { ar: 'ترويسة خاصة اسمها End', en: 'A special header named End' } },
            { id: 'c', text: { ar: 'كلمة body في سطر مستقل', en: 'The word body on its own line' } },
          ],
          answer: 'a',
          explanation: {
            ar: "الخادم يُرسل الترويسات ثم سطرًا فارغًا لإعلان نهايتها، وبعده المتن مباشرة — ولهذا قطعنا بـ split('\\n\\n', 1).",
            en: "The server sends the headers, then a blank line announcing their end, then the body directly — which is why we cut with split('\\n\\n', 1).",
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'أي أقسام الرد يخبرك بنوع المستند وطوله؟',
            en: 'Which part of the response tells you the document type and length?',
          },
          options: [
            { id: 'a', text: { ar: 'الترويسات — مثل Content-Type وContent-Length', en: 'The headers — such as Content-Type and Content-Length' } },
            { id: 'b', text: { ar: 'المتن نفسه', en: 'The body itself' } },
            { id: 'c', text: { ar: 'سطر الحالة', en: 'The status line' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الترويسات وصفٌ للمستند قبل وصوله: Content-Type يصرّح بالصنف مثل text/plain وContent-Length يعدّ البايتات.',
            en: 'Headers describe the document before it arrives: Content-Type declares the kind, like text/plain, and Content-Length counts the bytes.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثامن: ماذا يعيد split() المستدعى على سطر الحالة HTTP/1.1 200 OK؟',
            en: 'From chapter 8: what does split() return when called on the status line HTTP/1.1 200 OK?',
          },
          options: [
            { id: 'a', text: { ar: 'قائمة من ثلاث سلاسل: HTTP/1.1 و200 وOK', en: 'A list of three strings: HTTP/1.1, 200, OK' } },
            { id: 'b', text: { ar: 'سلسلة واحدة كما هي', en: 'One unchanged string' } },
            { id: 'c', text: { ar: 'عددًا صحيحًا 200', en: 'The integer 200' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split() بلا وسيط يقسم عند كل مسافة ويعيد قائمة — وهو ما مكّننا من الوصول إلى status[1].',
            en: 'split() with no argument cuts at every space and returns a list — which is what let us reach status[1].',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'بعد سطر GET، ماذا يرسل المتصفح الحقيقي ليعلن انتهاء طلبه؟',
            en: 'After the GET line, what does a real browser send to announce the end of its request?',
          },
          options: [
            { id: 'a', text: { ar: 'سطرًا فارغًا', en: 'A blank line' } },
            { id: 'b', text: { ar: 'كلمة BYE', en: 'The word BYE' } },
            { id: 'c', text: { ar: 'نسخة من الترويسات', en: 'A copy of the headers' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السطر الفارغ بعد GET يقول للخادم: انتهى طلبي، رُدّ الآن — وبدونه ينتظر الطرفان إلى الأبد.',
            en: 'The blank line after GET tells the server: my request is complete, reply now — without it both sides wait forever.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "head = response.split('\\n')[0]  # الرأس سطر واحد",
          right: "head, body = response.split('\\n\\n', 1)",
          note: {
            ar: "أول \\n ينهي سطر الحالة لا الترويسات. الحد الفاصل بين الوصف والمحتوى هو السطر الفارغ — وsplit('\\n\\n', 1) يلتقطه فيقطع مرة واحدة صحيحة.",
            en: "The first \\n ends the status line, not the headers. The boundary between description and content is the blank line — split('\\n\\n', 1) captures it and cuts exactly once.",
          },
        },
        {
          wrong: "print(len(head.split('\\n')), 'headers')  # 5 ترويسات!",
          right: "print(len(head.split('\\n')) - 1)",
          note: {
            ar: 'أسطر head تشمل سطر الحالة أولًا، وهو ليس ترويسة. العدّ الصحيح: أسطر الرأس ناقص واحد — في مثال الدرس 5 − 1 = 4.',
            en: 'The head lines include the status line first, and it is not a header. The correct count: head lines minus one — 5 − 1 = 4 in the lesson example.',
          },
        },
        {
          wrong: "if status[1] == 200:",
          right: "if status[1] == '200':",
          note: {
            ar: "split يعيد سلاسل نصية فأنت تقارن '200' بعدد صحيح فتفشل المقارنة بصمت وتعود False — كل قيم الشبكة نصّ حتى تقول غير ذلك.",
            en: 'split returns strings, so comparing with an integer fails silently and yields False — network values are text until you convert them.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'بروتوكول HTTP: الطلب سطر GET يليه سطر فارغ؛ والرد سطر حالة (200 OK / 404 Not Found) ثم ترويسات وصفية ثم سطر فارغ ثم متن.', en: 'The HTTP protocol: a request is a GET line followed by a blank line; a response is a status line (200 OK / 404 Not Found), then descriptive headers, then a blank line, then the body.' },
        { ar: 'نحاكي الشبكة بمتن مخزّن: استجابة خام في متغير تحللها كما يفعل المتصفح — وsocket وurllib.request شيفرة سطح مكتب على حاسوبك لا في المنصة.', en: 'We simulate the network with a stored response: a raw reply in a variable, parsed as a browser would — while socket and urllib.request are desktop code for your own computer, not the platform.' },
        { ar: "التحليل: split('\\n\\n', 1) عند الحد الفاصل، وسطر الحالة يُقسم كلمات فيصير status[1] الرمز، والترويسات أسطر الرأس ناقص واحد.", en: "Parsing: split('\\n\\n', 1) at the boundary; the status line splits into words with status[1] the code; headers are head lines minus one." },
      ],
      reflectPrompt: {
        ar: 'خادم أعاد المتن صحيحًا لكن سطر الحالة 404. متى تثق بالترويسات والمتن ومتى تتوقف وتعامل الرمز بوصفه الكلمة الفصل؟ وصف القرار في سطرين.',
        en: 'A server returned a correct body but a 404 status line. When do you trust the headers and body, and when do you stop and treat the code as the deciding word? Describe the decision in two sentences.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch12.s1', pages: 'ص190 / pp.190' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch12.s1', pages: 'ص190 / pp.190' },
  ],
} satisfies Lesson;

export default lesson;
