import { randomBytes, scrypt, timingSafeEqual, createHash, type ScryptOptions } from 'node:crypto';

/** promisify() loses scrypt's options overload — keep the 4-arg form typed. */
function scryptAsync(password: string | Buffer, salt: string | Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derived) => (err ? reject(err) : resolve(derived)));
  });
}

/**
 * Password hashing with the platform's own scrypt primitive (node:crypto).
 * No plaintext passwords are ever stored or logged. Format:
 *   scrypt$N$r$p$<saltB64>$<hashB64>
 * Verify is constant-time; parameters can be upgraded transparently.
 */
export const SCRYPT_N = 16384;
export const SCRYPT_R = 8;
export const SCRYPT_P = 1;
const KEY_LEN = 32;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(plain, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  })) as Buffer;
  const p = [SCRYPT_N, SCRYPT_R, SCRYPT_P].join('$');
  return `scrypt$${p}$${salt.toString('base64')}$${derived.toString('base64')}`;
}

function decode(encoded: string): { salt: Buffer; hash: Buffer; params: { N: number; r: number; p: number } } | null {
  // Format: scrypt$<N>$<r>$<p>$<saltB64>$<hashB64>
  const parts = encoded.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return null;
  try {
    return {
      params: { N: Number(parts[1]), r: Number(parts[2]), p: Number(parts[3]) },
      salt: Buffer.from(parts[4], 'base64'),
      hash: Buffer.from(parts[5], 'base64'),
    };
  } catch {
    return null;
  }
}

export async function verifyPassword(plain: string, encoded: string): Promise<boolean> {
  const decoded = decode(encoded);
  if (!decoded) return false;
  try {
    const derived = (await scryptAsync(plain, decoded.salt, decoded.hash.length, {
      N: decoded.params.N,
      r: decoded.params.r,
      p: decoded.params.p,
    })) as Buffer;
    return timingSafeEqual(derived, decoded.hash);
  } catch {
    return false;
  }
}

/** Opaque one-time token (32 bytes URL-safe) + its SHA-256 for storage. */
export function newOpaqueToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: tokenHashOf(token) };
}

export function tokenHashOf(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
