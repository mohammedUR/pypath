#!/usr/bin/env python3
"""Task 20-f verification: EVERY literal planned for d2l ch17-ch21 lessons."""
import math

ok = []
def check(name, got, want, tol=None):
    if tol is None:
        assert got == want, f"{name}: got {got!r} want {want!r}"
    else:
        if isinstance(got, (list, tuple)):
            assert len(got) == len(want) and all(abs(g - w) < tol for g, w in zip(got, want)), f"{name}: got {got!r} want {want!r}"
        else:
            assert abs(got - want) < tol, f"{name}: got {got!r} want {want!r}"
    ok.append(name)

# ---------------- ch17.l1 : 3-state MDP, value iteration ----------------
# states 0,1,2 ; terminal 2 ; actions 0,1 ; deterministic transitions
NS = [[1, 0], [2, 0], [None, None]]     # next state per (s,a); 2 terminal
R  = [[0.0, 1.0], [5.0, 0.0], [0.0, 0.0]]

def vi(gamma, iters, V0=(0.0, 0.0, 0.0)):
    V = list(V0)
    hist = [list(V)]
    for _ in range(iters):
        new = []
        for s in range(3):
            if NS[s][0] is None:
                new.append(0.0)
                continue
            vals = [R[s][a] + gamma * V[NS[s][a]] for a in (0, 1)]
            new.append(max(vals))
        V = new
        hist.append(list(V))
    return hist

h = vi(0.5, 4)
check("ch17 V1", h[1], [1.0, 5.0, 0.0], 1e-12)
check("ch17 V2", h[2], [2.5, 5.0, 0.0], 1e-12)
check("ch17 V3==V2", h[3], h[2], 1e-12)
check("ch17 V4==V2", h[4], h[2], 1e-12)
# greedy actions at fixed point: s0 -> argmax(0+0.5*5, 1+0.5*2.5) = argmax(2.5,2.25)=0
check("ch17 a0 vals", (0 + 0.5*5.0, 1 + 0.5*2.5), (2.5, 2.25), 1e-12)
check("ch17 s1 a0", 5.0 + 0.5*0.0, 5.0, 1e-12)

# policy evaluation, uniform policy pi=[0.5,0.5], closed form 18/11 and 32/11
def pe(gamma, iters):
    V = [0.0, 0.0, 0.0]
    for _ in range(iters):
        V = [
            0.5*(0.0 + gamma*V[1]) + 0.5*(1.0 + gamma*V[0]),
            0.5*(5.0 + gamma*V[2]) + 0.5*(0.0 + gamma*V[0]),
            0.0,
        ]
    return V
Vp = pe(0.5, 200)
check("ch17 pe V0", Vp[0], 18.0/11.0, 1e-9)
check("ch17 pe V1", Vp[1], 32.0/11.0, 1e-9)
print("ch17 pe values %.6f %.6f" % (18/11, 32/11))

# ---------------- ch17.l1 : Q-learning by hand, 6 fixed tuples ----------------
gamma, alpha = 0.5, 0.5
Q = [[0.0, 0.0] for _ in range(3)]
tuples = [(1,0,5.0,2,True),(0,0,0.0,1,False),(0,1,1.0,0,False),
          (1,1,0.0,0,False),(1,0,5.0,2,True),(0,0,0.0,1,False)]
ql = []
for (s,a,r,s2,term) in tuples:
    target = r + (0.0 if term else gamma*max(Q[s2]))
    Q[s][a] = Q[s][a] + alpha*(target - Q[s][a])
    ql.append((target, [row[:] for row in Q]))
check("ch17 t1", ql[0][0], 5.0, 1e-12);        check("ch17 q10@1", ql[0][1][1][0], 2.5, 1e-12)
check("ch17 t2", ql[1][0], 1.25, 1e-12);       check("ch17 q00@2", ql[1][1][0][0], 0.625, 1e-12)
check("ch17 t3", ql[2][0], 1.3125, 1e-12);     check("ch17 q01@3", ql[2][1][0][1], 0.65625, 1e-12)
check("ch17 t4", ql[3][0], 0.328125, 1e-12);   check("ch17 q11@4", ql[3][1][1][1], 0.1640625, 1e-12)
check("ch17 t5 Q10", ql[4][1][1][0], 3.75, 1e-12)
check("ch17 t6 Q00", ql[5][1][0][0], 1.25, 1e-12)
check("ch17 final Q", (Q[0][0], Q[0][1], Q[1][0], Q[1][1]), (1.25, 0.65625, 3.75, 0.1640625), 1e-12)
check("ch17 greedy s0", 0 if Q[0][0] > Q[0][1] else 1, 0)
check("ch17 greedy s1", 0 if Q[1][0] > Q[1][1] else 1, 0)

# ---------------- ch18.l1 : RBF kernel + linear GP + posterior ----------------
def rbf(x, xp, ls, a=1.0):
    return a*a*math.exp(-((x-xp)**2)/(2*ls*ls))
check("ch18 rbf(0,0,1)", rbf(0,0,1), 1.0, 1e-12)
check("ch18 rbf(0,1,1)", rbf(0,1,1), math.exp(-0.5), 1e-12)
check("ch18 exp(-0.5)", math.exp(-0.5), 0.6065306597126334, 1e-15)
check("ch18 rbf(0,2,1)", rbf(0,2,1), math.exp(-2.0), 1e-12)
check("ch18 exp(-2)", math.exp(-2.0), 0.1353352832366127, 1e-15)
check("ch18 rbf(0,2,2)", rbf(0,2,2), math.exp(-0.5), 1e-12)
check("ch18 rbf(0,1,4)", rbf(0,1,4), math.exp(-1.0/32.0), 1e-15)
check("ch18 rbf(0,5,1)", rbf(0,5,1), math.exp(-12.5), 1e-12)
check("ch18 exp(-12.5)", math.exp(-12.5), 3.726653172078671e-06, 1e-20)
# linear model f(x)=w0+w1x, w~N(0,1): m(x)=0, k(x,x')=1+x*x'
check("ch18 k(2,3)", 1 + 2*3, 7)
check("ch18 var at 2", 1 + 2*2, 5)
check("ch18 k(1,-1)", 1 + 1*(-1), 0)
# posterior, one observation f(x1)=1.2, noise-free K=[[1,c],[c,1]]
def post1(c, y):
    m = c*y            # c * 1^{-1} * y
    s2 = 1.0 - c*c
    return m, math.sqrt(s2)
m1, s1_ = post1(0.9, 1.2)
check("ch18 m 0.9", m1, 1.08, 1e-12)
check("ch18 s 0.9", s1_, math.sqrt(0.19), 1e-12)
print("ch18 s(0.9)=%.6f 1sd interval [%.4f, %.4f]" % (s1_, m1-s1_, m1+s1_))
check("ch18 lo 0.9", m1-s1_, 0.6441101056459329, 1e-12)
check("ch18 hi 0.9", m1+s1_, 1.515889894354067, 1e-12)
m2, s2_ = post1(0.95, 1.2)
check("ch18 m 0.95", m2, 1.14, 1e-12)
check("ch18 s 0.95", s2_, math.sqrt(0.0975), 1e-12)
print("ch18 s(0.95)=%.6f interval [%.4f, %.4f]" % (s2_, m2-s2_, m2+s2_))
check("ch18 lo 0.95", m2-s2_, 0.8277501000800801, 1e-12)
check("ch18 hi 0.95", m2+s2_, 1.45224989991992, 1e-12)
# posterior with two observations, K=[[1,0.5],[0.5,1]], y=[1.2,1.4], k=[0.9,0.8]
c12 = 0.5
det = 1.0 - c12*c12
Kinv_y = [(1.0*1.2 - c12*1.4)/det, (-c12*1.2 + 1.0*1.4)/det]
m3 = 0.9*Kinv_y[0] + 0.8*Kinv_y[1]
Kinv_k = [(1.0*0.9 - c12*0.8)/det, (-c12*0.9 + 1.0*0.8)/det]
s3sq = 1.0 - (0.9*Kinv_k[0] + 0.8*Kinv_k[1])
check("ch18 det", det, 0.75, 1e-15)
check("ch18 m3", m3, 1.4533333333333331, 1e-9)
check("ch18 s3sq", s3sq, 0.026666666666666668, 1e-9)
s3_ = math.sqrt(s3sq)
print("ch18 m=%.6f s=%.6f 95%% [%.4f, %.4f]" % (m3, s3_, m3-2*s3_, m3+2*s3_))
check("ch18 s3", s3_, 0.16329931618554522, 1e-12)

# ---------------- ch19.l1 : grid search + candidate list + async sim ----------------
def f(lr, m):
    return 0.2 + 0.1*(math.log10(lr) + 2.5)**2 + 0.05*(m - 0.9)**2
check("ch19 f(0.01,0.9)", f(0.01, 0.9), 0.225, 1e-12)
check("ch19 f(0.001,0.9)", f(0.001, 0.9), 0.225, 1e-12)
check("ch19 f(0.1,0.9)", f(0.1, 0.9), 0.425, 1e-12)
lrs_grid = [0.001, 0.01, 0.1]
ms_grid  = [0.8, 0.9, 0.95]
trials = [(lr, m, f(lr, m)) for lr in lrs_grid for m in ms_grid]
check("ch19 grid n", len(trials), 9)
best_grid = min(trials, key=lambda t: t[2])
check("ch19 grid best err", best_grid[2], 0.225, 1e-12)
check("ch19 grid best lr", best_grid[0], 0.001, 1e-15)
check("ch19 distinct lr grid", len(set(t[0] for t in trials)), 3)
cand_lrs = [round(10.0**(-3.0 + 0.25*i), 6) for i in range(9)]
cand_ms  = [0.85, 0.92, 0.88, 0.95, 0.9, 0.87, 0.93, 0.89, 0.91]
trials2 = [(lr, m, f(lr, m)) for lr, m in zip(cand_lrs, cand_ms)]
best_c = min(trials2, key=lambda t: t[2])
check("ch19 cand n", len(trials2), 9)
check("ch19 distinct lr cand", len(set(t[0] for t in trials2)), 9)
print("ch19 cand best", best_c, "err %.9f" % best_c[2])
check("ch19 cand best lr", best_c[0], 0.003162, 1e-9)
check("ch19 cand best err", best_c[2], 0.2000200001454233, 1e-12)
assert best_c[2] < 0.2006, "candidate list should nearly hit 0.2"
# incumbent trajectories
def incumbent_traj(errs):
    out, cur = [], None
    for e in errs:
        cur = e if cur is None else min(cur, e)
        out.append(cur)
    return out
g_errs = [t[2] for t in trials]
traj_g = incumbent_traj(g_errs)
check("ch19 grid traj last", traj_g[-1], 0.225, 1e-12)
check("ch19 grid traj first", traj_g[0], f(0.001, 0.8), 1e-12)
# async simulation: durations [3,7,2,5], 2 workers
def simulate(durs, n_workers, sync):
    free = [0]*n_workers
    if sync:
        for i in range(0, len(durs), n_workers):
            batch = durs[i:i+n_workers]
            start = max(free)
            free = [start + d for d in batch]
        t_end = max(free)
    else:
        import heapq
        heap = [(0, w) for w in range(n_workers)]
        heapq.heapify(heap)
        end = 0
        for d in durs:
            st, w = heapq.heappop(heap)
            ft = st + d
            end = max(end, ft)
            heapq.heappush(heap, (ft, w))
        t_end = end
    idle = n_workers*t_end - sum(durs)
    return t_end, idle
end_s, idle_s = simulate([3,7,2,5], 2, True)
end_a, idle_a = simulate([3,7,2,5], 2, False)
print("ch19 sync", end_s, idle_s, "async", end_a, idle_a)
check("ch19 sync makespan", end_s, 12)
check("ch19 async makespan", end_a, 10)
check("ch19 sync idle", idle_s, 7)
check("ch19 async idle", idle_a, 3)

# ---------------- ch19.l2 : successive halving bracket ----------------
rungs = [1, 2, 4, 8]
err = {
 1: [0.62, 0.55, 0.71, 0.58, 0.66, 0.52, 0.74, 0.60],
 2: {1: 0.41, 3: 0.44, 5: 0.49, 7: 0.47},
 4: {1: 0.33, 3: 0.38},
 8: {1: 0.27},
}
def sh(rungs, err, eta=2):
    survivors = list(range(8))
    log = []
    budget = 0
    for r in rungs:
        for c in survivors:
            budget += r
        scored = sorted(survivors, key=lambda c: (err[r][c], c))
        log.append((r, list(scored)))
        keep = max(1, len(survivors)//eta)
        survivors = scored[:keep]
    return log, survivors[0], budget
log, winner, budget = sh(rungs, err)
check("ch19b r1 order", log[0][1], [5,1,3,7,0,4,2,6])
check("ch19b r1 keep", log[0][1][:4], [5,1,3,7])
check("ch19b r2 order", log[1][1], [1,3,7,5])
check("ch19b r2 keep", log[1][1][:2], [1,3])
check("ch19b r4 order", log[2][1], [1,3])
check("ch19b winner", winner, 1)
check("ch19b budget", budget, 32)
check("ch19b full budget", 8*8, 64)
# numeric alternative: r_min=2, r_max=16, eta=2 -> K=3, N=8, rungs 2,4,8,16
check("ch19b alt budget", 8*2 + 4*4 + 2*8 + 1*16, 64)

# ---------------- ch20.l1 : GAN losses + DCGAN shapes ----------------
def softplus(x):
    return math.log(1.0 + math.exp(x))
def sig(x):
    return 1.0/(1.0 + math.exp(-x))
check("ch20 sig(2)", sig(2.0), 0.8807970779778823, 1e-15)
check("ch20 sig(-1)", sig(-1.0), 0.2689414213699951, 1e-15)
l_real = softplus(-2.0)      # -log D(x), y=1, o=2
l_fake = softplus(-1.0)      # -log(1-D(G(z))), y=0, o=-1
check("ch20 l_real", l_real, 0.12692801104297263, 1e-12)
check("ch20 l_fake", l_fake, 0.3132616875182229, 1e-12)
l_D = 0.5*(l_real + l_fake)
check("ch20 l_D", l_D, 0.22009484928059776, 1e-12)
l_G_sat = l_fake             # -log(1-D(G(z))) saturating form (20.1.2)
l_G_nsat = -math.log(sig(-1.0))  # -log D(G(z)) non-saturating (20.1.3)
check("ch20 l_G_sat", l_G_sat, 0.3132616875182229, 1e-12)
check("ch20 l_G_nsat", l_G_nsat, 1.3132616875182229, 1e-12)
check("ch20 log2", softplus(0.0), 0.6931471805599453, 1e-12)
check("ch20 bce real identity", -math.log(sig(2.0)), softplus(-2.0), 1e-12)
# DCGAN shapes
def tconv_out(n, k, s, p):
    return k + s*(n-1) - 2*p
def conv_out(n, k, s, p):
    return (n - k + 2*p + s)//s
check("ch20 g 1->4", tconv_out(1,4,1,0), 4)
check("ch20 g 4->8", tconv_out(4,4,2,1), 8)
check("ch20 g 8->16", tconv_out(8,4,2,1), 16)
check("ch20 g 16->32", tconv_out(16,4,2,1), 32)
check("ch20 g 32->64", tconv_out(32,4,2,1), 64)
check("ch20 d 64->32", conv_out(64,4,2,1), 32)
check("ch20 d 32->16", conv_out(32,4,2,1), 16)
check("ch20 d 16->8", conv_out(16,4,2,1), 8)
check("ch20 d 8->4", conv_out(8,4,2,1), 4)
check("ch20 d 4->1", conv_out(4,4,1,0), 1)
check("ch20 chans", (64*8, 64*4, 64*2, 64), (512, 256, 128, 64))

# ---------------- ch21.l1 : matrix factorization SGD + top-k ----------------
R = [[5.0, 3.0, 0.0, 0.0],
     [4.0, 0.0, 1.0, 1.0],
     [1.0, 1.0, 0.0, 5.0]]
obs = [(u,i,R[u][i]) for u in range(3) for i in range(4) if R[u][i] > 0]
check("ch21 nobs", len(obs), 8)
K = 2
P = [[0.8,0.4],[0.3,0.9],[0.6,0.2]]
Q = [[0.7,0.5],[0.2,0.8],[0.9,0.3],[0.4,0.6]]
def pred(u,i): return sum(P[u][f]*Q[i][f] for f in range(K))
def rmse():
    return math.sqrt(sum((r - pred(u,i))**2 for (u,i,r) in obs)/len(obs))
rmse0 = rmse()
print("ch21 rmse0 %.6f" % rmse0)
lr = 0.02
marks = {0, 25, 50, 100, 149}
hist = {}
for epoch in range(150):
    for (u,i,r) in obs:
        e = r - pred(u,i)
        for f_ in range(K):
            P[u][f_] += lr * (2*e*Q[i][f_])
            Q[i][f_] += lr * (2*e*P[u][f_])
    if epoch in marks:
        hist[epoch] = rmse()
print("ch21 hist", {k: round(v,6) for k,v in sorted(hist.items())})
rmseF = rmse()
print("ch21 rmseF %.6f" % rmseF)
assert rmseF < 0.001, "MF should fit tiny matrix essentially exactly"
missing = [(0,2),(0,3),(1,1),(2,2)]
preds = {(u,i): round(pred(u,i), 4) for (u,i) in missing}
print("ch21 preds", preds)
p02 = pred(0,2); p03 = pred(0,3)
print("ch21 p02=%.6f p03=%.6f" % (p02, p03))
check("ch21 top2 order", [t[0] for t in sorted([(2,pred(0,2)),(3,pred(0,3))], key=lambda t:(-t[1], t[0]))], [3,2])
print("ch21 P", [[round(v,4) for v in row] for row in P])
print("ch21 Q", [[round(v,4) for v in row] for row in Q])
def top_k(scores, k):
    return sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))[:k]
sc = {101: 4.2, 102: 4.9, 103: 4.2, 104: 3.7, 105: 4.9}
check("ch21 top3", [t[0] for t in top_k(sc, 3)], [102, 105, 101])
check("ch21 top2", [t[0] for t in top_k(sc, 2)], [102, 105])
check("ch21 topk tie val", top_k(sc, 3)[1][1], 4.9, 1e-12)
check("ch21 topk last", top_k(sc, 3)[2], (101, 4.2), 1e-12)

print("ALL %d CHECKS PASSED" % len(ok))
