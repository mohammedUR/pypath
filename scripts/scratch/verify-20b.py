#!/usr/bin/env python3
"""Task 20-b pre-write verification: every literal that will be printed or asserted
in the 7 new D2L lessons (ch5.l2/l3, ch7.l2/l3, ch8.l1/l2/l3)."""
import math

ok = 0

def check(name, cond, detail=''):
    global ok
    assert cond, 'FAILED: %s %s' % (name, detail)
    ok += 1
    print('VERIFIED %-42s %s' % (name, detail))

# ============ ch5.l2: forward/backward + numerical stability ============
def sigmoid(v):
    return 1.0 / (1.0 + math.exp(-v))

x = [1.0, -2.0]
W1 = [[1.0, -0.5], [0.25, 2.0]]
W2 = [1.0, -1.0]
y = 1.0
lam = 0.1

z = [sum(W1[i][j] * x[j] for j in range(2)) for i in range(2)]
h = [sigmoid(v) for v in z]
o = sum(W2[i] * h[i] for i in range(2))
L = 0.5 * (o - y) ** 2
norm1 = sum(w * w for row in W1 for w in row)
norm2 = sum(w * w for w in W2)
s = 0.5 * lam * (norm1 + norm2)
J = L + s
check('c5l2 z', z == [2.0, -3.75], str(z))
check('c5l2 h', ['%.4f' % v for v in h] == ['0.8808', '0.0230'], str(['%.4f' % v for v in h]))
check('c5l2 o', abs(o - 0.8578197081) < 1e-9, '%.10f' % o)
check('c5l2 L', abs(L - 0.010108) < 1e-6, '%.6f' % L)
check('c5l2 s', abs(s - 0.365625) < 1e-12, '%.6f' % s)
check('c5l2 J', abs(J - 0.375733) < 1e-6, '%.6f' % J)

dJ_do = o - y
check('c5l2 dJ/do', abs(dJ_do + 0.1421802919) < 1e-9, '%.10f' % dJ_do)
dW2 = [dJ_do * h[i] + lam * W2[i] for i in range(2)]
check('c5l2 dW2', ['%.4f' % v for v in dW2] == ['-0.0252', '-0.1033'], str(['%.6f' % v for v in dW2]))
dJ_dz = [W2[i] * dJ_do * h[i] * (1 - h[i]) for i in range(2)]
check('c5l2 dJ/dz', ['%.4f' % v for v in dJ_dz] == ['-0.0149', '0.0032'], str(['%.6f' % v for v in dJ_dz]))
dW1 = [[dJ_dz[i] * x[j] + lam * W1[i][j] for j in range(2)] for i in range(2)]
flat = [dW1[i][j] for i in range(2) for j in range(2)]
check('c5l2 dW1', ['%.4f' % v for v in flat] == ['0.0851', '-0.0201', '0.0282', '0.1936'], str(['%.6f' % v for v in flat]))

# numerical gradient check (test t3)
def J_of(W1_, W2_):
    z_ = [sum(W1_[i][j] * x[j] for j in range(2)) for i in range(2)]
    h_ = [sigmoid(v) for v in z_]
    o_ = sum(W2_[i] * h_[i] for i in range(2))
    n1_ = sum(w * w for row in W1_ for w in row)
    n2_ = sum(w * w for w in W2_)
    return 0.5 * (o_ - y) ** 2 + 0.5 * lam * (n1_ + n2_)

eps = 1e-6
for i in range(2):
    for j in range(2):
        Wp = [row[:] for row in W1]; Wp[i][j] += eps
        Wm = [row[:] for row in W1]; Wm[i][j] -= eps
        num = (J_of(Wp, W2) - J_of(Wm, W2)) / (2 * eps)
        check('c5l2 numgrad W1[%d][%d]' % (i, j), abs(num - dW1[i][j]) < 1e-6, 'num=%.8f ana=%.8f' % (num, dW1[i][j]))
for i in range(2):
    Wp = W2[:]; Wp[i] += eps
    Wm = W2[:]; Wm[i] -= eps
    num = (J_of(W1, Wp) - J_of(W1, Wm)) / (2 * eps)
    check('c5l2 numgrad W2[%d]' % i, abs(num - dW2[i]) < 1e-6, 'num=%.8f ana=%.8f' % (num, dW2[i]))

# Xavier + vanishing product
check('c5l2 xavier g(2,2)', abs(math.sqrt(2.0 / 4.0) - 0.7071067811865476) < 1e-12, '%.4f' % math.sqrt(2.0 / 4.0))
check('c5l2 xavier g(2,1)', abs(math.sqrt(2.0 / 3.0) - 0.816496580927726) < 1e-12, '%.4f' % math.sqrt(2.0 / 3.0))
check('c5l2 xavier u(2,2)', abs(math.sqrt(6.0 / 4.0) - 1.224744871391589) < 1e-12, '%.4f' % math.sqrt(6.0 / 4.0))
check('c5l2 xavier u(100,200)', abs(math.sqrt(6.0 / 300.0) - 0.1414213562373095) < 1e-15, repr(math.sqrt(6.0 / 300.0)))
g = [sigmoid(4.0) * (1 - sigmoid(4.0)), sigmoid(-4.0) * (1 - sigmoid(-4.0)),
     sigmoid(3.0) * (1 - sigmoid(3.0)), sigmoid(-3.0) * (1 - sigmoid(-3.0))]
check('c5l2 sig grads', ['%.4f' % v for v in g] == ['0.0177', '0.0177', '0.0452', '0.0452'], str(['%.6f' % v for v in g]))
prod = 1.0
for v in g:
    prod *= v
check('c5l2 sig product', abs(prod - 6.3668e-07) < 1e-10, '%.3e' % prod)
check('c5l2 0.25^5', abs(0.25 ** 5 - 0.0009765625) < 1e-15, '%.10f' % (0.25 ** 5))

# ============ ch5.l3: dropout + standardize + folds ============
h0 = [1.0, 2.0, 3.0, 4.0, 5.0]
p = 0.4
keep = [0, 1, 1, 0, 1]
dropped = [0.0 if k == 0 else v / (1.0 - p) for k, v in zip(keep, h0)]
check('c5l3 dropout', ['%.4f' % v for v in dropped] == ['0.0000', '3.3333', '5.0000', '0.0000', '8.3333'], str(['%.4f' % v for v in dropped]))
expect = [(1.0 - p) * (v / (1.0 - p)) for v in h0]
check('c5l3 E[h]', expect == h0, str(expect))

xs = [65.0, 80.0, 68.0, 60.0]
mu = sum(xs) / len(xs)
sd = (sum((v - mu) ** 2 for v in xs) / (len(xs) - 1)) ** 0.5
zs = [(v - mu) / sd for v in xs]
check('c5l3 mean', abs(mu - 68.25) < 1e-12, '%.2f' % mu)
check('c5l3 sd', abs(sd - 8.5) < 1e-12, '%.4f' % sd)
check('c5l3 z', ['%.4f' % v for v in zs] == ['-0.3824', '1.3824', '-0.0294', '-0.9706'], str(zs))
check('c5l3 z0 repr', abs(zs[0] + 0.38235294117647056) < 1e-15, repr(zs[0]))

zone = ['RL', 'RM', 'RL', 'RL']
cols = sorted(set(zone))
oh = [[1 if v == c else 0 for c in cols] for v in zone]
check('c5l3 onehot', cols == ['RL', 'RM'] and oh == [[1, 0], [0, 1], [1, 0], [1, 0]], str(oh))

k = 5
size = 10 // k
folds = [list(range(j * size, (j + 1) * size)) for j in range(k)]
check('c5l3 folds', folds == [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]], str(folds))

check('c5l3 logerr', abs(math.log(250000.0 / 208500.0) - 0.181522) < 1e-6, '%.6f' % math.log(250000.0 / 208500.0))
check('c5l3 survivor', abs(10.0 / (1.0 - 0.2) - 12.5) < 1e-12, '%.2f' % (10.0 / 0.8))

# ============ ch7.l2: padding/stride/channels ============
def pad(X, ph, pw):
    nh, nw = len(X), len(X[0])
    top, bottom = ph // 2, ph - ph // 2
    left, right = pw // 2, pw - pw // 2
    out = [[0.0] * (nw + pw) for _ in range(nh + ph)]
    for i in range(nh):
        for j in range(nw):
            out[i + top][j + left] = X[i][j]
    return out

def conv2d(X, K, ph=0, pw=0, sh=1, sw=1):
    kh, kw = len(K), len(K[0])
    XP = pad(X, ph, pw) if (ph or pw) else X
    nh, nw = len(XP), len(XP[0])
    return [[sum(XP[i + a][j + b] * K[a][b] for a in range(kh) for b in range(kw))
             for j in range(0, nw - kw + 1, sw)]
            for i in range(0, nh - kh + 1, sh)]

def out_shape(n, k, p=0, s=1):
    return (n - k + p + s) // s

X3 = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]
K2 = [[0.0, 1.0], [2.0, 3.0]]
Yp = conv2d(X3, K2, ph=2, pw=2)
check('c7l2 pad 4x4', (len(Yp), len(Yp[0])) == (4, 4) and Yp[0][0] == 0.0, '%dx%d topleft=%s' % (len(Yp), len(Yp[0]), Yp[0][0]))
check('c7l2 same-size', out_shape(8, 3, 2) == 8 and out_shape(8, 5, 4) == 8, '%d %d' % (out_shape(8, 3, 2), out_shape(8, 5, 4)))
check('c7l2 stride half', out_shape(8, 3, 2, 2) == 4, '%d' % out_shape(8, 3, 2, 2))
check('c7l2 book ex', out_shape(8, 5, 2, 4) == 2 and out_shape(8, 3, 0, 3) == 2, '%d %d' % (out_shape(8, 5, 2, 4), out_shape(8, 3, 0, 3)))
X4g = [[float(r * 4 + c) for c in range(4)] for r in range(4)]
Ys = conv2d(X4g, K2, sh=2, sw=2)
Yd = [[sum(X4g[i + a][j + b] * K2[a][b] for a in range(2) for b in range(2)) for j in (0, 2)] for i in (0, 2)]
check('c7l2 stride==sample', Ys == Yd, str(Ys))
X8 = [[float(r * 8 + c) for c in range(8)] for r in range(8)]
Ya = conv2d(X8, [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]], ph=2, pw=2)
check('c7l2 8x8 same', (len(Ya), len(Ya[0])) == (8, 8), '%dx%d' % (len(Ya), len(Ya[0])))
Yb = conv2d(X8, [[1.0] * 3 for _ in range(3)], ph=2, pw=2, sh=2, sw=2)
check('c7l2 8x8 half', (len(Yb), len(Yb[0])) == (4, 4), '%dx%d' % (len(Yb), len(Yb[0])))
Yc = conv2d(X8, [[1.0] * 5 for _ in range(3)], ph=0, pw=4, sh=3, sw=4)
check('c7l2 book 2x2', (len(Yc), len(Yc[0])) == (2, 2), '%dx%d' % (len(Yc), len(Yc[0])))

def corr2d_multi_in(X, K):
    ci, kh, kw = len(K), len(K[0]), len(K[0][0])
    nh, nw = len(X[0]), len(X[0][0])
    Y = [[0.0] * (nw - kw + 1) for _ in range(nh - kh + 1)]
    for i in range(len(Y)):
        for j in range(len(Y[0])):
            Y[i][j] = sum(X[c][i + a][j + b] * K[c][a][b]
                          for c in range(ci) for a in range(kh) for b in range(kw))
    return Y

Xc = [[[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]],
      [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]]]
Kc = [[[0.0, 1.0], [2.0, 3.0]], [[1.0, 2.0], [3.0, 4.0]]]
Ym = corr2d_multi_in(Xc, Kc)
check('c7l2 multi_in', Ym == [[56.0, 72.0], [104.0, 120.0]], str(Ym))
K3 = [Kc, [[[v + 1.0 for v in row] for row in ch] for ch in Kc],
      [[[v + 2.0 for v in row] for row in ch] for ch in Kc]]
Yo = [corr2d_multi_in(Xc, k) for k in K3]
check('c7l2 multi_out', Yo[1] == [[76.0, 100.0], [148.0, 172.0]] and Yo[2] == [[96.0, 128.0], [192.0, 224.0]], str(Yo[1]) + ' ' + str(Yo[2]))

def conv1x1(X, W):
    co, ci = len(W), len(W[0])
    h, w = len(X[0]), len(X[0][0])
    return [[[sum(W[o][c] * X[c][i][j] for c in range(ci)) for j in range(w)] for i in range(h)] for o in range(co)]

W1x1 = [[0.5, -1.0, 2.0], [1.0, 0.0, 0.5]]
Xr = [[[1.0, 2.0], [3.0, 4.0]], [[5.0, 6.0], [7.0, 8.0]], [[9.0, 1.0], [2.0, 3.0]]]
K1x1 = []
for orow in W1x1:
    k = []
    for w in orow:
        k.append([[w]])   # per input channel: 1x1 spatial kernel
    K1x1.append(k)
Yfc = conv1x1(Xr, W1x1)
Ycv = [corr2d_multi_in(Xr, k) for k in K1x1]
check('c7l2 1x1==fc', Yfc == Ycv, 'match=%s' % (Yfc == Ycv))
check('c7l2 1x1 params', 2 * 3 == 6, 'co*ci=6')
ops = 256 * 256 * 5 * 5 * 128 * 128
check('c7l2 ops', ops == 26843545600 and 2 * ops > 53 * 10 ** 9, '%d' % ops)

# ============ ch7.l3: pooling + LeNet ============
def pad_grid(X, p):
    nh, nw = len(X), len(X[0])
    out = [[0.0] * (nw + 2 * p) for _ in range(nh + 2 * p)]
    for i in range(nh):
        for j in range(nw):
            out[i + p][j + p] = X[i][j]
    return out

def pool2d(X, ph, pw, mode='max', pad=0, stride=1):
    XP = pad_grid(X, pad) if pad else X
    nh, nw = len(XP), len(XP[0])
    Y = []
    for i in range(0, nh - ph + 1, stride):
        row = []
        for j in range(0, nw - pw + 1, stride):
            win = [XP[i + a][j + b] for a in range(ph) for b in range(pw)]
            row.append(max(win) if mode == 'max' else sum(win) / len(win))
        Y.append(row)
    return Y

X3 = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]
check('c7l3 max', pool2d(X3, 2, 2) == [[4.0, 5.0], [7.0, 8.0]], str(pool2d(X3, 2, 2)))
check('c7l3 avg', pool2d(X3, 2, 2, 'avg') == [[2.0, 3.0], [5.0, 6.0]], str(pool2d(X3, 2, 2, 'avg')))
X4 = [[float(r * 4 + c) for c in range(4)] for r in range(4)]
Y4 = pool2d(X4, 3, 3, pad=1, stride=2)
check('c7l3 pad/stride', Y4 == [[5.0, 7.0], [13.0, 15.0]], str(Y4))
check('c7l3 stride=window', pool2d(X4, 3, 3, stride=3) == [[10.0]], str(pool2d(X4, 3, 3, stride=3)))
check('c7l3 channels separate', pool2d([[v + 1.0 for v in row] for row in X4], 3, 3, pad=1, stride=2) == [[6.0, 8.0], [14.0, 16.0]], 'ok')

def conv_out(n, k, p=0, s=1):
    return (n - k + 2 * p) // s + 1

n1 = conv_out(28, 5, p=2)
p1 = n1 // 2
n2 = conv_out(p1, 5)
p2 = n2 // 2
check('c7l3 lenet trace', (n1, p1, n2, p2, 16 * p2 * p2) == (28, 14, 10, 5, 400), str((n1, p1, n2, p2, 16 * p2 * p2)))

def conv_params(co, ci, k):
    return co * (ci * k * k + 1)
def fc_params(nout, nin):
    return nout * (nin + 1)
total = conv_params(6, 1, 5) + conv_params(16, 6, 5) + fc_params(120, 400) + fc_params(84, 120) + fc_params(10, 84)
check('c7l3 lenet params', (conv_params(6, 1, 5), conv_params(16, 6, 5), fc_params(120, 400), fc_params(84, 120), fc_params(10, 84)) == (156, 2416, 48120, 10164, 850) and total == 61706, 'total=%d' % total)
TRACE_C7L3 = ('conv1 -> 6 x %d x %d\npool1 -> 6 x %d x %d\nconv2 -> 16 x %d x %d\npool2 -> 16 x %d x %d\nflatten -> %d'
              % (n1, n1, p1, p1, n2, n2, p2, p2, 16 * p2 * p2))
check('c7l3 trace text', TRACE_C7L3.splitlines()[-1] == 'flatten -> 400', repr(TRACE_C7L3.splitlines()[-1]))

# ============ ch8.l1: AlexNet + VGG + NiN ============
def conv_out(n, k, p=0, s=1):
    return (n - k + 2 * p) // s + 1
def pool_out(n, k, s=1):
    return (n - k) // s + 1
a = conv_out(224, 11, p=1, s=4)
check('c8l1 alex conv1', a == 54, '%d' % a)
a = pool_out(a, 3, 2); check('c8l1 alex pool1', a == 26, '%d' % a)
a = conv_out(a, 5, p=2); check('c8l1 alex conv2', a == 26, '%d' % a)
a = pool_out(a, 3, 2); check('c8l1 alex pool2', a == 12, '%d' % a)
a = conv_out(a, 3, p=1); check('c8l1 alex conv3-5', a == 12, '%d' % a)
a = pool_out(a, 3, 2); check('c8l1 alex pool3', a == 5, '%d' % a)
check('c8l1 alex flatten', 256 * a * a == 6400, '%d' % (256 * a * a))
def conv_params(co, ci, k):
    return co * (ci * k * k + 1)
def fc_params(nout, nin):
    return nout * (nin + 1)
alex_conv = conv_params(96, 1, 11) + conv_params(256, 96, 5) + conv_params(384, 256, 3) + conv_params(384, 384, 3) + conv_params(256, 384, 3)
alex_fc = fc_params(4096, 6400) + fc_params(4096, 4096) + fc_params(10, 4096)
check('c8l1 alex params', (conv_params(96, 1, 11), conv_params(256, 96, 5), conv_params(384, 256, 3), conv_params(384, 384, 3), conv_params(256, 384, 3)) == (11712, 614656, 885120, 1327488, 884992) and alex_conv == 3723968 and alex_fc == 43040778 and alex_conv + alex_fc == 46764746, 'conv=%d fc=%d total=%d' % (alex_conv, alex_fc, alex_conv + alex_fc))

n = 224
arch = [(1, 64), (1, 128), (2, 256), (2, 512), (2, 512)]
shapes = []
ci = 1
total_conv = 0
for num_convs, ch in arch:
    for _ in range(num_convs):
        total_conv += conv_params(ch, ci, 3)
        ci = ch
    n = n // 2
    shapes.append((ch, n, n))
check('c8l1 vgg shapes', shapes == [(64, 112, 112), (128, 56, 56), (256, 28, 28), (512, 14, 14), (512, 7, 7)], str(shapes))
check('c8l1 vgg flatten', 512 * n * n == 25088, '%d' % (512 * n * n))
check('c8l1 vgg conv params', total_conv == 9219328, '%d' % total_conv)
check('c8l1 vgg fc params', fc_params(4096, 25088) == 102764544 and fc_params(4096, 4096) == 16781312 and fc_params(10, 4096) == 40970, '%d' % (fc_params(4096, 25088) + fc_params(4096, 4096) + fc_params(10, 4096)))
check('c8l1 vgg total', total_conv + 102764544 + 16781312 + 40970 == 128806154, '%d' % (total_conv + 102764544 + 16781312 + 40970))
c = 64
check('c8l1 3x3 vs 5x5', 2 * 9 * c * c == 73728 and 25 * c * c == 102400 and 3 * 9 * c * c == 110592, '%d vs %d (3rd=%d)' % (2 * 9 * c * c, 25 * c * c, 3 * 9 * c * c))
check('c8l1 param_count(256,128,3)', conv_params(256, 128, 3) == 295168, '%d' % conv_params(256, 128, 3))
check('c8l1 param_count(256,256,3)', conv_params(256, 256, 3) == 590080, '%d' % conv_params(256, 256, 3))
check('c8l1 param_count(64,1,3)', conv_params(64, 1, 3) == 640, '%d' % conv_params(64, 1, 3))
check('c8l1 param_count(512,512,3)', conv_params(512, 512, 3) == 2359808, '%d' % conv_params(512, 512, 3))

# ============ ch8.l2: GoogLeNet + BatchNorm ============
def batch_norm_col(xs, gamma, beta, eps=0.0):
    mu = sum(xs) / len(xs)
    var = sum((v - mu) ** 2 for v in xs) / len(xs)
    hat = [(v - mu) / (var + eps) ** 0.5 for v in xs]
    return [gamma * v + beta for v in hat], mu, var

xs = [2.0, 4.0, 6.0, 8.0]
out, mu, var = batch_norm_col(xs, 1.0, 0.0)
check('c8l2 bn mu/var', abs(mu - 5.0) < 1e-12 and abs(var - 5.0) < 1e-12, '%.2f %.2f' % (mu, var))
check('c8l2 bn out', ['%.6f' % v for v in out] == ['-1.341641', '-0.447214', '0.447214', '1.341641'], str(['%.8f' % v for v in out]))
m = sum(out) / len(out)
v2 = sum((v - m) ** 2 for v in out) / len(out)
check('c8l2 bn stats', abs(m) < 1e-9 and abs(v2 - 1.0) < 1e-9, 'mean=%.1e var=%.8f' % (m, v2))
out2, _, _ = batch_norm_col(xs, 2.0, 1.0)
check('c8l2 bn gamma2', abs(out2[0] + 1.6832815729997477) < 1e-9 and abs(out2[3] - 3.6832815729997477) < 1e-9, str(out2))
m2 = sum(out2) / len(out2)
v3 = sum((v - m2) ** 2 for v in out2) / len(out2)
check('c8l2 bn new stats', abs(m2 - 1.0) < 1e-9 and abs(v3 - 4.0) < 1e-9, 'mean=%.6f var=%.6f' % (m2, v3))
mm, mv, momentum = 0.0, 1.0, 0.1
mm = (1 - momentum) * mm + momentum * mu
mv = (1 - momentum) * mv + momentum * var
check('c8l2 moving avg', abs(mm - 0.5) < 1e-12 and abs(mv - 1.4) < 1e-12, '%.2f %.2f' % (mm, mv))

def inception_out(c1, c2, c3, c4):
    return c1 + c2 + c3 + c4
check('c8l2 inc 256', inception_out(64, 128, 32, 32) == 256, '%d' % inception_out(64, 128, 32, 32))
check('c8l2 inc 480', inception_out(128, 192, 96, 64) == 480, '%d' % inception_out(128, 192, 96, 64))
check('c8l2 inc 512', inception_out(192, 208, 48, 64) == 512, '%d' % inception_out(192, 208, 48, 64))
check('c8l2 inc 832', inception_out(256, 320, 128, 128) == 832, '%d' % inception_out(256, 320, 128, 128))
check('c8l2 inc 1024', inception_out(384, 384, 128, 128) == 1024, '%d' % inception_out(384, 384, 128, 128))
check('c8l2 ratio', (64, 128, 32, 32) == (2 * 32, 4 * 32, 1 * 32, 1 * 32) and 192 // 2 == 96 and 192 // 12 == 16, '2:4:1:1; 192/2=96, 192/12=16')

# ============ ch8.l3: ResNet + DenseNet + design ============
def residual_value(x, w1, w2):
    return x + w2 * max(0.0, w1 * x)
check('c8l3 identity kept', residual_value(3.0, -1.0, 2.0) == 3.0 and 2.0 * max(0.0, -1.0 * 3.0) == 0.0, '%.1f' % residual_value(3.0, -1.0, 2.0))
check('c8l3 partial', abs(residual_value(3.0, 0.5, 1.0) - 4.5) < 1e-12, '%.1f' % residual_value(3.0, 0.5, 1.0))
check('c8l3 third', abs(residual_value(3.0, 2.0, 0.5) - 6.0) < 1e-12, '%.1f' % residual_value(3.0, 2.0, 0.5))
def res_out_shape(n, stride=1):
    return (n - 1) // stride + 1
check('c8l3 res shapes', (3, res_out_shape(6), res_out_shape(6)) == (3, 6, 6) and (6, res_out_shape(6, 2), res_out_shape(6, 2)) == (6, 3, 3), 'ok')

def dense_channels(c_in, k, num_convs):
    return c_in + num_convs * k
trace = [3]
cc = 3
for _ in range(2):
    cc += 10
    trace.append(cc)
check('c8l3 dense trace', trace == [3, 13, 23] and dense_channels(3, 10, 2) == 23, str(trace))
check('c8l3 dense formula', dense_channels(3, 12, 4) == 51, '%d' % dense_channels(3, 12, 4))
def conv_params(co, ci, k):
    return co * (ci * k * k + 1)
p1 = conv_params(64, 32, 3) + conv_params(64, 64, 3)
check('c8l3 stage block', (conv_params(64, 32, 3), conv_params(64, 64, 3), p1) == (18496, 36928, 55424), '%d' % p1)
stages = [(32, 96), (64, 48), (128, 24), (256, 12)]
check('c8l3 stage table', [r for _, r in stages] == [96 // (2 ** i) for i in range(4)] and [c for c, _ in stages] == [32, 64, 128, 256], str(stages))

print('ALL %d CHECKS VERIFIED' % ok)
