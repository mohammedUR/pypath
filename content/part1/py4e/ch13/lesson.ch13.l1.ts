import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch13.l1 — "eXtensible Markup Language (XML) / لغة التوصيف الموسعة XML"
 * Aligned with PY4E ch13 s1 (لغة التوصيف الموسعة XML).
 * All expression is original.
 * Runnable code stays in ch6 string territory (find + slicing) on an embedded
 * XML line; xml.etree.ElementTree is deliberately saved for lesson 2.
 */
const lesson = {
  id: 'py4e.ch13.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 13,
  title: { ar: 'لغة التوصيف الموسعة XML', en: 'eXtensible Markup Language (XML)' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch12.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'منذ الفصل الثاني عشر وأنت تستدعي صفحات الويب نصًّا خامًا — لكن البرامج لا تتبادل قوائم وقواميس بصفحات HTML. الفصل الثالث عشر يفتح عالم خدمات الويب: صيغتان لتوصيف البيانات المتداولة هما XML وJSON، ثم واجهات برمجة التطبيقات API التي تجعل خدمة بعيدة قابلة للاستدعاء من برنامجك. نبدأ بـ XML: وسوم وأشجار وخصائص — وأداتك الأولى في هذا الدرس ستكون مهارات الفصل السادس نفسها: find والشرائح. بنهاية الدرس ستكون قادرًا على: قراءة سطر XML وتمييز العناصر والسمات، وفهم بنية الشجرة وعقدتها الرئيسة، واستخراج نص وسم وسمة من سطر XML بأدوات السلاسل، وتقدير لماذا نحتاج محللًا متخصصًا في الدرس القادم.',
        en: 'Since chapter 12 you have been fetching web pages as raw text — but programs do not exchange lists and dictionaries through HTML pages. Chapter 13 opens the world of web services: two formats for the data that travels, XML and JSON, then APIs that make a remote service callable from your program. We begin with XML: tags, trees and attributes — and your first tool in this lesson is the very chapter-6 skill set: find and slices. By the end of this lesson you will be able to: read an XML line and tell elements from attributes, understand the tree structure and its root, extract a tag\u2019s text and an attribute from an XML line with string tools, and appreciate why a dedicated parser arrives next lesson.',
      },
    },
    {
      kind: 'predict',
      code: "line = '<person><name>Chuck</name></person>'\nprint(line.find('<name>'))\nprint(line.find('</name>'))",
      question: {
        ar: 'سطر XML هذا — بالنسبة لبايثون — ليس أكثر من سلسلة نصية. أين يقع موضع وسم <name> وأين موضع وسم الإغلاق </name>؟',
        en: 'This XML line — as far as Python is concerned — is nothing but a string. Where does the <name> tag sit, and where does the closing </name> tag sit?',
      },
      reveal: {
        ar: '8 ثم 19. سطر XML سلسلة نصية كاملة الصلاحيات: كل أدوات الفصل السادس تعمل عليه. وسم الافتتاح يبدأ عند 8 بعد <person> ذاتها، ووسم الإغلاق يقع بعد الكلمة Chuck بخمسة أحرف. البعد بين الموضعين هو النص المحاصر بالوسمين — وسنقتنسه بشريحة سلسلة بعد قليل.',
        en: '8 then 19. An XML line is a fully-fledged string: every chapter-6 tool works on it. The opening tag starts at 8, right after <person> itself, and the closing tag sits five characters past the word Chuck. The gap between the two positions is the text trapped between the tags — and we will harvest it with a slice shortly.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'وسوم وعناصر وسمات', en: 'Tags, elements and attributes' },
      chunks: [
        {
          ar: 'تشبه XML لغة HTML لكنها أكثر تنظيمًا. كل زوج من وسم الافتتاح مثل <person> ووسم الإغلاق مثل </person> يمثل عنصرًا — أو عقدة Node — باسم الوسم نفسه: person. قد يحمل العنصر نصًّا داخل الوسمين، وقد يحمل سمات Attributes: أزواج اسم="قيمة" تكتب داخل وسم الافتتاح نفسه مثل type="intl" وhide="yes". والعنصر الذي لا محتوى له يُغلق ذاتيًا بشرطة مائلة قبل القوس مثل <email hide="yes" />.',
          en: 'XML resembles HTML but is stricter. Each pair of an opening tag like <person> and a closing tag like </person> represents an element — a Node — carrying the tag\u2019s own name: person. An element may hold text between the tags, and may hold attributes: name="value" pairs written inside the opening tag itself, like type="intl" and hide="yes". An element with no content closes itself with a slash before the bracket, like <email hide="yes" />.',
        },
        {
          ar: 'مثال الكتاب الحيّ: عنصر person يحوي name بنص Chuck، وphone يحمل سمة type="intl" ورقم هاتف نصيًّا، وemail فارغ يغلق ذاتيًا وسمته hide="yes" هي بياناته الحقيقية. لاحظ التداخل: العناصر الصغير تسكن داخل العنصر الكبير — وهذا ما يوصلنا إلى الشجرة.',
          en: 'The book\u2019s living example: a person element holding name with the text Chuck, a phone carrying the attribute type="intl" and a phone number as text, and an empty self-closing email whose attribute hide="yes" is its real payload. Notice the nesting: small elements live inside the big one — and that is our bridge to the tree.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الشجرة وقابلية التوسيع', en: 'The tree and extensibility' },
      chunks: [
        {
          ar: 'انظر إلى ملف XML على أنه شجرة: في قمتها عنصر رئيس Root — في مثالنا person — وتتفرع منه الأبناء مثل phone وemail كفروع من الجذع الأم. هذا التداخل المنظم هو الفرق الجوهري عن HTML: في XML أنت تخترع أسماء الوسوم بنفسك بحسب بياناتك — person أو book أو student — ومن هنا جاء اسم اللغة "الموسعة": قاموس وسوم مفتوح تصنعه أنت لوصف بياناتك، لا مجموعة مغلقة يفرضها المتصفح.',
          en: 'Look at an XML file as a tree: at its top sits a Root element — person in our example — branching into children like phone and email as limbs of the parent trunk. This tidy nesting is the essential difference from HTML: in XML you invent the tag names yourself according to your data — person, book or student — hence the language\u2019s name, eXtensible: an open vocabulary you craft to describe your data, not a closed set imposed by a browser.',
        },
        {
          ar: 'وفي هذا الفصل سنستخدم XML وJSON لتبادل البيانات مع خدمات الويب: الخدمة ترد بسلسلة نصية موصوفة بهذه الصيغ، وبرنامجك يحللها ويستخرج ما يريد. على حاسوبك المكتبي تصل السلسلة عبر urlopen كما في الفصل الماضي — أما هنا فسنضمّن رد الخدمة في المتغير نفسه لنضمن رد الخدمة نصيًّا ونركّز على التحليل.',
          en: 'Throughout this chapter we will use XML and JSON to exchange data with web services: the service replies with a string described in one of these formats, and your program parses it and extracts what it needs. On your desktop the string arrives via urlopen as last chapter showed — here we embed the service response in a variable itself, guaranteeing the response as text so we can focus on parsing.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'اقتناص النص والسمة من سطر XML', en: 'Harvesting text and attribute from an XML line' },
      code: "line = '<phone type=\"intl\">+1 734 303 4456</phone>'\n\n# السمة بين type=\" و \" التالي / the attribute sits between type=\" and the next \"\np = line.find('type=\"') + 6\nq = line.find('\"', p)\nattr = line[p:q]\n\n# النص بين نهاية وسم الافتتاح وبداية وسم الإغلاق / text between the opening tag and the closing tag\nstart = line.find('>') + 1\nend = line.find('</phone>')\ntext = line[start:end]\n\nprint(text)\nprint(attr)",
      explanation: {
        ar: 'ثلاث مهارات من الفصل السادس تعمل بتناغم: find يعيد موضع السلسلة المطلوبة — فأضفنا 6 لأن type=" بطول ستة أحرف لنقفز إلى ما بعد علامة الاقتباس الافتتاحية، وfind(\'"\', p) يبحث عن علامة الاقتباس المغلقة بدءًا من p. الشريحة line[p:q] تقتطع intl. وفي السطر الثاني: find(\'>\') يقف على قوس وسم الافتتاح الختامي، و+1 يتخطاه، وfind(\'</phone>\') يحدد نهاية النص. النتيجة نص الوسم والسمة وقد انفصلا — وهي عملية سنجعلها أوتوماتيكية بالكامل في الدرس القادم.',
        en: 'Three chapter-6 skills in concert: find returns the position of the wanted string — we add 6 because type=" is six characters long, jumping past the opening quote, and find(\'"\', p) hunts the closing quote starting from p. The slice line[p:q] cuts out intl. On the text side: find(\'>\') lands on the opening tag\u2019s closing bracket, +1 steps past it, and find(\'</phone>\') bounds the text. Result: the tag\u2019s text and its attribute, cleanly separated — a choreography we will make fully automatic next lesson.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.slice-tags',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "السطر المعطى في المحرر: line = '<name>Chuck</name>'. استخرج موضع نهاية وسم الافتتاح في المتغير gt بـ find('>'), وموضع وسم الإغلاق في المتغير end بـ find('</name>'), ثم استخرج اسم الوسم في المتغير tag بشريحة تبدأ من 1 وتنتهي عند gt، والنص في المتغير text بشريحة تبدأ من gt + 1 وتنتهي عند end. اطبع tag ثم اطبع text. المتوقع: name ثم Chuck.",
        en: "The line is given in the editor: line = '<name>Chuck</name>'. Store the opening tag\u2019s bracket position in gt via find('>'), the closing tag\u2019s position in end via find('</name>'), then extract the tag name into tag with a slice from 1 to gt, and the text into text with a slice from gt + 1 to end. Print tag then print text. Expected: name then Chuck.",
      },
      starterCode: "line = '<name>Chuck</name>'\n# find ثم شرائح — مهارات الفصل السادس / find then slices — chapter-6 skills\n",
      solution: "line = '<name>Chuck</name>'\ngt = line.find('>')\nend = line.find('</name>')\ntag = line[1:gt]\ntext = line[gt + 1:end]\nprint(tag)\nprint(text)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الوسم المستخرج name', en: 'The extracted tag is name' },
          code: "assert tag == 'name', 'expected: name | actual: %r' % (tag,)",
          expected: 'name',
        },
        {
          id: 't2',
          name: { ar: 'النص المستخرج Chuck', en: 'The extracted text is Chuck' },
          code: "assert text == 'Chuck', 'expected: Chuck | actual: %r' % (text,)",
          expected: 'Chuck',
        },
        {
          id: 't3',
          name: { ar: 'الطباعتان ظهرتا بالترتيب', en: 'Both prints appeared in order' },
          code: "assert 'name' in __learner_output__ and 'Chuck' in __learner_output__, 'expected: name then Chuck | actual: %r' % __learner_output__",
          expected: 'name then Chuck',
        },
      ],
      hints: [
        { ar: "find('>') يعيد 5 — موضع القوس الختامي لوسم الافتتاح.", en: "find('>') returns 5 — the position of the opening tag\u2019s closing bracket." },
        { ar: 'اسم الوسم يقع بين الحرف الأول وfind(\'>\') — والنص بين find(\'>\') + 1 وfind(\'</name>\').', en: "The tag name sits between the first character and find('>') — the text between find('>') + 1 and find('</name>')." },
        { ar: 'الهيكل:\ngt = line.find(\'>\')\nend = line.find(\'</name>\')\ntag = line[1:gt]\ntext = line[gt + 1:end]\nprint(tag)\nprint(text)', en: "The skeleton:\ngt = line.find('>')\nend = line.find('</name>')\ntag = line[1:gt]\ntext = line[gt + 1:end]\nprint(tag)\nprint(text)" },
        { ar: "gt = line.find('>')\nend = line.find('</name>')\ntag = line[1:gt]\ntext = line[gt + 1:end]\nprint(tag)\nprint(text)", en: "gt = line.find('>')\nend = line.find('</name>')\ntag = line[1:gt]\ntext = line[gt + 1:end]\nprint(tag)\nprint(text)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-locate',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "line = '<person><name>Chuck</name></person>'\ni = line.find('<name>')\nj = line.find('</name>')\nprint(i)\nprint(j)\nprint(line[i + 6:j])",
      solution: '8\n19\nChuck',
      answer: '8\n19\nChuck',
      hints: [
        { ar: 'وسم <person> بطول 8 أحرف — فأين يبدأ <name> مباشرة؟', en: 'The <person> tag is 8 characters long — so where does <name> start right after?' },
        { ar: 'الوسمان + Chuck يحتلون المواضع 8 إلى 18 — فعند أي موضع يقف </name>؟', en: 'The two tags plus Chuck occupy positions 8 through 18 — at what position does </name> stand?' },
        { ar: 'i + 6 يتخطى <name> ذاتها بطولها ستة أحرف — فالشريحة تقتطع ما بينها وبين j.', en: 'i + 6 steps over <name> itself, six characters long — so the slice cuts what lies between it and j.' },
        { ar: 'الخرْج:\n8\n19\nChuck', en: 'The output:\n8\n19\nChuck' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-selfclose',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في مثال الكتاب ظهر <email hide="yes" /> — لماذا الشرطة المائلة قبل القوس الأخير؟',
        en: 'In the book\u2019s example appeared <email hide="yes" /> — why the slash before the last bracket?',
      },
      options: [
        { id: 'a', text: { ar: 'لأنه عنصر فارغ يغلق ذاتيًا — لا نص بينه وبين وسم إغلاق', en: 'It is an empty element closing itself — no text, no separate closing tag' } },
        { id: 'b', text: { ar: 'لأنها تعليق يخفي السطر عن المحلل', en: 'Because it is a comment hiding the line from the parser' } },
        { id: 'c', text: { ar: 'لأن السمات تُكتب دائمًا بعد الشرطة المائلة', en: 'Because attributes must always be written after the slash' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'أين نص هذا العنصر؟ ابحث بين الوسمين… لا يوجد وسم إغلاق أصلًا.', en: 'Where is this element\u2019s text? Look between the tags… there is no closing tag at all.' },
        { ar: 'العنصر ليس فارغ البيانات — سمة hide="yes" هي بياناته — لكنه فارغ المحتوى النصي.', en: 'The element is not empty of data — the attribute hide="yes" is its data — but it is empty of text content.' },
        { ar: 'الشكل <tag /> اختصار مسموح لأي عنصر لا يحمل نصًّا ولا أبناء.', en: 'The <tag /> shape is a legal shorthand for any element holding neither text nor children.' },
        { ar: 'الجواب: أ — عنصر فارغ يغلق ذاتيًا.', en: 'Answer: a — an empty element that closes itself.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-find',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'التابع السلسلي الذي يعيد موضع أول ظهور لسلسلة داخل أخرى — الذي اعتمدنا عليه في اقتناص الوسوم — هو ____',
        en: 'The string method that returns the position of the first occurrence of one string inside another — the one we leaned on to locate tags — is ____',
      },
      answer: 'find',
      solution: 'find',
      hints: [
        { ar: 'من الفصل السادس: بحث عن سلسلة داخل سلسلة.', en: 'From chapter 6: searching for a string inside a string.' },
        { ar: 'يُستدعى على السلسلة: line.____(\'>\')', en: "It is called on the string: line.____('>')" },
        { ar: 'إن لم يجد الهدف يعيد -1 — لهذا نفحصه قبل التقطيع.', en: 'If the target is missing it returns -1 — which is why we check before slicing.' },
        { ar: 'الجواب: find', en: 'Answer: find' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — XML كسلسلة نصية\n# Your playground — XML as a string\n\nline = \'<person><name>Chuck</name><email hide="yes" /></person>\'\n\nprint(line.count("<"))\nprint(line.count("/"))\nprint(line.find("<email"))\nprint(line[line.find("<email"):])\n\n# جرّب: اقتناص Chuck وشريحة الوسم بنفسك / try: harvest Chuck and the tag slice yourself\nstart = line.find("<name>") + 6\nend = line.find("</name>")\nprint(line[start:end])',
      prompt: {
        ar: 'جرّب بنفسك: عدّ الأقواس بـ count، واقتناص Chuck، وطبع ذيل السطر من <email إلى النهاية. ثم أضف وسم <phone> مكانًا ما في السطر وأعد التحليل. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: count the brackets, harvest Chuck, print the tail of the line from <email to the end. Then inject a <phone> tag somewhere in the line and re-analyze. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا يمثل كل زوج من وسم الافتتاح مثل <person> ووسم الإغلاق مثل </person> في XML؟',
            en: 'What does each pair of an opening tag like <person> and a closing tag like </person> represent in XML?',
          },
          options: [
            { id: 'a', text: { ar: 'عنصرًا — أو عقدة — باسم الوسم نفسه', en: 'An element — a node — carrying the tag\u2019s own name' } },
            { id: 'b', text: { ar: 'تعليقًا يتجاهله المحلل', en: 'A comment the parser ignores' } },
            { id: 'c', text: { ar: 'أمرًا تنفيذيًا يشغّل بايثون', en: 'An executable statement that runs Python' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الوسمان يحصران عنصرًا واحدًا باسم person: قد يحمل نصًّا وسمات وعناصر متداخلة — وهي لبنات الشجرة كلها.',
            en: 'The two tags bracket a single element named person: it may hold text, attributes and nested elements — the building blocks of the whole tree.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السادس: في line[line.find(">") + 1:end] — لماذا أضفنا 1؟',
            en: 'From chapter 6: in line[line.find(">") + 1:end] — why did we add 1?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن find يعيد موضع القوس نفسه — والنص يبدأ بعده مباشرة', en: 'Because find returns the bracket\u2019s own position — the text starts right after it' } },
            { id: 'b', text: { ar: 'لأن الشرائح لا تعمل بلا رقم صحيح موجب', en: 'Because slices refuse to work without a positive integer' } },
            { id: 'c', text: { ar: 'لأن find يعيد المواضع مبتدئًا من 1', en: 'Because find returns positions starting from 1' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'find(\'>\') يقف على القوس ذاته فتشمّلته الشريحة لو لم نتخطَّه بـ 1 — قاعدة الشرائح من الفصل السادس: الشريحة تشمل البداية وتستثني النهاية.',
            en: "find('>') stands on the bracket itself, so the slice would swallow it without the +1 — the chapter-6 slice rule: the start is included, the end excluded.",
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أين تُكتب السمات مثل type="intl" وhide="yes"؟',
            en: 'Where are attributes like type="intl" and hide="yes" written?',
          },
          options: [
            { id: 'a', text: { ar: 'داخل وسم الافتتاح نفسه — أزواج اسم="قيمة"', en: 'Inside the opening tag itself — name="value" pairs' } },
            { id: 'b', text: { ar: 'بين وسمي الافتتاح والإغلاق كنص العنصر', en: 'Between the opening and closing tags as the element\u2019s text' } },
            { id: 'c', text: { ar: 'في سطر مستقل قبل العنصر', en: 'On a separate line before the element' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السمات تعيش في وسم الافتتاح، أما النص فيعيش بين الوسمين — وهذان موضعان مختلفان سنعرف كيف نقرأ كلًّ منهما بالحرف في الدرس القادم.',
            en: 'Attributes live inside the opening tag, while text lives between the tags — two different homes, and next lesson we learn to read each by name.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ما الذي يجعل XML "موسعة" على عكس HTML؟',
            en: 'What makes XML "eXtensible" as opposed to HTML?',
          },
          options: [
            { id: 'a', text: { ar: 'أنك تخترع أسماء الوسوم بنفسك بحسب بياناتك — قاموس وسوم مفتوح', en: 'You invent the tag names yourself according to your data — an open vocabulary' } },
            { id: 'b', text: { ar: 'أنها تدعم الصور والفيديو', en: 'Because it supports images and video' } },
            { id: 'c', text: { ar: 'أنها تُكتب بأي لغة برمجة', en: 'Because it can be written in any programming language' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'HTML مجموعة وسوم مغلقة للمتصفح، أما XML فقاموسها مفتوح: person أو book أو anything — وتنظيمها الصارم يجعلها قابلة للتحليل آليًّا مهما اخترعت.',
            en: 'HTML is a closed set for the browser; XML\u2019s vocabulary is open: person, book or anything — and its strict structure keeps it machine-parseable no matter what you invent.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "text = line[line.find('>'):]",
          right: "text = line[line.find('>') + 1:line.find('</name>')]",
          note: {
            ar: 'الشريحة بلا نهاية تطبع كل ما بعد القوس: >Chuck</name> وحتى نهاية السطر. حدّد نهاية النص بوسم الإغلاق، وتخطَّ القوس بـ + 1.',
            en: 'A slice with no end prints everything past the bracket: >Chuck</name> to the end of the line. Bound the text by the closing tag, and step past the bracket with + 1.',
          },
        },
        {
          wrong: "line = '<name>Chuck</name>'\nend = line.find('</Name>')\ntext = line[6:end]",
          right: "line = '<name>Chuck</name>'\nend = line.find('</name>')\ntext = line[6:end]",
          note: {
            ar: 'XML حساسة لحالة الأحرف: </Name> ليست </name> — فيعيد find قيمة -1 فتقتطع شريحتك من الموضع 6 إلى ما قبل النهاية وتخرج نصًّا مشوهًا بصمت. طابق أسماء الوسوم حرفًا بحرف.',
            en: 'XML is case-sensitive: </Name> is not </name> — find returns -1, your slice then runs from position 6 almost to the end and prints garbled text in silence. Match tag names letter by letter.',
          },
        },
        {
          wrong: '# قراءة نص داخل <email hide="yes" /> — عنصر يغلق ذاتيًا',
          right: '# بياناته في السمة hide — لا نص له بين وسومين',
          note: {
            ar: 'العنصر الذي يغلق ذاتيًا مثل <email hide="yes" /> لا يحمل نصًّا بين وسومين — بياناته كلها في السمة. محاولة قراءة "نصه" بحثٌ عن شيء غير موجود.',
            en: 'A self-closing element like <email hide="yes" /> holds no text between two tags — its data lives entirely in the attribute. Hunting for its "text" is searching for something that does not exist.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'XML صيغة نصية منظمة لتبادل البيانات: وسوم تحصر عناصر (عقد)، وسمات داخل وسم الافتتاح، وعناصر فارغة تغلق ذاتيًا.', en: 'XML is a structured text format for data exchange: tags bracket elements (nodes), attributes ride inside the opening tag, and empty elements close themselves.' },
        { ar: 'ملف XML شجرة: عنصر رئيس في القمة يتفرع إلى أبناء — والتداخل هو البنية نفسها.', en: 'An XML file is a tree: a root element at the top branching into children — nesting is the structure itself.' },
        { ar: 'مهارات الفصل السادس تقرأ سطر XML: find يحدد المواضع والشرائح تقتطع — لكن المحلل المتخصص قادم في الدرس القادم ليعتني بالشجرة كاملة.', en: 'Chapter-6 skills read an XML line: find locates, slices extract — but a dedicated parser arrives next lesson to care for the whole tree.' },
      ],
      reflectPrompt: {
        ar: 'لو صممت وسوم XML لبطاقة اتصال: ما العنصر الرئيس وما أبناؤه؟ أي بيانات تجعلها سمات وأيها نصًّا؟ ارسم الشجرة على ورقة قبل الدرس القادم.',
        en: 'If you designed XML tags for a contact card: what is the root element and what are its children? Which data would you make attributes and which text? Sketch the tree on paper before next lesson.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch13.s1', pages: 'ص213 / pp.213' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch13.s1', pages: 'ص213 / pp.213' },
  ],
} satisfies Lesson;

export default lesson;
