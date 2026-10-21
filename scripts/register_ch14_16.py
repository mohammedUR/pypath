#!/usr/bin/env python3
"""Register PY4E ch14-16 lessons: registry.ts loaders + manifest.json entries (orders 79-96).

Idempotent + format-preserving (same style as register_ch11_13.py).
"""
import json, os, sys

ROOT = '/home/z/my-project'
MANIFEST = ROOT + '/content/manifest.json'
REGISTRY = ROOT + '/src/lib/content/registry.ts'

LESSONS = [
    ('py4e.ch14.l1', 'لماذا نحتاج الكائنات؟', 'Why Objects?', ['py4e.ch13.l6'], ['py4e.ch14.s1', 'py4e.ch14.s2', 'py4e.ch14.s3']),
    ('py4e.ch14.l2', 'أول صنف لك', 'Your First Class', ['py4e.ch14.l1'], ['py4e.ch14.s4', 'py4e.ch14.s5']),
    ('py4e.ch14.l3', 'بناء الكائنات والمُنشئ', 'Building Objects and the Constructor', ['py4e.ch14.l2'], ['py4e.ch14.s6', 'py4e.ch14.s7']),
    ('py4e.ch14.l4', 'دورة حياة الكائن وتعدد الكائنات', 'Object Lifecycle and Multiple Objects', ['py4e.ch14.l3'], ['py4e.ch14.s8', 'py4e.ch14.s9']),
    ('py4e.ch14.l5', 'الوراثة', 'Inheritance', ['py4e.ch14.l4'], ['py4e.ch14.s10']),
    ('py4e.ch14.l6', 'مراجعة الفصل 14 ومشروع: فريق الكائنات', 'Chapter 14 Review and Project: The Objects Team', ['py4e.ch14.l5'], ['py4e.ch14.s11', 'py4e.ch14.s12']),
    ('py4e.ch15.l1', 'ما هي قاعدة البيانات؟', 'What Is a Database?', ['py4e.ch14.l6'], ['py4e.ch15.s1', 'py4e.ch15.s2', 'py4e.ch15.s3']),
    ('py4e.ch15.l2', 'أول جداولك بـ SQL', 'Your First Tables with SQL', ['py4e.ch15.l1'], ['py4e.ch15.s4', 'py4e.ch15.s5']),
    ('py4e.ch15.l3', 'الاستعلامات والتجميع', 'Querying and Aggregating', ['py4e.ch15.l2'], ['py4e.ch15.s6']),
    ('py4e.ch15.l4', 'نمذجة البيانات والجداول المتعددة', 'Data Modeling and Multiple Tables', ['py4e.ch15.l3'], ['py4e.ch15.s7', 'py4e.ch15.s8']),
    ('py4e.ch15.l5', 'المفاتيح الثلاثة و JOIN', 'The Three Kinds of Keys and JOIN', ['py4e.ch15.l4'], ['py4e.ch15.s9', 'py4e.ch15.s10']),
    ('py4e.ch15.l6', 'مراجعة الفصل 15 ومشروع: قاعدة بيانات المكتبة الموسيقية', 'Chapter 15 Review and Project: The Music Library Database', ['py4e.ch15.l5'], ['py4e.ch15.s11', 'py4e.ch15.s12', 'py4e.ch15.s13']),
    ('py4e.ch16.l1', 'بيانات غوغل الجغرافية', 'Google Geodata', ['py4e.ch15.l6'], ['py4e.ch16.s1']),
    ('py4e.ch16.l2', 'توليد ملفات الخرائط', 'Generating Map Data Files', ['py4e.ch16.l1'], ['py4e.ch16.s1']),
    ('py4e.ch16.l3', 'شبكات الروابط والعقد', 'Link and Node Networks', ['py4e.ch16.l2'], ['py4e.ch16.s2']),
    ('py4e.ch16.l4', 'الرسم النصي للبيانات', 'Text-Based Data Visualization', ['py4e.ch16.l3'], ['py4e.ch16.s2']),
    ('py4e.ch16.l5', 'البيانات البريدية عبر الزمن', 'Mail Data Over Time', ['py4e.ch16.l4'], ['py4e.ch16.s3']),
    ('py4e.ch16.l6', 'مراجعة الفصل 16 ومشروع: لوحة البيانات البريدية', 'Chapter 16 Review and Project: The Mail Data Dashboard', ['py4e.ch16.l5'], ['py4e.ch16.s3']),
]

for lid, ar, en, prereqs, secs in LESSONS:
    ch, l = lid.split('.')[1], lid.split('.')[2]
    path = f'{ROOT}/content/part1/py4e/{ch}/lesson.{ch}.{l}.ts'
    if not os.path.exists(path):
        sys.exit(f'MISSING lesson file: {path}')
    src = open(path, encoding='utf-8').read()
    assert f"ar: '{ar}'" in src, f'{lid}: AR title mismatch'
    assert f"en: '{en}'" in src, f'{lid}: EN title mismatch'
    prereq_lit = '[]' if not prereqs else str(prereqs).replace('"', "'")
    assert f'prerequisites: {prereq_lit}' in src, f'{lid}: prereq mismatch ({prereq_lit})'

raw = open(MANIFEST, encoding='utf-8').read()
doc = json.loads(raw)
existing = {e['id'] for e in doc['lessons']}
if 'py4e.ch14.l1' in existing and 'py4e.ch16.l6' in existing:
    print('manifest already registered — skipping')
else:
    assert not (existing & {l[0] for l in LESSONS}), 'partial/idempotent conflict'
    n = len(doc['lessons'])
    lines = []
    for i, (lid, ar, en, prereqs, secs) in enumerate(LESSONS):
        ch = int(lid.split('.')[1].replace('ch', ''))
        order = n + i + 1
        prereq_json = '[]' if not prereqs else json.dumps(prereqs, ensure_ascii=False)
        srcs = ', '.join('{"book": "PY4E", "section": "%s"}' % s for s in secs)
        lines.append(
            '    {"id": "%s", "track": "P1", "part": "I", "book": "PY4E", "chapter": %d, "order": %d,\n'
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

reg = open(REGISTRY, encoding='utf-8').read()
anchor = "  'py4e.ch13.l6': () => import('../../../content/part1/py4e/ch13/lesson.ch13.l6'),"
missing = [lid for lid, *_ in LESSONS if "'%s'" % lid not in reg]
if not missing:
    print('registry already registered — skipping')
else:
    assert anchor in reg, 'anchor loader line not found'
    add = '\n'.join(
        "  '%s': () => import('../../../content/part1/py4e/%s/lesson.%s.%s')," % (
            lid, lid.split('.')[1], lid.split('.')[1], lid.split('.')[2])
        for lid, *_ in LESSONS if lid in missing
    )
    reg = reg.replace(anchor, anchor + '\n' + add, 1)
    open(REGISTRY, 'w', encoding='utf-8').write(reg)
    print('registry: added %d loaders' % len(missing))

doc = json.loads(open(MANIFEST, encoding='utf-8').read())
ids = [e['id'] for e in doc['lessons']]
orders = [e['order'] for e in doc['lessons']]
assert len(ids) == len(set(ids)) == 96, 'expected 96 unique lessons, got %d' % len(ids)
assert orders == list(range(1, 97)), 'orders not sequential'
idset = set(ids)
for e in doc['lessons']:
    for p in e['prerequisites']:
        assert p in idset, '%s: missing prereq %s' % (e['id'], p)
chapters = sorted({e['chapter'] for e in doc['lessons']})
print('sanity OK: 96 lessons, orders 1-96, prereqs resolve, chapters=%s' % chapters)
