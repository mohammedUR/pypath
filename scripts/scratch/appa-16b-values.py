#!/usr/bin/env python3
"""CPython verification of every deterministic snippet for SWE Appendix A lessons (task 16-b)."""
import contextlib
import io

FAILS = []


def run(name, code, expected=None):
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, name, "exec"), {"__name__": "__main__"})
    except BaseException as e:
        FAILS.append(f"{name} RAISED {type(e).__name__}: {e}")
        print(f"--- {name} RAISED {type(e).__name__}: {e}")
        return ""
    out = buf.getvalue()
    if expected is not None and out != expected:
        FAILS.append(f"{name} MISMATCH\n  expected: {expected!r}\n  actual:   {out!r}")
    print(f"--- {name}\n{out!r}")
    return out


# ---------------- L1 ----------------
L1_PREDICT = """
pitch = {
    'problem': 'clinic loses paper slips',
    'appetite': 'one term, two-week sprints',
    'rough_solution': '',
    'no_gos': 'no billing, no mobile app',
}
filled = [k for k in pitch if pitch[k]]
print('fields:', len(pitch), 'filled:', len(filled))
print('missing:', [k for k in pitch if not pitch[k]])
"""
run("l1_predict", L1_PREDICT, "fields: 4 filled: 3\nmissing: ['rough_solution']\n")

L1_WORKED = """
SECTIONS = ['problem', 'users', 'moscow_backlog', 'scope_boundaries', 'risks', 'definition_of_done']
proposal = {
    'problem': 'two sentences on the slow paper queue',
    'users': 'clinic receptionist primary, patients secondary',
    'moscow_backlog': '8 stories with MoSCoW tags, 1 Wont item',
    'scope_boundaries': '',
    'risks': 'SMS gateway unknown - spike in week 1',
    'definition_of_done': 'receptionist books a visit end to end',
}
score = 0
for name in SECTIONS:
    filled = bool(proposal[name])
    print(name + ': ' + ('present' if filled else 'MISSING'))
    score += 1 if filled else 0
print('score:', str(score) + '/' + str(len(SECTIONS)))
print('verdict:', 'ready to sign' if score == len(SECTIONS) else 'not ready - fix the MISSING rows')
"""
run(
    "l1_worked",
    L1_WORKED,
    "problem: present\nusers: present\nmoscow_backlog: present\n"
    "scope_boundaries: MISSING\nrisks: present\ndefinition_of_done: present\n"
    "score: 5/6\nverdict: not ready - fix the MISSING rows\n",
)

L1_EX1_SOLUTION = """
PITCH_FIELDS = ['problem', 'appetite', 'rough_solution', 'rabbit_holes', 'no_gos', 'customer_contact']
pitch = {
    'problem': 'tutor pairings take a week of email tag',
    'appetite': 'one term, MVP-first',
    'rough_solution': 'a matching board with one-click pairing',
    'rabbit_holes': 'do not build a full chat system',
    'no_gos': '',
    'customer_contact': 'sara answers in channel tutor-swap',
}
missing = []
for field in PITCH_FIELDS:
    if not pitch[field]:
        missing.append(field)
print('missing: ' + str(missing))
print('strangers can build: ' + ('yes' if not missing else 'no'))
"""
run("l1_ex1_solution", L1_EX1_SOLUTION, "missing: ['no_gos']\nstrangers can build: no\n")

L1_EX2_TRACE = """
plan = {'proposal': 0, 'skeletal': 0, 'viable': 2, 'final': 4}
for name in sorted(plan):
    n = plan[name]
    tag = 'onboarding' if n == 0 else 'build'
    print(name + ' -> sprint ' + str(n) + ' ' + tag)
"""
run(
    "l1_ex2_trace",
    L1_EX2_TRACE,
    "final -> sprint 4 build\nproposal -> sprint 0 onboarding\n"
    "skeletal -> sprint 0 onboarding\nviable -> sprint 2 build\n",
)

L1_SANDBOX = """
SECTIONS = ['problem', 'users', 'moscow_backlog', 'scope_boundaries', 'risks', 'definition_of_done']
proposal = {
    'problem': 'two sentences on the slow paper queue',
    'users': 'receptionist primary, patients secondary',
    'moscow_backlog': '8 stories, 3 Must, 1 Wont',
    'scope_boundaries': '',
    'risks': 'SMS gateway unknown - spike in week 1',
    'definition_of_done': 'receptionist books a visit end to end',
}
score = 0
for name in SECTIONS:
    filled = bool(proposal[name])
    print(name + ': ' + ('present' if filled else 'MISSING'))
    score += 1 if filled else 0
print('score:', str(score) + '/' + str(len(SECTIONS)))
print('verdict:', 'ready to sign' if score == len(SECTIONS) else 'not ready - fix the MISSING rows')
"""
run("l1_sandbox", L1_SANDBOX)

# ---------------- L2 ----------------
L2_PREDICT = """
LAYERS = ['ui', 'logic', 'data']
runs = {'ui': True, 'logic': True, 'data': False}
end_to_end = all(runs[layer] for layer in LAYERS)
print('one path end to end:', end_to_end)
"""
run("l2_predict", L2_PREDICT, "one path end to end: False\n")

L2_WORKED = """
LADDER = [
    ('proposal', True, 'signed by the customer team'),
    ('skeletal', True, 'one path live on a real URL'),
    ('viable', False, 'must-haves work for a real user'),
    ('final', False, 'report + demo + write-ups'),
]
for name, done, proof in LADDER:
    mark = 'x' if done else ' '
    print('[' + mark + '] ' + name + ' - ' + proof)
"""
run(
    "l2_worked",
    L2_WORKED,
    "[x] proposal - signed by the customer team\n[x] skeletal - one path live on a real URL\n"
    "[ ] viable - must-haves work for a real user\n[ ] final - report + demo + write-ups\n",
)

L2_EX1_SOLUTION = """
report = {
    'features': [
        ('book a visit', 'Done', 'URL + test'),
        ('cancel a visit', 'Done', 'URL + test'),
        ('email reminders', 'Partial', 'screenshot only'),
        ('admin dashboard', 'Not started', ''),
    ],
    'coverage': 62,
}
for name, status, evidence in report['features']:
    print(name + ': ' + status.lower())
done = sum(1 for f in report['features'] if f[1] == 'Done')
print('stories done:', done)
weak = [f[0] for f in report['features'] if f[1] != 'Done' and f[2] == '']
print('evidence missing:', weak)
print('coverage:', report['coverage'])
"""
run(
    "l2_ex1_solution",
    L2_EX1_SOLUTION,
    "book a visit: done\ncancel a visit: done\nemail reminders: partial\nadmin dashboard: not started\n"
    "stories done: 2\nevidence missing: ['admin dashboard']\ncoverage: 62\n",
)

L2_EX2_TRACE = """
milestones = [('skeletal', 3), ('viable', 6), ('final', 9)]
week = 7
for name, due in milestones:
    state = 'done' if week > due else 'open'
    print(name + ': ' + state)
"""
run("l2_ex2_trace", L2_EX2_TRACE, "skeletal: done\nviable: done\nfinal: open\n")

L2_SANDBOX = """
LAYERS = ['ui', 'logic', 'data']
runs = {'ui': True, 'logic': True, 'data': False}
print('one path end to end:', all(runs[layer] for layer in LAYERS))

report = {
    'features': [
        ('book a visit', 'Done'),
        ('cancel a visit', 'Done'),
        ('email reminders', 'Partial'),
    ],
    'coverage': 62,
}
done = [name for name, status in report['features'] if status == 'Done']
print('stories done:', len(done))
print('coverage gate:', 'open' if report['coverage'] >= 80 else 'closed at ' + str(report['coverage']))
"""
run("l2_sandbox", L2_SANDBOX, "one path end to end: False\nstories done: 2\ncoverage gate: closed at 62\n")

# ---------------- L3 ----------------
L3_PREDICT = """
claims = {'coverage 80 percent': 'CI report', 'CD every merge': '', 'auth works': 'test + PR 12'}
unbacked = [c for c, e in claims.items() if not e]
print('unbacked claims:', unbacked)
"""
run("l3_predict", L3_PREDICT, "unbacked claims: ['CD every merge']\n")

L3_WORKED = """
RUBRIC = [
    ('requirements traceable to code', 20, True),
    ('tests back each claim', 20, True),
    ('AI use log current', 10, True),
    ('scorecard findings triaged', 15, False),
    ('final demo path polished', 15, True),
    ('honest limitations section', 20, False),
]
score = 0
missing = []
for item, weight, ok in RUBRIC:
    if ok:
        score += weight
    else:
        missing.append(item)
print('score:', score)
print('missing evidence:')
for item in missing:
    print('- ' + item)
"""
run(
    "l3_worked",
    L3_WORKED,
    "score: 65\nmissing evidence:\n- scorecard findings triaged\n- honest limitations section\n",
)

L3_EX1_SOLUTION = """
CLAIMS = [
    ('users can book online', 'deployed URL works'),
    ('coverage 80 percent', 'CI report'),
    ('CD deploys every merge', ''),
    ('defects down to 3', 'tracker export'),
    ('AI use documented', ''),
]
unbacked = []
for claim, evidence in CLAIMS:
    state = 'backed' if evidence else 'unbacked'
    print(claim + ': ' + state)
    if not evidence:
        unbacked.append(claim)
print('unbacked:', len(unbacked))
"""
run(
    "l3_ex1_solution",
    L3_EX1_SOLUTION,
    "users can book online: backed\ncoverage 80 percent: backed\nCD deploys every merge: unbacked\n"
    "defects down to 3: backed\nAI use documented: unbacked\nunbacked: 2\n",
)

L3_EX2_TRACE = """
weights = {'trace': 30, 'tests': 30, 'log': 20, 'limits': 20}
met = ['trace', 'tests', 'log']
score = sum(weights[k] for k in met)
print('met:', len(met), 'of', len(weights))
print('score:', str(score) + '/100')
"""
run("l3_ex2_trace", L3_EX2_TRACE, "met: 3 of 4\nscore: 80/100\n")

L3_SANDBOX = """
START = [('trace', 20, False), ('tests', 20, True), ('ai_log', 10, True),
         ('triage', 15, False), ('demo', 15, True), ('limits', 20, False)]
NOW = [('trace', 20, True), ('tests', 20, True), ('ai_log', 10, True),
       ('triage', 15, True), ('demo', 15, True), ('limits', 20, False)]

def score(rubric):
    return sum(w for _, w, ok in rubric if ok)

print('score at phase start:', score(START))
print('score before demo:', score(NOW))
print('what changed: trace + triage fixed; limitations still open')
"""
run(
    "l3_sandbox",
    L3_SANDBOX,
    "score at phase start: 45\nscore before demo: 80\nwhat changed: trace + triage fixed; limitations still open\n",
)

# ---------------- L4 ----------------
L4_PREDICT = """
milestones = [('proposal', 0), ('skeletal', 0), ('viable', 2), ('final', 4)]
sprint = 2
for name, due in milestones:
    print(name + ': ' + ('shipped' if sprint >= due else 'ahead'))
"""
run("l4_predict", L4_PREDICT, "proposal: shipped\nskeletal: shipped\nviable: shipped\nfinal: ahead\n")

L4_WORKED = """
SPRINT = 2
MILESTONES = [
    ('proposal', 0, 'signed by the customer'),
    ('skeletal', 0, 'one path live on a URL'),
    ('viable', 2, 'must-haves work for a real user'),
    ('final', 4, 'report + demo + write-ups'),
]
for name, due, proof in MILESTONES:
    state = 'ready' if SPRINT >= due else 'upcoming'
    print('milestone ' + name + ': ' + state)
"""
run(
    "l4_worked",
    L4_WORKED,
    "milestone proposal: ready\nmilestone skeletal: ready\nmilestone viable: ready\nmilestone final: upcoming\n",
)

L4_EX1_SOLUTION = """
REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2
VELOCITY = 9

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT < due:
        print('milestone ' + str(i) + ': ' + name + ' - upcoming')
    elif all(STATUS[rid] == 'done' for rid in needs):
        print('milestone ' + str(i) + ': ' + name + ' - ready')
    else:
        blocked = [rid for rid in needs if STATUS[rid] != 'done']
        print('milestone ' + str(i) + ': ' + name + ' - blocked (' + ' '.join(blocked) + ')')

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')
unfinished_musts = [r[0] for r in REQS if r[2] == 'Must' and STATUS[r[0]] != 'done']
print('risk: ' + str(len(unfinished_musts)) + ' Must not done')
must_total = sum(r[4] for r in REQS if r[2] == 'Must')
must_done = sum(r[4] for r in REQS if r[2] == 'Must' and STATUS[r[0]] == 'done')
print('must points: ' + str(must_done) + '/' + str(must_total) + ' done at velocity ' + str(VELOCITY) + '/sprint')
"""
run(
    "l4_ex1_solution",
    L4_EX1_SOLUTION,
    "milestone 1: proposal - ready\nmilestone 2: skeletal - ready\n"
    "milestone 3: viable - blocked (R5)\nmilestone 4: final - upcoming\n"
    "risk: 2 requirements unassigned\nrisk: 1 Must not done\n"
    "must points: 8/12 done at velocity 9/sprint\n",
)

L4_EX2_TRACE = """
points = [8, 9, 13]
velocity = sum(points) // len(points)
for i, p in enumerate(points, start=1):
    print('sprint ' + str(i) + ': ' + str(p) + ' points')
print('velocity: ' + str(velocity) + ' points/sprint')
print('size sprint 4 by velocity, not hopes')
"""
run(
    "l4_ex2_trace",
    L4_EX2_TRACE,
    "sprint 1: 8 points\nsprint 2: 9 points\nsprint 3: 13 points\n"
    "velocity: 10 points/sprint\nsize sprint 4 by velocity, not hopes\n",
)

L4_EX5_BROKEN = """
REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT >= due:
        print('milestone ' + str(i) + ': ' + name + ' - ready')
    else:
        print('milestone ' + str(i) + ': ' + name + ' - upcoming')

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')
"""
run(
    "l4_ex5_broken",
    L4_EX5_BROKEN,
    "milestone 1: proposal - ready\nmilestone 2: skeletal - ready\n"
    "milestone 3: viable - ready\nmilestone 4: final - upcoming\n"
    "risk: 2 requirements unassigned\n",
)

L4_EX5_SOLUTION = """
REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT < due:
        print('milestone ' + str(i) + ': ' + name + ' - upcoming')
    elif all(STATUS[rid] == 'done' for rid in needs):
        print('milestone ' + str(i) + ': ' + name + ' - ready')
    else:
        blocked = [rid for rid in needs if STATUS[rid] != 'done']
        print('milestone ' + str(i) + ': ' + name + ' - blocked (' + ' '.join(blocked) + ')')

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')
"""
run(
    "l4_ex5_solution",
    L4_EX5_SOLUTION,
    "milestone 1: proposal - ready\nmilestone 2: skeletal - ready\n"
    "milestone 3: viable - blocked (R5)\nmilestone 4: final - upcoming\n"
    "risk: 2 requirements unassigned\n",
)

L4_SANDBOX = """
REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2

for i, (name, due, needs) in enumerate(MILESTONES, start=1):
    if SPRINT < due:
        state = 'upcoming'
    elif all(STATUS[rid] == 'done' for rid in needs):
        state = 'ready'
    else:
        state = 'blocked'
    print('milestone ' + str(i) + ': ' + name + ' - ' + state)

unassigned = [r[0] for r in REQS if r[3] == '']
print('risk: ' + str(len(unassigned)) + ' requirements unassigned')
"""
run(
    "l4_sandbox",
    L4_SANDBOX,
    "milestone 1: proposal - ready\nmilestone 2: skeletal - ready\n"
    "milestone 3: viable - blocked\nmilestone 4: final - upcoming\n"
    "risk: 2 requirements unassigned\n",
)

# starters with '...' placeholders must at least be syntactically runnable
L1_EX1_STARTER = """
PITCH_FIELDS = ['problem', 'appetite', 'rough_solution', 'rabbit_holes', 'no_gos', 'customer_contact']
pitch = {
    'problem': 'tutor pairings take a week of email tag',
    'appetite': 'one term, MVP-first',
    'rough_solution': 'a matching board with one-click pairing',
    'rabbit_holes': 'do not build a full chat system',
    'no_gos': '',
    'customer_contact': 'sara answers in channel tutor-swap',
}
...
"""
L2_EX1_STARTER = """
report = {
    'features': [
        ('book a visit', 'Done', 'URL + test'),
        ('cancel a visit', 'Done', 'URL + test'),
        ('email reminders', 'Partial', 'screenshot only'),
        ('admin dashboard', 'Not started', ''),
    ],
    'coverage': 62,
}
...
"""
L3_EX1_STARTER = """
CLAIMS = [
    ('users can book online', 'deployed URL works'),
    ('coverage 80 percent', 'CI report'),
    ('CD deploys every merge', ''),
    ('defects down to 3', 'tracker export'),
    ('AI use documented', ''),
]
...
"""
L4_EX1_STARTER = """
REQS = [
    ('R1', 'book a visit', 'Must', 'mina', 5),
    ('R2', 'cancel a visit', 'Must', 'mina', 3),
    ('R3', 'email reminders', 'Should', '', 3),
    ('R4', 'admin dashboard', 'Should', '', 5),
    ('R5', 'walk-in queue', 'Must', 'leo', 4),
]
STATUS = {'R1': 'done', 'R2': 'done', 'R3': 'not started', 'R4': 'not started', 'R5': 'partial'}
MILESTONES = [
    ('proposal', 0, []),
    ('skeletal', 0, ['R1']),
    ('viable', 2, ['R1', 'R2', 'R5']),
    ('final', 4, ['R1', 'R2', 'R3', 'R4', 'R5']),
]
SPRINT = 2
VELOCITY = 9
...
"""
for nm, code in [
    ("l1_ex1_starter", L1_EX1_STARTER),
    ("l2_ex1_starter", L2_EX1_STARTER),
    ("l3_ex1_starter", L3_EX1_STARTER),
    ("l4_ex1_starter", L4_EX1_STARTER),
]:
    try:
        exec(compile(code, nm, "exec"), {})
        print(f"--- {nm} OK")
    except BaseException as e:
        FAILS.append(f"{nm} STARTER RAISED {type(e).__name__}: {e}")

print()
if FAILS:
    print("FAILURES:")
    for f in FAILS:
        print(f)
else:
    print("ALL SNIPPETS OK")
