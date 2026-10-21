'use client';

import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CoverageSection {
  sectionId: string;
  title: string;
  status: 'published' | 'planned';
}
interface CoverageChapter {
  id: string;
  title: string;
  sections: CoverageSection[];
}
interface CoverageBook {
  title: string;
  chapters: CoverageChapter[];
}
interface CoverageFile {
  generatedBy?: string;
  books: Record<string, CoverageBook>;
}

const BOOK_BADGES: Record<string, string> = {
  PY4E: 'var(--accent-python)',
  SWE: 'var(--accent-python-strong)',
  MLS: 'var(--accent-ai)',
  D2L: 'var(--accent-ai)',
};

export function CoverageView() {
  const { t, locale } = useI18n();
  const [data, setData] = useState<CoverageFile | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/data/coverage.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: CoverageFile) => {
        if (alive) setData(j);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.books).map(([code, book]) => {
      const chapters = book.chapters.length;
      const sections = book.chapters.reduce((n, c) => n + c.sections.length, 0);
      const published = book.chapters.reduce(
        (n, c) => n + c.sections.filter((s) => s.status === 'published').length,
        0,
      );
      return {
        code,
        title: book.title,
        chapters,
        sections,
        published,
        frac: sections ? published / sections : 0,
      };
    });
  }, [data]);

  const totals = useMemo(() => {
    const sections = rows.reduce((n, r) => n + r.sections, 0);
    const published = rows.reduce((n, r) => n + r.published, 0);
    return { sections, published, frac: sections ? published / sections : 0 };
  }, [rows]);

  if (failed) {
    return (
      <Card className="py-card mx-auto max-w-xl">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">{t('coverage.loadFailed')}</CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="gentle-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{t('coverage.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('coverage.subtitle')}</p>
      </header>

      {!data && (
        <div className="space-y-3" aria-busy="true">
          <p className="text-sm text-muted-foreground">{t('coverage.loading')}</p>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {data && (
        <>
          <Card className="py-card">
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <span>
                  {t('coverage.overall')} — {t('coverage.published')}: {totals.published} / {totals.sections} {t('coverage.sectionUnit')}
                </span>
                <span className="tabular-nums">{Math.round(totals.frac * 100)}%</span>
              </div>
              <Progress value={totals.frac * 100} aria-label={t('coverage.overall')} />
              <p className="mt-3 text-xs leading-6 text-muted-foreground">{t('coverage.note')}</p>
            </CardContent>
          </Card>

          <Card className="py-card overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">{t('coverage.title')}</caption>
                  <thead>
                    <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                      <th scope="col" className="px-4 py-3 text-start font-semibold">{t('coverage.book')}</th>
                      <th scope="col" className="px-4 py-3 text-start font-semibold">{t('coverage.chapters')}</th>
                      <th scope="col" className="px-4 py-3 text-start font-semibold">{t('coverage.sections')}</th>
                      <th scope="col" className="px-4 py-3 text-start font-semibold">{t('coverage.published')}</th>
                      <th scope="col" className="px-4 py-3 text-start font-semibold">{t('coverage.percent')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.code} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full" style={{ background: BOOK_BADGES[r.code] ?? 'var(--muted-foreground)' }} aria-hidden="true" />
                            <div>
                              <p className="font-semibold">{r.code}</p>
                              <p className="text-xs text-muted-foreground">{r.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 tabular-nums">{r.chapters}</td>
                        <td className="px-4 py-3 tabular-nums">{r.sections}</td>
                        <td className="px-4 py-3 tabular-nums">{r.published}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={cn('w-10 tabular-nums text-xs font-semibold')}>
                              {Math.round(r.frac * 100)}%
                            </span>
                            <div className="w-24">
                              <Progress value={r.frac * 100} aria-label={`${r.code} ${Math.round(r.frac * 100)}%`} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="gap-1.5 rounded-full">
              <span className="size-2 rounded-full" style={{ background: 'var(--color-success)' }} aria-hidden="true" />
              {t('coverage.statusPublished')}
            </Badge>
            <Badge variant="secondary" className="gap-1.5 rounded-full">
              <span className="size-2 rounded-full" style={{ background: 'var(--muted-foreground)' }} aria-hidden="true" />
              {t('coverage.statusPlanned')}
            </Badge>
            <span>
              {locale === 'ar'
                ? 'المصدر: curriculum/coverage.json — يُزامن إلى public/data عبر scripts/sync_coverage.sh.'
                : 'Source: curriculum/coverage.json — synced to public/data via scripts/sync_coverage.sh.'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default CoverageView;
