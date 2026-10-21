#!/usr/bin/env python3
"""Generate scripts/register_swe_ch11_12_14_15.py from the extracted lesson metadata."""
import json

lessons = json.load(open('/tmp/swe_titles.json'))
entry_lines = []
for lid, ar, en, pre, secs in lessons:
    entry_lines.append('    (%r, %r, %r, [%s], [%s]),' % (
        lid, ar, en, pre, ', '.join(repr(s) for s in secs)))
entries = '\n'.join(entry_lines)

TEMPLATE = '''#!/usr/bin/env python3
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
__ENTRIES__
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
            '    {"id": "%s", "track": "P3", "part": "I", "book": "SWE", "chapter": %d, "order": %d,\\n'
            '     "title": {"ar": "%s", "en": "%s"},\\n'
            '     "prerequisites": %s,\\n'
            '     "sources": [%s]}' % (lid, ch, order, ar, en, prereq_json, srcs)
        )
    tail = '\\n  ]\\n}'
    body = raw.rstrip('\\n')
    assert body.endswith(tail), 'unexpected manifest tail: %r' % raw[-20:]
    body = body[:-len(tail)] + ',\\n' + ',\\n'.join(entries) + tail + '\\n'
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
    add = '\\n'.join(
        "  '%s': () => import('../../../content/part1/swe/%s/lesson.%s')," % (
            lid, lid.split('.')[1], lid)
        for lid, *_ in LESSONS if lid in missing
    )
    reg = reg.replace(anchor, anchor + '\\n' + add, 1)
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
'''

script = TEMPLATE.replace('__ENTRIES__', entries)
open('/home/z/my-project/scripts/register_swe_ch11_12_14_15.py', 'w', encoding='utf-8').write(script)
print('script written with', len(lessons), 'lessons')
