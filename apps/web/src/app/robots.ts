import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const host = SITE.siteUrl.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/lk', '/master', '/admin', '/api'],
      },
      // Разрешаем AI-краулерам: OpenAI ChatGPT, Anthropic Claude, Perplexity, Google AI.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
