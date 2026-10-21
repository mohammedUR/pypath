#!/usr/bin/env python3
"""Verify EVERY literal for task 20-c (d2l ch10 l3/l4, ch11 l1-l3) under CPython 3."""
import math

print("=" * 30, "ch10.l3 worked: MT pipeline", "=" * 30)

def preprocess(line):
    line = line.lower()
    out = []
    for i, ch in enumerate(line):
        if ch in ',.!?' and i > 0 and line[i - 1] != ' ':
            out.append(' ')
        out.append(ch)
    return ''.join(out)

pairs = [('Go.', 'Va !'), ('Hi.', 'Salut !'), ('Who?', 'Qui ?'), ('Wow!', 'Ça alors !'), ('He is calm .', 'Il est calme .')]
NUM_STEPS = 6

def pad(seq, n):
    return (seq + ['<pad>'] * n)[:n]

for src, tgt in pairs:
    s = [t for t in (preprocess(src) + ' <eos>').split(' ') if t]
    t = [tk for tk in (preprocess(tgt) + ' <eos>').split(' ') if tk]
    s = pad(s, NUM_STEPS)
    t = pad(t, NUM_STEPS)
    full = ['<bos>'] + t          # the book: prepend <bos>, then slice
    dec_in, label = full[:-1], full[1:]
    valid_len = sum(1 for tk in s if tk != '<pad>')
    print('src  :', ' '.join(s), '| valid_len =', valid_len)
    print('decin:', ' '.join(dec_in))
    print('label:', ' '.join(label))

print("=" * 30, "ch10.l3 ex1 build_target", "=" * 30)

def build_target(tokens, num_steps):
    seq = (tokens + ['<eos>'])[:num_steps]
    seq = seq + ['<pad>'] * (num_steps - len(seq))
    full = ['<bos>'] + seq
    return full[:-1], full[1:]

print(build_target(['va', '!'], 3))
print(build_target(['salut', 'ça', 'alors', '!'], 2))
print(build_target(['va'], 4))
assert build_target(['va', '!'], 3) == (['<bos>', 'va', '!'], ['va', '!', '<eos>'])
assert build_target(['salut', 'ça', 'alors', '!'], 2) == (['<bos>', 'salut'], ['salut', 'ça'])

print("=" * 30, "ch10.l3 sandbox: min_freq vocab", "=" * 30)
corpus = [['go', '.'], ['hi', '.'], ['run', '.'], ['run', '.'], ['who', '?'], ['wow', '!']]
counts = {}
for sent in corpus:
    for tok in sent:
        counts[tok] = counts.get(tok, 0) + 1
vocab = sorted(t for t, c in counts.items() if c >= 2)
print('counts:', counts)
print('kept  :', vocab)
print('rest become <unk>:', sorted(t for t, c in counts.items() if c < 2))

print("=" * 30, "ch10.l4 worked: BLEU + book products + score", "=" * 30)

def ngrams(tokens, n):
    return [' '.join(tokens[i:i + n]) for i in range(len(tokens) - n + 1)]

def bleu(pred_seq, label_seq, k):
    pred, label = pred_seq.split(' '), label_seq.split(' ')
    len_pred, len_label = len(pred), len(label)
    score = math.exp(min(0, 1 - len_label / len_pred))
    for n in range(1, min(k, len_pred) + 1):
        matches = 0
        label_subs = {}
        for g in ngrams(label, n):
            label_subs[g] = label_subs.get(g, 0) + 1
        for g in ngrams(pred, n):
            if label_subs.get(g, 0) > 0:
                matches += 1
                label_subs[g] -= 1
        score *= (matches / (len_pred - n + 1)) ** (0.5 ** n)
    return score

pred, label = 'A B B C D', 'A B C D E F'
pred_toks, label_toks = pred.split(' '), label.split(' ')
for n in (1, 2, 3, 4):
    label_subs = {}
    for g in ngrams(label_toks, n):
        label_subs[g] = label_subs.get(g, 0) + 1
    matches = 0
    for g in ngrams(pred_toks, n):
        if label_subs.get(g, 0) > 0:
            matches += 1
            label_subs[g] -= 1
    print('p%d = %d/%d' % (n, matches, len(pred_toks) - n + 1))
print('bleu k=2 :', round(bleu(pred, label, 2), 4))
print('bleu k=4 :', round(bleu(pred, label, 4), 4))
print('penalty  :', round(math.exp(min(0, 1 - 6 / 2)), 4))
print('greedy   :', round(0.5 * 0.4 * 0.4 * 0.6, 4))
print('alt path :', round(0.5 * 0.3 * 0.6 * 0.6, 4))
alpha = 0.75
for seq, p in [(('A', 'B', 'C', '<eos>'), 0.048), (('A', 'C', 'B', '<eos>'), 0.054)]:
    print(seq, 'score =', round(math.log(p) / len(seq) ** alpha, 4))

print("=" * 30, "ch10.l4 ex1 beam_pick", "=" * 30)

def beam_pick(cands, alpha=0.75):
    best_seq, best_score = None, None
    for seq, p in cands:
        score = math.log(p) / (len(seq) ** alpha)
        if best_score is None or score > best_score:
            best_seq, best_score = seq, score
    return best_seq

c1 = [(('A', 'B', '<eos>'), 0.08), (('C', 'B', '<eos>'), 0.09), (('A', '<eos>'), 0.05), (('C', '<eos>'), 0.015)]
c2 = [(('B', '<eos>'), 0.09), (('A', 'B', 'C', '<eos>'), 0.081)]
print(beam_pick(c1))
print(beam_pick(c2))
print(beam_pick(c2, alpha=0.0))
assert beam_pick(c1) == ('C', 'B', '<eos>')
assert beam_pick(c2) == ('A', 'B', 'C', '<eos>')
assert beam_pick(c2, alpha=0.0) == ('B', '<eos>')
print('ex2 numeric:', 5 * 1000 * 10)

print("=" * 30, "ch10.l4 sandbox: beam search tree", "=" * 30)

P1 = {(): {'A': 0.5, 'C': 0.3, 'B': 0.15, '<eos>': 0.05}}
P2 = {
    ('A',): {'B': 0.4, 'C': 0.3, 'A': 0.2, '<eos>': 0.1},
    ('C',): {'B': 0.6, 'A': 0.2, 'C': 0.15, '<eos>': 0.05},
    ('B',): {'A': 0.3, 'C': 0.3, 'B': 0.3, '<eos>': 0.1},
}
P3 = {
    ('A', 'B'): {'<eos>': 0.4, 'C': 0.3, 'A': 0.2, 'B': 0.1},
    ('A', 'C'): {'<eos>': 0.6, 'B': 0.2, 'C': 0.1, 'A': 0.1},
    ('C', 'B'): {'<eos>': 0.5, 'B': 0.2, 'C': 0.2, 'A': 0.1},
    ('B', 'A'): {'<eos>': 0.5, 'A': 0.2, 'B': 0.2, 'C': 0.1},
    ('B', 'C'): {'<eos>': 0.5, 'C': 0.2, 'B': 0.2, 'A': 0.1},
}

def beam_search(k):
    tables = [P1, P2, P3]
    beam, done = [((), 0.0)], []
    for step in range(3):
        table = tables[step]
        cands = []
        for prefix, lp in beam:
            for tok, p in table[prefix].items():
                cands.append((prefix + (tok,), lp + math.log(p)))
        cands.sort(key=lambda c: -c[1])
        beam = cands[:k]
        finished, still = [], []
        for seq, lp in beam:
            (finished if seq[-1] == '<eos>' else still).append((seq, lp))
        done += finished
        beam = still
        print('step %d: kept %s | finished %s'
              % (step + 1,
                 [(' '.join(s), round(lp, 3)) for s, lp in beam],
                 [(' '.join(s), round(lp, 3)) for s, lp in finished]))
        if not beam:
            break
    return done

for k in (1, 2):
    done = beam_search(k)
    scored = sorted(((lp / len(s) ** 0.75, s, lp) for s, lp in done), reverse=True)
    for score, s, lp in scored:
        print('k=%d final: %s p=%.4f score=%.4f' % (k, ' '.join(s), math.exp(lp), score))

print("=" * 30, "ch11.l1 worked: scaled dot-product + masked", "=" * 30)

def softmax(scores):
    m = max(scores)
    exps = [math.exp(s - m) for s in scores]
    total = sum(exps)
    return [e / total for e in exps]

q = [1.0, 0.0]
K = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [-1.0, 0.0]]
V = [10.0, 20.0, 30.0, 40.0]
d = len(q)
scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in K]
w = softmax(scores)
print('scores :', [round(s, 4) for s in scores])
print('weights:', [round(x, 4) for x in w], '| sum =', round(sum(w), 6))
out = sum(wi * v for wi, v in zip(w, V))
print('output :', round(out, 4))

def masked_softmax(scores, valid_len, fill=-1e6):
    masked = [s if i < valid_len else fill for i, s in enumerate(scores)]
    return softmax(masked)

w2 = masked_softmax(scores, 2)
print('masked len=2:', [round(x, 4) for x in w2])
print('masked out  :', round(sum(wi * v for wi, v in zip(w2, V)), 4))
w1 = masked_softmax(scores, 1)
print('masked len=1:', [round(x, 4) for x in w1], '->', round(sum(wi * v for wi, v in zip(w1, V)), 4))
uniform = [1 / len(K)] * len(K)
print('average pooling:', sum(wi * v for wi, v in zip(uniform, V)))
one_hot = [1.0, 0.0, 0.0, 0.0]
print('exact lookup   :', sum(wi * v for wi, v in zip(one_hot, V)))

print("=" * 30, "ch11.l1 ex1 attention()", "=" * 30)

def attention(q, K, V, valid_len=None):
    d = len(q)
    sc = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in K]
    if valid_len is not None:
        sc = [s if i < valid_len else -1e6 for i, s in enumerate(sc)]
    ww = softmax(sc)
    return sum(wi * v for wi, v in zip(ww, V))

r1 = attention([1.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [10.0, 20.0], valid_len=2)
r2 = attention([1.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [10.0, 20.0], valid_len=1)
r3 = attention([0.0, 0.0], [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [-1.0, 0.0]], [10.0, 20.0, 30.0, 40.0])
print(repr(r1), repr(r2), repr(r3))
assert abs(r1 - (20 - 10 * (math.exp(1 / math.sqrt(2)) / (math.exp(1 / math.sqrt(2)) + 1)))) < 1e-9
assert abs(r2 - 10.0) < 1e-9
assert abs(r3 - 25.0) < 1e-9
print('ex2 numeric: variance stays', 1, 'after scaling (raw dot variance =', 64, ')')

print("=" * 30, "ch11.l1 sandbox: Nadaraya-Watson", "=" * 30)
xs = [1.0, 2.0, 4.0]
ys = [2 * math.sin(x) + x for x in xs]
q = 3.0

def nw_weights(q, xs, sigma):
    kernels = [math.exp(-((q - x) ** 2) / (2 * sigma ** 2)) for x in xs]
    total = sum(kernels)
    return [k / total for k in kernels]

print('ys:', [round(y, 4) for y in ys], '| true f(3) =', round(2 * math.sin(3) + 3, 4))
for sigma in (1.0, 0.5):
    w = nw_weights(q, xs, sigma)
    f = sum(wi * y for wi, y in zip(w, ys))
    print('sigma=%.1f weights=%s f(3)=%.4f' % (sigma, [round(x, 4) for x in w], f))

print("=" * 30, "ch11.l2 worked: additive + 2 heads + positional", "=" * 30)

def softmax(scores):
    m = max(scores)
    exps = [math.exp(s - m) for s in scores]
    t = sum(exps)
    return [e / t for e in exps]

q = [1.0, 2.0]
K = [[0.5, -0.5], [1.0, 1.0], [-1.0, 0.0]]
Wq = [[1.0, 0.0], [0.0, 1.0]]
Wk = [[1.0, 0.0], [0.0, -1.0]]
wv = [1.0, -1.0]

def proj(W, v):
    return [sum(W[i][j] * v[j] for j in range(len(v))) for i in range(len(W))]

scores = []
for k in K:
    feats = [a + b for a, b in zip(proj(Wq, q), proj(Wk, k))]
    tanned = [math.tanh(f) for f in feats]
    scores.append(sum(w * t for w, t in zip(wv, tanned)))
print('additive scores  :', [round(s, 6) for s in scores])
w = softmax(scores)
print('attention weights:', [round(x, 4) for x in w])
context = [sum(w[i] * K[i][j] for i in range(len(K))) for j in range(2)]
print('context:', [round(c, 4) for c in context])
print('k1 exact:', math.tanh(1.5) - math.tanh(2.5))

X = [[1.0, 0.0], [0.0, 1.0]]

def head_outputs(X, coord):
    outs = []
    for i in range(2):
        S = [X[i][coord] * X[j][coord] for j in range(2)]
        ww = softmax(S)
        outs.append(sum(ww[j] * X[j][coord] for j in range(2)))
    return outs

h1 = head_outputs(X, 0)
h2 = head_outputs(X, 1)
print('head 1:', [round(v, 4) for v in h1])
print('head 2:', [round(v, 4) for v in h2])
print('token 1 ->', [round(h1[0], 4), round(h2[0], 4)], '| token 2 ->', [round(h1[1], 4), round(h2[1], 4)])
print('softmax([1,0]):', [round(x, 4) for x in softmax([1.0, 0.0])])

d = 4
for i in range(4):
    row = []
    for j in range(d // 2):
        omega = 1.0 / (10000 ** (2 * j / d))
        row.append(math.sin(i * omega))
        row.append(math.cos(i * omega))
    print('pos %d:' % i, [round(v, 4) for v in row])

print("=" * 30, "ch11.l2 ex1 additive_score", "=" * 30)

def additive_score(q, k, Wq, Wk, wv):
    feats = []
    for row_q, row_k in zip(Wq, Wk):
        z = sum(row_q[j] * q[j] for j in range(len(q))) + sum(row_k[j] * k[j] for j in range(len(k)))
        feats.append(math.tanh(z))
    return sum(w * f for w, f in zip(wv, feats))

s1 = additive_score([1.0, 2.0], [0.5, -0.5], [[1.0, 0.0], [0.0, 1.0]], [[1.0, 0.0], [0.0, -1.0]], [1.0, -1.0])
s2 = additive_score([0.0, 0.0], [0.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [[1.0, 0.0], [0.0, 1.0]], [1.0, 1.0])
s3 = additive_score([0.5], [0.5], [[1.0]], [[1.0]], [1.0])
print(repr(s1), repr(s2), repr(s3))
assert abs(s1 - (math.tanh(1.5) - math.tanh(2.5))) < 1e-12
assert abs(s2) < 1e-12
assert abs(s3 - math.tanh(1.0)) < 1e-12

print("=" * 30, "ch11.l2 sandbox: relative position rotation", "=" * 30)

d = 6
def pos(i, j):
    omega = 1.0 / (10000 ** (2 * (j // 2) / d))
    return math.sin(i * omega) if j % 2 == 0 else math.cos(i * omega)

ok_all = True
for i in range(0, 4):
    for delta in (1, 2, 3):
        c, s = math.cos(delta), math.sin(delta)
        pi = (pos(i, 0), pos(i, 1))
        rot = (c * pi[0] + s * pi[1], -s * pi[0] + c * pi[1])
        pj = (pos(i + delta, 0), pos(i + delta, 1))
        ok = abs(rot[0] - pj[0]) < 1e-9 and abs(rot[1] - pj[1]) < 1e-9
        ok_all = ok_all and ok
        if i == 1 and delta == 2:
            print('i=1 delta=2 rotation:', [round(v, 4) for v in rot])
            print('i=1 delta=2 position:', [round(v, 4) for v in pj])
print('all 12 offsets reproduce p_{i+delta}:', ok_all)

print("=" * 30, "ch11.l3 worked: shapes + census + masked row", "=" * 30)
d, ffn, batch, T = 24, 48, 2, 9
X = (batch, T, d)
mha = 4 * d * d
ffn_params = d * ffn + ffn + ffn * d + d
ln = 2 * 2 * d
print('X shape       :', X)
print('after attn    :', X, '(multi-head attention preserves the shape)')
print('after addnorm :', X, '(residual + layer norm keep it)')
print('ffn inner     :', (batch, T, ffn), '-> back to', X)
print('mha params:', mha, '| ffn params:', ffn_params, '| addnorm params:', ln)
print('block total:', mha + ffn_params + ln)

def softmax(scores):
    m = max(scores)
    exps = [math.exp(s - m) for s in scores]
    t = sum(exps)
    return [e / t for e in exps]

scores_row = [0.9, -0.3, 0.6, 0.2]
dec_valid_len = 3
masked = [s if i < dec_valid_len else -1e6 for i, s in enumerate(scores_row)]
print('masked row:', [round(x, 4) for x in softmax(masked)])
print('plain row :', [round(x, 4) for x in softmax(scores_row)])
print('dec_valid_lens for T=4:', [1, 2, 3, 4])

print("=" * 30, "ch11.l3 ex1 vit_patch_count", "=" * 30)

def vit_patch_count(h, w, p, c):
    m = (h // p) * (w // p)
    patch_len = c * p * p
    return m, patch_len, m + 1

print(vit_patch_count(96, 96, 16, 3))
print(vit_patch_count(224, 224, 16, 3))
print(vit_patch_count(224, 224, 32, 1))
assert vit_patch_count(96, 96, 16, 3) == (36, 768, 37)
assert vit_patch_count(224, 224, 16, 3) == (196, 768, 197)
assert vit_patch_count(224, 224, 32, 1) == (49, 1024, 50)

print("=" * 30, "ch11.l3 ex2 trace: modes table", "=" * 30)
pretraining = [
    ('BERT', 'encoder-only', 350, 250),
    ('T5-11B', 'encoder-decoder', 11000, 1000),
    ('Chinchilla', 'decoder-only', 70000, 1400),
]
for name, mode, params_m, tokens_b in pretraining:
    print('%s: %s, %dM params, %dB tokens' % (name, mode, params_m, tokens_b))

print("=" * 30, "ch11.l3 sandbox: full scale table", "=" * 30)
table = [
    ('BERT', 'encoder-only', 350, 250),
    ('GPT-2', 'decoder-only', 1500, None),
    ('T5-11B', 'encoder-decoder', 11000, 1000),
    ('Megatron-Turing NLG', 'decoder-only', 530000, 270),
    ('Chinchilla', 'decoder-only', 70000, 1400),
    ('PaLM', 'decoder-only', 540000, 780),
]
for name, mode, params_m, tokens_b in table:
    tok = '40 GB of text' if tokens_b is None else '%dB tokens' % tokens_b
    print('%-21s %-16s %8dM  %s' % (name, mode, params_m, tok))

print("ALL VERIFIED OK")
