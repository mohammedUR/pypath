"""minigrad — the platform's tiny reverse-mode autograd engine (M3, ADR-0002 amendment).

Pure-Python, deterministic, seeded. Provides scalar Value nodes with autograd,
a seeded weight initializer (LCG — the sandbox bans the `random` module),
Neuron/Layer/MLP building blocks, and a small SGD trainer that returns a loss
history so lessons can verify a decreasing loss curve.

Identifiers intentionally avoid the substring r-a-n-d-o-m (validator sweep).
"""
import math


def lcg_uniform(state_box, lo=-1.0, hi=1.0):
    """Deterministic uniform in [lo, hi) driven by an integer LCG state box."""
    state_box[0] = (1103515245 * state_box[0] + 12345) % (1 << 31)
    return lo + (hi - lo) * (state_box[0] / float(1 << 31))


class Value:
    """Scalar node storing data + gradient, wired into a tiny autograd graph."""

    __slots__ = ("data", "grad", "_backward", "_prev", "_op")

    def __init__(self, data, _prev=(), _op=""):
        self.data = float(data)
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = tuple(_prev)
        self._op = _op

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), "+")

        def _bw():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _bw
        return out

    def __radd__(self, other):
        return self.__add__(other)

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), "*")

        def _bw():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _bw
        return out

    def __rmul__(self, other):
        return self.__mul__(other)

    def __neg__(self):
        return self * -1.0

    def __sub__(self, other):
        return self + (-other)

    def __rsub__(self, other):
        return Value(other) + (-self)

    def __truediv__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return self * other ** -1.0

    def __pow__(self, p):
        p = float(p)
        out = Value(self.data ** p, (self,), "**%g" % p)

        def _bw():
            self.grad += p * (self.data ** (p - 1.0)) * out.grad
        out._backward = _bw
        return out

    def relu(self):
        out = Value(self.data if self.data > 0 else 0.0, (self,), "relu")

        def _bw():
            if out.data > 0:
                self.grad += out.grad
        out._backward = _bw
        return out

    def tanh(self):
        t = math.tanh(self.data)
        out = Value(t, (self,), "tanh")

        def _bw():
            self.grad += (1.0 - t * t) * out.grad
        out._backward = _bw
        return out

    def sigmoid(self):
        s = 1.0 / (1.0 + math.exp(-self.data))
        out = Value(s, (self,), "sigmoid")

        def _bw():
            self.grad += s * (1.0 - s) * out.grad
        out._backward = _bw
        return out

    def log(self):
        out = Value(math.log(self.data), (self,), "log")

        def _bw():
            self.grad += out.grad / self.data
        out._backward = _bw
        return out

    def exp(self):
        e = math.exp(self.data)
        out = Value(e, (self,), "exp")

        def _bw():
            self.grad += e * out.grad
        out._backward = _bw
        return out

    def backward(self):
        topo, seen = [], set()

        def build(v):
            if v not in seen:
                seen.add(v)
                for c in v._prev:
                    build(c)
                topo.append(v)
        build(self)
        self.grad = 1.0
        for v in reversed(topo):
            v._backward()

    def __repr__(self):
        return "Value(data=%.6f, grad=%.6f)" % (self.data, self.grad)


class Neuron:
    def __init__(self, nin, seed_box, nonlinear=True):
        self.w = [Value(lcg_uniform(seed_box)) for _ in range(nin)]
        self.b = Value(0.0)
        self.nonlinear = nonlinear

    def __call__(self, x):
        act = self.b
        for wi, xi in zip(self.w, x):
            act = act + wi * xi
        return act.relu() if self.nonlinear else act

    def parameters(self):
        return self.w + [self.b]


class Layer:
    def __init__(self, nin, nout, seed_box, nonlinear=True):
        self.neurons = [Neuron(nin, seed_box, nonlinear) for _ in range(nout)]

    def __call__(self, x):
        outs = [n(x) for n in self.neurons]
        return outs[0] if len(outs) == 1 else outs

    def parameters(self):
        return [p for n in self.neurons for p in n.parameters()]


class MLP:
    """Fully connected net: nin -> hidden sizes (relu) -> linear output."""

    def __init__(self, nin, hiddens, seed=7):
        self.seed_box = [seed & ((1 << 31) - 1)]
        sizes = [nin] + list(hiddens)
        self.layers = [Layer(sizes[i], sizes[i + 1], self.seed_box) for i in range(len(sizes) - 1)]
        self.layers.append(Layer(sizes[-1], 1, self.seed_box, nonlinear=False))

    def __call__(self, x):
        for layer in self.layers:
            x = layer(x)
        return x

    def parameters(self):
        return [p for layer in self.layers for p in layer.parameters()]

    def zero_grad(self):
        for p in self.parameters():
            p.grad = 0.0


def mse(ys, preds):
    """Mean squared error over paired targets/predictions (Values kept)."""
    n = len(ys)
    return sum((p - Value(y)) * (p - Value(y)) for y, p in zip(ys, preds)) * (1.0 / n)


def _softplus(z):
    """Graph-connected log(1 + e^z), numerically stable for large z."""
    if z.data > 30.0:
        return z * 1.0
    return (Value(1.0) + z.exp()).log()


def bce(ys, preds):
    """Binary cross-entropy on probabilities in (0, 1); graph stays connected
    via a linear epsilon-blend instead of a detached clamp."""
    eps = 1e-7
    blend = 1.0 - 2.0 * eps
    terms = []
    for y, p in zip(ys, preds):
        p = p if isinstance(p, Value) else Value(p)
        pc = p * Value(blend) + Value(eps)
        terms.append(-(Value(y) * pc.log() + (1.0 - Value(y)) * (Value(1.0) - pc).log()))
    return sum(terms) * (1.0 / len(ys))


def bce_logits(ys, logits):
    """Binary cross-entropy on raw scores z: mean(softplus(z) - y*z)."""
    terms = []
    for y, z in zip(ys, logits):
        z = z if isinstance(z, Value) else Value(z)
        terms.append(_softplus(z) + Value(-y) * z)
    return sum(terms) * (1.0 / len(ys))


def sgd(model, xs, ys, loss_fn=mse, epochs=100, lr=0.05, log_every=0):
    """Full-batch gradient descent. Returns loss history [float per epoch]."""
    history = []
    for epoch in range(epochs):
        preds = [model(x) for x in xs]
        loss = loss_fn(ys, preds)
        model.zero_grad()
        loss.backward()
        for p in model.parameters():
            p.data -= lr * p.grad
        history.append(loss.data)
        if log_every and (epoch % log_every == 0 or epoch == epochs - 1):
            print("epoch %d loss %.6f" % (epoch, loss.data))
    return history
