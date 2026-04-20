'use client';
import { motion } from 'framer-motion';
import { SITE, getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, WhatsAppIcon, MaxIcon, YandexMapsIcon } from './BrandIcons';

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(10); } catch {}
  }
}

interface CTA {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
  ring: string;
  external?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileTabBar() {
  const l = getContactLinks();

  const ctas: CTA[] = [
    {
      label: 'Звонок',
      href: l.phoneHref,
      icon: PhoneFilledIcon,
      bg: 'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)',
      color: 'text-white',
      ring: 'rgba(232,18,36,0.55)',
    },
    {
      label: 'WhatsApp',
      href: l.whatsappHref,
      icon: WhatsAppIcon,
      bg: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
      color: 'text-white',
      ring: 'rgba(37,211,102,0.55)',
      external: true,
    },
    {
      label: 'Max',
      href: l.maxHref,
      icon: MaxIcon,
      bg: 'linear-gradient(180deg, #5B9BD5 0%, #2B5F9E 100%)',
      color: 'text-white',
      ring: 'rgba(91,155,213,0.55)',
      external: true,
    },
    {
      label: 'Карта',
      href: l.mapsHref,
      icon: YandexMapsIcon,
      bg: 'linear-gradient(180deg, #FFCC00 0%, #FF9500 100%)',
      color: 'text-black',
      ring: 'rgba(255,204,0,0.55)',
      external: true,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-safe">
      <div className="mx-2.5 pointer-events-auto">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 230, delay: 0.2 }}
          className="liquid-glass-strong liquid-glass grid grid-cols-4 gap-1.5 p-1.5"
          style={{ borderRadius: 28 }}
          aria-label="Быстрые действия"
        >
          {ctas.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                onClick={haptic}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', damping: 14, stiffness: 320 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: c.bg,
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.25) inset, 0 8px 18px -6px ' +
                    c.ring +
                    ', 0 0 0 1px ' +
                    c.ring,
                  animationDelay: `${i * 50}ms`,
                }}
                className="relative flex flex-col items-center justify-center gap-1 h-14 rounded-[22px] overflow-hidden"
              >
                {/* glass highlight наверху */}
                <span
                  aria-hidden
                  className="absolute inset-x-1 top-1 h-3 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.35), transparent)',
                  }}
                />
                <Icon className={`w-[22px] h-[22px] ${c.color} relative`} />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider relative ${c.color}`}
                  style={{ letterSpacing: '0.05em' }}
                >
                  {c.label}
                </span>
              </motion.a>
            );
          })}
        </motion.nav>
      </div>
    </div>
  );
}
