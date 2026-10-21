import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch14.l6 — "Chapter 14 Review and Project: The Objects Team /
 * مراجعة الفصل 14 ومشروع: فريق الكائنات"
 * Aligned with PY4E ch14 s11 (ملخص) + s12 (فهرس المصطلحات).
 * All expression is original.
 * Project: a SELF-CONTAINED Team class (__init__ storing name + a FRESH list,
 * add_player growing the list, describe printing 'team: %s' / 'players: %d')
 * plus a Coach(Team) subclass adding lead(). Two instances with independent
 * states. Debug block: players defined as a CLASS attribute — runs fine but
 * players leak between two teams (silent wrong value) → fix moves the list
 * into __init__. Quiz: 6 items incl. ch4/ch6/ch8/ch9 revisits.
 */
const lesson = {
  id: 'py4e.ch14.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 14,
  title: { ar: 'مراجعة الفصل 14 ومشروع: فريق الكائنات', en: 'Chapter 14 Review and Project: The Objects Team' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch14.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'يغلق الفصل الرابع عشر على الأسلوب الذي بُنيت به برامج الملايين من الأسطر: الكائنات. مررنا بخمس محطات: لماذا نحتاج الكائنات في إدارة البرامج الكبيرة، وقالبنا الأول class PartyAnimal، والمنشئ __init__ وخواص self، ودورة الحياة وتعدد الكائنات، ثم الوراثة وعلاقة is-a. اليوم مراجعة شاملة وفهرس المصطلحات ومشروع الختام: فريق الكائنات — صنف Team يبني كل كائن باسمه وقائمة لاعبيه الخاصة، تنمو القائمة بكل إضافة، ثم يصف الفريق نفسه بسطرين منسقين، وصنف Coach يرثه كله ويضيف صفته. وفي قلب الدرس: خلل صامت حقيقي — قائمة تُعرَّف في المكان الخطأ فتتسرب اللاعبون بين الفرق. بنهاية الدرس ستكون قادرًا على: استرجاع مصطلحات الفصل كاملة، وبناء عائلة أصناف من أب وابن، وتنقيح تسرب الحالة بين الكائنات.',
        en: 'Chapter 14 closes on the approach behind million-line programs: objects. We passed five stations: why objects for managing big programs, our first mold class PartyAnimal, the constructor __init__ and self\u2019s properties, the lifecycle and multiple objects, then inheritance and the is-a relationship. Today is a full review, the glossary, and the closing project: the Objects Team — a Team class builds each object with its own name and its own list of players, the list grows with every addition, the team describes itself in two formatted lines, and a Coach class inherits all of it and adds its own voice. At the heart of the lesson: a real silent flaw — a list defined in the wrong place lets players leak between teams. By the end of this lesson you will be able to: retrieve the chapter\u2019s full glossary, build a family of parent and child classes, and debug state leaking between objects.',
      },
    },
    {
      kind: 'predict',
      code: "class Team:\n    def __init__(self, nam):\n        self.name = nam\n        self.players = list()\n\n    def add_player(self, player):\n        self.players.append(player)\n\nred = Team('red')\nred.add_player('ana')\nred.add_player('bo')\nprint('team: %s' % red.name)\nprint('players: %d' % len(red.players))",
      question: {
        ar: 'هذا قلب مشروع اليوم. قائمة players بُنيت في المنشئ عبر list() — ماذا سيطبع السطران الأخيران بعد إضافة لاعبين اثنين؟',
        en: 'This is the heart of today\u2019s project. The players list was built in the constructor via list() — what will the last two lines print after adding two players?',
      },
      reveal: {
        ar: 'team: red ثم players: 2. المنشئ أبقى لكل فريق اسمه وقائمة خاصة به، وappend تنمو بها في مكانها، وlen يعيد طولها في التنسيق. كل ذلك في سبعة أسطر — والدرس كله خلف هذه السبعة.',
        en: 'team: red then players: 2. The constructor gave each team its name and its own list, append grew it in place, and len reported its length inside the format. All of that in seven lines — the whole lesson stands behind those seven.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل ومصطلحاته', en: 'The chapter map and its glossary' },
      chunks: [
        {
          ar: 'خريطة الفصل بخمسة مسارات: الأول الدافع — البرامج الكبيرة تُقسم إلى قطع تركز فيها وتتجاهل ما سواها، وأنت كنت تستخدم كائنات جاهزة منذ الفصول الأولى بـ append وupper وstrip. الثاني أول صنف: class قالب والكائن كعكة منه، والتوابع دوال داخل القالب يستقبل معاملها الأول الكائن نفسه. الثالث المنشئ __init__ يخزن خواص كل كائن عليه: self.name = nam — وصنفك صار نوعًا جديدًا يجيب عن type. الرابع دورة الحياة: بناء عند أول استخدام وإهمال عند فقد الإشارة — والهادم نادر الاحتياج وتوقيته غير مضمون. الخامس الوراثة: CricketFan(PartyAnimal) يمدد ويجاوز وsuper() يستدعي الأب.',
          en: 'The chapter\u2019s map has five routes: first the motive — big programs split into pieces you focus on, ignoring the rest, and you were using ready-made objects since the early chapters with append, upper and strip. Second, the first class: class is a mold and the object a cake from it, methods are functions inside the mold whose first parameter receives the object itself. Third, the constructor __init__ stores each object\u2019s properties on it: self.name = nam — and your class became a new type answering type. Fourth, the lifecycle: construction at first use and discarding when the reference is lost — the destructor rarely needed with unguaranteed timing. Fifth, inheritance: CricketFan(PartyAnimal) extends and overrides while super() summons the parent.',
        },
        {
          ar: 'فهرس المصطلحات كما جمعه الفصل: الصنف class قالب يحدد البيانات والشيفرة لبناء الكائنات؛ والكائن object نموذج حي من الصنف يحمل بياناته وتوابعه؛ والنسخة instance كائن منبثق من صنف — an نسخة من PartyAnimal؛ والخاصية attribute عنصر بيانات جزء من الكائن مثل x وname؛ والتابع method دالة تنتمي للكائن وتستدعى بالصيغة an.party().',
          en: 'The glossary as the chapter assembled it: the class is the template defining the data and code objects are built from; the object is a living instance of the class carrying its data and methods; an instance is an object sprung from a class — an is an instance of PartyAnimal; an attribute is a piece of data that is part of the object like x and name; and a method is a function belonging to the object, called in the form an.party().',
        },
        {
          ar: 'ويكمل الفهرس: المنشئ constructor التابع الخاص __init__ الذي تستدعيه بايثون عند بناء كل كائن لضبط قيمه الابتدائية؛ والهادم destructor التابع __del__ المستدعى عند التدمير — مفهوم نعرفه ولا نعتمد عليه؛ والوراثة inheritance قدرة صنف على البناء فوق صنف آخر فيمدد سلوكه أو يجاوزه؛ وself المعامل الأول في كل تابع يشير إلى الكائن نفسه. هذه المصطلحات الثمانية قاموس الفصل كاملًا — والمشروع التالي يختبرها في العمل لا في الحفظ.',
          en: 'And the glossary continues: the constructor is the special method __init__ Python calls when each object is built to set its initial values; the destructor is __del__, called at destruction — a concept we know but never depend on; inheritance is a class\u2019s ability to build on another class, extending or overriding its behavior; and self is the first parameter of every method referring to the object itself. These eight terms are the chapter\u2019s whole dictionary — and the project ahead tests them in action, not in memorization.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تجاوز في العائلة: LoudTeam', en: 'An override in the family: LoudTeam' },
      code: "class Team:\n    def __init__(self, nam):\n        self.name = nam\n        self.players = list()\n\n    def add_player(self, player):\n        self.players.append(player)\n\n    def describe(self):\n        print('team: %s' % self.name)\n        print('players: %d' % len(self.players))\n\n\nclass LoudTeam(Team):\n    def describe(self):\n        print('LOUD team: %s' % self.name.upper())\n        print('players: %d' % len(self.players))\n\n\ngreen = Team('green')\ngreen.add_player('ana')\ngreen.add_player('bo')\ngreen.describe()\n\ngold = LoudTeam('gold')\ngold.add_player('cy')\ngold.describe()\nprint(isinstance(gold, Team))",
      explanation: {
        ar: 'صنف Team يبني كل فريق باسمه وقائمة لاعبيه الخاصة في المنشئ — تذكّر هذا جيدًا، فالمشروع والتنقيح كلاهما حول هذه اللحظة. LoudTeam ورث كل شيء ثم جاز describe: نفس الاسم وسلوك أعلى صوتًا بكبّيرات الفصل السادس. النداء الأول من صنف الأب فطبع بروتوكوله، والثاني من كائن الابن فطبع نسخته هو، وisinstance أكدت أن gold فريق أيضًا. هكذا يقدم الصنفان واجهة واحدة بقلمين — والفصل الثالث عشر استخدم كائنات جاهزة بنفس العقد: واجهة بلا رؤية داخلية.',
        en: "The Team class builds each object with its name and its own player list in the constructor — memorize this moment, for both the project and the debug revolve around it. LoudTeam inherited everything then overrode describe: same name, louder behavior, with chapter-6 capitals. The first call came from a parent object and printed its protocol; the second came from a child object and printed its own version; and isinstance confirmed gold is a team too. The two classes offer one interface with two pens — the same contract chapter 13 used with ready-made objects: an interface without seeing internals.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-lifecycle',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله. راجع الدورة والتعدد معًا.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Review the lifecycle and multiplicity together.',
      },
      code: "class Counter:\n    def __init__(self, tag):\n        self.tag = tag\n        self.n = 0\n        print(tag, 'built')\n\n    def tick(self):\n        self.n = self.n + 1\n        print(self.tag, self.n)\n\na = Counter('x')\nb = Counter('y')\na.tick()\nb.tick()\na.tick()",
      solution: 'x built\ny built\nx 1\ny 1\nx 2',
      answer: 'x built\ny built\nx 1\ny 1\nx 2',
      hints: [
        { ar: 'كل بناء يطبع رسالته فورًا — البناء قبل أي tick.', en: 'Every construction prints its message at once — building precedes any tick.' },
        { ar: 'tick يطبع العلامة والعدد معًا بعد الرفع — كل كائن عداده هو.', en: 'tick prints the tag and the count together after raising — each object owns its count.' },
        { ar: 'عدّ يدويًّا: a رُفع مرتين وb مرة واحدة — الاستقلال كامل.', en: 'Count by hand: a was raised twice and b once — full independence.' },
        { ar: 'الخرْج:\nx built\ny built\nx 1\ny 1\nx 2', en: 'The output:\nx built\ny built\nx 1\ny 1\nx 2' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.objects-team',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "المشروع: فريق الكائنات. 1) عرّف صنف Team فيه: منشئ __init__(self, nam) يخزن الاسم في self.name ويبني قائمة اللاعبين في self.players بقائمة جديدة list()؛ وتابع add_player(self, player) يضيف اللاعب إلى قائمة هذا الكائن؛ وتابع describe(self) يطبع سطرين: team: %s مع الاسم ثم players: %d مع طول القائمة بـ len. 2) عرّف صنف Coach(Team) يرثه كله ويضيف تابع lead(self) يطبع Coach of %s مع الاسم. 3) ابنِ red = Team('red') وأضف ana وbo واستدعِ red.describe()؛ ثم ابنِ blue = Coach('blue') وأضف cy واستدعِ blue.describe() ثم blue.lead(). المتوقع: team: red ثم players: 2 ثم team: blue ثم players: 1 ثم Coach of blue.",
        en: "The project: the Objects Team. 1) Define a class Team with: a constructor __init__(self, nam) storing the name in self.name and building the player list in self.players as a fresh list(); a method add_player(self, player) appending the player to this object\u2019s list; and a method describe(self) printing two lines: team: %s with the name then players: %d with the list length via len. 2) Define a class Coach(Team) inheriting everything and adding a method lead(self) printing Coach of %s with the name. 3) Build red = Team('red'), add ana and bo, and call red.describe(); then build blue = Coach('blue'), add cy, and call blue.describe() then blue.lead(). Expected: team: red, then players: 2, then team: blue, then players: 1, then Coach of blue.",
      },
      starterCode: "class Team:\n    def __init__(self, nam):\n        # self.name ثم self.players بقائمة جديدة / self.name then self.players as a fresh list\n        pass\n\n    def add_player(self, player):\n        # أضف player إلى قائمة هذا الكائن / append player to this object's list\n        pass\n\n    def describe(self):\n        # اطبع 'team: %s' % self.name ثم 'players: %d' % len(self.players)\n        pass\n\n\nclass Coach(Team):\n    def lead(self):\n        # اطبع 'Coach of %s' % self.name\n        pass\n\n\nred = Team('red')\nred.add_player('ana')\nred.add_player('bo')\nred.describe()\n\nblue = Coach('blue')\nblue.add_player('cy')\nblue.describe()\nblue.lead()",
      solution: "class Team:\n    def __init__(self, nam):\n        self.name = nam\n        self.players = list()\n\n    def add_player(self, player):\n        self.players.append(player)\n\n    def describe(self):\n        print('team: %s' % self.name)\n        print('players: %d' % len(self.players))\n\n\nclass Coach(Team):\n    def lead(self):\n        print('Coach of %s' % self.name)\n\n\nred = Team('red')\nred.add_player('ana')\nred.add_player('bo')\nred.describe()\n\nblue = Coach('blue')\nblue.add_player('cy')\nblue.describe()\nblue.lead()",
      tests: [
        {
          id: 't1',
          name: { ar: 'فريق red بحالته المستقلة: لاعبان', en: 'The red team with its independent state: two players' },
          code: "assert red.name == 'red' and len(red.players) == 2, 'expected: red with 2 players | actual: %r' % ((red.name, len(red.players)),)",
          expected: 'red with 2 players',
        },
        {
          id: 't2',
          name: { ar: 'فريق blue بحالته المستقلة: لاعب واحد', en: 'The blue team with its independent state: one player' },
          code: "assert blue.name == 'blue' and len(blue.players) == 1, 'expected: blue with 1 player | actual: %r' % ((blue.name, len(blue.players)),)",
          expected: 'blue with 1 player',
        },
        {
          id: 't3',
          name: { ar: 'Coach هو Team أيضًا — علاقة is-a', en: 'Coach is also a Team — the is-a relationship' },
          code: "assert isinstance(blue, Team) and isinstance(blue, Coach), 'expected: Coach and Team | actual: %r' % (type(blue),)",
          expected: 'Coach and Team',
        },
        {
          id: 't4',
          name: { ar: 'الأسطر المنسقة الأربعة مطبوعة', en: 'The four formatted lines printed' },
          code: "assert 'team: red' in __learner_output__ and 'players: 2' in __learner_output__ and 'team: blue' in __learner_output__ and 'players: 1' in __learner_output__, 'expected: team: red / players: 2 / team: blue / players: 1 | actual: %r' % __learner_output__",
          expected: 'team: red / players: 2 / team: blue / players: 1',
        },
        {
          id: 't5',
          name: { ar: 'صوت المدرّب مطبوع', en: 'The coach\u2019s voice printed' },
          code: "assert 'Coach of blue' in __learner_output__, 'expected: Coach of blue | actual: %r' % __learner_output__",
          expected: 'Coach of blue',
        },
      ],
      hints: [
        { ar: 'المنشئ يبني الحالة المستقلة: self.name = nam ثم self.players = list() — قائمة جديدة تُولد مع كل كائن.', en: 'The constructor builds the independent state: self.name = nam then self.players = list() — a fresh list born with every object.' },
        { ar: 'add_player يوصل اللاعب لقائمة الكائن عبر self.players.append(player) — وdescribe يقرأ الاسم والطول من الكائن نفسه.', en: "add_player reaches the object's list via self.players.append(player) — and describe reads name and length from the object itself." },
        { ar: 'Coach(Team) يرث كل شيء ويكتفي بتابع lead الجديد: print(\'Coach of %s\' % self.name).', en: "Coach(Team) inherits everything and only adds the new lead method: print('Coach of %s' % self.name)." },
        { ar: 'الهيكل الكامل:\nclass Team:\n    def __init__(self, nam):\n        self.name = nam\n        self.players = list()\n\n    def add_player(self, player):\n        self.players.append(player)\n\n    def describe(self):\n        print(\'team: %s\' % self.name)\n        print(\'players: %d\' % len(self.players))\n\nclass Coach(Team):\n    def lead(self):\n        print(\'Coach of %s\' % self.name)', en: "The full skeleton:\nclass Team:\n    def __init__(self, nam):\n        self.name = nam\n        self.players = list()\n\n    def add_player(self, player):\n        self.players.append(player)\n\n    def describe(self):\n        print('team: %s' % self.name)\n        print('players: %d' % len(self.players))\n\nclass Coach(Team):\n    def lead(self):\n        print('Coach of %s' % self.name)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-instance-state',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أين نبني حالة مستقلة لكل كائن — مثل قائمة لاعبين خاصة بكل فريق؟',
        en: 'Where do we build an independent state per object — like a player list private to each team?',
      },
      options: [
        { id: 'a', text: { ar: 'داخل __init__ عبر self.players = list() — قائمة جديدة تُولد مع كل كائن', en: 'Inside __init__ via self.players = list() — a fresh list born with every object' } },
        { id: 'b', text: { ar: 'كسمة على الصنف مباشرة players = [] خارج التوابع', en: 'As a class-level attribute players = [] outside the methods' } },
        { id: 'c', text: { ar: 'في دالة عامة خارج الصنف تتلقى الفرق معاملات', en: 'In a free function outside the class receiving the teams as parameters' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'المنشئ يعمل مرة لكل كائن — فما يبنيه فيه يصير خاصًّا بذلك الكائن.', en: 'The constructor runs once per object — whatever it builds there becomes that object\u2019s own.' },
        { ar: 'الأسماء على الصنف من غير self مشتركة بين كل الكائنات — والدرس القادم كله حول هذا الخطر.', en: 'Names on the class without self are shared across all objects — the upcoming debug is all about this danger.' },
        { ar: 'استدعِ القائمة الجديدة list() لا مشاركة [] واحدة.', en: 'Call a fresh list() — do not share one [] across objects.' },
        { ar: 'الجواب: أ — الحالة المستقلة تُبنى في __init__ عبر self.', en: 'Answer: a — independent state is built in __init__ via self.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-points',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل: CricketFan يرث PartyAnimal وله points = 0، وsix(self) يضيف 6 إلى self.points ثم يستدعي party. بعد j = CricketFan('Jim') ثم j.six() ثم j.six() — ما قيمة j.points؟",
        en: "Without running: CricketFan inherits PartyAnimal and has points = 0, and six(self) adds 6 to self.points then calls party. After j = CricketFan('Jim'), then j.six(), then j.six() — what is the value of j.points?",
      },
      answer: '12',
      solution: '12',
      tolerance: 0,
      hints: [
        { ar: 'كل استدعاء لـ six يضيف ستة إلى النقاط — والعدد يبدأ من صفر.', en: 'Each six call adds six to the points — and the count starts at zero.' },
        { ar: 'استدعاء party داخل six يرفع العدّاد ولا يمس النقاط — لا تخلط بين الاثنين.', en: 'The party call inside six raises the counter, never the points — do not mix the two.' },
        { ar: 'ستة مضاف مرتين على صفر.', en: 'Six added twice onto zero.' },
        { ar: 'الجواب: 12', en: 'Answer: 12' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-shared-list',
      required: true,
      brokenCode: "class Team:\n    players = []  # قائمة واحدة على الصنف للجميع / one list on the class for everyone\n\n    def __init__(self, nam):\n        self.name = nam\n\n    def add_player(self, player):\n        self.players.append(player)\n\n    def describe(self):\n        print('team: %s' % self.name)\n        print('players: %d' % len(self.players))\n\nred = Team('red')\nred.add_player('ana')\nblue = Team('blue')\nblue.add_player('bo')\nred.describe()\nblue.describe()",
      prompt: {
        ar: 'شغّل الكود المعطوب ولاحظ الفضيحة: أضفنا لاعبًا واحدًا لكل فريق — ومع ذلك يطبع الفريقان players: 2 كلاهما! لا استثناء ولا انهيار: اللاعبون يتسربون بين الكائنات بصمت. اسأل نفسك: أين يسكن players؟ تجده على الصنف نفسه خارج المنشئ — فصار قائمة واحدة يشترك فيها كل الكائنات، وappend عبر أي كائن تعدلها للجميع. أصلح الخلل بنقل بناء القائمة إلى المنشئ عبر self.players = list() حتى يولد كل كائن بقائمته الخاصة، فيصير الحساب صحيحًا: players: 1 لكل فريق.',
        en: 'Run the broken code and witness the scandal: we added one player per team — yet both teams print players: 2! No exception, no crash: players leak between objects silently. Ask yourself: where does players live? You will find it on the class itself, outside the constructor — one list shared by every object, and append through any object mutates it for everyone. Fix the flaw by moving the list build into the constructor via self.players = list() so every object is born with its own list — making the arithmetic honest: players: 1 per team.',
      },
      solution: "class Team:\n    def __init__(self, nam):\n        self.name = nam\n        self.players = list()\n\n    def add_player(self, player):\n        self.players.append(player)\n\n    def describe(self):\n        print('team: %s' % self.name)\n        print('players: %d' % len(self.players))\n\nred = Team('red')\nred.add_player('ana')\nblue = Team('blue')\nblue.add_player('bo')\nred.describe()\nblue.describe()",
      tests: [
        {
          id: 't1',
          name: { ar: 'الفريقان كلاهما وصف نفسه', en: 'Both teams described themselves' },
          code: "assert 'team: red' in __learner_output__ and 'team: blue' in __learner_output__, 'expected: team: red / team: blue | actual: %r' % __learner_output__",
          expected: 'team: red / team: blue',
        },
        {
          id: 't2',
          name: { ar: 'كل فريق يرى لاعبه وحده: players: 1 مرتين', en: 'Each team sees only its own player: players: 1 twice' },
          code: "assert __learner_output__.count('players: 1') == 2, 'expected: players: 1 twice | actual: %r' % __learner_output__",
          expected: 'players: 1 twice',
        },
        {
          id: 't3',
          name: { ar: 'لا تسرب: لا players: 2 في الخرج', en: 'No leak: no players: 2 in the output' },
          code: "assert 'players: 2' not in __learner_output__, 'expected: no leaked count | actual: %r' % __learner_output__",
          expected: 'no leaked count',
        },
      ],
      hints: [
        { ar: 'لا استثناء ولا انهيار — الخلل صامت: الشيفرة تعمل والحساب مخطئ. قارن مكان players مع مكان name.', en: 'No exception, no crash — the flaw is silent: the code runs and the arithmetic is wrong. Compare where players lives with where name lives.' },
        { ar: 'السمة على الصنف بلا self واحدة يشترك فيها الجميع — قائمة واحدة للفرق كلها.', en: 'A class-level attribute without self is one thing shared by everyone — a single list for all teams.' },
        { ar: 'الإصلاح: انقل players إلى __init__ كـ self.players = list() — قائمة تُولد مع كل كائن.', en: 'The fix: move players into __init__ as self.players = list() — a list born with each object.' },
        { ar: 'بعد الإصلاح يطبع كل فريق players: 1 — وهذا معنى الحالة المستقلة التي تدربنا عليها طوال الفصل.', en: 'After the fix each team prints players: 1 — that is the independent state the whole chapter trained you for.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — عائلة الفرق\n# Your playground — the team family\n\nclass Team:\n    def __init__(self, nam):\n        self.name = nam\n        self.players = list()\n\n    def add_player(self, player):\n        self.players.append(player)\n\n    def describe(self):\n        print("team: %s" % self.name)\n        print("players: %d" % len(self.players))\n\nred = Team("red")\nred.add_player("ana")\nred.add_player("bo")\n\ngold = Team("gold")\ngold.add_player("cy")\n\nred.describe()\ngold.describe()\n\n# جرّب: أضف تابع remove_player(self, player) يستخدم players.remove\n# try: add a remove_player(self, player) method using players.remove\n# جرّب: ابنِ فريقًا ثالثًا بثلاثة لاعبين واطبع أطوال الفرق الثلاثة\n# try: build a third team with three players and print all three lengths',
      prompt: {
        ar: 'جرّب بنفسك: أضف تابع remove_player يستدعي players.remove للاسم — واحذر remove لاسم غير موجود، ماذا يرمي؟ ثم ابنِ فريقًا ثالثًا واطبع أطوال الفرق الثلاثة وتتبع يدويًّا قبل التشغيل. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add a remove_player method calling players.remove for the name — and beware remove on a missing name: what does it throw? Then build a third team, print all three lengths, and trace by hand before running. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الرابع: def pack(x): return x * 2 خزنت شيفرة باسم واستدعيتها لاحقًا. كيف حيّا هذا المفهوم داخل الصنف؟',
            en: 'From chapter 4: def pack(x): return x * 2 stored code under a name to call later. How does that concept come alive inside a class?',
          },
          options: [
            { id: 'a', text: { ar: 'التابع نفس الفكرة داخل القالب: def beat(self) تخزن شيفرة باسمها — وتستدعى على كائن عبر النقطة ويصل الكائن في self', en: 'The method is the same idea inside the mold: def beat(self) stores code under a name — called on an object via the dot with the object arriving in self' } },
            { id: 'b', text: { ar: 'الدوال ممنوعة داخل الأصناف', en: 'Functions are forbidden inside classes' } },
            { id: 'c', text: { ar: 'التابع يُنفذ مرة واحدة عند تعريف الصنف', en: 'The method runs once when the class is defined' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التخزين وإعادة الاستخدام من الفصل الرابع هو جذر التوابع: شيفرة مسماة تُكتب مرة وتستدعى كثيرًا — والجديد أنها تسكن القالب ويصبح الكائن معاملها الأول عبر self.',
            en: 'Chapter 4\u2019s store-and-reuse is the root of methods: named code written once and called many times — the new part is that it lives in the mold and the object becomes its first parameter via self.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السادس: لماذا اخترنا print(\'team: %s\' % self.name) بدل print(\'team:\', self.name)؟',
            en: "From chapter 6: why did we choose print('team: %s' % self.name) over print('team:', self.name)?",
          },
          options: [
            { id: 'a', text: { ar: 'التنسيق بـ % يثبت البنية والفراغات — سطر موحد مطابق دائمًا، بينما الفواصل تدخل فراغات متقلبة', en: 'The % format fixes the structure and spaces — one uniform line that always matches, while commas inject shifting spaces' } },
            { id: 'b', text: { ar: 'لأن % أسرع ألف مرة', en: 'Because % is a thousand times faster' } },
            { id: 'c', text: { ar: 'لأن print لا يقبل أكثر من معامل واحد', en: 'Because print accepts only one argument' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كما في الفصل السادس والثالث عشر: التنسيق يعطي كل قيمة عنوانها الثابت — فصار سطر team: red وplayers: 2 قابلين للمطابقة حرفيًّا في الاختبارات.',
            en: 'As in chapters 6 and 13: formatting gives each value its fixed label — making team: red and players: 2 literally matchable in tests.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثامن: self.players.append(player) — ماذا تفعل append للقائمة التي على الكائن؟',
            en: "From chapter 8: self.players.append(player) — what does append do to the object's list?",
          },
          options: [
            { id: 'a', text: { ar: 'تنموها في مكانها بعنصر جديد — وlen يعيد طولها الجديد عند كل describe', en: 'It grows it in place with a new element — and len returns its new length at every describe' } },
            { id: 'b', text: { ar: 'تعيد قائمة جديدة وتترك الأصل كما هو', en: 'It returns a new list and leaves the original as is' } },
            { id: 'c', text: { ar: 'تحذف آخر عنصر من القائمة', en: 'It removes the last element of the list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'append تعدل الكائن نفسه في مكانه كما في كل الفصل الثامن — ولهذا احتجنا قائمة جديدة لكل كائن في المنشئ: لن يعدل append قائمة غيره.',
            en: 'append mutates the object in place as in all of chapter 8 — which is why we needed a fresh list per object in the constructor: no append will touch another\u2019s list.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل التاسع: counts = dict() بنت كائنًا من قالب جاهز وget أعطت قيمة افتراضية عند الغياب. ما الذي تعلمت صنعه هذا الفصل؟',
            en: 'From chapter 9: counts = dict() built an object from a ready-made template and get gave a default on absence. What did this chapter teach you to make?',
          },
          options: [
            { id: 'a', text: { ar: 'قالبًا من صنعك: صنفًا تبني منه كائنات بخواصها وتوابعه — وعملية البناء نفسها', en: 'A mold of your own: a class from which you build objects with their properties and methods — and the building act itself is the same' } },
            { id: 'b', text: { ar: 'قاموسًا جديدًا بمفاتيح ثابتة', en: 'A new dictionary with fixed keys' } },
            { id: 'c', text: { ar: 'بديلًا عن dict لا يقبل التوابع', en: 'A dict replacement that accepts no methods' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'PartyAnimal() مقابل dict() كان مقارنة الكتاب نفسه: القالب الجاهز صنعته بايثون وقالبك صنعته أنت — والكائنات الناتجة تُستخدم بالطريقة نفسها: نقطة ثم تابع.',
            en: 'PartyAnimal() versus dict() was the book\u2019s own comparison: Python made the ready mold, you made yours — and the resulting objects are used the same way: dot, then method.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'لماذا يعد القائمة على الصنف players = [] خطرًا بينما self.players = list() في __init__ آمنة؟',
            en: 'Why is a class-level list players = [] dangerous while self.players = list() inside __init__ is safe?',
          },
          options: [
            { id: 'a', text: { ar: 'السمة على الصنف واحدة يشترك فيها كل الكائنات — وself في المنشئ تولد نسخة جديدة لكل كائن', en: 'The class-level attribute is one thing shared by all objects — self inside the constructor births a fresh copy per object' } },
            { id: 'b', text: { ar: 'لأن [] أسرع من list()', en: 'Because [] is faster than list()' } },
            { id: 'c', text: { ar: 'لا فرق بينهما إطلاقًا — كلاهما يبني قائمة خاصة', en: 'No difference at all — both build a private list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا خلل التنقيح في مشروعنا: القائمة على الصنف واحدة، فappend عبر فريق تعدل قائمة الجميع ويتسرب اللاعبون — والقائمة في المنشئ تولد مع كل كائن فتعيش الحالة المستقلة.',
            en: 'That is our debug flaw: the class-level list is one, so append through a team mutates everyone\u2019s list and players leak — while the constructor\u2019s list is born per object and independent state survives.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'أي مصطلح يوصف بالجملة: «تابع خاص تستدعيه بايثون تلقائيًا عند بناء كل كائن لضبط قيمه الابتدائية»؟',
            en: 'Which term does this sentence describe: a special method Python calls automatically when each object is built to set its initial values?',
          },
          options: [
            { id: 'a', text: { ar: 'المنشئ constructor — __init__', en: 'The constructor — __init__' } },
            { id: 'b', text: { ar: 'الهادم destructor — __del__', en: 'The destructor — __del__' } },
            { id: 'c', text: { ar: 'الوراثة inheritance', en: 'Inheritance' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المنشئ من فهرس المصطلحات: يُستدعى لحظة بناء الكائن لضبط قيمه — وقد رأيناه يخزن الاسم والقائمة في كل مشروع الفصل. والهادم نقيضه: عند التدمير، ونادرًا ما نحتاجه.',
            en: 'The constructor from the glossary: called at the object\u2019s construction to set its values — we watched it store the name and the list in every project of the chapter. The destructor is its opposite: at destruction, rarely needed.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'class Team:\n    players = []  # قائمة على الصنف',
          right: 'class Team:\n    def __init__(self, nam):\n        self.players = list()',
          note: {
            ar: 'السمة القابلة للتعديل على الصنف مشتركة بين كل الكائنات: append عبر كائن يعدل القائمة الواحدة فيتسرب اللاعبون بين الفرق — القائمة تُبنى في __init__ لكل كائن.',
            en: 'A mutable class-level attribute is shared by all objects: append through one object mutates the single list and players leak between teams — the list is built in __init__ per object.',
          },
        },
        {
          wrong: 'print(red)  # ونتعجب من الرمز الغريب',
          right: "print('team: %s' % red.name)\nred.describe()",
          note: {
            ar: 'الطباعة الافتراضية للكائن تعرض نوعه وعنوان ذاكرته — وهي غير مضمونة الشكل ولا معنى للاعتماد عليها في المقارنات. اطبع خواص الكائن أو تابع describe الذي صممته.',
            en: 'An object\u2019s default print shows its type and memory address — an unguaranteed form never to be matched against. Print the object\u2019s properties or the describe method you designed.',
          },
        },
        {
          wrong: "def describe(self):\n    print('team: red')  # الاسم مجمد",
          right: "def describe(self):\n    print('team: %s' % self.name)",
          note: {
            ar: 'الاسم المكتوب يدويًّا يطبع نفس السطر لكل الفرق — والخاصية self.name تعطي كل كائن سطره الصحيح، فهذا معنى الحالة المستقلة التي بناها المنشئ.',
            en: 'A hard-coded name prints the same line for every team — the property self.name gives each object its own correct line, which is exactly the independent state the constructor built.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'خريطة الفصل: كائنات جاهزة منذ زمن → أول صنف قالب وكائن → المنشئ وخواص self → دورة الحياة وتعدد الكائنات → الوراثة is-a.', en: 'The chapter map: ready-made objects all along → first class, mold and object → the constructor and self\u2019s properties → lifecycle and multiple objects → inheritance, is-a.' },
        { ar: 'المصطلحات الثمانية: class وobject وinstance وattribute وmethod وconstructor وinheritance وself — قاموس الفصل كاملًا.', en: 'The eight terms: class, object, instance, attribute, method, constructor, inheritance, self — the chapter\u2019s whole dictionary.' },
        { ar: 'المشروع جمع الفصل: Team يبني حالة مستقلة في __init__ وdescribe يطبع بتنسيق %s و%d — وCoach(Team) ورث ومدد بـ lead، والتنقيح علّم مكان بناء القائمة.', en: 'The project gathered the chapter: Team builds independent state in __init__ and describe prints in %s / %d format — Coach(Team) inherited and extended with lead, and the debug taught where the list must be born.' },
      ],
      reflectPrompt: {
        ar: 'أعد بناء المشروع في الملعب وأضف صنف Player صغيرًا بخاصيتين name وposition، ثم اجعل add_player يبني Player من الاسم ويخزنه. كيف تغير describe؟ ومتى يصبح صنف جديد أوضح من إضافة معاملات؟ اكتب جوابك قبل التجربة.',
        en: 'Rebuild the project in the sandbox and add a small Player class with two properties, name and position, then make add_player build a Player from the name and store it. How does describe change? And when does a new class become clearer than adding parameters? Write your answer before experimenting.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch14.s11', pages: 'ص248 / pp.248' },
        { book: 'PY4E', section: 'py4e.ch14.s12', pages: 'ص249 / pp.249' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch14.s11', pages: 'ص248 / pp.248' },
    { book: 'PY4E', section: 'py4e.ch14.s12', pages: 'ص249 / pp.249' },
  ],
} satisfies Lesson;

export default lesson;
