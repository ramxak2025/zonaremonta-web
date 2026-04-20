'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SITE, getContactLinks } from '@/lib/site';
import { HexIcon } from './HexIcon';
import { PhoneFilledIcon, WhatsAppIcon, MaxIcon, YandexMapsIcon } from './BrandIcons';

const ease = [0.22, 1, 0.36, 1] as const;

type CardSize = 'large' | 'medium';

interface Action {
  label: string;
  subLabel: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  size: CardSize;
  /** is external ссылка (откр. в новом tab) */
  external?: boolean;
  /** brand gradient */
  gradient: string;
  iconColor: string;
  shadow: string;
}

export function QuickContact({ heading = true }: { heading?: boolean }) {
  const l = getContactLinks();

  const actions: Action[] = [
    {
      label: 'Позвонить',
      subLabel: SITE.phone,
      href: l.phoneHref,
      icon: PhoneFilledIcon,
      size: 'large',
      gradient: 'linear-gradient(135deg, #FF3E4F 0%, #E81224 50%, #B40E1C 100%)',
      iconColor: 'text-white',
      shadow: '0 20px 40px -14px rgba(232,18,36,0.55), 0 0 0 1px rgba(232,18,36,0.4)',
    },
    {
      label: 'WhatsApp',
      subLabel: 'Написать мастеру',
      href: l.whatsappHref,
      icon: WhatsAppIcon,
      size: 'medium',
      external: true,
      gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
      iconColor: 'text-white',
      shadow: '0 20px 40px -14px rgba(37,211,102,0.45), 0 0 0 1px rgba(37,211,102,0.3)',
    },
    {
      label: 'Max',
      subLabel: 'Написать в MAX',
      href: l.maxHref,
      icon: MaxIcon,
      size: 'medium',
      external: true,
      gradient: 'linear-gradient(135deg, #5B9BD5 0%, #2B5F9E 100%)',
      iconColor: 'text-white',
      shadow: '0 20px 40px -14px rgba(91,155,213,0.45), 0 0 0 1px rgba(91,155,213,0.3)',
    },
    {
      label: 'Я.Карты',
      subLabel: 'Построить маршрут',
      href: l.mapsHref,
      icon: YandexMapsIcon,
      size: 'medium',
      external: true,
      gradient: 'linear-gradient(135deg, #FFCC00 0%, #FF9500 100%)',
      iconColor: 'text-black',
      shadow: '0 20px 40px -14px rgba(255,204,0,0.45), 0 0 0 1px rgba(255,204,0,0.3)',
    },
  ];

  return (
    <section id="contact" className="section py-12 sm:py-20 relative">
      {heading && (
        <div className="mb-6 sm:mb-10">
          <span className="chip">
            <span className="dot" />
            Свяжитесь с нами
          </span>
          <h2 className="h-section mt-3 text-white">Как вам удобнее?</h2>
          <p className="text-white/65 mt-3 max-w-xl leading-relaxed">
            Позвоните, напишите в мессенджер или приезжайте в сервис — мы всегда на связи.
          </p>
        </div>
      )}

      <div
        className="grid gap-3 sm:gap-4"
        style={{
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gridAutoRows: 'minmax(120px, auto)',
        }}
      >
        {actions.map((a, i) => {
          const span = a.size === 'large' ? 'col-span-6 sm:col-span-3' : 'col-span-3 sm:col-span-2';
          const rowSpan = a.size === 'large' ? 'row-span-1 sm:row-span-2' : '';
          const Icon = a.icon;
          return (
            <motion.a
              key={a.label}
              href={a.href}
              target={a.external ? '_blank' : undefined}
              rel={a.external ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`${span} ${rowSpan} relative overflow-hidden rounded-[28px] p-5 sm:p-6 flex flex-col justify-between group`}
              style={{ background: a.gradient, boxShadow: a.shadow }}
            >
              <HexIcon
                size={220}
                filled={false}
                className="absolute -right-10 -bottom-10 text-white/20 pointer-events-none"
              />
              {/* shine */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 30%)',
                }}
              />
              <div className="relative flex items-start justify-between">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl grid place-items-center bg-white/20 backdrop-blur-sm"
                  style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset' }}
                >
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${a.iconColor}`} />
                </div>
                <ArrowUpRight className={`w-5 h-5 ${a.iconColor} opacity-70 group-hover:rotate-12 group-hover:opacity-100 transition-all`} />
              </div>
              <div className="relative mt-6">
                <div
                  className={`font-display text-3xl sm:text-4xl tracking-tight ${a.iconColor}`}
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {a.label}
                </div>
                <div
                  className={`text-sm mt-1 ${a.iconColor} opacity-85`}
                >
                  {a.subLabel}
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>

      <p className="text-white/40 text-xs mt-6 text-center">
        {SITE.workingHours}
      </p>
    </section>
  );
}
