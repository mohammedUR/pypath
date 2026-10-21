# Task 19-c pre-authoring verification under CPython 3 (D2L ch9+ch10+ch11)
import math
import re

print('=== ch9.l1 worked: preprocess/tokenize/vocab/bigrams ===')
corpus = 'the time machine the time traveller the time machine by h g wells'
text = re.sub('[^A-Za-z]+', ' ', corpus).lower()
tokens = list(text)
print('first 12 tokens:', tokens[:12])
idx_to_token = sorted(set(['<unk>'] + tokens))
token_to_idx = {t: i for i, t in enumerate(idx_to_token)}
print('vocab size:', len(idx_to_token))
indices = [token_to_idx[t] for t in tokens[:10]]
print('indices:', indices)
print('decoded:', ''.join(idx_to_token[i] for i in indices))
words = text.split()
print('words:', len(words), '| unique words:', len(set(words)))
bigrams = {}
for a, b in zip(words[:-1], words[1:]):
    bigrams[(a, b)] = bigrams.get((a, b), 0) + 1
top = sorted(bigrams.items(), key=lambda kv: (-kv[1], kv[0]))[:3]
print('top bigrams:', top)

print('=== ch9.l1 ex1 solution + tests ===')
def build_vocab(tokens):
    unique = sorted(set(tokens))
    idx_to_token = ['<unk>'] + unique
    token_to_idx = {t: i for i, t in enumerate(idx_to_token)}
    return token_to_idx, idx_to_token

def encode(tokens, token_to_idx):
    return [token_to_idx.get(t, 0) for t in tokens]

def decode(indices, idx_to_token):
    return [idx_to_token[i] for i in indices]

v_t2i, v_i2t = build_vocab(['a', 'b', 'a'])
print('vocab dict:', v_t2i)
print('encode a z b:', encode(['a', 'z', 'b'], v_t2i))
print('decode back:', decode([1, 0, 2], v_i2t))
assert v_t2i == {'<unk>': 0, 'a': 1, 'b': 2}
assert encode(['a', 'z', 'b'], v_t2i) == [1, 0, 2]
assert decode([1, 0, 2], v_i2t) == ['a', '<unk>', 'b']
mini_t2i, mini_i2t = build_vocab(list('the time m'))
print('mini vocab:', mini_t2i)
print('encode the:', encode(list('the'), mini_t2i))
assert encode(list('the'), mini_t2i) == [mini_t2i[c] for c in 'the']

print('=== ch9.l2 worked: n-grams + perplexity + rnn recurrence ===')
words2 = 'the time machine the time traveller the time machine by h g wells'.split()
n = len(words2)
unigram = {}
for w in words2:
    unigram[w] = unigram.get(w, 0) + 1
bigram2 = {}
for a, b in zip(words2[:-1], words2[1:]):
    bigram2[(a, b)] = bigram2.get((a, b), 0) + 1

def cond(a, b):
    return bigram2.get((a, b), 0) / unigram[a]

print('P(time | the) =', cond('the', 'time'))
print('P(machine | time) =', cond('time', 'machine'))
print('P(traveller | time) =', cond('time', 'traveller'))
p_start = unigram['the'] / n
p_seq = p_start * cond('the', 'time') * cond('time', 'machine')
print('P(the time machine) =', round(p_seq, 4))

def perplexity(probs):
    return math.exp(-sum(math.log(p) for p in probs) / len(probs))

print('ppl [0.5, 0.25, 0.25] =', round(perplexity([0.5, 0.25, 0.25]), 4))
print('uniform over 18 ->', perplexity([1 / 18] * 18))
print('ppl full value:', perplexity([0.5, 0.25, 0.25]))

def rnn_run(xs, w_x, w_h, h=0.0):
    states = []
    for x in xs:
        h = math.tanh(w_x * x + w_h * h)
        states.append(round(h, 4))
    return states

print('hidden states:', rnn_run([1.0, 0.0, -1.0], 1.0, 0.8))
assert abs(perplexity([1.0, 1.0]) - 1.0) < 1e-9
assert abs(perplexity([0.25] * 4) - 4.0) < 1e-9
assert abs(perplexity([0.5, 0.25, 0.25]) - 3.1748021039364) < 1e-6

print('=== ch9.l2 ex2 trace: shift targets ===')
toks = [21, 9, 6, 0, 21, 10, 14, 6]
num_steps = 4
inputs = toks[0:num_steps]
labels = toks[1:num_steps + 1]
print(inputs)
print(labels)

print('=== ch9.l3 worked: RNN forward + concat equivalence + clipping ===')
def matmul(A, B):
    rows, inner, cols = len(A), len(B), len(B[0])
    return [[sum(A[i][k] * B[k][j] for k in range(inner)) for j in range(cols)]
            for i in range(rows)]

W_xh = [[0.6, -0.2], [0.1, 0.5], [-0.4, 0.3]]
W_hh = [[0.5, 0.1], [-0.1, 0.4]]
b_h = [0.0, 0.0]
W_hq = [[1.0, 0.0, -1.0], [0.0, 1.0, 0.5]]
one_hot = {0: [1.0, 0.0, 0.0], 1: [0.0, 1.0, 0.0], 2: [0.0, 0.0, 1.0]}

h = [0.0, 0.0]
pre_log = []
for t, token in enumerate([0, 1], start=1):
    x = one_hot[token]
    xW = [sum(x[k] * W_xh[k][j] for k in range(3)) for j in range(2)]
    hW = [sum(h[k] * W_hh[k][j] for k in range(2)) for j in range(2)]
    pre = [xW[j] + hW[j] + b_h[j] for j in range(2)]
    h = [math.tanh(v) for v in pre]
    pre_log.append((t, [round(v, 4) for v in h]))
for t, hh in pre_log:
    print('h%d = %s' % (t, hh))
logits = [sum(h[k] * W_hq[k][j] for k in range(2)) for j in range(3)]
print('logits at t=2:', [round(v, 4) for v in logits])

x2 = one_hot[1]
xW2 = [sum(x2[k] * W_xh[k][j] for k in range(3)) for j in range(2)]
hW2 = [sum(h[k] * W_hh[k][j] for k in range(2)) for j in range(2)]
concat_W = [row[:] for row in W_xh] + [row[:] for row in W_hh]
concat_out = matmul([x2 + h], concat_W)[0]
direct = [xW2[j] + hW2[j] for j in range(2)]
max_diff = max(abs(concat_out[j] - direct[j]) for j in range(2))
print('concat equivalence (max diff %.2e):' % max_diff, max_diff < 1e-12)

g = [3.0, 4.0]
norm = math.sqrt(sum(v * v for v in g))
theta = 1.0
scale = min(1.0, theta / norm)
print('norm =', norm, '| clipped g =', [round(v * scale, 4) for v in g])

print('=== ch9.l3 ex1 solution + tests (clip_grad) ===')
def clip_grad(grad, theta):
    norm = math.sqrt(sum(v * v for v in grad))
    scale = min(1.0, theta / norm) if norm > 0 else 1.0
    return [v * scale for v in grad]

print(clip_grad([3.0, 4.0], 1.0))
print(clip_grad([3.0, 4.0], 10.0))
print(clip_grad([1.0], 0.25))
assert all(abs(a - b) < 1e-12 for a, b in zip(clip_grad([3.0, 4.0], 1.0), [0.6, 0.8]))
assert clip_grad([3.0, 4.0], 10.0) == [3.0, 4.0]
assert abs(clip_grad([1.0], 0.25)[0] - 0.25) < 1e-12

print('=== ch9.l3 ex2 trace: scalar RNN ===')
h = 0.0
states = []
for x in [1.0, 0.0, -1.0]:
    h = math.tanh(1.0 * x + 0.5 * h)
    states.append(round(h, 4))
print(states)

print('=== ch9.l3 sandbox: eigen powers ===')
for c in (0.9, 1.1):
    row = [round(c ** k, 4) for k in range(1, 7)]
    print('c=%.1f powers:' % c, row)

print('=== ch10.l1 worked: LSTM scalar steps + extremes + GRU convex ===')
def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

h, c = 0.0, 0.0
for t, x in enumerate([1.0, -1.0, 0.5], start=1):
    i_g = sigmoid(x)
    f_g = sigmoid(2.0)
    o_g = sigmoid(2.0 * x)
    c_t = math.tanh(x)
    c = f_g * c + i_g * c_t
    h = o_g * math.tanh(c)
    print('t=%d | x=%+.2f i=%.4f f=%.4f o=%.4f ct=%.4f -> c=%.4f h=%.4f'
          % (t, x, i_g, f_g, o_g, c_t, c, h))
c = 0.7
print('frozen cell:', 1.0 * c + 0.0 * math.tanh(3.0))
H_prev, H_tilde = 0.8, -0.4
for z in (1.0, 0.5, 0.0):
    print('Z=%.1f -> H = %.2f' % (z, z * H_prev + (1 - z) * H_tilde))

print('=== ch10.l1 ex1 solution + tests (gru_step) ===')
def gru_step(x, h, r, z):
    h_tilde = math.tanh(x + r * h)
    return z * h + (1 - z) * h_tilde

print(gru_step(5.0, 0.8, 1.0, 1.0))
print(gru_step(0.5, 0.0, 1.0, 0.0))
print(gru_step(0.5, 100.0, 0.0, 0.0))
assert abs(gru_step(5.0, 0.8, 1.0, 1.0) - 0.8) < 1e-12
assert abs(gru_step(0.5, 0.0, 1.0, 0.0) - math.tanh(0.5)) < 1e-12
assert abs(gru_step(0.5, 100.0, 0.0, 0.0) - math.tanh(0.5)) < 1e-12
print('LSTM params d=16 h=32:', 4 * (16 * 32 + 32 * 32 + 32))
print('GRU params:', 3 * (16 * 32 + 32 * 32 + 32))
print('plain RNN params:', 32 * (16 + 32) + 32)

print('=== ch10.l1 sandbox: forget bias sweep ===')
for bf in (-2.0, 0.0, 2.0, 5.0):
    c = 1.0
    for _ in range(3):
        c = sigmoid(bf) * c + 0.1 * math.tanh(1.0)
    print('b_f=%+.1f -> f=%.4f, cell after 3 steps: %.4f' % (bf, sigmoid(bf), c))

print('=== ch10.l2 worked: stacked + bidirectional ===')
def rnn_layer(xs, w_x, w_h):
    h = 0.0
    out = []
    for x in xs:
        h = math.tanh(w_x * x + w_h * h)
        out.append(h)
    return out

xs = [1.0, 0.5, -1.0]
layer1 = rnn_layer(xs, 1.0, 0.5)
layer2 = rnn_layer(layer1, 0.8, 0.3)
print('layer 1:', [round(v, 4) for v in layer1])
print('layer 2:', [round(v, 4) for v in layer2])
fwd = rnn_layer(xs, 1.0, 0.5)
bwd = rnn_layer(xs[::-1], -0.5, 0.2)[::-1]
print('forward :', [round(v, 4) for v in fwd])
print('backward:', [round(v, 4) for v in bwd])

print('=== ch10.l2 ex1 solution + tests (bidir) ===')
def bidir(xs, wf, hf, wb, hb):
    fwd_states = rnn_layer(xs, wf, hf)
    bwd_states = rnn_layer(xs[::-1], wb, hb)[::-1]
    return list(zip(fwd_states, bwd_states))

res = bidir([1.0], 1.0, 0.5, -0.5, 0.2)
print(res)
assert len(res) == 1
assert abs(res[0][0] - math.tanh(1.0)) < 1e-12
assert abs(res[0][1] - math.tanh(-0.5)) < 1e-12
res2 = bidir([1.0, 0.5, -1.0], 1.0, 0.5, -0.5, 0.2)
print(res2)
assert len(res2) == 3
print('bidir[0] backward vs reversed-run last:',
      res2[0][1], rnn_layer([1.0, 0.5, -1.0][::-1], -0.5, 0.2)[-1])

print('=== ch10.l3 worked: padding + shift ===')
PAD, BOS, EOS, UNK = '<pad>', '<bos>', '<eos>', '<unk>'

def tokenize(line):
    return line.split() + [EOS]

def pad_or_trim(tokens, num_steps):
    return tokens[:num_steps] if len(tokens) > num_steps else tokens + [PAD] * (num_steps - len(tokens))

pairs = [('hello .', 'bonjour .'),
         ('the cat sleeps .', 'le chat dort .'),
         ('good night .', 'bonne nuit .'),
         ('i love bread .', 'j aime le pain .')]
src = [pad_or_trim(tokenize(s), 8) for s, _ in pairs]
specials = [UNK, PAD, BOS, EOS]

def build_vocab(seqs):
    toks = sorted({t for s in seqs for t in s if t not in specials})
    idx_to_tok = specials + toks
    return {t: i for i, t in enumerate(idx_to_tok)}, idx_to_tok

src_vocab, src_itos = build_vocab(src)
tgt = [tokenize(t) for _, t in pairs]
tgt_vocab, tgt_itos = build_vocab(tgt)
print('src vocab size:', len(src_vocab), '| tgt vocab size:', len(tgt_vocab))
print('src ids row 0:', [src_vocab[t] for t in src[0]])
print('src tokens row 0:', src[0])

def valid_len(tokens):
    return sum(1 for t in tokens if t != PAD)

tgt_full = [pad_or_trim([BOS] + t, 8) for t in tgt]
dec_in = [t[:-1] for t in tgt_full]
labels = [t[1:] for t in tgt_full]
for s, d, l in zip(src, dec_in, labels):
    print('src %-38s valid_len %d' % (' '.join(s), valid_len(s)))
    print('   dec_in %-30s' % ' '.join(d))
    print('   label  %-30s' % ' '.join(l))
print('unk demo:', src_vocab.get('zebra', 0))

print('=== ch10.l3 ex1 solution + tests ===')
def pad_or_trim2(tokens, num_steps, pad='<pad>'):
    if len(tokens) > num_steps:
        return tokens[:num_steps]
    return tokens + [pad] * (num_steps - len(tokens))

def valid_len2(tokens, pad='<pad>'):
    return sum(1 for t in tokens if t != pad)

print(pad_or_trim2(['a', 'b'], 5))
print(valid_len2(pad_or_trim2(['a', 'b'], 5)))
print(pad_or_trim2(list('abcdef'), 4))
print(valid_len2(pad_or_trim2(list('abcdef'), 4)))
print(pad_or_trim2(['x', 'y'], 2), valid_len2(['x', 'y'], 2))
assert pad_or_trim2(['a', 'b'], 5) == ['a', 'b', '<pad>', '<pad>', '<pad>']
assert valid_len2(pad_or_trim2(['a', 'b'], 5)) == 2
assert pad_or_trim2(list('abcdef'), 4) == ['a', 'b', 'c', 'd']
assert valid_len2(pad_or_trim2(list('abcdef'), 4)) == 4
assert pad_or_trim2(['x', 'y'], 2) == ['x', 'y'] and valid_len2(['x', 'y']) == 2

print('=== ch10.l3 sandbox: padding waste ===')
for steps in (6, 8, 10):
    total = sum(len(pad_or_trim(tokenize(s), steps)) for s, _ in pairs)
    real = sum(valid_len(tokenize(s)) for s, _ in pairs)
    print('num_steps=%d: padded tokens=%d, real=%d, pad fraction=%.2f'
          % (steps, total, real, 1 - real / total))

print('=== ch10.l4 worked: greedy vs beam on a fixed tree ===')
tree = {
    '':    {'A': 0.5, 'B': 0.3, 'C': 0.15, '<eos>': 0.05},
    'A':   {'B': 0.4, 'C': 0.3, '<eos>': 0.25, 'A': 0.05},
    'B':   {'C': 0.4, '<eos>': 0.3, 'A': 0.2, 'B': 0.1},
    'AB':  {'C': 0.4, 'B': 0.2, '<eos>': 0.2, 'A': 0.2},
    'AC':  {'B': 0.6, '<eos>': 0.2, 'A': 0.1, 'C': 0.1},
    'ABC': {'<eos>': 0.6, 'C': 0.4},
    'ACB': {'<eos>': 0.6, 'A': 0.4},
}

def greedy_search():
    prefix, prob = '', 1.0
    while True:
        options = tree.get(prefix, {})
        if not options:
            break
        tok, p = max(options.items(), key=lambda kv: (kv[1], kv[0]))
        if tok == '<eos>':
            prob *= p
            break
        prefix = prefix + tok
        prob *= p
    return prefix, prob

def beam_search(beam_size, max_len, alpha=0.75):
    beams = [('', 1.0)]
    finished = []
    for _ in range(max_len):
        expansions = []
        for prefix, p in beams:
            for tok, q in tree.get(prefix, {}).items():
                new_p = p * q
                if tok == '<eos>':
                    finished.append((prefix, new_p))
                else:
                    expansions.append((prefix + tok, new_p))
        if not expansions:
            break
        expansions.sort(key=lambda bp: (-bp[1], bp[0]))
        beams = expansions[:beam_size]
    candidates = [c for c in finished if c[0]] or beams

    def score(item):
        prefix, prob = item
        return math.log(prob) / (len(prefix) ** alpha)

    return max(candidates, key=lambda item: (score(item), item[0]))

greedy_prefix, greedy_p = greedy_search()
print('greedy:', greedy_prefix, 'p =', greedy_p)
for k in (1, 2, 3):
    bp, bpp = beam_search(k, 4)
    print('beam k=%d ->' % k, bp, 'p =', bpp, '| score = %.4f' % (math.log(bpp) / len(bp) ** 0.75))
b_prefix, b_p = beam_search(2, 4)
print('beam best prob:', b_p)
L = len(b_prefix)
print('length-normalized score:', math.log(b_p) / L ** 0.75)
assert greedy_prefix == 'ABC' and abs(greedy_p - 0.048) < 1e-12
assert b_prefix == 'ACB' and abs(b_p - 0.054) < 1e-12

print('=== ch10.l4 ex1 solution + tests (bleu) ===')
def bleu(pred_seq, label_seq, k):
    pred_tokens, label_tokens = pred_seq.split(' '), label_seq.split(' ')
    len_pred, len_label = len(pred_tokens), len(label_tokens)
    score = math.exp(min(0, 1 - len_label / len_pred))
    for n_ in range(1, min(k, len_pred) + 1):
        num_matches, label_subs = 0, {}
        for i in range(len_label - n_ + 1):
            sub = ' '.join(label_tokens[i:i + n_])
            label_subs[sub] = label_subs.get(sub, 0) + 1
        for i in range(len_pred - n_ + 1):
            sub = ' '.join(pred_tokens[i:i + n_])
            if label_subs.get(sub, 0) > 0:
                num_matches += 1
                label_subs[sub] -= 1
        score *= (num_matches / (len_pred - n_ + 1)) ** (0.5 ** n_)
    return score

b1 = bleu('A B B C D', 'A B C D E F', 2)
b2 = bleu('A B C', 'A B C', 2)
b3 = bleu('A B', 'A B C D E F', 2)
b4 = bleu('A B B C D', 'A B C D E F', 4)
print('bleu k=2:', b1)
print('bleu identical:', b2)
print('bleu short:', b3)
print('bleu k=4:', b4)
assert abs(b1 - 0.6814773296495302) < 1e-9
assert abs(b2 - 1.0) < 1e-12
assert abs(b3 - math.exp(-2)) < 1e-12
assert b4 == 0.0
print('greedy cost |Y|=10000 T\'=10:', 10000 * 10)

print('=== ch11.l1 worked: scaled dot-product attention + masked + kernel ===')
def softmax(scores):
    m = max(scores)
    exps = [math.exp(s - m) for s in scores]
    total = sum(exps)
    return [e / total for e in exps]

q = [1.0, 0.0]
K = [[1.0, 0.0], [0.0, 1.0], [0.7, 0.7]]
V = [10.0, 20.0, 30.0]
d = len(q)
scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in K]
w = softmax(scores)
out = sum(wi * v for wi, v in zip(w, V))
print('scores:', [round(s, 4) for s in scores])
print('weights:', [round(x, 4) for x in w])
print('attention output:', round(out, 4))
print('uniform weights:', softmax([0.0, 0.0, 0.0]))
masked = softmax([scores[0], scores[1], -1e6])
print('masked weights:', [round(x, 6) for x in masked])

def gauss(dist):
    return math.exp(-0.5 * dist * dist)

keys = [0.0, 1.0, 3.0]
raw = [gauss(0.5 - k) for k in keys]
tot = sum(raw)
print('gaussian kernel weights:', [round(r / tot, 4) for r in raw])

print('=== ch11.l1 ex1 solution + tests ===')
def dot_product_attention(q, K, V):
    d = len(q)
    scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in K]
    m = max(scores)
    exps = [math.exp(s - m) for s in scores]
    weights = [e / sum(exps) for e in exps]
    return sum(wi * v for wi, v in zip(weights, V)), weights

out1, w1 = dot_product_attention([0.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [2.0, 6.0])
print(out1, w1)
out2, w2 = dot_product_attention([10.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [1.0, 0.0])
print(out2, w2)
out3, w3 = dot_product_attention([1.0, 0.0], [[1.0, 0.0], [0.0, 1.0], [0.7, 0.7]], [10.0, 20.0, 30.0])
print(out3, w3)
assert abs(sum(w1) - 1.0) < 1e-9
assert abs(out1 - 4.0) < 1e-9
assert out2 > 0.99
assert abs(sum(w3) - 1.0) < 1e-9

print('=== ch11.l2 worked: self-attention matrix + positional encoding ===')
X = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
dim = 2
attn = []
for i in range(3):
    s = [sum(a * b for a, b in zip(X[i], X[j])) / math.sqrt(dim) for j in range(3)]
    attn.append(softmax(s))
for row in attn:
    print([round(v, 4) for v in row], 'sum=%.4f' % sum(row))

def pos_encode(i, dim):
    out = []
    for p in range(dim // 2):
        w = 10000 ** (-2.0 * p / dim)
        out.append(math.sin(i * w))
        out.append(math.cos(i * w))
    return out

for i in range(4):
    print('pos %d:' % i, [round(v, 4) for v in pos_encode(i, 4)])
print('n^2*d for n=512 d=64:', 512 ** 2 * 64)
print('n*d^2 for n=512 d=64:', 512 * 64 ** 2)
assert abs(attn[0][0] - 0.4011) < 1e-3
assert abs(sum(attn[2]) - 1.0) < 1e-9
assert pos_encode(0, 6) == [0.0, 1.0, 0.0, 1.0, 0.0, 1.0]
assert abs(pos_encode(1, 2)[0] - math.sin(1.0)) < 1e-12
assert abs(pos_encode(1, 2)[1] - math.cos(1.0)) < 1e-12
assert abs(pos_encode(2, 4)[2] - math.sin(0.02)) < 1e-12
print('pos_encode(1,4) full:', pos_encode(1, 4))
print('binary analogy:', [format(i, '03b') for i in range(4)])

print('=== ch11.l3 worked: layer norm + add&norm + causal mask + ViT shapes ===')
def layer_norm(row, eps=1e-8):
    mu = sum(row) / len(row)
    var = sum((x - mu) ** 2 for x in row) / len(row)
    inv = 1.0 / math.sqrt(var + eps)
    return [(x - mu) * inv for x in row]

for row in ([1.0, 2.0], [2.0, 3.0], [5.0, 5.0]):
    print('ln(%s) ->' % row, [round(v, 4) for v in layer_norm(row)])
x = [1.0, 2.0]
y = [0.5, 1.5]
added = [a + b for a, b in zip(x, y)]
print('add & norm:', [round(v, 4) for v in layer_norm(added)])

S = [[1.0, 2.0, 3.0], [1.0, 2.0, 3.0], [1.0, 2.0, 3.0]]
NEG = -1e9
causal = []
for i in range(3):
    masked_scores = [S[i][j] if j <= i else NEG for j in range(3)]
    causal.append(softmax(masked_scores))
for row in causal:
    print([round(v, 4) for v in row])
assert abs(causal[0][0] - 1.0) < 1e-9
assert abs(causal[1][0] - 0.26894142) < 1e-6
assert abs(causal[2][2] - 0.66524096) < 1e-6
hh = ww = 96
p = 16
c_ch = 3
m = (hh // p) * (ww // p)
print('patches:', m)
print('patch vector length:', c_ch * p * p)
print('tokens into the encoder:', m + 1)
print('ViT 224/p=16 patches:', (224 // 16) ** 2)
assert m == 36 and c_ch * p * p == 768 and m + 1 == 37
print('ALL LITERALS VERIFIED')
