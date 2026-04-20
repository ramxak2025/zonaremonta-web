import { HexIcon } from './HexIcon';

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'stacked' | 'mark-only';
  className?: string;
}

/**
 * Размеры подобраны под точное воспроизведение оригинального лого:
 * верхняя строка ЗО⬡НА — гайка 110% высоты букв (визуально чуть больше "О"),
 * красная полоса, нижняя строка РЕМОНТА со spread-трекингом.
 */
const SIZE_MAP = {
  xs: { top: 15, hex: 17, gap: 1, bar: 2, bottom: 11, spread: 0.22, halfGap: 2 },
  sm: { top: 19, hex: 21, gap: 1.5, bar: 2.5, bottom: 14, spread: 0.22, halfGap: 3 },
  md: { top: 24, hex: 26, gap: 2, bar: 3, bottom: 17, spread: 0.22, halfGap: 4 },
  lg: { top: 34, hex: 37, gap: 2, bar: 4, bottom: 24, spread: 0.22, halfGap: 5 },
  xl: { top: 54, hex: 58, gap: 3, bar: 5, bottom: 38, spread: 0.22, halfGap: 8 },
} as const;

export function Logo({ size = 'md', layout = 'stacked', className = '' }: Props) {
  const s = SIZE_MAP[size];

  if (layout === 'mark-only') {
    return <HexIcon size={s.hex * 1.4} className={`text-white ${className}`} />;
  }

  return (
    <span
      className={`inline-flex flex-col items-center leading-none select-none text-white ${className}`}
      aria-label="Зона Ремонта"
    >
      {/* Верхняя строка: ЗО⬡НА — гайка вместо буквы О */}
      <span
        className="font-display font-bold inline-flex items-center"
        style={{
          fontSize: `${s.top}px`,
          letterSpacing: '-0.02em',
        }}
      >
        <span>З</span>
        <HexIcon
          size={s.hex}
          className="text-white"
          style={{
            marginLeft: `${s.gap}px`,
            marginRight: `${s.gap}px`,
            transform: 'translateY(4%)',
          }}
        />
        <span>Н</span>
        <span style={{ marginLeft: `${s.halfGap}px` }}>А</span>
      </span>

      {/* Красная фирменная полоса-разделитель */}
      <span
        aria-hidden
        className="block w-full rounded-full"
        style={{
          height: `${s.bar}px`,
          marginTop: '3px',
          marginBottom: '3px',
          background: 'linear-gradient(90deg, #B40E1C 0%, #E81224 50%, #B40E1C 100%)',
          boxShadow: '0 0 10px rgba(232, 18, 36, 0.6)',
        }}
      />

      {/* Нижняя строка */}
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
