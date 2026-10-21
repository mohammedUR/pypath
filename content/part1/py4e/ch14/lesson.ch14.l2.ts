import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch14.l2 — "Your First Class / أول صنف لك"
 * Aligned with PY4E ch14 s4 (البدء مع البرامج) + s5 (تقسيم المشكلة).
 * All expression is original.
 * The book's elev.py / urllinks.py (input, urllib, BeautifulSoup) are framed
 * as desktop code inside prose only. The runnable line of the lesson is the
 * book's canonical PartyAnimal (party2.py) — 100% Pyodide-safe, no input().
 */
const lesson = {
  id: 'py4e.ch14.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 14,
  title: { ar: 'أول صنف لك', en: 'Your First Class' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch14.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'البرنامج في أبسط أشكاله يأخذ مدخلات ويعالجها ثم ينتج مخرجات — لكن حين يتضخم نحتاج أن نقسمه إلى نطاقات، لكل نطاق شيفراته وبياناته كأنه برنامج مستقل صغير. اليوم تكتب أول صنف class لك: قالبًا يجمع شيفرة وبيانات في مكان واحد، ثم تبني منه كائنًا حيًّا وتجعله يعمل. سيتصرف صنفك كحاساب إيقاع: كل استدعاء لتابعه يرفع عداده واحدًا ويطبع المجموع. بنهاية الدرس ستكون قادرًا على: تعريف صنف بكلمة class وتابع داخله بـ def، وبناء كائن من الصنف بـ PartyAnimal()، واستدعاء تابع الكائن بصيغتيه، وشرح دور self بلطف.',
        en: 'A program in its simplest shape takes inputs, processes them, and produces outputs — but as it grows we need to split it into scopes, each with its own code and data, like a small independent program. Today you write your first class: a template bundling code and data in one place, then you build a living object from it and set it in motion. Your class will act as a beat counter: every call to its method raises its count by one and prints the total. By the end of this lesson you will be able to: define a class with the class keyword and a method inside it with def, build an object with PartyAnimal(), call the object\u2019s method in both its forms, and explain the role of self gently.',
      },
    },
    {
      kind: 'predict',
      code: "class PartyAnimal:\n    x = 0\n\n    def party(self):\n        self.x = self.x + 1\n        print('So far', self.x)\n\nan = PartyAnimal()\nan.party()\nan.party()",
      question: {
        ar: 'كلمة class جديدة عليك تمامًا. اقرأ الكود: عرّفنا شيئًا اسمه PartyAnimal ثم بنينا an منه واستدعينا party مرتين. ماذا سيطبع؟',
        en: 'The word class is brand new to you. Read the code: we defined something named PartyAnimal, built an from it, and called party twice. What will it print?',
      },
      reveal: {
        ar: 'So far 1 ثم So far 2. كل استدعاء لـ party رفع القيمة x المخزنة داخل الكائن an بواحد وطبعها. الصنف عرّف القالب، والكائن an هو الحي الذي يحمل البيانات ويستجيب للنداءات — وسنفكك كل كلمة من هذه الأسطر بعد قليل.',
        en: 'So far 1 then So far 2. Each call to party raised the value x stored inside the an object by one and printed it. The class defined the template, and the object an is the living thing holding the data and answering calls — we will unpack every word of these lines shortly.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'البرنامج من الداخل: شيفرة وبيانات', en: 'Inside a program: code and data' },
      chunks: [
        {
          ar: 'تعلمنا سابقًا أن البرنامج في أبسط أشكاله يأخذ مدخلات ليعالجها ثم ينتج مخرجات. برنامج الكتاب elev.py — محوّل أرقام الطوابق الأمريكية إلى أرقام باقي العالم — يفعل ذلك في ثلاثة أسطر: يدخل رقم الطابق ويعالجه بطرح واحد ويطبع الناتج (شيفرة سطح مكتب تستخدم input — لا تُشغَّل هنا). تأمله وسترى في قلبه شيفرة وبيانات تتعاونان لإنجاز المهمة التي صُمم البرنامج لحلها. أخذت البرمجة كائنية التوجه هذا المفهوم وطورته: تقسم برنامجنا إلى نطاقات متعددة، لكل نطاق شيفراته وبياناته كأنه برنامج مستقل، مع تفاعلات محددة جيدًا مع العالم الخارجي والنطاقات الأخرى ضمن البرنامج الرئيس.',
          en: 'We learned earlier that a program in its simplest shape takes inputs, processes them, and produces outputs. The book\u2019s elev.py — a US floor number to rest-of-the-world floor number converter — does it in three lines: it takes a floor number, processes it with one subtraction, and prints the result (desktop code using input — not runnable here). Study it and you will find at its heart code and data cooperating to finish the one task the program was designed to solve. Object-oriented programming took that concept and developed it: it divides our program into multiple scopes, each with its own code and data like an independent program, with well-defined interactions with the outside world and the other scopes inside the main program.',
        },
        {
          ar: 'وقد رأيت ذلك سابقًا دون أن تنتبه: برنامج استخراج الروابط urllinks.py الذي استخدمناه في فصل سابق كان شبكة كائنات متعاونة: متغير سلسلة يحمل الرابط يمرر إلى urllib فتجلب الصفحة (مكتبة سطح مكتب تستخدم socket للاتصال الفعلي — مفهوم هنا لا تشغيل)، والنص الناتج يمرر إلى BeautifulSoup فيحلله بالاعتماد على كائن html.parser ويعيد كائنًا نسأله عن الوسوم، ثم حلقة تستدعي get على كل وسم لتطبع href. الغرض ليس تعليم استخراج الروابط — بل رؤية كيف نبني برنامجًا من كائنات متفاعلة تنسق حركة البيانات فيما بينها. وفهمت البرنامج حينها دون أن تعرف كيف ينسق حركة الكائنات داخليًّا — وهذا بالضبط ما سنصنعه اليوم بأيدينا.',
          en: 'You saw this before without noticing: the urllinks.py link-extraction program we used in an earlier chapter was a network of cooperating objects: a string variable holding the URL passed to urllib which fetches the page (a desktop library using socket for the actual connection — concept only here), the resulting text passed to BeautifulSoup which parses it via an html.parser object and returns an object we interrogate for tags, then a loop calling get on each tag to print href. The point is not link extraction — it is seeing how we build a program from interacting objects coordinating the flow of data between them. And you understood that program back then without knowing how it choreographed the objects internally — exactly what we will build with our own hands today.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الصنف قالب والكائن كعكة', en: 'The class is a mold, the object is a cake' },
      chunks: [
        {
          ar: 'يتميز أسلوب البرمجة كائنية التوجه بأن بإمكانه إخفاء التعقيد: حين نستخدم urllib وBeautifulSoup لا نحتاج لمعرفة كيف تعمل داخليًّا، فنركز على المشكلة التي نريد حلها ونصرف النظر عمّا سواها. وهذه القدرة مفيدة أيضًا لمطوري الكائنات أنفسهم: مطورو BeautifulSoup لا يحتاجون لمعرفة كيف نحصل على صفحة HTML ولا ماهية الصفحات التي نقرؤها ولا ماذا سنفعل بالبيانات المستخرجة. كل طرف يرى قطعته وحدها — وبهذا التقسيم للمشكلة تتحول ملايين الأسطر إلى قطع صغيرة يمكن فهمها واحدة واحدة.',
          en: 'The object-oriented approach shines at hiding complexity: when we use urllib and BeautifulSoup we do not need to know how they work internally, so we focus on the problem we want to solve and ignore everything else. This ability helps the objects\u2019 developers too: the BeautifulSoup developers need not know how we obtain an HTML page, which pages we read, or what we plan to do with the extracted data. Each side sees only its own piece — and with this splitting of the problem, millions of lines become small pieces that can be understood one at a time.',
        },
        {
          ar: 'نستخدم الكلمة المفتاحية class لنحدد البيانات والشيفرة التي ستُبنى منها الكائنات: بعد class يأتي اسم الصنف ثم نقطتان ثم الشيفرة المتضمنة للخواص والتوابع. وكما أن def لا تنفذ جسم الدالة عند تعريفها، فإن class لا تصنع كائنًا عند تعريفه — الصنف قالب فقط. لبناء كائن نكتب an = PartyAnimal() وأمره يشبه استدعاء تابع للصنف نفسه: تبني بايثون كائنًا ببياناته وتوابعه ثم تعيده إلى المتغير — تمامًا كـ counts = dict() الذي كتبناه في الفصل التاسع. وفي التشبيه الشهير: الصنف قالب صنع الكعك والكائنات المنشأة منه هي الكعك — لا نضع الزينة على القالب بل على الكعك، وبإمكانك وضع زينة مختلفة على كل قطعة.',
          en: 'We use the keyword class to define the data and code that objects will be built from: after class comes the class name, then a colon, then the indented code holding the properties and methods. Just as def does not execute the function body when defined, class does not create an object when defined — the class is only a mold. To build an object we write an = PartyAnimal() and the command resembles calling a method on the class itself: Python builds an object with its data and methods, then hands it back into the variable — exactly like counts = dict() we wrote in chapter 9. In the famous analogy: the class is the cake mold and the objects built from it are the cakes — we do not put frosting on the mold but on the cakes, and each piece can take different frosting.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'party2.py من الكتاب: كائن يحتفظ بعداده', en: 'The book\u2019s party2.py: an object that keeps count' },
      code: "class PartyAnimal:\n    x = 0\n\n    def party(self):\n        self.x = self.x + 1\n        print('So far', self.x)\n\nan = PartyAnimal()\nan.party()\nan.party()\nan.party()\nPartyAnimal.party(an)",
      explanation: {
        ar: 'الصنف يحمل خاصية واحدة x وتابعًا واحدًا party. التابع party يرى في معامله self الكائن الذي استُدعي عليه — فالسطر self.x = self.x + 1 يعني: ارفع x التي تنتمي لهذا الكائن تحديدًا. بنينا an واستدعينا party ثلاث مرات فرفع العداد 1 ثم 2 ثم 3. والسطر الأخير PartyAnimal.party(an) هو الصيغة المفصلة للسطر الذي قبله: نستدعي شيفرة التابع من داخل الصنف نفسه ونمرر الكائن معاملًا — أي أن an.party() اختصار لـ PartyAnimal.party(an). الخرج أربعة أسطر: So far 1 إلى So far 4.',
        en: 'The class carries one property x and one method party. Inside the method, the parameter self refers to the object the method was called on — so the line self.x = self.x + 1 means: raise the x belonging to this very object. We built an and called party three times, raising the count to 1, then 2, then 3. The last line, PartyAnimal.party(an), is the long form of the line before it: we call the method\u2019s code from inside the class itself and pass the object as a parameter — meaning an.party() is shorthand for PartyAnimal.party(an). Output: four lines, So far 1 through So far 4.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.first-class',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب صنفك الأول من الصفر: عرّف صنفًا اسمه BeatCounter بخاصية x = 0 وتابع beat(self) يرفع x بواحد ويطبع So far وقيمتها. ثم ابنِ كائنًا في المتغير an عبر an = BeatCounter() واستدعِ beat مرتين. المتوقع: So far 1 ثم So far 2.',
        en: 'Write your first class from scratch: define a class named BeatCounter with a property x = 0 and a method beat(self) that adds 1 to x and prints So far and its value. Then build an object into the variable an via an = BeatCounter() and call beat twice. Expected: So far 1 then So far 2.',
      },
      starterCode: "# عرّف الصنف BeatCounter بخاصية x = 0 وتابع beat(self)\n# يرفع x بواحد ويطبع 'So far' وقيمتها\n# ثم ابنِ an = BeatCounter() واستدعِ beat مرتين\n# Define the class BeatCounter with x = 0 and a method beat(self)\n# that raises x by one and prints 'So far' and its value\n# Then build an = BeatCounter() and call beat twice\n",
      solution: "class BeatCounter:\n    x = 0\n\n    def beat(self):\n        self.x = self.x + 1\n        print('So far', self.x)\n\nan = BeatCounter()\nan.beat()\nan.beat()",
      tests: [
        {
          id: 't1',
          name: { ar: 'an كائن من صنف BeatCounter', en: 'an is an instance of BeatCounter' },
          code: "assert isinstance(an, BeatCounter), 'expected: an instance of BeatCounter | actual: %r' % (an,)",
          expected: 'an instance of BeatCounter',
        },
        {
          id: 't2',
          name: { ar: 'العدد وصل 2 بعد استدعاءين', en: 'The count reached 2 after two calls' },
          code: "assert an.x == 2, 'expected: 2 | actual: %r' % (an.x,)",
          expected: '2',
        },
        {
          id: 't3',
          name: { ar: 'السطران مطبوعان بترتيبهما', en: 'Both lines printed in order' },
          code: "assert 'So far 1' in __learner_output__ and 'So far 2' in __learner_output__, 'expected: So far 1 / So far 2 | actual: %r' % __learner_output__",
          expected: 'So far 1 / So far 2',
        },
      ],
      hints: [
        { ar: 'الهيكل نفسه في الدرس: class BeatCounter: ثم بمسافة بادئة x = 0 ثم def beat(self): وجسمها بمسافة أعمق.', en: 'The same skeleton as the lesson: class BeatCounter: then indented x = 0 then def beat(self): with its body one level deeper.' },
        { ar: 'داخل beat استخدم self.x لا x فقط — فالعرف يعيش على الكائن.', en: 'Inside beat use self.x, not bare x — the count lives on the object.' },
        { ar: 'الهيكل:\nclass BeatCounter:\n    x = 0\n\n    def beat(self):\n        self.x = self.x + 1\n        print(\'So far\', self.x)\n\nan = BeatCounter()\nan.beat()\nan.beat()', en: "The skeleton:\nclass BeatCounter:\n    x = 0\n\n    def beat(self):\n        self.x = self.x + 1\n        print('So far', self.x)\n\nan = BeatCounter()\nan.beat()\nan.beat()" },
        { ar: "class BeatCounter:\n    x = 0\n\n    def beat(self):\n        self.x = self.x + 1\n        print('So far', self.x)\n\nan = BeatCounter()\nan.beat()\nan.beat()", en: "class BeatCounter:\n    x = 0\n\n    def beat(self):\n        self.x = self.x + 1\n        print('So far', self.x)\n\nan = BeatCounter()\nan.beat()\nan.beat()" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-two-forms',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله. الصيغة الأخيرة جديدة: استدعاء التابع من الصنف مباشرة.',
        en: 'Read the code and predict its exact output — one line per print — without running it. The last line is new: calling the method straight from the class.',
      },
      code: "class Echo:\n    def say(self):\n        print('echo')\n\ne = Echo()\ne.say()\nEcho.say(e)",
      solution: 'echo\necho',
      answer: 'echo\necho',
      hints: [
        { ar: 'e.say() الصيغة المألوفة: التابع يُستدعى على الكائن وself يستقبل e تلقائيًا.', en: 'e.say() is the familiar form: the method is called on the object and self receives e automatically.' },
        { ar: 'Echo.say(e) الصيغة المفصلة نفسها: شيفرة التابع من الصنف مع تمرير الكائن معاملًا أول.', en: 'Echo.say(e) is the very same long form: the method\u2019s code from the class with the object passed as the first parameter.' },
        { ar: 'السطران يفعلان الشيء نفسه حرفيًّا — لا فرق في النتيجة.', en: 'The two lines do literally the same thing — no difference in the result.' },
        { ar: 'الخرْج:\necho\necho', en: 'The output:\necho\necho' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-class-keyword',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا تفعل كلمة class عند تنفيذها؟',
        en: 'What does the class keyword do when executed?',
      },
      options: [
        { id: 'a', text: { ar: 'تعرّف قالبًا — والكائنات لا تُبنى إلا حين نستدعي الصنف مثل PartyAnimal()، تمامًا كما def لا تنفذ الدالة عند تعريفها', en: 'It defines a template — objects are only built when we call the class like PartyAnimal(), just as def does not execute the function when defined' } },
        { id: 'b', text: { ar: 'تبني كائنًا واحدًا فورًا وتخزنه في الصنف', en: 'It immediately builds one object and stores it in the class' } },
        { id: 'c', text: { ar: 'تنفذ شيفرة التوابع الموجودة داخلها مرة واحدة', en: 'It runs the code of the methods inside it once' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'قارنها بأقرب قريبة لها: def — هل ينفذ تعريف الدالة جسمها؟', en: 'Compare it with its closest relative: def — does defining a function run its body?' },
        { ar: 'الصنف قالب الكعك — والكعك يُخبز عند PartyAnimal() لا عند كتابة القالب.', en: 'The class is the cake mold — cakes are baked at PartyAnimal(), not when the mold is written.' },
        { ar: 'لذلك يسمى السطر an = PartyAnimal() بناءً — أمرًا منفصلًا عن التعريف.', en: 'That is why an = PartyAnimal() is called construction — a separate act from the definition.' },
        { ar: 'الجواب: أ — class تعرّف قالبًا ولا تبني شيئًا.', en: 'Answer: a — class defines a template and builds nothing.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-self',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'داخل التابع، الاسم الذي يشير إلى الكائن الذي استُدعي عليه التابع هو ____',
        en: 'Inside a method, the name referring to the object the method was called on is ____',
      },
      answer: 'self',
      solution: 'self',
      hints: [
        { ar: 'معامل أول في كل تابع: def party(____):', en: 'The first parameter of every method: def party(____):' },
        { ar: 'به نقرأ خواص الكائن: ____.x = ____.x + 1', en: 'Through it we read the object\u2019s properties: ____.x = ____.x + 1' },
        { ar: 'يستقبله بايثون تلقائيًا في كل استدعاء — لا تمرره أنت بنفسك في الصيغة المختصرة.', en: 'Python fills it automatically on every call — you never pass it yourself in the short form.' },
        { ar: 'الجواب: self', en: 'Answer: self' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — صنفك الأول بين يديك\n# Your playground — your first class in hand\n\nclass PartyAnimal:\n    x = 0\n\n    def party(self):\n        self.x = self.x + 1\n        print('So far', self.x)\n\nan = PartyAnimal()\nan.party()\nan.party()\n\n# الصيغة المفصلة — الاثنان متكافئان / the long form — both equivalent\nPartyAnimal.party(an)\n\n# جرّب: ابنِ كائنًا ثانيًا b = PartyAnimal() واستدعِ party عليه — هل يبدأ من صفر؟\n# try: build a second object b = PartyAnimal() and call party on it — does it start at zero?\n# جرّب: اطبع type(an) وtype(PartyAnimal.party)\n# try: print type(an) and type(PartyAnimal.party)",
      prompt: {
        ar: 'جرّب بنفسك: استدعِ party بالصيغتين بالتناوب وشاهد العداد يتصاعد بلا فرق. ثم ابنِ كائنًا ثانيًا واستدعِ party عليه — ماذا فعل ذلك لعداد الكائن الأول؟ لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: alternate the two call forms and watch the count climb with no difference. Then build a second object and call party on it — what did that do to the first object\u2019s count? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الرابع: التابع party(self) يشبه الدالة المخزنة باسم بـ def — ما الفرق الجوهري؟',
            en: 'From chapter 4: the method party(self) resembles a function stored under a name with def — what is the essential difference?',
          },
          options: [
            { id: 'a', text: { ar: 'التابع يسكن داخل الصنف ويستقبل self ليقول له أي كائن استدعاه — والدالة الحرة لا تعرف كائنًا', en: 'The method lives inside a class and receives self telling it which object called it — a free function knows no object' } },
            { id: 'b', text: { ar: 'لا فرق على الإطلاق — التابع دالة بأسماء مختلفة', en: 'No difference at all — a method is a function with different naming' } },
            { id: 'c', text: { ar: 'التابع لا يقبل معاملات أبدًا', en: 'A method never accepts parameters' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل ما تعلمته في الفصل الرابع عن التخزين وإعادة الاستخدام ينطبق: التابع شيفرة مسماة تُكتب مرة وتستدعى كثيرًا — لكنه يسكن القالب ويستقبل الكائن في معامله الأول، ومن هنا صار self.x ممكنًا.',
            en: 'Everything chapter 4 taught about store-and-reuse applies: a method is named code written once and called many times — but it lives in the mold and receives the object as its first parameter, which is what makes self.x possible.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'متى تُنفَّذ شيفرة party داخل الصنف؟',
            en: 'When does the code of party inside the class execute?',
          },
          options: [
            { id: 'a', text: { ar: 'عند كل استدعاء an.party() — التعريف وحده لا ينفذ شيئًا', en: 'On every an.party() call — the definition alone executes nothing' } },
            { id: 'b', text: { ar: 'مرة واحدة عند تعريف الصنف', en: 'Once, when the class is defined' } },
            { id: 'c', text: { ar: 'عند نهاية البرنامج تلقائيًا', en: 'Automatically at the end of the program' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كما أن def تخزن ولا تنفذ، فإن class تخزن القالب ولا تنفذ توابعه — التنفيذ يحدث مع كل نداء على كائن حي، وself يعرف الكائن.',
            en: 'Just as def stores without running, class stores the template without running its methods — execution happens with every call on a living object, and self knows which one.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'an = PartyAnimal() يشبه أي سطر من الفصل التاسع؟',
            en: 'Which chapter-9 line does an = PartyAnimal() resemble?',
          },
          options: [
            { id: 'a', text: { ar: 'counts = dict() — كلاهما يبني كائنًا من قالب ويسنده إلى متغير', en: 'counts = dict() — both build an object from a template and assign it to a variable' } },
            { id: 'b', text: { ar: 'print(counts) — كلاهما يطبع شيئًا', en: 'print(counts) — both print something' } },
            { id: 'c', text: { ar: 'del counts — كلاهما يهدم كائنًا', en: 'del counts — both destroy an object' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كتب الكتاب التشبيه نفسه: PartyAnimal() يبني كائنًا من قالبك كما dict() يبني من القالب الجاهز — الفرق أن القالب الجاهز صنعته بايثون وقالبك صنعته أنت.',
            en: 'The book makes this exact comparison: PartyAnimal() builds an object from your mold as dict() builds from the ready-made one — the difference being that Python made the ready-made mold and you made yours.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ماذا يشير self داخل party؟',
            en: 'What does self refer to inside party?',
          },
          options: [
            { id: 'a', text: { ar: 'إلى الكائن الذي استُدعي عليه التابع — an في مثالنا', en: 'The object the method was called on — an in our example' } },
            { id: 'b', text: { ar: 'إلى الصنف نفسه دائمًا', en: 'Always to the class itself' } },
            { id: 'c', text: { ar: 'إلى أي كائن آخر من نفس الصنف يختاره بايثون عشوائيًّا', en: 'To some other object of the same class, chosen at random by Python' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'self هو الكائن الذي عبر نقطته جاء النداء: an.party() تمرر an في self. والصيغة المفصلة PartyAnimal.party(an) تكشف الأمر: الكائن معامل يمرر — لا شيء سحري هنا.',
            en: 'self is the object whose dot the call traveled through: an.party() passes an into self. The long form PartyAnimal.party(an) reveals it: the object is just a parameter being passed — nothing magical.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'class BeatCounter\n    x = 0',
          right: 'class BeatCounter:\n    x = 0',
          note: {
            ar: 'بعد اسم الصنف نقطتان كما بعد def وif — نسيانه أول خطأ في أول صنف: SyntaxError فوري قبل أي تشغيل. وتذكر المسافة البادئة: جسم الصنف مزاح للداخل كجسم الدالة.',
            en: 'A colon follows the class name just as after def and if — forgetting it is the first mistake in a first class: an instant SyntaxError before any run. And mind the indentation: the class body is indented like a function body.',
          },
        },
        {
          wrong: 'def party():\n    print(\'hi\')  # بلا self',
          right: 'def party(self):\n    print(\'hi\')',
          note: {
            ar: 'بدون self يصل استدعاء an.party() إلى تابع لا يقبل معاملات بينما بايثون تمرر الكائن — فيرمي TypeError: توقع صفر معاملات وأعطي واحدًا. self يستقبله الكائن تلقائيًا في كل استدعاء.',
            en: 'Without self, an.party() reaches a method taking no parameters while Python passes the object — so it throws TypeError: expected zero arguments but got one. self receives the object automatically on every call.',
          },
        },
        {
          wrong: 'def beat(self):\n    x = x + 1  # محلي بلا self',
          right: 'def beat(self):\n    self.x = self.x + 1',
          note: {
            ar: 'x = x + 1 داخل التابع يقرأ متغيرًا محليًّا غير معرف فيرمي UnboundLocalError — الكائن يحمل x داخل self، فاكتب self.x دائمًا حين تعني خاصية الكائن.',
            en: 'x = x + 1 inside the method reads an undefined local and throws UnboundLocalError — the object keeps x inside self, so write self.x whenever you mean the object\u2019s property.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الصنف class قالب يجمع الخواص والتوابع — ولا يبني شيئًا حتى نستدعيه: an = PartyAnimal() مثل counts = dict().', en: 'The class is a template bundling properties and methods — it builds nothing until called: an = PartyAnimal() is like counts = dict().' },
        { ar: 'الكائن نطاق مستقل: بياناته وتوابعه معًا — وself داخل التابع يشير إلى الكائن الذي استُدعي عليه.', en: 'The object is an independent scope: its data and methods together — and self inside the method refers to the object the call landed on.' },
        { ar: 'an.party() اختصار لـ PartyAnimal.party(an) — الصيغة المفصلة تكشف أن التابع شيفرة في الصنف والكائن معامل يمرر.', en: 'an.party() is shorthand for PartyAnimal.party(an) — the long form reveals the method as code in the class with the object passed as a parameter.' },
      ],
      reflectPrompt: {
        ar: 'أعد بناء PartyAnimal في الملعب وأضف تابعًا ثانيًا اسمه reset(self) يصفّر x ويطبع صفرًا. استدعِ party مرتين ثم reset ثم party — تتبع قيمة x يدويًّا قبل التشغيل ثم قارن مع الخرج.',
        en: 'Rebuild PartyAnimal in the sandbox and add a second method reset(self) that zeroes x and prints zero. Call party twice, then reset, then party — trace the value of x by hand before running, then compare with the output.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch14.s4', pages: 'ص237 / pp.237' },
        { book: 'PY4E', section: 'py4e.ch14.s5', pages: 'ص239 / pp.239' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch14.s4', pages: 'ص237 / pp.237' },
    { book: 'PY4E', section: 'py4e.ch14.s5', pages: 'ص239 / pp.239' },
  ],
} satisfies Lesson;

export default lesson;
