import { promises as fs } from 'node:fs';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

/**
 * Файловый storage для редактируемого контента.
 * В Docker файлы должны быть на mounted volume (см. docker-compose),
 * иначе изменения теряются при пересборке. На время разработки —
 * читаем из дефолтов в `defaults/` если файла нет.
 */

// На проде маунтим volume в /app/content. Локально — apps/web/content.
const CONTENT_DIR = process.env.CONTENT_DIR ?? path.join(process.cwd(), 'content');
// Загруженные файлы лежат в public/uploads — Next.js сервит их автоматически как /uploads/...
const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'public', 'uploads');

export const STORAGE_PATHS = {
  contentDir: CONTENT_DIR,
  uploadsDir: UPLOADS_DIR,
};

// ───────── DEFAULTS ─────────

export interface ServiceKit {
  id: string;
  badge: string;
  title: string;
  type: 'mpi' | 'di';
  cylinders?: '4' | '6' | '8';
  forWho: string;
  brands: string;
  priceFrom: number;
  features: string[];
  featured?: boolean;
}

export interface ServicesContent {
  installKits: ServiceKit[];
  repairServices: Array<{
    id: string;
    title: string;
    text: string;
    priceFrom: number;
    durationMin: number;
  }>;
}

export interface AboutContent {
  foundedYear: number;
  totalInstalls: number;
  yearsExperience: number;
  story: string;
  philosophy: string;
  details: Array<{ title: string; text: string }>;
}

export interface ContactContent {
  phone: string;
  whatsappNumber: string;
  maxLink: string;
  yandexMapsLink: string;
  address: string;
  workingHours: string;
  coordinates: { lat: number; lng: number };
}

export interface Work {
  id: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  type: 'mpi' | 'gdi' | 'combined';
  equipment: string;
  price: number;
  date: string;
  cover: string;
  process: Array<{ src: string; caption: string }>;
}

export const DEFAULT_SERVICES: ServicesContent = {
  installKits: [
    { id: 'i4',    badge: '4',    cylinders: '4', title: 'На 4 цилиндра',          type: 'mpi', forWho: 'Lada, Toyota, Hyundai, Kia, VW и большинство массовых авто 2005+ года.', brands: 'Lovato · BRC · Digitronic · KME', priceFrom: 38000, features: ['4 газовые форсунки', 'Редуктор с электроклапаном', 'ЭБУ с картами расхода', 'Гарантия 1 год'] },
    { id: 'i6',    badge: '6',    cylinders: '6', title: 'На 6 цилиндров',         type: 'mpi', forWho: 'V6 и L6: Toyota Camry V6, BMW, Hyundai Grandeur, премиум-седаны.',        brands: 'Lovato · BRC · Digitronic',        priceFrom: 48000, features: ['6 газовых форсунок', 'Усиленный редуктор', 'ЭБУ под 6-цил.', 'Гарантия 1 год'] },
    { id: 'v8',    badge: '8',    cylinders: '8', title: 'На V8',                   type: 'mpi', forWho: 'Внедорожники и пикапы: Land Cruiser 200, Lexus LX, Ford F-150, GMC.',     brands: 'Lovato · BRC',                     priceFrom: 65000, features: ['8 газовых форсунок', 'Два редуктора', 'Расширенный ЭБУ', 'Баллон 90–120 л'] },
    { id: 'gdi',   badge: 'DI',                   title: 'На прямой впрыск',        type: 'di',  forWho: 'Современные турбомоторы: VW TSI, Mercedes CGI, Kia GDI, китайские TGDI.', brands: 'Prins VSI-DI · OMVL DREAM',        priceFrom: 95000, features: ['Работа с впрыском в цилиндр', 'Защита бензиновых форсунок', 'Адаптивное управление', 'Гарантия 1 год'], featured: true },
    { id: 'combi', badge: 'DUAL',                 title: 'На комбинированный впрыск', type: 'di', forWho: 'Toyota D-4S (Camry, RAV4, Land Cruiser Prado), Volvo VEA, новые Audi TFSI.', brands: 'Prins VSI-DI · OMVL DREAM XXI',  priceFrom: 110000, features: ['Работа с двумя системами', 'Автопереключение режимов', 'Сохранение прошивок', 'Гарантия 1 год'], featured: true },
  ],
  repairServices: [
    { id: 'diag',     title: 'Компьютерная диагностика на стенде', priceFrom: 1500, durationMin: 30, text: 'Подключаемся к ЭБУ, читаем коды ошибок, проверяем карты расхода и параметры в реальном времени.' },
    { id: 'reductor', title: 'Ремонт редуктора',                  priceFrom: 2500, durationMin: 90, text: 'Замена мембран, фильтров, клапанов. Восстановление герметичности.' },
    { id: 'inj',      title: 'Чистка / замена форсунок',          priceFrom: 1800, durationMin: 60, text: 'Ультразвуковая чистка форсунок. Замена при выходе из строя.' },
    { id: 'ecu',      title: 'Прошивка / замена ЭБУ',             priceFrom: 3500, durationMin: 60, text: 'Перепрошивка блоков управления под актуальные карты расхода.' },
    { id: 'mv',       title: 'Ремонт мультиклапана / ВЗУ',        priceFrom: 1200, durationMin: 40, text: 'Восстановление герметичности, замена соленоида.' },
    { id: 'cyl',      title: 'Подготовка к поверке баллона',      priceFrom: 1500, durationMin: 60, text: 'Снятие баллона, диагностика арматуры.' },
  ],
};

export const DEFAULT_ABOUT: AboutContent = {
  foundedYear: 2012,
  totalInstalls: 2548,
  yearsExperience: new Date().getFullYear() - 2012,
  story:
    'Зона Ремонта работает с 2012 года. Команда обучалась в Москве в Академии ГБО — ' +
    'у нас сертификаты по работе с системами Lovato, BRC, Prins и OMVL. После обучения ' +
    'мы доработали процессы под себя и отказались от компромиссов в пользу скорости.',
  philosophy:
    'Мы делаем установку не так, как удобно мастеру, а по своим внутренним шаблонам. ' +
    'Каждый провод раздевается и упаковывается в гофру по нашей схеме. ' +
    'Каждый шланг — тоже в защитную гофру. Из-за этого мы тратим больше времени на одну ' +
    'установку, чем «гаражные» сервисы — но узлы ГБО служат в разы дольше штатной системы.',
  details: [
    { title: 'Гофры на проводке',          text: 'Вся проводка раздевается и упаковывается в гофры по нашей внутренней схеме. Защита от вибрации, влаги и грызунов.' },
    { title: 'Защита шлангов',             text: 'Каждый шланг газовой магистрали идёт в защитной гофре. Это сохраняет эластичность резины и продлевает ресурс в несколько раз.' },
    { title: 'Внутренние шаблоны монтажа', text: 'Установка по нашим инструкциям, а не «как удобно сейчас». Каждый узел стоит ровно там, где должен — для удобного обслуживания через годы.' },
    { title: 'Дольше — но качественнее',   text: 'У нас на установку уходит больше времени, чем у конкурентов. Это сознательный выбор: лучше делать раз, чем переделывать.' },
    { title: 'Сертификация',               text: 'Команда обучалась в Академии ГБО в Москве. Есть сертификаты на работу с Lovato, BRC, Prins, OMVL.' },
    { title: 'Один объект — одна команда', text: 'Над авто работают 1–2 мастера от начала до конца. Никаких передач смены, никаких «забыл напарник».' },
  ],
};

export const DEFAULT_CONTACT: ContactContent = {
  phone: '+7 (988) 000-00-00',
  whatsappNumber: '79880000000',
  maxLink: 'https://max.ru/05auto',
  yandexMapsLink: 'https://yandex.ru/maps/?text=Махачкала%20Зона%20ремонта',
  address: 'г. Махачкала, ул. пример, 1',
  workingHours: 'ПН-СБ: 9:00–20:00, ВС: выходной',
  coordinates: { lat: 42.9831, lng: 47.5047 },
};

const ph = (seed: number, label: string) =>
  `https://picsum.photos/seed/${seed}/1200/800?label=${encodeURIComponent(label)}`;

export const DEFAULT_WORKS: Work[] = [
  {
    id: 'w1', brand: 'Toyota', model: 'Camry', year: 2018, engine: '2.5 D-4S', type: 'combined',
    equipment: 'Prins VSI-DI 3.0 + баллон тор. 42 л Атикер', price: 110000, date: '2026-04-12',
    cover: ph(101, 'Camry'),
    process: [
      { src: ph(1011, '1'), caption: 'Снятие подкапотного пластика, диагностика двигателя' },
      { src: ph(1012, '2'), caption: 'Монтаж редуктора Prins на штатные кронштейны' },
      { src: ph(1013, '3'), caption: 'Адаптеры и газовые форсунки в коллекторе' },
      { src: ph(1014, '4'), caption: 'Заправочное устройство, вмонтированное в задний бампер' },
      { src: ph(1015, '5'), caption: 'Настройка карт расхода через ноутбук с PrinsTool' },
    ],
  },
  {
    id: 'w2', brand: 'Lada', model: 'Granta', year: 2021, engine: '1.6 8V', type: 'mpi',
    equipment: 'Lovato Smart EG + 4 форсунки Hana + баллон цил. 42 л', price: 38000, date: '2026-04-09',
    cover: ph(102, 'Granta'),
    process: [
      { src: ph(1021, '1'), caption: 'Замер компрессии и проверка топливной системы' },
      { src: ph(1022, '2'), caption: 'Установка редуктора Lovato в моторном отсеке' },
      { src: ph(1023, '3'), caption: 'Газовые форсунки 3 Ом, врезка в коллектор' },
      { src: ph(1024, '4'), caption: 'Цилиндрический баллон 42 л в багажник' },
    ],
  },
  {
    id: 'w3', brand: 'Haval', model: 'Jolion', year: 2023, engine: '1.5T (TGDI)', type: 'gdi',
    equipment: 'Prins VSI-DI 3.0 + баллон тор. 42 л', price: 99000, date: '2026-04-05',
    cover: ph(103, 'Haval'),
    process: [
      { src: ph(1031, '1'), caption: 'Подключение к штатной системе прямого впрыска' },
      { src: ph(1032, '2'), caption: 'Установка защиты бензиновых форсунок от закокса' },
      { src: ph(1033, '3'), caption: 'Монтаж блока управления Prins под капотом' },
    ],
  },
];

// ───────── READ / WRITE ─────────

async function ensureDir(p: string): Promise<void> {
  try {
    await fs.mkdir(p, { recursive: true });
  } catch {
    /* ignore */
  }
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const file = path.join(CONTENT_DIR, filename);
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDir(CONTENT_DIR);
  const file = path.join(CONTENT_DIR, filename);
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

export const services = {
  read: () => readJson<ServicesContent>('services.json', DEFAULT_SERVICES),
  write: async (data: ServicesContent) => {
    await writeJson('services.json', data);
    revalidatePath('/');
    revalidatePath('/install');
    revalidatePath('/repair');
  },
};

export const about = {
  read: () => readJson<AboutContent>('about.json', DEFAULT_ABOUT),
  write: async (data: AboutContent) => {
    await writeJson('about.json', data);
    revalidatePath('/about');
    revalidatePath('/');
  },
};

export const contact = {
  read: () => readJson<ContactContent>('contact.json', DEFAULT_CONTACT),
  write: async (data: ContactContent) => {
    await writeJson('contact.json', data);
    revalidatePath('/');
    revalidatePath('/install');
    revalidatePath('/repair');
    revalidatePath('/works');
  },
};

export const works = {
  read: () => readJson<Work[]>('works.json', DEFAULT_WORKS),
  write: async (data: Work[]) => {
    await writeJson('works.json', data);
    revalidatePath('/works');
    revalidatePath('/');
  },
};
