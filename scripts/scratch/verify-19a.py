#!/usr/bin/env python3
"""Task 19-a literal verification: D2L ch3/ch4/ch5 — every printed literal + every test assert."""
import math, sys

ok = True
def chk(name, cond):
    global ok
    print(('PASS' if cond else 'FAIL'), name)
    if not cond: ok = False

# ---------------- ch3.l1: normal equations + SGD steps + OOD ----------------
xs = [0.0, 1.0, 2.0, 3.0]
ys = [1.0, 3.0, 4.5, 6.5]
mx = sum(xs) / len(xs); my = sum(ys) / len(ys)
Sxy = sum((xs[i]-mx)*(ys[i]-my) for i in range(4))
Sxx = sum((xs[i]-mx)**2 for i in range(4))
w, b = Sxy/Sxx, my - (Sxy/Sxx)*mx
print('A: mx=%.2f my=%.2f Sxy=%.1f Sxx=%.1f w=%.4f b=%.4f' % (mx, my, Sxy, Sxx, w, b))
preds = [w*x + b for x in xs]
errs = [ys[i]-preds[i] for i in range(4)]
sq = [e*e for e in errs]
mse = sum(sq)/len(sq)
print('A: preds', ['%.2f' % p for p in preds], 'errs', ['%.2f' % e for e in errs])
print('A: mse=%.4f pred@4=%.2f' % (mse, w*4+b))
chk('A w=1.8', abs(w-1.8) < 1e-9); chk('A b=1.05', abs(b-1.05) < 1e-9)
chk('A mse=0.0125', abs(mse-0.0125) < 1e-12); chk('A pred@4=8.25', abs(w*4+b-8.25) < 1e-9)
# SGD full-batch steps, w0=b0=0, lr=0.1
w, b = 0.0, 0.0; lr = 0.1
for step in range(3):
    errs = [w*x + b - ys[i] for i, x in enumerate(xs)]
    gw = sum(xs[i]*errs[i] for i in range(4))/4
    gb = sum(errs)/4
    w -= lr*gw; b -= lr*gb
    print('A: step%d w=%.4f b=%.4f' % (step+1, w, b))
print('A final w=%.6f b=%.6f' % (w, b))
chk('A step3 w=1.506375 b=0.723469', abs(w-1.506375) < 1e-9 and abs(b-0.723469) < 1e-6)
# gradient asserts for ex1
def grad_mse(xs, ys, w, b):
    n = len(xs)
    errs = [w*x + b - ys[i] for i, x in enumerate(xs)]
    gw = sum(xs[i]*errs[i] for i in range(n))/n
    gb = sum(errs)/n
    return (gw, gb)
g0 = grad_mse(xs, ys, 1.8, 1.05); print('A ex1 grad@(1.8,1.05) =', g0)
chk('A grad zero at optimum', abs(g0[0]) < 1e-9 and abs(g0[1]) < 1e-9)
g1 = grad_mse(xs, ys, 0.0, 0.0); print('A ex1 grad@(0,0) =', g1)
chk('A grad@0 = (-7.875,-3.75)', abs(g1[0]+7.875) < 1e-12 and abs(g1[1]+3.75) < 1e-12)
# OOD demo
def add_to_class(Class):
    def wrapper(obj):
        setattr(Class, obj.__name__, obj)
    return wrapper
class A:
    def __init__(self):
        self.b = 42
a = A()
@add_to_class(A)
def do(self):
    return 'b = %d' % self.b
print('A OOD:', a.do())
chk('A OOD add_to_class', a.do() == 'b = 42')
class HyperParameters:
    def save_hp(self, ignore, **kwargs):
        for key, value in kwargs.items():
            if key not in ignore:
                setattr(self, key, value)
class B(HyperParameters):
    def __init__(self, a, b, c):
        self.save_hp(['c'], a=a, b=b, c=c)
bb = B(a=1, b=2, c=3)
print('A OOD hp: %d %d %s' % (bb.a, bb.b, not hasattr(bb, 'c')))
chk('A OOD hp prints 1 2 True', bb.a == 1 and bb.b == 2 and not hasattr(bb, 'c'))

# ---------------- ch3.l2: synthetic data + from-scratch SGD ----------------
def lcg(seed):
    state = seed
    while True:
        state = (1664525 * state + 1013904223) % 4294967296
        yield state / 4294967296.0

def synth_data(n, w_true, b_true, noise, seed):
    gen = lcg(seed)
    def nxt():
        return next(gen)
    X, y = [], []
    for _ in range(n):
        x1 = nxt()*2 - 1
        x2 = nxt()*2 - 1
        eps = (nxt()*2 - 1) * noise
        X.append([x1, x2])
        y.append(w_true[0]*x1 + w_true[1]*x2 + b_true + eps)
    return X, y

g = lcg(0)
u = [next(g) for _ in range(6)]
print('B lcg(0) first 6 u:', ['%.10f' % v for v in u])
chk('B lcg u1', abs(u[0] - 1013904223/4294967296) < 1e-15)

n, w_true, b_true, noise = 64, [2.0, -3.4], 4.2, 0.01
X, y = synth_data(n, w_true, b_true, noise, 7)
batch = 16
num_batches = n // batch
print('B: n=%d batches=%d first row [%.4f, %.4f] label %.4f' % (n, num_batches, X[0][0], X[0][1], y[0]))
print('B: y[0] exact =', repr(y[0]))

def train(X, y, epochs, lr, batch):
    w = [0.0, 0.0]; bias = 0.0
    for _ in range(epochs):
        for s in range(0, len(X), batch):
            idx = range(s, min(s+batch, len(X)))
            errs = [sum(w[j]*X[i][j] for j in range(2)) + bias - y[i] for i in idx]
            gw = [sum(X[i][j]*errs[k] for k, i in enumerate(idx))/len(idx) for j in range(2)]
            gb = sum(errs)/len(idx)
            w = [w[j] - lr*gw[j] for j in range(2)]
            bias -= lr*gb
    return w, bias

for epochs, lr in [(10, 0.1), (10, 0.2), (20, 0.2), (10, 0.3), (20, 0.3), (30, 0.2)]:
    w, bias = train(X, y, epochs, lr, batch)
    errs = [sum(w[j]*X[i][j] for j in range(2)) + bias - y[i] for i in range(n)]
    mse = sum(e*e for e in errs)/n
    print('B train epochs=%d lr=%.2f -> w=[%.4f, %.4f] b=%.4f mse=%.6f ew=[%.4f, %.4f] eb=%.4f'
          % (epochs, lr, w[0], w[1], bias, mse, w[0]-w_true[0], w[1]-w_true[1], bias-b_true))

w, bias = train(X, y, 20, 0.3, batch)
errs = [sum(w[j]*X[i][j] for j in range(2)) + bias - y[i] for i in range(n)]
mse = sum(e*e for e in errs)/n
print('B chosen: w=[%.6f, %.6f] b=%.6f mse=%.6f' % (w[0], w[1], bias, mse))
print('B errors: w_err=[%.4f, %.4f] b_err=%.4f' % (w[0]-2.0, w[1]+3.4, bias-4.2))
chk('B converges (|ew|,|eb| < 0.05)', abs(w[0]-2.0) < 0.05 and abs(w[1]+3.4) < 0.05 and abs(bias-4.2) < 0.05)
b0 = [X[i] for i in range(0, 2)]
chk('B slice', b0 == X[0:2] and len(b0) == 2)

# ---------------- ch3.l3: weight decay high-dim ----------------
def synth_highdim(n_train, n_val, d, noise, seed):
    gen = lcg(seed)
    def nxt():
        return next(gen)
    def make(n):
        return [[nxt()*2 - 1 for _ in range(d)] for _ in range(n)]
    Xtr, Xva = make(n_train), make(n_val)
    ytr = [0.05 + 0.01*sum(r) + (nxt()*2 - 1)*noise for r in Xtr]
    yva = [0.05 + 0.01*sum(r) + (nxt()*2 - 1)*noise for r in Xva]
    return Xtr, ytr, Xva, yva

def train_wd(Xtr, ytr, Xva, yva, epochs, lr, lambd):
    d = len(Xtr[0])
    w = [0.0]*d; bias = 0.0
    n = len(Xtr)
    for _ in range(epochs):
        errs = [sum(w[j]*Xtr[i][j] for j in range(d)) + bias - ytr[i] for i in range(n)]
        for j in range(d):
            gw = sum(Xtr[i][j]*errs[i] for i in range(n))/n
            w[j] = (1 - lr*lambd)*w[j] - lr*gw
        gb = sum(errs)/n
        bias -= lr*gb
    def mse(X, y):
        es = [sum(w[j]*X[i][j] for j in range(d)) + bias - y[i] for i in range(len(X))]
        return sum(e*e for e in es)/len(X)
    l2 = sum(v*v for v in w)/2
    return mse(Xtr, ytr), mse(Xva, yva), l2

for epochs, lr in [(50, 0.05), (100, 0.05), (150, 0.05), (100, 0.08)]:
    tr0, va0, l20 = train_wd(*synth_highdim(20, 100, 200, 0.01, 11), epochs, lr, 0.0)
    tr3, va3, l23 = train_wd(*synth_highdim(20, 100, 200, 0.01, 11), epochs, lr, 3.0)
    print('C wd epochs=%d lr=%.2f | none: tr=%.6f va=%.6f l2=%.6f | lam3: tr=%.6f va=%.6f l2=%.6f'
          % (epochs, lr, tr0, va0, l20, tr3, va3, l23))

tr0, va0, l20 = train_wd(*synth_highdim(20, 100, 200, 0.01, 11), 100, 0.05, 0.0)
tr3, va3, l23 = train_wd(*synth_highdim(20, 100, 200, 0.01, 11), 100, 0.05, 3.0)
chk('C story: no-reg overfits (va0 > va3)', va0 > va3)
chk('C story: decay shrinks norm (l23 < l20)', l23 < l20)
chk('C story: decay raises train err (tr3 > tr0)', tr3 > tr0)
chk('C l2_penalty([2,1])=2.5', abs((4.0+1.0)/2 - 2.5) < 1e-12)
wv = [2.0, 1.0]; lr = 0.1; lam = 3.0
wnew = [(1 - lr*lam)*v for v in wv]
print('C decay step:', wnew)
chk('C decay step ~ [1.4,0.7]', abs(wnew[0]-1.4) < 1e-9 and abs(wnew[1]-0.7) < 1e-9)
wv2 = [2.0, 1.0]; gw = [1.0, 0.0]; lr = 0.1; lam = 1.0
wnew2 = [(1 - lr*lam)*wv2[j] - lr*gw[j] for j in range(2)]
print('C decay step2:', wnew2)
chk('C decay step2 ~ [1.7,0.9]', abs(wnew2[0]-1.7) < 1e-9 and abs(wnew2[1]-0.9) < 1e-9)
chk('C numeric l2 [0.5,-0.25,1.5] = 1.28125', abs((0.25+0.0625+2.25)/2 - 1.28125) < 1e-12)

# ---------------- ch4.l1: softmax + cross-entropy ----------------
def stable_softmax(row):
    m = max(row)
    exps = [math.exp(v - m) for v in row]
    s = sum(exps)
    return [e/s for e in exps]

logits = [[2.0, 1.0, 0.1], [1.0, 3.0, 0.5]]
probs = [stable_softmax(r) for r in logits]
print('D logits:', logits)
print('D probs:', [['%.4f' % p for p in r] for r in probs], 'sums', ['%.1f' % sum(r) for r in probs])
big = [802.0, 801.0, 800.1]
pb = stable_softmax(big)
print('D stable big:', ['%.4f' % p for p in pb], 'sum=%.1f' % sum(pb))
chk('D stable big works, sums 1', sum(pb) > 0.999999 and pb[0] > pb[1] > pb[2])
y = [0, 2]
y_hat = [[0.1, 0.3, 0.6], [0.3, 0.2, 0.5]]
picked = [y_hat[i][y[i]] for i in range(len(y))]
ce = -sum(math.log(p) for p in picked)/len(y)
print('D picked:', picked, 'ce=%.10f' % ce)
chk('D ce = 1.4978661367769954', abs(ce - 1.4978661367769954) < 1e-12)
def argmax(row):
    best = 0
    for j in range(1, len(row)):
        if row[j] > row[best]: best = j
    return best
preds = [argmax(r) for r in y_hat]
acc = sum(1 for i in range(len(y)) if preds[i] == y[i])/len(y)
print('D preds:', preds, 'acc=%.1f' % acc)
chk('D acc=0.5', acc == 0.5)
chk('D softmax([1000]*3) = 1/3s', all(abs(p - 1/3) < 1e-9 for p in stable_softmax([1000.0]*3)))
p10 = stable_softmax([1.0, 0.0])
chk('D softmax([1,0])', abs(p10[0]-0.7310585786300049) < 1e-12 and abs(p10[1]-0.2689414213699951) < 1e-12)
p00 = stable_softmax([0.0, 0.0, 0.0])
chk('D softmax([0,0,0]) uniform', all(abs(p-1/3) < 1e-9 for p in p00))
d = [probs[0][j] - [1.0, 0.0, 0.0][j] for j in range(3)]
print('D dL/do row0 =', ['%.6f' % v for v in d])

# ---------------- ch4.l2: hand forward + accuracy ----------------
W = [[0.3, -0.1, 0.0],
     [0.0, 0.4, -0.2],
     [0.2, 0.0, 0.5],
     [-0.1, 0.3, 0.1]]
bias = [0.0, 0.1, -0.1]
def forward(x):
    return [sum(x[i]*W[i][j] for i in range(4)) + bias[j] for j in range(3)]
x1 = [1.0, 2.0, 0.5, 1.5]
x2 = [0.5, 1.0, 2.0, 0.5]
o1, o2 = forward(x1), forward(x2)
print('E logits x1:', o1, 'x2:', o2)
p1, p2 = stable_softmax(o1), stable_softmax(o2)
print('E probs x1:', ['%.4f' % p for p in p1])
print('E probs x2:', ['%.4f' % p for p in p2])
preds = [argmax(p1), argmax(p2)]
ylab = [0, 2]
acc = sum(1 for i in range(2) if preds[i] == ylab[i])/2
ce = -sum(math.log([p1, p2][i][ylab[i]]) for i in range(2))/2
print('E preds:', preds, 'y:', ylab, 'acc=%.1f' % acc, 'ce=%.6f' % ce)
print('E ce terms:', ['%.6f' % -math.log([p1, p2][i][ylab[i]]) for i in range(2)])
chk('E preds [1,2] y [0,2] acc 0.5', preds == [1, 2] and acc == 0.5)
print('E params: %d weights + %d biases = %d' % (4*3, 3, 4*3+3))
chk('E accuracy asserts', abs(sum(1 for i in range(2) if [argmax([0.9,0.05,0.05]), argmax([0.1,0.8,0.1])][i] == [0,1][i])/2 - 1.0) < 1e-15
    and abs(sum(1 for i in range(2) if [argmax([0.9,0.05,0.05]), argmax([0.1,0.8,0.1])][i] == [0,2][i])/2 - 0.5) < 1e-15)
chk('E pick_probs', [y_hat[i][[0,2][i]] for i in range(2)] == [0.1, 0.5])
chk('E params 7850', 784*10 + 10 == 7850)

# ---------------- ch4.l3: test-set size + importance weights ----------------
t, delta = 0.01, 0.05
n_hoeff = math.log(1.0/delta)/(2.0*t*t)
print('F hoeffding raw = %.10f ceil = %d' % (n_hoeff, math.ceil(n_hoeff)))
chk('F hoeffding 14979', math.ceil(n_hoeff) == 14979)
t2 = 0.02
n2 = math.log(1.0/delta)/(2.0*t2*t2)
print('F hoeffding t=0.02 raw = %.10f ceil = %d' % (n2, math.ceil(n2)))
chk('F hoeffding 3745', math.ceil(n2) == 3745)
n_clt = (1.0/t)**2
print('F clt n = %.1f' % n_clt)
chk('F clt 10000', n_clt == 10000.0)
q = [0.5, 0.3, 0.2]; p = [0.2, 0.3, 0.5]
beta = [p[i]/q[i] for i in range(3)]
print('F beta:', beta)
chk('F beta [0.4,1.0,2.5]', all(abs(beta[i]-[0.4,1.0,2.5][i]) < 1e-12 for i in range(3)))
losses = [1.0, 0.5, 0.2]
r_un = sum(losses)/3
r_w = sum(beta[i]*losses[i] for i in range(3))/3
print('F risk unweighted=%.10f weighted=%.10f' % (r_un, r_w))
chk('F risks', abs(r_un - 0.5666666666666667) < 1e-12 and abs(r_w - 0.4666666666666667) < 1e-12)

# ---------------- ch5.l1: MLP forward + collapse + activations ----------------
W1 = [[1.0, -1.0], [0.5, 2.0]]
b1 = [0.0, 1.0]
W2 = [1.0, 3.0]
b2 = -1.0
def relu(v): return [max(0.0, x) for x in v]
def mlp_forward(x):
    z = [sum(x[i]*W1[i][j] for i in range(2)) + b1[j] for j in range(2)]
    h = relu(z)
    return sum(h[i]*W2[i] for i in range(2)) + b2
x = [2.0, 1.0]
z = [sum(x[i]*W1[i][j] for i in range(2)) + b1[j] for j in range(2)]
h = relu(z)
o = mlp_forward(x)
print('G z:', z, 'h:', h, 'o:', o)
chk('G o=4.5 at [2,1]', abs(o-4.5) < 1e-12)
chk('G o([0,0])=2.0', abs(mlp_forward([0.0, 0.0])-2.0) < 1e-12)
xn = [0.0, -2.0]
zn = [sum(xn[i]*W1[i][j] for i in range(2)) + b1[j] for j in range(2)]
hn = relu(zn)
on = sum(hn[i]*W2[i] for i in range(2)) + b2
on_nc = sum(zn[i]*W2[i] for i in range(2)) + b2
print('G x=[0,-2]: z:', zn, 'h:', hn, 'o(relu)=%.1f o(no-act)=%.1f' % (on, on_nc))
chk('G relu vs no-act at [0,-2]', abs(on+1.0) < 1e-12 and abs(on_nc+11.0) < 1e-12)
z_nc = [sum(x[i]*W1[i][j] for i in range(2)) + b1[j] for j in range(2)]
o_nc = sum(z_nc[i]*W2[i] for i in range(2)) + b2
Wc = [sum(W1[i][k]*W2[k] for k in range(2)) for i in range(2)]
bc = sum(b1[k]*W2[k] for k in range(2)) + b2
o_c = sum(x[i]*Wc[i] for i in range(2)) + bc
print('G collapsed W:', Wc, 'b:', bc, 'o_nc=%.1f o_c=%.1f' % (o_nc, o_c))
chk('G collapse equal', abs(o_nc-o_c) < 1e-12 and abs(o_nc-4.5) < 1e-12)
xs5 = [-2.0, -1.0, 0.0, 1.0, 2.0]
relu_v = relu(xs5)
sig_v = [1/(1+math.exp(-v)) for v in xs5]
tanh_v = [math.tanh(v) for v in xs5]
print('G relu:', relu_v)
print('G sig:', ['%.4f' % v for v in sig_v], 'exact:', [repr(v) for v in sig_v])
print('G tanh:', ['%.4f' % v for v in tanh_v])
s0 = 1/(1+math.exp(0.0)); s4 = 1/(1+math.exp(-4.0))
print('G sigmoid grad @0=%.4f @4=%.10f' % (s0*(1-s0), s4*(1-s4)))
chk('G sig grad@0 = 0.25', abs(s0*(1-s0)-0.25) < 1e-15)
print('G params: W1 2x2 + b1 2 + W2 2 + b2 1 =', 4+2+2+1)

# ---------------- ch5.l2: backprop + init ----------------
x = [1.0, 2.0]
W1 = [[0.1, 0.3], [0.2, 0.4]]
W2 = [[0.5, -0.25]]
lam = 0.1
yv = 0.0
z = [sum(W1[i][j]*x[j] for j in range(2)) for i in range(2)]
h = relu(z)
o = sum(W2[0][i]*h[i] for i in range(2))
L = 0.5*(o-yv)**2
s = lam/2 * (sum(v*v for row in W1 for v in row) + sum(v*v for v in W2[0]))
J = L + s
print('H z:', z, 'h:', h, 'o:', o, 'L:', L, 's:', s, 'J:', J)
dJ_do = o - yv
dW2 = [dJ_do*h[i] + lam*W2[0][i] for i in range(2)]
dJ_dh = [W2[0][i]*dJ_do for i in range(2)]
dJ_dz = dJ_dh
dW1 = [[dJ_dz[i]*x[j] + lam*W1[i][j] for j in range(2)] for i in range(2)]
print('H dJ/do:', dJ_do, 'dW2:', dW2, 'dJ/dh:', dJ_dh, 'dW1:', dW1)
chk('H o=0.1', abs(o-0.1) < 1e-12)
chk('H L=0.005 s=0.030625 J=0.035625', abs(L-0.005) < 1e-15 and abs(s-0.030625) < 1e-15 and abs(J-0.035625) < 1e-15)
chk('H dW2 ~ [0.12,0.075]', abs(dW2[0]-0.12) < 1e-9 and abs(dW2[1]-0.075) < 1e-9)
chk('H dW1 ~ [[0.06,0.13],[-0.005,-0.01]]', abs(dW1[0][0]-0.06) < 1e-9 and abs(dW1[0][1]-0.13) < 1e-9
    and abs(dW1[1][0]+0.005) < 1e-9 and abs(dW1[1][1]+0.01) < 1e-9)
xb = 784+10
xav = math.sqrt(6.0/xb)
print('H xavier 784->10: 6/794=%.15f sqrt=%.15f' % (6.0/xb, xav))
f5 = 0.25**5
print('H 0.25^5 =', f5, '0.9^100 = %.6e' % (0.9**100), '1.1^100 = %.4f' % (1.1**100))
chk('H 0.25^5 = 1/1024', abs(f5 - 0.0009765625) < 1e-18)
chk('H relu_grad', [1.0 if v > 0 else 0.0 for v in [-1.0, 0.0, 2.0]] == [0.0, 0.0, 1.0])

# ---------------- ch5.l3: dropout + preprocessing + log-rmse ----------------
def dropout(h, mask, p):
    if p == 1: return [0.0]*len(h)
    return [h[i]*mask[i]/(1.0-p) for i in range(len(h))]
h = [3.0, 1.0, 2.0, 4.0]
mask = [1, 0, 1, 1]
print('I dropout p=0.5:', dropout(h, mask, 0.5), 'p=0:', dropout(h, mask, 0.0), 'p=1:', dropout(h, mask, 1.0))
chk('I dropout [6,0,4,8]', dropout(h, mask, 0.5) == [6.0, 0.0, 4.0, 8.0])
rooms = [2.0, None, 4.0, None]
known = [v for v in rooms if v is not None]
mean_r = sum(known)/len(known)
filled = [v if v is not None else mean_r for v in rooms]
mu = sum(filled)/4
var = sum((v-mu)**2 for v in filled)/3
sd = math.sqrt(var)
stdz = [(v-mu)/sd for v in filled]
print('I filled:', filled, 'mu=%.1f sd=%.10f' % (mu, sd))
print('I standardized:', ['%.4f' % v for v in stdz])
chk('I sd = sqrt(2/3)', abs(sd - math.sqrt(2.0/3.0)) < 1e-12)
chk('I stdz[0] ~ -1.2247', abs(stdz[0] + 1.2247448713915892) < 1e-9)
zones = ['RL', 'RM', 'RL', 'RH']
cats = ['RL', 'RM', 'RH']
onehot = [[1.0 if z == c else 0.0 for c in cats] for z in zones]
print('I cats:', cats, 'onehot:', onehot)
chk('I onehot rows', onehot == [[1.0,0.0,0.0],[0.0,1.0,0.0],[1.0,0.0,0.0],[0.0,0.0,1.0]])
def rms_log_error(y, yh):
    n = len(y)
    return math.sqrt(sum((math.log(y[i]) - math.log(yh[i]))**2 for i in range(n))/n)
y = [208500.0, 181500.0]; yh = [200000.0, 190000.0]
r = rms_log_error(y, yh)
print('I rms_log = %.10f' % r)
print('I per-term:', ['%.6f' % (math.log(y[i]/yh[i])) for i in range(2)])
chk('I rms equal = 0', rms_log_error([100.0, 200.0], [100.0, 200.0]) == 0.0)
print()
print('ALL OK' if ok else 'SOME FAILURES')

# chosen-config literal dump for ch3.l2 (epochs=20, lr=0.3) epoch checkpoints
X, y = synth_data(64, [2.0, -3.4], 4.2, 0.01, 7)
w = [0.0, 0.0]; bias = 0.0; lr = 0.3; batch = 16
for ep in range(20):
    for s0 in range(0, 64, batch):
        idx = range(s0, s0+batch)
        errs = [sum(w[j]*X[i][j] for j in range(2)) + bias - y[i] for i in idx]
        gw = [sum(X[i][j]*errs[k] for k, i in enumerate(idx))/batch for j in range(2)]
        gb = sum(errs)/batch
        w = [w[j] - lr*gw[j] for j in range(2)]
        bias -= lr*gb
    if ep in (0, 4, 9, 19):
        es = [sum(w[j]*X[i][j] for j in range(2)) + bias - y[i] for i in range(64)]
        print('B epoch %02d: mse=%.6f w=[%.6f, %.6f] b=%.6f' % (ep+1, sum(e*e for e in es)/64, w[0], w[1], bias))
