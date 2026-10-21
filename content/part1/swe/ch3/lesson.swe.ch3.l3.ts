// swe.ch3.l3 — القصص والميزات وسيناريوهات التجربة / Stories, Features, and Experience Scenarios
// Sections: swe.ch3.s4 (ص72-77 / pp.72-77) · swe.ch3.s5 (ص77-79 / pp.77-79)
// Book: SWE — Chapter 3 "User Requirements" (part I, track P3).
// Runnable design: a story-format checker — parse fixed story strings, validate the
// three Connextra parts (role / capability / goal), and print per-story verdicts as
// short ASCII lines like "story1: OK" or "story2: missing goal".
// Deterministic only: no input(), no exit(), no random, no unittest.main.

import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch3.l3',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 3,
  title: {
    ar: 'القصص والميزات وسيناريوهات التجربة',
    en: 'Stories, Features, and Experience Scenarios',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch3.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'بطاقة على السبورة: «بصفتي موظف استقبال، أريد البحث». بُنيت كما هي حرفيًا — وشُحنت. وفي مراجعة ما بعد الإطلاق سأل أحد المطوّرين السؤال الذي لم تجب عنه البطاقة قط: «خيرٌ… من أي نوع؟ بأي سرعة؟ ولكي أعمل ماذا؟» البطاقة كانت وعدًا بمحادثة، ولم تجرَ المحادثة قط. في اليوم نفسه، جلس الفريق يكتب سيناريو دوروثي — موظفة خبيرة في زحمة صباحية وطابور خمسة مرضى — فخرج منه في عشرين دقيقة تسع قصص قابلة للبناء وقدرتتان مفقودتان لم تدخلا قائمة الأعمال قط. هذا الدرس عن الفرق بين سطرٍ يَعِد وسردٍ يُجبر الغموض على الخروج إلى النور.',
        en: 'A card on the wall: "As a clerk, I want search." It was built exactly as written — and shipped. In the post-launch review a developer asked the question the card never answered: "Search... what kind? How fast? So that I can do what?" The card was a promise of a conversation, and the conversation never happened. That same day, the team wrote the scenario of Dorothy — an experienced clerk in a morning rush with five patients in line — and in twenty minutes it yielded nine buildable stories and two missing capabilities nobody had ever put in the backlog. This lesson is about the difference between a line that promises and a narrative that forces vagueness into the open.',
      },
    },
    {
      kind: 'predict',
      code: `story = "As a clerk, I want to flag patients, so that I can flag patients."
fits = story.startswith("As a ") and ", I want " in story and ", so that " in story
print("fits template:", fits)
print("benefit:", "I can flag patients")`,
      question: {
        ar: 'القصة تطابق القالب حرفيًا — فأين تكمن المشكلة؟',
        en: 'The story matches the template literally — so where is the problem?',
      },
      reveal: {
        ar: 'في جزاء so that: الهدف يعيد صياغة القدرة نفسها — دائري بلا معنى («أوسم المرضى حتى أستطيع وسم المرضى»). حين يكون الـ benefit غامضًا أو دائريًا فهو إنذار أن أحدًا لا يفهم لماذا الميزة موجودة، وميزة لا يستطيع أحد تبريرها ميزة تُحذف. الفاحص الذي ستبنيه في هذا الدرس يتحقق من الأجزاء الثلاثة؛ وعينك المراجعة تتحقق من شيء أعمق: هل الهدف حقيقي؟',
        en: 'In the so that clause: the benefit restates the capability itself — circular and meaningless ("I flag patients so that I can flag patients"). A vague or circular benefit is a warning that nobody understands why the feature exists, and a feature nobody can justify is a feature to cut. The checker you build in this lesson validates the three parts; your reviewer\u2019s eye validates something deeper: is the goal real?',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'قصة المستخدم: قالب بثلاث وظائف',
        en: 'The User Story: One Template, Three Jobs',
      },
      chunks: [
        {
          ar: 'بعد الاستنباط تحتاج صيغة يستطيع الفريق كله العمل بها. القالب الأشهر هو قالب Connextra: As a <role>, I want <capability>, so that <benefit> — ولكل جزء وظيفة. الـ role يُبقيك أمينًا حول من المستفيد، ويكشف القصص التي لا تخدم مستخدمًا حقيقيًا. الـ capability تصف السلوك. أما so that فهي الأهم والأكثر حذفًا: تلتقط الـ why — الهدف الذي يجب أن تبلغه خلف الحل. حين يكون الـ benefit غامضًا أو دائريًا («…بحيث أستطيع وسم المرضى») فهو إنذار أن أحدًا لا يفهم لماذا الميزة موجودة — وميزة لا يستطيع أحد تبريرها ميزة تُحذف. والقصة متعمّدة القِصر: وعدٌ بمحادثة لا مواصفة مكتملة، تُفصَّل في اللحظة التي يعرف فيها الفريق أكثر ما سيعرف.',
          en: 'After elicitation you need a form the whole team can act on. The most widely used is the Connextra template: As a <role>, I want <capability>, so that <benefit>. Each clause has a job. The role keeps you honest about who benefits and exposes stories that serve no real user. The capability states the behavior. The so that clause is the most important and the most often omitted: it captures the why — the goal you must reach past the solution to find. When a story\u2019s benefit is vague or circular ("...so that I can flag patients"), it warns that nobody understands why the feature exists — and a feature nobody can justify is a feature to cut. A story is deliberately short: a promise of a conversation, not a specification.',
        },
        {
          ar: 'لتحكم هل القصة جاهزة للبناء استخدم قائمة INVEST: Independent (تُبنى وتُشحن دون انتظار قصص أخرى)، Negotiable (نقطة بدء محادثة لا عقد ملزم)، Valuable (قيمة يدركها المستخدم — «أعد هيكلة طبقة قاعدة البيانات» عمل حقيقي لكنه ليس قصة مستخدم)، Estimable (يمكن تقديرها تقريبًا وإلا احتاجت تقسيمًا أو spike بحثًا)، Small (تتسع لتكرار واحد؛ الملحمة epic تُقسَّم)، Testable (تحدد مسبقًا كيف ستعرف أنها تعمل). إن فشلت القصة في INVEST فأصلح القصة ولا تدفعها إلى السبرنت — فهي أداة تشخيص لا بوابة بيروقراطية. وأرفق بكل قصة معايير قبول بصيغة Given / When / Then: سياق البداية، ثم الفعل، ثم النتيجة المرئية. في BDD تُكتب هذه السيناريوهات بلغة Gherkin في ملفات .feature وتنفَّذ الكلمات نفسها كاختبارات آلية عبر أطر مثل Cucumber — مواصفة قابلة للتنفيذ تُكتب مع العميل.',
          en: 'To judge whether a story is ready, teams use INVEST: Independent (buildable without other stories first), Negotiable (a conversation starter, not a contract), Valuable (perceivable user value — "refactor the database layer" is real work but not a user story), Estimable (roughly sizeable, or split it or run a spike), Small (fits one iteration; epics get split), Testable (you can state in advance how you will know it works). If a story fails INVEST, fix the story — do not force it into the sprint; INVEST is a diagnostic, not a bureaucratic gate. Attach acceptance criteria as Given / When / Then scenarios: the starting context, the action, the observable outcome. In BDD these Gherkin scenarios live in .feature files, and the same words run as automated tests through frameworks like Cucumber — an executable specification written with the customer.',
        },
        {
          ar: 'فوق القصص تقف الميزات (features): قدرات أكبر متماسكة يعرفها صاحب المصلحة ويقدّرها كوحدة — «تذكيرات المواعيد»، «التحقق من التأمين». الميزة الجيدة: ذات معنى للمستخدم («طبقة تخزين مؤقت» ليست ميزة؛ «بحث فوري» قد تكون)، قيّمة مستقلة حتى بشحن جزئي، قابلة للتفكيك إلى قصص INVEST، ومتتبعة إلى هدف لصاحب مصلحة. وتشكل الميزات والقصص هرمًا من مستويين: الميزات تجيب «ما قدرات المنتج؟» للخارطة والتواصل، والقصص تجيب «ماذا نبني هذا الأسبوع؟» للتنفيذ. وكن صادقًا حول حدود القصص: إنها ضعيفة مع متطلبات الجودة العرضية («لا يسجّل النظام معرّفات المرضى أبدًا») والتدفقات المتشعبة والدقة التنظيمية — هناك استخدم عبارات جودة صريحة وسيناريوهات ومواصفة.',
          en: 'Above stories sit system features: larger, coherent capabilities a stakeholder would recognize and value as a unit — "appointment reminders," "insurance verification," "waitlist management." A good feature is user-meaningful ("caching layer" is not a feature; "instant search" might be), independently valuable even when shipped partially, decomposable into INVEST-able stories, and traceable to a stakeholder goal. Features and stories form a two-level hierarchy: features answer "what capabilities does the product have?" for the roadmap; stories answer "what do we build this week?" for execution. Be honest about story limits too: they are weak at cross-cutting quality requirements ("never log patient identifiers"), at complex branching flows, and at regulatory precision — use explicit quality statements, scenarios, and specifications there.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'سيناريو التجربة: شخص، هدف، مشاهد',
        en: 'The Experience Scenario: A Person, a Goal, Scenes',
      },
      chunks: [
        {
          ar: 'السيناريو يروي قصة ملموسة لشخص محدد يستعمل النظام لتحقيق هدف، خطوة بخطوة، في موقف محدد. حيث القصة وعدٌ من سطر واحد، السيناريو سرديّة تكشف الفجوات والفروع والواقع البشري التي تخفيها الصيغ اليسيرة. القواعد: شخصية ملموسة لا «المستخدم» — «Kati موظفة استقبال جديدة منذ أسبوعين» تتصرف غير مدير مكتب خبير. ابدأ من مثيّر وهدف — سيناريو بلا هدف مجرد سكربت نقرات. امشِ المسار السعيد أولًا ثم تفرّع عمدًا إلى الاستثناءات — مريض غير موجود، انقطاع شبكة — فالاستثناءات موطن المتطلبات المفقودة. ابقَ في مسألة المشكلة غالبًا: من يحدد مواضع البكسل توقف عن كتابة متطلب وصار يصمّم. وأدرج السياق العاطفي: «ثلاثة أشخاص في الطابور يراقبونها» متطلب أداء متنكّر.',
          en: 'A scenario tells a concrete story of a specific person using the system to accomplish a goal, step by step, in a specific situation. Where a story is a one-line promise, a scenario is a narrative — and the narrative exposes gaps, branches, and human realities that terse formats hide. Guidelines: use a concrete persona, not "the user" — "Kati, a new front-desk clerk two weeks into the job" behaves differently from an experienced manager. Start from a trigger and a goal; a scenario without a goal is a click-by-click script. Walk the happy path first, then deliberately branch into exceptions — a missing patient, a dropped network — because exceptions are where most requirements are missing. Stay in the problem, mostly: prescribing pixel positions has stopped being a requirement and become a design. Include emotional context: "three people in line are watching" is a performance requirement in disguise.',
        },
        {
          ar: 'سيناريو واحد من العيادة يكشف الغلة. دوروثي، موظفة خبيرة، قبل التاسعة صباحًا، طابور خمسة مرضى، وهدفها تسجيل القادمين سريعًا وتجهيز الطبيب قبل الزيارة. المسار السعيد يولّد قصصًا: بحث بالاسم الأخير، تفريق بين مريضين بتاريخ الميلاد، لمسة واحدة لوسم الحضور، إشعار الطبيب. الاستثناء أ — اسم مكتوب خطأً عند الحجز — يكشف قدرة كاملة مفقودة: بحث برقم الهاتف وتصحيح السجل دون مغادرة تدفق تسجيل الوصول؛ لم تدخل قائمة الأعمال قط. الاستثناء ب — مريض يحتاج مترجمًا — يُظهر علمًا عرضيًا يرافق المريض إلى شاشة الطبيب مبكرًا بما يكفي للترتيب. وميزانية «خمس عشرة ثانية» متطلب أداء مكتوب كواقع بشري ثم تجعله قابلًا للاختبار. ثم ارسم: ستوري بورد lo-fi بإطار خشن لكل خطوة — إن لم تستطع رسم الإطار فأنت لم تتخيل المتطلب بعد.',
          en: 'One clinic scenario shows the yield. Dorothy, an experienced clerk, before 9 a.m., five patients in line, her goal to check arrivals in fast and prepare the clinician. The happy path yields stories: search by last name, disambiguate by date of birth, one-tap arrival, clinician notification. Exception A — a misspelled name — reveals a whole missing capability: find by phone and correct the record inline, without leaving the check-in flow; nobody had put it in the backlog. Exception B — an interpreter-needed patient — surfaces a cross-cutting flag that travels to the clinician\u2019s screen early enough to act. And the fifteen-second budget is a performance requirement stated as human reality, which you then make testable. Then draw it: a lo-fi storyboard, one rough frame per step. If you cannot draw the frame, you have not imagined the requirement yet.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'فاحص القالب: ثلاثة أجزاء وثلاثة أحكام',
        en: 'The Template Checker: Three Parts, Three Verdicts',
      },
      code: `stories = [
    "As a clerk, I want to flag a patient as needs-interpreter, so that the clinician is prepared before the visit.",
    "As a clerk, I want to search patients.",
    "I want the system to use a dropdown so that it looks modern.",
]

def check_story(story):
    if not story.startswith("As a "):
        return "missing role"
    if ", I want " not in story:
        return "missing capability"
    if ", so that " not in story:
        return "missing goal"
    return "OK"

for i, s in enumerate(stories, 1):
    print("story%d: %s" % (i, check_story(s)))`,
      explanation: {
        ar: 'الفاحص يقرأ البطاقة كما يقرأها المراجع: الدور أولًا (تبدأ بـ As a)، ثم القدرة (تحوي , I want)، ثم الهدف (تحوي , so that)، ويقصي أول خلل يجده. القصة الأولى تمر بالثلاثة فتكون OK. الثانية تنقطع عند الهدف: «أريد البحث» بلا so that — لا أحد يعرف لماذا. الثالثة تسقط من أول بيت: لا دور أصلًا، ومجملها حل تقني متنكر. لاحظ أن الفاحص يتحقق من الشكل فقط: قصة بصيغة سليمة وهدف غامض («بحيث تتحسن القرارات») ستمر — ويبقى ذوق المراجع البشري هو خط الدفاع الثاني.',
        en: 'The checker reads the card the way a reviewer does: role first (starts with As a), then capability (contains , I want), then goal (contains , so that), reporting the first defect it finds. Story one passes all three, so it is OK. Story two stops at the goal: "I want to search patients" has no so that — nobody knows why. Story three fails at the first gate: no role at all, and it is a technical solution in disguise. Note that the checker validates form only: a well-formed story with a vague benefit ("so that decisions get better") still passes — the human reviewer remains the second line of defense.',
      },
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l3.ex1',
      exKind: 'trace_output',
      prompt: {
        ar: 'تتبّع الفاحص على البطاقات الثلاث: ماذا يطبع كل سطر بالضبط، بالترتيب؟ اكتب الخرج كاملًا.',
        en: 'Trace the checker over the three cards: what exactly does each line print, in order? Write the full output.',
      },
      code: `def check(story):
    if not story.startswith("As a "):
        return "missing role"
    if ", I want " not in story:
        return "missing capability"
    if ", so that " not in story:
        return "missing goal"
    return "OK"

cards = [
    "As a nurse, I want today's schedule, so that I plan rounds.",
    "As a user, I want faster search.",
    "I want it modern.",
]
for i, c in enumerate(cards, 1):
    print(i, check(c))`,
      answer: '1 OK\n2 missing goal\n3 missing role',
      solution: '1 OK\n2 missing goal\n3 missing role',
      hints: [
        {
          ar: 'الفحص بالترتيب: الدور، فالقدرة، فالهدف — ويُرجَع أول خلل فقط.',
          en: 'Checks run in order: role, then capability, then goal — only the first defect is returned.',
        },
        {
          ar: 'البطاقة الأولى تجتاز البوابات الثلاث فتحصل على OK.',
          en: 'The first card passes all three gates and gets OK.',
        },
        {
          ar: 'البطاقة الثانية تبدأ بـ As a وتحوي , I want لكنها لا تحوي , so that — توقفي عند فحص الهدف.',
          en: 'Card two starts with As a and contains , I want but has no , so that — it stops at the goal check.',
        },
        {
          ar: 'البطاقة الثالثة لا تبدأ بـ As a أصلًا — فالحكم missing role، والطباعة أرقام من 1: «1 OK» ثم «2 missing goal» ثم «3 missing role».',
          en: 'Card three does not start with As a at all — verdict missing role. Printing numbers from 1: "1 OK", "2 missing goal", "3 missing role".',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l3.ex2',
      exKind: 'write_code',
      prompt: {
        ar: 'أكمل دالة check_story التي تتحقق من أجزاء القالب الثلاثة بالترتيب (الدور ثم القدرة ثم الهدف) وتُرجع OK أو اسم الجزء الناقص، بحيث تطبع الأسطر الأربعة حكمًا على كل بطاقة.',
        en: 'Complete the check_story function: validate the three template parts in order (role, then capability, then goal) and return OK or the name of the missing part, so the four printed lines give a verdict per card.',
      },
      starterCode: `cards = [
    "As a clerk, I want to flag difficult patients, so that staff handle visits calmly.",
    "As a manager, I want a report.",
    "As a manager, I want a report, so that decisions get better.",
    "The system must use MongoDB for speed.",
]

def check_story(story):
    # Validate the three parts of the Connextra template in order.
    # Return "OK" or which part is missing.
    ...

for i, story in enumerate(cards, 1):
    print("story%d: %s" % (i, check_story(story)))`,
      solution: `cards = [
    "As a clerk, I want to flag difficult patients, so that staff handle visits calmly.",
    "As a manager, I want a report.",
    "As a manager, I want a report, so that decisions get better.",
    "The system must use MongoDB for speed.",
]

def check_story(story):
    if not story.startswith("As a "):
        return "missing role"
    if ", I want " not in story:
        return "missing capability"
    if ", so that " not in story:
        return "missing goal"
    return "OK"

for i, story in enumerate(cards, 1):
    print("story%d: %s" % (i, check_story(story)))`,
      tests: [
        {
          id: 't-ok',
          name: { ar: 'قصة سليمة', en: 'well-formed story' },
          code: "assert check_story('As a nurse, I want x, so that y.') == 'OK', 'expected OK | got %r' % check_story('As a nurse, I want x, so that y.')",
          expected: 'OK',
        },
        {
          id: 't-goal',
          name: { ar: 'بطاقة بلا هدف', en: 'card without goal' },
          code: "assert 'story2: missing goal' in __learner_output__, 'expected: story2: missing goal | actual: %r' % __learner_output__",
          expected: 'story2: missing goal',
        },
        {
          id: 't-role',
          name: { ar: 'بطاقة بلا دور', en: 'card without role' },
          code: "assert 'story4: missing role' in __learner_output__, 'expected: story4: missing role | actual: %r' % __learner_output__",
          expected: 'story4: missing role',
        },
      ],
      hints: [
        {
          ar: 'ثلاثة فحوص متتالية تكفي: startswith للدور، ثم in للقدرة، ثم in للهدف.',
          en: 'Three sequential checks suffice: startswith for the role, then in for the capability, then in for the goal.',
        },
        {
          ar: 'أرجع من كل فحص فورًا عند الإخفاق — الترتيب مهم: الدور قبل القدرة قبل الهدف.',
          en: 'Return immediately on each failing check — order matters: role before capability before goal.',
        },
        {
          ar: 'الهيكل: if not story.startswith("As a "): return "missing role" — ثم كرّر النمط مع ", I want " و ", so that "، وفي النهاية return "OK".',
          en: 'Skeleton: if not story.startswith("As a "): return "missing role" — then repeat the pattern with ", I want " and ", so that ", and finally return "OK".',
        },
        {
          ar: 'قريب من الحل: if ", so that " not in story: return "missing goal" — البطاقة الثالثة ستمر الشكل ويبقى غموض benefitها للمراجع البشري.',
          en: 'Near-solution: if ", so that " not in story: return "missing goal" — card three will pass the form and its vague benefit stays for the human reviewer.',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l3.ex3',
      exKind: 'mcq',
      prompt: {
        ar: 'قصة وصلت إلى السبرنت: «As a DBA, I want to refactor the database layer, so that it is cleaner.» أي خاصية من INVEST تنكسر هنا أكثر من غيرها؟',
        en: 'A story reached the sprint: "As a DBA, I want to refactor the database layer, so that it is cleaner." Which INVEST property is most broken here?',
      },
      options: [
        { id: 'a', text: { ar: 'Small — القصة أكبر من تكرار واحد', en: 'Small — the story is too big for one iteration' } },
        {
          id: 'b',
          text: {
            ar: 'Valuable — لا قيمة يراها مستخدم في هذه القصة كما هي',
            en: 'Valuable — no user-perceivable value in the story as written',
          },
        },
        { id: 'c', text: { ar: 'Estimable — لا يمكن تقدير حجمها', en: 'Estimable — its size cannot be estimated' } },
        { id: 'd', text: { ar: 'Negotiable — البطاقة عقد ملزم لا نقطة محادثة', en: 'Negotiable — the card is a binding contract, not a conversation' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        {
          ar: 'اسأل: من المستخدم الذي سيتذوق الفرق بعد هذه القصة؟',
          en: 'Ask: which user will taste the difference after this story?',
        },
        {
          ar: 'الـ benefit «أن تكون أنظف» يتحدث بلغة الشيفرة لا بلغة المستخدم.',
          en: 'The benefit "so that it is cleaner" speaks the language of code, not users.',
        },
        {
          ar: 'إعادة الهيكلة عمل حقيقي وهندسة سليمة — لكنه ليس قصة مستخدم؛ يحتاج إعادة صياغة تظهر قيمته (بحث أسرع، أخطاء أقل).',
          en: 'Refactoring is real, sound engineering — but not a user story; rephrase it to surface its value (faster search, fewer errors).',
        },
        {
          ar: 'الخانة المنكسرة هي Valuable.',
          en: 'The broken property is Valuable.',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l3.ex4',
      exKind: 'fill_blank',
      prompt: {
        ar: 'أكمل المصطلح: السرد الملموس لشخص محدد وهدف محدد وخطوات متتابعة في موقف محدد — الذي يكشف الاستثناءات التي تخفيها القصص اليسيرة — يسمى ________. اكتب الكلمة الإنجليزية كلمة واحدة.',
        en: 'Complete the term: a concrete narrative of a specific person with a specific goal, step by step, in a specific situation — the form that exposes exceptions terse stories hide — is called a ________. Write the single English word.',
      },
      answer: 'scenario',
      solution: 'scenario',
      hints: [
        {
          ar: 'ليست قصة (story) — القصة سطر واحد ووعد بمحادثة.',
          en: 'Not a story — a story is one line and a promise to talk.',
        },
        {
          ar: 'عنوان هذا المفهوم في الفصل يتقاطع مع كلمة تعني «مشهدًا» في المسرح.',
          en: 'The concept\u2019s name overlaps with a word meaning a theatrical "scene".',
        },
        {
          ar: 'سيناريو دوروثي في حالة العيادة مثال كامل عليه.',
          en: 'Dorothy\u2019s scenario in the clinic case is a full example.',
        },
        {
          ar: 'الكلمة scenario.',
          en: 'The word is scenario.',
        },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `# فاحص القصص: اكتب قصتك، ثم كسرها عمدًا، وراقب الحكم.
def check_story(story):
    if not story.startswith("As a "):
        return "missing role"
    if ", I want " not in story:
        return "missing capability"
    if ", so that " not in story:
        return "missing goal"
    return "OK"

cards = [
    "As a student, I want to see my grades, so that I plan my semester.",
]

for i, s in enumerate(cards, 1):
    print("story%d: %s" % (i, check_story(s)))

# جرّب:
# 1) أضف قصة من تطبيق تستخدمه يوميًا — بثلاثتها الكاملة.
# 2) احذف الـ so that وراقب الحكم: هل قصة بلا هدف تستحق البناء؟
# 3) قصة بصيغة سليمة لكن benefit دائري («بحيث أستطيع...») ستمر الفاحص — هل تمري أنت؟
# 4) اكتب سيناريو استثناء لقصتك: من يستخدمها؟ ماذا لو فشل البحث؟ ماذا لو انقطعت الشبكة؟`,
      prompt: {
        ar: 'فاحص حي بين يديك. أضف قصة حقيقية من تطبيق تستخدمه يوميًا بثلاثتها، ثم كسرها عمدًا: احذف الـ so that وشاهد الحكم، وجرّب benefit دائريًا يمرّ الفاحص ويخدع العين. وأخيرًا اكتب سيناريو استثناء لقصتك — فالاستثناءات حيث تختبئ المتطلبات المفقودة.',
        en: 'A live checker. Add a real story from an app you use daily, all three parts; then break it on purpose: delete the so that and watch the verdict, and try a circular benefit that passes the checker while fooling the eye. Finally, write one exception scenario for your story — exceptions are where missing requirements hide.',
      },
    },
    {
      kind: 'quiz',
      id: 'swe.ch3.l3.quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'نعود إلى الفصل 2: من أين أتت قصص المستخدم أولًا كممارسة جوهرية؟',
            en: 'Back to Chapter 2: where did user stories originate as a core practice?',
          },
          options: [
            {
              id: 'a',
              text: { ar: 'من وثائق waterfall التقليدية الكبيرة', en: 'From large traditional waterfall documents' },
            },
            {
              id: 'b',
              text: {
                ar: 'من XP (Extreme Programming) ثم تبنّتها Scrum وبقية الممارسات الرشيقة',
                en: 'From XP (Extreme Programming), later adopted by Scrum and the rest of the agile world',
              },
            },
            { id: 'c', text: { ar: 'من معايير شهادات السلامة', en: 'From safety certification standards' } },
            { id: 'c2', text: { ar: 'من نموذج V', en: 'From the V-model' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قصص المستخدم وُلدت في XP كبديل خفيف لوثائق المتطلبات: بطاقة قصيرة تلتقط حاجة المستخدم وتدعو لمحادثة — ثم انتشرت حتى صارت لغة عالمية، مع قالب Connextra ومعايير القبول. وهذا يتصل بمبدأ الفصل 2: القيمة تُصنع في الحوار حول العمل لا في الوثيقة.',
            en: 'User stories were born in XP as a lightweight alternative to requirements documents: a short card capturing a user need and inviting a conversation — then they spread everywhere, along with the Connextra template and acceptance criteria. This connects to Chapter 2\u2019s principle: value is created in the conversation about the work, not in the document.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في قالب As a <role>, I want <capability>, so that <benefit> — أي جزء يلتقط الـ why وهو الأكثر حذفًا؟',
            en: 'In As a <role>, I want <capability>, so that <benefit> — which clause captures the why and is most often omitted?',
          },
          options: [
            { id: 'a', text: { ar: 'role — يحدد من المستفيد', en: 'role — names who benefits' } },
            { id: 'b', text: { ar: 'capability — تصف السلوك', en: 'capability — states the behavior' } },
            { id: 'c', text: { ar: 'so that — تلتقط الهدف الكامن', en: 'so that — captures the underlying goal' } },
            { id: 'd', text: { ar: 'العنوان القصير للبطاقة', en: 'the card\u2019s short title' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'عبارة so that هي الأهم: تربط القدرة بهدف حقيقي، وغيابها أو دائرتها إنذار أن أحدًا لا يفهم لماذا الميزة موجودة. الدور يحمي من قصص بلا مستفيد، والقدرة تصف السلوك — لكن الهدف هو ما يفصل الميزة المبررة عن الميزة المحذوفة.',
            en: 'The so that clause matters most: it ties the capability to a real goal, and a vague or circular one warns that nobody understands why the feature exists. The role guards against beneficiary-less stories and the capability states behavior — but the goal is what separates a justified feature from a cut one.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي شخصية تجعل سيناريو التجربة أقوى؟',
            en: 'Which persona makes an experience scenario stronger?',
          },
          options: [
            { id: 'a', text: { ar: '«المستخدم» بعبارات عامة', en: '"The user", in generic terms' } },
            {
              id: 'b',
              text: {
                ar: '«Kati، موظفة استقبال جديدة منذ أسبوعين، تخشى الأخطاء أمام طابور طويل»',
                en: '"Kati, a front-desk clerk two weeks in, afraid of mistakes with a long line watching"',
              },
            },
            { id: 'c', text: { ar: '«مستخدم خارق لا يخطئ أبدًا ولا يحتاج مساعدة»', en: '"A power user who never errs and needs no help"' } },
            { id: 'd', text: { ar: '«النظام» بصيغة تقنية', en: '"The system", in technical terms' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الشخصية الملموسة (اسم، دور، مستوى مهارة، دافع) تُخرج الغموض إلى النور: موظفة جديدة تحت ضغط الطابور تكشف حاجات تصميمية لا يكشفها «المستخدم» المجرد — والسياق العاطفي نفسه متطلب أداء وسهولة استخدام متنكر.',
            en: 'A concrete persona (name, role, skill level, motivation) forces vagueness into the open: a new clerk under queue pressure surfaces design needs an abstract "user" never will — and the emotional context itself is a usability and performance requirement in disguise.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي العناصر التالية لا يصلح ميزة (feature) وفق إرشادات الفصل؟',
            en: 'Which of the following does not qualify as a system feature per the chapter\u2019s guidelines?',
          },
          options: [
            { id: 'a', text: { ar: '«إدارة قائمة الانتظار»', en: '"Waitlist management"' } },
            { id: 'b', text: { ar: '«طبقة تخزين مؤقت» (caching layer)', en: '"Caching layer"' } },
            { id: 'c', text: { ar: '«التحقق من التأمين»', en: '"Insurance verification"' } },
            { id: 'd', text: { ar: '«تذكيرات المواعيد»', en: '"Appointment reminders"' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الميزة تُسمى بشيء يهتم به صاحب المصلحة ويقدّره كوحدة. الطبقات الداخلية تفاصيل معمارية قد تخدم ميزة مثل «بحث فوري» لكنها ليست ميزة بذاتها — وقيَم الميزة: ذات معنى للمستخدم، قيّمة مستقلة، قابلة للتفكيك إلى قصص، ومتتبعة إلى هدف.',
            en: 'A feature names something a stakeholder cares about and values as a unit. Internal layers are architecture that may serve a feature like "instant search" but are not a feature themselves — feature criteria: user-meaningful, independently valuable, decomposable into stories, traceable to a goal.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: '«As a user, I want the app, so that I can use it.» — قصة سليمة لأنها تطابق القالب حرفيًا، فلنحولها إلى السبرنت.',
          right: 'القالب شرط لازم لا كافٍ: الدور عام بلا وجه، والـ benefit دائري بلا هدف. قصة لا تستطيع تبرير وجودها بقيمة يراها مستخدم حقيقي هي قصة تُحذف أو تُعاد كتابتها.',
          note: {
            ar: 'الفاحص الميكانيكي يتحقق من الأجزاء؛ وعين المراجع تتحقق من المعنى.',
            en: 'The mechanical checker validates parts; the reviewer\u2019s eye validates meaning.',
          },
        },
        {
          wrong: 'السيناريو الجيد يحدد كل شيء: ألوان الواجهة، مواضع الأزرار، وحجم الخط — حتى لا يخطئ المطوّر.',
          right: 'ذلك تصميم لا متطلب. السيناريو يبقى في مسألة المشكلة: الشخص، الهدف، الخطوات، والاستثناءات — وبعض تفاصيل الواجهة حيث لا بد — ويترك قرارات التصميم لمن يصمم.',
          note: {
            ar: 'سيناريو يصفد البكسلات أغلق الباب على تصميمات أفضل من تخيله.',
            en: 'A scenario that handcuffs pixels has closed the door on designs better than the one it imagined.',
          },
        },
        {
          wrong: 'كتبنا المسار السعيد فقط — الاختبارات ستمر والمشروع يسير، والاستثناءات نراها لاحقًا.',
          right: 'الاستثناءات حيث تختبئ معظم المتطلبات المفقودة: مريض غير موجود، اسم مكتوب خطأً، انقطاع شبكة، مريض يحتاج مترجمًا. امشِ المسار السعيد ثم تفرّع عمدًا — وسيناريو واحد جيد يكشف قدرة كاملة لم تدخل قائمة الأعمال قط.',
          note: {
            ar: 'كل إطار لا تستطيع رسمه في الستوري بورد متطلب لم تكتشفه بعد.',
            en: 'Every storyboard frame you cannot draw is a requirement you have not discovered yet.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'قصة المستخدم: As a <role>, I want <capability>, so that <benefit> — وعد بمحادثة لا مواصفة؛ جزاء so that هو الأهم والأكثر حذفًا، وغموضه أو دائرته إنذار حذف.',
          en: 'A user story: As a <role>, I want <capability>, so that <benefit> — a promise to talk, not a specification; the so that clause matters most and is most often omitted, and its vagueness or circularity is a cut signal.',
        },
        {
          ar: 'INVEST تشخيص لا بوابة: إن فشلت القصة أصلحها؛ ومعايير القبول Given / When / Then تتحول في BDD إلى اختبارات آلية قابلة للتنفيذ — والميزات فوق القصص تجيب أسئلة الخارطة.',
          en: 'INVEST is a diagnostic, not a gate: fix a failing story; Given / When / Then acceptance criteria become executable BDD tests — and features above stories answer roadmap questions.',
        },
        {
          ar: 'سيناريو التجربة: شخص ملموس + مثيّر وهدف + مسار سعيد ثم استثناءات — يكشف المتطلبات المفقودة أسرع من أي عصف مجرد، والستوري بورد يجبر ما تعجز عنه الجملة.',
          en: 'An experience scenario: a concrete persona + trigger and goal + happy path then exceptions — uncovers missing requirements faster than abstract brainstorming, and a storyboard forces what sentences let you dodge.',
        },
      ],
      reflectPrompt: {
        ar: 'خذ قصة من عملك اليومي أو من تطبيق تستخدمه: ما الـ benefit الحقيقي لها؟ اكتبها بالقالب كاملًا، ثم اكتب سيناريو استثناء واحدًا لها — ما المتطلب الذي ظهر ولم يكن في القصة؟',
        en: 'Take a story from your work or an app you use: what is its real benefit? Write it fully in the template, then write one exception scenario for it — which requirement appeared that the story never had?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch3.s4', pages: 'ص72-77 / pp.72-77' },
        { book: 'SWE', section: 'swe.ch3.s5', pages: 'ص77-79 / pp.77-79' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch3.s4', pages: 'ص72-77 / pp.72-77' },
    { book: 'SWE', section: 'swe.ch3.s5', pages: 'ص77-79 / pp.77-79' },
  ],
} satisfies Lesson;

export default lesson;
