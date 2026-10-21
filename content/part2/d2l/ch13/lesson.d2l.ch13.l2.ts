import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch13.l2 — "Many GPUs, One Model: Data Parallelism and Parameter Servers"
 * معالجات كثيرة ونموذج واحد: توازي البيانات وخوادم المعاملات
 * Aligned with D2L ch13 s5 (Training on Multiple GPUs) + s6 (Concise
 * Implementation for Multiple GPUs) + s7 (Parameter Servers). All expression
 * is original — a paraphrase of the source's ideas, never a verbatim
 * translation. Runnable design: allreduce over plain list shards, a fixed
 * batch split, a deterministic synchronization-cost table, and a push/pull
 * parameter-server simulation with dicts. Every literal verified under
 * CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch13.l2',
  version: 1,
  part: 'II',
  track: 'A7',
  book: 'D2L',
  chapter: 13,
  title: {
    ar: 'معالجات كثيرة ونموذج واحد: توازي البيانات وخوادم المعاملات',
    en: 'Many GPUs, One Model: Data Parallelism and Parameter Servers',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch13.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'نموذج يحتاج أسبوعًا على معالج واحد يحتاج ساعات على ثمانية — لكن فقط إذا قسمنا العمل بذكاء. هل نقسم الشبكة نفسها أم البيانات؟ لماذا فاز تقسيم البيانات في العمليّة؟ وكيف تنتقل التدرجات بين الأجهزة بتكلفة تختلف أربعة أضعاف حسب مسار المزامنة وحده؟ هذا الدرس يفتح صندوق أدوات التدريب الموزع: allreduce، وتقسيم الدفعات، وخادم معاملات يدفع ويسحب.',
        en: 'A model that takes a week on one GPU takes hours on eight — but only if the work is split wisely. Do we partition the network itself or the data? Why did data parallelism win in practice? And how do gradients travel between devices at a cost that differs fourfold depending on the synchronization path alone? This lesson opens the distributed-training toolbox: allreduce, batch splitting, and a parameter server that pushes and pulls.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'توازي البيانات والمزامنة وخوادم المعاملات', en: 'Data parallelism, synchronization, and parameter servers' },
      chunks: [
        {
          ar: 'ثلاث طرق لتقسيم التدريب: تقسيم الشبكة عبر الأجهزة (مزامنة حادة ونقل كثيف بين الطبقات)، وتقسيم كل طبقة على قنواتها (حواجز كثيرة)، وتقسيم البيانات. الفائز عمليًا هو توازي البيانات: كل جهاز يحمل نسخة كاملة من المعاملات، تُشطر الدفعة إليها بالتساوي، يحسب كل جهاز خسارته وتدرجه على شطره، ثم تُجمع التدرجات (allreduce) وتُبَث النسخ المحدثة. نضاعف حجم الدفعة بعدد الأجهزة كي يبقى عمل كل جهاز كما كان، وقد نرفع معدل التعلم تبعًا لذلك. وفي الكتاب: `nn.DataParallel` يخفي كل هذا عنك.',
          en: 'Three ways to split training: partition the network across devices (tight synchronization, heavy inter-layer transfer), split each layer across its channels (many barriers), or split the data. The practical winner is data parallelism: every device holds a full copy of the parameters, the batch is split evenly across them, each computes loss and gradient on its shard, then gradients are aggregated (allreduce) and updated copies are broadcast. We grow the batch size by the number of GPUs so each device does the same work as before, and may raise the learning rate accordingly. In the book: `nn.DataParallel` hides all of this from you.',
        },
        {
          ar: 'التطبيق اليدوي يحتاج عمليتين فقط: توزيع المعاملات مع تتبع التدرجات على كل جهاز، وallreduce الذي يجمع المتجهات ويبَث الناتج للجميع — ويمكن محاكاته بقوائم بايثون عادية كما في مثالنا. أما كلفة المزامنة فعلم كامل: على 4 معالجات بتدرج 160MB وناقل 16GB/s، التجمع كله على جهاز واحد يكلف 60ms، والمرور بالمعالج المركزي 80ms، وتقسيم التدرج إلى 4 أجزاء تتزامن بالتوازي 15ms فقط، وحلقة NVLink على 8 معالجات تنزل إلى 6ms تقريبًا: نفس العملية، أربعة أضعاف فرق في الزمن.',
          en: 'A manual implementation needs just two operations: distributing parameters with gradient tracking to every device, and allreduce, which sums the vectors and broadcasts the result to everyone — easy to simulate with plain Python lists as in our example. The synchronization cost is a discipline of its own: on a 4-GPU box with a 160MB gradient over a 16GB/s bus, aggregating everything on one device costs 60ms, routing through the CPU costs 80ms, splitting the gradient into 4 parts synchronized in parallel costs just 15ms, and an NVLink ring over 8 GPUs drops to about 6ms: the same operation, a fourfold difference in time.',
        },
        {
          ar: 'حين نتجاوز جهازًا واحدًا إلى خوادم كاملة يصبح خادم المعاملات هو التجريد الحاكم: عمليتا push وpull فوق مخزن مفاتيح-قيم. push(key, value) يرسل تدرج العامل ليُجمع في المخزن، وpull(key) يسحب الناتج المجمع — والجمع تبديلي فلا يهم ترتيب وصول العمال. خادم واحد يصبح عنق الزجاجة: زمن المزامنة ينمو O(m) مع عدد العمال m؛ نقسم التخزين على n خوادم فيهبط إلى O(m/n)، وعمليًا يُستخدم الجهاز نفسه عاملًا وخادمًا معًا. هذا التجريد يفصل عالم الإحصائي (أريد أن أحدّث المعاملات) عن عالم مهندس الأنظمة (كيف تُجمع هذه التدرجات فعلًا).',
          en: 'Once we leave one box for full servers, the parameter server becomes the governing abstraction: push and pull over a key-value store. push(key, value) sends a worker\u2019s gradient to be aggregated in the store, pull(key) retrieves the aggregate — and since the sum is commutative, arrival order does not matter. A single server becomes the bottleneck: synchronization time grows as O(m) with m workers; spreading storage over n servers cuts it to O(m/n), and in practice the same machines act as both workers and servers. This abstraction separates the statistician\u2019s world (I want to update parameters) from the systems engineer\u2019s (how the gradients actually get summed).',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'allreduce وتقسيم الدفعة وجدول كلفة المزامنة',
        en: 'Allreduce, batch splitting, and the sync-cost table',
      },
      code: "def allreduce(shards):\n    \"\"\"Sum all shards elementwise; every shard is replaced by the total.\"\"\"\n    n, m = len(shards[0]), len(shards[0][0])\n    total = [[sum(shards[k][i][j] for k in range(len(shards)))\n              for j in range(m)] for i in range(n)]\n    return [[[total[i][j] for j in range(m)] for i in range(n)] for _ in shards]\n\nshards = [[[1.0, 1.0]], [[2.0, 2.0]]]      # one row per device\ngot = allreduce(shards)\nprint('before:', shards[0][0], 'and', shards[1][0])\nprint('after :', got[0][0], 'and', got[1][0], '| identical:', got[0] == got[1])\n\ndata = [[5 * i + j for j in range(5)] for i in range(4)]\nsplit = [data[:2], data[2:]]               # 4x5 batch over two devices\nprint('shard rows:', [len(s) for s in split],\n      '| first row:', split[0][0], '| last row:', split[1][-1])\n\n# Sync-cost model: 160 MB gradient, 16 GB/s per PCIe link.\nmb, gbps = 160.0, 16.0\none = mb / 1000 / gbps * 1000              # ms for one full-gradient transfer\nprint('one transfer          : %.6f ms' % one)\nprint('all on gpu0 (6 hops)  : %.6f ms' % (6 * one))\nprint('via cpu    (8 hops)   : %.6f ms' % (8 * one))\nprint('split 4 parts (2x7.5) : %.6f ms' % (2 * 3 * (40 / 1000 / gbps * 1000)))\nprint('ring 8 gpus, nvlink   : %.6f ms' % (2 * mb / 1000 / (3 * 18.0) * 1000))",
      explanation: {
        ar: 'allreduce جمع الأجزاء ثم البث: قبل التنفيذ يحمل الجهازان [1,1] و[2,2]، وبعده كلاهما [3,3] — بالضبط ما يحدث للتدرجات عبر الأجهزة. تقسيم دفعة 4×5 إلى جهازين أعطى شطرين من صفين: الصف الأول [0,1,2,3,4] والصف الأخير [15,16,17,18,19]. وجدول الكلفة: نقل كامل 160MB عبر 16GB/s يكلف 10ms، فالتجميع على جهاز واحد (3 صعود + 3 بث) 60ms، والمرور بالمعالج المركزي (4+4) 80ms، والتقسيم إلى 4 أجزاء 40MB (3 نقل متوازٍ 2.5ms ثم بث) 15ms، وحلقة NVLink بحزمة 18GB/s لكل وصلة 5.925926ms ≈ 6ms كما في الكتاب.',
        en: 'Allreduce sums the shards then broadcasts: before the call the devices hold [1,1] and [2,2]; after, both hold [3,3] — exactly what happens to gradients across devices. Splitting a 4×5 batch over two devices yields two 2-row shards: first row [0,1,2,3,4] and last row [15,16,17,18,19]. The cost table: one 160MB transfer over 16GB/s costs 10ms, so aggregating on one device (3 sends + 3 broadcast) is 60ms, via the CPU (4+4) is 80ms, splitting into 4 parts of 40MB (3 parallel 2.5ms sends + broadcast) is 15ms, and an NVLink ring with 18GB/s per link gives 5.925926ms ≈ 6ms, matching the book.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.param-server-step',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ param_server_step(server, worker_grads, lr) التي تحاكي دورة push/pull كاملة: push — اجمع تدرجات كل العمال (قوائم dicts بنفس المفاتيح) في مُجمّع؛ ثم pull — خذ المتوسط لكل مفتاح (المجموع ÷ عدد العمال، لا المجموع!) وحدّث الخادم بالقاعدة server[k] -= lr * avg[k]. أعِد الخادم المحدَّث.',
        en: 'Implement param_server_step(server, worker_grads, lr) simulating a full push/pull cycle: push — aggregate every worker\u2019s gradient (a list of dicts sharing the same keys) into an accumulator; then pull — take the per-key mean (sum ÷ number of workers, not the sum!) and update the server with server[k] -= lr * avg[k]. Return the updated server.',
      },
      starterCode: "def param_server_step(server, worker_grads, lr):\n    # TODO: push (accumulate), pull (average), then apply the update\n    ...\n",
      solution: "def param_server_step(server, worker_grads, lr):\n    agg = {k: 0.0 for k in server}\n    for g in worker_grads:\n        for k, v in g.items():\n            agg[k] += v\n    n = len(worker_grads)\n    for k in server:\n        server[k] = server[k] - lr * (agg[k] / n)\n    return server",
      tests: [
        {
          id: 't1',
          name: { ar: 'دورة push/pull كاملة بقيم مثبتة', en: 'A full push/pull cycle with verified values' },
          code: "server = {'w': 3.0, 'b': 2.0}\ngrads = [{'w': 0.5, 'b': -1.0}, {'w': 1.5, 'b': 0.0}]\nout = param_server_step(server, grads, 0.1)\nassert abs(out['w'] - 2.9) < 1e-9 and abs(out['b'] - 2.05) < 1e-9, 'expected w=2.9 b=2.05 | got %r' % out",
          expected: "{'w': 2.9, 'b': 2.05}",
        },
        {
          id: 't2',
          name: { ar: 'المتوسط لا المجموع', en: 'Mean, not the sum' },
          code: "server = {'w': 3.0, 'b': 2.0}\ngrads = [{'w': 0.5, 'b': -1.0}, {'w': 1.5, 'b': 0.0}]\nout = param_server_step(server, grads, 0.1)\nassert abs(out['w'] - 2.8) > 1e-9, 'summing instead of averaging would give 2.8 — pull must return the mean'\nassert out is server, 'the same dict must be updated in place and returned'",
          expected: 'mean applied; same dict returned',
        },
        {
          id: 't3',
          name: { ar: 'عامل واحد يعني تحديثًا بمقدار lr·g', en: 'One worker means an update of lr·g' },
          code: "server = {'w': 1.0}\nout = param_server_step(server, [{'w': 4.0}], 0.25)\nassert abs(out['w'] - 0.0) < 1e-9, 'expected 1.0 - 0.25*4.0 = 0.0 | got %r' % out\nout = param_server_step({'w': 0.0}, [{'w': 1.0}, {'w': 3.0}, {'w': 5.0}], 0.5)\nassert abs(out['w'] - (-1.5)) < 1e-9, 'expected 0.0 - 0.5*(9/3) = -1.5 | got %r' % out",
          expected: '0.0 then -1.5',
        },
      ],
      hints: [
        { ar: 'أنشئ المُجمّع agg = {k: 0.0 for k in server} ثم مرّ على العمال والمفاتيح تجمع القيم — هذه هي مرحلة push.', en: 'Build the accumulator agg = {k: 0.0 for k in server}, then loop over workers and keys summing values — that is the push phase.' },
        { ar: 'مرحلة pull: اقسم كل مجموع على len(worker_grads) قبل التحديث، فخادم المعاملات يسحب المتوسط لا المجموع.', en: 'Pull phase: divide every accumulated sum by len(worker_grads) before updating — the server pulls the mean, not the sum.' },
        { ar: 'قيم تحقق: مع server {w:3.0, b:2.0} وتدرجين {w:0.5,b:−1.0} و{w:1.5,b:0.0} وlr=0.1: المتوسط {w:1.0, b:−0.5} فيصبح الخادم {w:2.9, b:2.05}.', en: 'Sanity values: with server {w:3.0, b:2.0}, gradients {w:0.5,b:−1.0} and {w:1.5,b:0.0}, lr=0.1: the mean is {w:1.0, b:−0.5}, so the server becomes {w:2.9, b:2.05}.' },
        { ar: 'حدّث نفس قاموس الخادم في مكانه وأعده — الاختبار يفحص الهوية أيضًا (out is server).', en: 'Update the same server dict in place and return it — the test also checks identity (out is server).' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-data-parallel',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في توازي البيانات على k جهاز بدفعة حجمها b — ما الذي يحدث في كل تكرار؟',
        en: 'In data parallelism over k devices with a batch of size b — what happens each iteration?',
      },
      options: [
        { id: 'a', text: { ar: 'كل جهاز يأخذ شطره b/k، تُجمع التدرجات مرة واحدة كل دفعة ثم تُبث وتُحدَّث النسخ جميعها', en: 'Each device takes its b/k shard, gradients are aggregated once per batch, then broadcast so every copy updates' } },
        { id: 'b', text: { ar: 'كل جهاز يدرب على الدفعة كاملة ويُختار أفضل نموذج في النهاية', en: 'Every device trains on the whole batch and the best model is picked at the end' } },
        { id: 'c', text: { ar: 'تُقسم الشبكة نفسها بحيث يملك كل جهاز طبقات مختلفة', en: 'The network itself is partitioned so each device owns different layers' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'في توازي البيانات تحمل كل النسخ المعاملات كاملة — ما يتقسم هو الأمثلة لا النموذج.', en: 'In data parallelism every copy holds the full parameters — what is split is the examples, not the model.' },
        { ar: 'التزامن يحدث مرة واحدة بعد حساب التدرجات المحلية: جمع (allreduce) ثم بث.', en: 'Synchronization happens once after local gradients exist: aggregate (allreduce) then broadcast.' },
        { ar: 'لهذا يُضخم حجم الدفعة k مرة: كل جهاز يبقى بنفس قدر العمل الذي كان عليه منفردًا.', en: 'That is why the batch grows k-fold: each device keeps doing the same work it would do alone.' },
        { ar: 'الجواب: a — التقسيم أفقي على البيانات والالتقاء مرة كل دفعة.', en: 'Answer: a — split across data, rendezvous once per batch.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# Push/pull against a key-value store, worker by worker.\nserver = {'w': 0.5, 'b': 0.0}\nworkers = ['w1', 'w2', 'w3']\nlocal_grads = {\n    'w1': {'w': 0.2, 'b': 0.1},\n    'w2': {'w': -0.5, 'b': 0.2},\n    'w3': {'w': 0.9, 'b': -0.3},\n}\nagg, pushes, pulls = {}, 0, 0\nfor wk in workers:\n    for k, v in local_grads[wk].items():          # push(key, value)\n        agg[k] = agg.get(k, 0.0) + v\n        pushes += 1\nprint('pushed gradients ->', agg, '| push ops:', pushes)\nlr, n = 0.1, len(workers)\nfor k in server:                                  # pull(key) then update\n    server[k] -= lr * (agg[k] / n)\n    pulls += 1\nprint('server after pull+update ->', server, '| pull ops:', pulls)\n\n# جرّب: أضف عاملًا رابعًا بتدرجاته ولاحظ أن المجموع تبديلي — رتب الدفعات بأي ترتيب وسيبقى الناتج نفسه.\n# try: add a fourth worker with its gradients and note the sum is commutative — reorder the pushes and the result stays identical.\n# جرّب: قسّم المفاتيح على خادمين (w في واحد وb في الآخر) وتتبع عدد العمليات على كل خادم.\n# try: shard the keys across two servers (w on one, b on the other) and trace the op count per server.\n",
      prompt: {
        ar: 'الملعب يدير خادم معاملات مصغرًا بثلاثة عمال: كل عامل يدفع dict تدرجه، المجمّع يتراكم بلا ترتيب محدد، ثم يسحب كل مفتاح متوسطه ويُحدَّث الخادم بمعدل 0.1. جرّب إعادة ترتيب العمال وقسمة المفاتيح على خادمين.',
        en: 'The sandbox runs a miniature parameter server with three workers: each pushes its gradient dict, the accumulator grows in any arrival order, then every key is pulled as a mean and the server updates at rate 0.1. Try reordering the workers and sharding keys across two servers.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'لماذا يتفوق توازي البيانات على تقسيم الشبكة أو الطبقات عمليًا؟',
            en: 'Why does data parallelism beat network- or layer-wise splitting in practice?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يستهلك ذاكرة أقل لكل جهاز', en: 'Because it uses less memory per device' } },
            { id: 'b', text: { ar: 'لأنه يحتاج مزامنة واحدة بعد كل دفعة فقط وينطبق على أي نموذج، بينما بقية الطرق تتطلب نقلًا وحواجز كثيفة بين الطبقات', en: 'It needs only one synchronization per batch and applies to any model, while the alternatives demand dense inter-layer transfers and barriers' } },
            { id: 'c', text: { ar: 'لأنه يسمح بتدريب نماذج أكبر من ذاكرة جهاز واحد', en: 'Because it allows training models larger than one device\u2019s memory' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'النسخ الكاملة تعمل مستقلة حتى لحظة الجمع: نقطة التقاء واحدة كل دفعة. تقسيم الشبكة يقيّد تسلسل الطبقات بالنقل بين الأجهزة، وتقسيم الطبقات يحتاج حواجز بين كل طبقتين — بينما كون كل نسخة تحمل النموذج كاملًا يعني أن هذا الأسلوب لا يوسّع الذاكرة (وهذا قيد c السلبي).',
            en: 'Full copies run independently until the aggregation moment: a single rendezvous per batch. Network partitioning chains layer boundaries through device links, and layer-wise splitting needs barriers between every pair of layers — while every copy holding the whole model means this scheme does not enlarge memory (which is exactly the downside in c).',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'تدرج حجمه 160MB على 4 معالجات بناقل 16GB/s: لماذا تقسيمه إلى 4 أجزاء (15ms) أسرع أربعة أضعاف من تجميعه على جهاز واحد (60ms)؟',
            en: 'A 160MB gradient on 4 GPUs with a 16GB/s link: why is splitting it into 4 parts (15ms) four times faster than aggregating on one device (60ms)?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن التقسيم يقلل حجم البيانات المنقولة إجمالًا', en: 'Because splitting reduces the total bytes moved' } },
            { id: 'b', text: { ar: 'لأن كل وصلة PCIe تعمل بكامل نطاقها بالتوازي: 3 أجزاء تنتقل تزامنيًا في 7.5ms بدل طوابير على وصلة واحدة', en: 'Every PCIe link runs at full bandwidth in parallel: 3 parts move simultaneously in 7.5ms instead of queueing on one link' } },
            { id: 'c', text: { ar: 'لأن الجهاز الرابع لا يرسل شيئًا في الحالة الأولى', en: 'Because in the first case the fourth device sends nothing' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'إجمالي البايتات يتقارب بين الطريقتين، والمكسب من التوازي: مبدل PCIe يتيح كامل النطاق بين كل الوصلات معًا، فمقطع 40MB ينتقل في 2.5ms على كل وصلة في آن واحد، فيصبح 3×2.5 ثم البث 7.5ms = 15ms بدل ستة أنتقالات متعاقبة 10ms على وصلة الجهاز المُجمِّع.',
            en: 'The total bytes barely change between the schemes — the gain is parallelism: a PCIe switch gives every link full bandwidth at once, so a 40MB part moves in 2.5ms on all links simultaneously, giving 3×2.5 then 7.5ms of broadcast = 15ms instead of six sequential 10ms transfers funneled through one aggregator link.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا يصبح خادم معاملات واحد عنق زجاجة، وكيف تُكسر العائقية؟',
            en: 'Why does a single parameter server become a bottleneck, and how is the wall broken?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن نطاقه المحدود يجعل زمن التجميع ينمو O(m) مع العمال؛ توزيع المعاملات على n خوادم يهبط به إلى O(m/n)', en: 'Its finite bandwidth makes aggregation time grow as O(m) with workers; spreading parameters over n servers cuts it to O(m/n)' } },
            { id: 'b', text: { ar: 'لأن الخادم يحسب التدرجات بنفسه فيتعب؛ الحل أن يحسب العمال أسرع', en: 'Because the server computes the gradients itself and tires; workers should compute faster' } },
            { id: 'c', text: { ar: 'لأن مخازن المفاتيح-القيم لا تدعم أكثر من عامل واحد', en: 'Because key-value stores cannot support more than one worker' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'زمن الدفع يتحكم فيه نطاق خادم واحد مهما كان سريعًا. بتقسيم المعاملات أفقيًا على n خوادم يخزن كل منها 1/n من المعاملات بنطاق إجمالي مضاعف، ومطابقة عدد الخوادم بعدد العمال تعطي تدرجًا شبه ثابت — وعمليًا يعمل الجهاز نفسه عاملًا وخادمًا معًا.',
            en: 'Push time is bounded by one server\u2019s bandwidth no matter how fast it is. Sharding parameters horizontally over n servers gives each 1/n of the parameters with multiplied aggregate bandwidth, and matching server count to worker count yields near-constant scaling — in practice the same machine plays both worker and server.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'توازي البيانات فاز: كل جهاز يحمل النموذج كاملًا ويأخذ شطر الدفعة b/k، تُجمع التدرجات وتُبث مرة كل دفعة، مع تكبير الدفعة ورفع المعدل المحتمل (الهدف من s5 التدريب على معالجات متعددة).', en: 'Data parallelism won: every device holds the full model and takes its b/k shard, gradients aggregate and broadcast once per batch, with the batch enlarged and the rate possibly raised (goal of s5 Training on Multiple GPUs).' },
        { ar: 'التطبيق اليدوي = توزيع معاملات + allreduce (جمع وبث)، والتطبيق الموجز `nn.DataParallel` يخفيه كله — وكلفة المزامنة تتقلب أربعة أضعاف حسب المسار: 60 و80 و15 و6ms لنفس التدرج (الهدف من s6 التطبيق الموجز).', en: 'The manual recipe = distribute parameters + allreduce (sum and broadcast), while concise `nn.DataParallel` hides it all — and sync cost swings fourfold by path: 60, 80, 15 and 6ms for the same gradient (goal of s6 Concise Implementation).' },
        { ar: 'خادم المعاملات يلخّص التوزيع في push/pull فوق مخازن مفاتيح-قيم: جمع تبديلي بلا ترتيب، وعنق زجاجة O(m) يُكسر بتوزيع التخزين على n خوادم فتصبح O(m/n) (الهدف من s7 خوادم المعاملات).', en: 'The parameter server distills distribution into push/pull over key-value stores: a commutative sum immune to arrival order, with an O(m) bottleneck broken by sharding storage over n servers into O(m/n) (goal of s7 Parameter Servers).' },
      ],
      reflectPrompt: {
        ar: 'لو ضاعف عدد أجهزتك من 4 إلى 8، فأي مكوّن سينخفض زمنه بالنصف فعلًا وأيها سيبقى كما هو؟ صمّم نموذج كلفة بسطور قليلة يتنبأ بالجواب قبل أن تدفع ثمن التجربة.',
        en: 'If you doubled your devices from 4 to 8, which component\u2019s time would truly halve and which would stay put? Sketch a few-line cost model that predicts the answer before you pay for the experiment.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch13.s5' },
        { book: 'D2L', section: 'd2l.ch13.s6' },
        { book: 'D2L', section: 'd2l.ch13.s7' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch13.s5' },
    { book: 'D2L', section: 'd2l.ch13.s6' },
    { book: 'D2L', section: 'd2l.ch13.s7' },
  ],
} satisfies Lesson;

export default lesson;
