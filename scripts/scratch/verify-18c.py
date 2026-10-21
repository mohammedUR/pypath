#!/usr/bin/env python3
"""Task 18-c: verify every planned snippet + printed literal under CPython 3."""
import contextlib
import io
import sys

sys.path.insert(0, "/home/z/my-project/public/py-modules")

FAILS = []


def run(name, code, expected=None):
    env = {"__name__": "__main__"}
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, name, "exec"), env)
    except BaseException as e:
        FAILS.append(f"{name}: RAISED {type(e).__name__}: {e}")
        return
    got = buf.getvalue()
    if expected is not None and got != expected:
        FAILS.append(f"{name}: OUTPUT MISMATCH\n--- want ---\n{expected}\n--- got ----\n{got}")


def run_suite(name, solution, tests):
    env = {"__name__": "__main__"}
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(solution, name, "exec"), env)
    except BaseException as e:
        FAILS.append(f"{name}: SOLUTION RAISED {type(e).__name__}: {e}")
        return
    env["__learner_output__"] = buf.getvalue()
    for tid, tcode in tests:
        try:
            exec(compile(tcode, tid, "exec"), env)
        except BaseException as e:
            FAILS.append(f"{name}/{tid}: TEST FAILED {type(e).__name__}: {e}")


# ---------------------------------------------------------------- ch2.l1 worked
CH2L1_WORKED = """def shape(t):
    s = []
    row = t
    while isinstance(row, list):
        s.append(len(row))
        row = row[0]
    return tuple(s)

X = [[0.0, 1.0, 2.0, 3.0],
     [4.0, 5.0, 6.0, 7.0],
     [8.0, 9.0, 10.0, 11.0]]
Y = [[2.0, 1.0, 4.0, 3.0],
     [1.0, 2.0, 3.0, 4.0],
     [4.0, 3.0, 2.0, 1.0]]

print('shape:', shape(X), '| ndim:', len(shape(X)), '| numel:', len(X) * len(X[0]))

added = [[X[i][j] + Y[i][j] for j in range(4)] for i in range(3)]
print('X+Y row0:', added[0])
print('X==Y row0:', [X[0][j] == Y[0][j] for j in range(4)])

A = [[0.0], [1.0], [2.0]]
b = [0.0, 1.0]
bc = [[A[i][0] + b[j] for j in range(2)] for i in range(3)]
print('broadcast (3,1)+(1,2) ->', shape(bc), ':', bc)

rooms = [None, 2.0, 4.0, None]
price = [127500.0, 106000.0, 178100.0, 140000.0]
known = [r for r in rooms if r is not None]
mean_rooms = sum(known) / len(known)
filled = [r if r is not None else mean_rooms for r in rooms]
print('missing rooms: %d/4 | mean=%.1f | filled:' % (4 - len(known), mean_rooms), filled)
"""
CH2L1_WORKED_OUT = (
    "shape: (3, 4) | ndim: 2 | numel: 12\n"
    "X+Y row0: [2.0, 2.0, 6.0, 6.0]\n"
    "X==Y row0: [False, True, False, True]\n"
    "broadcast (3,1)+(1,2) -> (3, 2) : [[0.0, 1.0], [1.0, 2.0], [2.0, 3.0]]\n"
    "missing rooms: 2/4 | mean=3.0 | filled: [3.0, 2.0, 4.0, 3.0]\n"
)

# ---------------------------------------------------------------- ch2.l1 ex1
CH2L1_EX1_SOL = """def broadcast_add(A, row):
    return [[A[i][0] + row[j] for j in range(len(row))] for i in range(len(A))]

def mean_impute(col):
    known = [v for v in col if v is not None]
    m = sum(known) / len(known)
    return [v if v is not None else m for v in col]
"""
CH2L1_EX1_TESTS = [
    ("t1", """got = broadcast_add([[0.0], [1.0], [2.0]], [0.0, 1.0])
flat = [v for r in got for v in r]
want = [0.0, 1.0, 1.0, 2.0, 2.0, 3.0]
assert len(flat) == 6 and all(abs(flat[k] - want[k]) < 1e-9 for k in range(6)), 'expected [[0,1],[1,2],[2,3]] | actual: %r' % got"""),
    ("t2", "assert mean_impute([None, 2.0, 4.0, None]) == [3.0, 2.0, 4.0, 3.0], 'expected [3.0, 2.0, 4.0, 3.0] | actual: %r' % mean_impute([None, 2.0, 4.0, None])"),
    ("t3", "assert mean_impute([5.0, None]) == [5.0, 5.0] and mean_impute([1.0, 2.0]) == [1.0, 2.0], 'expected only the gaps to be filled'"),
]

# ---------------------------------------------------------------- ch2.l1 sandbox
CH2L1_SANDBOX = """X = [[0.0, 1.0, 2.0, 3.0],
     [4.0, 5.0, 6.0, 7.0],
     [8.0, 9.0, 10.0, 11.0]]

def col_means(M):
    n = len(M)
    m = len(M[0])
    return [sum(M[i][j] for i in range(n)) / n for j in range(m)]

print('X sum:', sum(sum(r) for r in X))
print('col means:', col_means(X))

roof = ['nan', 'nan', 'Slate', 'nan']
encoded = [[1.0, 0.0] if r == 'Slate' else [0.0, 1.0] for r in roof]
print('roof encoded:', encoded)
"""

# ---------------------------------------------------------------- ch2.l2 worked
CH2L2_WORKED = """import math

def dot(u, v):
    return sum(a * b for a, b in zip(u, v))

def norm2(u):
    return math.sqrt(dot(u, u))

def norm1(u):
    return sum(abs(a) for a in u)

def matvec(A, x):
    return [dot(row, x) for row in A]

A = [[0.0, 1.0, 2.0],
     [3.0, 4.0, 5.0]]
x = [1.0, 1.0, 1.0]
u = [3.0, -4.0]

print('dot([1,2,3],[4,5,6]) =', dot([1.0, 2.0, 3.0], [4.0, 5.0, 6.0]))
print('l2(3,-4) =', norm2(u), '| l1(3,-4) =', norm1(u))
print('A @ [1,1,1] =', matvec(A, x))

def f(t):
    return 3 * t ** 2 + 2 * t

def fp(t):
    return 6 * t + 2

h = 1e-5
for x0 in [-1.0, 0.0, 2.0]:
    fd = (f(x0 + h) - f(x0)) / h
    print('at x=%+.0f: rule=%+.1f finite-diff=%+.6f' % (x0, fp(x0), fd))

def grad(x1, x2):
    return (6 * x1 + 2 * x2, 2 * x1 + 2 * x2)

print('grad f(x1,x2) at (1,2) =', grad(1.0, 2.0))
"""
CH2L2_WORKED_OUT = (
    "dot([1,2,3],[4,5,6]) = 32.0\n"
    "l2(3,-4) = 5.0 | l1(3,-4) = 7.0\n"
    "A @ [1,1,1] = [3.0, 12.0]\n"
    "at x=-1: rule=-4.0 finite-diff=-3.999970\n"
    "at x=+0: rule=+2.0 finite-diff=+2.000030\n"
    "at x=+2: rule=+14.0 finite-diff=+14.000030\n"
    "grad f(x1,x2) at (1,2) = (10.0, 6.0)\n"
)

# ---------------------------------------------------------------- ch2.l2 ex1
CH2L2_EX1_SOL = """def numerical_gradient(f, pt, h=1e-5):
    grads = []
    for i in range(len(pt)):
        up = list(pt)
        dn = list(pt)
        up[i] = up[i] + h
        dn[i] = dn[i] - h
        g = (f(*up) - f(*dn)) / (2 * h)
        grads.append(g)
    return tuple(grads)
"""
CH2L2_EX1_TESTS = [
    ("t1", """def f2(x1, x2):
    return 3 * x1 ** 2 + 2 * x1 * x2 + x2 ** 2

g = numerical_gradient(f2, (1.0, 2.0))
assert abs(g[0] - 10.0) < 1e-4 and abs(g[1] - 6.0) < 1e-4, 'expected (10, 6) up to 1e-4 | actual: %r' % (g,)"""),
    ("t2", """def cube(t):
    return t ** 3

g = numerical_gradient(cube, (2.0,))
assert abs(g[0] - 12.0) < 1e-3, 'expected 12 up to 1e-3 | actual: %r' % (g,)"""),
    ("t3", """def lin(t):
    return 3 * t

g = numerical_gradient(lin, (4.0,), h=1e-3)
assert abs(g[0] - 3.0) < 1e-9, 'central difference of a linear map is exact | actual: %r' % (g,)"""),
]

# ---------------------------------------------------------------- ch2.l2 sandbox
CH2L2_SANDBOX = """import math

def dot(u, v):
    return sum(a * b for a, b in zip(u, v))

def norm2(u):
    return math.sqrt(dot(u, u))

u = [1.0, 2.0, 3.0]
v = [4.0, 5.0, 6.0]
had = [a * b for a, b in zip(u, v)]
print('u*v =', had, '| sum(u*v) =', sum(had))

A = [[0.0, 1.0, 2.0],
     [3.0, 4.0, 5.0]]
AT = [list(col) for col in zip(*A)]
print('A transpose:', AT)

S = [[1.0, 2.0, 3.0],
     [2.0, 0.0, 4.0],
     [3.0, 4.0, 5.0]]
print('S symmetric:', S == [list(c) for c in zip(*S)])

w = [0.2, 0.3, 0.5]
vals = [10.0, 20.0, 30.0]
print('weighted avg:', dot(w, vals))
"""

# ---------------------------------------------------------------- ch2.l3 worked (minigrad)
CH2L3_WORKED = """from minigrad import Value

x = Value(2.0)
a = 2 * x + 1
y = a ** 2
y.backward()
chain = 2 * a.data * 2
print('y = %.2f | autograd dy/dx = %.2f | chain rule = %.2f' % (y.data, x.grad, chain))

counts = {'rain': 0, 'cloudy': 0, 'clear': 0}
days = ['rain', 'clear', 'rain', 'cloudy', 'rain', 'clear', 'rain', 'cloudy', 'rain', 'clear']
for d in days:
    counts[d] += 1
for k in counts:
    print('P(%s) = %.2f' % (k, counts[k] / len(days)))

payoffs = [0.0, 2.0, 10.0]
probs = [0.5, 0.4, 0.1]
print('E[payoff] = %.2f' % sum(p * v for p, v in zip(probs, payoffs)))
"""
CH2L3_WORKED_OUT = (
    "y = 25.00 | autograd dy/dx = 20.00 | chain rule = 20.00\n"
    "P(rain) = 0.50\n"
    "P(cloudy) = 0.20\n"
    "P(clear) = 0.30\n"
    "E[payoff] = 1.80\n"
)

# ---------------------------------------------------------------- ch2.l3 ex1
CH2L3_EX1_SOL = """from minigrad import Value

def finite_diff(fn, x, h=1e-5):
    return (fn(x + h) - fn(x - h)) / (2 * h)

def autograd_grad(fn, x):
    v = Value(float(x))
    y = fn(v)
    y.backward()
    return v.grad
"""
CH2L3_EX1_TESTS = [
    ("t1", "f = lambda t: 3 * t ** 2 + 2 * t\nassert abs(finite_diff(f, 2.0) - 14.0) < 1e-4, 'expected 14 up to 1e-4 | actual: %r' % finite_diff(f, 2.0)"),
    ("t2", "f = lambda t: 3 * t ** 2 + 2 * t\nassert abs(autograd_grad(f, 2.0) - 14.0) < 1e-9, 'expected exactly 14 | actual: %r' % autograd_grad(f, 2.0)"),
    ("t3", """g = lambda t: (2 * t + 1) ** 2
fd = finite_diff(g, 2.0)
ag = autograd_grad(g, 2.0)
assert abs(ag - 20.0) < 1e-9 and abs(fd - ag) < 1e-4, 'expected 20 | finite-diff %r vs autograd %r' % (fd, ag)"""),
]

# ---------------------------------------------------------------- ch2.l3 sandbox
CH2L3_SANDBOX = """prior = 0.0015
sens1, fp1 = 1.0, 0.01
sens2, fp2 = 0.98, 0.03

marg1 = sens1 * prior + fp1 * (1 - prior)
post1 = sens1 * prior / marg1
print('after test 1: P(H=1 | +) = %.4f' % post1)

joint_sick = sens1 * sens2 * prior
joint_healthy = fp1 * fp2 * (1 - prior)
post2 = joint_sick / (joint_sick + joint_healthy)
print('after test 2: P(H=1 | +,+) = %.4f' % post2)
"""

# ---------------------------------------------------------------- ch1.l1 worked
CH1L1_WORKED = """xs = [1.0, 2.0, 3.0, 4.0]
ys = [2.0, 4.0, 6.0, 8.0]

def mse(w):
    return sum((w * x - y) ** 2 for x, y in zip(xs, ys)) / len(xs)

def grad(w):
    return sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)

w = 0.0
lr = 0.05
for step in range(100):
    if step in (0, 1, 2, 3, 99):
        print('step %3d | w = %.4f | mse = %.4f' % (step, w, mse(w)))
    w = w - lr * grad(w)
print('learned w = %.6f | predictions:' % w, [w * x for x in xs])
"""
CH1L1_WORKED_OUT = (
    "step   0 | w = 0.0000 | mse = 30.0000\n"
    "step   1 | w = 1.5000 | mse = 1.8750\n"
    "step   2 | w = 1.8750 | mse = 0.1172\n"
    "step   3 | w = 1.9688 | mse = 0.0073\n"
    "step  99 | w = 2.0000 | mse = 0.0000\n"
    "learned w = 2.000000 | predictions: [2.0, 4.0, 6.0, 8.0]\n"
)

# ---------------------------------------------------------------- ch1.l1 ex1
CH1L1_EX1_SOL = """def train_w(xs, ys, lr, steps):
    w = 0.0
    n = len(xs)
    for _ in range(steps):
        g = sum(2 * (w * xs[i] - ys[i]) * xs[i] for i in range(n)) / n
        w = w - lr * g
    return w
"""
CH1L1_EX1_TESTS = [
    ("t1", "w = train_w([1.0, 2.0, 3.0, 4.0], [2.0, 4.0, 6.0, 8.0], 0.05, 100)\nassert abs(w - 2.0) < 1e-6, 'expected w near 2.0 | actual: %r' % w"),
    ("t2", "w = train_w([1.0, 2.0, 3.0, 4.0], [3.0, 6.0, 9.0, 12.0], 0.05, 100)\nassert abs(w - 3.0) < 1e-6, 'expected w near 3.0 | actual: %r' % w"),
    ("t3", """def mse_at(w, xs, ys):
    return sum((w * x - y) ** 2 for x, y in zip(xs, ys)) / len(xs)

w = train_w([1.0, 2.0, 3.0, 4.0], [2.0, 4.0, 6.0, 8.0], 0.05, 100)
assert mse_at(w, [1.0, 2.0, 3.0, 4.0], [2.0, 4.0, 6.0, 8.0]) < mse_at(0.0, [1.0, 2.0, 3.0, 4.0], [2.0, 4.0, 6.0, 8.0]) / 100, 'training must drive the loss far below its start'"""),
]

# ---------------------------------------------------------------- ch1.l1 sandbox
CH1L1_SANDBOX = """xs = [1.0, 2.0, 3.0, 4.0]
ys = [2.0, 4.0, 6.0, 8.0]

def grad(w):
    return sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)

def mse(w):
    return sum((w * x - y) ** 2 for x, y in zip(xs, ys)) / len(xs)

for lr in [0.05, 0.2, 0.3]:
    w = 0.0
    for _ in range(20):
        w = w - lr * grad(w)
    print('lr=%.2f -> w after 20 steps = %.4f | mse = %.6f' % (lr, w, mse(w)))
"""

# ---------------------------------------------------------------- ch1.l2 worked
CH1L2_WORKED = """timeline = [
    (1687, 'precise natural laws arrive; fitting data follows soon after'),
    (1763, 'Bayes: a theorem for reasoning under uncertainty'),
    (1805, 'least squares: fit a line by minimizing squared error'),
    (1943, 'McCulloch and Pitts model a neuron as a threshold unit'),
    (1949, 'Hebb: neurons that fire together wire together'),
    (1958, 'Rosenblatt trains the perceptron'),
    (1986, 'backpropagation spreads: the chain rule trains whole networks'),
    (1998, 'convolutional networks read handwritten digits'),
    (2012, 'GPUs plus ImageNet: deep networks win by a wide margin'),
    (2017, 'the Transformer: attention replaces recurrence'),
]

for year, what in timeline:
    print('%d  %s' % (year, what))

first = (1970, 1e2, 1e5)
last = (2020, 1e12, 1e15)
print('dataset growth %d->%d: %.0e | flops growth: %.0e' % (first[0], last[0], last[1] / first[1], last[2] / first[2]))

def params(sizes):
    w = sum(sizes[i] * sizes[i + 1] for i in range(len(sizes) - 1))
    b = sum(sizes[1:])
    return w, b

w, b = params([2, 8, 8, 1])
print('net 2-8-8-1: weights = %d | biases = %d | total = %d' % (w, b, w + b))
"""
CH1L2_WORKED_OUT = (
    "1687  precise natural laws arrive; fitting data follows soon after\n"
    "1763  Bayes: a theorem for reasoning under uncertainty\n"
    "1805  least squares: fit a line by minimizing squared error\n"
    "1943  McCulloch and Pitts model a neuron as a threshold unit\n"
    "1949  Hebb: neurons that fire together wire together\n"
    "1958  Rosenblatt trains the perceptron\n"
    "1986  backpropagation spreads: the chain rule trains whole networks\n"
    "1998  convolutional networks read handwritten digits\n"
    "2012  GPUs plus ImageNet: deep networks win by a wide margin\n"
    "2017  the Transformer: attention replaces recurrence\n"
    "dataset growth 1970->2020: 1e+10 | flops growth: 1e+10\n"
    "net 2-8-8-1: weights = 88 | biases = 17 | total = 105\n"
)

# ---------------------------------------------------------------- ch1.l2 ex1
CH1L2_EX1_SOL = """def trimmed_mean(values):
    vs = sorted(values)
    core = vs[1:-1]
    return sum(core) / len(core)
"""
CH1L2_EX1_TESTS = [
    ("t1", "feet = [22, 25, 25, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 29, 29, 33]\nassert abs(trimmed_mean(feet) - 27.0) < 1e-9, 'expected 27.0 | actual: %r' % trimmed_mean(feet)"),
    ("t2", "assert abs(trimmed_mean([1.0, 2.0, 3.0, 4.0]) - 2.5) < 1e-9, 'drop one min and one max, average the middle'"),
    ("t3", "assert abs(trimmed_mean([10.0, 10.0, 10.0, 20.0]) - 10.0) < 1e-9, 'duplicate minima: drop only one of them'"),
]

# ---------------------------------------------------------------- ch1.l2 sandbox
CH1L2_SANDBOX = """decades = [(1970, 1e2, 1e5), (1980, 1e3, 1e6), (1990, 1e4, 1e7),
           (2000, 1e7, 1e9), (2010, 1e10, 1e12), (2020, 1e12, 1e15)]

prev = None
for year, data, flops in decades:
    if prev is None:
        print('%d  data=%.0e  flops=%.0e' % (year, data, flops))
    else:
        print('%d  data=%.0e (x%.0e)  flops=%.0e (x%.0e)' % (year, data, data / prev[1], flops, flops / prev[2]))
    prev = (year, data, flops)
"""

# ---------------------------------------------------------------- ch1.l3 worked
CH1L3_WORKED = """W1 = [[1.0, -1.0],
      [0.5, 1.0]]
b1 = [0.0, -1.0]
W2 = [[2.0, 3.0]]
b2 = [-4.0]

def relu(v):
    return [max(0.0, t) for t in v]

def layer1(x):
    z = [W1[i][0] * x[0] + W1[i][1] * x[1] + b1[i] for i in range(2)]
    return z, relu(z)

def layer2(h):
    return W2[0][0] * h[0] + W2[0][1] * h[1] + b2[0]

for x in ([2.0, 1.0], [-1.0, 3.0]):
    z, h = layer1(x)
    out = layer2(h)
    print('x =', x, '-> z1 =', z, '-> h =', h, '-> out =', out)
"""
CH1L3_WORKED_OUT = (
    "x = [2.0, 1.0] -> z1 = [1.0, 1.0] -> h = [1.0, 1.0] -> out = 1.0\n"
    "x = [-1.0, 3.0] -> z1 = [-4.0, 1.5] -> h = [0.0, 1.5] -> out = 0.5\n"
)

# ---------------------------------------------------------------- ch1.l3 ex1
CH1L3_EX1_SOL = """def param_count(sizes):
    weights = sum(sizes[i] * sizes[i + 1] for i in range(len(sizes) - 1))
    biases = sum(sizes[1:])
    return weights + biases
"""
CH1L3_EX1_TESTS = [
    ("t1", "assert param_count([2, 8, 8, 1]) == 105, 'expected 105 | actual: %r' % param_count([2, 8, 8, 1])"),
    ("t2", "assert param_count([3, 4, 1]) == 21, 'expected 21 | actual: %r' % param_count([3, 4, 1])"),
    ("t3", "assert param_count([1]) == 0 and param_count([1, 1]) == 2, 'no edges no params; one edge plus one bias = 2'"),
]

# ---------------------------------------------------------------- ch1.l3 sandbox
CH1L3_SANDBOX = """W1 = [[1.0, -1.0],
      [0.5, 1.0]]
b1 = [0.0, -1.0]
W2 = [[2.0, 3.0]]
b2 = [-4.0]

def forward(x):
    z = [W1[i][0] * x[0] + W1[i][1] * x[1] + b1[i] for i in range(2)]
    h = [max(0.0, t) for t in z]
    out = W2[0][0] * h[0] + W2[0][1] * h[1] + b2[0]
    return z, h, out

for x in ([0.0, 0.0], [4.0, 4.0], [-5.0, 1.0]):
    z, h, out = forward(x)
    print('x =', x, '-> z =', z, '-> h =', h, '-> out =', out)
"""

# ---------------------------------------------------------------- run everything
run("ch2l1.worked", CH2L1_WORKED, CH2L1_WORKED_OUT)
run_suite("ch2l1.ex1", CH2L1_EX1_SOL, CH2L1_EX1_TESTS)
run("ch2l1.sandbox", CH2L1_SANDBOX)

run("ch2l2.worked", CH2L2_WORKED, CH2L2_WORKED_OUT)
run_suite("ch2l2.ex1", CH2L2_EX1_SOL, CH2L2_EX1_TESTS)
run("ch2l2.sandbox", CH2L2_SANDBOX)

run("ch2l3.worked", CH2L3_WORKED, CH2L3_WORKED_OUT)
run_suite("ch2l3.ex1", CH2L3_EX1_SOL, CH2L3_EX1_TESTS)
run("ch2l3.sandbox", CH2L3_SANDBOX)

run("ch1l1.worked", CH1L1_WORKED, CH1L1_WORKED_OUT)
run_suite("ch1l1.ex1", CH1L1_EX1_SOL, CH1L1_EX1_TESTS)
run("ch1l1.sandbox", CH1L1_SANDBOX)

run("ch1l2.worked", CH1L2_WORKED, CH1L2_WORKED_OUT)
run_suite("ch1l2.ex1", CH1L2_EX1_SOL, CH1L2_EX1_TESTS)
run("ch1l2.sandbox", CH1L2_SANDBOX)

run("ch1l3.worked", CH1L3_WORKED, CH1L3_WORKED_OUT)
run_suite("ch1l3.ex1", CH1L3_EX1_SOL, CH1L3_EX1_TESTS)
run("ch1l3.sandbox", CH1L3_SANDBOX)

# show sandbox outputs for the record
for nm, code in [
    ("ch1l1.sandbox.out", CH1L1_SANDBOX),
    ("ch1l2.sandbox.out", CH1L2_SANDBOX),
    ("ch1l3.sandbox.out", CH1L3_SANDBOX),
]:
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(code, nm, "exec"), {})
    print(f"--- {nm} ---")
    print(buf.getvalue(), end="")

# forbidden-token sweep over every snippet above
BANNED = ["input(", "exit(", "sys.exit", "random", "unittest.main", "subprocess",
          "os.system", "socket", "urllib.request", "http.client", "requests.",
          "import torch", "import numpy", "torch.", "np."]
ALL = {
    "ch2l1.worked": CH2L1_WORKED, "ch2l1.ex1": CH2L1_EX1_SOL,
    "ch2l1.sandbox": CH2L1_SANDBOX, "ch2l2.worked": CH2L2_WORKED,
    "ch2l2.ex1": CH2L2_EX1_SOL, "ch2l2.sandbox": CH2L2_SANDBOX,
    "ch2l3.worked": CH2L3_WORKED, "ch2l3.ex1": CH2L3_EX1_SOL,
    "ch2l3.sandbox": CH2L3_SANDBOX, "ch1l1.worked": CH1L1_WORKED,
    "ch1l1.ex1": CH1L1_EX1_SOL, "ch1l1.sandbox": CH1L1_SANDBOX,
    "ch1l2.worked": CH1L2_WORKED, "ch1l2.ex1": CH1L2_EX1_SOL,
    "ch1l2.sandbox": CH1L2_SANDBOX, "ch1l3.worked": CH1L3_WORKED,
    "ch1l3.ex1": CH1L3_EX1_SOL, "ch1l3.sandbox": CH1L3_SANDBOX,
}
for k, v in ALL.items():
    for b in BANNED:
        if b in v:
            FAILS.append(f"forbidden {b!r} in {k}")
for tests in (CH2L1_EX1_TESTS, CH2L2_EX1_TESTS, CH2L3_EX1_TESTS, CH1L1_EX1_TESTS, CH1L2_EX1_TESTS, CH1L3_EX1_TESTS):
    for tid, tc in tests:
        for b in BANNED:
            if b in tc:
                FAILS.append(f"forbidden {b!r} in test {tid}")

print()
if FAILS:
    print(f"{len(FAILS)} FAILURES:")
    for f in FAILS:
        print(" *", f)
    sys.exit(1)
print("ALL SNIPPETS VERIFIED OK")
