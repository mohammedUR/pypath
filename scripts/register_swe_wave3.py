#!/usr/bin/env python3
"""Register SWE wave-3 lessons (ch1-7 + Appendix A): manifest.json entries
(orders 130-163) + registry.ts loaders. Idempotent: skips if swe.ch1.l1 already
in manifest. Formatting preserved (established compact style, entries appended
textually before the closing `  ]\\n}`).

Titles/prereqs/sources are extracted from the lesson TS files themselves and
sanity-checked (title literals, prereq literal, source section ids present).
"""
import json
import os
import re
import sys

ROOT = '/home/z/my-project'
MANIFEST = ROOT + '/content/manifest.json'
REGISTRY = ROOT + '/src/lib/content/registry.ts'

# (lesson id, chapter int for manifest, [source section ids])
PLAN = []
for ch, n, cnt in [(1, 1, 4), (2, 2, 5), (3, 3, 5), (4, 4, 4), (5, 5, 4), (6, 6, 4), (7, 7, 4)]:
    for l in range(1, cnt + 1):
        PLAN.append(('swe.ch%d.l%d' % (ch, l), n))
for l in range(1, 5):
    PLAN.append(('swe.appa.l%d' % l, 16))

CHAP_DIR = {'appa': 'appa'}
prev = 'swe.ch15.l4'
entries = []
for lid, chapter in PLAN:
    ch_tok = lid.split('.')[1]
    l_tok = lid.split('.')[2]
    dirn = 'appa' if ch_tok == 'appa' else ch_tok
    path = '%s/content/part1/swe/%s/lesson.swe.%s.%s.ts' % (ROOT, dirn, ch_tok, l_tok)
    if not os.path.exists(path):
        sys.exit('MISSING lesson file: %s' % path)
    src = open(path, encoding='utf-8').read()
    m = re.search(r"title: \{\s*ar: '([^']+)',\s*en: '([^']+)',?\s*\}", src)
    assert m, 'title not found in %s' % path
    ar, en = m.group(1), m.group(2)
    mp = re.search(r"prerequisites: \[([^\]]*)\]", src)
    assert mp, 'prerequisites not found in %s' % path
    prereqs = [x.strip().strip("'") for x in mp.group(1).split(',') if x.strip()]
    assert prereqs == [prev] or (lid == 'swe.ch1.l1' and prereqs == ['swe.ch15.l4']), \
        '%s: prereq chain mismatch: %s (expected [%s])' % (lid, prereqs, prev)
    secs = re.findall(r"section: '(swe\.[^']+)'", src)
    assert secs, 'no source sections in %s' % path
    # source-section sanity: chapters must match the lesson's own book chapter
    for s in secs:
        want = 'swe.A.' if lid.startswith('swe.appa') else 'swe.%s.' % ch_tok
        assert s.startswith(want), '%s: foreign section %s' % (lid, s)
    entries.append({
        'id': lid, 'ar': ar, 'en': en, 'chapter': chapter,
        'prereqs': prereqs, 'secs': secs, 'path': path,
    })
    prev = lid

manifest = json.load(open(MANIFEST))
if any(l['id'] == 'swe.ch1.l1' for l in manifest['lessons']):
    print('ALREADY REGISTERED — skipping manifest/registry edits')
    sys.exit(0)

# ---- manifest textual append (preserve compact style) ----
raw = open(MANIFEST, encoding='utf-8').read()
tail = '  ]\n}'
body = raw.rstrip('\n')
assert body.endswith(tail), 'manifest tail changed: %r' % body[-20:]
order = 130
lines = []
for e in entries:
    srcs = ', '.join('{"book": "SWE", "section": "%s"}' % s for s in e['secs'])
    lines.append(
        '    {"id": "%s", "track": "P3", "part": "I", "book": "SWE", "chapter": %d, "order": %d,\n'
        '     "title": {"ar": "%s", "en": "%s"},\n'
        '     "prerequisites": [%s],\n'
        '     "sources": [%s]}' % (
            e['id'], e['chapter'], order,
            e['ar'], e['en'],
            ', '.join('"%s"' % p for p in e['prereqs']),
            srcs))
    order += 1
body = body[:-len(tail)] + ',\n' + ',\n'.join(lines) + '\n' + tail + '\n'
open(MANIFEST, 'w', encoding='utf-8').write(body)
print('manifest: appended %d entries (orders 130-%d)' % (len(entries), order - 1))

# ---- registry loaders (anchor after swe.ch15.l4) ----
reg = open(REGISTRY, encoding='utf-8').read()
anchor = "'swe.ch15.l4': () => import('../../../content/part1/swe/ch15/lesson.swe.ch15.l4'),"
assert anchor in reg, 'registry anchor missing'
loader_lines = []
for e in entries:
    key = e['id']
    ch_tok = key.split('.')[1]
    l_tok = key.split('.')[2]
    dirn = 'appa' if ch_tok == 'appa' else ch_tok
    loader_lines.append("  '%s': () => import('../../../content/part1/swe/%s/lesson.swe.%s.%s'),"
                        % (key, dirn, ch_tok, l_tok))
reg = reg.replace(anchor, anchor + '\n' + '\n'.join(loader_lines), 1)
open(REGISTRY, 'w', encoding='utf-8').write(reg)
print('registry: appended %d loaders after swe.ch15.l4' % len(loader_lines))

# ---- final sanity ----
m = json.load(open(MANIFEST))
lessons = m['lessons']
ids = [l['id'] for l in lessons]
assert len(ids) == len(set(ids)) == 163, 'expected 163 unique lessons, got %d' % len(ids)
orders = sorted(l['order'] for l in lessons)
assert orders == list(range(1, 164)), 'orders not 1..163'
byid = {l['id']: l for l in lessons}
for l in lessons:
    for p in l['prerequisites']:
        assert p in byid, 'dangling prereq %s in %s' % (p, l['id'])
chs = sorted(set(l['chapter'] for l in lessons))
print('sanity OK: 163 lessons, orders 1..163, prereqs resolve, chapters:', chs)
