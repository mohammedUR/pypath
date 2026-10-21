/**
 * swe.ch7.l2 — واجهات المستخدم: النموذج-المنظر-المتحكم /
 *              User Interfaces: Model-View-Controller
 * SWE ch7 — s3 User Interfaces: Model-View-Controller (ص181-184 / pp.181-184).
 * Runnable design: a tiny MVC simulation — a model dict, view render functions,
 * a controller applying a fixed event sequence; render printed after each step.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch7.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 7,
  title: { ar: 'واجهات المستخدم: النموذج-المنظر-المتحكم', en: 'User Interfaces: Model-View-Controller' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch7.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'شاشة واحدة في تطبيق العيادة ترسم جدول المواعيد، وتفحص النقرات، وتحسب غرامة التأخير، وتحفظ قواعد الفواتير كلها. تحديث المظهر طلبتها المصممة، واختصار لوحة المفاتيح طلبه فريق الدعم، وقاعدة الحساب غيّرها المحاسب — وكل طلب يمس الملف كله، ولا شيء يمكن اختباره دون شاشة تعمل فعلًا. MVC ليس ترفًا نظريًا: إنه جواب سؤال عملي — كيف نجعل المظهر والمدخلات والقواعد تتغير كلٌّ على حدة، ونختبر القواعد وحدها؟',
        en: 'One screen in the clinic app draws the appointment table, inspects clicks, computes the late fee, and holds every invoice rule. A restyle comes from the designer, a keyboard shortcut from support, a calculation change from the accountant — and each request touches the whole file, with nothing testable without a running screen. MVC is not academic ceremony: it answers a practical question — how do appearance, input, and rules change independently, and how do you test the rules alone?',
      },
    },
    {
      kind: 'predict',
      code: 'model = {"count": 0}\ndef view(m):\n    return "count=" + str(m["count"])\ndef controller(m, events):\n    for e in events:\n        m["count"] += 1 if e == "+" else -1\n        print(view(m))\ncontroller(model, ["+", "+"])\n',
      question: {
        ar: 'ماذا يطبع هذا المقطع؟ وأي دور من أدوار MVC مفقود هنا؟',
        en: 'What does this snippet print? And which of the three MVC roles is missing here?',
      },
      reveal: {
        ar: 'يطبع count=1 ثم count=2. المتحكم يعدل النموذج ثم يستدعي الرسم بنفسه — يدويًا. في MVC الكامل النموذج هو من يعلن تغيّره، فتُحدَّث كل المناظر المشتركة دون أن يعرفها.',
        en: 'It prints count=1 then count=2. The controller mutates the model and calls the render itself — by hand. In full MVC the model announces its own change, so every subscribed view refreshes without the model knowing it.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'ثلاث هموم، ثلاثة إيقاعات تغيّر', en: 'Three concerns, three change rhythms' },
      chunks: [
        {
          ar: 'التطبيق التفاعلي يحمل ثلاثة هموم منفصلة: عرض المعلومات، وفهم حركات المستخدم، وقواعد العمل والتخزين. وكل همّ يتغير لسبب مختلف: المصممة تعيد تشكيل المنظر، وفريق المنتج يضيف اختصارًا، وقواعد العمل تتغير حين يتغير المجال نفسه. إذا سكنت الثلاثة كتلة واحدة — ذاك «العنصر الذكي» الذي يرسم وينقر ويحسب — فقد كل تغيير يهدد الباقي، ولا يمكن اختبار شيء دون شاشة حية. القرار الحاكم في MVC فصل الاهتمامات: البيانات والقواعد بعيدًا عن العرض، والعرض بعيدًا عن معالجة المدخلات. وقرار ثانٍ يتبعه: البيانات لا تعتمد على عرض بعينه، بل المناظر هي من تعتمد على البيانات — لأن نموذجًا واحدًا قد يغذي عدة عروض في الوقت نفسه، كجدول ورسم بياني لنفس الأرقام.',
          en: 'An interactive application carries three separate concerns: presenting information, interpreting user gestures, and owning business rules plus storage. Each concern changes for its own reasons: the designer reshapes the view, product adds a shortcut, and the domain changes the rules. If all three live in one blob — the "smart widget" that draws, clicks, and calculates — every change threatens the others and nothing is testable without a live screen. The governing decision in MVC is separation of concerns: data and rules apart from presentation apart from input handling. A second decision follows: the data must not depend on any particular display; displays depend on the data — because one model may feed several displays at once, like a table and a chart of the same numbers.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الأدوار الثلاث والحلقة', en: 'The three roles and the loop' },
      chunks: [
        {
          ar: 'النموذج (model) يحمل الحالة وقواعد العمل ولا يعرف شيئًا عن الشاشة: كائن صريح يمكن تشغيله في مهمة ليلية بلا واجهة، وعندما تتغير حالته يعلن ذلك لمن يستمع. المنظر (view) يقرأ النموذج ويرسمه فقط — بلا قواعد عمل له، وقد توجد عدة مناظر لنفس النموذج. المتحكم (controller) يفسر المدخلات — نقرات وضغطات — ويحولها إلى عمليات على النموذج. الحلقة التي تجعل MVC أكثر من ثلاث صناديق: المنظر يراقب النموذج؛ حين يعلن النموذج تغيّره يعيد كل منظر القراءة والرسم. الكسب: تطور مستقل للثلاثة، واختبار كل القواعد وحداتيًا دون محاكاة شاشة. الثمن: بنية إضافية في الحالات الصغيرة، وحد فاصل بين منطق المتحكم ومنطق النموذج يظل موضع جدل دائم — وله ولدت نسخ مثل MVP وMVVM.',
          en: 'The model holds state and business rules and knows nothing about the screen: a plain object that could run in a nightly batch job, announcing changes to whoever listens. The view reads the model and draws — no business rules of its own; several views may show one model. The controller interprets input — clicks, keystrokes — and turns it into operations on the model. The wiring that makes MVC more than three boxes: the view observes the model; when the model announces a change, every view re-reads and redraws. You gain independent evolution of all three and unit-testable rules with no screen simulation; you pay extra structure in small cases and a perennial boundary debate between controller logic and model logic — the debate that spawned MVP and MVVM.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المنظر النحيف وMVC في الواقع', en: 'The humble view, and MVC in the wild' },
      chunks: [
        {
          ar: 'أهم انضباط داخلي في MVC: اجعل المنظر نحيفًا — مبدأ المنظر المتواضع (humble view). المنظر يقرأ قيمًا من النموذج ويوزعها على الواجهات، بلا قواعد ولا حسابات مهمة ولا حالة لا تُستعاد من النموذج. لماذا هذا الإلحاح؟ لأن المنظر هو الجزء الوحيد الذي يصعب اختباره آليًا: اختبارات القواعد سريعة وموثوقة، واختبار شاشة مرسومة بطيء وهش. كل فرع أو حساب يتسلل إلى المنظر يهرب من اختباراتك ويختبئ حيث يكتشفه مستخدم ينقر بالخطأ. ادفع المنطق إلى النموذج أو إلى view-model محسوب مسبقًا فتعود تحت الاختبار. وفي الواقع تعيد الأطر تسمية الأدوار: Django تسمي نسختها MTV، وRails تطبق MVC الخادمي، وتطبيقات SPA تضع الفصل نفسه في المتصفح مع مخزن أحادي الاتجاه مثل Redux. الثابت عند الجميع: النموذج لا يعتمد على المنظر.',
          en: 'The single most valuable discipline inside MVC: keep the view thin — the humble view. A view reads values from the model and maps them onto widgets, with no rules, no meaningful calculations, and no state that is not trivially reconstructible from the model. Why so insistent? The view is the one part you cannot easily test: model tests are fast and reliable, rendered-screen tests are slow and brittle. Every branch that creeps into a view escapes your fast tests and hides where only a human clicking around will find it. Push logic down into the model or a precomputed view-model and it is back under test. In the wild, frameworks reshuffle the names: Django calls its variant MTV, Rails runs classic server-side MVC, and SPAs apply the same split in the browser with a one-way store like Redux. The constant everywhere: the model does not depend on the view.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نموذج واحد، منظران، حلقة واحدة', en: 'One model, two views, one loop' },
      code: 'class Model:\n    def __init__(self):\n        self.count = 0\n        self.views = []\n    def subscribe(self, v):\n        self.views.append(v)\n    def set(self, n):\n        self.count = n\n        for v in self.views:\n            print(v(self))     # the model announces; views redraw\n\ndef text_view(m):\n    return "text: count=" + str(m.count)\n\ndef bar_view(m):\n    return "bar: " + "#" * m.count\n\ndef controller(m, events):\n    for e in events:\n        if e == "+":\n            m.set(m.count + 1)\n        else:\n            m.set(m.count - 1)\n\nm = Model()\nm.subscribe(text_view)\nm.subscribe(bar_view)\ncontroller(m, ["+", "+", "-"])\n',
      explanation: {
        ar: 'النموذج يعرف فقط: «عندي مشتركون، سأستدعيهم بعد كل تغيير». المنظران قارئان صرفان: الأول يطبع رقمًا والثاني يطبع مربعات. المتحكم يترجم أحداث + و- إلى استدعاءات set. كل سطر مطبوع يوثق دورة كاملة عبر الأدوار الثلاثة: حدث يفسره المتحكم، تحديث في النموذج، إعادة رسم للمناظر. أضف منظرًا ثالثًا بسطر subscribe واحد ولا يتحرك النموذج حرفًا — هذا العزل بالضبط هو ما يجعل قواعدك قابلة للاختبار دون أي شاشة.',
        en: 'The model knows only: "I have subscribers; after every change I call them." Both views are pure readers: one prints a number, the other prints hash marks. The controller translates + and - events into set calls. Every printed line documents one full pass through the three roles: an event the controller interprets, a model update, a redraw of the views. Add a third view with a single subscribe line and the model does not move — that separation is exactly what makes your rules testable without any screen.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.mvc-cart',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابن حلقة MVC صغيرة لسلة مشتريات: المتحكم يستقبل أحداث add وremove، يعدل عداد items في النموذج، ويطبع render(m) بعد كل حدث. بترتيب الأحداث add, add, remove يجب أن يطبع: cart: items=1 ثم cart: items=2 ثم cart: items=1، وأن تبقى قيمة model["items"] تساوي 1 في النهاية.',
        en: 'Build a tiny MVC loop for a shopping cart: the controller receives add and remove events, updates the items counter in the model, and prints render(m) after each event. For the sequence add, add, remove it must print cart: items=1, then cart: items=2, then cart: items=1, and model["items"] must end equal to 1.',
      },
      starterCode: 'model = {"items": 0}\n\ndef render(m):\n    return "cart: items=" + str(m["items"])   # the view: reads, never mutates\n\ndef controller(m, events):\n    for e in events:\n        # TODO: "add" -> +1, "remove" -> -1, then print(render(m)) after EACH event\n        ...\n\ncontroller(model, ["add", "add", "remove"])\n',
      solution: 'model = {"items": 0}\n\ndef render(m):\n    return "cart: items=" + str(m["items"])\n\ndef controller(m, events):\n    for e in events:\n        if e == "add":\n            m["items"] += 1\n        elif e == "remove":\n            m["items"] -= 1\n        print(render(m))\n\ncontroller(model, ["add", "add", "remove"])\n',
      tests: [
        {
          id: 'renders-after-each',
          name: { ar: 'رسم بعد كل حدث', en: 'renders after each event' },
          code: "assert 'cart: items=1' in __learner_output__ and 'cart: items=2' in __learner_output__, 'expected: cart: items=1..2 lines | actual: %r' % __learner_output__",
        },
        {
          id: 'final-state',
          name: { ar: 'حالة النموذج النهائية', en: 'final model state' },
          code: "assert model[\"items\"] == 1, 'expected: model[items] == 1 | actual: %r' % model[\"items\"]",
        },
      ],
      hints: [
        { ar: 'المتحكم يترجم الحدث إلى عملية نموذج — هو لا يرسم بنفسه ولا يحسب قواعد عمل.', en: 'The controller translates an event into a model operation — it does not draw by itself nor compute business rules.' },
        { ar: "استخدم if/elif على قيمة e داخل الحلقة، وعدل m[\"items\"] وفق الحدث.", en: 'Use if/elif on the event e inside the loop and update m["items"] accordingly.' },
        { ar: "الهيكل: if e == 'add': m['items'] += 1 / elif e == 'remove': m['items'] -= 1 / ثم print(render(m)).", en: "The skeleton: if e == 'add': m['items'] += 1 / elif e == 'remove': m['items'] -= 1 / then print(render(m))." },
        { ar: 'الترتيب مهم: عدل الحالة أولًا ثم ارسم — render يقرأ النموذج بعد كل تغيير فتظهر القيمة الجديدة كل مرة.', en: 'Order matters: mutate state first, then render — render reads the model after each change so the fresh value shows every time.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-model',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يصر MVC على أن النموذج لا يعرف تفاصيل أي منظر؟',
        en: 'Why does MVC insist that the model knows no view details?',
      },
      options: [
        { id: 'a', text: { ar: 'حتى لا يتضخم حجم ملفات المشروع', en: 'So the project files do not grow in size' } },
        { id: 'b', text: { ar: 'ليبقى النموذج قابلًا للاختبار دون شاشة، ولتتمكن من إضافة مناظر أو تبديلها دون لمسه', en: 'So the model stays testable without a screen, and views can be added or swapped without touching it' } },
        { id: 'c', text: { ar: 'لأن المنظر يحتفظ بنسخة موثوقة من البيانات', en: 'Because the view keeps the authoritative copy of the data' } },
        { id: 'd', text: { ar: 'لأن المتحكم هو من يرسم الشاشة في الحقيقة', en: 'Because the controller is the one that actually draws the screen' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'تخيل تشغيل قواعد العمل في مهمة ليلية بلا أي واجهة إطلاقًا.', en: 'Imagine running the business rules in a nightly job with no UI at all.' },
        { ar: 'اسأل: من ينبغي أن يعتمد على من — البيانات على العرض أم العرض على البيانات؟', en: 'Ask: who should depend on whom — data on display, or display on data?' },
        { ar: 'تذكر: العرض هو الجزء الأعصى على الاختبار الآلي.', en: 'Remember: the view is the hardest part to test automatically.' },
        { ar: 'الإجابة الصحيحة b: اختبار بلا شاشة، ومناظر قابلة للإضافة والتبديل.', en: 'The right answer b: screen-free testing, and views you can add or swap freely.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-notify',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'النموذج يعلن والمنظر يطبع. تتبع التنفيذ واكتب المخرجات بالضبط.',
        en: 'The model announces and the view prints. Trace the execution and write the exact output.',
      },
      code: 'state = {"status": "booked"}\ndef notify():\n    print("display: " + state["status"])\ndef set_status(new):\n    state["status"] = new\n    notify()\nset_status("arrived")\nset_status("done")\n',
      answer: 'display: arrived\ndisplay: done',
      solution: 'display: arrived\ndisplay: done',
      hints: [
        { ar: 'كل استدعاء set_status يعدل الحالة ثم يستدعي notify في الحال.', en: 'Every set_status call mutates the state then calls notify immediately.' },
        { ar: 'كل استدعاء notify يطبع سطرًا واحدًا يحمل حالة اللحظة.', en: 'Each notify call prints one line carrying the state at that moment.' },
        { ar: 'الاستدعاءان متتاليان: أولًا arrived ثم done.', en: 'The two calls are consecutive: first arrived, then done.' },
        { ar: 'الناتج سطران: display: arrived ثم display: done.', en: 'The output is two lines: display: arrived then display: done.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-humble',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'القاعدة الذهبية داخل MVC: اجعل المنظر نحيفًا بلا قواعد عمل؛ يسمي الكتاب ذلك مبدأ المنظر المتواضع — بالإنجليزية ______ view. اكتب الكلمة الناقصة واحدة.',
        en: 'The golden rule inside MVC: keep the view thin, with no business rules — the book calls it the ______ view principle. Write the missing single word.',
      },
      answer: 'humble',
      solution: 'humble',
      hints: [
        { ar: 'صفة إنجليزية تعني المتواضع البسيط.', en: 'An English adjective meaning modest and unassuming.' },
        { ar: 'وردت في قسم keep views simple: المنظر لا يقرر شيئًا يذكر.', en: 'It appears in the keep-views-simple section: the view decides almost nothing.' },
        { ar: 'تبدأ بحرف h وتنتهي بحرف e.', en: 'It starts with h and ends with e.' },
        { ar: 'humble — المنظر المتواضع الذي لا يحمل منطقًا.', en: 'humble — the view that carries no logic.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: 'class Model:\n    def __init__(self):\n        self.items = 0\n        self.views = []\n    def subscribe(self, v):\n        self.views.append(v)\n    def set(self, n):\n        self.items = n\n        for v in self.views:\n            print(v(self))\n\ndef text_view(m):\n    return "cart: items=" + str(m.items)\n\ndef bar_view(m):\n    return "stock: " + "#" * m.items\n\ndef controller(m, events):\n    for e in events:\n        m.set(m.items + (1 if e == "add" else -1))\n\nm = Model()\nm.subscribe(text_view)\nm.subscribe(bar_view)\ncontroller(m, ["add", "add", "add", "remove"])\n# experiment: subscribe a THIRD view, or add events. The model never changes.\n',
      prompt: {
        ar: 'لديك نموذج مخزون ومنظران. أضف منظرًا ثالثًا يطبع تنبيهًا حين تتجاوز items العدد 2، دون تعديل النموذج إطلاقًا، ثم أضف حدثًا إضافيًا ولاحظ أن النموذج لم يتغير — تغيروا أنتم والمشترون فقط.',
        en: 'You have a stock model and two views. Add a third view that prints an alert when items exceeds 2 — without touching the model at all — then add an extra event and notice the model never changed; only you and the subscribers did.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1.controller',
          question: { ar: 'ضغط المستخدم زر «تأكيد الحجز». أي دور في MVC يفسر هذه الحركة ويحولها إلى عملية على النموذج؟', en: 'The user presses the confirm-booking button. Which MVC role interprets this gesture and turns it into an operation on the model?' },
          options: [
            { id: 'a', text: { ar: 'المنظر (view)', en: 'The view' } },
            { id: 'b', text: { ar: 'النموذج (model)', en: 'The model' } },
            { id: 'c', text: { ar: 'المتحكم (controller)', en: 'The controller' } },
            { id: 'd', text: { ar: 'قاعدة البيانات مباشرة', en: 'The database directly' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'المتحكم يعيش على حدود الإدخال: يقرأ الحركات ويحولها إلى عمليات، بينما المنظر يقرأ ويرسم والنموذج يحمل الحالة والقواعد.',
            en: 'The controller lives at the input boundary: it reads gestures and turns them into operations, while the view reads and draws and the model owns state plus rules.',
          },
        },
        {
          id: 'q2.testability',
          question: { ar: 'ما الكسب الأكبر من نموذج بلا أي اعتمادية على واجهة؟', en: 'What is the biggest gain from a model with zero UI dependency?' },
          options: [
            { id: 'a', text: { ar: 'حجم تطبيق أصغر على القرص', en: 'A smaller app on disk' } },
            { id: 'b', text: { ar: 'اختبار كل قواعد العمل وحداتيًا دون محاكاة شاشة', en: 'Unit-testing every business rule without simulating a screen' } },
            { id: 'c', text: { ar: 'شبكة أسرع بين الخادم والمتصفح', en: 'A faster network between server and browser' } },
            { id: 'd', text: { ar: 'الاستغناء عن المتحكم كليًا', en: 'Eliminating the controller entirely' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المنظر هو الجزء الذي يصعب اختباره؛ بقاء المنطق في نموذج بلا واجهة يجعله تحت اختبارات سريعة وموثوقة — أكبر مكسب قابلية اختبار في تطبيق تفاعلي.',
            en: 'The view is the hard-to-test part; keeping logic in a UI-free model puts it under fast, reliable tests — often the single biggest testability win in an interactive app.',
          },
        },
        {
          id: 'q3.observer',
          question: { ar: 'علاقة «المنظر يراقب النموذج» في MVC هي تطبيق مباشر لأي لبنية من الدرس السابق؟', en: 'The MVC wiring "the view observes the model" is a direct application of which building block from the previous lesson?' },
          options: [
            { id: 'a', text: { ar: 'shared data', en: 'shared data' } },
            { id: 'b', text: { ar: 'observer', en: 'observer' } },
            { id: 'c', text: { ar: 'الواجهة المستقرة', en: 'the stable interface' } },
            { id: 'd', text: { ar: 'الطبقات الصارمة', en: 'strict layering' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'النموذج يعلن التغيير لكل مناظر مشترك عبر عملية موحدة دون معرفة أنواعها — هذا observer من الدرس السابق حرفيًا، وهو المحرك داخل كل معماريات واجهات المستخدم.',
            en: 'The model announces changes to every subscribed view through one uniform operation without knowing their types — literally the observer building block, and the engine inside every UI architecture.',
          },
        },
        {
          id: 'q4.ch1',
          question: { ar: 'متى يستحق MVC كلفته فعلًا؟', en: 'When does MVC actually earn its cost?' },
          options: [
            { id: 'a', text: { ar: 'في أي شاشة مهما صغرت، مبدئيًا ودائمًا', en: 'In any screen however small, always and on principle' } },
            { id: 'b', text: { ar: 'حين تتغير المظهر والمدخلات والقواعد فعلًا على جداول مختلفة — استثمر في الفصل حيث التغيير محتمل', en: 'When appearance, input, and rules really do change on different schedules — invest in separation where change is likely' } },
            { id: 'c', text: { ar: 'حين تكون الشاشة ثابتة لا تتغير أبدًا', en: 'When the screen is frozen and will never change' } },
            { id: 'd', text: { ar: 'حين يختفي المتحكم من التصميم', en: 'When the controller disappears from the design' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'هذا مبدأ الفصل 1 مطبقًا على واجهات المستخدم: اجعل التغييرات المحتملة رخيصة، ولا تدفع مقابل مرونة لن تستخدمها في شاشة صغيرة ثابتة.',
            en: 'This is the Chapter 1 principle applied to UIs: make likely changes cheap, and pay for no flexibility a small frozen screen will never use.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'وضعت قاعدة الغرامة (أكثر من 30 يومًا) داخل دالة الرسم في المنظر.',
          right: 'انقلها إلى النموذج أو إلى view-model واختبرها بسطرين، واجعل المنظر يعرض نتيجة محسوبة فقط.',
          note: { ar: 'المنظر هو الجزء الذي لا تصل إليه اختباراتك — كل قاعدة فيه تفلت من الفحص.', en: 'The view is the part your tests cannot reach — every rule inside it escapes inspection.' },
        },
        {
          wrong: 'جعلت النموذج يستدعي مكتبة واجهات ليرسم نفسه بعد كل تغيير.',
          right: 'النموذج يعلن التغيير فقط عبر notify، والمناظر هي من ترسم — عكس ذلك يهدم قابلية الاختبار ويقلب الاعتمادية.',
          note: { ar: 'النموذج لا يعتمد على المنظر — الالتزام الجوهري الذي يشترك فيه كل أعضاء عائلة MVC.', en: 'The model does not depend on the view — the core commitment shared by the whole MVC family.' },
        },
        {
          wrong: 'كتبت المتحكم يحسب الضريبة ويتحقق من الرصيد قبل الحجز.',
          right: 'المتحكم يترجم الإدخال إلى استدعاء فقط؛ القواعد مثل الضريبة والرصيد مسؤولية النموذج.',
          note: { ar: 'حدود الأدوار: المتحكم ترجمة حركة إلى عملية، والنموذج حالة وقواعد، والمنظر قراءة ورسم.', en: 'Role boundaries: the controller turns a gesture into an operation, the model owns state and rules, the view reads and draws.' },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'MVC يقسم التطبيق التفاعلي إلى ثلاثة أدوار: النموذج يحمل الحالة والقواعد بلا واجهة، والمنظر يقرأ ويرسم، والمتحكم يفسر المدخلات.', en: 'MVC splits an interactive app into three roles: the model owns state and rules with no UI, the view reads and draws, the controller interprets input.' },
        { ar: 'المحرك خلف النمط علاقة observer: النموذج يعلن، والمناظر المشتركة تعيد الرسم.', en: 'The engine behind the pattern is the observer relation: the model announces, subscribed views redraw.' },
        { ar: 'القاعدة الأثمن: النموذج لا يعتمد على المنظر — بها تشتري اختبارًا نظيفًا للقواعد ومناظر قابلة للتبديل.', en: 'The dearest rule: the model does not depend on the view — that buys clean rule testing and swappable views.' },
        { ar: 'اجعل المنظر humble: بلا قواعد ولا حسابات — ادفع المنطق إلى حيث تصل إليه الاختبارات.', en: 'Keep the view humble: no rules, no calculations — push logic to where tests can reach it.' },
      ],
      reflectPrompt: {
        ar: 'اختر شاشة تعرفها وحدد ثلاث جمل: ما الحالة التي تحملها؟ ما الذي يرسمه؟ ما الحركة التي يحولها المستخدم إلى عملية؟ ثم اكتب أين تسكن كل جملة في MVC.',
        en: 'Pick a screen you know and write three sentences: what state does it hold? What does it draw? What gesture does the user turn into an operation? Then write where each sentence lives in MVC.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch7.s3', pages: 'ص181-184 / pp.181-184' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch7.s3', pages: 'ص181-184 / pp.181-184' },
  ],
} satisfies Lesson;

export default lesson;
