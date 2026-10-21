/**
 * Route-handler guards: same-origin enforcement for mutating requests and
 * minimal JSON body limits. Session identity always comes from
 * getServerSession(authOptions) — never from a client-supplied userId.
 */

/** Blocks cross-site form/fetch POSTs when an Origin header is present. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // same-site non-CORS clients omit Origin
  try {
    const o = new URL(origin);
    const host = req.headers.get('host');
    if (o.host === host) return true;
    // Behind a proxy, compare against the configured public URL as well.
    const base = process.env.NEXTAUTH_URL;
    if (base && o.host === new URL(base).host) return true;
  } catch {
    return false;
  }
  return false;
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
