#!/usr/bin/env python3
"""M5: split over-long concept chunks (ar>150 or en>150 words) at the sentence
boundary nearest the midpoint. Content preserved verbatim — only a split added.
Also rewords the 3 comment-level input( mentions inside runnable code."""
import re, shutil, json, ast
from pathlib import Path

ROOT = Path('/home/z/my-project')
BACKUP = ROOT / 'scripts/scratch/m5-split-backup'
BACKUP.mkdir(parents=True, exist_ok=True)

AR_LETTER = r'\u0600-\u06FF'
# sentence end: [.!?…؛] followed by whitespace, not a decimal point, next char starts a word
SENT_BOUND = re.compile(r'(?<=[\.\?!…؛])\s+(?=[^\s])')

def wc(s):
    return len(s.trim().split()) if False else len([w for w in s.split() if w])

def best_split(s, force=False):
    """split string at sentence boundary nearest midpoint; return (a, b) or None.
    Both parts must be <=150 words and >=5 words. Fail loudly rather than duplicate.
    force=True splits even when the string is already <=150 words (bilingual pair
    alignment: when the sibling locale must split, this one follows)."""
    n = wc(s)
    if n <= 150 and not force:
        return None
    targets = n / 2
    bounds = [m.start() for m in SENT_BOUND.finditer(s)]
    cands = []
    for b in bounds:
        k = b - 1
        while k >= 0 and s[k] in ' \n\t':
            k -= 1
        if k >= 0 and s[k].isdigit():
            continue
        if k >= 1 and s[k] == '.' and s[k-1].isupper() and k >= 2 and s[k-2] == ' ':
            continue
        cands.append(b)
    if not cands:
        return None
    # feasible boundaries first (both parts <=150), then closest to midpoint
    feas = [p for p in cands if wc(s[:p]) <= 150 and wc(s[p:]) <= 150]
    pool = feas if feas else []
    if not pool:
        return None
    best = min(pool, key=lambda p: abs(wc(s[:p]) - targets))
    a, b = s[:best].strip(), s[best:].strip()
    if wc(a) < 5 or wc(b) < 5:
        return None
    return a, b

def escape_single(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")

CHUNK_RE = re.compile(
    r"(\{\s*\n(\s*)ar: '((?:[^'\\]|\\.)*)',\s*\n\s*en: '((?:[^'\\]|\\.)*)',\s*\n(\s*)\},)",
    re.DOTALL)

def unescape(s):
    return s.replace("\\'", "'").replace('\\\\', '\\')

def chunks_regions(txt):
    """yield (start, end) spans covering only `chunks: [ ... ],` array regions"""
    for m in re.finditer(r'chunks: \[', txt):
        i = m.end()
        depth = 1
        in_str = None
        while i < len(txt) and depth > 0:
            c = txt[i]
            if in_str:
                if c == '\\':
                    i += 2
                    continue
                if c == in_str:
                    in_str = None
            else:
                if c in ("'", '"', '`'):
                    in_str = c
                elif c == '[':
                    depth += 1
                elif c == ']':
                    depth -= 1
            i += 1
        yield m.end(), i - 1  # span inside brackets

def process_file(path):
    txt = path.read_text(encoding='utf-8')
    orig = txt
    rel = path.relative_to(ROOT)
    results = []
    # process regions from last to first so earlier offsets stay valid
    for rs, rend in sorted(list(chunks_regions(txt)), reverse=True):
        region = txt[rs:rend]
        new_region = region
        matches = list(CHUNK_RE.finditer(region))
        # apply in REVERSE order so earlier match offsets stay valid
        for m in reversed(matches):
            full, ind1, ar_raw, en_raw, ind2 = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
            ar, en = unescape(ar_raw), unescape(en_raw)
            sa, se = wc(ar), wc(en)
            if sa <= 150 and se <= 150:
                continue
            need_a, need_e = sa > 150, se > 150
            if not need_a and not need_e:
                continue
            sp_a = best_split(ar, force=need_e and not need_a)
            sp_e = best_split(en, force=need_a and not need_e)
            if sp_a is None or sp_e is None:
                results.append(('UNRESOLVED', str(rel), sa, se, bool(sp_a), bool(sp_e)))
                continue
            a1, a2 = sp_a
            e1, e2 = sp_e
            c1_ar, c2_ar = a1, a2
            c1_en, c2_en = e1, e2
            base = ind1
            repl = (
                "{\n" + base + f"ar: '{escape_single(c1_ar)}',\n" + base + f"en: '{escape_single(c1_en)}',\n" + ind2 + "},\n"
                + base + "{\n" + base + f"ar: '{escape_single(c2_ar)}',\n" + base + f"en: '{escape_single(c2_en)}',\n" + ind2 + "},"
            )
            new_region = new_region[:m.start(1)] + repl + new_region[m.end(1):]
            results.append(('SPLIT', str(rel), sa, se, wc(c1_ar), wc(c1_en), wc(c2_ar), wc(c2_en)))
        if new_region != region:
            # sanity: no duplicated chunk text introduced
            if re.search(r"(ar: '[^']{80,})',\s*\n\s*ar: '\1',", new_region):
                print('DUPLICATE GUARD HIT in', rel)
                continue
            txt = txt[:rs] + new_region + txt[rend:]
    if txt != orig:
        bk = BACKUP / rel
        bk.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, bk)
        path.write_text(txt, encoding='utf-8')
    return results

# ---------- input( comment rewording ----------
INPUT_FIXES = [
    ('content/part1/py4e/ch2/lesson.ch2.l5.ts',
     '# في برنامج حقيقي: input("ما اسمك؟ ")',
     '# في برنامج حقيقي: التابع input يقرأ الإجابة في name'),
    ('content/part1/py4e/ch5/lesson.ch5.l2.ts',
     "line = lines[i]   # في برنامج حقيقي: input('> ')",
     "line = lines[i]   # في برنامج حقيقي: التابع input يقرأ السطر عند المحث"),
    ('content/part1/py4e/ch7/lesson.ch7.l4.ts',
     "# في برنامج حقيقي: typed = input('Enter the file name: ')",
     '# في برنامج حقيقي: التابع input يقرأ اسم الملف إلى typed'),
]
for rel, old, new in INPUT_FIXES:
    p = ROOT / rel
    t = p.read_text(encoding='utf-8')
    if old in t:
        bk = BACKUP / Path(rel)
        bk.parent.mkdir(parents=True, exist_ok=True)
        if not bk.exists():
            shutil.copy2(p, bk)
        p.write_text(t.replace(old, new), encoding='utf-8')
        print(f'input( fix OK: {rel}')
    else:
        print(f'input( MISS: {rel}')

# ---------- chunk splitting ----------
targets = [ROOT / p for p in ast.literal_eval(open('/tmp/flagged.json').read())] if Path('/tmp/flagged.json').exists() else list((ROOT / 'content').rglob('*.ts'))
all_res = []
for p in sorted(targets):
    if p.suffix != '.ts':
        continue
    all_res += process_file(p)
splits = [r for r in all_res if r[0] == 'SPLIT']
unres = [r for r in all_res if r[0] == 'UNRESOLVED']
print(f'chunks split: {len(splits)}, unresolved: {len(unres)}')
for r in unres:
    print('  UNRESOLVED:', r)
