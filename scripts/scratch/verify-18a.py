#!/usr/bin/env python3
"""Task 18-a verifier: pin every literal for MLS ch5/ch6 lessons (pure Python)."""
import math

ok = True
def chk(name, cond):
    global ok
    print(("PASS " if cond else "FAIL ") + name)
    if not cond:
        ok = False

def near(a, b, tol=1e-9):
    return abs(a - b) < tol

# ---------- shared regression data (ch5) ----------
XS = [1, 2, 3, 4, 5, 6]
YS = [1.0, 1.0, 2.0, 3.0, 5.0, 6.0]

def sse_split(xs, ys, t):
    L = [y for x, y in zip(xs, ys) if x <= t]
    R = [y for x, y in zip(xs, ys) if x > t]
    ml, mr = sum(L) / len(L), sum(R) / len(R)
    return sum((y - ml) ** 2 for y in L) + sum((y - mr) ** 2 for y in R), ml, mr

def best_split(xs, ys):
    ux = sorted(set(xs))
    best = None
    for i in range(len(ux) - 1):
        t = (ux[i] + ux[i + 1]) / 2
        s, _, _ = sse_split(xs, ys, t)
        if best is None or s < best[1]:
            best = (t, s)
    return best

scan = [(round((XS[i] + XS[i+1]) / 2, 2), round(sse_split(XS, YS, (XS[i]+XS[i+1])/2)[0], 4)) for i in range(5)]
print("scan:", scan)
chk("l1 scan thresholds", [t for t, _ in scan] == [1.5, 2.5, 3.5, 4.5, 5.5])
chk("l1 scan sses", [s for _, s in scan] == [17.2, 10.0, 5.3333, 3.25, 11.2])
chk("l1 best", near(best_split(XS, YS)[0], 4.5) and near(best_split(XS, YS)[1], 3.25))
chk("l1 sse t=2.5", near(sse_split(XS, YS, 2.5)[0], 10.0))
s, ml, mr = sse_split(XS, YS, 4.5)
chk("l1 leaves at 4.5", near(ml, 1.75) and near(mr, 5.5))
chk("l1 total sse t=3.5", near(sse_split(XS, YS, 3.5)[0], 16/3))
chk("l1 left sse t=3.5", near(sum((y - 4/3) ** 2 for y in [1.0, 1.0, 2.0]), 2/3))

# depth-1 stump preds + MSE
p1 = [1.75 if x <= 4.5 else 5.5 for x in XS]
mse1 = sum((y - p) ** 2 for y, p in zip(YS, p1)) / 6
chk("l1 depth1 preds", p1 == [1.75, 1.75, 1.75, 1.75, 5.5, 5.5])
chk("l1 depth1 mse", near(mse1, 3.25 / 6))
print("depth1 mse:", repr(mse1))

# depth-2 tree
tree2 = {'thresh': 4.5,
         'left': {'thresh': 2.5, 'left': {'leaf': 1.0}, 'right': {'leaf': 2.5}},
         'right': {'thresh': 5.5, 'left': {'leaf': 5.0}, 'right': {'leaf': 6.0}}}
def predict(tree, x):
    while 'leaf' not in tree:
        tree = tree['left'] if x <= tree['thresh'] else tree['right']
    return tree['leaf']
p2 = [predict(tree2, x) for x in XS]
mse2 = sum((y - p) ** 2 for y, p in zip(YS, p2)) / 6
chk("l3 depth2 preds", p2 == [1.0, 1.0, 2.5, 2.5, 5.0, 6.0])
chk("l3 depth2 mse", near(mse2, 1/12))
print("depth2 mse:", repr(mse2))
chk("l3 subtree left", near(best_split([1, 2, 3, 4], [1.0, 1.0, 2.0, 3.0])[0], 2.5)
    and near(best_split([1, 2, 3, 4], [1.0, 1.0, 2.0, 3.0])[1], 0.5))
chk("l3 two-point split", near(best_split([1, 2], [1.0, 2.0])[0], 1.5)
    and near(best_split([1, 2], [1.0, 2.0])[1], 0.0))
mean_all = sum(YS) / 6
chk("mean baseline", near(mean_all, 3.0))
mse0 = sum((y - mean_all) ** 2 for y in YS) / 6
chk("mean baseline mse", near(mse0, 22 / 6))
print("baseline mse:", repr(mse0))
chk("parent sse exact", sum((y - 3.0) ** 2 for y in YS) == 22.0)
chk("new-x depth1", [1.75 if x <= 4.5 else 5.5 for x in [0.5, 4.2, 7.0]] == [1.75, 1.75, 5.5])
chk("new-x depth2", [predict(tree2, x) for x in [0.5, 4.2, 7.0]] == [1.0, 2.5, 6.0])

# ---------- ch5.l2 classification ----------
CLS_X = [1, 2, 3, 4, 5, 6]
CLS_Y = [0, 0, 1, 1, 1, 0]

def gini(idx):
    n = len(idx)
    if n == 0:
        return 0.0
    p1 = sum(CLS_Y[j] for j in idx) / n
    return 1 - (p1 ** 2 + (1 - p1) ** 2)

chk("l2 parent gini", near(gini(range(6)), 0.5))
chk("l2 right child gini t=2.5", near(gini([2, 3, 4, 5]), 0.375))
def weighted_gini(t):
    L = [j for j in range(6) if CLS_X[j] <= t]
    R = [j for j in range(6) if CLS_X[j] > t]
    return (len(L) * gini(L) + len(R) * gini(R)) / 6
gs = [weighted_gini((CLS_X[i]+CLS_X[i+1])/2) for i in range(5)]
print("gini scan:", [round(g, 6) for g in gs])
chk("l2 gini scan", all(near(a, b) for a, b in zip(gs, [0.4, 0.25, 4/9, 0.5, 0.4])))
chk("l2 best", near(weighted_gini(2.5), 0.25))
def entropy_bits(idx):
    n = len(idx)
    p1 = sum(CLS_Y[j] for j in idx) / n
    if p1 in (0.0, 1.0):
        return 0.0
    return -(p1 * math.log2(p1) + (1 - p1) * math.log2(1 - p1))
chk("l2 parent entropy bits", near(entropy_bits(range(6)), 1.0))
chk("l2 right entropy bits", near(entropy_bits([2, 3, 4, 5]), 0.8112781244591328))
print("right entropy bits:", repr(entropy_bits([2, 3, 4, 5])))
pred = [0 if x <= 2.5 else 1 for x in CLS_X]
chk("l2 stump preds", pred == [0, 0, 1, 1, 1, 1])
wrong = [j for j in range(6) if pred[j] != CLS_Y[j]]
chk("l2 stump wrong", wrong == [5])
print("stump accuracy:", 5 / 6)

# ---------- ch6.l1 bagging ----------
SAMPLES = [
    [0, 0, 1, 2, 5, 5],
    [0, 0, 1, 4, 5, 5],
    [0, 2, 3, 3, 5, 5],
]
stumps = []
for idxs in SAMPLES:
    xs = [XS[j] for j in idxs]
    ys = [YS[j] for j in idxs]
    t, _ = best_split(xs, ys)
    L = [y for x, y in zip(xs, ys) if x <= t]
    R = [y for x, y in zip(xs, ys) if x > t]
    stumps.append((t, sum(L)/len(L), sum(R)/len(R)))
print("stumps:", [(t, round(ml, 4), round(mr, 4)) for t, ml, mr in stumps])
chk("6l1 stumps", [(round(t, 2), round(ml, 4), round(mr, 4)) for t, ml, mr in stumps]
    == [(4.5, 1.25, 6.0), (3.5, 1.0, 5.6667), (5.0, 2.25, 6.0)])
def bagged_predict(x):
    return sum(ml if x <= t else mr for t, ml, mr in stumps) / len(stumps)
bp = [round(bagged_predict(x), 4) for x in XS]
print("bagged preds:", bp)
chk("6l1 bagged preds", bp == [1.5, 1.5, 1.5, 3.0556, 4.6389, 5.8889])
mseb = sum((y - bagged_predict(x)) ** 2 for y, x in zip(YS, XS)) / 6
print("bagged mse:", repr(mseb))
chk("6l1 bagged mse", near(mseb, 0.1493055555555555))
chk("6l1 bagged@1", near(bagged_predict(1), 1.5))
chk("6l1 bagged@4", near(bagged_predict(4), 3.0555555555555556))
print("bagged preds raw:", [repr(bagged_predict(x)) for x in XS])
oob = [[j for j in range(6) if j not in s] for s in SAMPLES]
chk("6l1 oob", oob == [[3, 4], [2, 3], [1, 4]])
print("oob:", oob)

# ---------- ch6.l2 random forest (2 features, classification) ----------
FEATS = [[1, 2], [2, 1], [3, 2], [4, 1], [5, 2], [6, 1]]
LABELS = [0, 0, 1, 1, 1, 1]

def fgini(idx):
    n = len(idx)
    if n == 0:
        return 0.0
    p1 = sum(LABELS[j] for j in idx) / n
    return 1 - (p1 ** 2 + (1 - p1) ** 2)

def best_stump(feats):
    best = None
    for f in feats:
        vals = sorted(set(FEATS[j][f] for j in range(6)))
        for i in range(len(vals) - 1):
            t = (vals[i] + vals[i + 1]) / 2
            L = [j for j in range(6) if FEATS[j][f] <= t]
            R = [j for j in range(6) if FEATS[j][f] > t]
            g = (len(L) * fgini(L) + len(R) * fgini(R)) / 6
            if best is None or g < best[0]:
                best = (g, f, t)
    return best

def majority(idx):
    z = sum(LABELS[j] == 0 for j in idx)
    o = sum(LABELS[j] == 1 for j in idx)
    return 0 if z >= o else 1

forest = []
for feats in ([0], [1], [0, 1]):
    g, f, t = best_stump(feats)
    L = [j for j in range(6) if FEATS[j][f] <= t]
    R = [j for j in range(6) if FEATS[j][f] > t]
    forest.append((f, t, majority(L), majority(R)))
print("forest:", forest)
chk("6l2 forest", forest == [(0, 2.5, 0, 1), (1, 1.5, 1, 1), (0, 2.5, 0, 1)])
def vote(p):
    votes = [ml if p[f] <= t else mr for f, t, ml, mr in forest]
    z = votes.count(0)
    return 0 if z >= len(votes) - z else 1
for p, want in ([([2, 2], 0), ([5, 1], 1), ([1, 1], 0), ([6, 2], 1)]):
    votes = [ml if p[f] <= t else mr for f, t, ml, mr in forest]
    print("point", p, "votes", votes, "->", vote(p))
    chk(f"6l2 vote {p}", vote(p) == want)

# ---------- ch6.l3 boosting ----------
B_X = [1, 2, 3, 4, 5, 6]
B_Y = [0, 0, 1, 1, 1, 0]

def wvote(idx, w):
    s0 = sum(w[j] for j in idx if B_Y[j] == 0)
    s1 = sum(w[j] for j in idx if B_Y[j] == 1)
    return 0 if s0 >= s1 else 1

w = [1/6] * 6
alphas, stumps_b = [], []
rounds = []
for r in range(3):
    best = None
    for i in range(5):
        t = (B_X[i] + B_X[i+1]) / 2
        L = [j for j in range(6) if B_X[j] <= t]
        R = [j for j in range(6) if B_X[j] > t]
        pl, pr = wvote(L, w), wvote(R, w)
        err = sum(w[j] for j in L if B_Y[j] != pl) + sum(w[j] for j in R if B_Y[j] != pr)
        if best is None or err < best[0]:
            best = (err, t, pl, pr)
    err, t, pl, pr = best
    a = 0.5 * math.log((1 - err) / err)
    wrong = [j for j in range(6) if (pl if B_X[j] <= t else pr) != B_Y[j]]
    w = [w[j] * (math.exp(a) if j in wrong else math.exp(-a)) for j in range(6)]
    s = sum(w)
    w = [x / s for x in w]
    alphas.append(a)
    stumps_b.append((t, pl, pr))
    rounds.append((r + 1, t, err, a, [round(x, 4) for x in w]))
for row in rounds:
    print("round", row)
chk("6l3 r1", rounds[0][1] == 2.5 and near(rounds[0][2], 1/6) and near(rounds[0][3], 0.5 * math.log(5))
    and rounds[0][4] == [0.1, 0.1, 0.1, 0.1, 0.1, 0.5])
chk("6l3 r2", rounds[1][1] == 5.5 and near(rounds[1][2], 0.2) and near(rounds[1][3], 0.5 * math.log(4))
    and rounds[1][4] == [0.25, 0.25, 0.0625, 0.0625, 0.0625, 0.3125])
chk("6l3 r3", rounds[2][1] == 1.5 and near(rounds[2][2], 0.1875) and near(rounds[2][3], 0.5 * math.log(13/3))
    and rounds[2][4] == [0.1538, 0.1538, 0.1667, 0.1667, 0.1667, 0.1923])
print("alpha1:", repr(alphas[0]), "alpha2:", repr(alphas[1]), "alpha3:", repr(alphas[2]))
def boosted(x):
    s0 = s1 = 0.0
    for (t, pl, pr), a in zip(stumps_b, alphas):
        p = pl if x <= t else pr
        if p == 0:
            s0 += a
        else:
            s1 += a
    return 0 if s0 >= s1 else 1
bp = [boosted(x) for x in B_X]
print("boosted preds:", bp, "stumps:", stumps_b)
chk("6l3 boosted acc", bp == [0, 0, 1, 1, 1, 0])
# ex3: fixed round-2 numbers from weights [.1]*5+[.5], stump t=5.5 (1|0)
w2 = [0.1, 0.1, 0.1, 0.1, 0.1, 0.5]
err2 = sum(w2[j] for j in range(6) if (1 if B_X[j] <= 5.5 else 0) != B_Y[j])
chk("6l4 ex3 err", near(err2, 0.2))
a2 = 0.5 * math.log((1 - err2) / err2)
wrong2 = [j for j in range(6) if (1 if B_X[j] <= 5.5 else 0) != B_Y[j]]
w3 = [w2[j] * (math.exp(a2) if j in wrong2 else math.exp(-a2)) for j in range(6)]
w3 = [x / sum(w3) for x in w3]
chk("6l4 ex3 weights", all(near(w3[j], [0.25, 0.25, 0.0625, 0.0625, 0.0625, 0.3125][j]) for j in range(6)))
print("ex3 weights:", [round(x, 6) for x in w3], "alpha2:", repr(a2))

# ---------- ch6.l5 comparison ----------
F = [3.0] * 6
lr = 0.5
rounds5 = []
for r in range(3):
    resid = [y - f for y, f in zip(YS, F)]
    t, _ = best_split(XS, resid)
    L = [rr for x, rr in zip(XS, resid) if x <= t]
    R = [rr for x, rr in zip(XS, resid) if x > t]
    ml, mr = sum(L)/len(L), sum(R)/len(R)
    F = [f + lr * (ml if x <= t else mr) for x, f in zip(XS, F)]
    rounds5.append((r + 1, t, round(ml, 4), round(mr, 4), [round(f, 4) for f in F]))
for row in rounds5:
    print("boost round", row)
mseb5 = sum((y - f) ** 2 for y, f in zip(YS, F)) / 6
print("boosted F:", [round(f, 4) for f in F])
print("boosted mse:", repr(mseb5))
chk("6l5 order baseline>single>boosted>bagged", mse0 > mse1 > mseb5 > mseb)
chk("6l5 boosted mse value", near(mseb5, 0.23551432291666666, 1e-12))
print("single:", repr(mse1), "bagged:", repr(mseb), "boosted:", repr(mseb5), "baseline:", repr(mse0))

# ---------- report prints sanity (trace l4) ----------
print("parent sse:", 22.0, "| best:", 3.25, "| reduction:", 22.0 - 3.25)
print("alpha rounds:", round(0.8047189562170503, 4), round(0.6931471805599453, 4), round(0.7331685343967135, 4))
print("err1 round:", round(1/6, 4), "acc:", 1.0)
print("\nALL OK" if ok else "\nSOME CHECKS FAILED")
