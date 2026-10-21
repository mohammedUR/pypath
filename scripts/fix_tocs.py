#!/usr/bin/env python3
"""Fix chapter start pages for SWE/MLS and filter D2L L1 entries to real chapters."""
import fitz, json, re

SRC = "/home/z/my-project/upload"
OUT = "/home/z/my-project/curriculum/sources"

def find_after_toc(pdf_path, patterns, skip_pages=18):
    """Find first body page (1-based) after front matter whose text contains pattern."""
    doc = fitz.open(pdf_path)
    norm = lambda s: re.sub(r"\s+", " ", s)
    results = {}
    for pat in patterns:
        for p in range(skip_pages, doc.page_count):
            if pat in norm(doc[p].get_text("text")):
                results[pat] = p + 1
                break
    doc.close()
    return results

# --- SWE: rebuild chapter pdfPages
swe = json.load(open(f"{OUT}/SWE.toc.json"))
pats = [f"Chapter {c['number']} — {c['title']}" for c in swe["chapters"] if isinstance(c["number"], int)]
found = find_after_toc(f"{SRC}/swebook-python.pdf", pats)
for c in swe["chapters"]:
    if isinstance(c["number"], int):
        c["pdfPage"] = found.get(f"Chapter {c['number']} — {c['title']}")
        c["bookPage"] = c["pdfPage"]
json.dump(swe, open(f"{OUT}/SWE.toc.json", "w"), ensure_ascii=False, indent=1)
print("SWE starts:", [(c["number"], c["pdfPage"]) for c in swe["chapters"]])

# --- MLS: chapter headings like "1. Ordinary Linear Regression" appear as headings
mls = json.load(open(f"{OUT}/MLS.toc.json"))
pats = []
for c in mls["chapters"]:
    if isinstance(c["number"], int):
        pats.append(f"{c['number']}. {c['title']}")
found = find_after_toc(f"{SRC}/book.pdf", pats, skip_pages=2)
for c in mls["chapters"]:
    if isinstance(c["number"], int):
        c["pdfPage"] = found.get(f"{c['number']}. {c['title']}")
        c["bookPage"] = c["pdfPage"]
json.dump(mls, open(f"{OUT}/MLS.toc.json", "w"), ensure_ascii=False, indent=1)
print("MLS starts:", [(c["number"], c["pdfPage"]) for c in mls["chapters"]])

# --- D2L: filter L1 entries
d2l = json.load(open(f"{OUT}/D2L.toc.json"))
REAL = ["Introduction", "Preliminaries", "Linear Neural Networks for Regression",
        "Linear Neural Networks for Classification", "Multilayer Perceptrons", "Builders' Guide",
        "Convolutional Neural Networks", "Modern Convolutional Neural Networks",
        "Recurrent Neural Networks", "Modern Recurrent Neural Networks",
        "Attention Mechanisms and Transformers", "Optimization Algorithms",
        "Computational Performance", "Computer Vision",
        "Natural Language Processing: Pretraining", "Natural Language Processing: Applications",
        "Reinforcement Learning", "Gaussian Processes", "Hyperparameter Optimization",
        "Generative Adversarial Networks", "Recommender Systems",
        "Appendix A Mathematics for Deep Learning", "Appendix B Tools for Deep Learning"]
kept = [c for c in d2l["chapters"] if c["title"] in REAL]
print("D2L chapters before/after:", len(d2l["chapters"]), "->", len(kept))
for i, c in enumerate(kept, 1):
    c["number"] = i
    c["id"] = f"d2l.ch{i}"
    for j, s in enumerate(c["sections"], 1):
        s["number"] = f"{i}.{j}"
        s["id"] = f"d2l.ch{i}.s{j}"
d2l["chapters"] = kept
json.dump(d2l, open(f"{OUT}/D2L.toc.json", "w"), ensure_ascii=False, indent=1)
nsec = sum(len(c["sections"]) for c in d2l["chapters"])
print(f"D2L: {len(kept)} chapters, {nsec} sections")
