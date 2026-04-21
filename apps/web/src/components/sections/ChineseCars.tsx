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
] as const;

export function ChineseCars() {
  return (
    <section className="section py-12 md:py-20">
      <div
        className="relative overflow-hidden rounded-[32px] p-7 md:p-14"
        style={{
          background:
            'linear-gradient(135deg, rgba(232,18,36,0.22) 0%, rgba(96,80,220,0.12) 45%, rgba(74,159,217,0.18) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 30px 70px -30px rgba(0,0,0,0.45)',
        }}
      >
        <div
          aria-hidden
          className="absolute -top-36 -right-36 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(232,18,36,0.3)' }}
        />

        <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center">
          <div className="stack-5">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] self-start"
              style={{
                background: 'rgba(232,18,36,0.2)',
                border: '1px solid rgba(232,18,36,0.4)',
                color: '#FF3E4F',
                width: 'fit-content',
              }}
            >
              <Flame className="w-3.5 h-3.5" />
              Новое направление
            </span>

            <h2 className="h-1 text-white">
              ГБО 4+ для{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF3E4F, #4A9FD9)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                китайских авто
              </span>{' '}
              с прямым впрыском
            </h2>

            <p className="lead">
              Современные китайские модели идут с турбомоторами TGDI. Обычное 4-е поколение
              не подходит — нужна специальная система 4+ с адаптивным впрыском. Ставим именно её.
            </p>

            <ul className="stack-3 mt-2">
              {[
                'Защита бензиновых форсунок от закоксовывания',
                'Сохранение ресурса турбодвигателя',
                'Совместимость с прошивками TSI / TGDI / CGI',
                'Регистрация в ГИБДД без потери гарантии',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[14px] text-white/85">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-none" strokeWidth={2.5} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mt-4">
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
                className="p-5 rounded-2xl transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
                }}
              >
                <div className="font-display text-[22px] text-white leading-none">{b.name}</div>
                <div className="text-white/55 text-[11px] mt-3 line-clamp-1">{b.models}</div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF3E4F]">
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
