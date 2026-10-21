'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { useI18nStore, type Locale } from '@/lib/i18n';

/* ------------------------------------------------------------------ */
/* Hash routing (ADR-0007): #/{locale}/{view}/{param}                  */
/* e.g. #/ar/dashboard · #/en/lesson/py4e.ch1.l1                       */
/* ------------------------------------------------------------------ */

export type ViewName = 'dashboard' | 'path' | 'lesson' | 'coverage' | 'sources' | 'settings' | 'exam' | 'capstone' | 'auth' | 'account';

export interface Route {
  locale: Locale;
  view: ViewName;
  param?: string;
}

const VIEWS: ViewName[] = ['dashboard', 'path', 'lesson', 'coverage', 'sources', 'settings', 'exam', 'capstone', 'auth', 'account'];

export function parseHash(hash: string): Route | null {
  const m = hash.replace(/^#\/?/, '');
  if (!m) return null;
  const [localeRaw, viewRaw, ...rest] = m.split('/');
  const locale: Locale = localeRaw === 'en' ? 'en' : 'ar';
  const view = VIEWS.find((v) => v === viewRaw);
  return { locale, view: view ?? 'dashboard', param: rest.length ? rest.join('/') : undefined };
}

export function routeToHash(r: Route): string {
  return `#/${r.locale}/${r.view}${r.param ? `/${r.param}` : ''}`;
}

interface RouterState extends Route {
  navigate: (view: ViewName, param?: string) => void;
  /** change locale keeping the current view (language toggle) */
  switchLocale: (locale: Locale) => void;
  /** sync from a parsed hash (back/forward) */
  _setRoute: (r: Route) => void;
}

function currentHashRoute(): Route {
  if (typeof window === 'undefined') return { locale: 'ar', view: 'dashboard' };
  return parseHash(window.location.hash) ?? { locale: 'ar', view: 'dashboard' };
}

export const useRouter = create<RouterState>((set, get) => ({
  // Hydration-safe initial route: the server has no window, so the client's
  // FIRST render must equal the SSR output. Deep links apply their real hash
  // route right after mount via useRouterSync — reading the hash here made
  // the client render a different view tree than the server on deep links
  // (React hydration mismatch, the "1 Issue" badge in dev).
  ...({ locale: 'ar', view: 'dashboard' } as Route),
  navigate: (view, param) => {
    const hash = routeToHash({ locale: get().locale, view, param });
    if (typeof window !== 'undefined') {
      if (window.location.hash === hash) {
        set({ view, param });
      } else {
        window.location.hash = hash; // triggers hashchange → _setRoute
      }
    } else {
      set({ view, param });
    }
  },
  switchLocale: (locale) => {
    const hash = routeToHash({ locale, view: get().view, param: get().param });
    if (typeof window !== 'undefined') window.location.hash = hash;
    set({ locale });
  },
  _setRoute: (r) => set(r),
}));

/** Wire hashchange + back/forward once at the app root. */
export function useRouterSync() {
  useEffect(() => {
    const onHash = () => {
      const r = currentHashRoute();
      useRouter.getState()._setRoute(r);
      // Deep links carry the locale in the hash — keep the i18n store in lockstep
      // (fixes the documented EN-by-hash quirk from Session 8).
      const i18n = useI18nStore.getState();
      if (i18n.locale !== r.locale) i18n.setLocale(r.locale);
    };
    if (!window.location.hash) {
      // Deep-linkable default (default locale = ar / RTL)
      window.history.replaceState(null, '', routeToHash({ locale: 'ar', view: 'dashboard' }));
      useRouter.getState()._setRoute({ locale: 'ar', view: 'dashboard' });
    } else {
      onHash();
    }
    window.addEventListener('hashchange', onHash);
    // Reverse sync: a locale change made directly through the i18n store
    // (e.g. the Settings language radio) must rewrite the hash so deep links
    // stay truthful — otherwise the URL keeps the old locale while the UI
    // switches (caught by the Playwright smoke suite).
    const unsubLocale = useI18nStore.subscribe((i18n) => {
      const hashLocale = parseHash(window.location.hash)?.locale;
      if (i18n.locale !== hashLocale) {
        window.history.replaceState(
          null,
          '',
          routeToHash({
            locale: i18n.locale,
            view: useRouter.getState().view,
            param: useRouter.getState().param,
          }),
        );
        useRouter.getState()._setRoute({
          locale: i18n.locale,
          view: useRouter.getState().view,
          param: useRouter.getState().param,
        });
      }
    });
    return () => {
      window.removeEventListener('hashchange', onHash);
      unsubLocale();
    };
  }, []);
}
