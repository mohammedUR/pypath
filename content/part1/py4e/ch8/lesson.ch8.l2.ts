import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch8.l2 — "Traversing Lists, Operations, and Slicing /
 * المرور على القوائم والعمليات والتجزئة"
 * Aligned with PY4E ch8 s3 (المرور على عناصر قائمة), s4 (العمليات على القوائم),
 * s5 (تجزئة القوائم). All expression is original.
 */
const lesson = {
  id: 'py4e.ch8.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 8,
  title: { ar: 'المرور على القوائم والعمليات والتجزئة', en: 'Traversing Lists, Operations, and Slicing' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch8.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قائمة من عناصر بلا مرور على عناصرها هي مكتبة نُقلت إليك كاملة ولم تفتح كتابًا واحدًا فيها. اليوم تُتقن ثلاث أدوات تفتح صناديق القوائم: حلقة for التي تمشي عنصرًا عنصرًا (وتحدّثها بالفهارس عند الحاجة)، والعاملان + و* اللذان يجمعان ويكرران القوائم، وعامل التجزئة [n:m] الذي يقصّ منها أجزاء دقيقة. بنهاية الدرس ستكون قادرًا على: المرور على قوائم وقراءتها وتحديثها، ودمج القوائم وتكرارها وفحص العضوية، وقصّ النسخ الجزئية والتعديل بالتجزئة.',
        en: 'A list full of elements you never traverse is a library handed to you unopened. Today you master three tools that open the list boxes: the for loop that walks element by element (and updates by index when needed), the + and * operators that concatenate and repeat lists, and the slice operator [n:m] that cuts precise pieces. By the end of this lesson you will be able to: traverse and update lists, concatenate, repeat and test membership, and cut partial copies and modify through slices.',
      },
    },
    {
      kind: 'predict',
      code: "t = ['a', 'b', 'c', 'd']\nprint(t[1:3])",
      question: {
        ar: 'نفس عامل التجزئة الذي قصّص السلاسل في الفصل السادس يعمل هنا. كم عنصرًا سيطبع؟ وما هي؟',
        en: 'The same slice operator that carved strings in chapter 6 works here too. How many elements will it print? And which?',
      },
      reveal: {
        ar: "يطبع ['b', 'c'] — عنصران. التجزئة تشمل الفهرس الأول وتستثني الثاني: بدأت عند 1 وتوقفت قبل 3. قاعدة «يشمل الأول ويستثني الأخير» انتقلت معك من السلاسل إلى القوائم دون تعديل.",
        en: "It prints ['b', 'c'] — two elements. A slice includes the first index and excludes the second: it started at 1 and stopped before 3. The 'include the first, exclude the last' rule traveled from strings to lists without a change.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'المرور على القائمة: للقراءة وللتحديث', en: 'Traversing a list: for reading and for updating' },
      chunks: [
        {
          ar: 'حلقة for هي الطريقة الأكثر شيوعًا للمرور على قائمة — بنفس النمط الذي مرّت به على محارف السلاسل وأسطر الملفات: for cheese in cheeses: متغير التكرار يأخذ عنصرًا في كل دورة. هذا مثالي للقراءة، ويُنفَّذ جسم الحلقة مرة واحدة لكل عنصر — وحين تكون القائمة فارغة لا يُنفَّذ الجسم مطلقًا.',
          en: 'The for loop is the most common way to traverse a list — the same pattern that walked string characters and file lines: for cheese in cheeses: the iteration variable takes one element per pass. This is perfect for reading, the body runs once per element — and if the list is empty the body never runs.',
        },
        {
          ar: 'لكن إن أردت كتابة عناصر القائمة أو تحديثها فأنت بحاجة إلى الفهارس — والثنائية المعتادة من الفصل الخامس: for i in range(len(numbers)): ثم numbers[i] = numbers[i] * 2 داخل الجسم. هنا يقرأ i الفهرس، فتقرأ القيمة القديمة وتسند الجديدة في المكان نفسه — هذه هي حيلة التحديث التي لا يستطيعها for cheese in cheeses وحدها.',
          en: 'But to write or update list elements you need the indices — the familiar chapter-5 duo: for i in range(len(numbers)): then numbers[i] = numbers[i] * 2 inside the body. Here i holds the index, so you read the old value and assign the new one in the same spot — an upgrade that for cheese in cheeses alone cannot perform.',
        },
        {
          ar: 'وتذكّر من الدرس الماضي أن القائمة المتداخلة عنصر واحد: [\'spam\', 1, [\'Brie\'], [1, 2, 3]] طولها 4، وسيمرّ على القائمة المتداخلة كعنصر مفرد في دورة واحدة. وrange(len(numbers)) ينتج الفهارس من 0 إلى الطول ناقص واحد — بالضبط كل فهرس مشروع.',
          en: "And recall from last lesson that a nested list is one element: ['spam', 1, ['Brie'], [1, 2, 3]] has length 4, and the traversal will visit each nested list as a single element in a single pass. Meanwhile range(len(numbers)) produces indices from 0 to length minus one — exactly every legal index.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'العمليات: الجمع والتكرار والعضوية', en: 'Operations: concatenation, repetition, membership' },
      chunks: [
        {
          ar: 'عامل الجمع + يصل القوائم بعضها ببعض (concatenation) قائمةً جديدة بالترتيب: a = [1, 2, 3] وb = [4, 5, 6] فيصير c = a + b هي [1, 2, 3, 4, 5, 6]. والقائمتان الأصليتان لا تتغيران — الجمع ينتج قائمة ثالثة، تمامًا كما جمع السلاسل النصية نصوصًا جديدة في الفصل الثاني.',
          en: 'The + operator concatenates lists into a brand-new one, in order: a = [1, 2, 3] and b = [4, 5, 6] make c = a + b become [1, 2, 3, 4, 5, 6]. The two originals are untouched — concatenation yields a third list, exactly as it did for strings back in chapter 2.',
        },
        {
          ar: 'وعامل النجمة * يكرر القائمة عددًا معلومًا من المرات: [0] * 4 تعطي [0, 0, 0, 0]، و[1, 2, 3] * 3 تعطي تسعة عناصر هي ثلاث نسخ متراصة. أما عامل in الذي فحص حرفًا في سلسلة فيفحص العضوية في القائمة: \'Edam\' in cheeses تعطي True و\'Brie\' في القائمة نفسها تعطي False.',
          en: "The star operator * repeats a list a given number of times: [0] * 4 gives [0, 0, 0, 0], and [1, 2, 3] * 3 gives nine elements — three copies glued together. And the in operator that probed characters in strings now probes membership in lists: 'Edam' in cheeses gives True while 'Brie' in the same list gives False.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التجزئة: قصّ النسخ وتحديث القطع', en: 'Slicing: cutting copies and updating pieces' },
      chunks: [
        {
          ar: 'عامل التجزئة يعمل على القوائم كما عمل على السلاسل: t[1:3] تشمل الفهرس 1 وتستثني 3. وإذا تجاهلت الفهرس الأول بدأت من بداية القائمة (t[:4])، وإذا تجاهلت الثاني استمرت حتى النهاية (t[3:])، وإذا تجاهلت الاثنين [:] فحصلت على نسخة مطابقة للقائمة كلها — احفظ هذه النسخة جيدًا، فستكون صديقك الآمن حين نلتقي بالتسمية البديلة.',
          en: 'The slice operator works on lists as it did on strings: t[1:3] includes index 1 and excludes 3. Omit the first index and the slice starts at the beginning (t[:4]); omit the second and it runs to the end (t[3:]); omit both and [:] hands you a full copy of the list — keep that copy in mind, it will be your safe friend when aliasing arrives.',
        },
        {
          ar: 'ولأن القوائم قابلة للتعديل، فمن المفيد غالبًا نسخ القائمة قبل إجراء عمليات عليها. والأجمل أن التجزئة تصلح نفسها للجانب الأيسر من الإسناد فتحدّث عدة عناصر دفعة واحدة: t[1:3] = [\'x\', \'y\'] استبدلت العنصرين الثاني والثالث فصارت القائمة [\'a\', \'x\', \'y\', \'d\', \'e\', \'f\'].',
          en: "Because lists are mutable, it is often wise to copy a list before operating on it. Even better: a slice may sit on the left side of an assignment and update several elements at once: t[1:3] = ['x', 'y'] replaced the second and third elements, leaving ['a', 'x', 'y', 'd', 'e', 'f'].",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'امشِ، اجمع، كرّر، اقطع', en: 'Walk, join, repeat, cut' },
      code: "numbers = [1, 2, 3]\nfor i in range(len(numbers)):\n    numbers[i] = numbers[i] * 2\nprint(numbers)\n\nc = [1, 2, 3] + [4, 5, 6]\nprint(c)\nprint([0] * 4)\nprint('Edam' in ['Cheddar', 'Edam'])\n\nt = ['a', 'b', 'c', 'd', 'e', 'f']\nprint(t[1:3])\nprint(t[:4])\nprint(t[3:])\nt[1:3] = ['x', 'y']\nprint(t)",
      explanation: {
        ar: "أولًا: الحلقة بالفهارس ضاعفت كل عنصر في مكانه فصارت [2, 4, 6] — التحديث عبر i. ثانيًا: + ولّد قائمة سداسية جديدة، و* رباعت الأصفار، وin جابت True. ثالثًا: التجزئة قصّت ['b', 'c'] ثم أول أربعة ثم من 3 إلى النهاية، ثم أُسندت قطعة جديدة مكان القطعة الأولى — ستة أدوات في برنامج واحد.",
        en: "First: the indexed loop doubled every element in place, leaving [2, 4, 6] — updating through i. Second: + produced a fresh six-element list, * quadrupled the zero, and in answered True. Third: slicing cut ['b', 'c'], then the first four, then from 3 to the end, then a new piece was assigned over the first one — six tools in one program.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.update-by-index',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'القائمة numbers معطاة بالقيم [1, 2, 3]. حلّثها بحلقة for تستخدم الفهارس (for i in range(len(numbers)):) بحيث تضاعف قيمة كل عنصر في مكانه، ثم اطبع القائمة. الخرْج المتوقع: [2, 4, 6].',
        en: 'The list numbers is given as [1, 2, 3]. Traverse it with a for loop using the indices (for i in range(len(numbers)):) so that every element doubles in place, then print the list. Expected output: [2, 4, 6].',
      },
      starterCode: 'numbers = [1, 2, 3]\n# ضاعف كل عنصر عبر الفهرس ثم اطبع / double every element via the index then print\n',
      solution: 'numbers = [1, 2, 3]\nfor i in range(len(numbers)):\n    numbers[i] = numbers[i] * 2\nprint(numbers)',
      tests: [
        {
          id: 't1',
          name: { ar: 'القائمة صارت [2, 4, 6]', en: 'The list became [2, 4, 6]' },
          code: "assert numbers == [2, 4, 6], 'expected: [2, 4, 6] | actual: %r' % numbers",
          expected: '[2, 4, 6]',
        },
        {
          id: 't2',
          name: { ar: 'القائمة مطبوعة', en: 'The list is printed' },
          code: "assert '[2, 4, 6]' in __learner_output__, ('expected: [2, 4, 6] | actual: %r' % __learner_output__)",
          expected: '[2, 4, 6]',
        },
      ],
      hints: [
        { ar: 'تحديث العناصر يحتاج الفهارس — لذلك for cheese in cheeses وحدها لا تكفي هنا.', en: 'Updating elements needs indices — that is why for cheese in cheeses alone will not do here.' },
        { ar: 'داخل الجسم: اقرأ القيمة القديمة بـ numbers[i] وأسند إليها ضعفها.', en: 'Inside the body: read the old value with numbers[i] and assign back its double.' },
        { ar: 'الهيكل:\nfor i in range(len(numbers)):\n    numbers[i] = numbers[i] * 2\nprint(numbers)', en: 'The skeleton:\nfor i in range(len(numbers)):\n    numbers[i] = numbers[i] * 2\nprint(numbers)' },
        { ar: 'numbers = [1, 2, 3]\nfor i in range(len(numbers)):\n    numbers[i] = numbers[i] * 2\nprint(numbers)', en: 'numbers = [1, 2, 3]\nfor i in range(len(numbers)):\n    numbers[i] = numbers[i] * 2\nprint(numbers)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-slice-membership',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "t = ['a', 'b', 'c', 'd', 'e', 'f']\nu = t[1:3]\nprint(len(u))\nprint(u[0])\nprint('c' in t)\nprint('z' in t)",
      solution: '2\nb\nTrue\nFalse',
      answer: '2\nb\nTrue\nFalse',
      hints: [
        { ar: 'التجزئة [1:3] تشمل 1 وتستثني 3 — فكم عنصرًا فيها؟', en: 'The slice [1:3] includes 1 and excludes 3 — how many elements is that?' },
        { ar: 'u قائمة مستقلة بعنصرين؛ أولها عنصر الفهرس 1 الأصلي.', en: 'u is an independent two-element list; its head is the original index-1 element.' },
        { ar: 'عامل in يسأل: هل العنصر موجود في القائمة؟', en: 'The in operator asks: is the element inside the list?' },
        { ar: 'الخرْج:\n2\nb\nTrue\nFalse', en: 'The output:\n2\nb\nTrue\nFalse' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-repeat',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا تعطي العبارة [0] * 4؟',
        en: 'What does the expression [0] * 4 give?',
      },
      options: [
        { id: 'a', text: { ar: '[0, 0, 0, 0] — أربع نسخ من القائمة', en: '[0, 0, 0, 0] — four copies of the list' } },
        { id: 'b', text: { ar: '0 — حاصل ضرب العناصر', en: '0 — the product of the elements' } },
        { id: 'c', text: { ar: '[4] — القائمة مضروبة في نفسها', en: '[4] — the list multiplied by itself' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'النجمة مع قائمة تعني التكرار لا الضرب الحسابي.', en: 'The star with a list means repetition, not arithmetic multiplication.' },
        { ar: 'النتيجة قائمة أطول، لا عدد.', en: 'The result is a longer list, not a number.' },
        { ar: 'عدد التكرارات على يمين النجمة يحدد طول القائمة الناتجة.', en: 'The repetition count on the right of the star sets the resulting list length.' },
        { ar: 'الجواب: أ — [0, 0, 0, 0].', en: 'Answer: a — [0, 0, 0, 0].' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-repeat-op',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'املأ الفرز: العامل الذي يكرر قائمة عددًا معلومًا من المرات، كما في [0] ____ 4، هو عامل ______.',
        en: 'Fill in the blank: the operator that repeats a list a given number of times, as in [0] ____ 4, is the ______ operator.',
      },
      answer: '*',
      solution: '*',
      hints: [
        { ar: 'هو نفس عامل الضرب الحسابي — لكن مع قائمة صار معناه التكرار.', en: 'It is the same arithmetic multiplication operator — but with a list it means repetition.' },
        { ar: 'رمز واحد يكتب بحرف النجمة.', en: 'A single symbol typed as a star.' },
        { ar: 'جرّب [0] * 4 في الملعب لترى النتيجة.', en: 'Try [0] * 4 in the sandbox to see the result.' },
        { ar: 'الجواب: *', en: 'Answer: *' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — امشِ واجمع واقطع\n# Your playground — walk, join and cut\n\nletters = [\'a\', \'b\', \'c\', \'d\', \'e\']\nfor ch in letters:\n    print(ch)\n\nprint(letters + letters)\nprint(letters * 2)\nprint(\'d\' in letters)\n\nprint(letters[1:4])\nprint(letters[:2])\nprint(letters[2:])\nprint(letters[:])',
      prompt: {
        ar: 'جرّب بنفسك: مرّ على القائمة بحلقتين — مرة بالعنصر ومرة بالفهرس — وقارن. ثم اجمع قائمتين مختلفتين، وكرر قائمة، وافحص عضوية عناصر غير موجودة. وأخيرًا اقطع بكل أشكال التجزئة وجرّب t[1:3] = [\'Z\'] على قائمتك: كم عنصرًا اختفى؟ لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: traverse the list twice — once by element, once by index — and compare. Then join two different lists, repeat one, and probe membership of missing elements. Finally cut with every slice shape and try t[1:3] = ['Z'] on your list: how many elements vanished? No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل الخامس: في for i in range(len(numbers)): — ماذا ينتج range(len(numbers)) لقائمة طولها 3؟',
            en: 'Back to chapter 5: in for i in range(len(numbers)): — what does range(len(numbers)) produce for a list of length 3?',
          },
          options: [
            { id: 'a', text: { ar: 'الفهارس 0 و1 و2', en: 'The indices 0, 1 and 2' } },
            { id: 'b', text: { ar: 'عناصر القائمة نفسها', en: 'The list elements themselves' } },
            { id: 'c', text: { ar: 'الأعداد 1 و2 و3', en: 'The numbers 1, 2 and 3' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'range(len(numbers)) يعطي كل فهرس مشروع من 0 إلى الطول ناقص واحد — ولهذا يجلس i على مقعد الفهرس تمامًا ليقرأ ويكتب.',
            en: 'range(len(numbers)) yields every legal index from 0 to length minus one — which is exactly why i sits perfectly on the index seat to read and write.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرق بين c = a + b وt.append(x) في تغييرهما للقوائم؟',
            en: 'What is the difference between c = a + b and t.append(x) regarding how they change lists?',
          },
          options: [
            { id: 'a', text: { ar: '+ ينشئ قائمة جديدة ويترك الأصلين؛ والطرائق تعدّل في المكان', en: '+ creates a new list and leaves both originals; methods modify in place' } },
            { id: 'b', text: { ar: 'كلاهما يعدّل القائمة الأصلية في مكانها', en: 'Both modify the original list in place' } },
            { id: 'c', text: { ar: 'كلاهما ينشئ قائمة جديدة دائمًا', en: 'Both always create a new list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الجمع يعيد قائمة جديدة بالكامل، بينما append يلصق بالقائمة الأصلية نفسها — الفرق الذي سيصير جوهريًا في درس التوابع القادم.',
            en: 'Concatenation returns a brand-new list, while append glues onto the very same original — a difference that becomes crucial in the next lesson on methods.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 't = [\'a\', \'b\', \'c\', \'d\'] — كم عنصرًا في t[1:3]؟',
            en: "t = ['a', 'b', 'c', 'd'] — how many elements are in t[1:3]?",
          },
          options: [
            { id: 'a', text: { ar: 'عنصران — التجزئة تشمل الأول وتستثني الثاني', en: 'Two — the slice includes the first index and excludes the second' } },
            { id: 'b', text: { ar: 'ثلاثة — لأن الفهرسين ضمن الحدود', en: 'Three — because both indices are within bounds' } },
            { id: 'c', text: { ar: 'أربعة — التجزئة تنسخ الكل', en: 'Four — slicing copies everything' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'بدأت عند 1 وتوقفت قبل 3: العنصران b وc — نفس قاعدة السلاسل النصية التي حفرتها في الفصل السادس.',
            en: 'It starts at 1 and stops before 3: the two elements b and c — the same string rule you drilled in chapter 6.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل السادس: ماذا تعطي \'abcdef\'[1:3] على سلسلة نصية؟',
            en: "From chapter 6: what does 'abcdef'[1:3] give on a string?",
          },
          options: [
            { id: 'a', text: { ar: "'bc' — نفس القاعدة: يشمل الأول ويستثني الثاني", en: "'bc' — the same rule: include the first, exclude the second" } },
            { id: 'b', text: { ar: "'bcd' — ثلاثة محارف", en: "'bcd' — three characters" } },
            { id: 'c', text: { ar: "['b', 'c'] — قائمة", en: "['b', 'c'] — a list" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عامل التجزئة واحد والقاعدة واحدة على كل السلاسل — الفرق أن السلسلة تعطي سلسلة والقائمة تعطي قائمة.',
            en: 'One slice operator, one rule over all sequences — the only difference: a string slice gives a string, a list slice gives a list.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'nums = [1, 2, 3]\nfor n in nums:\n    n = n * 2',
          right: 'nums = [1, 2, 3]\nfor i in range(len(nums)):\n    nums[i] = nums[i] * 2',
          note: {
            ar: 'تغيير متغير التكرار n يغيّر الاسم لا العنصر — القائمة تبقى كما هي. للتحديث استخدم الفهرس: nums[i] = ....',
            en: 'Changing the iteration variable n changes the name, not the element — the list stays untouched. To update, go through the index: nums[i] = ...',
          },
        },
        {
          wrong: 'c = [1, 2] + 3',
          right: 'c = [1, 2] + [3]',
          note: {
            ar: '+ يصل قائمة بقائمة: اليمين يجب أن يكون قائمة بين قوسين. إضافة عدد مجرد ترمي TypeError: can only concatenate list to list.',
            en: '+ concatenates a list to a list: the right side must be a bracketed list. Adding a bare number throws TypeError: can only concatenate list to list.',
          },
        },
        {
          wrong: 't = [\'a\', \'b\', \'c\']\npiece = t[1:2]\nprint(len(piece) == 2)',
          right: 't = [\'a\', \'b\', \'c\']\npiece = t[1:3]\nprint(len(piece) == 2)',
          note: {
            ar: 'التجزئة [1:2] تعطي عنصرًا واحدًا لأن الفهرس الثاني مستثنى دائمًا — من يريد عنصرين من 1 إلى 2 يقصّ [1:3].',
            en: 'The slice [1:2] yields a single element because the second index is always excluded — for two elements from 1 to 2, cut [1:3].',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'للقراءة: for cheese in cheeses يمشي عنصرًا عنصرًا (ويفوت الفارغة صمتًا) — وللتحديث: for i in range(len(t)) مع إسناد t[i].', en: 'For reading: for cheese in cheeses walks element by element (and skips empties silently) — for updating: for i in range(len(t)) with assignment t[i].' },
        { ar: '+ يصل قائمتين في قائمة جديدة، و* يكرر القائمة، وin يفحص العضوية بجواب True/False.', en: '+ concatenates two lists into a new one, * repeats a list, and in probes membership with a True/False answer.' },
        { ar: 'التجزئة [n:m] تشمل n وتستثني m، والفراغات تعطي البداية والنهاية، و[:] نسخة كاملة — ويمكن للتجزئة أن تسند وتحدث عدة عناصر دفعة واحدة.', en: 'The slice [n:m] includes n and excludes m, omissions give the start and the end, [:] is a full copy — and a slice can sit on the left of an assignment updating several elements at once.' },
      ],
      reflectPrompt: {
        ar: 'اختر مهمة يومية من قائمتين تُدمجان (مثل قائمة مشتريات وقائمة مخزون) وصُغ الجمع بعامل +. ثم اختر قائمة تريد تصفير عناصرها جميعًا — أي نمط تستخدم: المرور بالعناصر أم بالفهارس؟ ولماذا؟',
        en: 'Pick a daily task where two lists merge (like a shopping list and a stock list) and phrase the concatenation with +. Then pick a list whose elements you want to zero out — which pattern do you use: by element or by index? Why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch8.s3', pages: 'ص121 / pp.121' },
        { book: 'PY4E', section: 'py4e.ch8.s4', pages: 'ص122 / pp.122' },
        { book: 'PY4E', section: 'py4e.ch8.s5', pages: 'ص122 / pp.122' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch8.s3', pages: 'ص121 / pp.121' },
    { book: 'PY4E', section: 'py4e.ch8.s4', pages: 'ص122 / pp.122' },
    { book: 'PY4E', section: 'py4e.ch8.s5', pages: 'ص122 / pp.122' },
  ],
} satisfies Lesson;

export default lesson;
