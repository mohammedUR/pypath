#!/usr/bin/env python3
"""M5: build the full broken-symptom oracle registry — runs every broken debug
block under CPython, picks distinctive stdout lines, merges with the existing
ch13 oracles, writes scripts/.w3-oracles.json (canonical from now on)."""
import contextlib, io, json, os, sys, tempfile

sys.stdout.reconfigure(encoding="utf-8")
data = json.load(open("/tmp/m5-chk.json", encoding="utf-8"))

existing = {}
p_old = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".w3-ch13-oracles.json")
if os.path.exists(p_old):
    existing = json.load(open(p_old, encoding="utf-8"))

oracles = dict(existing)
built = 0
for b in data["broken"]:
    lid = b["lesson"]
    if lid in oracles or b.get("expectedError"):
        continue
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(b["brokenCode"], "<broken>", "exec"), {"__name__": "__main__"})
    except BaseException as e:
        print(f"SKIP {lid}/{b['id']}: raises {type(e).__name__} (no expectedError set!)")
        continue
    lines = [ln for ln in buf.getvalue().splitlines() if ln.strip()]
    if not lines:
        print(f"SKIP {lid}/{b['id']}: empty stdout")
        continue
    # symptom substrings: first + last non-empty lines (most distinctive pair)
    subs = [lines[-1]]
    if len(lines) > 1:
        subs.insert(0, lines[0])
    subs = [s.strip() for s in subs]
    oracles[lid] = subs
    built += 1

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".w3-oracles.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(oracles, f, ensure_ascii=False, indent=1)
print(f"built {built} new oracles; total {len(oracles)} -> {out}")
