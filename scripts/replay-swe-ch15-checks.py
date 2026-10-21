#!/usr/bin/env python3
"""Task 13-main verification: cross-check swe.ch15 lesson data under CPython.

1. trace_output: run the shown code, whitespace-normalize stdout, compare to answer.
2. runnables (predict/worked/sandbox): must execute without raising.
3. mcq/numeric: answer must equal solution.
4. fill_blank: answers must be ':'-free single tokens.
5. broken debug code: must run (no crash) and show the intended per-lesson symptom:
   - l1 ex5.debug-stale-oracle: red suite from a stale spec — 'failures: 1' with
     the observed truth 'probe: 9 -> C' still printed.
   - l2 ex5.debug-slip: refactor slipped >= — 'failures: 1' with the edge probe
     'probe: 200 -> 165' instead of the pinned 180.
   - l3 ex5.debug-router-default: optimistic default 'new' — 'legacy: 0' with
     'new:/payroll' served by the wrong module.
   - l4 ex5.debug-detail-test: implementation-detail test — 'run: 4 failures: 1'.
Run: python3 scripts/replay-swe-ch15-checks.py
"""
import contextlib
import io
import json
import os
import sys
import tempfile

sys.stdout.reconfigure(encoding="utf-8")

with open("scripts/.swe-ch15-checks.json", encoding="utf-8") as f:
    data = json.load(f)

workdir = tempfile.mkdtemp(prefix="pypath-swe-ch15-checks-")
os.chdir(workdir)

failures = 0

# Per-lesson broken-code symptom oracles (broken code must RUN and show it).
BROKEN_ORACLE = {
    "swe.ch15.l1": lambda out: "failures: 1" in out and "probe: 9 -> C" in out,
    "swe.ch15.l2": lambda out: "failures: 1" in out and "probe: 200 -> 165" in out,
    "swe.ch15.l3": lambda out: "legacy: 0" in out and "new:/payroll" in out,
    "swe.ch15.l4": lambda out: "run: 4 failures: 1" in out,
}


def norm_ws(s: str) -> str:
    lines = [ln.strip() for ln in s.split("\n")]
    out = []
    for i, ln in enumerate(lines):
        if ln == "" and i > 0 and lines[i - 1] == "":
            continue
        out.append(ln)
    return "\n".join(out).strip()


for t in data["traces"]:
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(t["code"], "<trace>", "exec"), {"__name__": "__main__"})
        got = norm_ws(buf.getvalue())
        want = norm_ws(t["answer"])
        if got == want:
            print(f"PASS trace  {t['lesson']}/{t['id']}  -> {got!r}")
        else:
            failures += 1
            print(f"FAIL trace  {t['lesson']}/{t['id']}  expected {want!r} got {got!r}")
    except BaseException as e:  # noqa: BLE001
        failures += 1
        print(f"FAIL trace  {t['lesson']}/{t['id']}  raised {type(e).__name__}: {e}")

for r in data["runnables"]:
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(r["code"], "<runnable>", "exec"), {"__name__": "__main__"})
        print(f"PASS run    {r['lesson']}/{r['kind']}")
    except BaseException as e:  # noqa: BLE001
        failures += 1
        print(f"FAIL run    {r['lesson']}/{r['kind']}  raised {type(e).__name__}: {e}")

for m in data["mcqs"]:
    if m["answer"] == m["solution"]:
        print(f"PASS mcq    {m['lesson']}/{m['id']}  answer={m['answer']}")
    else:
        failures += 1
        print(f"FAIL mcq    {m['lesson']}/{m['id']}  answer={m['answer']} solution={m['solution']}")

for fl in data["fills"]:
    a = fl["answer"]
    if ":" not in a and a.strip() != "" and " " not in a.strip():
        print(f"PASS fill   {fl['lesson']}/{fl['id']}  answer={a!r}")
    else:
        failures += 1
        print(f"FAIL fill   {fl['lesson']}/{fl['id']}  answer={a!r} (must be a single ':'-free token)")

for b in data["broken"]:
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(b["brokenCode"], "<broken>", "exec"), {"__name__": "__main__"})
        out = buf.getvalue()
        oracle = BROKEN_ORACLE.get(b["lesson"])
        if oracle and oracle(out):
            print(f"PASS broken {b['lesson']}/{b['id']}  symptom confirmed")
        else:
            failures += 1
            print(
                f"FAIL broken {b['lesson']}/{b['id']}  runs but wrong symptom: {out.strip().splitlines()[-3:]!r}"
            )
    except BaseException as e:  # noqa: BLE001
        failures += 1
        print(f"FAIL broken {b['lesson']}/{b['id']}  raised {type(e).__name__}: {e} (broken code must run, not crash)")

print(f"\n{'ALL CHECKS PASS' if failures == 0 else str(failures) + ' FAILURES'}")
