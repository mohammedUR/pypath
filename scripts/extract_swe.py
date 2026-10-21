"""Extract SWE book text for chapters as authoring inputs.

Usage: python3 scripts/extract_swe.py [chapter ...]   (default: 8 9 10)
Page markers '===== صفحة الكتاب N =====' matching the M0 convention.
Book pages are taken from the toc pdfPage entries (offset differs from PY4E).
"""
import json
import sys

import fitz

toc = json.load(open("curriculum/sources/SWE.toc.json"))
OFFSET = toc["page_offset"]
doc = fitz.open("upload/swebook-python.pdf")

chapters = [int(a) for a in sys.argv[1:]] or [8, 9, 10]
for ch in chapters:
    node = toc["chapters"][ch - 1]
    start = node["pdfPage"]
    nxt = toc["chapters"][ch] if ch < len(toc["chapters"]) else None
    end = nxt["pdfPage"] if (nxt and nxt.get("pdfPage")) else doc.page_count + 1
    out = []
    for pdf_page in range(start, end):
        book_page = pdf_page - OFFSET
        text = doc[pdf_page - 1].get_text("text")  # 1-indexed page -> 0-indexed
        out.append("\n===== صفحة الكتاب %d =====\n" % book_page)
        out.append(text)
    path = "curriculum/sources/SWE/ch%d.txt" % ch
    open(path, "w", encoding="utf-8").write("".join(out))
    print("wrote %s (pdf pp.%d-%d, chars=%d)" % (path, start, end - 1, sum(len(x) for x in out)))

print("OFFSET =", OFFSET)
