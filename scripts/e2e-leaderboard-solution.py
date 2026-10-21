import string
text = 'Romeo loves Juliet. Juliet loves the moon, and the night loves Romeo. And the stars watch the night.'
out = open('wordboard.txt', 'w')
out.write(text)
out.close()

fhand = open('wordboard.txt')
counts = dict()
for line in fhand:
    line = line.translate(str.maketrans(' ', ' ', string.punctuation))
    line = line.lower()
    words = line.split()
    for word in words:
        counts[word] = counts.get(word, 0) + 1
fhand.close()

lst = list()
for word, count in counts.items():
    lst.append((count, word))
lst.sort(reverse=True)

rank = 1
for count, word in lst[:3]:
    print('%d. %s: %d' % (rank, word, count))
    rank = rank + 1