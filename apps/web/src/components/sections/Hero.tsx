import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ShieldCheck, Wrench, Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

export function Hero() {
  return (
    <section
      className="relative isolate -mt-[68px] md:-mt-[80px]"
    >
      {/* ───────── ФОНОВОЕ ФОТО ───────── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/hero-master.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={88}
          className="object-cover object-[72%_center] md:object-[75%_center]"
        />

        {/* DESKTOP overlay — горизонтальный градиент. Текст слева на тёмной зоне. */}
        <div
          aria-hidden
          className="hidden md:block absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,10,16,0.96) 0%, rgba(10,10,16,0.86) 30%, rgba(10,10,16,0.5) 55%, rgba(10,10,16,0.15) 80%, transparent 100%)',
          }}
        />

        {/* MOBILE overlay — вертикальный. Сверху лёгкое затемнение для шапки,
            фото в центре чистое, снизу плотный фон под текст и плавный fade. */}
        <div
          aria-hidden
          className="md:hidden absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,16,0.55) 0%, rgba(10,10,16,0.05) 28%, rgba(10,10,16,0.05) 45%, rgba(10,10,16,0.85) 75%, #0A0A10 100%)',
          }}
        />

        {/* Финальный fade в фон страницы — никаких видимых стыков снизу */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 md:h-40"
          style={{
            background: 'linear-gradient(180deg, transparent, #0A0A10)',
          }}
        />

        {/* Красный акцент-блик слева на десктопе */}
        <div
          aria-hidden
          className="hidden md:block absolute -left-20 top-1/3 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,18,36,0.25), transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* ───────── КОНТЕНТ ───────── */}
      <div className="relative z-10">
        <Container>
          <div className="pt-[110px] pb-12 md:pt-[140px] md:pb-20 lg:pt-[160px] lg:pb-24">
            <div className="max-w-[42rem]">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md mb-5 md:mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E4F] pulse-ring" />
                  Сертифицированный сервис ГБО · Махачкала
                </div>
              </Reveal>

              <Reveal delay={120}>
                <h1
                  className="font-display font-bold uppercase tracking-tight text-white text-[34px] sm:text-[44px] md:text-[56px] lg:text-[68px] leading-[1.04] mb-5 md:mb-7"
                  style={{ textShadow: '0 4px 32px rgba(0,0,0,0.55)' }}
                >
                  Заправляйтесь
                  <br />
                  <span
                    className="inline-block pb-1"
                    style={{
                      background: 'linear-gradient(135deg, #FF3E4F 0%, #E81224 50%, #FFCC00 130%)',
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
                <p
                  className="text-[14px] md:text-[18px] leading-relaxed text-white/85 max-w-[52ch] mb-7 md:mb-9"
                  style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
                >
                  Установим за один рабочий день. Сертифицированное оборудование Lovato, BRC,
                  Prins, OMVL. Гарантия 1 год на работы. Уже стоит ГБО — починим и настроим.
                </p>
              </Reveal>

              <Reveal delay={320}>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/install" className="btn btn-primary btn-lg">
                    Установить ГБО
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/works"
                    className="btn btn-lg text-white"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    Наши работы
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </div>

      {/* ───────── TRUST-ПЛАШКИ ВНИЗУ (поверх Hero, наезжают на след. секцию) ───────── */}
      <div className="relative z-10">
        <Container>
          <div className="-mt-2 md:-mt-12 lg:-mt-16 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
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
        </Container>
      </div>
    </section>
  );
}

function Trust({ icon: Icon, title, sub }: { icon: typeof Star; title: string; sub: string }) {
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-2xl"
      style={{
        background: 'rgba(20, 20, 26, 0.7)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 40px -16px rgba(0,0,0,0.7)',
      }}
    >
      <span
        className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(232,18,36,0.3), rgba(232,18,36,0.08))',
          border: '1px solid rgba(232,18,36,0.4)',
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
