import Link from 'next/link';
import { Wrench, Info, MapPin, ImageIcon, ArrowRight, ExternalLink } from 'lucide-react';
import { services, about, works } from '@/lib/content';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await requireAdmin('/admin');
  const [s, a, w] = await Promise.all([services.read(), about.read(), works.read()]);

  const cards = [
    {
      href: '/admin/services',
      icon: Wrench,
      title: 'Услуги и цены',
      stat: `${s.installKits.length} комплектов · ${s.repairServices.length} услуг ремонта`,
      hint: 'Установка ГБО (4/6/8 цил, DI), диагностика и ремонт',
    },
    {
      href: '/admin/about',
      icon: Info,
      title: 'О сервисе',
      stat: `С ${a.foundedYear} года · ${a.totalInstalls.toLocaleString('ru-RU')} установок`,
      hint: 'История, философия, преимущества',
    },
    {
      href: '/admin/contact',
      icon: MapPin,
      title: 'Контакты',
      stat: 'Телефон, адрес, часы работы, координаты',
      hint: 'Эти данные показываются в шапке, футере, секции «Контакты»',
    },
    {
      href: '/admin/works',
      icon: ImageIcon,
      title: 'Наши работы',
      stat: `${w.length} работ`,
      hint: 'Загрузка фото, описание установки, цены',
    },
  ];

  return (
    <div>
      <div className="mb-8 md:mb-10">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F] mb-2">
          Админка
        </div>
        <h1 className="font-display font-bold uppercase tracking-tight text-white text-[28px] md:text-[36px] leading-tight">
          Управление сайтом
        </h1>
        <p className="text-[14px] text-white/60 mt-3 max-w-prose">
          Изменения сохраняются в файлы в <code className="text-white/80">/content</code>{' '}
          и автоматически применяются на публичных страницах через ISR.
          Загруженные фото конвертируются в AVIF/WebP/JPG в трёх размерах для
          максимальной скорости.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-2xl p-5 md:p-6 flex flex-col gap-4 transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(20,20,26,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-11 h-11 rounded-xl grid place-items-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,18,36,0.22), rgba(232,18,36,0.05))',
                    border: '1px solid rgba(232,18,36,0.3)',
                  }}
                >
                  <Icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
                </span>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[18px] md:text-[20px]">
                  {c.title}
                </h3>
                <div className="text-[12px] text-white/55 mt-2">{c.stat}</div>
                <p className="text-[13px] text-white/65 mt-3 leading-relaxed">{c.hint}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div
        className="rounded-2xl p-5 md:p-6 flex items-start gap-4"
        style={{ background: 'rgba(74,159,217,0.06)', border: '1px solid rgba(74,159,217,0.2)' }}
      >
        <div className="flex-1">
          <div className="font-semibold text-white text-[14px]">
            Параметры загружаемых фото
          </div>
          <ul className="mt-2 text-[13px] text-white/70 space-y-1.5 leading-relaxed">
            <li>• Формат: JPG, PNG, WebP, HEIC, AVIF (iPhone тоже подходит)</li>
            <li>• Размер: до 12 МБ</li>
            <li>• Минимум: 1200×800 px (для cover работ — 4:3)</li>
            <li>• Авто-обработка: <b className="text-white">AVIF + WebP + JPG</b> в трёх размерах (600 / 1200 / 2000 px)</li>
          </ul>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/70 hover:text-white whitespace-nowrap"
        >
          На сайт
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
