#!/usr/bin/env python3
"""R-COV-01/03: generate curriculum/coverage.json + curriculum/graph.json
from curriculum/sources/*.toc.json and content/manifest.json (published lessons)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CUR = ROOT / "curriculum"
# Published lessons this milestone (see content/manifest.json authoring)
manifest_path = ROOT / "content" / "manifest.json"
PUBLISHED = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {"lessons": []}
pub_ids = {l["id"] for l in PUBLISHED["lessons"]}
# sections covered by at least one published lesson
covered_sections = set()
for l in PUBLISHED["lessons"]:
    for s in l.get("sources", []):
        covered_sections.add((s["book"], s["section"]))

coverage = {"generatedBy": "scripts/gen_coverage.py", "books": {}}
graph_nodes, graph_edges = [], []

for code in ["PY4E", "SWE", "MLS", "D2L"]:
    toc = json.loads((CUR / "sources" / f"{code}.toc.json").read_text(encoding="utf-8"))
    book_cov = {"title": toc["title"], "chapters": []}
    for ch in toc["chapters"]:
        ch_cov = {"id": ch["id"], "title": ch["title"], "sections": []}
        # chapter node (planned world node in the graph)
        ch_node_id = f"ch:{ch['id']}"
        graph_nodes.append({"id": ch_node_id, "kind": "chapter", "book": code, "status": "planned"})
        for s in ch["sections"]:
            key = (code, s["id"])
            cov = key in covered_sections
            entry = {
                "sectionId": s["id"], "title": s["title"],
                "lessonIds": [l["id"] for l in PUBLISHED["lessons"] if any(x["book"] == code and x["section"] == s["id"] for x in l.get("sources", []))],
                "labIds": [], "quizIds": [],
                "status": "published" if cov else "planned",
            }
            ch_cov["sections"].append(entry)
            # graph: lesson nodes + prerequisite chain edges are added from manifest
        book_cov["chapters"].append(ch_cov)
    coverage["books"][code] = book_cov

for l in PUBLISHED["lessons"]:
    graph_nodes.append({"id": f"lesson:{l['id']}", "kind": "lesson", "title": l["id"], "status": "published"})
    for req in l.get("prerequisites", []):
        graph_edges.append({"from": f"lesson:{req}", "to": f"lesson:{l['id']}", "type": "hard"})

# chain lessons within same track in authored order
by_track = {}
for l in PUBLISHED["lessons"]:
    by_track.setdefault(l["track"], []).append(l)
for track, ls in by_track.items():
    ls.sort(key=lambda x: x.get("order", 0))
    for a, b in zip(ls, ls[1:]):
        graph_edges.append({"from": f"lesson:{a['id']}", "to": f"lesson:{b['id']}", "type": "sequence"})

(CUR / "coverage.json").write_text(json.dumps(coverage, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
(CUR / "graph.json").write_text(json.dumps({"nodes": graph_nodes, "edges": graph_edges}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

# report
print("book       chapters  sections  published  %")
total_s = total_p = 0
for code, b in coverage["books"].items():
    secs = [s for c in b["chapters"] for s in c["sections"]]
    pub = sum(1 for s in secs if s["status"] == "published")
    total_s += len(secs); total_p += pub
    print(f"{code:10} {len(b['chapters']):8} {len(secs):9} {pub:10} {100*pub/len(secs):5.1f}")
print(f"{'TOTAL':10} {'':8} {total_s:9} {total_p:10} {100*total_p/total_s:5.1f}")
