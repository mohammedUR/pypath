/**
 * swe.ch7.l1 — الطبقات واللبنات الثلاث / Layering and the Three Building Blocks
 * SWE ch7 — s1 Software Layering (ص175-177 / pp.175-177) + s2 Three Building
 * Blocks (ص177-181 / pp.177-181).
 * Runnable design: a layered request walk (ui -> logic -> data) printed as short
 * deterministic ASCII; shared-data and observer appear as fixed mini-simulations.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch7.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 7,
  title: { ar: 'الطبقات واللبنات الثلاث', en: 'Layering and the Three Building Blocks' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch6.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'بعد ظهر أمس كان كل شيء يعمل: الحجز يعمل، الفواتير تعمل. اليوم غيّر أحمد مشغّل قاعدة البيانات — فانكسرت شاشة الحجز التي لا علاقة لها بقاعدة البيانات إطلاقًا. السبب أن أحدًا لم يفصل المستويات: كل جزء يتكلم مع كل جزء. هذا الدرس يمنحك أول شكل معماري جاد: الطبقات (layers)، ثم ثلاث لبنات صغيرة يتكرر وجودها داخل كل معمارية كبيرة ستصادفها.',
        en: "Yesterday afternoon everything worked: booking worked, invoices worked. Today Ahmad swapped the database driver — and the booking screen, which has nothing to do with the database, broke. The cause: nobody separated the levels, so every part talks to every part. This lesson gives you your first serious architectural shape: layers, plus three small building blocks that recur inside every large architecture you will meet.",
      },
    },
    {
      kind: 'predict',
      code: 'def presentation(x):\n    return "P(" + application(x) + ")"\ndef application(x):\n    return "A(" + domain(x) + ")"\ndef domain(x):\n    return "D=" + str(x * 2)\nprint(presentation(5))\n',
      question: {
        ar: 'قبل الشرح: ماذا يطبع هذا الكود؟ لاحظ أن كل دالة تستدعي الدالة التي تحتها فقط.',
        en: 'Before the theory: what does this print? Note that each function calls only the function below it.',
      },
      reveal: {
        ar: 'يطبع P(A(D=10)). كل طبقة تلتف حول التي تحتها، والاعتماد يتجه للأسفل فقط — هذا هو جوهر الطبقات في سطر واحد.',
        en: 'It prints P(A(D=10)). Each layer wraps the one below it and dependency points downward only — the essence of layering in one line.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط الطبقات: خدمة لمن فوقك، استعانة بمن تحتك', en: 'The layered pattern: serve the one above, use the one below' },
      chunks: [
        {
          ar: 'يرصّ نمط الطبقات (layered pattern) النظام في طوابق أفقية: كل طبقة تقدم خدمات للطبقة التي فوقها مباشرة وتستهلك خدمات الطبقة التي تحتها مباشرة. الطبقة مجموعة وحدات تعمل على مستوى تجريد واحد: العليا تتكلم لغة مشكلة المستخدم، والسفلى تتكلم لغة الآلة، والوسطى تترجم بينهما تدريجيًا. القاعدة الحديدية: الاعتماديات تتجه للأسفل فقط — السياسة العالية تعتمد على الآلية المنخفضة عبر واجهة مستقرة، والعكس ممنوع. في تطبيق الأعمال الكلاسيكي تجد أربع طبقات: presentation للعرض وفهم المدخلات، application لتنسيق حالات الاستخدام، domain لقواعد العمل الأساسية، infrastructure للتعامل مع قواعد البيانات والعالم الخارجي.',
          en: 'The layered pattern stacks the system into horizontal tiers: each layer offers services to the layer directly above and consumes services from the layer directly below. A layer is a group of modules working at one level of abstraction: the top speaks the language of the user problem, the bottom speaks the language of the machine, and the middle layers translate between them. The iron rule: dependencies point downward only — high-level policy depends on low-level mechanism through a stable interface, never the reverse. A classic business application has four tiers: presentation renders the UI and interprets input, application coordinates use cases, domain holds the core business rules, infrastructure talks to databases and the outside world.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'صارم أم مرن؟ وضريبة العبور', en: 'Strict or relaxed? And the pass-through tax' },
      chunks: [
        {
          ar: 'قرارك الأول بعد رسم الطبقات: هل هي strict أم relaxed؟ في الصارم تستدعي كل طبقة الطبقة التي تحتها مباشرة فقط، فتعزل التغييرات بأقصى درجة — لكنك تدفع ضريبة العبور (pass-through): حقل يدخله المستخدم في الأعلى يمرر يدويًا عبر كل الطبقات حتى يصل المخزن، وتعديل واحد يمس أربعة ملفات. في المرن يسمح لطبقة ما بقفز أكثر من درجة، فيختفي الجزء الزائد لكن يضعف الضمان: قد تتسرب طبقة العرض إلى infrastructure مباشرة. وهناك كلفة أداء صغيرة عند كل حد بين طبقتين. القاعدة العملية: ادفع ثمن الصرامة إذا كنت تتوقع تبديل الطبقات السفلى كثيرًا، وارفع الصرامة إذا كانت طبقاتك رقيقة ومستقرة. أما فوائد الطبقات فهي ثلاث: قابلية استبدال أي تنفيذ خلف واجهة، وفصل اهتمامات يتيح لكل فريق عمله، ونموذج ذهني مشترك يسهل على الجدد معرفة مكان كل شيفرة.',
          en: 'Your first decision after drawing the tiers: strict or relaxed? In strict layering a layer calls only the one directly below it, isolating change maximally — but you pay the pass-through tax: a field typed at the top is threaded by hand through every tier to reach the store, and one change touches four files. In relaxed layering a layer may skip levels; the boilerplate disappears but the guarantee weakens: presentation might reach straight into infrastructure. There is also a small performance cost at each boundary. The practical rule: pay for strictness if you expect to swap lower layers often; relax when your layers are thin and stable. The benefits are three: substitutability behind an interface, separation of concerns so teams work independently, and a shared mental model that tells new engineers where code goes.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'اللبنات الثلاث: shared data وobserver والواجهة المستقرة', en: 'Three building blocks: shared data, observer, and the stable interface' },
      chunks: [
        {
          ar: 'قبل المعماريات الكبيرة يسمي الكتاب ثلاث لبنات تتكرر داخلها كلها. الأولى shared data: مخزن مركزي واحد يحمل الحقيقة الموثوقة، ووحدات مستقلة (accessors) تقرأ وتكتب عبره فلا تتكلم مع بعضها مباشرة — مثل جدول رموز المترجم: الـ parser يكتبه والمدقق النوعي يقرأه. الثانية observer: صاحب الحالة لا يعرف من يهتم بها؛ المهتمون يشتركون (subscribe) وعند التغيير ينبّه الكل عبر عملية موحدة (notify) — فتنقلب الاعتمادية ويستطيع إضافة مهتم جديد دون تعديله. الثالثة الواجهة المستقرة: عقد واضح يخفي ما خلفه، فيمكن استبدال التنفيذ دون إزعاج المستدعين — وهي الفكرة التي تشتغل بها الطبقات والخوادم معًا. أتقن الأدوار الثلاثة كأدوار بنيوية قابلة لإعادة الاستخدام، وستصبح الأنماط الكبيرة إعادة تركيب لأفكار تعرفها.',
          en: 'Before the big architectures, the book names three building blocks that recur inside all of them. First, shared data: one central store holds the authoritative truth, and independent accessors read and write through it without talking to each other directly — like a compiler symbol table, written by the parser and read by the type checker. Second, observer: the state holder does not know who cares about its state; interested parties subscribe, and on change it notifies them all through one uniform update operation — the dependency inverts, and a new interested party can appear without editing the holder. Third, the stable interface: a clear contract hiding what is behind it, so implementations can be swapped without disturbing callers — the idea powering layers and servers alike. Master these three as reusable structural roles and the big patterns become recombinations of ideas you already know.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مشيَة طلب عبر ثلاث طبقات', en: 'A request walk through three layers' },
      code: '# three layers, one request, dependencies point DOWN only\ndef data_layer(query):\n    rows = {"appts": 3}          # the store (shared data lives here)\n    return "data->rows=" + str(rows[query])\n\ndef logic_layer(query):\n    return "logic->" + data_layer(query)   # uses the layer below\n\ndef ui_layer(query):\n    return "ui->" + logic_layer(query)     # uses the layer below\n\nprint(ui_layer("appts"))\n',
      explanation: {
        ar: 'كل دالة طبقة مستقلة بغرض واحد. ui لا تعرف شيئًا عن المخزن؛ logic تترجم الطلب؛ data تحمل الحالة المشتركة وتعيد النتيجة. لاحظ كيف تختم كل طبقة اسمها على الطريق نزولًا: الناتج ui->logic->data->rows=3 يوثق مسار الاعتماديات. جرّب أن تستبدل تنفيذ data_layer بمخزن آخر بنفس الواجهة — الطبقتان العليا لن تتغيرا حرفًا. هذه هي قابلية الاستبدال (substitutability) التي اشتريتها بالطبقات.',
        en: 'Each function is one layer with one job. ui knows nothing about the store; logic translates the request; data owns the shared state and returns the result. Notice how each layer stamps its name on the way down: the output ui->logic->data->rows=3 documents the dependency path. Swap the implementation of data_layer for another store with the same interface — the two upper layers change by zero characters. That is the substitutability you bought with layering.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.layer-walk',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل سلسلة الطبقات لعيادتك: اجعل logic_layer تستدعي data_layer، وui_layer تستدعي logic_layer، بحيث يطبع البرنامج ui->logic->data->rows=3 تمامًا. ثم تأكد أن logic_layer("bills") تعيد logic->data->rows=5.',
        en: 'Complete the layer chain for your clinic: make logic_layer call data_layer, and ui_layer call logic_layer, so the program prints ui->logic->data->rows=3 exactly. Also verify that logic_layer("bills") returns logic->data->rows=5.',
      },
      starterCode: 'def data_layer(query):\n    rows = {"appts": 3, "bills": 5}\n    return "data->rows=" + str(rows[query])\n\ndef logic_layer(query):\n    return "logic->" + "???"      # TODO: call the layer BELOW instead of "???"\n\ndef ui_layer(query):\n    return "ui->" + "???"         # TODO: call the layer BELOW instead of "???"\n\nprint(ui_layer("appts"))\n',
      solution: 'def data_layer(query):\n    rows = {"appts": 3, "bills": 5}\n    return "data->rows=" + str(rows[query])\n\ndef logic_layer(query):\n    return "logic->" + data_layer(query)\n\ndef ui_layer(query):\n    return "ui->" + logic_layer(query)\n\nprint(ui_layer("appts"))\n',
      tests: [
        {
          id: 'walk-output',
          name: { ar: 'مسار الطلب كامل عبر الطبقات', en: 'full walk output through the layers' },
          code: "assert 'ui->logic->data->rows=3' in __learner_output__, 'expected: ui->logic->data->rows=3 | actual: %r' % __learner_output__",
        },
        {
          id: 'logic-layer-direct',
          name: { ar: 'الطبقة الوسطى تعمل وحدها', en: 'middle layer works on its own' },
          code: "assert logic_layer(\"bills\") == 'logic->data->rows=5', 'expected: logic->data->rows=5 | actual: %r' % logic_layer(\"bills\")",
        },
      ],
      hints: [
        { ar: 'الطبقة الوسطى لا تعرف شيئًا عن ui ولا عن تفاصيل المخزن — تعرف فقط الدالة التي تحتها.', en: 'The middle layer knows nothing about ui or store details — only about the function below it.' },
        { ar: 'الاعتماد يتجه لأسفل فقط: كل طبقة تضيف بادئتها ثم تفوض للطبقة الأدنى.', en: 'Dependencies go downward only: each layer adds its own prefix then delegates downward.' },
        { ar: "هيكل السطر داخل logic_layer: return 'logic->' + data_layer(query) — وكرر النمط في ui_layer.", en: "The line shape inside logic_layer: return 'logic->' + data_layer(query) — repeat the pattern in ui_layer." },
        { ar: "الحل الكامل: logic_layer تعيد 'logic->' + data_layer(query)، وui_layer تعيد 'ui->' + logic_layer(query). لا شيء غير ذلك.", en: "Full solution: logic_layer returns 'logic->' + data_layer(query), and ui_layer returns 'ui->' + logic_layer(query). Nothing else." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-layers',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود بعين مهندس طبقات: ما المخرجات المطبوعة بالضبط؟ اكتبها سطرًا سطرًا.',
        en: 'Read the code with a layer engineer eye: what exactly is printed? Write it line by line.',
      },
      code: 'def bottom(k):\n    return "B=" + k\ndef middle(k):\n    return "M(" + bottom(k) + ")"\ndef top(k):\n    return "T(" + middle(k) + ")"\nprint(top("x"))\nprint(middle("y"))\n',
      answer: 'T(M(B=x))\nM(B=y)',
      solution: 'T(M(B=x))\nM(B=y)',
      hints: [
        { ar: 'top تستدعي middle، وmiddle تستدعي bottom — نفس الالتفاف الذي شاهدته في الدرس.', en: 'top calls middle, middle calls bottom — the same wrapping you saw in the lesson.' },
        { ar: 'كل مستوى يضيف غلافه حول نتيجة المستوى الأدنى قبل إعادته.', en: 'Each level wraps its own coat around the result of the level below before returning.' },
        { ar: "السطر الأول: T(M(B=x)). طبق التفكيك نفسه على middle(\"y\") بدون top.", en: 'First line: T(M(B=x)). Apply the same unwrapping to middle("y") without top.' },
        { ar: 'الناتج سطران: T(M(B=x)) ثم M(B=y).', en: 'The output is two lines: T(M(B=x)) then M(B=y).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-strict',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'فريقك يتوقع تبديل مزود الدفع ومخازن البيانات مرارًا هذا العام. أي قرار طبقات يناسبه، وبأي ثمن؟',
        en: 'Your team expects to swap the payment provider and the data stores repeatedly this year. Which layering decision fits, and at what price?',
      },
      options: [
        { id: 'a', text: { ar: 'طبقات مرنة (relaxed): أسرع دائمًا وبلا عيوب تذكر', en: 'Relaxed layers: always faster, with no real drawbacks' } },
        { id: 'b', text: { ar: 'طبقات صارمة (strict): تعزل التغيير أكثر، والثمن ضريبة العبور عبر كل مستوى', en: 'Strict layers: isolate change better, and the price is the pass-through tax at every level' } },
        { id: 'c', text: { ar: 'بدون طبقات: الاتصال المباشر أسرع في الاختبارات', en: 'No layers at all: direct calls are faster in tests' } },
        { id: 'd', text: { ar: 'صارمة أعلى النظام ومرنة أسفله دون معيار واضح', en: 'Strict on top of the system and relaxed below, with no clear criterion' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل أولًا: أي التغييرات متوقعة كثيرًا هذا العام؟', en: 'Ask first: which changes are expected often this year?' },
        { ar: 'الصرامة تشتري عزل التغيير: استبدال ما تحت المكدس دون أن يشعر ما فوقه.', en: 'Strictness buys change isolation: swap what is under the stack without the top noticing.' },
        { ar: 'الثمن المسمى في الدرس هو pass-through: تمرير البيانات عبر كل مستوى دون تحويلها.', en: 'The named price in the lesson is pass-through: threading data through every level without transforming it.' },
        { ar: 'الإجابة الصحيحة: الصارمة — لأن الاستبدال المتكرر يستحق ضريبة العبور.', en: 'The right answer: strict — repeated swapping justifies the pass-through tax.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-interface',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'استبدال مخزن حقيقي بمخزن في الذاكرة داخل الاختبارات ممكن لأن كل طبقة تعتمد على ______ الطبقة التي تحتها لا على تفاصيل تنفيذها. اكتب المصطلح الإنجليزي كلمة واحدة.',
        en: 'Swapping a real store for an in-memory store in tests is possible because each layer depends on the ______ of the layer below, not on its implementation details. Write the English term, one word.',
      },
      answer: 'interface',
      solution: 'interface',
      hints: [
        { ar: 'ما الذي يسمح بالاستبدال رغم اختلاف التنفيذ تمامًا؟', en: 'What makes swapping possible even though the implementation differs completely?' },
        { ar: 'الفصل 6 والدرس الحالي يقولان الشيء نفسه: العقد الظاهر للأعلى هو المهم.', en: 'Chapter 6 and this lesson say the same thing: the contract exposed upward is what matters.' },
        { ar: 'كلمة إنجليزية واحدة تبدأ بحرف i.', en: 'One English word starting with i.' },
        { ar: 'interface — مجموعة العمليات المكشوفة للأعلى.', en: 'interface — the set of operations exposed upward.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: 'def data_layer(query):\n    # try swapping this store: same interface, different implementation\n    rows = {"appts": 3}\n    return "data->rows=" + str(rows[query])\n\ndef logic_layer(query):\n    return "logic->" + data_layer(query)\n\ndef ui_layer(query):\n    return "ui->" + logic_layer(query)\n\nprint(ui_layer("appts"))\n# experiment: make data_layer read from a different store and rerun.\n# ui_layer and logic_layer should not change at all. Then insert a\n# cache layer between them returning "cache->" + data_layer(query).\n',
      prompt: {
        ar: 'استبدل تنفيذ data_layer (مثلًا اجعل rows تأتي من مخزن وهمي آخر) وأعد التشغيل: يجب ألا يتغير شيء في الطبقتين العليا. ثم أضف طبقة cache رابعة بين logic وdata تطبع بادئتها ولاحظ الناتج.',
        en: 'Swap the implementation of data_layer (for example make rows come from a different fake store) and rerun: the two upper layers must not change at all. Then insert a fourth cache layer between logic and data that prints its own prefix, and watch the output.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1.direction',
          question: { ar: 'في النمط الطبقي: من تخدم الطبقة، وعلى من تعتمد؟', en: 'In the layered pattern: whom does a layer serve, and whom does it depend on?' },
          options: [
            { id: 'a', text: { ar: 'تخدم من تحتها وتعتمد على من فوقها', en: 'It serves the layer below and depends on the layer above' } },
            { id: 'b', text: { ar: 'تخدم الطبقة التي فوقها وتعتمد على التي تحتها', en: 'It serves the layer above and depends on the layer below' } },
            { id: 'c', text: { ar: 'تخدم جميع الطبقات دون استثناء', en: 'It serves all layers without exception' } },
            { id: 'd', text: { ar: 'لا تخدم أحدًا، فقط تخفي تفاصيلها', en: 'It serves nobody; it only hides its details' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الاتجاه واحد: خدمات صاعدة واعتماد نازل. هذا ما يجعل استبدال السفلى ممكنًا دون تحريك العليا.',
            en: 'One direction only: services flow up, dependencies point down. That is what lets you swap the lower layer without moving the upper one.',
          },
        },
        {
          id: 'q2.passthrough',
          question: { ar: 'ما ضريبة العبور (pass-through tax) في الطبقات الصارمة؟', en: 'What is the pass-through tax in strict layering?' },
          options: [
            { id: 'a', text: { ar: 'كلفة استئجار خوادم إضافية لكل طبقة', en: 'The cost of renting extra servers for each layer' } },
            { id: 'b', text: { ar: 'حقل يدخل من الأعلى يمر عبر كل الطبقات دون تحويل، فتعديل واحد يمس عدة ملفات', en: 'A field entered at the top is threaded through every layer untransformed, so one change touches several files' } },
            { id: 'c', text: { ar: 'بطء الشبكة بين الطبقات الموزعة', en: 'Network slowness between distributed layers' } },
            { id: 'd', text: { ar: 'ازدواجية أسماء الدوال بين الطبقات المتجاورة', en: 'Duplicate function names across adjacent layers' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'عندما تكتفي الطبقات بإعادة الإرسال، لا تشتري الطبقات عزلًا يذكر بل تدفع تعديلًا في كل مستوى عند كل تغيير.',
            en: 'When layers mostly forward data untransformed, layering buys little isolation while charging an edit in every level per change.',
          },
        },
        {
          id: 'q3.shareddata',
          question: { ar: 'في نمط shared data: كيف تتواصل الوحدات المستقلة (accessors)؟', en: 'In the shared-data pattern: how do the independent accessors communicate?' },
          options: [
            { id: 'a', text: { ar: 'استدعاء مباشر فيما بينها', en: 'Direct calls among themselves' } },
            { id: 'b', text: { ar: 'عبر المخزن المركزي المشترك وحده', en: 'Through the single central shared store only' } },
            { id: 'c', text: { ar: 'عبر قناة observer واحدة يديرها المخزن', en: 'Through one observer channel managed by the store' } },
            { id: 'd', text: { ar: 'لا تتواصل أبدًا بحكم التعريف', en: 'They never communicate, by definition' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'معرفتها المشتركة الوحيدة هي مخطط المخزن وواجهته، لذا تستطيع إضافة accessor جديد دون لمس الباقي. وخطر النمط نفسه: المخزن مغناطيس ترابط وعنق زجاجة ونقطة فشل محتملة.',
            en: 'Their only shared knowledge is the store schema and interface, so you can add a new accessor without touching the others. The pattern danger: the store becomes a coupling magnet, a bottleneck, and a potential single point of failure.',
          },
        },
        {
          id: 'q4.ch6',
          question: { ar: 'الفصل 6 لخص التنظيم الجيد للوحدات بتماسك عالٍ (high cohesion) وترابط منخفض (low coupling). كيف تحقق الطبقات ذلك على مستوى النظام؟', en: 'Chapter 6 summarized good module organization as high cohesion and low coupling. How do layers achieve this at system scale?' },
          options: [
            { id: 'a', text: { ar: 'بجمع كل الدوال المتشابهة الأسماء في ملف واحد', en: 'By collecting all similarly named functions into one file' } },
            { id: 'b', text: { ar: 'بجعل كل طبقة مستوى تجريد واحدًا وتقييد الاعتماديات بالاتجاه النازل عبر واجهات مستقرة', en: 'By making each layer one level of abstraction and restricting dependencies to the downward direction through stable interfaces' } },
            { id: 'c', text: { ar: 'بحذف الطبقة الوسطى دائمًا لتقليل الاعتماد', en: 'By always deleting the middle layer to reduce coupling' } },
            { id: 'd', text: { ar: 'بنسخ كل طبقة إلى مشروع منفصل', en: 'By copying each layer into a separate project' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الطبقة = وحدات على مستوى تجريد واحد (تماسك)، والاعتماد النازل عبر واجهة مستقرة (ترابط منخفض) — فكرة الفصل 6 مكبرة إلى مستوى النظام بأكمله.',
            en: 'A layer = modules at one level of abstraction (cohesion), with downward-only dependencies through a stable interface (low coupling) — the Chapter 6 idea scaled to the whole system.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'استوردت طبقة العرض مشغل قاعدة البيانات مباشرة «للمرة الواحدة هذه فقط».',
          right: 'أعد تمرير الحاجة عبر طبقة logic إلى واجهة data. اختصار واحد يعيد ربط قمة المكدس بقاعه ويهدم العزل الذي اشتريته بالطبقات.',
          note: { ar: 'الاعتماديات نازلة فقط — الاستثناء الواحد يبطل الضمان كله.', en: 'Downward dependencies only — a single exception voids the whole guarantee.' },
        },
        {
          wrong: 'طبقت الصرامة في كل مكان حتى آخر سطر في النظام.',
          right: 'ارفع الصرامة حيث تتوقع تبديلًا متكررًا فقط؛ إذا كانت طبقاتك تمرر البيانات دون تحويل، فالتراخي أوفر وأوضح.',
          note: { ar: 'الصرامة ليست فضيلة مجانية: ادفع عنها حيث يستحق التغيير وحده.', en: 'Strictness is not a free virtue: pay for it only where change deserves it.' },
        },
        {
          wrong: 'قسمنا النظام طبقات فأصبح جاهزًا للتمدد الأفقي.',
          right: 'الطبقات تشتري عزل التغيير لا التوسع؛ النظام الطبقي الواحد يبقى وحدة نشر واحدة حتى لو رُسم جميلًا.',
          note: { ar: 'لا تخلط بين التنظيم داخل العملية والتوسع عبر الآلات — التوسع يحتاج أنماط الدروس القادمة.', en: 'Do not confuse in-process organization with scaling across machines — scaling needs the patterns of the coming lessons.' },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الطبقة مجموعة وحدات على مستوى تجريد واحد: تخدم من فوقها وتعتمد على من تحتها، والاعتماديات نازلة فقط.', en: 'A layer is modules at one abstraction level: it serves the one above, uses the one below, dependencies point down only.' },
        { ar: 'الصارم يعزل أكثر ويفرض ضريبة عبور؛ المرن يباشر أكثر ويسمح بتسرب الترابط — اختر حسب التغييرات المتوقعة.', en: 'Strict isolates more but levies the pass-through tax; relaxed is more direct and lets coupling leak — choose by expected change.' },
        { ar: 'اللبنات الثلاث: shared data يحمل حقيقة واحدة، وobserver يقلب اعتمادية التغيير، والواجهة المستقرة تسمح بالاستبدال.', en: 'Three building blocks: shared data holds one truth, observer inverts the change dependency, the stable interface enables substitution.' },
        { ar: 'قابلية الاستبدال هي الثمرة: بدل التنفيذ خلف الواجهة ولا يتحرك من فوقها حرف.', en: 'Substitutability is the fruit: swap the implementation behind the interface and nothing above moves by a character.' },
      ],
      reflectPrompt: {
        ar: 'أين تنتهي طبقة العرض وتبدأ طبقة العمل في مشروعك الحالي؟ اكتب الحد الفاصل بجملة واحدة، ثم اكتب اعتمادية واحدة موجودة اليوم تخالف اتجاه الطبقات.',
        en: 'Where does the presentation layer end and the work layer begin in your current project? Write the boundary in one sentence, then name one existing dependency that violates the layer direction.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch7.s1', pages: 'ص175-177 / pp.175-177' },
        { book: 'SWE', section: 'swe.ch7.s2', pages: 'ص177-181 / pp.177-181' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch7.s1', pages: 'ص175-177 / pp.175-177' },
    { book: 'SWE', section: 'swe.ch7.s2', pages: 'ص177-181 / pp.177-181' },
  ],
} satisfies Lesson;

export default lesson;
