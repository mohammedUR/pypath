// Probe ch11/12/14/15-relevant stdlib availability in the bundled Pyodide.
// Run: cd scripts && bun test_pyodide_swe_stack2.ts
import { readFileSync } from 'node:fs';
import { loadPyodide } from '../public/vendor/pyodide/pyodide.mjs';

const workerSrc = readFileSync('../public/pyodide-worker.js', 'utf8');
const m = workerSrc.match(/const SETUP_PY = `([\s\S]*?)`;\s*\n/);
if (!m) throw new Error('SETUP_PY not found');
const SETUP_PY = m[1];

const py = await loadPyodide({ indexURL: '../public/vendor/pyodide/' });
await py.loadPackage('sqlite3');
py.runPython(SETUP_PY);

const probe = (name: string, code: string) => {
  try {
    const out = py.runPython(code);
    console.log(`OK   ${name}:`, String(out).slice(0, 120));
  } catch (e: any) {
    console.log(`FAIL ${name}:`, String(e?.message ?? e).split('\n')[0].slice(0, 120));
  }
};

probe('hashlib', `import hashlib\nprint(hashlib.sha256(b'abc').hexdigest()[:12])`);
probe('secrets', `import secrets\nprint(secrets.token_hex(4))`);
probe('hmac', `import hmac\nprint(hmac.new(b'k', b'm', hashlib.sha256).hexdigest()[:8])`);
probe('base64', `import base64\nprint(base64.b64encode(b'pypath').decode())`);
probe('difflib', `import difflib\nprint(difflib.SequenceMatcher(None, 'abc', 'abd').ratio())`);
probe('statistics', `import statistics\nprint(statistics.mean([2, 4, 9]))`);
probe('Counter', `import collections\nprint(collections.Counter('aabbb').most_common(1))`);
probe('dataclasses', `from dataclasses import dataclass\n@dataclass\nclass P:\n    x: int\nprint(P(3).x)`);
probe('datetime', `import datetime\nprint(datetime.date(2026, 1, 15).isoformat())`);
probe('csv', `import csv, io\nr = list(csv.reader(io.StringIO('a,b\\n1,2\\n')))\nprint(r[1])`);
probe('textwrap', `import textwrap\nprint(textwrap.wrap('aa bb cc', width=5))`);
probe('argparse', `import argparse\nprint('argparse present')`);
probe('time', `import time\nprint(time.time() > 0)`);
probe('getpass', `import getpass\nprint('getpass present')`);
probe('string', `import string\nprint(string.ascii_letters[:6])`);
probe('math', `import math\nprint(math.ceil(2.1))`);
probe('os.memfs', `import os\nopen('probe.txt', 'w').write('x')\nprint(os.listdir('.'))`);
probe('zlib', `import zlib\nprint(len(zlib.crc32(b'x').to_bytes(4, 'big')))`);
probe('binascii', `import binascii\nprint(binascii.hexlify(b'AB').decode())`);
