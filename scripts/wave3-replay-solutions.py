#!/usr/bin/env python3
"""Wave-3 generic solution replay: replicate public/pyodide-worker.js
__pypath_run_tests semantics (stdout -> __learner_output__, tests exec'd in the
learner env, fresh temp-dir CWD like MEMFS one-run lifetime).
Run: python3 scripts/wave3-replay-solutions.py scripts/.wave3-chN-solutions.json
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
    suites = json.load(f)

total = 0
failed = 0
workdir = tempfile.mkdtemp(prefix="pypath-wave3-")
os.chdir(workdir)

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
    tail = buf.getvalue().strip().splitlines()[-1] if buf.getvalue().strip() else ""
    print(f"{status}  {s['lesson']}/{s['id']}  stdout={tail!r}")
    for tid, p, msg in test_results:
        if not p:
            print(f"      - {tid}: {msg}")

print(f"\n{total - failed}/{total} suites pass")
sys.exit(0 if failed == 0 else 1)
