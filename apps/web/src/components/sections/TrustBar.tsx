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
    <section
      className="border-y border-white/[0.05]"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(0,0,0,0.25) 100%)',
      }}
    >
      <div className="section py-10 md:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8 items-center">
          <a
            href={yUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-1 flex items-center gap-4 group"
          >
            <div className="flex-none transition-transform group-hover:scale-105">
              <YandexLogoIcon className="w-12 h-12" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[30px] text-white leading-none">
                  {yRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-white/40">/ 5</span>
              </div>
              <div className="text-[12px] text-white/60 mt-1.5">
                Яндекс · {yCount} отзывов
              </div>
            </div>
          </a>

          <a
            href={gUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-1 flex items-center gap-4 group"
          >
            <div className="flex-none transition-transform group-hover:scale-105">
              <TwoGisLogoIcon className="w-12 h-12" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[30px] text-white leading-none">
                  {gRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-white/40">/ 5</span>
              </div>
              <div className="text-[12px] text-white/60 mt-1.5">
                2ГИС · {gCount} отзывов
              </div>
            </div>
          </a>

          {STATS.map((s) => (
            <div key={s.label} className="col-span-2 lg:col-span-1 flex items-center gap-4">
              <div
                className="w-1 h-12 rounded-full flex-none"
                style={{
                  background:
                    'linear-gradient(180deg, #FF3E4F, rgba(232,18,36,0.12))',
                }}
              />
              <div>
                <div className="font-display text-[30px] text-white leading-none">{s.num}</div>
                <div className="text-[12px] text-white/60 mt-1.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
