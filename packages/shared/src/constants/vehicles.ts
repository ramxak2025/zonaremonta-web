/**
 * Справочник марок и типовых моделей.
 * Seed-скрипт apps/api/prisma/seed.ts грузит это в БД.
 * Клиент выбирает только из списка; «нет моей модели» — запрос к админу.
 */
export interface VehicleBrandSeed {
  slug: string;
  name: string;
  models: string[];
}

export const VEHICLE_BRANDS: readonly VehicleBrandSeed[] = [
  {
    slug: 'lada',
    name: 'Lada (ВАЗ)',
    models: [
      'Granta', 'Vesta', 'Largus', 'Niva Legend', 'Niva Travel',
      'Priora', 'Kalina', '2107', '2110', '2114', 'XRAY',
    ],
  },
  {
    slug: 'toyota',
    name: 'Toyota',
    models: [
      'Camry', 'Corolla', 'Land Cruiser', 'Land Cruiser Prado', 'RAV4',
      'Highlander', 'Avensis', 'Yaris', 'Hilux', 'Fortuner',
    ],
  },
  {
    slug: 'kia',
    name: 'Kia',
    models: [
      'Rio', 'Cerato', 'Optima', 'K5', 'Sportage', 'Sorento', 'Seltos',
      'Soul', 'Picanto', 'Carnival',
    ],
  },
  {
    slug: 'hyundai',
    name: 'Hyundai',
    models: [
      'Solaris', 'Accent', 'Elantra', 'Sonata', 'Creta', 'Tucson',
      'Santa Fe', 'i30', 'ix35', 'Palisade',
    ],
  },
  {
    slug: 'chevrolet',
    name: 'Chevrolet',
    models: ['Aveo', 'Cobalt', 'Cruze', 'Lacetti', 'Lanos', 'Niva', 'Captiva', 'Tahoe'],
  },
  {
    slug: 'renault',
    name: 'Renault',
    models: ['Logan', 'Sandero', 'Duster', 'Kaptur', 'Arkana', 'Megane', 'Fluence', 'Symbol'],
  },
  {
    slug: 'volkswagen',
    name: 'Volkswagen',
    models: ['Polo', 'Jetta', 'Passat', 'Golf', 'Tiguan', 'Touareg', 'Caddy', 'Transporter'],
  },
  {
    slug: 'nissan',
    name: 'Nissan',
    models: ['Almera', 'Sentra', 'Qashqai', 'X-Trail', 'Juke', 'Murano', 'Pathfinder', 'Terrano'],
  },
  {
    slug: 'skoda',
    name: 'Skoda',
    models: ['Rapid', 'Octavia', 'Superb', 'Fabia', 'Kodiaq', 'Karoq', 'Yeti'],
  },
  {
    slug: 'ford',
    name: 'Ford',
    models: ['Focus', 'Fusion', 'Mondeo', 'Kuga', 'EcoSport', 'Explorer', 'Transit'],
  },
  {
    slug: 'bmw',
    name: 'BMW',
    models: ['1 Series', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7'],
  },
  {
    slug: 'mercedes-benz',
    name: 'Mercedes-Benz',
    models: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'Sprinter'],
  },
  {
    slug: 'changan',
    name: 'Changan',
    models: ['CS35 Plus', 'CS55 Plus', 'CS75 Plus', 'CS95', 'UNI-K', 'UNI-V', 'Eado Plus'],
  },
  {
    slug: 'geely',
    name: 'Geely',
    models: ['Coolray', 'Atlas', 'Atlas Pro', 'Tugella', 'Monjaro', 'Emgrand', 'Okavango'],
  },
  {
    slug: 'haval',
    name: 'Haval',
    models: ['Jolion', 'F7', 'F7x', 'H9', 'Dargo', 'M6'],
  },
  {
    slug: 'chery',
    name: 'Chery',
    models: ['Tiggo 4 Pro', 'Tiggo 7 Pro', 'Tiggo 8 Pro', 'Tiggo 8 Pro Max', 'Arrizo 8'],
  },
  {
    slug: 'exeed',
    name: 'Exeed',
    models: ['LX', 'TXL', 'VX', 'RX'],
  },
  {
    slug: 'omoda',
    name: 'Omoda',
    models: ['C5', 'S5', 'S5 GT'],
  },
];

export const VEHICLE_YEAR_MIN = 1990;

/** Регулярка госномера РФ: А123АА 05 / 777 / 77 */
export const RU_LICENSE_PLATE_REGEX = /^[АВЕКМНОРСТУХA-Z]\d{3}[АВЕКМНОРСТУХA-Z]{2}\s?\d{2,3}$/u;

/** VIN: 17 символов, без I/O/Q */
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/** Поверка баллона ГБО */
export const GBO_CYLINDER_RECHECK_YEARS = {
  COMPOSITE: 2,
  METAL: 5,
} as const;
