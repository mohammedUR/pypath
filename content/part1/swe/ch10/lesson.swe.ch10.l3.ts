import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch10.l3 — "Input Coverage: Black-Box Testing / تغطية المدخلات: الاختبار بالصندوق الأسود"
 * Aligned with SWE ch10 s4 (Input Coverage I: Black-Box Testing), book pp.267-269.
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never a
 * verbatim translation.
 * Runnable design: set_volume spec family (valid integers 1..100), equivalence
 * representatives and below/at/above boundary triples through an assert harness.
 * Deterministic only: no input(), no random, no exit(), no unittest.main.
 */
const lesson = {
  id: 'swe.ch10.l3',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 10,
  title: { ar: 'تغطية المدخلات: الاختبار بالصندوق الأسود', en: 'Input Coverage: Black-Box Testing' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch10.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الصندوق الأبيض اختر المدخلات من بنية الكود — لكن مواصفتك، لا الكود، هي عقدك مع المستخدم: فماذا لو كان الكود نفسه مخالفًا للعقد؟ الصندوق الأسود يقلب المنظار: يقرأ المواصفة وحدها ويحوّلها إلى أصناف وحدود ثم يهاجم بها الكود من الخارج. اليوم تتعلم تقنيتين تختصران فضاءً لا نهائيًّا إلى حفنة اختبارات ذكية: تجزئة التكافؤ equivalence partitioning التي تمثل كل فئة سلوك بممثل واحد، وتحليل القيم الحدّية boundary value analysis الذي يصطاد العيوب حيث تتجمع — عند الحواف حيث تُكتب المقارنات الهشة < و<=. بنهاية الدرس ستكون قادرًا على: استخراج فئات صالحة وغير صالحة من مواصفة، وتوليد ثلاثيات الحدود below/at/above، وكتابة حزام حدّي يكشف عيبًا تتجاهله تغطية الكود كاملة.',
        en: 'White-box picks inputs from code structure — but your specification, not the code, is your contract with the user: what if the code itself breaks the contract? Black-box testing flips the lens: it reads only the specification, turns it into classes and boundaries, and attacks the code from outside. Today you learn two techniques that shrink an infinite input space to a handful of smart tests: equivalence partitioning, which represents each behavior class with one representative, and boundary value analysis, which hunts defects where they cluster — at the edges where fragile comparisons like < and <= are written. By the end of this lesson you will be able to: extract valid and invalid classes from a spec, generate below/at/above boundary triples, and write a boundary harness that exposes a defect invisible to full code coverage.',
      },
    },
    {
      kind: 'predict',
      code: "def band(score):\n    if score < 60:\n        return 'fail'\n    if score < 80:\n        return 'pass'\n    return 'high'\n\nfor s in [59, 60, 79, 80]:\n    print(s, band(s))",
      question: {
        ar: 'دالة تصنيف بمقارنتين صارمتين <. ماذا يطبع لكل قيمة من القيم الأربع؟ وأي سطرين يكشفان الفرق الحقيقي بين < و<=؟',
        en: 'A classifier with two strict comparisons <. What does it print for each of the four values? And which two lines expose the real difference between < and <=?',
      },
      reveal: {
        ar: 'الخرج: 59 fail و60 pass و79 pass و80 high. السطران المفصليان هما 60 و80: القيمة على الحد تسلك سلوك الشريحة الأعلى لأن المقارنة صارمة — لو كتب المبرمج <= لانقلبت الشريحة. هذه بالضبط منطقة الحواف التي سيتخصص اليوم كله في مهاجمتها: العيوب تتجمع حيث تُكتب المقارنات.',
        en: 'The output: 59 fail, 60 pass, 79 pass, 80 high. The two pivotal lines are 60 and 80: a value sitting on the boundary takes the upper band behavior because the comparison is strict — write <= and the band flips. This is exactly the edge territory this lesson specializes in attacking: defects cluster where comparisons are written.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تجزئة التكافؤ: ممثل لكل صنف', en: 'Equivalence partitioning: one representative per class' },
      chunks: [
        {
          ar: 'الفكرة: المدخلات ليست كلها مختلفة — المواصفة تعامل فئات كاملة من المدخلات بالطريقة نفسها، فممثل واحد عن الفئة يكفي تقريبًا. الفئة المكافئة equivalence class هي مجموعة مدخلات توحي المواصفة بأنها تُعالج المعالجة ذاتها؛ وتجزئة الفضاء إلى فئات صالحة وغير صالحة ثم اختيار ممثل لكل فئة تقلص الاختبار من «كل مدخل» إلى «واحد لكل صنف» مع بقاء تغطية السلوك قوية. خذ مواصفة set_volume: مستوى صحيح من 1 إلى 100 شاملين يُقبل، وكل شيء آخر يُرفض — أربع فئات: أقل من 1، داخل المدى، فوق 100، وغير صحيح أصلًا كسلسلة أو عدد عشري.',
          en: 'The insight: inputs are not all different — a specification usually treats whole classes of inputs identically, so one representative per class is almost as good as any other. An equivalence class is a set of inputs the spec implies are handled the same way; partitioning the space into valid and invalid classes and picking one representative each shrinks testing from every input to one per class while keeping behavioral coverage strong. Take the set_volume spec: an integer level from 1 to 100 inclusive is accepted, anything else rejected — four classes: below 1, inside the range, above 100, and non-integer in the first place, like a string or a float.',
        },
        {
          ar: 'والقاعدة التي يغفلها الاختبار العشوائي: الفئات غير الصالحة جزء من المواصفة. من يختبر 1 و2 و3 ثم 100 يختبر الفئة الصالحة مئة مرة ويترك الرفض كله بلا حكم — والممثلون الأربعة (-3 و55 و250 و"loud") يغطون كل سلوك موصوف بأربع تجارب. افترض أيضًا عكس الاتجاه: إن خالف الكود جدول الفئات — قبل قيمة صالحة أو قبل رفض غير صالح — فالعيب سيظهر في ممثل واحد وسيتكرر مع كل أعضاء الفئة، ولهذا يبقى التقسيم أداة تشخيص لا ضمانة.',
          en: 'And the rule ad-hoc testing skips: invalid classes are part of the specification. Whoever tests 1, 2, 3 then 100 tests the valid class a hundred times and leaves every rejection unjudged — while the four representatives (-3, 55, 250 and a string) cover every specified behavior in four trials. The direction reverses too: if the code breaks the class table — accepting an invalid value or rejecting a valid one — the defect surfaces at one representative and repeats across the whole class, which is why partitioning stays a diagnostic, not a guarantee.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تحليل القيم الحدّية: where defects cluster', en: 'Boundary-value analysis: where defects cluster' },
      chunks: [
        {
          ar: 'لماذا تتجمع العيوب عند الحواف؟ لأن الحد هو المكان الذي تُكتب فيه المقارنات الهشة: < أم <=؟ حد حلقة بإزاحة واحدة off-by-one؟ > أم >=؟ المبرمج الذي كتب شرط الحارس قد خلط الإشارة مرة، وكل قيمة من داخل الفئة تسلك السلوك ذاته فلا تكشفه. تحليل القيم الحدّية يستهدف الحواف تحديدًا: عند كل حد، افحص القيمة التي تحته، والقيمة عليه، والقيمة التي فوقها — ثلاثيات below/at/above. لمواصفة set_volume المدى الصالح 1..100 فيه حدّان: 1 السفلي و100 العلوي، فالاختبارات الحدّية ستة: 0 و1 و2 و99 و100 و101.',
          en: 'Why do defects cluster at boundaries? Because the boundary is where fragile comparisons get written: < or <=? an off-by-one loop bound? > or >=? The programmer writing the guard may have flipped the sign once, and every interior value behaves identically so nothing reveals it. Boundary-value analysis targets exactly those edges: at each boundary, test the value just below it, at it, and just above it — below/at/above triples. The set_volume spec with valid range 1..100 has two boundaries, 1 lower and 100 upper, so the boundary tests are six: 0, 1, 2, 99, 100, 101.',
        },
        {
          ar: 'وشاهد القيمة الحدّية وهي تعمل: لو كتب المبرمج الحارس level >= 100 بدل level > 100 فسيرفض 100 وهي صالحة. ممثل التكافؤ 55 يمرّ سعيدًا، و-3 و250 يُرفضان كما يجب — والعيب يختبئ عند الحافة العليا وحدها. لكن اختبار الحد عند 100 يفشل: الكود يرفض قيمة تقول المواصفة إنها صالحة، فيسمّي الخطأ باصظه — >= حيث >. هذه هي العائد: القيم الحدّية تصطاد أشهر أصناف العيوب الرقمية بكلفة قليلة من الاختبارات الإضافية فوق أصناف التكافؤ.',
          en: 'Now watch a boundary do its job: if the programmer wrote the guard as level >= 100 instead of level > 100, the code rejects 100 though the spec accepts it. The equivalence representative 55 sails through, -3 and 250 are correctly rejected — the defect hides at the top edge alone. But the boundary test at 100 fails: the code rejects a value the spec calls valid, naming the mistake by catching it — >= where > was meant. That is the payoff: boundary values catch one of the most common categories of numeric defect for a handful of extra tests on top of equivalence classes.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'دمج المعيارين واختبارات المواصفة', en: 'Combining the criteria and spec-derived tests' },
      chunks: [
        {
          ar: 'المعياران يتعاونان لا يتنافسان: تجزئة التكافؤ تخبرك بالمناطق الموجودة، وتحليل الحدود يخبرك أين تحفر داخلها وبينها. عمليًّا تكتب ممثلًا داخليًّا لكل فئة ثم ثلاثيات below/at/above عند كل حد — لمواصفة set_volume هذا نحو 4 + 6 = حفنة اختبارات تغطي السلوك أفضل بكثير من عشرات العشوائية. والمواصفة تمنحك أيضًا الـ oracle: لكل صنف سلوك متوقع مكتوب مسبقًا (تقبل/ترفض) فلا حاجة لعين بشرية — هذا هو الاختبار المشتق من المواصفة spec-derived testing من الدرس الأول.',
          en: 'The two criteria cooperate rather than compete: equivalence partitioning tells you which regions exist; boundary analysis tells you where to dig within and between them. In practice you write one interior representative per class plus below/at/above triples at each boundary — for set_volume roughly 4 + 6 = a handful of tests covering behavior far better than dozens of random ones. The specification also hands you the oracle: each class has a pre-written expected behavior (accept or reject), so no human eye is needed — this is spec-derived testing from lesson one.',
        },
        {
          ar: 'وتقنية سوداء أخيرة تتخلى عن الانتقاء كله: fuzzing يرمي البرنامج بجبال مدخلات مشوهة ومراقب الانهيار والتعليق — بلا مواصفة ولا فئات، وoracle الضمني الوحيد أن البرنامج لا يسقط. هو ابن عم الاختبار بالخاصيات لكنه عدواني الطبع: بدل فحص خاصية على مدخلات سليمة، يبحث عن المدخل المشوه الذي لم يخطر لأحد رفضه، ولذلك يستقر في اختبار الأمان ويُشغَّل لساعات أو أيام في مرحلة غير معترضة من خط الإنتاج — لا على كل حفظ.',
          en: 'One final black-box technique abandons selection altogether: fuzzing throws mountains of malformed inputs at a program and watches for crashes and hangs — no specification, no classes, the sole implicit oracle being that the program must not fall over. It is a cousin of property-based testing but adversarial in spirit: instead of checking a property on well-formed inputs it hunts the ill-formed input nobody thought to reject, which is why it lives in security testing and runs for hours or days in a non-blocking pipeline stage — not on every save.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'جدول الفئات والممثلون الأربعة', en: 'The class table and its four representatives' },
      code: "def set_volume(level):\n    if not isinstance(level, int):\n        return 'rejected'\n    if 1 <= level <= 100:\n        return 'accepted'\n    return 'rejected'\n\nrepresentatives = [(-3, 'rejected'), (55, 'accepted'), (250, 'rejected'), ('loud', 'rejected')]\nfor value, expected in representatives:\n    got = set_volume(value)\n    assert got == expected, 'class broken at %r' % (value,)\n    print('%r -> %s' % (value, got))\n\nprint('classes: 4 covered: 4')",
      explanation: {
        ar: 'الجدول من المواصفة مباشرة: C1 أقل من 1 يُرفض، C2 داخل 1..100 يُقبل، C3 فوق 100 يُرفض، C4 غير صحيح يُرفض — وممثل واحد لكل فئة: -3 و55 و250 و"loud". الحلقة تمرّر كل ممثل وتطالب الكود بالسلوك الموصوف عبر assert — الـ oracle مشتق من المواصفة لا من النظر في الكود. لاحظ الترتيب في set_volume نفسه: فحص isinstance أولًا لأن المقارنة 1 <= "loud" سترفع TypeError قبل أي رفض مهذب — فئة C4 تفرض فحص النوع قبل مقارنات المدى. أربعة اختبارات تغطي كل سلوك موصوف — والثلاثيات الحدّية تأتي في التمرين.',
        en: 'The table comes straight from the spec: C1 below 1 rejected, C2 inside 1..100 accepted, C3 above 100 rejected, C4 non-integer rejected — one representative each: -3, 55, 250 and a string. The loop walks every representative and holds the code to the specified behavior via assert — the oracle derived from the spec, not from reading the code. Notice the order inside set_volume itself: the isinstance check comes first, because 1 <= "loud" would raise TypeError before any graceful rejection — class C4 forces the type check before the range comparisons. Four tests cover every specified behavior — the boundary triples arrive in the exercise.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.boundary-harness',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المواصفة مكتوبة في تعليق داخل الكود: set_volume تقبل أعدادًا صحيحة من 1 إلى 100 شاملين (True) وترفض كل شيء آخر (False). (1) اكتب جسم set_volume: ارفض غير الصحيح بـ isinstance، ثم اقبل 1 <= level <= 100، وإلا فارفض. (2) أكمل الحلقة: مرّر كل حالة حدّية من boundary_cases على set_volume وزد passed عند التطابق وإلا اطبع FAILED at مع القيمة. في النهاية اطبع سطرًا واحدًا بالصيغة: boundary cases: %d passed: %d. المتوقع مع الحالات المعطاة: boundary cases: 6 passed: 6.',
        en: 'The spec sits in an in-code comment: set_volume accepts integers from 1 to 100 inclusive (True) and rejects everything else (False). (1) Write the body of set_volume: reject non-integers with isinstance, then accept 1 <= level <= 100, else reject. (2) Complete the loop: run each boundary case from boundary_cases through set_volume, adding one to passed on a match, else printing FAILED at with the value. At the end print one line in the form: boundary cases: %d passed: %d. Expected with the given cases: boundary cases: 6 passed: 6.',
      },
      starterCode: "# المواصفة — spec:\n#   set_volume(level): الصلاح أعداد صحيحة 1..100 شاملين -> True؛ وكل شيء آخر -> False\n#   set_volume(level): valid integers 1..100 inclusive -> True; anything else -> False\n\ndef set_volume(level):\n    # اكتب الجسم: ارفض غير الصحيح، ثم اقبل 1..100، وإلا فارفض\n    # write the body: reject non-int, then accept 1..100, else reject\n    ...\n\nboundary_cases = [\n    (0, False),\n    (1, True),\n    (2, True),\n    (99, True),\n    (100, True),\n    (101, False),\n]\n\npassed = 0\n# أكمل الحلقة: قارن set_volume(value) بالمتوقع وعُدّ أو اطبع FAILED\n# complete the loop: compare set_volume(value) with expected, count or print FAILED\n\nprint('boundary cases: %d passed: %d' % (len(boundary_cases), passed))",
      solution: "# المواصفة — spec:\n#   set_volume(level): الصلاح أعداد صحيحة 1..100 شاملين -> True؛ وكل شيء آخر -> False\n#   set_volume(level): valid integers 1..100 inclusive -> True; anything else -> False\n\ndef set_volume(level):\n    if not isinstance(level, int):\n        return False\n    return 1 <= level <= 100\n\nboundary_cases = [\n    (0, False),\n    (1, True),\n    (2, True),\n    (99, True),\n    (100, True),\n    (101, False),\n]\n\npassed = 0\nfor value, expected in boundary_cases:\n    if set_volume(value) == expected:\n        passed += 1\n    else:\n        print('FAILED at %r' % (value,))\n\nprint('boundary cases: %d passed: %d' % (len(boundary_cases), passed))",
      tests: [
        {
          id: 't1',
          name: { ar: 'سطر الحصيلة يظهر كاملًا', en: 'The summary line appears complete' },
          code: "assert 'boundary cases: 6 passed: 6' in __learner_output__, 'expected: boundary cases: 6 passed: 6 | actual: %r' % __learner_output__",
          expected: 'boundary cases: 6 passed: 6',
        },
        {
          id: 't2',
          name: { ar: 'القيمة الداخلية 55 تُقبل', en: 'The interior value 55 is accepted' },
          code: "assert set_volume(55) is True, 'expected: True for 55 | actual: %r' % set_volume(55)",
          expected: 'True for 55',
        },
        {
          id: 't3',
          name: { ar: 'الحدّان يستقيمان: 0 و101 يُرفضان', en: 'Both edges hold: 0 and 101 rejected' },
          code: "assert set_volume(0) is False and set_volume(101) is False, 'expected: False, False | actual: %r' % ((set_volume(0), set_volume(101)),)",
          expected: 'False, False',
        },
        {
          id: 't4',
          name: { ar: 'فئة غير الصحيح مغطاة أيضًا', en: 'The non-integer class is covered too' },
          code: "assert set_volume('loud') is False and set_volume(3.5) is False, 'expected: False for non-int | actual: %r' % ((set_volume('loud'), set_volume(3.5)),)",
          expected: 'False for non-int',
        },
        {
          id: 't5',
          name: { ar: 'لا أسطر FAILED — كل الحالات الحدّية نجحت', en: 'No FAILED lines — every boundary case passed' },
          code: "assert 'FAILED' not in __learner_output__, 'expected: no FAILED lines | actual: %r' % __learner_output__",
          expected: 'no FAILED lines',
        },
      ],
      hints: [
        { ar: 'ابدأ بفئة C4: if not isinstance(level, int): return False — فهي تحمي المقارنات التالية من TypeError مع السلاسل.', en: 'Start with class C4: if not isinstance(level, int): return False — it shields the later comparisons from a TypeError on strings.' },
        { ar: 'بعد فحص النوع يبقى سطر واحد: return 1 <= level <= 100 — سلسلة المقارنة تعيد bool جاهزًا فلا if إضافي.', en: 'After the type check one line remains: return 1 <= level <= 100 — the comparison chain already returns a ready bool, no extra if needed.' },
        { ar: "الهيكل:\nfor value, expected in boundary_cases:\n    if set_volume(value) == expected:\n        passed += 1\n    else:\n        print('FAILED at %r' % (value,))\nprint('boundary cases: %d passed: %d' % (len(boundary_cases), passed))", en: "The skeleton:\nfor value, expected in boundary_cases:\n    if set_volume(value) == expected:\n        passed += 1\n    else:\n        print('FAILED at %r' % (value,))\nprint('boundary cases: %d passed: %d' % (len(boundary_cases), passed))" },
        { ar: "الحل الكامل للجسم:\ndef set_volume(level):\n    if not isinstance(level, int):\n        return False\n    return 1 <= level <= 100\n\nثم الحلقة كما في الهيكل — الحالات الست كلها تطابق فتُطبع boundary cases: 6 passed: 6.", en: "The full body solution:\ndef set_volume(level):\n    if not isinstance(level, int):\n        return False\n    return 1 <= level <= 100\n\nthen the loop as in the skeleton — all six cases match, printing boundary cases: 6 passed: 6." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-buggy-guard',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. ثم حدّد في ذهنك أي سطر يخالف المواصفة (الصلاح 1..100 شاملين).',
        en: 'Read the code and predict its exact output — one line per print — without running it. Then decide in your head which line violates the spec (valid 1..100 inclusive).',
      },
      code: "def set_volume_buggy(level):\n    if level < 1 or level >= 100:\n        return 'rejected'\n    return 'accepted'\n\nfor value in [55, 99, 100, 101]:\n    print(value, set_volume_buggy(value))",
      solution: '55 accepted\n99 accepted\n100 rejected\n101 rejected',
      answer: '55 accepted\n99 accepted\n100 rejected\n101 rejected',
      hints: [
        { ar: 'الحارس level >= 100 يرفض 100 أيضًا — المقارنة صارمة في الاتجاه الخطأ.', en: 'The guard level >= 100 rejects 100 as well — the comparison is strict in the wrong direction.' },
        { ar: '55 و99 داخلان فيُقبلان؛ و101 فوق الحد فيُرفض صحيحًا؛ و100 الحد العلوي نفسه يُرفض ظلمًا.', en: '55 and 99 are inside so they are accepted; 101 is above the edge and correctly rejected; and 100, the upper edge itself, is unjustly rejected.' },
        { ar: 'ممثل التكافؤ 55 لا يمكنه كشف هذا العيب مهما تكرر — وحده اختبار الحد عند 100 يعلنه.', en: 'The equivalence representative 55 can never expose this defect no matter how often repeated — only the boundary test at 100 announces it.' },
        { ar: "الخرج:\n55 accepted\n99 accepted\n100 rejected\n101 rejected\n— والسطر الثالث المخالف للمواصفة هو 100 rejected.", en: "The output:\n55 accepted\n99 accepted\n100 rejected\n101 rejected\n— the spec-violating line is the third: 100 rejected." },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-partitions',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يكفي — غالبًا — ممثل واحد لكل فئة تكافؤ بدل اختبار كل مدخل ممكن؟',
        en: 'Why is one representative per equivalence class — rather than every possible input — usually enough?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن عدد المدخلات صغير أصلًا ولا يستحق التقسيم', en: 'Because the number of inputs is small anyway and needs no partitioning' } },
        { id: 'b', text: { ar: 'لأن المواصفة توحي بأن كل أعضاء الفئة يعاملون معاملة واحدة — فسلوك الممثل ينبّه إلى سلوك الفئة كلها', en: 'Because the spec implies all members of a class are handled the same way — the representative behavior stands for the whole class' } },
        { id: 'c', text: { ar: 'لأن اختبار كل مدخل مستحيل فنستسلم ونختار ما تيسر', en: 'Because testing every input is impossible so we give up and pick whatever is handy' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'التعريف نفسه يحمل الجواب: الفئة المكافئة هي مجموعة مدخلات توحي المواصفة بمعالجتها بالطريقة نفسها.', en: 'The definition itself carries the answer: an equivalence class is a set of inputs the spec implies are handled the same way.' },
        { ar: 'الفرض قابل للكسر — إن خالف الكود الجدول فيتبين من الممثل ويتكرر مع الفئة كلها، وهذا يجعل التقسيم تشخيصًا لا استسلامًا.', en: 'The assumption can break — if the code violates the table it shows at the representative and repeats across the class, which makes partitioning a diagnostic, not surrender.' },
        { ar: 'والبند الثالث مهم: الفئات تشمل غير الصالحة أيضًا — وهي التي يغفلها العشوائي.', en: 'And a crucial third point: classes include the invalid ones — exactly what ad-hoc testing skips.' },
        { ar: 'الجواب: b — افتراض التكافؤ المشتق من المواصفة هو مبرر الممثل الواحد.', en: 'Answer: b — the spec-derived equivalence assumption justifies the single representative.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-boundaries',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'لمواصفة set_volume المدى الصالح 1..100 فيه حدّان: 1 و100. عند كل حد تفحص ثلاثية كاملة: القيمة التي تحته والقيمة عليه والقيمة التي فوقه. كم اختبارًا حدّيًا في المجموع؟ (رقم فقط)',
        en: 'The set_volume spec has a valid range 1..100 with two boundaries: 1 and 100. At each boundary you test a full triple: just below, at, and just above. How many boundary tests in total? (number only)',
      },
      answer: '6',
      solution: '6',
      hints: [
        { ar: 'عدّ الحدود أولًا: 1 و100 — حدّان.', en: 'Count the boundaries first: 1 and 100 — two of them.' },
        { ar: 'كل حد يأخذ ثلاث قيم: below وat وabove.', en: 'Each boundary takes three values: below, at, above.' },
        { ar: 'الجدول من الدرس: 0 و1 و2 للحد السفلي، و99 و100 و101 للعلوي.', en: 'The lesson table: 0, 1, 2 for the lower edge, and 99, 100, 101 for the upper.' },
        { ar: 'الجواب: 6', en: 'Answer: 6' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "def set_volume(level):\n    if not isinstance(level, int):\n        return 'rejected'\n    if 1 <= level <= 100:\n        return 'accepted'\n    return 'rejected'\n\ndef set_volume_buggy(level):\n    if not isinstance(level, int):\n        return 'rejected'\n    if 1 <= level < 100:\n        return 'accepted'\n    return 'rejected'\n\nfor value in [0, 1, 55, 99, 100, 101, 3.5, 'loud']:\n    a = set_volume(value)\n    b = set_volume_buggy(value)\n    line = '%r correct=%s buggy=%s' % (value, a, b)\n    if a != b:\n        line = line + ' <-- differs'\n    print(line)\n\n# جرّب: أي قيمة وحدها تكشف العيب؟ لماذا لا يستطيع ممثل الفئة 55 كشفه مهما تكرر؟\n# try: which single value exposes the bug? why can the class representative 55 never expose it?\n# جرّب: أضف 1.0 وTrue إلى القائمة — كيف يعاملهما isinstance؟\n# try: add 1.0 and True to the list — how does isinstance treat them?\n",
      prompt: {
        ar: 'نسختان من set_volume جنبا إلى جنب: الصحيحة والمكسورة الحارس. مرّر القائمة وشاهد أين يختلف السطران — علامة <-- differs. ثم أجب قبل أي تعديل: أي قيمة وحدها تكشف العيب، ولماذا يمر ممثل الفئة 55 على العيب في كل مرة؟ جرّب أيضًا قيمًا جديدة عند الحواف. لا اختبار هنا — فضولك فقط.',
        en: 'Two versions of set_volume side by side: the correct one and the one with the broken guard. Run the list and watch where the lines diverge — the <-- differs mark. Then answer before any edit: which single value exposes the bug, and why does the class representative 55 glide past it every time? Try new values at the edges too. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن درس الصندوق الأبيض: عيب level >= 100 بدل level > 100 — هل يكشفه حزام بتغطية قرارات 100%؟',
            en: 'From the white-box lesson: the defect level >= 100 instead of level > 100 — does a harness with 100% branch coverage expose it?',
          },
          options: [
            { id: 'a', text: { ar: 'نعم — التغطية الكاملة تكشف كل العيوب', en: 'Yes — full coverage exposes every defect' } },
            { id: 'b', text: { ar: 'لا — القرار يأخذ حافتيه صادقًا وكاذبًا رغم العيب؛ كشفه يحتاج قيمة حدّية من المواصفة عند 100', en: 'No — the decision still takes both edges despite the defect; exposing it needs a spec boundary value at 100' } },
            { id: 'c', text: { ar: 'لا — لأن التغطية تقيس الأداء لا الصحة', en: 'No — because coverage measures performance, not correctness' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'العيب لا يمنع القرار من سلوك الحافتين: قيم كثيرة تمر والرفض يعمل — فتغطية القرارات مكتملة والعيب ناجٍ. القيمة الحدّية 100 من المواصفة هي التي تكشفه: الكود يرفض ما قال المستند إنه صالح. لهذا يُدمج الأبيض بالأسود: التغطية تقيس أين وصل التنفيذ، والمواصفة تقول ماذا يجب أن يحدث.',
            en: 'The defect does not stop the decision from taking both edges: many values pass and rejections work — branch coverage is complete while the defect survives. The spec boundary value 100 is what exposes it: the code rejects what the document calls valid. Hence black-box meets white-box: coverage says where execution went, the spec says what should happen.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'كم فئة تكافؤ في مواصفة set_volume (صحيح 1..100 يُقبل وكل شيء آخر يُرفض)؟',
            en: 'How many equivalence classes does the set_volume spec have (integers 1..100 accepted, everything else rejected)?',
          },
          options: [
            { id: 'a', text: { ar: 'فئتان: الصالحة وغير الصالحة', en: 'Two: the valid class and the invalid one' } },
            { id: 'b', text: { ar: 'ثلاث: أقل من 1، داخل المدى، فوق 100', en: 'Three: below 1, inside the range, above 100' } },
            { id: 'c', text: { ar: 'أربع: أقل من 1، داخل المدى، فوق 100، وغير الصحيح أصلًا', en: 'Four: below 1, inside the range, above 100, and the non-integer class' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'الجدول من الدرس: C1 (< 1) يُرفض، C2 (1..100) يُقبل، C3 (> 100) يُرفض، وC4 غير الصحيح — سلسلة أو عدد عشري — يُرفض. نسيان C4 هو الغفلة الشائعة: المقارنة 1 <= "loud" ترفع TypeError بدل رفض مهذب، ولذلك يفحص النوع أولًا.',
            en: 'The lesson table: C1 (< 1) rejected, C2 (1..100) accepted, C3 (> 100) rejected, and C4 the non-integer class — a string or a float — rejected. Forgetting C4 is the common miss: 1 <= "loud" raises TypeError instead of a graceful rejection, which is why the type check comes first.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن PY4E الفصل الرابع: ما البنية التي تجعل من set_volume وحدة قابلة للاختبار الأسود بمواصفة مكتوبة؟',
            en: 'From PY4E chapter 4: which structure makes set_volume a black-box-testable unit with a written spec?',
          },
          options: [
            { id: 'a', text: { ar: 'def بمعاملات وreturn — مدخل يمرر كمعامل ونتيجة تعاد تُقارن بالمتوقع', en: 'def with parameters and return — an input passed as an argument and a returned result compared with the expected value' } },
            { id: 'b', text: { ar: 'الطباعة بـ print ثم القراءة بالعين', en: 'Printing with print and reading with an eye' } },
            { id: 'c', text: { ar: 'المتغيرات العامة المشتركة بين الدوال', en: 'Global variables shared between functions' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'العقد def/return من الفصل الرابع هو ما يفصل المدخل عن النتيجة: مرر 55 واستقبل bool تقارنه بالمواصفة آليًّا. لو كانت الدالة تطبع بدل أن تعيد، لاحتجت عينًا بشرية في كل تشغيل — عدو الأتمتة والتكرار.',
            en: 'The def/return contract from chapter 4 separates input from result: pass 55, receive a bool you compare with the spec automatically. If the function printed instead of returning, you would need a human eye on every run — the enemy of automation and repeatability.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'تقنية fuzzing ترمي البرنامج بمدخلات مشوهة بلا مواصفة ولا فئات — فما الـ oracle الضمني الوحيد لها؟',
            en: 'Fuzzing throws malformed inputs with no spec and no classes — what is its sole implicit oracle?',
          },
          options: [
            { id: 'a', text: { ar: 'مطابقة الخرج لوثيقة مرجعية لكل مدخل', en: 'Matching the output against a reference document for every input' } },
            { id: 'b', text: { ar: 'ألا ينهار البرنامج ولا يعلق — الصمود نفسه هو الحكم', en: 'That the program neither crashes nor hangs — survival itself is the verdict' } },
            { id: 'c', text: { ar: 'أن تتحسن سرعة البرنامج مع كل مدخل', en: 'That the program gets faster with every input' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الـ fuzzing عدواني الطبع: لا يتحقق من صحة الخرج بل يبحث عن المدخل المشوه الذي لم يخطر لأحد رفضه — والانهيار أو التعليق هو الفشل الوحيد المسمّى. ولهذا يستقر في اختبار الأمان ويُشغَّل ساعات في مرحلة غير معترضة من خط الإنتاج.',
            en: 'Fuzzing is adversarial: it does not verify output correctness but hunts the malformed input nobody thought to reject — a crash or hang is the only named failure. That is why it lives in security testing and runs for hours in a non-blocking pipeline stage.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'حالات للمدخلات الصالحة فقط',
          right: 'ممثل لكل فئة صالحة ولكل فئة غير صالحة: 55 و-3 و250 و"loud"',
          note: {
            ar: 'الفئة المفقودة دائمًا هي غير الصالحة: الاختبار العشوائي يقيم داخل المدى ويترك الرفض كله بلا حكم. المواصفة تعد بالرفض بقدر ما تعد بالقبول — وجدول الفئات يجعل الوعد معدودًا: فئة لكل سلوك.',
            en: 'The missing class is always the invalid one: ad-hoc testing camps inside the range and leaves every rejection unjudged. The spec promises rejection as much as acceptance — and the class table makes that promise countable: one class per behavior.',
          },
        },
        {
          wrong: 'أختبر 1 و2 و3 ثم أقفز إلى 100',
          right: 'ثلاثيات الحدود عند كل حد: 0 و1 و2 و99 و100 و101',
          note: {
            ar: 'القيم الداخلية تعيش في قلب الفئة حيث المقارنات واثقة؛ العيب يسكن عند الحافة حيث يُكتب >= بدل >. الستة الحدّية أرخص من مئة داخلية وأقدر عليها: 55 لا يكشف حارسًا خاطئًا أبدًا و100 يفضحه من أول لقاء.',
            en: 'Interior values live in the calm heart of a class where comparisons are confident; the defect lives at the edge where >= was written instead of >. Six boundary tests cost less than a hundred interior ones and see more: 55 can never expose a wrong guard, 100 shames it at first sight.',
          },
        },
        {
          wrong: 'التقسيم إلى فئات يغنينا عن الحدود',
          right: 'الاثنان معًا: ممثل داخلي لكل فئة + ثلاثيات عند كل حد',
          note: {
            ar: 'التكافؤ يرسم الخريطة والحدود تحفر فيها. حزام من الممثلين وحدهم يفوّت عيوب الحافة (قصة 100)، وحزام حدودي بلا فئات قد يفوّت سلوكًا كاملًا مثل فئة النوع C4. الدمج حفنة اختبارات تغطي كل سلوك موصوف.',
            en: 'Partitioning draws the map, boundaries dig where it matters. A representatives-only harness misses edge defects (the 100 story); a boundaries-only harness can miss a whole behavior like the type class C4. Combined, a handful of tests covers every specified behavior.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'تجزئة التكافؤ: المواصفة تفرّض فئات صالحة وغير صالحة — ممثل واحد لكل فئة يحل محل آلاف المدخلات، والفئة غير الصالحة أهم ما يغفله العشوائي.', en: 'Equivalence partitioning: the spec dictates valid and invalid classes — one representative per class replaces thousands of inputs, and the invalid class is exactly what ad-hoc testing skips.' },
        { ar: 'تحليل الحدود: العيوب تتجمع حيث تُكتب < و<= — ثلاثية below/at/above عند كل حد؛ للمدى 1..100 ستة اختبارات: 0 و1 و2 و99 و100 و101.', en: 'Boundary analysis: defects cluster where < and <= are written — a below/at/above triple per boundary; range 1..100 yields six tests: 0, 1, 2, 99, 100, 101.' },
        { ar: 'الدمج + oracle المواصفة: 4 ممثلين + 6 حدود = حفنة اختبارات ذات حكم آلي؛ وfuzzing ابن عم عدائي يتخلى عن الانتقاء وoracleه ألا يسقط البرنامج.', en: 'Combine + the spec oracle: 4 representatives + 6 boundaries = a handful of tests with an automatic verdict; fuzzing is the adversarial cousin that abandons selection, its oracle simply that the program must not fall over.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وأجب قبل أي تعديل: أي قيمة وحدها تكشف حارس 100 المكسور، ولماذا لا يستطيع 55 ذلك مهما تكرر؟ ثم أضف 1.0 وTrue إلى القائمة — كيف يعاملهما isinstance وماذا يوحي ذلك عن فئة C4؟ أخيرًا اسأل نفسك: أي oracle استخدمت حين قررت أن 100 يجب أن يُقبل — الكود أم المواصفة؟',
        en: 'Open the sandbox and answer before any edit: which single value exposes the broken 100 guard, and why can 55 never do it no matter how often repeated? Then add 1.0 and True to the list — how does isinstance treat them, and what does that suggest about class C4? Finally ask yourself: which oracle did you use when deciding 100 must be accepted — the code or the spec?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch10.s4', pages: 'ص267-269 / pp.267-269' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch10.s4', pages: 'ص267-269 / pp.267-269' },
  ],
} satisfies Lesson;

export default lesson;
