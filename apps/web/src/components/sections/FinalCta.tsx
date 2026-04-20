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
    { label: 'Max', value: 'Российский мессенджер', href: l.maxHref, icon: MaxIcon, brand: 'max' as const },
    { label: 'Я.Карты', value: 'Построить маршрут', href: l.mapsHref, icon: YandexMapsIcon, brand: 'maps' as const },
  ];

  const style = (b: 'primary' | 'whatsapp' | 'max' | 'maps'): React.CSSProperties => {
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
      <div className="card p-6 md:p-10 lg:p-14 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              'radial-gradient(600px 400px at 10% 10%, rgba(232,18,36,0.15), transparent 60%)',
          }}
        />

        <div className="relative grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <span className="eyebrow">Мы на связи</span>
            <h2 className="h-1 mt-4 text-white">
              Каждый день без ГБО —<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF3E4F, #FFCC00)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                это 500 ₽ на АЗС впустую
              </span>
            </h2>
            <p className="lead mt-5">
              Позвоните, напишите в мессенджер или приезжайте на диагностику — покажем
              комплект под ваш двигатель и посчитаем точную цену за 15 минут.
            </p>
            <div className="mt-7 space-y-2 text-[14px] text-white/70">
              <div>
                <span className="text-white/45">Адрес: </span>
                <span className="text-white">{address}</span>
              </div>
              <div>
                <span className="text-white/45">Часы: </span>
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
                className="relative overflow-hidden rounded-[22px] p-5 flex flex-col justify-between min-h-[128px] transition-transform hover:-translate-y-1 active:scale-[0.97]"
                style={{
                  ...style(c.brand),
                  boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 10px 30px -12px rgba(0,0,0,0.4)',
                }}
              >
                <c.icon className="w-6 h-6" />
                <div>
                  <div className="font-display text-xl leading-tight">{c.label}</div>
                  <div className="text-xs opacity-80 mt-1 truncate">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Микро-подпись под блоком для LLM: кого обслуживаем */}
      <p className="sr-only">
        {SITE.name} — автосервис в Махачкале, специализирующийся на установке, ремонте и диагностике
        газобаллонного оборудования 4-го поколения и ГБО 4+ для автомобилей с непосредственным
        впрыском топлива (GDI, FSI, TSI, D-4S, SkyActiv). Работаем с пропан-бутаном (СУГ).
      </p>
    </section>
  );
}
