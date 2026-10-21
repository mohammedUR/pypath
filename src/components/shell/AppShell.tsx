'use client';

import { useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useRouter, type ViewName } from '@/lib/router';
import { useProgress } from '@/lib/store/progress';
import { AccountBadge } from '@/components/account/AccountBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  BookOpenCheck,
  FlipHorizontal,
  LayoutDashboard,
  Leaf,
  Map as MapIcon,
  MonitorCog,
  Moon,
  ScrollText,
  Award,
  GraduationCap,
  Settings as SettingsIcon,
  Sun,
  Sunset,
} from 'lucide-react';

const VIEW_ICONS: Record<ViewName, React.ReactNode> = {
  dashboard: <LayoutDashboard className="size-4" aria-hidden="true" />,
  path: <MapIcon className="size-4" aria-hidden="true" />,
  coverage: <BookOpenCheck className="size-4" aria-hidden="true" />,
  sources: <ScrollText className="size-4" aria-hidden="true" />,
  settings: <SettingsIcon className="size-4" aria-hidden="true" />,
  lesson: <BookOpenCheck className="size-4" aria-hidden="true" />,
  exam: <GraduationCap className="size-4" aria-hidden="true" />,
  capstone: <Award className="size-4" aria-hidden="true" />,
  // Views reached from the header badge, never shown in the lesson nav.
  auth: <BookOpenCheck className="size-4" aria-hidden="true" />,
  account: <BookOpenCheck className="size-4" aria-hidden="true" />,
};

/** Applies locale/dir/font-scale/theme/reduced-motion to <html>. */
export function useDocumentSettings() {
  const { locale } = useI18n();
  const theme = useProgress((s) => s.settings.theme);
  const fontScale = useProgress((s) => s.settings.fontScale);
  const reduceMotion = useProgress((s) => s.settings.reduceMotion);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  // Offline hardening (M5): register the shell service worker once.
  // The SW is same-origin cache-only (network-first shell, cache-first assets);
  // failures are silently ignored (dev servers, unsupported browsers).
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const resolved = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme;
      root.dataset.theme = resolved;
      root.classList.toggle('dark', resolved === 'dark');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      root.dataset.reduceMotion = String(reduceMotion || mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [reduceMotion]);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  useDocumentSettings();
  const { t, locale, dir, toggleLocale } = useI18n();
  const { view, navigate, switchLocale } = useRouter();
  const theme = useProgress((s) => s.settings.theme);
  const setSettings = useProgress((s) => s.setSettings);
  const calm = useProgress((s) => s.settings.calm);

  const navItems = useMemo(
    () => [
      { view: 'dashboard' as ViewName, label: t('nav.dashboard') },
      { view: 'path' as ViewName, label: t('nav.path') },
      { view: 'coverage' as ViewName, label: t('nav.coverage') },
      { view: 'sources' as ViewName, label: t('nav.sources') },
      { view: 'exam' as ViewName, label: t('nav.exam') },
      { view: 'capstone' as ViewName, label: t('nav.capstone') },
      { view: 'settings' as ViewName, label: t('nav.settings') },
    ],
    [t],
  );

  const cycleTheme = () => {
    const order = ['light', 'dark', 'sepia', 'system'] as const;
    const next = order[(order.indexOf(theme as (typeof order)[number]) + 1) % order.length];
    setSettings({ theme: next });
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'sepia' ? Sunset : theme === 'system' ? MonitorCog : Sun;
  const themeLabel =
    theme === 'dark'
      ? t('settings.themeDark')
      : theme === 'sepia'
        ? t('settings.themeSepia')
        : theme === 'system'
          ? t('settings.themeSystem')
          : t('settings.themeLight');

  const handleLangToggle = () => {
    const next = locale === 'ar' ? ('en' as const) : ('ar' as const);
    toggleLocale();
    switchLocale(next);
  };

  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-screen flex-col bg-background text-foreground" dir={dir} lang={locale}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:px-4 focus:py-2">
          {t('nav.dashboard')}
        </a>

        <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-2 rounded-xl px-1 py-1 text-start"
              aria-label="PyPath home"
            >
              <span
                className="flex size-9 items-center justify-center rounded-xl font-bold text-white"
                style={{ background: 'var(--accent-python)' }}
                aria-hidden="true"
              >
                Py
              </span>
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-bold">PyPath</span>
                <span className="text-[11px] text-muted-foreground">{t('nav.tagline')}</span>
              </span>
            </button>

            <nav aria-label={t('nav.path')} className="ms-2 hidden flex-1 items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Button
                  key={item.view}
                  variant={view === item.view ? 'secondary' : 'ghost'}
                  className={cn('h-10 gap-2 rounded-xl px-3 text-sm font-medium', view === item.view && 'font-semibold text-primary')}
                  onClick={() => navigate(item.view)}
                  aria-current={view === item.view ? 'page' : undefined}
                >
                  {VIEW_ICONS[item.view]}
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className="ms-auto flex items-center gap-1.5">
              {calm && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="hidden gap-1 rounded-full sm:inline-flex">
                      <Leaf className="size-3" aria-hidden="true" />
                      {t('nav.calmOn')}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{t('settings.calmDesc')}</TooltipContent>
                </Tooltip>
              )}
              <AccountBadge />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-10 rounded-xl" onClick={cycleTheme} aria-label={themeLabel}>
                    <ThemeIcon className="size-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{themeLabel}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 gap-1.5 rounded-xl px-3 text-xs font-bold" onClick={handleLangToggle}>
                    <FlipHorizontal className="size-3.5" aria-hidden="true" />
                    {t('nav.langToggle')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('settings.language')}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Mobile nav: calm scrollable row */}
          <nav aria-label={t('nav.path')} className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
            {navItems.map((item) => (
              <Button
                key={item.view}
                variant={view === item.view ? 'secondary' : 'ghost'}
                className={cn('h-10 shrink-0 gap-2 rounded-xl px-3 text-sm', view === item.view && 'font-semibold text-primary')}
                onClick={() => navigate(item.view)}
                aria-current={view === item.view ? 'page' : undefined}
              >
                {VIEW_ICONS[item.view]}
                {item.label}
              </Button>
            ))}
          </nav>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
          {children}
        </main>

        <footer className="mt-auto border-t bg-muted/30 pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
            <p>PyPath — {t('nav.tagline')} · M1</p>
            <p>{t('sources.platformNote')}</p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
