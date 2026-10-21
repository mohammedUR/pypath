import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch11.l3 — "The Software Supply Chain and Building Security In
 * سلسلة توريد البرمجيات وبناء الأمن داخليًا"
 * Aligned with SWE ch11 s4 (The Software Supply Chain: A World of Weak Links,
 * pp.295-302) + s5 (Building Security In, pp.302-303).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: a dependency manifest checker — a pinned-versions dict vs a
 * FIXED advisory set — plus an HMAC-verified artifact checksum over base64
 * (hmac/base64/hashlib). Deterministic by construction: nothing interactive,
 * nothing unpredictable, no process spawning, no network access.
 */

const lesson = {
  id: 'swe.ch11.l3',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 11,
  title: { ar: 'سلسلة توريد البرمجيات وبناء الأمن داخليًا', en: 'The Software Supply Chain and Building Security In' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch11.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الدرسان الماضيان رسّخا الأمن داخل شيفرك أنت: ما تحميه بثلاثية CIA، وكيف تبحث عن ثغراتك بالمراجعة والمسح والتغذية. لكن الحقيقة المرّة أن معظم ما تشغّله ليس شيفرك أصلًا: تطبيق حديث يُجمَّع من مكوّنات مفتوحة كتبها غرباء، واختارتها أشخاص ليسوا من فريقك، وتتحدّث بجدول لا تملكه — والدرس يقول إن بيان الاعتماديات عند جذر مشروعك قرار ثقة لا قائمة راحة. اليوم نفتح النصف الثاني من الفصل: سلسلة التوريد بحجمها الصادم وحلقاتها الضعيفة ودرسين مأساويين — Log4Shell العرضي وخلفية xz المتعمَّدة — ثم صندوق الأدوات الحديث من التثبيت بالدبوس إلى قائمة المواد SBOM إلى بصمات HMAC، ثم عادات بناء الأمن داخليًا: أقل امتياز، والإعدادات الآمنة، ونمذجة التهديدات. وأخذك العملي: مدقّق بيان اعتماديات يقارن الدبابيس بمجموعة نصائح ثابتة، وتحقق من سلامة قطعة أثرية ببصمة HMAC. بنهاية الدرس ستكون قادرًا على: تثبيت الإصدارات وتبرير كل اعتمادية جديدة، وقراءة SBOM كجرد يردّ «هل لدينا Log4j؟»، والتحقق من سلامة أثر بـ hmac.compare_digest، وتطبيق أقل امتياز والافتراض الآمن في كودك.',
        en: 'The last two lessons rooted security inside your own code: what you protect with the CIA triad, and how to hunt your own vulnerabilities with review, scanning and fuzzing. The bitter truth is that most of what you run is not your code at all: a modern application is assembled from open-source components written by strangers, chosen by people who are not on your team, updated on a schedule you do not own — and the section calls the package manifest at the root of your project a trust decision, not a convenience. Today opens the second half of the chapter: the supply chain in its stark scale and weak links, two cautionary cases — accidental Log4Shell and deliberate xz — then the modern toolbox from exact pinning to the SBOM inventory to HMAC tags, then the habits of building security in: least privilege, secure defaults, threat modeling. Your hands-on anchor: a dependency manifest checker comparing pins against a fixed advisory set, plus HMAC-verified artifact integrity. By the end of this lesson you will be able to: pin versions and justify every new dependency, read an SBOM as the inventory that answers “do we even have Log4j?”, verify an artifact with hmac.compare_digest, and apply least privilege and secure defaults in your own code.',
      },
    },
    {
      kind: 'predict',
      code: "import base64\nimport hashlib\nimport hmac\n\ndef tag(payload):\n    return base64.b64encode(hmac.new(b'k9', payload, hashlib.sha256).digest()).decode('ascii')\n\nprint(tag(b'release-1') == tag(b'release-1'))\nprint(tag(b'release-1') == tag(b'release-2'))\nprint(len(tag(b'release-1')))",
      question: {
        ar: 'دالة تُنتج بصمة HMAC للحمولة مع مفتاح ثابت. أي السطور الثلاثة تثبت أن البصمة صالحة للتحقق من السلامة؟ ولماذا يفشل الاختبار بمجرد تغيير محرف واحد أو المفتاح؟',
        en: 'A function produces an HMAC tag for a payload under a fixed key. Which of the three lines proves the tag is fit for integrity verification? And why does the check fail the moment one byte — or the key — changes?',
      },
      reveal: {
        ar: 'الطباعة: True ثم False ثم 44. السطر الأول هو عقد السلامة كلّه: الحمولة نفسها مع المفتاح نفسه تعطي البصمة نفسها، فأي تغيير في الأثر يكسر التطابق؛ والسطر الثاني يكشف الحساسية: محرف واحد مختلف فيحمّل الأثر بصمة مختلفة كليًّا فيُرفض؛ والثالث يقول إن البصمة 44 محرف base64. هذا بالضبط ما سنبنيه اليوم: مفتاح سرّ يوقّع القطعة الأثرية، وhmac.compare_digest يتحقق — فتصير سلامة سلسلة التوريد سطرين لا فلسفة.',
        en: 'It prints True, then False, then 44. The first line is the entire integrity contract: the same payload with the same key yields the same tag, so any change to the artifact breaks the match; the second exposes the sensitivity: one different byte gives the artifact a completely different tag and it is rejected; the third says a tag is 44 base64 characters. This is exactly what we build today: a secret key signs the artifact and hmac.compare_digest verifies it — making supply-chain integrity two lines, not a philosophy.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'سلسلة التوريد: حجم المشكلة والحلقات الضعيفة', en: 'The supply chain: the scale problem and the weak links' },
      chunks: [
        {
          ar: 'أمر التثبيت الواحد — npm install أو pip install — لا يجلب الحزمة التي سمّيتها فقط بل كل ما تعتمد عليه وما يعتمد عليه، حتى شجرة يتفقّدها أحد. الأرقام صادمة: البرمجيات مفتوحة المصدر في 99% من التطبيقات، وتطبيق «مرحبًا بالعالم» في Rails يجرّ 966 حزمة، ومشروع React يججر 1213 — معظمها اعتماديات غير مباشرة لم يخترها أحد من الفريق. وتدقيق حديث يضع اليد على الجرح: 64% من مكوّنات الشيفرة النموذجية غير مباشرة، و93% تحوي مكوّنات بلا نشاط تطوير منذ سنتين، وبمعدل 581 ثغرة معلنة لكل قاعدة شيفرة. لذلك القراءة الجديدة: بيان الاعتماديات قرار ثقة لا راحة — ومعظم ما تشحنه شيفرة آخرون، وثغراتها ثغراتك. وحتى الترقيات التلقائية شِعة: نطاقات الإصدارات المتساهلة تقبل رقعة خبيثة لحظة نشرها — فالدفاعات قبل التقنية: ثبّت الإصدارات الدقيقة مع lockfile، وراجع طلبات تحديث الاعتماديات كأي تغيير، واعامل الاعتمادية الجديدة كقرار هندسي بنموذج تهديد مرفق.',
          en: 'One install command — npm install or pip install — pulls not just the package you named but everything it depends on, down a tree nobody inspects. The numbers: open source is in 99% of applications, a “hello-world” Rails app drags in 966 packages, a React project 1,213 — mostly transitive dependencies nobody chose. Audits confirm the wound: 64% of components in a typical codebase are transitive, 93% carry components dormant in two years, and the average codebase holds 581 known vulnerabilities. So the reframe: the manifest is a trust decision — most of what you ship is other people\u2019s code, and its vulnerabilities are yours. Even automatic updates are a vector: permissive ranges accept a malicious patch the moment it is published — so pin exact versions with a lockfile, review upgrade pull requests, and treat each new dependency as an engineering decision with a threat model attached.',
        },
        {
          ar: 'لماذا السلسلة مكشوفة؟ لأن الثقة فيها تمرّ عبر بشر، والبشر أضعف حلقة: دراسة npm وجدت أن اختراق نحو عشرين حساب مطوّر بارز كفيل بتسميم نصف منظومة npm كلها. وقولٌ يستحق الحفظ: المكوّنات المفتوحة «مجانية كأنها جرو» — حزمة مسؤولية متواصلة في الفحص والمراقبة والترقيع. ودراسة الحالة الأولى عطرة: Log4Shell في ديسمبر 2021، ثغرة بأعلى درجة ممكنة في مكتبة تسجيل شائعة لدرجة أنها تجلس — كاعتمادية غير مباشرة غالبًا — داخل جزء ضخم من برمجيات Java على الأرض؛ كانت الميزة سيئة الإعداد تفسّر صياغة خاصة داخل النصوص المُسجَّلة، فبمجرد تسجيل نص مُدسوس يُنفَّذ كود المهاجم بلا أي صلاحيات. والعبرة الحاسمة: لا يمكنك ترقيع اعتمادية لا تعرف أنك تملكها — وهذا حرفيًّا مبرر قائمة المواد SBOM التي تلت بعد قليل.',
          en: 'Why is the chain so exposed? Because trust in it flows through people, and people are the weakest link: a study of npm found that compromising about twenty high-profile developer accounts could poison roughly half the whole npm ecosystem. A phrase worth keeping: open-source components are “free as in puppy” — an ongoing responsibility to vet, monitor and patch. The first case study is infamous: Log4Shell, December 2021, a maximum-score vulnerability in a logging library so common that — usually as a transitive dependency — it sits inside a huge fraction of the Java software on earth; an insecure default made it interpret special lookup syntax inside logged strings, so getting one crafted string logged executed attacker code with no privileges. The decisive lesson: you cannot patch a dependency you do not know you have — which is literally the argument for the SBOM coming up.',
        },
        {
          ar: 'والدراسة الثانية معاكسة تمامًا: خلفية xz-utils في 2024 هجوم متعمَّد متصلب متعدد السنوات — شخصية مساهمة وهمية تربّت ببطء على ثقة مطوّر واحد منهك يحافظ على مكتبة تشتغل في كل توزيعة لينكس، ثم أصدرت إصدارات حملت بابًا خلفيًا متخفيًّا في بيانات اختبار مزيفة. من صادها؟ مهندس لاحظ أن دخول SSH أبطأ بنصف ثانية فأبى أن يتجاوز الأمر وتتبّع الشذوذ حتى الإفصاح العلني. اقرأ الحالتين زوجًا: Log4Shell ثغرة عرضية في اعتمادية شائعة — فشل تصميم؛ وxz باب خلفي مقصود عبر فشل ثقة وعمليات استهدف مطوّرًا وحيدًا — نفس نصف قطر الانفجار وسببان متعاكسان، ولذلك الدفاعات شقّان: ماسحات تصطاد الكود المعروف سيئًا، وضوابط تحدّ من كيفية منح الثقة أصلًا. وإطار التوثيق المستمر يوزّع ستة ضوابط C1–C6 على أيام: افحص قبل التبني، وتحكّم فيما تُدخله، وراقب في الإنتاج.',
          en: 'The second case is the exact opposite: the xz-utils backdoor of 2024 was a deliberate multi-year attack — a fake contributor persona slowly earned the trust of one burned-out maintainer keeping a library shipped in every Linux distribution, then released versions carrying a backdoor disguised as test data. Who caught it? An engineer who noticed SSH logins were half a second slower than they should be, refused to shrug it off, and traced the anomaly to public disclosure. Read them as a pair: Log4Shell is an accidental vulnerability in a ubiquitous dependency — a design failure; xz is a deliberate backdoor through a trust-and-process failure aimed at a solo maintainer — same blast radius, opposite root causes, so defenses run on both tracks: scanners that find known-bad code, and controls that constrain how you extend trust. Continuous verification spreads six controls C1–C6: vet before adoption, control ingestion, monitor production.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'صندوق أدوات سلسلة التوريد، ثم بناء الأمن داخليًا', en: 'The supply-chain toolbox, then building security in' },
      chunks: [
        {
          ar: 'أدوات مجانية كثيرة تنفّذ قطع الإطار، وكل أداة تجيب سؤالًا مختلفًا عن الأثر. مدى صحة المشروع الأصل؟ OpenSSF Scorecard يشغّل ثمانية عشر فحصًا آليًّا — مراجعة الكود، حماية الفروع، تثبيت الاعتماديات، توقيع الإصدارات — ويعطي أي مستودع علني درجة. ما المعروف خاطئ في اعتمادياتي؟ OWASP Dependency-Check يمسح قائمة الاعتماديات ضد قواعد الثغرات المعلنة ويعمل في خط الأنابيب. ما الذي في الأثر فعلًا؟ قائمة المواد البرمجية SBOM — جرد كامل لكل مكوّن في الإصدار بمعياريين سائدين: CycloneDX وSPDX — وهي ما يحوّل «هل لدينا Log4j أصلًا؟» من استحالة إلى استعلام قاعدة بيانات. كيف بُني الأثر؟ SLSA يدرّ مستويات سلامة البناء من L0 بلا ضمانات إلى L3 منصة بناء صلبة ضد التلاعب. ومن وقّعه؟ Sigstore يجعل التوقيع عمليًّا بمفاتيح مؤقتة مربوطة بهوية ويقيد كل حدث توقيع في سجل شفافية عمومي. الأربعة معًا نظام لا قائمة: ما فيه، ومن صنعه، وكيف بُني، وصحة مصدره.',
          en: 'Free tools implement pieces of the framework, each answering a different question. How healthy is the upstream project? OpenSSF Scorecard runs eighteen automated checks — code review, branch protection, pinned dependencies, signed releases — scoring any public repository. What is known wrong with my dependencies? OWASP Dependency-Check scans the manifest against published vulnerability databases in CI. What is inside the artifact? The software bill of materials, SBOM — a complete inventory of every component in a release under two standards, CycloneDX and SPDX — turns “do we even have Log4j?” from impossible into a database query. How was it built? SLSA grades build-integrity levels from L0 (no guarantees) to L3 (a hardened, tamper-resistant platform). Who produced it? Sigstore signs with keyless, identity-bound keys in an immutable transparency log. Together they are one system: what is in it, who made it, how it was built, how healthy the source.',
        },
        {
          ar: 'والمقطع الأخير من الفصل يجمع الخيط: الأمن يُقرَّر قبل ظهور المهاجم بزمن طويل، وقد تقنّن الصناعة ذلك في إطار SSDF من NIST — مفردات مشتركة للممارسات الآمنة تجعل الأمن شرط عقد لا «ممارسة اختيارية». وعادة قليلة تحمل معظم الثقل اليومي: الإعدادات الآمنة — اشحن مقفلًا حتى تكون الإعدادة الآمنة هي ما ينالها من لا يفعل شيئًا، وLog4Shell في جوهرها إعداد غير آمن؛ وأقل امتياز — كل مستخدم وخدمة ورمز يأخذ أدنى وصول يلزمه فلا يبلغ اختراق جزءٍ الكلّ؛ وإدارة الأسرار — بيانات الاعتماد في مدير أسرار لا في المصدر، والمفتاح الملتزم في تاريخ git يُعدّ مسرَّبًا لحظة هبوطه. ثم افترض أنك ستُهاجم فبِع الأدوات: بلا تسجيل قد لا تكشف الهجوم، وبلا تنبيه قد لا تردّ وهو جارٍ — والمعالجة السيئة للأخطاء فئة كاملة: منطق يفتح الباب عند الفشل، وانهيار على مدخل غريب، وآثار أخطاء مكشوفة للمستخدمين.',
          en: 'And the chapter\u2019s closing section pulls the thread: security is decided long before an attacker shows up, and industry codified it in NIST\u2019s SSDF — a shared vocabulary of practices that turns security into something a contract can require. A few habits carry most of the daily weight: secure defaults — ship locked down so the safe configuration is what you get by doing nothing, and Log4Shell was, at heart, an insecure default; least privilege — every user, service and token gets the least access it needs, so one compromise cannot reach the whole; secrets management — credentials in a secrets manager, never in source. Then assume attack anyway and instrument: without logging a team may not detect the attack; without alerting it may not respond mid-breach — and mishandled exceptional conditions are a category of their own: fail-open logic, crashes on odd input, stack traces shown to users.',
        },
        {
          ar: 'المبدأ الذي يختم الفصل يستحق أن يعلق فوق مكتبك: صمّم بحيث يكون المسار الافتراضي هو الآمن والمسار المميَّز هو الاستثناء. كل ضابط ينبغي تذكّره سيُنسى يومًا ما؛ وكل ضابط آلي — إعدادة آمنة، رمز محدود النطاق، بوابة في خط الأنابيب — يصمد حتى في اليوم الذي يتنقل فيه الجميع متعَبين وسرعة الإطلاق عالية. وهذا يعيدك إلى بداية الكتاب: نمذجة التهديدات عند المتطلبات هي أشجار الهجوم وSTRIDE التي رسمتها في الفصل الثالث، وسيناريوهات الجودة التي جعلت «آمن» قابلًا للقياس في الفصل السادس — الفصل الحادي عشر لا يستبدلها بل يمنحها الخصم: افترض أن أحدهم يدرس نظامك فعلًا، ثم اجعل الأمن هو الوضع الافتراضي الذي لا يحتاج ذاكرة.',
          en: 'The principle that closes the chapter deserves to hang over your desk: design so the default path is the secure one and the privileged path is the exception. Every control that must be remembered will eventually be forgotten; every control that is automatic — a safe default, a scoped token, a pipeline gate — holds even on the day everyone is tired and shipping fast. And that returns you to the start of the book: threat modeling at requirements is the attack trees and STRIDE you drew in chapter three, and quality-attribute scenarios are what made “secure” measurable in chapter six — chapter eleven does not replace them, it hands them an adversary: assume someone is actively studying your system, then make security the default state that needs no memory.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مدقّق بيان الاعتماديات وتحقق HMAC من القطعة الأثرية', en: 'A manifest checker and an HMAC artifact verification' },
      code: "import base64\nimport hashlib\nimport hmac\n\nMANIFEST = {\n    'log4j-core': '2.15.0',\n    'xz-utils': '5.6.1',\n    'requests': '2.31.0',\n}\nADVISORIES = {\n    'log4j-core': ['2.14.1', '2.15.0'],\n    'xz-utils': ['5.6.0', '5.6.1'],\n}\n\ndef audit(manifest, advisories):\n    hits = []\n    for pkg in sorted(manifest):\n        if manifest[pkg] in advisories.get(pkg, []):\n            hits.append(pkg)\n    return hits\n\ndef tag(key, payload):\n    return base64.b64encode(hmac.new(key, payload, hashlib.sha256).digest()).decode('ascii')\n\ndef verify(key, payload, expected):\n    return hmac.compare_digest(tag(key, payload), expected)\n\nPUBLISHED = tag(b'key-2026', b'pypath-bundle-2026')\nfor pkg in audit(MANIFEST, ADVISORIES):\n    print('vulnerable: %s' % pkg)\nif verify(b'key-2026', b'pypath-bundle-2026', PUBLISHED):\n    print('artifact: ok')\nelse:\n    print('artifact: tampered')\nif verify(b'key-2026', b'pypath-bundle-2027', PUBLISHED):\n    print('artifact: ok')\nelse:\n    print('artifact: tampered')",
      explanation: {
        ar: 'الشق الأول هو SCA مصغّر: MANIFEST بيان اعتماديات بدبابيس دقيقة، وADVISORIES مجموعة نصائح ثابتة لكل حزمة، وaudit يمشي الحزم مرتبةً ويجمع كل إصدار يقع في نصائحه — القيمة الافتراضية [] عبر get تجعل الحزمة بلا نصائح نظيفة لا موثوقة كذبًا. لاحظ النتائج: log4j-core بإصداره 2.15.0 وهو من الإصدارات المعطوبة، وxz-utils بـ 5.6.1 إصدار الخلفية — التقرير سطران يسمّيان الاثنين بالترتيب. والشق الثاني سلامة التوزيع: tag يوقّع الحمولة بمفتاح سرّ عبر HMAC-SHA256 ثم يرمّزها base64، وverify يعيد حساب التوقيع ويقارن بـ hmac.compare_digest — القطعة الأصلية تعيد ok، وقطعة قُدّم لها محرف واحد تُرفض tampered. تمارين اليوم تبني الشكلين على بيانات مثبتة.',
        en: 'The first half is a miniature SCA: MANIFEST is a dependency manifest with exact pins, ADVISORIES a fixed advisory set per package, and audit walks the packages sorted and collects each whose version falls in its advisories — the [] default via get keeps a package with no advisories clean rather than falsely trusted. Note the results: log4j-core at 2.15.0, one of the broken releases, and xz-utils at 5.6.1, the backdoored version — the report is two lines naming both in order. The second half is distribution integrity: tag signs the payload with a secret key via HMAC-SHA256 and base64-encodes it, verify recomputes the signature and compares with hmac.compare_digest — the original artifact returns ok, and an artifact changed by one byte is rejected as tampered. Today\u2019s exercises rebuild both shapes over fixed data.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.write-chain',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل دالة audit(manifest, advisories) حتى يعمل المدقّق: امشِ الحزم مرتبةً بـ sorted(manifest)، واجمع كل حزمة يقع إصدارها في قائمة نصائحها advisories.get(pkg, [])، وأعد القائمة بالترتيب نفسه. المتوقع من الطبقات: vulnerable: log4j-core ثم vulnerable: xz-utils ثم scanned: 4.',
        en: 'Complete audit(manifest, advisories) so the checker works: walk the packages sorted via sorted(manifest), collect every package whose version appears in its advisory list advisories.get(pkg, []), and return the list in the same order. Expected prints: vulnerable: log4j-core, then vulnerable: xz-utils, then scanned: 4.',
      },
      starterCode: "MANIFEST = {\n    'log4j-core': '2.15.0',\n    'xz-utils': '5.6.1',\n    'requests': '2.31.0',\n    'jinja2': '3.1.2',\n}\n\nADVISORIES = {\n    'log4j-core': ['2.14.1', '2.15.0'],\n    'xz-utils': ['5.6.0', '5.6.1'],\n}\n\ndef audit(manifest, advisories):\n    # 1) امشِ الحزم مرتبة: sorted(manifest)\n    #    walk the packages sorted: sorted(manifest)\n    # 2) اجمع كل حزمة إصدارها في نصائحها: manifest[pkg] in advisories.get(pkg, [])\n    #    collect each package whose version is in its advisories: manifest[pkg] in advisories.get(pkg, [])\n    # 3) أعد القائمة بالترتيب نفسه\n    #    return the list in the same order\n    return []\n\nfor pkg in audit(MANIFEST, ADVISORIES):\n    print('vulnerable: %s' % pkg)\nprint('scanned: %d' % len(MANIFEST))",
      solution: "MANIFEST = {\n    'log4j-core': '2.15.0',\n    'xz-utils': '5.6.1',\n    'requests': '2.31.0',\n    'jinja2': '3.1.2',\n}\n\nADVISORIES = {\n    'log4j-core': ['2.14.1', '2.15.0'],\n    'xz-utils': ['5.6.0', '5.6.1'],\n}\n\ndef audit(manifest, advisories):\n    hits = []\n    for pkg in sorted(manifest):\n        if manifest[pkg] in advisories.get(pkg, []):\n            hits.append(pkg)\n    return hits\n\nfor pkg in audit(MANIFEST, ADVISORIES):\n    print('vulnerable: %s' % pkg)\nprint('scanned: %d' % len(MANIFEST))",
      tests: [
        {
          id: 't1',
          name: { ar: 'المدقّق يسمّي الحزمتين المعطوبتين بالترتيب', en: 'The checker names both broken packages in order' },
          code: "assert audit(MANIFEST, ADVISORIES) == ['log4j-core', 'xz-utils'], 'expected: [log4j-core, xz-utils] | actual: %r' % audit(MANIFEST, ADVISORIES)",
          expected: "['log4j-core', 'xz-utils']",
        },
        {
          id: 't2',
          name: { ar: 'التقرير يطبع السطرين', en: 'The report prints both lines' },
          code: "assert 'vulnerable: log4j-core' in __learner_output__ and 'vulnerable: xz-utils' in __learner_output__, 'expected: both vulnerable lines | actual: %r' % __learner_output__",
          expected: 'vulnerable: log4j-core and vulnerable: xz-utils',
        },
        {
          id: 't3',
          name: { ar: 'حزمة بلا نصائح تبقى نظيفة', en: 'A package with no advisories stays clean' },
          code: "assert audit({'requests': '2.31.0'}, {}) == [], 'expected: [] | actual: %r' % audit({'requests': '2.31.0'}, {})",
          expected: '[]',
        },
        {
          id: 't4',
          name: { ar: 'التقرير يطبع عدد الحزم الممسوحة', en: 'The report prints the scanned count' },
          code: "assert 'scanned: 4' in __learner_output__, 'expected: scanned: 4 | actual: %r' % __learner_output__",
          expected: 'scanned: 4',
        },
      ],
      hints: [
        { ar: 'الحلقة على sorted(manifest) تعطيك المفاتيح مرتبة هجائيًّا — فالنتيجة قابلة للمقارنة بين تشغيلين لأن الترتيب لا يتغير.', en: 'Looping over sorted(manifest) gives you the keys in alphabetical order — the result becomes comparable across runs because the order never changes.' },
        { ar: 'استعمل get بقيمة افتراضية: advisories.get(pkg, []) — حزمة بلا سطر في قاعدة النصائح تُعدّ نظيفة، والمحاولة على القاموس مباشرة ترفع KeyError.', en: 'Use get with a default: advisories.get(pkg, []) — a package with no row in the advisory base counts as clean, while indexing the dict directly raises KeyError.' },
        { ar: 'الهيكل:\nhits = []\nfor pkg in sorted(manifest):\n    if manifest[pkg] in advisories.get(pkg, []):\n        hits.append(pkg)\nreturn hits', en: 'The skeleton:\nhits = []\nfor pkg in sorted(manifest):\n    if manifest[pkg] in advisories.get(pkg, []):\n        hits.append(pkg)\nreturn hits' },
        { ar: 'الحل الكامل يطبع vulnerable: log4j-core ثم vulnerable: xz-utils ثم scanned: 4 — الحزمتان المعطوبتان بالترتيب الهجائي، والحزمتان الأخريان نظيفتان.', en: 'The full solution prints vulnerable: log4j-core, then vulnerable: xz-utils, then scanned: 4 — the two broken packages in alphabetical order, the other two packages clean.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-hmac',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. تذكّر عقد السلامة من التنبؤ: البصمة تُعاد حسابها من (المفتاح، الحمولة) بالقيم نفسها.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Recall the integrity contract from the predict: the tag is recomputed over (key, payload) with the same values.',
      },
      code: "import base64\nimport hashlib\nimport hmac\n\ndef tag(key, payload):\n    return base64.b64encode(hmac.new(key, payload, hashlib.sha256).digest()).decode('ascii')\n\nt = tag(b'key-2026', b'bundle')\nprint('len: %d' % len(t))\nprint('same: %s' % hmac.compare_digest(t, tag(b'key-2026', b'bundle')))\nprint('key: %s' % hmac.compare_digest(t, tag(b'key-2027', b'bundle')))\nprint('bytes: %s' % hmac.compare_digest(t, tag(b'key-2026', b'bundlX')))",
      solution: 'len: 44\nsame: True\nkey: False\nbytes: False',
      answer: 'len: 44\nsame: True\nkey: False\nbytes: False',
      hints: [
        { ar: 'بصمة HMAC-SHA256 ثابتة الطول: 32 بايت تخمر إلى 44 محرف base64 أيًّا كانت الحمولة.', en: 'An HMAC-SHA256 tag has a fixed size: 32 bytes, which base64-encodes to 44 characters whatever the payload.' },
        { ar: 'المفتاح والحمولة نفسان في السطر الأول من المقارنات — العقد يَعِد بتطابق تام فsame تساوي True.', en: 'The first comparison uses the same key and payload — the contract promises an exact match, so same is True.' },
        { ar: 'تغيير المفتاح إلى key-2027 أو محرف واحد في الحمولة إلى bundlX يعطي بصمتين مختلفتين كليًّا — وكلاهما يساوي False. hmac.compare_digest لا ترحم: تطابق تام أو رفض.', en: 'Swapping the key to key-2027 or one byte of the payload to bundlX produces completely different tags — both compare as False. hmac.compare_digest shows no mercy: exact match or rejection.' },
        { ar: 'الخرج:\nlen: 44\nsame: True\nkey: False\nbytes: False', en: 'The output:\nlen: 44\nsame: True\nkey: False\nbytes: False' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-sbom',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ثغرة حرجة نُشرت اليوم لمكتبة لم تضفها أنت أبدًا — وصلت كاعتمادية غير مباشرة داخل شجرة لم يتفقّدها أحد. أي أداة كان أملها الأوفر في الإجابة خلال دقائق: هل لدينا هذه المكتبة، وأين، وبأي إصدار؟',
        en: 'A critical vulnerability is published today for a library you never added yourself — it arrived as a transitive dependency inside a tree nobody inspected. Which tool had the best chance of answering within minutes: do we have this library, where, and at which version?',
      },
      options: [
        { id: 'a', text: { ar: 'SAST — لأنه يقرأ شيفرة المصدر كاملة بحثًا عن الكود المعطوب', en: 'SAST — because it reads the full source hunting the broken code' } },
        { id: 'b', text: { ar: 'SBOM — جرد كامل لكل مكوّن في الإصدار، فتصير «هل لدينا Log4j؟» استعلامًا عن قاعدة بيانات', en: 'SBOM — a complete inventory of every component in a release, turning “do we even have Log4j?” into a database query' } },
        { id: 'c', text: { ar: 'DAST — لأنه يهاجم التطبيق العامل ويشاهد ما ينكسر', en: 'DAST — because it attacks the running app and watches what breaks' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل أولًا: ما السؤال؟ ليس «أين العيب في السلوك» بل «ما الذي داخل الأثر» — جرد لا تحليل.', en: 'Ask first: what is the question? Not “where is the behavioral defect” but “what is inside the artifact” — an inventory, not an analysis.' },
        { ar: 'SAST يقرأ شيفرة مشروعك وقد لا يصل إلى مصدر كل مكتبة تابعة، وDAST يهاجم الواجهات العاملة — ولا أحد منهما يجيب «أي إصدار من أين؟».', en: 'SAST reads your project\u2019s code and may never reach each dependency\u2019s source, and DAST attacks live interfaces — neither answers “which version, from where?”.' },
        { ar: 'عبارة القسم حرفية: قائمة المواد SBOM هي ما يحوّل «ترقيع اعتمادية لا تعرف أنك تملكها» من مستحيل إلى استعلام قاعدة بيانات — بمعياري CycloneDX وSPDX.', en: 'The section\u2019s phrasing is literal: the SBOM is what turns “patch the dependency you did not know you had” from impossible into a database query — under the CycloneDX and SPDX standards.' },
        { ar: 'الجواب: b — وهذه هي العبرة الحاسمة من Log4Shell: لا يمكنك ترقيع اعتمادية لا تعرف أنك تملكها.', en: 'Answer: b — and that is Log4Shell\u2019s decisive lesson: you cannot patch a dependency you do not know you have.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-pinning',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'تثبيت الإصدار الدقيق مع lockfile بحيث لا يقبل البناء تلقائيًّا أي رقعة أو إصدار ثانوي نُشر حديثًا — حتى لو كان هجومًا — يسمى ____ الإصدارات. (كلمة إنجليزية واحدة)',
        en: 'Fixing the exact version with a lockfile so the build does not automatically accept a freshly published patch or minor release — even a malicious one — is called version ____. (one English word)',
      },
      answer: 'pinning',
      solution: 'pinning',
      hints: [
        { ar: 'الاسم من صورة الفعل: تثبيت الشيء بدبوس بحركة لا تتغير مهما تحرك العالم حولها.', en: 'The name comes from the verb\u2019s image: fastening something with a pin so it does not move however the world moves.' },
        { ar: 'النطاقات المتساهلة تقبل «أي إصدار متوافق» — وهذا الباب الذي دخلت منه رقعة الهجوم لحظة نشرها: ترقيع الجمعة واختراق الاثنين.', en: 'Permissive ranges accept “any compatible release” — the very door a malicious patch walks through at publish time: patch on Friday, breach on Monday.' },
        { ar: 'أداة Scorecard تعدّ هذه الممارسة بالاسم ضمن فحوصها الثمانية عشر على مستودع المشروع الأصلي.', en: 'Scorecard counts this exact practice by name among its eighteen checks on the upstream repository.' },
        { ar: 'الجواب: pinning', en: 'Answer: pinning' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-pin',
      required: true,
      brokenCode: "PINS = {\n    'log4j-core': '2.15',\n}\n\ndef pin_ok(pkg, installed):\n    return installed.startswith(PINS[pkg])\n\nattempts = [('log4j-core', '2.15.0'), ('log4j-core', '2.15.1')]\nfor pkg, installed in attempts:\n    if pin_ok(pkg, installed):\n        print('%s: ok' % pkg)\n    else:\n        print('%s: blocked' % pkg)",
      prompt: {
        ar: 'شغّل الكود المعطوب ولاحظ الفضيحة: السطر الثاني يقبل log4j-core: ok للإصدار 2.15.1 — رقعة لم يراجعها أحد يمكن أن تحمل الهجوم (ترقيع الجمعة واختراق الاثنين!). لا استثناء ولا إنذار: البوابة المفتوحة صمتًا. السبب أن الدبوس مخزَّن كنطاق متساهل 2.15 وpin_ok تقيسه بـ startswith — فكل إصدار يبدأ بالبادئة نفسها يمرّ: 2.15.0 و2.15.1 و2.15.9 كلها «داخل النطاق». أصلح الدبوس إلى الإصدار الدقيق 2.15.0 وقارن المساواة التامة بـ == فيصير السطران log4j-core: ok ثم log4j-core: blocked.',
        en: 'Run the broken code and witness the scandal: the second line accepts log4j-core: ok for version 2.15.1 — an unreviewed patch that could carry the attack (patch on Friday, breach on Monday!). No exception, no alarm: a gate opened silently. The cause is that the pin is stored as a permissive range, 2.15, and pin_ok measures it with startswith — so every version sharing the prefix passes: 2.15.0, 2.15.1 and 2.15.9 are all “in range”. Fix the pin to the exact version 2.15.0 and compare with full equality ==, and the lines become log4j-core: ok then log4j-core: blocked.',
      },
      solution: "PINS = {\n    'log4j-core': '2.15.0',\n}\n\ndef pin_ok(pkg, installed):\n    return installed == PINS[pkg]\n\nattempts = [('log4j-core', '2.15.0'), ('log4j-core', '2.15.1')]\nfor pkg, installed in attempts:\n    if pin_ok(pkg, installed):\n        print('%s: ok' % pkg)\n    else:\n        print('%s: blocked' % pkg)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الإصدار المثبَّت بالضبط يمرّ البوابة', en: 'The exact pinned version passes the gate' },
          code: "assert 'log4j-core: ok' in __learner_output__, 'expected: log4j-core: ok | actual: %r' % __learner_output__",
          expected: 'log4j-core: ok',
        },
        {
          id: 't2',
          name: { ar: 'رقعة 2.15.1 تُحجب', en: 'The 2.15.1 patch is blocked' },
          code: "assert 'log4j-core: blocked' in __learner_output__, 'expected: log4j-core: blocked for 2.15.1 | actual: %r' % __learner_output__",
          expected: 'log4j-core: blocked for 2.15.1',
        },
        {
          id: 't3',
          name: { ar: 'العقد نفسه يعمل على الدالة مباشرة', en: 'The contract works on the function directly' },
          code: "assert pin_ok('log4j-core', '2.15.0') is True and pin_ok('log4j-core', '2.15.1') is False, 'expected: True/False | actual: %r' % ((pin_ok('log4j-core', '2.15.0'), pin_ok('log4j-core', '2.15.1')),)",
          expected: 'True for the exact pin, False for the patched version',
        },
      ],
      hints: [
        { ar: 'لا تمس حلقة الطباعة إطلاقًا — العيب في عقد الدبوس نفسه: ماذا يخزّن PINS وكيف يقيسه pin_ok؟', en: 'Do not touch the printing loop at all — the defect is in the pin contract itself: what does PINS store and how does pin_ok measure it?' },
        { ar: 'startswith تجيب سؤالًا مختلفًا: «هل يبدأ الإصدار بالبادئة؟» — والنطاق المتساهل يقبل 2.15.1 و2.15.9 معًا. الدبوس الحقيقي يجيب: هل الإصدار هو هذا بالضبط؟', en: 'startswith answers a different question: “does the version begin with the prefix?” — a permissive range accepts 2.15.1 and 2.15.9 alike. A real pin asks: is the version exactly this one?' },
        { ar: 'الإصلاح سطران: خزّن الدبوس كاملًا — PINS = {\u0027log4j-core\u0027: \u00272.15.0\u0027} — وقارن المساواة: return installed == PINS[pkg].', en: 'The fix is two lines: store the full pin — PINS = {\u0027log4j-core\u0027: \u00272.15.0\u0027} — and compare with equality: return installed == PINS[pkg].' },
        { ar: 'بعد الإصلاح يصير الخرج log4j-core: ok ثم log4j-core: blocked — الدبوس الدقيق يمرّ، والرقعة غير المراجَعة تُحجب.', en: 'After the fix the output becomes log4j-core: ok then log4j-core: blocked — the exact pin passes, the unreviewed patch is blocked.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "import base64\nimport hashlib\nimport hmac\n\nMANIFEST = {'log4j-core': '2.15.0', 'xz-utils': '5.6.1', 'requests': '2.31.0'}\nADVISORIES = {'log4j-core': ['2.14.1', '2.15.0'], 'xz-utils': ['5.6.0', '5.6.1']}\n\ndef audit(manifest, advisories):\n    hits = []\n    for pkg in sorted(manifest):\n        if manifest[pkg] in advisories.get(pkg, []):\n            hits.append(pkg)\n    return hits\n\ndef tag(key, payload):\n    return base64.b64encode(hmac.new(key, payload, hashlib.sha256).digest()).decode('ascii')\n\ndef verify(key, payload, expected):\n    return hmac.compare_digest(tag(key, payload), expected)\n\nPUBLISHED = tag(b'key-2026', b'pypath-bundle-2026')\nfor pkg in audit(MANIFEST, ADVISORIES):\n    print('vulnerable: %s' % pkg)\nprint('artifact: %s' % ('ok' if verify(b'key-2026', b'pypath-bundle-2026', PUBLISHED) else 'tampered'))\nprint('artifact: %s' % ('ok' if verify(b'key-2026', b'pypath-bundle-2027', PUBLISHED) else 'tampered'))\nprint('artifact: %s' % ('ok' if verify(b'key-2027', b'pypath-bundle-2026', PUBLISHED) else 'tampered'))\n\n# جرّب: ثبّت إصدارًا جديدًا في MANIFEST وشاهد التقرير يتغير\n# try: pin a new version into MANIFEST and watch the report change\n# جرّب: بدّل مفتاح التوقيع b'key-2026' في سطر التحقق الأول — القطعة السليمة تُرفض: لماذا؟\n# try: swap the signing key b'key-2026' in the first verification line — a healthy artifact gets rejected: why?\n# جرّب: أضف حزمة بلا نصائح إلى MANIFEST — هل يبقى التقرير صادقًا معها؟\n# try: add a package with no advisories to MANIFEST — does the report stay honest about it?",
      prompt: {
        ar: 'الملعب مدقّقك الكامل: نصف SCA يجيب أين النصائح، ونصف سلامة يجيب من وقّع الأثر وأي تغيير يكسر التوقيع. بدّل المفتاح وشاهد القطعة السليمة تُرفض — هذا بالضبط ما يجعل HMAC أصلًا لـ Sigstore وسجل الشفافية. ثم ثبّت إصدارات وأضف حزمًا وابنِ قاعدة نصائح عندك. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is your full checker: the SCA half answers where the advisories land, the integrity half answers who signed the artifact and which change breaks the signature. Swap the key and watch a healthy artifact get rejected — exactly what makes HMAC the seed of Sigstore-style signing and transparency logs. Then pin versions, add packages, and build an advisory set of your own. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الثالث في هذا الكتاب: رسمتَ أشجار هجوم ومرّرت قائمة STRIDE لتسأل ماذا يريد الخصم. أي نشاط من درس اليوم هو الوريث المباشر لتلك الأشجار عند مرحلة المتطلبات؟',
            en: 'From this book\u2019s chapter three: you drew attack trees and walked a STRIDE checklist to ask what the adversary wants. Which activity from today\u2019s lesson is the direct heir of those trees at the requirements stage?',
          },
          options: [
            { id: 'a', text: { ar: 'نمذجة التهديدات — تُمارَس عند المتطلبات قبل أي سطر كود، بجذر الفصل الثالث نفسه', en: 'Threat modeling — practiced at requirements before any code, rooted in the same chapter three' } },
            { id: 'b', text: { ar: 'فحص التغذية fuzzing — لأنه يهاجم النظام بمدخلات كثيرة', en: 'Fuzzing — because it attacks the system with many inputs' } },
            { id: 'c', text: { ar: 'قائمة المواد SBOM — لأنها تعدّ مكوّنات النظام', en: 'The SBOM — because it counts the system\u2019s components' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفصل يفتتح بالإشارة إلى أن أشجار الهجوم وSTRIDE كانت أمنًا من اليوم الأول، وأن نمذجة التهديدات عند المتطلبات أول خطوات الإزاحة يسارًا — قبل المراجعات الآمنة وفحوص الاعتماديات. والتغذية والجرد أدوات لاحقة لا تجيب سؤال «ماذا يريد الخصم؟».',
            en: 'The chapter opens by noting attack trees and STRIDE were security work from day one, and threat modeling at requirements is the first step of shifting left — before secure reviews and dependency checks. Fuzzing and inventory are later-stage tools that never answer “what does the adversary want?”.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل السادس: «النظام يجب أن يكون آمنًا» جملة غير قابلة للقياس حتى صيغت كسيناريو جودة. أي جزء من سيناريو «النظام يرفض كل طلب يقرأ سجل مريض ليس صاحبه خلال 50 مللي ثانية» هو مقياس الاستجابة؟',
            en: 'From chapter six: “the system shall be secure” is unmeasurable until written as a quality-attribute scenario. Which part of “the system rejects every request reading a patient record that is not the requester\u2019s, within 50 ms” is the response measure?',
          },
          options: [
            { id: 'a', text: { ar: '«النظام يرفض» — لأنه الفعل الأمني', en: '“The system rejects” — because it is the security action' } },
            { id: 'b', text: { ar: '«خلال 50 مللي ثانية» — الشرط القابل للقياس الذي يجعل الاختبار يحكم ناجحًا أو فاشلًا', en: '“Within 50 ms” — the measurable criterion that lets a test judge pass or fail' } },
            { id: 'c', text: { ar: '«سجل مريض» — لأنه البيانات المحمية', en: '“Patient record” — because it is the protected data' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'سيناريو الجودة يحتاج مُحفِّزًا وبيئة واستجابة ومعيار استجابة — والمقياس هو ما يجعل الفحص يحكم: هنا زمن 50 مللي ثانية مع شرط الرفض الكامل. وبدونه يعود «آمن» إلى أمنية لا عقّد.',
            en: 'A quality-attribute scenario needs a stimulus, environment, response and response measure — and the measure is what lets a check judge: here the 50 ms bound together with complete rejection. Without it “secure” sinks back into a wish, not a contract.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في خريطة الأدوات: أداة تجيب «كيف بُني هذا الأثر وهل قصته موثوقة؟» بمستويات L0–L3 تسمى:',
            en: 'In the tool map: the tool answering “how was this artifact built, and how trustworthy is its origin story?” with levels L0–L3 is called:',
          },
          options: [
            { id: 'a', text: { ar: 'SLSA — مستويات سلامة البناء من L0 بلا ضمانات إلى L3 منصة صلبة ضد التلاعب', en: 'SLSA — build-integrity levels from L0 (no guarantees) to L3 (a hardened, tamper-resistant platform)' } },
            { id: 'b', text: { ar: 'Sigstore — التوقيع بلا مفاتيح دائمة مع سجل شفافية', en: 'Sigstore — keyless signing with a transparency log' } },
            { id: 'c', text: { ar: 'SPDX — معيار جرد المكوّنات', en: 'SPDX — the component-inventory standard' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التوزيع الدقيق: SBOM بمعياريه CycloneDX وSPDX يجيب ما الذي داخل الأثر، وSLSA يجيب كيف بُني بمستويات L0–L3، وSigstore يجيب من وقّعه، وScorecard يجيب مدى صحة المشروع الأصلي. الأربعة نظام واحد لا بدائل.',
            en: 'The precise mapping: an SBOM via CycloneDX or SPDX answers what is inside the artifact, SLSA answers how it was built with levels L0–L3, Sigstore answers who signed it, and Scorecard answers how healthy the upstream project is. The four are one system, not alternatives.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'جذر كارثة Log4Shell كان ميزة تفسّر صياغة خاصة داخل النصوص المُسجَّلة وهي مفعّلة افتراضيًّا. أي عادة من عادات بناء الأمن داخليًا كانت ستغلق هذا الباب من التصميم؟',
            en: 'The root of Log4Shell was a feature, enabled by default, interpreting special lookup syntax inside logged strings. Which building-security-in habit would have closed that door at design time?',
          },
          options: [
            { id: 'a', text: { ar: 'الإعدادات الآمنة — اشحن مقفلًا حتى تكون الميزة الخطرة مطفأة افتراضيًّا ويشغّلها قرار صريح', en: 'Secure defaults — ship locked down so the dangerous feature is off by default and turns on only by explicit decision' } },
            { id: 'b', text: { ar: 'أقل امتياز — لأن المكتبة حصلت على صلاحيات زائدة', en: 'Least privilege — because the library held excess permissions' } },
            { id: 'c', text: { ar: 'إدارة الأسرار — لأن السجل كشف مفاتيح مخزّنة', en: 'Secrets management — because the log exposed stored keys' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'نص القسم حرفي: Log4Shell في جوهرها إعداد غير آمن. المبدأ يقول إن كل ضابط ينبغي تذكّره سيُنسى — فاجعل الافتراضي هو الآمن، والمسار المميَّز استثناءً يتطلب قرارًا صريحًا. والمكتبة لم تسرق مفاتيح ولم تطلب صلاحيات زائدة.',
            en: 'The section says it plainly: Log4Shell was, at heart, an insecure default. The principle: every control that must be remembered will be forgotten — so make the default safe and the privileged path an exception requiring an explicit decision. The library neither stole keys nor asked for excess permissions.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'بيان الاعتماديات قائمة راحة: npm install وينتهي الأمر — والترقيات التلقائية خدمة لا خطر',
          right: 'قرار ثقة بقرار هندسي: ثبّت الإصدارات الدقيقة مع lockfile، وراجع طلبات الترقية، وأرفق نموذج تهديد بكل اعتمادية جديدة',
          note: {
            ar: 'الدرس يعيد تأطير سطر التثبيت نفسه: نطاقات الإصدارات المتساهلة التي تتعلمها كممارسة جيدة هي أيضًا قناة هجوم تقبل الرقعة الخبيثة لحظة نشرها. والاعتمادية الجديدة قرار يُبرَّر: من يصونها، ومتى آخر نشاط، وما نصائحها المعلنة — قبل أن تكتب الأمر لا بعده.',
            en: 'The lesson reframes the install line itself: the permissive version ranges you learn as good practice are also an attack channel accepting a malicious patch the moment it is published. A new dependency is a decision to justify: who maintains it, when was the last activity, what its published advisories are — before you type the command, not after.',
          },
        },
        {
          wrong: 'الاعتماديات مجانية — «حزم مفتوحة لا تكلف شيئًا»',
          right: 'مجانية كأنها جرو: مسؤولية متواصلة في الفحص والمراقبة والترقيع — ومجتمع الصيانة جزء من الأمن لا خيرية عنه',
          note: {
            ar: 'عشرون حسابًا مخترقًا كفيلة بتسميم نصف npm، واعتمادية فردية منهكة كانت باب xz — فصحة الصيانة C3 من ضوابط اليوم صفر جزء من تقييم الخطر. وتربية الحساب المشترك: تكريم التراخيص وإبلاغ العلل وتمويل المشاريع التي تعتمد عليها كيف تحافظ على المكوّنات التي تعيش عليها أجورًا لا شكرًا.',
            en: 'Twenty compromised accounts could poison half of npm, and one burned-out maintainer was the door into xz — so maintainer health, control C3, is part of risk assessment. And the commons lesson: honoring licenses, reporting bugs, and funding projects you depend on are how you keep the components alive that your own software lives on.',
          },
        },
        {
          wrong: 'الأمن يُضاف لاحقًا: إعدادات مفتوحة افتراضيًّا، ورموز بصلاحيات زائدة، وأسرار في المصدر',
          right: 'افتراضي آمن + أقل امتياز + أسرار في مدير أسرار — والضوابط الآلية تصمد يوم تتعب الأيدي',
          note: {
            ar: 'ثلاث عادات تحمل معظم الثقل: اشحن مقفلًا، فأعطِ كل مستخدم وخدمة ورمز أدنى وصول يلزمه، فلا تلتزم مفتاحًا في تاريخ git أبدًا — لأن ما هبط في التاريخ مسرَّب. والمبدأ الختامي: كل ضابط ينبغي تذكّره سيُنسى يومًا ما؛ وكل ضابط آلي — إعدادة آمنة، رمز محدود، بوابة خط أنابيب — يصمد حتى في يوم الإطلاق المتعب.',
            en: 'Three habits carry most of the weight: ship locked down, give every user, service and token the least access it needs, and never commit a secret to git history — anything that lands there is compromised. And the closing principle: every control that must be remembered will eventually be forgotten; every automatic one — a safe default, a scoped token, a pipeline gate — holds even on a tired launch day.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'سلسلة التوريد هي المركز الفكري للفصل: تطبيق حديث تجميع من مكوّنات الغرباء — 64% من المكوّنات غير مباشرة — وبيان الاعتماديات قرار ثقة. حلقتا الضعف بشر: عشرون حسابًا تكفي لنصف npm، ومطوّر واحد منهك كان باب xz. وحالتان تسدّان الطرفين: Log4Shell ثغرة عرضية في اعتمادية شائعة، وxz هجوم متعمَّد عبر الثقة — لا يمكنك ترقيع اعتمادية لا تعرف أنك تملكها.', en: 'The supply chain is the chapter\u2019s intellectual center: a modern app is an assembly of strangers\u2019 components — 64% transitive — and the manifest is a trust decision. The weak links are human: twenty accounts suffice to poison half of npm, one burned-out maintainer was xz\u2019s door. Two cases bracket it: Log4Shell, an accidental vulnerability in a ubiquitous dependency, and xz, a deliberate trust attack — you cannot patch a dependency you do not know you have.' },
        { ar: 'صندوق الأدوات يجيب أسئلة عن الأثر: Scorecard صحة المصدر، وDependency-Check الثغرات المعلنة، وSBOM بمعياري CycloneDX وSPDX جرد ما داخل الأثر، وSLSA كيف بُني بمستويات L0–L3، وSigstore من وقّعه. والتثبيت الدقيق pinning يغلق باب الترقية التلقائية الخبيثة — ومدقّق اليوم أثبت بالكتلة التصحيحية أن startswith على دبوس جزئي يفتح البوابة صمتًا.', en: 'The toolbox answers questions about an artifact: Scorecard for source health, Dependency-Check for published vulnerabilities, an SBOM (CycloneDX, SPDX) for the inventory of what is inside, SLSA for how it was built across L0–L3, Sigstore for who signed it. Exact pinning closes the auto-update door — and today\u2019s debug block proved a startswith over a partial pin opens the gate silently.' },
        { ar: 'بناء الأمن داخليًا: إطار SSDF يجعل الأمن مفردات عقود لا ممارسة اختيارية — وعادات يومية ثلاث: إعدادات آمنة (Log4Shell إعداد غير آمن)، وأقل امتياز، وأسرار خارج المصدر؛ ثم افترض الهجوم وفعّل التسجيل والتنبيه وعالج الحالات الاستثنائية. وال HMAC الذي بنيته اليوم هو بذرة سلامة التوزيع: مفتاح يوقّع وcompare_digest يتحقق.', en: 'Building security in: the SSDF turns security into contract vocabulary, not an optional practice — and three daily habits: secure defaults (Log4Shell was one), least privilege, secrets outside source; then assume attack and instrument logging, alerting, and careful exceptional-condition handling. The HMAC you built today is the seed of distribution integrity: a key that signs and compare_digest that verifies.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وأضف حزمة بنسختها المسرَّبة ثم أصلح التقرير، وبدّل مفتاح التوقيع وشاهد القطعة السليمة تُرفض. اسأل نفسك: في مشروعك القادم — أي اعتمادية تظن أنها «مجانية» وأنت لا تعرف من يصونها؟ وأين ستفشل ثقتك أولًا: في مكوّن لم تفحصه أم في إعداد لم تقفله؟',
        en: 'Open the sandbox, add a package at its breached version and watch the report correct itself, then swap the signing key and watch a healthy artifact get rejected. Ask yourself: in your next project — which dependency do you treat as “free” while not knowing who maintains it? And where will your trust fail first: a component you never vetted, or a setting you never locked down?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch11.s4', pages: 'ص295-302 / pp.295-302' },
        { book: 'SWE', section: 'swe.ch11.s5', pages: 'ص302-303 / pp.302-303' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch11.s4', pages: 'ص295-302 / pp.295-302' },
    { book: 'SWE', section: 'swe.ch11.s5', pages: 'ص302-303 / pp.302-303' },
  ],
} satisfies Lesson;

export default lesson;
