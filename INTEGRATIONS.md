# INTEGRATIONS — внешние системы

## 1С / МойСклад (складской учёт) — план

Сейчас склад ведётся в нашем Postgres. Интерфейс абстракции уже есть:

```ts
// apps/api/src/modules/inventory/external.interface.ts
abstract class ExternalInventoryProvider {
  abstract importParts(): Promise<...>;
  abstract importStock(): Promise<...>;
  abstract exportMovements(movements: ...): Promise<...>;
  abstract syncCron: string;
}
```

### Что импортировать

- Номенклатуру (SKU, название, категория, производитель, цена закупки, цена продажи).
- Остатки — ежедневно по cron (минимум раз в сутки), а также по триггеру из UI директора.

### Что экспортировать

- Продажи комплектующих (в момент закрытия наряд-заказа).
- Списания (каждое `stock_movement` типа WRITE_OFF).

### Реализация

1. Создать провайдер `MoySkladProvider implements ExternalInventoryProvider` с API-ключом в `.env`.
2. Подключить BullMQ-воркер `inventory-sync` с расписанием `0 3 * * *` (ночью).
3. Доп. таблица `external_part_links (partId, externalId, provider)` — чтобы маппить SKU с внешним id.
4. Обработка конфликтов: local wins для остатка, но лог расхождений отправляется директору в `notifications`.

Срок: 5–7 рабочих дней на полную реализацию с тестами.

## SMS (реализовано)

- `SmscProvider` — основной (SMSC.ru), требует `SMSC_LOGIN` / `SMSC_PASSWORD`.
- `SmsRuProvider` — резерв (sms.ru), требует `SMSRU_API_ID`.
- `MockSmsProvider` — для dev/CI.

Переключение через `SMS_PROVIDER=smsc|smsru|mock` в `.env`.

## Яндекс.Карты

Сейчас используется **iframe-виджет** (бесплатный, без API-ключа):

```
https://yandex.ru/map-widget/v1/?text=<address>&ll=<lng>,<lat>&z=15
```

При необходимости построения маршрутов / геолокации клиента — подключить JS SDK
через `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` (бесплатный ключ в кабинете Яндекс.Разработчиков).

## VK Video

Перезалив роликов на VK отсутствует — храним только ссылки. Фронт встраивает через iframe `https://vk.com/video_ext.php?oid=...&id=...&hd=1`. В CSP разрешены домены `vk.com`, `vkvideo.ru`.

## Платежи (отложено)

Онлайн-оплата не подключена в первой версии (владелец не подавал уведомление в РКН, и платёжки требуют передачи ПД). План:

1. ЮKassa для заявок на комплектующие (частный или юрлицо).
2. Webhook `/api/v1/payments/webhook` с проверкой подписи.
3. Статусы: `pending / succeeded / failed`, отражение в `transactions` (INCOME, категория `parts_sale`).

## Sentry

- `SENTRY_DSN` (бэк) и `NEXT_PUBLIC_SENTRY_DSN` (фронт) — EU-регион (Frankfurt), чтобы не выводить ПД за пределы ЕС/РФ.
- Инициализация — в `main.ts` и `instrumentation.ts` соответственно (добавить при росте нагрузки).
