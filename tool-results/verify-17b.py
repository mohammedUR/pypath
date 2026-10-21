#!/usr/bin/env python3
"""Verify every literal baked into MLS ch1+ch2 lessons (task 17-b) under CPython 3."""
import math

ok = True
def check(name, cond, extra=''):
    global ok
    print(('PASS ' if cond else 'FAIL ') + name + (' | ' + extra if extra else ''))
    if not cond:
        ok = False

X = [1, 2, 3, 4, 5]
y = [2.1, 3.9, 6.1, 7.8, 10.2]
N = len(X)

def mse(w0, w1, X, y):
    n = len(X)
    total = 0.0
    for i in range(n):
        err = y[i] - (w0 + w1 * X[i])
        total += err * err
    return total / n

# --- ch1.l1 values
check('mse(0,1)=11.182', abs(mse(0.0, 1.0, X, y) - 11.182) < 1e-9, repr(mse(0.0, 1.0, X, y)))
check('mse(1,1)=6.142', abs(mse(1.0, 1.0, X, y) - 6.142) < 1e-9, repr(mse(1.0, 1.0, X, y)))
check('mse(6.02,0)=8.1016', abs(mse(6.02, 0.0, X, y) - 8.1016) < 1e-9, repr(mse(6.02, 0.0, X, y)))
check('mse(0,2)=0.022', abs(mse(0.0, 2.0, X, y) - 0.022) < 1e-9, repr(mse(0.0, 2.0, X, y)))

def grads(w0, w1, X, y):
    n = len(X)
    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n
    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n
    return g0, g1

g0, g1 = grads(1.0, 1.0, X, y)
check('grad at (1,1) = (-4.04, -16.16)', abs(g0 + 4.04) < 1e-9 and abs(g1 + 16.16) < 1e-9, f'{g0!r} {g1!r}')
g0, g1 = grads(0.0, 0.0, X, y)
check('grad at (0,0) = (-12.04, -44.16)', abs(g0 + 12.04) < 1e-9 and abs(g1 + 44.16) < 1e-9, f'{g0!r} {g1!r}')

# --- ch1.l3: single gd_step + full GD
def gd_step(w0, w1, X, y, lr):
    g0, g1 = grads(w0, w1, X, y)
    return w0 - lr * g0, w1 - lr * g1

w0n, w1n = gd_step(0.0, 0.0, X, y, 0.02)
check('gd_step (0,0) lr.02 -> (0.2408, 0.8832)', abs(w0n - 0.2408) < 1e-9 and abs(w1n - 0.8832) < 1e-9, f'{w0n!r} {w1n!r}')
check('gd_step lowers mse', mse(w0n, w1n, X, y) < mse(0.0, 0.0, X, y), repr(mse(w0n, w1n, X, y)))

def gd_fit(X, y, lr=0.02, steps=2000):
    w0, w1 = 0.0, 0.0
    n = len(X)
    for _ in range(steps):
        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n
        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n
        w0 -= lr * g0
        w1 -= lr * g1
    return w0, w1

w0f, w1f = gd_fit(X, y)
check('gd_fit converges near (-0.01, 2.01)', abs(w0f + 0.01) < 1e-4 and abs(w1f - 2.01) < 1e-4, f'{w0f!r} {w1f!r}')
check('gd_fit mse < 0.03', mse(w0f, w1f, X, y) < 0.03, repr(mse(w0f, w1f, X, y)))
preds = [w0f + w1f * x for x in X]
check('gd preds near [2.0,4.01,6.02,8.03,10.04]',
      all(abs(preds[i] - v) < 1e-3 for i, v in enumerate([2.0, 4.01, 6.02, 8.03, 10.04])),
      ' '.join('%.4f' % p for p in preds))

# closed form (cov/var)
def ols_closed(X, y):
    n = len(X)
    mx = sum(X) / n
    my = sum(y) / n
    sxy = sum((X[i] - mx) * (y[i] - my) for i in range(n))
    sxx = sum((X[i] - mx) ** 2 for i in range(n))
    w1 = sxy / sxx
    return my - w1 * mx, w1

c0, c1 = ols_closed(X, y)
check('closed form (-0.01, 2.01)', abs(c0 + 0.01) < 1e-9 and abs(c1 - 2.01) < 1e-9, f'{c0!r} {c1!r}')
check('ols mse 0.0214', abs(mse(c0, c1, X, y) - 0.0214) < 1e-9, repr(mse(c0, c1, X, y)))
check('cf vs gd within 0.05', abs(c0 - w0f) < 0.05 and abs(c1 - w1f) < 0.05)
check('ols beats baseline', mse(c0, c1, X, y) < mse(6.02, 0.0, X, y))

# --- ch1.l2 gaussian NLL
def gaussian_nll(w0, w1, X, y, sigma):
    n = len(X)
    total = 0.0
    for i in range(n):
        err = y[i] - (w0 + w1 * X[i])
        total += 0.5 * math.log(2 * math.pi * sigma ** 2) + (err * err) / (2 * sigma ** 2)
    return total

n00 = gaussian_nll(0.0, 0.0, X, y, 1.0)
n11 = gaussian_nll(1.0, 1.0, X, y, 1.0)
nols = gaussian_nll(-0.01, 2.01, X, y, 1.0)
n02 = gaussian_nll(0.0, 2.0, X, y, 1.0)
check('nll(0,0)=115.4497', abs(n00 - 115.4497) < 1e-3, repr(n00))
check('nll(1,1)=19.9497', abs(n11 - 19.9497) < 1e-3, repr(n11))
check('nll(ols)=4.6482', abs(nols - 4.6482) < 1e-3, repr(nols))
check('nll(0,2)=4.6497', abs(n02 - 4.6497) < 1e-3, repr(n02))
check('nll(ols) < nll(0,2)', nols < n02)

# --- ch2.l1 ridge scan (centered)
xc = [-2, -1, 0, 1, 2]
yc = [v - 6.02 for v in y]
YCL = [-3.92, -2.12, 0.08, 1.78, 4.18]
check('yc ~ literals', all(abs(yc[i] - YCL[i]) < 1e-12 for i in range(5)), repr(yc))
yc = YCL

def ridge_obj(w1, lam):
    n = len(xc)
    loss = sum((yc[i] - w1 * xc[i]) ** 2 for i in range(n)) / n
    return loss + lam * w1 * w1

def argmin_scan(lam):
    best = None
    w = -2.5
    while w <= 2.5001:
        v = ridge_obj(w, lam)
        if best is None or v < best[0]:
            best = (v, w)
        w += 0.05
    return best

for lam in (0.0, 1.0, 4.0):
    v, w = argmin_scan(lam)
    print('  scan lam=%.1f -> argmin w1=%.2f obj=%.4f' % (lam, w, v))
check('scan lam0 argmin ~ 2.01', abs(argmin_scan(0.0)[1] - 2.01) <= 0.051, repr(argmin_scan(0.0)))
check('scan lam1 argmin ~ 1.34', abs(argmin_scan(1.0)[1] - 1.34) <= 0.051, repr(argmin_scan(1.0)))
check('scan lam1 < lam0 argmin', argmin_scan(1.0)[1] < argmin_scan(0.0)[1])
theory = [20.1 / 10, 20.1 / 12, 20.1 / 30]
print('  theory lam 0,1,4 slopes:', theory)

# --- ch2.l2 bayesian
def posterior(x, y, sigma, tau, mu0):
    sxx = sum(v * v for v in x)
    sxy = sum(x[i] * y[i] for i in range(len(x)))
    like_prec = sxx / sigma ** 2
    prior_prec = 1.0 / tau ** 2
    mean = (sxy / sigma ** 2 + mu0 * prior_prec) / (like_prec + prior_prec)
    sd = (like_prec + prior_prec) ** -0.5
    return mean, sd

m1, s1 = posterior(xc, yc, 1.0, 2.0, 0.0)
m2, s2 = posterior(xc, yc, 1.0, 1.0, 2.0)
m3, s3 = posterior(xc, yc, 1.0, 1.0, 0.0)
check('post1 mean=1.961 sd=0.3123', abs(m1 - 1.961) < 1e-3 and abs(s1 - 0.3123) < 1e-3, f'{m1!r} {s1!r}')
check('post2 mean=2.0091 sd=0.3015', abs(m2 - 2.0091) < 1e-3 and abs(s2 - 0.3015) < 1e-3, f'{m2!r} {s2!r}')
check('post3 mean=1.8273', abs(m3 - 1.8273) < 1e-3, repr(m3))
check('prior pulls: m3 < m1 < m2 < ols', m3 < m1 < m2 < 2.01)

# --- ch2.l3 poisson
xp = [0, 1, 2, 3]
yp = [1, 2, 4, 8]

def poisson_nll(w0, w1, x, y):
    total = 0.0
    for i in range(len(x)):
        lam = math.exp(w0 + w1 * x[i])
        total += lam - y[i] * math.log(lam)
    return total

def poisson_grads(w0, w1, x, y):
    g0 = sum(math.exp(w0 + w1 * x[i]) - y[i] for i in range(len(x)))
    g1 = sum((math.exp(w0 + w1 * x[i]) - y[i]) * x[i] for i in range(len(x)))
    return g0, g1

check('poisson nll(0,0)=4.0', abs(poisson_nll(0.0, 0.0, xp, yp) - 4.0) < 1e-9)
g0p, g1p = poisson_grads(0.0, 0.0, xp, yp)
check('poisson grads(0,0)=(-11,-28)', abs(g0p + 11) < 1e-9 and abs(g1p + 28) < 1e-9, f'{g0p!r} {g1p!r}')

w0, w1, lr = 0.0, 0.0, 0.01
nlls = []
for stp in range(400):
    g0, g1 = poisson_grads(w0, w1, xp, yp)
    w0 -= lr * g0
    w1 -= lr * g1
    if stp % 100 == 99:
        nlls.append(poisson_nll(w0, w1, xp, yp))
print('  poisson w0=%.4f w1=%.4f nlls=%s' % (w0, w1, ['%.4f' % v for v in nlls]))
lam3 = math.exp(w0 + w1 * 3)
print('  poisson lambdas:', ' '.join('%.3f' % math.exp(w0 + w1 * v) for v in xp))
check('poisson converges w1~0.693', abs(w1 - math.log(2)) < 0.01, 'w1=%.4f ln2=%.4f' % (w1, math.log(2)))
check('poisson lam3 ~ 8.0', abs(lam3 - 8.0) < 0.1, repr(lam3))
check('poisson nll decreased', nlls[-1] < 1.0 and nlls[-1] < nlls[0], repr(nlls[-1]))

# --- ch2.l4 ridge closed form + GD + lasso
def ridge_closed_form(X, y, lam):
    n = len(X)
    sx = sum(X)
    sy = sum(y)
    sxx = sum(v * v for v in X)
    sxy = sum(X[i] * y[i] for i in range(n))
    det = n * (sxx + n * lam) - sx * sx
    w0 = (sy * (sxx + n * lam) - sx * sxy) / det
    w1 = (n * sxy - sy * sx) / det
    return w0, w1

for lam in (0.0, 1.0, 4.0):
    a, b = ridge_closed_form(X, y, lam)
    print('  ridge lam=%.1f -> w0=%.4f w1=%.4f' % (lam, a, b))
r0, r1 = ridge_closed_form(X, y, 1.0)
check('ridge lam1 closed (2.0, 1.34)', abs(r0 - 2.0) < 1e-9 and abs(r1 - 1.34) < 1e-9, f'{r0!r} {r1!r}')
r40, r41 = ridge_closed_form(X, y, 4.0)
check('ridge lam4 closed (4.01, 0.67)', abs(r40 - 4.01) < 1e-9 and abs(r41 - 0.67) < 1e-9, f'{r40!r} {r41!r}')
r00, r01 = ridge_closed_form(X, y, 0.0)
check('ridge lam0 = ols', abs(r00 + 0.01) < 1e-9 and abs(r01 - 2.01) < 1e-9)

def ridge_grad_step(w0, w1, X, y, lr, lam):
    n = len(X)
    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n
    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + 2.0 * lam * w1
    return w0 - lr * g0, w1 - lr * g1

a, b = ridge_grad_step(0.0, 0.5, X, y, 0.02, 1.0)
check('ridge step (0,0.5) -> (0.1808, 1.1432)', abs(a - 0.1808) < 1e-9 and abs(b - 1.1432) < 1e-9, f'{a!r} {b!r}')
pa, pb = gd_step(0.0, 0.5, X, y, 0.02)
check('ridge shrinks the step', b < pb, f'{b!r} < {pb!r}')

def fit_ridge(X, y, lam, lr=0.02, steps=2000):
    w0, w1 = 0.0, 0.0
    n = len(X)
    for _ in range(steps):
        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n
        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + 2.0 * lam * w1
        w0 -= lr * g0
        w1 -= lr * g1
    return w0, w1

fr0, fr1 = fit_ridge(X, y, 1.0)
check('fit_ridge lam1 -> (2.0, 1.34) tol .01', abs(fr0 - 2.0) < 0.01 and abs(fr1 - 1.34) < 0.01, f'{fr0!r} {fr1!r}')
fr2 = fit_ridge(X, y, 0.0)
check('fit_ridge lam0 -> ols tol .01', abs(fr2[0] + 0.01) < 0.01 and abs(fr2[1] - 2.01) < 0.01)

def sign(v):
    return (v > 0) - (v < 0)

def lasso_step(w0, w1, X, y, lr, lam):
    n = len(X)
    g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n
    g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + lam * sign(w1)
    return w0 - lr * g0, w1 - lr * g1

la, lb = lasso_step(0.0, 0.5, X, y, 0.02, 0.3)
check('lasso step (0,0.5) -> (0.1808, 1.1572)', abs(la - 0.1808) < 1e-9 and abs(lb - 1.1572) < 1e-9, f'{la!r} {lb!r}')
la0, lb0 = lasso_step(0.0, 0.0, X, y, 0.02, 0.3)
check('lasso step at w1=0 == plain step', abs(la0 - 0.2408) < 1e-9 and abs(lb0 - 0.8832) < 1e-9, f'{la0!r} {lb0!r}')

# --- ch1.l4 trace snippet: exact stdout
trace_code = (
    "X = [1, 2, 3, 4, 5]\n"
    "y = [2.1, 3.9, 6.1, 7.8, 10.2]\n"
    "n = len(y)\n"
    "mean_y = sum(y) / n\n"
    "base_mse = sum((y[i] - mean_y) ** 2 for i in range(n)) / n\n"
    "ols = (-0.01, 2.01)\n"
    "ols_mse = sum((y[i] - (ols[0] + ols[1] * X[i])) ** 2 for i in range(n)) / n\n"
    "print('baseline mse: %.4f' % base_mse)\n"
    "print('ols mse: %.4f' % ols_mse)\n"
    "print('gain: %.4f' % (base_mse - ols_mse))\n"
)
import io, contextlib
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(trace_code, '<t>', 'exec'), {})
trace_out = buf.getvalue()
print('--- trace stdout ---')
print(trace_out, end='')
print('--- end ---')

# --- ch1.l1 worked snippet output
worked1 = (
    "X = [1, 2, 3, 4, 5]\n"
    "y = [2.1, 3.9, 6.1, 7.8, 10.2]\n"
    "def mse(w0, w1, X, y):\n"
    "    n = len(X)\n"
    "    total = 0.0\n"
    "    for i in range(n):\n"
    "        err = y[i] - (w0 + w1 * X[i])\n"
    "        total += err * err\n"
    "    return total / n\n"
    "print('w0=1.0 w1=1.0 -> mse=%.4f' % mse(1.0, 1.0, X, y))\n"
    "print('w0=0.0 w1=2.0 -> mse=%.4f' % mse(0.0, 2.0, X, y))\n"
    "best = None\n"
    "for w0 in [-0.2, -0.1, 0.0, 0.1]:\n"
    "    for w1 in [1.9, 2.0, 2.1]:\n"
    "        v = mse(w0, w1, X, y)\n"
    "        if best is None or v < best[0]:\n"
    "            best = (v, w0, w1)\n"
    "print('grid argmin: w0=%.1f w1=%.1f mse=%.4f' % (best[1], best[2], best[0]))\n"
)
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(worked1, '<w>', 'exec'), {})
print('--- worked ch1.l1 stdout ---')
print(buf.getvalue(), end='')

# --- ch1.l4 worked snippet output
worked4 = (
    "def ols_closed(X, y):\n"
    "    n = len(X)\n"
    "    mx = sum(X) / n\n"
    "    my = sum(y) / n\n"
    "    sxy = sum((X[i] - mx) * (y[i] - my) for i in range(n))\n"
    "    sxx = sum((X[i] - mx) ** 2 for i in range(n))\n"
    "    w1 = sxy / sxx\n"
    "    return my - w1 * mx, w1\n"
    "def gd_fit(X, y, lr, steps):\n"
    "    w0, w1 = 0.0, 0.0\n"
    "    n = len(X)\n"
    "    for _ in range(steps):\n"
    "        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n"
    "        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n\n"
    "        w0 -= lr * g0\n"
    "        w1 -= lr * g1\n"
    "    return w0, w1\n"
    "def mse(w0, w1, X, y):\n"
    "    n = len(X)\n"
    "    return sum((y[i] - (w0 + w1 * X[i])) ** 2 for i in range(n)) / n\n"
    "X = [1, 2, 3, 4, 5]\n"
    "y = [2.1, 3.9, 6.1, 7.8, 10.2]\n"
    "cf0, cf1 = ols_closed(X, y)\n"
    "gd0, gd1 = gd_fit(X, y, 0.02, 2000)\n"
    "my = sum(y) / len(y)\n"
    "print('closed-form: w0=%.4f w1=%.4f mse=%.4f' % (cf0, cf1, mse(cf0, cf1, X, y)))\n"
    "print('gradient descent: w0=%.4f w1=%.4f mse=%.4f' % (gd0, gd1, mse(gd0, gd1, X, y)))\n"
    "print('mean baseline: w0=%.4f w1=0.0000 mse=%.4f' % (my, mse(my, 0.0, X, y)))\n"
    "print('max weight gap |cf - gd| = %.6f' % max(abs(cf0 - gd0), abs(cf1 - gd1)))\n"
)
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(worked4, '<w>', 'exec'), {})
print('--- worked ch1.l4 stdout ---')
print(buf.getvalue(), end='')

# --- ch2.l1 worked output
worked21 = (
    "xc = [-2, -1, 0, 1, 2]\n"
    "yc = [-3.92, -2.12, 0.08, 1.78, 4.18]\n"
    "def ridge_obj(w1, lam):\n"
    "    n = len(xc)\n"
    "    loss = sum((yc[i] - w1 * xc[i]) ** 2 for i in range(n)) / n\n"
    "    return loss + lam * w1 * w1\n"
    "for lam in [0.0, 1.0, 4.0]:\n"
    "    best = None\n"
    "    w = -2.5\n"
    "    while w <= 2.5001:\n"
    "        v = ridge_obj(w, lam)\n"
    "        if best is None or v < best[0]:\n"
    "            best = (v, w)\n"
    "        w += 0.05\n"
    "    print('lam=%.1f -> argmin w1=%.2f obj=%.4f' % (lam, best[1], best[0]))\n"
)
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(worked21, '<w>', 'exec'), {})
print('--- worked ch2.l1 stdout ---')
print(buf.getvalue(), end='')

# --- ch2.l2 worked output
worked22 = (
    "def posterior(x, y, sigma, tau, mu0):\n"
    "    sxx = sum(v * v for v in x)\n"
    "    sxy = sum(x[i] * y[i] for i in range(len(x)))\n"
    "    like_prec = sxx / sigma ** 2\n"
    "    prior_prec = 1.0 / tau ** 2\n"
    "    mean = (sxy / sigma ** 2 + mu0 * prior_prec) / (like_prec + prior_prec)\n"
    "    sd = (like_prec + prior_prec) ** -0.5\n"
    "    return mean, sd\n"
    "x = [-2, -1, 0, 1, 2]\n"
    "y = [-3.92, -2.12, 0.08, 1.78, 4.18]\n"
    "m1, s1 = posterior(x, y, 1.0, 2.0, 0.0)\n"
    "m2, s2 = posterior(x, y, 1.0, 1.0, 2.0)\n"
    "print('prior N(0, 4):      mean=%.4f sd=%.4f' % (m1, s1))\n"
    "print('prior N(2, 1):      mean=%.4f sd=%.4f' % (m2, s2))\n"
    "print('ols slope (no prior): %.4f' % (sum(x[i] * y[i] for i in range(5)) / 10.0))\n"
)
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(worked22, '<w>', 'exec'), {})
print('--- worked ch2.l2 stdout ---')
print(buf.getvalue(), end='')

# --- ch2.l3 worked output
worked23 = (
    "import math\n"
    "x = [0, 1, 2, 3]\n"
    "y = [1, 2, 4, 8]\n"
    "def poisson_nll(w0, w1, x, y):\n"
    "    total = 0.0\n"
    "    for i in range(len(x)):\n"
    "        lam = math.exp(w0 + w1 * x[i])\n"
    "        total += lam - y[i] * math.log(lam)\n"
    "    return total\n"
    "w0, w1, lr = 0.0, 0.0, 0.01\n"
    "for step in range(400):\n"
    "    g0 = sum(math.exp(w0 + w1 * x[i]) - y[i] for i in range(4))\n"
    "    g1 = sum((math.exp(w0 + w1 * x[i]) - y[i]) * x[i] for i in range(4))\n"
    "    w0 -= lr * g0\n"
    "    w1 -= lr * g1\n"
    "print('after 400 steps: w0=%.4f w1=%.4f' % (w0, w1))\n"
    "print('nll: start=%.4f end=%.4f' % (poisson_nll(0.0, 0.0, x, y), poisson_nll(w0, w1, x, y)))\n"
    "for i in range(4):\n"
    "    print('x=%d y=%d lam=%.3f' % (x[i], y[i], math.exp(w0 + w1 * x[i])))\n"
)
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(worked23, '<w>', 'exec'), {})
print('--- worked ch2.l3 stdout ---')
print(buf.getvalue(), end='')

# --- ch2.l4 worked output (closed-form ridge vs GD ridge)
worked24 = (
    "def ridge_closed_form(X, y, lam):\n"
    "    n = len(X)\n"
    "    sx = sum(X)\n"
    "    sy = sum(y)\n"
    "    sxx = sum(v * v for v in X)\n"
    "    sxy = sum(X[i] * y[i] for i in range(n))\n"
    "    det = n * (sxx + n * lam) - sx * sx\n"
    "    w0 = (sy * (sxx + n * lam) - sx * sxy) / det\n"
    "    w1 = (n * sxy - sy * sx) / det\n"
    "    return w0, w1\n"
    "def fit_ridge(X, y, lam, lr, steps):\n"
    "    w0, w1 = 0.0, 0.0\n"
    "    n = len(X)\n"
    "    for _ in range(steps):\n"
    "        g0 = -2.0 * sum(y[i] - (w0 + w1 * X[i]) for i in range(n)) / n\n"
    "        g1 = -2.0 * sum((y[i] - (w0 + w1 * X[i])) * X[i] for i in range(n)) / n + 2.0 * lam * w1\n"
    "        w0 -= lr * g0\n"
    "        w1 -= lr * g1\n"
    "    return w0, w1\n"
    "X = [1, 2, 3, 4, 5]\n"
    "y = [2.1, 3.9, 6.1, 7.8, 10.2]\n"
    "c0, c1 = ridge_closed_form(X, y, 1.0)\n"
    "g0, g1 = fit_ridge(X, y, 1.0, 0.02, 2000)\n"
    "print('closed-form ridge lam=1: w0=%.4f w1=%.4f' % (c0, c1))\n"
    "print('gradient ridge   lam=1: w0=%.4f w1=%.4f' % (g0, g1))\n"
    "print('gap: %.6f' % max(abs(c0 - g0), abs(c1 - g1)))\n"
)
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(worked24, '<w>', 'exec'), {})
print('--- worked ch2.l4 stdout ---')
print(buf.getvalue(), end='')

# --- ch2.l5 worked output
worked25 = (
    "def ridge_closed_form(X, y, lam):\n"
    "    n = len(X)\n"
    "    sx = sum(X)\n"
    "    sy = sum(y)\n"
    "    sxx = sum(v * v for v in X)\n"
    "    sxy = sum(X[i] * y[i] for i in range(n))\n"
    "    det = n * (sxx + n * lam) - sx * sx\n"
    "    w0 = (sy * (sxx + n * lam) - sx * sxy) / det\n"
    "    w1 = (n * sxy - sy * sx) / det\n"
    "    return w0, w1\n"
    "X = [1, 2, 3, 4, 5]\n"
    "y = [2.1, 3.9, 6.1, 7.8, 10.2]\n"
    "o0, o1 = ridge_closed_form(X, y, 0.0)\n"
    "r0, r1 = ridge_closed_form(X, y, 1.0)\n"
    "print('OLS       w0=%.4f w1=%.4f' % (o0, o1))\n"
    "print('Ridge(1)  w0=%.4f w1=%.4f' % (r0, r1))\n"
    "print('shrinkage: w1 %.4f -> %.4f (%.1f%% kept)' % (o1, r1, 100.0 * r1 / o1))\n"
)
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(compile(worked25, '<w>', 'exec'), {})
print('--- worked ch2.l5 stdout ---')
print(buf.getvalue(), end='')

# --- numeric answers
print('numeric: grad w0 at (1,1) = %.4f' % grads(1.0, 1.0, X, y)[0])
print('numeric: bayes mean sigma1 tau1 mu0 0 = %.4f' % posterior(xc, yc, 1.0, 1.0, 0.0)[0])
print('numeric: ridge lam4 slope = %.4f' % ridge_closed_form(X, y, 4.0)[1])
print('numeric: poisson lam at x=3 = %.4f' % lam3)

print('\nALL VERIFIED' if ok else '\nSOME CHECKS FAILED')
