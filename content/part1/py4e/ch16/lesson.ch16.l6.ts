import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch16.l6 — "Chapter 16 Review and Project: The Mail Data Dashboard /
 * مراجعة الفصل 16 ومشروع: لوحة البيانات البريدية"
 * Aligned with PY4E ch16 s3 (تحليل وعرض البيانات الواردة بريديًا). The
 * chapter has no glossary section, so the glossary chunks are built from the
 * chapter's own terms (geodata / latitude / longitude / node / link / degree
 * / histogram / timeline).
 * All expression is original.
 * PROJECT: a SELF-CONTAINED mail dashboard — embedded mbox-like lines →
 * per-hour histogram AND per-sender counts → ASCII bar report (l4 renderer)
 * + summary lines 'messages: %d' / 'peak hour: %02d' / 'top sender: %s' +
 * one MEMFS write (dashboard-l16.txt, 'w') verified by reading back.
 * DEBUG: the histogram is counted from the WRONG header part (Received:
 * relay timestamps instead of Date:) — it runs and shows a shifted peak
 * (hour 11 instead of 09); the fix re-pins the regex to the Date: header.
 */
const lesson = {
  id: 'py4e.ch16.l6',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 16,
  title: { ar: 'مراجعة الفصل 16 ومشروع: لوحة البيانات البريدية', en: 'Chapter 16 Review and Project: The Mail Data Dashboard' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch16.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'نُغلق كتابنا كله بلوحة تحكم صغيرة تجمع أحدث المهارات وأقدمها: أسطر بريد مضمّنة تُقرأ بتعبير نمطي من الفصل الحادي عشر، وقواميس العدّ من الفصل التاسع، وأشرطة الرسم النصي من درس أمس، وملف يُكتب بوضع w من الفصل السابع ويُقرأ للتحقق. اليوم أيضًا مراجعة الفصل السادس عشر بمصطلحاته الثمانية، ومشروع الختام: لوحة البيانات البريدية — مدرج ساعات وترتيب مرسلين وسطور خلاصة. وتنقيح خلل صامت: عدّ من الترويسة الخطأ. نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية. بنهاية الدرس ستكون قادرًا على: رسم خريطة الفصل كاملة، وبناء لوحة بريدية ذاتية الاكتفاء، وتشخيص ترويسة خاطئة.',
        en: 'We close the whole book with a small dashboard joining the newest skills to the oldest: embedded mail lines read with a chapter-eleven regex, chapter-nine counting dicts, yesterday\u2019s text bars, and a file written in w mode from chapter seven and read back for verification. Today also reviews chapter sixteen with its eight glossary terms, and the closing project: the mail data dashboard — an hour histogram, a sender ranking and summary lines. Plus debugging a silent flaw: counting from the wrong header. We generate the chart data here; the rendering happens in an external tool. By the end of this lesson you will be able to: map the whole chapter, build a self-contained mail dashboard, and diagnose a wrong header.',
      },
    },
    {
      kind: 'predict',
      code: "hours = {'09': 3, '14': 1}\nprint(len(hours))\nprint(sum(hours.values()))",
      question: {
        ar: 'قبل المشروع: قاموس المدرج بين يديك. ماذا يطبع السطران؟',
        en: 'Before the project: the histogram dict is in your hands. What do the two lines print?',
      },
      reveal: {
        ar: 'يطبع 2 ثم 4. len يعدّ السلال — ساعتان — وsum يجمع ما بداخلها: أربع رسائل. هذان الرقمان عمودا لوحة اليوم: عدد السلال الحيّة ومجموع الرسائل.',
        en: 'It prints 2 then 4. len counts the buckets — two hours — and sum adds what is inside: four messages. These two numbers are today\u2019s dashboard columns: live bucket count and total messages.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل: ثلاثة تطبيقات ووصفة واحدة', en: 'The chapter map: three applications, one recipe' },
      chunks: [
        {
          ar: 'ثلاثة تطبيقات بوصفة واحدة — اجمع فنظم فحلّل فسلّم لعارض خارجي. التطبيق الجغرافي: where.data تقرأها geoload.py في geodata.sqlite كذاكرة مؤقتة، ثم geodump.py يكتب where.js ويرسم where.html على خريطة غوغل. تطبيق الشبكة: spider.py يزحف في spider.sqlite، وsprank.py يرتب حتى تتقارب القيم، وspjson.py يكتب spider.json ليرسمه force.html بـ d3. والتطبيق البريدي: gmane.py وgmodel.py وgbasic.py ثم gword.js وgline.js في المتصفح.',
          en: 'Three applications with one recipe — collect, organize, analyze, then hand to an external viewer. The geo app: where.data read by geoload.py into geodata.sqlite as a cache, then geodump.py writes where.js and where.html draws on a Google map. The network app: spider.py crawls into spider.sqlite, sprank.py ranks until values converge, spjson.py writes spider.json for force.html and d3. The mail app: gmane.py, gmodel.py, gbasic.py, then gword.js and gline.js in the browser.',
        },
        {
          ar: 'وفي كل تطبيق بايثون تتوقف عند عتبة العرض: قواعد البيانات والملفات تُبنى هنا في كل لغة برمجة، أما خرائط غوغل وd3 والمنحنيات فشيفرة متصفح. لذلك تدرّبنا على النصف القابل للنقل: القراءة والحارس والعدّ والتنسيق وتوليد ملفات البيانات. نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية — وهذا ليس نقصًا بل تعريف صادق لمهارة المبرمج.',
          en: 'And in every application Python stops at the display threshold: databases and files are built here in any language, while Google Maps, d3 and the curves are browser code. So we trained on the transferable half: reading, guarding, counting, formatting and generating data files. We generate the chart data here; the rendering happens in an external tool — not a shortfall but an honest definition of the programmer\u2019s craft.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'فهرس مصطلحات الفصل', en: 'The chapter\u2019s glossary' },
      chunks: [
        {
          ar: 'البيانات الجغرافية geodata بيانات تحمل موقعًا على الأرض — وفي تطبيقنا ردود الخدمة المرمّزة للعناوين. خط العرض latitude يقيس شمالًا وجنوبًا عن خط الاستواء ويتدرج من -90 إلى 90، وخط الطول longitude يقيس شرقًا وغربًا عن غرينتش من -180 إلى 180 — وثنائيتهما يحدد أي نقطة على الكرة. في الرد تجليان باسمين قصيرين: lat وlng.',
          en: 'Geodata is data carrying a location on Earth — in our application, the service replies encoding addresses. Latitude measures north and south of the equator, graded -90 to 90; longitude measures east and west of Greenwich, -180 to 180 — the pair pins any point on the globe. In the reply they appear under the short names lat and lng.',
        },
        {
          ar: 'العقدة node طرف في الشبكة — صفحة ويب في تطبيقنا — والرابط link اتصال بين عقدتين، ودرجة degree العقدة عدد الروابط الملامسة لها. والمدرج التكراري histogram بنية تجمع القيم في سلال متجاورة وتعدّ كل سلة — ساعتنا ورسائلها. والخط الزمني timeline عرض البيانات بحسب ترتيبها الزمني — منحنى gline أو مدرج ساعات مرتب — والزمن فيه محور يُقرأ لا مجرد نص.',
          en: 'A node is an endpoint in a network — a web page in our application; a link is a connection between two nodes; a node\u2019s degree is the number of links touching it. A histogram drops values into adjacent buckets and counts each — our hours and their messages. A timeline displays data in its time order — gline\u2019s curve or a sorted hour histogram — time as an axis to be read, not just text.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'خلاصة مصغّرة: من الترويسات إلى السطور', en: 'A miniature summary: from headers to lines' },
      code: "import re\n\nmessages = [\n    ('Date: Sat, 5 Jan 2008 09:14:16', 'From: stephen.marquard@uct.ac.za'),\n    ('Date: Sat, 5 Jan 2008 09:45:20', 'From: zqian@umich.edu'),\n    ('Date: Sat, 5 Jan 2008 09:58:03', 'From: stephen.marquard@uct.ac.za'),\n    ('Date: Sat, 5 Jan 2008 18:44:02', 'From: zqian@umich.edu'),\n    ('Date: Fri, 4 Jan 2008 07:02:32', 'From: stephen.marquard@uct.ac.za'),\n    ('Date: Fri, 4 Jan 2008 16:10:39', 'From: csev@umich.edu'),\n]\nhours = dict()\nsenders = dict()\nfor date_line, from_line in messages:\n    m = re.search(r'^Date: .* ([0-9][0-9]):', date_line)\n    hour = m.group(1)\n    hours[hour] = hours.get(hour, 0) + 1\n    sender = from_line[6:]\n    senders[sender] = senders.get(sender, 0) + 1\n\nbest = None\nfor hour in hours:\n    if best is None or hours[hour] > hours[best]:\n        best = hour\ntop = None\nfor sender in senders:\n    if top is None or senders[sender] > senders[top]:\n        top = sender\nprint('messages: %d' % sum(hours.values()))\nprint('peak hour: %02d' % int(best))\nprint('top sender: %s' % top)",
      explanation: {
        ar: 'حلقة واحدة تملأ قاموسين: المرسل يُقطع بالشريحة [6:] التي تجاوز \u2019From: \u2019 من الفصل السادس، والساعة تُلتقط بنمط الفصل الحادي عشر. ثم حلقتا الأكثر بعلم None — الذروة الزمنية 09 بثلاث رسائل، والأعلى إرسالًا stephen.marquard@uct.ac.za. و%02d من الفصل السادس يطبع 09 بالصفر المحفوظ — تقرير بثلاثة أسطر يقرؤه الإنسان قبله الملف. المشروع يضيف الأشرطة وعمود الملف.',
        en: 'One loop fills two dicts: the sender is sliced with [6:] skipping \u2019From: \u2019 from chapter six, and the hour is captured by the chapter-eleven pattern. Then two most-loops with the None flag — the time peak is 09 with three messages, and the top sender is stephen.marquard@uct.ac.za. And %02d from chapter six prints 09 with its preserved zero — a three-line report a human reads before the file does. The project adds the bars and the file column.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-summary',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "hours = {'09': 3, '14': 1}\nprint(len(hours))\nprint(sum(hours.values()))\nbest = None\nfor h in hours:\n    if best is None or hours[h] > hours[best]:\n        best = h\nprint('peak hour: %s' % best)",
      solution: '2\n4\npeak hour: 09',
      answer: '2\n4\npeak hour: 09',
      hints: [
        { ar: 'len يعدّ المفاتيح: ساعتان.', en: 'len counts the keys: two hours.' },
        { ar: 'sum على values يجمع 3 و1.', en: 'sum over the values adds 3 and 1.' },
        { ar: 'حلقة الذروة تمسك أول مفتاح ثم تستبدله عند قيمة أكبر — و09 أكبر من 14 بالعدّ لا بالترتيب.', en: 'The peak loop grabs the first key then swaps on any bigger count — 09 beats 14 by count, not by order.' },
        { ar: 'الخرْج:\n2\n4\npeak hour: 09', en: 'The output:\n2\n4\npeak hour: 09' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mail-dashboard',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: لوحة البيانات البريدية. السجل معطى في المحرر. 1) ابنِ قاموس hours من أسطر Date: بالنمط r\u2019^Date: .* ([0-9][0-9]):\u2019 وأسلوب get، وقاموس senders من أسطر From: بالشريحة [6:] وأسلوب get. 2) اكتب دالة bar_lines(pairs, width) تعيد قائمة أسطر %s | %s %d بطول int(width * value / biggest) بعد إيجاد biggest بحلقة. 3) اطبع أشرطة الساعات بترتيبها الزمني: hour_pairs من sorted(hours) بالعرض 6، ثم أشرطة المرسلين مرتبة تنازليًّا بفكّ DSU (قيمة، اسم) بالعرض 6. 4) أوجد الذروة والأعلى بعلم None واطبع: messages: %d بمجموع hours، وpeak hour: %02d بint(best)، وtop sender: %s. 5) اكتب أشرطة الساعات في ملف dashboard-l16.txt بوضع w منضمة بـ \u2019\\n\u2019 وبسطر ختامي، ثم اقرأه عائدًا واطبع file lines: %d بعدد أسطره. المتوقع بالترتيب: hour 07 | ## 1 ثم hour 09 | ###### 3 ثم hour 16 | ## 1 ثم hour 18 | ## 1، ثم stephen.marquard@uct.ac.za | ###### 3 ثم zqian@umich.edu | #### 2 ثم csev@umich.edu | ## 1، ثم messages: 6 ثم peak hour: 09 ثم top sender: stephen.marquard@uct.ac.za ثم file lines: 4.',
        en: "The project: the Mail Data Dashboard. The log is given in the editor. 1) Build an hours dict from Date: lines with the pattern r\u2019^Date: .* ([0-9][0-9]):\u2019 and the get idiom, and a senders dict from From: lines with the [6:] slice and get. 2) Write a bar_lines(pairs, width) function returning a list of %s | %s %d lines with length int(width * value / biggest) after finding biggest in a loop. 3) Print the hour bars in time order: hour_pairs from sorted(hours) at width 6, then the sender bars ranked descending with DSU (value, name) unpacking at width 6. 4) Find the peak and top with None-flag loops and print: messages: %d with the sum of hours, peak hour: %02d with int(best), and top sender: %s. 5) Write the hour bars into dashboard-l16.txt in w mode joined by \u2019\\n\u2019 plus a trailing newline, then read it back and print file lines: %d with its line count. Expected in order: hour 07 | ## 1, then hour 09 | ###### 3, then hour 16 | ## 1, then hour 18 | ## 1; then stephen.marquard@uct.ac.za | ###### 3, then zqian@umich.edu | #### 2, then csev@umich.edu | ## 1; then messages: 6, then peak hour: 09, then top sender: stephen.marquard@uct.ac.za, then file lines: 4.",
      },
      starterCode: "import re\n\nlog = [\n    'Date: Sat, 5 Jan 2008 09:14:16',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Date: Sat, 5 Jan 2008 09:45:20',\n    'From: zqian@umich.edu',\n    '',\n    'Date: Sat, 5 Jan 2008 09:58:03',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Date: Sat, 5 Jan 2008 18:44:02',\n    'From: zqian@umich.edu',\n    '',\n    'Date: Fri, 4 Jan 2008 07:02:32',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Date: Fri, 4 Jan 2008 16:10:39',\n    'From: csev@umich.edu',\n]\nhours = dict()\nsenders = dict()\n# 1) املا القاموسين من log: فلتر startswith + regex للساعة + [6:] للمرسل + get idiom\n# 2) دالة bar_lines(pairs, width) تعيد قائمة أسطر\n# 3) اطبع أشرطة الساعات زمنيًّا ثم أشرطة المرسلين تنازليًّا (العرض 6)\n# 4) اطبع messages وpeak hour: %02d وtop sender\n# 5) اكتب أشرطة الساعات في dashboard-l16.txt بوضع w ثم اقرأه واطبع file lines\n",
      solution: "import re\n\nlog = [\n    'Date: Sat, 5 Jan 2008 09:14:16',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Date: Sat, 5 Jan 2008 09:45:20',\n    'From: zqian@umich.edu',\n    '',\n    'Date: Sat, 5 Jan 2008 09:58:03',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Date: Sat, 5 Jan 2008 18:44:02',\n    'From: zqian@umich.edu',\n    '',\n    'Date: Fri, 4 Jan 2008 07:02:32',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Date: Fri, 4 Jan 2008 16:10:39',\n    'From: csev@umich.edu',\n]\nhours = dict()\nsenders = dict()\nfor line in log:\n    line = line.strip()\n    if not line.startswith('Date:'):\n        continue\n    m = re.search(r'^Date: .* ([0-9][0-9]):', line)\n    if m is None:\n        continue\n    hour = m.group(1)\n    hours[hour] = hours.get(hour, 0) + 1\nfor line in log:\n    line = line.strip()\n    if not line.startswith('From:'):\n        continue\n    sender = line[6:]\n    senders[sender] = senders.get(sender, 0) + 1\n\ndef bar_lines(pairs, width):\n    biggest = 0\n    for name, value in pairs:\n        if value > biggest:\n            biggest = value\n    lines = []\n    for name, value in pairs:\n        ticks = int(width * value / biggest)\n        lines.append('%s | %s %d' % (name, '#' * ticks, value))\n    return lines\n\nhour_pairs = []\nfor hour in sorted(hours):\n    hour_pairs.append(('hour ' + hour, hours[hour]))\nfor row in bar_lines(hour_pairs, 6):\n    print(row)\n\nranked = []\nfor name, value in senders.items():\n    ranked.append((value, name))\nranked.sort(reverse=True)\nsender_pairs = []\nfor value, name in ranked:\n    sender_pairs.append((name, value))\nfor row in bar_lines(sender_pairs, 6):\n    print(row)\n\nbest = None\nfor hour in hours:\n    if best is None or hours[hour] > hours[best]:\n        best = hour\ntop = None\nfor sender in senders:\n    if top is None or senders[sender] > senders[top]:\n        top = sender\nprint('messages: %d' % sum(hours.values()))\nprint('peak hour: %02d' % int(best))\nprint('top sender: %s' % top)\n\nout = open('dashboard-l16.txt', 'w')\nout.write('\\n'.join(bar_lines(hour_pairs, 6)))\nout.write('\\n')\nout.close()\nfhand = open('dashboard-l16.txt')\nback = fhand.read()\nfhand.close()\nprint('file lines: %d' % len(back.strip().split('\\n')))",
      tests: [
        {
          id: 't1',
          name: { ar: 'عدد الرسائل في الخلاصة', en: 'The message count in the summary' },
          code: "assert 'messages: 6' in __learner_output__, 'expected: messages: 6 | actual: %r' % __learner_output__",
          expected: 'messages: 6',
        },
        {
          id: 't2',
          name: { ar: 'ساعة الذروة بالصفر المحفوظ', en: 'The peak hour with its preserved zero' },
          code: "assert 'peak hour: 09' in __learner_output__, 'expected: peak hour: 09 | actual: %r' % __learner_output__",
          expected: 'peak hour: 09',
        },
        {
          id: 't3',
          name: { ar: 'أعلى مرسل مطبوع كاملًا', en: 'The top sender printed in full' },
          code: "assert 'top sender: stephen.marquard@uct.ac.za' in __learner_output__, 'expected: top sender: stephen.marquard@uct.ac.za | actual: %r' % __learner_output__",
          expected: 'top sender: stephen.marquard@uct.ac.za',
        },
        {
          id: 't4',
          name: { ar: 'شريط ساعة الذروة في التقرير', en: 'The peak hour bar in the report' },
          code: "assert 'hour 09 | ###### 3' in __learner_output__, 'expected: hour 09 | ###### 3 | actual: %r' % __learner_output__",
          expected: 'hour 09 | ###### 3',
        },
        {
          id: 't5',
          name: { ar: 'القاموسان محسوبان صحيحًا', en: 'Both dicts computed correctly' },
          code: "assert hours['09'] == 3 and senders['stephen.marquard@uct.ac.za'] == 3, 'expected: hours 09 = 3 and top sender = 3 | actual: %r %r' % (hours.get('09'), senders.get('stephen.marquard@uct.ac.za'))",
          expected: 'hours 09 = 3 and top sender = 3',
        },
        {
          id: 't6',
          name: { ar: 'الملف مكتوب ومتحقق منه', en: 'The file written and verified' },
          code: "back = open('dashboard-l16.txt').read()\nassert 'hour 09 | ###### 3' in back and len(back.strip().split('\\n')) == 4, 'expected: 4 verified hour lines in the file | actual: %r' % back",
          expected: '4 verified hour lines in the file',
        },
      ],
      hints: [
        { ar: 'مررتان على log كما في worked: الأولى بفلتر Date: والثانية بفلتر From: — كل واحدة تملأ قاموسها بـ get.', en: 'Two passes over log as in the worked example: the first filtered on Date:, the second on From: — each fills its own dict with get.' },
        { ar: 'bar_lines تعيد القائمة بدل الطباعة: حلقة biggest ثم حلقة تبني lines وتعيدها — فتُطبع وتُكتب في الملف من المصدر نفسه.', en: 'bar_lines returns the list instead of printing: a biggest loop, then a loop building lines and returning it — so screen and file share one source.' },
        { ar: 'أشرطة المرسلين: ranked تجمع (value, name) من senders.items() ثم sort(reverse=True) ثم حلقة تعكس الوجه قبل bar_lines.', en: 'Sender bars: ranked collects (value, name) from senders.items(), then sort(reverse=True), then a loop flips the face before bar_lines.' },
        { ar: 'الهيكل الختامي:\nout = open(\u2019dashboard-l16.txt\u2019, \u2019w\u2019)\nout.write(\u2019\\n\u2019.join(bar_lines(hour_pairs, 6)))\nout.write(\u2019\\n\u2019)\nout.close()\nback = open(\u2019dashboard-l16.txt\u2019).read()\nprint(\u2019file lines: %d\u2019 % len(back.strip().split(\u2019\\n\u2019)))', en: "The closing skeleton:\nout = open(\u2019dashboard-l16.txt\u2019, \u2019w\u2019)\nout.write(\u2019\\n\u2019.join(bar_lines(hour_pairs, 6)))\nout.write(\u2019\\n\u2019)\nout.close()\nback = open(\u2019dashboard-l16.txt\u2019).read()\nprint(\u2019file lines: %d\u2019 % len(back.strip().split(\u2019\\n\u2019)))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-recipe',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما القاسم المشترك في التطبيقات الثلاثة للفصل — الخرائط والشبكات والبريد؟',
        en: 'What do the chapter\u2019s three applications — maps, networks and mail — share?',
      },
      options: [
        { id: 'a', text: { ar: 'تجمع البيانات وتنظمها أولًا في قواعد وملفات، ثم تولّد ملف بيانات يستهلكه عارض خارجي في المتصفح', en: 'They collect and organize data first into databases and files, then generate a data file consumed by an external viewer in the browser' } },
        { id: 'b', text: { ar: 'كلها ترسم بنفسها داخل بايثون بلا أدوات خارجية', en: 'All of them draw inside Python by themselves with no external tools' } },
        { id: 'c', text: { ar: 'كلها لا تحتاج تحليلًا لأن العرض يكفي', en: 'None needs analysis because displaying is enough' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'geodata.sqlite وspider.sqlite وindex.sqlite — ما المشترك بين الثلاثة؟', en: 'geodata.sqlite, spider.sqlite, index.sqlite — what do the three share?' },
        { ar: 'where.js وspider.json وgword.js وgline.js — ملفات تُقرأ من مَن؟', en: 'where.js, spider.json, gword.js, gline.js — files read by whom?' },
        { ar: 'بايثون تتوقف عند عتبة العرض — والمتصفح يلتقطها.', en: 'Python stops at the display threshold — the browser picks it up.' },
        { ar: 'الجواب: أ — جمع وتنظيم ثم توليد ملف بيانات لعارض خارجي.', en: 'Answer: a — collect and organize, then generate a data file for an external viewer.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-sum',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: بعد hours = {\u201908\u2019: 2, \u201909\u2019: 3, \u201910\u2019: 1} — كم يطبع sum(hours.values())؟',
        en: "Without running: after hours = {\u201908\u2019: 2, \u201909\u2019: 3, \u201910\u2019: 1} — what does sum(hours.values()) print?",
      },
      answer: '6',
      solution: '6',
      tolerance: 0,
      hints: [
        { ar: 'values تعيد قيم السلال الثلاث.', en: 'values returns the three buckets\u2019 values.' },
        { ar: 'اجمع 2 و3 و1.', en: 'Add 2 and 3 and 1.' },
        { ar: 'هذا هو سطر messages في لوحتك.', en: 'This is your dashboard\u2019s messages line.' },
        { ar: 'الجواب: 6', en: 'Answer: 6' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-wrong-header',
      required: true,
      brokenCode: "import re\n\nlog = [\n    'Received: from mail.uct.ac.za by umich.edu; Sat, 5 Jan 2008 11:12:31',\n    'Date: Sat, 5 Jan 2008 09:14:16',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Received: from mail.uct.ac.za by umich.edu; Sat, 5 Jan 2008 11:47:02',\n    'Date: Sat, 5 Jan 2008 09:45:20',\n    'From: zqian@umich.edu',\n    '',\n    'Received: from umich.edu by uct.ac.za; Sat, 5 Jan 2008 11:59:44',\n    'Date: Sat, 5 Jan 2008 09:58:03',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Received: from uct.ac.za by mail.berkeley.edu; Sat, 5 Jan 2008 16:20:55',\n    'Date: Sat, 5 Jan 2008 14:20:33',\n    'From: csev@umich.edu',\n]\n\nhours = dict()\nfor line in log:\n    line = line.strip()\n    if not line.startswith('Received:'):  # الترويسة الخطأ / the wrong header\n        continue\n    m = re.search(r'^Received: .* ([0-9][0-9]):', line)\n    if m is None:\n        continue\n    hour = m.group(1)\n    hours[hour] = hours.get(hour, 0) + 1\nfor hour in sorted(hours):\n    print('hour %s: %d' % (hour, hours[hour]))\nbest = None\nfor hour in hours:\n    if best is None or hours[hour] > hours[best]:\n        best = hour\nprint('peak hour: %s' % best)\nprint('messages: %d' % sum(hours.values()))",
      prompt: {
        ar: 'اللوحة تعمل بلا أي انهيار — ومع ذلك تزعم أن ذروة النشاط في الساعة 11 صباحًا بينما المرسلون كتبوا رسائلهم في الساعة 9! شغّل الكود المعطوب ولاحظ: المدرج يحصي أسطر Received: — وهي طوابع وصول الرسالة عند كل خادم في طريقها، لا لحظة كتابتها. الترويسة الصحيحة لساعة الإرسال هي Date:. أصلح المرشح والنمط النمطي معًا ليثبتا على Date: فتظهر الذروة في الساعة 09 ورسالة الساعة 14 وحدها، مع messages: 4.',
        en: 'The dashboard runs without a single crash — yet it claims the activity peak at 11 in the morning while the senders wrote their messages at 9! Run the broken code and notice: the histogram counts Received: lines — those are arrival stamps from every server along the way, not the moment of writing. The right header for the send hour is Date:. Fix the filter and the regex together to pin on Date: so the peak lands at hour 09 with hour 14 alone behind it, and messages: 4.',
      },
      solution: "import re\n\nlog = [\n    'Received: from mail.uct.ac.za by umich.edu; Sat, 5 Jan 2008 11:12:31',\n    'Date: Sat, 5 Jan 2008 09:14:16',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Received: from mail.uct.ac.za by umich.edu; Sat, 5 Jan 2008 11:47:02',\n    'Date: Sat, 5 Jan 2008 09:45:20',\n    'From: zqian@umich.edu',\n    '',\n    'Received: from umich.edu by uct.ac.za; Sat, 5 Jan 2008 11:59:44',\n    'Date: Sat, 5 Jan 2008 09:58:03',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Received: from uct.ac.za by mail.berkeley.edu; Sat, 5 Jan 2008 16:20:55',\n    'Date: Sat, 5 Jan 2008 14:20:33',\n    'From: csev@umich.edu',\n]\n\nhours = dict()\nfor line in log:\n    line = line.strip()\n    if not line.startswith('Date:'):  # ترويسة صياغة الرسالة / the message composition header\n        continue\n    m = re.search(r'^Date: .* ([0-9][0-9]):', line)\n    if m is None:\n        continue\n    hour = m.group(1)\n    hours[hour] = hours.get(hour, 0) + 1\nfor hour in sorted(hours):\n    print('hour %s: %d' % (hour, hours[hour]))\nbest = None\nfor hour in hours:\n    if best is None or hours[hour] > hours[best]:\n        best = hour\nprint('peak hour: %s' % best)\nprint('messages: %d' % sum(hours.values()))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الذروة عند ساعة الكتابة الصحيحة', en: 'The peak at the true writing hour' },
          code: "assert 'peak hour: 09' in __learner_output__, 'expected: peak hour: 09 | actual: %r' % __learner_output__",
          expected: 'peak hour: 09',
        },
        {
          id: 't2',
          name: { ar: 'ساعة الوصول الزائفة اختفت', en: 'The false arrival hour vanished' },
          code: "assert 'peak hour: 11' not in __learner_output__, 'expected: no peak hour: 11 | actual: %r' % __learner_output__",
          expected: 'no peak hour: 11',
        },
        {
          id: 't3',
          name: { ar: 'سطر ذروة واحد فقط', en: 'Exactly one peak line' },
          code: "assert __learner_output__.count('peak hour') == 1, 'expected: exactly one peak hour line | actual: %r' % __learner_output__",
          expected: 'exactly one peak hour line',
        },
        {
          id: 't4',
          name: { ar: 'المدرج الصحيح: 09 ثلاثًا و14 مرة', en: 'The right histogram: 09 thrice and 14 once' },
          code: "assert 'hour 09: 3' in __learner_output__ and 'hour 14: 1' in __learner_output__, 'expected: hour 09: 3 and hour 14: 1 | actual: %r' % __learner_output__",
          expected: 'hour 09: 3 and hour 14: 1',
        },
        {
          id: 't5',
          name: { ar: 'المجموع أربع رسائل', en: 'The sum is four messages' },
          code: "assert 'messages: 4' in __learner_output__, 'expected: messages: 4 | actual: %r' % __learner_output__",
          expected: 'messages: 4',
        },
      ],
      hints: [
        { ar: 'لا استثناء ولا انهيار — الأرقام مطبوعة واثقة ووهمية في آن: خلل دلالي في مصدر الحصاد.', en: 'No exception, no crash — confident numbers that are also wrong: a semantic flaw in the counting source.' },
        { ar: 'قارن أسطر Received: بتواريخ Date: المقابلة — الوصول بعد الكتابة بساعتين تقريبًا.', en: 'Compare each Received: line with its matching Date: — arrival trails writing by about two hours.' },
        { ar: 'الإصلاح سطران متآخيان: startswith(\u2019Date:\u2019) في المرشح وr\u2019^Date: ...\u2019 في النمط — أثبت الترويسة الصحيحة في مكانهما.', en: "The fix is two matched lines: startswith(\u2019Date:\u2019) in the filter and r\u2019^Date: ...\u2019 in the pattern — pin the right header in both." },
        { ar: 'بعد الإصلاح: hour 09: 3 ثم hour 14: 1 ثم peak hour: 09 ثم messages: 4.', en: 'After the fix: hour 09: 3, then hour 14: 1, then peak hour: 09, then messages: 4.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — لوحتك البريدية الكاملة\n# Your playground — your full mail dashboard\n\nimport re\n\nlog = [\n    \'Date: Sat, 5 Jan 2008 09:14:16\',\n    \'From: stephen.marquard@uct.ac.za\',\n    \'Date: Sat, 5 Jan 2008 09:45:20\',\n    \'From: zqian@umich.edu\',\n    \'Date: Sat, 5 Jan 2008 14:20:33\',\n    \'From: csev@umich.edu\',\n]\nhours = dict()\ndays = dict()\nfor line in log:\n    m = re.search(r\'^Date: ([A-Z][a-z][a-z]), .* ([0-9][0-9]):\', line)\n    if m is not None:\n        day = m.group(1)\n        days[day] = days.get(day, 0) + 1\n        hour = m.group(2)\n        hours[hour] = hours.get(hour, 0) + 1\nprint(days)\nprint(hours)\n\n# جرّب: مجموعة ثانية للنطاق من عنوان المرسل — من ينشر من uct.ac.za؟ / try: a second group for the sender domain — who posts from uct.ac.za?\n# جرّب: ادمج days وhours في تقرير ذي عمودين / try: merge days and hours into a two-column report',
      prompt: {
        ar: 'جرّب بنفسك: النمط هنا يلتقط مجموعة ثانية ليوم الأسبوع من الترويسة نفسها — Sat وFri. أضف مجموعة ثالثة تنزع نطاق المرسل بعد @ وقارن قاموس النطاقات بقاموس المرسلين الكاملين. ثم فكر: أي ملف بيانات ستكتب لعارض خارجي يرسم منحنى الأيام؟ لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: this pattern captures a second group for the day of week from the same header — Sat and Fri. Add a third group pulling the sender domain after @ and compare the domains dict with the full-senders dict. Then think: what data file would you write for an external viewer drawing a day curve? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل التاسع: في counts.get(x, 0) — ما قيمة التعبير حين لا يوجد x في القاموس بعد؟',
            en: 'From chapter 9: in counts.get(x, 0) — what is the value of the expression when x is not yet in the dict?',
          },
          options: [
            { id: 'a', text: { ar: 'الصفر — الافتراضي الممرَّر، بلا KeyError — ثم + 1 يرفعه إلى أول وحدة', en: 'Zero — the passed default, with no KeyError — then + 1 lifts it to the first unit' } },
            { id: 'b', text: { ar: 'None — ويهدم الجمع اللاحق', en: 'None — wrecking the later addition' } },
            { id: 'c', text: { ar: 'يُنشأ سطر جديد في ملف', en: 'A new line is created in a file' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'أسلوب get هو عمود كل عدّاداتنا: من الساعات إلى المرسلين إلى الدرجات — مفتاح جديد يبدأ من صفر بأمان.',
            en: 'The get idiom is the spine of all our counters: hours, senders, degrees — a fresh key starts from zero safely.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الحادي عشر: في نمط الساعة r\u2019^Date: .* ([0-9][0-9]):\u2019 — لماذا تسبق المجموعةُ فراغٌ بعد .*؟',
            en: 'From chapter 11: in the hour pattern r\u2019^Date: .* ([0-9][0-9]):\u2019 — why does a space precede the group after .*?',
          },
          options: [
            { id: 'a', text: { ar: 'لكنها تقفز 14 من 09:14:16 — الفراغ يضمن أن نلتقط الرقمين بعد آخر فراغ، وهما ساعة الإرسال', en: 'Otherwise it would grab 14 from 09:14:16 — the space guarantees we capture the two digits after the last space, the send hour' } },
            { id: 'b', text: { ar: 'لأن .* لا تعمل بلا فراغ بعدها', en: 'Because .* cannot work without a trailing space' } },
            { id: 'c', text: { ar: 'الفراغ يلغي الحاجة إلى المرساة ^', en: 'The space removes the need for the ^ anchor' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'شرحناها في الفصل الحادي عشر: النمط يبحث عن فراغ ورقمين ونقطتين — و14 مسبوقة بنقطتين لا فراغ، فلا تُصاد أبدًا.',
            en: 'Chapter eleven explained it: the pattern hunts a space, two digits and a colon — 14 is preceded by a colon, not a space, so it can never be caught.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الثالث عشر: ماذا يعيد json.loads عند تحليل رد الترميز الجغرافي الذي قرأناه في الدرس الأول؟',
            en: 'From chapter 13: what does json.loads return when parsing the geocoding reply we read in lesson one?',
          },
          options: [
            { id: 'a', text: { ar: 'قاموسًا أصليًّا فيه status وقائمة results من قواميس — تصلح مفتاحه ومفاتيح get وin', en: 'A native dict with status and a results list of dicts — indexable, with get and in working' } },
            { id: 'b', text: { ar: 'سلسلة نصية تنقصها علامات الاقتباس', en: 'A string still missing its quotes' } },
            { id: 'c', text: { ar: 'ملف where.js جاهزًا', en: 'A ready where.js file' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا سر قوة JSON: النص يصير قواميس وقوائم بايثون حقيقية — والحارس يقارن status والقائمة تُفتح بأدلة.',
            en: 'That is JSON\u2019s power: text becomes real Python dicts and lists — the guard compares status and the list opens by index.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الخامس عشر: لماذا خزّن الكتاب أرشيف الغيغابايت في قاعدة SQL لا في قواميس بايثون؟',
            en: 'From chapter 15: why did the book store the gigabyte archive in a SQL database rather than Python dicts?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن البيانات ضخمة ولا تتسع لقاموس والزحف قابل للمقاطعة — والقاعدة تحفظ التقدم بين التشغيلات وتجيب بسرعة', en: 'Because the data is huge and beyond a dict, and the crawl is interruptible — the database keeps progress across runs and answers fast' } },
            { id: 'b', text: { ar: 'لأن SQL يرسم المنحنيات أجمل', en: 'Because SQL draws prettier curves' } },
            { id: 'c', text: { ar: 'لأن بايثون لا تحفظ نصوصًا طويلة', en: 'Because Python cannot store long texts' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'ثلاثة أسباب الكتاب: تحديثات صغيرة متكررة، بيانات أكبر من الذاكرة، وعمليات طويلة تُوقف وتُستأنف — وزحف الأرشيف يجمعها كلها.',
            en: 'The book\u2019s three reasons: many small updates, data bigger than memory, long operations paused and resumed — the archive crawl has all three.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'في where.js بنينا myData = [[42.3396998, -71.08975, \u2019...\u2019], ...]; — ما الذي جعل بناءها بيدنا سهلًا؟',
            en: 'In where.js we built myData = [[42.3396998, -71.08975, \u2019...\u2019], ...]; — what made hand-building it easy?',
          },
          options: [
            { id: 'a', text: { ar: 'صيغة قوائم JavaScript تشبه قوائم بايثون إلى حد كبير — قوسان وفواصل وتسميات مقتبسة نضيفها بـ %s', en: 'JavaScript list syntax closely resembles Python\u2019s — brackets, commas and labels we quote with %s' } },
            { id: 'b', text: { ar: 'لأن JavaScript هي بايثون باسم آخر', en: 'Because JavaScript is Python under another name' } },
            { id: 'c', text: { ar: 'لأن json.loads يبني where.js تلقائيًّا', en: 'Because json.loads builds where.js automatically' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الكتاب يشير إلى هذا التشابه صراحة — ولهذا استطعنا توليد ملف يعيش في عالم لغة أخرى بقالب نصي من الفصل السادس.',
            en: 'The book points at this resemblance explicitly — which is why a chapter-six text template can generate a file living in another language\u2019s world.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'ماذا يكتب gword.py وgline.py — ومن يستهلك ملفاتهما؟',
            en: 'What do gword.py and gline.py write — and who consumes their files?',
          },
          options: [
            { id: 'a', text: { ar: 'gword.js لتكرار كلمات العناوين وgline.js لتوزيع الرسائل بحسب المنظمة — يقرؤهما gword.htm وgline.htm في المتصفح', en: 'gword.js for subject-word frequencies and gline.js for messages per organization — read by gword.htm and gline.htm in the browser' } },
            { id: 'b', text: { ar: 'قاعدتي SQLite يعاد دمجهما في content.sqlite', en: 'Two SQLite databases merged back into content.sqlite' } },
            { id: 'c', text: { ar: 'رسائل بريد تُرسل إلى القائمة', en: 'Email messages sent back to the list' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'خاتمة الوصفة نفسها: بايثون تحسب وتكتب ملف بيانات، والمتصفح يرسم — غيمة الكلمات والمنحنى الزمني عرضان خارجيان لبيانات داخلية.',
            en: 'The same recipe\u2019s closing move: Python computes and writes a data file, the browser draws — the word cloud and time curve are external views of internal data.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "# عدّ الساعات من أسطر Received:",
          right: "# عدّ الساعات من أسطر Date:",
          note: {
            ar: 'Received طوابع وصول في كل قفزة خادم — وDate لحظة الكتابة: الخلط يزيح الذروة ساعات كاملة بلا أي رسالة خطأ. اسأل دائمًا: أي حدث زمني أقيس؟',
            en: 'Received stamps arrivals at every server hop — Date marks composition: mixing them shifts the peak by whole hours with no error message. Always ask: which time event am I measuring?',
          },
        },
        {
          wrong: "ticks = width * value / biggest  # أشرطة بمقياس متغير",
          right: "ticks = int(width * value / biggest)",
          note: {
            ar: 'بلا عرض أقصى تتضخم الأشرطة مع البيانات حتى تفقد اللوحة معناها، وبلا int يرمي الضرب في العشري TypeError. ثبّت العرض واقص النتيجة — وتقبّل شريطًا فارغًا بقيمة معلنة عند الأرقام الصغيرة.',
            en: 'With no max width bars inflate with the data until the dashboard loses meaning, and without int the text-times-float multiplication throws TypeError. Fix the width and truncate — and accept an empty bar with a printed value for tiny numbers.',
          },
        },
        {
          wrong: "print('peak hour: %s' % 9)  # تسع بلا صفر مقابل مفاتيح \u201909\u2019",
          right: "print('peak hour: %02d' % int(best))",
          note: {
            ar: 'مفاتيح المدرج نصوص بطول ثابت \u201909\u2019 — وطبعها بلا صفر يفصل التقرير عن الأشرطة ويصعّب المطابقة. %02d يحفظ المحرفين فيتحدث اللغة نفسها في كل الأسطر.',
            en: 'Histogram keys are fixed-width texts like \u201909\u2019 — printing without the zero severs the report from the bars and hampers matching. %02d keeps both characters so every line speaks the same language.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'خريطة الفصل: ثلاثة تطبيقات بوصفة واحدة — اجمع في قاعدة، نظّف، حلّل، ثم كوّن ملف بيانات لعارض خارجي في المتصفح.', en: 'The chapter map: three applications, one recipe — collect into a database, clean, analyze, then form a data file for an external browser viewer.' },
        { ar: 'المصطلحات الثمانية: geodata وlatitude وlongitude للجغرافيا، وnode وlink وdegree للشبكة، وhistogram وtimeline للزمن.', en: 'The eight terms: geodata, latitude, longitude for geography; node, link, degree for the network; histogram and timeline for time.' },
        { ar: 'المشروع ضمّ الفصل كله: ترويسات تُقرأ بنمط، وقواميس get، وأشرطة محجومة، وخلاصة %02d، وملف يُكتب w ويُتحقق — والخلل الصامت ترويسة خاطئة تصح بمرساة واحدة.', en: 'The project joined the whole chapter: regex-read headers, get dicts, scaled bars, a %02d summary, a w-written verified file — and the silent flaw was a wrong header fixed by one anchor.' },
      ],
      reflectPrompt: {
        ar: 'لوحة tomorrow: أي عمود تضيفه للوحة البريدية — يوم الأسبوع، أو النطاقات، أو حجم الرسائل بالكلمات؟ حدد الترويسة التي تحمله والنمط الذي يقتطعه، واكتب سطر الملف الذي سيتناوله العارض الخارجي.',
        en: 'Tomorrow\u2019s dashboard: which column would you add to the mail dashboard — day of week, sender domains, or message size in words? Pick the header carrying it and the regex extracting it, and write the file line an external viewer would consume.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch16.s3', pages: 'ص293 / pp.293' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch16.s3', pages: 'ص293 / pp.293' },
  ],
} satisfies Lesson;

export default lesson;
