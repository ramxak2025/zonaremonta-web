# PERFORMANCE

## Цели

- Lighthouse (mobile + desktop): Performance / Accessibility / Best Practices / SEO ≥ 90.
- p95 API-ответов ≤ 300 мс.
- TTFB главной ≤ 200 мс (ISR кэш + Nginx).

## Что сделано

### Frontend

- Next.js 15 в режиме `output: 'standalone'` — минимальный прод-контейнер.
- ISR `revalidate = 3600` на лендинге, /services, /catalog, /blog.
- `next/font` (Inter) c `display: 'swap'` — нет FOIT.
- `optimizePackageImports: ['lucide-react', 'framer-motion']` — меньше bundle size.
- Nginx отдаёт `_next/static/` с `Cache-Control: immutable, max-age=31536000`.
- Загрузки сжимаются sharp'ом в webp (качество 82) + thumb 480px (качество 78).
- Gzip на Nginx для text/json/js/css/svg.

### Backend

- Prisma индексы на ключевых выборках: `clients(phone)`, `vehicles(clientId,hasGbo)`, `work_orders(status,openedAt)`, `transactions(direction,date)`, `audit_log(userId,createdAt)` и т. д. — см. `schema.prisma`.
- Throttler `60/min` на все роуты, на `/auth/sms/*` — жестче (3–10 запросов в окно).
- Аудит-лог пишется асинхронно в `tap(...)` — не блокирует ответ.

## Что замерить после деплоя

1. `EXPLAIN ANALYZE` для трёх частых запросов:

```sql
-- лента нарядов мастера
EXPLAIN ANALYZE
SELECT * FROM "WorkOrder"
WHERE "masterId" = $1
ORDER BY "openedAt" DESC
LIMIT 100;

-- поиск клиента
EXPLAIN ANALYZE
SELECT * FROM "Client"
WHERE "phone" LIKE '%2345%'
   OR lower("name") LIKE '%иванов%'
ORDER BY "createdAt" DESC
LIMIT 50;

-- отчёт за месяц
EXPLAIN ANALYZE
SELECT direction, SUM(amount)
FROM "Transaction"
WHERE "date" BETWEEN $1 AND $2
GROUP BY direction;
```

Если seq scan — добавить составной индекс.

2. Lighthouse CI на staging:

```bash
npx @lhci/cli autorun --collect.url=https://05auto.ru --collect.url=https://05auto.ru/services
```

Результаты сохранять в `performance-reports/`.

## Известные возможные оптимизации (следующая итерация)

- Включить Brotli на Nginx (пересобрать `nginx-module-brotli` или перейти на Openresty).
- Перенести картинки из `/var/lib/05auto/uploads` в CDN (Selectel CDN) с origin pull.
- Добавить `react-hook-form` devtools только в dev-режиме (сейчас уже tree-shakeable).
- Включить HTTP/3 (QUIC) на Nginx при обновлении до ветки mainline.
