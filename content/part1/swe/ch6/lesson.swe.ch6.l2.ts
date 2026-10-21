/**
 * Lesson swe.ch6.l2 — مخططات الأصناف
 *   / Class Diagrams
 * Book: SWE — Chapter 6 'Design and Architecture'
 *   §6.3 Class Diagrams (pp.153-156)
 * Runnable design: a small fixed class model in dataclasses (composition +
 *   generalization) over fixed data, printing a deterministic object summary.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '../../../../src/lib/content/schema';

const lesson = {
  id: 'swe.ch6.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 6,
  title: { ar: 'مخططات الأصناف', en: 'Class Diagrams' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch6.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'مهندس جديد ينضم إلى فريق تطبيق المراسلة. لا وقت لقراءة أربعين ألف سطر، لكن توجد صفحة واحدة: مخطط أصناف يعرض User وConversation وMessage وAttachment وأسهمًا بينها. في عشر دقائق يعرف من يملك من، وأي الأجزاء يموت مع أي كُل — قبل أن يفتح أول ملف. هذا هو عائد مخطط الأصناف حين يُرسم بحق.',
        en: 'A new engineer joins the messaging team. No time to read forty thousand lines, but there is one page: a class diagram showing User, Conversation, Message, Attachment, and arrows between them. In ten minutes they know who owns what and which part dies with which whole — before opening a single file. That is the payoff of a class diagram done right.',
      },
    },
    {
      kind: 'predict',
      code: `conv = {"id": "c1", "messages": []}
conv["messages"].append({"id": "m1", "body": "ping"})
conv["messages"].append({"id": "m2", "body": "pong"})

attachments = {"a1": {"name": "report.pdf"}}
conv["messages"][0]["attachment"] = attachments["a1"]   # shared part

del conv
print("attachments pool still holds:", attachments["a1"]["name"])`,
      question: {
        ar: 'محادثة تحمل رسالتين، وإحداهما تشير إلى مرفق من مخزن مشترك. نحذف المحادثة. أي الأجزاء يموت معها بالضرورة وأيها يبقى؟',
        en: 'A conversation holds two messages; one of them references an attachment from a shared pool. We delete the conversation. Which part necessarily dies with it, and which survives?',
      },
      reveal: {
        ar: 'الرسائل مركّبة composition: وُلدت داخل المحادثة ولا أحد غيرها يحملها. المرفق مجمّع aggregation: مخزن مشترك خارجي يشير إليه، لذلك بقي report.pdf حيًّا. سؤالا العمر والمشاركة هما ما يحسم اختيار المعينة.',
        en: 'The messages are composed: born inside the conversation, held by nobody else. The attachment is aggregated: a shared pool outside still references it, so report.pdf survives. The lifetime and sharing questions settle which diamond to draw.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'صندوق الصنف: اسم وخصائص وعمليات', en: 'The Class Box: Name, Attributes, Operations' },
      chunks: [
        {
          ar: 'مخطط الأصناف class diagram من UML هو اللغة المشتركة لوصف البنية الساكنة: الأصناف، ما يحمله كل صنف من بيانات، ما يفعله، وكيف ترتبط. الصنف يُرسم صندوقًا بثلاث خانات: الاسم في الأعلى، الخصائص attributes (البيانات التي يحملها كل كائن) في الوسط، والعمليات operations في الأسفل. وقبل كل عضو رمز رؤية visibility: + عام public فهو جزء من الوعد، - خاص private فهو من السر، # محمي protected يراه الصنف وأبناؤه، ~ حزمي package. الاصطلاح: visibility name: type للخصائص وvisibility name(parameters): returnType للعمليات. ولن ترسم كل أصناف النظام أبدًا؛ ترسم الأصناف التي يحتاج أحدٌ ما فهم علاقاتها.',
          en: 'The UML class diagram is the lingua franca for static structure: the classes, what each holds, what it does, and how they relate. A class is drawn as a box with three compartments: the name on top, the attributes (data each object holds) in the middle, and the operations at the bottom. A visibility marker precedes each member: + public — part of the promise; - private — part of the secret; # protected — visible to the class and its subclasses; ~ package. The convention: visibility name: type for attributes and visibility name(parameters): returnType for operations. You never draw every class; you draw the ones whose relationships someone needs to understand.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الخطوط تحمل المعنى: خمس علاقات وتعددية', en: 'Lines Carry Meaning: Five Relationships and Multiplicity' },
      chunks: [
        {
          ar: 'الخطوط بين الصناديق هي المعلومات الحقيقية، ولكل شكل معنى دقيق. الجمعية association: خط عادي يعني أن كائنات صنفٍ تشير إلى كائنات صنفٍ آخر. التجميع aggregation: معينة فارغة عند "الكل" — علاقة جزء من ضعيفة، الجزء يبقى ويُشارَك: مرفق قد تُشاركه رسائل ويعيش بعد حذف إحداها. التركيب composition: معينة ممتلئة — ملكية كاملة، عمر الجزء مرتبط بالكل ولا يُشارَك: رسائل المحادثة تموت بحذفها وتنتمي إليها وحدها. التعميم generalization: مثلث فارغ نحو الأب — وراثة: GroupConversation هو Conversation. التبعية dependency: سهم متقطع — أضعف الروابط: استخدام عابر كنوع معامل أو قيمة راجعة. والتعددية multiplicity عند الأطراف: 1 بالضبط واحد، 0..* صفر أو أكثر، 1..* واحد على الأقل، 0..1 اختياري — والفرق بين 1 و0..1 كثيرًا ما يكون هو الفرق بين خلل مؤشر فارغ ومخطط صحيح.',
          en: 'The lines between boxes carry the real information, each one precise. Association: a plain line — objects of one class refer to objects of another. Aggregation: a hollow diamond at the whole — a weak part-of, the part survives and is shared: an attachment may serve several messages and outlive one. Composition: a filled diamond — ownership; the part\'s lifetime is bound to the whole and it is not shared: a conversation\'s messages die with it and belong to it alone. Generalization: a hollow triangle at the parent — inheritance: a GroupConversation is a Conversation. Dependency: a dashed arrow — the weakest link, transient use as a parameter or return type. Multiplicity annotates the ends: 1 exactly one, 0..* zero or more, 1..* at least one, 0..1 optional — and the gap between 1 and 0..1 is often the gap between a null-pointer bug and a correct schema.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'من المخطط إلى الكود', en: 'From Diagram to Code' },
      chunks: [
        {
          ar: 'الترجمة إلى بايثون مباشرة: الصنف يصير dataclass، الخصائص حقولًا، والعمليات دوال. التركيب يترجم إلى حقل يحمله الكُل ويصنع أجزاءه بنفسه: قائمة تُنشأ بـ default_factory. والتعميم يترجم إلى وراثة عادية. ولا تسرف في التردد بين aggregation وcomposition — حتى مواصفة UML نفسها تترك دلالة التجميع مفتوحة. ابدأ بالسؤالين الحاسمين: حين يُحذف الكُل، هل يموت الجزء؟ وهل يمكن لكثيرٍ من الأكوان مشاركة الجزء نفسه؟ أجب عنهما ثم اختر المعينة. وتذكر الغاية: المخطط أداة تواصل خشنة لاتخاذ قرارات مكلفة، لا لوحة فنية تُعاير فيها كل التفاصيل مبكرًا.',
          en: 'The Python translation is direct: a class becomes a dataclass, attributes become fields, operations become methods. Composition becomes a field the whole owns and populates itself: a list built with default_factory. Generalization becomes plain inheritance. And do not agonize over aggregation versus composition — even the UML specification leaves aggregation\'s exact semantics open. Start from the two decisive questions: when the whole is deleted, does the part die? And can many wholes share the same part? Answer them, then pick the diamond. Remember the purpose: the diagram is a rough communication tool for expensive decisions, not a polished artwork drawn too early.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نموذج مراسلة صغير في dataclasses', en: 'A small messaging model in dataclasses' },
      code: `from dataclasses import dataclass, field

@dataclass
class Message:
    id: str
    body: str

@dataclass
class Conversation:
    id: str
    messages: list = field(default_factory=list)   # composition: whole owns parts

    def add(self, body):
        m = Message(id=f"{self.id}-m{len(self.messages) + 1}", body=body)
        self.messages.append(m)
        return m

@dataclass
class GroupConversation(Conversation):   # generalization: is-a
    members: list = field(default_factory=list)

c = Conversation("c1")
c.add("hi")
c.add("ready?")
g = GroupConversation("g1", members=["sami", "noor"])
g.add("hello all")
for conv in (c, g):
    print(conv.id, "->", [m.body for m in conv.messages])`,
      explanation: {
        ar: 'ثلاث علاقات في عشرة أسطر: Conversation يملك messages (تركيب — يصنعها ويحملها)، وGroupConversation يرث Conversation (تعميم) فيعمل في الحلقة نفسها دون أي كود إضافي، والمعرفات تتولد من الكُل. وانتبه إلى default_factory: بلاها ستشارك كل المحادثات قائمة واحدة — خطأ تعددية multiplicity كلاسيكي يظهر متأخرًا وقبيحًا.',
        en: 'Three relationships in ten lines: Conversation owns messages (composition — it mints and holds them), GroupConversation inherits Conversation (generalization) so it works in the same loop with no extra code, and ids are minted by the whole. Note default_factory: without it every conversation would share one list — a classic multiplicity bug that shows up late and ugly.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.diagram-to-code',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'حوّل المخطط إلى كود: Order يتكوّن من LineItems (تركيب: لا تُشارَك ولا تعيش بعد حذف الطلب). أكمل الدالتين add وtotal ثم نفّذ السطر الأخير كما هو دون تغيير.',
        en: 'Turn the diagram into code: an Order is composed of LineItems (composition: not shared, they do not outlive the order). Complete add and total, then run the last line unchanged.',
      },
      starterCode: `from dataclasses import dataclass, field

@dataclass
class LineItem:
    sku: str
    qty: int
    price: float

@dataclass
class Order:
    id: str
    items: list = field(default_factory=list)   # composition: the Order owns its LineItems

    def add(self, sku, qty, price):
        ...  # create a LineItem and append it to items

    def total(self):
        ...  # sum qty * price over items

order = Order("o1")
order.add("pen", 3, 2.5)
order.add("pad", 1, 9.0)
print(order.id, "items:", len(order.items), "total:", order.total())`,
      solution: `from dataclasses import dataclass, field

@dataclass
class LineItem:
    sku: str
    qty: int
    price: float

@dataclass
class Order:
    id: str
    items: list = field(default_factory=list)   # composition: the Order owns its LineItems

    def add(self, sku, qty, price):
        self.items.append(LineItem(sku=sku, qty=qty, price=price))

    def total(self):
        return sum(i.qty * i.price for i in self.items)

order = Order("o1")
order.add("pen", 3, 2.5)
order.add("pad", 1, 9.0)
print(order.id, "items:", len(order.items), "total:", order.total())`,
      tests: [
        {
          id: 't1',
          name: { ar: 'سطر الملخص صحيح', en: 'summary line is right' },
          code: `assert 'o1 items: 2 total: 16.5' in __learner_output__, 'expected: o1 items: 2 total: 16.5 | actual: %r' % __learner_output__`,
        },
        {
          id: 't2',
          name: { ar: 'المجموع 16.5', en: 'total is 16.5' },
          code: `assert order.total() == 16.5, 'expected: 16.5 | actual: %r' % order.total()`,
        },
        {
          id: 't3',
          name: { ar: 'بندان اثنان', en: 'two line items' },
          code: `assert len(order.items) == 2, 'expected: 2 | actual: %r' % len(order.items)`,
        },
      ],
      hints: [
        { ar: 'LineItem لا يُشارَك ولا يُولد خارج الطلب: أنشئه داخل add وألحقه بقائمة items — هذا هو التركيب.', en: 'A LineItem is not shared and is not born outside the order: create it inside add and append it to items — that is composition.' },
        { ar: 'الصياغة: self.items.append(LineItem(sku=sku, qty=qty, price=price)).', en: 'The line: self.items.append(LineItem(sku=sku, qty=qty, price=price)).' },
        { ar: 'total سطر واحد: return sum(i.qty * i.price for i in self.items).', en: 'total is one line: return sum(i.qty * i.price for i in self.items).' },
        { ar: 'نفّذ السطر الأخير دون تغيير: الناتج المطلوب o1 items: 2 total: 16.5.', en: 'Run the last line unchanged: the required output is o1 items: 2 total: 16.5.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.rel-kind',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'قائمة تشغيل Playlist تشير إلى أغاني Songs تعيش في مكتبة مستقلة؛ حذف القائمة لا يموت الأغاني، وعدة قوائم يمكن أن تشير إلى الأغنية نفسها. أي علاقة بين Playlist وSong؟',
        en: 'A Playlist references Songs that live in an independent library; deleting a playlist does not kill the songs, and several playlists can reference the same song. What is the Playlist–Song relationship?',
      },
      options: [
        { id: 'a', text: { ar: 'composition — معينة ممتلئة، ملكية كاملة وموت معًا', en: 'composition — filled diamond, full ownership, die together' } },
        { id: 'b', text: { ar: 'aggregation — تجميع ضعيف: الجزء يبقى ويُشارَك', en: 'aggregation — weak grouping: the part survives and is shared' } },
        { id: 'c', text: { ar: 'generalization — وراثة: الأغنية نوع من القائمة', en: 'generalization — inheritance: a song is a kind of playlist' } },
        { id: 'd', text: { ar: 'dependency — استخدام عابر في معامل واحد', en: 'dependency — transient use as a single parameter' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'ابدأ بسؤال العمر: هل تموت الأغنية بحذف قائمة التشغيل؟', en: 'Start with the lifetime question: does the song die when the playlist is deleted?' },
        { ar: 'ثم سؤال المشاركة: هل يمكن لعدة قوائم الإشارة إلى الأغنية نفسها في الوقت نفسه؟', en: 'Then the sharing question: can several playlists reference the same song at once?' },
        { ar: 'الموت معًا بلا مشاركة هو composition — وليس هذا الحال؛ والمثلث الفارغ وراثة لا علاقة له هنا.', en: 'Dying together, never shared, is composition — not our case; the hollow triangle is inheritance, irrelevant here.' },
        { ar: 'الإجابة: aggregation — تجميع ضعيف بمعينة فارغة عند الكُل.', en: 'The answer: aggregation — weak grouping, hollow diamond at the whole.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.trace-visibility',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'سطران من حياة صنف User. أي السطرين يعتمد على الوعد العامة فقط، وأيهما يتسلل إلى السر؟ اكتب المخرج الحرفي.',
        en: 'Two lines from the life of a User class. Which line relies only on the public promise, and which sneaks into the secret? Write the exact output.',
      },
      code: `class User:
    def __init__(self, uid):
        self._id = uid            # - private: the secret
    def send(self, text):         # + public: the promise
        return "sent " + text

u = User("u7")
print("public:", u.send("hi"))
print("private peek:", u._id)`,
      answer: 'public: sent hi\nprivate peek: u7',
      solution: 'public: sent hi\nprivate peek: u7',
      hints: [
        { ar: 'send تُرجع "sent " مسبوقة بفراغ ثم النص الممرر: hi.', en: 'send returns "sent " (trailing space) followed by the argument: hi.' },
        { ar: 'print بالفواصل يضع فراغًا واحدًا بين الأجزاء: public: sent hi.', en: 'print with commas puts one space between parts: public: sent hi.' },
        { ar: 'الوصول إلى u._id مسموح في بايثون رغم الشرطة السفلية — الاصطلاح يمنعه لا اللغة.', en: 'Accessing u._id is legal in Python despite the underscore — convention forbids it, not the language.' },
        { ar: 'السطر الثاني يطبع قيمة السر مباشرة: private peek: u7.', en: 'The second line prints the secret\'s value directly: private peek: u7.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-composition',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: العلاقة التي يموت فيها الجزء بحذف الكُل ولا يُشارَك بين أكثر من كُل، وتُرسم بمعينة ممتلئة، تسمى ______ (كلمة إنجليزية واحدة).',
        en: 'Complete the term: the relationship where the part dies with the whole and is not shared, drawn with a filled diamond, is called ______ (one English word).',
      },
      answer: 'composition',
      solution: 'composition',
      hints: [
        { ar: 'سؤالا العمر والمشاركة: موت معًا، ولا مشاركة.', en: 'The lifetime and sharing questions: die together, never shared.' },
        { ar: 'المعينة الممتلئة filled diamond هي علامتها في UML.', en: 'The filled diamond is its UML marker.' },
        { ar: 'عكسها الأضعف aggregation يُرسم بمعينة فارغة.', en: 'Its weaker cousin aggregation is drawn with a hollow diamond.' },
        { ar: 'الكلمة المطلوبة: composition.', en: 'The word: composition.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `from dataclasses import dataclass, field

@dataclass
class Message:
    id: str
    body: str

@dataclass
class Conversation:
    id: str
    messages: list = field(default_factory=list)

    def send(self, body):
        m = Message(id=self.id + "-m" + str(len(self.messages) + 1), body=body)
        self.messages.append(m)
        return m

c = Conversation("c1")
c.send("hi")
c.send("ready?")
for m in c.messages:
    print(m.id, m.body)

# Your turn: add an Attachment dataclass (name: str) and let a Message hold
# one. Then ask the lifetime questions: does the attachment die with the
# conversation (composition) or could a shared pool own it (aggregation)?`,
      prompt: {
        ar: 'مدّد النموذج: أضف صنف Attachment ودع Message يحمل واحدًا. ثم جرب: هل تجعل المرفق جزءًا مملوكًا أم مرجعًا من مخزن مشترك؟ اطبع دليلك.',
        en: 'Extend the model: add an Attachment class and let a Message hold one. Then decide: is the attachment an owned part or a reference into a shared pool? Print your evidence.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1',
          question: { ar: 'ماذا يعني الرمز + أمام عضو في صندوق الصنف؟', en: 'What does the + marker in front of a class member mean?' },
          options: [
            { id: 'a', text: { ar: 'سر يجب إخفاؤه عن الجميع', en: 'A secret that must be hidden from everyone' } },
            { id: 'b', text: { ar: 'عام: جزء من الواجهة والوعد لبقية النظام', en: 'Public: part of the interface and the promise to the rest of the system' } },
            { id: 'c', text: { ar: 'محمي: يراه الصنف وأبناؤه فقط', en: 'Protected: visible only to the class and its subclasses' } },
            { id: 'd', text: { ar: 'حزمي: مرئي داخل الحزمة فقط', en: 'Package: visible within the package only' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'علامة + تعني public: العضو جزء من الوعد الذي تعده الواجهة — وهذا ما يمكن للآخرين الاعتماد عليه. أما - فهو السر.',
            en: '+ means public: the member is part of the interface\'s promise — what others may depend on. - is the secret.',
          },
        },
        {
          id: 'q2',
          question: { ar: 'أي خط يرسم العلاقة "GroupConversation هو Conversation"؟', en: 'Which line draws "a GroupConversation is a Conversation"?' },
          options: [
            { id: 'a', text: { ar: 'سهم متقطع — تبعية عابرة', en: 'A dashed arrow — transient dependency' } },
            { id: 'b', text: { ar: 'معينة فارغة عند الكُل — تجميع', en: 'A hollow diamond at the whole — aggregation' } },
            { id: 'c', text: { ar: 'مثلث فارغ يشير إلى الأب — تعميم ووراثة', en: 'A hollow triangle at the parent — generalization/inheritance' } },
            { id: 'd', text: { ar: 'معينة ممتلئة عند الكُل — تركيب', en: 'A filled diamond at the whole — composition' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'علاقة "is-a" تُرسم بمثلث فارغ يشير إلى الأصل: الابن يرث واجهة الأب ويُستخدم حيث يُستخدم الأب.',
            en: 'An is-a relationship is a hollow triangle at the parent: the subclass inherits the parent\'s interface and is usable wherever the parent is expected.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'من أين تأتي أصناف مثل Conversation وMessage عند تصميم تطبيق المراسلة؟',
            en: 'Where do classes like Conversation and Message come from when designing the messaging app?',
          },
          options: [
            { id: 'a', text: { ar: 'من الخيال — تُخترع بحرية أثناء الكتابة', en: 'From imagination — invented freely while coding' } },
            { id: 'b', text: { ar: 'من مفردات حالات الاستخدام والمتطلبات المحلَّلة (العمل الذي أنجزناه في الفصلين 4 و5)', en: 'From the vocabulary of the analyzed use cases and requirements (the ch4-ch5 work)' } },
            { id: 'c', text: { ar: 'من أسماء جداول قاعدة البيانات الجاهزة', en: 'From the pre-existing database table names' } },
            { id: 'd', text: { ar: 'من قائمة الملفات في المستودع', en: 'From the repository\'s file listing' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التصميم يكمل ما بدأه التحليل: الأصناف الجيدة تُستخرج من مفردات حالات الاستخدام والمتطلبات، فتظل النماذج موصولة بالسلوك المتفق عليه.',
            en: 'Design continues what analysis started: good classes are mined from use-case and requirement vocabulary, keeping the model tied to the agreed behavior.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ما أضعف الروابط في مخطط الأصناف — والتي تريد إبقاءها قليلة العدد وباتجاه واحد؟',
            en: 'Which is the weakest link in a class diagram — the one you want few and one-directional?',
          },
          options: [
            { id: 'a', text: { ar: 'التركيب composition', en: 'composition' } },
            { id: 'b', text: { ar: 'التعميم generalization', en: 'generalization' } },
            { id: 'c', text: { ar: 'التبعية dependency — السهم المتقطع', en: 'dependency — the dashed arrow' } },
            { id: 'd', text: { ar: 'التجميع aggregation', en: 'aggregation' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'التبعية استخدام عابر — نوع معامل أو قيمة راجعة — لكن كثرتها أو ثنائية اتجاهها تعني تشابكًا صعب الفهم والفك.',
            en: 'Dependency is transient use — a parameter or return type — but many of them, or two-way ones, mean tangle that is hard to reason about and unwind.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'أمضيت ساعة أتردد بين aggregation وcomposition من أجل حقل واحد.',
          right: 'ابدأ بالسؤالين: هل يموت الجزء مع الكُل؟ وهل يُشارَك بين عدة أكوان؟ أجب ثم اختر المعينة — حتى مواصفة UML تترك التجميع مفتوح الدلالة.',
          note: {
            ar: 'الوقت الثمين يُصرف على التعددية multiplicity والسلوك، لا على جدال فلسفي حول معينة.',
            en: 'Spend the precious time on multiplicity and behavior, not on a philosophical debate over a diamond.',
          },
        },
        {
          wrong: 'سأرسم مخططًا واحدًا يضم كل أصناف النظام المئتين.',
          right: 'ارسم الأصناف التي يحتاج أحدهم فهم علاقاتها؛ والبقية تفاصيل داخلية يعرفها الكود وحده.',
          note: {
            ar: 'المخطط وسيلة تواصل لشخص له سؤال محدد، وليس جردًا كاملًا للمستودع.',
            en: 'A diagram is communication for someone with a specific question, not a full repository inventory.',
          },
        },
        {
          wrong: 'أكتب كل التعدديات 1..* لأنني لا أحب القوائم الفارغة.',
          right: 'التعددية قرار عن البيانات الحقيقية: 1 مقابل 0..1 مقابل 0..* هي غالبًا الفرق بين خلل مؤشر فارغ، ومفتاح أجنبي ناقص، ومخطط صحيح.',
          note: {
            ar: 'اسأل عن الواقع: هل يبدأ المريض بلا مواعيد؟ هل توجد محادثة صفر رسائل؟',
            en: 'Ask about reality: do patients start with zero appointments? Can a conversation exist with zero messages?',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'الصندوق: اسم وخصائص وعمليات، ورموز الرؤية تفصل الوعد (+) عن السر (-).',
          en: 'The box: name, attributes, operations, with visibility markers separating the promise (+) from the secret (-).',
        },
        {
          ar: 'الخطوط تحمل المعنى: association، وتجميع ضعيف يُشارَك، وتركيب مالك، وتعميم وارث، وتبعية عابرة — والتعددية تمنع أخطاء الواقع.',
          en: 'Lines carry meaning: association, weak shared aggregation, owning composition, inheriting generalization, transient dependency — and multiplicity keeps real-world bugs out.',
        },
        {
          ar: 'من المخطط إلى الكود: dataclass لكل صندوق، حقل مملوك للتركيب، وراثة عادية للتعميم.',
          en: 'Diagram to code: a dataclass per box, an owned field for composition, plain inheritance for generalization.',
        },
        {
          ar: 'سؤالا العمر والمشاركة يحسمان المعينة: موت معًا ولا مشاركة = تركيب.',
          en: 'Lifetime and sharing settle the diamond: die together, never shared = composition.',
        },
      ],
      reflectPrompt: {
        ar: 'خذ آخر نموذج بيانات كتبته: أين كان يجب تركيب composition حقيقي واكتفيت بقائمة مشتركة ساكنة؟',
        en: 'Take your last data model: where did you settle for a static shared list when real composition was called for?',
      },
    },
    {
      kind: 'sources',
      items: [{ book: 'SWE', section: 'swe.ch6.s3', pages: 'ص153-156 / pp.153-156' }],
    },
  ],
  sources: [{ book: 'SWE', section: 'swe.ch6.s3', pages: 'ص153-156 / pp.153-156' }],
} satisfies Lesson;

export default lesson;
