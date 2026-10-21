'use client';

import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Scale } from 'lucide-react';

/**
 * Sources & Credits — mirrors docs/LICENSES.md exactly (R-LIC-01).
 * Kept in sync manually; the doc is the source of truth.
 */
const BOOKS = [
  {
    code: 'PY4E',
    title: 'Python for Everybody — Arabic edition',
    file: 'book_ar_2023_01_01.pdf',
    role: { ar: 'المرجع الأساسي للجزء الأول (بايثون)', en: 'Primary reference for Part I (Python)' },
    author: 'Charles Severance (© 2009)',
    translator: { ar: 'ترجمة: Electronics Go (© 2023)', en: 'Translation: Electronics Go (© 2023)' },
    license: 'CC BY-NC-SA 3.0',
    licenseNote: { ar: 'نسب الأثر — غير تجاري — الترخيص بالمثل', en: 'Attribution — NonCommercial — ShareAlike' },
    obligations: {
      ar: 'نسب المؤلفين والمترجمين والمنصة؛ غير تجاري؛ التعبير الأصلي فقط مع اقتباسات قصيرة منسوبة ≤25 كلمة.',
      en: 'Attribution (authors + translators + platform); non-commercial; original expression only, short attributed quotes ≤25 words.',
    },
    link: 'https://creativecommons.org/licenses/by-nc-sa/3.0',
    linkLabel: 'creativecommons.org/licenses/by-nc-sa/3.0',
    verified: { ar: 'موثّق من صفحات 3 و7 في الملف', en: 'Verified from PDF pp.3 & p.7' },
  },
  {
    code: 'SWE',
    title: 'Software Engineering: Standing on the Shoulders of Giants — Python Edition',
    file: 'swebook-python.pdf',
    role: { ar: 'مرجع هندسة البرمجيات (الجزء الثالث)', en: 'Software-engineering reference (Part III)' },
    author: 'Thomas Hastings (© 2026) · swebook.org',
    translator: null,
    license: 'CC BY-SA 4.0 (text & figures) · MIT (code examples)',
    licenseNote: { ar: 'نسب الأثر — الترخيص بالمثل للنص؛ الكود MIT', en: 'Attribution + ShareAlike for text; MIT for code' },
    obligations: {
      ar: 'نسب + الترخيص بالمثل للنص المشتق؛ تكييف الكود مسموح مع النسبة (THIRD_PARTY_NOTICES.md).',
      en: 'Attribution + ShareAlike for derived text; code adaptation allowed with attribution (THIRD_PARTY_NOTICES.md).',
    },
    link: 'https://creativecommons.org/licenses/by-sa/4.0',
    linkLabel: 'creativecommons.org/licenses/by-sa/4.0',
    verified: { ar: 'موثّق من صفحة 17 في الملف', en: 'Verified from PDF p.17' },
  },
  {
    code: 'MLS',
    title: 'Machine Learning from Scratch',
    file: 'book.pdf',
    role: { ar: 'مرجع تعلّم الآلة (الجزء الثاني)', en: 'Machine-learning reference (Part II)' },
    author: 'Danny Friedman (© 2020)',
    translator: null,
    license: { ar: 'لا يوجد ترخيص مذكور — الحقوق محفوظة افتراضيًا', en: 'No license stated — All Rights Reserved (default)' },
    licenseNote: { ar: 'مفتوح سؤال OQ-2', en: 'Open question OQ-2' },
    obligations: {
      ar: 'ممنوع النقل الحرفي للنص أو الكود؛ نُدرّس نفس المواضيع بتعبير أصلي؛ رابط خارجي فقط.',
      en: 'No verbatim reuse of prose/code; we teach identical topics with original expression; external link only.',
    },
    link: null,
    linkLabel: null,
    verified: { ar: 'موثّق من صفحة 109 في الملف', en: 'Verified from PDF p.109' },
  },
  {
    code: 'D2L',
    title: 'Dive into Deep Learning',
    file: 'd2l-en.pdf',
    role: { ar: 'مرجع التعلّم العميق (الجزء الثاني المتقدم)', en: 'Deep-learning reference (advanced Part II)' },
    author: 'Zhang, Lipton, Li, Smola · d2l.ai',
    translator: null,
    license: { ar: 'غير مطبوع في الملف؛ موقع d2l.ai يذكر CC BY-NC-SA 4.0 (يُتحقق قبل M4)', en: 'Not printed in the PDF; d2l.ai states CC BY-NC-SA 4.0 (verify before M4)' },
    licenseNote: { ar: 'مفتوح سؤال OQ-3', en: 'Open question OQ-3' },
    obligations: {
      ar: 'إن تأكّد: نسب + غير تجاري + الترخيص بالمثل؛ تعبير أصلي دائمًا.',
      en: 'If confirmed: attribution + non-commercial + share-alike; original expression throughout.',
    },
    link: 'https://d2l.ai',
    linkLabel: 'd2l.ai',
    verified: { ar: 'بحث نصي سلبي داخل الملف', en: 'Text search (negative) inside the PDF' },
  },
];

export function SourcesView() {
  const { t, locale, pick } = useI18n();

  return (
    <div className="flex flex-col gap-6">
      <header className="gentle-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{t('sources.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('sources.subtitle')}</p>
      </header>

      <div className="rounded-2xl border p-5 text-sm leading-7" style={{ background: 'var(--accent-python-soft)' }}>
        <p>
          <Scale className="me-1.5 inline size-4" aria-hidden="true" />
          {t('sources.originalNote')}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {BOOKS.map((b) => (
          <Card key={b.code} className="py-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="size-4 text-[var(--accent-python)]" aria-hidden="true" />
                {b.code}
                <Badge variant="secondary" className="rounded-full text-xs">
                  {b.file}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{b.title}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('sources.roleCol')}</p>
                <p>{pick(b.role)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{b.code === 'PY4E' ? (locale === 'ar' ? 'المؤلف والمترجم' : 'Author & translator') : locale === 'ar' ? 'المؤلف' : 'Author'}</p>
                <p>
                  {b.author}
                  {b.translator ? ` — ${pick(b.translator)}` : ''}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('sources.licenseCol')}</p>
                <p className="font-semibold">{typeof b.license === 'string' ? b.license : pick(b.license)}</p>
                <p className="text-xs text-muted-foreground">{pick(b.licenseNote)} · {pick(b.verified)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{locale === 'ar' ? 'التزاماتنا' : 'Our obligations'}</p>
                <p className="leading-6">{pick(b.obligations)}</p>
              </div>
              {b.link && (
                <p>
                  <a href={b.link} target="_blank" rel="noreferrer noopener" className="font-semibold underline decoration-dotted underline-offset-4" dir="ltr">
                    {b.linkLabel} ↗
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs leading-6 text-muted-foreground">
        {t('sources.platformNote')} {t('sources.nonCommercialNote')}
      </p>
    </div>
  );
}

export default SourcesView;
