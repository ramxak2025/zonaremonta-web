# REPORT — «Зона Ремонта» / 05auto

Версия: **1.0.0-foundation** · Ветка: `claude/setup-fullstack-architecture-hJEAp` · Дата: 2026-04-20

## 1. Что реализовано по фазам

### ✅ Ф0. Карта и инициализация
- Монорепа pnpm workspaces (`apps/`, `packages/`, `infra/`).
- Корневой `tsconfig.base.json`, Prettier, EditorConfig, ESLint.
- Docker Compose для dev (Postgres 16 + Redis 7) с healthchecks.
- GitHub Actions CI: lint + typecheck + test на PR, build на тегах `v*`.
- `.env.example` со всеми переменными.

### ✅ Ф1. Бэкенд-ядро (NestJS 11)
- **Prisma schema** — 30+ моделей: users/clients/masters, vehicles + brands/models, services/parts/stockMovements, work_orders + items, appointments + slots, expenses, reminders, transactions, callback, blog, faq, reviews, certificates, instructions + media, notifications, audit_log, sms_codes, refresh_tokens, settings. Все id — UUID, таймстемпы UTC, составные индексы на частых выборках.
- **Seed** — 18 марок + модели, категории расходов, категории транзакций, типовые услуги ГБО (2/4/6 поколение, диагностика, ремонт, поверка), категории запчастей, FAQ, настройки сайта.
- **Auth**:
  - CLIENT: SMS-код (sha256, TTL 5 мин, 3 попытки, rate-limit 3/15мин/phone).
  - STAFF: email + argon2id + обязательный TOTP (otplib), QR-онбординг при первом входе.
  - JWT access 15 мин + opaque refresh 30 дней (httpOnly + Secure + SameSite=Lax), ротация при refresh.
- **RBAC** — `JwtGuard` + `RolesGuard` + `@Roles(...)` + `@Public()`.
- **Audit** — глобальный `AuditInterceptor` логирует POST/PUT/PATCH/DELETE для MASTER/DIRECTOR.
- **SMS-абстракция** — `SmscProvider` (основной), `SmsRuProvider` (резерв), `MockSmsProvider` (dev/CI) через DI-токен `SMS_PROVIDER`.
- **Uploads** — multipart + MIME + magic bytes + sharp (webp + thumb).
- **Модули**: auth, clients, vehicles, catalog, callback (+ honeypot), appointments, work-orders (с автосписанием склада и автопроводкой в кассу), inventory, finance, reminders (+ Cron), content (CMS), uploads.
- **Swagger** на `/api/docs`.

### ✅ Ф2. Публичный сайт (Next.js 15, App Router, React 19)
- Лендинг со всеми секциями: Hero + glass-эффекты, Services (4 карточки), Process (4 шага), **интерактивный калькулятор экономии** (Framer Motion + реактивные слайдеры), CallbackForm (react-hook-form + zod + honeypot + согласие), FAQ (JSON-LD), Contacts (карта Яндекса через iframe + JSON-LD AutoRepair).
- Страницы `/services`, `/catalog`, `/blog` (каркас).
- **/privacy**, **/terms**, **/cookies** — шаблонные тексты под 152-ФЗ.
- **SEO**: `sitemap.ts`, `robots.ts`, OG/Twitter, canonical, JSON-LD (FAQPage + AutoRepair), `next/font` (Inter cyrillic), ISR `revalidate = 3600`.
- Дизайн-токены бренда (алый #E81224, тёмно-серый #1C1C1E, голубой #4A9FD9) в `packages/ui` + Tailwind theme.
- Premium-look: glassmorphism, мягкие тени, accent-gradient, крупная display-типографика, плавные анимации.

### ⏳ Ф3-Ф5. Кабинеты (каркасы)
**Реализовано:**
- `/lk` — полный flow входа клиента (phone → SMS → name → dashboard), dashboard со ссылками на 6 разделов.
- `/master` — полный flow staff-login (email + password + TOTP enrollment с QR + verify).
- `/admin` — аналогично `/master`, направляет на директорский дашборд.
- Все backend-эндпоинты для кабинетов готовы и задокументированы в Swagger.

**Что осталось на вторую итерацию (UI):**
- Формы добавления/редактирования авто, история ТО, траты (графики), напоминания, запись на сервис, профиль.
- Кабинет мастера: лента заявок, карточка наряда, заполнение работ и запчастей с автосписанием, инструкции с VK-плеером.
- Админка: CRM (поиск по клиентам/авто, CSV), склад (UI для приходов/списаний), финансы (графики recharts), контроль мастеров, CMS, редактор мета-тегов.

### ⏳ Ф6. Производительность — подготовлено
- ISR, `next/font`, standalone output, `optimizePackageImports`, Nginx gzip + immutable-кэш `_next/static`.
- Все нужные Prisma-индексы уже в schema.
- PERFORMANCE.md содержит команды EXPLAIN ANALYZE и план Lighthouse CI.
- **Реальные Lighthouse-метрики снять можно только после деплоя** (в отчёт добавлен план).

### ⏳ Ф7. Тесты — минимальный smoke
- Jest конфиг для `apps/api` + smoke-тест калькулятора экономии и хэширования. Полные unit/e2e — следующая итерация (инфраструктура готова).

### ✅ Ф8. Деплой на VDS
- Multi-stage Dockerfile для web (standalone) и api (с sharp/libvips).
- `docker-compose.prod.yml` — все сервисы (postgres, redis, api, web) с volumes в `/var/lib/05auto`.
- Nginx-конфиг `infra/nginx/05auto.conf` — HTTPS, HSTS, CSP (whitelist yandex.ru + vk.com), gzip, HTTP/2, rate-limit, раздача `/uploads/` напрямую.
- `scripts/deploy.sh` — pull → build → migrate → up + health-check.
- `scripts/backup.sh` — pg_dump ежедневно, ротация 30 дней.
- `scripts/create-admin.ts` — одноразовое создание директора.

### ✅ Ф9. Документация
- `README.md` — обзор и команды.
- `ARCHITECTURE.md` — диаграмма сервисов, БД, потоки данных.
- `DEPLOY.md` — пошаговый prod-деплой на VDS.
- `DECISIONS.md` — все архитектурные решения с обоснованием.
- `SECURITY.md` — STRIDE threat model и меры.
- `LEGAL_TODO.md` — пошаговый чек-лист для РКН + локализация ПД.
- `INTEGRATIONS.md` — план 1С/МойСклад, платежей, Яндекс.Карт, VK.
- `PERFORMANCE.md` — EXPLAIN-запросы и Lighthouse CI.
- `API.md` — краткий справочник + ссылка на Swagger.

## 2. Ключевые архитектурные решения (1–2 строки каждое)

- **Монорепа pnpm workspaces**: shared zod-схемы и типы между web и api без дубликата.
- **Next.js 15 App Router + React 19**: ISR для публичных страниц, force-dynamic для кабинетов.
- **NestJS 11 + Prisma 5**: строгая модульность и типобезопасные миграции/seed.
- **Postgres + JSONB** для гибких полей (salaryScheme, setting.value, audit.payload).
- **Redis** под throttler и будущий BullMQ (SMS/напоминания).
- **Auth разведён по ролям**: клиенты — SMS (минимум ПД), staff — email + argon2id + обязательный TOTP.
- **Refresh token — opaque + httpOnly cookie, ротация**: защита от XSS и повторного использования.
- **Глобальный `AuditInterceptor`** для staff-мутаций — закрывает репутационные риски.
- **SMS через абстракцию `ISmsProvider`**: SMSC + SMS.ru + mock, переключение переменной окружения.
- **Загрузки на диске VDS + sharp** (webp/thumb), Nginx раздаёт с `immutable` — экономия CPU на Node.
- **Яндекс.Карты через iframe-виджет**: без API-ключа в клиенте, проще и дешевле.
- **VK Video только через embed** (НЕ перезалив) — соответствует требованию ТЗ.
- **CSP с белым списком фреймов** (yandex.ru + vk.com + vkvideo.ru) — защита XSS без сломанного функционала.
- **Минимум ПД до РКН** (только телефон + имя) и `/privacy`, `/terms`, `/cookies` уже по 152-ФЗ — снимает юр. риски.
- **Никаких счётчиков аналитики до уведомления в РКН** (явно задокументировано в LEGAL_TODO).
- **Интерфейс `ExternalInventoryProvider`** заложен под 1С / МойСклад — без реализации, с планом в INTEGRATIONS.md.
- **Schema.prisma покрыта индексами** на все частые выборки CRM и отчётов.

## 3. Lighthouse-метрики

Снять **после** первого деплоя на staging/prod:

```bash
npx @lhci/cli autorun --collect.url=https://05auto.ru --collect.numberOfRuns=3
```

**Ожидаемые цифры** (целевой коридор, закладывалось в архитектуру):

| Метрика | Mobile | Desktop |
|---------|-------:|--------:|
| Performance | ≥ 90 | ≥ 95 |
| Accessibility | ≥ 95 | ≥ 95 |
| Best Practices | ≥ 95 | ≥ 95 |
| SEO | 100 | 100 |

**Что даёт этот результат:**
- ISR + next/font (swap) + `optimizePackageImports` → быстрый LCP.
- Nginx gzip + immutable-кэш статики → мгновенный повтор.
- sharp webp + thumbnails → лёгкие картинки.
- `Permissions-Policy`, HSTS, CSP, HTTPS + нет `document.write`/mixed content → 95+ на Best Practices.
- sitemap + robots + JSON-LD + canonical + OG → SEO 100.

Фактические цифры фиксируются в `performance-reports/lighthouse-<date>.html` после развёртывания.

## 4. Команды для первого деплоя на VDS (05auto.ru)

```bash
# На VDS, от root
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx ufw
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

mkdir -p /opt /var/lib/05auto/uploads /var/lib/05auto/postgres /var/lib/05auto/redis /var/backups/05auto
cd /opt
git clone https://github.com/ramxak2025/zonaremonta-web.git 05auto
cd 05auto
git checkout main
cp .env.example .env
# ВАЖНО: заполнить .env
nano .env
# секреты:
#   JWT_ACCESS_SECRET=$(openssl rand -base64 48)
#   JWT_REFRESH_SECRET=$(openssl rand -base64 48)
# SMS: SMSC_LOGIN/SMSC_PASSWORD
# Контакты: NEXT_PUBLIC_PHONE, NEXT_PUBLIC_ADDRESS

# Nginx + TLS
cp infra/nginx/05auto.conf /etc/nginx/sites-available/05auto.conf
ln -sf /etc/nginx/sites-available/05auto.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
certbot --nginx -d 05auto.ru -d www.05auto.ru --agree-tos -m admin@05auto.ru --no-eff-email
nginx -t && systemctl reload nginx

# Приложение
docker compose -f docker-compose.prod.yml --env-file .env build
docker compose -f docker-compose.prod.yml --env-file .env up -d
docker compose -f docker-compose.prod.yml --env-file .env run --rm api \
  sh -c "pnpm prisma migrate deploy && pnpm prisma db seed"

# Директор
docker compose -f docker-compose.prod.yml --env-file .env exec api \
  pnpm tsx /app/../../scripts/create-admin.ts director@05auto.ru 'СтойкийПароль123!'

# Бэкапы (cron)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/05auto/scripts/backup.sh >> /var/log/05auto-backup.log 2>&1") | crontab -

# Firewall
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable

# Проверка
curl https://05auto.ru/api/v1/health
curl -I https://05auto.ru
```

**Обновления — одной командой:**

```bash
cd /opt/05auto && ./scripts/deploy.sh
```

## 5. Что осталось на следующую итерацию

1. **Полный UI кабинетов** (Ф3–Ф5) — формы, таблицы, графики. API готов.
2. **Unit-тесты ≥ 60% / E2E** (Ф7) — инфраструктура готова, написать кейсы на auth, наряды, склад.
3. **CMS-интерфейс** для директора (блог/FAQ/отзывы/инструкции) — API готов, JSX-формы.
4. **Lighthouse CI** в GitHub Actions с отчётами в артефакты.
5. **Реализация `MoySkladProvider`** (или 1С) — интерфейс уже заложен.
6. **BullMQ-воркеры** для SMS и напоминаний — чтобы не блокировать API.
7. **Perform on-prod EXPLAIN ANALYZE** — при накопленных данных.

Все эти пункты — **продолжение уже заложенной архитектуры**, не требуют переделок.
