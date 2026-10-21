'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useAccount } from '@/lib/store/account';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiResendVerification } from '@/lib/auth/client-api';
import { syncOnLogout, useSyncStore } from '@/lib/sync/engine';

/** Account surface: identity, verification status, sync state, sign-out. */
export function AccountView() {
  const { t } = useI18n();
  const { account, status } = useAccount();
  const { navigate } = useRouter();
  const [sending, setSending] = useState(false);
  const [resent, setResent] = useState(false);

  if (status !== 'user' || !account) {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col gap-3 py-6 text-center">
        <h1 className="text-2xl font-bold">{t('account.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('sync.anon')}</p>
        <Button onClick={() => navigate('auth', 'login')}>{t('auth.tabLogin')}</Button>
      </section>
    );
  }

  const verified = Boolean(account.emailVerified);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    syncOnLogout();
    useAccount.getState().setAnon();
    navigate('dashboard');
  };

  const handleResend = async () => {
    setSending(true);
    try {
      const res = await apiResendVerification();
      if (res.ok) setResent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-4 py-6" dir="auto">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">{t('account.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('account.subtitle')}</p>
      </header>
      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">{t('account.signedInAs')}</span>
              <span dir="ltr" className="truncate font-medium">
                {account.name || account.email}
              </span>
              <span dir="ltr" className="truncate text-xs text-muted-foreground">
                {account.email}
              </span>
            </div>
            <Badge variant={verified ? 'secondary' : 'outline'}>
              {verified ? t('account.verified') : t('account.notVerified')}
            </Badge>
          </div>

          {!verified && (
            <div className="flex flex-col items-stretch gap-2">
              {resent ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-400">{t('account.resendSent')}</p>
              ) : (
                <Button variant="outline" onClick={handleResend} disabled={sending}>
                  {t('account.resendCta')}
                </Button>
              )}
              {!account.mailerConfigured && (
                <p className="text-xs text-muted-foreground">{t('auth.noMailerNote')}</p>
              )}
            </div>
          )}

          <SyncLine />

          <Button variant="outline" onClick={handleSignOut} className="mx-auto w-fit">
            {t('account.signOut')}
          </Button>
        </CardContent>
      </Card>
      <Button variant="ghost" onClick={() => navigate('dashboard')} className="mx-auto">
        {t('account.backHome')}
      </Button>
    </section>
  );
}

function SyncLine() {
  const { t } = useI18n();
  const { status, lastSyncedAt } = useSyncStore();
  const key =
    lastSyncedAt && status === 'saved'
      ? 'sync.saved'
      : status === 'saving'
        ? 'sync.saving'
        : status === 'error'
          ? 'sync.error'
          : status === 'offline'
            ? 'sync.offline'
            : 'sync.idle';
  return (
    <p className="text-xs text-muted-foreground">
      <span aria-hidden="true">⟳ </span>
      {t('sync.title')}: {t(key)}
    </p>
  );
}
