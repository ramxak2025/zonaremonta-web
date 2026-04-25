interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Логотип «Зона Ремонта» — текстовый.
 * Простая верстка: красная плашка «ZR» + надпись «Зона Ремонта».
 */
export function Logo({ size = 'md', className = '' }: Props) {
  const dim = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  const text = size === 'sm' ? 'text-[13px]' : size === 'lg' ? 'text-[16px]' : 'text-[14px]';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="grid place-items-center font-display font-bold text-white rounded-lg"
        style={{
          width: dim,
          height: dim,
          background: 'linear-gradient(135deg, #FF3E4F 0%, #B40E1C 100%)',
          fontSize: Math.round(dim * 0.42),
          letterSpacing: '-0.04em',
        }}
      >
        ZR
      </span>
      <span className={`font-display font-bold uppercase tracking-tight text-white leading-none ${text}`}>
        Зона ремонта
      </span>
    </div>
  );
}
