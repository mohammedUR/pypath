/**
 * Lesson swe.ch5.l1 — عناصر حالة الاستخدام / Elements of a Use Case
 * Book: SWE — Chapter 5 'Use Cases', §5.1 Elements of a Use Case
 *   5.1.1 Actors and Goals (pp.124-126), 5.1.2 Flows and Basic Flows (pp.126-127)
 * Runnable design: a use-case "record validator" over fixed dicts checks that
 *   actor / goal / preconditions / steps exist and that steps name who acts,
 *   printing short ASCII verdicts (OK / BROKEN + problem list).
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch5.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 5,
  title: { ar: 'عناصر حالة الاستخدام', en: 'Elements of a Use Case' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch4.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: '«بصفتك عميل بطاقة، أريد أن أسحب نقدًا.» قصة مستخدم من سطر واحد، وافق عليها الفريق في التخطيط. ثم جاء المبرمج ليسأل: ماذا يقول الصراف الآلي إذا كان الرصيد لا يكفي؟ ماذا لو نفدت الأوراق النقدية؟ متى تُعاد البطاقة بالضبط؟ القصة صامتة. هنا يبدأ عمل حالة الاستخدام (use case): تروي قصة هدف واحد كاملة، من أول حركة للفاعل حتى لحظة النجاح — أو الفشل المفهوم والمتحكَّم به.',
        en: '"As a cardholder, I want to withdraw cash." A one-line user story, approved in planning. Then the developer starts asking: what does the ATM say when the balance is short? What if it is out of bills? When exactly does the card come back? The story is silent. That is the job of a use case: it tells the complete story of one goal, from the actor\'s first move to the moment the goal succeeds — or fails in a controlled, understood way.',
      },
    },
    {
      kind: 'predict',
      code: `story = "As a cardholder, I want to withdraw cash"
gaps = ["how is identity proven?",
        "what if the balance is low?",
        "when does the card come back?"]
print("words in story:", len(story.split()))
for g in gaps:
    print("story is silent on:", g)`,
      question: {
        ar: 'قبل التشغيل: كم كلمة في القصة؟ وهل تكفي هذه الكلمات وحدها لبناء نظام صرف؟',
        en: 'Before running: how many words are in the story? And are those words enough to build a cash-dispensing system?',
      },
      reveal: {
        ar: 'ثماني كلمات، وثلاثة أسئلة حرجة بلا جواب. ضغط القصة ميزة عند ترتيب قائمة الأعمال المتراكمة (backlog) وعيب عند البناء — وحالة الاستخدام تُفكّ هذا الضغط وتحوّله إلى تدفق كامل يجيب عن كل سؤال.',
        en: 'Eight words, and three critical questions with no answer. The story\'s compression is a feature when ordering the backlog and a liability when building — the use case un-compresses it into a complete flow that answers every question.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الفاعل: دور يقف خارج الحدود', en: 'Actors: roles standing outside the boundary' },
      chunks: [
        {
          ar: 'الفاعل (actor) هو أي كيان خارج النظام يتفاعل معه لإنجاز أمر ما — والكلمة الأهم في التعريف هي: خارج. الفاعل يقف خلف حد النظام (system boundary) ويتبادل معه المعلومات؛ ولا شيء داخل برمجياتك يُعدّ فاعلًا. حين تسمّي الفاعلين فأنت ترسم الحدود ضمنيًا: هذا هو النظام، وذلك هو العالم الذي يخدمه. وتذكّر أن الفاعل دور لا شخص: الإنسان نفسه يكون Cardholder صباحًا حين يسحب نقدًا، وBank Employee مساءً حين يجرد الصندوق — دوران لشخص واحد، وأشخاص كثيرون يشتركون في دور واحد.',
          en: 'An actor is any entity outside the system that interacts with it to accomplish something — and the key word is outside. The actor stands across the system boundary and exchanges information with it; nothing inside your own software counts. Naming the actors is how you draw that boundary: this is the system, that is the world it serves. And an actor is a role, not a person: the same human is a Cardholder when withdrawing cash and a Bank Employee when reconciling the till — two roles, one person, and many people sharing one role.',
        },
        {
          ar: 'وللفاعل نوعان. الفاعل الأساسي (primary actor) يبدأ حالة الاستخدام ليصل إلى هدف هو يريده: رغبة Cardholder في المال هي سبب وجود الحالة أصلًا، وكل حالة استخدام تحتاج واحدًا. أما الفاعل المساند (supporting actor) فنظام أو شخص خارجي تستدعيه المنظومة لإنجاز العمل دون أن يكون هدفه هو دافع القصة. حين يطلب الصراف الآلي موافقة نظام Bank Authorization System، فذلك نظام مساند: ضروري للتدفق، لكنه ليس صاحب الهدف.',
          en: 'Actors come in two kinds. The primary actor initiates the use case to reach a goal of their own: the Cardholder\'s desire for cash is why the case exists, and every use case needs one. A supporting actor is an external system or person the system calls on to get the job done — essential to the flow, but not the one whose goal drives the story. When the ATM asks the Bank Authorization System to approve a withdrawal, that back end is supporting: needed, but not the goal-holder.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الهدف: نتيجة في العالم لا زر على شاشة', en: 'Goals: a result in the world, not a button on a screen' },
      chunks: [
        {
          ar: 'الهدف (goal) هو ما يريد الفاعل الأساسي أن يحققه التفاعل، ويُصاغ كنتيجة في العالم لا كخاصية في البرنامج. سحب النقود هدف؛ الضغط على زر السحب مجرد خطوة نحوه. اختبار سريع: الهدف الجيد يبقى معقولًا لو استُبدلت الواجهة كلها — الناس سحبوا النقود من موظف بشري قبل اختراع الصراف الآلي، فالهدف أطول عمرًا من أي تنفيذ. إن كان لتغيير الأزرار أن يعيد صياغة هدفك، فأنت وصفت شاشة لا متطلبًا.',
          en: 'A goal is what the primary actor wants the interaction to achieve, stated as a result in the world, not a feature of the software. "Withdraw cash" is a goal; clicking the withdraw button is merely a step toward one. Quick test: a good goal still makes sense if you replaced the entire user interface — people withdrew cash from human tellers long before ATMs existed, so the goal outlives any implementation. If changing buttons would force you to reword your goal, you described a screen, not a requirement.',
        },
        {
          ar: 'وقبل كتابة أي تدفق، اسرد الفاعلين وأهدافهم في جدول من عمودين: كل صف هدف موصول بفاعله الأساسي. هذا الجدول — actor-goal list — مسودة أولى لهيكل النظام كله في صفحة واحدة: يُظهر أهدافًا لم يذكرها أحد (من يعيد تعبئة الجهاز؟)، ويوضح أي الفاعلين مهم فعلًا، ويمنح الفريق وحدة عمل واحدة تُقدَّر وتُجدول: حالة استخدام في كل مرة. في مثالنا: Cardholder يسحب نقدًا ويستعلم عن الرصيد، وBank Employee يعيد تعبئة الأشرطة ويسترجع البطاقات المحتجزة.',
          en: 'Before writing any flow, list actors and their goals in a two-column table: each row a goal tagged with its primary actor. That actor-goal list is a one-page outline of the whole system: it surfaces goals nobody mentioned (who refills the machine?), shows which actors really matter, and gives the team a unit of work to estimate and schedule — one use case at a time. In our example: Cardholder withdraws cash and checks balance; Bank Employee reloads cassettes and retrieves captured cards.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التدفق الأساسي، والشروط، والفرق عن الميزة والسيناريو', en: 'The basic flow, the conditions, and use case vs feature vs scenario' },
      chunks: [
        {
          ar: 'التدفق (flow) سلسلة خطوات مرقّمة تصف تفاعلًا: كل خطوة تبادلة كاملة واحدة — إما أن يفعل الفاعل شيئًا يلمسه النظام، أو أن يستجيب النظام. وأهم تدفق هو التدفق الأساسي (basic flow)، ويسمى أيضًا main success scenario أو المسار السعيد: ما يحدث حين يسير كل شيء جيدًا. اكتبه أولًا وبتفاؤل متعمد، لأنه العمود الفقري الذي ستُعلَّق عليه كل الانحرافات لاحقًا — ولا يمكن وصف انحراف قبل وجود العمود الذي ينحرف عنه.',
          en: 'A flow is a numbered sequence of steps describing an interaction: each step is one complete exchange — the actor does something the system perceives, or the system responds. The most important flow is the basic flow, also called the main success scenario or happy path: what happens when everything cooperates. Write it first, deliberately optimistic — it is the spine every later deviation hangs from; you cannot describe a deviation before the spine it deviates from exists.',
        },
        {
          ar: 'وتكتمل الحالة بشرطين. الشروط المسبقة (preconditions): ما يجب أن يكون صحيحًا قبل أول خطوة — الجهاز في الخدمة والبطاقة صالحة. والشروط اللاحقة (postconditions): ما يجب أن يبقى صحيحًا بعد آخر خطوة، في النجاح والفشل معًا. وتمييز المصطلحات: الميزة (feature) بطاقة قدرة قصيرة؛ وقصة المستخدم سطر واحد يقول من يريد ماذا ولماذا؛ أما حالة الاستخدام فالقصة الكاملة بمساراتها؛ والسيناريو (scenario) مسار واحد محدد داخل الحالة — المسار السعيد سيناريو منها.',
          en: 'Two kinds of conditions complete the record. Preconditions: what must already be true before step one — machine in service, card valid. Postconditions: what must remain true after the last step, in success and failure alike. Terminology: a feature is a short capability label; a user story is one line of who-wants-what-why; a use case is the full story with all its paths; and a scenario is one specific path through a use case — the happy path is one scenario of it.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'محقّق سجل حالة الاستخدام', en: 'The use-case record validator' },
      code: `REQUIRED_FIELDS = ("actor", "goal", "preconditions", "steps")

def validate_uc(uc):
    """Return (ok, problems) for one use-case record."""
    problems = []
    for field in REQUIRED_FIELDS:
        if not uc.get(field):
            problems.append("missing:" + field)
    for i, s in enumerate(uc.get("steps", []), 1):
        low = s.lower()
        if "cardholder" not in low and "system" not in low:
            problems.append(f"step {i}: who acts?")
    return (len(problems) == 0, problems)

good = {"actor": "Cardholder", "goal": "Withdraw cash",
        "preconditions": ["ATM in service", "card is valid"],
        "steps": ["The Cardholder inserts a card.",
                  "The system validates the PIN.",
                  "The system dispenses the cash."]}
bad = {"actor": "", "goal": "Click the withdraw button", "steps": []}

for name, uc in (("good", good), ("bad", bad)):
    ok, problems = validate_uc(uc)
    print(name, "OK" if ok else "BROKEN", problems)`,
      explanation: {
        ar: 'المحقّق يستقبل سجلًا (dict) لحالة استخدام ويعيد حكمًا وقائمة مشاكل: حقل ناقص أو فارغ يظهر كـ missing:field، وخطوة لا تذكر مَن يفعل تُرفض بسؤال who acts؟. لاحظ أن goal في السجل السيئ «Click the withdraw button» تجتاز فحص الوجود — الأداة تكشف النواقص الشكلية، أما الصياغة السيئة فيمسكها مراجع بشري يسأل: أهذا هدف أم خطوة واجهة؟',
        en: 'The validator takes a use-case record (a dict) and returns a verdict plus a problem list: a missing or empty field shows as missing:field, and a step that never says who acts is rejected. Note that the bad record\'s goal "Click the withdraw button" passes the existence check — the tool catches structural gaps; catching bad phrasing is the human reviewer\'s job: is this a goal or a UI step?',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.write-validator',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل الدالة check_record حتى تطبّق أربع قواعد بالترتيب: actor فارغ أو غائب → no actor، وgoal فارغ → no goal، وغياب preconditions → no preconditions، وأقل من خطوتين → too few steps. ثم شغّلها على السجل المعطى. المطلوب في الخرج: سطر fix لكل مشكلة، ثم سطر يبدأ بـ problems: ويذكر عددها.',
        en: 'Complete check_record so it applies four rules in order: empty/missing actor -> no actor, empty goal -> no goal, missing preconditions -> no preconditions, fewer than 2 steps -> too few steps. Then run it on the given record. Expected output: one fix: line per problem, then a line starting with problems: with the count.',
      },
      starterCode: `def check_record(uc):
    """Return a list of problem strings; empty list = complete record.
    Rules (in order):
      - actor missing or empty -> 'no actor'
      - goal missing or empty  -> 'no goal'
      - preconditions missing  -> 'no preconditions'
      - fewer than 2 steps     -> 'too few steps'
    """
    problems = []
    # TODO: apply the four rules
    return problems

record = {"actor": "Cardholder", "goal": "",
          "preconditions": ["ATM in service"],
          "steps": ["The Cardholder inserts a card."]}

problems = check_record(record)
for p in problems:
    print("fix:", p)
print("problems:", len(problems))`,
      solution: `def check_record(uc):
    """Return a list of problem strings; empty list = complete record."""
    problems = []
    if not uc.get("actor"):
        problems.append("no actor")
    if not uc.get("goal"):
        problems.append("no goal")
    if not uc.get("preconditions"):
        problems.append("no preconditions")
    steps = uc.get("steps", [])
    if len(steps) < 2:
        problems.append("too few steps")
    return problems

record = {"actor": "Cardholder", "goal": "",
          "preconditions": ["ATM in service"],
          "steps": ["The Cardholder inserts a card."]}

problems = check_record(record)
for p in problems:
    print("fix:", p)
print("problems:", len(problems))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'تُبلغ عن هدف ناقص', en: 'reports the missing goal' },
          code: `assert 'fix: no goal' in __learner_output__, 'expected: fix: no goal | actual: %r' % __learner_output__`,
        },
        {
          id: 't2',
          name: { ar: 'تحسب مشكلتين', en: 'counts two problems' },
          code: `assert 'problems: 2' in __learner_output__, 'expected: problems: 2 | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        {
          ar: 'ابدأ من الهيكل: قائمة problems فارغة، ولكل قاعدة تخفق سطر واحد: problems.append بالنص المطلوب حرفيًا.',
          en: 'Start from the skeleton: an empty problems list; for each failing rule one line: problems.append with the exact string.',
        },
        {
          ar: 'الحقل الغائب أو الفارغ يجعل uc.get(field) قيمة falsy — فتكفي عبارة if not uc.get(...).',
          en: 'A missing or empty field makes uc.get(field) falsy — so if not uc.get(...) is enough.',
        },
        {
          ar: 'قاعدة الخطوات لا تفحص وجود الحقل فقط: اجلب القائمة بقيمة افتراضية وقارن الطول: len(uc.get("steps", [])) < 2.',
          en: 'The steps rule does more than check presence: fetch the list with a default and compare its length: len(uc.get("steps", [])) < 2.',
        },
        {
          ar: 'قريب من الحل: if not uc.get("goal"): problems.append("no goal") — كرّر النمط للبقية بالترتيب نفسه، وسيطبع الهيكل الجاهز fix وproblems نيابة عنك.',
          en: 'Near-solution: if not uc.get("goal"): problems.append("no goal") — repeat the pattern for the rest, in the same order; the existing tail prints fix and problems for you.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-goal',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي الصياغات التالية هدف صحيح — نتيجة في العالم تنجو من إعادة تصميم الواجهة كاملة؟',
        en: 'Which of the following is a proper goal — a result in the world that survives a full UI redesign?',
      },
      options: [
        { id: 'a', text: { ar: 'الضغط على زر Withdraw', en: 'Click the Withdraw button' } },
        { id: 'b', text: { ar: 'سحب النقود', en: 'Withdraw cash' } },
        { id: 'c', text: { ar: 'التمرير إلى حقل المبلغ', en: 'Scroll to the amount field' } },
        { id: 'd', text: { ar: 'النقر على ENTER من لوحة المفاتيح', en: 'Tap ENTER on the keypad' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل: هل تصمد الصياغة لو استبدلنا الشاشات بلوحة مفاتيح أو موظف بشري؟', en: 'Ask: would the phrasing survive replacing screens with a keypad or a human teller?' },
        { ar: 'الهدف نتيجة يريدها الفاعل في العالم؛ والبقية خطوات واجهة.', en: 'A goal is a result the actor wants in the world; the others are UI steps.' },
        { ar: 'الخياران (a) و(d) يصفان حركات أصابع؛ و(c) يصف حركة عين على شاشة.', en: 'Options (a) and (d) describe finger movements; (c) describes eye movement on a screen.' },
        { ar: 'الإجابة هي الهدف نفسه الذي عاش قبل الصراف الآلي وبعده.', en: 'The answer is the goal that existed before the ATM and after it.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-record',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود بعناية ثم اكتب خرجه الحرفي — سجل صغير لحالة استخدام يُطبع حقلًا حقلًا ثم يفحص موقع الفاعل من الحدود.',
        en: 'Read the code carefully and write its exact output — a small use-case record printed field by field, then a check of where the actor sits relative to the boundary.',
      },
      code: `uc = {"actor": "Cardholder", "goal": "Withdraw cash",
      "preconditions": ["ATM has cash"],
      "steps": ["The Cardholder enters a PIN.",
                "The system dispenses the cash."]}
print("actor:", uc["actor"])
print("goal:", uc["goal"])
print("steps:", len(uc["steps"]))
inside = uc["actor"] in ("ATM software", "database", "PIN pad")
print("actor outside the system:", not inside)`,
      answer: `actor: Cardholder
goal: Withdraw cash
steps: 2
actor outside the system: True`,
      solution: `uc = {"actor": "Cardholder", "goal": "Withdraw cash",
      "preconditions": ["ATM has cash"],
      "steps": ["The Cardholder enters a PIN.",
                "The system dispenses the cash."]}
print("actor:", uc["actor"])
print("goal:", uc["goal"])
print("steps:", len(uc["steps"]))
inside = uc["actor"] in ("ATM software", "database", "PIN pad")
print("actor outside the system:", not inside)`,
      hints: [
        { ar: 'اطبع الأسطر واحدًا واحدًا بنفس ترتيب الكود.', en: 'Trace the lines one at a time, in code order.' },
        { ar: 'len(uc["steps"]) يعدّ عناصر القائمة لا كلماتها.', en: 'len(uc["steps"]) counts the list items, not their words.' },
        { ar: 'الشرط inside يفحص هل الاسم في قائمة مكونات داخلية — وCardholder ليس فيها.', en: 'inside checks whether the name is in a list of internal components — Cardholder is not in it.' },
        { ar: 'not False تُطبع True في السطر الأخير.', en: 'not False prints True on the last line.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-primary',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: الفاعل الذي يبدأ حالة الاستخدام ليصل إلى هدفه هو الـ ____ actor — بعكس supporting actor الذي تُستدعيه المنظومة للإسناد فقط. (كلمة إنجليزية واحدة)',
        en: 'Complete the term: the actor who initiates the use case to reach their own goal is the ____ actor — as opposed to the supporting actor, called on for assistance only. (one English word)',
      },
      answer: 'primary',
      solution: 'primary',
      hints: [
        { ar: 'هو صاحب الهدف الذي تدور حوله القصة كلها.', en: 'It is the goal-holder the whole story revolves around.' },
        { ar: 'المقابل له هو supporting؛ والمطلوب الصفة الأخرى.', en: 'Its counterpart is supporting; you need the other adjective.' },
        { ar: 'في جدول الفاعل-الهدف، تُوسَم كل حالة بهذا النوع.', en: 'In the actor-goal table, every case is tagged with this kind of actor.' },
        { ar: 'الكلمة: primary.', en: 'The word: primary.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `REQUIRED_FIELDS = ("actor", "goal", "preconditions", "steps")

def validate_uc(uc):
    problems = ["missing:" + f for f in REQUIRED_FIELDS if not uc.get(f)]
    return (not problems, problems)

my_uc = {"actor": "Bank Employee",
         "goal": "Reload cash cassettes",
         "preconditions": ["shift started"],
         "steps": ["The Bank Employee opens the cassette bay.",
                   "The system logs the refill."]}

ok, problems = validate_uc(my_uc)
print(my_uc["actor"], "->", my_uc["goal"], ":", "OK" if ok else problems)

# Try: empty the preconditions list, or change a step so nobody acts,
# then re-run. Add a third record for Check Balance and validate it too.`,
      prompt: {
        ar: 'العب بالمحقّق: أفرغ حقلًا، أو اكتب خطوة لا تذكر مَن يفعل، أو أضف حالة Check Balance — وأعد التشغيل لتقرأ الحكم في كل مرة.',
        en: 'Play with the validator: empty a field, write a step that never says who acts, or add a Check Balance record — re-run and read the verdict each time.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1-roles-not-people',
          question: {
            ar: 'شخص واحد: صباحًا يسحب نقودًا من الصراف، ومساءً يعيد تعبئة أشرطته موظفًا للبنك. كم فاعلًا في نظام الصراف؟',
            en: 'One person: in the morning withdraws cash from the ATM, in the evening reloads its cassettes as a bank employee. How many actors does the ATM system have?',
          },
          options: [
            { id: 'a', text: { ar: 'فاعل واحد لأنه شخص واحد', en: 'One — it is one person' } },
            { id: 'b', text: { ar: 'فاعلان: Cardholder وBank Employee — دوران لا شخصان', en: 'Two: Cardholder and Bank Employee — roles, not people' } },
            { id: 'c', text: { ar: 'ثلاثة فواعل', en: 'Three' } },
            { id: 'd', text: { ar: 'لا فاعلين لأن الصراف نظام', en: 'None — the ATM is a system' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الفاعل دور لا شخص؛ الشخص نفسه يلعب دورين مختلفين عند الحد نفسه، وتسمية الدور تجعل الحالة مستقرة حين تتغير الهيكلة الوظيفية.',
            en: 'An actor is a role, not a person; the same human plays two different roles at the same boundary, and naming the role keeps the use case stable when the org chart changes.',
          },
        },
        {
          id: 'q2-revisit-ch3',
          question: {
            ar: 'في الفصل 3 جمعنا الاحتياجات في مصنوع يتسع لبطاقة فهرسة واحدة. ما هو، وما الذي تفعله به حالة الاستخدام؟',
            en: 'In Chapter 3 we gathered needs into an artifact that fits on an index card. What is it, and what does a use case do with it?',
          },
          options: [
            { id: 'a', text: { ar: 'قصة مستخدم (user story) — وحالة الاستخدام تُفكّ ضغطها إلى قصة كاملة بمسارات الفشل', en: 'A user story — the use case un-compresses it into a full story including failure paths' } },
            { id: 'b', text: { ar: 'سبرنت — وتقسمه إلى مهام', en: 'A sprint — the use case splits it into tasks' } },
            { id: 'c', text: { ar: 'مخطط طبقات — وتوزع عليه المسؤوليات', en: 'A layer diagram — the use case assigns responsibilities to it' } },
            { id: 'd', text: { ar: 'سجل اختبارات — وتتحقق منه', en: 'A test log — the use case verifies it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'القصة تجيب من/ماذا/لماذا في سطر؛ وحالة الاستخدام تُفكّ هذا الضغط إلى سرد كامل يجيب أيضًا عن «ماذا لو أخطأ كل شيء».',
            en: 'The story answers who/what/why in one line; the use case un-compresses that into a complete narrative that also answers "what if everything goes wrong".',
          },
        },
        {
          id: 'q3-goal-survives-ui',
          question: {
            ar: 'أي هدف ينجو من إعادة تصميم الواجهة كاملة؟',
            en: 'Which goal survives a complete UI redesign?',
          },
          options: [
            { id: 'a', text: { ar: 'Click the Withdraw button', en: 'Click the Withdraw button' } },
            { id: 'b', text: { ar: 'Withdraw cash', en: 'Withdraw cash' } },
            { id: 'c', text: { ar: 'Type 4 digits in the PIN field', en: 'Type 4 digits in the PIN field' } },
            { id: 'd', text: { ar: 'Press ENTER twice', en: 'Press ENTER twice' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الهدف نتيجة في العالم؛ سحب النقد وُجد قبل الصراف الآلي وبعده — والبقية شاشات وأزرار تموت بإعادة التصميم.',
            en: 'A goal is a result in the world; withdrawing cash existed before the ATM and after it — the rest are screens and buttons that die with a redesign.',
          },
        },
        {
          id: 'q4-postconditions',
          question: {
            ar: 'ماذا تصف الشروط اللاحقة (postconditions)؟',
            en: 'What do postconditions describe?',
          },
          options: [
            { id: 'a', text: { ar: 'ما يجب أن يحدث قبل أول خطوة', en: 'What must happen before the first step' } },
            { id: 'b', text: { ar: 'ما يجب أن يبقى صحيحًا بعد انتهاء الحالة، في النجاح والفشل معًا', en: 'What must remain true after the case ends, in success and failure alike' } },
            { id: 'c', text: { ar: 'ما يُخزَّن في قاعدة البيانات فقط', en: 'What gets stored in the database only' } },
            { id: 'd', text: { ar: 'ما يراه المبرمج داخل الكود', en: 'What the programmer sees inside the code' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قسمان: ضمانة النجاح وضمانة الفشل؛ الثانية غالبًا الأهم لأنها الثابتة التي ستفرضها الاختبارات ومعالجة الأخطاء.',
            en: 'Two sections: a success guarantee and a failure guarantee; the latter is often the more important — the invariant your tests and error handling will enforce.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'سمّ الفاعل باسم شخص: «أحمد يبدأ العملية» / naming the person: "Ahmed starts the operation"',
          right: 'سمّ الدور: Cardholder — الأدوار تثبت حين تتغير الهيكلة الوظيفية / name the role: Cardholder',
          note: {
            ar: 'الفاعل دور لا شخص؛ الشخص نفسه قد يلعب أدوارًا عدة، وأشخاص عدة قد يلعبون الدور نفسه.',
            en: 'An actor is a role, not a person; one human may play several roles and several humans may share one role.',
          },
        },
        {
          wrong: 'هدف مكتوب كخطوة واجهة: «Click the Withdraw button» / a goal written as a UI step',
          right: 'هدف كنتيجة في العالم: «Withdraw cash» / a goal as a result in the world: "Withdraw cash"',
          note: {
            ar: 'صياغة الأهداف كأفعال واجهة تدمج قرارات تصميم مبكرة في المتطلبات وتحجب بدائل تنفيذ أخرى.',
            en: 'Phrasing goals as UI actions bakes premature design into requirements and forecloses other implementations.',
          },
        },
        {
          wrong: 'خطوات تصف الأحشاء: «المتحكم يستطلع طابور الموزّع» / steps describing internals: "the controller polls the dispenser queue"',
          right: 'خطوات عند حد النظام: ما يُدخله الفاعل وما يسترجعه / steps at the boundary: what the actor sends in and gets back',
          note: {
            ar: 'خطوات الأحشاء تمنع أصحاب المصلحة من التحقق وتربط المتطلبات بتنفيذ واحد.',
            en: 'Internal steps make the case impossible for stakeholders to validate and tie requirements to one implementation.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'الفاعل دور خارج حد النظام: أساسي يملك الهدف، ومساند يُستدعى للإنجاز.',
          en: 'An actor is a role outside the system boundary: a primary one owns the goal, a supporting one is called on to help.',
        },
        {
          ar: 'الهدف نتيجة في العالم تنجو من إعادة تصميم الواجهة؛ وجدول الفاعل-الهدف مسودة النظام في صفحة واحدة.',
          en: 'A goal is a result in the world that survives a UI redesign; the actor-goal list is the system outlined on one page.',
        },
        {
          ar: 'التدفق الأساسي هو المسار السعيد المرقّم — اكتبه أولًا ليتعلق به كل انحراف لاحقًا.',
          en: 'The basic flow is the numbered happy path — write it first so every later deviation can hang off it.',
        },
        {
          ar: 'preconditions قبل البداية وpostconditions بعد النهاية؛ الحالة الاستخدامية قصة كاملة، والسيناريو مسار واحد منها.',
          en: 'Preconditions hold before the start, postconditions after the end; a use case is the full story and a scenario is one path through it.',
        },
      ],
      reflectPrompt: {
        ar: 'خذ ميزة من مشروعك واكتب هدفها في سطر بصيغة نتيجة في العالم، ثم طبّق اختبار الواجهة: هل تصمد الصياغة لو غيّرت الشاشات كلها؟',
        en: 'Take one feature from your project, state its goal in one line as a result in the world, then apply the UI test: does the phrasing survive if you replace every screen?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch5.s1', pages: 'ص124-127 / pp.124-127' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch5.s1', pages: 'ص124-127 / pp.124-127' },
  ],
} satisfies Lesson;

export default lesson;
