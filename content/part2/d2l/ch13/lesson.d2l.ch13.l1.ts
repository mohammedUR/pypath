import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch13.l1 — "Where the Cycles Go: Compilers, Async, Parallelism, Hardware"
 * إلى أين تذهب الدورات: المترجمات واللازامن والتوازي والعتاد
 * Aligned with D2L ch13 s1 (Compilers and Interpreters) + s2 (Asynchronous
 * Computation) + s3 (Automatic Parallelism) + s4 (Hardware). All expression is
 * original — a paraphrase of the source's ideas, never a verbatim translation.
 * Runnable design: constant folding over expression tuples, a dependency-graph
 * round scheduler with a deterministic cost model (structure asserted, never
 * wall-time). Every literal verified under CPython 3. Deterministic only.
 */
const lesson = {
  id: 'd2l.ch13.l1',
  version: 1,
  part: 'II',
  track: 'A7',
  book: 'D2L',
  chapter: 13,
  title: {
    ar: 'إلى أين تذهب الدورات: المترجمات واللازامن والتوازي والعتاد',
    en: 'Where the Cycles Go: Compilers, Async, Parallelism, Hardware',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch12.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'نموذجك مثالي والبيانات نظيفة، ومع ذلك التدريب بطيء: أين تُهدر الدورات الحاسوبية؟ أحيانًا في مفسّر بايثون ينفذ كل جمع على حدة، وأحيانًا في انتظار متزامن لتّرات لا تنتظر أحدًا، وأحيانًا في نقل بيانات كان يمكن أن يتراكب مع الحساب، وأحيانًا في وصول إلى ذاكرة أبطأ مئة مرة من المعالج. هذا الدرس يمنحك عدسة لكل واحدة من هذه الجيوب الأربعة.',
        en: 'Your model is perfect and the data is clean, yet training is slow: where do the compute cycles leak? Sometimes into a Python interpreter executing each addition separately, sometimes into a synchronous wait for tasks that wait for nobody, sometimes into a data transfer that could overlap with compute, and sometimes into a memory access a hundred times slower than the processor. This lesson gives you a lens for each of these four pockets.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'من التفسير إلى العتاد: أربعة مصادر للبطء', en: 'From interpretation to hardware: four sources of slowness' },
      chunks: [
        {
          ar: 'البرمجة الأمرية تنفذ كل عبارة فورًا وتخزن نتائجها الوسيطة — أسهل في الكتابة والتنقيح، لكن المفسّر ينفذ كل استدعاء على حدة ويحتفظ بالمتغيرات الوسيطة ريثما يتأكد أن أحدًا لن يطلبها. البرمجة الرمزية تعرّف العملية كاملة أولًا ثم تُصرّفها مرة واحدة: يمكن للمترجم حذف المتغيرات الميتة وطيّ الثوابت — مثل تحويل (1+2)+(3+4) إلى 10 قبل التنفيذ — وترحيل الناتج إلى بيئات بلا بايثون. الإطارات الحديثة تهجّن الاثنين: تطوير أمري ثم تحويل إلى رسم رمزي للنشر السريع، كما في الكتاب: `torch.jit.script` على `nn.Sequential`.',
          en: 'Imperative programming executes each statement immediately and stores intermediates — easier to write and debug — but the interpreter runs every call separately and keeps intermediate variables alive until it is sure nobody will ask for them. Symbolic programming defines the whole computation first, then compiles it once: the compiler can drop dead variables and fold constants — turning (1+2)+(3+4) into 10 before running — and port the result to non-Python environments. Modern frameworks hybridize the two: develop imperatively, then convert to a symbolic graph for deployment, as in the book: `torch.jit.script` applied to an `nn.Sequential`.',
        },
        {
          ar: 'الإطار له واجهة أمامية (بايثون) وخلفية تنفيذ (غالبًا ++C): الأوامر لا تُنفذ فورًا بل تُصفّ في طابور الخلفية التي تدير خيوطها الخاصة وتتتبع تبعيات الرسم الحسابي. النتيجة لازمة: واجهتك تتقدم سريعًا بينما الخلفية تعمل بالتوازي، ومع ذلك لا يمكن تشغيل عمليتين متعاقبتين اعتمادًا معًا. متى احتجت الناتج فعليًا — طباعة أو مقارنة — يجب المزامنة، ويُنصح بالمزامنة لكل دفعة صغيرة حتى لا يتضخم الطابور ويبتلع الذاكرة.',
          en: 'The framework has a frontend (Python) and an execution backend (usually C++): commands are not executed immediately but queued into the backend, which manages its own threads and tracks the computational graph\u2019s dependencies. The result is asynchrony: your frontend races ahead while the backend computes in parallel — but operations that depend on each other can never run together. Whenever you actually need a result — printing or comparing — you must synchronize, and it is wise to synchronize once per minibatch so the queue does not balloon and swallow memory.',
        },
        {
          ar: 'لأن الخلفية تعرف الرسم كاملًا فإنها توازي تلقائيًا ما لا يعتمد على بعضه: عمليتان على جهازين مختلفين تنطلقان معًا، فيصبح زمن الاثنين أقل من مجموعهما. وحتى الحساب والنقل يتراكبان: يبدأ نسخ ناتج مبكر إلى المعالج المركزي عبر الناقل بينما الحاسوب ما زال ينتج بقية القائمة — مواران مختلفة (حساب مقابل ناقل) لا تتنازع. عندنا في المثال المُشغَّل مجدول جولات يحاكي الفكرة بنموذج كلفة حتمي: كل جولة تشغّل كل المهام الجاهزة معًا وزمنها أغلى مهمة فيها.',
          en: 'Because the backend sees the whole graph, it parallelizes whatever does not depend on each other: two operations on two devices start together, and their total time is less than the sum of the parts. Even compute and transfer overlap: copying an early result to the CPU over the bus starts while compute is still producing the rest of the list — different resources (compute versus bus) that do not compete. Our worked example simulates the idea with a round scheduler over a deterministic cost model: each round runs all ready tasks together and costs as much as its priciest task.',
        },
        {
          ar: 'العتاد يفرض سلم الكمون: سجلات وذاكرة L1 في حدود النانوثة، L2 أبطأ أضعافًا، الذاكرة الرئيسة أبطأ مئات المرات، والقراءة من SSD آلاف المرات — أرقام تقريبية متعارف عليها لتقدير الأوامر الكبرى. المعالج قادر على معالجة بيانات أسرع مما يستطيع ناقل الذاكرة تغذيته به، ولهذا وجدت الدفعات: كتلة متجاورة تُقرأ دفعة واحدة (burst) وتُشبع ذاكرة التخزين المؤقت، وضرب المصفوفات كتلة كاملة ينجز غيغافلووبس بينما العنصر الواحد يخنقه النقل. القاعدة: صمّم بحيث يبقى العمل الحسابي حيث البيانات.',
          en: 'Hardware imposes a latency ladder: registers and L1 cache at nanosecond scale, L2 several times slower, main memory hundreds of times slower, and SSD reads thousands of times — rough rule-of-thumb numbers for reasoning about the big jumps. A processor can chew data faster than the memory bus can feed it, which is exactly why batches exist: a contiguous block read in one burst saturates caches, and full-block matrix multiplication reaches gigaflops while element-at-a-time work is throttled by transfer. The rule: design so that computation stays where the data lives.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'طيّ الثوابت + جدول الجولات المتوازية',
        en: 'Constant folding + the parallel round scheduler',
      },
      code: "def fold(node):\n    \"\"\"A symbolic pass: fold constant subtrees, keep anything with a leaf.\"\"\"\n    if not isinstance(node, tuple):\n        return node                       # number or free variable: leaf\n    op, a, b = node\n    a, b = fold(a), fold(b)\n    if isinstance(a, (int, float)) and isinstance(b, (int, float)):\n        return a + b if op == 'add' else a * b\n    return (op, a, b)\n\neager = ('add', ('add', 1, 2), ('add', 3, 4))\nprint('imperative-looking:', eager)\nprint('compiled/folded   :', fold(eager))\nprint('mul example       :', fold(('mul', ('add', 2, 3), 4)))\nprint('kept for runtime  :', fold(('add', 'x', ('add', 1, 2))))\n\n# Dependency graph: task -> (cost, dependencies). Deterministic cost model:\n# each round runs ALL ready tasks concurrently and costs the max, not the sum.\ntasks = {'A': (5, []), 'B': (3, []), 'C': (4, ['A', 'B']),\n         'D': (2, ['C']), 'E': (6, ['B'])}\ndone, rounds, makespan = set(), [], 0\nwhile len(done) < len(tasks):\n    ready = [k for k in tasks if k not in done and all(d in done for d in tasks[k][1])]\n    width = max(tasks[k][0] for k in ready)\n    rounds.append((ready, width))\n    makespan += width\n    done |= set(ready)\nsequential = sum(cost for cost, _ in tasks.values())\nprint('rounds:', rounds)\nprint('sequential cost %d | parallel makespan %d | speedup %.6f'\n      % (sequential, makespan, sequential / makespan))",
      explanation: {
        ar: 'الجزء الأول يُظهر ما يراه المترجم: التعبير المتداخل `("add", ("add",1,2), ("add",3,4))` يُطوى إلى 10 قبل أي تنفيذ، و`("mul", ("add",2,3), 4)` يُطوى إلى 20، أما `("add", "x", 3)` فيبقى انتظارًا لمتغير حر مع طيّ فرعه الثابت. الجزء الثاني يحاكي توازي الخلفية: الجولة الأولى تشغّل A وB معًا بتكلفة max(5,3)=5، والثانية C وE بتكلفة 6 (لا 10 لأنهما غير متعاقبين)، والثالثة D وحدها 2: زمن الجولة 13 مقابل 20 تسلسليًا، تسريع 1.538462 من التراكب وحده، بلا أي عدّاد زمن حقيقي.',
        en: 'The first half shows what a compiler sees: the nested expression `("add", ("add",1,2), ("add",3,4))` folds to 10 before any execution, `("mul", ("add",2,3), 4)` folds to 20, while `("add", "x", 3)` must wait for a free variable — though its constant branch still folds. The second half simulates backend parallelism: round one runs A and B together at cost max(5,3)=5; round two runs C and E at cost 6 (not 10, since they are independent); round three runs D alone at 2. The makespan is 13 versus 20 sequential — a speedup of 1.538462 from overlap alone, with no real clock involved.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.fold-constants',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ fold(node) على تعبيرات كصفوف: `("add", a, b)` أو `("mul", a, b)` حيث الورقة رقم أو سلسلة (متغير حر). الدالة تُطوي أي شجرة فرعية عناصرها أرقامًا كلها إلى قيمة واحدة، وتُبقي أي شجرة تحتوي متغيرًا حرًا بصيغتها المُطوَّرة جزئيًا.',
        en: 'Implement fold(node) over expressions as tuples: `("add", a, b)` or `("mul", a, b)` where a leaf is a number or a string (a free variable). The function folds any all-numeric subtree into a single value and keeps any subtree containing a free variable in its partially folded form.',
      },
      starterCode: "def fold(node):\n    # TODO: leaves pass through; fold children; collapse numeric pairs\n    ...\n",
      solution: "def fold(node):\n    if not isinstance(node, tuple):\n        return node\n    op, a, b = node\n    a, b = fold(a), fold(b)\n    if isinstance(a, (int, float)) and isinstance(b, (int, float)):\n        return a + b if op == 'add' else a * b\n    return (op, a, b)",
      tests: [
        {
          id: 't1',
          name: { ar: 'التعبير ثابت الكل يُطوى إلى قيمة واحدة', en: 'A fully constant expression folds to one value' },
          code: "got = fold(('add', ('add', 1, 2), ('add', 3, 4)))\nassert got == 10, 'expected 10 | got %r' % (got,)",
          expected: '10',
        },
        {
          id: 't2',
          name: { ar: 'الضرب يُطوى أيضًا', en: 'Multiplication folds too' },
          code: "got = fold(('mul', ('add', 2, 3), 4))\nassert got == 20, 'expected 20 | got %r' % (got,)",
          expected: '20',
        },
        {
          id: 't3',
          name: { ar: 'المتغير الحر يُبقي البنية مع طي ما حوله', en: 'A free variable keeps structure with its surroundings folded' },
          code: "got = fold(('add', 'x', ('add', 1, 2)))\nassert got == ('add', 'x', 3), 'expected (add, x, 3) | got %r' % (got,)\nassert fold(7) == 7 and fold('w') == 'w', 'leaves must pass through unchanged'",
          expected: "('add', 'x', 3); leaves unchanged",
        },
      ],
      hints: [
        { ar: 'ابدأ بحالة القاعدة: كل ما ليس tuple هو ورقة تعود كما هي — الأرقام والسلاسل معًا.', en: 'Start with the base case: anything that is not a tuple is a leaf returned unchanged — numbers and strings alike.' },
        { ar: 'بعد فك العقدة fold أبناءها أولًا، ثم افحص: هل الاثنان رقم؟ عندها أعد الجمع أو الضرب حسب العملية.', en: 'After unpacking a node, fold both children first, then check: are both numbers? If so return the sum or product by operation.' },
        { ar: 'قيمة تحقق: fold(("mul", ("add", 2, 3), 4)) = 20 لأن (2+3) تُطوى إلى 5 ثم 5·4 = 20.', en: 'Sanity value: fold(("mul", ("add", 2, 3), 4)) = 20 because (2+3) folds to 5 and then 5·4 = 20.' },
        { ar: 'احذر isinstance(True, int) — لا حاجة لمنطق القيم المنطقية هنا، لكن تذكّر أن الفحص isinstance(a, (int, float)) لا يلتقط السلاسل، وهذا مقصود.', en: 'Beware isinstance(True, int) — boolean logic is not needed here, but note that isinstance(a, (int, float)) deliberately excludes strings.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-overlap-speedup',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'مهمتان مستقلتان كلفتهما 25 و15 وحدة زمنية على جهازين: المجموع التسلسلي 40 وزمن التوازي (أطول مسار) 25. ما نسبة التسريع 40/25؟ (اكتب رقمًا عشريًا)',
        en: 'Two independent tasks cost 25 and 15 time units on two devices: the sequential total is 40 and the parallel time (the longer path) is 25. What is the speedup 40/25? (Enter a decimal number)',
      },
      answer: '1.6',
      solution: '1.6',
      tolerance: 0.01,
      hints: [
        { ar: 'عند التوازي لا تُجمع الأزمنة: المهام المستقلة تمشي معًا والزمن هو أقصى مسار.', en: 'Under parallelism times do not add: independent tasks run together and the time is the longest path.' },
        { ar: 'أقصى المسارين هنا هو 25 لأن المهمة الأطول تحدد متى ينتهي كل شيء.', en: 'The longer path here is 25 because the bigger task determines when everything finishes.' },
        { ar: 'نسبة التسريع = الزمن التسلسلي ÷ الزمن المتوازي = 40 ÷ 25.', en: 'Speedup = sequential time ÷ parallel time = 40 ÷ 25.' },
        { ar: 'الجواب: 1.6 — كما في تقارير الجولات في المثال المُشغَّل.', en: 'Answer: 1.6 — as in the round reports of the worked example.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import time\n\n# Fixed 200k-element vectors; only the printed magnitudes vary by machine.\na = [i * 0.5 for i in range(200000)]\nb = [i * 0.25 for i in range(200000)]\n\nt0 = time.perf_counter()\nacc = 0.0\nfor i in range(len(a)):\n    acc += a[i] * b[i]\nt_loop = time.perf_counter() - t0\n\nt0 = time.perf_counter()\nfast = sum(x * y for x, y in zip(a, b))\nt_fast = time.perf_counter() - t0\n\nprint('results agree:', abs(acc - fast) < 1e-6, '| value ~ %.4e' % acc)\nprint('explicit loop : %.6f s' % t_loop)\nprint('zip+sum       : %.6f s' % t_fast)\nprint('speedup this machine: %.2fx (magnitudes only — never assert on clocks)'\n      % (t_loop / t_fast if t_fast > 0 else float('nan')))\n\n# جرّب: كبّر القوائم إلى مليون عنصر ولاحظ أن الفارق النسبي يثبت بينما الأزمنة تتحرك.\n# try: grow the lists to a million elements and note how the relative gap stays while the absolute times drift.\n# جرّب: وزّع خمس مهام بكلف 7 و2 و9 و4 و3 على جولات حسب التبعيات واحسب زمن الجولة بنفسك.\n# try: schedule five tasks costing 7, 2, 9, 4 and 3 into rounds by their dependencies and compute the makespan yourself.\n",
      prompt: {
        ar: 'الملعب يقيس زمنين حقيقيين بـ perf_counter على متجهين ثابتَي المحتوى: حلقة صريحة مقابل sum مع zip. النتائج العددية حتمية تمامًا، أما الأزمنة فتتحرك من آلة لأخرى — لهذا لا نؤكد على الساعات أبدًا، بل على تساوي الناتج وحجم الترتيب.',
        en: 'The sandbox times two real runs with perf_counter over fixed-content vectors: an explicit loop versus sum with zip. The numeric results are fully deterministic; the timings drift machine to machine — which is why we never assert on clocks, only on result equality and order of magnitude.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما الميزة التي يمنحها البرمجة الرمزية (المُصرَّفة) على الأمرية المفسَّرة؟',
            en: 'What advantage does symbolic (compiled) programming hold over imperative interpreted code?',
          },
          options: [
            { id: 'a', text: { ar: 'أسهل في التنقيح وبطباعة المتغيرات الوسيطة', en: 'Easier to debug and to print intermediate variables' } },
            { id: 'b', text: { ar: 'يرى البرنامج كاملًا فيطوي الثوابت ويحرر ذاكرة المتغيرات الميتة ويرحّل خارج بايثون', en: 'It sees the whole program, so it folds constants, frees dead-variable memory, and ports beyond Python' } },
            { id: 'c', text: { ar: 'يجعل نتائج الحساب أدق عدديًا', en: 'It makes the numerical results more accurate' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المترجم يرى الرسم كاملًا قبل التنفيذ فيحذف ما لا يُستخدم ويطوي (1+2)+(3+4) إلى 10 وينتج ملفًا مستقلًا عن بايثون. أما سهولة التنقيح فميزة الأمرية لا الرمزية.',
            en: 'The compiler sees the entire graph before execution: it removes unused values, folds (1+2)+(3+4) into 10, and can emit an artifact independent of Python. Ease of debugging is the imperative side\u2019s advantage, not the symbolic one.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا يُنصح بالمزامنة لكل دفعة صغيرة في التدريب اللامتزامن؟',
            en: 'Why is synchronizing once per minibatch recommended in asynchronous training?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن المزامنة تسرّع الخلفية نفسها', en: 'Because synchronization speeds up the backend itself' } },
            { id: 'b', text: { ar: 'حتى لا يتضخم طابور الأوامر ويبتلع الذاكرة بينما تتقدم الواجهة بلا حدود', en: 'So the command queue does not balloon and consume memory while the frontend races ahead unchecked' } },
            { id: 'c', text: { ar: 'لأن الطابور يفقد الترتيب بعد ألف أمر', en: 'Because the queue loses ordering after a thousand commands' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'اللازمة تجعل الواجهة تستجيب فورًا لكن الأوامر تتراكم: بلا نقاط تزامن دورية تنمو الذاكرة المشغولة بالنتائج غير المحصودة. المزامنة لكل دفعة تُبقي الطرفين قريبين دون فقدان معظم فائدة التوازي.',
            en: 'Asynchrony makes the frontend instantly responsive but commands accumulate: without periodic sync points, memory held by unconsumed results keeps growing. Per-minibatch synchronization keeps both sides close while preserving most of the parallel benefit.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'متى يتراكب الحساب والنقل إلى المعالج المركزي بنجاح؟',
            en: 'When do compute and a copy to the CPU successfully overlap?',
          },
          options: [
            { id: 'a', text: { ar: 'عندما يكونان مستقلين عن موردَي مختلفين: الناقل لا ينافس وحدات الحساب، ويمكن نسخ y[i−1] أثناء إنتاج y[i]', en: 'When they use different resources: the bus does not compete with compute units, and y[i−1] can be copied while y[i] is still being produced' } },
            { id: 'b', text: { ar: 'عندما يكون النقل أسرع من الحساب دائمًا', en: 'When the transfer is always faster than the compute' } },
            { id: 'c', text: { ar: 'لا يمكن التراكب أبدًا لأن كل شيء يعتمد على كل شيء', en: 'Overlap is impossible because everything depends on everything' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الموارد مختلفة: الحساب على وحدات الجهاز والنقل على الناقل. التبعية تبقى بين العنصر ونسخته (y[i] يجب أن يُحسب أولًا)، لكن النظام ينقل y[i−1] بينما يحسب y[i] فينخفض الزمن الكلي دون انتظار كامل.',
            en: 'The resources differ: compute runs on device units, transfer on the bus. The dependency stays between an element and its copy (y[i] must be computed first), but the system can move y[i−1] while computing y[i], cutting the total without a full stall.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الأمرية أسهل تنقيحًا والرمزية أسرع تنفيذًا؛ التهجين يطوّر أمريًا ويصرّف للنشر، ويطيّ الثوابت قبل التنفيذ (الهدف من s1 المترجمات والمفسّرات).', en: 'Imperative is easier to debug, symbolic faster to run; hybridization develops imperatively and compiles for deployment, folding constants before execution (goal of s1 Compilers and Interpreters).' },
        { ar: 'الواجهة الأمامية تصف الأوامر في طابور الخلفية التي تدير التبعيات: لازمة سريعة الاستجابة، مع مزامنة لكل دفعة حتى لا يبتلع الطابور الذاكرة (الهدف من s2 الحساب اللامتزامن).', en: 'The frontend queues commands into a backend that manages dependencies: responsive asynchrony, with per-minibatch synchronization so the queue does not swallow memory (goal of s2 Asynchronous Computation).' },
        { ar: 'الخلفية توازي تلقائيًا ما لا يعتمد على بعضه، وتراكب الحساب مع النقل لأنهما موردان مختلفان (الهدف من s3 التوازي التلقائي).', en: 'The backend automatically parallelizes independent operations and overlaps compute with transfer because they use different resources (goal of s3 Automatic Parallelism).' },
        { ar: 'سلم الكمون (سجلات، L1، L2، ذاكرة رئيسة، SSD) يفسر نجاح الدفعات: قراءة متجاورة تشبع ذاكرة التخزين المؤقت بينما العنصر الواحد يخنقه النقل (الهدف من s4 العتاد).', en: 'The latency ladder (registers, L1, L2, main memory, SSD) explains why batches win: a contiguous read saturates caches while element-at-a-time work is throttled by transfer (goal of s4 Hardware).' },
      ],
      reflectPrompt: {
        ar: 'في آخر نموذج دربته، صنّف أسباب البطء الثلاثة الأكبر على هذه العدسات الأربع (تفسير، مزامنة، نقل، ذاكرة) — وما التجربة الواحدة التي ستصممها لتثبت أياها المذنب الأول؟',
        en: 'For the last model you trained, attribute its top three slowness causes across these four lenses (interpretation, synchronization, transfer, memory) — and design the one experiment that would prove which culprit leads.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch13.s1' },
        { book: 'D2L', section: 'd2l.ch13.s2' },
        { book: 'D2L', section: 'd2l.ch13.s3' },
        { book: 'D2L', section: 'd2l.ch13.s4' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch13.s1' },
    { book: 'D2L', section: 'd2l.ch13.s2' },
    { book: 'D2L', section: 'd2l.ch13.s3' },
    { book: 'D2L', section: 'd2l.ch13.s4' },
  ],
} satisfies Lesson;

export default lesson;
