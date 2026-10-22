/**
 * Canonical site metadata shared by the document head, sitemap, and robots.
 * The production origin is the Vercel deployment (ADR-0009).
 */
export const SITE_URL = 'https://pypath-snowy.vercel.app';
export const SITE_NAME = 'PyPath';
export const SITE_TITLE = 'PyPath — تعلّم بايثون بالعربية | Learn Python in Your Browser';

export const SITE_DESCRIPTION =
  'تعلّم بايثون بالعربية مباشرة في متصفحك: مفسّر بايثون فوري، تمارين تفاعلية، مسار من الصفر إلى الاحتراف، وتتبّع تلقائي لتقدّمك — مجانًا وبدون تثبيت. ' +
  'Learn Python in your browser with an instant interpreter, interactive exercises, and zero setup.';

export const SITE_KEYWORDS = [
  'تعلم بايثون بالعربية',
  'تعلم بايثون',
  'بايثون بالعربي',
  'مفسر بايثون في المتصفح',
  'مفسر بايثون اونلاين',
  'تمارين بايثون تفاعلية',
  'دورة بايثون مجانية',
  'بايثون للمبتدئين',
  'تعلم البرمجة بالعربية',
  'بايثون من الصفر',
  'learn python arabic',
  'learn python in arabic',
  'python interpreter in browser',
  'online python interpreter',
  'interactive python exercises',
  'python for beginners',
  'free python course',
  'python tutorial arabic',
];

export const SITE_OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'PyPath — تعلّم بايثون بالعربية في المتصفح',
} as const;

export const GOOGLE_SITE_VERIFICATION = 'hXGOPVy2O-7PnKWr10p8DK4UCHrYwUrl24X0OCJ6Hzg';
