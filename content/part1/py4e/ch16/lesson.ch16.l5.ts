import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch16.l5 — "Mail Data Over Time / البيانات البريدية عبر الزمن"
 * Aligned with PY4E ch16 s3 (تحليل وعرض البيانات الواردة بريديًا).
 * All expression is original.
 * SIMULATED-RENDERER design: the book's gword.js word cloud / gline.js line
 * chart in a browser are the external renderers; the runnable code computes
 * the DATA: from EMBEDDED mbox-like 'Date: Sat, 5 Jan 2008 09:14:16' lines,
 * extract the hour with a ch11 regex, build an hour histogram with the ch9
 * get idiom, print hour counts and the peak hour.
 */
const lesson = {
  id: 'py4e.ch16.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 16,
  title: { ar: 'البيانات البريدية عبر الزمن', en: 'Mail Data Over Time' },
  estimatedMinutes: 18,
  prerequisites: ['py4e.ch16.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أعقد تطبيق في الكتاب: أرشيف قائمة بريدية تتجاوز رسائله غيغابايتًا، يسحبه gmane.py رسالة في الثانية على مدى أيام، فينظّمه gmodel.py في قاعدة أصغر بعشر مرات، ثم يجيب gbasic.py في ثوانٍ: من أكثر إرسالًا؟ وأي منظمة؟ وأخيرًا gword.py وgline.py يكتبان gword.js وgline.js ليرسمهما المتصفح غيمة كلمات ومنحنى زمني. نحن نتدرب على قلب التحليل: ساعة الإرسال. نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية. بنهاية الدرس ستكون قادرًا على: سرد خط أنابيب الكتاب البريدي، واستخراج الساعة بتعبير نمطي من الفصل الحادي عشر، وبناء مدرج تكراري للساعات وإيجاد الذروة.',
        en: 'The book\u2019s most complex application: a mailing-list archive past a gigabyte, pulled by gmane.py one message per second across days, organized by gmodel.py into a database ten times smaller, then gbasic.py answers in seconds: who sends the most? Which organization? Finally gword.py and gline.py write gword.js and gline.js for the browser to draw as a word cloud and a timeline curve. We rehearse the analysis core: the send hour. We generate the chart data here; the rendering happens in an external tool. By the end of this lesson you will be able to: narrate the book\u2019s mail pipeline, extract the hour with a chapter-eleven regex, and build an hour histogram and find its peak.',
      },
    },
    {
      kind: 'predict',
      code: "line = 'Date: Sat, 5 Jan 2008 09:14:16'\nprint(line.startswith('Date:'))\nprint(line.split()[5])",
      question: {
        ar: 'سطر ترويسة بريدية كما في ملفات mbox. ماذا يطبع السطران — وأين ينام الوقت؟',
        en: 'A mail header line as in mbox files. What do the two lines print — and where does the time sleep?',
      },
      reveal: {
        ar: 'يطبع True ثم 09:14:16. split يقصّ عند الفراغات فيجعل الوقت الكلمة السادسة — ساعة:دقيقة:ثانية. الترويسة Date تحمل لحظة صياغة الرسالة، وهي التي سنستخرج منها الساعة بتعبير نمطي.',
        en: 'It prints True then 09:14:16. split cuts at the spaces, making the time the sixth word — hour:minute:second. The Date header carries the moment the message was composed, and it is where we will extract the hour with a regex.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خط أنابيب البريد: من gmane إلى index.sqlite', en: 'The mail pipeline: from gmane to index.sqlite' },
      chunks: [
        {
          ar: 'البيانات الحقيقية قذرة: gmane.py يعمل ببطء مسؤول — رسالة في الثانية كي لا نضغط على الأرشيف — ويخزن كل شيء في content.sqlite حتى لو كان ناقصًا أو مكررًا، ويمكن مقاطعته وإعادة تشغيله. ثم gmodel.py ينظّف: يقصّ أسماء النطاقات si.umich.edu إلى umich.edu، ويوحد حالة الأحرف إلى الصغيرة، ويحوّل عناوين gmane المؤقتة إلى الحقيقية، ويكتب index.sqlite أصغر بعشر مرات ومضغوطًا.',
          en: 'Real data is dirty: gmane.py works slowly and responsibly — one message per second so we do not stress the archive — storing everything in content.sqlite even if incomplete or duplicated, interruptible and resumable. Then gmodel.py cleans: truncates domain names si.umich.edu to umich.edu, unifies letter case to lowercase, maps temporary gmane addresses to real ones, and writes index.sqlite ten times smaller and compressed.',
        },
        {
          ar: 'والتحليل يطير على المنظم: gbasic.py يحمّل 51330 رسالة و1584 مرسلًا ويطبع Top 5 Email list participants وTop 5 Email list organizations — gmail.com في الصدارة بـ 7339. سرعته من الفصل الخامس عشر: استعلامات SQL على قاعدة مفهرسة بدل مسح ملفات خام. رسالة الفصل: نظّم مرة، وحلّل ألف مرة.',
          en: 'And analysis flies on the organized data: gbasic.py loads 51330 messages and 1584 senders and prints Top 5 Email list participants and Top 5 Email list organizations — gmail.com leads with 7339. Its speed is chapter fifteen\u2019s gift: SQL queries over an indexed database instead of scanning raw files. The chapter\u2019s message: organize once, analyze a thousand times.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الزمن يُحسب هنا ويُرسم هناك', en: 'Time is computed here, drawn there' },
      chunks: [
        {
          ar: 'مرتا عرض أخيرتان خارجيتان: gword.py يعدّ كلمات سطور الموضوع ويكتب gword.js — النطاق Range of counts: 33229 129 — فيرسم gword.htm غيمة كلمات بأحجام متناسبة. وgline.py يعدّ الرسائل بحسب المنظمة ويكتب gline.js فيرسم gline.htm منحنى توزيع الإيميلات عبر الزمن. كلاهما ملف بيانات يستهلكه متصفح — نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية.',
          en: 'Two more displays, both external: gword.py counts subject-line words into gword.js — the range Range of counts: 33229 129 — and gword.htm draws a word cloud with proportional sizes. gline.py counts messages per organization into gline.js and gline.htm draws the distribution of email across time as a curve. Both are data files a browser consumes — we generate the chart data here; the rendering happens in an external tool.',
        },
        {
          ar: 'وما قبل الرسم عدّ يستحق التدريب: من كل ترويسة Date مثل Date: Sat, 5 Jan 2008 09:14:16 نسحب الساعة بتعبير نمطي من الفصل الحادي عشر — القوسان يلتقطان رقمين قبل أول نقطتين — ثم مدرج تكراري histogram بقاموس وأسلوب get: لكل ساعة كم رسالة؟ وأي ساعة ذروة؟ هذا نفسه المنحنى الذي سيخطه المتصفح، بأدواتك أنت.',
          en: 'And before drawing comes counting worth practicing: from every Date header like Date: Sat, 5 Jan 2008 09:14:16 we pull the hour with a chapter-eleven regex — the two parentheses capture the two digits before the first colon — then a histogram with a dict and the get idiom: for each hour, how many messages? Which hour peaks? That is the very curve the browser will trace, in tools that are yours.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مدرج ساعات الرسائل', en: 'A histogram of message hours' },
      code: "import re\n\nlines = [\n    'Date: Sat, 5 Jan 2008 09:14:16',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Date: Sat, 5 Jan 2008 18:44:02',\n    'From: louis@media.berkeley.edu',\n    '',\n    'Date: Sat, 5 Jan 2008 09:01:44',\n    'From: zqian@umich.edu',\n    '',\n    'Date: Fri, 4 Jan 2008 11:35:08',\n    'From: stephen.marquard@uct.ac.za',\n    '',\n    'Date: Fri, 4 Jan 2008 16:10:39',\n    'From: david.horwitz@uct.ac.za',\n    '',\n    'Date: Fri, 4 Jan 2008 07:02:32',\n    'From: louis@media.berkeley.edu',\n]\nhours = dict()\nfor line in lines:\n    line = line.strip()\n    if not line.startswith('Date:'):\n        continue\n    m = re.search(r'^Date: .* ([0-9][0-9]):', line)\n    if m is None:\n        continue\n    hour = m.group(1)\n    hours[hour] = hours.get(hour, 0) + 1\n\nfor hour in sorted(hours):\n    print('hour %s: %d' % (hour, hours[hour]))\nbest = None\nfor hour in hours:\n    if best is None or hours[hour] > hours[best]:\n        best = hour\nprint('peak hour: %s' % best)\nprint('messages: %d' % sum(hours.values()))",
      explanation: {
        ar: 'الفلتر startswith يمرّ أسطر Date فقط فيتجاهل From والفارغة. التعبير النمطي مرساة ^Date ثم أي شيء ثم فراغ ورقمان قبل نقطتين — القوسان يلتقطان 09 من 09:14:16 (وليس 14 لأنها لا يسبقها فراغ). المدرج قاموس get من الفصل التاسع، والطباعة بsorted تعطي الترتيب الزمني 07 و09 و11 و16 و18، والذروة 09 برسالتين، والمجموع 6. هذا جدول ما سيجلسه المتصفح كمنحنى.',
        en: 'The startswith filter lets Date lines only, ignoring From and blanks. The regex anchors ^Date, then anything, then a space and two digits before a colon — the parentheses capture 09 from 09:14:16 (not 14, which no space precedes). The histogram is the chapter-nine get dict, sorted printing gives the time order 07, 09, 11, 16, 18, the peak is 09 with two messages, and the sum is 6. This table is exactly what the browser would curve.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.hours-write',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الرسائل الخمس معطاة في المحرر كأسطر Date وFrom وفواصل فارغة. 1) ابنِ قاموس hours: لكل سطر يبدأ بـ Date: استخرج الساعة بتعبير نمطي r\u2019^Date: .* ([0-9][0-9]):\u2019 واحصها بأسلوب get. 2) اطبع لكل ساعة في sorted(hours) سطر hour %s: %d. 3) أوجد الذروة بحلقة علم None واطبع peak hour: %s ثم messages: %d بمجموع القيم. المتوقع: hour 07: 1 ثم hour 10: 3 ثم hour 13: 1 ثم peak hour: 10 ثم messages: 5.',
        en: 'The five messages are given in the editor as Date and From lines with blank separators. 1) Build an hours dict: for every line starting with Date: extract the hour with the regex r\u2019^Date: .* ([0-9][0-9]):\u2019 and count it with the get idiom. 2) For each hour in sorted(hours) print hour %s: %d. 3) Find the peak with a None-flag loop and print peak hour: %s then messages: %d with the sum of values. Expected: hour 07: 1, then hour 10: 3, then hour 13: 1, then peak hour: 10, then messages: 5.',
      },
      starterCode: "import re\n\nmail = [\n    'Date: Sun, 6 Jan 2008 10:20:05',\n    'From: wagner@taylor.edu',\n    '',\n    'Date: Sun, 6 Jan 2008 10:51:12',\n    'From: antranig@caret.cam.ac.uk',\n    '',\n    'Date: Sun, 6 Jan 2008 07:15:30',\n    'From: ggolden22@mac.com',\n    '',\n    'Date: Sun, 6 Jan 2008 13:44:55',\n    'From: tpamsler@ucdavis.edu',\n    '',\n    'Date: Sun, 6 Jan 2008 10:03:20',\n    'From: lance@indiana.edu',\n]\nhours = dict()\n# 1) فلتر startswith('Date:') + re.search(r'^Date: .* ([0-9][0-9]):', line) + get idiom\n# 2) اطبع hour %s: %d لكل ساعة في sorted(hours)\n# 3) الذروة بعلم None ثم peak hour: %s وmessages: %d\n",
      solution: "import re\n\nmail = [\n    'Date: Sun, 6 Jan 2008 10:20:05',\n    'From: wagner@taylor.edu',\n    '',\n    'Date: Sun, 6 Jan 2008 10:51:12',\n    'From: antranig@caret.cam.ac.uk',\n    '',\n    'Date: Sun, 6 Jan 2008 07:15:30',\n    'From: ggolden22@mac.com',\n    '',\n    'Date: Sun, 6 Jan 2008 13:44:55',\n    'From: tpamsler@ucdavis.edu',\n    '',\n    'Date: Sun, 6 Jan 2008 10:03:20',\n    'From: lance@indiana.edu',\n]\nhours = dict()\nfor line in mail:\n    line = line.strip()\n    if not line.startswith('Date:'):\n        continue\n    m = re.search(r'^Date: .* ([0-9][0-9]):', line)\n    if m is None:\n        continue\n    hour = m.group(1)\n    hours[hour] = hours.get(hour, 0) + 1\n\nfor hour in sorted(hours):\n    print('hour %s: %d' % (hour, hours[hour]))\nbest = None\nfor hour in hours:\n    if best is None or hours[hour] > hours[best]:\n        best = hour\nprint('peak hour: %s' % best)\nprint('messages: %d' % sum(hours.values()))",
      tests: [
        {
          id: 't1',
          name: { ar: 'ساعة الذروة محصورة في القاموس', en: 'The peak hour is captured in the dict' },
          code: "assert hours['10'] == 3, 'expected: hours[10] == 3 | actual: %r' % (hours.get('10'),)",
          expected: 'hours[10] == 3',
        },
        {
          id: 't2',
          name: { ar: 'سطر الذروة مطبوع', en: 'The peak line is printed' },
          code: "assert 'hour 10: 3' in __learner_output__, 'expected: hour 10: 3 | actual: %r' % __learner_output__",
          expected: 'hour 10: 3',
        },
        {
          id: 't3',
          name: { ar: 'الذروة مطبوعة صحيحة', en: 'The peak is printed correctly' },
          code: "assert 'peak hour: 10' in __learner_output__, 'expected: peak hour: 10 | actual: %r' % __learner_output__",
          expected: 'peak hour: 10',
        },
        {
          id: 't4',
          name: { ar: 'المجموع رسائل الخمس', en: 'The sum is the five messages' },
          code: "assert 'messages: 5' in __learner_output__, 'expected: messages: 5 | actual: %r' % __learner_output__",
          expected: 'messages: 5',
        },
        {
          id: 't5',
          name: { ar: 'لا تسريب من أسطر From', en: 'No leakage from From lines' },
          code: "assert len(hours) == 3, 'expected: 3 hour buckets | actual: %r' % (sorted(hours),)",
          expected: '3 hour buckets',
        },
      ],
      hints: [
        { ar: 'انسخ هيكل worked حرفيًّا: الفلتر ثم التعبير النمطي ثم if m is None ثم العدّ.', en: 'Copy the worked structure literally: the filter, then the regex, then if m is None, then counting.' },
        { ar: 'العدّ: hours[hour] = hours.get(hour, 0) + 1 — المفتاح نص \u201910\u2019 كما التقطه القوسان لا عدد.', en: "Counting: hours[hour] = hours.get(hour, 0) + 1 — the key is the text '10' as the parentheses captured it, not a number." },
        { ar: 'الطباعة: for hour in sorted(hours): print(\u2019hour %s: %d\u2019 % (hour, hours[hour])) — sorted يرتب النصوص \u201907\u2019 و\u201910\u2019 و\u201913\u2019 زمنيًّا.', en: "Printing: for hour in sorted(hours): print('hour %s: %d' % (hour, hours[hour])) — sorted orders the texts \u201907\u2019, \u201910\u2019, \u201913\u2019 chronologically." },
        { ar: 'الذروة والمجموع: حلقة علم None ثم peak hour ثم sum(hours.values()) — وسطران أخيران فقط.', en: 'Peak and sum: the None-flag loop, then peak hour, then sum(hours.values()) — only two final lines.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-hour',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import re\nline = 'Date: Fri, 4 Jan 2008 16:10:39'\nm = re.search(r'^Date: .* ([0-9][0-9]):', line)\nprint(bool(m))\nprint(m.group(1))",
      solution: 'True\n16',
      answer: 'True\n16',
      hints: [
        { ar: 'المرساة ^Date تحدث في بداية السطر فالتطابق ينجح.', en: 'The ^Date anchor matches at the line\u2019s start, so the search succeeds.' },
        { ar: 'القوسان يلتقطان أول فراغ ورقمين ونقطتين — وهنا 16 من 16:10:39.', en: 'The parentheses capture a space, two digits and a colon — here 16 from 16:10:39.' },
        { ar: 'bool تحول كائن التطابق إلى True.', en: 'bool turns the match object into True.' },
        { ar: 'الخرْج:\nTrue\n16', en: 'The output:\nTrue\n16' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-pipeline',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'رتّب خط أنابيب الكتاب البريدي بالترتيب الصحيح.',
        en: 'Order the book\u2019s mail pipeline correctly.',
      },
      options: [
        { id: 'a', text: { ar: 'gmane.py يزحف إلى content.sqlite، ثم gmodel.py ينظّف إلى index.sqlite، ثم gbasic.py يحلل، ثم gword.py وgline.py يكتبان ملفات العرض', en: 'gmane.py crawls into content.sqlite, then gmodel.py cleans into index.sqlite, then gbasic.py analyzes, then gword.py and gline.py write the display files' } },
        { id: 'b', text: { ar: 'gbasic.py أولًا ثم الزحف ثم التنظيف', en: 'gbasic.py first, then crawling, then cleaning' } },
        { id: 'c', text: { ar: 'gword.py يزحف وgmane.py يرسم', en: 'gword.py crawls and gmane.py draws' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'لا تحليل قبل جمع — لا تنظيف قبل مادة خام.', en: 'No analysis before collection — no cleaning before raw material.' },
        { ar: 'التنظيف يكتب نسخة أصغر مضغوطة يطير عليها التحليل.', en: 'Cleaning writes the smaller compressed copy the analysis flies over.' },
        { ar: 'الملفات gword.js وgline.js تُكتب آخر شيء للمتصفح.', en: 'The gword.js and gline.js files are written last, for the browser.' },
        { ar: 'الجواب: أ — زحف فتنظيف فتحليل فعرض.', en: 'Answer: a — crawl, clean, analyze, display.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-histogram',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة بالإنجليزية: البنية التي تجمع كل رسالة في سلة ساعتها فتعدّ كل سلة تسمى مدرج التكراري أو ____.',
        en: 'Fill the blank with one English word: the structure that drops each message into its hour bucket and counts every bucket is a ____.',
      },
      answer: 'histogram',
      solution: 'histogram',
      hints: [
        { ar: 'تسعة أحرف — وتتكون من hist وogram كما في history.', en: 'Nine letters — hist + ogram, as in history.' },
        { ar: 'هي نفسها قاموس counts من الفصل التاسع حين تكون المفاتيح ساعات.', en: 'It is the chapter-nine counts dict when the keys are hours.' },
        { ar: 'المتصفح يرسمها أعمدة — ونحن نحسبها قاموسًا.', en: 'The browser draws it as columns — we compute it as a dict.' },
        { ar: 'الجواب: histogram', en: 'Answer: histogram' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: '# ملعبك الحرّ — مدرجك الزمني\n# Your playground — your own time histogram\n\nimport re\n\nlines = [\n    \'Date: Sat, 5 Jan 2008 09:14:16\',\n    \'Date: Sat, 5 Jan 2008 09:45:20\',\n    \'Date: Sat, 5 Jan 2008 14:20:33\',\n    \'Date: Fri, 4 Jan 2008 22:11:59\',\n]\nhours = dict()\nfor line in lines:\n    m = re.search(r\'^Date: .* ([0-9][0-9]):\', line)\n    if m is not None:\n        hour = m.group(1)\n        hours[hour] = hours.get(hour, 0) + 1\nprint(hours)\n\n# جرّب: أضف رسالة منتصف الليل 00:30 — أين تفرز بين 22 و00؟ / try: add a midnight message 00:30 — how does it sort between 22 and 00?\n# جرّب: انزع المرساة ^ من النمط — هل يتغير شيء على هذه الأسطر؟ / try: drop the ^ anchor — does anything change on these lines?\n# جرّب: احسب متوسط الساعة بعد تحويل المفاتيح إلى أعداد بـ int / try: compute the average hour after converting keys with int',
      prompt: {
        ar: 'جرّب بنفسك: مدرج على أربع رسائل. أضف رسالة ليلية وراقب فرز النصوص \u201922\u2019 و\u201900\u2019. انزع المرساة ^ وراقب — على أسطر نظيفة لا يتغير شيء، ومتى يصبح نزعها خطرًا؟ ثم حوّل المفاتيح إلى أعداد واحسب متوسط ساعة الإرسال. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: a histogram over four messages. Add a late-night message and watch how the texts \u201922\u2019 and \u201900\u2019 sort. Drop the ^ anchor and watch — on clean lines nothing changes; when does dropping it become dangerous? Then convert the keys with int and compute the average send hour. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الحادي عشر: ما دور القوسين في r\u2019^Date: .* ([0-9][0-9]):\u2019؟',
            en: 'From chapter 11: what do the parentheses do in r\u2019^Date: .* ([0-9][0-9]):\u2019?',
          },
          options: [
            { id: 'a', text: { ar: 'تلتقط ما تطابق داخلها في مجموعة نقرؤها بـ m.group(1) — هنا رقمي الساعة', en: 'They capture what matched inside as a group we read with m.group(1) — here the two hour digits' } },
            { id: 'b', text: { ar: 'تجعل التعبير أسرع', en: 'They make the regex faster' } },
            { id: 'c', text: { ar: 'تعني مجموعة اختيارية قد تغيب', en: 'They mean an optional group that may be absent' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'بحث واستخراج معًا كما في الفصل الحادي عشر: التعبير يصفي السطر والقوسان يسحبان الجزء المطلوب — group(1) هو ما بين القوسين الأولين.',
            en: 'Search and extract together, as in chapter eleven: the regex filters the line and the parentheses pull the wanted part — group(1) is what sat inside the first pair.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل التاسع: لماذا hours.get(hour, 0) + 1 وليس hours[hour] + 1؟',
            en: 'From chapter 9: why hours.get(hour, 0) + 1 and not hours[hour] + 1?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن أول رسالة في ساعة جديدة تصطدم بمفتاح غائب — get تعيد الافتراضي 0 فيبدأ العد بأمان', en: 'Because the first message in a new hour hits a missing key — get returns the default 0 so counting starts safely' } },
            { id: 'b', text: { ar: 'لأن get أسرع في القراءة', en: 'Because get reads faster' } },
            { id: 'c', text: { ar: 'لأن hours[hour] يطبع القيمة ولا يعدلها', en: 'Because hours[hour] prints the value without changing it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قراءة مفتاح غائب ترمي KeyError — وget بسلوكها الافتراضي هي ما جعل مدرجنا يقبل أي ساعة جديدة بلا حارس.',
            en: 'Reading a missing key throws KeyError — and get\u2019s default is what let our histogram accept any new hour with no guard.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما الذي يفعله gmodel.py ببيانات content.sqlite الخام؟',
            en: 'What does gmodel.py do to the raw content.sqlite data?',
          },
          options: [
            { id: 'a', text: { ar: 'ينظفها: يقصّ النطاقات si.umich.edu إلى umich.edu ويوحد الأحرف الصغيرة ويحل عناوين gmane — ويكتب index.sqlite مضغوطة', en: 'It cleans it: truncates domains si.umich.edu to umich.edu, unifies lowercase, resolves gmane addresses — and writes a compressed index.sqlite' } },
            { id: 'b', text: { ar: 'يرسم غيمة الكلمات مباشرة من الخام', en: 'It draws the word cloud straight from the raw data' } },
            { id: 'c', text: { ar: 'يرسل الرسائل من جديد إلى الخادم', en: 'It re-sends the messages to the server' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التنظيف مرحلة قائمة بذاتها: نسخة منظمة مضغوطة أصغر بعشر مرات — وgbasic.py السريع عليها لا على الخام.',
            en: 'Cleaning is a stage of its own: an organized compressed copy ten times smaller — and gbasic.py\u2019s speed runs on it, not on the raw store.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الخامس عشر: لماذا يعمل gbasic.py في ثوانٍ بينما زحف gmane.py استغرق أيامًا على البيانات نفسها؟',
            en: 'From chapter 15: why does gbasic.py finish in seconds while gmane.py\u2019s crawl took days over the same data?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يستعلم بقاعدة منظمة ومفهرسة SQL — التعقّب الشبكي بطيء لا العدّ المحلي', en: 'Because it queries an organized indexed SQL database — the network crawl is slow, not the local counting' } },
            { id: 'b', text: { ar: 'لأن gbasic.py يحذف معظم الرسائل قبل العد', en: 'Because gbasic.py deletes most messages before counting' } },
            { id: 'c', text: { ar: 'لأن SQL يحمّل البيانات من غوغل', en: 'Because SQL loads the data from Google' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفصل الخامس عشر علّمنا أسباب القواعد: بيانات ضخمة وبحث متكرر — فهنا يبني gmodel.py الفهرس مرة فيُقصّ به كل تحليل لاحق.',
            en: 'Chapter fifteen taught the reasons for databases: huge data and repeated lookup — so gmodel.py builds the index once and every later analysis lands on it.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "m = re.search(r'^Date: .* [0-9][0-9]:', line)\nhour = m.group(1)  # لا قوسين => لا مجموعة",
          right: "m = re.search(r'^Date: .* ([0-9][0-9]):', line)\nhour = m.group(1)",
          note: {
            ar: 'بلا قوسين لا توجد مجموعة رقم 1: group(1) يرمي IndexError بعد تطابق ناجح — خلل يظهر بعد الفحص لا قبله. الأقواس هي التي تحدد ما نسحبه.',
            en: 'With no parentheses there is no group 1: group(1) throws IndexError after a successful match — a flaw appearing after the check, not before. The parentheses define what you pull.',
          },
        },
        {
          wrong: "for line in lines:\n    m = re.search(r'^Date: .* ([0-9][0-9]):', line)  # بلا فلتر",
          right: "for line in lines:\n    line = line.strip()\n    if not line.startswith('Date:'):\n        continue\n    m = re.search(r'^Date: .* ([0-9][0-9]):', line)",
          note: {
            ar: 'أسطر From والفارغة تمر بلا فلتر فترمي AttributeError على m.group لكون m بقيمة None — والفلتر قبل النمط أرخص وأوضح. اربط كل مرحلة بدورها.',
            en: 'From and blank lines pass unfiltered and throw AttributeError on m.group because m is None — a filter before the regex is cheaper and clearer. Bind each stage to its role.',
          },
        },
        {
          wrong: "hour = str(int(m.group(1)))  # أسقطنا الصفر",
          right: "hour = m.group(1)  # \u201909\u2019 تبقى \u201909\u2019",
          note: {
            ar: 'int تجرد الصفر فيصير \u201909\u2019 هو 9 — والترتيب النصي يختل: \u20199\u2019 بعد \u201914\u2019! أبقِ المفاتيح نصية بطول ثابت أو استخدم %02d عند الطباعة.',
            en: 'int strips the zero so \u201909\u2019 becomes 9 — and text order breaks: \u20199\u2019 sorts after \u201914\u2019! Keep keys as fixed-width text or use %02d when printing.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'خط الأنابيب: gmane.py يزحف ببطء مسؤول إلى content.sqlite، وgmodel.py ينظّف إلى index.sqlite، وgbasic.py يحلل، وgword.js وgline.js للعرض في المتصفح.', en: 'The pipeline: gmane.py crawls slowly and responsibly into content.sqlite, gmodel.py cleans into index.sqlite, gbasic.py analyzes, and gword.js plus gline.js feed the browser display.' },
        { ar: 'الساعة تُستخرج بتعبير نمطي من الفصل الحادي عشر — القوسان يلتقطان الرقمين — والمدرج قاموس get من الفصل التاسع، والذروة حلقة علم None.', en: 'The hour is extracted with a chapter-eleven regex — the parentheses capture the two digits — the histogram a chapter-nine get dict, the peak a None-flag loop.' },
        { ar: 'نولّد بيانات الرسم هنا؛ والعرض يحدث في أداة خارجية: غيمة الكلمات والمنحنى الزمني يستهلكان gword.js وgline.js في متصفح.', en: 'We generate the chart data here; the rendering happens in an external tool: the word cloud and time curve consume gword.js and gline.js in a browser.' },
      ],
      reflectPrompt: {
        ar: 'لو أردت منحنى الرسائل بحسب يوم الأسبوع بدل الساعة، فما الذي يتغير في نمطك النمطي؟ وماذا يكتب gline.js في ملفه؟ صِف بنية السطر الذي ستضعه في ملف بيانات المتصفح.',
        en: 'For a curve by day of week instead of hour, what changes in your regex? And what would gline.js write in its file? Describe the shape of the line you would put in a browser data file.',
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
