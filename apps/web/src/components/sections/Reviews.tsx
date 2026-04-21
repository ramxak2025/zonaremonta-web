import { ArrowUpRight, Star } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';
import { YandexLogoIcon, TwoGisLogoIcon } from '../BrandIcons';

interface Props {
  settings: Required<PublicSettings>;
}

export function Reviews({ settings }: Props) {
  const yUrl = settings['reviews.yandex.url'].value;
  const yRating = settings['reviews.yandex.rating'].value;
  const yCount = settings['reviews.yandex.count'].value;
  const gUrl = settings['reviews.twogis.url'].value;
  const gRating = settings['reviews.twogis.rating'].value;
  const gCount = settings['reviews.twogis.count'].value;

  return (
    <section className="section section-y">
      <div className="section-head">
        <span className="eyebrow">Отзывы</span>
        <h2 className="h-1 text-white">Что пишут реальные клиенты</h2>
        <p className="lead">
          Все отзывы — с Яндекс.Карт и 2ГИС. Без редактуры. Откройте профиль, если хотите
          увидеть полную картину.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr_1.2fr] gap-3 md:gap-4">
        <RatingCard
          url={yUrl}
          rating={yRating}
          count={yCount}
          source="Яндекс"
          logo={<YandexLogoIcon className="w-10 h-10" />}
        />
        <RatingCard
          url={gUrl}
          rating={gRating}
          count={gCount}
          source="2ГИС"
          logo={<TwoGisLogoIcon className="w-10 h-10" />}
        />

        <div className="grid gap-3">
          <Review
            rating={5}
            name="Магомед А."
            car="Lada Granta"
            text="Поставил ГБО 4-го — расход упал в два раза. Езжу уже полгода, ни одного нарекания."
          />
          <Review
            rating={5}
            name="Руслан К."
            car="Haval Jolion 1.5T"
            text="Сделали 4+ на китайца с прямым впрыском. Мощность сохранилась, экономия заметна."
          />
          <Review
            rating={4}
            name="Иса М."
            car="Kia Sportage"
            text="Цена чуть выше средней по городу, но оборудование оригинальное. По гарантии помогли за полчаса."
          />
        </div>
      </div>
    </section>
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
      className="relative overflow-hidden rounded-[28px] p-6 md:p-7 flex flex-col justify-between min-h-[220px] group transition-transform hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logo}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
              Рейтинг
            </div>
            <div className="font-semibold text-white text-[15px] mt-0.5">{source}</div>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:rotate-12 transition-all" />
      </div>

      <div className="stack-3">
        <div className="flex items-baseline gap-2">
          <div
            className="font-display leading-none tracking-tight text-white"
            style={{ fontSize: 'clamp(56px, 9vw, 76px)' }}
          >
            {rating.toFixed(1)}
          </div>
          <span className="text-[13px] text-white/40">/ 5</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                width={14}
                height={14}
                strokeWidth={1.2}
                fill={i <= Math.floor(rating) ? '#FFCC00' : 'none'}
                className={i <= Math.floor(rating) ? 'text-[#FFCC00]' : 'text-white/25'}
              />
            ))}
          </div>
          <span className="text-[12px] text-white/60">{count} отзывов</span>
        </div>
      </div>
    </a>
  );
}

function Review({
  rating, name, car, text,
}: { rating: number; name: string; car: string; text: string }) {
  return (
    <article className="card p-5 md:p-6 stack-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              width={13}
              height={13}
              strokeWidth={1.5}
              fill={i <= rating ? '#FFCC00' : 'none'}
              className={i <= rating ? 'text-[#FFCC00]' : 'text-white/20'}
            />
          ))}
        </div>
        <span className="text-xs text-white/45">{car}</span>
      </div>
      <p className="text-[14px] text-white/80 leading-relaxed">{text}</p>
      <div className="text-xs text-white/45">— {name}</div>
    </article>
  );
}
