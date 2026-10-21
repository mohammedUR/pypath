'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useAccount } from '@/lib/store/account';
import { useSyncStore } from '@/lib/sync/engine';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleUserRound, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Header account affordance (ADR-0009). Anonymous → "sign in" button;
 * signed-in → user chip + sync state dot. Kept out of the lesson nav by
 * design (one icon in the header actions row, like the theme toggle).
 */
export function AccountBadge() {
  const { t } = useI18n();
  const { status, account } = useAccount();
  const { status: syncStatus } = useSyncStore();
  const { navigate, view } = useRouter();

  // Single server probe on mount — the engine owns the session/session store,
  // this only mirrors /api/account into the local presence store.
  useEffect(() => {
    if (status !== 'unknown') return;
    const probe = async () => {
      try {
        const res = await fetch('/api/account', { cache: 'no-store' });
        if (res.ok) {
          useAccount.getState().setUser(await res.json());
        } else if (res.status === 401) {
          useAccount.getState().setAnon();
        }
      } catch {
        // Offline: leave status 'unknown' (badge stays neutral).
      }
    };
    void probe();
  }, [status]);

  if (status === 'user' && account) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={view === 'account' ? 'secondary' : 'ghost'}
            size="icon"
            className={cn('size-10 rounded-xl relative')}
            onClick={() => navigate('account')}
            aria-label={`${t('account.title')}: ${account.name || account.email}`}
          >
            <CircleUserRound className="size-5" aria-hidden="true" />
            <span
              className="absolute end-1.5 bottom-1.5 size-2 rounded-full"
              style={{
                background:
                  syncStatus === 'saved'
                    ? 'var(--color-success, #16a34a)'
                    : syncStatus === 'saving'
                      ? 'var(--color-warning, #eab308)'
                      : syncStatus === 'error'
                        ? 'var(--color-danger, #dc2626)'
                        : 'transparent',
              }}
              aria-hidden="true"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('account.title')}</TooltipContent>
      </Tooltip>
    );
  }

  if (status === 'anon' || status === 'unknown') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-xl"
            onClick={() => navigate('auth', 'login')}
            aria-label={t('auth.tabLogin')}
          >
            <LogIn className="size-4" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('sync.title')}: {t('sync.anon')}</TooltipContent>
      </Tooltip>
    );
  }

  return null;
}
