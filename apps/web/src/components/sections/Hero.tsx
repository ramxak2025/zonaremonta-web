import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ShieldCheck, Wrench, Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

export function Hero() {
  return (
    <section className="relative pt-6 pb-12 md:pt-10 md:pb-16 lg:pb-24 overflow-hidden">
      {/* Декоративная подсветка */}
      <div
        aria-hidden
        className="absolute inset-0 -z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(900px 600px at 80% 20%, rgba(232,18,36,0.18), transparent 60%)',
        }}
      />

      <Container>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Левый блок: текст + CTA */}
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 mb-6 md:mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E4F] pulse-ring" />
                Сертифицированный сервис ГБО · Махачкала
              </div>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="font-display font-bold uppercase tracking-tight text-white text-[34px] sm:text-[44px] md:text-[56px] lg:text-[64px] leading-[1.05] mb-6 md:mb-8">
                Заправляйтесь
                <br />
                <span
                  className="inline-block pb-1"
                  style={{
                    background: 'linear-gradient(135deg, #FF3E4F 0%, #E81224 60%, #FFCC00 140%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  в 2 раза дешевле
                </span>
                <br />
                уже завтра
              </h1>
            </Reveal>

            <Reveal delay={220}>
              <p className="text-[15px] md:text-[18px] leading-relaxed text-white/75 max-w-[58ch] mb-8 md:mb-10">
                Установим за один рабочий день. Сертифицированное оборудование Lovato, BRC, Prins, OMVL.
                Гарантия 1 год на работы. Уже стоит ГБО — починим и настроим.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Link href="/install" className="btn btn-primary btn-lg">
                  Установить ГБО
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/works" className="btn btn-ghost btn-lg">
                  Наши работы
                </Link>
              </div>
            </Reveal>

            {/* Quick trust */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <Reveal delay={420}>
                <Trust icon={Star} title="4.9 на Яндексе" sub="200+ отзывов" />
              </Reveal>
              <Reveal delay={520}>
                <Trust icon={ShieldCheck} title="Гарантия 1 год" sub="на работы и комплект" />
              </Reveal>
              <Reveal delay={620}>
                <Trust icon={Wrench} title="Один рабочий день" sub="приехали — уехали на газе" />
              </Reveal>
            </div>
          </div>

          {/* Правый блок: фото мастера */}
          <Reveal delay={200} from="right">
            <div className="relative w-full">
              <div
                className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-3xl overflow-hidden"
                style={{
                  background: '#0E0E14',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.06) inset, 0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
                }}
              >
                <Image
                  src="/hero-master.jpg"
                  alt="Мастер Зоны Ремонта с редуктором ГБО Lovato в боксе сервиса"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center"
                  quality={85}
                />

                {/* Градиентный fade снизу для контраста с подписью */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 55%, rgba(10,10,16,0.85) 100%)',
                  }}
                />

                {/* Floating шильдик */}
                <div
                  className="floaty absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-white"
                  style={{
                    background: 'rgba(232,18,36,0.92)',
                    boxShadow: '0 8px 24px -6px rgba(232,18,36,0.5)',
                  }}
                >
                  Lovato · оригинал
                </div>

                {/* Подпись внизу */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55 mb-1.5">
                    Бокс «Зоны Ремонта»
                  </div>
                  <div className="font-display font-semibold text-white text-[16px] md:text-[18px] leading-tight">
                    Восемь лет одна команда. Установка ГБО — наша единственная специальность.
                  </div>
                </div>
              </div>

              {/* Декоративная подсветка под фото */}
              <div
                aria-hidden
                className="absolute -inset-x-6 -bottom-6 h-12 -z-10 blur-2xl opacity-60 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(60% 100% at 50% 0%, rgba(232,18,36,0.6), transparent)',
                }}
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Trust({ icon: Icon, title, sub }: { icon: typeof Star; title: string; sub: string }) {
  return (
    <div className="card flex items-center gap-3">
      <span
        className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(232,18,36,0.22), rgba(232,18,36,0.05))',
          border: '1px solid rgba(232,18,36,0.3)',
        }}
      >
        <Icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
      </span>
      <div className="min-w-0">
        <div className="text-[14px] font-semibold text-white">{title}</div>
        <div className="text-[12px] text-white/55 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
