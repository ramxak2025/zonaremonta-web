import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { PRODUCT_CATEGORIES } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.siteUrl.replace(/\/$/, '');
  const now = new Date();
  return [
    { url: `${base}/`,           lastModified: now, changeFrequency: 'weekly',  priority: 1   },
    { url: `${base}/services`,   lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/catalog`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    ...PRODUCT_CATEGORIES.map((c) => ({
      url: `${base}/catalog/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
