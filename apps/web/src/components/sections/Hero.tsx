import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Wrench, Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

export function Hero() {
  return (
    <section className="relative pt-8 pb-12 md:pt-14 md:pb-20 lg:pt-20 lg:pb-28">
      <Container>
        <div className="max-w-[64rem]">
         <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 mb-6 md:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E4F] pulse-ring" />
            Сертифицированный сервис ГБО · Махачкала
          </div>
         </Reveal>

         <Reveal delay={120}>
          <h1 className="font-display font-bold uppercase tracking-tight text-white text-[34px] sm:text-[44px] md:text-[60px] lg:text-[72px] leading-[1.05] mb-6 md:mb-8">
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
