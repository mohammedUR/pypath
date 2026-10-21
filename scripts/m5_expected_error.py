#!/usr/bin/env python3
"""M5: add expectedError CI metadata to the 10 intentional-crash teaching blocks."""
from pathlib import Path

ROOT = Path('/home/z/my-project')

EDITS = [
    # (file, anchor, insertion-after-anchor, expectedError)
    ('content/part1/py4e/ch1/lesson.ch1.l3.ts', "kind: 'predict',\n", 'predict', 'NameError'),
    ('content/part1/py4e/ch1/lesson.ch1.l4.ts', "kind: 'predict',\n", 'predict', 'SyntaxError'),
    ('content/part1/py4e/ch1/lesson.ch1.l5.ts', "kind: 'predict',\n", 'predict', 'NameError'),
    ('content/part1/py4e/ch1/lesson.ch1.l5.ts', "kind: 'sandbox',\n", 'sandbox', 'NameError'),
    ('content/part1/py4e/ch3/lesson.ch3.l4.ts', "kind: 'predict',\n", 'predict', 'ValueError'),
    ('content/part1/py4e/ch4/lesson.ch4.l2.ts', "kind: 'sandbox',\n", 'sandbox', 'ValueError'),
    ('content/part1/py4e/ch1/lesson.ch1.l1.ts', "id: 'ex3.debug-print',\n", 'debug', 'SyntaxError'),
    ('content/part1/py4e/ch1/lesson.ch1.l6.ts', "id: 'ex5.debug-card',\n", 'debug', 'SyntaxError'),
    ('content/part1/py4e/ch3/lesson.ch3.l6.ts', "id: 'ex5.debug-crash',\n", 'debug', 'ValueError'),
    ('content/part1/py4e/ch4/lesson.ch4.l6.ts', "id: 'ex5.debug-order',\n", 'debug', 'NameError'),
]

for rel, anchor, kind, err in EDITS:
    p = ROOT / rel
    t = p.read_text(encoding='utf-8')
    if 'expectedError' in t:
        print(f'skip (already has): {rel}')
        continue
    n_anchor = t.count(anchor)
    assert n_anchor == 1, f'{rel}: anchor count {n_anchor} for {anchor!r}'
    indent = '      ' if kind in ('predict', 'sandbox') else '      '
    ins = anchor + indent + f"expectedError: '{err}',  // intentional crash-teaching; verified by checks replay\n"
    t = t.replace(anchor, ins, 1)
    p.write_text(t, encoding='utf-8')
    print(f'OK {rel} -> {kind} expectedError={err}')
