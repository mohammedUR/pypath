import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, newOpaqueToken, tokenHashOf } from '@/lib/auth/password';
import { rateLimit, clientIp } from '@/lib/auth/rate-limit';
import { accountSchema } from '@/lib/sync/schema';
import { jsonError, readJson, sameOrigin } from '@/lib/api/guards';
import { mailerConfigured, sendMail } from '@/lib/mailer';

/**
 * Registration — POST {email, password, name?}.
 * Creates the user + an empty cloud progress row. Success does NOT
 * auto-authenticate; the client signs in through the credentials endpoint so
 * the session is issued exactly like a normal login.
 *
 * AUTH-002: email/password/name bounds live in accountSchema (email ≤ 254
 * normalized trim+lowercase; password 8..72 — the 72 cap also protects the
 * password hash from absurd-input DoS; name trimmed ≤ 60). Duplicate emails
 * — both the pre-check race and the concurrent P2002 unique-constraint
 * violation — return the SAME safe 409 PYEMAILEXISTS the frontend expects;
 * every other failure is a bare PYSERVER with no stack or DB detail leak.
 */

/** Prisma unique-constraint violation detector (code P2002), typed & safe. */
function isUniqueViolation(e: unknown): boolean {
  return (
    (typeof e === 'object' && e !== null && (e as { code?: unknown }).code === 'P2002') ||
    String(e).includes('Unique constraint')
  );
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return jsonError('PYBADORIGIN', 403);
  const ip = clientIp(req);
  const rl = rateLimit(`reg:${ip}`, 10, 60_000);
  if (!rl.allowed) return jsonError('PYRATELIMIT', 429, { retryAfterSec: rl.retryAfterSec });

  const body = await readJson(req, 8_192);
  if (!body) return jsonError('PYBADBODY', 400);
  const parsed = accountSchema.safeParse(body);
  if (!parsed.success) return jsonError('PYBADBODY', 400);
  const { email, password, name } = parsed.data;

  try {
    // Every DB/crypto failure inside this block maps to a bare public code,
    // so no raw Prisma message or stack can reach the response body.
    const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return jsonError('PYEMAILEXISTS', 409);

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: { email, passwordHash, name, progress: { create: {} } },
      select: { id: true },
    });

    if (mailerConfigured()) {
      const { token } = newOpaqueToken();
      await db.emailVerifyToken.create({
        data: {
          userId: user.id,
          tokenHash: tokenHashOf(token),
          expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
        },
      });
      const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
      void sendMail(email, 'verify', `${base}/#/ar/auth/verified/${token}`);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (isUniqueViolation(e)) return jsonError('PYEMAILEXISTS', 409);
    return jsonError('PYSERVER', 500);
  }
}
