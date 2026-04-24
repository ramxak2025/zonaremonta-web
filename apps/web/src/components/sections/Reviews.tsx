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

      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <RatingCard
            url={yUrl}
            rating={yRating}
            count={yCount}
            source="Яндекс"
            logo={<YandexLogoIcon className="w-9 h-9" />}
          />
          <RatingCard
            url={gUrl}
            rating={gRating}
            count={gCount}
            source="2ГИС"
            logo={<TwoGisLogoIcon className="w-9 h-9" />}
          />
        </div>

        <div className="grid gap-3">
          <Review
            rating={5}
            name="Магомед А."
            car="Lada Granta"
            text="Поставил ГБО — расход упал в два раза. Езжу уже полгода, ни одного нарекания."
          />
          <Review
            rating={5}
            name="Руслан К."
            car="Haval Jolion 1.5T"
            text="Сделали на китайца с прямым впрыском (Prins). Мощность сохранилась, экономия заметна."
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
      className="card flex flex-col justify-between min-h-[180px] md:min-h-[200px] gap-4 group hover:bg-white/[0.06] transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {logo}
          <div className="min-w-0">
            <div className="eyebrow eyebrow-mute">Рейтинг</div>
            <div className="font-semibold text-white text-[14px] mt-1 clamp-1">{source}</div>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:rotate-12 transition-all flex-shrink-0" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="num-xl text-white">{rating.toFixed(1)}</span>
          <span className="text-[12px] text-white/40">/ 5</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                width={12}
                height={12}
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

function Review({
  rating, name, car, text,
}: { rating: number; name: string; car: string; text: string }) {
  return (
    <article className="card flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-0.5 flex-shrink-0">
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
        <span className="text-[12px] text-white/45 clamp-1 min-w-0">{car}</span>
      </div>
      <p className="text-[14px] text-white/80 leading-relaxed text-break">{text}</p>
      <div className="text-[12px] text-white/45">— {name}</div>
    </article>
  );
}
