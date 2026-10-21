import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch2.l1 — "Processes and Values: From Manifesto to Scrum"
 * القيم والعمليات: من البيان إلى سكرم
 * Aligned with SWE ch2 s1 (Processes and Values Guide Development, pp.35-37) +
 * s2 (Structuring Teamwork: The Scrum Framework, pp.38-40).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: a deterministic sprint ledger over a fixed priority-ordered
 * backlog and fixed per-sprint completed lists — per-sprint velocity and the
 * remaining-points column, exactly the numbers a Sprint Review would read.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
const lesson = {
  id: 'swe.ch2.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 2,
  title: { ar: 'القيم والعمليات: من البيان إلى سكرم', en: 'Processes and Values: From Manifesto to Scrum' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch1.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'اليوم الأول في فريق من ستة أشخاص. لم يقل لك أحد "عمليتنا كذا"، ومع ذلك كل شيء يجري بترتيب غامض: العيوب تُبلَّغ في قناة بعينها، مراجعة الكود قد تجلس يومين، والزبون يُقابَل كل أسبوعين لا كل شهر. هذه العادات — مكتوبة أو لا — هي العملية: الطريقة التي يحوّل بها الفريق أفكارًا إلى برمجية عاملة دون أن يسحق بعضها بعضًا. والفريق الذي لا يختار عملية يملك واحدة عرضية غير موثقة، وهي عادة أغلى الأنواع كلها. هذا الفصل يمنحك بدائل مسمّاة — من بيان أجايل وسكرم إلى الشلال وعرض V والحلزون وShape Up — وحكمتك في الاختيار بينها. وبنهاية الدرس ستقرأ دفتر سبرنت بأرقامه: السرعة والمتبقي، وتعرف من يملك "ماذا" ومن يملك "كيف" في سكرم.',
        en: 'Day one on a team of six. Nobody told you "our process is X", yet everything happens in a mysterious order: bugs go to one specific channel, a code review may sit for two days, and the customer is met every two weeks, not every month. Those habits — written or not — are the process: how a team turns ideas into working software without stepping on each other. A team that never chooses a process owns an accidental, undocumented one, and it is usually the most expensive kind. This chapter gives you named alternatives — from the Agile Manifesto and Scrum to waterfall, the V, the spiral and Shape Up — and the judgment to pick among them. By the end you will read a sprint ledger with its numbers: velocity and remaining, and know who owns the what and who owns the how in Scrum.',
      },
    },
    {
      kind: 'predict',
      code: "BACKLOG = {'login': 5, 'search': 8, 'export': 3}\ndone_sprint1 = ['login', 'export']\npoints = sum(BACKLOG[item] for item in done_sprint1)\nprint(points)\nprint('remaining: %d' % (sum(BACKLOG.values()) - points))",
      question: {
        ar: 'قائمة أعمال صغيرة بنقاطها، وقائمة ما اكتمل في السبرنت الأول. ماذا يطبع السطران؟ وبأي رقم يفتتح مالك المنتج مراجعة السبرنت؟',
        en: 'A tiny backlog with points, and what got completed in sprint one. What do the two lines print? With which number does the Product Owner open the sprint review?',
      },
      reveal: {
        ar: 'الطباعة: 8 ثم remaining: 8. السرعة هي مجموع نقاط البنود المكتملة فعليًا (5+3)، والمتبقي هو 16 نقطة كلية ناقص 8. هذان الرقمان — سرعة السبرنت والمتبقي — هما نبض سكرم الذي ستبنيه في هذا الدرس: الأرقام لا تأتي من تخمين بل من البنود التي حققت تعريف الإنجاز.',
        en: 'It prints 8 then remaining: 8. Velocity is the sum of points of items that actually finished (5+3), and remaining is 16 total points minus 8. Those two numbers — sprint velocity and remaining — are the pulse of Scrum you will build here: the numbers come from items that met the Definition of Done, not from guessing.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ما العملية ولماذا تستحق اسمًا', en: 'What a process is and why it deserves a name' },
      chunks: [
        {
          ar: 'عملية تطوير البرمجيات طريقة متكررة لتنظيم الأنشطة التي تحوّل فكرة إلى برمجية منشورة ومصانة: فهم ما نبنيه، تصميمه، كتابته، فحصه، إطلاقه، ثم تغييره. كل العمليات تغطي الأنشطة الجوهرية نفسها — والاختلاف في ترتيبها وحجمها وكم مرة تعود إليها. وافصل شيئين يخلطهما المبتدئون: نموذج العملية هو الشكل المجرد — "سبرنتات أسبوعين كلٌّ ينتج برمجية قابلة للشحن" أو "اجمع كل المتطلبات ثم صمّم ثم ابنِ" — أما العملية الحية فهو النموذج زائد آلاف القرارات المحلية: في أي قناة تذهب العيوب، وكم يجلس مراجعة كود قبل أن تُدمج. المبدأ: العملية الجيدة تجعل الشيء الصحيح هو الأسهل — إن لم تعمل إلا بأبطال منضبطين فهي أمنية لا عملية.',
          en: 'A software development process is a repeatable way of organizing the activities that turn an idea into deployed, maintained software: understanding what to build, designing it, writing it, checking it, releasing it, then changing it. Every process covers the same core activities — the differences are their order, their size, and how often you revisit them. Separate two things beginners conflate: the process model is the abstract shape — "two-week sprints each producing shippable software" or "gather all requirements, then design, then build" — while the lived process is that model plus a thousand local decisions: which channel bugs go to, how long a code review sits before merging. The principle: a good process makes the right thing the easy thing — if it only works with disciplined heroes, it is a wish, not a process.',
        },
        {
          ar: 'تحت تنافر أسماء المنهجيات ثقافتان حقيقيتان. الثقافة المخطِّطة plan-driven تعامل البرمجية كمبنى: تحدد ما ستبنيه تفصيلًا قبل البناء، تجمّد المتطلبات، ترسم التصميم، ثم ينفذ البناء وفق التصميم — والصحة تعني المطابقة للمواصفة. تزدهر حين تكون المسألة مفهومة جيدًا وثمن الخطأ عاليًا والتغيير نادرًا: طيران، أجهزة طبية، عقود بتسليمات ثابتة. وثقافة النمو grow-it تعاملها كحديقة: تبدأ بشيء صغير يعمل، ثم تطوّره بتغييرات صغيرة متعددة يصحّح كل واحد منها ضد الواقع قبل التالي — والمتطلبات تُكتشف من البرمجية العاملة لا تُجمَّد سلفًا. الصحة هنا أن تفعل شيئًا نافعًا لزائر حقيقي وتظل قابلة للتغيير. لا ثقافة "صحيحة": كلٌّ مضبوطة لملف مخاطر مختلف، وأغلب منهجات هذا الفصل — سكرم وXP والحلزون — محاولات لجلب فوائد النمو مع قدر كافٍ من انضباط التخطيط.',
          en: 'Beneath the alphabet soup of methods lie two real cultures. The plan-driven culture treats software like a building: decide in detail what to build before building, freeze requirements, draw the design, then construct to it — correctness means conforming to the spec. It thrives when the problem is well understood, mistakes are costly, and change is rare: avionics, medical devices, fixed-deliverable contracts. The grow-it culture treats it like a garden: start with something small that works, then evolve it through many small changes, each validated against reality before the next — requirements are discovered through working software, not frozen in advance. Correctness here means doing something useful for a real user while staying changeable. Neither is right: each is tuned for a different risk profile, and most of this chapter\u2019s methods — Scrum, XP, the spiral — chase the feedback benefits of growing while keeping enough planning discipline.',
        },
        {
          ar: 'بيان أجايل (2001) بلّور ثقافة النمو في أربع قيم — في كل ثنائية الجانبان لهما قيمة لكن الأيسر أكثر وزنًا: الأفراد والتفاعلات فوق العمليات والأدوات؛ البرمجية العاملة فوق التوثيق الشامل؛ تعاون الزبون فوق التفاوض على العقد؛ الاستجابة للتغيير فوق اتباع خطة. اقرأها بعناية: بيانٌ عما تثق به حين يتعارض الجانبان، لا دعوى ضد التخطيط أو التوثيق. إذا خالفت خطتك الجميلة البرمجية العاملة فصدّق البرمجية، وإذا خالف المستند حوارًا مع الزبون فعِش الحوار. ومبادئه الاثنا عشر تدفع أبعد: سلّم برمجية عاملة بتكرار، ورحّب بتغيّر المتطلبات حتى متأخرًا، وحافظ على إيقاع مستدام، وتأمل بانتظام كيف تتحسن. وقيمةٌ تفوق القواعد: فريق يمارس مراسيم سكرم حرفيًا متجاهلًا "الاستجابة للتغيير" أخطأ أكثر من فريق مرتجل أبقى حلقات التغذية الراجعة مشدودة.',
          en: 'The Agile Manifesto (2001) crystallized the grow-it culture into four values — in each pair both sides have worth, but the left is valued more: individuals and interactions over processes and tools; working software over comprehensive documentation; customer collaboration over contract negotiation; responding to change over following a plan. Read it carefully: it states what to trust when the two sides conflict, not a case against planning or documentation. If your beautiful plan and your working software disagree, believe the software; if a document and a customer conversation disagree, have the conversation. Its twelve principles push further: deliver working software frequently, welcome changing requirements even late, keep a sustainable pace, reflect regularly on how to improve. And values outrank rules: a team that follows Scrum\u2019s ceremonies while ignoring "responding to change" misses the point more than a team that improvises but keeps its feedback loops tight.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'سكرم: الإيقاع الذي ينظّم الفريق', en: 'Scrum: the rhythm that organizes the team' },
      chunks: [
        {
          ar: 'سكرم أحد أكثر الأطر استعمالًا لتنظيم العمل الرشيق، وهو متعمد الحد الأدنى: لا يخبرك كيف تكتب الشيفرة ولا كيف تصمم ولا كيف تختبر — يرتب وقت الفريق وقراراته كي تسلّم برمجية عاملة في دورات قصيرة منتظمة وتتحسن وهي تفعل. أنت تورد ممارسات الهندسة، وسكرم يورد الإيقاع. القلب سبرنت: دورة ثابتة الطول — عادة من أسبوع إلى أربعة — تنتج زيادة قابلة للشحن محتملًا من المنتج. وفي فريق سكرم واحد ثلاث مساءلات (دليل سكرم 2020 فضّل مساءلة على "أدوار"): مالك المنتج يملك ماذا ولماذا — يمثل الزبون وأصحاب المصلحة، يحفظ قائمة الأعمال المتراكمة، ويحسم الأولوية؛ شخص واحد يحمل هذه المساءلة كي يسمع الفريق صوتًا واحدًا متماسكًا عن القيمة لا لجنة. المطورون يملكون كيف — يقدّرون ويصممون ويبنون ويختبرون، وهم ذاتيو الإدارة: لا أحد من خارج المجموعة يكلف أفرادها بالمهام. وسيد سكرم يملك العملية نفسها — مدرب ومزيل عوائق لا مدير مشاريع، ونجاحه أن يحتاجه الفريق أقل مع الوقت.',
          en: 'Scrum is a deliberately minimal, widely used framework: it does not tell you how to write code, design, or test — it organizes the team\u2019s time and decisions so working software ships in short, regular cycles. You supply the engineering practices; Scrum supplies the rhythm. The heartbeat is the sprint: a fixed-length iteration — usually one to four weeks — producing a potentially shippable increment. One Scrum Team, three accountabilities (the 2020 Scrum Guide prefers accountabilities to "roles"): the Product Owner owns the what and why — represents customers and stakeholders, maintains the product backlog, decides priority; one person — one voice about value, not a committee. The Developers own the how — estimate, design, build and test, self-managing: nobody outside the group assigns tasks. The Scrum Master owns the process — coach and obstacle-remover, not a project manager; success is the team needing them less over time.',
        },
        {
          ar: 'أحداث سكرم هي حلقات التغذية الراجعة مجسدة، وإجراؤها طقسًا فارغًا فشل كلاسيكي. تخطيط السبرنت يفتح الدورة: الفريق مع مالك المنتج يوافق على هدف سبرنت ويختار البنود التي يظنها قابلة للإنجاز ويحللها إلى قائمة أعمال السبرنت — جواب سؤالين: ماذا سننجز وكيف. والاجتماع اليومي القصير — خمس عشرة دقيقة — مزامنة المطورين وإعادة تخطيط يومهم نحو الهدف، وهو للفريق لا تقرير حالة لمدير: الإطار النافع "هل ما زلنا على المسار وما الذي يعترضنا" لا مسرح "ماذا فعلت أمس". ومراجعة السبرنت تغلق حلقة المنتج: عرض الزيادة العاملة على أصحاب المصلحة وجمع ملاحظاتهم التي تعود لتعيد تشكيل قائمة الأعمال — هنا تصحَّح المتطلبات بملامسة الواقع. أما الاسترجاعة فتغلق حلقة العملية: الفريق يتأمل كيف عمل — ما نُبقي وما نغيّر — ويلتزم بتحسين محدد أو اثنين للسبرنت القادم؛ فريق يتخطى الاسترجاعات تخلى عن طريقته المدمجة في أن يصير أفضل.',
          en: 'Scrum\u2019s events are feedback loops made concrete; running them as empty ritual is a classic failure. Sprint Planning opens the cycle: team and Product Owner agree on a sprint goal, select items they believe completable, and break them into the sprint backlog — what will we deliver, how. The Daily Scrum — fifteen minutes — is the Developers synchronizing and re-planning their day toward the goal; it is for the team, not status theater for a manager: "are we on track, what is in our way?" The Sprint Review closes the product loop: demo the working increment to stakeholders; their feedback flows back into the product backlog, correcting requirements against reality. The Retrospective closes the process loop: reflect on how you worked — what to keep, what to change — and commit to one or two improvements; skipping it abandons the built-in way of getting better.',
        },
        {
          ar: 'الأصول ثلاثة، ولكل منها التزامٌ يبقيها صادقة. قائمة الأعمال المتراكمة للمنتج: القائمة المرتبة الوحيدة لكل ما قد يستحق الفعل — ميزات وإصلاحات وتحسينات — ولا تكتمل أبدًا لأنها تتطور مع تعلمكم، والتزامها هدف المنتج طويل الأمد. قائمة أعمال السبرنت: الجزء المختار لهذه الدورة زائد خطة تسليمه، يملكها المطورون ويحدّثونها يوميًا، والتزامها هدف السبرنت. والزيادة: مجموع البنود المكتملة — برمجية عاملة فعلًا تحقق تعريف الإنجاز: قائمة مشتركة صريحة لما يعني "منتهي" (مُجمَّع، مُراجَع، مُختبَر، موثق، مدمج) وهي ما يمنع "منتهي" من أن يعني "منتهٍ على جهازي، غالبًا". البند لا يكون منتهيًا لأن أحدًا كتب شيفرة بل حين يحقق تعريف الإنجاز — وضعفه هو كيف تراكم الفرق كومة عمل "منتهٍ" لا تشحن أبدًا. وانتبه للفخ المعلن: حين يبدأ المدير أو سيد سكرم بإسناد المهام للأفراد وتتبّع مخرجهم الشخصي، تموت التنظيم الذاتي وينحل سكرم إلى إدارة تفصيلية باجتماعات إضافية.',
          en: 'Three artifacts, each with a commitment keeping it honest. The Product Backlog: the single ordered list of everything possibly worth doing — features, fixes, improvements — never "done", evolving as you learn; its commitment is the Product Goal. The Sprint Backlog: the subset pulled for this cycle plus its delivery plan, owned by the Developers, updated daily; its commitment is the Sprint Goal. The Increment: the sum of completed items — working software meeting the Definition of Done, the shared checklist of what "finished" means (compiled, reviewed, tested, documented, integrated) — which stops "done" meaning "done on my machine, probably". An item is done when it meets the Definition of Done; a weak one is how teams pile up "finished" work that never ships. The pitfall: when a manager or Scrum Master assigns tasks to individuals and tracks personal output, self-organization dies, Scrum degrades into micromanagement with extra meetings.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'دفتر سبرنت: السرعة والمتبقي', en: 'A sprint ledger: velocity and remaining' },
      code: "BACKLOG = [('login', 5), ('search', 8), ('export', 3), ('alerts', 2), ('reports', 13)]\nDONE = {1: ['login', 'export'], 2: ['search', 'alerts'], 3: ['reports']}\n\ntotal = sum(pts for _, pts in BACKLOG)\npts_of = dict(BACKLOG)\nremaining = total\nfor sprint in sorted(DONE):\n    velocity = sum(pts_of[item] for item in DONE[sprint])\n    remaining -= velocity\n    print('sprint %d velocity: %d remaining: %d' % (sprint, velocity, remaining))\nprint('total points: %d' % total)",
      explanation: {
        ar: 'دفتر السبرنت ثلاثة أفعال: نقاط البنود في قائمة BACKLOG بترتيب أولوية مالك المنتج، وقائمة DONE بالبنود المكتملة فعلًا في كل سبرنت — مكتملة بمعنى تعريف الإنجاز لا "كتبتُ شيفرة". ثم حلقة على السبرنتات بترتيبها تحسب سرعة كل دورة (مجموع نقاط المكتمل) وتخصمها من عمود المتبقي الذي يبدأ من الإجمالي 31. السطور: sprint 1 velocity: 8 remaining: 23 ثم 10 و13 حتى الصفر. لاحظ أن السرعة ليست هدفًا يُطارد بل قياسًا يُقرأ: مالك المنتج يستعمل المتبقي ليقرر ما يُعد للسبرنت التالي، والمراجعة هي حيث تتشكل DONE القادمة من ملاحظات الواقع.',
        en: 'The ledger makes three moves: BACKLOG holds item points in the Product Owner\u2019s priority order, and DONE holds the items that actually finished each sprint — finished per the Definition of Done, not "wrote the code". A loop over the sprints in order computes each velocity (the sum of completed points) and subtracts it from the remaining column that starts at 31 total. The lines read sprint 1 velocity: 8 remaining: 23, then 10 and 13 down to zero. Note velocity is not a target to chase but a measurement to read: the Product Owner uses remaining to plan the next sprint, and the review is where the next DONE gets reshaped by real feedback.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-velocity',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. تذكّر: السرعة مجموع نقاط البنود المكتملة، والمتبقي الإجمالي ناقص السرعة.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Recall: velocity is the sum of completed items\u2019 points, and remaining is the total minus velocity.',
      },
      code: "pts = {'login': 5, 'search': 8, 'export': 3}\nsprint = ['export', 'login']\nvelocity = 0\nfor item in sprint:\n    velocity = velocity + pts[item]\nprint('velocity: %d' % velocity)\nprint('left: %d' % (sum(pts.values()) - velocity))",
      solution: "velocity: 8\nleft: 8",
      answer: "velocity: 8\nleft: 8",
      hints: [
        { ar: 'الحلقة تمشي على sprint بالترتيب: export أولًا فتضيف 3، ثم login فتضيف 5 — الترتيب لا يغير المجموع.', en: 'The loop walks sprint in order: export first adds 3, then login adds 5 — order does not change the sum.' },
        { ar: 'السرعة إذن 3 + 5 = 8، ويطبع السطر الأول velocity: 8.', en: 'So velocity is 3 + 5 = 8, and the first line prints velocity: 8.' },
        { ar: 'إجمالي النقاط sum(pts.values()) يساوي 5 + 8 + 3 = 16، فالمتبقي 16 - 8 = 8.', en: 'The total sum(pts.values()) is 5 + 8 + 3 = 16, so remaining is 16 - 8 = 8.' },
        { ar: 'الخرج:\nvelocity: 8\nleft: 8', en: "The output:\nvelocity: 8\nleft: 8" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.sprint-ledger',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل دالة sprint_ledger(points, done) حيث points قاموس بند→نقاط وdone قاموس سبرنت→قائمة بنود مكتملة. لكل سبرنت بترتيب تصاعدي احسب السرعة وخصمها من المتبقي (يبدأ من مجموع النقاط) واطبع سطرًا بصيغة sprint %d velocity: %d remaining: %d. اجمع أزواج (السرعة، المتبقي) في قائمة وأعدها. ثم استدعِها على BACKLOG وDONE المعطاة واطبع sprints: %d.',
        en: 'Complete sprint_ledger(points, done) where points maps item→points and done maps sprint→list of completed items. For each sprint in ascending order compute the velocity, subtract it from the remaining column (starting at the total), and print a line formatted sprint %d velocity: %d remaining: %d. Collect the (velocity, remaining) pairs into a list and return it. Then call it on the given BACKLOG and DONE and print sprints: %d.',
      },
      starterCode: "def sprint_ledger(points, done):\n    total = sum(points.values())\n    remaining = total\n    summary = []\n\n    # TODO: امشِ السبرنتات بترتيبها واحسب السرعة والمتبقي واطبع سطرًا لكل سبرنت\n    # TODO: walk the sprints in order, compute velocity and remaining, print one line each\n\n    return summary\n\nBACKLOG = {'login': 5, 'search': 8, 'export': 3, 'alerts': 2, 'reports': 13}\nDONE = {1: ['login', 'export'], 2: ['search', 'alerts'], 3: ['reports']}\nresult = sprint_ledger(BACKLOG, DONE)\nprint('sprints: %d' % len(result))\n",
      solution: "def sprint_ledger(points, done):\n    total = sum(points.values())\n    remaining = total\n    summary = []\n    for sprint in sorted(done):\n        velocity = sum(points[item] for item in done[sprint])\n        remaining = remaining - velocity\n        summary.append((velocity, remaining))\n        print('sprint %d velocity: %d remaining: %d' % (sprint, velocity, remaining))\n    return summary\n\nBACKLOG = {'login': 5, 'search': 8, 'export': 3, 'alerts': 2, 'reports': 13}\nDONE = {1: ['login', 'export'], 2: ['search', 'alerts'], 3: ['reports']}\nresult = sprint_ledger(BACKLOG, DONE)\nprint('sprints: %d' % len(result))",
      tests: [
        {
          id: 't1',
          name: { ar: 'سطور الدفتر بأرقام صحيحة', en: 'Ledger lines with the right numbers' },
          code: "assert 'sprint 1 velocity: 8 remaining: 23' in __learner_output__ and 'sprint 2 velocity: 10 remaining: 13' in __learner_output__ and 'sprint 3 velocity: 13 remaining: 0' in __learner_output__, 'expected: sprint lines 8/23 10/13 13/0 | actual: %r' % __learner_output__",
          expected: 'sprint lines 8/23 10/13 13/0',
        },
        {
          id: 't2',
          name: { ar: 'القائمة المُعادة أزواج صحيحة', en: 'The returned list has correct pairs' },
          code: "assert result == [(8, 23), (10, 13), (13, 0)], 'expected: [(8, 23), (10, 13), (13, 0)] | actual: %r' % (result,)",
          expected: '[(8, 23), (10, 13), (13, 0)]',
        },
        {
          id: 't3',
          name: { ar: 'تعمل مع أي سجل آخر', en: 'Works with any other ledger' },
          code: "other = sprint_ledger({'a': 4, 'b': 6}, {1: ['a']})\nassert other == [(4, 6)], 'expected: [(4, 6)] | actual: %r' % (other,)",
          expected: '[(4, 6)] and sprint 1 velocity: 4 remaining: 6',
        },
        {
          id: 't4',
          name: { ar: 'المتبقي يبدأ من الإجمالي وينزف إلى صفر', en: 'Remaining starts at the total and drains to zero' },
          code: "assert sum(BACKLOG.values()) == 31 and result[-1][1] == 0, 'expected: total 31 draining to 0 | actual: %r' % (sum(BACKLOG.values()),)",
          expected: 'total 31 draining to 0',
        },
      ],
      hints: [
        { ar: 'امشِ sorted(done) كي لا تعتمد على ترتيب مفاتيح القاموس، واحسب velocity = sum(points[item] for item in done[sprint]).', en: 'Walk sorted(done) so you never depend on dict key order, with velocity = sum(points[item] for item in done[sprint]).' },
        { ar: 'خصم من المتبقي في المتغير نفسه: remaining = remaining - velocity — يبدأ من الإجمالي وينزل إلى صفر هنا.', en: 'Subtract into the same variable: remaining = remaining - velocity — it starts at the total and drains to zero here.' },
        { ar: 'الهيكل:\nfor sprint in sorted(done):\n    velocity = sum(points[item] for item in done[sprint])\n    remaining = remaining - velocity\n    summary.append((velocity, remaining))\n    print(\'sprint %d velocity: %d remaining: %d\' % (sprint, velocity, remaining))', en: "The skeleton:\nfor sprint in sorted(done):\n    velocity = sum(points[item] for item in done[sprint])\n    remaining = remaining - velocity\n    summary.append((velocity, remaining))\n    print('sprint %d velocity: %d remaining: %d' % (sprint, velocity, remaining))" },
        { ar: 'لو اختلفت أرقامك: الإجمالي 31، والسرعات 8 و10 و13 — أي أن المتبقي 23 ثم 13 ثم 0. القائمة النهائية [(8, 23), (10, 13), (13, 0)].', en: 'If your numbers differ: total is 31, velocities 8, 10, 13 — so remaining runs 23, then 13, then 0. The final list is [(8, 23), (10, 13), (13, 0)].' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-accountabilities',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في فريق يعمل بسكرم، حضر مدير الهندسة تخطيط السبرنت، فتح قائمة الأعمال المتراكمة وأسند لكل مطور مهامه بعينها للسبرنت، وأصبح يتابع يوميًا مخرج كل فرد على حدة. أي مبدأ من مبادئ سكرم يخرق ذلك؟',
        en: 'On a Scrum team, the engineering manager attends sprint planning, opens the product backlog, assigns each developer their exact tasks for the sprint, and now tracks every individual\u2019s output daily. Which Scrum principle does this violate?',
      },
      options: [
        { id: 'a', text: { ar: 'يجب أن يقود الاجتماع اليومي سيد سكرم — فالمشكلة أن المدير أداره هو', en: 'The Daily Scrum must be led by the Scrum Master — the problem is that the manager runs it' } },
        { id: 'b', text: { ar: 'المطورون ذاتيو الإدارة: لا أحد من خارج الفريق يكلف الأفراد — إسناد المدير يقتل التنظيم الذاتي ويحول سكرم إلى إدارة تفصيلية باجتماعات إضافية', en: 'Developers are self-managing: nobody outside the team assigns individuals — the manager kills self-organization and degrades Scrum into micromanagement with extra meetings' } },
        { id: 'c', text: { ar: 'المشكلة أن مالك المنتج لم يفعل ذلك هو — الأولوية وحدها تُحسم من مالك المنتج', en: 'The problem is that the Product Owner did not do it — only the Product Owner may set priority' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'المساءلات تقسم ماذا ولماذا وكيف والعملية — ولا تقول إن مديرًا خارجيًا يوزع مهام الأفراد.', en: 'The accountabilities split what/why, how, and the process — none says an outside manager hands out individual tasks.' },
        { ar: 'المطورون يلتزمون جماعيًا بهدف السبرنت ويقترحون بأنفسهم من يفعل ماذا — هذا هو التنظيم الذاتي.', en: 'The Developers collectively commit to the sprint goal and figure out among themselves who does what — that is self-organization.' },
        { ar: 'الفخ الموثق في الدرس بالضبط: عند إسناد المهام للأفراد وتتبع مخرجهم الشخصي تموت التنظيم الذاتي.', en: 'The lesson\u2019s documented pitfall, exactly: when tasks go to individuals and personal output is tracked, self-organization dies.' },
        { ar: 'الجواب: b — ولإصلاح السلوك: الإسناد للفريق، وفي الاجتماع اليومي سؤال عن العوائق لا عن الأفراد.', en: 'Answer: b — to repair the behavior: leave assignment to the team, and at the Daily Scrum ask about impediments, not individuals.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-done',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'البند في قائمة الأعمال لا يصير منتهيًا لأن أحدًا كتب شيفرة — بل حين يحقق تعريف ال____ المشترك والصريح: مُجمَّع، مُراجَع، مُختبَر، موثق، مدمج. (كلمة إنجليزية واحدة)',
        en: 'A backlog item is not done because someone wrote the code — it is done when it meets the shared, explicit Definition of ____: compiled, reviewed, tested, documented, integrated. (one English word)',
      },
      answer: 'Done',
      solution: 'Done',
      hints: [
        { ar: 'الاصطلاح إنجليزي ثابت في سكرم: Definition of ...', en: 'The fixed Scrum term in English: Definition of ...' },
        { ar: 'هو ما يمنع "منتهي" من أن يعني "منتهٍ على جهازي، غالبًا".', en: 'It is what stops "done" from meaning "done on my machine, probably".' },
        { ar: 'ضعفه هو كيف تراكم الفرق كومة عمل منتهٍ لا تشحن.', en: 'A weak one is how teams pile up finished work that never ships.' },
        { ar: 'الجواب: Done', en: 'Answer: Done' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "BACKLOG = [('login', 5), ('search', 8), ('export', 3), ('alerts', 2), ('reports', 13)]\nDONE = {1: ['login', 'export'], 2: ['search', 'alerts'], 3: ['reports']}\npts_of = dict(BACKLOG)\n\n# release backlog: الشريحة الثالثة بين قائمة المنتج وقائمة السبرنت — بنود إصدار بعينه\n# release backlog: the third scope between product and sprint backlog — one release's items\nrelease = ['login', 'search', 'export']\nrelease_pts = sum(pts_of[i] for i in release)\nprint('release points: %d' % release_pts)\n\ndone_in_release = [i for s in sorted(DONE) for i in DONE[s] if i in release]\nprint('release done: %d of %d points' % (sum(pts_of[i] for i in done_in_release), release_pts))\n\n# جرّب: أضف بندًا للقائمة (على سبيل 21 نقطة) وشاهد كيف يتحرك عمود المتبقي في كل السبرنتات\n# try: add a backlog item (say 21 points) and watch the remaining column shift in every sprint\n# جرّب: انقل 'search' من السبرنت 2 إلى 3 — أي رقم يتبدل ولمن يهم ذلك في المراجعة؟\n# try: move 'search' from sprint 2 to sprint 3 — which number flips, and who cares at the review?\n",
      prompt: {
        ar: 'الملعب يضيف الشريحة الثالثة التي ذكرها الدرس: قائمة إصدار بين قائمة المنتج وقائمة السبرنت — انظر كيف تُحسب نقاط الإصدار وتُقاس بضعفها المكتمل. ثم العب بالبيانات: بند جديد في القائمة، أو سبرنت يبتلع بندًا من تالٍ، وشاهد أي أرقام تتحرك. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox adds the third scope the lesson mentioned: a release backlog between the product backlog and the sprint backlog — watch release points compute and completion get measured against them. Then play with the data: a new backlog item, or a sprint swallowing the next one\u2019s item, and see which numbers move. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'قيم بيان أجايل الأربع مكتوبة بصيغة "الأيسر فوق الأيمن". ما الذي تقوله فعلًا؟',
            en: 'The four Agile Manifesto values read "X over Y". What do they actually claim?',
          },
          options: [
            { id: 'a', text: { ar: 'التوثيق والخطط والعمليات بلا قيمة فتُلغى', en: 'Documentation, plans and processes are worthless and should be dropped' } },
            { id: 'b', text: { ar: 'الجانبان لهما قيمة، لكن حين يتعارضان تثق بالأيسر: البرمجية العاملة، والحوار مع الزبون، والاستجابة للتغيير', en: 'Both sides have worth, but when they conflict you trust the left: working software, the customer conversation, responding to change' } },
            { id: 'c', text: { ar: 'الجانب الأيمن للمشاريع الكبيرة والأيسر للصغيرة', en: 'The right side is for big projects, the left for small ones' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'البيان عن ما تثق به عند التعارض لا إلغاء للجهة الأخرى: إذا خالفت الخطة البرمجية العاملة فصدّق البرمجية، وإذا خالف المستند حوار الزبون فعِش الحوار. قيم تفوق القواعد: مراسم بلا حلقات تغذية راجعة ضيّاع كامل للمعنى.',
            en: 'The manifesto states what to trust on conflict, not that the other side is worthless: when the plan disagrees with working software, believe the software; when a document disagrees with a customer conversation, have the conversation. Values outrank rules: ceremonies without tight feedback loops miss the point entirely.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ميزتان تتنافسان على نفس السبرنت. من يحسم التعادل في سكرم، ولماذا بشخص واحد؟',
            en: 'Two features compete for the same sprint. Who breaks the tie in Scrum, and why one person?',
          },
          options: [
            { id: 'a', text: { ar: 'سيد سكرم لأنه يملك العملية', en: 'The Scrum Master, because they own the process' } },
            { id: 'b', text: { ar: 'لجنة من أصحاب المصلحة لتمثيل الجميع', en: 'A committee of stakeholders so everyone is represented' } },
            { id: 'c', text: { ar: 'مالك المنتج — يمثل الزبون ويملك الأولوية، وشخص واحد يعني صوتًا واحدًا متماسكًا عن القيمة', en: 'The Product Owner — representing the customer and owning priority; one person means one coherent voice about value' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'مالك المنتج يملك ماذا ولماذا: يحفظ قائمة الأعمال المرتبة ويحسم الأولويات. لجنة ستصدر قرارات مذبذبة، وسيد سكرم يملك العملية لا القيمة — وحين يبدأ بإسناد المهام أو تتبع الأفراد يقتل التنظيم الذاتي.',
            en: 'The Product Owner owns the what and why: maintains the ordered backlog and decides priority. A committee would produce wavering calls, and the Scrum Master owns the process, not value — the moment they assign tasks or track individuals, self-organization dies.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي وصف صحيح يفرق مراجعة السبرنت عن الاسترجاعة؟',
            en: 'Which description correctly separates the Sprint Review from the Retrospective?',
          },
          options: [
            { id: 'a', text: { ar: 'كلاهما عرض للزيادة على الزبون بزوايا مختلفة', en: 'Both demo the increment to the customer from different angles' } },
            { id: 'b', text: { ar: 'المراجعة تغلق حلقة المنتج — الزيادة وملاحظات أصحاب المصلحة تعيد تشكيل القائمة؛ والاسترجاعة تغلق حلقة العملية — التزام بتحسين واحد أو اثنين', en: 'The review closes the product loop — the increment and stakeholder feedback reshape the backlog; the retrospective closes the process loop — a commitment to one or two improvements' } },
            { id: 'c', text: { ar: 'الاسترجاعة تقرير حالة يومي مكتوب والمراجعة شهري', en: 'The retrospective is a daily written status report and the review a monthly one' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حلقتان مختلفتان: مراجعة السبرنت للمنتج — تعرض الزيادة العاملة وتجمع ملاحظات تصلح المتطلبات بملامسة الواقع؛ والاسترجاعة للعملية نفسها — ما نُبقي وما نغيّر. تخطي إحداهما يعني التخلي عن حلقة تعلم أساسية.',
            en: 'Two distinct loops: the Sprint Review is for the product — demo the increment, gather feedback that fixes requirements against reality; the Retrospective is for the process itself — what to keep, what to change. Skipping either abandons a core learning loop.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل العاشر: سكرم يعد بزيادة "قابلة للشحن محتملًا" كل سبرنت لكنه لا يخبرك كيف تبنيها. أي ممارسة من درس الاختبار تجعل هذه الدعوى قابلة للفحص لا أمنية؟',
            en: 'From chapter ten: Scrum promises a "potentially shippable" increment each sprint but says nothing about how to build one. Which practice from the testing lesson makes that claim checkable rather than a wish?',
          },
          options: [
            { id: 'a', text: { ar: 'حزمة اختبارات آلية تشغَّل على الزيادة — نفسها التي تجعل كلمة "مُختبَر" في تعريف الإنجاز ذات معنى حقيقي', en: 'An automated test suite run against the increment — the same one that gives the Definition of Done\u2019s "tested" real meaning' } },
            { id: 'b', text: { ar: 'توثيق أوسع لكل بند قبل بداية السبرنت', en: 'More documentation per item before the sprint starts' } },
            { id: 'c', text: { ar: 'سبرنتات أطول حتى تكتمل الميزات أكمل', en: 'Longer sprints so features finish more completely' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'سكرم يورد الإيقاع ويترك الهندسة لك — والدرس العاشر أعطاك الأداة: اختبارات آلية تجعل "قابلة للشحن" دعوى تُفحص لحظة الادعاء لا في مرحلة متأخرة. وهي نفسها ما يجعل البند يستحق كلمة "مُختبَر" في تعريف الإنجاز.',
            en: 'Scrum supplies the rhythm and leaves engineering to you — the chapter-ten lesson handed you the tool: automated tests make "shippable" a claim you check the moment you make it, not in a late phase. They are exactly what earns the word "tested" in a Definition of Done.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'فريقنا لا يتبع أي عملية — نعمل بحرية تامة',
          right: 'بلا اختيارٍ واعٍ تملكون عملية عرضية غير موثقة — وهي عادة أغلى الأنواع: سمّوا عاداتكم في يوم الثلاثاء العادي أولًا ثم قرروا',
          note: {
            ar: 'العملية ليست أوراقًا بل عادات تحكم من يتحدث للزبون ومتى تُدمج ميزة نصف منتهية وماذا يحدث حين يُعثر على عيب. عملية لا تعمل إلا بأبطال منضبطين أمنية لا عملية — اجعل الشيء الصحيح هو الأسهل.',
            en: 'A process is not paperwork but the habits deciding who talks to the customer, when a half-finished feature integrates, and what happens when someone finds a bug. A process that only works with disciplined heroes is a wish — make the right thing the easy thing.',
          },
        },
        {
          wrong: 'الاجتماع اليومي تقرير حالة أرفعه للمدير: ماذا فعلت أمس وماذا سأفعل اليوم',
          right: 'اليومي للفريق: هل ما زلنا على مسار هدف السبرنت، وما الذي يعترضنا — والإسناد من الفريق لا من مدير',
          note: {
            ar: 'مسرح "ماذا فعلت أمس" يفرغ الحلقة من معناها. وأخطر من ذلك إسناد المهام للأفراد وتتبع مخرجهم الشخصي: تموت التنظيم الذاتي وينحل سكرم إلى إدارة تفصيلية باجتماعات إضافية — الفريق يلتزم جماعيًا بالهدف.',
            en: '"What I did yesterday" theater empties the loop of meaning. More dangerous still: assigning tasks to individuals and tracking personal output kills self-organization and degrades Scrum into micromanagement with extra meetings — the team commits collectively to the goal.',
          },
        },
        {
          wrong: 'البند منتهٍ لأن الشيفرة تعمل على جهازي — سنرى الاختبار والتوثيق لاحقًا',
          right: 'تعريف الإنجاز هو الحَكَم: مُجمَّع ومُراجَع ومُختبَر وموثق ومدمج — وإلا راكمتم كومة عمل "منتهٍ" لا تشحن',
          note: {
            ar: 'قائمة أعمال السبرنت تُحدَّث يوميًا والزيادة تعني برمجية عاملة تحقق التعريف. وضعف التعريف هو الكيفية التي تكتشف بها الفرق في المراجعة أن ميزات "المكتملة" تنهار على مدخل سيئ ولم تُراجع قط.',
            en: 'The sprint backlog updates daily and the Increment means working software meeting the definition. A weak definition is how teams discover at the review that "finished" features crash on bad input and were never reviewed.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'العملية طريقة متكررة تحوّل فكرة إلى برمجية منشورة ومصانة، والفريق الذي لا يختار واحدة يملك عملية عرضية أغلى الأنواع. نموذج العملية شكل مجرد، والعملية الحية نموذج + قرارات محلية ألفًا. المبدأ: اجعل الشيء الصحيح هو الأسهل.', en: 'A process is a repeatable way to turn an idea into deployed, maintained software; a team that never chooses one owns an accidental, most-expensive kind. The process model is the abstract shape; the lived process is the model plus a thousand local decisions. Principle: make the right thing the easy thing.' },
        { ar: 'ثقافتان: plan-driven تجمد المتطلبات وتزدهر حيث الخطأ عالي الثمن، وgrow-it تنمو بقطع صغيرة يصححها الواقع. بيان أجايل: برمجية عاملة فوق توثيق شامل، وتعاون زبون فوق عقود، واستجابة للتغيير فوق خطط — بيانٌ بما تثق به عند التعارض لا إلغاء للجهة الأخرى.', en: 'Two cultures: plan-driven freezes requirements and thrives where mistakes are costly; grow-it evolves small slices corrected by reality. The Agile Manifesto: working software over comprehensive documentation, customer collaboration over contracts, responding to change over plans — what to trust on conflict, not a demolition of the other side.' },
        { ar: 'سكرم إيقاع لا هندسة: سبرنت 1–4 أسابيع ينتج زيادة قابلة للشحن محتملًا؛ ثلاث مساءلات (مالك المنتج للقيمة، مطورون ذاتيو الإدارة للكيف، سيد سكرم للعملية)؛ أحداث كحلقات تغذية راجعة (تخطيط، يومي، مراجعة، استرجاعة)؛ وأصول بالتزاماتها — قائمة المنتج، قائمة السبرنت، والزيادة بتعريف الإنجاز. ودفتر السبرنت يقرأ السرعة والمتبقي أرقامًا لا أمنيات.', en: 'Scrum is rhythm, not engineering: a 1–4-week sprint producing a potentially shippable increment; three accountabilities (Product Owner owns value, self-managing Developers own the how, Scrum Master owns the process); events as feedback loops (planning, daily, review, retrospective); artifacts with commitments — product backlog, sprint backlog, increment with its Definition of Done. And the sprint ledger reads velocity and remaining as numbers, not wishes.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وحرك بندًا بين السبرنتات وشاهد أي رقم يتحرك. ثم اسأل نفسك: في آخر فريق عملت معه — من كان يحسم الأولوية فعلًا، وماذا كانت كلمة "منتهي" تعني هناك؟',
        en: 'Open the sandbox, move an item between sprints, and watch which number moves. Then ask yourself: on your last team — who actually settled priority, and what did the word "done" mean there?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch2.s1', pages: 'ص35-37 / pp.35-37' },
        { book: 'SWE', section: 'swe.ch2.s2', pages: 'ص38-40 / pp.38-40' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch2.s1', pages: 'ص35-37 / pp.35-37' },
    { book: 'SWE', section: 'swe.ch2.s2', pages: 'ص38-40 / pp.38-40' },
  ],
} satisfies Lesson;

export default lesson;
