#!/usr/bin/env python3
"""M5 Arabic polish fixer — normalizes tanwin convention + fixes real typos.
Backs up every modified file to /home/z/my-project/scripts/scratch/m5-backup/."""
import re, shutil
from pathlib import Path

ROOT = Path('/home/z/my-project')
BACKUP = ROOT / 'scripts/scratch/m5-backup'
BACKUP.mkdir(parents=True, exist_ok=True)

targets = list((ROOT / 'content').rglob('*.ts')) + [ROOT / 'src/lib/i18n/ar.ts'] + list((ROOT / 'src/views').glob('*.tsx')) + list((ROOT / 'src/components').rglob('*.tsx')) + list((ROOT / 'src/components').rglob('*.ts'))

TANWIN = '\u064B'

def word_boundary_pre(s, start):
    """true if char before match position is not an Arabic letter"""
    if start == 0:
        return True
    c = s[start - 1]
    return not ('\u0600' <= c <= '\u06FF')

def word_boundary_post(s, end):
    if end >= len(s):
        return True
    c = s[end]
    return not ('\u0600' <= c <= '\u06FF')

BARE_ADVERBS = [
    ('دائما', 'دائمًا'), ('أبدا', 'أبدًا'), ('ابدا', 'أبدًا'),
    ('مثلا', 'مثلًا'), ('تلقائيا', 'تلقائيًا'), ('ايضا', 'أيضًا'),
    ('احيانا', 'أحيانًا'), ('اولا', 'أولًا'), ('اكثر', 'أكثر'), ('اقل', 'أقل'),
    ('دومًا', 'دومًا'),
]

def fix_text(txt):
    n_changes = 0
    # 1) tanwin convention: word-final (alef + fathatan) -> (fathatan + alef)
    out = []
    i = 0
    while i < len(txt):
        if txt[i] == 'ا' and i + 1 < len(txt) and txt[i + 1] == TANWIN and word_boundary_post(txt, i + 2):
            out.append(TANWIN)
            out.append('ا')
            n_changes += 1
            i += 2
            continue
        out.append(txt[i])
        i += 1
    txt = ''.join(out)

    # 2) bare adverbs missing tanwin/hamza (word-bounded, not followed by any diacritic)
    for bad, good in BARE_ADVERBS:
        pat = re.compile(r'(?<![\u0600-\u06FF])' + bad + r'(?![\u0600-\u06FF\u064B-\u065F])')
        txt, n = pat.subn(good, txt)
        n_changes += n
    return txt, n_changes

changed_files = []
total = 0
for f in targets:
    if not f.exists():
        continue
    txt = f.read_text(encoding='utf-8')
    new, n = fix_text(txt)
    if n and new != txt:
        rel = f.relative_to(ROOT)
        bk = BACKUP / rel
        bk.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, bk)
        f.write_text(new, encoding='utf-8')
        changed_files.append((str(rel), n))
        total += n

print(f'files changed: {len(changed_files)}, total replacements: {total}')
for rel, n in sorted(changed_files, key=lambda x: -x[1])[:25]:
    print(f'  {n:4d}  {rel}')

# 3) real bug fixes (surgical, after normalization)
fixes = [
    ('content/part1/swe/ch6/lesson.swe.ch6.l3.ts',
     'تضيف إلى إلى القائمة وتتجاهل body',
     'تضيف إلى القائمة وتتجاهل body'),
    ('content/part1/swe/ch2/lesson.swe.ch2.l3.ts',
     'وكم كان كان أن يُكتشف في مرحلته؟',
     'وكم تأخر عن مرحلته؟'),
]
for path, old, new in fixes:
    f = ROOT / path
    txt = f.read_text(encoding='utf-8')
    if old in txt:
        f.write_text(txt.replace(old, new), encoding='utf-8')
        print(f'BUGFIX OK: {path}')
    else:
        # try to locate approximate for diagnosis
        idx = txt.find('إلى إلى')
        idx2 = txt.find('كان كان')
        print(f'BUGFIX MISS: {path} (إلى إلى at {idx}, كان كان at {idx2})')
