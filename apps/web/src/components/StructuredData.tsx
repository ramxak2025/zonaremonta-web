import type { PublicSettings } from '@05auto/shared';
import { SITE } from '@/lib/site';

interface Props {
  settings: Required<PublicSettings>;
}

/**
 * JSON-LD для Google + AI-поисковиков (ChatGPT Search, Perplexity, Google SGE).
 * AutoRepair + AggregateRating + OfferCatalog со всеми комплектами.
 */
export function StructuredData({ settings }: Props) {
  const phone = settings['site.phone'].value;
  const address = settings['site.address'].value;
  const hours = settings['site.workingHours'].value;
  const rating = settings['reviews.yandex.rating'].value;
  const count = settings['reviews.yandex.count'].value;
  const yandexUrl = settings['reviews.yandex.url'].value;

  const offer = (name: string, description: string, price: number) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name,
      description,
      areaServed: { '@type': 'City', name: 'Махачкала' },
    },
    price: String(price),
    priceCurrency: 'RUB',
    priceSpecification: {
      '@type': 'PriceSpecification',
      price,
      priceCurrency: 'RUB',
      minPrice: price,
    },
  });

  const business = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${SITE.siteUrl}/#business`,
    name: SITE.name,
    alternateName: '05auto',
    description:
      'Автосервис в Махачкале: установка ГБО на 4, 6, 8 цилиндров, на прямой и комбинированный впрыск (GDI, FSI, TSI, D-4S). Оборудование Lovato, BRC, Digitronic, Prins, OMVL. Ремонт, диагностика, регистрация в ГИБДД.',
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
      name: 'Установка ГБО',
      itemListElement: [
        offer(
          'ГБО на 4 цилиндра',
          'Распределённый впрыск (MPI). Комплект Lovato / BRC / Digitronic, регистрация в ГИБДД.',
          38000,
        ),
        offer(
          'ГБО на 6 цилиндров',
          'Для V6 и L6 моторов. Усиленный редуктор, 6 форсунок.',
          48000,
        ),
        offer(
          'ГБО на 8 цилиндров (V8)',
          'Для крупных внедорожников и пикапов. Два редуктора, 8 форсунок.',
          65000,
        ),
        offer(
          'ГБО на прямой впрыск (GDI/FSI/TSI)',
          'Оборудование Prins VSI-DI и OMVL DREAM для современных турбомоторов.',
          95000,
        ),
        offer(
          'ГБО на комбинированный впрыск (D-4S)',
          'Для двигателей с двойным впрыском: Toyota D-4S, Volvo VEA, Audi TFSI. Prins и OMVL.',
          110000,
        ),
      ],
    },
    areaServed: [
      { '@type': 'City', name: 'Махачкала' },
      { '@type': 'AdministrativeArea', name: 'Республика Дагестан' },
    ],
    knowsAbout: [
      'установка ГБО',
      'ГБО на 4 цилиндра',
      'ГБО на 6 цилиндров',
      'ГБО на V8',
      'ГБО на прямой впрыск',
      'ГБО на комбинированный впрыск',
      'Prins VSI-DI',
      'OMVL DREAM',
      'Lovato',
      'BRC',
      'Digitronic',
      'пропан-бутан СУГ',
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
      <meta
        name="summary"
        content={`Автосервис ГБО в Махачкале. Комплекты на 4/6/8 цилиндров, на прямой и комбинированный впрыск (Prins, OMVL). Гарантия 1 год. Телефон ${phone}. ${hours}. Рейтинг Яндекс ${rating}/5 (${count} отзывов).`}
      />
      <meta
        name="keywords"
        content="ГБО Махачкала, установка ГБО, ГБО на 4 цилиндра, ГБО на V8, ГБО на прямой впрыск, ГБО Prins, ГБО OMVL, ГБО GDI, ГБО TSI, ГБО D-4S, пропан на авто, 05auto"
      />
    </>
  );
}
