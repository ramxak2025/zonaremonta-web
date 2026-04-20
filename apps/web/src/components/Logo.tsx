import { HexIcon } from './HexIcon';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** horizontal — ЗОНА [hex] РЕМОНТА в одну строку; stacked — в две */
  layout?: 'horizontal' | 'stacked' | 'mark-only';
  className?: string;
}

const SIZE_MAP = {
  sm: { text: 'text-[13px]', hex: 14, gap: 'gap-1.5', bar: 'h-[2px]' },
  md: { text: 'text-[17px]', hex: 18, gap: 'gap-2', bar: 'h-[2px]' },
  lg: { text: 'text-[24px]', hex: 26, gap: 'gap-2.5', bar: 'h-[3px]' },
  xl: { text: 'text-[40px] sm:text-[52px]', hex: 52, gap: 'gap-4', bar: 'h-[4px]' },
} as const;

/**
 * Логотип бренда «Зона Ремонта».
 *  ЗОНА ⬡ РЕМОНТА  — буква О заменена фирменной гайкой.
 *  Красная разделительная черта под верхним рядом.
 */
export function Logo({ size = 'md', layout = 'horizontal', className = '' }: Props) {
  const s = SIZE_MAP[size];

  if (layout === 'mark-only') {
    return <HexIcon size={s.hex} className={`text-white ${className}`} />;
  }

  if (layout === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <span
          className={`font-display font-bold tracking-tight leading-none inline-flex items-center ${s.gap} ${s.text}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          <span>З</span>
          <HexIcon size={s.hex} className="text-current translate-y-[0.05em]" />
          <span>НА</span>
        </span>
        <span className={`w-full ${s.bar} bg-primary my-1 rounded-full`} />
        <span
          className={`font-display font-bold tracking-wider leading-none ${s.text}`}
          style={{ letterSpacing: '0.04em' }}
        >
          РЕМОНТА
        </span>
      </div>
    );
  }

  // horizontal
  return (
    <span
      className={`inline-flex items-center font-display font-bold tracking-tight leading-none ${s.gap} ${s.text} ${className}`}
      style={{ letterSpacing: '-0.01em' }}
    >
      <span className="inline-flex items-center">
        <span>З</span>
        <HexIcon size={s.hex} className="text-current translate-y-[0.05em] mx-0.5" />
        <span>НА</span>
      </span>
      <span
        className={`${s.bar} w-5 bg-primary rounded-full`}
        style={{ boxShadow: '0 0 8px rgba(232,18,36,0.6)' }}
      />
      <span className="tracking-wider" style={{ letterSpacing: '0.03em' }}>
        РЕМОНТА
      </span>
    </span>
  );
}
