import { Star, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { YandexIcon, TwoGisIcon } from '@/components/ui/PhoneIcon';

const TEXT_REVIEWS = [
  { rating: 5, name: 'Магомед А.', car: 'Lada Granta',
    text: 'Поставил ГБО — расход упал в два раза. Езжу уже полгода, ни одного нарекания.' },
  { rating: 5, name: 'Руслан К.',  car: 'Haval Jolion 1.5T',
    text: 'Сделали Prins на турбомотор — мощность сохранилась, экономия заметна.' },
  { rating: 4, name: 'Иса М.',     car: 'Kia Sportage',
    text: 'Оборудование оригинальное, по гарантии помогли за полчаса. Рекомендую.' },
];

export function Reviews() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Отзывы"
        title="Что пишут реальные клиенты"
        lead="Все отзывы — с Яндекс.Карт и 2ГИС. Без редактуры. Откройте профиль, если хотите увидеть полную картину."
      />

      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <RatingCard
            url="https://yandex.ru/maps/?text=Зона%20ремонта%20Махачкала"
            source="Яндекс" rating={4.9} count={210}
            logo={<YandexIcon className="w-9 h-9" />}
          />
          <RatingCard
            url="https://2gis.ru/makhachkala"
            source="2ГИС" rating={5.0} count={85}
            logo={<TwoGisIcon className="w-9 h-9" />}
          />
        </div>

        <div className="grid gap-3">
          {TEXT_REVIEWS.map((r) => (
            <article key={r.name} className="card flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-0.5 flex-shrink-0">
                  {[1,2,3,4,5].map((i) => (
                    <Star
                      key={i}
                      width={14} height={14}
                      strokeWidth={1.5}
                      fill={i <= r.rating ? '#FFCC00' : 'none'}
                      className={i <= r.rating ? 'text-[#FFCC00]' : 'text-white/20'}
                    />
                  ))}
                </div>
                <span className="text-[12px] text-white/45 truncate">{r.car}</span>
              </div>
              <p className="text-[14px] text-white/80 leading-relaxed text-break">{r.text}</p>
              <div className="text-[12px] text-white/45">— {r.name}</div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

function RatingCard({
  url, rating, count, source, logo,
}: { url: string; rating: number; count: number; source: string; logo: React.ReactNode }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex flex-col justify-between min-h-[180px] gap-4 hover:bg-white/[0.06] transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {logo}
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
              Рейтинг
            </div>
            <div className="font-semibold text-white text-[14px] mt-1 truncate">{source}</div>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-white/40 flex-shrink-0" />
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-white tracking-tight" style={{ fontSize: 'clamp(36px, 5vw, 48px)', lineHeight: 1.1 }}>
            {rating.toFixed(1)}
          </span>
          <span className="text-[12px] text-white/40">/ 5</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((i) => (
              <Star
                key={i}
                width={12} height={12}
                strokeWidth={1.4}
                fill={i <= Math.floor(rating) ? '#FFCC00' : 'none'}
                className={i <= Math.floor(rating) ? 'text-[#FFCC00]' : 'text-white/25'}
              />
            ))}
          </div>
          <span className="text-[11px] text-white/55">{count} отзывов</span>
        </div>
      </div>
    </a>
  );
}
