import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch14.l4 — "Object Lifecycle and Multiple Objects / دورة حياة الكائن وتعدد الكائنات"
 * Aligned with PY4E ch14 s8 (دورة حياة الكائن) + s9 (تعدد الكائنات).
 * All expression is original.
 * The book's party4.py destructor is taught CONCEPT-ONLY in prose (timing of
 * __del__ is not deterministic in our runtime — never relied upon in any
 * runnable code). Runnable code covers construction timing + party5-style
 * multiple independent instances.
 */
const lesson = {
  id: 'py4e.ch14.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 14,
  title: { ar: 'دورة حياة الكائن وتعدد الكائنات', en: 'Object Lifecycle and Multiple Objects' },
  estimatedMinutes: 17,
  prerequisites: ['py4e.ch14.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'لكل كائن حياة: يولد لحظة بنائه فتعمل شيفرة المنشئ، ويخدم عبر نداءات توابعه، ثم يُهمل حين ينساه برنامجك. اليوم نتابع دورة الحياة هذه كما يعرضها الكتاب: المنشئ __init__ الذي يعمل عند أول استخدام، والهادم الذي ذكره الكتاب — وسنفهم لماذا لا نعتمد عليه في بيئتنا أبدًا. ثم نصل إلى اللحظة التي تتكشف فيها قوة الكائنات: بناء كائنات متعددة من صنف واحد، كل منها بقيم ابتدائية مختلفة وحالة مستقلة تمامًا. بنهاية الدرس ستكون قادرًا على: تتبع لحظة عمل __init__، وشرح ماذا يحدث للكائن عند إعادة إسناد متغيره، وبناء كائنين من صنف واحد بمعاملات مختلفة، وحساب حالة كل كائن يدويًّا سطرًا بسطر.',
        en: 'Every object has a life: it is born the moment it is built so the constructor code runs, it serves through method calls, then it is discarded when your program forgets it. Today we follow this lifecycle as the book presents it: the constructor __init__ that runs at first use, and the destructor the book mentions — and we will understand why we never rely on it in our runtime. Then we reach the moment the power of objects unfurls: building multiple objects from one class, each with different initial values and a fully independent state. By the end of this lesson you will be able to: trace the moment __init__ runs, explain what happens to the object when its variable is reassigned, build two objects from one class with different parameters, and compute each object\u2019s state by hand line by line.',
      },
    },
    {
      kind: 'predict',
      code: "class PartyAnimal:\n    def __init__(self):\n        print('I am constructed')\n        self.x = 0\n\nan = PartyAnimal()\nprint('an built')\nan = 42\nprint('an contains', an)",
      question: {
        ar: 'لاحظ ترتيب الأسطر: متى طُبعت I am constructed بالضبط؟ وماذا يحدث لكائن PartyAnimal عند السطر an = 42؟',
        en: 'Watch the line order: when exactly was I am constructed printed? And what happens to the PartyAnimal object at the line an = 42?',
      },
      reveal: {
        ar: 'طُبعت I am constructed في لحظة البناء نفسها قبل an built — فالبناء يستدعي __init__ فورًا. وعند an = 42 أعيد استخدام المتغير an لتخزين العدد 42، فصار كائن PartyAnimal مُهملًا بلا أحد يشير إليه. في برنامج الكتاب على الحاسوب المكتبي كانت بايثون ستنادي الهادم ليكتب رسالة هدمه — أما هنا فتوقيت الهدم غير مضمون، فلا نعتمد عليه إطلاقًا: البناء وحده هو ما نضبطه ونستخدمه.',
        en: 'I am constructed printed at the very moment of construction, before an built — building calls __init__ immediately. At an = 42 the variable an is reused to store the number 42, leaving the PartyAnimal object discarded with no one pointing to it. In the book\u2019s desktop program Python would have called the destructor to write its farewell — here destructor timing is not guaranteed, so we never depend on it: construction alone is what we control and use.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'دورة الحياة: بناء ثم استخدام ثم إهمال', en: 'The lifecycle: build, use, discard' },
      chunks: [
        {
          ar: 'في الأمثلة السابقة عرّفنا صنفًا — أي قالبًا — واستخدمناه لبناء نموذج منه — أي كائن — ثم استخدمنا هذا الكائن. عندما ينتهي البرنامج تُهمل كل المتغيرات. عادةً لا نفكر كثيرًا في عملية إنشاء وهدم المتغيرات، لكن عندما يصبح كائننا أكثر تعقيدًا نحتاج اتخاذ إجراءات معينة أثناء إنشائه وحذف أشياء عند إهماله.',
          en: 'In the earlier examples we defined a class — a mold — used it to construct an instance of it — an object — and then used that object. When the program ends all variables are discarded. Usually we do not think much about the creation and destruction of variables, but as our object grows more complex we need to take certain actions while creating it and delete things when discarding it.',
        },
          {
          ar: 'إذا أردنا تبيان عمليتي البناء والهدم نضيف توابع خاصة لكائننا: __init__ يستدعيه بايثون لحظة بناء الكائن لضبط القيم الابتدائية، و__del__ يستدعيه عند تدميره. في برنامج الكتاب party4.py: بُني an فطُبع I am constructed، واستُدعي party مرتين فصار العداد 2، ثم جاء an = 42 فتخلصت بايثون من الكائن وأعادت استخدام المتغير — وعلى الحاسوب المكتبي طُبع I am destructed 2 قبل سطر an contains 42.',
          en: 'To mark the build and destroy moments we add special methods to our object: __init__, called by Python when the object is built to set initial values, and __del__, called when it is destroyed. In the book\\u2019s party4.py: an was built printing I am constructed, party was called twice raising the count to 2, then an = 42 arrived so Python discarded the object and reused the variable — and on a desktop machine I am destructed 2 printed before the line an contains 42.',
        },
        {
          ar: 'لكن انتبه لقاعدة بيئتنا الذهبية: توقيت استدعاء __del__ غير مضمون — قد يتأخر أو لا يُستدعى بحسب إدارة الذاكرة، فلا نبني عليه أي منطق ولا ننتظر أي طباعة منه. الكتاب نفسه يختم الدرس بقاعدة أوسع: من الشائع جدًا إضافة التابع الباني للكائن لضبط القيم الابتدائية له، ونادرًا ما نحتاج تابع الهادم. فاجعل قاعدتك: كل الإعداد في __init__، وأي «وداع» يحتاجه منطقك اكتبه تابعًا صريحًا تستدعيه أنت في الوقت الذي تختاره.',
          en: 'But mind our runtime\u2019s golden rule: the timing of __del__ is not guaranteed — it may be delayed or never called depending on memory management, so we build no logic on it and expect no printing from it. The book itself closes the section with a broader rule: it is very common to add the constructor to set initial values, and rarely do we need the destructor. Make it your rule: all setup in __init__, and any farewell your logic needs becomes an explicit method you call at the moment you choose.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تعدد الكائنات: كل كائن بعالمه', en: 'Multiple objects: each in its own world' },
      chunks: [
        {
          ar: 'حتى الآن عرفنا ما هو الصنف وبنينا كائنًا وحيدًا واستخدمناه ثم تخلصنا منه. تظهر القوة الحقيقية للبرمجة كائنية التوجه عندما نبني كائنات متعددة من صنف واحد، حيث نعطي قيمًا ابتدائية مختلفة لكل من الكائنات. وآلية ذلك تمرير البيانات إلى الباني: def __init__(self, nam) يستقبل اسمًا فيخزنه self.name = nam — فيحمل كل كائن اسمه الخاص منذ لحظة ولادته، ويحمل عداده الخاص من الصفر.',
          en: 'Until now we defined what a class is, built a single object, used it and discarded it. The real power of object-oriented programming appears when we build multiple objects from one class, giving each object different initial values. The mechanism is passing data to the constructor: def __init__(self, nam) receives a name and stores it via self.name = nam — so every object carries its own name from the moment of birth, and its own count starting at zero.',
        },
        {
          ar: 'ابنِ s = PartyAnimal(\'Sally\') وj = PartyAnimal(\'Jim\') فتحصل على عالمين مستقلين: عداد s.x وعداد j.x لا يعرف أحدهما عن الآخر شيئًا، ونداء s.party() يرفع عداد Sally وحده بينما يظل عداد Jim كما هو. تتبع الحالة يدويًّا قبل التشغيل: بعد نداءين لـ s ونداء واحد لـ j يكون Sally عند 2 وJim عند 1 — وهذه القابلية للحساب اليدوي هي ما يجعل الكائنات موثوقة عند التنقيح: حالة كل كائن تُقرأ من أسطر بنائه ونداءاته هو وحده.',
          en: "Build s = PartyAnimal('Sally') and j = PartyAnimal('Jim') and you own two independent worlds: s.x and j.x know nothing of each other, and a call to s.party() raises Sally's count alone while Jim's stays put. Trace the state by hand before running: after two calls on s and one on j, Sally sits at 2 and Jim at 1 — and this hand-computability is what makes objects trustworthy when debugging: each object's state is read from its own construction lines and its own calls alone.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'كائنان من قالب واحد: Sally وJim', en: 'Two objects from one mold: Sally and Jim' },
      code: "class PartyAnimal:\n    def __init__(self, nam):\n        self.x = 0\n        self.name = nam\n        print(nam, 'constructed')\n\n    def party(self):\n        self.x = self.x + 1\n        print(self.name, 'party count', self.x)\n\ns = PartyAnimal('Sally')\nj = PartyAnimal('Jim')\ns.party()\nj.party()\ns.party()",
      explanation: {
        ar: 'لحظة PartyAnimal(\'Sally\') عمل المنشئ فخزن العداد صفرًا والاسم وطبع Sally constructed — وكذا Jim بعده مباشرة. النداءات الثلاثة تكشف الاستقلال: Sally party count 1، ثم Jim party count 1، ثم Sally party count 2 — عداد Sally تقدم بينما لم يتأثر عداد Jim. كل سطر في الخرج قابل للحساب اليدوي من أسطر البناء والنداءات وحدها: هذه دورة حياة مضبوطة بلا أي عتمة.',
        en: "The moment PartyAnimal('Sally') ran, the constructor stored the count at zero and the name and printed Sally constructed — and likewise Jim right after. The three calls reveal independence: Sally party count 1, then Jim party count 1, then Sally party count 2 — Sally's count advanced while Jim's was untouched. Every output line is hand-computable from the construction lines and the calls alone: a fully governed lifecycle with no opacity.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.independent-counters',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'عندك صنف Counter يبني كل كائن بعلامة tag وعداد n يبدأ صفرًا، وتابعه tick يرفع n بواحد ويطبع العلامة والعدد معًا. الكائنان a وb مبنيان بالعلامتين red وblue. أكمل آخر الأسطر: استدعِ a.tick() ثم b.tick() ثم a.tick() بالترتيب. المتوقع: red 1 ثم blue 1 ثم red 2.',
        en: 'You have a Counter class that builds each object with a tag and a counter n starting at zero, and its tick method raises n by one and prints the tag and the count together. The two objects a and b are built with the tags red and blue. Complete the last lines: call a.tick(), then b.tick(), then a.tick() in order. Expected: red 1, then blue 1, then red 2.',
      },
      starterCode: "class Counter:\n    def __init__(self, tag):\n        self.tag = tag\n        self.n = 0\n\n    def tick(self):\n        self.n = self.n + 1\n        print(self.tag, self.n)\n\na = Counter('red')\nb = Counter('blue')\n# استدعِ tick على a ثم b ثم a بالترتيب / call tick on a, then b, then a in order\n",
      solution: "class Counter:\n    def __init__(self, tag):\n        self.tag = tag\n        self.n = 0\n\n    def tick(self):\n        self.n = self.n + 1\n        print(self.tag, self.n)\n\na = Counter('red')\nb = Counter('blue')\na.tick()\nb.tick()\na.tick()",
      tests: [
        {
          id: 't1',
          name: { ar: 'عداد a وصل 2', en: 'The counter of a reached 2' },
          code: "assert a.n == 2, 'expected: 2 | actual: %r' % (a.n,)",
          expected: '2',
        },
        {
          id: 't2',
          name: { ar: 'عداد b ما زال 1 — استقلال الحالة', en: 'The counter of b stayed at 1 — independent state' },
          code: "assert b.n == 1, 'expected: 1 | actual: %r' % (b.n,)",
          expected: '1',
        },
        {
          id: 't3',
          name: { ar: 'الأسطر الثلاثة مطبوعة بترتيبها', en: 'The three lines printed in order' },
          code: "assert 'red 1' in __learner_output__ and 'blue 1' in __learner_output__ and 'red 2' in __learner_output__, 'expected: red 1 / blue 1 / red 2 | actual: %r' % __learner_output__",
          expected: 'red 1 / blue 1 / red 2',
        },
      ],
      hints: [
        { ar: 'ثلاثة استدعاءات بالترتيب المطلوب — كل واحد يرفع عداد الكائن الذي استدعى عليه فقط.', en: 'Three calls in the requested order — each raises only the counter of the object it was called on.' },
        { ar: 'a.tick() الأول يرفع a.n من 0 إلى 1، والثاني من 1 إلى 2 — وb.tick() الوحيد يرفع b.n إلى 1.', en: 'The first a.tick() raises a.n from 0 to 1, the second from 1 to 2 — and the single b.tick() raises b.n to 1.' },
        { ar: 'الهيكل:\na.tick()\nb.tick()\na.tick()', en: 'The skeleton:\na.tick()\nb.tick()\na.tick()' },
        { ar: 'الخرج المتوقع: red 1 ثم blue 1 ثم red 2 — تأكد أن العلامات تأتي من self.tag لا نص مجمد.', en: "Expected output: red 1, then blue 1, then red 2 — make sure the tags come from self.tag, not frozen text." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-construction-order',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله. انتبه إلى لحظة عمل المنشئ.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Mind the moment the constructor runs.',
      },
      code: "class Logger:\n    def __init__(self, name):\n        self.name = name\n        print(name, 'ready')\n\n    def ping(self):\n        print('ping', self.name)\n\np = Logger('one')\nq = Logger('two')\np.ping()",
      solution: 'one ready\ntwo ready\nping one',
      answer: 'one ready\ntwo ready\nping one',
      hints: [
        { ar: 'كل بناء يستدعي __init__ فورًا — فترتيب بناء الكائنات هو ترتيب رسائل ready.', en: 'Every construction calls __init__ at once — so the build order is the order of the ready messages.' },
        { ar: 'ping لا تُطبع إلا عند استدعائها — وواحدة فقط استُدعيت.', en: 'ping prints only when called — and only one was called.' },
        { ar: 'الرسالة تأتي من self.name الخاص بكل كائن: one ثم two.', en: 'The message comes from each object\u2019s own self.name: one then two.' },
        { ar: 'الخرْج:\none ready\ntwo ready\nping one', en: 'The output:\none ready\ntwo ready\nping one' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-reassign',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا يحدث لكائن PartyAnimal بعد السطر an = 42؟',
        en: 'What happens to the PartyAnimal object after the line an = 42?',
      },
      options: [
        { id: 'a', text: { ar: 'يصير مُهملًا: المتغير an أصبح يشير إلى العدد 42 — والكائن القديم بلا إشارة إليه', en: 'It becomes discarded: the variable an now points at the number 42 — the old object has nothing pointing to it' } },
        { id: 'b', text: { ar: 'يستبدل محتواه بالعدد 42 ويبقى في مكانه', en: 'Its content is replaced with the number 42 while staying in place' } },
        { id: 'c', text: { ar: 'يبقى حيًّا داخل an إلى نهاية البرنامج', en: 'It stays alive inside an until the end of the program' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكر: المتغير في بايثون اسم يشير إلى كائن — والإسناد الجديد يعيد توجيه الاسم.', en: 'Remember: a variable in Python is a name pointing at an object — a new assignment re-points the name.' },
        { ar: 'العدد 42 ليس كائنًا من صنفنا — فماذا يبقى للكائن القديم من إشارة إليه؟', en: 'The number 42 is not an object of our class — so what reference is left pointing at the old object?' },
        { ar: 'الكائن لا يُفرَّغ داخله: ما حدث هو فقدان آخر إشارة إليه — والهدم شأن بايثون بتوقيت غير مضمون.', en: 'The object is not emptied in place: what happened is the loss of its last reference — destruction is Python\u2019s business on an unguaranteed schedule.' },
        { ar: 'الجواب: أ — أصبح مُهملًا: an يشير إلى 42 والكائن القديم بلا إشارة.', en: 'Answer: a — it becomes discarded: an points at 42 and the old object has nothing pointing to it.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-init',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'التابع الخاص الذي تستدعيه بايثون تلقائيًا لحظة بناء الكائن اسمه __init__ — اكتب اسمه بلا شرطات سفلية: ____',
        en: 'The special method Python calls automatically the moment the object is built is named __init__ — write its name without the underscores: ____',
      },
      answer: 'init',
      solution: 'init',
      hints: [
        { ar: 'هو المنشئ constructor — أول ما يعمل بعد البناء.', en: 'It is the constructor — the first thing to run after building.' },
        { ar: 'فيه نخزن القيم الابتدائية: self.x = 0 وself.name = nam.', en: 'Initial values are stored in it: self.x = 0 and self.name = nam.' },
        { ar: 'شرطتاه السفليتان علامة أنه تابع خاص تُدعى في موعده لا بأيدينا.', en: 'Its double underscores mark it as a special method called at its scheduled moment, not by our hand.' },
        { ar: 'الجواب: init', en: 'Answer: init' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — عالم مستقل لكل كائن\n# Your playground — an independent world per object\n\nclass PartyAnimal:\n    def __init__(self, nam):\n        self.x = 0\n        self.name = nam\n        print(nam, 'constructed')\n\n    def party(self):\n        self.x = self.x + 1\n        print(self.name, 'party count', self.x)\n\ns = PartyAnimal('Sally')\nj = PartyAnimal('Jim')\nz = PartyAnimal('Zoe')\n\ns.party()\nj.party()\ns.party()\nz.party()\nz.party()\n\n# جرّب: اطبع s.x وj.x وz.x — عدّ النداءات يدويًّا أولًا ثم قارن\n# try: print s.x, j.x, z.x — count the calls by hand first, then compare\n# جرّب: أعد إسناد j إلى 42 ثم اطبع s.x — هل تأثر عالم Sally؟\n# try: reassign j to 42 then print s.x — did Sally's world change?",
      prompt: {
        ar: 'جرّب بنفسك: ثلاثة كائنات ونداءات موزعة كما شئت — اكتب على ورقة العدد النهائي لكل كائن قبل التشغيل ثم قارن. ثم أعد إسناد j إلى 42 ولاحظ أن عالمي s وz لم يتزعزعا: الإهمال يخص الكائن المهمل وحده. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: three objects with calls distributed as you like — write each object\u2019s final count on paper before running, then compare. Then reassign j to 42 and notice the worlds of s and z did not wobble: discarding concerns only the discarded object. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الثامن: قائمتان مستقلتان — append على الأولى لا يحرك الثانية. ما نظير ذلك في درسنا؟',
            en: 'From chapter 8: two independent lists — appending to the first never moves the second. What is our lesson\u2019s equivalent?',
          },
          options: [
            { id: 'a', text: { ar: 'كائنان من صنف واحد: tick على a لا يرفع عداد b — كل كائن حالة مستقلة', en: 'Two objects from one class: tick on a never raises the counter of b — each object has an independent state' } },
            { id: 'b', text: { ar: 'كائنان يتشاركان العداد دائمًا تلقائيًا', en: 'Two objects always automatically share one counter' } },
            { id: 'c', text: { ar: 'العداد يخزن في الصنف فيتغير للجميع معًا', en: 'The counter is stored on the class so it changes for everyone together' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الخواص على self تعيش داخل كل كائن كما تعيش عناصر كل قائمة داخل قائمتها — وتعدد الكائنات هو تعدد العوالم، لا تعدد أسماء لعالم واحد.',
            en: 'Properties on self live inside each object as each list\u2019s elements live inside their list — multiple objects means multiple worlds, not multiple names for one world.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كم مرة يعمل __init__ لو بنينا ثلاثة كائنات من صنف واحد؟',
            en: 'How many times does __init__ run if we build three objects from one class?',
          },
          options: [
            { id: 'a', text: { ar: 'ثلاث مرات — مرة لكل كائن لحظة بنائه', en: 'Three times — once per object at the moment of its construction' } },
            { id: 'b', text: { ar: 'مرة واحدة عند تعريف الصنف', en: 'Once, when the class is defined' } },
            { id: 'c', text: { ar: 'لا يعمل إطلاقًا ما لم نستدعه يدويًّا', en: 'Not at all unless we call it manually' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عندما تُنشئ بايثون الكائن تستدعيه — وكل عملية بناء كائن جديد تستدعيه من جديد لضبط قيم ذلك الكائن تحديدًا. ثلاثة بناءات تعني ثلاث ولادات وثلاثة منادي.',
            en: 'When Python creates the object it calls it — and every construction of a new object calls it again to set that specific object\u2019s values. Three constructions mean three births and three summonses.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا لا نعتمد على __del__ في بيئة التشغيل؟',
            en: 'Why do we not rely on __del__ in our runtime?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن توقيت الهدم غير مضمون — فنضع الإعداد في __init__ والوداع في توابع صريحة تستدعى بأنفسنا', en: 'Because destruction timing is unguaranteed — so setup goes in __init__ and farewells become explicit methods we call ourselves' } },
            { id: 'b', text: { ar: 'لأن __del__ محظور في بايثون كلها', en: 'Because __del__ is banned in all of Python' } },
            { id: 'c', text: { ar: 'لأن الهدم يحدث قبل البناء دائمًا', en: 'Because destruction always happens before construction' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قد يتأخر الهدم أو لا يحدث في اللحظة التي تظنها — والكتاب نفسه يقول: الباني شائع جدًّا والهادم نادر الحاجة. كل ما يعتمد عليه منطقك اجعله صريحًا.',
            en: 'Destruction may be delayed or skipped at the moment you assume — and the book itself says: constructors are very common, destructors rarely needed. Anything your logic depends on, make explicit.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'في party4.py بالكتاب: ما ترتيب طباعة الأسطر الأربعة على الحاسوب المكتبي؟',
            en: 'In the book\u2019s party4.py: what is the print order of the four lines on a desktop machine?',
          },
          options: [
            { id: 'a', text: { ar: 'I am constructed ثم So far 1 ثم So far 2 ثم I am destructed 2 — ثم يطبع an contains 42', en: 'I am constructed, then So far 1, then So far 2, then I am destructed 2 — followed by an contains 42' } },
            { id: 'b', text: { ar: 'رسالة الهدم تُطبع أولًا قبل البناء', en: 'The destruction message prints first, before construction' } },
            { id: 'c', text: { ar: 'an contains 42 يطبع قبل So far 1', en: 'an contains 42 prints before So far 1' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'البناء أولًا ثم النداءان ثم الإهمال فيتقدم الهادم — على الحاسوب المكتبي حيث توقيت الهدم مضمون من بايثون المكتبية. أما في بيئتنا فنتتبع البناء والاستخدام فقط ونترك الهدم لبايثون.',
            en: 'Construction first, then the two calls, then the discard lets the destructor speak — on a desktop where destruction timing is guaranteed by stock Python. In our runtime we track construction and usage only, leaving destruction to Python.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "def __del__(self):\n    print('bye', self.name)  # الاعتماد على الهادم",
          right: "def close(self):\n    print('bye', self.name)  # وداع صريح تستدعيه أنت\n# وقبل النهاية: p.close()",
          note: {
            ar: 'توقيت __del__ غير مضمون في بيئات كثيرة فقد لا ترى الطباعة أبدًا — كل ما يعتمد منطقك عليه اجعله تابعًا صريحًا تستدعيه بنفسك، واجعل __init__ موطن الإعداد الوحيد.',
            en: 'The timing of __del__ is unguaranteed in many runtimes — you may never see the print. Anything your logic depends on, make an explicit method you call yourself, and let __init__ be the sole home of setup.',
          },
        },
        {
          wrong: 'a.tick()\na.tick()\nprint(b.n)  # نتوقع 2 على المفاجأة',
          right: 'a.tick()\na.tick()\nprint(a.n)  # 2 — وb.n ما زال 0',
          note: {
            ar: 'لا عداد مشترك بين الكائنات: tick على a يرفع a.n وحدها — وتوقع ارتفاع b عدوان على استقلال الحالة. قاعدة التنقيح: احسب حالة كل كائن من أسطره هو.',
            en: 'No shared counter between objects: tick on a raises a.n alone — expecting b to rise attacks the independence of state. The debugging rule: compute each object\u2019s state from its own lines.',
          },
        },
        {
          wrong: 'an = PartyAnimal()\nan.party()\nan = 42\nan.party()  # أين الكائن؟',
          right: 'an = PartyAnimal()\nan.party()\nkeep = an  # احفظ إشارة أخرى قبل إعادة الإسناد\nan = 42',
          note: {
            ar: 'إعادة إسناد المتغير تهدم إشارتك الوحيدة للكائن — وأي نداء بعدها يرمي AttributeError لأن 42 لا يعرف party. احفظ الكائن في متغير آخر إن كنت تريد البقاء.',
            en: 'Reassigning the variable destroys your only reference to the object — any call afterwards throws AttributeError because 42 knows no party. Keep the object in another variable if you want it to survive.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'دورة حياة الكائن: يُبنى فتُستدعى __init__ مرة واحدة لكل كائن، ويُستخدم عبر نداءات توابعه، ويُهمل حين لا يبقى عليه إشارة.', en: 'The object lifecycle: built so __init__ runs once per object, used through method calls, discarded when nothing points to it anymore.' },
        { ar: 'توقيت الهادم __del__ غير مضمون — الكتاب نفسه يقول: الباني شائع جدًّا والهادم نادر الحاجة. الإعداد في __init__ والوداع في توابع صريحة.', en: 'The destructor __del__ has unguaranteed timing — the book itself says: constructors are very common, destructors rarely needed. Setup in __init__, farewells in explicit methods.' },
        { ar: 'تعدد الكائنات هو القوة الحقيقية: صنف واحد وكائنات كثيرة، لكل منها خواصه المستقلة التي مررت عبر معاملات الباني.', en: 'Multiple objects are the real power: one class, many objects, each with independent properties passed through constructor parameters.' },
      ],
      reflectPrompt: {
        ar: 'ابنِ في الملعب ثلاثة كائنات من PartyAnimal بأسماء مختلفة، ودبّك نداءات party توزيعًا تعرفه أنت فقط. اكتب على ورقة الحالة النهائية لكل كائن قبل التشغيل، ثم شغّل وقارن — هل تطابق حسابك اليدوي الخرج سطرًا بسطر؟',
        en: 'Build three PartyAnimal objects with different names in the sandbox and drive party calls in a distribution only you know. Write each object\u2019s final state on paper before running, then run and compare — does your hand computation match the output line for line?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch14.s8', pages: 'ص244 / pp.244' },
        { book: 'PY4E', section: 'py4e.ch14.s9', pages: 'ص245 / pp.245' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch14.s8', pages: 'ص244 / pp.244' },
    { book: 'PY4E', section: 'py4e.ch14.s9', pages: 'ص245 / pp.245' },
  ],
} satisfies Lesson;

export default lesson;
