#!/usr/bin/env python3
"""R-SRC-01/R-LIC-01: dump front-matter pages (TOC + license) of the 3 books
without embedded outlines; bidi-normalize Arabic text; save to files for review."""
import fitz
try:
    from bidi.algorithm import get_display
except ImportError:
    from bidi import get_display

BOOKS = {
    "PY4E": ("/home/z/my-project/upload/book_ar_2023_01_01.pdf", range(0, 8)),
    "SWE":  ("/home/z/my-project/upload/swebook-python.pdf", range(0, 12)),
    "MLS":  ("/home/z/my-project/upload/book.pdf", range(0, 10)),
}

def norm(text, is_ar):
    if not is_ar:
        return text
    # visual-order Arabic from PDF -> logical order, line by line
    lines = text.splitlines()
    return "\n".join(get_display(l) for l in lines)

for code, (path, pages) in BOOKS.items():
    doc = fitz.open(path)
    out = []
    for p in pages:
        if p >= doc.page_count:
            break
        text = doc[p].get_text("text")
        is_ar = code == "PY4E"
        out.append(f"\n########## PAGE {p+1} (1-based) ##########\n{norm(text, is_ar)}")
    with open(f"/home/z/my-project/curriculum/sources/{code}.frontmatter.txt", "w", encoding="utf-8") as f:
        f.write("".join(out))
    print(f"{code}: dumped {doc.page_count} total pages, wrote front matter ({len(pages)} pages)")
    doc.close()
