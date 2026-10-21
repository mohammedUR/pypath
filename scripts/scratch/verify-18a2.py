#!/usr/bin/env python3
"""Task 18-a2 pre-write verification: every literal that will be printed or asserted
in MLS ch5/ch6 lessons. Run under CPython 3."""

import math

def hdr(s):
    print("\n=== " + s + " ===")

# ---------- ch5 shared regression dataset ----------
XS = [1, 2, 3, 4, 5, 6, 7, 8]
YS = [1.0, 1.0, 2.0, 2.0, 6.0, 6.0, 7.0, 7.0]

def thresholds_for(xs):
    sx = sorted(set(xs))
    return [(a + b) / 2 for a, b in zip(sx, sx[1:])]

def sse(ys):
    if not ys:
        return 0.0
    m = sum(ys) / len(ys)
    return sum((y - m) ** 2 for y in ys)

def best_split(xs, ys):
    best_t, best_sse = None, None
    for t in thresholds_for(xs):
        left = [y for x, y in zip(xs, ys) if x <= t]
        right = [y for x, y in zip(xs, ys) if x > t]
        total = sse(left) + sse(right)
        if best_sse is None or total < best_sse:
            best_t, best_sse = t, total
    return best_t, best_sse

hdr("ch5.l1 SSE scan on XS/YS")
print("parent mean:", sum(YS) / len(YS))
print("parent SSE:", sse(YS))
for t in thresholds_for(XS):
    left = [y for x, y in zip(XS, YS) if x <= t]
    right = [y for x, y in zip(XS, YS) if x > t]
    print(f"t={t}: leftSSE={sse(left)} rightSSE={sse(right)} total={sse(left)+sse(right)}")
print("best:", best_split(XS, YS))
stump_pred = [1.5 if x <= 4.5 else 6.5 for x in XS]
print("stump preds:", stump_pred)
print("stump train MSE:", sum((p - y) ** 2 for p, y in zip(stump_pred, YS)) / len(YS))

hdr("ch5.l2 Gini scan (x=[1..6], y=[0,0,1,1,0,1])")
CX = [1, 2, 3, 4, 5, 6]
CY = [0, 0, 1, 1, 0, 1]

def gini(labels):
    n = len(labels)
    if n == 0:
        return 0.0
    p1 = labels.count(1) / n
    p0 = labels.count(0) / n
    return 1.0 - p0 ** 2 - p1 ** 2

print("parent gini:", gini(CY))
for t in thresholds_for(CX):
    left = [y for x, y in zip(CX, CY) if x <= t]
    right = [y for x, y in zip(CX, CY) if x > t]
    wg = (len(left) * gini(left) + len(right) * gini(right)) / len(CY)
    print(f"t={t}: gL={gini(left)} gR={gini(right)} weighted={wg}")
best_t, best_g = None, None
for t in thresholds_for(CX):
    left = [y for x, y in zip(CX, CY) if x <= t]
    right = [y for x, y in zip(CX, CY) if x > t]
    wg = (len(left) * gini(left) + len(right) * gini(right)) / len(CY)
    if best_g is None or wg < best_g:
        best_t, best_g = t, wg
print("best:", best_t, best_g)
cpred = [0 if x <= 2.5 else 1 for x in CX]
print("stump preds:", cpred)
print("errors:", [x for x, p, y in zip(CX, cpred, CY) if p != y], "acc:", sum(p == y for p, y in zip(cpred, CY)) / 6)

hdr("ch5.l3 depth-2 build")
def build(xs, ys, depth):
    if depth == 0 or len(set(ys)) == 1:
        return {"leaf": sum(ys) / len(ys)}
    t, _ = best_split(xs, ys)
    li = [i for i, x in enumerate(xs) if x <= t]
    ri = [i for i, x in enumerate(xs) if x > t]
    return {"t": t,
            "left": build([xs[i] for i in li], [ys[i] for i in li], depth - 1),
            "right": build([xs[i] for i in ri], [ys[i] for i in ri], depth - 1)}

def tree_predict(node, x):
    while "leaf" not in node:
        node = node["left"] if x <= node["t"] else node["right"]
    return node["leaf"]

for d in (1, 2):
    tr = build(XS, YS, d)
    preds = [tree_predict(tr, x) for x in XS]
    mse = sum((p - y) ** 2 for p, y in zip(preds, YS)) / len(YS)
    print(f"depth={d} root_t={tr.get('t')} left_t={tr['left'].get('t')} right_t={tr['right'].get('t')} preds={preds} mse={mse}")
tr2 = build(XS, YS, 2)
print("d2 leaves:", tree_predict(tr2, 1.0), tree_predict(tr2, 3.0), tree_predict(tr2, 6.0), tree_predict(tr2, 8.0))
print("left child best:", best_split([1, 2, 3, 4], [1.0, 1.0, 2.0, 2.0]))
print("right child best:", best_split([5, 6, 7, 8], [6.0, 6.0, 7.0, 7.0]))

hdr("ch5.l4 baseline vs d1 vs d2 (train + test)")
XTE = [1.5, 3.5, 6.5, 7.5]
YTE = [1.2, 1.8, 6.3, 6.8]
def mse(true, pred):
    return sum((a - b) ** 2 for a, b in zip(true, pred)) / len(true)
base_train = [sum(YS) / len(YS)] * 8
tr1, tr2 = build(XS, YS, 1), build(XS, YS, 2)
p1, p2 = [tree_predict(tr1, x) for x in XS], [tree_predict(tr2, x) for x in XS]
print("train baseline MSE:", mse(YS, base_train))
print("train d1 MSE:", mse(YS, p1))
print("train d2 MSE:", mse(YS, p2))
bt = [sum(YS) / len(YS)] * 4
print("test baseline MSE:", mse(YTE, bt))
print("test d1 preds:", [tree_predict(tr1, x) for x in XTE], "MSE:", mse(YTE, [tree_predict(tr1, x) for x in XTE]))
print("test d2 preds:", [tree_predict(tr2, x) for x in XTE], "MSE:", mse(YTE, [tree_predict(tr2, x) for x in XTE]))

hdr("ch6.l1 bagging: three fixed bootstrap stumps")
BOOTS = {"T1": [0, 0, 1, 2, 4, 5, 6, 7], "T2": [1, 2, 2, 3, 4, 5, 5, 7], "T3": [0, 1, 3, 3, 4, 6, 7, 7]}
stumps = {}
for name, idx in BOOTS.items():
    bx = [XS[i] for i in idx]
    by = [YS[i] for i in idx]
    t, s = best_split(bx, by)
    lm = sum(y for x, y in zip(bx, by) if x <= t) / sum(1 for x in bx if x <= t)
    rm = sum(y for x, y in zip(bx, by) if x > t) / sum(1 for x in bx if x > t)
    stumps[name] = (t, lm, rm)
    fp = [lm if x <= t else rm for x in XS]
    print(f"{name}: idx={idx} bx={bx} by={[YS[i] for i in idx]} t={t} sse={s} leaves=({lm}, {rm}) trainMSE={mse(YS, fp)}")
avg_ind = sum(mse(YS, [lm if x <= t else rm for x in XS]) for t, lm, rm in stumps.values()) / 3
print("average individual tree MSE:", avg_ind)
bagged = [sum(lm if x <= t else rm for t, lm, rm in stumps.values()) / 3 for x in XS]
print("bagged preds:", bagged)
print("bagged train MSE:", mse(YS, bagged))
print("bagged pred at x=4:", bagged[3], "at x=6:", bagged[5])

hdr("ch6.l2 forest with feature subsets")
R0 = [3, 1, 6, 2, 5, 4]
R1 = [1, 2, 3, 4, 5, 6]
RY = [1.0, 2.0, 3.0, 5.0, 6.0, 7.0]

def best_split_subset(rows0, rows1, ys, features):
    best = (None, None, None)
    for f in features:
        vals = rows0 if f == 0 else rows1
        for t in thresholds_for(vals):
            li = [i for i in range(len(ys)) if vals[i] <= t]
            ri = [i for i in range(len(ys)) if vals[i] > t]
            total = sse([ys[i] for i in li]) + sse([ys[i] for i in ri])
            if best[2] is None or total < best[2]:
                best = (f, t, total)
    return best

for feats in ([0], [1], [0, 1]):
    print("features", feats, "->", best_split_subset(R0, R1, RY, feats))
f0, t0, _ = best_split_subset(R0, R1, RY, [0])
f1, t1, _ = best_split_subset(R0, R1, RY, [1])
f2, t2, _ = best_split_subset(R0, R1, RY, [0, 1])
def split_mean(f, t, side):
    vals = R0 if f == 0 else R1
    sel = [RY[i] for i in range(6) if (vals[i] <= t if side == 'l' else vals[i] > t)]
    return sum(sel) / len(sel)
p_t1 = [split_mean(f0, t0, 'l') if R0[i] <= t0 else split_mean(f0, t0, 'r') for i in range(6)]
p_t2 = [split_mean(f1, t1, 'l') if R1[i] <= t1 else split_mean(f1, t1, 'r') for i in range(6)]
p_t3 = [split_mean(f2, t2, 'l') if R1[i] <= t2 else split_mean(f2, t2, 'r') for i in range(6)]
forest = [(a + b + c) / 3 for a, b, c in zip(p_t1, p_t2, p_t3)]
print("T1 preds:", p_t1, "MSE:", mse(RY, p_t1))
print("T2 preds:", p_t2, "MSE:", mse(RY, p_t2))
print("T3 preds:", p_t3, "MSE:", mse(RY, p_t3))
print("forest preds:", forest, "MSE:", mse(RY, forest))

hdr("ch6.l3 AdaBoost 3 rounds (x=[1..6], y in {-1,+1})")
BX = [1, 2, 3, 4, 5, 6]
BY = [-1, -1, 1, 1, -1, 1]

def stump_preds(t, orient):
    if orient == 'A':
        return [1 if x > t else -1 for x in BX]
    return [-1 if x > t else 1 for x in BX]

def werr(preds, y, w):
    return sum(wi for pi, yi, wi in zip(preds, y, w) if pi != yi)

def weighted_best_stump(w):
    best = None
    for t in thresholds_for(BX):
        for orient in ('A', 'B'):
            e = werr(stump_preds(t, orient), BY, w)
            if best is None or e < best[0]:
                best = (e, t, orient)
    return best

w = [1 / 6] * 6
alphas, hs = [], []
for rnd in (1, 2, 3):
    e, t, orient = weighted_best_stump(w)
    a = 0.5 * math.log((1 - e) / e)
    h = stump_preds(t, orient)
    alphas.append(a)
    hs.append(h)
    w = [wi * math.exp(-a * yi * hi) for wi, yi, hi in zip(w, BY, h)]
    s = sum(w)
    w = [wi / s for wi in w]
    print(f"round {rnd}: e={e} ({e:.6f}) t={t} orient={orient} alpha={a:.10f}")
    print("  weights:", [round(wi, 6) for wi in w], "sum:", sum(w))
F = [sum(a * h[i] for a, h in zip(alphas, hs)) for i in range(6)]
print("alphas:", [round(a, 10) for a in alphas])
print("F:", [round(v, 6) for v in F])
print("sign preds:", [1 if v > 0 else -1 for v in F])
print("train error:", sum(1 for p, y in zip([1 if v > 0 else -1 for v in F], BY) if p != y) / 6)

hdr("ch6.l5 comparison on BY as 0/1")
Y01 = [0 if v < 0 else 1 for v in BY]
def err_preds(t, orient):
    if orient == 'A':
        return [1 if x > t else 0 for x in BX]
    return [0 if x > t else 1 for x in BX]

best = None
for t in thresholds_for(BX):
    for orient in ('A', 'B'):
        e = sum(1 for p, y in zip(err_preds(t, orient), Y01) if p != y) / 6
        if best is None or e < best[0]:
            best = (e, t, orient)
print("single stump:", best)
e1, t1s, o1 = best
single = err_preds(t1s, o1)
print("single preds:", single, "MSE:", mse(Y01, single))
BOOTC = [[0, 1, 2, 3, 4, 4], [0, 2, 3, 4, 5, 5], [1, 2, 3, 4, 5, 5]]
boot_stumps = []
votes = [[] for _ in range(6)]
for bi, idx in enumerate(BOOTC):
    bx = [BX[i] for i in idx]
    by01 = [Y01[i] for i in idx]
    bb = None
    for t in thresholds_for(bx):
        for orient in ('A', 'B'):
            base = [1 if x > t else 0 for x in bx] if orient == 'A' else [0 if x > t else 1 for x in bx]
            e = sum(1 for p, y in zip(base, by01) if p != y) / len(by01)
            if bb is None or e < bb[0]:
                bb = (e, t, orient)
    boot_stumps.append(bb)
    pred = err_preds(bb[1], bb[2])
    for i in range(6):
        votes[i].append(pred[i])
    print(f"boot{bi+1}: idx={idx} best={bb} preds_on_original={pred} errs_on_original={sum(1 for p, y in zip(pred, Y01) if p != y)}")
print("votes:", votes)
baggedv = [1 if sum(v) * 2 > len(v) else 0 for v in votes]
print("bagged vote preds:", baggedv, "MSE:", mse(Y01, baggedv))
boosted01 = [1 if v > 0 else 0 for v in F]
print("boosted preds:", boosted01, "MSE:", mse(Y01, boosted01))
print("F margins:", [round(v, 6) for v in F])
