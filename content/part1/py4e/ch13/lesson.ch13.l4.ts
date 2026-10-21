import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch13.l4 — "The JSON Format / صيغة JSON"
 * Aligned with PY4E ch13 s4 (JSON) + s5 (تحليل نصوص JSON).
 * All expression is original.
 * The book's person-as-dict and users-list payloads are embedded; nested
 * access info['name'], info['email']['hide'], info['x'][0]; loads/dumps
 * round-trip; XML vs JSON tradeoffs.
 */
const lesson = {
  id: 'py4e.ch13.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 13,
  title: { ar: 'صيغة JSON', en: 'The JSON Format' },
  estimatedMinutes: 17,
  prerequisites: ['py4e.ch13.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'XML فهمكه الشجرة والوسوم — لكن هناك صيغة ثانية غزت الويب: JSON. الكتاب يضعها صراحة: بنية JSON أبسط وقد أصبحت خيار معظم عمليات تبادل البيانات بين التطبيقات. سر الجاذبية؟ قواعدها مطابقة تقريبًا لقواميس وقوائم بايثون التي أتقنتها في الفصلين التاسع والثامن — فبعد json.loads تصبح البيانات قواميسك وقوائمك المألوفة بلا أي تابع بحث جديد. بنهاية الدرس ستكون قادرًا على: تحويل نص JSON إلى قواميس وقوائم بـ loads، والوصول المتداخل بالمفاتيح والأدلة، وإعادة الترميز بـ dumps، والحكم بين XML وJSON.',
        en: 'You own XML — its trees and tags. But a second format has conquered the web: JSON. The book states it plainly: JSON structure is simpler and became the choice for most data exchange between applications. The secret of its pull? Its rules are nearly identical to the Python dictionaries and lists you mastered in chapters 9 and 8 — after json.loads the data is simply your familiar dicts and lists, with no new search method to learn. By the end of this lesson you will be able to: turn JSON text into dicts and lists with loads, reach nested values with keys and indices, re-encode with dumps, and judge between XML and JSON.',
      },
    },
    {
      kind: 'predict',
      code: "import json\ninfo = json.loads('{\"name\": \"Chuck\", \"x\": [10, 20]}')\nprint(info['x'][1])\nprint(type(info))",
      question: {
        ar: 'بعد json.loads — ما قيمة info[\'x\'][1]؟ وأي بنية بايثون صارت info؟',
        en: "After json.loads — what is info['x'][1]? And which Python structure has info become?",
      },
      reveal: {
        ar: '20 ثم <class \'dict\'>. الكائن ذو الأقواس المعقوفة صار قاموسًا، والمصفوفة [10, 20] صارت قائمة، فالوصول المزدوج info[\'x\'][1] هو مفاتيح الفصل التاسع وأدلة الفصل الثامن متتالية في سطر واحد. لا مكتبة بحث ولا وسم ولا شجرة — بياناتك بيتها بيت.',
        en: "20 then <class 'dict'>. The curly-brace object became a dictionary, the [10, 20] array became a list, so the double access info['x'][1] is chapter-9 keys followed by chapter-8 indices in one line. No search library, no tag, no tree — the data is right at home.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'JSON: قواميس وقوائم بثياب نصية', en: 'JSON: dicts and lists in text clothes' },
      chunks: [
        {
          ar: 'JSON — JavaScript Object Notation — استُوحت من كائنات ومصفوفات جافا سكربت، لكن قواعد القواميس والقوائم في بايثون أثّرت عليها. عمليًّا هي خليط من أقواس معقوفة {} للكائنات التي تحاكي قواميسنا، ومربعات [] للمصفوفات التي تحاكي قوائمها، وأزواج "مفتاح": قيمة مفصولة بفواصل. مقارنة الكتاب المباشرة: XML يحتاج وسم person وسم phone وسم email — أما JSON فيضع نفس البيانات أقواسًا ومفاتيح، فيختفي وسم person مستبدلًا بالأقواس الخارجية.',
          en: 'JSON — JavaScript Object Notation — drew inspiration from JavaScript objects and arrays, but Python\u2019s dictionary and list syntax influenced it in turn. Practically it is a mix: curly braces {} for objects that mirror our dicts, square brackets [] for arrays that mirror lists, and "key": value pairs separated by commas. The book\u2019s direct comparison: XML needs a person tag, a phone tag, an email tag — JSON lays the same data out as braces and keys, with the person tag vanishing, replaced by the outer braces.',
        },
        {
          ar: 'وهنا المفاضلة كما رسمها الكتاب: بنية JSON أبسط وإمكانياتها أقل، لكنها ترتبط مباشرة بقواميس وقوائم — وكل لغات البرمجة تقريبًا لها مكافئ لها، فصارت صيغة تبادل البيانات الأولى. المقابل: JSON أقل في التوصيف الذاتي — يجب أن تعلم مسبقًا شكل البيانات، بينما أسماء وسوم XML تشرح نفسها. لهذا تملك معظم معالجات النصوص ملفاتها الداخلية XML.',
          en: 'And here is the tradeoff as the book draws it: JSON structure is simpler with fewer powers, but it maps directly onto dicts and lists — nearly every programming language has an equivalent, so it became the go-to exchange format. The counterweight: JSON is less self-describing — you must know the data\u2019s shape in advance, while XML tag names explain themselves. That is why most word processors keep their internal files in XML.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'loads وdumps والوصول المتداخل', en: 'loads, dumps and nested access' },
      chunks: [
        {
          ar: 'المكتبة المضمّنة json فيها التابعان الأهم: json.loads(data) يحلل نص JSON فيرجع قواميس وقوائم بايثون كاملة، وjson.dumps(obj) يعمل العكس — يعيد ترميز بنية بايثون إلى نص JSON. بعد loads يصبح الوصول هو المألوف: info[\'name\'] لمفتاح أعلى، وinfo[\'email\'][\'hide\'] لقاموس داخل قاموس، وinfo[\'x\'][0] لقائمة داخل قاموس. مثال الكتاب: قائمة مستخدمين، كل مستخدم قاموس — قائمة من القواميس، ونمرر عليها بحلقة as-is من الفصل الثامن.',
          en: "The built-in json library holds the two most important methods: json.loads(data) parses JSON text and returns full Python dicts and lists, and json.dumps(obj) does the reverse — re-encodes a Python structure into JSON text. After loads, access is the familiar kind: info['name'] for a top-level key, info['email']['hide'] for a dict inside a dict, info['x'][0] for a list inside a dict. The book's example: a list of users, each user a dict — a list of dicts, walked with the chapter-8 loop as-is.",
        },
        {
          ar: 'تفصيل لافت يقارنه الكتاب بمثال XML نفسه: كود الاستخراج من JSON أقصر مباشرة — عامل الفهرس [\'name\'] بدل find(\'name\').text — لأن البنية المعادة معروفة لبايثون أصلًا. وخرج البرنامجين متطابق تمامًا: User count: 2 ثم نفس الأسطر. القاعدة العملية: الخدمة ترد JSON؟ استقبل نصًّا، loads، ثم عش في قواميسك وقوائمك.',
          en: "A telling detail the book points out against the very same XML example: the JSON extraction code is shorter and more direct — the index operator ['name'] instead of find('name').text — because the returned structure is already known to Python. And both programs' output is identical: User count: 2 then the same lines. The practical rule: the service replies in JSON? Receive the text, loads it, then live in your dicts and lists.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'شخص الكتاب مرتين: XML ثم JSON', en: 'The book\u2019s person twice: XML then JSON' },
      code: "import json\n\ndata = '''\n{\n  \"name\" : \"Chuck\",\n  \"phone\" : {\n    \"type\" : \"intl\",\n    \"number\" : \"+1 734 303 4456\"\n  },\n  \"email\" : {\n    \"hide\" : \"yes\"\n  },\n  \"x\" : [1, 2, 3]\n}'''\n\ninfo = json.loads(data)\nprint('Name:', info['name'])\nprint('Hide:', info['email']['hide'])\nprint('First:', info['x'][0])\nprint(type(info))",
      explanation: {
        ar: 'نص JSON نفس بيانات شخص XML في الدرس الثاني — لكن التحويل جاء بديلًا: loads بدل fromstring، والمفتاح بدل find، والقاموس الداخلي email يُفتح بمفتاحين متتاليين، وقائمة x تُفهرس بمصفوفة [0] فتعطي 1. أما type فيكشف الهوية: dict — كل بنية الفصل التاسع أصبحت بين يديك. حيث كانت سمة type="intl" سمةً في XML، هنا هي زوج مفاتيح داخل قاموس phone.',
        en: 'The JSON text carries the same data as chapter two\u2019s XML person — but the transformation swaps tools: loads instead of fromstring, keys instead of find, the nested email dict opened by two consecutive keys, and the x list indexed by [0] yielding 1. Meanwhile type reveals the identity: dict — the whole chapter-9 structure in your hands. Where type="intl" was an attribute in XML, here it is a key-value pair inside the phone dict.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.parse-users',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نص JSON مضمّن في المحرر: قائمة مستخدمين كل مستخدم قاموس. حلّله بـ json.loads في المتغير info، ثم اطبع User count: مع len(info)، ثم حلقة for على info تطبع Name مع item[\'name\'] وId مع item[\'id\'] وAttribute مع item[\'x\'] لكل مستخدم. المتوقع مطابق لخرج XML في الدرس الماضي.',
        en: "A JSON text is embedded in the editor: a list of users, each user a dict. Parse it with json.loads into info, print User count: with len(info), then a for loop over info printing Name with item['name'], Id with item['id'], Attribute with item['x'] for each user. Expected: identical to last lesson's XML output.",
      },
      starterCode: "import json\n\ndata = '''\n[\n  { \"id\" : \"001\", \"x\" : \"2\", \"name\" : \"Chuck\" },\n  { \"id\" : \"009\", \"x\" : \"7\", \"name\" : \"Brent\" }\n]'''\n\n# info = json.loads(data) ثم العد والحلقة / info = json.loads(data), then count and loop\n",
      solution: "import json\n\ndata = '''\n[\n  { \"id\" : \"001\", \"x\" : \"2\", \"name\" : \"Chuck\" },\n  { \"id\" : \"009\", \"x\" : \"7\", \"name\" : \"Brent\" }\n]'''\n\ninfo = json.loads(data)\nprint('User count:', len(info))\nfor item in info:\n    print('Name', item['name'])\n    print('Id', item['id'])\n    print('Attribute', item['x'])",
      tests: [
        {
          id: 't1',
          name: { ar: 'info قائمة فيها مستخدمان', en: 'info is a list of two users' },
          code: "assert len(info) == 2 and isinstance(info, list), 'expected: list of 2 | actual: %r' % (info,)",
          expected: 'list of 2',
        },
        {
          id: 't2',
          name: { ar: 'المستخدم الثاني Brent وx تساوي "7"', en: 'The second user is Brent with x equal to "7"' },
          code: "assert info[1]['name'] == 'Brent' and info[1]['x'] == '7', 'expected: Brent with x 7 | actual: %r' % (info[1],)",
          expected: 'Brent with x 7',
        },
        {
          id: 't3',
          name: { ar: 'الخرج مطابق لخرج XML', en: 'The output matches the XML output' },
          code: "assert 'User count: 2' in __learner_output__ and 'Name Chuck' in __learner_output__ and 'Name Brent' in __learner_output__ and 'Attribute 7' in __learner_output__, 'expected: User count: 2 / Name Chuck / Name Brent / Attribute 7 | actual: %r' % __learner_output__",
          expected: 'User count: 2 / Name Chuck / Name Brent / Attribute 7',
        },
      ],
      hints: [
        { ar: 'loads يكفي — القائمة والقواميس تصنع نفسها: info = json.loads(data).', en: 'loads is all it takes — the list and dicts build themselves: info = json.loads(data).' },
        { ar: 'الحلقة على قائمة تعطيك قاموسًا كل دورة: item[\'name\'] وitem[\'id\'] وitem[\'x\'] — مفاتيح لا find.', en: "Looping a list hands you a dict per pass: item['name'], item['id'], item['x'] — keys, no find." },
        { ar: 'الهيكل:\ninfo = json.loads(data)\nprint(\'User count:\', len(info))\nfor item in info:\n    print(\'Name\', item[\'name\'])\n    print(\'Id\', item[\'id\'])\n    print(\'Attribute\', item[\'x\'])', en: "The skeleton:\ninfo = json.loads(data)\nprint('User count:', len(info))\nfor item in info:\n    print('Name', item['name'])\n    print('Id', item['id'])\n    print('Attribute', item['x'])" },
        { ar: "info = json.loads(data)\nprint('User count:', len(info))\nfor item in info:\n    print('Name', item['name'])\n    print('Id', item['id'])\n    print('Attribute', item['x'])", en: "info = json.loads(data)\nprint('User count:', len(info))\nfor item in info:\n    print('Name', item['name'])\n    print('Id', item['id'])\n    print('Attribute', item['x'])" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-nested',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import json\ninfo = json.loads('{\"name\": \"Chuck\", \"x\": [1, 2, 3], \"email\": {\"hide\": \"yes\"}}')\nprint(info['name'])\nprint(info['x'][0] + info['x'][2])\nprint(info['email']['hide'])\nprint(len(info['x']))",
      solution: 'Chuck\n4\nyes\n3',
      answer: 'Chuck\n4\nyes\n3',
      hints: [
        { ar: "المفتاح الأعلى name يعيد سلسلة مباشرة.", en: 'The top-level key name returns a string directly.' },
        { ar: "x قائمة أعداد: info['x'][0] هي 1 وinfo['x'][2] هي 3 — و+ يجمعهما.", en: "x is a list of numbers: info['x'][0] is 1 and info['x'][2] is 3 — and + adds them." },
        { ar: "email قاموس داخل القاموس — مفتاحان متتاليان يفتحانه: ['email']['hide'].", en: "email is a dict inside the dict — two consecutive keys open it: ['email']['hide']." },
        { ar: 'الخرْج:\nChuck\n4\nyes\n3', en: 'The output:\nChuck\n4\nyes\n3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-array-list',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'المصفوفة في JSON تكتب بمربعات: "x": [1, 2, 3] — إلى أي بنية بايثون تتحول بعد json.loads؟',
        en: 'A JSON array is written with square brackets: "x": [1, 2, 3] — into which Python structure does it turn after json.loads?',
      },
      options: [
        { id: 'a', text: { ar: 'قائمة list تُفهرس بـ [0] وتُجمع بـ len', en: 'A list, indexed by [0] and counted by len' } },
        { id: 'b', text: { ar: 'صف tuple لا يقبل التعديل', en: 'An immutable tuple' } },
        { id: 'c', text: { ar: 'سلسلة نصية تحوي الأرقام نصًّا', en: 'A string holding the digits as text' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'فكّر كيف تبدو المصفوفة نفسها في بايثون — المربعات نفسها.', en: 'Think how the same array looks in Python — the same square brackets.' },
        { ar: 'بعد loads تصبح بنية بايثون أصلية — لا سلاسل نصية ولا صفوف.', en: 'After loads it becomes a native Python structure — neither strings nor tuples.' },
        { ar: "info['x'][0] يعمل فهرسة — فما نوع info['x'] الذي يقبل الفهرسة ويطيع len؟", en: "info['x'][0] indexes — so what type is info['x'] that accepts indexing and obeys len?" },
        { ar: 'الجواب: أ — قائمة list تُفهرس بـ [0] وتُحصى بـ len.', en: 'Answer: a — a list, indexed by [0] and counted by len.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-keys',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: في نص التمرين الأول — قائمة مستخدمين — كم مفتاحًا في قاموس المستخدم الأول؟',
        en: 'Without running: in the first exercise\u2019s text — the users list — how many keys does the first user\u2019s dict hold?',
      },
      answer: '3',
      solution: '3',
      tolerance: 0,
      hints: [
        { ar: 'عدّ الأزواج داخل الأقواس المعقوفة الأولى: id و… و…', en: 'Count the pairs inside the first curly braces: id and … and …' },
        { ar: 'لكل مستخدم ثلاثة حقول تُطبع في الحلقة — ما هي؟', en: 'Each user has three fields printed in the loop — which are they?' },
        { ar: 'id وx وname — ثلاثة مفاتيح في القاموس.', en: 'id, x and name — three keys in the dict.' },
        { ar: 'الجواب: 3', en: 'Answer: 3' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — التحويل في الاتجاهين\n# Your playground — the round trip\n\nimport json\n\ntext = \'{"name": "Chuck", "x": [1, 2, 3]}\'\ninfo = json.loads(text)\nprint(type(info), info["x"][1])\n\ninfo["x"].append(4)\nprint(json.dumps(info))\nprint(json.dumps(info, indent=2))\n\n# جرّب: أضف مفتاح "email": {"hide": "yes"} لـ info ثم اطبع dumps مجددًا / try: add an "email": {"hide": "yes"} key and dumps again',
      prompt: {
        ar: 'جرّب بنفسك: loads ثم ألحق 4 بقائمة x فتتغير البنية في الذاكرة، ثم dumps يرجعها نصًّا — قارن النص الأصلي بالمعاد. جرّب indent=2 لتنسيق مقروء. ثم أضف مفتاح email بقاموس داخلي واسأل عنه بمفتاحين. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: loads, then append 4 to the x list changing the in-memory structure, then dumps turns it back to text — compare the original with the return trip. Try indent=2 for readable formatting. Then add an email key holding an inner dict and reach it with two keys. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما وظيفة json.loads وjson.dumps معًا؟',
            en: 'What do json.loads and json.dumps do together?',
          },
          options: [
            { id: 'a', text: { ar: 'loads يحلل نص JSON إلى بنية بايثون، وdumps يعيد ترميز بنية بايثون إلى نص JSON', en: 'loads parses JSON text into a Python structure, dumps re-encodes a Python structure into JSON text' } },
            { id: 'b', text: { ar: 'كلاهما يحلل النص — أحدهما أسرع', en: 'Both parse text — one is just faster' } },
            { id: 'c', text: { ar: 'loads للملفات وdumps للشبكة', en: 'loads is for files, dumps is for the network' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'اتجاهان لجسر واحد: النص يدخل بـ loads فيخرج قواميس وقوائم، والبنية تدخل dumps فتخرج نصًّا قابلًا للإرسال — والاسمان يذكّران: loads من "تحميل إلى بايثون" وdumps من "إفراغ إلى نص".',
            en: 'Two directions of one bridge: text enters via loads and emerges as dicts and lists; a structure enters dumps and emerges as sendable text — the names hint at it: loads into Python, dumps out to text.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل التاسع: بعد info = json.loads(data) — كيف تقرأ وتكتب المفاتيح؟',
            en: 'From chapter 9: after info = json.loads(data) — how do you read and write keys?',
          },
          options: [
            { id: 'a', text: { ar: "بعامل الفهرس المألوف: info['name'] للقراءة وinfo['name'] = قيمة للكتابة — قاموس كامل الصلاحيات", en: "With the familiar index operator: info['name'] to read, info['name'] = value to write — a dict with full privileges" } },
            { id: 'b', text: { ar: 'بمكتبة خاصة للقراءة لأن JSON قراءة فقط', en: 'With a special library, because JSON is read-only' } },
            { id: 'c', text: { ar: 'بالحلقات فقط — المفاتيح لا تُقرأ مباشرة', en: 'Only via loops — keys cannot be read directly' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا سر قوة JSON في بايثون: النتيجة قاموس أصلي — كل ما تعلمته في الفصل التاسع من get وin وitems يعمل عليه بلا أي ترجمة.',
            en: 'This is the secret of JSON\u2019s power in Python: the result is a native dict — everything chapter 9 taught, get, in, items, works on it with zero translation.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا اتجهت خدمات الويب إلى JSON أكثر من XML؟',
            en: 'Why have web services leaned toward JSON over XML?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه أبسط ويعبر عن بنى البيانات الأساسية في اللغات مباشرة — وتحليله واستخراجه أسهل وأمض', en: 'It is simpler and expresses the basic data structures of languages directly — parsing and extraction are easier and more direct' } },
            { id: 'b', text: { ar: 'لأن XML ممنوع قانونًا في الويب', en: 'Because XML is legally banned on the web' } },
            { id: 'c', text: { ar: 'لأن JSON أصغر حجمًا دائمًا بأي شكل من الأشكال', en: 'Because JSON is always smaller by any measure' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كتاب الكتاب: JSON أبسط ويعبر عن بنى البيانات الأساسية بشكل أكبر وتحليله مباشر أكثر — ويبقى لXML أفضلية التوصيف الذاتي في بعض التطبيقات كمعالجات النصوص.',
            en: 'The book\u2019s verdict: JSON is simpler, expresses basic data structures more directly, and parses with less ceremony — while XML keeps the self-describing edge in some applications like word processors.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثامن: info قائمة من قواميس بعد التحليل — ماذا يفعل len(info) ولماذا تحتاجه قبل الحلقة؟',
            en: 'From chapter 8: info is a list of dicts after parsing — what does len(info) do and why print it before the loop?',
          },
          options: [
            { id: 'a', text: { ar: 'يعيد عدد العناصر — موجز سريع يطمئنك أن التحليل أعاد البيانات المتوقعة قبل السؤال التفصيلي', en: 'It returns the element count — a quick summary reassuring you the parse returned the expected data before asking detailed questions' } },
            { id: 'b', text: { ar: 'يعيد عدد المفاتيح في أول قاموس', en: 'It returns the key count of the first dict' } },
            { id: 'c', text: { ar: 'لا شيء — len على قائمة ترمي دائمًا', en: 'Nothing — len on a list always throws' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'User count: 2 في الكتاب موجز المنطق نفسه الذي تدرّبنا عليه: اطبع حجم ما وصل قبل الغوص فيه — عادة ستحتاجها غدًا مع ردود الخدمات الحقيقية.',
            en: 'User count: 2 in the book is the same logical summary we practiced: print the size of what arrived before diving in — a habit you will want tomorrow with real service responses.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "print(item.name)  # صيغة الكائنات",
          right: "print(item['name'])",
          note: {
            ar: 'ما بعد loads قواميس بايثون لا كائنات JSON من لغات أخرى — الوصول بعامل المفاتيح [\'name\'] لا بالنقطة، وإلا TypeError.',
            en: "After loads you hold Python dicts, not objects from other languages — access by the key operator ['name'], not the dot, or you meet a TypeError.",
          },
        },
        {
          wrong: "info = json.load('{\"a\": 1}')  # load لا loads",
          right: "info = json.loads('{\"a\": 1}')",
          note: {
            ar: 'loads بحرف s الأخير تعني "من سلسلة" — أما load (بلا s) فتنتظر ملفًا مفتوحًا وترمي خطأ إن أُعطيت نصًّا. س تعني string.',
            en: 'loads with the final s means "from a string" — while load (no s) expects an open file and throws if handed text. The s stands for string.',
          },
        },
        {
          wrong: "info = json.loads(\"{'x': 2}\")  # اقتباس مفرد",
          right: "info = json.loads('{\"x\": 2}')",
          note: {
            ar: 'JSON أصرم من بايثون: المفاتيح والنصوص بعلامات اقتباس مزدوجة حصرًا — النص المقتبس بعلامات مفردة يرمي JSONDecodeError رغم أنه قاموس بايثون صالح.',
            en: 'JSON is stricter than Python: keys and strings use double quotes exclusively — a single-quoted text throws JSONDecodeError even though it is a valid Python dict.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'JSON صيغة تبادل البيانات الأولى على الويب: أقواس معقوفة تشبه قواميسنا ومربعات تشبه قوائمها.', en: 'JSON is the web\u2019s leading data format: curly braces like our dicts, square brackets like our lists.' },
        { ar: 'json.loads يحول النص إلى بنية بايثون وjson.dumps يعيده نصًّا — والوصول المتداخل مفاتيح وأدلة من الفصلين التاسع والثامن.', en: 'json.loads turns text into Python structures and json.dumps turns them back into text — nested access is chapter-9 keys and chapter-8 indices.' },
        { ar: 'المفاضلة: JSON أبسط وأمض في التحليل لكن أقل توصيفًا ذاتيًّا — XML يشرح نفسه بأسماء وسومه فما زال في معالجات النصوص.', en: 'The tradeoff: JSON is simpler and quicker to parse but less self-describing — XML explains itself with tag names and stays inside word processors.' },
      ],
      reflectPrompt: {
        ar: 'أعد كتابة مثال شخص XML من الدرس الثاني كنص JSON من ذاكرتك — ثم شغّل loads عليه وتحقق من info[\'name\']. أي الصيغتين كتبت أسرع ولماذا؟',
        en: 'Rewrite chapter two\u2019s XML person example as JSON text from memory — then run loads on it and check info[\'name\']. Which format did you write faster, and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch13.s4', pages: 'ص217 / pp.217' },
        { book: 'PY4E', section: 'py4e.ch13.s5', pages: 'ص218 / pp.218' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch13.s4', pages: 'ص217 / pp.217' },
    { book: 'PY4E', section: 'py4e.ch13.s5', pages: 'ص218 / pp.218' },
  ],
} satisfies Lesson;

export default lesson;
