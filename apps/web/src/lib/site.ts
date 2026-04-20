export const SITE = {
  name: 'Зона Ремонта',
  short: '05auto',
  domain: '05auto.ru',
  description:
    'Установка, ремонт и диагностика ГБО в Махачкале. Продажа комплектующих. Гарантия на работы 1 год.',

  // === CONVERSION TARGETS ===
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+7 (988) 000-00-00',
  /** Номер для WhatsApp в международном формате без +/пробелов */
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP ?? '79880000000').replace(/[^\d]/g, ''),
  /** Ссылка Max-мессенджера (можно @username или прямая ссылка) */
  maxLink: process.env.NEXT_PUBLIC_MAX ?? 'https://max.ru/05auto',
  /** Прямая ссылка на точку в Я.Картах (шэринг-линк) */
  yandexMapsLink:
    process.env.NEXT_PUBLIC_YANDEX_MAPS_LINK ??
    'https://yandex.ru/maps/?text=%D0%9C%D0%B0%D1%85%D0%B0%D1%87%D0%BA%D0%B0%D0%BB%D0%B0%20%D0%97%D0%BE%D0%BD%D0%B0%20%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D0%B0',

  address: process.env.NEXT_PUBLIC_ADDRESS ?? 'г. Махачкала, ул. пример, 1',
  workingHours: 'ПН-СБ: 9:00–20:00, ВС: выходной',
  coordinates: { lat: 42.9831, lng: 47.5047 },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://05auto.ru',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
};

/** Готовые ссылки для CTA */
export function getContactLinks() {
  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');
  const waText = encodeURIComponent(
    'Здравствуйте! Интересует ГБО для моего авто. Подскажите, пожалуйста.',
  );
  return {
    phoneHref: `tel:${phoneDigits}`,
    whatsappHref: `https://wa.me/${SITE.whatsappNumber}?text=${waText}`,
    maxHref: SITE.maxLink,
    mapsHref: SITE.yandexMapsLink,
  };
}
