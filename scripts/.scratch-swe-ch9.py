#!/usr/bin/env python3
"""Scratch: hand-verify every runnable snippet destined for SWE ch9 lessons."""
import ast

ok = True


def check(name, got, want):
    global ok
    good = got == want
    if not good:
        ok = False
    print(f"{'PASS' if good else 'FAIL'} {name}: {got!r}" + ("" if good else f"  want {want!r}"))


def run(code):
    import contextlib, io
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(code, "<scratch>", "exec"), {})
    return buf.getvalue()


# ---------- l1 predict ----------
l1_predict = """
findings = ['critical', 'minor', 'major', 'critical']
critical = 0
for f in findings:
    if f == 'critical':
        critical = critical + 1
print('critical findings: %d' % critical)
"""
check("l1.predict", run(l1_predict), "critical findings: 2\n")

# ---------- l1 worked ----------
l1_worked = """
logged = ['critical', 'major', 'minor', 'major', 'critical']
counts = {}
for f in logged:
    counts[f] = counts.get(f, 0) + 1
print('logged defects: %d' % len(logged))
for sev in ['critical', 'major', 'minor']:
    print('%s: %d' % (sev, counts.get(sev, 0)))
"""
check(
    "l1.worked",
    run(l1_worked),
    "logged defects: 5\ncritical: 2\nmajor: 2\nminor: 1\n",
)

# ---------- l1 trace ----------
l1_trace = """
sev = 'major'
weights = {'critical': 3, 'major': 2, 'minor': 1}
print(weights[sev])
print(weights.get('blocker', 0))
"""
check("l1.trace", run(l1_trace), "2\n0\n")

# ---------- l1 ex1 write_code scorer ----------
FINDINGS = [
    ('critical', 'lock acquired but never released'),
    ('major', 'name misleads the reader'),
    ('minor', 'spacing inconsistent'),
    ('major', 'error path leaks the file handle'),
]
WEIGHTS = {'critical': 3, 'major': 2, 'minor': 1}


def score(findings):
    total = 0
    for sev, desc in findings:
        total = total + WEIGHTS[sev]
    return total


check("l1.ex1.score", score(FINDINGS), 8)
check("l1.ex1.len", len(FINDINGS), 4)
check("l1.ex1.criticals", len([f for f in FINDINGS if f[0] == 'critical']), 1)
l1_ex1_out = """
FINDINGS = [
    ('critical', 'lock acquired but never released'),
    ('major', 'name misleads the reader'),
    ('minor', 'spacing inconsistent'),
    ('major', 'error path leaks the file handle'),
]
WEIGHTS = {'critical': 3, 'major': 2, 'minor': 1}

def score(findings):
    total = 0
    for sev, desc in findings:
        total = total + WEIGHTS[sev]
    return total

print('findings: %d' % len(FINDINGS))
print('score: %d' % score(FINDINGS))
"""
check("l1.ex1.out", run(l1_ex1_out), "findings: 4\nscore: 8\n")

# ---------- l2 predict ----------
l2_predict = """
comment = 'nit: add a space after the comma'
print(comment.startswith('nit:'))
print('blocking' in comment)
"""
check("l2.predict", run(l2_predict), "True\nFalse\n")

# ---------- l2 worked ----------
l2_worked = """
waits = [2, 9, 1, 40, 3]
within_day = 0
for w in waits:
    if w <= 24:
        within_day = within_day + 1
print('changes: %d' % len(waits))
print('reviewed within a day: %d' % within_day)
print('longest wait: %d' % max(waits))
"""
check("l2.worked", run(l2_worked), "changes: 5\nreviewed within a day: 4\nlongest wait: 40\n")

# ---------- l2 trace ----------
l2_trace = """
def kind(c):
    if c.startswith('nit:'):
        return 'nit'
    if c.startswith('blocking:'):
        return 'blocking'
    return 'note'

print(kind('nit: spacing'))
print(kind('blocking: data loss'))
print(kind('looks right to me'))
"""
check("l2.trace", run(l2_trace), "nit\nblocking\nnote\n")

# ---------- l2 ex1 classifier ----------
COMMENTS = [
    'nit: rename x to total',
    'blocking: this drops the last item',
    'does this handle the empty list?',
    'nit: add a space after the comma',
    'question: why 79 and not 88?',
]


def classify(comment):
    if comment.startswith('nit:'):
        return 'nit'
    if comment.startswith('blocking:'):
        return 'blocking'
    if comment.endswith('?'):
        return 'question'
    return 'note'


def classify_comments(comments):
    counts = {'nit': 0, 'blocking': 0, 'question': 0, 'note': 0}
    for c in comments:
        k = classify(c)
        counts[k] = counts[k] + 1
    return counts


counts = classify_comments(COMMENTS)
check("l2.ex1.counts", counts, {'nit': 2, 'blocking': 1, 'question': 2, 'note': 0})
l2_ex1_out = """
COMMENTS = [
    'nit: rename x to total',
    'blocking: this drops the last item',
    'does this handle the empty list?',
    'nit: add a space after the comma',
    'question: why 79 and not 88?',
]

def classify(comment):
    if comment.startswith('nit:'):
        return 'nit'
    if comment.startswith('blocking:'):
        return 'blocking'
    if comment.endswith('?'):
        return 'question'
    return 'note'

def classify_comments(comments):
    counts = {'nit': 0, 'blocking': 0, 'question': 0, 'note': 0}
    for c in comments:
        k = classify(c)
        counts[k] = counts[k] + 1
    return counts

counts = classify_comments(COMMENTS)
for k in ['blocking', 'question', 'nit', 'note']:
    print('%s: %d' % (k, counts.get(k, 0)))
"""
check(
    "l2.ex1.out",
    run(l2_ex1_out),
    "blocking: 1\nquestion: 2\nnit: 2\nnote: 0\n",
)

# ---------- l3 predict ----------
l3_predict = """
import ast
tree = ast.parse('try:\\n    pass\\nexcept:\\n    pass\\n')
for node in ast.walk(tree):
    if isinstance(node, ast.ExceptHandler):
        print(node.type)
"""
check("l3.predict", run(l3_predict), "None\n")

# ---------- l3 worked: bare except detector ----------
l3_worked = """
import ast

SAMPLE = '''def load(path):
    try:
        return open(path).read()
    except:
        return ''
'''

tree = ast.parse(SAMPLE)
bare = 0
for node in ast.walk(tree):
    if isinstance(node, ast.ExceptHandler) and node.type is None:
        bare = bare + 1
print('bare except: %d' % bare)
"""
check("l3.worked", run(l3_worked), "bare except: 1\n")

# ---------- l3 ex1 write_code: functions without docstring ----------
l3_sample = '''def ok_total(a, b):
    """Return the sum of a and b."""
    return a + b

def hidden(path):
    return path

def greet(name):
    """Say hello."""
    print('hello ' + name)
'''


def missing_docs(source):
    tree = ast.parse(source)
    missing = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and ast.get_docstring(node) is None:
            missing.append(node.name)
    return missing


check("l3.ex1.missing", missing_docs(l3_sample), ['hidden'])
check("l3.ex1.tiny", missing_docs('def f():\n    return 1\n'), ['f'])
check(
    "l3.ex1.clean",
    missing_docs('def g():\n    """doc"""\n    return 2\n'),
    [],
)
l3_ex1_out = """
import ast

SAMPLE = '''def ok_total(a, b):
    \"\"\"Return the sum of a and b.\"\"\"
    return a + b

def hidden(path):
    return path

def greet(name):
    \"\"\"Say hello.\"\"\"
    print('hello ' + name)
'''

def missing_docs(source):
    tree = ast.parse(source)
    missing = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and ast.get_docstring(node) is None:
            missing.append(node.name)
    return missing

missing = missing_docs(SAMPLE)
print('functions without docstring: %d' % len(missing))
print(missing[0])
"""
check("l3.ex1.out", run(l3_ex1_out), "functions without docstring: 1\nhidden\n")

# ---------- l3 sandbox sample ----------
l3_sandbox = """
import ast

SAMPLE2 = '''def report(items):
    # FIXME: this loop re-scans the list on every call, find a cheaper way
    total = 0
    for it in items:
        total = total + it
    return total
'''

tree = ast.parse(SAMPLE2)
funcs = 0
for node in ast.walk(tree):
    if isinstance(node, ast.FunctionDef):
        funcs = funcs + 1
print('functions: %d' % funcs)
print('docstring: %s' % ast.get_docstring(tree.body[0]))

for line in SAMPLE2.split('\\n'):
    if 'TODO' in line or 'FIXME' in line:
        print('flagged: %s' % line.strip())
"""
check("l3.sandbox", run(l3_sandbox), "functions: 1\ndocstring: None\nflagged: # FIXME: this loop re-scans the list on every call, find a cheaper way\n")

# ---------- l4 predict ----------
l4_predict = """
source = 'short\\n' + 'x' * 80 + '\\nalso short\\n'
for n, line in enumerate(source.split('\\n'), start=1):
    if len(line) > 79:
        print('long line: %d' % n)
"""
check("l4.predict", run(l4_predict), "long line: 2\n")

# ---------- l4 worked: TODO scanner ----------
l4_worked = """
sample = 'x = 1\\n# TODO: validate the input first\\ny = 2\\n# note: fine as is\\n'
todos = []
for line in sample.split('\\n'):
    if 'TODO' in line or 'FIXME' in line:
        todos.append(line.strip())
print('todos: %d' % len(todos))
print(todos[0])
"""
check("l4.worked", run(l4_worked), "todos: 1\n# TODO: validate the input first\n")

# ---------- l4 ex1 trace ----------
l4_trace = """
lines = 'a\\nbb\\nccc'.split('\\n')
for n, text in enumerate(lines, start=1):
    print('%d: %s' % (n, text))
"""
check("l4.trace", run(l4_trace), "1: a\n2: bb\n3: ccc\n")

# ---------- l4 project: measure PROJECT_SOURCE ----------
PROJECT_SOURCE = """def fetch_all(urls):
    # TODO: add a timeout so that one slow server can never hang the whole batch job
    results = []
    try:
        for u in urls:
            results.append(u + ' ok')  # keep every result for the caller to inspect later
    except:
        results.append('batch failed')
    return results"""

lines = PROJECT_SOURCE.split("\n")
print("\nproject lines:", len(lines))
for i, ln in enumerate(lines, 1):
    flags = []
    if len(ln) > 79:
        flags.append("LONG(%d)" % len(ln))
    if "TODO" in ln or "FIXME" in ln:
        flags.append("TODO")
    print(f"  {i}: len={len(ln)} {' '.join(flags)}")


def lint(source):
    report = {'bare_except': 0, 'long_line_numbers': [], 'todos': 0}
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.ExceptHandler) and node.type is None:
            report['bare_except'] = report['bare_except'] + 1
    for n, line in enumerate(source.split('\n'), start=1):
        if len(line) > 79:
            report['long_line_numbers'].append(n)
        if 'TODO' in line or 'FIXME' in line:
            report['todos'] = report['todos'] + 1
    return report


rep = lint(PROJECT_SOURCE)
check("l4.project.report", rep, {'bare_except': 1, 'long_line_numbers': [2, 6], 'todos': 1})
l4_project_out = """
import ast

PROJECT_SOURCE = '''def fetch_all(urls):
    # TODO: add a timeout so that one slow server can never hang the whole batch job
    results = []
    try:
        for u in urls:
            results.append(u + ' ok')  # keep every result for the caller to inspect later
    except:
        results.append('batch failed')
    return results'''

def lint(source):
    report = {'bare_except': 0, 'long_line_numbers': [], 'todos': 0}
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.ExceptHandler) and node.type is None:
            report['bare_except'] = report['bare_except'] + 1
    for n, line in enumerate(source.split('\\n'), start=1):
        if len(line) > 79:
            report['long_line_numbers'].append(n)
        if 'TODO' in line or 'FIXME' in line:
            report['todos'] = report['todos'] + 1
    return report

report = lint(PROJECT_SOURCE)
print('bare except: %d' % report['bare_except'])
print('long lines: %d' % len(report['long_line_numbers']))
print('todos: %d' % report['todos'])
"""
check("l4.project.out", run(l4_project_out), "bare except: 1\nlong lines: 2\ntodos: 1\n")
check("l4.project.clean", lint('x = 1\ny = 2\n'), {'bare_except': 0, 'long_line_numbers': [], 'todos': 0})

# ---------- l4 debug: broken vs fixed numbering ----------
broken = PROJECT_SOURCE.replace("enumerate(source.split('\\n'), start=1)", "enumerate(source.split('\\n'))")


def lint_broken(source):
    report = {'bare_except': 0, 'long_line_numbers': [], 'todos': 0}
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.ExceptHandler) and node.type is None:
            report['bare_except'] = report['bare_except'] + 1
    for n, line in enumerate(source.split('\n')):
        if len(line) > 79:
            report['long_line_numbers'].append(n)
        if 'TODO' in line or 'FIXME' in line:
            report['todos'] = report['todos'] + 1
    return report


repb = lint_broken(PROJECT_SOURCE)
check("l4.debug.broken", repb, {'bare_except': 1, 'long_line_numbers': [1, 5], 'todos': 1})
broken_out = """
import ast

PROJECT_SOURCE = '''def fetch_all(urls):
    # TODO: add a timeout so that one slow server can never hang the whole batch job
    results = []
    try:
        for u in urls:
            results.append(u + ' ok')  # keep every result for the caller to inspect later
    except:
        results.append('batch failed')
    return results'''

def lint_broken(source):
    report = {'bare_except': 0, 'long_line_numbers': [], 'todos': 0}
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.ExceptHandler) and node.type is None:
            report['bare_except'] = report['bare_except'] + 1
    for n, line in enumerate(source.split('\\n')):
        if len(line) > 79:
            report['long_line_numbers'].append(n)
        if 'TODO' in line or 'FIXME' in line:
            report['todos'] = report['todos'] + 1
    return report

report = lint_broken(PROJECT_SOURCE)
print('bare except: %d' % report['bare_except'])
print('long lines at: %s' % ' '.join(str(n) for n in report['long_line_numbers']))
print('todos: %d' % report['todos'])
"""
check("l4.debug.broken.out", run(broken_out), "bare except: 1\nlong lines at: 1 5\ntodos: 1\n")
fixed_out = broken_out.replace(
    "enumerate(source.split('\\n'))", "enumerate(source.split('\\n'), start=1)"
).replace("lint_broken", "lint")
check("l4.debug.fixed.out", run(fixed_out), "bare except: 1\nlong lines at: 2 6\ntodos: 1\n")

print("\nRESULT:", "ALL SCRATCH CHECKS PASS" if ok else "FAILURES PRESENT")
