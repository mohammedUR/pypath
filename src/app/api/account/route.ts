import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireSession } from '@/lib/auth/session';
import { newOpaqueToken, tokenHashOf } from '@/lib/auth/password';
import { jsonError, readJson, sameOrigin } from '@/lib/api/guards';
import { mailerConfigured, sendMail } from '@/lib/mailer';
import { z } from 'zod';

/**
 * Account info (GET, session-only) and name/verification management (POST).
 * GET → { email, name, emailVerified, createdAt, mailerConfigured }
 */
export async function GET() {
  const me = await requireSession();
  if (!me) return jsonError('PYANON', 401);
  const row = await db.user.findUnique({
    where: { id: me.id },
    select: { id: true, email: true, name: true, emailVerifiedAt: true, createdAt: true },
  });
  if (!row) return jsonError('PYANON', 401);
  return NextResponse.json({
    id: row.id,
    email: row.email,
    name: row.name,
    emailVerified: row.emailVerifiedAt,
    createdAt: row.createdAt,
    mailerConfigured: mailerConfigured(),
  });
}

const patchSchema = z.object({
  action: z.literal('sendVerification'),
});

/** POST {action:'sendVerification'} → creates + emails a verify token. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return jsonError('PYBADORIGIN', 403);
  const me = await requireSession();
  if (!me) return jsonError('PYANON', 401);
  if (!mailerConfigured()) return jsonError('PYNOMAILER', 501);
  if (me.emailVerified) return NextResponse.json({ ok: true, already: true });

  const body = await readJson(req, 2_048);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError('PYBADBODY', 400);

  const { token, tokenHash } = newOpaqueToken();
  await db.emailVerifyToken.create({
    data: { userId: me.id, tokenHash, expiresAt: new Date(Date.now() + 24 * 60 * 60_000) },
  });
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const sent = await sendMail(me.email, 'verify', `${base}/#/ar/auth/verified/${token}`);
  return NextResponse.json({ ok: true, sent });
}
