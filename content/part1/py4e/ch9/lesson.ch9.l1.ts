import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch9.l1 — "Dictionaries: Keys and Values / القاموس: المفاتيح والقيم"
 * Aligned with PY4E ch9 s1 (استخدام القواميس), book p.143.
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch9.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 9,
  title: { ar: 'القاموس: المفاتيح والقيم', en: 'Dictionaries: Keys and Values' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch8.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: "القوائم رتّبت العالم بأرقامها: العنصر الأول والثاني والثالث. لكن كثيرًا من بيانات الحياة لا ترقيمًا لها: كلمة تترجم إلى كلمة، ورمز DNA يترجم إلى حمض أميني، وطالب له درجة. القاموس هو بنية بايثون لهذه الترجمات: بدل الفهرس الرقمي تختار مفتاحًا من أي نوع، وخلفه قيمة تنتظرك. بنهاية الدرس ستكون قادرًا على: إنشاء قاموس فارغ بـ dict() أو {}، وإضافة أزواج مفتاح-قيمة، وجلب القيمة بمفتاحها، وعدّ الأزواج بـ len، والسؤال بـ in عن وجود مفتاح.",
        en: 'Lists ordered the world with numbers: first item, second, third. But much of life has no numbering: a word translates to a word, a DNA codon translates to an amino acid, a student has a grade. The dictionary is the Python structure for such translations: instead of a numeric index you pick a key of any type, and behind it a value waits for you. By the end of this lesson you will be able to: create an empty dictionary with dict() or {}, add key-value pairs, fetch a value by its key, count pairs with len, and ask with in whether a key exists.',
      },
    },
    {
      kind: 'predict',
      code: "counts = {'jan': 100, 'annie': 42}\nprint(counts['annie'])\nprint(len(counts))\nprint('jan' in counts)",
      question: {
        ar: 'ماذا يطبع الأسطر الثلاثة؟ تلميح: الأقواس المربعة هنا لا تجلب بموقع رقمي.',
        en: 'What do the three lines print? Hint: the square brackets here do not fetch by numeric position.',
      },
      reveal: {
        ar: 'يطبع 42 ثم 2 ثم True. القاموس يربط كل مفتاح بقيمة: jan يرتبط بـ 100 وannie بـ 42، فسؤال annie أجاب 42. وlen تعدّ الأزواج لا العناصر المفردة: زوجان فأجابت 2. وin سأل: هل jan مفتاح هنا؟ نعم.',
        en: 'It prints 42, then 2, then True. The dictionary ties every key to a value: jan is tied to 100 and annie to 42, so asking about annie answered 42. And len counts pairs, not lone elements: two pairs, so it answered 2. And in asked: is jan a key here? Yes.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'القاموس: خريطة من مفتاح إلى قيمة', en: 'A dictionary: a map from key to value' },
      chunks: [
        {
          ar: "القاموس يشبه القائمة لكنه أكثر شمولًا: فهارس القائمة أعداد صحيحة حصرًا، أما مفاتيح القاموس فمن أي نوع. تخيّله خريطة تربط مجموعة مفاتيح بمجموعة قيم، وارتباط المفتاح بقيمته يسمى زوج مفتاح-قيمة (key-value pair) وأحيانًا عنصرًا (item). كما يترجم القاموس اللغوي كلمة إنكليزية إلى مقابلها الإسباني، يترجم قاموس بايثون أي مفتاح إلى قيمته — فالقاموس بمعناه العام آلة ترجمة.",
          en: 'A dictionary is like a list but more general: list indices are integers only, while dictionary keys can be of any type. Picture a map tying a set of keys to a set of values; the association of a key with its value is called a key-value pair, sometimes an item. Just as a language dictionary translates an English word into its Spanish counterpart, a Python dictionary translates any key into its value — a dictionary in the general sense is a translation machine.',
        },
        {
          ar: "ينشئ التابع الجاهز dict() قاموسًا فارغًا بلا أي عناصر — واحذر: لا تسمِّ متغيرك dict أبدًا فهو اسم تابع جاهز. وتمثل أقواس المجموعة {} أيضًا قاموسًا فارغًا. ولإضافة عنصر نستخدم الأقواس المربعة كما في القوائم لكن بالمفتاح: eng2sp['one'] = 'uno' ينشئ عنصرًا جديدًا، وعند طباعة القاموس يظهر الزوج والمفتاح والقيمة بينهما نقطتان: {'one': 'uno'}.",
          en: "The built-in dict() creates an empty dictionary with no items — beware: never name your variable dict, it is a built-in function name. The curly braces {} also represent an empty dictionary. To add an item we use the square brackets as in lists but with a key: eng2sp['one'] = 'uno' creates a new pair, and printing the dictionary shows the pair with a colon between key and value: {'one': 'uno'}.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المفتاح يصنع الاختلاف، لا الترتيب', en: 'The key makes the difference, not the order' },
      chunks: [
        {
          ar: "أنشأنا قاموسًا بثلاثة عناصر: eng2sp = {'one': 'uno', 'two': 'dos', 'three': 'tres'} فتفاجأنا طباعته: الترتيب لم يكن الذي أدخلناه — وفي بايثون القديمة يتغير من تشغيل لآخر. لا مشكلة إطلاقًا: نحن لا نصل إلى القيم بالمواقع بل بالمفاتيح، وprint(eng2sp['two']) تعطي 'dos' دائمًا أينما وقف العنصر. في إصدارات بايثون الحديثة يُطبع القاموس بترتيب الإدخال، لكن القاعدة الذهبية باقية: لا تعتمد على الترتيب أبدًا — عالِج بالمفاتيح.",
          en: "We built a three-item dictionary: eng2sp = {'one': 'uno', 'two': 'dos', 'three': 'tres'} — and its printing surprised us: the order was not what we entered — and in older Python it changes from run to run. No problem at all: we reach values by keys, not positions, and print(eng2sp['two']) gives 'dos' no matter where the item sits. Modern Python prints dictionaries in insertion order, yet the golden rule stands: never rely on order — operate through keys.",
        },
        {
          ar: "وإن سألت عن مفتاح غير موجود: print(eng2sp['four']) ترمي KeyError: 'four' — استثناء يصرخ لأن المفتاح غائب، تمامًا كماصرخت IndexError على فهرس قائمة خاطئ. وlen(eng2sp) تعدّ الأزواج لا المفاتيح ولا القيم منفردة: ثلاثة أزواج فتجيب 3.",
          en: "And if you ask about a missing key: print(eng2sp['four']) throws KeyError: 'four' — an exception screaming because the key is absent, exactly as IndexError screamed on a bad list index. And len(eng2sp) counts pairs, not keys or values separately: three pairs, so it answers 3.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'العامل in: بحث فوري في المفاتيح', en: 'The in operator: instant lookup in the keys' },
      chunks: [
        {
          ar: "العامل in على القاموس يسأل: هل هذا مفتاح موجود؟ 'one' in eng2sp تعطي True، بينما 'uno' in eng2sp تعطي False — لأن in يفحص المفاتيح حصرًا ولا يهتم بالقيم. ولبحث عن قيمة نحوّلها أولًا إلى قائمة: vals = list(eng2sp.values()) ثم 'uno' in vals تعطي True — التابع values يعيد القيم كلها، وin على القوائم تعلمناه في الفصل السادس.",
          en: "The in operator on a dictionary asks: is this key present? 'one' in eng2sp gives True, while 'uno' in eng2sp gives False — because in inspects keys only and ignores values. To search for a value, convert it to a list first: vals = list(eng2sp.values()), then 'uno' in vals gives True — the values method hands back all values, and in on lists we learned in chapter 6.",
        },
        {
          ar: "وتذكّر أن القاموس آلة ترجمة عامة: codons = {'ATA': 'Isoleucine', 'ATG': 'Methionine'} فcodons['ATG'] يعطي 'Methionine' — ترجمة رمز وراثي من ثلاثة حروف إلى اسم حمض أميني. وسرّ سرعة in في القواميس خوارزمية اسمها جدول التقطيع (hash table): مهما كبر القاموس يبقى زمن البحث نفسه تقريبًا، بينما القوائم تبحث خطيًا فتأخذ أطول كلما طالت.",
          en: "And remember the dictionary is a general translator: codons = {'ATA': 'Isoleucine', 'ATG': 'Methionine'}, so codons['ATG'] gives 'Methionine' — translating a three-letter genetic codon into an amino-acid name. And the secret behind the speed of in on dictionaries is an algorithm named the hash table: however large the dictionary grows, lookup time stays roughly the same, while lists search linearly and take longer the longer they are.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'قاموس الترجمة من الصفر', en: 'A translation dictionary from scratch' },
      code: "eng2sp = dict()\neng2sp['one'] = 'uno'\neng2sp['two'] = 'dos'\neng2sp['three'] = 'tres'\nprint(eng2sp)\nprint(eng2sp['two'])\nprint(len(eng2sp))\nprint('one' in eng2sp)\nprint('uno' in eng2sp)",
      explanation: {
        ar: "بدأ القاموس فارغًا ثم أضفنا ثلاثة أزواج بالمفاتيح. الطباعة تعرض الأزواج كلها (بترتيب الإدخال في بايثون الحديثة)، والوصول بالمفتاح يعطي 'dos' أينما وقف العنصر، وlen تعدّ 3 أزواج، وin يؤكد أن one مفتاح بينما uno قيمة لا مفتاح. خمسة أسطر تلخص القاموس كله: أنشئ، أضف، اسأل، عدّ.",
        en: "The dictionary started empty, then we added three pairs by their keys. Printing shows all pairs (insertion order in modern Python), fetching by key gives 'dos' wherever the item sits, len counts 3 pairs, and in confirms that one is a key while uno is a value, not a key. Five lines summarize the whole dictionary: create, add, ask, count.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.dna-codons',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "أنشئ قاموسًا اسمه codons يترجم رموز DNA إلى الأحرف الممثلة للأحماض الأمينية: المفتاح 'ATA' قيمته 'I'، والمفتاح 'ATG' قيمته 'M'، والمفتاح 'CTT' قيمته 'L'. ثم اطبع codons['ATG'] واطبع len(codons). المتوقع: M ثم 3.",
        en: "Create a dictionary named codons that translates DNA codons into the letters standing for amino acids: key 'ATA' with value 'I', key 'ATG' with value 'M', key 'CTT' with value 'L'. Then print codons['ATG'] and print len(codons). Expected: M then 3.",
      },
      starterCode: "# أنشئ القاموس بأقواس {} أو بـ dict() ثم أضف الأزواج الثلاثة / create the dict with {} or dict(), then add the three pairs\n# اطبع قيمة المفتاح ATG ثم عدد الأزواج / print the ATG value, then the number of pairs\n",
      solution: "codons = {}\ncodons['ATA'] = 'I'\ncodons['ATG'] = 'M'\ncodons['CTT'] = 'L'\nprint(codons['ATG'])\nprint(len(codons))",
      tests: [
        {
          id: 't1',
          name: { ar: 'المفتاح ATG يترجم إلى M', en: 'Key ATG translates to M' },
          code: "assert codons['ATG'] == 'M', 'expected: M | actual: %r' % codons['ATG']",
          expected: 'M',
        },
        {
          id: 't2',
          name: { ar: 'المفتاحان ATA وCTT صحيحان', en: 'Keys ATA and CTT are correct' },
          code: "assert codons['ATA'] == 'I' and codons['CTT'] == 'L', 'expected: I and L | actual: %r %r' % (codons['ATA'], codons['CTT'])",
          expected: 'I and L',
        },
        {
          id: 't3',
          name: { ar: 'القاموس فيه 3 أزواج', en: 'The dictionary holds 3 pairs' },
          code: "assert len(codons) == 3, 'expected: 3 | actual: %r' % len(codons)",
          expected: '3',
        },
        {
          id: 't4',
          name: { ar: 'يُطبع M', en: 'M is printed' },
          code: "assert 'M' in __learner_output__, ('expected: M | actual: %r' % __learner_output__)",
          expected: 'M',
        },
      ],
      hints: [
        { ar: "ابدأ بقاموس فارغ: codons = {} — ثم أضف كل زوج بسطر مثل codons['ATA'] = 'I'.", en: "Start from an empty dictionary: codons = {} — then add each pair with a line like codons['ATA'] = 'I'." },
        { ar: "القيم نصوص بين علامتي تنصيص مفردة: 'I' وليس I بلا تنصيص.", en: "The values are strings in single quotes: 'I', not a bare I." },
        { ar: "الهيكل:\ncodons = {}\ncodons['ATA'] = 'I'\ncodons['ATG'] = 'M'\ncodons['CTT'] = 'L'\nprint(codons['ATG'])\nprint(len(codons))", en: "The skeleton:\ncodons = {}\ncodons['ATA'] = 'I'\ncodons['ATG'] = 'M'\ncodons['CTT'] = 'L'\nprint(codons['ATG'])\nprint(len(codons))" },
        { ar: "codons = {}\ncodons['ATA'] = 'I'\ncodons['ATG'] = 'M'\ncodons['CTT'] = 'L'\nprint(codons['ATG'])\nprint(len(codons))", en: "codons = {}\ncodons['ATA'] = 'I'\ncodons['ATG'] = 'M'\ncodons['CTT'] = 'L'\nprint(codons['ATG'])\nprint(len(codons))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-lookup',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "d = {'a': 1, 'b': 2}\nprint(d['b'])\nprint(len(d))\nprint('a' in d)\nprint(3 in d)",
      solution: '2\n2\nTrue\nFalse',
      answer: '2\n2\nTrue\nFalse',
      hints: [
        { ar: 'السؤال الأول يطلب قيمة المفتاح b.', en: 'The first question asks for the value of key b.' },
        { ar: 'len تعدّ الأزواج: زوجان هنا.', en: 'len counts the pairs: two pairs here.' },
        { ar: 'in يفحص المفاتيح فقط: a مفتاح موجود، أما 3 فليس مفتاحًا.', en: 'in inspects keys only: a is a present key, while 3 is not a key.' },
        { ar: 'الخرْج:\n2\n2\nTrue\nFalse', en: 'The output:\n2\n2\nTrue\nFalse' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-keyerror',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: "ماذا يحدث عند تنفيذ print(eng2sp['four']) والمفتاح four غير موجود في القاموس؟",
        en: "What happens when print(eng2sp['four']) runs and the key four is not in the dictionary?",
      },
      options: [
        { id: 'a', text: { ar: "يرمي KeyError: 'four' ويتوقف البرنامج", en: "It throws KeyError: 'four' and the program stops" } },
        { id: 'b', text: { ar: 'يعيد قيمة فارغة بهدوء', en: 'It quietly returns an empty value' } },
        { id: 'c', text: { ar: 'ينشئ المفتاح تلقائيًا بقيمة 0', en: 'It silently creates the key with value 0' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'القوائم ترمي IndexError عند فهرس خاطئ — والقواميس لها خطؤها الخاص.', en: 'Lists throw IndexError on a bad index — dictionaries have their own error.' },
        { ar: 'اسم الخطأ يشير إلى المفتاح.', en: 'The error name points at the key.' },
        { ar: 'القراءة بالمفتاح لا تنشئ شيئًا — الإضافة وحدها تنشئ.', en: 'Reading by a key never creates anything — only assignment creates.' },
        { ar: "الجواب: أ — KeyError: 'four'، واسم المفتاح الغائب يظهر في الرسالة.", en: "Answer: a — KeyError: 'four', with the missing key named in the message." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-dict',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'اكتب الكلمة المناسبة: التابع الجاهز ____ ينشئ قاموسًا فارغًا بلا أي عناصر — ونحن نتجنب استخدامه اسمًا لمتغيراتنا.',
        en: 'Fill in: the built-in ____ creates an empty dictionary with no items — and we avoid using it as a variable name.',
      },
      solution: 'dict',
      answer: 'dict',
      hints: [
        { ar: 'أربعة حروف تبدأ بحرف d.', en: 'Four letters starting with d.' },
        { ar: 'رأيته في أول مثال من الدرس: eng2sp = __().', en: 'You saw it in the first example of the lesson: eng2sp = __().' },
        { ar: 'الشكل الصحيح: eng2sp = dict()', en: 'The correct shape: eng2sp = dict()' },
        { ar: 'الجواب: dict', en: 'Answer: dict' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — خريطتك الخاصة\n# Your playground — your own map\n\neng2ar = {}\neng2ar['book'] = 'kitab'\neng2ar['sun'] = 'shams'\nprint(eng2ar)\nprint(eng2ar['sun'])\nprint('book' in eng2ar)\nprint('shams' in eng2ar)\nprint(len(eng2ar))",
      prompt: {
        ar: 'جرّب: أضف كلمات جديدة إلى قاموسك، واسأل in عن مفتاح ثم عن قيمة ولاحظ الفرق في الجواب، ثم جرّب قراءة مفتاح غير موجود لترى رسالة KeyError كاملة. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add new words to your dictionary, ask in about a key then about a value and notice the different answers, then try reading a missing key to see the full KeyError message. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الخامس: حلقة for c in word: على نص — ماذا يأخذ c في كل دورة؟',
            en: 'From chapter 5: the loop for c in word: over a string — what does c take on each pass?',
          },
          options: [
            { id: 'a', text: { ar: 'محرفًا واحدًا في كل دورة', en: 'One character per pass' } },
            { id: 'b', text: { ar: 'النص كله في كل دورة', en: 'The whole string on every pass' } },
            { id: 'c', text: { ar: 'فهرسًا رقميًا متزايدًا', en: 'An incrementing numeric index' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'حلقة for على النص تمر محرفًا محرفًا — وفي الدرس القادم سنمر بنفس الحلقة على محارف لنبني هيستوغرامًا.',
            en: 'A for loop over a string walks one character per pass — next lesson the same loop walks characters to build a histogram.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرق الجوهري بين القائمة والقاموس؟',
            en: 'What is the essential difference between a list and a dictionary?',
          },
          options: [
            { id: 'a', text: { ar: 'فهارس القائمة أعداد صحيحة فقط، ومفاتيح القاموس من أي نوع', en: 'List indices are integers only, while dictionary keys can be of any type' } },
            { id: 'b', text: { ar: 'القاموس لا يقبل النصوص أبدًا', en: 'A dictionary never accepts text' } },
            { id: 'c', text: { ar: 'القائمة لا يمكن طباعتها كاملة', en: 'A list cannot be printed whole' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القاموس القائمة أعمّ: حيث تفرض القائمة فهارس أعدادًا، يفتح القاموس الباب لأي نوع مفتاح — وكل مفتاح خريطة لقيمته.',
            en: 'The dictionary generalizes the list: where the list forces numeric indices, the dictionary opens the door to any key type — and every key maps to its value.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "لماذا 'uno' in eng2sp تعطي False بينما 'one' in eng2sp تعطي True؟",
            en: "Why does 'uno' in eng2sp give False while 'one' in eng2sp gives True?",
          },
          options: [
            { id: 'a', text: { ar: 'لأن in يفحص المفاتيح فقط ولا يهتم بالقيم', en: 'Because in inspects keys only and ignores values' } },
            { id: 'b', text: { ar: 'لأن uno ليس كلمة إسبانية صحيحة', en: 'Because uno is not a valid Spanish word' } },
            { id: 'c', text: { ar: 'لأن القاموس فارغ وقت السؤال', en: 'Because the dictionary is empty at question time' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'in على القاموس سؤال مفاتيح: uno قيمة موجودة لكنها ليست مفتاحًا — ولبحث القيم نحوّلها بقائمة بـ values().',
            en: 'in on a dictionary asks about keys: uno is a present value but not a key — to search values we gather them into a list with values().',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثالث: ما تصنيف KeyError؟',
            en: 'From chapter 3: how do we classify KeyError?',
          },
          options: [
            { id: 'a', text: { ar: 'استثناء يظهر أثناء التشغيل ويمكن التقاطه بـ try/except', en: 'A runtime exception that can be caught with try/except' } },
            { id: 'b', text: { ar: 'خطأ قواعدي يمنع التشغيل قبل أن يبدأ', en: 'A syntax error blocking the run before it starts' } },
            { id: 'c', text: { ar: 'تحذير لا يظهر للمستخدم إطلاقًا', en: 'A warning never shown to the user' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مثل FileNotFoundError من دروس الملفات: الشكل قواعدي سليم والمفسر يصرخ أثناء التشغيل — وtry/except من الفصل الثالث يقبض عليه إن أردت.',
            en: 'Like FileNotFoundError from the files lessons: the syntax is fine and the interpreter screams at runtime — and the chapter-3 try/except can catch it if you wish.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "d = dict\nd['a'] = 1",
          right: "d = dict()\nd['a'] = 1",
          note: {
            ar: 'dict بلا أقواس هو التابع الجاهز نفسه لا قاموس — والإسناد عليه يرمي TypeError. لا تنسَ الأقواس، ولا تسمِّ متغيرك dict أصلًا.',
            en: 'dict without parentheses is the built-in function itself, not a dictionary — assigning into it throws a TypeError. Never forget the parentheses, and never name your variable dict at all.',
          },
        },
        {
          wrong: "print(eng2sp['four'])",
          right: "if 'four' in eng2sp:\n    print(eng2sp['four'])\nelse:\n    print('missing')",
          note: {
            ar: 'القراءة بمفتاح غائب ترمي KeyError ووقف البرنامج. اسأل in قبل القراءة — وسيتعلم الاختصار الأنيق get في الدرس القادم.',
            en: "Reading a missing key throws KeyError and halts the program. Ask with in before reading — and the elegant shortcut get arrives next lesson.",
          },
        },
        {
          wrong: "if 'uno' in eng2sp:\n    print('found it')",
          right: "vals = list(eng2sp.values())\nif 'uno' in vals:\n    print('found it')",
          note: {
            ar: 'in على القاموس يفحص المفاتيح فقط فتجيب False ولو كانت القيمة موجودة. للبحث عن قيمة: اجمعها بقائمة بـ values() أولًا.',
            en: 'in on a dictionary inspects keys only, so it answers False even when the value exists. To search values: gather them into a list with values() first.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'القاموس خريطة من مفاتيح من أي نوع إلى قيم، وكل ارتباط يسمى زوج مفتاح-قيمة أو عنصرًا (item).', en: 'A dictionary maps keys of any type to values, and each association is called a key-value pair or an item.' },
        { ar: "dict() و{} ينشئان قاموسًا فارغًا، والأقواس المربعة تضيف وتقرأ بالمفتاح — والقراءة بمفتاح غائب ترمي KeyError.", en: "dict() and {} create an empty dictionary, and square brackets add and read by key — reading a missing key throws KeyError." },
        { ar: 'len تعدّ الأزواج، وin يفحص المفاتيح فقط، وvalues() يعيد القيم قائمة — وجدول التقطيع (hash table) يجعل البحث سريعًا مهما كبر القاموس.', en: 'len counts pairs, in inspects keys only, and values() hands back the values as a list — and the hash table keeps lookup fast however large the dictionary grows.' },
      ],
      reflectPrompt: {
        ar: 'اختر تطبيقًا تستخدمه يوميًا (معجم، جهات اتصال، قائمة أسعار) وصفّه قاموسًا: اذكر ثلاثة مفاتيح وقيمها، ولماذا لا يصلح الفهرس الرقمي 0 و1 و2 له؟',
        en: 'Pick an app you use daily (a glossary, contacts, a price list) and describe it as a dictionary: name three keys and their values, and why does the numeric index 0, 1, 2 not fit it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch9.s1', pages: 'ص143 / pp.143' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch9.s1', pages: 'ص143 / pp.143' },
  ],
} satisfies Lesson;

export default lesson;
