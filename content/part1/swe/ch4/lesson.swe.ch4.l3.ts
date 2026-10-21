/**
 * swe.ch4.l3 — المُرضيات ونماذج التقدير المخطَّطة / Satisfiers and Plan-Driven Estimation
 * SWE ch4: s5 Customer Satisfiers and Dissatisfiers (ص105-108 / pp.105-108) + s6 Plan-Driven Estimation Models (ص108-111 / pp.108-111)
 * Runnable design: Kano two-question classifier over fixed features (bucket counts), and Basic
 * COCOMO effort = a * kloc^b (organic 20/40 KLOC doubling factor 2.07; 35 KLOC organic vs embedded).
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch4.l3',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 4,
  title: { ar: 'المُرضيات ونماذج التقدير المخطَّطة', en: 'Satisfiers and Plan-Driven Estimation' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch4.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'مدير المنتج مسرور: "أضفنا زر التقويم بلمسة واحدة — المستخدمون سيحبونه!" وفي الزاوية، مريض حذف موعدًا بالخطأ لأن تاريخ العرض تقدم يومًا. لا أحد شكرك في حياتك على تاريخ صحيح، وسيغضب كل من رأى تاريخًا خاطئًا. القيمة ليست رقمًا واحدًا: بعض الميزات لا تكسب ثناءً لكن غيابها كارثة، وبعضها يُبهج حين يوجد ولا يُفتقد أبدًا. ومن الجهة الأخرى: حين لا تملك تاريخًا ولا سرعة قياس — عقد بثمن ثابت قبل أول سبرنت — تحتاج معادلات تقدّر الجهد من الحجم.',
        en: 'The product manager beams: "we added the one-tap calendar button — users will love it!" In the corner, a patient just deleted an appointment by mistake because the displayed date was a day ahead. Nobody in your life will ever thank you for a correct date, and everyone who sees a wrong one will be furious. Value is not one number: some features earn no praise yet their absence is a disaster; others delight when present and are never missed. And on the other side: when you have no history and no velocity — a fixed-bid contract before the first sprint — you need equations that estimate effort from size.',
      },
    },
    {
      kind: 'predict',
      code: `survey = {
    "correct-date": ("neutral", "angry"),    # feeling if present / if absent
    "calendar-btn": ("delighted", "neutral"),
    "faster-search": ("like", "dislike"),
}
for feat, (present, absent) in survey.items():
    print(feat, "->", present, "/", absent)`,
      question: {
        ar: 'ثلاث ميزات في التطبيق نفسه، وثلاثة أشكال مختلفة من ردود الفعل. أيها لن يحصد ثناء مستخدم أبدًا مهما أتقنته؟',
        en: 'Three features in the same app, three different reaction shapes. Which one will never earn a single word of user praise, however well you build it?',
      },
      reveal: {
        ar: 'correct-date: الحضور متعادل والغياب غضب — هذه Must-be (أساسية). calendar-btn إبهار حين توجد ولا افتقار حين تغيب: Delighter (مُبهجة). faster-search خط مستقيم: كلما زادت السرعة أعجبت أكثر: Performance (أحادية البعد). القيمة ثلاثة منحنيات لا خط واحد — وتخطيطك يختلف جذريًا حسب المنحنى.',
        en: 'correct-date: neutral when present, angry when absent — a Must-be. calendar-btn: delight when present, indifference when absent — a Delighter. faster-search: a straight line — the faster it gets, the more people like it: Performance. Value is three curves, not one line — and your planning differs radically by curve.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'نموذج Kano: سؤالان يصنّفان', en: 'The Kano model: two questions classify' },
      chunks: [
        {
          ar: 'في الثمانينيات تحدى Noriaki Kano افتراض أن رضا العميل يرتفع خطيًا مع كل ما تسلّمه. طريقة معرفة نوع الميزة: سؤالان عن كل واحدة — الوظيفي: "كيف تشعر لو وُجدت؟" والمعطوب: "كيف تشعر لو غابت؟". زوج الأجوبات يصنّف: متعادل مع الحضور وغاضب من الغياب = Must-be أساسية: متوقعة غير منطوقة، وجودها لا يشكر عليها أحد وغيابها يثير الاستياء الشديد — تاريخ العرض الصحيح. سعيد بالحضور متجاهل للغياب = Attractive مُبهجة: غير متوقعة ولا يعرف العملاء أن يطلبواها — زر التقويم بلمسة. وخط مستقيم: أكثر تسليمًا يساوي رضا أكبر = Performance أحادية البعد — سرعة البحث، وهي التي يقارن عليها الناس.',
          en: 'In the 1980s Noriaki Kano challenged the assumption that satisfaction rises linearly with delivery. You learn a feature\u2019s kind with two questions — the functional: "how do you feel if present?" and the dysfunctional: "how do you feel if absent?" The pair classifies it: neutral about presence but furious at absence = Must-be: expected, unspoken, never thanked, bitterly missed — the correctly displayed date. Delighted by presence, indifferent to absence = Attractive: unexpected, customers do not know to ask — the one-tap calendar button. A straight diagonal: more delivery, more satisfaction = Performance — search speed, the dimension people comparison-shop on.',
        },
        {
          ar: 'فئتان هامشيتان تُكمّلان الصورة: Indifferent — العميل لا يهتم بأي حال، وهي إنذار بجهد ضائع؛ وReverse — البعض يكرهها فعلًا: أتمتة تريح مستخدمًا تنتزع من آخر إحساسه بالسيطرة. وقاعدة التخطيط: مَوّل كل Must-be أولًا فهي ثمن دخول السباق، نافس على الـPerformance، ورُش Delighter أو اثنتين لتميّزك — لكن لا تلاحق الإبهار أبدًا بينما أساسيات مكسورة أمامه.',
          en: 'Two lesser categories complete the picture: Indifferent — customers do not care either way, a warning sign of wasted effort; and Reverse — some actively dislike it: an automation that comforts one user strips another\u2019s sense of control. The planning rule: fund every Must-be first (they are the price of admission), compete on Performance, sprinkle a Delighter or two to stand out — but never chase delighters while a must-be is still broken.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'جاذبية متلاشية ودرجات الكفاية', en: 'Decaying delight and degrees of sufficiency' },
      chunks: [
        {
          ar: 'أعمق رؤية عند Kano: الفئات تتقادم. إبهار أمس توقع اليوم، وأساسيات غدٍ. الكاميرا الأمامية في الهاتف كانت مفاجأة جذابة، ثم صارت سبيكة أداء (الميغابكسل مهمة)، واليوم غيابها عيبًا يُبلَّغ عنه. تذكيرات SMS في تطبيق العيادة على المسار نفسه: رسالة آلية كانت إبهارًا قبل عقد، واليوم غيابها شكوى — قادمت من Delighter إلى Must-be. لذلك منتجٌ يتوقف عن الابتكار يتزحلق ولو لم يغيّر شيئًا: إبهارات الأمس صارت التزامات اليوم، فعليك اكتشاف إبهارات جديدة حتى لتبقى في مكانك. تصنيف Kano لقطة لا حقيقة أبديّة — أعد الاستبيان دوريًا.',
          en: 'Kano\u2019s subtlest insight: categories decay. Yesterday\u2019s delighter is today\u2019s expectation and tomorrow\u2019s basic requirement. A front-facing phone camera was an attractive surprise, then a performance feature (megapixels mattered), and now shipping without one is a defect customers report. The clinic\u2019s SMS reminders walked the same arc: an automated text was a delighter a decade ago; today its absence generates complaints — it aged from Delighter to Must-be. So a product that stops innovating slides downhill without changing: yesterday\u2019s delighters silently become obligations, and you must keep discovering new ones just to stay in place. A Kano classification is a snapshot, not a permanent truth — re-survey periodically.',
        },
        {
          ar: 'ولكل فئة معنى مختلف لكلمة "كافٍ": للـMust-be عتبة تشبع — تاريخ صحيح صحيح، و"صحيح إضافيًا" بلا معنى؛ فالاستثمار فوقها هدر صرف لأنها تتوقف عند التعادل. والـPerformance بلا سقف صارم — استمر طالما الرضا الحدي يفوق الكلفة الحدية، وتوقف حين لا يلحظ المستخدمون الفرق. والـDelighter كلها أو لا شيء: نصف إبهار لا يُبهر أحدًا، فإما موّلها حتى تُدهش فعلًا أو لا تبدأ. هكذا يُكمل Kano تحليل value/cost: الأول يصف شكل منحنى العائد، والثاني يقرر أين تتوقف عن الإنفاق على ذلك المنحنى.',
          en: 'Each category has its own meaning of "enough": a Must-be has a threshold of sufficiency — a correct date is correct, and "extra correct" is meaningless; beyond the threshold, effort is wasted because satisfaction saturates at neutral. Performance has no hard ceiling — keep investing while marginal satisfaction exceeds marginal cost, and stop when users stop noticing. Delighters are all-or-nothing: a half-built delighter delights no one, so either fund it enough to actually thrill or do not start. Kano and value/cost complement each other: one describes the shape of the payoff curve, the other decides where on that curve to stop spending.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نماذج التقدير المخطَّطة', en: 'Plan-driven estimation models' },
      chunks: [
        {
          ar: 'النقاط والسرعة تعملان بعد تراكم تاريخ. لكن فريقًا جديدًا، أو عقدًا بثمن ثابت يجب تسميته قبل أول سبرنت؟ عقود من بيانات المشاريع تقول إن الجهد ينمو أسرع من الخطي: برنامج ضعف الحجم فيه أكثر من ضعف تفاعلات الأجزاء، وفريق ضعف الحجم فيه أكثر من ضعف قنوات التواصل (n أشخاص لديهم n(n-1)/2 قناة). تلتقط النماذج ذلك بقانون قوى: Effort = a × Size^b، بالحجم بآلاف الأسطر KLOC أو نقاط دالة. والأس b هو المفتاح: b = 1 خطي؛ والواقع بين 1.05 و1.2 — التوقيع الرياضي لـ diseconomy of scale: البرنامج الأكبر يكلف أكثر لكل سطر، عكس مصانع القطع المتطابقة حيث يرخص الوحدة الكبيرة.',
          en: 'Points and velocity work once history exists. But a brand-new team, or a fixed-bid contract that must name a cost before the first sprint? Decades of project data say effort grows faster than linearly: a program twice as big has more than twice as many interactions between parts, and a team twice as big has far more than twice as many communication channels (n people have n(n-1)/2). Models capture this with a power law: Effort = a x Size^b, size in KLOC or function points. The exponent b is the key: b = 1 is linear; real projects sit at 1.05-1.2 — the mathematical signature of diseconomy of scale: bigger software costs more per line, the opposite of identical-widget factories.',
        },
        {
          ar: 'أشهر هذه النماذج COCOMO الذي نشره Barry Boehm عام 1981. نسخته Basic تعتمد ثلاثة أوضاع: Organic (فريق صغير، مسألة مألوفة، متطلبات مستقرة): a = 2.4 وb = 1.05؛ Semi-detached (حجم متوسط، خبرة مختلطة): 3.0 و1.12؛ Embedded (قيود ضيقة وعتاد): 3.6 و1.20. الناتج شهر-شخص. تطبيق العيادة عند 20 KLOC عضوي يعطي نحو 55.8 شهر-شخص، وعند 40 نحو 115.4 — مضاعفة الحجم ضاعفت الجهد بعامل 2.07 لا 2.0، والعُشر الزائد بصمة b. ولتقويم المشروع: Time ≈ 2.5 × Effort^0.38. وتذكّر الفخ: التقدير لا يصحّ من مدخله — تخمين KLOC قبل كتابة الكود ينقل عدم اليقين من الجهد إلى الحجم ولا يزيله؛ فمثلّث بين COCOMO وDelphi والسرعة الحقيقية حين تتوفر.',
          en: 'The best-known model is COCOMO, published by Barry Boehm in 1981. Basic COCOMO uses three settings: Organic (small team, familiar problem, stable requirements): a = 2.4, b = 1.05; Semi-detached: 3.0 and 1.12; Embedded (tight constraints, hardware): 3.6 and 1.20. Effort comes out in person-months. The clinic app at 20 KLOC organic gives about 55.8 person-months; at 40 KLOC about 115.4 — doubling size raised effort by a factor of 2.07, not 2.0, the extra tenth being the fingerprint of b. Schedule follows Time = about 2.5 x Effort^0.38. Mind the pitfall: an estimate is only as good as its size input — guessing KLOC before writing code moves uncertainty from effort to size without removing it; triangulate COCOMO with Delphi and, once available, real velocity.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'COCOMO على تطبيق العيادة', en: 'COCOMO on the clinic app' },
      code: `def effort(kloc, a=2.4, b=1.05):   # Basic COCOMO, organic
    return a * kloc ** b

def schedule(effort_pm):           # calendar months
    return 2.5 * effort_pm ** 0.38

e20, e40 = effort(20), effort(40)
print(f"20 KLOC: {e20:.1f} pm, {schedule(e20):.1f} months")
print(f"40 KLOC: {e40:.1f} pm, {schedule(e40):.1f} months")
print(f"doubling factor: {e40 / e20:.2f}")`,
      explanation: {
        ar: 'الجهد 55.8 شهر-شخص عند 20 KLOC يصير 115.4 عند 40: مضاعفة الحجم كلّفت 2.07 ضعفًا — الـ7% الزائدة من الأس b = 1.05. وعلى مشروع embedded بـb = 1.20 لكانت المضاعفة 2^1.20 ≈ 2.30. ولاحظ أن الجدول الزمني لا يتضاعف كالجهد (11.5 → 15.2 شهرًا فقط) لأن إضافة موازٍ أسرع من مضاعفة الجهد الصرف. والنموذج كله دالة في حجم متخيَّل — فتعامل مع الناتج كمدخل للنقاش لا كرقم عقد.',
        en: 'Effort of 55.8 person-months at 20 KLOC becomes 115.4 at 40: doubling size cost a factor of 2.07 — the extra 7% comes from b = 1.05. On an embedded project (b = 1.20) the same doubling would cost 2^1.20 = about 2.30. Note the schedule does not double with effort (11.5 to 15.2 months only), because parallelism shrinks calendar time faster than raw effort. The whole model is a function of an imagined size — treat the output as input to a negotiation, not as a contract number.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.kano-buckets',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ست ميزات مع إجابات الاستبيان: الشعور بحضورها ثم بغيابها. أكمل دالة kano لتصنيفها (reverse إذا كان الحضور منفّرًا؛ performance إذا غيابها مُغضب والحضور مُحب؛ must_be إذا غيابها مُغضب والحضور متعادل؛ delighter إذا الحضور مُحب والغياب متعادل؛ وإلا indifferent)، ثم اطبع عدّاد كل فئة بهذا الترتيب، وأخيرًا سطر "fund first:" بأسماء الـmust_be مفصولة بفواصل.',
        en: 'Six features with survey answers: feeling if PRESENT, then if ABSENT. Complete the kano function (reverse if presence is disliked; performance if absence is disliked and presence liked; must_be if absence disliked and presence neutral; delighter if presence liked and absence neutral; else indifferent). Print each bucket count in order, then a "fund first:" line with the must_be names joined by commas.',
      },
      starterCode: `feats = [
    # (name, feeling if PRESENT, feeling if ABSENT)
    ("correct-date", "neutral", "dislike"),
    ("login-works", "neutral", "dislike"),
    ("faster-search", "like", "dislike"),
    ("calendar-btn", "like", "neutral"),
    ("spinner-anim", "neutral", "neutral"),
    ("forced-tour", "dislike", "like"),
]

def kano(present, absent):
    # TODO: reverse if present is "dislike"
    # TODO: absent "dislike" -> performance if present is "like" else must_be
    # TODO: present "like" (and absent not "dislike") -> delighter
    # TODO: otherwise indifferent
    ...

# TODO: count each category, print in order:
# must_be: N / performance: N / delighter: N / indifferent: N / reverse: N
# then: fund first: <comma-joined must_be names>`,
      solution: `feats = [
    ("correct-date", "neutral", "dislike"),
    ("login-works", "neutral", "dislike"),
    ("faster-search", "like", "dislike"),
    ("calendar-btn", "like", "neutral"),
    ("spinner-anim", "neutral", "neutral"),
    ("forced-tour", "dislike", "like"),
]

def kano(present, absent):
    if present == "dislike":
        return "reverse"
    if absent == "dislike":
        return "performance" if present == "like" else "must_be"
    if present == "like":
        return "delighter"
    return "indifferent"

counts, musts = {}, []
for name, present, absent in feats:
    cat = kano(present, absent)
    counts[cat] = counts.get(cat, 0) + 1
    if cat == "must_be":
        musts.append(name)
for cat in ("must_be", "performance", "delighter", "indifferent", "reverse"):
    print(f"{cat}: {counts.get(cat, 0)}")
print("fund first:", ",".join(musts))`,
      tests: [
        {
          id: 't1',
          name: { ar: 'أساسيتان', en: 'two must-be features' },
          code: `assert 'must_be: 2' in __learner_output__, 'expected: must_be: 2 | actual: %r' % __learner_output__`,
          expected: 'must_be: 2',
        },
        {
          id: 't2',
          name: { ar: 'المموَّلة أولًا: التاريخ وتسجيل الدخول', en: 'fund first: correct-date and login-works' },
          code: `assert 'fund first: correct-date,login-works' in __learner_output__, 'expected: fund first: correct-date,login-works | actual: %r' % __learner_output__`,
          expected: 'fund first: correct-date,login-works',
        },
        {
          id: 't3',
          name: { ar: 'مُبهجة واحدة', en: 'one delighter' },
          code: `assert 'delighter: 1' in __learner_output__, 'expected: delighter: 1 | actual: %r' % __learner_output__`,
          expected: 'delighter: 1',
        },
      ],
      hints: [
        {
          ar: 'ابدأ من الحالة الأخطر: إن كان الحضور نفسه منفّرًا فالفئة reverse مهما كان الغياب.',
          en: 'Start from the most dangerous case: if presence itself is disliked, the bucket is reverse regardless of absence.',
        },
        {
          ar: 'الغياب المُغضب يقسم الفئة بقيمة الحضور: مثل → performance، متعادل → must_be.',
          en: 'A disliked absence splits by presence: like gives performance, neutral gives must_be.',
        },
        {
          ar: 'استخدم dict للعدّ: counts[cat] = counts.get(cat, 0) + 1.',
          en: 'Use a dict for counting: counts[cat] = counts.get(cat, 0) + 1.',
        },
        {
          ar: 'قريب من الحل: اجمع أسماء الـmust_be في قائمة وأطبعها بـ ",".join(musts) بعد حلقة العدّ — المطلوب سطر "fund first: correct-date,login-works".',
          en: 'Near-solution: collect must_be names in a list and print ",".join(musts) after the counting loop — the line wanted is "fund first: correct-date,login-works".',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.effort-model',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'قُدِّر حجم التطبيق بـ35 KLOC. أكمل الكود ليحسب جهد Basic COCOMO للوضعين organic (a = 2.4، b = 1.05) وembedded (a = 3.6، b = 1.20)، ثم نسبة الجهد بينهما منسّقة بـ :.2f.',
        en: 'The app is estimated at 35 KLOC. Complete the code to compute Basic COCOMO effort for organic (a = 2.4, b = 1.05) and embedded (a = 3.6, b = 1.20), plus their effort ratio formatted with :.2f.',
      },
      starterCode: `# Basic COCOMO at 35 KLOC: organic vs embedded
KLOC = 35

# TODO: organic effort = 2.4 * KLOC ** 1.05
organic = None
# TODO: embedded effort = 3.6 * KLOC ** 1.20
embedded = None

print(f"organic: {organic:.1f} pm")
print(f"embedded: {embedded:.1f} pm")
print(f"ratio: {embedded / organic:.2f}")`,
      solution: `# Basic COCOMO at 35 KLOC: organic vs embedded
KLOC = 35

organic = 2.4 * KLOC ** 1.05
embedded = 3.6 * KLOC ** 1.20

print(f"organic: {organic:.1f} pm")
print(f"embedded: {embedded:.1f} pm")
print(f"ratio: {embedded / organic:.2f}")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'الجهد العضوي 100.3', en: 'organic effort 100.3' },
          code: `assert 'organic: 100.3 pm' in __learner_output__, 'expected: organic: 100.3 pm | actual: %r' % __learner_output__`,
          expected: 'organic: 100.3 pm',
        },
        {
          id: 't2',
          name: { ar: 'الجهد المدمج 256.6', en: 'embedded effort 256.6' },
          code: `assert 'embedded: 256.6 pm' in __learner_output__, 'expected: embedded: 256.6 pm | actual: %r' % __learner_output__`,
          expected: 'embedded: 256.6 pm',
        },
        {
          id: 't3',
          name: { ar: 'النسبة 2.56', en: 'ratio 2.56' },
          code: `assert 'ratio: 2.56' in __learner_output__, 'expected: ratio: 2.56 | actual: %r' % __learner_output__`,
          expected: 'ratio: 2.56',
        },
      ],
      hints: [
        {
          ar: 'الصيغة نفسها للوضعين؛ ما يتغير قيمتا a وb فقط: Effort = a × KLOC^b.',
          en: 'The formula is identical for both modes; only a and b change: Effort = a x KLOC^b.',
        },
        {
          ar: 'الأس بـ Python: KLOC ** 1.05 وKLOC ** 1.20 — الأقواس تسبق ** لا حاجة إليها هنا.',
          en: 'The exponent in Python: KLOC ** 1.05 and KLOC ** 1.20 — no extra parentheses needed.',
        },
        {
          ar: 'الهيكل: organic = 2.4 * KLOC ** 1.05 ثم embedded = 3.6 * KLOC ** 1.20.',
          en: 'Skeleton: organic = 2.4 * KLOC ** 1.05, then embedded = 3.6 * KLOC ** 1.20.',
        },
        {
          ar: 'قريب من الحل: النسبة = embedded / organic — ستحصل على organic: 100.3 pm وembedded: 256.6 pm وratio: 2.56؛ لاحظ كيف يضاعف الـb الأكبر الفارق.',
          en: 'Near-solution: the ratio is embedded / organic — expect organic: 100.3 pm, embedded: 256.6 pm, ratio: 2.56; note how the larger b multiplies the gap.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.kano-pair',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي زوج أجوبات على سؤالي Kano (الحضور/الغياب) يصف ميزة Must-be؟',
        en: 'Which pair of answers to Kano\u2019s two questions (present / absent) describes a Must-be feature?',
      },
      options: [
        { id: 'a', text: { ar: 'مُبهجة حين توجد، متجاهَلة حين تغيب', en: 'Delighted when present, indifferent when absent' } },
        { id: 'b', text: { ar: 'متعادل تجاه حضورها، غاضب من غيابها', en: 'Neutral about its presence, angry at its absence' } },
        { id: 'c', text: { ar: 'يعجبني وجودها، يزعجني غيابها', en: 'I like it present, it annoys me absent' } },
        { id: 'd', text: { ar: 'لا يهمني أمرها بأي حال', en: 'I do not care either way' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        {
          ar: 'طابق كل خيار مع الزوج: (أ) إبهار/تعادل، و(ج) إعجاب/انزعاج، و(د) تعادل/تعادل.',
          en: 'Match each option to its pair: (a) delighted/indifferent, (c) like/annoyed, (d) neutral/neutral.',
        },
        {
          ar: 'الـMust-be لا تُشترى حبًّا؛ تُشتدى غيابًا.',
          en: 'A must-be is not bought with love; it is felt as fury at absence.',
        },
        {
          ar: 'تذكّر أن سؤالًا واحدًا لا يكفي — الزوج هو ما يفرّز الفئات.',
          en: 'Remember a single question is not enough — the pair is what separates the categories.',
        },
        {
          ar: 'الصحيح (ب): تعادل مع الحضور وغضب من الغياب — هذه بصمة Must-be.',
          en: 'Correct: (b) — neutral about presence, angry at absence is the must-be fingerprint.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.diseconomy-fill',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: عندما يكون b أكبر من 1 في Effort = a × Size^b، فإن مضاعفة الحجم ترفع الجهد أكثر من الضعف — وهذه الخاصية تسمى diseconomy of ______.',
        en: 'Fill in the term: when b > 1 in Effort = a x Size^b, doubling size more than doubles effort — this property is called diseconomy of ______.',
      },
      answer: 'scale',
      solution: 'scale',
      hints: [
        {
          ar: 'الظاهرة عكس مصانع القطع المتطابقة: الحجم الأكبر يكلف أكثر لكل وحدة.',
          en: 'The phenomenon is the opposite of identical-widget factories: bigger costs more per unit.',
        },
        {
          ar: 'سببها التواصل والتكامل: قنوات أكثر وتفاعلات أكثر بين الأجزاء.',
          en: 'Its cause is communication and integration: more channels, more interactions between parts.',
        },
        {
          ar: 'كلمة إنجليزية واحدة تكمل العبارة الشهيرة في هندسة البرمجيات.',
          en: 'One English word completing the famous software-engineering phrase.',
        },
        {
          ar: 'العبارة كاملة: diseconomy of scale — الحجم نفسه هو ما يرفع الكلفة الحدية.',
          en: 'The full phrase: diseconomy of scale — size itself is what raises the marginal cost.',
        },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `# ملعب COCOMO: غيّر الحجم والوضع وشاهد عقوبة الحجم
# The COCOMO playground: change size and mode, watch the size penalty
MODES = {"organic": (2.4, 1.05), "semi": (3.0, 1.12), "embedded": (3.6, 1.20)}

def effort(kloc, mode="organic"):
    a, b = MODES[mode]
    return a * kloc ** b

for kloc in (10, 20, 40, 80):
    e = effort(kloc)
    print(f"{kloc:>3} KLOC organic: {e:6.1f} pm, schedule {2.5 * e ** 0.38:.1f} months")

print()
for mode, (a, b) in MODES.items():
    print(f"{mode:>9}: a={a} b={b} doubling factor at 40 KLOC: {effort(40, mode) / effort(20, mode):.2f}")

# جرّب: حجم 100 KLOC — كم شهر-شخص في كل وضع؟`,
      prompt: {
        ar: 'قارن الأوضاع الثلاثة عند نفس الحجم، وراقب كيف يتضخم معامل المضاعفة كلما زاد b. عند أي وضع تكاد مضاعفة الحجم تُكلف ثلاثة أضعاف الجهد؟',
        en: 'Compare the three modes at the same size and watch the doubling factor inflate as b grows. In which mode does doubling size come close to tripling effort?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz.ch4.l3',
      items: [
        {
          id: 'q1.ch3-kano',
          question: {
            ar: 'قابلتَ فئات Kano أول مرة في الفصل 3 أثناء الاستنباط. ما الأداة التي تميّز Must-be عن Delighter حين يتردد العملاء؟',
            en: 'You first met Kano\u2019s categories in Chapter 3 during elicitation. Which tool separates a Must-be from a Delighter when customers are unsure?',
          },
          options: [
            { id: 'a', text: { ar: 'مقياس تقدير من 10 درجات', en: 'A 1-10 rating scale' } },
            { id: 'b', text: { ar: 'زوج الأسئلة: الوظيفي (لو وُجدت؟) والمعطوب (لو غابت؟)', en: 'The question pair: functional (if present?) and dysfunctional (if absent?)' } },
            { id: 'c', text: { ar: 'ترتيب النقاط تنازليًا', en: 'Ranking by points, descending' } },
            { id: 'd', text: { ar: 'مقابلة المدير التنفيذي وحده', en: 'Interviewing the executive alone' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'سؤال واحد يخدع: زوج الحضور/الغياب هو ما يفصل "لا يُفتقده أحد" عن "غيابها كارثة" — بنية السؤالين هي مركز منهج Kano.',
            en: 'A single question misleads: the present/absent pair is what separates "never missed" from "absence is a disaster" — the two-question structure is the heart of Kano\u2019s method.',
          },
        },
        {
          id: 'q2.decay',
          question: {
            ar: 'تذكيرات SMS كانت Delighter قبل عقد وأصبحت اليوم Must-be. ماذا يعني هذا لخطة المنتج؟',
            en: 'SMS reminders were a Delighter a decade ago and are a Must-be today. What does that mean for product planning?',
          },
          options: [
            { id: 'a', text: { ar: 'لا شيء؛ الفئات صفات دائمة للميزة', en: 'Nothing; categories are permanent attributes of a feature' } },
            { id: 'b', text: { ar: 'الجاذبية تتقادم: أعد الاستبيان دوريًا وواصل اكتشاف إبهارات جديدة حتى لا تتزحلق', en: 'Attractiveness decays: re-survey periodically and keep discovering new delighters just to stay in place' } },
            { id: 'c', text: { ar: 'احذف الميزة من المنتج', en: 'Remove the feature from the product' } },
            { id: 'd', text: { ar: 'ارفع نقاطها في التقدير', en: 'Raise its story points' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'إبهار أمس توقع اليوم وأساسيات غدٍ؛ منتج بلا ابتكار يتزحلق ولو لم يتغير، فأعد تصنيف Kano كل فترة.',
            en: 'Yesterday\u2019s delighter is today\u2019s expectation and tomorrow\u2019s basic; a product without innovation slides downhill unchanged — re-run Kano periodically.',
          },
        },
        {
          id: 'q3.cocomo-b',
          question: {
            ar: 'في Effort = a × Size^b، ماذا يعني ارتفاع b من 1.05 إلى 1.20؟',
            en: 'In Effort = a x Size^b, what does raising b from 1.05 to 1.20 mean?',
          },
          options: [
            { id: 'a', text: { ar: 'مشروع أرخص لكل سطر', en: 'A cheaper project per line' } },
            { id: 'b', text: { ar: 'فريق أكبر حتمًا', en: 'A necessarily bigger team' } },
            { id: 'c', text: { ar: 'عدم اقتصاد حجم أشد: مضاعفة الحجم ترفع الجهد بعامل 2^1.2 ≈ 2.30 لا 2.07', en: 'A steeper diseconomy of scale: doubling size raises effort by 2^1.2 = about 2.30, not 2.07' } },
            { id: 'd', text: { ar: 'خطأ في معايرة النموذج', en: 'A calibration error in the model' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'الأس b هو معامل عقوبة الحجم: كلما ارتفع فوق 1 زادت كلفة كل سطر إضافي — وهذا ظاهرة مقيسة لا خلل.',
            en: 'The exponent b is the size-penalty knob: the further above 1, the more each added line costs — a measured phenomenon, not a flaw.',
          },
        },
        {
          id: 'q4.cocomo-input',
          question: {
            ar: 'ما أخطر نقطة ضعف في تقدير COCOMO؟',
            en: 'What is the most dangerous weakness of a COCOMO estimate?',
          },
          options: [
            { id: 'a', text: { ar: 'صعوبة حساب الأس العشري', en: 'The fractional exponent is hard to compute' } },
            { id: 'b', text: { ar: 'اعتماده كليًا على مدخل الحجم: KLOC المتخيَّلة قبل كتابة الكود تنقل عدم اليقين ولا تزيله', en: 'It depends entirely on the size input: KLOC guessed before writing code moves uncertainty without removing it' } },
            { id: 'c', text: { ar: 'عدم عمله إلا على مشاريع embedded', en: 'It only works on embedded projects' } },
            { id: 'd', text: { ar: 'استخدامه النقاط لا الأسطر', en: 'It uses points instead of lines' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'دقة المنازل العشرية من مدخل متخيَّل دقة زائفة؛ أفضل التنبؤات تُثلَّث من طرق تفشل بطرق مختلفة: COCOMO مع Delphi مع السرعة الحقيقية.',
            en: 'Decimal places from an imagined input are false precision; the best forecasts triangulate methods that fail differently: COCOMO with Delphi with real velocity.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'الميزة المبهجة أهم من تاريخ يظهر صحيحًا — الإبهار يبيع!',
          right: 'مَوّل الـMust-be أولًا؛ الإبهار فوق قاعدة مكسورة إهانة إضافية.',
          note: {
            ar: 'وجود الأساسيات متعادل لا يُشكر، لكن غيابها غضب يطرد المستخدم. لا تلاحق Delighter بينما تاريخ العرض يخدع الناس — أصلح ثمن الدخول أولًا.',
            en: 'A working basic feature earns neutral silence, but a broken one generates fury that drives users away. Do not chase delighters while the displayed date lies to people — fix the price of admission first.',
          },
        },
        {
          wrong: 'أتقنّا صحة التاريخ — فلنستثمر أكثر لنجعله "صحيحًا إضافيًا".',
          right: 'الـMust-be تشبع عند العتبة: كافٍ يعني كافيًا.',
          note: {
            ar: 'فوق عتبة الكفاية كل جهد إضافي في الأساسيات هدر صرف. أما الـPerformance فقرارها اقتصادي: استمر طالما الرضا الحدي يفوق الكلفة الحدية.',
            en: 'Beyond the sufficiency threshold, extra effort on basics is pure waste. Performance is the economic decision: keep going only while marginal satisfaction exceeds marginal cost.',
          },
        },
        {
          wrong: 'COCOMO قال 55.8 شهر-شخص — هذا الرقم النهائي، اكتبه في العقد.',
          right: 'النموذج دالة في حجم متخيَّل؛ مثلّثه مع Delphi والسرعة الحقيقية.',
          note: {
            ar: 'تخمين KLOC قبل كتابة الكود دفع عدم اليقين من الجهد إلى الحجم. أضف نطاقًا لا رقمًا، وقارن الطرق الثلاث، ودرس أين تختلف — الخلاف إشارة تعلّم.',
            en: 'Guessing KLOC before writing code pushed uncertainty from effort to size. Give a range, cross-check the three methods, and study where they disagree — disagreement is a signal to go learn more.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'سؤالا Kano — لو وُجدت؟ لو غابت؟ — يفرزان Must-be وPerformance وDelighter، وفئتَي Indifferent وReverse تُكمِلان الصورة.',
          en: 'Kano\u2019s two questions — if present? if absent? — sort features into Must-be, Performance, and Delighter, with Indifferent and Reverse completing the picture.',
        },
        {
          ar: 'مَوّل الأساسيات أولًا، ونافس على الأداء، ورُش الإبهار — والجاذبية تتقادم: أعد الاستبيان.',
          en: 'Fund must-bes first, compete on performance, sprinkle delighters — and attractiveness decays: re-survey periodically.',
        },
        {
          ar: 'الجهد ينمو بقانون قوى: Effort = a × Size^b؛ وb > 1 يعني أن الحجم الأكبر يكلف أكثر لكل سطر (diseconomy of scale).',
          en: 'Effort follows a power law: Effort = a x Size^b; b > 1 means bigger software costs more per line (diseconomy of scale).',
        },
        {
          ar: 'COCOMO organic: 20 KLOC ≈ 55.8 شهر-شخص ومضاعفة الحجم عامل 2.07؛ الجدول الزمني ≈ 2.5 × Effort^0.38.',
          en: 'COCOMO organic: 20 KLOC = about 55.8 person-months, doubling factor 2.07; schedule = about 2.5 x Effort^0.38.',
        },
        {
          ar: 'لا نموذج وحده يكفي: مثلّث النماذج وراقب أين تختلف — فالخلاف إشارة إلى تعلّم أكثر.',
          en: 'No single model suffices: triangulate and watch where they disagree — that disagreement is a signal to learn more.',
        },
      ],
      reflectPrompt: {
        ar: 'ما الميزة التي قابلتها يومًا Delighter وصارت اليوم Must-be في منتجاتك؟ وما الميزة التي تنفق عليها فوق عتبة الكفاية؟',
        en: 'Which feature did you once see as a Delighter and is now a Must-be in your products? And where are you spending past the threshold of sufficiency?',
      },
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch4.s5', pages: 'ص105-108 / pp.105-108' },
    { book: 'SWE', section: 'swe.ch4.s6', pages: 'ص108-111 / pp.108-111' },
  ],
} satisfies Lesson;

export default lesson;
