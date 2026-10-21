import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';

/**
 * Server-side session accessor for API routes. Returns null when the caller
 * is anonymous — routes must then refuse, never trust client identity.
 */
export async function requireSession(): Promise<{ id: string; email: string; name: string | null; emailVerified: Date | null } | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!session?.user || !id) return null;
  return {
    id,
    email: session.user.email ?? '',
    name: session.user.name ?? null,
    emailVerified: session.user.emailVerified ?? null,
  };
}
