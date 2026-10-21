#!/usr/bin/env node
/**
 * Windows-safe build finisher (ADR-0001: no bun/tee/cp in scripts).
 * Next standalone output needs /static + /public copied beside server.js.
 */
import { cp, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const standalone = join(root, '.next', 'standalone');

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(join(standalone, 'server.js')))) {
  console.error('postbuild: .next/standalone/server.js is missing — build incomplete');
  process.exit(1);
}

await mkdir(join(standalone, '.next'), { recursive: true });
await cp(join(root, '.next', 'static'), join(standalone, '.next', 'static'), { recursive: true });
await cp(join(root, 'public'), join(standalone, 'public'), { recursive: true });
console.log('postbuild: standalone static + public copied');
