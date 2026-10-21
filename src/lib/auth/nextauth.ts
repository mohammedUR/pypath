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
          throw new Error('PYBADCREDS');
        }
        if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
          throw new Error('PYLOCKED');
        }
        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
          const failed = user.failedLoginCount + 1;
          const locked = failed >= MAX_FAILED_LOGINS;
          await db.user.update({
            where: { id: user.id },
            data: {
              failedLoginCount: failed,
              ...(locked ? { lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60_000) } : {}),
            },
          });
          throw new Error(locked ? 'PYLOCKED' : 'PYBADCREDS');
        }
        if (user.failedLoginCount !== 0 || user.lockedUntil) {
          await db.user.update({
            where: { id: user.id },
            data: { failedLoginCount: 0, lockedUntil: null },
          });
        }
        const out: CredentialsUser = { id: user.id, email: user.email, name: user.name };
        return out;
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
