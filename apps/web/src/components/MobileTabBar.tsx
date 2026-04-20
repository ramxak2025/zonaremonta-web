'use client';
import { getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, WhatsAppIcon, YandexMapsIcon } from './BrandIcons';

function haptic(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch {
      /* no-op */
    }
  }
}

export function MobileTabBar() {
  const l = getContactLinks();

  const ctas = [
    {
      label: 'Позвонить',
      href: l.phoneHref,
      icon: PhoneFilledIcon,
      bg: 'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)',
      fg: 'text-white',
    },
    {
      label: 'WhatsApp',
      href: l.whatsappHref,
      icon: WhatsAppIcon,
      bg: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
      fg: 'text-white',
      external: true,
    },
    {
      label: 'Как доехать',
      href: l.mapsHref,
      icon: YandexMapsIcon,
      bg: 'linear-gradient(180deg, #FFCC00 0%, #FF9500 100%)',
      fg: 'text-black',
      external: true,
    },
  ] as const;

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none pb-safe"
      aria-label="Быстрый контакт"
    >
      <div className="mx-3 pointer-events-auto">
        <nav
          className="grid grid-cols-3 gap-2 p-2 rounded-[24px]"
          style={{
            background: 'rgba(10, 10, 12, 0.85)',
            backdropFilter: 'blur(20px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
          }}
        >
          {ctas.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={'external' in c && c.external ? '_blank' : undefined}
              rel={'external' in c && c.external ? 'noopener noreferrer' : undefined}
              onClick={haptic}
              className={`h-12 rounded-[18px] flex items-center justify-center gap-2 font-semibold text-[13px] active:scale-95 transition-transform ${c.fg}`}
              style={{
                background: c.bg,
                boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset',
              }}
            >
              <c.icon className="w-4 h-4" />
              <span className="tracking-tight">{c.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
