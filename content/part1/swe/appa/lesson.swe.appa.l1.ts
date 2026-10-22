/**
 * swe.appa.l1 — مشروع الفريق: النظرة العامة والمقترح / The Team Project: Overview and the Proposal
 * Sections: swe.A.s1 Overview (ص440-447 / pp.440-447) + swe.A.s2 Project Proposal (ص456-461 / pp.456-461)
 * Runnable design: proposal completeness gate — fixed section dict with present/MISSING flags,
 * a verdict + score printed as short ASCII; learners extend it to the one-page pitch check.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.appa.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 16,
  title: {
    ar: 'مشروع الفريق: النظرة العامة والمقترح',
    en: 'The Team Project: Overview and the Proposal',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch15.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'هذا الترم لن تقرأ فيه فصلًا وتحل تمرينًا فقط — ستبني نظامًا حقيقيًا يعمل على URL حقيقي لعميل حقيقي. والمفاجأة: العميل ليس عميلكم. في نموذج القبعتيْن كل فريق يكتب pitch لفكرة، يبنيها فريق آخر، ويصبح فريقكم عميلها. أربعة مخرجات تفصلكم عن نهاية الترم: proposal، فنظام هيكلي عظمي، فنظام قابل للحياة، فتقرير نهائي. أول بوابة — وهي التي يتعثر عندها أكثر الفرق — هي المقترح نفسه.',
        en: 'This term you will not only read a chapter and solve an exercise — you will build a real system on a real URL for a real customer. The twist: the customer is not yours. Under the dual-hat model every team writes a pitch for an idea, another team builds it, and your team becomes its customer. Four deliverables stand between you and the end of term: a proposal, then a skeletal system, then a viable system, then a final report. The first gate — the one most teams stumble on — is the proposal itself.',
      },
    },
    {
      kind: 'predict',
      code: `pitch = {
    'problem': 'clinic loses paper slips',
    'appetite': 'one term, two-week sprints',
    'rough_solution': '',
    'no_gos': 'no billing, no mobile app',
}
filled = [k for k in pitch if pitch[k]]
print('fields:', len(pitch), 'filled:', len(filled))
print('missing:', [k for k in pitch if not pitch[k]])`,
      question: {
        ar: 'هذا pitch من أربعة حقول، أحدها فارغ. قبل التشغيل: ماذا سيطبع السكربت، وأي حقل ينقص حتى يستطيع فريق غريب أن يبني من هذا المستند؟',
        en: 'This pitch has four fields, one of them empty. Before running: what will the script print, and which field is missing before a stranger team could build from this document?',
      },
      reveal: {
        ar: 'يطبع filled: 3 والناقص هو rough_solution. pitch بلا حل تقريبي مرسوم لا يصلح للبناء منه — غريب لا يعرف ما الذي سينشئه. لهذا تفحص الاكتمال قبل التسليم، حقولًا حقولًا.',
        en: 'It prints filled: 3 and the missing field is rough_solution. A pitch with no rough solution sketch cannot be built from — a stranger has no idea what to create. That is why you check completeness field by field before submitting.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'أربعة مخرجات على خط واحد', en: 'Four deliverables on one line' },
      chunks: [
        {
          ar: 'يقوم الملحق A على أربعة مخرجات متسلسلة: مقترح proposal يوقّعه العميل، فنظام هيكلي skeletal يمشي بمسار واحد رفيع من الطرف إلى الطرف وينشر مبكرًا على URL حقيقي، فنظام viable تعمل فيه قصص الـ Must لدى مستخدم حقيقي، ثم تقرير نهائي شامل مع عرض حي. عند التشغيل بسبرنتات لا يتغير شيء في هذه المحطات؛ تتحول فقط من تواريخ نصوّب عليها إلى محطات نصل إليها عبر السبرنتات: Sprint 0 تأهيل بأربعة تسليمات تقريبًا أسبوعية تنتهي بالنشر، ثم أربعة سبرنتات بناء من أسبوعين. القاعدة التي لا تنكسر: كل build sprint ينتهي بـ demo لبرنامج منشور من main، لا بشرائح. وكل سبرنت يضيف طبقة دائمة لخط التسليم: CI ثم CD ثم فحص التبعيات ثم سداد الدين التقني.',
          en: 'Appendix A hangs the team project on four sequential deliverables: a proposal the customer signs off, then a skeletal system — one thin path walking end to end, deployed early on a real URL, then a viable system where Must-have stories work for a real user, then a comprehensive final report with a live demo. Run the term on sprints and nothing about these milestones changes; they stop being dates you aim at and become checkpoints you reach through sprints: Sprint 0 onboarding with four roughly weekly deliverables ending in a deployment, then four two-week build sprints. The unbroken rule: every build sprint ends with a demo of deployed software from main, not slides. Each sprint also adds one permanent delivery-pipeline layer: CI, then CD, then dependency scanning, then debt paydown.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'القبعتيْن: عميل ومطوّر في فريق واحد', en: 'Dual hats: customer and developer on one team' },
      chunks: [
        {
          ar: 'أصعب ما يُصادف في مشروع صفي هو الفجوة بين العميل والمطورين. حين يبني الفريق فكرته يتحول عمل المتطلبات إلى تمثيل: الجميع يعرف مسبقًا ما يجب أن يفعله المنتج، والمقابلة حوار مع الذات، والقبول تصحيح واجبكم بأنفسكم. يعالج هذا المتغير المبادلة: كل فريق يكتب pitch لفكرته، وفريق آخر يبنيها، وأنكم لن تبوا فكرتكم أبدًا. لكل فريق قبعتان طوال الترم. بقبعة المطور تستمعون لعميلكم، وتديرون backlog، وتبنون وتختبرون وتنشرون. وبقبعة العميل تجيبون أسئلة الفريق الآخر، وتساعدون في ترتيب القصص عند تخطيط السبرنت — أنتم عمليًا صوت الـ product owner — وتحضرون Demo Day الخاص بهم وتقولون بصدق إن كان المنشور يطابق قصدكم. قناة دائمة تربط كل زوج مطور–عميل، وصمت قبعة العميل يُعد فشلًا لتلك القبعة.',
          en: "The hardest thing to make real in a classroom project is the gap between customer and developers. When a team builds its own idea, requirements work becomes theater: everyone already knows what the product should do, elicitation is a conversation with yourself, and acceptance is grading your own homework. The swap fixes this: every team writes a pitch, another team builds it, and you never build your own idea. Each team wears two hats all term. Under the developer hat you elicit from your customer, run the backlog, build, test, deploy. Under the customer hat you answer another team's questions, help prioritize stories at sprint planning — you are, functionally, their product owner's voice — attend their Demo Day, and say honestly whether what shipped is what you meant. A standing channel links every developer–customer pair; customer-hat silence is a failed hat.",
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'pitch صفحة واحدة، proposal من صفحتين إلى أربع', en: 'One-page pitch, two-to-four-page proposal' },
      chunks: [
        {
          ar: "الـ pitch ليس الـ proposal. الـ pitch صفحة واحدة بستة حقول: problem بقصة واحدة عن شخص محدد وكيف يتعامل مع المشكلة اليوم، appetite لماذا يستحق هذا فصلًا دراسيًا بالضبط، rough solution برسم fat-marker عمدًا بلا تفاصيل، rabbit holes حيث قد يحترق سبرنت كامل، no-gos ما هو خارج الحدود صراحةً، وcustomer contact بقناة واضحة. تكتبه لفريق غريب يبنيه. أما proposal فمستند من صفحتين إلى أربع يثبّت أربعة أشياء: بيان مشكلة ومستخدمون مسمّون مع وصول حقيقي إليهم، أول backlog بترتيب MoSCoW يتضمن بند Won't واحدًا على الأقل لإثبات واقعية النطاق، حدود in scope وout of scope صريحة، ومخاطر مكنونة مع spike مبكر لكل خطر. وأضف تعريفًا للـ definition of done للترم كله؛ فبه ستقيسون أنفسكم في التقرير النهائي.",
          en: "A pitch is not a proposal. The pitch is one page with six fields: problem — one story about a specific person and how they cope today; appetite — why this is worth exactly a term; rough solution — a deliberate fat-marker sketch; rabbit holes — where a whole sprint could burn; no-gos — what is explicitly out of bounds; and customer contact with a channel. You write it for a stranger team that will build it. The proposal is two to four pages that pin four things down: a problem statement and named users you can genuinely reach; a first MoSCoW backlog with at least one Won't item to prove the scope is realistic; explicit in-scope and out-of-scope boundaries; and named risks, each with an early spike probe. Add a term-wide definition of done — it is the bar you will measure yourselves against in the final report.",
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'بوابة اكتمال المقترح', en: 'The proposal completeness gate' },
      code: `SECTIONS = ['problem', 'users', 'moscow_backlog', 'scope_boundaries', 'risks', 'definition_of_done']
proposal = {
    'problem': 'two sentences on the slow paper queue',
    'users': 'clinic receptionist primary, patients secondary',
    'moscow_backlog': '8 stories with MoSCoW tags, 1 Wont item',
    'scope_boundaries': '',
    'risks': 'SMS gateway unknown - spike in week 1',
    'definition_of_done': 'receptionist books a visit end to end',
}
score = 0
for name in SECTIONS:
    filled = bool(proposal[name])
    print(name + ': ' + ('present' if filled else 'MISSING'))
    score += 1 if filled else 0
print('score:', str(score) + '/' + str(len(SECTIONS)))
print('verdict:', 'ready to sign' if score == len(SECTIONS) else 'not ready - fix the MISSING rows')`,
      explanation: {
        ar: 'كل قسم يُخزَّن نصًا؛ أي نص فارغ يعني قسمًا غير مكتمل. scope_boundaries فارغ هنا، فيهبط score إلى 5/6 ويقول verdict بوضوح: not ready. مقترح بلا حدود نطاق ليس تواضعًا — إنه دعوة مفتوحة لتوسّع النطاق في منتصف الترم. اجعل هذا الفحص خطوة إلزامية قبل توقيع العميل على docs/proposal.md.',
        en: 'Each section is stored as text; an empty string is an incomplete section. scope_boundaries is empty here, so the score drops to 5/6 and the verdict says plainly: not ready. A proposal without scope boundaries is not modest — it is an open invitation to mid-term scope creep. Run this check as a gate before the customer signs docs/proposal.md.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.pitch-check',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الـ pitch أول بوابة قبل الـ proposal. عندك dict اسمه pitch وقائمة PITCH_FIELDS مرتبة. أنشئ قائمة missing تجمع الحقول الفارغة بترتيب القائمة نفسه، ثم اطبع سطرين بالضبط: سطر missing: يليه القائمة، وسطر strangers can build: يليه yes إن لم ينقص شيء أو no إن نقص حقل واحد.',
        en: "The pitch is the first gate before the proposal. You get a dict named pitch and the ordered list PITCH_FIELDS. Build a list named missing collecting the empty fields in that same order, then print exactly two lines: missing: followed by the list, and strangers can build: followed by yes if nothing is missing or no if even one field is empty.",
      },
      starterCode: `PITCH_FIELDS = ['problem', 'appetite', 'rough_solution', 'rabbit_holes', 'no_gos', 'customer_contact']
pitch = {
    'problem': 'tutor pairings take a week of email tag',
    'appetite': 'one term, MVP-first',
    'rough_solution': 'a matching board with one-click pairing',
    'rabbit_holes': 'do not build a full chat system',
    'no_gos': '',
    'customer_contact': 'sara answers in channel tutor-swap',
}
# TODO: walk PITCH_FIELDS, collect empty fields into \`missing\`,
# then print 'missing: <list>' and 'strangers can build: yes|no'
...`,
      solution: `PITCH_FIELDS = ['problem', 'appetite', 'rough_solution', 'rabbit_holes', 'no_gos', 'customer_contact']
pitch = {
    'problem': 'tutor pairings take a week of email tag',
    'appetite': 'one term, MVP-first',
    'rough_solution': 'a matching board with one-click pairing',
    'rabbit_holes': 'do not build a full chat system',
    'no_gos': '',
    'customer_contact': 'sara answers in channel tutor-swap',
}
missing = []
for field in PITCH_FIELDS:
    if not pitch[field]:
        missing.append(field)
print('missing: ' + str(missing))
print('strangers can build: ' + ('yes' if not missing else 'no'))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'قائمة missing صحيحة', en: 'missing list is correct' },
          code: `assert missing == ['no_gos'], 'expected missing == [no_gos], got %r' % (missing,)`,
          expected: "['no_gos']",
        },
        {
          id: 't2',
          name: { ar: 'سطر الحكم', en: 'verdict line' },
          code: `assert 'strangers can build: no' in __learner_output__, 'expected: strangers can build: no | actual: %r' % __learner_output__`,
          expected: 'strangers can build: no',
        },
        {
          id: 't3',
          name: { ar: 'الحقل الناقص مذكور', en: 'missing field is listed' },
          code: `assert 'no_gos' in __learner_output__, 'expected: no_gos | actual: %r' % __learner_output__`,
          expected: 'no_gos',
        },
      ],
      hints: [
        { ar: 'الحقل فارغ عندما تكون قيمته نصًا فارغًا: not pitch[field] يكفي كشرط.', en: 'A field is empty when its value is an empty string: not pitch[field] is a sufficient condition.' },
        { ar: 'امشِ على PITCH_FIELDS بالترتيب، لا على dict نفسه، حتى تخرج missing بترتيب القائمة.', en: 'Iterate over PITCH_FIELDS in order, not over the dict itself, so missing comes out in list order.' },
        { ar: 'ابدأ بـ missing = [] ثم حلقة for تضيف بالـ append، وأخيرًا سطرا print.', en: 'Start with missing = [], then a for loop that appends, then two print lines.' },
        { ar: "سطرا الطباعة: print('missing: ' + str(missing)) ثم print('strangers can build: ' + ('yes' if not missing else 'no')).", en: "The two prints: print('missing: ' + str(missing)) then print('strangers can build: ' + ('yes' if not missing else 'no'))." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-map',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود بعناية: dict يربط كل milestone برقم سبرنته، والحلقة تمشي على المفاتيح مرتبة أبجديًا. اكتب المخرجات الكاملة بدقة، سطرًا سطرًا.',
        en: 'Read the code carefully: a dict maps each milestone to its sprint number, and the loop walks the keys in sorted order. Write the exact output, line by line.',
      },
      code: `plan = {'proposal': 0, 'skeletal': 0, 'viable': 2, 'final': 4}
for name in sorted(plan):
    n = plan[name]
    tag = 'onboarding' if n == 0 else 'build'
    print(name + ' -> sprint ' + str(n) + ' ' + tag)`,
      solution: `plan = {'proposal': 0, 'skeletal': 0, 'viable': 2, 'final': 4}
for name in sorted(plan):
    n = plan[name]
    tag = 'onboarding' if n == 0 else 'build'
    print(name + ' -> sprint ' + str(n) + ' ' + tag)`,
      answer: 'final -> sprint 4 build\nproposal -> sprint 0 onboarding\nskeletal -> sprint 0 onboarding\nviable -> sprint 2 build',
      hints: [
        { ar: 'sorted(plan) يرتب المفاتيح النصية أبجديًا: final ثم proposal ثم skeletal ثم viable.', en: 'sorted(plan) sorts the string keys alphabetically: final, then proposal, then skeletal, then viable.' },
        { ar: 'الرقم 0 يعني onboarding — سبرنت 0 تأهيل — وأي رقم آخر يعني build.', en: 'Sprint 0 means onboarding — the Sprint 0 onboarding phase — and any other number means build.' },
        { ar: 'السطر يكون name + -> sprint + n + tag، مفصولة بمسافات.', en: 'Each line is name + -> sprint + n + tag, joined with spaces.' },
        { ar: 'المحطات: proposal وskeletal في سبرنت 0، viable في سبرنت 2، final في سبرنت 4.', en: 'The checkpoints: proposal and skeletal in sprint 0, viable in sprint 2, final in sprint 4.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-swap',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'تحت نموذج القبعتيْن (dual-hat)، ماذا يحدث للفكرة التي يكتبها فريقك؟',
        en: 'Under the dual-hat model, what happens to the idea your team writes up?',
      },
      options: [
        { id: 'a', text: { ar: 'يبنيها فريقكم نفسه بعد الموافقة على الـ proposal', en: 'Your own team builds it once the proposal is approved' } },
        { id: 'b', text: { ar: 'يبنيها فريق آخر طوال الترم، وفريقكم يصبح عميلها: يجيب الأسئلة، يرتب القصص، ويقيّم كل Demo Day', en: 'Another team builds it all term, and your team becomes its customer: answering questions, prioritizing stories, reviewing every Demo Day' } },
        { id: 'c', text: { ar: 'تُؤرشف، لأن كل فريق يختار فكرته المفضلة من قائمة القسم', en: 'It is archived, because each team picks its favorite idea from a class list' } },
        { id: 'd', text: { ar: 'تتحول إلى تقرير نهائي بدل نظام يعمل', en: 'It turns into a final report instead of a working system' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'تذكّر جملة المبدأ في الدرس: أنتم لن تبوا فكرتكم أبدًا.', en: 'Recall the principle line from the lesson: you never build your own idea.' },
        { ar: 'المبادلة هي التي تجعل الفجوة بين العميل والمطور حقيقية بدل أن تكون تمثيلًا.', en: 'The swap is what makes the customer–developer gap real instead of theater.' },
        { ar: 'فكّر في قبعتين: من يبني؟ ومن يجيب عن المعنى المطلوب عند كل عرض؟', en: 'Think in two hats: who builds? And who answers for the intended meaning at every demo?' },
        { ar: 'الفكرة يبنيها غرباء — وفريقكم هو العميل الذي يخدمهم طوال الترم.', en: 'The idea is built by strangers — and your team is the customer they serve all term.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-scope',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'في هذا المشروع الزمن ثابت (سبرنتان لكل دورة) والمتغير الوحيد هو النطاق. عند الضيق نطبّق scope hammering: نصغّر المهمة لا الموعد. أكمل الجملة الإنجليزية بكلمة واحدة: fixed time, variable ___.',
        en: 'In this project time is fixed (two weeks per sprint) and scope is the only variable. When the box gets tight you apply scope hammering: shrink the task, not the deadline. Complete the English sentence with one word: fixed time, variable ___.',
      },
      answer: 'scope',
      solution: 'scope',
      hints: [
        { ar: 'الشهية ثابتة والزمن ثابت؛ ما يتقلص هو حجم العمل.', en: 'Appetite is fixed and time is fixed; what shrinks is the size of the work.' },
        { ar: 'الكلمة نفسها الواردة في مصطلح scope hammering من الفصل 2.', en: 'The word is the same one in scope hammering from Chapter 2.' },
        { ar: 'سؤال السبرنت: ما أفضل نسخة يمكن عرضها في أسبوعين؟ ثم قصّ العمل ليلائم ذلك.', en: 'The sprint question: what is the best version we can demo in two weeks? Then trim the work to fit.' },
        { ar: 'الجواب كلمة إنجليزية واحدة: النطاق.', en: 'Answer with one English word: scope.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `SECTIONS = ['problem', 'users', 'moscow_backlog', 'scope_boundaries', 'risks', 'definition_of_done']
proposal = {
    'problem': 'two sentences on the slow paper queue',
    'users': 'receptionist primary, patients secondary',
    'moscow_backlog': '8 stories, 3 Must, 1 Wont',
    'scope_boundaries': '',
    'risks': 'SMS gateway unknown - spike in week 1',
    'definition_of_done': 'receptionist books a visit end to end',
}
score = 0
for name in SECTIONS:
    filled = bool(proposal[name])
    print(name + ': ' + ('present' if filled else 'MISSING'))
    score += 1 if filled else 0
print('score:', str(score) + '/' + str(len(SECTIONS)))
print('verdict:', 'ready to sign' if score == len(SECTIONS) else 'not ready - fix the MISSING rows')`,
      prompt: {
        ar: 'ملعب بوابة المقترح. جرّب: 1) املأ scope_boundaries بنص حقيقي وأعد التشغيل حتى ينقلب verdict إلى ready to sign. 2) أفرِغ problem وشاهد ماذا يحدث للscore. 3) أضف قسمًا من عندك إلى SECTIONS ووازن التقييم — هل يبقى المعيار عادلًا؟',
        en: 'Playground for the proposal gate. Try: 1) fill scope_boundaries with real text and re-run until the verdict flips to ready to sign. 2) empty problem and watch what happens to the score. 3) add a section of your own to SECTIONS — does the bar stay fair?',
      },
    },
    {
      kind: 'quiz',
      id: 'swe.appa.l1.quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'backlog المقترح مكتوب بترتيب MoSCoW. لماذا يُطلب بند Wont-this-term واحد على الأقل؟',
            en: "The proposal backlog is written in MoSCoW order. Why is at least one Won't-this-term item required?",
          },
          options: [
            { id: 'a', text: { ar: 'لجعل القائمة تبدو أطول وأغنى', en: 'To make the list look longer and richer' } },
            { id: 'b', text: { ar: 'لإثبات أن النطاق واقعي ومقصوص بوعي، لا عرضيًا', en: 'To prove the scope is realistic and consciously cut, not accidentally' } },
            { id: 'c', text: { ar: 'لأن العميل يرفض عادة كل الأفكار الجديدة', en: 'Because the customer usually rejects every new idea' } },
            { id: 'd', text: { ar: 'لتوفير عمل احتياطي إن فرغ الفريق مبكرًا', en: 'To provide spare work if the team finishes early' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'خطة بلا Wont ليست نطاقًا بل قائمة أمنيات؛ أول ضغط في الترم سيكسرها. هذا MoSCoW من الفصل 4 مطبقًا على مقترحكم.',
            en: "A plan without a Won't item is a wish list, not a scope; the first mid-term pressure will break it. This is Chapter 4's MoSCoW applied to your own proposal.",
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'Demo Day في نهاية كل build sprint يقابل أي حدث من Scrum؟',
            en: 'Demo Day at the end of every build sprint corresponds to which Scrum event?',
          },
          options: [
            { id: 'a', text: { ar: 'Daily standup', en: 'Daily standup' } },
            { id: 'b', text: { ar: 'Sprint review', en: 'Sprint review' } },
            { id: 'c', text: { ar: 'Backlog grooming', en: 'Backlog grooming' } },
            { id: 'd', text: { ar: 'Sprint retrospective', en: 'Sprint retrospective' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'عرض المنتج المنشور أمام العميل والجمهور هو sprint review من الفصل 2؛ أما Team Review فيفحص طريقة عمل الفريق — وهي الطبعة الصفية للـ retrospective.',
            en: 'Demonstrating the deployed product to the customer and audience is the sprint review from Chapter 2; the Team Review inspects how the team works — the classroom edition of the retrospective.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'بقبعة العميل، ما واجبك في Demo Day الخاص بالفريق الذي يبني فكرتك؟',
            en: 'Wearing the customer hat, what is your duty at the Demo Day of the team building your idea?',
          },
          options: [
            { id: 'a', text: { ar: 'الحضور صامتًا ثم كتابة تقييم واحد في نهاية الترم', en: 'Attend silently, then write one evaluation at the end of term' } },
            { id: 'b', text: { ar: 'إرسال الملاحظات في رسالة واحدة بعد العرض النهائي', en: 'Send your notes in a single message after the final demo' } },
            { id: 'c', text: { ar: 'ردّ فعل صادق يُسجَّل في مراجعة الفريق ويغذي backlog السبرنت التالي', en: 'An honest reaction recorded in the team review that feeds the next sprint backlog' } },
            { id: 'd', text: { ar: 'طلب ميزات جديدة خارج النطاق المتفق عليه', en: 'Requesting new features outside the agreed scope' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'ملاحظات العميل تُسجَّل وتتحول إلى بنود backlog؛ وصمت قبعة العميل يُعد فشلًا لتلك القبعة، لأن التغذية الراجعة المتأخرة أسوأ من عدمها.',
            en: 'Customer feedback is recorded and becomes backlog items; customer-hat silence counts as a failed hat, because late feedback is worse than none.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي جملة تصف proposal قويًا؟',
            en: 'Which sentence describes a strong proposal?',
          },
          options: [
            { id: 'a', text: { ar: 'رؤية واسعة بلا حدود حتى تبقى الحرية مفتوحة', en: 'A broad vision with no boundaries so freedom stays open' } },
            { id: 'b', text: { ar: 'نطاق صغير يمكن الدفاع عنه طوال الترم، وصول حقيقي لمستخدم، ومخاطر مكنونة مع تجارب مبكرة', en: 'A small scope you can defend all term, real access to a user, and named risks with early probes' } },
            { id: 'c', text: { ar: 'قائمة تقنيات وأرقام بلا مستخدمين مسمّين', en: 'A list of technologies and numbers without named users' } },
            { id: 'd', text: { ar: 'نسخة موسعة من الـ pitch تضاف إليها كل الميزات الممكنة', en: 'An expanded pitch with every possible feature added' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المقترح يثبّت أربعة: مشكلة ومستخدمون يمكن الوصول إليهم، backlog بـ MoSCoW فيه Wont، حدود نطاق صريحة، ومخاطر مع spike لكل منها.',
            en: "The proposal pins four things: a problem and reachable users, a MoSCoW backlog with a Won't, explicit scope boundaries, and risks each with a spike.",
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'أن يبني الفريق فكرته الخاصة لأنها «أسهل» من بناء فكرة الغير.',
          right: 'الالتزام بالمبادلة: ابنِ فكرة فريق آخر، وكن عميل فكرتك بأمانة.',
          note: {
            ar: 'بلا فجوة حقيقية بين العميل والمطور تصبح كل خطوات المتطلبات تمثيلًا، والقبول تصحيحًا ذاتيًا لواجبكم.',
            en: 'Without a real customer–developer gap, every requirements step becomes theater and acceptance becomes grading your own homework.',
          },
        },
        {
          wrong: 'تسليم proposal من ثماني صفحات بلا أي بند Wont-this-term.',
          right: 'من صفحتين إلى أربع، مع MoSCoW كامل وبند Wont-this-term صريح.',
          note: {
            ar: "النطاق الذي لا يرفض شيئًا ليس نطاقًا؛ إنه قائمة أمنيات ستنفجر عند أول ضغط في الترم.",
            en: "A scope that refuses nothing is not a scope; it is a wish list that explodes under the term's first pressure.",
          },
        },
        {
          wrong: 'ترك rabbit holes وno-gos فارغتين حتى «لا نقيّد أنفسنا».',
          right: 'سمِّ أين قد يحترق السبرنت وما لن يُبنى، قبل أن يبدأ الفريق الآخر البناء.',
          note: {
            ar: 'الفريق الغريب سيكتشف الثقوب وحده — لكن بعد أسبوعين من الوقت المهدور وأسبوع من التوتر كان يمكن توفيرهما.',
            en: 'The stranger team will find the holes on its own — but only after two wasted weeks and a tense week that could have been saved.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'أربعة مخرجات تحكم الترم: proposal ثم skeletal ثم viable ثم تقرير نهائي؛ وبسبرنتات تتحول من تواريخ نصوّب عليها إلى محطات نصلها.',
          en: 'Four deliverables govern the term: proposal, then skeletal, then viable, then the final report; on sprints they stop being dates and become checkpoints.',
        },
        {
          ar: 'المبادلة تجعل العميل حقيقيًا: كل فريق يبني فكرة فريق آخر، ويصبح عميلًا لفكرته هو الآخر.',
          en: 'The swap makes the customer real: every team builds another team’s idea and serves as customer for its own.',
        },
        {
          ar: 'pitch صفحة واحدة لغرباء؛ proposal من صفحتين إلى أربع يثبّت MoSCoW وحدود النطاق والمخاطر وتعريف done.',
          en: 'A pitch is one page for strangers; a proposal is two to four pages pinning MoSCoW, scope boundaries, risks, and a definition of done.',
        },
        {
          ar: 'القاعدة غير القابلة للكسر: كل build sprint ينتهي بـ demo لبرنامج منشور من main — لا بشرائح.',
          en: 'The unbroken rule: every build sprint ends with a demo of software deployed from main — not slides.',
        },
      ],
      reflectPrompt: {
        ar: 'ما الـ Wont الذي ستكتبه في أول مقترح لفريقك، ولماذا يبدو كتابته أصعب من كتابة قائمة Must؟',
        en: "What Won't item will you write into your team's first proposal, and why does writing it feel harder than listing Musts?",
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.A.s1', pages: 'ص440-447 / pp.440-447' },
        { book: 'SWE', section: 'swe.A.s2', pages: 'ص456-461 / pp.456-461' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.A.s1', pages: 'ص440-447 / pp.440-447' },
    { book: 'SWE', section: 'swe.A.s2', pages: 'ص456-461 / pp.456-461' },
  ],
} satisfies Lesson;

export default lesson;
