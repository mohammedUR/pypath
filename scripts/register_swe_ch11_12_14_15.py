#!/usr/bin/env python3
"""Register SWE ch11/12/14/15 lessons: registry.ts loaders + manifest.json entries
(orders 111-129). Idempotent: skips work if manifest already contains swe.ch11.l1.
Formatting preserved: manifest entries appended textually in the established compact style.
"""
import json, os, sys

ROOT = '/home/z/my-project'
MANIFEST = ROOT + '/content/manifest.json'
REGISTRY = ROOT + '/src/lib/content/registry.ts'

# lesson id -> (ar title, en title, prerequisites, source sections)
LESSONS = [
    ('swe.ch11.l1', 'الأمن صفة عبر دورة الحياة وقائمة OWASP العشرة', 'Security as a Lifecycle Property and the OWASP Top 10', ['swe.ch10.l5'], ['swe.ch11.s1', 'swe.ch11.s2']),
    ('swe.ch11.l2', 'البحث عن الثغرات: من الفحص اليدوي إلى المستقل', 'Finding Vulnerabilities: from Manual Review to Autonomous Agents', ['swe.ch11.l1'], ['swe.ch11.s3']),
    ('swe.ch11.l3', 'سلسلة توريد البرمجيات وبناء الأمن داخليًا', 'The Software Supply Chain and Building Security In', ['swe.ch11.l2'], ['swe.ch11.s4', 'swe.ch11.s5']),
    ('swe.ch11.l4', 'مراجعة الفصل 11 ومشروع: مدقّق كلمات المرور والسياسات', 'Chapter 11 Review and Project: Password and Policy Auditor', ['swe.ch11.l3'], ['swe.ch11.s6']),
    ('swe.ch12.l1', 'مقاييس ذات معنى وجودة البرمجيات', 'Meaningful Metrics and Software Quality', ['swe.ch11.l4'], ['swe.ch12.s1', 'swe.ch12.s2']),
    ('swe.ch12.l2', 'عرض البيانات بيانيًا', 'Graphical Displays of Data Sets', ['swe.ch12.l1'], ['swe.ch12.s3']),
    ('swe.ch12.l3', 'قياس العيوب وتحسين جودة العمليات: دراسة حالة', 'Measuring Defects and an Ops Quality Case Study', ['swe.ch12.l2'], ['swe.ch12.s4', 'swe.ch12.s5']),
    ('swe.ch12.l4', 'تشتت البيانات: الصناديق والمدرجات والإحصاء', 'Data Dispersion: Boxplots, Histograms, and Statistics', ['swe.ch12.l3'], ['swe.ch12.s6', 'swe.ch12.s7']),
    ('swe.ch12.l5', 'فترات الثقة والانحدار الخطي البسيط', 'Confidence Intervals and Simple Linear Regression', ['swe.ch12.l4'], ['swe.ch12.s8', 'swe.ch12.s9']),
    ('swe.ch12.l6', 'مراجعة الفصل 12 ومشروع: لوحة مقاييس الجودة', 'Chapter 12 Review and Project: Quality Metrics Dashboard', ['swe.ch12.l5'], ['swe.ch12.s10']),
    ('swe.ch14.l1', 'الخدمات السحابية وخطوط التكامل المستمر', 'SaaS and the Cloud and Continuous Integration Pipelines', ['swe.ch12.l6'], ['swe.ch14.s1', 'swe.ch14.s2']),
    ('swe.ch14.l2', 'النشر المستمر: الإصدارات الكنارية والتراجع', 'Continuous Deployment: Canaries and Rollbacks', ['swe.ch14.l1'], ['swe.ch14.s3']),
    ('swe.ch14.l3', 'حزم الخدمات وتشغيلها، والوصول إلى المستخدمين', 'Packaging a Service, and Reaching Users', ['swe.ch14.l2'], ['swe.ch14.s4', 'swe.ch14.s5']),
    ('swe.ch14.l4', 'خطوط الأمن المستمر ومقاييس DORA للتسليم', 'Continuous Security Pipelines and DORA Delivery Metrics', ['swe.ch14.l3'], ['swe.ch14.s6', 'swe.ch14.s7']),
    ('swe.ch14.l5', 'مراجعة الفصل 14 ومشروع: خط تسليم مصغّر', 'Chapter 14 Review and Project: a Mini Delivery Pipeline', ['swe.ch14.l4'], ['swe.ch14.s8']),
    ('swe.ch15.l1', 'الشيفرة العتيقة واختبارات التوصيف', 'What Makes Code Legacy and Characterization Tests', ['swe.ch14.l5'], ['swe.ch15.s1', 'swe.ch15.s2']),
    ('swe.ch15.l2', 'إعادة الهيكلة تحت اختبارات خضراء وحوكمة المستودع', 'Refactoring Under Green Tests and Repository Stewardship', ['swe.ch15.l1'], ['swe.ch15.s3', 'swe.ch15.s4']),
    ('swe.ch15.l3', 'الدين التقني: شجرة الخنزير مقابل إعادة الكتابة الكاملة', 'Technical Debt and Strangler Fig versus Big-Bang Rewrite', ['swe.ch15.l2'], ['swe.ch15.s5', 'swe.ch15.s6']),
    ('swe.ch15.l4', 'مراجعة الفصل 15 ومشروع: ورشة إحياء شيفرة عتيقة', 'Chapter 15 Review and Project: Legacy Revival Workshop', ['swe.ch15.l3'], ['swe.ch15.s7']),
]

# ---- sanity: lesson files must exist and carry the expected title/prereq/sources ----
for lid, ar, en, prereqs, secs in LESSONS:
    ch, l = lid.split('.')[1], lid.split('.')[2]
    path = f'{ROOT}/content/part1/swe/{ch}/lesson.{lid}.ts'
    if not os.path.exists(path):
        sys.exit(f'MISSING lesson file: {path}')
    src = open(path, encoding='utf-8').read()
    assert f"ar: '{ar}'" in src, f'{lid}: AR title mismatch'
    assert f"en: '{en}'" in src, f'{lid}: EN title mismatch'
    prereq_lit = '[]' if not prereqs else str(prereqs).replace('"', "'")
    assert f'prerequisites: {prereq_lit}' in src, f'{lid}: prereq mismatch ({prereq_lit})'
    for s in secs:
        assert f"section: '{s}'" in src, f'{lid}: source section {s} missing in lesson file'

# ---- manifest ----
raw = open(MANIFEST, encoding='utf-8').read()
doc = json.loads(raw)
existing = {e['id'] for e in doc['lessons']}
if 'swe.ch11.l1' in existing and 'swe.ch15.l4' in existing:
    print('manifest already registered - skipping')
else:
    assert not (existing & {l[0] for l in LESSONS}), 'partial/idempotent conflict'
    n = len(doc['lessons'])
    entries = []
    for i, (lid, ar, en, prereqs, secs) in enumerate(LESSONS):
        ch = int(lid.split('.')[1].replace('ch', ''))
        order = n + i + 1
        prereq_json = '[]' if not prereqs else json.dumps(prereqs, ensure_ascii=False)
        srcs = ', '.join('{"book": "SWE", "section": "%s"}' % s for s in secs)
        entries.append(
            '    {"id": "%s", "track": "P3", "part": "I", "book": "SWE", "chapter": %d, "order": %d,\n'
            '     "title": {"ar": "%s", "en": "%s"},\n'
            '     "prerequisites": %s,\n'
            '     "sources": [%s]}' % (lid, ch, order, ar, en, prereq_json, srcs)
        )
    tail = '\n  ]\n}'
    body = raw.rstrip('\n')
    assert body.endswith(tail), 'unexpected manifest tail: %r' % raw[-20:]
    body = body[:-len(tail)] + ',\n' + ',\n'.join(entries) + tail + '\n'
    open(MANIFEST, 'w', encoding='utf-8').write(body)
    print('manifest: appended %d entries (orders %d-%d)' % (len(LESSONS), n + 1, n + len(LESSONS)))

# ---- registry.ts loaders ----
reg = open(REGISTRY, encoding='utf-8').read()
missing = []
for lid, *_ in LESSONS:
    if "'%s'" % lid not in reg:
        missing.append(lid)
if not missing:
    print('registry already registered - skipping')
else:
    anchor = "  'swe.ch10.l5': () => import('../../../content/part1/swe/ch10/lesson.swe.ch10.l5'),"
    assert anchor in reg, 'anchor loader line not found'
    add = '\n'.join(
        "  '%s': () => import('../../../content/part1/swe/%s/lesson.%s')," % (
            lid, lid.split('.')[1], lid)
        for lid, *_ in LESSONS if lid in missing
    )
    reg = reg.replace(anchor, anchor + '\n' + add, 1)
    open(REGISTRY, 'w', encoding='utf-8').write(reg)
    print('registry: added %d loaders' % len(missing))

# ---- final sanity ----
doc = json.loads(open(MANIFEST, encoding='utf-8').read())
ids = [e['id'] for e in doc['lessons']]
orders = [e['order'] for e in doc['lessons']]
assert len(ids) == len(set(ids)) == 129, 'expected 129 unique lessons, got %d' % len(ids)
assert orders == list(range(1, 130)), 'orders not sequential'
idset = set(ids)
for e in doc['lessons']:
    for p in e['prerequisites']:
        assert p in idset, '%s: missing prereq %s' % (e['id'], p)
chapters = sorted({e['chapter'] for e in doc['lessons']})
print('sanity OK: 129 lessons, orders 1-129, prereqs resolve, chapters=%s' % chapters)
