import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch3.l1 — "Linear Regression and the Model-Data-Trainer Design"
 * الانحدار الخطي وتصميم Model-Data-Trainer
 * Aligned with D2L ch3 s1 (Linear Regression) + s2 (Object-Oriented Design for
 * Implementation). All expression is original — a paraphrase of the source's
 * ideas, never a verbatim translation. Runnable design: normal equations plus
 * three full-batch SGD steps on a 4-point dataset, and a miniature of the
 * book's add_to_class / save_hyperparameters scaffolding. Every printed
 * literal verified under CPython 3. Deterministic only: no input(), no exit().
 */
const lesson = {
  id: 'd2l.ch3.l1',
  version: 1,
  part: 'II',
  track: 'A3',
  book: 'D2L',
  chapter: 3,
  title: {
    ar: 'الانحدار الخطي وتصميم Model-Data-Trainer',
    en: 'Linear Regression and the Model-Data-Trainer Design',
  },
  estimatedMinutes: 30,
  prerequisites: ['mls.ch7.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قبل الشبكات العميقة يوجد أبسط نموذج ممكن: الانحدار الخطي، وفيه تظهر كل قطع التدريب التي سترافقنا في الفصول القادمة — نموذج، دالة خسارة، خوارزمية تحسين، وتقييم. في هذا الدرس تحل المعادلات الطبيعية لمشكلة أسعار صغيرة، ثم تشغّل خطوات minibatch SGD بنفسك، وتبني نسخة مصغرة من الهيكل الكائني الذي يقوم عليه كل كود الكتاب: Module وDataModule وTrainer.',
        en: 'Before deep networks there is the simplest possible model: linear regression, and inside it live every training component that will accompany us for the rest of the book — a model, a loss function, an optimization algorithm, and evaluation. In this lesson you solve the normal equations for a tiny house-price problem, run minibatch SGD steps by hand, and build a miniature of the object-oriented scaffolding the whole book builds on: Module, DataModule and Trainer.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'النموذج والخسارة والتحسين ثم الهيكل الكائني', en: 'Model, loss, optimization, then the OOD scaffolding' },
      chunks: [
        {
          ar: 'الانحدار يتنبأ بقيمة عددية. النموذج المفترض أن العلاقة تقارب الخطية: ŷ = w·x + b، حيث w الأوزان التي تقيس تأثير كل خاصية وb الانحياز الذي يسمح بأي خط لا يمر بالمبدأ. الخسارة القياسية هي متوسط مربع الخطأ ½(ŷ − y)²؛ الأخطاء الكبيرة تعاقَب أقوى بسبب التربيع. عند افتراض ضوضاء غاوسية ε ∼ N(0, σ²) فإن تقليل MSE يكافئ تقدير الإمكان الأعظم maximum likelihood للمعاملات. حل تحليلي موجود (المعادلات الطبيعية) لكننا نتدرب عادة بـ minibatch SGD: اسحب دفعة صغيرة، احسب التدرج، وحدّث بمعامل التعلم η — وهما hyperparameters يختارهما المستخدم ويقيس أثرهما على بيانات تحقق.',
          en: 'Regression predicts a numerical value. The model assumes the relationship is roughly linear: ŷ = w·x + b, where the weights w scale each feature and the bias b lets the line avoid the origin. The standard loss is mean squared error ½(ŷ − y)²; big mistakes get punished hardest because of the square. Under a Gaussian noise assumption ε ∼ N(0, σ²), minimizing MSE is exactly maximum likelihood estimation of w and b. An analytic solution exists (the normal equations), but we usually train with minibatch SGD: draw a small batch, compute the gradient, update with learning rate η — hyperparameters the user sets and validates on held-out data.',
        },
        {
          ar: 'الكتاب ينظم كل التدريب بثلاثة أصناف: Module يحمل النموذج وخسارته والمحسّن (forward وtraining_step وconfigure_optimizers)؛ DataModule يوفر train_dataloader وval_dataloader كمولّدات دفعات؛ وTrainer يجمعهما في fit ويدير حلقة العصور. أداتان تُسهّلان الكتابة: المزخرف add_to_class الذي يضيف دالة كطريقة لصنف بعد إنشائه، وsave_hyperparameters الذي يحفظ معاملات __init__ كخصائص تلقائية. في الكتاب يرث Module من `nn.Module` في PyTorch، وتُعرَّف الطبقة الكثيفة بـ `nn.Linear` أو `nn.LazyLinear`.',
          en: 'The book organizes training with three classes: Module holds the model, its loss and the optimizer (forward, training_step, configure_optimizers); DataModule provides train_dataloader and val_dataloader as batch generators; and Trainer combines both in fit and runs the epoch loop. Two utilities make this pleasant: the add_to_class decorator, which registers a function as a method on a class even after instances exist, and save_hyperparameters, which stores __init__ arguments as attributes automatically. In the book Module subclasses PyTorch `nn.Module`, and dense layers come from `nn.Linear` or `nn.LazyLinear`.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'معادلات طبيعية + خطوات SGD + هيكل كائني مصغر',
        en: 'Normal equations + SGD steps + a miniature OOD scaffold',
      },
      code: "# Part 1: the model, the loss, the analytic solution, then SGD steps\nxs = [0.0, 1.0, 2.0, 3.0]\nys = [1.0, 3.0, 4.5, 6.5]\nn = len(xs)\nmx = sum(xs) / n\nmy = sum(ys) / n\nSxy = sum((xs[i] - mx) * (ys[i] - my) for i in range(n))\nSxx = sum((xs[i] - mx) ** 2 for i in range(n))\nw = Sxy / Sxx\nb = my - w * mx\nprint('normal equations: Sxy=%.1f Sxx=%.1f -> w=%.4f b=%.4f' % (Sxy, Sxx, w, b))\npreds = [w * x + b for x in xs]\nmse = sum((preds[i] - ys[i]) ** 2 for i in range(n)) / n\nprint('preds:', ['%.2f' % p for p in preds], '| train mse=%.4f' % mse)\nprint('new house x=4 -> price %.2f' % (w * 4 + b))\n\nw, b, lr = 0.0, 0.0, 0.1\nfor step in range(3):\n    errs = [w * x + b - ys[i] for i, x in enumerate(xs)]\n    gw = sum(xs[i] * errs[i] for i in range(n)) / n\n    gb = sum(errs) / n\n    w -= lr * gw\n    b -= lr * gb\n    print('sgd step %d: w=%.4f b=%.4f' % (step + 1, w, b))\n\n# Part 2: the book's object-oriented scaffolding, in miniature\ndef add_to_class(Class):\n    def wrapper(obj):\n        setattr(Class, obj.__name__, obj)\n    return wrapper\n\nclass HousePricer:\n    def __init__(self):\n        self.bias = 42\n\npricer = HousePricer()\n\n@add_to_class(HousePricer)\ndef quote(self):\n    return 'b = %d' % self.bias\n\nprint(pricer.quote())\n\nclass HyperParameters:\n    def save_hp(self, ignore, **kwargs):\n        for key, value in kwargs.items():\n            if key not in ignore:\n                setattr(self, key, value)\n\nclass LinearModel(HyperParameters):\n    def __init__(self, lr, epochs, debug=False):\n        self.save_hp(['debug'], lr=lr, epochs=epochs, debug=debug)\n\nmodel = LinearModel(lr=0.03, epochs=3, debug=True)\nprint('hp saved: lr=%s epochs=%s debug_missing=%s' % (model.lr, model.epochs, not hasattr(model, 'debug')))",
      explanation: {
        ar: 'المعادلات الطبيعية أعطت w=1.8000 وb=1.0500 على نقطتنا الأربع، بخسارة تدريب 0.0125 وتوقع 8.25 للمنزل الجديد — وهذا هو الحل التحليلي الذي نادرًا ما يتوفر في التعلم العميق. خطوات SGD انطلقت من w=b=0: بعد ثلاث خطوات وصلت w=1.5064 وb=0.7235، تقترب تدريجيًا من الحل التحليلي. الجزء الثاني يُظهر فائدة add_to_class: عرّفنا quote خارج الصنف ثم استدعيناها على نسخة قائمة، فقرأت self.bias=42؛ وsave_hp خزّن lr وepochs وتجاهل debug كما يفعل الكتاب مع قائمة ignore.',
        en: 'The normal equations gave w=1.8000 and b=1.0500 on our four points, with training MSE 0.0125 and a prediction of 8.25 for the new house — the analytic solution we rarely get in deep learning. The SGD steps started from w=b=0: after three steps they reached w=1.5064 and b=0.7235, edging toward the analytic answer. Part two shows the add_to_class trick: quote was defined outside the class yet called on a live instance, reading self.bias=42; save_hp stored lr and epochs and skipped debug, just like the book with its ignore list.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.grad-and-step',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ دالتين: grad_mse(xs, ys, w, b) تعيد (gw, gb) تدرج متوسط خسارة المربعات ½(ŷ−y)² على الدفعة كاملة؛ وsgd_step(w, b, gw, gb, lr) تعيد الزوج المحدَّث (w − lr·gw, b − lr·gb).',
        en: 'Implement two functions: grad_mse(xs, ys, w, b) returns (gw, gb), the gradient of the mean squared loss ½(ŷ−y)² over the full batch; and sgd_step(w, b, gw, gb, lr) returns the updated pair (w − lr·gw, b − lr·gb).',
      },
      starterCode: "def grad_mse(xs, ys, w, b):\n    ...  # TODO: errs = predictions - labels, then mean of x*err and mean of err\n\ndef sgd_step(w, b, gw, gb, lr):\n    ...  # TODO: one subtraction per parameter\n",
      solution: "def grad_mse(xs, ys, w, b):\n    n = len(xs)\n    errs = [w * x + b - ys[i] for i, x in enumerate(xs)]\n    gw = sum(xs[i] * errs[i] for i in range(n)) / n\n    gb = sum(errs) / n\n    return (gw, gb)\n\ndef sgd_step(w, b, gw, gb, lr):\n    return (w - lr * gw, b - lr * gb)",
      tests: [
        {
          id: 't1',
          name: { ar: 'التدرج عند نقطة البداية (0,0)', en: 'Gradient at the origin (0,0)' },
          code: "g = grad_mse([0.0, 1.0, 2.0, 3.0], [1.0, 3.0, 4.5, 6.5], 0.0, 0.0)\nassert abs(g[0] + 7.875) < 1e-9 and abs(g[1] + 3.75) < 1e-9, 'expected (-7.875, -3.75) | actual: %r' % (g,)",
          expected: '(-7.875, -3.75)',
        },
        {
          id: 't2',
          name: { ar: 'التدرج صفير عند الحل التحليلي', en: 'Gradient vanishes at the analytic solution' },
          code: "g = grad_mse([0.0, 1.0, 2.0, 3.0], [1.0, 3.0, 4.5, 6.5], 1.8, 1.05)\nassert abs(g[0]) < 1e-9 and abs(g[1]) < 1e-9, 'expected ~(0, 0) | actual: %r' % (g,)",
          expected: '(0, 0) up to 1e-9',
        },
        {
          id: 't3',
          name: { ar: 'خطوة واحدة تكفي لرؤية القفزة', en: 'One step shows the jump' },
          code: "w, b = sgd_step(0.0, 0.0, -7.875, -3.75, 0.1)\nassert abs(w - 0.7875) < 1e-9 and abs(b - 0.375) < 1e-9, 'expected (0.7875, 0.375) | actual: %r' % ((w, b),)",
          expected: '(0.7875, 0.375)',
        },
      ],
      hints: [
        { ar: 'الخطأ لكل نقطة هو errs[i] = w*xs[i] + b - ys[i]؛ ثم gw = متوسط xs[i]*errs[i] وgb = متوسط errs.', en: 'Per-point error is errs[i] = w*xs[i] + b - ys[i]; then gw = mean of xs[i]*errs[i] and gb = mean of errs.' },
        { ar: 'قسّم على len(xs) لا على 2 — التدرج متوسط على الدفعة.', en: 'Divide by len(xs), not by 2 — the gradient is a batch mean.' },
        { ar: 'قيم تحقق: عند (0,0) التدرج (-7.875, -3.75)، وعند (1.8, 1.05) هو الصفر تقريبًا.', en: 'Sanity values: at (0,0) the gradient is (-7.875, -3.75); at (1.8, 1.05) it is zero up to floating noise.' },
        { ar: 'sgd_step لا تحتاج حلقة: الطرح لكل معامل مرة واحدة فقط.', en: 'sgd_step needs no loop: one subtraction per parameter.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-mle',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بافتراض أن ضوضاء ε تتبع التوزيع الغاوسي N(0, σ²)، فإن تقليل متوسط مربع الخطأ يكافئ أي مبدأ إحصائي؟',
        en: 'Assuming the noise ε follows a Gaussian N(0, σ²), minimizing mean squared error is equivalent to which statistical principle?',
      },
      options: [
        { id: 'a', text: { ar: 'تعظيم إنتروبيا البيانات', en: 'Maximizing the entropy of the data' } },
        { id: 'b', text: { ar: 'تقدير الإمكان الأعظم maximum likelihood للأوزان والانحياز', en: 'Maximum likelihood estimation of the weights and bias' } },
        { id: 'c', text: { ar: 'تقليل تباين الخصائص نفسها', en: 'Minimizing the variance of the features themselves' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اكتب إمكان رؤية y: كثافة غاوسية تعظمها أصغر قيمة لـ (y − ŷ)².', en: 'Write the likelihood of seeing y: a Gaussian density maximized by the smallest (y − ŷ)².' },
        { ar: 'طبّق اللوغاريتم: −log P(y|x) يتضمن حدين، الأول ثابت والثاني هو مربع الخطأ نفسه.', en: 'Take the log: −log P(y|x) has two terms, one constant and one that is exactly the squared error.' },
        { ar: 'لهذا اعتبرنا σ ثابتة — لا تؤثر على الحل.', en: 'That is why we treat σ as fixed — it does not change the solution.' },
        { ar: 'الجواب: b — الجسر بين غاوس وتقليل MSE هو تقدير الإمكان الأعظم.', en: 'Answer: b — the bridge between Gauss and minimizing MSE is maximum likelihood.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "xs = [0.0, 1.0, 2.0, 3.0]\nys = [1.0, 3.0, 4.5, 6.5]\n\ndef full_batch_gd(xs, ys, lr, steps):\n    w, b = 0.0, 0.0\n    for _ in range(steps):\n        errs = [w * x + b - ys[i] for i, x in enumerate(xs)]\n        gw = sum(xs[i] * errs[i] for i in range(len(xs))) / len(xs)\n        gb = sum(errs) / len(xs)\n        w -= lr * gw\n        b -= lr * gb\n    return w, b\n\nfor lr in (0.05, 0.1, 0.2, 0.5):\n    w, b = full_batch_gd(xs, ys, lr, 20)\n    print('lr=%.2f -> w=%.4f b=%.4f' % (lr, w, b))\n\n# جرّب: قارن النتيجة بالحل التحليلي w=1.8 وb=1.05 بعد 20 خطوة و100 خطوة.\n# try: compare against the analytic solution w=1.8, b=1.05 after 20 and 100 steps.\n# جرّب: أضف نقطة شاذة ys = [1.0, 3.0, 4.5, 20.0] ولاحظ كيف يجرّ التربيع النموذج نحوها.\n# try: add an outlier ys = [1.0, 3.0, 4.5, 20.0] and watch the square drag the fit toward it.\n",
      prompt: {
        ar: 'الملعب يشغّل GD كامل الدفعة بعدة معدلات تعلم حتى يقترب من الحل التحليلي، ويكشف حساسية الخسارة التربيعية للقيم الشاذة.',
        en: 'The sandbox runs full-batch GD at several learning rates until it approaches the analytic solution, and exposes the squared loss sensitivity to outliers.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في تصميم الكتاب الكائني: أي صنف يجمع Module وDataModule ويدير حلقة العصور في fit؟',
            en: 'In the book object-oriented design: which class combines a Module and a DataModule and drives the epoch loop in fit?',
          },
          options: [
            { id: 'a', text: { ar: 'Module نفسه', en: 'Module itself' } },
            { id: 'b', text: { ar: 'Trainer', en: 'Trainer' } },
            { id: 'c', text: { ar: 'SGD', en: 'SGD' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'Trainer يستقبل model وdata في fit، يجهّز المحمّلات والمحسّن، ثم يكرر fit_epoch عبر max_epochs. Module يحمل النموذج والخسارة، وDataModule يوفر الدفعات — والربط بينها مسؤولية Trainer.',
            en: 'Trainer receives model and data in fit, prepares the loaders and optimizer, then repeats fit_epoch for max_epochs. Module holds the model and loss, DataModule supplies batches — wiring them is the Trainer job.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما دور الانحياز b في ŷ = w·x + b؟',
            en: 'What does the bias b do in ŷ = w·x + b?',
          },
          options: [
            { id: 'a', text: { ar: 'يحدد قيمة التوقع عندما تكون كل الخصائص صفرًا، فيسمح بأي خط لا يمر بالمبدأ', en: 'It sets the prediction when all features are zero, allowing any line that misses the origin' } },
            { id: 'b', text: { ar: 'يقيس تأثير كل خاصية على الناتج', en: 'It measures each feature influence on the output' } },
            { id: 'c', text: { ar: 'يقلل الخسارة تلقائيًا أثناء التدريب', en: 'It automatically reduces the loss during training' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأوزان w هي التي تقيس أثر الخصائص؛ الانحياز إزاحة ثابتة تضمن تمثيل كل الدوال الأفينية لا الخطوط المارة بالمبدأ فقط. لهذا نادرًا ما نضيف عليه عقوبة تنظيم.',
            en: 'The weights w scale feature influence; the bias is a constant offset ensuring we represent every affine function, not only lines through the origin. That is also why it is usually left unregularized.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'معدل التعلم η وحجم الدفعة مصنّفان كـ…',
            en: 'The learning rate η and the batch size are classified as…',
          },
          options: [
            { id: 'a', text: { ar: 'معاملات يتعلمها النموذج بالانتشار الخلفي', en: 'Parameters the model learns by backpropagation' } },
            { id: 'b', text: { ar: 'مخرجات يتوقعها النموذج', en: 'Outputs predicted by the model' } },
            { id: 'c', text: { ar: 'hyperparameters يضبطهما المستخدم ويقيس أثرهما على بيانات التحقق', en: 'Hyperparameters set by the user and judged on validation data' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'hyperparameters لا تُحدَّث في حلقة التدريب؛ نختارها قبل التشغيل ونقيس أثرها على مجموعة تحقق منفصلة. المعاملان w وb وحدهما ما يحدثه التدرج.',
            en: 'Hyperparameters are not updated in the training loop; we pick them beforehand and measure their effect on a separate validation set. Only w and b are what the gradient updates.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الانحدار الخطي يتنبأ بقيمة عددية بـ ŷ = w·x + b وخسارة مربعة؛ تحت ضوضاء غاوسية فإن تقليل MSE = تقدير الإمكان الأعظم، والتدريب عمليًا minibatch SGD بمعامل تعلم وحجم دفعة من اختيار المستخدم (الهدف من s1 الانحدار الخطي).', en: 'Linear regression predicts a number with ŷ = w·x + b and squared loss; under Gaussian noise minimizing MSE equals maximum likelihood, and in practice we train with minibatch SGD whose learning rate and batch size are user-set hyperparameters (goal of s1 Linear Regression).' },
        { ar: 'الهيكل الكائني يفصل المخاوف: Module للنموذج والخسارة والمحسّن، DataModule لمحمّلات الدفعات، Trainer للحلقة — مع add_to_class وsave_hyperparameters لتنظيم الكود (الهدف من s2 التصميم الكائني للتنفيذ).', en: 'The OOD design separates concerns: Module for model/loss/optimizer, DataModule for batch loaders, Trainer for the loop — with add_to_class and save_hyperparameters keeping the code tidy (goal of s2 Object-Oriented Design for Implementation).' },
      ],
      reflectPrompt: {
        ar: 'المعادلات الطبيعية تعطي حلًا فوريًا للانحدار الخطي. لماذا إذن يصر الكتاب على تدريب SGD من الصفر قبل الانتقال إلى الشبكات العميقة؟',
        en: 'The normal equations hand you a solution instantly for linear regression. Why does the book insist on training SGD from scratch before moving to deep networks?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch3.s1' },
        { book: 'D2L', section: 'd2l.ch3.s2' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch3.s1' },
    { book: 'D2L', section: 'd2l.ch3.s2' },
  ],
} satisfies Lesson;

export default lesson;
