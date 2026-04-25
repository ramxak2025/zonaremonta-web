/**
 * Каталог выполненных работ. Фотографии — заглушки (реальные подменяются через
 * админку или прямую правку этого файла). Используем placeholder-сервис, чтобы
 * сайт сразу выглядел заполненным.
 */

export interface Work {
  id: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  type: 'mpi' | 'gdi' | 'combined';
  /** Краткое описание установленного оборудования. */
  equipment: string;
  /** Цена работы под ключ, ₽. */
  price: number;
  /** Дата выполнения работ (для сортировки). */
  date: string;
  /** Главная фотография авто (наружу/из бокса). */
  cover: string;
  /** 3–5 фото процесса монтажа. */
  process: ReadonlyArray<{ src: string; caption: string }>;
}

const ph = (seed: number, label: string) =>
  `https://picsum.photos/seed/${seed}/1200/800?label=${encodeURIComponent(label)}`;

export const WORKS: readonly Work[] = [
  {
    id: 'w1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2018,
    engine: '2.5 D-4S',
    type: 'combined',
    equipment: 'Prins VSI-DI 3.0 + баллон тор. 42 л Атикер',
    price: 110000,
    date: '2026-04-12',
    cover: ph(101, 'Camry 2018'),
    process: [
      { src: ph(1011, 'Снятие пластика'), caption: 'Снятие подкапотного пластика, диагностика двигателя' },
      { src: ph(1012, 'Монтаж редуктора'), caption: 'Монтаж редуктора Prins на штатные кронштейны' },
      { src: ph(1013, 'Установка форсунок'), caption: 'Адаптеры и газовые форсунки в коллекторе' },
      { src: ph(1014, 'ВЗУ'), caption: 'Заправочное устройство, вмонтированное в задний бампер' },
      { src: ph(1015, 'Калибровка'), caption: 'Настройка карт расхода через ноутбук с PrinsTool' },
    ],
  },
  {
    id: 'w2',
    brand: 'Lada',
    model: 'Granta',
    year: 2021,
    engine: '1.6 8V',
    type: 'mpi',
    equipment: 'Lovato Smart EG + 4 форсунки Hana + баллон цил. 42 л',
    price: 38000,
    date: '2026-04-09',
    cover: ph(102, 'Granta'),
    process: [
      { src: ph(1021, 'Диагностика'), caption: 'Замер компрессии и проверка топливной системы' },
      { src: ph(1022, 'Редуктор Lovato'), caption: 'Установка редуктора Lovato в моторном отсеке' },
      { src: ph(1023, 'Форсунки'), caption: 'Газовые форсунки 3 Ом, врезка в коллектор' },
      { src: ph(1024, 'Баллон'), caption: 'Цилиндрический баллон 42 л в багажник' },
    ],
  },
  {
    id: 'w3',
    brand: 'Haval',
    model: 'Jolion',
    year: 2023,
    engine: '1.5T (TGDI)',
    type: 'gdi',
    equipment: 'Prins VSI-DI 3.0 + баллон тор. 42 л',
    price: 99000,
    date: '2026-04-05',
    cover: ph(103, 'Haval Jolion'),
    process: [
      { src: ph(1031, 'Прямой впрыск'), caption: 'Подключение к штатной системе прямого впрыска' },
      { src: ph(1032, 'Защита форсунок'), caption: 'Установка защиты бензиновых форсунок от закокса' },
      { src: ph(1033, 'ЭБУ Prins'), caption: 'Монтаж блока управления Prins под капотом' },
      { src: ph(1034, 'Тюнинг'), caption: 'Подбор карт под турбомотор и заводские прошивки' },
    ],
  },
  {
    id: 'w4',
    brand: 'Kia',
    model: 'Sportage',
    year: 2019,
    engine: '2.0 GDI',
    type: 'gdi',
    equipment: 'OMVL DREAM + баллон тор. 42 л Stako',
    price: 95000,
    date: '2026-04-01',
    cover: ph(104, 'Kia Sportage'),
    process: [
      { src: ph(1041, 'Снятие декора'), caption: 'Снятие верхней пластиковой накладки двигателя' },
      { src: ph(1042, 'Установка OMVL'), caption: 'Установка редуктора OMVL DREAM' },
      { src: ph(1043, 'Адаптеры'), caption: 'Адаптеры и распайка проводки под прямой впрыск' },
      { src: ph(1044, 'Баллон Stako'), caption: 'Баллон Stako в нишу запасного колеса' },
    ],
  },
  {
    id: 'w5',
    brand: 'Toyota',
    model: 'Land Cruiser 200',
    year: 2017,
    engine: '4.6 V8',
    type: 'mpi',
    equipment: 'BRC Genius MB + 8 форсунок + 2 баллона по 65 л',
    price: 75000,
    date: '2026-03-28',
    cover: ph(105, 'Land Cruiser'),
    process: [
      { src: ph(1051, 'Двойной редуктор'), caption: 'Установка двух редукторов BRC (левый и правый ряд)' },
      { src: ph(1052, '8 форсунок'), caption: '8 газовых форсунок Valtek' },
      { src: ph(1053, 'Два баллона'), caption: 'Два баллона по 65 л в багажник' },
      { src: ph(1054, 'Тестовая поездка'), caption: 'Проверка работы под нагрузкой и переключения режимов' },
    ],
  },
  {
    id: 'w6',
    brand: 'Hyundai',
    model: 'Solaris',
    year: 2020,
    engine: '1.6 MPI',
    type: 'mpi',
    equipment: 'Digitronic DGI + 4 форсунки Barracuda + тор. 42 л',
    price: 38000,
    date: '2026-03-22',
    cover: ph(106, 'Solaris'),
    process: [
      { src: ph(1061, 'Подбор'), caption: 'Подбор оборудования под двигатель Gamma 1.6' },
      { src: ph(1062, 'ЭБУ Digitronic'), caption: 'Монтаж блока управления Digitronic DGI' },
      { src: ph(1063, 'Калибровка'), caption: 'Автообучение карт расхода после первых 50 км' },
    ],
  },
  {
    id: 'w7',
    brand: 'VW',
    model: 'Polo',
    year: 2022,
    engine: '1.4 TSI',
    type: 'gdi',
    equipment: 'Prins VSI-DI 3.0 + баллон тор. 42 л',
    price: 99000,
    date: '2026-03-18',
    cover: ph(107, 'VW Polo'),
    process: [
      { src: ph(1071, 'TSI'), caption: 'Особенности работы с турбонаддувом TSI' },
      { src: ph(1072, 'Защита'), caption: 'Защита форсунок прямого впрыска от закокса' },
      { src: ph(1073, 'Финал'), caption: 'Закрытие декоративных накладок, тестовый запуск' },
    ],
  },
  {
    id: 'w8',
    brand: 'BMW',
    model: 'X5 (E70)',
    year: 2014,
    engine: '4.4 V8',
    type: 'mpi',
    equipment: 'BRC Sequent 56 + 8 форсунок + баллон цил. 90 л',
    price: 85000,
    date: '2026-03-12',
    cover: ph(108, 'BMW X5'),
    process: [
      { src: ph(1081, 'BMW V8'), caption: 'Сложный многоступенчатый монтаж на V8' },
      { src: ph(1082, '90 литров'), caption: 'Баллон 90 л в нишу запасного колеса' },
      { src: ph(1083, 'Прошивка ЭБУ'), caption: 'Перекалибровка ЭБУ под газ + бензин-режим' },
    ],
  },
  {
    id: 'w9',
    brand: 'Chery',
    model: 'Tiggo 7 Pro',
    year: 2023,
    engine: '1.5 TGDI',
    type: 'gdi',
    equipment: 'OMVL DREAM XXI + баллон тор. 42 л',
    price: 99000,
    date: '2026-03-05',
    cover: ph(109, 'Chery Tiggo'),
    process: [
      { src: ph(1091, 'TGDI'), caption: 'Подключение к китайскому турбомотору TGDI' },
      { src: ph(1092, 'OMVL'), caption: 'Установка флагмана OMVL DREAM XXI' },
      { src: ph(1093, 'Гарантия'), caption: 'Оформление гарантии 1 год + регламент ТО' },
    ],
  },
];

export function getWork(id: string): Work | undefined {
  return WORKS.find((w) => w.id === id);
}
