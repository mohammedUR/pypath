#!/usr/bin/env python3
"""Wave-3 generic checks replay: traces (whitespace-normalized exact), runnables
(must execute), mcq/numeric (answer == solution), fills (single ':'-free token),
broken debug code (must RUN and match per-lesson symptom oracles).
Run: python3 scripts/wave3-replay-checks.py <checks.json> <oracles.json>
oracles.json: {"lessonId": ["substring1", "substring2"]} — ALL substrings must
appear in the broken code's stdout (first debug block of that lesson).
"""
import contextlib
import io
import json
import os
import sys
import tempfile

sys.stdout.reconfigure(encoding="utf-8")

# Platform modules (minigrad, M3): importable by lesson code in replays,
# mirroring the worker FS preload of /home/pyodide/minigrad.py.
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "py-modules"))

with open(sys.argv[1], encoding="utf-8") as f:
    data = json.load(f)

oracles = {}
if len(sys.argv) > 2:
    with open(sys.argv[2], encoding="utf-8") as f:
        oracles = json.load(f)

workdir = tempfile.mkdtemp(prefix="pypath-wave3-checks-")
os.chdir(workdir)

failures = 0


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
        if r.get("expectedError"):
            failures += 1
            print(f"FAIL run    {r['lesson']}/{r['kind']}  expected {r['expectedError']} (error-teaching) but ran clean")
        else:
            print(f"PASS run    {r['lesson']}/{r['kind']}")
    except BaseException as e:  # noqa: BLE001
        if r.get("expectedError"):
            if type(e).__name__ == r["expectedError"]:
                print(f"PASS run    {r['lesson']}/{r['kind']}  error-teaching verified: {type(e).__name__}")
            else:
                failures += 1
                print(f"FAIL run    {r['lesson']}/{r['kind']}  expected {r['expectedError']} but raised {type(e).__name__}: {e}")
        else:
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
        if b.get("expectedError"):
            failures += 1
            print(f"FAIL broken {b['lesson']}/{b['id']}  expected {b['expectedError']} but ran clean — add the crash back or drop expectedError")
            continue
        subs = oracles.get(b["lesson"])
        if subs is None:
            print(f"INFO broken {b['lesson']}/{b['id']}  no oracle yet — stdout tail: {out.strip().splitlines()[-4:]!r}")
        elif all(s in out for s in subs):
            print(f"PASS broken {b['lesson']}/{b['id']}  symptom confirmed")
        else:
            failures += 1
            print(f"FAIL broken {b['lesson']}/{b['id']}  runs but wrong symptom; stdout tail: {out.strip().splitlines()[-4:]!r}")
    except BaseException as e:  # noqa: BLE001
        if b.get("expectedError"):
            if type(e).__name__ == b["expectedError"]:
                print(f"PASS broken {b['lesson']}/{b['id']}  intentional crash verified: {type(e).__name__}")
            else:
                failures += 1
                print(f"FAIL broken {b['lesson']}/{b['id']}  expected {b['expectedError']} but raised {type(e).__name__}: {e}")
        else:
            failures += 1
            print(f"FAIL broken {b['lesson']}/{b['id']}  raised {type(e).__name__}: {e} (broken code must run, not crash)")

print(f"\n{'ALL CHECKS PASS' if failures == 0 else str(failures) + ' FAILURES'}")
sys.exit(0 if failures == 0 else 1)
