import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch12.l4 — "The urllib Library and URL Parsing /
 * مكتبة urllib وتحليل الروابط"
 * Aligned with PY4E ch12 s4 (استعادة صفحات الويب باستخدام مكتبة URLLIB).
 * All expression is original.
 * SIMULATED-NETWORK design: urllib.request.urlopen is taught conceptually as
 * desktop-Python (never runnable in the platform), while urllib.parse is pure
 * Python and IS runnable — urlparse decomposes embedded URLs into
 * scheme/netloc/path. A simulated "fetched page" is stored, written to a
 * MEMFS file (page-l12.html) and re-read like urlopen hands you the page.
 */
const lesson = {
  id: 'py4e.ch12.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 12,
  title: { ar: 'مكتبة urllib وتحليل الروابط', en: 'The urllib Library and URL Parsing' },
  estimatedMinutes: 17,
  prerequisites: ['py4e.ch12.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'مقبض الشبكة رأيك به كثير من التفاصيل: اتصال، وصياغة طلب، واستقبال قطع، وفصل ترويسة عن متن. مكتبة urllib تختصر ذلك كله: تشير إلى صفحة الويب فتقرأها كأنها ملف — وهنا يلتقي هذا الفصل بالفصل السابع. وفي نصف الدرس الآخر تتعلم أختها القابلة للتشغيل هنا: urllib.parse التي تفكك الرابط نفسه إلى أجزائه. نحاكي الشبكة بمتن مخزّن كما في كل الفصل، ونكتب الصفحة المخزنة في ملف ثم نقرأها كما يفعل urlopen. بنهاية الدرس ستكون قادرًا على: وصف نمط urlopen مع try/except، وتفكيك روابط بـ urlparse إلى scheme وnetloc وpath، وقراءة صفحة مخزّنة كأنها ملف.',
        en: 'The socket showed you too many details: connecting, shaping the request, receiving chunks, separating header from body. The urllib library condenses it all: you point at a web page and read it as if it were a file — and here this chapter meets chapter seven. And in the other half of the lesson you meet its runnable sibling here: urllib.parse, which dissects the URL itself into parts. We simulate the network with a stored response as throughout the chapter, and we write the stored page into a file then read it back the way urlopen hands you a page. By the end of this lesson you will be able to: describe the urlopen pattern with try/except, decompose URLs with urlparse into scheme, netloc and path, and read a stored page as if it were a file.',
      },
    },
    {
      kind: 'predict',
      code: "from urllib.parse import urlparse\nparts = urlparse('https://data.pr4e.org/romeo.txt')\nprint(parts.scheme)\nprint(parts.netloc)",
      question: {
        ar: 'هذه مكتبة تعمل في المنصة فعلًا — الوحدة الوحيدة الشبكية القابلة للتشغيل هنا. ماذا يطبع السطران؟',
        en: 'This library actually runs in the platform — the only network-related module runnable here. What do the two lines print?',
      },
      reveal: {
        ar: 'يطبع https ثم data.pr4e.org. urlparse يفكك الرابط إلى خصائص: scheme البروتوكول قبل النقطتين، وnetloc المضيف بعد //، وpath المسار. الرابط عنوان بريدي: البروتوكول من الذي، والمضيف إلى مَن، والمسار ماذا.',
        en: 'It prints https then data.pr4e.org. urlparse dissects the URL into attributes: the scheme is the protocol before the colon, the netloc is the host after //, and the path is the route. A URL is a postal address: the protocol says by whom, the host says to whom, the path says what.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'urllib: الصفحة ملف', en: 'urllib: the page as a file' },
      chunks: [
        {
          ar: "شيفرة الكتاب الحقيقية — سطح مكتب على حاسوبك: import urllib.request ثم fhand = urllib.request.urlopen('http://data.pr4e.org/romeo.txt') ثم حلقة for line in fhand تُفكك كل سطر بـ line.decode().strip() وتطبعه. urlopen يعيد مقبضًا يتصرّف مثل ملف: حلقة for تمر على أسطره، وread() يبلع المتن كله دفعة. الترويسة لا تراكم: urllib يتلقى جميعها ويتجاهلها ويعيد لك المحتوى وحده — لهذا رأيت أبيات romeo.txt فقط في خرج الكتاب.",
          en: "The book's real code — desktop Python on your computer: import urllib.request, then fhand = urllib.request.urlopen('http://data.pr4e.org/romeo.txt'), then a for line in fhand loop decoding each line with line.decode().strip() and printing it. urlopen returns a handle that behaves like a file: a for loop walks its lines, and read() swallows the whole body at once. The headers never bother you: urllib receives them all, ignores them, and hands you the content alone — that is why the book output showed only the romeo.txt verses.",
        },
        {
          ar: "ولأن الشبكة تخون أحيانًا — رابطًا خاطئًا أو خادمًا نائمًا — تُلفّ الاستدعاءات الشبكية بـ try/except كما تعلمت في الفصل السابع: try يحاول urlopen وexcept يلتقط الخطأ ويطبع رسالة مهذبة بدل انهيار البرنامج. وفي منصتنا لا شبكة: نحاكي الاستعادة بمتن مخزّن، وurllib.request يبقى على حاسوبك — بينما urllib.parse يعمل هنا فعلًا وسنتعلمه الآن.",
          en: "And because the network betrays you sometimes — a wrong link or a sleeping server — network calls are wrapped in try/except as chapter seven taught: try attempts urlopen and except catches the failure and prints a polite message instead of the program collapsing. In our platform there is no network: we simulate retrieval with a stored response, and urllib.request stays on your own computer — while urllib.parse genuinely runs here, and it is what we learn now.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'urlparse: تشريح الرابط', en: 'urlparse: dissecting the URL' },
      chunks: [
        {
          ar: "الرابط http://data.pr4e.org/romeo.txt ثلاث قطع: scheme هو http أي البروتوكول، وnetloc هو data.pr4e.org أي الخادم المضيف، وpath هو /romeo.txt أي مسار المستند على ذلك الخادم. يستخرجها urlparse في خصائص جاهزة: parts.scheme وparts.netloc وparts.path. هذه القطعة تخدمك في كل مكان: تمييز روابط https من http، وتجميع روابط جزئية في صفحة مع مضيفها، وفحص امتدادات الملفات في path.",
          en: "The URL http://data.pr4e.org/romeo.txt has three pieces: the scheme is http, the protocol; the netloc is data.pr4e.org, the host server; and the path is /romeo.txt, the document route on that server. urlparse extracts them into ready attributes: parts.scheme, parts.netloc and parts.path. These pieces serve you everywhere: telling https links from http, joining partial page links with their host, and inspecting file extensions inside the path.",
        },
        {
          ar: "ولأن الصفحة المخزّنة تتصرّف مثل ملف، سنجربها حرفيًا: نكتب صفحتنا المحاكاة في ملف page-l12.html بوضع w ثم نقرأه بـ read كما قرأت الملفات في الفصل السابع — ثم نحلل ترويسته ومتنه بأدوات الدرسين الأولين. نحاكي الشبكة بمتن مخزّن، والملف يحفظ المتن كما يحفظه urlopen لنا في بايثون السطحية.",
          en: "And since a stored page behaves like a file, we will try it literally: we write our simulated page into a file page-l12.html in w mode, then read it back with read as you read files in chapter seven — then analyze its header and body with the tools of the first two lessons. We simulate the network with a stored response, and the file keeps the content the way urlopen keeps it for you in desktop Python.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'روابط تُفكك وصفحة تُقرأ', en: 'Links dissected, a page read' },
      code: "from urllib.parse import urlparse\nurls = ['http://data.pr4e.org/romeo.txt', 'https://www.py4e.com/code3']\nfor u in urls:\n    parts = urlparse(u)\n    print('%s|%s|%s' % (parts.scheme, parts.netloc, parts.path))\npage = 'HTTP/1.1 200 OK\\nContent-Type: text/html\\n\\n<a href=\"page2.htm\">next</a>'\nout = open('page-l12.html', 'w')\nout.write(page)\nout.close()\nfhand = open('page-l12.html')\nraw = fhand.read()\nfhand.close()\nhead, body = raw.split('\\n\\n', 1)\nprint('status: %s' % head.split('\\n')[0].split()[1])\nprint('type: %s' % head.split('\\n')[1].split(': ')[1])\nprint(body)",
      explanation: {
        ar: "الحلقة الأولى تفكك رابطين فتطبع قطعهما الثلاث بفواصل: http|data.pr4e.org|/romeo.txt ثم https|www.py4e.com|/code3 — لاحظ أن path يبدأ بمائل دائمًا. ثم نحاكي الشبكة بمتن مخزّن ونكتبه في page-l12.html ونقرأه كما يقرأ urlopen: صفحة كاملة في متغير raw. القسم المألوف: split('\\n\\n', 1) يفصل الترويسة، فنطبع الرمز 200 ونوع المحتوى text/html من السطر الثاني، ثم المتن — وسم ارتكاز واحد يحيل إلى page2.htm. قريب جدًا من استخراج الروابط الذي ينتظرك في الدرس القادم.",
        en: "The first loop dissects two URLs and prints their three pieces with separators: http|data.pr4e.org|/romeo.txt then https|www.py4e.com|/code3 — note the path always starts with a slash. Then we simulate the network with a stored response, write it into page-l12.html and read it back the way urlopen hands you a page: a complete document in the raw variable. The familiar part: split('\\n\\n', 1) separates the header, so we print the code 200 and the content type text/html from the second line, then the body — one anchor tag pointing at page2.htm. Very close to the link extraction awaiting you next lesson.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.urlparse-write',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "الرابط معطى في المحرر: http://data.pr4e.org/cover3.jpg. استورد urlparse من urllib.parse، وفكك الرابط في parts، ثم اطبع: 'scheme: %s' بالبروتوكول، و'host: %s' بالمضيف netloc، و'path: %s' بالمسار. المتوقع: scheme: http ثم host: data.pr4e.org ثم path: /cover3.jpg.",
        en: "The URL is given in the editor: http://data.pr4e.org/cover3.jpg. Import urlparse from urllib.parse, dissect the URL into parts, then print: 'scheme: %s' with the protocol, 'host: %s' with the netloc host, and 'path: %s' with the path. Expected: scheme: http, then host: data.pr4e.org, then path: /cover3.jpg.",
      },
      starterCode: "from urllib.parse import urlparse\nu = 'http://data.pr4e.org/cover3.jpg'\n# فكك الرابط ثم اطبع scheme وhost وpath / dissect the URL, then print scheme, host, path\n",
      solution: "from urllib.parse import urlparse\nu = 'http://data.pr4e.org/cover3.jpg'\nparts = urlparse(u)\nprint('scheme: %s' % parts.scheme)\nprint('host: %s' % parts.netloc)\nprint('path: %s' % parts.path)",
      tests: [
        {
          id: 't1',
          name: { ar: 'التخصائص الثلاث صحيحة كقيم', en: 'The three attributes are correct as values' },
          code: "assert parts.scheme == 'http' and parts.netloc == 'data.pr4e.org' and parts.path == '/cover3.jpg', ('expected: http data.pr4e.org /cover3.jpg | actual: %r %r %r' % (parts.scheme, parts.netloc, parts.path))",
          expected: 'http / data.pr4e.org / /cover3.jpg',
        },
        {
          id: 't2',
          name: { ar: 'scheme: http مطبوع', en: 'scheme: http is printed' },
          code: "assert 'scheme: http' in __learner_output__, ('expected: scheme: http | actual: %r' % __learner_output__)",
          expected: 'scheme: http',
        },
        {
          id: 't3',
          name: { ar: 'host: data.pr4e.org مطبوع', en: 'host: data.pr4e.org is printed' },
          code: "assert 'host: data.pr4e.org' in __learner_output__, ('expected: host: data.pr4e.org | actual: %r' % __learner_output__)",
          expected: 'host: data.pr4e.org',
        },
        {
          id: 't4',
          name: { ar: 'path: /cover3.jpg مطبوع', en: 'path: /cover3.jpg is printed' },
          code: "assert 'path: /cover3.jpg' in __learner_output__, ('expected: path: /cover3.jpg | actual: %r' % __learner_output__)",
          expected: 'path: /cover3.jpg',
        },
      ],
      hints: [
        { ar: 'الاستيراد أولًا: from urllib.parse import urlparse — الوحدة parse داخل حزمة urllib.', en: 'Import first: from urllib.parse import urlparse — the parse module inside the urllib package.' },
        { ar: 'urlparse(u) يعيد كائنًا خصائصه scheme وnetloc وpath — بلا أقواس بعد الأسماء.', en: 'urlparse(u) returns an object whose attributes are scheme, netloc and path — no parentheses after the names.' },
        { ar: "الهيكل:\nparts = urlparse(u)\nprint('scheme: %s' % parts.scheme)\nprint('host: %s' % parts.netloc)\nprint('path: %s' % parts.path)", en: "The skeleton:\nparts = urlparse(u)\nprint('scheme: %s' % parts.scheme)\nprint('host: %s' % parts.netloc)\nprint('path: %s' % parts.path)" },
        { ar: 'المسار يحتفظ بالمائل البادئ: /cover3.jpg لا cover3.jpg — لا تقلعه.', en: 'The path keeps its leading slash: /cover3.jpg, not cover3.jpg — do not strip it.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-urlparse',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "from urllib.parse import urlparse\np = urlparse('https://docs.python.org/3/index.html')\nprint(p.scheme)\nprint(p.netloc)\nprint(p.path)",
      solution: 'https\ndocs.python.org\n/3/index.html',
      answer: 'https\ndocs.python.org\n/3/index.html',
      hints: [
        { ar: 'scheme ما قبل :// — وهنا https بحرف s.', en: 'The scheme is what precedes :// — here https with its s.' },
        { ar: 'netloc المضيف بين // وأول مائل بعدها.', en: 'The netloc is the host between // and the first slash after it.' },
        { ar: 'path كل ما تبقى بعد المضيف — بالمائل البادئ وبكامل العمق.', en: 'The path is everything after the host — leading slash and full depth included.' },
        { ar: 'الخرْج:\nhttps\ndocs.python.org\n/3/index.html', en: 'The output:\nhttps\ndocs.python.org\n/3/index.html' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-urlopen',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما الذي يمنحه urlopen مبرمجًا ولا يمنحه مقبض الشبكة المباشر؟',
        en: 'What does urlopen give the programmer that a raw socket does not?',
      },
      options: [
        { id: 'a', text: { ar: 'التعامل مع الصفحة كأنها ملف مع إخفاء تفاصيل البروتوكول والترويسات', en: 'Treating the page like a file while hiding the protocol details and headers' } },
        { id: 'b', text: { ar: 'تنزيل الصور أسرع من أي مكتبة أخرى', en: 'Downloading images faster than any other library' } },
        { id: 'c', text: { ar: 'إلغاء الحاجة إلى بايثون كلها', en: 'Removing the need for Python altogether' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'استرجع فرق الخبرة: مع socket صغتَ الطلب يدويًا وقطعت الترويسة يدويًا.', en: 'Recall the difference in effort: with socket you shaped the request by hand and cut the header by hand.' },
        { ar: 'urllib يتكفل ببروتوكول HTTP كله ويعطيك المحتوى وحده — حلقة for جاهزة.', en: 'urllib handles the whole HTTP protocol and gives you the content alone — a ready for loop.' },
        { ar: 'السرعة ليست البِعَد هنا — الراحة هي البِعَد.', en: 'Speed is not the point here — comfort is.' },
        { ar: 'الجواب: صفحة كملف وتفاصيل بروتوكول مخفية.', en: 'Answer: the page as a file with the protocol details hidden.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-parse',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: الوحدة القابلة للتشغيل في المنصة التي تفكك الرابط إلى scheme وnetloc وpath تُستورد بـ from urllib.____ import urlparse.',
        en: 'Fill the blank with one word: the module runnable in the platform that dissects a URL into scheme, netloc and path is imported with from urllib.____ import urlparse.',
      },
      answer: 'parse',
      solution: 'parse',
      hints: [
        { ar: 'خمسة أحرف — ومعناها تحليل أو تفكيك.', en: 'Five letters — meaning analysis or dissection.' },
        { ar: 'urllib حزمة تحوي وحدتين شهيرتين: request الشبكية و ____ القابلة للتشغيل هنا.', en: 'urllib is a package holding two famous modules: the network request, and the one runnable here, ____.' },
        { ar: 'رأيت الاستيراد في التنبؤ وworked: from urllib.____ import urlparse.', en: 'You saw the import in the prediction and worked example: from urllib.____ import urlparse.' },
        { ar: 'الجواب: parse', en: 'Answer: parse' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — روابط بلا شبكة\n# Your playground — links without a network\n\nfrom urllib.parse import urlparse\n\nfor u in ['http://data.pr4e.org/romeo.txt', 'https://www.py4e.com', 'ftp://files.example.com/pub/x.zip']:\n    parts = urlparse(u)\n    print(parts.scheme, parts.netloc, parts.path)\n\np = urlparse('https://docs.python.org')\nprint(p.path == '')\n\npage = 'HTTP/1.1 200 OK\\n\\nRomeo and Juliet'\nhead, body = page.split('\\n\\n', 1)\nprint(len(body.split()))",
      prompt: {
        ar: "جرّب بنفسك: فكك روابط من صميمك — جرب بروتوكول ftp ولاحظ أن urlparse لا يرفض شيئًا، ورابطًا بلا مسار فترى path سلسلة فارغة، ورابطًا بمنفذ مثل :8080 فترى أين يحفظه. ثم عد إلى صفحة المخزنة وحصي كلماتها كما في المتصفح. لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: dissect URLs from your own head — try an ftp protocol and watch urlparse refuse nothing, a URL with no path and see path as an empty string, a URL with a port like :8080 and find where it is kept. Then return to the stored page and count its words as in the browser lesson. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يلف الكتاب استدعاء urlopen داخل try/except؟',
            en: 'Why does the book wrap the urlopen call inside try/except?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن رابطًا خاطئًا أو انقطاع شبكة يرمي استثناءً فيتحطم البرنامج إن لم يُلتقط', en: 'Because a wrong link or a network outage raises an exception that crashes the program if uncaught' } },
            { id: 'b', text: { ar: 'لأن urlopen يعيد خطأ دائمًا في أول استدعاء', en: 'Because urlopen always returns an error on the first call' } },
            { id: 'c', text: { ar: 'لأن try/except يسرّع التنزيل', en: 'Because try/except speeds up the download' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الشبكة فوضوية: أسماء مواقع خاطئة وخوادم ساقطة — وexcept يلتقط الخطأ فيطبع رسالة مهذبة بدل انهيار البرنامج، كما تعلمت مع الملفات.',
            en: 'The network is chaotic: wrong site names and fallen servers — except catches the failure and prints a polite message instead of a crash, just as you learned with files.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا يعيد urllib.request.urlopen في بايثون السطحية؟',
            en: 'What does urllib.request.urlopen return in desktop Python?',
          },
          options: [
            { id: 'a', text: { ar: 'مقبضًا يتصرّف مثل ملف مفتوح: تُقرأ أسطره بحلقة for ويُقرأ كله بـ read()', en: 'A handle that behaves like an open file: its lines are read with a for loop and everything with read()' } },
            { id: 'b', text: { ar: 'سلسلة نصية جاهزة بكل محتوى الصفحة', en: 'A ready string holding the whole page content' } },
            { id: 'c', text: { ar: 'قائمة بأسماء الملفات في الخادم', en: 'A list of the file names on the server' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يقرأ romeo.txt من الويب بحلقة for line in fhand — الصفحة مقبض ملف في كل شيء إلا أنها عبر الشبكة.',
            en: 'The book reads romeo.txt from the web with a for line in fhand loop — the page is a file handle in everything but being over the network.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثامن: في حلقة عدّ الكلمات على الصفحة المسترجعة، ما نوع words بعد words = line.decode().split()؟',
            en: 'From chapter 8: in the word-counting loop over the fetched page, what type is words after words = line.decode().split()?',
          },
          options: [
            { id: 'a', text: { ar: 'قائمة من السلاسل النصية', en: 'A list of strings' } },
            { id: 'b', text: { ar: 'قاموسًا من الكلمات إلى أعداد', en: 'A dictionary from words to counts' } },
            { id: 'c', text: { ar: 'سلسلة بايتات واحدة', en: 'One bytes object' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split يعيد قائمة كلمات دائمًا — وdecode قبلها يحول بايتات السطر إلى نص — ثم يحصيها القاموس بـ get كما في الفصل التاسع.',
            en: 'split always returns a list of words — decode before it turns the line bytes into text — then a dictionary counts them with get as in chapter nine.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ماذا يفعل استدعاء read() بعد urlopen في برنامج الصور curl1.py؟',
            en: 'What does calling read() after urlopen do in the image program curl1.py?',
          },
          options: [
            { id: 'a', text: { ar: 'يرجع المتن كله دفعة واحدة كسلسلة بايتات في متغير img', en: 'It returns the whole body at once as a bytes object into the img variable' } },
            { id: 'b', text: { ar: 'يقرأ سطرًا واحدًا فقط ثم يتوقف', en: 'It reads exactly one line then stops' } },
            { id: 'c', text: { ar: 'يحذف الترويسة من الخادم نفسه', en: 'It deletes the header on the server itself' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'read بلا وسيط يبلع كل شيء دفعة — يناسب الملفات الصغيرة، أما الكبيرة فتُقرأ كتلة كتلة كما في curl2.py حتى لا تنفد الذاكرة.',
            en: 'read with no argument swallows everything at once — fine for small files, while big ones are read block by block as in curl2.py so memory never runs dry.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'print(fhand.read())',
          right: 'print(fhand.read().decode())',
          note: {
            ar: 'read من urlopen يعيد بايتات فتُطبع بprefix الحرف b وبمحارف \\n ظاهرة. decode يحولها إلى نص نظيف قبل الطباعة — القاعدة: وصل بايتات؟ فكك أولًا.',
            en: 'read from urlopen returns bytes, printed with a leading b and visible \\n characters. decode turns them into clean text before printing — the rule: bytes arrived? decode first.',
          },
        },
        {
          wrong: '# في المنصة:\nimport urllib.request',
          right: '# في المنصة:\npage = \'HTTP/1.1 200 OK\\n\\n...\'  # متن مخزّن',
          note: {
            ar: 'urllib.request يحتاج شبكة لا تملكها المنصة فيرمي خطأ عند الاستخدام. نحاكي الاستعادة بمتن مخزّن — وurllib.request على حاسوبك، بينما urllib.parse يعمل هنا فعلًا.',
            en: 'urllib.request needs the network the platform does not have, so it errors when used. We simulate retrieval with a stored response — urllib.request lives on your own computer, while urllib.parse genuinely runs here.',
          },
        },
        {
          wrong: "print(urlparse(u).netloc)  # أظنه يعطي المسار /romeo.txt",
          right: "print(urlparse(u).path)",
          note: {
            ar: 'netloc هو المضيف data.pr4e.org لا المسار؛ وpath هو /romeo.txt. خلط الاثنين يجعل برنامجك يطلب «المستند» من اسم خاطئ تمامًا.',
            en: 'netloc is the host data.pr4e.org, not the route; path is /romeo.txt. Confusing them makes your program ask for the document from a completely wrong name.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'urllib.request (سطح مكتب): urlopen يعيد مقبض الصفحة كملف، تُقرأ بحلقة for أو read()، ويُلف بـ try/except لأن الشبكة تخون.', en: 'urllib.request (desktop): urlopen returns the page handle as a file, read with a for loop or read(), wrapped in try/except because the network betrays.' },
        { ar: 'urllib.parse يعمل في المنصة: urlparse يفكك الرابط إلى scheme وnetloc وpath — البروتوكول والمضيف والمسار.', en: 'urllib.parse runs in the platform: urlparse dissects the URL into scheme, netloc and path — protocol, host and route.' },
        { ar: 'نحاكي الشبكة بمتن مخزّن: الصفحة المخزنة كُتبت في page-l12.html وقُرئت كما يقرأ urlopen — ترويسته ومتنه بأدوات الدرسين الأولين.', en: "We simulate the network with a stored response: the stored page was written into page-l12.html and read back as urlopen does — its header and body with the first two lessons' tools." },
      ],
      reflectPrompt: {
        ar: 'صفحة فيها مئة رابط جزئي مثل page3.htm وأنت تعرف مضيفها. كيف تجمع الرابط الكامل من قطع urlparse الثلاث؟ اكتب الصيغة بالكلمات قبل أن تكتبها بكود.',
        en: 'A page holds a hundred partial links like page3.htm and you know its host. How do you assemble the full URL from the three urlparse pieces? Write the formula in words before writing it in code.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch12.s4', pages: 'ص198 / pp.198' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch12.s4', pages: 'ص198 / pp.198' },
  ],
} satisfies Lesson;

export default lesson;
