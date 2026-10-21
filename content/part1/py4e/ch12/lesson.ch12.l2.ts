import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch12.l2 — "The Simplest Web Browser / أبسط متصفح ويب في العالم"
 * Aligned with PY4E ch12 s2 (أبسط متصفح ويب في العالم).
 * All expression is original.
 * SIMULATED-NETWORK design: the book's socket1.py is presented conceptually
 * as desktop-Python (import socket / connect / send / recv loop) and is never
 * runnable here; the runnable worked example and exercises embed the response
 * of a 'GET romeo.txt' request as a raw string and parse headers vs body,
 * counting body lines and words (ties to ch8/ch9 list & counting skills).
 */
const lesson = {
  id: 'py4e.ch12.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 12,
  title: { ar: 'أبسط متصفح ويب في العالم', en: 'The Simplest Web Browser' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch12.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'المتصفح الذي تقرأ هذه الكلمات فيه مئات المبرمجين وآلاف الأسطر — لكن أصغر متصفح يمكن أن يُكتب ببايثون في أقل من عشرة أسطر، وهذا ما يفعله الكتاب في هذا الدرس. سترى شيفرة socket1.py الحقيقية مُشرحةً بوصفها شيفرة سطح مكتب لا تعمل في المنصة، ثم ستبني المتصفح نفسه بنسخته المحاكاة: استجابة GET مخزّنة تُفحص كما لو وصلت من الشبكة. بنهاية الدرس ستكون قادرًا على: تتبع دورة المتصفح اتصالًا وإرسالًا واستقبالًا وإغلاقًا، وشرح دور السطر الفارغ في الطلب ودور الترويسة في الرد، وتحليل متصفح محاكى يحصي أسطر المتن وكلماته.',
        en: 'The browser you are reading these words in holds hundreds of files and thousands of lines — yet the smallest browser writable in Python takes under ten lines, and that is what the book builds in this lesson. You will see the real socket1.py dissected as desktop-Python that cannot run in the platform, then rebuild the same browser in its simulated form: a stored GET response inspected as if it had arrived from the network. By the end of this lesson you will be able to: trace the browser cycle of connect, send, receive and close, explain the role of the blank line in the request and of the header in the reply, and analyze a simulated browser that counts the body lines and their words.',
      },
    },
    {
      kind: 'predict',
      code: "request = 'GET http://data.pr4e.org/romeo.txt HTTP/1.0\\r\\n\\r\\n'\nprint(request.count('\\r\\n'))",
      question: {
        ar: 'هذا هو الطلب الحقيقي الذي يُرسل على الشبكة. كم نهاية سطر فيه — ولماذا عددتان لا واحدة؟',
        en: 'This is the true request sent over the network. How many line ends does it hold — and why two, not one?',
      },
      reveal: {
        ar: 'يطبع 2. نهاية السطر تُكتب \\r\\n: واحدة بعد سطر GET، والثانية هي السطر الفارغ الذي يُعلن نهاية الطلب. لو أرسلت سطر GET وحده لانتظر الخادمُ ردَّك إلى الأبد — السطر الفارغ ليس زينة بل هو إشارة «انتهيتُ، رُدّ».',
        en: "It prints 2. A line end is written \\r\\n: one after the GET line, and the second is the blank line announcing the end of the request. Send the GET line alone and the server will wait for you forever — the blank line is not decoration but the signal 'I am done, reply'.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'متصفح من عشرة أسطر', en: 'A ten-line browser' },
      chunks: [
        {
          ar: "شيفرة الكتاب socket1.py — شيفرة سطح مكتب تُنفَّذ على حاسوبك أنت لا في منصة pypath، إذ لا توجد شبكة هنا — على هذا النحو: import socket ثم mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) لإنشاء المقبض، ثم mysock.connect(('data.pr4e.org', 80)) للاتصال بالخادم على المنفذ 80، ثم إرسال أمر GET بصيغة encode()، ثم حلقة تُستقبل فيها البيانات بـ mysock.recv(512) قطعةً قطعة حتى تعيد سلسلة فارغة فيُكسر الحلقة، وأخيرًا mysock.close(). أربعة أفعال: اتصال، إرسال، استقبال متكرر، إغلاق.",
          en: "The book's socket1.py — desktop code to run on your own computer, not in the pypath platform, as there is no network here — goes like this: import socket, then mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) to create the socket, then mysock.connect(('data.pr4e.org', 80)) to connect to the server on port 80, then sending the GET command in its .encode() form, then a loop receiving data in mysock.recv(512) chunks until an empty string breaks it, and finally mysock.close(). Four actions: connect, send, receive repeatedly, close.",
        },
        {
          ar: "شغّلته على الإنترنت تعطي أولًا الترويسة التي وصفها الدرس الماضي — HTTP/1.1 200 OK ثم Date وServer: Apache وContent-Type: text/plain وConnection: close — ثم السطر الفارغ، ثم متن الاستجابة: أبيات romeo.txt الأربعة. ولأن المتصفح يستقبل بايتات لا حروفًا، طُبعت بـ data.decode(). في منصتنا نحاكي الشبكة بمتن مخزّن: نحفظ الاستجابة نفسها في متغير نصّي ونحللها بالأدوات التي تحفظها من الفصول الماضية.",
          en: "Run on the internet it first delivers the header described last lesson — HTTP/1.1 200 OK then Date, Server: Apache, Content-Type: text/plain, Connection: close — then the blank line, then the response body: the four lines of romeo.txt. And since the browser receives bytes, not letters, they are printed with data.decode(). In our platform we simulate the network with a stored response: we keep the same reply in a string variable and analyze it with the tools you already own from past chapters.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'من بايتات وصلت إلى كلمات مُحصاة', en: 'From arrived bytes to counted words' },
      chunks: [
        {
          ar: "بعد أن يصير الرد متغيرًا في الذاكرة، يعود عملك إلى مهارات قديمة تمامًا: split('\\n\\n', 1) يفصل الترويسة عن المتن عند السطر الفارغ، وsplit('\\n') يجزئ المتن إلى أسطر، وsplit() يحصي الكلمات. المتصفح الحقيقي ينتهي عند الطباعة؛ أما مطوّر الويب فيمضي خطوة: يحصي الكلمات كما في الفصل التاسع، أو يبني قاموس تكرارات كما في الفصل العاشر. الجديد في هذا الفصل هو الوصول لا المعالجة — والوصول قد محاكيناه اليوم بمتن مخزّن.",
          en: "Once the reply is a variable in memory, your work returns to thoroughly familiar skills: split('\\n\\n', 1) separates header from body at the blank line, split('\\n') breaks the body into lines, and split() counts the words. The real browser stops at printing; a web developer goes one step further: counting words as in chapter nine, or building a frequency dictionary as in chapter ten. What is new in this chapter is the reaching, not the processing — and today we simulated the reaching with a stored response.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'المتصفح المحاكى', en: 'The simulated browser' },
      code: "response = 'HTTP/1.1 200 OK\\nServer: Apache\\nContent-Type: text/plain\\n\\nBut soft what light through yonder window breaks\\nIt is the east and Juliet is the sun'\nhead, body = response.split('\\n\\n', 1)\nprint('status: %s' % head.split('\\n')[0].split()[1])\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))",
      explanation: {
        ar: "الاستجابة مخزّنة كما لو استقبلها recv — نحاكي الشبكة بمتن مخزّن. split('\\n\\n', 1) يقطع عند السطر الفارغ فيعطي الترويسة والمتن. من الترويسة نستخرج سطر الحالة فنطبع الرمز 200. من المتن: سطران — شطرا القصيدة الأولان — و17 كلمة بعد أن يحصي split() كل ما بين المسافات. هذه خطوات المتصفح ذاتها: اتصال وإرسال واستقبال ثم فهم ما وصل — والفهم كله مهارات فصولك الماضية.",
        en: "The response is stored exactly as recv would have delivered it — we simulate the network with a stored response. split('\\n\\n', 1) cuts at the blank line into header and body. From the header we extract the status line and print the code 200. From the body: two lines — the first two verses of the poem — and 17 words as split() counts everything between spaces. These are the browser's own steps: connect, send, receive, then understand what arrived — and the understanding is entirely your past chapters' skills.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.romeo-browser',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "الاستجابة الكاملة لطلب romeo.txt معطاة في المحرر (الترويسة والمتن). حلّلها كما يفعل المتصفح: اقسم عند السطر الفارغ إلى head وbody، ثم اطبع 'status: %s' برمز الحالة، و'headers: %d' بعدد الترويسات (أسطر head ناقص 1)، و'lines: %d' بعدد أسطر المتن، و'words: %d' بعدد كلماته. المتوقع: status: 200 ثم headers: 3 ثم lines: 4 ثم words: 33.",
        en: "The full response to a romeo.txt request is given in the editor (header and body). Parse it as a browser would: split at the blank line into head and body, then print 'status: %s' with the status code, 'headers: %d' with the header count (head lines minus 1), 'lines: %d' with the body line count, and 'words: %d' with its word count. Expected: status: 200, then headers: 3, then lines: 4, then words: 33.",
      },
      starterCode: "response = 'HTTP/1.1 200 OK\\nServer: Apache\\nContent-Type: text/plain\\nContent-Length: 166\\n\\nBut soft what light through yonder window breaks\\nIt is the east and Juliet is the sun\\nArise fair sun and kill the envious moon\\nWho is already sick and pale with grief'\n# المتصفح المحاكى: اقسم ثم اطبع status وheaders وlines وwords / simulated browser: split, then print status, headers, lines, words\n",
      solution: "response = 'HTTP/1.1 200 OK\\nServer: Apache\\nContent-Type: text/plain\\nContent-Length: 166\\n\\nBut soft what light through yonder window breaks\\nIt is the east and Juliet is the sun\\nArise fair sun and kill the envious moon\\nWho is already sick and pale with grief'\nhead, body = response.split('\\n\\n', 1)\nprint('status: %s' % head.split('\\n')[0].split()[1])\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))",
      tests: [
        {
          id: 't1',
          name: { ar: 'رمز الحالة 200 مطبوع', en: 'The status code 200 is printed' },
          code: "assert 'status: 200' in __learner_output__, ('expected: status: 200 | actual: %r' % __learner_output__)",
          expected: 'status: 200',
        },
        {
          id: 't2',
          name: { ar: 'عدد الترويسات 3 مطبوع', en: 'The header count 3 is printed' },
          code: "assert 'headers: 3' in __learner_output__, ('expected: headers: 3 | actual: %r' % __learner_output__)",
          expected: 'headers: 3',
        },
        {
          id: 't3',
          name: { ar: 'أسطر المتن 4 مطبوعة', en: 'The body line count 4 is printed' },
          code: "assert 'lines: 4' in __learner_output__, ('expected: lines: 4 | actual: %r' % __learner_output__)",
          expected: 'lines: 4',
        },
        {
          id: 't4',
          name: { ar: 'كلمات المتن 33 مطبوعة', en: 'The body word count 33 is printed' },
          code: "assert 'words: 33' in __learner_output__, ('expected: words: 33 | actual: %r' % __learner_output__)",
          expected: 'words: 33',
        },
        {
          id: 't5',
          name: { ar: 'التقسيم نفسه صحيح: head أربعة أسطر والمتن الأبيات الأربعة', en: 'The split itself is right: head of four lines and the four verse lines' },
          code: "assert len(head.split('\\n')) == 4 and body.split('\\n')[1] == 'It is the east and Juliet is the sun', ('expected: head 4 lines and verse line 2 intact | actual: %r' % (body,))",
          expected: 'head 4 lines / verse line 2 intact',
        },
      ],
      hints: [
        { ar: "نفس خطوات worked: head, body = response.split('\\n\\n', 1) أولًا.", en: "The same steps as the worked example: head, body = response.split('\\n\\n', 1) first." },
        { ar: "الرمز من أول سطر في head: head.split('\\n')[0].split()[1].", en: "The code comes from the first head line: head.split('\\n')[0].split()[1]." },
        { ar: "الهيكل:\nhead, body = response.split('\\n\\n', 1)\nprint('status: %s' % head.split('\\n')[0].split()[1])\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))", en: "The skeleton:\nhead, body = response.split('\\n\\n', 1)\nprint('status: %s' % head.split('\\n')[0].split()[1])\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))" },
        { ar: "أسطر المتن len(body.split('\\n')) وكلماته len(body.split()) — المسافات والنهايات أدواتان مختلفتان.", en: "Body lines are len(body.split('\\n')) and its words len(body.split()) — spaces and line ends are two different tools." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-small-fetch',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "response = 'HTTP/1.1 200 OK\\nContent-Type: text/plain\\n\\nArise fair sun'\nhead, body = response.split('\\n\\n', 1)\nprint(len(head.split('\\n')))\nprint(len(body.split()))\nprint(body.split()[0])",
      solution: '2\n3\nArise',
      answer: '2\n3\nArise',
      hints: [
        { ar: 'الترويسة سطران: سطر الحالة وسطر Content-Type.', en: 'The header is two lines: the status line and the Content-Type line.' },
        { ar: 'المتن ثلاث كلمات — split() يحصي ما بين المسافات.', en: 'The body is three words — split() counts what sits between spaces.' },
        { ar: 'الموضع [0] في قائمة الكلمات هو أول كلمة.', en: 'Position [0] in the word list is the first word.' },
        { ar: 'الخرْج:\n2\n3\nArise', en: 'The output:\n2\n3\nArise' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-recv',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في socket1.py الحقيقي، ماذا تفعل mysock.recv(512) داخل حلقة الاستقبال؟',
        en: 'In the real socket1.py, what does mysock.recv(512) do inside the receive loop?',
      },
      options: [
        { id: 'a', text: { ar: 'تستقبل حتى 512 بايت من مقبض الشبكة في كل استدعاء، وتتكرر الحلقة حتى تعيد بيانات فارغة', en: 'It receives up to 512 bytes from the socket per call, and the loop repeats until it returns empty data' } },
        { id: 'b', text: { ar: 'ترسل 512 بايت إلى الخادم دفعة واحدة', en: 'It sends 512 bytes to the server in one shot' } },
        { id: 'c', text: { ar: 'تنتظر 512 ثانية قبل كل قراءة', en: 'It waits 512 seconds before each read' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'recv اختصار receive — هي قراءة لا كتابة.', en: 'recv is short for receive — it reads, never writes.' },
        { ar: 'الرقم سقفٌ لكمية الدفعة الواحدة لا مدة انتظار.', en: 'The number caps the size of one chunk, not a wait duration.' },
        { ar: 'الإرسال كان عمل send في سطر سابق.', en: 'Sending was the job of send in an earlier line.' },
        { ar: 'الجواب: تستقبل حتى 512 بايت كل استدعاء حتى يفرغ المقبض.', en: 'Answer: it receives up to 512 bytes per call until the socket runs dry.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-recv',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: التابع الذي يقرأ البيانات من مقبض الشبكة قطعةً قطعة في برنامج المتصفح الحقيقي هو mysock.____(512).',
        en: 'Fill the blank with one word: the method that reads data from a network socket chunk by chunk in the real browser program is mysock.____(512).',
      },
      answer: 'recv',
      solution: 'recv',
      hints: [
        { ar: 'أربعة أحرف — اختصار لكلمة receive.', en: 'Four letters — short for receive.' },
        { ar: 'رأيته في شريحة المتصفح من عشرة أسطر.', en: 'You saw it in the ten-line browser slice.' },
        { ar: 'في حلقة while True تُستدعى دورة بعد دورة حتى تعيد بيانات فارغة.', en: 'Inside the while True loop it is called pass after pass until it returns empty data.' },
        { ar: 'الجواب: recv', en: 'Answer: recv' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — متصفحك أنت\n# Your playground — a browser of your own\n\nresponse = 'HTTP/1.1 200 OK\\nServer: Apache\\n\\nIt is the east and Juliet is the sun'\nhead, body = response.split('\\n\\n', 1)\nlines = body.split('\\n')\nprint(lines)\nprint(len(lines))\nprint(len(body.split()))\nprint(body.count('sun'))\nprint(body.upper())",
      prompt: {
        ar: "جرّب بنفسك: اجعل المتصفح يحصي ما تريد — مرات ظهور كلمة sun بأداة count من الفصل السادس، وupper على المتن، وقائمة الأسطر كما أعادتها split. ثم زد الاستجابة: أضف ترويسة ETag وأبياتًا جديدة وأعد العدّ. وجرّب عمدًا النسيان: احذف split('\\n\\n') وقسّم بـ split('\\n') فراقب كيف يتسلل سطر الحالة إلى المتن. لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: make the browser count what you want — occurrences of sun with chapter-6's count, upper on the body, the line list as split returned it. Then grow the response: add an ETag header and new verses and recount. And forget on purpose: drop the split('\\n\\n') and split on '\\n' to watch the status line sneak into the body. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما أول ما يرسله المتصفح للخادم بعد أن يتصل به؟',
            en: 'What is the first thing a browser sends to the server after connecting?',
          },
          options: [
            { id: 'a', text: { ar: 'سطر GET بعنوان المستند، متبوعًا بسطر فارغ', en: 'A GET line with the document address, followed by a blank line' } },
            { id: 'b', text: { ar: 'اسم المستخدم وكلمة السر', en: 'A username and password' } },
            { id: 'c', text: { ar: 'الترويسة كاملة معكوسة', en: 'The full header, reversed' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'بروتوكول HTTP يفرض على المتصفح أن يطلب بأمر GET ثم السطر الفارغ — وهذا الطلب ما رأيناه في التنبؤ بحسابي \\r\\n.',
            en: "The HTTP protocol obliges the browser to request with a GET command then the blank line — the request whose two \\r\\n we counted in the prediction.",
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في رد الخادم، لماذا يرسل الخادم سطرًا فارغًا بعد الترويسة؟',
            en: 'In the server reply, why does the server send a blank line after the headers?',
          },
          options: [
            { id: 'a', text: { ar: 'للإشارة إلى نهاية الترويسة وبداية البيانات الفعلية', en: 'To mark the end of the headers and the start of the actual data' } },
            { id: 'b', text: { ar: 'لأن الخادم يحتاج راحة بين الإرسالين', en: 'Because the server needs a rest between the two sends' } },
            { id: 'c', text: { ar: 'لأن المتن يجب أن يبدأ بسطرين فارغين', en: 'Because the body must start with two blank lines' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السطر الفارغ حدٌّ صريح: قبله وصف المستند وبعده محتواه — والمتطلب نفسه في طلب المتصفح.',
            en: 'The blank line is an explicit boundary: before it the document description, after it its content — the very same requirement in the browser request.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل السابع: مكتبة urllib الحقيقية (على حاسوبك) تجعل الصفحة تُقرأ بعد فتحها سطرًا سطرًا بحلقة for — النمط ذاته الذي تقرأ به ماذا؟',
            en: 'From chapter 7: the real urllib library (on your computer) lets the page be read line by line with a for loop once opened — the very pattern you use to read what?',
          },
          options: [
            { id: 'a', text: { ar: 'ملفًا مفتوحًا بـ open', en: 'A file opened with open' } },
            { id: 'b', text: { ar: 'قاموسًا من أزواج', en: 'A dictionary of pairs' } },
            { id: 'c', text: { ar: 'نصًّا واحدًا لا يتجزأ لا يقبل التكرار', en: 'One indivisible string that cannot be iterated' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الصفحة بعد urlopen تتصرّف مثل ملف: حلقة for تمرّ على أسطرها — لذلك كان درس الملفات إعدادًا مباشرًا لهذا الفصل.',
            en: 'After urlopen the page behaves like a file: a for loop walks its lines — which is why the files lesson was direct preparation for this chapter.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'متى تتوقف حلقة الاستقبال في المتصفح الحقيقي؟',
            en: 'When does the receive loop in the real browser stop?',
          },
          options: [
            { id: 'a', text: { ar: 'حين يعيد recv بيانات بطول صفر — لا مزيد من البيانات', en: 'When recv returns zero-length data — nothing more is coming' } },
            { id: 'b', text: { ar: 'بعد استقبال 512 بايت بالضبط', en: 'After receiving exactly 512 bytes' } },
            { id: 'c', text: { ar: 'عند رؤية كلمة close في المتن', en: 'Upon seeing the word close in the body' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الاستقبال قطعٌ حتى ينفد المصدر: سلسلة فارغة تعني أن الخادم أغلق طرفه — فنكسر الحلقة ونغلق مقبضنا.',
            en: 'Receiving is chunk after chunk until the source runs dry: an empty string means the server closed its side — so we break the loop and close ours.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "cmd = 'GET http://data.pr4e.org/romeo.txt HTTP/1.0\\r\\n'",
          right: "cmd = 'GET http://data.pr4e.org/romeo.txt HTTP/1.0\\r\\n\\r\\n'",
          note: {
            ar: 'سطر GET وحده لا يكفي: بلا السطر الفارغ الثاني يظل الخادم منتظر بقية طلبك — فينتظر الطرفان بعضهما إلى الأبد. الزوج \\r\\n\\r\\n هو «انتهيتُ».',
            en: 'The GET line alone is not enough: without the second blank line the server keeps waiting for the rest of your request — both sides waiting for each other forever. The pair \\r\\n\\r\\n means "I am done".',
          },
        },
        {
          wrong: '# في المنصة:\nimport socket',
          right: '# في المنصة:\nresponse = \'HTTP/1.1 200 OK\\n\\n...\'  # متن مخزّن',
          note: {
            ar: 'استيراد socket داخل منصة pypath يرمي ModuleNotFoundError — لا شبكة في المتصفح. نحاكي الشبكة بمتن مخزّن، وشيفرة socket1.py تُجرَّب على حاسوبك ببايثون سطح المكتب.',
            en: 'Importing socket inside the pypath platform raises ModuleNotFoundError — there is no network in the browser tab. We simulate the network with a stored response, and socket1.py is tried on your own computer with desktop Python.',
          },
        },
        {
          wrong: "words = response.split()  # يحصي كلمات الترويسة أيضًا",
          right: "head, body = response.split('\\n\\n', 1)\nwords = body.split()",
          note: {
            ar: 'الترويسة كلمات كثيرة لا علاقة لها بالقصيدة: Date وServer وGMT. احصِ كلمات المتن وحده بعد قطع الحد الفاصل — وإلا انتفخ رقمك بلا سبب.',
            en: 'The header is full of words with nothing to do with the poem: Date, Server, GMT. Count the body words alone, after cutting at the boundary — otherwise your number inflates for no reason.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المتصفح الأصغر دورته أربعة أفعال: connect على المنفذ 80، ثم إرسال GET والسطر الفارغ، ثم recv قطعةً قطعة حتى الفارغ، ثم close.', en: 'The smallest browser is four actions: connect on port 80, then send GET and the blank line, then recv chunk after chunk until empty, then close.' },
        { ar: 'نحاكي الشبكة بمتن مخزّن: socket1.py شيفرة سطح مكتب على حاسوبك، والاستجابة المخزّنة في المنصة تُحلل بالأدوات نفسها.', en: 'We simulate the network with a stored response: socket1.py is desktop code for your computer, while the stored response in the platform is analyzed with the very same tools.' },
        { ar: "بعد الوصول يبدأ الفهم: split('\\n\\n', 1) يفصل الترويسة، وsplit('\\n') يحصي الأسطر، وsplit() يحصي الكلمات — تراث الفصول السابعة والثامنة.", en: "After arriving, understanding begins: split('\\n\\n', 1) separates the header, split('\\n') counts lines, and split() counts words — chapter 7 and 8 heritage." },
      ],
      reflectPrompt: {
        ar: 'متصفحك المحاكى يطبع الرمز 200 ثم يعدّ الكلمات. لو أراد أحدهم عناوين جميع الروابط في صفحة HTML بدلًا من كلمات قصيدة — أي خطوة تتغير وأي خطوات تبقى؟',
        en: 'Your simulated browser prints the 200 code then counts words. If someone wanted all the link addresses in an HTML page instead of poem words — which step changes and which stay?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch12.s2', pages: 'ص191 / pp.191' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch12.s2', pages: 'ص191 / pp.191' },
  ],
} satisfies Lesson;

export default lesson;
