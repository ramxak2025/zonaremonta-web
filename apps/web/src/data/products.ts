/**
 * Каталог товаров магазина ГБО.
 * installLabor — цена работы ПО ЗАМЕНЕ / УСТАНОВКЕ конкретной детали на месте.
 * installLaborSale — цена работы при покупке детали у нас (скидка).
 */
export interface Product {
  id: string;
  slug: string;
  category: string;
  name: string;
  brand: string;
  article: string;
  description: string;
  price: number;
  installLabor: number;
  installLaborSale: number;
  inStock: boolean;
  badge?: 'hit' | 'new' | 'sale';
  specs: ReadonlyArray<{ k: string; v: string }>;
}

export interface ProductCategory {
  slug: string;
  name: string;
  description: string;
  iconKey: 'reducers' | 'injectors' | 'ecu' | 'cylinders' | 'kits' | 'fittings';
  tags: readonly string[];
}

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  {
    slug: 'reducers',
    name: 'Редукторы',
    description: 'Испарители газа Lovato, BRC, Tomasetto, OMVL',
    iconKey: 'reducers',
    tags: ['Lovato', 'BRC', 'Tomasetto', 'OMVL'],
  },
  {
    slug: 'injectors',
    name: 'Форсунки',
    description: 'Газовые форсунки 3/4 Ом для всех поколений ГБО',
    iconKey: 'injectors',
    tags: ['Hana', 'Valtek', 'Barracuda', 'Rail'],
  },
  {
    slug: 'ecu',
    name: 'Электронные блоки (ЭБУ)',
    description: 'Блоки управления для MPI и прямого впрыска',
    iconKey: 'ecu',
    tags: ['Digitronic', 'Lovato Smart', 'Prins VSI-DI'],
  },
  {
    slug: 'cylinders',
    name: 'Баллоны',
    description: 'Тороидальные и цилиндрические: металл и композит',
    iconKey: 'cylinders',
    tags: ['Атикер', 'Stako', 'Композит'],
  },
  {
    slug: 'kits',
    name: 'Комплекты ГБО',
    description: 'Готовые комплекты под двигатель: 4 / 6 / 8 цил. и прямой впрыск',
    iconKey: 'kits',
    tags: ['4-цил.', '6-цил.', 'Direct Injection'],
  },
  {
    slug: 'fittings',
    name: 'Фитинги и арматура',
    description: 'Мультиклапаны, ВЗУ, шланги, фильтры, хомуты',
    iconKey: 'fittings',
    tags: ['Мультиклапан', 'ВЗУ', 'Фильтр'],
  },
];

export const PRODUCTS: readonly Product[] = [
  // ── Редукторы ────────────────────────────────
  {
    id: 'r-lovato-rgj',
    slug: 'lovato-rgj-hp',
    category: 'reducers',
    name: 'Редуктор Lovato RGJ HP',
    brand: 'Lovato',
    article: 'LV-RGJ-HP-140',
    description: 'Двухступенчатый редуктор-испаритель для двигателей до 140 кВт. Итальянская сборка.',
    price: 6500,
    installLabor: 2500,
    installLaborSale: 1800,
    inStock: true,
    badge: 'hit',
    specs: [
      { k: 'Мощность', v: 'до 140 кВт' },
      { k: 'Давление входа', v: '2,5 бар' },
      { k: 'Электроклапан', v: 'встроенный' },
    ],
  },
  {
    id: 'r-brc-genius-mb',
    slug: 'brc-genius-mb',
    category: 'reducers',
    name: 'Редуктор BRC Genius MB',
    brand: 'BRC',
    article: 'BRC-GN-MB',
    description: 'Топовая итальянская мембрана. Надёжен на турбомоторах и при больших пробегах.',
    price: 9800,
    installLabor: 2500,
    installLaborSale: 1800,
    inStock: true,
    specs: [
      { k: 'Мощность', v: 'до 200 кВт' },
      { k: 'Тип', v: '2-ступенчатый' },
      { k: 'Страна', v: 'Италия' },
    ],
  },
  {
    id: 'r-tomasetto-at-09',
    slug: 'tomasetto-at-09',
    category: 'reducers',
    name: 'Редуктор Tomasetto AT-09',
    brand: 'Tomasetto',
    article: 'TOM-AT09',
    description: 'Базовый надёжный вариант для 4-цилиндровых двигателей до 110 кВт.',
    price: 4900,
    installLabor: 2500,
    installLaborSale: 1800,
    inStock: true,
    specs: [
      { k: 'Мощность', v: 'до 110 кВт' },
      { k: 'Разъём', v: 'AMP' },
      { k: 'Регулировка', v: 'механическая' },
    ],
  },
  {
    id: 'r-omvl-r90',
    slug: 'omvl-r90-e',
    category: 'reducers',
    name: 'Редуктор OMVL R90/E',
    brand: 'OMVL',
    article: 'OMVL-R90E',
    description: 'Премиум-редуктор для прямого впрыска и турбомоторов. Стабильный расход.',
    price: 12500,
    installLabor: 3500,
    installLaborSale: 2500,
    inStock: false,
    badge: 'new',
    specs: [
      { k: 'Мощность', v: 'до 250 кВт' },
      { k: 'Для', v: 'GDI / TSI / D-4S' },
      { k: 'Датчик', v: 'MAP + T газа' },
    ],
  },

  // ── Форсунки ────────────────────────────────
  {
    id: 'i-hana-h2000',
    slug: 'hana-h2000',
    category: 'injectors',
    name: 'Форсунки Hana H2000 (4 шт.)',
    brand: 'Hana',
    article: 'HN-H2000-4',
    description: 'Корейские форсунки 3 Ом. Стандарт для MPI-установок последних 10 лет.',
    price: 7400,
    installLabor: 2000,
    installLaborSale: 1400,
    inStock: true,
    badge: 'hit',
    specs: [
      { k: 'Сопротивление', v: '3 Ом' },
      { k: 'Время срабатывания', v: '2,5 мс' },
      { k: 'Рампа', v: 'опционально' },
    ],
  },
  {
    id: 'i-valtek-type-30',
    slug: 'valtek-type-30',
    category: 'injectors',
    name: 'Форсунки Valtek Type-30 (4 шт.)',
    brand: 'Valtek',
    article: 'VT-T30-4',
    description: 'Польские форсунки с быстрым откликом. Подходят для форсированных моторов.',
    price: 8200,
    installLabor: 2000,
    installLaborSale: 1400,
    inStock: true,
    specs: [
      { k: 'Сопротивление', v: '3 Ом' },
      { k: 'Тип', v: 'плунжерные' },
      { k: 'Ресурс', v: '200+ тыс. км' },
    ],
  },
  {
    id: 'i-barracuda',
    slug: 'barracuda-rail-4',
    category: 'injectors',
    name: 'Рампа Barracuda (4 форсунки)',
    brand: 'Barracuda',
    article: 'BAR-R4-3OM',
    description: 'Готовая рампа 4 форсунки на общей базе. Быстрый монтаж, стабильная работа.',
    price: 9600,
    installLabor: 2200,
    installLaborSale: 1500,
    inStock: true,
    specs: [
      { k: 'Количество', v: '4 форсунки' },
      { k: 'Сопротивление', v: '3 Ом' },
      { k: 'Температурный датчик', v: 'встроен' },
    ],
  },
  {
    id: 'i-rail-ig5',
    slug: 'rail-ig5',
    category: 'injectors',
    name: 'Рампа Rail IG5 (6 форсунок)',
    brand: 'Rail',
    article: 'RL-IG5-6',
    description: 'Для V6 двигателей. Две рампы по 3 форсунки на общей магистрали.',
    price: 14800,
    installLabor: 3000,
    installLaborSale: 2100,
    inStock: true,
    specs: [
      { k: 'Количество', v: '6 форсунок' },
      { k: 'Для', v: 'V6 / рядные 6' },
      { k: 'Сопротивление', v: '2 Ом' },
    ],
  },

  // ── ЭБУ ────────────────────────────────
  {
    id: 'e-digitronic-dgi',
    slug: 'digitronic-dgi',
    category: 'ecu',
    name: 'ЭБУ Digitronic DGI 4',
    brand: 'Digitronic',
    article: 'DGI-4',
    description: 'Блок управления для 4-цилиндровых MPI-установок. Простая настройка через USB.',
    price: 11500,
    installLabor: 3500,
    installLaborSale: 2500,
    inStock: true,
    specs: [
      { k: 'Цилиндров', v: '4' },
      { k: 'Связь', v: 'USB / Bluetooth' },
      { k: 'Карты', v: 'автообучение' },
    ],
  },
  {
    id: 'e-lovato-smart',
    slug: 'lovato-smart-eg',
    category: 'ecu',
    name: 'ЭБУ Lovato Smart EG',
    brand: 'Lovato',
    article: 'LV-SMART-EG',
    description: 'Универсальный блок для 4/6/8 цилиндров с автоадаптацией карт расхода.',
    price: 14200,
    installLabor: 3500,
    installLaborSale: 2500,
    inStock: true,
    badge: 'hit',
    specs: [
      { k: 'Цилиндров', v: '4 / 6 / 8' },
      { k: 'OBD', v: 'CAN-шина' },
      { k: 'Режим', v: 'auto-learn' },
    ],
  },
  {
    id: 'e-prins-vsi-di',
    slug: 'prins-vsi-di',
    category: 'ecu',
    name: 'ЭБУ Prins VSI-DI 3.0',
    brand: 'Prins',
    article: 'PRN-VSIDI-3',
    description: 'Флагман для прямого впрыска. Защита форсунок, адаптивное управление.',
    price: 48000,
    installLabor: 12000,
    installLaborSale: 8500,
    inStock: true,
    badge: 'new',
    specs: [
      { k: 'Тип', v: 'GDI / FSI / TSI / D-4S' },
      { k: 'Связь', v: 'CAN + K-line' },
      { k: 'Гарантия', v: '2 года' },
    ],
  },

  // ── Баллоны ────────────────────────────────
  {
    id: 'c-atiker-42t',
    slug: 'atiker-tor-42',
    category: 'cylinders',
    name: 'Тороидальный баллон 42 л (Атикер)',
    brand: 'Атикер',
    article: 'AT-TOR-42',
    description: 'Ставится в нишу запаски — багажник свободен. Металл, гарантия 10 лет.',
    price: 7800,
    installLabor: 2500,
    installLaborSale: 1800,
    inStock: true,
    specs: [
      { k: 'Объём', v: '42 л' },
      { k: 'Форма', v: 'тороидальный' },
      { k: 'Поверка', v: 'раз в 5 лет' },
    ],
  },
  {
    id: 'c-stako-60',
    slug: 'stako-cyl-60',
    category: 'cylinders',
    name: 'Цилиндрический баллон 60 л (Stako)',
    brand: 'Stako',
    article: 'ST-CYL-60',
    description: 'Польский металлический баллон, устанавливается в багажник. Надёжная классика.',
    price: 8900,
    installLabor: 2000,
    installLaborSale: 1500,
    inStock: true,
    specs: [
      { k: 'Объём', v: '60 л' },
      { k: 'Диаметр', v: '360 мм' },
      { k: 'Материал', v: 'сталь' },
    ],
  },
  {
    id: 'c-composite-90',
    slug: 'composite-90',
    category: 'cylinders',
    name: 'Композитный баллон 90 л',
    brand: 'Ragasco',
    article: 'RG-COMP-90',
    description: 'Лёгкий композитный баллон (в 2 раза легче металла). Поверка — 2 года.',
    price: 28000,
    installLabor: 2500,
    installLaborSale: 1800,
    inStock: false,
    badge: 'new',
    specs: [
      { k: 'Объём', v: '90 л' },
      { k: 'Материал', v: 'композит' },
      { k: 'Масса', v: '~22 кг' },
    ],
  },

  // ── Комплекты ────────────────────────────────
  {
    id: 'k-lovato-4',
    slug: 'kit-lovato-4cyl',
    category: 'kits',
    name: 'Комплект ГБО Lovato на 4 цил.',
    brand: 'Lovato',
    article: 'LV-KIT-4',
    description: 'Полный комплект: редуктор, 4 форсунки, ЭБУ, проводка. Баллон докупается отдельно.',
    price: 28500,
    installLabor: 11000,
    installLaborSale: 8500,
    inStock: true,
    badge: 'hit',
    specs: [
      { k: 'Цилиндров', v: '4' },
      { k: 'Оборудование', v: 'Lovato' },
      { k: 'Баллон', v: 'докупается' },
    ],
  },
  {
    id: 'k-brc-6',
    slug: 'kit-brc-6cyl',
    category: 'kits',
    name: 'Комплект ГБО BRC на 6 цил.',
    brand: 'BRC',
    article: 'BRC-KIT-6',
    description: 'Итальянский комплект для V6 / рядных 6. Усиленный редуктор и 6 форсунок.',
    price: 42000,
    installLabor: 14000,
    installLaborSale: 10500,
    inStock: true,
    specs: [
      { k: 'Цилиндров', v: '6' },
      { k: 'Оборудование', v: 'BRC' },
      { k: 'Редуктор', v: 'Genius MB' },
    ],
  },
  {
    id: 'k-prins-di',
    slug: 'kit-prins-di',
    category: 'kits',
    name: 'Комплект Prins VSI-DI (прямой впрыск)',
    brand: 'Prins',
    article: 'PRN-VSIDI-KIT',
    description: 'Флагманский комплект для GDI/FSI/TSI/D-4S. Полная защита бензиновых форсунок.',
    price: 89000,
    installLabor: 22000,
    installLaborSale: 16000,
    inStock: true,
    badge: 'new',
    specs: [
      { k: 'Тип впрыска', v: 'прямой (GDI/TSI)' },
      { k: 'Оборудование', v: 'Prins' },
      { k: 'Гарантия', v: '2 года' },
    ],
  },

  // ── Фитинги ────────────────────────────────
  {
    id: 'f-multi-atiker-360',
    slug: 'multivalve-atiker-360',
    category: 'fittings',
    name: 'Мультиклапан Атикер d=360',
    brand: 'Атикер',
    article: 'AT-MV-360',
    description: 'Для тороидальных баллонов 42 л. Автоматическая отсечка при ДТП.',
    price: 2800,
    installLabor: 1500,
    installLaborSale: 1000,
    inStock: true,
    specs: [
      { k: 'Диаметр', v: '360 мм' },
      { k: 'Наклон', v: '0°' },
      { k: 'Датчик уровня', v: 'AEB 1050' },
    ],
  },
  {
    id: 'f-vzu-atiker',
    slug: 'vzu-atiker',
    category: 'fittings',
    name: 'ВЗУ (заправочное устройство)',
    brand: 'Атикер',
    article: 'AT-VZU-EU',
    description: 'Внешнее заправочное устройство, EU-стандарт, врезается в бампер.',
    price: 1900,
    installLabor: 1200,
    installLaborSale: 800,
    inStock: true,
    specs: [
      { k: 'Стандарт', v: 'EU (ACME)' },
      { k: 'Место', v: 'бампер / порог' },
      { k: 'Материал', v: 'латунь' },
    ],
  },
  {
    id: 'f-filter-fast',
    slug: 'filter-fast',
    category: 'fittings',
    name: 'Фильтр газа FAST (жидкая фаза)',
    brand: 'FAST',
    article: 'FAST-FL-LQ',
    description: 'Картриджный фильтр жидкой фазы. Замена по регламенту раз в 10 тыс. км.',
    price: 850,
    installLabor: 700,
    installLaborSale: 400,
    inStock: true,
    specs: [
      { k: 'Фаза', v: 'жидкая' },
      { k: 'Картридж', v: 'сменный' },
      { k: 'Регламент', v: '10 000 км' },
    ],
  },
];

export function getCategory(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): readonly Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
