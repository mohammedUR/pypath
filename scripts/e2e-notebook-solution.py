notes = ['note one\n', 'files in memory\n', 'note three\n', 'files again\n']
out = open('notebook.txt', 'w')
for note in notes:
    out.write(note)
out.close()
fhand = None
try:
    fhand = open('notebook.txt')
except:
    print('File cannot be opened: notebook.txt')
if fhand is not None:
    lines = 0
    chars = 0
    hits = 0
    for line in fhand:
        lines = lines + 1
        chars = chars + len(line)
        if 'files' in line:
            hits = hits + 1
    fhand.close()
    print('lines: %d' % lines)
    print('chars: %d' % chars)
    print('keyword hits: %d' % hits)
