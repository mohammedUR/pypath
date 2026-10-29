/**
 * Lightweight in-memory sliding-window rate limiter for auth & write
 * endpoints (AUTH-001).
 *
 * Scope contract:
 *  - State lives in the PROCESS. Under serverless/multi-instance deployments
 *    (Vercel functions) each instance keeps its own buckets, so this is a
 *    per-instance throttle layered on top of the durable per-account lockout
 *    (failedLoginCount/lockedUntil in the DB), which remains the real
 *    brute-force protection.
 *  - Memory is strictly O(MAX_BUCKETS): expired buckets are swept
 *    periodically, and when the map is full the OLDEST-inserted bucket keys
 *    are evicted first (Map preserves insertion order), so a spoofed-IP
 *    flood can never grow the map unbounded — worst case it recycles
 *    attacker buckets, never ours.
 *  - Extension point (no runtime dependency added here): swap the `buckets`
 *    Map for Redis/Upstash `INCR`+`EXPIRE` behind this same `rateLimit`
 *    signature for a cluster-wide limiter.
 */

const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 10_000;
const SWEEP_INTERVAL_MS = 60_000;
/** Widest window seen so far — expired-bucket sweeps use it as the horizon. */
let widestWindowMs = 0;
let lastSweepAt = 0;

export interface RateResult {
  allowed: boolean;
  retryAfterSec: number;
}

/** Drop buckets whose last hit is older than the widest known window. */
function sweepExpired(now: number): void {
  for (const [key, hits] of buckets) {
    const last = hits[hits.length - 1] ?? 0;
    if (hits.length === 0 || last < now - widestWindowMs) buckets.delete(key);
  }
}

/**
 * Allows at most `max` hits per `windowMs` for `key`. Bounded memory:
 * periodic sweeps + hard FIFO eviction at MAX_BUCKETS.
 */
export function rateLimit(key: string, max: number, windowMs: number): RateResult {
  const now = Date.now();
  widestWindowMs = Math.max(widestWindowMs, windowMs);
  if (now - lastSweepAt >= SWEEP_INTERVAL_MS) {
    lastSweepAt = now;
    sweepExpired(now);
  }
  // Hard cap BEFORE inserting a new key: evict oldest-inserted keys first.
  if (!buckets.has(key) && buckets.size >= MAX_BUCKETS) {
    for (const oldest of buckets.keys()) {
      buckets.delete(oldest);
      if (buckets.size < MAX_BUCKETS) break;
    }
  }
  const hits = (buckets.get(key) ?? []).filter((t) => t > now - windowMs);
  if (hits.length >= max) {
    const oldest = hits[0] ?? now;
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Best-effort client IP for throttling keys (never used as identity).
 * Takes the FIRST x-forwarded-for token (the client), rejects malformed or
 * oversized tokens (> 64 chars, unexpected charset), and falls back to
 * x-real-ip, then 'unknown'.
 */
export function clientIp(req: Request): string {
  const firstToken = (value: string | null): string => {
    const first = value?.split(',')[0]?.trim() ?? '';
    return /^[A-Za-z0-9.:]{1,64}$/.test(first) ? first : '';
  };
  const forwarded = firstToken(req.headers.get('x-forwarded-for'));
  if (forwarded) return forwarded;
  const real = firstToken(req.headers.get('x-real-ip'));
  if (real) return real;
  return 'unknown';
}
