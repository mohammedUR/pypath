/**
 * swe.ch13.l4 — مبادئ المهندس المُعزَّز بالذكاء الاصطناعي (ختام الفصل) /
 * Principles for the AI-Augmented Engineer (chapter final)
 * SWE ch13 — s8 Principles for the AI-Augmented Engineer (ص363 / pp.363) + s9
 * Conclusion (ص364 / pp.364).
 * Runnable design: PROJECT VERIFY-LEDGER — a deterministic review-gate engine that
 * ships an agent-written change only through three gates (tests / separate review /
 * spec alignment) and stops the line otherwise; a debug block shows the self-graded
 * audit (tests-green-only) shipping unreviewed and off-spec changes.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch13.l4',
  version: 1,
  part: 'II',
  track: 'A9',
  book: 'SWE',
  chapter: 13,
  title: {
    ar: 'مبادئ المهندس المُعزَّز بالذكاء الاصطناعي',
    en: 'Principles for the AI-Augmented Engineer',
  },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch13.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'انتهى الفصل بأربعة أسطر تصلح أن تُعلَّق فوق مكتبك: امتلك النية، أبقِ الفحص، وابقَ قادرًا على قول "لا". مشروع هذا الدرس يجسّدها: محرك بوابات مراجعة يوقف كل تغيير وكيلي عند أول بوابة ناقصة — لأن الحلقة تنفّذ حكمك مئة مرة، فتأكد أنك أحضرت حكمًا تستحق التنفيذ مئة مرة.',
        en: 'The chapter ends with four lines worth pinning above your desk: own the intent, keep the check, and stay able to say "no". This lesson project embodies them: a review-gate engine that stops every agent-written change at its first missing gate — because the loop executes your judgment a hundred times, so make sure you brought judgment worth executing a hundred times.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'ستة مبادئ للعمل مع الوكلاء',
        en: 'Six principles for working with agents',
      },
      chunks: [
        {
          ar: 'خلاصة الأدلة والبيان في ستة مبادئ عمل. أولًا امتلك النية والتحقق: اختر الوجهة وعرّف "صحيح"، ودع الوكلاء يستكشفون الطرق — وأنت مسؤول عمّا يُشحن؛ أخلاقيات الفصل الأول لا تُفوَّض. ثانيًا أبقِ الأساسيات: لا يمكنك قبول بأمان ما لا تستطيع تقييمه؛ افهم التصميم والاختبارات والمقاييس قدرًا يكفي لاصطياد جواب واثق وخاطئ. ثالثًا انقل جهدك أعلى السلسلة: صرف الوقت الذي وفّره الذكاء الاصطناعي على التحديد (متطلبات، معايير قبول، سجلات قرارات) والفحص (مراجعات، تغطية، مقاييس) — لا على توليد شيفرة أكثر.',
          en: 'The evidence and the manifesto distill into six working principles. First, own intent and verification: choose the destination and define "correct", let agents explore paths — you are accountable for what ships; Chapter 1 ethics do not delegate. Second, keep the fundamentals: you cannot safely accept what you cannot evaluate; understand the design, the tests, and the metrics well enough to catch a confident wrong answer. Third, shift your effort up the stack: spend the time AI frees on specifying (requirements, acceptance criteria, ADRs) and checking (reviews, coverage, metrics) — not on generating more code.',
        },
        {
          ar: 'رابعًا أدِر المخاطر الجديدة: عيوب الأمن، وترخيص الشيفرة المولَّدة وأصلها، والهلوسة، والثقة الزائدة، وتآكل المهارة — صارت مخاوف هندسية من الدرجة الأولى. خامسًا قِس النواتج لا النشاط: احكم على نفسك ووكلائك بالقيمة الموثقة المسلَّمة والعيوب التي أفلتت — لا بعدد الأسطر ولا بعدد طلبات الدمج؛ قانون جودهارت من الفصل 12 يلاحق كل مؤشر نشاط. سادسًا أتمت الحلقة لا الحكم: شفِّر نيتك حيث يقرأها الوكلاء، وحدّد قبل أن تولّد، واجعل لكل حلقة فحصًا منفصلًا وبوابة بشرية — السرعة لا تكون آمنة إلا خلف تحقق تملكه.',
          en: 'Fourth, manage the new risks: security defects, license and provenance of generated code, hallucination, over-trust, and skill atrophy are now first-class engineering concerns. Fifth, measure outcomes, not activity: judge yourself and your agents by verified value delivered and defects escaped — never by lines of code or PR counts; Chapter 12 Goodhart discipline hunts every activity metric. Sixth, automate the loop, not the judgment: encode your intent where agents read it, specify before you generate, and give every loop a separate check and a human gate — speed is only safe behind verification you control.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'الخاتمة: الضغوط لا تُلغى بل ينتقل ثقلها',
        en: 'The close: the pressures are relocated, not repealed',
      },
      chunks: [
        {
          ar: 'الذكاء الاصطناعي لا يلغي الضغوط الأربع لهندسة البرمجيات؛ ينقل ثقلها. إنتاج الشيفرة صار أرخص، فيصبح تمايزك هو قرار ما نبنيه وإثبات أنه يعمل — موضوع كل فصل في هذا الكتاب، والذي تعلمته ترقّى لم يصبح طريفًا. المتطلبات صارت ما تسلّمه للوكيل ليبنى منه. الموصفة صارت الدستور الذي يعمل تحته. الاختبارات والمراجعات هما الطبقة التي تحسم إن كان يمكن الوثوق بحجم الشيفرة المولَّدة. والمقاييس هي الدليل على أن نتيجة حقيقية شُحنت لا مجرد مخرجات.',
          en: 'AI does not repeal the four pressures of software engineering; it relocates their weight. Producing code got cheaper, so deciding what to build and proving it works — the subject of every chapter in this book — is the differentiator, and what you learned was promoted, not made quaint. Requirements are now what you hand the agent to build from. The specification is the constitution it works under. Tests and reviews are the layer that decides whether the volume of generated code can be trusted. Metrics are the evidence that a real outcome shipped rather than mere output.',
        },
        {
          ar: 'وبيان o16g يدفع هذا إلى أقصاه — لم يكن الأمر أبدًا عن الشيفرة — ومهما قبلت من ادعاءاته فهو يشير إلى حيث تتجه المهنة: مهندسون يوجّهون أسراب وكلاء نحو نواتج محددة بدقة ومتحقق منها بصرامة. والممارسات تصل: تكتب الموصفة، وتشفّر الدستور في ملف يقرأه الوكلاء، وتصمم الحلقة التي تشغّلهم — وفي كل ذلك عمل الإنسان واحد: امتلك النية، أبقِ الفحص، وابقَ قادرًا على قول لا. هذا ليس هندسة أقل؛ إنه المزيد من أصعب أجزائها وأكثرها إنسانية.',
          en: 'And the o16g manifesto pushes this to its edge — it was never about the code — and whatever you accept of its claims, it points where the profession may be heading: engineers directing fleets of agents toward well-specified, rigorously verified outcomes. The practices are arriving: you write the spec, encode the constitution in a file the agents read, and design the loop that runs them — but in every one of them the human job is the same: own the intent, keep the check, and stay able to say no. That is not less engineering. It is more of its hardest, most human parts.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'انزياح الجهد: أسبوع المهندس قبل الوكلاء وبعدهم',
        en: 'The effort shift: one engineer week, before agents and after',
      },
      code: `# EFFORT SHIFT: the same engineer week, before agents and after them.
WEEK = [
    ("specify: requirements + acceptance criteria", 8, 14),
    ("check: reviews, tests, metrics", 10, 18),
    ("generate: writing the first draft", 22, 8),
]
before_total = 0
after_total = 0
for name, before, after in WEEK:
    before_total += before
    after_total += after
    print(name + ": " + str(before) + "h -> " + str(after) + "h")
print("week: " + str(before_total) + "h -> " + str(after_total) + "h")
print("the effort moved up the stack, not away")
`,
      explanation: {
        ar: 'الأسبوع لا يقصر — يرتفع. الكتابة الأولية انهارت من 22 ساعة إلى 8، والفرق ذهب إلى التحديد (8 إلى 14) والفحص (10 إلى 18). هذا هو المبدأ الثالث بالأرقام: الوقت الذي وفّره الوكيل يُستثمر في أعلى السلسلة — موصفات أدق ومراجعات أشد — لأن عنق الزجاجة انتقل إلى هناك. من يصرف الوفر على توليد شيفرة أكثر يوسّع الطرف الذي لا يتحكم فيه، ويغذي دين التحقق الذي سيُطالب به صباحًا ما.',
        en: 'The week does not shrink — it climbs. First-draft writing collapsed from 22 hours to 8, and the difference moved into specifying (8 to 14) and checking (10 to 18). That is Principle 3 in numbers: the time the agent frees gets invested up the stack — sharper specs, harder reviews — because that is where the bottleneck now sits. Whoever spends the surplus generating more code expands the end they control least and feeds the verification debt they will be billed for one morning.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.verify-ledger',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'مشروع الفصل — دفتر التحقق: أكمل audit لتطبق بوابات الخطر الثلاث على كل تغيير وكيلي. لكل صف احسب failed من GATES؛ إن خلت فاطبع id ثم ": ship" وزد العداد، وإلا فاطبع id ثم ": stop (" ثم أسماء البوابات الفاشلة بفواصل ثم ")". في النهاية اطبع "shipped: x/n" و"stopped: ..." وأعد عدد المشحون. المطبوع يجب أن يطابق تمامًا: C2: stop (review) و shipped: 2/5.',
        en: 'Chapter project — the verify ledger: complete audit to enforce the three risk gates on every agent-written change. For each row compute failed from GATES; if empty, print the id then ": ship" and count it; otherwise print the id, ": stop (", the failed gate names joined by commas, and ")". Finally print "shipped: x/n" and "stopped: ..." and return the shipped count. The output must match exactly: C2: stop (review) and shipped: 2/5.',
      },
      starterCode: `# PROJECT: VERIFY-LEDGER - the review-gate engine for agent-written changes.
# A change ships only through three gates (risk stops the line):
#   tests  - a green suite the agent did not grade alone
#   review - a SEPARATE reviewer (the author is the worst judge)
#   spec   - still aligned with the specification (the source of truth)
# Row: (change_id, kind, tests_pass, separate_review, spec_aligned)
LEDGER = [
    ("C1", "fix", True, True, True),
    ("C2", "feature", True, False, True),
    ("C3", "fix", False, True, True),
    ("C4", "feature", True, True, False),
    ("C5", "fix", True, True, True),
]
GATES = [("tests", 2), ("review", 3), ("spec", 4)]

def audit(rows):
    shipped = 0
    stopped = []
    for row in rows:
        failed = [name for name, i in GATES if not row[i]]
        # TODO: if failed is empty -> ship the change and count it;
        # otherwise record row[0] in stopped. Print one line per change:
        #   row[0] + ": ship"   or   row[0] + ": stop (" + ", ".join(failed) + ")"
        pass
    print("shipped: " + str(shipped) + "/" + str(len(rows)))
    print("stopped: " + ", ".join(stopped))
    return shipped

total = audit(LEDGER)
`,
      solution: `# PROJECT: VERIFY-LEDGER - the review-gate engine for agent-written changes.
# A change ships only through three gates (risk stops the line):
#   tests  - a green suite the agent did not grade alone
#   review - a SEPARATE reviewer (the author is the worst judge)
#   spec   - still aligned with the specification (the source of truth)
# Row: (change_id, kind, tests_pass, separate_review, spec_aligned)
LEDGER = [
    ("C1", "fix", True, True, True),
    ("C2", "feature", True, False, True),
    ("C3", "fix", False, True, True),
    ("C4", "feature", True, True, False),
    ("C5", "fix", True, True, True),
]
GATES = [("tests", 2), ("review", 3), ("spec", 4)]

def audit(rows):
    shipped = 0
    stopped = []
    for row in rows:
        failed = [name for name, i in GATES if not row[i]]
        if failed:
            stopped.append(row[0])
            print(row[0] + ": stop (" + ", ".join(failed) + ")")
        else:
            shipped += 1
            print(row[0] + ": ship")
    print("shipped: " + str(shipped) + "/" + str(len(rows)))
    print("stopped: " + ", ".join(stopped))
    return shipped

total = audit(LEDGER)
`,
      tests: [
        {
          id: 'c2-blocked-on-review',
          name: { ar: 'C2 يُوقف عند بوابة المراجعة', en: 'C2 is stopped at the review gate' },
          code: "assert 'C2: stop (review)' in __learner_output__, 'expected: C2: stop (review) | actual: %r' % __learner_output__",
        },
        {
          id: 'shipped-count',
          name: { ar: 'شُحنت اثنتان من خمسة', en: 'two of five shipped' },
          code: "assert 'shipped: 2/5' in __learner_output__, 'expected: shipped: 2/5 | actual: %r' % __learner_output__",
        },
        {
          id: 'audit-return',
          name: { ar: 'الدالة تعيد 2', en: 'audit returns 2' },
          code: "assert audit(LEDGER) == 2, 'expected 2 shipped | actual: %r' % audit(LEDGER)",
        },
      ],
      hints: [
        { ar: 'المتغير failed جاهز: قائمة أسماء البوابات التي قيمتها False في الصف. الحكم كله على فراغه.', en: 'The variable failed is ready: the list of gate names whose bit is False in the row. Your whole decision hangs on whether it is empty.' },
        { ar: 'فرع الشحن: shipped += 1 واطبع row[0] + ": ship". فرع الإيقاف: stopped.append(row[0]) واطبع row[0] + ": stop (" + ", ".join(failed) + ")".', en: 'Ship branch: shipped += 1 and print row[0] + ": ship". Stop branch: stopped.append(row[0]) and print row[0] + ": stop (" + ", ".join(failed) + ")".' },
        { ar: 'سطرا الخلاصة والعودة مكتوبان في الهيكل بالفعل؛ لا تغيّرهما — فقط املأ الفراغ داخل الحلقة.', en: 'The summary prints and the return are already written in the skeleton; change neither — only fill the gap inside the loop.' },
        { ar: 'المتوقع: C1 وC5 مشحونان، وC2 متوقف على review، وC3 على tests، وC4 على spec — فيصير shipped: 2/5 وstopped: C2, C3, C4.', en: 'Expected: C1 and C5 ship; C2 stops on review, C3 on tests, C4 on spec — giving shipped: 2/5 and stopped: C2, C3, C4.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.principles-trace',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ حلقة المبادئ الست واكتب المخرجات المطبوعة سطرًا سطرًا.',
        en: 'Read the six-principles loop and write the printed output line by line.',
      },
      code: `PRINCIPLES = ["own intent", "keep fundamentals", "shift up", "manage risks",
              "outcomes not activity", "automate the loop, not the judgment"]
for i, principle in enumerate(PRINCIPLES, 1):
    print(str(i) + ": " + principle)
`,
      answer: '1: own intent\n2: keep fundamentals\n3: shift up\n4: manage risks\n5: outcomes not activity\n6: automate the loop, not the judgment',
      solution: '1: own intent\n2: keep fundamentals\n3: shift up\n4: manage risks\n5: outcomes not activity\n6: automate the loop, not the judgment',
      hints: [
        { ar: 'القائمة سطران في المصدر لكنها قائمة واحدة من ستة عناصر — enumerate يرقّمها 1 حتى 6.', en: 'The list spans two source lines but is one list of six items — enumerate numbers them 1 through 6.' },
        { ar: 'كل سطر مطبوع: الرقم، ثم ": "، ثم نص المبدأ كما كُتب حرفيًا.', en: 'Each printed line is the number, then ": ", then the principle text verbatim.' },
        { ar: 'العنوان السادس يحوي فاصلة: "automate the loop, not the judgment" — انسخها كما هي.', en: 'The sixth item contains a comma: "automate the loop, not the judgment" — copy it exactly.' },
        { ar: 'ستة أسطر إجمالًا، بلا سطر خلاصة بعد الحلقة.', en: 'Six lines in total, with no closing line after the loop.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.outcomes-mcq',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'مديرك يريد تقييم أثر الوكلاء على الفريق. أي مؤشر تقترح لأنه يقاوم التلاعب ويقيس نتيجة لا نشاطًا؟',
        en: 'Your manager wants to assess the agents impact on the team. Which metric do you propose because it resists gaming and measures an outcome, not activity?',
      },
      options: [
        { id: 'a', text: { ar: 'عدد الأسطر المولَّدة أسبوعيًا', en: 'lines of code generated per week' } },
        { id: 'b', text: { ar: 'عدد طلبات الدمج التي فتحها الوكلاء', en: 'the number of pull requests agents opened' } },
        { id: 'c', text: { ar: 'العيوب التي اكتشفها العملاء والقيمة الموثقة المسلَّمة', en: 'customer-found defects and verified value delivered' } },
        { id: 'd', text: { ar: 'عدد الالتزامات في اليوم', en: 'the number of commits per day' } },
      ],
      answer: 'c',
      solution: 'c',
      hints: [
        { ar: 'قانون جودهارت من الفصل 12: أي مؤشر يصبح هدفًا يُلعَب — وعدد الأسطر والالتزامات أرخص ما يمكن تضخيمه.', en: 'Chapter 12 Goodhart law: any metric that becomes a target gets gamed — and lines and commits are the cheapest things to inflate.' },
        { ar: 'عندما تصدر الآلة آلاف الأسطر عند الطلب يتحول عدد الأسطر من مؤشر ضعيف إلى مؤشر مضلل.', en: 'When a machine emits thousands of lines on request, lines of code turn from a weak proxy into an actively misleading one.' },
        { ar: 'اسأل: هل يقيس المؤشر شيئًا يريده المستخدم؟ العيوب التي يراها العملاء والقيمة الموثقة يصعب تزييفهما.', en: 'Ask: does the metric track something a user wants? Customer-found defects and verified value are hard to fake.' },
        { ar: 'الجواب c: النواتج لا النشاط — وهو أيضًا ما يقيك قانون جودهارت.', en: 'Answer c: outcomes, not activity — which is also what shields you from Goodhart.' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex4.debug-self-graded',
      required: true,
      brokenCode: `# BROKEN: this auditor is the generator grading its own homework.
# It ships a change when the test suite is green - and checks nothing else.
LEDGER = [
    ("C1", "fix", True, True, True),
    ("C2", "feature", True, False, True),
    ("C3", "fix", False, True, True),
    ("C4", "feature", True, True, False),
    ("C5", "fix", True, True, True),
]

def audit(rows):
    shipped = 0
    stopped = []
    for row in rows:
        if row[2]:
            shipped += 1
            print(row[0] + ": ship (tests green)")
        else:
            stopped.append(row[0])
            print(row[0] + ": stop (tests)")
    print("shipped: " + str(shipped) + "/" + str(len(rows)))
    print("stopped: " + ", ".join(stopped))
    return shipped

audit(LEDGER)
`,
      prompt: {
        ar: 'هذا المدقق يوافق على شيفرة الوكيل لأن الاختبارات خضراء فقط — وهو الوكيل نفسه يقيّم واجبه! لاحظ المطبوع: C2 شُحنت رغم غياب المراجع المنفصل، وC4 شُحنت وهي منحرفة عن الموصفة. أصلح audit ليطبق البوابات الثلاث من GATES (tests ثم review ثم spec) بنفس صيغة الطباعة في المشروع: id ثم ": ship" أو ": stop (...)" ثم سطرا الخلاصة، ويعيد عدد المشحون.',
        en: 'This auditor approves agent code because the tests are green — the generator grading its own homework! Notice the output: C2 ships with no separate review, and C4 ships while drifted off the spec. Fix audit to enforce all three gates from GATES (tests, then review, then spec) using the project print format: id then ": ship" or ": stop (...)", then the two summary lines, returning the shipped count.',
      },
      solution: `# FIXED: three gates - tests, a SEPARATE review, and spec alignment.
LEDGER = [
    ("C1", "fix", True, True, True),
    ("C2", "feature", True, False, True),
    ("C3", "fix", False, True, True),
    ("C4", "feature", True, True, False),
    ("C5", "fix", True, True, True),
]
GATES = [("tests", 2), ("review", 3), ("spec", 4)]

def audit(rows):
    shipped = 0
    stopped = []
    for row in rows:
        failed = [name for name, i in GATES if not row[i]]
        if failed:
            stopped.append(row[0])
            print(row[0] + ": stop (" + ", ".join(failed) + ")")
        else:
            shipped += 1
            print(row[0] + ": ship")
    print("shipped: " + str(shipped) + "/" + str(len(rows)))
    print("stopped: " + ", ".join(stopped))
    return shipped

total = audit(LEDGER)
`,
      tests: [
        {
          id: 'c2-blocked',
          name: { ar: 'C2 لم تعد تُشحن بلا مراجعة منفصلة', en: 'C2 no longer ships without a separate review' },
          code: "assert 'C2: stop (review)' in __learner_output__, 'expected: C2: stop (review) | actual: %r' % __learner_output__",
        },
        {
          id: 'c4-blocked',
          name: { ar: 'C4 لم تعد تُشحن وهي منحرفة عن الموصفة', en: 'C4 no longer ships while off-spec' },
          code: "assert 'C4: stop (spec)' in __learner_output__, 'expected: C4: stop (spec) | actual: %r' % __learner_output__",
        },
        {
          id: 'shipped-two',
          name: { ar: 'الحصيلة الصحيحة 2/5', en: 'the correct tally is 2/5' },
          code: "assert 'shipped: 2/5' in __learner_output__, 'expected: shipped: 2/5 | actual: %r' % __learner_output__",
        },
      ],
      hints: [
        { ar: 'العَرَض هو الحلقة المُيمِّقة: فحص بوابة واحدة (الاختبارات) وحكم الذات. البوابتان الأخريان موجودتان في كل صف لكنهما لم تُقرأتما.', en: 'The symptom is the nodding loop: one gate checked (tests) and self-judgment. The other two gates sit in every row but were never read.' },
        { ar: 'عرف GATES كما في المشروع: [("tests", 2), ("review", 3), ("spec", 4)] واحسب failed لكل صف.', en: 'Define GATES as in the project: [("tests", 2), ("review", 3), ("spec", 4)] and compute failed per row.' },
        { ar: 'الفرعان بنفس صيغة المشروع: failed فارغة تُشحن، وإلا تُوقف مع أسماء البوابات الفاشلة بفواصل.', en: 'The two branches match the project format: empty failed ships; otherwise stop with the failed gate names joined by commas.' },
        { ar: 'الحصيلة الصحيحة: C2 متوقفة على review وC4 على spec، فتصير shipped: 2/5.', en: 'The correct tally: C2 stopped on review and C4 on spec, giving shipped: 2/5.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل 10: وكيل ولّد لك 40 اختبارًا بتغطية 98%. ما القاعدة التي تحكم ثقتك بها؟',
            en: 'Back to Chapter 10: an agent generated 40 tests with 98% coverage. Which rule governs your trust in them?',
          },
          options: [
            { id: 'a', text: { ar: 'التغطية العالية كافية للاعتماد عليها', en: 'high coverage is enough to rely on them' } },
            { id: 'b', text: { ar: 'لا تثق باختبار لم تره يفشل: أعد إدخال العيب الذي يدّعي كشفه وراقب فشله للسبب المتوقع', en: 'never trust a test you have never seen fail: re-introduce the defect it claims to detect and watch it fail for the expected reason' } },
            { id: 'c', text: { ar: 'ثق بها لأن الوكيل كتبها بنيّة حسنة', en: 'trust them because the agent wrote them in good faith' } },
            { id: 'd', text: { ar: 'احذفها واكتبها يدويًا كلها', en: 'delete them and rewrite all of them by hand' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التغطية تقيس التنفيذ لا الصواب: اختبار مولَّد قد يختبر فهم النموذج نفسه للسلوك، فيتطابق مع خطئها فيصير الخضراء اتفاق سوء فهم. أدخل العيب، شاهد الفشل، وعندها فقط يصير نجاحه دليلًا.',
            en: 'Coverage measures execution, not correctness: a generated test may encode the model own reading of the behavior and agree with its mistake — green tests agreeing on a misunderstanding. Re-introduce the defect, watch the failure, and only then does passing count as evidence.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'عودة إلى الفصل 14: تريد حلقة وكلاء تدور كل ليلة على أخطاء CI. أي مبدأ من فصل النشر المستمر تنفّذ بذلك؟',
            en: 'Back to Chapter 14: you want a loop running nightly over failing CI issues. Which continuous-delivery idea are you applying?',
          },
          options: [
            { id: 'a', text: { ar: 'النشر الأزرق-الأخضر', en: 'blue-green deployment' } },
            { id: 'b', text: { ar: 'المشغّلات الآلية: خط الأنابيب يجري من جديد عند حدث دون تدخل بشري', en: 'automated triggers: the pipeline reruns on an event without a human hand' } },
            { id: 'c', text: { ar: 'أعلام الميزات', en: 'feature flags' } },
            { id: 'd', text: { ar: 'التراجع اليدوي إلى الإصدار السابق', en: 'manual rollback to the previous release' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حركة الجدولة في الحلقة هي نفسها مشغلات خط أنابيب الفصل 14: مؤقّت أو حدث يجري العمل بلا من يذكّر. بلاها تبقى حلقة يدوية سيبدلها النسيان، وبها تصير الحلقة بنية تحتية تعيش بنفسها.',
            en: 'The loop scheduling move is the Chapter 14 pipeline trigger idea: a timer or event reruns the work with nobody remembering to start it. Without it you own a manual loop that forgetting will kill; with it the loop becomes infrastructure that lives on its own.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'من الكلف الأربعة الصامتة في الحلقات: ما الدفاع الأول ضد انفجار التوكنز؟',
            en: 'Of the four silent loop costs: what is the first defense against token blowout?',
          },
          options: [
            { id: 'a', text: { ar: 'نموذج أكبر يحل المشكلة أعمق', en: 'a bigger model that solves problems more deeply' } },
            { id: 'b', text: { ar: 'سقوف ميزانية صارمة تُضبط قبل بدء التشغيل غير المراقَب', en: 'hard budget caps set before unattended execution begins' } },
            { id: 'c', text: { ar: 'زيادة التوازي لتنهي العمل أسرع', en: 'more parallelism so the work ends faster' } },
            { id: 'd', text: { ar: 'حذف سجلات الجلسات القديمة', en: 'deleting old session logs' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'علة صامتة قد تدور الليل كله على خلل بلا نتيجة، تحرق الميزانية في جولات لا تنتج شيئًا. السقف الصارم يوقفها؛ ويزيد التوازي الكلفة ولا يعالج السبب.',
            en: 'An idle bug can spin all night producing nothing while burning budget. A hard cap stops it; more parallelism multiplies the cost and treats nothing.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'عودة إلى مشروع الفريق (الملحق أ): ماذا يعني توثيق المصدر والتحقق (provenance) في عصر الوكلاء؟',
            en: 'Back to the team project (Appendix A): what does provenance mean in the age of agents?',
          },
          options: [
            { id: 'a', text: { ar: 'تسجيل أين استُخدم الذكاء الاصطناعي وكيف تحققتَ من مخرجاته — جزء من الشفافية والتقرير النهائي', en: 'recording where AI was used and how you verified its output — part of honest engineering and the final report' } },
            { id: 'b', text: { ar: 'اسم الفرع الذي عمل عليه الوكيل', en: 'the name of the branch the agent worked on' } },
            { id: 'c', text: { ar: 'رخصة المستودع مفتوحة المصدر', en: 'the repository open-source license' } },
            { id: 'd', text: { ar: 'حجم التوكنز المستهلكة في المشروع', en: 'the tokens consumed by the project' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'عامل الوكلاء كزملاء سريعين متحمسين يبالغون في ثقتهم: اطلب منهم الدليل نفسه الذي تطلبه من إنسان — اختبارات خضراء، مراجعة ناجحة، مؤشر تحرك — وسجّل أين استعملتهم وكيف تحققت؛ فالشفافية عن مصدر كل تغيير جزء من التقرير النهائي الصادق.',
            en: 'Treat agents as fast, tireless, over-confident junior teammates: demand the same evidence you would from a human — a green suite, a passing review, a metric that moved — and record where you used them and how you verified. That transparency is part of the honest final report.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'ستة مبادئ: امتلك النية والتحقق، أبقِ الأساسيات، انقل الجهد أعلى السلسلة، أدِر المخاطر الجديدة، قِس النواتج لا النشاط، أتمت الحلقة لا الحكم.', en: 'Six principles: own intent and verification, keep the fundamentals, shift effort up the stack, manage the new risks, measure outcomes not activity, automate the loop not the judgment.' },
        { ar: 'الضغوط الأربع لا تُلغى بل ينتقل ثقلها: الإنتاج رخيص فالقرار والإثبات هما التمايز — أساسيات الكتاب ترقّت إلى طبقة التحقق.', en: 'The four pressures are relocated, not repealed: producing is cheap so deciding and proving differentiate — the book fundamentals were promoted into the verification layer.' },
        { ar: 'بوابات الخطر توقف الخط: اختبارات لم يقيّمها الوكيل وحده، ومراجع منفصل، ومواءمة مع الموصفة — من يفشل بأي بوابة لا يُشحن.', en: 'Risk gates stop the line: tests the agent did not grade alone, a separate review, and spec alignment — whatever fails a gate does not ship.' },
        { ar: 'عمل الإنسان في العصر الوكيلي واحد: امتلك النية، أبقِ الفحص، وابقَ قادرًا على قول لا — هذا المزيد من أصعب أجزاء الهندسة.', en: 'The human job in the agentic era is one: own the intent, keep the check, and stay able to say no — that is more of engineering hardest, most human parts.' },
      ],
      reflectPrompt: {
        ar: 'صمّم أول حلقة لك: ما الذي تكتشفه؟ من يتحقق؟ أين تُحفظ النتائج؟ وما الذي يوقفها؟ ثم: أين نقطة الإنسان التي تقول فيها لا؟',
        en: 'Design your first loop: what does it discover? who verifies? where do results persist? what reruns it? Then: where is the human point where you can still say no?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch13.s8', pages: 'ص363 / pp.363' },
        { book: 'SWE', section: 'swe.ch13.s9', pages: 'ص364 / pp.364' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch13.s8', pages: 'ص363 / pp.363' },
    { book: 'SWE', section: 'swe.ch13.s9', pages: 'ص364 / pp.364' },
  ],
} satisfies Lesson;

export default lesson;
