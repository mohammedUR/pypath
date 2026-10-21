"""Verify all numeric literals for mls.ch5.l4 + mls.ch6.l1-l5 before authoring."""
import math
math_log, math_exp = math.log, math.exp
# ---------- ch5.l4: depth-2 vs depth-1 vs baseline on the ch5 dataset ----------
xs = [1, 2, 3, 4, 5, 6, 7, 8]
ys = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]

def mse(res):
    return sum(r * r for r in res) / len(res)

def sse(v):
    m = sum(v) / len(v)
    return sum((a - m) ** 2 for a in v)

def predict_d2(x):
    if x <= 4.5:
        return 1.0 if x <= 2.5 else 2.0
    return 6.0 if x <= 6.5 else 7.0

def predict_d1(x):
    return 1.5 if x <= 4.5 else 6.5

baseline = sum(ys) / len(ys)
r_d2 = [y - predict_d2(x) for x, y in zip(xs, ys)]
r_d1 = [y - predict_d1(x) for x, y in zip(xs, ys)]
r_base = [y - baseline for y in ys]
print('ch5.l4: d2=%.4f d1=%.4f base=%.4f means=%.2f %.2f %.2f %.2f base=%.1f'
      % (mse(r_d2), mse(r_d1), mse(r_base),
         sum(ys[:2])/2, sum(ys[2:4])/2, sum(ys[4:6])/2, sum(ys[6:8])/2, baseline))
assert mse(r_d2) == 0.0 and abs(mse(r_d1) - 0.25) < 1e-12 and abs(mse(r_base) - 6.5) < 1e-12

# ---------- ch6.l1: bagging with 3 fixed bootstrap samples, depth-1 stumps ----------
def stump(xs_, ys_):
    best = None
    sx = sorted(set(xs_))
    for t in [(a + b) / 2 for a, b in zip(sx, sx[1:])]:
        left = [y for x, y in zip(xs_, ys_) if x <= t]
        right = [y for x, y in zip(xs_, ys_) if x > t]
        tot = sse(left) + sse(right)
        if best is None or tot < best[1]:
            best = (t, tot, sum(left) / len(left), sum(right) / len(right))
    return best  # (threshold, sse, left_mean, right_mean)

BOOTS = [
    [0, 1, 1, 3, 4, 5, 6, 7],
    [0, 2, 3, 3, 5, 6, 6, 7],
    [1, 2, 2, 3, 4, 4, 5, 7],
]
stumps = []
for idx in BOOTS:
    bx = [xs[i] for i in idx]
    by = [ys[i] for i in idx]
    stumps.append(stump(bx, by))
for s in stumps:
    print('stump: t=%.1f sse=%.4f L=%.2f R=%.2f' % s)

def bagged(x):
    return sum((s[2] if x <= s[0] else s[3]) for s in stumps) / len(stumps)

for x in (3, 6):
    print('bagged(%d) = %.4f' % (x, bagged(x)))

# ---------- ch6.l2: random forest, fixed feature subsets on 2-D data ----------
X2 = [[1, 8], [2, 7], [3, 9], [4, 8], [5, 2], [6, 1], [7, 3], [8, 2]]
Y2 = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]
# low-x/high-y group ~ ys 1,2 ; high-x/low-y group ~ 6,7

def forest_stump(X, Y, feats):
    best = None
    for f in feats:
        col = sorted(set(row[f] for row in X))
        for t in [(a + b) / 2 for a, b in zip(col, col[1:])]:
            left = [y for row, y in zip(X, Y) if row[f] <= t]
            right = [y for row, y in zip(X, Y) if row[f] > t]
            if not left or not right:
                continue
            tot = sse(left) + sse(right)
            if best is None or tot < best[2]:
                best = (f, t, tot, sum(left) / len(left), sum(right) / len(right))
    return best

SUBSETS = [(0,), (1,), (0, 1)]
trees = [forest_stump(X2, Y2, f) for f in SUBSETS]
for t in trees:
    print('forest tree: feat=%d t=%.1f sse=%.4f L=%.2f R=%.2f' % t)

def rf_predict(row):
    return sum((t[3] if row[t[0]] <= t[1] else t[4]) for t in trees) / len(trees)

for row in ([2, 9], [7, 1]):
    print('rf(%r) = %.4f' % (row, rf_predict(row)))

# ---------- ch6.l3: AdaBoost, 2 rounds, deterministic stump scan ----------
BX = [1, 2, 3, 4, 5, 6, 7, 8]
BY = [-1, -1, 1, -1, 1, 1, 1, -1]
w = [1.0 / 8] * 8
alphas, stumps_b = [], []

for rnd in range(2):
    best = None  # (weighted_err, t, pol)  pol=+1 means +1 on the right
    cands = sorted(set(BX))
    for t in [(a + b) / 2 for a, b in zip(cands, cands[1:])]:
        for pol in (1, -1):
            preds = [pol if x > t else -pol for x in BX]
            err = sum(wi for wi, p, y in zip(w, preds, BY) if p != y)
            if best is None or err < best[0] - 1e-15:
                best = (err, t, pol)
    err, t, pol = best
    alpha = 0.5 * math_log((1 - err) / err)
    preds = [pol if x > t else -pol for x in BX]
    w = [wi * (math_exp(-alpha) if p == y else math_exp(alpha))
         for wi, p, y in zip(w, preds, BY)]
    z = sum(w)
    w = [wi / z for wi in w]
    alphas.append(alpha)
    stumps_b.append((t, pol))
    print('round %d: t=%.1f pol=%+d err=%.4f alpha=%.4f w=%s' %
          (rnd, t, pol, err, alpha, ['%.4f' % wi for wi in w]))

def ada_predict(x):
    s = sum(a * (p if x > t else -p) for a, (t, p) in zip(alphas, stumps_b))
    return 1 if s > 0 else -1

for x in (1, 3, 4, 5, 8):
    print('ada(%d)=%+d' % (x, ada_predict(x)))
print('weighted acc round0: %.4f' % (1 - sum(1/8 for y, p in zip(BY, [1 if x > 4.5 else -1 for x in BX]) if p != y)))

# ---------- ch6.l5: comparison single vs bagged vs boosted MSE / accuracy ----------
r_single = [y - (1.5 if x <= 4.5 else 6.5) for x, y in zip(xs, ys)]
print('ch6.l5: single MSE=%.4f' % mse(r_single))
r_bag = [y - bagged(x) for x, y in zip(xs, ys)]
print('bagged MSE=%.4f' % mse(r_bag))

import math
math_log, math_exp = math.log, math.exp
