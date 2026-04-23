import Link from 'next/link';
import { ArrowRight, Check, Flame } from 'lucide-react';

interface Brand {
  name: string;
  models: string;
  engine: string;
}

const BRANDS: readonly Brand[] = [
  { name: 'Haval', models: 'Jolion · H6 · Dargo · F7', engine: '1.5 / 2.0 TGDI' },
  { name: 'Chery', models: 'Tiggo 4 / 7 / 8 Pro', engine: '1.5 / 2.0 TCI' },
  { name: 'Geely', models: 'Coolray · Monjaro', engine: '1.5 / 2.0 TGDI' },
  { name: 'Omoda', models: 'C5 · S5 · S5 GT', engine: '1.5 TGDI' },
  { name: 'Exeed', models: 'LX · TX · VX', engine: '1.6 / 2.0 TGDI' },
  { name: 'Changan', models: 'CS35 · CS55 · UNI-K', engine: '1.4 / 2.0 T' },
];

export function ChineseCars() {
  return (
    <section className="section py-10 md:py-16">
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-10 lg:p-12"
        style={{
          background:
            'linear-gradient(135deg, rgba(232,18,36,0.18) 0%, rgba(96,80,220,0.1) 45%, rgba(74,159,217,0.14) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(232,18,36,0.22)' }}
        />

        <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-8 md:gap-10 items-center">
          <div className="flex flex-col gap-5">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] self-start"
              style={{
                background: 'rgba(232,18,36,0.2)',
                border: '1px solid rgba(232,18,36,0.4)',
                color: '#FF3E4F',
              }}
            >
              <Flame className="w-3.5 h-3.5" />
              Новое направление
            </span>

            <h2 className="h-1 text-white text-break">
              ГБО 4+ для <span className="text-gradient">китайских авто</span> с прямым впрыском
            </h2>

            <p className="lead">
              Современные китайские модели идут с турбомоторами TGDI. Обычное 4-е поколение
              не подходит — нужна специальная система 4+ с адаптивным впрыском.
            </p>

            <ul className="flex flex-col gap-2.5">
              {[
                'Защита бензиновых форсунок от закоксовывания',
                'Сохранение ресурса турбодвигателя',
                'Совместимость с прошивками TSI / TGDI / CGI',
                'Регистрация в ГИБДД без потери гарантии',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[14px] text-white/85">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                  <span className="text-break">{t}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/calculator" className="btn btn-primary btn-lg">
                Рассчитать для моей модели
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#services" className="btn btn-ghost btn-lg">
                Подробнее о ГБО 4+
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {BRANDS.map((b) => (
              <div
                key={b.name}
                className="p-4 md:p-5 rounded-lg bg-white/[0.05] border border-white/[0.08] flex flex-col gap-2 transition-transform hover:-translate-y-0.5"
              >
                <div className="font-display text-[20px] md:text-[22px] text-white leading-none">
                  {b.name}
                </div>
                <div className="text-[11px] text-white/55 clamp-1">{b.models}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF3E4F]">
                  {b.engine}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
