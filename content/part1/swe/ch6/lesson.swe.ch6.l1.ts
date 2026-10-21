/**
 * Lesson swe.ch6.l1 — دور المعمارية وتصميم الأنظمة المعيارية
 *   / The Role of Architecture and Modular Design
 * Book: SWE — Chapter 6 'Design and Architecture'
 *   §6.1 The Role of Architecture (pp.145-149), §6.2 Designing Modular Systems (pp.149-153)
 * Runnable design: a module dependency graph held in dicts -> compute fan-in/fan-out
 *   per module and print a deterministic coupling summary (short ASCII lines).
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch6.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 6,
  title: {
    ar: 'دور المعمارية وتصميم الأنظمة المعيارية',
    en: 'The Role of Architecture and Modular Design',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch5.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الساعة 2:47 فجرًا وصفحة الدفع متوقفة. الفريق يكتشف أن "تغييرًا صغيرًا" في مزوّد الدفع يمسّ أحد عشر ملفًا، لأن كل وحدة في النظام كانت تعرف تفاصيل المزوّد. هذه هي اللحظة التي تكتشف فيها أن لنظامك جدرانًا حملًا لم يرسمها أحد. هذا الفصل يعلّمك أن ترسم الجدران عن قصد — قبل أن تكتشفها في الإنتاج.',
        en: 'It is 2:47 a.m. and checkout is down. The team discovers that a "small" change to the payment provider touches eleven files, because every module in the system knew the provider\'s details. This is the moment you learn your system has load-bearing walls nobody drew. This chapter teaches you to draw them on purpose — before production finds them for you.',
      },
    },
    {
      kind: 'predict',
      code: `a = {"payments": ["card_api", "ledger", "email", "logging"]}
b = {"payments": ["pay_interface"],
     "card_api": ["pay_interface"],
     "ledger": ["pay_interface"],
     "email": ["pay_interface"],
     "logging": ["pay_interface"]}
print("A edges:", sum(len(v) for v in a.values()))
print("B edges:", sum(len(v) for v in b.values()))
print("B payments imports:", b["payments"])`,
      question: {
        ar: 'نفس التطبيق موصول بطريقتين. أي التصميمين يسمح بتغيير مزوّد الدفع دون لمس بقية الوحدات — ولماذا يخدعك عدد الحواف وحده؟',
        en: 'The same app, wired two ways. Which design lets you swap the payment provider without touching the rest — and why does the edge count alone mislead you?',
      },
      reveal: {
        ar: 'التصميم B. في A تعرف أربعة أجزاء تفاصيل المزوّد؛ في B يدور كل شيء حول واجهة pay_interface واحدة صغيرة. حواف B أكثر (5 مقابل 4) — المعمارية لا تُقاس بعدد الأسلاك بل بأين تشير: القرار المتغيّر (أي مزوّد؟) مخفي خلف واجهة واحدة.',
        en: 'Design B. In A, four parts know the provider\'s details; in B everything orbits one small pay_interface. B has more edges (5 vs 4) — architecture is not wire count but where wires point: the volatile decision (which provider?) hides behind one interface.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ما المعمارية فعلًا؟', en: 'What Architecture Actually Is' },
      chunks: [
        {
          ar: 'المعمارية ليست رسمًا جميلًا يُعلَّق على الحائط. عرّفها هكذا: مجموعة القرارات المهمة حول بنية النظام — مكوّناته components، مسؤوليات كل مكوّن وواجهاته interfaces، والعلاقات والقيود بينها — المختارة لخدمة متطلبات الجودة الأهم. الكلمة الحاسمة هي "المهمة": هل تأخذ الدالة المساعدة وسيطين أم ثلاثة؟ قرار محلي تغيّره ظهر الثلاثاء ولن يلاحظه أحد. هل تخزن الحالة في قاعدة بيانات واحدة مشتركة أم لكل خدمة مخزنها؟ قرار قد يكلف سنة وإعادة كتابة كاملة لتراجعه. القاعدة العملية: القرارات المعمارية هي التي يصعب تغييرها بعد أن يُبنى غيرها عليها، ولهذا تستحق التفكير قبل الكود لا بعده.',
          en: 'Architecture is not a pretty diagram on a wall. Define it as: the set of significant decisions about how the system is structured — its components, each component\'s responsibilities and interfaces, and the relationships and constraints among them — chosen to serve the most important quality requirements. The loaded word is significant. Does a helper take two arguments or three? A local decision you change on a Tuesday afternoon and nobody notices. Does state live in one shared database or one store per service? A decision that may cost a year and a rewrite to reverse. The practical rule: architectural decisions are the expensive-to-change ones — they deserve thought before the code, not after.',
        },
        {
          ar: 'التفصيلة الثانية: المعمارية تتحدث عن "الخارج" لكل جزء. حين تقول "وحدة payments تتحدث مع ledger عبر واجهة موثّقة فقط" فأنت تصدر حكمًا معماريًا؛ وحين تقول "ledger يرتب مدخلاته بـ quicksort" فأنت تصف تنفيذًا داخليًا. الخط الفاصل هو بالضبط ما يمكن للآخرين الاعتماد عليه وما يجب ألا يعتمدوا عليه. وانتبه: التصميم continuum واحد متصل — المعمارية طرفه الأشد أثرًا: من تقسيم النظام إلى web client وAPI server وworker، وصولًا إلى بنية البيانات داخل دالة. كل مستوى يقيّد ما تحته ويُحقَّق بواسطته، ولا يمكن فصل "المعماريين" عن "المبرمجين" فصلًا كاملًا.',
          en: 'Second subtlety: architecture speaks about each part\'s outside. "The payments module talks to the ledger only through a documented interface" is an architectural statement; "the ledger sorts its entries with quicksort" describes an implementation. The dividing line is exactly what others may depend on and what they must not. And note: design is one continuous spectrum — architecture is its most consequential end, from carving the system into a web client, an API server, and a worker, down to the data structure inside one function. Each level constrains the ones below and is realized by them; you cannot fully separate "the architects" from "the programmers".',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'كيف نحكم أن معمارية جيدة؟', en: 'Judging a Good Architecture' },
      chunks: [
        {
          ar: 'لا توجد معمارية "صحيحة" واحدة، بل تراكيب تخدم أهدافًا مختلفة بأثمان مختلفة. أربعة اختبارات عملية: أولًا تناسب متطلبات الجودة المهمة — المتطلبات غير الوظيفية non-functional مثل الأداء والتوافر والأمان وقابلية التعديل هي التي تستبعد أغلب التراكيب، لأن الوظيفية تُحقَّق بتراكيب كثيرة. ثانيًا تجعل التغييرات المتوقعة رخيصة: لا معمارية تجعل كل تغيير رخيصًا؛ الرابح هو من يعزل الأجزاء الأكثر احتمالًا للتغيّر — الواجهة، قواعد الضريبة، مزوّد الدفع. ثالثًا يمكن فهمها: معمارية لا يحملها أحد في رأسه ستُخرَق حدودها. رابعًا قابلة للبناء والاختبار: هيكل يُجبر كل اختبار على إقامة النظام كاملًا هو هيكل سيئ.',
          en: 'There is no single correct architecture, only structures that serve different goals at different prices. Four practical tests. First, it fits the important quality requirements — the non-functional ones like performance, availability, security, and modifiability rule out most structures, because functional ones can be met many ways. Second, it makes likely changes cheap: no architecture makes every change cheap; the winner isolates the parts most likely to change — the UI, tax rules, the payment provider. Third, it can be understood: an architecture nobody holds in their head will have its boundaries violated. Fourth, it is buildable and testable: a structure forcing every test to spin up the whole system is a bad one.',
        },
        {
          ar: 'لأنك لا تستطيع تعظيم كل السمات معًا، المعمارية الجيدة تسجّل مقايضاتها trade-offs بوعي: أي جودة نشتري وأيها ندفع. ولتحويل "النظام يجب أن يكون سريعًا" إلى شيء قابل للحكم، اكتب سيناريو جودة quality-attribute scenario: مثير stimulus (طلب حجز أو انهيار مزوّد)، بيئة environment (ذروة الصباح)، استجابة response (تأكيد الحجز على الشاشة)، ومقياس استجابة response measure (أقل من ثانية لـ 95% من الطلبات). لاحظ أن المقياس هو معيار القياس fit criterion من الفصل 3 بثياب معمارية. السيناريو اختبار معمارية تجريه على الورق قبل أن يصير اختبارًا حقيقيًا — والجودة بلا سيناريو تبقى رأيًا لا يستبعد أي تصميم.',
          en: 'Because you cannot maximize all qualities at once, a good architecture records its trade-offs deliberately: which quality you buy and which you pay for. To turn "the system should be fast" into something judgeable, write a quality-attribute scenario: a stimulus (a booking request or a provider outage), an environment (morning peak), a response (the booking is confirmed on screen), and a response measure (under one second for 95% of submissions). Note the measure is ch3\'s fit criterion wearing architectural clothes. The scenario is an architecture test you run on paper before it becomes a real test — and a quality with no scenario stays an opinion that rules out no design.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'التصميم المعياري: إخفاء وترابط وتماسك', en: 'Modular Design: Hiding, Coupling, Cohesion' },
      chunks: [
        {
          ar: 'أقوى فكرة في التصميم: ابنِ النظام من وحدات modules يمكن فهم كل واحدة وبناءها واختبارها بمفردها. قيمة الوحدة تأتي من ما تخفيه: صمّم كل وحدة حول قرار — عادة قرار متوقع أنه سيتغير — وأخفه خلف واجهة صغيرة. وحدة سجلات المستخدمين تكشف find وsave فقط وتخفي هل التخزين ملف JSON أم قاعدة بيانات؛ حين يتبدّل السرّ لا يتأثر أي مستدعٍ اعتمد الوعد فقط. إخفاء المعلومات information hiding هو القصد، والتغليف encapsulation هو الإنفيذ الذي تفرضه اللغة. وكل طريقة عامة وعدٌ لا تستطيع التراجع عنه بهدوء — لهذا يقاتل المصممون المتمرسون على إبقاء الواجهات ضيقة.',
          en: 'The most powerful idea in design: build the system from modules that can each be understood, built, and tested alone. A module\'s value comes from what it hides: design each module around a decision — usually one expected to change — and hide it behind a small interface. A user-records module exposes only find and save and hides whether storage is a JSON file or a database; when the secret changes, no caller relying on the promise breaks. Information hiding is the intent; encapsulation is the enforcement the language provides. Every public method is a promise you cannot quietly walk back — which is why veterans fight to keep interfaces narrow.',
        },
        {
          ar: 'مقياسان يحكمان جودة التقسيم ويسيران معًا: الترابط coupling بين الوحدات — أرده منخفضًا — والتماسك cohesion داخل الوحدة — أريده عاليًا. سلّم الترابط من الأسوأ للأفضل: content (تلاعب بمفاصل وحدة أخرى) ثم common (حالة عالمية مشتركة) ثم control (راية تختار السلوك) ثم stamp (تمرير سجل كامل لأجل حقليه) ثم data (معاملات بسيطة فقط). وسلّم التماسك: coincidental (كيس utils) ثم logical ثم temporal حتى functional: كل جزء يخدم مهمة واحدة محددة. ارفع التماسك ينخفض الترابط تلقائيًا. قاعدة ذهبية: إن لم تستطع وصف مهمة الوحدة بجملة واحدة بلا "و" فافصلها. وتجنّب الدورات: وحدتان تتبعيان بعضهما وحدة واحدة بخطٍ فوقها.',
          en: 'Two measures judge a decomposition and travel together: coupling between modules — want it low — and cohesion inside each — want it high. The coupling ladder, worst to best: content (reaching into another\'s internals), common (shared global state), control (a flag picking behavior), stamp (passing a whole record for two fields), data (simple parameters only). The cohesion ladder: coincidental (a utils grab-bag), logical, temporal, up to functional: every part serves one well-defined task. Raise cohesion and coupling falls. Golden rule: if you cannot state a module\'s job in one sentence without "and", split it. Avoid cycles: two modules depending on each other are one module with a line through it.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نحسب fan-out وfan-in لخريطة الوحدات', en: 'Computing fan-out and fan-in for a module map' },
      code: `imports = {
    "ui": ["app", "format"],
    "app": ["domain", "store"],
    "domain": [],
    "store": ["domain"],
    "format": [],
}

fan_out = {m: len(deps) for m, deps in imports.items()}
fan_in = {m: 0 for m in imports}
for deps in imports.values():
    for d in deps:
        fan_in[d] += 1

for m in imports:
    print(m, "fan-out", fan_out[m], "fan-in", fan_in[m])

hub = max(fan_in, key=lambda m: fan_in[m])
busiest = max(fan_out, key=lambda m: fan_out[m])
print(f"most depended-on: {hub} ({fan_in[hub]} importers)")
print(f"widest caller: {busiest} ({fan_out[busiest]} imports)")`,
      explanation: {
        ar: 'القاموس imports هو منظور التطوير development view مصغّرًا: كل وحدة وما تستورده. fan-out = كم وحدة تستوردها؛ fan-in = كم وحدة تستوردها. لاحظ domain: تجذب استيرادين وتستورد صفرًا — قلب مستقر لا يعتمد على أحد. وui أوسع مستدعٍ. هذان الرقمان يفتحان أي حديث جدي عن الترابط coupling قبل أن تفتح المخططات.',
        en: 'The imports dict is a miniature development view: each module and what it imports. fan-out = how many modules it imports; fan-in = how many import it. Watch domain: it pulls two importers and imports nothing — a stable heart. ui is the widest caller. These two numbers open any serious conversation about coupling before any diagram does.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.coupling-kind',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في مراجعة كود وجدت دالة process(data, mode) حيث mode يختار بين تسعير B2B وتسعير التجزئة، والمستدعي مضطر لفهم فروع الدالة الداخلية ليختار mode الصحيح. أي نوع ترابط coupling هذا؟',
        en: 'In code review you find process(data, mode) where mode picks between B2B and retail pricing, and the caller must understand the function\'s internal branches to pass the right mode. Which kind of coupling is this?',
      },
      options: [
        { id: 'a', text: { ar: 'data coupling — معاملات بسيطة فقط', en: 'data coupling — simple parameters only' } },
        { id: 'b', text: { ar: 'control coupling — راية تختار السلوك', en: 'control coupling — a flag choosing behavior' } },
        { id: 'c', text: { ar: 'common coupling — حالة عالمية مشتركة', en: 'common coupling — shared global state' } },
        { id: 'd', text: { ar: 'stamp coupling — تمرير سجل كامل لأجل حقلين', en: 'stamp coupling — passing a whole record for two fields' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل: ما الذي يمرّ في mode فعليًا؟ ليس بيانات يحتاجها المستدَى — بل أمرًا يبدّل سلوكه.', en: 'Ask: what actually travels in mode? Not data the callee needs — an instruction that switches its behavior.' },
        { ar: 'حين يجب على المستدعي فهم منطق المستدَى الداخلي ليختار الوسيطة الصحيحة، فأنت فوق data coupling في السلّم بدرجة.', en: 'When the caller must understand the callee\'s internal logic to choose the right argument, you are one rung above data coupling.' },
        { ar: 'لو قسّمت process إلى process_b2b وprocess_retail لاختفت الحاجة إلى mode كليًا — هذه بصمة النوع المذنب.', en: 'Split process into process_b2b and process_retail and the need for mode vanishes — that is the guilty kind\'s fingerprint.' },
        { ar: 'النوع هو control coupling: وسيطة control تُخفي فروع المستدَى داخل واجهته.', en: 'The kind is control coupling: a control argument hides the callee\'s branches inside its interface.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.coupling-report',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ تقرير الترابط الأول: احسب fan-out وfan-in لكل وحدة في الخريطة المعطاة، واطبع سطرًا لكل وحدة بالصيغة name fan-out X fan-in Y، ثم اطبع محور الاعتماد بالصيغة hub: NAME (الوحدة صاحبة أعلى fan-in).',
        en: 'Build the first coupling report: compute each module\'s fan-out and fan-in in the given map, print one line per module as name fan-out X fan-in Y, then print the dependency hub as hub: NAME (the module with the highest fan-in).',
      },
      starterCode: `imports = {
    "ui": ["app", "format"],
    "app": ["domain", "store"],
    "domain": [],
    "store": ["domain"],
    "format": [],
}

# 1) build fan_out: module -> how many modules it imports
# 2) build fan_in:  module -> how many modules import it
# 3) print one line per module:  name fan-out X fan-in Y
# 4) print the hub:  hub: NAME   (highest fan-in)`,
      solution: `imports = {
    "ui": ["app", "format"],
    "app": ["domain", "store"],
    "domain": [],
    "store": ["domain"],
    "format": [],
}

fan_out = {}
fan_in = {m: 0 for m in imports}
for m, deps in imports.items():
    fan_out[m] = len(deps)
    for d in deps:
        fan_in[d] += 1

for m in imports:
    print(m, "fan-out", fan_out[m], "fan-in", fan_in[m])

hub = max(fan_in, key=lambda m: fan_in[m])
print("hub:", hub)`,
      tests: [
        {
          id: 't1',
          name: { ar: 'سطر domain صحيح', en: 'domain line is right' },
          code: `assert 'domain fan-out 0 fan-in 2' in __learner_output__, 'expected: domain fan-out 0 fan-in 2 | actual: %r' % __learner_output__`,
        },
        {
          id: 't2',
          name: { ar: 'المحور هو domain', en: 'hub is domain' },
          code: `assert 'hub: domain' in __learner_output__, 'expected: hub: domain | actual: %r' % __learner_output__`,
        },
        {
          id: 't3',
          name: { ar: 'ستة أسطر تقرير', en: 'six report lines' },
          code: `assert __learner_output__.strip().count("\\n") == 5, 'expected: 6 report lines | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'fan-out سهل: len(deps) لكل وحدة مباشرة من القاموس.', en: 'fan-out is easy: len(deps) per module, straight from the dict.' },
        { ar: 'fan-in يحتاج مسحًا ثانيًا: ابدأ fan_in = {m: 0 for m in imports} ثم لكل قائمة تبعيات زد عدّاد الهدف واحدًا.', en: 'fan-in needs a second sweep: start with fan_in = {m: 0 for m in imports}, then for each dependency list bump the target\'s counter.' },
        { ar: 'طبّع شكل السطر: print(m, "fan-out", fan_out[m], "fan-in", fan_in[m]) يعطي الاسم والفراغات المطلوبة تمامًا.', en: 'Normalize the line: print(m, "fan-out", fan_out[m], "fan-in", fan_in[m]) gives exactly the required spacing.' },
        { ar: 'قريب من الحل: hub = max(fan_in, key=lambda m: fan_in[m]) ثم print("hub:", hub).', en: 'Nearly there: hub = max(fan_in, key=lambda m: fan_in[m]) then print("hub:", hub).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-secret',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود بتمعّن واكتب مخرجه الحرفي. السطران يوضحان الفرق بين الوعد (الواجهة) والسر (التنفيذ).',
        en: 'Read the code carefully and write its exact output. The two lines illustrate the difference between the promise (the interface) and the secret (the implementation).',
      },
      code: `class Ledger:
    def __init__(self):
        self._entries = []          # the secret: the storage decision
    def add(self, amount):
        self._entries.append(amount)
    def total(self):
        return sum(self._entries)

ledger = Ledger()
ledger.add(30)
ledger.add(12)
print("total:", ledger.total())
print("peeking at the secret:", ledger._entries)`,
      answer: 'total: 42\npeeking at the secret: [30, 12]',
      solution: 'total: 42\npeeking at the secret: [30, 12]',
      hints: [
        { ar: '_entries تبدأ قائمة فارغة، ثم يُلحق بها 30 ثم 12 بالترتيب.', en: '_entries starts as an empty list, then 30 and 12 are appended in order.' },
        { ar: 'total() يجمع القائمة: 30 + 12.', en: 'total() sums the list: 30 + 12.' },
        { ar: 'print بالفواصل يضيف فراغًا واحدًا بين الأجزاء: total: 42.', en: 'print with commas adds one space between parts: total: 42.' },
        { ar: 'السطر الثاني يطبع القائمة الخام: [30, 12] — التسلل إلى السر ممكن في بايثون لكن الوعد يمنعه بالاصطلاح.', en: 'The second line prints the raw list: [30, 12] — peeking is possible in Python, but the promise forbids it by convention.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-hiding',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: الوحدة المصمَّمة حول قرار متغيّر تخفيه خلف واجهة صغيرة تحقق مبدأ information ______ (كلمة إنجليزية واحدة).',
        en: 'Complete the term: a module designed around a changeable decision hidden behind a small interface embodies information ______ (one English word).',
      },
      answer: 'hiding',
      solution: 'hiding',
      hints: [
        { ar: 'المقصود القصد لا الإنفيذ — الإنفيذ اسمه encapsulation.', en: 'The intent, not the enforcement — enforcement is called encapsulation.' },
        { ar: '"callers should not know how records are stored" هو وصف هذا المبدأ.', en: '"callers should not know how records are stored" describes this principle.' },
        { ar: 'المصطلح الشهير المرتبط بورقة Parnas عام 1972.', en: 'The famous term tied to Parnas\'s 1972 paper.' },
        { ar: 'الكلمة المطلوبة: hiding.', en: 'The word: hiding.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `imports = {
    "ui": ["app", "format"],
    "app": ["domain", "store"],
    "domain": [],
    "store": ["domain"],
    "format": [],
}

fan_out = {m: len(ds) for m, ds in imports.items()}
fan_in = {m: 0 for m in imports}
for ds in imports.values():
    for d in ds:
        fan_in[d] += 1

for m in imports:
    print(m, "fan-out", fan_out[m], "fan-in", fan_in[m])

# Try it: make "format" import "domain" and re-run — watch domain's fan-in.
# Then invent a module "helpers" that imports four things. What is its
# fan-out, and would you flag it as a design smell?`,
      prompt: {
        ar: 'ميدان التجربة: أضف حوافًا جديدة للخريطة وراقب كيف يتحرك fan-in وfan-out. هل تستطيع بناء وحدة تجمع أعلى fan-in وأعلى fan-out معًا؟ ماذا تسمي هذه الوحدة؟',
        en: 'Playground: add new edges and watch fan-in and fan-out move. Can you build a module that tops both fan-in and fan-out at once? What would you call such a module?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'أي القرارات التالية يعد قرارًا معماريًا architectural بمعنى هذا الفصل؟',
            en: 'Which of the following is an architectural decision in this chapter\'s sense?',
          },
          options: [
            { id: 'a', text: { ar: 'أن تأخذ الدالة المساعدة وسيطين بدل ثلاثة', en: 'Whether a helper takes two arguments instead of three' } },
            { id: 'b', text: { ar: 'حالة واحدة في قاعدة بيانات مشتركة أم مخزن لكل خدمة', en: 'One shared database versus a store per service' } },
            { id: 'c', text: { ar: 'تسمية المتغير total أو sum_so_far', en: 'Naming the variable total or sum_so_far' } },
            { id: 'd', text: { ar: 'استخدام حلقة for أم list comprehension', en: 'A for loop versus a list comprehension' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'القرار المعماري هو ما يصعب التراجع عنه بعد البناء عليه: خريطة التخزين قد تكلّف سنة وإعادة كتابة، والبقية قرارات محلية يومية.',
            en: 'An architectural decision is one expensive to reverse once built upon: the storage map can cost a year and a rewrite; the rest are local daily choices.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ترفع تماسك وحدة cohesion. ما المتوقع أن يحدث لترابطها coupling مع بقية الوحدات؟',
            en: 'You raise a module\'s cohesion. What is expected to happen to its coupling with the rest?',
          },
          options: [
            { id: 'a', text: { ar: 'يرتفع لأن الوحدة أصبحت أكثر أهمية', en: 'It rises because the module became more important' } },
            { id: 'b', text: { ar: 'ينخفض عادةً لأن المنطق المتقارب اجتمع فلم تعد تمتد يدها عبر الحدود', en: 'It usually falls because related logic now sits together, so the module reaches across fewer boundaries' } },
            { id: 'c', text: { ar: 'لا علاقة بين المقياسين إطلاقًا', en: 'The two measures are unrelated' } },
            { id: 'd', text: { ar: 'يتضاعف لأن عدد الاتصالات زاد', en: 'It doubles because the number of calls grew' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المقياسان يسيران في اتجاه واحد: وحدة تؤدي مهمة واحدة لا تحتاج إلى مسّ خمس وحدات أخرى لإنجازها.',
            en: 'The two measures pull the same way: a module doing one job does not need to touch five other modules to do it.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'بعودتك إلى تصنيف الفصل 3 للمتطلبات: أي نوع هو الذي يستبعد أغلب التراكيب الممكنة ويقود شكل المعمارية فعلًا؟',
            en: 'Returning to ch3\'s taxonomy of requirements: which kind rules out most candidate structures and actually drives the architecture?',
          },
          options: [
            { id: 'a', text: { ar: 'المتطلبات الوظيفية functional — تُحقَّق بتراكيب كثيرة', en: 'Functional requirements — many structures can meet them' } },
            { id: 'b', text: { ar: 'متطلبات الجودة non-functional مثل الأداء والتوافر والأمان', en: 'Non-functional requirements like performance, availability, security' } },
            { id: 'c', text: { ar: 'الملاحظات العابرة في اجتماع العميل', en: 'Passing remarks from the client meeting' } },
            { id: 'd', text: { ar: 'تفضيلات المطورين للأدوات', en: 'The developers\' tooling preferences' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الوظيفية تُلبّى بتراكيب كثيرة، لكن الجودة تُسقط أغلبها — ولهذا تُكتب كسيناريوهات جودة بمقياس استجابة، وهو تطبيق لمعيار القياس fit criterion من الفصل 3.',
            en: 'Functional needs can be met many ways; quality needs rule most structures out — which is why they are written as quality-attribute scenarios with a response measure, ch3\'s fit criterion applied to architecture.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ما الفرق الدقيق بين information hiding وencapsulation؟',
            en: 'What is the precise difference between information hiding and encapsulation?',
          },
          options: [
            { id: 'a', text: { ar: 'مترادفان تمامًا ويمكن تبادلهما', en: 'They are exact synonyms, interchangeable' } },
            { id: 'b', text: { ar: 'الإخفاء هو القصد التصميمي، والتغليف هو الإنفيذ الذي تفرضه اللغة على الحدود', en: 'Hiding is the design intent; encapsulation is the enforcement the language imposes at the boundary' } },
            { id: 'c', text: { ar: 'التغليف يعني جعل كل حقول الصنف خاصة private', en: 'Encapsulation means making every field private' } },
            { id: 'd', text: { ar: 'الإخفاء يعني إخفاء الكود عن بقية الفريق', en: 'Hiding means hiding code from the rest of the team' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قد توفر اللغة تغليفًا كاملًا ومع ذلك يتسرب السر عبر واجهة تعيد بنية داخلية: القصد شيء والإنفيذ شيء آخر.',
            en: 'A language can enforce encapsulation perfectly while the secret still leaks through an interface that returns internal structures: intent and enforcement are different things.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'أنشأنا utils.py ونضع فيه كل ما هو مشترك — حل عملي وسريع.',
          right: 'وحدة بلا مسؤولية واحدة تجذب تبعيات من كل الاتجاهات: fan-in مرتفع وفان-out مرتفع معًا. صف مهمتها بجملة واحدة بلا "و"؛ إن فشلت الجملة فقسّمها.',
          note: {
            ar: 'أشهر فشل تماسك يرتدي اسمًا ودودًا: utility. ستلاحظها بنفسك في مشروع هذا الفصل حين يصفّح محلل التبعيات.',
            en: 'The most famous cohesion failure wears a friendly name: utility. You will catch one yourself in this chapter\'s project when the dependency analyzer calls it out.',
          },
        },
        {
          wrong: 'المعمارية شغل المعماري؛ أنا مبرمج أكتب دالة صغيرة.',
          right: 'كل قرار في الكود قرار micro-architectural. إن تجاهلت الحدود المرسومة انحرفت المعمارية الحقيقية عن المرسومة، ولن ينقذها رسم جميل.',
          note: {
            ar: 'المعالجة: مراجعة التغييرات مقابل وثيقة المعمارية، وكتابتها بجانب الكود حيث يراها كل من يعدّل.',
            en: 'The fix: review changes against the architecture document and keep it next to the code where every editor sees it.',
          },
        },
        {
          wrong: 'نبني طبقة تجريد لكل شيء تحسبًا لأي تغيير محتمل.',
          right: 'المرونة تُشترى حيث التغيير متوقع فقط: المزوّدون الخارجيون، قواعد العمل، العرض. مرونة بلا سبب هي over-engineering — تعقيد عرضي يدفع ثمنه كل من يقرأ الكود.',
          note: {
            ar: 'لا معمارية تجعل كل تغيير رخيصًا؛ اختر تغييراتك المرشّحة واسقف فوقها فقط.',
            en: 'No architecture makes every change cheap; pick your likely changes and roof over those alone.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'المعمارية = القرارات المهمة (المكوّنات، الواجهات، العلاقات) المختارة لخدمة متطلبات الجودة؛ بصمتها أنها مكلفة التغيير بعد البناء عليها.',
          en: 'Architecture = the significant decisions (components, interfaces, relationships) chosen to serve quality requirements; their signature is being expensive to change once built upon.',
        },
        {
          ar: 'الوحدة الجيدة تخفي قرارًا واحدًا خلف واجهة صغيرة: إخفاء المعلومات قصدًا والتغليف إنفيذًا.',
          en: 'A good module hides one decision behind a small interface: information hiding is the intent, encapsulation the enforcement.',
        },
        {
          ar: 'ارفع التماسك وأخفض الترابط؛ سلّم الترابط من content إلى data، وافصل أي وحدة لا تُوصف بجملة بلا "و".',
          en: 'Raise cohesion, lower coupling; the coupling ladder runs from content to data, and split any module you cannot describe in one "and"-free sentence.',
        },
        {
          ar: 'رقما fan-out وfan-in يكشفان المحاور والرائحات قبل أن تصير حوادث إنتاج في الثالثة فجرًا.',
          en: 'fan-out and fan-in expose hubs and smells before they become 3 a.m. production incidents.',
        },
      ],
      reflectPrompt: {
        ar: 'انظر إلى آخر مشروع كتبته: أي وحدة كانت utils متنكرة؟ وأي قرار كان يجب إخفاؤه خلف واجهة ولم يُخفَ؟',
        en: 'Look at your last project: which module was a utils in disguise? And which decision should have been hidden behind an interface but was not?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch6.s1', pages: 'ص145-149 / pp.145-149' },
        { book: 'SWE', section: 'swe.ch6.s2', pages: 'ص149-153 / pp.149-153' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch6.s1', pages: 'ص145-149 / pp.145-149' },
    { book: 'SWE', section: 'swe.ch6.s2', pages: 'ص149-153 / pp.149-153' },
  ],
} satisfies Lesson;

export default lesson;
