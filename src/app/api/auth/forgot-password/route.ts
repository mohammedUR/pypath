import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newOpaqueToken, tokenHashOf } from '@/lib/auth/password';
import { rateLimit, clientIp } from '@/lib/auth/rate-limit';
import { jsonError, readJson, sameOrigin } from '@/lib/api/guards';
import { mailerConfigured, sendMail } from '@/lib/mailer';
import { z } from 'zod';

const bodySchema = z.object({ email: z.string().trim().toLowerCase().max(254) });

/**
 * Password reset request — POST {email}.
 * Always answers {ok:true} (no account-enumeration leak). A one-time token
 * (hash-only storage, 60-min TTL) is emailed when the account exists and the
 * mailer is configured.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return jsonError('PYBADORIGIN', 403);
  const rl = rateLimit(`forgot:${clientIp(req)}`, 10, 60_000);
  if (!rl.allowed) return jsonError('PYRATELIMIT', 429, { retryAfterSec: rl.retryAfterSec });

  const body = await readJson(req, 4_096);
  if (!body) return jsonError('PYBADBODY', 400);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return jsonError('PYBADBODY', 400);

  const user = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (user && mailerConfigured()) {
    const { token, tokenHash } = newOpaqueToken();
    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60_000) },
    });
    const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
    void sendMail(parsed.data.email, 'reset', `${base}/#/ar/auth/reset/${token}`);
  }
  return NextResponse.json({ ok: true });
}
