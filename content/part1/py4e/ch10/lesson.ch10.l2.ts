import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch10.l2 — "Comparing and Sorting Tuples / مقارنة الصفوف وترتيبها"
 * Aligned with PY4E ch10 s2 (مقارنة الصفوف).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch10.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 10,
  title: { ar: 'مقارنة الصفوف وترتيبها', en: 'Comparing and Sorting Tuples' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch10.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الدرس الماضي انتهى على وعد: ثبات الصف يمنحه قوة المقارنة — واليوم يُوفّى الوعد. قائمة كلمات بلا نظام وأنت تريدها من الأطول إلى الأقصر؛ قائمة أزواج وأنت تريدها مرتبة بالعنصر الأول ثم الثاني عند التكافؤ. بنهاية الدرس ستكون قادرًا على: تتبّع مقارنة عنصرًا بعنصر حتى أول اختلاف، وفهم كيف يرتب sort الصفوف، وتركيب نمط التمييز والترتيب وإزالة التمييز DSU الذي سيصنع بعد درسين أشهر برنامج في الفصل.',
        en: 'Last lesson ended on a promise: the tuple\u2019s permanence grants it the power of comparison — today the promise is honored. A list of words in disarray that you want from longest to shortest; a list of pairs you want ordered by the first element, then the second on ties. By the end of this lesson you will be able to: trace an element-by-element comparison up to the first difference, understand how sort orders tuples, and assemble the Decorate-Sort-Undecorate (DSU) pattern that will build the chapter\u2019s most famous program two lessons from now.',
      },
    },
    {
      kind: 'predict',
      code: "print((0, 1, 2) < (0, 3, 4))\nprint((0, 1, 2000000) < (0, 3, 4))",
      question: {
        ar: 'هل يجوز مقارنة صفين بعامل <؟ ولو أضفنا مليونين إلى العنصر الثالث في الصف الأصغر — هل يقلب ذلك الحكم؟',
        en: 'Can two tuples be compared with <? And if we add two million to the third element of the smaller tuple, does that overturn the verdict?',
      },
      reveal: {
        ar: 'True ثم True — والمفاجأة في السطر الثاني: العناصر بعد نقطة الخلاف لا تُقارن أبدًا. 0 يساوي 0 فتنتقل المقارنة، ثم 1 أصغر من 3 فيُسدّ الحكم فورًا، ومليونا الموضع الثالث يبقيان منسيين. الصف يُقارن ككلمات في قاموس: أول حرف مختلف يحسم.',
        en: 'True then True — and the surprise is in the second line: elements beyond the point of difference are never compared. 0 equals 0 so the comparison moves on, then 1 is less than 3 and the verdict closes instantly, leaving the two millions of position three forgotten. Tuples compare like words in a dictionary: the first differing character decides.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'مقارنة عنصرًا بعنصر', en: 'Comparing element by element' },
      chunks: [
        {
          ar: 'يعمل عامل المقارنة مع الصفوف وسائر السلاسل: تبدأ المقارنة بالعنصر الأول من كل صف، فإن تكافآ انتقلت إلى العنصر التالي، وهكذا حتى يجد عنصرين مختلفين. أول اختلاف يحسم النتيجة وكل ما بعده لا يُعَدّ حتى لو كان هائلًا: (0, 1, 2000000) < (0, 3, 4) تعطي True لأن الحكم سُدّ عند الموضع الثاني.',
          en: 'The comparison operator works on tuples and other sequences: comparison starts at the first element of each tuple, moves to the next on equality, and continues until two differing elements are found. The first difference settles the result and everything after it is ignored, however huge: (0, 1, 2000000) < (0, 3, 4) gives True because the verdict was sealed at position two.',
        },
        {
          ar: 'وهذا امتداد لما تعرفه من الفصل السادس: السلاسل تُقارن حرفًا حرفًا فجاءت apple قبل banana. الصف يعمّم الفكرة: كل موضع يُقارن بدوره، والسلاسل الداخلية تُقارن حرفًا حرفًا عند الحاجة — لذلك (1, \'b\') أكبر من (1, \'a\') لأن المقارنة وصلت إلى العنصر الثاني وحسمته أبجديًا.',
          en: 'This extends what chapter 6 taught: strings compare letter by letter, which is why apple comes before banana. The tuple generalizes the idea: each position is compared in turn, and inner strings compare letter by letter when needed — so (1, \'b\') is greater than (1, \'a\') because the comparison reached the second element and settled it alphabetically.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'sort ونمط DSU', en: 'sort and the DSU pattern' },
      chunks: [
        {
          ar: 'التابع sort يرتب قائمة الصفوف بالقاعدة نفسها: بالعنصر الأول، وعند التكافؤ بالعنصر الثاني، وهكذا. هذه الميزة قلب نمط شهير اسمه التمييز والترتيب وإزالة التمييز — Decorate, Sort, Undecorate (اختصارًا DSU) — وخطواته ثلاث: نميّز: ابنِ قائمة صفوف يقود فيها عنصر الترتيب المطلوب — طول الكلمة أو العدد — ثم العنصر الأصلي. رتّب: sort يتكفل بالباقي. أزل التمييز: استخرج العناصر الأصلية من الصفوف المرتبة.',
          en: 'The sort method orders lists of tuples by the same rule: by the first element, then the second on ties, and so on. This feature is the heart of a famous pattern named Decorate, Sort, Undecorate (DSU for short), with three steps: decorate: build a list of tuples led by the ordering key you want — word length or a count — followed by the original element. sort: sort handles the rest. undecorate: extract the original elements from the sorted tuples.',
        },
        {
          ar: 'مثال الكتاب: نريد كلمات نصٍّ مرتبة من الأطول إلى الأقصر. الحيلة أن نبني الصف (طول الكلمة، الكلمة): متى تساوى طولاان حسمت الكلمة نفسها الترتيب أبجديًا. ثم الوسيط reverse=True يقلب الترتيب كله تنازليًا. النتيجة قائمة صفوف مرتبة تُقشَّر في نهاية البرنامج فتُستخرج الكلمات وحدها — أطولها أولًا.',
          en: 'The book\u2019s example: we want the words of a text ordered from longest to shortest. The trick is building the tuple (word length, word): when two lengths tie, the word itself settles the order alphabetically. Then reverse=True flips the whole order descending. The result is a sorted list of tuples that the program peels at the end, extracting the words alone — longest first.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'من قصيدة إلى قائمة مرتبة', en: 'From a verse to a sorted list' },
      code: "txt = 'but soft what light in yonder window breaks'\nwords = txt.split()\nt = list()\nfor word in words:\n    t.append((len(word), word))\nt.sort(reverse=True)\nres = list()\nfor length, word in t:\n    res.append(word)\nprint(res)",
      explanation: {
        ar: 'الحلقة الأولى نميّز: كل كلمة تلتحق بصف (طولها، هي). ثم sort(reverse=True) يرتب تنازليًا: الطول أولًا، وعند التكافؤ الكلمة أبجديًا تنازليًا — لذلك what تسبق soft. الحلقة الثانية تُزيل التمييز وتستخرج الكلمات: yonder وwindow وbreaks في الصدارة بطول 6. ولاحظ length, word في رأس الحلقة الثانية — لمحة عن إسناد الصفوف الذي ينتظرك في الدرس القادم.',
        en: 'The first loop decorates: every word joins as the tuple (its length, itself). Then sort(reverse=True) orders descending: length first, and on ties the word alphabetically descending — which is why what precedes soft. The second loop undecorates and extracts the words: yonder, window and breaks lead at length 6. Notice length, word in the second loop\u2019s header — a glimpse of tuple assignment awaiting you next lesson.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.decorate-sort',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "النص معطى في المحرر: txt = 'soft what light yonder'. بسّط الكلمات بـ split، وأنشئ قائمة t واملأها بحلقة for بصفوف (len(word), word)، ثم رتّبها بـ sort(reverse=True)، ثم اطبع t[0] ثم اطبع t. المتوقع: (6, 'yonder') ثم [(6, 'yonder'), (5, 'light'), (4, 'what'), (4, 'soft')].",
        en: "The text is given in the editor: txt = 'soft what light yonder'. Split the words with split, create a list t and fill it with a for loop of (len(word), word) tuples, sort it with sort(reverse=True), then print t[0] and print t. Expected: (6, 'yonder') then [(6, 'yonder'), (5, 'light'), (4, 'what'), (4, 'soft')].",
      },
      starterCode: "txt = 'soft what light yonder'\n# ميّز ثم رتّب ثم اطبع / decorate, sort, print:\n",
      solution: "txt = 'soft what light yonder'\nwords = txt.split()\nt = list()\nfor word in words:\n    t.append((len(word), word))\nt.sort(reverse=True)\nprint(t[0])\nprint(t)",
      tests: [
        {
          id: 't1',
          name: { ar: 't قائمة الصفوف المرتبة تنازليًا', en: 't is the list of tuples sorted descending' },
          code: "assert t == [(6, 'yonder'), (5, 'light'), (4, 'what'), (4, 'soft')], 'expected: decorated list sorted descending | actual: %r' % (t,)",
          expected: 'decorated list sorted descending',
        },
        {
          id: 't2',
          name: { ar: "القمة (6, 'yonder') مطبوعة", en: "The top pair (6, 'yonder') is printed" },
          code: "assert \"(6, 'yonder')\" in __learner_output__, ('expected: (6, \\'yonder\\') | actual: %r' % __learner_output__)",
          expected: "(6, 'yonder')",
        },
        {
          id: 't3',
          name: { ar: "التكافؤ حُسم أبجديًا: what قبل soft", en: "The tie broke alphabetically: what before soft" },
          code: "assert \"(4, 'what'), (4, 'soft')\" in __learner_output__, ('expected: (4, \\'what\\'), (4, \\'soft\\') | actual: %r' % __learner_output__)",
          expected: "(4, 'what'), (4, 'soft')",
        },
      ],
      hints: [
        { ar: 'التمييز يعني بناء صف يقود فيه المفتاح: t.append((len(word), word)).', en: 'Decorating means building a tuple led by the key: t.append((len(word), word)).' },
        { ar: 'الترتيب التنازلي يحتاج الوسيط الكامل reverse=True لا reverse وحدها.', en: 'Descending order needs the full argument reverse=True, not just reverse.' },
        { ar: 'الهيكل:\nwords = txt.split()\nt = list()\nfor word in words:\n    t.append((len(word), word))\nt.sort(reverse=True)\nprint(t[0])\nprint(t)', en: "The skeleton:\nwords = txt.split()\nt = list()\nfor word in words:\n    t.append((len(word), word))\nt.sort(reverse=True)\nprint(t[0])\nprint(t)" },
        { ar: "words = txt.split()\nt = list()\nfor word in words:\n    t.append((len(word), word))\nt.sort(reverse=True)\nprint(t[0])\nprint(t)", en: "words = txt.split()\nt = list()\nfor word in words:\n    t.append((len(word), word))\nt.sort(reverse=True)\nprint(t[0])\nprint(t)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-compare',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "a = (0, 1, 2000000)\nb = (0, 3, 4)\nprint(a < b)\nprint((2, 5) < (1, 9))\nprint(('b', 1) < ('a', 9))",
      solution: 'True\nFalse\nFalse',
      answer: 'True\nFalse\nFalse',
      hints: [
        { ar: 'السؤال الأول: المقارنة تقف عند أول موضع مختلف — أين هو؟', en: 'First question: comparison stops at the first differing position — where is it?' },
        { ar: 'السؤال الثاني: أول عنصرين 2 و1 — من فاز؟', en: 'Second question: the first elements are 2 and 1 — who won?' },
        { ar: 'السؤال الثالث: العناصر سلاسل فالمقارنة أبجدية — وما زالت تقف عند أول اختلاف.', en: 'Third question: the elements are strings so comparison is alphabetical — and it still stops at the first difference.' },
        { ar: 'الخرْج:\nTrue\nFalse\nFalse', en: 'The output:\nTrue\nFalse\nFalse' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-sort-rule',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'كيف يحسم sort المقارنة بين صفين في قائمة واحدة؟',
        en: 'How does sort settle the comparison between two tuples in one list?',
      },
      options: [
        { id: 'a', text: { ar: 'أول موضع مختلف يحسم، وما بعده لا يُقارن', en: 'The first differing position decides; nothing after it is compared' } },
        { id: 'b', text: { ar: 'يُجمع عناصر كل صف وتُقارن المجاميع', en: 'The elements of each tuple are summed and the sums compared' } },
        { id: 'c', text: { ar: 'الصف الأطول يفوز دائمًا', en: 'The longer tuple always wins' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'نفس قاعدة عامل < الذي تتبعته في التنبؤ.', en: 'Same rule as the < operator you traced in the prediction.' },
        { ar: 'لذلك مليونان في الموضع الثالث لم يغيّرا شيئًا.', en: 'That is why two million at position three changed nothing.' },
        { ar: 'وعند التكافؤ في الأول ينتقل إلى الثاني ثم الثالث.', en: 'And on a tie in the first element it moves to the second, then the third.' },
        { ar: 'الجواب: أول موضع مختلف يحسم المقارنة.', en: 'Answer: the first differing position decides the comparison.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-length-six',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: "بلا تشغيل: في نص worked — but soft what light in yonder window breaks — بعد بناء قائمة الصفوف (len(word), word) وترتيبها بـ sort(reverse=True): كم كلمة طولها 6 أحرف؟ (ستكون متتالية في صدارة القائمة)",
        en: "Without running: in the worked text — but soft what light in yonder window breaks — after building the list of (len(word), word) tuples and sorting with sort(reverse=True): how many words are 6 letters long? (They will sit together at the top of the list)",
      },
      answer: '3',
      solution: '3',
      tolerance: 0,
      hints: [
        { ar: 'عدّ أحرف الكلمات واحدة واحدة: but وsoft وwhat وlight وin وyonder وwindow وbreaks.', en: 'Count each word\u2019s letters: but, soft, what, light, in, yonder, window, breaks.' },
        { ar: 'yonder وwindow وbreaks — منهن الكلمة التي تسبق صدارة القائمة.', en: 'yonder, window, breaks — among them the word leading the list.' },
        { ar: 'ثلاث كلمات بطول 6 — لذلك تتقاسم القمة وترتّب بينها أبجديًا تنازليًا.', en: 'Three words of length 6 — they share the top, ordered among themselves alphabetically descending.' },
        { ar: 'الجواب: 3', en: 'Answer: 3' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — مقارنات وترتيب\n# Your playground — comparisons and sorting\n\nprint((1, 2) < (1, 3))\nprint((1, 2) < (1, 2))\nprint(("a", 1) < ("b", 0))\n\npairs = [(2, "b"), (3, "a"), (2, "a")]\npairs.sort()\nprint(pairs)\npairs.sort(reverse=True)\nprint(pairs)',
      prompt: {
        ar: 'جرّب بنفسك: مقارنة تبدأ بالتكافؤ ثم تحسمها لاحقة، وسلاسل في الموضع الأول، ثم قائمة صفوف فيها تكافؤات يكرّمها sort بالعنصر الثاني. قلب reverse وراقب الانقلاب. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: a comparison that starts with a tie and is settled later, strings in the first position, then a list of tuples whose ties sort honors via the second element. Flip reverse and watch the reversal. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عند مقارنة (3, 5) و(3, 2): أيهما أكبر ولماذا؟',
            en: 'Comparing (3, 5) and (3, 2): which is greater and why?',
          },
          options: [
            { id: 'a', text: { ar: '(3, 5) — تكافأ الأولان فحسم العنصر الثاني', en: '(3, 5) — the first elements tied, so the second element decided' } },
            { id: 'b', text: { ar: '(3, 2) — لأن 2 أصغر فالأسرع في الترتيب هو الأكبر', en: '(3, 2) — because 2 is smaller, the earlier one ranks greater' } },
            { id: 'c', text: { ar: 'لا يجوز المقارنة — الصفان متساويان دائمًا في الطول', en: 'Comparison is not allowed — both tuples have equal length' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المقارنة تقف عند أول اختلاف: تكافؤ الموضع الأول نقلها إلى الثاني حيث 5 أكبر من 2 — نفس آلية كسر التكافؤ التي يعتمدها sort.',
            en: 'Comparison stops at the first difference: the tie in position one pushed it to position two where 5 beats 2 — the same tie-breaking mechanism sort relies on.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: "ومن الفصل السادس: 'Pineapple' < 'banana' تعطي True — لماذا نتذكرها في هذا الدرس؟",
            en: "From chapter 6: 'Pineapple' < 'banana' gives True — why do we recall it in this lesson?",
          },
          options: [
            { id: 'a', text: { ar: 'لأن كسر التكافؤات بين صفوف تحوي سلاسل يعتمد المقارنة الأبجدية نفسها', en: 'Because tie-breaking among tuples holding strings relies on the very same alphabetical comparison' } },
            { id: 'b', text: { ar: 'لأن السلاسل لا تدخل في الصفوف إطلاقًا', en: 'Because strings never enter tuples at all' } },
            { id: 'c', text: { ar: 'لأن sort يرفض الصفوف التي فيها سلاسل', en: 'Because sort refuses tuples containing strings' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'في worked تقدمت what على soft لأن السلاسل الداخلية قورنت حرفًا حرفًا — قاعدة الفصل السادس عاشت داخل الصفوف.',
            en: 'In the worked example what preceded soft because the inner strings compared letter by letter — the chapter-6 rule lives inside tuples.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ماذا يفعل الوسيط reverse=True في sort؟',
            en: 'What does the reverse=True argument do in sort?',
          },
          options: [
            { id: 'a', text: { ar: 'يقلب الترتيب إلى تنازلي — الأكبر أولًا', en: 'Flips the order to descending — largest first' } },
            { id: 'b', text: { ar: 'يعكس ترتيب العناصر داخل كل صف', en: 'Reverses the elements inside each tuple' } },
            { id: 'c', text: { ar: 'يرتب القائمة بشكل عشوائي ثم يعيدها', en: 'Shuffles the list randomly then restores it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'reverse=True يجعل القاعدة تصاعدية تنازلية: العنصر الأول الأكبر أولًا، وعند التكافؤ الثاني الأكبر أولًا — بهذا تصدرت yonder وwhat.',
            en: 'reverse=True turns the ascending rule into a descending one: largest first element first, and on ties the larger second element first — that is how yonder and what took the lead.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الخامس: في worked مرت الحلقة for word in words على نص من 8 كلمات — كم دورة نفذت وما اسم word؟',
            en: 'From chapter 5: in the worked example the loop for word in words ran over a text of 8 words — how many passes, and what is word called?',
          },
          options: [
            { id: 'a', text: { ar: '8 دورات — وword متغير التكرار يأخذ كلمة كل دورة', en: '8 passes — and word is the iteration variable taking one word per pass' } },
            { id: 'b', text: { ar: 'دورة واحدة — وword قائمة الكلمات كاملة', en: 'One pass — and word is the whole word list' } },
            { id: 'c', text: { ar: '8 دورات — وword اسم ثابت محجوز في بايثون', en: '8 passes — and word is a reserved Python constant' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نمط for المحدد من الفصل الخامس: دورة لكل عنصر — وهو القلب الذي ضخّ الصفوف في قائمة التمييز قبل sort.',
            en: 'The definite-for pattern from chapter 5: one pass per element — the heart that pumped tuples into the decoration list before sort took over.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'print((0, 1, 2000000) > (0, 3, 4))  # المليونان سيحسمان!؟',
          right: 'print((0, 1, 2000000) < (0, 3, 4))',
          note: {
            ar: 'المقارنة تقف عند أول موضع مختلف: 1 أصغر من 3 فيُسدّ الحكم قبل بلوغ المليونين — فالسطر الأول يطبع False. لا مجاميع ولا أوزان لاحقة.',
            en: 'Comparison stops at the first differing position: 1 is less than 3, so the verdict lands before the millions are ever reached — the first line prints False. No sums, no later weights.',
          },
        },
        {
          wrong: 't.sort()  # أريد الأطول أولًا',
          right: 't.sort(reverse=True)',
          note: {
            ar: 'sort بلا وسائط يرتب تصاعديًا فتصدر القائمة الأقصر والأصغر — لوحتك تنقلب. للتنازلي الوسيط الكامل reverse=True.',
            en: 'sort with no arguments orders ascending, so the shortest and smallest lead — your board flips. For descending, the full argument reverse=True.',
          },
        },
        {
          wrong: "pairs = [(1, 'a'), (1, 2)]\npairs.sort()",
          right: "pairs = [(1, 'a'), (1, 'b')]\npairs.sort()",
          note: {
            ar: "عند تكافؤ العنصر الأول يقارن بايثون الثاني: 'a' مع 2 لا تجتمع — TypeError: '<' not supported between instances of 'str' and 'int'. حافظ على تجانس النوع في كل موضع.",
            en: "On a tie in the first element Python compares the second: 'a' against 2 cannot meet — TypeError: '<' not supported between instances of 'str' and 'int'. Keep the type homogeneous at each position.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المقارنة بين الصفوف عنصرًا بعنصر: أول موضع مختلف يحسم، وما بعده لا يُقارن أبدًا حتى لو كان مليونين.', en: 'Tuple comparison runs element by element: the first differing position decides, and nothing after it is ever compared, not even two million.' },
        { ar: 'sort يرتب الصفوف بالقاعدة نفسها، وreverse=True يقلب الترتيب إلى تنازلي — والتكافؤات تُحسم بالعنصر التالي.', en: 'sort orders tuples by the same rule, and reverse=True flips it descending — ties are broken by the next element.' },
        { ar: 'نمط DSU: نميّز بصف (مفتاح، عنصر)، رتّب، ثم استخرج الأصل — بهذا النمط سيترتب الفصل الكلمات بحسب تكرارها.', en: 'The DSU pattern: decorate with (key, element) tuples, sort, then undecorate — this pattern will rank the chapter\u2019s words by frequency.' },
      ],
      reflectPrompt: {
        ar: 'لديك قائمة أفلام وكل فيلم له سنة واسم. لو أردت ترتيبها بحسب السنة ثم الاسم أبجديًا عند تعادل السنين — أي صفيْ (سنة، اسم) أم (اسم، سنة) تختار، ولماذا؟',
        en: 'You have a list of movies, each with a year and a name. To order by year and then alphabetically by name on ties — which tuple do you pick, (year, name) or (name, year), and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch10.s2', pages: 'ص159 / pp.159' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch10.s2', pages: 'ص159 / pp.159' },
  ],
} satisfies Lesson;

export default lesson;
