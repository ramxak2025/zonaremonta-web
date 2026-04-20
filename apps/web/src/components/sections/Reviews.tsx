import { ArrowUpRight, Star } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';
import { YandexMapsIcon } from '../BrandIcons';

interface Props {
  settings: Required<PublicSettings>;
}

export function Reviews({ settings }: Props) {
  const url = settings['reviews.yandex.url'].value;
  const rating = settings['reviews.yandex.rating'].value;
  const count = settings['reviews.yandex.count'].value;

  return (
    <section className="section section-y">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
        {/* Большая карточка Яндекс-рейтинга */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden rounded-[28px] p-6 md:p-10 flex flex-col justify-between min-h-[280px] group transition-transform hover:-translate-y-1"
          style={{
            background: 'linear-gradient(135deg, #FFCC00 0%, #FF9500 100%)',
            boxShadow: '0 20px 60px -20px rgba(255,149,0,0.45)',
          }}
        >
          <div className="flex items-center justify-between text-black">
            <div className="flex items-center gap-3">
              <YandexMapsIcon className="w-8 h-8" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Яндекс.Карты
                </div>
                <div className="font-semibold">Рейтинг и отзывы</div>
              </div>
            </div>
            <ArrowUpRight className="w-6 h-6 text-black/70 group-hover:rotate-12 transition-transform" />
          </div>

          <div className="text-black">
            <div className="flex items-baseline gap-4">
              <div
                className="font-display leading-none tracking-tight"
                style={{ fontSize: 'clamp(72px, 14vw, 120px)' }}
              >
                {rating.toFixed(1)}
              </div>
              <div className="pb-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      width={18}
                      height={18}
                      strokeWidth={1.5}
                      fill={i <= Math.floor(rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <div className="text-sm font-bold mt-1 opacity-80">{count} отзывов</div>
              </div>
            </div>
            <p className="text-sm font-medium text-black/80 mt-4">
              Хорошие и плохие — всё видно на Яндексе без цензуры.
            </p>
          </div>
        </a>

        {/* Правая колонка: 3 отзыва */}
        <div className="grid gap-3">
          <Review
            rating={5}
            name="Магомед А."
            car="Lada Granta"
            text="Поставил ГБО 4-го поколения. Расход упал в 2 раза, езжу уже полгода — ни одной проблемы. Мастер объяснил всё по-человечески, без разводов."
          />
          <Review
            rating={5}
            name="Руслан К."
            car="Toyota Camry"
            text="Диагностику сделали бесплатно, показали состояние двигателя. Установка заняла день, всё чётко по регламенту."
          />
          <Review
            rating={4}
            name="Иса М."
            car="Kia Sportage"
            text="Цена чуть выше, чем в среднем по городу — но качество видно сразу. По гарантии один раз приезжал, починили за 30 минут."
          />
        </div>
      </div>

      <div className="text-center mt-10">
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          <YandexMapsIcon className="w-4 h-4 text-[#FFCC00]" />
          Все отзывы на Яндексе
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

function Review({
  rating, name, car, text,
}: { rating: number; name: string; car: string; text: string }) {
  return (
    <article className="card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              width={14}
              height={14}
              strokeWidth={1.5}
              fill={i <= rating ? '#FFCC00' : 'none'}
              className={i <= rating ? 'text-[#FFCC00]' : 'text-white/20'}
            />
          ))}
        </div>
        <span className="text-xs text-white/40">{car}</span>
      </div>
      <p className="text-[14px] text-white/80 mt-3 leading-relaxed">{text}</p>
      <div className="text-xs text-white/45 mt-3">— {name}</div>
    </article>
  );
}
