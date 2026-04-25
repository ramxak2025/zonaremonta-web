import { MapPin, Clock } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/PhoneIcon';
import { SITE, getContactLinks } from '@/lib/site';

export function Contact() {
  const l = getContactLinks();

  return (
    <Section id="contact">
      <SectionHeader
        eyebrow="Контакты"
        title="Перевести авто на газ — за один день"
        lead="Приехали утром — уехали на газе вечером. Покажем комплект под двигатель, посчитаем точную цену и экономию."
      />

      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        {/* Левая: контактные плашки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Channel
            href={l.phoneHref}
            label="Позвонить"
            value={SITE.phone}
            icon={<PhoneIcon className="w-5 h-5" />}
            background="linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)"
            color="white"
          />
          <Channel
            href={l.whatsappHref}
            label="WhatsApp"
            value="Написать мастеру"
            icon={<WhatsAppIcon className="w-5 h-5" />}
            background="linear-gradient(180deg, #25D366 0%, #128C7E 100%)"
            color="white"
            external
          />
          <Channel
            href={l.maxHref}
            label="Max"
            value="Мессенджер VK"
            icon={<MaxLogo />}
            background="linear-gradient(180deg, #5B9BD5 0%, #2B5F9E 100%)"
            color="white"
            external
          />
          <Channel
            href={l.mapsHref}
            label="Я.Карты"
            value="Маршрут"
            icon={<MapPin className="w-5 h-5" />}
            background="linear-gradient(180deg, #FFCC00 0%, #FF9500 100%)"
            color="#1C1C1E"
            external
          />
        </div>

        {/* Правая: адрес/часы */}
        <div className="card-elev flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <span
              className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
              style={{ background: 'rgba(255,204,0,0.15)', border: '1px solid rgba(255,204,0,0.25)' }}
            >
              <MapPin className="w-5 h-5 text-[#FFCC00]" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">Адрес</div>
              <div className="mt-1 text-[14px] md:text-[15px] font-semibold text-white text-break">
                {SITE.address}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span
              className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}
            >
              <Clock className="w-5 h-5 text-[#22C55E]" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">Часы работы</div>
              <div className="mt-1 text-[14px] md:text-[15px] font-semibold text-white">{SITE.workingHours}</div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 text-[12px] text-white/50 leading-relaxed text-break">
            Перезваниваем за 15 минут после заявки. По WhatsApp отвечаем в течение часа.
          </div>
        </div>
      </div>
    </Section>
  );
}

function Channel({
  href, label, value, icon, background, color, external,
}: {
  href: string; label: string; value: string;
  icon: React.ReactNode; background: string; color: string; external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="rounded-2xl p-5 flex flex-col justify-between min-h-[130px] transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
      style={{
        background, color,
        boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 14px 30px -14px rgba(0,0,0,0.4)',
      }}
    >
      <span className="opacity-90">{icon}</span>
      <div>
        <div className="font-display font-bold uppercase tracking-tight text-[18px] md:text-[20px]">
          {label}
        </div>
        <div className="text-[12px] opacity-80 mt-1 truncate">{value}</div>
      </div>
    </a>
  );
}

function MaxLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M3 5h3.4l3.6 6 3.6-6H17v14h-3v-9l-3 5h-2l-3-5v9H3V5z"/>
    </svg>
  );
}
