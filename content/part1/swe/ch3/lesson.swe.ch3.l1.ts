// swe.ch3.l1 — ما المتطلب؟ وكيف تنضج المتطلبات / What Is a Requirement and How Requirements Mature
// Sections: swe.ch3.s1 (ص64-67 / pp.64-67) · swe.ch3.s2 (ص68-69 / pp.68-69)
// Book: SWE — Chapter 3 "User Requirements" (part I, track P3).
// Runnable design: a requirements ledger — a fixed list of requirement records
// (id, kind functional/non-functional, status draft/confirmed) with counters and
// filters printed as short ASCII lines. Maturity = a draft that earns a measurable
// fit criterion and becomes confirmed.
// Deterministic only: no input(), no exit(), no random, no unittest.main.

import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch3.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 3,
  title: {
    ar: 'ما المتطلب؟ وكيف تنضج المتطلبات',
    en: 'What Is a Requirement and How Requirements Mature',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch2.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'ستة أشهر من العمل، اختبارات خضراء كل أسبوع، عرض تقديمي مصقول — ثم تقول موظفة الاستقبال في أول جلسة تجربة: «هذا جميل… لكنني لا أستطيع أن أرى من المرضى تأخر موعده». الفريق لم يبنِ الميزة بشكل سيء؛ بنى الميزة الصحيحة للسؤال الخطأ. قاعدة بيانات سيئة تُصلَّح بإعادة هيكلة في أسبوع، أما ستة أشهر من ميزة خاطئة فلا تُستعاد رخيصًا: الكلفة ليست الشيفرة الضائعة وحدها، بل ثقة الأشخاص الذين أخبروك بما يريدون ورأوك تخطئه. هذا الدرس يفتح الفصل الذي يضيّق الفجوة بين ما يحتاجه الناس وما تظن أنت أنهم يحتاجونه — فجوة لا تُغلق أبدًا بالكامل، وتُدار بالانضباط لا بالحظ.',
        en: 'Six months of work, green tests every week, a polished demo — and then at the first user session a front-desk clerk says: "This is nice... but I cannot see which patients are running late." The team did not build the feature badly; they built the right feature for the wrong question. A bad database is fixed by a refactor in a week; six months on the wrong feature is never recovered cheaply: the cost is not just the wasted code but the trust of the people who told you what they wanted and watched you miss it. This lesson opens the chapter that narrows the gap between what people need and what you believe they need — a gap that never fully closes, and is managed by discipline, not luck.',
      },
    },
    {
      kind: 'predict',
      code: `req_a = "add a dropdown to pick the clinic"
req_b = "pick one clinic from a short list without typos, in under 5 seconds"
print("A:", req_a)
print("B:", req_b)`,
      question: {
        ar: 'أي العبارتين متطلب حقيقي، وأيهما حلٌّ متنكّر في هيئة حاجة؟ ولماذا B أقوى من عبارة مثل «يجب أن يكون الاختيار سهلًا»؟',
        en: 'Which of the two statements is a real requirement, and which is a solution disguised as a need? And why is B stronger than something like "picking should be easy"?',
      },
      reveal: {
        ar: 'A يصف كيف: أداة واجهة بعينها — تصميم يرتدي قميص حاجة. B يصف ماذا ولماذا بمعيار قابل للقياس (قائمة قصيرة، بلا أخطاء، أقل من 5 ثوانٍ)، ولهذا يفتح الباب لتصميمات أفضل من القائمة المنسدلة: بحث سريع، مسح بطاقة، تذكّر آخر عيادة. المتطلب ليس أول حلٍّ يخطر لطلبك؛ المتطلب هو الحاجة تحت الحل — وهذا الفرق هو مهارة الدرس كلها.',
        en: 'A describes how: one specific interface widget — a design wearing the shirt of a need. B describes what and why with a measurable fit criterion (short list, no typos, under 5 seconds), which is why it leaves room for designs better than the dropdown: quick search, card scan, remembering the last clinic. A requirement is not the first solution you are handed; it is the need underneath the solution — and that distinction is the whole skill of this lesson.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'المتطلب: ماذا ولماذا، لا كيف',
        en: 'A Requirement: What and Why, Not How',
      },
      chunks: [
        {
          ar: 'المتطلب عبارة متفق عليها تصف حاجة يملكها صاحب مصلحة من النظام: سلوك يجب أن يقوم به النظام، أو خاصية يجب أن يمتلكها وهو يقوم به. تبدو الجملة بسيطة، والمتعة كلها مختبئة في بساطتها: المتطلبات تُكتب بلغة طبيعية، بواسطة بشر ومن أجل بشر، عن احتياجات لا يستطيع أصحابها أحيانًا التعبير عنها. فهي معًا أهم مصنّف في المشروع وأقلّه دقة، ومهارة هذا الفصل هي استخراج الدقة من الغموض دون تظاهر بأن الغموض زال. لاحظ نصف التعريف الثاني: المتطلب ليس تصميمًا. حين يقول المستخدم «أضف قائمة منسدلة» فقد سلّمك تصميمًا يرتدي قميص حاجة. وظيفتك أن تتجاوزه إلى الحاجة تحته — «أحتاج اختيار عيادة واحدة من قائمة قصيرة دون أخطاء إملائية» — لأن الحاجة تقبل تصميمات أفضل مما تخيّله المستخدم. عمل المتطلبات هو أساسًا انضباط عدم قبول أول حلٍّ مُقدَّم وكأنه المشكلة.',
          en: 'A requirement is an agreed statement of a need a stakeholder has of the system: a behavior the system must exhibit, or a property it must possess while behaving. It sounds simple, and the trouble hides in that simplicity: requirements are written in natural language, by and for humans, about needs those humans often cannot articulate — simultaneously the most important artifact in a project and the least precise. The skill of this chapter is extracting precision from ambiguity without pretending the ambiguity is gone. Note the second half: a requirement is not a design. "Add a dropdown" is a design dressed up as a need; reach past it to "I need to pick one clinic from a short list without typos", because the need admits better designs. Requirements work is the discipline of not accepting the first solution offered as the problem.',
        },
        {
          ar: 'تُفرز المتطلبات إلى عائلتين لأنهما تُستنبط وتُكتب وتُختبر بطرق مختلفة. المتطلب الوظيفي (functional) يصف سلوكًا: شيئًا يفعله النظام استجابةً لمدخل — «عند تسجيل وصول المريض، يعلّم النظام موعده بأنه حضر ويُخطر الطبيب المسؤول». غالبًا تختبره بمثال محدد: عند هذا المدخل، توقّع هذا الخرج. أما المتطلب اللاوظيفي — واسمه الأدق متطلب الجودة (quality) — فيصف خاصية يجب أن يمتلكها النظام وهو يتصرف: ما مدى سرعته، أمانه، توفّره، سهولة استخدامه. مثل: «يجب أن يكتمل تسجيل الوصول في أقل من ثانية لـ 95% من الطلبات عند نشاط 200 عيادة». متطلبات الجودة هي الأكثر إخفاقًا عند الفرق لأنها سهلة الصياغة الغامضة («سريع») وصعبة الصياغة القابلة للاختبار. الانضباط هنا: ألصق بكل متطلب جودة معيار قياس (fit criterion) قابلًا للقياس حتى يصبح «الانتهاء» حقيقة لا جدالًا. وهي أيضًا الأكثر خفاءً حتى تُنقض: لا أحد يكتب قصة عنوانها «لا تسرّب بيانات المرضى»، فلا أحد يخصّص لها وقتًا، فتظهر يومًا سيئًا.',
          en: 'Requirements sort into two families because they are elicited, written, and tested differently. A functional requirement describes a behavior: something the system does in response to input — "when a patient checks in, the system marks the appointment arrived and notifies the assigned clinician." Test it with a concrete example: given this input, expect this output. A non-functional requirement — better called a quality requirement — describes a property the system must have while behaving: how fast, how secure, how available. Example: "check-in completes in under one second for 95% of requests at 200 active clinics." Teams most often botch these: easy to state vaguely ("it should be fast"), hard to state testably. Attach a measurable fit criterion to every quality requirement so "done" is a fact, not an argument — and make them explicit now, or users will discover them on your worst day.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'دورة المتطلبات: تُكتشف ولا تُجمع',
        en: 'The Requirements Cycle: Discovered, Not Collected',
      },
      chunks: [
        {
          ar: 'المتطلبات لا تُجمع مرة واحدة وتُحفظ في خزانة. إنها تتحرك في دورة تتكرر: تستنبط الاحتياجات من أصحاب المصلحة، تحللها وتنظمها في شيء متماسك، تحدّدها بصيغة يستطيع الفريق العمل بها، ثم تتحقق أن ما حدّدته هو فعلًا ما يحتاجه الناس — فيتنسّل من ذلك احتياجات وسوء فهم جديدان، وتعود من أولها. لاحظ أمرين: الدورة لا تتوقف في مشروع نشط، إنما يتباطأ إيقاعها كلما استقر الفهم. والأهم أن البناء يغذّي الاستنباط: المستخدمون يتعلمون ما يريدون بتجربة شيء ما، ولهذا فإن أقوى أداة استنباط تملكها غالبًا نسخة عاملة — بل ومزيفة — من المنتج. العملية التكرارية من الفصل 2 وعمل المتطلبات هنا نشاط واحد بمستويي تكبير: كل تكرار عمل هو جولة كاملة في هذه الدورة، وكل جولة تُنضج المتطلبات قبل أن تُنضج الشيفرة.',
          en: 'Requirements are not gathered once and filed away. They move through a repeating cycle: you elicit needs from stakeholders, analyze and organize them into something coherent, specify them in a form the team can act on, and validate that what you specified is actually what people need — which surfaces new needs and misunderstandings, sending you around again. Notice two things: the loop never terminates during an active project; it merely slows as understanding stabilizes. And build feeds back into elicit — users learn what they want by using something, so the most powerful elicitation tool you own is often a working (or even fake) version of the product. Chapter 2\u2019s iterative process and this requirements work are the same activity at two zoom levels: every iteration is one full trip around this cycle, and every trip matures the requirements before it matures the code.',
        },
        {
          ar: 'المنهجتان المهيمنتان تتحققان من أشياء مختلفة. الفرق الرشيقة (agile) تعامل المتطلب كفرضية تُختبر بالشحن: حدّد القليل، ابنِ، ضعه أمام المستخدمين، ودع ردة فعلهم تصحّح الجولة التالية — وحدة الحقيقة هي البرنامج العامل لا الوثيقة. الرهان صريح: التغذية الراجعة أصدق من البصيرة. والقراءة الخاطئة الشائعة «agile تعني لا متطلبات» معكوسة تمامًا عن الحقيقة: فرق agile كثيرًا ما تعمل على المتطلبات أكثر من غيرها، لكن بجرعات صغيرة متصلة — كل تكرار يبدأ بتنقية قائمة الأعمال المتراكمة (backlog) وينتهي بالتحقق من نسخة عاملة. القصة القصيرة متعمّدة القِصر: وعدٌ بمحادثة لاحقة، في اللحظة التي يعرف فيها الفريق أكثر ما سيعرف، وحين تكون القرارات التفصيلية أرخص وأفضل اطلاعًا.',
          en: 'The two dominant philosophies validate different things. Agile methods treat a requirement as a hypothesis to be tested by shipping: specify a little, build it, put it in front of users, and let their reaction correct the next round — the unit of truth is working software, not a document. The bet is explicit: feedback is more reliable than foresight. And the common misreading that agile means "no requirements" is exactly backwards: agile teams often do more requirements work than plan-driven ones — in small, continuous doses. Every iteration begins with refining the backlog and ends with validating against a running system. A user story is deliberately too short to be a specification: it is a promise to have a conversation later, at the last responsible moment, when the team knows the most it will ever know and decisions are cheapest.',
        },
        {
          ar: 'المنهج المخطوط (plan-driven) يستثمر في مواصفة كاملة دقيقة متفق عليها قبل البناء الجدّي، ويتحقق من الوثيقة: مراجعات، توقيعات، تتبّع. يبدو عتيقًا لتطبيق جدولة صغير، لكنه الخيار الصحيح حين تكون كلفة التغيير المتأخر فادحة أو النظام حرج السلامة: طيران، أجهزة طبية، مركبات فضائية، أنظمة خاضعة لشهادات تنظيمية. هناك لا يمكنك أن «تشحن وترى»، والمواصفة الصارمة هي أرخص مكان لاكتشاف خطأ مميت. أغلب المشاريع الحقيقية تخلط بينهما: نواة مثبَّتة موصوفة بعناية (ما لا يحتمل أن يكون خطأً) محاطة بقشرة رشيقة تكرارية (ما ستتعلمه بالتجربة). اختيار موضع الخط الفاصل بين النواة والقشرة حكم هندسي، وميزانه الوحيد: كلفة الخطأ في كل جزء.',
          en: 'Plan-driven methods invest in a complete, precise, agreed specification before significant building begins, and validate against the document: reviews, sign-offs, traceability. It looks old-fashioned for a small scheduling app, but it is exactly right when the cost of a late change is enormous or the system is safety-critical: avionics, medical devices, spacecraft, regulatory certification. There you cannot "ship and see", and a rigorous specification is the cheapest place to catch a life-threatening mistake. Most real projects blend the two: a stable, carefully specified core (the things that must not be wrong) surrounded by an agile, iterative shell (the things you will learn by trying). Where to draw that line is an engineering judgment, and its only scale is the cost of being wrong in each part.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'سجلّ متطلبات: من مسوّدة إلى مُؤكَّد',
        en: 'A Requirements Ledger: From Draft to Confirmed',
      },
      code: `ledger = [
    {"id": "REQ-1", "kind": "functional",     "status": "confirmed", "text": "search patient by last name"},
    {"id": "REQ-2", "kind": "non-functional", "status": "draft",     "text": "search result in under 1 second"},
    {"id": "REQ-3", "kind": "functional",     "status": "draft",     "text": "flag patient needs interpreter"},
    {"id": "REQ-4", "kind": "non-functional", "status": "draft",     "text": "99.5% uptime on weekdays"},
    {"id": "REQ-5", "kind": "functional",     "status": "confirmed", "text": "mark appointment as arrived"},
]

total = len(ledger)
confirmed = sum(1 for r in ledger if r["status"] == "confirmed")
quality = sum(1 for r in ledger if r["kind"] == "non-functional")

print("total:", total)
print("confirmed:", confirmed)
print("quality:", quality)
print("unmatured drafts:", sum(1 for r in ledger if r["kind"] == "non-functional" and r["status"] == "draft"))`,
      explanation: {
        ar: 'هذا السجل نموذج مصغّر لنضج المتطلبات. kind يفرز العائلتين: functional (سلوك يُختبر بمثال) و non-functional (خاصية تحتاج معيار قياس). status يقيس النضج: draft يعني عبارة كُتبت ولم يُتفق على معناها بعد، وconfirmed يعني اتفق الفريق وصاحب المصلحة على صيغة قابلة للاختبار. انظر إلى REQ-2: «في أقل من ثانية» يبدو قابلًا للقياس لكنه ما يزال draft — أي إحصاءة؟ المتوسط أم p95؟ عند أي حمل؟ هذا هو الجدال الذي لم يُجرَ بعد. والعدّادات تحكي صحة السجل: 2 من 5 مؤكدة، وكلا متطلبي الجودة ما يزالان مسوّدتين — أي أن حجج «سريع ومتاح» لم تُحسم.',
        en: 'This ledger is a miniature maturity model. kind separates the two families: functional (behavior testable by an example) and non-functional (a property that needs a fit criterion). status measures maturity: draft means the sentence was written but its meaning is not agreed yet; confirmed means team and stakeholder agreed on a testable form. Look at REQ-2: "in under 1 second" looks measurable but is still a draft — which statistic? Mean or p95? At what load? That argument has not been had yet. The counters tell the ledger\u2019s health: 2 of 5 confirmed, and both quality requirements are still drafts — the arguments about "fast" and "available" remain unsettled.',
      },
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l1.ex1',
      exKind: 'trace_output',
      prompt: {
        ar: 'اقرأ الكود بعين المراجع: أي سجلات ستُطبع في حلقة الفلتر، وبأي ترتيب، وماذا يطبع السطر الأخير؟ اكتب الخرج كاملًا كما سيظهر حرفيًا.',
        en: 'Read the code like a reviewer: which records will the filter loop print, in what order, and what does the last line print? Write the full output exactly as it will appear.',
      },
      code: `ledger = [
    {"id": "R1", "kind": "functional",     "status": "confirmed"},
    {"id": "R2", "kind": "non-functional", "status": "draft"},
    {"id": "R3", "kind": "non-functional", "status": "confirmed"},
    {"id": "R4", "kind": "functional",     "status": "draft"},
]

for r in ledger:
    if r["status"] == "draft":
        print(r["id"], r["kind"])

n = 0
for r in ledger:
    if r["status"] == "draft":
        n += 1
print("drafts:", n)`,
      answer: 'R2 non-functional\nR4 functional\ndrafts: 2',
      solution: 'R2 non-functional\nR4 functional\ndrafts: 2',
      hints: [
        {
          ar: 'الحلقة تطبع فقط السجلات التي status يساوي draft — وتتخطى البقية بصمت.',
          en: 'The loop prints only records whose status equals draft — everything else is skipped silently.',
        },
        {
          ar: 'الطباعة تمر على السجلات بترتيبها في القائمة، من الأعلى إلى الأسفل، سطرًا لكل سجل.',
          en: 'Printing walks the list in order, top to bottom, one line per matching record.',
        },
        {
          ar: 'ابحث في القائمة: R2 وR4 فقط تحملان status يساوي draft؛ R1 وR3 مؤكَّدان فلا يظهران.',
          en: 'Scan the list: only R2 and R4 carry status draft; R1 and R3 are confirmed, so they never appear.',
        },
        {
          ar: 'العدّاد الثاني يكرر الشرط نفسه فيعدّ السطرين المطبوعين: السطران هما "R2 non-functional" و"R4 functional" ثم "drafts: 2".',
          en: 'The second loop repeats the same condition, so it counts the two printed rows: lines "R2 non-functional", "R4 functional", then "drafts: 2".',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l1.ex2',
      exKind: 'write_code',
      prompt: {
        ar: 'أكمل دالة count في سجلّ المتطلبات: تُرجع عدد السجلات المطابقة للمرشّحين معًا، ويعني kind=None أو status=None تجاهل ذلك المرشّح. يجب أن تطبع الأسطر الخمسة كما هي في الهيكل: total ثم functional ثم quality ثم drafts ثم confirmed quality.',
        en: 'Complete the count function for the requirements ledger: return how many records match BOTH filters; kind=None or status=None means "ignore this filter". The five printed lines must match the starter exactly: total, then functional, then quality, then drafts, then confirmed quality.',
      },
      starterCode: `ledger = [
    {"id": "REQ-1", "kind": "functional",     "status": "confirmed"},
    {"id": "REQ-2", "kind": "functional",     "status": "draft"},
    {"id": "REQ-3", "kind": "non-functional", "status": "draft"},
    {"id": "REQ-4", "kind": "functional",     "status": "confirmed"},
    {"id": "REQ-5", "kind": "non-functional", "status": "confirmed"},
    {"id": "REQ-6", "kind": "functional",     "status": "draft"},
]

def count(records, kind=None, status=None):
    # Return how many records match BOTH filters.
    # kind=None or status=None means "ignore this filter".
    ...

print("total:", count(ledger))
print("functional:", count(ledger, kind="functional"))
print("quality:", count(ledger, kind="non-functional"))
print("drafts:", count(ledger, status="draft"))
print("confirmed quality:", count(ledger, kind="non-functional", status="confirmed"))`,
      solution: `ledger = [
    {"id": "REQ-1", "kind": "functional",     "status": "confirmed"},
    {"id": "REQ-2", "kind": "functional",     "status": "draft"},
    {"id": "REQ-3", "kind": "non-functional", "status": "draft"},
    {"id": "REQ-4", "kind": "functional",     "status": "confirmed"},
    {"id": "REQ-5", "kind": "non-functional", "status": "confirmed"},
    {"id": "REQ-6", "kind": "functional",     "status": "draft"},
]

def count(records, kind=None, status=None):
    n = 0
    for r in records:
        if kind is not None and r["kind"] != kind:
            continue
        if status is not None and r["status"] != status:
            continue
        n += 1
    return n

print("total:", count(ledger))
print("functional:", count(ledger, kind="functional"))
print("quality:", count(ledger, kind="non-functional"))
print("drafts:", count(ledger, status="draft"))
print("confirmed quality:", count(ledger, kind="non-functional", status="confirmed"))`,
      tests: [
        {
          id: 't-total',
          name: { ar: 'العدد الكلي', en: 'total count' },
          code: "assert 'total: 6' in __learner_output__, 'expected: total: 6 | actual: %r' % __learner_output__",
          expected: 'total: 6',
        },
        {
          id: 't-quality',
          name: { ar: 'عدد متطلبات الجودة', en: 'quality count' },
          code: "assert 'quality: 2' in __learner_output__, 'expected: quality: 2 | actual: %r' % __learner_output__",
          expected: 'quality: 2',
        },
        {
          id: 't-filter',
          name: { ar: 'الفلتر المزدوج', en: 'combined filter' },
          code: "assert count(ledger, status='draft') == 3, 'expected 3 drafts | got %r' % count(ledger, status='draft')",
          expected: '3',
        },
      ],
      hints: [
        {
          ar: 'عدّاد يبدأ من صفر وحلقة واحدة تمر على السجلات تكفي — لا تحتاج أكثر من متغير n وحلقة for.',
          en: 'A counter starting at zero and a single loop over the records are enough — just n and one for loop.',
        },
        {
          ar: 'الفكرة: تجاهل السجل فورًا إذا أخفق في مطابقة أي فلتر مُمرَّر؛ الفلتر None لا يُرحِّل أحدًا.',
          en: 'The idea: skip a record immediately if it fails any filter that was actually passed; a None filter rejects nobody.',
        },
        {
          ar: 'الهيكل: n = 0 ثم for r in records: وبداخلها تحققان متتاليان مع continue، ثم n += 1، وأخيرًا return n خارج الحلقة.',
          en: 'Skeleton: n = 0, then for r in records: with two sequential ifs using continue, then n += 1, and return n after the loop.',
        },
        {
          ar: 'قريب من الحل: if kind is not None and r["kind"] != kind: continue ثم كرّر النمط نفسه لـ status، وأضف n += 1 في نهاية جسم الحلقة.',
          en: 'Near-solution: if kind is not None and r["kind"] != kind: continue, then repeat the same pattern for status, and add n += 1 at the end of the loop body.',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l1.ex3',
      exKind: 'mcq',
      prompt: {
        ar: 'قال المستخدم: «أضف قائمة منسدلة لاختيار العيادة». أي إعادة صياغة تصل إلى المتطلب الكامن خلف هذا الحل؟',
        en: 'The user said: "add a dropdown to pick the clinic." Which rewrite reaches the requirement hiding underneath that solution?',
      },
      options: [
        {
          id: 'a',
          text: {
            ar: '«يجب أن يستخدم النظام قائمة منسدلة أنيقة لاختيار العيادة»',
            en: '"The system must use an elegant dropdown to select the clinic"',
          },
        },
        {
          id: 'b',
          text: {
            ar: '«أحتاج إلى اختيار عيادة واحدة من قائمة قصيرة دون أخطاء إملائية»',
            en: '"I need to pick one clinic from a short list without typos"',
          },
        },
        {
          id: 'c',
          text: {
            ar: '«يجب أن يكون النظام سريعًا وجميلًا وموثوقًا»',
            en: '"The system must be fast, beautiful, and reliable"',
          },
        },
        {
          id: 'd',
          text: {
            ar: '«يجب ترقية قاعدة البيانات قبل أي شيء آخر»',
            en: '"The database must be upgraded before anything else"',
          },
        },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        {
          ar: 'اسأل عن كل خيار: هل يصف حاجة (ماذا ولماذا) أم طريقة تنفيذ (كيف)؟',
          en: 'Ask of each option: does it describe a need (what and why) or an implementation method (how)?',
        },
        {
          ar: 'الخيار a يظل تصميمًا — نفس الحل بكلمة «أنيقة»؛ وc متطلب جودة غامض بلا معيار قياس.',
          en: 'Option a is still a design — the same solution with the word "elegant"; and c is a vague quality statement with no fit criterion.',
        },
        {
          ar: 'الخيار d قفزة إلى الشيفرة والمعمارية، أبعد ما تكون عن حاجة المستخدم اليومية.',
          en: 'Option d jumps straight to code and architecture, furthest from the user\u2019s daily need.',
        },
        {
          ar: 'الخيار b هو وحده الذي يبقى عند المشكلة: اختبار صحيح من قائمة قصيرة — ويقبل حلولًا غير القائمة المنسدلة.',
          en: 'Option b alone stays at the problem: correct pick from a short list — and it admits solutions other than a dropdown.',
        },
      ],
    },
    {
      kind: 'exercise',
      required: true,
      id: 'swe.ch3.l1.ex4',
      exKind: 'fill_blank',
      prompt: {
        ar: 'أكمل المصطلح: المتطلب الذي يصف سلوكًا يقوم به النظام استجابةً لمدخل يسمى متطلب ________ (functional)، بينما الذي يصف خاصية يجب أن يمتلكها النظام أثناء سلوكه يسمى متطلب جودة. اكتب الكلمة الإنجليزية الناقصة كلمة واحدة.',
        en: 'Complete the term: a requirement describing a behavior the system performs in response to input is called a ________ requirement, while one describing a property the system must possess while behaving is called a quality requirement. Write the single missing English word.',
      },
      answer: 'functional',
      solution: 'functional',
      hints: [
        {
          ar: 'العائلتان في الدرس: إحداهما للسلوك والأخرى للخاصية.',
          en: 'The lesson named two families: one for behavior, one for property.',
        },
        {
          ar: 'متطلب الجودة يقابلها؛ اسم هذه العائلة يصف «وظيفة» يؤديها النظام.',
          en: 'Quality requirement is its counterpart; this family\u2019s name describes a function the system performs.',
        },
        {
          ar: 'في السجل الذي بنيناه كانت القيمة kind تساوي هذه الكلمة أو non-functional.',
          en: 'In the ledger we built, the kind field held this word or non-functional.',
        },
        {
          ar: 'الكلمة هي functional.',
          en: 'The word is functional.',
        },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `# سجلّ متطلبات عيادة — عدّل، أضف، وراقب العدّادات.
ledger = [
    {"id": "REQ-1", "kind": "functional",     "status": "draft",     "text": "search by last name"},
    {"id": "REQ-2", "kind": "non-functional", "status": "draft",     "text": "load quickly"},
    {"id": "REQ-3", "kind": "functional",     "status": "confirmed", "text": "mark appointment arrived"},
]

def show(records):
    for r in records:
        print(r["id"], "|", r["kind"], "|", r["status"], "|", r["text"])
    print("total:", len(records))
    print("confirmed:", sum(1 for r in records if r["status"] == "confirmed"))
    print("quality:", sum(1 for r in records if r["kind"] == "non-functional"))

show(ledger)

# جرّب:
# 1) أعد كتابة REQ-2 بمعيار قياس قابل للاختبار بدل "load quickly" ثم انقله إلى confirmed.
# 2) أضف متطلب جودة رابعًا من عندك وراقب كيف تتغير العدّادات.
# 3) أي سجلٍّ في رأيك يخفي جدالًا لم يُجرَ بعد؟`,
      prompt: {
        ar: 'سجلّ حي بين يديك. لاحظ أن REQ-2 كتبها أحدهم بصيغة «load quickly» — الغموض نفسه الذي حذرنا منه. أعد صياغته بمعيار قياس، رقّه إلى confirmed، وأضف متطلب جودة خاصًا بك، وراقب العدّادات كلما عدّلت. سؤال للتفكير: أي صف في السجل يخفي جدالًا لم يُجرَ بعد؟',
        en: 'A living ledger. Notice REQ-2 was written as "load quickly" — the very vagueness we warned about. Rewrite it with a fit criterion, promote it to confirmed, add a quality requirement of your own, and watch the counters move as you edit. Think: which row in this ledger is hiding an argument nobody has had yet?',
      },
    },
    {
      kind: 'quiz',
      id: 'swe.ch3.l1.quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'نعود إلى Scrum من الفصل 2: متى يجري الفريق معظم عمل المتطلبات؟',
            en: 'Back to Scrum from Chapter 2: when does the team do most of its requirements work?',
          },
          options: [
            {
              id: 'a',
              text: {
                ar: 'مرة واحدة في البداية: مواصفة كاملة تُجمَّد ثم تُنفَّذ حرفيًا',
                en: 'Once at the start: a complete specification frozen and then implemented literally',
              },
            },
            {
              id: 'b',
              text: {
                ar: 'باستمرار: تنقية قائمة الأعمال المتراكمة كل سبرنت والتحقق من المتطلبات على نسخة عاملة',
                en: 'Continuously: refining the backlog every sprint and validating requirements on working software',
              },
            },
            {
              id: 'c',
              text: {
                ar: 'أبدًا: Scrum لا يحتاج عمل متطلبات لأن الفريق يعرف ما يريد المستخدم',
                en: 'Never: Scrum needs no requirements work because the team already knows what users want',
              },
            },
            {
              id: 'd',
              text: {
                ar: 'فقط بعد اكتشاف عيب في الإنتاج',
                en: 'Only after a defect is discovered in production',
              },
            },
          ],
          answer: 'b',
          explanation: {
            ar: 'Scrum يعامل المتطلبات بجرعات صغيرة متصلة: تنقية backlog في كل سبرنت، ثم تحقق عبر نسخة عاملة في المراجعة — وهذا هو نفسه «البناء يغذي الاستنباط»: كل تكرار جولة في دورة المتطلبات. فكرة «لا متطلبات في agile» قراءة خاطئة شائعة.',
            en: 'Scrum handles requirements in small continuous doses: backlog refinement each sprint, then validation against working software at the review — which is exactly "build feeds into elicit": every iteration is a trip around the requirements cycle. "No requirements in agile" is a common misreading.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'أي العبارات التالية متطلب وظيفي (functional) كما عرّفناه؟',
            en: 'Which of the following is a functional requirement as we defined it?',
          },
          options: [
            {
              id: 'a',
              text: { ar: '«يجب أن يكون النظام آمنًا»', en: '"The system must be secure"' },
            },
            {
              id: 'b',
              text: {
                ar: '«عند تسجيل وصول المريض، يعلّم النظام الموعد بأنه حضر ويُخطر الطبيب المسؤول»',
                en: '"When a patient checks in, the system marks the appointment arrived and notifies the clinician"',
              },
            },
            {
              id: 'c',
              text: { ar: '«يجب أن يعجب النظام الإدارة»', en: '"The system must please management"' },
            },
            {
              id: 'd',
              text: { ar: '«يجب أن يستخدم النظام PostgreSQL»', en: '"The system must use PostgreSQL"' },
            },
          ],
          answer: 'b',
          explanation: {
            ar: 'الوظيفي يصف سلوكًا استجابةً لمدخل ويُختبر بمثال محدد. a متطلب جودة غامض، c ليس متطلبًا أصلًا بلا معنى قابل للقياس، d حل تنفيذي (كيف) لا حاجة (ماذا).',
            en: 'A functional requirement describes behavior in response to input and is testable with a concrete example. a is a vague quality statement, c is not a requirement at all without a measurable meaning, and d is an implementation choice (how) not a need (what).',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي مجال يناسبه منهج plan-driven يتحقق من مواصفة صارمة قبل البناء؟',
            en: 'Which domain suits a plan-driven approach that validates a rigorous specification before building?',
          },
          options: [
            {
              id: 'a',
              text: { ar: 'تطبيق توصيل طعام ناشئ يبحث عن ملاءمة السوق', en: 'A food-delivery startup still searching for market fit' },
            },
            {
              id: 'b',
              text: { ar: 'نظام طيران خاضع لشهادات سلامة تنظيمية', en: 'An avionics system bound by safety certification' },
            },
            {
              id: 'c',
              text: { ar: 'صفحة هبوط لحملة تسويقية موسمية', en: 'A landing page for a seasonal marketing campaign' },
            },
            {
              id: 'd',
              text: { ar: 'نموذج أولي لألعاب موبايل يُرمى في السوق للتجربة', en: 'A throwaway mobile-game prototype shipped to learn' },
            },
          ],
          answer: 'b',
          explanation: {
            ar: 'حين تكون كلفة التغيير المتأخر كارثية أو النظام حرج السلامة، لا يمكن «الشحن والرؤية» — والمواصفة الصارمة أرخص مكان لاكتشاف الخطأ المميت. أما السياقات غير المثبتة فتناسب agile حيث التغذية الراجعة أصدق من البصيرة. أغلب المشاريع الحقيقية تخلط النواة المثبتة بالقشرة الرشيقة.',
            en: 'When a late change is catastrophic or the system is safety-critical, you cannot ship-and-see — the rigorous specification is the cheapest place to catch a life-threatening mistake. Unproven contexts suit agile, where feedback beats foresight. Most real projects blend a fixed core with an agile shell.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي صياغة لمتطلب جودة تجعل «الانتهاء» حقيقة لا جدالًا؟',
            en: 'Which phrasing of a quality requirement makes "done" a fact instead of an argument?',
          },
          options: [
            {
              id: 'a',
              text: { ar: '«يجب أن يكون التطبيق سريعًا»', en: '"The app must be fast"' },
            },
            {
              id: 'b',
              text: { ar: '«يجب أن يعمل النظام بشكل موثوق»', en: '"The system must work reliably"' },
            },
            {
              id: 'c',
              text: {
                ar: '«p95 أقل من ثانية واحدة عند 200 عيادة نشطة»',
                en: '"p95 under one second with 200 active clinics"',
              },
            },
            {
              id: 'd',
              text: { ar: '«يجب أن يكون المستخدمون راضين»', en: '"Users must be satisfied"' },
            },
          ],
          answer: 'c',
          explanation: {
            ar: 'معيار القياس (fit criterion) قابل للقياس والاختبار: إحصاءة محددة وحد واضح وشروط حِمل معلومة. أما «سريع» و«موثوق» و«راضين» فهي عناوين لجدالات لم تُجرَ — وتُكتشف يومًا سيئًا إن لم تُكتب الآن.',
            en: 'A fit criterion is measurable and testable: a named statistic, a hard bound, and known load conditions. "Fast", "reliable", and "satisfied" are placeholders for arguments nobody has had yet — and they get discovered on your worst day if left unwritten.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'المستخدم قال «أضف زرًا» — سجّل العبارة كما هي في السجل وطوّرها فورًا؛ هو صاحب المصلحة وهو يعرف.',
          right: 'العبارة حلٌّ متنكّر في هيئة حاجة. تتبّعها إلى المشكلة تحتها («أحتاج اختيار X دون خطأ») واكتب المتطلب عند الحاجة — فالحاجة تقبل حلولًا أفضل مما تخيّله صاحبها.',
          note: {
            ar: 'قبول أول حلٍّ مُقدَّم كأنه المشكلة يعني أنك ورثت كل ما أغفله صاحب المصلحة.',
            en: 'Accepting the first offered solution as the problem means inheriting everything the stakeholder overlooked.',
          },
        },
        {
          wrong: '«يجب أن يكون التقرير سريعًا» — متطلب جودة مكتمل، فلننقله إلى confirmed ونمضِ.',
          right: '«سريع» عنوان جدال لا معيار. ألصق به fit criterion قابلًا للقياس — مثل «p95 أقل من ثانية عند 200 مستخدم متزامن» — وبعدها فقط يصبح confirmed.',
          note: {
            ar: 'متطلبات الجودة الغامضة لا تُختبر؛ تُنقض في الإنتاج أمام المستخدمين في أسوأ يوم.',
            en: 'Vague quality requirements cannot be tested; they are violated in production, in front of users, on your worst day.',
          },
        },
        {
          wrong: 'كتبنا المواصفة كاملة ووقّعها الجميع — انتهى عمل المتطلبات، فلنفتح دورة جديدة دون العودة إليه.',
          right: 'المواصفة المجمّدة تتقادم بصمت: تنظيمات تتغير، مستخدمون ينضجون، فهم يستقر ببطء. الدورة لا تتوقف في مشروع نشط — إنما يتباطأ إيقاعها، وكل تكرار عمل يعيدك إليها.',
          note: {
            ar: 'المتطلبات تُكتشف لا تُجمع؛ أقدم نسخة من أي متطلب هي دائمًا مخطئة جزئيًا.',
            en: 'Requirements are discovered, not collected; the earliest version of any requirement is always partly wrong.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'المتطلب عبارة متفق عليها عن حاجة صاحب مصلحة: سلوك يجب أن يقوم به النظام أو خاصية يجب أن يمتلكها — ماذا ولماذا، لا كيف. أول حلٍّ يخبرك به المستخدم ليس متطلبًا بل تصميمًا ينتظر أن تكتشف الحاجة تحته.',
          en: 'A requirement is an agreed statement of a stakeholder need: a behavior the system must exhibit or a property it must possess — what and why, not how. The first solution a user hands you is not a requirement; it is a design waiting for you to uncover the need beneath it.',
        },
        {
          ar: 'عائلتان: الوظيفي يصف سلوكًا يُختبر بمثال محدد، ومتطلب الجودة يصف خاصية تحتاج معيار قياس قابلًا للقياس — وإلا بقيت عنوان جدال تُنقض في أسوأ يوم.',
          en: 'Two families: functional describes behavior testable with a concrete example; quality describes a property that needs a measurable fit criterion — otherwise it stays the title of an argument and gets violated on your worst day.',
        },
        {
          ar: 'المتطلبات تُكتشف لا تُجمع: دورة استنباط→تحليل→تحديد→تحقق لا تتوقف، والبناء يغذّيها — agile يتحقق من برنامج عامل، وplan-driven يتحقق من مواصفة، وأغلب المشاريع تخلط نواة مثبتة بقشرة رشيقة.',
          en: 'Requirements are discovered, not collected: an elicit→analyze→specify→validate loop that never stops, fed by building — agile validates working software, plan-driven validates a specification, and most projects blend a fixed core with an agile shell.',
        },
      ],
      reflectPrompt: {
        ar: 'افتح آخر ميزة شاركت في بنائها: هل كان الطلب الأصلي من المستخدم حلًّا أم حاجة؟ اكتب المتطلب الذي كان ينبغي أن يجلس في السجل مكانه — وبأي معيار قياس كان يصبح confirmed؟',
        en: 'Open the last feature you helped build: was the original request a solution or a need? Write the requirement that should have sat in the ledger instead — and the fit criterion that would have made it confirmed.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch3.s1', pages: 'ص64-67 / pp.64-67' },
        { book: 'SWE', section: 'swe.ch3.s2', pages: 'ص68-69 / pp.68-69' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch3.s1', pages: 'ص64-67 / pp.64-67' },
    { book: 'SWE', section: 'swe.ch3.s2', pages: 'ص68-69 / pp.68-69' },
  ],
} satisfies Lesson;

export default lesson;
