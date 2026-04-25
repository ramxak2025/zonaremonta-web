import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Шапка секции: eyebrow + h2 + lead.
 * Использует ТОЛЬКО Tailwind utilities (mb-*) — гарантированный приоритет.
 * Никаких flex/gap, никаких CSS-классов с margin.
 */
export function SectionHeader({ eyebrow, title, lead, align = 'left', className = '' }: Props) {
  const alignCls = align === 'center' ? 'mx-auto text-center' : '';
  return (
    <div className={`max-w-3xl mb-10 md:mb-12 ${alignCls} ${className}`}>
      {eyebrow ? (
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F]">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-display font-bold uppercase tracking-tight text-white text-[26px] sm:text-[30px] md:text-[36px] leading-tight mb-4 md:mb-5">
        {title}
      </h2>
      {lead ? (
        <p className={`text-[15px] md:text-[17px] leading-relaxed text-white/70 max-w-[65ch] ${
          align === 'center' ? 'mx-auto' : ''
        }`}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
