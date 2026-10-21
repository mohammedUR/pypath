'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ar, type Dict } from './ar';
import { en } from './en';

export type Locale = 'ar' | 'en';

interface I18nState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

/**
 * Locale store — persisted to localStorage (sync, tiny) so the very first
 * client paint already has the right language + direction (ADR-0007).
 */
export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'ar',
      setLocale: (l) => set({ locale: l }),
      toggleLocale: () => set({ locale: get().locale === 'ar' ? 'en' : 'ar' }),
    }),
    {
      name: 'pypath.i18n',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const dictionaries: Record<Locale, Dict> = { ar, en };

/** Translate with {placeholder} interpolation. */
export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const parts = key.split('.');
  let node: unknown = dictionaries[locale];
  for (const p of parts) {
    if (node && typeof node === 'object' && p in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[p];
    } else {
      // Fallback to the other locale, then the raw key — never crash the UI.
      let alt: unknown = dictionaries[locale === 'ar' ? 'en' : 'ar'];
      for (const q of parts) {
        if (alt && typeof alt === 'object' && q in (alt as Record<string, unknown>)) {
          alt = (alt as Record<string, unknown>)[q];
        } else return key;
      }
      node = alt;
      break;
    }
  }
  if (typeof node !== 'string') return key;
  if (!vars) return node;
  return node.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

export interface I18n {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Pick the right side of a bilingual content field. */
  pick: (field: { ar: string; en: string }) => string;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

export function useI18n(): I18n {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);
  const toggleLocale = useI18nStore((s) => s.toggleLocale);
  return {
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    t: (key, vars) => translate(locale, key, vars),
    pick: (field) => (locale === 'ar' ? field.ar : field.en),
    setLocale,
    toggleLocale,
  };
}
