import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Fuel, ShieldCheck, Star, Wrench, AlertTriangle, TrendingDown, Award } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/PhoneIcon';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Calculator } from '@/components/sections/Calculator';
import { Reviews } from '@/components/sections/Reviews';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { SITE, getContactLinks } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Установка ГБО в Махачкале — окупится за 6 месяцев',
  description:
    'Поставим ГБО на ваш авто за 1 день. Сертифицированное оборудование Lovato, BRC, Prins, OMVL. Гарантия 1 год. 2500+ установок. Окупаемость от 6 месяцев.',
  alternates: { canonical: `${SITE.siteUrl}/install` },
};

export default function InstallPage() {
  const l = getContactLinks();
  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');

  return (
    <>
      {/* ============ HERO — БОЛЬ + ОБЕЩАНИЕ ============ */}
      <section className="relative pt-8 pb-12 md:pt-14 md:pb-20">
        <div
          aria-hidden
          className="absolute inset-0 -z-[1] pointer-events-none"
          style={{
            background:
              'radial-gradient(700px 500px at 80% -20%, rgba(232,18,36,0.18), transparent 60%)',
          }}
        />
        <div className="w-full mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E4F] pulse-ring" />
              Установка ГБО · Махачкала
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-display font-bold uppercase tracking-tight text-white text-[34px] sm:text-[44px] md:text-[60px] lg:text-[72px] leading-[1.05] mb-6 md:mb-8 max-w-[18ch]">
              Перестаньте дарить деньги{' '}
              <span
                className="inline-block pb-1"
                style={{
                  background: 'linear-gradient(135deg, #FF3E4F 0%, #FFCC00 120%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                АЗС
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="text-[16px] md:text-[19px] leading-relaxed text-white/80 max-w-[58ch] mb-8 md:mb-10">
              Каждый месяц вы оставляете на бензине <b className="text-white">12–18 тысяч ₽</b>.
              Через год это <b className="text-white">144–216 тысяч</b> — почти стоимость
              ремонта двигателя или новой летней резины. Газ обходится <b className="text-[#FF3E4F]">в 2 раза дешевле</b>,
              а установка окупается за <b className="text-white">5–8 месяцев</b>.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a href={`tel:${phoneDigits}`} className="btn btn-primary btn-lg">
                <PhoneIcon className="w-4 h-4" />
                Записаться — {SITE.phone}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href={l.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <WhatsAppIcon className="w-4 h-4" />
                Задать вопрос
              </a>
            </div>
          </Reveal>

          <Reveal delay={420}>
            <p className="text-[12px] text-white/50">
              <b className="text-white/70">⚡ Перезвоним за 15 минут.</b> Если вам сейчас неудобно —
              напишите в WhatsApp, ответим в течение часа.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ СОЦДОКАЗАТЕЛЬСТВО (числа) ============ */}
      <Section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Reveal>
            <Stat icon={Award}        value={2548} suffix="+"   label="Установок"  hint="за 8 лет работы" />
          </Reveal>
          <Reveal delay={120}>
            <Stat icon={Star}         value={49}   divisor={10} label="Рейтинг"   hint="на Яндекс.Картах" />
          </Reveal>
          <Reveal delay={240}>
            <Stat icon={ShieldCheck}  value={1}    suffix=" год" label="Гарантия"  hint="на работы и комплект" />
          </Reveal>
          <Reveal delay={360}>
            <Stat icon={Clock}        value={1}    suffix=" день" label="Срок работ" hint="приехали — уехали на газе" />
          </Reveal>
        </div>
      </Section>

      {/* ============ КОНТРАСТ: «было vs стало» ============ */}
      <Section>
        <SectionHeader
          eyebrow="Сравните"
          title="Бензин vs газ — на цифрах"
          lead="При среднем городском пробеге 2 000 км в месяц и расходе 10 л на 100 км."
        />
        <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
          <Reveal>
            <div
              className="card flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                <AlertTriangle className="w-4 h-4" />
                Сейчас, на бензине
              </div>
              <div className="font-display font-bold leading-none text-white/85" style={{ fontSize: 'clamp(36px, 6vw, 56px)', paddingBottom: '0.06em' }}>
                ≈ 12 000 ₽<span className="text-[16px] text-white/45 font-medium ml-1.5">/мес</span>
              </div>
              <ul className="flex flex-col gap-2 text-[14px] text-white/65">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                  144 000 ₽ в год — и это только за топливо
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                  Каждый раз думаете: «опять цена выросла»
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                  Заправка на 4–5 дней максимум
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div
              className="card flex flex-col gap-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(232,18,36,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                borderColor: 'rgba(232,18,36,0.3)',
              }}
            >
              <span
                className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: '#22C55E', color: 'black' }}
              >
                –50%
              </span>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF3E4F]">
                <TrendingDown className="w-4 h-4" />
                После установки ГБО
              </div>
              <div
                className="font-display font-bold leading-none"
                style={{
                  fontSize: 'clamp(36px, 6vw, 56px)',
                  paddingBottom: '0.06em',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FF3E4F 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                ≈ 5 400 ₽<span className="text-[16px] text-white/45 font-medium ml-1.5 -webkit-text-fill-white" style={{ WebkitTextFillColor: 'rgba(255,255,255,0.45)' }}>/мес</span>
              </div>
              <ul className="flex flex-col gap-2 text-[14px] text-white/85">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  Экономия 6 600 ₽ каждый месяц
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  79 200 ₽ в год — отдых, ремонт, шины
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  Установка окупится за <b className="text-white">5–8 месяцев</b>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="mt-6 text-center">
            <Link href="/calculator" className="btn btn-ghost btn-lg">
              Посчитать свою экономию
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* ============ КОМПЛЕКТЫ ============ */}
      <Reveal>
        <ServicesGrid />
      </Reveal>

      {/* ============ КАЛЬКУЛЯТОР ============ */}
      <Reveal>
        <Calculator />
      </Reveal>

      {/* ============ ВОЗРАЖЕНИЯ ============ */}
      <Section>
        <SectionHeader
          eyebrow="Развеем сомнения"
          title="«А вдруг…» — давайте разберём по полочкам"
          lead="Самые частые вопросы и страхи, которые останавливают перед установкой."
        />
        <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
          {[
            {
              q: 'А это вообще безопасно?',
              a: 'Безопаснее, чем бензин. Баллон выдерживает давление в 10 раз выше рабочего. Мультиклапан автоматически перекрывает подачу газа при ДТП. На статистике МЧС — газовое оборудование участвует в авариях реже бензиновой топливной системы.',
            },
            {
              q: 'А двигатель не убью?',
              a: 'Современный газ для авто — пропан-бутан с октановым числом 105. Это в среднем на 10–15 единиц выше АИ-95. Газ горит мягче и чище, поэтому ресурс двигателя НЕ снижается, а часто даже растёт. Главное — правильно настроить карты расхода.',
            },
            {
              q: 'А дорого ли это?',
              a: 'MPI-комплект на 4 цилиндра — от 38 000 ₽. Окупается за 5–8 месяцев. Если ездите 2 000+ км в месяц — уже на следующий год начинаете зарабатывать на ГБО. В рассрочку — суммы становятся вообще незаметными.',
            },
            {
              q: 'А мощность не упадёт?',
              a: 'На MPI-моторах разница в мощности 3–5%, на глаз не заметно. На прямом и комбинированном впрыске с Prins или OMVL — мощность сохраняется на 95–98%. Динамика та же, расход тот же — а топливо в 2 раза дешевле.',
            },
            {
              q: 'А если поломается?',
              a: 'Гарантия 1 год на наши работы + заводская гарантия на оборудование (Lovato — 2 года, BRC — 3 года, Prins — 2 года). Все ремонты по гарантии — бесплатно. Плановое ТО — 1 500–2 000 ₽ раз в год.',
            },
            {
              q: 'А с документами как?',
              a: 'Регистрацию в ГИБДД клиент оформляет самостоятельно — это его обязательство по закону. Мы выдадим все нужные документы (паспорт ГБО, декларация, чек). Многие клиенты езжают и без регистрации годами, но это уже на ваше усмотрение.',
            },
          ].map((it, i) => (
            <Reveal key={it.q} delay={Math.min(i * 80, 320)}>
              <div className="card flex flex-col gap-3 h-full">
                <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[15px] md:text-[17px] leading-tight">
                  {it.q}
                </h3>
                <p className="text-[14px] text-white/70 leading-relaxed text-break">{it.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ ЧТО ВКЛЮЧЕНО ============ */}
      <Section>
        <SectionHeader
          eyebrow="Что входит в цену"
          title="Никаких скрытых доплат"
          lead="Цена «под ключ» уже включает всё необходимое. Точная сумма — после диагностики двигателя."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: Wrench,      title: 'Сертифицированное оборудование', text: 'Lovato, BRC, Digitronic, KME, Prins, OMVL. Только оригинал, проверяем по серийнику.' },
            { icon: Fuel,        title: 'Установка и настройка',          text: 'Один рабочий день. Полная сборка, диагностика и калибровка карт расхода.' },
            { icon: ShieldCheck, title: 'Гарантия 1 год',                  text: 'На работы — официально, с договором. Оборудование — по заводской гарантии.' },
            { icon: Clock,       title: 'Бесплатный первый ТО',           text: 'Через 5 000 км — приходите, проверим систему и подкорректируем настройки.' },
            { icon: Star,        title: 'Документы',                       text: 'Паспорт ГБО, декларация производителя, чек — всё, что нужно для регистрации в ГИБДД.' },
            { icon: Award,       title: 'Поддержка по WhatsApp',           text: 'Что-то непонятно — пишите. Отвечаем 7 дней в неделю до 22:00.' },
          ].map((it, i) => (
            <Reveal key={it.title} delay={Math.min(i * 70, 300)}>
              <article className="card flex flex-col gap-4 h-full">
                <span
                  className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,18,36,0.22), rgba(232,18,36,0.05))',
                    border: '1px solid rgba(232,18,36,0.3)',
                  }}
                >
                  <it.icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
                </span>
                <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[16px] md:text-[18px] leading-tight">
                  {it.title}
                </h3>
                <p className="text-[14px] text-white/65 leading-relaxed text-break">{it.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ ОТЗЫВЫ ============ */}
      <Reveal>
        <Reviews />
      </Reveal>

      {/* ============ FAQ ============ */}
      <Reveal>
        <Faq />
      </Reveal>

      {/* ============ ФИНАЛЬНЫЙ CTA — СРОЧНОСТЬ + ГАРАНТИЯ ============ */}
      <Section>
        <Reveal>
          <div
            className="card-elev relative overflow-hidden text-center"
            style={{
              background:
                'radial-gradient(800px 400px at 50% 0%, rgba(232,18,36,0.18), rgba(20,20,26,0.95) 70%)',
              padding: '40px 24px',
            }}
          >
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none floaty"
              style={{ background: 'rgba(232,18,36,0.25)' }}
            />
            <div className="relative max-w-[42rem] mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] pulse-ring" />
                Запись открыта на ближайшие дни
              </div>
              <h2 className="font-display font-bold uppercase tracking-tight text-white text-[26px] md:text-[36px] lg:text-[42px] leading-tight mb-5">
                Ваш авто может ездить{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #FF3E4F 0%, #FFCC00 120%)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                }}>
                  в 2 раза дешевле
                </span>
                {' '}уже завтра
              </h2>
              <p className="text-[15px] md:text-[17px] leading-relaxed text-white/75 mb-8 max-w-[42ch] mx-auto">
                Один телефонный звонок — и через 24 часа вы перестаёте платить АЗС лишние деньги.
                Перезвоним за 15 минут, диагностику делаем в день обращения.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a href={`tel:${phoneDigits}`} className="btn btn-primary btn-lg">
                  <PhoneIcon className="w-5 h-5" />
                  Позвонить — {SITE.phone}
                </a>
                <a href={l.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                  <WhatsAppIcon className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-[12px] text-white/55">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                Перезванивать не обязательно — если передумаете, ничего не платите
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <Contact />
    </>
  );
}

function Stat({
  icon: Icon, value, suffix, divisor, label, hint,
}: {
  icon: typeof Award; value: number; suffix?: string; divisor?: number;
  label: string; hint: string;
}) {
  return (
    <div className="card text-center flex flex-col items-center gap-2">
      <span
        className="w-10 h-10 rounded-xl grid place-items-center"
        style={{
          background: 'linear-gradient(135deg, rgba(232,18,36,0.22), rgba(232,18,36,0.05))',
          border: '1px solid rgba(232,18,36,0.3)',
        }}
      >
        <Icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
      </span>
      <div className="font-display font-bold text-white text-[26px] md:text-[32px] leading-none mt-1">
        <Counter to={value} divisor={divisor} />
        {suffix && <span className="text-[16px] text-white/55 ml-1">{suffix}</span>}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">{label}</div>
      <div className="text-[12px] text-white/45">{hint}</div>
    </div>
  );
}
