import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { HexIcon } from './HexIcon';

export function Contacts() {
  const mapQuery = encodeURIComponent(SITE.address);
  const yandexLink = `https://yandex.ru/maps/?text=${mapQuery}`;
  const yandexEmbed = `https://yandex.ru/map-widget/v1/?text=${mapQuery}&ll=${SITE.coordinates.lng}%2C${SITE.coordinates.lat}&z=15`;
  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');

  return (
    <section id="contacts" className="section py-16 sm:py-24 relative">
      <div className="mb-8 sm:mb-12">
        <span className="chip">
          <span className="dot" />
          Где нас найти
        </span>
        <h2 className="h-section mt-3 text-white">Контакты</h2>
      </div>

      <div
        className="grid gap-3 sm:gap-4"
        style={{
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gridAutoRows: 'minmax(120px, auto)',
        }}
      >
        {/* Карта — big */}
        <div className="col-span-6 lg:col-span-4 row-span-3 liquid-glass p-0 overflow-hidden relative min-h-[360px]">
          <iframe
            src={yandexEmbed}
            title="Карта"
            className="w-full h-full absolute inset-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Адрес */}
        <a
          href={yandexLink}
          target="_blank"
          rel="noopener"
          className="col-span-3 lg:col-span-2 liquid-glass relative overflow-hidden p-6 group hover:-translate-y-1 transition-transform"
        >
          <HexIcon size={160} filled={false} className="absolute -right-6 -bottom-6 text-white/[0.04]" />
          <div className="flex items-start justify-between relative">
            <span className="w-11 h-11 rounded-2xl grid place-items-center bg-primary/20 border border-primary/30">
              <MapPin className="w-5 h-5 text-primary" strokeWidth={2.4} />
            </span>
            <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:rotate-12 transition-all" />
          </div>
          <h3 className="font-display text-lg mt-4 text-white">Адрес</h3>
          <p className="text-white/60 text-sm mt-1">{SITE.address}</p>
        </a>

        {/* Телефон */}
        <a
          href={`tel:${phoneDigits}`}
          className="col-span-3 lg:col-span-2 liquid-glass relative overflow-hidden p-6 group hover:-translate-y-1 transition-transform"
        >
          <HexIcon size={160} filled={false} className="absolute -right-6 -bottom-6 text-white/[0.04]" />
          <div className="flex items-start justify-between relative">
            <span className="w-11 h-11 rounded-2xl grid place-items-center bg-primary/20 border border-primary/30">
              <Phone className="w-5 h-5 text-primary" strokeWidth={2.4} />
            </span>
            <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:rotate-12 transition-all" />
          </div>
          <h3 className="font-display text-lg mt-4 text-white">Позвонить</h3>
          <p className="text-white text-lg font-display mt-1">{SITE.phone}</p>
        </a>

        {/* График */}
        <div className="col-span-6 lg:col-span-2 liquid-glass relative overflow-hidden p-6">
          <HexIcon size={160} filled={false} className="absolute -right-6 -bottom-6 text-white/[0.04]" />
          <span className="w-11 h-11 rounded-2xl grid place-items-center bg-secondary/20 border border-secondary/30">
            <Clock className="w-5 h-5 text-secondary" strokeWidth={2.4} />
          </span>
          <h3 className="font-display text-lg mt-4 text-white">Режим работы</h3>
          <p className="text-white/60 text-sm mt-1">{SITE.workingHours}</p>
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
