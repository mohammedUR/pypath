import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch2.l4 — "Project Risks and the Spiral Framework"
 * مخاطر المشروع وإطار الحلزون
 * Aligned with SWE ch2 s6 (Additional Project Risks, pp.48-50) +
 * s7 (Risk Reduction: The Spiral Framework, pp.50-51).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: a deterministic spiral stepper over a fixed risk register —
 * risks ranked by exposure (probability x impact), each loop resolves the top
 * remaining risk via prototype, with an explicit go/no-go threshold stop.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
const lesson = {
  id: 'swe.ch2.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 2,
  title: { ar: 'مخاطر المشروع وإطار الحلزون', en: 'Project Risks and the Spiral Framework' },
  estimatedMinutes: 30,
  prerequisites: ['swe.ch2.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'فريقان، الفكرة نفسها: بوابة حجز مواعيد للمرضى تتكامل مع نظام جدولة قديم. الأول يقضي ربعين يبني الإصدار الكامل دفعة واحدة — والثاني يقضي أسبوعين يبني شريحة رقيقة: نوع موعد واحد، بلا دفع، على نسخة من الجدول الحقيقي، يعرضها على اثني عشر مريضًا حقيقيًا. الفرق بينهما ليس موهبة ولا جهدًا — بل مكان اختيار كل فريق للقاء أكبر مخاطره. الأول سيكتشف هل التكامل يعمل بعد ربعين؛ والثاني يعرف بعد أسبوعين. هذا الدرس يعلّمك عدّ المخاطر قبل وقوعها: التعرض = الاحتمال × الأثر، وأصنافها واستراتيجياتها، ثم إطار الحلزون الذي يجعل المخاطرة هي من تقود خطوتك التالية — وستبني دوّارًا يحسم كل دورة بأخطر خطر باقٍ.',
        en: 'Two teams, the same idea: a patient appointment-booking portal integrating with a legacy scheduling system. One spends two quarters building the full release in one go — the other spends two weeks on a deliberately thin slice: one appointment type, no payments, against a copy of the real schedule, shown to twelve real patients. The difference is not talent or effort — it is where each team chose to meet its biggest risks. The first learns whether the integration works after two quarters; the second after two weeks. This lesson teaches you to count risks before they happen: exposure = probability x impact, their categories and strategies — then the spiral framework, which makes risk itself steer your next move, and you will build a stepper that spends each cycle on the biggest remaining risk.',
      },
    },
    {
      kind: 'predict',
      code: "RISKS = [('R1', 4, 5), ('R2', 2, 5), ('R3', 3, 2)]\nfor rid, p, i in RISKS:\n    print(rid, p * i)",
      question: {
        ar: 'ثلاث مخاطر: (الاسم، الاحتمال، الأثر). أيها تهاجم أولًا — ولماذا لا يكفي النظر إلى عمود الاحتمال وحده؟',
        en: 'Three risks as (name, probability, impact). Which do you attack first — and why is looking at the probability column alone not enough?',
      },
      reveal: {
        ar: 'الطباعة: R1 20 ثم R2 10 ثم R3 6. الترتيب بالتعرض: الاحتمال × الأثر. R3 محتمل (3) لكنه تافه الأثر (2) — فيرتب الأخير؛ بينما خطر نادر كارثي الأثر قد يسبق خطرًا محتملًا تافهًا. الفرق الجيد يسرّد المخاطر المرجحة مسبقًا وهاجم الأكبر أولًا — والقائمة بلا ترتيب بالتعرض مجرد قلق مرقّم.',
        en: 'It prints R1 20, then R2 10, then R3 6. The order is by exposure: probability x impact. R3 is fairly likely (3) but trivial in impact (2) — so it ranks last; a rare but catastrophic risk outranks a likely trivial one. Good teams enumerate likely risks in advance and attack the biggest first — a list without an exposure ranking is just numbered anxiety.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'المخاطر: عدّها قبل أن تحدث', en: 'Risks: count them before they happen' },
      chunks: [
        {
          ar: 'المخاطرة مشكلة مستقبلية محتملة: لم تقع بعد لكنها قد تقع باحتمال ما وتسبب خسارة ما — ومن المفيد التفريق بينها وبين المشكلة الواقعة فعلًا. الفرق الجيد لا يتفاعل فقط؛ يسرد المرجحة مسبقًا ويهاجم الأكبر أولًا. ولا تحتاج منهجية ثقيلة: تقييم خشن يرتب المخاطر بالتعرض exposure ≈ الاحتمال × الأثر كي تصرف انتباهك المحدود حيث يستحق — عيب محتمل جدًا لكنه تافه يرتب تحت عيب نادر كارثي. والأصناف الشائعة في مشاريع البرمجيات: مخاطر المتطلبات — تبني الشيء الخطأ أو تتقلب المتطلبات؛ التقنية — تقنية أو خوارزمية أو تكامل غير مجرب قد لا ينجح؛ الجدولة والتقدير — العمل أكبر مما قُدّر؛ الناس — يرحل مساهم مفتاحي أو تنقص مهارة لازمة؛ الخارجي — مورّد أو جهة تنظيمية تتصرف عكس التوقع.',
          en: 'A risk is a potential future problem: it has not gone wrong yet but could, with some probability, causing some loss — useful to distinguish from the problem that has actually happened. Good teams do not just react; they enumerate the likely ones in advance and attack the biggest first. No heavy methodology needed: a rough assessment ranks risks by exposure, roughly probability x impact, so your limited attention goes where it matters — a very likely but trivial defect ranks below a rare catastrophic one. Common categories on software projects: requirements risk — building the wrong thing or churn; technical risk — an unproven technology, algorithm, or integration might not work; schedule and estimation risk — the work is larger than estimated; people risk — key contributors leave or a needed skill is missing; external risk — a vendor or regulator behaves unexpectedly.',
        },
        {
          ar: 'تصبح القائمة نافعة حين يقابل كل خطر مهم استجابة معلنة، ولكل خطر كبير تختار استراتيجية: تجنّبه — غيّر الخطة حتى لا يمكن وقوعه أصلًا؛ أو خفّضه — قلّل احتماله أو أثره، كأن تنمذج أوليًا المكوّن الخطِم مبكرًا؛ أو حوّله — تأمين أو اتفاقية مستوى خدمة مع مورّد؛ أو اقبله عن علم بعد تكلّف حسابه. وتقنية تخفيض المخاطر الأخطر في البرمجيات كلها هي التي دار حولها هذا الفصل كله: كرّر — لتواجه كل خطر مبكرًا رخيصًا بدل متأخرًا باهظًا. وقصتا الدرس تريان ذلك بنِيويًا: فريق بوابة المرضى هاجم غموضه برقيقة شريحة في أول سبرنت — فأجابت عن أكبر سؤالين: هل سيستخدمها المرضى؟ وهل يعمل التكامل؟ — وثمن الخطأ أسبوعان لا ربعان.',
          en: 'The list becomes useful when every significant risk gets a declared response: avoid it — change the plan so it cannot occur at all; mitigate it — reduce its probability or impact, say by prototyping the risky component early; transfer it — insurance or a vendor SLA; or knowingly accept it after costing it. And the single most powerful risk-reduction technique in software is the one this whole chapter has circled: iterate — confronting each risk early and cheaply instead of late and expensively. The lesson\u2019s two tales show it structurally: the patient-portal team attacked its uncertainty with a thin first-sprint slice that answered the two biggest questions — will patients use it? does the integration work? — at a cost of being wrong of two weeks, not two quarters.',
        },
        {
          ar: 'والقصة المقابلة محذّر من تاريخ المتصفحات: في منتصف التسعينيات صنّاع متصفح ناجح جدًا قرروا لأجل النسخة الكبرى ألا يطوّروا الشيفرة العاملة بل يعيدوا كتابة أجزاء واسعة دفعة واحدة — مشروع كبير طموح شبه مسبق التخطيط. ثبت أن إعادة الكتابة أصعب وأبطأ بكثير مما خُطط: الدمج أليم، والنظام الجديد غير مستقر طويلًا، والإصدار انزلق بحدة بينما المنافسون يشحنون تحسينات متتابعة. حين استقر الخليفة كان الفريق قد سال دمه في الجدولة والجودة وموقع السوق. المبدأ الذي يستحق التعليق على حائطك: فضّل تطوير البرمجية العاملة على إعادة كتابتها بالجملة — إعادة الكتابة تهدر المعرفة المدمجة في شيفرة تعالج ألف حالة حدية، وتحشد مخاطر التكامل والجدولة كلها مرة واحدة: التركيز نفسه للخطر الذي صُنعت العمليات الجيدة لتفاديته.',
          en: 'The counter-tale comes from browser history: in the mid-1990s, the maker of a hugely successful browser decided that for the next major version it would not evolve the working codebase but rewrite large parts of it at once — a big, ambitious, mostly up-front effort. The rewrite proved far harder and slower than planned: integration was painful, the new system unstable for a long stretch, the release slipped badly while competitors kept shipping steady improvements. By the time the successor stabilized, the organization had bled schedule, quality and market position. The principle for your wall: prefer evolving working software to rewriting it wholesale — a rewrite discards hard-won knowledge embedded in code that already handles a thousand edge cases, and concentrates integration and schedule risk all at once: exactly the concentration of risk good process exists to avoid.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الحلزون: المخاطرة تقود الخطوة التالية', en: 'The spiral: risk steers the next move' },
      chunks: [
        {
          ar: 'نموذج الحلزون إطار عمليات صريح يقوده الخطر: مخاطر مشروعك أنت — لا جدول ثابت — هي التي تقرر ماذا تفعل تالٍ. وهو أفضل فهم كإطار فوق الأطر لا منافس للشلال أو الرشاقة: في كل دورة يخبرك أي أسلوب تطبق بحسب مكمن أكبر شكوكك. تتقدم في سلسلة حلقات تتسع كلما صار المشروع أكثر إسمنتًا وأغلى، وتمر كل حلقة بأربعة أفعال: حدّد أهداف الدورة وبدائلها وقيودها — ماذا نريد وكيف قد نصل إليه؛ ثم قيّم البدائل وحدّد أكبر خطر حالي وهاجمه — وهذا قلب النموذج: غالبًا بنموذج أولي أو تجربة تحوّل المجهول إلى معلوم؛ ثم طوّر سلّمة هذه الدورة وتحقق منه؛ ثم خطط الدورة التالية — وأهم من ذلك: قرر بحسم إن كنت ستكمل أصلًا.',
          en: 'The spiral model is an explicitly risk-driven process framework: your project\u2019s own risks — not a fixed schedule — decide what you do next. It is best understood as a meta-framework, not a rival to waterfall or agile: each turn picks the approach by where your biggest uncertainties lie. You proceed in loops that spiral outward as the project grows more concrete and more expensive; every loop passes through four activities: determine the round\u2019s objectives, alternatives and constraints — what we aim for and how; evaluate the alternatives and identify and resolve risks — the heart of the model: find the biggest current risk and attack it, often by building a prototype or running an experiment that turns an unknown into a known; develop and verify the deliverable for this round; and plan the next round — critically, deciding whether to continue at all.',
        },
        {
          ar: 'لأن كل حلقة تبدأ بمواجهة أكبر خطر باقٍ، يقدّم الحلزون التعلم عما يُغرق المشروع على الأرجح. مشروع بالغ الغموض يقضي حلقاته الأولى في نماذج أولية ودراسات جدوى؛ ومشروع ينضج يستقر على حلقات بناء وتحقق أشبه بالشلال — النموذج يختار الأنسب بحسب المخاطر لا العادة. وبُني فيه قرار مواصلة/توقف صريح: بعد كل حلقة قد تحكم أن المخاطر أعلى من اللازم فتتوقف، وقد أنفقت ميزانية حلقة واحدة لا المشروع كله. وروح الحلزون والروح الرشيقة ابنا عمّة: كلاهما يكرر ويقدّس التغذية المبكرة ويرفض الرهان الكامل على خطة مسبقة؛ الحلزون يشدّد التحليل الصريح للخطر والنمذجة ويناسب الأكبر والأعلى رهانًا، والرشاقة تشدد برمجية عاملة متكررة وتعاون الزبون وتناسب الأسرع والأصغر. وكلاهما جواب للسؤال الذي يسأله الفصل كله: كيف تعرف أنك أخطأت والخطأ ما يزال رخيصًا؟',
          en: 'Because each loop starts by confronting the biggest remaining risk, the spiral front-loads learning about whatever is most likely to sink the project. A wildly uncertain project spends early loops on prototypes and feasibility studies; a maturing one settles into waterfall-like build-and-verify loops — the model picks by risk, not habit. It builds in an explicit go/no-go decision: after each loop you may judge the risks too high and stop, having spent only that loop\u2019s budget, not the whole project\u2019s. Spiral and agile spirits are close cousins: both iterate, both prize early feedback, both refuse to bet everything on an up-front plan; the spiral emphasizes explicit risk analysis and prototyping, suiting larger, higher-stakes projects, while agile emphasizes frequent working software and customer collaboration, suiting smaller, faster ones. Both answer the question the whole chapter asks: how do you find out you were wrong while being wrong is still cheap?',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'سجل مخاطر ودوّار حلزوني', en: 'A risk register and a spiral stepper' },
      code: "RISKS = [\n    ('R1', 'technical', 4, 5),\n    ('R2', 'requirements', 3, 4),\n    ('R3', 'external', 1, 5),\n    ('R4', 'schedule', 2, 2),\n]\n\npending = sorted(RISKS, key=lambda r: r[2] * r[3], reverse=True)\nloop_no = 0\nwhile pending:\n    loop_no += 1\n    rid, cat, p, imp = pending.pop(0)\n    print('loop %d: attack %s (%s) exposure %d -> prototype' % (loop_no, rid, cat, p * imp))\nprint('loops: %d' % loop_no)",
      explanation: {
        ar: 'الدوّار يحاكي حلقات الحلزون على سجل ثابت: الترتيب بالتعرض يجعل R1 (تقنية، 20) هدف الحلقة الأولى، ثم R2 (متطلبات، 12)، ثم R3 (خارجي، 5) وR4 (جدولة، 4). كل سطر دورة كاملة مختصرة: الهدف هو هذا الخطر، والهجوم نموذج أولي يحوّل المجهول إلى معلوم، والتحقق ضمن بناء الدورة، والتخطيط هو استمرار while. في الواقع قد تتوقف الحلقات بقرار توقف/مواصلة إن بقي خطر أعلى من اللازم — وستضيف ذلك في التمرين: في المشاريع الحقيقية أيضًا قد تظهر مخاطر جديدة وتعيد ترتيب السجل بين الدورات.',
        en: 'The stepper simulates spiral loops over a fixed register: ranking by exposure makes R1 (technical, 20) loop one\u2019s target, then R2 (requirements, 12), then R3 (external, 5) and R4 (schedule, 4). Each line is a compressed full cycle: the objective is this risk, the attack a prototype turning unknown into known, verification inside the round\u2019s build, and the while loop itself is the planning step. In reality the loops may also stop with a go/no-go if a risk stays too high — which you will add in the exercise: and on real projects new risks surface and re-rank the register between cycles.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.trace-exposure',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. تذكّر: الترتيب تنازلي بالتعرض.',
        en: 'Read the code and predict its exact output — one line per print — without running it. Recall: the order is descending by exposure.',
      },
      code: "R = [('A', 2, 5), ('B', 4, 3), ('C', 1, 5)]\nfor rid, p, i in sorted(R, key=lambda r: r[1] * r[2], reverse=True):\n    print('%s: %d' % (rid, p * i))",
      solution: "B: 12\nA: 10\nC: 5",
      answer: "B: 12\nA: 10\nC: 5",
      hints: [
        { ar: 'احسب التعرض لكل خطر: A = 2 × 5، وB = 4 × 3، وC = 1 × 5.', en: 'Compute each exposure: A = 2 x 5, B = 4 x 3, C = 1 x 5.' },
        { ar: 'النتائج: A = 10 وB = 12 وC = 5 — فالترتيب التنازلي: B ثم A ثم C.', en: 'The values: A = 10, B = 12, C = 5 — descending: B, then A, then C.' },
        { ar: 'لاحظ أن B سبقت A رغم احتمالها الأعلى أصلًا — الأثر حسمها: هذا هو معنى التعرض.', en: 'Note B outranks A despite A starting with the same probability product — the product itself decided: that is exposure.' },
        { ar: 'الخرج:\nB: 12\nA: 10\nC: 5', en: "The output:\nB: 12\nA: 10\nC: 5" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.spiral-stepper',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل spiral_loops(risks) — سجل أزواج رباعية (المعرف، الصنف، الاحتمال، الأثر) وثابت THRESHOLD = 6. كل دورة: إن كان التعرض الأعلى الباقي أقل من THRESHOLD اطبع no-go: top remaining exposure %d below %d وتوقف (قرار توقف/مواصلة)؛ وإلا فهاجم أعلى خطر: انزعه من السجل وأضف معرفه إلى resolved واطبع loop %d: attack %s (%s) exposure %d -> prototype. بعد الحلقة، إن نضب السجل اطبع all risks resolved. أعد قائمة المعرفات المحلولة واستدعِ الدالة على RISKS المعطاة.',
        en: 'Complete spiral_loops(risks) — a register of (id, category, probability, impact) tuples with THRESHOLD = 6. Each loop: if the highest remaining exposure is below THRESHOLD, print no-go: top remaining exposure %d below %d and stop (a go/no-go decision); otherwise attack the top risk: pop it from the register, append its id to resolved, and print loop %d: attack %s (%s) exposure %d -> prototype. After the loop, if the register drained, print all risks resolved. Return the list of resolved ids and call the function on the given RISKS.',
      },
      starterCode: "THRESHOLD = 6\n\ndef spiral_loops(risks):\n    pending = sorted(risks, key=lambda r: r[2] * r[3], reverse=True)\n    resolved = []\n\n    # TODO: كل دورة إما تهاجم أعلى خطر أو تتوقف بقرار no-go تحت العتبة\n    # TODO: each loop either attacks the top risk or stops with a no-go below the threshold\n\n    return resolved\n\nRISKS = [\n    ('R1', 'technical', 4, 5),\n    ('R2', 'requirements', 3, 4),\n    ('R3', 'external', 1, 5),\n    ('R4', 'schedule', 2, 2),\n]\nresult = spiral_loops(RISKS)\n",
      solution: "THRESHOLD = 6\n\ndef spiral_loops(risks):\n    pending = sorted(risks, key=lambda r: r[2] * r[3], reverse=True)\n    resolved = []\n    loop_no = 0\n    while pending:\n        exp = pending[0][2] * pending[0][3]\n        if exp < THRESHOLD:\n            print('no-go: top remaining exposure %d below %d' % (exp, THRESHOLD))\n            break\n        loop_no += 1\n        rid, cat, p, imp = pending.pop(0)\n        resolved.append(rid)\n        print('loop %d: attack %s (%s) exposure %d -> prototype' % (loop_no, rid, cat, exp))\n    if not pending:\n        print('all risks resolved')\n    return resolved\n\nRISKS = [\n    ('R1', 'technical', 4, 5),\n    ('R2', 'requirements', 3, 4),\n    ('R3', 'external', 1, 5),\n    ('R4', 'schedule', 2, 2),\n]\nresult = spiral_loops(RISKS)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الحلقة الأولى تهاجم أخطر خطر', en: 'Loop one attacks the top risk' },
          code: "assert 'loop 1: attack R1 (technical) exposure 20 -> prototype' in __learner_output__, 'expected: loop 1 attacks R1 at exposure 20 | actual: %r' % __learner_output__",
          expected: 'loop 1 attacks R1 at exposure 20',
        },
        {
          id: 't2',
          name: { ar: 'المحلولة اثنان بالترتيب', en: 'Two risks resolved in order' },
          code: "assert result == ['R1', 'R2'], 'expected: R1 then R2 | actual: %r' % (result,)",
          expected: "['R1', 'R2']",
        },
        {
          id: 't3',
          name: { ar: 'قرار التوقف صريح عند العتبة', en: 'The go/no-go stop is explicit at the threshold' },
          code: "assert 'no-go: top remaining exposure 5 below 6' in __learner_output__, 'expected: no-go at exposure 5 below 6 | actual: %r' % __learner_output__",
          expected: 'no-go at exposure 5 below 6',
        },
        {
          id: 't4',
          name: { ar: 'سجل آخر ينضب تمامًا', en: 'Another register drains completely' },
          code: "other = spiral_loops([('X', 'people', 3, 3)])\nassert other == ['X'], 'expected: X resolved | actual: %r' % (other,)",
          expected: 'X resolved then all risks resolved',
        },
      ],
      hints: [
        { ar: 'التعرض لأعلى خطر باقٍ هو pending[0][2] * pending[0][3] لأن القائمة مرتبة تنازليًا — قارنه بـ THRESHOLD قبل أي شيء.', en: 'The top remaining exposure is pending[0][2] * pending[0][3] because the list is sorted descending — compare it with THRESHOLD before anything else.' },
        { ar: 'استخدم while pending: وفي داخلها إذا كان التعرض أقل من العتبة اطبع no-go واعمل break؛ وإلا فزد عداد الدورات وانزع العنصر بـ pop(0) وأضف معرفه.', en: 'Use while pending: — inside, if the exposure is below the threshold print no-go and break; otherwise increment the loop counter, pop(0), and append the id.' },
        { ar: 'الخطوات: X تعرض 9 (3×3) فتُهاجم؛ ثم R3 تعرض 5 وR4 تعرض 4 — كلاهما تحت 6 فيصدر no-go عند أول فحص.', en: 'Trace: X has exposure 9 (3x3) so it is attacked; then R3 at 5 and R4 at 4 — both below 6, so the no-go fires at the first check.' },
        { ar: 'الهيكل:\nwhile pending:\n    exp = pending[0][2] * pending[0][3]\n    if exp < THRESHOLD:\n        print(\'no-go: top remaining exposure %d below %d\' % (exp, THRESHOLD))\n        break\n    rid, cat, p, imp = pending.pop(0)\n    resolved.append(rid)\n    print(\'loop %d: attack %s (%s) exposure %d -> prototype\' % (len(resolved), rid, cat, exp))\nif not pending:\n    print(\'all risks resolved\')', en: "The skeleton:\nwhile pending:\n    exp = pending[0][2] * pending[0][3]\n    if exp < THRESHOLD:\n        print('no-go: top remaining exposure %d below %d' % (exp, THRESHOLD))\n        break\n    rid, cat, p, imp = pending.pop(0)\n    resolved.append(rid)\n    print('loop %d: attack %s (%s) exposure %d -> prototype' % (len(resolved), rid, cat, exp))\nif not pending:\n    print('all risks resolved')" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-transfer',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'اعتماد مشروعكم على مورّد بيانات خارجي يتأخر مرارًا. بدل تغيير خطة البناء، وقّع الفريق اتفاقية مستوى خدمة بعقوبات وبند بديل. أي استجابة مخاطرة هذه؟',
        en: 'Your project depends on an external data vendor that keeps slipping. Instead of changing the build plan, the team signs an SLA with penalties and a fallback clause. Which risk response is this?',
      },
      options: [
        { id: 'a', text: { ar: 'تجنّب — لأن الخطة لم تتغير', en: 'Avoid — because the plan did not change' } },
        { id: 'b', text: { ar: 'خفض — لأن العقوبة تقلل احتمال التأخر', en: 'Mitigate — because the penalty reduces the probability of slipping' } },
        { id: 'c', text: { ar: 'تحويل — نقل كلفة الخطر إلى طرف آخر بعقد (تأمين، اتفاقية مستوى خدمة)', en: 'Transfer — shifting the risk\u2019s cost to another party by contract (insurance, a vendor SLA)' } },
      ],
      answer: 'c',
      solution: 'c',
      hints: [
        { ar: 'للاستجابات ثلاثة أسماء: تجنّب، خفض، تحويل — اسأل أين ذهبت كلفة الخطر.', en: 'The responses have three names: avoid, mitigate, transfer — ask where the risk cost went.' },
        { ar: 'العقد لا يغيّر خطة البناء ولا يقلل احتمال التأخر: يشتري طرفًا ثالثًا يحمل الكلفة.', en: 'The contract neither changes the plan nor reduces slip probability: it buys a third party to carry the cost.' },
        { ar: 'التأمين واتفاقيات مستوى الخدمة هما المثال الحرفي لإحدى الاستجابات الثلاث.', en: 'Insurance and vendor SLAs are the literal example of one of the three responses.' },
        { ar: 'الجواب c — تحويل: نقل كلفة الخطر إلى طرف آخر بعقد، لا إلغاء الخطر ولا تقليله داخليًا.', en: 'Answer c — transfer: shifting the risk cost to another party by contract, not removing or reducing it internally.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-impact',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'التعرض التقريبي للمخاطرة = الاحتمال × ال____ — به نرتب السجل ونهاجم الأعلى أولًا. (كلمة إنجليزية واحدة)',
        en: 'A risk\u2019s rough exposure = probability x ____, and the register is ranked by it, attacking the top first. (one English word)',
      },
      answer: 'impact',
      solution: 'impact',
      hints: [
        { ar: 'هو ثاني عاملي التعرض: شيئان — كم هو محتمل، وكم يخسر لو وقع.', en: 'It is the second factor of exposure: two questions — how likely, and how much loss if it happens.' },
        { ar: 'لهذا يسبق الخطر النادر الكارثي الخطر المحتمل التافه.', en: 'This is why a rare catastrophic risk outranks a likely trivial one.' },
        { ar: 'في كود الدرس: r[2] * r[3] — العامل الثاني هو الأثر.', en: 'In the lesson\u2019s code: r[2] * r[3] — the second factor is this.' },
        { ar: 'الجواب: impact', en: 'Answer: impact' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "RISKS = [\n    ('R1', 'technical', 4, 5),\n    ('R2', 'requirements', 3, 4),\n    ('R3', 'external', 1, 5),\n    ('R4', 'schedule', 2, 2),\n]\n\n# الدوّار: كل دورة تهاجم أعلى خطر باقٍ بالتعرض\n# the stepper: each loop attacks the highest remaining exposure\npending = sorted(RISKS, key=lambda r: r[2] * r[3], reverse=True)\nloop_no = 0\nwhile pending:\n    loop_no += 1\n    rid, cat, p, imp = pending.pop(0)\n    print('loop %d: attack %s (%s) exposure %d -> prototype' % (loop_no, rid, cat, p * imp))\n\n# جرّب: ارفع أثر R4 من 2 إلى 5 — أي خطر يصير هدف الحلقة الثانية؟\n# try: raise R4's impact from 2 to 5 — which risk becomes loop two's target?\n# جرّب: أضف خطر نادرًا كارثيًا مثل ('R5', 'technical', 1, 9) — أين يحل في الترتيب؟\n# try: add a rare catastrophic risk like ('R5', 'technical', 1, 9) — where does it rank?\n",
      prompt: {
        ar: 'الملعب يشغّل الدوّار على سجل الدرس. العب به: ارفع أثر خطر تافه فشاهده يقفز في الترتيب، وأضف خطرًا نادرًا كارثيًا فشاهده يقتطع مقدمة السجل رغم احتماله 1 — هذه هي لحظة إدراك أن "الأعلى احتمالًا" و"الأخطر" شيئان مختلفان. لا اختبار هنا — فضولك فقط.',
        en: 'The sandbox runs the stepper on the lesson\u2019s register. Play with it: raise a trivial risk\u2019s impact and watch it jump the queue, and add a rare catastrophic risk and watch it cut to the front despite probability 1 — that is the moment "most likely" and "most dangerous" become visibly different things. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'عيب محتمل جدًا لكنه تافه، وعيب نادر لكنه كارثي. أيهما يرتب أعلى ولماذا؟',
            en: 'A very likely but trivial defect, and a rare but catastrophic one. Which ranks higher and why?',
          },
          options: [
            { id: 'a', text: { ar: 'المحتمل التافه — لأن الاحتمال وحده يرتب السجل', en: 'The likely trivial one — probability alone ranks the register' } },
            { id: 'b', text: { ar: 'النادر الكارثي — التعرض = الاحتمال × الأثر، وحاصل ضربهما أعلى', en: 'The rare catastrophic one — exposure = probability x impact, and its product is higher' } },
            { id: 'c', text: { ar: 'يترتبان معًا — الصنف وحده يحدد', en: 'They tie — only the category matters' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التعرض التقريبي حاصل ضرب عامليْن، فالنادر الكارثي قد يبلغ 1 × 9 = 9 بينما المحتمل التافه 4 × 1 = 4. انتباهك المحدود يصرف حيث المجموع أكبر — وهذه هي النقطة التي يقف عندها الترتيب بالاحتمال وحده خطأً.',
            en: 'Rough exposure is the product of two factors: the rare catastrophic risk can reach 1 x 9 = 9 while the likely trivial one is 4 x 1 = 4. Limited attention goes where the product is larger — which is exactly where probability-only ranking goes wrong.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما قلب كل حلقة في نموذج الحلزون؟',
            en: 'What is the heart of each spiral-model loop?',
          },
          options: [
            { id: 'a', text: { ar: 'تطوير وتحقيق سلّمة الدورة', en: 'Developing and verifying the round\u2019s deliverable' } },
            { id: 'b', text: { ar: 'تقييم البدائل وتحديد أكبر خطر حالي وحسمه — غالبًا بنموذج أولي أو تجربة تحوّل المجهول إلى معلوم', en: 'Evaluating alternatives and resolving the biggest current risk — often via a prototype or experiment that turns an unknown into a known' } },
            { id: 'c', text: { ar: 'كتابة pitch جاهز لطاولة الرهان', en: 'Writing a pitch ready for the betting table' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'الحلقة أربعة أفعال: أهداف وبدائل وقيود، ثم قلبها — تحديد الخطر الأكبر وهجومه بنموذج أولي، ثم تطوير وتحقق، ثم تخطيط الدورة التالية مع قرار مواصلة/توقف. والنموذج الأولي ليس هدرًا: هو أرخص طريقة لتحويل المجهول إلى معلوم.',
            en: 'The loop has four activities: objectives/alternatives/constraints, then the heart — find the biggest risk and attack it with a prototype, then develop and verify, then plan the next round with an explicit go/no-go. The prototype is not waste: it is the cheapest way to turn an unknown into a known.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'بعد حلقة، بقي خطر أعلى من اللازم. ماذا يتيح الحلزون أن تفعل ولا تتيحه الخطة الجامدة؟',
            en: 'After a loop, a risk remains higher than acceptable. What does the spiral let you do that a rigid plan does not?',
          },
          options: [
            { id: 'a', text: { ar: 'التوقف عن العلم — وقد أنفقت ميزانية حلقة واحدة لا المشروع كله', en: 'Stop knowingly — having spent only that loop\u2019s budget rather than the whole project' } },
            { id: 'b', text: { ar: 'تمديد الجدول بصمت وإعادة نفس الحلقة', en: 'Quietly extend the schedule and repeat the same loop' } },
            { id: 'c', text: { ar: 'تخطي خطوة الخطر في الحلقة القادمة لتعويض الوقت', en: 'Skip the risk step in the next loop to make up time' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قرار التوقف/المواصلة مدمج في النموذج: بعد كل حلقة قد تحكم أن المخاطر أعلى من اللازم فتتوقف. خسارتك القصوى حينئذ ميزانية حلقة — وهذا بالضبط "الخسارة الصغيرة المبكرة" التي تبنيها كل عمليات هذا الفصل ضد "الخسارة الكبيرة المتأخرة".',
            en: 'The go/no-go is built into the model: after each loop you may judge the risks too high and stop. Your maximum loss is then one loop\u2019s budget — exactly the "small early loss" every process in this chapter builds against the "big late loss".',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ومن الفصل الخامس عشر: مبدأ الدرس "فضّل تطوير البرمجية العاملة على إعادة كتابتها بالجملة". أي أداة من ذلك الفصل تجعل التطوير على شيفرة قائمة آمنًا بدل إعادة الكتابة؟',
            en: 'From chapter fifteen: the principle "prefer evolving working software to rewriting it wholesale". Which tool from that chapter makes evolving existing code safe instead of a grand rewrite?',
          },
          options: [
            { id: 'a', text: { ar: 'حزمة اختبارات التوصيف — تثبّت السلوك الحالي عيوبه من ضمنها فتتغير الشيفرة بلا خوف', en: 'A characterization suite — pinning current behavior, bugs included, so the code changes fearlessly' } },
            { id: 'b', text: { ar: 'لوحة مقاييس الجودة — لأن الأرقام الجميلة تشجع على إعادة الكتابة', en: 'A quality-metrics dashboard — because pretty numbers encourage rewrites' } },
            { id: 'c', text: { ar: 'فروع git طويلة العمر تعزل إعادة الكتابة', en: 'Long-lived git branches isolating the rewrite' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'سبب إعادة الكتابة الخوف من كسر ما لا يُفهم — واختبارات التوصيف تعالج الخوف مباشرة: ترصد السلوك الفعلي وتثبته، فتقوم البط على إعادة كتابة آلاف الحالات الحدية المجربة مجانًا. وهذا الجسر نفسه بين قرار العمليات في هذا الفصل ومهارة الفصل الخامس عشر.',
            en: 'The urge to rewrite comes from fear of breaking what is not understood — characterization tests attack the fear directly: they pin actual behavior so you keep the thousand tested edge cases a rewrite would throw away for free. That is the same bridge between this chapter\u2019s process decision and chapter fifteen\u2019s skill.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'الخطر مشكلة وقعت الآن — سأتعامل معها حين تظهر',
          right: 'الخطر محتمل لم يقع: سرده مسبقًا ورتبه بالتعرض وهاجم الأكبر أولًا — والاستجابة معلنة لكل خطر مهم',
          note: {
            ar: 'الفرق بين الفرق الجيدة وغيرها ليس أن الأولى لا تواجه مشكلات — بل أنها لاقتها في قائمة منذ الشهر الأول ومعها استجابة: تجنب أو خفف أو حوّل أو اقبل عن علم. القائمة بلا ترتيب بالتعرض مجرد قلق مرقّم.',
            en: 'The difference between good teams and others is not that good teams meet no problems — it is that the problems were on a list from month one, each with a declared response: avoid, mitigate, transfer, or knowingly accept. A list without an exposure ranking is just numbered anxiety.',
          },
        },
        {
          wrong: 'أعلى خطر = أعلى احتمال — نهاجم ما يقع غالبًا',
          right: 'التعرض = الاحتمال × الأثر: النادر الكارثي يسبق المحتمل التافه',
          note: {
            ar: 'سؤالان لا واحد: كم هو محتمل، وكم يخسرك لو وقع. عيب احتماله 90% وأثره ساعة إصلاح يرتب تحت احتمال 5% يغرق المشروع. لهذا يقف الدوّار في الملعب عن هدف غير المتوقع حين ترفع الأثر.',
            en: 'Two questions, not one: how likely, and how much loss if it lands. A 90%-likely defect costing an hour to fix ranks below a 5% risk that sinks the project. That is why the sandbox\u2019s stepper aims somewhere unexpected once you raise an impact.',
          },
        },
        {
          wrong: 'نموذج أولي هدر — سنبني المنتج مباشرة ونوفر الدورة',
          right: 'النموذج يحوّل مجهولًا إلى معلوم بأرخص ثمن — هذا قلب الحلزون وكل تكرار في هذا الفصل',
          note: {
            ar: 'قصة بوابة المرضى: شريحة رقيقة في أسبوعين أجابت عن سؤالين كانا سيكلفان ربعين لو تأخرا. والقصة المعاكسة إعادة كتابة المتصفح: كل المخاطر محشورة في قفزة واحدة. النموذج الأولي ليس نسخة رديئة من المنتج — هو تجربة تصممها لتتعلم ثم ترميها أو تثبتها.',
            en: 'The patient-portal tale: a two-week thin slice answered two questions that would have cost two quarters answered late. The counter-tale, the browser rewrite, packed every risk into one leap. A prototype is not a bad copy of the product — it is an experiment designed for learning, then kept or thrown away.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'المخاطرة مشكلة مستقبلية محتملة، والتقييم الخشن يرتبها بالتعرض ≈ الاحتمال × الأثر. الأصناف الشائعة: متطلبات، تقنية، جدولة وتقدير، ناس، خارجي. ولكل خطر مهم استجابة معلنة: تجنب، خفف، حوّل، أو اقبل عن علم.', en: 'A risk is a potential future problem; rough assessment ranks by exposure ≈ probability x impact. Common categories: requirements, technical, schedule/estimation, people, external. Every significant risk gets a declared response: avoid, mitigate, transfer, or knowingly accept.' },
        { ar: 'أقوى تقنية تخفيض للمخاطر هي التكرار: قصة بوابة المرضى هاجمت غموضها بشريحة رقيقة في أسبوعين، وقصة المتصفح حشدت كل مخاطرها في إعادة كتابة واحدة وسالت. المبدأ: فضّل تطوير البرمجية العاملة على إعادة كتابتها بالجملة.', en: 'The strongest risk-reduction technique is iteration: the patient portal attacked uncertainty with a two-week thin slice; the browser rewrite packed every risk into one leap and bled. Principle: prefer evolving working software to rewriting it wholesale.' },
        { ar: 'الحلزون إطار يقوده الخطر: كل حلقة أربعة أفعال — أهداف وبدائل وقيود، ثم قلبها: تحديد أكبر خطر وحسمه غالبًا بنموذج أولي، ثم تطوير وتحقق، ثم تخطيط التالي مع قرار توقف/مواصلة صريح قد يوفر ميزانية المشروع كلها. وهو قريب الروح من الرشاقة: كلاهما يجيب كيف تعرف أنك أخطأت والخطأ رخيص؟', en: 'The spiral is a risk-driven meta-framework: each loop has four activities — objectives/alternatives/constraints, then the heart: resolve the biggest risk, often by prototype, then develop and verify, then plan next with an explicit go/no-go that can save the whole budget. Its spirit is close to agile\u2019s: both answer how you find out you were wrong while it is still cheap.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب وأضف خطرًا نادرًا كارثيًا وشاهد الترتيب. ثم اسأل نفسك: في مشروعك الحالي — ما أكبر مجهولين؟ وأي دورة حلزونية بأي تجربة ستحولهما إلى معلوم هذا الشهر؟',
        en: 'Open the sandbox, add a rare catastrophic risk, and watch the ranking. Then ask yourself: in your current project — what are the two biggest unknowns, and which spiral cycle with which experiment would turn them into knowns this month?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch2.s6', pages: 'ص48-50 / pp.48-50' },
        { book: 'SWE', section: 'swe.ch2.s7', pages: 'ص50-51 / pp.50-51' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch2.s6', pages: 'ص48-50 / pp.48-50' },
    { book: 'SWE', section: 'swe.ch2.s7', pages: 'ص50-51 / pp.50-51' },
  ],
} satisfies Lesson;

export default lesson;
