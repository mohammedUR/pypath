/**
 * swe.appa.l4 — الكابستون: خارطة تسليم مشروعك / Capstone: Your Project Delivery Map
 * Section: swe.A.s7 Conclusion (ص494-499 / pp.494-499) + full-track recap (ch1-ch15)
 * Runnable design: THE PROJECT — deterministic capstone delivery map over fixed project data
 * (requirements with priority/owner/points, milestone table with due sprints, velocity):
 * per-milestone readiness gate + risk flags + must-points line; debug shows the false-green
 * of a date-only readiness check. Short ASCII lines verified under CPython.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.appa.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 16,
  title: {
    ar: 'الكابستون: خارطة تسليم مشروعك',
    en: 'Capstone: Your Project Delivery Map',
  },
  estimatedMinutes: 35,
  prerequisites: ['swe.appa.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل ما درسته هذا الترم — الأخلاق والعمليات والمتطلبات والمعمارية وgit والاختبارات والأمان والمقاييس والتسليم والصيانة — يلتقي الآن في مكان واحد: مشروعكم. وفي آخر أسبوعين، الفرق لا تفوز بالكلمات بل بخارطة: أربع بوابات، ولكل بوابة دليل جاهزية. من يحمل هذه الخارطة ينهي الترم بعرض حي وتقرير مكتمل؛ ومن لا يحملها يكتشف في الليلة الأخيرة أن مرحلة «كانت جاهزة» على الورق فقط.',
        en: 'Everything you studied this term — ethics, process, requirements, architecture, git, testing, security, metrics, delivery, maintenance — now meets in one place: your project. In the final two weeks, teams are not saved by words but by a map: four gates, each with its readiness evidence. Carry that map and you finish with a live demo and a complete report; skip it and you discover on the last night that a milestone was only ready on paper.',
      },
    },
    {
      kind: 'predict',
      code: `milestones = [('proposal', 0), ('skeletal', 0), ('viable', 2), ('final', 4)]
sprint = 2
for name, due in milestones:
    print(name + ': ' + ('shipped' if sprint >= due else 'ahead'))`,
      question: {
        ar: 'نحن في نهاية السبرنت 2. قبل التشغيل: كم مرحلة سيقول الكود إنها shipped؟ وهل يعني ذلك أنها اكتملت فعلًا؟',
        en: 'We are at the end of sprint 2. Before running: how many milestones will the code call shipped? And does that mean they are actually done?',
      },
      reveal: {
        ar: 'ثلاث مراحل: proposal وskeletal وviable كلها shipped لأن تواريخها حانت. لكن هذا حكم بالتاريخ لا بالدليل: إن لم تكتمل قصص الـ Must فالنظام ليس قابلًا للحياة رغم أن موعده مرّ. الجاهزية تُثبت بالأدلة — وهذا ما تضيفه خارطة التسليم في هذا الدرس.',
        en: 'Three: proposal, skeletal, and viable are all shipped because their due sprints passed. But that is a judgment by date, not by evidence: if the Must stories are unfinished, the system is not viable even though its date arrived. Readiness is proven by evidence — exactly what the delivery map in this lesson adds.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خارطة التسليم: جاهزية بالأدلة لا بالتواريخ', en: 'The delivery map: readiness by evidence, not dates' },
      chunks: [
        {
          ar: 'خارطة التسليم جدول من أربع بوابات، ولكل بوابة ثلاثة أشياء: سبرنت الاستحقاق، ومتطلبات تحتاجها (needs)، والدليل الذي يثبت جاهزيتها. proposal تُغلق بتوقيع العميل، وسبرنت 0-3 يغلق الهيكل العظمي بمسار حي على URL، ونهاية السبرنت 2 يجب أن تشبه النظام القابل للحياة، والسبرنت 4 يتدحرج نحو التقرير النهائي والعرض والكتابات الفردية. القاعدة: المرحلة ready فقط عندما يحن سبرنتها ويكون كل متطلب في قائمة needs مكتملًا ومثبتًا؛ وإلا فهي blocked بأسماء ما تعثّر، أو upcoming إن لم يحن موعدها. ومع الخطوط تُقرأ أعلام المخاطر: متطلبات بلا مالك، وMust غير منجزة.',
          en: 'A delivery map is a table of four gates, and each gate carries three things: its due sprint, the requirements it needs, and the evidence that proves readiness. The proposal closes with the customer signature; Sprint 0-3 closes the skeletal system with one path live on a URL; the end of sprint 2 should look like the viable system; sprint 4 rolls into the final report, presentations, and individual write-ups. The rule: a milestone is ready only when its due sprint has arrived and every requirement in its needs list is complete and evidenced; otherwise it is blocked, naming what slipped, or upcoming if its time has not come. Alongside the lines, read the risk flags: requirements without owners, and Musts still unfinished.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المسار كله في صفحة واحدة', en: 'The whole track on one page' },
      chunks: [
        {
          ar: 'انظر خلفك قبل أن تنظر أمامك. الفصل 1 أعطاك الأخلاق وحالات Therac-25 وVW؛ والفصل 2 العمليات: Scrum وXP والحلزون وShape Up؛ والفصلان 3-4 المتطلبات: الاستقصاء وقصص INVEST وMoSCoW والتقدير بالـ Planning Poker؛ والفصل 5 حالات الاستخدام بممثليها وتدفقاتها؛ والفصلان 6-7 المعمارية والأنماط؛ والفصل 8 git والفروع والمراجعات؛ والفصلان 9-10 الفحص الساكن والاختبارات والتغطية؛ والفصل 11 الأمان وسلسلة التوريد؛ والفصل 12 المقاييس؛ والفصل 13 الـ AI المسؤول؛ والفصل 14 خطوط CI/CD ومقاييس DORA؛ والفصل 15 الصيانة والدين التقني. الملحق A هو المكان الذي تندمج فيه هذه الخيوط في نظام واحد يُشحن — ومخرجات التعلم الثلاثة عشر هي قائمة فحص خارطتك.',
          en: 'Look back before you look ahead. Chapter 1 gave you ethics and the Therac-25 and VW cases; Chapter 2 process — Scrum, XP, spiral, Shape Up; Chapters 3-4 requirements — elicitation, INVEST stories, MoSCoW, Planning Poker estimates; Chapter 5 use cases with actors and flows; Chapters 6-7 architecture and patterns; Chapter 8 git, branches, reviewed merges; Chapters 9-10 static checking, testing, coverage; Chapter 11 security and the supply chain; Chapter 12 metrics; Chapter 13 responsible AI; Chapter 14 CI/CD and DORA; Chapter 15 maintenance and technical debt. Appendix A is where these threads fuse into one shipped system — and the thirteen learning outcomes are the checklist for your map.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'خطط بالسرعة الفعلية، واصنع الأعلام مبكرًا', en: 'Plan at real velocity, raise flags early' },
      chunks: [
        {
          ar: 'velocity هي المتوسط الجاري للنقاط المنجزة كل سبرنت، وهي الرقم الذي تخطط به للسبرنت التالي — لا بالآمال. الزمن ثابت والنطاق هو المتغير: عند الضيق قصّ المهمة لا الموعد، وسقّط بنود ~ المعلنة سلفًا. أشرطة المخاطر جزء من الخارطة لا ملحق بها: متطلب بلا مالك لن يبدأ أبدًا، وMust لم يكتمل يعني بوابة مسدودة أمام المرحلة التالية. رفع العلم في الأسبوع الأول يمنحك سبرنتين للرد؛ رفعه في الأخير يمنحك عرضًا منكسرًا.',
          en: 'Velocity is the running average of points completed per sprint, and it is the number you plan the next sprint with — not your hopes. Time is fixed and scope is the variable: when the box gets tight, shrink the task, not the deadline, and drop the pre-declared ~ items. Risk flags are part of the map, not an appendix: a requirement without an owner never starts, and an unfinished Must wedges the next gate. Raise the flag in week one and you have two sprints to react; raise it at the end and you have a broken demo.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'خارطة مصغّرة بالتواريخ فقط', en: 'A miniature map, dates only' },
      code: `SPRINT = 2
MILESTONES = [
    ('proposal', 0, 'signed by the customer'),
    ('skeletal', 0, 'one path live on a URL'),
    ('viable', 2, 'must-haves work for a real user'),
    ('final', 4, 'report + demo + write-ups'),
]
for name, due, proof in MILESTONES:
    state = 'ready' if SPRINT >= due else 'upcoming'
    print('milestone ' + name + ': ' + state)`,
      explanation: {
        ar: 'هذه الخارطة تقول إن viable جاهزة لأن سبرنتها حان — لكنها نظرت إلى التاريخ فقط وتجاهلت عمود الدليل. إن لم تعمل قصص الـ Must فهذا أخضر كاذب. المشروع التالي يصلح هذا: يضيف بوابة الأدلة، فيصبح ready حكمًا على أعمال مكتملة لا على تقويم.',
        en: 'This map calls viable ready because its sprint arrived — but it looked only at the date and ignored the evidence column. If the Must stories do not work, that is a false green. The project below fixes it by adding the evidence gate, so ready becomes a judgment about completed work, not about a calendar.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.delivery-map',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'هذا هو مشروع الدرس: خارطة تسليم كاملة عن بيانات ثابتة. القواعد: نحن في السبرنت 2. المرحلة ready إذا كان SPRINT >= due وكان كل معرف في needs حالته done؛ فإن لم يحن موعدها اطبع upcoming؛ وإلا اطبع blocked يليه أسماء المتطلبات التي تعثّرت بترتيب needs. ثم سطرا المخاطر: عدد المتطلبات بلا مالك، وعدد قصص الـ Must التي ليست done. وأخيرًا سطر النقاط: مجموع نقاط Must المكتملة على مجموعها كله عند الـ velocity. الأشكال مضبوطة حرفيًا كما في المثال أسفل الكود.',
        en: "This is the lesson's project: a full delivery map over fixed data. Rules: we are in sprint 2. A milestone is ready when SPRINT >= due and every id in its needs has status done; if its due sprint has not arrived print upcoming; otherwise print blocked followed by the ids that slipped, in needs order. Then two risk lines: the count of requirements without an owner, and the count of Must stories not done. Finally the points line: completed Must points over total Must points at the current velocity. The formats are pinned exactly as in the sample below the code.",
      },
      starterCode: `REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2
VELOCITY = 9

# TODO: for each milestone print:
#   'milestone <i>: <name> - ready'          (sprint reached, all needs done)
#   'milestone <i>: <name> - upcoming'       (due sprint not reached)
#   'milestone <i>: <name> - blocked (R5)'   (sprint reached, some needs not done)
# then:
#   'risk: <n> requirements unassigned'
#   'risk: <n> Must not done'
#   'must points: <d>/<t> done at velocity <v>/sprint'
...`,
      solution: `REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2
VELOCITY = 9

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT < due:
        print('milestone ' + str(i) + ': ' + name + ' - upcoming')
    elif all(STATUS[rid] == 'done' for rid in needs):
        print('milestone ' + str(i) + ': ' + name + ' - ready')
    else:
        blocked = [rid for rid in needs if STATUS[rid] != 'done']
        print('milestone ' + str(i) + ': ' + name + ' - blocked (' + ' '.join(blocked) + ')')

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')
unfinished_musts = [r[0] for r in REQS if r[2] == 'Must' and STATUS[r[0]] != 'done']
print('risk: ' + str(len(unfinished_musts)) + ' Must not done')
must_total = sum(r[4] for r in REQS if r[2] == 'Must')
must_done = sum(r[4] for r in REQS if r[2] == 'Must' and STATUS[r[0]] == 'done')
print('must points: ' + str(must_done) + '/' + str(must_total) + ' done at velocity ' + str(VELOCITY) + '/sprint')`,
      tests: [
        {
          id: 't1',
          name: { ar: 'بوابة viable مسدودة', en: 'viable gate is blocked' },
          code: `assert 'milestone 3: viable - blocked (R5)' in __learner_output__, 'expected: milestone 3: viable - blocked (R5) | actual: %r' % __learner_output__`,
          expected: 'milestone 3: viable - blocked (R5)',
        },
        {
          id: 't2',
          name: { ar: 'علم المخاطر', en: 'risk flag' },
          code: `assert 'risk: 2 requirements unassigned' in __learner_output__, 'expected: risk: 2 requirements unassigned | actual: %r' % __learner_output__`,
          expected: 'risk: 2 requirements unassigned',
        },
        {
          id: 't3',
          name: { ar: 'سطر نقاط الـ Must', en: 'must points line' },
          code: `assert 'must points: 8/12 done at velocity 9/sprint' in __learner_output__, 'expected: must points: 8/12 done at velocity 9/sprint | actual: %r' % __learner_output__`,
          expected: 'must points: 8/12 done at velocity 9/sprint',
        },
      ],
      hints: [
        { ar: 'رقّم المراحل بـ enumerate(MILESTONES, start=1) لتحصل على i مع بياناتها.', en: 'Number the milestones with enumerate(MILESTONES, start=1) to get i alongside the data.' },
        { ar: 'ثلاث حالات بالترتيب: SPRINT < due يعني upcoming؛ وإلا فإن كل needs مكتملة تعني ready؛ وإلا blocked.', en: 'Three states in order: SPRINT < due means upcoming; else all needs done means ready; else blocked.' },
        { ar: 'المتطلب بلا مالك هو الذي حقل owner فيه نص فارغ؛ وMust غير المنجزة حالتها ليست done.', en: 'A requirement without an owner has an empty owner field; an unfinished Must has a status other than done.' },
        { ar: 'نقاط Must: اجمع العمود الخامس بشرط الأولوية Must، مرة للمنجزة (حالتها done) ومرة للكل — ثم اطبع سطر must points.', en: 'Must points: sum the fifth column where priority is Must, once for done items and once for all — then print the must points line.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-velocity',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود: ثلاثة سبرنتات منجزة وحساب المتوسط. اكتب المخرجات الكاملة بدقة، سطرًا سطرًا.',
        en: 'Read the code: three completed sprints and an average. Write the exact output, line by line.',
      },
      code: `points = [8, 9, 13]
velocity = sum(points) // len(points)
for i, p in enumerate(points, start=1):
    print('sprint ' + str(i) + ': ' + str(p) + ' points')
print('velocity: ' + str(velocity) + ' points/sprint')
print('size sprint 4 by velocity, not hopes')`,
      solution: `points = [8, 9, 13]
velocity = sum(points) // len(points)
for i, p in enumerate(points, start=1):
    print('sprint ' + str(i) + ': ' + str(p) + ' points')
print('velocity: ' + str(velocity) + ' points/sprint')
print('size sprint 4 by velocity, not hopes')`,
      answer: 'sprint 1: 8 points\nsprint 2: 9 points\nsprint 3: 13 points\nvelocity: 10 points/sprint\nsize sprint 4 by velocity, not hopes',
      hints: [
        { ar: 'enumerate يبدأ من 1، فالسطور sprint 1 ثم sprint 2 ثم sprint 3.', en: 'enumerate starts at 1, so the lines are sprint 1, sprint 2, sprint 3.' },
        { ar: 'المتوسط هنا قسمة صحيحة: // تُسقط الكسور.', en: 'The average uses integer division: // drops fractions.' },
        { ar: 'المجموع 30 على ثلاثة سبرنتات.', en: 'The sum is 30 across three sprints.' },
        { ar: 'السطران الأخيران: velocity: 10 points/sprint ثم سطر النصيحة.', en: 'The last two lines: velocity: 10 points/sprint, then the advice line.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-velocity-plan',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'velocity فريقكم 9 نقاط في السبرنت، ويقترح أحدهم خطة سبرنت رابع من 15 نقطة لإنهاء كل شيء. ما المبدأ الذي يكسره هذا؟',
        en: 'Your velocity is 9 points per sprint, and someone proposes a 15-point sprint 4 to finish everything. Which principle does this break?',
      },
      options: [
        { id: 'a', text: { ar: 'لا شيء — الطموح العالي ممتاز دائمًا', en: 'None — high ambition is always excellent' } },
        { id: 'b', text: { ar: 'التخطيط بآمال لا بسرعة فعلية؛ الزمن ثابت والنطاق هو المتغير الذي يقصّ', en: 'Planning by hopes instead of real velocity; time is fixed and scope is the variable to cut' } },
        { id: 'c', text: { ar: 'أن الـ velocity يجب أن تبقى سرًّا بين الفريق', en: 'That velocity should stay secret inside the team' } },
        { id: 'd', text: { ar: 'أن النقاط لا تصلح لقياس القصص أصلًا', en: 'That points are unfit to size stories in the first place' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'velocity رقم تخطط به، لا رقم تتمنى تجاوزه.', en: 'Velocity is the number you plan with, not the number you wish past.' },
        { ar: 'تذكّر الصندوق الثابت: أسبوعان لكل سبرنت لا يتضخمان.', en: 'Remember the fixed box: two weeks per sprint that never grow.' },
        { ar: 'عند الضيق تُطبَّق scope hammering: صغّر المهمة لا الموعد.', en: 'When tight, apply scope hammering: shrink the task, not the deadline.' },
        { ar: 'الخيار الصحيح يجمع: خطط بـ 9، والنطاق هو ما يتقلص.', en: 'The right option pairs: plan at 9, and scope is what shrinks.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-evidence',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'المرحلة لا تصبح جاهزة لأن سبرنتها حان، بل لأن متطلباتها مكتملة ونظامها منشور ومُختبَر. أكمل: readiness is proven by ___, not dates. كلمة إنجليزية واحدة.',
        en: 'A milestone is not ready because its sprint arrived, but because its requirements are done and its system is deployed and tested. Complete: readiness is proven by ___, not dates. One English word.',
      },
      answer: 'evidence',
      solution: 'evidence',
      hints: [
        { ar: 'الكلمة هي ما تجعله حقيقة أمام المعيِّن: رابط أو رقم أو اختبار.', en: 'The word is what makes it true to a grader: a link, a number, a test.' },
        { ar: 'وردت في هذا الدرس كعمود في خارطة التسليم.', en: 'It appeared in this lesson as a column of the delivery map.' },
        { ar: 'حكم التاريخ فقط هو ما صنع الأخضر الكاذب في الكود المعطوب.', en: 'A date-only judgment is what produced the false green in the broken code.' },
        { ar: 'الجواب: evidence.', en: 'The answer: evidence.' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-optimistic-map',
      required: true,
      brokenCode: `REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT >= due:
        print('milestone ' + str(i) + ': ' + name + ' - ready')
    else:
        print('milestone ' + str(i) + ': ' + name + ' - upcoming')

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')`,
      prompt: {
        ar: 'هذه الخارطة تُطبع بابتسامة: كل مرحلة حان سبرنتها تُعلن ready — حتى viable التي يعتمدها المتطلب R5 وحالته partial! هذا أخضر كاذب سيقود الفريق إلى Demo Day وهو يفتقد متطلبًا من قصص الـ Must. أصلح الحلقة لتطبق بوابة الأدلة: ready فقط إذا اكتمل كل متطلب في needs؛ وإلا blocked يليه أسماء ما تعثّر بترتيب needs، مع بقاء upcoming لمن لم يحن سبرنته.',
        en: 'This map prints with a smile: every milestone whose sprint passed declares ready — including viable, which depends on requirement R5 whose status is partial! That is a false green walking the team into Demo Day missing a Must story. Fix the loop to apply the evidence gate: ready only when every requirement in needs is done; otherwise blocked followed by the ids that slipped in needs order, while upcoming still applies to milestones whose sprint has not arrived.',
      },
      solution: `REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT < due:
        print('milestone ' + str(i) + ': ' + name + ' - upcoming')
    elif all(STATUS[rid] == 'done' for rid in needs):
        print('milestone ' + str(i) + ': ' + name + ' - ready')
    else:
        blocked = [rid for rid in needs if STATUS[rid] != 'done']
        print('milestone ' + str(i) + ': ' + name + ' - blocked (' + ' '.join(blocked) + ')')

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')`,
      tests: [
        {
          id: 't1',
          name: { ar: 'المرحلة المسدودة تُعلن', en: 'blocked state is declared' },
          code: `assert 'milestone 3: viable - blocked (R5)' in __learner_output__, 'expected: milestone 3: viable - blocked (R5) | actual: %r' % __learner_output__`,
          expected: 'milestone 3: viable - blocked (R5)',
        },
        {
          id: 't2',
          name: { ar: 'لا أخضر كاذب', en: 'no false green' },
          code: `assert 'milestone 3: viable - ready' not in __learner_output__, 'expected: no false green for viable | actual: %r' % __learner_output__`,
          expected: 'no false green',
        },
      ],
      hints: [
        { ar: 'الحلقة الحالية تسأل سؤالًا واحدًا: هل حان السبرنت؟ الجاهزية سؤالان.', en: 'The current loop asks one question: has the sprint arrived? Readiness is two questions.' },
        { ar: 'أضف فحص needs: all(STATUS[rid] == "done" for rid in needs) — وهو فرع بين upcoming وblocked.', en: 'Add the needs check: all(STATUS[rid] == "done" for rid in needs) — a branch between upcoming and blocked.' },
        { ar: 'اجمع المعرفات غير المكتملة بترتيب needs في قائمة blocked ثم اطبعها داخل قوسين.', en: 'Collect unfinished ids in needs order into a blocked list, then print them inside parentheses.' },
        { ar: 'الترتيب: إن SPRINT < due فupcoming؛ وإلا إن اكتمل الجميع فready؛ وإلا blocked (المتعثرون).', en: 'The order: if SPRINT < due then upcoming; elif all done then ready; else blocked (the slippers).' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT < due:
        state = 'upcoming'
    elif all(STATUS[rid] == 'done' for rid in needs):
        state = 'ready'
    else:
        state = 'blocked'
    print('milestone ' + str(i) + ': ' + name + ' - ' + state)

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')`,
      prompt: {
        ar: 'ملعب خارطتك النهائية. جرّب: 1) اجعل SPRINT يساوي 4 واجعل R5 بحالة done في STATUS — هل تصبح كل البوابات ready؟ 2) امنح R3 وR4 مالكين ولاحظ سطر المخاطر. 3) أضف متطلبًا سادسًا بلا مالك وشاهد العلم يرتفع وحده.',
        en: 'Playground for your final map. Try: 1) set SPRINT to 4 and mark R5 done in STATUS — do all gates go ready? 2) give R3 and R4 owners and watch the risk line. 3) add a sixth requirement with no owner and see the flag raise itself.',
      },
    },
    {
      kind: 'quiz',
      id: 'swe.appa.l4.quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في نموذج الحلزون لبوهم (الفصل 2)، ما الذي يقود كل لفة من لفات الحلقة؟',
            en: 'In the Chapter 2 spiral model, what drives each turn of the loop?',
          },
          options: [
            { id: 'a', text: { ar: 'التقويم — كل لفة تاريخ ثابت', en: 'The calendar — each turn has a fixed date' } },
            { id: 'b', text: { ar: 'المخاطر — كل لفة تحدد أخطر مخاطرة وتعالجها قبل الاستثمار الأكبر', en: 'Risk — each turn names the biggest risk and addresses it before investing more' } },
            { id: 'c', text: { ar: 'عدد المطوّرين المتاح', en: 'The number of available developers' } },
            { id: 'd', text: { ar: 'ترتيب الفصول في الكتاب', en: 'The order of chapters in the book' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الحلزون عملية مدفوعة بالمخاطر: حدد المخاطرة، ثم نمّذجها أو جرّب spike لتفكيكها، ثم انتقل — وهي نفس روح أعلام المخاطر في خارطة التسليم.',
            en: 'The spiral is risk-driven: identify the risk, probe it with a spike or prototype, then proceed — the same spirit as the risk flags on your delivery map.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'معايير القبول على كروت قصصكم (الفصل 3) تُكتب بأي شكل حتى تُعرَض في Demo Day كسلوك ناجح؟',
            en: 'In what form are acceptance criteria written on your story cards (Chapter 3) so they can be demoed as passing behavior?',
          },
          options: [
            { id: 'a', text: { ar: 'فقرة نثرية حرة', en: 'A free prose paragraph' } },
            { id: 'b', text: { ar: 'سيناريوهات Gherkin قابلة للتنفيذ: Given-When-Then', en: 'Executable Gherkin scenarios: Given-When-Then' } },
            { id: 'c', text: { ar: 'رسم UML للطبقات', en: 'A UML class diagram' } },
            { id: 'd', text: { ar: 'قائمة بريد إلكتروني للعميل', en: 'The customer email list' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قصص INVEST بمعايير Gherkin هي ما يجعل القصة قابلة للاختبار والعرض: السيناريو نفسه يظهر ناجحًا في العرض، وهو دليل القبول في تقرير الحالة.',
            en: 'INVEST stories with Gherkin acceptance criteria are what make a story testable and demoable: the scenario itself shows as passing behavior and is the acceptance evidence in status reports.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في حالة الاستخدام (الفصل 5)، من هو الـ actor؟',
            en: 'In a use case (Chapter 5), what is an actor?',
          },
          options: [
            { id: 'a', text: { ar: 'المطوّر الذي يكتب الكود', en: 'The developer who writes the code' } },
            { id: 'b', text: { ar: 'دور خارجي — شخص أو نظام — له هدف يحققه عبر تفاعله مع النظام', en: 'An external role — person or system — with a goal it achieves by interacting with the system' } },
            { id: 'c', text: { ar: 'أي متغير داخل الكود', en: 'Any variable inside the code' } },
            { id: 'd', text: { ar: 'قائد الفريق في الاجتماع', en: 'The team lead in a meeting' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حالة الاستخدام تحكي هدف ممثل خارجي وتدفقه الأساسي والبديل — وهي الجسر بين قصص المستخدم وبين ما تعرضه في Demo Day كمسارات عمل.',
            en: 'A use case tells an external actor goal with its basic and alternative flows — the bridge between user stories and the working paths you demo on Demo Day.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'رقم التغطية الذي ترفعه في Report 2 (الفصل 10) يقيس ماذا بالضبط؟',
            en: 'The coverage number you report in Status Report 2 (Chapter 10) measures exactly what?',
          },
          options: [
            { id: 'a', text: { ar: 'عدد العيوب في الكود', en: 'The number of defects in the code' } },
            { id: 'b', text: { ar: 'نسبة الأسطر أو الفروع التي نفذتها الاختبارات — لا غياب العيوب', en: 'The share of lines or branches the tests executed — not the absence of bugs' } },
            { id: 'c', text: { ar: 'سرعة خط النشر', en: 'The speed of the delivery pipeline' } },
            { id: 'd', text: { ar: 'عدد أسطر الكود المكتوبة', en: 'The number of code lines written' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التغطية مقياس تنفيذ لا مقياس صحة: 100% تغطية لا تعني خلوًا من العيوب، لكنها تكشف ما لم تلمسه اختباراتكم أصلًا — ولذلك أرضية نحو 80% في السبرنت الأول.',
            en: 'Coverage measures execution, not correctness: 100 percent coverage does not mean bug-free, but it exposes what your tests never touched — hence the roughly 80 percent floor in sprint 1.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'في CD (الفصل 14)، ماذا يعني دمج تغيير إلى main؟',
            en: 'In CD (Chapter 14), what does merging a change to main mean?',
          },
          options: [
            { id: 'a', text: { ar: 'يعمل البناء فقط، والنشر يدوي نهاية الترم', en: 'The build runs only; deployment is manual at term end' } },
            { id: 'b', text: { ar: 'هو الإصدار نفسه: خط النشر ينشر كل تغيير مدموج تلقائيًا إلى الإنتاج', en: 'It is the release itself: the pipeline deploys every merged change automatically to production' } },
            { id: 'c', text: { ar: 'أرشفة الفرع بعد إغلاقه', en: 'Archiving the branch after closing it' } },
            { id: 'd', text: { ar: 'إرسال بريد للفريق بالتغييرات', en: 'Emailing the team a summary of changes' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الدمج إلى main هو الإصدار: هذا ما يجعل الإطلاق مملًا وآمنًا — ودرسا Knight Capital وCrowdStrike هما ثمن نسيان الفحوص التي تقف على الخط.',
            en: 'Merging to main is the release: that is what makes shipping boring and safe — and the Knight Capital and CrowdStrike case studies are the price of forgetting the checks that stand on the pipeline.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'ما الذي يجب أن يثبته حكم «ready» على بوابة من خارطة التسليم؟',
            en: 'What must a ready verdict on a delivery-map gate be grounded in?',
          },
          options: [
            { id: 'a', text: { ar: 'أن سبرنت الاستحقاق حان', en: 'That the due sprint has arrived' } },
            { id: 'b', text: { ar: 'أدلة: كل متطلبات البوابة مكتملة والنظام منشور ومُختبَر', en: 'Evidence: every gate requirement complete, and the system deployed and tested' } },
            { id: 'c', text: { ar: 'ثقة قائد الفريق بالفريق', en: 'The team lead confidence in the team' } },
            { id: 'd', text: { ar: 'عدد commits في الأسبوع', en: 'The commit count for the week' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الجاهزية بالأدلة لا بالتواريخ: متطلبات مكتملة بنصيبها من الاختبار والنشر — وإلا فأنت أمام أخضر كاذب كما في ex5.',
            en: 'Readiness is by evidence, not dates: requirements complete with their tests and deployment — otherwise you have a false green like the one in ex5.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'إعلان المرحلة جاهزة لأن سبرنتها حان.',
          right: 'بوابة الأدلة: كل متطلب في needs مكتمل، والنظام منشور ومُختبَر.',
          note: {
            ar: 'الخريطة المتفائلة تصنع أخضر كاذبًا يخفي انزلاق R5 حتى Demo Day — ثم ينكسر العرض أمام الجمهور والعميل.',
            en: 'The optimistic map builds a false green that hides the R5 slip until Demo Day — then the demo breaks in front of everyone.',
          },
        },
        {
          wrong: 'تخطيط سبرنت رابع من 15 نقطة والـ velocity 9.',
          right: 'خطط بالسرعة الفعلية وقصّ النطاق بـ scope hammering.',
          note: {
            ar: 'الزمن ثابت؛ النطاق هو المتغير الوحيد الذي تملكونه — والخطة المبالغ فيها تقصّ نفسها بنفسها لكن متأخرة وبثمن أكبر.',
            en: 'Time is fixed; scope is the only variable you own — an inflated plan cuts itself anyway, but late and at a higher price.',
          },
        },
        {
          wrong: 'ترك متطلبات بلا مالك على أساس أن «الجميع سيتعاون».',
          right: 'لكل قصة مالك واختبارات؛ ما بلا مالك لن يبدأ.',
          note: {
            ar: 'سطر risk في خارطتكم موجود ليواجهكم بما تؤجلون؛ العلم المرفوع مبكرًا يمنح سبرنتين للرد لا ليلة واحدة.',
            en: 'The risk line on your map exists to confront what you defer; a flag raised early buys two sprints to react, not one night.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'خارطة التسليم أربع بوابات — proposal وskeletal وviable وfinal — وجاهزيتها بالأدلة لا بالتواريخ.',
          en: 'A delivery map is four gates — proposal, skeletal, viable, final — and readiness is by evidence, not dates.',
        },
        {
          ar: 'المسار كله يعمل الآن في مشروع واحد: أخلاق وعملية ومتطلبات ومعمارية وgit واختبار وأمان ومقاييس وتسليم وصيانة.',
          en: 'The whole track now runs inside one project: ethics, process, requirements, architecture, git, testing, security, metrics, delivery, maintenance.',
        },
        {
          ar: 'خطط بـ velocity الفعلية؛ النطاق هو المتغير، والقصّ الواعي جزء من الخطة لا فشل فيها.',
          en: 'Plan at real velocity; scope is the variable, and a conscious cut is part of the plan, not a failure of it.',
        },
        {
          ar: 'أعلام المخاطر تُقرأ كل أسبوع: ما بلا مالك، وما تبقى من الـ Must، وما انزلق عن بوابته.',
          en: 'Risk flags are read every week: what has no owner, what remains of the Musts, what slipped its gate.',
        },
      ],
      reflectPrompt: {
        ar: 'اكتب خارطة تسليم مشروعكم في أربعة أسطر: سطر لكل بوابة يذكر دليل جاهزيتها — ثم علّقها في README.',
        en: 'Write your delivery map in four lines: one per gate naming its readiness evidence — then pin it in the README.',
      },
    },
    {
      kind: 'sources',
      items: [{ book: 'SWE', section: 'swe.A.s7', pages: 'ص494-499 / pp.494-499' }],
    },
  ],
  sources: [{ book: 'SWE', section: 'swe.A.s7', pages: 'ص494-499 / pp.494-499' }],
} satisfies Lesson;

export default lesson;
