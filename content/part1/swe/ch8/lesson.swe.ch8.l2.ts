import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch8.l2 — "Branching and Merging / التفرّع والدمج"
 * Aligned with SWE ch8 s3 (8.3 Branching and Merging, pp.213–214).
 * All expression is original (own-words paraphrase of the CC BY-SA 4.0 source).
 * SIMULATED-GIT PATTERN: git commands appear ONLY in display-only concept/pitfall
 * prose as labeled on-your-own-machine terminal simulations. All runnable fields
 * are pure-Python mini-git models: branches as a dict name->commit-id, HEAD as a
 * variable holding the current branch name, fast-forward detection by walking
 * parents. Deterministic, no randomness, no input().
 */

const lesson = {
  id: 'swe.ch8.l2',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 8,
  title: { ar: 'التفرّع والدمج', en: 'Branching and Merging' },
  estimatedMinutes: 20,
  prerequisites: ['swe.ch8.l1'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'في الدرس الماضي صار التاريخ عندك مخططًا من لقطات مترابطة بالآباء تشاهده في نماذج بايثون. اليوم نضع اليد على أخف جزء في Git وأكثرها إساءة فهم: الفرع branch. الرهان أن الفرع ليس مجلدًا منسوخًا ولا صندوقًا يحوي التزامات — بل مؤشر صغير قابل للتحريك يلتصق بالتزام واحد، ويكلف إنشاؤه نحو 41 بايتًا؛ وبهذه الرخصة يتغير أسلوب عملك كله: فرع لكل ميزة وكل تجربة، وmain يبقى نظيفًا. وعند انتهاء التجربة يعيدها الدمج merge بأحد شكلين: انزلاق مؤشر سريع fast-forward أو التزام دمج ثلاثي الأطراف، والاختيار بينهما وبين rebase قرار يعرفه كل فريق. بنهاية الدرس ستكون قادرًا على: وصف الفرع كمؤشر ووصف HEAD، وتتبع أي الفروع يتقدم عند كل commit، وتحديد متى يكون الدمج fast-forward ومتى يكون ثلاثيًّا بالبحث عن السلف المشترك، وتطبيق القاعدة الذهبية لإعادة الأساس rebase.',
        en: 'Last lesson turned history into a graph of parent-linked snapshots you can watch in Python models. Today we hold the lightest, most misunderstood piece of Git: the branch. The bet: a branch is not a copied folder nor a box containing commits — it is a small movable pointer stuck onto one commit, costing about 41 bytes to create; and that cheapness changes how you work: a branch per feature and per experiment while main stays clean. When the experiment ends, merge brings it back in one of two shapes: a fast-forward pointer slide or a three-way merge commit — and the choice between merge and rebase is a decision every team makes. By the end of this lesson you will be able to: describe a branch as a pointer and describe HEAD, trace which branch advances on every commit, decide when a merge is a fast-forward versus three-way by finding the common ancestor, and apply the golden rule of rebasing.',
      },
    },
    {
      kind: 'predict',
      code: "branches = {'main': 'c1'}\nbranches['feature'] = branches['main']\nprint(branches['feature'])\nbranches['main'] = 'c2'\nprint(branches['feature'])\nprint(branches['main'])",
      question: {
        ar: 'أنشأنا فرع feature بنسخ قيمة المؤشر، ثم تقدّم main إلى c2. لماذا بقي feature واقفًا عند c1؟ وماذا كان يحدث لو كان الفرع مجلدًا منسوخًا بدل مؤشر؟',
        en: 'We created branch feature by copying the pointer value, then main advanced to c2. Why did feature stay on c1? And what would have happened if a branch were a copied folder instead of a pointer?',
      },
      reveal: {
        ar: 'بقي عند c1 لأن إنشاء الفرع نسخ قيمة واحدة — سطرًا من البيانات — لا نسخ مشروع: كل مؤشر يتحرك بنفسه فقط. وهذا جوهر الفرق عن الأدوات القديمة التي كانت تنسخ المشروع كله في مجلد جديد فأصاب الناس الرهبة من التفريع. في Git تقول branches[\'feature\'] = branches[\'main\'] وهذا هو إنشاء الفرع كله، ثم يتقدم كل مؤشر بوتيرة التزاماتك عليه هو.',
        en: 'It stayed on c1 because creating the branch copied one value — one line of data — not a project: each pointer moves only when you commit on it. That is the whole difference from older tools that copied the project into a new folder and made people dread branching. In Git, branches[\'feature\'] = branches[\'main\'] IS branch creation, and each pointer then advances at the pace of its own commits.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الفرع مؤشر خفيف متحرك', en: 'A branch is a lightweight movable pointer' },
      chunks: [
        {
          ar: 'في دفتر Git الفرع «مؤشر خفيف قابل للتحريك» يشير إلى التزام واحد — حرفيًّا ملف صغير يحمل بصمة من أربعين محرفًا، وإنشاؤه يكلف نحو 41 بايتًا. الفروع لا «تحتوي» التزامات ولا علاقة أب-ابن مدمجة بينها؛ إنها أوراق لاصقة تخلعها وتعيد لصقها على التزامات أحدث كلما تقدمت. وHEAD مؤشر آخر: يقف على الفرع الذي أنت عليه الآن. عند الالتزام يُصنع commit أبُه التزامك الحالي، ثم ينزلق الفرع الذي تقف عليه HEAD إلى الالتزام الجديد — وبقية الفروع لا تتحرك مسمارية واحدة. جلسة على جهازك — محاكاة نصية تعليمية فقط (بيئة المتصفح تشغّل بايثون لا git):\n$ git branch\n$ git switch -c add-search\n$ git commit -m "Add search to header"\n$ git switch main',
          en: 'In Git\u2019s notebook a branch is a lightweight movable pointer to one commit — literally a small file holding a 40-character hash, costing about 41 bytes to create. Branches do not contain commits and have no built-in parent-child relationship to each other; they are sticky notes you peel off and re-stick onto newer commits as you work. HEAD is one more pointer: it marks the branch you are currently on. When you commit, the commit is created with your current commit as its parent, and the branch HEAD points at slides forward to the new commit — every other branch stays exactly where it was. A session on your own machine — text simulation for teaching only (your browser sandbox runs Python, not git):\n$ git branch\n$ git switch -c add-search\n$ git commit -m "Add search to header"\n$ git switch main',
        },
        {
          ar: 'عند git switch ينتقل HEAD إلى الفرع المسمى وتُعاد كتابة شجرة العمل بلقطة ذلك الفرع؛ وعند الالتزام يتقدم الفرع الذي أنت عليه وحده. لاحظ أن git switch -c وgit restore جاءا في الإصدار 2.23 لتقسما عمل الأمر القديم المزدوج الوظائف git checkout: إنشاء الفروع والتنقل في جانب، وإرجاع الملفات في جانب. هذه الرخصة هي التي تفعّل أسلوب Git كله: افتح فرعًا لكل ميزة أو تجربة، وأبقِ main المشترك نظيفًا — فالتجربة الجسورة صارت رخيصة القلق.',
          en: 'On git switch, HEAD moves to the named branch and your working tree is rewritten to that branch\u2019s snapshot; on commit, only the branch you are on advances. Note that git switch -c and git restore arrived in Git 2.23 to split the duties of the old overloaded git checkout: creating/switching branches on one side, discarding file changes on the other. This cheapness enables Git\u2019s whole style of work: open a branch for every feature or experiment and keep the shared main clean — a bold experiment becomes cheap to worry about.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'الدمج: انزلاق أم التزام دمج', en: 'Merging: a slide, or a merge commit' },
      chunks: [
        {
          ar: 'عندما ينضج شغل الفرع تعيده إلى main بـ git merge، وللدمج شكلان. إن لم يتحرك main منذ تفريعت — أي أن طرف main سلف لطرف فرعك في مخطط الالتزامات — يكفي أن ينزلق مؤشر main إلى أحدث التزام عندك: هذه fast-forward ولا التزام جديد تحتاج. أما إن تقدم main في هذه الأثناء (زميل دمج شيئًا مثلًا) فيجري دمج ثلاثي الأطراف: يجد Git السلف المشترك common ancestor للفرعين، يجمع تغييرَي الطرفين، ويسجل النتيجة التزامَ دمج merge commit له أبوان — واحد على كل خط. والتزام الدمج ليس فوضى بل سجل صادق أن خطي تطور التقيا هنا، وهو ما يمكّن Git من جمع أعمال مبنيّة على أيٍّ من الطرفين لاحقًا.',
          en: 'When a branch\u2019s work matures you bring it back with git merge, and a merge takes one of two shapes. If main has not moved since you branched — that is, main\u2019s tip is an ancestor of your branch\u2019s tip in the commit graph — Git simply slides the main pointer to your latest commit: a fast-forward, no new commit needed. If main has moved in the meantime (a teammate merged something), Git performs a three-way merge: it finds the two branches\u2019 common ancestor, combines both sides\u2019 changes, and records the result as a merge commit with two parents — one on each line of development. The merge commit is not clutter; it is an honest record that two lines of development came together here, and it is what later lets Git combine work based on either side.',
        },
        {
          ar: 'ثمة طريق ثانٍ يجمع الفروع، والاختيار بينهما من أقل النقاشات الجدية في Git اليومي شيوعًا: git rebase يأخذ التزامات فرعك ويعيد تشغيلها واحدًا واحدًا فوق أحدث main وكأنك بدأت شغلك من هناك — فينتج تاريخًا مستقيمًا بلا التزام دمج يجده كثير من الفرق أسهل قراءة. الثمن أن rebase يصنع التزامات جديدة (التغييرات نفسها، بصمات جديدة): فهو يعيد كتابة التاريخ.',
          en: 'There is a second way to combine branches, and choosing between them is one of everyday Git\\u2019s few genuine debates: git rebase takes your branch\\u2019s commits and replays them one at a time on top of the latest main, as if you had started from there — producing a straight linear history with no merge commit, which many teams find easier to read. The cost: rebase creates new commits (same changes, new hashes) — it rewrites history.',
        },
          {
          ar: 'ومن هنا أقرب شيء لقاعدة حديدية في Git اليومي — القاعدة الذهبية: ما لم ينسق الفريق إعادة الكتابة كلها، لا تعِد أساس التزامات خرجت من مستودعك المحلي — أي التي دفعتها وقد يكون الآخرون بنوا عليها. أعِد أساس شغلك غير المدفوع لتجهيزه قبل المشاركة، واستخدم merge للتكامل العلني. وافتراضي عملي لفريق طلابي: rebase لفرعك القصير على أحدث main قبل فتح طلب الدمج، وليكن الدمج النهائي في main دمجًا.',
          en: 'Hence the nearest thing to an iron rule in everyday Git — the golden rule: unless the whole team coordinated the rewrite, never rebase commits that have left your local repository — ones you pushed and others may have built on. Rebase your own unpushed work to tidy it before sharing; use merge to integrate public work. A practical student-team default: rebase your short-lived feature branch onto the latest main before opening the pull request, and let the final integration into main be a merge.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'السلف المشترك: أين التقى الفرعان؟', en: 'The common ancestor: where did the branches meet?' },
      code: "commits = {\n    'c0': {'parent': None},\n    'c1': {'parent': 'c0'},\n    'c2': {'parent': 'c1'},\n    'c3': {'parent': 'c1'},\n}\nbranches = {'main': 'c2', 'feature': 'c3'}\n\ndef ancestors(tip):\n    seen = []\n    cur = tip\n    while cur is not None:\n        seen.append(cur)\n        cur = commits[cur]['parent']\n    return seen\n\nmain_line = ancestors(branches['main'])\nfeature_line = ancestors(branches['feature'])\nprint(main_line)\nfor cid in feature_line:\n    if cid in main_line:\n        print('base: %s' % cid)\n        break",
      explanation: {
        ar: 'رسمًا: c1 أبو الابنين c2 وc3 — فرعٌ حقيقي في المخطط. مشينا سطر main فطبعه [\'c2\', \'c1\', \'c0\']، ثم مشينا سطر feature ووقفنا عند أول التزام يظهر في سطر main: إنه c1 — السلف المشترك الذي يقوم عليه الدمج ثلاثي الأطراف. هذا الحساب بالضبط (مشابهة الأسلاف ثم وقف عند أول تقاطع) هو ما يفعله Git قبل أن يسأل: هل ينزلق المؤشر fast-forward أم أحتاج التزام دمج؟ في مثالنا main تحركت منذ التفريع، فالجواب: دمج ثلاثي بتزام أبويْن.',
        en: 'The picture: c1 is the parent of both c2 and c3 — a genuine fork in the graph. Walking main\u2019s line printed [\'c2\', \'c1\', \'c0\'], then walking feature\u2019s line stopped at the first commit that also appears in main\u2019s line: c1 — the common ancestor a three-way merge is built on. This exact computation (walk one side, stop at the first overlap) is what Git does before asking: slide the pointer as a fast-forward, or record a merge commit? In our example main moved since the branch, so the answer is a three-way merge with two parents.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.detect-fast-forward',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ is_fast_forward(main_tip, feature_tip): امشِ مؤشرات parent انطلاقًا من طرف الفرع القادم feature_tip، فإن مررت بطرف main قبل بلوغ None فالدمج انزلاق سريع وأعِد True، وإلا فالفرعان تباعدا فأعِد False. الشيفرة المطبوعة في الأسفل تجري حالتين: المتوقع ff 1: True ثم ff 2: False.',
        en: 'Implement is_fast_forward(main_tip, feature_tip): walk the parent pointers starting from the incoming branch tip feature_tip; if you pass main_tip before reaching None the merge is a fast-forward and you return True, otherwise the branches diverged and you return False. The prints at the bottom run two cases: expected ff 1: True then ff 2: False.',
      },
      starterCode: "commits = {\n    'c0': {'parent': None},\n    'c1': {'parent': 'c0'},\n    'c2': {'parent': 'c1'},\n    'c3': {'parent': 'c1'},\n    'c4': {'parent': 'c2'},\n}\n\ndef is_fast_forward(main_tip, feature_tip):\n    # امشِ من feature_tip حتى None، وإن مررت بـ main_tip فالجواب True\n    # walk from feature_tip until None; True if you pass main_tip on the way\n    pass\n\nprint('ff 1: %s' % is_fast_forward('c1', 'c2'))\nprint('ff 2: %s' % is_fast_forward('c4', 'c3'))",
      solution: "commits = {\n    'c0': {'parent': None},\n    'c1': {'parent': 'c0'},\n    'c2': {'parent': 'c1'},\n    'c3': {'parent': 'c1'},\n    'c4': {'parent': 'c2'},\n}\n\ndef is_fast_forward(main_tip, feature_tip):\n    cur = feature_tip\n    while cur is not None:\n        if cur == main_tip:\n            return True\n        cur = commits[cur]['parent']\n    return False\n\nprint('ff 1: %s' % is_fast_forward('c1', 'c2'))\nprint('ff 2: %s' % is_fast_forward('c4', 'c3'))",
      tests: [
        {
          id: 't1',
          name: { ar: 'main واقفة منذ التفريع → انزلاق سريع', en: 'main unmoved since branching → fast-forward' },
          code: "assert is_fast_forward('c1', 'c2') is True, 'expected: True | actual: %r' % (is_fast_forward('c1', 'c2'),)",
          expected: 'True',
        },
        {
          id: 't2',
          name: { ar: 'الفرعان تباعدا → دمج ثلاثي', en: 'Branches diverged → three-way merge' },
          code: "assert is_fast_forward('c4', 'c3') is False, 'expected: False | actual: %r' % (is_fast_forward('c4', 'c3'),)",
          expected: 'False',
        },
        {
          id: 't3',
          name: { ar: 'التفريع من الجذر نفسه يظل انزلاقًا', en: 'Branching from the root itself is still a fast-forward' },
          code: "assert is_fast_forward('c0', 'c1') is True, 'expected: True | actual: %r' % (is_fast_forward('c0', 'c1'),)",
          expected: 'True',
        },
        {
          id: 't4',
          name: { ar: 'السطران المنسقان مطبوعان', en: 'The two formatted lines printed' },
          code: "assert 'ff 1: True' in __learner_output__ and 'ff 2: False' in __learner_output__, 'expected: ff 1: True then ff 2: False | actual: %r' % __learner_output__",
          expected: 'ff 1: True then ff 2: False',
        },
      ],
      hints: [
        { ar: 'الانزلاق السريع معناه: طرف main سلفٌ لطرف feature — ابحث عن main_tip في أسلاف feature_tip.', en: 'Fast-forward means: main\u2019s tip is an ancestor of feature\u2019s tip — look for main_tip among feature_tip\u2019s ancestors.' },
        { ar: 'الحلقة التي تمشي التاريخ من الدرس السابق نفسها، لكن مع فحص إنهاء مبكر بـ return داخل الحلقة.', en: 'It is last lesson\u2019s history-walking loop, plus an early exit via return inside the loop.' },
        { ar: 'إن انتهت الحلقة بلا مرور بـ main_tip فالفرعان تباعدا: أعد False بعد الحلقة لا داخلها.', en: 'If the loop ends without passing main_tip the branches diverged: return False after the loop, not inside it.' },
        { ar: 'الحل:\ndef is_fast_forward(main_tip, feature_tip):\n    cur = feature_tip\n    while cur is not None:\n        if cur == main_tip:\n            return True\n        cur = commits[cur][\'parent\']\n    return False', en: "The solution:\ndef is_fast_forward(main_tip, feature_tip):\n    cur = feature_tip\n    while cur is not None:\n        if cur == main_tip:\n            return True\n        cur = commits[cur]['parent']\n    return False" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-head-switch',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. HEAD هنا متغير يحمل اسم الفرع الحالي.',
        en: 'Read the code and predict its exact output — one line per print — without running it. HEAD here is a variable holding the current branch name.',
      },
      code: "HEAD = 'main'\nbranches = {'main': 'c1', 'dev': 'c2'}\nprint(branches[HEAD])\nHEAD = 'dev'\nprint(branches[HEAD])",
      solution: 'c1\nc2',
      answer: 'c1\nc2',
      hints: [
        { ar: 'HEAD ليس التزامًا بل اسم الفرع — والطباعة تجلب من القاموس بالاسم الحالي.', en: 'HEAD is not a commit but a branch name — each print looks the dict up by the current name.' },
        { ar: 'أول طباعة: branches[\'main\']. ثم تغير HEAD إلى dev قبل الثانية.', en: 'First print: branches[\'main\']. Then HEAD changed to dev before the second.' },
        { ar: 'هذا معنى switch: مؤشر HEAD يعاد توجيهه، والقاموس نفسه لم يتغير.', en: 'That is what switch means: the HEAD pointer is re-aimed, the dict itself unchanged.' },
        { ar: 'الخرج:\nc1\nc2', en: 'The output:\nc1\nc2' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-ff-meaning',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'ماذا يعني أن الدمج بين main وفرعك كان fast-forward؟',
        en: 'What does it mean that the merge between main and your branch was a fast-forward?',
      },
      options: [
        { id: 'a', text: { ar: 'أن main لم تتحرك منذ تفريعت، فأكتفى Git بإنزلاق مؤشر main إلى أحدث التزام عندك دون التزام جديد', en: 'main had not moved since you branched, so Git simply slid the main pointer to your latest commit — no new commit needed' } },
        { id: 'b', text: { ar: 'أن Git نسخ الملفات بسرعة عالية دون فحص التعارض', en: 'Git copied the files very fast without checking for conflicts' } },
        { id: 'c', text: { ar: 'أنه سجل التزام دمج بأبويْن كما في الدمج ثلاثي الأطراف', en: 'It recorded a merge commit with two parents, as in a three-way merge' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الفرق كله في هل تحرك main منذ التفريع — أي هل طرفها سلف لطرف فرعك.', en: 'Everything hinges on whether main moved since the branch — i.e. whether its tip is an ancestor of your branch\u2019s tip.' },
        { ar: 'في نماذجنا هذا كان: main_tip يظهر في طريق المشي من feature_tip.', en: 'In our models that is exactly: main_tip appears on the walk from feature_tip.' },
        { ar: 'التزام الدمج بأبويْن علامة الشكل الآخر: الدمج ثلاثي الأطراف.', en: 'A two-parent merge commit is the mark of the other shape: the three-way merge.' },
        { ar: 'الجواب: أ — fast-forward انزلاق مؤشر بلا التزام جديد.', en: 'Answer: a — a fast-forward is a pointer slide with no new commit.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-merge-parents',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: التزام الدمج merge commit الذي ينتج عن دمج ثلاثي الأطراف — كم والدًا parent له؟',
        en: 'Without running: the merge commit produced by a three-way merge — how many parents does it have?',
      },
      answer: '2',
      solution: '2',
      tolerance: 0,
      hints: [
        { ar: 'أول التزام بلا أب، والعادي أب واحد — وأين يقع الدمج بينهما؟', en: 'The first commit has no parent and a normal commit has one — where does a merge fall in between?' },
        { ar: 'الدمج يجمع خطي تطور: خطُك وخط الزميل الذي دمجت في أثناء غيابك.', en: 'A merge combines two lines of development: yours and the teammate\u2019s line that advanced meanwhile.' },
        { ar: 'لكل خط من هذين مؤشر أب في التزام الدمج — عدّهما.', en: 'Each of those two lines gets one parent pointer in the merge commit — count them.' },
        { ar: 'الجواب: 2', en: 'Answer: 2' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — فرّع ثم اسأل: انزلاق أم ثلاثي؟\n# Your playground — branch, then ask: fast-forward or three-way?\n\ncommits = {\n    'c0': {'parent': None},\n    'c1': {'parent': 'c0'},\n    'c2': {'parent': 'c1'},\n    'c3': {'parent': 'c1'},\n    'c4': {'parent': 'c3'},\n}\nbranches = {'main': 'c2', 'feature': 'c4'}\n\ndef is_fast_forward(main_tip, feature_tip):\n    cur = feature_tip\n    while cur is not None:\n        if cur == main_tip:\n            return True\n        cur = commits[cur]['parent']\n    return False\n\nprint('ff: %s' % is_fast_forward(branches['main'], branches['feature']))\n\ndef ancestors(tip):\n    seen = []\n    cur = tip\n    while cur is not None:\n        seen.append(cur)\n        cur = commits[cur]['parent']\n    return seen\n\nmain_line = ancestors(branches['main'])\nbase = None\nfor cid in ancestors(branches['feature']):\n    if cid in main_line:\n        base = cid\n        break\nprint('base: %s' % base)\n\n# جرّب: حرّك main إلى c4 وكرر — ماذا يصير الجواب ولماذا؟\n# try: move main to c4 and repeat — what happens to the answer and why?\n# جرّب: ارسم على الورق المخطط الناتج عن التزام دمج بين الفرعين\n# try: sketch on paper the graph a merge commit between the branches would make",
      prompt: {
        ar: 'جرّب بنفسك: أجب عن ff وbase في هذا المخطط حيث التفرع حقيقي، ثم حرّك main إلى c4 وكرر السؤال ولاحظ تحول الجواب إلى انزلاق سريع، ثم ارسم على الورق شكل التزام الدمج وأبويْه. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: answer ff and base for this genuinely forked graph, then move main to c4 and repeat — watch the answer become a fast-forward — then sketch on paper the merge commit and its two parents. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل الرابع (الدوال): كتبنا is_fast_forward دالة تأخذ طرفين وتعيد True أو False. لماذا هذا الشكل أفضل من نسخ حلقة المشي في كل مكان نحتاجه؟',
            en: 'From chapter 4 (functions): we wrote is_fast_forward as a function taking two tips and returning True or False. Why is that better than copying the walking loop everywhere we need it?',
          },
          options: [
            { id: 'a', text: { ar: 'التخزين وإعادة الاستخدام: شيفرة مسماة تكتب مرة وتستدعى كثيرًا، والقيمة المعادة صالحة للاختبار والمقارنة', en: 'Store-and-reuse: named code written once and called many times, and a returned value can be tested and compared' } },
            { id: 'b', text: { ar: 'لأن الدوال تجعل الحلقات أسرع', en: 'Because functions make loops faster' } },
            { id: 'c', text: { ar: 'لأن بايثون تمنع الحلقات خارج الدوال', en: 'Because Python forbids loops outside functions' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'دالة تعيد قيمة تصلح للأدوات: استدعيناها في تمارين وطباعاها في الملعب — والقاعدة الذهبية نفسها تحتاج هذا السؤال في كل دمج، فكتابته مرة توحد الجواب. وهذا درس ch4 يُطبق على أدوات التحكم بالإصدارات.',
            en: 'A value-returning function is reusable machinery: we called it in exercises and reused it in the sandbox — and the fast-forward question arises at every merge, so writing it once unifies every answer. Chapter 4 applied to version-control tooling.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'عندما تلتزم commit وأنت واقف على feature — ماذا يحدث لبقية الفروع مثل main؟',
            en: 'When you commit while standing on feature — what happens to the other branches like main?',
          },
          options: [
            { id: 'a', text: { ar: 'لا شيء: مؤشر الفرع الذي تقف عليه HEAD وحده ينزلق إلى الالتزام الجديد', en: 'Nothing: only the branch HEAD points at slides to the new commit' } },
            { id: 'b', text: { ar: 'كل الفروع تتقدم خطوة معك', en: 'All branches advance one step with you' } },
            { id: 'c', text: { ar: 'main يُحذف لأنه صار قديمًا', en: 'main gets deleted for being stale' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الفرع ورقة لاصقة على التزام واحد، والالتزام الجديد يحمل أبًا هو التزامك الحالي ثم تنزلق الورقة التي تقف عليها — بقية الأوراق تبقى مكانها. ولهذا صار في مخططنا فرع حقيقي: خطان يبدآن من c1.',
            en: 'A branch is a sticky note on one commit; the new commit takes your current commit as parent and only your note slides — the others stay. That is how a real fork appeared in our graph: two lines starting at c1.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ماذا يفعل git switch main؟',
            en: 'What does git switch main do?',
          },
          options: [
            { id: 'a', text: { ar: 'ينقل HEAD إلى main ويعيد كتابة شجرة العمل بلقطة main — والفروع نفسها لا تتغير', en: 'Moves HEAD to main and rewrites the working tree to main\u2019s snapshot — the branches themselves do not change' } },
            { id: 'b', text: { ar: 'يدمج main في فرعك الحالي', en: 'Merges main into your current branch' } },
            { id: 'c', text: { ar: 'يحذف التزامات غير main', en: 'Deletes commits that are not on main' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'switch توجيه لمؤشر HEAD وتحديث لشجرة العمل، لا دمج ولا حذف — ولهذا قسما عمل checkout القديم بين switch للتنقل وrestore لإرجاع الملفات.',
            en: 'switch re-aims HEAD and updates the working tree — no merge, no deletion — which is why checkout\u2019s old double duty was split between switch for moving and restore for restoring files.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ما القاعدة الذهبية لإعادة الأساس rebase؟',
            en: 'What is the golden rule of rebasing?',
          },
          options: [
            { id: 'a', text: { ar: 'لا تعِد أساس التزامات دفعتها وقد بنى عليها الآخرون إلا بتنسيق الفريق — أعِد أساس شغلك المحلي غير المدفوع واستخدم merge للتكامل العلني', en: 'Never rebase commits you pushed and others may have built on unless the team coordinated — rebase your unpushed local work, use merge for public integration' } },
            { id: 'b', text: { ar: 'أن rebase دائمًا أفضل من merge في كل الحالات', en: 'That rebase is always better than merge in every case' } },
            { id: 'c', text: { ar: 'أن rebase يحذف التاريخ القديم بأمان فيمكن استخدامه بلا قيود', en: 'That rebase safely deletes old history so it can be used without restrictions' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'rebase يصنع التزامات جديدة بنفس التغييرات وبصمات جديدة — إذن فهو يعيد كتابة تاريخًا ربما بنى عليه زملاؤك فيصير لقاؤهم التالي مصادرة مؤلمة بين تاريخين متباعدين. لهذا: المحلي غير المدفوع يُعاد أساسه بحرية، والعلني يُدمج.',
            en: 'Rebase creates new commits — same changes, new hashes — so it rewrites history others may have built on, forcing them into a painful reconciliation of two divergent histories. Hence: rebase your unpushed local work freely, merge what is public.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'الفرع = نسخة كاملة من المشروع — إنشاؤه ثقيل ومخيف',
          right: 'الفرع = مؤشر خفيف نحو 41 بايت — إنشاؤه لحظي',
          note: {
            ar: 'هذا مفهوم الأدوات المركزية القديمة التي كانت تنسخ المشروع في مجلد جديد للتفريع. في Git الفرع ملف صغير يحمل بصمة التزام — وبهذه الرخصة يصير تفريع كل ميزة عادة لا قرارًا.',
            en: 'That is the old centralized-tool model of copying the project into a new folder to branch. In Git a branch is a small file holding a commit\u2019s hash — cheap enough that branching per feature becomes a habit, not a decision.',
          },
        },
        {
          wrong: "branches['feature'] ستتقدم تلقائيًا مع كل commit",
          right: 'يتقدم الفرع الذي تقف عليه HEAD فقط عند كل commit',
          note: {
            ar: 'لا حركة تلقائية: الالتزام ينزلق مؤشر الفرع الحالي وحده، والبقية أوراق لاصقة تنتظر تحريكها يدويًّا بالدمج أو بإعادة التوجيه. من هنا جاء التباعد بين main وfeature في نماذجنا.',
            en: 'No automatic motion: a commit slides only the current branch\u2019s pointer; the other sticky notes wait to be moved by a merge or a re-aim. That is exactly how the main/feature divergence appeared in our models.',
          },
        },
        {
          wrong: 'git rebase main على فرع دفعته صباحًا  # ترتيب جميل للتاريخ',
          right: 'git merge main  # للتكامل العلني، وrebase لشغلي المحلي غير المدفوع',
          note: {
            ar: 'إعادة أساس التزامات دُفعت تعيد كتابة التزامات قد بنى عليها فريقك — فصير التاريخان متباعدين ولقاؤهم التالي وجعًا. القاعدة: أعِد الأساس قبل الدفع، وادمج ما هو علني — والاستثناءات تُنسق ولا تُرتجل.',
            en: 'Rebasing pushed commits rewrites history your team may have built on, leaving two divergent histories and a painful next pull. The rule: rebase before you push, merge what is public — and exceptions are coordinated, never improvised.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'الفرع مؤشر خفيف متحرك (نحو 41 بايت) نحو التزام واحد، وHEAD مؤشر يقف على فرعك الحالي — والالتزام ينزلق الفرع الذي تقف عليه وحده.', en: 'A branch is a lightweight movable pointer (about 41 bytes) to one commit; HEAD marks your current branch — and a commit slides only the branch you stand on.' },
        { ar: 'الدمج شكلان: fast-forward انزلاق مؤشر حين يكون طرف main سلفًا لطرف فرعك، ودمج ثلاثي الأطراف يسأل عن السلف المشترك ويسجل التزامًا بأبويْن.', en: 'Two merge shapes: a fast-forward pointer slide when main\u2019s tip is an ancestor of your branch tip, and a three-way merge that asks for the common ancestor and records a two-parent commit.' },
        { ar: 'rebase يعيد تشغيل التزاماتك فوق main فتاريخ مستقيم، لكنه يعيد الكتابة بصمات جديدة — فالقاعدة الذهبية: أعِد أساس غير المدفوع فقط وادمج العلني.', en: 'Rebase replays your commits onto main for a linear history, but rewrites with new hashes — golden rule: rebase only unpushed work, merge what is public.' },
      ],
      reflectPrompt: {
        ar: 'في الملعب: حرّك main إلى c4 وأعد سؤال ff وbase، ثم ارسم على ورقة مخطط التزام دمج بين الفرعين وأبويْه، واكتب سطرًا يشرح لماذا صار الجواب انزلاقًا سريعًا بعد التحريك.',
        en: 'In the sandbox: move main to c4 and re-answer ff and base, then sketch on paper a merge commit between the branches with its two parents, and write one line explaining why the answer became a fast-forward after the move.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch8.s3', pages: 'ص213–214 / pp.213–214' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch8.s3', pages: 'ص213–214 / pp.213–214' },
  ],
} satisfies Lesson;

export default lesson;
