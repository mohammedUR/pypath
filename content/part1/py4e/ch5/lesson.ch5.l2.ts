import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch5.l2 — "Infinite Loops and continue / الحلقات اللانهائية وcontinue"
 * Aligned with PY4E ch5 s3 (الحلقات اللانهائية), s4 (إنهاء التكرار باستخدام CONTINUE).
 * All expression is original.
 * Sandbox note: input() has no keyboard here, so the book's "> done" loop is
 * simulated with a fixed list of lines (pattern from ch2.l5) — fully deterministic.
 */
const lesson = {
  id: 'py4e.ch5.l2',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 5,
  title: { ar: 'الحلقات اللانهائية وcontinue', en: 'Infinite Loops and continue' },
  estimatedMinutes: 15,
  prerequisites: ['py4e.ch5.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'على عبوات الشامبو تُكتب تعليمات مضحكة: ضع قليلًا من المستحضر، اغسل بالملاء، وكرّر. المبرمجون يضحكون بعصبية — لأنها حلقة لا نهاية لها: لا يوجد ما يوقفها. اليوم تتعلم متى تقع في هذا الفخ وكيف تنجو منه بقفازين: تعليمة الإيقاف break وتعليمة المتابعة continue. بنهاية الدرس ستكون قادرًا على: تفسير سبب اللانهائية، والخروج من حلقة بـ break في اللحظة الصحيحة، وتخطي تكرار دون الخروج من الحلقة بـ continue.',
        en: 'Shampoo bottles carry funny instructions: lather, rinse, repeat. Programmers laugh nervously — because it is a loop with no end: nothing ever stops it. Today you learn when you fall into this trap and how to escape with two levers: the break statement and the continue statement. By the end of this lesson you will be able to: explain why a loop is infinite, exit a loop with break at exactly the right moment, and skip one iteration without leaving the loop using continue.',
      },
    },
    {
      kind: 'predict',
      code: "n = 10\nwhile True:\n    print(n, end=' ')\n    if n == 4:\n        break\n    n = n - 1",
      question: {
        ar: 'الشرط True محقق دائمًا — فكيف لا تستمر الحلقة إلى الأبد؟ ماذا سيُطبع؟',
        en: 'The condition True holds forever — so why does this loop not run forever? What gets printed?',
      },
      reveal: {
        ar: "يطبع 10 9 8 7 6 5 4 ثم يتوقف. الشرط True دائمًا نعم، لكن break داخل الجسم يقلع الحلقة فورًا متى نُفِّذ. (والوسيط end=' ' في print يجعل القيم تظهر على سطر واحد بفاصل فراغ بدل السطر الجديد.)",
        en: "It prints 10 9 8 7 6 5 4 then stops. True always holds, but break inside the body tears off the loop the moment it runs. (And the end=' ' argument of print makes the values appear on one line separated by spaces instead of a new line.)",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الحلقة اللانهائية: متغيّر تكرار غائب', en: 'The infinite loop: a missing iteration variable' },
      chunks: [
        {
          ar: 'يجب أن تُغيّر تعليمات جسم الحلقة قيمة متغيّر التكرار حتى نصل إلى مرحلة لا يتحقق فيها الشرط. إن غاب هذا التحديث تكرر التنفيذ باستمرار فتنتج الحلقة اللانهائية (infinite loop) — مثل تعليمات الشامبو: لا شيء يحدد متى تتوقف.',
          en: "The loop body's statements must change the iteration variable's value until we reach a point where the condition no longer holds. If that update is missing, execution repeats endlessly and you get an infinite loop — like the shampoo instructions: nothing defines when they stop.",
        },
        {
          ar: 'وهناك حلقات لانهائية بالتصميم: نكتب while True وشرطها الثابت True محقق دائمًا — فإما أن تتعلم كيف تنهي مهمة بايثون الخارجة عن السيطرة، أو ستضطر إلى زر الطاقة! قد تبدو بلا فائدة، لكن نستطيع توظيفها إن أضفنا إلى جسمها مخرجًا مقصودًا: تعليمة الإيقاف break.',
          en: 'And some loops are infinite by design: we write while True whose constant condition always holds — then either you learn how to end a runaway Python task, or you reach for the power button! Such loops may look useless, but we can harness them by adding an intended exit to their body: the break statement.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تعليمة الإيقاف break: مخرج الطوارئ', en: 'The break statement: the emergency exit' },
      chunks: [
        {
          ar: 'break تخرج من الحلقة فورًا وتقفز إلى أول تعليمة بعدها. النمط المشهور: حلقة تتلقى إدخال المستخدم حتى يكتب كلمة done — نكتبها هنا بمحاكاة لأن منصتنا بلا لوحة مفاتيح:\nlines = ["hello", "done"]\ni = 0\nwhile True:\n    line = lines[i]   # في برنامج حقيقي: input(\'> \')\n    i = i + 1\n    if line == \'done\':\n        break\n    print(line)\nprint(\'Done!\')',
          en: "break leaves the loop immediately and jumps to the first statement after it. The famous pattern: a loop that reads user input until they type done — simulated here because our platform has no keyboard:\nlines = [\"hello\", \"done\"]\ni = 0\nwhile True:\n    line = lines[i]   # in a real program: input('> ')\n    i = i + 1\n    if line == 'done':\n        break\n    print(line)\nprint('Done!')",
        },
        {
          ar: 'بهذا النمط نتحقق من شرط الإيقاف داخل جسم الحلقة لا في ترويستها فقط — وصياغته: «توقف عند تحقق ذلك الشرط» بدل «تابع التنفيذ حتى يحدث ذلك الشرط». وهي طريقة شائعة جدًا في كتابة حلقات while.',
          en: 'With this pattern we check the stop condition inside the loop body, not only in its header — and phrase it as "stop when that condition holds" instead of "keep going until that condition happens". It is a very common way to write while loops.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تعليمة المتابعة continue: تخطَّ هذا التكرار فقط', en: 'The continue statement: skip this iteration only' },
      chunks: [
        {
          ar: 'أثناء تنفيذ تكرار ما قد نحتاج إلى إيقافه والعودة لبدء تكرار جديد. تعليمة المتابعة continue توقف تنفيذ التكرار الحالي دون الخروج من الحلقة: كل ما بعدها في الجسم يُتخطى، وينطلق تكرار جديد من أعلى.',
          en: 'While executing an iteration we may need to stop it and return to start a new one. The continue statement stops the current iteration without leaving the loop: everything after it in the body is skipped, and a new iteration starts from the top.',
        },
        {
          ar: 'الفائدة العملية: حلقة تطبع كل ما يكتبه المستخدم لكنها تتجاهل السطور التي تبدأ برمز # (ما يشبه التعليقات في بايثون):\nif line[0] == \'#\':\n    continue\nيوقف continue التكرار قبل وصوله إلى سطر الطباعة — فلا يُطبع السطر المشروح، والحلقة مستمرة كعادتها.',
          en: 'The practical benefit: a loop that prints everything the user types but ignores lines starting with # (just like Python comments):\nif line[0] == \'#\':\n    continue\ncontinue stops the iteration before it reaches the print line — the commented line never prints, and the loop carries on as usual.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الجلسة الكاملة: تخطٍّ ووقف معًا', en: 'The full session: skip and stop together' },
      code: "lines = [\"hello there\", \"# don't print this\", \"print this!\", \"done\"]\ni = 0\nwhile True:\n    line = lines[i]   # في برنامج حقيقي: التابع input يقرأ السطر عند المحث\n    i = i + 1\n    if line[0] == '#':\n        continue\n    if line == 'done':\n        break\n    print(line)\nprint('Done!')",
      explanation: {
        ar: 'السطر الأول يُطبع عاديًا. الثاني يبدأ بـ # فيقفز continue إلى أعلى الحلقة قبل الطباعة. الثالث لا يبدأ بـ # ولا يساوي done فيُطبع. الرابع يساوي done فينفّذ break فنخرج إلى Done!. لاحظ ترتيب الفحصين: التخطي قبل الوقف — وترتيب الشروط داخل الجسم معناه، تمامًا كالسلاسل الشرطية في الفصل الثالث.',
        en: 'The first line prints normally. The second starts with #, so continue jumps back to the top before any printing. The third neither starts with # nor equals done, so it prints. The fourth equals done, so break fires and we land on Done!. Notice the order of the two checks: skip before stop — and the order of conditions inside the body carries meaning, exactly like the chained conditionals of chapter 3.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.write-break',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'عرّف n بالقيمة 10، واكتب حلقة while تُطبع قيمة n في كل تكرار (كل عدد في سطر مستقل) وتنقصها واحدًا، لكن أضف شرطًا داخل الحلقة ينفّذ break عندما تصل n إلى 6 — فتتوقف الحلقة هناك. لا يجب أن يظهر العدد 5 في الخرْج إطلاقًا.',
        en: 'Define n as 10, and write a while loop that prints n on every iteration (one number per line) and decrements it by one, but add a condition inside the loop that runs break when n reaches 6 — the loop stops there. The number 5 must never appear in the output.',
      },
      starterCode: 'n = 10\n# اطبع وأنقِص واضبط break عند 6 / print, decrement, break at 6\n',
      solution: "n = 10\nwhile n > 0:\n    print(n)\n    if n == 6:\n        break\n    n = n - 1",
      tests: [
        {
          id: 't1',
          name: { ar: 'تُطبع الأعداد من 10 إلى 6 في أسطر', en: 'The numbers 10 down to 6 print on lines' },
          code: "assert '10\\n9\\n8\\n7\\n6' in __learner_output__, ('expected: 10..6 lines | actual: %r' % __learner_output__)",
          expected: '10\n9\n8\n7\n6',
        },
        {
          id: 't2',
          name: { ar: 'العدد 5 غائب — break أوقف الحلقة مبكرًا', en: 'The number 5 is absent — break stopped the loop early' },
          code: "assert '5' not in __learner_output__, ('expected: no 5 | actual: %r' % __learner_output__)",
          expected: '10\n9\n8\n7\n6',
        },
        {
          id: 't3',
          name: { ar: 'n متوقفة عند 6 بعد الخروج', en: 'n is 6 after the exit' },
          code: "assert n == 6, 'expected: 6 | actual: %r' % n",
          expected: '6',
        },
      ],
      hints: [
        { ar: 'الترويسة كما تعلمتها: while n > 0: — والخروج سيأتي من break لا من الشرط.', en: 'The header is the one you know: while n > 0: — the exit will come from break, not from the condition.' },
        { ar: 'داخل الجسم: اطبع أولًا، ثم اسأل if n == 6: وضع تحته بإزاحة break.', en: 'Inside the body: print first, then ask if n == 6: and put break indented beneath it.' },
        { ar: 'الهيكل:\nwhile n > 0:\n    print(n)\n    if n == 6:\n        break\n    n = n - 1', en: 'The skeleton:\nwhile n > 0:\n    print(n)\n    if n == 6:\n        break\n    n = n - 1' },
        { ar: "n = 10\nwhile n > 0:\n    print(n)\n    if n == 6:\n        break\n    n = n - 1", en: "n = 10\nwhile n > 0:\n    print(n)\n    if n == 6:\n        break\n    n = n - 1" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-break-continue',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما الفرق الجوهري بين break وcontinue؟',
        en: 'What is the essential difference between break and continue?',
      },
      options: [
        { id: 'a', text: { ar: 'break يخرج من الحلقة كليًا، بينما continue يوقف التكرار الحالي وينطلق تكرار جديد', en: 'break leaves the loop entirely, while continue stops the current iteration and a new one starts' } },
        { id: 'b', text: { ar: 'continue يخرج من الحلقة كليًا، بينما break يخطّ التكرار الحالي', en: 'continue leaves the loop entirely, while break skips the current iteration' } },
        { id: 'c', text: { ar: 'كلاهما يخرج من الحلقة — الفرق في السرعة', en: 'Both leave the loop — the difference is speed' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'واحدة منهما "مخرج طوارئ" والثانية "زر تخطٍّ".', en: 'One of them is an "emergency exit" and the other is a "skip button".' },
        { ar: 'في مثال السطور: continue تركت الحلقة تعمل مع السطر التالي، بينما break أنهت كل شيء.', en: 'In the lines example: continue left the loop alive for the next line, while break ended everything.' },
        { ar: 'استمع لأسمائهما الإنجليزية: break = كسر/إيقاف الحلقة، continue = متابعة التكرار التالي.', en: 'Listen to their English names: break = break the loop, continue = carry on with the next iteration.' },
        { ar: 'الجواب: أ — break يخرج من الحلقة، وcontinue يقفز لبداية تكرار جديد.', en: 'Answer: a — break exits the loop, continue jumps to the start of a new iteration.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-continue',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تتبّع بعينك وتوقّع الخرْج بالضبط — انتبه إلى ما يُتخطى.',
        en: 'Trace with your eyes and predict the exact output — watch what gets skipped.',
      },
      code: 'n = 0\nwhile n < 5:\n    n = n + 1\n    if n == 3:\n        continue\n    print(n)',
      solution: '1\n2\n4\n5',
      answer: '1\n2\n4\n5',
      hints: [
        { ar: 'نرفع n أولًا ثم نفحصها — وn = 3 تُتخطى بـ continue فلا يُطبع العدد 3.', en: 'We raise n first then test it — n = 3 is skipped by continue so the number 3 never prints.' },
        { ar: 'continue لم تخرج من الحلقة: بعد تخطي 3 عاد التنفيذ لرفع n إلى 4 و5 وطباعتهما.', en: 'continue did not exit the loop: after skipping 3, execution returned and raised n to 4 and 5, printing both.' },
        { ar: 'الحلقة تتوقف عندما يفشل الشرط n < 5 — أي بعد طباعة 5.', en: 'The loop stops when the condition n < 5 fails — that is, after printing 5.' },
        { ar: 'الخرْج:\n1\n2\n4\n5', en: 'The output:\n1\n2\n4\n5' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-continue',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل: التعليمة التي توقف تنفيذ التكرار الحالي دون الخروج من الحلقة وتعود لبدء تكرار جديد هي ______.',
        en: 'Fill in: the statement that stops the current iteration without leaving the loop and returns to start a new one is ______.',
      },
      answer: 'continue',
      solution: 'continue',
      hints: [
        { ar: 'رأيتها تخطي السطر الذي يبدأ بـ # دون أن تنهي الحلقة.', en: 'You saw it skip the line starting with # without ending the loop.' },
        { ar: 'كلمة إنجليزية واحدة معناها "تابع".', en: 'A single English word meaning "carry on".' },
        { ar: 'حليفتها break تخرج كليًا — وهي تكتفي بالتخطي.', en: 'Her partner break exits entirely — she only skips.' },
        { ar: 'الجواب: continue', en: 'Answer: continue' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — قفازا break وcontinue\n# Your playground — the break and continue levers\n\nlines = ['سطر عادي', '# هذا تعليق يُتخطى', 'سطر ثانٍ', 'تم']\ni = 0\nwhile True:\n    line = lines[i]      # محاكاة input / simulating input\n    i = i + 1\n    if line[0] == '#':\n        continue\n    if line == 'تم':\n        break\n    print(line)\nprint('انتهى!')",
      prompt: {
        ar: 'جرّب بنفسك: أضف سطرًا جديدًا إلى القائمة يبدأ بـ #، ثم غيّر كلمة الوقف من تم إلى شيء آخر ولاحظ ماذا يحدث للفهرس i (تلميح: IndexError — من درس الأخطاء!). ثم انقل break قبل فحص # ولاحظ اختلاف السلوك. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add a new line to the list starting with #, then change the stop word from تم to something else and watch what happens to the index i (hint: IndexError — from the errors lesson!). Then move break before the # check and watch the behavior differ. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا تُعدّ تعليمات الشامبو (اغسل، كرّر) حلقة لانهائية؟',
            en: 'Why are the shampoo instructions (rinse, repeat) an infinite loop?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنها طويلة جدًا', en: 'Because they are too long' } },
            { id: 'b', text: { ar: 'لغياب متغيّر التكرار الذي يحدد عدد مرات التنفيذ', en: 'Because the iteration variable that bounds the repetitions is missing' } },
            { id: 'c', text: { ar: 'لأنها لا تحتوي على كلمة while', en: 'Because they do not contain the word while' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'لا يوجد ما يتغيّر بين تكرار وآخر — لا عدّاد ولا شرط ينتهي — فيتكرر التنفيذ باستمرار. الحلقة تحتاج متغيّر تكرار يتحرك نحو النهاية.',
            en: 'Nothing changes between one repetition and the next — no counter, no ending condition — so execution repeats forever. A loop needs an iteration variable moving toward the end.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في حلقة while True — متى يتوقف تنفيذها الوحيد الممكن؟',
            en: 'In a while True loop — when can it possibly stop?',
          },
          options: [
            { id: 'a', text: { ar: 'عندما يصبح True خاطئًا', en: 'When True becomes false' } },
            { id: 'b', text: { ar: 'عندما يُنفَّذ break داخل جسمها', en: 'When break runs inside its body' } },
            { id: 'c', text: { ar: 'تتوقف وحدها بعد مئة تكرار', en: 'It stops by itself after a hundred iterations' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشرط True محقق دائمًا فلا يفشل أبدًا — المخرج الوحيد تعليمة الإيقاف break التي نضعها تحت شرط من اختيارنا.',
            en: 'The condition True always holds so it never fails — the only exit is the break statement that we place under a condition of our choosing.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث: المقارنة line == \'done\' داخل الحلقة — ما نوع نتيجتها؟',
            en: "And from chapter 3: the comparison line == 'done' inside the loop — what type is its result?",
          },
          options: [
            { id: 'a', text: { ar: 'نص str', en: 'A string str' } },
            { id: 'b', text: { ar: 'قيمة منطقية True أو False', en: 'A boolean True or False' } },
            { id: 'c', text: { ar: 'عدد 0 أو 1', en: 'The number 0 or 1' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'عامل المقارنة == يطرح سؤالًا وجوابه قيمة منطقية من صنف bool — وهي التي تقرر هل يُنفَّذ break الآن أم لا.',
            en: 'The comparison operator == asks a question and its answer is a boolean value of class bool — and it decides whether break fires now or not.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثاني: في برنامج حقيقي نجلب السطر بـ input(\'> \') — ماذا يعيد input دائمًا؟',
            en: "And from chapter 2: in a real program the line comes from input('> ') — what does input always return?",
          },
          options: [
            { id: 'a', text: { ar: 'نصًّا str حتى لو كانت أرقامًا', en: 'A string str, even if it holds digits' } },
            { id: 'b', text: { ar: 'عددًا صحيحًا', en: 'An integer' } },
            { id: 'c', text: { ar: 'قائمة سطور', en: 'A list of lines' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'لهذا نجري المقارنات على النص مباشرة (line == \'done\') ولهذا حاكينا الإدخال بقائمة نصوص — فالمنصة هنا بلا لوحة مفاتيح.',
            en: "That is why we compare the text directly (line == 'done') and why we simulated the input with a list of strings — this platform has no keyboard.",
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'n = 0\nwhile n < 5:\n    if n == 2:\n        continue\n    print(n)\n    n = n + 1',
          right: 'n = 0\nwhile n < 5:\n    n = n + 1\n    if n == 2:\n        continue\n    print(n)',
          note: {
            ar: 'فخ قاتل: continue قبل سطر تحديث متغيّر التكرار — عند n = 2 تتخطى الحلقة التحديث نفسه فتتجمد عند 2 إلى الأبد: حلقة لانهائية خفية. ضع التحديث قبل أي continue.',
            en: 'A killer trap: continue before the iteration-variable update — at n = 2 the loop skips the update itself and freezes at 2 forever: a sneaky infinite loop. Put the update before any continue.',
          },
        },
        {
          wrong: "while True:\n    print('أعمل إلى الأبد')",
          right: "count = 0\nwhile True:\n    print('أعمل')\n    count = count + 1\n    if count == 3:\n        break",
          note: {
            ar: 'حلقة while True بلا break لا تنتهي أبدًا — سترى في المنصة رسالة انتهاء المهلة: غالبًا هناك حلقة لا تتوقف. الحلقة اللانهائية المتعمدة تحتاج مخرجًا مقصودًا.',
            en: "A while True loop with no break never ends — on this platform you will see the timeout message: probably an infinite loop. A deliberate infinite loop needs an intended exit.",
          },
        },
        {
          wrong: 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nbreak',
          right: 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\n    if n == 1:\n        break',
          note: {
            ar: 'break خارج جسم الحلقة (بلا إزاحة) يرمي SyntaxError: \'break\' outside loop — التعليمة مملوكة للحلقة، وتنفع فقط داخلها تحت شرط.',
            en: "break outside the loop body (not indented) throws SyntaxError: 'break' outside loop — the statement belongs to the loop and only works inside it, under a condition.",
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الحلقة اللانهائية تولد حين يغيب تحديث متغيّر التكرار — أو حين نكتب while True بالتصميم منتظرين مخرجًا مقصودًا.', en: 'An infinite loop is born when the iteration variable never updates — or when we write while True on purpose, waiting for an intended exit.' },
        { ar: 'break يخرج من الحلقة فورًا إلى أول تعليمة بعدها — وهو المخرج الذي يجعل حلقات while True مفيدة.', en: 'break exits the loop immediately to the first statement after it — the exit that makes while True loops useful.' },
        { ar: 'continue توقف التكرار الحالي فقط وتنطلق تكرارًا جديدًا — مثالية لتخطي ما لا نريده مثل السطور التي تبدأ بـ #.', en: 'continue stops only the current iteration and starts a new one — perfect for skipping what we do not want, like lines starting with #.' },
      ],
      reflectPrompt: {
        ar: 'فكّر في تطبيق تحدثه يوميًا (محادثة، مشغّل، متجر): اذكر حلقة فيه من النوع الذي ينتظر حدثًا ثم يتوقف — ما شرط break فيها تقريبًا؟',
        en: 'Think of an app you touch daily (chat, player, store): name a loop in it that waits for an event then stops — what is its break condition roughly?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch5.s3', pages: 'ص75 / pp.75' },
        { book: 'PY4E', section: 'py4e.ch5.s4', pages: 'ص77 / pp.77' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch5.s3', pages: 'ص75 / pp.75' },
    { book: 'PY4E', section: 'py4e.ch5.s4', pages: 'ص77 / pp.77' },
  ],
} satisfies Lesson;

export default lesson;
