import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';

/**
 * next-auth v4 with a Credentials provider and JWT sessions (no session table).
 * The cookie is httpOnly + SameSite=Lax; `secure` is automatic on HTTPS prod.
 * Server APIs must call `getServerSession(authOptions)` — client-claimed
 * identity is never trusted.
 */
export const MAX_FAILED_LOGINS = 5;
export const LOCK_MINUTES = 15;

type CredentialsUser = { id: string; email: string; name: string | null };

/** Error codes authorize() may deliberately surface to the client. */
const PUBLIC_AUTH_ERRORS = new Set(['PYBADCREDS', 'PYLOCKED', 'PYSERVER']);

/**
 * AUTH-002 timing equalizer: a well-formed scrypt hash (same N/r/p as real
 * password hashes) of an unguessable constant. Running verifyPassword()
 * against it when the email matches no account makes not-found responses
 * burn the same scrypt cost as wrong-password responses, closing the
 * login-timing enumeration oracle.
 */
const DUMMY_HASH = 'scrypt$16384$8$1$fvGbE0Qz50PmIQVRz2ruIg==$QyHA4NPYskAwwxIA5JksHW0Eyz6MaipcUFMq2ItBI9I=';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'PyPath',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const email = typeof raw?.email === 'string' ? raw.email.trim().toLowerCase() : '';
        const password = typeof raw?.password === 'string' ? raw.password : '';
        if (!email || !password) {
          throw new Error('PYINVALID');
        }
        // AUTH-002: same bounds as signup (schema.ts) — the ≤72/≥8 password
        // cap also protects the password verifier from absurd-input DoS.
        if (email.length > 254 || password.length > 72 || password.length < 8) {
          throw new Error('PYINVALID');
        }
        try {
          const user = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              passwordHash: true,
              failedLoginCount: true,
              lockedUntil: true,
            },
          });
          if (!user) {
            await verifyPassword(password, DUMMY_HASH);
            throw new Error('PYBADCREDS');
          }
          // AUTH-002: verify the password BEFORE consulting the lock, so a
          // wrong password on a locked account is indistinguishable from an
          // unknown email; the lock state only surfaces to someone already
          // holding the correct password.
          const locked = user.lockedUntil !== null && user.lockedUntil.getTime() > Date.now();
          const ok = await verifyPassword(password, user.passwordHash);
          if (!ok) {
            if (locked) throw new Error('PYBADCREDS');
            const failed = user.failedLoginCount + 1;
            const nowLocked = failed >= MAX_FAILED_LOGINS;
            await db.user.update({
              where: { id: user.id },
              data: {
                failedLoginCount: failed,
                ...(nowLocked ? { lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60_000) } : {}),
              },
            });
            throw new Error(nowLocked ? 'PYLOCKED' : 'PYBADCREDS');
          }
          if (locked) throw new Error('PYLOCKED');
          if (user.failedLoginCount !== 0 || user.lockedUntil) {
            await db.user.update({
              where: { id: user.id },
              data: { failedLoginCount: 0, lockedUntil: null },
            });
          }
          const out: CredentialsUser = { id: user.id, email: user.email, name: user.name };
          return out;
        } catch (e) {
          // next-auth mirrors the thrown message verbatim into the
          // client-facing redirect URL, so only deliberate public codes may
          // escape; anything else (e.g. a Prisma error) collapses to
          // PYSERVER with no internal detail leaked.
          if (e instanceof Error && PUBLIC_AUTH_ERRORS.has(e.message)) throw e;
          throw new Error('PYSERVER');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.uid = user.id;
        token.name = user.name ?? '';
        token.email = user.email;
      } else if (trigger === 'update' && token.uid) {
        // Keep the profile fields fresh (e.g. name changed in another tab).
        const row = await db.user.findUnique({
          where: { id: String(token.uid) },
          select: { email: true, name: true, emailVerifiedAt: true },
        });
        if (row) {
          token.name = row.name ?? '';
          token.email = row.email;
          if (row.emailVerifiedAt) token.emailVerified = row.emailVerifiedAt.getTime();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.uid === 'string' ? token.uid : '';
        session.user.name = typeof token.name === 'string' ? token.name : null;
        session.user.emailVerified =
          typeof token.emailVerified === 'number' ? new Date(token.emailVerified) : null;
      }
      return session;
    },
  },
};
