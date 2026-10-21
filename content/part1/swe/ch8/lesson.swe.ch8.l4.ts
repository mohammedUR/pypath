import type { Lesson } from '@/lib/content/schema';

/**
 * swe.ch8.l4 — "Team Habits and Documentation / عادات Git الجماعية والتوثيق"
 * Aligned with SWE ch8 s6 (8.6 Habits That Make Git Work for a Team, pp.219–220) +
 * s7 (8.7 Markdown, READMEs, and Project Documentation, pp.220–222).
 * All expression is original (own-words paraphrase of the CC BY-SA 4.0 source).
 * SIMULATED-GIT PATTERN: git commands appear ONLY in display-only concept/pitfall
 * prose as labeled on-your-own-machine terminal simulations. All runnable fields
 * are pure-Python: a commit-message linter over strings (len/split/startswith from
 * PY4E ch6) and a README-lines model. Deterministic, no randomness, no input().
 */

const lesson = {
  id: 'swe.ch8.l4',
  version: 1,
  part: 'I',
  track: 'P3',
  book: 'SWE',
  chapter: 8,
  title: { ar: 'عادات Git الجماعية والتوثيق', en: 'Team Habits and Documentation' },
  estimatedMinutes: 20,
  prerequisites: ['swe.ch8.l3'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'تعلمت الآلية كلها: لقطات وفروع ودمج وتعارضات وremotes. لكن ما يجعل Git يعمل لفريق فعلًا ليس الآلية بل قبضة عادات صغيرة تحفظ التاريخ مقروءًا والتغييرات قابلة للمراجعة والأخطاء قابلة للاسترجاع: التزام صغير متماسك، ورسالة بصيغة الأمر الجذري، ودفع متكرر، وmain محمي. ثم ننتقل إلى الكلام الذي يسكن المستودع بجانب الشيفرة: كل مستودع يحمل README، وكل pull request يحمل وصفًا، وكل مشكلة وملاحظة تصميم نثر — وكلها تكتب تقريبًا بصيغة واحدة خفيفة هي Markdown. بنهاية الدرس ستكون قادرًا على: صياغة رسالة التزام تتبع العُرف (فعل جذري في حدود الخمسين محرفًا ومتن يشرح لماذا)، وتنفيذ مدقق رسائل مصغّر في بايثون، وذكر أهم بنى Markdown وقاعدة السطر الفارغ، وسرد حقول README الجيدة وأقسام وصف الـ PR.',
        en: 'You now own the machinery: snapshots, branches, merges, conflicts, remotes. But what makes Git genuinely work for a team is not the machinery — it is a handful of small habits keeping history readable, changes reviewable and mistakes recoverable: small coherent commits, an imperative-mood message, frequent pushes, a protected main. Then we turn to the words living beside the code: every repository carries a README, every pull request a description, every issue and design note prose — nearly all of it written in one lightweight format, Markdown. By the end of this lesson you will be able to: craft a convention-following commit message (imperative subject around fifty characters, a body explaining why), implement a miniature message linter in Python, recall the core Markdown constructs and the blank-line rule, and list the fields of a good README and the sections of a PR description.',
      },
    },
    {
      kind: 'predict',
      code: "good = 'Fix redirect loop on expired session'\nbad = 'I was trying to fix the redirect loop that happened when the session expired and also updated some dependencies'\nprint(len(good) <= 50)\nprint(len(bad) <= 50)",
      question: {
        ar: 'رسالتان مرشحتان لالتزام واحد. أيهما يجتاز قاعدة الطول الشائعة لسطر الموضوع — وما الذي يجعل الصيغة الأولى تُقرأ كتعليمات والتانية كحكاية؟',
        en: 'Two candidate messages for one commit. Which passes the common subject-length rule — and what makes the first one read as an instruction and the second as a story?',
      },
      reveal: {
        ar: 'الأولى تجتاز (36 محرفًا) والثانية تسقط بعيدًا. العرف المستقر في الصناعة: سطر موضوع قصير بصيغة الأمر الجذري — Fix redirect loop لا Fixed أو Fixes — يُقرأ كأمر ينفذه الالتزام، بحوالي خمسين محرفًا، ومتن يشرح لماذا حين يستحق التغيير شرحًا. سنحوّل هذه العادات إلى دالة بايثون تفحصها واحدة واحدة.',
        en: 'The first passes (36 characters) and the second falls far short. The settled industry convention: a short imperative-mood subject — Fix redirect loop, not Fixed or Fixes — read as an instruction the commit carries out, kept around fifty characters, with a body explaining why when the change deserves it. We will turn these habits into a Python function that checks them one by one.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'عادات تُبقي التاريخ مقروءًا', en: 'Habits that keep history readable' },
      chunks: [
        {
          ar: 'العادة الأولى: التزم صغيرًا متماسكًا — كل commit يفعل شيئًا واحدًا: إصلاح، أو خطوة ميزة، أو إعادة بناء. الالتزام الذي يمزج ميزة وإعادة تنسيق وإصلاحًا لا علاقة له بهما يستحيل مراجعته أو التراجع عنه بمعزل. والعادة الثانية: اكتب الرسالة للقارئ القادم — سطر موضوع بصيغة الأمر الجذري في حدود الخمسين محرفًا، وسطر فارغ ثم متن يشرح لماذا لا ماذا (الفروق تعرض ماذا). كثير من الفرق يضبط هذا بعُرف Conventional Commits ببادئات مثل feat: وfix: وdocs: تجعل التاريخ قابلًا للمسح ويدعم الترقيم الآلي. جلسة على جهازك — محاكاة نصية تعليمية فقط (بيئة المتصفح تشغّل بايثون لا git):\n$ git log --oneline\ne4f2a91 Fix redirect loop on expired session\n7b03c5d Add search box to header',
          en: 'Habit one: commit small, coherent changes — each commit does one thing: one fix, one feature step, one refactor. A commit mixing a feature, a reformat and an unrelated fix is impossible to review or revert in isolation. Habit two: write the message for the next reader — a subject line in the imperative mood kept around fifty characters, a blank line, then a body explaining why rather than what (the diff already shows the what). Many teams formalize this with Conventional Commits prefixes such as feat:, fix: and docs: that make history scannable and can drive automated versioning. A session on your own machine — text simulation for teaching only (your browser sandbox runs Python, not git):\n$ git log --oneline\ne4f2a91 Fix redirect loop on expired session\n7b03c5d Add search box to header',
        },
        {
          ar: 'بقية العادات تتراكم: التزم وادفع كثيرًا — الالتزامات الصغيرة المتكررة أرخص مراجعةً وأأمن تكاملًا، والدفع المتكرر نسخة احتياطية ورؤية للزملاء. لا تلتزم أسرارًا ولا ملفات ثنائية ضخمة كما في الدرس الأول. احمِ main: لا دمج إلا بمراجعة مقبولة وخط اختبار ناجح. سمِّ الإصدارات المسلَّمة بوسوم tags موصوفة وترقيم دلالي حتى يكون لحالة تم شحنها اسم تعود إليه. واحتفظ بـ git reflog في ذهنك شبكة أمان: الشغل الملتزم يكاد لا يضيع أبدًا فلا يوجد سبب لليأس أو حذف المجلد وإعادة الاستنساخ.',
          en: 'The rest of the habits stack: commit and push often — small frequent commits are cheaper to review and safer to integrate, and frequent pushing backs work up and makes it visible. Never commit secrets or large binaries, as lesson one warned. Protect main: no merge without an approving review and a green pipeline. Tag shipped releases with annotated tags and semantic versions so a shipped state has a name you can return to. And keep git reflog in mind as the safety net: committed work is essentially never truly lost, so there is no reason for despair or for deleting the folder and re-cloning.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'Markdown: صيغة توثيق المشاريع', en: 'Markdown: the format of project documentation' },
      chunks: [
        {
          ar: 'Markdown صيغة كتابة نصية عادية — حفنة اصطلاحات تنسيق أداة تصيّرها إلى HTML — وكل جاذبيتها للبرمجيات أنها نص عادي: تسكن المستودع بجوار الشيفرة، وتظهر فرقًا سطرًا بسطر نظيفة، وتُراجع في pull request كأي تغيير. خصائص التوثيق-ك-شيفرة التي يمنحها Git لشيفرة_SOURCE تمنحها لكتابتك: إنها الصيغة الأصلية لملفات README والمشكلات وطلبات الدمج والويكي ومواقع التوثيق — وهذا الكتاب نفسه كتب بها. والنكهة التي ستكتبها فعليًّا هي GitHub Flavored Markdown GFM التي تصيّرها GitHub وGitLab.',
          en: 'Markdown is a plain-text writing format — a handful of formatting conventions a tool renders into HTML — and all its appeal for software is that it is plain text: it lives in the repository beside the code, shows up as clean line-by-line diffs, and is reviewed in a pull request like any other change. The docs-as-code property Git gives your source, it gives your writing: it is the native format of READMEs, issues, pull requests, wikis and documentation sites — including this very book. The flavor you will actually type is GitHub Flavored Markdown (GFM), what GitHub and GitLab render.',
        },
        {
          ar: 'تكتب تقريبًا كل شيء بعشرين بنية تقريبًا: # عنوان و## و### للتحت، وسطر فارغ يفصل الفقرات، و*مائل* و**عريض** و`شيفرة سطرية`، وقائمة نقطية ومرقمة، و[نص رابط](https://example.com)، و> اقتباس للملاحظات، وجدول بالشرطات، و- [x] مهمة منجزة، وكتلة شيفرة تفتح بثلاث لواطات خلفية واسم اللغة ```python وتغلق بثلاث لواطات. والقاعدة الوحيدة التي يتعثر فيها المبتدئون: السطر الفارغ — قائمة أو عنوان أو كتلة شيفرة لا يسبقها سطر فارغ كثيرًا ما لا تُصيَّر بصفتها. جرّبها في أي محرر يعرض المعاينة: احذف السطر الفارغ قبل قائمة وراقب ما يحدث.',
          en: 'You can write almost everything with about a dozen constructs: # headings with ## and ### below, a blank line separating paragraphs, *italic*, **bold** and `inline code`, bulleted and numbered lists, [link text](https://example.com), > blockquotes for notes, dash tables, - [x] finished tasks, and a code fence opened with three backticks plus a language name (```python) and closed with three backticks. The one rule beginners trip on: the blank line — a list, heading or code block not preceded by one often will not render as such. Try it in any preview editor: delete the blank line before a list and watch what happens.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'README ووصف الـ PR والدليل', en: 'The README, the PR description, and the evidence' },
      chunks: [
        {
          ar: 'ملف README.md أول ما يراه زائر المستودع ويُصيَّر آليًّا على صفحته الرئيسة — فيه يقرر الغريب (زميل، أو مصحح، أو صاحب عمل قادم) في دقيقة إن كان يفهم مشروعك. README جيد لفريق طلابي يجيب: اسم المشروع وسطر واحد عما يفعل ولماذا؛ وأعضاء الفريق ومن يملك ماذا؛ وتعليمات التركيب والتشغيل المحلي وتشغيل الاختبارات؛ ورابط النسخة المنشورة؛ والمحدوديات المعروفة بصدق؛ ورابط سجل استخدام الذكاء الاصطناعي. ووصف طلب الدمج حيث تشرح تغييرك للمراجع: وصف «updated stuff» لا يخبره شيئًا؛ القالب الموثوق ثلاثة أقسام: What changed ثم Why ثم How to test مع خطوات ملموسة — فيصير تحديث المخزون مراجعةً أسرع ثم شرحًا للتاريخ بعد أشهر.',
          en: 'A repository\u2019s README.md is the first thing a visitor sees, rendered automatically on the landing page — where a stranger (a teammate, a grader, a future employer) decides in a minute whether they understand your project. A good student-team README answers: the project name and a one-line description of what it does and why; team members and who owns what; setup instructions; how to run it locally and run the tests; the deployment link; known limitations honestly stated; and a link to the AI-use log. The pull request description is where you explain a change to its reviewer: a blank updated stuff tells them nothing; the reliable template has three sections — What changed, then Why, then How to test with concrete steps — making the review faster and, months later, explaining the change to anyone reading history.',
        },
        {
          ar: 'ولماذا يأتي هذا كله في فصل التحكم بالإصدارات؟ لأن دليل ما فعلته في مشروعك يقوم كله على مخلفات Git وMarkdown: رسائل التزامك، وأوصاف طلبات الدمج وتعليقات مراجعتك، وREADME، والمشكلات التي فتحتها وأغلقتها. التزامات واضحة وطلبات مكتوبة جيدًا تصنع سجلًا موثقًا بالوقت لمن غيّر المستودع وماذا غيّر ولماذا — وهذا السجل هو ما يجعلك أنت ومصححك تران مساهمة كل فرد. اكتبها وكأنها دليل، لأنها دليل فعلًا.',
          en: 'And why does this live inside the version-control chapter? Because the evidence of what you did on a project is almost entirely Git-and-Markdown artifacts: your commit messages, your PR descriptions and review comments, your README, and the issues you opened and closed. Clear commits and well-written pull requests create a durable, timestamped record of who changed the repository, what changed, and why — and that record is what lets you, and your grader, see each member\u2019s contribution. Write it as though it is evidence, because it is.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'مدقق رسائل التزام مصغّر', en: 'A miniature commit-message linter' },
      code: "def lint_subject(subject):\n    words = subject.split()\n    if len(subject) > 50:\n        return 'too long'\n    if words[0].lower() not in ['add', 'fix', 'refactor', 'update', 'remove', 'feat']:\n        return 'not imperative'\n    return 'ok'\n\nprint(lint_subject('Fix redirect loop on expired session'))\nprint(lint_subject('updated a bunch of files across the whole project this week'))\nprint(lint_subject('fixed the bug'))",
      explanation: {
        ar: 'قاعدة القاعدة: الطول أولًا (فوق الخمسين → too long)، ثم الجذري: الكلمة الأولى بعد التصغير يجب أن تكون فعل أمر من قائمتنا — updated أسقطها إلى not imperative حتى لو كان الطول مناسبًا، وfixed كذلك: الماضي يقرأ كحكاية لا كأمر ينفذه الالتزام. لاحظ الفصل بين الفحوص بـ return مبكر — نمط من دروس الدوال يمكّنك من إضافة فحص ثالث (بادئة عُرفية مثل feat:) دون تكسير الأولين. هذا المدقق نموذج تعليمي: أدوات الحقيقة تستخدم التعبيرات النمطية وقوائم أدق، لكن المنطق نفسه.',
        en: 'Rule over rule: length first (over fifty → too long), then the imperative: the first word, lowercased, must be one of our command verbs — updated falls to not imperative even with a fine length, and so does fixed: the past tense reads as a story, not an instruction the commit carries out. Note the early returns separating the checks — a functions-lesson pattern that lets you add a third check (a conventional prefix like feat:) without breaking the first two. This linter is a teaching model: real tooling uses regular expressions and finer lists, but the logic is the same.',
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.commit-linter',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'نفّذ lint_subject(subject) بنفس قواعد worked: الطول فوق 50 يعيد too long، وإلا فإذا لم تكن الكلمة الأولى بعد التصغير من أفعال القائمة يعيد not imperative، وإلا ok. الأسطر المطبوعة تجري ثلاث رسائل: المتوقع ok ثم not imperative ثم too long.',
        en: 'Implement lint_subject(subject) with the worked rules: length over 50 returns too long; otherwise, if the first word lowercased is not one of the verb list, return not imperative; else ok. The prints run three messages: expected ok, then not imperative, then too long.',
      },
      starterCode: "def lint_subject(subject):\n    # 1) الطول فوق 50 → 'too long'\n    # 2) الكلمة الأولى بعد التصغير ليست فعل أمر → 'not imperative'\n    # 3) وإلا 'ok'\n    pass\n\nprint(lint_subject('Add search box to header'))\nprint(lint_subject('fixed the bug'))\nprint(lint_subject('I was trying to add the search box to the header of the page'))",
      solution: "def lint_subject(subject):\n    words = subject.split()\n    if len(subject) > 50:\n        return 'too long'\n    if words[0].lower() not in ['add', 'fix', 'refactor', 'update', 'remove', 'feat']:\n        return 'not imperative'\n    return 'ok'\n\nprint(lint_subject('Add search box to header'))\nprint(lint_subject('fixed the bug'))\nprint(lint_subject('I was trying to add the search box to the header of the page'))",
      tests: [
        {
          id: 't1',
          name: { ar: 'رسالة عرفية سليمة تعطي ok', en: 'A proper convention-abiding message gives ok' },
          code: "assert lint_subject('Add search box to header') == 'ok', 'expected: ok | actual: %r' % (lint_subject('Add search box to header'),)",
          expected: 'ok',
        },
        {
          id: 't2',
          name: { ar: 'الماضي ليس أمرًا جذريًّا', en: 'The past tense is not imperative' },
          code: "assert lint_subject('fixed the bug') == 'not imperative', 'expected: not imperative | actual: %r' % (lint_subject('fixed the bug'),)",
          expected: 'not imperative',
        },
        {
          id: 't3',
          name: { ar: 'الحكاية الطويلة تسقط في الطول', en: 'The long story fails on length' },
          code: "assert lint_subject('I was trying to add the search box to the header of the page') == 'too long', 'expected: too long | actual: %r' % (lint_subject('I was trying to add the search box to the header of the page'),)",
          expected: 'too long',
        },
        {
          id: 't4',
          name: { ar: 'رسالة الكتاب نفسها تجتاز', en: 'The book\u2019s own example message passes' },
          code: "assert lint_subject('Fix redirect loop on expired session') == 'ok', 'expected: ok | actual: %r' % (lint_subject('Fix redirect loop on expired session'),)",
          expected: 'ok',
        },
        {
          id: 't5',
          name: { ar: 'الأحكام الثلاثة مطبوعة بالترتيب', en: 'The three verdicts printed in order' },
          code: "assert 'ok' in __learner_output__ and 'not imperative' in __learner_output__ and 'too long' in __learner_output__, 'expected: ok / not imperative / too long | actual: %r' % __learner_output__",
          expected: 'ok / not imperative / too long',
        },
      ],
      hints: [
        { ar: 'words = subject.split() يعطيك الكلمات، وlen(subject) يعطيك الطول — أدوات ch6.', en: 'words = subject.split() gives the words and len(subject) gives the length — ch6 tools.' },
        { ar: 'افحص الطول أولًا وأعِد مبكرًا، ثم افحص words[0].lower() على قائمة الأفعال.', en: 'Check length first with an early return, then test words[0].lower() against the verb list.' },
        { ar: 'قائمة الأفعال: add وfix وrefactor وupdate وremove وfeat — عامل not in يختصر الفحص.', en: 'The verb list: add, fix, refactor, update, remove, feat — the not in operator shortens the check.' },
        { ar: 'الحل:\ndef lint_subject(subject):\n    words = subject.split()\n    if len(subject) > 50:\n        return \'too long\'\n    if words[0].lower() not in [\'add\', \'fix\', \'refactor\', \'update\', \'remove\', \'feat\']:\n        return \'not imperative\'\n    return \'ok\'', en: "The solution:\ndef lint_subject(subject):\n    words = subject.split()\n    if len(subject) > 50:\n        return 'too long'\n    if words[0].lower() not in ['add', 'fix', 'refactor', 'update', 'remove', 'feat']:\n        return 'not imperative'\n    return 'ok'" },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-readme-headings',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقع خرجه بالضبط — سطرًا لكل طباعة — دون تشغيله. النموذج: README كسطور نصية، والعناوين تبدأ بـ #.',
        en: 'Read the code and predict its exact output — one line per print — without running it. The model: a README as text lines, headings starting with #.',
      },
      code: "readme = ['# Mini-Git', '', '## Setup', 'pip install -r requirements.txt', '', '## Run', 'python app.py']\nheadings = 0\nfor line in readme:\n    if line.startswith('#'):\n        headings += 1\nprint(headings)\nprint(readme[6])",
      solution: '3\npython app.py',
      answer: '3\npython app.py',
      hints: [
        { ar: 'ابدأ العدّ من صفر وزد مرة لكل سطر يبدأ بـ #.', en: 'Start the count at zero and add one per line starting with #.' },
        { ar: 'العناوين هنا: السطر 0 والسطر 2 والسطر 5 — عدّها.', en: 'The headings here are lines 0, 2 and 5 — count them.' },
        { ar: 'readme[6] يعيد السطر ذا الفهرس 6 — عدّ من الصفر مع الأسطر الفارغة.', en: 'readme[6] returns the line at index 6 — count from zero including the empty lines.' },
        { ar: 'الخرج:\n3\npython app.py', en: 'The output:\n3\npython app.py' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-commit-body',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'حين يستحق التغيير شرحًا أطول من سطر الموضوع — ماذا يجب أن يشرحه متن الرسالة body؟',
        en: 'When a change deserves more than a subject line — what should the message body explain?',
      },
      options: [
        { id: 'a', text: { ar: 'لماذا غُيّر — السياق والمقايضات: لأن الفرق diff يعرض ماذا تغيّر فعلًا', en: 'Why it changed — the context and trade-offs: the diff already shows what changed' } },
        { id: 'b', text: { ar: 'ماذا تغيّر سطرًا سطرًا بإعادة سرد الفروق', en: 'What changed, line by line, retelling the diff' } },
        { id: 'c', text: { ar: 'أسماء كل الملفات التي لمستها بترتيبها الألفبائي', en: 'The names of every file touched, alphabetically' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'اسأل: ما الذي لا يستطيع القارئ معرفته من النظر إلى diff وحده؟', en: 'Ask: what can a reader not learn from the diff alone?' },
        { ar: 'إعادة سرد الفروق تضاعف الحجم بلا معلومة — والمتن فرصتك للسياق ولماذا خُيّر هذا الحل.', en: 'Retelling the diff doubles the size with no new information — the body is your chance for context and why this solution was chosen.' },
        { ar: 'وهكذا تُقرأ الرسالة بعد سنة: ماذا في diff، ولماذا في متنك.', en: 'That is how the message reads a year later: what in the diff, why in your body.' },
        { ar: 'الجواب: أ — المتن يشرح لماذا لا ماذا.', en: 'Answer: a — the body explains why, not what.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.numeric-subject-limit',
      exKind: 'numeric',
      required: true,
      prompt: {
        ar: 'بلا تشغيل: كم محرفًا تقريبًا هو الحد الذي يوصي به العُرف لطول سطر الموضوع في رسالة الالتزام؟',
        en: 'Without running: roughly how many characters is the recommended limit for a commit message subject line?',
      },
      answer: '50',
      solution: '50',
      tolerance: 0,
      hints: [
        { ar: 'الرقم ظهر في predict: السطر الجيد كان أقصر منه والطويل كان أطول منه.', en: 'The number appeared in the predict: the good line was shorter than it and the long one longer.' },
        { ar: 'ليس حدًّا صارمًا في الأداة بل عُرف قراءة: عنوان يُمسح بنظرة في قائمة log.', en: 'It is a reading convention, not a hard tool limit: a subject scannable at a glance in a log listing.' },
        { ar: 'خمسون محرفًا تقريبًا لسطر الموضوع — والمتن يفصل عنه بسطر فارغ.', en: 'About fifty characters for the subject — the body is separated by a blank line.' },
        { ar: 'الجواب: 50', en: 'Answer: 50' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — README مصغّر ومدقق رسائل\n# Your playground — a miniature README and the message linter\n\nreadme = [\n    '# Mini-Git',\n    '',\n    'A tiny model of how Git thinks.',\n    '',\n    '## Setup',\n    'python3 -m venv .venv',\n    '',\n    '## Run',\n    'python app.py',\n]\nfor line in readme:\n    if line.startswith('#'):\n        print('HEADING: %s' % line)\nprint('lines: %d' % len(readme))\n\ndef lint_subject(subject):\n    words = subject.split()\n    if len(subject) > 50:\n        return 'too long'\n    if words[0].lower() not in ['add', 'fix', 'refactor', 'update', 'remove', 'feat']:\n        return 'not imperative'\n    return 'ok'\n\nprint(lint_subject('Add setup section to README'))\n\n# جرّب: أضف قسم '## Tests' وسطر تشغيل الاختبارات إلى readme\n# try: add a '## Tests' section with a test-run line to readme\n# جرّب: اكتب رسالتك لميزة بحث ثم مدققها — وجرّب بادئة feat: وراقب الحكم\n# try: write your own search-feature message, lint it — then try a feat: prefix and watch the verdict",
      prompt: {
        ar: 'جرّب بنفسك: أضف قسم Tests إلى readme واطبع عناوينه من جديد، ثم اكتب رسالة التزام لميزة تتخيلها ومدققها — وحاول إضافة فحص بادئة feat: كقاعدة ثالثة في المدقق دون تكسير الأولين. لا اختبار هنا — فضولك فقط.',
        en: 'Try it yourself: add a Tests section to readme and print the headings again, then write a commit message for a feature you imagine and lint it — and try adding a feat: prefix check as a third rule without breaking the first two. No tests here — just your curiosity.',
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ومن الفصل السادس (السلاسل): مدققنا استخدم subject.split() وlen(subject) وline.startswith(\'#\'). ماذا يعيد split() بلا معاملات؟',
            en: "From chapter 6 (strings): our linter used subject.split(), len(subject) and line.startswith('#'). What does split() with no arguments return?",
          },
          options: [
            { id: 'a', text: { ar: 'قائمة كلمات السلسلة مقسومة على المسافات البيضاء', en: 'A list of the string\u2019s words split on whitespace' } },
            { id: 'b', text: { ar: 'سلسلة جديدة بأحرف صغيرة', en: 'A new string in lowercase' } },
            { id: 'c', text: { ar: 'عدد الكلمات كعدد صحيح', en: 'The word count as an integer' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'split() بلا معاملات يقسم على أي مسافة بيضاء ويعيد قائمة — ولهذا كفى words[0] لالتقاط الفعل الأول، وlower جعله الفحص غير حساسًا لحالة الأحرف.',
            en: 'split() with no arguments splits on any whitespace and returns a list — hence words[0] grabbed the first verb, and lower made the check case-insensitive.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ومن الدرس الأول لهذا الفصل: أي قدرة من القدرات الأربع تخدمها رسالة التزام الجيدة التي تشرح لماذا؟',
            en: 'From this chapter\u2019s first lesson: which of the four capabilities does a good commit message explaining why serve?',
          },
          options: [
            { id: 'a', text: { ar: 'الإسناد attribution — من غيّر، ماذا غيّر، ولماذا غيّره', en: 'Attribution — who changed, what changed, and why they changed it' } },
            { id: 'b', text: { ar: 'العزل isolation — تجريب بلا خطر', en: 'Isolation — experimenting without risk' } },
            { id: 'c', text: { ar: 'لا علاقة لها بأي من القدرات الأربع', en: 'None of the four capabilities' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'التاريخ بلا أسباب نصف تاريخ: الرسالة الجيدة تجعل السجل يجيب «من غيّر ولماذا» حين يظهر خلل بعد أسابيع — وهذه هي الإسناد التي بدأنا بها الفصل.',
            en: 'History without reasons is half a history: a good message lets the record answer who changed and why when a bug surfaces weeks later — the attribution capability the chapter opened with.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'في Markdown — ما القاعدة التي يتعثر فيها المبتدئون أكثر من غيرها؟',
            en: 'In Markdown — which rule trips beginners up most?',
          },
          options: [
            { id: 'a', text: { ar: 'السطر الفارغ: قائمة أو عنوان أو كتلة شيفرة بلا سطر فارغ قبله كثيرًا ما لا تُصيَّر بصفتها', en: 'The blank line: a list, heading or code block without one before it often will not render as such' } },
            { id: 'b', text: { ar: 'أن Markdown يتطلب وسم HTML لكل عنوان', en: 'That Markdown requires an HTML tag for every heading' } },
            { id: 'c', text: { ar: 'أن الجداول ممنوعة في GitHub', en: 'That tables are forbidden on GitHub' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'السطر الفارغ يفصل البنى: بلا قبله يمتزج العنوان أو القائمة بالفقرة السابقة فيظهر نصًّا عاديًّا. لهذا تذكر قوالب PR دائمًا سطرًا فارغًا قبل كل قسم ##.',
            en: 'The blank line separates blocks: without it a heading or list blends into the previous paragraph and shows as plain text. That is why PR templates always keep a blank line before each ## section.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'في عُرف Conventional Commits — أي بادئة تُعلن ميزة جديدة؟',
            en: 'In the Conventional Commits convention — which prefix announces a new feature?',
          },
          options: [
            { id: 'a', text: { ar: 'feat:', en: 'feat:' } },
            { id: 'b', text: { ar: 'fix:', en: 'fix:' } },
            { id: 'c', text: { ar: 'docs:', en: 'docs:' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'feat: للميزات وfix: للإصلاحات وdocs: للتوثيق — بادئات تجعل التاريخ قابلًا للمسح ويمكن أن تحرك الترقيم الآلي للإصدارات.',
            en: 'feat: for features, fix: for fixes, docs: for documentation — prefixes that make history scannable and can drive automated versioning.',
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "git commit -m 'fixed stuff'",
          right: "git commit -m 'Fix redirect loop on expired session (#143)'",
          note: {
            ar: 'fixed stuff لا يقرأ كأمر ولا يقول ماذا أصلح. الصيغة الجذري + وصف محدد + مرجع المشكلة تجعل السطر يُمسح في log ويُرجع إلى مشكلته — والرسالة للقارئ القادم الذي غالبًا ستكون أنت.',
            en: 'fixed stuff reads as neither an instruction nor a statement of what was fixed. Imperative + specific description + issue reference makes the line scannable in log and traceable to its issue — and the message is for the next reader, who is usually you.',
          },
        },
        {
          wrong: 'commit واحد: ميزة + إعادة تنسيق كامل + إصلاح لا علاقة له',
          right: 'ثلاث التزامات صغيرة متماسكة، كل واحد يفعل شيئًا واحدًا',
          note: {
            ar: 'الالتزام الخلطي يستحيل مراجعته سطرًا سطرًا ويستحيل التراجع عن جزء منه. الالتزام الصغير المتماسك يراجع سريعًا ويرجع نظيفًا ويتتبع إلى خلل واحد.',
            en: 'A mixed commit cannot be reviewed line by line nor partially reverted. A small coherent commit reviews fast, reverts cleanly, and traces back to a single bug.',
          },
        },
        {
          wrong: 'وصف PR: «updated stuff»',
          right: '## What changed ثم ## Why ثم ## How to test بخطوات ملموسة',
          note: {
            ar: 'الوصف الفارغ يرمي المراجع في المحيط بلا مصباح. الأقسام الثلاثة تقول له أين ينظر وكيف يتحقق — وتصير بعد أشهر شرحًا مكتوبًا للتغيير في التاريخ، ودليلًا على مساهمتك.',
            en: 'A blank description drops the reviewer into the ocean without a lamp. The three sections say where to look and how to verify — and months later become the written explanation in history, and evidence of your contribution.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'عادات التاريخ: التزام صغير متماسك واحد الشيء، ورسالة بفعل جذري في حدود 50 محرفًا ومتن يشرح لماذا، وعُرف feat:/fix: للمسح، ودفع متكرر وmain محمي بمراجعة وCI.', en: 'History habits: small single-purpose commits, an imperative subject around 50 characters with a why-explaining body, feat:/fix: prefixes for scanning, frequent pushes and a protected main with review and CI.' },
        { ar: 'Markdown نص عادي يُصيَّر إلى HTML: عناوين وقوائم وروابط واقتباسات وجداول وكتل ```python — وقاعدته الحرجة السطر الفارغ قبل كل بنية؛ وهو صيغة README والمشكلات وطلبات الدمج.', en: 'Markdown is plain text rendered to HTML: headings, lists, links, quotes, tables and ```python fences — with the critical blank-line rule before every block; it is the format of READMEs, issues and PRs.' },
        { ar: 'README الواجهة الأمامية: الاسم والغرض، والفريق والملكية، والتركيب والتشغيل والاختبارات، ورابط النشر، والمحدوديات بصدق، وسجل الذكاء الاصطناعي — وPR يوصف بـ What changed / Why / How to test، وكل ذلك دليل موثق بالوقت.', en: 'The README front door: name and purpose, team and ownership, setup and run and tests, deployment link, honest limitations, AI-use log — and a PR described as What changed / Why / How to test; all of it timestamped evidence.' },
      ],
      reflectPrompt: {
        ar: 'في الملعب: اكتب README من سبعة أسطر لمشروعك التالي بأقسام العنوان والغرض والتشغيل، ثم اكتب رسالة التزام لكل قسم بمدققك واجعلها كلها تعطي ok. أي حقول README ستعجز عن ملئها اليوم — وماذا يخبرك ذلك عن مشروعك؟',
        en: 'In the sandbox: write a seven-line README for your next project with title, purpose and run sections, then write a commit message per section through your linter and make every one return ok. Which README fields can you not fill today — and what does that tell you about your project?',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'SWE', section: 'swe.ch8.s6', pages: 'ص219–220 / pp.219–220' },
        { book: 'SWE', section: 'swe.ch8.s7', pages: 'ص220–222 / pp.220–222' },
      ],
    },
  ],
  sources: [
    { book: 'SWE', section: 'swe.ch8.s6', pages: 'ص219–220 / pp.219–220' },
    { book: 'SWE', section: 'swe.ch8.s7', pages: 'ص220–222 / pp.220–222' },
  ],
} satisfies Lesson;

export default lesson;
