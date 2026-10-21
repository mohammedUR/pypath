import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch2.l1 — "Values and Types / القيم والأنواع"
 * Aligned with PY4E ch2 s1 (القيم وأنواع البيانات). All expression is original.
 */
const lesson = {
  id: 'py4e.ch2.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 2,
  title: { ar: 'القيم والأنواع', en: 'Values and Types' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch1.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'بالنسبة لك، 17 و"17" يشبهان تمامًا. بالنسبة لبايثون هما كائنان من عالمين مختلفين: الأول عدد يمكن ضربه في 3، والثاني نص من حرفين — جرّب ضربه في 3 وسترفض بايثون بغضب. كل قيمة في البرنامج تنتمي إلى نوع، والنوع يحدد ما يمكنك فعله بها.',
        en: 'To you, 17 and "17" look identical. To Python they are creatures from two different worlds: the first is a number you can multiply by 3; the second is a two-character string — try multiplying it by 3 and Python refuses, upset. Every value in a program has a type, and the type decides what you can do with it.',
      },
    },
    {
      kind: 'predict',
      code: "print('17')\nprint(17)",
      question: {
        ar: 'سطران يبدوان متطابقين تقريبًا — الفرق علامتا تنصيص فقط. هل سيختلف خرْجهما على الشاشة؟',
        en: 'Two nearly identical lines — the only difference is a pair of quotes. Will their output differ on screen?',
      },
      reveal: {
        ar: 'على الشاشة لا: سيظهر 17 مرتين بشكل متماثل. الفرق يعيش خلف الكواليس: الأول نص (str) من حرفين، والثاني عدد صحيح (int). الشاشة لا تكشف النوع — ولهذا توفر بايثون أداة ستراها بعد قليل تُخرج القناع عن كل قيمة.',
        en: 'On screen, no: 17 appears twice, looking the same. The difference lives backstage: the first is a string (str) of two characters, the second an integer (int). The screen does not reveal the type — which is why Python gives you, in a moment, a tool that unmasks every value.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'القيم وأنواعها الثلاثة الأولى', en: 'Values and their first three types' },
      chunks: [
        {
          ar: 'القيمة هي أشياء يتعامل معها البرنامج: 2 وHello world و3.2. القيمة 2 عدد صحيح (int)، وHello world سلسلة نصية (str) لأنها سلسلة من المحارف، و3.2 عدد ذو فاصلة عشريّة (float) — وسُمّي float من طريقة تخزينه: الفاصلة تطفو في العدد.',
          en: 'A value is one of the things a program works with: 2, Hello world, 3.2. The value 2 is an integer (int); Hello world is a string (str) because it is a chain of characters; 3.2 is a floating-point number (float) — named that way because of how it is stored: the decimal point floats within the number.',
        },
        {
          ar: 'ولأن الأنواع لا تظهر على الشاشة، أعطتك بايثون سؤالًا جاهزًا تسأله عن أي قيمة: type(17) فيجيب <class \'int\'>، وtype(\'Hello, World!\') فيجيب <class \'str\'>، وtype(3.2) فيجيب <class \'float\'>. حديث جميل مع المفسِّر: أن تسأله «ما هذا؟» فيصارحك بالجواب.',
          en: 'And because types do not show on screen, Python gives you a ready-made question to ask about any value: type(17) answers <class \'int\'>, type(\'Hello, World!\') answers <class \'str\'>, and type(3.2) answers <class \'float\'>. A lovely chat with the interpreter: you ask “what is this?” and it answers frankly.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.type-reveal',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكشف أنواع القناعين: اطبع نوع العدد 7 ثم اطبع نوع النص \'7\' — باستخدام type داخل print في كل سطر. انتبه: كلمة int وكلمة str يجب أن تظهران في الخرْج.',
        en: 'Unmask both: print the type of the number 7, then print the type of the text \'7\' — using type inside print on each line. Note: the words int and str must appear in the output.',
      },
      starterCode: '# سطران: نوع 7 ثم نوع "7" / two lines: type of 7 then type of "7"\n',
      solution: "print(type(7))\nprint(type('7'))",
      tests: [
        {
          id: 't1',
          name: { ar: 'يظهر int في الخرْج', en: 'int appears in the output' },
          code: "assert 'int' in __learner_output__, 'expected: int in output | actual: %r' % __learner_output__",
          expected: 'int',
        },
        {
          id: 't2',
          name: { ar: 'يظهر str في الخرْج', en: 'str appears in the output' },
          code: "assert 'str' in __learner_output__, 'expected: str in output | actual: %r' % __learner_output__",
          expected: 'str',
        },
      ],
      hints: [
        { ar: 'type تأخذ القيمة بين قوسين، وprint تطبع جوابها.', en: 'type takes the value in parentheses, and print shows its answer.' },
        { ar: 'الرقم 7 يكتب كما هو؛ النص يحتاج علامتي تنصيص.', en: 'The number 7 is written as-is; the text needs quotes.' },
        { ar: 'الهيكل:\nprint(type(7))\nprint(type("7"))', en: 'The skeleton:\nprint(type(7))\nprint(type("7"))' },
        { ar: "print(type(7))\nprint(type('7'))", en: "print(type(7))\nprint(type('7'))" },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'حين يخدعك الشكل: نص يرتدي زيّ رقم', en: 'When appearance fools you: a number in text clothing' },
      chunks: [
        {
          ar: 'القيم مثل "17" و"3.2" تبدو أرقامًا، لكن علامتا التنصيص تحكمان: هما سلاسل نصية. type(\'17\') تجيب <class \'str\' — لأنها حرفان في سلسلة، لا عدد تستطيع جمعه. هذه مسألة شكل لا مسألة قيمة: الأصفار والأرقام نفسها، لكن نوع مختلف كليًا.',
          en: 'Values like "17" and "3.2" look like numbers, but the quotes rule: they are strings. type(\'17\') answers <class \'str\' — two characters in a chain, not a number you can add. This is about appearance, not magnitude: the very same digits, but a completely different type.',
        },
        {
          ar: 'وحتى الأعداد الكبيرة لها فخّها: لنكتب مليونًا بالفواصل المألوفة 1,000,000. بايثون لن تفهمه عددًا واحدًا — ستراه ثلاثة أعداد تفصلها فواصل، وprint(1,000,000) ستطبع 1 0 0. تنفيذ ناجح بلا أي رسالة، ونتيجة غريبة: هذا بالضبط الخطأ الدلالي الذي تعرفته في الفصل الأول.',
          en: 'Even big numbers have their trap: write one million the familiar way, 1,000,000. Python will not see one number — it sees three numbers separated by commas, and print(1,000,000) prints 1 0 0. A successful run with no message and a bizarre result: exactly the semantic error you met in chapter 1.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'محكمة الأنواع: أربعة أحكام', en: 'The type court: four verdicts' },
      code: "print(type(17))\nprint(type('17'))\nprint(type(3.2))\nprint(type('3.2'))",
      explanation: {
        ar: 'أربعة أسطر، أربعة أحكام: 17 عدد صحيح int، و\'17\' نص str، و3.2 فاصلة عائمة float، و\'3.2\' نص str أيضًا — الفاصلة العشرية لم تنجُ من التنصيص. اضغط «شغّل المثال» ولاحظ الشكل <class \'...\' — هذا أسلوب بايثون في تصريح النوع.',
        en: 'Four lines, four verdicts: 17 is int; \'17\' is str; 3.2 is float; and \'3.2\' is str too — the decimal point did not escape the quotes. Press “Run the example” and notice the <class \'...\'> shape — that is how Python states a type.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-string-type',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما نوع القيمة "3.2" — بتنصيصها كاملًا؟',
        en: 'What is the type of the value "3.2" — quotes included?',
      },
      options: [
        { id: 'a', text: { ar: 'int — عدد صحيح', en: 'int — an integer' } },
        { id: 'b', text: { ar: 'float — فاصلة عائمة', en: 'float — floating point' } },
        { id: 'c', text: { ar: 'str — سلسلة نصية', en: 'str — a string' } },
      ],
      answer: 'c',
      solution: 'c',
      hints: [
        { ar: 'اسأل نفسك أولًا: هل توجد علامتا تنصيص؟', en: 'Ask first: are there quotes?' },
        { ar: 'التنصيص يحوّل كل ما بداخله — حتى الأرقام — إلى نص.', en: 'Quotes turn everything inside — even digits — into text.' },
        { ar: 'type("3.2") ستصرح بالجواب نفسه.', en: 'type("3.2") would announce the same answer.' },
        { ar: 'الجواب: str — سلسلة نصية.', en: 'Answer: str — a string.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.fill-float',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: القيمة 2.5 تنتمي إلى نوع الأعداد ذات الفاصلة العائمة، ورمزه في بايثون ______.',
        en: 'Fill in: the value 2.5 belongs to the floating-point type, whose Python name is ______.',
      },
      answer: 'float',
      solution: 'float',
      hints: [
        { ar: 'رأيت الرمز في الفقرة الأولى وفي المثال المطبوع.', en: 'You saw the name in the first section and in the printed example.' },
        { ar: 'اسمه الإنجليزي يدل على «طفاوته».', en: 'Its English name hints at floating.' },
        { ar: 'خمسة أحرف لاتينية تبدأ بـ f.', en: 'Five Latin letters starting with f.' },
        { ar: 'الجواب: float.', en: 'Answer: float.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — حكم على من تشاء\n# Your playground — judge whoever you like\n\nprint(type(42))\nprint(type("42"))\nprint(type(42.0))\nprint(type("بايثون جميلة"))',
      prompt: {
        ar: 'جرّب بنفسك: اسأل type عن قيم من صنعك — أرقام صحيحة، عشرية، نصوص عربية وأجنبية. هل 42.0 عدد عائم أم صحيح؟ اسأل بنفسك ثم اسأل بايثون.',
        en: 'Try it yourself: ask type about values you invent — integers, decimals, Arabic and English strings. Is 42.0 a float or an int? Guess first, then ask Python.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة للفصل الأول: ماذا يفعل print("2 + 3")؟',
            en: 'Back to chapter 1: what does print("2 + 3") do?',
          },
          options: [
            { id: 'a', text: { ar: 'يطبع النص 2 + 3 كما هو', en: 'Prints the text 2 + 3 as-is' } },
            { id: 'b', text: { ar: 'يحسب ويطبع 5', en: 'Computes and prints 5' } },
            { id: 'c', text: { ar: 'يستدعي الخطأ الدلالي', en: 'Triggers the semantic error' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'داخل التنصيص نص من نوع str يُطبع حرفيًا — وهي نفس القاعدة التي تُبقي "17" نصًا لا عددًا.',
            en: 'Inside quotes is a str printed literally — the same rule that keeps "17" text instead of a number.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا سيجيب المفسِّر عند السؤال: type("17")؟',
            en: 'What does the interpreter answer to: type("17")?',
          },
          options: [
            { id: 'a', text: { ar: '<class \'int\'>', en: '<class \'int\'>' } },
            { id: 'b', text: { ar: '<class \'str\'>', en: '<class \'str\'>' } },
            { id: 'c', text: { ar: '17', en: '17' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التنصيص حكم نهائي: "17" سلسلة نصية str، مهما بدا كأنه عدد.',
            en: 'Quotes are the final verdict: "17" is a str, no matter how number-ish it looks.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'القيمة 3.0 — بصفر عشري كامل — أقرب إلى أي نوع؟',
            en: 'The value 3.0 — with its full decimal zero — is closest to which type?',
          },
          options: [
            { id: 'a', text: { ar: 'int', en: 'int' } },
            { id: 'b', text: { ar: 'float', en: 'float' } },
            { id: 'c', text: { ar: 'str', en: 'str' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'وجود الفاصلة العشرية — حتى مع صفر — يجعلها float. القاعدة: هل في القيمة فاصلة؟ إذًا float.',
            en: 'The decimal point — even with a zero — makes it a float. The rule: does the value have a decimal point? Then float.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'print(1,000,000) طبع 1 0 0 بلا أي رسالة خطأ. أي نوع من الأخطاء هذا؟',
            en: 'print(1,000,000) printed 1 0 0 with no error message. Which kind of error is this?',
          },
          options: [
            { id: 'a', text: { ar: 'قواعدي — لأن الفواصل ممنوعة', en: 'Syntax — commas are forbidden' } },
            { id: 'b', text: { ar: 'دلالي — تنفيذ ناجح بنتيجة مخالفة للمقصود', en: 'Semantic — a successful run with an unintended result' } },
            { id: 'c', text: { ar: 'لا خطأ — هذا هو المليون الصحيح', en: 'No error — this is the correct million' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بايثون قرأت ثلاثة أعداد مفصولة بفواصل وطبعتها بفواصل مسافات. التنفيذ سليم، المعنى خاطئ: خطأ دلالي.',
            en: 'Python read three comma-separated numbers and printed them space-separated. The run is fine; the meaning is wrong: a semantic error.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'print(1,000,000)',
          right: 'print(1000000)',
          note: {
            ar: 'الفواصل مألوفة لعينك وغريبة لبايثون: سيراه ثلاثة أعداد ويطبع 1 0 0 بصمت. اكتب الأعداد الكبيرة بلا فواصل.',
            en: 'Commas are familiar to your eye and alien to Python: it sees three numbers and prints 1 0 0 silently. Write big numbers without commas.',
          },
        },
        {
          wrong: "print('17 + 3')",
          right: 'print(17 + 3)',
          note: {
            ar: 'أردت 20 فظهر النص 17 + 3 حرفيًا: التنصيص جعل العملية نصًّا لا حسابًا. الحساب يُكتب بلا تنصيص.',
            en: 'You wanted 20 but got the literal text 17 + 3: the quotes turned the operation into text, not arithmetic. Arithmetic is written without quotes.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'القيمة شيء يتعامل معه البرنامج، ولكل قيمة نوع: int صحيح، float عائم، str نصي.', en: 'A value is a thing a program works with, and every value has a type: int, float, or str.' },
        { ar: 'علامتا التنصيص تصنعان str من أي شيء — حتى من الأرقام، مثل "17" و"3.2".', en: 'Quotes make a str out of anything — even digits, like "17" and "3.2".' },
        { ar: 'type(قيمة) سؤالك الجاهز عن النوع، و1,000,000 بالفواصل فخّ دلالي لا رسالة له.', en: 'type(value) is your ready-made type question, and 1,000,000 with commas is a messageless semantic trap.' },
      ],
      reflectPrompt: {
        ar: 'اذكر مثالًا من حياتك يكون فيه الفرق بين 17 و"17" حاسمًا — مثل رقم هاتف أو عمر أو رمز ترويجة. لماذا النوع مهم هناك؟',
        en: 'Name a real-life case where the difference between 17 and "17" is decisive — a phone number, an age, a promo code. Why does the type matter there?',
      },
    },
    {
      kind: 'sources',
      items: [{ book: 'PY4E', section: 'py4e.ch2.s1', pages: 'ص23-24 / pp.23-24' }],
    },
  ],
  sources: [{ book: 'PY4E', section: 'py4e.ch2.s1', pages: 'ص23-24 / pp.23-24' }],
} satisfies Lesson;

export default lesson;
