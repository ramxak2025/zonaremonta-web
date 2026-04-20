/**
 * Контракт внешнего провайдера учёта (1С / МойСклад / другой ERP).
 * Реализация — во второй итерации, см. INTEGRATIONS.md.
 */
export abstract class ExternalInventoryProvider {
  /** Импорт позиций номенклатуры */
  abstract importParts(): Promise<Array<{
    externalId: string;
    sku: string;
    name: string;
    categoryHint?: string;
    costPrice: number;
    retailPrice: number;
    stockQty: number;
    manufacturer?: string;
  }>>;

  /** Импорт текущих остатков */
  abstract importStock(): Promise<Array<{ externalId: string; stockQty: number }>>;

  /** Экспорт продаж / списаний */
  abstract exportMovements(movements: Array<{
    externalId: string;
    qty: number;
    price: number;
    date: Date;
    reason: 'work_order' | 'write_off' | 'sale';
  }>): Promise<{ ok: boolean; accepted: number; rejected: number }>;

  /** Периодичность синхронизации (cron-выражение) */
  abstract syncCron: string;
}
