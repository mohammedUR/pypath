import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch15.l4 — "Chapter 15 Review and Project: Legacy Revival Workshop
 * مراجعة الفصل 15 ومشروع: ورشة إحياء شيفرة عتيقة"
 * Aligned with SWE ch15 s7 (Conclusion, pp.419-420), recapping s1-s6.
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: review chunks recap l1-l3; the project hands the learner an
 * embedded legacy pricing module (source string + exec, in the spirit of l1's
 * legacy_fee_code) with its characterization cases: run the net green, write
 * the refactored module as a source string, keep the same cases green, print a
 * debt register line + a change count. The debug block pins an implementation
 * detail (a helper's old name) so an honest behavior-preserving refactor breaks
 * the suite — the tests expose the wrong kind of test.
 * Deterministic only: no input(), no exit(), no unittest.main in code.
 */
const lesson = {
  id: 'swe.ch15.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 15,
  title: { ar: 'مراجعة الفصل 15 ومشروع: ورشة إحياء شيفرة عتيقة', en: 'Chapter 15 Review and Project: Legacy Revival Workshop' },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch15.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أربعة دروس وسلسلة واحدة اكتملت: عرّفت العتيقة بأنها شيفرة تخاف تغييرها، بنيت شبكة التوصيف التي تجعل النظام العامل هو الأوراكل، أعدت الهيكلة خطوةً صغيرة تحت الشبكة الخضراء، ووزّعت الاقتصاد: دين يُقترض بعين مفتوحة ويُسدَّد حيث تُدفع فائدته، وترحيل شجرة الخنزير بدل رهان الكتابة الكاملة. اليوم تجمعها كلها في ورشة واحدة: وحدة تسعير عتيقة تصلك كسلسلة مصدر بلا وثائق ولا اختبارات — تشغّل شبكتها خضراء، تكتب النسخة المعاد هيكلتها، تبقي الاختبارات نفسها خضراء، وتطبع سطر دين وسطر إحصاء تغيير كمن يفتح طلب دمج حقيقي. ثم تنقلب الطاولة في كتلة التصحيح: حزمة صحيحة الظاهر تنكسر من هيكلة صادقة — لأنها تختبر النوع الخطأ من الأشياء.',
        en: 'Four lessons, one completed chain: you defined legacy as code you fear to change, built the characterization net that makes the running system the oracle, refactored in small steps under green tests, and distributed the economics: debt borrowed with open eyes and repaid where interest is paid, strangler-fig migration instead of the big-bang bet. Today you assemble all of it in one workshop: a legacy pricing module arrives as a source string with no docs and no tests — run its net green, write the refactored version, keep the very same tests green, and print a debt line and a change count like a real pull request. Then the tables turn in the debug block: a suite that looks correct breaks under an honest refactor — because it tests the wrong kind of thing.',
      },
    },
    {
      kind: 'predict',
      code: "ROUTES = {'/fees': 'new'}\n\ndef new_fee_code(visit_type):\n    return 'N-' + visit_type.upper()[:2]\n\ndef legacy_fee_code(visit_type):\n    return {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}.get(visit_type, 'E10')\n\ndef handle(visit_type):\n    if ROUTES.get('/fees') == 'new' and visit_type in ('exam', 'lab', 'vaccine'):\n        return new_fee_code(visit_type)\n    return legacy_fee_code(visit_type)\n\nprint(handle('exam'))\nprint(handle('phone'))\nprint(handle('vaccine'))",
      question: {
        ar: 'الوحدة الجديدة تملك حساب رسوم الزيارة لثلاثة أنواع معروفة فقط، والموجّه يحوّل حصتها إليها. ماذا يطبع السطور الثلاثة — وبالأخص ما مصير phone؟',
        en: 'The new module owns the fee calculation for only three known visit types, and the router sends that slice to it. What do the three lines print — and in particular, what becomes of phone?',
      },
      reveal: {
        ar: 'الطباعة: N-EX ثم E10 ثم N-VA. الأنواع الثلاثة المعروفة تذهب إلى التنفيذ الجديد المُتحقق منه، أما phone فلا تملكه الوحدة الجديدة — فيبقى على المسار العتيق وتفوتر E10 كما فعلت دائمًا منذ الدرس الأول. هذا هو عقد شجرة الخنزير في سطر: كل ما لم يُبنَ ولم يُتحقق منه بعدًا يبقى على الوحدة القديمة؛ النظام كله عامل في كل لحظة، وكل انتقال قدرة يتحقق من قنينة قبل أن يستقر.',
        en: 'It prints N-EX, then E10, then N-VA. The three known types go to the verified new implementation; phone is not owned by the new module — it stays on the legacy path and bills E10 exactly as it always has since lesson one. That is the strangler-fig contract in one line: whatever is not built and verified yet remains on the old module; the whole system works at every moment, and each capability handover clears its canary before it settles.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'خلاصة النصف الأول: الشبكة ثم الهيكلة', en: 'Recap, first half: the net, then the refactor' },
      chunks: [
        {
          ar: 'من الدرس الأول: العتيقة شيفرة بلا اختبارات — أو التي تخاف تغييرها — والعمر عرضيّ. اختبار التوصيف ينقلب الاستدلال: لا مواصفة موثوقة، فترصد ما تفعله الشيفرة فعلًا وتثبّته — تكتب متوقعًا خاطئًا، تشغّل، تقرأ الفعلية من رسالة الفشل، وتروّجها. الشبكة تُحيط بالأركان الغريبة: الأنواع المجهولة التي تفوتر كفحوصات، والسلسلة الفارغة — لأن مستخدمين وشيفرة أخرى قد يعتمدونها. وعند عيب واضح: سجّله ولا تصلحه في النفس؛ الالتزام الواحد إما يعيد هيكلة وإما يصلح.',
          en: 'From lesson one: legacy is code without tests — or code you fear to change — and age is incidental. The characterization test inverts inference: no trustworthy spec, so you observe what the code actually does and pin it — write a deliberately wrong expectation, run, read the actual from the failure message, promote it. The net surrounds the odd corners: unknown kinds billing as exams, the empty string — because users and other code may depend on them. And when a plain bug surfaces: record it, do not fix it in the same breath; one commit either refactors or fixes.',
        },
        {
          ar: 'ومن الدرس الثاني: الهيكلة تحسين البنية دون تحريك السلوك، تحت الشبكة الخضراء — خطوات صغيرة ظاهرة الحفاظ على السلوك (تسمية، استخراج، حارس مبكر)، والحزمة بعد كل خطوة، وأحمرّت فتراجع وأصغّر. الحركات المسماة لها ميكانيكا وفخاخ معروفة، والروائح توحي لا تحكم، وSOFA وعدّاد القرارات يحوّلان الإحساس إلى أرقام. والحوكمة: اترك المستودع أفضل قليلًا — حسّن ما تلمسه وسجّل الأكبر — والتزام صغير برسالة معبّرة ونية واحدة، قبل/بعد بـ difflib يريك التغيير كما يراه المراجع.',
          en: 'From lesson two: refactoring improves structure without moving behavior, under the green net — small obviously-preserving steps (rename, extract, guard clause), the suite after every step, and red means undo and go smaller. Named moves carry known mechanics and traps, smells suggest rather than judge, and SOFA plus a decision counter turn feeling into numbers. Stewardship: leave the repository a little better — improve what you touch, record the bigger — a small commit, meaningful message, one intent, with a before/after diff showing the change as your reviewer sees it.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'خلاصة النصف الثاني: الاقتصاد والترحيل', en: 'Recap, second half: economics and migration' },
      chunks: [
        {
          ar: 'من الدرس الثالث: الدين التقني أصل اليوم مقابل فائدة على كل تغيير قادم. المتعمَّد مقايضة معلنة تُتتبَّع وتُخدم؛ وغير المقصود فائدة اختصارات لم تعرف أنك أخذتها — فيتراكم صامتًا. الإدارة: سجل في قائمة الأعمال يُراجع كأي عمل، وسداد الأصل حيث تدفع الفائدة فعلًا — الشيفرة عالية الدوران التي تلمسها أسبوعيًا، لا الوحدة القبيحة المغلقة — وإعادة الهيكلة هي آلية السداد والخط يجعلها آمنة باستمرار.',
          en: 'From lesson three: technical debt is today\u2019s principal against interest on every future change. Deliberate debt is an announced, tracked trade; inadvertent debt is interest on shortcuts you never knew you took — compounding in silence. Management: a register in the backlog reviewed like any work, principal repaid where you actually pay interest — the high-churn code you touch weekly, not the sealed ugly module — with refactoring as the repayment mechanism and the pipeline making it safe continuously.',
        },
        {
          ar: 'وخلاصة الفصل في سلسلة عملية واحدة: احفظ السلوك الحالي باختبارات توصيف، أعد الهيكلة والاختبارات تبقى خضراء، عالج الدين المتعمَّد، واستعمل الاستبدال التدريجي حين تكون إعادة الكتابة مبررة — شجرة الخنزير: واجهة توجيه، قدرة قدرة، قنينة لكل شريحة، وكل ما لم يُنقل يبقى على الوحدة القديمة. وتحت ذلك كله عادة الحوكمة: أبقِ الشيفرة قابلة للتغيير — فاليقين الوحيد عن نظام ناجح أنه سيضطر للتغيير أطول مما يتوقع من بناه.',
          en: 'And the chapter\u2019s working sequence in one line: preserve current behavior with characterization tests, refactor while the tests stay green, address debt deliberately, and use incremental replacement when a rewrite is justified — the strangler fig: a routing facade, capability by capability, a canary per slice, everything unmigrated stays on the old module. Underneath it all runs the stewardship habit: keep the code changeable — because the one certainty about a successful system is that it will have to change for longer than anyone who built it expects.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'عرض الورشة: أربع خطوات على legacy_zone', en: 'Workshop demo: four steps on legacy_zone' },
      code: "import difflib\nimport io\nimport unittest\n\n# the inheritance: a source string, no docs, no tests\nLEGACY_SRC = '''def legacy_zone(zipcode):\n    # inherited: no docs, no tests\n    zones = {'10': 'A', '20': 'B', '30': 'C'}\n    return zones.get(zipcode[:2], 'C')\n'''\nlegacy_ns = {}\nexec(compile(LEGACY_SRC, 'legacy_zone.py', 'exec'), legacy_ns)\nlegacy_zone = legacy_ns['legacy_zone']\n\n# step 1 — run the net green: observe, pin\nprobes = ['10001', '20500', '30501', '9', '']\ngolden = {}\nfor probe in probes:\n    golden[probe] = legacy_zone(probe)\n\nclass Characterization(unittest.TestCase):\n    def test_matches_observation(self):\n        for probe in probes:\n            self.assertEqual(legacy_zone(probe), golden[probe])\n\nresult = unittest.TextTestRunner(stream=io.StringIO()).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(Characterization))\nprint('net: run: %d failures: %d' % (result.testsRun, len(result.failures)))\n\n# steps 2-3 — refactor under the net: named zones, guard clause, helper\nZONES = {'10': 'A', '20': 'B', '30': 'C'}\nDEFAULT_ZONE = 'C'\n\ndef zone_for_prefix(prefix):\n    return ZONES.get(prefix, DEFAULT_ZONE)\n\ndef legacy_zone(zipcode):\n    if len(zipcode) < 2:\n        return DEFAULT_ZONE\n    return zone_for_prefix(zipcode[:2])\n\nresult = unittest.TextTestRunner(stream=io.StringIO()).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(Characterization))\nprint('after: run: %d failures: %d' % (result.testsRun, len(result.failures)))\n\n# step 4 — report the change\nafter_src = '''ZONES = {'10': 'A', '20': 'B', '30': 'C'}\nDEFAULT_ZONE = 'C'\n\ndef zone_for_prefix(prefix):\n    return ZONES.get(prefix, DEFAULT_ZONE)\n\ndef legacy_zone(zipcode):\n    if len(zipcode) < 2:\n        return DEFAULT_ZONE\n    return zone_for_prefix(zipcode[:2])\n'''\ndiff = list(difflib.unified_diff(\n    LEGACY_SRC.splitlines(keepends=True), after_src.splitlines(keepends=True),\n    fromfile='legacy_zone.py', tofile='legacy_zone.py'))\nchanged = 0\nfor line in diff:\n    if line.startswith('+') and not line.startswith('+++'):\n        changed = changed + 1\n    if line.startswith('-') and not line.startswith('---'):\n        changed = changed + 1\nprint('changed lines: %d / probes: %d pinned: %d' % (changed, len(probes), len(probes)))",
      explanation: {
        ar: 'الورشة كاملة على الدالة العتيقة من الدرس الأول — legacy_zone التي كشفت كتلة التصحيح فيها الركن الغريب: الرمز القصير يفوتر C. الخطوة الأولى: الوحدة تصلك كسلسلة LEGACY_SRC وتُحمَّل بـ exec في مساحة أسماء معزولة — هذا حرفيًا ما يحدث حين تستلم ملفًا لا مواصفة؛ الشبكة ترصد الخمس أركان: A وB وC وC للقصير وC للفارغ وتطبع net: run: 1 failures: 0. الخطوتان الثانية والثالثة: الثوابت المسماة ZONES وDEFAULT_ZONE، ودالة zone_for_prefix المستخرجة، وحارس len < 2 — والشبكة نفسها تُعاد فتبقى خضراء: after: run: 1 failures: 0. الخطوة الرابعة: unified_diff بين السلسلتين وchanged lines: 12 / probes: 5 pinned: 5.',
        en: 'The whole workshop on lesson one\u2019s legacy function — the legacy_zone whose debug block exposed the odd corner: a short code bills as C. Step one: the module arrives as the LEGACY_SRC string and is loaded with exec into its own namespace — literally what happens when you receive a file, not a spec; the net observes five corners: A, B, C, C for the short code, C for the empty one, printing net: run: 1 failures: 0. Steps two and three: named constants ZONES and DEFAULT_ZONE, an extracted zone_for_prefix helper, a len < 2 guard — and the very same net reruns green: after: run: 1 failures: 0. Step four: the unified_diff between the two strings and changed lines: 12 / probes: 5 pinned: 5.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-pin',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. خلاصة الدرس الأول في ثمانية أسطر: ماذا يطبع العدّاد، وهل يظهر سطر FAILED؟',
        en: 'Read the code and predict its exact output — one line per print — without running it. Lesson one in eight lines: what does the counter print, and does any FAILED line appear?',
      },
      code: "golden = {'exam': 'E10', 'lab': 'L20', 'phone': 'E10'}\n\ndef legacy_fee_code(visit_type):\n    return {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}.get(visit_type, 'E10')\n\npinned = 0\nfor probe in sorted(golden):\n    if legacy_fee_code(probe) == golden[probe]:\n        pinned = pinned + 1\n    else:\n        print('FAILED', probe)\nprint('pinned: %d / %d' % (pinned, len(golden)))",
      solution: 'pinned: 3 / 3',
      answer: 'pinned: 3 / 3',
      hints: [
        { ar: 'sorted(golden) يرتب المفاتيح هجائيًا: exam ثم lab ثم phone.', en: 'sorted(golden) orders the keys alphabetically: exam, then lab, then phone.' },
        { ar: 'كل قيمة في golden رُصدت من الدالة نفسها في الأصل — فمطابقة الشبكة كاملة ولا سطر FAILED.', en: 'Every golden value was observed from the function itself originally — so the net matches fully and no FAILED line appears.' },
        { ar: 'حتى الركن الغريب phone = E10 مطابق — الشبكة تحرس السلوك بما فيه عيوبه.', en: 'Even the odd corner phone = E10 matches — the net guards behavior, quirks included.' },
        { ar: 'الخرج:\npinned: 3 / 3', en: 'The output:\npinned: 3 / 3' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.project-revival',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: ورشة إحياء وحدة تسعير عتيقة تصلك كسلسلة مصدر LEGACY_PRICING_SRC — بلا وثائق ولا اختبارات. الخطوات: (1) شغّل الشبكة على الوحدة الأصلية واطبع legacy: tests: 8 passed: 8؛ (2) اكتب في REFACTORED_PRICING_SRC وحدة معاد هيكلتها بنفس اسم الدالة price_quote — ثوابت مسمّاة بدل الأرقام السحرية (500 و25 و15 و5 و10 و20)، ودوال مساعدة مستخرجة، وحراس مبكرون — بنفس السلوك المرصود تمامًا؛ (3) أعد الشبكة نفسها على الوحدة المُحيَّاة واطبع after: tests: 8 passed: 8؛ (4) اطبع سطر سجل دين يبدأ بـ debt: ثم سطر الإحصاء بصيغة changed lines: %d / tests: 8 passed: 8. القيم المثبّتة: (5,100,True)→475 و(12,100,True)→995 و(3,60,False)→180 و(25,40,False)→875 و(2,250,False)→500 و(10,60,True)→545 و(1,50,False)→50 و(30,25,True)→613.',
        en: 'The project: revive a legacy pricing module that arrives as the source string LEGACY_PRICING_SRC — no docs, no tests. Steps: (1) run the net against the original and print legacy: tests: 8 passed: 8; (2) write into REFACTORED_PRICING_SRC a refactored module keeping the same function name price_quote — named constants instead of the magic numbers (500, 25, 15, 5, 10, 20), extracted helpers, early guards — with exactly the observed behavior; (3) rerun the same net on the revived module and print after: tests: 8 passed: 8; (4) print a debt register line starting with debt: and then the summary in the form changed lines: %d / tests: 8 passed: 8. Pinned values: (5,100,True)\u2192475, (12,100,True)\u2192995, (3,60,False)\u2192180, (25,40,False)\u2192875, (2,250,False)\u2192500, (10,60,True)\u2192545, (1,50,False)\u219250, (30,25,True)\u2192613.',
      },
      starterCode: "import difflib\n\nLEGACY_PRICING_SRC = '''def price_quote(quantity, unit_price, member):\n    # inherited: no docs, no tests\n    total = quantity * unit_price\n    if member:\n        if quantity > 10:\n            total = total - total * 15 // 100\n        else:\n            total = total - total * 5 // 100\n    else:\n        if quantity > 20:\n            total = total - total * 10 // 100\n    if total > 500:\n        total = total - 25\n    return total\n'''\n\npricing_ns = {}\nexec(compile(LEGACY_PRICING_SRC, 'legacy_pricing.py', 'exec'), pricing_ns)\nprice_quote = pricing_ns['price_quote']\n\nprobes = [(5, 100, True), (12, 100, True), (3, 60, False), (25, 40, False),\n          (2, 250, False), (10, 60, True), (1, 50, False), (30, 25, True)]\n\ngolden = {}\nfor q, p, m in probes:\n    golden[(q, p, m)] = price_quote(q, p, m)\n\ndef run_suite(impl):\n    passed = 0\n    for q, p, m in probes:\n        if impl(q, p, m) == golden[(q, p, m)]:\n            passed = passed + 1\n        else:\n            print('FAILED', (q, p, m), 'got', impl(q, p, m))\n    return passed\n\nprint('legacy: tests: %d passed: %d' % (len(probes), run_suite(price_quote)))\n\n# TODO: الخطوة 2 — اكتب في REFACTORED_PRICING_SRC الوحدة المعاد هيكلتها (نفس السلوك، بنية أوضح)\n# TODO: step 2 — write the refactored module into REFACTORED_PRICING_SRC (same behavior, clearer structure)\nREFACTORED_PRICING_SRC = '''def price_quote(quantity, unit_price, member):\n    # TODO: ثوابت مسمّاة + دوال مساعدة + حراس مبكرون\n    # TODO: named constants + extracted helpers + early guards\n    ...\n'''\n\nrevived_ns = {}\nexec(compile(REFACTORED_PRICING_SRC, 'price_quote.py', 'exec'), revived_ns)\n\n# TODO: الخطوة 3 — الشبكة نفسها على الوحدة المُحيَّاة: after: tests: %d passed: %d\n# TODO: step 3 — the same net on the revived module: after: tests: %d passed: %d\n\n# TODO: الخطوة 4 — سطر debt: وسطر changed lines: %d / tests: %d passed: %d\n# TODO: step 4 — a debt: line and the changed lines: %d / tests: %d passed: %d line\n",
      solution: "import difflib\n\nLEGACY_PRICING_SRC = '''def price_quote(quantity, unit_price, member):\n    # inherited: no docs, no tests\n    total = quantity * unit_price\n    if member:\n        if quantity > 10:\n            total = total - total * 15 // 100\n        else:\n            total = total - total * 5 // 100\n    else:\n        if quantity > 20:\n            total = total - total * 10 // 100\n    if total > 500:\n        total = total - 25\n    return total\n'''\n\npricing_ns = {}\nexec(compile(LEGACY_PRICING_SRC, 'legacy_pricing.py', 'exec'), pricing_ns)\nprice_quote = pricing_ns['price_quote']\n\nprobes = [(5, 100, True), (12, 100, True), (3, 60, False), (25, 40, False),\n          (2, 250, False), (10, 60, True), (1, 50, False), (30, 25, True)]\n\ngolden = {}\nfor q, p, m in probes:\n    golden[(q, p, m)] = price_quote(q, p, m)\n\ndef run_suite(impl):\n    passed = 0\n    for q, p, m in probes:\n        if impl(q, p, m) == golden[(q, p, m)]:\n            passed = passed + 1\n        else:\n            print('FAILED', (q, p, m), 'got', impl(q, p, m))\n    return passed\n\nprint('legacy: tests: %d passed: %d' % (len(probes), run_suite(price_quote)))\n\nREFACTORED_PRICING_SRC = '''REBATE_THRESHOLD = 500\nBULK_REBATE = 25\n\ndef member_discount_percent(quantity):\n    if quantity > 10:\n        return 15\n    return 5\n\ndef volume_discount_percent(quantity):\n    if quantity > 20:\n        return 10\n    return 0\n\ndef apply_bulk_rebate(total):\n    if total > REBATE_THRESHOLD:\n        return total - BULK_REBATE\n    return total\n\ndef price_quote(quantity, unit_price, member):\n    total = quantity * unit_price\n    if member:\n        percent = member_discount_percent(quantity)\n    else:\n        percent = volume_discount_percent(quantity)\n    total = total - total * percent // 100\n    return apply_bulk_rebate(total)\n'''\n\nrevived_ns = {}\nexec(compile(REFACTORED_PRICING_SRC, 'price_quote.py', 'exec'), revived_ns)\n\nprint('after: tests: %d passed: %d' % (len(probes), run_suite(revived_ns['price_quote'])))\n\nprint('debt: pricing magic numbers | principal: 3 dev-days | interest: 1/mo')\ndiff = list(difflib.unified_diff(\n    LEGACY_PRICING_SRC.splitlines(keepends=True),\n    REFACTORED_PRICING_SRC.splitlines(keepends=True),\n    fromfile='legacy_pricing.py', tofile='price_quote.py'))\nchanged = 0\nfor line in diff:\n    if line.startswith('+') and not line.startswith('+++'):\n        changed = changed + 1\n    if line.startswith('-') and not line.startswith('---'):\n        changed = changed + 1\nprint('changed lines: %d / tests: %d passed: %d' % (changed, len(probes), run_suite(revived_ns['price_quote'])))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الورشة خضراء من الطرفين', en: 'The workshop is green at both ends' },
          code: "assert ' / tests: 8 passed: 8' in __learner_output__ and 'FAILED' not in __learner_output__, 'expected: tests: 8 passed: 8 lines and no FAILED | actual: %r' % __learner_output__",
          expected: 'tests: 8 passed: 8 lines and no FAILED',
        },
        {
          id: 't2',
          name: { ar: 'الوحدة المُحيَّاة تطابق القيم المثبّتة', en: 'The revived module matches the pinned values' },
          code: "assert revived_ns['price_quote'](2, 250, False) == 500 and revived_ns['price_quote'](12, 100, True) == 995 and revived_ns['price_quote'](30, 25, True) == 613 and revived_ns['price_quote'](5, 100, True) == 475, 'expected: 500/995/613/475 | actual: %r' % ((revived_ns['price_quote'](2, 250, False), revived_ns['price_quote'](12, 100, True), revived_ns['price_quote'](30, 25, True), revived_ns['price_quote'](5, 100, True)),)",
          expected: '500/995/613/475',
        },
        {
          id: 't3',
          name: { ar: 'الوحدة العتيقة لم تُمَس وشبكتها خضراء', en: 'The legacy module is untouched with a green net' },
          code: "assert price_quote(2, 250, False) == 500 and price_quote(30, 25, True) == 613 and 'legacy: tests: 8 passed: 8' in __learner_output__, 'expected: legacy intact + green line | actual: %r' % __learner_output__",
          expected: 'legacy intact + green line',
        },
        {
          id: 't4',
          name: { ar: 'سجل الدين وإحصاء التغيير مطبوعان', en: 'The debt register line and change count are printed' },
          code: "assert 'debt:' in __learner_output__ and 'changed lines:' in __learner_output__ and 'after: tests: 8 passed: 8' in __learner_output__, 'expected: debt line + changed lines + after line | actual: %r' % __learner_output__",
          expected: 'debt line + changed lines + after line',
        },
      ],
      hints: [
        { ar: 'القيم المرصودة تحسب لك: (2,250,False) = 500 بالضبط لا يتجاوز عتبة الحسم 500؛ و(10,60,True) = 570 ثم حسم 25 فيصير 545.', en: 'The observed values, computed for you: (2,250,False) = exactly 500, not above the 500 rebate threshold; (10,60,True) = 570 then the 25 rebate gives 545.' },
        { ar: 'هيكل الوحدة المعاد هيكلتها:\nREBATE_THRESHOLD = 500\nBULK_REBATE = 25\n\ndef member_discount_percent(quantity):\n    if quantity > 10:\n        return 15\n    return 5\n\ndef volume_discount_percent(quantity):\n    if quantity > 20:\n        return 10\n    return 0\n\ndef apply_bulk_rebate(total):\n    if total > REBATE_THRESHOLD:\n        return total - BULK_REBATE\n    return total\n\ndef price_quote(quantity, unit_price, member):\n    total = quantity * unit_price\n    if member:\n        percent = member_discount_percent(quantity)\n    else:\n        percent = volume_discount_percent(quantity)\n    total = total - total * percent // 100\n    return apply_bulk_rebate(total)', en: 'Refactored-module skeleton:\nREBATE_THRESHOLD = 500\nBULK_REBATE = 25\n\ndef member_discount_percent(quantity):\n    if quantity > 10:\n        return 15\n    return 5\n\ndef volume_discount_percent(quantity):\n    if quantity > 20:\n        return 10\n    return 0\n\ndef apply_bulk_rebate(total):\n    if total > REBATE_THRESHOLD:\n        return total - BULK_REBATE\n    return total\n\ndef price_quote(quantity, unit_price, member):\n    total = quantity * unit_price\n    if member:\n        percent = member_discount_percent(quantity)\n    else:\n        percent = volume_discount_percent(quantity)\n    total = total - total * percent // 100\n    return apply_bulk_rebate(total)' },
        { ar: 'احفظ اسم الدالة العامة price_quote كما هو — الشبكة تستدعي run_suite(revived_ns[\'price_quote\']) فيجب أن يبقى المفتاح نفسه؛ السلوك لا يتغير والبنية وحدها تُمس.', en: "Keep the public function name price_quote exactly — the net calls run_suite(revived_ns['price_quote']), so the key must stay; behavior does not move, only structure." },
        { ar: 'العدّاد يسرد unified_diff بين LEGACY_PRICING_SRC وREFACTORED_PRICING_SRC ويعدّ أسطر + و- دون الترويسات — في حل المرجع: 9 محذوفة و23 مضافة أي changed lines: 32 / tests: 8 passed: 8. وسطر الدين مثال: debt: pricing magic numbers | principal: 3 dev-days | interest: 1/mo.', en: 'The counter walks the unified_diff between LEGACY_PRICING_SRC and REFACTORED_PRICING_SRC counting + and - lines without the headers — in the reference: 9 deleted, 23 added, so changed lines: 32 / tests: 8 passed: 8. Sample debt line: debt: pricing magic numbers | principal: 3 dev-days | interest: 1/mo.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-sequence',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ورثت نظامًا عتيقًا وقررت الإدارة إعادة بنائه. ما الترتيب الصحيح لسلسلة الفصل قبل أن تلمس أي سطر؟',
        en: 'You inherit a legacy system and management green-lights rebuilding it. What is the chapter\u2019s correct sequence before you touch a single line?',
      },
      options: [
        { id: 'a', text: { ar: 'احفظ السلوك بشبكة توصيف، ثم أعد الهيكلة والاختبارات خضراء، وعالج الدين المتعمَّد، ثم استبدل تدريجيًا حيث تبرر إعادة الكتابة', en: 'Preserve behavior with a characterization net, refactor while green, address debt deliberately, then replace incrementally where a rewrite is justified' } },
        { id: 'b', text: { ar: 'ابدأ بترحيل شجرة الخنزير أولًا، ثم صفِّ الهيكلة في النهاية، واكتب الاختبارات مع النظام الجديد', en: 'Start the strangler migration first, clean up refactoring at the end, write tests alongside the new system' } },
        { id: 'c', text: { ar: 'أعد الكتابة فورًا فهي أسرع من بناء شبكة، ثم تحقق بالنهاية دفعة واحدة', en: 'Rewrite immediately — faster than building a net — and validate everything at the end' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'ابدأ بالسؤال: ما الذي يحمي السلوك الحالي قبل أي لمس؟ الشبكة أولًا دائمًا.', en: "Start by asking: what protects current behavior before any touch? The net always comes first." },
        { ar: 'بعد الشبكة الخضراء تأتي الهيكلة بخطوات صغيرة تبقي الاختبارات خضراء بعد كل خطوة.', en: "After the green net comes refactoring in small steps that keep tests green after every step." },
        { ar: 'الدين المتعمَّد يُخدم بخطة سداد واضحة، والاستبدال التدريجي أخيرًا حيث تبرره الأرقام.', en: "Deliberate debt gets an explicit paydown plan, and incremental replacement comes last, where the numbers justify it." },
        { ar: 'التسلسل الصحيح: شبكة توصيف ثم هيكلة خضراء ثم خدمة الدين ثم شجرة الخنزير المتدحرجة.', en: "Correct sequence: characterization net, then green refactoring, then debt service, then the strangler fig." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-strangler',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'نمط الاستبدال التدريجي المسمّى على شجرة تنمو حول مضيفتها وتستبدلها تدريجيًا دون أن تموت المضيفة قبل الأوان: نمط ____.',
        en: 'The incremental replacement pattern named for a tree that grows around its host and gradually replaces it without the host dying first: the ____ pattern.',
      },
      answer: 'strangler',
      solution: 'strangler',
      hints: [
        { ar: 'الاسم من نبات حقيقي يتجذّر حول شجرة قائمة ويحيط بها حتى يحلّ محلها — استعارة فاولر للترحيل التدريجي.', en: 'The name comes from a real plant that roots around a standing tree and gradually takes its place — Fowler\u2019s metaphor for incremental migration.' },
        { ar: 'في كود الدرس ظهر بوصفه موجّهًا: كل ما لم تملكه الوحدة الجديدة بعدًا يبقى على legacy.', en: 'In the lesson\u2019s code it appeared as a router: everything the new module does not own yet stays on legacy.' },
        { ar: 'الحرف الأخير r — والنقيض منه رهان الكتابة الكاملة الذي يقتل المضيفة دفعة واحدة.', en: 'It ends with r — and its opposite is the big-bang rewrite that kills the host in one move.' },
        { ar: 'الجواب: strangler', en: 'Answer: strangler' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "LEGACY_SRC = '''def legacy_fee_code(visit_type):\n    # inherited: no docs, no tests\n    return {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}.get(visit_type, 'E10')\n'''\nns = {}\nexec(compile(LEGACY_SRC, 'legacy_fees.py', 'exec'), ns)\n\nprobes = ['exam', 'lab', 'vaccine', 'phone', '']\ngolden = {}\nfor probe in probes:\n    golden[probe] = ns['legacy_fee_code'](probe)\nfor probe in probes:\n    print(repr(probe), golden[probe])\n\n# جرّب: اكتب نسختك المعاد هيكلتها كسلسلة وحمّلها بـ exec في مساحة أسماء جديدة — هل يطابق كل ركن؟\n# try: write your refactored version as a string and exec it into a fresh namespace — does it match every corner?\n# جرّب: أضف مفتاح 'x-ray': 'X01' إلى قاموس النسخة الجديدة — أي ركن في golden سيصرخ؟\n# try: add an 'x-ray': 'X01' key to the new version's dict — which golden corner would scream?\n# جرّب: أعد بناء سطر دين للوحدة هذه وأفق فائدته على ستة أشهر\n# try: build a debt register line for this module and project its interest over six months",
      prompt: {
        ar: 'الملعب هو ورشة مصغّرة: وحدة عتيقة كسلسلة + شبكة رصد جاهزة. حاول أن تُحييها بحركات الدرس: ثابت مسمّى، مساعد مستخرج، حارس مبكر — والشبكة حكمك الوحيد. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox is a miniature workshop: a legacy module as a string + a ready observation net. Try reviving it with the lesson\u2019s moves: a named constant, an extracted helper, a guard clause — and let the net be your only judge. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'debug',
      id: 'ex5.debug-detail-test',
      required: true,
      brokenCode: "import io\nimport unittest\n\n# an honest refactor already applied: helper renamed _lookup_fee -> _fetch_fee, behavior identical\ndef _fetch_fee(visit_type):\n    return {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}.get(visit_type)\n\ndef legacy_fee_code(visit_type):\n    known = _fetch_fee(visit_type)\n    if known is not None:\n        return known\n    return 'E10'\n\nclass DetailSuite(unittest.TestCase):\n    def test_helper_name(self):\n        # pins an implementation detail: the helper's OLD name\n        self.assertIn('_lookup_fee', globals())\n\n    def test_known_codes(self):\n        self.assertEqual(legacy_fee_code('lab'), 'L20')\n        self.assertEqual(legacy_fee_code('vaccine'), 'V30')\n\n    def test_unknown_bills_as_exam(self):\n        self.assertEqual(legacy_fee_code('phone'), 'E10')\n\n    def test_exam_bills_as_itself(self):\n        self.assertEqual(legacy_fee_code('exam'), 'E10')\n\nresult = unittest.TextTestRunner(stream=io.StringIO()).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(DetailSuite))\nprint('run: %d failures: %d' % (result.testsRun, len(result.failures)))",
      prompt: {
        ar: 'الحزمة حمراء: run: 4 failures: 1 واختبار test_helper_name يسقط. لكن افحص السلوك بنفسك: lab تعطي L20 وvaccine تعطي V30 وphone تعطي E10 — الشيفرة المعاد هيكلتها مطابقة للسلوك المرصود حرفًا. فمن الكاذب هنا: الشيفرة أم الاختبار؟ أصلح النوع الخطأ من الاختبار — احذف تثبيت تفاصيل التنفيذ واستبدله بركن سلوكي لم تثبّته بعد — وأبقِ إعادة التسمية الصادقة كما هي.',
        en: 'The suite is red: run: 4 failures: 1 with test_helper_name failing. But check the behavior yourself: lab gives L20, vaccine gives V30, phone gives E10 — the refactored code matches the observed behavior exactly. So who is lying: the code or the test? Fix the wrong kind of test — drop the implementation-detail pin and replace it with a behavioral corner not yet pinned — and keep the honest rename untouched.',
      },
      solution: "import io\nimport unittest\n\n# the honest refactor stands: helper renamed _lookup_fee -> _fetch_fee, behavior identical\ndef _fetch_fee(visit_type):\n    return {'exam': 'E10', 'lab': 'L20', 'vaccine': 'V30'}.get(visit_type)\n\ndef legacy_fee_code(visit_type):\n    known = _fetch_fee(visit_type)\n    if known is not None:\n        return known\n    return 'E10'\n\nclass DetailSuite(unittest.TestCase):\n    def test_empty_bills_as_exam(self):\n        # behavior only: the empty-string corner, promoted from observation\n        self.assertEqual(legacy_fee_code(''), 'E10')\n\n    def test_known_codes(self):\n        self.assertEqual(legacy_fee_code('lab'), 'L20')\n        self.assertEqual(legacy_fee_code('vaccine'), 'V30')\n\n    def test_unknown_bills_as_exam(self):\n        self.assertEqual(legacy_fee_code('phone'), 'E10')\n\n    def test_exam_bills_as_itself(self):\n        self.assertEqual(legacy_fee_code('exam'), 'E10')\n\nresult = unittest.TextTestRunner(stream=io.StringIO()).run(\n    unittest.defaultTestLoader.loadTestsFromTestCase(DetailSuite))\nprint('run: %d failures: %d' % (result.testsRun, len(result.failures)))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الحزمة خضراء بعد إصلاح الاختبار', en: 'The suite is green after fixing the test' },
          code: "assert 'run: 4 failures: 0' in __learner_output__, 'expected: run: 4 failures: 0 | actual: %r' % __learner_output__",
          expected: 'run: 4 failures: 0',
        },
        {
          id: 't2',
          name: { ar: 'لا فشل باقٍ في التقرير', en: 'No failure remains in the report' },
          code: "assert 'failures: 1' not in __learner_output__, 'expected: no failures: 1 | actual: %r' % __learner_output__",
          expected: 'no failures: 1',
        },
        {
          id: 't3',
          name: { ar: 'السلوك المرصود كامل وقائم', en: 'The observed behavior is fully intact' },
          code: "assert legacy_fee_code('lab') == 'L20' and legacy_fee_code('vaccine') == 'V30' and legacy_fee_code('phone') == 'E10' and legacy_fee_code('') == 'E10', 'expected: L20/V30/E10/E10 | actual: %r' % ((legacy_fee_code('lab'), legacy_fee_code('vaccine'), legacy_fee_code('phone'), legacy_fee_code('')),)",
          expected: 'L20/V30/E10/E10',
        },
        {
          id: 't4',
          name: { ar: 'إعادة التسمية الصادقة بقيت والاختبار الكاذب رحل', en: 'The honest rename survived and the lying test is gone' },
          code: "assert '_fetch_fee' in globals() and '_lookup_fee' not in globals(), 'expected: _fetch_fee kept, _lookup_fee gone | actual: %r' % (('_fetch_fee' in globals(), '_lookup_fee' in globals()),)",
          expected: '_fetch_fee kept, _lookup_fee gone',
        },
      ],
      hints: [
        { ar: 'جرّب كل مدخل يدويًا: كل القيم تطابق الرصد الأصلي — فالشيفرة صادقة، والمسقط الحقيقي للاختبار هو نفسه.', en: 'Probe every input by hand: all values match the original observation — the code is honest, and so is the failure the test produces.' },
        { ar: 'اقرأ الاختبار الساقط: assertIn(\'_lookup_fee\', globals()) يؤكد اسم دالة مساعدة — تفصيل تنفيذ لا سلوكًا — فتنكسر مع أي إعادة تسمية بريئة.', en: 'Read the failing test: assertIn(\'_lookup_fee\', globals()) asserts a helper\u2019s name — an implementation detail, not behavior — so it breaks on any innocent rename.' },
        { ar: 'الاستبدال ركن سلوكي لم تثبّته الشبكة بعد: السلسلة الفارغة تفوتر E10 مثل phone — assertEqual(legacy_fee_code(\'\'), \'E10\').', en: "Replace it with a behavioral corner the net has not pinned yet: the empty string bills E10 like phone — assertEqual(legacy_fee_code(''), 'E10')." },
        { ar: 'الإصلاح الكامل:\n    def test_empty_bills_as_exam(self):\n        # behavior only: the empty-string corner, promoted from observation\n        self.assertEqual(legacy_fee_code(\'\'), \'E10\')\n\nوبعدها يطبع التقرير run: 4 failures: 0 مع بقاء _fetch_fee كما هي.', en: "Full fix:\n    def test_empty_bills_as_exam(self):\n        # behavior only: the empty-string corner, promoted from observation\n        self.assertEqual(legacy_fee_code(''), 'E10')\n\nThen the report prints run: 4 failures: 0 with _fetch_fee untouched." },
      ],
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل العاشر: أي الاتجاهين ينطبق على اختبار التوصيف الذي بنيناه في هذا الفصل؟',
            en: 'From chapter ten: which direction applies to the characterization tests we built in this chapter?',
          },
          options: [
            { id: 'a', text: { ar: 'المتوقع يُشتق من مواصفة مكتوبة قبل التشغيل', en: 'The expected value is derived from a written spec before running' } },
            { id: 'b', text: { ar: 'المتوقع يُرصد من النظام العامل نفسه ويُروَّج من رسالة الفشل', en: 'The expected value is observed from the running system itself and promoted from the failure message' } },
            { id: 'c', text: { ar: 'لا متوقع إطلاقًا — يكفي أن لا ينهار التنفيذ', en: 'No expectation at all — it is enough that execution does not crash' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'حلقة الترويج: اكتب متوقعًا خاطئًا عمدًا، شغّل، اقرأ الفعلية من الفشل، روّجها — النظام العامل هو الأوراكل لأن العتيقة بلا مواصفة موثوقة، حتى عيوبها تُثبَّت لأن غيرك قد يعتمدها.',
            en: 'The promote loop: write a deliberately wrong expectation, run, read the actual from the failure, promote it — the running system is the oracle because legacy has no trustworthy spec, and even its bugs get pinned since others may depend on them.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الفصل الثاني: في حلقة red–green–refactor، متى يأتي دور إعادة الهيكلة؟',
            en: 'From chapter two: in the red–green–refactor loop, when does refactoring happen?',
          },
          options: [
            { id: 'a', text: { ar: 'قبل كتابة الاختبار لتصميم الشيفرة على أساسها', en: 'Before writing the test, to design the code around it' } },
            { id: 'b', text: { ar: 'بعد أن تصير الاختبارات خضراء — تحسين البنية والسلوك مثبّت', en: 'After the tests are green — improving structure while behavior is pinned' } },
            { id: 'c', text: { ar: 'أثناء الاختبار الأحمر لتسريع الوصول إلى الأخضر', en: 'During the red phase, to reach green faster' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'القاعدة نفسها في العتيقة مع انقلاب البداية: هناك تبني الشبكة الخضراء أولًا حول سلوك قائم، ثم تحرك — والقيد واحد: لا هيكلة فوق أحمر، وأحمرّ أثناءها يعني تراجعًا وخطوة أصغر.',
            en: 'The same rule on legacy with a flipped start: you build the green net around existing behavior first, then move — and the constraint holds: no refactoring on red; red mid-refactor means undo and a smaller step.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الرابع عشر: ما الذي يجعل كل شريحة من ترحيل شجرة الخنزير آمنة قبل أن تستقر؟',
            en: 'From chapter fourteen: what makes each strangler-fig slice safe before it settles?',
          },
          options: [
            { id: 'a', text: { ar: 'قنينة في الإنتاج بتفصيل الميزة — تحقق من حركة حقيقية قبل اعتماد المسار', en: 'A production canary at feature granularity — verified against real traffic before the route settles' } },
            { id: 'b', text: { ar: 'مراجعة كود شاملة لكل سطر في الوحدة الجديدة', en: 'A comprehensive code review of every line in the new module' } },
            { id: 'c', text: { ar: 'تجريد الوحدة العتيقة من الحركة نهائيًا قبل البناء', en: 'Cutting all traffic to the legacy module before building' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'النشر التدريجي من الفصل الرابع عشر هو ذراع شجرة الخنزير: الشريحة تتحقق من الاستخدام الحقيقي في أسابيع من كتابتها، وكل قرار توجيه قابل للعكس — إعادة الكتابة تصير سلسلة نشرات صغيرة.',
            en: 'Chapter fourteen\u2019s progressive delivery is the strangler\u2019s arm: each slice is validated by real use within weeks of being written and every routing decision stays reversible — the rewrite becomes a series of small deployments.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن فصل Git: التزام يجمع إصلاح عيب مع إعادة هيكلة — ما خطورته؟',
            en: 'From the Git chapter: a commit that mixes a bug fix with a refactor — what is the danger?',
          },
          options: [
            { id: 'a', text: { ar: 'لا خطورة — ما دامت الحزمة خضراء فالمحتوى وحده يهم', en: 'None — as long as the suite is green, only the content matters' } },
            { id: 'b', text: { ar: 'يستخدم أسطرًا أكثر فيصعب دمجه', en: 'It uses more lines, making merges harder' } },
            { id: 'c', text: { ar: 'يُعمي المراجعة ويعطّل التراجع: لا سبيل لمعرفة هل تغيّر السلوك قصدًا أم انزلق', en: 'It blinds review and breaks rollback: no way to tell whether behavior changed on purpose or slipped' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'النية الواحدة لكل التزام تجعل الفرق يروي حكاية واحدة: هيكلة نظيفة يعني أن السلوك لم يتحرك ميليمترًا — كما رأيت في كتلة التصحيح حيث انزلق >= في التزام «هيكلة» ففضحته الشبكة وحدها.',
            en: 'One intent per commit makes the diff tell one story: a clean refactor commit means behavior did not move a millimeter — as in the debug block where a >= slipped into a \u201crefactor\u201d and only the net exposed it.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'سجل دينك يظهر صنفًا بفائدة 3/شهر في وحدة تلمسها أسبوعيًا، وصنفًا بفائدة 1/شهر في وحدة مغلقة منذ سنوات. أيهما أولى بالسداد ولماذا؟',
            en: 'Your register shows a 3/month item in a module touched weekly and a 1/month item in a module sealed for years. Which gets repaid first, and why?',
          },
          options: [
            { id: 'a', text: { ar: 'صنف 3/شهر — فأنت تدفع فائدته فعلًا كل أسبوع والسداد هناك يوقف نزيف السعة', en: 'The 3/month item — you actually pay its interest weekly, so repaying it stops the capacity bleed' } },
            { id: 'b', text: { ar: 'صنف 1/شهر — فأصله الأصغر أسهل على الفريق', en: 'The 1/month item — its smaller principal is easier on the team' } },
            { id: 'c', text: { ar: 'أيهما أقرب موعدًا لتقادم الشيفرة', en: 'Whichever code is closer to obsolescence' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قاعدة الدرس: سدّد الأصل حيث تدفع الفائدة فعلًا. الوحدة المغلقة تفائدة شبه صفر مهما بدت قبيحة؛ والدوران العالي هو الذي يحوّل الفائدة إلى كلفة حقيقية يلمسها الفريق في كل تغيير.',
            en: 'The lesson\u2019s rule: repay principal where you actually pay interest. The sealed module accrues near-zero interest however ugly; high churn is what turns interest into a real cost the team feels on every change.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'في كتلة التصحيح: أي صفة للاختبار جعلته ينكسر من إعادة هيكلة صادقة لم تحرك السلوك؟',
            en: 'In the debug block: which property of the test made it break under an honest refactor that never moved behavior?',
          },
          options: [
            { id: 'a', text: { ar: 'تأكيده على تفصيل تنفيذ — اسم دالة مساعدة قديم — بدل سلوك مرصود', en: 'It asserted an implementation detail — an old helper\u2019s name — instead of observed behavior' } },
            { id: 'b', text: { ar: 'استخدام unittest بدل asserts يدوية', en: 'It used unittest instead of plain asserts' } },
            { id: 'c', text: { ar: 'أنه كان في صنف واحد مع اختبارات أخرى للسلوك', en: 'It lived in the same class as the behavior tests' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الاختبار الذي يثبّت اسم مساعد أو عدد نداءات يختبر البنية لا السلوك، فينكسر مع كل حركة بريئة ويصير كابنًا على التطور. الإصلاح: استبدله بركن سلوكي مرصود — والتزام الهيكلة الصادق يبقى كما هو.',
            en: 'A test pinning a helper name or a call count tests structure, not behavior, so it breaks on every innocent move and taxes evolution. The fix: swap it for an observed behavioral corner — and the honest refactor commit stays exactly as it was.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'حزمتي خضراء فصحة شيفري مؤكدة — لن أفحص ماذا تؤكد الاختبارات',
          right: 'الحزمة الخضراء تحمي فقط ما تؤكده بصدق: اختبار يثبّت تفاصيل التنفيذ ينكسر من هيكلة صادقة ويحمي لا شيء',
          note: {
            ar: 'كتلة التصحيح كانت مثالك: أربعة اختبارات يمرّ ثلاثة منها سلوكًا صحيحًا والرابع يسقط على اسم — والحزمة كلها تبين خضراء أو حمراء بلا معنى. المعيار سؤال واحد عند كل تأكيد: هل هذا يصف سلوكًا مرصودًا عند مدخل ومخرج، أم ذكرى عن كيف كُتبت الشيفرة؟',
            en: 'The debug block was your exhibit: four tests, three passing on true behavior, one dropping on a name — and the suite as a whole goes green or red meaninglessly. The criterion for every assertion is one question: does it describe observed behavior at an input and an output, or a memory of how the code was written?',
          },
        },
        {
          wrong: 'الحزمة حمراء بعد الهيكلة — سأعيد الشيفرة القديمة وأنسى الأمر',
          right: 'اسأل أولًا: هل تغيّر السلوك أم انكسر اختبار؟ سلوك منزلق يُصلح في الشيفرة، واختبار يثبّت تفصيلًا يُصلح في الاختبار',
          note: {
            ar: 'الحمراء في هذا الفصل سببان مختلفان تمامًا: انزلاق >= في كتلة الدرس الثاني كان عيب شيفرة تفضحه الشبكة؛ وانكسار test_helper_name هنا كان عيب اختبار تفضحه الشيفرة الصادقة. القرار خاطئ إن أخلطت: إصلاح الاختبار لإخفاء انزلاق سلوك جريمة، وتعديل شيفرة صادقة لإرضاء اختبار تفاصيل خسارة مضاعفة.',
            en: 'Red in this chapter has two entirely different causes: the >= slip in lesson two\u2019s block was a code defect the net exposed; test_helper_name breaking here was a test defect the honest code exposed. Misdiagnose and you lose either way: fixing the test to hide a behavior slip is a crime, and bending honest code to please a detail test is a double loss.',
          },
        },
        {
          wrong: 'المشروع انتهى عند آخر اختبار أخضر — سطر الدين وإحصاء التغيير ترف',
          right: 'التسليم يشمل الحوكمة: سجل الدين مرئي في قائمة الأعمال، وسطر changed lines / tests جزء من طلب الدمج',
          note: {
            ar: 'الورشة طبّقت السلسلة كاملة: شبكة خضراء، هيكلة تحت الخضرة، ثم سطران يتركان للفريق: debt: يعلن ما تبقى بفائدته، وchanged lines: 32 / tests: 8 passed: 8 يروي حجم التدخل وصحته. بلا هذين السطرين يعود الدين غير المقصود من الباب الخلفي: ما لا يُعلَن لا يُراجَع.',
            en: 'The workshop ran the full chain: green net, refactor under green, then two lines left for the team: debt: announcing what remains with its interest, and changed lines: 32 / tests: 8 passed: 8 telling the size and health of the intervention. Without those lines inadvertent debt returns through the back door: what is never announced is never reviewed.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'سلسلة الفصل في سطر: احفظ السلوك بشبكة توصيف، أعد الهيكلة والاختبارات خضراء، عالج الدين بعين مفتوحة، واستبدل تدريجيًا حيث تبرر إعادة الكتابة — والأبدي: أبقِ الشيفرة قابلة للتغيير.', en: 'The chapter in one line: preserve behavior with a characterization net, refactor while green, address debt with open eyes, replace incrementally where a rewrite is justified — and above all: keep the code changeable.' },
        { ar: 'الورشة طبّقتها على وحدة تسعير عتيقة: شبكة 8 أركان خضراء مرتين — على الأصل وعلى المُحيَّى — ثوابت مسمّاة بدل الأرقام السحرية ومساعدات مستخرجة وحراس، وسطر debt: وسطر changed lines: 32 / tests: 8 passed: 8.', en: 'The workshop applied it to a legacy pricing module: an 8-corner net green twice — on the original and the revived — named constants replacing magic numbers, extracted helpers, guards, a debt: line and changed lines: 32 / tests: 8 passed: 8.' },
        { ar: 'الحزمة تحكم الشيفرة لا العكس: اختبار يثبّت اسم مساعد أو تفصيل تنفيذ ينكسر من هيكلة صادقة — فأصلح الاختبار لا الشيفرة؛ أما انزلاق السلوك فيفضحه الشبكة فأصلح الشيفرة لا الاختبار.', en: 'The suite judges the code, not the reverse: a test pinning a helper name or implementation detail breaks under an honest refactor — fix the test, not the code; a behavior slip, meanwhile, is exposed by the net — fix the code, not the test.' },
      ],
      reflectPrompt: {
        ar: 'أعد تشغيل مشروع الورشة وتأمل سطرَي الحصيلة. اسأل نفسك: لو طُلب منك غدًا إحياء أقسى وحدة ورثتها — ما أول ثلاثة أركان سترصدها بشبكتك، وأين سيدخل صنفها في سجل الدين؟',
        en: 'Rerun the workshop project and stare at the two summary lines. Ask yourself: if you were handed your worst inherited module tomorrow — what are the first three corners you would pin with your net, and where would its entry land in the debt register?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch15.s7', pages: 'ص419-420 / pp.419-420' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch15.s7', pages: 'ص419-420 / pp.419-420' },
  ],
} satisfies Lesson;

export default lesson;
