#!/usr/bin/env python3
"""Task 10-a verification: replicate public/pyodide-worker.js __pypath_run_tests
semantics — exec learner solution with stdout captured to __learner_output__,
then exec each test in the same env. Prints PASS/FAIL per suite.

ch11 solutions are self-contained (no file I/O), but we chdir into a temp dir
anyway to mirror the Pyodide MEMFS one-run lifetime.
Run: python3 scripts/replay-ch11-solutions.py
"""
import contextlib
import io
import json
import os
import sys
import tempfile

sys.stdout.reconfigure(encoding="utf-8")

with open("scripts/.ch11-solutions.json", encoding="utf-8") as f:
    suites = json.load(f)

total = 0
failed = 0
workdir = tempfile.mkdtemp(prefix="pypath-ch11-")
os.chdir(workdir)  # MEMFS stand-in: fresh CWD, relative paths, one-run lifetime

for s in suites:
    env = {"__name__": "__main__"}
    buf = io.StringIO()
    ok = True
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(s["solution"], "<lesson>", "exec"), env)
    except BaseException as e:  # noqa: BLE001
        print(f"FAIL RUN  {s['lesson']}/{s['id']}: {type(e).__name__}: {e}")
        failed += 1
        total += 1
        continue
    env["__learner_output__"] = buf.getvalue()
    test_results = []
    for t in s["tests"]:
        try:
            exec(compile(t["code"], "<test>", "exec"), env)
            test_results.append((t["id"], True, ""))
        except AssertionError as e:
            test_results.append((t["id"], False, str(e)))
        except BaseException as e:  # noqa: BLE001
            test_results.append((t["id"], False, type(e).__name__ + ": " + str(e)))
    suite_pass = all(p for _, p, _ in test_results)
    total += 1
    if not suite_pass:
        failed += 1
    status = "PASS" if suite_pass else "FAIL"
    print(f"{status}  {s['lesson']}/{s['id']}  stdout={buf.getvalue()!r}")
    for tid, p, msg in test_results:
        if not p:
            print(f"      - {tid}: {msg}")

print(f"\n{total - failed}/{total} suites pass")
