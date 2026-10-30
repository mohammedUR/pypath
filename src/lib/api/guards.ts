/**
 * Route-handler guards: same-origin enforcement for mutating requests and
 * minimal JSON body limits. Session identity always comes from
 * getServerSession(authOptions) — never from a client-supplied userId.
 */

/** Parse a URL and return its host, or '' when malformed (never throws). */
function hostOf(value: string | null): string {
  if (!value) return '';
  try {
    return new URL(value).host;
  } catch {
    return '';
  }
}

/**
 * CSRF/origin guard for state-mutating requests (AUTH-003).
 *
 * The request's Origin host (Referer as a fallback when Origin is absent —
 * same-site non-CORS clients omit it) must match a trusted host:
 *  - the request's `host` header, or — when that header is absent, as with a
 *    standard `new Request(url)` on Node ≥ 24 — the host of the URL the
 *    server itself routed the request on (server-derived, never a
 *    client-supplied header),
 *  - the first `x-forwarded-host` token (Vercel/reverse proxies put the
 *    public host there while `host` may be the internal one),
 *  - the host of NEXTAUTH_URL when configured.
 *
 * A malformed Origin/Referer (e.g. `http://[::1`) fails CLOSED with false —
 * it must never throw a 500 out of the guard.
 */
export function sameOrigin(req: Request): boolean {
  const forwardedHost = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ?? '';
  const hostHeader = req.headers.get('host');
  const selfHost = hostHeader && hostHeader.trim() !== '' ? hostHeader : hostOf(req.url);
  const trustedHosts = new Set(
    [selfHost, forwardedHost].filter((h): h is string => Boolean(h)),
  );
  const configured = hostOf(process.env.NEXTAUTH_URL ?? null);
  if (configured) trustedHosts.add(configured);

  const origin = req.headers.get('origin');
  if (origin !== null) {
    const o = hostOf(origin);
    return o !== '' && trustedHosts.has(o);
  }

  const referer = req.headers.get('referer');
  if (referer === null) return true; // non-CORS client: no origin signal at all
  const r = hostOf(referer);
  return r !== '' && trustedHosts.has(r);
}

export function jsonError(code: string, status: number, extra?: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ error: code, ...extra }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** Reads a JSON body; rejects requests that are absent or oversized. */
export async function readJson(req: Request, maxBytes: number): Promise<unknown | null> {
  const len = Number(req.headers.get('content-length') ?? '0');
  if (len > maxBytes) return null;
  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}
