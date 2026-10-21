import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch8.l1 — "Why Version Control? / لماذا التحكم بالإصدارات؟"
 * Aligned with SWE ch8 s1 (8.1 Why Version Control, pp.207–210) +
 * s2 (8.2 The Everyday Workflow, pp.210–213).
 * All expression is original (own-words paraphrase of the CC BY-SA 4.0 source).
 * SIMULATED-GIT PATTERN: there is no git binary in the browser sandbox — git
 * commands appear ONLY inside display-only concept/pitfall prose as clearly
 * labeled "on your own machine" terminal simulations. Every runnable field is
 * a pure-Python mini-git model (commits as dicts with parent pointers, the
 * staging area as a dict of file states) — deterministic, no randomness.
 */

const lesson = {
  id: 'swe.ch8.l1',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 8,
  title: { ar: 'لماذا التحكم بالإصدارات؟', en: 'Why Version Control?' },
  estimatedMinutes: 25,
  prerequisites: ['py4e.ch16.l6'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'كل ما تعلمته حتى الآن من هذا المسار ينتج شيئًا واحدًا: شيفرة — وما إن توجد الشيفرة حتى تظهر مشكلة لا يحلها حسن التصميم وحده: أكثر من شخص سيغيّرها. ستغيّرها أنت أنتظارًا عبر أسابيع، وستنحرف بتجربة جسورة، وستحتاج العودة إلى شيء كان يعمل، وستريد أن تعرف من كتب سطرًا ولماذا. مجلد مشترك بأسماء مثل report_final_FINAL لا يحمي أحدًا — لكن نظام التحكم بالإصدارات Version Control يحل كل ذلك، وصار Git لغة الصناعة كلها تقريبًا. المشكلة أن أوامره تبدو تعاويذٍ بلا معنى إن لم تعرف ما يخزنه فعلًا؛ لذا نبدأ بالنموذل الذهني قبل الأوامر، ونبنيه كما نبني كل شيء هنا: بنموذج بايثون مصغّر نستطيع مشيته بأيدينا. بيئة المتصفح لا تشغّل git — أوامره ستظهر لك كجلسات طرفية محاكاة نصية على جهازك، وكل شيفرة قابلة للتشغيل في هذا الفصل بايثون خالصة. بنهاية الدرس ستكون قادرًا على: تسمية القدرات الأربع التي يمنحها التحكم بالإصدارات، وشرح فكرة اللقطات بدل الفروقات والبصمة الحشوية للمحتوى، ووصف المناطق الثلاث ودورة edit ثم add ثم commit، ومشي تاريخ التزامات مصغّر ومحاكاة منطقة تجهيز في بايثون.',
        en: 'Everything this track taught you so far produces one thing: code — and the moment code exists, a problem no amount of good design solves appears: more than one person will change it. You will change it yourself across weeks, take a wrong turn on a bold idea, need to get back to something that worked, and want to know who wrote a line and why. A shared folder full of names like report_final_FINAL protects no one — version control solves all of it, and Git has become the near-universal language of the industry. The catch: its commands look like incantations unless you know what Git actually stores; so we start from the mental model before the commands, and we build it the way we build everything here: a miniature Python model we can walk with our own hands. Your browser sandbox does not run git — git commands appear as clearly labeled text simulations of terminal sessions on your own machine, and every runnable snippet in this chapter is pure Python. By the end of this lesson you will be able to: name the four capabilities version control grants, explain snapshots-not-diffs and content hashing, describe the three areas and the edit → add → commit loop, and walk a miniature commit history while simulating a staging area in Python.',
      },
    },
    {
      kind: 'predict',
      code: "folder = {}\nfolder['report'] = 'Monday version'\nfolder['report'] = 'Tuesday version'\nprint(folder['report'])\n\nhistory = []\nhistory.append('Monday version')\nhistory.append('Tuesday version')\nprint(history[-1])\nprint(history[0])",
      question: {
        ar: 'سطران يعالجان الملف نفسه بطريقتين مختلفتين. أين ذهبت نسخة الاثنين في folder؟ ولماذا احتفظت history بها؟ وأي السطرين يشبه فكرة «التحكم بالإصدارات»؟',
        en: 'Two blocks handle the same file in two different ways. Where did the Monday copy go in folder? Why did history keep it? And which block resembles the idea of version control?',
      },
      reveal: {
        ar: 'اختفت نسخة الاثنين: القاموس يحمل قيمة واحدة لكل مفتاح، والكتابة الثانية كتبت فوق الأولى — هذا بالضبط ما يفعله الحفظ فوق ملف واحد في مجلد مشترك: الفائز الأخير يكسب ويضيع عصر زميله. أما القائمة فسجلت كل نسخة في موضعها، فصار الماضي كله قابلًا للاسترجاع بفهرس. هذه هي القدرة الأولى من قدرات التحكم بالإصدارات الأربع: تاريخ كامل تسافر فيه إلى الخلف — والدرس كله يبني القدرات الأربع.',
        en: 'The Monday copy vanished: a dict holds one value per key, and the second write stamped over the first — exactly what saving over one file in a shared folder does: the last save wins and a teammate\u2019s afternoon is gone. The list recorded every copy in its place, so the whole past stays retrievable by index. That is the first of version control\u2019s four capabilities: a complete history you can travel back through — and this whole lesson builds the four.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'الحياة بدونه: مجلد مشترك وفوضى', en: 'Life without it: one shared folder, pure chaos' },
      chunks: [
        {
          ar: 'عاش الجميع نسخة من هذا: report.docx ثم report_v2.docx ثم report_final.docx ثم report_FINAL_jing_use_this.docx. النسخ اليدوي إلى مجلدات مؤرخة هو الجواب اليدوي المعرض للخطأ على حاجة حقيقية: الاحتفاظ بالنسخ القديمة للعودة إليها — فسهل أن تنسى في أي مجلد أنت وتكتب فوق الملف الخطأ. وحين تصير الشيفرة والفريق أكبر، يزداد البلاء: شخصان يعدلان الملف نفسه ويرسلان النسخ بالبريد، والثاني في الحفظ يكسب ويضيع عصر الأول؛ خلل أحدثه تغيير قبل ثلاثة أسابيع ولا أحد يقدر يقول أي تغيير أو لماذا؛',
          en: 'Everyone has lived some version of this: report.docx, then report_v2.docx, then report_final.docx, then report_FINAL_jing_use_this.docx. Manually copying into timestamped folders is the error-prone manual answer to a real need — keeping old versions around in case you must go back — and it is easy to forget which folder you are in and write over the wrong file. Make it code and a team and the pain compounds: two people edit one file and email copies; the second to save wins and the first one\\u2019s afternoon is gone; a bug shipped three weeks ago and nobody can say which change or why; a bold refactor is buried out of fear because there is no safe way back.',
        },
          {
          ar: 'وفكرة إعادة بناء جسورة تُدفن خوفًا لأنه لا طريق آمن للرجوع. نظام التحكم بالإصدارات VCS هو نظام يسجل التغييرات على ملف أو مجموعة ملفات عبر الزمن بحيث تستدعي نسخًا محددة لاحقًا — وهو يمنحك أربعًا لا يمنحك المجلد: تاريخ history كامل تسافر فيه، وإسناد attribution ترى به من غيّر السطر ولماذا، وعزل isolation تجرب به دون تعريض الشغل الصالح للخطر، وتكامل integration يجمع شغل عدة أشخاص بقصد لا بالحظ.',
          en: 'A version control system (VCS) records changes to a file or set of files over time so you can recall specific versions later — and it gives you four things the shared folder cannot: a complete history you can travel back through, attribution to see who changed a line and why, isolation to experiment without endangering working code, and integration so several people change the same project on purpose rather than by luck.',
        },
        {
          ar: 'مرّت الأجيال على هذه الحاجة: أدوات محلية مثل RCS تتبع تاريخ مبرمج واحد على آلة واحدة، ثم أنظمة مركزية مثل CVS ثم Subversion وضعت كل الملفات المُسعّرة على خادم واحد يسحب منه الفريق — تعاون أخيرًا ممكن، لكن الخادم نقطة فشل واحدة: إن سقط لا أحد يتعاون أو يحفظ، وإن فقر قرصه بلا نسخة احتياطية ضاع التاريخ كله.',
          en: 'Generations of tools attacked this need: local systems like RCS tracked one developer\\u2019s files on one machine; centralized systems like CVS then Subversion put every versioned file on one server clients check out from — collaboration finally possible, but the server is a single point of failure: down server, nobody collaborates or saves; lost disk without backup, the whole history is gone.',
        },
          {
          ar: 'الجيل التالي الموزع أزال هذه النقطة: Git نظام تحكم إصدارات موزع، وgit clone لا تسحب آخر الملفات بل تعكس المستودع كله بتاريخه الكامل — فكل نسخة عند أي مطور نسخة احتياطية مستقلة تصلح إحياء خادم ميت، وتستطيع الالتزام والاطلاع على التاريخ فوق طائرة بلا شبكة. وُلد Git على عجل لعمل جاد: في 2005 خسر مشروع نواة لينكس استخدام BitKeeper بعد خلاف ترخيص، فكتب Linus Torvalds بديلًا في أيام، وأبرز أهدافه حماية قوية ضد التلف والسرعة — وسمّاه على نفسه بحماسه المعتاد.',
          en: 'The distributed generation removed that point: Git is a distributed version control system, and git clone does not grab the latest files — it fully mirrors the repository including its full history, so every developer\\u2019s copy is an independent backup able to resurrect a dead server, and you can commit and browse history on a plane with no network. Git was written in a hurry for a serious job: in 2005 the Linux kernel project lost free use of BitKeeper after a license dispute, and Linus Torvalds wrote a replacement within days — his stated goals included very strong safeguards against corruption and speed (and, by his own cheerful admission, he named it after himself).',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'لقطات لا فروقات، وبصمة المحتوى', en: 'Snapshots, not diffs — and a fingerprint of the content' },
      chunks: [
        {
          ar: 'قرارا تصميم من طفولة Git يفسران سلوكه كله. الأول: Git يخزن لقطات snapshots لا فروقات diffs. الأنظمة الأقدم تخزن لكل ملف قاعدة وركامة فروقات تُجمع لتركيب أي نسخة؛ أما Git فيفكر في بياناته كسلسلة لقطات: كل commit يسجل صورة لكل ملفاتك في تلك اللحظة، وكل ملف لم يتغير يُخزن كرابط إلى النسخة المطابقة المخزنة قبله. الثاني: كل شيء يُبصم.',
          en: 'Two decisions from Git\\u2019s childhood explain nearly all of its behavior. First: Git stores snapshots, not diffs. Older systems store, per file, a base version plus a stack of diffs you add up to rebuild any version; Git instead thinks of its data as a series of snapshots — every commit records a picture of all your files at that moment, and any unchanged file is stored as a link to the previous identical file. Second: everything is checksummed.',
        },
          {
          ar: 'Git يسمي كل قطعة محتوى بهاش SHA-1 للمحتوى نفسه — بصمة من أربعين محرفًا — ويخزنه تحت ذلك الاسم لا تحت اسم ملف؛ فلا يمكنك تغيير ملف أو commit دون أن يتغير هاشه، فالتلف لا يستطيع الاختباء، والمحتوى المطابق يُخزن مرة واحدة تلقائيًا. أشيع مفهوم خاطئ في Git أنه يخزن الفروقات — الحقيقة أنه يخزن لقطات كاملة مفهرسة بهاش محتواها، ومن هذه الصورة تفهم لماذا الفروع رخيصة وكيف يعمل الدمج.',
          en: 'Git names each piece of content by the SHA-1 hash of the content itself — a 40-character fingerprint — and stores it under that name rather than a filename; you cannot change a file or a commit without changing its hash, so corruption cannot hide, and identical content is stored only once automatically. The most common misconception is that Git stores diffs — it stores whole snapshots keyed by content hash, and this picture explains why branches are cheap and how merging works.',
        },
        {
          ar: 'تحت الغطاء Git مخزن مفتاح-قيمة: أعطه محتوى يبصمه ويعيدك البصمة، وعلى هذا المخزن تقوم ثلاثة أنواع كائنات: blob يحمل محتوى ملف واحد، وtree يربط الأسماء بالـ blobs والأشجار — لقطة لمجلد، وcommit يشير إلى الشجرة العليا ويحمل المؤلف والتوقيت والرسالة ويشير إلى commit الأب. أول التزام بلا أب، والعادي أب واحد، ودمج الـ merge أبوان فأكثر.',
          en: 'Underneath, Git is a key-value store: hand it content and it hands back the fingerprint, and on this store sit three kinds of objects: a blob holds one file\\u2019s contents; a tree maps names to blobs and other trees — a snapshot of a directory; a commit points to one top-level tree, carries an author, a timestamp and a message, and points back to its parent commit. The first commit has no parent, a normal commit has one, and a merge has two or more.',
        },
          {
          ar: 'امشِ مؤشرات الأب إلى الخلف فأنت تمشي تاريخ المشروع، ولأن الالتزام قد يملك أكثر من ابن وكون الدمج أبويْن، فالشكل ليس خطًا مستقيمًا بل مخطط دوري موجّه DAG من اللقطات — والتاريخ في Git ليس إلا هذا المخطط يُقرأ إلى الخلف. وهذا حرفيًّا ما سنبنيه بنماذجنا: قواميس commits كل سجل فيه يحمل parent — وسيمشيها كودك أنت.',
          en: 'Walk the parent pointers backward and you are walking the project\\u2019s history; because a commit can have several children and a merge has several parents, the shape is not a straight line but a directed acyclic graph (DAG) of snapshots — history in Git is just this graph read backward. That is literally what our models build: dictionaries of commits, each record carrying a parent — and your own code will walk them.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'المناطق الثلاث ودورة العمل اليومية', en: 'The three areas and the everyday loop' },
      chunks: [
        {
          ar: 'كل تغيير يمر بثلاثة أماكن، وفهمها هو ما يفصل المرتاح لـ Git عمن يحاربه: شجرة العمل working tree وهي مجلد ملفاتك العادي الذي تحرره، والمستودع repository أي مخزن .git/ حيث التاريخ الملتزم، وبينهما منطقة بلا مقابل في Dropbox ولا في زر Save: منطقة التجهيز staging area أو index، وهي تحمل بالضبط التغييرات التي ستدخل في التزامك القادم. لماذا خطوة وسيطة؟ لأن الالتزام يجب أن يكون تغييرًا واحدًا متماسكًا، وشجرة عملك عادة فوضى من عدة تغييرات — فالتجهيز يسمح لك بتأليف الالتزام القادم بوعي: هذه الملفات الثلاثة، وهذا الجزء من الرابع.',
          en: 'Every change flows through three places, and understanding them separates people comfortable with Git from people fighting it: the working tree, the ordinary directory of files you edit; the repository, the .git/ store holding committed history; and between them a piece with no equivalent in Dropbox or a Save button — the staging area, also called the index, holding exactly the changes that will go into your next commit. Why an intermediate step? Because a commit should be one coherent change and your working tree is usually a mess of several — staging lets you compose the next commit deliberately: these three files, this part of a fourth.',
        },
          {
          ar: 'الدورة اليومية: حرر في شجرة العمل، جهز ما تريد بـ git add، ثم التزم اللقطة المجهزة بـ git commit. وأكثر أمر ستشغله هو git status الذي يعرض غير المتتبع والمعدل غير المجهز والمجهز الجاهز. جلسة على جهازك — محاكاة نصية تعليمية فقط: بيئة متصفحك تشغّل بايثون ولا تشغّل git:\\n$ git status\\n$ git add login.py\\n$ git commit -m "Fix redirect loop on expired session"\\n$ git log --oneline',
          en: 'The everyday loop: edit files in the working tree, stage the pieces you want with git add, commit the staged snapshot with git commit. The command you will run more than any other is git status, showing what is untracked, modified-but-unstaged, and staged and ready. A session on your own machine — text simulation for teaching only: your browser sandbox runs Python, not git:\\n$ git status\\n$ git add login.py\\n$ git commit -m "Fix redirect loop on expired session"\\n$ git log --oneline',
        },
        {
          ar: 'ليس كل شيء في مجلدك يستحق أن يدخل التاريخ: مخارج الترجمة، ومجلدات الاعتماديات مثل node_modules، وملفات المحرر المؤقتة، والأهم — الأسرار مثل مفاتيح API وكلمات المرور يجب ألا تُلتزم أبدًا. ملف .gitignore في جذر المستودع يسرد الأنماط المهملة (*.log وbuild/ و.env). وحقيقتان يتعلمهما المتأخرون بألم: الأولى أنه يؤثر فقط على الملفات غير المتتبعة بعد — لإيقاف تتبع ملف ملتزم تحتاج git rm --cached ثم التزامًا؛',
          en: 'Not everything in your working directory belongs in history: compiled output, dependency folders like node_modules, editor scratch files, and above all secrets such as API keys and passwords must never be committed. A .gitignore file at the repository root lists ignore patterns (*.log, build/, .env). Two facts people learn late and painfully: it only affects files not already tracked — to stop tracking a committed file you need git rm --cached plus a commit; and, far more serious, Git history is forever — deleting a secret in a new commit does not remove it; it sits in every earlier commit and every clone.',
        },
          {
          ar: 'والثانية الأخطر: تاريخ Git أبدِيّ — حذف سرٍّ في التزام جديد لا يمحوه، فهو جالس في كل التزام سابق وكل clone؛ فإن التزمت اعتمادًا فقد رُشِش لحظة الدفع: أدِره فورًا ثم نقّ التاريخ. وللتراجع بأمان: git revert يضيف التزامًا جديدًا يقلب القديم فيبقى التاريخ سليمًا للجميع، وgit restore --staged يفرّغ التجهيز دون مساس بتعديلاتك، وgit reflog يسجل كل موقف وقفته HEAD — فالشغل الملتزم يكاد يستحيل ضياعه حقًّا.',
          en: 'If you commit a credential it is compromised the moment it is pushed: rotate it immediately, then scrub history. And to undo safely: git revert adds a new commit reversing an old one so history stays intact for everyone; git restore --staged unstages without touching your edits; and git reflog records every position HEAD has held — committed work is almost impossible to truly lose.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'نموذج مصغّر: امشِ التاريخ واسأل من كتب ولماذا', en: 'A miniature model: walk the history, ask who and why' },
      code: "commits = {\n    'c0': {'parent': None, 'msg': 'start project', 'author': 'ana'},\n    'c1': {'parent': 'c0', 'msg': 'add login page', 'author': 'omar'},\n    'c2': {'parent': 'c1', 'msg': 'fix redirect loop', 'author': 'ana'},\n}\n\ncur = 'c2'\nwhile cur is not None:\n    entry = commits[cur]\n    print('%s: %s (%s)' % (cur, entry['msg'], entry['author']))\n    cur = entry['parent']",
      explanation: {
        ar: 'بنينا تاريخًا مصغّرًا: قاموس يربط كل معرّف التزام بسجله، وكل سجل يحمل parent — أقرب ما يوافق مخزن Git من لقطات مترابطة بالآباء. بدأنا من طرف الفروع الحالي c2 ومشينا المؤشر parent حتى بلغ None عند أول التزام — وهذا بالضبط معنى «التاريخ يقرأ إلى الخلف». وكل سطر طبعه رسالة تغيير ومؤلفه: الرسالة تجيب ماذا ولماذا والمؤلف يجيب من — هاتان هما قدرتا التاريخ والإسناد تحويلًا إلى بيانات تستطيع الاستعلام عنها. لاحظ ألا عشوائية ولا إدخال: النموذج حتمي كليًّا، وكل الأوامر الحقيقية ستظل في جلسات المحاكاة النصية على جهازك.',
        en: 'We built a miniature history: a dictionary mapping each commit id to its record, each record carrying a parent — the closest stand-in for Git\u2019s store of parent-linked snapshots. Starting from the branch tip c2 we walked the parent pointer until None at the first commit — exactly what reading history backward means. Every printed line shows a change message and its author: the message answers what and why, the author answers who — capabilities one and two (history and attribution) turned into data you can query. Note there is no randomness and no input: the model is fully deterministic, and the real commands stay in the text-simulated sessions on your own machine.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.history-and-staging',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'أكمل النموذج المصغّر: نفّذ history_size(tip) تمشي مؤشرات parent من الطرف وتعدّ الالتزامات التي تصل إليها حتى None، ونفّذ stage(name) تضع الملف في staging بحالة staged. ثم شغّل الأسطر المطبوعة الموجودة: المتوقع طباعة commits: 3 ثم staged: 2.',
        en: 'Complete the miniature model: implement history_size(tip) walking the parent pointers from the tip and counting commits reached until None, and implement stage(name) putting the file into staging with state staged. Then keep the given prints: expected output is commits: 3 then staged: 2.',
      },
      starterCode: "commits = {\n    'c0': {'parent': None, 'msg': 'start project'},\n    'c1': {'parent': 'c0', 'msg': 'add login page'},\n    'c2': {'parent': 'c1', 'msg': 'fix redirect loop'},\n}\nstaging = {'login.py': 'modified', 'main.py': 'staged'}\n\ndef history_size(tip):\n    # امشِ parent من tip حتى None وعُدّ / walk parent from tip until None, counting\n    pass\n\ndef stage(name):\n    # ضع الملف في التجهيز / put the file into the staging area\n    pass\n\nstage('login.py')\n\nprint('commits: %d' % history_size('c2'))\nstaged_count = 0\nfor state in staging.values():\n    if state == 'staged':\n        staged_count += 1\nprint('staged: %d' % staged_count)",
      solution: "commits = {\n    'c0': {'parent': None, 'msg': 'start project'},\n    'c1': {'parent': 'c0', 'msg': 'add login page'},\n    'c2': {'parent': 'c1', 'msg': 'fix redirect loop'},\n}\nstaging = {'login.py': 'modified', 'main.py': 'staged'}\n\ndef history_size(tip):\n    count = 0\n    cur = tip\n    while cur is not None:\n        count += 1\n        cur = commits[cur]['parent']\n    return count\n\ndef stage(name):\n    staging[name] = 'staged'\n\nstage('login.py')\n\nprint('commits: %d' % history_size('c2'))\nstaged_count = 0\nfor state in staging.values():\n    if state == 'staged':\n        staged_count += 1\nprint('staged: %d' % staged_count)",
      tests: [
        {
          id: 't1',
          name: { ar: 'history_size تعدّ من الطرف حتى الجذر', en: 'history_size counts from tip to root' },
          code: "assert history_size('c2') == 3, 'expected: 3 | actual: %r' % (history_size('c2'),)",
          expected: '3',
        },
        {
          id: 't2',
          name: { ar: 'السير من أول التزام يعطي 1', en: 'Walking from the first commit gives 1' },
          code: "assert history_size('c0') == 1, 'expected: 1 | actual: %r' % (history_size('c0'),)",
          expected: '1',
        },
        {
          id: 't3',
          name: { ar: 'stage نقل login.py إلى التجهيز', en: 'stage moved login.py into staging' },
          code: "assert staging.get('login.py') == 'staged', 'expected: staged | actual: %r' % (staging.get('login.py'),)",
          expected: 'staged',
        },
        {
          id: 't4',
          name: { ar: 'السطران المنسقان مطبوعان', en: 'The two formatted lines printed' },
          code: "assert 'commits: 3' in __learner_output__ and 'staged: 2' in __learner_output__, 'expected: commits: 3 then staged: 2 | actual: %r' % __learner_output__",
          expected: 'commits: 3 then staged: 2',
        },
      ],
      hints: [
        { ar: 'العدّ حلقة من ch4/ch8: عدّاد يبدأ صفرًا ويزيد مرة لكل التزام تمر به.', en: 'The count is a ch4/ch8 loop: a counter starting at zero, raised once per commit you pass.' },
        { ar: 'لا تنسَ العدّ نفسه قبل القفز: count += 1 ثم cur = commits[cur][\'parent\'].', en: 'Count before you jump: count += 1 then cur = commits[cur][\'parent\'].' },
        { ar: 'stage عملية واحدة على قاموس التجهيز: staging[name] = \'staged\'.', en: 'stage is one operation on the staging dict: staging[name] = \'staged\'.' },
        { ar: 'الحل:\ndef history_size(tip):\n    count = 0\n    cur = tip\n    while cur is not None:\n        count += 1\n        cur = commits[cur][\'parent\']\n    return count\n\ndef stage(name):\n    staging[name] = \'staged\'', en: "The solution:\ndef history_size(tip):\n    count = 0\n    cur = tip\n    while cur is not None:\n        count += 1\n        cur = commits[cur]['parent']\n    return count\n\ndef stage(name):\n    staging[name] = 'staged'" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-walk-root',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. هذا سير على التاريخ حتى الجذر.',
        en: 'Read the code and predict its exact output — one line per print — without running it. This walks the history down to the root.',
      },
      code: "commits = {'c0': {'parent': None}, 'c1': {'parent': 'c0'}}\ncur = 'c1'\nprint(cur)\ncur = commits[cur]['parent']\nprint(cur)\ncur = commits[cur]['parent']\nprint(cur)",
      solution: 'c1\nc0\nNone',
      answer: 'c1\nc0\nNone',
      hints: [
        { ar: 'كل دورة تطبع القيمة الحالية ثم تقفز إلى والد الالتزام.', en: 'Each round prints the current value then jumps to the commit\u2019s parent.' },
        { ar: 'والد c1 هو c0 — والأول دائمًا أعمق خطوة.', en: 'The parent of c1 is c0 — one step deeper each time.' },
        { ar: 'والد c0 هو None: أول التزام لا أب له، والطباعة تطبع الكلمة None نفسها.', en: 'The parent of c0 is None: the first commit has no parent, and printing it shows the word None.' },
        { ar: 'الخرج:\nc1\nc0\nNone', en: 'The output:\nc1\nc0\nNone' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-three-areas',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'بين git add وgit commit يسكن التغيير في منطقة ثالثة بلا مقابل في زر Save — ما اسمها وما الذي تحمله؟',
        en: 'Between git add and git commit, the change sits in a third area with no Save-button equivalent — what is it and what does it hold?',
      },
      options: [
        { id: 'a', text: { ar: 'منطقة التجهيز staging area (أو index): تحمل بالضبط التغييرات التي ستدخل الالتزام القادم', en: 'The staging area (or index): it holds exactly the changes that will go into the next commit' } },
        { id: 'b', text: { ar: 'المستودع repository: التاريخ الملتزم كله داخل .git/', en: 'The repository: all committed history inside .git/' } },
        { id: 'c', text: { ar: 'شجرة العمل working tree: الملفات كما تحررها الآن', en: 'The working tree: the files as you are editing them right now' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الاسم الآخر لها index — فهي «فهرس» ما سيُلتزم.', en: 'Its other name is index — the ledger of what will be committed.' },
        { ar: 'git add يكتب فيها، وgit commit يسجلها في التاريخ — فأين تقع بينهما؟', en: 'git add writes into it, git commit records it into history — so where does it sit between the two?' },
        { ar: 'هي التي تتيح تأليف التزام متماسك من شجرة عمل فوضوية.', en: 'It is what lets you compose one coherent commit out of a messy working tree.' },
        { ar: 'الجواب: أ — منطقة التجهيز تحمل ما سيدخل الالتزام القادم.', en: 'Answer: a — the staging area holds what the next commit will record.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-commit',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أمر يسجّل اللقطة المجهزة كتزام جديد في التاريخ: git ______ -m "Fix redirect loop"',
        en: 'The command that records the staged snapshot as a new commit in history: git ______ -m "Fix redirect loop"',
      },
      answer: 'commit',
      solution: 'commit',
      hints: [
        { ar: 'سطر الدورة اليومية الثالث: حرر، ثم جهز بـ add، ثم ______.', en: 'The third step of the everyday loop: edit, stage with add, then ______.' },
        { ar: 'هو الفعل الذي يخلق التزامًا commit جديدًا من منطقة التجهيز.', en: 'It is the act that creates a new commit from the staging area.' },
        { ar: 'بلا -m يفتح محررًا ليكتب الرسالة — وبـ -m تأخذها من السطر.', en: 'Without -m it opens an editor for the message — with -m you hand it inline.' },
        { ar: 'الجواب: commit', en: 'Answer: commit' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — امشِ تاريخًا أطول ومحاكِ التجهيز\n# Your playground — walk a longer history and simulate staging\n\ncommits = {\n    'c0': {'parent': None, 'msg': 'start project', 'author': 'ana'},\n    'c1': {'parent': 'c0', 'msg': 'add login page', 'author': 'omar'},\n    'c2': {'parent': 'c1', 'msg': 'fix redirect loop', 'author': 'ana'},\n    'c3': {'parent': 'c2', 'msg': 'update README', 'author': 'sara'},\n}\n\ncur = 'c3'\nwhile cur is not None:\n    entry = commits[cur]\n    print('%s: %s (%s)' % (cur, entry['msg'], entry['author']))\n    cur = entry['parent']\n\nstaging = {}\nstaging['app.py'] = 'staged'\nstaging['notes.txt'] = 'modified'\nprint('staged: %d' % sum(1 for s in staging.values() if s == 'staged'))\n\n# جرّب: أضف التزام c4 ابنًا لـ c3 برسالتك وامشِ منه\n# try: add a c4 commit as a child of c3 with your own message, then walk from it\n# جرّب: اطبع رسائل التزامات المؤلف ana فقط بتمرين تصفية من ch9\n# try: print only the messages of author ana with a ch9-style filter",
      prompt: {
        ar: 'جرّب بنفسك: أضف التزامًا رابعًا ابنًا لـ c3 وامشِ منه، ثم صفّ التزامات مؤلف واحد واطبع رسائله، ثم حاكِ منطقة تجهيز بقاموس وأضف ملفًا ثالثًا بحالة staged. كم يبلغ طول التاريخ من طرفك الجديد؟ لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add a fourth commit as a child of c3 and walk from it, then filter one author\u2019s commits and print their messages, then simulate a staging dict and add a third file as staged. How long is the history from your new tip? No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل التاسع (القواميس): نموذجنا commits ربط كل معرّف التزام بسجلّه. لماذا كان القاموس هو البنية الصحيحة لهذا التاريخ؟',
            en: 'From chapter 9 (dictionaries): our commits dict mapped each commit id to its record. Why was a dict the right structure for this history?',
          },
          options: [
            { id: 'a', text: { ar: 'لأنه يجلب سجل أي التزام بمعرّفه في خطوة واحدة — كما جلب counts[word] العدّاد في الفصل التاسع', en: 'It fetches any commit\u2019s record by id in one step — exactly like counts[word] fetched a counter in chapter 9' } },
            { id: 'b', text: { ar: 'لأنه يرتب الالتزامات زمنيًّا تلقائيًّا', en: 'Because it sorts commits by time automatically' } },
            { id: 'c', text: { ar: 'لأنه لا يقبل أن تكون القيمة قاموسًا آخر', en: 'Because it refuses to hold another dict as its value' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'الوصول المباشر بالمفتاح هو قوة القاموس من الفصل التاسع: id التزام هو المفتاح والسجل القيمة — وسنمد هذا النمط لاحقًا بحقول parents متعددة لالتزامات الدمج.',
            en: 'Direct key access is the chapter-9 strength: the commit id is the key, the record is the value — and later lessons extend the same pattern with multiple parents for merge commits.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا يفعل git add بالضبط؟',
            en: 'What does git add actually do?',
          },
          options: [
            { id: 'a', text: { ar: 'ينسخ المحتوى الحالي للملف إلى منطقة التجهيز — التاريخ لم يمسّه بعد', en: 'Copies the file\u2019s current content into the staging area — history is not touched yet' } },
            { id: 'b', text: { ar: 'ينشئ الالتزام فورًا ويرفعه للخادم', en: 'Creates the commit immediately and uploads it to the server' } },
            { id: 'c', text: { ar: 'يحذف التغييرات غير المطلوبة من الملف', en: 'Discards the unwanted changes from the file' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'add يكتب في الـ index فقط؛ السجل يحدث عند commit. ومن هنا المفاجأة المشهورة: إن أضفت ملفًا ثم عدلته مجددًا فالالتزام القادم يسجل نسخة لحظة الإضافة لا الحالية — وgit status سيعرض الملف مجهزًا ومعدلًا معًا.',
            en: 'add writes only the index; history changes at commit. Hence the classic surprise: add a file, edit it again, and the next commit records the add-time version, not the current one — git status will list the file as both staged and modified.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'لماذا قلنا إن كل clone نسخة احتياطية كاملة للمشروع؟',
            en: 'Why did we say every clone is a complete backup of the project?',
          },
          options: [
            { id: 'a', text: { ar: 'لأن git clone تعكس المستودع بتاريخه الكامل — فأي نسخة عند أي مطور تصلح إحياء خادم ميت', en: 'git clone fully mirrors the repository with its whole history — any developer\u2019s copy can resurrect a dead server' } },
            { id: 'b', text: { ar: 'لأنها تسحب آخر الملفات فقط كما يفعل الخادم المركزي', en: 'Because it fetches only the latest files like a central server does' } },
            { id: 'c', text: { ar: 'لأن التاريخ يبقى على الخادم وحده وفيها مؤشر إليه', en: 'Because history stays on the server alone and the clone keeps a pointer to it' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا معنى «موزع»: لا نقطة فشل واحدة يحتاجها الجميع للعمل — الالتزام والاطلاع على التاريخ يعملان بلا شبكة، وإصلاح خادم ساقط يبدأ من أي نسخة محلية سليمة.',
            en: 'That is what distributed means: no single point of failure everyone needs — committing and browsing history work offline, and repairing a dead server starts from any healthy local copy.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'ما الذي يخزنه Git في كل commit؟',
            en: 'What does Git store in each commit?',
          },
          options: [
            { id: 'a', text: { ar: 'لقطة لكل الملفات لحظتها مع مؤشر الأب والمؤلف والتوقيت والرسالة — وكل محتوى مسمّى بهاشه', en: 'A snapshot of all files at that moment plus parent pointer, author, timestamp and message — content named by its hash' } },
            { id: 'b', text: { ar: 'ركامة فروقات تُجمع لتركيب أي نسخة', en: 'A stack of diffs added up to rebuild any version' } },
            { id: 'c', text: { ar: 'أسماء الملفات التي تغيرت فقط بلا محتواها', en: 'Only the names of changed files, without their contents' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'هذا أشيع مفهوم خاطئ في الفصل كله: Git يخزن لقطات لا فروقات، ويلمّ المحتوى بهاشه فلا يخفى التلف ولا تتكرر القطع المطابقة. وبهذه الصورة تفهم لاحقًا رخص الفروع وآلية الدمج.',
            en: 'This is the chapter\u2019s most common misconception: Git stores snapshots, not diffs, and names content by its hash so corruption cannot hide and identical pieces deduplicate. From this picture branch cheapness and merging both follow.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: 'report_FINAL_jing_use_this.docx  # تسمية يدوية للنسخ',
          right: 'git commit -m "Add report draft"  # التاريخ يتكفل بالنسخ',
          note: {
            ar: 'الأسماء اليدوية المتصاعدة جواب هش لحاجة حقيقية: من السهل النسيان في أي مجلد أنت والكتابة فوق الملف الخطأ. التاريخ الملتزم يحتفظ بكل نسخة في موضعها والعودة إليها أمر واحد — واترك التسمية للحاسوب.',
            en: 'Escalating hand-made names are a fragile answer to a real need: it is easy to forget which folder you are in and write over the wrong file. Committed history keeps every copy in place and returning to it is one command — let the machine do the naming.',
          },
        },
        {
          wrong: 'git commit -a -m "كل شيء دفعة واحدة"',
          right: 'git add <ملفات مختارة> ثم git commit -m "تغيير واحد متماسك"',
          note: {
            ar: 'الالتزام يسجل المجهز فقط، و-a تجهز الملفات المتتبعة المعدلة فقط — فيتسرب الالتزام الكبير الخلط من الأصل المهم، ويتجاهل بصمت الملفات الجديدة غير المتتبعة. اجعل قراءة git status عادة قبل كل التزام.',
            en: 'A commit records only what is staged, and -a stages only tracked modified files — so the big mixed commit skips the deliberate selection that makes history readable and silently omits brand-new untracked files. Make git status a habit before every commit.',
          },
        },
        {
          wrong: 'git add .env  # مفاتيح API تدخل التاريخ',
          right: '.gitignore أولًا: أدرج .env ثم التزم بـ .gitignore',
          note: {
            ar: 'تاريخ Git أبدِيّ: حذف السر في التزام جديد لا يمحوه من الالتزامات السابقة ولا من كل نسخ الفريق — فالاعتماد الرشيش يبدأ بتدوير المفتاح فورًا ثم تنظيف التاريخ. اكتب .gitignore قبل أول git add لها.',
            en: 'Git history is forever: deleting a secret in a new commit leaves it in every earlier commit and every teammate\u2019s clone — the honest fix starts by rotating the credential immediately, then scrubbing history. Write .gitignore before your first add.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'القدرات الأربع: تاريخ تسافر فيه، وإسناد لمن غيّر ولماذا، وعزل لتجريب بلا خطر، وتكامل يجمع شغل الفريق بقصد — وهي ما لا يمنحه المجلد المشترك بأسمائه report_final.', en: 'The four capabilities: a history you travel back through, attribution for who changed what and why, isolation to experiment safely, integration combining a team\u2019s work on purpose — what the shared folder and its report_final names cannot give.' },
        { ar: 'Git موزع: كل clone مرآة كاملة للتاريخ؛ ويخزن لقطات مفهرسة بهاش المحتوى لا ركامات فروقات — blobs وtrees وcommits مترابطة بالآباء تصنع مخططًا DAG يقرأ إلى الخلف.', en: 'Git is distributed: every clone mirrors the whole history; it stores snapshots keyed by content hash, not diff stacks — blobs, trees and commits linked by parents form a DAG read backward.' },
        { ar: 'المناطق الثلاث: شجرة العمل ثم منطقة التجهيز (index) ثم المستودع — دورة edit ثم add ثم commit، وgit status أكثر أمر تشغله، و.gitignore أولًا قبل أول التزام، والسر الملتزم يُدار فورًا لأن التاريخ أبدِيّ.', en: 'Three areas: working tree, then staging area (index), then repository — the edit, add, commit loop; git status is your most-run command; write .gitignore before the first commit, and rotate a leaked credential immediately because history is forever.' },
      ],
      reflectPrompt: {
        ar: 'في الملعب: أضف التزامًا رابعًا ابنًا لـ c3 برسالة تشرح لماذا لا ماذا، ثم امشِ التاريخ منه واطبع رسائل مؤلف واحد فقط. أي قدرات القدرات الأربع كنت تمارس في كل خطوة؟ اكتب الجواب قبل التشغيل.',
        en: 'In the sandbox: add a fourth commit as a child of c3 with a message explaining why, not what, then walk the history from it and print one author\u2019s messages only. Which of the four capabilities were you exercising at each step? Write your answer before running.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch8.s1', pages: 'ص207–210 / pp.207–210' },
        { book: 'SWE', section: 'swe.ch8.s2', pages: 'ص210–213 / pp.210–213' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch8.s1', pages: 'ص207–210 / pp.207–210' },
    { book: 'SWE', section: 'swe.ch8.s2', pages: 'ص210–213 / pp.210–213' },
  ],
} satisfies Lesson;

export default lesson;
