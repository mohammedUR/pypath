// swe.ch3.l2 — استنباط احتياجات المستخدمين / Eliciting User Needs
// Sections: swe.ch3.s3 (ص69-72 / pp.69-72)
// Book: SWE — Chapter 3 "User Requirements" (part I, track P3).
// Runnable design: an interview-notes tagger — a fixed list of stakeholder notes,
// each classified into need / goal / constraint, with per-tag counts printed as
// short ASCII lines. One interview yields the transcript; the tagger shows its shape.
// Deterministic only: no input(), no exit(), no random, no unittest.main.

import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch3.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 3,
  title: {
    ar: 'استنباط احتياجات المستخدمين',
    en: 'Eliciting User Needs',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch3.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أسبوعان من المقابلات مع موظفي استقبال العيادة، وكلهم طلبوا الشيء نفسه: «بحث أسرع». ثم جلست مراقبة التصميم ساعة واحدة في زحمة الصباح فرأت الحقيقة: قائمة ورقية لـ «المرضى الصعبين» ملصقة بجانب كل كيبورد — النظام القديم لا يستطيع وسمهم، فاخترع الموظفون حلًّا ورقيًّا خاصًا بهم. لم يذكرها أحد في أي مقابلة؛ كانت «عادية» في نظرهم فاختبأت من الكلام. ساعة ملاحظة واحدة وجدت ما فاتته أسابيع من الأسئلة. هذا الدرس عن السبب — الاحتياجات لا تُسلَّم لك جاهزة، بل تُستخلص — وعن الأدوات التي تصل إلى ما لا يستطيع الناس قوله.',
        en: 'Two weeks of interviews with clinic front-desk staff, and everyone asked for the same thing: "faster search." Then a designer sat observing one morning rush for an hour and saw the truth: a paper list of "difficult patients" taped beside every keyboard — the old system could not flag them, so staff had invented their own paper workaround. Nobody mentioned it in any interview; it was too normal for them to see as worth saying. One hour of observation found what weeks of questions had missed. This lesson is about why — needs are not handed to you, they are drawn out — and about the techniques that reach what people cannot simply say.',
      },
    },
    {
      kind: 'predict',
      code: `said = "search should be faster"                                   # interview
did  = "keeps a paper list of difficult patients by the keyboard"  # observation
print("said:", said)
print("did: ", did)`,
      question: {
        ar: 'أي السطرين يكشف حاجة لم تُذكر في أسابيع من المقابلات — ولماذا لم تُذكر؟',
        en: 'Which of the two lines reveals a need that weeks of interviews never surfaced — and why was it never stated?',
      },
      reveal: {
        ar: 'السطر الثاني. المقابلة أعطتك رأيًا مصقولًا («أسرع»)؛ الملاحظة أعطتك الحاجة الحقيقية (وسم المرضى الصعبين). المعرفة الضمنية (tacit knowledge) لا تُنطَق: الورقة بديهية عند الموظفة فلا تراها شيئًا يستحق الذكر، ومن هنا جاء مثل القول ≠ الفعل. المقابلات تصوغ فرضيات، والملاحظة تختبرها — والاثنان معًا أول مثال على التثليث بين التقنيات.',
        en: 'The second line. The interview gave you a polished opinion ("faster"); observation gave you the real need (flagging difficult patients). Tacit knowledge does not get spoken: the paper list is so obvious to the clerk that she does not register it as worth mentioning — the say ≠ do gap. Interviews form hypotheses, observation tests them — and together they are the first example of triangulating techniques.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'ثلاث طبقات من الاحتياج',
        en: 'Three Layers of Needs',
      },
      chunks: [
        {
          ar: 'الاستنباط هو العمل الفعّال لسحب الاحتياجات التي لا يستطيع أصحاب المصلحة تسليمها لك جاهزة — كما يُخرج المعلم الجيد إجابة يعرفها الطالب ولم ينطق بها. صنّف الاحتياج بعلاقة صاحبه به: الاحتياج المصرَّح (stated) ما يطلبه المستخدم صراحة — «أريد البحث عن المواعيد باسم المريض» — وهو الأسهل جمعًا والأقرب إلى كون أنصاف حلول. الاحتياج الضمني (implied) ما يفترضه لأنه بديهي عنده — «بالطبع البحث لن يعرض مرضى عيادات أخرى» — فوفّته فيشعر المستخدمون أن النظام مكسور رغم أنه فعل كل ما قالوه. والاحتياج الكامن (latent) ما لا يعرف المستخدم أنه يريده إلا حين يراه، فيسرّه لحظة رؤيته: «يستطيع أن ينبّه للمرضى غير المؤكدين؟ لم أكن أعرف أنني أحتاجه، والآن لا أستطيع الاستغناء عنه».',
          en: 'Elicitation is the active work of drawing out needs stakeholders cannot simply hand you — the way a good teacher draws out an answer the student knows but has not stated. Classify a need by how its owner relates to it. Stated needs are what the user explicitly asks for — "I want to search appointments by patient name" — easiest to collect and most likely to be half-solutions. Implied needs are what the user assumes without saying because it is obvious to them — "of course the search must not show patients from other clinics." Miss these and users feel the system is broken even though it does everything they said. Latent needs are what users do not know they want until they see it: "It can flag unconfirmed patients? I did not know I needed that — now I cannot live without it."',
        },
        {
          ar: 'الفجوة بين المصرَّح والضمني هي موطن إخفاقات «النظام يعمل تقنيًا ويعزه الجميع»، والكامن موطن الميزة التنافسية: فريق يُرضي المصرَّح يبني شيئًا كافيًا، وفريق يكشف الضمني والكامن يبني شيئًا يُحب. نموذج Kano يجعل هذا عمليًا: ميزات must-be تُوازي الضمنية — غيابها إنهاء للعلاقة ووجودها لا يُشكر عليه (جدولة تفقد المواعيد فشلت مهما جملها). ميزات performance تُوازي المصرَّحة — الرضا يعلو بتحسينك لها (بحث أسرع). والمبهجات (delighters) تُوازي الكامنة — لا أحد يطلبها، ثم يتحمس لها بشدة. واحذر: المبهج يتقادم إلى توقع — أول نظام بتذكيرات آلية أدهش المستخدمين، واليوم نظام بلا تذكيرات «يبدو مكسورًا». لهذا يستمر الاستنباط طول التطوير: توقعات المستخدمين ترتفع مع كل منتج منافس.',
          en: 'The gap between stated and implied is where "it technically works but everyone hates it" failures live; latent needs are where competitive advantage lives. A team satisfying only stated needs builds something adequate; uncovering implied and latent needs builds something people love. The Kano model makes this practical: must-be features map to implied needs — their absence is a dealbreaker, their presence earns no credit (a scheduler that loses appointments has failed no matter how pretty). Performance features map to stated needs — satisfaction scales with how well you do them (faster search). Delighters map to latent needs — missed by nobody, loved when present. Beware: delighters decay into expectations — automatic reminders once delighted; today a scheduler without them feels broken. That is why elicitation continues throughout development: user expectations rise with every competing product.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'أدوات الاستنباط: لكل أداة بقعة عمياء',
        en: 'Elicitation Tools: Every Technique Has a Blind Spot',
      },
      chunks: [
        {
          ar: 'لا توجد تقنية واحدة تصل إلى الطبقات الثلاث، لذا يثلّث الفريق الماهر بينها. المقابلات: مباشرة ومرنة، ممتازة للمصرَّح وأهداف أصحاب المصلحة؛ ضعفها أن الناس بررون وتنسون ما يفعلونه فعلًا. الملاحظة (contextual inquiry): راقب المهمة الحقيقية في بيئتها — الورقة الملصقة، الحل الالتفافي، الإدخال المزدوج الذي لم يذكره أحد — ممتازة للضمني والكامن، لكنها غالية وقد يغيّر مشاهدة المراقب سلوك المُشاهَد. الاستبيانات: رخيصة على النطاق وجيدة لترتيب الأولويات بين خيارات معروفة وقياس شيوع الحاجة؛ وعديمة الفيمة لاكتشاف ما لم يخطر ببالك أن تسأل عنه. النماذج الأولية والعروض: أقوى أداة للكامن — من عجز عن وصف ما يريد يتفاعل دائمًا مع ما يراه؛ وخطرها أن المستخدم يتمسك باختياراتها العارضة.',
          en: 'No single technique reaches all three layers, so skilled teams triangulate. Interviews: direct and flexible, great for stated needs and stakeholder goals; the weakness is that people rationalize and misremember what they actually do. Observation (contextual inquiry): watch the real task in its real environment — the sticky note, the workaround, the double-entry nobody mentioned — superb for implied and tacit needs, but expensive, and being watched can change behavior. Surveys: cheap at scale, good for prioritizing known options and quantifying how common a need is; useless for discovering needs you never thought to ask about. Prototypes and demos: the single best tool for latent needs — a person who cannot describe what they want can still react to what is in front of them; the risk is users fixating on the prototype\u2019s incidental choices.',
        },
        {
          ar: 'وأدوات أكثر تُكمّل المشهد. العصف الذهني: جلسة كمية أولًا — لا فكرة تُنتقد ولا تُرشَّح مبكرًا، لأن التصفية المبكرة تقتل الفكرة الغريبة التي قد تكون الأهم — ثم جلسة نقد منفصلة برؤوس باردة، وإلا خرجت قائمة أمنيات لا متطلبات. لعب الأدوار: المطوّر يمثّل دور البرنامج والعميل «يستعمله» بالكلام، وتصحيحاته العفوية («لا، يجب أن يظهر جدول اليوم فورًا») هي متطلبات منطوقة — سجّل كل شيء أثناء الجلسة ثم افصل المتطلبات عن الأسئلة المفتوحة؛ ضعفها أنك تمشي فقط في التدفقات التي يفكر فيها العميل. ودراسة الأنظمة والبيانات القائمة: تذاكر الدعم، سجلات الاستخدام، منتجات المنافسين — ذهب صافٍ من احتياجات واحتكاكات موثقة بلا فلتر ذاكرة أحد. القاعدة الحاكمة: أكثر من تقنية دائمًا، لأن كل واحدة تصحح عمى الأخرى.',
          en: 'More tools complete the picture. Brainstorming: quantity first — no idea ruled out or criticized early, because premature filtering kills the unusual idea that turns out to matter — then a separate, cooler-headed pass to filter and prioritize; without that second pass a brainstorm yields a wish list, not requirements. Role play: the developer pretends to be the software while the customer walks through using it, and their spontaneous corrections ("no, today\u2019s schedule should show immediately") are requirements spoken aloud — write everything down, then split notes into requirements and open questions; the weakness is you only exercise workflows the customer thinks to try. Studying existing systems and data: support tickets, usage logs, competitor products — elicitation gold, records of real needs and real friction, unfiltered by anyone\u2019s memory. The governing rule: use several techniques, because each corrects a different blind spot.',
        },
        {
          ar: 'ويبقى منحرفان شهيران. الأول: المستخدمون وأصحاب المصلحة يسلمونك حلولًا — «أضف قائمة منسدلة». اقلب كل طلب من «ماذا نبني؟» إلى «ما الذي يسوء فعلًا الآن؟» وثبّت خط الأساس: ماذا يفعل الناس اليوم بلا الميزة؟ — («يحتفظون بقائمة ورقية بجانب الكيبورد») — فهو يثبت أن المشكلة حقيقية ويصير مسطرة الحكم: على الحل أن يتفوق على خط الأساس، لا على الكمال. واحذر الحزمة المبعثرة (grab-bag): تفويض غامض مثل «افعل شيئًا بشأن الجدولة» بلا مشكلة قائدة، فلا أحد يعرف بدايتها ولا نهايتها، وبهما تنفجر النطاق؛ العلاج تضييقها إلى نقطة ألم واحدة. الثاني: الافتراضات — كل افتراض غير مكتوب داخل قصة مخاطرة غير متتبعة ستبني فوقه. اكتبه لحظة تلحظه («نفترض أن الأطباء لا يعدّلون مواعيد بعضهم»)، ثم حوّله إلى سؤال للعميل: الافتراض مجرد سؤال لم تطرحه بعد. وإن تعذّر توضيحه الآن، فذلك إشارة أولويات: أجّل العمل المعتمد عليه واقضِ التكرار في قصص تقف على أرض أكثر صلابة.',
          en: 'Two traps remain. First: users hand you solutions — "add a dropdown." Flip every request from "what should we build?" back to "what is going wrong?", and pin the baseline — what do users do today without it? ("they keep a paper list beside the keyboard") — it proves the problem is real and sets the bar: a fix only has to beat it, not perfection. Beware the grab-bag: a vague mandate like "do something about scheduling" with no driving problem — scope explodes; the cure is narrowing to one concrete pain point. Second: assumptions — every unstated assumption in a story is untracked risk you build on. Write it down when you notice it ("we assume clinicians never edit each other\u2019s appointments"), then turn it into a question: an assumption is a question you have not asked yet. If it cannot be clarified now, defer the dependent work.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'وسّام ملاحظات المقابلة: need / goal / constraint',
        en: 'The Interview-Notes Tagger: need / goal / constraint',
      },
      code: `notes = [
    {"who": "clerk",      "text": "search appointments by patient name", "tag": "need"},
    {"who": "manager",    "text": "cut check-in time to 15 seconds",     "tag": "goal"},
    {"who": "compliance", "text": "keep the audit log for 7 years",      "tag": "constraint"},
    {"who": "clerk",      "text": "flag difficult patients",             "tag": "need"},
    {"who": "sponsor",    "text": "keep the pilot under 20000 USD",      "tag": "constraint"},
    {"who": "clerk",      "text": "never show other clinics' patients",  "tag": "need"},
]

counts = {"need": 0, "goal": 0, "constraint": 0}
for n in notes:
    counts[n["tag"]] += 1
    print(n["who"], "->", n["tag"])

print("need:", counts["need"])
print("goal:", counts["goal"])
print("constraint:", counts["constraint"])`,
      explanation: {
        ar: 'ثلاث وسوم تجيب عن ثلاثة أسئلة يطرحها كل تصريح من أصحاب المصلحة: need تطلب قدرة يوفرها النظام («وسّم المرضى الصعبين»)؛ goal تطلب نتيجة قابلة للقياس يريدها إنسان («تسجيل وصول في 15 ثانية»)؛ constraint تقيّد الحل بقانون أو ميزانية أو سياسة («سجل تدقيق 7 سنوات»). الأعداد تكشف شكل اللقاء: الامتثال لا يتكلم إلا بالقيود، والكاتب لا يتكلم إلا بالحاجات — ولا كلمة واحدة عن الكامن، لأن الكامن لا يُقال أبدًا؛ إنه ما ستصطاده النماذج والملاحظة. رقّم ملاحظاتك بهذه الوسوم وستكشف بسرعة من يتكلم عن ماذا، وأين الفجوات.',
        en: 'Three tags answer three questions every stakeholder utterance poses. A need asks for a capability the system must provide ("flag difficult patients"). A goal asks for a measurable outcome a person wants ("check-in in 15 seconds"). A constraint bounds the solution with law, budget, or policy ("audit log kept 7 years"). The counts reveal the shape of the session: compliance speaks only in constraints, the clerk only in needs — and not one word about latent needs, because latent needs are never spoken; they are what prototypes and observation hunt. Tag your own notes this way and you quickly see who is talking about what, and where the gaps are.',
      },
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l2.ex1',
      exKind: 'write_code',
      prompt: {
        ar: 'أكمل دالة count_tags: تستقبل قائمة الملاحظات وتُرجع قاموسًا يربط كل وسم بعدد الملاحظات التي تحمله، ثم تطبع الأسطر الثلاثة كما في الهيكل: need ثم goal ثم constraint.',
        en: 'Complete the count_tags function: take the list of notes and return a dict mapping each tag to how many notes carry it, then print the three lines exactly as in the starter: need, then goal, then constraint.',
      },
      starterCode: `notes = [
    {"who": "clerk",      "text": "search by phone number",            "tag": "need"},
    {"who": "nurse",      "text": "see today's schedule at a glance",  "tag": "need"},
    {"who": "manager",    "text": "check-in under 15 seconds",         "tag": "goal"},
    {"who": "compliance", "text": "log retained for 7 years",          "tag": "constraint"},
    {"who": "manager",    "text": "zero missed handoffs per shift",    "tag": "goal"},
    {"who": "sponsor",    "text": "budget capped at 20000 USD",        "tag": "constraint"},
    {"who": "clerk",      "text": "flag patients needing interpreter", "tag": "need"},
]

def count_tags(records):
    # Return a dict mapping each tag to how many notes carry it.
    ...

result = count_tags(notes)
print("need:", result["need"])
print("goal:", result["goal"])
print("constraint:", result["constraint"])`,
      solution: `notes = [
    {"who": "clerk",      "text": "search by phone number",            "tag": "need"},
    {"who": "nurse",      "text": "see today's schedule at a glance",  "tag": "need"},
    {"who": "manager",    "text": "check-in under 15 seconds",         "tag": "goal"},
    {"who": "compliance", "text": "log retained for 7 years",          "tag": "constraint"},
    {"who": "manager",    "text": "zero missed handoffs per shift",    "tag": "goal"},
    {"who": "sponsor",    "text": "budget capped at 20000 USD",        "tag": "constraint"},
    {"who": "clerk",      "text": "flag patients needing interpreter", "tag": "need"},
]

def count_tags(records):
    counts = {}
    for n in records:
        counts[n["tag"]] = counts.get(n["tag"], 0) + 1
    return counts

result = count_tags(notes)
print("need:", result["need"])
print("goal:", result["goal"])
print("constraint:", result["constraint"])`,
      tests: [
        {
          id: 't-dict',
          name: { ar: 'القاموس المُرجَع', en: 'returned dict' },
          code: "assert count_tags(notes) == {'need': 3, 'goal': 2, 'constraint': 2}, 'expected need 3, goal 2, constraint 2 | got %r' % count_tags(notes)",
          expected: "{'need': 3, 'goal': 2, 'constraint': 2}",
        },
        {
          id: 't-goal',
          name: { ar: 'سطر goal', en: 'goal line' },
          code: "assert 'goal: 2' in __learner_output__, 'expected: goal: 2 | actual: %r' % __learner_output__",
          expected: 'goal: 2',
        },
        {
          id: 't-constraint',
          name: { ar: 'سطر constraint', en: 'constraint line' },
          code: "assert 'constraint: 2' in __learner_output__, 'expected: constraint: 2 | actual: %r' % __learner_output__",
          expected: 'constraint: 2',
        },
      ],
      hints: [
        {
          ar: 'قاموس فارغ + حلقة واحدة تكفيان؛ لا تحتاج أن تعرف الوسوم مسبقًا.',
          en: 'An empty dict plus a single loop is enough; you do not need to know the tags in advance.',
        },
        {
          ar: 'النمط: لكل ملاحظة اقرأ وسمها بـ n["tag"] وازداد العدّاد الخاص به في القاموس.',
          en: 'The pattern: for each note read its tag with n["tag"] and increment that tag\u2019s counter in the dict.',
        },
        {
          ar: 'dict.get يحل مشكلة المفتاح الجديد: counts.get(tag, 0) ترجع 0 إذا لم يظهر الوسم بعد.',
          en: 'dict.get solves the new-key problem: counts.get(tag, 0) returns 0 if the tag has not appeared yet.',
        },
        {
          ar: 'قريب من الحل: counts[n["tag"]] = counts.get(n["tag"], 0) + 1 داخل الحلقة، ثم return counts بعدها.',
          en: 'Near-solution: counts[n["tag"]] = counts.get(n["tag"], 0) + 1 inside the loop, then return counts after it.',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l2.ex2',
      exKind: 'mcq',
      prompt: {
        ar: 'تريد اكتشاف الاحتياجات الكامنة (latent) — التي لا يعيها المستخدمون قبل أن يروها. ما أنسب تقنية استنباط؟',
        en: 'You want to surface latent needs — ones users are unaware of until they see them. Which elicitation technique fits best?',
      },
      options: [
        {
          id: 'a',
          text: {
            ar: 'استبيان واسع يوزَّع على مئات المستخدمين',
            en: 'A wide survey distributed to hundreds of users',
          },
        },
        {
          id: 'b',
          text: {
            ar: 'نموذج أولي أو عرض يُوضع أمام المستخدم ورصد ردة فعله',
            en: 'A prototype or demo placed in front of the user, watching the reaction',
          },
        },
        {
          id: 'c',
          text: {
            ar: 'مقابلة أطول وأكثر تفصيلًا مع المستخدم نفسه',
            en: 'A longer, more detailed interview with the same user',
          },
        },
        {
          id: 'd',
          text: {
            ar: 'قراءة شيفرة النظام العتيق سطرًا سطرًا',
            en: 'Reading the legacy system\u2019s code line by line',
          },
        },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        {
          ar: 'المشكلة في تعريف latent نفسها: المستخدم لا يعرف ما يريده — فكيف يسأله؟',
          en: 'The problem is in the definition of latent: the user does not know what they want — so how would asking help?',
        },
        {
          ar: 'الاستبيان يكتشف فقط ما فكرت أن تسأل عنه، والمقابلة الأطول تزيد تفاصيل المصرَّح لا الكامن.',
          en: 'A survey only finds what you already thought to ask about; a longer interview adds detail to stated needs, not latent ones.',
        },
        {
          ar: 'من لا يصف ما يريد يستطيع دائمًا أن يتفاعل مع ما يُوضع أمامه.',
          en: 'A person who cannot describe what they want can almost always react to what is put in front of them.',
        },
        {
          ar: 'النموذج الأولي: أقوى أداة للاحتياجات الكامنة — ردة الفعل هي الإجابة.',
          en: 'The prototype: the best tool for latent needs — the reaction is the answer.',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l2.ex3',
      exKind: 'numeric',
      prompt: {
        ar: 'في لقاء جمعنا فيه 5 ملاحظات موسومة: «بحث بالاسم» (need)، «لا عرض لمرضى عيادات أخرى» (need)، «تكلفة أقل من 20000» (constraint)، «تسجيل دخول ببطاقة» (need)، «سجلات محفوظة 7 سنوات» (constraint). كم constraint سجّل العدّاد؟',
        en: 'A session produced 5 tagged notes: "search by name" (need), "no display of other clinics\u2019 patients" (need), "cost under 20000" (constraint), "card-based login" (need), "logs retained 7 years" (constraint). How many constraints did the counter record?',
      },
      answer: '2',
      solution: '2',
      hints: [
        {
          ar: 'القيد (constraint) يقيّد الحل بقانون أو ميزانية أو سياسة — لا يطلب قدرة.',
          en: 'A constraint bounds the solution by law, budget, or policy — it does not request a capability.',
        },
        {
          ar: 'الملاحظات الثلاث الأخريات تطلب قدرات — فهي need لا constraint.',
          en: 'The other three notes request capabilities — they are needs, not constraints.',
        },
        {
          ar: 'اعُد المواسَمات constraint في القائمة حرفيًا.',
          en: 'Count the notes literally tagged constraint in the list.',
        },
        {
          ar: 'الجواب 2.',
          en: 'The answer is 2.',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l2.ex4',
      exKind: 'fill_blank',
      prompt: {
        ar: 'أكمل المصطلح: الاحتياج الذي لا يعرف المستخدم أنه يريده إلا حين يراه — ويسرّه لحظة رؤيته — يسمى احتياج ________ (طبقة Kano المقابلة لها المبهجات delighters). اكتب الكلمة الإنجليزية كلمة واحدة.',
        en: 'Complete the term: a need users do not know they have until they see it — and that delights them the moment they do — is called a ________ need (the layer Kano maps to delighters). Write the single English word.',
      },
      answer: 'latent',
      solution: 'latent',
      hints: [
        {
          ar: 'الطبقات الثلاث في الدرس: stated وimplied وطبقة ثالثة.',
          en: 'The lesson named three layers: stated, implied, and a third one.',
        },
        {
          ar: 'المصرَّح يُقال، والضمني يُفترض، والثالث يبقى مخفيًا حتى يُرى.',
          en: 'Stated is spoken, implied is assumed, and the third stays hidden until seen.',
        },
        {
          ar: 'ساعة الملاحظة في حالة العيادة صطاد حاجة من هذا النوع.',
          en: 'The one hour of observation in the clinic case caught a need of exactly this kind.',
        },
        {
          ar: 'الكلمة latent.',
          en: 'The word is latent.',
        },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `# مسجّل ملاحظاتك: ضع ملاحظات حقيقية من آخر حديث مع مستخدم، وسّمها، وراقب الأعداد.
notes = [
    {"who": "you", "text": "...", "tag": "need"},       # need | goal | constraint
    {"who": "you", "text": "...", "tag": "goal"},
]

def count_tags(records):
    counts = {}
    for n in records:
        counts[n["tag"]] = counts.get(n["tag"], 0) + 1
    return counts

counts = count_tags(notes)
for tag in sorted(counts):
    print(tag, ":", counts[tag])
print("total notes:", len(notes))

# جرّب:
# 1) استبدل "..." بملاحظة سمعتها فعلًا من مستخدم حقيقي هذه الأسبوع.
# 2) هل يمكن أن تكون الملاحظة الواحدة need عند شخص وconstraint عند آخر؟
# 3) أي وسمٍ يغيب دائمًا عن مقابلاتك؟ (تلميح: إن غاب الكامن فهذا طبيعي — لا يُقال).`,
      prompt: {
        ar: 'حوّل الدرس إلى عادة: استبدل «...» بملاحظات حقيقية سمعتها من مستخدم — من عملك أو تطبيق تستخدمه — وسّم كل واحدة، وراقب كيف تتوزع الأعداد. السؤال الأهم: أي وسمٍ يغيب دائمًا عن حديثك مع المستخدمين؟ إن غاب الكامن فهذا طبيعي (لا يُقال)، لكن إن غاب constraint فربما لم تسأل عن القيود بعد.',
        en: 'Turn the lesson into a habit: replace "..." with real notes you actually heard from a user — from work or an app you use — tag each one, and watch how the counts distribute. The key question: which tag is always missing from your user conversations? If it is latent, that is natural (it never gets said); but if it is constraint, maybe you have not asked about limits yet.',
      },
    },
    {
      kind: 'quiz',
      id: 'swe.ch3.l2.quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'يقول مديرك: «نجمع كل المتطلبات أولًا ونجمّدها حتى لا يتضخم النطاق». وفق مثلث الحدود (الفصل 1) وما رأيته في هذا الدرس، أين ثغرة الخطة؟',
            en: 'Your manager says: "We gather all requirements up front and freeze them so scope stays under control." Given the iron triangle (Chapter 1) and this lesson, where is the flaw?',
          },
          options: [
            {
              id: 'a',
              text: {
                ar: 'لا ثغرة: التجميد المبكر يخفض التكلفة والوقت معًا',
                en: 'No flaw: freezing early cuts both cost and time',
              },
            },
            {
              id: 'b',
              text: {
                ar: 'الاحتياجات تُكتشف بالاستخدام والتغذية الراجعة؛ التجميد المبكر يخفي افتراضات تنفجر لاحقًا كتكاليف تغيير متأخرة',
                en: 'Needs are discovered through use and feedback; freezing early hides assumptions that later explode as late-change costs',
              },
            },
            {
              id: 'c',
              text: {
                ar: 'المثلث يخص إدارة المشروع ولا علاقة له بالمطلبات',
                en: 'The iron triangle concerns project management and has nothing to do with requirements',
              },
            },
            {
              id: 'd',
              text: {
                ar: 'النطاق هو الضلع الوحيد الذي يؤثر على الجودة',
                en: 'Scope is the only triangle side that affects quality',
              },
            },
          ],
          answer: 'b',
          explanation: {
            ar: 'في مثلث الحدود: الضغط على النطاق أو الجدول بلا تغذية راجعة يبيعك وهمًا. المتطلبات تُكتشف لا تُجمع — كل جولة بناء وتحقق تكشف احتياجات وسوء فهم جديدة، وتجميد المبكر يجعل اكتشافها لاحقًا أغلى (تغيير متأخر = تكلفة أعلى). الجواب: جرعات متصلة + أولويات، لا مواصفة مجمدة.',
            en: 'On the iron triangle: squeezing scope or schedule without feedback buys an illusion. Requirements are discovered, not collected — every round of building and validating surfaces new needs and misunderstandings, and freezing early makes discovering them later more expensive (late change = higher cost). The fix: continuous small doses with priorities, not a frozen specification.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: '«بالطبع البحث لن يعرض مرضى عيادات أخرى» — هذا أي نوع من الاحتياج؟',
            en: '"Of course the search must not show patients from other clinics" — what kind of need is this?',
          },
          options: [
            { id: 'a', text: { ar: 'مصرَّح (stated)', en: 'Stated' } },
            { id: 'b', text: { ar: 'كامن (latent)', en: 'Latent' } },
            { id: 'c', text: { ar: 'ضمني (implied)', en: 'Implied' } },
            { id: 'd', text: { ar: 'قيد تنظيمي خارج تعبير المستخدم', en: 'A regulatory constraint outside the user\u2019s expression' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'الضمني ما يفترضه المستخدم لأنه بديهي عنده فلا يقوله. تفويته يجعل المستخدمين يشعرون أن النظام مكسور رغم أنه نفّذ كل ما قالوه — وهذه الفجوة موطن إخفاقات «يعمل تقنيًا ويعزه الجميع».',
            en: 'Implied needs are what users assume without saying because it is obvious to them. Missing them makes users feel the system is broken even though it did everything they said — that gap is where "technically works but everyone hates it" failures live.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما أعظم نقطة عمياء في المقابلات وحدها؟',
            en: 'What is the greatest blind spot of interviews on their own?',
          },
          options: [
            { id: 'a', text: { ar: 'تكلفتها العالية مقارنة بالاستبيانات', en: 'Their high cost compared with surveys' } },
            {
              id: 'b',
              text: {
                ar: 'الناس بررون ويعدّلون ذكرياتهم: ما يقولونه أنهم يفعلون يختلف عما يفعلونه فعلًا',
                en: 'People rationalize and misremember: what they say they do differs from what they actually do',
              },
            },
            { id: 'c', text: { ar: 'لا تصلح إلا مع الخبراء التقنيين', en: 'They only work with technical experts' } },
            { id: 'd', text: { ar: 'تتطلب نموذجًا أوليًا إلزاميًا قبلها', en: 'They require a mandatory prototype first' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المقابلات ممتازة للمصرَّح والأهداف، لكنها تعتمد على الذاكرة والوعي الذاتي — وكلاهما يخدع. لهذا تُستخدم المقابلات لتكوين الفرضيات والملاحظة لاختبارها، وكل تقنية تصحح عمى الأخرى (تثليث).',
            en: 'Interviews are great for stated needs and goals, but they rely on memory and self-awareness — both of which deceive. That is why interviews form hypotheses and observation tests them, and each technique corrects another\u2019s blind spot (triangulation).',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'كانت التذكيرات الآلية مفاجأة سارة يومًا؛ اليوم نظام جدولة بلا تذكيرات «يبدو مكسورًا». ما اسم هذا التحول؟',
            en: 'Automatic reminders once delighted users; today a scheduler without them "feels broken." What is this shift called?',
          },
          options: [
            { id: 'a', text: { ar: 'تفوّق تنافسي دائم', en: 'A permanent competitive advantage' } },
            {
              id: 'b',
              text: {
                ar: 'انحلال المبهج (delighter) إلى توقع أساسي (must-be)',
                en: 'A delighter decaying into a must-be expectation',
              },
            },
            { id: 'c', text: { ar: 'تحول حاجة مصرَّحة إلى كامنة', en: 'A stated need turning latent' } },
            { id: 'd', text: { ar: 'تقادم تقني للنظام', en: 'Technical obsolescence of the system' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المبهجات تتقادم إلى must-be مع ارتفاع توقعات المستخدمين وتحسّن المنافسين — ولهذا يستمر الاستنباط طول عمر المنتج: ما أدهش أمس أصبح الحد الأدنى اليوم، وما تبحث عنه اليوم هو مبهجات الجولة القادمة.',
            en: 'Delighters decay into must-be expectations as user expectations rise and competitors improve — which is why elicitation continues for the product\u2019s whole life: what delighted yesterday is today\u2019s minimum, and today\u2019s hunt is for next release\u2019s delighters.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'المستخدم قال ما يريد في المقابلة بوضوح — المقابلة كافية، لا داعي لضياع وقت في الملاحظة.',
          right: 'ما يقوله الناس وما يفعلونه يختلفان: المقابلة أعطتك رأيًا مصقولًا، والملاحظة وحدها ترى الورقة الملصقة بجانب الكيبورد. المقابلات تصوغ الفرضيات والملاحظة تختبرها — استخدمهما معًا.',
          note: {
            ar: 'ساعة ملاحظة واحدة وجدت في حالة العيادة ما فاتته أسابيع من المقابلات.',
            en: 'One hour of observation found what weeks of interviews had missed.',
          },
        },
        {
          wrong: 'طلب المدير «افعل شيئًا بشأن الجدولة» — طلب واسع لكنه واضح بما يكفي، فلنبدأ التصميم فورًا.',
          right: 'هذه حزمة مبعثرة (grab-bag) بلا مشكلة قائدة: لا بداية لها ولا نهاية، وبهذا التنفجر النطاق. اقلبها إلى سؤال «ما الذي يسوء فعلًا؟» وثبّت خط الأساس، ثم ضيّقها إلى نقطة ألم واحدة قبل أي تصميم.',
          note: {
            ar: 'الحل يُحكم عليه بالتفوق على خط الأساس لا على الكمال — وهذا يصغّر النطاق تلقائيًا.',
            en: 'A fix is judged against the baseline, not perfection — which shrinks scope automatically.',
          },
        },
        {
          wrong: 'افترضنا أن الأطباء لا يعدّلون مواعيد بعضهم — بديهي، لا داعي لكتابته أو سؤاله.',
          right: 'الافتراض غير المكتوب مخاطرة غير متتبعة ستبني فوقها. اكتبه لحظة تلحظه وحوّله إلى سؤال للعميل في اللقاء القادم — الافتراض مجرد سؤال لم تطرحه بعد. وإن تعذّر توضيحه، أجّل العمل المعتمد عليه.',
          note: {
            ar: 'كل قصة تحمل افتراضات صامتة هي قصة تقف على أرض لا أحد فحصها.',
            en: 'Every story carrying silent assumptions is a story standing on ground nobody inspected.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'الاستنباط سحبٌ لا جمع: احتياجات مصرَّحة (تُقال وتخفي أنصاف حلول)، وضمنية (تُفترض وتُفقَد فتشعر المستخدمين بالانكسار)، وكامنة (لا تُعرف قبل الرؤية — وحيث تُكسب المحبة والتفوق).',
          en: 'Elicitation is drawing out, not gathering: stated needs (spoken, often half-solutions), implied needs (assumed, missed so users feel broken), and latent needs (unknown until seen — where love and advantage live).',
        },
        {
          ar: 'لكل تقنية بقعة عمياء: المقابلات لصياغة الفرضيات، الملاحظة لاختبارها وصرح الكامن، النماذج لكشف النقص عبر ردة الفعل، الاستبيانات لترتيب الأولويات — فثلّث دائمًا بينها.',
          en: 'Every technique has a blind spot: interviews form hypotheses, observation tests them and exposes tacit workarounds, prototypes reveal omissions through reaction, surveys prioritize — so always triangulate.',
        },
        {
          ar: 'الطلب كحلٍّ يخفي المشكلة: اقلبه إلى «ما الذي يسوء؟»، وسندّه إلى خط الأساس، واحذر الحزم المبعثرة، واكتب افتراضاتك — فالافتراض سؤال لم تطرحه بعد.',
          en: 'A request framed as a solution hides the problem: flip it to "what is going wrong?", anchor it to a baseline, beware grab-bags, and write your assumptions down — an assumption is just a question you have not asked yet.',
        },
      ],
      reflectPrompt: {
        ar: 'استذكر آخر حديث لك مع مستخدم — حقيقي أو حتى شكوى تطبيق قرأتها: ما الاحتياج الذي كان سيظهر بالملاحظة لا بالسؤال؟ وما الافتراض الذي تحمله أنت في ذهنك ولم تحوّله إلى سؤال بعد؟',
        en: 'Recall your last conversation with a user — real, or even an app complaint you read: which need would have shown up in observation, not in questions? And which assumption are you carrying that you have not yet turned into a question?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch3.s3', pages: 'ص69-72 / pp.69-72' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch3.s3', pages: 'ص69-72 / pp.69-72' },
  ],
} satisfies Lesson;

export default lesson;
