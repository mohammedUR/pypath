/**
 * swe.ch4.l1 — قوائم الفحص والتقدير النسبي / Checklists and Relative Estimation
 * SWE ch4: s1 A Checklist Approach (ص96-97 / pp.96-97) + s2 Relative Estimation: Iteration Planning (ص97-100 / pp.97-100)
 * Runnable design: checklist-gated greedy iteration plan over a fixed story-point table (velocity 8),
 * plus a velocity forecast from a fixed three-sprint history (22/18/26, backlog 130).
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch4.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 4,
  title: { ar: 'قوائم الفحص والتقدير النسبي', en: 'Checklists and Relative Estimation' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch3.l5'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'الاثنين صباحًا. السبورة البيضاء عليها أربعون متطلبًا لتطبيق عيادة الأسنان، وستة أشخاص يريد كلٌّ منهم مطلبه أولًا، والراعي يسأل السؤال الذي لا تملك جوابه بعد: متى ينتهي العمل، وكم سيكلّف؟ التخمين الصريح يبدو غير أمين، ورفض الإجابة يبدو غير مهني. الفجوة بينهما يملؤها هذا الفصل: قائمة فحص تجعل كل متطلب قابلًا للقياس، ونقاط قصة تقارن الأحجام، وسرعة مقياسة تحوّل كومة الأمنيات إلى خطة يمكن الدفاع عنها.',
        en: "Monday morning. The whiteboard holds forty requirements for the dental clinic app, six people each insisting theirs comes first, and the sponsor asks the question you cannot answer yet: when will it be done, and what will it cost? Guessing feels dishonest; refusing to answer feels unprofessional. This chapter fills that gap: a checklist that makes each requirement measurable, story points that compare sizes, and a measured velocity that turns a pile of wishes into a defensible plan.",
      },
    },
    {
      kind: 'predict',
      code: `hours = {"noor": [4, 10, 2], "sami": [6, 15, 3], "layla": [8, 20, 4]}
for name, h in hours.items():
    print(f"{name}: hours={h} B/A = {h[1]/h[0]} C/A = {h[2]/h[0]}")`,
      question: {
        ar: 'ثلاثة مُقدِّرين قدّروا ثلاث مهام بالساعات المطلقة. انظر إلى تشتت الساعات، ثم إلى النسب بين المهام عند كل شخص. من يتفق مع من فعلًا؟',
        en: 'Three estimators sized three tasks in absolute hours. Look at how widely the hours scatter, then at the ratios between tasks for each person. Who actually agrees with whom?',
      },
      reveal: {
        ar: 'الساعات المطلقة تتباعد بعنف (نور تقضي ضعف وقت ليلى تقريبًا)، لكن النسب متطابقة عند الجميع تمامًا: B ضعفان ونصف A، وC نصف A. البشر سيئون في الأعداد المطلقة وممتازون في الأحكام النسبية — وهذا بالضبط سرُّ story points التي ستقابلها بعد قليل.',
        en: 'Absolute hours scatter wildly (Noor spends nearly twice Layla\u2019s time), yet the ratios are identical for everyone: B is 2.5x A, C is 0.5x A. Humans are bad at absolute quantities and surprisingly good at relative judgments — that is exactly the secret behind story points.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'قائمة الفحص قبل التقدير', en: 'The checklist before the estimate' },
      chunks: [
        {
          ar: 'أبسط تقنيات تحليل المتطلبات وأكثرها إهمالًا: قبل أن تقدّر أي شيء أو تبنيه، امسحه على قائمة أسئلة تعلّمتها بالطريقة الصعبة. من طلبه ومن يتأثر به؟ ما الهدف الذي يخدمه؟ كيف سنعرف أنه نجح — ما اختبار القبول؟ على أي شيء يعتمد؟ وما الذي قد يخرج عن السيطرة: خصوصية، أداء، حالات حدّية؟ الجرّاحون وطيّار الطائرات يعتمدون قوائمهم للسبب نفسه: ليست الخطوات صعبة، بل تخطّي واحدة منها سهل ومكلف. القائمة تحوّل الخبرة المكتسبة إلى إجراء يستطيع شخص متعب في الرابعة عصرًا اتباعه دون بطولة.',
          en: 'The simplest analysis technique and the most underrated: before estimating or building anything, walk the requirement against a list of questions you learned the hard way. Who asked for it, and who else is affected? What underlying goal does it serve? How will we know it works — what is the acceptance test? What does it depend on? What could go wrong: privacy, performance, edge cases? Surgeons and pilots rely on checklists for the same reason: the steps are not hard, but skipping one is easy and expensive. A checklist turns hard-won experience into a procedure a tired person can follow at 4 p.m. without heroics.',
        },
        {
          ar: 'المبدأ الحاكم: المتطلب الذي لا يمكنك اختباره لا يمكنك تقديره، لأنك لا تعرف بعد ماذا تعني كلمة "انتهى". والعائد مزدوج. أولًا: القائمة تكشف العمل المخفي مبكرًا — ميزة "تذكيرات SMS الصغيرة" تتطلب علم موافقة المريض، فحقلًا في قاعدة البيانات، فترحيلًا، فمراجعة خصوصية. ثانيًا: تجعل التقديرات قابلة للمقارنة، لأن كل القصص مرّت على الأسئلة نفسها فتُقاس مثل بمثل. اجعل قائمتك قصيرة (خمسة إلى عشرة أسئلة)، خاصةً بمجالك، وحيّة: كل مفاجأة قاسية في الـ retrospective مرشّحة لسطر جديد فيها.',
          en: 'Governing principle: a requirement you cannot test you cannot estimate, because you do not yet know what "done" means. The payoff is twofold. First, the checklist surfaces hidden work early — the "small" SMS-reminder feature secretly needs a patient-consent flag, a database column, a migration, and a privacy review. Second, it makes estimates comparable, because every story faced the same questions and you are sizing like-for-like. Keep the checklist short (five to ten questions), specific to your domain, and living: every nasty surprise in a retrospective is a candidate for a new line.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نقاط القصة: حجم لا زمن', en: 'Story points: size, not time' },
      chunks: [
        {
          ar: 'اسأل "كم ساعة تستغرق؟" وتتفشّى الأجوبة؛ اسأل "أي هذه أكبر، وكم ضعفًا؟" ويصطف الناس فورًا. نقطة القصة وحدة حجم نسبي لا وقت: قصة 5 نقاط تعني أنها نحو ضعفين ونصف عمل قصة نقطتين — جهدًا وتعقيدًا وعدم يقينٍ معًا. النقاط تُسحب من سلم متباعد مثل 1، 2، 3، 5، 8، 13: الفجوات مقصودة، فلا أحد يستطيع بصدق التمييز بين 21 و22، والسلم يرفض تقديم هذا الخيار الزائف. وقصة تبدو 20 غالبًا أكبر من أن تُخطَّط بثقة ويجب تقسيمها إلى قصص تفهمها أفضل.',
          en: 'Ask "how many hours?" and the answers scatter; ask "which is bigger, and by how much?" and people line up. A story point is a unit of relative size, not time: a 5-point story is about two-and-a-half times the work of a 2-point one — effort, complexity, and uncertainty together. Points come from a deliberately gapped scale like 1, 2, 3, 5, 8, 13: nobody can honestly tell a 21 from a 22, so the scale refuses to offer that false choice. And a story that looks like a 20 is probably too big to plan confidently and should be split.',
        },
        {
          ar: 'كيف تُعاير النقاط؟ بقصة مرجعية: عنصر صغير مفهوم يتفق الفريق كله على تسميته "2" — كل تقدير بعده سؤال نسبي: أكبر أم أصغر من المرجع، وكم ضعفًا؟ لهذا النقاط عملة داخلية للفريق لا ثابت عالمي: خمسة نقاط عند فريق لا تساوي خمسة عند آخر، ولا بأس. وقد تعرف ما حلّت النقاط محله: التقدير القاعدي بالأيام المثالية يحمل دقة زائفة، ويتجاهل المقاطعات، وكل رقم أيام هو مرساة (anchor) تتحول إلى وعد لحظة يسمعها المدير.',
          en: 'How are points calibrated? Against a reference story: a small, well-understood item the whole team agrees to call "2" — every other estimate is the relative question: bigger or smaller than the reference, by how much? That is why points are an internal team currency, not an industry constant: a 5 on one team is not a 5 on another, and that is fine. Know what points replaced too: bottom-up ideal-day estimates carry false precision, ignore interruptions, and every number in days is an anchor that hardens into a commitment the moment a manager hears it.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'السرعة: من الحجم إلى التنبؤ', en: 'Velocity: from size to forecast' },
      chunks: [
        {
          ar: 'تصبح النقاط أداة تنبؤ لحظة أن تقيس velocity: عدد النقاط التي أنجزها الفريق فعليًا في تكرار واحد (سبرنت). والسرعة تُقاس لا تُمرَّر: أنهِ السبرنت، اجمع نقاط القصص التي بلغت تعريف الإنجاز، فذلك رقمك. القصة المكتملة 90% تساوي صفرًا — العمل غير المنجز لم يبلغ تعريف الإنجاز وقد لا يقدم قيمة قابلة للاستخدام، ولا يمكنك إيداع نقطة جزئية. ولأن السبرنت الواحد صاخب (مرض، انقطاع API)، نعالجه بمتوسط متحرك: سبرنتات أغلقت بـ22 ثم 18 ثم 26 نقطة تعطي متوسط 22 نقطة لكل سبرنت.',
          en: 'Points become a forecasting tool the moment you measure velocity: the points a team actually completes in one iteration (sprint). Velocity is measured, not decreed: close the sprint, sum the points of stories that met the definition of done, and that sum is your number. A story 90% done counts zero — unfinished work has not met the definition of done and may not deliver usable value; you cannot bank a partial point. Because a single sprint is noisy (illness, an API outage), smooth it: sprints closing at 22, 18, and 26 points average 22 points per sprint.',
        },
        {
          ar: 'والآن تنبأ: قائمة أعمال متبقية بـ130 نقطة عند سرعة 22 تعني 130 ÷ 22 ≈ 5.9، أي 6 سبرنتات = 12 أسبوعًا. وقدّم نطاقًا صادقًا لا رقمًا واحدًا: بالأسرع (26) نحو 5 سبرنتات، وبالأبطأ (18) نحو 8 — "10 إلى 16 أسبوعًا، والأرجح 12". مع اكتمال كل سبرنت تتراكم البيانات، يضيق النطاق، ويحدث التنبؤ. خلاصة التقدير في جملة: خطط بما تعرفه الآن، وأعد التخطيط كل تكرار بينما يصحّحك الواقع.',
          en: 'Now forecast: a backlog of 130 points at a velocity of 22 means 130 / 22 = about 5.9, so 6 sprints = 12 weeks. Give an honest range, not one number: at your fastest (26) about 5 sprints, at your slowest (18) about 8 — "10 to 16 weeks, most likely 12". As sprints complete, velocity data accumulates, the range narrows, and the forecast sharpens. Estimation in one sentence: plan with what you know now, and re-plan every iteration as reality corrects you.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'من قائمة الفحص إلى خطة تكرارات', en: 'From checklist to an iteration plan' },
      code: `stories = [
    # (id, passed the checklist?, points)
    ("S1", True, 2),   # read-only schedule (reference story)
    ("S2", True, 5),   # booking + conflict detection
    ("S3", False, 8),  # SMS reminders: no acceptance test yet
    ("S4", True, 3),   # PDF export
]
VELOCITY = 8  # points this team completes per iteration

plan, it, used, picked = [], 1, 0, []
for sid, ready, pts in stories:
    if not ready:
        print(f"{sid}: blocked - pass the checklist first")
        continue
    if used + pts > VELOCITY:
        plan.append((it, " ".join(picked), used))
        it, picked, used = it + 1, [], 0
    picked.append(sid)
    used += pts
plan.append((it, " ".join(picked), used))
for i, ids, pts in plan:
    print(f"iter{i}: {ids} ({pts} pts)")`,
      explanation: {
        ar: 'قصة SMS لم تجتز القائمة (لا اختبار قبول حتى الآن)، فتُرحَّل بدل أن تُقدَّر على عجل — المتطلب الذي لا يُختبر لا يُقدَّر. البقية تُحزم جشعيًا بترتيبها ضمن سعة 8 نقاط: التكرار الأول يحمل S1 وS2 (7 نقاط) ولا يتسع لـS4، فتبدأ تكرارًا ثانيًا (3 نقاط). لاحظ السلسلة كاملة: نقاط من مقارنة نسبية بقصة مرجعية، وسرعة هي التي حوّلتها إلى خطة تكرارات محددة.',
        en: 'The SMS story failed the checklist (no acceptance test yet), so it is deferred rather than estimated in a hurry — a requirement you cannot test you cannot estimate. The rest are packed greedily in order within a capacity of 8 points: iteration one carries S1 and S2 (7 pts) and cannot fit S4, so a second iteration opens (3 pts). Notice the whole chain: points from relative comparison against a reference story, and a measured velocity that turns them into a concrete iteration plan.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.velocity-forecast',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'آخر ثلاثة سبرنتات أغلقها فريقك بـ22 و18 و26 نقطة، وباقي قائمة الأعمال المتراكمة 130 نقطة، وكل سبرنت أسبوعان. أكمل الكود ليطبع ثلاثة أسطر: السرعة، التنبؤ الأرجح (قرّب لأعلى بـ math.ceil)، والنطاق من الأسرع إلى الأبطأ.',
        en: 'Your last three sprints closed at 22, 18, and 26 points; the remaining backlog totals 130 points; a sprint is two weeks. Complete the code so it prints three lines: velocity, the most-likely forecast (round UP with math.ceil), and the range from fastest to slowest.',
      },
      starterCode: `import math

sprints = [22, 18, 26]   # completed points in the last three sprints
backlog = 130            # remaining points

# TODO: average velocity
avg = None
# TODO: fastest and slowest recent sprints
fast = None
slow = None
# TODO: sprints remaining, rounded UP (math.ceil)
most = None
opt = None
pes = None

print(f"velocity: {avg:.0f} pts per sprint")
print(f"most likely: {most} sprints = {most * 2} weeks")
print(f"range: {opt} to {pes} sprints")`,
      solution: `import math

sprints = [22, 18, 26]   # completed points in the last three sprints
backlog = 130            # remaining points

avg = sum(sprints) / len(sprints)
fast, slow = max(sprints), min(sprints)

most = math.ceil(backlog / avg)
opt = math.ceil(backlog / fast)
pes = math.ceil(backlog / slow)

print(f"velocity: {avg:.0f} pts per sprint")
print(f"most likely: {most} sprints = {most * 2} weeks")
print(f"range: {opt} to {pes} sprints")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'السرعة 22 نقطة', en: 'velocity is 22 points' },
          code: `assert 'velocity: 22 pts per sprint' in __learner_output__, 'expected: velocity: 22 pts per sprint | actual: %r' % __learner_output__`,
          expected: 'velocity: 22 pts per sprint',
        },
        {
          id: 't2',
          name: { ar: 'الأرجح 6 سبرنتات = 12 أسبوعًا', en: 'most likely 6 sprints = 12 weeks' },
          code: `assert 'most likely: 6 sprints = 12 weeks' in __learner_output__, 'expected: most likely: 6 sprints = 12 weeks | actual: %r' % __learner_output__`,
          expected: 'most likely: 6 sprints = 12 weeks',
        },
        {
          id: 't3',
          name: { ar: 'النطاق من 5 إلى 8', en: 'range 5 to 8' },
          code: `assert 'range: 5 to 8 sprints' in __learner_output__, 'expected: range: 5 to 8 sprints | actual: %r' % __learner_output__`,
          expected: 'range: 5 to 8 sprints',
        },
      ],
      hints: [
        {
          ar: 'السرعة = مجموع نقاط السبرنتات ÷ عددها. وللتنبؤ قرّب لأعلى دائمًا: math.ceil لا round.',
          en: 'Velocity = total sprint points divided by the number of sprints. And always round forecasts UP: math.ceil, not round.',
        },
        {
          ar: 'الأرجح = backlog ÷ متوسط السرعة. أما النطاق فيستخدم أسرع سبرنت (متفائل) وأبطأه (متشائم).',
          en: 'Most likely = backlog / average velocity. The range uses your fastest sprint (optimistic) and your slowest (pessimistic).',
        },
        {
          ar: 'الهيكل: avg = sum(sprints) / len(sprints) ثم most = math.ceil(backlog / avg).',
          en: 'Skeleton: avg = sum(sprints) / len(sprints), then most = math.ceil(backlog / avg).',
        },
        {
          ar: 'قريب من الحل: fast, slow = max(sprints), min(sprints)؛ opt = math.ceil(backlog / fast)؛ pes = math.ceil(backlog / slow). وتوقع 130 ÷ 26 = 5.0 بالضبط، وceil يعيدها 5.',
          en: 'Near-solution: fast, slow = max(sprints), min(sprints); opt = math.ceil(backlog / fast); pes = math.ceil(backlog / slow). Note 130 / 26 = 5.0 exactly, and ceil keeps it 5.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.points-vs-days',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'قال زميل في الاجتماع: "لنجعل نقطة القصة تساوي يوم عمل واحد، ف5 نقاط = 5 أيام، ونكون دقيقين". لماذا هذا يقوّض فكرة النقاط من أساسها؟',
        en: 'A teammate says: "Let\u2019s make one story point equal one day of work, so 5 points = 5 days — nice and precise." Why does this undermine the whole idea of points?',
      },
      options: [
        {
          id: 'a',
          text: {
            ar: 'لأن النقاط يجب أن تُسحب من سلم فيبوناتشي فقط، والخمسة أيام ليست رقم فيبوناتشي',
            en: 'Because points must come only from the Fibonacci scale, and five days is not a Fibonacci number',
          },
        },
        {
          id: 'b',
          text: {
            ar: 'لأن يوم العمل رقم مطلق يحمل دقة زائفة، وكل رقم أيام مرساة تتحول إلى وعد ملزم لحظة يسمعها المدير',
            en: 'Because a workday is an absolute number carrying false precision, and any number of days is an anchor that hardens into a binding promise the moment a manager hears it',
          },
        },
        {
          id: 'c',
          text: {
            ar: 'لأن الأيام لا تصلح إلا للمشاريع المدمجة embedded',
            en: 'Because days only work for embedded projects',
          },
        },
        {
          id: 'd',
          text: {
            ar: 'لأن النقاط تقيس تعقيد الكود وحده لا الجهد',
            en: 'Because points measure code complexity alone, not effort',
          },
        },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        {
          ar: 'تذكّر ما تحميه النقاط عمدًا: الساعات مخفية ليس تقصيرًا بل حماية.',
          en: 'Remember what points deliberately protect: the hours are hidden on purpose, not by neglect.',
        },
        {
          ar: 'نقطة القصة حجم نسبي مقارنة بقصة مرجعية؛ اليوم وحدة مطلقة مرتبطة بالساعة.',
          en: 'A story point is relative size against a reference story; a day is an absolute unit tied to the clock.',
        },
        {
          ar: 'ميّز بين "تقدير" و"التزام": الأرقام الزمنية تُسمع كوعود.',
          en: 'Distinguish an estimate from a commitment: time numbers get heard as promises.',
        },
        {
          ar: 'الخيار الصحيح يجمع عيبين في اختيار واحد: الدقة الزائفة والمرساة.',
          en: 'The right option combines two harms in one choice: false precision and anchoring.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.points-trace',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود بتمعّن: dict يُكرَّر بترتيب الإدراج، وmax مع key=points.get يعيد المفتاح صاحب أكبر قيمة. ما الناتج المطبوع بالضبط؟',
        en: 'Read the code carefully: a dict iterates in insertion order, and max with key=points.get returns the key with the largest value. What exactly gets printed?',
      },
      code: `points = {"schedule": 2, "booking": 5, "reminders": 8}
total = sum(points.values())
print("total:", total)
print("biggest:", max(points, key=points.get))`,
      answer: 'total: 15\nbiggest: reminders',
      solution: 'total: 15\nbiggest: reminders',
      hints: [
        {
          ar: 'احسب مجموع القيم أولًا: 2 + 5 + 8.',
          en: 'Compute the sum of values first: 2 + 5 + 8.',
        },
        {
          ar: 'max يعيد العنصر نفسه بعد الترتيب — هنا المفتاح نفسه، لا القيمة.',
          en: 'max returns the element itself after ranking — here the key itself, not the value.',
        },
        {
          ar: 'print مع فاصلتين يفصل بفراغ واحد: "total: 15".',
          en: 'print with two arguments joins with a single space: "total: 15".',
        },
        {
          ar: 'قريب من الحل: السطر الأول total: 15 والثاني biggest: reminders — لأن reminders أكبر قيمة (8).',
          en: 'Near-solution: line one is total: 15, line two is biggest: reminders — reminders holds the largest value (8).',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.velocity-fill',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: عدد النقاط التي أنجزها الفريق فعليًا في تكرار واحد (سبرنت) — بعد احتساب القصص التي بلغت تعريف الإنجاز فقط — يسمى ______.',
        en: 'Fill in the term: the number of points a team actually completes in one iteration (sprint) — counting only stories that met the definition of done — is called ______.',
      },
      answer: 'velocity',
      solution: 'velocity',
      hints: [
        {
          ar: 'إنها تُقاس لا تُمرَّر.',
          en: 'It is measured, not decreed.',
        },
        {
          ar: 'هي الجسر بين نقاط الحجم وتوقعات الزمن.',
          en: 'It is the bridge between size points and time forecasts.',
        },
        {
          ar: 'كلمة إنجليزية واحدة من مفردات الفريق الرشيق.',
          en: 'One English word from the agile vocabulary.',
        },
        {
          ar: 'تبدأ بحرف v وتعني سرعة — velocity.',
          en: 'It starts with v and means speed — velocity.',
        },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `# مدرج خطة التكرار — عدّل القصص والسرعة وشاهد الخطة تتغير
# The iteration planner — edit stories and velocity, watch the plan shift
stories = [
    ("S1", True, 2), ("S2", True, 5),
    ("S3", True, 8), ("S4", True, 3),
]
VELOCITY = 10

plan, it, used, picked = [], 1, 0, []
for sid, ready, pts in stories:
    if used + pts > VELOCITY:
        plan.append((it, " ".join(picked), used))
        it, picked, used = it + 1, [], 0
    picked.append(sid)
    used += pts
plan.append((it, " ".join(picked), used))
for i, ids, pts in plan:
    print(f"iter{i}: {ids} ({pts} pts)")

# جرّب: اجعل VELOCITY = 8، أو اجعل قصة واحدة غير جاهزة وراقب كيف تُرحَّل`,
      prompt: {
        ar: 'العب بالمخطِّط: غيّر السرعة بين 6 و8 و10 و13، وأطفئ قصة بجعلها False، ولاحظ كيف تتوزع القصص على التكرارات. متى تحتاج الخطة إلى ثلاثة تكرارات؟',
        en: 'Play with the planner: change velocity between 6, 8, 10, and 13, and switch a story off by making it False; watch how stories spread across iterations. When does the plan need three iterations?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz.ch4.l1',
      items: [
        {
          id: 'q1.ch3-link',
          question: {
            ar: 'القصص الأربع التي مررناها على قائمة الفحص ثم قدّرناها بالنقاط — من أي مخرج للفصل 3 جاءت أصلًا؟',
            en: 'The four stories we ran through the checklist and then sized in points — which Chapter 3 artifact did they come from?',
          },
          options: [
            { id: 'a', text: { ar: 'حالات الاستخدام المفصلة بالتدفقات', en: 'Fully detailed use cases with flows' } },
            { id: 'b', text: { ar: 'قصص المستخدم وقائمة الأعمال المتراكمة الناتجة عن الاستنباط', en: 'User stories and the backlog produced by elicitation' } },
            { id: 'c', text: { ar: 'مصفوفة تتبع المتطلبات', en: 'The requirements traceability matrix' } },
            { id: 'd', text: { ar: 'وثيقة SRS الرسمية المعتمدة', en: 'The approved formal SRS document' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الاستنباط في الفصل 3 أنتج قصص مستخدم وقائمة أعمال متراكمة؛ والفصل 4 يحوّل هذه المادة الخام إلى خطة: فحص، تقدير، أولويات.',
            en: 'Chapter 3 elicitation produced user stories and a backlog; Chapter 4 turns that raw material into a plan: check, estimate, prioritize.',
          },
        },
        {
          id: 'q2.checklist',
          question: {
            ar: 'متى تكون القصة جاهزة للتقدير بثقة؟',
            en: 'When is a story ready to be estimated with confidence?',
          },
          options: [
            { id: 'a', text: { ar: 'عندما يوافق عليها مدير المشروع', en: 'When the project manager approves it' } },
            { id: 'b', text: { ar: 'عندما يكون لها اختبار قبول وتبدو صغيرة ومفهومة', en: 'When it has an acceptance test and looks small and well understood' } },
            { id: 'c', text: { ar: 'عندما تُقدَّر 5 نقاط بالضبط', en: 'When it is estimated at exactly 5 points' } },
            { id: 'd', text: { ar: 'عندما يكتبها صاحب المنتج بنفسه', en: 'When the product owner writes it personally' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'المتطلب الذي لا يُختبر لا يُقدَّر — بلا معيار قبول أنت لا تعرف ماذا يعني "انتهى"، فأي رقم توضعه أمل لا تقدير.',
            en: 'A requirement you cannot test you cannot estimate — without an acceptance criterion you do not know what "done" means, so any number is hope, not estimation.',
          },
        },
        {
          id: 'q3.points-meaning',
          question: {
            ar: 'ماذا يعني قول الفريق: "هذه 5 نقاط وهذه نقطتان"؟',
            en: 'What does a team mean by "this one is 5 points, that one is 2"?',
          },
          options: [
            { id: 'a', text: { ar: 'الأولى نحو ضعفين ونصف العمل — جهدًا وتعقيدًا وعدم يقين معًا', en: 'The first is about 2.5x the work — effort, complexity, and uncertainty together' } },
            { id: 'b', text: { ar: 'الأولى تستغرق 5 أيام بدقة والأخرى يومين', en: 'The first takes exactly 5 days and the other 2 days' } },
            { id: 'c', text: { ar: 'الأولى أهم تجاريًا من الثانية', en: 'The first matters more to the business than the second' } },
            { id: 'd', text: { ar: 'الأولى تحتاج خمسة أشخاص بالتوازي', en: 'The first needs five people working in parallel' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'النقاط حجم نسبي على سلم متباعد بقياس قصة مرجعية — لا ساعات ولا أولويات ولا عدد أشخاص.',
            en: 'Points are relative size on a gapped scale calibrated to a reference story — not hours, not priority, not headcount.',
          },
        },
        {
          id: 'q4.partial-zero',
          question: {
            ar: 'قصة 13 نقطة اكتمل 90% منها بنهاية السبرنت، ويطالب زميلك باحتساب 11 نقطة منها في السرعة. ما الصواب؟',
            en: 'A 13-point story is 90% done at sprint end, and a teammate wants 11 of its points counted into velocity. What is correct?',
          },
          options: [
            { id: 'a', text: { ar: 'احسب 11 — قريب من الواقع', en: 'Count 11 — it is close to reality' } },
            { id: 'b', text: { ar: 'احسب 13 — الجهد أُنفق فعلًا', en: 'Count 13 — the effort was really spent' } },
            { id: 'c', text: { ar: 'احسب صفرًا — العمل الذي لم يبلغ تعريف الإنجاز لا يودَع', en: 'Count zero — work below the definition of done cannot be banked' } },
            { id: 'd', text: { ar: 'احسب نصفها كحل وسط', en: 'Count half, as a compromise' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'السرعة تحتسب القصص المكتملة فقط: 90% منجزة تساوي 0، لأن العمل الجزئي قد لا يقدم قيمة قابلة للاستخدام، وبدعم النقاط الجزئية يتضخم التنبؤ كذبًا.',
            en: 'Velocity counts completed stories only: 90% done counts 0, because partial work may not deliver usable value and banking partial points corrupts the forecast.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'نقطة = يوم عمل واحد، ونقدّر بالساعات مباشرة أكثر دقة.',
          right: 'النقاط حجم نسبي، والسرعة المقياسة هي الجسر الوحيد إلى الزمن.',
          note: {
            ar: 'الأيام المطلقة تحمل دقة زائفة، وكل رقم أيام مرساة (anchor) تتحول إلى وعد لحظة يسمعها المدير. النقاط تخفي الساعات عمدًا — فدع السرعة تتكلم عن الزمن بدلًا منك.',
            en: 'Absolute days carry false precision, and every number of days is an anchor that hardens into a promise the moment a manager hears it. Points hide the hours on purpose — let velocity do the time talk for you.',
          },
        },
        {
          wrong: 'سرعتنا 22، فلنستهدف 30 الشهر القادم لرفع الإنتاجية!',
          right: 'السرعة مقياس تخطيط لا هدف أداء.',
          note: {
            ar: 'مجرد مكافأة ارتفاع السرعة يضخّم التقديرات — قصة 3 تصبح 5 بهدوء — ويفقد الرقم معناه. النقاط مسطرة قياس؛ لا ترشو أحدًا لتبليغ بوصات أطول.',
            en: 'The moment velocity becomes a rewarded target, teams inflate estimates — a 3 quietly becomes a 5 — and the number stops meaning anything. Points are a ruler; do not bribe people to report longer inches.',
          },
        },
        {
          wrong: '"التطبيق يجب أن يكون سريعًا" — نقدّرها 3 نقاط ونمضي.',
          right: 'قصة بلا اختبار قبول لا تُقدَّر؛ مرّها على قائمة الفحص أولًا.',
          note: {
            ar: '"سريعًا" أمل لا متطلب. اجعلها "البحث يعيد النتائج في أقل من ثانيتين لألف سجل" — عندها فقط يصبح للرقم معنى ولهذا العمل نهاية معروفة.',
            en: '"Fast" is a hope, not a requirement. Make it "search returns results in under 2 seconds for 1,000 records" — only then does a number mean something and does the work have a known finish line.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'قائمة الفحص تحوّل الخبرة إلى إجراء: هدف، اختبار قبول، تبعيات، مخاطر — لا اختبار فلا تقدير.',
          en: 'A checklist turns experience into procedure: goal, acceptance test, dependencies, risks — no test, no estimate.',
        },
        {
          ar: 'نقاط القصة حجم نسبي على سلم متباعد بقياس قصة مرجعية؛ الساعات المطلقة فخ دقة زائفة ومراسي.',
          en: 'Story points are relative size on a gapped scale calibrated to a reference; absolute hours are a trap of false precision and anchors.',
        },
        {
          ar: 'السرعة المقياسة تحوّل النقاط إلى تنبؤ: 130 ÷ 22 ≈ 6 سبرنتات — وقدّم نطاقًا لا رقمًا واحدًا.',
          en: 'Measured velocity turns points into a forecast: 130 / 22 = about 6 sprints — and give a range, not a single number.',
        },
        {
          ar: 'القصة 90% منجزة تساوي صفرًا في السرعة؛ وخطط بما تعرفه الآن وأعد التخطيط كل تكرار.',
          en: 'A 90%-done story counts zero toward velocity; plan with what you know now and re-plan every iteration.',
        },
      ],
      reflectPrompt: {
        ar: 'ما القصة في عملك الحالي التي سترفضها قائمة الفحص اليوم لغياب اختبار قبول؟ وما أول سطرين ستضيفهما إلى قائمتك من مفاجآت سابقة؟',
        en: 'Which story in your current work would your checklist reject today for lacking an acceptance test? What two lines from past surprises will you add to your checklist?',
      },
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch4.s1', pages: 'ص96-97 / pp.96-97' },
    { book: 'SWE', section: 'swe.ch4.s2', pages: 'ص97-100 / pp.97-100' },
  ],
} satisfies Lesson;

export default lesson;
