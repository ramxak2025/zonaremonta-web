import { Check } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getContactLinks } from '@/lib/site';

interface Kit {
  id: string;
  badge?: string;
  title: string;
  type: string;
  forWho: string;
  brands: string;
  priceFrom: number;
  features: readonly string[];
  featured?: boolean;
}

const KITS: readonly Kit[] = [
  {
    id: 'i4', badge: '4', title: 'На 4 цилиндра', type: 'Распределённый впрыск (MPI)',
    forWho: 'Lada, Toyota, Hyundai, Kia, VW и большинство массовых авто 2005+ года.',
    brands: 'Lovato · BRC · Digitronic · KME', priceFrom: 38000,
    features: ['4 газовые форсунки', 'Редуктор с электроклапаном', 'ЭБУ с картами расхода', 'Гарантия 1 год'],
  },
  {
    id: 'i6', badge: '6', title: 'На 6 цилиндров', type: 'Распределённый впрыск (MPI)',
    forWho: 'V6 и L6: Toyota Camry V6, BMW, Hyundai Grandeur, премиум-седаны.',
    brands: 'Lovato · BRC · Digitronic', priceFrom: 48000,
    features: ['6 газовых форсунок', 'Усиленный редуктор', 'ЭБУ под 6-цил.', 'Гарантия 1 год'],
  },
  {
    id: 'v8', badge: '8', title: 'На V8', type: 'Распределённый впрыск (MPI)',
    forWho: 'Внедорожники и пикапы: Land Cruiser 200, Lexus LX, Ford F-150, GMC.',
    brands: 'Lovato · BRC', priceFrom: 65000,
    features: ['8 газовых форсунок', 'Два редуктора', 'Расширенный ЭБУ', 'Баллон 90–120 л'],
  },
  {
    id: 'gdi', badge: 'DI', title: 'На прямой впрыск', type: 'GDI · FSI · TSI · D-4S',
    forWho: 'Современные турбомоторы: VW TSI, Mercedes CGI, Kia GDI, Mazda SkyActiv, китайские TGDI.',
    brands: 'Prins VSI-DI · OMVL DREAM', priceFrom: 95000,
    features: ['Работа с впрыском в цилиндр', 'Защита бензиновых форсунок', 'Адаптивное управление', 'Гарантия 1 год'],
    featured: true,
  },
  {
    id: 'combi', badge: 'DUAL', title: 'На комбинированный впрыск', type: 'GDI + Port Injection',
    forWho: 'Toyota D-4S (Camry, RAV4, Land Cruiser Prado), Volvo VEA, новые Audi TFSI.',
    brands: 'Prins VSI-DI · OMVL DREAM XXI', priceFrom: 110000,
    features: ['Работа с двумя системами', 'Автопереключение режимов', 'Сохранение прошивок', 'Гарантия 1 год'],
    featured: true,
  },
];

export function ServicesGrid() {
  const l = getContactLinks();

  return (
    <Section id="services">
      <SectionHeader
        eyebrow="Услуги"
        title="Комплекты ГБО под любой двигатель"
        lead="Ставим на распределённый впрыск (4/6/8 цилиндров), на прямой и на комбинированный впрыск. На прямой и комбинированный — оборудование Prins и OMVL."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {KITS.map((k) => (
          <article
            key={k.id}
            className="card flex flex-col gap-5"
            style={
              k.featured
                ? {
                    background: 'linear-gradient(180deg, rgba(232,18,36,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                    borderColor: 'rgba(232,18,36,0.25)',
                  }
                : undefined
            }
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="font-display font-bold leading-none tracking-tight"
                style={{
                  fontSize: k.badge && k.badge.length === 1 ? 'clamp(40px, 8vw, 56px)' : 'clamp(22px, 3vw, 28px)',
                  background: 'linear-gradient(135deg, #FF3E4F 0%, #E81224 60%, #4A9FD9 140%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  paddingBottom: '0.06em',
                }}
              >
                {k.badge}
              </span>
              {k.featured && (
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(232, 18, 36, 0.15)',
                    color: '#FF3E4F',
                    border: '1px solid rgba(232, 18, 36, 0.3)',
                  }}
                >
                  Флагман
                </span>
              )}
            </div>

            <div>
              <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[18px] md:text-[20px] leading-tight">
                {k.title}
              </h3>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                {k.type}
              </div>
            </div>

            <p className="text-[13px] text-white/70 leading-relaxed text-break">{k.forWho}</p>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-1.5">
                Оборудование
              </div>
              <div className="text-[13px] text-white/85 text-break">{k.brands}</div>
            </div>

            <ul className="flex flex-col gap-2">
              {k.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-white/75">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                  <span className="text-break">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                  Под ключ от
                </div>
                <div className="font-display font-bold text-white text-[22px] md:text-[26px] mt-1.5 leading-none">
                  {k.priceFrom.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <a href={l.phoneHref} className="btn btn-primary btn-sm flex-shrink-0">
                Записаться
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
