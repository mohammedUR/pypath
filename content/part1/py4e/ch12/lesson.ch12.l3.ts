import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch12.l3 — "Images and Binary Data over HTTP /
 * الصور والبيانات الثنائية عبر HTTP"
 * Aligned with PY4E ch12 s3 (استعادة صورة عن طريق HTTP) and s5
 * (قراءة الملفات المشفرة ثنائيًا باستخدام URLLIB).
 * All expression is original.
 * SIMULATED-NETWORK design: the book's urljpeg.py (recv loop accumulating a
 * picture, find(b'\r\n\r\n'), open('stuff.jpg','wb')) is framed conceptually
 * as desktop-Python; the runnable code embeds a small ASCII-safe bytes
 * response, splits it at the CRLF blank line, decodes the header and inspects
 * the bytes body — including the Content-Length idea.
 */
const lesson = {
  id: 'py4e.ch12.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 12,
  title: { ar: 'الصور والبيانات الثنائية عبر HTTP', en: 'Images and Binary Data over HTTP' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch12.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'جلبنا نصًّا وطبعناه على الشاشة — لكن الصور والفيديو والملفات المضغوطة لا تُطبع، فهي ليست حروفًا أصلًا: هي بايتات. هذا الدرس يفتح عالم البيانات الثنائية عبر HTTP، بالشيفرة الحقيقية التي يجلب بها الكتاب صورة غلاف الكتاب، وبالشكل البايتي الكامل للسطر الفارغ \\r\\n\\r\\n الذي لمسناه سابقًا. وكالعادة نحاكي الشبكة بمتن مخزّن: استجابة بايتية صغيرة في متغير تعطيك كل المهارة دون بايت واحد من الشبكة. بنهاية الدرس ستكون قادرًا على: تمييز البايتات من النصوص واستخدام b\'\' وencode() وdecode()، وقراءة ترويسة Content-Length وContent-Type الثنائية، وإيجاد حد الترويسة بـ find(b\'\\r\\n\\r\\n\') وقفزه بأربعة محارف.',
        en: "We fetched text and printed it — but images, videos and compressed files cannot be printed, for they are not letters at all: they are bytes. This lesson opens the world of binary data over HTTP, with the real code the book uses to fetch its cover image and with the full byte-shaped blank line \\r\\n\\r\\n we have already brushed against. And as always we simulate the network with a stored response: a tiny bytes reply in a variable that gives you every skill without one network byte. By the end of this lesson you will be able to: distinguish bytes from strings and use b'', encode() and decode(), read the binary Content-Type and Content-Length headers, and locate the header boundary with find(b'\\r\\n\\r\\n') and skip it by four characters.",
      },
    },
    {
      kind: 'predict',
      code: "data = b'Hello'\nprint(data.decode())\nprint(len(data))",
      question: {
        ar: 'الحرف b قبل الاقتباس يصنع شيئًا مختلفًا عن السلاسل التي عرفتها. ماذا يطبع السطران؟',
        en: 'The b before the quotes creates something different from the strings you know. What do the two lines print?',
      },
      reveal: {
        ar: 'يطبع Hello ثم 5. البايتات تجاور النصوص في بايثون لكنها نوع مختلف: b\'...\' تصنع سلسلة بايتات، وdecode() يحولها إلى نص مقروء، وlen يعدّ بايتاتها. لكل محرف في Hello بايت واحد فهذا مثال بسيط — في الصور البايتات لا تعني حروفًا إطلاقًا.',
        en: "It prints Hello then 5. Bytes live next to strings in Python but are a different type: b'...' makes a bytes object, decode() turns it into readable text, and len counts its bytes. Every letter of Hello costs one byte, which makes this example simple — in images the bytes mean no letters at all.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الشبكة تنقل بايتات', en: 'The network carries bytes' },
      chunks: [
        {
          ar: 'أحد متطلبات HTTP أن البيانات تُرسل وتُستقبل سلسلة بايتات لا سلاسل نصية. البايتات في بايثون تُكتب b\'Hello\'، والتابعين encode() وdecode() مكافئان تمامًا لهذه الصيغة: \'Hello\'.encode() تعطي b\'Hello\' والعكس يعيدها نصًّا. لذلك رأى متصفح الدرس الماضي البيانات تمر بـ decode() قبل الطباعة. الصورة أسوأ: بايتاتها ليست حروفًا مشفرة بنظام UTF-8، فمن يجرؤ على decode() عليها يلتقي UnicodeDecodeError — الترويسة وحدها نصّ، والمتن بايتات.',
          en: "One requirement of HTTP is that data is sent and received as a series of bytes, not strings. Bytes in Python are written b'Hello', and the pair encode() and decode() is exactly equivalent to that spelling: 'Hello'.encode() gives b'Hello', and the reverse returns it to text. That is why last lesson's browser pushed the data through decode() before printing. Images are worse: their bytes are not UTF-8-encoded letters, so whoever dares decode() them meets UnicodeDecodeError — the header alone is text, the body is bytes.",
        },
        {
          ar: "برنامج الكتاب urljpeg.py — شيفرة سطح مكتب تعمل على حاسوبك — يستقبل الصورة قطعةً قطعة بـ recv(5120) ويجمّعها في متغير picture = picture + data حتى ينفد المقبض، ثم يطبع len(data) في كل دورة فترى الدفعات تتراوح كما وردت في الكتاب بين 3200 و5120 بايتًا بحسب سرعة الشبكة. هذا الجمع التراكمي نفسه الذي تعرفه من حلقات الفصل الخامس — أما الوصول عبر socket فنحاكيه بمتن مخزّن.",
          en: "The book's urljpeg.py — desktop code for your own computer — receives the picture chunk by chunk with recv(5120) and accumulates it in picture = picture + data until the socket runs dry, printing len(data) each pass so you watch the chunks range — as the book reports — from 3200 to 5120 bytes depending on network speed. That same accumulation loop you know from chapter five; only the socket reaching do we simulate with a stored response.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'حد الترويسة في بايتات', en: 'The header boundary in bytes' },
      chunks: [
        {
          ar: "الترويسة تنتهي بالسطر الفارغ، وعلى الشبكة الحقيقية هذا الحد هو b'\\r\\n\\r\\n' — زوجا نهاية سطر متتاليان. برنامج الصورة يجده بـ pos = picture.find(b'\\r\\n\\r\\n') فيعطي «طول الترويسة» 393 في خرج الكتاب، يطبع الترويسة بـ picture[:pos].decode()، ثم يقفز المتن بـ picture = picture[pos+4:] لأن الحد نفسه أربعة محارف، وأخيرًا يحفظ البايتات بـ open('stuff.jpg', 'wb') — وضع wb يفتح ملفًا ثنائيًا للكتابة. ومن ترويسته يقرأ Content-Type: image/jpeg وContent-Length: 230210 أي حجم الصورة بالبايتات.",
          en: "The header ends with the blank line, and on the real network that boundary is b'\\r\\n\\r\\n' — two consecutive line-end pairs. The image program finds it with pos = picture.find(b'\\r\\n\\r\\n'), giving the 'Header length' 393 reported in the book's output, prints the header with picture[:pos].decode(), then skips to the body with picture = picture[pos+4:] since the boundary itself is four characters, and finally saves the bytes with open('stuff.jpg', 'wb') — mode wb opens a binary file for writing. From its header it reads Content-Type: image/jpeg and Content-Length: 230210, the picture size in bytes.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'استجابة بايتية تحت المجهر', en: 'A bytes response under the microscope' },
      code: "response = b'HTTP/1.1 200 OK\\r\\nContent-Type: image/jpeg\\r\\nContent-Length: 10\\r\\n\\r\\nPICTURE123'\npos = response.find(b'\\r\\n\\r\\n')\nhead = response[:pos].decode()\nbody = response[pos + 4:]\nprint(pos)\nprint(head.split('\\r\\n')[0].split()[1])\nprint(len(body))\nprint(body.decode())",
      explanation: {
        ar: "نحاكي الشبكة بمتن مخزّن — هذه المرة بصيغته البايتية الكاملة: أسطر بـ \\r\\n والحد الفارغ b'\\r\\n\\r\\n'. find يعيد موضع بداية الحد: 61 محرفًا من الترويسة قبل الحد. نقسم الترويسة المفكوكة بـ split('\\r\\n') فنلتقط الرمز 200. ثم pos+4 يقفز فوق الحد نفسه فيبقى المتن b'PICTURE123' بعشرة بايتات — وهي نفسها التي وعدت بها ترويسة Content-Length: 10. والمتن ASCII بسيط كي يُفكك decode() أمامك؛ في الصورة الحقيقية لا يُفكك المتن إطلاقًا بل يُكتب في ملف wb.",
        en: "We simulate the network with a stored response — this time in its full byte spelling: lines ending \\r\\n and the blank boundary b'\\r\\n\\r\\n'. find returns where the boundary starts: 61 characters of header precede it. We split the decoded header on '\\r\\n' and capture the code 200. Then pos+4 jumps over the boundary itself, leaving the body b'PICTURE123' of ten bytes — exactly the count promised by Content-Length: 10. The body is simple ASCII so decode() can show it to you; a real image body is never decoded but written into a wb file.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.binary-parse',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "الاستجابة البايتية معطاة في المحرر. حلّلها كبرنامج الصور: ابحث عن الحد بـ response.find(b'\\r\\n\\r\\n') واحفظه في pos، وفكك الترويسة response[:pos].decode() إلى head، وقفز المتن بـ response[pos + 4:] إلى body. ثم اطبع: 'pos: %d' بطول الترويسة، و'type: %s' بقيمة Content-Type (من السطر الثالث في head بعد split('\\r\\n'))، و'bytes: %d' بطول المتن، وbody بعد فككه decode(). المتوقع: pos: 57 ثم type: image/jpeg ثم bytes: 10 ثم FAKEDATA99.",
        en: "The bytes response is given in the editor. Parse it like the image program: find the boundary with response.find(b'\\r\\n\\r\\n') into pos, decode the header response[:pos].decode() into head, and slice the body with response[pos + 4:] into body. Then print: 'pos: %d' with the header length, 'type: %s' with the Content-Type value (from the third line of head after split('\\r\\n')), 'bytes: %d' with the body length, and body after decoding it. Expected: pos: 57, then type: image/jpeg, then bytes: 10, then FAKEDATA99.",
      },
      starterCode: "response = b'HTTP/1.1 200 OK\\r\\nServer: Apache\\r\\nContent-Type: image/jpeg\\r\\n\\r\\nFAKEDATA99'\n# برنامج الصور المحاكى: find للحد ثم فكك الترويسة وقفز المتن / simulated image program: find the boundary, decode header, skip body\n",
      solution: "response = b'HTTP/1.1 200 OK\\r\\nServer: Apache\\r\\nContent-Type: image/jpeg\\r\\n\\r\\nFAKEDATA99'\npos = response.find(b'\\r\\n\\r\\n')\nhead = response[:pos].decode()\nbody = response[pos + 4:]\nprint('pos: %d' % pos)\nprint('type: %s' % head.split('\\r\\n')[2].split(': ')[1])\nprint('bytes: %d' % len(body))\nprint(body.decode())",
      tests: [
        {
          id: 't1',
          name: { ar: 'طول الترويسة 57 مطبوع', en: 'The header length 57 is printed' },
          code: "assert 'pos: 57' in __learner_output__, ('expected: pos: 57 | actual: %r' % __learner_output__)",
          expected: 'pos: 57',
        },
        {
          id: 't2',
          name: { ar: 'نوع المحتوى image/jpeg مطبوع', en: 'The content type image/jpeg is printed' },
          code: "assert 'type: image/jpeg' in __learner_output__, ('expected: type: image/jpeg | actual: %r' % __learner_output__)",
          expected: 'type: image/jpeg',
        },
        {
          id: 't3',
          name: { ar: 'طول المتن 10 بايتات مطبوع', en: 'The body length 10 bytes is printed' },
          code: "assert 'bytes: 10' in __learner_output__, ('expected: bytes: 10 | actual: %r' % __learner_output__)",
          expected: 'bytes: 10',
        },
        {
          id: 't4',
          name: { ar: 'التشريح نفسه صحيح: المتن بايتات في القفزة الصحيحة', en: 'The dissection itself is right: body is bytes at the correct skip' },
          code: "assert body == b'FAKEDATA99' and isinstance(body, bytes) and pos == 57, ('expected: body b FAKEDATA99 bytes and pos 57 | actual: %r %r' % (body, pos))",
          expected: 'body b FAKEDATA99 / pos 57',
        },
      ],
      hints: [
        { ar: "ابحث عن الحد بـ response.find(b'\\r\\n\\r\\n') — البايتات تُقارن ببايتات، فالنمط نفسه بحرف b.", en: "Find the boundary with response.find(b'\\r\\n\\r\\n') — bytes compare against bytes, so the pattern carries the b too." },
        { ar: "الترويسة response[:pos].decode() والمتن response[pos + 4:] — الأربعة هي \\r\\n\\r\\n نفسها.", en: "The header is response[:pos].decode() and the body response[pos + 4:] — the four are the \\r\\n\\r\\n itself." },
        { ar: "الهيكل:\npos = response.find(b'\\r\\n\\r\\n')\nhead = response[:pos].decode()\nbody = response[pos + 4:]\nprint('pos: %d' % pos)\nprint('type: %s' % head.split('\\r\\n')[2].split(': ')[1])\nprint('bytes: %d' % len(body))\nprint(body.decode())", en: "The skeleton:\npos = response.find(b'\\r\\n\\r\\n')\nhead = response[:pos].decode()\nbody = response[pos + 4:]\nprint('pos: %d' % pos)\nprint('type: %s' % head.split('\\r\\n')[2].split(': ')[1])\nprint('bytes: %d' % len(body))\nprint(body.decode())" },
        { ar: "قيمة Content-Type في السطر الثالث لhead بعد split('\\r\\n')، وقيمته بعد ': ' — نفس أسلوب الفصل الأول.", en: "The Content-Type value sits on head's third line after split('\\r\\n'), its value after ': ' — the very technique of lesson one." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-bytes',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "x = b'AB'\nprint(len(x))\nprint(x.decode())\nprint('AB'.encode() == b'AB')",
      solution: '2\nAB\nTrue',
      answer: '2\nAB\nTrue',
      hints: [
        { ar: 'كل محرف في AB بايت واحد — وlen يعدّ البايتات.', en: 'Every letter of AB is one byte — and len counts bytes.' },
        { ar: 'decode يحول البايتات إلى نص عادي بلا حرف b في الطباعة.', en: 'decode turns the bytes into plain text, with no b in the print.' },
        { ar: 'الفصل السادس عاد: encode تابع سلسلة نصية ينتج البايتات المكافئة.', en: 'Chapter six returns: encode is a string method producing the equivalent bytes.' },
        { ar: 'الخرْج:\n2\nAB\nTrue', en: 'The output:\n2\nAB\nTrue' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-wb',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بعد أن يجمّع برنامج الكتاب بايتات الصورة في picture، ماذا يعني وضع wb في open(\'cover3.jpg\', \'wb\')؟',
        en: "After the book's program gathers the image bytes into picture, what does the wb mode in open('cover3.jpg', 'wb') mean?",
      },
      options: [
        { id: 'a', text: { ar: 'فتح الملف ثنائيًا للكتابة — البايتات تُكتب كما هي بلا تحويل نصي', en: 'Open the file as binary for writing — the bytes are written as-is with no text conversion' } },
        { id: 'b', text: { ar: 'فتح الملف للكتابة مع نسخة احتياطية', en: 'Open the file for writing with a backup copy' } },
        { id: 'c', text: { ar: 'فتح الملف للقراءة والطباعة على الشاشة', en: 'Open the file for reading and printing to screen' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الوسيط الأول اسم الملف والثاني الوضع — b فيه تعني binary.', en: 'The first argument names the file and the second is the mode — its b stands for binary.' },
        { ar: 'وضع w النصي الذي عرفته في الفصل السابع لا يصلح لبايتات صورة.', en: 'The text mode w you met in chapter seven does not suit image bytes.' },
        { ar: 'الكتاب نفسه استعمل wb لحفظ cover3.jpg وstuff.jpg.', en: 'The book itself used wb to save cover3.jpg and stuff.jpg.' },
        { ar: 'الجواب: فتح الملف ثنائيًا للكتابة.', en: 'Answer: open the file as binary for writing.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-decode',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: التابع الذي يحوّل سلسلة البايتات إلى سلسلة نصية مقروءة — كما فعلنا مع ترويسة الصورة — هو ____.',
        en: 'Fill the blank with one word: the method that turns a bytes object into a readable string — as we did with the image header — is ____.',
      },
      answer: 'decode',
      solution: 'decode',
      hints: [
        { ar: 'ستة أحرف — وعكسه encode.', en: 'Six letters — and its opposite is encode.' },
        { ar: 'رأيته يفكك ترويسة الصورة بعد التقطيع.', en: 'You saw it decode the image header after slicing.' },
        { ar: 'يُستدعى بنقطة على البايتات: body.____().', en: 'It is called with a dot on the bytes: body.____().' },
        { ar: 'الجواب: decode', en: 'Answer: decode' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — بايتات في كل اتجاه\n# Your playground — bytes in every direction\n\nword = b'Juliet'\nprint(word)\nprint(len(word))\nprint(word.decode())\nprint(word.decode().lower())\nprint('Romeo'.encode())\nprint(word + b' & ' + 'Romeo'.encode())\n\nresp = b'A\\r\\nB\\r\\n\\r\\nC'\npos = resp.find(b'\\r\\n\\r\\n')\nprint(pos)\nprint(resp[:pos])\nprint(resp[pos + 4:])",
      prompt: {
        ar: "جرّب بنفسك: البايتات تصاغ وتُفكك وتتسلسل بعامل +. راقب كيف يبقى حرف b في الطباعة حتى يستدعيه decode. جرّب find على b'\\r\\n\\r\\n' في رد صغير وقسّم قبل الحد وبعده. ثم — بحذر — اكتب word.decode().decode() عمدًا لترى رسالة AttributeError، وفكّر لماذا لا يجوز فكك مرة ثانية. لا اختبار هنا — فضولك فقط.",
        en: "Try it yourself: bytes are spelled, decoded and chained with +. Watch the b stay in the print until decode is called on it. Try find on b'\\r\\n\\r\\n' in a tiny response and slice before and after the boundary. Then — carefully — write word.decode().decode() on purpose to meet the AttributeError, and think why a second decode is impossible. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا نبحث عن b\'\\r\\n\\r\\n\' في استجابة الصورة تحديدًا؟',
            en: "Why do we search for b'\\r\\n\\r\\n' in the image response specifically?",
          },
          options: [
            { id: 'a', text: { ar: 'لأن السطر الفارغ الذي يفصل الترويسة عن المتن يُكتب على الشبكة زوجي \\r\\n متتاليين', en: 'Because the blank line separating header from body is written on the network as two consecutive \\r\\n pairs' } },
            { id: 'b', text: { ar: 'لأن الصور تخزن توقيعها في أول أربعة بايتات', en: 'Because images store their signature in their first four bytes' } },
            { id: 'c', text: { ar: 'لأن find لا يقبل النصوص العادية', en: 'Because find refuses plain strings' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الحد الفاصل الذي بسطناه إلى \\n\\n في الدرسين الأولين يظهر بحقته البايتية هنا: نهايتا سطر متتاليتان — أولاهما تُنهي الترويسة وثانيتهما السطر الفارغ.',
            en: "The boundary we simplified to \\n\\n in the first two lessons appears here in its true byte form: two consecutive line ends — the first ends the last header, the second is the blank line.",
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا تخبرك ترويسة Content-Length: 230210 في خرج الكتاب؟',
            en: 'What does the header Content-Length: 230210 in the book output tell you?',
          },
          options: [
            { id: 'a', text: { ar: 'حجم المتن القادم بالبايتات — حجم الصورة كاملة', en: 'The size of the incoming body in bytes — the whole image size' } },
            { id: 'b', text: { ar: 'عدد حروف الترويسة نفسها', en: 'The number of letters in the header itself' } },
            { id: 'c', text: { ar: 'سرعة الشبكة المطلوبة للتنزيل', en: 'The network speed required for the download' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'Content-Length يَعِد بعدد بايتات المتن — وفي مثال الكتاب 230210، بينما بلغ مجموع دفعات recv المرصودة 230607 بايتًا لأن الترويسة نفسها كانت ضمن ما استُقبل.',
            en: 'Content-Length promises the body byte count — 230210 in the book example, while the observed recv chunks totalled 230607 bytes because the header itself was part of what arrived.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "ومن الفصل السادس: أي تابع من توابع السلسلة النصية يعطي النتيجة نفسها التي يعطيها كتابة b'Hello'؟",
            en: "From chapter 6: which string method gives the same result as writing b'Hello'?",
          },
          options: [
            { id: 'a', text: { ar: "'Hello'.encode()", en: "'Hello'.encode()" } },
            { id: 'b', text: { ar: "'Hello'.lower()", en: "'Hello'.lower()" } },
            { id: 'c', text: { ar: "'Hello'.split()", en: "'Hello'.split()" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب صرّح أن b\' \' وencode() مكافئان — الاثنان ينتجان سلسلة بايتات من النص نفسه.',
            en: "The book states b' ' and encode() are equivalent — both produce a bytes object from the same text.",
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'في حلقة استقبال الصورة، ماذا يعني أن تعيد recv بايتات بطول صفر؟',
            en: 'In the image receive loop, what does it mean when recv returns zero-length bytes?',
          },
          options: [
            { id: 'a', text: { ar: 'أن الخادم أغلق طرف الاتصال — لا مزيد من البيانات', en: 'That the server closed its side — no more data is coming' } },
            { id: 'b', text: { ar: 'أن الصورة وصلت تالفة', en: 'That the image arrived corrupted' } },
            { id: 'c', text: { ar: 'أن عليك طلب بايتات أكبر في الاستدعاء التالي', en: 'That you must request larger bytes next call' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'سلسلة طول صفر هي وداع الخادم: أنهى إرساله فنكسر الحلقة — القاعدة نفسها من درس المتصفح.',
            en: 'A zero-length string is the server farewell: it finished sending, so we break the loop — the same rule from the browser lesson.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "fhand = open('stuff.jpg', 'w')",
          right: "fhand = open('stuff.jpg', 'wb')",
          note: {
            ar: 'وضع w النصي يريد نصًّا فيرمي TypeError حين تُطعمه بايتات، وأسوأ من ذلك أن الصورة تُتلف بتحويلات الترميز. الملفات الثنائية بوضع wb دائمًا.',
            en: 'Text mode w demands strings, raises TypeError when fed bytes, and worse, corrupts the picture through encoding conversions. Binary files always take wb.',
          },
        },
        {
          wrong: 'print(picture.decode())',
          right: 'print(picture[:pos].decode())',
          note: {
            ar: 'فكك الترويسة وحدها: بايتات الصورة الحقيقية ليست UTF-8 فالdecode على الكل يرمي UnicodeDecodeError. الحد b\'\\r\\n\\r\\n\' هو خيط الفصل بين ما يُفكك وما لا يُفكك.',
            en: "Decode the header alone: real image bytes are not UTF-8, so decoding everything raises UnicodeDecodeError. The b'\\r\\n\\r\\n' boundary is the dividing line between what decodes and what never does.",
          },
        },
        {
          wrong: 'body = response[pos:]',
          right: 'body = response[pos + 4:]',
          note: {
            ar: "find يعيد موضع بداية الحد لا نهايته: من pos تبدأ المحارف الأربعة \\r\\n\\r\\n. بلا القفزة الأربعة تلتصق بالصورة نهايات أسطر زائفة.",
            en: 'find returns where the boundary starts, not where it ends: the four characters \\r\\n\\r\\n begin at pos. Without the four-character skip, fake line ends stick to your picture.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'HTTP ينقل بايتات: b\'...\' وencode() مكافئان، وdecode() يعيد النص — والصورة لا تُفكك بل تُحفظ بوضع wb.', en: "HTTP carries bytes: b'...' and encode() are equivalent, decode() returns text — and an image is never decoded but saved with wb." },
        { ar: "حد الترويسة على الشبكة هو b'\\r\\n\\r\\n': find يجد موقعه، وpicture[:pos] الترويسة المفكوكة، وpicture[pos+4:] المتن — والقفزة أربعة محارف.", en: "The header boundary on the network is b'\\r\\n\\r\\n': find locates it, picture[:pos] is the decoded header, picture[pos+4:] the body — the skip is four characters." },
        { ar: 'نحاكي الشبكة بمتن مخزّن بصيغته البايتية: استجابة صغيرة ASCII تعلّمك البنية كاملة، وContent-Length يعدّ بايتات المتن.', en: 'We simulate the network with a stored response in byte form: a small ASCII reply teaches the whole structure, and Content-Length counts the body bytes.' },
      ],
      reflectPrompt: {
        ar: 'لماذا صمم مصممو HTTP الحد الفاصل سطرًا فارغًا لا كلمة خاصة مثل ENDHEAD؟ تخيّل صورة يحمل بايتاتها كلمة ENDHEAD صدفة — ماذا يحدث للحد الكلمي ولماذا الحد الفارغ أكثر أمانًا؟',
        en: 'Why did HTTP designers choose a blank line as the boundary instead of a special word like ENDHEAD? Imagine an image whose bytes contain the word ENDHEAD by chance — what happens to a word boundary and why is a blank line safer?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch12.s3', pages: 'ص194 / pp.194' },
        { book: 'PY4E', section: 'py4e.ch12.s5', pages: 'ص199 / pp.199' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch12.s3', pages: 'ص194 / pp.194' },
    { book: 'PY4E', section: 'py4e.ch12.s5', pages: 'ص199 / pp.199' },
  ],
} satisfies Lesson;

export default lesson;
