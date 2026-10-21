import type { Lesson } from '@/lib/content/schema';

/**
 * py4e.ch12.l5 — "Parsing HTML Pages / تحليل صفحات HTML"
 * Aligned with PY4E ch12 s6 (تحليل واستخراج البيانات من صفحات HTML),
 * s7 (تحليل HTML بالتعابير النمطية), s8 (تحليل HTML باستخدام BEAUTIFULSOUP).
 * All expression is original.
 * SIMULATED-NETWORK design: regex-over-HTML is RUNNABLE on an embedded HTML
 * string (href extraction with re.findall, book's pattern with extraction
 * parens); BeautifulSoup is taught conceptually as the robust tool for messy
 * pages — importable on the learner's own machine after pip install, never
 * imported in platform-runnable code.
 */
const lesson = {
  id: 'py4e.ch12.l5',
  version: 1,
  part: 'I',
  track: 'P1',
  book: 'PY4E',
  chapter: 12,
  title: { ar: 'تحليل صفحات HTML', en: 'Parsing HTML Pages' },
  estimatedMinutes: 18,
  prerequisites: ['py4e.ch12.l4'],
  blocks: [
    {
      kind: 'hook',
      text: {
        ar: 'أعطتك google أول نتائجها لأن برنامجًا ما دخل صفحات الويب كمتصفح ثم فحصها بحثًا عن أنماط — هذا فن تعقب الويب web scraping، وذروة كل مهاراتك: جلب صفحة، ثم أدوات الفصل الحادي عشر لاستخراج ما يهم. ستجربها فورًا على صفحة HTML مخزّنة في متغير: تستخرج الروابط بالتعابير النمطية، ثم تتعرف على الأداة الأقوى للصفحات الفوضوية. بنهاية الدرس ستكون قادرًا على: قراءة وسم الارتكاز وخصيته href، وكتابة نمط href="http[s]?://.+?" بأقواس الاستخراج وعلامة عدم الطماع، وشرح متى تنقل من التعابير النمطية إلى BeautifulSoup.',
        en: 'Google hands you its first results because some program entered web pages like a browser and scanned them for patterns — the craft of web scraping, the summit of all your skills: fetch a page, then the chapter-eleven tools to extract what matters. You will try it immediately on an HTML page stored in a variable: extracting links with regular expressions, then meeting the stronger tool for messy pages. By the end of this lesson you will be able to: read the anchor tag and its href attribute, write the pattern href="http[s]?://.+?" with extraction parentheses and non-greedy punctuation, and explain when to move from regex to BeautifulSoup.',
      },
    },
    {
      kind: 'predict',
      code: "import re\nhtml = '<a href=\"page1.htm\">one</a>'\nlinks = re.findall('href=\"([^\"]+)\"', html)\nprint(len(links))\nprint(links[0])",
      question: {
        ar: 'لماذا يطبع السطر الثاني page1.htm وحدها — من أين اختفت href= وعلامتا الاقتباس؟',
        en: 'Why does the second line print page1.htm alone — where did href= and the quotes disappear?',
      },
      reveal: {
        ar: 'يطبع 1 ثم page1.htm. القوسان في النمط يعلنان الجزء المستخرج: findall يطابق النمط كله لكنه يعيد ما بين القوسين فقط — هكذا ننزع غلاف href="..." ونأخذ العنوان الصافي. أما [^"]+ فيأكل كل محرف ما عدا الاقتباس الختامي.',
        en: 'It prints 1 then page1.htm. The parentheses in the pattern declare the extracted part: findall matches the whole pattern but returns only what sits between the parens — that is how we peel the href="..." wrapper and take the bare address. Meanwhile [^"]+ devours every character except the closing quote.',
      },
    },
    {
      kind: 'concept',
      heading: { ar: 'تعقب الويب ووسوم الارتكاز', en: 'Web scraping and anchor tags' },
      chunks: [
        {
          ar: 'تعقب الويب (web scraping) أن يكتب برنامجك دور المتصفح: يسترجع صفحة ثم يفحص بياناتها بحثًا عن أنماط. محركات البحث تعاين مصدر الصفحة لتستخرج روابط صفحات أخرى ثم تستعيد تلك الصفحات وهكذا حتى يكاد يبلغ الويبَ كله، وتستخدم تكرارَ رابط صفحةٍ في غيرها معيارًا لأهميتها وترتيبها في النتائج. الجديد الوحيد هو التنسيق: صفحات HTML ملفات نصية مبعثرة بوسوم بين أقواس زاوية — مثل <h1> للعنوان و<p> للفقرة.',
          en: 'Web scraping is your program playing the browser: it retrieves a page then scans its data for patterns. Search engines inspect a page source to extract links to other pages, then fetch those pages, and on and on until nearly the whole web is reached — using how often a page is linked from others as the measure of its importance and rank in results. The only new thing is the format: HTML pages are text files littered with tags in angle brackets — like <h1> for headings and <p> for paragraphs.',
        },
        {
          ar: 'الوسم الذي يهمنا اليوم هو وسم الارتكاز <a> الذي يحمل الرابط في خصيته href: <a href="http://www.dr-chuck.com/page2.htm">Second Page</a>. هذا نمطٌ نصي يمكن مطابقته بأدوات الفصل الحادي عشر — والصفحة نحاكيها بمتن مخزّن في متغير html، تمامًا كما خزّنا الاستجابات في الدروس السابقة.',
          en: 'The tag that matters today is the anchor tag <a>, carrying the link in its href attribute: <a href="http://www.dr-chuck.com/page2.htm">Second Page</a>. That is a textual pattern matchable with chapter-eleven tools — and the page we simulate with a stored response in an html variable, exactly as we stored responses in previous lessons.',
        },
      ],
    },
    {
      kind: 'concept',
      heading: { ar: 'نمط الروابط غير الطماع', en: 'The non-greedy link pattern' },
      chunks: [
        {
          ar: 'نمط الكتاب لاستخراج الروابط: href="http[s]?://.+?" — يبحث عن href="http:// أو href="https:// ثم محرفًا أو أكثر ثم اقتباسًا ختاميًا. علامة [s]? تعني حرف s صفرًا أو مرة، وعلامة ? بعد .+ تقلب المطابقة من الطماعة إلى غير الطماعة: الطماعة تمتد إلى آخر اقتباس في الصفحة فتبتلع روابط كثيرة في مطابقة واحدة، وغير الطماعة تقف عند أول اقتباس فتعطي رابطًا واحدًا صافيًا. والأقواس حول (.+?) تخبر findall أن يعيد الجزء المستخرج — الرابط وحده.',
          en: 'The book pattern for extracting links: href="http[s]?://.+?" — it looks for href="http:// or href="https://, then one or more characters, then a closing quote. The [s]? means the letter s zero or one time, and the ? after .+ flips matching from greedy to non-greedy: greedy stretches to the last quote on the page and swallows many links into one match, while non-greedy stops at the first quote and yields one clean link. And the parentheses around (.+?) tell findall to return the extracted part — the link alone.',
        },
        {
          ar: 'التعابير النمطية رائعة حين تكون HTML منسقة وقابلة للتنبؤ، لكن كثيرًا من صفحات الويب غير منسقة فتفقد روابط أو تلتقط بيانات عشوائية. للصفحات الفوضوية أداة متخصصة اسمها BeautifulSoup — مكتبة تثبَّت على حاسوبك بأداة pip من pypi، وتتساهل مع عيوب الصفحات: soup = BeautifulSoup(html, \'html.parser\') ثم tags = soup(\'a\') فتسترجع كل وسوم الارتكاز، وtag.get(\'href\', None) يعطي رابط كل وسم. شيفرة urllinks.py في الكتاب بهذه الأسطر بالضبط — لكنها شيفرة سطح مكتب؛ في المنصة نتدرب على المتن المخزّن بالتعابير النمطية.',
          en: 'Regular expressions shine when the HTML is well-formed and predictable, but many web pages are messy, losing links or catching junk. For messy pages there is a specialized tool named BeautifulSoup — a library installed on your own computer with pip from pypi, forgiving of page defects: soup = BeautifulSoup(html, \'html.parser\'), then tags = soup(\'a\') retrieving all anchor tags, and tag.get(\'href\', None) giving each tag its link. The book urllinks.py is exactly these lines — but desktop code; in the platform we train on the stored response with regular expressions.',
        },
      ],
    },
    {
      kind: 'worked',
      title: { ar: 'استخراج الروابط من صفحة مخزّنة', en: 'Extracting links from a stored page' },
      code: "import re\nhtml = '<h1>The First Page</h1>\\n<p>If you like, you can switch to the\\n<a href=\"http://www.dr-chuck.com/page2.htm\">Second Page</a>.\\nOr jump to <a href=\"http://www.py4e.com\">the book</a>.</p>'\nlinks = re.findall('href=\"(http[s]?://.+?)\"', html)\nprint('links: %d' % len(links))\nfor link in links:\n    print(link)",
      explanation: {
        ar: 'الصفحة صفحة الكتاب نفسها: عنوان وفقرة ووسما ارتكاز. findall بنمط الكتاب يعيد قائمة الروابط المستخرجة — رابطان: صفحة dr-chuck الثانية ثم موقع py4e. علامة ? أبقت كل مطابقة عند أول اقتباس، والأقواس سلخت href= والاقتباسين فبقي الرابط الصافي. حلقة الطباعة لكل رابط سطرًا — وهذه الحلقة بالضبط هي نصف متصفح مصغّر ستبنيه في مشروع الفصل. جرّب بنفسك إزالة ? من .+? وراقب كيف ينهار كل شيء في مطابقة طماعة واحدة.',
        en: "The page is the book's own page: a heading, a paragraph and two anchors. findall with the book pattern returns the list of extracted links — two of them: dr-chuck's second page then the py4e site. The ? kept every match at the first quote, and the parens peeled off href= and both quotes, leaving the bare link. The loop prints one link per line — and this loop is exactly half of the mini browser you will build in the chapter project. Try removing the ? from .+? yourself and watch everything collapse into one greedy match.",
      },
    },
    {
      kind: 'exercise',
      id: 'ex1.extract-links',
      exKind: 'write_code',
      required: true,
      prompt: {
        ar: 'الصفحة معطاة في المحرر وتحوي رابطين. استخرج الروابط بنمط الكتاب \'href="(http[s]?://.+?)"\' في قائمة links، ثم اطبع \'links: %d\' بطول القائمة، ثم حلقة تطبع كل رابط بـ \'link: %s\'. المتوقع: links: 2 ثم link: https://docs.python.org ثم link: http://www.python.org.',
        en: 'The page is given in the editor and holds two links. Extract the links with the book pattern \'href="(http[s]?://.+?)"\' into a links list, then print \'links: %d\' with the list length, then a loop printing each link as \'link: %s\'. Expected: links: 2, then link: https://docs.python.org, then link: http://www.python.org.',
      },
      starterCode: "import re\nhtml = '<p>Read the <a href=\"https://docs.python.org\">docs</a>\\nand visit <a href=\"http://www.python.org\">the site</a>.</p>'\n# استخرج الروابط ثم اطبع عددها وروابطها / extract the links, then print the count and each link\n",
      solution: "import re\nhtml = '<p>Read the <a href=\"https://docs.python.org\">docs</a>\\nand visit <a href=\"http://www.python.org\">the site</a>.</p>'\nlinks = re.findall('href=\"(http[s]?://.+?)\"', html)\nprint('links: %d' % len(links))\nfor link in links:\n    print('link: %s' % link)",
      tests: [
        {
          id: 't1',
          name: { ar: 'عدد الروابط 2 مطبوع', en: 'The link count 2 is printed' },
          code: "assert 'links: 2' in __learner_output__, ('expected: links: 2 | actual: %r' % __learner_output__)",
          expected: 'links: 2',
        },
        {
          id: 't2',
          name: { ar: 'القائمة المستخرجة هي الرابطان بالترتيب', en: 'The extracted list is the two links in order' },
          code: "assert links == ['https://docs.python.org', 'http://www.python.org'], ('expected: the two bare links in order | actual: %r' % (links,))",
          expected: "['https://docs.python.org', 'http://www.python.org']",
        },
        {
          id: 't3',
          name: { ar: 'الرابط الأول مطبوع بصيغة link:', en: 'The first link printed in link: form' },
          code: "assert 'link: https://docs.python.org' in __learner_output__, ('expected: link: https://docs.python.org | actual: %r' % __learner_output__)",
          expected: 'link: https://docs.python.org',
        },
        {
          id: 't4',
          name: { ar: 'الرابط الثاني مطبوع بصيغة link:', en: 'The second link printed in link: form' },
          code: "assert 'link: http://www.python.org' in __learner_output__, ('expected: link: http://www.python.org | actual: %r' % __learner_output__)",
          expected: 'link: http://www.python.org',
        },
      ],
      hints: [
        { ar: 'نمط الكتاب بأقواس الاستخراج: re.findall(\'href="(http[s]?://.+?)"\', html) — انسخه كما هو.', en: "The book pattern with extraction parens: re.findall('href=\"(http[s]?://.+?)\"', html) — copy it as is." },
        { ar: "العدّ len(links) والطباعة بحلقة for link in links داخلها print('link: %s' % link).", en: "The count is len(links) and printing a for link in links loop holding print('link: %s' % link)." },
        { ar: "الهيكل:\nlinks = re.findall('href=\"(http[s]?://.+?)\"', html)\nprint('links: %d' % len(links))\nfor link in links:\n    print('link: %s' % link)", en: "The skeleton:\nlinks = re.findall('href=\"(http[s]?://.+?)\"', html)\nprint('links: %d' % len(links))\nfor link in links:\n    print('link: %s' % link)" },
        { ar: 'لا تنسَ ? بعد .+ — بلاها يبتلع النمط الطماع كلا الرابطين في مطابقة واحدة فتفقد القائمة معناها.', en: 'Do not forget the ? after .+ — without it the greedy pattern swallows both links into one match and your list loses meaning.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex2.trace-two-links',
      exKind: 'trace_output',
      required: true,
      prompt: {
        ar: 'اقرأ الكود وتوقّع خرْجه بالضبط — سطرًا لكل طباعة — دون تشغيله.',
        en: 'Read the code and predict its exact output — one line per print — without running it.',
      },
      code: "import re\nhtml = '<a href=\"a.htm\">x</a><a href=\"b.htm\">y</a>'\nfound = re.findall('href=\"([^\"]+)\"', html)\nprint(len(found))\nprint(found[1])",
      solution: '2\nb.htm',
      answer: '2\nb.htm',
      hints: [
        { ar: 'وسما ارتكاز متلاصقان — كم موضع href في السلسلة؟', en: 'Two back-to-back anchors — how many href positions in the string?' },
        { ar: '[^"]+ يكمل حتى أول اقتباس لا بعده.', en: '[^"]+ runs to the first quote, not past it.' },
        { ar: 'قائمة findall تُفهرس من الصفر — فالموضع 1 هو الثاني.', en: 'The findall list indexes from zero — so position 1 is the second item.' },
        { ar: 'الخرْج:\n2\nb.htm', en: 'The output:\n2\nb.htm' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex3.mcq-bs4',
      exKind: 'mcq',
      required: true,
      prompt: {
        ar: 'لماذا يعرض الكتاب BeautifulSoup بعد التعابير النمطية؟',
        en: 'Why does the book present BeautifulSoup after regular expressions?',
      },
      options: [
        { id: 'a', text: { ar: 'لأن كثيرًا من صفحات HTML غير منسقة جيدًا فتنجح النمطية فيها جزئيًا، بينما تتساهل المكتبة مع العيوب وتستخرج بسهولة', en: 'Because many HTML pages are poorly formed so regex only partially succeeds, while the library forgives defects and extracts with ease' } },
        { id: 'b', text: { ar: 'لأن التعابير النمطية ممنوعة في بايثون', en: 'Because regular expressions are forbidden in Python' } },
        { id: 'c', text: { ar: 'لأن BeautifulSoup أسرع في الطباعة على الشاشة', en: 'Because BeautifulSoup prints to screen faster' } },
      ],
      answer: 'a',
      solution: 'a',
      hints: [
        { ar: 'الكتاب يقولها نصًّا: النمطية تعمل رائعًا مع HTML منسق وقابل للتنبؤ.', en: 'The book says it plainly: regex works great on well-formed, predictable HTML.' },
        { ar: 'الويب الحقيقي مليء بالصفحات الفوضوية — المكتبة المتخصصة صُنعت لأجلها.', en: 'The real web is full of messy pages — the specialized library was made for them.' },
        { ar: 'الاثنان أداتان: النمطية للبحث المتكرر السريع، والمكتبة للتحليل المتين.', en: 'Both are tools: regex for quick repeated searching, the library for robust parsing.' },
        { ar: 'الجواب: الصفحات غير المنسقة تكشف هشاشة النمطية وتبرر المكتبة.', en: 'Answer: messy pages expose regex fragility and justify the library.' },
      ],
    },
    {
      kind: 'exercise',
      id: 'ex4.fill-href',
      exKind: 'fill_blank',
      required: true,
      prompt: {
        ar: 'أكمل الفراغ بكلمة واحدة: وسم الارتكاز <a> يحمل وجهة الرابط في خصيته ____ التي بدأنا بها كل أنماط هذا الدرس.',
        en: 'Fill the blank with one word: the anchor tag <a> carries the link destination in its ____ attribute, the one every pattern in this lesson started with.',
      },
      answer: 'href',
      solution: 'href',
      hints: [
        { ar: 'أربعة أحرف — اختصار لمرجع تشعبي.', en: 'Four letters — short for hypertext reference.' },
        { ar: 'شكلها في الصفحة: <a ____="http://...">نص</a>.', en: 'Its shape on the page: <a ____="http://...">text</a>.' },
        { ar: 'نمط الروابط في worked بدأ بها: ____="http[s]?://.+?".', en: 'The link pattern in the worked example began with it: ____="http[s]?://.+?".' },
        { ar: 'الجواب: href', en: 'Answer: href' },
      ],
    },
    {
      kind: 'sandbox',
      starterCode: "# ملعبك الحرّ — كن محرك بحث\n# Your playground — be a search engine\n\nimport re\n\nhtml = '<a href=\"http://a.com/x.htm\">A</a> <a href=\"https://b.com\">B</a> <a href=\"c.htm\">C</a>'\nprint(re.findall('href=\"(http[s]?://.+?)\"', html))\nprint(re.findall('href=\"([^\"]+)\"', html))\nprint(len(re.findall('<a ', html)))\n\npage = 'HTTP/1.1 200 OK\\n\\n' + html\nprint(page.split('\\n\\n', 1)[1][:20])",
      prompt: {
        ar: 'جرّب بنفسك: النمطان معًا — ذو http[s]? يلتقط الروابط الشبكية فقط والآخر يلتقط كل الروابط حتى النسبية c.htm. عُدّ وسوم <a بمطابقة بسيطة. ثم اربط الفصل كله: ضع الصفحة خلف رد HTTP مخزّن وقسّم الترويسة عن المتن قبل الاستخراج. أضف وسومًا جديدة وراقب القوائم. لا اختبار هنا — فضولك فقط.',
        en: "Try it yourself: the two patterns side by side — the http[s]? one grabs only networked links while the other grabs every link including the relative c.htm. Count the <a tags with a simple match. Then tie the chapter together: put the page behind a stored HTTP response and split header from body before extracting. Add new tags and watch the lists. No tests here — just your curiosity.",
      },
    },
    {
      kind: 'quiz',
      id: 'quiz1',
      items: [
        {
          id: 'q1',
          question: {
            ar: 'ما تعريف تعقب الويب web scraping كما في الكتاب؟',
            en: 'What is the definition of web scraping as in the book?',
          },
          options: [
            { id: 'a', text: { ar: 'برنامج يتصرّف كمتصفح: يسترجع صفحات الويب ثم يفحص بياناتها بحثًا عن أنماط', en: 'A program acting like a browser: it retrieves web pages then inspects their data for patterns' } },
            { id: 'b', text: { ar: 'سرقة كلمات السر من المتصفحات', en: 'Stealing passwords from browsers' } },
            { id: 'c', text: { ar: 'رسم صفحات الويب كصور', en: 'Drawing web pages as images' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المتصفح يسترجع ويعرض؛ ومتتبع الويب يسترجع ويفحص — والفحص أدواتك أنت: findall وsplit وقوائمك.',
            en: 'A browser retrieves and displays; a scraper retrieves and inspects — and the inspection is your toolkit: findall, split and your lists.',
          },
        },
        {
          id: 'q2',
          question: {
            ar: 'ماذا تفعل الأقواس في النمط href="(http[s]?://.+?)"؟',
            en: 'What do the parentheses do in the pattern href="(http[s]?://.+?)"?',
          },
          options: [
            { id: 'a', text: { ar: 'تحدد الجزء الذي يعيده findall — الرابط وحده بلا href= ولا اقتباسات', en: 'They mark the part findall returns — the link alone, without href= or quotes' } },
            { id: 'b', text: { ar: 'تجعل المطابقة اختيارية كلها', en: 'They make the whole match optional' } },
            { id: 'c', text: { ar: 'تجمّع الروابط حسب الخادم', en: 'They group links by server' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'findall يطابق النمط كله لكنه يعيد ما بين القوسين — نفس حيلة الاستخراج التي رأيتها في التنبؤ حين اختفت href= عن النتيجة.',
            en: 'findall matches the whole pattern but returns what sits between the parens — the same extraction trick from the prediction where href= vanished from the result.',
          },
        },
        {
          id: 'q3',
          question: {
            ar: 'ومن الفصل الحادي عشر: ماذا تعني [s]? في http[s]?://؟',
            en: 'From chapter eleven: what does [s]? mean in http[s]?://?',
          },
          options: [
            { id: 'a', text: { ar: 'حرف s يظهر صفرًا أو مرة واحدة — فيقبل http وhttps', en: 'The letter s appears zero or one time — accepting both http and https' } },
            { id: 'b', text: { ar: 'حرف s مطلوب حتمًا', en: 'The letter s is mandatory' } },
            { id: 'c', text: { ar: 'أي حرف يظهر مرتين', en: 'Any character appearing twice' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'المجموعة [s] تطابق المحرف المذكور وحده، و? بعدها تجعله اختياريًا — فيتقبل النمط الروابط الآمنة وغير الآمنة معًا.',
            en: 'The class [s] matches exactly that letter, and the ? after it makes it optional — so the pattern accepts both secure and plain links.',
          },
        },
        {
          id: 'q4',
          question: {
            ar: 'في شيفرة BeautifulSoup بالكتاب، ماذا يعيد tags = soup(\'a\')؟',
            en: "In the book's BeautifulSoup code, what does tags = soup('a') return?",
          },
          options: [
            { id: 'a', text: { ar: 'كل وسوم الارتكاز في الصفحة، ثم يُقرأ رابط كل وسم بـ tag.get(\'href\')', en: "All anchor tags in the page, each tag's link then read with tag.get('href')" } },
            { id: 'b', text: { ar: 'روابط الصفحة مرتبة أبجديًا فقط', en: 'The page links sorted alphabetically only' } },
            { id: 'c', text: { ar: 'عدد الكلمات في الصفحة', en: 'The word count of the page' } },
          ],
          answer: 'a',
          explanation: {
            ar: 'soup يحلل الصفحة الفوضوية كلها ثم soup(\'a\') يسحب وسوم الارتكاز كما سحبتها أنت بالنمط — لكنه لا يهتز أمام العيوب.',
            en: "soup parses the whole messy page, then soup('a') pulls the anchor tags exactly as you pulled them with the pattern — except it never wobbles at defects.",
          },
        },
      ],
    },
    {
      kind: 'pitfalls',
      items: [
        {
          wrong: "re.findall('href=\"http[s]?://.+\"', html)",
          right: "re.findall('href=\"(http[s]?://.+?)\"', html)",
          note: {
            ar: 'بلا ? يمدد النمط الطماع المطابقة إلى آخر اقتباس في الصفحة فيبتلع كل الروابط في قطعة واحدة. الـ ? بعد .+ تجعله غير طماعة: يقف عند أول اقتباس.',
            en: 'Without the ?, the greedy pattern stretches the match to the last quote on the page and swallows every link into one piece. The ? after .+ makes it non-greedy: it stops at the first quote.',
          },
        },
        {
          wrong: "links = re.findall('href=\"http[s]?://.+?\"', html)  # بلا أقواس",
          right: "links = re.findall('href=\"(http[s]?://.+?)\"', html)",
          note: {
            ar: 'بلا أقواس الاستخراج تعيد findall المطابقات كاملة مع href="..." والاقتباسين — عناوين ملوثة تنكسر عند مقارنتها. الأقواس تنزع الغلاف.',
            en: 'Without extraction parens, findall returns whole matches with href="..." and both quotes — polluted addresses that break on comparison. The parens peel the wrapper.',
          },
        },
        {
          wrong: '# في المنصة:\nfrom bs4 import BeautifulSoup',
          right: '# في المنصة:\nimport re  # على المتن المخزّن',
          note: {
            ar: 'مكتبة bs4 غير مثبتة في منصة pypath فيرمي الاستيراد ModuleNotFoundError. BeautifulSoup شيفرة سطح مكتب تثبت بـ pip على حاسوبك؛ هنا نتدرب بالتعابير النمطية على المتن المخزّن.',
            en: 'The bs4 library is not installed in the pypath platform, so the import raises ModuleNotFoundError. BeautifulSoup is desktop code installed with pip on your own computer; here we train with regular expressions on the stored response.',
          },
        },
      ],
    },
    {
      kind: 'summary',
      bullets: [
        { ar: 'تعقب الويب: برنامج كمتصفح يسترجع الصفحات ويفحصها — وروابط الارتكاز href هي بوابة التنقل بين الصفحات.', en: 'Web scraping: a program like a browser that retrieves pages and inspects them — and the anchor href links are the gateway between pages.' },
        { ar: 'نمط الروابط href="(http[s]?://.+?)" يجمع ثلاث حيل: [s]? للاختيار، و? لعدم الطماع، والأقواس للاستخراج.', en: 'The link pattern href="(http[s]?://.+?)" packs three tricks: [s]? for the choice, ? for non-greedy, and parens for extraction.' },
        { ar: 'نحاكي الشبكة بمتن مخزّن: HTML مخزّن في متغير يكفي لتدريب الاستخراج، وBeautifulSoup أداة حاسوبك للصفحات الفوضوية بعد pip install.', en: 'We simulate the network with a stored response: HTML in a variable is enough to train extraction, and BeautifulSoup is your computer tool for messy pages after pip install.' },
      ],
      reflectPrompt: {
        ar: 'لديك صفحة فيها رابطان شبكيان ورابط نسبي مثل page3.htm. أي النمطين تختار لو أردت زيارة كل الصفحات داخل الموقع نفسه فقط، وأيهما لو أردت كل الروابط؟ فسّر الفرق بجملة.',
        en: 'A page holds two networked links and a relative one like page3.htm. Which pattern do you pick to visit only pages inside the same site, and which to follow every link? Explain the difference in one sentence.',
      },
    },
    {
      kind: 'sources',
      items: [
        { book: 'PY4E', section: 'py4e.ch12.s6', pages: 'ص201 / pp.201' },
        { book: 'PY4E', section: 'py4e.ch12.s7', pages: 'ص201 / pp.201' },
        { book: 'PY4E', section: 'py4e.ch12.s8', pages: 'ص204 / pp.204' },
      ],
    },
  ],
  sources: [
    { book: 'PY4E', section: 'py4e.ch12.s6', pages: 'ص201 / pp.201' },
    { book: 'PY4E', section: 'py4e.ch12.s7', pages: 'ص201 / pp.201' },
    { book: 'PY4E', section: 'py4e.ch12.s8', pages: 'ص204 / pp.204' },
  ],
} satisfies Lesson;

export default lesson;
