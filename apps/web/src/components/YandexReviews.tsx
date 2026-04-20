'use client';
import { motion } from 'framer-motion';
import { Star, ArrowUpRight, Quote } from 'lucide-react';
import { YandexMapsIcon } from './BrandIcons';
import { HexIcon } from './HexIcon';
import { readSetting, type SettingsMap } from '@/lib/settings';

const ease = [0.22, 1, 0.36, 1] as const;

export function YandexReviews({ settings }: { settings: SettingsMap }) {
  const url = readSetting<string>(
    settings,
    'reviews.yandex.url',
    'https://yandex.ru/profile/130786711189?lang=ru',
  );
  const rating = Number(readSetting<number>(settings, 'reviews.yandex.rating', 4.6));
  const count = Number(readSetting<number>(settings, 'reviews.yandex.count', 87));

  return (
    <section className="section py-12 sm:py-20 relative">
      <div className="mb-6 sm:mb-10">
        <span className="chip"><span className="dot" />Отзывы</span>
        <h2 className="h-section mt-3 text-white">Что говорят клиенты</h2>
        <p className="text-white/65 mt-2 sm:mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
          Все отзывы — прямо из Яндекс.Карт, без редактуры. Хорошие и плохие — без цензуры.
        </p>
      </div>

      <div
        className="grid gap-2.5 sm:gap-4"
        style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
      >
        {/* Большая карточка: общий рейтинг + CTA */}
        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          whileHover={{ y: -4 }}
          className="col-span-6 lg:col-span-3 relative overflow-hidden rounded-[28px] p-6 sm:p-8 flex flex-col justify-between group"
          style={{
            background: 'linear-gradient(135deg, #FFCC00 0%, #FF9500 100%)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.35) inset, 0 20px 60px -20px rgba(255,149,0,0.45)',
          }}
        >
          <HexIcon size={320} filled={false} className="absolute -right-24 -top-20 text-black/10" />
          <div className="flex items-start justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl grid place-items-center bg-white/40 backdrop-blur-sm">
                <YandexMapsIcon className="w-7 h-7 text-black" />
              </div>
              <div className="text-black">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">
                  Яндекс.Карты
                </div>
                <div className="font-display text-xl">Профиль компании</div>
              </div>
            </div>
            <ArrowUpRight className="w-6 h-6 text-black/70 group-hover:rotate-12 transition-transform" />
          </div>

          <div className="relative mt-6 text-black">
            <div className="flex items-end gap-3">
              <div
                className="font-display leading-none tracking-tight"
                style={{ fontSize: 'clamp(56px, 14vw, 96px)' }}
              >
                {rating.toFixed(1)}
              </div>
              <div className="pb-2">
                <StarRow value={rating} />
                <div className="text-sm font-semibold mt-1 opacity-80">
                  {count} {pluralReviews(count)}
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm font-medium text-black/75">
              Нажмите, чтобы открыть все отзывы — и хорошие, и плохие.
            </div>
          </div>
        </motion.a>

        {/* Пример карточек — «живые» сниппеты для визуала. Реальные отзывы — по клику в Я.Картах */}
        <SnippetCard
          rating={5}
          text="Установили ГБО на Ладу за день, всё чётко. Расход упал в 2 раза, езжу уже полгода — ни одной проблемы."
          name="Магомед А."
          delay={0.1}
        />
        <SnippetCard
          rating={5}
          text="Диагностику сделали бесплатно, оборудование нашли сразу. Мастера реально разбираются."
          name="Руслан К."
          delay={0.15}
        />
        <SnippetCard
          rating={4}
          text="Цена чуть выше, чем в среднем по городу, но качество — честно — заметно лучше. Не пожалел."
          name="Иса М."
          delay={0.2}
        />
      </div>

      <div className="text-center mt-6 sm:mt-8">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-glass !h-12 text-sm"
        >
          <YandexMapsIcon className="w-5 h-5 text-[#FFCC00]" />
          Все отзывы на Яндексе
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

function SnippetCard({
  rating, text, name, delay,
}: { rating: number; text: string; name: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease }}
      className="col-span-6 sm:col-span-2 lg:col-span-1 liquid-glass relative overflow-hidden p-5 flex flex-col justify-between"
    >
      <Quote className="w-6 h-6 text-primary/50 absolute top-4 right-4" strokeWidth={2.4} />
      <StarRow value={rating} small />
      <p className="text-sm text-white/75 mt-3 leading-relaxed line-clamp-4">{text}</p>
      <div className="text-xs text-white/45 mt-3">— {name}</div>
    </motion.div>
  );
}

function StarRow({ value, small }: { value: number; small?: boolean }) {
  const size = small ? 14 : 18;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = value >= i;
        const half = !filled && value >= i - 0.5;
        return (
          <Star
            key={i}
            width={size}
            height={size}
            strokeWidth={1.5}
            fill={filled || half ? 'currentColor' : 'none'}
            className={filled || half ? 'text-[#FFCC00]' : 'text-white/25'}
          />
        );
      })}
    </div>
  );
}

function pluralReviews(n: number): string {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return 'отзывов';
  if (n1 > 1 && n1 < 5) return 'отзыва';
  if (n1 === 1) return 'отзыв';
  return 'отзывов';
}
