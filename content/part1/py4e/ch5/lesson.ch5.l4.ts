import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch5.l4 — "Loop Patterns: Counting and Summing / أنماط الحلقات: العدّ والمجموع"
 * Aligned with PY4E ch5 s6 first half (أنماط كتابة الحلقات: العدّ والمجموع والمعدل).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch5.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 5,
  title: { ar: 'أنماط الحلقات: العدّ والمجموع', en: 'Loop Patterns: Counting and Summing' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch5.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل تطبيق تحبّه — مشغّل يعدّ الأغاني، متجر يحسب الفاتورة، تطبيق يخرج معدل درجاتك — مبني على حيلة واحدة متواضعة: حلقة تسير على العناصر ومتغيّران يتراكمان. هذه الأشكال المتكررة تسمى أنماط الحلقات، ومن يحفظها يكتب الإحصاءات في دقائق. بنهاية هذا الدرس ستكون قادرًا على: بناء حلقة بخطواتها الثلاث، وتطبيق نمط العدّ ونمط المجموع، وحساب المعدل منهما.',
        en: 'Every app you love — a player counting songs, a store totaling your bill, a dashboard averaging your grades — is built on one humble trick: a loop walking the items, and two variables accumulating. These recurring shapes are called loop patterns, and whoever masters them writes statistics in minutes. By the end of this lesson you will be able to: build a loop through its three steps, apply the counting pattern and the summing pattern, and compute an average from the two.',
      },
    },
    {
      kind: 'predict',
      code: 'count = 0\nfor itervar in [3, 41, 12]:\n    count = count + 1\nprint(count)',
      question: {
        ar: 'العناصر كبيرة (41 و12) لكن النتيجة صغيرة. ماذا سيُطبع، ولماذا لا علاقة له بقيم العناصر؟',
        en: 'The elements are big (41 and 12) yet the result is small. What gets printed, and why does it not depend on the element values?',
      },
      reveal: {
        ar: 'سيطبع 3. النمط لا يجمع القيم — يعدّ المرات: العدّاد يزيد 1 مع كل عنصر مهما كانت قيمته. ثلاثة عناصر = ثلاث زيادات = 3.',
        en: 'It prints 3. The pattern does not add the values — it counts the visits: the counter gains 1 per element whatever its value. Three elements = three increments = 3.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'وصفة بناء الحلقة في ثلاث خطوات', en: 'The three-step loop recipe' },
      chunks: [
        {
          ar: 'نستخدم حلقات for وwhile لتنفيذ عملية على مجموعة عناصر في قائمة أو ملف — وقد تكون العملية البحث عن شيء مثل أكبر أو أصغر قيمة. تتم بناء الحلقات عادةً كما يلي: 1) إعطاء قيمة ابتدائية لمتغيّر أو عدة متغيرات قبل بداية الحلقة. 2) تنفيذ عملية حسابية على كل عنصر في جسم الحلقة، وقد يترافق ذلك مع تغيّر قيم المتغيرات. 3) إظهار القيم الناتجة بعد إتمام تنفيذ الحلقة.',
          en: 'We use for and while loops to perform an operation on a collection of items in a list or file — and the operation may be a search, like the largest or smallest value. Loops are typically built like this: 1) give an initial value to one or more variables before the loop starts. 2) perform a computation on each item inside the loop body, possibly changing the variables. 3) show the resulting values after the loop finishes.',
        },
        {
          ar: 'الخطوة الأولى هي الأكثر إهمالًا وهي الأهم: المتغيّر التراكمي يجب أن يولد قبل الحلقة بقيمة صفرية. لو وُلد داخل الجسم لمس صفره مع كل تكرار فنسي كل ما تراكم — وسنعود لهذا الفخ في التمارين. وتذكّر أن الطباعة النهائية تقف بعد الحلقة لا داخلها.',
          en: 'The first step is the most neglected and the most important: the accumulator must be born before the loop with a zero value. If it were born inside the body, it would be wiped to zero every iteration and forget everything it gathered — a trap we revisit in the exercises. And remember: the final print stands after the loop, not inside it.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط العدّ: العدّاد', en: 'The counting pattern: the counter' },
      chunks: [
        {
          ar: 'نمط العدّ عدّادٌ يبدأ صفرًا ويزيد 1 مع كل عنصر — قيمة العنصر نفسها لا تهم:\ncount = 0\nfor itervar in [3, 41, 12, 9, 74, 15]:\n    count = count + 1\nprint(\'Count: \', count)\nالخرْج Count: 6 — الحاسوب عدّ العناصر ستة بلا أن يشيح بصر واحد.',
          en: "The counting pattern is a counter starting at zero and gaining 1 per element — the element's own value is irrelevant:\ncount = 0\nfor itervar in [3, 41, 12, 9, 74, 15]:\n    count = count + 1\nprint('Count: ', count)\nThe output is Count: 6 — the computer counted six items without blinking.",
        },
        {
          ar: 'اسمه في الكتاب العدّاد (counter)، وهذا النمط هو الذي يقول لك: كم طالبًا اجتاز؟ كم رسالة وصلت اليوم؟ كم كلمة في الملف؟ السؤال دائمًا «كم؟» — والجواب دائمًا عدّاد.',
          en: 'The book calls it a counter, and this pattern answers: how many students passed? How many messages arrived today? How many words in the file? The question is always "how many?" — and the answer is always a counter.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط المجموع: المتغيّر التراكمي والمعدل', en: 'The summing pattern: the accumulator and the average' },
      chunks: [
        {
          ar: 'نمط المجموع يشبه العدّ لكنه يضيف قيمة العنصر نفسها:\ntotal = 0\nfor itervar in [3, 41, 12, 9, 74, 15]:\n    total = total + itervar\nprint(\'Total: \', total)\nالخرْج Total: 154. اسمه المتغيّر التراكمي (accumulator) لأنه يجمع تراكميًا — وقد استخدمناه في كل شيء حتى الآن من جمع أعداد صغيرة إلى حساب رواتب.',
          en: "The summing pattern resembles counting but adds the element's own value:\ntotal = 0\nfor itervar in [3, 41, 12, 9, 74, 15]:\n    total = total + itervar\nprint('Total: ', total)\nThe output is Total: 154. It is called an accumulator because it gathers cumulatively — and we have been using it all along, from adding small numbers to computing pay.",
        },
        {
          ar: 'وحين تجتمع النمطان تحصل على المعدل بلا جهد: average = total / count — مجموع القيم مقسومًا على عددها. جرّب round(average, 2) لعرضه برقمين عشريين مهذبين. لا تابع سحري ولا حزمة إحصاء: عددان من حلقة واحدة.',
          en: 'And when the two patterns meet, the average comes free: average = total / count — the sum of values divided by their count. Try round(average, 2) to display it with two tidy decimals. No magic function, no statistics package: two numbers from one loop.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'إحصائية كاملة في حلقة واحدة', en: 'A full statistic in one loop' },
      code: "numbers = [3, 41, 12, 9, 74, 15]\ncount = 0\ntotal = 0\nfor itervar in numbers:\n    count = count + 1\n    total = total + itervar\nprint('العدد:', count)\nprint('المجموع:', total)\nprint('المعدل:', round(total / count, 2))",
      explanation: {
        ar: 'العدّاد والمتراكم وُلدا قبل الحلقة، وجسم الحلقة أجرى العمليتين معًا على كل عنصر، ثم جاءت الطباعة الثلاثية بعد اكتمال الحلقة — الخطوة الثالثة من الوصفة. المعدل 25.67 لأن 154 ÷ 6 تساوي 25.66… فقرّبناها بـ round. غيّر عنصرًا واحدًا في القائمة وأعد التشغيل وراقب الأرقام الثلاثة تتحرك معًا.',
        en: 'The counter and accumulator were born before the loop, the body performed both operations on every element, and the three prints came after the loop finished — step three of the recipe. The average is 25.67 because 154 ÷ 6 equals 25.66…, which we rounded with round. Change one element in the list and run again: watch all three numbers move together.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.write-count-sum',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'القائمة numbers = [4, 8, 15, 16, 23, 42] معطاة. اكتب حلقة for تحسب فيها عدد العناصر في count ومجموعها في total (ابدأهما صفرًا قبل الحلقة)، ثم اطبع count وtotal. المتوقع: 6 ثم 108.',
        en: 'The list numbers = [4, 8, 15, 16, 23, 42] is given. Write a for loop that counts the elements into count and sums them into total (start both at zero before the loop), then print count and total. Expected: 6 then 108.',
      },
      starterCode: 'numbers = [4, 8, 15, 16, 23, 42]\n# ابدأ count وtotal ثم حلقة ثم طباعة / init count and total, loop, print\n',
      solution: 'numbers = [4, 8, 15, 16, 23, 42]\ncount = 0\ntotal = 0\nfor n in numbers:\n    count = count + 1\n    total = total + n\nprint(count)\nprint(total)',
      tests: [
        {
          id: 't1',
          name: { ar: 'count يساوي 6', en: 'count equals 6' },
          code: "assert count == 6, 'expected: 6 | actual: %r' % count",
          expected: '6',
        },
        {
          id: 't2',
          name: { ar: 'total يساوي 108', en: 'total equals 108' },
          code: "assert total == 108, 'expected: 108 | actual: %r' % total",
          expected: '108',
        },
        {
          id: 't3',
          name: { ar: 'يُطبع 6 ثم 108', en: '6 then 108 are printed' },
          code: "assert '108' in __learner_output__, ('expected: 108 in output | actual: %r' % __learner_output__)",
          expected: '6\n108',
        },
      ],
      hints: [
        { ar: 'سطرا التهيئة قبل الحلقة: count = 0 وtotal = 0.', en: 'Two initialization lines before the loop: count = 0 and total = 0.' },
        { ar: 'داخل الجسم سطران: count = count + 1 وtotal = total + n — كلاهما بإزاحة.', en: 'Two lines in the body: count = count + 1 and total = total + n — both indented.' },
        { ar: 'الهيكل:\ncount = 0\ntotal = 0\nfor n in numbers:\n    count = count + 1\n    total = total + n\nprint(count)\nprint(total)', en: 'The skeleton:\ncount = 0\ntotal = 0\nfor n in numbers:\n    count = count + 1\n    total = total + n\nprint(count)\nprint(total)' },
        { ar: 'numbers = [4, 8, 15, 16, 23, 42]\ncount = 0\ntotal = 0\nfor n in numbers:\n    count = count + 1\n    total = total + n\nprint(count)\nprint(total)', en: 'numbers = [4, 8, 15, 16, 23, 42]\ncount = 0\ntotal = 0\nfor n in numbers:\n    count = count + 1\n    total = total + n\nprint(count)\nprint(total)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-counter',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'كل عناصر القائمة متساوية — هل يقلب هذا نتيجة نمط العدّ؟ توقّع الخرْج.',
        en: 'Every element is identical — does that change the counting pattern result? Predict the output.',
      },
      code: 'count = 0\nfor n in [7, 7, 7]:\n    count = count + 1\nprint(count)',
      solution: '3',
      answer: '3',
      hints: [
        { ar: 'العدّاد لا يقرأ قيمة n أبدًا — يزيد 1 عند كل تكرار.', en: 'The counter never reads the value of n — it gains 1 per iteration.' },
        { ar: 'ثلاثة عناصر مهما كانت قيمها = ثلاثة تكرارات = 3.', en: 'Three elements whatever their values = three iterations = 3.' },
        { ar: 'لو كان السطر total = total + n لكانت النتيجة 21 — لكن هذا عدّ لا جمع.', en: 'If the line were total = total + n the result would be 21 — but this is counting, not summing.' },
        { ar: 'الخرْج: 3', en: 'The output: 3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.numeric-average',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل — أحسب يدويًا: إذا كانت total = 60 وcount = 3 بعد حلقة على القائمة [10, 20, 30]، فكم المعدل total / count؟',
        en: 'Without running — compute by hand: if total = 60 and count = 3 after looping over [10, 20, 30], what is the average total / count?',
      },
      answer: '20',
      solution: '20',
      tolerance: 0,
      hints: [
        { ar: 'المعدل = المجموع ÷ العدد.', en: 'Average = sum ÷ count.' },
        { ar: '60 ÷ 3 — جواب صحيح لا عشري.', en: '60 ÷ 3 — a whole answer, no decimals.' },
        { ar: 'تحقق: 10 + 20 + 30 = 60 وعدد العناصر 3.', en: 'Check: 10 + 20 + 30 = 60 with 3 elements.' },
        { ar: 'الجواب: 20', en: 'Answer: 20' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.mcq-init-inside',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'وضع زميلك سطر total = 0 داخل جسم الحلقة بدلًا من قبلها. ماذا سيحدث لمجموع قائمة [5, 9]؟',
        en: 'Your teammate placed the line total = 0 inside the loop body instead of before it. What happens to the sum of the list [5, 9]?',
      },
      options: [
        { id: 'a', text: { ar: 'يطبع 9 — الصفر يمسح التراكم في كل تكرار فيبقى آخر عنصر فقط', en: 'It prints 9 — the zero wipes the accumulation every iteration, leaving only the last element' } },
        { id: 'b', text: { ar: 'يطبع 14 — لا فرق في مكان التهيئة', en: 'It prints 14 — initialization position makes no difference' } },
        { id: 'c', text: { ar: 'يرمي TypeError', en: 'It raises a TypeError' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تتبّع إحكامًا: في التكرار الأول يولد total = 0 ثم يصير 5. وفي الثاني؟', en: 'Trace tightly: in the first iteration total is born as 0 then becomes 5. And in the second?' },
        { ar: 'السطر الأول من الجسم يعيد الوضع إلى الصفر قبل الإضافة.', en: "The body's first line resets everything to zero before adding." },
        { ar: 'لذلك قالت الوصفة: التهيئة قبل الحلقة — خطوة أولى مستقلة.', en: 'That is why the recipe says: initialize before the loop — a separate first step.' },
        { ar: 'الجواب: أ — 0 + 9 = 9، فتضيع 5 ولا يظهر خطأ أصلًا: خطأ دلالي صامت.', en: 'Answer: a — 0 + 9 = 9; the 5 is lost and no error ever appears: a silent semantic bug.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — راقب التراكم خطوة بخطوة\n# Your playground — watch the accumulation step by step\n\ntotal = 0\nfor n in [10, 20, 30, 40]:\n    total = total + n\n    print(\'بعد\', n, \'صار المجموع\', total)\nprint(\'المجموع النهائي:\', total)',
      prompt: {
        ar: 'جرّب بنفسك: راقب المجموع الجزئي يكبر عنصرًا بعد عنصر. ثم انقل total = 0 داخل الجسم وشاهد النتيجة تنهار، ثم أعدها. وأضف count وأخرج المعدل. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: watch the running total grow element by element. Then move total = 0 inside the body and watch the result collapse, then move it back. Then add a count and produce the average. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما القيمة الابتدائية الصحيحة لعدّاد سيعدّ عناصر قائمة؟',
            en: 'What is the correct initial value for a counter about to count list elements?',
          },
          options: [
            { id: 'a', text: { ar: '0 — فلا يعدّ شيئًا قبل أول تكرار', en: '0 — so it counts nothing before the first iteration' } },
            { id: 'b', text: { ar: '1 — لأننا نعدّ عنصرًا واحدًا على الأقل', en: '1 — because we count at least one element' } },
            { id: 'c', text: { ar: 'لا يحتاج تهيئة', en: 'It needs no initialization' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'العدّاد يبدأ صفرًا قبل الحلقة: قبل عدّ أول عنصر لم نعدّ شيئًا بعد. وتذكر أن بلا تهيئة أصلًا سيقف العدّ في NameError.',
            en: 'The counter starts at zero before the loop: before counting the first element we have counted nothing. And with no initialization at all, counting would crash with NameError.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كم تكرارًا ينفّذها جسم الحلقة على قائمة فيها 6 عناصر؟',
            en: 'How many iterations does the body run for a list of 6 elements?',
          },
          options: [
            { id: 'a', text: { ar: 'خمسة', en: 'Five' } },
            { id: 'b', text: { ar: 'ستة — تكرار لكل عنصر', en: 'Six — one per element' } },
            { id: 'c', text: { ar: 'يعتمد على قيم العناصر', en: 'It depends on the element values' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حلقة for محددة: عنصر = تكرار، فستة عناصر = ستة تكرارات بغض النظر عن قيمها.',
            en: 'A for loop is definite: one item = one iteration, so six items = six iterations regardless of their values.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثاني: في السطر total = total + n — ما الذي يحدث بالضبط؟',
            en: 'And from chapter 2: in the line total = total + n — what exactly happens?',
          },
          options: [
            { id: 'a', text: { ar: 'تقرأ بايثون قيمة total القديمة وتضيف عليها n ثم تخزّن الناتج في total', en: 'Python reads the old value of total, adds n to it, then stores the result back into total' } },
            { id: 'b', text: { ar: 'تقارن total بـ total + n', en: 'It compares total with total + n' } },
            { id: 'c', text: { ar: 'تحذف القيمة القديمة قبل القراءة', en: 'It deletes the old value before reading it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا جوهر الإسناد الذي تعلمته في الفصل الثاني: الطرف الأيمن يُحسب أولًا بالقيمة الحالية، ثم يُخزّن الناتج — وهو ما يجعل التراكم ممكنًا.',
            en: 'This is the heart of assignment from chapter 2: the right side computes first using the current value, then the result is stored — which is exactly what makes accumulation possible.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'وفي السطر print(total / count) بعد الحلقة بـ total = 10 وcount = 4 — ماذا يطبع؟',
            en: 'And in print(total / count) after the loop, with total = 10 and count = 4 — what does it print?',
          },
          options: [
            { id: 'a', text: { ar: '2 — قسمة صحيحة', en: '2 — integer division' } },
            { id: 'b', text: { ar: '2.5 — القسمة الحقيقية تنتج عددًا عائمًا', en: '2.5 — true division yields a float' } },
            { id: 'c', text: { ar: '2.4', en: '2.4' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'تذكّر من درس العوامل: / قسمة حقيقية تنتج عائمًا (2.5) بينما // قسمة صحيحة كانت ستعطي 2. المعدل الذي تحبه التطبيقات كله عائم.',
            en: 'Remember the operators lesson: / is true division yielding a float (2.5), while // integer division would give 2. The averages apps love are all floats.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'for n in [5, 9]:\n    count = 0\n    count = count + 1',
          right: 'count = 0\nfor n in [5, 9]:\n    count = count + 1',
          note: {
            ar: 'التهيئة داخل الجسم تعيد العدّاد إلى الصفر كل تكرار — فتنتهي الحلقة بـ 1 مهما كانت القائمة. الوصفة: التهيئة خطوة قبل الحلقة.',
            en: 'Initializing inside the body resets the counter to zero every iteration — the loop ends with 1 no matter the list. The recipe: initialization is a step before the loop.',
          },
        },
        {
          wrong: 'total = 0\nfor n in [4, 8, 15]:\n    total = total + count',
          right: 'total = 0\nfor n in [4, 8, 15]:\n    total = total + n',
          note: {
            ar: 'تراكمت العدّادة لا العناصر: حصلت على مجموع الأرقام 1+2+3 لا مجموع القيم. راقب الاسم الذي تجمعه — العنصر n لا العدّاد count.',
            en: 'You accumulated the counter, not the items: you got 1+2+3 instead of the sum of values. Watch the name you add — the element n, not the counter count.',
          },
        },
        {
          wrong: 'count = 0\nfor n in [4, 8, 15]:\n    count = count + 1\n    print(count)\nprint(\'تم\')',
          right: 'count = 0\nfor n in [4, 8, 15]:\n    count = count + 1\nprint(count)',
          note: {
            ar: 'الطباعة داخل الجسم تُخرج القيم الجزئية 1 2 3 في كل تكرار — والنتيجة النهائية تقف بعد الحلقة (الخطوة الثالثة من الوصفة).',
            en: 'Printing inside the body dumps the partial values 1 2 3 per iteration — the final result stands after the loop (step three of the recipe).',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'وصفة الحلقة: تهيئة المتغيرات قبل الحلقة، ثم عملية على كل عنصر في الجسم، ثم إظهار النتائج بعد اكتمالها.', en: 'The loop recipe: initialize variables before the loop, process each element in the body, then show the results after it completes.' },
        { ar: 'نمط العدّ يزيد عدّادًا 1 مع كل عنصر بغض النظر عن قيمته — ونمط المجموع يضيف قيمة العنصر إلى متغيّر تراكمي يبدأ صفرًا.', en: 'The counting pattern gains 1 per element regardless of its value; the summing pattern adds the element value to an accumulator born at zero.' },
        { ar: 'المعدل = total / count يخرج مجانًا من النمطين — والقسمة الحقيقية / تنتج عددًا عائمًا.', en: 'The average = total / count comes free from the two patterns — and true division / yields a float.' },
      ],
      reflectPrompt: {
        ar: 'افتح أي تطبيق إحصائي تعرفه (خطوات اليوم، ساعات اللعب): أي نمط منهما يقف خلف كل رقم يعرضه؟ عدّ، أم مجموع، أم معدل منهما؟',
        en: 'Open any stats app you know (daily steps, play hours): which of the two patterns stands behind every number it shows — a count, a sum, or an average of the two?',
      },
    },
    {
      kind: 'sources',
      items: [{ book: 'PY4E', section: 'py4e.ch5.s6', pages: 'ص79 / pp.79' }],
    },
  ],
  sources: [{ book: 'PY4E', section: 'py4e.ch5.s6', pages: 'ص79 / pp.79' }],
} satisfies Lesson;

export default lesson;
