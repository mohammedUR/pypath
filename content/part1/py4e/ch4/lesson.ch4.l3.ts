import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch4.l3 — "Random Numbers / الأعداد العشوائية"
 * Aligned with PY4E ch4 s5 (الأعداد العشوائية).
 * All expression is original.
 * Grading note: exercises seed the generator first (random.seed) so the
 * deterministic Mersenne-Twister sequence of CPython/Pyodide makes tests stable.
 */
const lesson = {
  id: 'py4e.ch4.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 4,
  title: { ar: 'الأعداد العشوائية', en: 'Random Numbers' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch4.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل برنامج كتبتَه حتى اليوم كان أمنيًّا: المدخل نفسه يعطي الخرج نفسه، كل مرة. جيد للحسابات — كارثي للنرد. كيف نصنع مفاجأة من آلة لا تعرفها؟ بايثون تملك حيلة: الوحدة random — أرقام تبدو عشوائية، وهي في الحقيقة تسلسل طويل مخبأ بعناية.',
        en: 'Every program you wrote so far was honest: the same input gives the same output, every time. Great for accounting — fatal for dice. How do you manufacture surprise from a machine that knows none? Python holds a trick: the random module — numbers that look random, yet are actually a long sequence hidden with care.',
      },
    },
    {
      kind: 'predict',
      code: 'import random\n\nrandom.seed(7)\nprint(random.random())\nprint(random.randint(1, 6))',
      question: {
        ar: 'رقمان «عشوائيان» — لكن مع سطر random.seed(7) فوقهما: هل يتغيران عند كل تشغيل؟',
        en: 'Two “random” numbers — but with random.seed(7) above them: do they change on every run?',
      },
      reveal: {
        ar: 'لا — ستحصل في كل تشغيل على 0.32383276483316237 ثم 2. البذرة تثبّت نقطة البداية داخل التسلسل الطويل، فصار العشوائي حتميًا. احذف سطر البذرة وأعد التشغيل: أرقام جديدة كل مرة — وهذا ما تريده في لعبة، وما لا تريده في اختبار.',
        en: 'No — every run gives 0.32383276483316237 then 2. The seed pins the starting point inside the long sequence, turning the random into the deterministic. Delete the seed line and run again: new numbers every time — exactly what you want in a game, and exactly what you do not want in a test.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الحتمية والأعداد شبه العشوائية', en: 'Determinism and pseudorandom numbers' },
      chunks: [
        {
          ar: 'غالبية البرامج تولّد الخرج نفسه عند تلقي الدخل نفسه، لذلك تُدعى حتمية — وعادة هذه ميزة نريدها: الحساب يعطي النتيجة ذاتها. لكن بعض التطبيقات تحتاج عدم قابلية للتنبؤ: الألعاب أولًا، ثم المحاكاة والعيّنات العشوائية.',
          en: 'Most programs produce the same output for the same input, which makes them deterministic — and usually that is the point: a computation should reproduce its result. But some applications need unpredictability: games first, then simulations and random sampling.',
        },
        {
          ar: 'بناء برنامج غير حتمي بامتياز صعب، لكن ثمة أسلوب يجعله يبدو كذلك: خوارزميات تولّد أعدادًا شبه عشوائية. هذه الأعداد ليست عشوائية بامتياز — عملية حاسوبية حتمية تولّدها — لكن العين لا تميّزها عن العشوائي الحقيقي. الوحدة random تقدّم هذه التوابع، وسنسمّيها «عشوائية» للسهولة كما فعل الكتاب.',
          en: 'Building a truly random program is hard, but there is a method that makes it look that way: algorithms generating pseudorandom numbers. These numbers are not truly random — a deterministic computer process generates them — yet the eye cannot tell them apart from real randomness. The random module provides these functions, and we will call them “random” for short, just as the book does.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'أدوات الوحدة random', en: 'The random module’s tools' },
      chunks: [
        {
          ar: 'بعد import random تصبح ثلاث أدوات بين يديك. random.random() يعيد عددًا عشريًا عشوائيًا بين 0.0 و1.0 — متضمّنًا 0.0 ودون 1.0. random.randint(5, 10) يأخذ معاملين: الحد الأدنى low والحد الأعلى high، ويعيد عددًا صحيحًا بينهما متضمّنًا القيمتين — مثالي للنرد: random.randint(1, 6).',
          en: "After import random, three tools are in your hands. random.random() returns a random float between 0.0 and 1.0 — including 0.0 but excluding 1.0. random.randint(5, 10) takes two parameters, low and high, and returns an integer between them, both ends included — perfect for dice: random.randint(1, 6).",
        },
        {
          ar: "وrandom.choice يختار عنصرًا واحدًا من مجموعة عشوائيًا: random.choice([1, 2, 3]) قد تعطي 2 ثم 3 في استدعاء لاحق، وتعمل على النصوص كذلك فتختار حرفًا. وترفع الوحدة غطاء صندوق أكبر: توابع لتوليد قيم من توزيعات مستمرة — غاوسية وأسية وغاما — عيّنة منها ستقابلها في مسيرتك مع الذكاء الاصطناعي.",
          en: "And random.choice picks one element from a collection at random: random.choice([1, 2, 3]) might give 2 then 3 on later calls, and it works on strings too, choosing a character. The module also lifts the lid on a bigger box: functions generating values from continuous distributions — Gaussian, exponential, gamma — a sample of which you will meet on your AI journey.",
        },
        {
          ar: 'ولمشاهدة التسلسل بنفسك، يشغّل الكتاب حلقة تطبع عشرة أرقام من random.random() — كل استدعاء ينتزاع الرقم التالي من سلسلة طويلة. الحلقة نفسها سترسم رسميًا في الفصل القادم؛ جرّبها اليوم في الملعب كمعاينة.',
          en: 'To watch the sequence yourself, the book runs a loop printing ten random.random() values — each call pulls the next number from a long chain. The loop itself gets its official lesson next chapter; try it today in the sandbox as a preview.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'البذرة: عشوائية تابعة لأمرك', en: 'The seed: randomness on your orders' },
      chunks: [
        {
          ar: 'random.seed(7) تثبّت نقطة البدء في التسلسل: كل الأرقام بعدها محددة سلفًا وتتكرر في كل تشغيل. تناقض ظاهري — أداة حتمية لتعليم العشوائية — لكنه سرّ الاستقرار: منصة التمرين هنا تزرع بذرة في كل تمرين عشوائي حتى تكون الاختبارات مستقرة، وبايثون نفسها (وبيئة Pyodide هنا) تطابق أي بايثون 3 في الأرقام نفسها.',
          en: 'random.seed(7) pins the starting point of the sequence: every number after it is predetermined and repeats on every run. A seeming paradox — a deterministic tool for teaching randomness — but it is the secret of stability: this exercise platform plants a seed in every random exercise so tests stay stable, and Python itself (and the Pyodide runtime here) matches any Python 3 on the very same numbers.',
        },
        {
          ar: 'القاعدة العملية: أثناء تطوير لعبة، ثبّت البذرة لتختبر سيناريو معين مرارًا؛ وعند الإطلاق احذفها ليختلف كل جولة. مفهوم البذرة سيرافقك لاحقًا في تعلم الآلة حين تريد مقارنة تجارب على عيّنات متطابقة.',
          en: 'The practical rule: while developing a game, fix the seed to replay a scenario over and over; at launch, drop it so every round differs. The seed concept will follow you into machine learning, where experiments must be compared on identical samples.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نرد ثابت الاختبار', en: 'Dice, stable for testing' },
      code: 'import random\n\nrandom.seed(3)\ndie1 = random.randint(1, 6)\ndie2 = random.randint(1, 6)\ntotal = die1 + die2\nprint(die1)\nprint(die2)\nprint(total)',
      explanation: {
        ar: 'randint أخذ وسيطين — 1 و6 — وأعاد عددًا صحيحًا بينهما بالطرفين. مع random.seed(3) يعطي البرنامج في كل تشغيل: 2 ثم 5 ثم 7. الاحتمال نفسه، والنتيجة نفسها — مثالي للتصحيح والاختبار. احذف سطر البذرة: رميات جديدة كل مرة، لكنها تبقى دائمًا في النطاق 1 إلى 6.',
        en: 'randint took two arguments — 1 and 6 — and returned an integer between them, ends included. With random.seed(3) the program gives, on every run: 2, then 5, then 7. Same chance, same result — ideal for debugging and testing. Delete the seed line: fresh dice every run, always within 1 to 6.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.seeded-random',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'استورد الوحدة random، ثم ثبّت البذرة random.seed(1)، ثم أنشئ x = random.random() واطبعها. مع هذه البذرة ستحصل في كل تشغيل على العدد نفسه: 0.13436424411240122.',
        en: 'Import the random module, then fix the seed random.seed(1), then create x = random.random() and print it. With this seed every run gives the same number: 0.13436424411240122.',
      },
      starterCode: '# استورد وثبّت البذرة ثم ولّد واطبع / import, seed, generate, print\n',
      solution: 'import random\n\nrandom.seed(1)\nx = random.random()\nprint(x)',
      tests: [
        {
          id: 't1',
          name: { ar: 'x عدد عشري float', en: 'x is a float' },
          code: "assert type(x) == float, 'expected: float | actual: %r' % type(x).__name__",
          expected: 'float',
        },
        {
          id: 't2',
          name: { ar: 'x في النطاق من 0.0 متضمّنة إلى 1.0 غير متضمّنة', en: 'x lies in 0.0 inclusive to 1.0 exclusive' },
          code: 'assert 0 <= x < 1, \'expected: 0.0 <= x < 1.0 | actual: %r\' % x',
          expected: '0.13436424411240122',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع العدد المتوقع من التسلسل المثبّت', en: 'The expected value from the pinned sequence is printed' },
          code: "assert '0.13436424411240122' in __learner_output__, ('expected: 0.13436424411240122 | actual: %r' % __learner_output__)",
          expected: '0.13436424411240122',
        },
      ],
      hints: [
        { ar: 'أربعة أسطر: الاستيراد، ثم البذرة، ثم التوليد في x، ثم الطباعة.', en: 'Four lines: the import, the seed, generating into x, then printing.' },
        { ar: 'الاستدعاء بلا وسائط: random.random() — القوسان فارغان.', en: 'The call takes no arguments: random.random() — empty parentheses.' },
        { ar: 'الهيكل:\nimport random\nrandom.seed(1)\nx = random.random()\nprint(x)', en: 'The skeleton:\nimport random\nrandom.seed(1)\nx = random.random()\nprint(x)' },
        { ar: 'import random\nrandom.seed(1)\nx = random.random()\nprint(x)', en: 'import random\nrandom.seed(1)\nx = random.random()\nprint(x)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-randint-range',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي القيم ممكنة كنتيجة للاستدعاء random.randint(5, 10)؟',
        en: 'Which values can random.randint(5, 10) possibly return?',
      },
      options: [
        { id: 'a', text: { ar: 'من 5 إلى 10 — الطرفان متضمّنان', en: 'From 5 to 10 — both ends included' } },
        { id: 'b', text: { ar: 'من 6 إلى 9 — الطرفان مستثنيان', en: 'From 6 to 9 — both ends excluded' } },
        { id: 'c', text: { ar: 'من 5 إلى 9 — الأعلى مستثنى', en: 'From 5 to 9 — upper end excluded' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الكتاب يصفها: معاملان low وhigh — ويُعاد عدد صحيح بينهما…', en: 'The book describes it: two parameters low and high — and an integer is returned between them…' },
        { ar: '…متضمّنًا القيمتين — وهذا يخالف range التي تعرفها مستقبلًا.', en: '…both ends included — unlike range, which you will meet later.' },
        { ar: 'لهذا النرد صار سهلًا: randint(1, 6) قد يعطي 6 نفسه.', en: 'That is why dice are easy: randint(1, 6) can give 6 itself.' },
        { ar: 'الجواب: أ — الطرفان 5 و10 محتملان كنتيجة.', en: 'Answer: a — both 5 and 10 are possible results.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.fill-choice',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: التابع random.______ يختار عنصرًا واحدًا من قائمة عشوائيًا.',
        en: 'Fill in: the function random.______ picks one element from a list at random.',
      },
      answer: 'choice',
      solution: 'choice',
      hints: [
        { ar: 'رأيته يختار من قائمة [1, 2, 3] في درس اليوم.', en: 'You saw it pick from the list [1, 2, 3] in today’s lesson.' },
        { ar: 'اسمه بالإنجليزية يعني «اختيار».', en: 'Its English name means “choice”.' },
        { ar: 'random.choice([1, 2, 3]) تعطي عنصرًا واحدًا.', en: 'random.choice([1, 2, 3]) gives one element.' },
        { ar: 'الجواب: choice', en: 'Answer: choice' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.trace-seeded',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — التسلسل مثبّت بالبذرة، فالأرقام محددة.',
        en: 'Read the code and predict its exact output — the sequence is pinned by the seed, so the numbers are determined.',
      },
      code: 'import random\n\nrandom.seed(2)\nprint(random.randint(1, 10))\nprint(random.randint(1, 10))',
      solution: '1\n2',
      answer: '1\n2',
      hints: [
        { ar: 'البذرة 2 تثبّت التسلسل كله — وليست الإجابة «أي رقم بين 1 و10».', en: 'Seed 2 pins the whole sequence — the answer is not “any number from 1 to 10”.' },
        { ar: 'كل استدعاء ينتزاع الرقم التالي من التسلسل المثبّت.', en: 'Each call pulls the next number from the pinned sequence.' },
        { ar: 'سطران، وكل منهما عدد صحيح بين 1 و10.', en: 'Two lines, each an integer between 1 and 10.' },
        { ar: 'الخرْج:\n1\n2', en: 'The output:\n1\n2' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: 'import random\n\n# معاينة لحلقة الفصل القادم — شغّلها كتجربة / a preview of next chapter\'s loop\nfor i in range(5):\n    print(random.randint(1, 6))\n\nprint(random.choice([\'فريق أحمر\', \'فريق أزرق\']))',
      prompt: {
        ar: 'جرّب بنفسك: شغّل الكود مرتين وشاهد نردًا مختلفًا كل مرة، وفريقًا مختلفًا أحيانًا. ثم أضف random.seed(42) في الأعلى وشغّل مرتين — ثبات كامل. غيّر القائمة إلى أسماء أصحابك واختر متطوعًا. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: run the code twice and watch different dice each time, and sometimes a different team. Then add random.seed(42) at the top and run twice — complete stability. Swap the list for your friends’ names and pick a volunteer. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا نسمّي أعداد الوحدة random «شبه عشوائية» pseudorandom؟',
            en: 'Why do we call the random module’s numbers “pseudorandom”?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن عملية حاسوبية حتمية تولّدها — وهي تبدو عشوائية فقط', en: 'Because a deterministic computer process generates them — they only look random' } },
            { id: 'b', text: { ar: 'لأنها أعداد سالبة', en: 'Because they are negative numbers' } },
            { id: 'c', text: { ar: 'لأنها لا تتغير أبدًا', en: 'Because they never change' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الحاسوب آلة حتمية: يستحيل عليه العشوائي المطلق، لكن الخوارزميات تصنع أعدادًا يصعب تمييزها عن العشوائي بمجرّد النظر إليها.',
            en: 'The computer is a deterministic machine: true randomness is out of reach, but algorithms craft numbers indistinguishable from random at a glance.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما نطاق ما يعيده random.random()؟',
            en: 'What is the range of what random.random() returns?',
          },
          options: [
            { id: 'a', text: { ar: 'من 0.0 متضمّنة إلى 1.0 غير متضمّنة', en: 'From 0.0 included up to 1.0 excluded' } },
            { id: 'b', text: { ar: 'من 0.0 إلى 1.0 والاثنتان متضمّنتان', en: 'From 0.0 to 1.0, both included' } },
            { id: 'c', text: { ar: 'من 0 إلى 100', en: 'From 0 to 100' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'متضمّنًا 0.0 دون 1.0 — قد تحصل على 0.0 لكنك لن تحصل على 1.0 أبدًا. لعدد صحيح في نطاق استخدم randint.',
            en: 'Including 0.0 and excluding 1.0 — you may get 0.0 but never 1.0. For an integer in a range, use randint.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'وعودة إلى الفصل الثاني: النص "0.5" ليس عددًا — أي تابع يحوّله إلى عدد عشري صالح للحساب؟',
            en: 'And back to chapter 2: the text "0.5" is not a number — which function converts it into a computable float?',
          },
          options: [
            { id: 'a', text: { ar: "float('0.5')", en: "float('0.5')" } },
            { id: 'b', text: { ar: "int('0.5')", en: "int('0.5')" } },
            { id: 'c', text: { ar: "str('0.5')", en: "str('0.5')" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'float يقبل النصوص العشرية، أما int فترفضها برسالة ValueError لأن النص ليس عددًا صحيحًا — درس الأمس بالضبط.',
            en: 'float accepts decimal text, while int refuses it with ValueError because the text is not a whole number — exactly yesterday’s lesson.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'لماذا تزرع المنصة random.seed في التمارين العشوائية؟',
            en: 'Why does the platform plant random.seed in random exercises?',
          },
          options: [
            { id: 'a', text: { ar: 'لتثبيت التسلسل فتكون النتائج والاختبارات متطابقة في كل تشغيل', en: 'To pin the sequence so results and tests stay identical on every run' } },
            { id: 'b', text: { ar: 'لتجعل الأرقام أكثر عشوائية', en: 'To make the numbers more random' } },
            { id: 'c', text: { ar: 'لتسريع الحاسوب', en: 'To make the computer faster' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'البذرة تجعل العشوائي قابلًا للتكرار: نفس البذرة، نفس الأرقام، نفس الاختبار — ولو فتحت لعبتك ببذرة ثابتة لتتذكر آخر جولة.',
            en: 'The seed makes randomness reproducible: same seed, same numbers, same test — and a game opened with a fixed seed would remember its last round.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'print(random())',
          right: 'import random\nprint(random.random())',
          note: {
            ar: 'خطآن في سطر واحد: الوحدة لم تُستورد، وحتى بعد الاستيراد فالتابع يُستدعى بتأشيرة النقطة random.random() — تمامًا كـ math.sqrt في درس الأمس.',
            en: 'Two bugs in one line: the module was never imported, and even after importing, the function is called with dot notation random.random() — just like math.sqrt yesterday.',
          },
        },
        {
          wrong: 'random.randint(6, 1)',
          right: 'random.randint(1, 6)',
          note: {
            ar: 'الحد الأدنى أولًا ثم الأعلى: عكسهما يرمي ValueError: empty range — النطاق الفارغ لا يعطي أبدًا عددًا.',
            en: 'Low first, then high: reversing them throws ValueError: empty range — an empty range never yields a number.',
          },
        },
        {
          wrong: 'random.random(1, 6)',
          right: 'random.randint(1, 6)',
          note: {
            ar: 'random.random() بلا وسائط: يعطي كسرًا بين 0.0 و1.0. لعدد صحيح في نطاق كالنرد التابع الصحيح هو randint — وتمرير وسائط لـ random يرمي TypeError.',
            en: 'random.random() takes no arguments: it gives a float between 0.0 and 1.0. For a dice-style integer the right tool is randint — and passing arguments to random throws TypeError.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'البرامج حتمية بطبعها، والأعداد شبه العشوائية تولّدها خوارزمية حتمية لكنها تبدو عشوائية — والوحدة random هي مصدرها.', en: 'Programs are deterministic by nature; pseudorandom numbers come from a deterministic algorithm yet look random — the random module is their source.' },
        { ar: 'random.random() يعطي كسرًا من 0.0 متضمّنة إلى 1.0 غير متضمّنة، وrandint(low, high) عددًا صحيحًا بالطرفين، وchoice يختار من مجموعة.', en: 'random.random() gives a float from 0.0 inclusive to 1.0 exclusive, randint(low, high) an integer with both ends included, and choice picks from a collection.' },
        { ar: 'random.seed(n) تثبّت التسلسل: نفس البذرة تعطي الأرقام نفسها — سرّ الاختبارات المستقرة على المنصة.', en: 'random.seed(n) pins the sequence: the same seed gives the same numbers — the platform’s secret for stable tests.' },
      ],
      reflectPrompt: {
        ar: 'صمّم رامي عملة بلا كود: ما الوحدة؟ وما التابع؟ وما الوسائط؟ وكيف ستختبره بحيث يعطي النتيجة نفسها عند التطوير ثم يتحرر عند اللعب؟',
        en: 'Design a coin flipper without code: which module? Which function? Which arguments? And how would you test it so it repeats during development, then breaks free for play?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch4.s5', pages: 'ص59-60 / pp.59-60' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch4.s5', pages: 'ص59-60 / pp.59-60' },
  ],
} satisfies Lesson;

export default lesson;
