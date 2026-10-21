import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch5.l1 — "Updating Variables and the while Loop / تحديث المتغيرات وحلقة while"
 * Aligned with PY4E ch5 s1 (تحديث قيم المتغيرات), s2 (حلقة WHILE).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch5.l1',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 5,
  title: { ar: 'تحديث المتغيرات وحلقة while', en: 'Updating Variables and the while Loop' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch4.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الحاسوب سمّي بهذا الاسم لأنه يحسب، ويحسب، ويحسب — بلا ملل ولا خطأ. الدرس السابق علّمك التوابع التي تختصر التعليمات المكررة، واليوم تتعلم آلية التكرار نفسها. بنهاية هذا الدرس ستكون قادرًا على: تحديث قيمة متغيّر اعتمادًا على قيمته القديمة، وتمييز الزيادة من الإنقاص، وكتابة حلقة while بشرطها وجسمها، وعدّ تكراراتها واحدًا واحدًا.',
        en: 'The computer was named after counting — it counts, and counts, and counts, without boredom or error. Last chapter gave you functions that shrink repeated instructions; today you meet repetition itself. By the end of this lesson you will be able to: update a variable using its old value, tell increment from decrement, write a while loop with its condition and body, and count its iterations one by one.',
      },
    },
    {
      kind: 'predict',
      code: 'x = 0\nx = x + 1\nx = x + 1\nprint(x)',
      question: {
        ar: 'السطر الثاني يبدو مستحيلًا رياضيًا: كيف يساوي x نفسه زائد واحد؟ ماذا سيطبع البرنامج؟',
        en: 'The second line looks mathematically impossible: how can x equal x plus one? What will the program print?',
      },
      reveal: {
        ar: 'سيطبع 2. الرمز = ليس معادلة رياضية بل إسناد: بايثون تنفّذ الطرف الأيمن أولًا — تجلب قيمة x الحالية وتضيف إليها 1 — ثم تخزّن الناتج في x من جديد. الصندوق يقرأ نفسه ثم يمتلئ بقيمة جديدة.',
        en: 'It prints 2. The = sign is not a math equation but an assignment: Python runs the right side first — fetches the current value of x and adds 1 — then stores the result back into x. The box reads itself, then refills with a new value.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تحديث قيم المتغيرات: صندوق يقرأ نفسه', en: 'Updating variables: a box that reads itself' },
      chunks: [
        {
          ar: 'تستخدم تعليمة الإسناد لتحديث قيمة متغيّر اعتمادًا على قيمته القديمة: السطر x = x + 1 يعني — أجرِ قيمة x الحالية، أضف إليها واحدًا، واجعل الناتج قيمة جديدة للمتغير x. وتسمى عملية إضافة 1 إلى القيمة القديمة بالزيادة (increment)، وطرح 1 منها بالإنقاص (decrement): x = x - 1.',
          en: 'You use the assignment statement to update a variable based on its old value: the line x = x + 1 means — take the current value of x, add one to it, and make the result the new value of x. Adding 1 to the old value is called an increment, and subtracting 1 is a decrement: x = x - 1.',
        },
        {
          ar: "لكن التحديث يفشل إذا كان المتغيّر لم يُعرَّف من قبل — لأن بايثون تنفّذ الطرف الأيمن قبل أن تُحدَّث قيمة x، فتبحث عن x فلا تجدها: NameError: name 'x' is not defined. لذا عليك تعريف المتغيّر أولًا: اكتب x = 0 ثم حدّث قيمته كما تشاء.",
          en: "But the update fails if the variable was never defined — because Python executes the right side before updating x, so it hunts for x and finds nothing: NameError: name 'x' is not defined. So you must define the variable first: write x = 0, then update it as you please.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'حلقة while: كرّر ما دام الشرط محققًا', en: 'The while loop: repeat while the condition holds' },
      chunks: [
        {
          ar: 'الحواسيب تبرع في تكرار المهام المتطابقة بينما يعجز البشر دون أخطاء، لذا تزوّدنا بايثون بحلقة while. هذا برنامج عدّ تنازلي يبدأ من 5 وينتهي بعبارة "Blastoff!":\nn = 5\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint(\'Blastoff!\')',
          en: "Computers excel at repeating identical tasks while humans fail at it with errors, so Python gives us the while loop. This countdown program starts at 5 and ends with \"Blastoff!\":\nn = 5\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Blastoff!')",
        },
        {
          ar: 'تنفّذ بايثون حلقة while كما يلي: 1) تقيّم ما إذا كان الشرط قد تحقق أم لا. 2) إذا لم يتحقق الشرط، تخرج من الحلقة وتنفّذ التعليمة التالية. 3) إذا تحقق، تنفّذ جسم الحلقة ثم تعود إلى الخطوة الأولى. لهذا سميت حلقة (loop): الخطوة الثالثة تعود إلى الأولى. وكل مرة يُنفَّذ فيها الجسم تسمى تكرارًا (iteration) — مثالنا له خمس تكرارات.',
          en: 'Python runs a while loop like this: 1) evaluate whether the condition holds or not. 2) If the condition does not hold, exit the loop and run the next statement. 3) If it holds, run the loop body then return to step one. That is why it is called a loop: step three returns to step one. Each execution of the body is called an iteration — our example has five iterations.',
        },
        {
          ar: 'لاحظ أن الترويسة تنتهي بنقطتين والجسم بإزاحة — قواعد if نفسها من الفصل الثالث. ويجب أن تُغيّر تعليمات الجسم قيمة متغيّر ما نسميه متغيّر التكرار (iteration variable) — هنا n — حتى نصل إلى مرحلة لا يتحقق فيها الشرط فيتوقف التنفيذ. وإلا تكررت الحلقة إلى الأبد: حلقة لانهائية نتعالجها في الدرس القادم.',
          en: "Note the header ends with a colon and the body is indented — the same if grammar from chapter 3. The body's statements must change the value of a variable we call the iteration variable — here n — until we reach a point where the condition no longer holds and execution stops. Otherwise the loop repeats forever: an infinite loop, which we treat in the next lesson.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'العد التنازلي خطوة بخطوة', en: 'The countdown, step by step' },
      code: "n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Blastoff!')",
      explanation: {
        ar: 'أولًا: هل 5 > 0؟ نعم — اطبع 5 وإنقِص إلى 4، ثم عد للسؤال: هل 4 > 0؟ نعم — اطبع 4… وهكذا حتى نطبع 1 وإنقِص إلى 0، فيجيب السؤال أخيرًا: لا. نخرج من الحلقة وننفّذ أول تعليمة بعد الجسم: Blastoff! جرّب تغيير الشرط إلى n > 1 — كم تكرارًا تحصل عليها الآن؟',
        en: 'First: is 5 > 0? Yes — print 5 and decrement to 4, then ask again: is 4 > 0? Yes — print 4… until we print 1 and decrement to 0, and the question finally answers: no. We exit the loop and run the first statement after the body: Blastoff! Try changing the condition to n > 1 — how many iterations do you get now?',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.update-increment',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'عرّف المتغيّر x بالقيمة 0، ثم حدّث قيمته ثلاث مرات بالزيادة (سطر x = x + 1 مكرر ثلاثًا)، ثم اطبع x. المتوقع في الخرْج: 3.',
        en: 'Define the variable x with the value 0, then update it three times by incrementing (the line x = x + 1 repeated three times), then print x. Expected output: 3.',
      },
      starterCode: '# عرّف x ثم حدّثه ثلاث مرات ثم اطبع / define x, update 3 times, print:\n',
      solution: 'x = 0\nx = x + 1\nx = x + 1\nx = x + 1\nprint(x)',
      tests: [
        {
          id: 't1',
          name: { ar: 'x يساوي 3 بعد التحديثات', en: 'x equals 3 after the updates' },
          code: "assert x == 3, 'expected: 3 | actual: %r' % x",
          expected: '3',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع 3', en: '3 is printed' },
          code: "assert '3' in __learner_output__, ('expected: 3 | actual: %r' % __learner_output__)",
          expected: '3',
        },
      ],
      hints: [
        { ar: 'التحديث سطر مستقل: x = x + 1 — كرّره ثلاث مرات تحت بعض.', en: 'The update is its own line: x = x + 1 — repeat it three times, one below the other.' },
        { ar: 'الإسناد يقرأ القيمة القديمة ثم يخزّن الجديدة — لا حاجة لـ if هنا.', en: 'Assignment reads the old value then stores the new one — no if needed here.' },
        { ar: 'الهيكل:\nx = 0\nx = x + 1\nx = x + 1\nx = x + 1\nprint(x)', en: 'The skeleton:\nx = 0\nx = x + 1\nx = x + 1\nx = x + 1\nprint(x)' },
        { ar: 'x = 0\nx = x + 1\nx = x + 1\nx = x + 1\nprint(x)', en: 'x = 0\nx = x + 1\nx = x + 1\nx = x + 1\nprint(x)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-name-error',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'نفّذت بايثون السطر x = x + 1 في برنامج لم يعرّف x قبل ذلك. ماذا يحدث؟',
        en: 'Python runs the line x = x + 1 in a program that never defined x before. What happens?',
      },
      options: [
        { id: 'a', text: { ar: 'يُطبع 1', en: 'It prints 1' } },
        { id: 'b', text: { ar: 'يرمي NameError لأنه نفّذ الطرف الأيمن ولم يجد x', en: 'It raises NameError because it executed the right side and found no x' } },
        { id: 'c', text: { ar: 'يرمي SyntaxError لأن السطر غير صحيح قواعديًا', en: 'It raises SyntaxError because the line is grammatically invalid' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'القواعد سليمة تمامًا: اسم، إسناد، تعبير — فأين يظهر الخطأ إذن؟', en: 'The grammar is perfectly legal: a name, an assignment, an expression — so where does the error come from?' },
        { ar: 'تذكّر من درس المتغيّرات: بايثون تنفّذ الطرف الأيمن قبل تخزين الناتج.', en: 'Remember from the variables lesson: Python executes the right side before storing the result.' },
        { ar: 'البحث عن x بين الصناديق غير المعرّفة يفشل أثناء التشغيل لا قبله.', en: 'The hunt for x among undefined boxes fails at runtime, not before it.' },
        { ar: "الجواب: ب — NameError: name 'x' is not defined، والحل تعريف x أولًا.", en: "Answer: b — NameError: name 'x' is not defined; the fix is defining x first." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-while',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تتبّع الحلقة بعينك لا بتشغيلها، وتوقّع الخرْج سطرًا سطرًا.',
        en: 'Trace the loop with your eyes, not the runner, and predict the output line by line.',
      },
      code: "n = 3\nwhile n > 1:\n    print(n)\n    n = n - 1\nprint('انتهى')",
      solution: '3\n2\nانتهى',
      answer: '3\n2\nانتهى',
      hints: [
        { ar: 'هل 3 > 1؟ اطبع ثم أنقِص. وهل 2 > 1؟ اطبع ثم أنقِص.', en: 'Is 3 > 1? Print then decrement. Is 2 > 1? Print then decrement.' },
        { ar: 'عندما تصبح n تساوي 1 يفشل الشرط 1 > 1 — تخرج من الحلقة.', en: 'When n becomes 1 the condition 1 > 1 fails — you exit the loop.' },
        { ar: 'سطر انتهى خارج الجسم — يُنفَّذ بعد الحلقة دائمًا.', en: 'The انتهى line is outside the body — it runs after the loop, always.' },
        { ar: 'الخرْج:\n3\n2\nانتهى', en: 'The output:\n3\n2\nانتهى' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.write-countdown',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب عدًّا تنازليًا كاملًا: عرّف n بالقيمة 3، وبحلقة while اطبع قيمتها في كل تكرار (كل عدد في سطر) وأنقِصها واحدًا حتى الصفر، وبعد الحلقة اطبع Blastoff! المتوقع: 3 ثم 2 ثم 1 ثم Blastoff!',
        en: 'Write a full countdown: define n as 3, and with a while loop print its value on every iteration (one number per line) and decrement it by one down to zero, then after the loop print Blastoff! Expected: 3, then 2, then 1, then Blastoff!',
      },
      starterCode: 'n = 3\n# اكتب الحلقة ثم الطباعة الختامية / write the loop, then the final print\n',
      solution: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Blastoff!')",
      tests: [
        {
          id: 't1',
          name: { ar: 'تُطبع الأعداد 3 2 1 كلٌّ في سطر', en: 'The numbers 3 2 1 print on separate lines' },
          code: "assert '3\\n2\\n1' in __learner_output__, ('expected: 3/2/1 lines | actual: %r' % __learner_output__)",
          expected: '3\n2\n1',
        },
        {
          id: 't2',
          name: { ar: 'تُطبع عبارة Blastoff!', en: 'The phrase Blastoff! is printed' },
          code: "assert 'Blastoff!' in __learner_output__, ('expected: Blastoff! | actual: %r' % __learner_output__)",
          expected: 'Blastoff!',
        },
        {
          id: 't3',
          name: { ar: 'الحلقة أنقصت n حتى الصفر', en: 'The loop decremented n to zero' },
          code: "assert n == 0, 'expected: 0 | actual: %r' % n",
          expected: '0',
        },
      ],
      hints: [
        { ar: 'الترويسة: while n > 0: — والجسم بإزاحة أربعة فراغات: طباعة ثم إنقاص.', en: 'Header: while n > 0: — body indented four spaces: a print then a decrement.' },
        { ar: 'لا تنسَ سطر التحديث داخل الجسم — بقيده لا يتقدم العد التنازلي أبدًا.', en: 'Do not forget the update line inside the body — without it the countdown never advances.' },
        { ar: "الهيكل:\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Blastoff!')", en: "The skeleton:\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Blastoff!')" },
        { ar: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Blastoff!')", en: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Blastoff!')" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — لعب بالعداد\n# Your playground — play with the counter\n\nn = 5\nwhile n > 0:\n    print(n)\n    n = n - 2\nprint('انطلقنا!')",
      prompt: {
        ar: 'جرّب بنفسك: غيّر الإنقاص إلى n = n - 2 ولاحظ أن العد يقفز فوق الصفر ويتوقف عند -1 — لماذا توقف رغم أن 0 لم تُطبع أصلًا؟ ثم جرّب شرطًا آخر مثل n > 2. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: change the decrement to n = n - 2 and watch the count jump over zero and stop at -1 — why did it stop even though 0 was never printed? Then try another condition like n > 2. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصلين الثاني والثالث: السطر n = n - 1 فيه علامة = واحدة — ماذا تفعل هنا؟',
            en: 'Back to chapters 2 and 3: the line n = n - 1 holds a single = — what does it do here?',
          },
          options: [
            { id: 'a', text: { ar: 'إسناد: يقرأ القيمة القديمة ويخزّن الجديدة', en: 'Assignment: reads the old value and stores the new one' } },
            { id: 'b', text: { ar: 'مقارنة: يسأل هل n تساوي n - 1', en: 'Comparison: asks whether n equals n - 1' } },
            { id: 'c', text: { ar: 'طباعة قيمة n', en: 'Prints the value of n' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'علامة واحدة إسناد يحدّث الصندوق، والاثنتان == مقارنة تسأل — وتحديث المتغيّر بهذه الطريقة هو وقود الحلقة كلها.',
            en: 'A single sign assigns and updates the box, double == compares and asks — and updating the variable this way is the fuel of the whole loop.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في العد التنازلي من 5، متى تخرج بايثون من حلقة while n > 0 بالضبط؟',
            en: 'In the countdown from 5, when exactly does Python exit the while n > 0 loop?',
          },
          options: [
            { id: 'a', text: { ar: 'بعد الطباعة الخامسة مباشرة', en: 'Right after the fifth print' } },
            { id: 'b', text: { ar: 'عندما تصبح قيمة n صفرًا فيفشل الشرط', en: 'When n becomes zero and the condition fails' } },
            { id: 'c', text: { ar: 'بعد تكرار واحد فقط', en: 'After a single iteration' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بعد كل تكرار يُعاد تقييم الشرط؛ وعندما تصبح n = 0 يجيب n > 0 بـ False فتخرج الحلقة وتنفَّذ التعليمة التالية.',
            en: 'The condition is re-evaluated after every iteration; when n = 0, n > 0 answers False and the loop exits, running the next statement.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'كم تكرارًا يُنفَّذ جسم الحلقة في مثال العد التنازلي الذي يبدأ من 5؟',
            en: 'How many iterations does the body run in the countdown example that starts at 5?',
          },
          options: [
            { id: 'a', text: { ar: 'أربعة', en: 'Four' } },
            { id: 'b', text: { ar: 'خمسة', en: 'Five' } },
            { id: 'c', text: { ar: 'ستة', en: 'Six' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الجسم يُنفَّذ عند n = 5 و4 و3 و2 و1 — خمس مرات — وعند 0 يفشل الشرط. كل مرة تنفيذ تسمى تكرارًا (iteration).',
            en: 'The body runs at n = 5, 4, 3, 2 and 1 — five times — and at 0 the condition fails. Each execution is called an iteration.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثالث: الشرط n > 0 داخل ترويسة الحلقة — ما نوع قيمته؟',
            en: 'And from chapter 3: the condition n > 0 inside the loop header — what is the type of its value?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد صحيح int', en: 'An integer int' } },
            { id: 'b', text: { ar: 'قيمة منطقية bool: True أو False', en: 'A boolean bool: True or False' } },
            { id: 'c', text: { ar: 'نص str', en: 'A string str' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المقارنة تعبير منطقي قيمته True أو False من صنف bool — وهي التي تحكم على كل تكرار: نفّذ أو اخرج.',
            en: 'The comparison is a boolean expression whose value is True or False of class bool — and it judges every iteration: run or exit.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'x = x + 1',
          right: 'x = 0\nx = x + 1',
          note: {
            ar: "تحديث متغيّر غير معرّف يرمي NameError: name 'x' is not defined — لأن بايثون تنفّذ الطرف الأيمن أولًا وتبحث عن x. عرّف المتغيّر قبل أن تُحدّثه.",
            en: "Updating an undefined variable throws NameError: name 'x' is not defined — because Python executes the right side first and hunts for x. Define the variable before updating it.",
          },
        },
        {
          wrong: 'n = 5\nwhile n > 0:\n    print(n)',
          right: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1',
          note: {
            ar: 'نسيت تحديث متغيّر التكرار داخل الجسم — الشرط يبقى محققًا إلى الأبد: حلقة لانهائية. كل جسم حلقة while يحتاج خطوة تقرّبه من نهايته.',
            en: 'You forgot to update the iteration variable inside the body — the condition holds forever: an infinite loop. Every while body needs a step that moves toward its end.',
          },
        },
        {
          wrong: 'n = 3\nwhile n > 0:\n    print(n)\nn = n - 1',
          right: 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1',
          note: {
            ar: 'سطر التحديث بلا إزاحة فخرج من جسم الحلقة — لا تنقص n أبدًا داخلها: حلقة لانهائية خفية. الإزاحة ليست جمالًا بل هي تعريف الجسم.',
            en: 'The update line lost its indentation so it left the loop body — n is never decremented inside: a sneaky infinite loop. Indentation is not decoration; it defines the body.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'x = x + 1 تحديث يعتمد على القيمة القديمة: بايثون تنفّذ الطرف الأيمن ثم تخزّن — والزيادة +1 والإنقاص -1، والمتغيّر يجب أن يُعرَّف قبل تحديثه وإلا NameError.', en: 'x = x + 1 updates based on the old value: Python runs the right side then stores — adding 1 is an increment, subtracting 1 a decrement, and the variable must be defined first or you get NameError.' },
        { ar: 'حلقة while تقيّم شرطها: إن لم يتحقق خرجت، وإن تحقق نفّذت الجسم ثم عدت للتقييم — وكل تنفيذ للجسم تكرار (iteration).', en: 'A while loop evaluates its condition: if it fails the loop exits, if it holds the body runs and evaluation returns — and each body execution is an iteration.' },
        { ar: 'متغيّر التكرار يجب أن يتغيّر داخل الجسم نحو إنهاء الشرط — وإلا فالنتيجة حلقة لانهائية.', en: 'The iteration variable must change inside the body toward ending the condition — otherwise the result is an infinite loop.' },
      ],
      reflectPrompt: {
        ar: 'اذكر مهمة متكررة تقوم بها في حياتك اليومية، وصُغها كحلقة while: ما متغيّر التكرار فيها؟ وما الشرط الذي ينهيها؟',
        en: 'Name a repetitive task from your daily life and phrase it as a while loop: what is its iteration variable? And what condition ends it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch5.s1', pages: 'ص74 / pp.74' },
        { book: 'PY4E', section: 'py4e.ch5.s2', pages: 'ص74 / pp.74' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch5.s1', pages: 'ص74 / pp.74' },
    { book: 'PY4E', section: 'py4e.ch5.s2', pages: 'ص74 / pp.74' },
  ],
} satisfies Lesson;

export default lesson;
