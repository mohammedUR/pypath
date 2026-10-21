/**
 * Lesson swe.ch6.l4 — مراجعة الفصل 6 ومشروع: محلل التبعيات
 *   / Chapter 6 Review and Project: The Dependency Analyzer
 * Book: SWE — Chapter 6 'Design and Architecture'
 *   §6.6 Conclusion (pp.162-163) + chapter recap
 * Runnable design: a dependency analyzer over a fixed module->imports dict —
 *   fan-in/fan-out per module, fan-out > LIMIT flagged as design-smell
 *   candidates, a first-cycle DFS — printing exact ASCII summary lines.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch6.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 6,
  title: {
    ar: 'مراجعة الفصل 6 ومشروع: محلل التبعيات',
    en: 'Chapter 6 Review and Project: The Dependency Analyzer',
  },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch6.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'المراجعة قبل التسليم: هذا الفصل أشركتَ فيه التماسك والاقتران والإخفاء المعلوماتي ومخططات الأصناف والمناظر. لكن بصراحة — من يفحص بعد شهرين أن الشيفرة ما زالت تلتزم بكل ذلك؟ لا أحد؛ الشيفرة تتحرك أسرع من الذاكرة. لذلك يختم الفصل بفكرة عملية: اجعل العدّ آليًا. في هذا الدرس تبني محلل تبعيات صغيرًا يقرأ جدول استيرادات ثابتًا ويطبع الأرقام والحلقة — الأسئلة نفسها التي طرحتها على تصميمك، تُجاب في كل مرة يعمل فيها.',
        en: 'Pre-delivery review: this chapter armed you with cohesion, coupling, information hiding, class diagrams, and views. But honestly — who checks, two months later, that the code still obeys all of that? Nobody; the code moves faster than memory. So the chapter closes with a practical idea: make the counting automatic. In this lesson you build a small dependency analyzer over a fixed import table that prints the numbers and the cycle — the same questions you asked of your design, answered every time it runs.',
      },
    },
    {
      kind: 'predict',
      code: `GRAPH = {
    "auth": ["notify"],
    "notify": ["auth"],
}
print("auth imports notify:", "notify" in GRAPH["auth"])
print("notify imports auth:", "auth" in GRAPH["notify"])`,
      question: {
        ar: 'قبل التنفيذ: وحدتان تستورد كل منهما الأخرى. هل هاتان وحدتان مستقلتان يمكن بناؤهما واختبارهما منفردتين؟',
        en: 'Before running: two modules, each importing the other. Are these two independent modules, each buildable and testable alone?',
      },
      reveal: {
        ar: 'لا: كما في إرشادات التجزيء، إن كانت auth تعتمد على notify وnotify على auth فهما وحدة واحدة سرت عبرها خط — لا بناء ولا اختبار منفرد. المحلل الذي ستبنيه في هذا الدرس يكشف هذا الشكل آليًا، والعلاج المعروف: واجهة يملكها أحد الطرفين.',
        en: 'No: per the decomposition guidelines, if auth depends on notify and notify on auth, they are one module with a line drawn through it — neither buildable nor testable alone. The analyzer you build this lesson detects exactly this shape automatically, and the known cure: an interface one side owns.',
      },
    },
    {
      kind: 'concept',
      heading: {
        ar: 'الفصل في سطر واحد: تماسك واقتران وواجهات',
        en: 'The Chapter in One Line: Cohesion, Coupling, Interfaces',
      },
      chunks: [
        {
          ar: 'لخّص المسار. المعمارية هي ما تحصل عليه حين تتخذ القرارات المكلفة عن قصد: تقسيم إلى وحدات عالية التماسك وأقل ترابطًا، كلٌّ يخفي قرارًا خلف واجهة صغيرة صريحة. الاقتران والتماسك مفردات التشخيص؛ والإخفاء المعلوماتي يحدد كيف تختار الحدود؛ ومخططات الأصناف بتعدديتها تسجل البنية الساكنة. وللإرشادات أسماء مشهورة: مسؤولية واحدة، وانفتاح للامتداد وإغلاق للتعديل، وإحلال ليسكوف، وعزل الواجهات، وانعكاس التبعية — SOLID — يوازيها DRY: لكل معرفة تمثيل واحد مرجعي. اكسر حلقات الاستيراد بإدخال واجهة يملكها أحد الطرفين، وأنفق ميزانية التجزيء على التغييرات التي تتوقعها فعلًا؛ فالمرونة التي لا يحتاجها أحد تعقيد عرضي بحد ذاتها.',
          en: 'Recap the arc. Architecture is what you get when you make the expensive decisions on purpose: decompose into modules with high cohesion and low coupling, each hiding a decision behind a small explicit interface. Coupling and cohesion are the diagnostic vocabulary; information hiding says how to choose the boundaries; class diagrams with multiplicities record the static structure. The guidelines carry memorable names: single responsibility, open-closed, Liskov substitution, interface segregation, dependency inversion — SOLID — plus DRY: every piece of knowledge has one authoritative representation. Break import cycles by introducing an interface one side owns, and spend the modularity budget on the changes you actually expect, because flexibility nobody needs is its own accidental complexity.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المناظر والوثيقة وفكرتا الخلاصة', en: 'Views, the Document, and Two Closing Ideas' },
      chunks: [
        {
          ar: 'ثم جانب الوصف. لا يكفي مخطط واحد: مناظر 4+1 — منطقي وعملية وتطوير ونشر يلحمها السيناريوهات — تفصل اهتمامات القراء، وتمييز الهيكل عن المنظر يبقي كل صورة أمينة. وصفحات حية قليلة تجعل القرارات باقية: سياق وأهداف، قيود وتبريرات، المناظر، سيناريوهات مفتاحية، مخاطر. واحمل معك فكرتي الخلاصة: أولًا المعمارية تخدم متطلبات الجودة — تختار بنية لتشتري الأداء أو التوافر أو الأمان أو فوق الكل التغيير الرخيص، وتدفع بوعي في الجودات التي لم تخترها؛ وثانيًا المعمارية حقيقية بقدر التزام الشيفرة بها — حدّ لا يفرضه البناء ولا تدافع عنه المراجعات سيتآكل. والفصل 7 يضيف الخطوة التالية: نادرًا ما تخترع هذه البنى من العدم؛ فالأنماط تختزل الخبرة المكتسبة فتعيد استخدام الحكم لا المخطط وحده.',
          en: 'Then the description side. No single diagram suffices: the 4+1 views — logical, process, development, deployment, glued by scenarios — separate concerns among readers, and the structure-versus-view discipline keeps each picture honest. A few living pages make the decisions durable: context and goals, constraints and rationale, the views, key scenarios, risks. Carry away the conclusion\'s two ideas. First, architecture serves quality requirements: you choose a structure to buy performance, availability, security, or above all cheap change, paying consciously in the qualities you did not choose. Second, architecture is only real to the extent that the code obeys it — a boundary the build does not enforce and reviews do not defend will erode. Chapter 7 adds the next step: you rarely invent these structures from nothing; patterns package hard-won judgment so you reuse it.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: {
        ar: 'لغة المحلل: fan-in وfan-out والحلقات',
        en: 'The Analyzer\'s Language: Fan-in, Fan-out, Cycles',
      },
      chunks: [
        {
          ar: 'مفردات المشروع. fan-out يعدّ الاستيرادات المباشرة للوحدة — كم تفصيلًا عليها أن تعرف. وfan-in يعدّ الوحدات التي تستوردها — كم عميلًا سينكسر إن تغيرت واجهتها. fan-out المرتفع مرشح تصميم كريه: الوحدة تتنسيق أكثر من اللازم. وfan-in المرتفع وسام لوحدة مستقرة، أو إنذار أن الجميع يعتمد على هدف متحرك. أما الحلقة — A تستورد B تستورد A، مباشرة أو عبر وسطاء — فأسوأ الحال: الوحدتان وحدة واحدة سرت عبرها خط، لا تُبنى ولا تُختبر منفردتين. الإشارات الثلاث كلها من قاموس واحد ثابت: وحدة إلى قائمة استيرادات — وهو بالضبط ما سيمشي عليه محللك.',
          en: 'The project\'s vocabulary. Fan-out counts a module\'s direct imports — how many details it must know. Fan-in counts how many modules import it — how many clients break if its interface changes. High fan-out is a design-smell candidate: the module coordinates too much. High fan-in can be a badge of honor for a stable core, or a warning that everyone depends on a moving target. A cycle — A imports B imports A, directly or through intermediaries — is worse than either: the two are one module with a line drawn through them, unbuildable and untestable alone. All three signals come from one fixed dict of module to import list — exactly the structure your analyzer will walk.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'تدقيق صغير: من يستورد من؟', en: 'A small audit: who imports whom?' },
      code: `G = {"api": ["core", "cli"], "core": ["util"], "cli": ["core", "util"], "util": []}
LIMIT = 2

def fan_out(mod):
    return len(G[mod])

def fan_in(mod):
    return sum(1 for deps in G.values() if mod in deps)

for m in sorted(G):
    tag = "  <-- smell candidate" if fan_out(m) > LIMIT else ""
    print(f"{m} fan-in {fan_in(m)} fan-out {fan_out(m)}{tag}")

two_way = "cli" in G["api"] or "api" in G["cli"]
print("direct two-way import:", two_way)`,
      explanation: {
        ar: 'fan-out يحكي ما تعرفه الوحدة من تفاصيل، وfan-in يحكي من يعتمد عليها. core وutil تقرآن صحيًا: كل منهما يعمل عمله ويتنسيق قليلًا. ولاحظ أن فحص "الاتجاهين مباشرة" يكشف الحلقات المباشرة فقط — ماذا لو استوردت util الوحدة api؟ لن يكشفه هذا السطر، ولهذا يحتاج المشروع تجوالًا حقيقيًا في العمق.',
        en: 'Fan-out tells you how much a module knows; fan-in tells you who leans on it. core and util read healthy: each does its own job and coordinates little. Note the "direct two-way" check catches only direct cycles — what if util imported api? This line would miss it, which is why the project needs a real depth-first walk.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.dep-analyzer',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'مشروع الفصل: محلل التبعيات. أكمل fan_out وfan_in وfind_cycle في الهيكل المعطى، ثم نفّذ كتلة الطباعة كما هي دون تغيير. الحلقة تُطبع سلسلة تنتهي حيث بدأت: auth -> notify -> auth.',
        en: 'The chapter project: the dependency analyzer. Complete fan_out, fan_in, and find_cycle in the given skeleton, then run the print block unchanged. The cycle prints as a chain ending where it started: auth -> notify -> auth.',
      },
      starterCode: `GRAPH = {
    "app":     ["router", "auth", "notify", "logging"],
    "router":  ["auth", "models"],
    "auth":    ["notify", "models"],
    "notify":  ["auth"],
    "models":  [],
    "logging": [],
}
LIMIT = 3

def fan_out(graph, mod):
    ...  # number of direct imports of mod

def fan_in(graph, mod):
    ...  # how many modules import mod directly

def find_cycle(graph):
    ...  # first import cycle as a list, e.g. ["auth", "notify", "auth"];
    ...  # return None if the graph is cycle-free

edges = sum(len(deps) for deps in GRAPH.values())
print("modules: %d edges: %d" % (len(GRAPH), edges))
print("fan-in auth: %d fan-out app: %d" % (fan_in(GRAPH, "auth"), fan_out(GRAPH, "app")))
for mod in GRAPH:
    if fan_out(GRAPH, mod) > LIMIT:
        print("smell: %s fan-out %d" % (mod, fan_out(GRAPH, mod)))
cycle = find_cycle(GRAPH)
if cycle:
    print("cycle:", " -> ".join(cycle))
else:
    print("cycle: none")`,
      solution: `GRAPH = {
    "app":     ["router", "auth", "notify", "logging"],
    "router":  ["auth", "models"],
    "auth":    ["notify", "models"],
    "notify":  ["auth"],
    "models":  [],
    "logging": [],
}
LIMIT = 3

def fan_out(graph, mod):
    return len(graph[mod])

def fan_in(graph, mod):
    return sum(1 for deps in graph.values() if mod in deps)

def find_cycle(graph):
    color = {m: 0 for m in graph}   # 0 white, 1 gray, 2 black
    path = []

    def walk(node):
        color[node] = 1
        path.append(node)
        for nxt in graph[node]:
            if color[nxt] == 1:
                return path[path.index(nxt):] + [nxt]
            if color[nxt] == 0:
                found = walk(nxt)
                if found:
                    return found
        path.pop()
        color[node] = 2
        return None

    for m in graph:
        if color[m] == 0:
            found = walk(m)
            if found:
                return found
    return None

edges = sum(len(deps) for deps in GRAPH.values())
print("modules: %d edges: %d" % (len(GRAPH), edges))
print("fan-in auth: %d fan-out app: %d" % (fan_in(GRAPH, "auth"), fan_out(GRAPH, "app")))
for mod in GRAPH:
    if fan_out(GRAPH, mod) > LIMIT:
        print("smell: %s fan-out %d" % (mod, fan_out(GRAPH, mod)))
cycle = find_cycle(GRAPH)
if cycle:
    print("cycle:", " -> ".join(cycle))
else:
    print("cycle: none")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'سطر الحصيلة صحيح', en: 'summary line is right' },
          code: `assert 'modules: 6 edges: 9' in __learner_output__, 'expected: modules: 6 edges: 9 | actual: %r' % __learner_output__`,
        },
        {
          id: 't2',
          name: { ar: 'رائحة التصميم تُرصد', en: 'design smell is flagged' },
          code: `assert 'smell: app fan-out 4' in __learner_output__, 'expected: smell: app fan-out 4 | actual: %r' % __learner_output__`,
        },
        {
          id: 't3',
          name: { ar: 'الأرقام والحلقة صحيحة', en: 'numbers and cycle are right' },
          code: `assert fan_in(GRAPH, "auth") == 3 and find_cycle(GRAPH) == ["auth", "notify", "auth"], 'expected: fan-in 3 and cycle auth->notify->auth | actual: %r, %r' % (fan_in(GRAPH, "auth"), find_cycle(GRAPH))`,
        },
      ],
      hints: [
        { ar: 'fan_out طول قائمة الاستيرادات مباشرة؛ وfan_in عدد الوحدات التي تحوي الوحدة في قوائمها.', en: 'fan_out is just the length of the import list; fan_in is how many modules list it.' },
        { ar: 'find_cycle يحتاج تجوالًا في العمق: لوّن العقدة رماديًا وهي قيد الزيارة وأسود بعد الانتهاء؛ مصادفة رمادي تعني حلقة.', en: 'find_cycle needs a depth-first walk: color a node gray while visiting and black when done; meeting gray means a cycle.' },
        { ar: 'في walk: عند مصادفة nxt رماديًّا أعد path[path.index(nxt):] + [nxt].', en: 'In walk: when nxt is gray, return path[path.index(nxt):] + [nxt].' },
        { ar: 'ابدأ walk من كل عقدة بيضاء، وأعد None إذا انتهى التجوال بلا حلقة. الناتج المطلوب ينتهي بـ cycle: auth -> notify -> auth.', en: 'Start walk from every white node and return None if the walk finishes clean. The required output ends with cycle: auth -> notify -> auth.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-fan-table',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'جدول أعداد لرسم بياني أصغر. اكتب المخرج الحرفي — لاحظ الترتيب الأبجدي ومعنى العمودين.',
        en: 'A fan table for a smaller graph. Write the exact output — note the alphabetical order and what the two columns mean.',
      },
      code: `G = {"a": ["b", "c"], "b": ["c"], "c": [], "d": ["c"]}
print("edges:", sum(len(v) for v in G.values()))
for m in sorted(G):
    fan_in = sum(1 for deps in G.values() if m in deps)
    print(m, fan_in, len(G[m]))`,
      answer: 'edges: 4\na 0 2\nb 1 1\nc 3 0\nd 0 1',
      solution: 'edges: 4\na 0 2\nb 1 1\nc 3 0\nd 0 1',
      hints: [
        { ar: 'edges مجموع أطوال القوائم: 2 + 1 + 0 + 1.', en: 'edges is the sum of list lengths: 2 + 1 + 0 + 1.' },
        { ar: 'sorted(G) يعطي a ثم b ثم c ثم d.', en: 'sorted(G) yields a, then b, then c, then d.' },
        { ar: 'fan-in لكل وحدة: كم قائمة تحويها. c تحويها ثلاث قوائم.', en: 'fan-in per module: how many lists contain it. Three lists contain c.' },
        { ar: 'العمود الثاني fan-in والثالث fan-out، مفصولان بفراغ واحد: a 0 2 وهكذا.', en: 'Second column is fan-in, third is fan-out, single-spaced: a 0 2 and so on.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-real-arch',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'حدود المعمارية مرسومة على الورق: لا فحص بناء يمنع domain من استيراد transport، ولا مراجعة تدافع عن الحد. بحسب خلاصة الفصل، ما حال هذه المعمارية؟',
        en: 'The architecture\'s boundary exists on paper only: no build check stops domain from importing transport, no review defends the line. Per the chapter\'s conclusion, what is this architecture?',
      },
      options: [
        { id: 'a', text: { ar: 'معمارية سليمة ما دامت المخططات معتمدة من الإدارة', en: 'A sound architecture as long as the diagrams are approved' } },
        { id: 'b', text: { ar: 'ستتآكل: المعمارية حقيقية فقط بقدر التزام الشيفرة بها', en: 'It will erode: architecture is only real to the extent the code obeys it' } },
        { id: 'c', text: { ar: 'تكفي موافقة المهندس المخضرم', en: 'The senior architect\'s sign-off is enough' } },
        { id: 'd', text: { ar: 'تكفي وثيقة محدثة هذا الشهر', en: 'A document updated this month is enough' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'خلاصة الفصل تقول إن الرسم الذي لا يُفرَض سيُتهم بالتآكل.', en: 'The conclusion says a drawn boundary nobody enforces will erode.' },
        { ar: 'من يفرض الحد؟ البناء (فحص ثابت يفشل عند الخرق) والمراجعات.', en: 'Who enforces? The build (a static check failing on violation) and the reviews.' },
        { ar: 'الاعتماد والتوقيع والوثيقة كلها شهادات على النية لا على الواقع.', en: 'Approval, sign-off, and a fresh document certify intent, not reality.' },
        { ar: 'الإجابة: b — التزام الشيفرة هو الاختبار الحقيقي.', en: 'The answer: b — the code obeying the boundary is the real test.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-fanin',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: عدد الوحدات التي تستورد الوحدة الواحدة مباشرة يسمى fan-______ (الجزء الثاني من المصطلح بالإنجليزية).',
        en: 'Complete the term: the number of modules importing one module directly is called fan-______ (the second half of the term, in English).',
      },
      answer: 'in',
      solution: 'in',
      hints: [
        { ar: 'هو عكس fan-out: الوارد لا الصادر.', en: 'It is the mirror of fan-out: incoming, not outgoing.' },
        { ar: 'في محللك: sum(1 for deps in graph.values() if mod in deps) يحسبه.', en: 'In your analyzer: sum(1 for deps in graph.values() if mod in deps) computes it.' },
        { ar: 'fan-in المرتفع يعني اعتمادًا واسعًا على هذه الوحدة.', en: 'High fan-in means broad reliance on this one module.' },
        { ar: 'الكلمة المطلوبة: in.', en: 'The word: in.' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-blind-import',
      required: true,
      brokenCode: `GRAPH = {
    "app":     ["router", "auth", "notify", "logging"],
    "router":  ["auth", "models"],
    "auth":    ["notify", "models"],
    "notify":  ["auth"],
    "models":  [],
    "logging": [],
}

def reaches(graph, src, dst):
    # BUG: one hop only - transitive imports are invisible
    return dst in graph[src]

def find_cycle(graph):
    # BUG: only direct self-imports register as a cycle
    for mod in graph:
        if mod in graph[mod]:
            return [mod, mod]
    return None

print("app reaches models:", reaches(GRAPH, "app", "models"))
cycle = find_cycle(GRAPH)
print("cycle:", " -> ".join(cycle) if cycle else "none")`,
      prompt: {
        ar: 'المحلل يطبع cycle: none رغم وجود حلقة auth -> notify -> auth، وينفي وصول app إلى models رغم أن الوصول متعدٍّ عبر router. السبب: الدالتان تنظران إلى الاستيراد المباشر فقط. أصلح reaches وfind_cycle حتى يبحثا في العمق عبر القوائم.',
        en: 'The analyzer prints cycle: none even though auth -> notify -> auth exists, and denies that app reaches models even though the path is transitive via router. Cause: both functions look at direct imports only. Fix reaches and find_cycle to search deep through the lists.',
      },
      solution: `GRAPH = {
    "app":     ["router", "auth", "notify", "logging"],
    "router":  ["auth", "models"],
    "auth":    ["notify", "models"],
    "notify":  ["auth"],
    "models":  [],
    "logging": [],
}

def reaches(graph, src, dst):
    seen = {src}
    stack = [src]
    while stack:
        node = stack.pop()
        if node == dst:
            return True
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                stack.append(nxt)
    return False

def find_cycle(graph):
    color = {m: 0 for m in graph}   # 0 white, 1 gray, 2 black
    path = []

    def walk(node):
        color[node] = 1
        path.append(node)
        for nxt in graph[node]:
            if color[nxt] == 1:
                return path[path.index(nxt):] + [nxt]
            if color[nxt] == 0:
                found = walk(nxt)
                if found:
                    return found
        path.pop()
        color[node] = 2
        return None

    for m in graph:
        if color[m] == 0:
            found = walk(m)
            if found:
                return found
    return None

print("app reaches models:", reaches(GRAPH, "app", "models"))
cycle = find_cycle(GRAPH)
print("cycle:", " -> ".join(cycle) if cycle else "none")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'الوصول المتعدد يُرصد', en: 'transitive reach is found' },
          code: `assert 'app reaches models: True' in __learner_output__, 'expected: app reaches models: True | actual: %r' % __learner_output__`,
        },
        {
          id: 't2',
          name: { ar: 'الحلقة تُكشف', en: 'the cycle is detected' },
          code: `assert 'cycle: auth -> notify -> auth' in __learner_output__, 'expected: cycle: auth -> notify -> auth | actual: %r' % __learner_output__`,
        },
      ],
      hints: [
        { ar: 'جرّب بنفسك: GRAPH["app"] لا تحوي models مباشرة، فيفشل فحص dst in graph[src] رغم وجود طريق عبر router.', en: 'Check by hand: GRAPH["app"] has no direct models, so dst in graph[src] fails even though a path exists via router.' },
        { ar: 'للوصول المتعدد: مجموعة seen ومكدس stack، توسّع من القائمة حتى تجد dst أو تنفد.', en: 'For transitive reach: a seen set and a stack; expand until you hit dst or run out.' },
        { ar: 'للحلقة: لوّن رماديًا أثناء الزيارة وأسود بعدها؛ التصادم مع رمادي يعني حلقة.', en: 'For the cycle: gray while visiting, black when done; meeting gray means a cycle.' },
        { ar: 'أعد path[path.index(nxt):] + [nxt] حين تصادف رماديًا — السلسلة تنتهي حيث بدأت.', en: 'Return path[path.index(nxt):] + [nxt] when you meet gray — the chain ends where it started.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `GRAPH = {
    "app":     ["router", "auth", "notify", "logging"],
    "router":  ["auth", "models"],
    "auth":    ["notify", "models"],
    "notify":  ["auth"],
    "models":  [],
    "logging": [],
}

def fan_out(graph, mod):
    return len(graph[mod])

def fan_in(graph, mod):
    return sum(1 for deps in graph.values() if mod in deps)

for m in sorted(GRAPH):
    print(m, "fan-in", fan_in(GRAPH, m), "fan-out", fan_out(GRAPH, m))

# Your turn: the team debates splitting "app".
# 1. Move half its imports into a new module (say "billing") in the table and
#    re-print. Which number moved: fan-in, fan-out, or both?
# 2. Add one import that closes a NEW cycle (say logging imports router).
#    Trace the chain by hand before printing anything: which modules close it?`,
      prompt: {
        ar: 'قسّم app في الجدول وراقب أي عدد يتحرك، ثم أضف استيرادًا يغلق حلقة جديدة وتتبع السلسلة يدويًا قبل أن تطبع شيئًا.',
        en: 'Split app in the table and watch which number moves, then add one import that closes a new cycle and trace the chain by hand before printing anything.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'بعودتك إلى الفصل 1: التجزيء إلى وحدات عالية التماسك لا يُلغي التعقيد، بل ينظم نوعًا بعينه. أي نوع؟',
            en: 'Back to ch1: decomposing into highly cohesive modules does not eliminate complexity, it organizes one particular kind. Which?',
          },
          options: [
            { id: 'a', text: { ar: 'التعقيد العرضي accidental الناتج عن الأدوات', en: 'Accidental complexity introduced by tools' } },
            { id: 'b', text: { ar: 'التعقيد الذاتي essential الكامن في المشكلة نفسها', en: 'Essential complexity inherent in the problem itself' } },
            { id: 'c', text: { ar: 'التعقيد النحوي لسطور الشيفرة', en: 'Syntactic complexity of code lines' } },
            { id: 'd', text: { ar: 'لا فرق جوهريًا بين النوعين', en: 'There is no real difference between the two' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المشكلة جوهرها معقد لا محالة؛ التجزيء لا يزيل التعقيد الذاتي بل يوزعه خلف واجهات صغيرة، بينما المرونة غير المدروسة تضيف تعقيدًا عرضيًا جديدًا.',
            en: 'The problem is inherently complex; decomposition does not remove essential complexity, it distributes it behind small interfaces — while unconsidered flexibility adds fresh accidental complexity.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'السيناريوهات التي تجول عبر مناظر 4+1 هي — بمفردات الفصل 5 —',
            en: 'The scenarios threaded through the 4+1 views are — in ch5 vocabulary —',
          },
          options: [
            { id: 'a', text: { ar: 'تدفقات بديلة فقط بلا فاعل', en: 'Alternative flows only, without an actor' } },
            { id: 'b', text: { ar: 'حالات استخدام كاملة: فاعل وتدفق رئيسي يسير عبر المناظر', en: 'Full use cases: an actor and a main flow walked through the views' } },
            { id: 'c', text: { ar: 'معايير قياس للأداء', en: 'Performance response measures' } },
            { id: 'd', text: { ar: 'قواصص استكشافية للفريق', en: 'Team exploratory doodles' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'السيناريوهات حالات استخدام من قلب الفصل 5: فاعل يسير في تدفق مألوف عبر المناظر الأربعة، فيتضح دور كل منظر ويُفحص اتساقها.',
            en: 'Scenarios are use cases straight out of ch5: an actor walks a familiar flow through all four views, exposing each view\'s role and checking consistency.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'أي قسم في وثيقة وصف المعمارية يحمل روح إطار الحلزون من الفصل 2؟',
            en: 'Which section of an architecture description carries the spirit of ch2\'s spiral framework?',
          },
          options: [
            { id: 'a', text: { ar: 'قسم المناظر', en: 'The views section' } },
            { id: 'b', text: { ar: 'قسم المخاطر والأسئلة المفتوحة', en: 'The risks and open questions section' } },
            { id: 'c', text: { ar: 'قسم القيود والقرارات', en: 'The constraints and decisions section' } },
            { id: 'd', text: { ar: 'قسم السياق والأهداف', en: 'The context and goals section' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الحلزون يجعل إدارة المخاطرة محرك كل دورة؛ ووثيقة تعترف بما هي غير متأكدة منه تُدار بالخطر لا بالتمني.',
            en: 'The spiral makes risk management drive each cycle; a document that admits what it is unsure of is managed by risk, not by hope.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'السؤال "أي خادم يشغّل ماذا؟" — أي عائلة هياكل وأي منظر يجيبان؟',
            en: 'The question "which server runs what?" — which structure family and view answer it?',
          },
          options: [
            { id: 'a', text: { ar: 'هياكل وحدات / منظر التطوير', en: 'Module structures / development view' } },
            { id: 'b', text: { ar: 'هياكل مكوّن-وموصل / منظر العملية', en: 'Component-and-connector structures / process view' } },
            { id: 'c', text: { ar: 'هياكل توزيع / منظر النشر', en: 'Allocation structures / deployment view' } },
            { id: 'd', text: { ar: 'مخطط الأصناف / المنظر المنطقي', en: 'Class diagram / logical view' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'هياكل التوزيع تخيط البرمجيات على بيئتها — عقد وفرق ومستودعات — والمنظر الذي يعرضها هو النشر (الفيزيائي).',
            en: 'Allocation structures map software onto its environment — nodes, teams, repositories — and the view showing them is deployment (physical).',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'كيف تبقي قاعدة "domain لا يعتمد على شيء تحته" حيّة بعد أشهر من الرسم؟',
            en: 'How do you keep the rule "domain depends on nothing below it" alive months after drawing it?',
          },
          options: [
            { id: 'a', text: { ar: 'بالاعتماد على ذاكرة الفريق وحسن النية', en: 'Rely on the team\'s memory and good intentions' } },
            { id: 'b', text: { ar: 'بإدخالها في الشيفرة نفسها: فحص ثابت في البناء يفشل عند الخرق، والمراجعات تدافع عن الحد', en: 'Bake it into the code: a static check fails the build on violation, and reviews defend the line' } },
            { id: 'c', text: { ar: 'بتوثيقها في آخر صفحة من الوثيقة', en: 'Document it on the last page of the architecture doc' } },
            { id: 'd', text: { ar: 'بمناقشتها في الاجتماع السنوي', en: 'Discuss it at the annual meeting' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المعمارية حقيقية بقدر التزام الشيفرة بها: حدّ لا يفرضه البناء ولا تدافع عنه المراجعات سيتآكل تدريجيًا.',
            en: 'Architecture is real to the extent the code obeys it: a boundary the build does not enforce and reviews do not defend will quietly erode.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: '"الواجهة ملك للطبقة التي تحتاجها، والتنفيذ يتحقق منها من الأسفل" — هذا تجسيد ملموس لأي مبدأ؟',
            en: '"The interface belongs to the layer that needs it, implementations conform from below" — which principle is this the concrete form of?',
          },
          options: [
            { id: 'a', text: { ar: 'DRY — لا تكرر معرفة', en: 'DRY — do not repeat knowledge' } },
            { id: 'b', text: { ar: 'انعكاس التبعية dependency inversion', en: 'Dependency inversion' } },
            { id: 'c', text: { ar: 'عزل الواجهات interface segregation', en: 'Interface segregation' } },
            { id: 'd', text: { ar: 'مثلث القيود', en: 'The iron triangle' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'انعكاس التبعية: الكود المهم المستقر يعتمد على التجريدات، والتفصيل المتقلب — مشغل قاعدة البيانات أو مقبس الناقل — يتحقق منها من الأسفل، فيصير تبديله مسًّا لوحدة واحدة.',
            en: 'Dependency inversion: stable, important code depends on abstractions; volatile detail — the database driver, the socket library — conforms from below, so swapping it touches one module.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'رقم fan-out المرتفع وحده صار حكمًا نهائيًا: فككت الوحدة في يوم واحد.',
          right: 'الرقم مرشح كريه design-smell candidate لا حكم؛ وازنه بالتغييرات المتوقعة فعلًا قبل أن تنفق ميزانية التجزيء.',
          note: {
            ar: 'المرونة التي لا يحتاجها أحد تعقيد عرضي بحد ذاتها.',
            en: 'Flexibility nobody needs is its own accidental complexity.',
          },
        },
        {
          wrong: 'أضفت استيرادًا عكسيًا صغيرًا لتوفير سطرين — كل شيء يعمل الآن.',
          right: 'هكذا تولد الحلقات: اكسرها بواجهة يملكها أحد الطرفين قبل أن تصير الوحدتان لا تُبنى ولا تُختبر منفردتين.',
          note: {
            ar: 'شغّل محللك في الفحص الآلي فتنكشف الحلقة وهي سطر واحد لا صداعًا في الإنتاج.',
            en: 'Run your analyzer in the build so a cycle is caught as one line, not as production pain.',
          },
        },
        {
          wrong: 'وثيقة المعمارية اكتملت وأُقفل الملف إلى الأبد.',
          right: 'اجعلها صفحات حية قليلة تتحدث مع الشيفرة، وقسم المخاطر فيها يبقى صادقًا مع كل قرار جديد.',
          note: {
            ar: 'القرار المعماري بلا قيمة إن عاش في رأس صاحبه وحده.',
            en: 'An architecture decision is worthless if it lives only in one head.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'الفصل بجملة: قرار مكلف اتُّخذ عن قصد — تماسك عالٍ، اقتران أقل، وسرّ خلف واجهة صغيرة صريحة.',
          en: 'The chapter in one line: an expensive decision made on purpose — high cohesion, low coupling, a secret behind a small explicit interface.',
        },
        {
          ar: 'الأرقام تشخّص: fan-out مرتفع تنسيق زائد، وfan-in مرتفع اعتماد واسع، والحلقة أسوأهما — والعلاج واجهة يملكها أحد الطرفين.',
          en: 'Numbers diagnose: high fan-out is over-coordination, high fan-in is broad reliance, a cycle is worst — the cure an interface one side owns.',
        },
        {
          ar: 'لا مخطط واحد يكفي؛ المناظر تفصل قرّاءها، والوثيقة القصيرة الحية تجعل القرار باقيًا.',
          en: 'No single diagram suffices; views split their readers, and a short living document keeps the decision durable.',
        },
        {
          ar: 'المعمارية حقيقية بقدر التزام الشيفرة بها: البناء يفرض والمراجعات تدافع.',
          en: 'Architecture is real to the extent the code obeys it: the build enforces, reviews defend.',
        },
        {
          ar: 'والفصل القادم: الأنماط المعمارية تحزم القرارات المتكررة فتعيد استخدام الحكم لا المخطط وحده.',
          en: 'Next chapter: architectural patterns package recurring decisions so you reuse the judgment, not just the diagram.',
        },
      ],
      reflectPrompt: {
        ar: 'بنيت محللك يوم السبت، وفي الأربعاء أعاد زميلك تشكيل الجدول. ما أول سطر ستطبعانه معًا قبل أن تبدأا الجدال؟',
        en: 'You built your analyzer on Saturday; by Wednesday a teammate reshaped the table. What is the first line you would both print before arguing?',
      },
    },
    {
      kind: 'sources',
      items: [{ book: 'SWE', section: 'swe.ch6.s6', pages: 'ص162-163 / pp.162-163' }],
    },
  ],
  sources: [{ book: 'SWE', section: 'swe.ch6.s6', pages: 'ص162-163 / pp.162-163' }],
} satisfies Lesson;

export default lesson;
