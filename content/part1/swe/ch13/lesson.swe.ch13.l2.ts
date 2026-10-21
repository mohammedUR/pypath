/**
 * swe.ch13.l2 — هندسة النتائج (o16g) والتطوير الموجَّه بالموصفات /
 * Outcome Engineering (o16g) and Spec-Driven Development
 * SWE ch13 — s4 Outcome Engineering: The o16g Manifesto (ص352 / pp.352) + s5
 * Spec-Driven Development (ص354 / pp.354).
 * Runnable design: a deterministic SPEC-DRIFT LEDGER counts the edits needed to
 * change requirement R2 the code-first way versus the spec-first way; an SDD gate
 * engine walks the five phases and stops at the first unapproved artifact.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch13.l2',
  version: 1,
  part: 'II',
  track: 'A9',
  book: 'SWE',
  chapter: 13,
  title: {
    ar: 'هندسة النتائج (o16g) والتطوير الموجَّه بالموصفات',
    en: 'Outcome Engineering (o16g) and Spec-Driven Development',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch13.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الصباح قرأ الفريق البيان وقرر تجربته: بدل أن يكتبوا للوكيل "أضف صفحة تسجيل دخول"، كتبوا موصفة بثلاثة سيناريوهات Given/When/Then ثم فوضوا التنفيذ. للمرة الأولى أعاد الوكيل شيئًا يقترب من المطلوب من المحاولة الأولى. البيان اسمه o16g — هندسة النتائج — وخلاصته في سطر: لم يكن الأمر أبدًا عن الشيفرة.',
        en: 'In the morning the team read the manifesto and tried it: instead of telling the agent "add a login page", they wrote a spec with three Given/When/Then scenarios and delegated the implementation. For the first time the agent came back close to right on the first attempt. The manifesto is called o16g — Outcome Engineering — and its thesis fits one line: it was never about the code.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'بيان o16g: الإبداع لا الشيفرة، واليقين لا الانطباع',
        en: 'The o16g manifesto: creation not code, certainty not vibes',
      },
      chunks: [
        {
          ar: 'في 2026 نشر كوري أندريكا بيان o16g — هندسة النتائج — مجادِلًا أن التطوير الوكيلي يطلب إطارًا جديدًا. أطروحته: لم يكن الأمر أبدًا عن الشيفرة؛ الشيفرة آلية لتسليم فكرة، وحين يزيل الوكلاء قيد نطاق الكتابة البشري يصبح الإبداع محدودًا بكلفة الحوسبة لا بطاقة الإنسان — فتنتقل المهنة من هندسة برمجيات إلى هندسة نتائج. أربع نقلات تحمل الجدل: الإبداع لا الشيفرة، الكلفة لا الوقت، الطاقة لا قائمة الأعمال، اليقين لا الانطباع. ثم ستة عشر مبدأً في جزأين، والمدهش مدى تطابقها مع هذا الكتاب: الحقيقة الموثقة هي الحقيقة الوحيدة (اختبارات ومقاييس، الفصلان 10 و12)، شفِّر الدستور (موصفات، الفصل 3)، الخطر يوقف الخط (بوابات الجودة، الفصل 9)، راقب النواتج (الفصل 11).',
          en: 'In 2026 Cory Ondrejka published the o16g manifesto, Outcome Engineering, arguing that agentic development demands a new frame. Its thesis: it was never about the code. Code is a mechanism for delivering an idea; once agents remove the constraint of human typing bandwidth, creation is limited by the cost of compute, not human capacity — so the profession moves toward engineering outcomes. Four shifts carry the argument: creation not code, cost not time, capacity not backlog, certainty not vibes. Sixteen principles follow in two parts, and the striking thing is how directly they map onto this book: verified reality is the only truth (testing and metrics, Chapters 10 and 12), code the constitution (specifications, Chapter 3), risk stops the line (quality gates, Chapter 9), audit the outcomes (Chapter 11).',
        },
        {
          ar: 'اقرأه استفزازًا لا إنجيلًا: عمره شهور، ومصطلحاته موضع جدل، ولا يوجد دليل مستقل بعد على أن فرقًا تبنته تسلّم نتائج أفضل — اقرأه كما قرأت بيان أجايل عام 2001. والتحديات المفتوحة حقيقية. "أدر بالكلفة" يفترض حوسبة رخيصة وقيمة سهلة التسعير؛ والأولوية تحت الندرة (الفصل 4) لا تزول، تتغير عملتها فقط. "اليقين لا الانطباع" يصطدم بمشكلة الميزان: نواتج تبقى غالية أو مستحيلة التحقق الآلي. وخطر فقدان المهارة: المبدأ 16 — راقب النواتج — يعتمد على خبرة بشرية قد يآكلها الاعتماد الكثيف على الوكلاء. ومع ذلك، البيان يسمي بدقة الانتقال الذي يصفه هذا الفصل: من إنتاج البرمجية إلى توجيه إنتاجها والتحقق منه.',
          en: 'Read it as a provocation, not gospel: it is months old, its vocabulary contested, and no independent evidence yet shows teams shipping better outcomes by adopting it — read it the way you would have read the Agile Manifesto in 2001. The open challenges are real. Manage to cost assumes compute is cheap and value easy to price; prioritization under scarcity (Chapter 4) does not vanish, its currency changes. Certainty not vibes runs into the oracle problem: some outcomes stay expensive or impossible to verify automatically. And the deskilling risk: Principle 16, audit the outcomes, depends on human expertise that heavy agent reliance could erode. Still, the manifesto names precisely the shift this chapter describes: from producing software to directing and verifying its production.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'التطوير الموجَّه بالموصفات: الشيفرة تخدم الموصفة',
        en: 'Spec-driven development: the code serves the spec',
      },
      chunks: [
        {
          ar: 'التطوير الموجَّه بالموصفات هو الممارسة العملية وراء شعارات البيان. انقلابه الجوهري: في الكود المعتاد تخدم الموصفةُ الشيفرةَ — وثيقة تشرح برمجية موجودة أصلًا وتتقادم لحظة توقفك عن تحديثها؛ وفيه تخدم الشيفرةُ الموصفةَ: الموصفة أثر دائم، والشيفرة ناتج مولَّد قابل للاستبدال. هذا الانقلاب لم يصبح عمليًا إلا حين صارت إعادة التوليد رخيصة: حين كان الكتابة عنق الزجاجة تعفّنت الموصفات لأن إعادة كتابة التنفيذ غالية؛ وحين يعيد الوكيل توليد التنفيذ في دقائق تحافظ على الموصفة وتعيد توليد الشيفرة. خط الأنابيب: الدستور (مبادئ غير قابلة للتفاوض مقروءة آليًا)، تحديد (ماذا ولماذا، صامت عن التقنية، بصيغة Given/When/Then)، خطة (المعمارية والواجهات)، مهام (شرائح صغيرة قابلة للاختبار مستقلة مرتبة بالاعتمادية)، تنفيذ — وبين كل مرحلتين بوابة موافقة بشرية.',
          en: 'Spec-driven development is the concrete practice behind the manifesto slogans. Its core move is an inversion: in ordinary coding the specification serves the code — a document explaining software that already exists, drifting out of date the moment you stop maintaining it. In SDD the code serves the specification: the spec is the durable artifact and the code is a generated, replaceable output. The inversion became practical only when regeneration became cheap: while typing was the bottleneck, specs decayed because rewriting an implementation was expensive; when an agent regenerates the implementation in minutes, you maintain the spec and regenerate the code. The pipeline: constitution (non-negotiable principles, machine-readable), specify (what and why, silent on the stack, written as Given/When/Then), plan (architecture and interfaces), tasks (small independently testable slices ordered by dependency), implement — with a human approval gate between phases.',
        },
        {
          ar: 'المبدأ: إذا اختلفت الشيفرة عن الموصفة، الموصفة تنتصر وتعيد التوليد — وهذا آمن فقط إذا كانت الموصفة دقيقة بما يكفي لتكون عقدًا. يذكر المتبنون الأوائل نجاحًا من المحاولة الأولى أعلى أضعافًا حين تسبق موصفة حقيقية الشيفرة، مقابل الطلب من وصف سطر واحد؛ عاملها تقارير ممارسين لا قياسات مضبوطة، لكن الآلية مألوفة: معظم إخفاقات الوكيل إخفاق نقص تحديد. والفخ يطابق مشكلة الميزان: موصفة مكتوبة بإهمال تشفّر سوء فهم بطلاقة شيفرة مهملة — والآن صار سوء الفهم مصدر الحقيقة. SDD لا يُخرج الإنسان من العمل؛ ينقل جهدك إلى الجزء الأصعب دائمًا: كتابة موصفة غير غامضة، ويقدم القرار الخاطئ إلى أرخص مكان لالتقاطه: الموصفة.',
          en: 'The principle: if the spec and the code disagree, the spec wins and you regenerate — which is only safe when the spec is precise enough to serve as a contract. Early adopters report several-fold higher first-pass success when a real spec precedes the code, versus prompting from a one-line description; treat those as practitioner reports, not controlled measurements, but the mechanism is familiar: most agent failures are underspecification failures. The catch mirrors the oracle problem: a spec written carelessly encodes a misunderstanding as fluently as careless code does — and now that misunderstanding is the source of truth. SDD does not remove the human; it moves your effort to the part that was always hardest, writing an unambiguous specification, and it front-loads wrong decisions to the cheapest place to catch them: the spec.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'دفتر انجراف المواصفة: تغيير R2 مرة واحدة',
        en: 'The spec-drift ledger: changing R2 exactly once',
      },
      code: `# SPEC-DRIFT LEDGER: requirement R2 changed. Count the edits each way.
SPOTS = [
    ("checkout.py", "R2"),
    ("invoice.py", "R2"),
    ("report.py", "R2"),
    ("auth.py", "R1"),
]

spec_edits = 1  # fix the spec once, then regenerate the code from it
code_edits = 0
for spot, req in SPOTS:
    if req == "R2":
        code_edits += 1
        print("code-first must edit: " + spot)

print("code-first edits: " + str(code_edits))
print("spec-first edits: " + str(spec_edits) + " (then regenerate)")
print("the spec wins: the code is the build output")
`,
      explanation: {
        ar: 'تغيّر المتطلب R2. بالطريقة الكودية أولًا عليك مطاردة كل موضع شيفرة يفترض R2 القديم: ثلاثة ملفات هنا — وفي نظام حقيقي عشرات مواضع لا خريطة لها. بالطريقة الموصفية: تعديل واحد في المصدر ثم إعادة توليد، والشيفرة القديمة تستبدل كلها. هذا معنى "الشيفرة ناتج بناء": حين تصبح إعادة التوليد رخيصة، تنتقل الصيانة إلى الموصفة، ويختفي انجراف التوثيق لأن التوثيق هو المصدر لا الظل.',
        en: 'Requirement R2 changed. Code-first, you must chase every code spot that assumes the old R2: three files here — in a real system, dozens of places with no map. Spec-first: one edit in the source, then regenerate, and the stale code is replaced wholesale. That is "the code is the build output": once regeneration is cheap, maintenance moves to the spec, and documentation drift disappears because the documentation is the source, not the shadow.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.sdd-gate-engine',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل بوابة خط أنابيب SDD: دالة next_phase تمشي PHASES بالترتيب وتعيد أول مرحلة لم يُعتمد أثرها في قاموس VALIDATED؛ وإن اعتُمدت جميعها تعيد done. لا تتجاوز بوابة أبدًا: القرار الخاطئ في الموصفة رخيص، وفي الإنتاج غالي.',
        en: 'Complete the SDD pipeline gate: next_phase walks PHASES in order and returns the first phase whose artifact is not approved in the VALIDATED dictionary; when everything is approved it returns done. Never run past a gate: a wrong decision in the spec is cheap, in production it is not.',
      },
      starterCode: `PHASES = ["constitution", "specify", "plan", "tasks", "implement"]
VALIDATED = {"constitution": True, "specify": True}

def next_phase(phases, validated):
    # TODO: return the first phase not approved in validated,
    # or "done" when every phase is approved.
    return "?"

stop = next_phase(PHASES, VALIDATED)
print("pipeline stops at: " + stop)
`,
      solution: `PHASES = ["constitution", "specify", "plan", "tasks", "implement"]
VALIDATED = {"constitution": True, "specify": True}

def next_phase(phases, validated):
    for phase in phases:
        if not validated.get(phase, False):
            return phase
    return "done"

stop = next_phase(PHASES, VALIDATED)
print("pipeline stops at: " + stop)
`,
      tests: [
        {
          id: 'stops-at-plan',
          name: { ar: 'تتوقف عند plan بعد اعتماد مرحلتين', en: 'stops at plan after two approvals' },
          code: 'assert next_phase(PHASES, VALIDATED) == "plan", \'expected plan | actual: %r\' % next_phase(PHASES, VALIDATED)',
        },
        {
          id: 'done-when-all-approved',
          name: { ar: 'done عندما تُعتمد كل المراحل', en: 'done when every phase is approved' },
          code: 'assert next_phase(PHASES, {"constitution": True, "specify": True, "plan": True, "tasks": True, "implement": True}) == "done", \'expected done when all gates are approved\'',
        },
        {
          id: 'gate-print',
          name: { ar: 'سطر البوابة مطبوع', en: 'the gate line is printed' },
          code: "assert 'pipeline stops at: plan' in __learner_output__, 'expected: pipeline stops at: plan | actual: %r' % __learner_output__",
        },
      ],
      hints: [
        { ar: 'امشِ القائمة بالترتيب؛ أول مرحلة يفشل فيها الشرط هي جوابك — لا تتابع بعدها.', en: 'Walk the list in order; the first phase failing the check is your answer — do not continue past it.' },
        { ar: 'استخدم validated.get(phase, False) حتى تعامل المرحلة الغائبة من القاموس كغير معتمدة.', en: 'Use validated.get(phase, False) so a phase missing from the dictionary counts as unapproved.' },
        { ar: 'الحلقة: for phase in phases: ثم if not validated.get(phase, False): return phase.', en: 'The loop: for phase in phases: then if not validated.get(phase, False): return phase.' },
        { ar: 'بعد الحلقة كاملة يعيد السطر الأخير "done" — كل البوابات اعتُقدت.', en: 'After the full loop, the last line returns "done" — every gate was approved.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.sdd-inversion-fill',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل بكلمة إنجليزية واحدة قلبَ التطوير الموجَّه بالموصفات: في SDD تخدم الشيفرة الـ ______.',
        en: 'Complete with one English word the heart of the SDD inversion: in SDD the code serves the ______.',
      },
      answer: 'spec',
      solution: 'spec',
      hints: [
        { ar: 'الانقلاب: في الكود المعتاد تخدم الموصفة الشيفرة؛ هنا تنعكس العلاقة.', en: 'The inversion: in ordinary code the spec serves the code; here the relationship flips.' },
        { ar: 'الأثر الدائم هو الذي تُصان، والناتج المولَّد يُستبدل كلما اختلقا.', en: 'The durable artifact is what you maintain; the generated output is replaced whenever they disagree.' },
        { ar: 'الكلمة الإنجليزية القصيرة التي سمينا بها وثيقة المتطلبات القابلة للتنفيذ طوال الدرس.', en: 'The short English word we have used all lesson for the executable requirements document.' },
        { ar: 'الجواب: spec — الموصفة هي المصدر والشيفرة ناتج بناء.', en: 'The answer: spec — the spec is the source and the code is the build output.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.four-shifts-mcq',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي عبارة من هذه ليست واحدة من النقلات الأربع في بيان o16g؟',
        en: 'Which of these is NOT one of the four shifts in the o16g manifesto?',
      },
      options: [
        { id: 'a', text: { ar: 'الإبداع لا الشيفرة', en: 'Creation not code' } },
        { id: 'b', text: { ar: 'الكلفة لا الوقت', en: 'Cost not time' } },
        { id: 'c', text: { ar: 'الجودة لا السرعة', en: 'Quality not speed' } },
        { id: 'd', text: { ar: 'اليقين لا الانطباع', en: 'Certainty not vibes' } },
      ],
      answer: 'c',
      solution: 'c',
      hints: [
        { ar: 'ثلاث من العبارات الأربع وردت حرفيًا في النقلات: الإبداع/الكلفة/اليقين.', en: 'Three of the four phrases appear verbatim among the shifts: creation / cost / certainty.' },
        { ar: 'النقلة الرابعة تتعلق بقائمة الأعمال والطاقة، لا بثنائية جودة وسرعة.', en: 'The fourth shift is about the backlog and capacity, not a quality-versus-speed pair.' },
        { ar: 'النقلة الرابعة هي: الطاقة لا قائمة الأعمال (capacity not backlog).', en: 'The fourth shift is: capacity not backlog.' },
        { ar: 'الجواب c: "الجودة لا السرعة" ليست من النقلات الأربع.', en: 'Answer c: "Quality not speed" is not one of the four shifts.' },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما انقلاب التطوير الموجَّه بالموصفات في جملة واحدة؟',
            en: 'State the spec-driven development inversion in one sentence.',
          },
          options: [
            { id: 'a', text: { ar: 'الموصفة تخدم الشيفرة وتشرحها بعد بنائها', en: 'the spec serves the code and documents it after the build' } },
            { id: 'b', text: { ar: 'الشيفرة تخدم الموصفة: الموصفة أثر دائم والشيفرة ناتج مولَّد يُستبدل', en: 'the code serves the spec: the spec is the durable artifact and the code a replaceable generated output' } },
            { id: 'c', text: { ar: 'الاختبارات تخدم الشيفرة والموصفة معًا', en: 'tests serve both the code and the spec' } },
            { id: 'd', text: { ar: 'لا فرق جوهريًا عن الكتابة التقليدية للمتطلبات', en: 'there is no real difference from traditional requirements writing' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'في SDD تصبح الموصفة المصدر الدائم الذي تحافظ عليه، والشيفرة ناتج بناء يعاد توليده كلما اختلفا. هذا لم يكن عمليًا قبل أن تصبح إعادة التوليد رخيصة بيد الوكلاء.',
            en: 'In SDD the spec is the durable source you maintain, and the code is the build output regenerated whenever they disagree. This was impractical until agents made regeneration cheap.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'عودة إلى الفصلين 3 و5: مرحلة Specify في خط الأنابيب تستعير أي مهارات أساسًا؟',
            en: 'Back to Chapters 3 and 5: which core skills does the Specify phase of the pipeline borrow?',
          },
          options: [
            { id: 'a', text: { ar: 'قصة المستخدم ومعايير القبول بصيغة Given/When/Then', en: 'user stories and acceptance criteria written as Given/When/Then' } },
            { id: 'b', text: { ar: 'تغطية الشيفرة وحدود التغطية', en: 'code coverage and adequacy criteria' } },
            { id: 'c', text: { ar: 'خطوط النشر ومشغلات CI', en: 'deployment pipelines and CI triggers' } },
            { id: 'd', text: { ar: 'مؤشرات DORA للتسليم', en: 'DORA delivery metrics' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مرحلة تحدد ماذا ولماذا بصمتٍ عن التقنية — وهي عمل قصص المستخدم ومعايير القبول من الفصل 3 وصياغة السيناريوهات القابلة للتنفيذ من الفصل 5، بحيث يصبح "منجز" قابلًا للتنفيذ لا مسألة ذوق.',
            en: 'Specify says what and why while staying silent on the stack — the Chapter 3 work of user stories and acceptance criteria plus the Chapter 5 craft of executable scenarios, so that "done" becomes executable rather than a matter of taste.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما فخ الموصفة المهملة في SDD؟',
            en: 'What is the catch of a carelessly written spec in SDD?',
          },
          options: [
            { id: 'a', text: { ar: 'تبطئ الوكيل قليلًا عند القراءة', en: 'it slows the agent down slightly while reading' } },
            { id: 'b', text: { ar: 'تشفّر سوء فهم وتجعله مصدر الحقيقة — مشكلة الميزان بواجهة جديدة', en: 'it encodes a misunderstanding and makes it the source of truth — the oracle problem in a new outfit' } },
            { id: 'c', text: { ar: 'تكلف أكثر من كتابة الشيفرة مباشرة', en: 'it costs more than writing the code directly' } },
            { id: 'd', text: { ar: 'لا فخ؛ الموصفة الجيدة دائمًا كافية', en: 'no catch; a good spec is always sufficient' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الموصفة تُنفَّذ كما كُتبت؛ إن كانت غامضة أو خاطئة فأنت ولّدت بثقة نسخة سريعة من سوء الفهم نفسه الذي كان سيُدفن في الشيفرة. SDD ينقل الجهد إلى كتابة موصفة غير غامضة، ولا يلغي الحاجة إلى حكم بشري.',
            en: 'The spec is executed as written; if it is vague or wrong you confidently generate a fast copy of the same misunderstanding that would otherwise hide in the code. SDD moves the effort into writing an unambiguous spec; it does not remove the need for human judgment.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'عودة إلى الفصل 4: البيان يعلن "قائمة الأعمال ماتت — أدر بالكلفة لا بالطاقة". ما الذي لا يزول من أدوات الفصل 4؟',
            en: 'Back to Chapter 4: the manifesto declares "the backlog is dead — manage to cost, not capacity". What from Chapter 4 does NOT vanish?',
          },
          options: [
            { id: 'a', text: { ar: 'تقدير الساعات لكل قصة', en: 'hour estimates per story' } },
            { id: 'b', text: { ar: 'الأولوية تحت الندرة: MoSCoW والقيمة/الكلفة/الخطر يبقى — تتغير عملته', en: 'prioritization under scarcity: MoSCoW and value/cost/risk remain — their currency changes' } },
            { id: 'c', text: { ar: 'حفظ السرعة (velocity) ثابتة بين السبرنتات', en: 'keeping velocity constant across sprints' } },
            { id: 'd', text: { ar: 'لا شيء؛ التقدير أصبح بلا معنى', en: 'nothing; estimation became meaningless' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حتى لو صار بناء الأفكار رخيصًا، تبقى الميزانية والانتباه نادرين، فالأولوية لا تموت: المحور الجديد "هل تستحق هذه النتيجة كلفة الحوسبة؟" — نفس أدوات القيمة/الكلفة/الخطر بعملة جديدة.',
            en: 'Even when building an idea becomes cheap, budget and attention stay scarce, so prioritization does not die: the question becomes "is this outcome worth the compute cost?" — the same value/cost/risk tools with a new currency.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'بيان o16g: لم يكن الأمر أبدًا عن الشيفرة — أربع نقلات وستة عشر مبدأً يطابقون أساسيات الكتاب: حقيقة موثقة، دستور مشفَّر، خطر يوقف الخط، ومحاسبة النواتج.', en: 'The o16g manifesto: it was never about the code — four shifts and sixteen principles that map onto the book: verified reality, coded constitution, risk stops the line, audited outcomes.' },
        { ar: 'اقرأه استفزازًا: تحدياته مفتوحة — كلفة الحوسبة ليست مجانية، اليقين يصطدم بمشكلة الميزان، والمبدأ 16 يستهلك الخبرة التي يعتمد عليها.', en: 'Read it as a provocation: its challenges are open — compute is not free, certainty hits the oracle problem, and Principle 16 consumes the expertise it depends on.' },
        { ar: 'SDD يقلب العلاقة: الموصفة أثر دائم والشيفرة ناتج مولَّد؛ خط الأنابيب دستور ثم تحديد ثم خطة ثم مهام ثم تنفيذ، وبوابة بشرية بين كل مرحلتين.', en: 'SDD inverts the relation: the spec is the durable artifact and the code a generated output; the pipeline runs constitution, specify, plan, tasks, implement with a human gate between phases.' },
        { ar: 'الفخ: موصفة مهملة تشفّر سوء فهم وتجعله مصدر الحقيقة — انقل جهدك إلى كتابة موصفة دقيقة تكفي لتكون عقدًا.', en: 'The catch: a careless spec encodes a misunderstanding and makes it the source of truth — move your effort into a spec precise enough to be a contract.' },
      ],
      reflectPrompt: {
        ar: 'خذ آخر ميزة طلبتها من وكيل بجملة واحدة: ماذا كانت ستفعل موصفة من خمسة سيناريوهات Given/When/Then بأخطائه الأولى؟',
        en: 'Take the last feature you requested from an agent in one sentence: what would a five-scenario Given/When/Then spec have changed about its first attempts?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch13.s4', pages: 'ص352 / pp.352' },
        { book: 'SWE', section: 'swe.ch13.s5', pages: 'ص354 / pp.354' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch13.s4', pages: 'ص352 / pp.352' },
    { book: 'SWE', section: 'swe.ch13.s5', pages: 'ص354 / pp.354' },
  ],
} satisfies Lesson;

export default lesson;
