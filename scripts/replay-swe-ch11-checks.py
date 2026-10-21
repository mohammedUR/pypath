#!/usr/bin/env python3
"""Task 13-a2 verification: cross-check swe.ch11 lesson data under CPython.

1. trace_output: run the shown code, whitespace-normalize stdout, compare to answer.
2. runnables (predict/worked/sandbox): must execute without raising.
3. mcq/numeric: answer must equal solution.
4. fill_blank: answers must be ':'-free single tokens.
5. broken debug code: must run (no crash) and show the intended silent symptom —
   swe.ch11.l3: the permissive range pin accepts BOTH 2.15.0 and 2.15.1
   ('log4j-core: ok' twice, never 'blocked');
   swe.ch11.l4: a salt on the check side makes the unsalted-leak sweep miss
   everything ('breached: 0', never 'breached: 2').
Run: python3 scripts/replay-swe-ch11-checks.py
"""
import contextlib
import io
import json
import os
import sys
import tempfile

sys.stdout.reconfigure(encoding="utf-8")

with open("scripts/.swe-ch11-checks.json", encoding="utf-8") as f:
    data = json.load(f)

workdir = tempfile.mkdtemp(prefix="pypath-swe-ch11-checks-")
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


def symptom_ok(lesson: str, out: str) -> tuple[bool, str]:
    if lesson == "swe.ch11.l1":
        # dropped salt: the correct password is denied fail-closed
        if "bob: denied" in out and "bob: ok" not in out and out.count("bob: denied") == 2:
            return True, "missing salt denies the correct password fail-closed"
        return False, "expected 'bob: denied' twice without 'bob: ok'"
    if lesson == "swe.ch11.l2":
        # top-level-only walk: a nested eval is counted as zero (false negative)
        if "eval: 0" in out and "eval: 1" not in out:
            return True, "top-level-only walk misses the nested eval"
        return False, "expected 'eval: 0' without 'eval: 1'"
    if lesson == "swe.ch11.l3":
        if "blocked" not in out and out.count("log4j-core: ok") == 2:
            return True, "permissive range pin accepts both versions"
        return False, "expected 'log4j-core: ok' twice without 'blocked'"
    if lesson == "swe.ch11.l4":
        if "breached: 0" in out and "breached: 2" not in out:
            return True, "check-side salt blinds the unsalted-leak sweep"
        return False, "expected 'breached: 0' without 'breached: 2'"
    return False, "no symptom oracle for " + lesson


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
        ok, why = symptom_ok(b["lesson"], out)
        if ok:
            print(f"PASS broken {b['lesson']}/{b['id']}  runs, symptom ({why}) stdout={out.strip()!r}")
        else:
            failures += 1
            print(
                f"FAIL broken {b['lesson']}/{b['id']}  runs but wrong symptom ({why}): {out.strip()!r}"
            )
    except BaseException as e:  # noqa: BLE001
        failures += 1
        print(f"FAIL broken {b['lesson']}/{b['id']}  raised {type(e).__name__}: {e} (broken code must run, not crash)")

print(f"\n{'ALL CHECKS PASS' if failures == 0 else str(failures) + ' FAILURES'}")
