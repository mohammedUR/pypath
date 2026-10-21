import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch15.l2 — "Refactoring Under Green Tests and Repository Stewardship
 * إعادة الهيكلة تحت اختبارات خضراء وحوكمة المستودع"
 * Aligned with SWE ch15 s3 (Refactoring Under Green Tests, pp.416-418) +
 * s4 (Repository Stewardship, p.418).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation (the guard-clause/constant snippets follow the book's
 * example shapes with original framing).
 * Runnable design: the l1 legacy fee function reused verbatim, refactored
 * (named constants, extracted helper, guard clause) while the SAME
 * characterization net stays green; the change shown with
 * difflib.unified_diff over before/after source strings. The debug block is a
 * refactor that silently slipped an operator — the net catches it.
 * Deterministic only: no input(), no exit(), no unittest.main in code.
 */
const lesson = {
  id: 'swe.ch15.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 15,
  title: { ar: 'إعادة الهيكلة تحت اختبارات خضراء وحوكمة المستودع', en: 'Refactoring Under Green Tests and Repository Stewardship' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch15.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الدرس الماضي بنى الشبكة: رصدتَ سلوك شيفرة عتيقة وثبّتَه في اختبارات توصيف خضراء. اليوم تأتي الغاية التي بُنيت لأجلها: المسّ. الفصل الثاني علّمك إعادة الهيكلة داخل حلقة red–green–refactor في شيفرة جديدة تحكمها مواصفة؛ وهنا ينقلب الوضع: الشبكة أولًا ثم الهيكلة — تحسين البنية دون تغيير السلوك، خطوةً صغيرةً اسمها معروف وميكانيكاها معروفة، والحزمة تعمل بعد كل خطوة. ومع الهيكلة يأتي عهد اليومي: حوكمة المستودع — قاعدة الكشافة — أن تترك الشيفرة أفضل قليلًا مما وجدتها، بحدود واضحة تمنع تحويل كل لمسة إلى مشروع. بنهاية الدرس ستكون قادرًا على: تمييز الهيكلة عن إعادة الكتابة، تنفيذ حركات مسماة تحت شبكة خضراء وقراءة الفرق بأداة diff، وممارسة الحوكمة الصادقة: التزام صغير، رسالة معبّرة، عيبٌ أكبر يُسجَّل لا يُهرَّب.',
        en: 'Last lesson built the net: you observed legacy behavior and pinned it in green characterization tests. Today comes the purpose it was built for: touching the code. Chapter two taught refactoring inside the red–green–refactor loop on fresh code governed by a spec; here the order flips: the net first, then the refactor — improving structure without changing behavior, in small steps with known names and known mechanics, running the suite after every step. And with refactoring comes the daily covenant: repository stewardship — the Boy Scout rule — leaving the code a little better than you found it, with clear limits that stop every touch from becoming a project. By the end you will be able to: tell refactoring apart from rewriting, execute named moves under a green net and read the change with a diff, and practice honest stewardship: small commit, meaningful message, bigger problems recorded rather than smuggled.',
      },
    },
    {
      kind: 'predict',
      code: "DEFAULT_EXAM_CODE = 'E10'\nFEE_CODES = {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}\n\ndef known_fee_code(visit_type):\n    return FEE_CODES.get(visit_type)\n\ndef legacy_fee_code(visit_type):\n    known = known_fee_code(visit_type)\n    if known is not None:\n        return known\n    return DEFAULT_EXAM_CODE\n\nprint(legacy_fee_code('lab'))\nprint(legacy_fee_code('phone'))",
      question: {
        ar: 'هذه دالة الدرس الماضي نفسها بعد إعادة هيكلة: ثابت مسمّى، قاموس مسمّى، دالة مساعدة مستخرجة، وحارس مبكر. قبل التشغيل: هل تغيّر السلوك؟ وماذا يطبع السطران لنفس المدخلين اللذين توقعتهما في الدرس الماضي؟',
        en: 'This is last lesson\u2019s very same function after refactoring: a named constant, a named dict, an extracted helper, and a guard clause. Before running: has the behavior changed? And what do the two lines print for the same two inputs you predicted last lesson?',
      },
      reveal: {
        ar: 'الطباعة: L20 ثم E10 — بالضبط كما توقعت في الدرس الماضي. غيّرتَ الأسماء، واستخرجتَ مساعدًا، وجعلتَ البديل حارسًا صريحًا؛ أما السلوك المرصود فلم يتحرك بميليمتر. هذا تعريف إعادة الهيكلة حرفًا: تحسين التصميم دون تغيير السلوك. والقاضي ليس عينك بل الشبكة: لو شغّلت حزمة التوصيف الخضراء من الدرس الماضي مقابل هذه النسخة لبقي السطر run: 3 failures: 0. متى خلطتَ تعديل سلوك مع الهيكلة انهذا الضمان — ولهذا يأتي كل تغيير في التزام مستقل.',
        en: 'It prints L20 then E10 — exactly as you predicted last lesson. You changed names, extracted a helper, made the fallback an explicit guard; the observed behavior did not move a millimeter. That is refactoring, literally: improving design without changing behavior. And the judge is not your eye but the net: had you run last lesson\u2019s green characterization suite against this version, the line would still read run: 3 failures: 0. Mix a behavior change into the refactor and that guarantee evaporates — which is why every change ships in its own commit.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الهيكلة تحت الشبكة: خطوات صغيرة وحركات مسماة', en: 'Refactoring under the net: small steps, named moves' },
      chunks: [
        {
          ar: 'إعادة الهيكلة تحسين تصميم الشيفرة القائمة دون تغيير سلوكها، محمية باختبارات خضراء. في الشيفرة العتيقة تبدأ الحلقة من الخلف: تبني الشبكة الخضراء حول السلوك القائم أولًا، ثم تتحرك في خطوات صغيرة إلى هذا الحدّ أن كل واحدة ظاهرٌ أنها تحفظ السلوك — إعادة تسمية، استخراج دالة، حشر متغير، نقل تابع — وتشغّل الحزمة بعد كل خطوة. احمرّ الشريط فآخر خطوة هي الجانية: تراجع عنها وخذ خطوة أصغر. والحركات المسماة (كتالوج فاولر هو المرجع) مهمة لأن لكل واحدة ميكانيكا معروفة وفخاخ معروفة؛ وسلسلة الحركات الآمنة تتراكب إلى تحويلٍ لا تجرؤ على محاولته قفزة واحدة.',
          en: 'Refactoring improves the design of existing code without changing its behavior, protected by green tests. On legacy code the loop starts from the back: build the green net around current behavior first, then move in steps so small that each one is obviously behavior-preserving — rename, extract a function, inline a variable, move a method — running the suite after every step. If the bar goes red, the last step is the culprit: undo it and take a smaller one. Named, cataloged moves (Fowler\u2019s catalog is the standard reference) matter because each has known mechanics and known traps; a sequence of safe moves composes into a transformation you would never dare attempt as one leap.',
        },
        {
          ar: 'أين توجّه الحركات؟ الروائح أعراض سطحية توحي — لا تثبت — بمشكلة تصميم أعمق: تابع طويل، صنف يفعل أشياء كثيرة، تكرار، أرقام سحرية مثل 65 بلا تفسير، شرطيات متداخلة عميقًا، قائمة معاملات طويلة. الرائحة دعوة لنظر أقرب لا حكمًا نهائيًا. ولوائح الدوال اختصارها SOFA: قصيرة، تفعل شيئًا واحدًا، معاملاتها قليلة، ومكتوبة عند مستوى تجريد واحد. وبعض الروائح تقاس: التعقيد الدوري يحصي مسارات القرار المستقلة في التابع فيحوّل «هذه الطريقة متشابكة» إلى رقم يراقبه الخط. وعتيقةٌ تضيف معضلة البيضة والدجاجة: أسوأ شيفرة لا تُختبر إلا بعد هيكلة ولا تُهيكل بأمان إلا باختبار — الحل: أصغر تغيير ممكِّن للاختبار (وسم أو معامل حول تبعية مبرمجة) ثم التقدم تحت الحماية.',
          en: 'Where do you aim the moves? Code smells are surface symptoms that suggest — not prove — a deeper design problem: a long method, a class doing too many things, duplication, magic numbers like an unexplained 65, deeply nested conditionals, a long parameter list. A smell is a prompt to look closer, not a verdict. For functions the compact checklist is SOFA: Short, doing One thing, Few arguments, a single level of Abstraction. Some smells are even measurable: cyclomatic complexity counts a function\u2019s independent decision paths, turning \u201cthis method feels tangled\u201d into a number a pipeline can watch. And legacy adds a chicken-and-egg problem: the worst code cannot be tested without refactoring nor safely refactored without tests — the fix is the smallest enabling change (a seam or parameter around a hard-wired dependency), then proceed under that protection.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'حوكمة المستودع: قاعدة الكشافة وحدودها', en: 'Repository stewardship: the Boy Scout rule and its limits' },
      chunks: [
        {
          ar: 'عادة «اترك المستودع أفضل مما وجدته» تُسمى قاعدة الكشافة. ولا تعني إتقان كل ملف تفتحه، ولا تهريب إعادة كتابة داخل تغيير عادي؛ بل مدّ المسؤولية من التذكرة المسندة إليك إلى حالة النظام المحيط. التحسينات الصغيرة تتراكم كما تتراكم الاختصارات الصغيرة: اسم أوضح يخفض كلفة القراءة القادمة، واختبار توصيف يحمي التعديل القادم، وحذف تعليق متقادم يمنع المهندس التالي من الثقة بشرح كاذب، وتبسيط فرع متشابك واحد يجعل عزل العيب القادم أسهل. لا شيء منها يحوّل النظام وحده؛ لكنها معتادة عبر الفريق والسنوات تحدد هل يصير المستودع أيسر تغييرًا أم أضيع.',
          en: 'The habit of leaving a repository better than you found it is called the Boy Scout rule. It does not mean perfecting every file you open, nor disguising a rewrite inside an ordinary change; it extends responsibility beyond the ticket you were handed to the condition of the surrounding system. Small improvements compound exactly as small shortcuts do: a clearer name lowers the next reading\u2019s cost, a characterization test protects the next modification, deleting a stale comment stops the next engineer from trusting a false explanation, simplifying one tangled branch makes the next defect easier to isolate. None transforms the system alone; repeated across a team and years, they decide whether the repository gets easier or harder to change.',
        },
        {
          ar: 'والضوابط نفسها التي يقوم عليها الفصل: افهم السلوك قبل تغييره، احمِه باختبارات، اعمل بخطوات صغيرة، واجعل كل تغيير متماسكًا بما يكفي ليُراجَع ويُرجَع. حسّن الشيفرة التي لديك أصلًا سبب للمسّ، وسجّل المشكلات الأكبر بدل التظاهر بأن تصلحها على الهامش — هذا مبدأ وقت المراجعة وقد تحوّل إلى عادة يومية: سلّم التغيير المطلوب واترك النظام أعدّ للتغيير القادم. وعلى مستوى الالتزامات: التزام صغير برسالة معبّرة، ونية واحدة لكل التزام — إما هيكلة وإما إصلاح — لأن سجل الالتزامات توثيق حي (من فصل Git) وعليه تقوم المراجعة والتراجع.',
          en: 'The guardrails are the chapter\u2019s own: understand the behavior before changing it, protect it with tests, work in small steps, and keep each change coherent enough to review and reverse. Improve the code you already have reason to touch; record larger problems instead of pretending to repair them on the side — the review-time principle turned daily habit: deliver the change you were asked for and leave the system better prepared for the next one. At the commit level: a small commit with a meaningful message, one intent per commit — either refactor or fix — because the commit history is living documentation (from the Git chapter) and review and rollback both stand on it.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'من قبل إلى بعد: هيكلة تحت الشبكة', en: 'Before and after: a refactor under the net' },
      code: "import difflib\nimport io\nimport unittest\n\nbefore_src = \"def legacy_fee_code(visit_type):\\n    # inherited: no docs, no tests\\n    return {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}.get(visit_type, 'E10')\\n\"\n\n# the net from l1 — same probes, same pinned values, untouched\ngolden = {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30', 'phone': 'E10', '': 'E10'}\n\n# refactor: named constants, extracted helper, guard clause — structure only\nDEFAULT_EXAM_CODE = 'E10'\nFEE_CODES = {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}\n\ndef known_fee_code(visit_type):\n    return FEE_CODES.get(visit_type)\n\ndef legacy_fee_code(visit_type):\n    known = known_fee_code(visit_type)\n    if known is not None:\n        return known\n    return DEFAULT_EXAM_CODE\n\nafter_src = \"DEFAULT_EXAM_CODE = 'E10'\\nFEE_CODES = {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}\\n\\ndef known_fee_code(visit_type):\\n    return FEE_CODES.get(visit_type)\\n\\ndef legacy_fee_code(visit_type):\\n    known = known_fee_code(visit_type)\\n    if known is not None:\\n        return known\\n    return DEFAULT_EXAM_CODE\\n\"\n\nclass Characterization(unittest.TestCase):\n    def test_known_codes(self):\n        for probe in ['exam', 'lab', 'vaccine']:\n            self.assertEqual(legacy_fee_code(probe), golden[probe])\n\n    def test_unknown_bills_as_exam(self):\n        self.assertEqual(legacy_fee_code('phone'), golden['phone'])\n\n    def test_empty_bills_as_exam(self):\n        self.assertEqual(legacy_fee_code(''), golden[''])\n\nresult = unittest.TextTestRunner(stream=io.StringIO()).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(Characterization))\nprint('run: %d failures: %d' % (result.testsRun, len(result.failures)))\n\ndiff = list(difflib.unified_diff(\n    before_src.splitlines(keepends=True),\n    after_src.splitlines(keepends=True),\n    fromfile='before.py', tofile='after.py'))\nchanged = 0\nfor line in diff:\n    if line.startswith('+') and not line.startswith('+++'):\n        changed = changed + 1\n    if line.startswith('-') and not line.startswith('---'):\n        changed = changed + 1\nfor line in diff:\n    print(line.rstrip())\nprint('changed lines: %d' % changed)",
      explanation: {
        ar: 'أربع حركات متتالية: النسخة القديمة محفوظة كسلسلة مصدر before_src دون تشغيلها؛ والحزمة نفسها من الدرس الماضي — القيم المثبتة نفسها والاختبارات الثلاثة نفسها — تُشغَّل مقابل النسخة المعاد هيكلتها فيطبع السطر run: 3 failures: 0؛ ثم difflib.unified_diff بين السلسلتين يطبع الترويسات وسطر hunk واحد @@ -1,2 +1,10 @@ وسطرين محذوفين وعشرة مضافة — لاحظ أن التعليق الموروث «inherited» زال لأن أصدق توثيق صار الاختبار؛ وأخيرًا عدّاد الأسطر المتبدلة يطبع changed lines: 12 — هو نفسه إحصاء git stat الذي ستراه في الالتزام. الحركة الواحدة: ثابت مسمّى + مساعد مستخرج + حارس مبكر، والسلوك كما هو.',
        en: 'Four moves in order: the old version kept as a before_src source string, never executed; the very suite from last lesson — same pinned values, same three tests — run against the refactored version, printing run: 3 failures: 0; difflib.unified_diff between the two strings printing the headers, one hunk @@ -1,2 +1,10 @@, two deleted lines and ten added — note the inherited comment is gone, because the most honest documentation is now the test; and finally the changed-line counter prints changed lines: 12 — the same number a git stat would show on the commit. One move: named constants + extracted helper + guard clause, behavior untouched.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-guards',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. هذه حركتا الحارسين المبكرين والثابت المسمّى من الدرس: ماذا يطبع كل نداء، ولماذا يصطدم 8 بالحدّ تمامًا؟',
        en: 'Read the code and predict its exact output — one line per print — without running it. These are the lesson\u2019s guard-clause and named-constant moves: what does each call print, and why does 8 collide exactly with the cap?',
      },
      code: "MAX_DAILY_BOOKINGS = 8\n\ndef can_book(booked_today):\n    return booked_today < MAX_DAILY_BOOKINGS\n\ndef booking_ok(patient, slot_open, booked_today):\n    if patient is None:\n        return False\n    if not slot_open:\n        return False\n    return can_book(booked_today)\n\nfor args in [(None, True, 7), ('lina', False, 2), ('sara', True, 8), ('omar', True, 7)]:\n    print(args[0], booking_ok(*args))",
      solution: 'None False\nlina False\nsara False\nomar True',
      answer: 'None False\nlina False\nsara False\nomar True',
      hints: [
        { ar: 'الحارس الأول: patient تساوي None فيرجع False فورًا قبل أي فحص آخر.', en: 'First guard: patient is None, so it returns False before any other check.' },
        { ar: 'الحارس الثاني يضرب مع lina: slot_open تساوي False فيرجع False رغم أن الحجز 2 دون الحدّ.', en: 'Second guard fires for lina: slot_open is False, so it returns False even though 2 bookings is under the cap.' },
        { ar: 'الثابت المسمّى MAX_DAILY_BOOKINGS يساوي 8 والشرط أقل من حصرًا: 8 < 8 خطأ فتُرفض sara؛ أما 7 فيمرّ.', en: 'The named constant MAX_DAILY_BOOKINGS is 8 and the comparison is strictly less-than: 8 < 8 is False so sara is refused; 7 passes.' },
        { ar: 'الخرج:\nNone False\nlina False\nsara False\nomar True', en: 'The output:\nNone False\nlina False\nsara False\nomar True' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.refactor-discount',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'هيكل legacy_discount التي وصفتها في الدرس الماضي — تحت شبكتها نفسها: حلّل الأرقام السحرية إلى ثوابت مسمّاة (RATE وBONUS_THRESHOLD وBONUS)، استخرج base_discount(total) للخصم الأساسي، واجعل شرط العلاوة حارسًا مبكرًا. ثم احفظ النسختين before_src وafter_src كسلسلتي مصدر، واطبع unified_diff بينهما بترويستي before.py وafter.py، وسطر changed lines: %d بعدّ أسطر + و- دون الترويسات، وسطر الحزمة run: %d failures: %d. لا تغيّر السلوك: 5→5 و100→90 و200→180 و201→166 و300→255.',
        en: 'Refactor last lesson\u2019s legacy_discount — under its very own net: resolve the magic numbers into named constants (RATE, BONUS_THRESHOLD, BONUS), extract base_discount(total) for the base discount, and turn the bonus condition into an early guard. Then keep both versions as before_src and after_src source strings, print the unified_diff between them with headers before.py and after.py, a changed lines: %d line counting + and - lines excluding the headers, and the suite line run: %d failures: %d. Change no behavior: 5\u21925, 100\u219290, 200\u2192180, 201\u2192166, 300\u2192255.',
      },
      starterCode: "import difflib\nimport io\nimport unittest\n\ndef legacy_discount(total):\n    # inherited: no docs, no tests\n    off = total * 10 // 100\n    if total > 200:\n        off = off + 15\n    return total - off\n\nprobes = [5, 100, 200, 201, 300]\ngolden = {}\nfor total in probes:\n    golden[total] = legacy_discount(total)\n\n# TODO: الهيكلة — ثوابت مسمّاة + base_discount مستخرجة + حارس مبكر (نفس السلوك)\n# TODO: the refactor — named constants + extracted base_discount + early guard (same behavior)\n\n# TODO: before_src و after_src كسلسلتي مصدر ثم unified_diff وعدّاد الأسطر\n# TODO: before_src and after_src as source strings, then the unified_diff and the line counter\n\n# TODO: شغّل حزمة المطابقة مقابل النسخة الجديدة واطبع run: %d failures: %d\n# TODO: run the matching suite against the new version and print run: %d failures: %d\n",
      solution: "import difflib\nimport io\nimport unittest\n\nbefore_src = \"def legacy_discount(total):\\n    # inherited: no docs, no tests\\n    off = total * 10 // 100\\n    if total > 200:\\n        off = off + 15\\n    return total - off\\n\"\n\nRATE = 10\nBONUS_THRESHOLD = 200\nBONUS = 15\n\ndef base_discount(total):\n    return total * RATE // 100\n\ndef legacy_discount(total):\n    if total > BONUS_THRESHOLD:\n        return total - base_discount(total) - BONUS\n    return total - base_discount(total)\n\nafter_src = \"RATE = 10\\nBONUS_THRESHOLD = 200\\nBONUS = 15\\n\\ndef base_discount(total):\\n    return total * RATE // 100\\n\\ndef legacy_discount(total):\\n    if total > BONUS_THRESHOLD:\\n        return total - base_discount(total) - BONUS\\n    return total - base_discount(total)\\n\"\n\nprobes = [5, 100, 200, 201, 300]\ngolden = {}\nfor total in probes:\n    golden[total] = legacy_discount(total)\n\nclass Characterization(unittest.TestCase):\n    def test_matches_pinned_net(self):\n        for total in probes:\n            self.assertEqual(legacy_discount(total), golden[total])\n\nresult = unittest.TextTestRunner(stream=io.StringIO()).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(Characterization))\nprint('run: %d failures: %d' % (result.testsRun, len(result.failures)))\n\ndiff = list(difflib.unified_diff(\n    before_src.splitlines(keepends=True),\n    after_src.splitlines(keepends=True),\n    fromfile='before.py', tofile='after.py'))\nfor line in diff:\n    print(line.rstrip())\nchanged = 0\nfor line in diff:\n    if line.startswith('+') and not line.startswith('+++'):\n        changed = changed + 1\n    if line.startswith('-') and not line.startswith('---'):\n        changed = changed + 1\nprint('changed lines: %d' % changed)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الأركان الخمسة باقية كما رُصدت', en: 'All five corners survive as observed' },
          code: "assert legacy_discount(5) == 5 and legacy_discount(100) == 90 and legacy_discount(200) == 180 and legacy_discount(201) == 166 and legacy_discount(300) == 255, 'expected: 5/90/180/166/255 | actual: %r' % ((legacy_discount(5), legacy_discount(100), legacy_discount(200), legacy_discount(201), legacy_discount(300)),)",
          expected: '5/90/180/166/255',
        },
        {
          id: 't2',
          name: { ar: 'الشبكة خضراء بلا فشل مخفي', en: 'The net is green with no hidden failures' },
          code: "assert 'failures: 0' in __learner_output__ and 'FAILED' not in __learner_output__, 'expected: failures: 0 and no FAILED | actual: %r' % __learner_output__",
          expected: 'failures: 0 and no FAILED',
        },
        {
          id: 't3',
          name: { ar: 'الفرق الموحّد وعدّاد الأسطر مطبوعان', en: 'The unified diff and line counter are printed' },
          code: "assert '--- before.py' in __learner_output__ and '+++ after.py' in __learner_output__ and 'changed lines:' in __learner_output__, 'expected: diff headers + changed lines count | actual: %r' % __learner_output__",
          expected: 'diff headers + changed lines count',
        },
        {
          id: 't4',
          name: { ar: 'الشبكة تغطي المدخلات الخمسة كلها', en: 'The net covers all five probes' },
          code: "assert len(golden) == 5 and 'run:' in __learner_output__, 'expected: 5 golden entries and a run line | actual: %r' % (__learner_output__ + ' | golden=' + str(len(golden)))",
          expected: '5 golden entries and a run line',
        },
      ],
      hints: [
        { ar: 'التحليل حرفي: off = total * 10 // 100 تصير total * RATE // 100 داخل base_discount؛ وشرط total > 200 يصير total > BONUS_THRESHOLD.', en: 'The resolution is literal: off = total * 10 // 100 becomes total * RATE // 100 inside base_discount; and total > 200 becomes total > BONUS_THRESHOLD.' },
        { ar: 'الهيكل:\nRATE = 10\nBONUS_THRESHOLD = 200\nBONUS = 15\n\ndef base_discount(total):\n    return total * RATE // 100\n\ndef legacy_discount(total):\n    if total > BONUS_THRESHOLD:\n        return total - base_discount(total) - BONUS\n    return total - base_discount(total)', en: 'The skeleton:\nRATE = 10\nBONUS_THRESHOLD = 200\nBONUS = 15\n\ndef base_discount(total):\n    return total * RATE // 100\n\ndef legacy_discount(total):\n    if total > BONUS_THRESHOLD:\n        return total - base_discount(total) - BONUS\n    return total - base_discount(total)' },
        { ar: 'العدّاد يسرد diff ويعدّ الأسطر التي تبدأ بـ + أو - باستثناء الترويسات +++ و---. في حل المرجع: 6 محذوفة و9 مضافة أي changed lines: 15.', en: 'The counter walks the diff and counts lines starting with + or - excluding the +++ and --- headers. In the reference: 6 deleted, 9 added, so changed lines: 15.' },
        { ar: 'لو سقط اختبار فلا تعِد الشبكة — راجع الحارس: العلاوة عند أكبر من 200 حصرًا كما كانت؛ فبقاؤها 180 عند 200 تحديدًا هو الدليل على أن الهيكلة صادقة.', en: 'If a test drops, do not touch the net — check the guard: the bonus stays strictly above 200; keeping 180 at exactly 200 is the proof the refactor is honest.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-red-bar',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بينما تعيد الهيكلة، نفّذتَ خطوتين من خمس خطوات مخططة وصار الشريط أحمر. ما الفعل الصحيح وفق الدرس؟',
        en: 'Mid-refactor, two steps into a planned five, the bar goes red. What is the correct move per the lesson?',
      },
      options: [
        { id: 'a', text: { ar: 'أكمل الخطوات الثلاث الباقية ثم أصلح ما انكسر دفعة واحدة', en: 'Finish the remaining three steps, then fix everything in one go' } },
        { id: 'b', text: { ar: 'تراجع عن آخر خطوة — هي الجانية — وخذ خطوة أصغر ظاهرة الحفاظ على السلوك', en: 'Undo the last step — it is the culprit — and take a smaller, obviously behavior-preserving one' } },
        { id: 'c', text: { ar: 'الشريط الأحمر طبيعي أثناء الهيكلة — تجاهله حتى تنتهي ثم أعد تشغيل الحزمة', en: 'Red is normal mid-refactor — ignore it until done, then rerun the suite' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'قاعدة الخطوات الصغيرة: كل خطوة تُشغَّل الحزمة بعدها مباشرة، فموعد العطل معروف بالضبط.', en: 'The small-steps rule: the suite runs immediately after each step, so the breakage point is known precisely.' },
        { ar: 'خطّة الخمس خطوات ليست عقدًا: الخطوة التي أحمرت الشريط كانت أكبر من اللازم — قسّمها.', en: 'The five-step plan is not a contract: the step that reddened the bar was too big — split it.' },
        { ar: 'الدفع بالخطوات كله ثم الإصلاح دفعة واحدة يهدم بالضبط ما تمنحه الخطوات الصغيرة: تحديد العلة في ثوانٍ.', en: 'Pushing through all steps then fixing in one sweep destroys exactly what small steps buy you: pinpointing the cause in seconds.' },
        { ar: 'الجواب: b — تراجع عن آخر خطوة وخذ خطوة أصغر.', en: 'Answer: b — undo the last step and take a smaller one.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-complexity',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'مقياس التعقيد الدوري يحصي مسارات القرار المستقلة في التابع ويُحسب عدَد القرارات + 1. تابع مكتوب على نمط حراس الدرس: حارسان مبكران (if واحد لكل منهما بلا elif) وعائد نهائي واحد في الذيل. كم يبلغ تعقيده الدوري؟',
        en: 'Cyclomatic complexity counts a function\u2019s independent decision paths, computed as decisions + 1. A function written in the lesson\u2019s guard style has two early guards (one plain if each, no elif) and a single final return. What is its cyclomatic complexity?',
      },
      answer: '3',
      solution: '3',
      tolerance: 0,
      hints: [
        { ar: 'عدّ القرارات أولًا: كل if مستقل يضيف مسار قرار واحدًا.', en: 'Count the decisions first: each independent if adds one decision path.' },
        { ar: 'الحارسان إذًا يضيفان 2 — لا elif ولا شرط مركّب يزيد العدّ.', en: 'The two guards add 2 — no elif and no compound condition to increase the count.' },
        { ar: 'القاعدة: القرارات + 1 للسطر المستقيم الواحد الذي تسير عليه الشيفرة إن لم يصطدم بحارس.', en: 'The rule: decisions + 1 for the single straight path the code takes if it hits no guard.' },
        { ar: 'الجواب: 2 + 1 = 3', en: 'Answer: 2 + 1 = 3' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-slip',
      required: true,
      brokenCode: "import io\nimport unittest\n\nRATE = 10\nBONUS_THRESHOLD = 200\nBONUS = 15\n\ndef base_discount(total):\n    return total * RATE // 100\n\ndef legacy_discount(total):\n    if total >= BONUS_THRESHOLD:  # the refactor slipped: >= crept in where legacy had >\n        return total - base_discount(total) - BONUS\n    return total - base_discount(total)\n\ngolden = {5: 5, 100: 90, 200: 180, 201: 166, 300: 255}\n\nclass Characterization(unittest.TestCase):\n    def test_small_totals(self):\n        self.assertEqual(legacy_discount(5), golden[5])\n        self.assertEqual(legacy_discount(100), golden[100])\n\n    def test_bonus_edge(self):\n        self.assertEqual(legacy_discount(200), golden[200])\n\n    def test_above_threshold(self):\n        self.assertEqual(legacy_discount(201), golden[201])\n        self.assertEqual(legacy_discount(300), golden[300])\n\nresult = unittest.TextTestRunner(stream=io.StringIO()).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(Characterization))\nprint('run: %d failures: %d' % (result.testsRun, len(result.failures)))\nprint('probe: 200 -> %d' % legacy_discount(200))",
      prompt: {
        ar: 'هيكلة «نظيفة» أحمرت الشبكة: run: 3 failures: 1 واختبار test_bonus_edge يسقط برسالة AssertionError: 165 != 180، بينما يطبع الاستقصاء probe: 200 -> 165. الهيكلة لا تغيّر السلوك أصلًا — فأين انزلق التعديل؟ أصلاحٌ واحد يُعيد الشبكة خضراء ويُبقي البنية الجديدة كما هي.',
        en: 'A \u201cclean\u201d refactor reddened the net: run: 3 failures: 1 with test_bonus_edge failing on AssertionError: 165 != 180, while the probe prints probe: 200 -> 165. Refactoring never changes behavior — so where did the edit slip? One fix turns the net green and keeps the new structure intact.',
      },
      solution: "import io\nimport unittest\n\nRATE = 10\nBONUS_THRESHOLD = 200\nBONUS = 15\n\ndef base_discount(total):\n    return total * RATE // 100\n\ndef legacy_discount(total):\n    if total > BONUS_THRESHOLD:\n        return total - base_discount(total) - BONUS\n    return total - base_discount(total)\n\ngolden = {5: 5, 100: 90, 200: 180, 201: 166, 300: 255}\n\nclass Characterization(unittest.TestCase):\n    def test_small_totals(self):\n        self.assertEqual(legacy_discount(5), golden[5])\n        self.assertEqual(legacy_discount(100), golden[100])\n\n    def test_bonus_edge(self):\n        self.assertEqual(legacy_discount(200), golden[200])\n\n    def test_above_threshold(self):\n        self.assertEqual(legacy_discount(201), golden[201])\n        self.assertEqual(legacy_discount(300), golden[300])\n\nresult = unittest.TextTestRunner(stream=io.StringIO()).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(Characterization))\nprint('run: %d failures: %d' % (result.testsRun, len(result.failures)))\nprint('probe: 200 -> %d' % legacy_discount(200))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الشبكة عادت خضراء', en: 'The net is green again' },
          code: "assert 'run: 3 failures: 0' in __learner_output__, 'expected: run: 3 failures: 0 | actual: %r' % __learner_output__",
          expected: 'run: 3 failures: 0',
        },
        {
          id: 't2',
          name: { ar: 'الاستقصاء يظهر القيمة المثبّتة', en: 'The probe shows the pinned value' },
          code: "assert 'probe: 200 -> 180' in __learner_output__, 'expected: probe: 200 -> 180 | actual: %r' % __learner_output__",
          expected: 'probe: 200 -> 180',
        },
        {
          id: 't3',
          name: { ar: 'الأركان الخمسة كما رُصدت', en: 'All five corners as observed' },
          code: "assert legacy_discount(5) == 5 and legacy_discount(200) == 180 and legacy_discount(201) == 166 and legacy_discount(300) == 255, 'expected: 5/180/166/255 | actual: %r' % ((legacy_discount(5), legacy_discount(200), legacy_discount(201), legacy_discount(300)),)",
          expected: '5/180/166/255',
        },
        {
          id: 't4',
          name: { ar: 'البنية المعاد هيكلتها بقيت كما هي', en: 'The refactored structure survived' },
          code: "assert BONUS_THRESHOLD == 200 and callable(base_discount), 'expected: named constant + extracted helper intact | actual: %r' % ((BONUS_THRESHOLD, callable(base_discount)),)",
          expected: 'named constant + extracted helper intact',
        },
      ],
      hints: [
        { ar: 'اختبار واحد فقط يسقط من ثلاثة: test_small_totals وtest_above_threshold يمرَّان — فالخلل في ركن واحد تحديدًا، لا في البنية.', en: 'Only one of three tests drops: test_small_totals and test_above_threshold pass — the defect is in exactly one corner, not in the structure.' },
        { ar: 'قارن مع القيم المثبّتة: عند 200 كان السلوك العتيق 180 بلا علاوة، لأن الشرط الأصلي أكبر من 200 حصرًا.', en: 'Compare with the pinned values: at 200 the legacy behavior was 180 with no bonus, because the original condition was strictly above 200.' },
        { ar: 'الانزلاق في سطر واحد داخل الدالة المعاد هيكلتها: >= حيث كانت > — العلاوة تسلّلت إلى 200 نفسها فأعطت 165.', en: 'The slip is one line inside the refactored function: >= where it was > — the bonus leaked onto 200 itself, yielding 165.' },
        { ar: 'الإصلاح الكامل:\n    if total > BONUS_THRESHOLD:\n        return total - base_discount(total) - BONUS\n\nثم يطبع التقرير run: 3 failures: 0 وprobe: 200 -> 180.', en: "Full fix:\n    if total > BONUS_THRESHOLD:\n        return total - base_discount(total) - BONUS\n\nThen the report prints run: 3 failures: 0 and probe: 200 -> 180." },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "DEFAULT_EXAM_CODE = 'E10'\nFEE_CODES = {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}\n\ndef known_fee_code(visit_type):\n    return FEE_CODES.get(visit_type)\n\ndef legacy_fee_code(visit_type):\n    known = known_fee_code(visit_type)\n    if known is not None:\n        return known\n    return DEFAULT_EXAM_CODE\n\nimport difflib\n\nbefore_src = \"def legacy_fee_code(visit_type):\\n    return {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}.get(visit_type, 'E10')\\n\"\nafter_src = \"DEFAULT_EXAM_CODE = 'E10'\\nFEE_CODES = {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}\\n\\ndef known_fee_code(visit_type):\\n    return FEE_CODES.get(visit_type)\\n\\ndef legacy_fee_code(visit_type):\\n    known = known_fee_code(visit_type)\\n    if known is not None:\\n        return known\\n    return DEFAULT_EXAM_CODE\\n\"\n\nfor line in difflib.unified_diff(before_src.splitlines(), after_src.splitlines(), fromfile='before.py', tofile='after.py'):\n    print(line)\n\n# جرّب: أضف نوع زائر جديد 'x-ray' إلى FEE_CODES وقيمة X01 — أي أسطر يتغير فيها الـdiff؟\n# try: add a new visitor type 'x-ray' to FEE_CODES with X01 — which diff lines change?\n# جرّب: حوّل الحارس إلى تعليق if مركّب من سطر واحد — أي أسهل قراءةً عند مستوى تجريد واحد؟\n# try: collapse the guard into a one-line compound if — which one reads better at a single level of abstraction?\n# جرّب: غيّر اسم known_fee_code إلى lookup_code — الـdiff سيكشف حركة إعادة التسمية سطرًا سطرًا\n# try: rename known_fee_code to lookup_code — the diff will expose the rename move line by line",
      prompt: {
        ar: 'الملعب يحتضن النسخة المعاد هيكلتها مع مطبعة unified_diff حية. جرّب حركة واحدة صغيرة في كل مرة وراقب كيف يتضخم الـdiff أو يتقلص — هذا حرفيًا ما سيراه مراجعك في الالتزام. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox hosts the refactored version with a live unified_diff printer. Try one small move at a time and watch the diff grow or shrink — this is literally what your reviewer sees on the commit. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل العاشر: الحزمة الخضراء تحمي فقط ما تؤكده بصدق. أي الحزم التالية تجعل إعادة الهيكلة آمنة فعلًا؟',
            en: 'From chapter ten: a green suite protects only what it honestly asserts. Which suite makes refactoring genuinely safe?',
          },
          options: [
            { id: 'a', text: { ar: 'حزمة تؤكد السلوك المرصود عند مخرجات التابع — أوراكل صادق عند كل ركن', en: 'A suite asserting observed behavior at the function\u2019s outputs — an honest oracle at every corner' } },
            { id: 'b', text: { ar: 'الحزمة التي تنفّذ أكبر عدد من أسطر الشيفرة', en: 'The suite that executes the most source lines' } },
            { id: 'c', text: { ar: 'الحزمة الأطول عددًا من الاختبارات مهما كان ما تؤكده', en: 'The suite with the most tests, whatever they assert' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الهيكلة تحفظ السلوك الظاهر لا الأسطر المنفذة: أوراكل صادق عند المخرجات يمسك التغيير حيث يظهر، بينما اختبار يؤكد تفاصيل داخلية ينكسر مع كل حركة بريئة — وهذا موضوع كتلة التصحيح في الدرس الرابع.',
            en: 'A refactor preserves observable behavior, not executed lines: an honest oracle at the outputs grips change where it shows, while a test pinning internals breaks on every innocent move — the subject of lesson four\u2019s debug block.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن فصل Git: أي ممارسة التزامات تجعل إعادة الهيكلة قابلة للمراجعة والتراجع؟',
            en: 'From the Git chapter: which commit practice makes a refactor reviewable and revertible?',
          },
          options: [
            { id: 'a', text: { ar: 'التزام كبير واحد يجمع الهيكلة والإصلاح لتوفير الوقت', en: 'One big commit mixing refactor and fix to save time' } },
            { id: 'b', text: { ar: 'التزامات صغيرة برسائل معبّرة، نية واحدة لكل التزام', en: 'Small commits with meaningful messages, one intent per commit' } },
            { id: 'c', text: { ar: 'الالتزام دون رسائل لأن الفرق يتكلم عن نفسه', en: 'Committing without messages because the diff speaks for itself' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'سجل الالتزامات توثيق حي يبقى أقرب إلى الشيفرة: الالتزام الصغير المعبّر يجعل كل حركة مفهومة ومهندسًا يراجعها وتراجعًا يستهدف حركة واحدة — أما المزيج الكبير فيعمي المراجعة ويعطّل التراجع.',
            en: 'The commit history is living documentation staying closest to the code: a small, well-named commit makes each move understandable, reviewable in isolation, and revertible on its own — while a big blend blinds review and breaks rollback.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في قائمة SOFA لصحة الدوال، ماذا يعني الحرف A؟',
            en: 'In the SOFA checklist for function health, what does the A stand for?',
          },
          options: [
            { id: 'a', text: { ar: 'مكتوبة عند مستوى تجريد واحد', en: 'Written at a single level of abstraction' } },
            { id: 'b', text: { ar: 'تعيد قيمة في كل المسارات دائمًا', en: 'Always returns a value on every path' } },
            { id: 'c', text: { ar: 'تعتمد أنواعًا مجردة فقط في معاملاتها', en: 'Uses only abstract types in its parameters' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'SOFA: قصيرة Short، شيء واحد One thing، معاملات قليلة Few arguments، مستوى تجريد واحد Abstraction — الدالة تمزج حلقة منخفضة مع قرار عالي فتصبح رائحة تابع طويل وإن قصرت أسطرها.',
            en: 'SOFA: Short, One thing, Few arguments, single level of Abstraction — a function mixing a low-level loop with a high-level decision smells long-method even when its line count is small.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'أي التصرفات الثلاثة يقع ضمن روح قاعدة الكشافة لحوكمة المستودع؟',
            en: 'Which of the three behaviors falls within the spirit of the Boy Scout rule for repository stewardship?',
          },
          options: [
            { id: 'a', text: { ar: 'إتقان كل ملف تفتحه مهما بعد عن تذكرتك', en: 'Perfecting every file you open however far from your ticket' } },
            { id: 'b', text: { ar: 'تهريب إعادة كتابة كاملة داخل تغيير عادي صغير', en: 'Smuggling a full rewrite inside a small ordinary change' } },
            { id: 'c', text: { ar: 'تحسين الشيفرة التي تلمسها أصلًا، وتسجيل المشكلات الأكبر', en: 'Improving the code you already touch, and recording the bigger problems' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'القاعدة تمدّ المسؤولية خطوة لا ميلًا: حسّن ما لديك سبب للمسّ، وسجّل ما هو أكبر من اللمسة — لأن الهروب بالإصلاح الشامل داخل تذكرة عادية يقتل المراجعة ويخفي المخاطر بدل ظهورها في السجل.',
            en: 'The rule extends responsibility a step, not a mile: improve what you already touch, record what exceeds the touch — because smuggling a rewrite inside an ordinary ticket kills review and hides risk instead of logging it.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'الشيفرة قبيحة فسأعيد كتابتها من الصفر الآن وأنا على حالها',
          right: 'أعد الهيكلة: خطوة صغيرة ظاهرة الحفاظ على السلوك تحت الشبكة الخضراء — إعادة الكتابة الكاملة قرار من نوع آخر له درس مستقل',
          note: {
            ar: 'الهيكلة تُثبت قيمتها في اتجاه واحد: السلوك لا يتحرك بميليمتر والحزمة خضراء بعد كل خطوة. من قال «سأعيد الكتابة» فقد غيّر نوع القرار كله — مخاطر تكدّس في النهاية بدل توزعها — وسيتناولها الدرس الثالث بصيغة شجرة الخنزير.',
            en: 'Refactoring earns its keep in one direction: behavior does not move a millimeter and the suite is green after every step. Saying \u201cI will rewrite it\u201d changes the entire category of decision — risk concentrated at the end instead of spread out — the subject of lesson three\u2019s strangler-fig treatment.',
          },
        },
        {
          wrong: 'سأجمع الهيكلة والإصلاح في التزام واحد أسرع — الفرق واحد أصلًا',
          right: 'التزام واحد نية واحدة: إما هيكلة وإما إصلاح، كلٌّ في التزام مستقل يُراجع وحده',
          note: {
            ar: 'الالتزام المزدوج يعمي المراجعة: هل تغيّر السلوك قصدًا أم انزلق؟ لا سبيل للجواب من الفرق. والمثال أمامك في كتلة التصحيح: >= التي تسلّلت أثناء «هيكلة» كانت ستختفي في خلط كهذا بلا أثر — الشبكة وحدها فضحتها لأنها كانت في التزام نظيف.',
            en: 'A dual commit blinds review: did behavior change on purpose or by accident? The diff cannot answer. The debug block is your exhibit: the >= that slipped in during a \u201crefactor\u201d would vanish inside such a blend — only the net exposed it because the refactor shipped clean.',
          },
        },
        {
          wrong: 'الشريط أحمر أثناء الهيكلة — سأكمل الباقي ثم أصلح كل شيء معًا',
          right: 'توقف عند أول احمرار: تراجع عن آخر خطوة وخذ خطوة أصغر ظاهرة الحفاظ على السلوك',
          note: {
            ar: 'قيمة الخطوات الصغيرة أنها تحوّل «أين الخلل؟» من يوم تنقيب إلى ثوانٍ: الحزمة خضراء قبل الخطوة وحمراء بعدها فالجانية معروفة بالاسم. الدفع للأمام يكدّس الفواصل فوق بعضها حتى يفقد الـdiff معناه — وهذا مدخل مزيف لإعادة الكتابة الكاملة من الباب الخلفي.',
            en: 'Small steps turn \u201cwhere is the bug?\u201d from a day of digging into seconds: green before the step, red after, culprit known by name. Pushing on stacks break upon break until the diff loses meaning — a back door into a de facto big-bang rewrite.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'إعادة الهيكلة = تحسين البنية دون تحريك السلوك، تحت شبكة خضراء بُنيت أولًا: خطوات صغيرة ظاهرة الحفاظ على السلوك، حركات مسماة بميكانيكا وفخاخ معروفة، والحزمة بعد كل خطوة — أحمرّت فتراجع وأصغّر.', en: 'Refactoring = improving structure without moving behavior, under a green net built first: small obviously-preserving steps, named moves with known mechanics and traps, the suite after every step — red means undo and go smaller.' },
        { ar: 'الروائح توحي لا تحكم، وSOFA وقائمة حركات توجّه اليد: ثابت مسمّى بدل الرقم السحري، حارس مبكر بدل التداخل، استخراج بدل التابع الطويل — والتعقيد الدوري يحوّل الإحساس إلى رقم.', en: 'Smells suggest, they do not judge; SOFA and the move list aim the hand: a named constant for the magic number, a guard clause for the nesting, an extraction for the long method — and cyclomatic complexity turns feeling into a number.' },
        { ar: 'الحوكمة اليومية: اترك المستودع أفضل قليلًا مما وجدته — حسّن ما تلمسه، وسجّل الأكبر، والتزام صغير برسالة معبّرة ونية واحدة. قبل/بعد بـ difflib يريك التغيير كما يراه المراجع: changed lines: 12 فوق run: 3 failures: 0.', en: 'Daily stewardship: leave the repository a little better — improve what you touch, record the bigger, small commit, meaningful message, one intent. Before/after with difflib shows the change as your reviewer sees it: changed lines: 12 over run: 3 failures: 0.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب ونفّذ حركة واحدة وراقب الـdiff. اسأل نفسك: في آخر تذكرة أنجزتها — أي سطر كنت ستُعيد تسميته لو كانت الشبكة خضراء، وماذا سيطبع changed lines في التزامك الأول؟',
        en: 'Open the sandbox, make one move, watch the diff. Ask yourself: in your last ticket — which line would you have renamed with a green net in place, and what would changed lines print on your first commit?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch15.s3', pages: 'ص416-418 / pp.416-418' },
        { book: 'SWE', section: 'swe.ch15.s4', pages: 'ص418 / p.418' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch15.s3', pages: 'ص416-418 / pp.416-418' },
    { book: 'SWE', section: 'swe.ch15.s4', pages: 'ص418 / p.418' },
  ],
} satisfies Lesson;

export default lesson;
