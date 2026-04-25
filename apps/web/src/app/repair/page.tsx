import type { Metadata } from 'next';
import { ArrowRight, AlertCircle, Activity, Wrench, ShieldCheck, ChevronRight, Gauge, Cpu, Fuel } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/PhoneIcon';
import { Contact } from '@/components/sections/Contact';
import { SITE, getContactLinks } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Диагностика и ремонт ГБО в Махачкале',
  description:
    'Диагностика ГБО на стенде, ремонт редукторов, форсунок, ЭБУ. Lovato, BRC, Prins, OMVL, Digitronic. Гарантия на работы. Махачкала.',
  alternates: { canonical: `${SITE.siteUrl}/repair` },
};

const SYMPTOMS = [
  { title: 'Двигатель не переключается на газ',  text: 'Не запускается на газе или глохнет через несколько секунд после переключения.' },
  { title: 'Расход вырос вдвое',                  text: 'Раньше хватало одного баллона на 200 км, теперь — на 100. Где-то «уходит» газ.' },
  { title: 'Появились провалы и дёргания',        text: 'Машина «троит», теряет тягу, особенно на 2–3 тысячах оборотов.' },
  { title: 'Запах газа в салоне или багажнике',   text: 'Срочный сигнал: разгерметизация магистрали. Не ждите — приезжайте сразу.' },
  { title: 'Мигают/горят ошибки CHECK ENGINE',    text: 'Бензиновый ЭБУ ругается из-за неверных показаний с лямбды или MAP.' },
  { title: 'Авто плохо набирает обороты',         text: 'На бензине разгон нормальный, на газе — «как с прицепом».' },
];

const SERVICES = [
  { icon: Activity, title: 'Компьютерная диагностика на стенде', priceFrom: 1500, time: '30 мин',
    text: 'Подключаемся к ЭБУ, читаем коды ошибок, проверяем карты расхода и параметры в реальном времени.' },
  { icon: Gauge,    title: 'Ремонт редуктора',                   priceFrom: 2500, time: '1–2 часа',
    text: 'Замена мембран, фильтров, клапанов. Восстановление герметичности. Любые модели — Lovato, BRC, Tomasetto, OMVL.' },
  { icon: Fuel,     title: 'Чистка / замена форсунок',           priceFrom: 1800, time: '1 час',
    text: 'Ультразвуковая чистка форсунок Hana, Valtek, Barracuda. Замена при выходе из строя.' },
  { icon: Cpu,      title: 'Прошивка / замена ЭБУ',              priceFrom: 3500, time: '1 час',
    text: 'Перепрошивка блоков управления Digitronic, Lovato Smart, Prins под актуальные карты расхода.' },
  { icon: Wrench,   title: 'Ремонт мультиклапана / ВЗУ',         priceFrom: 1200, time: '40 мин',
    text: 'Восстановление герметичности, замена соленоида, ремонт заправочного устройства.' },
  { icon: ShieldCheck, title: 'Подготовка к поверке баллона',    priceFrom: 1500, time: '1 час',
    text: 'Снятие баллона, диагностика арматуры, замена прокладок. Подготовка к плановому освидетельствованию.' },
];

export default function RepairPage() {
  const l = getContactLinks();
  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative pt-8 pb-12 md:pt-14 md:pb-20">
        <div
          aria-hidden
          className="absolute inset-0 -z-[1] pointer-events-none"
          style={{
            background:
              'radial-gradient(700px 500px at 20% -20%, rgba(74,159,217,0.15), transparent 60%)',
          }}
        />
        <div className="w-full mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 mb-6">
              <Activity className="w-3 h-3 text-[#FF3E4F]" />
              Диагностика и ремонт ГБО
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-display font-bold uppercase tracking-tight text-white text-[34px] sm:text-[44px] md:text-[60px] lg:text-[68px] leading-[1.05] mb-6 md:mb-8 max-w-[20ch]">
              Авто заглохло на газе?{' '}
              <span
                className="inline-block pb-1"
                style={{
                  background: 'linear-gradient(135deg, #FF3E4F 0%, #FFCC00 130%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Найдём причину за 30 минут
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="text-[16px] md:text-[19px] leading-relaxed text-white/80 max-w-[58ch] mb-8 md:mb-10">
              Восемь лет ремонтируем ГБО в Махачкале. Знаем все марки оборудования и
              типичные «болячки» каждой. Диагностируем на стенде, чиним по существу — без
              «давайте поменяем всё, на всякий случай».
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`tel:${phoneDigits}`} className="btn btn-primary btn-lg">
                <PhoneIcon className="w-4 h-4" />
                {SITE.phone}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href={l.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <WhatsAppIcon className="w-4 h-4" />
                Отправить фото / описать проблему
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ СИМПТОМЫ ============ */}
      <Section>
        <SectionHeader
          eyebrow="Когда пора к нам"
          title="Шесть признаков, что ГБО нужно проверить"
          lead="Не тяните — мелкая поломка через 2 недели превращается в дорогой ремонт. Хорошая новость: 80% случаев решаются за 1–2 часа."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {SYMPTOMS.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 70, 280)}>
              <article className="card flex gap-3 items-start h-full">
                <span
                  className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
                  style={{
                    background: 'rgba(255,204,0,0.12)',
                    border: '1px solid rgba(255,204,0,0.25)',
                  }}
                >
                  <AlertCircle className="w-5 h-5 text-[#FFCC00]" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[15px] md:text-[16px] leading-snug text-break">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-white/65 leading-relaxed text-break">{s.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ ЧТО МЫ ДЕЛАЕМ ============ */}
      <Section>
        <SectionHeader
          eyebrow="Услуги"
          title="Что чиним и сколько это стоит"
          lead="Цены ориентировочные. Точно скажем после диагностики — без сюрпризов в чеке."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 70, 280)}>
              <article className="card flex flex-col gap-4 h-full">
                <span
                  className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,18,36,0.22), rgba(232,18,36,0.05))',
                    border: '1px solid rgba(232,18,36,0.3)',
                  }}
                >
                  <s.icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
                </span>
                <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[16px] md:text-[18px] leading-tight">
                  {s.title}
                </h3>
                <p className="text-[13px] text-white/65 leading-relaxed text-break flex-1">{s.text}</p>
                <div className="pt-3 border-t border-white/5 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">от</div>
                    <div className="font-display font-bold text-white text-[20px] md:text-[24px] mt-1 leading-none">
                      {s.priceFrom.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                  <span className="text-[11px] text-white/45">~ {s.time}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ КАК ПРОХОДИТ ВИЗИТ ============ */}
      <Section>
        <SectionHeader
          eyebrow="Как проходит визит"
          title="От заезда до результата — обычно 1–2 часа"
        />
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { n: '01', title: 'Опрос',         text: 'Расскажите, в чём проблема — звуки, симптомы, когда началось. По описанию уже половина диагноза.' },
            { n: '02', title: 'Стендовая диагностика', text: 'Подключаемся к ЭБУ, замеряем давление, проверяем форсунки и герметичность. 30 минут.' },
            { n: '03', title: 'Отчёт и смета', text: 'Озвучиваем точную причину и точную стоимость. Ничего не делаем без вашего «да».' },
            { n: '04', title: 'Ремонт',        text: 'Чиним и тестируем на стенде. Выдаём рекомендации по ТО, чтобы не повторилось.' },
          ].map((s, i) => (
            <Reveal key={s.n} delay={Math.min(i * 90, 300)}>
              <li className="card flex flex-col gap-3 h-full">
                <span
                  className="font-display font-bold leading-none"
                  style={{
                    fontSize: '36px',
                    paddingBottom: '0.06em',
                    background: 'linear-gradient(135deg, #FF3E4F, rgba(232,18,36,0.3))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {s.n}
                </span>
                <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[16px] leading-tight">
                  {s.title}
                </h3>
                <p className="text-[13px] text-white/65 leading-relaxed text-break">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ============ С КАКИМИ МАРКАМИ РАБОТАЕМ ============ */}
      <Section>
        <Reveal>
          <div className="card-elev flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 mb-2">
                Чиним оборудование
              </div>
              <div className="font-display font-semibold uppercase tracking-tight text-white text-[18px] md:text-[22px] leading-tight">
                Lovato · BRC · Tomasetto · OMVL · Prins · Digitronic · KME · Atiker · Stako
              </div>
              <p className="mt-3 text-[13px] text-white/65 leading-relaxed text-break">
                Если у вас ГБО другого бренда — позвоните, скорее всего тоже починим. Не работаем
                только с ГБО 2-го поколения (карбюратор) — это уже невыгодно даже если получится.
              </p>
            </div>
            <a href={`tel:${phoneDigits}`} className="btn btn-primary btn-lg flex-shrink-0">
              Записаться <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </Section>

      {/* ============ ФИНАЛЬНЫЙ CTA ============ */}
      <Section>
        <Reveal>
          <div
            className="card-elev relative overflow-hidden text-center"
            style={{
              background: 'radial-gradient(800px 400px at 50% 0%, rgba(74,159,217,0.18), rgba(20,20,26,0.95) 70%)',
              padding: '40px 24px',
            }}
          >
            <div className="relative max-w-[42rem] mx-auto">
              <h2 className="font-display font-bold uppercase tracking-tight text-white text-[24px] md:text-[34px] leading-tight mb-4">
                Не тяните, пока не стало хуже
              </h2>
              <p className="text-[15px] md:text-[17px] leading-relaxed text-white/75 mb-7 max-w-[42ch] mx-auto">
                Запишем сегодня — посмотрим завтра. Если просто проконсультироваться —
                напишите в WhatsApp с описанием проблемы и фото. Ответим в течение часа.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${phoneDigits}`} className="btn btn-primary btn-lg">
                  <PhoneIcon className="w-5 h-5" />
                  {SITE.phone}
                </a>
                <a href={l.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                  <WhatsAppIcon className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <Contact />
    </>
  );
}
