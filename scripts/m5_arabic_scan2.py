#!/usr/bin/env python3
"""M5 Arabic scan pass 2 — detail dump for real findings, prose-only mechanical checks."""
import re, json
from pathlib import Path
from collections import Counter

ROOT = Path('/home/z/my-project')
AR = re.compile(r'[\u0600-\u06FF]')

REAL_PATTERNS = [
    (r'(?<![\u0600-\u06FF])فى(?![\u0600-\u06FF])', 'فى → في'),
    (r'(?<![\u0600-\u06FF])دائما(?![\u0600-\u06FF])', 'دائما → دائمًا'),
    (r'(?<![\u0600-\u06FF])تلقائياً', 'تلقائياً → تلقائيًا'),
    (r'(?<![\u0600-\u06FF])مثلا(?![\u0600-\u06FF])', 'مثلا → مثلًا'),
    (r'(?<![\u0600-\u06FF])أبدا(?![\u0600-\u06FF])', 'أبدا → أبدًا'),
    (r'(?<![\u0600-\u06FF])إستخدام', 'إستخدام → استخدام'),
    (r'(?<![\u0600-\u06FF])إستخدم', 'إستخدم → استخدم'),
    (r'(?<![\u0600-\u06FF])مسؤل', 'مسؤل → مسؤول'),
    (r'(?<![\u0600-\u06FF])شئ(?![\u0600-\u06FF])', 'شئ → شيء'),
    (r'(?<![\u0600-\u06FF])هذة(?![\u0600-\u06FF])', 'هذة → هذه'),
    (r'(?<![\u0600-\u06FF])الى(?![\u0600-\u06FF])', 'الى → إلى'),
    (r'(?<![\u0600-\u06FF])اكثر(?![\u0600-\u06FF])', 'اكثر → أكثر'),
    (r'(?<![\u0600-\u06FF])اقل(?![\u0600-\u06FF])', 'اقل → أقل'),
    (r'(?<![\u0600-\u06FF])احيانا(?![\u0600-\u06FF])', 'احيانا → أحيانًا'),
    (r'(?<![\u0600-\u06FF])اولا(?![\u0600-\u06FF])', 'اولا → أولًا'),
    (r'(?<![\u0600-\u06FF])ايضا(?![\u0600-\u06FF])', 'ايضا → أيضًا'),
    (r'(?<![\u0600-\u06FF])ايضاً', 'ايضاً → أيضًا'),
    (r'(?<![\u0600-\u06FF])بيثون(?![\u0600-\u06FF])', 'بيثون → بايثون'),
    (r'(?<![\u0600-\u06FF])بايتورش(?![\u0600-\u06FF])', 'بايتورش → باي تورش'),
]

def is_prose(s):
    """mostly-Arabic prose string (not code)"""
    ar_chars = len(AR.findall(s))
    if ar_chars < 3:
        return False
    if ar_chars / max(len(s), 1) < 0.35:
        return False
    code_markers = ('print', 'def ', '=', 'import', 'for ', 'if ', '#', '{', '}', '(', ')', '[', ']')
    if any(m in s for m in code_markers):
        return False
    return True

STR_RE = re.compile(r"(?:'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)", re.DOTALL)

def main():
    targets = []
    for base in ['content/part1', 'content/part2', 'content/exam']:
        targets += list((ROOT / base).rglob('*.ts'))
    targets.append(ROOT / 'src/lib/i18n/ar.ts')
    for v in (ROOT / 'src/views').glob('*.tsx'):
        targets.append(v)

    real = []
    prose_mech = []
    strings_scanned = 0
    for f in targets:
        rel = str(f.relative_to(ROOT))
        txt = f.read_text(encoding='utf-8', errors='replace')
        for i, line in enumerate(txt.splitlines(), 1):
            for m in STR_RE.finditer(line):
                s = m.group(1) if m.group(1) is not None else m.group(2)
                if not s or not AR.search(s):
                    continue
                strings_scanned += 1
                for pat, label in REAL_PATTERNS:
                    if re.search(pat, s):
                        real.append({'file': rel, 'line': i, 'str': s, 'issue': label})
                if is_prose(s):
                    if '  ' in s:
                        prose_mech.append({'file': rel, 'line': i, 'str': s, 'issue': 'مسافة مزدوجة في نثر'})
                    if re.search(r'[\u0640]', s):
                        prose_mech.append({'file': rel, 'line': i, 'str': s, 'issue': 'تطويل في نثر'})
                    if re.search(r' ،| \.', s):
                        prose_mech.append({'file': rel, 'line': i, 'str': s, 'issue': 'مسافة قبل ترقيم'})
                    if re.search(r'،،|\.\.(?!\.)|(?<!\.)\.\.(?!\.)|!!|؟؟|\?\?', s):
                        prose_mech.append({'file': rel, 'line': i, 'str': s, 'issue': 'علامة مكررة في نثر'})
                    # repeated word
                    for w in re.finditer(r'(?<![\u0600-\u06FF])([\u0600-\u06FF]{2,})\s+\1(?![\u0600-\u06FF])', s):
                        prose_mech.append({'file': rel, 'line': i, 'str': s, 'issue': f'كلمة مكررة: {w.group(1)}'})

    print(f"strings scanned: {strings_scanned}")
    print(f"== REAL spelling/term findings: {len(real)}")
    for r in real:
        print(f"  {r['file']}:{r['line']} [{r['issue']}] {r['str'][:100]}")
    print(f"== prose mechanical: {len(prose_mech)}")
    cnt = Counter(m['issue'] for m in prose_mech)
    for k, n in cnt.most_common():
        print(f"  {n}  {k}")
    for m in prose_mech[:60]:
        print(f"  {m['file']}:{m['line']} [{m['issue']}] {m['str'][:100]}")

    out = ROOT / 'scripts/scratch/m5-arabic-real.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({'real': real, 'mech': prose_mech}, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f"saved → {out}")

if __name__ == '__main__':
    main()
