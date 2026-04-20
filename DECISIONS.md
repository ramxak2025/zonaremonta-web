# DECISIONS — архитектурные решения

Каждое решение — одна-две строки с обоснованием. Даты в формате YYYY-MM-DD.

## Стек

- **Next.js 15 (App Router) + React 19** — современный SSR/ISR, Server Actions, стабильная сборка в standalone для Docker.
- **NestJS 11** — взрослый DI, модули, guards, подходит под CRM-комплексность. Не Fastify standalone ради экосистемы @nestjs/*.
- **Prisma 5** — типобезопасные миграции, отличный DX; альтернатива Drizzle рассмотрена, но Prisma выигрывает по зрелости seed и toolchain на момент 2026.
- **Postgres 16** — база-de-facto, JSONB для гибких полей (salaryScheme, setting.value).
- **Redis 7** — rate-limit + будущий BullMQ.
- **Tailwind 3 + shadcn-подход в рамках проекта + Framer Motion** — быстрый старт с премиум-видом без затрат на тяжёлую design-system.
- **TanStack Query v5** — клиентские запросы с кэшем; SSR отдаёт hero-данные, остальное подтягивается на клиенте.
- **pnpm workspaces** — монорепа, разделяемые пакеты shared/ui.

## Авторизация

- **CLIENT — SMS + phone**: не храним email/пароль до уведомления в РКН; минимизация ПД.
- **STAFF — email + argon2id + TOTP**: argon2id устойчив к GPU-атакам; TOTP обязательный для всех staff-аккаунтов.
- **JWT access 15 мин + opaque refresh 30 дней** в httpOnly + SameSite=Lax + Secure. Refresh ротируется при каждом `/refresh`.
- **SMS-коды — sha256 в БД**, TTL 5 мин, 3 попытки, 3 запроса / 15 мин. Блокировка после превышения.

## Загрузки

- Сохраняем **на VDS** (`/var/lib/05auto/uploads`) — простая эксплуатация, Nginx отдаёт напрямую. Sharp на серверной стороне переводит в webp и thumb.
- В будущем при росте объёмов — миграция в Selectel Object Storage (совместимо с S3).

## Интеграции

- **SMS**: absctract `ISmsProvider`, две реализации — `SmscProvider` (основной), `SmsRuProvider` (резерв), плюс `MockSmsProvider` для dev/CI.
- **Яндекс.Карты**: встраиваемый виджет (iframe) без подключения JS-SDK — это безопаснее и не тянет API-ключи в клиент.
- **VK Video**: только iframe embed, видео на VK не перезаливаем; соответствует требованию.
- **1С / МойСклад**: спроектирован интерфейс `ExternalInventoryProvider`, реализация отложена (см. INTEGRATIONS.md).

## Безопасность

- Helmet на API, строгий CSP на Nginx (фреймы ограничены yandex.ru + vk.com).
- class-validator + zod (на web) на всех входах; дополнительно magic bytes для файлов.
- Honeypot-поле в форме обратного звонка + rate-limit 5 / час / IP.
- Аудит всех мутационных запросов от MASTER/DIRECTOR через глобальный `AuditInterceptor`.
- Все секреты — в `.env`, никогда не попадают в git (`.gitignore`).

## SEO

- `generateMetadata` (или `metadata`) на каждой публичной странице.
- JSON-LD: `AutoRepair` + `FAQPage` на главной.
- `sitemap.xml` и `robots.txt` через Next.js route handlers.
- ISR `revalidate = 3600` для лендинга и статики, приватные кабинеты — `dynamic = 'force-dynamic'`.

## Legal / 152-ФЗ

- До подачи уведомления в РКН собираем **только** телефон + имя (форма обратного звонка) + данные авто (которые клиент САМ вводит в ЛК).
- Никаких сторонних аналитических счётчиков.
- Рекомендовано перенести Postgres на российский хостинг при росте базы клиентов — см. LEGAL_TODO.md.
