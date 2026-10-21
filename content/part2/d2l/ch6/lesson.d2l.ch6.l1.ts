import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch6.l1 — "Modules and Parameter Management: The Builders' Toolbox"
 * الوحدات وإدارة المعاملات: صندوق أدوات البنّاء
 * Aligned with D2L ch6 s1 (Layers and Modules) + s2 (Parameter Management).
 * All expression is original — a paraphrase of the source's ideas, never a
 * verbatim translation. Runnable design: a plain-Python Module class tree
 * (Linear / ReLU / MySequential with params as lists), a parameter census,
 * and a tied-parameters demo where the same object is used twice.
 * Every literal verified under CPython 3. Deterministic only: no input(),
 * no exit(), no unittest.main, no seeding needed.
 */
const lesson = {
  id: 'd2l.ch6.l1',
  version: 1,
  part: 'II',
  track: 'A3',
  book: 'D2L',
  chapter: 6,
  title: {
    ar: 'الوحدات وإدارة المعاملات: صندوق أدوات البنّاء',
    en: 'Modules and Parameter Management: The Builders\u2019 Toolbox',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch5.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الشبكات الحديثة مثل ResNet-152 تضم مئات الطبقات المرتبة في أنماط متكررة، ولن يخطر ببال أحد كتابتها طبقةً طبقة. سرّ المكتبات العميقة هو تجريد الوحدة module: صنف برمجي قد يكون طبقة واحدة أو كتلة من طبقات أو النموذج كله، وتُركَّب الوحدات داخل وحدات أكبر. في هذا الدرس ستبني شجرة وحدات بلغة بايثون الصرفة، وتتعلم جرد المعاملات والمعاملات المشتركة tied parameters — الأساس الذي ستقف عليه كل فصول البناء القادمة.',
        en: 'Modern networks like ResNet-152 hold hundreds of layers arranged in repeating patterns, and nobody writes them layer by layer. The secret of deep libraries is the module abstraction: a class that may be a single layer, a block of layers, or the whole model — and modules compose into larger modules. In this lesson you will build a module tree in plain Python, then learn parameter censuses and tied parameters — the foundation every upcoming builders\u2019 chapter stands on.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الوحدة: طبقة أو كتلة أو نموذج', en: 'The module: layer, block, or model' },
      chunks: [
        {
          ar: 'الطبقة والنموذج يتشاركان العقد نفسه: يأخذان مدخلات، يولدان مخرجات، ويحملان معاملات قابلة للتعديل. لذلك صار من الطبيعي تعريف وحدة module تشمل الثلاثة: طبقة، أو مجموعة طبقات، أو النموذج بأكمله — وتُجمَّع الوحدات بشكل تكراري لتصنع نماذج ضخمة بشيفرة قصيرة. في الكتاب: `nn.Sequential` تسلسل الوحدات بترتيب إضافتها، و`nn.Module` هو الأب الذي يوفر التهيئة والانتشار العكسي تلقائيًا؛ فكل ما نكتبه هو المُنشئ وطريقة forward. بعض الوحدات تحسب بأشياء ثابتة لا تُدرَّب (معامل ثابت constant)، وبعضها بلا معاملات أصلًا.',
          en: 'A layer and a model share the same contract: they take inputs, produce outputs, and hold tunable parameters. So it became natural to define a module covering all three: a layer, a group of layers, or the entire model — and modules compose recursively into huge networks with tiny code. In the book: `nn.Sequential` chains modules in the order they were added, and `nn.Module` is the parent class supplying initialization and backpropagation automatically; you only write the constructor and the forward method. Some modules compute with fixed values that never train (a constant parameter), and some hold no parameters at all.',
        },
        {
          ar: 'إدارة المعاملات تخدم ثلاثة أغراض: الفحص والتشخيص، والمشاركة بين المكونات، والحفظ لاحقًا. في `nn.Sequential` نصل إلى أي طبقة بالفهرسة ثم `state_dict()` لرؤية أوزانها وانحيازاتها؛ و`named_parameters()` يعطي جردًا كاملًا بالأسماء والأشكال. أجمل فكرة هنا هي ربط المعاملات tied parameters: نمرر الكائن نفسه أكثر من مرة، فلا تكون الطبقتان متساويتي القيمة فقط بل هما الشيء نفسه — وتغيير أحدهما يغير الآخر، وتدرجات الاستخدامين تُجمع معًا أثناء backpropagation. المشاركة تقلل المعاملات وتفرض نمطًا معماريًا مقصودًا.',
          en: 'Parameter management serves three purposes: inspection and diagnostics, sharing across components, and saving for later. In `nn.Sequential` you index into the model like a list, call `state_dict()` to see a layer\u2019s weights and biases, and use `named_parameters()` for a full census with names and shapes. The most elegant idea here is tied parameters: pass the very same object twice, so the two layers are not merely equal in value — they are the same thing. Changing one changes the other, and the gradients of both uses are added together during backpropagation. Sharing cuts parameters and encodes a deliberate architectural pattern.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'شجرة وحدات مصغرة + جرد المعاملات',
        en: 'A miniature module tree + a parameter census',
      },
      code: "class Module:\n    def modules(self):\n        found = []\n        for v in self.__dict__.values():\n            if isinstance(v, Module):\n                found.append(v)\n                found.extend(v.modules())\n            elif isinstance(v, list):\n                for u in v:\n                    if isinstance(u, Module):\n                        found.append(u)\n                        found.extend(u.modules())\n        return found\n\n    def param_shapes(self):\n        out = {}\n        for m in self.modules():\n            if hasattr(m, 'w'):\n                out[m.label + '.w'] = (len(m.w), len(m.w[0]))\n                out[m.label + '.b'] = (len(m.b),)\n        return out\n\nclass Linear(Module):\n    def __init__(self, label, nin, nout, w, b):\n        self.label, self.nin, self.nout = label, nin, nout\n        self.w, self.b = w, b\n\n    def forward(self, x):\n        return [sum(self.w[r][k] * x[k] for k in range(self.nin)) + self.b[r]\n                for r in range(self.nout)]\n\nclass ReLU(Module):\n    def forward(self, x):\n        return [v if v > 0 else 0.0 for v in x]\n\nclass MySequential(Module):\n    def __init__(self, *layers):\n        self.layers = list(layers)\n\n    def forward(self, x):\n        for layer in self.layers:\n            x = layer.forward(x)\n        return x\n\nh = Linear('h', 4, 3, [[1.0, 0.0, -1.0, 0.5],\n                       [0.5, 1.0, 0.0, -0.5],\n                       [-0.25, 0.25, 1.0, 0.0]], [0.1, -0.2, 0.0])\no = Linear('o', 3, 1, [[1.0, -1.0, 2.0]], [0.5])\nnet = MySequential(h, ReLU(), o)\nprint('net(x):', [round(v, 4) for v in net.forward([1.0, 2.0, 0.0, -1.0])])\nprint('census:', net.param_shapes())\nprint('total numbers:', sum(len(r) for r in h.w) + len(h.b) + sum(len(r) for r in o.w) + len(o.b))\n\nshared = Linear('s', 2, 2, [[1.0, 0.0], [0.0, 1.0]], [0.0, 0.0])\ntied = MySequential(shared, ReLU(), shared, ReLU())\nprint('same object:', tied.layers[0] is tied.layers[2])\nprint('tied census:', tied.param_shapes())\nprint('tied forward:', [round(v, 4) for v in tied.forward([2.0, -1.0])])",
      explanation: {
        ar: 'MySequential تسلسل الطبقات بترتيبها مثل `nn.Sequential` تمامًا: h ثم ReLU ثم o. المدخل [1, 2, 0, -1] يعطي تمثيلًا خفيًا [0.6, 2.8, 0.25] ثم خرجًا واحدًا -1.2. الجرد يحصي كل معامل بالاسم والشكل: h.w (3,4) وh.b (3,) وo.w (1,3) وo.b (1,) — أي 19 رقمًا قابلًا للتدريب. أما الوحدة المربوطة فتمرر الكائن shared مرتين: is يثبت أنهما الشيء نفسه، والجرد يحصي معاملاته مرة واحدة فقط (4 + 2 = 6) رغم الاستخدامين — هكذا تعمل المعاملات المشتركة في الكتاب.',
        en: 'MySequential chains layers in order exactly like `nn.Sequential`: h, then ReLU, then o. The input [1, 2, 0, -1] yields the hidden representation [0.6, 2.8, 0.25] and a single output -1.2. The census counts every parameter by name and shape: h.w (3,4), h.b (3,), o.w (1,3), o.b (1,) — 19 trainable numbers in total. The tied module passes the same shared object twice: is proves they are one object, and the census counts its parameters exactly once (4 + 2 = 6) despite the two uses — precisely how the book\u2019s shared parameters behave.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.module-tree-census',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل صنف MySequential (خزّن الطبقات في __init__ وسلسل forward بترتيبها) ثم اكتب count_params(net) تمشي في شجرة الوحدات (بما فيها القوائم) وتعيد مجموع الأرقام القابلة للتدريب: قيم w زائد قيم b، مع عدّ كل وحدة مرة واحدة فقط حتى لو استُخدمت في موضعين (ربط معاملات).',
        en: 'Complete MySequential (store the layers in __init__ and chain forward in order), then write count_params(net) that walks the module tree (including lists) and returns the total trainable numbers: w entries plus b entries, counting each module only once even when it is used in two slots (tied parameters).',
      },
      starterCode: "class Module:\n    def modules(self):\n        found = []\n        for v in self.__dict__.values():\n            if isinstance(v, Module):\n                found.append(v)\n                found.extend(v.modules())\n            elif isinstance(v, list):\n                for u in v:\n                    if isinstance(u, Module):\n                        found.append(u)\n                        found.extend(u.modules())\n        return found\n\nclass Linear(Module):\n    def __init__(self, label, nin, nout, w, b):\n        self.label, self.nin, self.nout = label, nin, nout\n        self.w, self.b = w, b\n    def forward(self, x):\n        return [sum(self.w[r][k] * x[k] for k in range(self.nin)) + self.b[r]\n                for r in range(self.nout)]\n\nclass ReLU(Module):\n    def forward(self, x):\n        return [v if v > 0 else 0.0 for v in x]\n\nclass MySequential(Module):\n    def __init__(self, *layers):\n        ...  # TODO: store the layers\n\n    def forward(self, x):\n        ...  # TODO: chain layer.forward in order\n\ndef count_params(net):\n    ...  # TODO: walk the tree, count w + b numbers, tied modules once\n",
      solution: "class Module:\n    def modules(self):\n        found = []\n        for v in self.__dict__.values():\n            if isinstance(v, Module):\n                found.append(v)\n                found.extend(v.modules())\n            elif isinstance(v, list):\n                for u in v:\n                    if isinstance(u, Module):\n                        found.append(u)\n                        found.extend(u.modules())\n        return found\n\nclass Linear(Module):\n    def __init__(self, label, nin, nout, w, b):\n        self.label, self.nin, self.nout = label, nin, nout\n        self.w, self.b = w, b\n    def forward(self, x):\n        return [sum(self.w[r][k] * x[k] for k in range(self.nin)) + self.b[r]\n                for r in range(self.nout)]\n\nclass ReLU(Module):\n    def forward(self, x):\n        return [v if v > 0 else 0.0 for v in x]\n\nclass MySequential(Module):\n    def __init__(self, *layers):\n        self.layers = list(layers)\n\n    def forward(self, x):\n        for layer in self.layers:\n            x = layer.forward(x)\n        return x\n\ndef count_params(net):\n    total = 0\n    seen = set()\n    def walk(v):\n        nonlocal total\n        if isinstance(v, list):\n            for u in v:\n                walk(u)\n        elif isinstance(v, dict):\n            for u in v.values():\n                walk(u)\n        elif isinstance(v, Module):\n            if id(v) not in seen:\n                seen.add(id(v))\n                if hasattr(v, 'w'):\n                    total += sum(len(r) for r in v.w) + len(v.b)\n                walk(v.__dict__)\n    walk(net)\n    return total",
      tests: [
        {
          id: 't1',
          name: { ar: 'جرد الشبكة الصغيرة: 19 رقمًا وخرج -1.2', en: 'Small net census: 19 numbers, output -1.2' },
          code: "h = Linear('h', 4, 3, [[1.0, 0.0, -1.0, 0.5], [0.5, 1.0, 0.0, -0.5], [-0.25, 0.25, 1.0, 0.0]], [0.1, -0.2, 0.0])\no = Linear('o', 3, 1, [[1.0, -1.0, 2.0]], [0.5])\nnet = MySequential(h, ReLU(), o)\nassert count_params(net) == 19, 'expected 19 | actual: %r' % count_params(net)\nassert [round(v, 4) for v in net.forward([1.0, 2.0, 0.0, -1.0])] == [-1.2], 'expected [-1.2] | actual: %r' % net.forward([1.0, 2.0, 0.0, -1.0])",
          expected: 'count 19, forward [-1.2]',
        },
        {
          id: 't2',
          name: { ar: 'المربوطة تُحصى مرة واحدة: 6', en: 'Tied layers count once: 6' },
          code: "shared = Linear('s', 2, 2, [[1.0, 0.0], [0.0, 1.0]], [0.0, 0.0])\ntied = MySequential(shared, ReLU(), shared, ReLU())\nassert tied.layers[0] is tied.layers[2], 'the two uses must be the same object'\nassert count_params(tied) == 6, 'expected 6 (tied counted once) | actual: %r' % count_params(tied)",
          expected: 'tied counted once -> 6',
        },
        {
          id: 't3',
          name: { ar: 'طبقتان مستقلتان بالقيم نفسها: 12', en: 'Two independent equal-valued layers: 12' },
          code: "untied = MySequential(Linear('a', 2, 2, [[1.0, 0.0], [0.0, 1.0]], [0.0, 0.0]), ReLU(),\n                      Linear('b', 2, 2, [[1.0, 0.0], [0.0, 1.0]], [0.0, 0.0]), ReLU())\nassert count_params(untied) == 12, 'expected 12 | actual: %r' % count_params(untied)",
          expected: 'untied twins -> 12',
        },
      ],
      hints: [
        { ar: 'في __init__ خزّن self.layers = list(layers)؛ وفي forward مرّ على self.layers ومرر x إلى layer.forward واحدًا بعد الآخر.', en: 'In __init__ store self.layers = list(layers); in forward loop over self.layers and pass x through layer.forward one at a time.' },
        { ar: 'في count_params استخدم walk(v) تتعامل مع list (كرر على العناصر) وdict (كرر على values) وModule (عالجها مرة).', en: 'In count_params use walk(v) that handles list (recurse over items), dict (recurse over values), and Module (process it once).' },
        { ar: 'العدّ مرة واحدة: سجّل id(v) في مجموعة seen؛ إن كان موجودًا فتجاهل الوحدة حتى لو ظهرت ثانية.', en: 'Counting once: record id(v) in a seen set; if already there, skip the module even if it appears again.' },
        { ar: 'حصة كل طبقة خطية: sum(len(r) for r in v.w) + len(v.b) — وReLU بلا معاملات فلا تضيف شيئًا.', en: 'Per linear layer: sum(len(r) for r in v.w) + len(v.b) — ReLU has no parameters and adds nothing.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-tied-params',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'مررنا الوحدة نفسها (معاملات مربوطة) في موضعين من الشبكة. ماذا يحدث لتدرجاتها أثناء backpropagation؟',
        en: 'We passed the very same module (tied parameters) in two slots of the network. What happens to its gradients during backpropagation?',
      },
      options: [
        { id: 'a', text: { ar: 'يُستخدم تدرج الاستخدام الأول ويُهمَل الثاني', en: 'The first use\u2019s gradient is kept and the second is discarded' } },
        { id: 'b', text: { ar: 'تُجمع تدرجات الاستخدامين معًا ثم تُحدَّث المعاملات المشتركة', en: 'The gradients of both uses are added together, then the shared parameters update' } },
        { id: 'c', text: { ar: 'يُنسخ الكائن إلى طبقتين مستقلتين قبل التحديث', en: 'The object is copied into two independent layers before the update' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'الربط ليس تساوي قيم فقط — هما كائن واحد في الذاكرة (is يعيد True).', en: 'Tying is not just equal values — there is one object in memory (is returns True).' },
        { ar: 'لكل استخدام مساهمة في الخسارة، وكل مساهمة تحتاج تدرجًا بالنسبة للمعاملات نفسها.', en: 'Each use contributes to the loss, and every contribution needs a gradient with respect to the same parameters.' },
        { ar: 'القاعدة: تدرجات المعاملات المشتركة تُجمع (accumulate) من كل مواضع الاستخدام.', en: 'The rule: gradients of shared parameters accumulate from every place they are used.' },
        { ar: 'الجواب: b — وهذا سبب فائدة الربط: نمط معماري مقصود بعدد معاملات أقل.', en: 'Answer: b — and that is why tying is useful: a deliberate pattern with fewer parameters.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def forward(x, w, b):\n    return [sum(w[r][k] * x[k] for k in range(len(x))) + b[r] for r in range(len(w))]\n\nh_w = [[0.1, 0.2, 0.3, 0.4], [0.5, 0.6, 0.7, 0.8], [-0.1, -0.2, -0.3, -0.4]]\nh_b = [0.0, 0.1, 0.2]\no_w = [[1.0, -1.0, 1.0]]\no_b = [0.0]\nfor xv in [[1.0, 0.0, 0.0, 0.0], [1.0, 1.0, 1.0, 1.0]]:\n    hid = forward(xv, h_w, h_b)\n    hid = [v if v > 0 else 0.0 for v in hid]\n    print('x =', xv, '-> hidden:', [round(v, 4) for v in hid], '-> out:', [round(v, 4) for v in forward(hid, o_w, o_b)])\n# جرّب: احسب يدويًا حصة كل طبقة: h فيها 3*4+3 أرقام، وo فيها 1*3+1 — هل المجموع 19؟\n# try: count each layer's share by hand: h holds 3*4+3 numbers, o holds 1*3+1 — is the total 19?\n# جرّب: مرر h_w مرتين في شبكة افتراضية (ربط) — كم معاملًا سيحصيها الجرد مقارنة بنسخة غير مربوطة؟\n# try: pass h_w twice through an imagined network (tying) — how many numbers would a census count vs an untied twin?\n",
      prompt: {
        ar: 'الملعب يحاكي forward لشبكة صغيرة بطبقتين خطيتين وReLU بينهما: شاهد التمثيل الخفي والخرج لمدخلين مختلفين، ثم جرّب حسبة الجرد والربط.',
        en: 'The sandbox simulates the forward pass of a small two-linear network with a ReLU in between: watch the hidden representation and output for two inputs, then try the census arithmetic and tying.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الذي يمكن أن تكونه الوحدة module في معمارية التعلم العميق؟',
            en: 'What can a module be in a deep learning architecture?',
          },
          options: [
            { id: 'a', text: { ar: 'طبقة واحدة فقط', en: 'A single layer only' } },
            { id: 'b', text: { ar: 'طبقة، أو كتلة من طبقات، أو النموذج بأكمله — وتتركب تكراريًا', en: 'A layer, a block of layers, or the whole model — composed recursively' } },
            { id: 'c', text: { ar: 'دالة تنشيط فقط', en: 'An activation function only' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الوحدة تجريد موحّد: طبقة أو مكون من عدة طبقات أو النموذج كله، وتتجمع داخل وحدات أكبر بشكل تكراري — لهذا تكتب ResNet-152 بشيفرة قصيرة.',
            en: 'A module is one uniform abstraction: a layer, a multi-layer component, or the entire model, nested inside larger modules — which is why ResNet-152 fits in short code.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'شبكة MLP بأحجام 4 → 8 → 1: كم رقمًا قابلًا للتدريب فيها؟',
            en: 'An MLP with sizes 4 → 8 → 1: how many trainable numbers does it hold?',
          },
          options: [
            { id: 'a', text: { ar: '40', en: '40' } },
            { id: 'b', text: { ar: '49', en: '49' } },
            { id: 'c', text: { ar: '13', en: '13' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الطبقة الأولى 8×4 أوزان + 8 انحيازات = 40، والثانية 8×1 + 1 = 9، والمجموع 49. جرّب count_params من التمرين على الشبكة نفسها.',
            en: 'The first layer: 8\u00d74 weights + 8 biases = 40; the second: 8\u00d71 + 1 = 9; total 49. Try count_params from the exercise on the same network.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا نشارك معاملات (ربط) بين طبقتين بدلًا من إنشاء طبقتين مستقلتين؟',
            en: 'Why tie parameters across two layers instead of creating two independent ones?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن النسخ أسرع في التدريب', en: 'Because copying trains faster' } },
            { id: 'b', text: { ar: 'لأن بايثون لا يسمح بنسخ المصفوفات', en: 'Because Python forbids copying matrices' } },
            { id: 'c', text: { ar: 'لأنها تقلل المعاملات وتفرض نمطًا معماريًا مقصودًا', en: 'It reduces parameters and encodes a deliberate architectural pattern' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'المشاركة تعني كائنًا واحدًا يُحصى مرة واحدة، وتدرجات كل المواضع تُجمع — نمط يقلل الحجم ويفرض تناظرًا مقصودًا (كما في نماذج اللغة والالتفافات).',
            en: 'Sharing means one object counted once, with gradients from all uses summed — a pattern that cuts size and imposes intentional symmetry (as in language and convolutional models).',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الوحدة تجريد يشمل الطبقة والكتلة والنموذج وتتركب تكراريًا؛ وSequential يكفي للتسلسل البسيط بينما الصنف المخصص يضيف تحكمًا كاملًا (الهدف من s1 الطبقات والوحدات).', en: 'A module is an abstraction covering layer, block, and model, composed recursively; Sequential suffices for plain chains while a custom class adds full control (goal of s1 Layers and Modules).' },
        { ar: 'إدارة المعاملات: جرد بالأسماء والأشكال للفحص والتشخيص، وربط المعاملات بتمرير الكائن نفسه فتُجمع تدرجات المواضع كلها (الهدف من s2 إدارة المعاملات).', en: 'Parameter management: a name-and-shape census for inspection and diagnostics, and tying by passing the same object so gradients from all uses sum up (goal of s2 Parameter Management).' },
        { ar: '19 رقمًا لشبكتنا الصغيرة مقابل 6 فقط عند الربط: الحسبة نفسها — co*ci + co لكل طبقة خطية — هي ما يقرر حجم النماذج الضخمة لاحقًا.', en: '19 numbers for our small net vs 6 when tied: the same arithmetic — co*ci + co per linear layer — decides the size of the huge models to come.' },
      ],
      reflectPrompt: {
        ar: 'لو احتجت شبكة تُطبق نفس التحويل على مدخلات متعددة (مثل ترميز سؤال وإجابة)، هل تربط المعاملات أم تنسخها؟ وما الأثر على العدّ والتدريب؟',
        en: 'If you need a network to apply the same transformation to multiple inputs (say, encoding a question and an answer), would you tie the parameters or copy them — and what is the effect on counting and training?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch6.s1' },
        { book: 'D2L', section: 'd2l.ch6.s2' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch6.s1' },
    { book: 'D2L', section: 'd2l.ch6.s2' },
  ],
} satisfies Lesson;

export default lesson;
