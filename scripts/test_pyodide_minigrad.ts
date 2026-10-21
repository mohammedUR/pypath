/**
 * M3 gate: minigrad trains an MLP inside the bundled Pyodide with a verified,
 * deterministic loss curve (mirrors public/pyodide-worker.js FS preload).
 * Run: bun scripts/test_pyodide_minigrad.ts
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dir, '..');
const { loadPyodide } = await import(path.join(root, 'public/vendor/pyodide/pyodide.mjs'));

const py = await loadPyodide({ indexURL: path.join(root, 'public/vendor/pyodide/') + '/' });
const mgSrc = readFileSync(path.join(root, 'public/py-modules/minigrad.py'), 'utf-8');
py.FS.writeFile('/home/pyodide/minigrad.py', mgSrc);

const OUT = await py.runPythonAsync(`
import json, math
import minigrad as mg

xs = [[round(-3.0 + 0.55*i, 2)] for i in range(12)]
ys = [0.5*x[0] + 0.3*math.sin(2*x[0]) for x in xs]
m = mg.MLP(1, [8, 8], seed=7)
h1 = mg.sgd(m, xs, ys, epochs=300, lr=0.08)

m2 = mg.MLP(1, [8, 8], seed=7)
h2 = mg.sgd(m2, xs, ys, epochs=300, lr=0.08)

mc = mg.MLP(2, [8], seed=3)
xsc = [[0,0],[0,1],[1,0],[1,1]]
ysc = [0,1,1,0]
hc = mg.sgd(mc, xsc, ysc, loss_fn=mg.bce_logits, epochs=600, lr=1.5)
preds = [1 if mc(x).data > 0 else 0 for x in xsc]

json.dumps({
  'reg0': round(h1[0], 6), 'regEnd': round(h1[-1], 6),
  'deterministic': h1 == h2,
  'xor0': round(hc[0], 6), 'xorEnd': round(hc[-1], 6),
  'xorAcc': sum(1 for a, b in zip(preds, ysc) if a == b) / 4,
})
`);
const r = JSON.parse(OUT);
console.log('regression loss:', r.reg0, '->', r.regEnd, '| deterministic:', r.deterministic);
console.log('xor bce_logits:', r.xor0, '->', r.xorEnd, '| accuracy:', r.xorAcc);
if (!(r.regEnd < r.reg0 * 0.1)) throw new Error('regression curve did not drop 10x');
if (!r.deterministic) throw new Error('not deterministic in Pyodide');
if (!(r.xorEnd < 0.1 && r.xorAcc === 1)) throw new Error('xor gate failed');
console.log('M3 GATE OK: scratch MLP trains in-browser (Pyodide) with verified loss curve');
