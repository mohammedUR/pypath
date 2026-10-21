import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch11.l4 — "Chapter 11 Review and Project: Password and Policy Auditor
 * مراجعة الفصل 11 ومشروع: مدقّق كلمات المرور والسياسات"
 * Aligned with SWE ch11 s6 (Conclusion, Exercises and Open Resources,
 * pp.303-313).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: a password/policy auditor over FIXED data — a leaked
 * unsalted sha256 digest set, a policy rule (length + character classes),
 * a reuse counter, and a one-line report. Deterministic by construction:
 * nothing interactive, nothing unpredictable, no process spawning, no
 * network access.
 */

const lesson = {
  id: 'swe.ch11.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 11,
  title: { ar: 'مراجعة الفصل 11 ومشروع: مدقّق كلمات المرور والسياسات', en: 'Chapter 11 Review and Project: Password and Policy Auditor' },
  estimatedMinutes: 40,
  prerequisites: ['swe.ch11.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'ثلاثة دروس جمع الفصل إطارًا واحدًا: الدرس الأول أعطاك اللغة — ما تحميه بثلاثية CIA، ومن يهدده، وأي فئة يسكن العيب — والثاني أعطاك البحث عن ثغراتك من المراجعة إلى الوكلاء، والثالث أخرجك إلى سلسلة التوريد وعادات بناء الأمن داخليًا. اليوم نضغط الثلاثة في ذاكرة عاملة ثم نحوّلها إلى أداة تُبنى وتُختبر فعلًا: مشروع ختامي — مدقّق كلمات المرور والسياسات. البيانات مثبتة كاملة: قائمة تسريب حقيقية الشكل ببصمات sha256 غير الملّحة لكلمات شائعة، وحسابات بكلمات مرور معروفة العيوب، وسياسة بقاعدتين — الطول والأصناف — وعدّاد إعادة استخدام، وتقرير سطر واحد: weak وreused وbreached. وستخضع الأداة لاختبارات حقيقية تعمل في بيئة جديدة وتقرأ مخرجاتك كما يفعل المُصحِّح. بنهاية الدرس ستكون قادرًا على: كتابة مدقّق كامل يجتاز أربع اختبارات، وشرح لماذا يُقارن التسريب بكلمة المرور الخام بينما يبقى الملح حارس المتجر، وتصنيف نتائجك على فئات الفصل.',
        en: 'Three lessons built one frame: lesson one gave the language — what you protect with the CIA triad, who threatens it, which category a defect lives in; lesson two the hunt for your own vulnerabilities, from review to agents; lesson three the supply chain and the habits of building security in. Today we compress the three into working memory and turn them into a tool that is really built and really tested: a closing project — the password and policy auditor. The data is fixed end to end: a realistically shaped leak of unsalted sha256 digests of common passwords, accounts with known-flawed passwords, a two-rule policy — length and character classes — a reuse counter, and a one-line report: weak, reused, breached. And the tool faces real tests running in a fresh environment and reading your output the way a grader does. By the end of this lesson you will be able to: write a complete auditor passing four tests, explain why the leak is compared against the raw password while the salt stays the store\u2019s guardian, and map your findings onto the chapter\u2019s categories.',
      },
    },
    {
      kind: 'predict',
      code: "import hashlib\n\nLEAKED = {'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'}\n\ndef h(pw):\n    return hashlib.sha256(pw.encode('utf-8')).hexdigest()\n\nprint(h('password') in LEAKED)\nprint(h('P@ssw0rd!') in LEAKED)\nprint(len(LEAKED))",
      question: {
        ar: 'قائمة تسريب ببصمة واحدة. أي السطور الثلاثة يشرح لماذا تعمل جردة التسريب بلا فك أي تشفير؟ ولماذا لن تنجح الحيلة نفسها أبدًا ضد متجر مُلِّح كما في الدرس الأول؟',
        en: 'A leak list with one digest. Which of the three lines explains why breach checking works without cracking anything? And why can the same trick never succeed against a properly salted store as in lesson one?',
      },
      reveal: {
        ar: 'الطباعة: True ثم False ثم 1. السطر الأول هو كله السبب: بصمة sha256 لكلمة المرور وحدها تُعاد في خطوة واحدة فتطابق سطر التسريب — لا كسر تشفير ولا هجوم، مجرد جردة قاموس. والسطر الثاني: كلمة قوية خارج الجدول تبقى غير ظاهرة — الجردة تصطاد الشائع لا المستحيل. ولماذا لا تنجح ضد المتجر الملّح؟ لأن مخزنه لا يحتوي sha256(password) إطلاقًا: كل سطر فيه يخلط ملحًا فريدًا بالمستخدم فيصير نمط التسريب أعمى عنه — هذه اللامتماثلية بين تسريب غير ملّح ومتجر ملّح هي تصميم مشروع اليوم.',
        en: 'It prints True, then False, then 1. The first line is the whole reason: the sha256 digest of the password alone recomputes in one step and matches the leak row — no cracking, no attack, just a dictionary sweep. The second: a strong password outside the table stays invisible — the sweep catches the common, not the impossible. And why never against a salted store? Because it holds no sha256(password) at all: every row mixes a user-unique salt into the digest, so the leak pattern is blind to it — that asymmetry between an unsalted leak and a salted store is today\u2019s project\u2019s design.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الذاكرة العاملة: الدرس الأول والثاني في سطرين', en: 'Working memory: lessons one and two in two moves' },
      chunks: [
        {
          ar: 'الدرس الأول أسّس الإطار: الأمن صفة عبر دورة الحياة لا مرحلة، وثلاثية CIA تسمّي ما تحميه — سرية وسلامة وتوافر — مع فرق هندسي بين تهديد لا تختاره وثغرة تملكها واستغلال يحوّل الأولى بالثانية. وقائمة OWASP صارت أشكال بايثون لا وعظ: A01 تخويل يُقرَّر على الخادم، وA05 استعلام مُعامَل يفصل الكود عن البيانات، وA04 تعمية، وA07 مصادقة. والشكل العملي الذي بنيناه: sha256(salt + password) بملح فريد لكل مستخدم، والمقارنة بـ hmac.compare_digest لا == لأن المقارنة العادية تسرّب زمنًا يقيسه خصم صبور، وعدّاد إخفاقات يُقفل بعد عتبة. وكتلة التصحيح آنذاك أظهرت العلامة الحاسمة: بلا ملح حتى كلمة المرور الصحيحة تُرفض — فشل بإغلاق صامت.',
          en: 'Lesson one set the frame: security is a lifecycle property, not a phase; the CIA triad names what you protect — confidentiality, integrity, availability — with the engineering split between a threat you rarely choose, a vulnerability you own, and an exploit turning the first by the second. The OWASP list became Python shapes, not sermon: A01 authorization decided on the server, A05 parameterized queries separating code from data, A04 cryptographic failures, A07 authentication. The working shape we built: sha256(salt + password) with a unique salt per user, compared via hmac.compare_digest rather than == because an ordinary comparison leaks timing a patient adversary measures, plus a failure counter locking after a threshold. That debug block showed the decisive sign: without the salt even the correct password is denied — a silent fail-closed.',
        },
        {
          ar: 'والدرس الثاني علّم البحث: العين البشرية ترى النية والتصميم، ثم ثلاث عائلات يكمل بعضها — SAST يقرأ المصدر، وDAST يهاجم العامل من الخارج، وSCA يقرأ قائمة الاعتماديات — وكلها تحت اقتصاد الإشارة: إنذارات كاذبة تدرب الفريق على التجاهل، وإنذار كاذب بالسلب يطمئن زورًا كما رأيت في نطاق المسير الخاطئ الذي عدّ eval صفرًا على شيفرة مريضة. والتغذية كانت اختيارًا مقصودًا بأصناف وحدود على قائمة ثابتة — الفصل العاشر بحُلّة أمنية. ثم الذكاء الاصطناعي عند ثلاث نقاط: يصلح المعروف، ويصطاد المجهول، ويتحقق ببرهان عامل — تحت قواعد ثلاث غير قابلة للتفاوض: تفويض أولًا، والتحقق يبقى عملك، ولا تعويض عن التصميم الآمن.',
          en: 'Lesson two taught the hunt: the human eye sees intent and design, then three complementary families — SAST reads the source, DAST attacks the running app from outside, SCA reads the dependency manifest — all under signal economics: false alarms train a team to ignore the tool, and a false negative falsely reassures, as you saw in the wrong walk scope that counted eval as zero on sick code. Fuzzing was deliberate selection by classes and boundaries over a fixed list — chapter ten in a security costume. Then AI at three points: fixing the known, hunting the unknown, validating with a working proof-of-concept — under three non-negotiable rules: authorization first, validation stays yours, no substitute for secure design.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'ذاكرة سلسلة التوريد، ثم عقد المشروع', en: 'Supply-chain memory, then the project contract' },
      chunks: [
        {
          ar: 'والدرس الثالث وسّع حدود شيفرك: بيان الاعتماديات قرار ثقة — 64% من مكوّنات القاعدة النموذجية غير مباشرة — والحلقات الضعيفة بشر: عشرون حسابًا تكفي لنصف npm، ومطوّر واحد منهك كان باب xz. حالتان سدّتا الطرفين: Log4Shell ثغرة عرضية في اعتمادية شائعة لا تعرف أنك تملكها، وxz هجوم متعمَّد متعدد السنوات. والصندوق يجيب أسئلة الأثر: SBOM بمعياري CycloneDX وSPDX يجرد ما داخله، وSLSA يدرّ كيف بُني، وSigstore من وقّعه، وScorecard صحة المصدر — والتثبيت الدقيق pinning مع lockfile يغلق باب الترقية التلقائية. ثم عادات بناء الأمن داخليًا: إعدادات آمنة وأقل امتياز وأسرار خارج المصدر، مع تسجيل وتنبيه ومعالجة استثناءات — والمبدأ: المسار الافتراضي هو الآمن والمميَّز استثناء.',
          en: 'Lesson three widened your code\u2019s borders: the manifest is a trust decision — 64% of components in a typical codebase are transitive — and the weak links are human: twenty accounts suffice to poison half of npm, one burned-out maintainer was xz\u2019s door. Two cases bracketed it: Log4Shell, an accidental vulnerability in a dependency you did not know you had, and xz, a deliberate multi-year attack. The toolbox answers an artifact\u2019s questions: the SBOM (CycloneDX, SPDX) inventories what is inside, SLSA grades how it was built, Sigstore who signed it, Scorecard the source\u2019s health — and exact pinning with a lockfile closes the auto-update door. Then the habits of building security in: secure defaults, least privilege, secrets outside source, with logging, alerting and careful exception handling — the principle: the default path is secure and the privileged path the exception.',
        },
        {
          ar: 'أما مشروع اليوم فعقده واضح ومثبت تمامًا كما اشترط الفصل العاشر لأوراكل صادق: قائمة LEAKED تحمل أربع بصمات sha256 غير الملّحة لكلمات شائعة — password و123456 وqwerty وletmein — وقائمة ACCOUNTS ستة حسابات بكلمات معروفة العيوب، وسياسة من قاعدتين: الطول عشرة محارف على الأقل، وثلاثة أصناف محارف على الأقل من الأربعة — صغيرة وكبيرة وأرقام وغير حرفيّة. وreused يُعدّ من الظهور الثاني لكلمة مرور تكررت، وbreached يُقارن بكلمة المرور الخام عبر قائمة التسريب، والتقرير سطر واحد بالنمط weak: X / reused: Y / breached: Z. والمُصحِّح يشغّل حلّك في بيئة جديدة، ويلتقط طبقاتك في __learner_output__، ثم يشغّل كل اختبار في البيئة نفسها — نفس دلالات أدوات المراجعة التي تتحقق بها اليوم بالضبط.',
          en: 'Today\u2019s project\u2019s contract is explicit and fixed, exactly as chapter ten demanded for an honest oracle: the LEAKED list carries four unsalted sha256 digests of common passwords — password, 123456, qwerty, letmein — and ACCOUNTS holds six accounts with deliberately flawed passwords; the policy has two rules: length at least ten characters, and at least three of the four character classes — lower, upper, digits, non-alphanumeric. reused counts from the second appearance of a repeated password, breached is compared against the raw password via the leak list, and the report is one line in the shape weak: X / reused: Y / breached: Z. The grader runs your solution in a fresh environment, captures your prints into __learner_output__, then runs every test in that same environment — the exact replay semantics you verify today.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'عقدان بجانب بعضهما: المتجر الملّح وقائمة التسريب', en: 'Two contracts side by side: the salted store and the leak list' },
      code: "import hashlib\nimport hmac\n\nSALT_STORE = {\n    'ada': {'salt': 'a1b2c3d4', 'digest': '16fdb6d42c139c7d6b0a4be7e3770a7daa0e98e1acf3b517acc5543cc583e6a7'},\n}\nLEAKED = {\n    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',\n    '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',\n}\n\ndef check(user, password):\n    row = SALT_STORE.get(user)\n    if row is None:\n        return False\n    attempt = hashlib.sha256((row['salt'] + password).encode('utf-8')).hexdigest()\n    return hmac.compare_digest(attempt, row['digest'])\n\ndef in_leak(password):\n    return hashlib.sha256(password.encode('utf-8')).hexdigest() in LEAKED\n\nfor user, pw in [('ada', 'Qw7!vXm2Rp'), ('grace', 'password')]:\n    print('%s: store=%s leak=%s' % (user, check(user, pw), in_leak(pw)))",
      explanation: {
        ar: 'مجموعتا بيانات، وعقدان مختلفان تمامًا — وهذا هو قلب المشروع. المتجر ملّح: check يجيب عن المستخدم بـ get، ويعيد حساب sha256(salt + password) بالدالة نفسها، ويقارن بـ hmac.compare_digest — عقد الدرس الأول حرفيًّا. قائمة التسريب غير ملّحة: in_leak تحسب sha256 للكلمة الخام وحدها وتسأل عن العضوية — تعمل فقط لأن التسريب بُني هكذا. ولاحظ النتيجة: ada ينجح في المتجر ويغيب عن التسريب — بصمتها الملّحة 16fdb... لا وجود لها في أي قائمة خام، وهذا سر الحماية؛ وgrace تفشل في المتجر (مستخدم غير معروف أصلًا) وتقع في التسريب لأن password من أشهر كلمات العالم. اقرأها كمهندس: التسريب غير الملّح مسؤولية أصحابه ومورد جردة للمدقّق، والملح هو ما يجعل متجرك أعمى عن تلك الجردة.',
        en: 'Two datasets, two entirely different contracts — and that is the project\u2019s heart. The store is salted: check looks the user up with get, recomputes sha256(salt + password) with the same function, and compares with hmac.compare_digest — lesson one\u2019s contract verbatim. The leak is unsalted: in_leak hashes the raw password alone and asks membership — it works only because the dump was built that way. Note the outcome: ada passes the store and is absent from the leak — her salted digest 16fdb... exists in no raw list, and that is the whole protection; grace fails the store (an unknown user to begin with) and falls in the leak because password is one of the world\u2019s most common. Read it as an engineer: an unsalted leak is its owners\u2019 liability and the auditor\u2019s oracle, and the salt is what keeps your store blind to that oracle.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.write-auditor',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: أكمل دالة audit(accounts) ليعمل المدقّق كاملًا. الدوال المساعدة weak(pw) وbreached(pw) جاهزة. المطلوب: weak يعدّ الحسابات التي ترجع weak(pw) القيمة True؛ وreused يعدّ الحسابات التي تكررت كلمة مرورها بعد أول ظهور — حافظ على مجموعة seen وأضف إليها بعد الفحص؛ وbreached يعدّ الحسابات التي ترجع breached(pw) القيمة True. أعد الثلاثة كسلسلة (weak, reused, breached). المتوقع من الطبقات: weak: 3 / reused: 1 / breached: 2.',
        en: 'The project: complete audit(accounts) so the auditor works end to end. The helpers weak(pw) and breached(pw) are provided. weak counts accounts where weak(pw) is True; reused counts accounts whose password repeats after its first appearance — keep a seen set and add to it after the check; breached counts accounts where breached(pw) is True. Return the three as a tuple (weak, reused, breached). Expected print: weak: 3 / reused: 1 / breached: 2.',
      },
      starterCode: "import hashlib\n\nLEAKED = {\n    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',\n    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',\n    '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',\n    '1c8bfe8f801d79745c4631d09fff36c82aa37fc4cce4fc946683d7b336b63032',\n}\n\nACCOUNTS = [\n    ('ada', 'Qw7!vXm2Rp'),\n    ('grace', 'password'),\n    ('linus', 'password'),\n    ('kay', 'Sunshine2026'),\n    ('alan', 'abc'),\n    ('betty', 'Tr0ub4dor&3x'),\n]\n\ndef digest(pw):\n    return hashlib.sha256(pw.encode('utf-8')).hexdigest()\n\ndef breached(pw):\n    return digest(pw) in LEAKED\n\ndef weak(pw):\n    if len(pw) < 10:\n        return True\n    classes = 0\n    if any(c.islower() for c in pw):\n        classes = classes + 1\n    if any(c.isupper() for c in pw):\n        classes = classes + 1\n    if any(c.isdigit() for c in pw):\n        classes = classes + 1\n    if any(not c.isalnum() for c in pw):\n        classes = classes + 1\n    return classes < 3\n\ndef audit(accounts):\n    # 1) weak: عدّ الحسابات التي ترجع weak(pw) القيمة True\n    #    weak: count accounts where weak(pw) is True\n    # 2) reused: عدّ التكرار بعد أول ظهور — مجموعة seen تُحدَّث بعد الفحص\n    #    reused: count repeats after the first appearance — a seen set updated after the check\n    # 3) breached: عدّ الحسابات التي ترجع breached(pw) القيمة True\n    #    breached: count accounts where breached(pw) is True\n    # 4) أعد الثلاثة كسلسلة (weak, reused, breached)\n    #    return the three as a tuple (weak, reused, breached)\n    return (0, 0, 0)\n\nweak_n, reused_n, breached_n = audit(ACCOUNTS)\nprint('weak: %d / reused: %d / breached: %d' % (weak_n, reused_n, breached_n))",
      solution: "import hashlib\n\nLEAKED = {\n    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',\n    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',\n    '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',\n    '1c8bfe8f801d79745c4631d09fff36c82aa37fc4cce4fc946683d7b336b63032',\n}\n\nACCOUNTS = [\n    ('ada', 'Qw7!vXm2Rp'),\n    ('grace', 'password'),\n    ('linus', 'password'),\n    ('kay', 'Sunshine2026'),\n    ('alan', 'abc'),\n    ('betty', 'Tr0ub4dor&3x'),\n]\n\ndef digest(pw):\n    return hashlib.sha256(pw.encode('utf-8')).hexdigest()\n\ndef breached(pw):\n    return digest(pw) in LEAKED\n\ndef weak(pw):\n    if len(pw) < 10:\n        return True\n    classes = 0\n    if any(c.islower() for c in pw):\n        classes = classes + 1\n    if any(c.isupper() for c in pw):\n        classes = classes + 1\n    if any(c.isdigit() for c in pw):\n        classes = classes + 1\n    if any(not c.isalnum() for c in pw):\n        classes = classes + 1\n    return classes < 3\n\ndef audit(accounts):\n    weak_n = 0\n    reused_n = 0\n    breached_n = 0\n    seen = set()\n    for name, pw in accounts:\n        if weak(pw):\n            weak_n = weak_n + 1\n        if pw in seen:\n            reused_n = reused_n + 1\n        seen.add(pw)\n        if breached(pw):\n            breached_n = breached_n + 1\n    return (weak_n, reused_n, breached_n)\n\nweak_n, reused_n, breached_n = audit(ACCOUNTS)\nprint('weak: %d / reused: %d / breached: %d' % (weak_n, reused_n, breached_n))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الأعداد الثلاثة صحيحة على الحسابات الست', en: 'The three counts are correct over the six accounts' },
          code: "assert audit(ACCOUNTS) == (3, 1, 2), 'expected: (3, 1, 2) | actual: %r' % (audit(ACCOUNTS),)",
          expected: '(3, 1, 2)',
        },
        {
          id: 't2',
          name: { ar: 'التقرير يطبع سطر المشروع كاملًا', en: 'The report prints the full project line' },
          code: "assert 'weak: 3 / reused: 1 / breached: 2' in __learner_output__, 'expected: weak: 3 / reused: 1 / breached: 2 | actual: %r' % __learner_output__",
          expected: 'weak: 3 / reused: 1 / breached: 2',
        },
        {
          id: 't3',
          name: { ar: 'السياسة تميّز الضعيف من القوي', en: 'The policy separates weak from strong' },
          code: "assert weak('password') is True and weak('Qw7!vXm2Rp') is False and weak('Sunshine2026') is False, 'expected: True/False/False | actual: %r' % ((weak('password'), weak('Qw7!vXm2Rp'), weak('Sunshine2026')),)",
          expected: 'True for password, False for the strong pair',
        },
        {
          id: 't4',
          name: { ar: 'جردة التسريب تصطاد المعروف وتترك السليم', en: 'The breach sweep catches the known and spares the clean' },
          code: "assert breached('password') is True and breached('123456') is True and breached('Qw7!vXm2Rp') is False, 'expected: True/True/False | actual: %r' % ((breached('password'), breached('123456'), breached('Qw7!vXm2Rp')),)",
          expected: 'True for both leaked, False for the clean password',
        },
      ],
      hints: [
        { ar: 'ثلاثة عدّادات تصفريها قبل الحلقة ومجموعة seen فارغة — والحلقة for name, pw in accounts تفكّ كل زوج تلقائيًّا كما في قوائم الأزواج من PY4E.', en: 'Three counters zeroed before the loop and an empty seen set — and for name, pw in accounts unpacks each pair automatically, as with lists of pairs in PY4E.' },
        { ar: 'ترتيب إعادة الاستخدام حساس: اسأل pw in seen قبل seen.add(pw) — العكس يجعل الظهور الأول يُعدّ تكرارًا فترتفع reused إلى 6.', en: 'Reuse order is sensitive: test pw in seen before seen.add(pw) — the reverse counts the first appearance as a repeat and pushes reused up to 6.' },
        { ar: 'الهيكل:\nweak_n = 0\nreused_n = 0\nbreached_n = 0\nseen = set()\nfor name, pw in accounts:\n    if weak(pw):\n        weak_n = weak_n + 1\n    if pw in seen:\n        reused_n = reused_n + 1\n    seen.add(pw)\n    if breached(pw):\n        breached_n = breached_n + 1\nreturn (weak_n, reused_n, breached_n)', en: 'The skeleton:\nweak_n = 0\nreused_n = 0\nbreached_n = 0\nseen = set()\nfor name, pw in accounts:\n    if weak(pw):\n        weak_n = weak_n + 1\n    if pw in seen:\n        reused_n = reused_n + 1\n    seen.add(pw)\n    if breached(pw):\n        breached_n = breached_n + 1\nreturn (weak_n, reused_n, breached_n)' },
        { ar: 'الحل الكامل يطبع weak: 3 / reused: 1 / breached: 2 — grace وlinus وalan ضعفاء، وlinus هو التكرار الوحيد، وgrace وlinus في قائمة التسريب بينما ada وkay وbetty نظيفات.', en: 'The full solution prints weak: 3 / reused: 1 / breached: 2 — grace, linus and alan are weak, linus is the single reuse, grace and linus sit in the leak while ada, kay and betty are clean.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-policy',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. الدالة classes تعدّ أصناف المحارف الأربعة، وسياسة المشروع تشترط ثلاثة أصناف على الأقل وعشرة محارف.',
        en: 'Read the code and predict its exact output — one line per print — without running it. The classes function counts the four character classes, and the project policy requires at least three classes and ten characters.',
      },
      code: "def classes(pw):\n    n = 0\n    if any(c.islower() for c in pw):\n        n = n + 1\n    if any(c.isupper() for c in pw):\n        n = n + 1\n    if any(c.isdigit() for c in pw):\n        n = n + 1\n    if any(not c.isalnum() for c in pw):\n        n = n + 1\n    return n\n\nfor pw in ['abc', 'Abc1', 'Abc1!', 'abcdefghij']:\n    print('%s: %d' % (pw, classes(pw)))\nprint('long enough: %s' % (len('abcdefghij') >= 10))",
      solution: 'abc: 1\nAbc1: 3\nAbc1!: 4\nabcdefghij: 1\nlong enough: True',
      answer: 'abc: 1\nAbc1: 3\nAbc1!: 4\nabcdefghij: 1\nlong enough: True',
      hints: [
        { ar: 'abc: حروف صغيرة فقط — صنف واحد. وانتبه: isdigit يصنّف الأرقام، وnot isalnum يصنّف ما ليس حرفًا ولا رقمًا كالعلامات.', en: 'abc: lowercase only — one class. Mind the boundaries: isdigit classifies digits, and not isalnum classifies anything that is neither letter nor digit, like punctuation.' },
        { ar: 'Abc1 يجمع صغيرًا وكبيرًا ورقمًا — ثلاثة أصناف فيمرّ شرط الأصناف رغم قصره؛ وAbc1! يضيف العلامة فيبلغ الأربعة.', en: 'Abc1 carries lower, upper and a digit — three classes, so it passes the class rule despite its length; Abc1! adds the punctuation and reaches four.' },
        { ar: 'abcdefghij عشرة محارف صغيرة — صنف واحد فقط: الطول وحده لا يكفي، ولهذا اشترطت السياسة الشرطين معًا. والسطر الأخير يساوي True لأن 10 >= 10.', en: 'abcdefghij is ten lowercase characters — a single class: length alone is not enough, which is why the policy requires both rules together. The last line is True because 10 >= 10.' },
        { ar: 'الخرج:\nabc: 1\nAbc1: 3\nAbc1!: 4\nabcdefghij: 1\nlong enough: True', en: 'The output:\nabc: 1\nAbc1: 3\nAbc1!: 4\nabcdefghij: 1\nlong enough: True' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-defaults',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في حالة Log4Shell كان جذر الكارثة ميزة تفسّر صياغة خاصة داخل النصوص المُسجَّلة مفعّلة افتراضيًّا في مكتبة لم يطلبها أحد. أي عادة من عادات بناء الأمن داخليًا كانت ستغلق هذا الباب من التصميم؟',
        en: 'In the Log4Shell case, the root of the disaster was a feature — enabled by default — interpreting special lookup syntax inside logged strings, in a library nobody had asked for. Which building-security-in habit would have closed that door at design time?',
      },
      options: [
        { id: 'a', text: { ar: 'أقل امتياز — لأن المكتبة حصلت على وصول زائد عن حاجتها', en: 'Least privilege — because the library held more access than it needed' } },
        { id: 'b', text: { ar: 'الإعدادات الآمنة — اشحن مقفلًا حتى تكون الميزة الخطرة مطفأة افتراضيًّا ولا تعمل إلا بقرار صريح', en: 'Secure defaults — ship locked down so the dangerous feature is off by default and runs only by explicit decision' } },
        { id: 'c', text: { ar: 'إدارة الأسرار — لأن السجل كان يكشف مفاتيح مخزّنة', en: 'Secrets management — because the log exposed stored keys' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'نص القسم حرفي: Log4Shell كانت، في جوهرها، إعدادًا غير آمن.', en: 'The section says it outright: Log4Shell was, at heart, an insecure default.' },
        { ar: 'المكتبة لم تسرق مفاتيح (فإدارة الأسرار لا علاقة) ولم يتعلق الأمر بصلاحياتها (فأقل الامتيازات لا يغلق تفسير الصياغة).', en: 'The library stole no keys (so secrets management is unrelated) and the issue was not its permissions (so least privilege does not close syntax interpretation).' },
        { ar: 'المبدأ الختامي: كل ضابط ينبغي تذكّره سيُنسى يومًا ما — وكل ضابط آلي كالإعدادة الآمنة يصمد حتى يوم الإطلاق المتعب.', en: 'The closing principle: every control that must be remembered will eventually be forgotten — every automatic one, like a safe default, holds even on a tired launch day.' },
        { ar: 'الجواب: b — الافتراضي هو ما ينالها من لا يفعل شيئًا، فاجعله الآمن.', en: 'Answer: b — the default is what you get by doing nothing, so make it the safe one.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-hmac',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'المقارنة الآمنة زمنيًا التي استعملناها بدل == عند مطابقة البصمات في الدرس الأول تأتي من وحدة المكتبة القياسية المسماة ____. (اسم إنجليزي واحد)',
        en: 'The timing-safe comparison we used instead of == when matching digests in lesson one comes from the standard-library module named ____. (one English name)',
      },
      answer: 'hmac',
      solution: 'hmac',
      hints: [
        { ar: 'الوحدة تحمل اسم تقنية التواقيع التي تخلط مفتاحًا سرًّا بالبصمة — وهي التي وقّعت قطعتك الأثرية في الدرس الثالث أيضًا.', en: 'The module is named after the signing technique that mixes a secret key into a digest — the same one that signed your artifact in lesson three.' },
        { ar: 'الدالة بالتحديد: compare_digest — تقارن بايتًا ببايت بزمن لا يعتمد على طول السابقة المشتركة.', en: 'The specific function: compare_digest — it compares byte by byte with time independent of the shared prefix length.' },
        { ar: 'استدعيناها في الدرس الأول: hmac.compare_digest(attempt, stored) — وبالدرس الثالث للتحقق من توقيع القطعة.', en: 'We called it in lesson one: hmac.compare_digest(attempt, stored) — and in lesson three to verify the artifact signature.' },
        { ar: 'الجواب: hmac', en: 'Answer: hmac' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-leak',
      required: true,
      brokenCode: "import hashlib\n\nLEAKED = {\n    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',\n    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',\n}\n\ndef audit(accounts):\n    breached = 0\n    for name, pw in accounts:\n        attempt = hashlib.sha256(('pypath' + pw).encode('utf-8')).hexdigest()\n        if attempt in LEAKED:\n            breached = breached + 1\n    return breached\n\nprint('breached: %d' % audit([('grace', 'password'), ('ada', '123456')]))",
      prompt: {
        ar: 'شغّل الكود المعطوب ولاحظ التطمين الزائف المدوّي: grace تحمل password وada تحمل 123456 — كلمتان تعرفانهما سطرا قائمة التسريب حرفيًّا — ومع ذلك يطبع المدقّق breached: 0! لا استثناء ولا إنذار: حسابان مسرّبان يُعلنان نظيفين. السبب عكس درس الأول: هنا وُضع ملح pypath على جهة الفحص لا جهة المتجر — قائمة التسريب غير ملّحة بنيَت من sha256(كلمة) وحدها، فإدخال أي بادئة في حساب الفحص يجعل البصمتين من عالمين مختلفين لا يلتقيان أبدًا. الملح يعمل لصالح المتجر الملّح فقط. أزل البادئة واحسب sha256(pw) الخام فيصير التقرير breached: 2.',
        en: 'Run the broken code and hear the falsely reassuring verdict: grace carries password and ada carries 123456 — two passwords you know line the leak list verbatim — yet the auditor prints breached: 0! No exception, no alarm: two breached accounts declared clean. The cause is the mirror of lesson one: here a pypath salt was placed on the checking side, not the store side — the leak list is unsalted, built from sha256(password) alone, so injecting any prefix into the check-side hash puts the two digests in different worlds that never meet. A salt serves the salted store only. Drop the prefix and hash the raw sha256(pw), and the report becomes breached: 2.',
      },
      solution: "import hashlib\n\nLEAKED = {\n    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',\n    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',\n}\n\ndef audit(accounts):\n    breached = 0\n    for name, pw in accounts:\n        attempt = hashlib.sha256(pw.encode('utf-8')).hexdigest()\n        if attempt in LEAKED:\n            breached = breached + 1\n    return breached\n\nprint('breached: %d' % audit([('grace', 'password'), ('ada', '123456')]))",
      tests: [
        {
          id: 't1',
          name: { ar: 'التقرير يعلن الحسابين المسرَّبين', en: 'The report announces both breached accounts' },
          code: "assert 'breached: 2' in __learner_output__, 'expected: breached: 2 | actual: %r' % __learner_output__",
          expected: 'breached: 2',
        },
        {
          id: 't2',
          name: { ar: 'كلمة مسرَّبة واحدة تُحسب 1', en: 'A single leaked password counts as 1' },
          code: "assert audit([('grace', 'password')]) == 1, 'expected: 1 | actual: %r' % audit([('grace', 'password')])",
          expected: '1',
        },
        {
          id: 't3',
          name: { ar: 'كلمة نظيفة تبقى خارج الجردة', en: 'A clean password stays outside the sweep' },
          code: "assert audit([('ada', 'Qw7!vXm2Rp')]) == 0, 'expected: 0 | actual: %r' % audit([('ada', 'Qw7!vXm2Rp')])",
          expected: '0',
        },
      ],
      hints: [
        { ar: 'الكود يعمل بلا خطأ ويطبع تقريرًا مرتبًا — وهذا موطن الخطر: فشل صامت يطمئن. اسأل: بماذا بُنيت أسطر LEAKED بالضبط؟', en: 'The code runs without error and prints a tidy report — that is the danger: a silent failure that reassures. Ask: what exactly were the LEAKED rows built from?' },
        { ar: 'كل سطر في LEAKED هو sha256 لكلمة مرور خام وحدها. حاول يدويًّا: هل sha256(pypath + password) يظهر في القائمة أصلًا؟ لا — فلا فحص يطابق أبدًا.', en: 'Every LEAKED row is the sha256 of a raw password alone. Try by hand: does sha256(pypath + password) even appear in the list? No — so no check can ever match.' },
        { ar: 'الإصلاح سطر واحد: احسب attempt = hashlib.sha256(pw.encode(\u0027utf-8\u0027)).hexdigest() — بلا أي بادئة. الملح مكان صحيح هو المتجر الملّح، لا الفحص.', en: 'The fix is one line: compute attempt = hashlib.sha256(pw.encode(\u0027utf-8\u0027)).hexdigest() — with no prefix at all. The salt\u2019s right place is the salted store, not the check.' },
        { ar: 'بعد الإصلاح يطبع breached: 2 — grace وada تُعلنان مسرَّبتين، وكلمة نظيفة مثل Qw7!vXm2Rp تبقى خارج الجردة.', en: 'After the fix it prints breached: 2 — grace and ada are declared breached, and a clean password like Qw7!vXm2Rp stays outside the sweep.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import hashlib\nimport hmac\nimport secrets\n\nLEAKED = {\n    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',\n    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',\n    '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',\n    '1c8bfe8f801d79745c4631d09fff36c82aa37fc4cce4fc946683d7b336b63032',\n}\n\ndef digest(pw):\n    return hashlib.sha256(pw.encode('utf-8')).hexdigest()\n\ndef breached(pw):\n    return digest(pw) in LEAKED\n\ndef weak(pw):\n    if len(pw) < 10:\n        return True\n    classes = 0\n    if any(c.islower() for c in pw):\n        classes = classes + 1\n    if any(c.isupper() for c in pw):\n        classes = classes + 1\n    if any(c.isdigit() for c in pw):\n        classes = classes + 1\n    if any(not c.isalnum() for c in pw):\n        classes = classes + 1\n    return classes < 3\n\nACCOUNTS = [\n    ('ada', 'Qw7!vXm2Rp'),\n    ('grace', 'password'),\n    ('linus', 'password'),\n    ('kay', 'Sunshine2026'),\n    ('alan', 'abc'),\n    ('betty', 'Tr0ub4dor&3x'),\n]\n\nseen = set()\nweak_n = 0\nreused_n = 0\nbreached_n = 0\nfor name, pw in ACCOUNTS:\n    if weak(pw):\n        weak_n = weak_n + 1\n    if pw in seen:\n        reused_n = reused_n + 1\n    seen.add(pw)\n    if breached(pw):\n        breached_n = breached_n + 1\nprint('weak: %d / reused: %d / breached: %d' % (weak_n, reused_n, breached_n))\n\nsalt = secrets.token_hex(8)\nsalted = hashlib.sha256((salt + 'Qw7!vXm2Rp').encode('utf-8')).hexdigest()\nprint('salted digest escapes the leak: %s' % (salted not in LEAKED))\n\n# جرّب: أضف حسابًا بكلمة مرور قوية جديدة وشاهد الأرقام الثلاثة\n# try: add an account with a new strong password and watch the three numbers\n# جرّب: اخترع كلمة تنجو من قاعدة الطول وتنكسر في الأصناف — والعكس\n# try: craft a password that passes the length rule but fails the classes rule — and the reverse\n# جرّب: قارن بصمة ada الملّحة بأي سطر في LEAKED — لماذا لا يوجد تطابق ممكن؟\n# try: compare ada's salted digest to any LEAKED row — why is a match impossible?",
      prompt: {
        ar: 'الملعب مشروعك كاملًا موصولًا: المدقّق الثلاثي يطبع تقريره، ثم سطر واحد يجسّد الفجوة كلها — كلمة قوية واحدة تُملَّح فتختفي من مدار أي قائمة تسريب. أضف حساباتك، اخترع كلمات تحدّي القاعدتين، وقارن الملّح بالتسريب يدويًّا. ثم اسأل: أي فئات الفصل خدم كل عدّاد؟ لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is your project fully wired: the three-way auditor prints its report, then one line dramatizes the whole asymmetry — a single strong password gets salted and vanishes from the orbit of any leak list. Add your own accounts, craft passwords that challenge both rules, and compare the salt against the leak by hand. Then ask: which chapter categories does each counter serve? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل العاشر: العدد المتوقع (3, 1, 2) حُسب يدويًّا من البيانات المثبتة قبل تشغيل أي كود. ما اسم الدور الذي لعله هذا الحساب في الاختبار؟',
            en: 'From chapter ten: the expected (3, 1, 2) was computed by hand from the fixed data before any code ran. What is the name of the role that computation played in testing?',
          },
          options: [
            { id: 'a', text: { ar: 'العوراكل — المصدر المستقل الذي يُحكم به على صحة المخرجات', en: 'The oracle — the independent source used to judge whether outputs are correct' } },
            { id: 'b', text: { ar: 'التغطية — نسبة المسارات التي لمسها الاختبار', en: 'Coverage — the share of paths the test touched' } },
            { id: 'c', text: { ar: 'MC/DC — معيار القرارات المتشعبة', en: 'MC/DC — the modified condition/decision criterion' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الأوراكل الصادق يجيب «ما الصحيح؟» مستقلًّا عن الكود تحت الاختبار — وحساب الأعداد يدويًّا من بيانات ثابتة هو بالضبط ذلك، وهو ما جعل كتلة التصحيح قادرة على فضح breached: 0. والتغطية وMC/DC يقيّمان الاختبار نفسه لا صحة المخرجات.',
            en: 'An honest oracle answers “what is correct?” independently of the code under test — computing the counts by hand from fixed data is exactly that, and it is what let the debug block expose breached: 0. Coverage and MC/DC assess the test itself, not output correctness.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل التاسع: منقّح ساكن يمشي شجرتك فيرى سطرًا فيه مفتاح API مكتوب حرفيًّا في المصدر. أي عادة من عادات بناء الأمن داخليًا يسكن انكسارها هذا؟',
            en: 'From chapter nine: a static linter walks your tree and sees a line with an API key hard-coded into the source. Which building-security-in habit does this break?',
          },
          options: [
            { id: 'a', text: { ar: 'إدارة الأسرار — المفتاح الملتزم في المصدر أو تاريخ git يُعدّ مسرَّبًا لحظة هبوطه', en: 'Secrets management — a key committed to source or git history is compromised the moment it lands' } },
            { id: 'b', text: { ar: 'التوافر — لأن المفتاح يبطئ البناء', en: 'Availability — because the key slows the build' } },
            { id: 'c', text: { ar: 'التثبيت pinning — لأن المفتاح يقفل إصدارًا', en: 'Pinning — because the key locks a version' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نص القسم: بيانات الاعتماد في مدير أسرار أو إعداد محقون، لا في المصدر أبدًا. وهذا حرفيًّا ما يطارده فحص الأسرار الساكن في خط أنابيب الفصل الرابع عشر — جسر بين الفصل التاسع والفصل الحادي عشر.',
            en: 'The section\u2019s wording: credentials belong in a secrets manager or injected configuration, never in source. That is literally what the secrets-scanning gate of chapter fourteen\u2019s pipeline hunts — a bridge between chapter nine and chapter eleven.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن PY4E الفصل التاسع: العضوية في القواميس والمجموعات تجيب في خطوة واحدة. في عدّاد إعادة الاستخدام، أي سطر يفحص هل رأينا هذه الكلمة من قبل؟',
            en: 'From PY4E chapter nine: membership in dicts and sets answers in one step. In the reuse counter, which line tests whether we have seen this password before?',
          },
          options: [
            { id: 'a', text: { ar: 'pw in seen — اختبار العضوية قبل الإضافة، فيُعدّ من الظهور الثاني', en: 'pw in seen — a membership test before the addition, so counting starts at the second appearance' } },
            { id: 'b', text: { ar: 'pw + seen — دمج يجمع الاثنين', en: 'pw + seen — a merge combining the two' } },
            { id: 'c', text: { ar: 'len(seen) — طول المجموعة يكشف التكرار', en: 'len(seen) — the set\u2019s length reveals the repeat' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الترتيب هو العقد: pw in seen أولًا ثم seen.add(pw) — الفحص قبل الإضافة يجعل الظهور الأول مرجعًا والتكرار هو ما يُعدّ. وlen يعدّ الكلمات الفريدة لا مرات التكرار، والجمع بمعامل + يرفع خطأ نوع.',
            en: 'The order is the contract: pw in seen first, then seen.add(pw) — testing before adding makes the first appearance the reference and only genuine repeats count. len counts unique words, not repeat events, and + between a str and a set raises a type error.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'مدقّق اليوم يمنع الكلمات الضعيفة والمكررة والمسرَّبة قبل أن تصير متجرًا. أي فئة من قائمة OWASP في الدرس الأول يخدم هذا مباشرة؟',
            en: 'Today\u2019s auditor blocks weak, reused and breached passwords before they ever become a store. Which OWASP category from lesson one does this directly serve?',
          },
          options: [
            { id: 'a', text: { ar: 'A05 الحقن — لأن الكلمات الضعيفة تُحقن في الاستعلامات', en: 'A05 Injection — because weak passwords get injected into queries' } },
            { id: 'b', text: { ar: 'A07 إخفاقات المصادقة — سياسة الكلمات والعتبات والقفل كلها دفاعات المصادقة', en: 'A07 Authentication Failures — password policy, thresholds and locks are all authentication defenses' } },
            { id: 'c', text: { ar: 'A03 فشل سلسلة التوريد — لأن القائمة واردة من الخارج', en: 'A03 Supply Chain Failures — because the list comes from outside' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'سياسة كلمات المرور هي خط الدفاع الأول لـ A07: الكلمة الضعيفة تخمين رخيص، والمكررة تحوّل تسريب خدمة واحدة إلى مفاتيح لكل خدمتا، والمسرَّبة معروفة في الجداول العامة أصلًا. ولذلك جمعها المدقّق في تقرير واحد.',
            en: 'A password policy is A07\u2019s first line: a weak password is cheap to guess, a reused one turns one service\u2019s breach into keys for the rest, and a breached one already sits in public tables. That is why the auditor gathers all three into one report.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'ومن الدرس الثالث وصلةً إلى مشروع اليوم: لماذا لا يمكن لقائمة تسريب غير ملّحة أن تطابق متجرًا مُلِّحًا بطريقة صحيحة مهما كانت قويته الحسابية؟',
            en: 'From lesson three, linking to today\u2019s project: why can an unsalted leak list never match a properly salted store, no matter how much computing power is thrown at it?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن كل سطر في المتجر يخلط ملحًا فريدًا لكل مستخدم فلا يحتوي sha256(كلمة) الخام إطلاقًا', en: 'Because every store row mixes a per-user unique salt, so the raw sha256(password) never appears in it' } },
            { id: 'b', text: { ar: 'لأن sha256 بطيء جدًّا على الحواسيب الحديثة', en: 'Because sha256 is too slow on modern hardware' } },
            { id: 'c', text: { ar: 'لأن قائمة التسريب مشفّرة بمفتاح لا نملكه', en: 'Because the leak list is encrypted with a key we lack' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'ليست مسألة قوة حسابية بل مسألة شكل: البصمة الملّحة ليست دالة للكلمة وحدها — هي دالة للملح والكلمة معًا، وكل مستخدم ملحه مختلف فلا نمط خام يطابق. لذلك أشكر المدقّق قائمة التسريب لأنها بُنيت خامًا، ولذلك تتهم شركاتها أصحاب المتاجر غير الملّحة.',
            en: 'It is not a matter of computing power but of shape: a salted digest is not a function of the password alone — it is a function of salt and password together, and every user\u2019s salt differs, so no raw pattern matches. That is why the auditor thanks the leak for being raw, and why unsalted stores are their owners\u2019 shame.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'ومن الفصل الثالث: تصنيف STRIDE للتهديدات. قائمة بصمات كلمات مرور ظهرت علنًا في الإنترنت — أي فئة من STRIDE تجسّدها؟',
            en: 'From chapter three: the STRIDE threat taxonomy. A list of password digests surfacing publicly online — which STRIDE category does it embody?',
          },
          options: [
            { id: 'a', text: { ar: 'رفع الصلاحيات Elevation of Privilege — لأن المهاجم يصير مديرًا', en: 'Elevation of Privilege — because the attacker becomes an admin' } },
            { id: 'b', text: { ar: 'كشف المعلومات Information Disclosure — بيانات سرية خرجت إلى غير المصرَّح لهم', en: 'Information Disclosure — confidential data reached unauthorized parties' } } ,
            { id: 'c', text: { ar: 'العبث Tampering — لأن البصمات عدّلت البيانات', en: 'Tampering — because the digests altered data' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التسريب ذاته كشفُ معلومات: جدول اعتماد وصل إلى جهات لا ينبغي له. وربط الفصل: هذا فشل سرية بامتياز — والمدقّق اليوم هو الاستجابة العملية: من كلماتك في الجدول؟ عدّها وأصلحها قبل أن يحوّلها المهاجم من كشفٍ إلى اختراق.',
            en: 'The leak itself is information disclosure: a credentials table reached parties who should never hold it. And the chapter\u2019s tie: this is a confidentiality failure in full dress — today\u2019s auditor is the practical response: which of your passwords is in the table? Count them and fix them before an adversary turns the disclosure into a compromise.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'تخزين كلمة المرور نصًّا أو بصمة خام بلا ملح — «المتجر داخلي ولا يراه أحد»',
          right: 'sha256(salt + password) بملح فريد لكل مستخدم، ومقارنة hmac.compare_digest، وقفل بعد عتبة إخفاقات',
          note: {
            ar: 'هذا كان مرض كتلة التصحيح في الدرس الأول بالاتجاهين: بلا ملح يُرفض الصحيح، وبملح في الجهة الخطأ — كما في كتلة اليوم — يُقبل الخطأ. القاعدة الهندسية: الملح يعيش في المتجر ويدخل كل حساب منها، أما قارنات التسريب فهي على الكلمة الخام لأن التسريب بُني خامًا.',
            en: 'This was lesson one\u2019s debug disease in both directions: without the salt the correct password is denied, and with a salt on the wrong side — as in today\u2019s block — the wrong one is accepted. The engineering rule: the salt lives in the store and enters every computation from it, while leak comparisons run on the raw password because the leak itself was built raw.',
          },
        },
        {
          wrong: 'سياسة من قاعدة واحدة: «ثمانية محارف تكفي» — أو مقارنة قائمة التسريب بالمتجر الملّح مباشرة',
          right: 'قاعدتان معًا: طول كافٍ + أصناف محارف، وفحص التسريب بكلمة المرور الخام عبر الجردة، ومنع إعادة الاستخدام',
          note: {
            ar: 'تتبع الأصناف في تمرين القراءة أظهر لماذا:abcdefghij طويلة وصنفها واحد — الطول وحده يفشل؛ وAbc1 أصنافها ثلاثة وقصرها — الأصناف وحدها تفشل. والسياسة بلا فحص تسريب تسمح بكلمة قوية نشرها تسريب عالمي أمس. الثلاثة معًا تقرير واحد لأنها ثلاثة وجوه لخطر واحد.',
            en: 'The trace exercise showed why: abcdefghij is long but single-class — length alone fails; Abc1 has three classes but is short — classes alone fail. And a policy without a breach check allows a strong password published in yesterday\u2019s global dump. All three belong in one report because they are three faces of one risk.',
          },
        },
        {
          wrong: 'إعادة استخدام كلمة مرور قوية واحدة عبر كل الخدمات — «قوية واحدة تكفي»',
          right: 'فريدة لكل خدمة: تسريب خدمة واحدة لا يجب أن يفتح الباقية — وفحص التسريب جزء من تسجيل أي حساب جديد',
          note: {
            ar: 'عدّاد reused في مشروعك هو القياس: تكرار واحد بين حسابين هو باب مزدوج. واحفظ درس سلسلة التوريد من الدرس الثالث بنفس القانون: كلمة مرور واحدة موزَّعة تعني أن أضعف خدمة تثق بها تحدد أمن كل خدماتك — وهي غالبًا خدمة لا تعرف أنك تعتمد عليها.',
            en: 'Your reused counter is the measurement: one repeat across two accounts is a double door. And keep lesson three\u2019s supply-chain lesson under the same law: one distributed password means the weakest service you trust sets the security of all your services — and it is often a service you did not know you depended on.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'مراجعة الثلاثة: الدرس الأول أعطى الإطار (CIA وتهديد/ثغرة/استغلال وOWASP كأشكال بايثون: ملح فريد ومقارنة آمنة زمنيًا وعتبات)، والثاني البحث (مراجعة بشرية + SAST/DAST/SCA + تغذية بقوائم ثابتة + وكلاء تحت قواعد ثلاث)، والثالث الحدود (بيان اعتماديات قرار ثقة، تثبيت، SBOM/SLSA/Sigstore، إعدادات آمنة وأقل امتياز).', en: 'The three-lesson recap: lesson one gave the frame (CIA, threat/vulnerability/exploit, OWASP as Python shapes: unique salt, timing-safe compare, thresholds); lesson two the hunt (human review + SAST/DAST/SCA + fuzzing over fixed lists + agents under three rules); lesson three the borders (the manifest as a trust decision, pinning, SBOM/SLSA/Sigstore, secure defaults and least privilege).' },
        { ar: 'المشروع: مدقّق كلمات المرور والسياسات على بيانات مثبتة — قائمة تسريب بأربع بصمات sha256 خام، وسياسة طول + أصناف، وعدّاد تكرار، وتقرير weak: 3 / reused: 1 / breached: 2. والعقدان الحاسمان: التسريب يُقارن بالكلمة الخام، والملح يحمي المتجر وحده — وكتلة التصحيح أظهرت ما يحدث حين يدخل الملح جهة الفحص: breached: 0 تطمينًا زائفًا.', en: 'The project: a password and policy auditor over fixed data — a leak of four raw sha256 digests, a length + classes policy, a reuse counter, and the report weak: 3 / reused: 1 / breached: 2. The two decisive contracts: the leak is compared against the raw password, and the salt guards the store alone — and the debug block showed what happens when the salt enters the check side: a falsely reassuring breached: 0.' },
        { ar: 'المُصحِّح شغّل حلّك في بيئة جديدة والتقط طبقاتك في __learner_output__ ثم قيّم أربعة اختبارات — نفس دلالات أعمال الاختبار الحقيقية من الفصل العاشر. الفصل التالي في المسار يفتح بابًا جديدًا؛ لكن عادات هذا الفصل — افترض الخصم، وسمِّ ما تحميه، وثبّت ما تثق به، واجعل الافتراضي آمنًا — تُحمل إلى كل سطر تكتبه بعده.', en: 'The grader ran your solution in a fresh environment, captured your prints into __learner_output__, then judged four tests — the same replay semantics as chapter ten\u2019s real harnesses. The next chapter in the track opens a new door; but this chapter\u2019s habits — assume the adversary, name what you protect, pin what you trust, make the default secure — carry into every line you write afterward.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وأضف ثلاثة حسابات من عندك: قوية فريدة، وقوية مكررة، وضعيفة فريدة — وتوقع أرقام التقرير قبل التشغيل ثم قارن. اسأل نفسك: أي عدّاد من الثلاثة كان سيكشف كلمة مرور أنت تستخدمها فعلًا اليوم؟ وما العادة الواحدة من هذا الفصل التي ستنقلها إلى مشروعك القادم أولًا؟',
        en: 'Open the sandbox and add three accounts of your own: strong and unique, strong but repeated, weak and unique — predict the report numbers before running, then compare. Ask yourself: which of the three counters would have exposed a password you actually use today? And which single habit from this chapter will you carry into your next project first?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch11.s6', pages: 'ص303-313 / pp.303-313' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch11.s6', pages: 'ص303-313 / pp.303-313' },
  ],
} satisfies Lesson;

export default lesson;
