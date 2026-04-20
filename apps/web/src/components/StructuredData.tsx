import type { PublicSettings } from '@05auto/shared';
import { SITE } from '@/lib/site';

interface Props {
  settings: Required<PublicSettings>;
}

/**
 * JSON-LD для поисковиков и AI-движков (ChatGPT Search, Perplexity, Google SGE).
 * AutoRepair + LocalBusiness + Offer + AggregateRating + разметка услуг.
 */
export function StructuredData({ settings }: Props) {
  const phone = settings['site.phone'].value;
  const address = settings['site.address'].value;
  const hours = settings['site.workingHours'].value;
  const rating = settings['reviews.yandex.rating'].value;
  const count = settings['reviews.yandex.count'].value;
  const yandexUrl = settings['reviews.yandex.url'].value;

  const business = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${SITE.siteUrl}/#business`,
    name: SITE.name,
    alternateName: '05auto',
    description:
      'Специализированный автосервис в Махачкале: установка ГБО 4-го поколения и ГБО 4+ для двигателей с непосредственным впрыском (GDI, FSI, TSI, D-4S, SkyActiv). Ремонт, диагностика, регистрация в ГИБДД.',
    url: SITE.siteUrl,
    telephone: phone,
    priceRange: '₽₽',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Махачкала',
      addressRegion: 'Республика Дагестан',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.coordinates.lat,
      longitude: SITE.coordinates.lng,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
    sameAs: [yandexUrl],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: count,
      bestRating: 5,
      worstRating: 1,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги по установке ГБО',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Установка ГБО 4-го поколения',
            description:
              'Электронная система впрыска газа для инжекторных двигателей. Комплект Lovato/BRC/Digitronic, настройка ЭБУ, регистрация в ГИБДД.',
            serviceType: 'ГБО 4-го поколения',
            areaServed: { '@type': 'City', name: 'Махачкала' },
          },
          price: '38000',
          priceCurrency: 'RUB',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: 38000,
            priceCurrency: 'RUB',
            minPrice: 38000,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Установка ГБО 4+ (прямой впрыск)',
            description:
              'Система для двигателей с непосредственным впрыском: TSI, FSI, GDI, D-4S, SkyActiv. Сохраняет ресурс бензиновых форсунок.',
            serviceType: 'ГБО 4+ Direct Injection',
            areaServed: { '@type': 'City', name: 'Махачкала' },
          },
          price: '95000',
          priceCurrency: 'RUB',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: 95000,
            priceCurrency: 'RUB',
            minPrice: 95000,
          },
        },
      ],
    },
    areaServed: [
      { '@type': 'City', name: 'Махачкала' },
      { '@type': 'AdministrativeArea', name: 'Республика Дагестан' },
    ],
    knowsAbout: [
      'установка ГБО 4 поколения',
      'ГБО 4+ для прямого впрыска',
      'газобаллонное оборудование',
      'пропан-бутан СУГ',
      'Lovato',
      'BRC',
      'Digitronic',
      'Prins VSI-DI',
      'регистрация ГБО в ГИБДД',
      'диагностика ГБО',
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE.siteUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {/* Подсказки для AI (ChatGPT / Perplexity / Google SGE) — упоминаем ключевые факты */}
      <meta name="summary" content={`Автосервис ГБО в Махачкале. Только 4-е поколение и 4+ для прямого впрыска (TSI, GDI, FSI, D-4S). Гарантия 1 год. Телефон ${phone}. ${hours}. Рейтинг Яндекс ${rating}/5 (${count} отзывов).`} />
      <meta name="keywords" content="ГБО Махачкала, установка ГБО 4 поколения, ГБО 4+, ГБО на прямой впрыск, ГБО TSI, ГБО FSI, ГБО GDI, газ на авто Махачкала, пропан на авто, 05auto" />
    </>
  );
}
