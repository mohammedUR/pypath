#!/usr/bin/env python3
"""Scratch: hand-verify every planned swe.ch14 snippet under CPython BEFORE authoring."""
import contextlib
import io
import sys
from datetime import datetime, timedelta

sys.stdout.reconfigure(encoding="utf-8")


def run(label, code):
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, "<scratch>", "exec"), {"__name__": "__main__"})
        print(f"=== {label} ===\n{buf.getvalue()}--- end ---")
    except BaseException as e:
        print(f"=== {label} === RAISED {type(e).__name__}: {e}")


# ---------------- l1 worked: fail-fast pipeline ----------------
run("l1-worked", """
stages = ['build', 'static', 'test', 'package']

commits = {
    'c1': {'build': 'ok', 'static': 'ok', 'test': 'FAIL', 'package': 'ok'},
    'c2': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},
}

def run_pipeline(cid):
    commit = commits[cid]
    for stage in stages:
        status = commit[stage]
        print('%s: %s' % (stage, status))
        if status == 'FAIL':
            print('pipeline: red')
            return 'red'
    print('pipeline: green')
    return 'green'

run_pipeline('c1')
run_pipeline('c2')
""")

# ---------------- l1 trace ----------------
run("l1-trace", """
stages = ['build', 'static', 'test']
commit = {'build': 'ok', 'static': 'FAIL', 'test': 'ok'}
verdict = 'green'
for s in stages:
    print('%s: %s' % (s, commit[s]))
    if commit[s] != 'ok':
        verdict = 'red'
print(verdict)
""")

# ---------------- l1 ex1 reference solution ----------------
run("l1-ex1-solution", """
stages = ['build', 'static', 'test', 'package']

commits = {
    'c1': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},
    'c2': {'build': 'ok', 'static': 'FAIL'},
    'c3': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},
}

def run_pipeline(cid):
    commit = commits[cid]
    for stage in stages:
        status = commit.get(stage, 'skipped')
        if status == 'FAIL':
            print('%s: %s' % (stage, status))
            print('pipeline: red')
            return 'red'
        print('%s: %s' % (stage, status))
    print('pipeline: green')
    return 'green'

for cid in ['c1', 'c2', 'c3']:
    run_pipeline(cid)
""")

# ---------------- l2 crc32 buckets ----------------
run("l2-buckets", """
from zlib import crc32

def bucket(user_id):
    return crc32(user_id.encode()) % 100

users = ['ana', 'basil', 'carla', 'dmitri', 'eva', 'farid']
for u in users:
    b = bucket(u)
    where = 'canary' if b < 10 else 'stable'
    print('%s -> bucket %d -> %s' % (u, b, where))
""")

# ---------------- l2 worked: canary decision ----------------
run("l2-worked", """
samples = [3, 5, 4, 6, 5]
threshold = 4.0

mean = sum(samples) / len(samples)
promoted = mean <= threshold
print('mean: %.1f' % mean)
print('threshold: %.1f' % threshold)
print('promoted: %s' % promoted)
""")

# ---------------- l2 trace: blue-green swap ----------------
run("l2-trace", """
serving = 'green'
errors = [7, 9, 8]
limit = 5
if max(errors) > limit:
    serving = 'blue'
print('serving: %s' % serving)
""")

# ---------------- l2 ex1 reference solution ----------------
run("l2-ex1-solution", """
def canary_decision(samples, threshold):
    mean = sum(samples) / len(samples)
    promoted = mean <= threshold
    print('mean: %.1f' % mean)
    print('promoted: %s' % promoted)
    return promoted

canary_decision([1, 2, 1, 2, 1], 3.0)
canary_decision([4, 6, 5], 4.0)
""")

# ---------------- l3 worked: manifest + crc32 verification ----------------
run("l3-worked", """
from zlib import crc32

layers = [
    ('base', 'python:3.12-slim'),
    ('deps', 'pip install -r requirements.txt'),
    ('src', 'app.py v1.4.3'),
]
manifest = {}
for name, content in layers:
    manifest[name] = crc32(content.encode())

deployed = [
    ('base', 'python:3.12-slim'),
    ('deps', 'pip install -r requirements.txt'),
    ('src', 'app.py v1.4.4'),
]

ok = True
for name, content in deployed:
    if crc32(content.encode()) != manifest[name]:
        ok = False
        print('layer drift: %s' % name)
print('same artifact: %s' % ok)
""")

# ---------------- l3 trace: DNS records ----------------
run("l3-trace", """
records = {
    'clinic.example.com': ('A', '203.0.113.143'),
    'www.example.com': ('CNAME', 'clinic.example.com'),
}
for name, (rtype, value) in records.items():
    print('%s %s -> %s' % (rtype, name, value))
""")

# ---------------- l3 ex1 reference solution: DNS resolver with TTL cache ----------------
run("l3-ex1-solution", """
from datetime import datetime, timedelta

dns = {
    'clinic.example.com': {'value': '203.0.113.143', 'ttl': 300},
    'www.example.com': {'value': 'clinic.example.com', 'ttl': 600},
}
cache = {}

def resolve(name, now):
    if name in cache and now < cache[name][1]:
        return (cache[name][0], 'hit')
    rec = dns[name]
    cache[name] = (rec['value'], now + timedelta(seconds=rec['ttl']))
    return (rec['value'], 'miss')

t0 = datetime(2025, 1, 1, 9, 0, 0)
print(resolve('clinic.example.com', t0))
print(resolve('clinic.example.com', t0 + timedelta(seconds=100)))
print(resolve('clinic.example.com', t0 + timedelta(seconds=500)))
print(resolve('www.example.com', t0))
""")

# ---------------- l4 worked: lead time ----------------
run("l4-worked", """
from datetime import datetime

log = [
    {'commit': datetime(2025, 3, 3, 9, 0), 'deploy': datetime(2025, 3, 3, 15, 0)},
    {'commit': datetime(2025, 3, 4, 11, 0), 'deploy': datetime(2025, 3, 5, 10, 0)},
    {'commit': datetime(2025, 3, 5, 14, 0), 'deploy': datetime(2025, 3, 7, 9, 0)},
]

hours = [(e['deploy'] - e['commit']).total_seconds() / 3600 for e in log]
for h in hours:
    print('lead: %.2f days' % (h / 24))
print('lead time: %.1f days' % (sum(hours) / len(hours) / 24))
""")

# ---------------- l4 trace: SCA scan ----------------
run("l4-trace", """
manifest = {'flask': '2.0.1', 'requests': '2.25.1'}
known = ['requests 2.25.1']
for pkg in manifest:
    line = '%s %s' % (pkg, manifest[pkg])
    if line in known:
        print('vulnerable: %s' % line)
    else:
        print('clean: %s' % line)
""")

# ---------------- l4 ex1 reference solution: DORA calculators ----------------
run("l4-ex1-solution", """
from datetime import datetime

changes = [
    {'commit': datetime(2025, 3, 3, 9, 0), 'deploy': datetime(2025, 3, 5, 21, 0), 'failed': False},
    {'commit': datetime(2025, 3, 4, 9, 0), 'deploy': datetime(2025, 3, 6, 21, 0), 'failed': False},
    {'commit': datetime(2025, 3, 5, 9, 0), 'deploy': datetime(2025, 3, 7, 21, 0), 'failed': False},
    {'commit': datetime(2025, 3, 6, 9, 0), 'deploy': datetime(2025, 3, 9, 9, 0), 'failed': True},
    {'commit': datetime(2025, 3, 7, 9, 0), 'deploy': datetime(2025, 3, 9, 9, 0), 'failed': False},
]

def compute_dora(changes):
    leads = []
    for c in changes:
        hours = (c['deploy'] - c['commit']).total_seconds() / 3600
        leads.append(hours / 24)
    failed = 0
    for c in changes:
        if c['failed']:
            failed += 1
    cfr = failed / len(changes)
    print('lead time: %.1f days' % (sum(leads) / len(leads)))
    print('deploys: %d failed: %d' % (len(changes), failed))
    print('CFR: %.1f' % cfr)
    return (sum(leads) / len(leads), cfr)

compute_dora(changes)
""")

# ---------------- l5 predict ----------------
run("l5-predict", """
runs = ['ok', 'FAIL', 'ok']
green = runs.count('FAIL') == 0
print('pipeline: %s' % ('green' if green else 'red'))
""")

# ---------------- l5 worked ----------------
run("l5-worked", """
from datetime import datetime

stages = [('build', 'ok'), ('test', 'ok'), ('canary', 'ok')]
commit = datetime(2025, 3, 3, 9, 0)
deploy = datetime(2025, 3, 5, 9, 0)

passed = 0
for name, status in stages:
    print('%s: %s' % (name, status))
    if status == 'ok':
        passed += 1
lead = (deploy - commit).total_seconds() / 3600 / 24
print('stages passed: %d' % passed)
print('lead: %.1f days' % lead)
""")

# ---------------- l5 trace ----------------
run("l5-trace", """
stages = [('build', 'ok'), ('test', 'FAIL'), ('canary', 'ok')]
passed = 0
for name, status in stages:
    if status == 'ok':
        passed += 1
    else:
        print('stopped at: %s' % name)
        break
print('passed: %d' % passed)
""")

# ---------------- l5 project reference solution ----------------
run("l5-project-solution", """
from datetime import datetime

runs = [
    {
        'id': 'ch-101',
        'commit': datetime(2025, 3, 3, 9, 0),
        'deploy': datetime(2025, 3, 5, 9, 0),
        'stages': [('build', 'ok'), ('test', 'ok'), ('canary', 'ok')],
    },
    {
        'id': 'ch-102',
        'commit': datetime(2025, 3, 5, 10, 0),
        'deploy': datetime(2025, 3, 6, 10, 0),
        'stages': [('build', 'ok'), ('test', 'ok'), ('canary', 'FAIL')],
    },
]

def run_delivery(run):
    passed = 0
    decision = 'promote'
    for stage, status in run['stages']:
        if status == 'ok':
            passed += 1
        else:
            print('stopped at: %s (%s)' % (stage, status))
            decision = 'rollback'
            break
    lead = (run['deploy'] - run['commit']).total_seconds() / 3600 / 24
    print('%s: stages passed: %d decision: %s lead: %.1f days' % (run['id'], passed, decision, lead))
    return (decision, lead)

decisions = []
leads = []
for r in runs:
    decision, lead = run_delivery(r)
    decisions.append(decision)
    leads.append(lead)

cfr = decisions.count('rollback') / len(runs)
print('lead time: %.1f days' % (sum(leads) / len(leads)))
print('CFR: %.1f' % cfr)
""")

# ---------------- l5 debug: BROKEN (missing status check) ----------------
run("l5-debug-broken", """
from datetime import datetime

runs = [
    {
        'id': 'ch-101',
        'commit': datetime(2025, 3, 3, 9, 0),
        'deploy': datetime(2025, 3, 5, 9, 0),
        'stages': [('build', 'ok'), ('test', 'ok'), ('canary', 'ok')],
    },
    {
        'id': 'ch-102',
        'commit': datetime(2025, 3, 5, 10, 0),
        'deploy': datetime(2025, 3, 6, 10, 0),
        'stages': [('build', 'ok'), ('test', 'ok'), ('canary', 'FAIL')],
    },
]

def run_delivery(run):
    passed = 0
    decision = 'promote'
    for stage, status in run['stages']:
        passed += 1
        if status != 'ok':
            decision = 'rollback'
    lead = (run['deploy'] - run['commit']).total_seconds() / 3600 / 24
    print('%s: stages passed: %d decision: %s lead: %.1f days' % (run['id'], passed, decision, lead))
    return (decision, lead)

decisions = []
leads = []
for r in runs:
    decision, lead = run_delivery(r)
    decisions.append(decision)
    leads.append(lead)

cfr = decisions.count('rollback') / len(runs)
print('lead time: %.1f days' % (sum(leads) / len(leads)))
print('CFR: %.1f' % cfr)
""")

# ---------------- l5 debug: FIXED ----------------
run("l5-debug-fixed", """
from datetime import datetime

runs = [
    {
        'id': 'ch-101',
        'commit': datetime(2025, 3, 3, 9, 0),
        'deploy': datetime(2025, 3, 5, 9, 0),
        'stages': [('build', 'ok'), ('test', 'ok'), ('canary', 'ok')],
    },
    {
        'id': 'ch-102',
        'commit': datetime(2025, 3, 5, 10, 0),
        'deploy': datetime(2025, 3, 6, 10, 0),
        'stages': [('build', 'ok'), ('test', 'ok'), ('canary', 'FAIL')],
    },
]

def run_delivery(run):
    passed = 0
    decision = 'promote'
    for stage, status in run['stages']:
        if status == 'ok':
            passed += 1
        else:
            print('stopped at: %s (%s)' % (stage, status))
            decision = 'rollback'
            break
    lead = (run['deploy'] - run['commit']).total_seconds() / 3600 / 24
    print('%s: stages passed: %d decision: %s lead: %.1f days' % (run['id'], passed, decision, lead))
    return (decision, lead)

decisions = []
leads = []
for r in runs:
    decision, lead = run_delivery(r)
    decisions.append(decision)
    leads.append(lead)

cfr = decisions.count('rollback') / len(runs)
print('lead time: %.1f days' % (sum(leads) / len(leads)))
print('CFR: %.1f' % cfr)
""")

# ---------------- float sanity ----------------
print("checks:", "%.1f" % 0.25, "%.1f" % (23 / 5), "%.1f" % (1 / 5), 1 / 5 == 0.2, "%.1f" % 1.25, "%.1f" % 2.5)
