import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch12.l6 — "Chapter 12 Review and Project: Mini Browser /
 * مراجعة الفصل 12 ومشروع: متصفح مصغّر"
 * Aligned with PY4E ch12 s9 (ملاحظات UNIX/لينكس), s10 (فهرس المصطلحات),
 * s11 (تمارين).
 * All expression is original.
 * PROJECT "متصفح مصغّر" (mini browser): SELF-CONTAINED — an embedded raw HTTP
 * response (status line + 4 headers + blank line + body with two anchors);
 * the solution prints the status line, header count, body line count, word
 * count, and extracts all href values via regex with %-formatted prints.
 * Debug block: the code splits on '\n' instead of the blank-line boundary —
 * it RUNS and shows the wrong header count symptom; the fix uses the correct
 * split('\n\n', 1). s9 curl/telnet framed as on-your-own-machine tools.
 */
const lesson = {
  id: 'py4e.ch12.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 12,
  title: { ar: 'مراجعة الفصل 12 ومشروع: متصفح مصغّر', en: 'Chapter 12 Review and Project: Mini Browser' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch12.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أقفل الفصل الثاني عشر على خريطته كاملة: بروتوكول بسيط يتبادل طلبًا وردًّا، ومتصفح من عشرة أسطر فوق مآخذ الشبكة، وبايتات لا تنطوي على حروف، ومكتبة urllib تجعل الصفحة ملفًا، ثم استخراج الروابط من HTML. اليوم مراجعة شاملة وفهرس المصطلحات ومشروع الختام: متصفح مصغّر متكامل يقرأ ردًّا خامًا مخزّنًا فيطبع سطر الحالة وعدد الترويسات وأسطر المتن وكلماته ثم يستخرج كل الروابط بتعابير نمطية. بنهاية الدرس ستكون قادرًا على: مراجعة مصطلحات الفصل كاملة، وتنفيذ المشروع كاملًا، وتشخيص عطل الحد الفاصل الذي يختبر كل ما تعلمته.',
        en: 'Chapter twelve closes with its whole map: a simple protocol exchanging request and response, a ten-line browser over sockets, bytes that hold no letters, the urllib library making the page a file, then link extraction from HTML. Today is a full review with the glossary and the closing project: a complete mini browser reading a stored raw response, printing the status line, header count, body line count and word count, then extracting every link with regular expressions. By the end of this lesson you will be able to: review the chapter glossary in full, execute the project end to end, and diagnose the boundary bug that tests everything you learned.',
      },
    },
    {
      kind: 'predict',
      code: "response = 'HTTP/1.1 200 OK\\n\\nRomeo and Juliet'\nhead, body = response.split('\\n\\n', 1)\nprint(len(body.split()))",
      question: {
        ar: 'ردٌّ بلا ترويسات إطلاقًا — سطر الحالة ثم السطر الفارغ ثم المتن. كم كلمة سيحصي؟',
        en: 'A response with no headers at all — status line, blank line, body. How many words will it count?',
      },
      reveal: {
        ar: 'يطبع 3. حتى الرد الأبسط يخضع للقانون نفسه: القسم عند السطر الفارغ يعطي المتن، وsplit() يحصي كلماته. المشروع اليوم يبني على هذا السطر بالضبط، مضافًا إليه الترويسات والروابط.',
        en: "It prints 3. Even the simplest reply obeys the same law: cutting at the blank line yields the body, and split() counts its words. Today's project builds on exactly this line, extended with headers and links.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل وملاحظات يونكس ولينكس', en: 'The chapter map and UNIX/Linux notes' },
      chunks: [
        {
          ar: 'خريطة الفصل بست محطات: بروتوكول HTTP وتشريح الرد (الحالة والترويسة والسطر الفارغ والمتن)، ثم أبسط متصفح فوق socket، ثم الصور والبايتات وحد \\r\\n\\r\\n وwb، ثم urllib التي تجعل الصفحة ملفًا، ثم urlparse تفكك الروابط، ثم استخراج الروابط من HTML بالنمط غير الطماع. ومحطة الكتاب الأخيرة للمستخدمين المحظوظين: على أنظمة يونكس ولينكس وماك يمكنك من طرفية جهازك أن تعيد تجربة كل هذا بلا بايثون — أمر curl يجلب المستندات كما فعل متصفحنا ويطبع الترويسة والمتن: curl http://data.pr4e.org/romeo.txt — وأمر telnet يفتح اتصالًا خامًا تكتب فيه طلب GET بيديك. هذه أوامر طرفية على حاسوبك، لا في منصة pypath.',
          en: 'The chapter map has six stops: the HTTP protocol and response anatomy (status, headers, blank line, body); the simplest browser over socket; images and bytes with the \\r\\n\\r\\n boundary and wb; urllib making the page a file; urlparse dissecting links; and link extraction from HTML with the non-greedy pattern. The book last stop is for the lucky ones: on UNIX, Linux and macOS systems you can replay all of this from your machine terminal without Python — the curl command fetches documents as our browser did, printing the header and body: curl http://data.pr4e.org/romeo.txt — and telnet opens a raw connection where you type a GET request by hand. These are terminal commands on your own computer, not the pypath platform.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فهرس المصطلحات', en: 'Glossary' },
      chunks: [
        {
          ar: 'البروتوكول (protocol): قواعد تحدد من يبدأ وماذا يُرسل وما الردود — وHTTP بروتوكول الويب. مقبض الشبكة (socket): قناة ثنائية الاتجاه بين برنامجين تشبه الملف، تُقرأ وتُكتب. الطلب (request): سطر GET بعنوان المستند يليه سطر فارغ. الرد (response): سطر حالة مثل HTTP/1.1 200 OK أو 404 Not Found ثم الترويسات (headers) وهي أسطر «اسم: قيمة» تصف المستند، ثم سطر فارغ، ثم المتن (body) وهو البيانات الفعلية.',
          en: 'Protocol: rules deciding who starts, what is sent, and what the replies are — and HTTP is the web protocol. Socket: a two-way channel between two programs resembling a file, read and written. Request: a GET line with the document address followed by a blank line. Response: a status line such as HTTP/1.1 200 OK or 404 Not Found, then the headers, "name: value" lines describing the document, then a blank line, then the body, the actual data.',
        },
        {
          ar: 'البايتات (bytes): وحدات النقل على الشبكة، تُكتب b\'...\' وتُفكك بـ decode() — والمتن الثنائي كالصور يُحفظ بوضع wb. مكتبة urllib (على حاسوبك): تجعل الصفحة مقبض ملف تُقرأ حلقةً أو read()، وurlparse تعمل هنا وتفكك الرابط إلى scheme وnetloc وpath. لغة HTML: وسوم بين قواس زاوية، منها وسم الارتكاز <a> وخصيته href الحاملة للرابط. تعقب الويب (web scraping): استرجاع الصفحات وفحصها بحثًا عن أنماط — بالتعابير النمطية على الصفحات المنسقة، وبتحليل BeautifulSoup الفيسع على الحاسوب للفوضوية.',
          en: "Bytes: the units carried over the network, written b'...' and decoded with decode() — binary bodies like images are saved with wb. The urllib library (on your computer): makes the page a file handle read with a loop or read(), while urlparse runs here and dissects the URL into scheme, netloc and path. HTML: tags in angle brackets, among them the anchor tag <a> with its link-carrying href attribute. Web scraping: retrieving pages and scanning them for patterns — with regular expressions on tidy pages, and with forgiving BeautifulSoup parsing on your computer for the messy ones.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'متصفح مصغّر يعمل', en: 'A mini browser, working' },
      code: "import re\nresponse = 'HTTP/1.1 200 OK\\nDate: Mon, 01 Jan 2024 00:00:00 GMT\\nServer: Apache\\nContent-Type: text/html\\n\\nRomeo loves Juliet\\n<a href=\"http://www.py4e.com\">next page</a>\\n<a href=\"http://www.dr-chuck.com\">author</a>'\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('%s %s' % (status[1], status[2]))\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))\nlinks = re.findall('href=\"([^\"]+)\"', body)\nprint('links: %d' % len(links))\nfor link in links:\n    print('link: %s' % link)",
      explanation: {
        ar: "نحاكي الشبكة بمتن مخزّن ثم يشتغل المتصفح المصغّر بخمس محطات: القسم عند السطر الفارغ، فسطر الحالة يُقسم كلمات فيطبع 200 OK، فالترويسات أربعة أسطر ناقص سطر الحالة فتطبع headers: 3، فالمتن ثلاثة أسطر وثماني كلمات — لأن <a href=\"...\">book</a> وسمٌ كامل واحد ما دام بلا مسافات داخله ثم صفحة</a> كلمتان — فتطبع lines: 3 وwords: 8. ثم النمط غير الطماع يستخرج الرابطين فيطبع links: 2 ورابطًا بسطر. كل محطة من دروس الفصل — والمشروع التالي ردٌّ أثقل بترويسة إضافية.",
        en: 'We simulate the network with a stored response, then the mini browser runs through five stations: cut at the blank line; the status line splits into words printing 200 OK; headers are four lines minus the status line printing headers: 3; the body is three lines and eight words — because <a href="...">book</a> is one whole tag as long as no space sits inside it, and page</a> two words — printing lines: 3 and words: 8. Then the non-greedy pattern extracts the two links, printing links: 2 and one link per line. Every station is a chapter lesson — and the next project is a heavier response with one more header.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-recap',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "from urllib.parse import urlparse\nprint(urlparse('http://data.pr4e.org/x.txt').path)\nresponse = 'HTTP/1.1 404 Not Found\\n\\nmissing page'\nhead, body = response.split('\\n\\n', 1)\nprint(head.split('\\n')[0].split()[1])\nprint(len(body.split()))",
      solution: '/x.txt\n404\n2',
      answer: '/x.txt\n404\n2',
      hints: [
        { ar: 'سطر urlparse يعيد path للرابط — بالمائل البادئ.', en: 'The first line returns the URL path — leading slash included.' },
        { ar: 'الرد ردّ 404 بلا ترويسات: سطر الحالة ثم السطر الفارغ ثم كلمتان.', en: 'The reply is a headerless 404: status line, blank line, then two words.' },
        { ar: 'الرمز في الموضع [1] من كلمات سطر الحالة.', en: 'The code sits at position [1] of the status line words.' },
        { ar: 'الخرْج:\n/x.txt\n404\n2', en: 'The output:\n/x.txt\n404\n2' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mini-browser',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل — المتصفح المصغّر: الرد الخام معطى في المحرر ويتضمن سطر حالة وأربع ترويسات وسطرًا فارغًا ومتنًا فيه وسمي ارتكاز. حلّله بخمس محطات: اقسم عند السطر الفارغ إلى head وbody؛ واستخرج كلمات سطر الحالة في status ثم اطبع '%s %s' % (status[1], status[2])؛ واطبع 'headers: %d' بعدد الترويسات (أسطر head ناقص 1)؛ واطبع 'lines: %d' بعدد أسطر المتن و'words: %d' بعدد كلماته؛ ثم استخرج الروابط بنمط 'href=\"([^\"]+)\"' في links واطبع 'links: %d' بطولها وحلقة تطبع كل رابط بـ 'link: %s'. المتوقع: 200 OK ثم headers: 4 ثم lines: 3 ثم words: 7 ثم links: 2 ثم الرابطان.",
        en: 'The chapter project — the mini browser: the raw response is given in the editor with a status line, four headers, a blank line, and a body holding two anchors. Parse it in five stations: split at the blank line into head and body; extract the status line words into status and print \'%s %s\' % (status[1], status[2]); print \'headers: %d\' with the header count (head lines minus 1); print \'lines: %d\' with the body line count and \'words: %d\' with its word count; then extract the links with the pattern \'href="([^"]+)"\' into links, print \'links: %d\' with its length, and a loop printing each link as \'link: %s\'. Expected: 200 OK, then headers: 4, then lines: 3, then words: 7, then links: 2, then the two links.',
      },
      starterCode: "import re\nresponse = 'HTTP/1.1 200 OK\\nDate: Mon, 01 Jan 2024 00:00:00 GMT\\nServer: Apache\\nContent-Type: text/html\\nContent-Length: 97\\n\\nArise fair sun\\n<a href=\"http://www.py4e.com\">book</a>\\n<a href=\"http://www.dr-chuck.com\">chuck</a>'\n# المحطة 1: اقسم عند السطر الفارغ / station 1: split at the blank line\n# المحطة 2: سطر الحالة ثم اطبعه / station 2: the status line, then print it\n# المحطة 3: headers / station 3: headers\n# المحطة 4: lines وwords / station 4: lines and words\n# المحطة 5: links / station 5: links\n",
      solution: "import re\nresponse = 'HTTP/1.1 200 OK\\nDate: Mon, 01 Jan 2024 00:00:00 GMT\\nServer: Apache\\nContent-Type: text/html\\nContent-Length: 97\\n\\nArise fair sun\\n<a href=\"http://www.py4e.com\">book</a>\\n<a href=\"http://www.dr-chuck.com\">chuck</a>'\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('%s %s' % (status[1], status[2]))\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))\nlinks = re.findall('href=\"([^\"]+)\"', body)\nprint('links: %d' % len(links))\nfor link in links:\n    print('link: %s' % link)",
      tests: [
        {
          id: 't1',
          name: { ar: 'سطر الحالة 200 OK مطبوع', en: 'The status line 200 OK is printed' },
          code: "assert '200 OK' in __learner_output__ and '404' not in __learner_output__, ('expected: 200 OK without 404 | actual: %r' % __learner_output__)",
          expected: '200 OK',
        },
        {
          id: 't2',
          name: { ar: 'عدد الترويسات 4 مطبوع', en: 'The header count 4 is printed' },
          code: "assert 'headers: 4' in __learner_output__, ('expected: headers: 4 | actual: %r' % __learner_output__)",
          expected: 'headers: 4',
        },
        {
          id: 't3',
          name: { ar: 'أسطر المتن 3 وكلماته 7 مطبوعان', en: 'Body lines 3 and words 7 are printed' },
          code: "assert 'lines: 3' in __learner_output__ and 'words: 7' in __learner_output__, ('expected: lines: 3 and words: 7 | actual: %r' % __learner_output__)",
          expected: 'lines: 3 / words: 7',
        },
        {
          id: 't4',
          name: { ar: 'عدد الروابط 2 مطبوع', en: 'The link count 2 is printed' },
          code: "assert 'links: 2' in __learner_output__, ('expected: links: 2 | actual: %r' % __learner_output__)",
          expected: 'links: 2',
        },
        {
          id: 't5',
          name: { ar: 'الرابطان مطبوعان بصيغة link: بالترتيب', en: 'Both links printed in link: form, in order' },
          code: "assert 'link: http://www.py4e.com' in __learner_output__ and 'link: http://www.dr-chuck.com' in __learner_output__, ('expected: link: http://www.py4e.com and link: http://www.dr-chuck.com | actual: %r' % __learner_output__)",
          expected: 'link: http://www.py4e.com / link: http://www.dr-chuck.com',
        },
        {
          id: 't6',
          name: { ar: 'التحليل نفسه سليم: قائمة الروابط نظيفة بالترتيب', en: 'The parsing itself is sound: a clean ordered link list' },
          code: "assert links == ['http://www.py4e.com', 'http://www.dr-chuck.com'] and len(body.split('\\n')) == 3, ('expected: two bare links in order and 3 body lines | actual: %r' % (links,))",
          expected: 'two bare links in order / 3 body lines',
        },
      ],
      hints: [
        { ar: 'خمس محطات مرتبة لا سادس لها: قسم، وحالة، وترويسات، وأسطر وكلمات، ثم روابط.', en: 'Five ordered stations, no sixth: split, status, headers, lines and words, then links.' },
        { ar: 'كلمات سطر الحالة: status = head.split(\'\\n\')[0].split() — فالرمز status[1] والعبارة status[2].', en: "The status line words: status = head.split('\\n')[0].split() — so status[1] is the code and status[2] the phrase." },
        { ar: "الهيكل:\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('%s %s' % (status[1], status[2]))\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))\nlinks = re.findall('href=\"([^\"]+)\"', body)\nprint('links: %d' % len(links))\nfor link in links:\n    print('link: %s' % link)", en: "The skeleton:\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('%s %s' % (status[1], status[2]))\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))\nlinks = re.findall('href=\"([^\"]+)\"', body)\nprint('links: %d' % len(links))\nfor link in links:\n    print('link: %s' % link)" },
        { ar: 'النمط غير الطماع بأقواس الاستخراج من الدرس الماضي: re.findall(\'href="([^"]+)"\', body) — والروابط من المتن لا من الترويسة.', en: 'The non-greedy extraction pattern from last lesson: re.findall(\'href="([^"]+)"\', body) — links come from the body, not the header.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-boundary',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي رمز يحدد نهاية الترويسة وبداية المتن في الرد الخام المخزّن؟',
        en: 'Which marker marks the end of the headers and the start of the body in a stored raw response?',
      },
      options: [
        { id: 'a', text: { ar: 'السطر الفارغ — نهايتا سطر متتاليتان بلا محتوى بينهما', en: 'The blank line — two consecutive line ends with nothing between them' } },
        { id: 'b', text: { ar: 'سطر واحد ينتهي بـ \\n مرة واحدة', en: 'A single line ending with one \\n' } },
        { id: 'c', text: { ar: 'كلمة ENDHEAD في سطر مستقل', en: 'The word ENDHEAD on its own line' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'سطر الحالة والترويسات كلها وصف — فما الذي يفصل الوصف عن المحتوى؟', en: 'The status line and headers are all description — so what separates description from content?' },
        { ar: 'في درس البايتات رأيته بصيغته الشبكية: \\r\\n\\r\\n — زوجا نهاية سطر متتاليان.', en: 'In the bytes lesson you saw its network spelling: \\r\\n\\r\\n — two consecutive line-end pairs.' },
        { ar: 'نحن نخزّن ردودنا بصيغة مبسطة: نهاية سطر \\n واحدة فالسطر الفارغ \\n\\n.', en: 'We store our replies in the simplified spelling: one line end \\n, so the blank line is \\n\\n.' },
        { ar: 'الجواب: السطر الفارغ — نهايتا سطر متتاليتان بلا محتوى بينهما.', en: 'Answer: the blank line — two consecutive line ends with nothing between them.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-words',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل: في استجابة المشروع، المتن هو الأأسطر الثلاثة: Arise fair sun ثم <a href=\"http://www.py4e.com\">book</a> ثم <a href=\"http://www.dr-chuck.com\">chuck</a>. كم كلمة يعيدها body.split()؟ تذكّر: split() يقسم عند المسافات فقط، فالوسم بلا مسافات داخلية كلمة واحدة.",
        en: 'Without running: in the project response, the body is the three lines: Arise fair sun, then <a href="http://www.py4e.com">book</a>, then <a href="http://www.dr-chuck.com">chuck</a>. How many words does body.split() return? Remember: split() cuts at spaces only, so a tag with no inner spaces is one word.',
      },
      answer: '7',
      solution: '7',
      tolerance: 0,
      hints: [
        { ar: 'السطر الأول ثلاث كلمات عادية.', en: 'The first line is three plain words.' },
        { ar: 'وسم book بلا مسافات داخلية: <a كلمة وhref="...">book</a> كلمة — كلمتان.', en: 'The book tag has no inner spaces: <a is one word and href="...">book</a> another — two words.' },
        { ar: 'وسم chuck مثلها كلمتان. ثلاثة زائد اثنين زائد اثنين.', en: 'The chuck tag likewise two words. Three plus two plus two.' },
        { ar: 'الجواب: 7', en: 'Answer: 7' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-boundary',
      required: true,
      brokenCode: "import re\nresponse = 'HTTP/1.1 200 OK\\nDate: Mon, 01 Jan 2024 00:00:00 GMT\\nServer: Apache\\nContent-Type: text/html\\nContent-Length: 97\\n\\nArise fair sun\\n<a href=\"http://www.py4e.com\">book</a>\\n<a href=\"http://www.dr-chuck.com\">chuck</a>'\n# قسّمت عند أول نهاية سطر — يبدو منطقيًا / split at the first line end — seemed logical\nhead, body = response.split('\\n', 1)\nstatus = head.split()\nprint('%s %s' % (status[1], status[2]))\nprint('headers: %d' % (len(body.split('\\n')) - 1))\nprint('words: %d' % len(body.split()))\nlinks = re.findall('href=\"([^\"]+)\"', body)\nprint('links: %d' % len(links))",
      prompt: {
        ar: "المتصفح المصغّر يعمل لكن أرقامه مريبة: الترويسات تعدّ 7 بدلًا من 4، والكلمات انتفخت إلى 20 بدلًا من 7 — ومع ذلك الروابط صحيحة! شغّل الكود المعطوب وقارن خرجه بالمشروع الصحيح. الخلل في سطر التقسيم: قسّمنا عند أول \\n وهو نهاية سطر الحالة فقط، فابتلع body الترويسات كاملة. الحد الصحيح هو السطر الفارغ: split('\\n\\n', 1). أصلح السطر ليطبع 200 OK ثم headers: 4 ثم words: 7 ثم links: 2 كما في المشروع.",
        en: "The mini browser runs but its numbers smell wrong: headers count 7 instead of 4, and the words inflated to 20 instead of 7 — yet the links are correct! Run the broken code and compare its output with the correct project. The bug is in the split line: we split at the first \\n, which is only the end of the status line, so body swallowed the entire header block. The correct boundary is the blank line: split('\\n\\n', 1). Fix the line so it prints 200 OK, then headers: 4, then words: 7, then links: 2, exactly like the project.",
      },
      solution: "import re\nresponse = 'HTTP/1.1 200 OK\\nDate: Mon, 01 Jan 2024 00:00:00 GMT\\nServer: Apache\\nContent-Type: text/html\\nContent-Length: 97\\n\\nArise fair sun\\n<a href=\"http://www.py4e.com\">book</a>\\n<a href=\"http://www.dr-chuck.com\">chuck</a>'\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('%s %s' % (status[1], status[2]))\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('lines: %d' % len(body.split('\\n')))\nprint('words: %d' % len(body.split()))\nlinks = re.findall('href=\"([^\"]+)\"', body)\nprint('links: %d' % len(links))\nfor link in links:\n    print('link: %s' % link)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الترويسات 4 لا 7', en: 'Headers are 4, not 7' },
          code: "assert 'headers: 4' in __learner_output__ and 'headers: 7' not in __learner_output__, ('expected: headers: 4 without headers: 7 | actual: %r' % __learner_output__)",
          expected: 'headers: 4',
        },
        {
          id: 't2',
          name: { ar: 'الكلمات 7 لا 21', en: 'Words are 7, not 21' },
          code: "assert 'words: 7' in __learner_output__ and 'words: 20' not in __learner_output__, ('expected: words: 7 without words: 20 | actual: %r' % __learner_output__)",
          expected: 'words: 7',
        },
        {
          id: 't3',
          name: { ar: 'اللوحة كاملة: الحالة والروابط سليمة', en: 'The full board: status and links intact' },
          code: "assert '200 OK' in __learner_output__ and 'links: 2' in __learner_output__ and 'link: http://www.py4e.com' in __learner_output__, ('expected: 200 OK, links: 2, link lines | actual: %r' % __learner_output__)",
          expected: '200 OK / links: 2 / link lines',
        },
      ],
      hints: [
        { ar: 'العطل صامت: الكود يعمل بلا استثناء ولا رسالة — فقط أرقام مريبة. هذا أخطر عيوب التنقيح.', en: 'The bug is silent: the code runs with no exception and no message — only suspicious numbers. That is the deadliest debugging ailment.' },
        { ar: 'أول \\n في الرد ينهي سطر الحالة، فصار head سطر الحالة وحده وbody الترويسات والمتن معًا — لذلك تعدّ الترويسات 8 أسطر ناقص 1.', en: 'The first \\n in the response ends the status line, so head became the status line alone and body swallowed headers plus body — hence 8 lines minus 1.' },
        { ar: 'الإصلاح كلمة واحدة: split(\'\\n\', 1) تصير split(\'\\n\\n\', 1) — القسم عند السطر الفارغ لا عند أول نهاية سطر.', en: "The fix is one word: split('\\n', 1) becomes split('\\n\\n', 1) — cut at the blank line, not at the first line end." },
        { ar: 'وبعد الإصلاح أعِد استخراج سطر الحالة من head: status = head.split(\'\\n\')[0].split() كما في المشروع.', en: "And after the fix, re-extract the status line from head: status = head.split('\\n')[0].split() as in the project." },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — متصفحك الخاص\n# Your playground — your own browser\n\nimport re\nresponse = 'HTTP/1.1 404 Not Found\\nServer: nginx\\n\\n<h1>Lost page</h1>\\n<a href=\"/home.htm\">back home</a>'\nhead, body = response.split('\\n\\n', 1)\nstatus = head.split('\\n')[0].split()\nprint('%s %s' % (status[1], status[2]))\nprint('headers: %d' % (len(head.split('\\n')) - 1))\nprint('links: %d' % len(re.findall('href=\"([^\"]+)\"', body)))\nprint(re.findall('href=\"([^\"]+)\"', body))",
      prompt: {
        ar: 'جرّب بنفسك: هذا متصفحك أمام رد 404 وروابط نسبية. عدّل الرد: أضف ترويسات، واجعل الحالة 200، وأدخل رابطًا فيه مسافة عمدًا كي ترى كيف يقسمه [^"]+ عند المسافة. ثم اكتب نمطًا يجمع الروابط الشبكية فقط كما في الدرس الماضي. وأخيرًا افعل ما يفعله المصلّحون: كسر سطر التقسيم عمدًا واقرأ الأرقام المريبة. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: this is your browser facing a 404 with relative links. Edit the response: add headers, make the status 200, and slip in a link with a space on purpose to watch the pattern cut the link at that space. Then write a pattern grabbing only networked links as last lesson did. Finally do what debuggers do: break the split line on purpose and read the suspicious numbers. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في طلب المتصفح، ما دور السطر الفارغ بعد سطر GET؟',
            en: 'In the browser request, what is the role of the blank line after the GET line?',
          },
          options: [
            { id: 'a', text: { ar: 'يُخبر الخادم أن الطلب اكتمل — فما بعده ليس منه', en: 'It tells the server the request is complete — nothing after it belongs to it' } },
            { id: 'b', text: { ar: 'يبدأ المتن المطلوب', en: 'It starts the requested body' } },
            { id: 'c', text: { ar: 'يغلق مقبض الشبكة', en: 'It closes the socket' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'البروتوكول يتناوب: المتصفح يرسل ويصمت، فالخادم يرد — والصمت يُعلَم بسطر فارغ. بلا الإعلان ينتظر الطرفان.',
            en: 'The protocol takes turns: the browser sends then falls silent, so the server replies — and silence is announced by a blank line. Without it both wait.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: "ومن الفصل السادس: ماذا تنتج 'headers: %d' % (4)؟",
            en: "From chapter six: what does 'headers: %d' % (4) produce?",
          },
          options: [
            { id: 'a', text: { ar: 'headers: 4', en: 'headers: 4' } },
            { id: 'b', text: { ar: 'headers: %d', en: 'headers: %d' } },
            { id: 'c', text: { ar: '(4)', en: '(4)' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عامل التنسيق يستبدل %d بالعدد فينتج السطر الذي طبعته في كل تمرين هذا الفصل — من صياغة الفصل السادس.',
            en: 'The format operator substitutes %d with the number, producing the very line you printed in every exercise this chapter — chapter-six formatting.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل السابع: urlopen يجعل الصفحة تُقرأ سطرًا سطرًا بحلقة for — وهو النمط ذاته الذي تعاملنا به مع؟',
            en: 'From chapter seven: urlopen lets the page be read line by line with a for loop — the very pattern we used with what?',
          },
          options: [
            { id: 'a', text: { ar: 'الملفات المفتوحة بـ open', en: 'Files opened with open' } },
            { id: 'b', text: { ar: 'القواميس وأزواجها', en: 'Dictionaries and their pairs' } },
            { id: 'c', text: { ar: 'السلاسل النصية القصيرة', en: 'Short strings' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مقبض الصفحة مقبض ملف في سلوكه: حلقة for على الأسطر وread للكل — لهذا كتبنا صفحتنا المخزنة في ملف وقرأناها كما في worked.',
            en: 'The page handle behaves like a file handle: a for loop over lines and read for everything — which is why we wrote our stored page into a file and read it back as in the worked example.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثامن: ماذا يعيد body.split() في متصفحنا المصغّر؟',
            en: 'From chapter eight: what does body.split() return in our mini browser?',
          },
          options: [
            { id: 'a', text: { ar: 'قائمة كلمات المتن مقسومة عند المسافات', en: 'A list of the body words, cut at spaces' } },
            { id: 'b', text: { ar: 'عددًا صحيحًا مباشرة', en: 'An integer directly' } },
            { id: 'c', text: { ar: 'سلسلة نصية واحدة', en: 'One single string' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split يعيد قائمة — وlen يحصي عناصرها فيعطي words: 7 — والتقاطع بين قائمة الفصل الثامن وعدّاد len هو قلب المشروع.',
            en: 'split returns a list — and len counts its elements giving words: 7 — the meeting of the chapter-eight list and the len counter is the project core.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الفصل الحادي عشر: ماذا تفعل علامة الاستفهام في .+? داخل نمط الروابط؟',
            en: 'From chapter eleven: what does the question mark in .+? do inside the link pattern?',
          },
          options: [
            { id: 'a', text: { ar: 'تجعل المطابقة غير طماعة — تقف عند أول اقتباس فتأخذ رابطًا واحدًا', en: 'It makes the match non-greedy — stopping at the first quote and taking one link' } },
            { id: 'b', text: { ar: 'تجعل النقطة اختيارية', en: 'It makes the dot optional' } },
            { id: 'c', text: { ar: 'تبحث في نهاية السطر فقط', en: 'It searches at the end of the line only' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الطماع .+ يمتد إلى آخر اقتباس في الصفحة فيبتلع الروابط كلها في مطابقة؛ والـ ? يقلبه إلى أصغر مطابقة — رابط لكل مطابقة.',
            en: 'Greedy .+ stretches to the last quote on the page and swallows all links into one match; the ? flips it to the smallest match — one link per match.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'ماذا يعطيك urlparse(u).netloc للرابط http://data.pr4e.org/romeo.txt؟',
            en: 'What does urlparse(u).netloc give you for the URL http://data.pr4e.org/romeo.txt?',
          },
          options: [
            { id: 'a', text: { ar: 'المضيف data.pr4e.org', en: 'The host data.pr4e.org' } },
            { id: 'b', text: { ar: 'المسار /romeo.txt', en: 'The path /romeo.txt' } },
            { id: 'c', text: { ar: 'البروتوكول http', en: 'The protocol http' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'netloc هو المضيف بين // وأول مائل، وpath المسار بعده، وscheme البروتوكول قبله — القطع الثلاث من الدرس الرابع.',
            en: 'netloc is the host between // and the first slash, path is the route after it, scheme is the protocol before it — the three pieces from lesson four.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "head, body = response.split('\\n', 1)",
          right: "head, body = response.split('\\n\\n', 1)",
          note: {
            ar: "أول \\n ينهي سطر الحالة فتسرب الترويسات كلها إلى body: الترويسات تعدّ 7 بدل 4 والكلمات تنتفخ — وعطل صامت لا استثناء فيه. الحد هو السطر الفارغ.",
            en: "The first \\n ends the status line, leaking all headers into body: headers count 7 instead of 4 and words inflate — a silent bug with no exception. The boundary is the blank line.",
          },
        },
        {
          wrong: '# في المنصة:\nimport socket',
          right: '# في المنصة:\nresponse = \'...\'  # رد مخزّن / stored reply',
          note: {
            ar: 'socket وurllib.request وbs4 رموز سطح مكتب تثبت على حاسوبك — استيرادها في المنصة يرمي ModuleNotFoundError. نحاكي الشبكة بمتن مخزّن في كل شيفرة قابلة للتشغيل هنا.',
            en: 'socket, urllib.request and bs4 are desktop imports installed on your own computer — importing them in the platform raises ModuleNotFoundError. We simulate the network with a stored response in every runnable line here.',
          },
        },
        {
          wrong: "print('headers: %d' % len(head.split('\\n')))",
          right: "print('headers: %d' % (len(head.split('\\n')) - 1))",
          note: {
            ar: 'أسطر head تبدأ بسطر الحالة وهو ليس ترويسة — فعدّه ناقص واحد. خطأ من +1 يطبع 5 ترويسات في رد فيه 4.',
            en: 'The head lines open with the status line, which is not a header — so subtract one. An off-by-one prints 5 headers in a reply holding 4.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل كله قصة رمزين يتكلمان: طلب GET وسطر فارغ، فرد بسطر حالة وترويسات وسطر فارغ ومتن — وكل شيفرة المنصة تعمل على ردود مخزّنة تحاكي الشبكة.', en: 'The whole chapter is a two-speaker story: a GET request and a blank line, answered by a status line, headers, a blank line and a body — and all platform code runs on stored responses simulating the network.' },
        { ar: 'المتصفح المصغّر خمس محطات: قسم عند الحد، ورمز الحالة، وعدد الترويسات ناقص سطر الحالة، وأسطر المتن وكلماته، ثم الروابط بالنمط غير الطماع.', en: 'The mini browser is five stations: split at the boundary, the status code, header count minus the status line, body lines and words, then links with the non-greedy pattern.' },
        { ar: 'وعلى حاسوبك أنت: socket1.py وurljpeg.py وurllib وBeautifulSoup وأوامر curl وtelnet في طرفية يونكس ولينكس — المنصة تدربك على المنطق والحاسوب يمنحك الشبكة.', en: 'And on your own computer: socket1.py, urljpeg.py, urllib, BeautifulSoup and the curl and telnet commands in a UNIX/Linux terminal — the platform drills the logic and your machine provides the network.' },
      ],
      reflectPrompt: {
        ar: 'متصفحك المصغّر لا يرسل شيئًا: يقرأ ردًّا خُزّن سلفًا. اكتب في ثلاث جمل كيف تحوله إلى متصفح حقيقي على حاسوبك — أي أمر يحل محل المخزّن، وأين تضعه، وما الذي يبقى كما هو من خمس محطاتك.',
        en: 'Your mini browser sends nothing: it reads a pre-stored reply. In three sentences, write how you would turn it into a real browser on your computer — which command replaces the stored reply, where you would place it, and which of your five stations stay unchanged.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch12.s9', pages: 'ص209 / pp.209' },
        { book: 'PY4E', section: 'py4e.ch12.s10', pages: 'ص209 / pp.209' },
        { book: 'PY4E', section: 'py4e.ch12.s11', pages: 'ص210 / pp.210' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch12.s9', pages: 'ص209 / pp.209' },
    { book: 'PY4E', section: 'py4e.ch12.s10', pages: 'ص209 / pp.209' },
    { book: 'PY4E', section: 'py4e.ch12.s11', pages: 'ص210 / pp.210' },
  ],
} satisfies Lesson;

export default lesson;
