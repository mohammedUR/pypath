'use client';

import { create } from 'zustand';
import type { AccountInfo } from '@/lib/sync/types';

export type AccountStatus = 'unknown' | 'anon' | 'user';

interface AccountState {
  status: AccountStatus;
  account: AccountInfo | null;
  setAnon: () => void;
  setUser: (info: AccountInfo | null) => void;
}

/**
 * Tiny session presence store for the shell UI. The authoritative auth state
 * remains server-side (next-auth session cookie); this store only mirrors
 * what /api/account returns after a real server probe.
 */
export const useAccount = create<AccountState>((set) => ({
  status: 'unknown',
  account: null,
  setAnon: () => set({ status: 'anon', account: null }),
  setUser: (account) => set({ status: 'user', account }),
}));
