import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch19.l2 — "Multi-Fidelity HPO and Successive Halving"
 * ضبط فرط المعاملات متعدد الدقة والتقسيم المتتالي
 * Aligned with D2L ch19 s4 (Multi-Fidelity Hyperparameter Optimization) + s5
 * (Asynchronous Successive Halving). All expression is original — a
 * paraphrase of the source's ideas, never a verbatim translation. Runnable
 * design: successive halving over a fixed bracket of 8 configurations with
 * literal per-rung errors (eliminations verified by hand). Every literal
 * verified under CPython 3. No sampling anywhere — the bracket is data.
 */
const lesson = {
  id: 'd2l.ch19.l2',
  version: 1,
  part: 'II',
  track: 'A7',
  book: 'D2L',
  chapter: 19,
  title: {
    ar: 'ضبط فرط المعاملات متعدد الدقة والتقسيم المتتالي',
    en: 'Multi-Fidelity HPO and Successive Halving',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch19.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الدرس السابق دفعنا الثمن الكامل لكل تهيئة: تدريب كامل حتى آخر دورة ثم حكم. لكن منحنيات التعلم تكشف مبكرًا عن مصيرها — التهيئة الرديئة تبقى رديئة بعد ثلاث دورات، والوعد لا يظهر إلا في المنحدرات الجيدة. ضبط متعدد الدقة يستثمر هذه الرؤية: أعطِ الجميع قليلًا من الموارد، واحكم مبكرًا، وأغذِ الناجين فقط. التقسيم المتتالي هو أبسط صورة لهذه الفكرة، وسنشغّل قوسًا كاملًا من ثماني تهيئات بأخطاء ثابتة ونعدّ كل وحدة حساب.',
        en: 'Last lesson paid full price for every configuration: a complete training run before a verdict. Yet learning curves betray their fate early — a poor configuration stays poor after a few epochs, and promise shows up as a steep slope. Multi-fidelity HPO exploits that: give everyone a little budget, judge early, feed only the survivors. Successive halving is the simplest form of the idea, and we will run a full bracket of eight configurations with fixed errors, counting every compute unit.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الدقة كمورد: هدف جديد بمدخلين', en: 'Fidelity as a resource: a new two-input objective' },
      chunks: [
        {
          ar: 'نوسّع تعريف الهدف إلى f(x, r) حيث r ∈ [r_min, r_max] كمية الموارد الممنوحة لتقييم x: عدد دورات التدريب عادةً، وقد يكون حجم عينة التدريب أو عدد طيات التحقق المتقاطع. نضمن أن الخطأ f(x, r) ينخفض مع r بينما الكلفة c(x, r) ترتفع. طرق الدقة الواحدة توزع r_max على الجميع؛ لكن المنحنيات تفرز مبكرًا: بعد دورات قليلة نميّز بصريًا التهيئات الجيدة من الرديئة — والضجيج يبقي الحكم النهائي مؤجلًا حتى النهاية. الحل: حكم مبكر خشن بدل حكم متأخر دقيق.',
          en: 'Extend the objective to f(x, r) with r \u2208 [r_min, r_max], the resources granted to evaluate x: usually training epochs, but it could be the training-subset size or the number of cross-validation folds. We assume the error f(x, r) decreases with r while the cost c(x, r) grows. Single-fidelity methods hand everyone r_max; yet curves separate early: after a few epochs you can visually tell strong configurations from weak ones — noise just keeps the final ranking uncertain until the end. The fix: a rough early verdict instead of a precise late one.',
        },
        {
          ar: 'التقسيم المتتالي: ابدأ بـ N تهيئة ودرّبها حتى الدرجة الأولى r_min؛ رتّب أخطاء التحقق واحتفظ بالجزء 1/η الأعلى (الأفضل) وارمِ البقية؛ الناجون يُدرَّبون حتى الدرجة التالية r_min·η، وهكذا حتى تصل تجربة واحدة على الأقل إلى r_max. مع الاختيار القياسي N = η^K و r_max = r_min·η^K تكون الدرجات R = {r_min, r_min·η, r_min·η², …, r_max} والناجي النهائي واحدًا. الميزانية الكلية = Σᵢ η^(K−i)·r_min·ηⁱ = N·(r_max + r_min) تقريبًا نصف ما تدفعه طرق الدقة الواحدة لتدريب الجميع حتى النهاية.',
          en: 'Successive halving: start with N configurations and train each to the first rung r_min; sort validation errors, keep the top 1/η fraction, discard the rest; survivors train to the next rung r_min·\u03B7, and so on until at least one trial reaches r_max. With the canonical choice N = \u03B7^K and r_max = r_min·\u03B7^K the rungs are R = {r_min, r_min·\u03B7, r_min·\u03B7\u00B2, \u2026, r_max} and exactly one survivor finishes. The total budget \u03A3\u1D62 \u03B7^(K\u2212\u1D62)·r_min·\u03B7\u1D62 comes to roughly half of what single-fidelity training of everyone to the end would cost.',
        },
        {
          ar: 'والآن الجدولة: التقسيم المتتالي المزامَن ينتظر اكتمال كل تجارب الدرجة قبل الترقية، فتتسرب فترات خمول من كل متشعب. ASHA (التقسيم المتتالي غير المتزامن) تترقى بالتهيئة فور جاهزيتها دون انتظار رفاقها — قد تُرقّى أحيانًا تهيئة خاطئة مبكرًا، لكن الخسارة الناتجة عادة أقل بكثير من مكسب إشغال العاملات باستمرار، ولذلك هي الخيار العملي في الأنظمة الموزعة. تذكّر أيضًا: الحكم المبكر وسيط مهم؛ منحنى واعد في بدايته قد لا يحافظ على صدارته — وهذا ثمن مقبول معروف.',
          en: 'Now scheduling: synchronous successive halving waits for every trial at a rung before promoting, so stragglers leak idle time at each level. ASHA (asynchronous successive halving) promotes a configuration the moment it finishes its rung — it will sometimes promote an early wrong one, but in practice that loss is far smaller than the gain of keeping workers busy, which is why it is the workhorse of distributed systems. Remember the judge is a proxy: a promising early curve does not always keep its lead — a known, accepted price.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'قوس تقسيم متتالي كامل: ثماني تهيئات وأربع درجات',
        en: 'A full successive-halving bracket: eight configurations, four rungs',
      },
      code: "# fixed bracket: 8 configurations, eta = 2, rungs 1, 2, 4, 8 epochs\nERRORS = {\n    1: [0.62, 0.55, 0.71, 0.58, 0.66, 0.52, 0.74, 0.60],   # c0 .. c7\n    2: {1: 0.41, 3: 0.44, 5: 0.49, 7: 0.47},\n    4: {1: 0.33, 3: 0.38},\n    8: {1: 0.27},\n}\nRUNGS = [1, 2, 4, 8]\n\ndef successive_halving(errors, rungs, eta=2, n0=8):\n    survivors = list(range(n0))\n    budget = 0\n    for r in rungs:\n        budget += r * len(survivors)          # each survivor trains r epochs\n        scored = sorted(survivors, key=lambda c: (errors[r][c], c))\n        keep = max(1, len(survivors) // eta)\n        print('rung %d: %s' % (r, '  '.join('c%d=%.2f' % (c, errors[r][c]) for c in scored)))\n        print('rung %d: promote %s, drop %s'\n              % (r, ['c%d' % c for c in scored[:keep]], ['c%d' % c for c in scored[keep:]]))\n        survivors = scored[:keep]\n    return survivors[0], budget\n\nwinner, budget = successive_halving(ERRORS, RUNGS)\nprint('winner: c%d, budget %d epoch-units (training all eight fully costs %d)'\n      % (winner, budget, 8 * 8))",
      explanation: {
        ar: 'اقرأ القوس درجة بدرجة. الدرجة 1 (بعد دورة واحدة): الترتيب c5=0.52 ثم c1=0.55 ثم c3=0.58 ثم c7=0.60 — يُرقَّى الأربعة ويُرمى c0 و c4 و c2 و c6. الدرجة 2: c1=0.41 و c3=0.44 يتفوقان على c7=0.47 و c5=0.49 فيُرقَّى اثنان. الدرجة 4: c1=0.33 أمام c3=0.38 فيبقى واحد. الدرجة 8: c1 يختم بـ 0.27. الميزانية 1×8 + 2×4 + 4×2 + 8×1 = 32 وحدة دورة، أي نصف كلفة تدريب الجميع حتى 8 دورات (64). انتبه للمحفظة: c5 قُطع في الدرجة 2 بفارق 0.02 عن c3 — في ASHA قد تُرقَّى التهيئة الخاطئة أحيانًا، وهذه خسارة صغيرة يُقبلها النظام مقابل عدم إيقاف العاملات.',
        en: 'Read the bracket rung by rung. Rung 1 (one epoch): the order is c5=0.52, c1=0.55, c3=0.58, c7=0.60 — four are promoted and c0, c4, c2, c6 are dropped. Rung 2: c1=0.41 and c3=0.44 outrun c7=0.47 and c5=0.49, so two advance. Rung 4: c1=0.33 beats c3=0.38 and one remains. Rung 8: c1 seals it at 0.27. The budget is 1\u00D78 + 2\u00D74 + 4\u00D72 + 8\u00D71 = 32 epoch-units — half the cost of training everyone for eight epochs (64). Note the margin: c5 was cut at rung 2 by just 0.02 behind c3 — under ASHA an early wrong promotion happens occasionally, a small accepted price for never idling the workers.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.promote',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ قلب التقسيم المتتالي: الدالة promote(candidates, errors, eta) تستلم معرفات التهيئات على درجة حالية وقاموس أخطائها وثابت التقسيم eta، وتعيد قائمة الناجين مرتبين من الأفضل، بطول max(1, len(candidates) // eta).',
        en: 'Implement the heart of successive halving: promote(candidates, errors, eta) receives the configuration ids at the current rung, a dict of their errors, and the halving constant eta, and returns the survivors best-first with length max(1, len(candidates) // eta).',
      },
      starterCode: "def promote(candidates, errors, eta):\n    # TODO: sort candidates by (error, id) ascending, keep the top\n    # max(1, len(candidates) // eta) of them, return the survivors.\n    return []\n",
      solution: "def promote(candidates, errors, eta):\n    scored = sorted(candidates, key=lambda c: (errors[c], c))\n    return scored[:max(1, len(candidates) // eta)]",
      tests: [
        {
          id: 't1',
          name: { ar: 'الدرجة الأولى من قوس الدرس', en: 'First rung of the lesson bracket' },
          code: "errs = {0: 0.62, 1: 0.55, 2: 0.71, 3: 0.58, 4: 0.66, 5: 0.52, 6: 0.74, 7: 0.60}\ngot = promote(list(range(8)), errs, 2)\nassert got == [5, 1, 3, 7], 'expected [5, 1, 3, 7] | got %r' % (got,)",
          expected: '[5, 1, 3, 7]',
        },
        {
          id: 't2',
          name: { ar: 'الدرجة الثانية مع فوارق ضيقة', en: 'Second rung with tight margins' },
          code: "got = promote([5, 1, 3, 7], {1: 0.41, 3: 0.44, 5: 0.49, 7: 0.47}, 2)\nassert got == [1, 3], 'expected [1, 3] | got %r' % (got,)",
          expected: '[1, 3]',
        },
        {
          id: 't3',
          name: { ar: 'eta = 3 يحافظ على الثلث الأعلى', en: 'eta = 3 keeps the top third' },
          code: "errs = {i: float(9 - i) for i in range(9)}   # c0 is worst, c8 best\ngot = promote(list(range(9)), errs, 3)\nassert len(got) == 3 and got[0] == 8, 'expected 3 survivors starting with c8 | got %r' % (got,)\nassert promote([4], {4: 0.9}, 2) == [4], 'a single config always survives'",
          expected: '3 survivors led by c8; single config survives',
        },
      ],
      hints: [
        { ar: 'الترتيب سطر واحد: sorted(candidates, key=lambda c: (errors[c], c)) — الربط بالمعرّف يكسر التعادل بحتمية.', en: 'Sorting is one line: sorted(candidates, key=lambda c: (errors[c], c)) — tie-breaking on the id keeps it deterministic.' },
        { ar: 'عدد الناجين max(1, len(candidates) // eta) — القسمة الصحيحة، وقيمة دنيا 1 تضمن ألا تصفّر القوس أبدًا.', en: 'Survivor count is max(1, len(candidates) // eta) — integer division, floored at 1 so the bracket never empties.' },
        { ar: 'قيم تحقق: من الأخطاء {c5: 0.52, c1: 0.55, c3: 0.58, c7: 0.60, …} يخرج الناجون [5, 1, 3, 7] تمامًا كما في المثال المُشغَّل.', en: 'Sanity values: from errors {c5: 0.52, c1: 0.55, c3: 0.58, c7: 0.60, \u2026} the survivors are exactly [5, 1, 3, 7] as in the worked example.' },
        { ar: 'لا تُرجع الأخطاء ولا الترتيب الكامل — الناجون فقط، من الأفضل إلى الحد، لأنهم من سيُدرَّب على الدرجة التالية.', en: 'Return only the survivors, best first — they are the ones who train on to the next rung.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.numeric-bracket-budget',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'قوس تقسيم متتالي بـ r_min = 2 و r_max = 16 و η = 2 (إذن N = 8 تهيئات والدرجات 2, 4, 8, 16). كم وحدة دورة تدريب تستهلكه درجات القوس كلها؟ (الدرجة r تكلف r × عدد الناجين عليها.)',
        en: 'A successive-halving bracket with r_min = 2, r_max = 16, \u03B7 = 2 (so N = 8 configurations and rungs 2, 4, 8, 16). How many epoch-units do all the rungs consume in total? (Rung r costs r \u00D7 its survivor count.)',
      },
      answer: '64',
      solution: '64',
      hints: [
        { ar: 'عدّد الناجين: 8 على الدرجة 2، ثم 4 على 4، ثم 2 على 8، ثم 1 على 16.', en: 'Count the survivors: 8 at rung 2, then 4 at rung 4, then 2 at rung 8, then 1 at rung 16.' },
        { ar: 'اجمع: 8×2 + 4×4 + 2×8 + 1×16.', en: 'Sum: 8\u00D72 + 4\u00D74 + 2\u00D78 + 1\u00D716.' },
        { ar: 'لاحظ الأناقة: كل درجة تستهلك 16 وحدة بالضبط — إجمالي 4 درجات.', en: 'Notice the elegance: every rung consumes exactly 16 units — four rungs in total.' },
        { ar: 'الجواب: 64 — نفس كلفة تدريب ثماني تهيئات لست عشرة دورة كاملة مقسومة ذكاءً.', en: 'Answer: 64 — the same cost as training all eight configurations a full sixteen epochs, but spent intelligently.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "ERRORS = {\n    1: [0.62, 0.55, 0.71, 0.58, 0.66, 0.52, 0.74, 0.60],\n    2: {1: 0.41, 3: 0.44, 5: 0.49, 7: 0.47},\n    4: {1: 0.33, 3: 0.38},\n    8: {1: 0.27},\n}\n\ndef promote(candidates, errors, eta):\n    return sorted(candidates, key=lambda c: (errors[c], c))[:max(1, len(candidates) // eta)]\n\ndef bracket(errors, rungs, eta, n0):\n    survivors, budget = list(range(n0)), 0\n    for r in rungs:\n        budget += r * len(survivors)\n        survivors = promote(survivors, errors[r] if isinstance(errors[r], dict)\n                            else dict(enumerate(errors[r])), eta)\n        print('rung %d -> survivors %s' % (r, ['c%d' % c for c in survivors]))\n    return survivors[0], budget\n\nprint('eta = 2 bracket:')\nprint('  winner c%d, budget %d' % bracket(ERRORS, [1, 2, 4, 8], 2, 8))\nprint('eta = 4 bracket (top quarter each rung):')\nprint('  winner c%d, budget %d' % bracket(ERRORS, [1, 2, 4, 8], 4, 8))\n\n# جرّب: بـ eta=4 من أي خطأ تحذف c3 الذي وصل الدرجة 8 في القوس الأصلي؟ قارن الحكمين عند الدرجة 4.\n# try: with eta=4, which rung eliminates c3 (who reached rung 8 in the original bracket)? Compare the two verdicts at rung 4.\n# جرّب: ارفع خطأ c1 في الدرجة 4 من 0.33 إلى 0.40 فمن يفوز بالقوس؟ ماذا يخبرك ذلك عن حساسية الحكم المبكر؟\n# try: raise c1's rung-4 error from 0.33 to 0.40 - who wins now? What does that say about the fragility of early verdicts?\n",
      prompt: {
        ar: 'الملعب يحرر ثابت التقسيم: مع η=4 يُبقى على الربع الأعلى في كل درجة فيصل القوس أسرع لكنه يحكم على أدلة أقل. جرّب تعديل قيمة واحدة في جدول الأخطاء ولاحظ كيف ينقلب الفائز — هذه هشاشة الحكم المبكر التي قبلتها ASHA عن معرفة.',
        en: 'The sandbox frees the halving constant: with \u03B7=4 the top quarter survives each rung, so the bracket finishes sooner but judges on less evidence. Flip a single value in the error table and watch the winner change — that is the fragility of early verdicts, accepted knowingly by ASHA.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'في ضبط متعدد الدقة، ماذا يمثل المدخل r في الهدف f(x, r)؟',
            en: 'In multi-fidelity HPO, what does the input r of the objective f(x, r) represent?',
          },
          options: [
            { id: 'a', text: { ar: 'كمية الموارد الممنوحة لتقييم x — عادة عدد دورات التدريب، وقد يكون حجم عينة التدريب أو عدد طيات التحقق', en: 'The resources granted to evaluate x — usually training epochs, possibly the training-subset size or number of cross-validation folds' } },
            { id: 'b', text: { ar: 'قيمة فرط معامل التنظيم للتهيئة x', en: 'The value of the regularization hyperparameter for configuration x' } },
            { id: 'c', text: { ar: 'عدد المرات التي أُعيد فيها تقييم x نفسها', en: 'How many times x itself has been re-evaluated' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'r هو رافعة الدقة: الخطأ f(x, r) ينخفض مع r والكلفة ترتفع. أكثر القيم شيوعًا عدد الدورات؛ ويمكن أيضًا اقتصار التدريب على عينة أصغر أو طيات أقل. القوس في درسنا استخدم دورات تدريب: درجات 1, 2, 4, 8.',
            en: 'r is the fidelity lever: the error f(x, r) decreases with r while cost grows. Epochs are the commonest choice; a cheaper proxy can also be a smaller training subset or fewer folds. Our bracket used epochs: rungs 1, 2, 4, 8.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'في التقسيم المتتالي بثابت η، ما نصيب الناجين من كل درجة؟',
            en: 'In successive halving with constant \u03B7, what fraction of trials survives each rung?',
          },
          options: [
            { id: 'a', text: { ar: 'النصف دائمًا بغض النظر عن η', en: 'Always half, regardless of \u03B7' } },
            { id: 'b', text: { ar: 'الجزء 1/η الأعلى ترتيبًا في خطأ التحقق — مع η=2 يبقى النصف، ومع η=3 الثلث', en: 'The top 1/\u03B7 fraction by validation error — with \u03B7=2 half survive, with \u03B7=3 a third' } },
            { id: 'c', text: { ar: 'الجميع يترقى وإن تفاوتت مواردهم', en: 'Everyone advances, with different budgets' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'بعد كل درجة يُحتفظ بالجزء 1/η من التهيئات (الأفضل خطأً) ويُرمى الباقي، ويتضاعف نصيب كل ناجٍ من الموارد بعامل η. في قوسنا مع η=2: ثمانية → أربعة → اثنان → واحد، والموارد 1 → 2 → 4 → 8 دورات.',
            en: 'After each rung the top 1/\u03B7 of configurations (by validation error) survive and the rest are dropped, while each survivor\u2019s budget multiplies by \u03B7. In our bracket with \u03B7=2: eight \u2192 four \u2192 two \u2192 one, with budgets 1 \u2192 2 \u2192 4 \u2192 8 epochs.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا تُرقّي ASHA التهيئات فور جاهزيتها حتى مع خطر ترقية التهيئة الخاطئة؟',
            en: 'Why does ASHA promote configurations as soon as they finish, even at the risk of promoting a wrong one?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن انتظار اكتمال الدرجة كاملة يجبر العاملات على الخمول عند كل متشعب، وخسارة القرار المبكر أقل عمومًا من خسارة الوقت الميت', en: 'Because waiting for a full rung idles workers at every straggler, and the occasional early mistake costs less than the dead time' } },
            { id: 'b', text: { ar: 'لأن الترقية المبكرة تجعل تقديرات الخطأ أكثر دقة', en: 'Because early promotion makes the error estimates more accurate' } },
            { id: 'c', text: { ar: 'لأن ASHA لا تحذف أي تهيئة أبدًا — ترقي فقط', en: 'Because ASHA never drops any configuration — it only promotes' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التقسيم المزامن يحتاج كل ملاحظات الدرجة قبل قرار الترقية، فتتوقف العاملات عن العمل حتى ينهي المتشعب مهمته. ASHA تقرر بأي نافذة متاحة فور اكتمال تجربة، وقد تُخطئ أحيانًا — لكن عمليًا مكسب إشغال العاملات يفوق خسارة الترقية الخاطئة، كما ترى في محاكاة الجدولة أن الخمول هو العدو.',
            en: 'Synchronous halving needs every observation at a rung before promoting, so workers stall until the straggler finishes. ASHA decides with whatever worker is free the moment a trial completes, and will occasionally err — but in practice keeping workers busy outweighs the wrong promotions, just as our scheduling simulation showed idle time to be the enemy.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'متعدد الدقة يوسّع الهدف إلى f(x, r): موارد أقل كوكيل رخيص، والحكم المبكر الخشن يغني عن الحكم المتأخر الدقيق في معظم الحالات (الهدف من s4 ضبط فرط المعاملات متعدد الدقة).', en: 'Multi-fidelity widens the objective to f(x, r): a small budget as a cheap proxy, and a rough early verdict replacing the precise late one in most cases (goal of s4 Multi-Fidelity Hyperparameter Optimization).' },
        { ar: 'التقسيم المتتالي يبدأ بـ N = η^K تهيئة ويحتفظ بالجزء 1/η في كل درجة من درجات R = {r_min, r_min·η, …, r_max}، فيستخدم نصف الكلفة تقريبًا ويترك ناجيًا واحدًا عند الحد الأقصى (الهدف من s4: خوارزمية التقسيم المتتالي).', en: 'Successive halving starts with N = \u03B7^K configurations and keeps the top 1/\u03B7 at each rung of R = {r_min, r_min·\u03B7, \u2026, r_max}, spending roughly half the compute and leaving a single survivor at the maximum (goal of s4: the successive-halving algorithm).' },
        { ar: 'ASHA تزيل نقاط التزامن بترقية كل تهيئة فور اكتمال درجتها، وتقبل أحيانًا ترقية خاطئة لأن إشغال العاملات أثمن (الهدف من s5 التقسيم المتتالي غير المتزامن).', en: 'ASHA removes synchronization points by promoting each configuration the moment its rung completes, accepting occasional wrong promotions because busy workers matter more (goal of s5 Asynchronous Successive Halving).' },
      ],
      reflectPrompt: {
        ar: 'مشروعك القادم يسمح بتدريب كل تهيئة ثلاث دورات فقط قبل الحكم: اختر r_min و η وقيمة N بحيث لا يتجاوز قوسك ثلث ميزانية تدريب ثماني تهيئات حتى النهاية، وبرر اختيارك بأرقام من قوس الدرس.',
        en: 'Your next project allows only three epochs per configuration before a verdict: choose r_min, \u03B7 and N so your bracket never exceeds a third of the budget of training eight configurations to the end, and justify it with numbers from the lesson\u2019s bracket.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch19.s4' },
        { book: 'D2L', section: 'd2l.ch19.s5' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch19.s4' },
    { book: 'D2L', section: 'd2l.ch19.s5' },
  ],
} satisfies Lesson;

export default lesson;
