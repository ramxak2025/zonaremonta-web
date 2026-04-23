import type { PublicSettings } from '@05auto/shared';
import { YandexLogoIcon, TwoGisLogoIcon } from '../BrandIcons';

interface Props {
  settings: Required<PublicSettings>;
}

const STATS = [
  { num: '2 500+', label: 'Установок ГБО' },
  { num: '8 лет', label: 'На рынке' },
  { num: '1 день', label: 'Срок работ' },
] as const;

export function TrustBar({ settings }: Props) {
  const yRating = settings['reviews.yandex.rating'].value;
  const yCount = settings['reviews.yandex.count'].value;
  const yUrl = settings['reviews.yandex.url'].value;
  const gRating = settings['reviews.twogis.rating'].value;
  const gCount = settings['reviews.twogis.count'].value;
  const gUrl = settings['reviews.twogis.url'].value;

  return (
    <section className="border-y border-white/[0.05] bg-black/20">
      <div className="section py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-6 md:gap-x-6 items-center">
          {/* Яндекс */}
          <a
            href={yUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="flex-shrink-0 transition-transform group-hover:scale-105">
              <YandexLogoIcon className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[24px] md:text-[28px] text-white leading-none">
                  {yRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-white/40">/ 5</span>
              </div>
              <div className="text-[12px] text-white/60 mt-1 clamp-1">
                Яндекс · {yCount} отзывов
              </div>
            </div>
          </a>

          {/* 2ГИС */}
          <a
            href={gUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="flex-shrink-0 transition-transform group-hover:scale-105">
              <TwoGisLogoIcon className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[24px] md:text-[28px] text-white leading-none">
                  {gRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-white/40">/ 5</span>
              </div>
              <div className="text-[12px] text-white/60 mt-1 clamp-1">
                2ГИС · {gCount} отзывов
              </div>
            </div>
          </a>

          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3 min-w-0">
              <div
                className="w-1 h-10 md:h-12 rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(180deg, #FF3E4F, rgba(232,18,36,0.12))' }}
              />
              <div className="min-w-0">
                <div className="font-display text-[24px] md:text-[28px] text-white leading-none">
                  {s.num}
                </div>
                <div className="text-[12px] text-white/60 mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
