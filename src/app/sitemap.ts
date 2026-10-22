import type { MetadataRoute } from 'next';
import { SITE_OG_IMAGE, SITE_URL } from '@/lib/site';

/**
 * PyPath is a single-document, hash-routed SPA (ADR-0007): every public view
 * (dashboard, path, lessons, exam, certificate…) is served by `/`, and the
 * client router selects the view from the URL fragment. Fragments are not
 * separate crawlable URLs, so the sitemap correctly exposes the one canonical
 * public document rather than inventing `#/…` duplicates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      images: [`${SITE_URL}${SITE_OG_IMAGE.url}`],
    },
  ];
}
