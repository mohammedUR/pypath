import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch13.l6 — "Chapter 13 Review and Project: Geo Service Reader /
 * مراجعة الفصل 13 ومشروع: قارئ الخدمة الجغرافية"
 * Aligned with PY4E ch13 s8 (فهرس المصطلحات) + s9 (التطبيق الأول: خدمة جوغل
 * للجغرافيا) + s10 (التطبيق الثاني: تويتر) — s10 taught in the summary chunk
 * (OAuth/hidden.py framing) and cited in sources.
 * All expression is original.
 * Project: a self-contained geo-service reader — a Google-geocode-LIKE payload
 * {status, results:[{lat, lng, place_id}]} embedded as text, loads, status
 * guard, None flag, then %-formatted output. The debug block breaks the letter
 * case of the status comparison: silent wrong value, no crash.
 */
const lesson = {
  id: 'py4e.ch13.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 13,
  title: { ar: 'مراجعة الفصل 13 ومشروع: قارئ الخدمة الجغرافية', en: 'Chapter 13 Review and Project: Geo Service Reader' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch13.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'يُغلق الفصل الثالث عشر على أهم مهارة في البرمجة الحديثة: أن يطلب برنامجك من برنامج آخر بيانات فيقرأها ويتصرف بها. مررنا بخمس محطات: وسوم XML وشجرتها، محلل ElementTree، حلقات findall على العقد، صيغة JSON وقواميسها المباشرة، ثم واجهات API وحارس الحالة. اليوم مراجعة شاملة وفهرس المصطلحات ومشروع الختام: قارئ خدمة جوغل للجغرافيا — يأخذ ردًّا نصيًّا يحمل إحداثيات مكان، يفحص حالته بعين الحارس، ويطبع lat وlng وplace id بتنسيق مهني. بنهاية الدرس ستكون قادرًا على: استرجاع مصطلحات الفصل كاملة، وقراءة رد خدمة حقيقية الشكل من أولها إلى آخرها، وتنقيح خلل صامت في حارس الحالة.',
        en: 'Chapter 13 closes on the most modern of skills: your program asking another program for data and acting on the answer. We passed five stations: XML tags and their tree, the ElementTree parser, findall loops over nodes, the JSON format and its direct dictionaries, then APIs and the status guard. Today is a full review plus the glossary and the closing project: a Google-geocoding service reader — it takes a textual response carrying a place\u2019s coordinates, checks its health with the guard\u2019s eye, and prints lat, lng and place id in professional format. By the end of this lesson you will be able to: retrieve the chapter\u2019s full glossary, read a real-shaped service response end to end, and debug a silent flaw in the status guard.',
      },
    },
    {
      kind: 'predict',
      code: "import json\npayload = '{\"status\": \"OK\", \"results\": [{\"lat\": 42.28, \"lng\": -83.74}]}'\njs = json.loads(payload)\nfirst = js['results'][0]\nprint(first['lat'], first['lng'])",
      question: {
        ar: 'رد خدمة مصغّر: حالة ثم قائمة نتائج. ماذا يطبع السطر الأخير بعد سحب النتيجة الأولى؟',
        en: 'A miniature service response: a status then a results list. What does the last line print after pulling the first result?',
      },
      reveal: {
        ar: '42.28 -83.74. ثلاث طبقات فتحناها: js قاموس، وjs[\'results\'] قائمة، و[0] أول قاموس فيها — ثم مفاتيحه lat وlng. هذه هي التركيبة التي بناها المشروع اليوم كاملًا: حارس ثم سحب ثم طباعة.',
        en: '42.28 -83.74. Three layers opened: js a dict, js[\'results\'] a list, and [0] its first dict — then its keys lat and lng. This is the exact composition today\u2019s project builds in full: guard, then extraction, then printing.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل ومصطلحاته', en: 'The chapter map and its glossary' },
      chunks: [
        {
          ar: 'خريطة الفصل بخمسة مسارات: الأول وسوم XML وعناصرها وسماتها وشجرتها ذات الجذر والأبناء. الثاني محلل ElementTree: fromstring يحول النص إلى شجرة، وfind يعيد عقدة، و.text نصها و.get سعتها. الثالث findall يعيد قائمة أشجار ويطالب المسار بذكر كل الأجداد — users/user لا user. الرابع JSON: loads يحول النص إلى قواميس وقوائم وdumps يعيده، والوصول بمفاتيح وأدلة مباشرة. الخامس واجهات API: اتفاقيات بين تطبيقات عبر HTTP مع معاملات ورد ببنية معروفة — والحارس يفحص status قبل أي قراءة.',
          en: 'The chapter\u2019s map has five routes: first, XML tags, elements, attributes and the root-and-children tree. Second, the ElementTree parser: fromstring turns text into a tree, find returns a node, .text its text and .get its payload. Third, findall returns a list of trees and demands the path name every ancestor — users/user, not user. Fourth, JSON: loads turns text into dicts and lists and dumps turns them back, with direct keys and indices. Fifth, APIs: agreements between applications over HTTP with parameters and a known response shape — and the guard checks status before any read.',
        },
        {
          ar: 'فهرس المصطلحات — كما جمعه الكتاب: لغة التوصيف الموسعة XML صيغة تسمح بترميز بيانات مهيكلة، ومكتبة ElementTree المضمنة في بايثون لتحليل نصوص XML، وJSON صيغة ترميز البيانات المهيكلة اعتمادًا على قواعد كائنات جافا سكربت، والتحليل parse هو فك النص إلى بنية يمكن البرنامج من قراءتها. احتفظ بهذه الأربعة كعقود للفصل — وبقية المصطلحات تتبع في الوحدة التالية.',
          en: 'The glossary — as the book assembles it: eXtensible Markup Language (XML) is a format for encoding structured data; ElementTree is the library built into Python for parsing XML; JSON is a structured-data encoding following JavaScript object syntax; and parsing is cracking the text into a structure the program can read. Keep these four as the chapter\u2019s anchors — the remaining terms follow in the next unit.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'من المفتاح إلى الخدمة — ومن جوغل إلى تويتر', en: 'From key to service — and from Google to Twitter' },
      chunks: [
        {
          ar: 'واجهة برمجة التطبيقات API اتفاقية بين التطبيقات تحدد أنماط التفاعل بين مكونات تطبيقين — والبنية الخدمية التوجه SOA بناء تطبيق من مكونات متصلة عبر شبكة: برنامجك يستدعي خدمة أخرى بدل أن يحويها. مفتاح API سرّ يعرّفك للخدمة وبه تُحسب حدود الاستخدام rate limits: عدد الطلبات المسموح في مدة زمنية. ولذلك لا يُكتب المفتاح في كود منشور — الكتاب وضعه في ملف مستقل hidden.py.',
          en: 'An API is an agreement between applications defining the interaction patterns between two programs\u2019 components — and Service-Oriented Architecture (SOA) is building an application from components connected over a network: your program calls another\u2019s service instead of containing it. An API key is a secret identifying you to the service, against which rate limits are counted: the allowed requests per time window. That is why a key never lands in published code — the book kept it in a separate hidden.py file.',
        },
        {
          ar: 'التطبيق الأول في الكتاب خدمة جوغل للترميز الجغرافي: ترسل عنوانًا نصيًّا فيرد أفضل تخمين لمكانه على الخريطة بإحداثيات ومعرّف مكان place_id — خدمة مجانية محدودة الاستخدام. أما التطبيق الثاني فتويتر: انتقل إلى طلبات موقعة ببروتوكول OAuth عبر أربع سلاسل سرية في hidden.py — فكرة الأمان نفسها بمستوى أعلى. مشروعنا اليوم يجسّد الأول بمضمّن نصي لرد الخدمة: نضمن رد الخدمة نصيًّا فنركّز على القراءة والحارس.',
          en: 'The book\u2019s first application is Google\u2019s geocoding service: you send a text address and it replies with its best guess of the place on the map, with coordinates and a place_id — a free but usage-capped service. The second application is Twitter: it moved to requests signed with the OAuth protocol via four secret strings in hidden.py — the same security idea at a higher tier. Today\u2019s project embodies the first with an embedded textual service response: we guarantee the response as text so we can focus on reading and guarding.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'قارئ مصغّر لخدمة جوغل للجغرافيا', en: 'A miniature Google geocoding reader' },
      code: "import json\n\npayload = '''\n{\n  \"status\": \"OK\",\n  \"results\": [\n    { \"formatted_address\": \"Ann Arbor, MI, USA\", \"lat\": 42.2808, \"lng\": -83.7430 },\n    { \"formatted_address\": \"Ypsilanti, MI, USA\", \"lat\": 42.2412, \"lng\": -83.6142 }\n  ]\n}'''\n\njs = json.loads(payload)\n\nif js['status'] != 'OK':\n    js = None\n\nif js is None:\n    print('status: error')\nelse:\n    print('results:', len(js['results']))\n    first = js['results'][0]\n    print('lat: %s' % first['lat'])\n    print('lng: %s' % first['lng'])",
      explanation: {
        ar: 'هذا برنامج geojson.py من الكتاب في هيئته الجوهرية: الحارس يقارن status مع OK — وهذه هي إملاء هذه الخدمة بالأحرف الكبيرة، فكل خدمة تتهجى حالتها بطريقتها. عند الفشل يصير js نفسه None فلا يُلمس results أصلًا. عند النجاح: results: 2 موجز الحجم من الفصل الثامن، ثم النتيجة الأولى تُفتح بمفاتيحها فيُطبع lat: 42.2808 وlng: -83.743 — ولاحظ أن -83.7430 طُبعت -83.743 لأن العدد العشري لا يحفظ الصفر الاصطلاحي. المشروع اليوم يضيف place id على النمط نفسه.',
        en: 'This is the book\u2019s geojson.py in its essential shape: the guard compares status with OK — this service\u2019s own spelling, in capitals; every service spells its statuses its own way. On failure js itself becomes None so results is never touched. On success: results: 2, the chapter-8 size summary, then the first result opens by its keys printing lat: 42.2808 and lng: -83.743 — note -83.7430 printed as -83.743 because a decimal number keeps no ceremonial zero. Today\u2019s project adds place id on the same pattern.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-review',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import json\njs = json.loads('{\"status\": \"OK\", \"results\": [{\"lat\": 42.28}, {\"lat\": 48.11}]}')\nresults = js['results']\nprint(js['status'])\nprint(len(results))\nprint(results[1]['lat'])",
      solution: 'OK\n2\n48.11',
      answer: 'OK\n2\n48.11',
      hints: [
        { ar: 'status مفتاح أعلى — قيمته نص "OK" كما كتبتها الخدمة.', en: 'status is a top-level key — its value is the text "OK" exactly as the service wrote it.' },
        { ar: 'results قائمة قواميس — وlen يعيد طولها.', en: 'results is a list of dicts — len returns its length.' },
        { ar: 'results[1] هو القاموس الثاني — لا الأول.', en: 'results[1] is the second dict — not the first.' },
        { ar: 'الخرْج:\nOK\n2\n48.11', en: 'The output:\nOK\n2\n48.11' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.geo-reader',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: قارئ الخدمة الجغرافية. الرد مضمّن في المحرر. 1) حلّله بـ json.loads في js. 2) ابنِ الحارس: متغير place يبدأ None — فإن كانت js[\'status\'] تساوي \'OK\' اجعل place يساوي js[\'results\'][0]. 3) إن كان place هو None اطبع status: error، وإلا اطبع أربعة أسطر: status: OK ثم lat: %s مع place[\'lat\'] ثم lng: %s مع place[\'lng\'] ثم place id: %s مع place[\'place_id\']. المتوقع: status: OK ثم lat: 42.2808 ثم lng: -83.743 ثم place id: ChIJMx9D1A2wPIgR4rXIhkb5Cds.',
        en: "The project: the Geo Service Reader. The response is embedded in the editor. 1) Parse it with json.loads into js. 2) Build the guard: a variable place starting at None — if js['status'] equals 'OK' set place to js['results'][0]. 3) If place is None print status: error, else print four lines: status: OK, then lat: %s with place['lat'], then lng: %s with place['lng'], then place id: %s with place['place_id']. Expected: status: OK, then lat: 42.2808, then lng: -83.743, then place id: ChIJMx9D1A2wPIgR4rXIhkb5Cds.",
      },
      starterCode: "import json\n\npayload = '''\n{\n  \"status\": \"OK\",\n  \"results\": [\n    {\n      \"formatted_address\": \"Ann Arbor, MI, USA\",\n      \"lat\": 42.2808,\n      \"lng\": -83.7430,\n      \"place_id\": \"ChIJMx9D1A2wPIgR4rXIhkb5Cds\"\n    }\n  ]\n}'''\n\n# 1) js = json.loads(payload)\n# 2) الحارس: place = None ثم افحص js['status'] == 'OK'\n# 3) اطبع status وlat وlng وplace id بصيغة %s\n",
      solution: "import json\n\npayload = '''\n{\n  \"status\": \"OK\",\n  \"results\": [\n    {\n      \"formatted_address\": \"Ann Arbor, MI, USA\",\n      \"lat\": 42.2808,\n      \"lng\": -83.7430,\n      \"place_id\": \"ChIJMx9D1A2wPIgR4rXIhkb5Cds\"\n    }\n  ]\n}'''\n\njs = json.loads(payload)\n\nplace = None\nif js['status'] == 'OK':\n    place = js['results'][0]\n\nif place is None:\n    print('status: error')\nelse:\n    print('status: OK')\n    print('lat: %s' % place['lat'])\n    print('lng: %s' % place['lng'])\n    print('place id: %s' % place['place_id'])",
      tests: [
        {
          id: 't1',
          name: { ar: 'الحالة OK كما تتهجى الخدمة', en: 'The status is OK as the service spells it' },
          code: "assert js['status'] == 'OK', 'expected: OK | actual: %r' % (js['status'],)",
          expected: 'OK',
        },
        {
          id: 't2',
          name: { ar: 'place تحمل الإحداثيات الصحيحة', en: 'place holds the right coordinates' },
          code: "assert place is not None and place['lat'] == 42.2808 and place['lng'] == -83.743, 'expected: lat 42.2808 lng -83.743 | actual: %r' % (place,)",
          expected: 'lat 42.2808 lng -83.743',
        },
        {
          id: 't3',
          name: { ar: 'معرّف المكان كاملًا', en: 'The place id in full' },
          code: "assert place['place_id'] == 'ChIJMx9D1A2wPIgR4rXIhkb5Cds', 'expected: ChIJMx9D1A2wPIgR4rXIhkb5Cds | actual: %r' % (place['place_id'],)",
          expected: 'ChIJMx9D1A2wPIgR4rXIhkb5Cds',
        },
        {
          id: 't4',
          name: { ar: 'الحالة والإحداثيات مطبوعة بصيغة الخدمة', en: 'Status and coordinates printed in service format' },
          code: "assert 'status: OK' in __learner_output__ and 'lat: 42.2808' in __learner_output__ and 'lng: -83.743' in __learner_output__, 'expected: status: OK / lat: 42.2808 / lng: -83.743 | actual: %r' % __learner_output__",
          expected: 'status: OK / lat: 42.2808 / lng: -83.743',
        },
        {
          id: 't5',
          name: { ar: 'معرّف المكان مطبوع ببادئته', en: 'The place id printed with its label' },
          code: "assert 'place id: ChIJ' in __learner_output__, 'expected: place id: ChIJ... | actual: %r' % __learner_output__",
          expected: 'place id: ChIJ...',
        },
      ],
      hints: [
        { ar: 'الحارس قبل أي قراءة عميقة: place = None ثم if js[\'status\'] == \'OK\': place = js[\'results\'][0].', en: "The guard before any deep read: place = None then if js['status'] == 'OK': place = js['results'][0]." },
        { ar: 'الفرعان بعد الحارس: place is None يطبع status: error — وإلا أربعة أسطر بتنسيق %s.', en: 'Two branches after the guard: place is None prints status: error — else four %s-formatted lines.' },
        { ar: 'الهيكل:\njs = json.loads(payload)\nplace = None\nif js[\'status\'] == \'OK\':\n    place = js[\'results\'][0]\nif place is None:\n    print(\'status: error\')\nelse:\n    print(\'status: OK\')\n    print(\'lat: %s\' % place[\'lat\'])\n    print(\'lng: %s\' % place[\'lng\'])\n    print(\'place id: %s\' % place[\'place_id\'])', en: "The skeleton:\njs = json.loads(payload)\nplace = None\nif js['status'] == 'OK':\n    place = js['results'][0]\nif place is None:\n    print('status: error')\nelse:\n    print('status: OK')\n    print('lat: %s' % place['lat'])\n    print('lng: %s' % place['lng'])\n    print('place id: %s' % place['place_id'])" },
        { ar: "js = json.loads(payload)\nplace = None\nif js['status'] == 'OK':\n    place = js['results'][0]\nif place is None:\n    print('status: error')\nelse:\n    print('status: OK')\n    print('lat: %s' % place['lat'])\n    print('lng: %s' % place['lng'])\n    print('place id: %s' % place['place_id'])", en: "js = json.loads(payload)\nplace = None\nif js['status'] == 'OK':\n    place = js['results'][0]\nif place is None:\n    print('status: error')\nelse:\n    print('status: OK')\n    print('lat: %s' % place['lat'])\n    print('lng: %s' % place['lng'])\n    print('place id: %s' % place['place_id'])" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-none-flag',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في مشروع اليوم: لماذا بدأنا place بقيمة None قبل فحص الحالة؟',
        en: 'In today\u2019s project: why did we start place at None before checking the status?',
      },
      options: [
        { id: 'a', text: { ar: 'ليكون للفشل حالة معرفة: يبقى None فيُلتقطه فرع الأمان ويُطبع status: error بدل انهيار البرنامج', en: 'So failure has a defined state: it stays None, gets caught by the safety branch printing status: error instead of crashing' } },
        { id: 'b', text: { ar: 'لأن None يجعل التحليل أسرع', en: 'Because None makes parsing faster' } },
        { id: 'c', text: { ar: 'لأن بايثون تفرض تهيئة كل المتغيرات بـ None أولًا', en: 'Because Python requires initializing every variable to None first' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'ماذا يحدث لو فشل الفحص ولا يوجد متغير معرّف مسبقًا؟', en: 'What happens if the check fails and no variable was defined in advance?' },
        { ar: 'العلم يرفع عند الفشل — وفروع البرنامج تلتقطه بسؤال is None.', en: 'The flag is raised on failure — and the program\u2019s branches catch it with an is None question.' },
        { ar: 'بدل exit الذي يقطع كل شيء — العلم يبقي البرنامج حيًّا وقرار الطباعة بيدك.', en: 'Instead of exit cutting everything off — the flag keeps the program alive and printing in your hands.' },
        { ar: 'الجواب: أ — حالة معرفة للفشل يلتقطها فرع الأمان.', en: 'Answer: a — a defined state for failure, caught by the safety branch.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-lng',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل: بعد js = json.loads('{\"lng\": -83.7430}') — ما القيمة العددية المخزنة في js['lng']؟ (اكتبها بالشكل الذي تطبع به بايثون العدد)",
        en: "Without running: after js = json.loads('{\"lng\": -83.7430}') — what numeric value does js['lng'] hold? (Write it the way Python prints the number)",
      },
      answer: '-83.743',
      solution: '-83.743',
      tolerance: 0,
      hints: [
        { ar: 'الأعداد في JSON تصبح أعدادًا عشرية حقيقية في بايثون — لا سلاسل نصية.', en: 'Numbers in JSON become real decimal numbers in Python — not text strings.' },
        { ar: 'العدد العشري لا يحفظ صفرًا اصطلاحيًّا في آخره — مثلما 4.50 عدد 4.5.', en: 'A decimal keeps no ceremonial trailing zero — just as 4.50 is the number 4.5.' },
        { ar: 'طباعة العدد تعطي أقصر شكل يقرؤه بايثون كالعدد نفسه.', en: 'Printing the number gives the shortest form Python reads back as the same number.' },
        { ar: 'الجواب: -83.743', en: 'Answer: -83.743' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-guard-case',
      required: true,
      brokenCode: "import json\n\npayload_ok = '{\"status\": \"OK\", \"results\": [{\"lat\": 42.2808, \"lng\": -83.743, \"place_id\": \"ChIJMx9D1A2wPIgR4rXIhkb5Cds\"}]}'\npayload_bad = '{\"status\": \"error\", \"results\": []}'\n\nfor payload in [payload_ok, payload_bad]:\n    js = json.loads(payload)\n    place = None\n    if js['status'] == 'ok':  # فحصنا الحالة قبل القراءة / we checked the status before reading\n        place = js['results'][0]\n    if place is None:\n        print('status: error')\n    else:\n        print('lat: %s' % place['lat'])",
      prompt: {
        ar: 'الحارس موجود والقائمة والفرعان كلها سليمة — ومع ذلك يطبع البرنامج status: error لرد سليم تمامًا! شغّل الكود المعطوب ولاحظ: الرد الأول بنتائجه يُرفض وهو صحيح. تلميح: خدمة جوغل في برنامج الكتاب geojson.py تتهجى حالتها OK بأحرف كبيرة. اكتشف الخلل الصامت وأصلح المقارنة ليُقرأ الرد السليم: lat: 42.2808 — بينما يظل الرد الفاسد يُرفض برسالة status: error واحدة.',
        en: 'The guard is there, the list and both branches are intact — yet the program prints status: error for a perfectly healthy response! Run the broken code and notice: the first reply with its results is rejected though it is fine. Hint: the Google service in the book\u2019s geojson.py spells its status OK in capitals. Find the silent flaw and fix the comparison so the healthy reply reads lat: 42.2808 — while the bad reply is still rejected with a single status: error message.',
      },
      solution: "import json\n\npayload_ok = '{\"status\": \"OK\", \"results\": [{\"lat\": 42.2808, \"lng\": -83.743, \"place_id\": \"ChIJMx9D1A2wPIgR4rXIhkb5Cds\"}]}'\npayload_bad = '{\"status\": \"error\", \"results\": []}'\n\nfor payload in [payload_ok, payload_bad]:\n    js = json.loads(payload)\n    place = None\n    if js['status'] == 'OK':  # حالة الأحرف كما تتهجى الخدمة / letter case as the service spells it\n        place = js['results'][0]\n    if place is None:\n        print('status: error')\n    else:\n        print('lat: %s' % place['lat'])",
      tests: [
        {
          id: 't1',
          name: { ar: 'الرد السليم قرأ إحداثياته', en: 'The healthy reply had its coordinates read' },
          code: "assert 'lat: 42.2808' in __learner_output__, 'expected: lat: 42.2808 | actual: %r' % __learner_output__",
          expected: 'lat: 42.2808',
        },
        {
          id: 't2',
          name: { ar: 'رسالة الخطأ مرة واحدة للرد الفاسد فقط', en: 'The error message appears once, for the bad reply only' },
          code: "assert __learner_output__.count('status: error') == 1, 'expected: exactly one status: error | actual: %r' % __learner_output__",
          expected: 'exactly one status: error',
        },
        {
          id: 't3',
          name: { ar: 'لا إحداثيات ملفقة من الرد الفاسد', en: 'No fabricated coordinates from the bad reply' },
          code: "assert __learner_output__.count('lat:') == 1, 'expected: exactly one lat line | actual: %r' % __learner_output__",
          expected: 'exactly one lat line',
        },
      ],
      hints: [
        { ar: 'لا استثناء ولا انهيار — الخلل صامت: الفرعان يعملان لكن الحارس يرفض الرد الصحيح.', en: 'No exception, no crash — the flaw is silent: both branches run, but the guard rejects the healthy reply.' },
        { ar: 'قارن سطر الحارس مع قيمة الحالة في payload_ok حرفًا بحرف — الأحرف الكبيرة مصير هنا.', en: 'Compare the guard line with the status value in payload_ok letter by letter — capital letters decide here.' },
        { ar: 'الإصلاح سطر واحد: js[\'status\'] == \'OK\' — إملاء الخدمة كما في geojson.py.', en: "The fix is one line: js['status'] == 'OK' — the service\u2019s spelling, as in geojson.py." },
        { ar: 'بعد الإصلاح: الرد الأول يطبع lat: 42.2808 والثاني يطبع status: error — سطر لكل رد.', en: 'After the fix: the first reply prints lat: 42.2808 and the second prints status: error — one line per reply.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — خدمتك الجغرافية\n# Your playground — your own geo service\n\nimport json\n\npayload = \'{"status": "OK", "results": [{"formatted_address": "Ann Arbor, MI, USA", "lat": 42.2808, "lng": -83.7430, "place_id": "ChIJMx9D1A2wPIgR4rXIhkb5Cds"}]}\'\n\njs = json.loads(payload)\nplace = None\nif js["status"] == "OK":\n    place = js["results"][0]\n\nif place is None:\n    print("status: error")\nelse:\n    print("%s at lat: %s lng: %s" % (place["formatted_address"], place["lat"], place["lng"]))\n\n# جرّب: غير العنوان إلى Atlantic Ocean واجعل status ZERO_RESULTS وresults قائمة فارغة / try: change the address, set status to ZERO_RESULTS with empty results\n# جرّب: اطبع formatted_address قبل place_id / try: print formatted_address before place_id',
      prompt: {
        ar: 'جرّب بنفسك: أضف formatted_address إلى سطر الطباعة بصيغة %s المركبة. ثم مارس تمرين الكتاب: غيّر status إلى ZERO_RESULTS وresults إلى قائمة فارغة — هل يحميك الحارس؟ ثم أضف نتيجة ثانية للرد الأصلي واطبع ثاني إحداثيات. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: weave formatted_address into the print line with a compound %s format. Then rehearse the book\u2019s exercise: change status to ZERO_RESULTS with an empty results list — does the guard protect you? Then add a second result to the original reply and print the second coordinates. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: "ومن الفصل السادس: ماذا يطبع print('place id: %s' % place['place_id'])؟",
            en: "From chapter 6: what does print('place id: %s' % place['place_id']) print?",
          },
          options: [
            { id: 'a', text: { ar: "place id: ChIJMx9D1A2wPIgR4rXIhkb5Cds — %s تعوض السلسلة في موضعها", en: "place id: ChIJMx9D1A2wPIgR4rXIhkb5Cds — %s substitutes the string into its slot" } },
            { id: 'b', text: { ar: 'place id: %s — حرفيًّا بلا تعويض', en: 'place id: %s — literally, with no substitution' } },
            { id: 'c', text: { ar: 'TypeError — لأن % لا تعمل مع السلاسل', en: 'TypeError — because % refuses strings' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مشغّل % من الفصل السادس يعوض القيم في المواضع — و%s للسلاسل و%d للأعداد، وهو التنسيق الذي حملت به لوحة اليوم إحداثياتها.',
            en: 'The % operator from chapter 6 substitutes values into slots — %s for strings, %d for numbers; the same formatting that carried today\u2019s board of coordinates.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثامن: js[\'results\'] قائمة من قواميس — أي تعبير يقرأ أول نتيجة؟',
            en: "From chapter 8: js['results'] is a list of dicts — which expression reads the first result?",
          },
          options: [
            { id: 'a', text: { ar: "js['results'][0] — الفهرسة تبدأ من صفر", en: "js['results'][0] — indexing starts at zero" } },
            { id: 'b', text: { ar: "js['results'].first()", en: "js['results'].first()" } },
            { id: 'c', text: { ar: "js['results'][1] — لأن القوائم تبدأ من 1", en: "js['results'][1] — because lists start at 1" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قائمة كمن الفصل الثامن: [0] أول عنصر و[len-1] آخرها — وقد فتحنا بها أول قاموس نتيجة ثم مفاتيحه lat وlng.',
            en: 'A list, straight from chapter 8: [0] is the first element and [len-1] the last — we opened the first result dict by it, then its lat and lng keys.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "ومن الفصل التاسع: بعد js = json.loads(payload) — أي توابع القواميس تصح على js؟",
            en: "From chapter 9: after js = json.loads(payload) — which dictionary methods hold true on js?",
          },
          options: [
            { id: 'a', text: { ar: 'get وin وlen — قاموس بايثون كامل الصلاحيات', en: 'get, in, len — a dict with full privileges' } },
            { id: 'b', text: { ar: 'لا شيء — js نوع خاص من JSON لا يقبل التوابع', en: 'None — js is a special JSON type that refuses methods' } },
            { id: 'c', text: { ar: 'فقط append لأن js قائمة داخليًّا', en: 'Only append, because js is secretly a list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا سر قوة JSON في بايثون: الناتج قاموس أصلي — js.get(\'status\') يمنحك قيمة افتراضية عند الغياب، و\'results\' in js يسأل قبل القراءة.',
            en: "This is the secret of JSON\u2019s power in Python: the result is a native dict — js.get('status') gives a default on absence, and 'results' in js asks before reading.",
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الحادي عشر: متى نلجأ للتعبير النمطي بدل محلل JSON أو XML مع بيانات الويب؟',
            en: 'From chapter 11: when do we reach for regular expressions instead of a JSON or XML parser on web data?',
          },
          options: [
            { id: 'a', text: { ar: 'حين يكون النص خامًا بلا بنية موثوقة — كبحث عن أنماط داخل HTML — أما JSON وXML فبنيتها تستحق محللًا', en: 'When the text is raw with no trusted structure — like hunting patterns inside HTML; structured JSON and XML deserve their parsers' } },
            { id: 'b', text: { ar: 'دائمًا — فالتعبير النمطي يحلل JSON أسرع من json.loads', en: 'Always — regex parses JSON faster than json.loads' } },
            { id: 'c', text: { ar: 'أبدًا — فالتعبير النمطي لا يعمل على النصوص', en: 'Never — regex cannot work on text' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل أداة لمزاجها: التعبير النمطي للأنماط في نص حر، ومحللا XML وJSON للبنيات الموثقة — ومزجهما بحكمة هو ما فعلته أمثلة الفصول الأخيرة.',
            en: 'Each tool has its mood: regex for patterns in free text, the XML and JSON parsers for documented structures — and mixing them wisely is exactly what the last chapters\u2019 examples did.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'XML وJSON وجهان لتبادل البيانات — ما التوزيع الذي ختم به الكتاب؟',
            en: 'XML and JSON are two faces of data exchange — what split did the book close with?',
          },
          options: [
            { id: 'a', text: { ar: 'JSON أبسط وأقرب لبنى اللغات فغلب مجرى خدمات الويب — وXML يبقى أفضل توصيفًا ذاتيًّا كما في ملفات معالجات النصوص', en: 'JSON is simpler and closer to language structures so it took over web services — while XML stays the better self-describer, as in word-processor files' } },
            { id: 'b', text: { ar: 'XML حسم الويب كله وJSON اختفى', en: 'XML conquered the whole web and JSON vanished' } },
            { id: 'c', text: { ar: 'الصيغتان تتنافسان ولا يجوز المزج بينهما', en: 'The two formats compete and must never be mixed' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب ختم: هناك توجه نحو JSON لأنها أبسط وتعبر عن بنى البيانات بشكل أكبر وتحليلها مباشر أكثر — إال أنXML قابلة للتوصيف الذاتي بشكل أفضل فيبقى استخدامها أفضلية في بعض التطبيقات.',
            en: 'The book closed: there is a lean toward JSON as simpler and closer to core data structures with easier parsing — while XML self-describes better, keeping it an advantage in some applications.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'وفي التطبيق الثاني — تويتر — ماذا أضاف فوق مفتاح API البسيط؟',
            en: 'And in the second application — Twitter — what did it add on top of a plain API key?',
          },
          options: [
            { id: 'a', text: { ar: 'توقيع OAuth لكل طلب — أربع سلاسل سرية في hidden.py تُحسب في التوقيع المشفر', en: 'An OAuth signature per request — four secret strings in hidden.py folded into a cryptographic signature' } },
            { id: 'b', text: { ar: 'لا شيء — نفس المفتاح النصي في الرابط', en: 'Nothing — the same plain key in the URL' } },
            { id: 'c', text: { ar: 'رسوم دولارية تُدفع لكل تغريدة تُقرأ', en: 'Dollar fees paid per tweet read' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'انتقلت تويتر إلى الواجهات الموقعة بـ OAuth: مفتاح وسر ورمز ورمز سري في ملف مستقل — والفكرة التي تدرّبنا عليها: الأسرار خارج الكود المنشور.',
            en: 'Twitter moved to OAuth-signed interfaces: key, secret, token and token secret in a separate file — the very habit we practiced: secrets out of published code.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "if js['status'] == 'ok':  # حالة أحرف مزعومة",
          right: "if js['status'] == 'OK':  # إملاء الخدمة الموثق",
          note: {
            ar: 'كل خدمة تتهجى حالتها بطريقتها: OK أو ok أو ZERO_RESULTS — والمقارنة الخاطئة الحروف خلل صامت: لا خطأ ولا قراءة، فقط ردود سليمة تُرفض. انقل الإملاء من توثيق الخدمة حرفيًّا.',
            en: 'Every service spells its status its own way: OK, ok, ZERO_RESULTS — a case-wrong comparison is a silent flaw: no error, no read, just healthy replies rejected. Copy the spelling from the service docs verbatim.',
          },
        },
        {
          wrong: "first = js['results'][0]  # قبل أي فحص",
          right: "if js['status'] == 'OK':\n    first = js['results'][0]",
          note: {
            ar: 'بلا حارس ينهار السحب عند أول رد فاسد: قائمة فارغة ترمي IndexError ومفتاح مفقود يرمي KeyError. الحارس سؤال واحد يفصل النجاح عن الفشل قبل اللمس.',
            en: 'Without the guard the extraction collapses on the first bad reply: an empty list throws IndexError, a missing key throws KeyError. The guard is one question separating success from failure before touching anything.',
          },
        },
        {
          wrong: "print('lat', lat, 'lng', lng)  # فوضى الفواصل",
          right: "print('lat: %s' % place['lat'])\nprint('place id: %s' % place['place_id'])",
          note: {
            ar: 'الفواصل تطبع بينها فراغات فتخرج سطور متقشرة صعبة المطابقة — تنسيق % من الفصل السادس يمنح كل قيمة عنوانها الثابت: lat: 42.2808 وplace id: ChIJ…',
            en: 'Comma-printing scatters spaces and produces ragged lines that are hard to match — the chapter-6 % format gives each value its fixed label: lat: 42.2808 and place id: ChIJ…',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'خريطة الفصل: وسوم XML وشجرتها، ElementTree وfind وget، findall ومسار الأجداد، JSON وloads وdumps، وAPI بحارس الحالة.', en: 'The chapter map: XML tags and their tree, ElementTree with find and get, findall and the ancestor path, JSON with loads and dumps, and the API with its status guard.' },
        { ar: 'المصطلحات: XML صيغة بيانات مهيكلة، وElementTree محللها المضمن، وJSON ترميز الكائنات، والتحليل parse فك النص إلى بنية — وAPI اتفاقية تطبيقات وSOA بناء خدمي ومفتاح وحدود استخدام.', en: 'Glossary: XML the structured-data format, ElementTree its built-in parser, JSON the object encoding, parsing text into structure — and API the inter-app agreement, SOA the service architecture, key and rate limits.' },
        { ar: 'المشروع جمع الفصل كله: رد نصي مضمّن، loads، حارس يقارن OK بإملاء الخدمة، علم None، ثم lat وlng وplace id بتنسيق %s.', en: 'The project joined the whole chapter: an embedded textual response, loads, a guard comparing OK by the service\u2019s spelling, a None flag, then lat, lng and place id in %s format.' },
      ],
      reflectPrompt: {
        ar: 'لو وصلك رد بـ status تساوي ZERO_RESULTS وresults فارغة — ماذا يطبع قارئك بالضبط؟ اكتب الإجابة قبل تجربتها، ثم شغّلها في الملعب وقارن. أين تصمد الخدمات الحقيقية حيث تنكسر الأمثلة؟',
        en: 'If a reply arrived with status ZERO_RESULTS and an empty results list — what exactly would your reader print? Write the answer before testing, then run it in the sandbox and compare. Where do real services stress what examples never touch?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch13.s8', pages: 'ص221 / pp.221' },
        { book: 'PY4E', section: 'py4e.ch13.s9', pages: 'ص222 / pp.222' },
        { book: 'PY4E', section: 'py4e.ch13.s10', pages: 'ص227 / pp.227' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch13.s8', pages: 'ص221 / pp.221' },
    { book: 'PY4E', section: 'py4e.ch13.s9', pages: 'ص222 / pp.222' },
    { book: 'PY4E', section: 'py4e.ch13.s10', pages: 'ص227 / pp.227' },
  ],
} satisfies Lesson;

export default lesson;
