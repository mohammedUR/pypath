# ADR-0008: minigrad — the platform's in-browser autograd module (M3)

Date: 2026-10-19 · Status: Accepted

## Context

M3's gate requires "a scratch MLP trains in-browser deterministically with a verified
loss curve" and every Part II (AI track) lesson runs in the Pyodide sandbox. The sandbox
is stdlib-only plus the vendored sqlite3 wheel (ADR-0002): no numpy, no torch, no
sklearn. Lesson code still needs: reverse-mode autograd, seeded init, tiny MLPs, loss
functions, and a trainer whose loss curve is verifiable.

## Options considered

1. **Vendor torch/numpy wheels** — tens of MB, contradicts the offline/budget posture
   (R-ARC-07), rejected.
2. **Per-lesson scratch implementations** — no shared verified core; every lesson would
   re-derive backprop, replay harnesses would drift, rejected.
3. **A small pure-Python platform module bundled with the worker** — one verified core,
   importable everywhere, replayable under CPython. Chosen.

## Decision

`public/py-modules/minigrad.py` — a ~230-line pure-Python module:

- `Value`: scalar reverse-mode autograd node (+, *, **, relu, tanh, sigmoid, log, exp,
  backward via topological sort).
- `lcg_uniform`: deterministic seeded initializer (an integer LCG) — the sandbox bans
  the `random` module outright (validator sweep), so all "randomness" is a seeded LCG.
- `Neuron` / `Layer` / `MLP(nin, hiddens, seed)`: relu hidden layers, linear output.
- `mse`, `bce` (probability form, epsilon-blended to keep the graph connected),
  `bce_logits` (stable softplus form).
- `sgd(model, xs, ys, loss_fn, epochs, lr, log_every)` → returns the full loss history
  so lessons/tests can assert a decreasing curve.

Integration:

- The worker (public/pyodide-worker.js) fetches `/py-modules/minigrad.py` once at boot
  and writes it into the Pyodide FS as `/home/pyodide/minigrad.py` so any lesson code
  can `import minigrad` offline. Non-fatal on failure (lessons keep their simulated
  framing fallback, mirroring the sqlite3 preload pattern from ADR-0002's amendment).
- CPython replay harnesses (scripts/wave3-replay-{solutions,checks}.py) add
  `public/py-modules` to `sys.path`, so the CI replay executes the same module the
  browser executes (R-ARC-06: every solution runs in the real runtime).

## Verification evidence

- CPython: MLP(1,[8,8]) on 12 fixed points: loss 0.518106 → 0.016112 (300 epochs,
  lr 0.08); two identical trainings produce bit-identical curves (determinism).
- Bundled Pyodide (scripts/test_pyodide_minigrad.ts): same regression result,
  `deterministic: true`; XOR via `bce_logits`: 0.720625 → 0.001832, accuracy 1.0.
- Browser E2E (d2l.ch2.l3 worked example): `from minigrad import Value` resolves in
  the real worker; y=(2x+1)² at x=2 → `autograd dy/dx = 20.00` matches the chain rule.

## Consequences

- Every AI-track lesson can run real (tiny) training in the sandbox with verified,
  reproducible numbers; torch/sklearn code in books stays in prose as reference.
- Deterministic by construction: no hidden seeds, no wall-clock dependence in results.
- The module is intentionally minimal; if a future milestone needs matrices/batching,
  extend here (and re-run the determinism gate) rather than importing heavyweight
  dependencies.
