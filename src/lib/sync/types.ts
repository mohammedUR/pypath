'use client';

/** Shared client-side types for auth + sync. */
export interface AccountInfo {
  id: string;
  email: string;
  name: string | null;
  emailVerified: string | Date | null;
  createdAt: string | null;
  mailerConfigured?: boolean;
}

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';
