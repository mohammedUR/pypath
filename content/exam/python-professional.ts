/**
 * Python Professional certification exam — item bank (R-CUR-04, §4.2 P4 gate).
 * 52 items = 20 PY4E + 22 SWE + 10 AI-era (> 3× the 16 drawn per attempt,
 * bank floor per R-CNT-02). Bilingual, single-answer, four options. Each
 * attempt draws a balanced, duplicate-free sample (R-GRD-04, EXAM-002);
 * pass mark ≥ 80% (≙ ≥ 13/16) enforced by ExamView.
 */

export interface ExamItem {
  id: string;
  topic: 'py4e' | 'swe' | 'ai-era';
  q: { ar: string; en: string };
  options: { id: string; text: { ar: string; en: string } }[];
  answer: string;
  why: { ar: string; en: string };
}

export const EXAM_ITEMS: ExamItem[] = [
  {
    id: 'py1', topic: 'py4e',
    q: { ar: 'ماذا يطبع print(int("3") + 4)؟', en: 'What does print(int("3") + 4) print?' },
    options: [
      { id: 'a', text: { ar: '7', en: '7' } },
      { id: 'b', text: { ar: '34', en: '34' } },
      { id: 'c', text: { ar: 'خطأ في الأنواع', en: 'a type error' } },
      { id: 'd', text: { ar: '3', en: '3' } },
    ],
    answer: 'a',
    why: { ar: 'int("3") تحوّل النص إلى العدد 3 فالجمع عددي 3+4=7.', en: 'int("3") converts to the number 3, so the sum is numeric: 3 + 4 = 7.' },
  },
  {
    id: 'py2', topic: 'py4e',
    q: { ar: 'أي بناء يُنشئ قائمة الأعداد من 9 إلى 0 تنازليًا؟', en: 'Which expression builds the list 9..0 in descending order?' },
    options: [
      { id: 'a', text: { ar: 'list(range(9, -1, -1))', en: 'list(range(9, -1, -1))' } },
      { id: 'b', text: { ar: 'list(range(9, 0, -1))', en: 'list(range(9, 0, -1))' } },
      { id: 'c', text: { ar: 'list(range(-1, 9, -1))', en: 'list(range(-1, 9, -1))' } },
      { id: 'd', text: { ar: 'range(9).reverse()', en: 'range(9).reverse()' } },
    ],
    answer: 'a',
    why: { ar: 'النهاية الحصرية -1 مع خطوة -1 تعطيان 9 حتى 0 شاملة.', en: 'The exclusive stop -1 with step -1 walks 9 down to 0 inclusive.' },
  },
  {
    id: 'py3', topic: 'py4e',
    q: { ar: 'ماذا يعيد "a,b,c".split(",")؟', en: "What does 'a,b,c'.split(',') return?" },
    options: [
      { id: 'a', text: { ar: "['a', 'b', 'c']", en: "['a', 'b', 'c']" } },
      { id: 'b', text: { ar: "('a', 'b', 'c')", en: "('a', 'b', 'c')" } },
      { id: 'c', text: { ar: "['a,b,c']", en: "['a,b,c']" } },
      { id: 'd', text: { ar: 'خطأ', en: 'an error' } },
    ],
    answer: 'a',
    why: { ar: 'القسمة على الفاصلة تعيد قائمة من ثلاثة عناصر.', en: 'Splitting on the comma yields a three-element list.' },
  },
  {
    id: 'py4', topic: 'py4e',
    q: { ar: 'القاموس d = {"a": 1}؛ أي عملية ترفع KeyError؟', en: 'With d = {"a": 1}, which line raises KeyError?' },
    options: [
      { id: 'a', text: { ar: 'd.get("b")', en: 'd.get("b")' } },
      { id: 'b', text: { ar: 'd["b"]', en: 'd["b"]' } },
      { id: 'c', text: { ar: 'd.setdefault("b", 2)', en: 'd.setdefault("b", 2)' } },
      { id: 'd', text: { ar: '"b" in d', en: '"b" in d' } },
    ],
    answer: 'b',
    why: { ar: 'الوصول المباشر بمفتاح غائب يرفع KeyError؛ get وsetdefault وin آمنة.', en: 'Direct indexing with a missing key raises KeyError; get/setdefault/in are safe.' },
  },
  {
    id: 'py5', topic: 'py4e',
    q: { ar: 'أي مقطع يغلق الملف تلقائيًا حتى لو حدث استثناء؟', en: 'Which snippet closes the file even on an exception?' },
    options: [
      { id: 'a', text: { ar: 'f = open("x"); data = f.read(); f.close()', en: 'f = open("x"); data = f.read(); f.close()' } },
      { id: 'b', text: { ar: 'with open("x") as f: data = f.read()', en: 'with open("x") as f: data = f.read()' } },
      { id: 'c', text: { ar: 'f = open("x", "w")', en: 'f = open("x", "w")' } },
      { id: 'd', text: { ar: 'data = open("x").read()', en: 'data = open("x").read()' } },
    ],
    answer: 'b',
    why: { ar: 'مدير السياق with يضمن الإغلاق في كل المسارات.', en: 'The with context manager guarantees closure on every path.' },
  },
  {
    id: 'py6', topic: 'py4e',
    q: { ar: 'ما نوع (1,) في بايثون؟', en: 'What is the type of (1,) in Python?' },
    options: [
      { id: 'a', text: { ar: 'tuple', en: 'tuple' } },
      { id: 'b', text: { ar: 'int', en: 'int' } },
      { id: 'c', text: { ar: 'list', en: 'list' } },
      { id: 'd', text: { ar: 'set', en: 'set' } },
    ],
    answer: 'a',
    why: { ar: 'الفاصلة الزائدة تجعل (1,) صفًّا لا تعبيرًا مقوّسًا.', en: 'The trailing comma makes (1,) a tuple, not a parenthesised expression.' },
  },
  {
    id: 'py7', topic: 'py4e',
    q: { ar: 'أي regex يلتقط أسعارًا مثل $12.50 فقط؟', en: 'Which regex matches $12.50-style prices only?' },
    options: [
      { id: 'a', text: { ar: '\\$\\d+\\.\\d{2}', en: '\\$\\d+\\.\\d{2}' } },
      { id: 'b', text: { ar: '\\$\\.?\\d*', en: '\\$\\.?\\d*' } },
      { id: 'c', text: { ar: '\\$.*', en: '\\$.*' } },
      { id: 'd', text: { ar: '\\$\\d*', en: '\\$\\d*' } },
    ],
    answer: 'a',
    why: { ar: 'دولار مُهرَّب، أرقام، نقطة حرفية، ثم خانتان عشريتان بالضبط.', en: 'Escaped dollar, digits, a literal dot, then exactly two decimals.' },
  },
  {
    id: 'py8', topic: 'py4e',
    q: { ar: 'في OOP: ماذا يمثل self داخل __init__؟', en: 'In OOP, what does self refer to inside __init__?' },
    options: [
      { id: 'a', text: { ar: 'الصنف نفسه', en: 'The class itself' } },
      { id: 'b', text: { ar: 'النسخة الجديدة قيد الإنشاء', en: 'The new instance being constructed' } },
      { id: 'c', text: { ar: 'الوحدة النمطية', en: 'The module' } },
      { id: 'd', text: { ar: 'الصف الأب', en: 'The parent class' } },
    ],
    answer: 'b',
    why: { ar: 'self يرتبط بالنسخة التي يُستدعى عليها الباني.', en: 'self binds to the instance being initialised.' },
  },
  {
    id: 'py9', topic: 'py4e',
    q: { ar: 'أي استعلام SQL يجمع عدد الصفوف لكل فئة؟', en: 'Which SQL aggregates row counts per category?' },
    options: [
      { id: 'a', text: { ar: 'SELECT cat, COUNT(*) FROM t GROUP BY cat', en: 'SELECT cat, COUNT(*) FROM t GROUP BY cat' } },
      { id: 'b', text: { ar: 'SELECT cat, COUNT(*) FROM t ORDER BY cat', en: 'SELECT cat, COUNT(*) FROM t ORDER BY cat' } },
      { id: 'c', text: { ar: 'SELECT COUNT(*) FROM t WHERE cat', en: 'SELECT COUNT(*) FROM t WHERE cat' } },
      { id: 'd', text: { ar: 'SELECT * FROM t GROUP cat', en: 'SELECT * FROM t GROUP cat' } },
    ],
    answer: 'a',
    why: { ar: 'GROUP BY cat مع COUNT(*) يجمّع الصفوف لكل فئة.', en: 'GROUP BY cat with COUNT(*) aggregates per category.' },
  },
  {
    id: 'py10', topic: 'py4e',
    q: { ar: "json.loads('{\"a\": 2}') يعيد:", en: 'json.loads(\'{"a": 2}\') returns:' },
    options: [
      { id: 'a', text: { ar: "{'a': 2}", en: "{'a': 2}" } },
      { id: 'b', text: { ar: '[["a", 2]]', en: '[["a", 2]]' } },
      { id: 'c', text: { ar: 'سلسلة نصية', en: 'a string' } },
      { id: 'd', text: { ar: 'None', en: 'None' } },
    ],
    answer: 'a',
    why: { ar: 'loads يحوّل نص JSON إلى قاموس بايثون.', en: 'loads parses JSON text into a Python dict.' },
  },
  {
    id: 'py11', topic: 'py4e',
    q: { ar: 'أيها أسرع للبحث المتكرر عن العضوية؟', en: 'Which is fastest for repeated membership checks?' },
    options: [
      { id: 'a', text: { ar: 'set', en: 'set' } },
      { id: 'b', text: { ar: 'list', en: 'list' } },
      { id: 'c', text: { ar: 'tuple', en: 'tuple' } },
      { id: 'd', text: { ar: 'str', en: 'str' } },
    ],
    answer: 'a',
    why: { ar: 'الجدول التجزئي يجعل العضوية O(1) في المتوسط.', en: 'Hashing makes membership O(1) on average.' },
  },
  {
    id: 'py12', topic: 'py4e',
    q: { ar: 'في except ValueError as e: ماذا يخزن e؟', en: 'In except ValueError as e, what is e?' },
    options: [
      { id: 'a', text: { ar: 'نسخة الاستثناء المرفوع', en: 'The raised exception instance' } },
      { id: 'b', text: { ar: 'سلسلة ثابتة', en: 'A fixed string' } },
      { id: 'c', text: { ar: 'رقم السطر فقط', en: 'Just a line number' } },
      { id: 'd', text: { ar: 'لا شيء', en: 'Nothing' } },
    ],
    answer: 'a',
    why: { ar: 'as يربط كائن الاستثناء لفحص رسالته.', en: 'as binds the exception object for inspection.' },
  },
  {
    id: 'py13', topic: 'py4e',
    q: { ar: 'دالة بلا return صريح تعيد:', en: 'A function without an explicit return returns:' },
    options: [
      { id: 'a', text: { ar: 'None', en: 'None' } },
      { id: 'b', text: { ar: '0', en: '0' } },
      { id: 'c', text: { ar: 'سلسلة فارغة', en: 'An empty string' } },
      { id: 'd', text: { ar: 'خطأ', en: 'An error' } },
    ],
    answer: 'a',
    why: { ar: 'بايثون تعيد None ضمنيًا.', en: 'Python implicitly returns None.' },
  },
  {
    id: 'py14', topic: 'py4e',
    q: { ar: 'أيها يكسر تجريد الطبقات في بنية ثلاثية؟', en: 'Which violates layering in a three-tier design?' },
    options: [
      { id: 'a', text: { ar: 'استدعاء طبقة البيانات من طبقة الواجهة مباشرة', en: 'The UI layer calling the data layer directly' } },
      { id: 'b', text: { ar: 'مرور المنطق عبر الواجهات المعرّفة', en: 'Logic flowing through declared interfaces' } },
      { id: 'c', text: { ar: 'استقلال طبقة البيانات عن الواجهة', en: 'Data layer independent of UI' } },
      { id: 'd', text: { ar: 'اختبار كل طبقة على حدة', en: 'Testing each layer separately' } },
    ],
    answer: 'a',
    why: { ar: 'القفز فوق الطبقة الوسيطة يكسر قاعدة الطبقات.', en: 'Skipping the middle tier breaks the layering rule.' },
  },
  {
    id: 'py15', topic: 'py4e',
    q: { ar: 'urllib.parse يُستخدم لـ:', en: 'urllib.parse is used to:' },
    options: [
      { id: 'a', text: { ar: 'تفكيك وتركيب مكونات الروابط بأمان', en: 'Safely decompose and compose URL components' } },
      { id: 'b', text: { ar: 'رسم المخططات', en: 'Plot charts' } },
      { id: 'c', text: { ar: 'ضغط الملفات', en: 'Compress files' } },
      { id: 'd', text: { ar: 'تحليل XML', en: 'Parse XML' } },
    ],
    answer: 'a',
    why: { ar: 'parse يتعامل مع بنية الروابط لا نقل البيانات.', en: 'parse handles URL structure, not transport.' },
  },
  {
    id: 'py16', topic: 'py4e',
    q: { ar: 'SELECT مع JOIN بين جدولين يفعل:', en: 'A SELECT with a JOIN across two tables:' },
    options: [
      { id: 'a', text: { ar: 'يدمج الصفوف المتطابقة حسب شرط الربط', en: 'Combines matching rows per the join condition' } },
      { id: 'b', text: { ar: 'يدمج الجدولين عموديًا كاملين', en: 'Stacks both tables fully' } },
      { id: 'c', text: { ar: 'يحذف الجدول الثاني', en: 'Drops the second table' } },
      { id: 'd', text: { ar: 'يعيد جداءً دائمًا بلا شرط', en: 'Always returns an unconditional product' } },
    ],
    answer: 'a',
    why: { ar: 'JOIN يربط الصفوف على المفتاح المشترك.', en: 'JOIN pairs rows on the shared key.' },
  },
  {
    id: 'py17', topic: 'py4e',
    q: { ar: 'f-strings: f"{2+3=}" تطبع:', en: 'The f-string f"{2+3=}" prints:' },
    options: [
      { id: 'a', text: { ar: '2+3=5', en: '2+3=5' } },
      { id: 'b', text: { ar: '5', en: '5' } },
      { id: 'c', text: { ar: '2+3', en: '2+3' } },
      { id: 'd', text: { ar: 'خطأ', en: 'an error' } },
    ],
    answer: 'a',
    why: { ar: 'علامة = داخل f-string تطبع التعبير ونتيجته معًا.', en: 'The = specifier prints the expression and its value.' },
  },
  {
    id: 'py18', topic: 'py4e',
    q: { ar: 'أي حلقة تقرأ الملف سطرًا سطرًا وتتجاهل الفارغة؟', en: 'Which loop reads lines while skipping blanks?' },
    options: [
      { id: 'a', text: { ar: 'for line in f: line = line.strip(); if not line: continue', en: 'for line in f: line = line.strip(); if not line: continue' } },
      { id: 'b', text: { ar: 'for ch in f.read(): print(ch)', en: 'for ch in f.read(): print(ch)' } },
      { id: 'c', text: { ar: 'while f.readline() != None:', en: 'while f.readline() != None:' } },
      { id: 'd', text: { ar: 'for line in f.split():', en: 'for line in f.split():' } },
    ],
    answer: 'a',
    why: { ar: 'التكرار المباشر على الملف مع strip وحارس continue.', en: 'Iterate the file, strip each line, and guard with continue.' },
  },
  {
    id: 'py19', topic: 'py4e',
    q: { ar: 'dict comprehension {w: len(w) for w in ["a","bb"]} يعطي:', en: '{w: len(w) for w in ["a","bb"]} yields:' },
    options: [
      { id: 'a', text: { ar: "{'a': 1, 'bb': 2}", en: "{'a': 1, 'bb': 2}" } },
      { id: 'b', text: { ar: "{'a': 'bb'}", en: "{'a': 'bb'}" } },
      { id: 'c', text: { ar: '[1, 2]', en: '[1, 2]' } },
      { id: 'd', text: { ar: "{'a', 'bb'}", en: "{'a', 'bb'}" } },
    ],
    answer: 'a',
    why: { ar: 'كل كلمة مفتاح وقيمته طولها.', en: 'Each word maps to its length.' },
  },
  {
    id: 'py20', topic: 'py4e',
    q: { ar: 'أيها يخزن عناصر فريدة بلا ترتيب مضمون؟', en: 'Which stores unique elements with no guaranteed order?' },
    options: [
      { id: 'a', text: { ar: 'set', en: 'set' } },
      { id: 'b', text: { ar: 'list', en: 'list' } },
      { id: 'c', text: { ar: 'dict', en: 'dict' } },
      { id: 'd', text: { ar: 'tuple', en: 'tuple' } },
    ],
    answer: 'a',
    why: { ar: 'المجموعة تزيل التكرار ولا تضمن الترتيب.', en: 'A set deduplicates with no guaranteed order.' },
  },
  {
    id: 'sw1', topic: 'swe',
    q: { ar: 'في Git: أي أمر يدمج فرعًا في الفرع الحالي؟', en: 'In Git, which command merges a branch into the current one?' },
    options: [
      { id: 'a', text: { ar: 'git merge <branch>', en: 'git merge <branch>' } },
      { id: 'b', text: { ar: 'git clone <branch>', en: 'git clone <branch>' } },
      { id: 'c', text: { ar: 'git push <branch>', en: 'git push <branch>' } },
      { id: 'd', text: { ar: 'git init <branch>', en: 'git init <branch>' } },
    ],
    answer: 'a',
    why: { ar: 'merge يدمج الفرع المحدد في فرعك الحالي.', en: 'merge folds the named branch into the current one.' },
  },
  {
    id: 'sw2', topic: 'swe',
    q: { ar: 'اختبار فشل أولًا ثم نجح بعد الإصلاح — قيمته؟', en: 'A test that failed first, then passed after the fix — its value?' },
    options: [
      { id: 'a', text: { ar: 'حماية من انحدار الخطأ نفسه', en: 'Regression protection against that exact bug' } },
      { id: 'b', text: { ar: 'لا قيمة بعد نجاحه', en: 'No value once green' } },
      { id: 'c', text: { ar: 'يستبدل مراجعة الكود', en: 'It replaces code review' } },
      { id: 'd', text: { ar: 'دليل على بطء CI', en: 'Evidence of slow CI' } },
    ],
    answer: 'a',
    why: { ar: 'الاختبارات الخضراء تحرس السلوك المُصلح ضد الانحدار.', en: 'Green tests guard fixed behaviour against regressions.' },
  },
  {
    id: 'sw3', topic: 'swe',
    q: { ar: 'أي عادة تخفض خطر تسريب الأسرار في المستودع؟', en: 'Which habit reduces secret-leak risk in a repo?' },
    options: [
      { id: 'a', text: { ar: 'مفاتيح في متغيرات بيئة خارج المستودع', en: 'Keys in environment variables outside the repo' } },
      { id: 'b', text: { ar: 'كتابتها في README بترميز base64', en: 'Base64-encoding them in the README' } },
      { id: 'c', text: { ar: 'تغيير اسم ملف الأسرار أسبوعيًا', en: 'Renaming the secrets file weekly' } },
      { id: 'd', text: { ar: 'حذفها من آخر commit فقط', en: 'Removing them from the latest commit only' } },
    ],
    answer: 'a',
    why: { ar: 'تاريخ Git كامل؛ الحذف السطحي لا يمحو شيئًا، والمتغيرات البيئية لا تدخل المستودع.', en: 'Git history persists; surface deletion erases nothing, env vars never enter the repo.' },
  },
  {
    id: 'sw4', topic: 'swe',
    q: { ar: 'ما الذي تقيسه تغطية الاختبار؟', en: 'What does test coverage measure?' },
    options: [
      { id: 'a', text: { ar: 'نسبة الكود التي نفّذتها الاختبارات', en: 'The share of code executed by the tests' } },
      { id: 'b', text: { ar: 'عدد العيوب لكل ألف سطر', en: 'Defects per KLOC' } },
      { id: 'c', text: { ar: 'سرعة خط أنابيب CI', en: 'CI pipeline speed' } },
      { id: 'd', text: { ar: 'نسبة المواصفات المكتملة', en: 'Spec completeness' } },
    ],
    answer: 'a',
    why: { ar: 'التغطية مقياس تنفيذ لا صحة — عالية لا تعني خلوًا من العيوب.', en: 'Coverage is an execution metric, not correctness.' },
  },
  {
    id: 'sw5', topic: 'swe',
    q: { ar: 'خط أنابيب CI يفشل على PR — ما التصرف الصحيح؟', en: 'CI fails on a PR — the right move?' },
    options: [
      { id: 'a', text: { ar: 'إصلاح الفشل أو شرحه قبل الدمج', en: 'Fix or explain the failure before merging' } },
      { id: 'b', text: { ar: 'الدمج مع تجاوز الفحص', en: 'Merge overriding the check' } },
      { id: 'c', text: { ar: 'تعطيل الاختبار المسبب', en: 'Disable the failing test' } },
      { id: 'd', text: { ar: 'إعادة التشغيل حتى يمر', en: 'Re-run until green' } },
    ],
    answer: 'a',
    why: { ar: 'البوابة الحمراء تعني عدم الجاهزية؛ تجاوزها يهدم ثقة الشبكة.', en: 'A red gate means not ready; overriding it erodes trust.' },
  },
  {
    id: 'sw6', topic: 'swe',
    q: { ar: 'في MoSCoW: أي مجموعة تُضمَن أولًا؟', en: 'In MoSCoW, which group is guaranteed first?' },
    options: [
      { id: 'a', text: { ar: 'Must have', en: 'Must have' } },
      { id: 'b', text: { ar: 'Should have', en: 'Should have' } },
      { id: 'c', text: { ar: 'Could have', en: 'Could have' } },
      { id: 'd', text: { ar: "Won't have", en: "Won't have" } },
    ],
    answer: 'a',
    why: { ar: 'Must هي الحد الأدنى للإطلاق.', en: 'Musts define the minimum viable release.' },
  },
  {
    id: 'sw7', topic: 'swe',
    q: { ar: 'أي مقياس DORA يقيس سرعة الاسترجاع بعد حادث؟', en: 'Which DORA metric measures recovery speed after an incident?' },
    options: [
      { id: 'a', text: { ar: 'زمن استعادة الخدمة (MTTR)', en: 'Time to restore service (MTTR)' } },
      { id: 'b', text: { ar: 'تكرار النشر', en: 'Deployment frequency' } },
      { id: 'c', text: { ar: 'نسبة التغييرات الفاشلة', en: 'Change failure rate' } },
      { id: 'd', text: { ar: 'زمن الدورة', en: 'Lead time' } },
    ],
    answer: 'a',
    why: { ar: 'MTTR هو زمن العودة للخدمة بعد الحادث.', en: 'MTTR is time-to-restore after an incident.' },
  },
  {
    id: 'sw8', topic: 'swe',
    q: { ar: 'التماسك العالي والاقتران المنخفض يعنيان:', en: 'High cohesion and low coupling mean:' },
    options: [
      { id: 'a', text: { ar: 'وحدة تغلف مسؤولية واحدة وتعتمد على غيرها أقل ما يمكن', en: 'A module owns one responsibility and depends as little as possible on others' } },
      { id: 'b', text: { ar: 'وحدة كبيرة تتكفل بكل شيء', en: 'One big module doing everything' } },
      { id: 'c', text: { ar: 'اعتمادًا كثيفًا لضمان الترابط', en: 'Dense dependencies to guarantee linkage' } },
      { id: 'd', text: { ar: 'طبقات بلا واجهات', en: 'Layers without interfaces' } },
    ],
    answer: 'a',
    why: { ar: 'هذا تعريف جودة التصميم المعماري الأساسية.', en: 'The core architectural quality definition.' },
  },
  {
    id: 'sw9', topic: 'swe',
    q: { ar: 'اختبار القبول يتحقق بالأساس من:', en: 'Acceptance testing primarily verifies:' },
    options: [
      { id: 'a', text: { ar: 'مطابقة السلوك لقصص المستخدم المتفق عليها', en: 'Behaviour matches the agreed user stories' } },
      { id: 'b', text: { ar: 'جمال تنسيق الكود', en: 'Code is nicely formatted' } },
      { id: 'c', text: { ar: 'أداء قاعدة البيانات فقط', en: 'Only database performance' } },
      { id: 'd', text: { ar: 'أسماء المتغيرات', en: 'Variable naming' } },
    ],
    answer: 'a',
    why: { ar: 'القبول يقيس الموافقة التعاقدية على المتطلبات.', en: 'Acceptance checks contractual agreement with requirements.' },
  },
  {
    id: 'sw10', topic: 'swe',
    q: { ar: 'أي علامة تدل على دين تقني متراكم؟', en: 'Which signals accumulated technical debt?' },
    options: [
      { id: 'a', text: { ar: 'مناطق معروفة لا يجرؤ أحد على لمسها دون اختبارات', en: 'Areas nobody dares touch without tests' } },
      { id: 'b', text: { ar: 'عدد نجوم GitHub', en: 'GitHub stars' } },
      { id: 'c', text: { ar: 'طول README', en: 'README length' } },
      { id: 'd', text: { ar: 'عدد الفروع القديمة فقط', en: 'Only stale branch count' } },
    ],
    answer: 'a',
    why: { ar: 'الخوف من التعديل بلا شبكة اختبارات علامة دين كلاسيكية.', en: 'Fear of change without a test net is classic debt.' },
  },
  {
    id: 'sw11', topic: 'swe',
    q: { ar: 'أفضل وصف لاختبار الشخصنة (characterization):', en: 'Best description of a characterization test:' },
    options: [
      { id: 'a', text: { ar: 'يثبّت السلوك الحالي كما هو قبل أي إعادة هيكلة', en: 'Pins current behaviour as-is before refactoring' } },
      { id: 'b', text: { ar: 'يختبر السلوك المثالي المستقبلي', en: 'Tests ideal future behaviour' } },
      { id: 'c', text: { ar: 'يستبدل التوثيق', en: 'Replaces documentation' } },
      { id: 'd', text: { ar: 'يقيس الأداء', en: 'Measures performance' } },
    ],
    answer: 'a',
    why: { ar: 'شبكة إعادة الهيكلة تبدأ من توثيق الواقع لا المثال.', en: 'A refactoring net starts by pinning reality, not ideals.' },
  },
  {
    id: 'sw12', topic: 'swe',
    q: { ar: 'أي ترتيب صحيح لدورة السبرنت الصحية؟', en: 'Which is the healthy order inside a sprint?' },
    options: [
      { id: 'a', text: { ar: 'تخطيط → تنفيذ → مراجعة → استعراض بأثر رجعي', en: 'Plan → build → review → retrospective' } },
      { id: 'b', text: { ar: 'استعراض → تخطيط → نشر → تخطيط', en: 'Review → plan → ship → plan' } },
      { id: 'c', text: { ar: 'نشر → تخطيط → تنفيذ', en: 'Ship → plan → build' } },
      { id: 'd', text: { ar: 'لا ترتيب ثابت', en: 'No fixed order' } },
    ],
    answer: 'a',
    why: { ar: 'الدورة القياسية تنتهي بمراجعة ثم استخلاص.', en: 'The standard loop ends with review then retrospective.' },
  },
  {
    id: 'sw13', topic: 'swe',
    q: { ar: 'قصة مستخدم جيدة بصيغة INVEST هي:', en: 'A good INVEST story is:' },
    options: [
      { id: 'a', text: { ar: 'مستقلة وقابلة للتفاوض وذات قيمة وقابلة للتقدير وصغيرة وقابلة للاختبار', en: 'Independent, negotiable, valuable, estimable, small, testable' } },
      { id: 'b', text: { ar: 'طويلة وشاملة لكل الفريق', en: 'Long and team-wide' } },
      { id: 'c', text: { ar: 'مهمة تقنية بلا قيمة للمستخدم', en: 'A technical task with no user value' } },
      { id: 'd', text: { ar: 'غير قابلة للاختبار حتى النهاية', en: 'Untestable until the end' } },
    ],
    answer: 'a',
    why: { ar: 'INVEST اختصار صفات القصة الجاهزة للتنفيذ.', en: 'INVEST summarises implementation-ready story traits.' },
  },
  {
    id: 'sw14', topic: 'swe',
    q: { ar: 'أيها نمط تدفق بيانات لا نمط طبقات؟', en: 'Which is a dataflow style, not a layering style?' },
    options: [
      { id: 'a', text: { ar: 'أنابيب ومرشحات (pipes-and-filters)', en: 'pipes-and-filters' } },
      { id: 'b', text: { ar: 'الطبقات الثلاث', en: 'three-tier layering' } },
      { id: 'c', text: { ar: 'MVC', en: 'MVC' } },
      { id: 'd', text: { ar: 'عميل-خادم', en: 'client-server' } },
    ],
    answer: 'a',
    why: { ar: 'المجرى يمرر مخرجات كل مرحلة إلى مدخل التالية.', en: 'Pipes pass one stage output to the next stage input.' },
  },
  {
    id: 'sw15', topic: 'swe',
    q: { ar: 'علاقة include في حالة الاستخدام تعني:', en: 'A use-case include means:' },
    options: [
      { id: 'a', text: { ar: 'سلوكًا مشتركًا يُنفذ دائمًا ضمن الحالة', en: 'Shared behaviour always executed within the case' } },
      { id: 'b', text: { ar: 'سلوكًا اختياريًا عند تحقق شرط', en: 'Optional behaviour on a condition' } },
      { id: 'c', text: { ar: 'خطأ نظام', en: 'A system error' } },
      { id: 'd', text: { ar: 'مستخدمًا ثانويًا', en: 'A secondary actor' } },
    ],
    answer: 'a',
    why: { ar: 'include إلزامي، extend شرطي.', en: 'include is mandatory; extend is conditional.' },
  },
  {
    id: 'sw16', topic: 'swe',
    q: { ar: 'أيها إجراء تحصين لسلسلة التوريد؟', en: 'Which is a supply-chain hardening step?' },
    options: [
      { id: 'a', text: { ar: 'تثبيت إصدارات الحزم والتحقق من بصماتها', en: 'Pinning dependency versions and verifying hashes' } },
      { id: 'b', text: { ar: 'ترقية كل شيء يوميًا بلا اختبار', en: 'Upgrading everything daily untested' } },
      { id: 'c', text: { ar: 'تنزيل حزم من مواقع عشوائية', en: 'Downloading wheels from random sites' } },
      { id: 'd', text: { ar: 'تعطيل ملف القفل', en: 'Disabling the lockfile' } },
    ],
    answer: 'a',
    why: { ar: 'التثبيت مع التحقق يمنع استبدال الحزم.', en: 'Pinning plus verification blocks package substitution.' },
  },
  {
    id: 'sw17', topic: 'swe',
    q: { ar: 'اختبار الصندوق الأبيض يُصمم من:', en: 'White-box tests are designed from:' },
    options: [
      { id: 'a', text: { ar: 'بنية الكود الداخلية ومساراته', en: 'The internal structure and paths of the code' } },
      { id: 'b', text: { ar: 'المواصفة وحدها', en: 'The spec alone' } },
      { id: 'c', text: { ar: 'شكاوى المستخدمين', en: 'User complaints' } },
      { id: 'd', text: { ar: 'تقارير الأداء', en: 'Performance reports' } },
    ],
    answer: 'a',
    why: { ar: 'الأبيض يرى الداخل؛ الأسود يرى العقد الخارجي.', en: 'White-box sees inside; black-box sees the contract.' },
  },
  {
    id: 'sw18', topic: 'swe',
    q: { ar: 'أيها "إيجابي كاذب" في اختبار؟', en: 'Which is a false-positive test result?' },
    options: [
      { id: 'a', text: { ar: 'اختبار ينجح والسلوك معيب', en: 'A test passes while behaviour is broken' } },
      { id: 'b', text: { ar: 'اختبار يفشل والسلوك سليم', en: 'A test fails while behaviour is fine' } },
      { id: 'c', text: { ar: 'اختبار بطيء', en: 'A slow test' } },
      { id: 'd', text: { ar: 'اختبار بلا تأكيدات', en: 'A test with no asserts' } },
    ],
    answer: 'a',
    why: { ar: 'الإيجابي الكاذب إشارة سلامة زائفة — أخطر من فشل صريح.', en: 'A false positive is a fake green — more dangerous than a clean failure.' },
  },
  {
    id: 'sw19', topic: 'swe',
    q: { ar: 'أفضل سبب لتوثيق ADR لكل قرار معماري:', en: 'The best reason for ADRs per architecture decision:' },
    options: [
      { id: 'a', text: { ar: 'حفظ السياق والبدائل حتى لا يُعاد الجدل بلا أرضية', en: 'Preserving context and alternatives so the debate is not re-litigated blindly' } },
      { id: 'b', text: { ar: 'زخرفة للوثائق', en: 'Documentation decoration' } },
      { id: 'c', text: { ar: 'متطلب من CI', en: 'A CI requirement' } },
      { id: 'd', text: { ar: 'للتدريب الداخلي فقط', en: 'Only for onboarding' } },
    ],
    answer: 'a',
    why: { ar: 'ADR يحفظ "لماذا" لا "ماذا" فقط.', en: 'An ADR keeps the why, not just the what.' },
  },
  {
    id: 'sw20', topic: 'swe',
    q: { ar: 'مراجعة الكود الفعالة تركز أولًا على:', en: 'Effective code review focuses first on:' },
    options: [
      { id: 'a', text: { ar: 'الصحة والأمان وقابلية الصيانة لا الأسلوب الشخصي', en: 'Correctness, security, and maintainability over personal style' } },
      { id: 'b', text: { ar: 'علامات الجدولة مقابل المسافات', en: 'Tabs vs spaces' } },
      { id: 'c', text: { ar: 'عدد الأسطر', en: 'Line count' } },
      { id: 'd', text: { ar: 'أسماء الفروع', en: 'Branch names' } },
    ],
    answer: 'a',
    why: { ar: 'الأسلوب يُتَّمِم آليًا؛ العقل يراجع المعنى.', en: 'Style is automated; humans review meaning.' },
  },
  {
    id: 'sw21', topic: 'swe',
    q: { ar: 'أيها مقبول في رسالة commit؟', en: 'Which belongs in a commit message?' },
    options: [
      { id: 'a', text: { ar: 'غرض التغيير وسببه بإيجاز', en: 'The change purpose and reason, briefly' } },
      { id: 'b', text: { ar: 'كل محتويات الملف', en: 'The full file contents' } },
      { id: 'c', text: { ar: 'كلمات مرور مؤقتة', en: 'Temporary credentials' } },
      { id: 'd', text: { ar: 'لا شيء — رسالة فارغة', en: 'Nothing — an empty message' } },
    ],
    answer: 'a',
    why: { ar: 'التاريخ يُقرأ بعد أشهر؛ الغرض والسبب هما الناقص.', en: 'History is read months later; purpose and reason are the missing context.' },
  },
  {
    id: 'sw22', topic: 'swe',
    q: { ar: 'في الاختبارات: AAA تعني:', en: 'In testing, AAA stands for:' },
    options: [
      { id: 'a', text: { ar: 'ترتيب، فعل، تأكيد (Arrange, Act, Assert)', en: 'Arrange, Act, Assert' } },
      { id: 'b', text: { ar: 'تحليل، معمارية، قبول', en: 'Analysis, Architecture, Acceptance' } },
      { id: 'c', text: { ar: 'أتمتة، تجميع، اعتماد', en: 'Automate, Build, Approve' } },
      { id: 'd', text: { ar: 'لا معيار شائع', en: 'No common standard' } },
    ],
    answer: 'a',
    why: { ar: 'هيكل الاختبار الوحدوي القياسي.', en: 'The canonical unit-test structure.' },
  },
  {
    id: 'ai1', topic: 'ai-era',
    q: { ar: 'في عصر الذكاء الاصطناعي، ما الذي يبقى مسؤولية المهندس؟', en: 'In the AI era, what remains the engineer responsibility?' },
    options: [
      { id: 'a', text: { ar: 'التحقق من الصحة وقرار الشحن النهائي', en: 'Verifying correctness and owning the ship decision' } },
      { id: 'b', text: { ar: 'لا شيء — النموذج يتحقق ذاتيًا', en: 'Nothing — the model self-verifies' } },
      { id: 'c', text: { ar: 'كتابة كل حرف يدويًا', en: 'Typing every character by hand' } },
      { id: 'd', text: { ar: 'إخفاء استخدام الأدوات', en: 'Hiding tool usage' } },
    ],
    answer: 'a',
    why: { ar: 'المهندس يبقى نقطة التحقق ومالك النتيجة (الفصل 13).', en: 'The engineer stays the verification point and outcome owner (ch13).' },
  },
  {
    id: 'ai2', topic: 'ai-era',
    q: { ar: 'ماذا ينبغي أن يضمّه ملف سياق مثل AGENTS.md؟', en: 'What should a context file like AGENTS.md contain?' },
    options: [
      { id: 'a', text: { ar: 'ما لا يستطيع الوكيل استنتاجه: القرارات الحاكمة والقيود', en: 'What the agent cannot infer: governing decisions and constraints' } },
      { id: 'b', text: { ar: 'كل شيء عن المشروع بأقصى تفصيل', en: 'Everything about the project in maximal detail' } },
      { id: 'c', text: { ar: 'كلمات المرور للوصول السريع', en: 'Credentials for quick access' } },
      { id: 'd', text: { ar: 'سجل محادثات يومي', en: 'A daily chat log' } },
    ],
    answer: 'a',
    why: { ar: 'السياق الجيد حاسم ومختصر: ما يغيّر قرارًا فعليًا.', en: 'Good context is decisive and brief: content that changes real decisions.' },
  },
  {
    id: 'ai3', topic: 'ai-era',
    q: { ar: 'في هندسة الحلقة: ما الذي يغلق الحلقة؟', en: 'In loop engineering, what closes the loop?' },
    options: [
      { id: 'a', text: { ar: 'بوابة تحقق آلية (اختبارات/مدقق) تتغذى عليها الجولة التالية', en: 'An automated check gate (tests/linter) feeding the next round' } },
      { id: 'b', text: { ar: 'إعادة صياغة الطلب', en: 'Rephrasing the prompt' } },
      { id: 'c', text: { ar: 'زيادة حجم السياق', en: 'Growing the context' } },
      { id: 'd', text: { ar: 'تشغيل الجولات بالتوازي', en: 'Parallel rounds' } },
    ],
    answer: 'a',
    why: { ar: 'الحلقة تُغلق بإشارة موضوعية قابلة للتكرار حتى الاخضرار.', en: 'The loop closes on an objective, repeatable signal until green.' },
  },
  {
    id: 'ai4', topic: 'ai-era',
    q: { ar: 'التطوير بالموصفات (spec-driven) يعني:', en: 'Spec-driven development means:' },
    options: [
      { id: 'a', text: { ar: 'كتابة السلوك المتوقع كمعيار قابل للفحص قبل توليد الكود', en: 'Writing expected behaviour as checkable criteria before generating code' } },
      { id: 'b', text: { ar: 'الاعتماد على ذاكرة النموذج', en: 'Trusting the model memory' } },
      { id: 'c', text: { ar: 'حذف الاختبارات للسرعة', en: 'Deleting tests to move faster' } },
      { id: 'd', text: { ar: 'التوثيق بعد الشحن فقط', en: 'Documenting only after shipping' } },
    ],
    answer: 'a',
    why: { ar: 'المواصفة القابلة للفحص تحوّل النية إلى بوابة قبول.', en: 'A checkable spec turns intent into an acceptance gate.' },
  },
  {
    id: 'ai5', topic: 'ai-era',
    q: { ar: 'متى توثّق أن مخرجًا ولّده الذكاء الاصطناعي؟', en: 'When should AI-generated output be documented as such?' },
    options: [
      { id: 'a', text: { ar: 'دائمًا، ضمن سجل المصادر وسلامة المنشأ', en: 'Always — in a provenance/source log' } },
      { id: 'b', text: { ar: 'فقط عند الفشل', en: 'Only when it fails' } },
      { id: 'c', text: { ar: 'لا حاجة لذلك', en: 'Never needed' } },
      { id: 'd', text: { ar: 'عند طلب العميل فقط', en: 'Only if a client asks' } },
    ],
    answer: 'a',
    why: { ar: 'سلامة المنشأ شرط ثقة وتدقيق (الفصل 13).', en: 'Provenance is a trust and audit requirement (ch13).' },
  },
  {
    id: 'ai6', topic: 'ai-era',
    q: { ar: 'خطر "الإفراط في الثقة" مع مساعد AI يعالجه:', en: 'The over-trust risk with AI assistants is treated by:' },
    options: [
      { id: 'a', text: { ar: 'مراجعة بشرية إلزامية عند بوابة الشحن', en: 'Mandatory human review at the ship gate' } },
      { id: 'b', text: { ar: 'رفع درجة الحرارة', en: 'Raising the temperature' } },
      { id: 'c', text: { ar: 'نموذج أكبر فقط', en: 'Only a bigger model' } },
      { id: 'd', text: { ar: 'ثقة كاملة بعد أول نجاح', en: 'Full trust after the first success' } },
    ],
    answer: 'a',
    why: { ar: 'بوابة المراجعة البشرية هي ضامن المساءلة.', en: 'The human gate is the accountability guarantee.' },
  },
  {
    id: 'ai7', topic: 'ai-era',
    q: { ar: 'ما موقف المهندس من هلوسة المساعد؟', en: 'What is the engineer stance toward assistant hallucination?' },
    options: [
      { id: 'a', text: { ar: 'التحقق من كل ادعاء عبر التنفيذ أو مصدر', en: 'Verify every claim by running it or citing a source' } },
      { id: 'b', text: { ar: 'تجاهلها إن كانت واثقة الصياغة', en: 'Ignore it if confidently worded' } },
      { id: 'c', text: { ar: 'الاعتذار عن استخدام الأداة', en: 'Apologise for using the tool' } },
      { id: 'd', text: { ar: 'تفويض التحقق للنموذج نفسه', en: 'Delegate verification to the model' } },
    ],
    answer: 'a',
    why: { ar: 'الثقة تأتي من التنفيذ والمصدر لا من الطلاقة.', en: 'Trust comes from execution and sources, not fluency.' },
  },
  {
    id: 'ai8', topic: 'ai-era',
    q: { ar: 'في CI المعتمد على الوكلاء: ما البوابة التي لا تُسقط أبدًا؟', en: 'In agent-assisted CI, which gate is never skipped?' },
    options: [
      { id: 'a', text: { ar: 'اختبارات التكامل الآلية', en: 'Automated integration tests' } },
      { id: 'b', text: { ar: 'عدد الجولات', en: 'Round count' } },
      { id: 'c', text: { ar: 'حجم النموذج', en: 'Model size' } },
      { id: 'd', text: { ar: 'طول المحادثة', en: 'Conversation length' } },
    ],
    answer: 'a',
    why: { ar: 'البوابات الآلية هي العقد؛ الجولات مجرد وسيلة.', en: 'Automated gates are the contract; rounds are mere means.' },
  },
  {
    id: 'ai9', topic: 'ai-era',
    q: { ar: 'ما أفضل معيار قبول لمهمة موصولة بوكيل AI؟', en: 'The best acceptance criterion for an AI-agent task:' },
    options: [
      { id: 'a', text: { ar: 'اختبار آلي محدد يمر، أو مخرج مقارن محدد', en: 'A specific automated test passes, or a specific comparable output' } },
      { id: 'b', text: { ar: 'إقناع الجواب شكليًا', en: 'The answer looks convincing' } },
      { id: 'c', text: { ar: 'إعجابي بالأسلوب', en: 'I like the style' } },
      { id: 'd', text: { ar: 'انتهاء الوقت', en: 'Time ran out' } },
    ],
    answer: 'a',
    why: { ar: 'المعيار القابل للقياس هو ما يجعل الحلقة قابلة للإغلاق.', en: 'A measurable criterion is what closes the loop.' },
  },
  {
    id: 'ai10', topic: 'ai-era',
    q: { ar: 'ضغط السياق (context compression) يفعل غالبًا:', en: 'Context compression typically:' },
    options: [
      { id: 'a', text: { ar: 'يحفظ القرارات الحاكمة ويلغي التفاصيل القابلة للاستنتاج', en: 'Keeps governing decisions, drops inferable detail' } },
      { id: 'b', text: { ar: 'يحذف القرارات ويحفظ الأكواد', en: 'Drops decisions, keeps code dumps' } },
      { id: 'c', text: { ar: 'يزيد التكلفة بلا فائدة', en: 'Adds cost for nothing' } },
      { id: 'd', text: { ar: 'ممنوع تقنيًا', en: 'Technically impossible' } },
    ],
    answer: 'a',
    why: { ar: 'السياق الفعال = قرارات وقيود، لا كل شيء.', en: 'Effective context = decisions + constraints, not everything.' },
  },
];

/**
 * Balanced draw quotas per topic for the standard 16-question exam
 * (EXAM-002): 16 × 20/52 ≈ 6.2 → 6 PY4E, 16 × 22/52 ≈ 6.8 → 7 SWE,
 * 16 × 10/52 ≈ 3.1 → 3 AI-era (6 + 7 + 3 = 16). Deterministic quotas with
 * random selection inside each topic.
 */
const DRAW_QUOTAS: Record<ExamItem['topic'], number> = { py4e: 6, swe: 7, 'ai-era': 3 };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Draw `count` distinct items with a balanced topic distribution and zero
 * duplicates (per-attempt variant, R-GRD-04 / EXAM-002). Quotas are only
 * applied for the canonical 16-question draw; any other count falls back to
 * a plain uniform sample without replacement.
 */
export function drawExamItems(count: number): ExamItem[] {
  if (count !== 16) {
    return shuffle(EXAM_ITEMS).slice(0, Math.min(count, EXAM_ITEMS.length));
  }
  const byTopic = new Map<ExamItem['topic'], ExamItem[]>();
  for (const item of EXAM_ITEMS) {
    const list = byTopic.get(item.topic) ?? [];
    list.push(item);
    byTopic.set(item.topic, list);
  }
  const out: ExamItem[] = [];
  for (const [topic, quota] of Object.entries(DRAW_QUOTAS) as [ExamItem['topic'], number][]) {
    out.push(...shuffle(byTopic.get(topic) ?? []).slice(0, quota));
  }
  // Defensive: if a topic pool ever underfills, top up from the remainder.
  if (out.length < count) {
    const taken = new Set(out.map((i) => i.id));
    out.push(...shuffle(EXAM_ITEMS.filter((i) => !taken.has(i.id))).slice(0, count - out.length));
  }
  return shuffle(out.slice(0, count));
}
