import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch12.l6 — "Chapter 12 Review and Project: Quality Metrics Dashboard
 * مراجعة الفصل 12 ومشروع: لوحة مقاييس الجودة"
 * Aligned with SWE ch12 s10 (12.10 Conclusion, pp.334-335), recapping s1-s9.
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * PROJECT-DASHBOARD design: one instrumented dashboard over the chapter's
 * fixed datasets (the 11-release defects dict + the l3 before/prod pipeline):
 * ASCII '#' bars, mean/stdev/escape rates, a beyond mean+s regression flag and
 * a one-line summary — plus a pstdev-vs-stdev wrong-CI debug block.
 * Deterministic only: no interactive reads, no exit, no seeding of any kind.
 */
const lesson = {
  id: 'swe.ch12.l6',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 12,
  title: { ar: 'مراجعة الفصل 12 ومشروع: لوحة مقاييس الجودة', en: 'Chapter 12 Review and Project: Quality Metrics Dashboard' },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch12.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'خمسة دروس وبقيت خطوة واحدة: لوحة تقول الحقيقة كاملة. نصف الفصل القياسي قال: ابدأ من هدف GQM لا من رقم، وسمِّ أي جودة تقيس، وطبع العيوب عبر DRE ومعدل الإفلات والتطبيع بالتعرض، وحذر أن كل مقياس صار هدفًا سيُلعب. ونصفه الإحصائي قال: الرقم بلا تشتت يخدع، وs وσ وجهان بمقامين، والمتوسط بلا فاصل ثقة تخمين، والانحدار معدل داخل مداه لا سحر خارجه. مشروع اليوم يصهر النصفين في ملف واحد: لوحة على قاموس الإصدارات الثابت — شريط # لكل إصدار، وانحراف عينة، وراية انحدار لمن تجاوز المتوسط بمقدار s، ومعدلات إفلات من خط أنابيب الدرس الثالث، وسطر ملخص واحد يقرأ به المدير كل شيء — ثم كتلة تصحيح تذكّرك أن فاصلًا أضيق من الصحيح عيب قياس لا بركة. بنهاية الدرس ستكون قادرًا على: بناء لوحة تحسب وتعرض وترفع راياتها، وقراءة كل رقم عليها بأشرطة خطأ.',
        en: 'Five lessons and one step left: a board that tells the whole truth. The chapter\u2019s measurement half said: start from a GQM goal, not a number; name which quality you measure; read defects through DRE, escape rate and exposure normalization; and expect any metric turned into a target to be gamed. Its statistical half said: a number without spread misleads; s and \u03c3 are two faces with two divisors; a mean without a confidence interval is a guess; and regression is a rate inside its range, not magic beyond it. Today\u2019s project fuses the halves into one file: a dashboard over the fixed releases dict — a # bar per release, a sample stdev, a regression flag for anything beyond mean + s, escape rates from lesson three\u2019s pipeline, and a one-line summary a manager actually reads — then a debug block reminding you that an interval too narrow is a measurement defect, not a blessing. By the end you will be able to: build a dashboard that computes, renders and raises its flags, and read every number on it with error bars.',
      },
    },
    {
      kind: 'predict',
      code: "releases = {'r1': 2, 'r2': 4, 'r3': 5}\ntotal = sum(releases.values())\nprint('releases: %d / mean: %.1f' % (len(releases), total / len(releases)))",
      question: {
        ar: 'هذا سطر ملخص من لوحة. ما الذي ينقصه حتى تستحق اسم «لوحة مقاييس جودة» — وما الرقم الذي سيطلبه مديرك أولًا؟',
        en: 'This is one summary line from a dashboard. What is it missing before it deserves the name \u201cquality metrics dashboard\u201d — and which number would your manager ask for first?',
      },
      reveal: {
        ar: 'الطباعة: releases: 3 / mean: 3.7. السطر يفقد ثلاثة أشياء: التشتت (هل العيوب 2-5 أم 0-30؟)، والشكل (شريط # يرى به عينك)، والذروة (أي إصدار هو الأسوأ؟). سطر الدرس الأولى أعاد نفس المعلومة — والفصل كله أضاف ما حوله: s وفاصلًا وراية وخط أنابيب إفلات. مشروع اليوم يطبعه كله دفعة واحدة.',
        en: 'It prints releases: 3 / mean: 3.7. The line lacks three things: dispersion (are defects 2-5 or 0-30?), shape (a # bar your eye can read), and the peak (which release is worst?). Lesson one\u2019s line printed the same fact — the whole chapter added what surrounds it: s, an interval, a flag, an escape pipeline. Today\u2019s project prints it all at once.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل: نصفان ينتهيان عند رقم صادق', en: 'The chapter map: two halves ending in an honest number' },
      chunks: [
        {
          ar: 'النصف القياسي (الدروس 1-3): المقياس قاعدة تسند رقمًا إلى خاصية كيانٍ ما — صالحٌ إذا تتبع الواقع بالاتجاه وموثوقٌ إذا كرر قيمته، والاثنان مختلفان (عدّ الأسطر موثوق وغير صالح). والمقياس المفيد ذو صلة وقابل للتنفيذ ورخيص كفاية ومقاوم للتلاعب — وGoodhart يقول إن أي مقياس صار هدف حوافز سيُحسَّن على حساب الغاية، فعايره بمقياس مضاد. وGQM يمنح الاتجاه: هدف ← سؤال ← مقياس، وما لا يجيب سؤالًا حيًا يُحذف من اللوحة.',
          en: 'The measurement half (lessons 1-3): a metric is a rule assigning a number to an entity\u2019s attribute — valid if it tracks reality in direction, reliable if it repeats its value, and the two differ (a line counter is reliable and invalid). A useful metric is relevant, actionable, cheap enough and gaming-resistant — and Goodhart warns that any metric turned into an incentive target gets optimized at the goal\u2019s expense, so pair it with a counter-metric. GQM gives the direction: goal \u2192 question \u2192 metric, and what answers no live question is deleted from the board.',
        },
        {
          ar: 'ومقاييس العيوب: DRE = 100 × D_before ÷ (D_before + D_after) حصة شباكك الداخلية من كل ما وُجد يومًا — 720 و80 أعطت 90% ومعدل إفلات مكمّل 10% — وهي مؤقتة حتى تنقضي نافذة القياس. وعيب العملاء يُطبَّع بالتعرض قبل المقارنة: لكل ألف تنصيب لا للعدّ الخام — فالعدّ الخام يقيس التنصيبتات والمطبَّع يقيس الجودة. ودورة القياس التحسينية: هدف → مقياس → فعل → إعادة قياس، بفاصل ثقة على النتيجة لا إحساس.',
          en: 'And the defect metrics: DRE = 100 \u00d7 D_before / (D_before + D_after), your internal nets\u2019 share of everything that ever existed — 720 and 80 gave 90% with a complementary escape rate of 10% — provisional until the measurement window closes. Customer-found defects are normalized by exposure before comparison: per thousand installs, not raw — raw counts measure installs, normalized ones measure quality. And the improvement loop: goal \u2192 metric \u2192 action \u2192 re-measure, judged by a confidence interval on the result, not by a feeling.',
        },
        {
          ar: 'النصف الإحصائي (الدروس 4-5): القمم الخمس والصندوق كشفا الشكل والشاذ 23، وIQR = 7 وs² = 342/10 = 34.2 فs ≈ 5.85 عينة وσ ≈ 5.58 مجتمع — وstdev/pstdev اسمان صريحان بينما بعض المكتبات تنقسم بصمت على n. ثم المتوسط بأشرطة خطأ: x̄ ± t*·s/√n أعطى (5.07, 12.93) بقيمة t = 2.228 — وثقةٌ للإجراء لا للفاصل. والانحدار ŷ = 2 + 1.5x بميلٍ معدل وR² ≈ 0.957 داخل مدى 2-10 ألف سطر فقط. خلاصة الكتاب: رقم بلا هدف هدر، ورقم بلا uncertainty تظاهر.',
          en: 'The statistical half (lessons 4-5): the five-number summary and boxplot revealed the shape and the outlier 23; IQR = 7 and s\u00b2 = 342/10 = 34.2 so s \u2248 5.85 for a sample and \u03c3 \u2248 5.58 for a population — stdev/pstdev are explicit names while some libraries silently divide by n. Then the mean with error bars: x\u0304 \u00b1 t*\u00b7s/\u221an gave (5.07, 12.93) at t = 2.228 — with confidence in the procedure, not one interval. And regression \u0177 = 2 + 1.5x, a rate slope with R\u00b2 \u2248 0.957, inside the 2\u201310 KLOC range only. The book\u2019s verdict: a number without a goal is waste; a number without its uncertainty is theater.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'اللوحة التي لا تخدع: أربعة أسطر تحكم', en: 'The dashboard that does not lie: four lines that govern' },
      chunks: [
        {
          ar: 'اللوحة الناضجة قصيرة وكل سطر فيها له وظيفة: الشريط # — إرث الدرس الثاني — يعطي الطول للعين والقيمة للحكم في سطر واحد لكل كيان؛ والانحراف s (عينة، n−1) يقرأ التشتت الذي يخفيه المتوسط؛ والراية تُرفع لمن تجاوز حدًّا معلنًا مثل mean + s — فالإصدار الأبعد عن الحشد هو سؤال التحقيق الأول، والراية سؤالٌ لا حكم؛ ومعدلات الإفلات من خط الأنابيب تقرأ الجودة الهاربة لا المبلَّغة.',
          en: 'A mature dashboard is short and every line has a job: the # bar — lesson two\u2019s legacy — gives length to the eye and the value to judgment, one row per entity; the sample stdev s (n\u22121) reads the dispersion the mean hides; the flag rises for anything beyond a declared limit like mean + s — the release farthest from the pack is the first investigation question, and a flag is a question, not a verdict; and escape rates from the pipeline read the quality that escaped, not the quality that was reported.',
        },
        {
          ar: 'وسطر الملخص هو الواجهة: releases: %d / mean defects: %.1f / worst: %s — ثلاثة قرارات في سطر واحد: حجم العينة، والمركز، وأسوأ كيان. لكن اللوحة بلا سياق تخدع كما تخدع لوحة مزدحمة: كل رقم يجب أن يجيب سؤالًا حيًا تحت هدف معلن (GQM)، وكل مقياس بحوافز يقترن بمضاد، وكل متوسط يظهر بفاصله. هكذا تحوّل اللوحة من مسرح أرقام إلى عقد قياس يُحاسَب عليه الفصل كله.',
          en: 'And the summary line is the interface: releases: %d / mean defects: %.1f / worst: %s — three decisions in one line: sample size, center, worst entity. But a context-free board deceives exactly like a crowded one: every number must answer a live question under a declared goal (GQM), every incentivized metric must carry its counter-metric, and every mean must appear with its interval. That turns a dashboard from number theater into a measurement contract the whole chapter can be held to.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'اللوحة مصغّرة: ثلاثة إصدارات', en: 'The dashboard in miniature: three releases' },
      code: "import statistics\nreleases = {'r1': 2, 'r2': 4, 'r3': 5}\nn = len(releases)\nmean = sum(releases.values()) / n\ns = statistics.stdev(releases.values())\nfor k in releases:\n    print('%-3s |%s %d' % (k, '#' * releases[k], releases[k]))\nworst = 'r1'\nfor k in releases:\n    if releases[k] > releases[worst]:\n        worst = k\nfor k in releases:\n    if releases[k] > mean + s:\n        print('flag: %s (%d > mean+s %.2f)' % (k, releases[k], mean + s))\nprint('releases: %d / mean defects: %.1f / worst: %s' % (n, mean, worst))",
      explanation: {
        ar: 'أربعة مكونات تلاحظها: الشريط بنمط الدرس الثاني — %-3s يحاذي الاسم يسارًا في حقل ثلاثي ثم عمود | ثم # بطول القيمة ثم القيمة نفسها؛ والانحراف sample: statistics.stdev(releases.values()) تعمل على قيم القاموس مباشرة (3.6667 وs ≈ 1.53)؛ وحلقة الراية — لا إصدار هنا تجاوز mean + s ≈ 5.19 فلا أسطر راية تُطبع، وغياب الراية معلومة أيضًا؛ وسطر الملخص النهائي: releases: 3 / mean defects: 3.7 / worst: r3. المشروع يوسّع الصورة إلى الإصدارات الأحد عشر كاملة مع خط أنابيب الإفلات من الدرس الثالث — وحين يظهر الإصدار الشاذ 23 ستترى الراية تعمل فعلًا.',
        en: 'Four components to notice: the bar in lesson two\u2019s pattern — %-3s left-aligns the name in a three-wide field, then a | column, then a # run as long as the value, then the value itself; the sample stdev: statistics.stdev(releases.values()) consumes the dict\u2019s values directly (mean 3.6667, s \u2248 1.53); the flag loop — no release here exceeds mean + s \u2248 5.19, so no flag lines print, and a silent flag is information too; and the closing summary line: releases: 3 / mean defects: 3.7 / worst: r3. The project scales this to all eleven releases plus lesson three\u2019s escape pipeline — and when the outlier 23 shows up you will see the flag actually fire.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-bars',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. مراجعة سريعة من PY4E: sorted على قاموس يعيد مفاتيحه مرتبة، و# * n يكرر الحرف.',
        en: 'Read the code and predict its exact output — one line per print — without running it. A quick PY4E refresher: sorted over a dict returns its keys in order, and # * n repeats the character.',
      },
      code: "data = {'a': 3, 'b': 1, 'c': 4}\nfor k in sorted(data):\n    print('%s |%s %d' % (k, '#' * data[k], data[k]))",
      solution: 'a |### 3\nb |# 1\nc |#### 4',
      answer: 'a |### 3\nb |# 1\nc |#### 4',
      hints: [
        { ar: 'sorted(data) يعيد المفاتيح مرتبة هجائيًّا: a ثم b ثم c — هنا يطابق ترتيب الإدراج، لكن السبب هو الترتيب لا القاموس.', en: 'sorted(data) returns the keys alphabetically: a, then b, then c — here that matches insertion order, but the cause is the sort, not the dict.' },
        { ar: '# * 3 يعطي ### و# * 1 يعطي # — تكرار السلاسل هو مصور الأعمدة كله.', en: '# * 3 gives ### and # * 1 gives # — string repetition is the whole chart renderer.' },
        { ar: 'كل سطر ثلاثة أجزاء بالصيغة %s |%s %d: الاسم، فراغ، عمود |، الشريط بلا فراغ قبله، فراغ، القيمة — لاحظ غياب أي حشوة عرض هنا.', en: 'Each row has three parts per the %s |%s %d format: the name, a space, the | column, the bar with no gap before it, a space, the value — note the absence of any width padding here.' },
        { ar: 'الخرج:\na |### 3\nb |# 1\nc |#### 4', en: 'The output:\na |### 3\nb |# 1\nc |#### 4' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.project-dashboard',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: لوحة مقاييس الجودة على بيانات الفصل الثابتة (releases وpipeline جاهزان في البداية مع import statistics). خزّن n = عدد الإصدارات، وmean = المتوسط بقسمة حقيقية، وs = statistics.stdev(releases.values()) — عينة! — وworst = مفتاح القيمة الأكبر بحلقة. ثم اطبع بالترتيب: (1) سطرًا لكل إصدار بترتيب القاموس بصيغة %-4s |%s %d حرفيًّا — الاسم بحقل عرض 4، ثم عمود |، ثم شريط # بطول العيوب، ثم القيمة؛ (2) لكل إصدار قيمته فوق mean + s سطر flag: %s (%d > mean+s %.2f)؛ (3) من خط أنابيب الدرس الثالث: لكل إصدار في pipeline سطر %s DRE: %.1f%% مع جمع before وprod، ثم بعد الحلقة سطر pooled escape: %.1f%% = 100 × مجموع prod ÷ (مجموع before + مجموع prod)؛ (4) السطر الختامي: releases: %d / mean defects: %.1f / worst: %s. المتوقع: شريط r11 بـ23 حرفًا، وflag: r11 (23 > mean+s 14.85)، وr1 DRE: 90.0% وr2 DRE: 93.0% وpooled escape: 8.8%، وreleases: 11 / mean defects: 9.0 / worst: r11.',
        en: 'The project: a quality metrics dashboard over the chapter\u2019s fixed data (releases and pipeline are given in the starter, along with import statistics). Store n = number of releases, mean = the mean with true division, s = statistics.stdev(releases.values()) — a sample! — and worst = the key with the largest value via a loop. Then print in order: (1) one line per release in dict order using the format %-4s |%s %d verbatim — the name in a 4-wide field, then the | column, then a # bar as long as the defect count, then the value; (2) for every release whose value exceeds mean + s, a line flag: %s (%d > mean+s %.2f); (3) from lesson three\u2019s pipeline: for each release in pipeline a line %s DRE: %.1f%% while accumulating before and prod, then after the loop pooled escape: %.1f%% = 100 x sum of prod / (sum of before + sum of prod); (4) the closing line: releases: %d / mean defects: %.1f / worst: %s. Expected: an r11 bar of 23 characters, flag: r11 (23 > mean+s 14.85), r1 DRE: 90.0% and r2 DRE: 93.0% and pooled escape: 8.8%, and releases: 11 / mean defects: 9.0 / worst: r11.',
      },
      starterCode: "import statistics\nreleases = {'r1': 2, 'r2': 4, 'r3': 5, 'r4': 5, 'r5': 7, 'r6': 8,\n            'r7': 9, 'r8': 10, 'r9': 12, 'r10': 14, 'r11': 23}\npipeline = {'r1': {'before': 720, 'prod': 80}, 'r2': {'before': 465, 'prod': 35}}\n\n# n وmean وs (عينة stdev) وworst بحلقة\n# n, mean, s (sample stdev), worst via a loop\n\n# (1) شريط # لكل إصدار بصيغة %-4s |%s %d\n# (1) a # bar per release via %-4s |%s %d\n\n# (2) راية انحدار لكل إصدار فوق mean + s\n# (2) a regression flag for every release beyond mean + s\n\n# (3) DRE لكل إصدار في pipeline ثم pooled escape\n# (3) per-release DRE over pipeline, then pooled escape\n\n# (4) سطر الملخص\n# (4) the summary line\n",
      solution: "import statistics\nreleases = {'r1': 2, 'r2': 4, 'r3': 5, 'r4': 5, 'r5': 7, 'r6': 8,\n            'r7': 9, 'r8': 10, 'r9': 12, 'r10': 14, 'r11': 23}\npipeline = {'r1': {'before': 720, 'prod': 80}, 'r2': {'before': 465, 'prod': 35}}\nn = len(releases)\nmean = sum(releases.values()) / n\ns = statistics.stdev(releases.values())\nworst = 'r1'\nfor k in releases:\n    if releases[k] > releases[worst]:\n        worst = k\nfor k in releases:\n    print('%-4s |%s %d' % (k, '#' * releases[k], releases[k]))\nfor k in releases:\n    if releases[k] > mean + s:\n        print('flag: %s (%d > mean+s %.2f)' % (k, releases[k], mean + s))\nsum_before = 0\nsum_prod = 0\nfor k in pipeline:\n    d = pipeline[k]\n    dre = 100.0 * d['before'] / (d['before'] + d['prod'])\n    print('%s DRE: %.1f%%' % (k, dre))\n    sum_before += d['before']\n    sum_prod += d['prod']\nescape = 100.0 * sum_prod / (sum_before + sum_prod)\nprint('pooled escape: %.1f%%' % escape)\nprint('releases: %d / mean defects: %.1f / worst: %s' % (n, mean, worst))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الشريط مرسوم بالعرض المطلوب', en: 'The bars are drawn with the required widths' },
          code: "assert ('r11  |' + '#' * 23) in __learner_output__ and ('r1   |## 2') in __learner_output__, 'expected: r11 bar of 23 and r1 padded row | actual: %r' % __learner_output__",
          expected: 'r11 bar of 23 and r1 padded row',
        },
        {
          id: 't2',
          name: { ar: 'الراية ترتفع لـr11 وحده', en: 'The flag rises for r11 alone' },
          code: "assert 'flag: r11 (23 > mean+s 14.85)' in __learner_output__ and 'flag: r7' not in __learner_output__, 'expected: only flag: r11 (23 > mean+s 14.85) | actual: %r' % __learner_output__",
          expected: 'only flag: r11 (23 > mean+s 14.85)',
        },
        {
          id: 't3',
          name: { ar: 'معدلات الإفلات من الدرس الثالث صحيحة', en: 'Lesson three\u2019s escape rates are correct' },
          code: "assert 'r1 DRE: 90.0%' in __learner_output__ and 'r2 DRE: 93.0%' in __learner_output__ and 'pooled escape: 8.8%' in __learner_output__, 'expected: r1 DRE: 90.0% then r2 DRE: 93.0% then pooled escape: 8.8% | actual: %r' % __learner_output__",
          expected: 'r1 DRE: 90.0% then r2 DRE: 93.0% then pooled escape: 8.8%',
        },
        {
          id: 't4',
          name: { ar: 'سطر الملخص والقيم المحسوبة', en: 'The summary line and computed values' },
          code: "assert 'releases: 11 / mean defects: 9.0 / worst: r11' in __learner_output__ and abs(mean - 9.0) < 1e-9 and abs(s - statistics.stdev(releases.values())) < 1e-9 and worst == 'r11', 'expected: summary line, mean 9.0, sample s, worst r11 | actual: %r' % ((mean, s, worst),)",
          expected: 'summary line, mean 9.0, sample s, worst r11',
        },
      ],
      hints: [
        { ar: 'الأربعة أعداد: n = 11 وmean = 99/11 = 9.0 وs = statistics.stdev(releases.values()) ≈ 5.85 وworst = r11 — الأربعة أسماء متغيرات مطلوبة لأن الاختبارات تقرؤها.', en: 'The four numbers: n = 11, mean = 99/11 = 9.0, s = statistics.stdev(releases.values()) \u2248 5.85, worst = r11 — these variable names are required because the tests read them.' },
        { ar: 'الشريط نمط الدرس الثاني والشارح المصغّر: print(\'%-4s |%s %d\' % (k, \'#\' * releases[k], releases[k])) — لاحظ فراغًا قبل | وحشوة العرض 4 لكل اسم حتى r10.', en: "The bar is lesson two's pattern and the worked example's: print('%-4s |%s %d' % (k, '#' * releases[k], releases[k])) — note the space before | and the width-4 padding for every name up to r10." },
        { ar: 'الراية مقارنة واحدة لكل إصدار: if releases[k] > mean + s — القيمة الحدية 14.85 فلا يبلغها إلا 23؛ وخط الأنابيب حرفيًّا حلقة تمرين الدرس الثالث: dre = 100.0 * d[\'before\'] / (d[\'before\'] + d[\'prod\']) مع الجمع ثم pooled escape.', en: "The flag is one comparison per release: if releases[k] > mean + s — the threshold is 14.85 so only 23 crosses; and the pipeline is verbatim lesson three's exercise loop: dre = 100.0 * d['before'] / (d['before'] + d['prod']) with accumulation, then pooled escape." },
        { ar: 'الهيكل:\nn = len(releases)\nmean = sum(releases.values()) / n\ns = statistics.stdev(releases.values())\nfor k in releases:\n    print(\'%-4s |%s %d\' % (k, \'#\' * releases[k], releases[k]))\nfor k in releases:\n    if releases[k] > mean + s:\n        print(\'flag: %s (%d > mean+s %.2f)\' % (k, releases[k], mean + s))\n# ثم حلقة pipeline وpooled escape وسطر الملخص\n# then the pipeline loop, pooled escape and the summary line\nprint(\'releases: %d / mean defects: %.1f / worst: %s\' % (n, mean, worst))', en: "The skeleton:\nn = len(releases)\nmean = sum(releases.values()) / n\ns = statistics.stdev(releases.values())\nfor k in releases:\n    print('%-4s |%s %d' % (k, '#' * releases[k], releases[k]))\nfor k in releases:\n    if releases[k] > mean + s:\n        print('flag: %s (%d > mean+s %.2f)' % (k, releases[k], mean + s))\n# then the pipeline loop, pooled escape and the summary line\nprint('releases: %d / mean defects: %.1f / worst: %s' % (n, mean, worst))" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-dashboard',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'رؤية القسم تطلب «رقم جودة واحدًا» يلخص كل شيء في لوحة بعُشر سطر. أي رد يجسد خلاصة الفصل كله؟',
        en: 'The division\u2019s leadership asks for \u201cone quality number\u201d summarizing everything on a ten-line dashboard. Which response embodies the whole chapter\u2019s verdict?',
      },
      options: [
        { id: 'a', text: { ar: 'رقم مركب واحد بأوزان مرجّحة — أبسط ما يُعرض ويقرأ', en: 'One weighted composite score — the simplest thing to display and read' } },
        { id: 'b', text: { ar: 'سمِّ أي جودة تقيس (وظيفية/إجرائية/منتج/تشغيلية)، واربط كل مقياس بهدف GQM وسؤال حي، واقرنه بمقياس مضاد، وأبلغ كل رقم بفاصله — لا رقم واحد يروي الحقيقة', en: 'Name which quality you measure (functional/process/product/operational), tie every metric to a GQM goal and a live question, pair it with a counter-metric, and report every number with its interval — no single number tells the truth' } },
        { id: 'c', text: { ar: 'رضا العملاء وحده يكفي لأنه النتيجة النهائية التي تدفع الفواتير', en: 'Customer satisfaction alone suffices because it is the final result that pays the bills' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: '«الجودة» ليست شيئًا واحدًا — الدرس الأول فتح بهذا: قبل أن تقيس قل أي جودة ومن وجهة نظر من، وإلا اجتمع أشخاص يتكلمون عن أشياء مختلفة باسم واحد.', en: '\u201cQuality\u201d is not one thing — lesson one opened with this: before measuring, say which quality and whose viewpoint, or people argue different things under one name.' },
        { ar: 'الرقم المركب يخفي أضدادًا: جودة تشغيلية تنهار وجودة منتج ترتفع في متوسط واحد يبدو مستقرًا — والخداع أنظف فيه.', en: 'A composite hides opposites: operational quality collapsing while product quality rises looks stable in one average — the cleanest deception of all.' },
        { ar: 'ولكل رقم بلا سؤال حي كلفة جمع ومدعوة للتلاعب (Goodhart)، وكل متوسط بلا فاصل تخمين — هذه قواعد لوحة لا تُكسر لأجل الاختصار.', en: 'And every number answering no live question costs collection and invites gaming (Goodhart), every mean without an interval is a guess — board rules not broken for brevity.' },
        { ar: 'الجواب: b — هدف، وسؤال، ومقياس ومضاد، وفاصل: الحزمة الكاملة.', en: 'Answer: b — goal, question, metric, counter-metric, interval: the full pack.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.t-margin',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'فاصل t بقيمة 95% على بياناتنا كان 9 ± هامش، وحدّه الأعلى 12.93. كم الهامش نفسه (t* × SE) بمنزلتين عشريتين؟ (رقم فقط)',
        en: 'The 95% t interval on our data was 9 \u00b1 margin, with its upper end at 12.93. What is the margin itself (t* \u00d7 SE) to two decimals? (number only)',
      },
      answer: '3.93',
      solution: '3.93',
      tolerance: 0.01,
      hints: [
        { ar: 'SE = s/√n = 5.848/√11 ≈ 1.763 — من الشارح الماضي مباشرة.', en: 'SE = s/\u221an = 5.848/\u221a11 \u2248 1.763 — straight from last lesson\u2019s worked example.' },
        { ar: 'الهامش = t* × SE = 2.228 × 1.763 — اضرب يدويًّا أو تذكّر الحد الأعلى.', en: 'The margin = t* \u00d7 SE = 2.228 \u00d7 1.763 — multiply, or recall the upper end.' },
        { ar: 'تحقق بالطرح: 12.93 − 9 = 3.93 — وهذا ما يجعل الفاصل (5.07, 12.93).', en: 'Verify by subtraction: 12.93 \u2212 9 = 3.93 — which makes the interval (5.07, 12.93).' },
        { ar: 'الجواب: 3.93', en: 'Answer: 3.93' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import statistics\nreleases = {'r1': 2, 'r2': 4, 'r3': 5, 'r4': 5, 'r5': 7, 'r6': 8,\n            'r7': 9, 'r8': 10, 'r9': 12, 'r10': 14, 'r11': 23}\nn = len(releases)\nmean = sum(releases.values()) / n\ns = statistics.stdev(releases.values())\nse = s / n ** 0.5\nworst = 'r1'\nfor k in releases:\n    if releases[k] > releases[worst]:\n        worst = k\nfor k in releases:\n    print('%-4s |%s %d' % (k, '#' * releases[k], releases[k]))\nfor k in releases:\n    if releases[k] > mean + s:\n        print('flag: %s (%d > mean+s %.2f)' % (k, releases[k], mean + s))\nprint('t 95%% CI: (%.2f, %.2f)' % (mean - 2.228 * se, mean + 2.228 * se))\nprint('releases: %d / mean defects: %.1f / worst: %s' % (n, mean, worst))\n\n# جرّب: احذف r11 من القاموس — إلى أين ينزاح mean وs والراية وسطر الملخص؟\n# try: delete r11 from the dict — where do mean, s, the flag and the summary slide?\n# جرّب: بدّل statistics.stdev بـstatistics.pstdev وراقب الراية والفاصل — أيهما الصادق لمستقبل مفتوح؟\n# try: swap statistics.stdev for statistics.pstdev and watch the flag and interval — which is honest for an open future?\n# جرّب: اخفض عتبة الراية إلى mean + s / 2 — كم إصدارًا يشتعل؟ ومتى تصير الراية ضجيجًا؟\n# try: lower the flag threshold to mean + s / 2 — how many releases flare? when does flagging become noise?",
      prompt: {
        ar: 'الملعب مشروعك كاملًا في ملف واحد: شريط وراية وفاصل وملخص على الإصدارات الأحد عشر. احذف الشاذ وراقب كل سطر يتحرك، وبدّل المقام بين stdev وpstdev وراقب الراية والفاصل، واخفض العتبة حتى تتحول الراية من إنذار إلى ضجيج — حدود الأداة تُفهم بمزاھتها. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is your whole project in one file: bar, flag, interval and summary over the eleven releases. Delete the outlier and watch every line move; swap the divisor between stdev and pstdev and watch flag and interval; lower the threshold until the flag turns from alarm to noise — a tool\u2019s limits are learned by pushing them. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'debug',
      id: 'ex5.debug-ci',
      required: true,
      brokenCode: "import statistics\ncfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]\nn = len(cfds)\nmean = sum(cfds) / n\ns = statistics.pstdev(cfds)\nse = s / n ** 0.5\nt = 2.228\nprint('mean: %.2f s: %.2f' % (mean, s))\nprint('SE: %.2f' % se)\nprint('t 95%% CI: (%.2f, %.2f)' % (mean - t * se, mean + t * se))",
      prompt: {
        ar: 'اللوحة تطبع: mean: 9.00 s: 5.58 وt 95% CI: (5.25, 12.75) — لكن فاصل الدرس الماضي والكتاب على البيانات نفسها هو (5.07, 12.93): فاصلك أضيق ويوهم دقة زائفة. البيانات صحيحة والمتوسط صحيح والقيمة الحرجة t = 2.228 صحيحة. العيب سطر واحد: statistics.pstdev تحسب نسخة المجتمع (قسمة على n = 11) بينما إصداراتك عينة تستدل بها عن مستقبل مفتوح — والمطلوب نسخة العينة statistics.stdev (قسمة على n − 1 = 10) كما في الدرس الرابع. صحّح السطر حتى يطبع الفاصل الصادق (5.07, 12.93).',
        en: 'The board prints mean: 9.00 s: 5.58 and t 95% CI: (5.25, 12.75) — but last lesson\u2019s and the book\u2019s interval on the same data is (5.07, 12.93): yours is narrower and fakes precision. The data is right, the mean is right, the critical value t = 2.228 is right. The defect is one line: statistics.pstdev computes the population version (dividing by n = 11) while your releases are a sample you infer from about an open future — you need the sample version statistics.stdev (dividing by n \u2212 1 = 10) as in lesson four. Fix the line until it prints the honest interval (5.07, 12.93).',
      },
      solution: "import statistics\ncfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]\nn = len(cfds)\nmean = sum(cfds) / n\ns = statistics.stdev(cfds)\nse = s / n ** 0.5\nt = 2.228\nprint('mean: %.2f s: %.2f' % (mean, s))\nprint('SE: %.2f' % se)\nprint('t 95%% CI: (%.2f, %.2f)' % (mean - t * se, mean + t * se))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الفاصل الصادق مطبوع', en: 'The honest interval is printed' },
          code: "assert 't 95% CI: (5.07, 12.93)' in __learner_output__, 'expected: t 95% CI: (5.07, 12.93) | actual: %r' % __learner_output__",
          expected: 't 95% CI: (5.07, 12.93)',
        },
        {
          id: 't2',
          name: { ar: 'نسخة العينة ومقصها صحيحان', en: 'The sample version and its SE are correct' },
          code: "assert 's: 5.85' in __learner_output__ and 'SE: 1.76' in __learner_output__, 'expected: s: 5.85 then SE: 1.76 | actual: %r' % __learner_output__",
          expected: 's: 5.85 then SE: 1.76',
        },
        {
          id: 't3',
          name: { ar: 'أثر نسخة المجتمع زال', en: 'The population version\u2019s trace is gone' },
          code: "assert '5.58' not in __learner_output__ and '(5.25, 12.75)' not in __learner_output__, 'expected: no 5.58 and no (5.25, 12.75) | actual: %r' % __learner_output__",
          expected: 'no 5.58 and no (5.25, 12.75)',
        },
        {
          id: 't4',
          name: { ar: 'المتغير s أصبح الانحراف العيني فعلًا', en: 'The variable s now truly holds the sample stdev' },
          code: "assert abs(s - statistics.stdev(cfds)) < 1e-9, 'expected: s == statistics.stdev(cfds) | actual: %r' % (s,)",
          expected: 's == statistics.stdev(cfds)',
        },
      ],
      hints: [
        { ar: 'لا تمسّ البيانات ولا mean ولا t — العيب في سطر واحد فقط: الدالة التي تنتج s.', en: 'Do not touch the data, mean or t — the defect is in exactly one line: the function producing s.' },
        { ar: 'من الدرس الرابع: statistics.stdev تقسم على n − 1 (عينة) وstatistics.pstdev على n (مجتمع) — إصداراتك أحد عشر تمثل مستقبلًا مفتوحًا فأنت عينة.', en: 'From lesson four: statistics.stdev divides by n \u2212 1 (sample) and statistics.pstdev by n (population) — your eleven releases stand for an open future, so you are a sample.' },
        { ar: 'اقرأ العَرَض كتشخيص: فاصل أضيق من المتوقع = مخاطرة مصغَّرة = مقام أكبر = نسخة المجتمع. بدّل pstdev إلى stdev فيصير s = 5.85 وSE = 1.76.', en: 'Read the symptom as a diagnosis: an interval narrower than expected = understated risk = a larger divisor = the population version. Swap pstdev for stdev and s becomes 5.85 with SE = 1.76.' },
        { ar: 'السطر الصحيح:\ns = statistics.stdev(cfds)\nفيطبع:\nmean: 9.00 s: 5.85\nSE: 1.76\nt 95% CI: (5.07, 12.93)', en: 'The fixed line:\ns = statistics.stdev(cfds)\nwhich prints:\nmean: 9.00 s: 5.85\nSE: 1.76\nt 95% CI: (5.07, 12.93)' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن PY4E الفصل التاسع: القاموس يخزن مفتاحًا وقيمة. في حلقة الشريط سرنا على المفاتيح وطبعنا %s مع k وreleases[k] معًا — لماذا لم نكتفِ بfor v in releases.values()؟',
            en: 'From PY4E chapter 9: a dict stores a key and a value. In the bar loop we walked the keys and printed %s with both k and releases[k] — why not just for v in releases.values()?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن values() لا يمكن التكرار عليها في بايثون', en: 'Because values() cannot be iterated in Python' } },
            { id: 'b', text: { ar: 'لأن الشريط يحتاج اسم الكيان k بجانب قيمته — والمرور على المفاتيح يمنحك الاثنين: k للعرض وreleases[k] للطول والقيمة', en: 'Because the bar needs the entity name k beside its value — walking the keys hands you both: k for display and releases[k] for length and value' } },
            { id: 'c', text: { ar: 'لأن القيم وحدها لا تُجمع', en: 'Because values alone cannot be summed' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الكيان جزء من القصة: عمود بلا اسم يخبرك بالشكل لا بالذنب — و«الأسوأ: r11» في سطر الملخص خرج من نفس المفاتيح. القاموس جسّد جدول كيان→خاصية منذ الدرس الأول، فالعرض الصحيح يحافظ على العمودين معًا.',
            en: 'The entity is part of the story: a nameless bar shows shape but not culprit — and \u201cworst: r11\u201d in the summary line came from those same keys. The dict has embodied the entity\u2192attribute table since lesson one, so honest rendering keeps both columns.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن SWE الفصل العاشر: راية flag: r11 حمراء مثل حزمة اختبارات محمّرة. ما أول ما تفحصه قبل أن تحكم على الإصدار؟',
            en: 'From SWE chapter 10: the flag: r11 line is red like a failing test suite. What do you examine first before judging the release?',
          },
          options: [
            { id: 'a', text: { ar: 'القياس نفسه: هل 23 عيبًا حقيقي أم تضخيم بلاغات أو نقص تغطية اختبار في الإصدارات الأخرى؟ — الحياد قبل الحكم', en: 'The measurement itself: are 23 defects real, or inflated filings, or thinner test coverage on the other releases? — impartiality before judgment' } },
            { id: 'b', text: { ar: 'تحذف r11 من القاموس فتصير اللوحة خضراء', en: 'You delete r11 from the dict so the board goes green' } },
            { id: 'c', text: { ar: 'ترفع العتبة حتى تختفي الراية', en: 'You raise the threshold until the flag disappears' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كما علّم الفصل العاشر الحياد بين الكود والأوراكل والمواصفة، تعلّم اليوم الحياد بين الكيان والقياس والحد: الراية تناقضٌ بين قيمة وحدّ — وقد يكون القصور في العدّ (تغطية متفاوتة) أو في الحد (عتبة متساهلة) قبل أن يكون في الإصدار. حذف الصف أو رفع العتبة تواطؤ يخفي التناقض لا يحسمه.',
            en: 'As chapter ten taught impartiality among code, oracle and spec, today teaches it among entity, measurement and threshold: the flag is a contradiction between a value and a limit — and the shortfall may live in the counting (uneven coverage) or the limit (a lax threshold) before it lives in the release. Deleting the row or raising the bar is collusion that hides the contradiction instead of settling it.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن PY4E الفصل التاسع: sum(releases.values()) جمع القيم. فلماذا كان statistics.stdev(releases.values()) مقبولًا أيضًا دون تحويل القيم إلى قائمة؟',
            en: 'From PY4E chapter 9: sum(releases.values()) adds the values. Why was statistics.stdev(releases.values()) also fine without converting the values to a list?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن stdev تقبل أي قابل للتكرار يمكن حساب طوله — وقيم القاموس تدعم len والتكرار معًا', en: 'Because stdev accepts any iterable whose length can be taken — dict values support both len and iteration' } },
            { id: 'b', text: { ar: 'لأن stdev تفرز القيم أولًا فتصبح قائمة', en: 'Because stdev sorts the values first, turning them into a list' } },
            { id: 'c', text: { ar: 'لأن stdev تعمل على المفاتيح والقيم بالتبادل', en: 'Because stdev works on keys and values interchangeably' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'تحت الغطاء تحسب stdev الطول وتجمع مربعات الانحرافات في تكرار واحد — وكلاهما متاح على كائن dict_values مباشرة. ولهذا ظل تحذير الدرس الرابع قائمًا: الواجهة مرنة لكن المقام يبقى قرارك أنت — stdev أم pstdev.',
            en: 'Under the hood stdev takes the length and accumulates squared deviations in one pass — both available on a dict_values object directly. Which keeps lesson four\u2019s warning alive: the interface is flexible but the divisor stays your decision — stdev or pstdev.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'عميل يسأل: «ما معنى أن فاصلك (5.07, 12.93) ثقة 95%؟» أي جواب صادق؟',
            en: 'A client asks: \u201cwhat does it mean that your interval (5.07, 12.93) is 95% confidence?\u201d Which answer is honest?',
          },
          options: [
            { id: 'a', text: { ar: 'أن احتمال 95% يوجد المتوسط الحقيقي داخل هذا الفاصل تحديدًا', en: 'That there is a 95% probability the true mean sits inside this particular interval' } },
            { id: 'b', text: { ar: 'أن الإجراء الذي بني الفاصل يحيط بالمتوسط الحقيقي في 95% من العينات المتكررة — والمتوسط ثابت إما داخله أو خارجه', en: 'That the procedure which built the interval brackets the true mean in 95% of repeated samples — the mean is fixed, either inside or outside' } },
            { id: 'c', text: { ar: 'أن 95% من إصداراتنا واقعة داخل الفاصل', en: 'That 95% of our releases fall inside the interval' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'جواب الدرس الخامس حرفيًّا: الثقة للإجراء لا للفاصل — المتوسط الحقيقي رقم ثابت والفاصل رقم ثابت، وما يتكرر هو الطريقة عبر العينات. وبيع الاحتمال للفاصل الواحد هو بالضبط «الشبهة الدقيقة» التي حذر منها الكتاب.',
            en: 'Lesson five\u2019s answer verbatim: confidence belongs to the procedure, not the interval — the true mean is a fixed number and so is your interval; what repeats is the method across samples. Selling probability for one interval is exactly the pseudo-precision the book warned about.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'بعد التحسين حسبت فاصلًا للربع الجديد فتقاطع مع فاصل الربع القديم، فقال فريقك: «لا فرق إذن». ما الخطأ؟',
            en: 'After the improvement you computed an interval for the new quarter and it overlapped the old quarter\u2019s interval, so your team said: \u201cno difference then.\u201d What is wrong?',
          },
          options: [
            { id: 'a', text: { ar: 'لا شيء — تقاطع الفاصلين دليل كافٍ على انتفاء الفرق', en: 'Nothing — the two intervals\u2019 overlap is sufficient evidence of no difference' } },
            { id: 'b', text: { ar: 'تقاطع فاصلين منفصلين ليس اختبارًا موثوقًا للفرق — المطلوب فاصل واحد للفرق نفسه، فإن لم يشمل الصفر كان التحسّن موثوقًا وإن شمله فالجواب «لم نميزه بعد، اجمعوا بيانات»', en: 'The overlap of two separate intervals is not a reliable test of the difference — you need one interval for the difference itself: if it excludes zero the improvement is credible, if it includes zero the answer is \u201cnot yet distinguishable, collect more data\u201d' } },
            { id: 'c', text: { ar: 'الخطأ أن الفاصلين بقيمتي 95% — كان يجب 99%', en: 'The error is using 95% intervals — it should have been 99%' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'هذه فخّ الدرس الخامس الأشهر: فاصلا متوسطين يتسعان عادةً حتى مع فرق حقيقي — فالتقاطع سماحة زائفة. الفروق المقترنة (الإصدار نفسه تحت العمليتين) أو صيغة العينتين المستقلتين تعطي فاصلًا واحدًا للفرق، وهو الحكم. وتذكّر خلاصة الكتاب: «لم نميزه من التقلب العادي بعد» إجابة صادقة لا خيانة.',
            en: 'Lesson five\u2019s most famous trap: two means\u2019 intervals overlap generously even with a real difference — overlap is false comfort. Paired differences (the same release under both processes) or the two-independent-samples form yields one interval for the difference, and that is the judge. And recall the book\u2019s close: \u201cnot yet distinguishable from ordinary variation\u201d is an honest answer, not a betrayal.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'نموذج الحجم/العيوب أعطى R² ≈ 0.957. أي استخدام يجيزه درس اليوم؟',
            en: 'The size/defects model produced R\u00b2 \u2248 0.957. Which use does today\u2019s lesson endorse?',
          },
          options: [
            { id: 'a', text: { ar: 'إثبات أن تقسيم الوحدات الكبيرة سيخفض العيوب — السببية مثبتة بالرقم', en: 'Proving that splitting large modules will cut defects — causation is settled by the number' } },
            { id: 'b', text: { ar: 'التوقع داخل مدى البيانات (2-10 KLOC) مع تذكّر أن الارتباط ليس سببية — عامل ثالث قد يدفع الاثنين معًا', en: 'Predicting inside the data\u2019s range (2-10 KLOC) while remembering association is not causation — a third factor may drive both' } },
            { id: 'c', text: { ar: 'توقع عيوب وحدة من 40 KLOC لأن العلاقة قوية', en: 'Predicting defects for a 40-KLOC module because the relationship is strong' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حكمان من الدرس الخامس يُخالان هنا: R² عالٍ يقول إن الحجم والعيوب يتحركان معًا — لا أن أحدهما سبب الآخر (الميزات المتسرعة المعقدة كبيرة ومعيبة معًا)؛ والخط ملائم على 2-10 ألف سطر فالتوقع عند 40 استقراء بلا سند. النموذج الصادق يعرف مداه ويقول له.',
            en: 'Two guards from lesson five trip together: a high R\u00b2 says size and defects move together — not that one causes the other (rushed, complex features are large and buggy together); and the line was fit on 2-10 KLOC, so a prediction at 40 is unsupported extrapolation. An honest model knows its range and says so.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'قراءة اللوحة رقمًا رقمًا — «المتوسط 9 إذن نحن مستقرون»',
          right: 'اقرأها حزمة: متوسط بفاصله، وشريط يري الشكل، وراية سؤال، ومضاد لكل مقياس — ورقم بلا سؤال حي يُحذف',
          note: {
            ar: 'خلاصة الكتاب للفصل كله: رقم بلا هدف هدر ورقم بلا uncertainty تظاهر. المتوسط 9 بلا فاصله (5.07, 12.93) وبلا شريطه وبلا رايته يخفي الإصدار الشاذ 23 وقصة التشتت كلها. اللوحة عقد قياس: كل سطر يعرف لماذا هو هناك، وما لا يجيب سؤالًا حيًا يخرج.',
            en: 'The book\u2019s verdict for the whole chapter: a number without a goal is waste and a number without its uncertainty is theater. The mean of 9 without its interval (5.07, 12.93), its bar and its flag hides the outlier 23 and the entire dispersion story. A dashboard is a measurement contract: every line knows why it is there, and what answers no live question leaves.',
          },
        },
        {
          wrong: 'flag: r11 يعني أن الإصدار فاشل حتمًا فتعاقب فورًا',
          right: 'الراية سؤال تحقيق لا حكم: افحص القياس والحد والسياق قبل العقوبة',
          note: {
            ar: 'الراية تقول «هذا الأبعد عن الحشد» لا «هذا المذنب» — وقد يكون التضخيم في العدّ أو التفاوت في التغطية أو العتبة نفسها. نفس الحياد الذي درّبه الفصل العاشر على الحزم المحمّرة: الفشل تناقض يُحسم بأدلة، لا صفة تُلصق بأول ظهور أحمر.',
            en: 'The flag says \u201cthis is the farthest from the pack\u201d, not \u201cthis is guilty\u201d — the inflation may live in the counting, uneven coverage, or the threshold itself. The same impartiality chapter ten drilled for red suites applies: a failure is a contradiction settled with evidence, not a label pinned on the first red sighting.',
          },
        },
        {
          wrong: 's وσ اسمان لنفس الشيء — أستعمل أي stdev في يدية المكتبة',
          right: 'اعرف مقامك: عينة تقسم على n−1 ومجتمع على n — وتحقق أي نسخة تحسبها مكتبتك قبل أن تصنع فاصلًا',
          note: {
            ar: 'بلوك التصحيح اليوم كان مثالك: pstdev أعطت 5.58 فانقبض الفاصل إلى (5.25, 12.75) ودقّة زائفة بيعت للإدارة. والكتاب حذّر حرفيًّا أن مكتبات أخرى تنقسم على n بصمت. قبل أي فاصل: أعد الحساب على بيانات جوابها معروف — 5.85 عينة و5.58 مجتمع على بياناتنا.',
            en: 'Today\u2019s debug block was your case: pstdev handed 5.58, the interval shrank to (5.25, 12.75), and phantom precision was sold upward. The book warns verbatim that other libraries silently divide by n. Before any interval: recompute on data whose answer you know — on ours, 5.85 sample and 5.58 population.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل نصفان لنفس الحقيقة: القياسي — GQM وصلاحية وموثوقية ومضادات Goodhart وDRE 90% وإفلات 10% وتطبيع بالتعرض — والإحصائي — قمم خمس وIQR = 7 وs = 5.85 وσ = 5.58 وفاصل (5.07, 12.93) وانحدار ŷ = 2 + 1.5x بـR² ≈ 0.957 — وكلها على بيانات ثابتة: 11 إصدارًا، متوسط 9.0، أسوأها r11 بـ23 (2.6 ضعف المتوسط) وإفلات مجمع 8.8%.', en: 'The chapter is two halves of one truth: measurement — GQM, validity and reliability, Goodhart counter-metrics, DRE 90% and a 10% escape rate, exposure normalization — and statistics — five-number summary with IQR = 7, s = 5.85 and \u03c3 = 5.58, the interval (5.07, 12.93), regression \u0177 = 2 + 1.5x with R\u00b2 \u2248 0.957 — all on fixed data: 11 releases, mean 9.0, worst r11 at 23 (2.6x the mean), pooled escape 8.8%.' },
        { ar: 'مشروع اللوحة طبق النصفين في ملف: شريط # لكل إصدار بصيغة %-4s |%s %d، وانحراف عينة statistics.stdev، وراية لمن تجاوز mean + s = 14.85 (أمسكها r11 وحده)، ومعدلات DRE/إفلات من خط الأنابيب، وسطر ختامي: releases: 11 / mean defects: 9.0 / worst: r11.', en: 'The dashboard project applied both halves in one file: a # bar per release via %-4s |%s %d, a sample stdev via statistics.stdev, a flag for anything beyond mean + s = 14.85 (only r11 crossed), DRE/escape rates from the pipeline, and the closing line: releases: 11 / mean defects: 9.0 / worst: r11.' },
        { ar: 'والانضباط الذي يختمه الكتاب: ابدأ من هدف، وقل ماذا تعني بالجودة، ولا تُبلّغ عن أي تغيّر بلا أشرطة خطأ — وكتلة التصحيح ذكّرت أن المقام الخاطئ (pstdev بدل stdev) يبيع دقة زائفة: الفاصل الصادق (5.07, 12.93) لا (5.25, 12.75).', en: 'And the book\u2019s closing discipline: start from a goal, say what you mean by quality, and never report a change without its error bars — and the debug block reminded you that a wrong divisor (pstdev instead of stdev) sells phantom precision: the honest interval is (5.07, 12.93), not (5.25, 12.75).' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب واحذف r11 وراقب كل سطر. اسأل نفسك: أول لوحة ستبنيها في عملك — أي سؤال حي ستجيب عنه كل سطر فيها؟ وأين ستضع العتبة التي تجعل الراية إنذارًا لا ضجيجًا، وبأي مقام ستحسب انحرافك؟',
        en: 'Open the sandbox, delete r11, and watch every line move. Ask yourself: the first dashboard you will build at work — which live question does each of its lines answer? Where will you set the threshold that keeps the flag an alarm rather than noise, and with which divisor will you compute your spread?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch12.s10', pages: 'ص334-335 / pp.334-335' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch12.s10', pages: 'ص334-335 / pp.334-335' },
  ],
} satisfies Lesson;

export default lesson;
