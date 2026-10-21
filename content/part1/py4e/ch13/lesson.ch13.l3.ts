import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch13.l3 — "Looping Over XML Nodes / المرور على عقد XML"
 * Aligned with PY4E ch13 s3 (استخدام الحلقات للمرور على العقد).
 * All expression is original.
 * The book's stuff/users payload is embedded; findall('users/user') path
 * includes the intermediate level — the lesson's core trap.
 */
const lesson = {
  id: 'py4e.ch13.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 13,
  title: { ar: 'المرور على عقد XML', en: 'Looping Over XML Nodes' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch13.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'درس الماضي سأل الشجرة عن عقدة واحدة باسم واحد — لكن خدمات الويب الحقيقية لا ترد بمستخدم واحد: قائمة مستخدمين، وقائمة رسائل، وقائمة أماكن. اليوم نتعلم findall الذي يعيد قائمة كاملة من الأشجار الفرعية، ثم نمر عليها بحلقة for كما مررنا في الفصل الثامن على القوائم. والمفاجأة الحاسمة في المسار: users/user — كل الأجداد يجب أن تُذكر في المسار وإلا عادت قائمة فارغة صامتة. بنهاية الدرس ستكون قادرًا على: استخراج قائمة العقد بـ findall، وقراءة نصوص وسمات كل عقدة داخل الحلقة، وضبط المسار الأبوي كاملًا.',
        en: 'Last lesson asked the tree about a single node by a single name — but real web services never reply with one user: a list of users, a list of messages, a list of places. Today we learn findall, which returns a full list of sub-trees, then loop over it with for exactly as we looped over lists in chapter 8. And the decisive surprise lives in the path: users/user — every ancestor must appear in the path or an empty list comes back in silence. By the end of this lesson you will be able to: extract a list of nodes with findall, read each node\u2019s texts and attributes inside the loop, and get the full parental path right.',
      },
    },
    {
      kind: 'predict',
      code: "import xml.etree.ElementTree as ET\ndata = '<stuff><users><user x=\"2\"><id>001</id></user></users></stuff>'\nstuff = ET.fromstring(data)\nlst = stuff.findall('users/user')\nprint(len(lst))",
      question: {
        ar: 'المستند فيه مستخدم واحد داخل users داخل stuff. كم عنصرًا في القائمة التي أضافها findall؟',
        en: 'The document holds one user inside users inside stuff. How many elements in the list findall returned?',
      },
      reveal: {
        ar: '1. findall(\'users/user\') قرأ المسار خطوة خطوة: انزل إلى users ثم اجمع أبناءه الذين يسمون user — فجمع عقدة واحدة وأعاد قائمة من عنصر واحد. القائمة هي عقد المستخدمين، وكل عنصر فيها شجرة صغيرة كاملة تشبه شجرة person في الدرس الماضي.',
        en: '1. findall(\'users/user\') read the path step by step: descend into users, then gather its children named user — collecting one node and returning a one-element list. The list holds the user nodes, and each element is a whole small tree resembling last lesson\u2019s person tree.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'findall يعيد قائمة أشجار', en: 'findall returns a list of trees' },
      chunks: [
        {
          ar: 'التابع findall(\'users/user\') يبحث ضمن الشجرة عن كل العقد المطابقة للمسار ويعيدها قائمةً من الأشجار الفرعية — نفس نوع find، لكن الكل لا الأول فقط. وبما أنها قائمة، فكل مهارات الفصل الثامن تعمل عليها: len يحصيها، والحلقة for item in lst تمشي عليها عنصرًا عنصرًا، والأقواس [0] و[1] تلتقط عقدًا بعينها. في مثال الكتاب: User count: 2 لأن مستخدمين اثنين، ثم الحلقة تطبع لكل مستخدم نصَي name وid وسمة x.',
          en: 'The method findall(\'users/user\') searches the tree for every node matching the path and returns them as a list of sub-trees — the same kind find returns, but all of them, not just the first. Since it is a list, every chapter-8 skill applies: len counts it, the loop for item in lst walks it element by element, and [0], [1] pick specific nodes. In the book\u2019s example: User count: 2 because there are two users, then the loop prints each user\u2019s name and id texts plus the x attribute.',
        },
        {
          ar: 'داخل الحلقة يكون item شجرة فرعية كاملة لعقدة user واحدة: فـ item.find(\'name\').text يعطي Chuck أو Brent، وitem.get(\'x\') يعطي السمة. وهذا التركيب — قائمة من العقد ثم حلقة أسئلة — هو النمط الذي ستمارسه مع كل خدمة ويب تدخلها: قائمة نتائج، ولكل نتيجة حقولها.',
          en: 'Inside the loop, item is a whole sub-tree of one user node: item.find(\'name\').text yields Chuck or Brent, and item.get(\'x\') yields the attribute. This composition — a list of nodes, then a loop of questions — is the pattern you will practice on every web service you meet: a list of results, each with its own fields.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المسار يجب أن يكتمل', en: 'The path must be complete' },
      chunks: [
        {
          ar: 'أخطر فخ في findall هو المسار الناقص: findall(\'user\') لا يجد شيئًا رغم أن المستخدمين أمامنا في الشاشة! السبب أن البحث يتم ضمن الأبناء المباشرين لكل مستوى في المسار: عناصر user ليست أبناء الجذر stuff مباشرة، بل أبناء users. لذلك يلزم كتابة كل العناصر الأبوية — باستثناء المستوى الأول الأعلى — داخل المسار: users/user. والكتاب يعرض المقارنة بصرامة: findall(\'users/user\') تجيب 2 وfindall(\'user\') تجيب 0.',
          en: 'The deadliest findall trap is the incomplete path: findall(\'user\') finds nothing even though the users are right there on screen! The reason: the search runs among the direct children of each level in the path — user elements are not direct children of the root stuff, they are children of users. So every ancestor level — except the very top — must be written into the path: users/user. The book stages the comparison starkly: findall(\'users/user\') answers 2 and findall(\'user\') answers 0.',
        },
        {
          ar: 'تفصيلة إضافية من الكتاب: المتغير الذي يحمل نص XML سمّاه input — لكن هذا يطغى على التابع المضمّن input() فتسمّيه هنا input_data. قاعدة عامة: لا تسمِّ متغيراتك بأسماء التوابع المضمنة، فالطغيان صامت وتأثيره بعيد.',
          en: 'One more detail from the book: the variable holding the XML text is named input there — but that shadows the built-in input(), so here we call it input_data. General rule: never name your variables after built-in functions — shadowing is silent and its reach is long.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'برنامج الكتاب: المرور على المستخدمين', en: 'The book\u2019s program: walking the users' },
      code: "import xml.etree.ElementTree as ET\n\ninput_data = '''\n<stuff>\n   <users>\n      <user x=\"2\">\n         <id>001</id>\n         <name>Chuck</name>\n      </user>\n      <user x=\"7\">\n         <id>009</id>\n         <name>Brent</name>\n      </user>\n   </users>\n</stuff>'''\n\nstuff = ET.fromstring(input_data)\nlst = stuff.findall('users/user')\nprint('User count:', len(lst))\nfor item in lst:\n    print('Name', item.find('name').text)\n    print('Id', item.find('id').text)\n    print('Attribute', item.get('x'))",
      explanation: {
        ar: 'findall(\'users/user\') أعاد قائمة عقدتي user، وطبع العد User count: 2. ثم حلقة الفصل الثامن تمشت على القائمة: كل item شجرة مستخدم واحد، فسألناها ثلاثة أسئلة — نص name ثم نص id ثم سمة x. الخرْج مطابق لخرج الكتاب: User count: 2 ثم Name Chuck / Id 001 / Attribute 2 ثم Name Brent / Id 009 / Attribute 7. لاحظ أن سطر المستند المبطّن لم يفسد شيئًا: نصوص id وname محصورة بين وسومها في سطر واحد.',
        en: "findall('users/user') returned the list of the two user nodes, and we printed User count: 2. Then the chapter-8 loop walked the list: each item is one user\u2019s tree, and we asked it three questions — the name text, the id text, the x attribute. The output matches the book\u2019s: User count: 2, then Name Chuck / Id 001 / Attribute 2, then Name Brent / Id 009 / Attribute 7. Notice the indented document broke nothing: id and name texts sit between their tags on a single line.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.loop-users',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'مستند stuff مضمّن في المحرر بمستخدمين. استخرج lst بـ findall بالمسار الكامل، واطبع User count: مع عدد العناصر بـ len، ثم ابنِ قائمة names فارغة واملأها بحلقة for بأسماء المستخدمين من item.find(\'name\').text، ثم اطبع names. المتوقع: User count: 2 ثم [\'Chuck\', \'Brent\'].',
        en: "The stuff document is embedded in the editor with two users. Extract lst with findall using the full path, print User count: followed by len(lst), then build an empty names list, fill it with a for loop reading each user's name via item.find('name').text, and print names. Expected: User count: 2 then ['Chuck', 'Brent'].",
      },
      starterCode: "import xml.etree.ElementTree as ET\n\ninput_data = '''\n<stuff>\n   <users>\n      <user x=\"2\">\n         <id>001</id>\n         <name>Chuck</name>\n      </user>\n      <user x=\"7\">\n         <id>009</id>\n         <name>Brent</name>\n      </user>\n   </users>\n</stuff>'''\n\nstuff = ET.fromstring(input_data)\n# lst ثم الحلقة ثم names / lst, then the loop, then names\n",
      solution: "import xml.etree.ElementTree as ET\n\ninput_data = '''\n<stuff>\n   <users>\n      <user x=\"2\">\n         <id>001</id>\n         <name>Chuck</name>\n      </user>\n      <user x=\"7\">\n         <id>009</id>\n         <name>Brent</name>\n      </user>\n   </users>\n</stuff>'''\n\nstuff = ET.fromstring(input_data)\nlst = stuff.findall('users/user')\nprint('User count:', len(lst))\nnames = list()\nfor item in lst:\n    names.append(item.find('name').text)\nprint(names)",
      tests: [
        {
          id: 't1',
          name: { ar: 'القائمة فيها عقدتان', en: 'The list holds two nodes' },
          code: "assert len(lst) == 2, 'expected: 2 nodes | actual: %r' % (len(lst),)",
          expected: '2 nodes',
        },
        {
          id: 't2',
          name: { ar: 'الأسماء جمعت بالترتيب', en: 'The names were collected in order' },
          code: "assert names == ['Chuck', 'Brent'], \"expected: ['Chuck', 'Brent'] | actual: %r\" % (names,)",
          expected: "['Chuck', 'Brent']",
        },
        {
          id: 't3',
          name: { ar: 'العد مطبوع بصيغة الكتاب', en: 'The count printed in the book\u2019s format' },
          code: "assert 'User count: 2' in __learner_output__, 'expected: User count: 2 | actual: %r' % __learner_output__",
          expected: 'User count: 2',
        },
        {
          id: 't4',
          name: { ar: 'قائمة الأسماء مطبوعة', en: 'The names list printed' },
          code: "assert \"['Chuck', 'Brent']\" in __learner_output__, \"expected: ['Chuck', 'Brent'] | actual: %r\" % __learner_output__",
          expected: "['Chuck', 'Brent']",
        },
      ],
      hints: [
        { ar: 'المسار الكامل يذكر الأب users: stuff.findall(\'users/user\') — لا stuff.findall(\'user\').', en: "The full path names the parent: stuff.findall('users/user') — not stuff.findall('user')." },
        { ar: 'العد بصيغة الكتاب: print(\'User count:\', len(lst)) — الفاصلة تضيف فراغًا واحدًا.', en: "The count in the book's format: print('User count:', len(lst)) — the comma adds one space." },
        { ar: 'الهيكل:\nlst = stuff.findall(\'users/user\')\nprint(\'User count:\', len(lst))\nnames = list()\nfor item in lst:\n    names.append(item.find(\'name\').text)\nprint(names)', en: "The skeleton:\nlst = stuff.findall('users/user')\nprint('User count:', len(lst))\nnames = list()\nfor item in lst:\n    names.append(item.find('name').text)\nprint(names)" },
        { ar: "lst = stuff.findall('users/user')\nprint('User count:', len(lst))\nnames = list()\nfor item in lst:\n    names.append(item.find('name').text)\nprint(names)", en: "lst = stuff.findall('users/user')\nprint('User count:', len(lst))\nnames = list()\nfor item in lst:\n    names.append(item.find('name').text)\nprint(names)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-path',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import xml.etree.ElementTree as ET\ndata = '<stuff><users><user x=\"2\"><id>001</id></user><user x=\"9\"><id>003</id></user></users></stuff>'\nstuff = ET.fromstring(data)\nlst = stuff.findall('users/user')\nprint(len(lst))\nprint(len(stuff.findall('user')))\nprint(lst[1].get('x'))",
      solution: '2\n0\n9',
      answer: '2\n0\n9',
      hints: [
        { ar: 'المسار الأول كامل: users/user — كم عقدة user جمعت؟', en: 'The first path is complete: users/user — how many user nodes gathered?' },
        { ar: 'المسار الثاني ناقص: user ليست ابنة الجذر مباشرة — ماذا يعيد findall حين لا يجد؟', en: 'The second path is incomplete: user is not a direct child of the root — what does findall return when it finds nothing?' },
        { ar: 'lst[1] هي عقدة المستخدم الثاني — سمة x عندها "9".', en: 'lst[1] is the second user\u2019s node — its x attribute is "9".' },
        { ar: 'الخرْج:\n2\n0\n9', en: 'The output:\n2\n0\n9' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-path',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يعيد stuff.findall(\'user\') قائمة فارغة بينما findall(\'users/user\') يعيد العقدتين؟',
        en: "Why does stuff.findall('user') return an empty list while findall('users/user') returns the two nodes?",
      },
      options: [
        { id: 'a', text: { ar: 'لأن البحث يجري ضمن الأبناء المباشرين في كل مستوى من المسار — وuser أبناء users لا أبناء الجذر', en: 'Because the search runs among the direct children of each path level — user nodes are children of users, not of the root' } },
        { id: 'b', text: { ar: 'لأن findall يقبل وسمًا واحدًا فقط في المسار', en: 'Because findall only accepts a single tag in its path' } },
        { id: 'c', text: { ar: 'لأن عناصر user مكررة فيستحيل جمعها بلا مسار', en: 'Because user elements are duplicated and cannot be gathered without a path' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'البحث يجري ضمن الأبناء المباشرين لكل مستوى من المسار — لا في الشجرة كلها دفعة واحدة.', en: 'The search runs among the direct children of each path level — not across the whole tree at once.' },
        { ar: 'عناصر user ليست أبناء الجذر stuff مباشرة — من هو أبها؟', en: 'The user elements are not direct children of the root stuff — who is their parent?' },
        { ar: 'الكتاب يعرض المقارنة بصرامة: findall(\'users/user\') تجيب 2 وfindall(\'user\') تجيب 0.', en: "The book stages the comparison starkly: findall('users/user') answers 2 and findall('user') answers 0." },
        { ar: 'الجواب: أ — ضمّن كل العناصر الأبوية في المسار باستثناء المستوى الرئيس الأول.', en: 'Answer: a — include every ancestor level in the path except the top-most.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-findall',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'التابع الذي يعيد قائمة من كل العقد المطابقة لمسار في شجرة XML هو ____(\'users/user\')',
        en: 'The method that returns a list of every node matching a path in an XML tree is ____(\'users/user\')',
      },
      answer: 'findall',
      solution: 'findall',
      hints: [
        { ar: 'find يعيد أول عقدة — وهذا يعيد الكل.', en: 'find returns the first node — this one returns all of them.' },
        { ar: 'كلمة واحدة: find + all.', en: 'One word: find + all.' },
        { ar: 'نستدعيه على عقدة الجذر: stuff.____(\'users/user\').', en: "We call it on the root node: stuff.____('users/user')." },
        { ar: 'الجواب: findall', en: 'Answer: findall' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — أضف مستخدمًا ثالثًا\n# Your playground — add a third user\n\nimport xml.etree.ElementTree as ET\n\ninput_data = """\n<stuff>\n   <users>\n      <user x="2">\n         <id>001</id>\n         <name>Chuck</name>\n      </user>\n      <user x="7">\n         <id>009</id>\n         <name>Brent</name>\n      </user>\n   </users>\n</stuff>"""\n\nstuff = ET.fromstring(input_data)\n\nfor item in stuff.findall("users/user"):\n    print(item.find("name").text, item.get("x"))\n\nprint(len(stuff.findall("user")))\n\n# جرّب: أضف <user x="11"> مع id وname ثم أعد العدّ / try: add <user x="11"> with id and name, then recount',
      prompt: {
        ar: 'جرّب بنفسك: أضف مستخدمًا ثالثًا x="11" بعقدتي id وname، وأعد العد والحلقة. ثم قارن findall(\'users/user\') بـ findall(\'user\') بطوليهما. وأخيرًا جرّب item.find(\'phone\') على مستخدم بلا هاتف لترى ماذا يعيد. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: add a third user x=\"11\" with id and name nodes, then recount and re-loop. Compare len of findall('users/user') against findall('user'). Finally try item.find('phone') on a user with no phone and see what it returns. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا يختلف find عن findall في شجرة XML؟',
            en: 'How does find differ from findall on an XML tree?',
          },
          options: [
            { id: 'a', text: { ar: 'find يعيد أول عقدة مطابقة، وfindall يعيد قائمة بكل المطابقات', en: 'find returns the first matching node, findall returns a list of every match' } },
            { id: 'b', text: { ar: 'find يعمل على السلاسل فقط، وfindall على الأشجار', en: 'find works on strings only, findall on trees' } },
            { id: 'c', text: { ar: 'findall يرمي خطأ إن لم يجد شيئًا', en: 'findall throws an error when it finds nothing' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كلاهما يمشي على المسار نفسه، لكن find يقف عند أول عقدة وfindall يجمع الكل في قائمة — وحين لا يجد شيئًا يعيد قائمة فارغة بلا أي خطأ.',
            en: 'Both walk the same path, but find stops at the first node while findall gathers them all into a list — and on a miss it returns an empty list with no error.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثامن: findall أعاد قائمة — أي العمليات ممنوعة عليها؟',
            en: 'From chapter 8: findall returned a list — which operation is forbidden on it?',
          },
          options: [
            { id: 'a', text: { ar: 'lst = lst + 5 — جمع قائمة مع عدد', en: 'lst = lst + 5 — adding a number to a list' } },
            { id: 'b', text: { ar: 'len(lst) وlst[0] والحلقة عليها', en: 'len(lst), lst[0], and looping over it' } },
            { id: 'c', text: { ar: 'lst.append(item) — إلحاق عقدة جديدة', en: 'lst.append(item) — appending a new node' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القوائم تجمع قوائم بـ + وتطيع len والفهرسة والتكرار والإلحاق — لكن الجمع مع عدد غير قائمة يرمي TypeError، من قواعد الفصل الثامن حرفيًّا.',
            en: 'Lists concatenate with + to lists, and obey len, indexing, looping and appending — but adding a bare number throws TypeError, straight from chapter 8.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في حلقة الكتاب: ما الفرق بين item.find(\'id\').text وitem.get(\'x\')؟',
            en: "In the book's loop: what is the difference between item.find('id').text and item.get('x')?",
          },
          options: [
            { id: 'a', text: { ar: 'الأولى تسأل عن ابن اسمه id وتقرأ نصه، والثانية تسأل العقدة عن سمة x من وسم الافتتاح', en: 'The first asks for a child named id and reads its text; the second asks the node itself for the x attribute from its opening tag' } },
            { id: 'b', text: { ar: 'الأولى للسمات والثانية للنصوص', en: 'The first reads attributes, the second reads texts' } },
            { id: 'c', text: { ar: 'لا فرق — كلاهما يقرأ id', en: 'No difference — both read id' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'البنية نفسها من الدرس الماضي لكن على كل عنصر من القائمة: find يبحث في الأبناء وget يقرأ السمات — وitem شجرة كاملة بحد ذاتها.',
            en: 'The same structure from last lesson, applied to every element of the list: find searches the children and get reads the attributes — and item is a full tree in its own right.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الخامس: في for item in lst: — كم دورة تنفذ إذا أعاد findall ثلاث عقد، وما اسم item؟',
            en: 'From chapter 5: in for item in lst: — how many passes run if findall returned three nodes, and what is item called?',
          },
          options: [
            { id: 'a', text: { ar: 'ثلاث دورات — وitem متغير التكرار يحمل شجرة كل دورة', en: 'Three passes — and item is the iteration variable holding one tree per pass' } },
            { id: 'b', text: { ar: 'دورة واحدة تحمل القائمة كاملة', en: 'One pass holding the whole list' } },
            { id: 'c', text: { ar: 'ست دورات — دورة لكل عقدة وأخرى للعد', en: 'Six passes — one per node plus one for counting' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الحلقة المحددة من الفصل الخامس: دورة لكل عنصر في القائمة — ومتغير التكرار item يتقمص شجرة عقدة واحدة في كل دورة ليُسأل عن حقولها.',
            en: 'The definite loop from chapter 5: one pass per element of the list — the iteration variable item dons one node\u2019s tree per pass, ready to be asked about its fields.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "lst = stuff.findall('user')\nprint(len(lst))  # 0 على المفاجأة",
          right: "lst = stuff.findall('users/user')\nprint(len(lst))  # 2",
          note: {
            ar: 'المسار الناقص أخطر عيوب findall: لا خطأ ولا استثناء — فقط قائمة فارغة صامتة. ضمّن كل الأجداد إلا الجذر: users/user.',
            en: 'The incomplete path is the deadliest findall flaw: no error, no exception — just a silent empty list. Include every ancestor except the root: users/user.',
          },
        },
        {
          wrong: "for item in lst:\n    print(item.find('name'))",
          right: "for item in lst:\n    print(item.find('name').text)",
          note: {
            ar: 'find يعيد عقدة Element لا سلسلة — وطباعتها تخرج تمثيل الكائن <Element name...> لا Chuck. النص يتطلبه .text في نهاية السلسلة.',
            en: "find returns an Element node, not a string — printing it emits the object repr <Element name...>, not Chuck. The text needs .text at the end of the chain.",
          },
        },
        {
          wrong: "input = '<stuff>...</stuff>'  # طغيان على التابع المضمّن",
          right: "input_data = '<stuff>...</stuff>'",
          note: {
            ar: 'تسمية المتغير input تطغى على التابع المضمّن input() — وطغيان الأسماء صامت. هذا أيضًا سبب تسميتنا input_data هنا بدل اسم الكتاب الأصلي.',
            en: 'Naming a variable input shadows the built-in input() — and shadowing is silent. That is also why we name it input_data here instead of the book\u2019s original name.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'findall(\'users/user\') يعيد قائمة أشجار فرعية — والقوائم من الفصل الثامن تطيع len والحلقات والفهارس عليها.', en: "findall('users/user') returns a list of sub-trees — and chapter-8 lists obey len, loops and indexing on it." },
        { ar: 'داخل الحلقة كل item شجرة كاملة: find(\'name\').text للنص وget(\'x\') للسمة.', en: "Inside the loop each item is a full tree: find('name').text for text and get('x') for the attribute." },
        { ar: 'المسار يذكر كل الأجداد إلا الجذر — وإلا جاءت القائمة فارغة صامتة: User count: 0.', en: 'The path names every ancestor except the root — or the list comes back silently empty: User count: 0.' },
      ],
      reflectPrompt: {
        ar: 'خدمة ترد بمستند فيه <messages> تحوي عشر <message> كلٌّ فيها <sender> و<body>. اكتب المسار الذي يجمّع الرسائل، وسطري الحلقة الذي يطبع مرسل كل رسالة — قبل أن تفتح الدرس القادم.',
        en: 'A service replies with a document holding <messages> with ten <message> nodes, each containing <sender> and <body>. Write the path that gathers the messages and the two loop lines printing each sender — before opening the next lesson.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch13.s3', pages: 'ص215 / pp.215' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch13.s3', pages: 'ص215 / pp.215' },
  ],
} satisfies Lesson;

export default lesson;
