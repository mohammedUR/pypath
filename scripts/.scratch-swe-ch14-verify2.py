#!/usr/bin/env python3
"""Scratch round 2: verify predicts, sandboxes, and the combined l2 worked."""
import contextlib
import io
import sys

sys.stdout.reconfigure(encoding="utf-8")


def run(label, code):
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, "<scratch>", "exec"), {"__name__": "__main__"})
        print(f"=== {label} ===\n{buf.getvalue()}--- end ---")
    except BaseException as e:
        print(f"=== {label} === RAISED {type(e).__name__}: {e}")


run("l1-predict", """
commits = {'c1': {'build': 'ok', 'test': 'ok'}, 'c2': {'build': 'ok', 'test': 'FAIL'}}
for cid in ['c1', 'c2']:
    ok = 0
    for stage in commits[cid]:
        if commits[cid][stage] == 'ok':
            ok += 1
    print('%s stages: %d' % (cid, ok))
""")

run("l2-predict", """
pipeline = 'green'
artifact = 'clinic-app:1.4.3'
released = False
artifact_ready = False
if pipeline == 'green':
    artifact_ready = True
print('artifact ready: %s' % artifact_ready)
print('released: %s' % released)
""")

run("l2-worked-combined", """
from zlib import crc32

users = ['ana', 'basil', 'maya', 'omar', 'dmitri', 'yara']
for u in users:
    b = crc32(u.encode()) % 100
    where = 'canary' if b < 10 else 'stable'
    print('%s: bucket %d -> %s' % (u, b, where))

samples = [3, 5, 4, 6, 5]
threshold = 4.0
mean = sum(samples) / len(samples)
promoted = mean <= threshold
print('mean errors: %.1f' % mean)
print('promoted: %s' % promoted)
""")

run("l3-predict", """
changed = {'src': True, 'deps': False, 'base': False}
rebuilt = 0
for layer in ['base', 'deps', 'src']:
    if changed[layer]:
        rebuilt += 1
        print('rebuild: %s' % layer)
    else:
        print('cached: %s' % layer)
print('rebuilt layers: %d' % rebuilt)
""")

run("l4-predict", """
outcomes = ['ok', 'ok', 'FAIL', 'ok', 'ok']
failed = 0
for o in outcomes:
    if o == 'FAIL':
        failed += 1
print('CFR: %.1f' % (failed / len(outcomes)))
""")

run("l1-sandbox", """
stages = ['build', 'static', 'test', 'package']
commits = {
    'c1': {'build': 'ok', 'static': 'ok', 'test': 'ok', 'package': 'ok'},
    'c2': {'build': 'ok', 'static': 'ok', 'test': 'FAIL', 'package': 'ok'},
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

run("l2-sandbox", """
from zlib import crc32

def bucket(user_id):
    return crc32(user_id.encode()) % 100

def canary_decision(samples, threshold):
    mean = sum(samples) / len(samples)
    promoted = mean <= threshold
    print('mean: %.1f' % mean)
    print('promoted: %s' % promoted)
    return promoted

print('omar: bucket %d' % bucket('omar'))
canary_decision([1, 2, 1, 2], 2.0)
""")

run("l3-sandbox", """
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
print(resolve('clinic.example.com', t0 + timedelta(seconds=250)))
print(resolve('www.example.com', t0 + timedelta(seconds=700)))
""")

run("l4-sandbox", """
from datetime import datetime

changes = [
    {'commit': datetime(2025, 3, 3, 9, 0), 'deploy': datetime(2025, 3, 4, 9, 0), 'failed': False},
    {'commit': datetime(2025, 3, 5, 9, 0), 'deploy': datetime(2025, 3, 6, 9, 0), 'failed': True},
]

def compute_dora(changes):
    leads = [(c['deploy'] - c['commit']).total_seconds() / 3600 / 24 for c in changes]
    failed = sum(1 for c in changes if c['failed'])
    cfr = failed / len(changes)
    print('lead time: %.1f days' % (sum(leads) / len(leads)))
    print('CFR: %.1f' % cfr)
    return (sum(leads) / len(leads), cfr)

compute_dora(changes)
""")

run("l5-sandbox", """
from datetime import datetime

runs = [
    {
        'id': 'ch-103',
        'commit': datetime(2025, 3, 10, 9, 0),
        'deploy': datetime(2025, 3, 10, 21, 0),
        'stages': [('build', 'ok'), ('test', 'FAIL'), ('canary', 'ok')],
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

for r in runs:
    run_delivery(r)
""")
