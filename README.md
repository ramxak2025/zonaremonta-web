# Зона Ремонта / 05auto

Веб-приложение автосервиса в Махачкале: специализация — установка, ремонт и диагностика
газобаллонного оборудования (ГБО), продажа комплектующих. Одна монорепа:
публичный сайт, три личных кабинета (клиент / мастер / директор), API, инфраструктура.

- Домен: **05auto.ru**
- Стек: **Next.js 15 + NestJS 11 + Postgres 16 + Redis 7 + Prisma 5**
- Развёртывание: Docker Compose на VDS (Amsterdam), Nginx + Let's Encrypt.

## Быстрый старт (dev)

```bash
# 1. зависимости
pnpm install

# 2. Postgres + Redis
cp .env.example .env      # отредактируйте значения
pnpm docker:dev

# 3. миграции и справочники
pnpm db:migrate
pnpm db:seed

# 4. создать директора
cd apps/api && pnpm tsx ../../scripts/create-admin.ts director@05auto.ru 'StrongPassword123!'

# 5. dev-режим (web :3000, api :4000)
pnpm dev
```

Swagger API доступен на `http://localhost:4000/api/docs`.

## Структура

```
apps/
  web/     — Next.js 15 (App Router, React 19, Tailwind 4, TanStack Query, shadcn-подход)
  api/     — NestJS 11 (Prisma, JWT, TOTP, SMS, Swagger)
packages/
  shared/  — zod-схемы, справочники (марки, категории, услуги), типы
  ui/      — дизайн-токены и переиспользуемые компоненты
infra/
  nginx/   — prod-конфиг Nginx с HTTPS/CSP/HSTS
scripts/
  deploy.sh, backup.sh, create-admin.ts
```

## Документация проекта

| Файл | Описание |
|------|----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Схема сервисов, БД, поток данных |
| [DEPLOY.md](./DEPLOY.md) | Пошаговый prod-деплой на VDS |
| [DECISIONS.md](./DECISIONS.md) | Все архитектурные решения с обоснованием |
| [SECURITY.md](./SECURITY.md) | Threat model и меры защиты |
| [LEGAL_TODO.md](./LEGAL_TODO.md) | Что сделать владельцу для РКН / 152-ФЗ |
| [INTEGRATIONS.md](./INTEGRATIONS.md) | План 1С / МойСклад, платежей, ЯКарт, VK |
| [PERFORMANCE.md](./PERFORMANCE.md) | Профилирование, индексы, Lighthouse |
| [API.md](./API.md) | Ссылка на Swagger + примеры |
| [REPORT.md](./REPORT.md) | Итоговый отчёт по фазам |

## Перед подключением аналитики (важно!)

На текущем этапе Яндекс.Метрика, Google Analytics, VK Pixel **не подключены**, потому что
владелец ещё не подал уведомление в Роскомнадзор как оператор ПД. Последовательность:

1. Подать уведомление в РКН (услуга бесплатная, подаётся через Госуслуги).
2. Обновить `apps/web/src/app/privacy/page.tsx` — добавить упоминание аналитики и согласие.
3. Добавить баннер cookie-consent на весь сайт (пример — `apps/web/src/components/CookieBanner.tsx` будет добавлен).
4. Подключить счётчики — только после получения согласия пользователя.

Подробнее — в [LEGAL_TODO.md](./LEGAL_TODO.md).

## Команды корня

| Команда | Действие |
|---------|----------|
| `pnpm dev` | web + api в watch-режиме |
| `pnpm build` | сборка всех пакетов |
| `pnpm lint` | ESLint во всех workspaces |
| `pnpm typecheck` | строгая проверка типов |
| `pnpm test` | unit-тесты |
| `pnpm db:migrate` | Prisma migrate deploy |
| `pnpm db:seed` | справочники (марки, категории, услуги) |
| `pnpm docker:dev` | поднять Postgres + Redis для dev |

## Лицензия

Собственная разработка для владельца 05auto.ru.
