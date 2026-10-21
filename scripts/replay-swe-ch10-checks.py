#!/usr/bin/env python3
"""Task 13-main verification: cross-check swe.ch10 lesson data under CPython.

1. trace_output: run the shown code, whitespace-normalize stdout, compare to answer.
2. runnables (predict/worked/sandbox): must execute without raising.
3. mcq/numeric: answer must equal solution.
4. fill_blank: answers must be ':'-free single tokens.
5. broken debug code: must run (no crash) and show the intended swe.ch10.l5
   oracle-bug symptom: the honest suite reports 'FAILED: pass edge' and
   'tests: 4 passed: 3' (never 4 passed: 4) while the code itself conforms
   to the spec (normalize_grade(79) == 1).
Run: python3 scripts/replay-swe-ch10-checks.py
"""
import contextlib
import io
import json
import os
import sys
import tempfile

sys.stdout.reconfigure(encoding="utf-8")

with open("scripts/.swe-ch10-checks.json", encoding="utf-8") as f:
    data = json.load(f)

workdir = tempfile.mkdtemp(prefix="pypath-swe-ch10-checks-")
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
        # swe.ch10.l5 symptom: honest suite + wrong oracle — the 79 case fails
        # loudly while the code conforms (normalize_grade(79) == 1).
        if (
            "FAILED: pass edge" in out
            and "tests: 4 passed: 3" in out
            and "tests: 4 passed: 4" not in out
        ):
            print(f"PASS broken {b['lesson']}/{b['id']}  runs, symptom stdout={out.strip()!r}")
        else:
            failures += 1
            print(
                f"FAIL broken {b['lesson']}/{b['id']}  runs but wrong symptom (expected 'FAILED: pass edge' + 'tests: 4 passed: 3' without '4 passed: 4'): {out.strip()!r}"
            )
    except BaseException as e:  # noqa: BLE001
        failures += 1
        print(f"FAIL broken {b['lesson']}/{b['id']}  raised {type(e).__name__}: {e} (broken code must run, not crash)")

print(f"\n{'ALL CHECKS PASS' if failures == 0 else str(failures) + ' FAILURES'}")
