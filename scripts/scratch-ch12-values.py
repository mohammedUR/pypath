#!/usr/bin/env python3
"""Scratch: CPython-verify every value embedded in swe.ch12 lessons before authoring."""
import io
import contextlib
import math
import statistics


def run(code):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(code, '<scratch>', 'exec'), {})
    return buf.getvalue()


cases = {}

# l1 predict
cases['l1.predict'] = run("""
defects = [1, 2, 3, 4, 20]
print('mean: %.1f' % (sum(defects) / len(defects)))
print('median: %.1f' % sorted(defects)[2])
""")

# l1 worked
cases['l1.worked'] = run("""
releases = {'r1': 2, 'r2': 4, 'r3': 5, 'r4': 5, 'r5': 7, 'r6': 8,
            'r7': 9, 'r8': 10, 'r9': 12, 'r10': 14, 'r11': 23}
total = sum(releases.values())
mean = total / len(releases)
worst = 'r1'
for k in releases:
    if releases[k] > releases[worst]:
        worst = k
print('total: %d' % total)
print('mean: %.1f' % mean)
print('worst: %s (%d)' % (worst, releases[worst]))
print('worst is %.1f x the mean' % (releases[worst] / mean))
""")

# l1 ex1 trace
cases['l1.ex1'] = run("""
releases = {'r1': 4, 'r2': 8, 'r3': 12}
total = sum(releases.values())
print('releases: %d' % len(releases))
print('total: %d' % total)
print('mean: %.1f' % (total / len(releases)))
""")

# l1 ex2 write_code solution
cases['l1.ex2'] = run("""
releases = {'r1': 5, 'r2': 10, 'r3': 25}
total = sum(releases.values())
mean = total / len(releases)
mx = ''
for k in releases:
    if mx == '' or releases[k] > releases[mx]:
        mx = k
print('total: %d' % total)
print('mean: %.1f' % mean)
print('max: %s (%d)' % (mx, releases[mx]))
print('r3 share: %.1f%%' % (100.0 * releases['r3'] / total))
""")
print('l1.ex2 mean raw:', 40 / 3)

# l1 debug broken / fixed
cases['l1.debug.broken'] = run("""
defects = {'r1': 2, 'r2': 4, 'r3': 5}
mean = sum(defects.values()) // len(defects)
print('mean defects: %s' % mean)
""")
cases['l1.debug.fixed'] = run("""
defects = {'r1': 2, 'r2': 4, 'r3': 5}
mean = sum(defects.values()) / len(defects)
print('mean defects: %.2f' % mean)
""")

# l2 predict
cases['l2.predict'] = run("""
count = 42
scale = 3
print('Medium | %s %d' % ('#' * (count // scale), count))
""")

# l2 worked
cases['l2.worked'] = run("""
def draw_bars(pairs, scale):
    for name, value in pairs:
        ticks = value // scale
        print('%-8s | %s %d' % (name, '#' * ticks, value))

draw_bars([('Critical', 5), ('High', 18), ('Medium', 42), ('Low', 15)], 3)
""")

# l2 ex1 trace
cases['l2.ex1'] = run("""
def bar(n):
    return '#' * n

for name, n in [('ui', 2), ('logic', 5)]:
    print('%s %s' % (name, bar(n)))
""")

# l2 ex2 histogram solution
cases['l2.ex2'] = run("""
cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]
bins = [(0, 5), (5, 10), (10, 15), (15, 20), (20, 25)]
counts = []
for lo, hi in bins:
    count = 0
    for v in cfds:
        if lo <= v < hi:
            count += 1
    counts.append(count)
    print('[%2d,%2d) | %s %d' % (lo, hi, '#' * count, count))
print('counts: %s' % counts)
""")

# l2 debug broken / fixed
cases['l2.debug.broken'] = run("""
pairs = [('Critical', 5), ('High', 18), ('Medium', 42), ('Low', 15)]
width = 10
lowest = 5
biggest = 42
for name, value in pairs:
    ticks = int(width * (value - lowest) / (biggest - lowest))
    print('%-8s | %s %d' % (name, '#' * ticks, value))
""")
cases['l2.debug.fixed'] = run("""
pairs = [('Critical', 5), ('High', 18), ('Medium', 42), ('Low', 15)]
width = 10
biggest = 42
for name, value in pairs:
    ticks = int(width * value / biggest)
    print('%-8s | %s %d' % (name, '#' * ticks, value))
""")

# l2 sandbox sparkline
cases['l2.spark'] = run("""
def spark(xs):
    line = ''
    for v in xs:
        if v > 9:
            line = line + '#'
        else:
            line = line + '.'
    return line

print(spark([2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]))
""")

# l3 predict
cases['l3.predict'] = run("""
before = 720
after = 80
print('caught: %d of %d' % (before, before + after))
""")

# l3 worked
cases['l3.worked'] = run("""
d_before = 720
d_after = 80
dre = 100.0 * d_before / (d_before + d_after)
print('D_before: %d' % d_before)
print('D_after: %d' % d_after)
print('DRE: %.1f%%' % dre)
print('escape rate: %.1f%%' % (100.0 - dre))
""")

# l3 ex1 trace
cases['l3.ex1'] = run("""
counts = {'S1': 5, 'S2': 18, 'S3': 42, 'S4': 15}
best = ''
best_n = 0
for k in counts:
    if counts[k] > best_n:
        best = k
        best_n = counts[k]
print('mode: %s' % best)
print('total: %d' % sum(counts.values()))
""")

# l3 ex2 write_code solution
cases['l3.ex2'] = run("""
releases = {'r1': {'before': 720, 'prod': 80}, 'r2': {'before': 465, 'prod': 35}}
sum_before = 0
sum_prod = 0
for k in releases:
    d = releases[k]
    dre = 100.0 * d['before'] / (d['before'] + d['prod'])
    print('%s DRE: %.1f%%' % (k, dre))
    sum_before += d['before']
    sum_prod += d['prod']
escape = 100.0 * sum_prod / (sum_before + sum_prod)
print('pooled escape: %.1f%%' % escape)
""")
print('l3.ex2 pooled escape raw:', 100.0 * 115 / 1300)

# l3 debug broken / fixed
cases['l3.debug.broken'] = run("""
d_before = 720
d_after = 80
dre = 100.0 * d_before / d_after
print('DRE: %.1f%%' % dre)
""")
cases['l3.debug.fixed'] = run("""
d_before = 720
d_after = 80
dre = 100.0 * d_before / (d_before + d_after)
print('DRE: %.1f%%' % dre)
""")

# l4 predict
cases['l4.predict'] = run("""
xs = [2, 4, 5, 5, 23]
print('mean: %.1f' % (sum(xs) / len(xs)))
print('median: %.1f' % xs[2])
""")

# l4 worked
cases['l4.worked'] = run("""
import statistics
cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]
print('mean: %.1f' % statistics.mean(cfds))
print('median: %s' % statistics.median(cfds))
s = statistics.stdev(cfds)
sigma = statistics.pstdev(cfds)
print('stdev: %.2f (sample, n-1)' % s)
print('pstdev: %.2f (population, n)' % sigma)
""")
print('l4 raw: stdev=%.6f pstdev=%.6f var=%.2f' % (
    statistics.stdev([2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]),
    statistics.pstdev([2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]),
    statistics.variance([2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23])))

# l4 ex1 trace
cases['l4.ex1'] = run("""
import statistics
xs = [2, 4, 5, 5, 7]
print(statistics.mean(xs))
print(statistics.median(xs))
""")

# l4 ex2 five-number solution
cases['l4.ex2'] = run("""
def median_of(xs):
    s = sorted(xs)
    n = len(s)
    mid = n // 2
    if n % 2 == 1:
        return s[mid]
    return (s[mid - 1] + s[mid]) / 2

cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]
n = len(cfds)
lo = median_of(cfds[:n // 2])
med = median_of(cfds)
hi = median_of(cfds[n // 2 + 1:])
iqr = hi - lo
lower_fence = lo - 1.5 * iqr
upper_fence = hi + 1.5 * iqr
outliers = []
for v in cfds:
    if v < lower_fence or v > upper_fence:
        outliers.append(v)
print('min: %d' % cfds[0])
print('Q1: %s' % lo)
print('median: %s' % med)
print('Q3: %s' % hi)
print('max: %d' % cfds[-1])
print('IQR: %s' % iqr)
print('fence: %s %s' % (lower_fence, upper_fence))
print('outliers: %s' % outliers)
""")

# l4 debug broken / fixed
cases['l4.debug.broken'] = run("""
def median_of(xs):
    s = sorted(xs)
    n = len(s)
    mid = n // 2
    if n % 2 == 1:
        return s[mid]
    return (s[mid - 1] + s[mid]) / 2

cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]
n = len(cfds)
lo = median_of(cfds[:n // 2 + 1])
hi = median_of(cfds[n // 2:])
iqr = hi - lo
fence = hi + 1.5 * iqr
print('Q1: %s' % lo)
print('Q3: %s' % hi)
print('IQR: %s' % iqr)
print('fence: %s' % fence)
""")

# l5 predict
cases['l5.predict'] = run("""
n = 4
se = 12 / (n ** 0.5)
print('se: %.2f' % se)
print('margin: %.2f' % (2 * se))
""")

# l5 worked
cases['l5.worked'] = run("""
import math
mean = 45.0
sigma = 12.0
n = 36
se = sigma / math.sqrt(n)
margin = 1.96 * se
print('se: %.1f' % se)
print('margin: %.2f' % margin)
print('CI: (%.2f, %.2f)' % (mean - margin, mean + margin))

cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]
n2 = len(cfds)
mean2 = sum(cfds) / n2
s = statistics_stdev = 5.848  # placeholder replaced below
""")
# real l5 worked t-part (statistics import)
cases['l5.worked.t'] = run("""
import math
import statistics
cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]
n = len(cfds)
mean = sum(cfds) / n
s = statistics.stdev(cfds)
se = s / math.sqrt(n)
t10 = 2.228
margin = t10 * se
print('s: %.2f' % s)
print('se: %.2f' % se)
print('margin: %.2f' % margin)
print('CI: (%.2f, %.2f)' % (mean - margin, mean + margin))
""")

# l5 ex1 trace
cases['l5.ex1'] = run("""
import math
se = 12 / math.sqrt(36)
print('se: %.1f' % se)
print('margin: %.2f' % (1.96 * se))
""")

# l5 ex2 OLS solution
cases['l5.ex2'] = run("""
xs = [2, 4, 6, 8, 10]
ys = [5, 9, 10, 13, 18]
n = len(xs)
mx = sum(xs) / n
my = sum(ys) / n
sxy = 0
sxx = 0
for i in range(n):
    sxy += (xs[i] - mx) * (ys[i] - my)
    sxx += (xs[i] - mx) ** 2
b1 = sxy / sxx
b0 = my - b1 * mx
sse = 0
sst = 0
for i in range(n):
    e = ys[i] - (b0 + b1 * xs[i])
    sse += e ** 2
    sst += (ys[i] - my) ** 2
r2 = 1 - sse / sst
print('Sxy: %d Sxx: %d' % (sxy, sxx))
print('slope: %s' % b1)
print('intercept: %s' % b0)
print('R2: %.2f' % r2)
""")
print('l5.ex2 raw r2:', 1 - 4 / 94, 'r:', 60 / math.sqrt(40 * 94))

# l5 debug broken / fixed
cases['l5.debug.broken'] = run("""
import math
import statistics
cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]
n = len(cfds)
mean = sum(cfds) / n
s = statistics.stdev(cfds)
se = s / math.sqrt(n)
margin = 1.96 * se
print('margin: %.2f' % margin)
print('CI: (%.2f, %.2f)' % (mean - margin, mean + margin))
""")
cases['l5.debug.fixed'] = run("""
import math
import statistics
cfds = [2, 4, 5, 5, 7, 8, 9, 10, 12, 14, 23]
n = len(cfds)
mean = sum(cfds) / n
s = statistics.stdev(cfds)
se = s / math.sqrt(n)
margin = 2.228 * se
print('margin: %.2f' % margin)
print('CI: (%.2f, %.2f)' % (mean - margin, mean + margin))
""")

# l6 predict
cases['l6.predict'] = run("""
defects = [2, 3, 2, 4]
total = 0
for d in defects:
    total = total + d
print('mean: %.2f' % (total / len(defects)))
""")

# l6 worked
cases['l6.worked'] = run("""
defects = {'r1': 2, 'r2': 3, 'r3': 2, 'r4': 4}
total = 0
for k in defects:
    total = total + defects[k]
mean = total / len(defects)
above = []
for k in defects:
    if defects[k] > mean:
        above.append(k)
print('mean: %.2f' % mean)
print('above: %s' % ' '.join(above))
""")

# l6 ex1 trace
cases['l6.ex1'] = run("""
import statistics
xs = [1, 2, 3, 4, 20]
print(statistics.median(xs))
print(statistics.mean(xs))
""")

# l6 project solution
cases['l6.ex2'] = run("""
import statistics

defects = {'r1': 2, 'r2': 3, 'r3': 2, 'r4': 4,
           'r5': 3, 'r6': 5, 'r7': 6, 'r8': 1}
escaped = {'r1': 0, 'r2': 1, 'r3': 0, 'r4': 1,
           'r5': 0, 'r6': 2, 'r7': 3, 'r8': 0}

for k in defects:
    print('%s | %s %d' % (k, '#' * defects[k], defects[k]))

vals = []
for k in defects:
    vals.append(defects[k])
mean = sum(vals) / len(vals)
sd = statistics.stdev(vals)
sum_prod = 0
for k in escaped:
    sum_prod += escaped[k]
sum_all = 0
for k in defects:
    sum_all += defects[k] + escaped[k]
escape = 100.0 * sum_prod / sum_all
print('stdev: %.2f' % sd)
print('escape rate: %.1f%%' % escape)

above = []
for k in defects:
    if defects[k] > mean:
        above.append(k)
print('above mean: %s' % ' '.join(above))

worst = 'r1'
for k in defects:
    if defects[k] > defects[worst]:
        worst = k
print('releases: %d / mean defects: %.2f / worst: %s' % (len(defects), mean, worst))
""")
print('l6 raw: mean=%.4f stdev=%.6f escape=%.6f' % (
    26 / 8,
    statistics.stdev([2, 3, 2, 4, 3, 5, 6, 1]),
    100.0 * 7 / 33))

# l6 debug broken / fixed
cases['l6.debug.broken'] = run("""
releases = {'r1': {'found': 190, 'prod': 10}, 'r2': {'found': 90, 'prod': 10}}
rates = []
for k in releases:
    d = releases[k]
    rate = 100.0 * d['prod'] / d['found']
    rates.append(rate)
    print('%s escape: %.1f%%' % (k, rate))
pooled = (rates[0] + rates[1]) / 2
print('pooled escape: %.1f%%' % pooled)
""")
cases['l6.debug.fixed'] = run("""
releases = {'r1': {'found': 190, 'prod': 10}, 'r2': {'found': 90, 'prod': 10}}
rates = []
sum_prod = 0
sum_found = 0
for k in releases:
    d = releases[k]
    rate = 100.0 * d['prod'] / d['found']
    rates.append(rate)
    print('%s escape: %.1f%%' % (k, rate))
    sum_prod += d['prod']
    sum_found += d['found']
pooled = 100.0 * sum_prod / sum_found
print('pooled escape: %.1f%%' % pooled)
""")

for name in sorted(cases):
    print('==== %s ====' % name)
    print(cases[name], end='' if cases[name].endswith('\n') else '\n')
