import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch8.l3 — "List Methods and Deleting Elements /
 * توابع القوائم وحذف العناصر"
 * Aligned with PY4E ch8 s6 (توابع خاصّة بالقوائم), s7 (حذف العناصر).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch8.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 8,
  title: { ar: 'توابع القوائم وحذف العناصر', en: 'List Methods and Deleting Elements' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch8.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حتى الآن كنت تُعدّل القوائم يدويًا: فهرس هنا، تجزئة هناك. لكن بايثون أعطت القوائم توابعها الخاصة: append تلحق، extend تمدّد، sort ترتّب — وحذف العناصر له أربع طرق مختلفة! وفي قلب الدرس فخّ شهير يصطاد كل من خلط بين سلوك توابع السلاسل وتوابع القوائم. بنهاية الدرس ستكون قادرًا على: إضافة العناصر وترتيبها بالتوابع، وحذفها بأربع طرق حسب ما تعرف وما تحتاج، وتمييز التوابع المعدِّلة التي تعيد None.',
        en: 'Until now you edited lists by hand: an index here, a slice there. But Python gave lists their own methods: append attaches, extend stretches, sort orders — and element deletion has four different roads! At the heart of the lesson sits a famous trap that catches everyone who mixes string-method habits with list-method behavior. By the end of this lesson you will be able to: add and order elements with methods, delete them four ways depending on what you know and need, and tell modifying methods that return None.',
      },
    },
    {
      kind: 'predict',
      code: "t = ['d', 'c', 'e']\nresult = t.sort()\nprint(t)\nprint(result)",
      question: {
        ar: 'في الفصل السادس كتبت word = word.strip() فحصلت على سلسلة جديدة مرتبة. ماذا سيطبع السطران هنا بعد sort؟',
        en: 'In chapter 6 you wrote word = word.strip() and got a fresh new string. What will the two lines print here after sort?',
      },
      reveal: {
        ar: "السطر الأول يطبع القائمة مرتبة ['c', 'd', 'e'] — لكن السطر الثاني يطبع None! التابع sort رتّب القائمة في مكانها ثم أعاد شيئًا لا قيمة له: None. إسناد نتيجته يبدّد ترتيبك المكتسب — هذا الفخ محور الدرس.",
        en: "The first line prints the sorted list ['c', 'd', 'e'] — but the second prints None! The sort method ordered the list in place, then returned something worthless: None. Assigning its result throws away your hard-earned order — this trap is the lesson's axis.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التوابع التي تضيف وترتب: append وextend وsort', en: 'Methods that add and order: append, extend, sort' },
      chunks: [
        {
          ar: "القوائم كائنات، فلها توابع تُستدعى بالنقطة كما تعلمت مع السلاسل. التابع append يضيف عنصرًا واحدًا جديدًا إلى نهاية القائمة: t = ['a', 'b', 'c'] ثم t.append('d') فتصير القائمة ['a', 'b', 'c', 'd']. وعند الذاكرة: لا تكتب t = t.append('d') — فالإسناد سيستبدل قائمتك بـ None.",
          en: "Lists are objects, so they carry methods invoked with the dot as you learned with strings. The append method adds a single new element to the end of a list: t = ['a', 'b', 'c'] then t.append('d') makes the list ['a', 'b', 'c', 'd']. And a memory hook: never write t = t.append('d') — the assignment would swap your list for None.",
        },
        {
          ar: "التابع extend يأخذ قائمة كوسيط ويضيف جميع عناصرها دفعة واحدة: t1 = ['a', 'b', 'c'] وt2 = ['d', 'e'] ثم t1.extend(t2) فتصير t1 هي ['a', 'b', 'c', 'd', 'e'] — وt2 لم يتطرق إليها شيء. هذا يعادل t1 = t1 + t2 لكن دون إنشاء قائمة ثالثة.",
          en: "The extend method takes a list as its argument and adds all of its elements at once: t1 = ['a', 'b', 'c'] and t2 = ['d', 'e'], then t1.extend(t2) leaves t1 as ['a', 'b', 'c', 'd', 'e'] — and t2 is never touched. It equals t1 = t1 + t2 but without building a third list.",
        },
        {
          ar: "التابع sort يرتب عناصر القائمة تصاعديًا في مكانها: t = ['d', 'c', 'e', 'b', 'a'] ثم t.sort() فتصير ['a', 'b', 'c', 'd', 'e']. ومعظم توابع القوائم من النوع الخالي (void): تعدّل القائمة وتعيد None — عكس توابع السلاسل التي تعيد سلسلة جديدة وترك الأصل. لهذا كتابة t = t.sort() نتيجتها مخيّبة: تفقد القائمة المرتبة وتحتفظ بـ None.",
          en: "The sort method orders the list elements ascending, in place: t = ['d', 'c', 'e', 'b', 'a'] then t.sort() leaves ['a', 'b', 'c', 'd', 'e']. Most list methods are void: they modify the list and return None — the opposite of string methods, which return a new string and leave the original alone. That is why t = t.sort() ends in disappointment: you lose the sorted list and keep None.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'أربع طرق للحذف: pop وdel وremove والتجزئة', en: 'Four roads to deletion: pop, del, remove, and slicing' },
      chunks: [
        {
          ar: "إذا كنت تعرف فهرس العنصر المطلوب حذفه فاستخدم التابع pop — فهو يحذف العنصر ويعيده إليك: x = t.pop(1) أزال العنصر ذا الفهرس 1 وخزّن قيمته في x، فصارت t هي ['a', 'c'] وقيمة x هي 'b'. وإذا استدعيت pop بلا فهرس حذف العنصر الأخير وأعاده.",
          en: "If you know the index of the element to delete, use the pop method — it removes the element and hands it back to you: x = t.pop(1) removed the element at index 1 and stored its value in x, leaving t as ['a', 'c'] with x holding 'b'. And calling pop with no index deletes the last element and returns it.",
        },
        {
          ar: "إذا لم تكن بحاجة للاحتفاظ بالقيمة المحذوفة فاستخدم العامل del: del t[1] يحذف فورًا بلا قيمة معادة. أما إذا كنت تعرف العنصر نفسه ولا تعرف فهرسه فاستخدم remove: t.remove('b') يمحو أول ظهور لـ 'b' — لكن انتبه: القيمة التي يعيدها remove هي None، فلا تسندها لقائمتك أبدًا.",
          en: "If you do not need to keep the deleted value, use the del operator: del t[1] deletes instantly with no return value. But if you know the element itself without knowing its index, use remove: t.remove('b') erases the first occurrence of 'b' — yet beware: the value remove returns is None, so never assign it to your list.",
        },
        {
          ar: "ولإزالة أكثر من عنصر مرة واحدة، اجمع del مع التجزئة: del t[1:5] يمحو كل العناصر من الفهرس 1 حتى قبل 5 — وكالعادة التجزئة تشمل الأول وتستثني الثاني. أربع طرق إذن: pop للقيمة المرجعة، وdel للفهرس المجرد، وremove للقيمة المعروفة، والتجزئة مع del للجمل.",
          en: "To remove more than one element at once, pair del with a slice: del t[1:5] wipes every element from index 1 up to before 5 — as always the slice includes the first and excludes the second. So four roads: pop for a returned value, del for a bare index, remove for a known value, and del-with-slice for whole ranges.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'سلوك السلاسل مقابل سلوك القوائم', en: 'String behavior versus list behavior' },
      code: "word = 'banana'\nprint(word.upper())\nprint(word)\n\nt = ['d', 'c', 'e']\nresult = t.sort()\nprint(t)\nprint(result)\n\nt.append('x')\nt.remove('d')\nprint(t)\nprint(len(t))",
      explanation: {
        ar: "word.upper() أعاد 'BANANA' مطبوعة لكن word بقيت 'banana' — تابع السلسلة ينتج جديدة ويهمل الأصل. بالمقابل sort رتّب t في مكانها وأعاد None، وappend وremove عدّلا القائمة نفسها: ['c', 'e', 'x'] بطول 3. القاعدة: السلاسل تعيد، والقوائم تعدّل.",
        en: "word.upper() returned 'BANANA' to the printer while word stayed 'banana' — a string method produces a new one and ignores the original. In contrast sort ordered t in place and returned None, and append and remove modified the very same list: ['c', 'e', 'x'] of length 3. The rule: strings return, lists modify.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.append-sort',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'القائمة nums معطاة بالقيم [3, 1, 2]. ألحق العدد 9 إلى نهايتها بالتابع المناسب، ثم رتّبها تصاعديًا بالتابع المناسب (بلا إسناد!)، ثم اطبع القائمة. الخرْج المتوقع: [1, 2, 3, 9].',
        en: 'The list nums is given as [3, 1, 2]. Append the number 9 to its end with the proper method, then sort it ascending with the proper method (no assignment!), then print the list. Expected output: [1, 2, 3, 9].',
      },
      starterCode: 'nums = [3, 1, 2]\n# ألحق 9 ثم رتّب ثم اطبع / append 9, then sort, then print\n',
      solution: 'nums = [3, 1, 2]\nnums.append(9)\nnums.sort()\nprint(nums)',
      tests: [
        {
          id: 't1',
          name: { ar: 'القائمة صارت [1, 2, 3, 9]', en: 'The list became [1, 2, 3, 9]' },
          code: "assert nums == [1, 2, 3, 9], 'expected: [1, 2, 3, 9] | actual: %r' % nums",
          expected: '[1, 2, 3, 9]',
        },
        {
          id: 't2',
          name: { ar: 'القائمة مطبوعة', en: 'The list is printed' },
          code: "assert '[1, 2, 3, 9]' in __learner_output__, ('expected: [1, 2, 3, 9] | actual: %r' % __learner_output__)",
          expected: '[1, 2, 3, 9]',
        },
      ],
      hints: [
        { ar: 'التوابع تُستدعى بالنقطة على القائمة نفسها: nums.append(...).', en: 'Methods are invoked with the dot on the list itself: nums.append(...).' },
        { ar: 'sort يرتّب في المكان — لا تكتب nums = nums.sort() وإلا صارت nums هي None.', en: 'sort orders in place — never write nums = nums.sort() or nums becomes None.' },
        { ar: 'الهيكل:\nnums.append(9)\nnums.sort()\nprint(nums)', en: 'The skeleton:\nnums.append(9)\nnums.sort()\nprint(nums)' },
        { ar: 'nums = [3, 1, 2]\nnums.append(9)\nnums.sort()\nprint(nums)', en: 'nums = [3, 1, 2]\nnums.append(9)\nnums.sort()\nprint(nums)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-delete',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "t = ['a', 'b', 'c', 'd']\nx = t.pop(1)\nprint(x)\nprint(len(t))\nt.remove('d')\nprint(t[0])",
      solution: 'b\n3\na',
      answer: 'b\n3\na',
      hints: [
        { ar: 'pop(1) يزيل العنصر ذا الفهرس 1 ويعيده.', en: 'pop(1) removes the element at index 1 and returns it.' },
        { ar: 'بعد إزالة عنصر واحد من أربعة بقي ثلاثة.', en: 'After removing one element from four, three remain.' },
        { ar: "remove('d') يمحو القيمة المعروفة، ويبقى في الرأس عنصر الفهرس 0.", en: "remove('d') erases the known value, and the index-0 element remains at the head." },
        { ar: 'الخرْج:\nb\n3\na', en: 'The output:\nb\n3\na' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-sort-returns',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا يعيد التابع sort بعد ترتيب القائمة؟',
        en: 'What does the sort method return after ordering a list?',
      },
      options: [
        { id: 'a', text: { ar: 'None — لأنه تابع خالي يعدّل في المكان', en: 'None — it is a void method that modifies in place' } },
        { id: 'b', text: { ar: 'القائمة المرتبة نفسها', en: 'The sorted list itself' } },
        { id: 'c', text: { ar: 'قائمة جديدة مرتبة والأصل سليم', en: 'A new sorted list, with the original intact' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'وهذا عكس توابع السلاسل مثل strip وupper التي تعيد سلسلة جديدة.', en: 'This is the opposite of string methods like strip and upper, which return a new string.' },
        { ar: 'تذكّر تنبؤ الدرس: result كانت None بعد t.sort().', en: 'Recall the lesson prediction: result held None after t.sort().' },
        { ar: 'معظم توابع القوائم من النوع void — عدّل ثم ارحل بلا قيمة.', en: 'Most list methods are void — they modify and walk away with no value.' },
        { ar: 'الجواب: أ — None. لهذا لا يُسند: t = t.sort() فخ مشهور.', en: 'Answer: a — None. That is why it is never assigned: t = t.sort() is a famous trap.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-remove',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'املأ الفرز: إذا كنت تعرف العنصر الذي تريد إزالته لكن لا تعرف فهرسه، تستخدم التابع ______.',
        en: 'Fill in the blank: when you know the element you want gone but not its index, you use the ______ method.',
      },
      answer: 'remove',
      solution: 'remove',
      hints: [
        { ar: 'ثلاثة من طرق الحذف: عامل del، والتابع الذي يزيل بالفهرس ويعيد القيمة، والتابع الذي يزيل بالقيمة.', en: 'Three of the deletion roads: the del operator, the method that removes by index and returns the value, and the method that removes by value.' },
        { ar: 'التابع المطلوب يأخذ القيمة نفسها وسيطًا: t.____(\'b\').', en: 'The wanted method takes the value itself as argument: t.____(\'b\').' },
        { ar: 'تنبيه: يعيد None — لكن اسمه يبدأ بـ r.', en: 'Heads-up: it returns None — but its name starts with r.' },
        { ar: 'الجواب: remove', en: 'Answer: remove' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — جرّب التوابع الأربعة\n# Your playground — try the four roads\n\nt = [\'p\', \'q\', \'r\', \'s\']\nx = t.pop(2)\nprint(\'popped:\', x, \'| list:\', t)\n\ndel t[0]\nprint(t)\n\nt.remove(\'s\')\nprint(t)\n\nt.extend([\'m\', \'n\'])\nt.sort()\nprint(t)',
      prompt: {
        ar: 'جرّب بنفسك: احذف بالفهرس وبالقيمة وبالجملة، وقارن ما يعيده كل طريق. ثم جرّب الأخطاء التي تُعلّم: t.remove(\'zzz\') على قيمة غير موجودة، وt.pop(99) خارج الحدود، وdel t[10]. ولا تنسَ التجربة الخطيرة: t = t.sort() ثم print(t). لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: delete by index, by value and by range, comparing what each road returns. Then try the instructive errors: t.remove('zzz') on a missing value, t.pop(99) out of bounds, and del t[10]. And do not skip the dangerous one: t = t.sort() then print(t). No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل الرابع: صنّفنا التوابع إلى مُنتِجة وخالية. أين يقع sort؟',
            en: 'Back to chapter 4: we classified functions as fruitful and void. Where does sort fall?',
          },
          options: [
            { id: 'a', text: { ar: 'خالٍ — ينفّذ عمله ولا يعيد قيمة مفيدة (None)', en: 'Void — it does its job and returns no useful value (None)' } },
            { id: 'b', text: { ar: 'مُنتِج — يعيد القائمة المرتبة', en: 'Fruitful — it returns the sorted list' } },
            { id: 'c', text: { ar: 'من النوعين معًا حسب المدخلات', en: 'Both, depending on its inputs' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التابع الخالي يعدّل الوسيط أو يطبع ثم يعود بلا قيمة — وsort أشهر مثال: عدّل في المكان وعاد بـ None.',
            en: 'A void function modifies its argument or prints, then comes back with no value — and sort is the prime example: it modified in place and returned None.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرق الجوهري بين t.append(x) وt.extend([x])؟',
            en: 'What is the essential difference between t.append(x) and t.extend([x])?',
          },
          options: [
            { id: 'a', text: { ar: 'النتيجة نفسها هنا، لكن append يضيف عنصرًا واحدًا وextend يضيف عناصر قائمة كاملة', en: 'The result is the same here, but append adds one element while extend adds all elements of a list' } },
            { id: 'b', text: { ar: 'append ينسخ وextend يعدّل', en: 'append copies while extend modifies' } },
            { id: 'c', text: { ar: 'لا فرق بينهما إطلاقًا', en: 'There is no difference at all' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'append(x) يلحق x عنصرًا مفردًا — حتى لو كان قائمة صارت عنصرًا متداخلًا! extend([x]) يفرد عناصر القائمة الوسيط في النهاية. أن تستبدل أحدهما بالآخر فخ آخر من فخاخ هذا الفصل.',
            en: 'append(x) attaches x as a single element — even if it is a list, it lands as a nested one! extend([x]) spreads the argument list elements at the end. Swapping one for the other is another trap of this chapter.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 't = [\'a\', \'b\', \'c\'] — ماذا يخزّن x بعد x = t.pop(0)؟',
            en: "t = ['a', 'b', 'c'] — what does x hold after x = t.pop(0)?",
          },
          options: [
            { id: 'a', text: { ar: "'a' — العنصر المُزال نفسه", en: "'a' — the removed element itself" } },
            { id: 'b', text: { ar: 'None — لأن pop تابع خالٍ', en: 'None — because pop is void' } },
            { id: 'c', text: { ar: 'القائمة المتبقية [\'b\', \'c\']', en: "The remaining list ['b', 'c']" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'pop استثناؤه بين توابع القوائم: يعدّل القائمة ويعيد العنصر المُزال — لهذا نستخدمه حين نحتاج القيمة بعد الحذف، كأصناف المكدسات والطوابير.',
            en: 'pop is the exception among list methods: it modifies the list and returns the removed element — that is why we use it when the deleted value is needed, like stacks and queues.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل السادس: word = word.strip() سليمة تمامًا على سلسلة — فلماذا يفشل النمط نفسه t = t.sort() على قائمة؟',
            en: 'From chapter 6: word = word.strip() is perfectly fine on a string — so why does the same pattern t = t.sort() fail on a list?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن strip يعيد سلسلة جديدة بينما sort يعدّل في المكان ويعيد None', en: 'Because strip returns a new string while sort modifies in place and returns None' } },
            { id: 'b', text: { ar: 'لأن السلاسل تُرتب والقوائم لا تُرتب', en: 'Because strings can be sorted but lists cannot' } },
            { id: 'c', text: { ar: 'لأن t = t.sort() رمي SyntaxError', en: 'Because t = t.sort() throws a SyntaxError' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'النمط البصري متشابه لكن السلوك معاكس: توابع السلاسل تُنتج وتُترك أصولها، وتوابع القوائم تُعدّل وتُعيد لا شيء. قاعدة الدرس: لا تسند نتيجة توابع القوائم.',
            en: 'The visual pattern is identical but the behavior is opposite: string methods produce and leave the original, list methods modify and return nothing. Lesson rule: never assign the result of list methods.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 't = [3, 1, 2]\nt = t.sort()\nprint(t[0])',
          right: 't = [3, 1, 2]\nt.sort()\nprint(t[0])',
          note: {
            ar: 'sort يعدّل في المكان ويعيد None — فبعد الإسناد t ليست قائمة أصلًا، وأول فهرس فيها يرمي TypeError. اكتب t.sort() وحدها.',
            en: 'sort modifies in place and returns None — after the assignment t is not a list at all, and indexing it throws a TypeError. Write t.sort() alone.',
          },
        },
        {
          wrong: "t = ['a', 'b']\nt.append(['c', 'd'])",
          right: "t = ['a', 'b']\nt.extend(['c', 'd'])",
          note: {
            ar: 'append يلحق وسيطه عنصرًا واحدًا: صار لديك قائمة متداخلة ["a", "b", ["c", "d"]] طولها 3! extend يفرد عناصر القائمة المضافة — اختر بوعي.',
            en: 'append attaches its argument as one element: you now own a nested list ["a", "b", ["c", "d"]] of length 3! extend spreads the added list elements — choose deliberately.',
          },
        },
        {
          wrong: "t = ['a', 'b']\nt.remove('z')",
          right: "t = ['a', 'b']\nif 'z' in t:\n    t.remove('z')",
          note: {
            ar: 'remove على قيمة غير موجودة يرمي ValueError فورًا. احمِ نفسك بفحص in أولًا — أو بالتوابع الأخرى إن كنت ألنّ من فهرس مؤكد.',
            en: "remove on a missing value throws a ValueError on the spot. Guard yourself with an in check first — or pick another road if you have a confirmed index.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'append يلحق عنصرًا واحدًا، وextend يمدّد بعناصر قائمة كاملة، وsort يرتب تصاعديًا — والثلاثة تعدّل في المكان وتعيد None.', en: 'append attaches one element, extend stretches with a whole list, sort orders ascending — all three modify in place and return None.' },
        { ar: 'الحذف أربع طرق: pop يعيد العنصر المُزال، وdel يزيل بلا قيمة، وremove يمحو بالقيمة المعروفة، وdel مع التجزئة يمحو نطاقًا.', en: 'Deletion has four roads: pop returns the removed element, del removes with no value, remove erases a known value, and del with a slice erases a range.' },
        { ar: 'القاعدة الذهبية: توابع السلاسل تعيد سلاسل جديدة وتترك الأصل، وتوابع القوائم تعدّل الأصل وتعيد None — لا تخلط الأنماط.', en: 'Golden rule: string methods return new strings and leave the original; list methods modify the original and return None — never mix the patterns.' },
      ],
      reflectPrompt: {
        ar: 'أمامك قائمة انتظار مطبعة: مهمة تستقبل، ومهمة تُنجز وتُرفع من القدم، ومهمة تُلغى باسمها المعروف. أي تابع من درسك يناسب كل عملية؟ اكتب الثلاثة بأسمائهم الإنجليزية.',
        en: 'Here is a print queue: a job arrives, a job is finished and lifted off the tail, a job is cancelled by its known name. Which method from this lesson fits each operation? Write the three names in English.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch8.s6', pages: 'ص123 / pp.123' },
        { book: 'PY4E', section: 'py4e.ch8.s7', pages: 'ص124 / pp.124' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch8.s6', pages: 'ص123 / pp.123' },
    { book: 'PY4E', section: 'py4e.ch8.s7', pages: 'ص124 / pp.124' },
  ],
} satisfies Lesson;

export default lesson;
