/**
 * swe.ch13.l3 — السياق بنية تحتية وهندسة الحلقة /
 * Context as Infrastructure and Loop Engineering
 * SWE ch13 — s6 Context as Infrastructure: CLAUDE.md, AGENTS.md, and Skills
 * (ص356 / pp.356) + s7 Loop Engineering (ص358 / pp.358).
 * Runnable design: a deterministic BRIEF-LINT scores AGENTS.md lines (signal /
 * aspiration / noise) and counts load-bearing rules; a LOOP DOCTOR walks the five
 * loop moves and names the anti-pattern of the first missing one.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch13.l3',
  version: 1,
  part: 'II',
  track: 'A9',
  book: 'SWE',
  chapter: 13,
  title: {
    ar: 'السياق بنية تحتية وهندسة الحلقة',
    en: 'Context as Infrastructure and Loop Engineering',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch13.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في أول أسبوع مع الوكيل كان أحمد يعيد الشرح كل صباح: أمر البناء، عتبة الاختبارات، المجلدات الممنوعة. في الأسبوع الثاني كتب ملف AGENTS.md من خمسة عشر سطرًا في جذر المستودع — فقرأه الوكيل تلقائيًا في كل جلسة، وانتهت ضريبة إعادة الشرح. ثم سأل السؤال الأصعب: من يشغّل كل هذا عندما أنام؟ الجواب اسمه هندسة الحلقة.',
        en: 'In his first week with the agent, Ahmad re-explained everything every morning: the build command, the test bar, the off-limits directories. In week two he wrote a fifteen-line AGENTS.md at the repository root — the agent read it automatically at every session, and the re-explaining tax was gone. Then he asked the harder question: who runs all this while I sleep? The answer is called loop engineering.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'السياق بنية تحتية: ملف تعليمات لكل جلسة',
        en: 'Context as infrastructure: one instructions file, every session',
      },
      chunks: [
        {
          ar: 'الوكيل يبدأ كل جلسة لا يعرف شيئًا عن مشروعك: أمر البناء، عتبة الاختبارات، المجلدات المحظورة، معنى "منجز" عند فريقك. إن لصقت الشرح في كل طلب فأنت تسدد دين النية (intent debt) إلى الأبد: كلفة متكررة لشرح ما هو هذا المشروع، وما قواعده، وأين الفخاخ. الحل معيار ظهر عام 2025: ملف تعليمات الوكيل — CLAUDE.md لـ Claude Code، أو AGENTS.md المحايد تقنيًا — ملخص Markdown يُحفظ في المستودع ويُحمَّل تلقائيًا أول كل جلسة. اعتمد AGENTS.md مواصفة مفتوحة تبنته أكثر من 60,000 مشروع وأكثر من عشرين أداة، وتُبرع للمؤسسة في ديسمبر 2025. وهو بقصد مجرد Markdown: بطاقة تعريف للوكلاء.',
          en: 'Out of the box, an agent starts every session knowing nothing about your project: your build command, your test bar, the off-limits directories, what done means on your team. Paste that briefing into every prompt and you pay intent debt forever — the recurring cost of re-explaining what this project is, what the rules are, where the traps are. The fix is a standard that emerged in 2025: an agent instructions file — CLAUDE.md for Claude Code, or the tool-neutral AGENTS.md — a Markdown briefing checked into the repository and loaded automatically at the start of every session. AGENTS.md was formalized as an open spec adopted by more than 60,000 projects and twenty-plus tools, and donated to the Linux Foundation in December 2025. It is deliberately just Markdown: a README for agents.',
        },
        {
          ar: 'كتابته فن كتابة تقنية تحت قيد قاسٍ: الملف يُقرأ كل جلسة، فكل سطر يصرف من ميزانية السياق. إشارة عالية فقط: أدرج ما يغيّر قرارًا فعلًا — أمر البناء، عتبة الاختبارات، المجلدات الممنوعة — لا ما يستطيع الوكيل استنتاجه من الشيفرة. أمر لا أمنية: "لا تستخدم mocks داخلية؛ استخدم المصانع في test/factories/" تضرب "نحاول عمومًا تجنب mocks". قواعد حاملة قليلة: إذا وُسم كل شيء مهمًا فلا شيء مهم. قيود سير العمل: قل متى يتوقف الوكيل ويسأل إنسانًا. وعادة تنجح مع كل الأدوات: اشرح السبب — "لا تسجل أرقام البطاقات الخام، فهي تخرج عن نطاق PCI" تنجو من الترجمة بين الأدوات وتمكّن أي نموذج من تعميم المبدأ على حالات لم تسمها القاعدة. والمهارات (skills) خطوة أبعد: وحدات معرفة مسماة قابلة لإعادة الاستخدام تُستدعى عند الحاجة فقط، وتُدار بإصدارات كأي أثر.',
          en: 'Writing one is technical writing under a hard constraint: the file is read every session, so every line spends context budget. High-signal only: include what materially changes a decision — the build command, the test bar, directories not to touch — not what the agent can infer from the code. Imperative, not aspirational: "never use inline mocks; use the factories in test/factories/" beats "we generally try to avoid mocks". Few load-bearing rules: if everything is marked important, nothing is. Workflow constraints: say when the agent should stop and ask a human. One habit ports everywhere: explain the why — "never log raw card numbers, it violates PCI scope" survives translation between tools and lets any model apply the principle to cases the rule never named. Skills go further: named, reusable units of project knowledge, invoked only when the task calls for them, versioned like any artifact.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'هندسة الحلقة: خمس حركات ومقيّم افتراضه "لا"',
        en: 'Loop engineering: five moves and an evaluator that defaults to no',
      },
      chunks: [
        {
          ar: 'فوق المطالبة الواحدة درجة اسميت في يونيو 2026 من ثلاثة ممارسين في الأسبوع نفسه: هندسة الحلقة — أن تستبدل نفسك: تصمم النظام الذي يطالب الوكيل، فلم تعد تغذيه تعليمة تعليمة. أربع طبقات تحتها: هندسة المطالبة تدير تبادلًا واحدًا، وهندسة السياق نافذة واحدة، وهندسة الحاضنة تشغيلة واحدة (أي أدوات يجوز للوكيل استدعاؤها، ومتى يُعد العمل منتهيًا)، وهندسة الحلقة تدير النظام الذي يعيد تشغيل الحاضنة مرارًا بلا يد بشرية بين الأدوار. وفي كل دورة تجري خمس حركات: الاكتشاف (تجد عملها بنفسها من أخطاء CI والتذاكر)، والتسليم (كل مهمة في مساحة عمل معزولة)، والتحقق (وكيل منفصل متشكك يفحص النتيجة — الحركة الحاملة)، والإبقاء (النتائج في طلب دمج أو تذكرة أو ملف حالة)، والجدولة (مؤقّت أو مشغّل CI يعيد الدورة).',
          en: 'Beyond the single prompt sits a further rung, named in June 2026 by three practitioners in the same week: loop engineering — replacing yourself: designing the system that prompts the agent, so you no longer feed it one instruction at a time. Four layers stack beneath it: prompt engineering minds one exchange, context engineering minds one window, harness engineering arms one run (which tools an agent may call, and what counts as finished), and loop engineering minds the system that runs the harness again and again, unattended. Each turn a useful loop makes five moves: discovery (it finds its own work), handoff (each task lands in an isolated workspace), verification (a separate, skeptical agent checks the result — the load-bearing move), persistence (results land in a pull request, ticket, or state file), and scheduling (a timer or CI trigger reruns it).',
        },
        {
          ar: 'أسقط حركة وستفشل الحلقة بنمطها المعروف: بلا تحقق تولد الحلقة المُيمِّقة (nodding loop) — الوكيل يقيّم عمله ويكدّس أخطاء معقولة بسرعة الآلة؛ وبلا إبقاء الحلقة الفاقدة للذاكرة، وبلا جدولة الحلقة اليدوية، وبلا اكتشاف الحلقة العمياء، وبلا تسليم الحلقة المتشابكة. أصعب جزء أن تبني شيئًا يقول "لا": كاتب الشيفرة أسوأ قاضٍ لها، يرى تبريراته لا النتيجة. العلاج بنيوي مستعار من GANs: مقيّم منفصل — تعليمات مختلفة، ويُستحسن نموذج مختلف — ينفذ البرمجية ويفحص السلوك الملحوظ ويبدأ من الشك. أربع كلفة تتراكم بصمت: دين التحقق، وتعفّن الفهم، والاستسلام المعرفي، وانفجار التوكنز؛ والدفوع رخيصة: عيّن من المخرجات يوميًا، وسقوف ميزانية صارمة قبل التشغيل غير المراقب، ونقطة مراجعة بشرية واحدة تبقى الميزة الدائمة التي تحفظ الثقة.',
          en: 'Skip a move and the loop fails in its known pattern: no verification makes the nodding loop — the agent grades its own work and accumulates plausible mistakes at machine speed; no persistence makes the amnesiac loop, no scheduling the manual loop, no discovery the blind loop, no handoff the tangled loop. The hardest part is building something that can say no: the agent that wrote the code is the worst judge of it, seeing its own justification rather than the result. The fix is structural, borrowed from GANs: a separate evaluator — different instructions, ideally a different model — that executes the software, inspects observed behavior, and defaults to no. Four costs accrue silently: verification debt, comprehension rot, cognitive surrender, token blowout. The defenses are cheap: sample the output daily, hard budget caps before unattended runs, one human checkpoint — the permanent feature that keeps the loop trustworthy.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'BRIEF-LINT: كل سطر في AGENTS.md يصرف من ميزانية السياق',
        en: 'BRIEF-LINT: every line of AGENTS.md spends context budget',
      },
      code: `# BRIEF-LINT: every line of AGENTS.md spends context budget. Score the brief.
BRIEF = [
    ("run tests with: python -m pytest -q", "signal"),
    ("we generally try to avoid inline mocks", "aspiration"),
    ("never log raw card numbers - PCI scope", "signal"),
    ("our team is friendly and loves coffee", "noise"),
]

load_bearing = 0
for line, kind in BRIEF:
    if kind == "signal":
        load_bearing += 1
        print("keep: " + line)
    else:
        print("flag (" + kind + "): " + line)

print("load-bearing rules: " + str(load_bearing))
print("a rule with its why ports to every agent")
`,
      explanation: {
        ar: 'سطرا "signal" فقط حملان قرارًا: أمر الاختبار، وقاعدة البطاقات مع سببها. سطر الأمنية "نحاول عمومًا" يُقلب أمرًا: "استخدم المصانع في test/factories/". وسطر القهوة حشو يصرف ميزانية سياق في كل جلسة بلا قرار. النتيجة: قاعدتان حاملتان فقط — وهذا جيد؛ القائمة القصيرة هي التي تنجو من نظرة سريعة، والقاعدة المسببة بالسبب هي التي تُترجم بين الأدوات. في Stripe بلغت هذه الروتينات نحو 1,300 طلب دمج أسبوعيًا: بوابات قاعدية لا يستطيع الوكيل تخطيها، ومراجع بشري لكل طلب — الثقة من القيود لا من حجم النموذج.',
        en: 'Only the two "signal" lines carry a decision: the test command, and the card-number rule with its why. The aspirational "we generally try" should be flipped into an order: "use the factories in test/factories/". The coffee line is filler that spends context budget every session without changing a decision. The result: two load-bearing rules — and that is good; a short list survives a skim, and a rule with its reason translates across tools. At Stripe such routines ship about 1,300 pull requests a week: rule-based gates the agent cannot skip, and an engineer reviews every PR — reliability from constraints, not model size.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.loop-doctor',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل طبيب الحلقة: دالة diagnose تستقبل قاموس حالة الحلقة وتمشي MOVES بالترتيب، فتعيد اسم النمط المضاد لأول حركة ناقصة من ANTIPATTERN، و"healthy loop" إذا اكتملت الحركات الخمس.',
        en: 'Complete the loop doctor: diagnose takes the loop-state dictionary and walks MOVES in order, returning the anti-pattern name from ANTIPATTERN for the first missing move, or "healthy loop" when all five moves are present.',
      },
      starterCode: `MOVES = ["discovery", "handoff", "verification", "persistence", "scheduling"]
ANTIPATTERN = {
    "discovery": "blind loop",
    "handoff": "tangled loop",
    "verification": "nodding loop",
    "persistence": "amnesiac loop",
    "scheduling": "manual loop",
}

def diagnose(loop):
    # TODO: walk MOVES in order; return the anti-pattern of the first
    # missing move, or "healthy loop" when every move is present.
    return "?"

print(diagnose({"discovery": True, "handoff": True, "verification": True,
                "persistence": True, "scheduling": True}))
print(diagnose({"discovery": True, "handoff": True, "verification": False,
                "persistence": True, "scheduling": True}))
print(diagnose({"discovery": True, "handoff": True, "verification": True,
                "persistence": False, "scheduling": True}))
`,
      solution: `MOVES = ["discovery", "handoff", "verification", "persistence", "scheduling"]
ANTIPATTERN = {
    "discovery": "blind loop",
    "handoff": "tangled loop",
    "verification": "nodding loop",
    "persistence": "amnesiac loop",
    "scheduling": "manual loop",
}

def diagnose(loop):
    for move in MOVES:
        if not loop.get(move, False):
            return ANTIPATTERN[move]
    return "healthy loop"

print(diagnose({"discovery": True, "handoff": True, "verification": True,
                "persistence": True, "scheduling": True}))
print(diagnose({"discovery": True, "handoff": True, "verification": False,
                "persistence": True, "scheduling": True}))
print(diagnose({"discovery": True, "handoff": True, "verification": True,
                "persistence": False, "scheduling": True}))
`,
      tests: [
        {
          id: 'healthy-loop',
          name: { ar: 'حلقة كاملة تعطي healthy', en: 'a complete loop is healthy' },
          code: 'assert diagnose({"discovery": True, "handoff": True, "verification": True, "persistence": True, "scheduling": True}) == "healthy loop", \'expected healthy loop | actual: %r\' % diagnose({"discovery": True, "handoff": True, "verification": True, "persistence": True, "scheduling": True})',
        },
        {
          id: 'manual-loop',
          name: { ar: 'سقوط الجدولة يعطي manual loop', en: 'dropped scheduling gives the manual loop' },
          code: 'assert diagnose({"discovery": True, "handoff": True, "verification": True, "persistence": True, "scheduling": False}) == "manual loop", \'expected manual loop | actual: %r\' % diagnose({"discovery": True, "handoff": True, "verification": True, "persistence": True, "scheduling": False})',
        },
        {
          id: 'nodding-print',
          name: { ar: 'النمط المُيمِّق مطبوع', en: 'the nodding pattern is printed' },
          code: "assert 'nodding loop' in __learner_output__, 'expected: nodding loop | actual: %r' % __learner_output__",
        },
      ],
      hints: [
        { ar: 'امشِ MOVES بالترتيب؛ أول حركة يكون قيمتها False في القاموس تحدد النمط المضاد.', en: 'Walk MOVES in order; the first move whose value is False in the dictionary picks the anti-pattern.' },
        { ar: 'استخدم loop.get(move, False) حتى تعامل الحركة الغائبة من القاموس كناقصة.', en: 'Use loop.get(move, False) so a move missing from the dictionary counts as missing.' },
        { ar: 'داخل الحلقة: if not loop.get(move, False): return ANTIPATTERN[move].', en: 'Inside the loop: if not loop.get(move, False): return ANTIPATTERN[move].' },
        { ar: 'بعد الحلقة كاملة يعيد السطر الأخير "healthy loop" — كل الحركات موجودة.', en: 'After the full loop, the last line returns "healthy loop" — every move is present.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.generator-evaluator-trace',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ محاكاة المولّد والمقيّم واكتب المخرجات المطبوعة سطرًا سطرًا.',
        en: 'Read the generator-evaluator simulation and write the printed output line by line.',
      },
      code: `TURNS = [("add retry", False), ("add retry + test", True)]
for turn, (proposal, tests_pass) in enumerate(TURNS, 1):
    if tests_pass:
        verdict = "accept"
    else:
        verdict = "reject"
    print("turn " + str(turn) + ": " + proposal + " -> " + verdict)
print("evaluator default: no")
`,
      answer: 'turn 1: add retry -> reject\nturn 2: add retry + test -> accept\nevaluator default: no',
      solution: 'turn 1: add retry -> reject\nturn 2: add retry + test -> accept\nevaluator default: no',
      hints: [
        { ar: 'الحكم في كل دورة يتوقف على tests_pass فقط: True تصير accept وFalse تصير reject.', en: 'Each verdict depends only on tests_pass: True becomes accept and False becomes reject.' },
        { ar: 'الدورة الأولى اقترحت إعادة المحاولة بلا اختبار يجتازه، فالقيمة False.', en: 'Turn one proposed a retry with no passing test, so its flag is False.' },
        { ar: 'الدورة الثانية أضافت اختبارًا يجتاز، فالقيمة True والحكم accept.', en: 'Turn two added a test that passes, so its flag is True and the verdict is accept.' },
        { ar: 'السطر الأخير ثابت: المقيّم المنفصل يبدأ من الرفض.', en: 'The last line is fixed: the separate evaluator starts from no.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.nodding-fill',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل بكلمة إنجليزية واحدة: الحلقة التي لا مراجع لها سوى الوكيل الذي كتب الشيفرة هي حلقة ______ at itself.',
        en: 'Complete with one English word: a loop whose only reviewer is the agent that wrote the code is a loop ______ at itself.',
      },
      answer: 'nodding',
      solution: 'nodding',
      hints: [
        { ar: 'الوكيل يوافق على عمله لأن سياقه مليء بتبريراته — يبدو كمن يهز رأسه موافقًا.', en: 'The agent approves its own work because its context is full of its own justifications — like someone nodding along.' },
        { ar: 'النمط ظهر في درسك كواحد من الأنماط الخمسة المرتبطة بحركة التحقق.', en: 'The pattern appeared in your lesson as one of the five anti-patterns, tied to the verification move.' },
        { ar: 'الترقيم الإنجليزي للفعل هو الصيغة النعوتية: nod + ding.', en: 'The English form is the present participle: nod + ding.' },
        { ar: 'الجواب: nodding — الحلقة المُيمِّقة.', en: 'The answer: nodding — the nodding loop.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عودة إلى الفصل 11: لماذا تكتب في ملف التعليمات "لا تسجل أرقام البطاقات الخام — فهي تخرج عن نطاق PCI" بدل صرخة NEVER LOG CARD NUMBERS؟',
            en: 'Back to Chapter 11: why write "never log raw card numbers — it violates PCI scope" instead of shouting NEVER LOG CARD NUMBERS?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الصرخة أطول وتستهلك ميزانية أكبر', en: 'because shouting is longer and spends more budget' } },
            { id: 'b', text: { ar: 'لأن القاعدة مع سببها تنجو من الترجمة بين الأدوات وتُعمم على حالات لم تسمها — قرار أمني يبقى بيدك', en: 'because a rule with its why survives translation between tools and generalizes to cases it never named — a security judgment that stays yours' } },
            { id: 'c', text: { ar: 'لأن PCI أداة تفحص الملف تلقائيًا', en: 'because PCI is a tool that scans the file automatically' } },
            { id: 'd', text: { ar: 'لأن الأدوات لا تفهم الأحرف الكبيرة', en: 'because tools cannot read capital letters' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الحقائق تنتقل عبر AGENTS.md، أما نبرة التأكيد فلا تنتقل بين الأدوات. القاعدة المسبَّبة تجعل أي نموذج يطبق المبدأ على حالة جديدة (رقم حساب، رمز تحقق) — وهو بالضبط حكم أمني من الفصل 11 لا يُفوَّض.',
            en: 'Facts port via AGENTS.md; tone does not port between tools. A rule with its rationale lets any model apply the principle to a new case (an account number, an OTP) — exactly the Chapter 11 security judgment that is not delegable.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'أي حركة إذا أُسقطت وُلدت الحلقة الفاقدة للذاكرة (amnesiac loop)؟',
            en: 'Which move, when skipped, gives birth to the amnesiac loop?',
          },
          options: [
            { id: 'a', text: { ar: 'الاكتشاف (discovery)', en: 'discovery' } },
            { id: 'b', text: { ar: 'التسليم (handoff)', en: 'handoff' } },
            { id: 'c', text: { ar: 'الإبقاء (persistence)', en: 'persistence' } },
            { id: 'd', text: { ar: 'الجدولة (scheduling)', en: 'scheduling' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'بلا إبقاء تضيع نتائج العمل حين يُمسح السياق: إما يعاد فعلها أو تصطدم بها الدورة التالية. النتائج تحتاج مكانًا يعيش أطول من المحادثة: طلب دمج، تذكرة، أو ملف حالة.',
            en: 'Without persistence, finished work evaporates when context clears: the next run redoes it or collides with it. Results need a home that outlives the conversation: a pull request, a ticket, or a state file.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يعتمد التصميم الجيد مقيّمًا منفصلًا افتراضه "لا" بدل مطالبة الكاتب بأن يكون أكثر انتقادًا لعمله؟',
            en: 'Why does good design use a separate evaluator that defaults to no, instead of asking the author agent to be more critical?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن المقيّم المنفصل أرخص حسابيًا', en: 'because a separate evaluator is cheaper to run' } },
            { id: 'b', text: { ar: 'لأن كاتب الشيفرة أسوأ قاضٍ لها: سياقه مليء بتبريراته؛ المقيّم المنفصل ينفذ السلوك ويفحصه بشك', en: 'because the author is the worst judge of its own code: its context is full of its justifications; a separate evaluator executes the behavior and inspects it with skepticism' } },
            { id: 'c', text: { ar: 'لأن الوكلاء لا يجيدون كتابة الاختبارات', en: 'because agents cannot write tests' } },
            { id: 'd', text: { ar: 'لأن المطالبة بالانتقاد تخالف شروط الاستخدام', en: 'because asking for criticism violates terms of service' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'لا يمكنك الاعتماد على جعل المؤلف عكوفًا؛ العلاج بنيوي: مقيّم بتعليمات مختلفة ونموذج مختلف حيث أمكن، ينفذ البرمجية ويقيس السلوك الملحوظ، ويعتبر الشيفرة غير موثقة حتى يثبت فحص العكس — مبدأ الصانع والمُعتمِد.',
            en: 'You cannot reliably make an author self-critical; the fix is structural: an evaluator with different instructions and ideally a different model, executing the software and grading observed behavior, treating the code as unverified until a check proves otherwise — the maker-checker principle.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'عودة إلى الفصل 14: أي حركة من حركات الحلقة تقابلها في CI/CD، وبأي آلية تنفذ؟',
            en: 'Back to Chapter 14: which loop move corresponds to something CI/CD already does, and by which mechanism?',
          },
          options: [
            { id: 'a', text: { ar: 'الاكتشاف — لوحة كانبان تُرتب التذاكر', en: 'discovery — a Kanban board ordering tickets' } },
            { id: 'b', text: { ar: 'الجدولة — مشغّل (trigger) يجري الحلقة من جديد بلا من يذكّر', en: 'scheduling — a trigger reruns the loop with nobody remembering to start it' } },
            { id: 'c', text: { ar: 'التسليم — مراجعة بشرية لكل طلب دمج', en: 'handoff — human review of every pull request' } },
            { id: 'd', text: { ar: 'التحقق — تغطية شيفرة 100%', en: 'verification — 100% code coverage' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الجدولة هي ما يحوّل سكربتًا تجريه بيدك إلى حلقة تدور وحدها: مؤقّت أو مشغّل CI أو تفاعل في الدردشة — نفس مشغلات خط أنابيب النشر من الفصل 14. بلاها تبقى "حلقة يدوية" تنسى أنت في النهاية تشغيلها.',
            en: 'Scheduling is what turns a script you run by hand into a loop that runs itself: a timer, a CI trigger, a chat reaction — the same triggers as the Chapter 14 delivery pipeline. Without it you have a manual loop a human eventually forgets to start.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'كل اتفاق تتركه في رأسك اتفاق سينتهكه الوكيل بثقة وبحجم كبير: شفِّر النية في ملف يقرأه تلقائيًا واعتنِ به كشيفرة.', en: 'Every convention left only in your head is a convention the agent will violate, confidently and at scale: encode intent in a file the agent reads automatically and maintain it like code.' },
        { ar: 'الحقائق تنتقل عبر AGENTS.md، والنبرة لا تنتقل بين الأدوات؛ أما "اشرح السبب" فتعمل في كل مكان.', en: 'Facts port via AGENTS.md, tone does not port between tools; explaining the why works everywhere.' },
        { ar: 'الحلقة الجادة تؤدي خمس حركات: اكتشاف، تسليم، تحقق، إبقاء، جدولة — وإسقاط أي واحدة يولّد نمطها المضاد المعروف.', en: 'A serious loop performs five moves: discovery, handoff, verification, persistence, scheduling — skip one and its named anti-pattern appears.' },
        { ar: 'المقيّم المنفصل افتراضه "لا" هو الحركة الحاملة؛ والثقة من القيود لا من حجم النموذج — Stripe: بوابات قاعدية ومراجعة بشرية لكل طلب دمج.', en: 'The separate evaluator defaulting to no is the load-bearing move; reliability comes from constraints, not model size — Stripe: rule-based gates and a human review on every PR.' },
      ],
      reflectPrompt: {
        ar: 'لو شغّلت حلقة على مستودعك الليلة: أي حركة من الخمس ستكون أول ما تنساه؟ وما اسم النمط المضاد الناتج؟',
        en: 'If you ran a loop against your repository tonight: which of the five moves would you forget first, and what is the resulting anti-pattern called?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch13.s6', pages: 'ص356 / pp.356' },
        { book: 'SWE', section: 'swe.ch13.s7', pages: 'ص358 / pp.358' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch13.s6', pages: 'ص356 / pp.356' },
    { book: 'SWE', section: 'swe.ch13.s7', pages: 'ص358 / pp.358' },
  ],
} satisfies Lesson;

export default lesson;
