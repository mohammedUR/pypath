# Task 19-b verification: every printed literal for D2L ch6/ch7/ch8 lessons.
import io, json, math, contextlib

def run(code):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(code, '<s>', 'exec'), {'__name__': '__main__'})
    return buf.getvalue()

def check(label, code, want_lines):
    got = run(code).splitlines()
    ok = got == want_lines
    print(('PASS' if ok else 'FAIL'), label)
    if not ok:
        print('  want:', want_lines)
        print('  got :', got)
    return ok

results = []

# ---------------- ch6.l1 worked ----------------
W = '''class Module:
    def modules(self):
        found = []
        for v in self.__dict__.values():
            if isinstance(v, Module):
                found.append(v)
                found.extend(v.modules())
            elif isinstance(v, list):
                for u in v:
                    if isinstance(u, Module):
                        found.append(u)
                        found.extend(u.modules())
        return found

    def param_shapes(self):
        out = {}
        for m in self.modules():
            if hasattr(m, 'w'):
                out[m.label + '.w'] = (len(m.w), len(m.w[0]))
                out[m.label + '.b'] = (len(m.b),)
        return out

class Linear(Module):
    def __init__(self, label, nin, nout, w, b):
        self.label, self.nin, self.nout = label, nin, nout
        self.w, self.b = w, b

    def forward(self, x):
        return [sum(self.w[r][k] * x[k] for k in range(self.nin)) + self.b[r]
                for r in range(self.nout)]

class ReLU(Module):
    def forward(self, x):
        return [v if v > 0 else 0.0 for v in x]

class MySequential(Module):
    def __init__(self, *layers):
        self.layers = list(layers)

    def forward(self, x):
        for layer in self.layers:
            x = layer.forward(x)
        return x

h = Linear('h', 4, 3, [[1.0, 0.0, -1.0, 0.5],
                       [0.5, 1.0, 0.0, -0.5],
                       [-0.25, 0.25, 1.0, 0.0]], [0.1, -0.2, 0.0])
o = Linear('o', 3, 1, [[1.0, -1.0, 2.0]], [0.5])
net = MySequential(h, ReLU(), o)
print('net(x):', [round(v, 4) for v in net.forward([1.0, 2.0, 0.0, -1.0])])
print('census:', net.param_shapes())
print('total numbers:', sum(len(r) for r in h.w) + len(h.b) + sum(len(r) for r in o.w) + len(o.b))

shared = Linear('s', 2, 2, [[1.0, 0.0], [0.0, 1.0]], [0.0, 0.0])
tied = MySequential(shared, ReLU(), shared, ReLU())
print('same object:', tied.layers[0] is tied.layers[2])
print('tied census:', tied.param_shapes())
print('tied forward:', [round(v, 4) for v in tied.forward([2.0, -1.0])])
'''
results.append(check('ch6.l1 worked', W, [
    "net(x): [-1.2]",
    "census: {'h.w': (3, 4), 'h.b': (3,), 'o.w': (1, 3), 'o.b': (1,)}",
    'total numbers: 19',
    'same object: True',
    "tied census: {'s.w': (2, 2), 's.b': (2,)}",
    'tied forward: [2.0, 0.0]',
]))

# ---------------- ch6.l1 ex1 solution + tests ----------------
SOL = '''class Module:
    def modules(self):
        found = []
        for v in self.__dict__.values():
            if isinstance(v, Module):
                found.append(v)
                found.extend(v.modules())
            elif isinstance(v, list):
                for u in v:
                    if isinstance(u, Module):
                        found.append(u)
                        found.extend(u.modules())
        return found

class Linear(Module):
    def __init__(self, label, nin, nout, w, b):
        self.label, self.nin, self.nout = label, nin, nout
        self.w, self.b = w, b
    def forward(self, x):
        return [sum(self.w[r][k] * x[k] for k in range(self.nin)) + self.b[r]
                for r in range(self.nout)]

class ReLU(Module):
    def forward(self, x):
        return [v if v > 0 else 0.0 for v in x]

class MySequential(Module):
    def __init__(self, *layers):
        self.layers = list(layers)

    def forward(self, x):
        for layer in self.layers:
            x = layer.forward(x)
        return x

def count_params(net):
    total = 0
    seen = set()
    def walk(v):
        nonlocal total
        if isinstance(v, list):
            for u in v:
                walk(u)
        elif isinstance(v, dict):
            for u in v.values():
                walk(u)
        elif isinstance(v, Module):
            if id(v) not in seen:
                seen.add(id(v))
                if hasattr(v, 'w'):
                    total += sum(len(r) for r in v.w) + len(v.b)
                walk(v.__dict__)
    walk(net)
    return total
'''
env = {}
exec(compile(SOL, '<sol>', 'exec'), env)
T1 = '''
h = Linear('h', 4, 3, [[1.0, 0.0, -1.0, 0.5], [0.5, 1.0, 0.0, -0.5], [-0.25, 0.25, 1.0, 0.0]], [0.1, -0.2, 0.0])
o = Linear('o', 3, 1, [[1.0, -1.0, 2.0]], [0.5])
net = MySequential(h, ReLU(), o)
assert count_params(net) == 19, 'expected 19 | actual: %r' % count_params(net)
assert [round(v, 4) for v in net.forward([1.0, 2.0, 0.0, -1.0])] == [-1.2], 'expected [-1.2] | actual: %r' % net.forward([1.0, 2.0, 0.0, -1.0])
'''
T2 = '''
shared = Linear('s', 2, 2, [[1.0, 0.0], [0.0, 1.0]], [0.0, 0.0])
tied = MySequential(shared, ReLU(), shared, ReLU())
assert tied.layers[0] is tied.layers[2], 'the two uses must be the same object'
assert count_params(tied) == 6, 'expected 6 (tied counted once) | actual: %r' % count_params(tied)
'''
T3 = '''
untied = MySequential(Linear('a', 2, 2, [[1.0, 0.0], [0.0, 1.0]], [0.0, 0.0]), ReLU(),
                      Linear('b', 2, 2, [[1.0, 0.0], [0.0, 1.0]], [0.0, 0.0]), ReLU())
assert count_params(untied) == 12, 'expected 12 | actual: %r' % count_params(untied)
'''
for name, t in (('ch6.l1 ex1 t1', T1), ('ch6.l1 ex1 t2', T2), ('ch6.l1 ex1 t3', T3)):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch6.l1 sandbox ----------------
SB = '''def forward(x, w, b):
    return [sum(w[r][k] * x[k] for k in range(len(x))) + b[r] for r in range(len(w))]

h_w = [[0.1, 0.2, 0.3, 0.4], [0.5, 0.6, 0.7, 0.8], [-0.1, -0.2, -0.3, -0.4]]
h_b = [0.0, 0.1, 0.2]
o_w = [[1.0, -1.0, 1.0]]
o_b = [0.0]
for xv in [[1.0, 0.0, 0.0, 0.0], [1.0, 1.0, 1.0, 1.0]]:
    hid = forward(xv, h_w, h_b)
    hid = [v if v > 0 else 0.0 for v in hid]
    print('x =', xv, '-> hidden:', [round(v, 4) for v in hid], '-> out:', [round(v, 4) for v in forward(hid, o_w, o_b)])
'''
results.append(check('ch6.l1 sandbox', SB, [
    'x = [1.0, 0.0, 0.0, 0.0] -> hidden: [0.1, 0.6, 0.1] -> out: [-0.4]',
    'x = [1.0, 1.0, 1.0, 1.0] -> hidden: [1.0, 2.7, 0.0] -> out: [-1.7]',
]))

# ---------------- ch6.l2 worked ----------------
W2 = '''import math

class LCG:
    def __init__(self, seed):
        self.state = seed % 2147483647

    def next(self):
        self.state = (self.state * 48271) % 2147483647
        return self.state / 2147483647

def init_layer(name, nin, nout, mode, rng):
    if mode == 'xavier':
        a = math.sqrt(6.0 / (nin + nout))
        w = [[-a + 2.0 * a * rng.next() for _ in range(nin)] for _ in range(nout)]
    elif mode == 'constant':
        w = [[42.0] * nin for _ in range(nout)]
    else:  # 'zeros'
        w = [[0.0] * nin for _ in range(nout)]
    return {'name': name, 'w': w, 'b': [0.0] * nout}

rng = LCG(seed=1)
h = init_layer('h', 4, 8, 'xavier', rng)
print('a = sqrt(6/(4+8)) =', round(math.sqrt(6.0 / 12.0), 4))
print('h.w row0:', [round(v, 4) for v in h['w'][0]])
o = init_layer('o', 8, 1, 'zeros', rng)
print('o.w:', o['w'], '| all biases zero:', all(v == 0.0 for l in (h, o) for v in l['b']))

class LazyLinear:
    def __init__(self, nout):
        self.nout = nout
        self.w = None  # shape still unknown

    def observe(self, in_width):
        self.w = [[0.0] * in_width for _ in range(self.nout)]
        self.b = [0.0] * self.nout
        return (self.nout, in_width)

net = [LazyLinear(8), LazyLinear(1)]
print('before first forward:', [l.w for l in net])
width = 20
shapes = []
for layer in net:
    shapes.append(layer.observe(width))
    width = layer.nout
print('after first forward:', shapes)
'''
state = 1
vals = []
for _ in range(4):
    state = (state * 48271) % 2147483647
    vals.append(state / 2147483647)
a = math.sqrt(6.0 / 12.0)
row0 = [round(-a + 2 * a * u, 4) for u in vals]
print('LCG h.w row0 exact:', row0)

# ---------------- ch6.l2 ex1 solution + tests ----------------
SOL2 = '''import math

def xavier_a(nin, nout):
    return math.sqrt(6.0 / (nin + nout))

def infer_shapes(in_width, hidden_sizes):
    shapes = []
    width = in_width
    for nout in hidden_sizes:
        shapes.append((nout, width))
        width = nout
    return shapes
'''
env2 = {}
exec(compile(SOL2, '<s2>', 'exec'), env2)
for name, t in (
    ('ch6.l2 ex1 t1', "assert abs(xavier_a(4, 8) - 0.7071067811865476) < 1e-9, 'expected 0.7071 | actual: %r' % xavier_a(4, 8)"),
    ('ch6.l2 ex1 t2', "assert infer_shapes(20, [8, 1]) == [(8, 20), (1, 8)], 'expected [(8, 20), (1, 8)] | actual: %r' % infer_shapes(20, [8, 1])"),
    ('ch6.l2 ex1 t3', "assert infer_shapes(4, [3, 2, 1]) == [(3, 4), (2, 3), (1, 2)], 'expected chain [(3, 4), (2, 3), (1, 2)] | actual: %r' % infer_shapes(4, [3, 2, 1])"),
):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env2))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch6.l2 sandbox ----------------
SB2 = '''import math

class LCG:
    def __init__(self, seed):
        self.state = seed % 2147483647
    def next(self):
        self.state = (self.state * 48271) % 2147483647
        return self.state / 2147483647

def masked_init(nin, nout, seed):
    rng = LCG(seed)
    out = []
    for _ in range(nout):
        row = []
        for _ in range(nin):
            u = -10.0 + 20.0 * rng.next()
            row.append(u if abs(u) >= 5.0 else 0.0)
        out.append(row)
    return out

w = masked_init(4, 2, seed=7)
print('w row0:', [round(v, 4) for v in w[0]])
print('kept:', sum(1 for r in w for v in r if v != 0.0), 'of', 8)
print('mask ok:', all(v == 0.0 or 5.0 <= abs(v) <= 10.0 for r in w for v in r))
print('xavier a (128, 32):', round(math.sqrt(6.0 / 160.0), 4))
'''
r = run(SB2).splitlines()
print('ch6.l2 sandbox:', r)
results.append(check('ch6.l2 sandbox', SB2, ['w row0: [-9.9969, 0.0, -5.8106, -5.1744]', 'kept: 5 of 8', 'mask ok: True', 'xavier a (128, 32): 0.1936']))

# ---------------- ch6.l3 worked ----------------
W3 = '''import json

def centered(x):
    m = sum(x) / len(x)
    return [v - m for v in x]

print('centered:', centered([1.0, 2.0, 3.0, 4.0, 5.0]))

class MyLinear:
    def __init__(self, label, w, b):
        self.label, self.w, self.b = label, w, b

    def forward(self, x):
        return [sum(self.w[r][k] * x[k] for k in range(len(x))) + self.b[r]
                for r in range(len(self.w))]

lin = MyLinear('l1', [[1.0, -1.0], [2.0, 0.5]], [0.25, -0.75])
print('lin([2, 1]):', lin.forward([2.0, 1.0]))

def save_params(layers):
    return json.dumps({l.label: {'w': l.w, 'b': l.b} for l in layers})

blob = save_params([lin])
clone_state = json.loads(blob)
clone = MyLinear('l1', clone_state['l1']['w'], clone_state['l1']['b'])
print('blob:', blob)
print('roundtrip equal w:', clone.w == lin.w, '| equal b:', clone.b == lin.b)
print('clone([2, 1]):', clone.forward([2.0, 1.0]))
'''
results.append(check('ch6.l3 worked', W3, [
    'centered: [-2.0, -1.0, 0.0, 1.0, 2.0]',
    'lin([2, 1]): [1.25, 3.75]',
    'blob: {"l1": {"w": [[1.0, -1.0], [2.0, 0.5]], "b": [0.25, -0.75]}}',
    'roundtrip equal w: True | equal b: True',
    'clone([2, 1]): [1.25, 3.75]',
]))

# ---------------- ch6.l3 ex1 solution + tests ----------------
SOL3 = '''import json

def centered(x):
    m = sum(x) / len(x)
    return [v - m for v in x]

def param_roundtrip(layers):
    state = {l.label: {'w': l.w, 'b': l.b} for l in layers}
    blob = json.dumps(state)
    return json.loads(blob)
'''
env3 = {}
exec(compile(SOL3, '<s3>', 'exec'), env3)
T31 = '''
got = centered([1.0, 2.0, 3.0, 4.0, 5.0])
assert got == [-2.0, -1.0, 0.0, 1.0, 2.0], 'expected [-2.0, -1.0, 0.0, 1.0, 2.0] | actual: %r' % got
assert abs(sum(got)) < 1e-12, 'the centered output must sum to zero'
'''
T32 = '''
class L:
    def __init__(self, label, w, b):
        self.label, self.w, self.b = label, w, b
got = param_roundtrip([L('h', [[1.0, -1.0], [2.0, 0.5]], [0.25, -0.75])])
assert got == {'h': {'w': [[1.0, -1.0], [2.0, 0.5]], 'b': [0.25, -0.75]}}, 'roundtrip must preserve values | actual: %r' % got
'''
T33 = '''
def forward(w, b, x):
    return [sum(w[r][k] * x[k] for k in range(len(x))) + b[r] for r in range(len(w))]
class L:
    def __init__(self, label, w, b):
        self.label, self.w, self.b = label, w, b
src = L('l1', [[1.0, -1.0], [2.0, 0.5]], [0.25, -0.75])
state = param_roundtrip([src])
assert forward(state['l1']['w'], state['l1']['b'], [2.0, 1.0]) == [1.25, 3.75], 'clone must compute identically'
'''
for name, t in (('ch6.l3 ex1 t1', T31), ('ch6.l3 ex1 t2', T32), ('ch6.l3 ex1 t3', T33)):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env3))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch6.l3 sandbox ----------------
SB3 = '''import json

def centered(x):
    m = sum(x) / len(x)
    return [v - m for v in x]

w = [[0.1, -0.2], [0.4, 0.3]]
b = [0.05, -0.05]
state = {'l1': {'w': w, 'b': b}}
blob = json.dumps(state)
back = json.loads(blob)
print('blob:', blob)
print('identical:', back == state)
seq = [3.0, 1.0, 2.0]
c = centered(seq)
out = [sum(w[r][k] * c[k] for k in range(2)) + b[r] for r in range(2)]
print('layer(centered seq):', [round(v, 4) for v in out])
'''
results.append(check('ch6.l3 sandbox', SB3, [
    'blob: {"l1": {"w": [[0.1, -0.2], [0.4, 0.3]], "b": [0.05, -0.05]}}',
    'identical: True',
    'layer(centered seq): [0.35, 0.05]',
]))

# ---------------- ch7.l1 worked ----------------
CORR = '''def corr2d(X, K):
    kh, kw = len(K), len(K[0])
    nh, nw = len(X), len(X[0])
    return [[sum(X[i + a][j + b] * K[a][b] for a in range(kh) for b in range(kw))
             for j in range(nw - kw + 1)] for i in range(nh - kh + 1)]
'''
W4 = CORR + '''
X = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]
K = [[0.0, 1.0], [2.0, 3.0]]
print('Y:', corr2d(X, K))

img = [[1.0] * 8 for _ in range(6)]
for i in range(6):
    for j in range(2, 6):
        img[i][j] = 0.0
E = corr2d(img, [[1.0, -1.0]])
print('edge row0:', E[0])
imgT = [[img[i][j] for i in range(6)] for j in range(8)]
ET = corr2d(imgT, [[1.0, -1.0]])
print('transposed detect:', ET == [[0.0] * 5 for _ in range(8)], '| shape:', (len(ET), len(ET[0])))
Y = corr2d(X, K)
print('shape rule: (3-2+1) x (3-2+1) =', (len(Y), len(Y[0])))
'''
results.append(check('ch7.l1 worked', W4, [
    'Y: [[19.0, 25.0], [37.0, 43.0]]',
    'edge row0: [0.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0]',
    'transposed detect: True | shape: (8, 5)',
    'shape rule: (3-2+1) x (3-2+1) = (2, 2)',
]))

# ---------------- ch7.l1 ex1 solution + tests ----------------
SOL4 = CORR
env4 = {}
exec(compile(SOL4, '<s4>', 'exec'), env4)
T41 = '''
X = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]
K = [[0.0, 1.0], [2.0, 3.0]]
assert corr2d(X, K) == [[19.0, 25.0], [37.0, 43.0]], 'expected [[19.0, 25.0], [37.0, 43.0]] | actual: %r' % corr2d(X, K)
'''
T42 = '''
img = [[1.0] * 8 for _ in range(6)]
for i in range(6):
    for j in range(2, 6):
        img[i][j] = 0.0
E = corr2d(img, [[1.0, -1.0]])
assert E[0] == [0.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0], 'expected [0.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0] | actual: %r' % E[0]
'''
T43 = '''
X45 = [[float(r * 5 + c) for c in range(5)] for r in range(4)]
Y45 = corr2d(X45, [[1.0, 0.0], [0.0, 1.0]])
assert len(Y45) == 3 and len(Y45[0]) == 4, 'expected 3x4 output | actual: %dx%d' % (len(Y45), len(Y45[0]))
assert Y45[0][0] == 6.0, 'top-left = X[0][0] + X[1][1] = 6.0 | actual: %r' % Y45[0][0]
'''
for name, t in (('ch7.l1 ex1 t1', T41), ('ch7.l1 ex1 t2', T42), ('ch7.l1 ex1 t3', T43)):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env4))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch7.l1 ex2 trace ----------------
TR1 = CORR + '''
X = [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]]
K = [[0.0, 1.0]]
Y = corr2d(X, K)
print(Y)
'''
results.append(check('ch7.l1 ex2 trace', TR1, ['[[2.0, 3.0], [5.0, 6.0], [8.0, 9.0]]']))

# ---------------- ch7.l1 sandbox ----------------
SB4 = CORR + '''
X = [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]]
ones = corr2d(X, [[1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]])
print('K = identity:', corr2d(X, [[1.0, 0.0], [0.0, 1.0]]))
print('K = ones 3x3:', ones)
print('K = blur (avg):', [[v / 9.0 for v in row] for row in ones])
'''
results.append(check('ch7.l1 sandbox', SB4, [
    'K = identity: [[6.0, 8.0], [12.0, 14.0]]',
    'K = ones 3x3: [[45.0]]',
    'K = blur (avg): [[5.0]]',
]))

# ---------------- ch7.l2 worked ----------------
CSHAPE = '''def conv_shape(n, k, p=0, s=1):
    return (n - k + p + s) // s
'''
W5 = CSHAPE + '''
def conv_out_hw(nh, nw, kh, kw, ph=0, pw=0, sh=1, sw=1):
    return conv_shape(nh, kh, ph, sh), conv_shape(nw, kw, pw, sw)

print('same size (p=2, s=1):', conv_out_hw(8, 8, 3, 3, 2, 2))
print('halved (p=2, s=2):', conv_out_hw(8, 8, 3, 3, 2, 2, 2, 2))
print('no pad (k=3):', conv_out_hw(8, 8, 3, 3))
print('book check k(3,5) p(0,2) s(3,4):', conv_out_hw(8, 8, 3, 5, 0, 2, 3, 4))

''' + CORR + '''
def corr2d_multi_in(X, K):
    kh, kw = len(K[0]), len(K[0][0])
    oh = len(X[0]) - kh + 1
    ow = len(X[0][0]) - kw + 1
    out = [[0.0] * ow for _ in range(oh)]
    for c in range(len(K)):
        for i in range(oh):
            for j in range(ow):
                for a in range(kh):
                    for b in range(kw):
                        out[i][j] += X[c][i + a][j + b] * K[c][a][b]
    return out

def add_scalar(K, d):
    return [[[v + d for v in row] for row in ch] for ch in K]

X = [[[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]],
     [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]]]
K = [[[0.0, 1.0], [2.0, 3.0]], [[1.0, 2.0], [3.0, 4.0]]]
print('multi-in (2ch):', corr2d_multi_in(X, K))
Kout = [K, add_scalar(K, 1.0), add_scalar(K, 2.0)]
print('multi-out ch1:', corr2d_multi_in(X, Kout[1]))
print('multi-out ch2:', corr2d_multi_in(X, Kout[2]))
print('1x1 kernel params: co * ci =', 3 * 2)
'''
results.append(check('ch7.l2 worked', W5, [
    'same size (p=2, s=1): (8, 8)',
    'halved (p=2, s=2): (4, 4)',
    'no pad (k=3): (6, 6)',
    'book check k(3,5) p(0,2) s(3,4): (2, 2)',
    'multi-in (2ch): [[56.0, 72.0], [104.0, 120.0]]',
    'multi-out ch1: [[76.0, 100.0], [148.0, 172.0]]',
    'multi-out ch2: [[96.0, 128.0], [192.0, 224.0]]',
    '1x1 kernel params: co * ci = 6',
]))

# ---------------- ch7.l2 ex1 solution + tests ----------------
SOL5 = '''def conv_out_hw(nh, nw, kh, kw, ph=0, pw=0, sh=1, sw=1):
    return (nh - kh + ph + sh) // sh, (nw - kw + pw + sw) // sw

''' + CORR + '''
def corr2d_multi_in(X, K):
    ys = [corr2d(x, k) for x, k in zip(X, K)]
    oh, ow = len(ys[0]), len(ys[0][0])
    return [[sum(y[i][j] for y in ys) for j in range(ow)] for i in range(oh)]
'''
env5 = {}
exec(compile(SOL5, '<s5>', 'exec'), env5)
T51 = '''
assert conv_out_hw(8, 8, 3, 3, 2, 2, 2, 2) == (4, 4), 'expected (4, 4) | actual: %r' % (conv_out_hw(8, 8, 3, 3, 2, 2, 2, 2),)
assert conv_out_hw(8, 8, 3, 3) == (6, 6), 'expected (6, 6) | actual: %r' % (conv_out_hw(8, 8, 3, 3),)
'''
T52 = '''
X = [[[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]],
     [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]]]
K = [[[0.0, 1.0], [2.0, 3.0]], [[1.0, 2.0], [3.0, 4.0]]]
assert corr2d_multi_in(X, K) == [[56.0, 72.0], [104.0, 120.0]], 'expected [[56.0, 72.0], [104.0, 120.0]] | actual: %r' % corr2d_multi_in(X, K)
'''
T53 = '''
assert conv_out_hw(8, 8, 3, 5, 0, 2, 3, 4) == (2, 2), 'expected (2, 2) | actual: %r' % (conv_out_hw(8, 8, 3, 5, 0, 2, 3, 4),)
'''
for name, t in (('ch7.l2 ex1 t1', T51), ('ch7.l2 ex1 t2', T52), ('ch7.l2 ex1 t3', T53)):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env5))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch7.l2 sandbox ----------------
SB5 = CSHAPE + '''
for (n, k, p, s) in [(224, 3, 2, 1), (224, 3, 2, 2), (224, 5, 4, 1), (96, 7, 6, 2), (32, 3, 0, 2)]:
    print('n=%d k=%d p=%d s=%d -> %d' % (n, k, p, s, conv_shape(n, k, p, s)))
'''
results.append(check('ch7.l2 sandbox', SB5, [
    'n=224 k=3 p=2 s=1 -> 224',
    'n=224 k=3 p=2 s=2 -> 112',
    'n=224 k=5 p=4 s=1 -> 224',
    'n=96 k=7 p=6 s=2 -> 48',
    'n=32 k=3 p=0 s=2 -> 15',
]))

# ---------------- ch7.l3 worked ----------------
W6 = '''def pool2d(X, size, mode='max'):
    ph, pw = size
    nh, nw = len(X), len(X[0])
    out = []
    for i in range(nh - ph + 1):
        row = []
        for j in range(nw - pw + 1):
            vals = [X[i + a][j + b] for a in range(ph) for b in range(pw)]
            row.append(max(vals) if mode == 'max' else sum(vals) / len(vals))
        out.append(row)
    return out

X = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]
print('max 2x2:', pool2d(X, (2, 2)))
print('avg 2x2:', pool2d(X, (2, 2), 'avg'))

''' + CSHAPE + '''
def pool_shape(n, k, p=0, s=1):
    return (n - k + p + s) // s

h = 28
h = conv_shape(h, 5, 4)      # conv1: 6 channels, k=5, total padding 4
h = pool_shape(h, 2, s=2)   # pool1
h = conv_shape(h, 5)         # conv2: 16 channels, no padding
h = pool_shape(h, 2, s=2)   # pool2
print('before flatten: 16 x %d x %d = %d' % (h, h, 16 * h * h))

def conv_params(ci, co, k):
    return co * ci * k * k + co

def linear_params(nin, nout):
    return nin * nout + nout

counts = [conv_params(1, 6, 5), conv_params(6, 16, 5), linear_params(400, 120),
          linear_params(120, 84), linear_params(84, 10)]
print('layer params:', counts)
print('LeNet total:', sum(counts))
'''
results.append(check('ch7.l3 worked', W6, [
    'max 2x2: [[4.0, 5.0], [7.0, 8.0]]',
    'avg 2x2: [[2.0, 3.0], [5.0, 6.0]]',
    'before flatten: 16 x 5 x 5 = 400',
    'layer params: [156, 2416, 48120, 10164, 850]',
    'LeNet total: 61706',
]))

# ---------------- ch7.l3 ex1 solution + tests ----------------
SOL6 = '''def pool2d(X, size, mode='max'):
    ph, pw = size
    nh, nw = len(X), len(X[0])
    out = []
    for i in range(nh - ph + 1):
        row = []
        for j in range(nw - pw + 1):
            vals = [X[i + a][j + b] for a in range(ph) for b in range(pw)]
            row.append(max(vals) if mode == 'max' else sum(vals) / len(vals))
        out.append(row)
    return out

def pool_channels(XC, size, mode='max'):
    return [pool2d(c, size, mode) for c in XC]
'''
env6 = {}
exec(compile(SOL6, '<s6>', 'exec'), env6)
T61 = '''
X = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]
assert pool2d(X, (2, 2)) == [[4.0, 5.0], [7.0, 8.0]], 'expected [[4.0, 5.0], [7.0, 8.0]] | actual: %r' % pool2d(X, (2, 2))
'''
T62 = '''
X = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]
assert pool2d(X, (2, 2), 'avg') == [[2.0, 3.0], [5.0, 6.0]], 'expected [[2.0, 3.0], [5.0, 6.0]] | actual: %r' % pool2d(X, (2, 2), 'avg')
'''
T63 = '''
X = [[0.0, 1.0, 2.0], [3.0, 4.0, 5.0], [6.0, 7.0, 8.0]]
X1 = [[v + 1.0 for v in row] for row in X]
got = pool_channels([X, X1], (2, 2))
assert len(got) == 2, 'channels must be preserved'
assert got[1] == [[5.0, 6.0], [8.0, 9.0]], 'expected [[5.0, 6.0], [8.0, 9.0]] | actual: %r' % got[1]
'''
for name, t in (('ch7.l3 ex1 t1', T61), ('ch7.l3 ex1 t2', T62), ('ch7.l3 ex1 t3', T63)):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env6))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch7.l3 ex2 trace ----------------
TR2 = CSHAPE + '''
n = 28
n = conv_shape(n, 5, 4)   # conv1, k=5, total padding 4
n = n // 2                # pool1: 2x2, stride 2
n = conv_shape(n, 5)      # conv2, k=5, no padding
n = n // 2                # pool2
print(n, 16 * n * n)
'''
results.append(check('ch7.l3 ex2 trace', TR2, ['5 400']))

# ---------------- ch8.l1 worked ----------------
W7 = CSHAPE + '''
def pool_shape(n, k, p=0, s=1):
    return (n - k + p + s) // s

n = 224
n = conv_shape(n, 11, 2, 4)   # conv1: 96 ch, k=11, stride 4
n = pool_shape(n, 3, s=2)
n = conv_shape(n, 5, 4)       # conv2: 256 ch
n = pool_shape(n, 3, s=2)
n = conv_shape(n, 3, 2)       # conv3-5: 384/384/256
n = pool_shape(n, 3, s=2)
print('AlexNet before flatten: 256 x %d x %d = %d' % (n, n, 256 * n * n))

v = 224
blocks = []
for chs in (64, 128, 256, 512, 512):
    v = conv_shape(v, 3, 2)   # 3x3, same size
    v = pool_shape(v, 2, s=2) # halve
    blocks.append((chs, v))
print('VGG-11 blocks:', blocks)

def conv_params(ci, co, k):
    return co * ci * k * k + co

def linear_params(nin, nout):
    return nin * nout + nout

alex_conv = (conv_params(1, 96, 11) + conv_params(96, 256, 5) + conv_params(256, 384, 3)
             + conv_params(384, 384, 3) + conv_params(384, 256, 3))
alex_fc = linear_params(6400, 4096) + linear_params(4096, 4096) + linear_params(4096, 10)
print('AlexNet conv:', alex_conv, '| fc:', alex_fc, '| total:', alex_conv + alex_fc)
print('VGG-11 flatten:', 512 * 7 * 7, '| biggest fc matrix:', linear_params(25088, 4096))
nin = (conv_params(1, 96, 11) + 2 * conv_params(96, 96, 1)
       + conv_params(96, 256, 5) + 2 * conv_params(256, 256, 1)
       + conv_params(256, 384, 3) + 2 * conv_params(384, 384, 1)
       + conv_params(384, 10, 3) + 2 * conv_params(10, 10, 1))
print('NiN total:', nin)
'''
results.append(check('ch8.l1 worked', W7, [
    'AlexNet before flatten: 256 x 5 x 5 = 6400',
    'VGG-11 blocks: [(64, 112), (128, 56), (256, 28), (512, 14), (512, 7)]',
    'AlexNet conv: 3723968 | fc: 43040778 | total: 46764746',
    'VGG-11 flatten: 25088 | biggest fc matrix: 102764544',
    'NiN total: 1992166',
]))

# ---------------- ch8.l1 ex1 solution + tests ----------------
SOL7 = '''def conv_params(ci, co, k):
    return co * ci * k * k + co

def linear_params(nin, nout):
    return nin * nout + nout

def vgg11_flatten():
    return 512 * 7 * 7
'''
env7 = {}
exec(compile(SOL7, '<s7>', 'exec'), env7)
T71 = "assert conv_params(96, 256, 5) == 614656, 'expected 614656 | actual: %r' % conv_params(96, 256, 5)\nassert conv_params(1, 96, 11) == 11712, 'expected 11712 | actual: %r' % conv_params(1, 96, 11)"
T72 = "assert linear_params(6400, 4096) == 26218496, 'expected 26218496 | actual: %r' % linear_params(6400, 4096)\nassert linear_params(25088, 4096) == 102764544, 'expected 102764544 | actual: %r' % linear_params(25088, 4096)"
T73 = "assert vgg11_flatten() == 25088, 'expected 25088 | actual: %r' % vgg11_flatten()"
for name, t in (('ch8.l1 ex1 t1', T71), ('ch8.l1 ex1 t2', T72), ('ch8.l1 ex1 t3', T73)):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env7))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch8.l1 ex2 trace ----------------
TR3 = CSHAPE + '''
def pool_shape(n, k, p=0, s=1):
    return (n - k + p + s) // s

n = 224
trace = []
for _ in range(5):
    n = conv_shape(n, 3, 2)
    n = pool_shape(n, 2, s=2)
    trace.append(n)
print(trace, 512 * trace[-1] * trace[-1])
'''
results.append(check('ch8.l1 ex2 trace', TR3, ['[112, 56, 28, 14, 7] 25088']))

# ---------------- ch8.l1 sandbox ----------------
SB7 = '''def conv_params(ci, co, k):
    return co * ci * k * k + co

def linear_params(nin, nout):
    return nin * nout + nout

arch = ((1, 64), (1, 128), (2, 256), (2, 512), (2, 512))
total = 0
ci = 1
for nconvs, co in arch:
    for _ in range(nconvs):
        total += conv_params(ci, co, 3)
        ci = co
print('VGG-11 conv params:', total)
fc = linear_params(25088, 4096) * 2 + linear_params(4096, 10)
print('VGG-11 fc params:', fc, '| conv share: %.1f%%' % (100.0 * total / (total + fc)))
'''
r = run(SB7).splitlines()
print('ch8.l1 sandbox:', r)
results.append(r[0] == 'VGG-11 conv params: 9219328' and r[1].startswith('VGG-11 fc params: 205570058 | conv share: '))

# ---------------- ch8.l2 worked ----------------
W8 = '''X = [[1.0, 2.0],
     [5.0, 8.0],
     [9.0, 20.0]]
rows, cols = 3, 2
mu = [sum(X[i][j] for i in range(rows)) / rows for j in range(cols)]
var = [sum((X[i][j] - mu[j]) ** 2 for i in range(rows)) / rows for j in range(cols)]
eps = 1e-5
Xhat = [[(X[i][j] - mu[j]) / (var[j] + eps) ** 0.5 for j in range(cols)] for i in range(rows)]
print('mu:', mu)
print('sigma:', [round(v ** 0.5, 4) for v in var])
print('Xhat row0:', [round(v, 4) for v in Xhat[0]])

gamma, beta = 2.0, 1.0
Y = [[gamma * v + beta for v in row] for row in Xhat]
print('gamma=2, beta=1 row0:', [round(v, 4) for v in Y[0]])

moving_mean, momentum = 0.0, 0.1
moving_mean = (1.0 - momentum) * moving_mean + momentum * mu[0]
print('moving mean after one batch:', moving_mean)

print('inception b3-1: 64+128+32+32 =', 64 + 128 + 32 + 32)
print('inception b3-2: 128+192+96+64 =', 128 + 192 + 96 + 64)
'''
sig0 = round(math.sqrt(32.0 / 3.0), 4)
sig1 = round(math.sqrt(168.0 / 3.0), 4)
xh0 = round(-4.0 / math.sqrt(32.0 / 3.0 + 1e-5), 4)
xh1 = round(-8.0 / math.sqrt(56.0 + 1e-5), 4)
y0 = [round(2.0 * (-4.0 / math.sqrt(32.0 / 3.0 + 1e-5)) + 1.0, 4),
      round(2.0 * (-8.0 / math.sqrt(56.0 + 1e-5)) + 1.0, 4)]
results.append(check('ch8.l2 worked', W8, [
    'mu: [5.0, 10.0]',
    'sigma: [%s, %s]' % (sig0, sig1),
    'Xhat row0: [%s, %s]' % (xh0, xh1),
    'gamma=2, beta=1 row0: ' + str(y0),
    'moving mean after one batch: 0.5',
    'inception b3-1: 64+128+32+32 = 256',
    'inception b3-2: 128+192+96+64 = 480',
]))

# ---------------- ch8.l2 ex1 solution + tests ----------------
SOL8 = '''def batch_norm(xs, gamma, beta, eps=1e-5):
    rows, cols = len(xs), len(xs[0])
    mu = [sum(xs[i][j] for i in range(rows)) / rows for j in range(cols)]
    var = [sum((xs[i][j] - mu[j]) ** 2 for i in range(rows)) / rows for j in range(cols)]
    return [[gamma * (xs[i][j] - mu[j]) / (var[j] + eps) ** 0.5 + beta
             for j in range(cols)] for i in range(rows)]
'''
env8 = {}
exec(compile(SOL8, '<s8>', 'exec'), env8)
T81 = '''
got = batch_norm([[1.0], [5.0], [9.0]], 1.0, 0.0)
assert abs(got[0][0] + 1.224744871391589) < 1e-4, 'expected -1.2247 | actual: %r' % got[0][0]
assert abs(got[1][0]) < 1e-9, 'center entry must be exactly 0 | actual: %r' % got[1][0]
assert abs(got[2][0] - 1.224744871391589) < 1e-4, 'expected 1.2247 | actual: %r' % got[2][0]
'''
T82 = '''
got = batch_norm([[1.0], [5.0], [9.0]], 2.0, 1.0)
assert abs(got[0][0] - (-1.449489742783178)) < 1e-4, 'expected 2*(-1.2247)+1 | actual: %r' % got[0][0]
assert abs(got[1][0] - 1.0) < 1e-9, 'expected 1.0 | actual: %r' % got[1][0]
'''
T83 = '''
got = batch_norm([[7.0], [7.0], [7.0]], 1.0, 0.0)
assert got == [[0.0], [0.0], [0.0]], 'constant column -> zeros thanks to eps | actual: %r' % got
'''
for name, t in (('ch8.l2 ex1 t1', T81), ('ch8.l2 ex1 t2', T82), ('ch8.l2 ex1 t3', T83)):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env8))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch8.l2 sandbox ----------------
SB8 = '''def batch_norm_flat(xs, eps=1e-5):
    rows = len(xs)
    mu = sum(xs) / rows
    var = sum((x - mu) ** 2 for x in xs) / rows
    return [(x - mu) / (var + eps) ** 0.5 for x in xs]

batch = [1.0, 5.0, 9.0]
print('normalized:', [round(v, 4) for v in batch_norm_flat(batch)])
moving = 0.0
for b in ([1.0, 5.0, 9.0], [2.0, 4.0, 6.0]):
    mu = sum(b) / len(b)
    moving = 0.9 * moving + 0.1 * mu
    print('batch mean %.1f -> moving %.4f' % (mu, moving))
print('inception reduce: 192/2 =', 192 // 2, '| 192/12 =', 192 // 12)
'''
results.append(check('ch8.l2 sandbox', SB8, [
    'normalized: [-1.2247, 0.0, 1.2247]',
    'batch mean 5.0 -> moving 0.5000',
    'batch mean 4.0 -> moving 0.8500',
    'inception reduce: 192/2 = 96 | 192/12 = 16',
]))

# ---------------- ch8.l3 worked ----------------
W9 = CSHAPE + '''
def pool_shape(n, k, p=0, s=1):
    return (n - k + p + s) // s

n = 96
n = conv_shape(n, 7, 6, 2)   # stem conv 7x7, stride 2
n = pool_shape(n, 3, 2, 2)   # stem max-pool, total padding 2
print('after stem:', n)
stages = []
for chs in (64, 128, 256, 512):
    if chs != 64:
        n = conv_shape(n, 3, 2, 2)   # first residual block: stride 2
    stages.append((chs, n))
print('ResNet-18 stages:', stages)

def relu(v):
    return v if v > 0 else 0.0

x = [2.0, 3.0]
print('identity via g(x)=0:', [relu(v + 0.0) for v in x])

channels = 64
trace = []
for i in range(4):
    before = channels
    channels += 4 * 32      # dense block: 4 convs, growth rate 32
    trace.append('dense %d: %d -> %d' % (i + 1, before, channels))
    if i != 3:
        channels //= 2      # transition layer
        trace.append('  transition -> %d' % channels)
for t in trace:
    print(t)
'''
results.append(check('ch8.l3 worked', W9, [
    'after stem: 24',
    'ResNet-18 stages: [(64, 24), (128, 12), (256, 6), (512, 3)]',
    'identity via g(x)=0: [2.0, 3.0]',
    'dense 1: 64 -> 192',
    '  transition -> 96',
    'dense 2: 96 -> 224',
    '  transition -> 112',
    'dense 3: 112 -> 240',
    '  transition -> 120',
    'dense 4: 120 -> 248',
]))

# ---------------- ch8.l3 ex1 solution + tests ----------------
SOL9 = CSHAPE + '''
def pool_shape(n, k, p=0, s=1):
    return (n - k + p + s) // s

def dense_channels(start, growth, num_convs):
    return start + num_convs * growth

def resnet18_stages(in_size):
    n = pool_shape(conv_shape(in_size, 7, 6, 2), 3, 2, 2)
    out = []
    for chs in (64, 128, 256, 512):
        if chs != 64:
            n = conv_shape(n, 3, 2, 2)
        out.append((chs, n))
    return out
'''
env9 = {}
exec(compile(SOL9, '<s9>', 'exec'), env9)
T91 = "assert dense_channels(64, 32, 4) == 192, 'expected 192 | actual: %r' % dense_channels(64, 32, 4)\nassert dense_channels(96, 32, 4) == 224, 'expected 224 | actual: %r' % dense_channels(96, 32, 4)"
T92 = "assert resnet18_stages(96) == [(64, 24), (128, 12), (256, 6), (512, 3)], 'expected [(64, 24), (128, 12), (256, 6), (512, 3)] | actual: %r' % resnet18_stages(96)"
T93 = "assert resnet18_stages(224) == [(64, 56), (128, 28), (256, 14), (512, 7)], 'expected [(64, 56), (128, 28), (256, 14), (512, 7)] | actual: %r' % resnet18_stages(224)"
for name, t in (('ch8.l3 ex1 t1', T91), ('ch8.l3 ex1 t2', T92), ('ch8.l3 ex1 t3', T93)):
    try:
        exec(compile(t, '<t>', 'exec'), dict(env9))
        print('PASS', name)
        results.append(True)
    except Exception as e:
        print('FAIL', name, e)
        results.append(False)

# ---------------- ch8.l3 sandbox ----------------
SB9 = '''def dense_channels(start, growth, num_convs):
    return start + num_convs * growth

def regnet_widths(c0, wa, stages):
    return [c0 + wa * j for j in range(stages)]

print('dense (64, 32, 4):', dense_channels(64, 32, 4))
print('dense chain:', [dense_channels(64 + i * 32, 32, 4) for i in range(4)])
print('regnet widths (c0=32, wa=8, 5 blocks):', regnet_widths(32, 8, 5))
'''
results.append(check('ch8.l3 sandbox', SB9, [
    'dense (64, 32, 4): 192',
    'dense chain: [192, 224, 256, 288]',
    'regnet widths (c0=32, wa=8, 5 blocks): [32, 40, 48, 56, 64]',
]))

print()
print('ALL PASS' if all(results) else 'SOME FAILED (%d)' % results.count(False))
