import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch2.l4 — "Arithmetic Operators and Modulo / العوامل الحسابية وباقي القسمة"
 * Aligned with PY4E ch2 s5 (العوامل والمعاملات), s8 (عامل باقي القسمة),
 * s9 (العمليات على السلاسل النصية). All expression is original.
 */
const lesson = {
  id: 'py4e.ch2.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 2,
  title: { ar: 'العوامل الحسابية وباقي القسمة', en: 'Arithmetic Operators and Modulo' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch2.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'تقسم 7 قطع حلوى على صديقين: للواحد منهما 3 قطع، وتبقى قطعة وحيدة لا تعرف مَن يأخذها. بايثون تعرف الرقمين معًا: 7 // 2 تعطيك الأسهم الكاملة، و7 % 2 تعطيك الباقي الشارد — وعامل واحد صغير % سيصبح أداتك المفضلة لتقسيم كل شيء: ساعات، صفوف، وحتى كلمات السر.',
        en: 'You split 7 candies between two friends: each gets 3, and one lonely candy is left with no owner. Python knows both numbers at once: 7 // 2 gives the full shares, and 7 % 2 gives the stray remainder — and the tiny % operator will become your favorite tool for dividing everything: hours, rows, even secret codes.',
      },
    },
    {
      kind: 'predict',
      code: 'print(7 // 2)\nprint(7 % 2)',
      question: {
        ar: 'عاملان جديدان يواجهانك: // و%. توقّع السطرين المطبوعين قبل الكشف.',
        en: 'Two new operators face you: // and %. Predict the two printed lines before revealing.',
      },
      reveal: {
        ar: '3 ثم 1. القسمة الصحيحة // تتجاهل الكسور وتبقي الجزء الصحيح، وباقي القسمة % يعطي ما تبقى بعد توزيع كل الأسهم الكاملة. الكتاب يطرح مثاله الشهير: 7 // 3 = 2 و7 % 3 = 1 — أي 7 مقسومة على 3 تساوي 2 وباقيها 1.',
        en: '3 then 1. Floor division // ignores fractions and keeps the whole part, and modulo % gives what remains after all full shares are handed out. The book uses its famous example: 7 // 3 = 2 and 7 % 3 = 1 — that is, 7 divided by 3 is 2 with remainder 1.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'عائلة العوامل الحسابية', en: 'The arithmetic operator family' },
      chunks: [
        {
          ar: 'العوامل رموز الحساب، والقيم التي تُطبَّق عليها تسمى المعاملات. العائلة كاملة: + و− و* و** تعرفها، والجديدة: / القسمة الحقيقية التي تنتج عددًا عائمًا دائمًا — 59 / 60 تعطي 0.9833333333333333، وليست صفرًا.',
          en: 'Operators are the symbols of arithmetic, and the values they apply to are called operands. The full family: +, −, * and ** you already know; the newcomer is /, true division, which always produces a float — 59 / 60 gives 0.9833333333333333, not zero.',
        },
        {
          ar: 'ولما أردت الجواب الصحيح بلا كسور، استدعِ القسمة الصحيحة //: 59 // 60 تعطي 0 — تمامًا كما في الكتاب. القاعدة العملية: / للقياسات والنسب، و// للعدّ الصحيح: كم ساعة كاملة؟ كم صف كامل؟ كم قطعة كاملة لكل صديق؟',
          en: 'And when you want a whole-number answer with no fractions, call floor division //: 59 // 60 gives 0 — exactly as in the book. The practical rule: / for measurements and ratios, // for counting wholes: how many full hours? Full rows? Full candies per friend?',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex1.time-conversion',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'حوّل 3671 ثانية إلى ساعات ودقائق وثوانٍ: عرّف total = 3671، ثم hours = total // 3600، وminutes = (total % 3600) // 60، وseconds = total % 60، ثم اطبع الثلاثة. (3671 ثانية = 1:01:11)',
        en: 'Convert 3671 seconds into hours, minutes and seconds: define total = 3671, then hours = total // 3600, minutes = (total % 3600) // 60, seconds = total % 60, then print all three. (3671 seconds = 1:01:11)',
      },
      starterCode: '# آلة تحويل الوقت / the time-conversion machine\ntotal = 3671\n# hours = ...\n# minutes = ...\n# seconds = ...\n',
      solution: 'total = 3671\nhours = total // 3600\nminutes = (total % 3600) // 60\nseconds = total % 60\nprint(hours)\nprint(minutes)\nprint(seconds)',
      tests: [
        {
          id: 't1',
          name: { ar: 'hours تساوي 1', en: 'hours equals 1' },
          code: "assert hours == 1, 'expected: 1 | actual: %r' % hours",
          expected: '1',
        },
        {
          id: 't2',
          name: { ar: 'minutes = 1 وseconds = 11', en: 'minutes = 1 and seconds = 11' },
          code: "assert minutes == 1 and seconds == 11, 'expected: 1 and 11 | actual: %r and %r' % (minutes, seconds)",
          expected: '1 و 11 / 1 and 11',
        },
      ],
      hints: [
        { ar: 'الساعة 3600 ثانية: كم ساعة كاملة في total؟ // تجيب.', en: 'An hour is 3600 seconds: how many full hours in total? // answers.' },
        { ar: 'بعد خصم الساعات الكاملة، الباقي % 3600 هو الثواني الزائدة — قسّمها على 60 بـ // لدقائق، وباقيها % 60 هو الثواني.', en: 'After removing full hours, total % 3600 is the leftover seconds — floor-divide by 60 for minutes, and its % 60 remainder is seconds.' },
        { ar: 'الهيكل:\nhours = total // 3600\nminutes = (total % 3600) // 60\nseconds = total % 60', en: 'The skeleton:\nhours = total // 3600\nminutes = (total % 3600) // 60\nseconds = total % 60' },
        { ar: 'total = 3671\nhours = total // 3600\nminutes = (total % 3600) // 60\nseconds = total % 60\nprint(hours)\nprint(minutes)\nprint(seconds)', en: 'total = 3671\nhours = total // 3600\nminutes = (total % 3600) // 60\nseconds = total % 60\nprint(hours)\nprint(minutes)\nprint(seconds)' },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'قوة % الخفية: التمييز والتقطيع', en: 'The hidden power of %: distinguishing and slicing' },
      chunks: [
        {
          ar: 'باقي القسمة يجيب أسئلة يقول المبتدئ إنها صعبة: هل x زوجي؟ اسأل: x % 2 == 0 — فإن كان الباقي صفرًا فهو زوجي. هل x يقبل القسمة على 5؟ اسأل x % 5 == 0. باقي الصفر يعني القسمة الكاملة، وسنستخدم هذا في الفصل الثالث لصنع قرارات.',
          en: 'Modulo answers questions beginners call hard: is x even? Ask x % 2 == 0 — a zero remainder means even. Does x divide by 5? Ask x % 5 == 0. A zero remainder means perfect divisibility, and we will use this to make decisions in chapter 3.',
        },
        {
          ar: 'وهو مقصّ أرقام محترف: x % 10 يعطيك آخر خانة يمينًا (115 % 10 = 5)، وx % 100 يعطي آخر خانتين (115 % 100 = 15). والكتاب يضيف مفاجأة سارّة: العوامل تعمل على النصوص أيضًا — + تُلصق سلسلتين ("100" + "150" = "100150")، و* تكرر سلسلة عددًا صحيحًا من المرات ("Test " * 3 = "Test Test Test ").',
          en: 'It is also a professional digit-slicer: x % 10 gives the rightmost digit (115 % 10 = 5), and x % 100 gives the last two (115 % 100 = 15). And the book adds a happy surprise: operators work on strings too — + glues two strings ("100" + "150" = "100150"), and * repeats a string an integer number of times ("Test " * 3 = "Test Test Test ").',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-modulo',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: كم يساوي 17 % 10؟ (تذكّر حيلة آخر خانة.)',
        en: 'Without running: what is 17 % 10? (recall the last-digit trick.)',
      },
      answer: '7',
      solution: '7',
      tolerance: 0,
      hints: [
        { ar: '10 تدخل في 17 مرة واحدة، ويتبقى شيء.', en: '10 fits into 17 once, with something left over.' },
        { ar: 'السؤال: ما الباقي بعد 17 − 10؟', en: 'The question: what remains after 17 − 10?' },
        { ar: 'نفس نتيجة آخر خانة يمينًا في 17.', en: 'Same as the rightmost digit of 17.' },
        { ar: 'الجواب: 7.', en: 'Answer: 7.' },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'ساعة الملعب: من 130 دقيقة إلى ساعتين وعشر دقائق', en: 'The match clock: from 130 minutes to 2 hours and 10 minutes' },
      code: 'minutes = 130\nhours = minutes // 60\nleft = minutes % 60\nprint(hours)\nprint(left)',
      explanation: {
        ar: '130 دقيقة: القسمة الصحيحة // تستخرج الساعات الكاملة (2)، وباقي القسمة % يستخرج ما تبقى بعد اكتمالها (10). سطران يفعلان ما يحتاجه أي عدّاد وقت — وشغّل المثال وغيّر 130 إلى 59 ثم 60 ولاحظ كيف يتنفس الجواب.',
        en: '130 minutes: floor division // extracts the full hours (2), and modulo % extracts what remains after they complete (10). Two lines are all any time counter needs — run the example, change 130 to 59 then 60, and watch the answer breathe.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-string-repeat',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'مفاجأة العوامل على النصوص: توقّع خرْج هذا السطر حرفيًا.',
        en: 'The string-operator surprise: predict this line’s output literally.',
      },
      code: "print('Test ' * 3)",
      solution: 'Test Test Test',
      answer: 'Test Test Test',
      hints: [
        { ar: '* هنا لا تضرب أرقامًا — تكرر نصًا.', en: '* here multiplies no numbers — it repeats text.' },
        { ar: 'التكرار ثلاث مرات، ولاحظ المسافة بعد كل Test داخل التنصيص.', en: 'It repeats three times, and note the space after each Test inside the quotes.' },
        { ar: 'ستظهر ثلاث كلمات Test تفصلها مسافات في سطر واحد.', en: 'Three Test words separated by spaces appear on one line.' },
        { ar: 'الخرْج: Test Test Test', en: 'The output: Test Test Test' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — قسّم كل شيء\n# Your playground — divide everything\n\nprint(12345 % 10)\nprint(12345 % 100)\nprint(60 // 7)\nprint(60 % 7)\nprint("ها " * 3)\nprint("بايثون" + " ممتعة")',
      prompt: {
        ar: 'جرّب بنفسك: قصّ أرقامًا بـ % 10 و% 100، وقسّم دقائق على ساعات، وكرر نصًّا بـ *، والصق نصين بـ +. ما الذي لا يزال يفاجئك؟',
        en: 'Try it yourself: slice digits with % 10 and % 100, split minutes into hours, repeat text with *, and glue two strings with +. What still surprises you?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة لدرس ترتيب العمليات: كم ينتج 2 * 3 - 1؟',
            en: 'Back to the precedence lesson: what does 2 * 3 - 1 produce?',
          },
          options: [
            { id: 'a', text: { ar: '5', en: '5' } },
            { id: 'b', text: { ar: '4', en: '4' } },
            { id: 'c', text: { ar: '10', en: '10' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الضرب قبل الطرح: 2 * 3 = 6 ثم 6 − 1 = 5.',
            en: 'Multiplication before subtraction: 2 * 3 = 6, then 6 − 1 = 5.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'وماذا عن 59 / 60 في بايثون 3 — من درس اليوم؟',
            en: 'And what about 59 / 60 in Python 3 — from today’s lesson?',
          },
          options: [
            { id: 'a', text: { ar: '0', en: '0' } },
            { id: 'b', text: { ar: '0.9833333333333333', en: '0.9833333333333333' } },
            { id: 'c', text: { ar: 'خطأ قسمة على صفر', en: 'A division-by-zero error' } },
          ],
          answer: 'b',
          explanation: {
            ar: '/ القسمة الحقيقية تعطي عددًا عائمًا كامل الدقة. إن أردت الصفر الصحيح فاستخدم //.',
            en: '/ is true division giving a full-precision float. If you want the whole zero, use //.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي تعبير يخبرك أن العدد x زوجي — استعدادًا للفصل الثالث؟',
            en: 'Which expression tells you x is even — warming up for chapter 3?',
          },
          options: [
            { id: 'a', text: { ar: 'x // 2', en: 'x // 2' } },
            { id: 'b', text: { ar: 'x % 2 == 0', en: 'x % 2 == 0' } },
            { id: 'c', text: { ar: 'x * 2', en: 'x * 2' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'باقي القسمة على 2 صفر يعني زوجية. // 2 يعطي نصف العدد لا الحكم عليه.',
            en: 'A zero remainder from dividing by 2 means even. // 2 gives half the number, not a verdict about it.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن مفاجآت النصوص: ماذا ينتج "100" + "150"؟',
            en: 'And from the string surprises: what does "100" + "150" produce?',
          },
          options: [
            { id: 'a', text: { ar: '250', en: '250' } },
            { id: 'b', text: { ar: '"100150"', en: '"100150"' } },
            { id: 'c', text: { ar: 'خطأ — لا يمكن جمع نصوص', en: 'An error — strings cannot be added' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'على النصوص يعمل + كتجميع يلصق السلسلتين، لا كجمع رياضي. النصان ظلا نصًّا: 100150.',
            en: 'On strings, + works as concatenation that glues the two, not as arithmetic. Both stayed strings: 100150.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'print(59 / 60)',
          right: 'print(59 // 60)',
          note: {
            ar: 'أردت «كم ساعة كاملة؟» فظهر 0.9833… : القسمة الحقيقية / تعطي كسورًا. للعدّ الكامل استخدم //.',
            en: 'You asked “how many full hours?” and got 0.9833… : true division / gives fractions. For whole counting use //.',
          },
        },
        {
          wrong: "print('5' + 5)",
          right: "print(5 + 5)",
          note: {
            ar: 'جمع نص مع رقم يوقف البرنامج برسالة TypeError: بايثون ترفض خلط العالمين. اجمع نصًّا بنص أو رقمًا برقم — والتحويل بينهما قادم في الدرس التالي.',
            en: 'Adding text to a number stops the program with TypeError: Python refuses to mix the two worlds. Add text to text or number to number — conversion between them arrives in the next lesson.',
          },
        },
        {
          wrong: 'print(2 + 3 * 4)',
          right: 'print((2 + 3) * 4)',
          note: {
            ar: 'أردت (2+3) × 4 = 20 لكن الناتج كان 14: الضرب سابق على الجمع. الأقواس لا تُغني عن التفكير — بل تحميه.',
            en: 'You meant (2+3) × 4 = 20 but got 14: multiplication outranks addition. Parentheses do not replace thinking — they protect it.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'العائلة: + − * ** و / حقيقية تعطي float، و// صحيحة تعطي الجزء الكامل، و% تعطي الباقي.', en: 'The family: + − * **; / true division giving a float; // floor division giving the whole part; % giving the remainder.' },
        { ar: '% يحكم الزوجية والقسمة الكاملة ويقصّ آخر الخانات — وسيقود القرارات في الفصل الثالث.', en: '% rules evenness, perfect divisibility and last-digit slicing — and it will drive decisions in chapter 3.' },
        { ar: 'العوامل تعمل على النصوص: + تلصق و* تكرر — لكن لا تخلط نصًّا مع رقم في جمع واحد.', en: 'Operators work on strings: + glues and * repeats — but never mix text with a number in one addition.' },
      ],
      reflectPrompt: {
        ar: 'أين ستستخدم % في مشروع تخدم الناس — تقسيم صفوف، توزيع أيام، فواتير كل ثالث عميل؟ صِف الاستخدام بجملة واحدة.',
        en: 'Where would you use % in a project serving people — splitting rows, distributing days, a bill for every third customer? Describe the use in one sentence.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch2.s5', pages: 'ص27-28 / pp.27-28' },
        { book: 'PY4E', section: 'py4e.ch2.s8', pages: 'ص29 / pp.29' },
        { book: 'PY4E', section: 'py4e.ch2.s9', pages: 'ص30 / pp.30' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch2.s5', pages: 'ص27-28 / pp.27-28' },
    { book: 'PY4E', section: 'py4e.ch2.s8', pages: 'ص29 / pp.29' },
    { book: 'PY4E', section: 'py4e.ch2.s9', pages: 'ص30 / pp.30' },
  ],
} satisfies Lesson;

export default lesson;
