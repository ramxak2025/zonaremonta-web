import type { PublicSettings } from '@05auto/shared';
import { SITE, getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, WhatsAppIcon, MaxIcon, YandexMapsIcon } from '../BrandIcons';

interface Props {
  settings: Required<PublicSettings>;
}

export function FinalCta({ settings }: Props) {
  const l = getContactLinks();
  const phone = settings['site.phone'].value;
  const address = settings['site.address'].value;
  const hours = settings['site.workingHours'].value;

  const channels = [
    {
      label: 'Позвонить',
      value: phone,
      href: l.phoneHref,
      icon: PhoneFilledIcon,
      brand: 'primary' as const,
    },
    {
      label: 'WhatsApp',
      value: 'Написать мастеру',
      href: l.whatsappHref,
      icon: WhatsAppIcon,
      brand: 'whatsapp' as const,
    },
    {
      label: 'Max',
      value: 'Мессенджер VK',
      href: l.maxHref,
      icon: MaxIcon,
      brand: 'max' as const,
    },
    {
      label: 'Я.Карты',
      value: 'Построить маршрут',
      href: l.mapsHref,
      icon: YandexMapsIcon,
      brand: 'maps' as const,
    },
  ] as const;

  const style = (b: (typeof channels)[number]['brand']): React.CSSProperties => {
    switch (b) {
      case 'primary':
        return {
          background: 'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)',
          color: 'white',
        };
      case 'whatsapp':
        return {
          background: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
          color: 'white',
        };
      case 'max':
        return {
          background: 'linear-gradient(180deg, #5B9BD5 0%, #2B5F9E 100%)',
          color: 'white',
        };
      case 'maps':
        return {
          background: 'linear-gradient(180deg, #FFCC00 0%, #FF9500 100%)',
          color: '#1C1C1E',
        };
    }
  };

  return (
    <section id="contact" className="section section-y">
      <div className="card p-7 md:p-12 lg:p-14 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(700px 500px at 8% 8%, rgba(232,18,36,0.18), transparent 60%)',
          }}
        />

        <div className="relative grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="stack-5">
            <span className="eyebrow">Готовы начать</span>
            <h2 className="h-1 text-white">
              Перевести авто на газ —<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF3E4F, #FFCC00)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                начните с бесплатной диагностики
              </span>
            </h2>
            <p className="lead">
              Приедете утром — уедете на газе вечером. Покажем комплект под двигатель,
              посчитаем точную цену и экономию. Консультация бесплатная.
            </p>
            <div className="space-y-1.5 text-[14px] text-white/70 pt-2">
              <div>
                <span className="text-white/45">Адрес: </span>
                <span className="text-white">{address}</span>
              </div>
              <div>
                <span className="text-white/45">Часы работы: </span>
                <span className="text-white">{hours}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="relative overflow-hidden rounded-[24px] p-5 md:p-6 flex flex-col justify-between min-h-[136px] md:min-h-[156px] transition-transform hover:-translate-y-1 active:scale-[0.97]"
                style={{
                  ...style(c.brand),
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.2) inset, 0 14px 40px -14px rgba(0,0,0,0.4)',
                }}
              >
                <c.icon className="w-7 h-7" />
                <div>
                  <div className="font-display text-[22px] md:text-[26px] leading-tight">
                    {c.label}
                  </div>
                  <div className="text-[12px] opacity-80 mt-1 truncate">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only">
        {SITE.name} — автосервис в Махачкале, специализируется на установке ГБО 4-го поколения и
        4+ для прямого впрыска (GDI, FSI, TSI, D-4S, SkyActiv).
      </p>
    </section>
  );
}
