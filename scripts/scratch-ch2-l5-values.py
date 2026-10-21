"""Scratch: verify every deterministic output for swe.ch2.l5 before authoring."""
import contextlib
import io


def run(code):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(code, "<s>", "exec"), {"__name__": "__main__"})
    return buf.getvalue()


# ---- predict ----
PREDICT = """TOTAL = 10
WINDOW = 4
done = 0
for fid, pts, defect in [('A', 3, 1), ('B', 4, 1), ('C', 3, 1)]:
    done += pts
    fresh = done >= TOTAL - WINDOW
    print(fid, 'fresh' if fresh else 'cold')
"""
print("== predict ==")
print(run(PREDICT))
assert run(PREDICT) == "A cold\nB fresh\nC fresh\n"

# ---- worked ----
WORKED = """WORK = [('G1', 2, 0), ('G2', 3, 1), ('G3', 2, 1), ('G4', 1, 0)]
WINDOW = 7
EARLY_FIX = 4

total_defects = sum(f[2] for f in WORK)
cost = 0
found = 0
for i in range(0, len(WORK), 2):
    batch = WORK[i:i + 2]
    built = 0
    for fid, pts, defect in batch:
        cost += pts
        built += pts
    print('iter %d: build %d points, test fresh' % (i // 2 + 1, built))
    for fid, pts, defect in batch:
        if defect and built <= WINDOW:
            found += 1
            cost += EARLY_FIX
            print('agile: fix %s inside iteration for %d' % (fid, EARLY_FIX))
print('agile: found %d/%d defects cost %d' % (found, total_defects, cost))
"""
print("== worked ==")
print(run(WORKED))
assert run(WORKED) == (
    "iter 1: build 5 points, test fresh\n"
    "agile: fix G2 inside iteration for 4\n"
    "iter 2: build 3 points, test fresh\n"
    "agile: fix G3 inside iteration for 4\n"
    "agile: found 2/2 defects cost 16\n"
)

# ---- ex1 project solution ----
SOL = """WORK = [
    ('F1', 3, 0),
    ('F2', 2, 1),
    ('F3', 4, 0),
    ('F4', 2, 1),
    ('F5', 3, 1),
    ('F6', 2, 0),
]
WINDOW = 7
LATE_FIX = 9
EARLY_FIX = 4
ESCAPED_COST = 12
TOTAL = sum(f[1] for f in WORK)
N_DEFECTS = sum(f[2] for f in WORK)

def simulate_waterfall(work):
    found = escaped = 0
    cost = 0
    done = 0
    for fid, pts, defect in work:
        cost += pts
        done += pts
        if defect:
            if done >= TOTAL - WINDOW:
                found += 1
                cost += LATE_FIX
                print('waterfall: fix %s late for %d' % (fid, LATE_FIX))
            else:
                escaped += 1
                cost += ESCAPED_COST
                print('waterfall: %s cold at test time -> escaped' % fid)
    print('waterfall: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))
    return {'found': found, 'escaped': escaped, 'cost': cost}

def simulate_agile(work, per_iter=2):
    found = escaped = 0
    cost = 0
    for i in range(0, len(work), per_iter):
        batch = work[i:i + per_iter]
        built = 0
        for fid, pts, defect in batch:
            cost += pts
            built += pts
        for fid, pts, defect in batch:
            if defect:
                if built <= WINDOW:
                    found += 1
                    cost += EARLY_FIX
                    print('agile: fix %s inside iteration for %d' % (fid, EARLY_FIX))
                else:
                    escaped += 1
                    cost += ESCAPED_COST
    print('agile: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))
    return {'found': found, 'escaped': escaped, 'cost': cost}

wf = simulate_waterfall(WORK)
ag = simulate_agile(WORK)
print('result: same %d points, cost %d vs %d, escaped %d vs %d' % (TOTAL, wf['cost'], ag['cost'], wf['escaped'], ag['escaped']))
"""
out = run(SOL)
print("== ex1 solution ==")
print(out)
assert out == (
    "waterfall: F2 cold at test time -> escaped\n"
    "waterfall: fix F4 late for 9\n"
    "waterfall: fix F5 late for 9\n"
    "waterfall: found 2/3 defects cost 46\n"
    "agile: fix F2 inside iteration for 4\n"
    "agile: fix F4 inside iteration for 4\n"
    "agile: fix F5 inside iteration for 4\n"
    "agile: found 3/3 defects cost 28\n"
    "result: same 16 points, cost 46 vs 28, escaped 1 vs 0\n"
)
# replay-like semantics: solution + tests in same env
env = {"__name__": "__main__"}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(SOL, "<s>", "exec"), env)
env["__learner_output__"] = buf.getvalue()
for t in [
    "assert 'waterfall: found 2/3 defects cost 46' in __learner_output__, 'expected: waterfall: found 2/3 defects cost 46 | actual: %r' % __learner_output__",
    "assert 'agile: found 3/3 defects cost 28' in __learner_output__, 'expected: agile: found 3/3 defects cost 28 | actual: %r' % __learner_output__",
    "assert 'result: same 16 points, cost 46 vs 28, escaped 1 vs 0' in __learner_output__, 'expected: result line cost 46 vs 28 escaped 1 vs 0 | actual: %r' % __learner_output__",
]:
    exec(compile(t, "<t>", "exec"), env)
print("ex1 tests: OK")

# ---- ex2 trace ----
TRACE = """PITCHES = [('P1', 6), ('P2', 8), ('P3', 2), ('P4', 6)]
BIG_BATCH = 6
for pid, appetite in PITCHES:
    if appetite > BIG_BATCH:
        print('%s: narrow' % pid)
    else:
        print('%s: bet' % pid)
"""
out = run(TRACE)
print("== ex2 trace ==")
print(out)
assert out == "P1: bet\nP2: narrow\nP3: bet\nP4: bet\n"

# ---- debug broken ----
BROKEN = """WORK = [
    ('F1', 3, 0),
    ('F2', 2, 1),
    ('F3', 4, 0),
    ('F4', 2, 1),
    ('F5', 3, 1),
    ('F6', 2, 0),
]
WINDOW = 7
LATE_FIX = 9
ESCAPED_COST = 12
TOTAL = sum(f[1] for f in WORK)
N_DEFECTS = sum(f[2] for f in WORK)

found = 0
escaped = 0
cost = 0
done = 0
for fid, pts, defect in WORK:
    cost += pts
    done += pts
    if defect:
        if done >= TOTAL - WINDOW:
            found += 1
            cost += LATE_FIX
            print('waterfall: fix %s late for %d' % (fid, LATE_FIX))
        else:
            pass  # cold defect: nothing to book here, right?
print('waterfall: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))
if escaped == 0:
    print('escape check: clean')
"""
out = run(BROKEN)
print("== debug broken ==")
print(out)
assert out == (
    "waterfall: fix F4 late for 9\n"
    "waterfall: fix F5 late for 9\n"
    "waterfall: found 2/3 defects cost 34\n"
    "escape check: clean\n"
)

# ---- debug fixed (solution) ----
FIXED = """WORK = [
    ('F1', 3, 0),
    ('F2', 2, 1),
    ('F3', 4, 0),
    ('F4', 2, 1),
    ('F5', 3, 1),
    ('F6', 2, 0),
]
WINDOW = 7
LATE_FIX = 9
ESCAPED_COST = 12
TOTAL = sum(f[1] for f in WORK)
N_DEFECTS = sum(f[2] for f in WORK)

found = 0
escaped = 0
cost = 0
done = 0
for fid, pts, defect in WORK:
    cost += pts
    done += pts
    if defect:
        if done >= TOTAL - WINDOW:
            found += 1
            cost += LATE_FIX
            print('waterfall: fix %s late for %d' % (fid, LATE_FIX))
        else:
            escaped += 1
            cost += ESCAPED_COST
            print('waterfall: %s cold at test time -> escaped' % fid)
print('waterfall: found %d/%d defects cost %d' % (found, N_DEFECTS, cost))
print('escape check: escaped %d' % escaped)
"""
out = run(FIXED)
print("== debug fixed ==")
print(out)
assert out == (
    "waterfall: F2 cold at test time -> escaped\n"
    "waterfall: fix F4 late for 9\n"
    "waterfall: fix F5 late for 9\n"
    "waterfall: found 2/3 defects cost 46\n"
    "escape check: escaped 1\n"
)
env = {"__name__": "__main__"}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(FIXED, "<s>", "exec"), env)
env["__learner_output__"] = buf.getvalue()
exec("assert 'waterfall: found 2/3 defects cost 46' in __learner_output__, 'expected: cost 46 books the escape bill | actual: %r' % __learner_output__", env)
exec("assert 'escape check: escaped 1' in __learner_output__, 'expected: escape check: escaped 1 | actual: %r' % __learner_output__", env)
print("debug solution tests: OK")

# ---- sandbox ----
SANDBOX = """WORK = [
    ('F1', 3, 0),
    ('F2', 2, 1),
    ('F3', 4, 0),
    ('F4', 2, 1),
    ('F5', 3, 1),
    ('F6', 2, 0),
]
WINDOW = 7
LATE_FIX = 9
EARLY_FIX = 4
ESCAPED_COST = 12

def defects(work):
    return sum(f[2] for f in work)

def simulate_waterfall(work, window=WINDOW):
    total = sum(f[1] for f in work)
    found = escaped = 0
    cost = total
    done = 0
    for fid, pts, defect in work:
        done += pts
        if defect:
            if done >= total - window:
                found += 1
                cost += LATE_FIX
            else:
                escaped += 1
                cost += ESCAPED_COST
    print('waterfall: found %d/%d defects cost %d' % (found, defects(work), cost))
    return found, escaped, cost

def simulate_agile(work, per_iter=2, window=WINDOW):
    found = escaped = 0
    cost = 0
    for i in range(0, len(work), per_iter):
        batch = work[i:i + per_iter]
        built = 0
        for fid, pts, defect in batch:
            cost += pts
            built += pts
        for fid, pts, defect in batch:
            if defect:
                if built <= window:
                    found += 1
                    cost += EARLY_FIX
                else:
                    escaped += 1
                    cost += ESCAPED_COST
    print('agile: found %d/%d defects cost %d' % (found, defects(work), cost))
    return found, escaped, cost

simulate_waterfall(WORK)
simulate_agile(WORK)
"""
out = run(SANDBOX)
print("== sandbox ==")
print(out)
assert out == "waterfall: found 2/3 defects cost 46\nagile: found 3/3 defects cost 28\n"

# ---- sandbox exploration sanity (WINDOW=16 and WINDOW=4) ----
print("== sandbox WINDOW=16 ==")
print(run(SANDBOX.replace("WINDOW = 7", "WINDOW = 16")))
print("== sandbox WINDOW=4 ==")
print(run(SANDBOX.replace("WINDOW = 7", "WINDOW = 4")))

print("ALL SCRATCH CHECKS OK")
