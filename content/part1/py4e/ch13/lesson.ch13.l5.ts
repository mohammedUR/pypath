import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch13.l5 — "APIs and Security / واجهات برمجة التطبيقات والأمان"
 * Aligned with PY4E ch13 s6 (واجهات برمجة التطبيقات) + s7 (الأمان واستخدام
 * واجهات برمجة التطبيقات).
 * All expression is original.
 * The urlopen fetch shape is desktop-only concept prose; runnable code parses
 * an EMBEDDED "API response" with the status guard + None-flag idiom (no
 * exit()).
 */
const lesson = {
  id: 'py4e.ch13.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 13,
  title: { ar: 'واجهات برمجة التطبيقات والأمان', en: 'APIs and Security' },
  estimatedMinutes: 18,
  prerequisites: ['py4e.ch13.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'تملك الآن الصيغتين — XML وJSON — فاكتمل نصف المعادلة. النصف الآخر: كيف تطلب البيانات أصلًا؟ الجواب واجهات برمجة التطبيقات API: اتفاقيات موثقة تجعل خدمة بعيدة قابلة للاستدعاء من برنامجك عبر HTTP — ترسل معاملات فترى بنية بيانات جاهزة للتحليل. ومعها درس الأمان الذي لا يتأجل: المفاتيح السرية وحدود الاستخدام. وبرمجيًّا اليوم أهم عادة في الفصل كله: الحارس — افحص status قبل أن تلمس results، واستخدم علم None بدل exit. بنهاية الدرس ستكون قادرًا على: شرح مفهوم API والبنية الخدمية SOA، وقراءة رد خدمة بحارس حالة، وتعامل آمن مع المفاتيح.',
        en: 'You now own the two formats — XML and JSON — so half the equation is complete. The other half: how do you actually ask for data? The answer is APIs: documented agreements that make a remote service callable from your program over HTTP — you send parameters and receive a structure ready to parse. With it comes the security lesson that cannot wait: secret keys and usage limits. And programmatically, today brings the most important habit of the whole chapter: the guard — check status before touching results, and use the None flag instead of exit. By the end of this lesson you will be able to: explain the API concept and the service-oriented architecture, read a service response with a status guard, and handle keys safely.',
      },
    },
    {
      kind: 'predict',
      code: "import json\nresponse = '{\"status\": \"ok\", \"lat\": 42.28}'\njs = json.loads(response)\nprint(js['status'])\nprint(js['status'] == 'ok')",
      question: {
        ar: 'رد الخدمة النصي حلّ إلى قاموس. ماذا يطبع السطران؟',
        en: 'The textual service response parsed into a dict. What do the two lines print?',
      },
      reveal: {
        ar: 'ok ثم True. هذا النمط صمام أمان كل برنامج API يكتبه المحترفون: الخدمة تضمّن في ردها حقل status يلخّص صحة العملية، وبرنامجك يقارنه قبل أي قراءة أعمق — سؤال واحد رخيص يوفر عليك أخطاء مفاتيح مذهلة.',
        en: "ok then True. This pattern is the safety valve of every API program the professionals write: the service embeds a status field in its response summarizing how the operation went, and your program compares it before any deeper read — one cheap question that spares you spectacular key errors.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'API: اتفاقية بين البرامج', en: 'API: an agreement between programs' },
      chunks: [
        {
          ar: 'واجهة برمجة التطبيقات API — حسب فهرس الكتاب — اتفاقية بين التطبيقات تحدد أنماط التفاعل بين مكونات تطبيقين. عمليًّا: برنامج يجعل خدماته متاحة عبر روابط URL موثقة، فترسل معاملات مثل ?address=Ann+Arbor فيرد بنية XML أو JSON. هذا هو نهج البنية الخدمية التوجه SOA: برنامجك يعتمد على خدمات تطبيقات أخرى بدل أن يحوي كل شيء. مثال الكتاب: موقع طيران يحجز فندقًا عبر خدمة حجز الفنادق — نسخة واحدة من البيانات عند مالكها، ومالكها يضع قواعد الاستخدام.',
          en: 'An API — per the book\u2019s glossary — is an agreement between applications defining how the components of two programs interact. Practically: a program exposes its services through documented URLs, you send parameters like ?address=Ann+Arbor, and it replies with an XML or JSON structure. This is Service-Oriented Architecture, SOA: your program leans on other applications\u2019 services instead of containing everything. The book\u2019s example: an airline site books a hotel through the hotel booking service — one copy of the data at its owner, and the owner sets the usage rules.',
        },
        {
          ar: 'شكل الاستدعاء على حاسوبك المكتبي يجمع الفصلين الماضيين: data = urlopen(url).read().decode() فتصل سلسلة الرد، ثم js = json.loads(data) كما تعلمت — والبرنامجان geojson.py وgeoxml.py في الكتاب يفعلان هذا تمامًا. أما هنا فنضمّن رد الخدمة نصًّا في المتغير لأن بيئتنا بلا شبكة: نضمن رد الخدمة نصيًّا، وكل ما بعد السطر الأول حرفيًّا متطابق.',
          en: 'The call shape on your desktop joins the last two chapters: data = urlopen(url).read().decode() brings the response string, then js = json.loads(data) as you learned — the book\u2019s geojson.py and geoxml.py do exactly this. Here we embed the response as text in a variable because our runtime has no network: we guarantee the service response as text, and everything after that first line is character-for-character identical.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المفاتيح وحدود الاستخدام', en: 'Keys and rate limits' },
      chunks: [
        {
          ar: 'من الشائع أن تطلب الشركة مفتاحًا API key قبل استخدام واجهتها — والهدف كما يذكر الكتاب: معرفة من يستخدم خدماتها وكم يستخدمها، فبعض الخدمات مدفوعة وبعضها محدد بعدد طلبات في مدة زمنية — وهو ما نسميه حدود الاستخدام rate limits. المفتاح يُضمّن في رسالة الطلب أو معاملًا في الرابط. ولكون الخدمات المجانية مثل خدمة جوغل للجغرافيا قد تُقلَّص إن أساء الناس استخدامها — فالمفتاح والعدل في الاستخدام شبكة أمان الجميع.',
          en: 'It is common for a company to require an API key before using its interface — the goal, as the book notes: knowing who uses their services and how much; some services are paid, some are capped by request counts per time window — what we call rate limits. The key travels inside the request message or as a URL parameter. And since free services like Google\u2019s geocoding can be throttled if people misuse them — the key, plus fair usage, is everyone\u2019s safety net.',
        },
        {
          ar: 'القاعدة الذهبية للأمان: المفتاح سرّ — لا تكتبه في كود تنشره ولا تشاركه في لقطات شاشة. حيلة الكتاب في مثال تويتر أنشأت ملفًا مستقلًا hidden.py يحمل الأربع سلاسل السرية بعيدًا عن الكود المنشور. وللطلبات الموقعة تشفيريًّا توجد بروتوكولات جاهزة مثل OAuth ومكتبات مجانية — والكتاب يحيل التفاصيل إلى oauth.net. في تمريننا سنضع المفتاح جانبًا ونتعلم أهم مهارة ما بعد الرد: الحارس.',
          en: 'The golden security rule: the key is a secret — never write it into code you publish or share in screenshots. The book\u2019s Twitter example crafted a separate hidden.py file holding the four secret strings away from the published code. For cryptographically signed requests there are ready protocols like OAuth and free libraries — the book refers details to oauth.net. In our exercise we set the key aside and learn the most important post-response skill: the guard.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الحارس: افحص الحالة ثم اقرأ', en: 'The guard: check status, then read' },
      code: "import json\n\nresponse = '''\n{\n  \"status\": \"ok\",\n  \"results\": [\n    { \"name\": \"Ann Arbor\", \"lat\": 42.2808, \"lng\": -83.7430 }\n  ]\n}'''\n\njs = json.loads(response)\n\nplace = None\nif js['status'] != 'ok':\n    place = None\nelse:\n    place = js['results'][0]\n\nif place is None:\n    print('status: error')\nelse:\n    print('status: ok')\n    print('lat:', place['lat'])\n    print('lng:', place['lng'])",
      explanation: {
        ar: 'هذا هو الهيكل الذي سيرافقك في كل واجهة برمجية: بعد loads نبني علمًا place يبدأ None — والحارس يقارن js[\'status\'] مع قيمة النجاح، فإن خالفها بقي العلم مرفوعًا فلا نلمس results أصلًا. عند النجاح نقرأ العنصر الأول ونطبع lat: 42.2808 وlng: -83.743. لاحظ ما حدثنا عنه في الدرس الماضي: -83.7430 تُقرأ عددًا عشريًّا فيُطبع -83.743 — الصفر الأخير ليس من تركيبة العدد. ولو كان الرد status: error لطبعنا سطرًا واحدًا آمنًا بلا أي انهيار — فالعلم None يغني عن exit الذي درسناه ولا نشغّله.',
        en: 'This is the skeleton that will accompany you in every API: after loads we build a flag place starting at None — and the guard compares js[\'status\'] with the success value, so on a mismatch the flag stays raised and results is never touched. On success we read element zero and print lat: 42.2808 and lng: -83.743. Notice what last lesson hinted at: -83.7430 is read as a decimal number and prints as -83.743 — the trailing zero is not part of the number\u2019s identity. And had the reply been status: error, we would have printed one safe line with no crash — the None flag replaces the exit() the book teaches but we do not run.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.status-guard',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'رد الخدمة مضمّن في المحرر. حلّله بـ json.loads في js، ثم ابنِ الحارس: متغير place يبدأ None، فإن كانت js[\'status\'] تساوي \'ok\' اجعل place يساوي js[\'results\'][0]. ثم إن كان place هو None اطبع status: error، وإلا اطبع status: ok وlat: مع place[\'lat\'] وlng: مع place[\'lng\']. المتوقع: status: ok ثم lat: 10.5 ثم lng: 20.25.',
        en: "The service response is embedded in the editor. Parse it with json.loads into js, then build the guard: a variable place starting at None, and if js['status'] equals 'ok' set place to js['results'][0]. Then if place is None print status: error, else print status: ok and lat: with place['lat'] and lng: with place['lng']. Expected: status: ok, then lat: 10.5, then lng: 20.25.",
      },
      starterCode: "import json\n\nresponse = '{\"status\": \"ok\", \"results\": [{\"lat\": 10.5, \"lng\": 20.25}]}'\n\njs = json.loads(response)\n# الحارس ثم الفرعان / the guard, then the two branches\n",
      solution: "import json\n\nresponse = '{\"status\": \"ok\", \"results\": [{\"lat\": 10.5, \"lng\": 20.25}]}'\n\njs = json.loads(response)\n\nplace = None\nif js['status'] == 'ok':\n    place = js['results'][0]\n\nif place is None:\n    print('status: error')\nelse:\n    print('status: ok')\n    print('lat: %s' % place['lat'])\n    print('lng: %s' % place['lng'])",
      tests: [
        {
          id: 't1',
          name: { ar: 'العنصر الأول استُخرج في place', en: 'The first element was extracted into place' },
          code: "assert place == {'lat': 10.5, 'lng': 20.25}, 'expected: lat 10.5 lng 20.25 | actual: %r' % (place,)",
          expected: 'lat 10.5 lng 20.25',
        },
        {
          id: 't2',
          name: { ar: 'الحالة تطبّع النجاح', en: 'The status prints success' },
          code: "assert 'status: ok' in __learner_output__, 'expected: status: ok | actual: %r' % __learner_output__",
          expected: 'status: ok',
        },
        {
          id: 't3',
          name: { ar: 'الإحداثيات مطبوعة بصيغة الخدمة', en: 'The coordinates printed in service format' },
          code: "assert 'lat: 10.5' in __learner_output__ and 'lng: 20.25' in __learner_output__, 'expected: lat: 10.5 / lng: 20.25 | actual: %r' % __learner_output__",
          expected: 'lat: 10.5 / lng: 20.25',
        },
      ],
      hints: [
        { ar: 'المقارنة مع النص "ok" بالضبط — لا ok حرة ولا OK كبيرة هنا: الخدمة تكتب ok.', en: 'Compare with the exact text "ok" — not free-form or capital OK here: this service writes ok.' },
        { ar: 'العلم يبدأ None قبل أي شرط — ثم يرفع أو يترك بحسب الحارس.', en: 'The flag starts at None before any condition — then it is set or left, according to the guard.' },
        { ar: 'الهيكل:\nplace = None\nif js[\'status\'] == \'ok\':\n    place = js[\'results\'][0]\nif place is None:\n    print(\'status: error\')\nelse:\n    print(\'status: ok\')\n    print(\'lat: %s\' % place[\'lat\'])\n    print(\'lng: %s\' % place[\'lng\'])', en: "The skeleton:\nplace = None\nif js['status'] == 'ok':\n    place = js['results'][0]\nif place is None:\n    print('status: error')\nelse:\n    print('status: ok')\n    print('lat: %s' % place['lat'])\n    print('lng: %s' % place['lng'])" },
        { ar: "place = None\nif js['status'] == 'ok':\n    place = js['results'][0]\nif place is None:\n    print('status: error')\nelse:\n    print('status: ok')\n    print('lat: %s' % place['lat'])\n    print('lng: %s' % place['lng'])", en: "place = None\nif js['status'] == 'ok':\n    place = js['results'][0]\nif place is None:\n    print('status: error')\nelse:\n    print('status: ok')\n    print('lat: %s' % place['lat'])\n    print('lng: %s' % place['lng'])" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-results',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import json\njs = json.loads('{\"status\": \"ok\", \"results\": [{\"lat\": 1.5}, {\"lat\": 2.5}]}')\nresults = js['results']\nprint(js['status'])\nprint(len(results))\nprint(results[1]['lat'])",
      solution: 'ok\n2\n2.5',
      answer: 'ok\n2\n2.5',
      hints: [
        { ar: 'الحالة أعلى مستوى — مفتاح مباشر.', en: 'The status is top level — a direct key.' },
        { ar: 'results قائمة من قواميس — وlen يحصيها كما في الفصل الثامن.', en: 'results is a list of dicts — len counts it as chapter 8 taught.' },
        { ar: 'results[1] هو القاموس الثاني — ومفتاحه lat قيمة عشرية.', en: 'results[1] is the second dict — and its lat key holds a decimal.' },
        { ar: 'الخرْج:\nok\n2\n2.5', en: 'The output:\nok\n2\n2.5' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-key-secret',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يُعد مفتاح الـ API سرًّا لا يُكتب في كود تنشره؟',
        en: 'Why is an API key a secret that must not appear in code you publish?',
      },
      options: [
        { id: 'a', text: { ar: 'لأنه يعرّفك وتحصيلة استخدامك — ومن يملكه يستهلك حدّك ويكشف حسابك', en: 'It identifies you and your usage — whoever holds it spends your quota and exposes your account' } },
        { id: 'b', text: { ar: 'لأن المفتاح يفرغ بطاريته إذا نُشر', en: 'Because a key drains its battery if published' } },
        { id: 'c', text: { ar: 'لأن الأسرار تُعطي تنسيقًا أجمل للكود', en: 'Because secrets make the code look nicer' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'عند الخدمة: لمن تُنسب كل طلبات المفتاح؟', en: 'At the service: to whose account do the key\u2019s requests belong?' },
        { ar: 'الكتاب يذكر الهدف: معرفة من يستخدم الخدمات وكمية استخدامه — وحدود الاستخدام تُحسب على المفتاح.', en: 'The book states the goal: knowing who uses the services and how much — rate limits are counted against the key.' },
        { ar: 'من يملك مفتاحك يستهلك حدّك أنت ويظهر باسمك — خاصة مع الخدمات الموقعة.', en: 'Whoever holds your key spends your allowance and appears as you — especially with signed services.' },
        { ar: 'الجواب: أ — المفتاح هويتك وحصتك، فلا يُنشر ولا يُشارك.', en: 'Answer: a — the key is your identity and your quota, so it is never published or shared.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-loads',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'قبل أي حارس حالة يجب تحويل نص الرد إلى قاموس — والتابع المناسب لسلسلة نصية هو json.____',
        en: 'Before any status guard the response text must become a dictionary — and the right method for a string is json.____',
      },
      answer: 'loads',
      solution: 'loads',
      hints: [
        { ar: 'حرف s الأخير يعني سلسلة string — إذًا هذه للسلاسل لا الملفات.', en: 'The trailing s stands for string — so this one is for strings, not files.' },
        { ar: 'استخدمناه في كل درس من هذا الفصل بعد وصول الرد النصي.', en: 'We used it in every lesson of this chapter after the textual response arrived.' },
        { ar: 'بعد json.loads يصبح js[\'status\'] ممكنًا.', en: "After json.loads, js['status'] becomes possible." },
        { ar: 'الجواب: loads', en: 'Answer: loads' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — بدّل مصائر الرد\n# Your playground — swap the response\u2019s fate\n\nimport json\n\nresponse = \'{"status": "ok", "results": [{"lat": 42.2808, "lng": -83.7430}]}\'\n\njs = json.loads(response)\nplace = None\nif js["status"] == "ok":\n    place = js["results"][0]\n\nif place is None:\n    print("status: error")\nelse:\n    print("status: ok", place["lat"], place["lng"])\n\n# جرّب: غير status إلى "error" ولاحظ الفرع الآمن / try: change status to "error" and watch the safe branch\n# جرّب: js.get("status", "missing") — ماذا تعيد get الافتراضي؟ / try: js.get("status", "missing") — what does get\u2019s default return?',
      prompt: {
        ar: 'جرّب بنفسك: غير status إلى error فاطلق الفرع الآمن، ثم احذف حقل status من الرد كله وشاهد الخطأ — ثم أصلح بـ js.get(\'status\'). جرّب أيضًا قيمة status مثل LIMIT واقرأ رسالة الأمانة. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: change status to error and release the safe branch, then delete the status field from the response entirely and watch it crash — then fix it with js.get(\'status\'). Also try a status like LIMIT and read the honest message. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الذي يجعل API "اتفاقية" لا مجرد رابط URL؟',
            en: 'What makes an API an "agreement" and not just a URL?',
          },
          options: [
            { id: 'a', text: { ar: 'أنماط التفاعل موثقة: معاملات مقبولة وشكل رد معروف وقواعد استخدام — فيبني كل طرف على معرفة الطرف الآخر', en: 'Interaction patterns are documented: accepted parameters, a known response shape, usage rules — each side builds on knowledge of the other' } },
            { id: 'b', text: { ar: 'أن الرابط طويل بمعاملات كثيرة', en: 'That the URL is long with many parameters' } },
            { id: 'c', text: { ar: 'أن الخدمة تدفع رسومًا للطرفين', en: 'That the service charges both parties fees' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'حسب فهرس الكتاب: API اتفاقية بين التطبيقات تحدد أنماط التفاعل بين مكونات تطبيقين — التوثيق هو العقد، وشكل الرد JSON أو XML هو لغته المشتركة.',
            en: 'Per the book\u2019s glossary: an API is an agreement between applications defining the interaction patterns between two programs\u2019 components — documentation is the contract, and JSON or XML response shape is its shared language.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السابع: لماذا وضع الكتاب مفاتيح تويتر الأربع في ملف hidden.py مستقل بدل كتابتها داخل البرنامج نفسه؟',
            en: 'From chapter 7: why did the book keep Twitter\u2019s four keys in a separate hidden.py file instead of writing them inside the program itself?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الملف المنفصل يُستبعد من المشاركة والنشر — والبرنامج يبقى قابلًا للتوزيع بلا أسرار', en: 'The separate file stays out of sharing and publishing — the program remains distributable with no secrets inside' } },
            { id: 'b', text: { ar: 'لأن بايثون تمنع كتابة السلاسل السرية في المتغيرات', en: 'Because Python forbids writing secret strings into variables' } },
            { id: 'c', text: { ar: 'لأن الملفات أسرع من المتغيرات في القراءة', en: 'Because files read faster than variables' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'تعليق الكتاب صريح في أول الملف: Keep this file separate — فصل السر عن الكود يحمي الأسرار عند المشاركة، وهي نفس فكرة القراءة من ملف بدل تضمين البيانات.',
            en: 'The book\u2019s own comment is blunt: Keep this file separate — separating the secret from the code protects it at sharing time, the same idea as reading from a file instead of embedding data.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما حدود الاستخدام rate limits ولماذا تفرضها الخدمات؟',
            en: 'What are rate limits and why do services impose them?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد طلبات مسموح في مدة زمنية — لحماية الخدمة من الإرهاق وتنظيم المجاني والمدفوع', en: 'An allowed number of requests per time window — protecting the service from overload and regulating free versus paid tiers' } },
            { id: 'b', text: { ar: 'سرعة إنترنت دنيا يفرضها مزود الخدمة', en: 'A minimum internet speed imposed by the provider' } },
            { id: 'c', text: { ar: 'حدًّا لطول السلاسل في الرد', en: 'A cap on string lengths in the response' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يذكر سياسة تحديد عدد الطلبات المتاحة للفرد خلال مدة زمنية — فمالك البيانات يضع قواعد الاستخدام وهي إحدى فوائد البنية الخدمية SOA.',
            en: 'The book mentions the policy of capping the requests available per person per time window — the data owner sets usage rules, one of SOA\u2019s stated benefits.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'لماذا اعتمدنا علم None بدل استدعاء exit() عند فشل الرد؟',
            en: 'Why did we rely on a None flag instead of calling exit() on a failed response?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يجعل البرنامج متابعه آمنًا ومنضبطًا: فرع واحد يتعامل مع الفشل ويكمل — بينما exit يقطع كل شيء', en: 'It keeps the program safe and disciplined to follow: one branch handles failure and continues — while exit cuts everything off' } },
            { id: 'b', text: { ar: 'لأن exit غير موجود في بايثون أصلًا', en: 'Because exit does not exist in Python at all' } },
            { id: 'c', text: { ar: 'لأن None أسرع حسابيًّا من exit', en: 'Because None is computationally faster than exit' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'برنامج الكتاب يستخدم try/except ثم continue — ونحن تعلمنا في الفصلين السابع والتاسع أن علم None يعطي التحكم الكامل: فرعك يقرر ماذا يطبع ويكمل، لا انقطاع مفاجئ.',
            en: 'The book\u2019s program uses try/except then continue — and chapters 7 and 9 taught us that a None flag gives full control: your branch decides what to print and carries on, no abrupt cut.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'api_key = "AIzaSy___IDByT70"  # في كود منشور',
          right: '# المفتاح في ملف مستقل hidden.py خارج المشاركة',
          note: {
            ar: 'المفتاح المنشور سر منشور: أي قارئ يستخدم حدّك ويكشف حسابك — خاصة مع الخدمات الموقعة OAuth. اجعل الأسرار في ملف مستقل يُستثنى من المشاركة.',
            en: 'A published key is a published secret: any reader spends your quota and exposes your account — especially with OAuth-signed services. Keep secrets in a separate file excluded from sharing.',
          },
        },
        {
          wrong: "lat = js['results'][0]['lat']  # بلا حارس — مباشرة",
          right: "if js['status'] == 'ok':\n    lat = js['results'][0]['lat']",
          note: {
            ar: 'قراءة results قبل فحص status تقصي عنك عند أول رد خطأ — مفتاح مفقود أو قائمة فارغة. الحارس سؤال واحد رخيص يمنع انهيار البرنامج أمام بيانات سيئة.',
            en: 'Reading results before checking status ambushes you at the first error reply — a missing key or an empty list. The guard is one cheap question that keeps the program upright on bad data.',
          },
        },
        {
          wrong: "if not js or js['status'] != 'ok':\n    exit()  # قطع صامت",
          right: "if not js or js['status'] != 'ok':\n    print('status: error')  # ثم أكمل بعلم None",
          note: {
            ar: 'exit يقطع البرنامج فجأة بلا رسالة ولا فرصة للتعافي — عادة الكتاب نتعلمها ولا نشغّلها. علم None مع طباعة حالة يمنحك فرع فشل مفهومًا ويُبقي الحلقة حية.',
            en: 'exit cuts the program dead with no message and no recovery — the book\u2019s habit we learn but never run. A None flag with a printed status gives you an understandable failure branch and keeps the loop alive.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'API اتفاقية بين التطبيقات: روابط موثقة ومعاملات ورد ببنية معروفة — والاعتماد على خدمات الآخرين هو البنية الخدمية SOA.', en: 'An API is an agreement between applications: documented URLs, parameters, and a known response shape — leaning on others\u2019 services is Service-Oriented Architecture.' },
        { ar: 'المفتاح سر يعرّفك ويحسب حدود استخدامك — يُبعد عن الكود المنشور كما في hidden.py، وOAuth يوقع الطلبات الحساسة.', en: 'A key is a secret identifying you and metering your usage — kept away from published code like hidden.py, with OAuth signing sensitive requests.' },
        { ar: 'الهيكل الذهبي: loads ثم حارس status ثم علم None — فلا تلمس results إلا بعد النجاح ولا exit في أي حال.', en: 'The golden skeleton: loads, then a status guard, then a None flag — never touch results before success and never exit.' },
      ],
      reflectPrompt: {
        ar: 'تخيل خدمة طقس ترد: status أو result أو temp. اكتب الحارس وعلم None وسطري الطباعة الآمنين — ثم اسأل نفسك: ماذا يطبع برنامجك لو غاب status كليًّا؟ كيف تجعله أصلب؟',
        en: 'Imagine a weather service replying: status, result, temp. Write the guard, the None flag and the two safe print lines — then ask yourself: what does your program print if status is missing entirely? How do you make it sturdier?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch13.s6', pages: 'ص219 / pp.219' },
        { book: 'PY4E', section: 'py4e.ch13.s7', pages: 'ص221 / pp.221' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch13.s6', pages: 'ص219 / pp.219' },
    { book: 'PY4E', section: 'py4e.ch13.s7', pages: 'ص221 / pp.221' },
  ],
} satisfies Lesson;

export default lesson;
