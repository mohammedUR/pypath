import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch9.l4 — "Chapter 9 Review and Project: The Mini Linter /
 * مراجعة الفصل 9 ومشروع: المنقّح المصغّر"
 * Aligned with SWE ch9 s5 (9.5 Conclusion, pp.243–244) — chapter recap + closing project.
 * All expression is original (paraphrase of the CC BY-SA 4.0 book text).
 * THE runnable core (kept from l3): ast.parse + ast.walk run fine in the bundled
 * Pyodide, so the project builds lint(source) from scratch — bare 'except:' via
 * ast.ExceptHandler with type is None, long lines (>79) by number, TODO/FIXME
 * occurrence counts — over an embedded triple-quoted source. pyflakes/ruff are
 * never imported. Deterministic, no randomness, no input().
 */
const lesson = {
  id: 'swe.ch9.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 9,
  title: {
    ar: 'مراجعة الفصل 9 ومشروع: المنقّح المصغّر',
    en: 'Chapter 9 Review and Project: The Mini Linter',
  },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch9.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'ثلاث محطات قطعناها في هذا الفصل على طيف واحد يمتد من الإنسان البطيء إلى الآلة السريعة: مراجعات المعمارية التي تلتقط أعلى العيوب كلفةً وأبكرها زمنًا، والفحوص المنضبطة بأدوار وقياس، ومراجعات الكود اليومية الصغيرة، ثم التحليل الثابت الآلي الذي يفحص الشيفرة من دون تشغيلها. اليوم مراجعة شاملة ومشروع الختام: المنقّح المصغّر — تبني بيدك أداة lint(source) بثلاث قواعد: كشف except المجردة من شجرة ast، وجمع أرقام الأسطر الأطول من 79 محرفًا، وعدّ ورود TODO وFIXME — ثم تقرير مطبوع بسطور قصيرة. وفي قلب الدرس خلل صامت حقيقي: قاعدة تفحص نوع العقدة الخطأ فتعلن شيفرة نظيفة وهي مريضة — إنذار كاذب بالسلب لا يُرى. بنهاية الدرس ستكون قادرًا على: استرجاع مصطلحات الفصل كاملة، وبناء منقّح متعدد القواعد يعيد تقريرًا، وتنقيح قاعدة تفحص الشجرة الخاطئة، وترتيب تقنيات الفصل على الطيف الإنساني-الآلي.',
        en: 'Three stations behind us on one spectrum from slow-human to fast-machine: architecture reviews catching the costliest defects earliest, disciplined role-based inspections, everyday small code reviews, then automated static analysis examining code without running it. Today is a full review and the closing project: the Mini Linter — you build, by hand, a lint(source) tool with three rules: detecting bare except: from the ast tree, collecting the numbers of lines longer than 79 characters, and counting TODO and FIXME occurrences — then a printed report of short lines. At the heart of the lesson a real silent flaw: a rule inspecting the wrong node kind declares clean code healthy — a false negative nobody sees. By the end of this lesson you will be able to: retrieve the chapter\u2019s full glossary, build a multi-rule linter returning a report, debug a rule reading the wrong tree, and order the chapter\u2019s techniques along the human-machine spectrum.',
      },
    },
    {
      kind: 'predict',
      code: "lines = ['x = 1', 'y = 2  # TODO fix', 'z = ' + '3' * 80, 'w = 4']\nfor i, line in enumerate(lines, start=1):\n    if len(line) > 79:\n        print(i)\nprint(lines[1].count('TODO'))",
      question: {
        ar: 'قاعدتان من قواعد مشروع اليوم في أربعة أسطر. أي رقم سطر سيُطبع ولماذا — وكم ورودًا سيجمع count على السطر الثاني؟',
        en: 'Two of today\u2019s project rules in four lines. Which line number will print and why — and how many occurrences will count collect on the second line?',
      },
      reveal: {
        ar: 'يطبع 3 فقط: السطران 1 و2 و4 أقصر من 79 والسطر الثالث طوله 84 (أربعة محارف + ثمانون ثلاثة). وcount يعيد 1 — ورودًا لا أسطر: لو وُجد TODO مرتين في السطر نفسه لجمع 2. الحد 79 عادة قياس بايثون الكلاسيكية لقابلية القراءة، والأدوات تجعله قابلًا للضبط — وقاعدتنا الثابتة على 79 تدريبية والمنطق نفسه.',
        en: 'It prints only 3: lines 1, 2 and 4 are shorter than 79 while the third is 84 characters (four prefix + eighty threes). And count returns 1 — occurrences, not lines: had TODO appeared twice in one line it would collect 2. The 79 limit is Python\u2019s classic readability convention and real tools make it configurable — our fixed-at-79 rule is for training, the logic identical.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خريطة الفصل ومصطلحاته', en: 'The chapter map and its glossary' },
      chunks: [
        {
          ar: 'طيف الفصل من الإنسان إلى الآلة: أولًا مراجعات المعمارية — أغلى العيوب هي قرارات التصميم، وهي أرخص تغييرًا قبل كتابة الشيفرة، لذا تُراجع المعمارية مبكرًا وتُعاد صياغتها قبل الارتباط. ثانيًا الفحوص inspections بمنهج فاجان: عملية رسمية بأدوار ثابتة (مؤلِّف ومراجعون وقارئ ومنسق وكاتب) وست مراحل من الإعداد preparation إلى الاجتماع إلى الإصلاح والمتابعة، والقياس جزء من العملية — وقد وجدت الدراسات أن الإعداد الفردي لا الاجتماع يجمع أكثر العيوب. الفحص يطالع منتجات العمل الأخطر بعينين منفصلتين عن الكاتب — فتجد ما أعين الكاتب تراه صحًّا.',
          en: 'The chapter\u2019s spectrum from human to machine: first, architecture reviews — the costliest defects are design decisions, cheapest to change before code exists, so the architecture is reviewed early and reshaped before commitments harden. Second, inspections by Fagan\u2019s method: a formal process with fixed roles (author, reviewers, reader, moderator, scribe) and six stages from preparation through the meeting to rework and follow-up, measurement part of the process — and studies found individual preparation, not the meeting, collects most defects. Inspection gives the riskiest work products eyes detached from the author — finding what the author\u2019s own eyes read as correct.',
        },
        {
          ar: 'ثالثًا مراجعات الكود — النسخة اليومية الصناعية: كل تغيير يمر على عينين قبل الدمج، ومراجعة جيدة تفحص النية والمقايضات لا الأسطر فقط، والسؤال المركزي وفق دليل غوغل: هل سيحسّن هذا التغيير صحة الشيفرة مع الوقت؟ الفعالية تتناسب طرديًّا مع صغر التغيير — مئات الأسطر تُراجع بجدٍّ والآلاف تُقرأ رحلة، والبطء يُقتل بالأوقات القصيرة. وفهرس المصطلحات: المراجعة review حوار سريع على تغيير صغير يفحص النية والصحة؛ والفحص inspection عملية رسمية مقيسة بأدوار ثابتة على منتجات عالية الخطورة؛ والخطأ يُصلَّح قبل الدمج لا بعده.',
          en: 'Third, code reviews — the everyday industrialized version: every change passes two eyes before merging, and a good review examines intent and trade-offs, not just lines; Google\u2019s guide\u2019s central question: will this change improve the codebase\u2019s health over time? Effectiveness is proportional to change size — hundreds of lines get real scrutiny while thousands get a skim, and latency is kept short on purpose. The glossary: a review is a fast conversation over a small change checking intent and correctness; an inspection is a formal, measured process with fixed roles over high-risk artifacts; and defects are fixed before merging, not after.',
        },
        {
          ar: 'رابعًا التحليل الثابت الآلي: linter أداة تمشي شجرة الشيفرة من دون تشغيلها وتطبق قواعد rules أنماطًا ميكانيكية — except مجردة، سطر طويل، متغير بلا استخدام — وكل إنذار يحمل درجة خطورة severity تُرتب العمل. سلاح الأداة الحاسم في الدرس الثالث: ast.parse يبني الشجرة وast.walk يمشيها وisinstance يقارن الأصناف — فحص بلا تنفيذ. لكن الأداة نفسها تخضع لاقتصاد الثقة: دقة عالية بإنذارات كاذبة قليلة تجعل الفريق يستجيب، ومطاردة الشمول بإنذارات كاذبة تقتل الأداة بصمت. وخلاصة الكتاب في 9.5: التقنيات الأربع مكملة لا بديلة، وكلها مكملة للاختبار — التحليل الثابت يرى ما يظهر على الصفحة وما يختبئ في المسارات النادرة، والاختبار وحده يرى السلوك عند التشغيل — لا شبكة واحدة تصطاد كل شيء، ولهذا نصب عدة شبكات.',
          en: 'Fourth, automated static analysis: a linter walks the code\u2019s tree without running it and applies rules — mechanical patterns like a bare except, a long line, an unused variable — with every finding carrying a severity that orders the work. The tool\u2019s decisive weapon from lesson three: ast.parse builds the tree, ast.walk traverses it, isinstance compares classes — examination without execution. But the tool itself lives under the economy of trust: high precision with few false positives makes the team respond, while chasing recall with noisy warnings silently kills the tool. And the book\u2019s 9.5 distillation: the four techniques complement one another and, above all, testing — static analysis sees what shows on the page and what hides on rarely executed paths, while testing alone sees behavior when the system runs. No single net catches everything — which is exactly why we cast several.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'قاعدتان في خط واحد: كاشف except وعدّاد الأسطر الطويلة', en: 'Two rules on one line: the except detector and the long-line counter' },
      code: "import ast\n\nSOURCE = '''def load(path):\n    try:\n        return open(path).read()\n    except:\n        return ''\n'''\n\ntree = ast.parse(SOURCE)\nbare = 0\nfor node in ast.walk(tree):\n    if isinstance(node, ast.ExceptHandler) and node.type is None:\n        bare = bare + 1\n\nlong_lines = 0\nfor line in SOURCE.split('\\n'):\n    if len(line) > 79:\n        long_lines = long_lines + 1\n\nprint('bare except: %d' % bare)\nprint('long lines: %d' % long_lines)",
      explanation: {
        ar: 'هذا هو قلب مشروع اليوم مضغوطًا: القاعدة الأولى تمشي شجرة SOURCE وتبحث عن عقد ExceptHandler نوع استثنائها None — أي بند except كُتب بلا نوع، والنمط الذي تبتلع به الأخطاء غير المتوقعة بصمت؛ لم يُستدعَ open ولم يُشغَّل شيء. القاعدة الثانية تعمل على النص الخام سطرًا سطرًا بعد التقسيم — وSOURCE نظيف الطول فتعطي صفرًا: القاعدة السليمة على شيفرة سليمة تعطي صفرًا، وهذا سلوك الاختبار الذي سنبنيه في المشروع مع قاعدة ثالثة للوسوم.',
        en: 'This is today\u2019s project\u2019s heart, compressed: rule one walks SOURCE\u2019s tree hunting ExceptHandler nodes whose exception type is None — an except clause written with no type, the pattern that silently swallows unexpected errors; open was never called, nothing executed. Rule two works on the raw text line by line after splitting — and SOURCE has no long lines so it returns zero: a healthy rule over healthy code gives zero, the behavior we will test in the project alongside a third rule for markers.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-marker-count',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. قاعدتا الوسوم والطول على قائمة أسطر صغيرة.',
        en: 'Read the code and predict its exact output — one line per print — without running it. The marker and length rules over a small list of lines.',
      },
      code: "lines = ['x = 1', 'y = 2  # TODO fix', 'z = ' + '3' * 80, 'w = 4']\ntodos = 0\nfor line in lines:\n    todos = todos + line.count('TODO')\nprint(todos)\nprint(len(lines[2]))\nprint(len(lines))",
      solution: '1\n84\n4',
      answer: '1\n84\n4',
      hints: [
        { ar: 'count يعدّ الورود لا الأسطر — سطر واحد فيه TODO واحد.', en: 'count counts occurrences, not lines — one line carrying a single TODO.' },
        { ar: 'السطر الثالث: بادئة z = بأربعة محارف ثم ثمانون محرفًا من الثلاثات — اجمعهما.', en: 'The third line: the four-character z = prefix then eighty 3s — add them.' },
        { ar: 'len(lines) طول القائمة لا أطوال أسطرها — العناصر أربعة مهما طالت أحدها.', en: 'len(lines) is the list\u2019s length, not its lines\u2019 lengths — four elements however long one of them is.' },
        { ar: 'الخرج:\n1\n84\n4', en: 'The output:\n1\n84\n4' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.project-mini-linter',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: "المشروع: المنقّح المصغّر. 1) في أعلى الملف ثابت SAMPLE سلسلة ثلاثية الاقتباس بها 8 أسطر: دالة load بـ try/except مجردة، سطر TODO واحد، وسطران طويلان فوق 79 محرفًا. 2) اكتب lint(source) تستقبل شيفرة نصية وتعيد قاموسًا من ثلاثة مفاتيح: 'bare' عدد except المجردة — عبر ast.parse ثم ast.walk مع isinstance(node, ast.ExceptHandler) وnode.type is None؛ و'long' قائمة أرقام الأسطر التي طولها فوق 79 — عدّ الأسطر من 1 بـ enumerate(source.split('\\n'), start=1)؛ و'todos' مجموع line.count('TODO') + line.count('FIXME') على كل الأسطر. 3) السائق: report = lint(SAMPLE) ثم اطبع أربعة أسطر: 'bare except: %d' و'long lines: %d' بطول القائمة و'long at: %s' بالقائمة نفسها و'todos: %d'. المتوقع: bare except: 1 ثم long lines: 2 ثم long at: [7, 8] ثم todos: 1.",
        en: "The project: the Mini Linter. 1) At the top of the file a constant SAMPLE: a triple-quoted string with 8 lines — a load function with a bare try/except, one TODO line, and two lines longer than 79 characters. 2) Write lint(source) taking source text and returning a dict with three keys: 'bare' the count of bare except: clauses — via ast.parse then ast.walk with isinstance(node, ast.ExceptHandler) and node.type is None; 'long' the list of line numbers longer than 79 characters — counting lines from 1 via enumerate(source.split('\\n'), start=1); and 'todos' the sum of line.count('TODO') + line.count('FIXME') over all lines. 3) Driver: report = lint(SAMPLE), then print four lines: 'bare except: %d', 'long lines: %d' with the list\u2019s length, 'long at: %s' with the list itself, and 'todos: %d'. Expected: bare except: 1, then long lines: 2, then long at: [7, 8], then todos: 1.",
      },
      starterCode: "import ast\n\nSAMPLE = '''def load(path):\n    # TODO: validate the path before opening it\n    try:\n        return open(path).read()\n    except:\n        return ''\n    # a long padded note aaaaaa bbbbbb cccccc dddddd eeeeee ffffff gggggg hhhhhh\n    # another long padded note iiiiii jjjjjj kkkkkk llllll mmmmmm nnnnnn oooooo pppppp qqqqqq\n'''\n\ndef lint(source):\n    # القاعدة 1: except المجردة من شجرة ast / rule 1: bare except from the ast tree\n    # القاعدة 2: أرقام الأسطر فوق 79 / rule 2: line numbers over 79 chars\n    # القاعدة 3: ورود TODO وFIXME / rule 3: TODO and FIXME occurrences\n    return {'bare': 0, 'long': [], 'todos': 0}\n\n\nreport = lint(SAMPLE)\nprint('bare except: %d' % report['bare'])\nprint('long lines: %d' % len(report['long']))\nprint('long at: %s' % report['long'])\nprint('todos: %d' % report['todos'])",
      solution: "import ast\n\nSAMPLE = '''def load(path):\n    # TODO: validate the path before opening it\n    try:\n        return open(path).read()\n    except:\n        return ''\n    # a long padded note aaaaaa bbbbbb cccccc dddddd eeeeee ffffff gggggg hhhhhh\n    # another long padded note iiiiii jjjjjj kkkkkk llllll mmmmmm nnnnnn oooooo pppppp qqqqqq\n'''\n\ndef lint(source):\n    tree = ast.parse(source)\n    bare = 0\n    for node in ast.walk(tree):\n        if isinstance(node, ast.ExceptHandler) and node.type is None:\n            bare = bare + 1\n    long_lines = []\n    todos = 0\n    for number, line in enumerate(source.split('\\n'), start=1):\n        if len(line) > 79:\n            long_lines.append(number)\n        todos = todos + line.count('TODO') + line.count('FIXME')\n    return {'bare': bare, 'long': long_lines, 'todos': todos}\n\n\nreport = lint(SAMPLE)\nprint('bare except: %d' % report['bare'])\nprint('long lines: %d' % len(report['long']))\nprint('long at: %s' % report['long'])\nprint('todos: %d' % report['todos'])",
      tests: [
        {
          id: 't1',
          name: { ar: 'السائق يطبع أسطر التقرير الأربعة بالترتيب', en: 'The driver prints the four report lines in order' },
          code: "assert 'bare except: 1' in __learner_output__ and 'long lines: 2' in __learner_output__ and 'long at: [7, 8]' in __learner_output__ and 'todos: 1' in __learner_output__, 'expected: bare except: 1 / long lines: 2 / long at: [7, 8] / todos: 1 | actual: %r' % __learner_output__",
          expected: 'bare except: 1 / long lines: 2 / long at: [7, 8] / todos: 1',
        },
        {
          id: 't2',
          name: { ar: 'التقرير: لقطة واحدة وقائمة [7, 8] ووسم واحد', en: 'The report: one bare clause, the [7, 8] list, one marker' },
          code: "assert report['bare'] == 1 and report['long'] == [7, 8] and report['todos'] == 1, 'expected: bare 1, long [7, 8], todos 1 | actual: %r' % report",
          expected: 'bare 1, long [7, 8], todos 1',
        },
        {
          id: 't3',
          name: { ar: 'شيفرة نظيفة كلها أصفار — لا إنذارات كاذبة', en: 'Clean code gives all zeros — no false positives' },
          code: "assert lint('def ok():\\n    return 1\\n') == {'bare': 0, 'long': [], 'todos': 0}, 'expected: all-zero report | actual: %r' % lint('def ok():\\n    return 1\\n')",
          expected: 'all-zero report',
        },
        {
          id: 't4',
          name: { ar: 'القاعدة تلتقط except مجردة في شيفرة أخرى', en: 'The rule catches a bare except in other code' },
          code: "r2 = lint('try:\\n    run()\\nexcept:\\n    pass\\n')\nassert r2['bare'] == 1 and r2['long'] == [] and r2['todos'] == 0, 'expected: bare 1 only | actual: %r' % r2",
          expected: 'bare 1 only',
        },
        {
          id: 't5',
          name: { ar: 'عدّ الورود لا الأسطر: TODO مرتين في سطر واحد تجمع 2', en: 'Occurrences not lines: TODO twice on one line counts 2' },
          code: "r3 = lint('x = 1  # TODO fix and TODO track\\n')\nassert r3['todos'] == 2 and r3['bare'] == 0, 'expected: todos 2 | actual: %r' % r3['todos']",
          expected: 'todos 2',
        },
      ],
      hints: [
        { ar: 'ابدأ من شجرة l3 نفسها: ast.parse ثم حلقة ast.walk وشرط isinstance مع node.type is None — عدّاد واحد يكفي للقاعدة الأولى.', en: 'Start from the lesson-3 tree: ast.parse, an ast.walk loop and the isinstance condition with node.type is None — one counter covers rule one.' },
        { ar: 'للقاعدة الثانية: enumerate(source.split(\'\\n\'), start=1) يعطيك الرقم والسطر معًا — اجمع الرقم حين len(line) > 79.', en: "For rule two: enumerate(source.split('\\n'), start=1) gives number and line together — collect the number when len(line) > 79." },
        { ar: 'للقاعدة الثالثة: todos = todos + line.count(\'TODO\') + line.count(\'FIXME\') داخل الحلقة نفسها — لا حاجة لحلقة ثانية.', en: "For rule three: todos = todos + line.count('TODO') + line.count('FIXME') inside the same loop — no second pass needed." },
        { ar: 'هيكل lint كاملًا:\ntree = ast.parse(source)\nbare = 0\nfor node in ast.walk(tree):\n    if isinstance(node, ast.ExceptHandler) and node.type is None:\n        bare = bare + 1\nlong_lines = []\ntodos = 0\nfor number, line in enumerate(source.split(\'\\n\'), start=1):\n    if len(line) > 79:\n        long_lines.append(number)\n    todos = todos + line.count(\'TODO\') + line.count(\'FIXME\')\nreturn {\'bare\': bare, \'long\': long_lines, \'todos\': todos}', en: "The lint skeleton:\ntree = ast.parse(source)\nbare = 0\nfor node in ast.walk(tree):\n    if isinstance(node, ast.ExceptHandler) and node.type is None:\n        bare = bare + 1\nlong_lines = []\ntodos = 0\nfor number, line in enumerate(source.split('\\n'), start=1):\n    if len(line) > 79:\n        long_lines.append(number)\n    todos = todos + line.count('TODO') + line.count('FIXME')\nreturn {'bare': bare, 'long': long_lines, 'todos': todos}" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-trust',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'وفي اقتصاد التحليل الثابت كما صاغه الكتاب: ما الذي يجعل المنقّح أداةً يعتمد عليها الفريق فعلًا؟',
        en: 'And in the book\u2019s economy of static analysis: what makes a linter a tool the team actually trusts?',
      },
      options: [
        { id: 'a', text: { ar: 'دقة عالية بإنذارات كاذبة قليلة — فكل إنذار يستحق النظر، والثقة تتراكم مع كل إصلاح', en: 'High precision with few false positives — every finding deserves a look and trust compounds with each fix' } },
        { id: 'b', text: { ar: 'أكبر عدد ممكن من الإنذارات حتى لا يفوت شيء — والفريق يفرزها يدويًّا', en: 'The largest possible number of warnings so nothing slips — the team sorts them by hand' } },
        { id: 'c', text: { ar: 'أن يمنع الأداة الحفظ كليًّا حين يظهر أي إنذار', en: 'The tool blocking all saves whenever any warning appears' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'المورد النادر عند الأداة ليس العتاد بل ثقة الفريق.', en: 'The tool\u2019s scarce resource is not hardware but the team\u2019s trust.' },
        { ar: 'الإنذار الكاذب المتكرر يدرّب الفريق على تجاهل الأداة — وحينها تضيع إنذاراتها الحقيقية أيضًا.', en: 'Recurring false positives train the team to ignore the tool — and then its true findings are lost too.' },
        { ar: 'لهذا تخنق الأدوات الحقيقية القواعد الصاخبة وتفضّل الدقة على الشمول.', en: 'That is why real tools silence noisy rules and prefer precision over recall.' },
        { ar: 'الجواب: أ — الدقة تشتري الثقة، ومطاردة الشمول تنفقها.', en: 'Answer: a — precision buys trust; chasing recall spends it.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-occurrences',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: قاعدة الوسوم تعدّ الورود occurrences لا الأسطر — في السطر x = 1  # TODO fix and TODO track كم وردًا سيجمع line.count(\'TODO\')؟',
        en: "Without running: the marker rule counts occurrences, not lines — on the line x = 1  # TODO fix and TODO track, how many occurrences does line.count('TODO') collect?",
      },
      answer: '2',
      solution: '2',
      tolerance: 0,
      hints: [
        { ar: 'count تمشي السطر كله وتعد كل ظهور مستقل للنمط.', en: 'count scans the whole line and tallies every independent appearance of the pattern.' },
        { ar: 'الكلمة TODO ظهرت في السطر مرتين — مرة في كل تعليق جزئي.', en: 'The word TODO appears in the line twice — once in each partial comment.' },
        { ar: 'ولو كان FIXME بدل الثاني لجمع count الأولى فقط — القاعدة تجمع الاثنين معًا.', en: 'And had the second been FIXME, only the first would count — our rule sums both.' },
        { ar: 'الجواب: 2', en: 'Answer: 2' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-wrong-node',
      required: true,
      brokenCode: "import ast\n\nSAMPLE = '''def load(path):\n    try:\n        return open(path).read()\n    except:\n        return ''\n'''\n\ndef count_bare(source):\n    tree = ast.parse(source)\n    bare = 0\n    for node in ast.walk(tree):\n        if isinstance(node, ast.Assign):\n            bare = bare + 1\n    return bare\n\nbare = count_bare(SAMPLE)\nprint('bare except: %d' % bare)",
      prompt: {
        ar: 'شغّل الكود المعطوب ولاحظ الفضيحة: SOURCE فيه except مجردة واضحة — ومع ذلك يطبع المنقّح bare except: 0! لا استثناء ولا انهيار: إنذار كاذب بالسلب، أخبث أنواع فشل أدوات الفحص لأنه يطمئن الفريق زورًا. اسأل نفسك: أي عقدة تصف بند except في شجرة ast؟ ليس ast.Assign (الإسنادات، وSAMPLE أصلًا بلا إسناد واحد) بل ast.ExceptHandler — والشرط الثاني node.type is None هو الذي يميّز المجردة من المكتوبة بنوع. أصلح القاعدة بتبديل الصنف وإضافة شرط None فيصير العدّ 1.',
        en: 'Run the broken code and witness the scandal: SOURCE contains an obvious bare except — yet the linter prints bare except: 0! No exception, no crash: a false negative, the most treacherous failure mode of a checking tool because it reassures the team falsely. Ask yourself: which node describes an except clause in the ast tree? Not ast.Assign (assignments — SAMPLE has none at all) but ast.ExceptHandler — and the second condition node.type is None is what separates a bare clause from one written with a type. Fix the rule by swapping the class and adding the None condition, making the count 1.',
      },
      solution: "import ast\n\nSAMPLE = '''def load(path):\n    try:\n        return open(path).read()\n    except:\n        return ''\n'''\n\ndef count_bare(source):\n    tree = ast.parse(source)\n    bare = 0\n    for node in ast.walk(tree):\n        if isinstance(node, ast.ExceptHandler) and node.type is None:\n            bare = bare + 1\n    return bare\n\nbare = count_bare(SAMPLE)\nprint('bare except: %d' % bare)",
      tests: [
        {
          id: 't1',
          name: { ar: 'التقرير يعلن البند المجرد: bare except: 1', en: 'The report announces the bare clause: bare except: 1' },
          code: "assert 'bare except: 1' in __learner_output__, 'expected: bare except: 1 | actual: %r' % __learner_output__",
          expected: 'bare except: 1',
        },
        {
          id: 't2',
          name: { ar: 'العدّ نفسه صحيح: bare يساوي 1', en: 'The count itself is right: bare equals 1' },
          code: "assert bare == 1, 'expected: 1 | actual: %r' % bare",
          expected: '1',
        },
        {
          id: 't3',
          name: { ar: 'بلا إنذارات كاذبة: سطر إسناد نظيف يعطي 0 وبند مجرد صريح يعطي 1', en: 'No false positives: a clean assignment line gives 0 and an explicit bare clause gives 1' },
          code: "assert count_bare('x = 1\\n') == 0, 'expected: 0 | actual: %r' % count_bare('x = 1\\n')\nassert count_bare('try:\\n    a()\\nexcept:\\n    pass\\n') == 1, 'expected: 1 | actual: %r' % count_bare('try:\\n    a()\\nexcept:\\n    pass\\n')",
          expected: '0 for x = 1 and 1 for the bare clause',
        },
      ],
      hints: [
        { ar: 'لا استثناء ولا انهيار — والعدّ 0 على شيفرة مريضة: هذا إنذار كاذب بالسلب، أسوأ خروج عن الصواب في أداة فحص.', en: 'No exception, no crash — and a count of 0 on sick code: a false negative, a checker\u2019s worst kind of wrong.' },
        { ar: 'اسأل عن العقدة لا عن المنطق: أي صنف يصف بند except؟ تتبّع بقاموس صنف-اسم: FunctionDef للدوال وAssign للإسنادات وExceptHandler لبنود except.', en: 'Question the node, not the logic: which class describes an except clause? Trace by class name: FunctionDef for functions, Assign for assignments, ExceptHandler for except clauses.' },
        { ar: 'الإصلاح شرطان في سطر واحد: isinstance(node, ast.ExceptHandler) and node.type is None — الصنف يلتقط كل بنود except والشرط يعزل المجردة منها.', en: 'The fix is two conditions on one line: isinstance(node, ast.ExceptHandler) and node.type is None — the class catches every except clause and the condition isolates the bare ones.' },
        { ar: 'بعد الإصلاح يطبع bare except: 1 — وجرّب count_bare على x = 1 فتجد 0: القاعدة السليمة لا تجرّح النظيف.', en: 'After the fix it prints bare except: 1 — and try count_bare on x = 1 to see 0: a healthy rule never wounds clean code.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — منقّحك المصغّر وقواعدك الجديدة\n# Your playground — your mini linter and your own rules\n\nimport ast\n\nSAMPLE = '''def load(path):\n    # TODO: validate the path before opening it\n    try:\n        return open(path).read()\n    except:\n        return ''\n'''\n\ndef lint(source):\n    tree = ast.parse(source)\n    bare = 0\n    for node in ast.walk(tree):\n        if isinstance(node, ast.ExceptHandler) and node.type is None:\n            bare = bare + 1\n    long_lines = []\n    todos = 0\n    for number, line in enumerate(source.split('\\n'), start=1):\n        if len(line) > 79:\n            long_lines.append(number)\n        todos = todos + line.count('TODO') + line.count('FIXME')\n    return {'bare': bare, 'long': long_lines, 'todos': todos}\n\nprint(lint(SAMPLE))\nprint(lint('x = 1\\n'))\nprint(lint('try:\\n    run()\\nexcept:\\n    pass\\n'))\n\n# جرّب: قاعدة رابعة تعدّ أسطر 'import *' — النمط الذي تحذّر منه الأدوات\n# try: a fourth rule counting 'import *' lines — a pattern tools warn about\n# جرّب: أضف لكل قاعدة درجة خطورة severity في التقرير: error أم warning؟\n# try: give each rule a severity in the report: error or warning?",
      prompt: {
        ar: 'جرّب بنفسك: مرّر شيفرة من عندك إلى lint وشاهد التقرير، ثم أضف قاعدة رابعة على أسطر import * — وفكّر في severity: أي قواعدك error وأيها warning ولماذا؟ لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: feed your own code to lint and watch the report, then add a fourth rule on import * lines — and think severity: which of your rules are errors and which warnings, and why? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن فصل التعبيرات النمطية في مسار بايثون (الفصل الحادي عشر): عدّادنا استخدم line.count(\'TODO\') — أي أداة من صندوق re كانت أعم لأيجاد كل مواضع نمط داخل نص؟',
            en: "From the Python track's regular-expressions chapter (chapter 11): our counter used line.count('TODO') — which tool from the re box is the deeper way to find every position of a pattern in text?",
          },
          options: [
            { id: 'a', text: { ar: 're.findall — يعيد قائمة بكل المطابقات الفعلية للنمط في النص', en: 're.findall — returning a list of every actual match of the pattern in the text' } },
            { id: 'b', text: { ar: 're.search — يعيد قائمة بكل المطابقات أيضًا', en: 're.search — which also returns a list of every match' } },
            { id: 'c', text: { ar: 'len(text) — يعيد عدد التطابقات', en: 'len(text) — returning the match count' } },
          ],
          answer: 'a',
          explanation: {
            ar: 're.search يجد أول مطابقة فقط ويعيد كائن مطابقة، وre.findall يجمعها كلها في قائمة — ولأن وسومنا كلمة ثابتة فقد كفى count، لكن الأنماط المتغيرة (مثل TODO-123) تحتاج findall بنمط تعبيري.',
            en: 're.search finds only the first match and returns a match object, while re.findall gathers them all into a list — and since our markers are a fixed word, count sufficed; variable patterns (like TODO-123) would need findall with an expressive pattern.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الرابع (الدوال) في مسار بايثون: جمعنا القواعد الثلاث في دالة lint(source) واحدة تعيد قاموسًا — أي مبدأ من مبادئ الدوال يخدمه هذا التجميع؟',
            en: 'From chapter 4 (functions) of the Python track: we gathered the three rules into one lint(source) function returning a dict — which functions principle does that assembly serve?',
          },
          options: [
            { id: 'a', text: { ar: 'الدالة الواحدة مسؤولية مركّب واضح المعامل والناتج: تُكتب مرة وتُستدعى واختبَرت مرات — والقاموس المعاد يحمل القواعد الثلاث مفصولة الأسماء', en: 'A single function with a clear input and a composed output: written once, called and tested many times — and the returned dict carries the three rules under separated names' } },
            { id: 'b', text: { ar: 'الدوال يجب أن تطبع نتائجها لا تعيدها', en: 'Functions should print their results rather than return them' } },
            { id: 'c', text: { ar: 'المتغيرات داخل الدالة تبقى حية بعد return', en: 'Variables inside the function stay alive after return' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'تجميع القواعد في دالة بمعامل source قلّص التكرار وجعل كل قاعدة قابلة للاختبار عبر الناتج المعاد — نفس الدرس الذي بنى عليه مسار بايثون الدوال: مدخل واحد، عمل واحد متماسك، وناتج يعود إلى المستدعي.',
            en: 'Gathering the rules into one function with a source parameter cut repetition and made every rule testable through the returned value — the same functions lesson the Python track built on: one input, one coherent job, and a result handed back to the caller.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الدرس الأول لهذا الفصل: لماذا تُعد مراجعات المعمارية أعلى التقنيات التقاطًا للعيوب الباهظة؟',
            en: 'From this chapter\u2019s first lesson: why do architecture reviews rank highest for catching expensive defects?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنها تعمل مبكرًا حين القرار ما زال ورقة وأفكارًا — وتغيير التصميم رخيص قبل أن ترتبط به شيفرة وفرق', en: 'Because they run early while the decision is still paper and ideas — changing the design is cheap before code and teams bind to it' } },
            { id: 'b', text: { ar: 'لأنها أسرع التقنيات تنفيذًا على تغيير صغير', en: 'Because they are the fastest technique to run on a small change' } },
            { id: 'c', text: { ar: 'لأنها تلغي الحاجة إلى الاختبار كليًّا', en: 'Because they remove the need for testing altogether' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كلفة العيب تنمو مع تقدم عمره: خطأ تصميم يُكتشف مبكرًا ورقة تُقلب، ويُكتشف في الإنتاج حادثة تُحقَّق. لهذا وضعها الكتاب أول الطيف — أبكر وأغلى عيوبًا — والمراجعة اليومية والتحليل الآلي يغطيان ما بعدها.',
            en: 'A defect\u2019s cost grows with its age: a design flaw found early flips a page; found in production it becomes an incident with an investigation. That is why the book put it first on the spectrum — earliest and costliest defects — with daily review and automated analysis covering what follows.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن درس الفحوص: ما الذي وجدته دراسات الفحص أنه يجمع أكثر عيوب الفحص — الاجتماع نفسه أم شيء آخر؟',
            en: 'From the inspections lesson: what did inspection studies find collects the most inspection defects — the meeting itself, or something else?',
          },
          options: [
            { id: 'a', text: { ar: 'الإعداد preparation قبل الاجتماع: كل مراجع يقرأ القطعة وحده مسبقًا بتركيز كامل — والاجتماع معد لتثبيت ما وجدته القراءة الفردية وتسجيله', en: 'Preparation before the meeting: each reviewer reads the work product alone, in advance, with full focus — the meeting exists to consolidate and record what individual reading already found' } },
            { id: 'b', text: { ar: 'طول الاجتماع كلما طال وجد أكثر', en: 'The longer the meeting, the more it finds' } },
            { id: 'c', text: { ar: 'عدد المشاركين كلما كثر وجد أكثر', en: 'The more participants, the more it finds' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'دراسات الفحص واضحة: الاجتماع بلا إعداد فردي يجد القليل، والإعداد المنضبط هو محرك الاكتشاف. لهذا جعل الفصل الإعداد مرحلة رسمية بقواعد قراءة ووتيرة — والقياس يتابع عيوب كل مرحلة.',
            en: 'Inspection studies are clear: a meeting without individual preparation finds little; disciplined preparation is the discovery engine. That is why the chapter made preparation a formal stage with reading rules and pace — and measurement tracks defects per stage.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'في مشروعنا — لماذا يعني node.type is None أن البند except مجردة؟',
            en: 'In our project — why does node.type is None mean the except clause is bare?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن صفة type على عقدة ExceptHandler تحمل نوع الاستثناء المكتوب — والبند المكتوب except: بلا نوع يتركها None', en: 'Because the type attribute on an ExceptHandler node holds the written exception type — and a clause written except: with no type leaves it None' } },
            { id: 'b', text: { ar: 'لأن None اسم استثناء شائع في بايثون', en: 'Because None is a common Python exception name' } },
            { id: 'c', text: { ar: 'لأن ast يمسح أنواع الاستثناءات قبل البناء', en: 'Because ast erases exception types before building' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'العقدة تصف البند كما كُتب: except ValueError تحمل type يساوي صنف ValueError، وexcept المجردة بلا شيء يحمل فتكون None — وهذا بالضبط التمييز الذي يبحث عنه pyflakes وأخواته في هذه القاعدة.',
            en: 'The node describes the clause as written: except ValueError carries type equal to the ValueError class, while a bare except carries nothing, hence None — exactly the distinction pyflakes and its kin look for in this rule.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'وفي خلاصة الفصل — كيف تقارن تقنيات عدم التشغيل الأربع بالاختبار؟',
            en: 'And in the chapter\u2019s conclusion — how do the four no-run techniques compare with testing?',
          },
          options: [
            { id: 'a', text: { ar: 'مكملة لا بديلة: التحليل الثابت يرى ما يظهر على الصفحة وما يختبئ في المسارات النادرة، والاختبار وحده يرى السلوك عند التشغيل — لا شبكة واحدة تكفي', en: 'Complementary, never a replacement: static analysis sees what shows on the page and what hides on rarely run paths, while testing alone sees behavior when the system runs — no single net suffices' } },
            { id: 'b', text: { ar: 'بديلة كليًّا: منقّح نظيف يعني أن الشيفرة تعمل صحيحًا', en: 'A full replacement: a clean linter means the code runs correctly' } },
            { id: 'c', text: { ar: 'أدنى من الاختبار دائمًا فلا سبب لاستخدامها', en: 'Always inferior to testing, so there is no reason to use them' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'سلسلة خطأ→عيب→فشل تُكسر في كل حلقة: المراجعات والفحوص تقلل العيوب قبل وصولها للشيفرة، والتحليل الثابت يصطاد أجنحة كاملة آليًّا، والاختبار يستفز الفشل الذي تسلل. لذلك نصب الفصل عدة شبكات — وهذا مدخل الفصل العاشر.',
            en: 'The mistake→fault→failure chain is broken at every link: reviews and inspections reduce the faults reaching the codebase, static analysis sweeps whole categories automatically, and testing provokes the failures that slipped through. The chapter casts several nets — and that is chapter 10\u2019s doorway.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'تقرير المنقّح نظيف = الشيفرة صحيحة',
          right: 'التقرير النظيف أرضية لا سقف — الأداة تصطاد أجنحة الأنماط التي بُنيت لها فقط، والسلوك يثبته الاختبار',
          note: {
            ar: 'السالب الكاذب حتمي: المنقّح لا يعرف نيتك ولا يشغّل شيئًا. من يقول «الـ linter راضٍ فانتهينا» يقول ما يقوله الكتاب حرفيًّا إنه أرضية لا سقف — ولذلك يكمل التحليل الثابت بالمراجعة والاختبار ولا يستبدلها.',
            en: 'False negatives are inevitable: the linter knows neither your intent nor any execution. Saying the linter is happy so we are done is precisely the book\u2019s floor-not-ceiling warning — static analysis complements review and testing and never replaces them.',
          },
        },
        {
          wrong: 'فحص ast.Assign لأنه أول صنف تذكره الذاكرة',
          right: 'فحص الصنف الذي يصف النمط نفسه: ast.ExceptHandler مع node.type is None ل except المجردة',
          note: {
            ar: 'خلل درسنا لا يصرخ: الشجرة تُمشى والعدّ يعمل والنتيجة 0 — وأخبث ما في الإنذار الكاذب بالسلب أنه يطمئن. عالجه بسؤال العقدة أولًا: أي صنف يصف البند؟ ثم اشترط على الصفة المميِّزة لا على الوجود.',
            en: 'Our lesson\u2019s flaw never shouts: the tree is walked, the counter runs, the result is 0 — and the worst part of a false negative is the false comfort. Treat it by questioning the node first: which class describes the clause? Then condition on the distinguishing attribute, not mere existence.',
          },
        },
        {
          wrong: 'أضِف كل قاعدة تخطر ببالك — الإنذارات الكثيرة دليل صرامة',
          right: 'الدقة قبل الشمول: كل قاعدة تُقاس بإنذاراتها الكاذبة، والقاعدة الصاخبة تُصلَح أو تُسكَت',
          note: {
            ar: 'اقتصاد الثقة من درس 9.4: فريق يغرق في إنذارات كاذبة يتعلم تجاهل الأداة، فتضيع معها إنذاراتها الحقيقية. لذا تُضبط القواعد وتُرتّب بـ severity ويُناقش كل إنذار جديد قبل أن يسكن التكوين الآلي.',
            en: 'The trust economy from 9.4: a team drowning in false positives learns to ignore the tool, losing its true findings too. So rules are tuned and ordered by severity, and every new rule is argued before it joins the automated pipeline.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'طيف الفصل من الإنسان إلى الآلة: مراجعات معمارية لأغلى العيوب أبكرها، وفحوص فاجان الرسمية المقيسة التي يجمع فيها الإعداد preparation أكثر العيوب، ومراجعات كود يومية صغيرة تفحص النية وتتناسب فعاليتها مع صغر التغيير، ثم تحليل ثابت آلي ينفذ الميكانيكي في ثوانٍ.', en: 'The chapter\u2019s human-to-machine spectrum: architecture reviews for the costliest defects earliest, Fagan\u2019s formal measured inspections where individual preparation collects the most defects, everyday small code reviews checking intent with effectiveness proportional to change size, then automated static analysis running the mechanical checks in seconds.' },
        { ar: 'مشروع المنقّح المصغّر جمع ثلاث قواعد في lint(source) تعيد قاموسًا: bare عبر ast.ExceptHandler وtype is None، وlong بأرقام الأسطر فوق 79 بـ enumerate(start=1)، وtodos بجمع count لـ TODO وFIXME — وتقرير مطبوع قابل للمطابقة.', en: 'The Mini Linter project joined three rules in lint(source) returning a dict: bare via ast.ExceptHandler with type is None, long as line numbers over 79 via enumerate(start=1), todos by summing count for TODO and FIXME — plus a matchable printed report.' },
        { ar: 'الخلل الذي نقحناه درس مزدوج: قاعدة تفحص صنف العقدة الخطأ تعطي 0 صامتًا على شيفرة مريضة — واقتصاد الثقة يفرض الدقة على الشمول لأن التقرير النظيف أرضية لا سقف، والتقنيات كلها مكملة للاختبار لا بديلة عنه.', en: 'The flaw we debugged teaches twice: a rule checking the wrong node class gives a silent 0 on sick code — and the trust economy demands precision over recall, because a clean report is a floor not a ceiling, and all the techniques complement testing rather than replace it.' },
      ],
      reflectPrompt: {
        ar: 'في الملعب: مرّر شيفرة كتبتها هذا الأسبوع إلى منقّحك واقرأ التقرير بلا دفاع — أي قاعدة أعلنت أكثر شيئًا، وهل كانت إنذاراتها كلها حقيقية؟ ثم رتّب قواعدك الأربع بدرجات severity وبرر كل درجة في سطر.',
        en: 'In the sandbox: feed code you wrote this week to your linter and read the report without defending yourself — which rule spoke most, and were all its findings genuine? Then order your four rules by severity and justify each grade in one line.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch9.s5', pages: 'ص243–244 / pp.243–244' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch9.s5', pages: 'ص243–244 / pp.243–244' },
  ],
} satisfies Lesson;

export default lesson;
