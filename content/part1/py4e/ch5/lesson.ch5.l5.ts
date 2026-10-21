import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch5.l5 — "Loop Patterns: Filtering, Max, and Min / أنماط الحلقات: التصفية والأكبر والأصغر"
 * Aligned with PY4E ch5 s6 second half (أنماط: التصفية، الأكبر والأصغر مع None، min/max).
 * All expression is original.
 */
const lesson = {
  id: 'py4e.ch5.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 5,
  title: { ar: 'أنماط الحلقات: التصفية والأكبر والأصغر', en: 'Loop Patterns: Filtering, Max, and Min' },
  estimatedMinutes: 20,
  prerequisites: ['py4e.ch5.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'من بين ألف درجة: كم منتجًا سقط تحت الحد الأدنى؟ وما الدرجة الأعلى في الدفعة؟ وما الأدنى؟ الأسئلة الثلاثة تجيبها ثلاثة أنماط تكمل ما تعلمناه أمس: التصفية التي تمرّر من يحقق الشرط، والأكبر والأصغر اللذان يعرفان النجم والقاع. بنهاية هذا الدرس ستكون قادرًا على: كتابة حلقة تصفية بعدّاد شرطي، وبناء حلقة أكبر بأمانة None، وتفسير لماذا لا تجدي بداية بالصفر.',
        en: 'Out of a thousand grades: how many fell below the threshold? Which grade tops the batch? And which sits at the bottom? Three questions, three patterns completing yesterday\'s toolkit: filtering that passes only those meeting the condition, and maximum and minimum that find the star and the floor. By the end of this lesson you will be able to: write a filtering loop with a conditional counter, build a maximum loop with the honest None start, and explain why starting at zero fails.',
      },
    },
    {
      kind: 'predict',
      code: 'largest = None\nfor itervar in [3, 41, 12]:\n    if largest is None or itervar > largest:\n        largest = itervar\nprint(largest)',
      question: {
        ar: 'لماذا بدأنا largest بـ None بدلًا من صفر؟ وماذا سيُطبع؟',
        en: 'Why did we start largest as None instead of zero? And what gets printed?',
      },
      reveal: {
        ar: 'سيطبع 41. None تعني "لا قيمة بعد": في أول تكرار لم يسبقنا شيء فنأخذ أول عنصر على أنه الأكبر، ثم نستبدله كلما جاء أكبر منه. لو بدأنا بالصفر لانهار النمط مع الأعداد السالبة — وستفهم التفصيل بعد قليل.',
        en: 'It prints 41. None means "no value yet": on the first iteration nothing precedes us, so we accept the first element as the largest, then swap whenever something bigger arrives. Had we started at zero, the pattern would collapse with negative numbers — the details shortly.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط التصفية: مرّر من يستحق', en: 'The filtering pattern: pass only the worthy' },
      chunks: [
        {
          ar: 'الحلقة لسنا ملزمة بمعالجة كل عنصر: ضع if داخل الجسم وستمرّر ما يحقق الشرط فقط — تسمى هذه الحلقة حلقة تصفية (filter). مثال: كم عددًا يتجاوز 20 في قائمة الكتاب؟',
          en: 'The loop need not process every element: put an if inside the body and only those meeting the condition pass — this is called a filtering loop. Example: how many numbers in the book\'s list exceed 20?',
        },
        {
          ar: 'count = 0\nfor itervar in [3, 41, 12, 9, 74, 15]:\n    if itervar > 20:\n        count = count + 1\nprint(count)\nالخرْج 2 — لأن 41 و74 وحدهما تجاوزا الحد. عدّادٌ من درس أمس داخل شرطٍ من الفصل الثالث: الأنماط تتركب من قطعك القديمة.',
          en: 'count = 0\nfor itervar in [3, 41, 12, 9, 74, 15]:\n    if itervar > 20:\n        count = count + 1\nprint(count)\nThe output is 2 — only 41 and 74 crossed the threshold. Yesterday\'s counter inside chapter 3\'s condition: patterns compose from pieces you already own.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط الأكبر: None كنقطة انطلاق أمينة', en: 'The maximum pattern: None as an honest starting point' },
      chunks: [
        {
          ar: 'لإيجاد أكبر قيمة نحتاج متغيرًا يراقب أفضل مرشح حتى الآن، لكن ماذا نضع فيه قبل أن نرى أي عنصر؟ الصفر خيانة: جرّب القائمة [-8, -3, -20] — كلها أصغر من الصفر فسيظل صفرًا "الأكبر" زورًا ولم يزر القائمة أصلًا. الحل: largest = None — قيمة خاصة معناها "لا قيمة بعد".',
          en: "To find the largest value we need a variable tracking the best candidate so far — but what do we put in it before seeing any element? Zero is a betrayal: try [-8, -3, -20] — all are smaller than zero, so zero would stay the “largest” falsely without ever meeting the list. The fix: largest = None — a special value meaning \"no value yet\".",
        },
        {
          ar: 'largest = None\nfor itervar in [3, 41, 12, 9, 74, 15]:\n    if largest is None or itervar > largest:\n        largest = itervar\nprint(\'Largest\', largest)\nلاحظ أننا سألنا largest is None بالعامل is — هذه هي الطريقة الصحيحة لاختبار None. وشرط or يوفر لنا الحارس: عند أول تكرار يكفي أول سؤال ليدخل الفرع ويقبل العنصر الأول.',
          en: "largest = None\nfor itervar in [3, 41, 12, 9, 74, 15]:\n    if largest is None or itervar > largest:\n        largest = itervar\nprint('Largest', largest)\nNotice we asked largest is None with the is operator — that is the correct way to test for None. And the or condition gives us a guardian: on the first iteration the first question alone opens the branch and accepts the first element.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط الأصغر، والتابعان الجاهزان min وmax', en: 'The minimum pattern, and the ready-made min and max' },
      chunks: [
        {
          ar: 'نمط الأصغر هو صورة معكوسة: نبدأ smallest = None ونستبدل حين يأتي أصغر:\nif smallest is None or itervar < smallest:\n    smallest = itervar\nفالقائمة أعلاه تعطي أصغر قيمة 3 — العنصر الأول هنا لم يجد أحدًا أصغر منه بعده.',
          en: "The minimum pattern is a mirrored picture: start smallest = None and swap whenever something smaller arrives:\nif smallest is None or itervar < smallest:\n    smallest = itervar\nFor the list above the smallest value is 3 — the first element here found nothing smaller after it.",
        },
        {
          ar: 'ولمّا كان النمط شائعًا، تقدم بايثون تابعين جاهزين: max(list) وmin(list) يعيدان الأكبر والأصغر فورًا — تابعان مُنتجان من الفصل الرابع يستقبلان الوسيط ويعيدان قيمة. فما حاجتنا للنمط يدويًا؟ لأن الآلة التي بناها النمط هي نفسها التي ستعدّلها حين يتعقد الشرط: أكبر قيمة زوجية، أو أطول اسم يبدأ بـ حرف معين — ولا تابع جاهز لذلك.',
          en: 'Since the pattern is so common, Python ships two ready-made functions: max(list) and min(list) return the largest and smallest immediately — fruitful functions from chapter 4, receiving an argument and returning a value. So why write the pattern by hand? Because the machinery the pattern builds is the very thing you will modify when the condition gets fancier: the largest even value, or the longest name starting with a given letter — and no ready-made function does that.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'راقب الأكبر وهو يتحرك', en: 'Watch the maximum move' },
      code: "numbers = [3, 41, 12, 9, 74, 15]\nlargest = None\nfor itervar in numbers:\n    if largest is None or itervar > largest:\n        largest = itervar\n    print(itervar, largest)\nprint('الأكبر:', largest)",
      explanation: {
        ar: 'الطباعة داخل الحلقة (أداة تنقيح سنتقنها في ختام الفصل) تكشف القصة: 3 استلمت المنصب فورًا كأول مرشح، فتجاوزتها 41، فلم يهزها 12 ولا 9، فطردتها 74 من العرش، ولم يقدر عليها 15. طباعة الأكبر بعد الحلقة تعطي الجواب النهائي: 74.',
        en: 'The print inside the loop (a debugging tool we polish at the end of the chapter) exposes the story: 3 took the throne at once as first candidate, 41 unseated it, 12 and 9 moved nothing, 74 threw it off the throne, and 15 could not touch it. The print after the loop gives the final answer: 74.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.write-filter-count',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'القائمة scores = [82, 95, 67, 91, 88] معطاة. اكتب حلقة for مع شرط داخل جسمها يعدّ الدرجات التي هي 90 أو أعلى في متغيّر count (ابدأه صفرًا قبل الحلقة)، ثم اطبع count. المتوقع: 2 (الدرجتان 95 و91).',
        en: 'The list scores = [82, 95, 67, 91, 88] is given. Write a for loop with a condition inside its body that counts the scores of 90 or above into a variable count (start it at zero before the loop), then print count. Expected: 2 (the scores 95 and 91).',
      },
      starterCode: 'scores = [82, 95, 67, 91, 88]\n# عدّ الدرجات >= 90 / count the scores >= 90\n',
      solution: 'scores = [82, 95, 67, 91, 88]\ncount = 0\nfor s in scores:\n    if s >= 90:\n        count = count + 1\nprint(count)',
      tests: [
        {
          id: 't1',
          name: { ar: 'count يساوي 2', en: 'count equals 2' },
          code: "assert count == 2, 'expected: 2 | actual: %r' % count",
          expected: '2',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع 2', en: '2 is printed' },
          code: "assert '2' in __learner_output__, ('expected: 2 in output | actual: %r' % __learner_output__)",
          expected: '2',
        },
      ],
      hints: [
        { ar: 'الحد الذي طلبناه: s >= 90 — لا تنسَ علامة المساواة في العامل.', en: 'The requested threshold: s >= 90 — do not forget the equals sign in the operator.' },
        { ar: 'سطر count = count + 1 يجب أن يوضع بإزاحة داخل if — لا داخل الحلقة مباشرة.', en: 'The line count = count + 1 goes indented inside the if — not directly inside the loop.' },
        { ar: 'الهيكل:\ncount = 0\nfor s in scores:\n    if s >= 90:\n        count = count + 1\nprint(count)', en: 'The skeleton:\ncount = 0\nfor s in scores:\n    if s >= 90:\n        count = count + 1\nprint(count)' },
        { ar: 'scores = [82, 95, 67, 91, 88]\ncount = 0\nfor s in scores:\n    if s >= 90:\n        count = count + 1\nprint(count)', en: 'scores = [82, 95, 67, 91, 88]\ncount = 0\nfor s in scores:\n    if s >= 90:\n        count = count + 1\nprint(count)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.write-max-idiom',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'القائمة numbers = [12, 7, 25, 3] معطاة. اكتب حلقة نمط الأكبر كما تعلمتها: ابدأ largest = None، وفي كل تكرار استبدل largest بالعنصر إذا كان largest لا قيمة بعد أو العنصر أكبر منه. بعد الحلقة اطبع largest. المتوقع: 25.',
        en: 'The list numbers = [12, 7, 25, 3] is given. Write the maximum pattern exactly as you learned it: start largest = None, and on every iteration replace largest with the element if largest has no value yet or the element is bigger. After the loop print largest. Expected: 25.',
      },
      starterCode: 'numbers = [12, 7, 25, 3]\n# نمط الأكبر بـ None / the maximum pattern with None\n',
      solution: "numbers = [12, 7, 25, 3]\nlargest = None\nfor itervar in numbers:\n    if largest is None or itervar > largest:\n        largest = itervar\nprint(largest)",
      tests: [
        {
          id: 't1',
          name: { ar: 'largest يساوي 25', en: 'largest equals 25' },
          code: "assert largest == 25, 'expected: 25 | actual: %r' % largest",
          expected: '25',
        },
        {
          id: 't2',
          name: { ar: 'يُطبع 25', en: '25 is printed' },
          code: "assert '25' in __learner_output__, ('expected: 25 in output | actual: %r' % __learner_output__)",
          expected: '25',
        },
      ],
      hints: [
        { ar: 'الشرط ذو جزأين بـ or: largest is None أو itervar > largest.', en: 'The condition has two parts joined by or: largest is None, or itervar > largest.' },
        { ar: 'لا تنسَ سطر التهيئة largest = None قبل الحلقة — بلا ذاك أول مقارنة سترمي TypeError.', en: 'Do not forget the line largest = None before the loop — without it the first comparison throws TypeError.' },
        { ar: 'الهيكل:\nlargest = None\nfor itervar in numbers:\n    if largest is None or itervar > largest:\n        largest = itervar\nprint(largest)', en: 'The skeleton:\nlargest = None\nfor itervar in numbers:\n    if largest is None or itervar > largest:\n        largest = itervar\nprint(largest)' },
        { ar: 'numbers = [12, 7, 25, 3]\nlargest = None\nfor itervar in numbers:\n    if largest is None or itervar > largest:\n        largest = itervar\nprint(largest)', en: 'numbers = [12, 7, 25, 3]\nlargest = None\nfor itervar in numbers:\n    if largest is None or itervar > largest:\n        largest = itervar\nprint(largest)' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-why-none',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا نبدأ نمط الأكبر بـ largest = None لا largest = 0؟',
        en: 'Why do we start the maximum pattern with largest = None rather than largest = 0?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن None أسرع في المعالجة من الصفر', en: 'Because None is faster to process than zero' } },
        { id: 'b', text: { ar: 'لأن القيم قد تكون كلها سالبة فيصير الصفر أكبرها زورًا', en: 'Because the values may all be negative, making zero a false maximum' } },
        { id: 'c', text: { ar: 'لأن الصفر محجوز للغة ولا يجوز استخدامه', en: 'Because zero is reserved by the language and cannot be used' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'جرّب في خيالك القائمة [-8, -3, -20] مع largest = 0.', en: 'In your mind, run the list [-8, -3, -20] against largest = 0.' },
        { ar: 'أي عنصر سيتجاوز صفرًا؟ لا أحد — فيبقى الصفر الجواب الكاذب.', en: 'Which element beats zero? None — so zero stays as the false answer.' },
        { ar: 'None ليست رقمًا: هي إعلان "لم أرَ شيئًا بعد" — فهي صادقة مع أي قيم.', en: 'None is not a number: it declares "I have seen nothing yet" — honest with any values.' },
        { ar: 'الجواب: ب — None يجعل النمط صحيحًا مع كل القوائم حتى السالبة كلها.', en: 'Answer: b — None keeps the pattern correct for every list, even all-negative ones.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.trace-min',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'نمط الأصغر هذه المرة — تتبّع ووقّع الخرْج.',
        en: 'The minimum pattern this time — trace and predict the output.',
      },
      code: 'smallest = None\nfor n in [4, 2, 9]:\n    if smallest is None or n < smallest:\n        smallest = n\nprint(smallest)',
      solution: '2',
      answer: '2',
      hints: [
        { ar: 'أول تكرار: smallest لا قيمة بعد فيستلم 4.', en: 'First iteration: smallest has no value yet, so it takes 4.' },
        { ar: 'ثاني تكرار: هل 2 < 4؟ نعم — فيستلم 2.', en: 'Second iteration: is 2 < 4? Yes — it takes 2.' },
        { ar: 'ثالث تكرار: هل 9 < 2؟ لا — يبقى 2.', en: 'Third iteration: is 9 < 2? No — 2 stays.' },
        { ar: 'الخرْج: 2', en: 'The output: 2' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — مصفاة ونجم وقاع\n# Your playground — a sieve, a star, and a floor\n\nscores = [82, 95, 67, 91, 88]\npassed = 0\nlargest = None\nsmallest = None\nfor s in scores:\n    if s >= 90:\n        passed = passed + 1\n    if largest is None or s > largest:\n        largest = s\n    if smallest is None or s < smallest:\n        smallest = s\nprint('المنجزون:', passed)\nprint('الأعلى:', largest)\nprint('الأدنى:', smallest)",
      prompt: {
        ar: 'جرّب بنفسك: غيّر درجات القائمة وأضف سالبة مثل -5 ولاحظ أن None يبقي الأنماط صحيحة. ثم حوّل شرط التصفية إلى s < 70 وعدّ المترسبين. وأخيرًا قارن نتائجك مع max(scores) وmin(scores) الجاهزين. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: change the list scores and add a negative like -5 and watch None keep the patterns honest. Then flip the filter condition to s < 70 and count the failures. Finally compare your results with the ready-made max(scores) and min(scores). No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما معنى القيمة None في بايثون؟',
            en: 'What does the value None mean in Python?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد صغير جدًا', en: 'A very small number' } },
            { id: 'b', text: { ar: 'لا قيمة بعد — علامة أن المتغيّر فارغ حتى الآن', en: 'No value yet — a marker that the variable is empty for now' } },
            { id: 'c', text: { ar: 'قيمة منطقية خاطئة', en: 'A false boolean value' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'None ليست رقمًا ولا نصًا: هي قيمة خاصة معناها غياب القيمة — ولهذا اخترناها نقطة انطلاق أمينة لأنماط الأكبر والأصغر.',
            en: 'None is neither a number nor a string: it is a special value meaning the absence of a value — which is why we chose it as the honest starting point for the maximum and minimum patterns.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن درس القصر قصير الدارة في الفصل الثالث: في الشرط largest is None or itervar > largest — لماذا لا يرمي الجزء الثاني TypeError عند أول تكرار ونحن قارنون None بعدد؟',
            en: 'And from the short-circuit lesson in chapter 3: in the condition largest is None or itervar > largest — why does the second part not throw a TypeError on the first iteration when we compare None to a number?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن or تتوقف عند أول نتيجة True فلا تُقيَّم المقارنة الثانية أصلًا', en: 'Because or stops at the first True result, so the second comparison is never evaluated' } },
            { id: 'b', text: { ar: 'لأن None يقارن بالأعداد بحرية', en: 'Because None compares freely with numbers' } },
            { id: 'c', text: { ar: 'لأن بايثون تتجاهل الأخطاء داخل الحلقات', en: 'Because Python ignores errors inside loops' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التقييم قصير الدارة: largest is None محقق في أول تكرار فيكتفي or به ويتخطى المقارنة الخطر — نفس الحارس الذي درسته حين منعنا القسمة على صفر.',
            en: 'Short-circuit evaluation: largest is None holds on the first iteration, or is satisfied and skips the risky comparison — the same guardian you studied when we shielded division by zero.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما البنية التي يقوم عليها نمط التصفية داخل جسم الحلقة؟',
            en: 'Which structure powers the filtering pattern inside the loop body?',
          },
          options: [
            { id: 'a', text: { ar: 'تعليمة if بشرط القبول', en: 'An if statement with the acceptance condition' } },
            { id: 'b', text: { ar: 'تعليمة break', en: 'A break statement' } },
            { id: 'c', text: { ar: 'تعليمة continue على كل عنصر', en: 'A continue statement on every element' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'if داخل الجسم تمرّر ما يحقق الشرط وتتجاهل الباقي — وتتركب مع عدّاد أو متراكم من درس أمس حسب ما تريده من المُصفّى.',
            en: 'An if inside the body passes what meets the condition and ignores the rest — composed with a counter or accumulator from yesterday depending on what you want from the sieve.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الرابع: التابعان الجاهزان max(list) وmin(list) — ما نوعهما من حيث القيمة المعادة؟',
            en: 'And from chapter 4: the built-in functions max(list) and min(list) — what kind are they in terms of return value?',
          },
          options: [
            { id: 'a', text: { ar: 'توابع خالية لا تعيد شيئًا', en: 'Void functions returning nothing' } },
            { id: 'b', text: { ar: 'توابع مُنتجة تعيد القيمة الأكبر أو الأصغر', en: 'Fruitful functions returning the largest or smallest value' } },
            { id: 'c', text: { ar: 'متغيّران جاهزان في اللغة', en: 'Ready-made variables of the language' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'استدعاؤهما تعبير قيمته هي النتيجة — تعريف التابع المُنتج من الفصل الرابع: يستقبل وسائط ويعيد قيمة تُستخدم في تعابير أخرى.',
            en: 'Their call is an expression whose value is the result — the chapter 4 definition of a fruitful function: it receives arguments and returns a value usable in other expressions.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'largest = 0\nfor n in [-8, -3, -20]:\n    if n > largest:\n        largest = n\nprint(largest)',
          right: 'largest = None\nfor n in [-8, -3, -20]:\n    if largest is None or n > largest:\n        largest = n\nprint(largest)',
          note: {
            ar: 'بدء الأكبر بالصفر يخونه مع القوائم السالبة: يطبع 0 ولم يرَ القائمة أصلًا. None نقطة انطلاق أمينة مع كل القيم.',
            en: 'Starting the maximum at zero betrays you with negative lists: it prints 0 without ever meeting the list. None is an honest starting point with any values.',
          },
        },
        {
          wrong: 'largest = None\nfor n in [3, 74]:\n    if n > largest:\n        largest = n',
          right: 'largest = None\nfor n in [3, 74]:\n    if largest is None or n > largest:\n        largest = n',
          note: {
            ar: 'مقارنة None بعدد مباشرة ترمي TypeError: \'>\' not supported between instances of \'NoneType\' and \'int\' — الحارس is None أولًا ثم المقارنة، تمامًا كنمط الحارس في الفصل الثالث.',
            en: "Comparing None with a number directly throws TypeError: '>' not supported between instances of 'NoneType' and 'int' — guard with is None first, then compare, exactly like the guardian pattern of chapter 3.",
          },
        },
        {
          wrong: 'largest = None\nfor n in [3, 74, 12]:\n    largest = n\nprint(largest)',
          right: 'largest = None\nfor n in [3, 74, 12]:\n    if largest is None or n > largest:\n        largest = n\nprint(largest)',
          note: {
            ar: 'وضع largest = n بلا شرط يجعل الأكبر آخر عنصر لا الأكبر: طبع 12 رغم أن 74 هي النجم. الاستبدال يجب أن يجري تحت الشرط فقط.',
            en: 'Assigning largest = n with no condition makes the maximum the last element, not the largest: it printed 12 although 74 is the star. The swap must happen only under the condition.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'نمط التصفية يضع if داخل جسم الحلقة فيمرّر ما يحقق الشرط فقط — ويتكامل مع العدّاد والمتراكم.', en: 'The filtering pattern places an if inside the loop body, passing only what meets the condition — and composes with the counter and accumulator.' },
        { ar: 'نمط الأكبر يبدأ largest = None ويستبدل عند largest is None or itervar > largest — ونمط الأصغر صورته المعكوسة بعامل <.', en: 'The maximum pattern starts largest = None and swaps on largest is None or itervar > largest — the minimum pattern is its mirror with <.' },
        { ar: 'None تعني "لا قيمة بعد" ويُختبر بالعامل is — والتقاط or مع القصر قصير الدارة يقيك TypeError أول تكرار.', en: 'None means "no value yet" and is tested with the is operator — and the or short-circuit shields you from a first-iteration TypeError.' },
      ],
      reflectPrompt: {
        ar: 'اختر مجموعة بيانات من حياتك (درجات، مصاريف، خطوات): صمّم ثلاث حلقات عليها — مصفّية بشرطك الخاص، وحلقة أكبر، وحلقة أصغر — واكتب شروطها بالضبط.',
        en: 'Pick a dataset from your life (grades, expenses, steps): design three loops over it — a filter with your own condition, a maximum loop, a minimum loop — and write their conditions exactly.',
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
