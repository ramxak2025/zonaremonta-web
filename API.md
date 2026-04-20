# API

Интерактивная документация — **Swagger** на `/api/docs` (dev: `http://localhost:4000/api/docs`).
Базовый префикс: `/api/v1`.

## Auth

### Клиент (SMS)

```http
POST /api/v1/auth/sms/request
Content-Type: application/json

{ "phone": "+79881234567" }
```

Ответ: `{ "sent": true, "ttlSec": 300 }`. Лимит: 3 запроса / 15 мин / номер.

```http
POST /api/v1/auth/sms/verify
Content-Type: application/json

{ "phone": "+79881234567", "code": "123456", "name": "Ахмед" }
```

Ответ: `{ "accessToken": "...", "role": "CLIENT", "clientId": "..." }` + `Set-Cookie: rt=...; HttpOnly`.

### Персонал (email + пароль + TOTP)

```http
POST /api/v1/auth/staff/login
{ "email": "d@05auto.ru", "password": "...", "totp": "123456" }
```

При первом входе вернётся `{ requires2faEnrollment: true, qrDataUrl: "data:image/png;base64,..." }`.
После сканирования QR — повторить запрос с `totp` из приложения.

### Refresh / Logout

```http
POST /api/v1/auth/refresh        # использует httpOnly cookie
POST /api/v1/auth/logout
```

## Клиентские роуты

| Метод | Путь | Описание | Роль |
|-------|------|----------|------|
| GET | `/clients/me` | мой профиль с авто | CLIENT |
| PATCH | `/clients/me` | обновить имя | CLIENT |
| GET | `/vehicles/brands` | справочник марок/моделей | public |
| GET | `/vehicles/me` | мои авто | CLIENT |
| POST | `/vehicles` | добавить авто | CLIENT |
| PATCH | `/vehicles/:id` | изменить | CLIENT |
| DELETE | `/vehicles/:id` | удалить | CLIENT |
| POST | `/vehicles/model-request` | «нет моей модели» | CLIENT |
| GET | `/appointments/slots` | свободные слоты | public |
| POST | `/appointments` | записаться | CLIENT |
| GET | `/appointments/me` | мои записи | CLIENT |
| GET | `/reminders/me` | напоминания | CLIENT |
| POST | `/reminders` | создать | CLIENT |

## Публичные

- `GET /catalog/categories`, `/catalog/parts?category=...&q=...`, `/catalog/parts/:sku`
- `GET /catalog/services` — услуги
- `GET /content/posts`, `/content/posts/:slug`
- `GET /content/reviews`, `/content/faq`, `/content/certificates`, `/content/instructions`
- `POST /callback` — заявка на обратный звонок (rate-limit 5/час/IP + honeypot)

## Для персонала

- `GET/PATCH /work-orders[/:id]` — наряды (MASTER: только свои; DIRECTOR: все)
- `POST /inventory/receipts` — приход по накладной
- `POST /inventory/write-off` — ручное списание
- `GET /inventory/parts` — склад
- `GET/POST /finance/transactions`, `GET /finance/report?from=...&to=...`
- `GET/PATCH /callback` — лента заявок (DIRECTOR)
- `POST/PATCH /content/instructions` — CMS инструкций (DIRECTOR)

## Генерация TS-клиента

После запуска API:

```bash
npx openapi-typescript http://localhost:4000/api/docs-json -o packages/shared/src/generated/api.d.ts
```

(опционально — ещё не добавлено в CI, но Swagger-доступно.)

## Коды ошибок

Все ошибки в формате:

```json
{
  "statusCode": 400,
  "error": "BadRequest",
  "message": ["phone must match pattern ..."],
  "path": "/api/v1/auth/sms/request",
  "timestamp": "2026-04-20T12:00:00.000Z"
}
```

HTTP-статусы:
- `400` — валидация
- `401` — нет/невалидный токен
- `403` — недостаточно прав (RBAC)
- `404` — не найдено
- `429` — rate-limit сработал
- `500` — внутренняя ошибка (детали только в логах)
