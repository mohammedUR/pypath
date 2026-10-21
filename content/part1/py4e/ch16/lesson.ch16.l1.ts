import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch16.l1 — "Google Geodata / بيانات غوغل الجغرافية"
 * Aligned with PY4E ch16 s1 (عرض خريطة باستخدام بيانات جغرافية من غوغل).
 * All expression is original.
 * SIMULATED-RENDERER design: the Google geocoding API call itself is framed
 * as desktop/conceptual (ch13 API skills); the runnable code parses an
 * EMBEDDED geojson-like payload (json.loads + status guard + None flag) and
 * extracts lat/lng/place_id — the map rendering happens in an external tool.
 */
const lesson = {
  id: 'py4e.ch16.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 16,
  title: { ar: 'بيانات غوغل الجغرافية', en: 'Google Geodata' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch15.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الفصل الأخير يجمع كل ما تعلمته في ثلاثة تطبيقات حقيقية: بيانات جغرافية تُعرض على خريطة، وشبكة صفحات تُرسم كعقد وروابط، وبريد إلكتروني يُحلَّل عبر الزمن — كلها بوصفة واحدة: نجمع البيانات، وننظمها، ثم نسلّمها لأداة عرض. في هذا الدرس: الترميز الجغرافي — ترسل عنوانًا نصيًّا لخدمة غوغل فترد الإحداثيات. لا شبكة في منصتنا: نضمّن رد الخدمة نصيًّا كما في الفصل الثالث عشر، ونولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية. بنهاية الدرس ستكون قادرًا على: وصف الترميز الجغرافي وحقول lat وlng وplace_id، وقراءة رد الخدمة بحارس الحالة وعلم None، وطباعة سطور إحداثيات مهيكلة.',
        en: 'The final chapter gathers everything you learned into three real applications: geodata drawn on a map, a web of pages drawn as nodes and links, and email analyzed across time — all with one recipe: collect the data, organize it, then hand it to a rendering tool. This lesson: geocoding — you send a text address to a Google service and coordinates come back. Our platform has no network: we embed the service reply as text as in chapter thirteen, and we generate the chart data here; the rendering happens in an external tool. By the end of this lesson you will be able to: describe geocoding and the lat, lng and place_id fields, read the service reply with the status guard and None flag, and print structured coordinate lines.',
      },
    },
    {
      kind: 'predict',
      code: "place = 'Kokshetau'\nlat = 53.2833333\nlng = 69.3833333\nprint('%s -> %s, %s' % (place, lat, lng))\nprint(lat > 0, lng > 0)",
      question: {
        ar: 'هذه هي هيئة السطر الذي سنطبعه في كل هذا الفصل: اسم ثم إحداثيان. ماذا يطبع السطران؟ وأيّ قيمة تعني شمال خط الاستواء؟',
        en: 'This is the shape of the line we print throughout the chapter: a name then two coordinates. What do the two lines print? And which value means north of the equator?',
      },
      reveal: {
        ar: 'يطبع Kokshetau -> 53.2833333, 69.3833333 ثم True True. خط العرض latitude يقيس شمالًا وجنوبًا — والموجب يعني الشمال؛ وخط الطول longitude يقيس شرقًا وغربًا. قازاقستان شمال خط الاستواء وشرق غرينتش — إحداثيان يحصران المكان على الكرة كلها.',
        en: 'It prints Kokshetau -> 53.2833333, 69.3833333 then True True. The latitude measures north and south — positive means north; the longitude measures east and west. Kazakhstan is north of the equator and east of Greenwich — two numbers pin the place on the whole globe.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الترميز الجغرافي: من العنوان إلى الإحداثيات', en: 'Geocoding: from address to coordinates' },
      chunks: [
        {
          ar: 'واجهة غوغل البرمجية للترميز الجغرافي Google geocoding API تأخذ عنوانًا نصيًّا وترد أفضل تخمين لمكانه: عنوانًا منسقًا formatted_address، وخط عرض lat وخط طول lng، ومعرّف مكان place_id يعرّف النتيجة عند غوغل. مشروع الكتاب يقرأ أسماء جامعات من ملف where.data سطرًا سطرًا، يرمّز كل اسم جغرافيًّا، ثم يثبّت المواقع على خريطة غوغل. الرد يأتي بصيغة JSON كما تعلمت: حقل status يتهجى OK بأحرف كبيرة، وقائمة results تحمل قاموسًا لكل عنوان.',
          en: 'The Google geocoding API takes a text address and replies with its best guess of the place: a formatted_address, a latitude lat and longitude lng, and a place_id identifying the result at Google. The book\u2019s project reads university names from a where.data file line by line, geocodes each name, then pins the locations on a Google map. The reply arrives in JSON as you learned: a status field spelled OK in capitals, and a results list holding one dict per address.',
        },
        {
          ar: 'القراءة نفسها مهاراتك القديمة من الفصل الثالث عشر: json.loads يحول النص إلى قاموس، والحارس يقارن status مع OK قبل أي قراءة عميقة، وعلم None يحمي من رد فاسد. الجديد هنا ليس الأدوات بل الغرض: القيم التي نسحبها إحداثيات — أعداد حقيقية تقيس الكرة الأرضية — وستصبح لاحقًا نقاطًا على خريطة.',
          en: 'The reading itself is your old chapter-thirteen skill: json.loads turns the text into a dict, the guard compares status with OK before any deep read, and a None flag protects against a bad reply. What is new is not the tools but the purpose: the values we extract are coordinates — real numbers measuring the globe — and they will later become points on a map.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'مرحلتان وذاكرة مؤقتة', en: 'Two phases and a cache' },
      chunks: [
        {
          ar: 'النسخة المجانية من الواجهة محدودة العدد من الطلبات في اليوم — فلديك مئات الجامعات، لا يمكنك السؤال عنها كل مرة. الكتاب يقسم العمل مرحلتين: الأولى geoload.py يقرأ where.data ويتحقق من كل سطر في قاعدة البيانات geodata.sqlite قبل الاتصال بغوغل — القاعدة ذاكرة تخزين مؤقت cache: الموجود يُطبع Found in database ويُخطَّى، والجديد فقط يُسترجع ويُخزن. تشغيل الكتاب يظهر: Resolving Monash University ثم Retrieved 2063 characters ثم قاموس {status: OK, results: ...}.',
          en: 'The free tier of the API caps requests per day — and you have hundreds of universities, so you cannot ask every time. The book splits the work into two phases: first geoload.py reads where.data and checks each line against the geodata.sqlite database before calling Google — the database is a local cache: what is found prints Found in database and is skipped, and only new lines are retrieved and stored. The book\u2019s run shows Resolving Monash University, then Retrieved 2063 characters, then the dict {status: OK, results: ...}.',
        },
        {
          ar: 'وفي منصتنا لا شبكة ولا مفتاح API: نضمّن رد الخدمة نصيًّا في الكود ونركّز على القراءة والحارس — والمرحلة الثانية (توليد ملف الخريطة) هي درسنا القادم. نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية: خريطة غوغل نفسها تُرسم في متصفح بشيفرة JavaScript لا نملكها.',
          en: 'And in our platform there is no network and no API key: we embed the service reply as text in the code and focus on reading and guarding — while phase two, generating the map file, is our next lesson. We generate the chart data here; the rendering happens in an external tool: the Google map itself is drawn in a browser by JavaScript code that is not ours.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'قارئ مصغّر لرد الترميز الجغرافي', en: 'A miniature geocoding reply reader' },
      code: "import json\n\npayload = '''\n{\n  \"status\": \"OK\",\n  \"results\": [\n    { \"formatted_address\": \"Northeastern University, Boston, MA 02115, USA\", \"lat\": 42.3396998, \"lng\": -71.08975, \"place_id\": \"ChIJ0X6Y1cdw44kRfCQ5p1WHWvA\" },\n    { \"formatted_address\": \"Bradley University, Peoria, IL 61625, USA\", \"lat\": 40.6963857, \"lng\": -89.6160811, \"place_id\": \"ChIJN1t_tDeuEmsRUsoyG83frY4\" },\n    { \"formatted_address\": \"Monash University, Clayton VIC 3800, Australia\", \"lat\": -37.9152113, \"lng\": 145.134682, \"place_id\": \"ChIJrTLrKyuEj4ARi29s3WvMx0Q\" }\n  ]\n}'''\n\njs = json.loads(payload)\n\nplace = None\nif js['status'] == 'OK':\n    place = js\n\nif place is None:\n    print('status: error')\nelse:\n    print('places: %d' % len(place['results']))\n    for r in place['results']:\n        name = r['formatted_address'].split(',')[0]\n        print('%s -> %s, %s' % (name, r['lat'], r['lng']))\n    first = place['results'][0]\n    print('first place id: %s' % first['place_id'])",
      explanation: {
        ar: 'هذا هيكل geojson.py من الفصل الثالث عشر بغرض جديد: json.loads يفتح الرد، والحارس يقارن status مع OK بإملاء غوغل، وعلم None يوجّه الفشل إلى فرع آمن. عند النجاح نطبع حجم القائمة، ثم في كل نتيجة نقطع الاسم الأول بـ split(\',\')[0] من الفصل السادس ونطبع سطر name -> lat, lng. لاحظ أن موناش جنوب خط الاستواء فطبع lat بالسالب — والسطر كله ASCII جاهز للمطابقة. معرّف المكان مطبوع للنتيجة الأولى فقط توفيرًا للسطور.',
        en: 'This is the chapter-thirteen geojson.py shape with a new purpose: json.loads opens the reply, the guard compares status with OK in Google\u2019s own spelling, and the None flag routes failure to a safe branch. On success we print the list size, then for each result we slice the first name with split(\',\')[0] from chapter six and print a name -> lat, lng line. Note Monash lies south of the equator so its lat printed negative — and the whole line is ASCII, ready for matching. The place id is printed for the first result only, to keep lines short.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.geodata-write',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الرد مضمّن في المحرر ويحمل أربعة مواقع. 1) حلّله بـ json.loads في js. 2) ابنِ الحارس: متغير place يبدأ None — فإن كانت js[\'status\'] تساوي \'OK\' اجعل place يساوي js. 3) إن كان place هو None اطبع status: error، وإلا اطبع: places: %d بعدد النتائج، ثم لكل نتيجة سطر %s -> %s, %s بالاسم المقطوع بـ split(\',\')[0] وlat وlng، ثم first place id: %s بمعرّف النتيجة الأولى. المتوقع: places: 4 ثم أربعة أسطر إحداثيات ثم first place id: ChIJ0X6Y1cdw44kRfCQ5p1WHWvA.',
        en: "The reply is embedded in the editor and carries four locations. 1) Parse it with json.loads into js. 2) Build the guard: a variable place starting at None — if js['status'] equals 'OK' set place to js. 3) If place is None print status: error, else print: places: %d with the result count, then for each result a %s -> %s, %s line with the name sliced by split(',')[0] and lat and lng, then first place id: %s with the first result's id. Expected: places: 4, then four coordinate lines, then first place id: ChIJ0X6Y1cdw44kRfCQ5p1WHWvA.",
      },
      starterCode: "import json\n\npayload = '''\n{\n  \"status\": \"OK\",\n  \"results\": [\n    { \"formatted_address\": \"Northeastern University, Boston, MA 02115, USA\", \"lat\": 42.3396998, \"lng\": -71.08975, \"place_id\": \"ChIJ0X6Y1cdw44kRfCQ5p1WHWvA\" },\n    { \"formatted_address\": \"Bradley University, Peoria, IL 61625, USA\", \"lat\": 40.6963857, \"lng\": -89.6160811, \"place_id\": \"ChIJN1t_tDeuEmsRUsoyG83frY4\" },\n    { \"formatted_address\": \"Monash University, Clayton VIC 3800, Australia\", \"lat\": -37.9152113, \"lng\": 145.134682, \"place_id\": \"ChIJrTLrKyuEj4ARi29s3WvMx0Q\" },\n    { \"formatted_address\": \"Kokshetau, Kazakhstan\", \"lat\": 53.2833333, \"lng\": 69.3833333, \"place_id\": \"ChIJ2c1nZAHDvJURf8Qz8x0X0vQ\" }\n  ]\n}'''\n\n# 1) js = json.loads(payload)\n# 2) الحارس: place = None ثم افحص js['status'] == 'OK'\n# 3) اطبع places ثم سطر name -> lat, lng لكل نتيجة ثم first place id\n",
      solution: "import json\n\npayload = '''\n{\n  \"status\": \"OK\",\n  \"results\": [\n    { \"formatted_address\": \"Northeastern University, Boston, MA 02115, USA\", \"lat\": 42.3396998, \"lng\": -71.08975, \"place_id\": \"ChIJ0X6Y1cdw44kRfCQ5p1WHWvA\" },\n    { \"formatted_address\": \"Bradley University, Peoria, IL 61625, USA\", \"lat\": 40.6963857, \"lng\": -89.6160811, \"place_id\": \"ChIJN1t_tDeuEmsRUsoyG83frY4\" },\n    { \"formatted_address\": \"Monash University, Clayton VIC 3800, Australia\", \"lat\": -37.9152113, \"lng\": 145.134682, \"place_id\": \"ChIJrTLrKyuEj4ARi29s3WvMx0Q\" },\n    { \"formatted_address\": \"Kokshetau, Kazakhstan\", \"lat\": 53.2833333, \"lng\": 69.3833333, \"place_id\": \"ChIJ2c1nZAHDvJURf8Qz8x0X0vQ\" }\n  ]\n}'''\n\njs = json.loads(payload)\n\nplace = None\nif js['status'] == 'OK':\n    place = js\n\nif place is None:\n    print('status: error')\nelse:\n    print('places: %d' % len(place['results']))\n    for r in place['results']:\n        name = r['formatted_address'].split(',')[0]\n        print('%s -> %s, %s' % (name, r['lat'], r['lng']))\n    first = place['results'][0]\n    print('first place id: %s' % first['place_id'])",
      tests: [
        {
          id: 't1',
          name: { ar: 'الحارس مرّ والرد سليم', en: 'The guard passed and the reply is healthy' },
          code: "assert place is not None, 'expected: place holds the parsed reply | actual: %r' % (place,)",
          expected: 'place holds the parsed reply',
        },
        {
          id: 't2',
          name: { ar: 'العدد مطبوع', en: 'The count is printed' },
          code: "assert 'places: 4' in __learner_output__, 'expected: places: 4 | actual: %r' % __learner_output__",
          expected: 'places: 4',
        },
        {
          id: 't3',
          name: { ar: 'سطر موناش بالسالب صحيح', en: 'The Monash line with its negative latitude' },
          code: "assert 'Monash University -> -37.9152113, 145.134682' in __learner_output__, 'expected: Monash University -> -37.9152113, 145.134682 | actual: %r' % __learner_output__",
          expected: 'Monash University -> -37.9152113, 145.134682',
        },
        {
          id: 't4',
          name: { ar: 'سطر كوكتشاو صحيح', en: 'The Kokshetau line is correct' },
          code: "assert 'Kokshetau -> 53.2833333, 69.3833333' in __learner_output__, 'expected: Kokshetau -> 53.2833333, 69.3833333 | actual: %r' % __learner_output__",
          expected: 'Kokshetau -> 53.2833333, 69.3833333',
        },
        {
          id: 't5',
          name: { ar: 'معرّف المكان الأول مطبوع', en: 'The first place id is printed' },
          code: "assert 'first place id: ChIJ0X6Y1cdw44kRfCQ5p1WHWvA' in __learner_output__, 'expected: first place id: ChIJ0X6Y1cdw44kRfCQ5p1WHWvA | actual: %r' % __learner_output__",
          expected: 'first place id: ChIJ0X6Y1cdw44kRfCQ5p1WHWvA',
        },
      ],
      hints: [
        { ar: 'نفس هَيكَل الفصل الثالث عشر: js = json.loads(payload) ثم place = None وحارس يقارن الحالة قبل أي قراءة.', en: 'Same chapter-thirteen shape: js = json.loads(payload), then place = None and a guard comparing the status before any read.' },
        { ar: 'الاسم الأول: name = r[\'formatted_address\'].split(\',\')[0] — القسمة عند أول فاصلة تُسقط المدينة والرمز البريدي.', en: "First name: name = r['formatted_address'].split(',')[0] — splitting at the first comma drops the city and postal code." },
        { ar: 'الهيكل:\nfor r in place[\'results\']:\n    name = r[\'formatted_address\'].split(\',\')[0]\n    print(\'%s -> %s, %s\' % (name, r[\'lat\'], r[\'lng\']))\nfirst = place[\'results\'][0]\nprint(\'first place id: %s\' % first[\'place_id\'])', en: "The skeleton:\nfor r in place['results']:\n    name = r['formatted_address'].split(',')[0]\n    print('%s -> %s, %s' % (name, r['lat'], r['lng']))\nfirst = place['results'][0]\nprint('first place id: %s' % first['place_id'])" },
        { ar: 'لا تنسَ سطر العد قبل الحلقة: print(\'places: %d\' % len(place[\'results\'])).', en: "Do not forget the count line before the loop: print('places: %d' % len(place['results']))." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-geodata',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import json\njs = json.loads('{\"status\": \"OK\", \"results\": [{\"lat\": 53.2833333, \"lng\": 69.3833333}]}')\nr = js['results'][0]\nprint(js['status'])\nprint(len(js['results']))\nprint(r['lat'] > 0)",
      solution: 'OK\n1\nTrue',
      answer: 'OK\n1\nTrue',
      hints: [
        { ar: 'status مفتاح أعلى — قيمته النصية كما تتهجى الخدمة.', en: 'status is a top-level key — its value is the text exactly as the service spells it.' },
        { ar: 'results قائمة بطول واحد هنا — وlen يعيد طولها.', en: 'results is a list of length one here — len returns its length.' },
        { ar: 'lat عدد 53.28 موجب — فالمقارنة مع الصفر تعطي True.', en: 'lat is the number 53.28, positive — so the comparison with zero yields True.' },
        { ar: 'الخرْج:\nOK\n1\nTrue', en: 'The output:\nOK\n1\nTrue' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-cache',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يخزّن geoload.py كل رد من غوغل في geodata.sqlite قبل الانتقال إلى السطر التالي؟',
        en: 'Why does geoload.py store every reply from Google in geodata.sqlite before moving to the next line?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن النسخة المجانية محدودة الطلبات يوميًّا — فتصير القاعدة ذاكرة مؤقتة: الموجود يُخطَّى في التشغيلات اللاحقة', en: 'Because the free tier caps daily requests — the database becomes a cache: what is stored is skipped on later runs' } },
        { id: 'b', text: { ar: 'لأن SQLite هو من يرسم الخريطة بعد ذلك', en: 'Because SQLite is what draws the map afterwards' } },
        { id: 'c', text: { ar: 'لأن json.loads يرفض النصوص الطويلة فيجب ألا تبقى في الذاكرة', en: 'Because json.loads refuses long texts, so they must not stay in memory' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر خرج الكتاب: أسطر Found in database تُخطَّى بلا اتصال بالشبكة.', en: 'Recall the book\u2019s output: Found in database lines are skipped with no network call.' },
        { ar: 'الحد اليومي للطلبات يعني أن إعادة السؤال عن نفس العنوان هدر.', en: 'A daily request cap means re-asking about the same address is waste.' },
        { ar: 'القاعدة هنا ليست للعرض بل للحفظ بين الجلسات — كما تعلمت في الفصل الخامس عشر.', en: 'The database here is not for display but for keeping data between runs — as you learned in chapter fifteen.' },
        { ar: 'الجواب: أ — ذاكرة مؤقتة تحمي حصة الطلبات اليومية.', en: 'Answer: a — a cache protecting the daily request quota.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-latitude',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة بالإنجليزية: الإحداثي الذي يقيس البُعد شمالًا وجنوبًا عن خط الاستواء ويظهر في رد الخدمة بالمفتاح lat هو ____.',
        en: 'Fill the blank with one English word: the coordinate measuring the distance north and south of the equator, appearing in the reply under the key lat, is ____.',
      },
      answer: 'latitude',
      solution: 'latitude',
      hints: [
        { ar: 'ثمانية أحرف — وتنتهي بـ -tude مثل كلمة attitude.', en: 'Eight letters — ending in -tude like the word attitude.' },
        { ar: 'شقيقه يقيس شرقًا وغربًا ويسمى longitude — وهذا يقيس شمالًا وجنوبًا.', en: 'Its sibling measures east and west and is called longitude — this one measures north and south.' },
        { ar: 'في رد الخدمة يظهر باسم قصير lat — والاسم الكامل هو المطلوب.', en: 'In the reply it appears under the short name lat — the full name is wanted.' },
        { ar: 'الجواب: latitude', en: 'Answer: latitude' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — خدمتك الجغرافية\n# Your playground — your own geo service\n\nimport json\n\npayload = \'{"status": "OK", "results": [{"formatted_address": "Atlantic Ocean", "lat": -15.0, "lng": -30.0, "place_id": "ChIJTEST"}]}\'\n\njs = json.loads(payload)\nplace = None\nif js["status"] == "OK":\n    place = js\n\nif place is None:\n    print("status: error")\nelse:\n    r = place["results"][0]\n    print("%s -> %s, %s" % (r["formatted_address"], r["lat"], r["lng"]))\n    print("north of equator: %s" % (r["lat"] > 0))\n    print("east of Greenwich: %s" % (r["lng"] > 0))\n\n# جرّب: اجعل status ZERO_RESULTS وresults قائمة فارغة — هل يحميك الحارس؟ / try: set status to ZERO_RESULTS with an empty results list — does the guard protect you?\n# جرّب: أضف نتيجة ثانية لعنوان جامعتك واطبعها / try: add a second result for your own university and print it',
      prompt: {
        ar: 'جرّب بنفسك: محيط أطلسي جنوب خط الاستواء وغرب غرينتش — راقب قيمتي bool. ثم مارس تمرين الكتاب: غيّر status إلى ZERO_RESULTS واجعل results قائمة فارغة — هل يُقرأ results[0] أم يحميك الحارس؟ ثم أضف جامعة من بلدك بنتيجة ثانية. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: the Atlantic Ocean is south of the equator and west of Greenwich — watch the two booleans. Then rehearse the book\u2019s exercise: change status to ZERO_RESULTS and empty the results list — does results[0] get read, or does the guard protect you? Then add a university from your country as a second result. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا يرد الترميز الجغرافي من غوغل عند إرسال عنوان نصي؟',
            en: 'What does Google geocoding return when you send a text address?',
          },
          options: [
            { id: 'a', text: { ar: 'أفضل تخمين للمكان: عنوان منسق وخط عرض وخط طول ومعرّف مكان place_id', en: 'Its best guess of the place: a formatted address, latitude, longitude and a place_id' } },
            { id: 'b', text: { ar: 'صورة الخريطة نفسها جاهزة للطباعة', en: 'A ready-to-print image of the map itself' } },
            { id: 'c', text: { ar: 'قائمة بأرقام هواتف الجامعة', en: 'A list of the university\u2019s phone numbers' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الخدمة تُرمّز النص إلى بيانات: formatted_address وlat وlng وplace_id — أما الرسم فيحدث لاحقًا في أداة خارجية.',
            en: 'The service encodes text into data: formatted_address, lat, lng and place_id — the drawing happens later in an external tool.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثالث عشر: لماذا نفحص js[\'status\'] قبل قراءة results؟',
            en: "From chapter 13: why do we check js['status'] before reading results?",
          },
          options: [
            { id: 'a', text: { ar: 'لأن الرد الفاسد قد يأتي بلا نتائج — وعلم None يوجّه البرنامج إلى فرع آمن بدل الانهيار', en: 'Because a bad reply may carry no results — a None flag routes the program to a safe branch instead of crashing' } },
            { id: 'b', text: { ar: 'لأن status يسرّع تحليل JSON', en: 'Because status speeds up JSON parsing' } },
            { id: 'c', text: { ar: 'لأن results مفتاح سري لا يُقرأ إلا بعد الإذن', en: 'Because results is a secret key readable only after permission' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'حارس الحالة سؤال واحد يفصل النجاح عن الفشل: عند غير OK يصير المتغير None فتُطبع رسالة مهذبة — القاعدة التي تدرّبنا عليها طوال الفصل الثالث عشر.',
            en: 'The status guard is one question separating success from failure: on anything but OK the variable becomes None and a polite message prints — the rule drilled through chapter thirteen.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا قسّم الكتاب العمل مرحلتين بدل استدعاء الواجهة عند الحاجة في كل مرة؟',
            en: 'Why did the book split the work into two phases instead of calling the API whenever needed?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الحصة المجانية محدودة يوميًّا: نجمع الردود مرة في قاعدة بيانات ثم نعرض منها مرارًا', en: 'Because the free quota is capped daily: we collect replies once into a database, then display from it repeatedly' } },
            { id: 'b', text: { ar: 'لأن غوغل تمنع تخزين أي بيانات', en: 'Because Google forbids storing any data' } },
            { id: 'c', text: { ar: 'لأن JSON لا يُقرأ إلا بعد يوم كامل', en: 'Because JSON can only be read after a full day' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الترميز الجغرافي بطيء ومحدود — أما العرض فسريع ومتكرر. الفصل بينهما بذاكرة مؤقتة هو نمط مهني ستكرره في كل مشروع بيانات.',
            en: 'Geocoding is slow and capped — display is fast and repeated. Separating them with a cache is the professional pattern you will reuse in every data project.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الخامس عشر: الكتاب يخزّن ردود الخدمة في geodata.sqlite — ما نوع هذا المخزن؟',
            en: 'From chapter 15: the book stores the service replies in geodata.sqlite — what kind of store is this?',
          },
          options: [
            { id: 'a', text: { ar: 'قاعدة بيانات SQL من عائلة SQLite تُقرأ بـ cursor وأوامر SELECT', en: 'A SQL database from the SQLite family, read with a cursor and SELECT statements' } },
            { id: 'b', text: { ar: 'ملف صورة يحمل الخريطة', en: 'An image file holding the map' } },
            { id: 'c', text: { ar: 'قاموس بايثون يُحفظ في المتصفح', en: 'A Python dict saved inside the browser' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كما في الفصل الخامس عشر: SQLite ملف واحد يحمل جداول صفوف — وتصلح كذاكرة مؤقتة لأن تحديثها واستعلامها سريع ومتين بين الجلسات.',
            en: 'As in chapter fifteen: SQLite is a single file holding tables of rows — a fine cache because updates and queries are fast and durable across sessions.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "first = js['results'][0]  # قراءة قبل الفحص",
          right: "place = None\nif js['status'] == 'OK':\n    place = js",
          note: {
            ar: 'أول رد فاسد — status غير OK أو قائمة فارغة — يرمي KeyError أو IndexError ويهدم البرنامج. الحارس بعلم None يحوّل الفشل إلى فرع مطبوع مهذب.',
            en: 'The first bad reply — a status that is not OK or an empty list — throws KeyError or IndexError and wrecks the program. The guard with a None flag turns failure into a polite printed branch.',
          },
        },
        {
          wrong: "print('lat', r['lng'], 'lng', r['lat'])  # تبادل الحقلين",
          right: "print('%s -> %s, %s' % (name, r['lat'], r['lng']))",
          note: {
            ar: 'خط العرض شمال-جنوب وخط الطول شرق-غرب: تبديلهما يضع جامعتك في المحيط. اربط كل حقل بمعناه: lat يتصاعد نحو القطب، وlng نحو الشرق.',
            en: 'Latitude is north-south and longitude is east-west: swapping them drops your university into the ocean. Bind each field to its meaning: lat climbs toward the pole, lng toward the east.',
          },
        },
        {
          wrong: '# استدعاء الواجهة لكل عنوان في كل تشغيل\nfor line in where_data:\n    call_google(line)  # في المنصة: لا شبكة',
          right: '# في المنصة: نضمّن الرد نصيًّا ونقرؤه\npayload = \'{"status": "OK", ...}\'\njs = json.loads(payload)',
          note: {
            ar: 'الواجهة تحتاج شبكة ومفتاحًا لا تملكهما المنصة — والاستدعاء المتكرر يحرق الحصة. نضمّن الرد نصيًّا فنركز على القراءة، وgeodata.sqlite على حاسوبك تحمي الحصة.',
            en: 'The API needs a network and a key the platform does not have — and repeated calls burn the quota. We embed the reply as text and focus on reading; geodata.sqlite on your own computer protects the quota.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الترميز الجغرافي يحول عنوانًا نصيًّا إلى بيانات: formatted_address وlat (شمال-جنوب) وlng (شرق-غرب) وplace_id.', en: 'Geocoding turns a text address into data: formatted_address, lat (north-south), lng (east-west) and place_id.' },
        { ar: 'قراءة الرد مهارة الفصل الثالث عشر: json.loads ثم حارس يقارن status مع OK وعلم None — والسطور تُنسق بـ %s من الفصل السادس.', en: 'Reading the reply is chapter-thirteen skill: json.loads, then a guard comparing status with OK and a None flag — lines formatted with %s from chapter six.' },
        { ar: 'الكتاب يفصل الجمع عن العرض: geoload.py يملأ geodata.sqlite كذاكرة مؤقتة — ونحن نولّد بيانات الرسم هنا والعرض يحدث في أداة خارجية.', en: 'The book separates collection from display: geoload.py fills geodata.sqlite as a cache — and we generate the chart data here while rendering happens in an external tool.' },
      ],
      reflectPrompt: {
        ar: 'لو وصلك رد بـ status تساوي OVER_QUERY_LIMIT — ماذا يطبع قارئك بالضبط؟ اكتب الإجابة قبل التجربة، ثم عدّل الملعب وجرّب. أي خطوة من وصفة الفصل (جمع، تنظيم، عرض) تؤدّيها هذه الحالة؟',
        en: 'If a reply arrived with status OVER_QUERY_LIMIT — what exactly would your reader print? Write the answer before testing, then tweak the sandbox and try. Which step of the chapter\u2019s recipe (collect, organize, display) does this case exercise?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch16.s1', pages: 'ص285 / pp.285' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch16.s1', pages: 'ص285 / pp.285' },
  ],
} satisfies Lesson;

export default lesson;
