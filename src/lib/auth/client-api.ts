'use client';

import type { AccountInfo } from '@/lib/sync/types';

export interface AuthResult {
  ok: boolean;
  code?: string;
}

/** Register → then the caller signs in through the credentials endpoint. */
export async function apiRegister(body: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, code: data.error };
  } catch {
    return { ok: false, code: 'PYSERVER' };
  }
}

export async function apiForgotPassword(email: string): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, code: data.error };
  } catch {
    return { ok: false, code: 'PYSERVER' };
  }
}

export async function apiResetPassword(token: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, code: data.error };
  } catch {
    return { ok: false, code: 'PYSERVER' };
  }
}

export async function apiVerifyEmail(token: string): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, code: data.error };
  } catch {
    return { ok: false, code: 'PYSERVER' };
  }
}

/** Authoritative account info; null when anonymous. */
export async function fetchAccount(): Promise<AccountInfo | null> {
  try {
    const res = await fetch('/api/account', { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as AccountInfo;
  } catch {
    return null;
  }
}

export async function apiResendVerification(): Promise<AuthResult> {
  try {
    const res = await fetch('/api/account', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'sendVerification' }),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, code: data.error };
  } catch {
    return { ok: false, code: 'PYSERVER' };
  }
}
