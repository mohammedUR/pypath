/**
 * Lesson swe.ch6.l3 — مناظر المعمارية ووصفها
 *   / Architectural Views and Describing Architecture
 * Book: SWE — Chapter 6 'Design and Architecture'
 *   §6.4 Architectural Views (pp.156-158), §6.5 Describing System Architecture (pp.158-162)
 * Runnable design: one fixed system held as three tiny view tables (modules /
 *   runtime connectors / deployment nodes) -> functions answer view-specific
 *   queries (what runs on node X? who talks to Y?) printing short ASCII lines.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch6.l3',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 6,
  title: {
    ar: 'مناظر المعمارية ووصفها',
    en: 'Architectural Views and Describing Architecture',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch6.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'مهندس تشغيل جديد يجلس معك أمام تطبيق المراسلة. سؤالاه: "أي خادم يشغّل مخزن المرفقات؟" و"إذا سقط مخزن المرفقات، هل تبقى رسائل النص تتدفق؟" أمامك مخطط الأصناف الجميل من الدرس الماضي — ولا يجيب عن أيٍّ من السؤالين. المخططات الساكنة تصف البنية، لا وقت التشغيل ولا النشر. هذا الدرس يعلّمك أن ترى النظام من عدة زوايا، ثم أن تكتب ما تراه حتى يجيب المستجدون عن أسئلتهم بأنفسهم.',
        en: 'A new operations engineer sits with you in front of the messaging app. Their two questions: "which server runs the attachment store?" and "if the attachment store falls over, do text messages keep flowing?" In front of you is the beautiful class diagram from the last lesson — and it answers neither question. Static diagrams describe structure, not runtime and not deployment. This lesson teaches you to see the system from several angles, then to write down what you see so newcomers can answer their own questions.',
      },
    },
    {
      kind: 'predict',
      code: `MODULES = {"messaging"}                     # one box in the development view
PROCESSES = {"router", "sender", "sync"}    # three processes at runtime
NODES = {"app-1", "app-2"}                  # two machines in the deployment view

print("one thing, three views:", len(MODULES), len(PROCESSES), len(NODES))`,
      question: {
        ar: 'قبل التنفيذ: الشيء نفسه يُرى من ثلاثة مناظر. كم صندوقًا تمثل messaging في منظر التطوير، ومنظر التشغيل، ومنظر النشر؟',
        en: 'Before running: the same thing seen through three views. How many boxes does messaging occupy in the development view, the process view, and the deployment view?',
      },
      reveal: {
        ar: 'واحد وثلاثة واثنان: الصندوق الواحد في منظر التطوير ينشطر عند التشغيل إلى ثلاث عمليات ويهبط على جهازين في النشر. لذلك منظر لكل زاوية: مخطط واحد يجمع الثلاثة يخرج خاطئًا من كل زاوية.',
        en: 'One, three, two: a single box in the development view splits into three processes at runtime and lands on two machines in deployment. Hence one view per angle: a diagram forcing them together is wrong from every angle.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'لا مخطط واحد يكفي: مناظر لأسئلة مختلفة',
        en: 'No Single Diagram Suffices: Views for Different Questions',
      },
      chunks: [
        {
          ar: 'لا يلتقط مخطط واحد نظامًا كاملًا، تمامًا كما لا تلتقط صورة واحدة مبنى كاملًا. أصحاب المصلحة يسألون أسئلة مختلفة: ما المسؤوليات؟ كيف يتصرف تحت الحمل؟ كيف أبني الشيفرة؟ أي خادم يشغّل ماذا؟ وكل سؤال تجيبه صورة مختلفة. المنظر view هو تمثيل للنظام من زاوية واحدة، وتجمع صيغة 4+1 الشهيرة هذه المناظر. المنظر المنطقي logical يعرض التجريدات الأساسية: الأصناف ومسؤولياتها — وهنا تسكن مخططات الأصناف. منظر العملية process يعرض النظام وقت التشغيل: العمليات، اتصالها، الاختناقات، الإنتاجية، التوافر. منظر التطوير development خريطة المبرمج: الوحدات والحزم والطبقات وما يجوز أن يعتمد على ماذا. والمنظر الفيزيائي deployment يوزع البرمجيات على العقد: ماذا يعمل أين. والـ +1 سيناريوهات: حالات استخدام قليلة تجول عبر المناظر الأربعة فتفحص اتساقها.',
          en: 'A single diagram cannot capture a whole system any more than one photograph captures a building. Stakeholders ask different questions — what are the responsibilities? how does it behave under load? how do I build the code? which server runs what? — and each question is best answered by a different picture. A view is a representation of the system from one such perspective, and the 4+1 grouping ties them together. The logical view shows the key abstractions: classes and their responsibilities — class diagrams live here. The process view shows the system at runtime: processes, how they communicate, deadlocks, throughput, availability. The development view is the programmer\'s map: modules, packages, layers, what may depend on what. The physical or deployment view maps software onto nodes: what actually runs where. The +1 is scenarios — a few use cases walked through all four views, checking that they agree.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الهيكل مقابل المنظر: ثلاث عائلات', en: 'Structure versus View: Three Families' },
      chunks: [
        {
          ar: 'فرّق بين كلمتين: الهيكل structure شيء واقعي في النظام — الوحدات الحقيقية وتبعياتها، وعمليات التشغيل الفعلية. والمنظر view تمثيلٌ لذلك الهيكل مرسوم لجمهور. أكثر الالتباسات المعمارية سببها الخلط بين ثلاث عائلات من الهياكل: هياكل الوحدات module تقسم النظام إلى وحدات كود — وحدات وأصناف وطبقات — بعلاقات جزء-من ويعتمد-على وهو-نوع. هياكل المكوّن والموصل component-and-connector تقسمه إلى وحدات لها حضور وقت التشغيل — عمليات وخدمات وعملاء وخوادم — تصلها موصلات: استدعاءات وقنوات وطوابير رسائل. وهياكل التوزيع allocation تخيط البرمجيات على بيئتها: عقد عتادية، وفرق تملك، وملفات مستودع. الفخ: الصندوق الواحد في منظر قد يكون عدة أشياء في آخر — وحدة messaging واحدة قد تكون ثلاث عمليات على جهازين. اجبر كل ذلك في مخطط واحد فتحصل على صورة خاطئة من كل زاوية. ارسم هيكلًا واحدًا لكل منظر، وسمِّ المنظر، وقل لمن هو.',
          en: 'Keep two words apart: a structure is real — the actual modules and their dependencies, the actual runtime processes. A view is that structure drawn for an audience. Most architectural confusion is a failure to keep three structure families apart. Module structures divide the system into units of code — modules, classes, layers — with is-part-of, depends-on, and is-a relations. Component-and-connector structures divide it into units with runtime presence — processes, services, clients, servers — joined by connectors: calls, channels, message queues. Allocation structures map software onto its environment: onto nodes, onto owning teams, onto repository files. The trap: one box may be several things in another view — a single messaging module can be three processes at runtime on two machines. Force all that into one diagram and the picture is wrong from every angle. Draw one structure per view, name it, say who it is for.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'اكتبها حتى يجول فيها المستجدون',
        en: 'Write It Down So Newcomers Can Navigate',
      },
      chunks: [
        {
          ar: 'في فريق، القرار المعماري بلا قيمة إن عاش في رأس صاحبه وحده. اكتبه — لا كتابًا، بل صفحات حية قليلة بجوار الشيفرة. مخطط مجدٍ: السياق والأهداف أولًا، وبخاصة متطلبات الجودة التي تقود كل ما بعدها؛ ثم القيود والقرارات المهمة، لكل قرار سبب من سطر واحد — تدوين لماذا هو ما يتيح لمهندس المستقبل أن يراجع ماذا بأمان؛ ثم قسم لكل منظر اخترته؛ ثم السيناريوهات المفتاحية تجول عبر المناظر؛ وأخيرًا المخاطر والأسئلة المفتوحة، فوثيقة تعترف بشكوكها أنفع من واحدة تتظاهر باليقين. وداخل منظر التطوير: طبقات تسمح للعليا بالاعتماد على الدنيا لا العكس؛ ونموذج المجال domain لا يعتمد على شيء تحته؛ والواجهة ملك للطبقة التي تحتاجها بينما تتحقق التنفيذات منها من الأسفل — انعكاس تبعية ملموس يجعل تبديل تفصيل متقلب مسًّا لوحدة واحدة.',
          en: 'On a team, an architecture decision is worthless if it lives only in the head of the person who made it. Write it down — a few living pages next to the code, not a book. A serviceable outline: context and goals first, especially the quality requirements that drive everything after; then constraints and the significant decisions, each with a one-line rationale — recording why lets a future engineer revisit the what; then one section per view you chose; then key scenarios walked through the views; finally risks and open questions — a document that admits its doubts beats one pretending to certainty. Inside the development view: higher layers may depend on lower ones, never the reverse; the domain model depends on nothing below it; an interface belongs to the layer that needs it while implementations conform from below — so swapping a volatile detail touches one module.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نظام واحد، ثلاثة جداول، ثلاثة أسئلة', en: 'One system, three tables, three questions' },
      code: `MODULES = {                      # development view: what may depend on what
    "ui": ["router", "domain"],
    "router": ["domain", "transport"],
    "domain": [],                # design rule: the domain depends on nothing
    "storage": ["domain"],
    "transport": [],
}
TALKS = {                        # process view: who talks to whom at runtime
    "web_ui": ["gateway"],
    "gateway": ["router", "store"],
    "router": ["store"],
    "store": [],
}
NODES = {                        # deployment view: what runs where
    "client": ["web_ui"],
    "server": ["gateway", "router"],
    "backup": ["store"],
}

def runs_on(node):
    return " ".join(sorted(NODES[node]))

def who_talks_to(comp):
    return " ".join(sorted(s for s, d in TALKS.items() if comp in d))

print("views: module process deployment")
print("backup runs:", runs_on("backup"))
print("talks to store:", who_talks_to("store"))
print("domain deps:", " ".join(MODULES["domain"]) or "none")`,
      explanation: {
        ar: 'ثلاثة جداول صغيرة وثلاثة أسئلة مختلفة: NODES يجيب مهندس العمليات (ماذا يعمل أين؟)، وTALKS يجيب من يسأل عن التفاعل وقت التشغيل، وMODULES يجيب المبرمج الجديد عن التبعيات. ولاحظ القاعدة المكتوبة في الجدول نفسه: domain لا يعتمد على شيء — قرار معماري مرئي في سطر فارغ.',
        en: 'Three small tables, three different questions: NODES answers the operations engineer (what runs where), TALKS answers whoever asks about runtime interaction, MODULES answers the new programmer about dependencies. Notice the rule written into the table itself: domain depends on nothing — an architectural decision visible in one empty line.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.view-queries',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أمامك النظام نفسه في ثلاثة جداول. أكمل الدالتين components_on وtalks_to ثم نفّذ السطور الثلاثة الأخيرة كما هي دون تغيير.',
        en: 'Here is the same system in three tables. Complete components_on and talks_to, then run the last three lines unchanged.',
      },
      starterCode: `MODULES = {
    "ui": ["router", "domain"],
    "router": ["domain", "transport"],
    "domain": [],
    "storage": ["domain"],
    "transport": [],
}
TALKS = {
    "web_ui": ["gateway"],
    "gateway": ["router", "store"],
    "router": ["store"],
    "store": [],
}
NODES = {
    "client": ["web_ui"],
    "server": ["gateway", "router"],
    "backup": ["store"],
}

def components_on(node):
    ...  # deployment view: the sorted list of components placed on node

def talks_to(comp):
    ...  # process view: sorted sources whose list contains comp

print("server runs:", " ".join(components_on("server")))
print("talks to store:", " ".join(talks_to("store")))
print("router deps:", " ".join(MODULES["router"]))`,
      solution: `MODULES = {
    "ui": ["router", "domain"],
    "router": ["domain", "transport"],
    "domain": [],
    "storage": ["domain"],
    "transport": [],
}
TALKS = {
    "web_ui": ["gateway"],
    "gateway": ["router", "store"],
    "router": ["store"],
    "store": [],
}
NODES = {
    "client": ["web_ui"],
    "server": ["gateway", "router"],
    "backup": ["store"],
}

def components_on(node):
    return sorted(NODES[node])

def talks_to(comp):
    return sorted(src for src, dsts in TALKS.items() if comp in dsts)

print("server runs:", " ".join(components_on("server")))
print("talks to store:", " ".join(talks_to("store")))
print("router deps:", " ".join(MODULES["router"]))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'سطر النشر صحيح', en: 'deployment line is right' },
          code: `assert 'server runs: gateway router' in __learner_output__, 'expected: server runs: gateway router | actual: %r' % __learner_output__`,
        },
        {
          id: 't2',
          name: { ar: 'سطر التشغيل صحيح', en: 'runtime line is right' },
          code: `assert 'talks to store: gateway router' in __learner_output__, 'expected: talks to store: gateway router | actual: %r' % __learner_output__`,
        },
        {
          id: 't3',
          name: { ar: 'استعلام عقدة أخرى', en: 'another node query' },
          code: `assert components_on("backup") == ["store"], 'expected: ["store"] | actual: %r' % components_on("backup")`,
        },
      ],
      hints: [
        { ar: 'components_on تعمل على منظر النشر وحده: أعد قائمة NODES[node] مرتبة أبجديًا.', en: 'components_on only touches the deployment view: return NODES[node] sorted alphabetically.' },
        { ar: 'talks_to تبحث في منظر التشغيل: اجمع كل src قائمته تحوي comp ثم رتّبها.', en: 'talks_to searches the process view: collect every src whose list contains comp, then sort.' },
        { ar: 'الصياغة: return sorted(src for src, dsts in TALKS.items() if comp in dsts).', en: 'The shape: return sorted(src for src, dsts in TALKS.items() if comp in dsts).' },
        { ar: 'الناتج المطلوب: server runs: gateway router ثم talks to store: gateway router ثم router deps: domain transport.', en: 'Required output: server runs: gateway router, then talks to store: gateway router, then router deps: domain transport.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.which-view',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'تعطّل مخزن المرفقات فجأة. أي منظر يجيب عن سؤال: "هل تبقى رسائل النص تتدفق؟"',
        en: 'The attachment store suddenly goes down. Which view answers: "do text messages keep flowing?"',
      },
      options: [
        { id: 'a', text: { ar: 'منظر النشر deployment — يخبرنا أين يسكن المخزن', en: 'deployment view — tells us where the store lives' } },
        { id: 'b', text: { ar: 'منظر العملية process — يعرض التفاعل وقت التشغيل والموصل غير المتزامن نحو المخزن', en: 'process view — shows runtime interaction, including the asynchronous connector toward the store' } },
        { id: 'c', text: { ar: 'منظر التطوير development — يعرض تبعيات الوحدات وقت البناء', en: 'development view — shows build-time module dependencies' } },
        { id: 'd', text: { ar: 'مخطط الأصناف — يعرض خصائص المخزن وعملياته', en: 'the class diagram — shows the store\'s attributes and operations' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'السؤال عن سلوك وقت التشغيل: من يتبادل الرسائل مع من، ومن لا يحجب من.', en: 'The question is about runtime behavior: who exchanges messages with whom, and who does not block.' },
        { ar: 'منظر النشر يجيب عن "أين" لا عن "ماذا يحدث حين يتعطل شيء".', en: 'The deployment view answers "where", not "what happens when something dies".' },
        { ar: 'تبعيات البناء وخصائص الأصناف لا تحمل المعلومة المطلوبة أيضًا.', en: 'Build-time dependencies and class attributes do not carry this information either.' },
        { ar: 'الإجابة: منظر العملية process — نفس منظر المكوّن والموصل.', en: 'The answer: the process view — the component-and-connector view.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-inversion',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'MessageRouter لا يعرف شيئًا عن أي ناقل بعينه: يتعامل مع من يوفر deliver، والتنفيذات تتحقق منه من الأسفل. تتبّع المخرج الحرفي.',
        en: 'MessageRouter knows nothing about any particular transport: it deals with whatever provides deliver, and implementations conform from below. Trace the exact output.',
      },
      code: `class MessageRouter:
    def __init__(self, transport):
        self._transport = transport
    def route(self, msg):
        self._transport.deliver(msg["to"], msg["body"])

class FakeTransport(list):
    def deliver(self, to, body):
        self.append(to)

sent = FakeTransport()
MessageRouter(sent).route({"to": "noor", "body": "hi"})
MessageRouter(sent).route({"to": "sami", "body": "yo"})
print("delivered:", len(sent))
print("first:", sent[0])`,
      answer: 'delivered: 2\nfirst: noor',
      solution: 'delivered: 2\nfirst: noor',
      hints: [
        { ar: 'كل route يمرر body إلى deliver، لكن deliver في FakeTransport تضيف إلى القائمة وتتجاهل body.', en: 'Each route passes body to deliver, but FakeTransport.deliver appends only to and ignores body.' },
        { ar: 'استدعاءان، فطول القائمة 2.', en: 'Two calls, so the list length is 2.' },
        { ar: 'FakeTransport ترث من list، فsent[0] هو أول عنصر أُلحق.', en: 'FakeTransport subclasses list, so sent[0] is the first appended element.' },
        { ar: 'السطران: delivered: 2 ثم first: noor.', en: 'The two lines: delivered: 2 then first: noor.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-scenarios',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: في نموذج 4+1، حالات الاستخدام القليلة التي تجول عبر المناظر الأربعة وتلحمها معًا تسمى ______ (كلمة إنجليزية واحدة).',
        en: 'Complete the term: in the 4+1 model, the few use cases threaded through all four views, gluing them together, are called ______ (one English word).',
      },
      answer: 'scenarios',
      solution: 'scenarios',
      hints: [
        { ar: 'هي الـ +1 في 4+1: الغراء الذي يفحص اتساق المناظر.', en: 'They are the +1 in 4+1: the glue that checks the views agree.' },
        { ar: 'بمفردات الفصل 5 هي حالات استخدام كاملة: فاعل وتدفق.', en: 'In ch5 vocabulary they are full use cases: an actor and a flow.' },
        { ar: 'وليست مخططات ولا قياسات — قصص يسير القارئ فيها عبر المناظر.', en: 'Not diagrams, not measures — stories a reader walks through the views.' },
        { ar: 'الكلمة المطلوبة: scenarios.', en: 'The word: scenarios.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `MODULES = {
    "ui": ["router", "domain"],
    "router": ["domain", "transport"],
    "domain": [],
    "storage": ["domain"],
    "transport": [],
}
NODES = {
    "client": ["web_ui"],
    "server": ["gateway", "router"],
    "backup": ["store"],
}

def components_on(node):
    return sorted(NODES[node])

print("server runs:", " ".join(components_on("server")))

# Your turn: ops wants the attachment store on its own machine.
# 1. Move "store" to a new "storage" node in NODES and re-print with
#    components_on. Which view did you just edit?
# 2. Now answer a runtime question instead: who talks to "store"?
#    Write talks_to() over TALKS below and print it. Different view,
#    different table, same system.
TALKS = {
    "web_ui": ["gateway"],
    "gateway": ["router", "store"],
    "router": ["store"],
    "store": [],
}`,
      prompt: {
        ar: 'انقل store إلى عقدة خاصة ثم أجب عن سؤال التشغيل "من يتحدث إلى store؟" من جدول آخر. لاحظ: كل سؤال عدّل منظرًا واحدًا فقط.',
        en: 'Move store to its own node, then answer the runtime question "who talks to store?" from a different table. Notice: each question edits exactly one view.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'الـ +1 في نموذج 4+1: السيناريوهات المفتاحية تُستعار مباشرة من أدوات أي فصل سابق؟',
            en: 'The +1 of the 4+1 model: which earlier chapter\'s tool do the key scenarios come straight from?',
          },
          options: [
            { id: 'a', text: { ar: 'قصص المستخدم المقدَّرة بالنقاط من الفصل 4', en: 'User stories estimated in points from ch4' } },
            { id: 'b', text: { ar: 'حالات الاستخدام المكتوبة في الفصل 5: فاعل وتدفق رئيسي وتدفقات بديلة', en: 'Use cases written in ch5: actor, main flow, alternative flows' } },
            { id: 'c', text: { ar: 'اجتماعات سكرم اليومية من الفصل 2', en: 'Daily scrum meetings from ch2' } },
            { id: 'd', text: { ar: 'مثلث القيود من الفصل 1', en: 'The iron triangle from ch1' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'السيناريوهات حالات استخدام من الفصل 5: فاعل يسير في تدفق مألوف عبر المناظر الأربعة، فيفحص القارئ اتساقها ويكتشف كل منظر بدوره.',
            en: 'Scenarios are ch5 use cases: an actor walks a familiar flow through all four views, checking consistency and letting each view play its part.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'سؤال "أي خادم يشغّل ماذا؟" — أي منظر يجيب؟',
            en: 'The question "which server runs what?" — which view answers it?',
          },
          options: [
            { id: 'a', text: { ar: 'المنطقي logical', en: 'the logical view' } },
            { id: 'b', text: { ar: 'العملية process', en: 'the process view' } },
            { id: 'c', text: { ar: 'النشر deployment (الفيزيائي)', en: 'the deployment (physical) view' } },
            { id: 'd', text: { ar: 'التطوير development', en: 'the development view' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'منظر النشر يخيط البرمجيات على العقد: أي مكوّن يعمل على أي خادم وكيف تتصل العقد — سؤال مهندس العمليات بالضبط.',
            en: 'The deployment view maps software onto nodes: which component runs on which server and how nodes network — exactly the operations engineer\'s question.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'سؤال "ما المفاهيم الأساسية وما الذي تستطيع فعله؟" — أي منظر يجيب؟',
            en: 'The question "what are the key concepts and what can they do?" — which view answers it?',
          },
          options: [
            { id: 'a', text: { ar: 'المنطقي logical — الأصناف والعلاقات، وهنا تسكن مخططات الأصناف', en: 'the logical view — classes and relations, home of the class diagram' } },
            { id: 'b', text: { ar: 'العملية process — العمليات والخيوط', en: 'the process view — processes and threads' } },
            { id: 'c', text: { ar: 'النشر deployment — العقد والشبكة', en: 'the deployment view — nodes and networking' } },
            { id: 'd', text: { ar: 'التطوير development — الحزم والبناء', en: 'the development view — packages and building' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المنظر المنطقي يعرض التجريدات التي يراها المستخدم النهائي: الأصناف ومسؤولياتها وعلاقاتها — عمل الدرس السابق يظهر هنا كمنظر واحد من أربعة.',
            en: 'The logical view shows the end-user-facing abstractions: classes, responsibilities, relationships — the previous lesson\'s work appears here as one view of four.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أول قسم في وثيقة وصف المعمارية — والذي يوجد كل ما بعده لإرضائه:',
            en: 'The first section of an architecture description — everything after it exists to satisfy it:',
          },
          options: [
            { id: 'a', text: { ar: 'قسم المناظر', en: 'the views section' } },
            { id: 'b', text: { ar: 'السياق والأهداف مع متطلبات الجودة', en: 'context and goals with the quality requirements' } },
            { id: 'c', text: { ar: 'المخاطر والأسئلة المفتوحة', en: 'risks and open questions' } },
            { id: 'd', text: { ar: 'السيناريوهات المفتاحية', en: 'key scenarios' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'متطلبات الجودة — الحمل المستهدف، التوافر، الأمان، التغييرات المتوقعة — هي ما يقود شكل المعمارية؛ والقيم الثلاثة التالية تُشتق منها لا العكس.',
            en: 'Quality requirements — target load, availability, security, expected changes — drive the architecture\'s shape; the remaining sections derive from them, not the reverse.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'رسمت مخططًا واحدًا ضخمًا يظهر فيه كل شيء: الوحدات والعمليات والخوادم.',
          right: 'ارسم هيكلًا واحدًا لكل منظر، وسمِّ المنظر وقل لمن هو؛ الصورة التي تعرض كل شيء تكون خاطئة من كل زاوية.',
          note: {
            ar: 'فصل المناظر هو حجة التعقيد نفسها التي بررت التجزيء — مطبقة على التوثيق.',
            en: 'Separating views is the same complexity argument that justified modularity — applied to documentation.',
          },
        },
        {
          wrong: 'مخطط الأصناف كامل ومعتمد، إذن المعمارية موثقة.',
          right: 'مخطط الأصناف هو المنظر المنطقي وحده؛ مهندس العمليات والمبرمج الجديد يحتاجان منظري النشر والتطوير أيضًا.',
          note: {
            ar: 'اختبر الوثيقة بسؤال حقيقي: هل يستطيع مهندس عمليات أن يجيب عن سؤاله منها؟',
            en: 'Test the document with a real question: can an operations engineer answer theirs from it?',
          },
        },
        {
          wrong: 'وثيقة معمارية من مئة صفحة تُكتب مرة عند بدء المشروع ثم تُقفل.',
          right: 'اجعلها صفحات حية قليلة بجوار الشيفرة تتحدث مع القرارات، وقسم المخاطر فيها يبقى صادقًا مع كل قرار جديد.',
          note: {
            ar: 'وثيقة تعترف بشكوكها أنفع من واحدة تتظاهر باليقين.',
            en: 'A document that admits its doubts is more useful than one pretending certainty.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'لا يكفي مخطط واحد: المنطقي للمفاهيم، والعملية للتشغيل، والتطوير للتبعيات، والنشر لماذا يعمل أين — والسيناريوهات تلحمها.',
          en: 'No single diagram suffices: logical for concepts, process for runtime, development for dependencies, deployment for what runs where — scenarios glue them.',
        },
        {
          ar: 'الهيكل واقع والمنظر تمثيل له لجمهور؛ ثلاث عائلات: وحدات، ومكوّن-وموصل، وتوزيع.',
          en: 'A structure is real; a view represents it for an audience; three families: module, component-and-connector, allocation.',
        },
        {
          ar: 'وثيقة المعمارية صفحات حية قليلة: سياق وأهداف، قيود وقرارات بتبريرات، مناظر، سيناريوهات، مخاطر.',
          en: 'The architecture description is a few living pages: context and goals, constraints and decisions with rationale, views, scenarios, risks.',
        },
        {
          ar: 'قاعدة الطبقات: domain لا يعتمد على شيء تحته، والواجهة ملك للطبقة التي تحتاجها والتنفيذ يتحقق منها من الأسفل.',
          en: 'The layering rule: domain depends on nothing below; the interface belongs to the layer that needs it, implementations conform from below.',
        },
      ],
      reflectPrompt: {
        ar: 'خذ آخر نظام عملت عليه: أي سؤال من أسئلة أصحاب المصلحة عجز عنه مخططك الوحيد، وأي منظر كان سيجيب عنه؟',
        en: 'Take your last system: which stakeholder question defeated your single diagram, and which view would have answered it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch6.s4', pages: 'ص156-158 / pp.156-158' },
        { book: 'SWE', section: 'swe.ch6.s5', pages: 'ص158-162 / pp.158-162' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch6.s4', pages: 'ص156-158 / pp.156-158' },
    { book: 'SWE', section: 'swe.ch6.s5', pages: 'ص158-162 / pp.158-162' },
  ],
} satisfies Lesson;

export default lesson;
