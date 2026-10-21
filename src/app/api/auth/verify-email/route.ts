import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tokenHashOf } from '@/lib/auth/password';
import { rateLimit, clientIp } from '@/lib/auth/rate-limit';
import { jsonError, readJson, sameOrigin } from '@/lib/api/guards';
import { z } from 'zod';

const bodySchema = z.object({ token: z.string().min(10).max(200) });

/** Email verification — POST {token}; marks the account verified. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return jsonError('PYBADORIGIN', 403);
  const rl = rateLimit(`verify:${clientIp(req)}`, 20, 60_000);
  if (!rl.allowed) return jsonError('PYRATELIMIT', 429, { retryAfterSec: rl.retryAfterSec });

  const body = await readJson(req, 4_096);
  if (!body) return jsonError('PYBADBODY', 400);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return jsonError('PYBADBODY', 400);

  const row = await db.emailVerifyToken.findUnique({ where: { tokenHash: tokenHashOf(parsed.data.token) } });
  if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) {
    return jsonError('PYBADSIG', 400);
  }
  await db.$transaction([
    db.emailVerifyToken.update({ where: { id: row.id }, data: { usedAt: new Date() } }),
    db.user.update({ where: { id: row.userId }, data: { emailVerifiedAt: new Date() } }),
  ]);
  return NextResponse.json({ ok: true });
}
