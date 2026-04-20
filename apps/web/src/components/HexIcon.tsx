import { forwardRef } from 'react';

interface Props extends React.SVGProps<SVGSVGElement> {
  filled?: boolean;
  size?: number;
}

/** Фирменный символ: шестигранная гайка с круглым отверстием в центре */
export const HexIcon = forwardRef<SVGSVGElement, Props>(function HexIcon(
  { filled = true, size = 24, className, ...rest },
  ref,
) {
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
      <defs>
        <mask id={`hex-hole-${size}`}>
          <rect width="100" height="100" fill="white" />
          <circle cx="50" cy="50" r="18" fill="black" />
        </mask>
      </defs>
      <path
        d="M50 4 L91 27 L91 73 L50 96 L9 73 L9 27 Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={filled ? 0 : 6}
        strokeLinejoin="round"
        mask={filled ? `url(#hex-hole-${size})` : undefined}
      />
      {!filled && <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth={6} fill="none" />}
    </svg>
  );
});
