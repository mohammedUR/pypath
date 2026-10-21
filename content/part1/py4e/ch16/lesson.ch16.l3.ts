import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch16.l3 — "Link and Node Networks / شبكات الروابط والعقد"
 * Aligned with PY4E ch16 s2 (العرض المرئي للشبكات والارتباطات).
 * All expression is original.
 * SIMULATED-RENDERER design: the book's d3 force layout (spider.json →
 * force.html) is the external renderer; the runnable code computes the DATA:
 * counting each node's degree from an EMBEDDED link list into a dict (ch9
 * get idiom) and finding the most-connected node with the None-flag max.
 */
const lesson = {
  id: 'py4e.ch16.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 16,
  title: { ar: 'شبكات الروابط والعقد', en: 'Link and Node Networks' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch16.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أحد وظائف محرك البحث أن يزحف على جزء صغير من الويب ويكتشف أي الصفحات أكثر ارتباطًا. تطبيق الكتاب الثاني يفعل ذلك: spider.py يزحف ويخزن، وsprank.py يرتب، ثم يكتب spjson.py بيانات الصفحات في spider.json ليرسمها force.html بمكتبة d3 في متصفحك — عقد وروابط تُسحب بالنقر. نحن هنا نحسب مقياس الارتباط نفسه: درجة كل عقدة من قائمة روابط مضمّنة، بقاموس من الفصل التاسع. نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية. بنهاية الدرس ستكون قادرًا على: تعريف العقدة والرابط والدرجة، وحصي درجات العقد بقاموس، وإيجاد العقدة الأكثر اتصالًا.',
        en: 'One job of a search engine is to crawl a small slice of the web and discover which pages are most connected. The book\u2019s second application does it: spider.py crawls and stores, sprank.py ranks, then spjson.py writes the page data into spider.json for force.html to draw with the d3 library in your browser — nodes and links you can drag and click. Here we compute the connectedness measure itself: each node\u2019s degree from an embedded link list, with a chapter-nine dictionary. We generate the chart data here; the rendering happens in an external tool. By the end of this lesson you will be able to: define node, link and degree, count node degrees into a dict, and find the most-connected node.',
      },
    },
    {
      kind: 'predict',
      code: "counts = dict()\nlinks = [('a', 'b'), ('a', 'c')]\nfor a, b in links:\n    counts[a] = counts.get(a, 0) + 1\n    counts[b] = counts.get(b, 0) + 1\nprint(counts)",
      question: {
        ar: 'كل زوج رابط يُحسب لطرفيه. ماذا يطبع السطر الأخير — ولماذا لحظ a ثلاثة؟',
        en: 'Each link pair is counted for both of its ends. What does the last line print — and why does a get three?',
      },
      reveal: {
        ar: "يطبع {'a': 2, 'b': 1, 'c': 1}. الرابط الأول (a, b) أضاف لنقطة a ولنقطة b، والثاني (a, c) أضاف لنقطة a ولنقطة c — فصارت a بدرجة 2. هذه هي درجة العقدة: عدد نهايات الروابط الملامسة لها، ونحصيها بقاموس وأسلوب get من الفصل التاسع.",
        en: "It prints {'a': 2, 'b': 1, 'c': 1}. The first link (a, b) added to a and to b, the second (a, c) added to a and to c — so a lands at degree 2. That is a node\u2019s degree: the number of link ends touching it, counted with a dict and the chapter-nine get idiom.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'العقد والروابط: تشريح الشبكة', en: 'Nodes and links: the web\u2019s anatomy' },
      chunks: [
        {
          ar: 'الشبكة عقد nodes وروابط links: في تطبيق الكتاب كل صفحة ويب عقدة، وكل رابط من صفحة إلى أخرى رابط. spider.py يبدأ من موقع ويطلب عدد الصفحات فيزحف: 1 http://www.dr-chuck.com/ 12 ثم 2 http://www.dr-chuck.com/csev-blog/ 57 — يخزن الصفحات وروابطها في spider.sqlite. تشغيله مرة أخرى يخطّى المحفوظ ويكتشف الجديد فقط، فتنمو الشبكة كل تشغيل. وspdump.py يعرض كل صف: عدد الروابط الجديدة والترتيب القديم والجديد ومعرّف الصفحة ورابطها.',
          en: 'A network is nodes and links: in the book\u2019s application every web page is a node and every link from one page to another is a link. spider.py starts from a site, asks how many pages, then crawls: 1 http://www.dr-chuck.com/ 12 then 2 http://www.dr-chuck.com/csev-blog/ 57 — storing pages and their links in spider.sqlite. Running it again skips what is stored and discovers only new pages, so the network grows run by run. spdump.py shows each row: new-link count, old and new rank, page id and its URL.',
        },
        {
          ar: 'درجة العقدة degree عدد الروابط الملامسة لها — والمقياس الأول لأهمية عقدة: الصفحة التي تشير إليها صفحات كثيرة عقدة مركزية hub. محركات البحث تفكر بعاملين معًا: كم من يشير إليك، ومن هم هم — خوارزمية ترتيب الصفحات لم تُحل هنا كاملة، لكن أساسها العدّ الذي تدربنا عليه.',
          en: 'A node\u2019s degree is the number of links touching it — the first measure of a node\u2019s importance: a page many pages point to is a central hub. Search engines weigh two things together: how many point to you, and who they are — the page-rank algorithm is not fully solved here, but its foundation is the very counting you practiced.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'من spider.json إلى force.html', en: 'From spider.json to force.html' },
      chunks: [
        {
          ar: 'بعد الترتيب، يكتب spjson.py بيانات العقد والروابط الأكثر ارتباطًا في spider.json بصيغة JSON ويطبع: Creating JSON output on spider.json... ثم How many nodes? 30 ثم Open force.html in a browser. يفتح force.html في المتصفح فيُظهر الرسم القوة force layout من مكتبة d3: العقد دوائر يدفعها النقر والسحب، والروابط نوابض تشدها، والنقر المزدوج يكشف الرابط الذي تمثله العقدة. أعد توليد spider.json فتتحدث الصفحة عند تحديثها.',
          en: 'After ranking, spjson.py writes the most-connected nodes and links into spider.json in JSON format and prints: Creating JSON output on spider.json..., then How many nodes? 30, then Open force.html in a browser. Opening force.html shows the d3 force layout: nodes as circles pushed by clicking and dragging, links as springs pulling them, and a double-click reveals the URL a node represents. Regenerate spider.json and the page updates on refresh.',
        },
        {
          ar: 'كل هذا العرض خارج منصتنا: d3 مكتبة JavaScript تعيش في المتصفح. ما نستطيعه — وما يهم — هو توليد بياناته بدقة: قائمة عقد وقائمة روابط، ومنهما الدرجات التي ترسم سمك الدوائر. نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية.',
          en: 'All of that rendering is outside our platform: d3 is a JavaScript library living in the browser. What we can do — and what matters — is generating its data precisely: a list of nodes and a list of links, and from them the degrees that size the circles. We generate the chart data here; the rendering happens in an external tool.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'درجات عقد موقع مصغّر', en: 'Degrees in a miniature site' },
      code: "links = [\n    ('home', 'blog'), ('home', 'resume'), ('home', 'speaking'),\n    ('blog', 'home'), ('resume', 'home'), ('speaking', 'home'),\n    ('blog', 'cv'), ('cv', 'blog'),\n]\ncounts = dict()\nfor a, b in links:\n    counts[a] = counts.get(a, 0) + 1\n    counts[b] = counts.get(b, 0) + 1\n\nfor name in sorted(counts):\n    print('node: %s %d' % (name, counts[name]))\n\nbest = None\nfor name in counts:\n    if best is None or counts[name] > counts[best]:\n        best = name\nprint('hub: %s %d' % (best, counts[best]))\nprint('links: %d' % len(links))",
      explanation: {
        ar: 'خمسة عقد وثمانية روابط: فكّ الحزمة في الحلقة يوزع الزوج على a وb، وكل طرف يحصل على وحدة — فالرابط المتبادل يرفع درجتين معًا. sorted يعيد الأسماء أبجديًّا: blog 4 ثم cv 2 ثم home 6 ثم resume 2 ثم speaking 2. ثم حلقة الأكثر اتصالًا بعلم None من الفصل التاسع: home هو المركز بدرجة 6 لأن كل الصفحات تعود إليه. سطر hub: home 6 هو جوهر ما سيرسمه d3 كأكبر دائرة.',
        en: 'Five nodes and eight links: tuple unpacking in the loop distributes each pair onto a and b, and both ends earn a unit — a reciprocal link lifts two degrees at once. sorted returns names alphabetically: blog 4, then cv 2, then home 6, then resume 2, then speaking 2. Then the most-connected loop with the chapter-nine None flag: home is the hub at degree 6 because every page links back to it. The line hub: home 6 is exactly what d3 would draw as the biggest circle.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.degree-write',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'قائمة الروابط الستة معطاة في المحرر. 1) احسب درجة كل عقدة في قاموس counts بأسلوب get للطرفين. 2) اطبع لكل اسم في sorted(counts) سطر node: %s %d بالاسم والدرجة. 3) أوجد العقدة الأكثر اتصالًا بحلقة علم None واطبع hub: %s %d. المتوقع: node: page1 3 ثم node: page2 3 ثم node: page3 5 ثم node: page4 1 ثم hub: page3 5.',
        en: 'The six-link list is given in the editor. 1) Count each node\u2019s degree into a counts dict with the get idiom for both ends. 2) For each name in sorted(counts) print a node: %s %d line with the name and degree. 3) Find the most-connected node with a None-flag loop and print hub: %s %d. Expected: node: page1 3, then node: page2 3, then node: page3 5, then node: page4 1, then hub: page3 5.',
      },
      starterCode: "links = [\n    ('page1', 'page2'), ('page1', 'page3'), ('page2', 'page3'),\n    ('page3', 'page1'), ('page3', 'page2'), ('page4', 'page3'),\n]\ncounts = dict()\n# 1) احسب درجة كل طرف بـ counts.get(x, 0) + 1\n# 2) اطبع node: %s %d لكل اسم في sorted(counts)\n# 3) حلقة علم None ثم اطبع hub: %s %d\n",
      solution: "links = [\n    ('page1', 'page2'), ('page1', 'page3'), ('page2', 'page3'),\n    ('page3', 'page1'), ('page3', 'page2'), ('page4', 'page3'),\n]\ncounts = dict()\nfor a, b in links:\n    counts[a] = counts.get(a, 0) + 1\n    counts[b] = counts.get(b, 0) + 1\n\nfor name in sorted(counts):\n    print('node: %s %d' % (name, counts[name]))\n\nbest = None\nfor name in counts:\n    if best is None or counts[name] > counts[best]:\n        best = name\nprint('hub: %s %d' % (best, counts[best]))",
      tests: [
        {
          id: 't1',
          name: { ar: 'درجة page3 الصحيحة في القاموس', en: 'The right degree for page3 in the dict' },
          code: "assert counts['page3'] == 5, 'expected: page3 degree 5 | actual: %r' % (counts.get('page3'),)",
          expected: 'page3 degree 5',
        },
        {
          id: 't2',
          name: { ar: 'سطر المركز مطبوع', en: 'The hub line is printed' },
          code: "assert 'hub: page3 5' in __learner_output__, 'expected: hub: page3 5 | actual: %r' % __learner_output__",
          expected: 'hub: page3 5',
        },
        {
          id: 't3',
          name: { ar: 'سطر page3 في التقرير', en: 'The page3 line in the report' },
          code: "assert 'node: page3 5' in __learner_output__, 'expected: node: page3 5 | actual: %r' % __learner_output__",
          expected: 'node: page3 5',
        },
        {
          id: 't4',
          name: { ar: 'العقدة النائية مطبوعة', en: 'The remote node is printed' },
          code: "assert 'node: page4 1' in __learner_output__, 'expected: node: page4 1 | actual: %r' % __learner_output__",
          expected: 'node: page4 1',
        },
        {
          id: 't5',
          name: { ar: 'مجموع الدرجات = ضعف عدد الروابط', en: 'Degrees sum to twice the link count' },
          code: "assert sum(counts.values()) == 12, 'expected: degrees sum 12 | actual: %r' % (sum(counts.values()),)",
          expected: 'degrees sum 12',
        },
      ],
      hints: [
        { ar: 'حلقة واحدة على الروابط تكفي: for a, b in links ثم سطران للحصي — طرف لكل سطر.', en: 'One loop over the links is enough: for a, b in links then two counting lines — one end per line.' },
        { ar: 'المفتاح الجديد يبدأ من الصفر: counts[a] = counts.get(a, 0) + 1 — وكرره لـ b.', en: 'A new key starts from zero: counts[a] = counts.get(a, 0) + 1 — repeat it for b.' },
        { ar: 'الهيكل:\ncounts = dict()\nfor a, b in links:\n    counts[a] = counts.get(a, 0) + 1\n    counts[b] = counts.get(b, 0) + 1\nfor name in sorted(counts):\n    print(\u2019node: %s %d\u2019 % (name, counts[name]))', en: 'The skeleton:\ncounts = dict()\nfor a, b in links:\n    counts[a] = counts.get(a, 0) + 1\n    counts[b] = counts.get(b, 0) + 1\nfor name in sorted(counts):\n    print(\u2019node: %s %d\u2019 % (name, counts[name]))' },
        { ar: 'المركز: best = None ثم حلقة تقارن counts[name] > counts[best] مع حارس best is None — ثم اطبع hub.', en: 'The hub: best = None, then a loop comparing counts[name] > counts[best] guarded by best is None — then print hub.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-degree',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "counts = dict()\npairs = [('a', 'b'), ('b', 'a'), ('c', 'a')]\nfor x, y in pairs:\n    counts[x] = counts.get(x, 0) + 1\n    counts[y] = counts.get(y, 0) + 1\nprint(counts['a'])\nprint(counts['c'])\nprint(len(counts))",
      solution: '3\n1\n3',
      answer: '3\n1\n3',
      hints: [
        { ar: 'تتبع a عبر الأزواج الثلاثة: طرف في الأول، وطرف في الثاني، وطرف في الثالث.', en: 'Trace a across the three pairs: an end in the first, an end in the second, an end in the third.' },
        { ar: 'c طرف واحد فقط في الزوج الأخير.', en: 'c is an end only in the last pair.' },
        { ar: 'len(counts) عدد العقد الظاهرة في القاموس لا مجموع الدرجات.', en: 'len(counts) counts the nodes appearing in the dict, not the sum of degrees.' },
        { ar: 'الخرْج:\n3\n1\n3', en: 'The output:\n3\n1\n3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-degree',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما تعريف درجة العقدة degree في شبكة الصفحات؟',
        en: 'What is the definition of a node\u2019s degree in a page network?',
      },
      options: [
        { id: 'a', text: { ar: 'عدد نهايات الروابط الملامسة للعقدة — أي كم رابطًا يدخلها أو يخرج منها', en: 'The number of link ends touching the node — how many links enter or leave it' } },
        { id: 'b', text: { ar: 'طول عنوان الصفحة URL بالأحرف', en: 'The length of the page URL in characters' } },
        { id: 'c', text: { ar: 'عدد الكلمات في نص الصفحة', en: 'The number of words in the page text' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'في حصياتنا، كل طرف زوج (a, b) أضاف وحدة لعقدة.', en: 'In our counting, every pair end (a, b) added one unit to a node.' },
        { ar: 'العقدة المركزية hub هي صاحبة أعلى درجة — أكثر ما يُشار إليها.', en: 'The hub is the highest-degree node — the most pointed-at.' },
        { ar: 'الدرجة عددٌ نحسبه من قائمة الروابط لا من محتوى الصفحة.', en: 'The degree is a number computed from the link list, not from page content.' },
        { ar: 'الجواب: أ — عدد نهايات الروابط الملامسة للعقدة.', en: 'Answer: a — the number of link ends touching the node.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-degree',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة بالإنجليزية: عدد الروابط الملامسة لعقدة ما يسمى ____ تلك العقدة.',
        en: 'Fill the blank with one English word: the number of links touching a node is called the node\u2019s ____.',
      },
      answer: 'degree',
      solution: 'degree',
      hints: [
        { ar: 'ستة أحرف — وهي كلمة تدرج درجات الحرارة والألقاب الجامعية أيضًا.', en: 'Six letters — the same word used for temperature and university titles.' },
        { ar: 'في الرسم القوي في d3 تصير العقدة صاحبة أعلى ____ أكبر دائرة.', en: 'In the d3 force drawing, the node with the highest ____ becomes the biggest circle.' },
        { ar: 'حصيناها بقاموس: counts[name] تحمل ____ كل عقدة.', en: 'We counted it into a dict: counts[name] holds each node\u2019s ____.' },
        { ar: 'الجواب: degree', en: 'Answer: degree' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — شبكتك الصغيرة\n# Your playground — your own little network\n\nlinks = [\n    (\'home\', \'blog\'), (\'home\', \'resume\'), (\'home\', \'speaking\'),\n    (\'blog\', \'home\'), (\'resume\', \'home\'), (\'speaking\', \'home\'),\n    (\'blog\', \'cv\'), (\'cv\', \'blog\'),\n]\ncounts = dict()\nfor a, b in links:\n    counts[a] = counts.get(a, 0) + 1\n    counts[b] = counts.get(b, 0) + 1\nprint(counts)\n\n# جرّب: أضف رابطًا من cv إلى home — من يرتفع؟ / try: add a link from cv to home — whose degree rises?\n# جرّب: أحسب مجموع الدرجات وقارنه بضعف len(links) / try: sum the degrees and compare with 2 * len(links)\n# جرّب: رابط عقدة لنفسها (\'x\', \'x\') — كم ترفع درجتها؟ / try: a self-link (x, x) — how much does it add?',
      prompt: {
        ar: 'جرّب بنفسك: أضف روابط وراقب أي عقدة تطفو كمركز. ثم تحقق من قاعدة ذكية: مجموع الدرجات يساوي دائمًا ضعف عدد الروابط — لماذا؟ ثم جرّب رابطًا من عقدة إلى نفسها وراقب كيف يضيف وحدتين. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add links and watch which node surfaces as the hub. Then verify a neat rule: the degrees always sum to twice the link count — why? Then try a link from a node to itself and watch it add two. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل التاسع: ما دور الصفر في counts.get(a, 0) + 1؟',
            en: 'From chapter 9: what is the role of the zero in counts.get(a, 0) + 1?',
          },
          options: [
            { id: 'a', text: { ar: 'قيمة افتراضية تعاد حين لا يوجد المفتاح بعد — فلا يرمي KeyError ويبدأ العد من الصفر', en: 'A default returned when the key does not exist yet — no KeyError, and counting starts from zero' } },
            { id: 'b', text: { ar: 'يجعل العد يبدأ من 1 دائمًا', en: 'It makes counting always start from 1' } },
            { id: 'c', text: { ar: 'يحذف المفتاح إن كانت قيمته صفرًا', en: 'It deletes the key if its value is zero' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'get مفتاحه يبدأ بأمانة: عقدة لم تظهر بعد قيمتها صفر — وهذا ما جعل حلقة الدرجات تلمس أي مفتاح جديد بلا حارس إضافي.',
            en: 'get greets new keys honestly: a node not yet seen counts as zero — which let the degree loop touch any fresh key with no extra guard.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الذي ينتجه spjson.py ومن يستهلكه؟',
            en: 'What does spjson.py produce, and who consumes it?',
          },
          options: [
            { id: 'a', text: { ar: 'ملف spider.json بعقد الصفحات وروابطها، يقرؤه force.html في المتصفح ليرسم الشبكة بـ d3', en: 'A spider.json file of page nodes and links, read by force.html in the browser to draw the network with d3' } },
            { id: 'b', text: { ar: 'قاعدة spider.sqlite يقرؤها المتصفح مباشرة', en: 'A spider.sqlite database the browser reads directly' } },
            { id: 'c', text: { ar: 'صورة PNG للشبكة جاهزة', en: 'A ready PNG image of the network' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'النمط نفسه الذي تدربنا عليه: بايثون تولّد ملف بيانات، والمتصفح هو العارض الخارجي — spider.json بيانات وforce.html رسم.',
            en: 'The same pattern we drilled: Python generates a data file, the browser is the external viewer — spider.json is data and force.html is rendering.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ماذا يفعل spider.py عند إعادة تشغيله على الموقع نفسه؟',
            en: 'What does spider.py do when re-run on the same site?',
          },
          options: [
            { id: 'a', text: { ar: 'يخطّى الصفحات المحفوظة في spider.sqlite ويكتشف صفحات جديدة لم تُزحف بعد', en: 'It skips pages already stored in spider.sqlite and discovers new pages not yet crawled' } },
            { id: 'b', text: { ar: 'يمحو القاعدة ويبدأ من الصفر', en: 'It wipes the database and starts from scratch' } },
            { id: 'c', text: { ar: 'يعيد ترتيب الصفحات مباشرة', en: 'It re-ranks the pages right away' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الزحف تراكمي كجمع الإيميلات في الفصل السابق: كل تشغيل ناجح يضيف صفحات جديدة — وsprank.py يأتي بعده ليعيد الترتيب على الأرشيف الأكبر.',
            en: 'Crawling accumulates like the email collection in the previous chapter: every successful run adds new pages — and sprank.py follows to re-rank the bigger archive.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثامن: links قائمة أزواج — ماذا يعيد links[0] وماذا يعيد len(links)؟',
            en: 'From chapter 8: links is a list of pairs — what does links[0] return, and what does len(links) return?',
          },
          options: [
            { id: 'a', text: { ar: 'أول زوج (tuple) كما هو، وعدد الأزواج في القائمة', en: 'The first pair (a tuple) as it is, and the number of pairs in the list' } },
            { id: 'b', text: { ar: 'أول عقدة فقط، وعدد العقد', en: 'Only the first node, and the number of nodes' } },
            { id: 'c', text: { ar: 'سطرًا نصيًّا واحدًا للرابط، وطوله بالأحرف', en: 'One text line for the link, and its character length' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل عنصر قائمة هو زوج كامل مثل (\u2019home\u2019, \u2019blog\u2019) — وفكّ الحزمة for a, b in links هو ما وزّعه على الطرفين في حصياتنا.',
            en: 'Each list element is a whole pair like (\u2019home\u2019, \u2019blog\u2019) — and the unpacking for a, b in links is what split it onto both ends in our counting.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "counts[a] = counts[a] + 1  # مفتاح جديد",
          right: "counts[a] = counts.get(a, 0) + 1",
          note: {
            ar: 'أول ظهور لعقدة يعني مفتاحًا غائبًا: counts[a] على مفتاح جديد يرمي KeyError ويهدم الزحف. get يبدأ الصفر بصمت — عادة الفصل التاسع التي تحمي كل عدّاد.',
            en: 'A node\u2019s first appearance means a missing key: counts[a] on a fresh key throws KeyError and wrecks the crawl. get silently starts from zero — the chapter-nine habit that guards every counter.',
          },
        },
        {
          wrong: "for a, b in links:\n    counts[a] = counts.get(a, 0) + 1  # نسينا b",
          right: "for a, b in links:\n    counts[a] = counts.get(a, 0) + 1\n    counts[b] = counts.get(b, 0) + 1",
          note: {
            ar: 'عدّ طرف واحد يجعل شبكة نصفية: الوجهة تظهر بدرجة صفر وتختفي من التقرير، والمركز يُحسب خطأً. الرابط يلمس عقدتين — فعدّه مرتين.',
            en: 'Counting one end makes a half-network: the destination shows degree zero, vanishes from the report, and the hub comes out wrong. A link touches two nodes — count both.',
          },
        },
        {
          wrong: "# الأكثر اتصالًا = أول مفتاح في القاموس\nbest = list(counts)[0]",
          right: "best = None\nfor name in counts:\n    if best is None or counts[name] > counts[best]:\n        best = name",
          note: {
            ar: 'ترتيب مفاتيح القاموس ترتيب إدخال لا ترتيب أهمية: أول مفتاح ليس المركز بل أول من صادف الحلقة. حلقة المقارنة بعلم None هي الطريقة الموثوقة.',
            en: 'Dict key order is insertion order, not importance order: the first key is not the hub, just whoever showed up first. The comparison loop with a None flag is the trustworthy way.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الشبكة عقد وروابط: صفحة عقدة ورابط بين صفحتين رابط — ودرجة العقدة عدد الروابط الملامسة لها.', en: 'A network is nodes and links: a page is a node, a connection between pages a link — and a node\u2019s degree is the number of links touching it.' },
        { ar: 'حصينا الدرجات بقاموس وأسلوب get من الفصل التاسع للطرفين، وأوجدنا المركز بحلقة علم None — وsorted رتّب التقرير.', en: 'We counted degrees into a dict with the chapter-nine get idiom for both ends, found the hub with a None-flag loop — and sorted ordered the report.' },
        { ar: 'spjson.py يكتب spider.json ليقرؤه force.html بـ d3 في المتصفح — نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية.', en: 'spjson.py writes spider.json for force.html and d3 in the browser — we generate the chart data here; the rendering happens in an external tool.' },
      ],
      reflectPrompt: {
        ar: 'روابط الويب موجهة: من صفحة إلى صفحة. لو عدّت الروابط الداخلة وحدها لصفحة، فكيف يتغير معنى الدرجة؟ وأي عقدة تصير المركز في شبكتنا إن حسبنا الصادرة وحدها؟ اكتب تخمينك ثم جرّبه في الملعب.',
        en: 'Web links are directed: from page to page. If you counted only incoming links for a page, how would the meaning of degree change? And which node becomes the hub in our network if you count outgoing only? Write your guess, then test it in the sandbox.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch16.s2', pages: 'ص288 / pp.288' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch16.s2', pages: 'ص288 / pp.288' },
  ],
} satisfies Lesson;

export default lesson;
