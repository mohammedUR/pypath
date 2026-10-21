import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch11.l6 — "Chapter 11 Review and Project: Log Analyzer /
 * مراجعة الفصل 11 ومشروع: محلل السجلات"
 * Aligned with PY4E ch11 s5 (ملخص), s7 (التنقيح), s8 (فهرس المصطلحات), s9 (تمارين).
 * All expression is original.
 * Project: a log analyzer — an embedded mbox-like log (fixed list of lines,
 * no file needed), regex-extract every X-DSPAM-Confidence value, count them,
 * print 'confidence count: %d' and 'average: %.4f'. Deterministic MEMFS-free.
 * Note: s5/s7/s8/s9 lie beyond the extracted source text (ends mid-s4) —
 * authored from TOC titles + known PY4E ch11 content; flagged for M5 proofread.
 */
const lesson = {
  id: 'py4e.ch11.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 11,
  title: { ar: 'مراجعة الفصل 11 ومشروع: محلل السجلات', en: 'Chapter 11 Review and Project: Log Analyzer' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch11.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أقفل الفصل على خريطته: بحث حرفي ثم مرساة ^، فحصاد findall بقوسيه، ففئات ومكررات وطموح وقناعة، فهروب يعيد الرموز محارف. اليوم نراجع المصطلحات والتنقيح ثم نبني مشروعًا يجمع الفصل كله: محلل سجلات يقرأ أسطرًا على هيئة mbox، يستخرج كل قيم X-DSPAM-Confidence بنمط واحد، ويطبع عددها ومتوسطها بتنسيق مهني — ثم نعطل النمط عمدًا لنرى العطل الصامت الأشهر في هذا الفصل. بنهاية الدرس ستكون قادرًا على: استرجاع أدوات الفصل الست، وتنقيح التعابير النمطية الصامتة، وشرح مصطلحاتها، وتنفيذ المشروع كاملًا.',
        en: 'The chapter closes onto its map: literal search then the ^ anchor, then findall with its parentheses, then classes and repeaters, greedy and lazy, then escaping that turns symbols back into characters. Today we review the glossary and debugging, then build a project gathering the whole chapter: a log analyzer reading mbox-shaped lines, extracting every X-DSPAM-Confidence value with one pattern, printing their count and average in professional formatting — then we break the pattern deliberately to witness this chapter\u2019s most famous silent fault. By the end of this lesson you will be able to: recall the chapter\u2019s six tools, debug silent regular expressions, explain its glossary, and run the project in full.',
      },
    },
    {
      kind: 'predict',
      code: "import re\ns = 'X-DSPAM-Confidence: 0.8475'\nprint(bool(re.search(r'^X\\S*: [0-9.]+', s)))\nprint(re.findall(r'^X\\S*: ([0-9.]+)', s)[0])\nprint(len(re.findall(r'\\S+@\\S+', 'mail csev@umich.edu now')))",
      question: {
        ar: 'ثلاثة أسطر تلخص الفصل كله: أي استدعاء فحص وأي استخراج وأي حصاد؟ وماذا يطبع كل سطر؟',
        en: 'Three lines summarizing the whole chapter: which call inspects, which extracts, which harvests? And what does each line print?',
      },
      reveal: {
        ar: 'الأول فحص بـ search فرجع True، والثاني استخراج بـ findall وأقواس فرجع 0.8475، والثالث حصاد عناوين فرجع 1. ثلاث أدوات على ثلاثة أسطر — وهذا كل الفصل: تختار الأداة بحسب السؤال، والنمط يحمل الصيغة، والفئات والمكررات تحمل الدقة.',
        en: 'The first inspected with search and returned True, the second extracted with findall and parentheses and returned 0.8475, the third harvested addresses and returned 1. Three tools on three lines — and that is the whole chapter: you pick the tool by the question, the pattern carries the shape, the classes and repeaters carry the precision.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل: ست أدوات وأداتان', en: 'The chapter map: six tools, two workhorses' },
      chunks: [
        {
          ar: 'ما تعلمناه يصطف في ستة صناديق: المطابقة الحرفية — نص يطابق نفسه؛ والمرساة ^ — تقيّد ببداية السطر؛ والفئات [ ] — تجمع مقبولاتك بمديات مثل [a-zA-Z0-9] وتحمي الرموز الخاصة داخلها؛ والاختصارات — \\S غير مسافي و\\s فراغ و\\d رقم و\\w محرف كلمة والنقطة أي-محرف خارج الفئة؛ والمكررات — * و+ و? و{2,4} تطبق على ما قبلها مباشرة؛ والهروب \\ — يعيد الرمز محرفًا حقيقيًا. وفوقها قوسا الاستخراج ( ) اللذان يختاران ما تعيده findall.',
          en: 'What we learned lines up in six boxes: literal matching — text matching itself; the ^ anchor — pinning to line start; classes [ ] — your accepted set by ranges like [a-zA-Z0-9], sheltering special symbols inside; shorthands — \\S non-space, \\s blank, \\d digit, \\w word character, and the any-character dot outside classes; repeaters — * and + and ? and {2,4} applying to what precedes; and escaping \\ — turning a symbol back into a real character. Above them, the extraction parentheses ( ) choosing what findall returns.',
        },
        {
          ar: 'وأداتا العمل في كل برنامج: search للتصفية — هل السطر من نوعنا؟ — وfindall للحصاد — ما قيمته؟ — وقد دمجنا اليوم سابقًا في النمط ^X\\S*: ([0-9.]+): فهو يرفض السطر غير المشكّل بإعادة قائمة فارغة ويستخرج الرقم من المطابق، فينفذ البحث والاستخراج معًا بلا شرطين منفصلين.',
          en: 'And the two workhorses of every program: search for filtering — is this line our kind? — and findall for harvesting — what is its value? Today we merged them before in the pattern ^X\\S*: ([0-9.]+): it refuses the misshapen line with an empty list and extracts the number from the matching one — search and extract together with no separate checks.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التنقيح: حين يتكلم النمط بالصمت', en: 'Debugging: when the pattern speaks in silence' },
      chunks: [
        {
          ar: 'أعطال هذا الفصل لا ترمي استثناءات غالبًا — بل تعيد نتائج فارغة أو زائدة بهدوء. findall تخفق فتعيد [] ولا تشكو، فيمضي برنامجك بعدّاد صفر أو متوسط محرّف بينما كل شيء يبدو سليمًا. أدواتنا الثلاث الموروثة تكفي هنا أيضًا: قلّص الدخل — جرّب النمط على سطر واحد معروف قبل الحلقة كاملة. اطبع موجزًا — len(x) أو العدد والمتوسط لا القوائم كلها. وافحص بالعين — أول قائمة خرجت تحتوي السطر كله أم الرقم وحده؟',
          en: 'This chapter\u2019s faults rarely throw exceptions — they quietly return empty or inflated results. findall fails into [] and never complains, so your program marches on with a zero count or a corrupted average while everything looks fine. Our three inherited tools suffice here too: reduce the input — try the pattern on one known line before the full loop. Print summaries — len(x), the count and the average, not whole lists. And eyeball it — did the first returned list hold the whole line or the number alone?',
        },
        {
          ar: 'ولكل عطل صامت مشتبه أول: القائمة الفارغة دائمًا؟ النمط لا يطابق — راجع فراغًا نسيت أو مرساة زائدة. أعداد أكثر من المتوقع؟ النمط فضفاض يقبض ترويسات لا تخصك — ضمنه بالاسم الحرفي. أرقام مقلوبة أو نصية؟ الأقواس أو التحويل float. قاعدة الفصل: النمط الذي لا تجريه على سطر معروف، لا تصدقه على ملف كامل.',
          en: 'Every silent fault has a first suspect: always-empty lists? The pattern matches nothing — check a forgotten blank or an extra anchor. More numbers than expected? A loose pattern grabbing headers not yours — tighten it with the literal name. Backwards or textual numbers? The parentheses or the float conversion. The chapter\u2019s law: a pattern you have not run on a known line, do not trust on a whole file.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فهرس مصطلحات الفصل', en: 'The chapter glossary' },
      chunks: [
        {
          ar: 'التعبير النمطي regular expression: لغة صغيرة تصف شكل النص المطلوب بيانيًا. المطابقة match: حصول جزء من السلسلة على وصف النمط. الاستخراج extract: سحب الجزء المطابق من السلسلة لاستعماله — بأقواس findall أو group. المرساة anchor: رمز يثبت المطابقة عند موقع — ^ لبداية السطر.',
          en: 'A regular expression: a small language describing the wanted text shape. A match: a piece of the string fitting the pattern\u2019s description. To extract: pulling the matched piece out of the string for use — via findall parentheses or group. An anchor: a symbol pinning the match to a position — ^ for the start of the line.',
        },
        {
          ar: 'فئة المحارف character class: مجموعة محارف مقبولة بين قوسين مربعين، والاختصارات \\d و\\w و\\s من أشهرها. والطموح greedy: سلوك المكررات * و+ في أمساك أكبر قدر ممكن قبل الاكتمال — ونقيضه القانع lazy بعلامة ? التي تكتفي بأول موضع. والهروب escape: الشرطة المائلة التي تحول الرمز الخاص إلى محرف عادي.',
          en: 'A character class: an accepted set of characters between square brackets, with \\d and \\w and \\s as its most famous shorthands. Greedy: the behavior of * and + in holding the largest possible span before completing — its opposite is lazy, marked by ?, settling for the first position. And escape: the backslash turning a special symbol into an ordinary character.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'محلل السجلات كاملًا', en: 'The log analyzer, whole and working' },
      code: "import re\nlog = [\n    'From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008',\n    'X-DSPAM-Confidence: 0.8475',\n    'Author: stephen.marquard@uct.ac.za',\n    'X-DSPAM-Probability: 0.0000',\n    'From cwen@iupui.edu Thu Jan  3 16:23:48 2008',\n    'X-DSPAM-Confidence: 0.6178',\n    'X-DSPAM-Probability: 0.0000',\n    'X-DSPAM-Confidence: 0.6961',\n    'Subject: Past deadline',\n    'X-DSPAM-Confidence: 0.8386',\n    'From zqian@umich.edu Fri Jan  4 18:10:48 2008',\n]\ntotal = 0.0\ncount = 0\nfor line in log:\n    x = re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)\n    if len(x) > 0:\n        total = total + float(x[0])\n        count = count + 1\nprint('confidence count: %d' % count)\nprint('average: %.4f' % (total / count))",
      explanation: {
        ar: "السجل أحد عشر سطرًا بروح mbox: رسائل وترويسات وشوائب، وفي وسطها أربعة أسطر X-DSPAM-Confidence بقيم 0.8475 و0.6178 و0.6961 و0.8386. النمط ^X-DSPAM-Confidence: ([0-9.]+) مقيّد بالاسم الحرفي فرمى Probability وSubject وFrom جميعًا، والأقواس اقتصدت الرقم. المجموع 3.0 على أربعة فيطبع 'confidence count: 4' ثم 'average: 0.7500' بتنسيق %d و%.4f من الفصل السادس. برنامج من عشرة أسطر فعل ما احتاج فصولًا قبل التعابير النمطية.",
        en: "The log is eleven lines with mbox spirit: messages, headers and noise, with four X-DSPAM-Confidence lines inside at 0.8475, 0.6178, 0.6961 and 0.8386. The pattern ^X-DSPAM-Confidence: ([0-9.]+) is pinned to the literal name, throwing out Probability, Subject and From alike, and the parentheses kept only the number. The sum is 3.0 over four, so it prints 'confidence count: 4' then 'average: 0.7500' with the chapter-6 %d and %.4f formatting. A ten-line program did what took chapters before regular expressions.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-chapter',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import re\nx = re.findall(r'\\d+', 'rev=39772')\nprint(len(x))\nprint(x[0])\nprint(bool(re.search(r'^From:', 'Re: From: me')))\nprint(len(re.findall(r'\\S+@\\S+', 'a csev@umich.edu b')))",
      solution: '1\n39772\nFalse\n1',
      answer: '1\n39772\nFalse\n1',
      hints: [
        { ar: '\\d+ على rev=39772: كتلة أرقام واحدة — كم عنصرًا؟', en: '\\d+ over rev=39772: one digit block — how many elements?' },
        { ar: 'السطر Re: From: me لا يبدأ بـ From — المرساة صارمة مهما وُجد النمط في الوسط.', en: 'The line Re: From: me does not start with From — the anchor is strict however mid-line the pattern sits.' },
        { ar: '\\S+@\\S+ على سطر فيه عنوان واحد — والحصاد عدده.', en: '\\S+@\\S+ over a line with one address — the harvest counts them.' },
        { ar: 'الخرْج:\n1\n39772\nFalse\n1', en: 'The output:\n1\n39772\nFalse\n1' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.log-analyzer',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "مشروع الفصل الحادي عشر — محلل السجلات: السجل log معطى في المحرر (قائمة أسطر بروح mbox). استخدم حلقة for مع re.findall بالنمط r'^X-DSPAM-Confidence: ([0-9.]+)'؛ كل سطر طابق: زد total بـ float(x[0]) وزد count واحدًا (لا تطبع الأسطر نفسها). بعد الحلقة اطبع 'confidence count: %d' % count ثم اطبع 'average: %.4f' % (total / count). المتوقع: confidence count: 4 ثم average: 0.7500.",
        en: "Chapter 11 project — the log analyzer: the log is given in the editor (a list of mbox-like lines). Use a for loop with re.findall and the pattern r'^X-DSPAM-Confidence: ([0-9.]+)'; for every matching line add float(x[0]) to total and raise count by one (do not print the lines themselves). After the loop print 'confidence count: %d' % count, then print 'average: %.4f' % (total / count). Expected: confidence count: 4, then average: 0.7500.",
      },
      starterCode: "import re\nlog = [\n    'From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008',\n    'X-DSPAM-Confidence: 0.8475',\n    'Author: stephen.marquard@uct.ac.za',\n    'X-DSPAM-Probability: 0.0000',\n    'From cwen@iupui.edu Thu Jan  3 16:23:48 2008',\n    'X-DSPAM-Confidence: 0.6178',\n    'X-DSPAM-Probability: 0.0000',\n    'X-DSPAM-Confidence: 0.6961',\n    'Subject: Past deadline',\n    'X-DSPAM-Confidence: 0.8386',\n    'From zqian@umich.edu Fri Jan  4 18:10:48 2008',\n]\ntotal = 0.0\ncount = 0\n# حلقة: استخرج قيم الثقة فقط ثم اجمع وعدّ / loop: extract confidence values only, sum and count\n# ثم اطبع السطرين المنسقين / then print the two formatted lines\n",
      solution: "import re\nlog = [\n    'From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008',\n    'X-DSPAM-Confidence: 0.8475',\n    'Author: stephen.marquard@uct.ac.za',\n    'X-DSPAM-Probability: 0.0000',\n    'From cwen@iupui.edu Thu Jan  3 16:23:48 2008',\n    'X-DSPAM-Confidence: 0.6178',\n    'X-DSPAM-Probability: 0.0000',\n    'X-DSPAM-Confidence: 0.6961',\n    'Subject: Past deadline',\n    'X-DSPAM-Confidence: 0.8386',\n    'From zqian@umich.edu Fri Jan  4 18:10:48 2008',\n]\ntotal = 0.0\ncount = 0\nfor line in log:\n    x = re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)\n    if len(x) > 0:\n        total = total + float(x[0])\n        count = count + 1\nprint('confidence count: %d' % count)\nprint('average: %.4f' % (total / count))",
      tests: [
        {
          id: 't1',
          name: { ar: 'عدّ القيم أربعة', en: 'The value count is four' },
          code: "assert 'confidence count: 4' in __learner_output__, ('expected: confidence count: 4 | actual: %r' % __learner_output__)",
          expected: 'confidence count: 4',
        },
        {
          id: 't2',
          name: { ar: 'المتوسط 0.7500 بتنسيقه', en: 'The average is 0.7500 in format' },
          code: "assert 'average: 0.7500' in __learner_output__, ('expected: average: 0.7500 | actual: %r' % __learner_output__)",
          expected: 'average: 0.7500',
        },
        {
          id: 't3',
          name: { ar: 'التجميع صحيح: count=4 والمجموع 3.0', en: 'Accumulation correct: count=4 and sum 3.0' },
          code: "assert count == 4 and abs(total - 3.0) < 0.000001, ('expected: count 4, total 3.0 | actual: count %r total %r' % (count, total))",
          expected: 'count 4, total 3.0',
        },
        {
          id: 't4',
          name: { ar: 'لا تلوّث: Probability والصفر لا يظهران', en: 'No pollution: Probability and zeros absent' },
          code: "assert 'Probability' not in __learner_output__ and '0.0000' not in __learner_output__, ('expected: no Probability or 0.0000 | actual: %r' % __learner_output__)",
          expected: 'no Probability or 0.0000',
        },
      ],
      hints: [
        { ar: 'المرساة والاسم الحرفي معًا: ^X-DSPAM-Confidence: — فيستثني النمط Probability وSubject تلقائيًا.', en: 'Anchor and literal name together: ^X-DSPAM-Confidence: — the pattern excludes Probability and Subject automatically.' },
        { ar: 'قيمتان يزيدان في كل مطابقة: total = total + float(x[0]) وcount = count + 1 — التحويل قبل الجمع.', en: 'Two values rise per match: total = total + float(x[0]) and count = count + 1 — convert before summing.' },
        { ar: "الهيكل:\nfor line in log:\n    x = re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)\n    if len(x) > 0:\n        total = total + float(x[0])\n        count = count + 1\nprint('confidence count: %d' % count)\nprint('average: %.4f' % (total / count))", en: "The skeleton:\nfor line in log:\n    x = re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)\n    if len(x) > 0:\n        total = total + float(x[0])\n        count = count + 1\nprint('confidence count: %d' % count)\nprint('average: %.4f' % (total / count))" },
        { ar: 'الطباعة النهائية بتنسيق الفصل السادس: %d للعدّ و%.4f للمتوسط — واقسم total على count لا على طول log.', en: 'Final prints in chapter-6 formatting: %d for the count and %.4f for the average — and divide total by count, not by len(log).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-silent',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'برنامجك يطبع confidence count: 0 دائمًا بلا أي رسالة خطأ — ما التفسير الأول الذي تفحصه؟',
        en: 'Your program keeps printing confidence count: 0 with no error message — which explanation do you examine first?',
      },
      options: [
        { id: 'a', text: { ar: 'النمط لا يطابق أي سطر — findall تعيد [] بصمت فيتجمد العدّاد', en: 'The pattern matches no line — findall silently returns [] and the counter stays frozen' } },
        { id: 'b', text: { ar: 'بايثون أعطّلت مكتبة re في هذه الجلسة', en: 'Python disabled the re library in this session' } },
        { id: 'c', text: { ar: 'الأسطر كثيرة فتتجاوز الحلقة بعضها', en: 'The lines are too many so the loop skips some' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'findall لا ترمي خطأ عند الفشل — الصمت توقيعها.', en: 'findall throws nothing on failure — silence is her signature.' },
        { ar: 'قلّص الدخل: جرّب النمط على سطر معروف واحد وراقب القائمة.', en: 'Reduce the input: try the pattern on one known line and inspect the list.' },
        { ar: 'المشتبه الأشهر: فراغ مفقود بعد النقطتين أو مرساة في غير موضعها.', en: 'The most famous suspect: a missing blank after the colon, or an anchor out of place.' },
        { ar: 'الجواب: النمط لا يطابق أي سطر — الصمت ليست صحة.', en: 'Answer: the pattern matches no line — silence is not correctness.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-confidence',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: في سجل المشروع log — كم سطرًا يبدأ بـ X-DSPAM-Confidence: (ومن ثم كم قيمة ستدخل عدّاد count)؟',
        en: 'Without running: in the project log — how many lines start with X-DSPAM-Confidence: (hence how many values enter the count)?',
      },
      answer: '4',
      solution: '4',
      tolerance: 0,
      hints: [
        { ar: 'اقرأ السجل سطرًا سطرًا وعدّ الترويسات التي تبدأ بهذا الاسم بالضبط.', en: 'Read the log line by line and count the headers starting with that exact name.' },
        { ar: 'سطرا X-DSPAM-Probability ليسا من العدة — الاسم مختلف.', en: 'The two X-DSPAM-Probability lines are not counted — a different name.' },
        { ar: 'أربعة أسطر ثقة بين أحد عشر سطرًا — والبقية ضجيج يعلمه النمط رفضه.', en: 'Four confidence lines among eleven — the rest is noise the pattern knows to refuse.' },
        { ar: 'الجواب: 4', en: 'Answer: 4' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-loose-pattern',
      required: true,
      brokenCode: "import re\nlog = [\n    'From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008',\n    'X-DSPAM-Confidence: 0.8475',\n    'Author: stephen.marquard@uct.ac.za',\n    'X-DSPAM-Probability: 0.0000',\n    'From cwen@iupui.edu Thu Jan  3 16:23:48 2008',\n    'X-DSPAM-Confidence: 0.6178',\n    'X-DSPAM-Probability: 0.0000',\n    'X-DSPAM-Confidence: 0.6961',\n    'Subject: Past deadline',\n    'X-DSPAM-Confidence: 0.8386',\n    'From zqian@umich.edu Fri Jan  4 18:10:48 2008',\n]\ntotal = 0.0\ncount = 0\nfor line in log:\n    # نمط عمومي يقبل أي ترويسة X — يبدو معقولًا / a general pattern for any X header — looks reasonable\n    x = re.findall(r'^X\\S*: ([0-9.]+)', line)\n    if len(x) > 0:\n        total = total + float(x[0])\n        count = count + 1\nprint('confidence count: %d' % count)\nprint('average: %.4f' % (total / count))",
      prompt: {
        ar: 'المحلل يطبع confidence count: 6 وaverage: 0.5000 — لكن السجل يحوي أربع قيم ثقة فقط! لا استثناء ولا رسالة: عطل صامت كامل. شغّل الكود المعطوب وانظر أي سطور دخلت الحساب: أي جزء من النمط فتح الباب لـ X-DSPAM-Probability: 0.0000 مرتين؟ أصلح النمط ليحصر X-DSPAM-Confidence: وحدها فيظهر confidence count: 4 وaverage: 0.7500.',
        en: 'The analyzer prints confidence count: 6 and average: 0.5000 — but the log holds only four confidence values! No exception, no message: a fully silent fault. Run the broken code and see which lines entered the math: which part of the pattern opened the door to X-DSPAM-Probability: 0.0000 twice? Fix the pattern to pin X-DSPAM-Confidence: alone so confidence count: 4 and average: 0.7500 appear.',
      },
      solution: "import re\nlog = [\n    'From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008',\n    'X-DSPAM-Confidence: 0.8475',\n    'Author: stephen.marquard@uct.ac.za',\n    'X-DSPAM-Probability: 0.0000',\n    'From cwen@iupui.edu Thu Jan  3 16:23:48 2008',\n    'X-DSPAM-Confidence: 0.6178',\n    'X-DSPAM-Probability: 0.0000',\n    'X-DSPAM-Confidence: 0.6961',\n    'Subject: Past deadline',\n    'X-DSPAM-Confidence: 0.8386',\n    'From zqian@umich.edu Fri Jan  4 18:10:48 2008',\n]\ntotal = 0.0\ncount = 0\nfor line in log:\n    x = re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)\n    if len(x) > 0:\n        total = total + float(x[0])\n        count = count + 1\nprint('confidence count: %d' % count)\nprint('average: %.4f' % (total / count))",
      tests: [
        {
          id: 't1',
          name: { ar: 'العدّ عاد إلى أربعة', en: 'The count is back to four' },
          code: "assert 'confidence count: 4' in __learner_output__ and 'confidence count: 6' not in __learner_output__, ('expected: confidence count: 4 | actual: %r' % __learner_output__)",
          expected: 'confidence count: 4',
        },
        {
          id: 't2',
          name: { ar: 'المتوسط الصحيح 0.7500 لا 0.5000', en: 'The right average 0.7500, not 0.5000' },
          code: "assert 'average: 0.7500' in __learner_output__ and '0.5000' not in __learner_output__, ('expected: average: 0.7500 | actual: %r' % __learner_output__)",
          expected: 'average: 0.7500',
        },
        {
          id: 't3',
          name: { ar: 'التجميع المصلح: count=4 والمجموع 3.0', en: 'The fixed accumulation: count=4 and sum 3.0' },
          code: "assert count == 4 and abs(total - 3.0) < 0.000001, ('expected: count 4, total 3.0 | actual: count %r total %r' % (count, total))",
          expected: 'count 4, total 3.0',
        },
      ],
      hints: [
        { ar: 'العطل صامت بالكامل: الأرقام معقولة لكنها ليست قيمك — هذا أخطر عيوب الفصل.', en: 'The fault is fully silent: the numbers look plausible but are not yours — the deadliest chapter ailment.' },
        { ar: '\\S* بعد X تعني أي محارف غير مسافية — فقبلت DSPAM-Probability كما قبلت DSPAM-Confidence.', en: '\\S* after X means any non-space characters — so it accepted DSPAM-Probability just as it accepted DSPAM-Confidence.' },
        { ar: 'الحصر بالاسم الحرفي: r"^X-DSPAM-Confidence: ([0-9.]+)" — استبدل الفئة الفضفاضة بالاسم المطلوب.', en: 'Pin by literal name: r"^X-DSPAM-Confidence: ([0-9.]+)" — swap the loose class for the exact name.' },
        { ar: 'بعد الإصلاح ستُرفض Probability مرتين فيعود العدّ إلى أربعة ويصير المتوسط 0.7500.', en: 'After the fix Probability is refused twice, the count returns to four and the average becomes 0.7500.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — محللك الخاص\n# Your playground — your own analyzer\n\nimport re\n\nlog = [\n    "From alice@ex.com Mon Jan  1 08:00:00 2024",\n    "X-DSPAM-Confidence: 0.9100",\n    "X-Spam-Status: hits=2",\n    "X-DSPAM-Confidence: 0.8200",\n    "Subject: lunch?",\n]\ntotal = 0.0\ncount = 0\nfor line in log:\n    x = re.findall(r"^X-DSPAM-Confidence: ([0-9.]+)", line)\n    if len(x) > 0:\n        total = total + float(x[0])\n        count = count + 1\nprint("confidence count: %d" % count)\nprint("average: %.4f" % (total / count))\nprint(re.findall(r"^X-Spam-Status: hits=(\\d+)", "X-Spam-Status: hits=2"))\nprint(re.findall(r"^From (\\S+)@\\S+", log[0]))',
      prompt: {
        ar: 'جرّب بنفسك: أضف أسطر ثقة جديدة وراقب المتوسط، ثم استخرج اسم المرسل من سطر From بالنمط الأخير، وجرّب نمط hits= لعدّ إشارات السبام — وبالنهاية عطّل المرساة ^ وراقب ماذا يتسلل. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add new confidence lines and watch the average; extract the sender name from the From line with the last pattern; try the hits= pattern to count spam signals — and finally drop the anchor ^ to see what sneaks in. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي استدعاء يفلتر الأسطر ويستخرج القيمة في خطوة واحدة؟',
            en: 'Which call filters the lines and extracts the value in one step?',
          },
          options: [
            { id: 'a', text: { ar: "re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)", en: "re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)" } },
            { id: 'b', text: { ar: "re.search(r'^X-DSPAM-Confidence:', line)", en: "re.search(r'^X-DSPAM-Confidence:', line)" } },
            { id: 'c', text: { ar: "line.find('X-DSPAM-Confidence:')", en: "line.find('X-DSPAM-Confidence:')" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'search وfind يفحصان فحسب؛ findall بالأقواس تفلتر بالمرساة والاسم وتسلّم الرقم — بحث واستخراج معًا كما سمّى الكتاب القسم كله.',
            en: 'search and find merely inspect; findall with parentheses filters by anchor and name and hands over the number — search and extract together, as the book titled the whole section.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: "ومن الفصل السادس: '3' + '4' تعطي ماذا — ولماذا حولنا قيم الثقة بـ float قبل الجمع؟",
            en: "From chapter 6: what does '3' + '4' give — and why did we convert confidence values with float before summing?",
          },
          options: [
            { id: 'a', text: { ar: "'34' — السلاسل تلتحم لا تُجمع، وfloat وحده يصنع جمعًا حسابيًا", en: "'34' — strings concatenate rather than add; float alone creates arithmetic summing" } },
            { id: 'b', text: { ar: '7 — بايثون تخمّن القصد الرقمي', en: '7 — Python guesses the numeric intent' } },
            { id: 'c', text: { ar: 'خطأ دائم — لا يجوز جمع سلسلتين', en: 'Always an error — two strings may never be added' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'إرث الفصل السادس: + بين سلسلتين لصق — وقيم findall سلاسل، فبلا float لالحمت الأرقام لا مجموعها. التحويل عند الاستعمال لا عند الاستخراج.',
            en: 'The chapter-6 inheritance: + between strings glues — and findall values are strings, so without float the numbers would glue instead of sum. Convert at the point of use, not extraction.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: "ومن الفصل السابع: لو أردنا حفظ سجل اليوم في ملف mbox-l11.txt لقراءته لاحقًا — أي وضع فتح نستخدم عند الكتابة الأولى؟",
            en: "From chapter 7: to save today\u2019s log into a file mbox-l11.txt for later reading — which open mode do we use for the first write?",
          },
          options: [
            { id: 'a', text: { ar: "'w' — وضع الكتابة ينشئ الملف ويكتب منه", en: "'w' — write mode creates the file and writes into it" } },
            { id: 'b', text: { ar: "'r' — وضع القراءة ينشئ الملف", en: "'r' — read mode creates the file" } },
            { id: 'c', text: { ar: "'print' — وضع الطباعة", en: "'print' — print mode" } },
          ],
          answer: 'a',
          explanation: {
            ar: 'دورة حياة الملف من الفصل السابع: open بالوضع w ثم write ثم close ثم إعادة فتح للقراءة — وسجل اليوم وُضع في قائمة ليبقى المشروع معتمدًا على نفسه.',
            en: 'The chapter-7 file lifecycle: open in w mode, then write, then close, then reopen to read — today\u2019s log sat in a list to keep the project self-contained.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل التاسع: أردت عدّ مرات تكرار كل قيمة ثقة — أي سطر يحصيها في قاموس؟',
            en: 'From chapter 9: you want to count how often each confidence value occurs — which line tallies it into a dictionary?',
          },
          options: [
            { id: 'a', text: { ar: 'counts[v] = counts.get(v, 0) + 1', en: 'counts[v] = counts.get(v, 0) + 1' } },
            { id: 'b', text: { ar: 'counts[v] = float(v)', en: 'counts[v] = float(v)' } },
            { id: 'c', text: { ar: 'counts.append(v)', en: 'counts.append(v)' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عدّاد get الموروث من histogram الفصل التاسع: مفتاح لكل قيمة وعداد يبدأ من صفر — يجعل من قيم الثقة قاموس تكرارات جاهز للترتيب.',
            en: 'The get counter inherited from the chapter-9 histogram: a key per value with a counter starting at zero — turning confidence values into a ready frequency dictionary.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الفصل العاشر: أردت لوحة أعلى قيم الثقة تنازليًا — أي نمط يرتّبها؟',
            en: 'From chapter 10: you want a board of the highest confidence values descending — which pattern sorts them?',
          },
          options: [
            { id: 'a', text: { ar: 'التمييز DSU: صفوف (قيمة، سطر) ثم sort(reverse=True)', en: 'The DSU pattern: (value, line) tuples then sort(reverse=True)' } },
            { id: 'b', text: { ar: 'findall وحدها ترتب النتائج تلقائيًا', en: 'findall alone sorts its results automatically' } },
            { id: 'c', text: { ar: 'float يرتب القيم عند التحويل', en: 'float sorts values upon conversion' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الصفوف من الفصل العاشر تحمل (المفتاح، الأصل) فيرتبها sort — وكان findall ترتّب بحسب ورودها في النص لا بحسب القيمة.',
            en: 'Chapter-10 tuples carry (key, original) for sort to order — findall had only text order, never value order.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'في نمط الساعات ^From .* ([0-9][0-9]): — لماذا كررنا الفئة [0-9] مرتين بدل كتابة [0-9]+؟',
            en: 'In the hours pattern ^From .* ([0-9][0-9]): — why repeat the class [0-9] twice instead of writing [0-9]+?',
          },
          options: [
            { id: 'a', text: { ar: 'لتثبيت خانتين بالضبط — فنقبض 09 و16 ونرفض الرقم المنفرد', en: 'To pin exactly two digits — catching 09 and 16 and refusing a lone digit' } },
            { id: 'b', text: { ar: 'لتسريع النمط', en: 'To make the pattern faster' } },
            { id: 'c', text: { ar: 'لأن [0-9]+ غير صحيحة قواعديًا', en: 'Because [0-9]+ is grammatically invalid' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التكرار المحدد فيرث فكرة {2} في الدرس الرابع: العدد يصير جزءًا من الوصف — فيستخرج الساعة ذات الخانتين من 09:14:16 بلا شوائب.',
            en: 'Fixed repetition carries the {2} idea from lesson four: the count becomes part of the description — extracting the two-digit hour from 09:14:16 with no noise.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "x = re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)\nprint(x[0])",
          right: "x = re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)\nif len(x) > 0:\n    print(x[0])",
          note: {
            ar: 'السطر الضجيج يعيد قائمة فارغة وx[0] عليها يرمي IndexError: list index out of range — الوصاية len(x) > 0 واجبة قبل كل فهرسة لنتيجة findall.',
            en: 'A noise line returns an empty list and indexing it throws IndexError: list index out of range — the len(x) > 0 guardian is mandatory before touching any findall result.',
          },
        },
        {
          wrong: "x = re.findall(r'^X\\S*: ([0-9.]+)', line)",
          right: "x = re.findall(r'^X-DSPAM-Confidence: ([0-9.]+)', line)",
          note: {
            ar: 'النمط الفضفاض يقبل كل ترويسات X فيدخل Probability: 0.0000 في متوسطك فيهبط بلا أي تحذير. ضمن بالنمط الحرفي حين تعرف الترويسة بالاسم.',
            en: 'The loose pattern accepts every X header, letting Probability: 0.0000 sink your average with no warning at all. Pin with the literal pattern when you know the header by name.',
          },
        },
        {
          wrong: "total = 0\ntotal = total + x[0]",
          right: "total = 0.0\ntotal = total + float(x[0])",
          note: {
            ar: 'المستخرج سلسلة "0.8475" لا رقم: جمعها على عدّاد يرمي TypeError: unsupported operand type(s) for +. حوّل float عند الاستعمال.',
            en: 'The extract is the string "0.8475", not a number: adding it to a counter throws TypeError: unsupported operand type(s) for +. Convert with float at the point of use.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل الست أدوات: حرفي ومرساة وفئة واختصار ومكرر وهروب — وأداتا عمل: search للتصفية وfindall بالأقواس للحصاد.', en: 'The chapter is six tools: literal, anchor, class, shorthand, repeater, escape — and two workhorses: search for filtering, findall with parentheses for harvesting.' },
        { ar: 'التنقيح هنا صمت-محور: قلّص الدخل على سطر معروف، اطبع len(x) والموجز، واشتبه أول ما تشتبه في النمط نفسه.', en: 'Debugging here is silence-centered: reduce input to a known line, print len(x) and summaries, and suspect the pattern itself first.' },
        { ar: 'المصطلحات: تعبير نمطي ومطابقة واستخراج ومرساة وفئة محارف وطموح وقانع وهروب.', en: 'Glossary: regular expression, match, extract, anchor, character class, greedy, lazy, escape.' },
        { ar: 'المشروع جمع الفصل: نمط حرفي مقيّد بمرساة وفئة رقمية وقوس استخراج، فحص len، وتحويل float، وتنسيق %d و%.4f — محلل سجلات من عشرة أسطر.', en: 'The project gathered the chapter: a literal pattern pinned by anchor and digit class and an extraction paren, a len check, float conversion, and %d with %.4f formatting — a ten-line log analyzer.' },
      ],
      reflectPrompt: {
        ar: 'صندوق بريدك يحمل ترويسات أخرى: X-Sender-IP: وX-Spam-Status:. صمّم نمط استخراج لكل منها، وقرر أي القيمتين تريد متوسطها وأيهما تريد عدّ فئاتها — ثم جرّب محللك خارج المنصة على ملف حقيقي.',
        en: 'Your mailbox carries other headers: X-Sender-IP: and X-Spam-Status:. Design an extraction pattern for each, decide which you want averaged and which categorized, then run your analyzer outside the platform on a real file.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch11.s5', pages: 'ص184 / pp.184' },
        { book: 'PY4E', section: 'py4e.ch11.s7', pages: 'ص186 / pp.186' },
        { book: 'PY4E', section: 'py4e.ch11.s8', pages: 'ص187 / pp.187' },
        { book: 'PY4E', section: 'py4e.ch11.s9', pages: 'ص187 / pp.187' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch11.s5', pages: 'ص184 / pp.184' },
    { book: 'PY4E', section: 'py4e.ch11.s7', pages: 'ص186 / pp.186' },
    { book: 'PY4E', section: 'py4e.ch11.s8', pages: 'ص187 / pp.187' },
    { book: 'PY4E', section: 'py4e.ch11.s9', pages: 'ص187 / pp.187' },
  ],
} satisfies Lesson;

export default lesson;
