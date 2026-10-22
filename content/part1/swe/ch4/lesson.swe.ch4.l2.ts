/**
 * swe.ch4.l2 — توافق الفريق وموازنة الأولويات / Group Consensus and Balancing Priorities
 * SWE ch4: s3 Structured Group Consensus Estimates (ص101-102 / pp.101-102) + s4 Balancing Priorities (ص102-105 / pp.102-105)
 * Runnable design: deterministic Planning-Poker rounds (cards/spread/median over fixed tables) and
 * a value/cost ranking matching the book's clinic table (1.80 / 1.33 / 1.00 / 0.38).
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
import type { Lesson } from '@/lib/content/schema';

const lesson = {
  id: 'swe.ch4.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 4,
  title: { ar: 'توافق الفريق وموازنة الأولويات', en: 'Group Consensus and Balancing Priorities' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch4.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'قاعة الاجتماع. صاحب المنتج يقرأ قصة "حجز موعد مع كشف التعارضات"، وقائد الفريق يتكلم أولًا: "هذا نصف يوم، واضح". فيردّ المطور الجديد: "نعم، نصف يوم". ثلاثون ثانية، وانتهى التقدير — لكن القصة تتطلب علم تعارضات، وفهرسًا، واختبارات حدّية لم يذكرها أحد، لأن أول رقم نُطق به صار مرساة جرّت كل الأرقام اللاحقة نحوه. هناك طريقة أذكى: كل مُقدِّر يلتزم سرًّا قبل أن يتكلم أحد، ثم تنقلب البطاقات معًا — والخلاف الذي يظهر بعد ذلك هو أغلى معلومة في الغرفة.',
        en: 'The meeting room. The product owner reads "book an appointment with conflict detection", and the lead speaks first: "half a day, clearly." The junior developer echoes: "yeah, half a day." Thirty seconds and the estimate is done — but the story needs a conflict engine, an index, and edge-case tests nobody mentioned, because the first number spoken became an anchor dragging every later number toward it. There is a smarter way: every estimator commits privately before anyone speaks, then the cards flip together — and the disagreement that surfaces is the most valuable information in the room.',
      },
    },
    {
      kind: 'predict',
      code: `anchored = [3, 3, 3, 5]      # everyone heard the lead say "3"
independent = [2, 3, 5, 13]  # private estimates, revealed together
for label, cards in (("anchored", anchored), ("independent", independent)):
    print(label, "spread:", max(cards) - min(cards))`,
      question: {
        ar: 'مجموعتان قدّرتا القصة نفسها. أيهما ناقشت العمل فعلًا؟ ولماذا قد يكون الانتشار الضيق خطرًا لا علامة اتفاق؟',
        en: 'Two groups estimated the same story. Which one actually discussed the work? And why can a narrow spread be a danger sign rather than a mark of agreement?',
      },
      reveal: {
        ar: 'انتشار المجموعة المثبتة 2 فقط — لأن الجميع ردّد رقم القائد، لا لأنهم فهموا العمل. الانتشار الواسع 11 هو ما يجبر صاحب أعلى رقم وصاحب أدناه على تفسير سببهما، وهناك يُكتشف العمل المخفي والفرصة المخفية. الاتفاق بلا نقاش ليس إجماعًا؛ إنه صدى.',
        en: 'The anchored group\u2019s spread is only 2 — because everyone echoed the lead\u2019s number, not because they understood the work. The wide spread of 11 is what forces the highest and lowest estimators to explain their reasoning, and there the hidden work and hidden opportunity surface. Agreement without discussion is not consensus; it is an echo.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'التقدير بالإجماع المنظّم', en: 'Structured group consensus estimates' },
      chunks: [
        {
          ar: 'تقدير الفرد تخمين؛ وتقدير المجموعة المُجمَّعة جيدًا أفضل بوضوح، لأن كل خبير يرى خطرًا يغيب عن البقية: خبير قواعد البيانات يعرف الترحيل، ومطوّر الواجهة يعرف متطلباتها الدقيقة، والمختبر يعرف الحالات الحدّية. تقنية Wideband Delphi (تكيف Barry Boehm للطريقة الكلاسيكية) دورة منظمة: يقدّر الخبراء سرًّا، تُكشف الأرقام معًا، يشرح المتطرفان منطقهما، ثم يعيد الجميع التقدير. صاحب الرقم 13 وسط أصحاب الـ3 عادةً يعرف شيئًا لا يعرفه الآخرون ("هذه الميزة تحتاج سجل تدقيق امتثال") — ومجرد حساب المتوسط يضيّع هذه المعلومة.',
          en: 'One person\u2019s estimate is a guess; a well-gathered group estimate is markedly better, because each expert sees a risk the others miss: the database expert knows the migration, the front-end developer knows the UI is fiddly, the tester knows the edge cases. Wideband Delphi (Barry Boehm\u2019s adaptation of the classic method) is a structured cycle: experts estimate privately, estimates are revealed together, the outliers explain their reasoning, and everyone re-estimates. The person who played 13 among 3s usually knows something the others do not ("that feature needs a compliance audit log") — and simply averaging loses that information.',
        },
        {
          ar: 'Planning Poker هو Delphi المُسرَّع لفرق رشيقة: بطاقة بنقاط السلم لكل مُقدِّر. صاحب المنتج يقرأ القصة ويجيب عن الأسئلة، ثم يختار الجميع بطاقاتهم مقلوبة — التزام قبل سماع أي رقم (هكذا تُهزم المرساة) — وتنقلب البطاقات معًا على العدّ. اتفقت؟ سجّل الرقم وانتقل. تفرقت؟ يشرح الأعلى والأدنى، ثم إعادة تصويت، وتكرار حتى التقارب — غالبًا في جولتين أو ثلاث. الناتج الحقيقي للجلسة فهم مشترك للعمل؛ الرقم مجرد سجل مختصر لهذا الفهم.',
          en: 'Planning Poker is Wideband Delphi made fast for agile teams: each estimator holds a deck of point-scale cards. The product owner reads the story and answers questions; everyone privately picks a card face down — committing before hearing anyone (this defeats anchoring) — and all cards flip on a count. Agreed? Record and move on. Diverged? The highest and lowest explain, the team re-votes, and the cycle repeats until convergence — usually two or three rounds. The session\u2019s real output is a shared understanding of the work; the point value just records it compactly.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الجدولة: MoSCoW', en: 'Balancing priorities: MoSCoW' },
      chunks: [
        {
          ar: 'التقدير يقول كم يكلف العمل ولا يقول كم يستحق. ميزة بـ90 نقطة يريدها ثلاثة مستخدمين أسوأ استثمار من ميزة بـ5 نقاط يحتاجها كل مستخدم يوميًا. الأولوية هي ترتيب القائمة بحيث تكون الأعمال غير المنجزة — وستنتهي من الوقت أو المال — هي الأقل أهمية. MoSCoW أربع خانات: Must: بدونها الإصدار عديم الفائدة أو غير قانوني، وتأخرها يؤخر الإصدار. Should: مؤلمة عند إسقاطها لكن المنتج يعمل بدونها. Could: مرغوبة رخيصة — أول ما يُسقط عند الضيق، وهي وسادة الامتصاص. Won\u2019t (هذه المرة): خارج النطاق صراحةً — كتابتها يمنع زحف النطاق ويسجل وعدًا بمراجعتها لاحقًا.',
          en: 'Estimation tells you what work costs, not what it is worth. A 90-point feature three users want is a worse investment than a 5-point feature every user needs daily. Prioritization orders the backlog so the unfinished work — and you will run out of time or money — is the least important. MoSCoW has four buckets: Must: without it the release is useless or illegal; if it slips, the release slips. Should: painful to omit, but the product works without it. Could: desirable and cheap — first to be dropped, your scope buffer. Won\u2019t (this time): explicitly out of scope — writing it down prevents scope creep and records a promise to revisit.',
        },
        {
          ar: 'القاعدة العملية من DSDM: أبقِ الـMust عند نحو 60% من الجهد أو أقل. لماذا؟ لأن قائمة كل عناصرها Musts خطة بلا هامش: أول تأخير يكسر وعدًا، ولا شيء يمكن إسقاطه. أما الـCould فهي الصدمات التي تمتصّ الضغط وتتيح لك إصابة الموعد بشيء قابل للنشر. والمبدأ الأعمق: الأولوية لا تكون حقيقية إلا إذا كانت قادرة على الألم — إن لم تكن مستعدًا لنقل شيء تحبه إلى Won\u2019t فأنت لا ترتّب أولويات؛ أنت تكتب قائمة أمنيات، وقائمة الأمنيات لا تنجو من موعد نهائي.',
          en: 'The practical rule from DSDM: keep Musts to roughly 60% or less of total effort. Why? A backlog that is all Musts is a plan with no margin: the first delay breaks a promise, and nothing can be dropped. The Coulds are the shock absorbers that let you hit the date with something shippable. And the deeper principle: prioritization is only real if it can hurt — if you are not willing to move something you like into Won\u2019t, you have not prioritized; you have made a wish list, and a wish list cannot survive contact with a deadline.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'القيمة مقابل التكلفة مقابل المخاطرة', en: 'Value, cost, and risk' },
      chunks: [
        {
          ar: 'للترتيب داخل الخانة الواحدة: priority score = value ÷ cost. قدّر القيمة من 1 إلى 10 (من أصحاب المصلحة) والتكلفة بالنقاط التي تملكها، ورتّب بالنسبة — أفضل "عائد لكل نقطة" أولًا. النتيجة تعليمية دائمًا: تذكيرات SMS قيمتها الخام 8 تتأخر خلف تصدير PDF قيمته 4 فقط، لأن ثمن الأول ضعف ثمن الثاني — أفضل شيء تبنيه تاليًا هو ذو أفضل عائد على الجهد، وهو نادرًا ما يكون الأكثر لمعانًا.',
          en: 'To order work within a bucket: priority score = value / cost. Estimate value 1-10 from stakeholder input and cost in the story points you already have, then rank by the ratio — best bang per point first. The result is always instructive: SMS reminders with a raw value of 8 rank below humble PDF export worth only 4, because reminders cost twice as much — the best next thing to build is the one with the best return on effort, and it is rarely the flashiest.',
        },
        {
          ar: 'ويبقى بعد ثالث: المخاطرة — احتمال أن تنفجر القصة بما لم يلتقطه تقديرك، مثل تكامل دفع يعتمد على API بنكٍ لم تلمسه. والخطر يُدفع مبكرًا لسببين: التهديد (اكتشاف عجز البوابة عن الاسترداد في الأسبوع الثاني قابل للنجاة، وفي الحادي عشر لا) والتعلم (القصص الخطرة هي الأكثر تعليمًا، وإنجازها أولًا يُقعد عدم اليقين فيرفص كل تقدير لاحق). صيغة شفافة: weighted priority = (value + risk reduction) ÷ cost — تخفيض المخاطرة يُقيَّم 1-10 (10 = إنجازها الآن يحرق أكبر قدر من عدم اليقين)، وإضافتها للبسط يجذب العمل الخطر إلى الأمام. وغالبًا يكفي spike محدود الزمن يقتني معظم قيمة تخفيض الخطر بجزء يسير من التكلفة.',
          en: 'A third dimension remains: risk — the probability a story blows up in ways your estimate missed, like a payment integration depending on a bank API you have never touched. Tackle it early for two reasons: threat (discovering the gateway cannot do refunds in week two is survivable; in week eleven it is not) and learning (risky stories teach the most, and doing them early retires uncertainty, sharpening every later estimate). One transparent formula: weighted priority = (value + risk reduction) / cost — rate risk reduction 1-10 (10 = doing it early burns down the most uncertainty); adding it to the numerator pulls uncertain work forward. Often a small time-boxed spike banks most of that value at a fraction of the cost.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'جولة Planning Poker كاملة على قصة SMS', en: 'A full Planning Poker round on the SMS story' },
      code: `rounds = {1: [3, 5, 5, 13], 2: [8, 8, 8, 13], 3: [8, 8, 8, 8]}
for r, cards in rounds.items():
    print(f"round {r}: cards={cards} spread={max(cards) - min(cards)}")
print("consensus:", rounds[3][0], "points")`,
      explanation: {
        ar: 'الجولة الأولى: 3 و5 و5 و13 — المتطرفان يشرحان. صاحب الـ13: "التذكيرات تحتاج علم موافقة المريض، ولا يجوز قانونًا مراسلة من انسحب — حقل جديد، وترحيل، وفحص امتثال". وصاحب الـ3 لم يتخيل سوى استدعاء API. الجولة الثانية: 8 و8 و8 و13 — اقتربنا؛ وصاحب الـ13 يقرّ بأن فحص الامتثال قد يُعاد استخدامه من وحدة موجودة. الجولة الثالثة: 8 و8 و8 و8 — إجماع. لاحظ: النقاش اكتشف عملًا مخفيًا (الموافقة) وفرصة مخفية (إعادة الاستخدام) — والرقم 8 مجرد سجل لهذا الفهم المشترك.',
        en: 'Round 1: 3, 5, 5, 13 — the outliers explain. The 13: "reminders need a patient-consent flag, and legally we cannot text someone who opted out — a new field, a migration, a compliance check." The 3 had only pictured an API call. Round 2: 8, 8, 8, 13 — closer; the 13 admits the compliance check might be reused from an existing module. Round 3: 8, 8, 8, 8 — consensus. Notice: the conversation discovered hidden work (consent) and a hidden opportunity (reuse); the number 8 merely records that shared understanding.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.poker-spread',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أربع بطاقات انقلبت في الجولة الأولى لقصة "يعيد المريض حجز موعده بنفسه": 2 و3 و5 و13. أكمل الكود ليطبع أدنى بطاقة وأعلاها والانتشار (spread) والوسيط (median) — بترتيب الأسطر الأربعة نفسه.',
        en: 'Four cards flipped in round 1 for "let patients reschedule online": 2, 3, 5, 13. Complete the code to print the lowest card, the highest, the spread, and the median — in exactly that order of lines.',
      },
      starterCode: `import statistics

cards = [2, 3, 5, 13]   # round-1 cards for "reschedule online"

# TODO: lowest and highest card
lowest = None
highest = None
# TODO: spread = highest - lowest
spread = None
# TODO: median via statistics.median
median = None

print("lowest:", lowest)
print("highest:", highest)
print("spread:", spread)
print("median:", median)`,
      solution: `import statistics

cards = [2, 3, 5, 13]   # round-1 cards for "reschedule online"

lowest = min(cards)
highest = max(cards)
spread = highest - lowest
median = statistics.median(cards)

print("lowest:", lowest)
print("highest:", highest)
print("spread:", spread)
print("median:", median)`,
      tests: [
        {
          id: 't1',
          name: { ar: 'أدنى وأعلى بطاقة', en: 'lowest and highest cards' },
          code: `assert 'lowest: 2' in __learner_output__ and 'highest: 13' in __learner_output__, 'expected: lowest: 2 / highest: 13 | actual: %r' % __learner_output__`,
          expected: 'lowest: 2 | highest: 13',
        },
        {
          id: 't2',
          name: { ar: 'الانتشار 11', en: 'spread is 11' },
          code: `assert 'spread: 11' in __learner_output__, 'expected: spread: 11 | actual: %r' % __learner_output__`,
          expected: 'spread: 11',
        },
        {
          id: 't3',
          name: { ar: 'الوسيط 4.0', en: 'median is 4.0' },
          code: `assert 'median: 4.0' in __learner_output__, 'expected: median: 4.0 | actual: %r' % __learner_output__`,
          expected: 'median: 4.0',
        },
      ],
      hints: [
        {
          ar: 'الانتشار = أعلى رقم − أدنى رقم؛ هذا ما يقود النقاش في الجولة التالية.',
          en: 'Spread = highest minus lowest; this is what drives the next round of discussion.',
        },
        {
          ar: 'statistics.median في وحدة statistics القياسية: مع عدد زوجي من البطاقات يعيد متوسط العنصرين الأوسطين.',
          en: 'statistics.median from the stdlib statistics module: with an even count it returns the mean of the two middle items.',
        },
        {
          ar: 'الهيكل: lowest = min(cards)؛ highest = max(cards)؛ spread = highest - lowest.',
          en: 'Skeleton: lowest = min(cards); highest = max(cards); spread = highest - lowest.',
        },
        {
          ar: 'قريب من الحل: median = statistics.median(cards) على [2, 3, 5, 13] يعيد (3 + 5) / 2 = 4.0 — لاحظ الفاصلة العشرية في المطبوع.',
          en: 'Near-solution: median = statistics.median(cards) on [2, 3, 5, 13] gives (3 + 5) / 2 = 4.0 — note the decimal point in the printed output.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.value-cost-rank',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أربع ميزات بقيمها (1-10) وتكاليفها بالنقاط. أكمل الكود ليرتبها تنازليًا حسب value ÷ cost ويطبع أسطرًا بالصيغة "1. conflict 1.80" (نسّق النسبة بـ :.2f). لاحظ من يتقدم على من.',
        en: 'Four features with values (1-10) and costs in points. Complete the code to rank them by value / cost, best first, printing lines like "1. conflict 1.80" (format the ratio with :.2f). Notice who outranks whom.',
      },
      starterCode: `features = [
    # (name, value 1-10, cost in points)
    ("conflict", 9, 5),
    ("pdf", 4, 3),
    ("sms", 8, 8),
    ("multilang", 5, 13),
]

# TODO: sort by value/cost, best ratio first
ranked = ...

# TODO: print "1. conflict 1.80" style lines
for i, (name, v, c) in enumerate(ranked, 1):
    ...`,
      solution: `features = [
    # (name, value 1-10, cost in points)
    ("conflict", 9, 5),
    ("pdf", 4, 3),
    ("sms", 8, 8),
    ("multilang", 5, 13),
]

ranked = sorted(features, key=lambda f: f[1] / f[2], reverse=True)
for i, (name, v, c) in enumerate(ranked, 1):
    print(f"{i}. {name} {v / c:.2f}")`,
      tests: [
        {
          id: 't1',
          name: { ar: 'كشف التعارضات أولًا بـ 1.80', en: 'conflict detection first at 1.80' },
          code: `assert '1. conflict 1.80' in __learner_output__, 'expected: 1. conflict 1.80 | actual: %r' % __learner_output__`,
          expected: '1. conflict 1.80',
        },
        {
          id: 't2',
          name: { ar: 'SMS ثالثة رغم قيمتها الخام 8', en: 'SMS third despite raw value 8' },
          code: `assert '3. sms 1.00' in __learner_output__, 'expected: 3. sms 1.00 | actual: %r' % __learner_output__`,
          expected: '3. sms 1.00',
        },
        {
          id: 't3',
          name: { ar: 'تعدد اللغات أخيرًا بـ 0.38', en: 'multilang last at 0.38' },
          code: `assert '4. multilang 0.38' in __learner_output__, 'expected: 4. multilang 0.38 | actual: %r' % __learner_output__`,
          expected: '4. multilang 0.38',
        },
      ],
      hints: [
        {
          ar: 'المفتاح دالة تأخذ العنصر وتعيد قيمة الترتيب: key=lambda f: f[1] / f[2].',
          en: 'The key is a function mapping each item to its rank value: key=lambda f: f[1] / f[2].',
        },
        {
          ar: 'للترتيب التنازلي استخدم reverse=True في sorted.',
          en: 'For descending order pass reverse=True to sorted.',
        },
        {
          ar: 'الهيكل: ranked = sorted(features, key=lambda f: f[1] / f[2], reverse=True) ثم حلقة بـ enumerate(ranked, 1).',
          en: 'Skeleton: ranked = sorted(features, key=lambda f: f[1] / f[2], reverse=True), then a loop with enumerate(ranked, 1).',
        },
        {
          ar: 'قريب من الحل: print(f"{i}. {name} {v / c:.2f}") — وستجد PDF (قيمتها 4 فقط) يتقدم على SMS (قيمتها 8) لأن نسبته 1.33 مقابل 1.00.',
          en: 'Near-solution: print(f"{i}. {name} {v / c:.2f}") — you will see PDF (value only 4) outrank SMS (value 8) because 1.33 beats 1.00.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.moscow-bucket',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'متطلب: "سجل تدقيق متوافق مع HIPAA لكل من شاهد سجل مريض". بدون تتبع من فتح السجلات لا يملك التطبيق الحق في العمل في المستشفيات أصلًا. أين موضعته في MoSCoW؟',
        en: 'Requirement: "a HIPAA-compliant audit log of everyone who viewed a patient record." Without knowing who opened records, the app has no legal right to run in hospitals at all. Where does it go in MoSCoW?',
      },
      options: [
        { id: 'a', text: { ar: 'Must — بدونه الإصدار غير قانوني، وتأخره يؤخر الإصدار', en: 'Must — without it the release is illegal, and if it slips the release slips' } },
        { id: 'b', text: { ar: 'Should — مهم لكن يمكن تأجيله لإصدار لاحق', en: 'Should — important but deferrable to a later release' } },
        { id: 'c', text: { ar: 'Could — رخيص ويُسقط عند الضيق', en: 'Could — cheap and droppable when time runs short' } },
        { id: 'd', text: { ar: 'Won\u2019t — خارج النطاق نهائيًا', en: 'Won\u2019t — out of scope for good' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        {
          ar: 'اسأل سؤال Must الحاسم: هل يعمل المنتج — قانونيًا — بدونه؟',
          en: 'Ask the decisive Must question: does the product — legally — work without it?',
        },
        {
          ar: 'الاختبار ليس "هل هو ممتع؟" بل "هل غيابه يجعل الإصدار بلا فائدة أو مخالفًا؟".',
          en: 'The test is not "is it nice?" but "does its absence make the release useless or unlawful?".',
        },
        {
          ar: 'قارنه بميزة مثل الوضع الليلي: مؤلمة غيابًا لكن المنتج يبقى صالحًا للعمل.',
          en: 'Compare with a feature like dark mode: painful to omit, yet the product remains usable.',
        },
        {
          ar: 'الصحيح Must: الاعتماد القانوني يجعل الإصدار بدونه ممنوعًا — أي أن الموعد نفسه مرتبط به.',
          en: 'Correct: Must — a legal dependency makes the release forbidden without it, so the date itself is bound to it.',
        },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.weighted-trace',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'الصيغة الموزونة (value + risk reduction) ÷ cost مطبقة على بندين: كشف التعارضات (قيمة 9، تخفيض خطر 2، تكلفة 5) وتكامل الدفع (7، 9، 8). ما المطبوع بالضبط؟',
        en: 'The weighted formula (value + risk reduction) / cost applied to two items: conflict detection (value 9, risk reduction 2, cost 5) and payment integration (7, 9, 8). What exactly gets printed?',
      },
      code: `items = [("conflict", 9, 2, 5), ("payment", 7, 9, 8)]
for name, v, r, c in items:
    print(name, (v + r) / c)`,
      answer: 'conflict 2.2\npayment 2.0',
      solution: 'conflict 2.2\npayment 2.0',
      hints: [
        {
          ar: 'لكل بند اجمع البسط أولًا: (9 + 2) ثم اقسم على المقام.',
          en: 'For each item add the numerator first: (9 + 2), then divide by the denominator.',
        },
        {
          ar: 'print مع فاصلتين يفصل الاسم عن النسبة بفراغ واحد، وPython يطبع 2.2 لا 2.20.',
          en: 'print with two arguments joins name and ratio with one space, and Python prints 2.2, not 2.20.',
        },
        {
          ar: 'conflict: (9 + 2) / 5. وpayment: (7 + 9) / 8.',
          en: 'conflict: (9 + 2) / 5. payment: (7 + 9) / 8.',
        },
        {
          ar: 'قريب من الحل: السطران "conflict 2.2" ثم "payment 2.0" — الخطر رفع الدفع فوق ميزتين أكثر راحة.',
          en: 'Near-solution: the two lines "conflict 2.2" then "payment 2.0" — risk lifted payment above two comfier features.',
        },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: `# مجرب الأولويات: غيّر القيم والتكاليف وراقب الترتيب
# The priority bench: change values and costs, watch the order flip
features = [
    ("conflict", 9, 5),
    ("pdf", 4, 3),
    ("sms", 8, 8),
    ("multilang", 5, 13),
]

print("== value / cost ==")
for i, (name, v, c) in enumerate(sorted(features, key=lambda f: f[1] / f[2], reverse=True), 1):
    print(f"{i}. {name} {v / c:.2f}")

print("== (value + risk reduction) / cost ==")
risk = {"conflict": 2, "pdf": 1, "sms": 5, "multilang": 2}
for i, (name, v, c) in enumerate(sorted(features, key=lambda f: (f[1] + risk[f[0]]) / f[2], reverse=True), 1):
    print(f"{i}. {name} {(v + risk[name]) / c:.2f}")

# جرّب: ارفع risk["sms"] إلى 9 — أين تقفز SMS؟`,
      prompt: {
        ar: 'قارن الترتيبين: value ÷ cost وحدها، ثم مع عمود تخفيض المخاطرة. ارفع تخفيض خطر SMS إلى 9 وشاهد قفزها. متى يقلب العمود الثالث الترتيب كله؟',
        en: 'Compare the two rankings: plain value / cost, then with a risk-reduction column. Raise the SMS risk reduction to 9 and watch it jump. When does the third column flip the whole order?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz.ch4.l2',
      items: [
        {
          id: 'q1.ch3-stakeholders',
          question: {
            ar: 'لماذا يضمّن Wideband Delphi خبراء من مجالات مختلفة بدل خبير واحد كبير؟',
            en: 'Why does Wideband Delphi gather experts from different areas instead of one senior expert?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الخبير الواحد أغلى ثمنًا', en: 'Because one expert costs more' } },
            { id: 'b', text: { ar: 'لأن كل مشارك رأى أثناء الاستنباط (الفصل 3) مخاطرًا مختلفة: خبير البيانات يعرف الترحيل والمختبر يعرف الحالات الحدية', en: 'Because each participant saw different risks during elicitation (Chapter 3): the data expert knows the migration, the tester knows the edge cases' } },
            { id: 'c', text: { ar: 'لأن الأغلبية تصوّت أسرع', en: 'Because a majority votes faster' } },
            { id: 'd', text: { ar: 'لأن المجموعات الكبيرة لا تحتاج نقاشًا', en: 'Because large groups need no discussion' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'قيمة الإجماع أن أصحاب المصلحة المختلفين يرون مخاطر مختلفة؛ الجمع المنظّم لمعارفهم يكشف العمل المخفي الذي يغيب عن أي فرد.',
            en: 'Consensus pays because different stakeholders see different risks; combining their knowledge in a structured way surfaces hidden work no single person would catch.',
          },
        },
        {
          id: 'q2.anchoring',
          question: {
            ar: 'ما الخطوة التي تهزم المرساة في Planning Poker؟',
            en: 'Which step of Planning Poker defeats anchoring?',
          },
          options: [
            { id: 'a', text: { ar: 'أن يعطي قائد الفريق تقديره أولًا ليكون مرجعًا', en: 'Having the lead give their estimate first as a reference' } },
            { id: 'b', text: { ar: 'حساب المتوسط فور كشف البطاقات', en: 'Averaging immediately after the cards flip' } },
            { id: 'c', text: { ar: 'اختيار البطاقات سرًّا قبل أن يتكلم أحد، ثم كشفها كلها معًا', en: 'Picking cards privately before anyone speaks, then revealing them all at once' } },
            { id: 'd', text: { ar: 'أخذ أقل رقم ليكون التقدير متحفظًا', en: 'Taking the lowest number so the estimate is conservative' } },
          ],
          answer: 'c',
          explanation: {
            ar: 'الالتزام السري قبل السماع يقطع الطريق على المرساة: لا يوجد "رقم أول" يسحب البقية نحوه، والخلاف يظهر صريحًا ليُناقش.',
            en: 'A private commitment before hearing anyone leaves no first number to drag the rest; disagreement then shows up openly for discussion.',
          },
        },
        {
          id: 'q3.moscow-cap',
          question: {
            ar: 'لماذا نُبقي الـMust عند نحو 60% من الجهد أو أقل؟',
            en: 'Why keep Musts to roughly 60% or less of the effort?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن الـMust عناصر أغلى دائمًا', en: 'Because Musts are always the most expensive items' } },
            { id: 'b', text: { ar: 'لأن قائمة كلها Musts لا هامش فيها: أول تأخير يكسر وعدًا، والـCould وسادة تمتص الصدمة', en: 'Because an all-Must backlog has no margin: the first delay breaks a promise, and the Coulds are the shock absorbers' } },
            { id: 'c', text: { ar: 'لأن العملاء يكرهون سماع كلمة Must', en: 'Because customers dislike hearing the word Must' } },
            { id: 'd', text: { ar: 'قاعدة ضريبية لا علاقة لها بالبرمجيات', en: 'A tax rule with nothing to do with software' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'إن كان كل شيء Mustًا فقدت أولوياتك معناها: لا شيء يمكن إسقاطه عند الضيق. الـCould هي ما يجعل الإصابة بالموعد ممكنة بشيء قابل للنشر.',
            en: 'If everything is a Must, prioritization has no meaning: nothing can be dropped when time runs short. The Coulds are what make hitting the date with something shippable possible.',
          },
        },
        {
          id: 'q4.weighted',
          question: {
            ar: 'قيمة القصة 7، وتخفيض مخاطرتها 9، وتكلفتها 8 نقاط. ما weighted priority لها؟',
            en: 'A story has value 7, risk reduction 9, and cost 8 points. What is its weighted priority?',
          },
          options: [
            { id: 'a', text: { ar: '1.00', en: '1.00' } },
            { id: 'b', text: { ar: '2.00', en: '2.00' } },
            { id: 'c', text: { ar: '2.20', en: '2.20' } },
            { id: 'd', text: { ar: '0.875', en: '0.875' } },
          ],
          answer: 'b',
          explanation: {
            ar: '(7 + 9) ÷ 8 = 2.0 — تخفيض الخطر يضاف إلى البسط لا يطرح منه، وهذا ما يجذب العمل غير المؤكد إلى الأمام.',
            en: '(7 + 9) / 8 = 2.0 — risk reduction is added to the numerator, which is exactly what pulls uncertain work forward.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'اختلفوا في البطاقات؟ خذ المتوسط وانتهى النقاش.',
          right: 'اسأل صاحب أعلى رقم وصاحب أدناه: لماذا؟ ثم أعد التصويت.',
          note: {
            ar: 'المتوسط يضيّع أغلى معلومة في الغرفة: سبب الخلاف. صاحب الـ13 يعرف عن الترحيل والامتثال ما لا يعرفه البقية، أو أساء فهم القصة — الحالتان تُحلّان بالنقاش لا بالحساب.',
            en: 'Averaging discards the most valuable information in the room: the reason for the disagreement. The 13-player knows about the migration and compliance what others do not, or misunderstood the story — both are fixed by conversation, not arithmetic.',
          },
        },
        {
          wrong: 'الصوت الأعلى أو الأقدم وظيفيًا يحدد التقدير للجميع.',
          right: 'بطاقات سرية تُكشف معًا — التزام قبل سماع أي رقم.',
          note: {
            ar: 'المرساة الاجتماعية أخطر من الرقمية: الناس يتقاربون على رأي المدير أو أول من تكلّم بلا نقاش حقيقي. ومن هنا أصل Delphi: إخفاء الهوية زائد التكرار زائد تلخيص إحصائي.',
            en: 'The social anchor is worse than the numeric one: people converge on the boss\u2019s view or the first speaker without real discussion. Hence Delphi\u2019s core: anonymity plus iteration plus statistical feedback.',
          },
        },
        {
          wrong: 'الصيغة رتبت payment قبل SMS — ننفذ ولا نقاش فوقها.',
          right: 'الصيغة تنظّم النقاش؛ الفريق يتجاوزها إذا علمت شيئًا لا تعرفه.',
          note: {
            ar: 'مدخلات الصيغة أحكام بشرية، وشكلها يرمّز استراتيجية (هنا: مواجهة الخطر مبكرًا). الجدول أداة تفكير لا وحيًا — استخدمه ليقود الحوار، ثم تجاوزه عند علم إضافي.',
            en: 'The formula\u2019s inputs are human judgments, and its shape encodes a strategy (here: confront risk early). A spreadsheet is a thinking aid, not an oracle — use it to structure the conversation, then override it when the team knows more.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        {
          ar: 'الإجماع المنظّم: تقدير سرّي، كشف جماعي، تفسير المتطرفين، إعادة تصويت — Planning Poker للسرعة وDelphi بإخفاء الهوية.',
          en: 'Structured consensus: private estimates, simultaneous reveal, outlier explanations, re-vote — Planning Poker for speed, Delphi for anonymity.',
        },
        {
          ar: 'MoSCoW يفرز القائمة، وقاعدة الـ60% تحفظ هامشًا — والأولوية لا تكون حقيقية إلا إذا كان بإمكانها أن تؤلم.',
          en: 'MoSCoW sorts the backlog and the 60% rule keeps margin — prioritization is only real if it can hurt.',
        },
        {
          ar: 'value ÷ cost يرتب داخل الخانة (أفضل عائد لكل نقطة)، و(value + risk reduction) ÷ cost يسحب العمل الخطر إلى الأمام.',
          en: 'value / cost ranks within a bucket (best return per point); (value + risk reduction) / cost pulls risky work early.',
        },
        {
          ar: 'ستنتهي من الوقت أو المال: اجعل غير المنجز هو الأقل أهمية.',
          en: 'You will run out of time or money: make the unfinished work the least important.',
        },
      ],
      reflectPrompt: {
        ar: 'متى صوّت فريقك آخر مرة ببطاقات سرية؟ ماذا كان سيظهر لو كُشفت البطاقات قبل النقاش — ومن كان صاحب الرقم المتطرف ولماذا؟',
        en: 'When did your team last vote with private cards? What would the reveal have exposed — and who held the outlier number, and why?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch4.s3', pages: 'ص101-102 / pp.101-102' },
        { book: 'SWE', section: 'swe.ch4.s4', pages: 'ص102-105 / pp.102-105' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch4.s3', pages: 'ص101-102 / pp.101-102' },
    { book: 'SWE', section: 'swe.ch4.s4', pages: 'ص102-105 / pp.102-105' },
  ],
} satisfies Lesson;

export default lesson;
