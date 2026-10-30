/**
 * Canonical Capstone requirement IDs (CAP-001) — the server-safe home.
 *
 * These live OUTSIDE the 'use client' certification store deliberately:
 * importing values from a client module into server code (e.g. the
 * /api/progress certification sanitization in lib/sync/canonical.ts) yields
 * Next.js client references instead of the real arrays, and iterating them
 * throws "CAPSTONE_ARTIFACT_IDS is not iterable" at runtime. The store
 * re-exports these so its client consumers keep their existing import path.
 */

export const CAPSTONE_ARTIFACT_IDS = [
  'proposal',
  'skeletal',
  'viable',
  'tests',
  'readme',
  'final',
] as const;

export const CAPSTONE_RUBRIC_IDS = [
  'requirements',
  'quality',
  'testing',
  'delivery',
  'reflection',
] as const;
