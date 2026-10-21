import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch13.l2 — "Parsing XML / تحليل نصوص XML"
 * Aligned with PY4E ch13 s2 (تحليل نصوص XML).
 * All expression is original.
 * The book's person payload is embedded as a triple-quoted string (service
 * response guaranteed as text); urlopen stays concept-only (Pyodide has no
 * network).
 */
const lesson = {
  id: 'py4e.ch13.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 13,
  title: { ar: 'تحليل نصوص XML', en: 'Parsing XML' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch13.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الدرس الماضي اقتنص نص وسم من سطر واحد بأدوات الفصل السادس — فتخيّل الآن مستند XML من مئة عنصر متداخل على عشرين سطرًا: هل ستقعد تعدّ مواضع الأقواس؟ هذا شغل الآلات لا البشر. اليوم يستلم المحلل ElementTree المضمّن في بايثون هذا العبء كاملًا: أنت تسلّمه سلسلة XML فيرجعها شجرة عناصر، ثم تسأل الشجرة بالاسم: أعطني نص name، وأعطني سمة hide. بنهاية الدرس ستكون قادرًا على: تحويل نص XML إلى شجرة بـ fromstring، وقراءة نص عنصر بـ find(...).text، وقراءة سمة بـ get(...)، وضبط سلوك النص متعدد الأسطر.',
        en: 'Last lesson harvested one tag\u2019s text from one line with chapter-6 tools — now imagine an XML document of a hundred nested elements over twenty lines: will you sit there counting bracket positions? That is machine work, not human work. Today the parser ElementTree, built into Python, takes the whole burden: you hand it an XML string and it hands you back a tree of elements, then you interrogate the tree by name: give me name\u2019s text, give me the hide attribute. By the end of this lesson you will be able to: turn XML text into a tree with fromstring, read an element\u2019s text with find(...).text, read an attribute with get(...), and manage multi-line text behavior.',
      },
    },
    {
      kind: 'predict',
      code: "import xml.etree.ElementTree as ET\ndata = '<person><name>Chuck</name></person>'\ntree = ET.fromstring(data)\nprint(tree.find('name').text)",
      question: {
        ar: 'سلّمنا المحلل سلسلة XML ثم سألنا الشجرة عن name. ماذا سيطبع؟',
        en: 'We handed the parser an XML string and then asked the tree about name. What will it print?',
      },
      reveal: {
        ar: 'Chuck. منstring حوّل السلسلة إلى شجرة عناصر، وfind(\'name\') جاب الشجرة بحثًا عن وسم مطابق فوجد العقدة، و.text هي بياناتها النصية المحصورة بين الوسمين. ثلاث خطوات: حوّل، ابحث، اقرأ — أما عدد الأقواس والمواضع فلم نحصها ولا مرة.',
        en: 'Chuck. fromstring turned the string into a tree of elements, find(\'name\') walked the tree looking for a matching tag and found the node, and .text is the textual payload trapped between the tags. Three steps: convert, search, read — and we never counted a single bracket position.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'المحلل والشجرة', en: 'The parser and the tree' },
      chunks: [
        {
          ar: 'المكتبة المضمّنة xml.etree.ElementTree نستوردها باسم مختصر بالعرف ET: import xml.etree.ElementTree as ET. التابع ET.fromstring(data) يأخذ سلسلة نصية تحوي XML فيرجع جذر شجرة من العناصر. متى صارت XML شجرة، صار لدينا توابع جاهزة للاستخراج: find يبحث عن وسم مطابق، و.text يعطي النص، و.get يعطي السمات — والقواعد الكتابية للوسوم والأقواس أضحت شغل المكتبة لا شغلنا.',
          en: 'The built-in library xml.etree.ElementTree is imported under a short alias: import xml.etree.ElementTree as ET. The method ET.fromstring(data) takes a string holding XML and returns the root of a tree of elements. Once XML has become a tree, extraction methods are ready at hand: find searches for a matching tag, .text gives the text, and .get gives attributes — the syntax of tags and brackets is now the library\u2019s job, not ours.',
        },
        {
          ar: 'لاحظ السلسلة ذات علامات الاقتباس الثلاثية \'\'\' في مثال الكتاب: تسمح نصًّا يمتد على عدة أسطر — وهي طريقتنا لضمّن رد الخدمة كاملًا في المتغير. على حاسوبك المكتبي كان data سيأتي من urlopen(url).read().decode() كما في الفصل الثاني عشر؛ نحن هنا نضمّن رد الخدمة نصيًّا لأن بيئة التشغيل بلا شبكة — والتحليل بعدها حرفيًّا واحد لكل الحالات.',
          en: 'Note the triple-quoted string \'\'\' in the book\u2019s example: it lets text span several lines — our way of embedding a whole service response in a variable. On your desktop data would come from urlopen(url).read().decode() as chapter 12 showed; here we embed the response as text because the runtime has no network — and parsing afterwards is character-for-character identical in both worlds.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'find وtext وget', en: 'find, text and get' },
      chunks: [
        {
          ar: 'find(\'name\') يبحث ضمن الأبناء المباشرين للعقدة عن وسم باسم name ويعيد عقدته؛ ثم نقرأ نصها بـ .text. أما السمات فمخزنة في وسم الافتتاح، فيأتيها التابع get(\'hide\') على العقدة نفسها. وفي مثال الكتاب: tree.find(\'name\').text تعطي Chuck وtree.find(\'email\').get(\'hide\') تعطي yes — نص وسمتَين من الشجرة نفسها بسؤالين قصيرين.',
          en: 'find(\'name\') searches the node\u2019s direct children for a tag named name and returns its node; we then read its text with .text. Attributes live in the opening tag, so get(\'hide\') fetches them from the same node. In the book\u2019s example: tree.find(\'name\').text gives Chuck and tree.find(\'email\').get(\'hide\') gives yes — the text and attribute of two tags from the same tree, via two short questions.',
        },
        {
          ar: 'انتبه لتفصيل مهم: نص العقدة هو كل ما بين الوسمين حرفًا حرفًا — في مستند مبطّن بأسطر ومسافات يكون .text محاطًا بهذه المسافات. عقدة phone في مثالنا تحمل \'\n +1 734 303 4456\n \' مع الأسطر الجديدة والمسافات البادئة، والتابع strip() من الفصل السادس ينظّفها. والعنصر الفارغ مثل email بلا .text يُذكر — بياناته في السمة وحدها.',
          en: 'Mind one detail: a node\u2019s text is everything between the tags, character by character — in an indented document .text arrives surrounded by that indentation. The phone node in our example holds \'\n +1 734 303 4456\n \' with newlines and leading spaces, and the chapter-6 method strip() cleans it. And an empty element like email has no .text to speak of — its data lives in the attribute alone.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'شجرة person كاملة من الكتاب', en: 'The book\u2019s full person tree' },
      code: "import xml.etree.ElementTree as ET\n\ndata = '''\n<person>\n   <name>Chuck</name>\n   <phone type=\"intl\">\n      +1 734 303 4456\n   </phone>\n   <email hide=\"yes\" />\n</person>'''\n\ntree = ET.fromstring(data)\nprint('Name:', tree.find('name').text)\nprint('Attr:', tree.find('email').get('hide'))",
      explanation: {
        ar: 'رد الخدمة مضمّن في data بسلسلة ثلاثية الاقتباس، وfromstring حوّله إلى شجرة جذعها person. السؤال الأول find(\'name\').text جاب أبناء الجذر فوجد عقدة name وقرأ نصها Chuck. السؤال الثاني find(\'email\').get(\'hide\') وجد العقدة الفارغة وقرأ سعتها المخزنة في وسم الافتتاح: yes. المخرج: Name: Chuck ثم Attr: yes — بلا عدّ مواضع ولا شرائح يدوية.',
        en: 'The service response is embedded in data as a triple-quoted string, and fromstring turned it into a tree rooted at person. The first question, find(\'name\').text, walked the root\u2019s children, found the name node and read its text Chuck. The second, find(\'email\').get(\'hide\'), found the empty node and read its payload stored in the opening tag: yes. Output: Name: Chuck then Attr: yes — no position counting, no manual slicing.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.parse-person',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'شجرة person مضمّنة في المحرر. حلّلها بـ ET.fromstring، ثم استخرج نص name في المتغير name، وسمة type من عقدة phone في المتغير ptype، وسمة hide من عقدة email في المتغير hide. اطبع الثلاثة كل في سطر. المتوقع: Chuck ثم intl ثم yes.',
        en: 'The person tree is embedded in the editor. Parse it with ET.fromstring, then extract the text of name into the variable name, the type attribute of the phone node into ptype, and the hide attribute of the email node into hide. Print all three, one per line. Expected: Chuck, then intl, then yes.',
      },
      starterCode: "import xml.etree.ElementTree as ET\n\ndata = '''\n<person>\n   <name>Chuck</name>\n   <phone type=\"intl\">\n      +1 734 303 4456\n   </phone>\n   <email hide=\"yes\" />\n</person>'''\n\ntree = ET.fromstring(data)\n# name وptype وhide / name, ptype and hide\n",
      solution: "import xml.etree.ElementTree as ET\n\ndata = '''\n<person>\n   <name>Chuck</name>\n   <phone type=\"intl\">\n      +1 734 303 4456\n   </phone>\n   <email hide=\"yes\" />\n</person>'''\n\ntree = ET.fromstring(data)\nname = tree.find('name').text\nptype = tree.find('phone').get('type')\nhide = tree.find('email').get('hide')\nprint(name)\nprint(ptype)\nprint(hide)",
      tests: [
        {
          id: 't1',
          name: { ar: 'النص المستخرج Chuck', en: 'The extracted text is Chuck' },
          code: "assert name == 'Chuck', 'expected: Chuck | actual: %r' % (name,)",
          expected: 'Chuck',
        },
        {
          id: 't2',
          name: { ar: 'سمة type هي intl', en: 'The type attribute is intl' },
          code: "assert ptype == 'intl', 'expected: intl | actual: %r' % (ptype,)",
          expected: 'intl',
        },
        {
          id: 't3',
          name: { ar: 'سمة hide هي yes', en: 'The hide attribute is yes' },
          code: "assert hide == 'yes', 'expected: yes | actual: %r' % (hide,)",
          expected: 'yes',
        },
        {
          id: 't4',
          name: { ar: 'الثلاثة مطبوعة أسطرًا', en: 'All three printed as lines' },
          code: "assert 'Chuck' in __learner_output__ and 'intl' in __learner_output__ and 'yes' in __learner_output__, 'expected: Chuck / intl / yes | actual: %r' % __learner_output__",
          expected: 'Chuck / intl / yes',
        },
      ],
      hints: [
        { ar: 'النص يقرأ من العقدة: tree.find(\'name\').text — والسمة تقرأ من العقدة نفسها بـ get.', en: "Text is read from the node: tree.find('name').text — the attribute is read from the same node with get." },
        { ar: 'سمة phone اسمها type وسمة email اسمها hide — مرّر الاسم نصًّا: get(\'type\').', en: "phone\u2019s attribute is named type and email\u2019s is named hide — pass the name as a string: get('type')." },
        { ar: 'الهيكل:\nname = tree.find(\'name\').text\nptype = tree.find(\'phone\').get(\'type\')\nhide = tree.find(\'email\').get(\'hide\')\nprint(name)\nprint(ptype)\nprint(hide)', en: "The skeleton:\nname = tree.find('name').text\nptype = tree.find('phone').get('type')\nhide = tree.find('email').get('hide')\nprint(name)\nprint(ptype)\nprint(hide)" },
        { ar: "name = tree.find('name').text\nptype = tree.find('phone').get('type')\nhide = tree.find('email').get('hide')\nprint(name)\nprint(ptype)\nprint(hide)", en: "name = tree.find('name').text\nptype = tree.find('phone').get('type')\nhide = tree.find('email').get('hide')\nprint(name)\nprint(ptype)\nprint(hide)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-find-get',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import xml.etree.ElementTree as ET\ndata = '<person><name>Sally</name><email hide=\"no\" /></person>'\ntree = ET.fromstring(data)\nprint(tree.find('name').text)\nprint(tree.find('email').get('hide'))\nprint(len(tree.find('name').text))",
      solution: 'Sally\nno\n5',
      answer: 'Sally\nno\n5',
      hints: [
        { ar: 'عقدة name نصها Sally — و.text يعيد نصًّا تصلح عليه كل توابع الفصل السادس.', en: 'The name node\u2019s text is Sally — and .text returns a string that accepts every chapter-6 method.' },
        { ar: 'الشجرة الثانية تعرض سمة hide بقيمة مختلفة — اقرأها من وسم الافتتاح.', en: 'The second tree shows a different hide value — read it from the opening tag.' },
        { ar: 'len على السلسلة يعيد عدد أحرفها — كم حرفًا في Sally؟', en: 'len on a string returns its length — how many letters in Sally?' },
        { ar: 'الخرْج:\nSally\nno\n5', en: 'The output:\nSally\nno\n5' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-fromstring',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا يعيد ET.fromstring(data)؟',
        en: 'What does ET.fromstring(data) return?',
      },
      options: [
        { id: 'a', text: { ar: 'جذر شجرة من العناصر يمثل مستند XML كله', en: 'The root of a tree of elements representing the whole XML document' } },
        { id: 'b', text: { ar: 'سلسلة نصية منقّاة من الوسوم', en: 'A string cleaned of all tags' } },
        { id: 'c', text: { ar: 'قائمة من السلاسل، واحدة لكل وسم', en: 'A list of strings, one per tag' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'لماذا نسمي المتغير الناتج tree؟', en: 'Why do we name the result tree?' },
        { ar: 'عليه نستدعي find وget — أي أنها توابع عقد في بنية متشعبة.', en: 'We call find and get on it — methods of nodes in a nested structure.' },
        { ar: 'المحلل يبني الشجرة في الذاكرة ليكون السؤال والإجابة بالاسم لا بالموضع.', en: 'The parser builds the tree in memory so questions and answers happen by name, not by position.' },
        { ar: 'الجواب: أ — جذر شجرة العناصر.', en: 'Answer: a — the root of the element tree.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-fromstring',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'التابع الذي يحوّل سلسلة نصية تحوي XML إلى شجرة عناصر هو ET.____(data)',
        en: 'The method that converts a string holding XML into a tree of elements is ET.____(data)',
      },
      answer: 'fromstring',
      solution: 'fromstring',
      hints: [
        { ar: 'اسمه يصف عمله: من سلسلة نصية إلى بنية.', en: 'Its name describes its job: from a string to a structure.' },
        { ar: 'كلمة واحدة تبدأ بـ from وتنتهي بـ string.', en: 'One word starting with from and ending with string.' },
        { ar: 'قابلها لاحقًا: ET.tostring يعمل العكس.', en: 'Its counterpart later: ET.tostring does the reverse.' },
        { ar: 'الجواب: fromstring', en: 'Answer: fromstring' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — اسأل الشجرة\n# Your playground — interrogate the tree\n\nimport xml.etree.ElementTree as ET\n\ndata = """\n<person>\n   <name>Chuck</name>\n   <phone type="intl">\n      +1 734 303 4456\n   </phone>\n   <email hide="yes" />\n</person>"""\n\ntree = ET.fromstring(data)\n\nprint(repr(tree.find("phone").text))\nprint(tree.find("phone").text.strip())\nprint(tree.find("email").get("hide"))\n\n# جرّب: أضف وسم <nickname> للبيانات واسأل عنه / try: add a <nickname> tag and ask about it',
      prompt: {
        ar: 'جرّب بنفسك: قارن repr لنص phone قبل strip وبعده — أين تختبئ الأسطر الجديدة؟ ثم أضف وسم nickname للبيانات واسأل الشجرة عنه، وجرّب find(\'phone\').get(\'hide\') لترى ماذا يعيد get عن سمة غير موجودة. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: compare the repr of phone\u2019s text before and after strip — where do the newlines hide? Then add a nickname tag to the data and ask the tree about it, and try find(\'phone\').get(\'hide\') to see what get returns for a missing attribute. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الفرق بين tree.find(\'name\').text وtree.find(\'email\').get(\'hide\')؟',
            en: 'What is the difference between tree.find(\'name\').text and tree.find(\'email\').get(\'hide\')?',
          },
          options: [
            { id: 'a', text: { ar: 'الأولى تقرأ النص بين الوسمين والثانية تقرأ سمة من وسم الافتتاح', en: 'The first reads the text between the tags, the second reads an attribute from the opening tag' } },
            { id: 'b', text: { ar: 'الأولى للعناصر الفارغة والثانية للعناصر النصية', en: 'The first is for empty elements, the second for text elements' } },
            { id: 'c', text: { ar: 'لا فرق — كلاهما يعيد السمات', en: 'No difference — both return attributes' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'اثنان موضعان مختلفان في العقدة: .text للمحتوى المحاصر بالوسمين، وget لزوج اسم="قيمة" داخل وسم الافتتاح.',
            en: 'Two different homes in a node: .text for the content trapped between the tags, get for a name="value" pair inside the opening tag.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السادس: tree.find(\'name\').text يعيد سلسلة نصية — أي هذه يستحيل عليها؟',
            en: "From chapter 6: tree.find('name').text returns a string — which of these is impossible for it?",
          },
          options: [
            { id: 'a', text: { ar: 'tree.find(\'name\').text[0] = \'X\' — إسناد حرف داخل سلسلة', en: "tree.find('name').text[0] = 'X' — assigning into a character of the string" } },
            { id: 'b', text: { ar: 'tree.find(\'name\').text.strip()', en: 'tree.find(\'name\').text.strip()' } },
            { id: 'c', text: { ar: 'len(tree.find(\'name\').text)', en: 'len(tree.find(\'name\').text)' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السلاسل مجمدة كما علّم الفصل السادس: strip وlen وسائر التوابع تعمل، أما إسناد حرف فيرمي TypeError — أعِد بناء سلسلة جديدة إن أردت تغييرًا.',
            en: 'Strings are immutable as chapter 6 taught: strip, len and the rest work, but assigning into a character throws TypeError — build a new string instead.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يُفضَّل المحلل على find اليدوي من الدرس الماضي في المستندات المبطّنة؟',
            en: 'Why does the parser beat last lesson\u2019s manual find on indented documents?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن النص المحاط بمسافات وأسطر جديدة يحتاج strip وعدّ مواضع متعب — والمحلل يفهم البنية لا المواضع', en: 'Because text surrounded by spaces and newlines needs strip and tiring position math — the parser understands structure, not positions' } },
            { id: 'b', text: { ar: 'لأن find اليدوي ممنوع في بايثون الحديثة', en: 'Because manual find is forbidden in modern Python' } },
            { id: 'c', text: { ar: 'لأن المحلل أسرع دائمًا بألف مرة', en: 'Because the parser is always a thousand times faster' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'في المستند المبطّن يصبح .text محاطًا بالأسطر البادئة وتصبح مواضع find هشة عند أي تعديل في التنسيق — المحلل يقرأ الشجرة فلا يتأثر بالشكل.',
            en: 'In an indented document .text arrives padded with leading lines and find positions turn brittle at any formatting tweak — the parser reads the tree and stays immune to layout.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ماذا يحدث لو سألت شجرة person عن tree.find(\'Name\') بحرف كبير ثم قرأت .text؟',
            en: 'What happens if you ask the person tree for tree.find(\'Name\') with a capital letter and then read .text?',
          },
          options: [
            { id: 'a', text: { ar: 'find يعيد None لأن الوسوم حساسة لحالة الأحرف — فترمي قراءة .text خطأ AttributeError', en: 'find returns None because tags are case-sensitive — then reading .text raises an AttributeError' } },
            { id: 'b', text: { ar: 'يعيد Chuck لأن المحلل يتجاهل حالة الأحرف', en: 'It returns Chuck because the parser ignores letter case' } },
            { id: 'c', text: { ar: 'يعيد سلسلة فارغة بلا أي خطأ', en: 'It returns an empty string with no error' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'أسماء الوسوم تُطابق حرفًا بحرف كما رأينا في الدرس الماضي مع find السلسلي — وfind الشجري لا يجد فلا يرمي، ويرمي من يستدعي .text على None. احفظ هذين الطرفين لتنقيح لاحق.',
            en: 'Tag names match letter by letter exactly as we saw with the string find last lesson — and tree find does not throw on a miss; the thrower is .text called on None. Remember both ends for later debugging.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "ptype = tree.find('phone').text  # أظنها السمة",
          right: "ptype = tree.find('phone').get('type')",
          note: {
            ar: '.text يعيد ما بين الوسمين — لوسم phone ذلك نص الرقم ممتلئًا بمسافات الأسطر، لا intl. السمات بلاطها get.',
            en: ".text returns what is between the tags — for phone that is the number text padded with newline spaces, not intl. Attributes belong to get.",
          },
        },
        {
          wrong: "num = tree.find('phone').text\nprint(num == '+1 734 303 4456')  # False على المفاجأة",
          right: "num = tree.find('phone').text.strip()\nprint(num == '+1 734 303 4456')  # True",
          note: {
            ar: 'في مستند مبطّن يشتمل .text على الأسطر الجديدة والمسافات البادئة من كلا الطرفين — فالمقارنة تفشل بصمت. نظّف بـ strip قبل المقارنة.',
            en: 'In an indented document .text includes the newlines and leading spaces at both ends — so the comparison fails silently. Clean with strip before comparing.',
          },
        },
        {
          wrong: "email_text = tree.find('email').text  # None ثم .strip() يرمي",
          right: "hide = tree.find('email').get('hide')  # yes — السمة هي البيانات",
          note: {
            ar: 'العنصر الذي يغلق ذاتيًا بلا نص: .text عليه None، وأي تابع سلسلي بعده يرمي AttributeError. اقرأ بياناته من السمة بـ get.',
            en: 'A self-closing element has no text: its .text is None, and any string method chained after it throws AttributeError. Read its data from the attribute with get.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المحلل ElementTree يلتهم نص XML ويرجع شجرة عناصر: ET.fromstring(data) — والقواعد الكتابية شغل المكتبة.', en: 'The ElementTree parser swallows XML text and returns a tree of elements: ET.fromstring(data) — syntax rules are the library\u2019s burden.' },
        { ar: 'السؤالان الأساسيان: find(\'tag\').text للنص بين الوسمين، وfind(\'tag\').get(\'attr\') للسمة داخل وسم الافتتاح.', en: 'The two basic questions: find(\'tag\').text for text between tags, find(\'tag\').get(\'attr\') for the attribute inside the opening tag.' },
        { ar: 'رد الخدمة مضمّن نصًّا في سلسلة ثلاثية الاقتباس — وعلى الحاسوب المكتبي يأتي من urlopen بنفس الشكل حرفيًّا.', en: 'The service response is embedded as text in a triple-quoted string — on desktop it arrives from urlopen character-for-character identical.' },
      ],
      reflectPrompt: {
        ar: 'افتح أي موقع تحبه في المتصفح واحفظ صفحته، ثم ابحث فيها عن وسوم — كم موضعًا كان find اليدوي سيخطئ فيها؟ ما الذي يجعل الشجرة أمانًا من هذا الهشاشة؟',
        en: 'Open any site you like in the browser, save its page, and hunt for tags inside it — how many positions would manual find get wrong? What makes the tree a shield against that brittleness?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch13.s2', pages: 'ص214 / pp.214' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch13.s2', pages: 'ص214 / pp.214' },
  ],
} satisfies Lesson;

export default lesson;
