import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.siteUrl.replace(/\/$/, '');
  const now = new Date();
  return [
    { url: `${base}/`,           lastModified: now, changeFrequency: 'weekly',  priority: 1   },
    { url: `${base}/install`,    lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/repair`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/works`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
