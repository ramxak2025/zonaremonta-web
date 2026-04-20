import Link from 'next/link';
import { ArrowRight, Check, Flame } from 'lucide-react';

interface Brand {
  name: string;
  models: string;
  engine: string;
}

const BRANDS: readonly Brand[] = [
  { name: 'Haval', models: 'Jolion, H6, Dargo, F7', engine: '1.5T / 2.0T GDIT' },
  { name: 'Chery', models: 'Tiggo 4/7/8 Pro, Arrizo', engine: '1.5 TCI / 2.0 TGDI' },
  { name: 'Geely', models: 'Coolray, Monjaro, Atlas Pro', engine: '1.5 TGDI / 2.0 TD' },
  { name: 'Omoda', models: 'C5, S5, S5 GT', engine: '1.5 TGDI' },
  { name: 'Exeed', models: 'LX, TX/TXL, VX', engine: '1.6 / 2.0 TGDI' },
  { name: 'Changan', models: 'CS35 Plus, CS55 Plus, UNI-K', engine: '1.4T / 1.5T / 2.0T' },
] as const;

export function ChineseCars() {
  return (
    <section className="section py-12 md:py-20">
      <div
        className="relative overflow-hidden rounded-[32px] p-6 md:p-12"
        style={{
          background:
            'linear-gradient(135deg, rgba(232,18,36,0.2) 0%, rgba(255,62,79,0.08) 40%, rgba(74,159,217,0.15) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset',
        }}
      >
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(232,18,36,0.25)' }}
        />

        <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em]"
              style={{
                background: 'rgba(232,18,36,0.2)',
                border: '1px solid rgba(232,18,36,0.4)',
                color: '#FF3E4F',
              }}
            >
              <Flame className="w-3.5 h-3.5" />
              Актуально 2026
            </span>
            <h2 className="h-1 mt-4 text-white">
              Ставим ГБО 4+ на{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF3E4F, #4A9FD9)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                китайские авто
              </span>{' '}
              с прямым впрыском
            </h2>
            <p className="lead mt-4">
              Haval, Chery, Geely, Omoda, Exeed, Changan — все современные китайские модели
              идут с турбомоторами и непосредственным впрыском (TGDI). Это значит: обычное
              4-е поколение НЕ подходит, нужно <span className="text-white font-semibold">4+</span>.
              Мы работаем именно с ними.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                'Защищаем бензиновые форсунки от закоксовывания',
                'Сохраняем ресурс турбомотора',
                'Не теряете заводскую гарантию (при регистрации в ГИБДД)',
                'Оборудование: Prins VSI-DI, BRC Sequent DI, Landi Renzo',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[14px] text-white/85">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-none" strokeWidth={2.5} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/calculator" className="btn btn-primary btn-lg">
                Рассчитать для моей модели
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#services" className="btn btn-ghost btn-lg">
                Подробнее о ГБО 4+
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {BRANDS.map((b) => (
              <div
                key={b.name}
                className="p-4 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.045)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset',
                }}
              >
                <div className="font-display text-xl text-white leading-none">{b.name}</div>
                <div className="text-white/55 text-[11px] mt-2 line-clamp-1">{b.models}</div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF3E4F]">
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
