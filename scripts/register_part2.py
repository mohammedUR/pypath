#!/usr/bin/env python3
"""Register ALL Part II lessons (SWE ch13 + MLS + D2L): manifest.json entries
(orders 164-258) + registry.ts loaders. Idempotent: exits 0 if swe.ch13.l1
already registered. Titles/prereqs/sources/track/part extracted from the lesson
TS files. Global order = the A0..A9 path recorded in docs/PLAN.md."""
import json
import os
import re
import sys

ROOT = '/home/z/my-project'
MANIFEST = ROOT + '/content/manifest.json'
REGISTRY = ROOT + '/src/lib/content/registry.ts'

m = json.load(open(MANIFEST))
ids = {l['id'] for l in m['lessons']}
if 'swe.ch13.l1' in ids:
    print('already registered — nothing to do')
    sys.exit(0)

# Global order: (lesson id, file path)
PLAN = []
# A0: MLS appendix, then D2L ch2
for l in range(1, 4):
    PLAN.append('mls.appendix.l%d' % l)
for l in range(1, 4):
    PLAN.append('d2l.ch2.l%d' % l)
# A1: D2L ch1
for l in range(1, 4):
    PLAN.append('d2l.ch1.l%d' % l)
# A2: MLS ch1-6
for ch, cnt in [(1, 4), (2, 5), (3, 5), (4, 4), (5, 4), (6, 5)]:
    for l in range(1, cnt + 1):
        PLAN.append('mls.ch%d.l%d' % (ch, l))
# A3: MLS ch7, then D2L ch3-6
for l in range(1, 4):
    PLAN.append('mls.ch7.l%d' % l)
for ch in (3, 4, 5, 6):
    for l in range(1, 4):
        PLAN.append('d2l.ch%d.l%d' % (ch, l))
# A4: D2L ch7, ch8, ch14
for ch in (7, 8):
    for l in range(1, 4):
        PLAN.append('d2l.ch%d.l%d' % (ch, l))
for l in range(1, 6):
    PLAN.append('d2l.ch14.l%d' % l)
# A5: D2L ch9, ch10, ch15, ch16
for ch, cnt in [(9, 3), (10, 4), (15, 4), (16, 3)]:
    for l in range(1, cnt + 1):
        PLAN.append('d2l.ch%d.l%d' % (ch, l))
# A6: D2L ch11
for l in range(1, 4):
    PLAN.append('d2l.ch11.l%d' % l)
# A7: D2L ch12, ch13, ch19
for ch, cnt in [(12, 4), (13, 2), (19, 2)]:
    for l in range(1, cnt + 1):
        PLAN.append('d2l.ch%d.l%d' % (ch, l))
# A8: D2L ch17, ch18, ch20, ch21
for ch in (17, 18, 20, 21):
    PLAN.append('d2l.ch%d.l1' % ch)
# A9: SWE ch13
for l in range(1, 5):
    PLAN.append('swe.ch13.l%d' % l)

assert len(PLAN) == 95, len(PLAN)

def lesson_path(lid):
    book, rest = lid.split('.', 1)
    ch_tok, l_tok = rest.split('.l')
    if book == 'mls':
        d = 'appendix' if ch_tok == 'appendix' else ch_tok
        return '%s/content/part2/mls/%s/lesson.mls.%s.l%s.ts' % (ROOT, d, ch_tok, l_tok)
    if book == 'd2l':
        return '%s/content/part2/d2l/%s/lesson.d2l.%s.l%s.ts' % (ROOT, ch_tok, ch_tok, l_tok)
    return '%s/content/part1/swe/%s/lesson.swe.%s.l%s.ts' % (ROOT, ch_tok, ch_tok, l_tok)

def book_of(lid):
    return 'MLS' if lid.startswith('mls.') else ('D2L' if lid.startswith('d2l.') else 'SWE')

def chapter_of(lid):
    ch_tok = lid.split('.')[1]
    if ch_tok == 'appendix':
        return 8
    return int(ch_tok.replace('ch', ''))

def track_of(lid):
    if lid.startswith('swe.'):
        return 'A9'
    if lid.startswith('mls.appendix'):
        return 'A0'
    if lid.startswith('mls.ch7'):
        return 'A3'
    return 'A2'  # MLS ch1-6

entries = []
for lid in PLAN:
    path = lesson_path(lid)
    if not os.path.exists(path):
        sys.exit('MISSING lesson file: %s' % path)
    src = open(path, encoding='utf-8').read()
    mt = re.search(r"^  title: \{ ar: ['\"](.+?)['\"], en: ['\"](.+?)['\"] \},?$", src, re.M)
    if not mt:
        mt = re.search(r"^  title: \{\n\s*ar: ['\"](.+?)['\"],\s*\n\s*en: ['\"](.+?)['\"],?\n\s*\},?$", src, re.M)
    assert mt, 'top-level title not found in %s' % path
    ar, en = mt.group(1), mt.group(2)
    mp = re.search(r"^  prerequisites: \[([^\]]*)\],?$", src, re.M)
    assert mp, 'prerequisites not found in %s' % path
    prereqs = [x.strip().strip("'\"") for x in mp.group(1).split(',') if x.strip()]
    secs = sorted(set(re.findall(r"section: '([a-z0-9]+\.[a-z0-9]+\.s[a-z0-9]+)'", src)))
    if not secs:
        secs = sorted(set(re.findall(r"book: '([A-Z]+)', section: '([^']+)'", src)))
        secs = [b for _, b in secs]
    assert secs, 'no source sections in %s' % path
    book = book_of(lid)
    for sec in secs:
        assert sec.split('.')[0] == book.lower().replace('swe', 'swe'), (lid, sec)
    entries.append({
        'id': lid,
        'track': track_of(lid),
        'part': 'II',
        'book': book,
        'chapter': chapter_of(lid),
        'order': 163 + 1 + PLAN.index(lid),
        'title': {'ar': ar, 'en': en},
        'prerequisites': prereqs,
        'sources': [{'book': book, 'section': sec} for sec in secs],
    })

# ---- manifest: append textually before closing bracket, compact established style
mtext = open(MANIFEST, encoding='utf-8').read()
assert mtext.rstrip().endswith('}'), 'unexpected manifest tail'
add = ',\n'.join(
    json.dumps(e, ensure_ascii=False, separators=(', ', ': ')) for e in entries
)
idx = mtext.rfind('\n  ]')
assert idx > 0
new_mtext = mtext[:idx] + ',\n    ' + add.replace('\n', '\n    ') + mtext[idx:]
json.loads(new_mtext)  # hard fail on malformed json
open(MANIFEST, 'w', encoding='utf-8').write(new_mtext)

# ---- registry: append loaders after the last known loader line
rtext = open(REGISTRY, encoding='utf-8').read()
last = "'swe.appa.l4': () => import('../../../content/part1/swe/appa/lesson.swe.appa.l4'),"
assert last in rtext, 'registry anchor missing'
add_lines = []
for e in entries:
    lid = e['id']
    path = lesson_path(lid)
    rel = path.replace(ROOT + '/', '../../../')
    add_lines.append("  '%s': () => import('%s')," % (lid, rel))
rtext = rtext.replace(last, last + '\n' + '\n'.join(add_lines), 1)
open(REGISTRY, 'w', encoding='utf-8').write(rtext)

# ---- sanity
m2 = json.load(open(MANIFEST))
lessons = m2['lessons']
print('manifest lessons:', len(lessons))
assert len({l['id'] for l in lessons}) == len(lessons), 'duplicate ids'
orders = [l['order'] for l in lessons]
assert orders == list(range(1, len(lessons) + 1)), 'orders not sequential'
known = {l['id'] for l in lessons}
for l in lessons:
    for p in l['prerequisites']:
        assert p in known, '%s: unresolved prereq %s' % (l['id'], p)
print('orders 1-%d sequential, prereqs resolve, %d new Part II entries' % (len(lessons), len(entries)))
