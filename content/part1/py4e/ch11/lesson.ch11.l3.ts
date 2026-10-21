import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch11.l3 — "Search and Extract Together / البحث والاستخراج معًا"
 * Aligned with PY4E ch11 s3 (تنفيذ عمليتي البحث والاستخراج معًا).
 * All expression is original.
 * Parentheses extraction + the fine-tuned address pattern [a-zA-Z0-9]\S*@\S*[a-zA-Z].
 * Lines embedded as fixed lists (deterministic, no files).
 */
const lesson = {
  id: 'py4e.ch11.l3',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 11,
  title: { ar: 'البحث والاستخراج معًا', en: 'Search and Extract Together' },
  estimatedMinutes: 18,
  prerequisites: ['py4e.ch11.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'حتى الآن عملت الأداتان منفصلتين: search تفحص السطر وتقول موجود، وfindall تحصد كل ما يشبه النمط من أي سطر. لكن أسئلة السجلات الحقيقية تريد الاثنين معًا: لا تعطني أي رقم من أي سطر — أعطني الأرقام من الأسطر التي تشبه "X-DSPAM-Confidence: 0.8475" فقط. بنهاية الدرس ستكون قادرًا على: تركيب نمط يفلتر ويستخرج في خطوة واحدة، وفهم دور الأقواس ( ) في findall، وقراءة النمط المصقول [a-zA-Z0-9]\\S*@\\S*[a-zA-Z]، وتمهيد الطريق لمشروع محلل السجلات.',
        en: 'So far the two tools worked apart: search inspects a line and says present, while findall harvests everything pattern-like from any line. Real log questions want both at once: not any number from any line — the numbers from lines shaped like "X-DSPAM-Confidence: 0.8475" only. By the end of this lesson you will be able to: compose a pattern that filters and extracts in one step, understand the role of parentheses ( ) in findall, read the refined pattern [a-zA-Z0-9]\\S*@\\S*[a-zA-Z], and pave the way to the log-analyzer project.',
      },
    },
    {
      kind: 'predict',
      code: "import re\nline = 'X-DSPAM-Confidence: 0.8475'\nprint(re.findall(r'^X\\S*: ([0-9.]+)', line))\nprint(re.findall(r'^X\\S*: [0-9.]+', line))",
      question: {
        ar: 'الاستدعاءان متطابقان إلا في شيء واحد: قوسان حول الجزء الأخير. كم سيختلف الخرج؟',
        en: 'The two calls are identical except for one thing: parentheses around the last piece. How different will the output be?',
      },
      reveal: {
        ar: "الفرق كامل: بلا أقواس أعادت findall السطر المطابق كله — ['X-DSPAM-Confidence: 0.8475'] — ومع الأقواس أعادت الرقم وحده — ['0.8475']. المطابقة تجري على النمط كله في الحالتين، لكن findall تعيد فقط ما يقع بين الأقواس: الأقواس لا تشارك في المطابقة، بل تختار جزء الاستخراج.",
        en: "The difference is complete: without parentheses findall returned the whole matching line — ['X-DSPAM-Confidence: 0.8475'] — with them it returned the number alone — ['0.8475']. Matching runs over the whole pattern in both cases, but findall hands back only what falls between the parentheses: parentheses take no part in matching, they select the extraction.",
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'العملية المدمجة: فلتر واستخراج في نمط واحد', en: 'The combined operation: filter and extract in one pattern' },
      chunks: [
        {
          ar: 'السطور التي نريدها تحمل شكلًا معروفًا: تبدأ بـ X- ثم محارف غير مسافية حتى نقطتين، ثم فراغ، ثم رقم قد يحوي فاصلة عشرية. النمط ^X\\S*: ([0-9.]+) يكتب الشكل كله: المرساة ^ تقول يبدأ السطر بـ X، و\\S* تقول أي عدد من المحارف غير المسافية حتى النقطتين، ثم فراغ واحد، ثم الفئة [0-9.]+ محصورة بأقواس. عندئذ ينجز findall وحدها ما كنا نصنعه بشرطين منفصلين: ترفض السطر غير المطابق إذ تعيد قائمة فارغة، وتستخرج من المطابق جزءه المطلوب.',
          en: 'The lines we want carry a known shape: they start with X-, then non-space characters up to a colon, then a blank, then a number that may hold a decimal point. The pattern ^X\\S*: ([0-9.]+) writes the whole shape: the anchor ^ says the line starts with X, \\S* says any run of non-space characters up to the colon, then a single blank, then the class [0-9.]+ wrapped in parentheses. findall alone now does what we used to hand-assemble with two separate checks: it refuses the non-matching line by returning an empty list, and pulls the wanted piece from the matching one.',
        },
        {
          ar: 'وهكذا تصبح حلقة البرنامج قصيرة ونظيفة: x = re.findall(r"^X\\S*: ([0-9.]+)", line) ثم if len(x) > 0: فهناك السطر من النوع المطلوب وx[0] هو رقمه كسلسلة. تذكّر أن الرقم المستخرج سلسلة نصية — قبل الجمع والحساب ستحتاج float(x[0]) من الفصل الخامس.',
          en: 'So the program loop stays short and clean: x = re.findall(r"^X\\S*: ([0-9.]+)", line), then if len(x) > 0: the line is of the wanted kind and x[0] is its number as a string. Remember the extracted number is a string — before summing or computing you will need float(x[0]) from chapter 5.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الفئة [0-9.] وضوابط الدقة', en: 'The class [0-9.] and precision knobs' },
      chunks: [
        {
          ar: 'داخل الأقواس المربعة تجتمع المحارف المقبولة: [0-9] أي رقم، والنقطة داخل الفئة نقطة حقيقية لا رمز أي-محرف — لذلك صارت [0-9.] تصف الرقم العشري: خانات ونقطة. و+ خلف الفئة تعني محرفًا أو أكثر منها، ولذا أمسكت 0.8475 كاملة. أما خارج الفئة فالنقطة رمز خاص كما سترى لاحقًا — تذكّر هذه الحماية: القوس المربع ملجأ المحارف الخاصة.',
          en: 'Inside square brackets the accepted characters gather: [0-9] any digit, and a dot inside a class is a real dot, not the any-character symbol — that is how [0-9.] describes a decimal number: digits and a dot. And + after the class means one or more of them, which is how it grabbed all of 0.8475. Outside the class the dot is a special symbol as you will see later — remember this protection: the square bracket is the refuge of special characters.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط البريد المصقول', en: 'The refined address pattern' },
      chunks: [
        {
          ar: 'عادت شوائب الدرس الماضي: <postmaster@collab.sakaiproject.org> حملت قوسين وsource@collab.sakaiproject.org>; حملت فاصلة منقوطة. العلاج الكتابي: نطلب أن يبدأ المطابقة بمحرف أو رقم — الفئة [a-zA-Z0-9] — وأن ينتهي بمحرف كذلك: [a-zA-Z0-9]\\S*@\\S*[a-zA-Z]. ولاحظ التحول من + إلى *: المحرف الأول في كل طرف مضمون بالفئة نفسها، فبقي لـ * أن تمدد صفرًا أو أكثر. حين وُضّع هذا النمط في البرنامج سقطت القواقع وسلمت العناوين نظيفة — وهذه النظرة العابرة للفئات كافية اليوم، والدرس القادم يعمّقها.',
          en: 'Last lesson\u2019s junk came back: <postmaster@collab.sakaiproject.org> carried brackets and source@collab.sakaiproject.org>; a semicolon. The book\u2019s cure: demand that the match begin with a letter or digit — the class [a-zA-Z0-9] — and end with one too: [a-zA-Z0-9]\\S*@\\S*[a-zA-Z]. Notice the shift from + to *: the first character at each end is guaranteed by the class itself, leaving * to stretch zero-or-more. When this pattern ran in the program the shells fell off and the addresses arrived clean — this passing glance at classes suffices today; next lesson deepens it.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'أسطر X-DSPAM: فلترة واستخراج دفعة واحدة', en: 'X-DSPAM lines: filtering and extraction in one pass' },
      code: "import re\nlines = [\n    'X-DSPAM-Confidence: 0.8475',\n    'X-DSPAM-Probability: 0.0000',\n    'X-DSPAM-Confidence: 0.6178',\n    'X-DSPAM-Probability: 0.0000',\n    'X-DSPAM-Confidence: 0.6961',\n    'X-DSPAM-Probability: 0.0000',\n]\nfor line in lines:\n    line = line.rstrip()\n    x = re.findall(r'^X\\S*: ([0-9.]+)', line)\n    if len(x) > 0:\n        print(x)",
      explanation: {
        ar: 'ستة أسطر دخلت الحلقة وستة أرقام خرجت — بلا أي شرط إضافي: النمط نفسه فاض السطر المناسب ورفض غيره ثم استخرج رقمه. خرجت 0.8475 و0.6178 و0.6961 من الثقة و0.0000 من الاحتمال لأن كلا الترويستين تبدأ بـ X- وتنتهي بنمط رقم. الأرقام في يديك الآن كسلاسل جاهزة للتحويل — وفي مشروع نهاية الفصل ستجمعها وتحسب متوسطها.',
        en: 'Six lines entered the loop and six numbers came out — with no extra condition: the pattern itself flooded through the fitting line, refused the others, then extracted each number. 0.8475, 0.6178 and 0.6961 came from confidence and 0.0000 from probability, because both headers start with X- and end with a number. The numbers are now yours as strings ready for conversion — and in the end-of-chapter project you will sum them and compute their average.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.extract-sum',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "الأسطر معطاة في المحرر وفيها سطر لا ينتمي للفئة. في حلقة for استخرج من كل سطر الرقم بالتابع re.findall بالنمط r'^X\\S*: ([0-9.]+)'؛ فإن وُجدت مطابقة اطبعها ثم زد total بـ float(x[0]) وزد count واحدًا؛ وإن لم وُجد فسيتخطاه النمط وحده. بعد الحلقة اطبع count ثم اطبع total بتنسيق '%.4f'. المتوقع: 0.8475 ثم 0.6178 ثم 2 ثم 1.4653.",
        en: "The lines are given in the editor, one of them not of our kind. In a for loop, extract each line\u2019s number with re.findall and the pattern r'^X\\S*: ([0-9.]+)'; if a match exists print it, then add float(x[0]) to total and raise count by one; if not, the pattern alone skips it. After the loop print count, then print total formatted as '%.4f'. Expected: 0.8475, then 0.6178, then 2, then 1.4653.",
      },
      starterCode: "lines = ['X-DSPAM-Confidence: 0.8475', 'Subject: Update now', 'X-DSPAM-Confidence: 0.6178']\nimport re\ntotal = 0.0\ncount = 0\n# حلقة: استخرج، اطبع، اجمع بـ float، عدّ / loop: extract, print, sum with float, count\n",
      solution: "import re\nlines = ['X-DSPAM-Confidence: 0.8475', 'Subject: Update now', 'X-DSPAM-Confidence: 0.6178']\ntotal = 0.0\ncount = 0\nfor line in lines:\n    x = re.findall(r'^X\\S*: ([0-9.]+)', line)\n    if len(x) > 0:\n        print(x[0])\n        total = total + float(x[0])\n        count = count + 1\nprint(count)\nprint('%.4f' % total)",
      tests: [
        {
          id: 't1',
          name: { ar: 'سطرا الثقة فقط دخلوا العدّ', en: 'Only the two confidence lines entered the count' },
          code: "assert count == 2, 'expected: count 2 | actual: %r' % (count,)",
          expected: 'count 2',
        },
        {
          id: 't2',
          name: { ar: 'المجموع 1.4653', en: 'The total is 1.4653' },
          code: "assert abs(total - 1.4653) < 0.0001, 'expected: total 1.4653 | actual: %r' % (total,)",
          expected: 'total 1.4653',
        },
        {
          id: 't3',
          name: { ar: 'سطر Subject استبعد ولا يظهر', en: 'The Subject line is excluded and never printed' },
          code: "assert 'Subject' not in __learner_output__ and '0.6178' in __learner_output__ and '0.8475' in __learner_output__, ('expected: 0.8475 and 0.6178 without Subject | actual: %r' % __learner_output__)",
          expected: '0.8475 and 0.6178 without Subject',
        },
      ],
      hints: [
        { ar: 'الأقواس في النمط هي سر الاستخراج: بلاها ستحصل على السطر كله ويفشل float.', en: 'The parentheses in the pattern are the extraction secret: without them you get the whole line and float fails.' },
        { ar: 'التحويل قبل الجمع: total = total + float(x[0]) — وإلا جمعت سلاسل.', en: 'Convert before summing: total = total + float(x[0]) — or you sum strings.' },
        { ar: "الهيكل:\nfor line in lines:\n    x = re.findall(r'^X\\S*: ([0-9.]+)', line)\n    if len(x) > 0:\n        print(x[0])\n        total = total + float(x[0])\n        count = count + 1\nprint(count)\nprint('%.4f' % total)", en: "The skeleton:\nfor line in lines:\n    x = re.findall(r'^X\\S*: ([0-9.]+)', line)\n    if len(x) > 0:\n        print(x[0])\n        total = total + float(x[0])\n        count = count + 1\nprint(count)\nprint('%.4f' % total)" },
        { ar: "import re\nfor line in lines:\n    x = re.findall(r'^X\\S*: ([0-9.]+)', line)\n    if len(x) > 0:\n        print(x[0])\n        total = total + float(x[0])\n        count = count + 1\nprint(count)\nprint('%.4f' % total)", en: "import re\nfor line in lines:\n    x = re.findall(r'^X\\S*: ([0-9.]+)', line)\n    if len(x) > 0:\n        print(x[0])\n        total = total + float(x[0])\n        count = count + 1\nprint(count)\nprint('%.4f' % total)" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-combined',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import re\nlines = ['X-Spam: 5', 'X-DSPAM-Confidence: 0.8475', 'Subject: Update now']\ntotal = 0\nfor line in lines:\n    x = re.findall(r'^X\\S*: ([0-9.]+)', line)\n    if len(x) > 0:\n        total = total + 1\nprint(total)\nprint(re.findall(r'^X\\S*: ([0-9.]+)', 'X-DSPAM-Confidence: 0.8475')[0])",
      solution: '2\n0.8475',
      answer: '2\n0.8475',
      hints: [
        { ar: 'من الأسطر الثلاثة: أيها يطابق ^X\\S*: ثم فراغًا ثم رقمًا؟', en: 'Of the three lines: which match ^X\\S*: then a blank then a number?' },
        { ar: 'X-Spam: 5 يطابق — الرقم 5 رقم. أما Subject فلا يبدأ بـ X أصلًا.', en: 'X-Spam: 5 matches — the 5 is a number. Subject does not even start with X.' },
        { ar: 'الاستدعاء الأخير مستقل عن الحلقة — يستخرج من سطر الثقة الرقم بين القوسين.', en: 'The last call stands alone from the loop — it extracts the parenthesized number from the confidence line.' },
        { ar: 'الخرْج:\n2\n0.8475', en: 'The output:\n2\n0.8475' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-parens',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا تفعل الأقواس ( ) داخل التعبير النمطي حين تُستخدم مع findall؟',
        en: 'What do parentheses ( ) inside a regular expression do when used with findall?',
      },
      options: [
        { id: 'a', text: { ar: 'تحدد الجزء الذي سيُعاد من المطابقة — والنمط كله يبقى مسؤولًا عن التصفية', en: 'Mark the part of the match to be returned — the whole pattern still does the filtering' } },
        { id: 'b', text: { ar: 'تجعل الجزء الذي تحيط به اختياريًا', en: 'Make the part they surround optional' } },
        { id: 'c', text: { ar: 'تطابق قوسين حرفيين في السطر', en: 'Match two literal parentheses in the line' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'راجع predict: النمطان طابقا السطر نفسه — ما تغيّر هو العائد.', en: 'Revisit the prediction: both patterns matched the same line — only the return changed.' },
        { ar: 'الكتاب يقولها: لا يهتمون بمطابقة كل التعبير بل باستخراج جزء محدد.', en: 'The book says it: they care not for matching the whole expression but for extracting a chosen part.' },
        { ar: 'فاستخراج 0.8475 من سطر كامل كان بفضل [0-9.]+ المحصورة بالقوسين.', en: 'Extracting 0.8475 from the whole line happened thanks to [0-9.]+ wrapped in the two parens.' },
        { ar: 'الجواب: تحدد الجزء الذي سيُعاد من المطابقة.', en: 'Answer: they mark the part of the match to be returned.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-group',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: بعد استدعاء re.search نستدعي ____() على كائن المطابقة لسحب النص المطابق كسلسلة.',
        en: 'Fill the blank with one word: after calling re.search we call ____() on the match object to pull the matched text as a string.',
      },
      answer: 'group',
      solution: 'group',
      hints: [
        { ar: 'كائن المطابقة يحمل النص داخله — وهذا التابع يخرجه كمجموعة.', en: 'The match object holds the text inside — this method draws it out as a group.' },
        { ar: 'في الدرس الماضي استعملناه هكذا: re.search(...).group().', en: 'Last lesson we used it like this: re.search(...).group().' },
        { ar: 'خمسة أحرف وتبدأ بـ g.', en: 'Five letters and starts with g.' },
        { ar: 'الجواب: group', en: 'Answer: group' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — نمط واحد ثلاثة ألغاز\n# Your playground — one pattern, three riddles\n\nimport re\n\nlines = [\n    "X-DSPAM-Confidence: 0.8475",\n    "X-Plane-Speed: 2.5 mach",\n    "Received: from X-Fake: 9.9",\n]\nfor line in lines:\n    print(re.findall(r"^X\\S*: ([0-9.]+)", line))\nprint("--- now break it ---")\nprint(re.findall(r"^X\\S*:([0-9.]+)", "X-DSPAM-Confidence: 0.8475"))\nprint(re.findall(r"^X\\S*: [0-9.]+", "X-DSPAM-Confidence: 0.8475"))\nprint(re.findall(r"X\\S*: ([0-9.]+)", "Received: from X-Fake: 9.9"))',
      prompt: {
        ar: 'جرّب بنفسك: احذف الفراغ بعد النقطتين وراقب القوائم الفارغة الصامتة، واحذف المرساة ^ وشاهد X-Fake: 9.9 يتسلل من وسط سطر آخر، واحذف الأقواس لترى السطر كله يعود. كل انكسار يعلّم. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: delete the blank after the colon and watch the silent empty lists; drop the anchor ^ and see X-Fake: 9.9 sneak in from mid-line; remove the parentheses to watch the whole line return. Every break teaches. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في النمط ^X\\S*: ([0-9.]+) — ماذا يطابق \\S* بالضبط؟',
            en: 'In the pattern ^X\\S*: ([0-9.]+) — what exactly does \\S* match?',
          },
          options: [
            { id: 'a', text: { ar: 'أي عدد من المحارف غير المسافية — فيغطي DSPAM-Confidence كله', en: 'Any number of non-space characters — covering all of DSPAM-Confidence' } },
            { id: 'b', text: { ar: 'فراغًا واحدًا بالضبط', en: 'Exactly one blank space' } },
            { id: 'c', text: { ar: 'أرقامًا فقط', en: 'Digits only' } },
          ],
          answer: 'a',
          explanation: {
            ar: '\\S أي محرف ليس مسافة، و* صفر أو أكثر — لذلك التفاف X- إلى النقطتين يمر عبر DSPAM-Confidence كلها حتى يصطدم بالفراغ الذي يلي النقطتين.',
            en: '\\S is any non-space character and * is zero-or-more — so the run from X- to the colon sweeps through all of DSPAM-Confidence until it hits the blank after the colon.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل التاسع: بعد استخراج قيم كثيرة أردت عدّ تكرار كل قيمة — أي سطر يفعلها؟',
            en: 'From chapter 9: after extracting many values you want to count how often each occurs — which line does it?',
          },
          options: [
            { id: 'a', text: { ar: 'counts[v] = counts.get(v, 0) + 1', en: 'counts[v] = counts.get(v, 0) + 1' } },
            { id: 'b', text: { ar: 'counts.append(v)', en: 'counts.append(v)' } },
            { id: 'c', text: { ar: 'counts = counts + v', en: 'counts = counts + v' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القاموس مع get هو عدّاد القيم: مفتاح لكل قيمة وقيمة لكل تكرار — نفس العدّاد الذي أحصى كلمات romeo يستقبل الآن أرقام الثقة.',
            en: 'The dictionary with get is the value counter: a key per value and a value per occurrence — the same counter that tallied romeo\u2019s words now receives confidence numbers.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل السابع: عند القراءة من ملف حقيقي، لماذا نكتب line = line.rstrip() قبل findall؟',
            en: 'From chapter 7: when reading from a real file, why write line = line.rstrip() before findall?',
          },
          options: [
            { id: 'a', text: { ar: 'لحذف \\n من نهاية السطر قبل أي مطابقة', en: 'To strip \\n from the line end before any matching' } },
            { id: 'b', text: { ar: 'لأن findall لا تعمل إلا على أسطر قصيرة', en: 'Because findall only works on short lines' } },
            { id: 'c', text: { ar: 'لتحويل السطر إلى رقم', en: 'To convert the line to a number' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كل سطر مقروء يصل محملًا محرف السطر الجديد — ونحن ننظفه عادةً منذ أول حلقة ملفات، وهنا لن يفسد المطابقة لكن النظافة عادة لا كسل.',
            en: 'Every read line arrives carrying the newline character — we clean it by habit since the first file loop; here it would not break the match, but cleaning is a habit, not laziness.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'النمط ^Details:.*rev=([0-9.]+) على السطر "Details: http://source.sakaiproject.org/viewsvn/?view=rev&rev=39772" — ماذا يستخرج؟',
            en: 'The pattern ^Details:.*rev=([0-9.]+) on the line "Details: http://source.sakaiproject.org/viewsvn/?view=rev&rev=39772" — what does it extract?',
          },
          options: [
            { id: 'a', text: { ar: "['39772'] — الرقم بعد آخر rev=", en: "['39772'] — the number after the last rev=" } },
            { id: 'b', text: { ar: "['Details:'] — كلمة البداية", en: "['Details:'] — the opening word" } },
            { id: 'c', text: { ar: 'السطر كله', en: 'The whole line' } },
          ],
          answer: 'a',
          explanation: {
            ar: '.* الطموحة تمسح حتى rev= الأخيرة ثم [0-9.]+ المحصورة بالأقواس تُعاد وحدها — نفس تقنية أسطر الثقة على شكل آخر.',
            en: 'Greedy .* sweeps up to the last rev=, then the parenthesized [0-9.]+ is returned alone — the same confidence-line technique in another costume.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "x = re.findall(r'^X\\S*:([0-9.]+)', line)",
          right: "x = re.findall(r'^X\\S*: ([0-9.]+)', line)",
          note: {
            ar: 'الفراغ بعد النقطتين جزء من الشكل الحقيقي للسطر: "Confidence: 0.8475" فيها فراغ — فالنمط الملتصق يعيد [] بصمت ولا يرمي شيئًا. النسخ الحرفي للشكل واجب.',
            en: 'The blank after the colon is part of the line\u2019s true shape: "Confidence: 0.8475" holds a space — the glued pattern silently returns [] and throws nothing. Copying the shape literally is a duty.',
          },
        },
        {
          wrong: "x = re.findall(r'^X\\S*: [0-9.]+', line)\nvalue = float(x[0])",
          right: "x = re.findall(r'^X\\S*: ([0-9.]+)', line)\nvalue = float(x[0])",
          note: {
            ar: 'بلا أقواس تعيد findall السطر المطابق كله، وfloat("X-DSPAM-Confidence: 0.8475") ترمي ValueError: could not convert string to float. القوسان يقتصّان الرقم وحده.',
            en: 'Without parentheses findall returns the whole matching line, and float("X-DSPAM-Confidence: 0.8475") throws ValueError: could not convert string to float. The two parens carve out the number alone.',
          },
        },
        {
          wrong: "total = 0\ntotal = total + x[0]",
          right: "total = 0.0\ntotal = total + float(x[0])",
          note: {
            ar: 'x[0] سلسلة "0.8475" لا رقم: جمعها بعداد يرمي TypeError: unsupported operand type(s). حوّل بـ float ثم اجمع — التحويل في موضع الاستعمال لا في موضع الاستخراج.',
            en: 'x[0] is the string "0.8475", not a number: adding it to a counter throws TypeError: unsupported operand type(s). Convert with float, then sum — conversion belongs at the point of use, not extraction.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'النمط ^X\\S*: ([0-9.]+) يلتمس الأسطر المشكّلة ويستخرج رقمها — البحث والاستخراج في خطوة واحدة.', en: 'The pattern ^X\\S*: ([0-9.]+) hunts the well-shaped lines and extracts their number — search and extract in one step.' },
        { ar: 'الأقواس لا تشارك في المطابقة: تختار ما تعيد findall — بلاها يعاد السطر كله.', en: 'Parentheses take no part in matching: they choose what findall returns — without them the whole line comes back.' },
        { ar: 'الفئة [0-9.] تصف أرقامًا عشرية — وداخل الأقواس المربعة كل المحارف حرفية ومنها النقطة.', en: 'The class [0-9.] describes decimal numbers — inside square brackets every character is literal, dot included.' },
        { ar: 'النمط المصقول [a-zA-Z0-9]\\S*@\\S*[a-zA-Z] يبدأ وينتهي بحرف أو رقم فيسقط الشوائب < و; من العناوين.', en: 'The refined pattern [a-zA-Z0-9]\\S*@\\S*[a-zA-Z] starts and ends with a letter or digit, dropping the < and ; junk from addresses.' },
      ],
      reflectPrompt: {
        ar: 'لو كان السجل يحوي أسطر "X-Time-Delay: 0.42" و"X-Score: 91" — هل يخدمها النمط نفسه؟ اكتب نمطًا واحدًا يجمع الثلاثة، ونمطًا آخر يحصر الثقة وحدها — وأيهما تحتاج فعلًا؟',
        en: 'If the log held "X-Time-Delay: 0.42" and "X-Score: 91" lines — would the same pattern serve them? Write one pattern embracing all three, and another pinning confidence alone — which do you actually need?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch11.s3', pages: 'ص178 / pp.178' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch11.s3', pages: 'ص178 / pp.178' },
  ],
} satisfies Lesson;

export default lesson;
