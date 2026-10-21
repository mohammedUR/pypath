// Verify unittest + ast + itertools availability in the bundled Pyodide,
// replicating worker test semantics (__pypath_run_tests).
import { readFileSync } from 'node:fs';
import { loadPyodide } from '../public/vendor/pyodide/pyodide.mjs';

const workerSrc = readFileSync('../public/pyodide-worker.js', 'utf8');
const m = workerSrc.match(/const SETUP_PY = `([\s\S]*?)`;\s*\n/);
if (!m) throw new Error('SETUP_PY not found');
const SETUP_PY = m[1];

const py = await loadPyodide({ indexURL: '../public/vendor/pyodide/' });
await py.loadPackage('sqlite3');
py.runPython(SETUP_PY);

// 1) unittest-style test class pattern (stdlib, no pytest)
const t1 = `
import unittest

def median(pool):
    vals = sorted(pool)
    n = len(vals)
    mid = n // 2
    if n % 2 == 1:
        return vals[mid]
    return (vals[mid - 1] + vals[mid]) / 2

class MedianTests(unittest.TestCase):
    def test_odd(self):
        self.assertEqual(median([3, 1, 2]), 2)
    def test_even(self):
        self.assertEqual(median([4, 1, 3, 2]), 2.5)

res = unittest.TextTestRunner(stream=open('result.txt', 'w'), verbosity=0).run(
    unittest.defaultTestLoader.loadTestsFromTestCase(MedianTests))
print('unittest failures:', len(res.failures), 'errors:', len(res.errors))
print('open-result:', open('result.txt').read().count('OK') > 0)
`;

// 2) ast-based mini-linter (bare except + long lines detection)
const t2 = `
import ast, io

source = "try:\\n    risky()\\nexcept:\\n    pass\\n"
tree = ast.parse(source)
bad = []
for node in ast.walk(tree):
    if isinstance(node, ast.ExceptHandler) and node.type is None:
        bad.append(node.lineno)
print('bare except lines:', bad)
long_lines = [i + 1 for i, ln in enumerate(source.splitlines()) if len(ln) > 79]
print('long lines:', long_lines)
`;

// 3) itertools combinatorial testing (pairwise from ch10)
const t3 = `
import itertools
params = {'os': ['linux', 'win'], 'browser': ['ff', 'chrome'], 'db': ['sqlite', 'pg']}
names = list(params)
combos = list(itertools.product(*(params[n] for n in names)))
print('full count:', len(combos))
pairs = set(itertools.combinations(names, 2))
covered = 0
for c in combos:
    assign = dict(zip(names, c))
    if all((assign[a], assign[b]) in {(assign[a], assign[b])} for a, b in pairs):
        covered += 1
print('pairwise demo count:', covered)
`;

for (const [label, code] of [['unittest', t1], ['ast', t2], ['itertools', t3]]) {
  const r = JSON.parse(py.globals.get('__pypath_run')(code));
  console.log('===', label, 'ok:', r.ok, r.error ? r.error.message : '');
}
