import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch16.l4 — "Text-Based Data Visualization / الرسم النصي للبيانات"
 * Aligned with PY4E ch16 s2 (العرض المرئي للشبكات والارتباطات — من الدرجات
 * إلى عرض مرئي).
 * All expression is original.
 * SIMULATED-RENDERER design: ASCII bars are the platform's honest text
 * renderer; the book's d3 charts / word clouds are framed external. The
 * runnable code builds draw_bars(pairs, width) — bar length proportional to
 * value, scaled to a fixed width, with a DSU-sorted ranking (ch10).
 */
const lesson = {
  id: 'py4e.ch16.l4',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 16,
  title: { ar: 'الرسم النصي للبيانات', en: 'Text-Based Data Visualization' },
  estimatedMinutes: 16,
  prerequisites: ['py4e.ch16.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قائمة درجات لا تُقنع أحدًا — الرسم يقنع. تطبيقات الكتاب ترسم في المتصفح بمكتبات متخصصة، أما منصتنا فتعتمد عارضًا نصيًّا صادقًا يعمل في كل مكان: أشرطة ASCII يكون طولها متناسبًا مع القيمة. سنبني معًا دالة draw_bars(pairs, width) تفرز وتحجّم وترسم — وفي الطريق نتعلم المفاضلة التي يواجهها كل رسّام بيانات: عرض السطر. نولّد بيانات الرسم هنا ونعرضها نصًّا؛ والعرض الرسومي المتقدم يحدث في أداة خارجية. بنهاية الدرس ستكون قادرًا على: قراءة شريط ASCII كقيمة، وترتيب الأزواج تنازليًّا بفكّ DSU، واختيار عرض يوازن بين الدقة والوضوح.',
        en: 'A list of degrees convinces nobody — a drawing convinces. The book\u2019s applications draw in the browser with specialized libraries, while our platform uses an honest text renderer that works everywhere: ASCII bars whose length is proportional to the value. We will build draw_bars(pairs, width) together — it sorts, scales and draws — and on the way learn the trade-off every chart maker faces: line width. We generate the chart data here and render it as text; the advanced graphical rendering happens in an external tool. By the end of this lesson you will be able to: read an ASCII bar as a value, rank pairs descending with DSU unpacking, and pick a width balancing precision and clarity.',
      },
    },
    {
      kind: 'predict',
      code: "name = 'chuck'\ncount = 8\nbar = '#' * count\nprint(bar)\nprint('%s | %s %d' % (name, bar, count))",
      question: {
        ar: 'ضرب نص في عدد يكرره — من الفصل السادس. ماذا يطبع السطران؟',
        en: 'Multiplying text by a number repeats it — from chapter six. What do the two lines print?',
      },
      reveal: {
        ar: 'يطبع ######## ثم chuck | ######## 8. المحارف الثمانية هي القيمة مرسومة: طول الشريط يتناسب مع العدد، والرقم في نهاية السطر يحفظ الدقة. هذه هي هيئة كل سطر سترسمه اليوم: اسم وشريط وقيمة.',
        en: 'It prints ######## then chuck | ######## 8. The eight characters are the value drawn: bar length is proportional to the number, and the digit at the end of the line keeps the precision. This is the shape of every line you will draw today: a name, a bar and a value.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'طول الشريط يتناسب مع القيمة', en: 'Bar length is proportional to value' },
      chunks: [
        {
          ar: 'مخطط الأشرطة يحوّل كل (اسم، قيمة) إلى سطر: الاسم، ففاصل، فشريط محارف بطوله يتناسب مع القيمة، فالرقم نفسه. الترتيب ينزل من الأكبر إلى الأصغر حتى يقرأ العين القائمة كسلّم: وفق فكّ الفرز DSU من الفصل العاشر نبني أزواجًا مقلوبة (value, name) ونرتبها بـ reverse=True ثم نعيد الوجه إلى (name, value).',
          en: 'A bar chart turns each (name, value) into a line: the name, a separator, a character bar whose length is proportional to the value, then the number itself. The order runs biggest to smallest so the eye reads the list as a staircase: with the chapter-ten DSU trick we build flipped (value, name) pairs, sort with reverse=True, then flip back to (name, value).',
        },
        {
          ar: 'التحجيم يجعل الأشرطة قابلة للعرض: ticks = int(width * value / biggest) — نضرب القيمة في العرض المختار ونقسم على أكبر قيمة فتأخذ أكبر قيمة العرض كاملًا وتنكمش البقية بنسبة مئوية. كل محرف # نقطة، والخطوة بين القيم تحفظ الشكل العام — وهذا هو جوهر كل مخطط: مقاييس صادقة.',
          en: 'Scaling makes bars displayable: ticks = int(width * value / biggest) — multiply the value by the chosen width and divide by the biggest value, so the largest takes the full width and the rest shrink proportionally. Each # is one point, and the steps between values preserve the overall shape — this is the heart of every chart: honest scales.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'سقف العرض: لماذا نحجّم؟', en: 'The display cap: why scale at all?' },
      chunks: [
        {
          ar: 'في بيانات الكتاب الحقيقية أرسلت gmail.com ‏7339 رسالة وox.ac.uk عددًا أقل بكثير — شريط بمحرف لكل رسالة يمتد آلاف الأحرف فيخرج عن الشاشة والملف. لذلك نحجّم: نثبّت العرض الأقصى وننزل التناسب. والمقايضة: عرض كبير يعني تفصيلًا أدق لكن أسطرًا طويلة، وعرض صغير يعني تقريبًا خشنًا لكن وضوحًا.',
          en: 'In the book\u2019s real data gmail.com sent 7339 messages and ox.ac.uk far fewer — a bar with one character per message would run thousands of characters wide, off the screen and out of the file. So we scale: fix a maximum width and let proportionality descend from it. The trade-off: a wide bar means finer detail but longer lines; a narrow bar means coarse rounding but clarity.',
        },
        {
          ar: 'واحذر حافة التقريب: int تقصّ — قيمة صغيرة جدًا على عرض صغير قد تعطي شريطًا فارغًا مع رقم 1 في نهايته. هذا صادق لا مخل: السطر يظل يعلن قيمته. أما عروض d3 وغيمات الكلمات في الكتاب فتستهلك البيانات نفسها في متصفح — نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية، وأشرطةنا النصية هي معاينته الصادقة.',
          en: 'And mind the rounding edge: int truncates — a very small value on a narrow width may yield an empty bar with a 1 at the end. That is honest, not wrong: the line still announces its value. The book\u2019s d3 charts and word clouds consume the same data in a browser — we generate the chart data here; the rendering happens in an external tool, and our text bars are its honest preview.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نبني draw_bars معًا', en: 'We build draw_bars together' },
      code: "def draw_bars(pairs, width):\n    biggest = 0\n    for name, value in pairs:\n        if value > biggest:\n            biggest = value\n    for name, value in pairs:\n        ticks = int(width * value / biggest)\n        print('%s | %s %d' % (name, '#' * ticks, value))\n\ncounts = {'gmail.com': 8, 'umich.edu': 6, 'uct.ac.za': 4, 'indiana.edu': 2}\nranked = []\nfor name, value in counts.items():\n    ranked.append((value, name))\nranked.sort(reverse=True)\nordered = []\nfor value, name in ranked:\n    ordered.append((name, value))\ndraw_bars(ordered, 12)",
      explanation: {
        ar: 'الدالة حلقتان: الأولى تبحث عن أكبر قيمة، والثانية تطبع كل سطر بعرض محجوم. قبلها رتبنا بـ DSU: items يعطي (اسم، قيمة) فنقلبها إلى (قيمة، اسم) ونرتب تنازليًّا — [(8, gmail.com), (6, umich.edu), (4, uct.ac.za), (2, indiana.edu)] — ثم نعيد الوجه. الخرج يقرأ كالسلّم: gmail.com | ############ 8 ثم ######### 6 ثم ###### 4 ثم ### 2 — نسب 12 و9 و6 و3 كلها صحيحة قسمةً.',
        en: 'The function has two loops: the first hunts the biggest value, the second prints each line at scaled width. Before it we ranked with DSU: items yields (name, value), we flip to (value, name) and sort descending — [(8, gmail.com), (6, umich.edu), (4, uct.ac.za), (2, indiana.edu)] — then flip back. The output reads as a staircase: gmail.com | ############ 8 then ######### 6, then ###### 4, then ### 2 — proportions 12, 9, 6, 3, all exact divisions.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.bars-write',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'القاموس counts معطى في المحرر بثلاث مؤسسات. اكتب دالة draw_bars(pairs, width) كما في المثال: حلقة تجد أكبر قيمة، وحلقة تطبع لكل زوج سطر %s | %s %d بطول شريط int(width * value / biggest). ثم رتّب القاموس تنازليًّا بفكّ DSU (قيمة، اسم) واعكس الوجه، واستدعِ draw_bars بالعرض 8. المتوقع بالترتيب: gmail.com | ######## 4 ثم umich.edu | #### 2 ثم uct.ac.za | ## 1.',
        en: 'The dict counts is given in the editor with three organizations. Write a draw_bars(pairs, width) function as in the example: a loop finds the biggest value, and a loop prints each pair as a %s | %s %d line with bar length int(width * value / biggest). Then rank the dict descending with DSU (value, name) unpacking, flip back, and call draw_bars with width 8. Expected in order: gmail.com | ######## 4, then umich.edu | #### 2, then uct.ac.za | ## 1.',
      },
      starterCode: "counts = {'gmail.com': 4, 'umich.edu': 2, 'uct.ac.za': 1}\n\ndef draw_bars(pairs, width):\n    # حلقة تجد biggest ثم حلقة تطبع %s | %s %d بطول int(width * value / biggest)\n    pass\n\n# رتّب بـ DSU: (value, name) ثم sort(reverse=True) ثم اعكس الوجه\n# واستدعِ draw_bars(ordered, 8)\n",
      solution: "counts = {'gmail.com': 4, 'umich.edu': 2, 'uct.ac.za': 1}\n\ndef draw_bars(pairs, width):\n    biggest = 0\n    for name, value in pairs:\n        if value > biggest:\n            biggest = value\n    for name, value in pairs:\n        ticks = int(width * value / biggest)\n        print('%s | %s %d' % (name, '#' * ticks, value))\n\nranked = []\nfor name, value in counts.items():\n    ranked.append((value, name))\nranked.sort(reverse=True)\nordered = []\nfor value, name in ranked:\n    ordered.append((name, value))\ndraw_bars(ordered, 8)",
      tests: [
        {
          id: 't1',
          name: { ar: 'شريط المؤسسة الأولى بعرض كامل', en: 'The top organization takes the full width' },
          code: "assert 'gmail.com | ######## 4' in __learner_output__, 'expected: gmail.com | ######## 4 | actual: %r' % __learner_output__",
          expected: 'gmail.com | ######## 4',
        },
        {
          id: 't2',
          name: { ar: 'شريط الوسط منصف', en: 'The middle bar is fair' },
          code: "assert 'umich.edu | #### 2' in __learner_output__, 'expected: umich.edu | #### 2 | actual: %r' % __learner_output__",
          expected: 'umich.edu | #### 2',
        },
        {
          id: 't3',
          name: { ar: 'أصغر قيمة بشريطها الصغير', en: 'The smallest value keeps its small bar' },
          code: "assert 'uct.ac.za | ## 1' in __learner_output__, 'expected: uct.ac.za | ## 1 | actual: %r' % __learner_output__",
          expected: 'uct.ac.za | ## 1',
        },
        {
          id: 't4',
          name: { ar: 'الترتيب تنازلي في الخرج', en: 'The output order is descending' },
          code: "o = __learner_output__\nassert o.find('gmail.com') < o.find('umich.edu') < o.find('uct.ac.za'), 'expected: gmail.com before umich.edu before uct.ac.za | actual: %r' % o",
          expected: 'gmail.com before umich.edu before uct.ac.za',
        },
      ],
      hints: [
        { ar: 'انسخ هيكل worked: biggest = 0 وحلقة ترفع Biggest عند كل قيمة أكبر.', en: 'Copy the worked skeleton: biggest = 0 and a loop raising it at every larger value.' },
        { ar: 'سطر الطباعة: print(\'%s | %s %d\' % (name, \u2019#\u2019 * ticks, value)) — وticks = int(width * value / biggest).', en: "The print line: print('%s | %s %d' % (name, '#' * ticks, value)) — with ticks = int(width * value / biggest)." },
        { ar: 'الترتيب: ranked تجمع (value, name) من counts.items() ثم sort(reverse=True) ثم حلقة تعكس إلى (name, value).', en: 'The ranking: ranked collects (value, name) from counts.items(), then sort(reverse=True), then a loop flips to (name, value).' },
        { ar: 'الاستدعاء الأخير: draw_bars(ordered, 8) — والخرج ثلاثة أسطر بالترتيب المطلوب.', en: 'The final call: draw_bars(ordered, 8) — three output lines in the required order.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-bars',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "def draw_bars(pairs, width):\n    biggest = 0\n    for name, value in pairs:\n        if value > biggest:\n            biggest = value\n    for name, value in pairs:\n        ticks = int(width * value / biggest)\n        print('%s | %s %d' % (name, '#' * ticks, value))\n\ndraw_bars([('x', 4), ('y', 2)], 8)\ndraw_bars([('a', 1), ('b', 4)], 8)",
      solution: 'x | ######## 4\ny | #### 2\na | ## 1\nb | ######## 4',
      answer: 'x | ######## 4\ny | #### 2\na | ## 1\nb | ######## 4',
      hints: [
        { ar: 'كل استدعاء يحسب biggest من أزواجه هو — فالاستدعاءان مستقلان.', en: 'Each call computes biggest from its own pairs — the two calls are independent.' },
        { ar: 'في الأول: 8*4/4 = 8 محارف لـ x و8*2/4 = 4 لـ y.', en: 'In the first: 8*4/4 = 8 characters for x and 8*2/4 = 4 for y.' },
        { ar: 'في الثاني: a قيمتها 1 على أكبر قيمة 4 فتأخذ int(8*1/4) = 2 — والترتيب كما أعطيته الدالة لا فرز.', en: 'In the second: a holds 1 against the biggest 4 so it takes int(8*1/4) = 2 — and the order is the one you handed the function, no sorting.' },
        { ar: 'الخرْج:\nx | ######## 4\ny | #### 2\na | ## 1\nb | ######## 4', en: 'The output:\nx | ######## 4\ny | #### 2\na | ## 1\nb | ######## 4' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.numeric-width',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: في draw_bars أعطينا width تساوي 12 وبيانات أكبر قيمة فيها 4 — كم محرفًا سيطبع شريط أكبر قيمة؟',
        en: 'Without running: in draw_bars we pass width 12 and the data has a biggest value of 4 — how many characters will the biggest bar print?',
      },
      answer: '12',
      solution: '12',
      tolerance: 0,
      hints: [
        { ar: 'ticks = int(width * value / biggest) — وعند أكبر قيمة تنهار الكسور.', en: 'ticks = int(width * value / biggest) — at the biggest value the fractions collapse.' },
        { ar: 'width * value / biggest = 12 * 4 / 4 — وint لا تغير العدد الصحيح.', en: 'width * value / biggest = 12 * 4 / 4 — and int leaves a whole number untouched.' },
        { ar: 'أكبر شريط يمتد دائمًا العرض المختار كاملًا.', en: 'The biggest bar always spans the full chosen width.' },
        { ar: 'الجواب: 12', en: 'Answer: 12' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.mcq-scale',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا نحجّم الأشرطة على عرض ثابت بدل محرف واحد لكل وحدة في البيانات؟',
        en: 'Why do we scale bars to a fixed width instead of one character per unit in the data?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن القيم الحقيقية كبيرة — محرف لكل رسالة يعني آلاف المحارف في سطر يتجاوز الشاشة؛ والتحجيم يحفظ النسبة ويحد العرض', en: 'Because real values are big — a character per message means thousands of characters per line, off the screen; scaling keeps the proportion and caps the width' } },
        { id: 'b', text: { ar: 'لأن التحجيم يجعل كل الأشرطة متساوية فيجمل التقرير', en: 'Because scaling makes all bars equal, prettifying the report' } },
        { id: 'c', text: { ar: 'لأن int لا تعمل على الأعداد الكبيرة', en: 'Because int does not work on large numbers' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'تذكّر gmail.com بـ 7339 رسالة في بيانات الكتاب.', en: 'Recall gmail.com with 7339 messages in the book\u2019s data.' },
        { ar: 'النسبة تبقى: من يملك الضعف يملك ضعف الشريط — لكن في عرض محدود.', en: 'The ratio survives: double the value, double the bar — but inside a bounded width.' },
        { ar: 'والمقايضة معلومة: عرض أكبر دقة أكبر وأسطر أطول.', en: 'And the trade-off is known: wider means more precise but longer lines.' },
        { ar: 'الجواب: أ — التحجيم يحفظ التناسب ويجعل السطر قابلًا للعرض.', en: 'Answer: a — scaling keeps the proportion and makes lines displayable.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — استوديو الأشرطة\n# Your playground — the bar studio\n\ndef draw_bars(pairs, width):\n    biggest = 0\n    for name, value in pairs:\n        if value > biggest:\n            biggest = value\n    for name, value in pairs:\n        ticks = int(width * value / biggest)\n        print(\"%s | %s %d\" % (name, \"#\" * ticks, value))\n\nhours = {\"09\": 6, \"10\": 4, \"11\": 1}\npairs = []\nfor hour in sorted(hours):\n    pairs.append((\"hour \" + hour, hours[hour]))\ndraw_bars(pairs, 10)\n\n# جرّب: غيّر العرض من 10 إلى 40 ثم إلى 2 — متى يختفي شريط القيمة 1؟ / try: change the width from 10 to 40 then to 2 — when does the bar of value 1 vanish?\n# جرّب: أضف ساعة جديدة بقيمة كبيرة وراقب انكماش البقية / try: add a new hour with a big value and watch the rest shrink\n# جرّب: أعط الدالة أزواجًا غير مرتبة — هل ترتبها؟ / try: hand the function unsorted pairs — does it sort them?',
      prompt: {
        ar: 'جرّب بنفسك: مدرج ساعات يومي بصري. وسّع العرض إلى 40 ثم اقبضه إلى 2 وراقب متى تختفي القيمة الصغيرة تحت التقريب. أضف ساعة بيانات كاسحة وراقب كيف تضغط البقية. ثم أعط الدالة أزواجًا بلا ترتيب — من المسؤول عن الترتيب؟ لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: a daily hour histogram in the visual. Stretch the width to 40 then squeeze it to 2 and watch when the small value disappears under rounding. Add a sweeping hour and watch the rest compress. Then hand the function unsorted pairs — who is responsible for order? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل السادس: ماذا يعيد \u2019#\u2019 * 3؟',
            en: 'From chapter 6: what does \u2019#\u2019 * 3 return?',
          },
          options: [
            { id: 'a', text: { ar: '### — النص مكرر ثلاث مرات في سلسلة جديدة', en: '### — the text repeated three times into a new string' } },
            { id: 'b', text: { ar: 'خطأ TypeError — لأن ضرب النص غير معرّف', en: 'A TypeError — multiplying text is undefined' } },
            { id: 'c', text: { ar: '9 — لأن # قيمتها ثلاثة', en: '9 — because # is worth three' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'ضرب سلسلة في عدد صحيح يكررها — وهذا هو محرك أشرطةنا كلها: \u2019#\u2019 * ticks يرسم القيمة.',
            en: 'Multiplying a string by an integer repeats it — and that is the engine of all our bars: \u2019#\u2019 * ticks draws the value.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثامن: في ranked قائمة أزواج (value, name) — ماذا يفعل ranked.sort(reverse=True)؟',
            en: 'From chapter 8: ranked is a list of (value, name) pairs — what does ranked.sort(reverse=True) do?',
          },
          options: [
            { id: 'a', text: { ar: 'يرتب القائمة في مكانها من الأكبر إلى الأصغر بحسب القيمة أولًا', en: 'Sorts the list in place from biggest to smallest, comparing the value first' } },
            { id: 'b', text: { ar: 'يعكس ترتيب القائمة كما دخلت بلا مقارنة', en: 'Reverses the list\u2019s entry order with no comparison' } },
            { id: 'c', text: { ar: 'يمحو الأزواج المكررة فقط', en: 'Only removes duplicate pairs' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأزواج تقارن بعنصرها الأول فتتصاعد القيم، وreverse يقلب الصعود إلى نزول — فقرأنا السلّم من القمة.',
            en: 'Pairs compare by their first element so values climb, and reverse turns the climb into a descent — so we read the staircase from its peak.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'قيمة 1 على عرض 8 وأكبر قيمة 8 — كم محرفًا في شريطها؟',
            en: 'A value of 1 with width 8 and a biggest value of 8 — how long is its bar?',
          },
          options: [
            { id: 'a', text: { ar: 'محرف واحد: int(8 * 1 / 8) = 1 — أصغر شريط صادق', en: 'One character: int(8 * 1 / 8) = 1 — the smallest honest bar' } },
            { id: 'b', text: { ar: 'ثمانية — لأن العرض كله لها', en: 'Eight — the whole width is hers' } },
            { id: 'c', text: { ar: 'صفر — لأن int تقص دائمًا إلى صفر', en: 'Zero — int always truncates to zero' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القسمة هنا 1 بالضبط فلا تقريب — لكن حذارِ: قيمة 1 على عرض 3 وأكبر قيمة 8 تعطي int(0.375) = 0 شريطًا فارغًا يعلنه الرقم في النهاية.',
            en: 'The division is exactly 1 here, no rounding — but beware: a value of 1 on width 3 against a biggest of 8 gives int(0.375) = 0, an empty bar whose number still announces it.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'في بيانات الكتاب gword.py تحسب تكرار كلمات العناوين ويكتب gword.js ثم يعرض gword.htm غيمة كلمات — ما دورنا في المنصة؟',
            en: 'In the book\u2019s data, gword.py counts subject-word frequencies into gword.js and gword.htm shows a word cloud — what is our platform\u2019s role?',
          },
          options: [
            { id: 'a', text: { ar: 'نتدرب على نفس المرحلة: نحسب التكرارات ونعرضها نصيًّا — والعرض الرسومي في المتصفح أداة خارجية', en: 'We rehearse the same stage: compute the frequencies and render them as text — the graphical display in a browser is an external tool' } },
            { id: 'b', text: { ar: 'نستدعي غوغل لترسم لنا الغيمة', en: 'We call Google to draw the cloud for us' } },
            { id: 'c', text: { ar: 'لا يمكن حساب التكرار إلا في المتصفح', en: 'Frequencies can only be computed in a browser' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الوصفة واحدة: الحساب ثم التسليم. أشرطةنا النصية معاينة صادقة لما سيرسمه المتصفح — والمهارة القابلة للنقل هي الحساب.',
            en: 'One recipe: compute, then deliver. Our text bars are an honest preview of what the browser will draw — and the transferable skill is the computing.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "ticks = width * value / biggest  # بلا int",
          right: "ticks = int(width * value / biggest)",
          note: {
            ar: 'القسمة تعيد عددًا عشريًّا — وضرب نص في 3.5 يرمي TypeError. int تقصّ نحو الصفر فتعطي عدد محارف صحيحًا — وتذكّر حافتها: قيمة صغيرة على عرض صغير قد تسقط إلى شريط فارغ.',
            en: 'Division returns a float — and multiplying text by 3.5 throws TypeError. int truncates toward zero giving a whole character count — and remember its edge: a tiny value on a tiny width may fall to an empty bar.',
          },
        },
        {
          wrong: "def draw_bars(pairs, width):\n    for name, value in pairs:\n        ticks = int(width * value / biggest)  # biggest غير معرفة",
          right: "def draw_bars(pairs, width):\n    biggest = 0\n    for name, value in pairs:\n        if value > biggest:\n            biggest = value\n    for name, value in pairs:",
          note: {
            ar: 'biggest ليست معطاة بل تُكتشف: حلقة أولى تجمعها قبل أي قسمة — وإلا فإما NameError أو قسمة على صفر حين تكون كل القيم صفرًا. ابحث عن الأكبر أولًا دائمًا.',
            en: 'biggest is not given, it is discovered: a first loop collects it before any division — otherwise a NameError, or a division by zero when every value is zero. Always hunt the biggest first.',
          },
        },
        {
          wrong: "print(name, '#' * ticks, value)  # فواصل متغيرة",
          right: "print('%s | %s %d' % (name, '#' * ticks, value))",
          note: {
            ar: 'الفواصل تطبع فراغاتها الخاصة فيتشوه السطر ويصعب مطابقته. قالب ثابت — اسم وفاصل وشريط وقيمة — يجعل كل سطر قابلًا للقراءة والمقارنة والاختبار.',
            en: 'Comma printing injects its own spaces, warping the line and hard to match. A fixed template — name, separator, bar, value — keeps every line readable, comparable and testable.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الشريط النصي سطر ثابت البنية: %s | %s %d — اسم وشريط \u2019#\u2019 * ticks وقيمة، وطول الشريط يتناسب مع القيمة.', en: 'A text bar is a fixed-shape line: %s | %s %d — a name, a \u2019#\u2019 * ticks bar and the value, with bar length proportional to the value.' },
        { ar: 'التحجيم ticks = int(width * value / biggest) يجعل أكبر قيمة تأخذ العرض كاملًا والبقية تناسب — والمقايضة بين الدقة وعرض السطر.', en: 'Scaling ticks = int(width * value / biggest) gives the biggest value the full width and the rest their share — the trade-off between precision and line width.' },
        { ar: 'الترتيب بفكّ DSU من الفصل العاشر ثم draw_bars يطبع السلّم — نولّد بيانات الرسم هنا؛ والعرض الرسومي يحدث في أداة خارجية.', en: 'Ranking with chapter-ten DSU unpacking, then draw_bars prints the staircase — we generate the chart data here; graphical rendering happens in an external tool.' },
      ],
      reflectPrompt: {
        ar: 'لو رسمت تكرار 7339 رسالة لـ gmail.com بلا تحجيم فكم سطرًا ستستهلك؟ ولو حجّمت على عرض 10 فأي معلومة تخسر عن orgs الأصغر؟ اختر عرضًا وأدافع عنه بكلمة واحدة: الدقة أم الوضوح؟',
        en: 'Drawing gmail.com\u2019s 7339 messages unscaled — how much width would it eat? Scaled to width 10, what do you lose about the smaller orgs? Pick a width and defend it in one word: precision or clarity?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch16.s2', pages: 'ص288 / pp.288' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch16.s2', pages: 'ص288 / pp.288' },
  ],
} satisfies Lesson;

export default lesson;
