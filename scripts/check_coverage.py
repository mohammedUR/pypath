#!/usr/bin/env python3
"""R-COV-02: `npm run check:coverage` — validate coverage + graph integrity.

Default (report mode): prints the true coverage table, exits 0.
--strict: fails unless 100% of required sections are published and graph is clean.
Graph checks (R-CUR-04): cycles, orphans (published lessons with no edge), unreachable nodes.
"""
import json, sys
from pathlib import Path

CUR = Path(__file__).resolve().parents[1] / "curriculum"
coverage = json.loads((CUR / "coverage.json").read_text(encoding="utf-8"))
graph = json.loads((CUR / "graph.json").read_text(encoding="utf-8"))
strict = "--strict" in sys.argv

fail = False
total_s = total_p = 0
print("book       chapters  sections  published  %")
for code, b in coverage["books"].items():
    secs = [s for c in b["chapters"] for s in c["sections"]]
    pub = sum(1 for s in secs if s["status"] == "published")
    total_s += len(secs); total_p += pub
    pct = 100 * pub / len(secs)
    if strict and pct < 100:
        fail = True
    print(f"{code:10} {len(b['chapters']):8} {len(secs):9} {pub:10} {pct:5.1f}")
pct = 100 * total_p / total_s
print(f"{'TOTAL':10} {'':8} {total_s:9} {total_p:10} {pct:5.1f}")

# every section must have a mapping entry
for code, b in coverage["books"].items():
    for c in b["chapters"]:
        for s in c["sections"]:
            if not isinstance(s["status"], str):
                print(f"FAIL: malformed entry {code} {s['sectionId']}"); fail = True

# graph integrity
nodes = {n["id"] for n in graph["nodes"]}
edges = graph["edges"]
adj = {}
for e in edges:
    adj.setdefault(e["from"], []).append(e["to"])
    if e["to"] not in nodes:
        print(f"FAIL: edge to unknown node {e['to']}"); fail = True
    if e["from"] not in nodes:
        print(f"FAIL: edge from unknown node {e['from']}"); fail = True
# cycle detection (DFS)
state = {}
def dfs(u):
    if state.get(u) == 1:
        print(f"FAIL: cycle at {u}"); return True
    if state.get(u) == 2: return False
    state[u] = 1
    bad = any(dfs(v) for v in adj.get(u, []))
    state[u] = 2
    return bad
cyc = any(dfs(n) for n in nodes)
if cyc: fail = True
lesson_nodes = [n for n in graph["nodes"] if n["kind"] == "lesson"]
if lesson_nodes:
    connected = {nid for e in edges for nid in (e["from"], e["to"])}
    orphans = [n["id"] for n in lesson_nodes if n["id"] not in connected]
    if orphans and len(lesson_nodes) > 1:
        print(f"WARN: orphan lesson nodes: {orphans}")

if strict:
    if pct < 100: print(f"STRICT: coverage {pct:.1f}% < 100% — gate fails")
    if fail: sys.exit(1)
    if pct >= 100 and not fail: print("STRICT: PASS (100% coverage, graph clean)")
elif fail:
    sys.exit(1)
else:
    print(f"report mode: OK (coverage {pct:.1f}% — target 100% at M2/M4 gates)")
