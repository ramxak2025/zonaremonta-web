import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/lk', '/master', '/admin', '/api'] },
    ],
    sitemap: `${SITE.siteUrl.replace(/\/$/, '')}/sitemap.xml`,
    host: SITE.siteUrl,
  };
}
