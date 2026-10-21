/**
 * Lesson swe.ch5.l3 — كتابة حالات الاستخدام ورسمها / Writing Use Cases and Diagramming Them
 * Book: SWE — Chapter 5 'Use Cases'
 *   §5.3 Writing Use Cases (pp.129-133), §5.4 Use-Case Diagrams (pp.133-135)
 * Runnable design: a fixed use-case "step linter" — checks each step starts
 *   with a known imperative verb and leaks no UI-widget words — printing
 *   per-step verdicts plus a clean/total count line.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch5.l3',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 5,
  title: { ar: 'كتابة حالات الاستخدام ورسمها', en: 'Writing Use Cases and Diagramming Them' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch5.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'سلّمت حالة الاستخدام لأمين صندوق بنك ليصادق عليها. وصل إلى الخطوة الثالثة: «يقارن النظام SHA-256 للرقم المدخل مع المخزَّن» — وغاب عنه الموضوع. إنكما لا تتحدثان اللغة نفسها: أنت تصف تصميمًا، وهو يريد أن يفهم خدمة. حالة الاستخدام جيدة حين يستطيع خبير المجال قراءتها وتصحيحها — وكل خطوة عند حد النظام: ما يُدخل، وما يُرجَع.',
        en: 'You hand a bank teller your use case to confirm. Step three reads: "the system compares the SHA-256 of the entered digits against the stored hash" — and you lose him. You are not speaking the same language: you are describing design; he wants to understand a service. A use case is good when a domain expert can read and correct it — every step at the system boundary: what goes in, what comes back.',
      },
    },
    {
      kind: 'predict',
      code: `UI_WORDS = ("button", "field", "tap", "hash", "SHA-256")
steps = [
    "The Cardholder authenticates.",
    "The Cardholder taps ENTER; the system SHA-256-hashes the digits.",
    "The Cardholder enters a PIN; the system validates it.",
]
for i, s in enumerate(steps, 1):
    hits = [w for w in UI_WORDS if w in s]
    print(f"step{i}", "ui-leaks:" + ",".join(hits) if hits else "clean-so-far")`,
      question: {
        ar: 'ثلاث صياغات لنفس الخطوة. الفاحص يبحث عن كلمات واجهة فقط: أيها سينجو؟ وهل النجاة من الفحص كافية لتصديق الخطوة؟',
        en: 'Three phrasings of the same step. The checker looks only for UI words: which one passes? And is passing the checker enough to trust a step?',
      },
      reveal: {
        ar: 'الخطوة (a) التعبيرية نظيفة ظاهريًا لكنها غير قابلة للاختبار: ماذا يحدث فعلًا؟ الفاحص يقبض على التسريب الملموس (tap وhash وSHA-256) لا على الغموض — والغموض يُصار إليه بسؤال المراجع: ما أصغر تبادلة ملحوظة تخدم نية الفاعل؟',
        en: 'The vague step (a) looks clean but is untestable: what actually happens? The checker catches concrete leaks (tap, hash, SHA-256), not vagueness — vagueness needs the reviewer\'s question: what is the smallest observable exchange serving the actor\'s intention?',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'القالب: قائمة تحقق متنكرة في هيئة وثيقة', en: 'The template: a checklist wearing a document\'s costume' },
      chunks: [
        {
          ar: 'القالب (template) يضمن ألا تنسى شيئًا. حقوله الثابتة: اسم الحالة، الفاعل الأساسي، الفاعلون المساندون، النطاق (scope)، المستوى، الخلاصة (brief)، أصحاب المصلحة ومصالحهم، الشروط المسبقة، المُحفِّز (trigger) وهو الحدث الذي يبدأ الحالة، التدفق الأساسي، اللواحق البديلة، ثم قسمان يهملهم المبتدئون: الشروط اللاحقة عند النجاح، والشروط اللاحقة عند الفشل.',
          en: 'A template is a checklist wearing the costume of a document; it guarantees you forget nothing. Its fixed fields: the name, the primary actor, supporting actors, scope, level, the brief, stakeholders and interests, preconditions, the trigger — the event that starts the case — the basic flow, the alternative flows, and the two sections beginners skip: postconditions on success, and postconditions on failure.',
        },
        {
          ar: 'قسم الفشل غالبًا الأهم: وعد مثل «لا نقود تخرج دون خصم مطابق» يهتم به البنك أكثر من المسار السعيد. كتابته تجبرك على أن تقرر مسبقًا ما يبقى صحيحًا حين يتعطل كل شيء — وهي بالضبط الثابتة (invariant) التي ستفرضها معالجة الأخطاء والاختبارات لاحقًا. ويمكن اختبارها قبل وجود بنك حقيقي: افصل الاتصال عند الخطوة 8 وتحقق من العود بحرفه.',
          en: 'The failure section is often the more important: a promise like "no money out without a matching debit" matters to the bank more than the happy path. Writing it forces you to decide, in advance, what must remain true when everything breaks — exactly the invariant your error handling and tests will enforce. And it is testable before any real bank exists: drop the link at step 8 and check the postcondition word for word.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'مستوى النية: لا مبهم غير قابل للاختبار ولا تصميم مسرّب', en: 'The intention level: neither too vague to test nor leaking design' },
      chunks: [
        {
          ar: 'اكتب كل خطوة عند مستوى النية، بالتناوب على سؤالين: ماذا ينوي الفاعل هنا؟ — يبقي الخطوة موجّهة للهدف. وما أصغر تبادلة ملحوظة تخدم تلك النية؟ — يبقيها قابلة للاختبار. المقارنة الثلاثية: «يصادق» مبهمة لا تُختبر؛ و«يكتب أربعة أرقام في حقل PIN والنظام SHA-256 لهما» تصميم يحظر لوحة المفاتيح والبصمة؛ و«يُدخل PIN والنظام يتحقق منه مع نظام البنك» — ملحوظة، قابلة للاختبار، خالية من التنفيذ.',
          en: 'Write each step at the intention level, alternating two questions: what does the actor intend here? — keeps the step goal-directed. What is the smallest observable interaction serving that intention? — keeps it testable. Three ways to write one step: "authenticates" is too vague to test; "types four digits into the PIN field and the system SHA-256-hashes them" is design that forbids keypads and biometrics; "enters a PIN; the system validates it with the bank" is observable, testable, implementation-free.',
        },
        {
          ar: 'وللبناء ثلاث مرات، لا كتابة دفعة واحدة: المرور الأول جدول الفاعل-الهدف — اتساع كامل النظام. والثاني المسار السعيد فقط: من 3 إلى 10 خطوات يستطيع خبير المجال تصديقها؛ فإن جاوزت عقدة فحالتك حالتان متنكرتان في معطف — قسّمها. والثالث مسح منهجي: عند كل خطوة اسأل ماذا يمكن أن يحدث بدلًا؟ فتصير كل إجابة لاحقة خاصة أو محدودة أو نقطة امتداد.',
          en: 'Build in three passes, not one top-to-bottom sweep: pass one the actor-goal table — breadth for the whole system. Pass two the happy path only: 3 to 10 steps a domain expert can confirm; past a dozen, your case is two cases in a trench coat — split it. Pass three a systematic sweep: at each step ask what else could happen — each answer becomes a specific alternative, a bounded one, or an extension point.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المخطط: فهرس لا مواصفة', en: 'The diagram: an index, not a specification' },
      chunks: [
        {
          ar: 'مخطط حالات الاستخدام (use-case diagram) خريطة بصرية بمعجم صغير: الفاعل البشري شخصية عصا، والنظام غير البشري صندوق مسمّى؛ وحالة الاستخدام بيضاوية (oval) تحمل اسم هدف؛ والارتباط (association) خط مستقيم يصل الفاعل بكل حالة يشارك فيها؛ وحد النظام يُرسم صندوقًا يضم البيضاويات. كل شيء آخر — الخطوات والترتيب والشروط — يبقى في النص، لأن المخطط فهرس للأهداف والفاعلين لا سرد لها.',
          en: 'A use-case diagram is a visual map with a tiny vocabulary: human actors are stick figures and non-human systems labeled boxes; a use case is an oval labeled with a goal; an association is a plain line from an actor to each use case they join; and the system boundary is a box containing the ovals. Everything else — steps, order, conditions — stays in the text, because the diagram indexes goals and actors rather than narrating them.',
        },
        {
          ar: 'الخطأ الباهظ: حشر ترتيب الخطوات والحلقات والشروط في عشرات الأسهم المسماة بين البيضاويات؛ الناتج عقدة غير قابلة للقراءة تقول أقل من قائمة الحالات التي حلّت محلها. المخطط ليس مخطط تدفق: الترتيب في التدفقات المرقّمة، والشروط في اللواحق. ما يعرضه المخطط فقط: أي الفاعلين يصلون إلى أي الأهداف، وكيف ترتبط الأهداف ببعضها — مثل تضمين Authenticate Cardholder في حالتين.',
          en: 'The costly mistake: cramming step order, loops, and conditions into dozens of labeled arrows between ovals — an unreadable tangle that says less than the plain list of use cases it replaced. A use-case diagram is not a flowchart: order lives in the numbered flows, conditions in the alternatives. The diagram shows only which actors reach which goals, and how goals relate — e.g. two cases both including Authenticate Cardholder.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'محرّك الخطوات: فعل أمر في البدء، ولا تسريب واجهة', en: 'The step linter: verb-first, no UI leaks' },
      code: `VERBS = ("insert", "enter", "select", "confirm", "dispense",
         "return", "print", "read", "display", "prompt", "validate")
UI_WORDS = ("button", "click", "field", "tap", "hash")

def lint_step(step):
    words = step.split()
    problems = []
    if not words or words[0].lower() not in VERBS:
        problems.append("no-verb-start")
    leaks = [w for w in UI_WORDS if w in step.lower()]
    if leaks:
        problems.append("ui:" + ",".join(leaks))
    return problems

steps = ["Insert a bank card.",
         "Click the Withdraw button.",
         "SHA-256-hash the typed digits.",
         "Dispense the cash."]
for i, s in enumerate(steps, 1):
    verdict = lint_step(s) or ["clean"]
    print(f"step{i}:", " ".join(verdict))
print("clean:", sum(1 for s in steps if not lint_step(s)), "/", len(steps))`,
      explanation: {
        ar: 'المحرّك يقبل الخطوة إن بدأت بفعل أمر من قائمة الأفعال ولم يسرّب كلمات واجهة (button، click، field، tap، hash). السليمة تُطبع clean والمخالفة تُطبع أسبابها معًا. الفحص آلي ومحدود: يقبض على التسريب الملموس، أما المبهم — مثل «يصادق» — فيحتاج مراجعًا يسأل: ما الملاحَظ القابل للقياس هنا؟',
        en: 'The linter accepts a step that starts with an imperative verb from its list and leaks no UI words (button, click, field, tap, hash). Clean steps print clean; violations print all their reasons together. The check is mechanical and limited: it catches concrete leaks, while vagueness — like "authenticates" — needs a reviewer asking: what is observable here?',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.lint-uc',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'اكتب دالة lint_uc(steps) تطبّق فحصين على كل خطوة بالترتيب: البدء بفعل من VERBS وإلا أضف no-verb-start؛ ثم كلمات الواجهة وإلا أضف ui:كلمات مفصولة بفواصل. اطبع لكل خطوة stepN: clean أو الأسباب مفصولة بمسافة، وزد عدّاد السليمين، ثم اطبع في النهاية سطر العدّ clean: X / Y. شغّلها على الخطوات الثلاث المعطاة.',
        en: 'Write lint_uc(steps) applying two checks per step, in order: starting with a verb from VERBS, else add no-verb-start; then UI words, else add ui:words (comma-joined). Print per step: stepN: clean or the space-joined reasons; count clean steps; finally print the totals line clean: X / Y. Run it on the three given steps.',
      },
      starterCode: `VERBS = ("insert", "enter", "select", "confirm", "dispense",
         "return", "print", "read", "display", "prompt", "validate")
UI_WORDS = ("button", "click", "field", "tap", "hash")

def lint_uc(steps):
    clean = 0
    for i, s in enumerate(steps, 1):
        problems = []
        # TODO 1: verb check -> 'no-verb-start'
        # TODO 2: UI leaks -> 'ui:' + ",".join(leaks)
        # TODO 3: print the verdict line; count clean steps
        pass
    # TODO 4: print the totals line: clean: X / Y
    return clean

uc_steps = ["Insert a bank card.", "Tap the amount field.", "Dispense the cash."]
lint_uc(uc_steps)`,
      solution: `VERBS = ("insert", "enter", "select", "confirm", "dispense",
         "return", "print", "read", "display", "prompt", "validate")
UI_WORDS = ("button", "click", "field", "tap", "hash")

def lint_uc(steps):
    clean = 0
    for i, s in enumerate(steps, 1):
        problems = []
        if not s.split() or s.split()[0].lower() not in VERBS:
            problems.append("no-verb-start")
        leaks = [w for w in UI_WORDS if w in s.lower()]
        if leaks:
            problems.append("ui:" + ",".join(leaks))
        if problems:
            print(f"step{i}:", " ".join(problems))
        else:
            clean += 1
            print(f"step{i}: clean")
    print("clean:", clean, "/", len(steps))
    return clean

uc_steps = ["Insert a bank card.", "Tap the amount field.", "Dispense the cash."]
lint_uc(uc_steps)`,
      tests: [
        {
          id: 't1',
          name: { ar: 'تلتقط خطوة الواجهة المخالفة', en: 'catches the violating UI step' },
          code: `assert 'step2: no-verb-start ui:field,tap' in __learner_output__, 'expected: step2: no-verb-start ui:field,tap | actual: %r' % __learner_output__`,
        },
        {
          id: 't2',
          name: { ar: 'تطبع العدّ الصحيح', en: 'prints the correct totals line' },
          code: `assert 'clean: 2 / 3' in __learner_output__, 'expected: clean: 2 / 3 | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'فحص البدء: s.split()[0].lower() مقارنة بعناصر VERBS — واحذر القائمة الفارغة قبل أخذ العنصر الأول.', en: 'Start check: s.split()[0].lower() against VERBS — guard the empty list before taking element zero.' },
        { ar: 'فحص الواجهة: leaks = [w for w in UI_WORDS if w in s.lower()] ثم أضفها بمفتاح ui: فقط إن لم تكن فارغة.', en: 'UI check: leaks = [w for w in UI_WORDS if w in s.lower()], then append under the ui: key only if non-empty.' },
        { ar: 'الطباعة: إن problems فاطبعها مفصولة بمسافة بعد step{i}:، وإلا اطبع clean وزد العدّ.', en: 'Printing: if problems, print them space-joined after step{i}:; else print clean and bump the counter.' },
        { ar: 'قريب من الحل: بعد الحلقة — print("clean:", clean, "/", len(steps)). والسطر المتوقع للخطوة الثانية: step2: no-verb-start ui:field,tap', en: 'Near-solution: after the loop — print("clean:", clean, "/", len(steps)). Expected line for step two: step2: no-verb-start ui:field,tap' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-diagram',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ما الذي لا يعرضه مخطط حالات الاستخدام أبدًا؟',
        en: 'What does a use-case diagram never show?',
      },
      options: [
        { id: 'a', text: { ar: 'الفاعلين كشخصيات عصا', en: 'Actors as stick figures' } },
        { id: 'b', text: { ar: 'الأهداف كبيضاويات مسماة', en: 'Goals as labeled ovals' } },
        { id: 'c', text: { ar: 'ترتيب الخطوات زمانيًا', en: 'The temporal order of steps' } },
        { id: 'd', text: { ar: 'صندوق حدود النظام', en: 'The system boundary box' } },
      ],
      answer: 'c',
      solution: 'c',
      hints: [
        { ar: 'ثلاثة من الخيارات عناصر أساسية في معجم المخطط.', en: 'Three of the options are core vocabulary of the notation.' },
        { ar: 'المخطط فهرس: من يصل إلى أي هدف — لا متى وبأي ترتيب.', en: 'The diagram is an index: who reaches which goal — not when, nor in what order.' },
        { ar: 'لو رأيت أسهم ترتيب بين البيضاويات فقد تحول المخطط إلى مخطط تدفق — وهذا سوء استخدام.', en: 'Arrows showing order between ovals turn the diagram into a flowchart — a misuse.' },
        { ar: 'الإجابة: ترتيب الخطوات — بيتُه التدفق المرقّم في النص.', en: 'The answer: step order — its home is the numbered flow in the text.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-notation',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود ثم اكتب خرجه الحرفي: معجم المخطط مطبوعًا بعنصر بعنصر.',
        en: 'Read the code and write its exact output: the diagram vocabulary printed element by element.',
      },
      code: `notation = {"actor": "stick figure", "use case": "oval",
            "system boundary": "box", "association": "plain line"}
for key in ("actor", "use case", "system boundary", "association"):
    print(key, "=", notation[key])`,
      answer: `actor = stick figure
use case = oval
system boundary = box
association = plain line`,
      solution: `notation = {"actor": "stick figure", "use case": "oval",
            "system boundary": "box", "association": "plain line"}
for key in ("actor", "use case", "system boundary", "association"):
    print(key, "=", notation[key])`,
      hints: [
        { ar: 'الحلقة تمشي على المفاتيح بالترتيب المكتوب لا بترتيب الإدراج.', en: 'The loop walks the keys in the written tuple order, not insertion order.' },
        { ar: 'كل سطر ثلاث قطع مفصولة بمسافات: المفتاح، علامة =، القيمة.', en: 'Each line is three pieces space-joined: the key, an = sign, the value.' },
        { ar: 'المفتاح الثالث مركّب بمسافة: system boundary.', en: 'The third key contains a space: system boundary.' },
        { ar: 'قيم على الترتيب: stick figure، oval، box، plain line.', en: 'Values in order: stick figure, oval, box, plain line.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-postcondition',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: القسم الذي يصوغ ما يبقى صحيحًا حتى عند فشل التدفق — مثل «لا نقود تخرج دون خصم مطابق» — هو failure ______. (كلمة إنجليزية واحدة)',
        en: 'Complete the term: the section stating what must remain true even when the flow fails — e.g. "no money out without a matching debit" — is the failure ______. (one English word)',
      },
      answer: 'postcondition',
      solution: 'postcondition',
      hints: [
        { ar: 'هو الثابت الذي تفرضه معالجة الأخطاء والاختبارات لاحقًا.', en: 'It is the invariant your error handling and tests will later enforce.' },
        { ar: 'في القالب قسمان منه: عند النجاح وعند الفشل.', en: 'The template has two of them: on success and on failure.' },
        { ar: 'post تسبق الشرط الذي يبقى بعد الانتهاء.', en: 'post precedes the condition that holds after the end.' },
        { ar: 'الكلمة: postcondition.', en: 'The word: postcondition.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `VERBS = ("insert", "enter", "select", "confirm", "dispense",
         "return", "print", "read", "display", "prompt", "validate")
UI_WORDS = ("button", "click", "field", "tap", "hash")

def lint_step(step):
    problems = []
    if not step.split() or step.split()[0].lower() not in VERBS:
        problems.append("no-verb-start")
    leaks = [w for w in UI_WORDS if w in step.lower()]
    if leaks:
        problems.append("ui:" + ",".join(leaks))
    return problems

mine = ["Enter a PIN.", "Validate the PIN with the bank.", "Print a receipt."]
for i, s in enumerate(mine, 1):
    print(f"step{i}:", " ".join(lint_step(s) or ["clean"]))
# Try adding: 'Tap the Submit button.'  or a too-vague one: 'Authenticate.'
# then re-run and read each verdict.`,
      prompt: {
        ar: 'جرّب المحرّك على خطواتك: أضف خطوة تبدأ بفعل غريب، وخطوة فيها أزرار، وخطوة مبهمة قصيرة — واقرأ حكم كل واحدة، ثم أعد كتابة المخالفات بمستوى النية.',
        en: 'Try the linter on your own steps: add one starting with an odd verb, one full of buttons, one too vague — read each verdict, then rewrite the offenders at the intention level.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1-failure-postcondition',
          question: {
            ar: 'أي حقل في القالب يصوغ وعدًا مثل: «لا نقود تخرج دون خصم مطابق»؟',
            en: 'Which template field states a promise like: "no money out without a matching debit"?',
          },
          options: [
            { id: 'a', text: { ar: 'المُحفِّز (trigger)', en: 'The trigger' } },
            { id: 'b', text: { ar: 'الشروط اللاحقة عند الفشل', en: 'The postconditions on failure' } },
            { id: 'c', text: { ar: 'النطاق (scope)', en: 'The scope' } },
            { id: 'd', text: { ar: 'أصحاب المصلحة ومصالحهم', en: 'Stakeholders and interests' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'ضمانة الفشل هي الثابتة التي يجب أن تبقى صحيحة حين يتعطل كل شيء — وهي غالبًا الأهم للبنك والاختبارات.',
            en: 'The failure guarantee is the invariant that must hold when everything breaks — often the one the bank and the tests care about most.',
          },
        },
        {
          id: 'q2-revisit-ch3',
          question: {
            ar: 'قصة المستخدم في الفصل 3 ضغطت من/ماذا/لماذا في سطر واحد. كيف تتعامل معها حالة الاستخدام؟',
            en: 'A Chapter 3 user story compressed who/what/why into one line. How does a use case treat it?',
          },
          options: [
            { id: 'a', text: { ar: 'تحذفها وتستبدل بها', en: 'Deletes and replaces it' } },
            { id: 'b', text: { ar: 'تُفكّ ضغطها إلى سرد كامل بمسارات النجاح والفشل', en: 'Un-compresses it into a full narrative with success and failure paths' } },
            { id: 'c', text: { ar: 'تطوّلها بأسطر أكثر دون معنى جديد', en: 'Stretches it into more lines with no new meaning' } },
            { id: 'd', text: { ar: 'ترسلها إلى فريق الاختبار كما هي', en: 'Sends it to the testers as-is' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الضغط ميزة عند الترتيب وعيب عند البناء؛ الحالة تنكوّيه إلى قصة تُصادق عليها وتُختبر.',
            en: 'Compression helps ordering and hurts building; the use case un-compresses it into a story a stakeholder can confirm and a tester can use.',
          },
        },
        {
          id: 'q3-intention-level',
          question: {
            ar: 'أي صياغة للخطوة واقعة في المستوى الصحيح — لا مبهمة ولا مسرّبة للتصميم؟',
            en: 'Which step phrasing sits at the right level — neither too vague nor leaking design?',
          },
          options: [
            { id: 'a', text: { ar: 'يصادق العميل.', en: 'The customer authenticates.' } },
            { id: 'b', text: { ar: 'يكتب أربعة أرقام في حقل PIN والنظام يضغطهما SHA-256.', en: 'Types four digits into the PIN field; the system SHA-256-hashes them.' } },
            { id: 'c', text: { ar: 'يُدخل PIN والنظام يتحقق منه مع نظام البنك.', en: 'Enters a PIN; the system validates it with the bank.' } },
            { id: 'd', text: { ar: 'النظام يستدعي الدالة verify().', en: 'The system calls the verify() function.' } },
          ],
          answer: 'c',
          explanation: {
            ar: '(a) غير قابلة للاختبار، و(b) تحظر البصمة ولوحة المفاتيح، و(d) تصميم خالص؛ و(c) تبادلة ملحوظة عند الحد تنجو من إعادة التصميم.',
            en: '(a) is untestable, (b) forbids biometrics and keypads, (d) is pure design; (c) is an observable boundary exchange that survives redesign.',
          },
        },
        {
          id: 'q4-diagram-not-flowchart',
          question: {
            ar: 'زميلك رسم سهمين بين بيضاويتين مع شرط على السهم: «اسحب قبل طباعة الإيصال». أين المكان الصحيح لهذا الترتيب والشرط؟',
            en: 'A colleague drew arrows between two ovals with a condition on one: "withdraw before print receipt". Where do that order and condition actually belong?',
          },
          options: [
            { id: 'a', text: { ar: 'في المخطط نفسه مع أسهم أكثر', en: 'In the diagram itself, with more arrows' } },
            { id: 'b', text: { ar: 'في التدفق الأساسي المرقّم وفي لاحقة بديلة — فالمخطط فهرس لا مخطط تدفق', en: 'In the numbered basic flow and an alternative — the diagram is an index, not a flowchart' } },
            { id: 'c', text: { ar: 'في قاعدة البيانات', en: 'In the database' } },
            { id: 'd', text: { ar: 'لا مكان لهما في أي وثيقة', en: 'Nowhere in any document' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الترتيب والشروط معلومات سردية تعيش في النص المرقّم؛ المخطط الذي يتحدث بالترتيب يصير عقدة تقول أقل من القائمة.',
            en: 'Order and conditions are narrative data living in numbered text; a diagram that speaks in order becomes a tangle saying less than the list it replaced.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'خطوات داخلية: «المتحكم يستطلع طابور الموزّع» / internal steps: "the controller polls the dispenser queue"',
          right: 'خطوات عند الحد: ما يرسله الفاعل وما يستقبله / boundary steps: what the actor sends and what comes back',
          note: {
            ar: 'خطوات الأحشاء تمنع أصحاب المصلحة من التحقق وتقيّد التنفيذ بقرار واحد.',
            en: 'Internal steps block stakeholder validation and nail the requirements to one implementation.',
          },
        },
        {
          wrong: 'قسم نجاح واحد بلا ضمانة فشل / a success postcondition with no failure guarantee',
          right: 'اكتب الضمانتين معًا — والفشل غالبًا الأهم / write both — the failure one is usually the more important',
          note: {
            ar: 'ضمانة الفشل تُختبر قبل وجود أي بنك حقيقي: افصل الاتصال وتحقق من العود.',
            en: 'The failure guarantee is testable before any real bank exists: drop the link and check the promise.',
          },
        },
        {
          wrong: 'مخطط بعشرات الأسهم المسماة للترتيب والشروط / a diagram with dozens of labeled order arrows',
          right: 'بيضاويات وشخصيات وخطوط فقط؛ والترتيب في النص المرقّم / ovals, stick figures, plain lines; order lives in numbered text',
          note: {
            ar: 'المخطط فهرس لا مواصفة؛ عشرات الأسهم تقول أقل من قائمة الحالات.',
            en: 'The diagram indexes, it does not specify; dozens of arrows say less than the plain list.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'القالب قائمة تحقق: لا preconditions بلا مراجعة، ولا حالة بلا قسمَي postconditions — نجاحًا وفشلًا.',
          en: 'The template is a checklist: no unreviewed preconditions, no case without both postcondition sections — success and failure.',
        },
        {
          ar: 'اكتب عند مستوى النية: سؤال النية ثم أصغر تبادلة ملحوظة — لا غموض ولا تفاصيل واجهة أو تنفيذ.',
          en: 'Write at the intention level: ask the intent, then the smallest observable exchange — no vagueness, no UI or implementation detail.',
        },
        {
          ar: 'ثلاث مرات: فاعلون وأهداف، ثم المسار السعيد، ثم مسح منهجي للانحرافات عند كل خطوة.',
          en: 'Three passes: actors and goals, then the happy path, then a systematic sweep for deviations at every step.',
        },
        {
          ar: 'المخطط فهرس: شخصيات عصا وبيضاويات وصندوق وخطوط — والترتيب والشروط تسكن النص.',
          en: 'The diagram is an index: stick figures, ovals, a boundary box, plain lines — order and conditions live in the text.',
        },
      ],
      reflectPrompt: {
        ar: 'خذ ثلاث خطوات من أي وثيقة كتبتها وصنّفها: مبهمة، مسرّبة، أم في المستوى الصحيح؟ أعد كتابة المخالفة بمستوى النية.',
        en: 'Take three steps from any document you wrote and classify them: vague, leaking, or right-level? Rewrite the offender at the intention level.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch5.s3', pages: 'ص129-133 / pp.129-133' },
        { book: 'SWE', section: 'swe.ch5.s4', pages: 'ص133-135 / pp.133-135' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch5.s3', pages: 'ص129-133 / pp.129-133' },
    { book: 'SWE', section: 'swe.ch5.s4', pages: 'ص133-135 / pp.133-135' },
  ],
} satisfies Lesson;

export default lesson;
