#!/usr/bin/env python3
"""R-SRC-01: Recon of the four source books — page counts + outline availability."""
import fitz  # PyMuPDF

BOOKS = {
    "PY4E": "/home/z/my-project/upload/book_ar_2023_01_01.pdf",
    "SWE":  "/home/z/my-project/upload/swebook-python.pdf",
    "MLS":  "/home/z/my-project/upload/book.pdf",
    "D2L":  "/home/z/my-project/upload/d2l-en.pdf",
}

def walk(outline, depth=0, out=None):
    if out is None:
        out = []
    for item in outline:
        if isinstance(item, list):
            walk(item, depth + 1, out)
        else:
            try:
                page = item.get("page", -1)
            except Exception:
                page = -1
            out.append((depth, item.title.strip() if item.title else "", page))
    return out

for code, path in BOOKS.items():
    doc = fitz.open(path)
    n = doc.page_count
    try:
        toc = doc.get_toc(simple=True)  # [[level, title, page1based], ...]
    except Exception as e:
        toc = []
        print(f"{code}: toc error {e}")
    print(f"=== {code}: {n} pages, toc entries: {len(toc)}")
    for lvl, title, page in toc[:25]:
        print(f"  {'  '*lvl}L{lvl} p{page}: {title[:80]}")
    if len(toc) > 25:
        print(f"  ... ({len(toc)-25} more)")
    doc.close()
