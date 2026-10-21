// Faithful test: run the worker's SETUP_PY harness, then call __pypath_run_tests
// with sqlite3 code + print-check tests, exactly like the browser does.
import { readFileSync } from 'node:fs';
import { loadPyodide } from '../public/vendor/pyodide/pyodide.mjs';

const workerSrc = readFileSync('../public/pyodide-worker.js', 'utf8');
const m = workerSrc.match(/const SETUP_PY = `([\s\S]*?)`;\s*\n/);
if (!m) throw new Error('SETUP_PY not found');
const SETUP_PY = m[1];

const py = await loadPyodide({ indexURL: '../public/vendor/pyodide/' });
await py.loadPackage('sqlite3');
py.runPython(SETUP_PY);

const learnerCode = `
import sqlite3
print('sqlite version:', sqlite3.sqlite_version)
conn = sqlite3.connect('tracks.sqlite')
cur = conn.cursor()
cur.executescript('''
DROP TABLE IF EXISTS Tracks;
CREATE TABLE Tracks (title TEXT, plays INTEGER);
''')
cur.executemany('INSERT INTO Tracks (title, plays) VALUES (?, ?)', [('My Way', 15), ('Across', 8)])
conn.commit()
cur.execute('SELECT title FROM Tracks ORDER BY plays DESC LIMIT 1')
row = cur.fetchone()
print('most played:', row[0])
conn.close()
`;

const tests = [
  { id: 't1', name: 'version printed', code: "assert 'sqlite version:' in __learner_output__, 'expected: sqlite version: | actual: %r' % __learner_output__" },
  { id: 't2', name: 'most played is My Way', code: "assert 'most played: My Way' in __learner_output__, 'expected: most played: My Way | actual: %r' % __learner_output__" },
  { id: 't3', name: 'query variable check', code: "assert row[0] == 'My Way', 'expected: My Way | actual: %r' % (row[0],)" },
];

const result = py.runPython.call
  ? JSON.parse(py.globals.get('__pypath_run_tests')(learnerCode, JSON.stringify(tests)))
  : null;
console.log(JSON.stringify(result, null, 1));

// Also verify MEMFS persistence across runPython calls in the same interpreter
py.runPython(`
import sqlite3
conn = sqlite3.connect('tracks.sqlite')
cur = conn.cursor()
cur.execute('SELECT COUNT(*) FROM Tracks')
print('persisted rows:', cur.fetchone()[0])
conn.close()
`);
