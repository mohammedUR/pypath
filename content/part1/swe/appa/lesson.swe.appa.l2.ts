/**
 * swe.appa.l2 — من الهيكل العظمي إلى النظام القابل للحياة / From Skeletal to Viable System
 * Sections: swe.A.s3 Skeletal System: Status Report 1 (ص463-468 / pp.463-468)
 *           + swe.A.s4 Viable System: Status Report 2 (ص469-472 / pp.469-472)
 * Runnable design: milestone ladder + candid status-report scorer — fixed deliverable
 * checklist with evidence fields; short ASCII lines verified under CPython.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.appa.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 16,
  title: {
    ar: 'من الهيكل العظمي إلى النظام القابل للحياة',
    en: 'From Skeletal to Viable System',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.appa.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الأسبوع السابع. عميلكم يفتح الـ URL الذي أرسلتموه مع تقرير الحالة الأول... وينقر. إما أن يمشي مسارًا حقيقيًا من الواجهة إلى قاعدة البيانات، أو يرى شاشة خطأ. هذا هو الفرق بين هيكل عظمي حقيقي وعرض تقديمي بلون الكود. وبعد أسابيع قليلة سيُفتح الرابط نفسه من تقرير الحالة الثاني، والسؤال الأكبر يُطرح: هل تعمل قصص الـ Must فعلًا لمستخدم حقيقي؟',
        en: 'Week seven. Your customer opens the URL you shipped with Status Report 1... and clicks. Either a real path walks from the UI down to the database, or they see an error screen. That is the difference between a real walking skeleton and a slide deck wearing code colors. A few weeks later the same URL opens for Status Report 2, and the bigger question lands: do the Must-have stories actually work for a real user?',
      },
    },
    {
      kind: 'predict',
      code: `LAYERS = ['ui', 'logic', 'data']
runs = {'ui': True, 'logic': True, 'data': False}
end_to_end = all(runs[layer] for layer in LAYERS)
print('one path end to end:', end_to_end)`,
      question: {
        ar: 'الواجهة والمنطق يعملان، وقاعدة البيانات لا. قبل التشغيل: هل هذا walking skeleton؟ وماذا يطبع الكود؟',
        en: 'The UI and logic run, the data layer does not. Before running: is this a walking skeleton? What does the code print?',
      },
      reveal: {
        ar: 'يطبع False. الهيكل العظمي مسار واحد رفيع يعمل من الطرف إلى الطرف عبر كل طبقات المعمارية؛ طبقة معطلة واحدة تعني أنه ليس هيكلًا عظميًا بعد — إنه واجهة على نظام ناقص.',
        en: 'It prints False. A walking skeleton is one thin path working end to end through every architectural layer; one broken layer means it is not a skeleton yet — just a UI on top of a half-system.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الهيكل العظمي: مسار واحد يعمل', en: 'The skeletal system: one path that runs' },
      chunks: [
        {
          ar: 'الهيكل العظمي (walking skeleton) ليس نموذجًا للعرض؛ إنه مسار واحد حقيقي يعمل من الواجهة عبر كل طبقات المعمارية حتى قاعدة البيانات، منشورًا مبكرًا على URL حقيقي يستطيع المعيِّن أن يفتحه ويجرب المسار بنفسه. يُبنى في Sprint 0-3، ومعه يُقام هيكل CI في السبرنت نفسه: ربط الأنابيب حول مسار رفيع أسهل كثيرًا من ترميمها لاحقًا على نظام اتسع. ومعه يُقدَّم Status Report 1: مسار واحد يعمل، ورسم معمارية كما هي فعلًا لا كما خُطط، وموضع واحد انحرف فيه الواقع عن المقترح ولماذا.',
          en: 'A walking skeleton is not a demo prototype; it is one real path running from the UI through every architectural layer down to the database, deployed early on a real URL a grader can open and exercise. You build it in Sprint 0-3, and you stand up the CI skeleton in the same sprint: wiring the pipeline around one thin path is far easier than retrofitting it later onto a wider system. With it comes Status Report 1: one path that works, an as-built architecture diagram — not the planned one — and one place where reality has already diverged from the proposal, and why.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'النظام القابل للحياة: الـ Must تعمل', en: 'The viable system: Musts that work' },
      chunks: [
        {
          ar: 'النظام القابل للحياة (viable system) هو المحطة الثانية: قصص الـ Must تعمل من الطرف إلى الطرف لمستخدم حقيقي — هذا هو MVP بمعناه الدقيق. ومعه يأتي Status Report 2، وأرقامه أهم من صفاته: كم اختبارًا ومن أي نوع، ورقم تغطية مقابل هدفه (الأرضية نحو 80%)، وكم عيبًا مفتوحًا. أضف قصة الترم: velocity كمجموع النقاط المنجزة في كل سبرنت، تتابعه ولا «تلفّه». وكل ذلك مسنود بأدلة: رابط URL أو لقطة شاشة أو اختبار يستطيع المقيِّم تشغيله.',
          en: 'The viable system is the second checkpoint: Must-have stories work end to end for a real user — that is MVP in the precise sense. With it comes Status Report 2, and its numbers matter more than its adjectives: how many tests and of what kind, a coverage figure against its target (the floor is roughly 80%), and the current open-defect count. Add the story of the term: velocity, points completed per sprint — track it, do not spin it. And everything is backed by evidence: a URL, a screenshot, or a test the grader can run.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تقرير حالة صادق: ما يكافئه المقيِّمون', en: 'A candid status report: what graders reward' },
      chunks: [
        {
          ar: 'القاعدة الذهبية لتقرير الحالة: كل ما تدّعيه يجب أن يكون مرئيًا في النظام المنشور أو في المستودع. التقرير الصادق يقول قصصنا النطاق بدل شبه منتهٍ؛ والمقيِّمون يكافئون الحالة الواضحة لا المتفائلة. قائمة ما يعمل الآن بحالة لكل بند — Done أو Partial أو Not started — مع دليل لكل سطر، ثم ما تعثّر، وما قصصتموه بوعي (بنود ~)، وما التالي. الصدق نفسه يغذي Demo Day: اعرض ما يعمل من main، وإن انكسر العرض أمام الجمهور فهذه معلومة عن أضعف نقطة في النظام — العرض المُروَّض هو العار الوحيد.',
          en: 'The golden rule of a status report: everything you claim must be visible in the deployed system or the repository. A candid report says we cut scope instead of almost done; graders reward a clear-eyed status over an optimistic one. List what works right now, each item Done, Partial, or Not started, each with evidence; then what slipped, what you consciously dropped (~ items), and what comes next. The same honesty powers Demo Day: show what runs, from main — and if the demo breaks in public, that is information about where the system is fragile. The only shameful demo is a staged one.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'سلّم المحطات', en: 'The milestone ladder' },
      code: `LADDER = [
    ('proposal', True, 'signed by the customer team'),
    ('skeletal', True, 'one path live on a real URL'),
    ('viable', False, 'must-haves work for a real user'),
    ('final', False, 'report + demo + write-ups'),
]
for name, done, proof in LADDER:
    mark = 'x' if done else ' '
    print('[' + mark + '] ' + name + ' - ' + proof)`,
      explanation: {
        ar: 'أربعة محطات، وعلامة x لما اكتمل مع الدليل الذي يثبته. لاحظ أن كل محطة تعرف دليلها مسبقًا: توقيع العميل، ثم URL لمسار حقيقي، ثم قصص Must تعمل، ثم تقرير وعرض. هذا سلّم يصعدونه سبرنتًا سبرنتًا؛ والدرجات الفارغة هي خطة الأسابيع القادمة.',
        en: 'Four milestones, an x mark for what is complete, and the evidence that proves it. Notice each milestone already knows its proof: the customer signature, then a URL with a real path, then Must stories working, then report and demo. This is a ladder you climb sprint by sprint; the empty rungs are your plan for the coming weeks.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.status-score',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أمامك تقرير حالة مصغّر في dict اسمه report: قائمة features من أزواج (الاسم، الحالة، الدليل) ورقم coverage. اطبع لكل ميزة سطرًا بالضبط بالشكل: الاسم: الحالة بحروف صغيرة. ثم اطبع stories done: يليه عدد المكتملة، ثم evidence missing: يليه قائمة أسماء الميزات غير المكتملة التي خلت خانة دليلها، ثم coverage: يليه الرقم.',
        en: "You get a miniature status report in a dict named report: a features list of (name, status, evidence) triples and a coverage number. Print one line per feature exactly as: name: status in lowercase. Then print stories done: with the count of Done items, then evidence missing: with the names of non-Done features whose evidence is empty, then coverage: with the number.",
      },
      starterCode: `report = {
    'features': [
        ('book a visit', 'Done', 'URL + test'),
        ('cancel a visit', 'Done', 'URL + test'),
        ('email reminders', 'Partial', 'screenshot only'),
        ('admin dashboard', 'Not started', ''),
    ],
    'coverage': 62,
}
# TODO: one line per feature: '<name>: <status lowercased>'
# then 'stories done: <n>', 'evidence missing: <names list>',
# and 'coverage: <n>'
...`,
      solution: `report = {
    'features': [
        ('book a visit', 'Done', 'URL + test'),
        ('cancel a visit', 'Done', 'URL + test'),
        ('email reminders', 'Partial', 'screenshot only'),
        ('admin dashboard', 'Not started', ''),
    ],
    'coverage': 62,
}
for name, status, evidence in report['features']:
    print(name + ': ' + status.lower())
done = sum(1 for f in report['features'] if f[1] == 'Done')
print('stories done:', done)
weak = [f[0] for f in report['features'] if f[1] != 'Done' and f[2] == '']
print('evidence missing:', weak)
print('coverage:', report['coverage'])`,
      tests: [
        {
          id: 't1',
          name: { ar: 'عدد المكتمل', en: 'done count' },
          code: `assert 'stories done: 2' in __learner_output__, 'expected: stories done: 2 | actual: %r' % __learner_output__`,
          expected: 'stories done: 2',
        },
        {
          id: 't2',
          name: { ar: 'الأدلة الناقصة', en: 'missing evidence' },
          code: `assert "evidence missing: ['admin dashboard']" in __learner_output__, 'expected: evidence missing: [admin dashboard] | actual: %r' % __learner_output__`,
          expected: "evidence missing: ['admin dashboard']",
        },
        {
          id: 't3',
          name: { ar: 'سطر التغطية', en: 'coverage line' },
          code: `assert 'coverage: 62' in __learner_output__, 'expected: coverage: 62 | actual: %r' % __learner_output__`,
          expected: 'coverage: 62',
        },
      ],
      hints: [
        { ar: 'الحالة تُطبع بحروف صغيرة: status.lower() يفعلها لكل سطر.', en: 'The status is printed lowercased: status.lower() handles each line.' },
        { ar: 'المكتملة هي التي حالتها Done حرفيًا — قارن بـ == لا بـ in.', en: 'Done items are exactly those with status Done — compare with ==, not with in.' },
        { ar: 'خانة الدليل الفارغة هي النص الفارغ: شرط f[2] == "" مع f[1] != "Done".', en: 'An empty evidence slot is the empty string: condition f[2] == "" together with f[1] != "Done".' },
        { ar: 'الثلاثة الأخيرة: print("stories done:", done) ثم print("evidence missing:", weak) ثم print("coverage:", report["coverage"]).', en: 'The last three: print("stories done:", done), then print("evidence missing:", weak), then print("coverage:", report["coverage"]).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-week',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود: سلّم محطات بتواريخ استحقاق بالأسابيع، ونحن في الأسبوع 7. اكتب المخرجات الكاملة بدقة، سطرًا سطرًا.',
        en: 'Read the code: a milestone ladder with due weeks, and we are at week 7. Write the exact output, line by line.',
      },
      code: `milestones = [('skeletal', 3), ('viable', 6), ('final', 9)]
week = 7
for name, due in milestones:
    state = 'done' if week > due else 'open'
    print(name + ': ' + state)`,
      solution: `milestones = [('skeletal', 3), ('viable', 6), ('final', 9)]
week = 7
for name, due in milestones:
    state = 'done' if week > due else 'open'
    print(name + ': ' + state)`,
      answer: 'skeletal: done\nviable: done\nfinal: open',
      hints: [
        { ar: 'الحالة done عندما يكون week أكبر من due حصرًا: مقارنة صارمة.', en: 'The state is done only when week is strictly greater than due: a strict comparison.' },
        { ar: 'الاستحقاقات: skeletal في الأسبوع 3، viable في 6، final في 9 — ونحن في 7.', en: 'Due weeks: skeletal at 3, viable at 6, final at 9 — and we are at 7.' },
        { ar: '7 أكبر من 3 ومن 6 لكنه ليس أكبر من 9.', en: '7 is greater than both 3 and 6, but not greater than 9.' },
        { ar: 'السطر: name ثم نقطتان رأسيتان ثم مسافة ثم الحالة.', en: 'Each line: name, a colon, a space, then the state.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-report2',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما الذي يضيفه Status Report 2 للنظام القابل للحياة فوق ما ورد في Report 1؟',
        en: 'What does Status Report 2 (the viable system) add beyond Report 1?',
      },
      options: [
        { id: 'a', text: { ar: 'لا شيء — التقريران متطابقان باسمين', en: 'Nothing — the two reports are identical under different names' } },
        { id: 'b', text: { ar: 'أرقام الجودة: تغطية الاختبارات مقابل هدفها وعدد العيوب المفتوحة', en: 'Quality numbers: test coverage against its target and the current open-defect count' } },
        { id: 'c', text: { ar: 'فيديو تسويقي مدته خمس دقائق', en: 'A five-minute marketing video' } },
        { id: 'd', text: { ar: 'قائمة بأسماء المساهمين ورواتبهم', en: 'A list of contributor names and salaries' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'Report 1 يسأل: أي مسار يعمل من الطرف إلى الطرف؟', en: 'Report 1 asks: which single path runs end to end?' },
        { ar: 'Report 2 ينتقل من مسار واحد إلى قصص Must كاملة لمستخدم حقيقي.', en: 'Report 2 moves from one path to full Must stories for a real user.' },
        { ar: 'المحطة الثانية تطلب أرقامًا من الفصلين 10 و12: التغطية والعيوب.', en: 'The second checkpoint asks for numbers from Chapters 10 and 12: coverage and defects.' },
        { ar: 'الخيار الصحيح يجمع رقم تغطية وعدد عيوب حالي.', en: 'The right option pairs a coverage figure with the current defect count.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-velocity',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'أنجز الفريق 8 ثم 9 ثم 13 نقطة في ثلاثة سبرنتات متتالية. احسب velocity كمتوسط النقاط لكل سبرنت (عدد صحيح). تتبعه ولا تلفّه.',
        en: 'The team completed 8, then 9, then 13 points across three consecutive sprints. Compute the velocity as the average points per sprint (an integer). Track it, do not spin it.',
      },
      answer: '10',
      solution: '10',
      hints: [
        { ar: 'velocity هي المتوسط الجاري للنقاط المنجزة في كل سبرنت.', en: 'Velocity is the running average of points completed per sprint.' },
        { ar: 'اجمع النقاط الثلاثة أولًا.', en: 'Sum the three point totals first.' },
        { ar: 'اقسم المجموع على عدد السبرنتات المنجزة: ثلاثة.', en: 'Divide the sum by the number of completed sprints: three.' },
        { ar: '8 + 9 + 13 = 30، و30 ÷ 3 = 10.', en: '8 + 9 + 13 = 30, and 30 / 3 = 10.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `LAYERS = ['ui', 'logic', 'data']
runs = {'ui': True, 'logic': True, 'data': False}
print('one path end to end:', all(runs[layer] for layer in LAYERS))

report = {
    'features': [
        ('book a visit', 'Done'),
        ('cancel a visit', 'Done'),
        ('email reminders', 'Partial'),
    ],
    'coverage': 62,
}
done = [name for name, status in report['features'] if status == 'Done']
print('stories done:', len(done))
print('coverage gate:', 'open' if report['coverage'] >= 80 else 'closed at ' + str(report['coverage']))`,
      prompt: {
        ar: 'ملعب من الهيكل إلى الحياة. جرّب: 1) اجعل data تساوي True — متى يمشي المسار من الطرف إلى الطرف؟ 2) ارفع coverage إلى 80 حتى يُفتح gate التقرير الثاني. 3) اجعل email reminders بحالة Done وعدّ المكتمل من جديد.',
        en: 'Playground from skeleton to viable. Try: 1) set data to True — when does the path run end to end? 2) raise coverage to 80 until the Report-2 gate opens. 3) mark email reminders as Done and recount.',
      },
    },
    {
      kind: 'quiz',
      id: 'swe.appa.l2.quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'الهيكل العظمي يُعرَّف بأنه مسار رفيع يعمل من الطرف إلى الطرف. عبر ماذا يجب أن يمشي هذا المسار؟',
            en: 'A walking skeleton is defined as a thin path running end to end. Through what must this path walk?',
          },
          options: [
            { id: 'a', text: { ar: 'الواجهة فقط', en: 'The UI only' } },
            { id: 'b', text: { ar: 'كل طبقات المعمارية حتى قاعدة البيانات', en: 'Every architectural layer down to the database' } },
            { id: 'c', text: { ar: 'خادم الإنتاج فقط', en: 'The production server only' } },
            { id: 'd', text: { ar: 'الكود المحلي على جهاز قائد الفريق', en: 'Local code on the team lead laptop' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'هذا معنى walking skeleton من الفصل 7 كما يستعمله الملحق A: كل طبقة تُلمس ولو تبسيطًا، لأن الهدف إثبات أن المعمارية تعمل وأن النشر يعمل معًا.',
            en: 'This is the Chapter 7 walking-skeleton idea as Appendix A uses it: every layer is touched, however trivially, because the goal is to prove the architecture and the deployment both work together.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرق بين Demo Day وTeam Review في نهاية كل سبرنت؟',
            en: 'What is the difference between Demo Day and the Team Review at the end of each sprint?',
          },
          options: [
            { id: 'a', text: { ar: 'لا فرق — الاجتماع نفسه باسمين', en: 'No difference — the same meeting under two names' } },
            { id: 'b', text: { ar: 'Demo Day يفحص المنتج المنشور أمام الجمهور، وTeam Review يفحص طريقة عمل الفريق', en: 'Demo Day inspects the deployed product in front of the audience; the Team Review inspects how the team works' } },
            { id: 'c', text: { ar: 'Team Review للعملاء وDemo Day للمطورين حصرًا', en: 'The Team Review is for customers and Demo Day for developers only' } },
            { id: 'd', text: { ar: 'يُعقد كلاهما مرة واحدة في نهاية الترم', en: 'Both happen once, at the end of the term' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'Demo Day هو وجه الـ sprint review: فحص المنتج. وTeam Review هو وجه الـ retrospective: فحص الفريق — مع تقييمات الأقران والتزام تحسين واحد قابل للفحص.',
            en: 'Demo Day is the sprint-review face: inspecting the product. The Team Review is the retrospective face: inspecting the team — with peer ratings and one checkable committed improvement.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي تقرير حالة سيكافئه المقيِّم أكثر؟',
            en: 'Which status report will a grader reward more?',
          },
          options: [
            { id: 'a', text: { ar: '«كل شيء تقريبًا جاهز، لمسات أخيرة فقط»', en: 'Almost everything is ready, just final touches' } },
            { id: 'b', text: { ar: '«قصصنا النطاق: سقط بندان من Should، والـ Must تعمل بالكامل مع أرقام تغطية وعيوب»', en: 'We cut scope: two Should stories dropped, the Musts fully work, with coverage and defect numbers' } },
            { id: 'c', text: { ar: 'تقرير يسرد النجاحات فقط دون رقم واحد', en: 'A report listing only successes without a single number' } },
            { id: 'd', text: { ar: 'تقرير بلا أدلة لأن النظام «واضح بذاته»', en: 'A report with no evidence because the system is self-evident' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المقيِّمون يكافئون الحالة الواضحة على المتفائلة: قصّ نطاق معلن مع أدلة قرار هندسي؛ بينما «شبه منتهٍ» غالبًا تُكشف بفتح الرابط.',
            en: 'Graders reward a clear-eyed status over an optimistic one: a declared scope cut with evidence is engineering, while almost done gets exposed the moment they open the URL.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'متى يصبح النظام «قابلًا للحياة»؟',
            en: 'When does the system become viable?',
          },
          options: [
            { id: 'a', text: { ar: 'عندما تُنشر أي صفحة على URL', en: 'When any page is deployed on a URL' } },
            { id: 'b', text: { ar: 'عندما تعمل قصص الـ Must من الطرف إلى الطرف لمستخدم حقيقي، مع أرقام تغطية وعيوب', en: 'When the Must stories work end to end for a real user, with coverage and defect numbers' } },
            { id: 'c', text: { ar: 'عندما تكتمل كل قصص الـ Should وCould أيضًا', en: 'When every Should and Could story is complete too' } },
            { id: 'd', text: { ar: 'عند كتابة تقرير الحالة الثاني فقط دون شرط تقني', en: 'When Status Report 2 is written, with no technical condition' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'النظام القابل للحياة هو MVP بمعناه الدقيق: قيمة حقيقية للمستخدم الأساسي عبر قصص الـ Must — لا صفحة منشورة، ولا اكتمال كل القوائم.',
            en: 'The viable system is MVP in the precise sense: real value to the primary user through the Must stories — not a deployed page, and not completing every list.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'خمس ميزات عند 80% في نهاية السبرنت.',
          right: 'ميزتان تعملان بالكامل مع قائمة قصٍّ واعية (~) ومدونة.',
          note: {
            ar: 'الفريق الذي ينهي كل سبرنت بعرض يعمل وقائمة قص قصيرة يشتغل جيدًا؛ أما خمس ميزات شبه جاهزة فلا تُعرض ولا تُختبر.',
            en: 'A team that ends every sprint with a working demo and a short conscious drop list is executing well; five near-done features neither demo nor test.',
          },
        },
        {
          wrong: 'كتابة «شبه منتهٍ» في تقرير الحالة.',
          right: 'قائمة بحالة كل قصة — Done أو Partial أو Not started — مع دليل لكل سطر.',
          note: {
            ar: 'الصدق أرخص من أن يكتشف المعيِّن الحقيقة بفتح الرابط؛ وقصّ النطاق المعلن قرار هندسي لا عيب.',
            en: 'Candor is cheaper than the grader discovering the truth by opening the URL; a declared scope cut is an engineering decision, not a defect.',
          },
        },
        {
          wrong: 'ترميم خط CI بعد أن يتسع النظام.',
          right: 'إقامته مع الهيكل العظمي حول المسار الرفيع الأول.',
          note: {
            ar: 'ربط الأنابيب حول مسار واحد أسهل كثيرًا من لصقها لاحقًا؛ وكل طبقة عتاد هندسي تُضاف سبرنتًا سبرنتًا وتبقى قائمة.',
            en: 'Wiring the pipeline around one path is far easier than patching it in later; each engineering layer is added sprint by sprint and stays on.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'الهيكل العظمي: مسار رفيع واحد عبر كل الطبقات، منشور مبكرًا، وCI يقام في السبرنت نفسه.',
          en: 'The skeletal system: one thin path through every layer, deployed early, with CI stood up in the same sprint.',
        },
        {
          ar: 'النظام القابل للحياة: قصص الـ Must تعمل لمستخدم حقيقي، مع تغطية وعيوب موثقة في Report 2.',
          en: 'The viable system: Must stories working for a real user, with coverage and defects documented in Report 2.',
        },
        {
          ar: 'كل ادعاء في تقرير الحالة يحتاج دليلًا مرئيًا: URL أو لقطة شاشة أو اختبارًا.',
          en: 'Every claim in a status report needs visible evidence: a URL, a screenshot, or a test.',
        },
        {
          ar: 'الوقت ثابت والنطاق مرن: قصٌّ واعٍ (~) أفضل من خمس ميزات عند 80%.',
          en: 'Time is fixed and scope flexes: a conscious cut (~) beats five features at 80 percent.',
        },
      ],
      reflectPrompt: {
        ar: 'ما هو المسار الواحد الذي سيمشي به هيكلكم العظمي من الواجهة إلى قاعدة البيانات؟ اكتبه في خطوتين قبل أن تفتح المحرر.',
        en: 'Which single path will your walking skeleton take from UI to database? Write it in two steps before you open the editor.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.A.s3', pages: 'ص463-468 / pp.463-468' },
        { book: 'SWE', section: 'swe.A.s4', pages: 'ص469-472 / pp.469-472' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.A.s3', pages: 'ص463-468 / pp.463-468' },
    { book: 'SWE', section: 'swe.A.s4', pages: 'ص469-472 / pp.469-472' },
  ],
} satisfies Lesson;

export default lesson;
