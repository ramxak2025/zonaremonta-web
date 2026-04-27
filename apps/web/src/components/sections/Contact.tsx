import { MapPin, Clock, MessageCircle, ArrowUpRight, Navigation } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/PhoneIcon';
import { SITE, getContactLinks } from '@/lib/site';

/**
 * Contact — современный UX/UI с встроенной Яндекс-картой.
 * Layout:
 *   [eyebrow + h2 + lead]
 *   [grid: левая колонка — 4 канала связи, правая — Я.Карта]
 *   [адрес, часы, маршрут — карточкой под картой]
 */
export function Contact() {
  const l = getContactLinks();
  const { lat, lng } = SITE.coordinates;

  // Yandex Maps widget — встроенная интерактивная карта со скином-меткой
  const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdl&l=map`;

  return (
    <section id="contact" className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mb-10 md:mb-12">
          <Reveal>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F] mb-3">
              Контакты
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display font-bold uppercase tracking-tight text-white text-[26px] sm:text-[30px] md:text-[36px] leading-tight mb-4 md:mb-5">
              Приезжайте — покажем, объясним, поставим
            </h2>
          </Reveal>
          <Reveal delay={220}>
            <p className="text-[15px] md:text-[17px] leading-relaxed text-white/70 max-w-[60ch]">
              Наш бокс в центре Махачкалы. Запись по звонку или WhatsApp. На диагностику —
              в день обращения, на установку — в течение суток.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-3 md:gap-4">
          {/* ───────── ЛЕВАЯ КОЛОНКА: каналы связи ───────── */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 content-start">
            <Reveal>
              <ContactCard
                href={l.phoneHref}
                icon={<PhoneIcon className="w-6 h-6" />}
                eyebrow="Перезвоним за 15 мин"
                label="Позвонить"
                value={SITE.phone}
                accent="primary"
              />
            </Reveal>
            <Reveal delay={120}>
              <ContactCard
                href={l.whatsappHref}
                external
                icon={<WhatsAppIcon className="w-6 h-6" />}
                eyebrow="Ответим за час"
                label="WhatsApp"
                value="Написать мастеру"
                accent="green"
              />
            </Reveal>
            <Reveal delay={240}>
              <ContactCard
                href={l.maxHref}
                external
                icon={<MessageCircle className="w-6 h-6" />}
                eyebrow="VK мессенджер"
                label="Max"
                value="Прямой чат"
                accent="blue"
              />
            </Reveal>
            <Reveal delay={360}>
              <ContactCard
                href={l.mapsHref}
                external
                icon={<Navigation className="w-6 h-6" />}
                eyebrow="Через Яндекс"
                label="Маршрут"
                value="Построить путь"
                accent="yellow"
              />
            </Reveal>

            {/* Адрес + часы — широкая плашка снизу */}
            <Reveal delay={480} className="col-span-2">
              <div
                className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
                style={{
                  background: 'rgba(20,20,26,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span
                    className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
                    style={{ background: 'rgba(255,204,0,0.12)', border: '1px solid rgba(255,204,0,0.25)' }}
                  >
                    <MapPin className="w-5 h-5 text-[#FFCC00]" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                      Адрес
                    </div>
                    <div className="mt-1 text-[14px] md:text-[15px] font-semibold text-white text-break">
                      {SITE.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span
                    className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
                  >
                    <Clock className="w-5 h-5 text-[#22C55E]" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                      Часы работы
                    </div>
                    <div className="mt-1 text-[14px] md:text-[15px] font-semibold text-white">
                      {SITE.workingHours}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ───────── ПРАВАЯ КОЛОНКА: интерактивная Я.Карта ───────── */}
          <Reveal delay={200} from="right">
            <div
              className="relative rounded-3xl overflow-hidden h-[360px] sm:h-[440px] lg:h-full lg:min-h-[460px]"
              style={{
                background: '#0E0E14',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 60px -20px rgba(0,0,0,0.6)',
              }}
            >
              <iframe
                src={mapSrc}
                title="Адрес сервиса на Яндекс.Картах"
                width="100%"
                height="100%"
                frameBorder={0}
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
                style={{
                  /* Чуть приглушаем светлую карту, чтобы она вписалась в тёмный сайт */
                  filter: 'saturate(0.85) brightness(0.92)',
                }}
              />

              {/* Floating-карточка поверх карты — название точки */}
              <div
                className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-[280px] rounded-2xl p-4 pointer-events-none"
                style={{
                  background: 'rgba(20,20,26,0.92)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(20px) saturate(1.5)',
                  WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 16px 40px -12px rgba(0,0,0,0.6)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #FF3E4F 0%, #B40E1C 100%)',
                      boxShadow: '0 6px 16px -4px rgba(232,18,36,0.5)',
                    }}
                  >
                    <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-display font-bold uppercase tracking-tight text-white text-[14px] leading-tight">
                      Зона Ремонта
                    </div>
                    <div className="text-[11px] text-white/60 mt-0.5 truncate">
                      Сервис ГБО
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопка «Открыть в Я.Картах» */}
              <a
                href={l.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 h-11 rounded-full text-[13px] font-semibold text-white"
                style={{
                  background: 'rgba(20,20,26,0.92)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(18px) saturate(1.5)',
                  WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset, 0 12px 28px -8px rgba(0,0,0,0.7)',
                }}
              >
                <Navigation className="w-4 h-4 text-[#FFCC00]" />
                Открыть в Я.Картах
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

const ACCENT_COLORS = {
  primary: { bg: 'rgba(232,18,36,0.15)',  border: 'rgba(232,18,36,0.35)',  fg: '#FF3E4F' },
  green:   { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.35)',  fg: '#22C55E' },
  blue:    { bg: 'rgba(74,159,217,0.15)', border: 'rgba(74,159,217,0.35)', fg: '#5BAFE6' },
  yellow:  { bg: 'rgba(255,204,0,0.15)',  border: 'rgba(255,204,0,0.35)',  fg: '#FFCC00' },
} as const;

function ContactCard({
  href, icon, eyebrow, label, value, accent, external,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  label: string;
  value: string;
  accent: keyof typeof ACCENT_COLORS;
  external?: boolean;
}) {
  const c = ACCENT_COLORS[accent];
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group relative rounded-2xl p-5 flex flex-col gap-4 min-h-[150px] md:min-h-[170px] overflow-hidden transition-transform hover:-translate-y-1 active:scale-[0.97]"
      style={{
        background: 'rgba(20,20,26,0.7)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 30px -12px rgba(0,0,0,0.5)',
      }}
    >
      {/* Декоративный glow */}
      <div
        aria-hidden
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-500"
        style={{ background: c.bg, filter: 'blur(28px)' }}
      />

      <div className="relative flex items-center justify-between">
        <span
          className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.fg }}
        >
          {icon}
        </span>
        <ArrowUpRight
          className="w-4 h-4 text-white/30 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>

      <div className="relative mt-auto">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
          {eyebrow}
        </div>
        <div className="font-display font-bold uppercase tracking-tight text-white text-[18px] md:text-[20px] mt-1 leading-tight">
          {label}
        </div>
        <div className="text-[12px] md:text-[13px] text-white/70 mt-1 truncate">
          {value}
        </div>
      </div>
    </a>
  );
}
