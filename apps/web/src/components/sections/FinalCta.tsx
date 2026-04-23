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
    { label: 'Позвонить', value: phone, href: l.phoneHref, icon: PhoneFilledIcon, brand: 'primary' as const },
    { label: 'WhatsApp', value: 'Написать мастеру', href: l.whatsappHref, icon: WhatsAppIcon, brand: 'whatsapp' as const },
    { label: 'Max', value: 'Мессенджер VK', href: l.maxHref, icon: MaxIcon, brand: 'max' as const },
    { label: 'Я.Карты', value: 'Построить маршрут', href: l.mapsHref, icon: YandexMapsIcon, brand: 'maps' as const },
  ] as const;

  const bg: Record<(typeof channels)[number]['brand'], React.CSSProperties> = {
    primary: { background: 'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)', color: 'white' },
    whatsapp: { background: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)', color: 'white' },
    max: { background: 'linear-gradient(180deg, #5B9BD5 0%, #2B5F9E 100%)', color: 'white' },
    maps: { background: 'linear-gradient(180deg, #FFCC00 0%, #FF9500 100%)', color: '#1C1C1E' },
  };

  return (
    <section id="contact" className="section section-y">
      <div className="card p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(600px 400px at 8% 8%, rgba(232,18,36,0.15), transparent 60%)',
          }}
        />

        <div className="relative grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="flex flex-col gap-4 md:gap-5">
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
                за один рабочий день
              </span>
            </h2>
            <p className="lead">
              Приехали утром — уехали на газе вечером. Покажем комплект под двигатель,
              посчитаем точную цену и экономию.
            </p>
            <div className="flex flex-col gap-1.5 text-[14px] text-white/70 pt-2">
              <div className="text-break">
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
                className="relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between min-h-[120px] md:min-h-[140px] gap-4 transition-transform hover:-translate-y-1 active:scale-[0.97]"
                style={{
                  ...bg[c.brand],
                  boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 14px 40px -14px rgba(0,0,0,0.4)',
                }}
              >
                <c.icon className="w-6 h-6 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-display text-[20px] md:text-[22px] leading-tight">{c.label}</div>
                  <div className="text-[12px] opacity-80 mt-1 clamp-1">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only">
        {SITE.name} — автосервис в Махачкале. Устанавливаем ГБО на 4, 6 и 8 цилиндров,
        на прямой и комбинированный впрыск (GDI, FSI, TSI, D-4S). Prins и OMVL.
      </p>
    </section>
  );
}
