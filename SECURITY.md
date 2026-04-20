# SECURITY — модель угроз и меры

## Основные угрозы (STRIDE)

| Угроза | Вектор | Контрмера |
|--------|--------|-----------|
| Spoofing | Подбор пароля staff | argon2id + TOTP + rate-limit (10 попыток / 15 мин) |
| Spoofing | Подбор SMS-кода | sha256, 3 попытки, 3 запроса / 15 мин / phone, блокировка после 5 неудач подряд |
| Tampering | Изменение JWT | Секрет 48 байт (openssl rand), алгоритм HS256, access TTL 15 мин |
| Repudiation | «Я этого не делал» | `AuditInterceptor` логирует все POST/PUT/PATCH/DELETE staff'а |
| Information disclosure | Утечка ПД | HTTPS (TLS 1.2/1.3), HSTS, rest-at-encryption на уровне диска VDS |
| DoS | Спам в формы | `@nestjs/throttler` + Nginx `limit_req` + honeypot |
| Elevation | Клиент лезет в админку | RBAC через `RolesGuard` + `Roles('DIRECTOR')` |

## Защита входов

- Все DTO — `class-validator` + `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.
- На web: zod-схема прогоняется ещё до API-запроса.
- File upload: whitelist MIME + magic bytes + sharp-resize (убивает EXIF и вредоносные payload'ы).
- Prisma параметризирует SQL (SQL-injection невозможен в штатных сценариях).

## Cookies / CSRF

- `refresh_token` — httpOnly + Secure + SameSite=Lax, путь `/api/v1/auth`.
- Access token выдаётся в теле ответа, хранится в `sessionStorage` (не cookie) — значит CSRF неактуален для API-запросов с `Authorization: Bearer`.
- Публичный `POST /callback` — с rate-limit + honeypot; без пользовательского контекста CSRF также неактуален.

## Заголовки

- Helmet на API (XFO SAMEORIGIN, noSniff, DNS-Prefetch).
- Nginx: HSTS `max-age=63072000 preload`, CSP с белым списком фреймов (yandex.ru, vk.com, vkvideo.ru).

## Секреты

- `.env` вне git (`.gitignore`).
- JWT секреты — 48 случайных байт base64.
- При ротации — `tokens.revokeAllForUser(id)` выкидывает все refresh этого пользователя.

## Безопасность БД

- Роли Postgres: приложение ходит под `zonaremonta` (не superuser).
- Подключение только с хоста (listen_addresses='localhost' + ufw).
- Бэкапы `pg_dump | gzip` в `/var/backups/05auto`, ротация 30 дней.

## Процесс реагирования

1. При подозрительной активности — заблокировать `User.status = BLOCKED` и вызвать `tokens.revokeAllForUser`.
2. Аудит-лог фильтровать по `entity` / `ip` / диапазону дат.
3. Сбрасывать пароли вручную через `create-admin.ts` (upsert).
