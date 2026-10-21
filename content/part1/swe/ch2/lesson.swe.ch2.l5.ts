import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch2.l5 — "Chapter 2 Review and Project: The Process Simulator"
 * مراجعة الفصل 2 ومشروع: مُحاكي العمليات
 * Aligned with SWE ch2 s8 (Shape Up: Fixed Time, Variable Scope, pp.51-54) +
 * s9 (Conclusion, pp.54-55).
 * All expression is original — a paraphrase of the CC BY-SA 4.0 source, never
 * a verbatim translation.
 * Runnable design: a deterministic process simulator over ONE fixed 16-point
 * work list with 3 defects planted at known spots — waterfall (one build pass,
 * one end-game test pass, freshness window 7) vs agile (two features per
 * iteration, tested immediately). Waterfall: found 2/3, cost 46, one escaped;
 * agile: found 3/3, cost 28. Debug: a blind waterfall that drops cold defects
 * on the floor and reports cost 34 + "escape check: clean" while a defect
 * escaped; the fix books the escape bill and prints the real count.
 * Deterministic only: no input(), no exit(), no random, no unittest.main.
 */
const lesson = {
  id: 'swe.ch2.l5',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 2,
  title: { ar: 'مراجعة الفصل 2 ومشروع: مُحاكي العمليات', en: 'Chapter 2 Review and Project: The Process Simulator' },
  estimatedMinutes: 35,
  prerequisites: ['swe.ch2.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'نهاية الربع. مدير المجموعة يمر على لوحتي فريقين: كلاهما أنجز النقاط الست عشرة نفسها من العمل — ست ميزات على قائمة واحدة. وفوق نتيجة أحدهما رقم لا يريد أحد رؤيته: فاتورة إصلاح تكاد تضاعف فاتورة الفريق الآخر، وعيب واحد وصل إلى مستخدمين حقيقيين رغم أن التقرير الختامي قال «اكتملت الاختبارات». الفرق لم يكن في النقاط ولا في الناس — كان في توقيت الاختبار وحده. هذا الدرس يغلق الفصل: أولًا تعيد قراءة كل العمليات رهاناتٍ على أين يسكن الخطر — الشلال وعرض V، سكرم وXP، الحلزون، ثم Shape Up التي تثبت الزمن وترن النطاق بشهيتها وقاطع دارتها. ثم تبني مُحاكي العمليات: قائمة عمل واحدة، استراتيجيتان، وثلاثة عيوب مدفونة بمواضع معلومة — وتقرأ الفاتورتين بنفسك، سطرًا سطرًا.',
        en: 'End of the quarter. The group manager walks past two team boards: both finished the same 16 points of work — six features off one list. And above one result sits a number nobody wants: a fix bill nearly double the other team\u2019s, plus one defect that reached real users even though the final report said "testing complete". The difference was not the points or the people — it was the timing of testing alone. This lesson closes the chapter: first you reread every process as a bet about where the risk lives — waterfall and the V, Scrum and XP, the spiral, then Shape Up, which pins time and lets scope flex with its appetite and its circuit breaker. Then you build the process simulator: one work list, two strategies, three defects planted at known spots — and you read the two bills yourself, line by line.',
      },
    },
    {
      kind: 'predict',
      code: "TOTAL = 10\nWINDOW = 4\ndone = 0\nfor fid, pts, defect in [('A', 3, 1), ('B', 4, 1), ('C', 3, 1)]:\n    done += pts\n    fresh = done >= TOTAL - WINDOW\n    print(fid, 'fresh' if fresh else 'cold')",
      question: {
        ar: 'ثلاث ميزات عليها عيوب، تُبنى بترتيب واحد ثم تُختبر دفعة واحدة في النهاية. أي عيوب ما زالت «حية» حين يبدأ الاختبار — ولماذا؟',
        en: 'Three defective features, built in one order, then tested in a single pass at the end. Which defects are still "alive" when testing starts — and why?',
      },
      reveal: {
        ar: 'الطباعة: A cold ثم B fresh ثم C fresh. العتبة TOTAL − WINDOW = 6: عيب A اكتمل بناؤه عند النقطة الثالثة فبرد قبل الاختبار، وB وC ما زالتا داخل نافذة الطزاجة. هذا هو القانون الأول للمُحاكي الذي ستبنيه: جولة اختبار واحدة في النهاية لا ترى إلا آخر نقاط العمل — وكل ما بُني قبلها بارد.',
        en: 'It prints A cold, then B fresh, then C fresh. The cutoff is TOTAL - WINDOW = 6: A\u2019s defect finished at point three, long cold before testing, while B and C still sit inside the freshness window. That is the first law of the simulator you will build: a single end-game test pass sees only the last points of work — everything built before it is cold.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الفصل كله في سؤال واحد: كل عملية رهان', en: 'The whole chapter in one question: every process is a bet' },
      chunks: [
        {
          ar: 'يُلخّص خاتمة الكتاب الفصل كله في سؤال واحد: كيف تعرف أنك أخطأت والخطأ ما يزال رخيصًا؟ كل عملية رهان على أين يسكن الخطر. العمليات المخططة — الشلال وعرض V — تراهن على إصابة الجواب مسبقًا: تتقدم مرحلة فمرحلة وتؤجل الدمج والاختبار إلى النهاية حيث منحنى كلفة التغيير أشد انحدارًا، فتدفع غالٍ حين يخذلها الرهان. والعمليات الرشيقة تراهن على الدورات القصيرة: سكرم يمنح الإيقاع والمحاسبة — مالك المنتج يملك قائمة الأعمال المتراكمة والسؤال «ماذا»، وفريق التطوير يملك «كيف»، والسرعة velocity تُقاس كل سبرنت — بينما XP يمنح الانضباط الهندسي: اختبار أولًا، تكامل مستمر، تصميم بسيط، وإعادة هيكلة لا تنقطع. والحلزون جعل الرهان صريحًا: كل دورة تهاجم أكبر خطر باقٍ بتعرضه الاحتمال × الأثر، وبقرار توقف/مواصلة لا يتردد.',
          en: 'The book\u2019s conclusion compresses the chapter into one question: how do you find out you were wrong while being wrong is still cheap? Every process is a bet about where the risk lives. Plan-driven — waterfall and the V — bets on getting the answer right up front: it defers integration and testing to the end, where the cost-of-change curve is steepest, and pays dearly when the bet fails. Agile bets on short cycles: Scrum supplies the cadence and the accounting — the product owner owns the backlog and the what, the development team owns the how — while XP supplies the engineering discipline: test-first, continuous integration, simple design, relentless refactoring. The spiral made the bet explicit: every loop attacks the biggest remaining risk by exposure — probability x impact — with a go/no-go that does not blink.',
        },
        {
          ar: 'ثم يدخل Shape Up — المنهج الذي نشره Basecamp كتابًا مجانيًا — فيحافظ على الإيقاع الثابت لكنه يراهن ثلاث رهانات حادة: الزمن ثابت والنطاق هو المرن؛ لا قائمة أعمال؛ والفريق يستلم مشكلة كاملة مشكَّلة لا قائمة مهام. الشهية appetite تحل محل التقدير: كم يستحق هذه المشكلة من الوقت — دفعة صغيرة: مصمم ومبرمج أو اثنان لأسبوع إلى أسبوعين؛ دفعة كبيرة: الفريق نفسه ستة أسابيع كاملة. والفكرة التي لا تسع حتى الدفعة الكبيرة لا يُمنح لها وقت أكثر — تُضيَّق حتى تسع. وقبل أي رهان تأتي مرحلة التشكيل shaping: حل خشن ومحلول ومحدود الحدود، مع صيد حفر الأرانب rabbit holes قبل أن تبتلع فريقًا، ثم pitch مكتوب: المشكلة والشهية والحل والحفر وما هو خارج النطاق. وبين الدورات تهدئة cool-down أسبوعان تُراجع فيها البيانات على طاولة الرهان وتُعالج الأخطاء: تُصلح في التهدئة، أو تُراهن كأي مشروع، أو دورة تحطيم عيوب كاملة.',
          en: 'Shape Up — published by Basecamp as a free online book — keeps the fixed cadence but makes three sharp bets: time is fixed and scope is what flexes; there is no backlog; and a team receives a whole shaped problem, not a task list. The appetite replaces the estimate: how much time is the problem worth — a small batch is a designer and one or two programmers for one to two weeks; a big batch six full weeks. An idea that will not fit even a big batch is not given more time — it is narrowed until it fits. Before any bet comes shaping: a solution rough, solved, and bounded, with rabbit holes hunted early, ending in a written pitch. Between cycles sits a two-week cool-down: pitches face the betting table, and bugs get fixed there, bet like any project, or smashed in a dedicated cycle.',
        },
        {
          ar: 'وعند نهاية الدورة يقف قاطع الدارة circuit breaker: المشروع يشحن أو يُسقط — لا تمديد تلقائي؛ والتمديد الوحيد لعمل must-have كله downhill، وبقاء uphill يعني أن التشكيل أخطأ فيعود المشروع إليه. أقصى ما تخسره دورة واحدة، والحالة تُقرأ على تلال التقدم hill charts: صعود يعني ما زالت مجهولات، ونزول تنفيذ صرف. ثم أربع خلاصات تعود إلى ضغوط الفصل الأول: التنسيق — عملية مسمّاة متعمدة تجعل الفريق يتصرف كمهندس واحد كفء؛ التغيير — الدورات القصيرة تحد ما يتراكم قبل وصول التغذية الراجعة؛ العيوب — الاختبار والتكامل المستمران ببنية عرض V يمسكان الخلل رخيصًا؛ التعقيد — تصميم بسيط وإعادة هيكلة تحت مظلة اختبارات قوية. والحكم: لا توجد عملية أفضل عالميًا — بل الأفضل لمخاطر هذا المشروع وفريقه وقيوده؛ قيّم، اختر، وكيّف.',
          en: 'Then the circuit breaker stands at cycle end: the project ships or it is dropped — no automatic extension. An extension is allowed only for must-have work that is entirely downhill; remaining uphill means the shaping was wrong, so the project goes back to shaping. The most you can lose is one cycle, and progress reads on hill charts: uphill is unknowns, downhill pure execution. Then four takeaways tied to chapter one\u2019s pressures: coordination — a named, deliberate process lets a team act like one competent engineer; change — short iterations cap what piles up before feedback arrives; defects — continuous testing and integration, structured by the V-model\u2019s levels, catch faults while cheap; complexity — simple design plus disciplined refactoring under a strong test suite. And the verdict: no universally best process — only the best for this project\u2019s risks, team, and constraints. Evaluate, select, adapt.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تشريح المشروع: مُحاكي العمليات', en: 'Project anatomy: the process simulator' },
      chunks: [
        {
          ar: 'مشروعك يغلق الفصل بمُحاكي عمليات: قائمة عمل واحدة ثابتة من ست ميزات، كل واحدة ثلاثية (المعرف، النقاط، عيب؟) — 16 نقطة وثلاثة عيوب مدفونة في F2 وF4 وF5 بمواضع معلومة لا بحظّ. وفوق القائمة قوانين الفيزياء الثلاثة: نافذة الطزاجة WINDOW = 7 — جولة الاختبار لا تحمل سياقًا حيًا إلا لآخر 7 نقاط مبنية، وما قبلها بارد تختفي عيوبه عن العين؛ وعيب يُمسك في الانفجار الختامي يُصلح بـ LATE_FIX = 9 نقاط، وفي تكراره نفسه بـ EARLY_FIX = 4؛ والعيب الذي يبلغ المستخدمين يحاسب ESCAPED_COST = 12. والاستراتيجيتان تبنيان النقاط الست عشرة ذاتها — لا يفترقهما إلا توقيت الاختبار: الشلال جولة بناء واحدة ثم جولة اختبار واحدة في النهاية؛ والرشيق تكرارًا من ميزتين تختبر كل دفعة فور بنائها.',
          en: 'Your project closes the chapter with a process simulator: one fixed work list of six features, each a triple (id, points, defect?) — 16 points and three defects planted at known spots, F2, F4, F5, not by luck. Above the list sit three laws: the freshness window WINDOW = 7 — a test pass holds live context for only the last 7 points built; earlier work has gone cold and its defects hide. A defect caught in the end-game big bang costs LATE_FIX = 9 points to fix; inside its own iteration it costs EARLY_FIX = 4; and a defect that reaches users bills ESCAPED_COST = 12. Both strategies build the same 16 points — the only thing separating them is when testing happens: waterfall is one build pass then one end-game test pass; agile is two features per iteration with each batch tested the moment it is built.',
        },
        {
          ar: 'شغّل المحاكي وستقرأ الحكاية في سطور معدودة: الشلال يمسك عيبي F4 وF5 — آخر سبع نقاط ما زالت حية — بينما F2 بُنيت مبكرًا فبرُدت قبل جولة الاختبار الواحدة، فهربت إلى المستخدمين وحاسبت 12: found 2/3 وcost 46. والرشيق يختبر كل دفعة فور بنائها — 5 ثم 6 ثم 5 نقاط، كلها داخل النافذة — فيمسك العيوب الثلاثة ويصلحها بأربعة لكل منها: found 3/3 وcost 28. والسطر الختامي يقولها كاملة: نقاط العمل نفسها، وفاتورتان 46 و28، وعيب هارب واحد في حصة الشلال. واحفظ حدود النموذج: أرقام مثبتة بلا حظّ لأن هدفه شكل النتيجة لا العالم — وقانونه هو ما دارت عليه الدروس كلها: كل ما تؤجله من الاختبار تشتريه لاحقًا بأغلى ثمن.',
          en: 'Run it and the story reads in a handful of lines: waterfall catches F4 and F5 — the last seven points are still alive — while F2, built early, went cold before the single test pass, escaped to users, and billed 12: found 2/3, cost 46. Agile tests each batch the moment it is built — 5, then 6, then 5 points, all inside the window — catches all three defects and fixes them at 4 each: found 3/3, cost 28. And the closing line says it whole: the same points of work, two bills, 46 and 28, one escaped defect charged to the waterfall. Keep the model\u2019s edge in view: pinned numbers, no luck, because its job is the shape of the result, not the world — and its law is what every lesson circled: everything you defer about testing you buy back later, dearer.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نصف المحاكي: تشغيل الجانب الرشيق على قائمة أصغر', en: 'Half the simulator: running the agile side on a smaller list' },
      code: "WORK = [('G1', 2, 0), ('G2', 3, 1), ('G3', 2, 1), ('G4', 1, 0)]\nWINDOW = 7\nEARLY_FIX = 4\n\ntotal_defects = sum(f[2] for f in WORK)\ncost = 0\nfound = 0\nfor i in range(0, len(WORK), 2):\n    batch = WORK[i:i + 2]\n    built = 0\n    for fid, pts, defect in batch:\n        cost += pts\n        built += pts\n    print('iter %d: build %d points, test fresh' % (i // 2 + 1, built))\n    for fid, pts, defect in batch:\n        if defect and built <= WINDOW:\n            found += 1\n            cost += EARLY_FIX\n            print('agile: fix %s inside iteration for %d' % (fid, EARLY_FIX))\nprint('agile: found %d/%d defects cost %d' % (found, total_defects, cost))",
      explanation: {
        ar: 'هذا نصف المشروع تعمل به يدك قبل كتابته كاملًا: كل تكرار يبني ميزتين ويجمع built ثم يختبر فورًا. الدفعة الأولى 5 نقاط (2+3) فميزانية الطزاجة حية، وعيب G2 يُمسك ويُدفع 4؛ والثانية 3 نقاط فيُمسك عيب G3 بالمثل. لا شيء يبرد لأن كل دفعة داخل النافذة 7. ولاحظ سطر الحصاد الأخير: found 2/2 defects cost 16 — ثماني نقاط بناء وثماني إصلاح مبكر. في المشروع ستضيف الجانب الآخر: الشلال بجولته الختامية الواحدة ونافذته الضيقة، فتقف على الفاتورتين متجاورتين وتقرأ الفجوة.',
        en: 'This is half the project, run by hand before you write the whole thing: every iteration builds two features, sums built, and tests immediately. The first batch is 5 points (2+3), the freshness budget is alive, G2\u2019s defect is caught and 4 is paid; the second is 3 points and G3\u2019s defect is caught likewise. Nothing goes cold because every batch fits inside the window of 7. Note the final harvest line: found 2/2 defects cost 16 — eight points of building and eight of early fixing. In the project you add the other side: the waterfall with its single end-game pass and its narrow window — then you stand the two bills side by side and read the gap.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.process-sim',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'ابنِ المُحاكي على الهيكل المعطى. القانون في simulate_waterfall: المتغير done يتراكم بعد كل ميزة؛ والعيب حي إذا done >= TOTAL - WINDOW فيُصلح متأخرًا — cost += LATE_FIX واطبع waterfall: fix %s late for %d؛ والعيب البارد يهرب — cost += ESCAPED_COST واطبع waterfall: %s cold at test time -> escaped. ثم اطبع سطر الملخص waterfall: found %d/%d defects cost %d وأعد قاموس found/escaped/cost. وفي simulate_agile كل ميزتين دفعة: ابنِها مختومة built ثم اختبرها فورًا — عيب مع built <= WINDOW يُصلح: cost += EARLY_FIX واطبع agile: fix %s inside iteration for %d، وبعد الحلقات اطبع سطر الملخص agile: found %d/%d defects cost %d وأعد القاموس نفسه. الاستدعاءان على WORK جاهزان في نهاية الهيكل — شغّل واقرأ الفاتورتين وسطر result.',
        en: 'Build the simulator on the given skeleton. The law in simulate_waterfall: done accumulates after each feature; a defect is alive if done >= TOTAL - WINDOW — fix it late: cost += LATE_FIX and print waterfall: fix %s late for %d; a cold defect escapes — cost += ESCAPED_COST and print waterfall: %s cold at test time -> escaped. Then print the summary line waterfall: found %d/%d defects cost %d and return a found/escaped/cost dict. In simulate_agile every two features are one batch: build them, count built, then test immediately — a defect with built <= WINDOW is fixed: cost += EARLY_FIX and print agile: fix %s inside iteration for %d; after the loops print the summary line agile: found %d/%d defects cost %d and return the same dict. Both calls on WORK are already at the end of the skeleton — run it and read the two bills and the result line.',
      },
      starterCode: "WORK = [\n    ('F1', 3, 0),\n    ('F2', 2, 1),\n    ('F3', 4, 0),\n    ('F4', 2, 1),\n    ('F5', 3, 1),\n    ('F6', 2, 0),\n]\nWINDOW = 7\nLATE_FIX = 9\nEARLY_FIX = 4\nESCAPED_COST = 12\nTOTAL = sum(f[1] for f in WORK)\nN_DEFECTS = sum(f[2] for f in WORK)\n\ndef simulate_waterfall(work):\n    found = escaped = 0\n    cost = 0\n    done = 0\n    for fid, pts, defect in work:\n        # TODO: تراكم cost وdone ثم مفترق العيب أمام نافذة الطزاجة\n        # TODO: accumulate cost and done, then the defect fork against the freshness window\n        pass\n    # TODO: اطبع waterfall: found %d/%d defects cost %d\n    return {'found': found, 'escaped': escaped, 'cost': cost}\n\ndef simulate_agile(work, per_iter=2):\n    found = escaped = 0\n    cost = 0\n    for i in range(0, len(work), per_iter):\n        batch = work[i:i + per_iter]\n        built = 0\n        # TODO: ابنِ الدفعة وتجميع built ثم اختبرها فورًا داخل النافذة\n        # TODO: build the batch summing built, then test it immediately inside the window\n        pass\n    # TODO: اطبع agile: found %d/%d defects cost %d\n    return {'found': found, 'escaped': escaped, 'cost': cost}\n\nwf = simulate_waterfall(WORK)\nag = simulate_agile(WORK)\nprint('result: same %d points, cost %d vs %d, escaped %d vs %d' % (TOTAL, wf['cost'], ag['cost'], wf['escaped'], ag['escaped']))",
      solution: "WORK = [\n    ('F1', 3, 0),\n    ('F2', 2, 1),\n    ('F3', 4, 0),\n    ('F4', 2, 1),\n    ('F5', 3, 1),\n    ('F6', 2, 0),\n]\nWINDOW = 7\nLATE_FIX = 9\nEARLY_FIX = 4\nESCAPED_COST = 12\nTOTAL = sum(f[1] for f in WORK)\nN_DEFECTS = sum(f[2] for f in WORK)\n\ndef simulate_waterfall(work):\n    found = escaped = 0\n    cost = 0\n    done = 0\n    for fid, pts, defect in work:\n        cost += pts\n        done += pts\n        if defect:\n            if done >= TOTAL - WINDOW:\n                found += 1\n                cost += LATE_FIX\n                print('waterfall: fix %s late for %d' % (fid, LATE_FIX))\n            else:\n                escaped += 1\n                cost += ESCAPED_COST\n                print('waterfall: %s cold at test time -> escaped' % fid)\n    print('waterfall: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))\n    return {'found': found, 'escaped': escaped, 'cost': cost}\n\ndef simulate_agile(work, per_iter=2):\n    found = escaped = 0\n    cost = 0\n    for i in range(0, len(work), per_iter):\n        batch = work[i:i + per_iter]\n        built = 0\n        for fid, pts, defect in batch:\n            cost += pts\n            built += pts\n        for fid, pts, defect in batch:\n            if defect:\n                if built <= WINDOW:\n                    found += 1\n                    cost += EARLY_FIX\n                    print('agile: fix %s inside iteration for %d' % (fid, EARLY_FIX))\n                else:\n                    escaped += 1\n                    cost += ESCAPED_COST\n    print('agile: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))\n    return {'found': found, 'escaped': escaped, 'cost': cost}\n\nwf = simulate_waterfall(WORK)\nag = simulate_agile(WORK)\nprint('result: same %d points, cost %d vs %d, escaped %d vs %d' % (TOTAL, wf['cost'], ag['cost'], wf['escaped'], ag['escaped']))",
      tests: [
        {
          id: 't1',
          name: { ar: 'الشلال: عيبان من ثلاثة وفاتورة 46', en: 'Waterfall: two of three defects and a bill of 46' },
          code: "assert 'waterfall: found 2/3 defects cost 46' in __learner_output__, 'expected: waterfall: found 2/3 defects cost 46 | actual: %r' % __learner_output__",
          expected: 'waterfall: found 2/3 defects cost 46',
        },
        {
          id: 't2',
          name: { ar: 'الرشيق: العيوب الثلاثة وفاتورة 28', en: 'Agile: all three defects and a bill of 28' },
          code: "assert 'agile: found 3/3 defects cost 28' in __learner_output__, 'expected: agile: found 3/3 defects cost 28 | actual: %r' % __learner_output__",
          expected: 'agile: found 3/3 defects cost 28',
        },
        {
          id: 't3',
          name: { ar: 'سطر الختام يقارن الفاتورتين والهارب', en: 'The closing line compares both bills and the escaped defect' },
          code: "assert 'result: same 16 points, cost 46 vs 28, escaped 1 vs 0' in __learner_output__, 'expected: result: same 16 points, cost 46 vs 28, escaped 1 vs 0 | actual: %r' % __learner_output__",
          expected: 'result: same 16 points, cost 46 vs 28, escaped 1 vs 0',
        },
      ],
      hints: [
        { ar: 'المتغير done يتراكم داخل الحلقة: done += pts بعد cost += pts — والمقارنة الحاسمة done >= TOTAL - WINDOW.', en: 'The done variable accumulates inside the loop: done += pts right after cost += pts — the decisive comparison is done >= TOTAL - WINDOW.' },
        { ar: 'في الشلال كل عيب يمر من مفترق واحد: حي (داخل النافذة) فـ found وLATE_FIX؛ بارد فـ escaped وESCAPED_COST. لا فرع ثالث.', en: 'In the waterfall every defect hits one fork: alive (inside the window) means found and LATE_FIX; cold means escaped and ESCAPED_COST. There is no third branch.' },
        { ar: 'هيكل agile: لكل i in range(0, len(work), per_iter): ثم batch = work[i:i + per_iter]؛ حلقة أولى تبني وتجمع built، وحلقة ثانية تفحص العيوب مقابل built <= WINDOW.', en: 'Agile skeleton: for i in range(0, len(work), per_iter): then batch = work[i:i + per_iter]; a first loop builds and sums built, a second loop checks defects against built <= WINDOW.' },
        { ar: 'الفاتورتان تخرجان من الجداول ذاتها: waterfall: found 2/3 defects cost 46 وagile: found 3/3 defects cost 28 وresult: same 16 points, cost 46 vs 28, escaped 1 vs 0 — إن طُبعت الثلاثة فنموذجك صحيح.', en: 'Both bills fall out of the same tables: waterfall: found 2/3 defects cost 46 and agile: found 3/3 defects cost 28 and result: same 16 points, cost 46 vs 28, escaped 1 vs 0 — if all three print, your model is right.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-appetite',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. قاعدة طاولة الرهان: شهية فوق الدفعة الكبيرة تُضيَّق، وما يساويها أو دونها يُراهن.',
        en: 'Read the code and predict its exact output — one line per print — without running it. The betting table\u2019s rule: an appetite above the big batch gets narrowed, one equal to it or below gets bet on.',
      },
      code: "PITCHES = [('P1', 6), ('P2', 8), ('P3', 2), ('P4', 6)]\nBIG_BATCH = 6\nfor pid, appetite in PITCHES:\n    if appetite > BIG_BATCH:\n        print('%s: narrow' % pid)\n    else:\n        print('%s: bet' % pid)",
      solution: "P1: bet\nP2: narrow\nP3: bet\nP4: bet",
      answer: "P1: bet\nP2: narrow\nP3: bet\nP4: bet",
      hints: [
        { ar: 'BIG_BATCH = 6 والشرط صارم: appetite > 6 يطبع narrow، وما دون ذلك يطبع bet.', en: 'BIG_BATCH is 6 and the condition is strict: appetite > 6 prints narrow, anything else prints bet.' },
        { ar: 'P2 شهيتها 8 فهي الوحيدة فوق الحد — تُضيَّق؛ وP1 وP3 وP4 شهياتها 6 و2 و6 فتُراهن.', en: 'P2 carries an appetite of 8, the only one over the limit — it gets narrowed; P1, P3 and P4 carry 6, 2 and 6, so all get bet on.' },
        { ar: 'لاحظ أن 6 نفسها تُراهن: الشرط > لا >= — الدفعة الكبيرة هي الحد الأقصى المقبول.', en: 'Note that 6 itself gets bet on: the condition is > not >= — the big batch is the maximum accepted appetite.' },
        { ar: 'الخرج:\nP1: bet\nP2: narrow\nP3: bet\nP4: bet', en: 'The output:\nP1: bet\nP2: narrow\nP3: bet\nP4: bet' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-shapeup',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'أي جملة تميّز Shape Up عن سكرم بدقة؟',
        en: 'Which sentence states the Shape Up vs Scrum contrast precisely?',
      },
      options: [
        { id: 'a', text: { ar: 'سبرنت من أسبوع إلى أربعة يُعاد تخطيطه، والقصة غير المنجزة تُرحَّل على قائمة أعمال دائمة', en: 'A one-to-four-week sprint that gets re-planned, with unfinished stories rolled onto a permanent backlog' } },
        { id: 'b', text: { ar: 'دورة واحدة ستة أسابيع بزمن ثابت ونطاق مرن، بلا قائمة أعمال ولا تمديد تلقائي، والفريق يستلم pitch مشكَّلة كاملة', en: 'One six-week cycle with fixed time and flexible scope, no backlog and no auto-extension, and the team receives a whole shaped pitch' } },
        { id: 'c', text: { ar: 'نطاق ثابت وزمن مرن: يُقدَّر العمل ثم يُمدَّد الجدول حتى تُنجز القائمة كلها', en: 'Fixed scope and flexible time: the work is estimated, then the schedule is stretched until the list is done' } },
        { id: 'd', text: { ar: 'اجتماعات يومية ومراجعات واستعراضات كل أسبوعين لقراءة الحالة', en: 'Daily standups, reviews, and retrospectives every two weeks to read status' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسأل أين يرن الرقم: من يثبت الزمن ومن يثبت النطاق؟', en: 'Ask where the number gives: who pins time and who pins scope?' },
        { ar: 'سكرم يرحّل غير المنجز على قائمة أعمال؛ وShape Up لا يملك أصلًا قائمة — الأفكار غير المختارة تسقط وتعود إن استحقت.', en: 'Scrum rolls unfinished work onto a backlog; Shape Up does not own a backlog at all — unchosen ideas lapse and return only if they deserve it.' },
        { ar: 'قاطع الدارة: الدورة تنتهي فيُشحن المنتج أو يُسقط المشروع — والتمديد استثناء لا يُمنح ما دام هناك عمل uphill باقٍ.', en: 'The circuit breaker: the cycle ends and the product ships or the project is dropped — extensions are an exception, denied while uphill work remains.' },
        { ar: 'الجواب b — زمن ثابت ونطاق مرن، بلا قائمة أعمال وبلا تمديد تلقائي، والفريق يستلم المشكلة كاملة مشكَّلة.', en: 'Answer b — fixed time, variable scope, no backlog, no auto-extension, and the team receives the whole shaped problem.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-cooldown',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'تقويم Shape Up: دورة بناء ستة أسابيع تليها تهدئة cool-down أسبوعان، ثم دورة تالية. كم أسبوعًا بين بداية دورة وبداية التي تليها؟ (رقم واحد)',
        en: 'The Shape Up calendar: a six-week build cycle followed by a two-week cool-down, then the next cycle. How many weeks from one cycle\u2019s start to the next cycle\u2019s start? (one number)',
      },
      answer: '8',
      solution: '8',
      hints: [
        { ar: 'التهدئة ليست فراغًا: فيها تُراجع البيانات الجديدة وتُصلح أخطاء صغيرة — وهي جزء من التقويم المنتظم لا خارج حسابه.', en: 'The cool-down is not dead time: new pitches are shaped there and small bugs get fixed — it is part of the regular calendar, not outside its accounting.' },
        { ar: 'هنا الزمن مقطوع مسبقًا لا مقدَّر: البناء 6 والتهدئة 2 — اجمعهما.', en: 'Here time is cut in advance, not estimated: building is 6 and cool-down is 2 — add them.' },
        { ar: 'الدورة التالية لا تبدأ حتى تنتهي التهدئة — التسلسل الكامل: بناء ثم تهدئة ثم بناء.', en: 'The next cycle does not start until the cool-down ends — the full sequence: build, then cool-down, then build again.' },
        { ar: 'الجواب: 8', en: 'Answer: 8' },
      ],
    },
    {
      kind: 'debug',
      id: 'ex5.debug-blind-waterfall',
      required: true,
      brokenCode: "WORK = [\n    ('F1', 3, 0),\n    ('F2', 2, 1),\n    ('F3', 4, 0),\n    ('F4', 2, 1),\n    ('F5', 3, 1),\n    ('F6', 2, 0),\n]\nWINDOW = 7\nLATE_FIX = 9\nESCAPED_COST = 12\nTOTAL = sum(f[1] for f in WORK)\nN_DEFECTS = sum(f[2] for f in WORK)\n\nfound = 0\nescaped = 0\ncost = 0\ndone = 0\nfor fid, pts, defect in WORK:\n    cost += pts\n    done += pts\n    if defect:\n        if done >= TOTAL - WINDOW:\n            found += 1\n            cost += LATE_FIX\n            print('waterfall: fix %s late for %d' % (fid, LATE_FIX))\n        else:\n            pass  # عيب بارد: لا شيء يُسجل هنا، صحيح؟\nprint('waterfall: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))\nif escaped == 0:\n    print('escape check: clean')",
      prompt: {
        ar: 'محاكي الشلال هذا يطبع تقريرًا أخضر: found 2/3 وcost 34 وescape check: clean — لكن F2 عليها عيب واختبار النهاية البارد لا يراها، ومستخدم سيجده. أين يهبط العيب البارد في الكود؟ أصلح فرع else ليهرب العيب ويحسب فاتورة ESCAPED_COST ويطبع waterfall: %s cold at test time -> escaped، واجعل السطر الأخير يطبع escape check: escaped %d بالرقم الحقيقي بدل عبارة clean الأعمى.',
        en: 'This waterfall simulator prints a green report: found 2/3, cost 34, escape check: clean — yet F2 carries a defect that the cold end-game test pass never sees, and a user will find it. Where does the cold defect fall in this code? Fix the else branch so the defect escapes, books its ESCAPED_COST bill, and prints waterfall: %s cold at test time -> escaped, and make the last line print escape check: escaped %d with the real number instead of the blind clean claim.',
      },
      solution: "WORK = [\n    ('F1', 3, 0),\n    ('F2', 2, 1),\n    ('F3', 4, 0),\n    ('F4', 2, 1),\n    ('F5', 3, 1),\n    ('F6', 2, 0),\n]\nWINDOW = 7\nLATE_FIX = 9\nESCAPED_COST = 12\nTOTAL = sum(f[1] for f in WORK)\nN_DEFECTS = sum(f[2] for f in WORK)\n\nfound = 0\nescaped = 0\ncost = 0\ndone = 0\nfor fid, pts, defect in WORK:\n    cost += pts\n    done += pts\n    if defect:\n        if done >= TOTAL - WINDOW:\n            found += 1\n            cost += LATE_FIX\n            print('waterfall: fix %s late for %d' % (fid, LATE_FIX))\n        else:\n            escaped += 1\n            cost += ESCAPED_COST\n            print('waterfall: %s cold at test time -> escaped' % fid)\nprint('waterfall: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))\nprint('escape check: escaped %d' % escaped)",
      tests: [
        {
          id: 't1',
          name: { ar: 'الفاتورة تشمل فاتورة الهروب', en: 'The bill includes the escape bill' },
          code: "assert 'waterfall: found 2/3 defects cost 46' in __learner_output__, 'expected: waterfall: found 2/3 defects cost 46 (books the escape bill) | actual: %r' % __learner_output__",
          expected: 'waterfall: found 2/3 defects cost 46',
        },
        {
          id: 't2',
          name: { ar: 'فحص الهروب يطبع الرقم لا الأمل', en: 'The escape check prints the number, not blind hope' },
          code: "assert 'escape check: escaped 1' in __learner_output__, 'expected: escape check: escaped 1 | actual: %r' % __learner_output__",
          expected: 'escape check: escaped 1',
        },
      ],
      hints: [
        { ar: 'تتبع F2: done = 5 عند اكتمالها وTOTAL - WINDOW = 9 — فالشرط خائب فيدخل else التي فيها pass فقط.', en: 'Trace F2: done is 5 when it completes and TOTAL - WINDOW is 9 — the condition fails, so control falls into the else holding only a pass.' },
        { ar: 'العدّاد escaped أُعلن ولم يُلمس قط، وcost لم تُحمَّل فاتورة ESCAPED_COST — لذلك التقرير 34 وأخضر زائف.', en: 'The escaped counter is declared and never touched, and cost never carries ESCAPED_COST — hence the 34 and the false green.' },
        { ar: 'في else: escaped += 1 وcost += ESCAPED_COST واطبع waterfall: %s cold at test time -> escaped — نفس عقود المشروع حرفيًا.', en: 'In the else branch: escaped += 1, cost += ESCAPED_COST, and print waterfall: %s cold at test time -> escaped — the project\u2019s exact contract.' },
        { ar: 'واستبدل شرط if escaped == 0 بسطر يصرح بالحقيقة دائمًا: print(escape check: escaped %d % escaped) — الفحص الأعمى من أخطر أنواع التقرير.', en: 'And replace the if escaped == 0 check with a line that always tells the truth: print(escape check: escaped %d % escaped) — a blind check is the most dangerous kind of report.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "WORK = [\n    ('F1', 3, 0),\n    ('F2', 2, 1),\n    ('F3', 4, 0),\n    ('F4', 2, 1),\n    ('F5', 3, 1),\n    ('F6', 2, 0),\n]\nWINDOW = 7\nLATE_FIX = 9\nEARLY_FIX = 4\nESCAPED_COST = 12\n\ndef defects(work):\n    return sum(f[2] for f in work)\n\ndef simulate_waterfall(work, window=WINDOW):\n    total = sum(f[1] for f in work)\n    found = escaped = 0\n    cost = total\n    done = 0\n    for fid, pts, defect in work:\n        done += pts\n        if defect:\n            if done >= total - window:\n                found += 1\n                cost += LATE_FIX\n            else:\n                escaped += 1\n                cost += ESCAPED_COST\n    print('waterfall: found %d/%d defects cost %d' % (found, defects(work), cost))\n    return found, escaped, cost\n\ndef simulate_agile(work, per_iter=2, window=WINDOW):\n    found = escaped = 0\n    cost = 0\n    for i in range(0, len(work), per_iter):\n        batch = work[i:i + per_iter]\n        built = 0\n        for fid, pts, defect in batch:\n            cost += pts\n            built += pts\n        for fid, pts, defect in batch:\n            if defect:\n                if built <= window:\n                    found += 1\n                    cost += EARLY_FIX\n                else:\n                    escaped += 1\n                    cost += ESCAPED_COST\n    print('agile: found %d/%d defects cost %d' % (found, defects(work), cost))\n    return found, escaped, cost\n\nsimulate_waterfall(WORK)\nsimulate_agile(WORK)\n\n# جرّب: ارفع WINDOW إلى 16 — هل يتحول الشلال إلى رشيق؟ بأي كلفة من الصدق؟\n# try: raise WINDOW to 16 — does the waterfall turn agile? at what cost to the truth?\n# جرّب: اخفض WINDOW إلى 4 — حتى الرشيق يخسر عيوبه: أي دفعات بردت؟\n# try: drop WINDOW to 4 — even the agile side loses defects: which batches went cold?\n# جرّب: أضف ('F7', 2, 1) آخر القائمة — من يمسك عيبها أولًا؟\n# try: append ('F7', 2, 1) at the end of the list — who catches its defect first?\n",
      prompt: {
        ar: 'الملعب يشغّل المحاكي كاملًا على جداول الفصل. العب به: ارفع WINDOW إلى 16 فشاهد الشلال يزعم أنه أمسك كل العيوب — أين يكذب التقرير؟ واخفضه إلى 4 فشاهد حتى الرشيق يفقد عيوبه: أي دفعات بردت؟ وأضف F7 بعيبها آخر القائمة وشاهد من يمسكها أولًا. لا اختبار هنا — الفاتورتان تزدادان إثارة كلما غيّرت جدولا.',
        en: 'The sandbox runs the full simulator on the chapter\u2019s tables. Play with it: raise WINDOW to 16 and watch the waterfall claim it caught everything — where does the report lie? Drop it to 4 and watch even the agile side lose defects: which batches went cold? Append F7 with its own defect at the end of the list and see who catches it first. No tests here — the two bills get more interesting with every table you change.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'من الفصل الأول: أي ركني المثلث الحديدي تثبته أجايل — وShape Up؟',
            en: 'From chapter one: which two corners of the iron triangle do agile — and Shape Up — pin?',
          },
          options: [
            { id: 'a', text: { ar: 'الزمن والنطاق — والكلفة هي التي تنصرف', en: 'Time and scope — cost is what gives' } },
            { id: 'b', text: { ar: 'الزمن والكلفة — والنطاق هو الذي ينصرف', en: 'Time and cost — scope is what gives' } },
            { id: 'c', text: { ar: 'الكلفة والنطاق — والزمن يمتد بلا سقف', en: 'Cost and scope — time stretches unbounded' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'أجايل تثبت الزمن (سبرنت قصير) والكلفة (فريق ثابت) وتترك النطاق ينضغط كل تكرار. وShape Up تجعل هذا الرهان معلنًا بأبهى صوره: الشهية سقف زمن وكلفة، والنطاق هو ما يُضيَّق — عكس التقدير الذي يثبت النطاق ويمد الزمن.',
            en: 'Agile pins time (short sprints) and cost (fixed team) and squeezes scope each iteration. Shape Up declares that bet outright: the appetite caps time and cost, and scope is what gets narrowed — the exact reverse of an estimate, which pins scope and stretches time.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'من الفصل الأول: لماذا يمسك الجانب الرشيق عيوبه أرخص من الشلال في محاكاتك؟',
            en: 'From chapter one: why does the agile side catch its defects more cheaply than the waterfall side in your simulator?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن كلفة إصلاح العيب تنمو كلما تأخر اكتشافه — والتكرار يكتشفه مبكرًا', en: 'Because the cost of fixing a defect grows the later it is found — and iterations find it early' } },
            { id: 'b', text: { ar: 'لأن الشيفرة الرشيقة تولّد عيوبًا أقل عددًا أصلًا', en: 'Because agile code produces fewer defects to begin with' } },
            { id: 'c', text: { ar: 'لأن الشلال لا يكتب اختبارات بينما الرشيق يكتبها', en: 'Because waterfall writes no tests while agile does' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'كلا الفريقين ورث العيوب الثلاثة نفسها — منحنى كلفة التغيير من الفصل الأول هو من فرّق: EARLY_FIX بـ 4 مقابل LATE_FIX بـ 9 مقابل فاتورة الهارب 12. العيوب ذاتها وفواتير مختلفة — التوقيت هو الذي يحدد الكلفة.',
            en: 'Both teams inherited the same three defects — it is chapter one\u2019s cost-of-change curve that differs: EARLY_FIX at 4 vs LATE_FIX at 9 vs the escaped bill of 12. Same defects, different bills — timing sets the cost.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ما الذي تحسبه الشهية appetite في Shape Up — بدل التقدير؟',
            en: 'In Shape Up, what does the appetite size — instead of an estimate?',
          },
          options: [
            { id: 'a', text: { ar: 'كم نقطة سيحقق الفريق في السبرنت', en: 'How many points the team will deliver in a sprint' } },
            { id: 'b', text: { ar: 'كم يستحق المشكلة من الوقت — والنطاق هو ما يُضيَّق حتى يسع', en: 'How much time the problem is worth — and scope is narrowed until it fits' } },
            { id: 'c', text: { ar: 'كم يكلف المشروع من ميزانية تشغيلية سنوية', en: 'How much the project costs in yearly operating budget' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'التقدير يسأل: كم سيأخذ هذا؟ فتُبنى الجداول على النطاق وتُمدد عند الفشل. الشهية تعكس السؤال: كم يستحق؟ فإذا لم تسع الفكرة الدفعة الكبيرة (ستة أسابيع) لا يُمنح لها وقت أكثر — تضيق حتى تسع. الزمن ثابت والنطاق مرن.',
            en: 'An estimate asks: how long will this take? — so schedules are built around scope and stretched on failure. The appetite flips the question: what is it worth? If the idea will not fit even a big batch (six weeks), it is not given more time — it is narrowed until it fits. Fixed time, variable scope.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'انتهت الدورة الست وبقي عمل uphill لم يُفهم بعد. ماذا يفعل قاطع الدارة؟',
            en: 'The six-week cycle ends with uphill work still not figured out. What does the circuit breaker do?',
          },
          options: [
            { id: 'a', text: { ar: 'يمدد الدورة أسبوعين تلقائيًا لإكمال القائمة', en: 'Extends the cycle by two weeks automatically to finish the list' } },
            { id: 'b', text: { ar: 'يشحن ما اكتمل ويسقط الباقي — أو يعيد المشروع إلى التشكيل: لا تمديد، وأقصى خسارة دورة واحدة', en: 'Ships what is done and drops the rest — or sends the project back to shaping: no extension, maximum loss one cycle' } },
            { id: 'c', text: { ar: 'يوقف الفريق حتى تُعقد دورة تخطيط طارئة', en: 'Stops the team until an emergency planning cycle is held' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'عند نهاية الدورة يُشحن المنتج أو يُسقط المشروع — بلا تمديد تلقائي. التمديد الوحيد المسموح لعمل must-have كله downhill؛ وبقاء uphill يعني أن التشكيل أخطأ فيعود المشروع إليه. هذه قيمة الرهان: أقصى ما تخسره دورة واحدة.',
            en: 'At cycle end the product ships or the project is dropped — no automatic extension. An extension is allowed only for must-have work that is entirely downhill; remaining uphill means the shaping was wrong, so the project returns there. That is the value of the bet: the most you can lose is one cycle.',
          },
        },
        {
          id: 'q5',
          question: {
            ar: 'من الفصل الرابع عشر: أي ممارسة تنفذ عمليًا ما يَعِد به XP من تكامل واختبار مستمرين؟',
            en: 'From chapter fourteen: which practice actually delivers what XP promises with continuous integration and testing?',
          },
          options: [
            { id: 'a', text: { ar: 'خط CI يدمج كل دفعة ويجري الاختبارات آليًا عند كل تعديل', en: 'A CI pipeline that integrates every batch and runs the tests automatically on each change' } },
            { id: 'b', text: { ar: 'لوحة قضايا ترتب الأخطاء بحسب الخطورة', en: 'A bug tracker ranking defects by severity' } },
            { id: 'c', text: { ar: 'مراجعة كود أسبوعية يجريها كبير المهندسين وحده', en: 'A weekly code review run solely by the lead engineer' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'قانون محاكاتك — اختبر فور البناء — لا يقوم على الانضباط البشري وحده؛ خط CI يفرضه آليًا: كل دفعة تُدمج وتُختبر، فيُمسك العيب في تكراره وهو رخيص، ويبقى الخط الأخضر أو ينكسر بصوت مسموع. هذا هو الجسر من XP إلى أدوات الفصل الرابع عشر.',
            en: 'Your simulator\u2019s law — test the moment you build — cannot rest on human discipline alone; a CI pipeline enforces it mechanically: every batch is integrated and tested, so a defect is caught inside its own iteration while cheap, and the mainline stays green or breaks loudly. That is the bridge from XP to chapter fourteen\u2019s tooling.',
          },
        },
        {
          id: 'q6',
          question: {
            ar: 'من درس سكرم: من يملك «الماذا» ومن يملك «الكيف»؟',
            en: 'From the Scrum lesson: who owns the "what" and who owns the "how"?',
          },
          options: [
            { id: 'a', text: { ar: 'مالك المنتج يملك قائمة الأعمال والماذا، وفريق التطوير يملك الكيف', en: 'The product owner owns the backlog and the what; the development team owns the how' } },
            { id: 'b', text: { ar: 'سكرم ماستر يوزع المهام ويحدد كيف تُبنى كل ميزة', en: 'The Scrum master assigns tasks and decides how each feature is built' } },
            { id: 'c', text: { ar: 'المدير الوظيفي يملك الاثنين ويوافق على كل سبرنت', en: 'The functional manager owns both and signs off every sprint' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'مسؤوليات سكرم الثلاث: مالك المنتج يرتب قائمة الأعمال المتراكمة ويجيب عن ماذا ولماذا؛ وفريق التطوير يقدّر ويقرر كيف تُبنى الميزات؛ وسكرم ماستر يخدم العملية لا يدير الناس. منح الفريق الكيف هو ما يجعل التزام السبرنت حقيقيًا — وقاعدة «الفريق يستلم المشكلة كاملة» في Shape Up امتداد للروح نفسها.',
            en: 'Scrum\u2019s three accountabilities: the product owner orders the backlog and answers what and why; the development team estimates and decides how features get built; the Scrum master serves the process, not the people. Giving the team the how is what makes the sprint commitment real — and Shape Up\u2019s rule of handing the team the whole problem extends the same instinct.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'الشهية تقدير: نقدّر كم سيأخذ العمل ونتتبع الجدول ونمدّ عند التأخر',
          right: 'الشهية سقف: كم يستحق المشكلة من الوقت — والنطاق هو ما يُضيَّق حتى يسع؛ والتي لا تسع الدفعة الكبيرة تُضيَّق ولا يُمنح لها وقت أكثر',
          note: {
            ar: 'هذا انقلاب اتجاه السؤال: التقدير يسأل كم سيأخذ هذا؟ فيثبّت النطاق ويمدّ الزمن عند الفشل. الشهية تعكسه: كم يستحق؟ فإذا لم تسع الفكرة حتى ستة أسابيع ضُيّقت حتى تسع. زمن ثابت ونطاق مرن — والقاطع يذكّرك أن أقصى خسارة دورة واحدة.',
            en: 'This flips the question: an estimate asks how long will it take? — pinning scope and stretching time on failure. The appetite reverses it: what is it worth? If the idea will not fit six weeks, it is narrowed until it fits. Fixed time, variable scope — and the circuit breaker reminds you the most you can lose is one cycle.',
          },
        },
        {
          wrong: 'أحفظ كل فكرة في قائمة أعمال دائمة حتى لا تضيع — backlog ينمو كل أسبوع',
          right: 'رهانات لا قائمة: الفكرة غير المختارة تسقط وتعود إن كانت تستحق — وبين الدورات تهدئة تُراجع فيها البيانات وتُعالج الأخطاء',
          note: {
            ar: 'القائمة التي لا تنمو إلا هي عبء تنظيم دائم وذنب «أنا متأخر دائمًا». يجيب Shape Up بإلغاء القائمة: الفكرة الخام تأخذ جوابًا مؤقتًا «مثير للاهتمام — ربما لاحقًا»، ثم تُشكَّل كفاية لتُراهن أو تسقط. والأخطاء بلا مسار خاص: تُصلح في التهدئة، أو تُراهن على طاولة الرهان، أو دورة تحطيم عيوب كاملة.',
            en: 'A list that only ever grows is permanent grooming overhead and permanent "always behind" guilt. Shape Up answers by having no backlog: a raw idea gets the provisional "interesting — maybe someday", then is shaped enough to be bet on or lapse. Bugs get no privileged lane either: fixed during cool-down, bet at the table, or a full bug-smash cycle.',
          },
        },
        {
          wrong: 'المحاكاة أثبتت أن الرشيق يفوز دائمًا — سأحوّل فريقي كله غدًا',
          right: 'المحاكاة نموذج ثابت الجداول أظهر شكل النتيجة: تأجيل الاختبار في هذه البيانات بالذات كلّف 46 بدل 28 مع عيب هارب — ولا عملية أفضل عالميًا؛ الأفضل لمخاطر مشروعك وفريقه وقيوده',
          note: {
            ar: 'الفصل يختم بتحذيره: لا توجد عملية أفضل عالميًا. المُحاكي مثبّت الأرقام عمدًا ليكون حكمه قابلًا للتحقق — لكنه يعلمك الشكل لا العالم: قيّم مخاطر مشروعك، اختر العملية التي تعالجها مبكرًا، وكيّفها كلما تغيرت الظروف. الرهانات تُقرأ ولا تُستورد.',
            en: 'The chapter ends with its warning: there is no universally best process. The simulator pins its numbers on purpose so its verdict is checkable — but it teaches the shape of the result, not the world: evaluate your project\u2019s risks, pick the process that addresses them early, and adapt as conditions change. Bets are read, not imported.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفصل كله رهانات على أين يسكن الخطر: المخططة (الشلال وعرض V) تؤجل الدمج والاختبار حيث كلفة التغيير أشد انحدارًا؛ سكرم يمنح الإيقاع والمحاسبة وXP الانضباط الهندسي؛ والحلزون يوجّه كل دورة لأكبر خطر باقٍ بتعرضه. والسؤال الجامع: كيف تعرف أنك أخطأت والخطأ رخيص؟', en: 'The whole chapter was bets about where risk lives: plan-driven (waterfall and the V) defers integration and testing to where cost-of-change is steepest; Scrum supplies cadence and accounting, XP the engineering discipline; the spiral steers each loop at the biggest remaining risk by exposure. The one question: how do you find out you were wrong while it is still cheap?' },
        { ar: 'Shape Up يثبت الزمن ويرن النطاق: شهية بدل تقدير (دفعة صغيرة أسبوع إلى اثنين، كبيرة ستة أسابيع، وما لا يسع يُضيَّق)، تشكيل قبل الرهان (rough وsolved وbounded وبلا rabbit holes)، بلا قائمة أعمال، تهدئة أسبوعان بين الدورات، وقاطع دارة: يشحن أو يسقط — أقصى خسارة دورة.', en: 'Shape Up fixes time and flexes scope: an appetite instead of an estimate (small batch one to two weeks, big batch six, and what will not fit gets narrowed), shaping before betting (rough, solved, bounded, rabbit holes removed), no backlog, a two-week cool-down between cycles, and a circuit breaker: ship or drop — the most you can lose is one cycle.' },
        { ar: 'مشروعك مُحاكي العمليات: قائمة واحدة من 16 نقطة بثلاثة عيوب مدفونة، وقوانين: نافذة طزاجة 7، وإصلاح متأخر 9، وإصلاح مبكر 4، وعيب هارب 12. الشلال بجولة اختبار ختامية واحدة وجد 2/3 ودفع 46 مع عيب هارب؛ والرشيق يختبر كل دفعة فورًا فوجد 3/3 ودفع 28.', en: 'Your project is the process simulator: one 16-point list with three planted defects and the laws — freshness window 7, late fix 9, early fix 4, escaped defect 12. The waterfall with one end-game test pass found 2/3 and paid 46 with one escaped; agile tests every batch immediately, found 3/3 and paid 28.' },
        { ar: 'ولا عملية أفضل عالميًا: الأفضل لمخاطر هذا المشروع وفريقه وقيوده. قيّم المخاطر، اختر العملية التي تعالجها مبكرًا، وكيّفها كلما تغيرت الظروف. وتذكّر درس المحاكي: توقيت الاختبار وحده جعل الفاتورتين 28 و46.', en: 'And no process is universally best: only best for this project\u2019s risks, team, and constraints. Evaluate the risks, pick the process that addresses them early, and adapt as conditions change. And remember the simulator\u2019s lesson: testing timing alone put the two bills at 28 and 46.' },
      ],
      reflectPrompt: {
        ar: 'افتح الملعب واخفض WINDOW إلى 4 — حتى الرشيق يخسر عيوبه. ثم اسأل نفسك: في مشروعك القادم، ما نافذتك الحقيقية — كم أسبوعًا يبقى سياق العمل حيًا في رأس فريقك؟ وأين تجعل الاختبار يقف داخلها؟',
        en: 'Open the sandbox and drop WINDOW to 4 — even the agile side loses defects. Then ask yourself: on your next project, what is your real window — how many weeks does work stay alive in your team\u2019s head? And where inside it will you place testing?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch2.s8', pages: 'ص51-54 / pp.51-54' },
        { book: 'SWE', section: 'swe.ch2.s9', pages: 'ص54-55 / pp.54-55' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch2.s8', pages: 'ص51-54 / pp.51-54' },
    { book: 'SWE', section: 'swe.ch2.s9', pages: 'ص54-55 / pp.54-55' },
  ],
} satisfies Lesson;

export default lesson;
