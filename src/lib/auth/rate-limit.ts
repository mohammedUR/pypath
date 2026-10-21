/**
 * Lightweight in-memory sliding-window rate limiter for auth endpoints.
 * Scope note: state lives in the process — under serverless multi-instance
 * deployments it is a per-instance throttle layered on top of the durable
 * per-account lockout (failedLoginCount/lockedUntil), which is the real
 * brute-force protection. Keyed by ip+route or by email (login).
 */

const buckets = new Map<string, number[]>();
const MAX_KEY = 10_000;

export interface RateResult {
  allowed: boolean;
  retryAfterSec: number;
}

/** Allows at most `max` hits per `windowMs` for `key`. */
export function rateLimit(key: string, max: number, windowMs: number): RateResult {
  const now = Date.now();
  // Opportunistic global cap so a flood can't grow the map unbounded.
  if (buckets.size > MAX_KEY) {
    for (const [k, hits] of buckets) {
      if (!hits.length || (hits[hits.length - 1] ?? 0) < now - windowMs) buckets.delete(k);
      if (buckets.size <= MAX_KEY) break;
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

/** Best-effort client IP for throttling keys (never used as identity). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]?.trim() ?? 'unknown';
  return req.headers.get('x-real-ip') ?? 'unknown';
}
