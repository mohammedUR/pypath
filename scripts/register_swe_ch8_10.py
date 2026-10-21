#!/usr/bin/env python3
"""Register SWE ch8-10 lessons: registry.ts loaders + manifest.json entries (orders 97-110).

Idempotent: skips work if manifest already contains swe.ch8.l1.
Formatting preserved: manifest entries appended textually in the established compact style.
"""
import json, os, sys

ROOT = '/home/z/my-project'
MANIFEST = ROOT + '/content/manifest.json'
REGISTRY = ROOT + '/src/lib/content/registry.ts'

# lesson id -> (ar title, en title, prerequisites, source sections)
LESSONS = [
    ('swe.ch8.l1', 'لماذا التحكم بالإصدارات؟', 'Why Version Control?', ['py4e.ch16.l6'], ['swe.ch8.s1', 'swe.ch8.s2']),
    ('swe.ch8.l2', 'التفرّع والدمج', 'Branching and Merging', ['swe.ch8.l1'], ['swe.ch8.s3']),
    ('swe.ch8.l3', 'العمل مع الآخرين وتعارضات الدمج', 'Working with Others and Merge Conflicts', ['swe.ch8.l2'], ['swe.ch8.s4', 'swe.ch8.s5']),
    ('swe.ch8.l4', 'عادات Git الجماعية والتوثيق', 'Team Habits and Documentation', ['swe.ch8.l3'], ['swe.ch8.s6', 'swe.ch8.s7']),
    ('swe.ch8.l5', 'مراجعة الفصل 8 ومشروع: نموذج Git المصغّر', 'Chapter 8 Review and Project: The Mini-Git Model', ['swe.ch8.l4'], ['swe.ch8.s8']),
    ('swe.ch9.l1', 'مراجعات المعمارية والفحوص', 'Architecture Reviews and Inspections', ['swe.ch8.l5'], ['swe.ch9.s1', 'swe.ch9.s2']),
    ('swe.ch9.l2', 'مراجعات الكود: النية والثقة', 'Code Reviews: Intent and Trust', ['swe.ch9.l1'], ['swe.ch9.s3']),
    ('swe.ch9.l3', 'التحليل الثابت الآلي', 'Automated Static Analysis', ['swe.ch9.l2'], ['swe.ch9.s4']),
    ('swe.ch9.l4', 'مراجعة الفصل 9 ومشروع: المنقّح المصغّر', 'Chapter 9 Review and Project: The Mini Linter', ['swe.ch9.l3'], ['swe.ch9.s5']),
    ('swe.ch10.l1', 'لماذا نختبر؟ ومستويات الاختبار', 'Why Test? Levels of Testing', ['swe.ch9.l4'], ['swe.ch10.s1', 'swe.ch10.s2']),
    ('swe.ch10.l2', 'تغطية الكود: الاختبار بالصندوق الأبيض', 'Code Coverage: White-Box Testing', ['swe.ch10.l1'], ['swe.ch10.s3']),
    ('swe.ch10.l3', 'تغطية المدخلات: الاختبار بالصندوق الأسود', 'Input Coverage: Black-Box Testing', ['swe.ch10.l2'], ['swe.ch10.s4']),
    ('swe.ch10.l4', 'MC/DC والاختبار التوافقي', 'MC/DC and Combinatorial Testing', ['swe.ch10.l3'], ['swe.ch10.s5', 'swe.ch10.s6']),
    ('swe.ch10.l5', 'مراجعة الفصل 10 ومشروع: حزمة الاختبارات', 'Chapter 10 Review and Project: The Test Suite', ['swe.ch10.l4'], ['swe.ch10.s7']),
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
if 'swe.ch8.l1' in existing and 'swe.ch10.l5' in existing:
    print('manifest already registered — skipping')
else:
    assert not (existing & {l[0] for l in LESSONS}), 'partial/idempotent conflict'
    n = len(doc['lessons'])
    lines = []
    for i, (lid, ar, en, prereqs, secs) in enumerate(LESSONS):
        ch = int(lid.split('.')[1].replace('ch', ''))
        order = n + i + 1
        prereq_json = '[]' if not prereqs else json.dumps(prereqs, ensure_ascii=False)
        srcs = ', '.join('{"book": "SWE", "section": "%s"}' % s for s in secs)
        lines.append(
            '    {"id": "%s", "track": "P3", "part": "I", "book": "SWE", "chapter": %d, "order": %d,\n'
            '     "title": {"ar": "%s", "en": "%s"},\n'
            '     "prerequisites": %s,\n'
            '     "sources": [%s]}' % (lid, ch, order, ar, en, prereq_json, srcs)
        )
    tail = '\n  ]\n}'
    body = raw.rstrip('\n')
    assert body.endswith(tail), 'unexpected manifest tail: %r' % raw[-20:]
    body = body[:-len(tail)] + ',\n' + ',\n'.join(lines) + tail + '\n'
    open(MANIFEST, 'w', encoding='utf-8').write(body)
    print('manifest: appended %d entries (orders %d-%d)' % (len(LESSONS), n + 1, n + len(LESSONS)))

# ---- registry.ts loaders ----
reg = open(REGISTRY, encoding='utf-8').read()
missing = []
for lid, *_ in LESSONS:
    if "'%s'" % lid not in reg:
        missing.append(lid)
if not missing:
    print('registry already registered — skipping')
else:
    anchor = "  'py4e.ch16.l6': () => import('../../../content/part1/py4e/ch16/lesson.ch16.l6'),"
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
assert len(ids) == len(set(ids)) == 110, 'expected 110 unique lessons, got %d' % len(ids)
assert orders == list(range(1, 111)), 'orders not sequential'
idset = set(ids)
for e in doc['lessons']:
    for p in e['prerequisites']:
        assert p in idset, '%s: missing prereq %s' % (e['id'], p)
chapters = sorted({e['chapter'] for e in doc['lessons']})
print('sanity OK: 110 lessons, orders 1-110, prereqs resolve, chapters=%s' % chapters)
