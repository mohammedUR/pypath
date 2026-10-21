import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch2.l2 — "Variables and Naming / المتغيّرات وأسماؤها"
 * Aligned with PY4E ch2 s2 (المتغيّرات), s3 (أسماء المتغيّرات والكلمات
 * المفتاحية), s12 (اختيار أسماء متغيّرات سهلة التذكّر). All expression is original.
 */
const lesson = {
  id: 'py4e.ch2.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 2,
  title: { ar: 'المتغيّرات وأسماؤها', en: 'Variables and Naming' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch2.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حتى اليوم كانت قيمك تظهر وتختفي في أمر print واحد ثم تُنسى. الآن ستأخذ أول صندوق تخزين حقيقي: تكتب عليه اسمًا، تضع بداخله قيمة، وتستدعيها متى شئت. الكتاب يسمي القدرة على التلاعب بها «أقوى ميزات لغة البرمجة» — وليست مبالغة.',
        en: 'Until today your values appeared inside one print and were then forgotten. Now you get your first real storage box: write a name on it, put a value inside, and summon it whenever you like. The book calls the ability to juggle these boxes “one of the most powerful features of a programming language” — no exaggeration.',
      },
    },
    {
      kind: 'predict',
      code: 'x = 6\nprint(x)\nx = x + 1\nprint(x)',
      question: {
        ar: 'السطر الثالث يبدو مستحيلًا رياضيًا: كيف يمكن لـ x أن يساوي x + 1؟ توقّع ماذا سيطبع البرنامج بالضبط.',
        en: 'The third line looks mathematically impossible: how can x equal x + 1? Predict what the program prints exactly.',
      },
      reveal: {
        ar: 'سيطبع 6 ثم 7. علامة = هنا ليست معادلة رياضية بل أمر إسناد: «خذ ما في يمينك واحفظه في اليسار». السطر الثالث قرأ قيمة x القديمة (6)، زادها واحدًا، ثم خزّن الناتج في x نفسها. الإسناد تحديث للصندوق، لا حل معادلة.',
        en: 'It prints 6 then 7. The = sign here is not a math equation but an assignment command: “take what is on your right and store it in the left”. The third line reads x’s old value (6), adds one, then stores the result back into x itself. Assignment updates the box; it does not solve an equation.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الإسناد: صندوق يكسب اسمًا', en: 'Assignment: a box earns a name' },
      chunks: [
        {
          ar: 'المتغيّر اسم يشير إلى قيمة، وتنشئه بتعليمة الإسناد: الاسم، ثم =، ثم القيمة. message = "And now..." خزّن نصًّا، وn = 17 خزّن عددًا، وpi = 3.14159 خزّن عددًا عائمًا. بعدها كل ذكر للاسم يعني «أعطني ما في الصندوق»: print(n) يطبع 17.',
          en: 'A variable is a name referring to a value, and you create it with an assignment statement: the name, then =, then the value. message = "And now..." stores a string; n = 17 stores an integer; pi = 3.14159 stores a float. After that, every mention of the name means “give me what is in the box”: print(n) prints 17.',
        },
        {
          ar: 'ونوع المتغيّر هو نوع ما بداخله: type(n) تجيب int، وtype(pi) تجيب float. وإن وضعت قيمة جديدة في الصندوق نفسه فسيستبدل القديم بلا حزن ولا أثر — الصندوق يحتفظ بآخر قيمة فقط، وهذا ما رأيته في سطر x = x + 1.',
          en: 'And a variable’s type is the type of what is inside: type(n) answers int, type(pi) answers float. If you put a new value in the same box, it replaces the old one without ceremony — a box holds only its latest value, which is exactly what happened in x = x + 1.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.name-city',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أنشئ صندوقين: متغيّر name يحمل اسمك كنص، ومتغيّر city يحمل مدينتك كنص، ثم اطبعهما في سطرين (print(name) ثم print(city)).',
        en: 'Create two boxes: a variable name holding your name as text, and a variable city holding your city as text; then print them on two lines (print(name) then print(city)).',
      },
      starterCode: '# صندوقان ثم طباعة كل منهما / two boxes, then print each\nname = "..." # ضع اسمك / put your name\ncity = "..." # ضع مدينتك / put your city\nprint(name)\nprint(city)',
      solution: "name = 'سارة'\ncity = 'جدة'\nprint(name)\nprint(city)",
      tests: [
        {
          id: 't1',
          name: { ar: 'name صندوق نصّ غير فارغ', en: 'name is a non-empty string box' },
          code: "assert type(name) == str and len(name) >= 1, 'expected: a non-empty string | actual: %r' % (type(name).__name__,)",
          expected: 'نص غير فارغ / non-empty str',
        },
        {
          id: 't2',
          name: { ar: 'city صندوق نصّ غير فارغ', en: 'city is a non-empty string box' },
          code: "assert type(city) == str and len(city) >= 1, 'expected: a non-empty string | actual: %r' % (type(city).__name__,)",
          expected: 'نص غير فارغ / non-empty str',
        },
      ],
      hints: [
        { ar: 'الإسناد يكتب: الاسم ثم = ثم القيمة بين تنصيص.', en: 'Assignment reads: name, then =, then the value in quotes.' },
        { ar: 'لا تنصيص حول الاسم نفسه — التنصيص للقيمة فقط: name = "سارة".', en: 'No quotes around the name itself — quotes are for the value only: name = "سارة".' },
        { ar: 'الهيكل:\nname = "اسمك"\ncity = "مدينتك"\nprint(name)\nprint(city)', en: 'The skeleton:\nname = "your name"\ncity = "your city"\nprint(name)\nprint(city)' },
        { ar: "name = 'سارة'\ncity = 'جدة'\nprint(name)\nprint(city)", en: "name = 'Sarah'\ncity = 'Jeddah'\nprint(name)\nprint(city)" },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'أسماء مسموحة وأسماء محظورة', en: 'Allowed names and forbidden ones' },
      chunks: [
        {
          ar: 'قواعد الأسماء قصيرة: حروف وأرقام وشرطة سفلية _، ولا يجوز أن يبدأ الاسم برقم، ولا يحتوي رموزًا مثل @. لذلك 76trombones يُرفض، وmore@ يُرفض، وmy_name وair_speed_of_unladen_swallow يُقبلان بكل سرور. المحاولة المرفوضة تظهر كخطأ قواعدي SyntaxError.',
          en: 'The naming rules are short: letters, digits and the underscore _; a name may not start with a digit and may not contain symbols like @. So 76trombones is rejected, more@ is rejected, while my_name and air_speed_of_unladen_swallow are welcomed. A rejected attempt shows up as a SyntaxError.',
        },
        {
          ar: 'وأصعب حظر هو غير المرئي: الكلمات المفتاحية. بايثون تحتفظ بنحو 35 كلمة (مثل class وif وfor وreturn) تحدد لها بنية البرنامج، فلا يجوز استخدامها أسماءً. class = "دورة" سترفض — والرسالة ستربكك لأن الكلمة تبدو بريئة تمامًا. احتفظ بقائمة الكلمات المفتاحية قربك.',
          en: 'And the trickiest ban is the invisible one: keywords. Python keeps about 35 reserved words (like class, if, for, return) that define program structure, so they can never be variable names. class = "course" gets rejected — and the message confuses you because the word looks perfectly innocent. Keep the keyword list close by.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-illegal-name',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي اسم من الثلاثة سيرفضه بايثون فورًا برسالة خطأ؟',
        en: 'Which of the three names will Python reject immediately with an error?',
      },
      options: [
        { id: 'a', text: { ar: 'my_name', en: 'my_name' } },
        { id: 'b', text: { ar: '2nd_place', en: '2nd_place' } },
        { id: 'c', text: { ar: 'speed_of_swallow', en: 'speed_of_swallow' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اثنان منها يتبعان القواعد تمامًا: حروف وأرقام وشرطة سفلية، لا يبدآن برقم.', en: 'Two of them follow the rules perfectly: letters, digits, underscore, not starting with a digit.' },
        { ar: 'تذكّر مثال الكتاب: 76trombones.', en: 'Remember the book’s example: 76trombones.' },
        { ar: 'الاسم الذي يبدأ برقم هو المخالف.', en: 'The name starting with a digit is the violator.' },
        { ar: 'الجواب: 2nd_place — الأسماء لا تبدأ بأرقام.', en: 'Answer: 2nd_place — names never start with a digit.' },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'برنامج الأجرة: ثلاثة صناديق تحكي قصة', en: 'The pay program: three boxes telling a story' },
      code: 'hours = 35.0\nrate = 12.50\npay = hours * rate\nprint(pay)',
      explanation: {
        ar: 'ثلاثة إسنادات ثم طباعة: الصناديق الثلاثة تحكي القصة بنفسها — ساعات العمل، الأجرة للساعة، ثم الأجر. لو سماها الكود a وb وc لحسب الناتج نفسه 437.5، لكنك ستقرأه كطلاسم. الاختبار التالي يحسب من أجلك — راقب كيف تعمل الصناديق.',
        en: 'Three assignments then a print: the three boxes tell the story by themselves — hours worked, rate per hour, then the pay. If the code named them a, b and c it would compute the same 437.5, but you would read it as scribbles. The next exercise computes for you — watch the boxes at work.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-43',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تمرين من تمارين الكتاب نفسه: توقّع خرْج هذا البرنامج بلا تشغيل.',
        en: 'An exercise from the book itself: predict this program’s output without running it.',
      },
      code: 'x = 43\nx = x + 1\nprint(x)',
      solution: '44',
      answer: '44',
      hints: [
        { ar: 'السطر الأول يضع 43 في الصندوق x.', en: 'The first line puts 43 into the x box.' },
        { ar: 'السطر الثاني يقرأ 43 من x، يضيف 1، ويخزّن الناتج في x نفسها.', en: 'The second line reads 43 from x, adds 1, and stores the result back in x.' },
        { ar: 'print(x) يطبع محتوى الصندوق الأخير، وليس الحرف x.', en: 'print(x) prints the box’s latest content, not the letter x.' },
        { ar: 'الخرْج: 44', en: 'The output: 44' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — سمِّ صناديقك كما تشاء (بقواعد!)\n# Your playground — name your boxes as you like (within the rules!)\n\nfavorite_snack = "كعك بالسمسم"\nlucky_number = 7\nprint(favorite_snack)\nprint(lucky_number)',
      prompt: {
        ar: 'جرّب بنفسك: أنشئ ثلاثة صناديق بأسماء وصفيّة، خزّن فيها نصًّا ورقمًا عائمًا، ثم اطبعها. جرّب أيضًا اسمًا يبدأ برقم وشاهد رسالة الرفض — ثم صحّحه.',
        en: 'Try it yourself: create three boxes with descriptive names, store a string and a float in them, then print them. Also try a name starting with a digit and watch the rejection — then fix it.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة للفصل الأول: بايثون لغة تُنفَّذ عبر المفسِّر سطرًا سطرًا. ماذا يعني هذا لسطر الإسناد x = 5؟',
            en: 'Back to chapter 1: Python runs through an interpreter, line by line. What does that mean for the assignment x = 5?',
          },
          options: [
            { id: 'a', text: { ar: 'يُنفَّذ فورًا ويخزّن 5 في x صامتًا — بلا خرْج', en: 'It executes immediately, silently storing 5 in x — no output' } },
            { id: 'b', text: { ar: 'يطبع 5 على الشاشة', en: 'It prints 5 on the screen' } },
            { id: 'c', text: { ar: 'يُؤجَّل إلى نهاية البرنامج', en: 'It is postponed to the end of the program' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الإسناد أمر يُنفَّذ فورًا وينشئ الصندوق، لكنه لا يعرض شيئًا — الطباعة عمل print حصرًا.',
            en: 'Assignment executes at once and creates the box, but displays nothing — displaying is print’s job alone.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'n = 17 ثم type(n) — ما الجواب؟',
            en: 'n = 17 then type(n) — what is the answer?',
          },
          options: [
            { id: 'a', text: { ar: '<class \'int\'>', en: '<class \'int\'>' } },
            { id: 'b', text: { ar: '<class \'str\'>', en: '<class \'str\'>' } },
            { id: 'c', text: { ar: '<class \'variable\'>', en: '<class \'variable\'>' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نوع المتغيّر هو نوع قيمته: 17 عدد صحيح فالجواب int. (variable ليس نوعًا في بايثون أصلًا.)',
            en: 'A variable’s type is its value’s type: 17 is an integer, so int. (variable is not even a Python type.)',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يُرفض الاسم class بينما klass يُقبل؟',
            en: 'Why is the name class rejected while klass is accepted?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن class كلمة مفتاحية محجوزة لبنية البرنامج', en: 'Because class is a keyword reserved for program structure' } },
            { id: 'b', text: { ar: 'لأن class يحتوي حرفًا ممنوعًا', en: 'Because class contains a forbidden letter' } },
            { id: 'c', text: { ar: 'لأن الأسماء يجب أن تبدأ بـ k', en: 'Because names must start with k' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكلمات المفتاحية نحو 35 كلمة تستخدمها بايثون لفهم بنية برنامجك — لا يجوز أخذها أسماءً. klass كلمة عادية تمامًا.',
            en: 'The ~35 keywords are what Python uses to parse your program’s structure — they can never be names. klass is an ordinary word.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'لديّ x = 9 ثم أكتب لاحقًا print("x") — ماذا يطبع؟',
            en: 'I have x = 9 and then write print("x") — what does it print?',
          },
          options: [
            { id: 'a', text: { ar: '9', en: '9' } },
            { id: 'b', text: { ar: 'x', en: 'x' } },
            { id: 'c', text: { ar: 'خطأ NameError', en: 'A NameError' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التنصيص جعل x نصًّا حرفيًا لا اسمَ متغيّر — فطُبع الحرف نفسه. لطباعة المحتوى: print(x) بلا تنصيص.',
            en: 'The quotes made x a literal text, not a variable name — so the letter itself printed. To print the content: print(x) without quotes.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "2cool = 'نعم'",
          right: "cool2 = 'نعم'",
          note: {
            ar: 'الأسماء لا تبدأ برقم — رفض فوري برسالة SyntaxError. ضع الرقم في النهاية: cool2 قانوني.',
            en: 'Names never start with a digit — an instant SyntaxError. Put the digit at the end: cool2 is legal.',
          },
        },
        {
          wrong: "class = 'علم الحاسوب'",
          right: "subject = 'علم الحاسوب'",
          note: {
            ar: 'class كلمة مفتاحية محجوزة، والمفسّر يرفضها وقد ترتبك من الرسالة. اختر اسمًا حرًّا: subject أو course_name.',
            en: 'class is a reserved keyword and the interpreter rejects it — the message can be confusing. Pick a free name: subject or course_name.',
          },
        },
        {
          wrong: 'score = 99\nprint("score")',
          right: 'score = 99\nprint(score)',
          note: {
            ar: 'التنصيص حول الاسم يطبع الحروف score حرفيًا بدل محتوى الصندوق. لطباعة القيمة اكتب الاسم وحده بلا تنصيص.',
            en: 'Quoting the name prints the letters score instead of the box’s content. To print the value, write the bare name without quotes.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الإسناد name = value ينشئ صندوقًا مسمّى ويحمل قيمة — ونوعه نوع ما بداخله.', en: 'Assignment name = value creates a named box holding a value — its type is what is inside.' },
        { ar: 'الأسماء: حروف وأرقام و_، لا تبدأ برقمًا، ولا تستخدم كلمات بايثون المفتاحية.', en: 'Names: letters, digits and _; never start with a digit; never use Python keywords.' },
        { ar: 'العادة الاحترافية: أسماء وصفية تشرح هدفها — hours أفضل من h، وpay من p. برنامجك يُقرأ أكثر مما يُكتب.', en: 'Pro habit: descriptive names that explain their purpose — hours beats h, pay beats p. Code is read far more than it is written.' },
      ],
      reflectPrompt: {
        ar: 'اختر ثلاثة أشياء في يومك وأعطها أسماء متغيّرات وصفية بأسلوب مبرمج محترف — مثل hours_of_sleep = 6. أيها كان أصعب في التسمية ولماذا؟',
        en: 'Pick three things from your day and give them pro-style descriptive variable names — like hours_of_sleep = 6. Which was hardest to name, and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch2.s2', pages: 'ص24 / pp.24' },
        { book: 'PY4E', section: 'py4e.ch2.s3', pages: 'ص25-26 / pp.25-26' },
        { book: 'PY4E', section: 'py4e.ch2.s12', pages: 'ص32-33 / pp.32-33' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch2.s2', pages: 'ص24 / pp.24' },
    { book: 'PY4E', section: 'py4e.ch2.s3', pages: 'ص25-26 / pp.25-26' },
    { book: 'PY4E', section: 'py4e.ch2.s12', pages: 'ص32-33 / pp.32-33' },
  ],
} satisfies Lesson;

export default lesson;
