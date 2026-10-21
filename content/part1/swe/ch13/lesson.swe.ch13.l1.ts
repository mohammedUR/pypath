/**
 * swe.ch13.l1 — عندما يكتب الذكاء الاصطناعي الشيفرة: ما يتغيّر وما لا يتغيّر /
 * When AI Writes the Code: What Changes and What Does Not
 * SWE ch13 — s1 What AI Changes and What It Doesn't (ص343 / pp.343) + s2 AI Across
 * the Lifecycle (ص346 / pp.346) + s3 The Evidence: Productivity, Quality, Security
 * (ص351 / pp.351).
 * Runnable design: a deterministic TASK LEDGER splits five real tasks into manual
 * minutes vs agent-assisted minutes (draft + human verify), exposing the share of
 * agent-era time that is human-gated verification; an evidence ledger turns the
 * 2025 perception-gap study into arithmetic.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch13.l1',
  version: 1,
  part: 'II',
  track: 'A9',
  book: 'SWE',
  chapter: 13,
  title: {
    ar: 'عندما يكتب الذكاء الاصطناعي الشيفرة: ما يتغيّر وما لا يتغيّر',
    en: 'When AI Writes the Code: What Changes and What Does Not',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.appa.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في دقيقتين أنتج الوكيل مسودة كاملة للميزة: أربعمئة سطر واثنا عشر اختبارًا، كلها خضراء. المشكلة أن أحدًا لم يتحقق بعد أنها الميزة التي طلبها العميل، وأن اختباراتها تختبر ما تفعله الشيفرة لا ما ينبغي أن تفعله. هذا الدرس يفتح الفصل الأخير: الوكيل يكتب بسرعة مذهلة، وأنت تبقى المهندس لأن قرار ما نبنيه وإثبات أنه يعمل لم يؤتمتا بعد.',
        en: 'In two minutes the agent produced a full draft of the feature: four hundred lines and twelve tests, all green. The problem: nobody has yet verified it is the feature the customer asked for, and its tests assert what the code does, not what it should do. This lesson opens the final chapter: the agent types at astonishing speed, and you remain the engineer, because deciding what to build and proving it works have not been automated yet.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'عنق الزجاجة ينتقل: الجوهري يبقى بيدك',
        en: 'The bottleneck moves: the essence stays in your hands',
      },
      chunks: [
        {
          ar: 'الادعاء الصاخب اليوم أن الذكاء الاصطناعي يكتب الشيفرة. الوصف الأدق أنه ينقل عنق الزجاجة الهندسي: منذ عقود كان الاختناق في إنتاج شيفرة صحيحة بسرعة كافية، وحين تصبح الإنتاج رخيصًا ينتقل الاختناق إلى قرار ما نبنيه وإثبات أنه يعمل. تذكر تقسيم الفصل الأول: التعقيد الجوهري متأصل في المشكلة، والعرضي يأتي من أدواتنا وشقاوتنا. الذكاء الاصطناعي التوليدي سلاح مبهر ضد العرضي: الشيفرة النمطية، ولصق الأنظمة، وتحويلات الصيغ، ومسودات الاختبارات الأولى، وحرج كيف أستدعي هذه الواجهة. وهو أضعف بكثير أمام الجوهري: تحديد ما ينبغي للنظام أن يفعله فعلًا، وحسم تعارض الأهداف، واختيار معمارية تجعل التغييرات المتوقعة رخيصة. القاعدة الأهم في هذا الفصل: فوّض الأدوات وامتلك الجوهر.',
          en: 'The loud claim of the moment is that AI writes the code. A more useful description: it moves the engineering bottleneck. For decades the bottleneck was producing correct code fast enough; once producing becomes cheap, the bottleneck moves to deciding what to build and proving it works. Recall Chapter 1: essential complexity is inherent in the problem, accidental complexity comes from our tools and toil. Generative AI is a spectacular weapon against the accidental: boilerplate, glue code, format conversions, first drafts of tests, the friction of how do I call this API. It is far weaker against the essential: deciding what the system should actually do, resolving conflicting goals, choosing an architecture whose likely changes stay cheap. The single most important rule of this chapter: delegate the toil; own the essence.',
        },
        {
          ar: 'الضغوط الأربع لا تزول، بل تنتقل مواضعها. البرمجيات معقّدة: الوكلاء يولّدون تعقيدًا أسرع من أي وقت، ومنه تعقيد عرضي لم تطلبه، فتصبح المعمارية أهم. المتطلبات تتغيّر: استجابة التغيير أصبحت أرخص، فترتفع قيمة معرفة أي تغيير يستحق أن يُصنع. العيوب حتمية: الآلة تنتج عيوبًا تبدو مقنعة بالجملة، فيصبح التدقيق الساكن والمراجعة والاختبارات جدران الحمل. والفريق يحتاج تنسيقًا: الفريق الآن يضم أعضاء غير بشرية، وتنسيق سرب من الوكلاء مشكلة تنظيمية جديدة. أضف سلّم المساعدة: من الإكمال التلقائي، إلى مسودة وإصلاح، إلى وكيل مهمة، إلى سرب وكلاء. كلما صعدت درجة، انتقل عملك من الكتابة إلى التحديد والإشراف والتحقق — وارتفعت كلفة الناتج الواثق والخاطئ، لأن المزيد يحدث بين أمرك ومراجعتك.',
          en: 'The four cross-cutting pressures do not go away; they shift. Software is complex: agents generate complexity faster than ever, including accidental complexity you never asked for, so architecture matters more. Requirements change: responding got cheaper, so the premium on knowing which change is worth making rises. Defects are inevitable: machines emit plausible-looking defects at scale, so static checking, review, and tests become the load-bearing walls. And teams need coordination: teams now include non-human members, and coordinating a swarm of agents is a new organizational problem. Add the ladder of assistance: from autocomplete, to draft-and-fix, to a task agent, to a multi-agent swarm. Each rung moves your job from typing toward specifying, supervising, and verifying — and raises the cost of a confident-but-wrong output, because more happens between your instruction and your review.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'جولة في دورة الحياة، ثم الأدلة الصادقة',
        en: 'A lifecycle tour, then the honest evidence',
      },
      chunks: [
        {
          ar: 'امشِ الدورة مرحلة مرحلة. المتطلبات: نماذج اللغة تحوّل مذكرات المقابلات والتذاكر إلى مسودات قصص مستخدم ومعايير قبول وقوائم حالات حدّية بسرعة حقيقية، لكنها تختلق متطلبات تبدو معقولة وهي خاطئة، وطلاقتها قد تصنع إجماعًا زائفًا؛ البقاء مع أصحاب المصلحة وحسم التعارضات عملك أنت. التصميم والمعمارية: تقترح بنى صفوف وسجلات قرارات وتقارن بدائل، لكن القرارات الكبيرة الغالية على التغيير تبقى قرارك — لا أحد غيرك يدفع كلفة خمس سنوات من الترابط العالي. المراجعة: أُعلن أواخر 2024 أن أكثر من ربع الشيفرة الجديدة في غوغل مولَّد آليًا، فانقلبت مشكلة الفصل التاسع: المورد النادر صار ثقة وانتباه المراجع البشري. الاختبار: تقدم مذهل في توليد الاختبارات وإصلاح العيوب على مقاييس مثل SWE-bench، لكن مشكلة الميزان باقية كما هي: اختبار مولَّد يختبر فهم النموذج للسلوك الصحيح، وقد يعكس سوء الفهم نفسه المدفون في الشيفرة المولَّدة. قاعدة الفصل العاشر صارت أهم: لا تثق باختبار لم تره يفشل.',
          en: 'Walk the lifecycle stage by stage. Requirements: language models turn interview notes and tickets into drafts of user stories, acceptance criteria, and edge-case lists remarkably fast — but they invent plausible requirements that are wrong, and their fluency can manufacture false consensus; talking to stakeholders and resolving conflicts stays yours. Design: models propose class structures, draft ADRs, and compare alternatives, but the significant, expensive-to-change decisions remain yours — nobody else pays the five-year cost of high coupling. Review: by late 2024 a quarter of new code at Google was machine-generated, inverting Chapter 9: the scarce resource is now reviewer trust and attention. Testing: striking progress on benchmarks like SWE-bench, yet the oracle problem survives: a generated test encodes what the model believes correct, possibly mirroring the misunderstanding in the generated code. The Chapter 10 rule matters more: never trust a test you have never seen fail.',
        },
        {
          ar: 'الأمن يتغير من الجهتين: الآلة تكتب الثغرات بطلاقة الميزات، وأدوات آلية تبحث عنها. دراسات وجدت نحو 40% من البرامج المولَّدة تحوي ثغرات، ومستخدمي المساعد يكتبون شيفرة أقل أمنًا بينما يشعرون بأمان أكبر — إحساس كاذب يجعل التحليل الساكن والمراجعة فراملَ تُمكّن السرعة الآمنة. المقاييس: عدد الأسطر والالتزامات مؤشران ضعيفان منذ دائم، وصارا مضللين حين تصدر الآلة آلاف الأسطر؛ تحليل صناعي وجد ارتفاع تضاعف الشيفرة المنسوخة وتراجع إعادة الهيكلة مع انتشار المساعدة — دَين صيانة يخفيه حجم المخرجات. الأدلة: تجربة مورّد 2022 أظهرت إنجازًا أسرع بنحو 55% في مهمة محددة جيدًا؛ وتجربة عشوائية 2025 على متمرسين في مستودعات مألوفة عالية المعايير: تباطؤ نحو 19% مع الوكيل — وبعدها ظلوا يعتقدون أنهم أسرع! الإدراك ليس قياسًا. التحقق هو عنق الزجاجة الجديد، وأساسيات الكتاب طبقة التحقق التي تحوّل التوليد السريع إلى برمجية موثوقة.',
          en: 'Security changes on both sides: AI writes vulnerabilities as fluently as features, and AI tools now hunt for them. Studies found about 40% of generated programs vulnerable; assistant users wrote less secure code while feeling more secure: a false sense of safety that makes static analysis and review the brakes enabling safe speed. Metrics: lines of code and commit counts were weak proxies and become misleading when a machine emits thousands of lines; an industry analysis found duplicated code rising and refactoring falling as assistance spread, maintainability debt that raw volume hides. The evidence: a 2022 vendor experiment showed 55% faster completion on one well-specified task; a 2025 randomized trial on experienced developers in familiar, high-standards repositories found them 19% slower, and they believed they were faster. Perceived is not measured. Verification is the new bottleneck; the fundamentals are the verification layer turning fast generation into trustworthy software.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'دفتر المهام: أين يذهب الوقت مع وكيل؟',
        en: 'The task ledger: where does the time go with an agent?',
      },
      code: `# TASK LEDGER: five real tasks - typed minutes vs agent-assisted minutes.
# (task, manual_min, agent_draft_min, human_verify_min)
TASKS = [
    ("boilerplate CRUD endpoint", 60, 5, 10),
    ("glue: CSV to JSON converter", 45, 3, 8),
    ("first-draft unit tests", 50, 5, 15),
    ("decide payment feature scope", 90, 0, 90),
    ("pick architecture for likely change", 120, 0, 120),
]

manual_total = 0
ai_total = 0
verify_total = 0
for task, manual, draft, verify in TASKS:
    manual_total += manual
    ai_total += draft + verify
    verify_total += verify
    print(task + ": manual=" + str(manual) + " with-ai=" + str(draft + verify))

print("manual total: " + str(manual_total) + "min")
print("with-ai total: " + str(ai_total) + "min")
print("human share of with-ai time: " + str(verify_total * 100 // ai_total) + "%")
print("the bottleneck moved: typing -> verifying")
`,
      explanation: {
        ar: 'المهام العرضية الثلاث انهارت من 155 دقيقة كتابة إلى 46 دقيقة (مسودة قصيرة + زمن تحقق بشري). أما مهمتا الجوهر فبقيتا كما هما: قرار نطاق ميزة الدفع واختيار المعمارية لا يُفوَّضان — الوكيل قد يساعد في الصياغة، لكن الزمن الفعلي هو زمن تفكيرك. الحصيلة: 365 دقيقة يدويًا مقابل 256 مع الوكيل، ومن زمن الوكيل 94% إنسان: تحقق وقرار. هذا هو معنى عبارة "التحقق هو عنق الزجاجة الجديد" بالأرقام.',
        en: 'The three accidental tasks collapsed from 155 typed minutes to 46 (a short draft plus human verification time). The two essential tasks stayed exactly as they were: deciding the scope of a payment feature and picking the architecture cannot be delegated — the real time is your thinking time. Totals: 365 manual minutes versus 256 with the agent, and 94% of the with-ai time is human: verify and decide. That is "verification is the new bottleneck" in numbers.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.evidence-ledger',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل دفتر الأدلة لدراسة 2025 الشهيرة: دالة perception_gap تستقبل قاموس الدراسة وتعيد مجموع التسارع المتوقع والتباطؤ المقاس — أي الفجوة بين ما ظنه المطورون وما قاسه الباحثون. اطبع الأسطر الثلاثة كما هي في الحل.',
        en: 'Complete the evidence ledger for the famous 2025 study: perception_gap takes the study dictionary and returns the predicted speedup plus the measured slowdown — the gap between what developers believed and what researchers measured. Print the three lines exactly as in the solution.',
      },
      starterCode: `STUDY = {"predicted_speedup_pct": 24, "measured_slowdown_pct": 19}

def perception_gap(study):
    return 0  # TODO: predicted speedup + measured slowdown

gap = perception_gap(STUDY)
print("predicted: " + str(STUDY["predicted_speedup_pct"]) + "% faster")
print("measured: " + str(STUDY["measured_slowdown_pct"]) + "% slower")
print("perception gap: " + str(gap) + " points")
`,
      solution: `STUDY = {"predicted_speedup_pct": 24, "measured_slowdown_pct": 19}

def perception_gap(study):
    return study["predicted_speedup_pct"] + study["measured_slowdown_pct"]

gap = perception_gap(STUDY)
print("predicted: " + str(STUDY["predicted_speedup_pct"]) + "% faster")
print("measured: " + str(STUDY["measured_slowdown_pct"]) + "% slower")
print("perception gap: " + str(gap) + " points")
`,
      tests: [
        {
          id: 'gap-value',
          name: { ar: 'الفجوة 43 نقطة', en: 'the gap is 43 points' },
          code: "assert perception_gap(STUDY) == 43, 'expected 43 | actual: %r' % perception_gap(STUDY)",
        },
        {
          id: 'gap-print',
          name: { ar: 'سطر الخلاصة مطبوع', en: 'the verdict line is printed' },
          code: "assert 'perception gap: 43 points' in __learner_output__, 'expected: perception gap: 43 points | actual: %r' % __learner_output__",
        },
      ],
      hints: [
        { ar: 'الفجوة ليست فرقًا بل مجموع: توقعوا 24% أسرع وقاسوا 19% أبطأ، والاتجاهان متعاكسان فتتجمع النقطتان.', en: 'The gap is not a difference but a sum: they predicted 24% faster and measured 19% slower — opposite directions, so the points add.' },
        { ar: 'اقرأ الحقلين من القاموس بالمفتاحين predicted_speedup_pct و measured_slowdown_pct ثم اجمعهما.', en: 'Read both fields from the dictionary with the keys predicted_speedup_pct and measured_slowdown_pct, then add them.' },
        { ar: 'جسم الدالة سطر واحد: return study["predicted_speedup_pct"] + study["measured_slowdown_pct"].', en: 'The body is one line: return study["predicted_speedup_pct"] + study["measured_slowdown_pct"].' },
        { ar: 'المطبوع جاهز في الهيكل؛ كل ما عليك هو إصلاح return داخل perception_gap ليصبح gap يساوي 43.', en: 'The prints are already in the skeleton; you only fix the return inside perception_gap so gap becomes 43.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.delegate-or-decide',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بمقياس الجوهري مقابل العرضي: أي مهمة من هذه تفوّضها للوكيل بأقل حاجة للمراجعة؟',
        en: 'By the essential-versus-accidental test: which of these tasks do you delegate to the agent with the least review burden?',
      },
      options: [
        { id: 'a', text: { ar: 'حسم الأهداف المتعارضة بين مجموعتي أصحاب مصلحة', en: 'resolving conflicting goals between two stakeholder groups' } },
        { id: 'b', text: { ar: 'اختيار معمارية تجعل التغييرات المتوقعة رخيصة', en: 'choosing an architecture that keeps likely changes cheap' } },
        { id: 'c', text: { ar: 'تحويل أربعين ملف سجل من CSV إلى JSON', en: 'converting forty log files from CSV to JSON' } },
        { id: 'd', text: { ar: 'التحقق من أن المتطلب يعبّر عن حاجة حقيقية', en: 'validating that a requirement reflects a real user need' } },
      ],
      answer: 'c',
      solution: 'c',
      hints: [
        { ar: 'اسأل: هل المهمة تحمل قرارًا عن القيمة أو البنية أو الحقيقة؟ إن كان الجواب لا فهي عرضية.', en: 'Ask: does the task carry a decision about value, structure, or truth? If no, it is accidental.' },
        { ar: 'الخيارات a وb وd كلها قرارات جوهرية: أهداف، معمارية، وصحة حاجة المستخدم.', en: 'Options a, b, and d are all essential decisions: goals, architecture, and whether a need is real.' },
        { ar: 'تحويل الصيغ عمل نمطي متكرر لا يحمل حكمًا — ومخرجاته سهلة التحقق آليًا.', en: 'Format conversion is repetitive boilerplate carrying no judgment — and its output is easy to verify mechanically.' },
        { ar: 'الجواب c: التحويل العرضي يُفوَّض؛ والبقية تبقى بيدك ولو ساعدك الوكيل في الصياغة.', en: 'Answer c: delegate the accidental conversion; the rest stay yours even if the agent helps draft.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.ladder-trace',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ حلقة سلّم المساعدة واكتب المخرجات المطبوعة سطرًا سطرًا.',
        en: 'Read the ladder-of-assistance loop and write the printed output line by line.',
      },
      code: `RUNGS = ["autocomplete", "draft-and-fix", "task agent", "multi-agent swarm"]
for i, rung in enumerate(RUNGS, 1):
    print(str(i) + " " + rung)
print("higher rung = more happens before your review")
`,
      answer: '1 autocomplete\n2 draft-and-fix\n3 task agent\n4 multi-agent swarm\nhigher rung = more happens before your review',
      solution: '1 autocomplete\n2 draft-and-fix\n3 task agent\n4 multi-agent swarm\nhigher rung = more happens before your review',
      hints: [
        { ar: 'enumerate يبدأ من 1 لأنك مررت 1 كوسيط ثانٍ، فيصبح الترقيم 1 ثم 2 ثم 3 ثم 4.', en: 'enumerate starts at 1 because you passed 1 as the second argument, so the numbering runs 1 to 4.' },
        { ar: 'كل سطر من الأسطر الأربعة هو رقم ثم مسافة ثم اسم الدرجة نفسها كما كُتبت في القائمة.', en: 'Each of the four lines is the number, a space, then the rung name exactly as written in the list.' },
        { ar: 'السطر الأخير سلسلة ثابتة تُطبع مرة واحدة بعد انتهاء الحلقة.', en: 'The last line is a fixed string printed once after the loop ends.' },
        { ar: 'خمسة أسطر إجمالًا: الدرجات الأربع مرقمة ثم جملة الخلاصة.', en: 'Five lines in total: the four numbered rungs then the closing sentence.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل الأول: أي نوع تعقيد يأتي من أدواتنا وأعمالنا الروتينية — وهو ما يُهاجمه الذكاء الاصطناعي بأفضل صورة؟',
            en: 'Back to Chapter 1: which kind of complexity comes from our tools and toil — the kind AI attacks best?',
          },
          options: [
            { id: 'a', text: { ar: 'التعقيد الجوهري', en: 'essential complexity' } },
            { id: 'b', text: { ar: 'التعقيد العرضي', en: 'accidental complexity' } },
            { id: 'c', text: { ar: 'تعقيد المعمارية', en: 'architectural complexity' } },
            { id: 'd', text: { ar: 'تعقيد التنسيق', en: 'coordination complexity' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الجوهري متأصل في المشكلة (ماذا نبني، أي معمارية، حسم التعارضات) والعرضي من الأدوات والشقاوة (نمطية، لصق، تحويل صيغ). الوكيل مذهل ضد العرضي وضعيف أمام الجوهري: فوّض الأدوات وامتلك الجوهر.',
            en: 'Essential complexity is inherent in the problem (what to build, which architecture, resolving conflicts); accidental comes from tools and toil (boilerplate, glue, conversions). AI is spectacular against the accidental and weak against the essential: delegate the toil, own the essence.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا وجدت التجربة العشوائية المضبوطة عام 2025 على مطورين متمرسين في مستودعات يعرفونها جيدًا؟',
            en: 'What did the 2025 randomized controlled trial find for experienced developers in repositories they knew well?',
          },
          options: [
            { id: 'a', text: { ar: 'تسارع بنحو 55% كما وعدت إعلانات المورّدين', en: 'about 55% faster, as vendor headlines promised' } },
            { id: 'b', text: { ar: 'لا فرق ذا معنى في الزمن', en: 'no meaningful difference in time' } },
            { id: 'c', text: { ar: 'تباطؤ نحو 19% مع بقائهم يعتقدون أنهم أسرع', en: 'about 19% slower while still believing they were faster' } },
            { id: 'd', text: { ar: 'جودة أعلى مقابل زمن أطول بثقة صحيحة', en: 'higher quality for longer time, with accurate confidence' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'القياس الحقيقي أظهر تباطؤًا نحو 19% سببه رئيسًا كلفة مراجعة ودمج المخرجات المولَّدة، بينما ظل الإدراك موجبًا. الخلاصة المنهجية: الإدراك ليس قياسًا — قِس أثر العمل المسلَّم كما في الفصل 12.',
            en: 'The measured result was about 19% slower, largely from reviewing and integrating generated output, while perception stayed positive. The methodological lesson: perceived is not measured — measure delivered work, as Chapter 12 taught.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في دراسة الأمن المضبوطة (2023): ماذا فعل المساعد الذكي بسلوك المستخدمين وثقتهم؟',
            en: 'In the 2023 controlled security study: what did the AI assistant do to user behavior and confidence?',
          },
          options: [
            { id: 'a', text: { ar: 'رفع الأمن والثقة معًا', en: 'raised security and confidence together' } },
            { id: 'b', text: { ar: 'جعلهم يكتبون شيفرة أقل أمنًا بينما شعروا بأمان أكبر', en: 'made them write less secure code while feeling more secure' } },
            { id: 'c', text: { ar: 'لم يؤثر في السلوك ولا في الثقة', en: 'changed neither behavior nor confidence' } },
            { id: 'd', text: { ar: 'أوقفهم عن كتابة شيفرة التعامل مع المدفوعات', en: 'stopped them from writing payment code entirely' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'أمنع فخ موثّق: شيفرة أضعف مع ثقة أعلى. لذلك تبقى مراجعة الأمن والتحليل الساكن وقرارات التصميم الآمن (الفصل 11) فرامل تحمل السرعة، وتبقى الملكية البشرية لتخويل الاختبار وحسم أن النتيجة حقيقية.',
            en: 'The documented trap: weaker code with higher confidence. That is why security review, static analysis, and secure-by-design decisions (Chapter 11) remain the brakes that make speed usable, and why humans keep authorization and the judgment that a finding is real.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'حين تصبح آلة تولّد الشيفرة، ما الذي يصير الموردَ النادرًا في عملية مراجعة الشيفرة (الفصل 9)؟',
            en: 'When a machine generates much of the code, what becomes the scarce resource in code review (Chapter 9)?',
          },
          options: [
            { id: 'a', text: { ar: 'سرعة كتابة الشيفرة الجديدة', en: 'speed of writing new code' } },
            { id: 'b', text: { ar: 'عدد طلبات الدمج المفتوحة', en: 'the number of open pull requests' } },
            { id: 'c', text: { ar: 'ثقة وانتباه المراجع البشري', en: 'reviewer trust and attention' } },
            { id: 'd', text: { ar: 'حجم المستودع وعدد الفروع', en: 'repository size and branch count' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'انقلبت المشكلة: الشيفرة تُنتج أسرع مما يستطيع البشر تدقيقها، فالمورد النادر هو ثقة المراجع وانتباهه. حافظ على معايير المراجعة من التآكل تحت ضغط الحجم، ودع التحليل الساكن يقوم بالجزء القابل للأتمتة.',
            en: 'The problem inverts: code is produced faster than humans can vet it, so the scarce resource is reviewer trust and attention. Keep review standards from eroding under volume, and let static analysis carry the automatable part.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الذكاء الاصطناعي لا يلغي الهندسة بل ينقل عنق الزجاجة: الإنتاج رخيص، فالقرار والإثبات هما التمايز.', en: 'AI does not repeal engineering; it moves the bottleneck: producing is cheap, so deciding and proving are the differentiator.' },
        { ar: 'سلاح مذهل ضد التعقيد العرضي وضعيف أمام الجوهري: فوّض الأدوات وامتلك الجوهر.', en: 'A spectacular weapon against accidental complexity, weak against the essential: delegate the toil, own the essence.' },
        { ar: 'الضغوط الأربع باقية منتقلة: تعقيد أسرع توليدًا، تغيير أرخص استجابة، عيوب مقنعة بالجملة، وفريق يضم وكلاء.', en: 'The four pressures persist, relocated: faster-generated complexity, cheaper change, plausible defects at scale, and teams that include agents.' },
        { ar: 'الأدلة مختلطة بصدق: 55% أسرع في مهمة محددة، و19% أبطأ على شيفرة مألوفة عالية المعايير — الإدراك ليس قياسًا والتحقق هو الاختناق الجديد.', en: 'The evidence is honestly mixed: 55% faster on one narrow task, 19% slower on familiar high-standards code — perceived is not measured, and verification is the new bottleneck.' },
      ],
      reflectPrompt: {
        ar: 'في مهامك الأخيرة: كم دقيقة قضيت في التوليد وكم في التحقق؟ لو ضاعفت زمن التحقق، أي عيب كنت ستلتقطه قبل النشر؟',
        en: 'In your recent work: how many minutes went to generating versus verifying? If you doubled verification time, which defect would you have caught before release?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch13.s1', pages: 'ص343 / pp.343' },
        { book: 'SWE', section: 'swe.ch13.s2', pages: 'ص346 / pp.346' },
        { book: 'SWE', section: 'swe.ch13.s3', pages: 'ص351 / pp.351' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch13.s1', pages: 'ص343 / pp.343' },
    { book: 'SWE', section: 'swe.ch13.s2', pages: 'ص346 / pp.346' },
    { book: 'SWE', section: 'swe.ch13.s3', pages: 'ص351 / pp.351' },
  ],
} satisfies Lesson;

export default lesson;
