import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';
import { getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, WhatsAppIcon } from '../BrandIcons';
import { HexIcon } from '../HexIcon';

interface Props {
  settings: Required<PublicSettings>;
}

export function Hero({ settings }: Props) {
  const l = getContactLinks();
  const title = settings['hero.title'].value;
  const subtitle = settings['hero.subtitle'].value;
  const ctaText = settings['hero.primaryCta'].value;
  const rating = settings['reviews.yandex.rating'].value;
  const reviews = settings['reviews.yandex.count'].value;

  return (
    <section className="relative overflow-hidden">
      {/* фон: один мягкий градиент, без шума */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(900px 560px at 80% -10%, rgba(232, 18, 36, 0.22), transparent 60%), radial-gradient(700px 500px at 0% 30%, rgba(74, 159, 217, 0.12), transparent 60%)',
        }}
      />
      <HexIcon
        size={520}
        filled={false}
        className="absolute -right-28 top-16 text-white/[0.03] pointer-events-none hidden md:block"
      />

      <div className="section section-y relative">
        <div className="max-w-4xl">
          <span className="chip mb-6">
            <span className="dot" />
            ГБО 4-е поколение · 4+ прямой впрыск · Махачкала
          </span>

          <h1 className="h-display text-white">
            {title.split('\n').map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? <span className="text-gradient">{line}</span> : line}
              </span>
            ))}
          </h1>

          <p className="lead mt-6 max-w-2xl">{subtitle}</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={l.phoneHref} className="btn btn-primary btn-lg">
              <PhoneFilledIcon className="w-5 h-5" />
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={l.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg text-white"
              style={{
                background: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
                boxShadow:
                  '0 1px 0 rgba(255,255,255,0.25) inset, 0 8px 22px -6px rgba(37,211,102,0.5)',
              }}
            >
              <WhatsAppIcon className="w-5 h-5" />
              Написать в WhatsApp
            </a>
            <Link href="#calc" className="btn btn-ghost btn-lg">
              Рассчитать экономию
            </Link>
          </div>

          {/* Trust mini-row — сразу в первом экране для conversion uplift */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    width={16}
                    height={16}
                    strokeWidth={1.5}
                    fill={i <= Math.floor(rating) ? '#FFCC00' : 'none'}
                    className="text-[#FFCC00]"
                  />
                ))}
              </div>
              <span className="text-white font-semibold">{rating.toFixed(1)}</span>
              <span>· {reviews} отзывов на Яндексе</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <span>Гарантия 1 год на работы</span>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <span>Регистрация в ГИБДД</span>
          </div>
        </div>
      </div>
    </section>
  );
}
