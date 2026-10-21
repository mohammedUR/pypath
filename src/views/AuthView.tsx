'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useI18n } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiForgotPassword, apiRegister, apiResetPassword, apiVerifyEmail } from '@/lib/auth/client-api';
import { syncOnLogin } from '@/lib/sync/engine';

/**
 * Auth surface (ADR-0009: server-backed accounts).
 * Param carries the sub-mode: login | register | forgot | reset | verified
 * (reset/verified carry the token as the second hash segment).
 */
export function AuthView() {
  const { t } = useI18n();
  const { view, param, navigate } = useRouter();
  const mode = (param?.split('/')[0] ?? 'login') as 'login' | 'register' | 'forgot' | 'reset' | 'verified';
  const token = mode === 'reset' || mode === 'verified' ? (param?.split('/')[1] ?? '') : '';

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-4 py-6" dir="auto">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">{t('auth.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.subtitle')}</p>
      </header>
      <Card>
        <CardContent className="p-5">
          {mode === 'login' && <LoginMode />}
          {mode === 'register' && <RegisterMode />}
          {mode === 'forgot' && <ForgotMode />}
          {mode === 'reset' && <ResetMode token={token} />}
          {mode === 'verified' && <VerifiedMode token={token} />}
        </CardContent>
      </Card>
      {(mode === 'login' || mode === 'register') && (
        <TabsRow mode={mode} />
      )}
      {mode !== 'verified' && view === 'auth' && (
        <Button variant="ghost" onClick={() => navigate('dashboard')} className="mx-auto">
          {t('common.close')}
        </Button>
      )}
    </section>
  );
}

function TabsRow({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useI18n();
  const { navigate } = useRouter();
  return (
    <div className="flex justify-center gap-2">
      <Button
        variant={mode === 'login' ? 'secondary' : 'ghost'}
        onClick={() => navigate('auth', 'login')}
      >
        {t('auth.tabLogin')}
      </Button>
      <Button
        variant={mode === 'register' ? 'secondary' : 'ghost'}
        onClick={() => navigate('auth', 'register')}
      >
        {t('auth.tabRegister')}
      </Button>
    </div>
  );
}

function errText(t: (k: string) => string, code: string | undefined): string {
  if (code === 'PYBADORIGIN' || code === 'PYBADBODY' || code === 'PYINVALID') return t('auth.err.PYINVALID');
  const key = code && ['PYBADCREDS', 'PYLOCKED', 'PYEMAILEXISTS', 'PYRATELIMIT', 'PYSERVER'].includes(code)
    ? `auth.err.${code}`
    : 'auth.err.PYSERVER';
  return t(key);
}

/** Credentials sign-in via next-auth (redirect:false → inline errors). */
function LoginMode() {
  const { t } = useI18n();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        setError(t(`auth.err.${res.error === 'PYSERVER' ? 'PYSERVER' : res.error}`));
        return;
      }
      await syncOnLogin();
      navigate('dashboard');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="auth-email">{t('auth.email')}</Label>
        <Input
          id="auth-email"
          type="email"
          dir="ltr"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="auth-password">{t('auth.password')}</Label>
        <Input
          id="auth-password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? t('auth.loginWorking') : t('auth.loginCta')}
      </Button>
      <Button type="button" variant="link" className="self-center" onClick={() => navigate('auth', 'forgot')}>
        {t('auth.forgotCta')}
      </Button>
    </form>
  );
}

function RegisterMode() {
  const { t } = useI18n();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== password2) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.weakPassword'));
      return;
    }
    setBusy(true);
    try {
      const res = await apiRegister({ email, password, name: name || undefined });
      if (!res.ok) {
        setError(errText(t, res.code));
        return;
      }
      // Straight into the app on success; the session confirms cloud sync.
      const login = await signIn('credentials', { email, password, redirect: false });
      if (!login?.error) {
        await syncOnLogin();
        navigate('dashboard');
        return;
      }
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <p className="text-sm">{t('auth.signedUp')}</p>
        <Button variant="outline" onClick={() => navigate('auth', 'login')}>
          {t('auth.tabLogin')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-email">{t('auth.email')}</Label>
        <Input
          id="reg-email"
          type="email"
          dir="ltr"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-name">{t('auth.name')}</Label>
        <Input id="reg-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-pass">{t('auth.password')}</Label>
        <Input
          id="reg-pass"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-pass2">{t('auth.passwordAgain')}</Label>
        <Input
          id="reg-pass2"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          minLength={8}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? t('auth.registerWorking') : t('auth.registerCta')}
      </Button>
    </form>
  );
}

function ForgotMode() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await apiForgotPassword(email);
      if (!res.ok) setError(errText(t, res.code));
      else setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t('auth.forgotBody')}</p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="forgot-email">{t('auth.email')}</Label>
        <Input
          id="forgot-email"
          type="email"
          dir="ltr"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {sent ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">{t('auth.forgotSent')}</p>
      ) : (
        <Button type="submit" disabled={busy}>
          {t('auth.forgotCta2')}
        </Button>
      )}
    </form>
  );
}

function ResetMode({ token }: { token: string }) {
  const { t } = useI18n();
  const { navigate } = useRouter();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== password2) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    setBusy(true);
    try {
      const res = await apiResetPassword(token, password);
      if (!res.ok) setError(errText(t, res.code));
      else setDone(true);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <p className="text-sm">{t('auth.resetDone')}</p>
        <Button onClick={() => navigate('auth', 'login')}>{t('auth.tabLogin')}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t('auth.resetBody')}</p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reset-pass">{t('auth.password')}</Label>
        <Input
          id="reset-pass"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reset-pass2">{t('auth.passwordAgain')}</Label>
        <Input
          id="reset-pass2"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          minLength={8}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy || !token}>
        {t('auth.resetCta')}
      </Button>
    </form>
  );
}

function VerifiedMode({ token }: { token: string }) {
  const { t } = useI18n();
  const { navigate } = useRouter();
  const [state, setState] = useState<'working' | 'ok' | 'failed'>('working');
  useEffect(() => {
    let alive = true;
    void apiVerifyEmail(token).then((res) => {
      if (alive) setState(res.ok ? 'ok' : 'failed');
    });
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      {state === 'working' && <p className="text-sm text-muted-foreground">{t('common.loading')}</p>}
      {state === 'ok' && <p className="text-lg font-semibold">{t('auth.verifyDone')}</p>}
      {state === 'failed' && (
        <p role="alert" className="text-sm text-destructive">
          {t('auth.verifyFailed')}
        </p>
      )}
      <Button variant="outline" onClick={() => navigate('dashboard')}>
        {t('auth.verifyContinue')}
      </Button>
    </div>
  );
}
