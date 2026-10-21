#!/usr/bin/env python3
"""R-SRC-01: build structured curriculum/sources/*.toc.json for all 4 books.

- PY4E/SWE/MLS: TOC entries cross-checked against PDF text (front matter dumps +
  chapter-heading page detection inside this script).
- D2L: structured from the PDF's embedded outline (D2L.raw_toc.json).

Page conventions: pdfPage is 1-based; bookPage is the number printed in the book.
"""
import fitz, json, re, unicodedata

SRC = "/home/z/my-project/upload"
OUT = "/home/z/my-project/curriculum/sources"

def detect_pages(pdf_path, queries):
    """For each heading-ish query, find first PDF page (1-based) whose text contains it."""
    doc = fitz.open(pdf_path)
    pages = {}
    norm = lambda s: re.sub(r"\s+", " ", s)
    for q in queries:
        nq = norm(q)
        for p in range(doc.page_count):
            if nq in norm(doc[p].get_text("text")):
                pages[q] = p + 1
                break
    doc.close()
    return pages

# ---------------------------------------------------------------- PY4E ------
# Chapter/subsection list with BOOK page numbers, extracted from the book's own
# TOC (PDF page 11+), visually verified against the rasterized page.
py4e = {
    "code": "PY4E", "title": "بايثون للجميع (Python for Everybody)",
    "authors": ["Charles Severance (تشارلز سيفيرنس)"],
    "translators": ["Electronics Go منصة الكترونكس غو"],
    "license": "CC BY-NC-SA 3.0 (original) — Arabic edition © Electronics Go 2023, CC BY-NC-SA",
    "page_offset": 10,  # bookPage + 10 = pdfPage
    "chapters": []
}
PY4E_CH = [
    (1, "لماذا نتعلّم البرمجة؟", 2, [
        ("1.1", "الإبداع والحافز", 3), ("1.2", "بنية الحاسوب", 4), ("1.3", "فهم البرمجة", 6),
        ("1.4", "مفردات بايثون وجملُها", 6), ("1.5", "مخاطبة بايثون", 7), ("1.6", "المفسِّر والمترجم", 10),
        ("1.7", "كتابة برنامج", 12), ("1.8", "ما هو البرنامج؟", 12), ("1.9", "المكوّنات الأساسية للبرامج", 14),
        ("1.10", "ما الأخطاء التي يمكن أن نواجهها؟", 15), ("1.11", "التنقيح", 16),
        ("1.12", "رحلة التعلّم", 18), ("1.13", "فهرس المصطلحات", 18), ("1.14", "تمارين", 20)]),
    (2, "المتغيّرات والتعابير والتعليمات", 23, [
        ("2.1", "القيم وأنواع البيانات", 23), ("2.2", "المتغيّرات", 24), ("2.3", "أسماء المتغيّرات والكلمات المفتاحية", 25),
        ("2.4", "التعليمات", 26), ("2.5", "العوامل والمعاملات", 27), ("2.6", "التعابير", 28),
        ("2.7", "ترتيب العمليات", 28), ("2.8", "عامل القسمة الصحيحة (باقي القسمة)", 29),
        ("2.9", "العمليات على السلاسل النصية", 30), ("2.10", "إدخال البيانات من المستخدم", 30),
        ("2.11", "التعليقات", 31), ("2.12", "اختيار أسماء متغيرات سهلة التذكر", 32),
        ("2.13", "التنقيح", 34), ("2.14", "فهرس المصطلحات", 35), ("2.15", "تمارين", 37)]),
    (3, "التنفيذ الشرطي", 39, [
        ("3.1", "التعابير المنطقية", 39), ("3.2", "العوامل المنطقية", 40), ("3.3", "التنفيذ المشروط", 40),
        ("3.4", "التنفيذ البديل", 42), ("3.5", "التسلسل الشرطي", 43), ("3.6", "الشرط المتداخل", 45),
        ("3.7", "الاستثناء باستخدام بنية TRY و EXCEPT", 46), ("3.8", "تجاوز حق التعبيرات المنطقية", 49),
        ("3.9", "التنقيح", 51), ("3.10", "فهرس المصطلحات", 51), ("3.11", "تمارين", 53)]),
    (4, "التوابع", 56, [
        ("4.1", "استدعاء التوابع", 56), ("4.2", "التوابع الجاهزة", 56), ("4.3", "توابع تحويل النوع", 57),
        ("4.4", "التوابع الرياضية", 58), ("4.5", "الأعداد العشوائية", 59), ("4.6", "إضافة توابع جديدة", 61),
        ("4.7", "التعاريف واستخداماتها", 63), ("4.8", "تسلسل التنفيذ", 64), ("4.9", "المعاملات والوسائط", 64),
        ("4.10", "التوابع المُنتجة والتوابع الخالية", 66), ("4.11", "لماذا نستخدم التوابع؟", 67),
        ("4.12", "التنقيح", 68), ("4.13", "فهرس المصطلحات", 69), ("4.14", "تمارين", 70)]),
    (5, "التكرار", 74, [
        ("5.1", "تحديث قيم المتغيرات", 74), ("5.2", "حلقة WHILE", 74), ("5.3", "الحلقات اللانهائية", 75),
        ("5.4", "إنهاء التكرار باستخدام تعليمة CONTINUE", 77), ("5.5", "الحلقات المحددة باستخدام FOR", 78),
        ("5.6", "أنماط كتابة الحلقات", 79), ("5.7", "التنقيح", 83), ("5.8", "فهرس المصطلحات", 83),
        ("5.9", "تمارين", 84)]),
    (6, "السلاسل النصية", 86, [
        ("6.1", "السلسلة النصية سلسلة من المحارف", 86), ("6.2", "الحصول على طول السلسلة النصية باستخدام LEN", 87),
        ("6.3", "التعامل مع محارف السلسلة النصية باستخدام الحلقات", 88), ("6.4", "تجزئة السلاسل النصية", 89),
        ("6.5", "السلاسل النصية غير قابلة للتعديل", 90), ("6.6", "استخدام الحلقات والعدّ", 90),
        ("6.7", "العامل IN", 91), ("6.8", "مقارنة السلاسل النصية", 91), ("6.9", "توابع السلاسل النصية", 92),
        ("6.10", "تحليل السلاسل النصية", 95), ("6.11", "عامل التنسيق", 96), ("6.12", "التنقيح", 97),
        ("6.13", "فهرس المصطلحات", 99), ("6.14", "تمارين", 100)]),
    (7, "الملفات", 102, [
        ("7.1", "الإصرار على التعلم", 102), ("7.2", "فتح الملفات", 103), ("7.3", "ملفات النصوص والأسطر", 104),
        ("7.4", "قراءة الملفات", 105), ("7.5", "البحث خلال ملف", 107), ("7.6", "السماح للمستخدم باختيار الملف", 110),
        ("7.7", "استخدام TRY و EXCEPT و OPEN", 111), ("7.8", "كتابة الملفات", 113),
        ("7.9", "التنقيح", 114), ("7.10", "فهرس المصطلحات", 115), ("7.11", "تمارين", 116)]),
    (8, "القوائم", 119, [
        ("8.1", "القائمة سلسلة من العناصر", 119), ("8.2", "القوائم قابلة للتعديل", 119),
        ("8.3", "المرور على عناصر قائمة", 121), ("8.4", "العمليات على القوائم", 122), ("8.5", "تجزئة القوائم", 122),
        ("8.6", "توابع خاصة بالقوائم", 123), ("8.7", "حذف العناصر", 124), ("8.8", "القوائم والتوابع", 125),
        ("8.9", "القوائم والسلاسل النصية", 127), ("8.10", "التعامل مع الأسطر وملفات القوائم", 128),
        ("8.11", "الكائنات والقيَم", 129), ("8.12", "التسمية البديلة", 131), ("8.13", "وسائط القائمة", 131),
        ("8.14", "التنقيح", 133), ("8.15", "فهرس المصطلحات", 138), ("8.16", "تمارين", 139)]),
    (9, "القواميس", 143, [
        ("9.1", "استخدام القواميس", 143), ("9.2", "العدّ", 145), ("9.3", "القواميس والملفات", 147),
        ("9.4", "الحلقات والقواميس", 149), ("9.5", "التعامل مع النصوص", 150), ("9.6", "التنقيح", 152),
        ("9.7", "فهرس المصطلحات", 153), ("9.8", "تمارين", 154)]),
    (10, "الصفوف", 157, [
        ("10.1", "الصفوف غير قابلة للتعديل", 157), ("10.2", "مقارنة الصفوف", 159), ("10.3", "إسناد الصفوف", 160),
        ("10.4", "القواميس والصفوف", 162), ("10.5", "الإسناد المتعدد مع القواميس", 163),
        ("10.6", "الكلمات الأكثر تكرارًا", 164), ("10.7", "استخدام الصفوف كمفاتيح ضمن القواميس", 166),
        ("10.8", "السلاسل النصية والقوائم والصفوف", 166), ("10.9", "التنقيح", 167),
        ("10.10", "فهرس المصطلحات", 167), ("10.11", "تمارين", 168)]),
    (11, "التعابير النمطية", 172, [
        ("11.1", "مطابقة المحارف", 173), ("11.2", "استخراج البيانات باستخدام التعابير النمطية", 175),
        ("11.3", "تنفيذ عمليتي البحث والاستخراج معًا", 178), ("11.4", "محرف الهروب", 183),
        ("11.5", "ملخص", 184), ("11.6", "معلومات إضافية لمستخدمي نظام UNIX و LINUX", 185),
        ("11.7", "التنقيح", 186), ("11.8", "فهرس المصطلحات", 187), ("11.9", "تمارين", 187)]),
    (12, "البرامج المرتبطة بالشبكات", 190, [
        ("12.1", "بروتوكول نقل النص التشعبي HTTP", 190), ("12.2", "أبسط متصفح ويب في العالم", 191),
        ("12.3", "استعادة صورة عن طريق بروتوكول HTTP", 194), ("12.4", "استعادة صفحات الويب باستخدام مكتبة URLLIB", 198),
        ("12.5", "قراءة الملفات المُشفّرة ثنائيًا باستخدام URLLIB", 199), ("12.6", "تحليل واستخراج البيانات من صفحات HTML", 201),
        ("12.7", "تحليل صفحات HTML باستخدام التعابير النمطية", 201), ("12.8", "تحليل صفحات HTML باستخدام مكتبة BEAUTIFULSOUP", 204),
        ("12.9", "ملاحظات خاصة لمستخدمي أنظمة UNIX أو لينكس", 209), ("12.10", "فهرس المصطلحات", 209),
        ("12.11", "تمارين", 210)]),
    (13, "استخدام خدمات الويب", 213, [
        ("13.1", "لغة التوصيف الموسعة XML", 213), ("13.2", "تحليل نصوص XML", 214),
        ("13.3", "استخدام الحلقات للمرور على العقد", 215), ("13.4", "JSON", 217),
        ("13.5", "تحليل نصوص JSON", 218), ("13.6", "واجهات برمجة التطبيقات", 219),
        ("13.7", "الأمان واستخدام واجهات برمجة التطبيقات", 221), ("13.8", "فهرس المصطلحات", 221),
        ("13.9", "التطبيق الأول: خدمة جوغل للجغرافيا", 222), ("13.10", "التطبيق الثاني: تويتر", 227)]),
    (14, "البرمجة الكائنية التوجه", 235, [
        ("14.1", "إدارة البرامج الكبيرة", 235), ("14.2", "مقدمة", 235), ("14.3", "استخدام الكائنات", 236),
        ("14.4", "البدء مع البرامج", 237), ("14.5", "تقسيم المشكلة", 239), ("14.6", "إنشاء كائن بلغة بايثون", 240),
        ("14.7", "الصنف كنوع بيانات", 243), ("14.8", "دورة حياة الكائن", 244), ("14.9", "تعدد الكائنات", 245),
        ("14.10", "الوراثة", 247), ("14.11", "ملخص", 248), ("14.12", "فهرس المصطلحات", 249)]),
    (15, "قواعد البيانات ولغة SQL", 252, [
        ("15.1", "ما هي قاعدة البيانات؟", 252), ("15.2", "مفاهيم قواعد البيانات", 252),
        ("15.3", "متصفح قاعدة البيانات SQLITE", 253), ("15.4", "إنشاء جدول لقاعدة بيانات", 253),
        ("15.5", "ملخص عن لغة الاستعلام البنيوية SQL", 257), ("15.6", "استكشاف تويتر باستخدام قواعد البيانات", 258),
        ("15.7", "نمذجة البيانات", 266), ("15.8", "برمجة قاعدة بيانات ذات الجداول المتعددة", 268),
        ("15.9", "أنواع المفاتيح الثلاثة", 273), ("15.10", "استخدام عبارة JOIN لاستعادة البيانات", 277),
        ("15.11", "الملخص", 281), ("15.12", "التنقيح", 281), ("15.13", "فهرس المصطلحات", 282)]),
    (16, "العرض المرئي للبيانات", 285, [
        ("16.1", "عرض خريطة باستخدام بيانات جغرافية من غوغل", 285),
        ("16.2", "العرض المرئي للشبكات والارتباطات", 288),
        ("16.3", "تحليل وعرض البيانات الواردة بريديًا", 293)]),
]
for num, title, bpage, subs in PY4E_CH:
    py4e["chapters"].append({
        "id": f"py4e.ch{num}", "number": num, "title": title, "bookPage": bpage,
        "pdfPage": bpage + 10,
        "sections": [{"id": f"py4e.ch{num}.s{sid}", "number": sid, "title": t,
                      "bookPage": bp, "pdfPage": bp + 10} for sid, t, bp in subs]
    })

# ---------------------------------------------------------------- SWE -------
swe = {
    "code": "SWE",
    "title": "Software Engineering: Standing on the Shoulders of Giants — Python Edition",
    "authors": ["Thomas Hastings"],
    "license": "Text/figures CC BY-SA 4.0; code examples MIT — © 2026 Thomas Hastings",
    "url": "https://www.swebook.org/",
    "page_offset": 0,
    "chapters": []
}
SWE_CH = [
    (1, "Introduction", ["1.1 What Is Software Engineering?", "1.2 The Requirements Challenge",
        "1.3 Software Is Intrinsically Complex", "1.4 Defects Are Inevitable",
        "1.5 Balancing Constraints: The Iron Triangle", "1.6 Social Responsibility", "1.7 Conclusion"]),
    (2, "Software Development Processes", ["2.1 Processes and Values Guide Development",
        "2.2 Structuring Teamwork: The Scrum Framework", "2.3 Agile Development: Extreme Programming",
        "2.4 Limitations of Waterfall Processes", "2.5 Levels of Design and Testing: V Processes",
        "2.6 Additional Project Risks", "2.7 Risk Reduction: The Spiral Framework",
        "2.8 Shape Up: Fixed Time, Variable Scope", "2.9 Conclusion"]),
    (3, "User Requirements", ["3.1 What Is a Requirement?", "3.2 Developing Requirements and Software",
        "3.3 Eliciting User Needs", "3.4 Writing Requirements: Stories and Features",
        "3.5 Writing User-Experience Scenarios", "3.6 Clarifying User Goals",
        "3.7 Identifying Security Attacks", "3.8 Conclusion"]),
    (4, "Requirements Analysis", ["4.1 A Checklist Approach", "4.2 Relative Estimation: Iteration Planning",
        "4.3 Structured Group Consensus Estimates", "4.4 Balancing Priorities",
        "4.5 Customer Satisfiers and Dissatisfiers", "4.6 Plan-Driven Estimation Models", "4.7 Conclusion"]),
    (5, "Use Cases", ["5.1 Elements of a Use Case", "5.2 Alternative Flows: Conditional Behaviors",
        "5.3 Writing Use Cases", "5.4 Use-Case Diagrams", "5.5 Relationships between Use Cases", "5.6 Conclusion"]),
    (6, "Design and Architecture", ["6.1 The Role of Architecture", "6.2 Designing Modular Systems",
        "6.3 Class Diagrams", "6.4 Architectural Views", "6.5 Describing System Architecture", "6.6 Conclusion"]),
    (7, "Architectural Patterns", ["7.1 Software Layering", "7.2 Three Building Blocks",
        "7.3 User Interfaces: Model-View-Controller", "7.4 Dataflow Architectures",
        "7.5 Connecting Clients with Servers", "7.6 Families and Product Lines", "7.7 Conclusion"]),
    (8, "Version Control with Git", ["8.1 Why Version Control", "8.2 The Everyday Workflow",
        "8.3 Branching and Merging", "8.4 Working with Others", "8.5 Merge Conflicts",
        "8.6 Habits That Make Git Work for a Team", "8.7 Markdown, READMEs, and Project Documentation",
        "8.8 Conclusion"]),
    (9, "Static Checking", ["9.1 Architecture Reviews", "9.2 Conducting Software Inspections",
        "9.3 Code Reviews: Check Intent and Trust", "9.4 Automated Static Analysis", "9.5 Conclusion"]),
    (10, "Testing", ["10.1 Overview of Testing", "10.2 Levels of Testing",
        "10.3 Code Coverage I: White-Box Testing", "10.4 Input Coverage I: Black-Box Testing",
        "10.5 Code Coverage II: MC/DC", "10.6 Input Coverage II: Combinatorial Testing", "10.7 Conclusion"]),
    (11, "Software Security", ["11.1 Security Is a Lifecycle Property", "11.2 The OWASP Top 10",
        "11.3 Finding Vulnerabilities, from Manual to Autonomous",
        "11.4 The Software Supply Chain: A World of Weak Links", "11.5 Building Security In", "11.6 Conclusion"]),
    (12, "Quality Metrics", ["12.1 Meaningful Metrics", "12.2 Software Quality",
        "12.3 Graphical Displays of Data Sets", "12.4 Product Quality: Measuring Defects",
        "12.5 Ops Quality Improvement: A Case Study", "12.6 Data Dispersion: Boxplots and Histograms",
        "12.7 Data Dispersion: Statistics", "12.8 Confidence Intervals", "12.9 Simple Linear Regression",
        "12.10 Conclusion"]),
    (13, "Software Engineering in the Age of AI", ["13.1 What AI Changes — and What It Doesn't",
        "13.2 AI Across the Lifecycle", "13.3 The Evidence: Productivity, Quality, Security",
        "13.4 Outcome Engineering: The o16g Manifesto", "13.5 Spec-Driven Development",
        "13.6 Context as Infrastructure: CLAUDE.md, AGENTS.md, and Skills", "13.7 Loop Engineering",
        "13.8 Principles for the AI-Augmented Engineer", "13.9 Conclusion"]),
    (14, "Delivery: CI/CD, DevOps, and Operations", ["14.1 SaaS and the Cloud",
        "14.2 Continuous Integration Pipelines", "14.3 Continuous Deployment",
        "14.4 Packaging and Running a Service: Docker and Compose", "14.5 Reaching Users: DNS, TLS, and the Edge",
        "14.6 Continuous Security Pipelines", "14.7 DORA Delivery Metrics", "14.8 Conclusion"]),
    (15, "Maintenance and Evolution", ["15.1 What Makes Code Legacy", "15.2 Characterization Tests",
        "15.3 Refactoring Under Green Tests", "15.4 Repository Stewardship", "15.5 Technical Debt",
        "15.6 Strangler Fig versus Big-Bang Rewrite", "15.7 Conclusion"]),
]
swe_pdf = fitz.open(f"{SRC}/swebook-python.pdf")
for num, title, secs in SWE_CH:
    # find chapter start page: "Chapter N — Title"
    start = None
    for p in range(swe_pdf.page_count):
        t = re.sub(r"\s+", " ", swe_pdf[p].get_text("text"))
        if f"Chapter {num} — {title}" in t:
            start = p + 1
            break
    swe["chapters"].append({
        "id": f"swe.ch{num}", "number": num, "title": title,
        "pdfPage": start, "bookPage": start,
        "sections": [{"id": f"swe.ch{num}.s{i+1}", "number": f"{num}.{i+1}", "title": s}
                     for i, s in enumerate(secs)]
    })
swe["chapters"].append({
    "id": "swe.appendixA", "number": "A", "title": "The Team Project",
    "pdfPage": None, "bookPage": None, "sections": [
        {"id": "swe.A.1", "number": "A.1", "title": "Overview"},
        {"id": "swe.A.2", "number": "A.2", "title": "Project Proposal"},
        {"id": "swe.A.3", "number": "A.3", "title": "Skeletal System: Status Report 1"},
        {"id": "swe.A.4", "number": "A.4", "title": "Viable System: Status Report 2"},
        {"id": "swe.A.5", "number": "A.5", "title": "Comprehensive Final Report"},
        {"id": "swe.A.6", "number": "A.6", "title": "Grading Your Own Repository"},
        {"id": "swe.A.7", "number": "A.7", "title": "Conclusion"},
    ]
})
swe_pdf.close()

# ---------------------------------------------------------------- MLS -------
mls = {
    "code": "MLS", "title": "Machine Learning from Scratch",
    "authors": ["Danny Friedman"],
    "license": "NO LICENSE STATED IN PDF — 'By Danny Friedman © Copyright 2020' only. Treat as All Rights Reserved pending human decision (see docs/OPEN-QUESTIONS.md OQ-2).",
    "url": "https://dafriedman.github.io/mlfromscratch/",
    "chapters": []
}
MLS_CH = [
    (1, "Ordinary Linear Regression", ["The Loss-Minimization Perspective", "The Likelihood-Maximization Perspective",
        "Construction", "Implementation"]),
    (2, "Linear Regression Extensions", ["Regularized Regression (Ridge and Lasso)", "Bayesian Regression",
        "Generalized Linear Models (GLMs)", "Construction", "Implementation"]),
    (3, "Discriminative Classification", ["Logistic Regression", "The Perceptron Algorithm",
        "Fisher's Linear Discriminant", "Construction", "Implementation"]),
    (4, "Generative Classification", ["Linear and Quadratic Discriminant Analysis", "Naive Bayes",
        "Construction", "Implementation"]),
    (5, "Decision Trees", ["Regression Trees", "Classification Trees", "Construction", "Implementation"]),
    (6, "Tree Ensemble Methods", ["Bagging", "Random Forests", "Boosting", "Construction", "Implementation"]),
    (7, "Neural Networks", ["Concept", "Construction", "Implementation"]),
]
mls_pdf = fitz.open(f"{SRC}/book.pdf")
for num, title, secs in MLS_CH:
    start = None
    for p in range(mls_pdf.page_count):
        t = re.sub(r"\s+", " ", mls_pdf[p].get_text("text"))
        if re.search(rf"{num}\.\s*{re.escape(title)}", t) and p > 1:
            start = p + 1
            break
    mls["chapters"].append({
        "id": f"mls.ch{num}", "number": num, "title": title, "pdfPage": start, "bookPage": start,
        "sections": [{"id": f"mls.ch{num}.s{i+1}", "number": f"{num}.{i+1}", "title": s}
                     for i, s in enumerate(secs)]
    })
mls["chapters"].append({
    "id": "mls.appendix", "number": "A", "title": "Appendix (Math, Gradient Descent, Cross Validation, Datasets)",
    "pdfPage": 104, "bookPage": 104, "sections": [
        {"id": "mls.A.1", "number": "A.1", "title": "Derivatives and Gradient Descent"},
        {"id": "mls.A.2", "number": "A.2", "title": "Cross Validation"},
        {"id": "mls.A.3", "number": "A.3", "title": "Datasets (Boston, Breast Cancer, Penguins, Tips, Wine)"},
    ]
})
mls_pdf.close()

# ---------------------------------------------------------------- D2L -------
d2l_raw = json.load(open(f"{OUT}/D2L.raw_toc.json"))
d2l = {
    "code": "D2L", "title": "Dive into Deep Learning",
    "authors": ["Aston Zhang", "Zachary C. Lipton", "Mu Li", "Alexander J. Smola"],
    "license": "License not stated inside the PDF; d2l.ai site publishes under CC BY-NC-SA 4.0 (verify before publishing any content — OQ-3).",
    "url": "https://d2l.ai/",
    "chapters": []
}
cur_ch = None
for lvl, title, page in d2l_raw:
    if lvl == 1:
        cur_ch = {"id": f"d2l.ch{len(d2l['chapters'])+1}", "number": len(d2l["chapters"]) + 1,
                  "title": title, "pdfPage": page, "bookPage": page, "sections": []}
        d2l["chapters"].append(cur_ch)
    elif lvl == 2 and cur_ch is not None:
        cur_ch["sections"].append({"id": f"{cur_ch['id']}.s{len(cur_ch['sections'])+1}",
                                   "number": f"{cur_ch['number']}.{len(cur_ch['sections'])+1}",
                                   "title": title, "pdfPage": page, "bookPage": page})
    # lvl>=3 subsections are recorded in the coverage granularity as part of sections

for b in (py4e, swe, mls, d2l):
    with open(f"{OUT}/{b['code']}.toc.json", "w", encoding="utf-8") as f:
        json.dump(b, f, ensure_ascii=False, indent=1)
    nch = len(b["chapters"])
    nsec = sum(len(c["sections"]) for c in b["chapters"])
    print(f"{b['code']}: {nch} chapters, {nsec} sections -> {b['code']}.toc.json")

# sanity: report detected chapter start pages for SWE/MLS
print("SWE ch starts:", [(c['number'], c['pdfPage']) for c in swe['chapters'][:5]])
print("MLS ch starts:", [(c['number'], c['pdfPage']) for c in mls['chapters']])
