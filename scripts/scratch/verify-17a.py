#!/usr/bin/env python3
"""Task 17-a scratch: verify EVERY deterministic snippet for SWE ch13 l1-l4 under CPython 3."""
import contextlib, io, json, sys

failures = []

def run(code, name, expected=None):
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, name, "exec"), {"__name__": "__main__"})
    except BaseException as e:
        failures.append(f"{name}: RAISED {type(e).__name__}: {e}")
        return buf.getvalue()
    got = buf.getvalue()
    if expected is not None:
        want = "\n".join(ln.strip() for ln in expected.split("\n")).strip()
        have = "\n".join(ln.strip() for ln in got.split("\n")).strip()
        while "\n\n" in have:
            have = have.replace("\n\n", "\n")
        if have != want:
            failures.append(f"{name}: OUTPUT MISMATCH\n--- want ---\n{want}\n--- got ---\n{have}")
    return buf.getvalue()

def worker(solution, tests, name):
    """Replicate wave3-replay-solutions semantics."""
    env = {"__name__": "__main__"}
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(solution, name, "exec"), env)
    except BaseException as e:
        failures.append(f"{name}: solution RAISED {type(e).__name__}: {e}")
        return
    env["__learner_output__"] = buf.getvalue()
    for i, t in enumerate(tests):
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                exec(compile(t, f"{name}-test{i}", "exec"), env)
        except BaseException as e:
            failures.append(f"{name}: test{i} FAILED {type(e).__name__}: {e}")

# ============ L1 worked: TASK LEDGER ============
L1_WORKED = '''# TASK LEDGER: five real tasks - typed minutes vs agent-assisted minutes.
# (task, manual_min, agent_draft_min, human_verify_min)
TASKS = [
    ("boilerplate CRUD endpoint", 60, 5, 10),
    ("glue: CSV to JSON converter", 45, 3, 8),
    ("first-draft unit tests", 50, 5, 15),
    ("decide payment feature scope", 90, 0, 90),
    ("pick architecture for likely change", 120, 0, 120),
]

manual_total = 0
ai_total = 0
verify_total = 0
for task, manual, draft, verify in TASKS:
    manual_total += manual
    ai_total += draft + verify
    verify_total += verify
    print(task + ": manual=" + str(manual) + " with-ai=" + str(draft + verify))

print("manual total: " + str(manual_total) + "min")
print("with-ai total: " + str(ai_total) + "min")
print("human share of with-ai time: " + str(verify_total * 100 // ai_total) + "%")
print("the bottleneck moved: typing -> verifying")
'''
assert run(L1_WORKED, "l1-worked", """boilerplate CRUD endpoint: manual=60 with-ai=15
glue: CSV to JSON converter: manual=45 with-ai=11
first-draft unit tests: manual=50 with-ai=20
decide payment feature scope: manual=90 with-ai=90
pick architecture for likely change: manual=120 with-ai=120
manual total: 365min
with-ai total: 256min
human share of with-ai time: 94%
the bottleneck moved: typing -> verifying""") is not None

# ============ L1 ex1: EVIDENCE LEDGER (perception gap) ============
L1_EX1_SOL = '''STUDY = {"predicted_speedup_pct": 24, "measured_slowdown_pct": 19}

def perception_gap(study):
    return study["predicted_speedup_pct"] + study["measured_slowdown_pct"]

gap = perception_gap(STUDY)
print("predicted: " + str(STUDY["predicted_speedup_pct"]) + "% faster")
print("measured: " + str(STUDY["measured_slowdown_pct"]) + "% slower")
print("perception gap: " + str(gap) + " points")
'''
run(L1_EX1_SOL, "l1-ex1-sol", """predicted: 24% faster
measured: 19% slower
perception gap: 43 points""")
worker(L1_EX1_SOL, [
    "assert perception_gap(STUDY) == 43, 'expected 43 | actual: %r' % perception_gap(STUDY)",
    "assert 'perception gap: 43 points' in __learner_output__, 'expected: perception gap: 43 points | actual: %r' % __learner_output__",
], "l1-ex1-worker")
# broken starter variant must also run (not required by gates, sanity only)
L1_EX1_STARTER = '''STUDY = {"predicted_speedup_pct": 24, "measured_slowdown_pct": 19}

def perception_gap(study):
    return 0  # TODO: predicted speedup + measured slowdown

gap = perception_gap(STUDY)
print("predicted: " + str(STUDY["predicted_speedup_pct"]) + "% faster")
print("measured: " + str(STUDY["measured_slowdown_pct"]) + "% slower")
print("perception gap: " + str(gap) + " points")
'''
run(L1_EX1_STARTER, "l1-ex1-starter")

# ============ L1 ex3 trace: ladder of assistance ============
L1_EX3_TRACE = '''RUNGS = ["autocomplete", "draft-and-fix", "task agent", "multi-agent swarm"]
for i, rung in enumerate(RUNGS, 1):
    print(str(i) + " " + rung)
print("higher rung = more happens before your review")
'''
run(L1_EX3_TRACE, "l1-ex3-trace", """1 autocomplete
2 draft-and-fix
3 task agent
4 multi-agent swarm
higher rung = more happens before your review""")

# ============ L2 worked: SPEC-DRIFT LEDGER ============
L2_WORKED = '''# SPEC-DRIFT LEDGER: requirement R2 changed. Count the edits each way.
SPOTS = [
    ("checkout.py", "R2"),
    ("invoice.py", "R2"),
    ("report.py", "R2"),
    ("auth.py", "R1"),
]

spec_edits = 1  # fix the spec once, then regenerate the code from it
code_edits = 0
for spot, req in SPOTS:
    if req == "R2":
        code_edits += 1
        print("code-first must edit: " + spot)

print("code-first edits: " + str(code_edits))
print("spec-first edits: " + str(spec_edits) + " (then regenerate)")
print("the spec wins: the code is the build output")
'''
run(L2_WORKED, "l2-worked", """code-first must edit: checkout.py
code-first must edit: invoice.py
code-first must edit: report.py
code-first edits: 3
spec-first edits: 1 (then regenerate)
the spec wins: the code is the build output""")

# ============ L2 ex1: SDD GATE ENGINE ============
L2_EX1_SOL = '''PHASES = ["constitution", "specify", "plan", "tasks", "implement"]
VALIDATED = {"constitution": True, "specify": True}

def next_phase(phases, validated):
    for phase in phases:
        if not validated.get(phase, False):
            return phase
    return "done"

stop = next_phase(PHASES, VALIDATED)
print("pipeline stops at: " + stop)
'''
run(L2_EX1_SOL, "l2-ex1-sol", "pipeline stops at: plan")
worker(L2_EX1_SOL, [
    'assert next_phase(PHASES, VALIDATED) == "plan", \'expected plan | actual: %r\' % next_phase(PHASES, VALIDATED)',
    'assert next_phase(PHASES, {"constitution": True, "specify": True, "plan": True, "tasks": True, "implement": True}) == "done", \'expected done when all gates approved\'',
    "assert 'pipeline stops at: plan' in __learner_output__, 'expected: pipeline stops at: plan | actual: %r' % __learner_output__",
], "l2-ex1-worker")

# ============ L3 worked: BRIEF-LINT ============
L3_WORKED = '''# BRIEF-LINT: every line of AGENTS.md spends context budget. Score the brief.
BRIEF = [
    ("run tests with: python -m pytest -q", "signal"),
    ("we generally try to avoid inline mocks", "aspiration"),
    ("never log raw card numbers - PCI scope", "signal"),
    ("our team is friendly and loves coffee", "noise"),
]

load_bearing = 0
for line, kind in BRIEF:
    if kind == "signal":
        load_bearing += 1
        print("keep: " + line)
    else:
        print("flag (" + kind + "): " + line)

print("load-bearing rules: " + str(load_bearing))
print("a rule with its why ports to every agent")
'''
run(L3_WORKED, "l3-worked", """keep: run tests with: python -m pytest -q
flag (aspiration): we generally try to avoid inline mocks
keep: never log raw card numbers - PCI scope
flag (noise): our team is friendly and loves coffee
load-bearing rules: 2
a rule with its why ports to every agent""")

# ============ L3 ex1: LOOP DOCTOR ============
L3_EX1_SOL = '''MOVES = ["discovery", "handoff", "verification", "persistence", "scheduling"]
ANTIPATTERN = {
    "discovery": "blind loop",
    "handoff": "tangled loop",
    "verification": "nodding loop",
    "persistence": "amnesiac loop",
    "scheduling": "manual loop",
}

def diagnose(loop):
    for move in MOVES:
        if not loop.get(move, False):
            return ANTIPATTERN[move]
    return "healthy loop"

print(diagnose({"discovery": True, "handoff": True, "verification": True,
                "persistence": True, "scheduling": True}))
print(diagnose({"discovery": True, "handoff": True, "verification": False,
                "persistence": True, "scheduling": True}))
print(diagnose({"discovery": True, "handoff": True, "verification": True,
                "persistence": False, "scheduling": True}))
'''
run(L3_EX1_SOL, "l3-ex1-sol", """healthy loop
nodding loop
amnesiac loop""")
worker(L3_EX1_SOL, [
    'assert diagnose({"discovery": True, "handoff": True, "verification": True, "persistence": True, "scheduling": True}) == "healthy loop", \'expected healthy loop | actual: %r\' % diagnose({"discovery": True, "handoff": True, "verification": True, "persistence": True, "scheduling": True})',
    'assert diagnose({"discovery": True, "handoff": True, "verification": True, "persistence": True, "scheduling": False}) == "manual loop", \'expected manual loop | actual: %r\' % diagnose({"discovery": True, "handoff": True, "verification": True, "persistence": True, "scheduling": False})',
    "assert 'nodding loop' in __learner_output__, 'expected: nodding loop | actual: %r' % __learner_output__",
], "l3-ex1-worker")

# ============ L3 ex2 trace: generator/evaluator ============
L3_EX2_TRACE = '''TURNS = [("add retry", False), ("add retry + test", True)]
for turn, (proposal, tests_pass) in enumerate(TURNS, 1):
    if tests_pass:
        verdict = "accept"
    else:
        verdict = "reject"
    print("turn " + str(turn) + ": " + proposal + " -> " + verdict)
print("evaluator default: no")
'''
run(L3_EX2_TRACE, "l3-ex2-trace", """turn 1: add retry -> reject
turn 2: add retry + test -> accept
evaluator default: no""")

# ============ L4 worked: EFFORT SHIFT ============
L4_WORKED = '''# EFFORT SHIFT: the same engineer week, before agents and after them.
WEEK = [
    ("specify: requirements + acceptance criteria", 8, 14),
    ("check: reviews, tests, metrics", 10, 18),
    ("generate: writing the first draft", 22, 8),
]
before_total = 0
after_total = 0
for name, before, after in WEEK:
    before_total += before
    after_total += after
    print(name + ": " + str(before) + "h -> " + str(after) + "h")
print("week: " + str(before_total) + "h -> " + str(after_total) + "h")
print("the effort moved up the stack, not away")
'''
run(L4_WORKED, "l4-worked", """specify: requirements + acceptance criteria: 8h -> 14h
check: reviews, tests, metrics: 10h -> 18h
generate: writing the first draft: 22h -> 8h
week: 40h -> 40h
the effort moved up the stack, not away""")

# ============ L4 ex1 PROJECT: VERIFY-LEDGER ============
L4_EX1_SOL = '''# PROJECT: VERIFY-LEDGER - the review-gate engine for agent-written changes.
# A change ships only through three gates (risk stops the line):
#   tests  - a green suite the agent did not grade alone
#   review - a SEPARATE reviewer (the author is the worst judge)
#   spec   - still aligned with the specification (the source of truth)
# Row: (change_id, kind, tests_pass, separate_review, spec_aligned)
LEDGER = [
    ("C1", "fix", True, True, True),
    ("C2", "feature", True, False, True),
    ("C3", "fix", False, True, True),
    ("C4", "feature", True, True, False),
    ("C5", "fix", True, True, True),
]
GATES = [("tests", 2), ("review", 3), ("spec", 4)]

def audit(rows):
    shipped = 0
    stopped = []
    for row in rows:
        failed = [name for name, i in GATES if not row[i]]
        if failed:
            stopped.append(row[0])
            print(row[0] + ": stop (" + ", ".join(failed) + ")")
        else:
            shipped += 1
            print(row[0] + ": ship")
    print("shipped: " + str(shipped) + "/" + str(len(rows)))
    print("stopped: " + ", ".join(stopped))
    return shipped

total = audit(LEDGER)
'''
run(L4_EX1_SOL, "l4-ex1-sol", """C1: ship
C2: stop (review)
C3: stop (tests)
C4: stop (spec)
C5: ship
shipped: 2/5
stopped: C2, C3, C4""")
worker(L4_EX1_SOL, [
    "assert 'C2: stop (review)' in __learner_output__, 'expected: C2: stop (review) | actual: %r' % __learner_output__",
    "assert 'shipped: 2/5' in __learner_output__, 'expected: shipped: 2/5 | actual: %r' % __learner_output__",
    "assert audit(LEDGER) == 2, 'expected 2 shipped | actual: %r' % audit(LEDGER)",
], "l4-ex1-worker")

L4_EX1_STARTER = '''LEDGER = [
    ("C1", "fix", True, True, True),
    ("C2", "feature", True, False, True),
    ("C3", "fix", False, True, True),
    ("C4", "feature", True, True, False),
    ("C5", "fix", True, True, True),
]
GATES = [("tests", 2), ("review", 3), ("spec", 4)]

def audit(rows):
    shipped = 0
    stopped = []
    for row in rows:
        failed = [name for name, i in GATES if not row[i]]
        # TODO: if failed is empty -> ship the change and count it;
        # otherwise record row[0] in stopped. Print one line per change:
        #   row[0] + ": ship"   or   row[0] + ": stop (" + ", ".join(failed) + ")"
        pass
    print("shipped: " + str(shipped) + "/" + str(len(rows)))
    print("stopped: " + ", ".join(stopped))
    return shipped

total = audit(LEDGER)
'''
run(L4_EX1_STARTER, "l4-ex1-starter")

# ============ L4 debug: self-graded audit (broken) + fixed solution ============
L4_DEBUG_BROKEN = '''# BROKEN: this auditor is the generator grading its own homework.
# It ships a change when the test suite is green - and checks nothing else.
LEDGER = [
    ("C1", "fix", True, True, True),
    ("C2", "feature", True, False, True),
    ("C3", "fix", False, True, True),
    ("C4", "feature", True, True, False),
    ("C5", "fix", True, True, True),
]

def audit(rows):
    shipped = 0
    stopped = []
    for row in rows:
        if row[2]:
            shipped += 1
            print(row[0] + ": ship (tests green)")
        else:
            stopped.append(row[0])
            print(row[0] + ": stop (tests)")
    print("shipped: " + str(shipped) + "/" + str(len(rows)))
    print("stopped: " + ", ".join(stopped))
    return shipped

audit(LEDGER)
'''
broken_out = run(L4_DEBUG_BROKEN, "l4-debug-broken", """C1: ship (tests green)
C2: ship (tests green)
C3: stop (tests)
C4: ship (tests green)
C5: ship (tests green)
shipped: 4/5
stopped: C3""")
for oracle_sub in ["C2: ship (tests green)", "C4: ship (tests green)", "shipped: 4/5"]:
    if oracle_sub not in broken_out:
        failures.append(f"l4-debug oracle substring missing: {oracle_sub}")

L4_DEBUG_SOL = '''LEDGER = [
    ("C1", "fix", True, True, True),
    ("C2", "feature", True, False, True),
    ("C3", "fix", False, True, True),
    ("C4", "feature", True, True, False),
    ("C5", "fix", True, True, True),
]
GATES = [("tests", 2), ("review", 3), ("spec", 4)]

def audit(rows):
    shipped = 0
    stopped = []
    for row in rows:
        failed = [name for name, i in GATES if not row[i]]
        if failed:
            stopped.append(row[0])
            print(row[0] + ": stop (" + ", ".join(failed) + ")")
        else:
            shipped += 1
            print(row[0] + ": ship")
    print("shipped: " + str(shipped) + "/" + str(len(rows)))
    print("stopped: " + ", ".join(stopped))
    return shipped

total = audit(LEDGER)
'''
run(L4_DEBUG_SOL, "l4-debug-sol", """C1: ship
C2: stop (review)
C3: stop (tests)
C4: stop (spec)
C5: ship
shipped: 2/5
stopped: C2, C3, C4""")
worker(L4_DEBUG_SOL, [
    "assert 'C2: stop (review)' in __learner_output__, 'expected: C2: stop (review) | actual: %r' % __learner_output__",
    "assert 'C4: stop (spec)' in __learner_output__, 'expected: C4: stop (spec) | actual: %r' % __learner_output__",
    "assert 'shipped: 2/5' in __learner_output__, 'expected: shipped: 2/5 | actual: %r' % __learner_output__",
], "l4-debug-worker")

# ============ L4 ex2 trace: six principles ============
L4_EX2_TRACE = '''PRINCIPLES = ["own intent", "keep fundamentals", "shift up", "manage risks",
              "outcomes not activity", "automate the loop, not the judgment"]
for i, principle in enumerate(PRINCIPLES, 1):
    print(str(i) + ": " + principle)
'''
run(L4_EX2_TRACE, "l4-ex2-trace", """1: own intent
2: keep fundamentals
3: shift up
4: manage risks
5: outcomes not activity
6: automate the loop, not the judgment""")

# ============ forbidden-token sweep over every snippet above ============
FORBIDDEN = ["input(", "exit(", "sys.exit", "random", "unittest.main", "subprocess",
             "os.system", "socket", "urllib.request", "http.client", "requests."]
ALL_SNIPPETS = {k: v for k, v in list(globals().items()) if k.startswith(("L1_", "L2_", "L3_", "L4_")) and isinstance(v, str)}
for name, code in ALL_SNIPPETS.items():
    for tok in FORBIDDEN:
        if tok in code:
            failures.append(f"{name}: forbidden token '{tok}'")

print("\n".join(failures) if failures else "ALL SCRATCH CHECKS PASS")
sys.exit(1 if failures else 0)
