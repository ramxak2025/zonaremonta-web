# ARCHITECTURE

## Сервисы

```
┌────────────┐   HTTPS    ┌───────────────┐   /api/v1   ┌──────────────┐
│ Браузер    │──────────▶│   Nginx TLS   │────────────▶│   NestJS API │
│ (mobile/PC)│            │ (Let's Encrypt│             │  :4000       │
└────────────┘            │  HSTS, CSP)   │             └──────┬───────┘
                          │               │                    │
                          │  Next.js SSR ─┘◀────proxy :3000    │
                          │  (standalone) │                    │
                          │  ISR=3600     │                    ▼
                          └───────────────┘             ┌──────────────┐
                                                        │ Postgres 16  │
                                                        └──────────────┘
                                                        ┌──────────────┐
                                                        │  Redis 7     │
                                                        └──────────────┘
```

- **Nginx** завершает TLS, проксирует `/` → `web:3000`, `/api/` → `api:4000`,
  `/uploads/` раздаёт напрямую с диска.
- **Next.js (web)**: публичные страницы с ISR `revalidate=3600`, приватные — `dynamic = 'force-dynamic'`.
  Режим сборки `standalone` — минимальный прод-образ.
- **NestJS (api)**: модули `auth`, `clients`, `vehicles`, `catalog`, `callback`,
  `appointments`, `work-orders`, `inventory`, `finance`, `reminders`, `content`, `uploads`.
- **Postgres**: primary source of truth; миграции — Prisma.
- **Redis**: rate-limit (@nestjs/throttler), фоновые задачи BullMQ (зарезервировано под отправку SMS и напоминания).
- **Загрузки**: `/var/lib/05auto/uploads`, sharp сжимает в webp (+ thumb), Nginx отдаёт с `immutable`.

## Авторизация

| Роль | Способ | TTL access | Refresh | 2FA |
|------|--------|-----------|---------|-----|
| CLIENT | Телефон + SMS | 15 мин | 30 дней, httpOnly cookie | — |
| MASTER / DIRECTOR | Email + пароль (argon2id) | 15 мин | 30 дней | Обязательный TOTP |

- SMS-коды хранятся только в SHA-256 хэше, TTL 5 мин, 3 попытки, до 3 запросов / 15 мин / телефон.
- Refresh token — opaque random 48 байт, в БД хранится SHA-256, ротируется при каждом refresh.
- Все staff-действия логируются в `audit_log` (`AuditInterceptor`).

## БД (Prisma)

Ключевые таблицы:

- **users / clients / masters** — роли и профили
- **refresh_tokens / sms_codes / audit_log** — безопасность и аудит
- **vehicle_brands / vehicle_models / vehicles** — справочники и авто клиента
- **services / parts / part_categories / stock_movements / suppliers / supplier_invoices** — склад и услуги
- **work_orders / work_order_items** — наряды (авто-списание со склада, авто-проводка в кассу при закрытии)
- **appointments / appointment_slots** — запись на сервис
- **client_expenses / external_work_entries / reminders** — клиентские траты, внешние работы, напоминания
- **transactions / transaction_categories** — касса
- **callback_requests / blog_posts / reviews / faq_items / certificates / instructions / instruction_media** — контент
- **notifications / settings** — уведомления и ключевые настройки

Все id — UUID, все таймстемпы — UTC. Индексы покрывают частые выборки
(по клиенту, телефону, статусу наряда, диапазонам дат в кассе и т. п.) — см. `apps/api/prisma/schema.prisma`.

## Потоки данных

### Обратный звонок
```
форма → POST /api/v1/callback (honeypot + rate-limit) → callback_requests (status=NEW)
→ директор видит в CRM → status=IN_PROGRESS → DONE
```

### Наряд-заказ
```
мастер закрывает наряд (PATCH /api/v1/work-orders/:id status=DONE) →
внутри транзакции:
  1. work_order_items пересчёт subtotal
  2. part.stockQty -= qty для PART-позиций
  3. stock_movements тип=WORK_ORDER
  4. work_orders.totalCost = сумма subtotal
  5. transactions INCOME category=work_order
  6. SMS клиенту (queue)
```

### Напоминания
```
Cron каждый день 10:00 → выбираем reminders (notified=false, dueAt <= +7 дней) →
SMS через SmsProvider → notified=true
```

## Масштабирование

В пределах одного VDS приложение выдерживает до ~500 RPS на публичных страницах
(ISR + Nginx cache). Узкие места при росте:

- Postgres → вертикальный рост CPU/IO; read-replicas для отчётов.
- Загрузки → вынести на S3-совместимое хранилище (Selectel/Yandex Object Storage).
- SMS → BullMQ + воркер, чтобы API не блокировался при сетевых провалах.
