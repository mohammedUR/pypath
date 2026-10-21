"""Extract MLS + D2L chapter texts for Part II lesson authoring.
Usage: python3 scripts/extract_mls_d2l.py mls|d2l [chapter-id ...]
Writes curriculum/sources/{MLS,D2L}/{chN|appendix}.txt with page markers.
"""
import json, sys, os

import fitz

BOOK = sys.argv[1] if len(sys.argv) > 1 else "mls"
pdf_name = {"mls": "upload/mls-book.pdf", "d2l": "upload/d2l-en.pdf"}[BOOK]
# MLS PDF: find the file (upload dir)
if BOOK == "mls":
    for cand in ["upload/mls-book.pdf", "upload/book_ar_2023_01_01.pdf"]:
        pass
toc = json.load(open(f"curriculum/sources/{BOOK.upper()}.toc.json"))
OFFSET = toc.get("page_offset", 0)
doc = fitz.open(pdf_name)

wanted = sys.argv[2:] or None
for ch in toc["chapters"]:
    cid = ch["id"]  # mls.ch1 / d2l.ch1 / mls.appendix
    if wanted and cid not in wanted:
        continue
    start = ch.get("pdfPage")
    if not start:
        print(f"skip {cid}: no pdfPage")
        continue
    nxt = None
    chapters = toc["chapters"]
    idx = chapters.index(ch)
    if idx + 1 < len(chapters):
        nxt = chapters[idx + 1]
    end = nxt["pdfPage"] if (nxt and nxt.get("pdfPage")) else doc.page_count + 1
    out = []
    for pdf_page in range(start, end):
        book_page = pdf_page - OFFSET
        text = doc[pdf_page - 1].get_text("text")
        out.append("\n===== صفحة الكتاب %d =====\n" % book_page)
        out.append(text)
    fname = "appendix" if "appendix" in cid else cid.split(".")[-1]
    d = f"curriculum/sources/{BOOK.upper()}"
    os.makedirs(d, exist_ok=True)
    path = f"{d}/{fname}.txt"
    open(path, "w", encoding="utf-8").write("".join(out))
    print(f"wrote {path} (pdf pp.{start}-{end-1}, chars={sum(len(x) for x in out)})")
