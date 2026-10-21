"""Extract PY4E Arabic book text for chapters as authoring inputs.

Usage: python3 scripts/extract_ch4_ch6.py [chapter ...]   (default: 4 5 6)
Replicates the M0 extraction convention: page markers '===== صفحة الكتاب N ====='.
Pages are 1-indexed PDF pages; book pages = pdf page - 10 (page_offset from toc.json).
"""
import json
import sys

import fitz

toc = json.load(open("curriculum/sources/PY4E.toc.json"))
OFFSET = toc["page_offset"]
doc = fitz.open("upload/book_ar_2023_01_01.pdf")

chapters = [int(a) for a in sys.argv[1:]] or [4, 5, 6]
for ch in chapters:
    node = toc["chapters"][ch - 1]
    start = node["pdfPage"]
    end = toc["chapters"][ch]["pdfPage"] if ch < len(toc["chapters"]) else doc.page_count + 1
    out = []
    for pdf_page in range(start, end):
        book_page = pdf_page - OFFSET
        text = doc[pdf_page - 1].get_text("text")  # 1-indexed page -> 0-indexed
        out.append("\n===== صفحة الكتاب %d =====\n" % book_page)
        out.append(text)
    path = "curriculum/sources/PY4E/ch%d.txt" % ch
    open(path, "w", encoding="utf-8").write("".join(out))
    print("wrote %s (pdf pp.%d-%d, chars=%d)" % (path, start, end - 1, sum(len(x) for x in out)))

print("OFFSET =", OFFSET)
