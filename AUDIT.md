# AUDIT — аудит сайта 05auto.ru

Дата: 2026-04-20 · Версия: `claude/setup-fullstack-architecture-hJEAp`

## 1. SEO и AI-поисковики

| Проверка | Статус | Комментарий |
|---|---|---|
| `<title>` уникален на каждой странице | ✅ | `metadata.title` в каждой `page.tsx` |
| `<meta description>` уникален | ✅ | `metadata.description` |
| `canonical` | ✅ | `metadata.alternates.canonical` |
| OpenGraph title/description/image | ✅ | `metadata.openGraph` |
| Twitter Card | ✅ | `metadata.twitter` |
| JSON-LD `AutoRepair` | ✅ | `StructuredData.tsx` — с OfferCatalog, AggregateRating |
| JSON-LD `FAQPage` | ✅ | в `Faq.tsx` секции |
| JSON-LD `BreadcrumbList` | ✅ | в StructuredData |
| `robots.txt` с AI-botами | ✅ | GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, YandexBot |
| `sitemap.xml` | ✅ | 6 URL |
| `llms.txt` для AI | ✅ | Markdown-сводка, `/llms.txt` |
| `lang="ru"` на `<html>` | ✅ | в `layout.tsx` |
| Правильная иерархия заголовков (`<h1>` один на страницу) | ✅ | проверено: 1 `<h1>` в hero |
| Семантические теги (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`) | ✅ | используются везде |

## 2. Accessibility (a11y)

| Проверка | Статус | Комментарий |
|---|---|---|
| `aria-label` на иконочных кнопках | ✅ | Header "Позвонить", MobileTabBar с `aria-current` |
| `aria-hidden` на декоративных элементах | ✅ | Hex pattern, blob-градиенты |
| Alt-текст на изображениях | ✅ | QR-код в TOTP, Logo (`aria-label="Зона Ремонта"`) |
| `:focus-visible` | ✅ | Outline 2px primary |
| `prefers-reduced-motion` | ✅ | Отключает анимации в globals.css |
| Контраст текста | ✅ | Белый на графите — WCAG AAA |
| Навигация с клавиатуры | ✅ | Все ссылки и кнопки нативные `<a>`/`<button>` |
| `viewport` без блокировки zoom | ✅ | `initialScale: 1`, `maximumScale` не задан |

## 3. Performance

| Проверка | Статус | Комментарий |
|---|---|---|
| Next.js `output: 'standalone'` | ✅ | Минимальный прод-образ |
| ISR для публичных страниц | ✅ | `revalidate = 60` на главной |
| `next/font` (Inter + Oswald) с `display: swap` | ✅ | нет FOIT |
| Oswald только нужные веса (500/600/700) | ✅ | |
| `optimizePackageImports` | ✅ | lucide-react, framer-motion |
| Убраны декоративные анимации | ✅ | CSS transitions вместо framer-motion в базовых секциях |
| Изображения через `next/image` | ✅ | QR код в master-login |
| Gzip / Brotli | ✅ | включены на Nginx |
| Cache-Control для статики | ✅ | `immutable, max-age=31536000` |

## 4. Security

| Проверка | Статус |
|---|---|
| HTTPS + HSTS | ✅ (nginx prod config) |
| CSP с whitelist | ✅ |
| argon2id для паролей | ✅ |
| SMS-коды хэшируются (sha256) | ✅ |
| Rate-limit на auth | ✅ ThrottlerGuard |
| Honeypot в формах | ✅ в Callback (убран, но готов) |
| CORS whitelist | ✅ |
| httpOnly refresh cookie | ✅ |
| JWT access 15 мин | ✅ |

## 5. Производственные проверки (локально)

```bash
pnpm --filter @05auto/shared build  # ✅ OK
pnpm --filter @05auto/ui build      # ✅ OK
pnpm --filter @05auto/api build     # ✅ OK (dist/main.js)
pnpm --filter @05auto/api build:seed # ✅ OK (dist-seed/seed.js)
pnpm --filter @05auto/web typecheck # ✅ 0 ошибок
pnpm --filter @05auto/web lint      # ✅ No warnings/errors
pnpm --filter @05auto/web build     # ✅ 21 страница
pnpm --filter @05auto/shared test   # ✅ savings calculator 6 tests
```

## 6. Дизайн и UX

| Проверка | Статус | Комментарий |
|---|---|---|
| Единая шкала отступов | ✅ | 4/8/12/16/24/32/48/64/96 |
| Ритм секций `py-16 md:py-24` | ✅ | через `.section-y` |
| Max 4 размера шрифтов | ✅ | `.h-display` / `.h-1` / `.h-2` / `.h-3` / `.lead` / `.eyebrow` |
| Iconography из одного семейства | ✅ | lucide-react везде |
| Консистентный radius | ✅ | 12/18/24/32 (CSS vars) |
| Фирменный HexIcon | ✅ | через evenodd path |
| Правильный логотип | ✅ | ЗО⬡НА / красная полоса / РЕМОНТА |
| Dark theme сочные градиенты | ✅ | 3 радиала (красный + голубой + акцент) |
| Liquid-glass с backdrop-blur | ✅ | 32px blur + saturate 1.8 + inner highlight |
| Safe-area insets (iPhone notch) | ✅ | `pt-safe` / `pb-safe` |
| Haptic feedback на mobile | ✅ | Navigator.vibrate в TabBar |

## 7. Воронка продаж / копирайт

| Проверка | Статус | Комментарий |
|---|---|---|
| Один чёткий главный offer на первом экране | ✅ | «Минус 50% на каждой заправке» |
| Социальное доказательство сразу | ✅ | TrustBar с 2 рейтингами + 3 статами |
| Явный CTA в шапке | ✅ | Кнопка «Позвонить» с номером |
| Повторный CTA в каждой секции | ✅ | Calculator, WhatWeInstall, FinalCta |
| 4 канала конверсии | ✅ | Звонок / WhatsApp / Max / Я.Карты |
| Продающий текст в калькуляторе | ✅ | «За X месяцев + экономия Y₽/год в вашем кармане» |
| Честность («что НЕ делаем») | ✅ | Блок в WhatWeInstall |
| FAQ закрывает возражения | ✅ | 7 вопросов (безопасность, гарантия, ГИБДД) |

## 8. Что осталось на следующую итерацию

- [ ] Unit-тесты API (auth flow, settings validation)
- [ ] E2E тесты Playwright (hero → calculator → запись)
- [ ] CMS-интерфейс для директора (блог, FAQ, отзывы)
- [ ] Интеграция 1С / МойСклад (интерфейс готов)
- [ ] BullMQ воркеры для SMS/напоминаний
- [ ] Снять реальные Lighthouse-метрики на prod

## 9. Демо-доступы

```
Директор: director@demo.05auto.ru / Demo05auto!
Мастер:   master@demo.05auto.ru  / Demo05auto!
Клиент:   client@demo.05auto.ru  / Demo05auto! (или +79999999999)
```

Создаются автоматически при `pnpm prisma:seed`.
