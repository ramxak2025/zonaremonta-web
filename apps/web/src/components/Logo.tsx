import { HexIcon } from './HexIcon';

interface Props {
  /** размеры подобраны под точное воспроизведение оригинала */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** stacked — точно как на фото (двустрочный); mark-only — только hex */
  layout?: 'stacked' | 'mark-only';
  className?: string;
}

const SIZE_MAP = {
  xs: { top: 13, hex: 11, gap: 0.5, bar: 2, bottom: 9, spread: 0.18 },
  sm: { top: 16, hex: 14, gap: 1, bar: 2, bottom: 11, spread: 0.2 },
  md: { top: 20, hex: 17, gap: 1, bar: 2.5, bottom: 14, spread: 0.2 },
  lg: { top: 32, hex: 28, gap: 2, bar: 3, bottom: 22, spread: 0.22 },
  xl: { top: 56, hex: 48, gap: 3, bar: 4, bottom: 38, spread: 0.24 },
} as const;

/**
 * Фирменный логотип «Зона Ремонта».
 *  ЗО⬡А — верхняя строка с гайкой вместо буквы «О»
 *  ━━━━ — фирменная красная полоса
 *  РЕМОНТА — нижняя строка, trackING широкий
 */
export function Logo({ size = 'md', layout = 'stacked', className = '' }: Props) {
  const s = SIZE_MAP[size];

  if (layout === 'mark-only') {
    return <HexIcon size={s.hex * 1.5} className={`text-white ${className}`} />;
  }

  return (
    <span
      className={`inline-flex flex-col items-center leading-none select-none text-white ${className}`}
      aria-label="Зона Ремонта"
    >
      {/* верхняя строка: ЗО⬡А (гайка на месте О) */}
      <span
        className="font-display font-bold inline-flex items-center"
        style={{
          fontSize: `${s.top}px`,
          letterSpacing: '-0.02em',
          gap: `${s.gap}px`,
        }}
      >
        <span>З</span>
        <HexIcon
          size={s.hex}
          className="text-current"
          style={{ transform: 'translateY(6%)' }}
        />
        <span>Н</span>
        <span>А</span>
      </span>

      {/* красная полоса с свечением */}
      <span
        aria-hidden
        className="block w-full rounded-full"
        style={{
          height: `${s.bar}px`,
          background: 'linear-gradient(90deg, #B40E1C 0%, #E81224 50%, #B40E1C 100%)',
          marginTop: '3px',
          marginBottom: '3px',
          boxShadow: '0 0 10px rgba(232, 18, 36, 0.6)',
        }}
      />

      {/* нижняя строка */}
      <span
        className="font-display font-bold"
        style={{
          fontSize: `${s.bottom}px`,
          letterSpacing: `${s.spread}em`,
        }}
      >
        РЕМОНТА
      </span>
    </span>
  );
}
