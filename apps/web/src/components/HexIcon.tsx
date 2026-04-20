import { forwardRef } from 'react';

interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  filled?: boolean;
  size?: number;
}

/**
 * Фирменный символ бренда — шестигранная гайка с круглым отверстием.
 * Рисуется одним path с `evenodd` fill-rule — без mask'ов, чётко на любом размере.
 */
export const HexIcon = forwardRef<SVGSVGElement, Props>(function HexIcon(
  { filled = true, size = 24, className, ...rest },
  ref,
) {
  // Внешний hex — крупный, отверстие ≈ 38% диаметра (как на оригинале лого).
  const hexPath = 'M50 4 L91 27 L91 73 L50 96 L9 73 L9 27 Z';
  const holeRadius = 19;

  if (filled) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        aria-hidden
        {...rest}
      >
        <path
          d={`${hexPath} M50 ${50 - holeRadius} a${holeRadius} ${holeRadius} 0 1 0 0.01 0 Z`}
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d={hexPath}
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <circle cx={50} cy={50} r={holeRadius} stroke="currentColor" strokeWidth={5} fill="none" />
    </svg>
  );
});
