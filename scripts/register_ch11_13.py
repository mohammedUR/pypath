#!/usr/bin/env python3
"""Register PY4E ch11-13 lessons: registry.ts loaders + manifest.json entries (orders 61-72).

Idempotent: skips work if manifest already contains py4e.ch11.l1.
Formatting preserved: manifest entries appended textually in the established compact style.
"""
import json, re, sys

ROOT = '/home/z/my-project'
MANIFEST = ROOT + '/content/manifest.json'
REGISTRY = ROOT + '/src/lib/content/registry.ts'

# lesson id -> (ar title, en title, prerequisites, source sections)
LESSONS = [
    ('py4e.ch11.l1', 'مطابقة المحارف بالتعبيرات النمطية', 'Matching Characters with Regular Expressions', ['py4e.ch10.l6'], ['py4e.ch11.s1']),
    ('py4e.ch11.l2', 'استخراج البيانات بالتعبيرات النمطية', 'Extracting Data with Regular Expressions', ['py4e.ch11.l1'], ['py4e.ch11.s2']),
    ('py4e.ch11.l3', 'البحث والاستخراج معًا', 'Search and Extract Together', ['py4e.ch11.l2'], ['py4e.ch11.s3']),
    ('py4e.ch11.l4', 'فئات المحارف والتكرار', 'Character Classes and Repetition', ['py4e.ch11.l3'], ['py4e.ch11.s1', 'py4e.ch11.s3']),
    ('py4e.ch11.l5', 'محرف الهروب والأنماط العملية', 'Escaping and Practical Patterns', ['py4e.ch11.l4'], ['py4e.ch11.s4', 'py4e.ch11.s6']),
    ('py4e.ch11.l6', 'مراجعة الفصل 11 ومشروع: محلل السجلات', 'Chapter 11 Review and Project: Log Analyzer', ['py4e.ch11.l5'], ['py4e.ch11.s5', 'py4e.ch11.s7', 'py4e.ch11.s8', 'py4e.ch11.s9']),
    ('py4e.ch12.l1', 'بروتوكول HTTP: كيف تتحدث الشبكة', 'The HTTP Protocol: How the Web Talks', ['py4e.ch11.l6'], ['py4e.ch12.s1']),
    ('py4e.ch12.l2', 'أبسط متصفح ويب في العالم', 'The Simplest Web Browser', ['py4e.ch12.l1'], ['py4e.ch12.s2']),
    ('py4e.ch12.l3', 'الصور والبيانات الثنائية عبر HTTP', 'Images and Binary Data over HTTP', ['py4e.ch12.l2'], ['py4e.ch12.s3', 'py4e.ch12.s5']),
    ('py4e.ch12.l4', 'مكتبة urllib وتحليل الروابط', 'The urllib Library and URL Parsing', ['py4e.ch12.l3'], ['py4e.ch12.s4']),
    ('py4e.ch12.l5', 'تحليل صفحات HTML', 'Parsing HTML Pages', ['py4e.ch12.l4'], ['py4e.ch12.s6', 'py4e.ch12.s7', 'py4e.ch12.s8']),
    ('py4e.ch12.l6', 'مراجعة الفصل 12 ومشروع: متصفح مصغّر', 'Chapter 12 Review and Project: Mini Browser', ['py4e.ch12.l5'], ['py4e.ch12.s9', 'py4e.ch12.s10', 'py4e.ch12.s11']),
    ('py4e.ch13.l1', 'لغة التوصيف الموسعة XML', 'eXtensible Markup Language (XML)', ['py4e.ch12.l6'], ['py4e.ch13.s1']),
    ('py4e.ch13.l2', 'تحليل نصوص XML', 'Parsing XML', ['py4e.ch13.l1'], ['py4e.ch13.s2']),
    ('py4e.ch13.l3', 'المرور على عقد XML', 'Looping Over XML Nodes', ['py4e.ch13.l2'], ['py4e.ch13.s3']),
    ('py4e.ch13.l4', 'صيغة JSON', 'The JSON Format', ['py4e.ch13.l3'], ['py4e.ch13.s4', 'py4e.ch13.s5']),
    ('py4e.ch13.l5', 'واجهات برمجة التطبيقات والأمان', 'APIs and Security', ['py4e.ch13.l4'], ['py4e.ch13.s6', 'py4e.ch13.s7']),
    ('py4e.ch13.l6', 'مراجعة الفصل 13 ومشروع: قارئ الخدمة الجغرافية', 'Chapter 13 Review and Project: Geo Service Reader', ['py4e.ch13.l5'], ['py4e.ch13.s8', 'py4e.ch13.s9']),
]

# ---- sanity: lesson files must exist and carry the expected title/prereq ----
import os
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

# ---- manifest ----
raw = open(MANIFEST, encoding='utf-8').read()
doc = json.loads(raw)
existing = {e['id'] for e in doc['lessons']}
if 'py4e.ch11.l1' in existing and 'py4e.ch13.l6' in existing:
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

# ---- registry.ts loaders ----
reg = open(REGISTRY, encoding='utf-8').read()
missing = []
for lid, *_ in LESSONS:
    if "'%s'" % lid not in reg:
        missing.append(lid)
if not missing:
    print('registry already registered — skipping')
else:
    anchor = "  'py4e.ch10.l6': () => import('../../../content/part1/py4e/ch10/lesson.ch10.l6'),"
    assert anchor in reg, 'anchor loader line not found'
    add = '\n'.join(
        "  '%s': () => import('../../../content/part1/py4e/%s/lesson.%s.%s')," % (
            lid, lid.split('.')[1], lid.split('.')[1], lid.split('.')[2])
        for lid, *_ in LESSONS if lid in missing
    )
    reg = reg.replace(anchor, anchor + '\n' + add, 1)
    open(REGISTRY, 'w', encoding='utf-8').write(reg)
    print('registry: added %d loaders' % len(missing))

# ---- final sanity ----
doc = json.loads(open(MANIFEST, encoding='utf-8').read())
ids = [e['id'] for e in doc['lessons']]
orders = [e['order'] for e in doc['lessons']]
assert len(ids) == len(set(ids)) == 78, 'expected 78 unique lessons, got %d' % len(ids)
assert orders == list(range(1, 79)), 'orders not sequential'
idset = set(ids)
for e in doc['lessons']:
    for p in e['prerequisites']:
        assert p in idset, '%s: missing prereq %s' % (e['id'], p)
chapters = sorted({e['chapter'] for e in doc['lessons']})
print('sanity OK: 78 lessons, orders 1-78, prereqs resolve, chapters=%s' % chapters)
