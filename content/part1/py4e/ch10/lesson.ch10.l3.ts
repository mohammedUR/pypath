import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch10.l3 — "Tuple Assignment / إسناد الصفوف"
 * Aligned with PY4E ch10 s3 (إسناد الصفوف).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch10.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 10,
  title: { ar: 'إسناد الصفوف', en: 'Tuple Assignment' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch10.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'خدعة صغيرة يغيرة كل مبرمج قادم من لغات أخرى: تبديل قيمتين بلا متغير مساعد — سطر واحد في بايثون: a, b = b, a. وأجمل من التبديل: توزيع قائمة على متغيرات مسماة، وتقطيع بريد إلكتروني إلى اسم مستخدم ونطاق في سطر واحد. بنهاية الدرس ستكون قادرًا على: إسناد صفوف بطرفيه، والتبديل الفوري، وتفكيك نواتج split، ومعرفة حدّ العدد الذي إذا خالفته صرخ ValueError.',
        en: 'A small trick that embarrasses every programmer arriving from other languages: swapping two values with no helper variable — one line in Python: a, b = b, a. And lovelier than swapping: distributing a list into named variables, and splitting an email address into username and domain in a single line. By the end of this lesson you will be able to: perform two-sided tuple assignment, swap instantly, unpack split results, and know the count limit whose violation makes ValueError scream.',
      },
    },
    {
      kind: 'predict',
      code: "a = 1\nb = 2\na, b = b, a\nprint(a, b)",
      question: {
        ar: 'سطر واحد يبدو متناقضًا: يسند a من b وb من a في اللحظة نفسها. ماذا يطبع؟',
        en: 'One line looks self-contradictory: it assigns a from b and b from a at the same instant. What does it print?',
      },
      reveal: {
        ar: 'يطبع 2 1 — التبديل تم فعلًا. السر أن بايثون يحسب الطرف الأيمن كله أولًا فيصير صفًّا (2, 1)، ثم يسند قيمه إلى الطرف الأيسر بالترتيب. لا حاجة لمتغير ثالث يحفظ القيمة القديمة — الصف أوقف الزمن لحظة.',
        en: 'It prints 2 1 — the swap really happened. The secret is that Python evaluates the entire right side first, turning it into the tuple (2, 1), then assigns its values to the left side in order. No third variable is needed to hold the old value — the tuple froze time for one moment.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'إسناد الطرفين', en: 'Both sides of the sign' },
      chunks: [
        {
          ar: 'إسناد الصفوف يعني أن يكون طرفا التعليمة صفّين: الطرف الأيسر صف متغيرات والطرف الأيمن صف قيم أو تعابير: (x, y) = (1, 2). والأقواس عادة محذوفة فتُكتب x, y = 1, 2 — وهي صحيحة بها أو بلاها. كل قيمة من اليمين تنزل إلى متغيرها المقابل في اليسار.',
          en: 'Tuple assignment means both sides of the statement are tuples: the left side a tuple of variables, the right side a tuple of values or expressions: (x, y) = (1, 2). The parentheses are usually omitted, written x, y = 1, 2 — both are valid. Every value on the right lands in its corresponding variable on the left.',
        },
        {
          ar: 'والأهم: تُحسب كل تعابير الطرف الأيمن قبل أي إسناد. لذلك a, b = b, a يعمل بلا خدع ولا متغير مساعد. لكن انتبه للفخ الشائع: a, b = a, b ليست تبديلًا — كل متغير أخذ قيمته القديمة نفسها. التبديل يطلب تقاطع المصادر: b في اليمين الأول وa في اليمين الثاني.',
          en: 'And the key point: every expression on the right side is evaluated before any assignment happens. That is why a, b = b, a works with no tricks and no helper variable. But watch the common trap: a, b = a, b is not a swap — each variable received its own old value. A swap requires crossed sources: b in the first right position and a in the second.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تفكيك السلاسل', en: 'Unpacking sequences' },
      chunks: [
        {
          ar: "الطرف الأيمن يمكن أن يكون أي سلسلة: نصًّا أو قائمة أو صفًّا. فقائمة m = ['have', 'fun'] تتفكك بـ x, y = m فتصير x تساوي 'have' وy تساوي 'fun' — وكأنك كتبت x = m[0] ثم y = m[1] في سطر واحد. والقوسان الأيسران اختياريان: (x, y) = m تعمل بالضبط مثل x, y = m.",
          en: "The right side can be any sequence: a string, a list, or a tuple. The list m = ['have', 'fun'] unpacks via x, y = m, leaving x equal to 'have' and y equal to 'fun' — as if you wrote x = m[0] then y = m[1] in one line. The left parentheses are optional: (x, y) = m works exactly like x, y = m.",
        },
        {
          ar: "والتطبيق الأشهر: تقطيع البريد. addr.split('@') تعيد قائمة من عنصرين — ما قبل العلامة وما بعدها — فيستقبلهما السطر: uname, domain = addr.split('@') فتصير uname تساوي monty وdomain تساوي python.org للعنوان monty@python.org. نفس الفكرة ستفكك أزواج القاموس في الدرس القادم.",
          en: "And the most famous application: splitting mail. addr.split('@') returns a list of two elements — what precedes the mark and what follows it — and the line receives both: uname, domain = addr.split('@'), leaving uname as monty and domain as python.org for the address monty@python.org. The same idea will unpack dictionary pairs next lesson.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'العدد الصحيح أو الصراخ', en: 'The right count, or a scream' },
      chunks: [
        {
          ar: 'شرط واحد حاكم: عدد المتغيرات يسارًا يساوي عدد القيم يمينًا. وإلا رمى بايثون ValueError: too many values to unpack — كما في a, b = 1, 2, 3 حيث ثلاث قيم لتحميل متغيرين. والعكس صحيح: قيم أقل من المتغيرات ترمي خطأ مشابهًا — لا يمكن تعبئة متغيرين من قيمة واحدة. علاج الحالين واحد: عُدّ الطرفين ووازنهما قبل التشغيل.',
          en: 'One governing condition: the number of variables on the left equals the number of values on the right. Otherwise Python throws ValueError: too many values to unpack — as in a, b = 1, 2, 3, where three values try to load two variables. The converse holds too: fewer values than variables throws a similar error — two variables cannot be filled from one value. The cure for both is the same: count both sides and balance them before running.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تبديل وتفكيك في سطرين', en: 'Swap and unpack in two lines' },
      code: "a = 1\nb = 2\na, b = b, a\nprint(a, b)\naddr = 'monty@python.org'\nuname, domain = addr.split('@')\nprint(uname)\nprint(domain)",
      explanation: {
        ar: 'التبديل اكتمل في سطر واحد لأن اليمين حُسب أولًا فجمد القيم قبل أن تتحرك — والناتج 2 1. ثم split("@") أعاد قائمة من عنصرين فتفكك أيسرها متغيرين: monty وpython.org. لو خلت السلسلة من @ لتعاد قائمة من عنصر واحد وصرخ ValueError: not enough values — النتيجة دائمًا تابعة للعدد.',
        en: 'The swap completed in one line because the right side was evaluated first, freezing the values before anything moved — printing 2 1. Then split("@") returned a two-element list which unpacked into two variables: monty and python.org. Had the string lacked @, a one-element list would return and ValueError: not enough values would scream — the outcome always obeys the count.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.split-unpack',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'العنوان معطى في المحرر: addr = "sara@pypath.io". استخدم split("@") مع إسناد الصفوف لتفكيكه إلى متغيرين uname وdomain، ثم اطبع uname ثم اطبع domain. المتوقع: sara ثم pypath.io.',
        en: 'The address is given in the editor: addr = "sara@pypath.io". Use split("@") with tuple assignment to unpack it into two variables uname and domain, then print uname and print domain. Expected: sara then pypath.io.',
      },
      starterCode: "addr = 'sara@pypath.io'\n# فكّك العنوان إلى uname وdomain ثم اطبعهما / unpack into uname and domain, then print both:\n",
      solution: "addr = 'sara@pypath.io'\nuname, domain = addr.split('@')\nprint(uname)\nprint(domain)",
      tests: [
        {
          id: 't1',
          name: { ar: 'uname يساوي sara', en: 'uname equals sara' },
          code: "assert uname == 'sara', 'expected: sara | actual: %r' % uname",
          expected: 'sara',
        },
        {
          id: 't2',
          name: { ar: 'domain يساوي pypath.io', en: 'domain equals pypath.io' },
          code: "assert domain == 'pypath.io', 'expected: pypath.io | actual: %r' % domain",
          expected: 'pypath.io',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع الاسم ثم النطاق في سطرين', en: 'Username then domain print on two lines' },
          code: "assert 'sara' in __learner_output__ and 'pypath.io' in __learner_output__, ('expected: sara and pypath.io | actual: %r' % __learner_output__)",
          expected: 'sara / pypath.io',
        },
      ],
      hints: [
        { ar: 'split("@") تعيد قائمة من عنصرين — الطرف الأيسر يستقبلها متغيرين مفصولين بفاصلة.', en: 'split("@") returns a two-element list — the left side receives it as two comma-separated variables.' },
        { ar: 'الصيغة: uname, domain = addr.split("@") — لا حاجة لأقواس.', en: 'The form: uname, domain = addr.split("@") — no parentheses needed.' },
        { ar: 'الهيكل:\nuname, domain = addr.split("@")\nprint(uname)\nprint(domain)', en: 'The skeleton:\nuname, domain = addr.split("@")\nprint(uname)\nprint(domain)' },
        { ar: 'uname, domain = addr.split("@")\nprint(uname)\nprint(domain)', en: 'uname, domain = addr.split("@")\nprint(uname)\nprint(domain)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-unpack',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "a = 10\nb = 20\nc = 30\na, b, c = c, a, b\nprint(a)\nprint(b)\nprint(c)\nword, rest = 'ban'.split('a')\nprint(word)\nprint(rest)",
      solution: '30\n10\n20\nb\nn',
      answer: '30\n10\n20\nb\nn',
      hints: [
        { ar: 'اليمين يُحسب أولًا: صف (30, 10, 20) ثم يوزع بالترتيب.', en: 'The right side computes first: the tuple (30, 10, 20) then distributes in order.' },
        { ar: "السؤال الثاني: 'ban'.split('a') يقسم عند كل a.", en: "Second question: 'ban'.split('a') cuts at every a." },
        { ar: 'القطع عند a تعطي قائمتين: b وn — الأولى لword والثانية لrest.', en: 'Cutting at a gives two pieces: b and n — the first for word, the second for rest.' },
        { ar: 'الخرْج:\n30\n10\n20\nb\nn', en: 'The output:\n30\n10\n20\nb\nn' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-unpack-error',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا يحدث عند تنفيذ a, b = 1, 2, 3؟',
        en: 'What happens when a, b = 1, 2, 3 runs?',
      },
      options: [
        { id: 'a', text: { ar: 'ValueError: too many values to unpack — ثلاث قيم لتحميل متغيرين', en: 'ValueError: too many values to unpack — three values for two variables' } },
        { id: 'b', text: { ar: 'a تساوي 1 وb تساوي 2 والثالثة تُهمل بهدوء', en: 'a becomes 1, b becomes 2, and the third is silently ignored' } },
        { id: 'c', text: { ar: 'SyntaxError قبل التشغيل — السطر غير صالح قواعديًا', en: 'SyntaxError before running — the line is grammatically invalid' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الشكل قواعديًا سليم — الفساد في العدد لا في القواعد.', en: 'The shape is grammatically fine — the corruption is in the count, not the grammar.' },
        { ar: 'الخطأ يظهر أثناء التشغيل لا قبله.', en: 'The error appears at runtime, not before it.' },
        { ar: 'اقرأ الرسالة: too many values — كثرة لا نقص.', en: 'Read the message: too many values — surplus, not shortage.' },
        { ar: 'الجواب: ValueError: too many values to unpack.', en: 'Answer: ValueError: too many values to unpack.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-split',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: التابع ____ يقسم السلسلة عند محرف معيّن ويعيد قائمة من القطع — وعليه اعتمدنا تفكيك عنوان البريد عند @.',
        en: 'Fill the blank with one word: the ____ method splits the string at a given character and returns a list of pieces — we relied on it to unpack the email address at @.',
      },
      answer: 'split',
      solution: 'split',
      hints: [
        { ar: 'نفس التابع الذي قطع أسطر الملفات إلى كلمات في الفصل السابع.', en: 'The same method that cut file lines into words in chapter 7.' },
        { ar: 'يُستدعى بنقطة على السلسلة ويعيد قائمة لا صفًّا.', en: 'It is called with a dot on the string and returns a list, not a tuple.' },
        { ar: 'خمسة أحرف ويبدأ بـ s.', en: 'Five letters and starts with s.' },
        { ar: 'الجواب: split', en: 'Answer: split' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — فكّك كل شيء\n# Your playground — unpack everything\n\nx, y = 3, 4\nx, y = y, x\nprint(x, y)\n\ncountry, city = "Egypt, Cairo".split(", ")\nprint(city, country)\n\nfirst, second, third = 10, 20, 30\nprint(first + second + third)',
      prompt: {
        ar: 'جرّب بنفسك: تبديل ثلاثة متغيرات بترتيب دائري (a, b, c = c, a, b)، وفكّك سلسلة فيها فاصلة، ثم حاول عمدًا تفكيكًا غير متوازن واقرأ رسالة ValueError بدقة — من المتهم ومن الضحية؟ لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: rotate three variables (a, b, c = c, a, b), unpack a comma-bearing string, then deliberately attempt an unbalanced unpack and read the ValueError carefully — who is accused and who is the victim? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'بعد تنفيذ x, y = 3, 7 — ماذا يطبع print(x)؟',
            en: 'After running x, y = 3, 7 — what does print(x) show?',
          },
          options: [
            { id: 'a', text: { ar: '3 — أول قيمة للطرف الأيسر الأول', en: '3 — the first value to the first left variable' } },
            { id: 'b', text: { ar: '7 — لأن الإسناد يبدأ من اليمين', en: '7 — because assignment starts from the right' } },
            { id: 'c', text: { ar: '3, 7 — الصف كله يُطبع', en: '3, 7 — the whole tuple prints' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الترتيب محفوظ: القيمة الأولى تنزل في المتغير الأول والثانية في الثاني — من اليسار إلى اليسار.',
            en: 'Order is preserved: the first value lands in the first variable, the second in the second — left position to left variable.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثالث: int("x") يرمي أي استثناء — وهو نفسه النوع الذي يرميه التفكيك غير المتوازن؟',
            en: 'From chapter 3: int("x") throws which exception — the same kind thrown by an unbalanced unpack?',
          },
          options: [
            { id: 'a', text: { ar: 'ValueError — القيمة لا تصلح للعملية المطلوبة', en: 'ValueError — the value does not fit the requested operation' } },
            { id: 'b', text: { ar: 'TypeError — النوع نفسه مرفوض', en: 'TypeError — the type itself is rejected' } },
            { id: 'c', text: { ar: 'NameError — الاسم غير معرّف', en: 'NameError — the name is undefined' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'النوع صحيح (نص يُطلب منه أن يصير عددًا) لكن القيمة غير صالحة — ValueError، وأخوها تفكيك ثلاث قيم في متغيرين: الأعداد صحيحة لكن لا موضع لها.',
            en: 'The type is fine (a string asked to become a number) but the value is invalid — ValueError; its sibling is unpacking three values into two variables: the numbers are fine but have no slot.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل السابع: line.split() على سطر نص يعيد ماذا — وبذلك يمكن تفكيكه في متغيرات؟',
            en: 'From chapter 7: what does line.split() return on a text line — and can it be unpacked into variables?',
          },
          options: [
            { id: 'a', text: { ar: 'قائمة كلمات — نعم إن كان عدد الكلمات مساويًا لعدد المتغيرات', en: 'A list of words — yes, if the word count equals the variable count' } },
            { id: 'b', text: { ar: 'نصًّا واحدًا لا يمكن تفكيكه أبدًا', en: 'One string that can never be unpacked' } },
            { id: 'c', text: { ar: 'صفًّا ثابتًا من الكلمات', en: 'A fixed tuple of words' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split ينتج قائمة — وأي سلسلة تنفك: uname, domain = addr.split("@") في هذا الدرس، ومثلها كلمات السطر إن وازنت المتغيرات.',
            en: 'split produces a list — and any sequence unpacks: uname, domain = addr.split("@") in this lesson, and likewise the words of a line if they balance the variables.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: '(x, y) = (1, 2) بدون أقواس — أي x, y = 1, 2 — هل تصح؟',
            en: '(x, y) = (1, 2) without parentheses — that is, x, y = 1, 2 — is it valid?',
          },
          options: [
            { id: 'a', text: { ar: 'تصح — الأقواس اختيارية في الطرفين', en: 'Valid — parentheses are optional on both sides' } },
            { id: 'b', text: { ar: 'تصح يمينًا فقط ويجب ألا تُحذف يسارًا', en: 'Valid on the right only; the left must keep them' } },
            { id: 'c', text: { ar: 'لا تصح — الأقواس إجبارية دائمًا', en: 'Invalid — parentheses are always mandatory' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يهمل الأقواس عادة لأن الفواصل وحدها تكفي لفهم الصف — لكنها تبقى صحيحة إن وُضعت، فاختر ما يقرأه عينك أريح.',
            en: 'The book usually omits the parentheses because commas alone make the tuple legible — yet they stay valid if written, so choose whichever reads more comfortably.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'a, b = 1, 2, 3',
          right: 'a, b = 1, 2',
          note: {
            ar: 'ثلاث قيم لتحميل متغيرين يرمي ValueError: too many values to unpack — وازن الطرفين: متغيرات يسارًا = قيم يمينًا.',
            en: 'Three values loading two variables throws ValueError: too many values to unpack — balance the sides: left variables = right values.',
          },
        },
        {
          wrong: 'a, b = a, b',
          right: 'a, b = b, a',
          note: {
            ar: 'نفس القيمة إلى نفس المتغير لا تبديل — التبديل يطلب تقاطع المصادر: b في اليمين الأول وa في الثاني، لأن اليمين يُحسب كله قبل أي إسناد.',
            en: 'Same value to the same variable is no swap — swapping requires crossed sources: b in the first right position, a in the second, because the right side is fully evaluated before any assignment.',
          },
        },
        {
          wrong: "uname, domain = 'monty.python.org'.split('@')",
          right: "addr = 'monty@python.org'\nuname, domain = addr.split('@')",
          note: {
            ar: "بلا @ تعيد split قائمة من عنصر واحد فيرمي ValueError: not enough values to unpack (expected 2, got 1). تأكد أن الفاصل موجود أو استخدم أدوات الفصل السادس find والتجزئة.",
            en: "Without @, split returns a one-element list and throws ValueError: not enough values to unpack (expected 2, got 1). Make sure the separator exists, or reach for chapter-6 find and slicing.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'إسناد الصفوف: الطرف الأيمن يُحسب أولًا كصف ثم تُسند قيمه للمتغيرات المقابلة — والأقواس اختيارية.', en: 'Tuple assignment: the right side is evaluated first as a tuple, then its values land in the matching variables — parentheses optional.' },
        { ar: 'أي سلسلة تفكك: نص وقائمة وصف — وناتج split أسيرك الأول: uname, domain = addr.split("@").', en: 'Any sequence unpacks: string, list, tuple — and the result of split is your first captive: uname, domain = addr.split("@").' },
        { ar: 'العدد قانون: متغيرات يسارًا = قيم يمينًا وإلا ValueError — من عائلة int("x") في الفصل الثالث.', en: 'Count is law: left variables = right values or ValueError — the family of int("x") from chapter 3.' },
      ],
      reflectPrompt: {
        ar: 'سطر a, b = b, a يسعد المبتدئ ويحير قادمي اللغات الأخرى. صُغ بجملتين: ماذا يحسب بايثون أولًا؟ ولماذا لا يحتاج التبديل متغيرًا ثالثًا؟',
        en: 'The line a, b = b, a delights beginners and puzzles arrivals from other languages. Phrase in two sentences: what does Python evaluate first, and why does swapping need no third variable?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch10.s3', pages: 'ص160 / pp.160' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch10.s3', pages: 'ص160 / pp.160' },
  ],
} satisfies Lesson;

export default lesson;
