#!/usr/bin/env python3
"""M5 Arabic proofread scanner — scans Arabic prose in lesson/i18n/exam TS files
for high-confidence typo patterns and terminology inconsistencies."""
import re, json, sys, os
from pathlib import Path

ROOT = Path('/home/z/my-project')
AR = re.compile(r'[\u0600-\u06FF]')

# high-confidence typo patterns (word-boundary anchored where possible)
PATTERNS = [
    (r'(?<![\u0600-\u06FF])الى(?![\u0600-\u06FF])', 'الى → إلى (همزة ناقصة)'),
    (r'(?<![\u0600-\u06FF])إلي(?![-\u0600-\u06FF])', 'إلي → إلى'),
    (r'فى(?![\u0600-\u06FF])', 'فى → في (ياء مصرية)'),
    (r'(?<![\u0600-\u06FF])هذة(?![\u0600-\u06FF])', 'هذة → هذه'),
    (r'(?<![\u0600-\u06FF])الشئ(?![\u0600-\u06FF])', 'الشئ → الشيء'),
    (r'(?<![\u0600-\u06FF])شئ(?![\u0600-\u06FF])', 'شئ → شيء'),
    (r'أنشاء(?![\u0600-\u06FF])', 'أنشاء → إنشاء'),
    (r'(?<![\u0600-\u06FF])علي(?!ك|ه|ها|هم|نا|ها|كن|س|[\u0600-\u06FF])', 'علي → على (حرف جر، إن لم يكن علماً)'),
    (r'(?<![\u0600-\u06FF])لكى(?![\u0600-\u06FF])', 'لكى → لكي'),
    (r'(?<![\u0600-\u06FF])حتى(?![\u0600-\u06FF])ل', 'حتى ل → حتى لا'),
    (r'اللة', 'اللة → خطأ إملائي'),
    (r'(?<![\u0600-\u06FF])انشاء(?![\u0600-\u06FF])الله', 'انشاء الله → إن شاء الله'),
    (r'مثلا(?![\u0600-\u06FF])', 'مثلا → مثلًا (تنوين)'),
    (r'أبدا(?![\u0600-\u06FF])', 'أبدا → أبدًا'),
    (r'(?<![\u0600-\u06FF])اكثر(?![\u0600-\u06FF])', 'اكثر → أكثر'),
    (r'(?<![\u0600-\u06FF])اقل(?![\u0600-\u06FF])', 'اقل → أقل'),
    (r'(?<![\u0600-\u06FF])اولا(?![\u0600-\u06FF])', 'اولا → أولًا'),
    (r'(?<![\u0600-\u06FF])احيانا(?![\u0600-\u06FF])', 'احيانا → أحيانًا'),
    (r'(?<![\u0600-\u06FF])دائما(?![\u0600-\u06FF])', 'دائما → دائمًا'),
    (r'(?<![\u0600-\u06FF])ايضا(?![\u0600-\u06FF])', 'ايضا → أيضًا'),
    (r'(?<![\u0600-\u06FF])ايضاً', 'ايضاً → أيضًا (همزة+تنوين)'),
    (r'(?<![\u0600-\u06FF])أنواعاً', 'أنواعاً → أنواعًا (مفعول مطلق منصوب)'),
    (r'(?<![\u0600-\u06FF])بشكلٍ', 'بشكلٍ (كسر غير مطلوب)'),
    (r'إنشائية', 'إنشائية? تحقق (إنشائي vs إنشائي)'),
    (r'(?<![\u0600-\u06FF])الآن(?![\u0600-\u06FF])فقط', 'OK-marker'),  # no-op marker
    (r'(?<![\u0600-\u06FF])خطاً(?=\s*(?:من|فادح))', 'خطاً → خطأً? تحقق'),
    (r'(?<![\u0600-\u06FF])تصحيحاً', 'تصحيحاً → تحقق من التنوين'),
    (r'(?<![\u0600-\u06FF])شئاً', 'شئاً → شيءًا'),
    (r'(?<![\u0600-\u06FF])تلقائياً', 'تلقائياً → تلقائيًا'),
    (r'(?<![\u0600-\u06FF])بسرعةً', 'بسرعةً → بسرعة'),
    (r'إستخدام', 'إستخدام → استخدام (همزة وصل)'),
    (r'إستخدم', 'إستخدم → استخدم'),
    (r'إنشاء', 'OK-marker2'),
    (r'(?<![\u0600-\u06FF])إستعراض', 'إستعراض → استعراض'),
    (r'(?<![\u0600-\u06FF])إجتماع', 'إجتماع → اجتماع'),
    (r'(?<![\u0600-\u06FF])إمتياز', 'إمتياز → امتياز'),
    (r'(?<![\u0600-\u06FF])إنطلاق', 'إنطلاق → انطلاق'),
    (r'(?<![\u0600-\u06FF])إنشاء(?![\u0600-\u06FF])', 'إنشاء → إنشاء? (إنشاء=بناء صحيح، إن شاء للدعاء)'),
    (r'(?<![\u0600-\u06FF])مسؤل', 'مسؤل → مسؤول'),
    (r'(?<![\u0600-\u06FF])مباشرت', 'مباشرت → مباشرة'),
    (r'(?<![\u0600-\u06FF])عنوانIP', 'تنسيق'),
    (r'(?<![\u0600-\u06FF])بأي(?![\u0600-\u06FF])شكل', 'OK-marker3'),
]

TERMS = {  # allowed canonical forms; flag deviants
    'بايثون': ['بيثون', 'بايثون', 'Pythonل'],
    'باي تورش': ['بايتورش', 'باي‌تورش'],
    'نومباي': ['نومباى'],
    'المتعلم': ['المتعلّم'],  # both fine — skip real check
}
# terminology deviants (high confidence only)
TERM_PATTERNS = [
    (r'(?<![\u0600-\u06FF])بيثون(?![\u0600-\u06FF])', 'بيثون → بايثون (اتساق المصطلح)'),
    (r'(?<![\u0600-\u06FF])بايثون(?![\u0600-\u06FF])', 'بايثون → بايثون (اتساق)'),
    (r'(?<![\u0600-\u06FF])بايتورش(?![\u0600-\u06FF])', 'بايتورش → باي تورش (اتساق)'),
    (r'(?<![\u0600-\u06FF])كاجل(?![\u0600-\u06FF])', 'كاجل → Kaggle (اتساق: الاسم اللاتيني)'),
    (r'(?<![\u0600-\u06FF])سكالرن(?![\u0600-\u06FF])', 'سكالرن → scikit-learn (اتساق)'),
    (r'(?<![\u0600-\u06FF])نيورال(?![\u0600-\u06FF])', 'نيورال → شبكة عصبية (اتساق)'),
]

# mechanical issues
MECH = [
    (r'  +', 'مسافة مزدوجة'),
    (r' ،', 'مسافة قبل الفاصلة'),
    (r' \.', 'مسافة قبل نقطة'),
    (r'،،|\.\.|\!\!|\?\?', 'علامة مكررة'),
    (r'[\u064B-\u0652]{2,}', 'تشكيل مزدوج'),
    (r'\u0640', 'تطويل (tatweel)'),
    (r'[\u0600-\u06FF]\u0640', 'تطويل'),
]

STR_RE = re.compile(r"(?:'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)", re.DOTALL)

def extract_strings(path):
    txt = path.read_text(encoding='utf-8', errors='replace')
    out = []
    for i, line in enumerate(txt.splitlines(), 1):
        for m in STR_RE.finditer(line):
            s = m.group(1) if m.group(1) is not None else m.group(2)
            if s and AR.search(s):
                out.append((i, s))
    return out

def scan():
    targets = []
    for base in ['content/part1', 'content/part2', 'content/exam']:
        targets += list((ROOT / base).rglob('*.ts'))
    targets.append(ROOT / 'src/lib/i18n/ar.ts')
    for v in (ROOT / 'src/views').glob('*.tsx'):
        targets.append(v)
    findings = []
    files_scanned = 0
    strings_scanned = 0
    for f in targets:
        rel = str(f.relative_to(ROOT))
        try:
            pairs = extract_strings(f)
        except Exception as e:
            findings.append({'file': rel, 'line': 0, 'str': '', 'issue': f'unreadable: {e}'})
            continue
        files_scanned += 1
        for line_no, s in pairs:
            strings_scanned += 1
            for pat, label in PATTERNS + TERM_PATTERNS:
                if label.startswith('OK-marker'):
                    continue
                if re.search(pat, s):
                    findings.append({'file': rel, 'line': line_no, 'str': s[:120], 'issue': label})
            for pat, label in MECH:
                if re.search(pat, s):
                    # double-space inside code strings is fine; only flag prose-ish strings
                    if label == 'مسافة مزدوجة' and ('print' in s or 'def ' in s or '=' in s or '#' in s):
                        continue
                    if label in ('علامة مكررة',) and ('print' in s or '==' in s):
                        continue
                    findings.append({'file': rel, 'line': line_no, 'str': s[:120], 'issue': label})
    rep = {'files': files_scanned, 'strings': strings_scanned, 'findings': findings}
    out = ROOT / 'scripts/scratch/m5-arabic-report.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(rep, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f"scanned {files_scanned} files, {strings_scanned} Arabic strings")
    print(f"findings: {len(findings)}")
    from collections import Counter
    c = Counter(f['issue'] for f in findings)
    for issue, n in c.most_common(40):
        print(f"  {n:4d}  {issue}")
    return rep

if __name__ == '__main__':
    scan()
