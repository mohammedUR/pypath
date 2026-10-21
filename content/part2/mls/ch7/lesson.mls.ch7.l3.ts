import type { Lesson } from '@/lib/content/schema';

/**
 * mls.ch7.l3 — "Training the Network: From Loops to keras"
 * تدريب الشبكة: من الحلقات إلى keras
 * Aligned with MLS ch7 s3 (Implementation). The book's keras Sequential /
 * Functional code is referenced in PROSE ONLY (never runnable). Runnable
 * comparison: minigrad MLP trained via minigrad.sgd on a fixed 12-point
 * regression set; loss values verified under CPython 3 with the real module
 * (seed=7, 300 epochs, lr=0.08 -> 4.397775 / 0.017658 / 0.017383).
 */
const lesson = {
  id: 'mls.ch7.l3',
  version: 1,
  part: 'II',
  track: 'A3',
  book: 'MLS',
  chapter: 7,
  title: {
    ar: 'تدريب الشبكة: من الحلقات إلى keras',
    en: 'Training the Network: From Loops to keras',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch7.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'ينهي الكتاب فصله بتنفيذ عملي بأشهر أداة صناعية: keras داخل TensorFlow، بسطرين يبنيان شبكة وتدربانها. لا نستطيع تشغيل keras في صندوق الرمل هنا — لكننا نستطيع شيئًا أفضل للفهم: تدريب شبكة حقيقية بمحرك المنصة minigrad، وقراءة كود الكتاب قراءة ناقدة تربط كل سطر فيه بما بنيته بيديك في الدرسين الماضيين.',
        en: 'The book closes its chapter with a production-grade tool: keras inside TensorFlow, where two lines build and train a network. We cannot run keras in this sandbox — but we can do something better for understanding: train a real network on the platform engine minigrad, then read the book\u2019s code critically, mapping every line onto what you built by hand in the last two lessons.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'قراءة Sequential، ومقارنة الحلقات بالمصفوفات', en: 'Reading Sequential, and loops vs matrices' },
      chunks: [
        {
          ar: 'في الكتاب: tf.keras.models.Sequential() ينشئ حاوية، ثم model.add(tf.keras.layers.Dense(units=8, activation="relu", input_shape=(13,))) يضيف طبقة مخفية من 8 عصبونات كثيفة (كل عصبون موصول بكل مدخلات الطبقة السابقة)، ثم Dense أخيرة بوحدة واحدة وتفعيل خطي. بعدها model.compile يختار المحسّن والخسارة، وmodel.fit يدرّب بتدريب مصغّرات: epochs يعني عدد الدورات الكاملة على البيانات وbatch_size حجم العينة الفرعية لكل تحديث تدرج. الطريق الوظيفي (Functional) يعكس الترتيب: tf.keras.Input ثم طبقات تُطبق على الدخل مباشرة Dense(8, activation="relu")(inputs) ثم tf.keras.Model(inputs, outputs). الشبكة نفسها التي بنيناها — الاختلاف في الواجهة فقط.',
          en: 'In the book: tf.keras.models.Sequential() creates a container, then model.add(tf.keras.layers.Dense(units=8, activation="relu", input_shape=(13,))) adds a hidden layer of 8 dense neurons (each connected to every previous-layer input), followed by a final one-unit Dense with linear activation. model.compile then picks the optimizer and loss, and model.fit trains with mini-batch gradient descent: epochs counts full passes over the data and batch_size sets how many samples feed each gradient update. The Functional route flips the order: a tf.keras.Input, Dense layers applied directly to it — Dense(8, activation="relu")(inputs) — then tf.keras.Model(inputs, outputs) ties the ends. It is the very network we built; only the interface differs.',
        },
        {
          ar: 'بنى الكتاب في قسم البناء صنفين يختلفان في نقطة واحدة: الأول يمرّ على الملاحظات واحدة واحدة ويجمع تدرجاتها (حلقة داخل حلقة)، والثاني يكدّس كل الملاحظات في مصفوفة واحدة ويحسب تدرج الدفعة كاملة بضربات موترية مباشرة. الرياضيات متطابقة، والسرعة مختلفة جذريًا لأن المكتبات تفوض الضربات المصفوفية لنوى متخصصة. minigrad يسلك طريق الحلقات القياسية: كل عملية تربط عقدتَي Value، وهذا واضح وبطيء — ولهذا بالكاد يحرك شبكة 1-8-1 على 12 نقطة، بينما تطير keras على ملايين النقاط. التدريب عندنا دفعة كاملة full-batch: كل الـ 12 نقطة في كل تحديث، مقابل batch_size عندهم.',
          en: 'The book\u2019s construction chapter builds two classes differing in exactly one point: the first walks through observations one at a time and accumulates their gradients (a loop inside a loop), while the second stacks all observations into one matrix and computes the full batch gradient with direct tensor products. The math matches; the speed does not, because libraries delegate matrix products to specialized kernels. minigrad takes the scalar-loop road: every operation wires two Value nodes — transparent and slow. That is why it barely moves a 1-8-1 net over 12 points while keras flies over millions. Our training is full-batch: all 12 points in every update, versus their batch_size chunks.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: '300 حقبة تدريب على 12 نقطة بمحرك المنصة', en: '300 training epochs on 12 points, platform engine' },
      code: "import math\nimport minigrad\n\nxs = [[round(-3 + 0.55 * i, 2)] for i in range(12)]\nys = [0.5 * x[0] + 0.3 * math.sin(2 * x[0]) for x in xs]\n\nmodel = minigrad.MLP(1, [8], seed=7)\nhistory = minigrad.sgd(model, xs, ys, loss_fn=minigrad.mse, epochs=300, lr=0.08)\n\nprint('epoch   0 loss %.6f' % history[0])\nprint('epoch 100 loss %.6f' % history[100])\nprint('epoch 299 loss %.6f' % history[299])\nprint('decreased:', history[299] < history[0])",
      explanation: {
        ar: 'البيانات: 12 نقطة على x من -3.0 إلى 3.05 والهدف y = 0.5x + 0.3·sin(2x) — علاقة ناعمة غير خطية قليلًا. الشبكة 1-8-1 (8 عصبونات relu ومخرج خطي) تهيأ ببذرة 7. minigrad.sgd ينفذ النزول التدريجي الكامل الدفعة ويعيد تاريخ الخسارة. النتيجة المتحقق منها: الخسارة 4.397775 عند الحقبة 0، ثم 0.017658 عند 100، ثم 0.017383 عند 299 — انخفاض بنسبة تتجاوز 99.6%. معظم التحسن يحدث في أول 100 حقبة ثم تتباطأ الخطوات قرب القاع، وهذا نمط نزول تدريجي صحي.',
        en: 'The data: 12 points with x from -3.0 to 3.05 and target y = 0.5x + 0.3·sin(2x) — a smooth, mildly nonlinear relation. The 1-8-1 net (8 relu neurons, linear output) is seeded at 7. minigrad.sgd runs full-batch gradient descent and returns the loss history. Verified result: the loss is 4.397775 at epoch 0, 0.017658 at 100, and 0.017383 at 299 — a drop of over 99.6%. Most of the improvement lands in the first 100 epochs and the steps slow near the bowl\u2019s bottom: the classic healthy descent pattern.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.train-run',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل train() لتدرّب شبكة minigrad.MLP(1, [8], seed=7) على بيانات 12 نقطة بـ minigrad.sgd (epochs=300, lr=0.08, mse) وأنده. يجب أن يقلّ طول history عن 300 وعنصرها الأخير أقل من بدايته وأقل من 0.05. اطبع قيم history عند 0 و100 و299.',
        en: 'Complete train() to fit minigrad.MLP(1, [8], seed=7) on the 12-point data with minigrad.sgd (epochs=300, lr=0.08, mse) and return the history. It must have length 300, with the final entry below the first and below 0.05. Print history at 0, 100 and 299.',
      },
      starterCode: "import math\nimport minigrad\n\nxs = [[round(-3 + 0.55 * i, 2)] for i in range(12)]\nys = [0.5 * x[0] + 0.3 * math.sin(2 * x[0]) for x in xs]\n\ndef train():\n    model = minigrad.MLP(1, [8], seed=7)\n    history = ...  # TODO: minigrad.sgd(model, xs, ys, loss_fn=minigrad.mse, epochs=300, lr=0.08)\n    # TODO: print losses at epochs 0, 100, 299\n    return history\n\nhistory = train()\n",
      solution: "import math\nimport minigrad\n\nxs = [[round(-3 + 0.55 * i, 2)] for i in range(12)]\nys = [0.5 * x[0] + 0.3 * math.sin(2 * x[0]) for x in xs]\n\ndef train():\n    model = minigrad.MLP(1, [8], seed=7)\n    history = minigrad.sgd(model, xs, ys, loss_fn=minigrad.mse, epochs=300, lr=0.08)\n    print('epoch   0 loss %.6f' % history[0])\n    print('epoch 100 loss %.6f' % history[100])\n    print('epoch 299 loss %.6f' % history[299])\n    return history\n\nhistory = train()",
      tests: [
        {
          id: 't1',
          name: { ar: 'التاريخ يضم قيمة لكل حقبة (300)', en: 'The history holds one entry per epoch (300)' },
          code: "assert len(history) == 300, 'expected 300 entries | actual: %r' % len(history)",
          expected: '300',
        },
        {
          id: 't2',
          name: { ar: 'الخسارة النهائية أدنى من الابتدائية', en: 'Final loss below the initial loss' },
          code: "assert history[299] < history[0], 'expected decrease | start %r end %r' % (history[0], history[299])",
          expected: 'history[299] < history[0]',
        },
        {
          id: 't3',
          name: { ar: 'الخسارة النهائية تحت 0.05', en: 'Final loss under 0.05' },
          code: "assert history[299] < 0.05, 'expected final loss < 0.05 | actual: %r' % history[299]",
          expected: 'history[299] < 0.05 (verified: 0.017383)',
        },
      ],
      hints: [
        { ar: 'النداء الصحيح: minigrad.sgd(model, xs, ys, loss_fn=minigrad.mse, epochs=300, lr=0.08) — يقبض model ثم البيانات ثم loss_fn كوسيط مسمى.', en: 'The call is minigrad.sgd(model, xs, ys, loss_fn=minigrad.mse, epochs=300, lr=0.08) — model and data first, loss_fn as a named argument.' },
        { ar: 'sgd يعيد قائمة أرقام عائمة بطول epochs — history[0] خسارة الحقبة الأولى وhistory[299] خسارة الأخيرة.', en: 'sgd returns a list of floats of length epochs — history[0] is the first epoch\u2019s loss and history[299] the last one\u2019s.' },
        { ar: 'قيم تحقق بالبذرة 7 وlr = 0.08: 4.397775 ثم 0.017658 ثم 0.017383 عند الحقب 0 و100 و299 — لا تساوي == للأعداد العائمة، قارن بعتبات.', en: 'Verified values for seed 7 and lr = 0.08: 4.397775, 0.017658, 0.017383 at epochs 0, 100, 299 — never compare floats with ==, compare against thresholds.' },
        { ar: 'إذا لم تنخفض الخسارة عن 0.05 فالشبه أنك درّبت epochs=30 بدل 300 أو نسيت loss_fn=minigrad.mse فاستُخدمت الافتراضية (وهي mse أيضًا) أو غيرت البذرة.', en: 'If the loss stays above 0.05 you most likely trained epochs=30 instead of 300, dropped loss_fn=minigrad.mse (the default is mse too), or changed the seed.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.dense-params',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وأكتب مخرجه بالضبط: عدد معاملات طبقة Dense (الأوزان + الانحيازات) لطبقتي الشبكة في الكتاب — المخفية ذات 8 عصبونات فوق 13 متنبئًا في بيانات Boston، وطبقة الإخراج ذات العصبون الواحد. هذا ما تطبعه model.summary() في الكتاب: 112 ثم 9.',
        en: 'Read the code and write its exact output: the parameter count (weights + biases) of a Dense layer, for the book\u2019s two layers — the hidden one with 8 units over the 13 Boston predictors, and the single-unit output layer. This is what model.summary() prints in the book: 112 then 9.',
      },
      code: "# Dense layer with `units` neurons fed by `n_in` inputs:\n#     units * n_in weights + units biases\n# The book's Boston network reads 13 features:\nhidden_params = 8 * (13 + 1)\noutput_params = 1 * (8 + 1)\nprint(hidden_params)\nprint(output_params)",
      answer: '112\n9',
      solution: '112\n9',
      hints: [
        { ar: 'كل عصبون من 8 يحمل وزنًا لكل مدخل من الـ 13 زائد انحياز واحد: 8 × (13 + 1).', en: 'Each of the 8 neurons carries one weight per input plus one bias: 8 × (13 + 1).' },
        { ar: 'طبقة الإخراج تقرأ مخرجات الطبقة المخفية الثمانية: 1 × (8 + 1).', en: 'The output layer reads the eight hidden outputs: 1 × (8 + 1).' },
        { ar: 'لاحظ أن input_shape لا يدخل في العدّ بأثر رجعي — كل طبقة تعدّ مدخلاتها الفورية فقط: 112 ثم 9.', en: 'Note that input_shape does not feed backwards into the count — each layer counts only its immediate inputs: 112 then 9.' },
        { ar: 'المخرج سطران: الرقم الأول 112 والثاني 9.', en: 'The output is two lines: 112 first, then 9.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.sequential-reading',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في كود الكتاب: model.fit(X, y, epochs=100, batch_size=32, verbose=0). ما الذي يضبطه batch_size تحديدًا؟',
        en: 'In the book\u2019s code: model.fit(X, y, epochs=100, batch_size=32, verbose=0). What exactly does batch_size control?',
      },
      options: [
        { id: 'a', text: { ar: 'عدد الدورات الكاملة على مجموعة البيانات كاملة', en: 'The number of full passes over the whole dataset' } },
        { id: 'b', text: { ar: 'حجم عينة الملاحظات المستخدمة في كل تحديث واحد للتدرج (تدريب مصغّرات)', en: 'How many observations feed each single gradient update (mini-batch training)' } },
        { id: 'c', text: { ar: 'حجم خطوة التحديث بعد حساب التدرج (معدل التعلم)', en: 'The size of the update step after the gradient is computed (the learning rate)' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'epochs هي التي تعدّ الدورات الكاملة — 100 دورة هنا وليس لها علاقة بـ batch_size.', en: 'epochs is what counts full passes — 100 of them here, unrelated to batch_size.' },
        { ar: 'الكتاب يشرح التدريب المصغّرات: تُدار الملاحظات على دفعات صغيرة، وكل دفعة تنتج تحديث تدرج واحد.', en: 'The book describes mini-batch training: observations flow in small chunks, and each chunk produces one gradient update.' },
        { ar: 'معدل التعلم وسيط في المحسّن عند compile — لا علاقة له بحجم الدفعة.', en: 'The learning rate lives in the optimizer at compile time — nothing to do with the chunk size.' },
        { ar: 'الجواب: b — batch_size = 32 يعني 32 ملاحظة لكل تحديث.', en: 'Answer: b — batch_size = 32 means 32 observations per gradient update.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import math\nimport minigrad\n\nxs = [[round(-3 + 0.55 * i, 2)] for i in range(12)]\nys = [0.5 * x[0] + 0.3 * math.sin(2 * x[0]) for x in xs]\n\nfor lr in [0.02, 0.08, 0.2]:\n    model = minigrad.MLP(1, [8], seed=7)\n    h = minigrad.sgd(model, xs, ys, loss_fn=minigrad.mse, epochs=150, lr=lr)\n    print('lr=%.2f  start=%.4f  end=%s' % (lr, h[0], ('%.4f' % h[-1])))\n\n# جرّب: عند lr=0.2 تنفجر الخطوات إلى nan — التفعيلات تكبر حتى تفيض. جرّب 0.15 و0.12.\n# try: at lr=0.2 the steps blow up to nan — activations overflow. Probe 0.15 and 0.12.\n# جرّب: غيّر seed إلى 3 أو 11 — هل تتغير الخسارة النهائية كثيرًا؟\n# try: change seed to 3 or 11 — does the final loss move much?\n",
      prompt: {
        ar: 'الملعب يجرّب ثلاثة معدلات تعلّم على الشبكة نفسها و150 حقبة. لاحظ انفجار lr=0.2 إلى nan — هذا هو "القفز فوق القاع" الذي حذّر منه الكتاب، بصيغة أشد.',
        en: 'The sandbox tries three learning rates on the same net for 150 epochs. Watch lr=0.2 explode into nan — the "jumping over the bowl" the book warns about, in its harshest form.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ماذا يمثل history[299] في تاريخ الخسارة العائد من minigrad.sgd بعد 300 حقبة؟',
            en: 'What does history[299] represent in the loss history returned by minigrad.sgd after 300 epochs?',
          },
          options: [
            { id: 'a', text: { ar: 'مشتقة الخسارة عند آخر معامل محدث', en: 'The derivative of the loss at the last updated parameter' } },
            { id: 'b', text: { ar: 'خسارة MSE الكاملة على النقاط الـ 12 بعد التحديث رقم 300', en: 'The full MSE over the 12 points after the 300th update' } },
            { id: 'c', text: { ar: 'متوسط التدرجات عبر الحقب الثلاثمئة', en: 'The average gradient across the 300 epochs' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'sgd يسجل loss.data لكل حقبة بعد بناء التوقعات وقبل التحديث التالي — العنصر 299 هو خسارة آخر حقبة محسوبة على كل النقاط (تدريب كامل الدفعة لا مصغّرات).',
            en: 'sgd appends loss.data each epoch, computed over all points (full-batch, not mini-batches) — entry 299 is the final epoch\u2019s loss.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'لماذا صنف الكتاب المصفوفي أسرع بكثير من الصنف الحلقي مع بقاء الرياضيات واحدة؟',
            en: 'Why is the book\u2019s matrix class far faster than its loop class while the math stays identical?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يستخدم عددًا أقل من المعاملات', en: 'Because it uses fewer parameters' } },
            { id: 'b', text: { ar: 'لأنه يستهلك ذاكرة أقل فلا يحتاج جمع قمامة', en: 'Because it consumes less memory and needs no garbage collection' } },
            { id: 'c', text: { ar: 'لأنه يستبدل آلاف الحلقات الصغيرة بضربات مصفوفية مركزة تُنفَّذ بكفاءة على مستوى منخفض', en: 'Because it replaces thousands of tiny loops with concentrated matrix products executed efficiently at a low level' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'العملية نفسها (جمع التدرجات عبر الملاحظات) تنفذ مرة واحدة كمنتجات مصفوفية بدل حلقة بايثون لكل ملاحظة. النتيجة رقمية متقاربة جدًا والفارق في زمن التنفيذ فقط.',
            en: 'The same operation (accumulating gradients across observations) runs once as matrix products instead of one Python loop per observation. The numeric results nearly coincide; only execution time differs.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في كود الكتاب، ما الفرق الجوهري بين بناء نموذج بالواجهة Sequential وبالواجهة Functional؟',
            en: 'In the book\u2019s code, what is the essential difference between building a model with the Sequential API versus the Functional API?',
          },
          options: [
            { id: 'a', text: { ar: 'Sequential ينشئ الحاوية ثم تضاف الطبقات تباعًا، بينما Functional يعرّف الدخل أولًا وتربط كل طبقة بمخرَج الطبقة السابقة صراحة', en: 'Sequential creates the container then layers are added in order, while Functional defines the input first and each layer is applied explicitly to the previous layer\u2019s output' } },
            { id: 'b', text: { ar: 'Sequential للتدريب وFunctional للتقييم فقط', en: 'Sequential is for training and Functional is evaluation-only' } },
            { id: 'c', text: { ar: 'Functional يجبر كل الطبقات على أن تكون مخفية', en: 'Functional forces every layer to be hidden' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الاختلاف في التركيب لا في القدرة: Sequential قائمة تُلحق بها الطبقات بترتيب، وFunctional تُبني كرسم يمرر الدخل عبر الطبقات صراحة (Input ثم Dense(...)(inputs) ثم Model) — وهذا يسمح بأشكال تتعدى السلسلة الخطية.',
            en: 'The difference is wiring, not capability: Sequential is an ordered list you append layers to, while Functional builds a graph by explicitly passing values (an Input, then Dense(...)(inputs), then Model) — which unlocks shapes beyond a single chain.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'كود الكتاب بـ keras: Sequential أو Functional لبناء طبقات Dense، ثم compile وfit بتدريب مصغّرات (epochs دورات كاملة، batch_size عينات لكل تحديث). نفس شبكتنا، بواجهة صناعية.', en: 'The book\u2019s keras code: Sequential or Functional to stack Dense layers, then compile and fit with mini-batch training (epochs full passes, batch_size samples per update). Our same network behind an industrial interface.' },
        { ar: 'الصنفان في الكتاب — حلقة على الملاحظات مقابل تدرج مصفوفي للدفعة كاملة — يثبتان أن الترتيب في الذاكرة يغير السرعة لا النتيجة. minigrad يمثل الطرف الحلقي البطيء الواضح.', en: 'The book\u2019s two classes — observation loop vs full-batch matrix gradient — prove that memory layout changes speed, not results. minigrad embodies the clear, slow, loop end of that spectrum.' },
        { ar: 'تدريب حقيقي منجز: شبكة 1-8-1 على 12 نقطة، 300 حقبة بمعدل 0.08 — الخسارة 4.397775 ثم 0.017658 ثم 0.017383 عند 0/100/299، أي هبوط فوق 99.6%. ومعدل تعلم مبالغ فيه (0.2) ينفجر إلى nan.', en: 'A real completed run: a 1-8-1 net on 12 points, 300 epochs at lr 0.08 — loss 4.397775, then 0.017658, then 0.017383 at 0/100/299, a >99.6% drop. An oversized rate (0.2) explodes into nan.' },
      ],
      reflectPrompt: {
        ar: 'درّبنا بدفعة كاملة بينما keras يدرب بمصغّرات. ماذا يتغير في مسار الخسارة لو صغّرنا الدفعة — وما الثمن الذي ندفعه في minigrad لو حاولنا تنفيذ المصغّرات بعقده الـ Value؟',
        en: 'We trained full-batch while keras trains in mini-batches. How would a smaller batch reshape the loss path — and what price would minigrad pay trying to run mini-batches through its Value nodes?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'MLS', section: 'mls.ch7.s3' },
      ],
    },
  ],
  sources: [
    { book: 'MLS', section: 'mls.ch7.s3' },
  ],
} satisfies Lesson;

export default lesson;
