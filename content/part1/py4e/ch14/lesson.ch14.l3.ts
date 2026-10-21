import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch14.l3 — "Building Objects and the Constructor / بناء الكائنات والمُنشئ"
 * Aligned with PY4E ch14 s6 (إنشاء كائن بلغة بايثون) + s7 (الصنف كنوع بيانات).
 * All expression is original.
 * __init__ with self + parameters taught here (the book pulls parameters from
 * its s9 example forward), per the task's lesson split. type()/dir() follow
 * the book's party3.py. Built-in object inheritance mentioned conceptually.
 */
const lesson = {
  id: 'py4e.ch14.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 14,
  title: { ar: 'بناء الكائنات والمُنشئ', en: 'Building Objects and the Constructor' },
  estimatedMinutes: 17,
  prerequisites: ['py4e.ch14.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'درسنا الماضي صنع كائنًا يحمل عدادًا واحدًا — لكن الحياة الحقيقية تحتاج كائنات تحمل أسماءها وألوانها وعدّاداتها الخاصة. اليوم نتعلم المنشئ __init__: تابعًا خاصًّا تستدعيه بايثون تلقائيًا لحظة بناء كل كائن، فنخزن فيه خواصه هي: self.name = nam يجعل لكل كائن اسمه. وسنرى أن صنفك الجديد صار نوع بيانات كاملًا: type(an) سيجيب باسم صنفك أنت، وdir(an) سيعدّ قدراته في جوار قدرات بايثون كلها. بنهاية الدرس ستكون قادرًا على: كتابة __init__ بمعاملاته وتخزين الخواص على self، وتمييز المتغير المحلي عن الخاصية التي تعيش على الكائن، وقراءة type وdir على كائنات صنفك، ومعرفة أن كل الأصناف تنحدر من النوع المضمّن object.',
        en: 'Last lesson made an object carrying a single count — but real life needs objects carrying their own names, colors and counters. Today we learn the constructor __init__: a special method Python calls automatically at the moment each object is built, where we store its own properties: self.name = nam gives every object its name. And we will see that your new class has become a full data type: type(an) will answer with your class\u2019s own name, and dir(an) will count its capabilities among all of Python\u2019s. By the end of this lesson you will be able to: write __init__ with its parameters and store properties on self, tell a local variable from a property living on the object, read type and dir on your class\u2019s objects, and know that all classes descend from the built-in object type.',
      },
    },
    {
      kind: 'predict',
      code: "class Greeter:\n    def __init__(self, word):\n        self.word = word\n\n    def shout(self):\n        print(self.word.upper())\n\ng = Greeter('hey')\ng.shout()",
      question: {
        ar: 'صنف جديد يخزن كلمة في كائنه ثم يصرخها. ماذا يطبع السطر الأخير؟ ومن استدعى __init__ فعليًّا؟',
        en: 'A new class stores a word in its object then shouts it. What does the last line print? And who actually called __init__?',
      },
      reveal: {
        ar: 'HEY. لحظة بناء g استدعت بايثون __init__ تلقائيًا فخزنت word على الكائن، ثم قرأ shout الكلمة من self.word وحولها بأدوات الفصل السادس. لاحظ أننا لم نستدعِ __init__ بأيدينا — البناء وحده يستدعيه. هذا التابع الخاص هو موضوع اليوم.',
        en: 'HEY. The moment g was built, Python called __init__ automatically and stored word on the object; then shout read the word from self.word and transformed it with chapter-6 tools. Notice we never called __init__ ourselves — the building act alone calls it. This special method is today\u2019s subject.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الكائن: توابع وخواص', en: 'The object: methods and properties' },
      chunks: [
        {
          ar: 'الكائن ببساطة جزء صغير من البرنامج يحتوي بعض الشيفرات بالإضافة إلى بعض بنى البيانات. لنتذكر مفهوم التابع من الفصل الرابع: يسمح بتخزين شيفرة وإعطائها اسمًا، ثم يمكن استحضارها بكتابة الاسم فقط — واليوم تلك الشيفرة تسكن داخل الكائن فنسميها تابع method. وقد يحوي الكائن العديد من التوابع إلى جانب البيانات التي تستخدمها هذه التوابع، ونسمي عناصر البيانات التي هي جزء من الكائن بالخواص properties. في صنف PartyAnimal: خاصية واحدة x وتابع واحد party يرفعها — حزمة واحدة متكاملة من بيانات وشيفرة.',
          en: 'An object is simply a small piece of a program containing some code plus some data structures. Recall the function concept from chapter 4: it stores code under a name that can be summoned later — today that code lives inside an object, so we call it a method. An object may hold many methods alongside the data those methods use, and the pieces of data that are part of the object are called properties. In PartyAnimal: one property x and one method party that raises it — one complete bundle of data and code.',
        },
        {
          ar: 'وداخل التابع يعمل العامل الخاص self: عند استدعاء an.party() يشير self إلى الكائن an نفسه من بين كل كائنات PartyAnimal — والسطر self.x يعني: استخدم x التي تنتمي لهذا الكائن. والصيغة المفصلة PartyAnimal.party(an) تكشف الحقيقة: التابع شيفرة تسكن الصنف، والكائن يمرر إليها معاملًا أول — لذا an.party() اختصار لـ PartyAnimal.party(an). لا تقلق إن بدت هذه الفقرة غامضة في أول قراءة: الكتاب نفسه يعتذر عنها ويعد بأن الفهم يكتمل في بقية الفصل.',
          en: 'And inside the method the special operator self works: when an.party() is called, self refers to the an object itself, out of all PartyAnimal objects — and the line self.x means: use the x belonging to this object. The long form PartyAnimal.party(an) reveals the truth: the method is code living in the class, and the object is passed to it as a first parameter — so an.party() is shorthand for PartyAnimal.party(an). Do not worry if this paragraph feels dense on first reading: the book itself apologizes for it and promises understanding completes through the chapter.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المنشئ __init__ والخواص على self', en: 'The constructor __init__ and properties on self' },
      chunks: [
        {
          ar: 'التوابع التي يبدأ اسمها وينتهي بشرطتين سفليتين توابع خاصة تُدعى في مواعيد محددة. أشهرها المنشئ __init__: عندما تُنشئ بايثون الكائن تستدعيه تلقائيًا لتعطينا فرصة ضبط القيم الابتدائية. عرّفه كأي تابع: def __init__(self, nam): — المعامل الأول self دائمًا يستقبل الكائن الذي يُبنى للتو، وما بعده معاملاتك أنت. وخزّن الخواص عليه: self.name = nam يجعل الاسم خاصية تعيش على هذا الكائن تحديدًا وتبقى معه ما حيّ، ويقرأها كل تابع آخر عبر self.name.',
          en: 'Methods whose names start and end with double underscores are special methods called at scheduled moments. The most famous is the constructor __init__: when Python creates the object it calls it automatically, giving us a chance to set initial values. Define it like any method: def __init__(self, nam): — the first parameter self always receives the object just built, and the rest are your own parameters. Store properties on it: self.name = nam makes the name a property living on this very object for as long as it lives, readable by every other method through self.name.',
        },
        {
          ar: 'وبهذا يكتمل الفرق الجوهري بين المتغير المحلي والخاصية: المتغير المحلي يولد داخل استدعاء التابع ويموت معه، والخاصية على self تعيش داخل الكائن. وكل كائن يُبنى من الصنف يحمل نسخته الخاصة من الخواص: كائنان بعمليتي بناء يحملان اسمين مختلفين وعدّادين مستقلين، ومع ذلك يتشاركان الشيفرة الواحدة من القالب. هذا التوزيع — شيفرة واحدة وخواص كثيرة — هو اقتصاد الكائنات، وسنراه يعمل بأعداد كبيرة في درس تعدد الكائنات.',
          en: 'With this, the essential difference between a local variable and a property completes: a local variable is born inside a method call and dies with it, while a property on self lives inside the object. And every object built from the class carries its own copy of the properties: two objects from two construction acts hold two different names and two independent counters, yet share the one code from the template. This distribution — one code, many properties — is the economy of objects, and we will watch it scale in the multiple-objects lesson.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الصنف نوع بيانات جديد', en: 'The class as a new data type' },
      chunks: [
        {
          ar: 'في بايثون كل المتغيرات لها نوع محدد — وصنفك الجديد صار نوعًا جديدًا. type(an) بعد an = PartyAnimal() يطبع <class \'__main__.PartyAnimal\'>: نوع من صنعك أنت يعيش في الوحدة الرئيسة __main__. وtype(an.x) يطبع <class \'int\'> وtype(an.party) يطبع <class \'method\'> — الخصية عدد والتابع تابع. وdir(an) يعرض قدرات الكائن فتجد بينها x وparty في جوار توابع بايثون القياسية — وقد رأيت dir في درسنا الأول على القوائم، والآن تعمل على صنفك أنت بالطريقة نفسها.',
          en: 'In Python every variable has a specific type — and your new class has become a new type. type(an) after an = PartyAnimal() prints <class \'__main__.PartyAnimal\'>: a type made by you, living in the main module __main__. type(an.x) prints <class \'int\'> and type(an.party) prints <class \'method\'> — the property a number, the method a method. dir(an) shows the object\u2019s capabilities, and you will find x and party among them next to Python\u2019s standard methods — you met dir on lists in our first lesson, and now it works on your own class exactly the same way.',
        },
        {
          ar: 'وإن نظرت إلى dir(an) بعناية رأيت أسماء لم تكتبها: __init__ نفسها و__str__ و__repr__ وغيرها — ورثها الكائن من النوع المضمّن object الذي تنحدر منه كل أنواع بايثون: قوائمك وقواميسك وأصنافك أنت. لذلك لا تحتاج لتعريف المنشئ من الصفر: حتى لو لم تكتب __init__ فصنفك يرث واحدة جاهزة من object تبني الكائن كما هو. هذه أول لمحة عن الوراثة — باب سنفتحه كاملًا في درس لاحق.',
          en: 'Look carefully at dir(an) and you will see names you never wrote: __init__ itself, __str__, __repr__ and others — inherited from the built-in object type from which every Python type descends: your lists, your dicts, your own classes. That is why you never define a constructor from scratch: even if you write no __init__, your class inherits a ready one from object that builds the object as-is. This is the first glimpse of inheritance — a door we will open fully in a later lesson.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'PartyAnimal باسمه الخاص: خزائن مستقلة', en: 'PartyAnimal with a name: independent lockers' },
      code: "class PartyAnimal:\n    x = 0\n\n    def __init__(self, nam):\n        self.name = nam\n\n    def party(self):\n        self.x = self.x + 1\n        print(self.name, 'party', self.x)\n\ns = PartyAnimal('Sally')\ns.party()\ns.party()\nprint(type(s))\nprint(type(s.x))\nprint('party' in dir(s))\nprint('name' in dir(s))",
      explanation: {
        ar: 'عند PartyAnimal(\'Sally\') استدعت بايثون __init__ ومررت الكائن الجديد في self و\'Sally\' في nam، فخزنّا self.name = nam. ثم رفع party العداد الداخلي وطبعه باسم الكائن: Sally party 1 ثم Sally party 2. type(s) أجابت باسم صنفنا الجديد، وtype(s.x) بالعدد int، وdir(s) ضمّت بين قدرات الكائن اسم تابعنا party وخاصيتنا name إلى جوار ميراث object. الخرج ستة أسطر — تحقق منها في المحرر.',
        en: "At PartyAnimal('Sally') Python called __init__, passing the new object in self and 'Sally' in nam, so we stored self.name = nam. Then party raised the internal count and printed it with the object's name: Sally party 1 then Sally party 2. type(s) answered with our new class's name, type(s.x) with int, and dir(s) included our method party and our property name among the object's capabilities, next to the object inheritance. Six lines of output — verify them in the editor.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.ticket-class',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل صنف التذكرة: عرّف صنفًا اسمه Ticket فيه تابع منشئ __init__(self, code) يخزن الكود على الكائن في الخاصية self.code، وتابع show(self) يطبع Ticket: %s مع الكود. ثم ابنِ t = Ticket(\'A17\') واستدعِ t.show(). المتوقع: Ticket: A17.',
        en: "Complete the ticket class: define a class named Ticket with a constructor __init__(self, code) that stores the code on the object as the attribute self.code, and a method show(self) that prints Ticket: %s with the code. Then build t = Ticket('A17') and call t.show(). Expected: Ticket: A17.",
      },
      starterCode: "class Ticket:\n    def __init__(self, code):\n        # خزّن code على الكائن / store code on the object\n        pass\n\n    def show(self):\n        # اطبع 'Ticket: %s' % self.code / print it\n        pass\n\nt = Ticket('A17')\nt.show()",
      solution: "class Ticket:\n    def __init__(self, code):\n        self.code = code\n\n    def show(self):\n        print('Ticket: %s' % self.code)\n\nt = Ticket('A17')\nt.show()",
      tests: [
        {
          id: 't1',
          name: { ar: 'الكود مخزن على الكائن', en: 'The code stored on the object' },
          code: "assert t.code == 'A17', 'expected: A17 | actual: %r' % (t.code,)",
          expected: 'A17',
        },
        {
          id: 't2',
          name: { ar: 't نسخة من Ticket', en: 't is an instance of Ticket' },
          code: "assert isinstance(t, Ticket), 'expected: an instance of Ticket | actual: %r' % (t,)",
          expected: 'an instance of Ticket',
        },
        {
          id: 't3',
          name: { ar: 'السطر المنسق مطبوع', en: 'The formatted line printed' },
          code: "assert 'Ticket: A17' in __learner_output__, 'expected: Ticket: A17 | actual: %r' % __learner_output__",
          expected: 'Ticket: A17',
        },
      ],
      hints: [
        { ar: 'المنشئ يخزن على self: سطر واحد self.code = code — والخاصية تعيش بعده على الكائن.', en: 'The constructor stores on self: one line, self.code = code — the property then lives on the object.' },
        { ar: 'في show اقرأ الكود من الكائن نفسه: self.code — لا من معامل جديد.', en: 'In show read the code from the object itself: self.code — not from a new parameter.' },
        { ar: 'الهيكل:\ndef __init__(self, code):\n    self.code = code\n\ndef show(self):\n    print(\'Ticket: %s\' % self.code)', en: "The skeleton:\ndef __init__(self, code):\n    self.code = code\n\ndef show(self):\n    print('Ticket: %s' % self.code)" },
        { ar: "class Ticket:\n    def __init__(self, code):\n        self.code = code\n\n    def show(self):\n        print('Ticket: %s' % self.code)\n\nt = Ticket('A17')\nt.show()", en: "class Ticket:\n    def __init__(self, code):\n        self.code = code\n\n    def show(self):\n        print('Ticket: %s' % self.code)\n\nt = Ticket('A17')\nt.show()" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-timer',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "class Timer:\n    def __init__(self):\n        self.count = 0\n        print('built')\n\n    def bump(self):\n        self.count = self.count + 1\n\nt = Timer()\nt.bump()\nt.bump()\nprint(t.count)\nprint(type(t.count))",
      solution: "built\n2\n<class 'int'>",
      answer: "built\n2\n<class 'int'>",
      hints: [
        { ar: 'البناء يستدعي __init__ فورًا: نفسها تُطبع built قبل أي شيء آخر.', en: 'Construction calls __init__ at once: built prints before anything else.' },
        { ar: 'bump يرفع count دون طباعة — الطباعة تأتي لاحقًا من print(t.count).', en: 'bump raises count without printing — the printing comes later from print(t.count).' },
        { ar: 'الخاصية على الكائن عدد صحيح — وtype يجيب بالصيغة الكاملة <class \'int\'>.', en: "The property on the object is an integer — and type answers in its full form <class 'int'>." },
        { ar: 'الخرْج:\nbuilt\n2\n<class \'int\'>', en: "The output:\nbuilt\n2\n<class 'int'>" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-type',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بعد an = PartyAnimal() — ماذا يطبع print(type(an))؟',
        en: 'After an = PartyAnimal() — what does print(type(an)) print?',
      },
      options: [
        { id: 'a', text: { ar: "<class '__main__.PartyAnimal'> — صنفنا صار نوع بيانات جديدًا يعيش في الوحدة الرئيسة", en: "<class '__main__.PartyAnimal'> — our class became a new data type living in the main module" } },
        { id: 'b', text: { ar: "<class 'dict'> — لأن كل شيء قاموس داخليًّا", en: "<class 'dict'> — because everything is a dict underneath" } },
        { id: 'c', text: { ar: 'PartyAnimal — اسم الصنف نصًّا مجردًا', en: 'PartyAnimal — the class name as a bare string' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'type يعيد كائن نوع ويطبعه بايثون بصيغة <class ...>.', en: 'type returns a type object that Python prints in the <class ...> form.' },
        { ar: 'باستخدام الكلمة المفتاحية class صنعنا نوع بيانات جديدًا — فيجيب type باسمه ووحدته.', en: 'Using the class keyword we made a new data type — so type answers with its name and module.' },
        { ar: 'جرّب في الملعب: type(an.x) وtype(an.party) — كل واحد يجيب بنوعه.', en: 'Try in the sandbox: type(an.x) and type(an.party) — each answers with its own type.' },
        { ar: 'الجواب: أ — <class \'__main__.PartyAnimal\'>.', en: "Answer: a — <class '__main__.PartyAnimal'>." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-params',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: في تعريف def __init__(self, code) — كم عدد المعاملات المعلنة فيه، ويُحسب self ضمنها؟',
        en: 'Without running: in the definition def __init__(self, code) — how many declared parameters does it have, counting self?',
      },
      answer: '2',
      solution: '2',
      tolerance: 0,
      hints: [
        { ar: 'self معامل كامل الصلاحيات في التوقيع رغم أن بايثون تملؤه تلقائيًا.', en: 'self is a full parameter in the signature even though Python fills it automatically.' },
        { ar: 'اعدهما واحدًا واحدًا في التوقيع كما يراه بايثون.', en: 'Count them one by one in the signature as Python sees it.' },
        { ar: 'الاستدعاء Ticket(\'A17\') يمرر معاملًا واحدًا فقط — لأن self يصل من تلقاء نفسه.', en: "The call Ticket('A17') passes only one argument — self arrives on its own." },
        { ar: 'الجواب: 2 — self وcode.', en: 'Answer: 2 — self and code.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — افحص نوعك الجديد\n# Your playground — examine your new type\n\nclass PartyAnimal:\n    x = 0\n\n    def __init__(self, nam):\n        self.name = nam\n\n    def party(self):\n        self.x = self.x + 1\n        print(self.name, 'party', self.x)\n\ns = PartyAnimal('Sally')\ns.party()\n\nprint(type(s))\nprint(type(s.x))\nprint(type(s.party))\nprint('name' in dir(s))\nprint('party' in dir(s))\n\n# جرّب: اطبع dir(s) كاملًا وابحث عن أسماء لم تكتبها — من أين جاءت؟\n# try: print the full dir(s) and hunt for names you never wrote — where did they come from?\n# جرّب: ابنِ j = PartyAnimal('Jim') واطبع s.name وj.name\n# try: build j = PartyAnimal('Jim') and print s.name and j.name",
      prompt: {
        ar: 'جرّب بنفسك: اطبع dir(s) كاملًا وعدّ الأسماء التي لم تكتبها — تذكير بالميراث من object. ثم ابنِ كائنًا ثانيًا واطبع اسمي الكائنين — نسختان مستقلتان من نفس الخاصية. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: print the full dir(s) and count the names you never wrote — a reminder of the inheritance from object. Then build a second object and print both objects\u2019 names — two independent copies of the same property. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل التاسع: counts = dict() بنت كائنًا من قالب جاهز له توابع مثل get وkeys. ما الذي أضافه صنفك أنت اليوم؟',
            en: 'From chapter 9: counts = dict() built an object from a ready-made template with methods like get and keys. What did your own class add today?',
          },
          options: [
            { id: 'a', text: { ar: 'قالبًا من صنعك: تختار أنت خواصه وتوابعه — وعملية البناء هي نفسها', en: 'A mold of your own making: you choose its properties and methods — and the building act is the same' } },
            { id: 'b', text: { ar: 'نوعًا أسرع من القواميس دائمًا', en: 'A type always faster than dicts' } },
            { id: 'c', text: { ar: 'بديلًا عن التوابع كلها', en: 'A replacement for all methods' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كتاب الكتاب يقارن مباشرة: an = PartyAnimal() يشبه counts = dict() — كلاهما يبني كائنًا من قالب. الفرق الوحيد أن قالبك صممته أنت بخواص وتوابع تخدم مشكلتك أنت.',
            en: 'The book makes the comparison directly: an = PartyAnimal() resembles counts = dict() — both build an object from a template. The only difference is that your template was designed by you, with properties and methods serving your problem.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'متى يُستدعى __init__؟',
            en: 'When is __init__ called?',
          },
          options: [
            { id: 'a', text: { ar: 'مرة واحدة تلقائيًا لحظة بناء كل كائن', en: 'Once, automatically, at the moment each object is built' } },
            { id: 'b', text: { ar: 'مع كل استدعاء لأي تابع آخر', en: 'With every call to any other method' } },
            { id: 'c', text: { ar: 'يدويًّا فقط حين نستدعيه بأنفسنا بالاسم', en: 'Manually only, when we call it by name ourselves' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عندما تُنشئ بايثون الكائن تستدعي __init__ تلقائيًا لتعطينا فرصة ضبط القيم الابتدائية — لذا لم نكتب سطرًا واحدًا يستدعيه في الدرس كله.',
            en: 'When Python creates the object it calls __init__ automatically, giving us the chance to set initial values — which is why not one line in the lesson calls it explicitly.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'self.name = nam داخل __init__ تفعل ماذا بالضبط؟',
            en: 'What does self.name = nam inside __init__ do exactly?',
          },
          options: [
            { id: 'a', text: { ar: 'تجعل name خاصية تعيش على هذا الكائن وتبقى بعده ويقرأها كل التوابث', en: 'It makes name a property living on this object, staying after the call, readable by every method' } },
            { id: 'b', text: { ar: 'تنشئ متغيرًا محليًّا يموت مع انتهاء المنشئ', en: 'It creates a local variable that dies when the constructor ends' } },
            { id: 'c', text: { ar: 'تخزن الاسم في الصنف ليشاركه كل الكائنات قيمة واحدة', en: 'It stores the name on the class for all objects to share one value' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الوصول عبر self يكتب الخاصية على الكائن نفسه — لذا يبقى الاسم بعدها ويقرأ من show أو party أو أي تابع عبر self.name. بلا self صار المسمى محليًّا يتبخر.',
            en: 'Access through self writes the property onto the object itself — so the name survives afterwards and is read from show or party or any method via self.name. Without self the name becomes a local that evaporates.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي سؤال يجيب بدقة: هل an من صنفنا نحن؟',
            en: 'Which question answers precisely: is an from our own class?',
          },
          options: [
            { id: 'a', text: { ar: "print(type(an)) — تعرض <class '__main__.PartyAnimal'> فنقرأ اسم الصنف ووحدته", en: "print(type(an)) — it shows <class '__main__.PartyAnimal'> so we read the class name and its module" } },
            { id: 'b', text: { ar: 'print(len(an)) — الطول يكشف النوع', en: 'print(len(an)) — the length reveals the type' } },
            { id: 'c', text: { ar: 'print(str(an)) — السلسلة تحمل اسم الصنف دائمًا', en: 'print(str(an)) — the string always carries the class name' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'type هو السؤال الرسمي عن النوع — وفي مثال الكتاب أجاب <class \'__main__.PartyAnimal\'> وأكد أن استخدام class صنعنا نوع بيانات جديدًا.',
            en: 'type is the official question about the type — in the book\u2019s example it answered <class \'__main__.PartyAnimal\'> and confirmed that using class made a new data type.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'def __init__(self, nam):\n    name = nam  # بلا self',
          right: 'def __init__(self, nam):\n    self.name = nam',
          note: {
            ar: 'بلا self صار الاسم متغيرًا محليًّا يتبخر بنهاية المنشئ — والكائن يخرج بلا ذاكرة، وأي قراءة لاحقة لـ an.name ترمي AttributeError. القاعدة: خاصية الكائن يسبقها self دائمًا.',
            en: 'Without self the name became a local variable evaporating at the constructor\u2019s end — the object leaves with no memory, and any later read of an.name throws AttributeError. The rule: an object\u2019s property is always prefixed with self.',
          },
        },
        {
          wrong: "def __init__(nam):\n    self.name = nam  # self ضاع",
          right: 'def __init__(self, nam):\n    self.name = nam',
          note: {
            ar: 'self معامل إجباري أول يملؤه بايثون بالكائن تلقائيًا — حذفه يجعل بايثون تمرر الكائن في nam والسلسلة زائدة، فيرمي الاستدعاء TypeError: توقع معاملًا واحدًا وأعطي اثنين.',
            en: "self is the mandatory first parameter Python fills automatically — dropping it makes Python pass the object into nam with the string left over, so the call throws TypeError: expected one argument but got two.",
          },
        },
        {
          wrong: "if type(an) == 'PartyAnimal':  # نص؟",
          right: "print(type(an))  # <class '__main__.PartyAnimal'>",
          note: {
            ar: 'type يعيد كائن نوع لا سلسلة نصية — قارنه بالصنف نفسه أو اطبعه ولا تقارنه بنص أبدًا، فالمقارنة النصية تفشل دائمًا بصمت.',
            en: 'type returns a type object, not a string — compare it with the class itself or print it; never compare it to text, as a string comparison fails silently every time.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المنشئ __init__ تستدعيه بايثون تلقائيًا لحظة البناء — فيه تُخزن خواص الكائن: self.name = nam.', en: 'The constructor __init__ is called by Python automatically at build time — object properties are stored in it: self.name = nam.' },
        { ar: 'الخاصية على self تعيش مع الكائن ويقرأها كل توابعه؛ والمتغير المحلي بلا self يموت مع التابع.', en: 'A property on self lives with the object and is read by all its methods; a bare local without self dies with the method.' },
        { ar: "صنفك نوع بيانات جديد: type(an) تعرض <class '__main__.PartyAnimal'> وdir(an) تجمع قدراتك وميراث object المضمّن.", en: "Your class is a new data type: type(an) shows <class '__main__.PartyAnimal'> and dir(an) gathers your capabilities plus the built-in object inheritance." },
      ],
      reflectPrompt: {
        ar: 'في الملعب: ابنِ كائنين من PartyAnimal باسمين مختلفين واستدعِ party عددًا مختلفًا على كل منهما. اطبع type لكليهما — هل يختلفان؟ واطبع اسمي الكائنين — ماذا يخبرك الاختلاف عن الخواص؟',
        en: 'In the sandbox: build two PartyAnimal objects with different names and call party a different number of times on each. Print type for both — do they differ? And print both objects\u2019 names — what does the difference tell you about properties?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch14.s6', pages: 'ص240 / pp.240' },
        { book: 'PY4E', section: 'py4e.ch14.s7', pages: 'ص243 / pp.243' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch14.s6', pages: 'ص240 / pp.240' },
    { book: 'PY4E', section: 'py4e.ch14.s7', pages: 'ص243 / pp.243' },
  ],
} satisfies Lesson;

export default lesson;
