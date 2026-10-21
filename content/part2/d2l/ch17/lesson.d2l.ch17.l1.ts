import type { Lesson } from '@/lib/content/schema';

/**
 * d2l.ch17.l1 — "Reinforcement Learning: MDPs, Value Iteration, and Q-Learning"
 * التعلم المعزز: عمليات ماركوف للقرار، تكرار القيمة، وتعلم Q
 * Aligned with D2L ch17 s1 (Markov Decision Process) + s2 (Value Iteration)
 * + s3 (Q-Learning). All expression is original — a paraphrase of the source's
 * ideas, never a verbatim translation. Runnable design: value iteration on a
 * fixed 3-state MDP with literal transitions (verified fixed point) plus the
 * Q-learning update applied by hand on fixed (s, a, r, s') tuples. Every
 * literal verified under CPython 3. Deterministic only — no exploration loop.
 */
const lesson = {
  id: 'd2l.ch17.l1',
  version: 1,
  part: 'II',
  track: 'A8',
  book: 'D2L',
  chapter: 17,
  title: {
    ar: 'التعلم المعزز: عمليات ماركوف للقرار، تكرار القيمة، وتعلم Q',
    en: 'Reinforcement Learning: MDPs, Value Iteration, and Q-Learning',
  },
  estimatedMinutes: 30,
  prerequisites: ['d2l.ch19.l2'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل ما دربته حتى الآن كان يتعلم من بيانات مُعنونة سلفًا؛ أما روبوتٌ يتنقل أو لاعبٌ يلعب Go فيتعلم من عواقب أفعاله خطوة بخطوة. في هذا الدرس نُحول مشكلة قرار متسلسل إلى صيغة عملية قابلة للحساب: عمليّة ماركوف للقرار بأربع مكونات، ثم خوارزميتان — تكرار القيمة الذي يعرف البيئة كاملة، وتعلم Q الذي يتعلم من تجارب ثابتة (s, a, r, s′) دون معرفة قواعد البيئة. سنحسب كل الأرقام بأيدينا على MDP من ثلاث حالات.',
        en: 'Everything you trained so far learned from pre-labeled data; a navigating robot or a Go-playing agent instead learns from the consequences of its own actions, step by step. Here we turn a sequential decision problem into something computable: a Markov decision process with four components, then two algorithms — value iteration, which knows the environment completely, and Q-learning, which learns from fixed (s, a, r, s\u2032) experience tuples without knowing the rules. We compute every number by hand on a 3-state MDP.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'صيغة MDP: الحالات والأفعال والانتقالات والمكافآت', en: 'The MDP formulation: states, actions, transitions, rewards' },
      chunks: [
        {
          ar: 'عملية ماركوف للقرار هي الرباعية MDP = (S, A, T, r): مجموعة الحالات S (موقع الروبوت في شبكة)، ومجموعة الأفعال A (تقدّم، استدر…)، ودالة الانتقال T(s, a, s′) = P(s′ | s, a) التي توزّع احتمالات الوصول إلى الحالة التالية، ودالة المكافأة r(s, a) التي تُصممها أنت لتجسيد الهدف. المسار τ = (s₀, a₀, r₀, s₁, …) يجمع هذه العناصر، وهدف التعلم المعزز هو المسار ذو العائد الأعلى. افصل بين التعلم بالمعززات وتعلم الأنصاف الذي اعتمدتَه سابقًا: هنا لا أحد يعطيك الإجابة الصحيحة.',
          en: 'A Markov decision process is the quadruple MDP = (S, A, T, r): the state set S (robot locations in a grid), the action set A (go forward, turn…), the transition function T(s, a, s\u2032) = P(s\u2032 | s, a) distributing probabilities over next states, and the reward function r(s, a), which you design to encode the goal. A trajectory τ = (s\u2080, a\u2080, r\u2080, s\u2081, …) chains these pieces, and the goal of reinforcement learning is the trajectory with the highest return. Contrast this with supervised learning you have used so far: nobody hands you the correct answer.',
        },
        {
          ar: 'لأن المسار قد لا ينتهي أبدًا، نُخفّض العائد بعامل الخصم γ < 1: R(τ) = r₀ + γr₁ + γ²r₂ + …. خصم صغير يجعل الروبوت يفضل المكافآت العاجلة ويختار مسارات قصيرة؛ وخصم قريب من 1 (مثل 0.99) يشجعه على الاستكشاف ومراجعة العوائد البعيدة. أما افتراض ماركوف فيقول إن الحالة التالية تعتمد على sₜ و aₜ فقط لا على التاريخ؛ وإذا بدا الافتراض ضيّقًا فالحل غالبًا إثراء الحالة — خزّن (الموقع، السرعة) معًا ويعود النظام ماركوفيًا.',
          en: 'Because a trajectory may never end, the return is discounted with γ < 1: R(τ) = r\u2080 + γr\u2081 + γ²r\u2082 + … . A small discount makes the agent prefer immediate payoffs and short paths; a discount near 1 (say 0.99) encourages exploration and caring about distant rewards. The Markov assumption says the next state depends only on s\u209C and a\u209C, not on history; when the assumption feels too tight, the usual fix is to enrich the state — store (location, velocity) together and the system becomes Markovian again.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'تكرار القيمة ثم تعلم Q: من معرفة البيئة إلى التعلم من البيانات', en: 'Value iteration then Q-learning: from knowing the environment to learning from data' },
      chunks: [
        {
          ar: 'دالة القيمة V^π(s) هي العائد المخصَّص المتوقع بدءًا من s واتباع السياسة π. تفكيك المسار إلى مرحلتين يعطي مبدأ البرمجة الديناميكية لبلمان: بقايا المسار الأمثل أمثلٌ هو. تكرار القيمة يقلب هذا المبدأ إلى تحديث: V_{k+1}(s) = max_a [ r(s, a) + γ Σ_{s′} P(s′ | s, a) V_k(s′) ]. المهام محدبة الانكماش، فالتكرار يتقارب إلى V* من أي تهيئة — وسنثبت ذلك عمليًا عندما تستقر قيمنا الثابتة بعد تكرارين. ثمن الطريقة: تعرف كاملة لـ P و r.',
          en: 'The value function V^π(s) is the expected discounted return starting at s and following policy π. Splitting a trajectory into two stages yields Bellman\u2019s principle of dynamic programming: the remainder of an optimal trajectory is optimal. Value iteration turns this into an update: V_{k+1}(s) = max_a [ r(s, a) + γ Σ_{s\u2032} P(s\u2032 | s, a) V_k(s\u2032) ]. The iteration is a contraction, so it converges to V* from any initialization — we will watch our own numbers freeze after two sweeps. The price: complete knowledge of P and r.',
        },
        {
          ar: 'تعلم Q يستبدل المجموع على كل الحالات بعينات زارها الوكيل فعلًا: لكل تجربة (s, a, r, s′) حدِّث Q(s, a) ← Q(s, a) + α·(target − Q(s, a)) حيث target = r + γ·max_{a′} Q(s′, a′) — وصفر للحالة النهائية. القيمة Q^*(s, a) هي العائد المتوقع إذا بدأت بفعل a في s ثم اتبعت الأمثل. الجديد هنا: البيانات نفسها تحمل معلومة الانتقال الضمنيًا، فلا حاجة لدالة T. لكن جمع البيانات يحتاج سياسة استكشاف، وأشهرها ε-greedy: احتمال 1 − ε للاختيار الجشع وفق Q^ الحالي واحتمال ε لفعل عشوائي؛ وتوجد بديلة softmax بدرجة حرارة T.',
          en: 'Q-learning replaces the sum over all states with the states the agent actually visited: for each experience tuple (s, a, r, s\u2032) update Q(s, a) ← Q(s, a) + α·(target − Q(s, a)) where target = r + γ·max_{a\u2032} Q(s\u2032, a\u2032) — zero at a terminal state. Q*(s, a) is the expected return when the first action a is forced and the optimum follows. The novelty: the data itself carries the transition information implicitly, so T is never needed. Collecting data requires an exploration policy; the classic is ε-greedy — pick the greedy action under the current Q\u0302 with probability 1 − ε and an arbitrary action with probability ε — or a softmax policy with temperature T.',
        },
        {
          ar: 'لماذا ينجح تعلم Q؟ خاصية التصحيح الذاتي: فعل مبالغ في تقديره يُجرَّب أكثر فيبدو ضعيف العائد فينخفض تقديره في المرة التالية، وفعل جيد يُجرَّب أكثر فيتعزز. ولهذا يمكن أن يتقارب إلى الأمثل حتى من سياسة استكشاف فوضوية بشرط زيارة كل الأزواج. قارن الكلفة: تكرار القيمة يحتاج عددًا صغيرًا من التكرارات لأنه يقرأ كامل MDP، بينما تعلم Q في مثال FrozenLake بالكتاب احتاج نحو 250 تكرارًا — هذا ثمن جمع البيانات بدل قراءة القواعد.',
          en: 'Why does Q-learning work? Its self-correcting property: an overestimated action gets tried more often, its poor downstream rewards lower its estimate on the next sweep, and a genuinely good action is reinforced by repetition. Convergence to the optimum is guaranteed even from an arbitrary exploration policy, provided every state-action pair gets visited. Compare the cost: value iteration converges in a handful of sweeps because it reads the whole MDP, while Q-learning on the book\u2019s FrozenLake needed roughly 250 iterations — the price of collecting data instead of reading the rules.',
        },
      ],
    },
    {
      kind: 'worked',
      title: {
        ar: 'تكرار القيمة على MDP من ثلاث حالات + تحديثات Q يدويًا',
        en: 'Value iteration on a 3-state MDP + Q-learning updates by hand',
      },
      code: "NS = [[1, 0], [2, 0], [None, None]]   # next state per (s, a); state 2 is terminal\nR  = [[0.0, 1.0], [5.0, 0.0], [0.0, 0.0]]\nGAMMA = 0.5\n\ndef value_iteration(iters):\n    V = [0.0, 0.0, 0.0]\n    hist = [list(V)]\n    for _ in range(iters):\n        nxt = []\n        for s in range(3):\n            if NS[s][0] is None:                 # terminal state keeps V = 0\n                nxt.append(0.0)\n                continue\n            vals = [R[s][a] + GAMMA * V[NS[s][a]] for a in (0, 1)]\n            nxt.append(max(vals))\n        V = nxt\n        hist.append(list(V))\n    return hist\n\nhist = value_iteration(4)\nfor k, V in enumerate(hist):\n    print('k=%d  V = %s' % (k, V))\nprint('fixed point after k=2:', hist[2] == hist[3] == hist[4])\nprint('state 0 action values: a0 -> %.3f, a1 -> %.3f'\n      % (R[0][0] + GAMMA * hist[4][1], R[0][1] + GAMMA * hist[4][0]))\n\n# policy evaluation: the uniform policy pi = [0.5, 0.5]\nV = [0.0, 0.0, 0.0]\nfor _ in range(200):\n    V = [0.5 * (R[0][0] + GAMMA * V[1]) + 0.5 * (R[0][1] + GAMMA * V[0]),\n         0.5 * (R[1][0] + GAMMA * V[2]) + 0.5 * (R[1][1] + GAMMA * V[0]),\n         0.0]\nprint('policy evaluation (uniform): V^pi = (%.6f, %.6f, 0)' % (V[0], V[1]))\nprint('closed form:                V^pi = (%.6f, %.6f, 0)' % (18 / 11, 32 / 11))\n\n# Q-learning by hand on 6 fixed experience tuples (s, a, r, s2, terminal)\nALPHA = 0.5\nQ = [[0.0, 0.0] for _ in range(3)]\nepisodes = [(1, 0, 5.0, 2, True), (0, 0, 0.0, 1, False), (0, 1, 1.0, 0, False),\n            (1, 1, 0.0, 0, False), (1, 0, 5.0, 2, True), (0, 0, 0.0, 1, False)]\nfor t, (s, a, r, s2, term) in enumerate(episodes, 1):\n    target = r + (0.0 if term else GAMMA * max(Q[s2]))\n    Q[s][a] = Q[s][a] + ALPHA * (target - Q[s][a])\n    print('t=%d target=%.6f  Q = %s' % (t, target, Q))\nprint('greedy policy from Q:', ['a%d' % (0 if Q[s][0] >= Q[s][1] else 1) for s in range(2)])",
      explanation: {
        ar: 'تكرار القيمة: بعد التكرار الأول V = [1.0, 5.0, 0.0] (الحالة 1 ترى مكافأة 5)، وبعد الثاني V = [2.5, 5.0, 0.0]، ثم تتجمد القائمة تمامًا: النقطة الثابتة V* بلغت بعد تكرارين من أي تهيئة صفرية. عند الحالة 0 قيم الأفعال 2.5 مقابل 2.25 — الانتقال نحو الحالة 1 (الصبر) يتفوق على المكافأة العاجلة. تقييم السياسة الموحدة يستقر عند (1.636364, 2.909091) = (18/11, 32/11): قيمة سياسة مترددة أقل من 2.5. في تعلم Q: الأهداف 5.0 ثم 1.25 ثم 1.3125 ثم 0.328125، والحالة النهائية تجعل الهدف 5.0 صرفًا؛ بعد إعادة التجربة الأولى يصبح Q(1,0) = 3.75 ثم Q(0,0) = 1.25، والسياسة الجشعة a0 في الحالتين 0 و1 — السياسة المثلى نفسها التي وجدها تكرار القيمة، لكن من بيانات فقط.',
        en: 'Value iteration: after the first sweep V = [1.0, 5.0, 0.0] (state 1 sees the reward 5), after the second V = [2.5, 5.0, 0.0], and then the table freezes: the fixed point V* is reached after two sweeps from a zero initialization. At state 0 the action values are 2.5 versus 2.25 — stepping toward state 1 (patience) beats the immediate payoff. Policy evaluation for the uniform policy settles at (1.636364, 2.909091) = (18/11, 32/11): a dithering policy is worth less than 2.5. In Q-learning the targets are 5.0, then 1.25, 1.3125, 0.328125 — a terminal next state makes the target exactly 5.0; replaying the first tuple lifts Q(1,0) to 3.75 and then Q(0,0) to 1.25, and the greedy policy is a0 at both states 0 and 1 — the same optimum value iteration found, but from data alone.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.value-iteration',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ value_iteration_gamma(gamma, iters) على نفس MDP الدرس (NS و R كما هما في الهيكل): ابدأ بـ V = [0.0, 0.0, 0.0]، وطبّق V_{k+1}(s) = max_a [ r(s,a) + γ·V(next(s,a)) ] مع إبقاء V للحالة النهائية صفرًا في كل تكرار. أعِد القائمة النهائية بعد iters تكرارًا.',
        en: 'Implement value_iteration_gamma(gamma, iters) on the lesson\u2019s MDP (NS and R as given in the starter): start from V = [0.0, 0.0, 0.0] and apply V_{k+1}(s) = max_a [ r(s,a) + γ·V(next(s,a)) ], keeping V at the terminal state equal to 0 on every sweep. Return the final list after iters sweeps.',
      },
      starterCode: "NS = [[1, 0], [2, 0], [None, None]]\nR  = [[0.0, 1.0], [5.0, 0.0], [0.0, 0.0]]\n\ndef value_iteration_gamma(gamma, iters):\n    V = [0.0, 0.0, 0.0]\n    # TODO: loop iters times, build the new V with max over actions (0, 1);\n    # state 2 (terminal) stays 0.0 every sweep.\n    return V\n",
      solution: "NS = [[1, 0], [2, 0], [None, None]]\nR  = [[0.0, 1.0], [5.0, 0.0], [0.0, 0.0]]\n\ndef value_iteration_gamma(gamma, iters):\n    V = [0.0, 0.0, 0.0]\n    for _ in range(iters):\n        V = [0.0 if NS[s][0] is None\n             else max(R[s][a] + gamma * V[NS[s][a]] for a in (0, 1))\n             for s in range(3)]\n    return V",
      tests: [
        {
          id: 't1',
          name: { ar: 'نقطة ثابتة عند γ = 0.5 بعد تكرارين', en: 'Fixed point at gamma = 0.5 after two sweeps' },
          code: "got = value_iteration_gamma(0.5, 2)\nwant = [2.5, 5.0, 0.0]\nassert all(abs(g - w) < 1e-9 for g, w in zip(got, want)), 'expected %r | got %r' % (want, got)",
          expected: '[2.5, 5.0, 0.0]',
        },
        {
          id: 't2',
          name: { ar: 'الاستقرار: تكرارات إضافية لا تغير شيئًا', en: 'Stability: extra sweeps change nothing' },
          code: "v2 = value_iteration_gamma(0.5, 2)\nv9 = value_iteration_gamma(0.5, 9)\nassert all(abs(a - b) < 1e-12 for a, b in zip(v2, v9)), 'iteration should have converged by k=2'",
          expected: 'V(9 sweeps) == V(2 sweeps)',
        },
        {
          id: 't3',
          name: { ar: 'الخصم يغيّر السياسة الفعلية: γ = 0.9', en: 'Discounting changes the optimum: gamma = 0.9' },
          code: "got = value_iteration_gamma(0.9, 300)\nwant = [10.0, 9.0, 0.0]\nassert all(abs(g - w) < 1e-9 for g, w in zip(got, want)), 'expected %r | got %r' % (want, got)\nassert value_iteration_gamma(0.0, 3)[0] == 1.0 and value_iteration_gamma(0.0, 3)[1] == 5.0, 'gamma = 0 keeps only immediate rewards'",
          expected: '[10.0, 9.0, 0.0] at gamma=0.9',
        },
      ],
      hints: [
        { ar: 'البنية واحدة كما في المثال المُشغَّل: أنشئ قائمة جديدة في كل تكرار ولا تُحدّث V في مكانها، وإلا ستختلط قيم k و k+1.', en: 'Same skeleton as the worked example: build a fresh list each sweep; updating V in place would mix k and k+1 values.' },
        { ar: 'قيمة الحالة s هي max بين فرعين: r(s,0) + γ·V(next) للفعل 0 و r(s,1) + γ·V(next) للفعل 1، مع next من NS[s].', en: 'The value of state s is the max of two branches: r(s,0) + γ·V(next) for action 0 and r(s,1) + γ·V(next) for action 1, with next read from NS[s].' },
        { ar: 'قيم تحقق: عند γ=0.5 النقطة الثابتة [2.5, 5.0, 0.0]؛ وعند γ=0.9 تكون [10.0, 9.0, 0.0] لأن الانتظار يصبح أثمن بخصم ضعيف.', en: 'Sanity values: at γ=0.5 the fixed point is [2.5, 5.0, 0.0]; at γ=0.9 it is [10.0, 9.0, 0.0], because waiting becomes more precious under a weak discount.' },
        { ar: 'لا تنسَ فرع الحالة النهائية: عندما NS[s][0] تساوي None يجب أن تبقى القيمة 0.0 مهما كان عدد التكرارات.', en: 'Do not forget the terminal branch: whenever NS[s][0] is None the value must stay 0.0 no matter how many sweeps run.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.mcq-exploration',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'في سياسة ε-greedy التي يجمع بها الوكيل بياناته لتعلم Q، ما دور المعامل ε؟',
        en: 'In the ε-greedy policy an agent uses to collect data for Q-learning, what is the role of the parameter ε?',
      },
      options: [
        { id: 'a', text: { ar: 'يضبط سرعة تقارب تحديثات Q تمامًا مثل معدل التعلم α', en: 'It sets the convergence speed of the Q updates, exactly like the learning rate α' } },
        { id: 'b', text: { ar: 'باحتمال 1 − ε يختار الفعل الجشع وفق Q الحالي، وباحتمال ε يجرّب فعلًا آخر لاستكشاف أزواج لم تُزر', en: 'With probability 1 − ε it takes the greedy action under the current Q, and with probability ε it tries something else to visit unexplored pairs' } },
        { id: 'c', text: { ar: 'يهيّئ جدول Q بقيم أولية أكبر ليُشجَّع الاستكشاف', en: 'It initializes the Q table with larger values to encourage exploration' } },
      ],
      answer: 'b',
      solution: 'b',
      hints: [
        { ar: 'اسم السياسة نفسه يذكّرك: greedy تعني الاختيار وفق أقصى Q باحتمال 1 − ε، وشيء آخر يحدث باحتمال ε.', en: 'The policy name is the reminder: greedy means argmax-Q with probability 1 − ε, and something else happens with probability ε.' },
        { ar: 'تذكّر لماذا نحتاج الاستكشاف أصلًا: التحديث يربط قيم كل الأزواج، فإذا لم تُزر بعض الأزواج بقي تقدير Q* سيئًا في كل الحالات.', en: 'Recall why exploration is needed at all: the update ties together the values of all pairs, so unvisited pairs poison the estimate of Q* everywhere.' },
        { ar: 'مقياس ε لا علاقة له بحجم خطوة التحديث — ذلك شأن α — ولا بالتهيئة.', en: 'ε has nothing to do with the update step size — that is α\u2019s job — nor with initialization.' },
        { ar: 'الجواب: b — التوازن بين استغلال أفضل ما نعرف واستكشاف الباقي.', en: 'Answer: b — balancing exploitation of the best known action with exploring the rest.' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "NS = [[1, 0], [2, 0], [None, None]]\nR  = [[0.0, 1.0], [5.0, 0.0], [0.0, 0.0]]\n\ndef vi(gamma, iters):\n    V = [0.0, 0.0, 0.0]\n    for _ in range(iters):\n        V = [0.0 if NS[s][0] is None\n             else max(R[s][a] + gamma * V[NS[s][a]] for a in (0, 1))\n             for s in range(3)]\n    return V\n\nfor g in (0.0, 0.25, 0.5, 0.75, 0.9):\n    print('gamma=%.2f -> V* = %s' % (g, vi(g, 40)))\n\n# جرّب: أعد تشغيل تكرار القيمة بعد تغيير مكافأة الفعل 1 للحالة 0 من 1.0 إلى 4.0 — متى ينقلب الاختيار عند الحالة 0؟\n# try: rerun value iteration after changing the reward of (state 0, action 1) from 1.0 to 4.0 — at what gamma does the choice at state 0 flip?\n# جرّب: طبّق تحديث Q يدويًا على المتتاليات الثابتة نفسها بمعدل alpha = 0.9 بدل 0.5 وقارن الجدول النهائي.\n# try: apply the Q updates by hand to the same fixed tuples with alpha = 0.9 instead of 0.5 and compare the final table.\n",
      prompt: {
        ar: 'الملعب يمسك بغرامة الخصم: γ يقرر كم يستحق المستقبل. لاحظ كيف ينتقل الأمثل من الجشعة العاجلة عند γ=0 إلى الصبر عند γ=0.9. ثم وجّه سؤالك إلى تعلم Q: هل يغير α الأفعال الجشعة النهائية أم سرعة الوصول إليها فقط؟',
        en: 'The sandbox weighs the discount: γ decides how much the future is worth. Watch the optimum move from myopic greed at γ=0 to patience at γ=0.9. Then interrogate Q-learning: does α change the final greedy actions, or only how fast they are reached?',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما المكونات الأربعة التي تُعرّف عملية ماركوف للقرار؟',
            en: 'Which four components define a Markov decision process?',
          },
          options: [
            { id: 'a', text: { ar: 'الحالات S، الأفعال A، دالة الانتقال T، ودالة المكافأة r', en: 'States S, actions A, transition function T, and reward function r' } },
            { id: 'b', text: { ar: 'بيانات التدريب، الشبكة، المُحسِّن، ومعدل التعلم', en: 'Training data, the network, the optimizer, and the learning rate' } },
            { id: 'c', text: { ar: 'السياسة π فقط — البقية تُشتق منها', en: 'Only the policy π — everything else derives from it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'MDP = (S, A, T, r): الحالات والأفعال تحدد فضاء القرار، وT(s, a, s′) = P(s′ | s, a) توزع احتمالات الانتقال، وr(s, a) مكافأة فورية يصممها المبرمج لتجسيد الهدف. السياسة π تُبنى لاحقًا فوق هذه الرباعية.',
            en: 'MDP = (S, A, T, r): states and actions frame the decision space, T(s, a, s\u2032) = P(s\u2032 | s, a) distributes transition probabilities, and r(s, a) is an immediate reward you design to encode the goal. The policy π is built on top of this quadruple afterwards.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ما الفرق الجوهري بين تكرار القيمة وتعلم Q؟',
            en: 'What is the essential difference between value iteration and Q-learning?',
          },
          options: [
            { id: 'a', text: { ar: 'تكرار القيمة يتطلب معرفة كاملة لدالة الانتقال P، بينما تعلم Q يتعلم من عينات (s, a, r, s′) زارها الوكيل', en: 'Value iteration needs the full transition function P, while Q-learning learns from (s, a, r, s\u2032) samples the agent visited' } },
            { id: 'b', text: { ar: 'تكرار القيمة للسياسات العشوائية فقط وتعلم Q للسياسات الحتمية فقط', en: 'Value iteration only handles stochastic policies and Q-learning only deterministic ones' } },
            { id: 'c', text: { ar: 'تعلم Q أسرع دائمًا لأنه لا يحتاج أي بيانات', en: 'Q-learning is always faster because it needs no data at all' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'تكرار القيمة يجمع على كل الحالات التالية بالوزن P(s′ | s, a) — فيلزم معرفة T و r كاملتين. تعلم Q يستبدل هذا المجموع بالعينات الفعلية، فتظهر معلومة الانتقال ضمنيًا في البيانات؛ ولهذا احتاج نحو 250 تكرارًا في FrozenLake مقابل قليلٍ لتكرار القيمة.',
            en: 'Value iteration averages over all next states weighted by P(s′ | s, a) — it must know T and r completely. Q-learning replaces that average with actually visited samples, so transition knowledge arrives implicitly inside the data; that is why it needed roughly 250 iterations on FrozenLake versus a handful for value iteration.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'قيمة γ صغيرة جدًا (قريبة من 0) تجعل الوكيل…',
            en: 'A discount factor γ very close to 0 makes the agent…',
          },
          options: [
            { id: 'a', text: { ar: 'يستكشف مسارات طويلة بحثًا عن مكافآت مستقبلية كبيرة', en: 'Explore long trajectories hunting large future rewards' } },
            { id: 'b', text: { ar: 'أنانيًا عاجلًا: يهتم بالمكافأة الفورية لأن كل ما هو بعيد مضروب في γᵗ يتلاشى', en: 'Myopically greedy: it cares about immediate rewards because everything distant is scaled by γᵗ and fades away' } },
            { id: 'c', text: { ar: 'محايدًا — γ يغير سرعة الحساب لا السلوك', en: 'Indifferent — γ changes computation speed, not behavior' } },
          ],
          answer: 'b',
          explanation: {
            ar: 'مع γ صغير يختفي وزن المكافآت البعيدة (γ¹⁰⁰⁰ عمليًا صفر)، فيختصر الوكيل طريقه نحو أقرب مكافأة. وفي مثالنا المُشغَّل كان γ=0 يحتفظ بالمكافآت الفورية فقط: [1.0, 5.0, 0.0]، بينما رفع γ=0.9 قيمة الصبر إلى [10.0, 9.0, 0.0].',
            en: 'With small γ the weight of distant rewards vanishes (γ¹⁰⁰⁰ is effectively zero), so the agent takes shortcuts toward the nearest payoff. In our runnable example γ=0 kept only immediate rewards, [1.0, 5.0, 0.0], while γ=0.9 raised the value of patience to [10.0, 9.0, 0.0].',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'MDP = (S, A, T, r) يصوغ القرار المتسلسل، وعامل الخصم γ < 1 يضبط العائد R(τ) = Σ γᵗ rₜ ويوازن بين العجلة والصبر (الهدف من s1 عملية ماركوف للقرار).', en: 'MDP = (S, A, T, r) frames sequential decision making, and the discount γ < 1 shapes the return R(τ) = Σ γᵗ rₜ, balancing impatience against patience (goal of s1 Markov Decision Process).' },
        { ar: 'مبدأ برمجة ديناميكية «بقايا المسار الأمثل أمثل» يقود تكرار القيمة V_{k+1}(s) = max_a [r + γΣP·V_k] الذي يتقارب إلى V* من أي تهيئة (الهدف من s2 تكرار القيمة).', en: 'Bellman\u2019s principle — the remainder of an optimal trajectory is optimal — drives value iteration V_{k+1}(s) = max_a [r + γΣP·V_k], which converges to V* from any initialization (goal of s2 Value Iteration).' },
        { ar: 'تعلم Q يحدّث Q(s,a) نحو r + γ·max Q(s′,·) من تجارب ثابتة دون معرفة الانتقالات، مع استكشاف ε-greedy وخصية تصحيح ذاتي تدفع تقديرات الفعلية الخاطئة نحو الانخفاض (الهدف من s3 تعلم Q).', en: 'Q-learning updates Q(s,a) toward r + γ·max Q(s′,·) from fixed experience tuples without knowing transitions, using ε-greedy exploration and a self-correcting property that pushes down overestimated actions (goal of s3 Q-Learning).' },
      ],
      reflectPrompt: {
        ar: 'اختر مهمة من حياتك اليومية (توصيل طلب، جدولة مراجعة، لعب شطرنج) وحدد بوضوح S و A و r وγ: أين تنكسر خاصية ماركوف إن اكتفيت بحالة فقيرة، وما الإضافة التي تعيدها إلى المسار الماركوفي؟',
        en: 'Pick a task from your daily life (order delivery, study scheduling, chess) and pin down S, A, r and γ: where does the Markov property break if your state is too poor, and what extra memory restores it?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'D2L', section: 'd2l.ch17.s1' },
        { book: 'D2L', section: 'd2l.ch17.s2' },
        { book: 'D2L', section: 'd2l.ch17.s3' },
      ],
    },
  ],
  sources: [
    { book: 'D2L', section: 'd2l.ch17.s1' },
    { book: 'D2L', section: 'd2l.ch17.s2' },
    { book: 'D2L', section: 'd2l.ch17.s3' },
  ],
} satisfies Lesson;

export default lesson;
