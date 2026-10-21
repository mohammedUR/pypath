import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, tokenHashOf } from '@/lib/auth/password';
import { rateLimit, clientIp } from '@/lib/auth/rate-limit';
import { jsonError, readJson, sameOrigin } from '@/lib/api/guards';
import { z } from 'zod';

const bodySchema = z.object({
  token: z.string().min(10).max(200),
  password: z.string().min(8).max(72),
});

/**
 * Password reset completion — POST {token, password}.
 * Single-use token; on success clears the account lockout so the fresh
 * credentials work immediately.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return jsonError('PYBADORIGIN', 403);
  const rl = rateLimit(`reset:${clientIp(req)}`, 10, 60_000);
  if (!rl.allowed) return jsonError('PYRATELIMIT', 429, { retryAfterSec: rl.retryAfterSec });

  const body = await readJson(req, 8_192);
  if (!body) return jsonError('PYBADBODY', 400);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return jsonError('PYBADBODY', 400);
  const { token, password } = parsed.data;

  const row = await db.passwordResetToken.findUnique({ where: { tokenHash: tokenHashOf(token) } });
  if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) {
    return jsonError('PYBADSIG', 400);
  }
  const passwordHash = await hashPassword(password);
  await db.$transaction([
    db.passwordResetToken.update({ where: { id: row.id }, data: { usedAt: new Date() } }),
    db.user.update({
      where: { id: row.userId },
      data: { passwordHash, failedLoginCount: 0, lockedUntil: null },
    }),
  ]);
  // One-time tokens never grant a session: the user signs in normally after reset.
  return NextResponse.json({ ok: true });
}
