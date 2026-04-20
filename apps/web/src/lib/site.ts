export const SITE = {
  name: 'Зона Ремонта',
  short: '05auto',
  domain: '05auto.ru',
  description:
    'Установка, ремонт и диагностика ГБО в Махачкале. Продажа комплектующих. Гарантия на работы 1 год.',
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+7 (988) 000-00-00',
  address: process.env.NEXT_PUBLIC_ADDRESS ?? 'г. Махачкала, ул. пример, 1',
  workingHours: 'ПН-СБ: 9:00–20:00, ВС: выходной',
  coordinates: { lat: 42.9831, lng: 47.5047 },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://05auto.ru',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
};
