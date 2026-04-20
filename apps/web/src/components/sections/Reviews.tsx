import { ArrowUpRight, Star } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';

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
      <div className="max-w-3xl mb-10 md:mb-14">
        <span className="chip"><span className="dot" />Отзывы</span>
        <h2 className="h-1 mt-3 text-white">Что говорят клиенты</h2>
        <p className="lead mt-4">
          Все отзывы прямо из Яндекс.Карт и 2GIS — без редактуры, хорошие и плохие.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr_1.2fr] gap-3 md:gap-4">
        <RatingCard
          source="Яндекс"
          rating={yRating}
          count={yCount}
          url={yUrl}
          bg="linear-gradient(135deg, #FFCC00 0%, #FF9500 100%)"
          shadow="rgba(255,149,0,0.4)"
        />
        <RatingCard
          source="2GIS"
          rating={gRating}
          count={gCount}
          url={gUrl}
          bg="linear-gradient(135deg, #5FBA47 0%, #3E8E28 100%)"
          shadow="rgba(62,142,40,0.4)"
        />

        <div className="grid gap-3">
          <Review
            rating={5}
            name="Магомед А."
            car="Lada Granta"
            text="Поставили ГБО 4-го, расход упал в 2 раза, езжу полгода — ни одной проблемы."
          />
          <Review
            rating={5}
            name="Руслан К."
            car="Haval Jolion 1.5T"
            text="Поставили 4+ на китайца с прямым впрыском, мощность сохранилась, экономия отличная."
          />
          <Review
            rating={4}
            name="Иса М."
            car="Kia Sportage"
            text="Цена немного выше средней по городу, но оборудование топовое. По гарантии починили за полчаса."
          />
        </div>
      </div>
    </section>
  );
}

function RatingCard({
  source, rating, count, url, bg, shadow,
}: { source: string; rating: number; count: number; url: string; bg: string; shadow: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden rounded-[28px] p-6 md:p-7 flex flex-col justify-between min-h-[200px] group transition-transform hover:-translate-y-1 active:scale-[0.98]"
      style={{ background: bg, boxShadow: `0 20px 50px -20px ${shadow}` }}
    >
      <div className="flex items-center justify-between text-black">
        <div className="font-display font-bold text-lg">{source}</div>
        <ArrowUpRight className="w-5 h-5 text-black/70 group-hover:rotate-12 transition-transform" />
      </div>
      <div className="text-black">
        <div
          className="font-display leading-none tracking-tight"
          style={{ fontSize: 'clamp(56px, 9vw, 80px)' }}
        >
          {rating.toFixed(1)}
        </div>
        <div className="flex gap-0.5 mt-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              width={14}
              height={14}
              strokeWidth={1.5}
              fill={i <= Math.floor(rating) ? 'currentColor' : 'none'}
            />
          ))}
        </div>
        <div className="text-xs font-semibold mt-2 opacity-80">{count} отзывов</div>
      </div>
    </a>
  );
}

function Review({
  rating, name, car, text,
}: { rating: number; name: string; car: string; text: string }) {
  return (
    <article className="card p-5">
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
      <p className="text-[13px] text-white/80 mt-3 leading-relaxed">{text}</p>
      <div className="text-xs text-white/45 mt-3">— {name}</div>
    </article>
  );
}
