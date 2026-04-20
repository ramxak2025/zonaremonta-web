import { MapPin, Phone, Clock } from 'lucide-react';
import { SITE } from '@/lib/site';

export function Contacts() {
  const mapQuery = encodeURIComponent(SITE.address);
  const yandexLink = `https://yandex.ru/maps/?text=${mapQuery}`;
  const yandexEmbed = `https://yandex.ru/map-widget/v1/?text=${mapQuery}&ll=${SITE.coordinates.lng}%2C${SITE.coordinates.lat}&z=15`;

  return (
    <section id="contacts" className="section py-24">
      <div className="mb-10">
        <span className="chip">Где нас найти</span>
        <h2 className="h-section mt-3">Контакты</h2>
      </div>
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        <ul className="lg:col-span-1 space-y-4">
          <li className="card">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-display mt-3 mb-1">Адрес</h3>
            <p className="text-ink-70 text-sm">{SITE.address}</p>
            <a href={yandexLink} target="_blank" rel="noopener" className="text-primary text-sm mt-2 inline-block">
              Открыть в Яндекс.Картах →
            </a>
          </li>
          <li className="card">
            <Phone className="w-5 h-5 text-primary" />
            <h3 className="font-display mt-3 mb-1">Телефон</h3>
            <a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`} className="text-ink-70 text-sm">{SITE.phone}</a>
          </li>
          <li className="card">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-display mt-3 mb-1">Режим работы</h3>
            <p className="text-ink-70 text-sm">{SITE.workingHours}</p>
          </li>
        </ul>

        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-ink-10 shadow-soft">
          <iframe
            src={yandexEmbed}
            title="Карта"
            width="100%"
            height="440"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AutoRepair',
            name: SITE.name,
            url: SITE.siteUrl,
            telephone: SITE.phone,
            address: {
              '@type': 'PostalAddress',
              streetAddress: SITE.address,
              addressLocality: 'Махачкала',
              addressCountry: 'RU',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: SITE.coordinates.lat,
              longitude: SITE.coordinates.lng,
            },
            openingHours: 'Mo-Sa 09:00-20:00',
          }),
        }}
      />
    </section>
  );
}
