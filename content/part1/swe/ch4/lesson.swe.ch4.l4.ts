/**
 * swe.ch4.l4 — مراجعة الفصل 4 ومشروع: لوحة تخطيط التكرار / Chapter 4 Review and Project: The Iteration Planning Board
 * SWE ch4: s7 Conclusion (ص111-112 / pp.111-112) + chapter recap.
 * Runnable design: the full ch4 pipeline as one deterministic planning board — checklist gate,
 * value/cost sort, greedy velocity packing over six fixed stories (VELOCITY 12) — plus a debug
 * whose broken board books every story and prints 15/12 pts + overbooked!.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch4.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 4,
  title: {
    ar: 'مراجعة الفصل 4 ومشروع: لوحة تخطيط التكرار',
    en: 'Chapter 4 Review and Project: The Iteration Planning Board',
  },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch4.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'اجتماع الراعي، نهاية الفصل. الأسبوع الماضي دخلت بـ"متى ينتهي؟" وأجبت بهلوسة. اليوم تفتح اللوحة: ست قصص، كل منها اجتازت قائمة الفحص أو رُحّلت بنفس الاحترام، نقاطها من قياس نسبي، ترتيبها من نسب القيمة إلى التكلفة، والمخاطر سُحبت إلى الأمام. وتقول بثقة: "التكرار القادم: 12 نقطة، هذه القصص الأربع، والبقية تنتظر دورها — وسأعيد التخطيط كل أسبوعين". هذا ليس وعدًا بطول دفعة واحدة؛ إنه خطة مدافَع عنها بأرقام تتحرك مع الواقع. في هذا الدرس تبني تلك اللوحة بكودك.',
        en: 'The sponsor meeting, end of chapter. Last week you walked in to "when will it be done?" and answered with a hunch. Today you open the board: six stories, each checklist-passed or respectfully deferred, points from relative sizing, order from value-to-cost ratios, risks pulled forward. And you say, confidently: "Next iteration: 12 points, these four stories, the rest wait their turn — and I re-plan every two weeks." That is not a single heroic promise; it is a plan defended by numbers that move with reality. In this lesson you build that board in code.',
      },
    },
    {
      kind: 'predict',
      code: `forecasts = {
    "after 1 sprint": (16, 26),
    "after 3 sprints": (18, 26),
    "after 6 sprints": (20, 24),
}
for when, (lo, hi) in forecasts.items():
    print(f"{when}: {hi - lo} pt spread")`,
      question: {
        ar: 'الفريق نفسه، وقائمة الأعمال نفسها — ماذا يحدث لانتشار نطاق التنبؤ كلما تراكمت سبرنتات قياس السرعة؟',
        en: 'Same team, same backlog — what happens to the forecast spread as more measured sprints accumulate?',
      },
      reveal: {
        ar: 'الانتشار ينكمش: 10 ثم 8 ثم 4 نقاط. التقدير ليس لقطة بل عملية تصحيح مستمرة: كل تكرار مكتمل يضيّق النطاق ويحوّل "10 إلى 16 أسبوعًا" إلى جواب أشد حدة. ومن يرفض إعادة التخطيط يهدر أرخص معلوماته: البيانات الطازجة عن سرعته الحقيقية.',
        en: 'The spread shrinks: 10, then 8, then 4 points. Estimation is not a snapshot but a continuous correction: every completed iteration narrows the range and turns "10 to 16 weeks" into a sharper answer. Refusing to re-plan wastes your cheapest asset: fresh data on your real velocity.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'صندوق أدوات الفصل 4', en: 'The Chapter 4 toolkit' },
      chunks: [
        {
          ar: 'ست أدوات، وكل واحدة تُغذّي التي تليها: قائمة الفحص تجعل كل متطلب ملموسًا بما يكفي لتقديره — لا اختبار قبول فلا تقدير. النقاط النسبية والسرعة المقياسة تحوّلان تاريخ الفريق إلى تنبؤ بنطاق يُعاد ضبطه كل تكرار. إجماع Planning Poker وDelphi يدمج خبرات كثيرة بلا مرساة: التزام سرّي ثم نقاش المتطرفين. MoSCoW ثم value ÷ cost ثم (value + risk reduction) ÷ cost ترتّب القائمة بحيث يكون غير المنجز هو الأقل أهمية والخطر يُواجه مبكرًا.',
          en: 'Six tools, each feeding the next: the checklist makes every requirement concrete enough to estimate — no acceptance test, no estimate. Relative points and measured velocity turn team history into a range forecast, re-set every iteration. Planning Poker and Delphi consensus merge many experts\u2019 knowledge without anchoring: private commitment, then outlier discussion. MoSCoW, then value / cost, then (value + risk reduction) / cost order the backlog so the unfinished work is the least important and risk is faced early.',
        },
        {
          ar: 'ثم يضيف Kano عمقًا للقيمة نفسها: أساسيات تُمَوَّل أولًا لأن غيابها يغضب، وأداء يُنافس عليه لأنه يُقارن، وإبهارات تميّزك لأنها غير متوقعة — مع تذكّر أن الفئات تتقادم. وأخيرًا COCOMO يقدّر من الحجم بقانون قوى حين لا تملك تاريخًا بعد: Effort = a × Size^b وb أكبر من 1 يجعل الحجم الأكبر أغلى لكل سطر. لا أداة تصح وحدها: النقاط تفترض تاريخًا، وCOCOMO يفترض حجمًا معروفًا، وKano يفترض مستخدمين تستطيع استبيانهم — فاستخدم عدة طرق وراقب أين تختلف.',
          en: 'Kano then deepens value itself: must-bes funded first (their absence enrages), performance competed on (it is compared), delighters to differentiate (they are unexpected) — with categories decaying over time. Finally COCOMO estimates from size via a power law when you have no history: Effort = a x Size^b, and b above 1 makes bigger software cost more per line. No tool is trustworthy alone: points assume history, COCOMO assumes a known size, Kano assumes users you can survey — so use several methods and watch where they disagree.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الخيط الرابط: وعد لا أمل', en: 'The through-line: a promise, not a hope' },
      chunks: [
        {
          ar: 'خيط الفصل الأول ممتد إلى هنا: التقديرات موجودة لتجعل المقايضات مرئية وقابلة للتفاوض — نطاق وتكلفة وزمن تُناقَش جهرًا بالأرقام، لا يحسمها أعلى صوت. خطة صادقة تقول: هذه السعة، هذه الأولويات، هذا ما ينتظر — وتُحدَّث كل تكرار ببيانات السرعة الحقيقية. الفرق بين الوعد والأمل ليس في الثقة بالنبرة بل في مصدر الرقم: الأمل من السقف، والوعد من قياس يمكن أن تتحقق عواقبه. هذا ما بناه هذا الفصل بأكمله، وهذا ما ستثبته في مشروع هذا الدرس.',
          en: 'The Chapter 1 thread extends here: estimates exist to make trade-offs visible and negotiable — scope, cost, and time argued in the open with data, not settled by whoever talks loudest. An honest plan states its capacity, its priorities, and what waits — and is updated every iteration with real velocity data. The difference between a promise and a hope is not confidence of tone but the source of the number: hope comes from the ceiling; a promise comes from a measurement with consequences. That is what this whole chapter built, and what you will prove in this lesson\u2019s project.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'الأنبوب كاملًا: من قصص إلى لوحة', en: 'The full pipeline: stories to board' },
      code: `stories = [
    # (id, checklist_ok, points, value 1-10)
    ("A1", True, 3, 6),
    ("A2", False, 5, 9),   # no acceptance test yet
    ("A3", True, 5, 9),
]
velocity = 10

ready = sorted((s for s in stories if s[1]), key=lambda s: s[3] / s[2], reverse=True)
picked, used = [], 0
for sid, ok, pts, val in ready:
    if used + pts <= velocity:
        picked.append(sid)
        used += pts
blocked = ",".join(s[0] for s in stories if not s[1]) or "-"
print("blocked:", blocked)
print("picked:", " ".join(picked), f"({used}/{velocity} pts)")`,
      explanation: {
        ar: 'الأنبوب كله في عشرة أسطر: A2 يُرحَّل لأنه بلا اختبار قبول، والباقي يُرتب بنسبة القيمة إلى التكلفة — A1 بنسبة 2.0 يتفوق على A3 بنسبة 1.8 رغم أن قيمة A3 الخام أكبر — ثم يحزم جشعيًا ضمن 10 نقاط: 8 من 10 مستعملة، وA3 انتظرت لأن إضافتها كانت لتكسر السعة؟ لا — 3 + 5 = 8 فدخلتا معًا. لو كانت السعة 6 لانتظرت A3 رغم كونها الأعلى قيمة خامًا: السعة تُحترم، والصبر جزء من الخطة.',
        en: 'The whole pipeline in ten lines: A2 is deferred for lacking an acceptance test; the rest sort by value-to-cost — A1 at 2.0 outranks A3 at 1.8 even though A3\u2019s raw value is higher — then greedy packing within 10 points: 8 of 10 used, both picked since 3 + 5 = 8. Had capacity been 6, A3 would wait despite its higher raw value: capacity is respected, and patience is part of the plan.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.planning-board',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'المشروع: لوحة تخطيط التكرار. أمامك ست قصص ببياناتها (اجتياز القائمة، النقاط، القيمة 1-10) وسرعة 12. اربط الفصل كله: 1) أبقِ الجاهزة فقط ورتّبها حسب value ÷ points الأعلى أولًا. 2) احزم جشعيًا: القصة تدخل فقط إذا كانت تتسع (used + points <= VELOCITY). 3) اطبع الأسطر الثلاثة: عدد القصص والمحجوب بالقائمة، سطر picked بترتيب الاختيار والنقاط المستعملة، وسطر left بما بقى جاهزًا ولم يتسع.',
        en: 'The project: an iteration planning board. You have six stories (checklist pass, points, value 1-10) and a velocity of 12. Chain the whole chapter: 1) keep only checklist-ready stories, sorted by value / points, best first. 2) Pack greedily: a story enters only if it fits (used + points <= VELOCITY). 3) Print three lines: story count and checklist-blocked count, a picked line in pick order with used points, and a left line with the ready stories that did not fit.',
      },
      starterCode: `stories = [
    # (id, checklist_ok, points, value 1-10)
    ("S1", True,  2, 6),   # schedule view (reference story)
    ("S2", True,  5, 9),   # booking + conflict detection
    ("S3", False, 8, 8),   # SMS reminders: no acceptance test yet
    ("S4", True,  3, 4),   # PDF export
    ("S5", True,  2, 3),   # dark mode
    ("S6", True,  8, 7),   # payment integration
]
VELOCITY = 12

# TODO 1: keep only checklist-ready stories, best value/points first
ready = ...

# TODO 2: pick greedily while the story fits
picked, used = [], 0
for sid, ok, pts, val in ready:
    ...

# TODO 3: blocked count and ready-but-unpicked leftovers
blocked = ...
left = ...

print(f"board: {len(stories)} stories, {blocked} blocked by checklist")
print("picked:", " ".join(picked), f"({used}/{VELOCITY} pts)")
print("left:", " ".join(left) or "-")`,
      solution: `stories = [
    # (id, checklist_ok, points, value 1-10)
    ("S1", True,  2, 6),   # schedule view (reference story)
    ("S2", True,  5, 9),   # booking + conflict detection
    ("S3", False, 8, 8),   # SMS reminders: no acceptance test yet
    ("S4", True,  3, 4),   # PDF export
    ("S5", True,  2, 3),   # dark mode
    ("S6", True,  8, 7),   # payment integration
]
VELOCITY = 12

ready = sorted((s for s in stories if s[1]), key=lambda s: s[3] / s[2], reverse=True)

picked, used = [], 0
for sid, ok, pts, val in ready:
    if used + pts <= VELOCITY:
        picked.append(sid)
        used += pts

blocked = sum(1 for s in stories if not s[1])
left = [sid for sid, ok, pts, val in ready if sid not in picked]

print(f"board: {len(stories)} stories, {blocked} blocked by checklist")
print("picked:", " ".join(picked), f"({used}/{VELOCITY} pts)")
print("left:", " ".join(left) or "-")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'ست قصص وواحدة محجوبة', en: 'six stories, one blocked' },
          code: `assert 'board: 6 stories, 1 blocked by checklist' in __learner_output__, 'expected: board: 6 stories, 1 blocked by checklist | actual: %r' % __learner_output__`,
          expected: 'board: 6 stories, 1 blocked by checklist',
        },
        {
          id: 't2',
          name: { ar: 'سطر الاختيار 12/12', en: 'picked line 12/12' },
          code: `assert 'picked: S1 S2 S5 S4 (12/12 pts)' in __learner_output__, 'expected: picked: S1 S2 S5 S4 (12/12 pts) | actual: %r' % __learner_output__`,
          expected: 'picked: S1 S2 S5 S4 (12/12 pts)',
        },
        {
          id: 't3',
          name: { ar: 'المتغيرات picked وused صحيحة', en: 'picked and used variables correct' },
          code: `assert picked == ['S1', 'S2', 'S5', 'S4'] and used == 12, 'expected: picked=[S1, S2, S5, S4] used=12 | actual: %r' % ((picked, used),)`,
          expected: "picked=['S1', 'S2', 'S5', 'S4'], used=12",
        },
      ],
      hints: [
        {
          ar: 'ابدأ بالبوابة: قصة بلا اختبار قبول لا تدخل الخطة أصلًا — صفِّ ثم رتّب.',
          en: 'Start at the gate: a story without an acceptance test never enters the plan — filter first, then sort.',
        },
        {
          ar: 'الترتيب بالنسبة لا بالقيمة الخام: key=lambda s: s[3] / s[2] مع reverse=True — هنا يتفوق S5 ذو القيمة 3 على S6 ذي القيمة 7.',
          en: 'Rank by ratio, not raw value: key=lambda s: s[3] / s[2] with reverse=True — here S5 (value 3) beats S6 (value 7).',
        },
        {
          ar: 'الهيكل: ready = sorted((s for s in stories if s[1]), key=lambda s: s[3] / s[2], reverse=True) ثم حلقة تختار فقط إذا used + pts <= VELOCITY.',
          en: 'Skeleton: ready = sorted((s for s in stories if s[1]), key=lambda s: s[3] / s[2], reverse=True), then a loop that picks only when used + pts <= VELOCITY.',
        },
        {
          ar: 'قريب من الحل: blocked = sum(1 for s in stories if not s[1])؛ left = قائمة معرفات الجاهزة غير المختارة. النتيجة: picked: S1 S2 S5 S4 (12/12 pts) وleft: S6 — دقة الترتيب تفصل S5 (1.5) عن S4 (1.33).',
          en: 'Near-solution: blocked = sum(1 for s in stories if not s[1]); left = the ready ids not picked. Expect picked: S1 S2 S5 S4 (12/12 pts) and left: S6 — ratio precision separates S5 (1.5) from S4 (1.33).',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.recap-trace',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'سطران من مراجعة الفصل: نسبة value ÷ cost لكشف التعارضات، وترتيب البناء بعد تطبيق الصيغة. ما المطبوع بالضبط؟',
        en: 'Two recap lines from the chapter: the value / cost ratio for conflict detection, and the build order after applying the formula. What exactly gets printed?',
      },
      code: `ratio = 9 / 5
print("conflict ratio:", ratio)
print("order: conflict, pdf, sms")`,
      answer: 'conflict ratio: 1.8\norder: conflict, pdf, sms',
      solution: 'conflict ratio: 1.8\norder: conflict, pdf, sms',
      hints: [
        {
          ar: 'قسمة Python على عددين صحيحين تعيد float: 9 / 5 ليست 1.',
          en: 'Python division of two ints returns a float: 9 / 5 is not 1.',
        },
        {
          ar: 'الطباعة الافتراضية لـ float تختصر الزوائد: 1.8 لا 1.80.',
          en: 'Default float printing trims padding: 1.8, not 1.80.',
        },
        {
          ar: 'print مع فاصلتين يفصل بفراغ واحد: "conflict ratio: " ثم القيمة.',
          en: 'print with two arguments joins with one space: "conflict ratio: " then the value.',
        },
        {
          ar: 'قريب من الحل: السطر الأول "conflict ratio: 1.8" والثاني "order: conflict, pdf, sms" كما هو.',
          en: 'Near-solution: line one is "conflict ratio: 1.8"; line two is "order: conflict, pdf, sms" verbatim.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.partial-credit',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بنهاية السبرنت، قصة من 13 نقطة "شبه مكتملة — يتبقى الاختبار فقط". أثناء حساب سرعة التكرار، كم نقطة تدخل في العدّ؟',
        en: 'At sprint end, a 13-point story is "almost finished — just testing left." When computing iteration velocity, how many of its points count?',
      },
      options: [
        { id: 'a', text: { ar: '11.7 — نسبة الإنجاز الفعلية', en: '11.7 — the actual completion percentage' } },
        { id: 'b', text: { ar: '13 — الجهد أُنفق كاملًا', en: '13 — the effort was fully spent' } },
        { id: 'c', text: { ar: 'صفر — العمل الذي لم يبلغ تعريف الإنجاز لا يمكن إيداعه', en: 'Zero — work below the definition of done cannot be banked' } },
        { id: 'd', text: { ar: '6.5 — احتياطًا للنقاش', en: '6.5 — as a negotiating buffer' } },
      ],
      answer: 'c',
      solution: 'c',
      hints: [
        {
          ar: 'تذكّر من الدرس الأول: السرعة تُقاس بالقصص التي بلغت تعريف الإنجاز فقط.',
          en: 'Recall from the first lesson: velocity counts only stories that met the definition of done.',
        },
        {
          ar: 'العمل الجزئي قد لا يقدم قيمة قابلة للاستخدام حتى لو أُنفق الجهد.',
          en: 'Partial work may not deliver usable value even though effort was spent.',
        },
        {
          ar: 'لو حُسبت النقاط الجزئية لتفخّم كل تنبؤ لاحق على أساس عمل لم يُسلَّم.',
          en: 'If partial points were banked, every later forecast would inflate on work never delivered.',
        },
        {
          ar: 'الصحيح (ج): صفر — "لا يمكنك إيداع نقطة جزئية"؛ قصة 90% تساوي 0.',
          en: 'Correct: (c) — zero; "you cannot bank a partial point", so 90% done counts 0.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.kano-question',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل المصطلح: في نموذج Kano يُطرح عن كل ميزة سؤالان — الوظيفي ("كيف تشعر لو وُجدت؟") والسؤال ______ ("كيف تشعر لو غابت؟").',
        en: 'Fill in the term: in the Kano model, two questions are asked per feature — the functional ("how do you feel if present?") and the ______ question ("how do you feel if absent?").',
      },
      answer: 'dysfunctional',
      solution: 'dysfunctional',
      hints: [
        {
          ar: 'هو زوج السؤال الوظيفي، لا بديل له.',
          en: 'It is the pair of the functional question, not a separate tool.',
        },
        {
          ar: 'يدور عن الغياب لا الحضور.',
          en: 'It concerns absence, not presence.',
        },
        {
          ar: 'كلمة إنجليزية واحدة تبدأ بـ dis-.',
          en: 'One English word starting with dis-.',
        },
        {
          ar: 'السؤال المعطوب: dysfunctional — وهو ما يكشف الـMust-be المخفية.',
          en: 'The dysfunctional question — it is what exposes hidden must-bes.',
        },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-board',
      required: true,
      brokenCode: `stories = [("S1", 2), ("S2", 5), ("S3", 8)]
velocity = 12

picked, used = [], 0
for sid, pts in stories:
    picked.append(sid)   # BUG: every story is booked, capacity never checked
    used += pts

print("picked:", " ".join(picked), f"({used}/{velocity} pts)")
if used > velocity:
    print("overbooked!")`,
      prompt: {
        ar: 'لوحة التكرار تعمل... إلا أنها تحجز كل شيء. شغّلها: السطر يطبع picked: S1 S2 S3 (15/12 pts) ثم overbooked! — تكرار بثمانية عشر... لا، بخمسة عشر نقطة داخل سعة 12: وعد مكسور قبل أن يبدأ، وبذور "القصة 90%". أصلح الحلقة بحيث تدخل القصة فقط إذا كانت تتسع (used + pts <= velocity) وأعد التشغيل. ستجد S3 (8 نقاط) بلا مكان بعد S1 وS2 — هذا ليس فشلًا؛ إنه الصبر الذي يجعل الخطة صادقة.',
        en: 'The iteration board runs... and books everything. Run it: the line prints picked: S1 S2 S3 (15/12 pts) then overbooked! — fifteen points packed into a capacity of 12: a promise broken before it starts, and the seed of "90% done" stories. Fix the loop so a story enters only if it fits (used + pts <= velocity), then run again. S3 (8 points) will find no room after S1 and S2 — that is not failure; it is the honesty that keeps the plan true.',
      },
      solution: `stories = [("S1", 2), ("S2", 5), ("S3", 8)]
velocity = 12

picked, used = [], 0
for sid, pts in stories:
    if used + pts <= velocity:
        picked.append(sid)
        used += pts

print("picked:", " ".join(picked), f"({used}/{velocity} pts)")
if used > velocity:
    print("overbooked!")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'السطر المصحح: S1 S2 بـ 7/12', en: 'fixed line: S1 S2 at 7/12' },
          code: `assert 'picked: S1 S2 (7/12 pts)' in __learner_output__, 'expected: picked: S1 S2 (7/12 pts) | actual: %r' % __learner_output__`,
          expected: 'picked: S1 S2 (7/12 pts)',
        },
        {
          id: 't2',
          name: { ar: 'لا حجز زائد بعد الإصلاح', en: 'no overbooking after the fix' },
          code: `assert 'overbooked' not in __learner_output__ and '15/12' not in __learner_output__, 'expected: no overbooking | actual: %r' % __learner_output__`,
          expected: 'no overbooked!, no 15/12',
        },
        {
          id: 't3',
          name: { ar: 'المتغيرات بعد الإصلاح', en: 'variables after the fix' },
          code: `assert used == 7 and picked == ['S1', 'S2'], 'expected: used=7 picked=[S1, S2] | actual: %r' % ((used, picked),)`,
          expected: "used=7, picked=['S1', 'S2']",
        },
      ],
      hints: [
        {
          ar: 'شغّل الكود كما هو وراقب: 15 نقطة داخل سعة 12 — متى يجب أن يُتخذ قرار الحجز؟',
          en: 'Run the code as-is and look: 15 points inside a 12 capacity — when should the booking decision be made?',
        },
        {
          ar: 'قاعدة الفصل: القصة تدخل التكرار فقط إذا كانت used + pts <= velocity — السعة تُحترم قبل الرغبات.',
          en: 'The chapter rule: a story enters the iteration only if used + pts <= velocity — capacity is respected before wishes.',
        },
        {
          ar: 'الهيكل: داخل الحلقة أضف شرطًا قبل الإضافة: if used + pts <= velocity: picked.append(sid) وused += pts.',
          en: 'Skeleton: inside the loop, guard the append — if used + pts <= velocity: picked.append(sid), then used += pts.',
        },
        {
          ar: 'قريب من الحل: بعد الإصلاح يطبع السطر picked: S1 S2 (7/12 pts) — وS3 (8 نقاط) تنتظر التكرار القادم لأن 7 + 8 = 15 > 12.',
          en: 'Near-solution: after the fix the line is picked: S1 S2 (7/12 pts) — S3 (8 points) waits for the next iteration because 7 + 8 = 15 > 12.',
        },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `# لوحتك — غيّر السرعة والقيم وشاهد الترتيب والاختيار يتغيران
# Your board — change velocity and values, watch order and picks shift
stories = [
    # (id, checklist_ok, points, value 1-10)
    ("S1", True,  2, 6), ("S2", True,  5, 9), ("S3", False, 8, 8),
    ("S4", True,  3, 4), ("S5", True,  2, 3), ("S6", True,  8, 7),
]
VELOCITY = 12

ready = sorted((s for s in stories if s[1]), key=lambda s: s[3] / s[2], reverse=True)
picked, used = [], 0
for sid, ok, pts, val in ready:
    if used + pts <= VELOCITY:
        picked.append(sid)
        used += pts
print("picked:", " ".join(picked), f"({used}/{VELOCITY} pts)")

# جرّب: VELOCITY = 8 — من يبقى ومن ينتظر؟ ثم اجعل S3 جاهزة وراقب نسبتها 1.0`,
      prompt: {
        ar: 'العب بلوحتك: اخفض السرعة إلى 8 وشاهد من ينتظر، ثم اجعل S3 جاهزة (True) ولاحظ أن نسبتها 1.0 تضعها أخيرة. أي تغيير في القيمة يرفع قصة إلى الصدارة؟',
        en: 'Play with your board: drop velocity to 8 and watch who waits; then make S3 ready (True) and notice its ratio of 1.0 puts it last. Which value change would lift a story to the top?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz.ch4.l4',
      items: [
        {
          id: 'q1.ch1-triangle',
          question: {
            ar: 'في الفصل 1 قابلنا مثلث الحدود: النطاق والزمن والتكلفة. فكرة "الشهية" (appetite) — ميزانية وقت يُقرر أصلًا ما يستحق البناء — أي ضلع تقلبه؟',
            en: 'Chapter 1 introduced the iron triangle: scope, time, cost. The idea of an appetite — a fixed time budget that constrains the design — flexes which side?',
          },
          options: [
            { id: 'a', text: { ar: 'تثبّت النطاق وتترك الزمن يتأرجح', en: 'It fixes scope and lets time flex' } },
            { id: 'b', text: { ar: 'تثبّت الزمن والنطاق معًا', en: 'It fixes both time and scope' } },
            { id: 'c', text: { ar: 'تثبّت الزمن وتترك النطاق مرنًا — الوقت كاسح دائرة يُقطع عندها النقاش', en: 'It fixes time and lets scope flex — the deadline is the circuit breaker' } },
            { id: 'd', text: { ar: 'تلغي المقايضات كلها', en: 'It removes trade-offs entirely' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'عكس تقدير تقليدي يبدأ من تصميم وينتج رقمًا: الشهية تبدأ من رقم وتقيّد التصميم — "ما أفضل ما نبنيه في الوقت الذي يستحقه؟" — فيتقدم النطاق إلى بداية المشروع بدل نهايته.',
            en: 'An estimate starts from a design and produces a number; an appetite starts from a number and constrains the design — "what is the best thing we can build in the time this is worth?" — moving scope trade-offs to the start instead of the end.',
          },
        },
        {
          id: 'q2.ch2-risk',
          question: {
            ar: 'صيغة (value + risk reduction) ÷ cost رفعت تكامل الدفع — العمل الخطر — إلى صدارة القائمة. أي فكرة من الفصل 2 تغلّفها هذه الصيغة؟',
            en: 'The (value + risk reduction) / cost formula lifted payment integration — the risky work — near the top of the backlog. Which Chapter 2 idea does this formula package?',
          },
          options: [
            { id: 'a', text: { ar: 'الشلال: اجمع كل التفاصيل قبل أي كود', en: 'Waterfall: gather every detail before any code' } },
            { id: 'b', text: { ar: 'مبدأ مواجهة الخطر مبكرًا (التسلسل الخطر أولًا والحلزون): استكشف عدم اليقين وأنت تملك وقتًا للتصحيح', en: 'The risk-first principle (risk-first sequencing and the spiral): probe uncertainty while you can still afford to be wrong' } },
            { id: 'c', text: { ar: 'تأجيل الاختبار إلى نهاية المشروع', en: 'Deferring testing to project end' } },
            { id: 'd', text: { ar: 'لا صلة بين الصيغة والفصل 2', en: 'No connection to Chapter 2' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'تخفيض المخاطرة قيمة حقيقية: العمل الخطر مبكرًا يُقعد عدم اليقين فيتحسن كل تقدير لاحق — نفس منطق الحلزون والاختبار الخطر أولًا، وغالبًا يكفي spike محدود الزمن.',
            en: 'Risk reduction is real value: risky work early retires uncertainty and sharpens every later estimate — the same logic as the spiral and risk-first sequencing, often satisfied by a small time-boxed spike.',
          },
        },
        {
          id: 'q3.ch3-hope',
          question: {
            ar: 'قصة من قائمة الأعمال المتراكمة التي أنتجها الفصل 3 وصلت بلا معيار قبول. ماذا تفعل قبل وضع نقاط عليها؟',
            en: 'A story from the Chapter 3 backlog arrives with no acceptance criterion. What do you do before putting points on it?',
          },
          options: [
            { id: 'a', text: { ar: 'أضع 3 نقاط متفائلة وأكمل', en: 'Put 3 optimistic points and move on' } },
            { id: 'b', text: { ar: 'أحذفها من القائمة نهائيًا', en: 'Delete it from the backlog for good' } },
            { id: 'c', text: { ar: 'أمررها على قائمة الفحص: المتطلب الذي لا يُختبر لا يُقدَّر — إنها أمل حتى تصير ملموسة', en: 'Run it through the checklist: a requirement you cannot test you cannot estimate — it is hope until made concrete' } },
            { id: 'd', text: { ar: 'أطلب رقمًا من المدير', en: 'Ask the manager for a number' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'القائمة تربط القصة بهدفها واختبار قبولها وتبعياتها ومخاطرها — عندها فقط تصبح قابلة للتقدير والمقارنة مع بقية القصص.',
            en: 'The checklist ties the story to its goal, acceptance test, dependencies, and risks — only then is it estimable and comparable with the rest.',
          },
        },
        {
          id: 'q4.velocity-zero',
          question: {
            ar: 'قصة 13 نقطة 90% منجزة بنهاية السبرنت. كم تدخل في velocity؟',
            en: 'A 13-point story is 90% done at sprint end. How much of it counts toward velocity?',
          },
          options: [
            { id: 'a', text: { ar: '11.7 نقطة', en: '11.7 points' } },
            { id: 'b', text: { ar: '13 كاملة', en: 'The full 13' } },
            { id: 'c', text: { ar: 'صفر — لا يمكنك إيداع نقطة جزئية', en: 'Zero — you cannot bank a partial point' } },
            { id: 'd', text: { ar: 'نصفها بقرار الفريق', en: 'Half, by team decision' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'فقط القصص التي بلغت تعريف الإنجاز تُحتسب؛ العمل الجزئي قد لا يقدم قيمة قابلة للاستخدام، وإيداع النقاط الجزئية يضخم التنبؤ ويهدد مصداقيته.',
            en: 'Only stories meeting the definition of done count; partial work may not deliver usable value, and banking partial points inflates the forecast and destroys its credibility.',
          },
        },
        {
          id: 'q5.moscow-60',
          question: {
            ar: 'لماذا نحافظ على Musts عند نحو 60% من الجهد أو أقل؟',
            en: 'Why keep Musts to about 60% or less of the effort?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن Musts أرخص تنفيذًا', en: 'Because Musts are cheaper to build' } },
            { id: 'b', text: { ar: 'لأن قائمة كلها Musts بلا هامش: أول تأخير يكسر وعدًا، والـCould وسادة تمتص الصدمة', en: 'Because an all-Must backlog has no margin: the first delay breaks a promise, and the Coulds are the shock absorber' } },
            { id: 'c', text: { ar: 'لأن الـMust لا يحتاج اختبارات', en: 'Because Musts need no tests' } },
            { id: 'd', text: { ar: 'لأن الرقم 60 نسبة سوقية ثابتة', en: 'Because 60 is a fixed market constant' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'إن كان كل شيء Mustًا فلا شيء يمكن إسقاطه عند الضيق — القائمة قائمة أمنيات. الـCould هي ما يسمح بإصابة الموعد بشيء قابل للنشر.',
            en: 'If everything is a Must, nothing can be dropped when time runs short — the backlog is a wish list. The Coulds are what let you hit the date with something shippable.',
          },
        },
        {
          id: 'q6.cocomo-double',
          question: {
            ar: 'على مشروع organic (b = 1.05)، مضاعفة الحجم من 20 إلى 40 KLOC رفعت الجهد من 55.8 إلى 115.4 شهر-شخص. ما اسم الخاصية التي عاملها 2.07؟',
            en: 'On an organic project (b = 1.05), doubling size from 20 to 40 KLOC raised effort from 55.8 to 115.4 person-months. What is this ~2.07 factor property called?',
          },
          options: [
            { id: 'a', text: { ar: 'اقتصاد الحجم: الأكبر أرخص للسطر', en: 'Economy of scale: bigger is cheaper per line' } },
            { id: 'b', text: { ar: 'عدم اقتصاد الحجم diseconomy of scale: الحجم الأكبر يكلف أكثر لكل سطر', en: 'Diseconomy of scale: bigger software costs more per line' } },
            { id: 'c', text: { ar: 'خطأ تقريب في الحساب', en: 'A rounding artifact' } },
            { id: 'd', text: { ar: 'مضاعفة بروكس للأسماء', en: 'Brooks\u2019 naming law' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الأس b أكبر من 1 هو التوقيع الرياضي لعدم اقتصاد الحجم: تفاعلات وتواصل أكثر من التناسب — وهو سبب خيبة "أضف مزيدًا من الكود" و"أضف مزيدًا من الناس".',
            en: 'b above 1 is the mathematical signature of diseconomy of scale: interactions and communication grow super-linearly — why "just add more code" and "just add more people" so often disappoint.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'قدّرت مرة في يناير والتزمت بالرقم حتى ديسمبر.',
          right: 'أعد التخطيط كل تكرار — البيانات الطازجة أثمن أصولك.',
          note: {
            ar: 'التقدير عملية تصحيح: النطاق ينكمش مع كل سبرنت مكتمل. من يرفض إعادة التخطيط يدفع ثمن معلومة يملكها ولا يستخدمها، ويحافظ على دقة زائفة حتى تصير كارثة.',
            en: 'Estimation is a correction process: the range narrows with every completed sprint. Refusing to re-plan means paying for information you own and never use, while preserving false precision until it becomes a disaster.',
          },
        },
        {
          wrong: 'اللوحة ممتلئة 15/12 — سننجح بالعمل الجاد.',
          right: 'السعة تُحترم: ما لا يتسع ينتظر التكرار القادم.',
          note: {
            ar: 'الحجز الزائد ليس طموحًا؛ إنه وعد مكسور مسبقًا ومصدر قصص "90%". الخطة الصادقة فيها قصة تنتظر، لا قصة منجزة جزئيًا تُحتسب.',
            en: 'Overbooking is not ambition; it is a promise pre-broken and the factory of "90% done" stories. An honest plan has a story that waits, not a partially-done story that counts.',
          },
        },
        {
          wrong: 'COCOMO أعطى 55.8 شهر-شخص — رقم واحد يكفي للعقد.',
          right: 'مثلّث: COCOMO + Delphi + السرعة الحقيقية، وادرس أين تختلف.',
          note: {
            ar: 'كل طريقة تفشل بطريقة مختلفة: النقاط تحتاج تاريخًا، وCOCOMO يحتاج حجمًا معروفًا، والحدس يحتاج خبرة حالية. الخلاف بينها ليس إزعاجًا حسابيًا بل إشارة إلى أين تذهب لتتعلم.',
            en: 'Every method fails differently: points need history, COCOMO needs a known size, gut feel needs current experience. Their disagreement is not computational noise but a signpost for where to go learn.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'قائمة فحص، ثم نقاط وسرعة، ثم إجماع، ثم أولويات، ثم Kano، ثم COCOMO — أدوات تتغذى على بعضها لا وصيفة تُستخدم وحدها.',
          en: 'Checklist, points and velocity, consensus, priorities, Kano, COCOMO — interlocking tools, none of them used alone.',
        },
        {
          ar: 'قدّم نطاقًا لا رقمًا، واحترم السعة، وأعد التخطيط كل تكرار بينما يضيق النطاق.',
          en: 'Give a range, respect capacity, and re-plan every iteration as the range narrows.',
        },
        {
          ar: 'الأولويات لا تكون حقيقية إلا إذا كانت قادرة على الألم: شيء تحبه يذهب إلى Won\u2019t.',
          en: 'Prioritization is only real if it can hurt: something you like goes into Won\u2019t.',
        },
        {
          ar: 'التقدير يجعل المقايضات مرئية وقابلة للتفاوض — هذا الفرق بين وعد وأمل.',
          en: 'Estimates make trade-offs visible and negotiable — that is the difference between a promise and a hope.',
        },
      ],
      reflectPrompt: {
        ar: 'أي أداة من هذا الفصل ستدخل أول اجتماع تخطيط لك، ولماذا؟ وما الرقم الذي ستصرح بنطاقه بدل تصريحه رقمًا واحدًا؟',
        en: 'Which tool from this chapter will enter your first planning meeting, and why? Which number will you state as a range instead of a single figure?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch4.s7', pages: 'ص111-112 / pp.111-112' },
      ],
    },
  ],
  sources: [{ book: 'SWE', section: 'swe.ch4.s7', pages: 'ص111-112 / pp.111-112' }],
} satisfies Lesson;

export default lesson;
