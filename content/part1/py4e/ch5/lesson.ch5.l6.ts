import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch5.l6 — "Chapter 5 Review and Project: Grade Report /
 * مراجعة الفصل 5 ومشروع: تقرير الدرجات"
 * Aligned with PY4E ch5 s7 (التنقيح), s8 (فهرس المصطلحات), s9 (تمارين).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch5.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 5,
  title: { ar: 'مراجعة الفصل 5 ومشروع: تقرير الدرجات', en: 'Chapter 5 Review and Project: Grade Report' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch5.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الآن صرت تكتب برامج تعمل مئة مرة بدلًا من مئة برنامج. ختام الفصل الخامس جلسة استرجاع لكل خريطته — من تحديث المتغيّر إلى نمط الأكبر — ثم درس صغير في التنقيح حين تخطئ الحلقات، ثم أول مشروع إحصائي كامل لك: تقرير درجات يخرج العدد والمجموع والمعدل والأعلى والأدنى في تشغيل واحد. بنهاية الدرس ستكون قادرًا على: تجميع أنماط الحلقة في برنامج واحد، وتشخيص خلل حلقة بأدوات التنقيح.',
        en: 'You can now write one program that runs a hundred times instead of a hundred programs. This close of chapter 5 is a retrieval session over its whole map — from updating a variable to the maximum pattern — then a short lesson in debugging when loops go wrong, then your first complete statistics project: a grade report printing the count, sum, average, maximum and minimum in one run. By the end of this lesson you will be able to: compose the loop patterns into one program, and diagnose a faulty loop with debugging tools.',
      },
    },
    {
      kind: 'predict',
      code: 'scores = [82, 95, 67]\ntotal = 0\nfor s in scores:\n    total = total + s\nprint(total)',
      question: {
        ar: 'بأدوات الفصل الخامس كله: ماذا سيُطبع، وكم تكرارًا نفّذها الجسم؟',
        en: 'With the whole chapter 5 toolkit: what gets printed, and how many iterations ran?',
      },
      reveal: {
        ar: 'سيطبع 244 بعد ثلاثة تكرارات — تكرار لكل درجة. المتراكم total وُلد صفرًا قبل الحلقة واكتسب 82 ثم 95 ثم 67. لاحظ كم صار هذا السكربت مألوفًا: هذا معنى نمطٍ أتقنته.',
        en: 'It prints 244 after three iterations — one per score. The accumulator total was born at zero before the loop and gained 82, then 95, then 67. Notice how familiar this script feels now: that is what mastering a pattern means.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل الخامس في دقيقتين', en: 'Chapter 5 in two minutes' },
      chunks: [
        {
          ar: 'بدأنا بتحديث المتغيرات: x = x + 1 يقرأ القديم ويخزّن الجديد — زيادةً وإنقاصًا — مع ضرورة تعريف المتغيّر قبل تحديثه. ثم حلقة while وتقييمها ثلاثي الخطوات، ومتغيّر التكرار الذي يجب أن يتحرك نحو نهاية الشرط. وعالجنا الحلقات اللانهائية بمخرجين: break الذي يخرج من الحلقة كليًا، وcontinue الذي يوقف التكرار الحالي فقط.',
          en: 'We began with updating variables: x = x + 1 reads the old and stores the new — incrementing and decrementing — with the variable defined before updating. Then the while loop and its three-step evaluation, and the iteration variable that must move toward ending the condition. We tamed infinite loops with two exits: break leaving the loop entirely, and continue stopping only the current iteration.',
        },
        {
          ar: 'ثم جاءت الحلقة المحددة for فوق القوائم والنصوص وrange، واختتمت بأنماط الحلقات: العدّ بعدّاد، والمجموع بمتراكم، والمعدل من قسمتهما، والتصفية بشرط داخل الجسم، والأكبر والأصغر بأمانة None مع عامل is. خمسة دروس، وخمس وصفات ستحملها معك إلى كل فصل قادم.',
          en: 'Then came the definite loop for over lists, strings and range, and the chapter closed with the loop patterns: counting with a counter, summing with an accumulator, the average from their division, filtering with a condition inside the body, and maximum and minimum with an honest None and the is operator. Five lessons, five recipes you will carry into every chapter ahead.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التنقيح: حين تخطئ الحلقة', en: 'Debugging: when the loop misbehaves' },
      chunks: [
        {
          ar: 'حين تعطيك بايثون موجز تتبع، اقرأه كما تعلمت في الفصل الثالث: من آخر سطر — نوع الخطأ ومكانه. وإن كانت المشكلة منطقية بلا رسالة، صغّر المشكلة: قلّل البيانات (قائمة من عنصرين تكفي لتشخيص حلقة) وقلّل عدد الأسطر حتى تبقى أصغر نسخة ما تزال خاطئة — فتغدو الخللة مرئية.',
          en: 'When Python hands you a traceback, read it as you learned in chapter 3: from the last line — the error type and location. If the problem is logical with no message, shrink the problem: reduce the data (a two-item list diagnoses a loop) and reduce the lines until the smallest version still wrong — the fault becomes visible.',
        },
        {
          ar: 'وأقوى أداة تنقيح في الحلقات طباعة مؤقتة داخل الجسم: اطبع المتغيّرات في كل تكرار وراقبها تتحرك — كم تعلمت الآن أن total يتراكم وlargest يتبدل. وإن طال البحث فاستخدم التنصيف: اقسم البرنامج نصفين وحدد أيهما يحوي الخطأ ثم نصّف نصفه — يتقليص فضاء البحث سريعًا. ولا تنسَ: رسالة انتهاء المهلة في منصتنا تعني غالبًا حلقة لا تتوقف — ابحث عن تحديث متغيّر التكرار.',
          en: 'And the strongest loop-debugging tool is a temporary print inside the body: print the variables each iteration and watch them move — you now know how total accumulates and largest swaps. If the hunt drags on, use bisection: split the program in half, decide which half holds the bug, then halve again — the search space shrinks fast. And remember: the timeout message on this platform usually means a loop that never stops — look for the iteration-variable update.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المشروع: تقرير الدرجات', en: 'The project: the grade report' },
      chunks: [
        {
          ar: 'الوظيفة: القائمة scores فيها درجات خمس ثابتة. بحلقة for واحدة تطبّق الأنماط الخمسة كلها: العدّ في count، والمجموع في total، والمعدل round(total / count, 1)، والأكبر في largest بنمط None، والأدنى في smallest بمرآته. ثم بعد الحلقة اطبع خمسة أسطر موقّعة: العدد، المجموع، المعدل، الأعلى، الأدنى.',
          en: 'The job: the list scores holds five fixed grades. With one for loop apply all five patterns: counting into count, summing into total, the average as round(total / count, 1), the maximum into largest with the None pattern, and the minimum into smallest with its mirror. Then after the loop print five labeled lines: العدد (count), المجموع (sum), المعدل (average), الأعلى (top), الأدنى (bottom).',
        },
        {
          ar: 'لاحظ العمارة: تهيئة واحدة قبل الحلقة، وجسم يجمع الأنماط على كل عنصر، وطباعة واحدة بعد اكتمالها — الوصفة الثلاثية من درس الأنماط بأكملها. هذا أول تقرير إحصائي كامل لك: ستة أسطر منه تساوي عمود جداول بيانات كاملًا.',
          en: 'Notice the architecture: one initialization before the loop, a body composing the patterns on each element, and one print-out after it completes — the three-step recipe of the patterns lesson in full. This is your first complete statistics report: its six lines equal an entire spreadsheet column.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تقرير مصغّر على ثلاث درجات', en: 'A miniature report on three scores' },
      code: "scores = [70, 88, 95]\ncount = 0\ntotal = 0\nlargest = None\nfor s in scores:\n    count = count + 1\n    total = total + s\n    if largest is None or s > largest:\n        largest = s\nprint('العدد:', count)\nprint('المجموع:', total)\nprint('المعدل:', round(total / count, 1))\nprint('الأعلى:', largest)",
      explanation: {
        ar: 'ثلاث درجات، ثلاثة تكرارات، ثم أربعة أسطر: العدد 3، والمجموع 253، والمعدل 84.3 (لأن 253 ÷ 3 تساوي 84.33… وقُرّبت)، والأعلى 95. مشروعك يضيف نمطًا سادسًا — الأدنى — ويطبع سطرًا خامسًا. الحقلة نفسها، بنمط إضافي.',
        en: 'Three scores, three iterations, then four lines: count 3, sum 253, average 84.3 (253 ÷ 3 is 84.33…, rounded), and top 95. Your project adds a sixth pattern — the minimum — and a fifth line. The same field, one more pattern.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-filter',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'تسخين مراجعة: نمط تصفية من الدرس السابق — تتبّع ووقّع الخرْج.',
        en: 'Review warm-up: a filtering pattern from the previous lesson — trace and predict the output.',
      },
      code: 'count = 0\nfor n in [5, 12, 8]:\n    if n > 6:\n        count = count + 1\nprint(count)',
      solution: '2',
      answer: '2',
      hints: [
        { ar: 'افحص كل عنصر: هل 5 > 6؟ هل 12 > 6؟ هل 8 > 6؟', en: 'Test each element: is 5 > 6? Is 12 > 6? Is 8 > 6?' },
        { ar: 'اثنان فقط اجتازا الحد — والعدّاد يزيد عندهما فقط.', en: 'Only two crossed the threshold — the counter gains only on those.' },
        { ar: 'قيمة 5 و8 لا تدخلان في الجمع — هذا عدّ تصفية لا جمع.', en: 'The values 5 and 8 are never added — this is filtered counting, not summing.' },
        { ar: 'الخرْج: 2', en: 'The output: 2' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.grade-report',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل الخامس — تقرير الدرجات: القائمة scores = [82, 95, 67, 74, 91] معطاة. بحلقة for واحدة احسب: count (عدد الدرجات)، وtotal (مجموعها)، وlargest (الأكبر بنمط None)، وsmallest (الأدنى بنمط None). بعد الحلقة احسب average = round(total / count, 1) ثم اطبع خمسة أسطر موقّعة بالترتيب: العدد: والمجموع: والمعدل: والأعلى: والأدنى:. المتوقع في الخرْج: 5 و409 و81.8 و95 و67.",
        en: 'Chapter 5 project — the grade report: the list scores = [82, 95, 67, 74, 91] is given. With a single for loop compute: count (number of scores), total (their sum), largest (the maximum with the None pattern), and smallest (the minimum with the None pattern). After the loop compute average = round(total / count, 1), then print five labeled lines in order: العدد: (count), المجموع: (sum), المعدل: (average), الأعلى: (top), الأدنى: (bottom). Expected output: 5, 409, 81.8, 95, 67.',
      },
      starterCode: 'scores = [82, 95, 67, 74, 91]\n# تهيئة الأنماط الأربعة / initialize the four patterns\n# حلقة تجمعها كلها / one loop composing them all\n# طباعة التقرير بعد الحلقة / print the report after the loop\n',
      solution: "scores = [82, 95, 67, 74, 91]\ncount = 0\ntotal = 0\nlargest = None\nsmallest = None\nfor s in scores:\n    count = count + 1\n    total = total + s\n    if largest is None or s > largest:\n        largest = s\n    if smallest is None or s < smallest:\n        smallest = s\nprint('العدد:', count)\nprint('المجموع:', total)\naverage = round(total / count, 1)\nprint('المعدل:', average)\nprint('الأعلى:', largest)\nprint('الأدنى:', smallest)",
      tests: [
        {
          id: 't1',
          name: { ar: 'count يساوي 5', en: 'count equals 5' },
          code: "assert count == 5, 'expected: 5 | actual: %r' % count",
          expected: '5',
        },
        {
          id: 't2',
          name: { ar: 'total يساوي 409', en: 'total equals 409' },
          code: "assert total == 409, 'expected: 409 | actual: %r' % total",
          expected: '409',
        },
        {
          id: 't3',
          name: { ar: 'largest يساوي 95 وsmallest يساوي 67', en: 'largest equals 95 and smallest equals 67' },
          code: "assert largest == 95 and smallest == 67, 'expected: 95/67 | actual: %r/%r' % (largest, smallest)",
          expected: '95 / 67',
        },
        {
          id: 't4',
          name: { ar: 'يُطبع المجموع 409 والمعدل 81.8', en: 'The sum 409 and average 81.8 are printed' },
          code: "assert '409' in __learner_output__ and '81.8' in __learner_output__, ('expected: 409, 81.8 | actual: %r' % __learner_output__)",
          expected: '409 / 81.8',
        },
        {
          id: 't5',
          name: { ar: 'التقرير موقّع بخمسة أسطر بالترتيب', en: 'The report carries five labeled lines in order' },
          code: "lines = [l.strip() for l in __learner_output__.splitlines() if l.strip()]\nlabels = ['العدد', 'المجموع', 'المعدل', 'الأعلى', 'الأدنى']\nfound = [l for l in lines if any(l.startswith(x) for x in labels)]\nassert len(found) == 5 and all(found[i].startswith(labels[i]) for i in range(5)), ('expected: 5 labeled lines | actual: %r' % __learner_output__)",
          expected: 'العدد/المجموع/المعدل/الأعلى/الأدنى',
        },
      ],
      hints: [
        { ar: 'أربعة متغيّرات تولد قبل الحلقة: count = 0 وtotal = 0 وlargest = None وsmallest = None.', en: 'Four variables are born before the loop: count = 0, total = 0, largest = None, smallest = None.' },
        { ar: 'في الجسم: عدّ، ثم اجمع، ثم شرطا الأكبر والأدنى — كلها بإزاحة واحدة تحت for.', en: 'In the body: count, then sum, then the max and min conditions — all at one indent level under for.' },
        { ar: 'الهيكل:\nfor s in scores:\n    count = count + 1\n    total = total + s\n    if largest is None or s > largest:\n        largest = s\n    if smallest is None or s < smallest:\n        smallest = s\n\nثم بعد الحلقة: average = round(total / count, 1) وخمس طباعات موقّعة.', en: 'The skeleton:\nfor s in scores:\n    count = count + 1\n    total = total + s\n    if largest is None or s > largest:\n        largest = s\n    if smallest is None or s < smallest:\n        smallest = s\n\nThen after the loop: average = round(total / count, 1) and five labeled prints.' },
        { ar: "scores = [82, 95, 67, 74, 91]\ncount = 0\ntotal = 0\nlargest = None\nsmallest = None\nfor s in scores:\n    count = count + 1\n    total = total + s\n    if largest is None or s > largest:\n        largest = s\n    if smallest is None or s < smallest:\n        smallest = s\nprint('العدد:', count)\nprint('المجموع:', total)\nprint('المعدل:', round(total / count, 1))\nprint('الأعلى:', largest)\nprint('الأدنى:', smallest)", en: "scores = [82, 95, 67, 74, 91]\ncount = 0\ntotal = 0\nlargest = None\nsmallest = None\nfor s in scores:\n    count = count + 1\n    total = total + s\n    if largest is None or s > largest:\n        largest = s\n    if smallest is None or s < smallest:\n        smallest = s\nprint('العدد:', count)\nprint('المجموع:', total)\nprint('المعدل:', round(total / count, 1))\nprint('الأعلى:', largest)\nprint('الأدنى:', smallest)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-debug-loop',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ومن درس التنقيح: برنامج زميلك علّق ولا يطبع شيئًا، والمنصة تعرض رسالة انتهاء المهلة. ما أول شك تقود التحقيق إليه؟',
        en: 'And from the debugging lesson: your friend\'s program hangs printing nothing, and the platform shows the timeout message. What is the first suspect the investigation points to?',
      },
      options: [
        { id: 'a', text: { ar: 'حلقة لا تتوقف — غالبًا تحديث متغيّر التكرار غائب أو وُضع بعد continue', en: 'A loop that never stops — usually the iteration-variable update is missing or placed after a continue' } },
        { id: 'b', text: { ar: 'تعليق # خاطئ أوقف البرنامج', en: 'A misplaced # comment stopped the program' } },
        { id: 'c', text: { ar: 'عدد كبير من الأسطر أبطأ الجهاز', en: 'Too many lines slowed the machine' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'برنامج يكمل ولا ينهي عمله — أين بقي محتجزًا؟', en: 'The program keeps running and never finishes — where is it stuck?' },
        { ar: 'شرط لا يصبح خاطئًا أبدًا + لا break = دوامة أبدية.', en: 'A condition that never fails + no break = an eternal whirlpool.' },
        { ar: 'أداة التنقيح هنا: اطبع متغيّر التكرار داخل الجسم وراقب هل يتحرك أصلًا.', en: 'The debugging tool here: print the iteration variable inside the body and watch whether it moves at all.' },
        { ar: 'الجواب: أ — ابحث عن سطر تحديث متغيّر التكرار وتأكد من موقعه داخل الجسم وقبل أي continue.', en: 'Answer: a — look for the iteration-variable update line and make sure it is inside the body and before any continue.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-largest-updates',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل — في حلقة الأكبر على القائمة [82, 95, 67, 74, 91] بدءًا من largest = None: كم مرة تغيّرت قيمة largest خلال الحلقة؟',
        en: 'Without running — in the maximum loop over [82, 95, 67, 74, 91] starting from largest = None: how many times does the value of largest change during the loop?',
      },
      answer: '2',
      solution: '2',
      tolerance: 0,
      hints: [
        { ar: 'تتبّع: None يسلّم أولًا لـ 82 — تغيّر أول.', en: 'Trace: None hands the crown to 82 — first change.' },
        { ar: 'هل 95 > 82؟ نعم — تغيّر ثانٍ. ثم هل 67 أو 74 أو 91 أكبر من 95؟', en: 'Is 95 > 82? Yes — second change. Then are 67, 74 or 91 bigger than 95?' },
        { ar: 'التغيّرات تحدث فقط حين يدخل الفرع — و91 أقل من 95 فلا يدخل.', en: 'Changes happen only when the branch fires — and 91 is less than 95, so it never fires.' },
        { ar: 'الجواب: 2', en: 'Answer: 2' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-reinit',
      required: true,
      brokenCode: "scores = [82, 95, 67, 74, 91]\ntotal = 0\nfor s in scores:\n    total = 0\n    total = total + s\nprint('المجموع:', total)",
      prompt: {
        ar: 'تقرير زميلك يطبع المجموع: 91 رغم أن درجاته الخمس مجموعها 409. شغّل الكود المعطوب، ثم استخدم أداة التنقيح: اطبع total داخل الجسم في كل تكرار وراقب — ماذا يحدث له في بداية كل تكرار؟ اكتشف الخلل وأصلحه ليخرج التقرير المجموع: 409.',
        en: "Your friend's report prints the sum 91 although his five scores add to 409. Run the broken code, then use the debugging tool: print total inside the body on every iteration and watch it — what happens to it at the start of every iteration? Find the bug and fix the report so it prints the sum 409.",
      },
      solution: "scores = [82, 95, 67, 74, 91]\ntotal = 0\nfor s in scores:\n    total = total + s\nprint('المجموع:', total)",
      tests: [
        {
          id: 't1',
          name: { ar: 'total يساوي 409 بعد الإصلاح', en: 'total equals 409 after the fix' },
          code: "assert total == 409, 'expected: 409 | actual: %r' % total",
          expected: '409',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع المجموع: 409', en: 'The sum 409 is printed' },
          code: "assert '409' in __learner_output__, ('expected: 409 in output | actual: %r' % __learner_output__)",
          expected: 'المجموع: 409',
        },
      ],
      hints: [
        { ar: 'الطباعة المؤقتة ستُظهر: بعد 82 صار المجموع 82، وبعد 95 صار 95 — لماذا يمسح نفسه كل تكرار؟', en: 'The temporary print will show: after 82 the total is 82, after 95 it is 95 — why does it wipe itself every iteration?' },
        { ar: 'سطر total = 0 وُلد في المكان الخطأ: داخل الجسم لا قبل الحلقة.', en: 'The line total = 0 was born in the wrong place: inside the body, not before the loop.' },
        { ar: 'انقل التهيئة فوق الحلقة واترك الجسم يكتفي بالإضافة.', en: 'Move the initialization above the loop and let the body do nothing but add.' },
        { ar: "scores = [82, 95, 67, 74, 91]\ntotal = 0\nfor s in scores:\n    total = total + s\nprint('المجموع:', total)", en: "scores = [82, 95, 67, 74, 91]\ntotal = 0\nfor s in scores:\n    total = total + s\nprint('المجموع:', total)" },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — التقرير الكامل بين يديك\n# Your playground — the full report in your hands\n\nscores = [82, 95, 67, 74, 91]\ncount = 0\ntotal = 0\ntop_count = 0\nlargest = None\nsmallest = None\nfor s in scores:\n    count = count + 1\n    total = total + s\n    if s >= 90:\n        top_count = top_count + 1\n    if largest is None or s > largest:\n        largest = s\n    if smallest is None or s < smallest:\n        smallest = s\nprint('العدد:', count)\nprint('المجموع:', total)\nprint('المعدل:', round(total / count, 1))\nprint('الأعلى:', largest)\nprint('الأدنى:', smallest)\nprint('من 90 فأعلى:', top_count)",
      prompt: {
        ar: 'جرّب بنفسك: هذا مشروعك كاملًا مع تصفية إضافية تعدّ من 90 فأعلى. أضف درجات جديدة، واخترقها بقيمة سالبة وراقب None يحفظ الأنماط، ثم جرّب s > 100 كمصفاة تعطي صفرًا. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: this is your project in full with an extra filter counting scores of 90 and above. Add new scores, sabotage it with a negative value and watch None protect the patterns, then try s > 100 as a filter that yields zero. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في الحلقة: ما الفرق في الأثر بين break وcontinue؟',
            en: 'Inside a loop: what is the difference in effect between break and continue?',
          },
          options: [
            { id: 'a', text: { ar: 'break يخرج من الحلقة كليًا وcontinue يبدأ تكرارًا جديدًا', en: 'break leaves the loop entirely while continue starts a new iteration' } },
            { id: 'b', text: { ar: 'كلاهما ينهي الحلقة لكن بسرعات مختلفة', en: 'Both end the loop but at different speeds' } },
            { id: 'c', text: { ar: 'continue يخرج من الحلقة وbreak يتخطى تكرارًا', en: 'continue exits the loop while break skips an iteration' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'break مخرج طوارئ من الحلقة كلها إلى أول تعليمة بعدها، وcontinue زر تخطٍّ يعيد الجسم من أعلى ببنكهة جديدة.',
            en: 'break is the emergency exit from the whole loop to the first statement after it; continue is a skip button restarting the body from the top with a fresh element.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'متى تختار for ومتى تختار while؟',
            en: 'When do you choose for and when while?',
          },
          options: [
            { id: 'a', text: { ar: 'for حين يكون المجموعة المحددة معلومًا، وwhile حين يقرر الشرط موعد التوقف', en: 'for when the definite collection is known, while when a condition decides when to stop' } },
            { id: 'b', text: { ar: 'while للقوائم وfor للأعداد', en: 'while for lists and for for numbers' } },
            { id: 'c', text: { ar: 'لا فرق — تبادل تام في كل الحالات', en: 'No difference — fully interchangeable in every case' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'for حلقة محددة تتكرر بعدد الأشياء، وwhile حلقة غير محددة تتكرر حتى يصبح شرطها غير صحيح — وقد لا نعرف عدد المرات مسبقًا.',
            en: 'for is a definite loop repeating per item; while is an indefinite loop repeating until its condition fails — and we may not know the count in advance.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثاني: في total = total + s — ما الدلالة التي تجعل التراكم ممكنًا؟',
            en: 'And from chapter 2: in total = total + s — which semantics makes accumulation possible?',
          },
          options: [
            { id: 'a', text: { ar: 'الإسناد يقرأ القيمة القديمة أولًا ثم يخزّن الناتج الجديد', en: 'Assignment reads the old value first, then stores the new result' } },
            { id: 'b', text: { ar: 'الإسناد يحذف total قبل الجمع', en: 'Assignment deletes total before adding' } },
            { id: 'c', text: { ar: 'الإسناد ينسخ السطر كاملًا في الذاكرة', en: 'Assignment copies the whole line into memory' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الطرف الأيمن يُحسب بالقيمة الحالية قبل التخزين — لهذا يكبر المتراكم تكرارًا بعد تكرار بدل أن يمسح.',
            en: 'The right side computes with the current value before storing — that is why the accumulator grows iteration after iteration instead of wiping.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الثالث: في الشرط largest is None or s > largest — ما الذي يحمي أول تكرار من TypeError؟',
            en: 'And from chapter 3: in the condition largest is None or s > largest — what protects the first iteration from a TypeError?',
          },
          options: [
            { id: 'a', text: { ar: 'القصر قصير الدارة: or يكتفي بأول True ويتخطى المقارنة', en: 'Short-circuit evaluation: or settles for the first True and skips the comparison' } },
            { id: 'b', text: { ar: 'None يقارن بالأعداد تلقائيًا', en: 'None compares with numbers automatically' } },
            { id: 'c', text: { ar: 'حلقات for تلتقط الأخطاء وتهملها', en: 'for loops catch and ignore errors' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عند أول تكرار يكون largest is None محققًا فلا تُقيَّم المقارنة الخطر أصلًا — نفس فكرة الحارس التي حمينا بها القسمة.',
            en: 'On the first iteration largest is None already holds, so the risky comparison is never evaluated — the same guardian idea that shielded our division.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الفصل الرابع: تابعا max(scores) وmin(scores) — كيف يوصف كل منهما؟',
            en: 'And from chapter 4: the functions max(scores) and min(scores) — how is each described?',
          },
          options: [
            { id: 'a', text: { ar: 'تابعان مُنتجان يستقبلان وسيطًا ويعيدان قيمة', en: 'Fruitful functions taking an argument and returning a value' } },
            { id: 'b', text: { ar: 'تابعان خاليان يطبعان النتيجة فقط', en: 'Void functions that only print the result' } },
            { id: 'c', text: { ar: 'كلمتان محجوزتان في اللغة', en: 'Two reserved words of the language' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'استدعاؤهما تعبير قيمته هي النتيجة المُعادة — تعريف التابع المُنتج. وهوما يمكنكنك من التحقق من أنماطك اليدوية في الملعب.',
            en: 'Their call is an expression whose value is the returned result — the definition of a fruitful function. It is also what lets you verify your hand-written patterns in the sandbox.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'ومن درس التنقيح: ظهرت لك رسالة خطأ بموجز تتبع طويل — من أين تبدأ قراءته؟',
            en: 'And from the debugging lesson: an error message with a long traceback appears — where do you start reading?',
          },
          options: [
            { id: 'a', text: { ar: 'من السطر الأخير: نوع الخطأ ومكانه', en: 'From the last line: the error type and location' } },
            { id: 'b', text: { ar: 'من أول سطر وتصاعديًا بالكامل', en: 'From the first line, fully upward' } },
            { id: 'c', text: { ar: 'من منتصف الموجز حيث الأسماء الطويلة', en: 'From the middle where the long names are' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السطر الأخير يقول ماذا حدث وأين — ثم تصعد للأسطر السابقة لتتتبع مسار النداءات، كما تعلمت مع try وexcept في الفصل الثالث.',
            en: 'The last line says what happened and where — then you climb the lines above to trace the call path, as you learned with try and except in chapter 3.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'total = 0\nfor s in scores:\n    total = 0\n    total = total + s',
          right: 'total = 0\nfor s in scores:\n    total = total + s',
          note: {
            ar: 'خطأ الفصل الأشهر: التهيئة داخل الجسم تمسح التراكم كل تكرار فيبقى آخر عنصر فقط. طباعة مؤقتة داخل الحلقة تكشفه فورًا — والتهيئة تعود لقبل الحلقة.',
            en: 'The chapter\'s most famous bug: initializing inside the body wipes the accumulation every iteration, leaving only the last element. A temporary print inside the loop exposes it instantly — and the initialization returns to before the loop.',
          },
        },
        {
          wrong: 'largest = 0\nfor s in scores:\n    if s > largest:\n        largest = s',
          right: 'largest = None\nfor s in scores:\n    if largest is None or s > largest:\n        largest = s',
          note: {
            ar: 'بدء الأكبر بالصفر يعمل مع درجاتك الموجبة ثم يخونك أول قائمة سالبة: يطبع 0 زورًا. ابدأ بـ None واحمِ المقارنة الأولى بـ is None.',
            en: 'Starting the maximum at zero works with your positive grades, then betrays you on the first negative list: it prints 0 falsely. Start with None and guard the first comparison with is None.',
          },
        },
        {
          wrong: 'n = 5\nwhile n > 0:\n    print(n)\nn = n - 1',
          right: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1',
          note: {
            ar: 'سطر التحديث خرج من الجسم بالإزاحة الناقصة — الحلقة لا تتوقف أبدًا وسيلتقطها عداد المهلة. حافظ على تحديث متغيّر التكرار داخل الجسم دائمًا.',
            en: 'The update line left the body through lost indentation — the loop never stops and the timeout watchdog catches it. Always keep the iteration-variable update inside the body.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل الخامس كله: تحديث المتغيرات، حلقة while وتكراراتها، اللانهائية مع break وcontinue، الحلقة المحددة for، وأنماط العدّ والمجموع والمعدل والتصفية والأكبر والأصغر.', en: 'All of chapter 5: updating variables, the while loop and its iterations, infinity with break and continue, the definite for loop, and the counting, summing, average, filtering, maximum and minimum patterns.' },
        { ar: 'التنقيح: اقرأ موجز التتبع من آخر سطر، صغّر البيانات والأسطر، اطبع داخل الجسم لترى التراكم، ونصّف البحث عند طول الشك — وانتبه لرسالة المهلة: حلقة لا تتوقف.', en: 'Debugging: read the traceback from the last line, shrink data and lines, print inside the body to watch accumulation, bisect when the hunt drags — and heed the timeout message: a loop that never stops.' },
        { ar: 'تقرير الدرجات جمع الوصفة الثلاثية: تهيئة قبل الحلقة، أنماط مركّبة في الجسم، وطباعة موقّعة بعده — أول برنامج إحصائي كامل لك.', en: 'The grade report composed the three-step recipe: initialization before the loop, patterns composed in the body, and a labeled print-out after it — your first complete statistics program.' },
      ],
      reflectPrompt: {
        ar: 'تقريرك اليوم يقرأ قائمة جاهزة. حين تتعلم قراءة الملفات في فصل قادم، كيف سيصبح هذا التقرير مفيدًا حقيقيًا؟ وما الدرجة الأولى التي ستُدخلها فيه؟',
        en: 'Your report today reads a ready list. Once you learn to read files in a coming chapter, how will this report become truly useful? And what will be the first grade you feed into it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch5.s7', pages: 'ص83 / pp.83' },
        { book: 'PY4E', section: 'py4e.ch5.s8', pages: 'ص83 / pp.83' },
        { book: 'PY4E', section: 'py4e.ch5.s9', pages: 'ص84 / pp.84' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch5.s7', pages: 'ص83 / pp.83' },
    { book: 'PY4E', section: 'py4e.ch5.s8', pages: 'ص83 / pp.83' },
    { book: 'PY4E', section: 'py4e.ch5.s9', pages: 'ص84 / pp.84' },
  ],
} satisfies Lesson;

export default lesson;
