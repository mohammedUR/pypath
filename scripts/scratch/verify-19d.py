# Verification for Task 19-d (D2L ch12+ch13) — every printed literal + test assert.
import math

F = '%.6f'
print('== ch12.l1: GD on x^2, x0=10, 10 steps ==')
def gd1(eta, steps, x0=10.0):
    x = x0
    for _ in range(steps):
        x = x - eta * (2 * x)
    return x
for eta in (0.05, 0.2, 1.1):
    print('eta', eta, '->', F % gd1(eta, 10))

print('-- midpoint convexity --')
def margin(f, x, xp, lam):
    lhs = lam * f(x) + (1 - lam) * f(xp)
    mid = lam * x + (1 - lam) * xp
    return lhs - f(mid)
sq = lambda x: x * x
cs = lambda x: math.cos(math.pi * x)
print('x^2 pair(-2,1.5,l=0.3) margin:', '%.6f' % margin(sq, -2.0, 1.5, 0.3))
print('x^2 pair(10,4,l=0.5) margin:', '%.6f' % margin(sq, 10.0, 4.0, 0.5))
print('cos(pi x) pair(-1.5,1.0,l=0.5) margin:', '%.6f' % margin(cs, -1.5, 1.0, 0.5))
print('cos(pi x) pair(0,1.0,l=0.5) margin:', '%.6f' % margin(cs, 0.0, 1.0, 0.5))

print('-- 2D GD on x1^2+2x2^2, from (-5,-2), eta=0.1, 20 steps --')
x1, x2 = -5.0, -2.0
for _ in range(20):
    x1 -= 0.1 * (2 * x1)
    x2 -= 0.1 * (4 * x2)
print('x1:', F % x1, 'x2:', F % x2)

print('-- ex1 solution: gd on (x-1)^2, x0=10, eta=0.2, 10 steps --')
x = 10.0
traj = [x]
for _ in range(10):
    x = x - 0.2 * (2 * (x - 1))
    traj.append(x)
print('final:', repr(x), '| expect', repr(1 + 9 * 0.6 ** 10))
fs = [(t - 1) ** 2 for t in traj]
print('f monotone down:', all(fs[i + 1] < fs[i] for i in range(len(fs) - 1)), '| traj len:', len(traj))
print('close to 1:', abs(x - 1.0) < 0.06)

print()
print('== ch12.l2: valley f=0.1x1^2+2x2^2 ==')
def run(eta, beta, steps=20):
    x1, x2, v1, v2 = -5.0, -2.0, 0.0, 0.0
    for _ in range(steps):
        g1, g2 = 0.2 * x1, 4 * x2
        v1 = beta * v1 + g1
        v2 = beta * v2 + g2
        x1 -= eta * v1
        x2 -= eta * v2
    return x1, x2
for eta, beta, tag in ((0.4, 0.0, 'gd 0.4'), (0.6, 0.0, 'gd 0.6'), (0.6, 0.5, 'mom 0.6/0.5'), (0.6, 0.25, 'mom 0.6/0.25')):
    a, b = run(eta, beta)
    print(tag, '-> x1:', F % a, 'x2:', F % b)

print('-- minibatch variance reduction, grads [2,-1,0.5,-0.5] --')
gs = [2.0, -1.0, 0.5, -0.5]
m = sum(gs) / 4
var = sum((g - m) ** 2 for g in gs) / 4  # population var of one sample
sd = math.sqrt(var)
print('mean:', F % m, 'single-sample std:', F % sd, 'batch-of-4 mean std:', F % (sd / math.sqrt(4)))

print('-- effective weight 1/(1-beta) --')
for beta in (0.9, 0.5):
    s = sum(beta ** t for t in range(200))
    print('beta', beta, 'sum:', F % s, 'formula:', F % (1 / (1 - beta)))

print('-- SGD with LCG noise demo (deterministic) --')
state = 7
def lcg():
    global state
    state = (state * 1103515245 + 12345) % (2 ** 31)
    return state / (2 ** 31)
x1, x2 = -5.0, -2.0
for t in range(50):
    g1, g2 = 2 * x1, 4 * x2
    n1, n2 = lcg() - 0.5, lcg() - 0.5
    x1 -= 0.1 * (g1 + n1)
    x2 -= 0.1 * (g2 + n2)
print('sgd noisy 50 steps:', F % x1, F % x2, '| dist:', '%.6f' % math.hypot(x1, x2))

print()
print('== ch12.l3: adagrad/rmsprop on valley ==')
def adagrad2d(eta, steps=20, eps=1e-6):
    x1, x2, s1, s2 = -5.0, -2.0, 0.0, 0.0
    for _ in range(steps):
        g1, g2 = 0.2 * x1, 4 * x2
        s1 += g1 ** 2
        s2 += g2 ** 2
        x1 -= eta / math.sqrt(s1 + eps) * g1
        x2 -= eta / math.sqrt(s2 + eps) * g2
    return x1, x2, s1, s2
for eta in (0.4, 2.0):
    a, b, s1, s2 = adagrad2d(eta)
    print('adagrad eta', eta, '-> x1:', F % a, 'x2:', F % b, '| s1:', '%.2f' % s1)
def rmsprop2d(eta, gamma, steps=20, eps=1e-6):
    x1, x2, s1, s2 = -5.0, -2.0, 0.0, 0.0
    for _ in range(steps):
        g1, g2 = 0.2 * x1, 4 * x2
        s1 = gamma * s1 + (1 - gamma) * g1 ** 2
        s2 = gamma * s2 + (1 - gamma) * g2 ** 2
        x1 -= eta / math.sqrt(s1 + eps) * g1
        x2 -= eta / math.sqrt(s2 + eps) * g2
    return x1, x2, s1, s2
a, b, s1, s2 = rmsprop2d(0.4, 0.9)
print('rmsprop 0.4/0.9 -> x1:', F % a, 'x2:', F % b)
a, b, s1, s2 = rmsprop2d(0.01, 0.9)
print('rmsprop 0.01/0.9 -> x1:', F % a, 'x2:', F % b)

print('-- ex1: adagrad 1-D on x^2, x0=10, eta=0.5, 20 steps --')
x, s = 10.0, 0.0
for t in range(1, 21):
    g = 2 * x
    s += g ** 2
    x -= 0.5 / math.sqrt(s + 1e-6) * g
print('final x:', repr(x), '| eff lr now:', '%.6f' % (0.5 / math.sqrt(s + 1e-6)), '| s:', '%.2f' % s)
x, s = 10.0, 0.0
for t in range(1, 6):
    g = 2 * x
    s += g ** 2
    x -= 0.5 / math.sqrt(s + 1e-6) * g
    print('  t%d: x=%.6f eff_lr=%.6f' % (t, x, 0.5 / math.sqrt(s + 1e-6)))

print('-- adadelta 2-D (no lr) rho=0.9 --')
def adadelta2d(rho=0.9, steps=20, eps=1e-5):
    x1, x2, s1, s2, d1, d2 = -5.0, -2.0, 0.0, 0.0, 0.0, 0.0
    for _ in range(steps):
        g1, g2 = 0.2 * x1, 4 * x2
        s1 = rho * s1 + (1 - rho) * g1 ** 2
        s2 = rho * s2 + (1 - rho) * g2 ** 2
        u1 = (math.sqrt(d1 + eps) / math.sqrt(s1 + eps)) * g1
        u2 = (math.sqrt(d2 + eps) / math.sqrt(s2 + eps)) * g2
        x1 -= u1
        x2 -= u2
        d1 = rho * d1 + (1 - rho) * u1 ** 2
        d2 = rho * d2 + (1 - rho) * u2 ** 2
    return x1, x2
a, b = adadelta2d()
print('adadelta rho 0.9 -> x1:', F % a, 'x2:', F % b)

print()
print('== ch12.l4: adam + schedules ==')
def adam1d(eta=0.5, beta1=0.9, beta2=0.999, eps=1e-6, steps=3, x0=10.0):
    x, v, s = x0, 0.0, 0.0
    rows = []
    for t in range(1, steps + 1):
        g = 2 * (x - 1)
        v = beta1 * v + (1 - beta1) * g
        s = beta2 * s + (1 - beta2) * g ** 2
        vh = v / (1 - beta1 ** t)
        sh = s / (1 - beta2 ** t)
        x -= eta * vh / (math.sqrt(sh) + eps)
        rows.append((t, g, v, vh, sh, x))
    return x, rows
xf, rows = adam1d()
for (t, g, v, vh, sh, x) in rows:
    print('t=%d g=%.6f v=%.6f vhat=%.6f shat=%.10f x=%.6f' % (t, g, v, vh, sh, x))
print('final x:', F % xf)
print('t=1: vhat==g and shat==g^2:', abs(rows[0][3] - rows[0][1]) < 1e-12, abs(rows[0][4] - rows[0][1] ** 2) < 1e-12)

print('-- sqrt schedule eta0=0.1 --')
for t in (0, 4, 9, 19):
    print('t=%d -> %s' % (t, F % (0.1 * (t + 1) ** -0.5)))
print('-- cosine T=20 eta0=0.3 etaT=0.01 --')
def cosine_lr(t, T=20, eta0=0.3, etaT=0.01):
    if t > T:
        t = T
    return etaT + (eta0 - etaT) / 2 * (1 + math.cos(math.pi * t / T))
for t in (0, 5, 10, 20, 30):
    print('t=%d -> %s' % (t, F % cosine_lr(t)))
print('-- step decay eta0=0.5, halve at 15,30 --')
def step_lr(t, eta0=0.5, miles=(15, 30)):
    lr = eta0
    for m in miles:
        if t >= m:
            lr *= 0.5
    return lr
for t in (0, 14, 15, 30, 45):
    print('t=%d -> %s' % (t, F % step_lr(t)))
print('-- warmup 5 then cosine (eta0=0.3) --')
def warm_cos(t, warm=5, T=20, eta0=0.3, etaT=0.01):
    if t < warm:
        return eta0 * t / warm
    return cosine_lr(t, T, eta0, etaT)
for t in (0, 2, 4, 5, 6):
    print('t=%d -> %s' % (t, F % warm_cos(t)))
g = 18.0
print("eta*vh/(sqrt(sh)+eps) with vh=18, sh=324:", F % (0.5 * 18 / (math.sqrt(324) + 1e-6)))

print()
print('== ch13.l1: fold + parallel makespan + latency ladder ==')
def fold(node):
    if not isinstance(node, tuple):
        return node
    op, a, b = node
    a, b = fold(a), fold(b)
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return a + b if op == 'add' else a * b
    return (op, a, b)
e1 = ('add', ('add', 1, 2), ('add', 3, 4))
e2 = ('mul', ('add', 2, 3), 4)
e3 = ('add', 'x', ('add', 1, 2))
print('fold e1:', repr(fold(e1)))
print('fold e2:', repr(fold(e2)))
print('fold e3:', repr(fold(e3)))
print('e3 folded to (add,x,3)?', fold(e3) == ('add', 'x', 3))

tasks = {'A': (5, []), 'B': (3, []), 'C': (4, ['A', 'B']), 'D': (2, ['C']), 'E': (6, ['B'])}
done, rounds, makespan = set(), [], 0
while len(done) < len(tasks):
    ready = [k for k in tasks if k not in done and all(d in done for d in tasks[k][1])]
    w = max(tasks[k][0] for k in ready)
    rounds.append((ready, w))
    makespan += w
    done |= set(ready)
seq = sum(c for c, _ in tasks.values())
print('rounds:', rounds, '| makespan:', makespan, '| sequential:', seq, '| speedup:', F % (seq / makespan))

lat = {'L1 cache': 1.0, 'L2 cache': 4.0, 'RAM': 100.0, 'SSD read': 50000.0}
print('RAM / L1 =', F % (lat['RAM'] / lat['L1 cache']), '| RAM / L2 =', F % (lat['RAM'] / lat['L2 cache']), '| SSD / RAM =', F % (lat['SSD read'] / lat['RAM']))
print('-- ex2 numeric: lanes 25+15 vs sequential 40 -> speedup 1.6 --')
print('speedup:', F % (40 / 25))

print()
print('== ch13.l2: allreduce + split + sync-cost + param server ==')
def allreduce(shards):
    n, m = len(shards[0]), len(shards[0][0])
    total = [[sum(shards[k][i][j] for k in range(len(shards))) for j in range(m)] for i in range(n)]
    return [[[total[i][j] for j in range(m)] for i in range(n)] for _ in shards]
shards = [[[1.0, 1.0]], [[2.0, 2.0]]]
out = allreduce(shards)
print('after allreduce:', out, '| equal shards:', out[0] == out[1])
data = [[5 * i + j for j in range(5)] for i in range(4)]
split = [data[:2], data[2:]]
print('split rows:', [len(s) for s in split], '| shard0 row0:', split[0][0], '| shard1 last:', split[1][-1])

print('-- sync cost model: 160 MB, 16 GB/s PCIe --')
mb = 160.0
bw = 16.0  # GB/s
t1 = mb / 1000 / bw * 1000  # ms per 160MB transfer
print('one transfer:', F % t1, 'ms')
print('all on gpu0: 6 transfers =', F % (6 * t1), 'ms')
print('all via cpu: 8 transfers =', F % (8 * t1), 'ms')
print('split 4 parts of 40MB: one part =', F % (40 / 1000 / bw * 1000), 'ms -> total', F % (2 * 3 * (40 / 1000 / bw * 1000)), 'ms')
ring = 2 * mb / 1000 / (3 * 18.0) * 1000
print('ring 8 GPUs: 2*160MB/(3*18GB/s) =', F % ring, 'ms (book ~6)')

print('-- parameter server push/pull sim --')
workers = {
    'w1': {'grad': {'w': 0.5, 'b': -1.0}},
    'w2': {'grad': {'w': 1.5, 'b': 0.0}},
}
server = {'w': 3.0, 'b': 2.0}
agg, cnt_push, cnt_pull = {'w': 0.0, 'b': 0.0}, 0, 0
for wk in sorted(workers):
    for k in workers[wk]['grad']:
        agg[k] += workers[wk]['grad'][k]
    cnt_push += 1
avg = {k: agg[k] / len(workers) for k in agg}
lr = 0.1
for k in server:
    server[k] = server[k] - lr * avg[k]
    cnt_pull += 1
print('agg:', agg, '| avg:', avg, '| server now:', server, '| pushes:', cnt_push, 'pulls:', cnt_pull)
print('w new == 2.9:', abs(server['w'] - 2.9) < 1e-9, '| b new == 2.05:', abs(server['b'] - 2.05) < 1e-9)

print('-- ex1 allreduce tests --')
r = allreduce([[[0.0, 1.0], [2.0, 3.0]], [[10.0, 10.0], [10.0, 10.0]]])
print(r[0], '| ok:', r[0] == [[10.0, 11.0], [12.0, 13.0]] and r[0] == r[1])
r = allreduce([[[5.0]], [[-2.0]], [[1.5]]])
print('3 shards -> [[4.5]]:', r[0] == r[1] == r[2] == [[4.5]])

print()
print('== ch12.l2 ex: momentum solution check ==')
def momentum_run(eta, beta, steps=20):
    x1, x2, v1, v2 = -5.0, -2.0, 0.0, 0.0
    for _ in range(steps):
        v1 = beta * v1 + 0.2 * x1
        v2 = beta * v2 + 4 * x2
        x1 -= eta * v1
        x2 -= eta * v2
    return x1, x2
a, b = momentum_run(0.6, 0.5)
print('momentum(0.6,0.5):', repr(a), repr(b), '| within 1e-6 of (0.007188, 0.002553):', abs(a - 0.007188) < 1e-6 and abs(b - 0.002553) < 1e-6)

print()
print('== ch13.l1 perf_counter structure check (counts not time) ==')
import time
a = [i * 0.5 for i in range(200000)]
b = [i * 0.25 for i in range(200000)]
t0 = time.perf_counter()
acc = 0.0
for i in range(len(a)):
    acc += a[i] * b[i]
t_loop = time.perf_counter() - t0
t0 = time.perf_counter()
fast = sum(x * y for x, y in zip(a, b))
t_zip = time.perf_counter() - t0
print('results equal:', abs(acc - fast) < 1e-6, '| acc:', '%.4f' % acc, '| t_loop>0:', t_loop > 0, '| t_zip>0:', t_zip > 0)
