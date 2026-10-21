/**
 * swe.ch7.l4 — مراجعة الفصل 7 ومشروع: دليل الأنماط /
 *              Chapter 7 Review and Project: The Pattern Catalog
 * SWE ch7 — s6 Families and Product Lines (ص193-195 / pp.193-195) + s7
 * Conclusion (ص195-196 / pp.195-196) + chapter recap.
 * Runnable design: a chapter-final PROJECT — a deterministic pattern selector
 * over fixed scenario traits printing exact ASCII verdicts (S1: pipe-filter /
 * S2: client-server / S3: mvc / matched: 3/3); product-line edition builder as
 * a smaller worked example. Debug: a crossed trait->pattern mapping that
 * recommends a UI pattern for a dataflow need.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch7.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 7,
  title: { ar: 'مراجعة الفصل 7 ومشروع: دليل الأنماط', en: 'Chapter 7 Review and Project: The Pattern Catalog' },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch7.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'شركة الهواتف تطلق ستة أجهزة هذا العام، كلها نفس المنصة بفروق صغيرة: كاميرا هنا، وحساب ضريبة منطقة هناك. لو نسخ فريق كل جهاز من جهاز، لأصبحت ست شيفرات تتصدع منفصلة. وفي الوقت نفسه أمامك كتالوج الفصل كله: طبقات، shared data، observer، MVC، أنابيب، عميل-خادم، REST، خطوط منتجات. الدرس الأخير يجمع الخيط: كيف تبني عائلة من نظام واحد، وكيف تختار النمط الأصغر الذي يعالج مشكلتك — وتسمي ثمنه قبل أن تكتب سطرًا.',
        en: 'A phone maker ships six handsets this year, all one platform with small differences: a camera here, a regional tax rule there. If the team copied each device from the last, six separate codebases would crack independently. Meanwhile the whole chapter catalog sits in front of you: layers, shared data, observer, MVC, pipes, client-server, REST, product lines. This final lesson ties the thread: how to build a family from one system, and how to pick the smallest pattern that addresses your problem — naming its price before writing a line.',
      },
    },
    {
      kind: 'predict',
      code: 'need = "stream"\nCATALOG = {"stream": "pipe-filter", "ui": "mvc", "shared": "client-server"}\nprint(CATALOG[need])\n',
      question: {
        ar: 'ماذا يطبع؟ وماذا يمنحك اسم النمط قبل قراءة سطر واحد من كوده؟',
        en: 'What does it print? And what does a pattern name give you before you read a single line of code?',
      },
      reveal: {
        ar: 'يطبع pipe-filter. الاسم مفردة في لغة تصميم مشتركة: من يعرف الكتالوج يرى البنية والمشاركين والمقايضات فور سماع الاسم — هذه هي قيمة وجود كتالوج مسمى للأنماط.',
        en: 'It prints pipe-filter. A pattern name is a word in a shared design language: anyone who knows the catalog sees the structure, the participants, and the trade-offs the moment they hear it — that is the value of a named catalog.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'عائلة منتجات: المشترك والمتغير', en: 'Product families: commonality and variability' },
      chunks: [
        {
          ar: 'المؤسسات نادرًا تبني نظامًا واحدًا؛ تبني عائلة أنظمة مترابطة: المنتج نفسه لمنصات أو فئات عملاء أو مناطق مختلفة. هندسة خطوط المنتجات تعني بناء العائلة من أصول مشتركة بطريقة مخططة. الخطوة التحليلية الأساسية: افصل commonality عن variability. المشترك ميزة موجودة في كل منتج — تبنى مرة وتصان مرة فيرثها الجميع. والمتغير نقطة اختلاف — يحتاج آلية صريحة: flag إعدادي، أو slot إضافي، أو وحدة قابلة للتبديل، أو خيار وقت الترجمة — بحيث يختار كل منتج نسخته دون تعديل الشيفرة المشتركة. وأداة التوثيق نموذج الميزات (feature model): ما الإلزامي، وما الاختياري، وما يستثني ما. والفخ الأغلى: التخمين الخاطئ للمحور الذي سيتغير — إما أن تعيد فتح شيفرة مشتركة لاحقًا بألم، أو تدفع مرونة لن تستخدمها أبدًا.',
          en: 'Organizations rarely build one system; they build a family of related ones — the same product for different platforms, customer tiers, or regions. Software product-line engineering means building the family from shared assets in a planned way. The core analytical move: separate commonality from variability. A commonality exists in every product — built once, maintained once, inherited by all. A variability is a point of difference — it needs an explicit mechanism: a configuration flag, a plug-in slot, a swappable module, a compile-time option — so each product selects its variant without editing shared code. The recording tool is the feature model: what is mandatory, optional, or mutually exclusive. The costliest pitfall: guessing wrong about which axis will vary — you either painfully reopen shared code later, or pay for flexibility you never use.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المعمارية المرجعية وهندستان', en: 'The reference architecture and two kinds of engineering' },
      chunks: [
        {
          ar: 'تحتاج العائلة معمارية مرجعية (reference architecture): منصة مشتركة تجعل نقاط التباين المخططة سهلة الاستعمال. وكل نقطة تباين — في النهاية — واجهة تركب خلفها البدائل، والأنماط التي تعلمتها هي آلات بناء تلك الواجهات: الطبقات تسمح بتغيير طبقة infrastructure لكل منتج بينما تبقى الطبقات العليا واحدة، وobserver وbroker يتيحان إضافة أو استبدال سلوك بالتسجيل دون تحرير النواة، وبنى الـ plug-in هي انضباط open/closed على مستوى ميزات كاملة. تنظيميًا ينقسم العمل: هندسة المجال (domain engineering) تبني المنصة ونقاط التباين، وهندسة التطبيق (application engineering) تركب منتجًا بعينه باختيار النسخ وإضافة ما يخصه وحده. هذا الفصل هو ما يحول «نسخنا منتج العام الماضي وحرفنا فيه» إلى عائلة حقيقية قابلة للصيانة. أما اقتصاديا فالحساب صريح: المنصة تدفع مقدمًا ولا تسدد إلا حين تكفي عدد المنتجات لتجاوز وفوراتها كلفتها.',
          en: 'A family needs a reference architecture: a shared platform that makes the planned variation points easy to exercise. Every variation point is an interface behind which alternatives plug in — and the patterns you learned are the machinery for those interfaces: layering lets one product vary its infrastructure tier while upper tiers stay identical; observer and broker let products add or swap behavior by registering components with no shared-core edits; plug-in structures are the open/closed discipline at whole-feature scale. Organizationally the work splits: domain engineering builds the platform and its variation points; application engineering assembles a specific product by selecting variants and adding only what is unique. That split turns "we copied last year product and hacked it" into a maintainable family. Economically, the platform is paid up front and breaks even only when enough products are built for the savings to exceed the extra cost.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الكتالوج: اختر الأصغر وسم الثمن', en: 'The catalog: pick the smallest pattern and name the price' },
      chunks: [
        {
          ar: 'خلاصة الفصل في جدول واحد: كل نمط جواب مسمى لسؤال بنيوي متكرر، وكل جواب مقايضة. الطبقات تشتري عزل التغيير وتدفع عبورًا غير مباشر؛ shared data تشتري حقيقة مركزية وتدفع مغناطيس ترابط وعنق زجاجة؛ observer يشتري اقترانًا خفيفًا ويدفع تدفق تحكم خفيًا؛ MVC يشتري فصلًا قابلًا للاختبار ويدفع بنية إضافية؛ الأنابيب تشتري تركيبًا حرًا ويدفع تنسيقًا محدودًا؛ client-server يشتري مركزية ويدفع عنق زجاجة؛ وخط المنتجات تشتري إعادة استخدام وتدبد كلفة منصة مقدمًا. القاعدة الجامعة من الفصل 1: نظم النظام بحيث تكون التغييرات المتوقعة رخيصة، ولا تدفع مرونة لن تستخدمها. اختر أصغر نمط يعالج المشكلة وسم ما تشتريه وما تدفعه — وإلا فأنت تقلد لا تصمم. والنظام الواقعي يجمع الأنماط: طبقات، فوقها MVC، تحتها shared data، عبر الشبكة client-server وREST، وعلى منصة عائلة واحدة.',
          en: 'The chapter in one table: every pattern is a named answer to a recurring structural question, and every answer is a trade-off. Layering buys change isolation and pays indirection; shared data buys central truth and pays a coupling magnet and bottleneck; observer buys loose coupling and pays hidden control flow; MVC buys testable separation and pays extra structure; pipes buy free composition and pay a limited format; client-server buys centralization and pays a bottleneck; product lines buy reuse and pay an up-front platform cost. The through-line from Chapter 1: structure the system so expected changes are cheap, and pay for no flexibility you will not use. Pick the smallest pattern that addresses the problem and name what you buy and what you pay — otherwise you are cargo-culting, not designing. A real system combines patterns: layers, MVC on top, shared data beneath, client-server and REST across the network.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'منصة واحدة، إصداران', en: 'One platform, two editions' },
      code: 'COMMON = ["core", "auth"]          # commonality: every product has these\n\ndef edition(extra):\n    parts = COMMON + [f for f in extra if f]   # variability by SELECTION\n    return "+".join(parts)\n\nprint(edition([]))\nprint(edition(["video", "tax_eu"]))\n',
      explanation: {
        ar: 'COMMON هي المشترك: تبنى مرة ويورثها كل إصدار. أما اختيارات الإصدار فتمر عبر edition() التي تلحق ما اختير فقط — لا يعدل أحد الشيفرة المشتركة ليضيف ميزة. هذا هو شكل «الاختيار بدل النسخ» الذي تميز به خط المنتجات: إصدار جديد = قائمة اختيارات جديدة. جرّب أن تجعل الفيديو مشروطًا بمنطقة البيع وسترى نقطة تباين حقيقية بآلية اختيار صريحة.',
        en: 'COMMON is the commonality: built once, inherited by every edition. An edition choices flow through edition(), which appends only what was selected — nobody edits shared code to add a feature. That is product-line "select, do not copy": a new edition is a new list of selections. Gate the video feature on the sales region and you have a real variability point with an explicit selection mechanism.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.pattern-catalog',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'مشروع الفصل: ابن منتقي الأنماط. لديك RULES (ترتيبها مهم: أول تطابق يفوز) وSCENARIOS بسماتها وEXPECTED. اكتب select(traits) لتعيد اسم أول قاعدة تتحقق كل سماتها، أو layered إن لم يطابق شيء. شغل الكود: يجب أن يطبع بالضبط S1: pipe-filter ثم S2: client-server ثم S3: mvc ثم matched: 3/3. تحقق من المخرجات تحت CPython قبل اعتماد الحل.',
        en: 'Chapter project: build the pattern selector. You have RULES (order matters: first match wins), SCENARIOS with their traits, and EXPECTED. Write select(traits) to return the name of the first rule whose traits are ALL true, or "layered" if none matches. Run it: it must print exactly S1: pipe-filter, then S2: client-server, then S3: mvc, then matched: 3/3. Verify the output under CPython before settling on your solution.',
      },
      starterCode: 'RULES = [\n    ("pipe-filter", ("stream",)),\n    ("client-server", ("shared", "remote")),\n    ("mvc", ("ui",)),\n]\n\nSCENARIOS = [\n    ("S1", {"stream": True, "ui": False, "shared": False, "remote": False}),\n    ("S2", {"shared": True, "remote": True, "stream": False, "ui": False}),\n    ("S3", {"ui": True, "stream": False, "shared": False, "remote": False}),\n]\nEXPECTED = {"S1": "pipe-filter", "S2": "client-server", "S3": "mvc"}\n\ndef select(traits):\n    # TODO: return the name of the FIRST rule whose traits are ALL true;\n    # if no rule matches, return "layered".\n    ...\n\nhits = 0\nfor sid, traits in SCENARIOS:\n    pick = select(traits)\n    print(sid + ": " + str(pick))\n    if pick == EXPECTED[sid]:\n        hits += 1\nprint("matched: %d/%d" % (hits, len(SCENARIOS)))\n',
      solution: 'RULES = [\n    ("pipe-filter", ("stream",)),\n    ("client-server", ("shared", "remote")),\n    ("mvc", ("ui",)),\n]\n\nSCENARIOS = [\n    ("S1", {"stream": True, "ui": False, "shared": False, "remote": False}),\n    ("S2", {"shared": True, "remote": True, "stream": False, "ui": False}),\n    ("S3", {"ui": True, "stream": False, "shared": False, "remote": False}),\n]\nEXPECTED = {"S1": "pipe-filter", "S2": "client-server", "S3": "mvc"}\n\ndef select(traits):\n    for name, needs in RULES:\n        if all(traits.get(t, False) for t in needs):\n            return name\n    return "layered"\n\nhits = 0\nfor sid, traits in SCENARIOS:\n    pick = select(traits)\n    print(sid + ": " + str(pick))\n    if pick == EXPECTED[sid]:\n        hits += 1\nprint("matched: %d/%d" % (hits, len(SCENARIOS)))\n',
      tests: [
        {
          id: 's1-s2-verdicts',
          name: { ar: 'أحكام السيناريوهين الأولين', en: 'first two scenario verdicts' },
          code: "assert 'S1: pipe-filter' in __learner_output__ and 'S2: client-server' in __learner_output__, 'expected: S1: pipe-filter + S2: client-server | actual: %r' % __learner_output__",
        },
        {
          id: 's3-verdict',
          name: { ar: 'حكم السيناريو الثالث', en: 'third scenario verdict' },
          code: "assert 'S3: mvc' in __learner_output__, 'expected: S3: mvc | actual: %r' % __learner_output__",
        },
        {
          id: 'full-match',
          name: { ar: 'مطابقة كاملة', en: 'full match rate' },
          code: "assert 'matched: 3/3' in __learner_output__, 'expected: matched: 3/3 | actual: %r' % __learner_output__",
        },
      ],
      hints: [
        { ar: 'المنتقي يمر على RULES بالترتيب ويعيد أول اسم تتحقق كل سماته — تجاهل الترتيب يعطي إجابات خاطئة بصمت.', en: 'The selector walks RULES in order and returns the first name whose traits all hold — ignoring the order gives silently wrong answers.' },
        { ar: 'كل قاعدة تحمل tuple من السمات المطلوبة؛ افحصها بـ all() فوق traits.get(t, False).', en: 'Each rule carries a tuple of required traits; check them with all() over traits.get(t, False).' },
        { ar: "الهيكل: for name, needs in RULES: ثم if all(...): return name — وبعد الحلقة return 'layered'.", en: "The skeleton: for name, needs in RULES: then if all(...): return name — and after the loop return 'layered'." },
        { ar: "الحل الكامل: for name, needs in RULES: if all(traits.get(t, False) for t in needs): return name؛ ثم return 'layered'. الحلقة والطباعة جاهزان تحتك.", en: "Full solution: for name, needs in RULES: if all(traits.get(t, False) for t in needs): return name; then return 'layered'. The loop and printing below are already written." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-edition',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'خط إنتاج مصغر: ميزتان متاحتان وثالثة غير مفعل. ماذا يطبع الاستدعاء edition(["video", "tax_eu", "dark"])؟',
        en: 'A tiny product line: two features enabled, one disabled. What does edition(["video", "tax_eu", "dark"]) print?',
      },
      code: 'FLAGS = {"video": True, "tax_eu": False, "dark": True}\ndef edition(wanted):\n    parts = ["core"]\n    for f in wanted:\n        if FLAGS.get(f, False):\n            parts.append(f)\n    return "+".join(parts)\nprint(edition(["video", "tax_eu", "dark"]))\n',
      answer: 'core+video+dark',
      solution: 'core+video+dark',
      hints: [
        { ar: 'تذكر: tax_eu قيمتها False في FLAGS فلا تلحق بالناتج.', en: 'Remember: tax_eu is False in FLAGS, so it is not appended.' },
        { ar: 'النواة core تلحق دائمًا أولًا.', en: 'The core is always appended first.' },
        { ar: 'الترتيب يتبع ترتيب القائمة الممررة: video ثم dark.', en: 'The order follows the passed list: video, then dark.' },
        { ar: 'الناتج: core+video+dark.', en: 'The output: core+video+dark.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-commonality',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في عائلة إصدارات تطبيق عيادة، أي البنود التالية يصنف commonality؟',
        en: 'In a family of clinic-app editions, which of the following is a commonality?',
      },
      options: [
        { id: 'a', text: { ar: 'حساب ضريبة يختلف لكل منطقة بيع', en: 'A tax calculation that differs per sales region' } },
        { id: 'b', text: { ar: 'مصادقة المستخدمين الموجودة في كل إصدار', en: 'User authentication, present in every edition' } },
        { id: 'c', text: { ar: 'استشارات فيديو متاحة في إصدار واحد فقط', en: 'Video consultations available in one edition only' } },
        { id: 'd', text: { ar: 'شعار مخصص لكل عميل كبير', en: 'A custom logo per large customer' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل: هل هذه الميزة موجودة في كل منتجات العائلة بلا استثناء؟', en: 'Ask: is this feature present in every product of the family without exception?' },
        { ar: 'المشترك يبنى مرة ويورث؛ والمتغير يحتاج آلية اختيار صريحة.', en: 'A commonality is built once and inherited; a variability needs an explicit selection mechanism.' },
        { ar: 'الضريبة والفيديو والشعار تتغير بين المنتجات — إذن ليست هي.', en: 'The tax rule, video, and logo vary between products — so none of them is it.' },
        { ar: 'الإجابة b: المصادقة في كل الإصدارات بلا استثناء.', en: 'Answer b: authentication is in every edition, no exceptions.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-variability',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'ما يختلف بين منتجات العائلة الواحدة يسمى ______ (وما يجتمع فيها يسمى commonality). اكتب المصطلح الإنجليزي بصيغة المفرد كلمة واحدة.',
        en: 'What differs between products of one family is called a ______ (what they share is a commonality). Write the English term in the singular, one word.',
      },
      answer: 'variability',
      solution: 'variability',
      hints: [
        { ar: 'مضاد commonality في مفردات خطوط المنتجات.', en: 'The opposite of commonality in product-line vocabulary.' },
        { ar: 'كلمة إنجليزية تبدأ بحرف v.', en: 'An English word starting with v.' },
        { ar: 'جذرها vary: نقطة تتيح للاختلاف بين المنتجات.', en: 'Its root is vary: a point that is allowed to differ across products.' },
        { ar: 'variability — نقطة التباين التي تحتاج آلية اختيار.', en: 'variability — the difference point that needs a selection mechanism.' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-wrong-layer',
      required: true,
      prompt: {
        ar: 'منتقي الأنماط يعمل بلا أخطاء لكنه يقدم توصيات مقلوبة: حاجة تدفق بيانات (stream) تحصل على نمط واجهات! شغل brokenCode ولاحظ سطر الحكم الخاطئ ومعدل المطابقة، ثم أصلح الربط بين السمات والأنماط في RULES بحيث يطلب كل نمط سماته الصحيحة (وclient-server يطلب shared وremote معًا)، ويصبح الاختيار بـ all()، ويطبع الكود matched: 3/3.',
        en: 'The pattern selector runs without errors but recommends inverted patterns: a dataflow need (stream) gets a UI pattern! Run brokenCode and observe the wrong verdict line and the match rate, then fix the trait-to-pattern wiring in RULES so each pattern requires its correct traits (client-server requires shared AND remote together), the check uses all(), and the code prints matched: 3/3.',
      },
      brokenCode: "# BROKEN: the catalog's trait -> pattern wiring is crossed.\n# A dataflow need (stream) gets a UI pattern; a UI need gets a pipeline.\nRULES = [\n    (\"pipe-filter\", \"ui\"),\n    (\"mvc\", \"stream\"),\n    (\"client-server\", \"shared\"),\n]\n\ndef select(traits):\n    for name, key in RULES:\n        if traits.get(key, False):\n            return name\n    return \"layered\"\n\nSCENARIOS = [\n    (\"S1\", {\"stream\": True, \"ui\": False, \"shared\": False, \"remote\": False}),\n    (\"S2\", {\"shared\": True, \"remote\": True, \"stream\": False, \"ui\": False}),\n    (\"S3\", {\"ui\": True, \"stream\": False, \"shared\": False, \"remote\": False}),\n]\nEXPECTED = {\"S1\": \"pipe-filter\", \"S2\": \"client-server\", \"S3\": \"mvc\"}\n\nhits = 0\nfor sid, traits in SCENARIOS:\n    pick = select(traits)\n    print(sid + \": \" + pick)\n    if pick == EXPECTED[sid]:\n        hits += 1\nprint(\"matched: %d/%d\" % (hits, len(SCENARIOS)))\n",
      solution: 'RULES = [\n    ("pipe-filter", ("stream",)),\n    ("client-server", ("shared", "remote")),\n    ("mvc", ("ui",)),\n]\n\ndef select(traits):\n    for name, needs in RULES:\n        if all(traits.get(t, False) for t in needs):\n            return name\n    return "layered"\n\nSCENARIOS = [\n    ("S1", {"stream": True, "ui": False, "shared": False, "remote": False}),\n    ("S2", {"shared": True, "remote": True, "stream": False, "ui": False}),\n    ("S3", {"ui": True, "stream": False, "shared": False, "remote": False}),\n]\nEXPECTED = {"S1": "pipe-filter", "S2": "client-server", "S3": "mvc"}\n\nhits = 0\nfor sid, traits in SCENARIOS:\n    pick = select(traits)\n    print(sid + ": " + pick)\n    if pick == EXPECTED[sid]:\n        hits += 1\nprint("matched: %d/%d" % (hits, len(SCENARIOS)))\n',
      tests: [
        {
          id: 's1-fixed-verdict',
          name: { ar: 'حكم S1 بعد الإصلاح', en: 'S1 verdict after the fix' },
          code: "assert 'S1: pipe-filter' in __learner_output__, 'expected: S1: pipe-filter | actual: %r' % __learner_output__",
        },
        {
          id: 'full-match-fixed',
          name: { ar: 'مطابقة كاملة بعد الإصلاح', en: 'full match rate after the fix' },
          code: "assert 'matched: 3/3' in __learner_output__, 'expected: matched: 3/3 | actual: %r' % __learner_output__",
        },
      ],
      hints: [
        { ar: 'اقرأ مخرجات الكود المعطوب: S1 حاجتها stream وجابها mvc — أين ذهب pipe-filter؟', en: 'Read the broken output: S1 needs stream and got mvc — where did pipe-filter go?' },
        { ar: 'في RULES المعطوبة كل قاعدة مرتبطة بمفتاح واحد مخالف: الربط سمة-نمط مقلوب، والعميل-الخادم يفحص مفتاحًا واحدًا بدل اثنين.', en: 'In the broken RULES each pattern is wired to one wrong key: the trait-pattern mapping is crossed, and client-server checks one key instead of two.' },
        { ar: 'اجعل كل قاعدة tuple من سماتها الصحيحة: pipe-filter يطلب stream، وclient-server يطلب shared وremote معًا، وmvc يطلب ui.', en: 'Make every rule a tuple of its correct traits: pipe-filter requires stream, client-server requires shared and remote together, mvc requires ui.' },
        { ar: 'وفي select استبدل فحص المفتاح الواحد بـ all(traits.get(t, False) for t in needs) ثم أعد التشغيل حتى يطبع matched: 3/3.', en: 'In select, replace the single-key check with all(traits.get(t, False) for t in needs), rerun, and keep going until it prints matched: 3/3.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: 'RULES = [\n    ("pipe-filter", ("stream",)),\n    ("client-server", ("shared", "remote")),\n    ("mvc", ("ui",)),\n    ("shared-data", ("shared",)),     # add more rules and scenarios\n]\n\ndef select(traits):\n    for name, needs in RULES:\n        if all(traits.get(t, False) for t in needs):\n            return name\n    return "layered"\n\nprint(select({"stream": True, "ui": False, "shared": False, "remote": False}))\nprint(select({"ui": True, "stream": False, "shared": False, "remote": False}))\nprint(select({"shared": True, "remote": False, "stream": False, "ui": False}))\n# experiment: S4 — a clinic dashboard needs ui AND shared. Which rule wins?\n# reorder RULES and watch the verdict change.\n',
      prompt: {
        ar: 'لديك منتقي أضفنا له قاعدة shared-data. أضف سيناريو رابعًا S4 لعيادة تحتاج ui وshared معًا، وقرر أي قاعدة يجب أن تفوز ثم أعد ترتيب RULES لتتحقق. ثم أضف قاعدة خامسة تناسب حاجة «تيار + مشاركة» واختبرها.',
        en: 'Your selector now has a shared-data rule. Add a fourth scenario S4 for a clinic dashboard that needs ui AND shared, decide which rule should win, and reorder RULES to make it win. Then add a fifth rule for a "stream + shared" need and test it.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz',
      items: [
        {
          id: 'q1.ch6',
          question: { ar: 'قبل اختيار أي نمط معماري، يبقى الحاكم مبدأ تنظيم الوحدات من الفصل 6. أي مبدأ؟', en: 'Before choosing any architectural pattern, the Chapter 6 module-organization principle still governs. Which one?' },
          options: [
            { id: 'a', text: { ar: 'اجعل كل الدوال قصيرة', en: 'Keep every function short' } },
            { id: 'b', text: { ar: 'تماسك عالٍ وترابط منخفض — النمط مجرد وسيلة لتحقيقهما على مستوى النظام', en: 'High cohesion and low coupling — a pattern is just a means of achieving them at system scale' } },
            { id: 'c', text: { ar: 'قلل عدد الملفات إلى أدنى حد', en: 'Minimize the number of files' } },
            { id: 'd', text: { ar: 'اكتب تعليقات أكثر من الكود', en: 'Write more comments than code' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الأنماط ترتيبات مسماة لوحدات وموصلات؛ تقيسها بمدى تحقيقها تماسكًا أعلى وترابطًا أدنى، لا بشهرتها أو حداثتها.',
            en: 'Patterns are named arrangements of modules and connectors; judge them by how much cohesion they add and coupling they remove, not by fame or novelty.',
          },
        },
        {
          id: 'q2.ch1',
          question: { ar: 'الكتاب يختم الفصل بمبدأ الفصل 1. ما صيغته عند اختيار الأنماط؟', en: 'The book closes the chapter with the Chapter 1 principle. What is its form for choosing patterns?' },
          options: [
            { id: 'a', text: { ar: 'استخدم أحدث نمط دائمًا', en: 'Always use the newest pattern' } },
            { id: 'b', text: { ar: 'نظم النظام بحيث تكون التغييرات المتوقعة رخيصة، ولا تدفع مرونة لن تستخدمها', en: 'Structure the system so expected changes are cheap, and pay for no flexibility you will not use' } },
            { id: 'c', text: { ar: 'طبق كل الأنماط معًا احتياطًا', en: 'Apply every pattern together as a fallback' } },
            { id: 'd', text: { ar: 'قرر النمط بعد كتابة الكود لا قبله', en: 'Decide the pattern after writing the code, not before' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'استثمر في المرونة حيث التغيير محتمل وحده — والنمط الذي لا يخدم تغييرًا متوقعًا هو كلفة قائمة بلا عائد.',
            en: 'Invest in flexibility only where change is likely — a pattern serving no expected change is a standing cost with no return.',
          },
        },
        {
          id: 'q3.layering',
          question: { ar: 'ما الذي تشتريه الطبقات وما الذي تدفعه؟', en: 'What do layers buy you, and what do they charge you?' },
          options: [
            { id: 'a', text: { ar: 'توسع أفقي مجاني مقابل تعقيد نشر', en: 'Free horizontal scaling versus deployment complexity' } },
            { id: 'b', text: { ar: 'عزل التغيير وقابلية الاستبدال مقابل ضريبة العبور وكلفة كل حد', en: 'Change isolation and substitutability versus the pass-through tax and per-boundary cost' } },
            { id: 'c', text: { ar: 'أمان مطلق مقابل بطء', en: 'Absolute security versus slowness' } },
            { id: 'd', text: { ar: 'لا شيء — هي مجرد تنظيم مجلدات', en: 'Nothing — they are just folder organization' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الطبقات تعزل التغيير وتسمح باستبدال التنفيذ خلف واجهة، وتدفع عبورًا غير مباشر وكلفة صغيرة عند كل حد — ولا تشتري توسعًا أفقيًا.',
            en: 'Layers isolate change and let you swap implementations behind interfaces, charging indirection and a small per-boundary cost — they buy no horizontal scaling.',
          },
        },
        {
          id: 'q4.observer',
          question: { ar: 'في observer، أي وصف لاتجاه الاعتمادية صحيح؟', en: 'In observer, which description of the dependency direction is correct?' },
          options: [
            { id: 'a', text: { ar: 'الموضوع يعرف كل مشاهديه بالاسم ويستدعيهم مباشرة', en: 'The subject knows every observer by name and calls them directly' } },
            { id: 'b', text: { ar: 'الطرفان يعتمدان على الواجهتين فقط: المشترك يعرف واجهة الاشعار، والموضوع يستدعي update دون معرفة الأنواع', en: 'Both depend on interfaces only: the subscriber knows the notification interface, and the subject calls update without knowing concrete types' } },
            { id: 'c', text: { ar: 'لا اعتمادية أصلًا بين الطرفين', en: 'There is no dependency at all between the two sides' } },
            { id: 'd', text: { ar: 'المشاهد يعدل حالة الموضوع مباشرة', en: 'The observer mutates the subject state directly' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بهذا الانعكاس تضيف مشتركًا جديدًا دون تعديل الموضوع — لكن انتبه: تدفق التحكم يصبح خفيًا وهذا ثمن النمط المعلن.',
            en: 'That inversion lets you add a new observer without editing the subject — but beware: control flow becomes implicit, which is the pattern declared price.',
          },
        },
        {
          id: 'q5.rest',
          question: { ar: 'لماذا تلزم REST كل طلب بحمل كل ما يحتاجه الخادم (statelessness)؟', en: 'Why does REST require every request to carry everything the server needs (statelessness)?' },
          options: [
            { id: 'a', text: { ar: 'لتخفيف حجم الردود فقط', en: 'Only to shrink response sizes' } },
            { id: 'b', text: { ar: 'حتى يستطيع أي خادم من خوادم الوسيط أن يجيب أي طلب — أساس التوسع الأفقي', en: 'So any server behind the broker can answer any request — the foundation of horizontal scaling' } },
            { id: 'c', text: { ar: 'لأن الجلسات ممنوعة تقنيًا في HTTP', en: 'Because sessions are technically forbidden in HTTP' } },
            { id: 'd', text: { ar: 'حتى تختفي الحاجة إلى بروتوكول', en: 'So the need for a protocol disappears' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بلا حالة جلسة محفوظة لدى الخادم، يستطيع أي خادم متساوٍ الإجابة عن أي طلب — وهذا ما يجعل الإضافة الأفقية للخوادم ممكنة، ويترك الحالة الحقيقية في الرموز أو الطبقة المشتركة.',
            en: 'With no per-client session held on the server, any equal server can answer any request — that is what makes adding servers horizontally possible, pushing real state into tokens or the shared data layer.',
          },
        },
        {
          id: 'q6.productline',
          question: { ar: 'متى يسدد استثمار خط المنتجات كلفته؟', en: 'When does the product-line investment break even?' },
          options: [
            { id: 'a', text: { ar: 'دائمًا من أول منتج', en: 'Always, from the very first product' } },
            { id: 'b', text: { ar: 'حين تكفي منتجات مبنية من المنصة حتى تتجاوز وفوراتها كلفتها الإضافية', en: 'When enough products are built from the platform that their savings exceed the extra platform cost' } },
            { id: 'c', text: { ar: 'لا يسدد أبدًا في أي ظرف', en: 'It never breaks even under any circumstance' } },
            { id: 'd', text: { ar: 'حين تحذف كل نقاط التباين', en: 'When you delete every variation point' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'أصلح خطأ في المشترك مرة فيرثه الجميع، لكنك دفعت المنصة مقدمًا — التعادل يأتي بعدد المنتجات، والخطر الأكبر التنبؤ الخاطئ بالمحور المتغير.',
            en: 'Fix a bug in a commonality once and every product inherits it, but you paid for the platform up front — break-even comes with product count, and the biggest risk is mispredicting the variable axis.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'نسخنا منتج العام الماضي وحرفنا فيه لإصدار جديد.',
          right: 'ابن منصة مشتركة ونقاط تباين صريحة، ثم اجعل كل إصدار يختار ولا يعدل الشيفرة المشتركة.',
          note: { ar: 'النسخ والحرف يولد عائلة شيفرة عتيقة متفرقة، وكل إصلاح يعاد N مرة.', en: 'Copy-and-hack breeds a scattered family of legacy code, and every fix is repeated N times.' },
        },
        {
          wrong: 'بنينا آلية إضافات مرنة لخاصية لم تختلف بين أي إصدار قط.',
          right: 'استثمر في المرونة حيث التغيير محتمل فقط، وتوقع المحور المتغير من فهم عميق للمجال.',
          note: { ar: 'مرونة غير مستعملة كلفة قائمة بلا عائد، ومحور خاطئ يعيد فتح الشيفرة المشتركة.', en: 'Unused flexibility is a standing cost with no return; a mispredicted axis reopens shared code.' },
        },
        {
          wrong: 'اخترنا أشهر نمط في السوق لنظام صغير بسيط.',
          right: 'اختر أصغر نمط يعالج المشكلة وسم ما تشتريه وما تدفعه.',
          note: { ar: 'نمط بلا حاجة مسماة يضيف أجزاء متحركة وكلفة صيانة — تقليد شكلي لا تصميم.', en: 'A pattern without a named need adds moving parts and maintenance cost — cargo-culting, not designing.' },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'خط المنتجات يفصل المشترك (يبنى مرة ويورث) عن المتغير (آلية اختيار صريحة: flag أو plug-in).', en: 'A product line separates commonality (built once, inherited) from variability (an explicit selection mechanism: flag or plug-in).' },
        { ar: 'المعمارية المرجعية تحمل العائلة: هندسة المجال تبنيها، وهندسة التطبيق تركب المنتجات منها باختيار النسخ.', en: 'The reference architecture carries the family: domain engineering builds it, application engineering assembles products from it by selection.' },
        { ar: 'كل نقطة تباين واجهة خلفها بدائل — والأنماط التي تعلمتها هي آلات بناء تلك الواجهات.', en: 'Every variation point is an interface with alternatives behind it — the patterns you learned are the machinery for building those interfaces.' },
        { ar: 'الكتالوج لغة مشتركة: اختر أصغر نمط يعالج المشكلة، وسم ما تشتريه وما تدفعه.', en: 'The catalog is a shared language: pick the smallest pattern addressing the problem, and name what you buy and what you pay.' },
      ],
      reflectPrompt: {
        ar: 'اختر نظامًا تعرفه واكتب ثلاثة أسطر: أي نمط يحكمه، ما الذي اشتراه به، وما أول ثمن يدفعه اليوم — ثم اجعله مدخل سجل أنماط خاص بك.',
        en: 'Pick a system you know and write three lines: which pattern governs it, what it bought with that pattern, and the first price it pays today — then make it the first entry of your own pattern journal.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch7.s6', pages: 'ص193-195 / pp.193-195' },
        { book: 'SWE', section: 'swe.ch7.s7', pages: 'ص195-196 / pp.195-196' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch7.s6', pages: 'ص193-195 / pp.193-195' },
    { book: 'SWE', section: 'swe.ch7.s7', pages: 'ص195-196 / pp.195-196' },
  ],
} satisfies Lesson;

export default lesson;
