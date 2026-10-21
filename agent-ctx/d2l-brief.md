# D2L AUTHORING BRIEF — read together with agent-ctx/part2-brief.md (contract) and D2L.toc.json

Grouping: consecutive sections per lesson (max 3-4). EVERY grouped section MUST appear in
`sources` AND have its objective stated (put one summary bullet per section).

## Lesson table (groupings are FIXED — follow exactly)
- ch3 (A3): l1=s1+s2 (Linear Regression, OOD for Implementation), l2=s3+s4 (Synthetic Data, From Scratch), l3=s5+s6+s7 (Concise, Generalization, Weight Decay)
- ch4 (A3): l1=s1+s2 (Softmax Regression, Image Dataset), l2=s3+s4 (Base Model, From Scratch), l3=s5+s6+s7 (Concise, Generalization in Classification, Distribution Shift)
- ch5 (A3): l1=s1+s2 (MLPs, Implementation), l2=s3+s4 (Fwd/Bwd + Graphs, Stability+Init), l3=s5+s6+s7 (Generalization, Dropout, Kaggle Houses)
- ch6 (A3): l1=s1+s2 (Layers and Modules, Parameter Management), l2=s3+s4 (Initialization, Lazy Init), l3=s5+s6+s7 (Custom Layers, File I/O, GPUs)
- ch7 (A4): l1=s1+s2 (FC→Convolutions, Convolutions for Images), l2=s3+s4 (Padding+Stride, Channels), l3=s5+s6 (Pooling, LeNet)
- ch8 (A4): l1=s1+s2+s3 (AlexNet, VGG, NiN), l2=s4+s5 (GoogLeNet, BatchNorm), l3=s6+s7+s8 (ResNet, DenseNet, Designing Architectures)
- ch9 (A5): l1=s1+s2 (Sequences, Text→Sequence Data), l2=s3+s4 (Language Models, RNNs), l3=s5+s6+s7 (RNN From Scratch, Concise, BPTT)
- ch10 (A5): l1=s1+s2 (LSTM, GRU), l2=s3+s4 (Deep RNNs, BiRNNs), l3=s5+s6 (MT Dataset, Encoder-Decoder), l4=s7+s8 (Seq2Seq, Beam Search)
- ch11 (A6): l1=s1+s2+s3 (Q/K/V, Attention Pooling, Scoring), l2=s4+s5+s6 (Bahdanau, Multi-Head, Self-Attention+Positional), l3=s7+s8+s9 (Transformer, ViT, Large-Scale Pretraining)
- ch12 (A7): l1=s1+s2+s3 (Opt+DL, Convexity, GD), l2=s4+s5+s6 (SGD, Minibatch, Momentum), l3=s7+s8+s9 (Adagrad, RMSProp, Adadelta), l4=s10+s11 (Adam, LR Scheduling)
- ch13 (A7): l1=s1+s2+s3+s4 (Compilers, Async, Parallelism, Hardware), l2=s5+s6+s7 (Multi-GPU, Concise Multi-GPU, Parameter Servers)
- ch14 (A4): l1=s1+s2 (Augmentation, Fine-Tuning), l2=s3+s4+s5 (Detection+Boxes, Anchors, Multiscale), l3=s6+s7+s8 (Detection Dataset, SSD, R-CNNs), l4=s9+s10+s11 (Segmentation, Transposed Conv, FCN), l5=s12+s13+s14 (Style Transfer, CIFAR-10 Kaggle, Dogs Kaggle)
- ch15 (A5): l1=s1+s2+s3 (word2vec, Approximate Training, Dataset), l2=s4+s5+s6 (Pretraining word2vec, GloVe, Subword), l3=s7+s8 (Similarity+Analogy, BERT), l4=s9+s10 (BERT Dataset, Pretraining BERT)
- ch16 (A5): l1=s1+s2+s3 (Sentiment+Dataset, RNN, CNN), l2=s4+s5 (NLI+Dataset, NLI Attention), l3=s6+s7 (Fine-Tuning BERT, NLI BERT)
- ch17 (A8): l1=s1+s2+s3 (MDP, Value Iteration, Q-Learning)
- ch18 (A8): l1=s1+s2+s3 (GP Intro, Priors, Inference)
- ch19 (A7): l1=s1+s2+s3 (What is HPO, API, Async Search), l2=s4+s5 (Multi-Fidelity, Successive Halving)
- ch20 (A8): l1=s1+s2 (GANs, DCGAN)
- ch21 (A8): l1=s1 (Recommender Systems deep dive)

## Tracks & prereq anchors (hard prerequisites — use exactly)
- A3 chain: d2l.ch3.l1 ← ['mls.ch7.l3']; then ch3.l2 ← l1, ch3.l3 ← l2, ch4.l1 ← ['d2l.ch3.l3'], … within each chapter; each chapter's l1 ← previous chapter's last lesson id.
- A4: d2l.ch7.l1 ← ['d2l.ch6.l3']; ch7 chain → ch8.l1 ← ['d2l.ch7.l3'] → ch8 chain → ch14.l1 ← ['d2l.ch8.l3'] → ch14 chain (5 lessons).
- A5: d2l.ch9.l1 ← ['d2l.ch14.l5']; ch9 chain → ch10.l1 ← ['d2l.ch9.l3'] (4 lessons) → ch15.l1 ← ['d2l.ch10.l4'] (4 lessons) → ch16.l1 ← ['d2l.ch15.l4'] (3 lessons).
- A6: d2l.ch11.l1 ← ['d2l.ch16.l3']; ch11 chain (3 lessons).
- A7: d2l.ch12.l1 ← ['d2l.ch11.l3'] (4 lessons) → ch13.l1 ← ['d2l.ch12.l4'] (2 lessons) → ch19.l1 ← ['d2l.ch13.l2'] (2 lessons).
- A8: d2l.ch17.l1 ← ['d2l.ch19.l2'] → ch18.l1 ← ['d2l.ch17.l1'] → ch20.l1 ← ['d2l.ch18.l1'] → ch21.l1 ← ['d2l.ch20.l1'].

## Chapter-specific runnable-code guidance (deterministic pure Python; `import minigrad` allowed but rarely needed)
- Vision chapters (7, 8, 14): implement convolutions/pooling/max-pool on small number grids with
  nested lists; compute output shapes (pad/stride arithmetic); anchor box offsets; IoU between
  fixed boxes; transposed-conv shape math. CNN architectures = parameter-count and shape-trace
  exercises (verify numbers by hand under CPython). Never simulate images.
- RNN chapters (9, 10): char-level tokenization on a tiny fixed corpus (literals), bigram counts,
  perplexity from fixed logits, RNN hidden-state recurrence over a short fixed sequence with
  literal weights (2-3 steps printed), gate equations evaluated at fixed values (LSTM/GRU),
  encoder-decoder state passing trace, beam search on a fixed log-prob tree (small).
- Attention/Transformer (11): attention weights from fixed q/k vectors (softmax over dot products
  in pure python), masked softmax, multi-head = 2 fixed heads on tiny tensors, positional
  encoding values via sin/cos formulas (print first rows), scaled dot-product shapes.
- Optimization (12): implement each optimizer by name over a tiny fixed quadratic (e.g.
  f(w)=(w-3)^2) or a fixed 2-D valley; per-step tables for momentum/adagrad/rmsprop/adam with
  verified floats; convexity checks (midpoint inequality on fixed points); LR schedules
  (step decay/cosine) printed at fixed epochs.
- Computational performance (13): async/parallel/hardware concepts → runnable: timing with
  time.perf_counter over fixed loops (verify magnitude-only asserts, e.g. vectorized-style sum
  over a list comprehension vs loop — assert speedup > 1 loosely OR assert counts not time),
  parameter-server push/pull simulation with dicts and counters.
- HPO (19): deterministic grid search over a fixed function; successive halving on a fixed
  bracket of configs (literals); no random sampling — use fixed grids/strides.
- RL (17): value iteration on a fixed 3-state MDP with literal transitions (verify fixed
  point after k iterations), Q-learning update rule applied by hand on fixed (s,a,r,s') tuples
  (no exploration loop — fixed episodes as literals).
- GP (18): RBF kernel values on fixed 1-D points (pure python exp), prior mean/variance
  formulas on 2 fixed points, posterior mean/var with literal matrix inverses (2x2 inverse by
  hand formula).
- GAN (20): minimax loss values for fixed D(x)/G(z) numbers; DCGAN architecture shape table.
- Recommenders (21): matrix factorization by fixed-iteration SGD on a tiny fixed ratings
  matrix (verify final dot products), top-k from fixed scores.
- NLP pretraining (15): skip-gram pairs from a tiny sentence (center/context offsets as
  literals), negative sampling with fixed candidate lists (no random), GloVe co-occurrence
  counts on a tiny corpus, BERT masking with fixed mask positions, token embedding dims math.
- NLP applications (16): sentiment vocab encoding on 3 fixed reviews, CNN text kernel window
  counts, NLI premise/hypothesis overlap features, attention weights for entailment pairs.
- Linear/classification/MLP chapters (3, 4, 5): synthetic regression data generator with
  FIXED formula (w=[2,-3.4], b=4.2 style, deterministic noise from an LCG or none), scratch
  linear regression (pure python), softmax with max-subtraction stability, cross-entropy on
  fixed logits, MLP forward on fixed inputs, dropout mask as a FIXED 0/1 literal mask scaled
  by 1/(1-p), weight decay penalty term, Xavier init bound formula sqrt(6/(nin+nout)) printed.
- Builders' guide (6): Module class tree with plain-python classes (params dicts), parameter
  init/save/load via JSON strings (json module), custom layer forward math, lazy-init shape
  inference logic (pure python), GPU concepts prose-only (no runnable GPU claims).

## Anatomy / gates / rules
Same as part2-brief.md: hook → concept(s ≤150 words ar+en) → worked → 2 exercises
(first write_code with 2-3 tests; second mcq/numeric/trace) → quiz 3 → summary (2-5 bullets,
one per grouped section) → sources (ALL grouped sections). Exercises: required true,
solution, exactly 4 hints, NO explanation key. FORBIDDEN substrings in runnable fields:
input(, exit(, sys.exit, random, unittest.main, subprocess, os.system, socket,
urllib.request, http.client, requests. — "random" banned as substring; torch/numpy only in
prose. Verify EVERY printed literal under CPython 3 in /tmp BEFORE writing the file.
Gates: wave3-validate → ALL VALID; dump+replay solutions → all pass; dump+replay checks →
ALL CHECKS PASS; tsc grep for your ids → 0. Append worklog section with your Task ID.
File paths: content/part2/d2l/ch{N}/lesson.d2l.ch{N}.l{K}.ts.
